---
theme: seriph
background: https://cover.sli.dev
title: HTTP 协议基础
info: |
  HTTP 协议基础 —— 报文、方法、状态码、首部、Cookie、连接与缓存
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:api class="text-8xl" />
</div>

<br/>

## HTTP 协议基础

Web 的应用层基石：一次请求—响应里的报文、方法、状态码与缓存（基于 RFC 9110 语义）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
HTTP 是前端每天打交道却又最容易"只知其然"的协议。这一章不背 RFC，而是把一次请求—响应拆开，讲清报文、方法、状态码、首部、Cookie、连接和缓存这七块。
-->

---
transition: fade-out
---

# 这一章讲什么

一条主线：**一次请求—响应里都有什么**

<v-click>

- **报文与方法**：请求/响应报文四段、七个方法、安全/幂等/可缓存
- **状态码**：五大类、2xx/3xx/4xx/5xx 的高频码与辨析
- **首部**：请求头、响应头、表示头、逐跳 vs 端到端
- **协商与会话**：内容协商、Cookie、SameSite、Session vs Token
- **连接与缓存**：持久连接、范围请求、强缓存 vs 协商缓存

</v-click>

<v-click>

> 看懂一次完整的请求—响应，就理解了 HTTP 的全部脉络。

</v-click>

<!--
全程围绕"一次请求—响应"这条线展开，每块都落到前端能用上的点。
-->

---
layout: section
---

# 报文与方法

一次往返里的字节长什么样

---

# HTTP 的四个特点

理解一切的前提：HTTP 是什么样的协议

<v-click>

- **应用层协议**：跑在 TCP/TLS 之上，只管"语义"不管"传输"
- **请求—响应模型**：客户端先发起，服务端被动应答，一来一回
- **无状态（stateless）**：每个请求独立，服务端默认不记得上一个请求
- **媒体无关**：靠 `Content-Type` 描述载荷，可传 HTML、JSON、图片、视频

</v-click>

<v-click>

> 无状态是设计取舍：换来可伸缩与可缓存，代价是会话要靠 Cookie/Token 自己补。

</v-click>

<!--
这四点是后面所有内容的根。无状态尤其重要——它直接催生了 Cookie 与缓存两大主题。
-->

---

# 请求报文：四段结构

客户端发出去的字节，分四部分

<v-click>

```http
GET /search?q=http HTTP/1.1
Host: example.com
Accept: text/html
Cookie: sid=abc123

```

</v-click>

<v-click>

1. **请求行**：方法 + 请求目标（路径+查询）+ 协议版本
2. **请求头**：若干 `名: 值`，描述客户端与请求元信息
3. **空行**：一个 CRLF，标志头部结束
4. **消息体**：可选载荷（GET 通常没有，POST/PUT 才有）

</v-click>

<!--
四段顺序固定：请求行、头、空行、体。空行是分隔头和体的关键，别忽略。
-->

---

# 响应报文：四段结构

服务端回来的字节，对称的四部分

<v-click>

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 27

{"id":1,"name":"http"}
```

</v-click>

<v-click>

1. **状态行**：协议版本 + 状态码 + 原因短语（reason phrase）
2. **响应头**：描述服务端与响应元信息
3. **空行**：CRLF，分隔头与体
4. **消息体**：实际返回的表示（HTML/JSON/二进制…）

</v-click>

<!--
和请求报文对称。状态行的"原因短语"（如 OK、Not Found）仅供人读，程序只看数字码。
-->

---

# 七个常用方法

每个方法表达一种"对资源的意图"

<v-click>

| 方法 | 意图 |
| --- | --- |
| GET | 获取资源表示 |
| POST | 提交数据 / 触发处理（语义最宽） |
| PUT | 用请求体整体替换目标资源 |
| PATCH | 对资源做部分修改 |
| DELETE | 删除目标资源 |
| HEAD / OPTIONS | 取头部（无体）/ 查询支持的方法与能力 |

</v-click>

<!--
方法是动词，URL 是名词。HEAD 像 GET 但只回头不回体，常用于探测；OPTIONS 是 CORS 预检的主角。
-->

---

# 三个关键属性

判断一个方法"能不能重试、能不能缓存"

<v-click>

- **安全（safe）**：只读，不改变服务端状态 —— GET / HEAD / OPTIONS / TRACE
- **幂等（idempotent）**：同一请求发 1 次和发 N 次效果一致
- **可缓存（cacheable）**：响应允许被缓存复用

</v-click>

<v-click>

| 属性 | 成员 |
| --- | --- |
| 安全 | GET HEAD OPTIONS TRACE |
| 幂等 | 安全方法 + PUT DELETE |
| 都不是 | POST、PATCH |

</v-click>

<!--
这三个属性是状态码与缓存的底层依据。POST 既不安全也不幂等，所以浏览器刷新 POST 会弹"确认重新提交"。
-->

---

# 辨析：安全 ⊆ 幂等

容易记反的包含关系

<v-click>

- **安全一定幂等**：连状态都不改，发几次自然结果一致
- **幂等不一定安全**：`DELETE /post/1` 改了状态（不安全），但删一次和删多次最终都是"已删除"（幂等）

</v-click>

<v-click>

```text
安全 ⊆ 幂等
GET ──→ 既安全又幂等
DELETE → 幂等但不安全（改了状态）
POST ──→ 都不是（每次都可能新建一条）
```

</v-click>

<!--
关键反例就是 DELETE：它是"幂等但不安全"的典型，正好说明两个集合不相等。
-->

---

# GET vs POST

最常被问、也最容易答偏的对比

<v-click>

| 维度 | GET | POST |
| --- | --- | --- |
| 语义 | 获取 | 提交/处理 |
| 参数位置 | URL 查询串 | 消息体 |
| 安全/幂等 | 都是 | 都不是 |
| 可缓存 | 默认可 | 默认不可 |
| 刷新/回退 | 无副作用 | 可能重复提交 |

</v-click>

<v-click>

> "GET 不安全因为参数在 URL"是误解：URL 也走 TLS 加密；真正风险是被记进日志/历史。

</v-click>

<!--
别把"安全方法"和"传输安全"混为一谈。GET 的语义安全指不改状态，跟 HTTPS 加密是两码事。
-->

---

# PUT vs PATCH

都在"改"，区别在"整体 vs 局部"

<v-click>

```http
PUT /users/1            PATCH /users/1
{ "name": "Ann",        { "name": "Ann" }
  "age": 20 }
```

</v-click>

<v-click>

- **PUT**：用请求体**整体替换**资源；缺的字段会被清空 → **幂等**
- **PATCH**：只改**给到的字段**，其余不动 → 一般**不保证幂等**（取决于补丁语义）

</v-click>

<!--
PUT 要带全量，PATCH 只带增量。PATCH 不幂等是因为补丁可能是"数量+1"这类相对操作。
-->

---
layout: section
---

# 状态码

服务端用三位数告诉你结果

---

# 五大类总览

首位数字决定大类

<v-click>

| 类别 | 含义 |
| --- | --- |
| 1xx | 信息性，请求已收到、继续处理 |
| 2xx | 成功 |
| 3xx | 重定向，需进一步动作 |
| 4xx | 客户端错误（请求有问题） |
| 5xx | 服务端错误（服务端出问题） |

</v-click>

<v-click>

> 记首位即可定位责任方：4xx 找自己，5xx 找后端。

</v-click>

<!--
1xx 平时很少直接见到（如 100 Continue、101 Switching Protocols）。重点在 2/3/4/5 四类。
-->

---

# 2xx：成功

成功也分好几种"成功法"

<v-click>

- **200 OK**：最常见，请求成功且有响应体
- **201 Created**：资源已创建，常配 `Location` 指向新资源
- **204 No Content**：成功但**无响应体**（如 DELETE、保存设置）
- **206 Partial Content**：范围请求成功，只回一段（配 `Content-Range`）

</v-click>

<v-click>

> 201 用于 POST 创建，204 用于"做完了但没东西返回"，206 专属断点续传/视频拖动。

</v-click>

<!--
204 很实用：表单提交后不需要返回内容时用它，前端拿到就知道成功。206 后面讲范围请求会再出现。
-->

---

# 3xx：重定向码

让客户端"换个地方再请求"

<v-click>

| 状态码 | 含义 | 方法 |
| --- | --- | --- |
| 301 | 永久移动 | 旧客户端常转 GET |
| 308 | 永久移动 | **保留**原方法和体 |
| 302 | 临时移动 | 旧客户端常转 GET |
| 307 | 临时移动 | **保留**原方法和体 |
| 303 | 见其他 | **强制转 GET** |

</v-click>

<!--
表里成对看：301/308 永久，302/307 临时；带"保留"的是 307/308。303 是特例，专门把方法掰成 GET。
-->

---

# 重定向辨析

三组对比，记住"永久/临时 × 是否保留方法"

<v-click>

- **301 vs 308**：都永久；301 旧客户端可能把 POST 转成 GET，**308 严格保留**方法与体
- **302 vs 307**：都临时；307 严格保留方法与体，302 历史上也常被转 GET
- **303 See Other**：POST 处理完后，**强制让浏览器用 GET** 去取结果页（PRG 模式）

</v-click>

<v-click>

> 经验法则：要稳就用 307/308（明确保留语义），表单提交后跳转用 303。

</v-click>

<!--
PRG = Post/Redirect/Get：表单 POST 成功后回 303，浏览器 GET 结果页，刷新就不会重复提交了。
-->

---

# 4xx：客户端错误

请求本身有问题，改请求才有用

<v-click>

| 状态码 | 含义 |
| --- | --- |
| 400 | 请求语法/参数有误 |
| 401 | 未认证（缺少有效凭证） |
| 403 | 已认证但无权限 |
| 404 | 资源不存在 |
| 405 | 方法不被允许（配 `Allow`） |
| 429 | 请求过多（限流，配 `Retry-After`） |

</v-click>

<!--
400 是兜底的"你请求错了"。405 会告诉你这个 URL 支持哪些方法。429 是限流，前端要按 Retry-After 退避重试。
-->

---

# 辨析：401 vs 403

"没登录"和"没权限"是两回事

<v-click>

- **401 Unauthorized**：**未认证** —— 没带凭证或凭证无效；服务端**必须**带 `WWW-Authenticate` 头告诉你怎么认证
- **403 Forbidden**：**已认证但无权** —— 身份确认了，但这个身份不允许访问该资源；换凭证也没用

</v-click>

<v-click>

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="api"
```

</v-click>

<!--
名字其实起反了：401 叫 Unauthorized，但实际指"未认证"。判断口诀：401 重新登录有用，403 换号也没用。
-->

---

# 5xx：服务端错误

锅在服务端，客户端重试可能有用

<v-click>

- **500 Internal Server Error**：服务端内部异常的兜底码（最常见）
- **502 Bad Gateway**：网关/代理从**上游**收到了无效响应
- **503 Service Unavailable**：服务端暂时不可用（过载/维护），常配 `Retry-After`
- **504 Gateway Timeout**：网关等待**上游**响应**超时**

</v-click>

<v-click>

> 502/504 都涉及"上游"：502 是上游回了坏响应，504 是上游根本没回。

</v-click>

<!--
502/503/504 在有 Nginx/网关的架构里高频出现。区分关键：503 是自己挂了，502/504 是上游出问题。
-->

---
layout: section
---

# 首部字段

报文里那一堆 `名: 值`

---

# 首部分类与大小写

首部按"描述谁"分四类

<v-click>

- **通用头**：请求响应都可用（`Date`、`Connection`、`Cache-Control`）
- **请求头**：客户端 → 服务端（`Host`、`Accept`、`Authorization`）
- **响应头**：服务端 → 客户端（`Server`、`Set-Cookie`、`Location`）
- **表示头**：描述消息体（`Content-Type`、`Content-Length`）

</v-click>

<v-click>

> 字段名**大小写不敏感**：`Content-Type` 与 `content-type` 等价（HTTP/2 起规范要求全小写）。

</v-click>

<!--
分类只是帮助理解，不是硬性互斥。大小写不敏感这点在调试时很重要——别因为大小写以为头丢了。
-->

---

# 高频请求头

客户端最常带的那几个

<v-click>

| 请求头 | 作用 |
| --- | --- |
| Host | 目标主机（HTTP/1.1 必带） |
| Accept | 能接受的媒体类型 |
| Authorization | 携带认证凭证 |
| User-Agent | 客户端标识 |
| Referer | 来源页面 URL |

</v-click>

<!--
Host 在虚拟主机场景下决定请求落到哪个站点，HTTP/1.1 强制要带。Referer 拼错成了历史遗留（少了一个 r）。
-->

---

# 高频响应头

服务端最常回的那几个

<v-click>

| 响应头 | 作用 |
| --- | --- |
| Content-Type | 响应体的媒体类型 |
| Location | 重定向/新建资源的地址 |
| Set-Cookie | 下发 Cookie |
| Cache-Control | 缓存策略 |
| Server | 服务端软件标识 |

</v-click>

<!--
Location 在 3xx 和 201 都会用。Set-Cookie 和 Cache-Control 后面有专章细讲。
-->

---

# 表示头：Content-*

专门描述"消息体长什么样"

<v-click>

- **Content-Type**：媒体类型 + 字符集，如 `text/html; charset=utf-8`
- **Content-Length**：消息体字节数（用于定界）
- **Content-Encoding**：内容编码，如 `gzip`、`br`（压缩）
- **Content-Language**：内容的自然语言，如 `zh-CN`

</v-click>

<v-click>

> 表示头描述的是"这一份表示（representation）"，请求和响应都可能带。

</v-click>

<!--
"表示"是 RFC 9110 的核心概念：同一资源可有多份表示。Content-* 系列就是给当前这份表示贴标签。
-->

---

# 逐跳 vs 端到端

首部的"传播范围"不同

<v-click>

- **端到端（end-to-end）**：从源到目标一路透传，代理不得改动 —— 绝大多数头
- **逐跳（hop-by-hop）**：只对**单段连接**有效，代理必须消费、不转发 —— 如 `Connection`、`Keep-Alive`、`Transfer-Encoding`、`Upgrade`

</v-click>

<v-click>

```text
客户端 ──[hop1]── 代理 ──[hop2]── 服务端
          逐跳头只活在一段          端到端头全程不变
```

</v-click>

<!--
理解逐跳头很关键：它们绑定具体的 TCP 连接，所以代理会重写。Connection、Keep-Alive 都是逐跳的典型。
-->

---
layout: section
---

# 内容协商

同一个 URL，按需返回不同表示

---

# 内容协商：是什么

一个 URL，多份"表示"，按客户端偏好挑

<v-click>

- 同一资源 `/article`，可以有：中文/英文、HTML/JSON、gzip/br 多个版本
- 客户端用 `Accept-*` 系列头**表达偏好**，服务端据此**选一份**返回
- 这叫**服务端驱动的内容协商**（server-driven negotiation）

</v-click>

<v-click>

> URL 不变，返回内容随"谁来要、想要什么"而变 —— 这就是内容协商。

</v-click>

<!--
内容协商让一个 URL 服务多种客户端：浏览器要 HTML、API 客户端要 JSON，同一地址各取所需。
-->

---

# Accept 三件套

客户端表达偏好的三个主力头

<v-click>

| 请求头 | 协商维度 | 示例 |
| --- | --- | --- |
| Accept | 媒体类型 | `text/html, application/json` |
| Accept-Language | 语言 | `zh-CN, en` |
| Accept-Encoding | 压缩 | `gzip, br` |

</v-click>

<v-click>

> 服务端选定后，常用对应的 `Content-Type` / `Content-Language` / `Content-Encoding` 回应。

</v-click>

<!--
三件套分别对应类型、语言、压缩三个协商维度。还有个 Accept-Charset 但现代基本统一 UTF-8 了。
-->

---

# 质量值 q：表达优先级

用 `q` 给候选项打分排序

<v-click>

```http
Accept-Language: zh-CN, zh;q=0.9, en;q=0.7
```

</v-click>

<v-click>

- **q 值范围 0~1**，默认 `q=1`（最高优先）
- 上例偏好顺序：`zh-CN` (1.0) > `zh` (0.9) > `en` (0.7)
- `q=0` 表示**明确拒绝**该选项

</v-click>

<!--
q 是 quality value（质量因子），用来在多个可接受项之间排优先级。不写就是 1，写 0 就是"不要"。
-->

---

# Vary 与缓存坑

协商 + 缓存 = 必须告诉缓存"按什么分版本"

<v-click>

- 同一 URL 因协商返回多份内容，缓存若不区分就会**串味**（A 拿到 B 的语言）
- 服务端用 `Vary` 声明"响应随哪些请求头变化"
- 缓存据此为不同请求头值**分别存储**

</v-click>

<v-click>

```http
Vary: Accept-Language, Accept-Encoding
```

</v-click>

<!--
Vary 是内容协商和缓存之间的桥梁。漏了 Vary，CDN 可能把英文版缓存发给中文用户，是经典线上事故。
-->

---
layout: section
---

# Cookie 与会话

给无状态的 HTTP 补上"记忆"

---

# Cookie 机制

无状态协议如何"记住"用户

<v-click>

```http
响应：Set-Cookie: sid=abc123; Path=/
请求：Cookie: sid=abc123
```

</v-click>

<v-click>

1. 服务端在响应里用 **`Set-Cookie`** 下发键值
2. 浏览器**自动存储**，并在后续同站请求里用 **`Cookie`** 头带回
3. 服务端凭这个值**关联会话** → 弥补无状态

</v-click>

<!--
Cookie 是对"无状态"的工程补丁：服务端发一次，浏览器之后自动带回，状态就这样接续起来了。
-->

---

# Set-Cookie 属性

控制 Cookie 的生命周期与作用域

<v-click>

| 属性 | 作用 |
| --- | --- |
| Expires / Max-Age | 过期时间（Max-Age 优先；都无则会话级） |
| Domain | 作用域名（省略=仅当前主机） |
| Path | 作用路径（默认当前路径） |
| Secure | 仅 HTTPS 发送 |
| HttpOnly | 禁止 JS 读取（防 XSS 窃取） |

</v-click>

<!--
Max-Age 和 Expires 都设时 Max-Age 赢。省略 Domain 反而更安全（host-only，不发给子域）。
-->

---

# SameSite 三值

控制 Cookie 在"跨站请求"时是否发送

<v-click>

- **Strict**：仅**同站**请求发送，跨站一律不带（最严）
- **Lax**（现代浏览器默认）：同站发送 + 跨站**顶级导航的安全方法**（如点链接 GET）也发
- **None**：跨站也发送，但**必须**同时设 `Secure`

</v-click>

<v-click>

> SameSite 是防 CSRF 的第一道防线：默认 Lax 已挡掉大部分跨站表单 POST。

</v-click>

<!--
默认从早年的 None 改成了 Lax，这是浏览器层面的安全收紧。None 必须配 Secure，否则会被丢弃。
-->

---

# Cookie 安全

三件套把 Cookie 锁紧

<v-click>

- **HttpOnly**：JS 读不到 → 即使 XSS 也偷不走 Cookie
- **Secure**：仅密文信道（HTTPS）传输，防中间人嗅探
- **`__Host-` 前缀**：强约束 —— 必须 `Secure` + `Path=/` + **不带 Domain**，锁死在当前主机

</v-click>

<v-click>

```http
Set-Cookie: __Host-sid=abc; Secure; Path=/; HttpOnly; SameSite=Lax
```

</v-click>

<!--
会话 Cookie 的安全基线：HttpOnly + Secure + SameSite，再加 __Host- 前缀防子域写入污染，是当前最佳实践。
-->

---

# Session vs Token

两种会话方案，状态存哪边

<v-click>

| 维度 | Session（服务端） | Token（如 JWT） |
| --- | --- | --- |
| 状态 | 存服务端，Cookie 带 sid | 自包含，服务端不存 |
| 扩展性 | 多机需共享存储 | 天然无状态、易横扩 |
| 失效 | 删服务端记录即可 | 需黑名单/短期+刷新 |
| 载体 | 多走 Cookie | 多走 Authorization 头 |

</v-click>

<!--
核心差异：状态放服务端还是塞进令牌里。Session 易吊销但要共享存储，Token 易扩展但难即时失效。
-->

---
layout: section
---

# 连接、范围与缓存

让 HTTP 跑得更快的几招

---

# 持久连接 keep-alive

一条 TCP 连接，多次请求复用

<v-click>

- **HTTP/1.0**：默认一次请求一条连接，用完就关 → 频繁三次握手
- **HTTP/1.1**：**默认持久连接**，一条 TCP 上可连续收发多个请求
- 用 `Connection: keep-alive` 维持，`Connection: close` 显式关闭

</v-click>

<v-click>

> 复用连接省掉了反复握手与慢启动的开销，是 1.1 相对 1.0 的关键提速。

</v-click>

<!--
keep-alive 在 1.1 是默认行为，不必显式声明。它避免了每个资源都重新建连，对多资源页面提速明显。
-->

---

# 队头阻塞与管线化

持久连接没解决的"排队"问题

<v-click>

- **队头阻塞（HOL blocking）**：同一连接上请求**按序响应**，前一个慢则后面全卡住
- **管线化（pipelining）**：1.1 曾允许不等响应就连发多个请求，但仍须按序返回
- 管线化因实现复杂、收益有限，**实际已被废弃**；真正的解法是 HTTP/2 多路复用

</v-click>

<v-click>

> 1.1 时代前端靠"多开连接 + 域名分片"绕开队头阻塞，HTTP/2 才从协议层根治。

</v-click>

<!--
队头阻塞是 1.1 的硬伤。管线化想解决但没成功，浏览器普遍默认关闭。HTTP/2 的多路复用才是答案。
-->

---

# 范围请求 Range

只要资源的"一部分"

<v-click>

```http
请求：Range: bytes=0-1023
响应：206 Partial Content
      Content-Range: bytes 0-1023/146515
```

</v-click>

<v-click>

- 客户端用 `Range` 头请求字节区间，服务端回 **206 + `Content-Range`**
- 支撑**断点续传**、**视频拖动**、**大文件分片下载**
- 服务端用 `Accept-Ranges: bytes` 声明支持范围请求

</v-click>

<!--
Range 是视频播放器拖进度条、下载工具断点续传的底层。返回的是 206 而不是 200，别看错状态码。
-->

---

# 强缓存：Cache-Control

命中即用本地副本，**不发请求**

<v-click>

```http
Cache-Control: max-age=3600
```

</v-click>

<v-click>

- **强缓存命中**：在有效期内浏览器**直接用本地副本**，连请求都不发（最快）
- `Cache-Control` 优先级高于旧的 `Expires`（绝对时间，依赖客户端时钟）
- 表现为 DevTools 里的 `(from disk/memory cache)`

</v-click>

<!--
强缓存是性能的大头：命中时零网络往返。Expires 是 HTTP/1.0 遗留，受本地时钟影响，已被 Cache-Control 取代。
-->

---

# Cache-Control 常用指令

控制"能不能缓存、缓多久、怎么校验"

<v-click>

| 指令 | 含义 |
| --- | --- |
| max-age=N | 有效期 N 秒 |
| no-cache | 可缓存，但每次用前必须协商校验 |
| no-store | 完全不缓存（最严，敏感数据） |
| public / private | 可被共享缓存 / 仅私有缓存 |
| must-revalidate | 过期后必须校验，不得用陈旧副本 |

</v-click>

<!--
max-age 管时长，no-cache/no-store 管能不能存，public/private 管谁能存。组合使用覆盖各种策略。
-->

---

# 协商缓存：ETag / Last-Modified

副本过期了，问一句"还能用吗"

<v-click>

- 强缓存过期后，浏览器带**校验器**去问服务端，**没变就复用本地**
- **ETag / If-None-Match**：内容指纹，精确（推荐）
- **Last-Modified / If-Modified-Since**：最后修改时间，秒级精度

</v-click>

<v-click>

```http
请求：If-None-Match: "v3-abc"
响应：304 Not Modified   （体为空，复用本地副本）
```

</v-click>

<!--
协商缓存仍要发一次请求，但若命中返回 304 且无体，省下了下载大小。ETag 比时间戳更可靠。
-->

---

# no-cache vs no-store

一字之差，含义天壤之别

<v-click>

- **no-cache**：**可以存**，但每次使用前**必须向服务端协商校验**（常配 ETag → 命中回 304）
- **no-store**：**完全不存** —— 不写磁盘、不写内存，每次都重新完整下载（用于敏感/隐私数据）

</v-click>

<v-click>

> 记忆法：no-cache 是"存了但每次问一下"，no-store 是"压根不存"。

</v-click>

<!--
这俩最容易混。no-cache 仍走协商缓存（可能 304），no-store 才是真的"禁用缓存"，性能代价最大。
-->

---

# 304 协商流程

一次完整的"问—答"

<v-click>

```text
1. 强缓存过期 → 带 If-None-Match: "v3-abc" 发请求
2. 服务端比对指纹
   ├─ 未变 → 304 Not Modified（无体）→ 用本地副本
   └─ 已变 → 200 OK + 新内容 + 新 ETag
```

</v-click>

<v-click>

> 304 的价值：响应体为空，省的就是"重新下载整份资源"的带宽。

</v-click>

<!--
这张图把协商缓存串起来：过期不等于失效，先问一句。304 命中是最理想的"既新鲜又省流量"。
-->

---
layout: center
class: text-center
---

# 小结

一次请求—响应，七块拼图

<v-click>

- **报文/方法**：四段结构 + 安全/幂等/可缓存定调一切
- **状态码**：首位定责任方，301/308、307、303、401/403 是高频辨析
- **首部/协商**：Content-* 描述表示，Vary 连接协商与缓存
- **Cookie/缓存**：SameSite 防 CSRF，强缓存不发请求、协商缓存靠 304

</v-click>

<v-click>

> 看懂这一次往返，HTTP 的脉络就在手里了 —— 进阶再看 HTTP/2、HTTP/3。

</v-click>

<!--
七块拼图收束成一句话：吃透一次请求—响应，再上 HTTP/2 多路复用、HTTP/3 over QUIC 就水到渠成。
-->

---
layout: center
class: text-center
---

# 谢谢

HTTP 协议基础 · 从一次请求—响应读懂 Web

<div class="mt-8 text-gray-400">
基于 RFC 9110 语义 · 面向前端工程师
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
全章围绕"一次请求—响应"展开，覆盖报文、方法、状态码、首部、协商、Cookie、连接与缓存。感谢观看。
-->
