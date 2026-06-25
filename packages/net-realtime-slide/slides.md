---
theme: seriph
background: https://cover.sli.dev
title: 实时通信协议
info: |
  实时通信协议 —— 轮询演进、SSE、WebSocket 协议与实践、WebRTC NAT 穿透、方案对比选型
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:satellite-radar class="text-8xl" />
</div>

<br/>

## 实时通信协议

突破 HTTP「请求—响应」的限制：从轮询到 SSE、WebSocket、WebRTC，让服务器/对端主动把数据推过来

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
HTTP 是「客户端问、服务器答」，服务器无法主动推送。可聊天、行情、AI 流式输出又都要求服务器尽快把数据送到前端。这一章就讲实时通信的五条路线：轮询、SSE、WebSocket、WebRTC，以及怎么选。
-->

---
transition: fade-out
---

# 这一章讲什么

一条主线：**怎么让服务器/对端主动把数据送到客户端**

<v-click>

- **方案演进**：HTTP 的局限、短轮询、长轮询、Comet 家族
- **SSE**：基于 HTTP 的单向推送，`text/event-stream` + 自带重连
- **WebSocket 协议**：HTTP 升级握手、101、帧格式、掩码
- **WebSocket 实践**：心跳探活、重连退避、可靠性、代理与鉴权
- **WebRTC**：浏览器间 P2P，信令 / ICE / STUN / TURN 穿透 NAT
- **对比选型**：五方案全维度对比 + WebTransport 趋势

</v-click>

<v-click>

> 先分**拉 / 推**，再分**单向 / 双向 / 端到端** —— 两刀切开所有方案。

</v-click>

<!--
全章按六个主题顺序推进：先看轮询为什么不够，再依次上 SSE、WebSocket、WebRTC，最后横向对比给出选型决策。
-->

---
layout: section
---

# 方案演进

从「反复拉」到真正的「推」

---

# HTTP 的根本局限

理解一切实时方案的前提

<v-click>

- **请求—响应模型**：连接**只能由客户端发起**，服务器是被动应答的一方
- **没有请求就推不了**：服务器有了新数据，原生 HTTP 语义下**无法主动送达**浏览器
- 可现实里到处是「服务器侧先变化、希望前端尽快知道」的需求

</v-click>

<v-click>

- 聊天新消息、协作光标；股票行情、监控大盘
- 订单/支付状态、扫码登录；构建日志、AI 流式回答

</v-click>

<v-click>

> 这类需求统称**实时通信**。服务器不能主动推，最早只能让客户端反复「拉」来逼近「推」。

</v-click>

<!--
这一页是全章的根：HTTP 连接由客户端发起、服务器被动，是结构性限制。后面所有方案都是在「绕开或突破」这一点。
-->

---

# 拉 vs 推：分清两种模型

理解后续所有方案的钥匙

<v-click>

| 模型 | 谁发起 | 数据流向 | 代表 |
| --- | --- | --- | --- |
| 拉 pull | 客户端 | 客户端按需取 | 普通 HTTP、短轮询、长轮询 |
| 推 push | 服务器/对端 | 主动送达 | SSE（单向）、WebSocket（双向）、WebRTC |

</v-click>

<v-click>

- **轮询家族都是「拉」**：用不同手法**模拟**出推送的体感
- **真正的「推」**：靠 SSE / WebSocket / WebRTC 这类**持久连接**

</v-click>

<v-click>

> 短轮询、长轮询本质仍是拉，只是越来越逼真；持久连接登场才有真推送。

</v-click>

<!--
拉 vs 推是第一刀。记住轮询无论怎么优化都还是拉，区别只在「逼真程度」，真正改变范式的是持久连接。
-->

---

# 短轮询 short polling

最朴素的思路：定时问，随到随答

<v-click>

```text
客户端                                 服务器
  │ ── GET /messages?since=… ──►       │  t=0s
  │ ◄── 200 []（没有新数据） ──         │
  │   …等 3 秒…                         │
  │ ── GET /messages?since=… ──►       │  t=3s
  │ ◄── 200 []（还是没有） ──           │
  │   …等 3 秒…                         │
  │ ── GET /messages?since=… ──►       │  t=6s
  │ ◄── 200 [{新消息}] ──               │  数据 t=4s 就到，却拖到 t=6s 才取走
```

</v-click>

<v-click>

> 前端一个定时器 + 一个普通接口即可，**对现有 HTTP 基建零侵入** —— 但延迟很差。

</v-click>

<!--
短轮询实现极简：定时发请求问「有没有新数据」，服务器不管有没有都立刻返回。代价是消息平均要等半个轮询间隔才被取走。
-->

---

# 短轮询的代价

实现最简单，浪费也最直白

<v-click>

- **延迟高**：消息平均等约「半个轮询间隔」才被取走，间隔越大越慢
- **空轮询浪费**：绝大多数请求**返回空**，却照付 TCP/TLS、首部、Cookie、鉴权、一次处理的完整开销
- **开销随规模线性膨胀**：N 个客户端 × 固定频率 = 巨大的**恒定 QPS**，与是否真有数据无关

</v-click>

<v-click>

> 调间隔治不了本病：缩短→空请求暴涨，拉长→延迟变差，**实时性与开销二选一**。

</v-click>

<!--
短轮询永远在实时性和开销之间二选一，无法两全。这正是长轮询要解决的痛点。
-->

---

# 长轮询 long polling

只改一处：服务器把请求「挂起」

<v-click>

```text
客户端                                 服务器
  │ ── GET /messages?since=… ──►       │  t=0s，服务器 hold 住不返回
  │        （连接保持打开…）             │  ← Keep-Alive，超时设得很长
  │ ◄── 200 [{新消息}] ──               │  t=4s 有数据，立即响应（延迟≈0）
  │ ── GET /messages?since=… ──►       │  收到后「立刻」再发，进入下一轮
  │ ◄── 200 []（到达超时，空返回） ──    │  t=30s 超时正常返回，再续一轮
```

</v-click>

<v-click>

- **几乎每个请求都带回有效数据** —— 消灭「问了却没有」的空响应
- **延迟接近实时** —— 数据一就绪即返回，不用等下一个轮询周期

</v-click>

<!--
长轮询的关键动作：服务器收到请求不立即回，hold 住直到有数据或超时。客户端一拿到响应立刻再发，循环往复。
-->

---

# 长轮询仍要付的代价

消灭了空轮询，但**底层还是 HTTP**

<v-click>

- **头部重复开销**：每条消息一次完整请求—响应，反复带请求头/Cookie/鉴权，高频小消息时首部占比可能远超载荷
- **连接长时间占用**：同时挂起成千上万个连接，显著抬高内存与计算负载，耗文件描述符
- **无多路复用**：一条连接无法复用多路消息，连接利用率低
- **顺序/可靠性无保证**：「响应→下次请求」的间隙存在**丢消息窗口**，需 `since`/序号 + 缓冲补救
- **代理超时不可控**：中间反代/LB 可能提前掐断被 hold 的连接

</v-click>

<!--
长轮询解决了空轮询，但没改变底层是 HTTP 这个事实。这五条代价决定了它只是过渡方案。
-->

---

# Comet：HTTP 上的「伪推送」家族

SSE/WebSocket 标准化之前的主流方案

<v-click>

- **长轮询（long polling）**：hold 住请求直到有数据
- **HTTP 流式（streaming）**：保持一个长开响应持续写数据块 —— hidden iframe / XHR streaming
- **BOSH**：无法用持久 TCP 时的双向流式替代，曾广泛用于 XMPP（即时通讯）

</v-click>

<v-click>

> 这些都是「巧劲」，本质仍受 HTTP 单向请求模型约束 —— 正是 SSE 与 WebSocket 要替代的对象。

</v-click>

<!--
Comet 泛指一切「在 HTTP 上模拟服务器推送」的技巧。理解它能看清 SSE/WebSocket 是来替代什么的。
-->

---

# 短轮询 vs 长轮询

并排看，痛点一目了然

<v-click>

| 维度 | 短轮询 | 长轮询 |
| --- | --- | --- |
| 触发方式 | 定时发，立即答 | hold 住，有数据/超时才答 |
| 实时性 | 差（受间隔限制） | 好（就绪即返回） |
| 空请求 | 多（绝大多数空返回） | 少（仅超时空返回） |
| 服务器状态 | 无需挂起 | 需长时间挂起大量连接 |
| 头部开销 | 高且频繁 | 仍每消息一次往返 |
| 本质 | HTTP 拉，模拟推 | HTTP 拉，模拟推（更逼真） |

</v-click>

<!--
两种轮询的本质都是「拉」。长轮询更逼真但仍困在 HTTP 模型里。真正的服务器推送要靠持久连接，下一章进 SSE。
-->

---
layout: section
---

# SSE 服务器推送

HTTP + 一条不结束的响应

---

# SSE 是什么

最轻量的服务器单向推送标准

<v-click>

- **SSE（Server-Sent Events）**：WHATWG HTML 规范的一部分，让网页从服务器**持续接收文本事件流**
- **单向**：服务器 → 客户端；客户端只在建连时发一次请求
- **不引入新协议**：复用现有 HTTP 基建（CDN、鉴权、压缩、HTTP/2）

</v-click>

<v-click>

> SSE = **HTTP + 一条不结束的响应 + 约定好的文本格式 + 浏览器内建的自动重连**。

</v-click>

<!--
SSE 是「轻量服务器推送」的标准答案。和长轮询的本质区别：一次请求对应一条长期不关闭的响应，服务器源源不断往里写。
-->

---

# 基于 HTTP 的长连接

不做协议升级，就是一次「迟迟不结束」的响应

<v-click>

```http
GET /events HTTP/1.1
Host: example.com
Accept: text/event-stream
```

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

</v-click>

<v-click>

> **中间层缓冲是常见坑**：Nginx 等默认缓冲响应，会让事件「攒一批才下发」。需关闭缓冲（`X-Accel-Buffering: no` 或 `proxy_buffering off`），并对 `text/event-stream` 放行 gzip/CDN。

</v-click>

<!--
SSE 不像 WebSocket 要 Upgrade 握手，它就是普通 GET，只是响应不结束。生产部署最常见的坑就是反向代理的缓冲把实时性破坏掉。
-->

---

# 事件流格式：四个字段

纯文本逐行，**空行分隔一个事件**（`text/event-stream`，须 UTF-8）

<v-click>

| 字段 | 含义 |
| --- | --- |
| `data:` | 数据负载；多条连续 `data:` 行用换行拼接成一段 |
| `event:` | 事件类型名；省略则为默认类型 `message` |
| `id:` | 事件 ID，写入「最后事件 ID」，重连时回传 |
| `retry:` | 重连前等待的毫秒数（仅 ASCII 数字生效） |

</v-click>

<v-click>

```text
retry: 10000
event: price
id: 42
data: {"symbol": "YHOO", "price": 79.10}
```

</v-click>

<v-click>

> 冒号开头行是注释（整行忽略，常用作心跳）；不写 `event:` 默认 `message`，由 `onmessage` 接收。

</v-click>

<!--
四个字段一个空行触发一次分发。data 始终是字符串，传 JSON 要自己 parse。冒号开头行做保活心跳。命名事件用 addEventListener。
-->

---

# 自动重连与断点续传

SSE 最实用的内建能力

<v-click>

- 连接因网络抖动/服务器重启/代理超时中断时，浏览器**自动重新发起请求**，无需任何客户端代码
- 重连等待时间默认由浏览器决定，可被 `retry:` 字段覆盖

</v-click>

<v-click>

```text
事件下发：  id: 42  →  浏览器记住 42
（连接断开，浏览器等待 retry 后重连）
重连请求头：Last-Event-ID: 42  →  服务器从 43 继续
```

</v-click>

<v-click>

> 不是「永不掉线」：服务器若回 `204` 或非 `text/event-stream`，浏览器会**停止**重连。

</v-click>

<!--
断点续传靠 id 与 Last-Event-ID 配合：服务器给事件编 id，浏览器记住，重连时自动带回，服务器据此从断点续推。
-->

---

# EventSource API 与局限

客户端用内建 `EventSource` 消费

<v-click>

```js
const es = new EventSource("/events");
es.onmessage = (e) => console.log(e.data);
es.addEventListener("price", (e) => render(JSON.parse(e.data)));
```

</v-click>

<v-click>

- **单向**：客户端要发数据得另开普通请求，无法在同一条流上回传
- **纯文本**：传二进制须先 Base64 等编码，有体积与 CPU 开销
- **HTTP/1.1 连接数限制**：每域约 **6 条**并发，多标签页易顶满 —— 切 **HTTP/2 多路复用**即解除

</v-click>

<!--
EventSource 的 onopen/onerror/readyState 等细节属于 Web API 范畴。这里聚焦协议局限：单向、纯文本、HTTP/1.1 下每域 6 条上限。
-->

---
layout: section
---

# WebSocket 协议

一次升级，长期全双工

---

# WebSocket 解决了什么

SSE 是单向，聊天/协作要**双向**

<v-click>

- **WebSocket（RFC 6455）**：在客户端与服务端之间建一条**持久、全双工**的 TCP 通道
- 一旦建立，**任意一方都能在任意时刻**主动推数据
- **没有 HTTP 的请求头开销**：每条消息只裹一个极小的帧头

</v-click>

<v-click>

> **全双工**指双方可**同时**收发、互不阻塞。对比 SSE（服务端单向推）、HTTP（一问一答），WebSocket 是唯一在单连接上双向同时通信的浏览器原生协议。

</v-click>

<!--
用 HTTP 硬扛双向只能靠轮询，要么延迟高、要么频繁重连。WebSocket 的答案是一条持久全双工的 TCP 通道。
-->

---

# 握手（一）：客户端发带 Upgrade 的 GET

复用 HTTP 发起，共用 80/443 端口

<v-click>

```http
GET /chat HTTP/1.1
Host: example.com:8000
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
Sec-WebSocket-Protocol: chat, superchat
```

</v-click>

<v-click>

- 方法**必须是 GET**，HTTP 版本**至少 1.1**
- `Sec-WebSocket-Key`：客户端随机 16 字节、Base64 的 nonce；`Version` 当前为 **13**
- `Sec-WebSocket-Protocol`：可选子协议，由服务端选一个回告

</v-click>

<!--
WebSocket 巧妙复用 HTTP 来发起连接，所以能共用 80/443、穿过现有代理。靠的是 HTTP 的 Upgrade 首部机制。
-->

---

# 握手（二）：服务端回 101

`101 Switching Protocols` 是握手的灵魂

<v-click>

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
Sec-WebSocket-Protocol: chat
```

</v-click>

<v-click>

- 它告诉客户端「我同意切换协议，从现在起这条 TCP 讲 WebSocket」
- 客户端须校验：状态码确为 **101**、`Upgrade`/`Connection` 正确、`Sec-WebSocket-Accept` 与本地算出的一致

</v-click>

<v-click>

> 升级**只能客户端发起**；该机制是 **HTTP/1.1 专属**，HTTP/2 禁止用 `Upgrade`（改用 RFC 8441 扩展 CONNECT）。

</v-click>

<!--
101 是状态码里少见但关键的一个。客户端拿到 101 并校验通过后，这条连接就从 HTTP 切换成 WebSocket。
-->

---

# Sec-WebSocket-Accept 算法

服务端证明「我真懂 WebSocket」的暗号

<v-click>

```text
拼接：  Sec-WebSocket-Key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
            ↓  对原始 Key 字符串直接拼接（不解码 Base64）
SHA-1： 对拼接结果做 SHA-1，得 20 字节摘要
            ↓
Base64：编码摘要 → 即 Sec-WebSocket-Accept
```

</v-click>

<v-click>

- `258EAFA5-…` 是 RFC 6455 写死的**魔术字符串（magic GUID）**，全世界实现共用
- **只防「意外升级」**（被缓存代理误处理），**不是认证或加密** —— 安全靠 `wss://` + Cookie/Token

</v-click>

<!--
这个确定性计算让服务端证明自己懂 WebSocket，防止把 GET 当普通请求误处理。它不提供任何安全性，别误解。
-->

---

# 握手之后：复用同一条 TCP

一次握手，长期复用

<v-click>

- **不再有 HTTP 报文**：不发请求行/状态行/HTTP 首部，改用紧凑的 WebSocket **帧**
- **复用同一连接全双工**：升级所用的那条 TCP 直接变成双向通道，无需另开
- **持久存活**：直到任意一方发**关闭帧（`0x8`）**走关闭握手，或 TCP 断开

</v-click>

<v-click>

> 这正是 WebSocket 高效的根源：一次握手、长期复用，每条消息只付几字节帧头的代价。

</v-click>

<!--
握手成功后 TCP 连接不关闭，被 WebSocket 接管。从此脱离 HTTP，按帧收发，直到关闭帧或 TCP 断开。
-->

---

# 帧格式：首两字节定结构

握手后数据按**帧**传输（RFC 6455 §5.2）

<v-click>

| 字段 | 位宽 | 含义 |
| --- | --- | --- |
| `FIN` | 1 | 是否为消息最后一帧（0=后面还有分片续帧） |
| `RSV1~3` | 各 1 | 保留位，无扩展时全为 0 |
| `opcode` | 4 | 帧类型（见下页） |
| `MASK` | 1 | 载荷是否掩码（客户端发=1；服务端发=0） |
| `Payload len` | 7 | 长度第一档（0~125 直接用；126/127 触发扩展） |
| `Masking-key` | 32 | 仅 `MASK=1` 时存在，4 字节随机键 |

</v-click>

<!--
帧首两字节包含 FIN、opcode、MASK、7 位载荷长度，后面跟可选的扩展长度、掩码键、载荷。比 HTTP 首部紧凑得多。
-->

---

# opcode 速查

数据帧 vs 控制帧

<v-click>

| opcode | 类型 | 类别 | 说明 |
| --- | --- | --- | --- |
| `0x0` | Continuation 续帧 | 数据帧 | 分片消息的后续帧 |
| `0x1` | Text 文本 | 数据帧 | UTF-8 文本 |
| `0x2` | Binary 二进制 | 数据帧 | 任意二进制 |
| `0x8` | Close 关闭 | 控制帧 | 关闭握手，可带 2 字节状态码 |
| `0x9` | Ping | 控制帧 | 心跳探测，对端须回 Pong |
| `0xA` | Pong | 控制帧 | 对 Ping 的回应，载荷须相同 |

</v-click>

<v-click>

> **控制帧载荷必须 ≤125 字节且不可分片** —— 保证心跳与关闭信令能被立刻完整处理。

</v-click>

<!--
opcode 区分文本/二进制/续帧（数据帧）与关闭/ping/pong（控制帧）。控制帧的两条铁律保证心跳不被大消息卡住。
-->

---

# 载荷长度：三档编码

兼顾小消息紧凑与大消息容量

<v-click>

```text
7 位值 0~125  →  长度就是这个值，无扩展字节
7 位值 = 126  →  读后续 2 字节（16 位无符号），最大 65535
7 位值 = 127  →  读后续 8 字节（64 位无符号，最高位为 0）
```

</v-click>

<v-click>

- 规范要求**用能表达的最短编码**
- 124 字节的消息只能编成 `124`，**不能**写成 `126, 0, 124`

</v-click>

<!--
长度分三档：7 位、16 位、64 位。最短编码原则防止歧义与浪费。这是帧格式里容易考的细节。
-->

---

# 掩码 masking：方向非对称强制

WebSocket 的一条硬规定

<v-click>

- **客户端 → 服务端：每一帧都必须掩码**（`MASK=1`，带 4 字节随机键）
- **服务端 → 客户端：绝不能掩码**（`MASK=0`）
- 解码：`解码后[i] = 载荷[i] XOR 掩码键[i mod 4]`（XOR 自反）

</v-click>

<v-click>

> **为什么客户端必须掩码？** 防御**缓存投毒**：随机掩码键让攻击者无法预测上线字节，堵死「伪造合法 HTTP 毒化代理缓存」的攻击。违反方向规则的帧，对方按协议错误**关闭连接**。

</v-click>

<!--
掩码是方向非对称的：客户端帧必须掩码，服务端帧绝不掩码。目的是防缓存投毒。收到违规帧必须按协议错误关闭。
-->

---

# ws:// 与 wss://

端口与加密，对应 HTTP/HTTPS

<v-click>

| 方案 | 默认端口 | 传输安全 | 类比 |
| --- | --- | --- | --- |
| `ws://` | 80 | 明文 TCP | HTTP |
| `wss://` | 443 | **TLS 加密** | HTTPS |

</v-click>

<v-click>

- `wss://`：先在 TCP 上做 **TLS 握手**（与 HTTPS 同一套），再在加密信道跑 WebSocket
- **握手本身是 HTTP**，所以天然走 80/443，**无需单开端口**，易穿防火墙与代理

</v-click>

<v-click>

> 生产环境**一律用 `wss://`**：加密防窃听、避开混合内容拦截、对代理兼容性更好。

</v-click>

<!--
ws/wss 与 http/https 一一对应。wss 复用 443、流量被 TLS 包裹，穿透更顺畅。生产环境一律用 wss。
-->

---
layout: section
---

# WebSocket 工程实践

难的不是协议，是长连接运维

---

# 心跳保活：为什么必须主动探活

TCP 不会主动告诉你对端已经没了

<v-click>

> **半开连接（Half-Open）**：对端进程崩溃、手机切后台被杀、网线被拔、NAT 映射超时被回收 —— **没有任何 FIN/RST** 发回来。本侧 socket 仍是 `ESTABLISHED`，`send()` 也不报错，但对端**永远收不到**。

</v-click>

<v-click>

- 纯靠系统级 TCP Keepalive（默认 2 小时才探测）根本来不及
- 解药：**应用层主动探活** —— 周期发探测包 + **限时等回包**，超时即判定连接已死

</v-click>

<!--
半开连接是长连接运维的头号坑：没有任何包通知你对端没了。必须靠「发心跳 + 限时等回包」主动探活。
-->

---

# Ping / Pong 与应用层心跳

协议级控制帧 + 前端唯一可控手段

<v-click>

```text
保活时序（任一方探活）：
  A ──Ping(0x9)──▶ B      A 启动「等 Pong」定时器（如 10s）
  A ◀──Pong(0xA)── B      收到 → 重置定时器，连接健康
  A ──Ping(0x9)──▶ ✗      B 已死：定时器到点未收 Pong
  A: 判定断线 → close() → 进入重连
```

</v-click>

<v-click>

- **浏览器不暴露收发 Ping 的 JS API**：收到 Ping 只自动回 Pong，不通知页面
- 前端唯一可控的是**应用层心跳**（约定业务消息走 text 帧）；协议级 Ping/Pong 主要由服务端/网关用
- 还要对抗**中间设备 idle 超时**：心跳间隔取「最小中间超时」的 **1/2 ~ 2/3**

</v-click>

<!--
协议级 Ping/Pong 浏览器不给用，前端只能靠应用层心跳。心跳第二重作用是制造周期流量，防 NAT/代理因空闲掐断。
-->

---

# 断线重连：指数退避 + 抖动

避免「重连风暴」打垮刚起来的服务

<v-click>

```text
第 n 次重连等待 = min(base · 2^n, cap) + random(0, jitter)

例：base=1s, cap=30s
  第1次 ~1s   第2次 ~2s   第3次 ~4s
  第4次 ~8s   第5次 ~16s  第6次起 封顶 ~30s
  每次再叠加 0~1s 随机抖动，把回连时刻打散
```

</v-click>

<v-click>

- **抖动不可省**：纯指数退避会让所有客户端步调一致地同时重连
- **可见性联动**：`visibilitychange` 回前台、`navigator.onLine` 转 true 时，立即重置退避并重连

</v-click>

<!--
服务端重启瞬间成千上万客户端同时回连会形成 thundering herd。指数退避 + 抖动削峰，配合可见性联动加速恢复。
-->

---

# 关闭码：判断该不该重连

Close 帧 opcode `0x8`，带状态码

<v-click>

| 关闭码 | 含义 | 是否重连 |
| --- | --- | --- |
| `1000` | 正常关闭（多为业务主动关） | 通常**不**重连 |
| `1001` | 端点离开（页面关闭/导航） | 视情况 |
| `1006` | 异常断开（无 Close 帧） | **应重连**（网络掉了） |
| `1011` | 服务端内部错误 | 可重连 |
| `1013` | Try Again Later（过载） | 重连，**应退避** |

</v-click>

<v-click>

> `1006` 是「网络掉了」的典型信号，是重连的主要触发器；`1013` 提示客户端拉长间隔再来。

</v-click>

<!--
关闭码是重连判据的核心：1006 异常断开要重连，1000 正常关闭不该重连，1013 过载要退避后再来。
-->

---

# 消息可靠性：协议不替你保证送达

`send()` 成功 ≠ 对端已处理

<v-click>

| 机制 | 作用 |
| --- | --- |
| **消息序号 seq/id** | 每条消息带单调递增 ID，接收端去重、检测缺号 |
| **ACK 确认** | 接收端回 `ack: id`，发送端收到才算「真正送达」 |
| **超时重发** | 超时未收 ACK 则重发（配合 seq 去重） |
| **断线补偿** | 重连后上报 `last-received-id`，服务端**补发**缓冲消息 |

</v-click>

<v-click>

> 有重发就有重复 —— 这是「**至少一次**」语义，须靠**接收端按 seq 去重**或**业务幂等**兜底，对用户呈现「恰好一次」。

</v-click>

<!--
WebSocket 只保证帧按序到达，不保证应用层送达。要不丢不重不乱，必须自建 ACK + 序号 + 重发 + 服务端缓冲补偿。
-->

---

# 代理与负载均衡：让 Upgrade 活着穿过去

很多反代/LB 默认不透传 Upgrade，导致握手降级失败

<v-click>

```text
location /ws/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;                  # WebSocket 需 HTTP/1.1
    proxy_set_header Upgrade $http_upgrade;   # 透传 Upgrade: websocket
    proxy_set_header Connection "upgrade";    # 升级连接
    proxy_read_timeout 3600s;                 # 拉长 idle，配合心跳
}
```

</v-click>

<v-click>

- **L4（TCP）LB**：只转发字节流，对 WebSocket **天然透明**，最省心
- **L7（HTTP）LB**：必须**显式开启 WebSocket 支持**，并设足够长的 idle timeout

</v-click>

<!--
关键是把逐跳头 Upgrade/Connection 显式转发给上游，并拉长读超时。L4 透传，L7 要专门开 WS 支持。
-->

---

# 鉴权与子协议

握手是 HTTP，但浏览器**不能自定义请求头**

<v-click>

- 浏览器 WebSocket API 设不了 `Authorization`、`Sec-*` 头，故常见三招：
  - **① Cookie**：同源自动带，服务端校验 session
  - **② URL query token**：简单但 token 进日志，宜用**短期一次性 ticket**
  - **③ `Sec-WebSocket-Protocol` 夹带 token**

</v-click>

<v-click>

```http
# 请求：客户端列出可接受子协议（域名式命名防冲突）
Sec-WebSocket-Protocol: v2.chat.example.com, v1.chat.example.com
# 响应：服务端最多回一个表示选定（不回=不选）
Sec-WebSocket-Protocol: v2.chat.example.com
```

</v-click>

<!--
浏览器不能自定义握手头，所以鉴权靠 Cookie / ticket / 子协议夹带。子协议本职是协商消息格式/版本，服务端最多回一个。
-->

---

# HTTP/2 / HTTP/3 上的 WebSocket

经典 WebSocket 每条连接独占一条 TCP

<v-click>

- **RFC 8441《Bootstrapping WebSockets with HTTP/2》**用**扩展 CONNECT**解决：
  - 新增 SETTINGS 参数 `SETTINGS_ENABLE_CONNECT_PROTOCOL`，服务端发 `=1` 表示支持
  - 请求带新伪头 `:protocol`，对 WebSocket **其值必须为 `websocket`**
  - 握手成功后，**这条 H2 流当作那条 TCP 连接用** —— 复用连接、免单独 TCP+TLS 握手

</v-click>

<v-click>

> HTTP/3 由 **RFC 9220** 对应支持（思路一致，映射到一条 QUIC 流）。但需两端都支持，**传统 HTTP/1.1 Upgrade 仍兼容性最广**。

</v-click>

<!--
RFC 8441 用扩展 CONNECT 让 WebSocket 搭上 HTTP/2 复用连接的便车，RFC 9220 对应 HTTP/3。生态仍在铺开，1.1 Upgrade 最通用。
-->

---
layout: section
---

# WebRTC 与 NAT 穿透

浏览器之间的点对点直连

---

# WebRTC：浏览器原生的 P2P

让两个对端**直接互联**，数据尽量不经服务器

<v-click>

- **WebRTC（Web Real-Time Communication）**：无需插件，在两端间直接传**音视频与任意数据**
- 媒体走 **SRTP**（加密 RTP），数据走 **DataChannel**（SCTP/DTLS）
- 目标：把延迟压到最低、把服务器带宽成本降到几乎为零

</v-click>

<v-click>

> 与 SSE/WebSocket（客户端 ↔ 服务器、数据必经服务器中转）不同 —— WebRTC 追求**对端之间的直连**。

</v-click>

<!--
WebRTC 解决三件事：实时音视频、任意数据 P2P 传输、以及为此服务的连接建立。和前面方案最大的不同是「不经服务器中转」。
-->

---

# 难题：NAT 挡在中间

设备持私有 IP，外部无法主动连入

<v-click>

```text
       Peer A                                  Peer B
   192.168.1.5（私有）                       10.0.0.7（私有）
   ┌────┴─────┐                          ┌─────┴────┐
   │  NAT A   │ 公网 203.0.113.4         │  NAT B   │ 公网 198.51.100.9
   └────┬─────┘                          └─────┬────┘
        │       ❌ 互相看不到对方真实地址      │
        └────────────── 公网 Internet ─────────┘
```

</v-click>

<v-click>

- A 只知自己是 `192.168.1.5`，这地址在公网毫无意义；B 同理
- 必须解决：**① 各自发现公网映射地址 ② 在两个 NAT 上凿出双向通路**

</v-click>

<!--
家庭/办公网络里设备几乎都是私有 IP，共享路由器一个公网 IP。NAT 默认拒绝未经内部发起的入站包，这对 P2P 是致命的。
-->

---

# 信令：交换「怎么连」的信息

WebRTC **刻意不规定**信令通道，由你自选

<v-click>

```text
   发起方 A          信令服务器（常用 WebSocket）          应答方 B
      │ createOffer() / setLocalDescription(offer)         │
      │ ──── ① Offer (SDP) ───►  转发  ──────────────────► │
      │                              setRemoteDescription
      │                              createAnswer()
      │ ◄──────── 转发 ◄──── ② Answer (SDP) ────────────── │
      │ setRemoteDescription(answer)                       │
      │ ═══ 此后边收集 ICE 候选边经信令交换 ═══              │
```

</v-click>

<v-click>

- 交换两类数据：**SDP 会话描述**（RFC 8866：媒体类型/编解码/加密/地址）+ **ICE 候选**
- 信令要求双向、低延迟、可即时推送 —— 正是 **WebSocket** 的强项；连上后媒体走 P2P，**不再经它**

</v-click>

<!--
信令只在建连阶段牵线：双方先连同一信令服务器，借它转发 SDP（Offer/Answer）和 ICE 候选。连上后媒体/数据走直连。
-->

---

# ICE：把能通的路径试出来

交互式连接建立，统筹 STUN/TURN

<v-click>

```text
① 收集候选 → ② 经信令交换 → ③ 连通性检查 → ④ 择优提名
  host/srflx/relay   对端 addIce…   STUN 探测候选对   选定 Selected Pair
```

</v-click>

<v-click>

| 候选类型 | 来源 | 含义 |
| --- | --- | --- |
| `host` | 本机网卡 | 私有/本地 IP，同局域网可直连 |
| `srflx` | **STUN** | NAT 之外看到的公网映射地址 |
| `prflx` | 连通检查中发现 | 对端经 NAT 反射出的地址 |
| `relay` | **TURN** | 中继地址，流量经 TURN 转发 |

</v-click>

<v-click>

> **Trickle ICE**：边收集边发，不等收齐 —— 显著缩短建连时间。优先级 **host > srflx > relay**、**UDP > TCP**。

</v-click>

<!--
ICE 是框架不是单一协议，分四阶段调度 STUN/TURN。四种候选类型按优先级排序，能直连绝不走中继。
-->

---

# STUN：发现公网地址 + UDP 打洞

轻量、不占服务器带宽，是首选

<v-click>

```text
   Peer A ──── Binding Request ───►  STUN 服务器
   (192.168.1.5)                         │
          ◄── Binding Response ──────────┘
              你的公网映射 = 203.0.113.4:51820  （srflx 候选）
```

</v-click>

<v-click>

- 客户端发 **Binding Request**，STUN 原样回看到的源地址（`XOR-MAPPED-ADDRESS`）
- 拿到双方映射后，两端**几乎同时**向对方公网地址发包 —— 先发的包在自己 NAT 上建出站映射，对端包随后命中被放行，通路「凿」通

</v-click>

<v-click>

> **打洞不是万能**：**对称型（Symmetric）NAT** 对不同目的地用不同公网端口，双方都是对称型时打洞基本必然失败。

</v-click>

<!--
STUN 让设备发现自己经 NAT 后的公网映射，据此尝试 UDP 打洞。对称型 NAT 因端口不可预测会让打洞失败。
-->

---

# TURN：打洞失败时的中继兜底

保连通，但耗带宽、增延迟

<v-click>

```text
   Peer A ───►  TURN 服务器（公网中继）  ◄─── Peer B
   (对称 NAT)        │   转发全部流量   │      (对称 NAT)
                     └── relay 候选 ───┘
   对端看到的源地址 = TURN 服务器
```

</v-click>

<v-click>

| 维度 | STUN | TURN |
| --- | --- | --- |
| 角色 | 发现映射、辅助打洞**直连** | **中继转发**全部流量 |
| 数据经服务器 | 否（仅问地址） | 是（全程经过） |
| 带宽成本 | 极低 | **高**（与流量成正比） |
| 连通保证 | 视 NAT，可能失败 | **几乎总能连通** |

</v-click>

<v-click>

> 生产实战 **STUN/TURN 都配**：ICE 优先 STUN 直连，失败自动回落 TURN —— 兼顾省带宽与保连通。

</v-click>

<!--
TURN 是兜底：所有流量经它转发，保证连通但带宽成本高（部署 WebRTC 的主要开销）。ICE 把 relay 排最后。
-->

---

# DataChannel：传音视频之外的任意数据

在同一条 P2P 通道上传文本/二进制/文件

<v-click>

- 底层 **SCTP over DTLS**，因而**传输默认加密**
- **可配传输语义**：可像 TCP 那样**可靠 + 有序**，也可配**不可靠 / 无序**（牺牲重传换低延迟）
- **复用同一条 ICE 通路**：与媒体共用已打通的连接，无需另做 NAT 穿透

</v-click>

<v-click>

> 真正的 P2P：在**文件直传、低延迟多人游戏、协同白板**等场景绕开服务器中转，省成本又降延迟。

</v-click>

<!--
DataChannel 让 WebRTC 不止于音视频。可靠/不可靠可配，复用已建立的 ICE 通路，适合文件直传和实时游戏状态同步。
-->

---
layout: section
---

# 方案对比与选型

通信形态决定方案，而非「越新越好」

---

# 五方案全维度对比

一张大表收口

<v-click>

| 维度 | 短轮询 | 长轮询 | SSE | WebSocket | WebRTC |
| --- | --- | --- | --- | --- | --- |
| 方向 | 客户端拉 | 客户端拉 | 服务器单向推 | 双向 | 端到端双向 |
| 底层协议 | HTTP | HTTP | HTTP | `ws`/`wss`（TCP） | UDP（SRTP/DTLS） |
| 实时性 | 差 | 中 | 好 | 很好 | 极好 |
| 服务器开销 | 高 | 中 | 低 | 低 | 低（不中转） |
| 数据格式 | 任意 | 任意 | 仅文本 | 文本+二进制 | 媒体+二进制 |
| 自动重连 | 不适用 | 自己实现 | 原生 | 自己实现 | 信令重协商 |
| 浏览器 API | fetch | fetch | EventSource | WebSocket | RTCPeerConnection |

</v-click>

<!--
这张表横向对比五方案。第一刀分拉/推，第二刀分单向/双向/端到端，再看底层协议、实时性、数据格式、重连成本。
-->

---

# 选型决策树

问「我的通信形态是什么」，多数场景一两步定

<v-click>

```text
需要服务器实时把数据送到客户端吗？
├─ 否 → 普通 HTTP 请求/响应即可
└─ 是
   ├─ 只需「服务器 → 客户端」单向推？
   │   └─ ✅ SSE（自带重连/续传，纯文本最省心；AI 流式首选）
   ├─ 需要「客户端 ⇄ 服务器」双向低延迟？
   │   └─ ✅ WebSocket（全双工 + 二进制）
   ├─ 需要「浏览器 ⇄ 浏览器」端到端媒体级低延迟？
   │   └─ ✅ WebRTC（不经服务器；需信令 + STUN/TURN）
   └─ 只是简单偶发低频更新、兼容性优先？
       └─ ✅ 轮询兜底（优先长轮询）
```

</v-click>

<v-click>

> **别过度设计**：能用 SSE 就别上 WebSocket，能用 WebSocket 就别硬套 WebRTC。

</v-click>

<!--
按通信形态走这棵树，多数场景一两步就能定。每往「更强」走一步，工程复杂度都会陡增。
-->

---

# 辨析：HTTP/2 Server Push ≠ 实时推送

一个常见混淆

<v-click>

- **它不是实时通信**：Server Push 是随某次响应用 `PUSH_PROMISE` **预推静态资源**（CSS/JS），为省二次请求，与「持续推业务数据」无关
- **它已被废弃**：采用率极低、收益小、常引发缓存问题，**Chrome 106（2022）已默认移除**；替代是 `103 Early Hints`
- **要服务器单向推业务数据，请用 SSE** —— 它才是为「持续事件流」设计的

</v-click>

<!--
很多人把 HTTP/2 Server Push 误当实时推送方案。它只是资源预加载优化，且已废弃。要推业务数据用 SSE。
-->

---

# 现代趋势

2026 年两条值得关注的动向

<v-click>

- **SSE 因 AI 流式输出回潮**：大模型逐 token 输出天然契合「服务器单向推文本流」，**Vercel AI SDK 默认即用 SSE**；但 Agent 化（工具调用、中途取消、多设备续传）需客户端反向发信号，要么补 WebSocket，要么靠 resume token 兜底
- **WebTransport over HTTP/3 新兴**（Baseline 2026）：WebSocket 的 UDP 化继任者
  - 既能开**多条双向流**，又能发**不可靠数据报**（适合游戏位置同步）
  - 继承 QUIC 的 0-RTT 重连、流间无队头阻塞、**连接迁移**（切 Wi-Fi/4G 不断连）

</v-click>

<v-click>

> 短期内 WebSocket 仍是双向实时主力，WebTransport 适合对延迟极致敏感、可控两端的新项目先行。

</v-click>

<!--
两条趋势：单向推被 AI 流式带火（SSE 复兴）；双向低延迟正从 TCP（WebSocket）向 QUIC/UDP（WebTransport）演进。
-->

---
layout: center
class: text-center
---

# 小结

突破 HTTP 限制，五条路线各有定位

<v-click>

- **演进**：HTTP 不能主动推 → 短轮询（浪费）→ 长轮询（伪推送）→ 持久连接
- **SSE**：HTTP 单向推、`text/event-stream`、自带重连 + `Last-Event-ID`
- **WebSocket**：HTTP 升级握手 101、帧 + 掩码、心跳/重连/可靠性靠自建
- **WebRTC**：P2P 直连，信令 + ICE + STUN 打洞 + TURN 兜底
- **选型**：先分拉/推，再分单向/双向/端到端

</v-click>

<v-click>

> 通信形态决定方案 —— 能用更轻的就别上更重的。

</v-click>

<!--
五条路线收束成两刀选型：先分拉/推，再分单向/双向/端到端。SSE 最省心、WebSocket 最通用、WebRTC 延迟最低。
-->

---
layout: center
class: text-center
---

# 谢谢

实时通信协议 · 让数据主动流向客户端

<div class="mt-8 text-gray-400">
基于 HTTP 现代标准 · 面向前端工程师
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
全章覆盖轮询演进、SSE、WebSocket 协议与实践、WebRTC NAT 穿透、方案对比选型。感谢观看。
-->
