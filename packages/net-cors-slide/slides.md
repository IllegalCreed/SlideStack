---
theme: seriph
background: https://cover.sli.dev
title: 跨域与同源策略
info: |
  跨域与同源策略 —— 同源策略、CORS 简单/预检、凭证、JSONP/代理、SameSite 与 COOP/COEP
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:two-factor-authentication class="text-8xl" />
</div>

<br/>

## 跨域与同源策略

浏览器安全的地基：从「源」的边界，到 CORS、凭证、代理与跨源隔离

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
跨域是前端每天打交道、却最容易"只知报错不知所以然"的主题。这一章从"源"的定义讲起，把同源策略、CORS、凭证、JSONP/代理、SameSite 与跨源隔离串成一条线。
-->

---
transition: fade-out
---

# 这一章讲什么

一条主线：**浏览器如何用「源」划出安全边界，又如何合法跨越它**

<v-click>

- **同源策略与「源」**：协议+域名+端口三元组、SOP 拦什么、跨域 vs 跨站
- **跨域场景与报错**：哪些情况跨域、CORS 报错是浏览器拦的、DevTools 定位
- **CORS 简单与预检**：简单请求三条件、OPTIONS 预检、Max-Age 缓存
- **CORS 凭证与首部**：`credentials:'include'`、通配符 `*` 冲突、响应头六件套
- **JSONP 与反向代理**：`<script>` 豁免、开发/生产代理绕开 SOP
- **SameSite 与隔离**：Lax 默认防 CSRF、COOP/COEP/CORP 与 `crossOriginIsolated`

</v-click>

<v-click>

> 看懂"源边界 → 合法跨越"这条线，跨域问题就从玄学变成流程。

</v-click>

<!--
六个主题按"先立边界、再讲跨越、最后讲隔离"的顺序展开，每块都落到前端能用上的点。
-->

---
layout: section
---

# 同源策略与「源」

浏览器安全的地基

---

# 什么是同源策略 SOP

浏览器内置、默认开启的安全机制

<v-click>

- **同源策略（Same-Origin Policy）**：限制一个「源」的文档/脚本去**读取**另一个「源」的资源
- 它是 Web 安全的地基 —— Cookie 隔离、DOM 隔离、存储隔离都建在「源」这个边界上
- 核心不是"不让你发请求"，而是"**不让你读跨源的响应内容**"

</v-click>

<v-click>

> 没有 SOP：`evil.com` 的脚本就能带着你的 Cookie 去 `fetch('bank.com/account')` 读账户。

</v-click>

<!--
SOP 把每个源的脚本关进自己的笼子：可以向别人发请求，但默认读不到别人的响应、Cookie 和 DOM。"拦读取不拦发送"这点决定了它防不住 CSRF。
-->

---

# 「源」的定义：三元组

只有三者全等，两个 URL 才同源

<v-click>

- **协议（scheme）**：`http`、`https`
- **域名（host）**：`store.company.com`
- **端口（port）**：`80`、`443`、`8080`

</v-click>

<v-click>

- 路径、查询串、片段**都不影响**源的判定
- 端口省略时取协议默认端口（`http`→80，`https`→443）

</v-click>

<!--
源 = scheme + host + port 三元组。路径不参与判定，默认端口可省略，所以 http://a.com 与 http://a.com:80 同源。
-->

---

# 同源判定表

以 `http://store.company.com/dir/page.html` 为基准

<v-click>

| 对比 URL | 同源 | 原因 |
| --- | --- | --- |
| `.../dir2/other.html` | ✅ | 仅路径不同 |
| `https://store.company.com/...` | ❌ | 协议不同（https ≠ http） |
| `http://store.company.com:81/...` | ❌ | 端口不同（81 ≠ 80） |
| `http://news.company.com/...` | ❌ | 域名不同（news ≠ store） |

</v-click>

<v-click>

> 三个高频坑：`localhost` ≠ `127.0.0.1`、子域之间跨源、`http`→`https` 即跨源。

</v-click>

<!--
这张表出自 MDN 经典示例。务必记住：localhost 与 127.0.0.1 主机名字面不同就是跨源，联调时要统一。
-->

---

# SOP 拦哪些「读取」

管控的核心是跨源「读」，落到三类资源

<v-click>

- **① 跨源 DOM 访问**：读不到不同源 `<iframe>`/窗口的文档（`iframe.contentWindow.document` 抛错）
- **② 读跨源 AJAX/fetch 响应**：请求可能照常送达，但响应体默认不交给脚本
- **③ 读跨源 Cookie/存储**：Cookie、localStorage、sessionStorage、IndexedDB 按源隔离

</v-click>

<v-click>

> 三类都是"读"：跨窗口只保留 `postMessage`、`location` 写入等极有限的写/导航接口。

</v-click>

<!--
SOP 管的全是"读"。AJAX 那条是前端最常撞墙的——请求到了服务端、日志有记录，但响应被拦在脚本之外，除非 CORS 授权。
-->

---

# 能「加载」≠ 能「读」

跨源的嵌入与写入，SOP 反而放行

<v-click>

- **跨源嵌入**：`<img>`、`<script>`、`<link>`、`<video>`、`@font-face`、`<iframe>` 都可加载
- **跨源提交**：`<form action="https://other.com">` 可提交到任意源
- **跨源跳转**：超链接、重定向不受限

</v-click>

<v-click>

> 跨源 `<script>` 会**执行**、`<img>` 会**显示**，但 JS 拿不到源码/像素 —— 把跨源图片画进 canvas，canvas 被"污染"，`getImageData()` 报错。

</v-click>

<!--
SOP 限制的是"读"，不限"嵌入与写入"。这就是 CDN 能跨域加载脚本图片的原因，也正因为"跨源写"被放行，才有了 CSRF。
-->

---

# 跨域 ≠ 跨站

两把不同的尺子

<v-click>

| 维度 | 跨域（origin） | 跨站（site） |
| --- | --- | --- |
| 比较单位 | 协议+域名+端口 | 协议 + eTLD+1（可注册域） |
| 严格程度 | 更严格 | 更宽松 |
| 子域 | 不同 = 跨域 | 不同 = **同站** |
| 用在哪 | SOP / CORS | Cookie `SameSite`、COOP/COEP |

</v-click>

<v-click>

> 口诀：**同源一定同站，同站未必同源**。`www.a.com` 与 `api.a.com` 跨源但同站。

</v-click>

<!--
站点取"可注册域 eTLD+1"，由公共后缀列表决定。现代定义还带协议（schemeful）：http 与 https 算跨站。两套规则服务不同机制，别混。
-->

---
layout: section
---

# 跨域场景与报错

报错在哪、怎么读、怎么定位

---

# 什么情况会跨域

协议 / 域名 / 端口任一不同就触发

<v-click>

| 场景 | 当前页面 | 请求目标 | 为何跨域 |
| --- | --- | --- | --- |
| 调不同域名 API | `www.shop.com` | `api.shop.com` | 域名（子域也算） |
| 本地多端口 | `localhost:5173` | `localhost:8080` | 端口不同 |
| 协议未对齐 | `http://site` | `https://site` | 协议不同 |
| 联调线上 | `localhost:5173` | `api.prod.com` | 协议+域名 |
| 第三方接口 | `myapp.com` | `api.github.com` | 改不了对方后端 |

</v-click>

<v-click>

> `localhost` 与 `127.0.0.1` 主机名不同，也算两个源。

</v-click>

<!--
日常跨域几乎都落在这几类。子域跨域、localhost/127.0.0.1 跨域是最常被忽略的两个。
-->

---

# 最关键认知：是浏览器拦的

请求其实已经到服务器了

<v-click>

1. JS 调 `fetch('https://api.other.com/data')`
2. 浏览器**照常发出**，带 `Origin: https://myapp.com`
3. 服务器**收到并正常处理**，返回 `200` 和数据
4. 响应回来，浏览器检查有无匹配的 `Access-Control-Allow-Origin`
5. **没有 → 丢弃响应、不交给 JS**，控制台报错

</v-click>

<v-click>

> 所以"后端日志有 200、Postman 能通、网页却报跨域"再正常不过 —— curl/Postman 不执行同源策略。

</v-click>

<!--
这是跨域最高频的误区。CORS 是浏览器的安全策略，不是后端"拦截"。写操作可能已在服务器执行，排查方向千万别错。
-->

---

# `catch` 拿不到具体原因

CORS 失败的细节不暴露给 JS

<v-click>

```js
fetch("https://api.other.com/data")
  .then((res) => res.json()) // 走不到这里
  .catch((err) => {
    // 只拿到笼统的 TypeError: Failed to fetch
    // 拿不到状态码、响应体、具体 CORS 原因
    console.log(err.message);
  });
```

</v-click>

<v-click>

- 不能用 `catch` 区分「CORS 失败」还是「断网/超时」—— 都是 `Failed to fetch`
- 具体原因只在**浏览器控制台红字**里

</v-click>

<!--
出于安全，CORS 失败原因不给 JS。所以排查必须去 Console 看红字，不能靠 catch 里的 message。
-->

---

# 报错信息对照表

抓住"冒号后那句在抱怨哪个响应头"

<v-click>

| 报错关键片段 | 根因 |
| --- | --- |
| `No 'Access-Control-Allow-Origin' header` | 后端没开 CORS |
| `value ... not equal to the supplied origin` | 源写死 / 多源没回显 |
| `preflight ... does not have HTTP ok status` | OPTIONS 没返 2xx |
| `Method ... not allowed by Allow-Methods` | 方法没进白名单 |
| `header field ... not allowed by Allow-Headers` | 自定义头没放行 |
| `must not be the wildcard '*' ...` | 带凭证却回了 `*` |

</v-click>

<!--
报错文案会随浏览器版本微调，但根因不变。抓住它抱怨哪个响应头：Allow-Origin / Allow-Methods / Allow-Headers / wildcard，就能定位。
-->

---

# 用 DevTools Network 定位

控制台告诉你"哪个头"，Network 看真实往返

<v-click>

1. 打开 **Network**，勾选 **Fetch/XHR**，复现失败操作
2. 看是否多出一条 **`OPTIONS`**：
   - 有 → **预检请求**，问题在预检环节
   - 无 → **简单请求**，问题在真实响应缺头
3. 点开请求 → **Headers**：看 `Origin`、看响应有无 `Access-Control-Allow-*`
4. 看真实请求 Status：常是 **200 且有响应体**

</v-click>

<v-click>

> 预检 OPTIONS 标红 ≠ 接口挂了 —— 真实 GET/POST 那条才反映业务结果。

</v-click>

<!--
预检管"能不能发"，真实请求管"业务结果"，务必分开看。预检结果会被缓存（Max-Age），第二次看不到 OPTIONS 是正常的。
-->

---

# 排查决策树

把信息串成一条可执行路径

<v-click>

- **缺 `Allow-Origin`** → 后端没配 CORS，或没对该路由/方法生效
- **`Allow-Origin` 值不匹配** → 源写死，或多源没回显当前 `Origin`（常缺 `Vary: Origin`）
- **有 OPTIONS 且预检挂** → 方法 / 自定义头没进 `Allow-Methods` / `Allow-Headers`
- **带 Cookie 才挂** → 凭证四件套没配齐（见后文）

</v-click>

<v-click>

> 两个最易走偏：盯着前端改 `fetch`（根因多在后端）、用 Postman 验证就以为没问题。

</v-click>

<!--
绝大多数"缺 Allow-Origin"的根因在后端，前端改 header 没用（Origin 由浏览器控制，不能 JS 伪造）。验证浏览器行为必须在浏览器里复现。
-->

---
layout: section
---

# CORS 简单请求与预检

浏览器发请求，服务器用响应头授权

---

# CORS 是什么

跨源资源共享：基于 HTTP 头的协商

<v-click>

- 浏览器照常发跨源请求并带 `Origin`，**服务器用 `Access-Control-*` 响应头授权**
- 浏览器据此决定是否把响应交给脚本
- **授权方是服务器，执行方是浏览器**

</v-click>

<v-click>

```http
Access-Control-Allow-Origin: https://foo.example   # 只允许该源
Access-Control-Allow-Origin: *                      # 任意源（不可与凭证同用）
```

</v-click>

<v-click>

> CORS 是"放行白名单"保护**用户**，不是接口鉴权 —— curl 根本不受它约束。

</v-click>

<!--
CORS 拦的是"脚本读取响应"这一步，不是"不让请求发出去"。这解释了为什么接口返回 200、前端却拿不到数据。
-->

---

# 简单请求：三条件

须**同时**满足，才不触发预检

<v-click>

- **方法** ∈ `GET` / `HEAD` / `POST`
- **请求头**只含 CORS 安全头：`Accept`、`Accept-Language`、`Content-Language`、`Content-Type`、`Range`
- **`Content-Type`** 只能是三者之一：
  - `application/x-www-form-urlencoded`
  - `multipart/form-data`
  - `text/plain`

</v-click>

<v-click>

> 最常踩的坑：`Content-Type: application/json` **不在**允许值里 → `POST` JSON 会触发预检。

</v-click>

<!--
很多人误以为"POST 就是简单请求"，实际常被 Content-Type 卡住。发 JSON 是日常，但 application/json 不在三种允许值里。
-->

---

# 简单请求：流程与报文

不预检，直接发，仅自动附加 `Origin`

<v-click>

```http
GET /resources/public-data/ HTTP/1.1
Host: bar.other
Origin: https://foo.example
```

</v-click>

<v-click>

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://foo.example
Vary: Origin
```

</v-click>

<v-click>

> 浏览器比对 `Origin` 与 `Allow-Origin`：匹配则交给脚本，不匹配则拦响应、报错（但请求早已抵达，副作用可能已发生）。

</v-click>

<!--
回显具体源时务必加 Vary: Origin，否则 CDN 可能把"为 A 源生成的响应"错发给 B 源，导致跨源缓存污染。
-->

---

# 预检请求：何时触发

不满足简单请求任一条件，就先发预检

<v-click>

- 使用 `GET`/`HEAD`/`POST` **之外**的方法：`PUT`、`DELETE`、`PATCH`
- 携带任何**非安全头**：`Authorization`、`X-Requested-With`、`X-Token`…
- `Content-Type` 取了三种允许值之外的类型 —— 最典型的 `application/json`

</v-click>

<v-click>

> 预检在**真实请求之前**自动发出，用来向服务器"探路"：这些方法和头你允许吗？

</v-click>

<!--
预检是浏览器替你先问一句。任意一条简单请求条件不满足都会触发，PUT/DELETE、自定义头、JSON 是三大高频来源。
-->

---

# 预检报文：OPTIONS

用 `OPTIONS` 方法 + 两个专用请求头预告

<v-click>

```http
OPTIONS /doc HTTP/1.1
Host: bar.other
Origin: https://foo.example
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type
```

</v-click>

<v-click>

- `Access-Control-Request-Method`：真实请求**将用**的方法
- `Access-Control-Request-Headers`：真实请求**将带**的自定义头清单

</v-click>

<!--
预检固定用 OPTIONS，通过 Request-Method 和 Request-Headers 两个头"预告"真实请求的形态，等服务器答复。
-->

---

# 预检响应：Allow-Methods/Headers

方法与头都被覆盖，预检才通过

<v-click>

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://foo.example
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
```

</v-click>

<v-click>

> 预检失败 ≠ 真实请求被拒：预检不过，浏览器**不发**真实请求 —— 后端日志只看得到 `OPTIONS`，看不到 `POST`。

</v-click>

<!--
只有真实方法被 Allow-Methods 覆盖、所有自定义头被 Allow-Headers 覆盖，预检才通过，浏览器才发真实请求。排查时先看 OPTIONS 响应头是否齐全。
-->

---

# 预检缓存：Max-Age

避免每个非简单请求都预检一次

<v-click>

```http
Access-Control-Max-Age: 86400   # 缓存 24 小时
```

</v-click>

<v-click>

- 期内对**同一 URL + 同一方法与头组合**的请求**不再重复预检**
- 浏览器对该值有**上限**：超出会被截断
  - Chromium 系封顶 **7200 秒**（2 小时）
  - Firefox 上限 **86400 秒**

</v-click>

<!--
Max-Age 缓存预检结果，省下重复 OPTIONS 的开销。但设得再大也以浏览器上限为准，省略时默认仅 5 秒。
-->

---

# 简单请求 vs 预检请求

一张表收束区别

<v-click>

| 维度 | 简单请求 | 需预检请求 |
| --- | --- | --- |
| 是否先发 OPTIONS | 否 | 是 |
| 请求专用头 | 仅 `Origin` | `Origin` + `Request-Method/Headers` |
| 失败时副作用 | 请求已送达，可能已生效 | 真实请求不发，无副作用 |
| 网络往返 | 1 次 | 预检 + 真实（缓存期退回 1 次） |
| 典型例子 | `GET`、表单提交 | `PUT`/`DELETE`、JSON、带 `Authorization` |

</v-click>

<v-click>

> 铁律：**简单请求失败时请求已送达，预检失败时真实请求根本没发**。

</v-click>

<!--
这条铁律是排查的抓手：看到 catch 报错先判断是简单请求还是预检——前者副作用可能已发生，后者业务一定没执行。
-->

---
layout: section
---

# CORS 凭证与首部全谱

带 Cookie 的跨域，与响应头六件套

---

# 什么是带凭证的请求

跨域请求默认**匿名**，不带 Cookie

<v-click>

- **凭证三类**：Cookie（最常见）、HTTP 认证头（`Authorization`）、TLS 客户端证书
- 要携带身份信息，必须**前端开启 + 后端放行**双向同意
- 凭证是"全有或全无"：`include` 一开，三类按浏览器策略整体携带

</v-click>

<v-click>

> 即便前后端都配对，浏览器层面屏蔽了第三方 Cookie，请求里照样不会有它。

</v-click>

<!--
默认跨域不带 Cookie、也不让 Set-Cookie 生效。凭证明确指三类，且是整体携带，无法只带 Cookie 不带证书。
-->

---

# 前端：如何开启凭证

三种主流 API 的写法

<v-click>

```js
// 1) Fetch —— 'omit' / 'same-origin'(默认) / 'include'(跨域也带)
fetch("https://bar.other/api/profile", { credentials: "include" });

// 2) XMLHttpRequest
const xhr = new XMLHttpRequest();
xhr.open("GET", "https://bar.other/api/profile", true);
xhr.withCredentials = true; // 关键开关

// 3) EventSource（SSE）
new EventSource("https://bar.other/sse", { withCredentials: true });
```

</v-click>

<v-click>

> `fetch` 默认 `same-origin`：跨域要带 Cookie **必须显式写 `include`**，漏写是登录态丢失的高频原因。

</v-click>

<!--
现代 fetch 默认 same-origin：同源自动带、跨域不带。跨域带 Cookie 必须显式 include。
-->

---

# 服务端：如何放行凭证

两条响应头配合，缺一浏览器丢响应

<v-click>

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://foo.example  # 必须具体源，不能 *
Access-Control-Allow-Credentials: true            # 唯一合法值就是 true
Vary: Origin                                       # 回显具体源时必加
```

</v-click>

<v-click>

- `Allow-Credentials` 不需要时直接**省略**，别写 `false`
- 预检 `OPTIONS` 本身**从不带凭证**；预检过关后，真实请求才带

</v-click>

<!--
前端开了 include，服务端还得明确点头。Allow-Credentials 的唯一合法值是字符串 true，不需要时省略而非 false。
-->

---

# 头号坑：凭证 + 通配符 `*`

一旦带凭证，所有放行头都不能用 `*`

<v-click>

| 响应头 | 匿名请求 | 带凭证请求 |
| --- | :---: | --- |
| `Access-Control-Allow-Origin` | ✅ `*` | ❌ 必须回显具体源 |
| `Access-Control-Allow-Methods` | ✅ `*` | ❌ 逐个列举方法 |
| `Access-Control-Allow-Headers` | ✅ `*` | ❌ 逐个列举首部 |
| `Access-Control-Expose-Headers` | ✅ `*` | ❌ 逐个列举首部 |

</v-click>

<v-click>

> 带凭证时 `*` 被当作**字面星号源**做精确匹配，几乎必然失配报错。

</v-click>

<!--
原因：带凭证意味着响应可能含用户专属敏感数据。若允许 *，等于让任意源都能带受害者 Cookie 读响应，等同放开 CSRF 式数据窃取。
-->

---

# 正确做法：白名单 + 回显

不能图省事写 `*`，也不能无脑回显任意 `Origin`

<v-click>

```js
// Node/Express 伪代码
const ALLOW = new Set(["https://foo.example", "https://app.example"]);
const origin = req.headers.origin;
if (ALLOW.has(origin)) {
  res.setHeader("Access-Control-Allow-Origin", origin); // 回显具体源
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Vary", "Origin"); // 缓存按 Origin 分桶
}
```

</v-click>

<v-click>

> 报错关键词：`Credential is not supported if ... 'Access-Control-Allow-Origin' is '*'`。

</v-click>

<!--
正确姿势：维护源白名单，命中才把请求的 Origin 原样回显，并补 Vary: Origin。无脑回显任意 Origin 等于对所有源开放。
-->

---

# 响应头六件套

各司其职的 `Access-Control-*`

<v-click>

| 响应头 | 作用 |
| --- | --- |
| `Allow-Origin` | 哪个源可读响应（带凭证只能具体源） |
| `Allow-Methods` | 预检中声明允许的方法 |
| `Allow-Headers` | 预检中声明允许的自定义头 |
| `Allow-Credentials` | 是否允许携带凭证（仅 `true`） |
| `Expose-Headers` | 把额外响应头暴露给 JS 读 |
| `Max-Age` | 预检结果缓存秒数 |

</v-click>

<!--
六件套：前三个放行、Allow-Credentials 开凭证、Expose-Headers 决定 JS 能读哪些响应头、Max-Age 缓存预检。
-->

---

# Expose-Headers 与 Vary

两个易漏的细节

<v-click>

- **默认只暴露 7 个安全响应头**：`Cache-Control`、`Content-Language`、`Content-Length`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma`
- 要读 `X-Total-Count` 这类自定义头，必须显式 allowlist：

```http
Access-Control-Expose-Headers: X-Total-Count, X-Request-Id
```

</v-click>

<v-click>

> 只要 `Allow-Origin` 回显**具体源**（动态值），就必须加 `Vary: Origin`，否则缓存把 A 站响应错发给 B 站。

</v-click>

<!--
不配 Expose-Headers，JS 只能读 7 个 CORS 安全响应首部。Vary: Origin 告诉缓存按 Origin 分桶存储，互不串味。
-->

---
layout: section
---

# JSONP 与反向代理

CORS 之外的两条路

---

# JSONP：历史方案

借 `<script>` 的 SOP 豁免

<v-click>

1. 前端预先定义全局回调 `handleData`
2. 动态插 `<script>`，`src` 指向接口、把回调名作查询参数传过去
3. 服务器**不返回纯 JSON**，而返回 `handleData({...})` 这段 JS
4. 脚本加载即执行，回调被调用，前端拿到数据

</v-click>

<v-click>

> 原理：`<script>`/`<img>`/`<link>` 加载资源不受 SOP 限制 —— JSONP 钻的就是这个空子。

</v-click>

<!--
JSONP 利用标签加载不受 SOP 限制，让服务器返回"用回调包裹数据"的 JS。这是 CORS 之前的主力方案。
-->

---

# JSONP：为何被淘汰

四个硬伤，新项目不应再用

<v-click>

| 局限 | 说明 |
| --- | --- |
| 只支持 GET | `<script>` 无法 POST/PUT/DELETE，无法自定义头 |
| 无错误处理 | 只能监听 `onerror`，拿不到状态码与错误体 |
| 安全风险大 | 无条件执行第三方返回的任意 JS（XSS/数据投毒） |
| 需服务端配合 | 接口须支持非标准的 callback 包裹格式 |

</v-click>

<v-click>

> CORS 一举解决：支持所有方法、有标准错误语义、可带凭证、浏览器原生把关。

</v-click>

<!--
JSONP 还有全局污染（回调挂 window 要手动清理）。CORS 出现后这些痛点全消，JSONP 仅作极老浏览器/历史接口兜底。
-->

---

# 反向代理：为何能跨域

SOP 是**浏览器**限制，服务器间通信不受约束

<v-click>

```text
浏览器 ──同源请求──▶ 反向代理(同域) ──服务器间转发──▶ 目标后端(任意域)
        (不触发 SOP)                 (后端通信，无 SOP)
```

</v-click>

<v-click>

- 浏览器始终只与**同源代理**对话，根本不算跨域
- 代理在服务器侧转发到目标，再把响应带回 —— 整条链路无浏览器发起的跨源请求
- 能对接**不支持 CORS 的第三方**，也能聚合多后端到同一前缀

</v-click>

<!--
代理 vs CORS：CORS 是服务器显式授权浏览器跨源（需目标加响应头）；代理是让请求不再跨源（目标服务器无需改动）。
-->

---

# 开发环境代理：Vite

`server.proxy` 把前缀转发到后端，本地零 CORS

<v-click>

```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true, // 改写 Origin 为 target，后端当同源
        rewrite: (path) => path.replace(/^\/api/, ""), // /api/user -> /user
      },
      "/socket.io": { target: "ws://localhost:5174", ws: true }, // 代理 WS
    },
  },
});
```

</v-click>

<v-click>

> 仅开发生效：打包产物里没有它，生产需在部署层（nginx）配置。

</v-click>

<!--
要点：target 转发目标，changeOrigin 改写 Origin/Host 让后端当同源，rewrite 路径重写，ws 代理 WebSocket。webpack devServer.proxy 思路一致。
-->

---

# 生产环境代理：nginx

前端与 API 同域，CORS 从此无关

<v-click>

```nginx
server {
  location / {
    root /var/www/dist;
    try_files $uri $uri/ /index.html; # SPA 回退
  }
  location /api/ {
    proxy_pass http://127.0.0.1:3000/; # 末尾 / 剥掉 /api 前缀
    proxy_set_header Host $host;
  }
}
```

</v-click>

<v-click>

> `proxy_pass` 末尾的 `/`：带上则 `/api/user`→后端 `/user`；不带则原样保留，与 Vite `rewrite` 等价。

</v-click>

<!--
生产把前端静态资源和 API 放同域，nginx 按路径分流，前端与 API 同源，CORS 不再是问题。
-->

---

# 三种方案对比

按"目标是否可改 + 是否需凭证"选型

<v-click>

| 维度 | CORS | JSONP | 反向代理 |
| --- | --- | --- | --- |
| HTTP 方法 | 全部 | 仅 GET | 全部 |
| 错误处理 | 完善 | 几乎没有 | 完善 |
| 目标需改动 | 加 CORS 头 | 支持 callback | **无需改动** |
| 安全性 | 高 | **低** | 高 |
| 现状 | **现代首选** | 已淘汰 | 工程常用 |

</v-click>

<v-click>

> 接口需公开跨域用 **CORS**，自有后端 / 对接不可改的第三方用**反向代理**，JSONP 仅历史兜底。

</v-click>

<!--
另有 postMessage：用于跨窗口/iframe 之间的通信，属窗口间通信而非 AJAX 跨域，与本章"请求跨域"是两回事。
-->

---
layout: section
---

# SameSite 与跨源隔离

Cookie 携带、资源引用、window 隔离

---

# Cookie SameSite 三值

控制 Cookie 是否随**跨站**请求发送

<v-click>

| 取值 | 跨站请求 | 必须 Secure | 典型用途 |
| --- | --- | :---: | --- |
| `Strict` | **一律不带** | 否 | 银行转账、改密 |
| `Lax`（默认） | 仅顶级导航+安全方法 | 否 | 普通登录态 |
| `None` | **携带** | **是** | 跨站嵌入、第三方 SSO |

</v-click>

<v-click>

```http
Set-Cookie: sid=abc; SameSite=None; Secure
```

</v-click>

<!--
SameSite 是 Set-Cookie 的属性，决定第三方上下文（别人页面里的 img/fetch/表单跳转）能否带上你的登录态。None 必须配 Secure，否则浏览器拒写。
-->

---

# Lax 究竟放行什么

现代浏览器的默认值，需同时满足两条件

<v-click>

- **① 顶级导航**：会改变地址栏 URL —— 点链接跳转、`location` 赋值、`<form>` 提交
  - **排除**：`fetch()`、`<img>`/`<script>` 子资源、`<iframe>` 内导航
- **② 安全方法**：仅 `GET`/`HEAD`，**排除** `POST`/`PUT`/`DELETE`

</v-click>

<v-click>

> 从搜索结果点链接进入你的站点（顶级 GET 导航），Cookie 会带上、登录态保留 —— 这正是 Lax 兼顾安全与体验的设计。

</v-click>

<!--
"默认 Lax"比"显式 Lax"更宽松：未显式声明的 Cookie 在设置后 2 分钟内仍随跨站 POST 发送（兼容老式表单跳转）。不要依赖隐式默认。
-->

---

# SameSite 如何缓解 CSRF

从"带不带 Cookie"这一层切断攻击

<v-click>

- CSRF 本质：诱导你在已登录站点发出**非预期状态变更请求**，浏览器自动带 Cookie
- `Strict`/`Lax` 下，攻击者页面的跨站 `POST`/`fetch` **不自动带目标站 Cookie** → 落到服务端是"未登录"被拒
- `Lax` 仍放行顶级 GET 导航带 Cookie → **用 GET 做状态变更是危险的**

</v-click>

<v-click>

> SameSite 是 CSRF 防御的**纵深一层**，不是银弹 —— 仍需 CSRF Token / Origin 校验兜底。

</v-click>

<!--
默认 Lax 已挡掉大部分跨站表单 POST，这是浏览器层面的安全收紧。但同站子域被攻破、或必须用 None 的场景仍需 Token 兜底。
-->

---

# CORP：谁可以引用我

`Cross-Origin-Resource-Policy` 响应头

<v-click>

| 值 | 含义 |
| --- | --- |
| `same-origin` | 仅同源页面可引用本资源 |
| `same-site` | 同站即可引用（允许同站跨源） |
| `cross-origin` | 任意源都可引用（公共 CDN） |

</v-click>

<v-click>

- 由**资源所有者**声明，拦截 `no-cors` 模式的跨源读取（缓解 Spectre 侧信道）
- 与 CORS 互补：CORS 管"请求方读响应"，CORP 管"资源方被引用"

</v-click>

<!--
CORS 是请求方想读跨源响应时的协商，默认拦读取靠服务端放行；CORP 是资源方主动声明谁能引用我，针对 img/script 这类 no-cors 引用。
-->

---

# COOP / COEP：双重锁

通往「跨源隔离」的两个响应头

<v-click>

- **COOP（Opener-Policy）**：`same-origin` 把本页放入独立浏览上下文组，切断跨源 `window.opener` 互访（防 tabnabbing）
- **COEP（Embedder-Policy）**：`require-corp` 要求**所有**跨源子资源都带 CORP 或走 CORS，否则拒载

</v-click>

<v-click>

```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

</v-click>

<!--
COOP same-origin 下跨源 opener 互访被切断（表现为 null）。COEP require-corp 漏一个跨源资源就整页加载失败，建议先用 Report-Only 跑报告。
-->

---

# crossOriginIsolated

两个头同时满足，解锁强力能力

<v-click>

- **条件**：`COOP: same-origin` + `COEP: require-corp`，此时 `self.crossOriginIsolated === true`
- **解锁**：
  - `SharedArrayBuffer`（WebAssembly 多线程依赖）
  - 高精度 `performance.now()`（~100µs → **5µs** 级）
  - `measureUserAgentSpecificMemory()`

</v-click>

<v-click>

```js
if (self.crossOriginIsolated) {
  const sab = new SharedArrayBuffer(1024); // 安全使用
}
```

</v-click>

<!--
这些强力能力曾被 Spectre 当侧信道放大器，浏览器对策是：只有页面证明自己处于"跨源隔离"状态才解锁。CORP 为被引用资源放行，凑齐三件套。
-->

---
layout: center
class: text-center
---

# 小结

一条线：从「源」的边界到合法跨越

<v-click>

- **同源策略**：源 = 协议+域名+端口，SOP 拦跨源**读取**，跨域 ⊊ 同站
- **CORS**：浏览器发、服务器授权；简单请求三条件，预检靠 OPTIONS + Max-Age
- **凭证**：`credentials:'include'` + `Allow-Credentials`，带凭证一切放行头不能用 `*`
- **代理/JSONP**：反向代理让请求不再跨源（SOP 是浏览器限制），JSONP 已淘汰
- **隔离**：SameSite Lax 默认防 CSRF，COOP+COEP 解锁 `crossOriginIsolated`

</v-click>

<v-click>

> 吃透"源边界 → CORS → 凭证 → 代理 → 隔离"，跨域不再是玄学。

</v-click>

<!--
五块收束成一条线。CSRF 的完整攻防（Token、双提交、Origin 校验）属"浏览器安全"专题，本章只讲到 SameSite 这一层。
-->

---
layout: center
class: text-center
---

# 谢谢

跨域与同源策略 · 从「源」的边界读懂浏览器安全

<div class="mt-8 text-gray-400">
基于 HTTP 现代标准 · 面向前端工程师
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
全章围绕"源边界 → 合法跨越 → 跨源隔离"展开，覆盖 SOP、CORS 简单/预检、凭证、JSONP/代理、SameSite 与 COOP/COEP。感谢观看。
-->
