---
theme: seriph
background: https://cover.sli.dev
title: HTTP/2·HTTP/3 协议优化
info: |
  HTTP/2 与 HTTP/3 协议优化：多路复用 · HPACK / QPACK · Server Push 弃用 · QUIC · 0-RTT · 连接迁移

  Learn more at https://www.rfc-editor.org/rfc/rfc9113
drawings:
  persist: false
transition: slide-left
mdc: true
---

# HTTP/2·HTTP/3 协议优化

多路复用 · HPACK / QPACK · QUIC · 0-RTT · 连接迁移

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
HTTP/2 = RFC 9113（2022-06）；HTTP/3 = RFC 9114 + QUIC（RFC 9000）。
-->

---
transition: fade-out
---

# 什么是 HTTP/2·HTTP/3

HTTP 语义在**传输层**的两次重大升级

- **HTTP/2（RFC 9113）**：单 TCP 连接 + 二进制分帧 + 多路复用 + HPACK
- **HTTP/3（RFC 9114）**：传输层换成 **QUIC（UDP）**，TLS 1.3 内嵌
- **语义不变**：HTTP 方法、状态码、头字段完全兼容
- **传输层重写**：帧格式、连接管理、头部编码全部不同
- **HTTP/2 仍存在 TCP 队头阻塞**：一个包丢，全部 stream 卡住
- **HTTP/3 根除传输层 HOL**：QUIC stream 独立重传

> h2 解决应用层 HOL；h3 进一步解决传输层 HOL。

<!--
强调 h2 ≠ h3：前者单 TCP 多 stream，后者换 QUIC 走 UDP。
-->

---

# HTTP/1.1 的痛点

理解 h2 / h3 优化价值，先看 h1 的两大顽疾

- **应用层队头阻塞**：一条连接同时只能跑一个请求，前一个未完成后续排队
- **每 origin ~6 条连接**：浏览器用多连接缓解，但握手开销倍增
- **域名分片**：static1 / static2 子域绕开 6 连接上限，每分片额外 DNS+TCP+TLS
- **重复握手**：每条 TCP 都要 DNS + TCP 三次握手 + TLS 握手（3 RTT）
- **未压缩文本头**：Cookie / User-Agent 在每个请求里原样重传

> h1 时代页面动辄开 12-18 条连接，握手往返开销巨大。

<!--
这些痛点是 h2 / h3 设计的根本动因。
-->

---

# 三代协议对比

| 维度 | HTTP/1.1 | HTTP/2 | HTTP/3 |
|------|------|------|------|
| **传输层** | TCP | TCP | **QUIC (UDP)** |
| **加密** | 可选 | 必须 TLS | **TLS 1.3 内嵌** |
| **多路复用** | 无 | **有** | **有** |
| **传输层 HOL** | 有 | 仍有 | **解决** |
| **重连握手** | 3 RTT | 3 RTT | **0-RTT** |
| **连接迁移** | 否 | 否 | **支持** |
| **RFC** | 9110 | **9113** | **9114** |

<!--
h2 是 TCP 上多 stream；h3 把传输层整个换成 QUIC。
-->

---

# HTTP/2 二进制分帧

每个帧 9 字节帧头 + payload

```text
+-----------------------------------------------+
|                Length (24)                     |
+---------------+---------------+
|   Type (8)    |   Flags (8)   |
+-+-------------+---------------+---------------+
|R|            Stream ID (31)                   |
+=+=============================================+
|              Frame Payload (0...)              |
+-----------------------------------------------+
```

**10 种帧类型**：DATA / HEADERS / SETTINGS / WINDOW_UPDATE / GOAWAY / PUSH_PROMISE 等

- **Stream**：一条 TCP 连接并行 2^31-1 个并发 stream
- **流量控制**：连接级 + stream 级双层
- **客户端 stream 奇数 ID**，服务端 Push 偶数（已弃用）

<!--
二进制分帧让一条 TCP 上跑上百条 stream 成为可能。
-->

---
layout: two-cols
---

# HTTP/2 多路复用

**核心收益**

- 一条 TCP 连接并行上百条 stream
- 慢请求不再堵住后续
- 应用层队头阻塞消除
- 单连接省握手、省内存

**关键字段**

- Stream ID（31 bit）
- 客户端奇数 / 服务端偶数
- RST_STREAM 立即终止
- WINDOW_UPDATE 双层流量控制

::right::

# 域名分片失效

**h1 时代**

- 每 origin 6 条连接
- static1 / static2 子域绕开上限
- 每分片额外 DNS+TCP+TLS

**h2 时代**

- 单连接足够
- 分片变成纯开销
- 每分片独立拥塞控制
- 反而拖慢整体

> **移除域名分片** —— Cloudflare、MDN 共识。

<!--
h2 多路复用让 h1 时代的域名分片彻底失效。
-->

---

# HPACK 头部压缩

RFC 7541 三件套，把 Cookie / User-Agent 压缩到几字节

**① 静态表（61 项预定义首部）**

- 索引 2 = `:method GET`
- 索引 4 = `:path /`
- 索引 8 = `:status 200`

**② 动态表（FIFO 队列）**

- 受 `SETTINGS_HEADER_TABLE_SIZE` 控制，默认 4096 字节
- 首次完整 Cookie 进表，后续请求只引索引

**③ 静态 Huffman 编码（非自适应）**

- **抗 CRIME 类压缩预言机攻击**
- 绝不要给 HTTP 头外加 gzip

<!--
CRIME（2012）利用了 SPDY 头部压缩的自适应性，HPACK 静态 Huffman 是安全替代。
-->

---
layout: two-cols
---

# Server Push 已弃用

**事实性废弃**

- Chrome 106（2022-09）默认禁用
- 采用率 1.25% → **0.7%**
- Firefox / Safari 跟进
- HTTP/3 多数未实现

**问题**

- 重复推送已缓存资源
- Push Promise 与缓存撞车
- 服务端无法可靠知缓存

::right::

# 103 Early Hints

**RFC 8297 替代方案**

- 服务端先发 103 状态码
- 浏览器决定是否加载
- 缓存命中即跳过

```text
HTTP/1.1 103 Early Hints
Link: </style.css>; rel=preload
```

> **新项目不要再用 Push**，改用 103 + `<link rel="preload">`。

<!--
Server Push 已事实废弃，迁移到 103 Early Hints + preload。
-->

---

# 流优先级 RFC 9218

旧方案（RFC 7540 PRIORITY 帧）已弃用，新方案用头字段

**Priority 头**

```text
Priority: u=0; i=?1
```

- **u=urgency**：0-7，**0 最高 / 7 最低**
- **i=?incremental**：`?1` 可增量交付（流式）

**HTML 层协作：Fetch Priority API**

```text
<img src="hero.webp" fetchpriority="high" />
<script src="app.js" fetchpriority="high"></script>
```

> 浏览器启发式按资源类型排序（CSS > img），无法识别 hero/LCP 语义，必须显式标注。

<!--
fetchpriority 是 HTML 层与协议优先级协作的关键钩子。
-->

---

# HTTP/3 与 QUIC

QUIC（RFC 9000）= UDP + TLS 1.3 + 独立 stream + Connection ID

- **基于 UDP**（非 TCP），数据包 = Header + Encrypted Payload
- **TLS 1.3 内嵌**（RFC 9001），握手与加密合并为 1-RTT
- **stream 独立加密独立重传**，丢包只阻塞自身
- **Connection ID 标识连接**（8 字节可变，非 4 元组）
- **重连 0-RTT**：early data 用上次会话密钥派生

> HTTP/3 = HTTP 语义 + QUIC 传输 + QPACK 头部压缩。

<!--
QUIC 是 UDP 上的可靠传输，TLS 1.3 内嵌。
-->

---
layout: two-cols
---

# QUIC 四大优势

**① 消除 TCP HOL**

- stream 独立加密独立重传
- 一个包丢只卡该 stream

**② 0-RTT 重连**

- 重复访问 TTFB 大降
- Cloudflare 实测 -12.4%

**③ 连接迁移**

- Connection ID 标识连接
- Wi-Fi → 蜂窝不掉线

::right::

# Connection ID vs 4 元组

| 维度 | TCP | QUIC |
|------|-----|------|
| 标识 | 4 元组 | **CID** |
| IP 变 | 断 | **不断** |
| 多路径 | 否 | 支持 |

**NEW_CONNECTION_ID 帧**

- 服务端预发新 CID
- 客户端切换路径用新 CID
- 服务端按 CID 复用状态

<!--
连接迁移是移动端体验立竿见影的优化点。
-->

---

# 0-RTT 风险 + QPACK

**0-RTT 重放攻击**

- early data 缺前向保密
- 攻击者可重放
- **仅放幂等 GET / HEAD**
- POST / 支付必须等 1-RTT

**QPACK（RFC 9204）vs HPACK**

| 维度 | HPACK | QPACK |
|------|-------|-------|
| 静态表 | 61 | **99** |
| ACK | 共享 TCP | **独立流** |
| HOL | 受 TCP 影响 | Insert Count 阈值避免 |

> QPACK 用 Encoder / Decoder 两条独立单向流做显式 ACK，消除压缩层 HOL。

<!--
QPACK 显式 ACK 是为了在 QUIC 无序前提下不让压缩本身成为新 HOL 源。
-->

---

# Alt-Svc 协商 HTTP/3

浏览器不能直接发起 h3 请求，靠 Alt-Svc 头发现

```text
Alt-Svc: h3=":443"; ma=86400
```

- 首次访问：浏览器走 HTTP/2，收到响应后**缓存 Alt-Svc**
- 后续访问：浏览器尝试 HTTP/3（UDP/443）
- `ma=86400`：max-age 缓存有效期
- `persist=1`：跨会话保留

> **必须放通 UDP/443**。企业网 / 中间盒常对 UDP 限速，导致 QUIC 包丢失回退 h2 还付重试开销。

<!--
Alt-Svc 是 h3 协商发现机制；UDP/443 是部署 h3 的硬门槛。
-->

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- HTTP/2 上继续域名分片（变成纯开销）
- 继续用 Server Push（Chrome 已禁用）
- 把 JS/CSS 打成超大 bundle（牺牲缓存粒度）
- 0-RTT 处理非幂等 POST / 支付（重放风险）
- 假设 HTTP/3 永远比 h2 快（大对象可能更慢）
- 忽视 RFC 9113 弃用旧 PRIORITY 帧
- 开 HTTP/3 但不放通 UDP/443（不停回退）
- 期望浏览器自动识别 LCP（必须 fetchpriority）

<!--
最关键的避坑：弃用域名分片 + 弃用 Push + 0-RTT 限幂等 + UDP/443 放通。
-->

---
layout: center
class: text-center
---

# 小结

HTTP/2·HTTP/3 = 传输层协议级优化

多路复用 · HPACK / QPACK · QUIC · 0-RTT · 连接迁移

**h2 解决应用层 HOL · h3 解决传输层 HOL · Push 已弃用改 103**

[RFC 9113](https://www.rfc-editor.org/rfc/rfc9113) · [RFC 9114](https://www.rfc-editor.org/rfc/rfc9114) · [RFC 9000](https://www.rfc-editor.org/rfc/rfc9000) · [Chrome Removing Push](https://developer.chrome.com/blog/removing-push)

<!--
掌握「多路复用 + HPACK + QUIC + Push 弃用 + 0-RTT 限幂等」五要点，即可在生产用对 h2 / h3。
-->
