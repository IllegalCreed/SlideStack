---
theme: seriph
background: https://cover.sli.dev
title: Welcome to HTMX
info: |
  Presentation HTMX 2.0 for frontend developers.

  Learn more at [https://htmx.org](https://htmx.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <div class="text-7xl font-bold htmx-logo">&lt;/&gt;</div>
</div>

<br/>

## HTMX 2.0：hypermedia 驱动，让 HTML 重新成为协议

服务端返回 HTML 片段，前端只需要属性——无 JSON、无 SPA、~14 KB

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
.htmx-logo {
  background-image: linear-gradient(45deg, #3366CC 10%, #1F2D5C 90%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
今天聊 HTMX 2.0。

Carson Gross 2020 年开源的 hypermedia 框架——~14 KB 的 HTML 属性库，让服务端返回 HTML 片段取代 JSON，把 HATEOAS 原则重新带回工程实践。
-->

---
transition: fade-out
---

# 什么是 HTMX？

Carson Gross 主导的 hypermedia 驱动前端库，让 HTML 自身成为协议

<v-click>

- **HATEOAS 复兴**：服务端 HTML 同时表达「数据 + 可用动作 + 状态过渡」
- **HTML 原生属性**：`hx-get` `hx-post` `hx-target` `hx-swap` 而非 fetch + JSON
- **反 SPA 哲学**：不前后端分离、不写 JSON API、不维护客户端 store
- **任何后端可用**：Django / Rails / Laravel / FastAPI / Express / ASP.NET 都兼容
- **~14 KB Bundle**：一次加载、无构建步骤、无虚拟 DOM
- **配套生态**：response-targets / sse / ws / preload / idiomorph 等扩展
- **Hypermedia Systems 书**：Carson Gross 系统化讲述工程哲学

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_HTMX_](https://htmx.org/)

</div>

<style>
h1 {
  background-color: #1F2D5C;
  background-image: linear-gradient(45deg, #1F2D5C 10%, #3366CC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---
transition: slide-up
level: 2
---

# 评价

把复杂度从「前端 SPA + JSON API + 状态同步」压回「后端 + HTML」

<v-clicks>

**优点**
- 心智模型回归 HTML 原生，全栈/后端工程师学习曲线极平缓
- 复杂度大幅下降，无 JSON Schema / 类型同步 / SPA 路由 / 客户端 store
- Bundle 体积极小（~14 KB），无构建步骤、无虚拟 DOM
- HATEOAS 工程化，服务端返回的 HTML 自带可用动作
- 与服务端框架天然契合，复用后端原生 partials / views
- 扩展生态实用，覆盖错误分发 / 实时 / 预加载 / DOM 合并

**缺点**
- 不适合「高度本地状态」（图形编辑器、IDE、3D、协同白板）
- 离线 / PWA 弱，每次交互依赖服务端往返
- 前端工具链断层，无 Vite/HMR 体验、无 TypeScript 强类型
- 测试范式不同，主体转向 E2E + 后端集成测试
- 后端必须能返回 HTML，纯 JSON 后端落地价值急剧下降
- HATEOAS 哲学有争议，部分工程师认为「回到 90 年代」

</v-clicks>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 关键特性 |
|---|---|---|
| **0.x** | 2020 | intercooler.js 改名为 htmx |
| **1.0** | 2020.11 | 首个稳定版，确立 hx-* 属性范式 |
| **1.5** | 2021.10 | hx-boost / hx-vals / morph 扩展 |
| **1.7** | 2022.4 | hx-on / hx-sync / OOB swap 完善 |
| **1.9** | 2023.5 | response-targets / preload 稳定 |
| **2.0** | 2024.6 | 移除 IE11 支持 / `hx-on:` 多属性 / 默认行为收紧 |
| **2.0.10** | 2025 | 当前稳定版 |

<v-click>

**今天主要讲 2.0**。新项目用 2.x，老项目 1.x 可加 `htmx-1-compat` 扩展平滑迁移。

</v-click>

---
transition: slide-up
---

# 心智模型：HTMX 是「hypermedia 驱动」不是「SPA」

**根本差异：前端不持有应用状态——服务端永远是「当前真相」，前端只是渲染窗口**

```html
<button hx-post="/incr"
        hx-target="#count"
        hx-swap="innerHTML">
  +1
</button>
<span id="count">0</span>
```

服务端响应：`<span>1</span>`——HTMX 把它替换到 `#count`。**整个流程无一行 JS**。

<v-click>

对比 SPA：

| 维度 | HTMX | SPA |
|---|---|---|
| 数据载体 | HTML 片段 | JSON |
| 应用状态 | 服务端 + URL | 客户端 store |
| 类型同步 | 不需要 | OpenAPI / tRPC / GraphQL |
| 体积 | ~14 KB | 50-200 KB |
| 学习曲线 | 平缓 | 陡 |

</v-click>

---
transition: slide-up
---

# Carson Gross 与 Hypermedia Systems

<div class="grid grid-cols-2 gap-8">
<div>

**作者**
- **Carson Gross**：HTMX / \_hyperscript 主创
- **Adam Stepinski**：Hyperview（HTMX 移动端）
- **Deniz Akşimşek**：HTMX 核心贡献
- **Mike Amundsen**：REST 老前辈，作序

**HTMX 前身**
- 2013 年 jQuery 时代 intercooler.js
- 2020 年改名 htmx，去 jQuery 依赖
- Big Sky Software 维护

</div>
<div>

**配套书《Hypermedia Systems》**
- CC BY-NC-SA 开源 / 免费在线
- 纸质 + 电子版可购买
- 案例：HTMX（Web）+ Hyperview（Mobile）
- 内容：HATEOAS / REST / hypermedia 工程哲学

</div>
</div>

<v-click>

> "Hypermedia is the simplest, most resilient distributed system we have." —— Carson Gross

</v-click>

---
transition: slide-up
---

# HATEOAS 复兴

Roy Fielding 2000 年 REST 论文核心约束：**Hypermedia As The Engine Of Application State**

<v-click>

**JSON 范式失去 HATEOAS**：

```json
{ "id": 1, "name": "Alice", "balance": -100 }
```

- 客户端不知道余额负数能不能转账（要查文档）
- 客户端不知道 `/users/1/transfer` 在哪（要查文档）
- 字段名变更需要前后端同步（类型/Schema 同步开销）

</v-click>

<v-click>

**HTML 天然 HATEOAS**：

```html
<div>
  <span>余额：100</span>
  <form action="/transfer" method="POST">
    <input name="amount"><input name="target"><button>转账</button>
  </form>
</div>
```

余额不足时服务端不渲染 form——**客户端就自然不能转账**。状态、可用动作、过渡条件全在一个 HTML 响应里。

</v-click>

---
transition: slide-up
---

# 快速开始

```html
<!-- CDN：一行搞定 -->
<script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.10/dist/htmx.min.js"></script>

<button hx-get="/hello" hx-target="#out" hx-swap="innerHTML">Click</button>
<div id="out"></div>
```

```bash
# npm
pnpm add htmx.org@2.0.10
```

<v-click>

服务端（Express 示例）：

```js
app.get('/hello', (req, res) => {
  res.send('<p>Hello, world!</p>')   // 返回 HTML 而非 JSON
})
```

**关键点**：服务端不返回 JSON、前端不写 JS、状态在服务端。

</v-click>

---
transition: slide-up
---

# 核心：5 个 HTTP 动词属性

```html
<!-- GET：读 -->
<button hx-get="/users">Load</button>

<!-- POST：创建 -->
<form hx-post="/users">
  <input name="email"><button>Submit</button>
</form>

<!-- PUT：整体更新 -->
<button hx-put="/users/1">Replace</button>

<!-- PATCH：部分更新 -->
<button hx-patch="/users/1">Update name</button>

<!-- DELETE：删除 -->
<button hx-delete="/users/1">Delete</button>
```

<v-click>

默认触发事件：

- `<form>` → submit
- `<input>` / `<textarea>` / `<select>` → change
- 其他元素 → click

</v-click>

---
transition: slide-up
---

# hx-target：响应替换位置

```html
<!-- 替换 #result -->
<button hx-get="/x" hx-target="#result">Click</button>

<!-- 替换自身 -->
<button hx-get="/x" hx-target="this">Click</button>

<!-- 最近的祖先 -->
<button hx-get="/x" hx-target="closest li">Click</button>

<!-- 子树内查找 -->
<button hx-get="/x" hx-target="find .preview">Click</button>

<!-- 兄弟节点 -->
<button hx-get="/x" hx-target="next .item">Click</button>
<button hx-get="/x" hx-target="previous .item">Click</button>
```

<v-click>

支持的扩展选择器：`this` / `closest <sel>` / `find <sel>` / `next <sel>` / `previous <sel>` / 普通 CSS 选择器。

子元素**自动继承**父级 `hx-target`——用 `hx-disinherit="hx-target"` 阻止。

</v-click>

---
transition: slide-up
---

# hx-swap：替换策略

| 值 | 行为 |
|---|---|
| `innerHTML`（默认） | 替换目标内部 |
| `outerHTML` | 替换整个目标元素 |
| `textContent` | 作为纯文本插入 |
| `beforebegin` | 插入到目标前面 |
| `afterbegin` | 插入到目标内最前 |
| `beforeend` | 插入到目标内最后（常见追加） |
| `afterend` | 插入到目标后面 |
| `delete` | 删除目标（忽略响应） |
| `none` | 不替换（OOB 仍生效） |

<v-click>

```html
<!-- 列表追加 -->
<form hx-post="/items" hx-target="#list" hx-swap="beforeend">...</form>

<!-- 删除自身 -->
<button hx-delete="/items/1" hx-target="closest li" hx-swap="delete">×</button>
```

</v-click>

---
transition: slide-up
---

# hx-swap 修饰符

```html
<!-- 延迟交换（动画用） -->
<button hx-get="/x" hx-swap="innerHTML swap:500ms">Click</button>

<!-- View Transitions API -->
<button hx-get="/x" hx-swap="innerHTML transition:true">Click</button>

<!-- 滚动 -->
<button hx-get="/x" hx-swap="innerHTML scroll:top">Click</button>
<button hx-get="/x" hx-swap="innerHTML show:bottom">Click</button>

<!-- 忽略 title -->
<button hx-get="/x" hx-swap="innerHTML ignoreTitle:true">Click</button>
```

<v-click>

**组合**：

```html
<button hx-get="/x"
        hx-swap="innerHTML swap:500ms settle:1s scroll:top transition:true">
  Click
</button>
```

</v-click>

---
transition: slide-up
---

# Out-of-band swap

`hx-swap-oob` 让响应中的某个元素**额外**替换页面其他位置——超越 `hx-target` 限制

```html
<!-- 客户端 -->
<button hx-post="/incr" hx-target="#counter" hx-swap="innerHTML">+1</button>
<div id="counter">0</div>
<div id="message"></div>
```

```html
<!-- 服务端响应 -->
<span>1</span>   <!-- 替换 #counter（主交换） -->
<div id="message" hx-swap-oob="true">已加 1</div>  <!-- OOB 替换 -->
```

<v-click>

OOB 可以指定 swap 策略：

```html
<div id="alerts" hx-swap-oob="beforeend">
  <p>新提醒</p>
</div>
```

**注意**：OOB 元素必须有 `id`。

</v-click>

---
transition: slide-up
---

# hx-trigger：事件 + 修饰符

```html
<!-- 加载即触发（lazy load） -->
<div hx-get="/data" hx-trigger="load">Loading...</div>

<!-- 滚动可见时（无限滚动） -->
<div hx-get="/more" hx-trigger="revealed">Loading...</div>

<!-- 轮询：每 2 秒 -->
<div hx-get="/stats" hx-trigger="every 2s"></div>

<!-- 防抖搜索 -->
<input hx-get="/search" hx-trigger="keyup changed delay:300ms" name="q">

<!-- 自定义事件（跨元素通信） -->
<div hx-get="/refresh" hx-trigger="myEvent from:body"></div>
```

<v-click>

**修饰符**：`once` / `changed` / `delay:Xs` / `throttle:Xs` / `from:selector` / `target:selector` / `consume` / `queue:策略` / `[boolean-expr]` / `intersect threshold:0.5`

</v-click>

---
transition: slide-up
---

# 表单：自动收集 + hx-vals + hx-include

```html
<!-- 表单内 name 字段自动收集 -->
<form hx-post="/login">
  <input name="email"><input name="password" type="password">
  <button>Login</button>
</form>
```

<v-click>

```html
<!-- 附加静态值 -->
<button hx-post="/track" hx-vals='{"source": "header"}'>Track</button>

<!-- 动态值（js: 前缀 = eval） -->
<button hx-post="/log" hx-vals='js:{"ts": Date.now()}'>Log</button>

<!-- 跨表单收集 -->
<input id="q" name="q">
<button hx-get="/search" hx-include="#q" hx-target="#list">Search</button>

<!-- 文件上传 -->
<form hx-post="/upload" hx-encoding="multipart/form-data">
  <input type="file" name="file"><button>Upload</button>
</form>
```

</v-click>

---
transition: slide-up
---

# URL 导航：hx-push-url / hx-replace-url

```html
<!-- 点击后地址栏变为 /profile/123 -->
<button hx-get="/profile/123"
        hx-target="#main"
        hx-push-url="true">Profile</button>

<!-- 自定义 URL（API URL 和地址栏 URL 分离） -->
<button hx-get="/api/profile/123"
        hx-target="#main"
        hx-push-url="/profile/123">Profile</button>

<!-- replace 而不是 push -->
<button hx-get="/x" hx-replace-url="true">Click</button>
```

<v-click>

**服务端配合**：用户直接访问 `/profile/123` 或刷新页面时，服务端必须能返回完整页面（含外壳），通过 `HX-Request` 请求头区分：

```python
def profile(request, id):
    template = 'partials/profile.html' if request.htmx else 'profile.html'
    return render(request, template, {'user': User.objects.get(id=id)})
```

</v-click>

---
transition: slide-up
---

# 验证与错误处理

```html
<!-- 弹原生 confirm -->
<button hx-delete="/users/1" hx-confirm="确定删除？">Delete</button>

<!-- 弹 prompt 输入 -->
<button hx-post="/comments" hx-prompt="评论：">Add</button>
```

<v-click>

HTMX **默认不交换 4xx/5xx 响应**——只触发 `htmx:responseError` 事件。处理错误用 `response-targets` 扩展：

```html
<body hx-ext="response-targets">
  <button hx-post="/login"
          hx-target="#result"
          hx-target-401="#auth-error"
          hx-target-422="#validation-error"
          hx-target-error="#general-error">
    Login
  </button>
</body>
```

`hx-target-NNN` / `hx-target-NXX` / `hx-target-error` 三档语法。

</v-click>

---
transition: slide-up
---

# 加载指示器

```html
<button hx-get="/slow" hx-indicator="#spinner">Load</button>
<img id="spinner" class="htmx-indicator" src="/spinner.svg">
```

```css
.htmx-indicator { opacity: 0; transition: opacity 200ms; }
.htmx-request .htmx-indicator { opacity: 1; }
.htmx-request.htmx-indicator { opacity: 1; }
```

<v-click>

请求期间 HTMX 自动给元素加 `htmx-request` class——可用于任意样式：

```css
.htmx-request { pointer-events: none; opacity: 0.6; }
button.htmx-request::after { content: " loading..."; }
```

`hx-disabled-elt` 禁用元素：

```html
<button hx-post="/save" hx-disabled-elt="this">Save</button>
```

</v-click>

---
transition: slide-up
---

# hx-boost：渐进增强

让普通 `<a>` 和 `<form>` 走 AJAX，**无需改链接**

```html
<body hx-boost="true">
  <nav>
    <a href="/home">Home</a>     <!-- 自动变 AJAX -->
    <a href="/about">About</a>
  </nav>

  <form action="/search" method="GET">  <!-- 自动变 AJAX -->
    <input name="q"><button>Search</button>
  </form>
</body>
```

<v-click>

`hx-boost` 行为：

- 默认 `hx-target="body"` + `hx-swap="innerHTML"`
- 默认 `hx-push-url="true"`
- **禁用 JS 时降级**——链接仍能正常工作

```html
<!-- 单链接禁用 boost -->
<a href="/external" hx-boost="false">External link</a>
```

</v-click>

---
transition: slide-up
---

# 扩展生态：官方

| 扩展 | 用途 |
|---|---|
| `head-support` | 合并响应 `<head>` 内容 |
| `htmx-1-compat` | HTMX 1.x 兼容 |
| `idiomorph` | 智能 DOM 合并（保留状态） |
| `preload` | 悬停 prefetch |
| `response-targets` | 按状态码分发 target |
| `sse` | Server-Sent Events |
| `ws` | WebSocket |

<v-click>

```html
<!-- 在 body 上启用 -->
<body hx-ext="response-targets, preload, sse, ws, morph">
  ...
</body>

<!-- 必须单独引入 script -->
<script src=".../htmx-ext-response-targets.js"></script>
<script src=".../htmx-ext-sse.js"></script>
```

</v-click>

---
transition: slide-up
---

# 扩展生态：社区

| 扩展 | 用途 |
|---|---|
| `loading-states` | 声明式 loading UI |
| `class-tools` | 定时增删 class |
| `json-enc` | 发送 JSON 而非 form-urlencoded |
| `multi-swap` | 一次响应交换多个元素 |
| `alpine-morph` | 用 Alpine.morph 算法 swap |
| `client-side-templates` | JSON 响应客户端模板 |
| `remove-me` | 定时移除元素 |
| `path-deps` | 声明 endpoint 间依赖 |
| `signalr` | SignalR 实时通信 |
| `no-cache` | 禁用客户端缓存 |

<v-click>

社区扩展超过 30 个，覆盖 90% 工程需求——**很多需求不需要写 JS**。

</v-click>

---
transition: slide-up
---

# WebSocket 内置（ws 扩展）

```html
<script src="https://unpkg.com/htmx-ext-ws@2.0.0"></script>

<div hx-ext="ws" ws-connect="/chat">
  <div id="messages"></div>
  <form ws-send>
    <input name="message"><button>Send</button>
  </form>
</div>
```

<v-click>

```python
# FastAPI 服务端
@app.websocket("/chat")
async def chat_socket(ws: WebSocket):
    await ws.accept()
    while True:
        data = await ws.receive_json()
        # 推送 HTML 片段（带 OOB）
        await ws.send_text(
            f'<div hx-swap-oob="beforeend:#messages"><p>{data["message"]}</p></div>'
        )
```

WebSocket 与 HTMX 之间：**消息载体仍是 HTML**——通过 OOB 找 DOM 位置交换。

</v-click>

---
transition: slide-up
---

# Server-Sent Events（sse 扩展）

```html
<script src="https://unpkg.com/htmx-ext-sse@2.2.2"></script>

<div hx-ext="sse" sse-connect="/stream" sse-swap="message">
  <div id="output">等待消息...</div>
</div>
```

<v-click>

```python
# FastAPI 服务端
from sse_starlette.sse import EventSourceResponse

@app.get("/stream")
async def stream():
    async def event_gen():
        for i in range(10):
            yield {"event": "message", "data": f"<p>消息 {i}</p>"}
            await asyncio.sleep(1)
    return EventSourceResponse(event_gen())
```

</v-click>

<v-click>

**精细控制**：

```html
<!-- 多个事件 -->
<div sse-connect="/stream" sse-swap="msg,alert,heartbeat"></div>

<!-- SSE 触发 HX-Trigger 风格事件 -->
<div sse-connect="/stream"
     hx-trigger="sse:refresh"
     hx-get="/refresh"></div>
```

</v-click>

---
transition: slide-up
---

# 与 Alpine.js 配合

**HTMX 处理服务端通信，Alpine 处理纯客户端状态**——分工清晰

```html
<script src="https://unpkg.com/alpinejs" defer></script>
<script src="https://unpkg.com/htmx.org@2.0.10"></script>

<div x-data="{ filterOpen: false }">
  <!-- 搜索：HTMX -->
  <input hx-get="/search"
         hx-target="#results"
         hx-trigger="keyup changed delay:300ms"
         name="q">

  <!-- 过滤下拉：Alpine -->
  <button @click="filterOpen = !filterOpen">过滤</button>
  <div x-show="filterOpen" x-transition>
    <label><input type="checkbox"
                  hx-get="/search"
                  hx-trigger="change"
                  hx-target="#results"> 只看活跃</label>
  </div>

  <ul id="results"></ul>
</div>
```

---
transition: slide-up
---

# hx-on：简单场景替代 Alpine

HTMX 2.0+ `hx-on:` 让 HTML 直接绑事件，**简单场景可不引 Alpine**

```html
<!-- 监听 click -->
<button hx-on:click="alert('Clicked')">Click</button>

<!-- 监听 HTMX 自定义事件 -->
<div hx-get="/x"
     hx-on:htmx:after-request="this.classList.add('loaded')">
  Click
</div>

<!-- 监听键盘 -->
<input hx-on:keyup="console.log(this.value)">
```

<v-click>

**HTMX 2.x 多属性语法**（推荐） vs **1.x 单属性**：

```html
<!-- 2.x（推荐） -->
<button hx-on:click="..." hx-on:htmx:after-request="...">Click</button>

<!-- 1.x（兼容） -->
<button hx-on="click: ...; htmx:after-request: ...">Click</button>
```

</v-click>

---
transition: slide-up
---

# 与 Hotwire（Rails Turbo）对比

| 维度 | HTMX | Hotwire |
|---|---|---|
| 维护方 | Big Sky Software | 37signals（Rails） |
| 后端绑定 | 无（框架无关） | 偏向 Rails |
| AJAX 模型 | 5 个 HTTP 动词属性 | Turbo Drive / Frames / Streams |
| WebSocket | 扩展（ws） | Turbo Streams（内置） |
| 客户端行为 | `_hyperscript` / Alpine | Stimulus（控制器范式） |
| 哲学 | hypermedia / HATEOAS | 服务端渲染 + 渐进增强 |

<v-click>

**怎么选**：

- **Hotwire**：Rails 全家桶、需要 Turbo Streams 服务端推送
- **HTMX**：非 Rails 后端（Django / Laravel / FastAPI / Express）、希望框架无关

</v-click>

---
transition: slide-up
---

# 与 LiveView 类技术对比

| 维度 | HTMX | LiveView（Phoenix / Livewire / Blazor） |
|---|---|---|
| 协议 | 标准 HTTP | WebSocket（持续连接） |
| 服务端状态 | stateless（REST） | stateful（per-connection） |
| 网络要求 | 不需要常连 | 长连接 |
| 失联恢复 | 自然（HTTP 重试） | 需要 reconnect 协议 |
| 客户端体积 | ~14 KB | LiveView client ~50 KB |
| 扩展性 | 横向扩展简单 | 单连接服务端内存压力 |

<v-click>

**怎么选**：

- **LiveView**：实时性极高、单页停留时间长、可接受 stateful 后端
- **HTMX**：常规 CRUD + 局部交互、保持 REST stateless

</v-click>

---
transition: slide-up
---

# Idiomorph：HTMX 推荐的 DOM 合并

**核心思想**：用 **id 优先匹配** + **内容相似度匹配**，避免简单位置 diff 导致的状态丢失

<v-click>

**问题**：默认 innerHTML 替换会销毁所有子节点

```html
<!-- 原 DOM -->
<ul id="list">
  <li>A <input value="x"></li>
  <li>B <input value="y"></li>  <!-- 用户聚焦此 input -->
</ul>

<!-- 服务端返回 -->
<ul id="list">
  <li>A <input value="x"></li>
  <li>新 <input></li>
  <li>B <input value="y"></li>
</ul>
```

- **innerHTML 替换**：整个 ul 重建，B 的 input 失焦
- **Idiomorph**：识别 A / B 不变，只插入新 li——**B 的 input 保留焦点**

</v-click>

---
transition: slide-up
---

# Idiomorph 用法

```html
<script src="https://unpkg.com/idiomorph@0.7.4/dist/idiomorph-ext.min.js"></script>
<body hx-ext="morph">
  <button hx-get="/list"
          hx-target="#list"
          hx-swap="morph:innerHTML">Refresh</button>
  <ul id="list">...</ul>
</body>
```

<v-click>

支持的 swap 值：

- `morph` —— 默认 outerHTML 风格
- `morph:innerHTML`
- `morph:outerHTML`

**vs morphdom**：

| 维度 | Idiomorph | Morphdom |
|---|---|---|
| 算法 | id + 内容相似度 | 同级位置匹配 |
| 处理移动 | 智能（id 跟踪） | 容易误判 |
| HTMX 官方推荐 | 是 | 备选 |

</v-click>

---
transition: slide-up
---

# 实战：Django 集成

```python
# views.py
def todo_list(request):
    todos = Todo.objects.all()
    template = 'partials/list.html' if request.htmx else 'list.html'
    return render(request, template, {'todos': todos})

def toggle(request, pk):
    todo = Todo.objects.get(pk=pk)
    todo.done = not todo.done
    todo.save()
    return render(request, 'partials/todo_item.html', {'todo': todo})
```

<v-click>

```html
<!-- partials/todo_item.html -->
<li id="todo-{{ todo.id }}" class="{% if todo.done %}done{% endif %}">
  <input type="checkbox"
         hx-post="{% url 'toggle' todo.id %}"
         hx-target="#todo-{{ todo.id }}"
         hx-swap="outerHTML"
         {% if todo.done %}checked{% endif %}>
  {{ todo.title }}
</li>
```

社区库：[django-htmx](https://github.com/adamchainz/django-htmx)（`request.htmx` + CSRF）

</v-click>

---
transition: slide-up
---

# 实战：Rails 集成

```ruby
# controllers/todos_controller.rb
class TodosController < ApplicationController
  def update
    @todo = Todo.find(params[:id])
    @todo.update!(todo_params)
    render partial: 'todo', locals: { todo: @todo }
  end

  def destroy
    Todo.find(params[:id]).destroy!
    head :no_content
  end
end
```

```erb
<%# views/todos/_todo.html.erb %>
<li id="todo-<%= todo.id %>">
  <%= todo.title %>
  <button hx-delete="<%= todo_path(todo) %>"
          hx-target="closest li"
          hx-swap="delete">×</button>
</li>
```

<v-click>

社区库：[htmx-rails](https://rubygems.org/gems/htmx-rails)（视图 helpers + Sprockets 集成）

</v-click>

---
transition: slide-up
---

# 实战：Laravel + FastAPI

```php
// Laravel: routes/web.php
Route::post('/todos', fn (Request $r) => view('partials.todo-item', [
    'todo' => Todo::create($r->validate(['title' => 'required'])),
]));
```

<v-click>

```python
# FastAPI
from fastapi import FastAPI, Request, Form
from fastapi.templating import Jinja2Templates

app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.post("/todos")
async def create_todo(request: Request, title: str = Form(...)):
    todo = await Todo.create(title=title)
    return templates.TemplateResponse(
        "partials/todo.html",
        {"request": request, "todo": todo}
    )
```

</v-click>

<v-click>

社区库：[laravel-htmx](https://github.com/protonemedia/laravel-htmx) / [fastapi-htmx](https://pypi.org/project/fastapi-htmx/)

</v-click>

---
transition: slide-up
---

# 实战：Express 集成

```js
import express from 'express'
import ejs from 'ejs'

const app = express()
app.set('view engine', 'ejs')

app.post('/todos', async (req, res) => {
  const todo = await db.createTodo(req.body)
  if (req.get('HX-Request')) {
    res.render('partials/todo', { todo })
  } else {
    res.redirect('/')
  }
})

app.delete('/todos/:id', async (req, res) => {
  await db.deleteTodo(req.params.id)
  res.send('')   // 返回空字符串，配合 hx-swap="delete"
})

app.listen(3000)
```

<v-click>

社区库：[express-htmx](https://www.npmjs.com/package/express-htmx)

</v-click>

---
transition: slide-up
---

# 常见模式：搜索

```html
<input hx-get="/search"
       hx-target="#results"
       hx-trigger="keyup changed delay:300ms, search"
       name="q"
       placeholder="搜索">
<ul id="results"></ul>
```

<v-click>

**修饰符解析**：

- `keyup` —— 监听键盘抬起
- `changed` —— 只有值改变才触发（避免方向键触发）
- `delay:300ms` —— 防抖
- `search` —— 也监听 search 事件（清空按钮触发）

</v-click>

---
transition: slide-up
---

# 常见模式：无限滚动

```html
<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
  <!-- 哨兵元素：进入视口时拉下一页 -->
  <div hx-get="/items?page=2"
       hx-trigger="revealed"
       hx-target="#list"
       hx-swap="beforeend">
    Loading...
  </div>
</ul>
```

<v-click>

服务端返回时**自带下一页哨兵**——天然递归：

```html
<!-- 服务端返回 /items?page=2 -->
<li>Item 11</li><li>Item 12</li>...<li>Item 20</li>

<div hx-get="/items?page=3"
     hx-trigger="revealed"
     hx-target="#list"
     hx-swap="beforeend">
  Loading...
</div>
```

</v-click>

---
transition: slide-up
---

# 常见模式：inline 编辑

```html
<!-- 显示态 -->
<div id="name" hx-get="/users/1/edit" hx-swap="outerHTML">
  Alice <button>Edit</button>
</div>
```

<v-click>

```html
<!-- 服务端返回编辑表单 -->
<form id="name" hx-put="/users/1" hx-swap="outerHTML">
  <input name="name" value="Alice">
  <button>Save</button>
  <button hx-get="/users/1"
          hx-swap="outerHTML"
          hx-target="#name">Cancel</button>
</form>
```

</v-click>

<v-click>

PUT 成功后服务端返回新的显示态——**HTML 一次响应自包含 UI 状态机的所有过渡**。

</v-click>

---
transition: slide-up
---

# 常见模式：服务端触发刷新

服务端通过 `HX-Trigger` 响应头让客户端触发自定义事件——多元素联动

```http
HTTP/1.1 200 OK
HX-Trigger: refresh-stats, refresh-notifications
```

<v-click>

```html
<!-- 多个元素监听同一个事件 -->
<div hx-get="/stats" hx-trigger="refresh-stats from:body"></div>
<div hx-get="/notifications" hx-trigger="refresh-notifications from:body"></div>
```

</v-click>

<v-click>

带数据：

```http
HX-Trigger: {"show-toast": {"level": "info", "message": "Saved"}}
```

```js
document.body.addEventListener('show-toast', e => {
  showToast(e.detail.level, e.detail.message)
})
```

</v-click>

---
transition: slide-up
---

# 心智模型对比：HTMX vs SPA

| 场景 | HTMX | SPA |
|---|---|---|
| 用户信息 | 服务端 + 当前页 HTML | 客户端 store |
| 表单输入中 | DOM（form value） | 客户端 store |
| 列表筛选条件 | URL query string | 客户端 store |
| 错误信息 | HTML 错误段 | store + Toast |
| 加载状态 | `htmx-request` class | store + Spinner |
| 路由切换 | URL + 服务端响应 | client router |
| 类型同步 | 不需要 | OpenAPI / tRPC |

<v-click>

**HTMX 数据流**：

```
用户操作 → HTML 属性触发 → HTTP 请求 → 服务端处理 → 返回 HTML 片段 → DOM 替换
```

**SPA 数据流**：

```
用户操作 → 事件 handler → action → reducer/store → 重新渲染 → DOM diff/patch
```

</v-click>

---
transition: slide-up
---

# 反模式与陷阱

<v-clicks>

- **在 HTMX 项目搞 JSON API** → 失去 hypermedia 全部价值，要么用 React/Vue，要么完整接受「服务端返回 HTML」
- **滥用 hx-vals 的 `js:` 前缀** → 用户输入永远不要拼接进去（XSS）
- **用 HTMX 做纯前端状态** → modal 显隐应该用 Alpine / \_hyperscript
- **不区分 HX-Request** → 直接访问页面会得到没有外壳的 HTML 片段
- **忘记 CSRF token** → 在 `htmx:configRequest` 事件中注入
- **GET 上做敏感操作** → 删除、转账必须用 POST / DELETE
- **hx-trigger 未防抖** → 输入触发服务端洪水
- **大量小请求未开 HTTP/2** → HOL 阻塞拖慢

</v-clicks>

---
transition: slide-up
---

# 性能优化

<v-clicks>

**1. 服务端 HTML 缓存**

```python
@cache_page(60)  # 1 分钟
def todo_count(request):
    return render(request, 'partials/count.html', ctx)
```

**2. preload 扩展（悬停 prefetch）**

```html
<body hx-ext="preload">
  <a hx-get="/heavy-report" preload>Open report</a>
</body>
```

**3. hx-select 减少传输**

```html
<button hx-get="/page" hx-select="#content" hx-target="#main">Click</button>
```

**4. 客户端 history 缓存**

默认 10 页 sessionStorage 缓存，按返回不发请求（`htmx.config.historyCacheSize` 调整）

**5. HTTP/2 多路复用**

HTMX 应用通常发大量小请求——必须 HTTP/2 或 HTTP/3，否则 HOL 阻塞

</v-clicks>

---
transition: slide-up
---

# 测试

HTMX 没有「组件」概念——主要测两层：**后端 HTML 输出** + **端到端**

```js
// Cypress E2E
describe('Todo HTMX flow', () => {
  it('adds a todo', () => {
    cy.visit('/todos')
    cy.get('input[name="title"]').type('Buy milk')
    cy.get('button[type="submit"]').click()
    cy.get('#list').should('contain.text', 'Buy milk')
  })

  it('toggles a todo', () => {
    cy.get('#todo-1 input[type="checkbox"]').click()
    cy.get('#todo-1').should('have.class', 'done')
  })
})
```

<v-click>

后端单元测试：

```python
def test_partial_returns_partial(self):
    c = Client(headers={'HX-Request': 'true'})
    r = c.get('/todos/')
    self.assertContains(r, '<ul id="todos">')
    self.assertNotContains(r, '<html>')
```

</v-click>

---
transition: slide-up
---

# 调试 cheat-sheet

```js
htmx.logAll()                    // 打开全部日志
htmx.logNone()                   // 关闭

htmx.logger = (elt, event, data) => {
  console.log(event, elt, data)  // 自定义 logger
}
```

<v-click>

```js
// 监听特定事件
document.body.addEventListener('htmx:beforeRequest', e => {
  console.log('about to send', e.detail.requestConfig)
})

document.body.addEventListener('htmx:afterSwap', e => {
  console.log('swap done', e.detail)
})

document.body.addEventListener('htmx:responseError', e => {
  console.error('4xx/5xx', e.detail.xhr)
})
```

</v-click>

<v-click>

**Network 过滤**：HTMX 请求带 `HX-Request: true` 请求头，浏览器 DevTools 直接过滤。

</v-click>

---
transition: slide-up
---

# 何时选 HTMX

<v-clicks>

**选 HTMX**

- 团队已有 Django / Rails / Laravel / FastAPI / Express 后端
- 业务是常规 CRUD + 表单 + 列表 + 详情
- 全栈或后端工程师为主——不想加 SPA + 类型同步复杂度
- 服务端 HTML 渲染层已存在——再写一遍 SPA 是浪费
- 团队希望最小化前端构建链复杂度

**不选 HTMX**

- 离线优先 / PWA / 长时间不联网的应用
- 高度本地状态的应用（画布、IDE、3D、协同编辑）
- 团队前端栈固定为 React / Vue，且后端是纯 JSON API
- 移动端原生 App（参考 Hyperview）
- 重度依赖前端 SDK 生态（地图、富文本、图表）

</v-clicks>

---
transition: slide-up
---

# vs Alpine.js / _hyperscript / Vue（选型矩阵）

<v-clicks>

- **HTMX + Alpine** → 「**hypermedia 全栈**」最常见组合
  - HTMX：服务端通信
  - Alpine：客户端 UI 状态（弹窗 / 折叠 / 主题）

- **HTMX + \_hyperscript** → Carson 推荐的纯 hypermedia 全栈
  - 行为 DSL，更可读的内联脚本

- **HTMX + Vue / React 局部** → 个别复杂组件用 SPA 框架，其他用 HTMX
  - 适合渐进迁移 / 局部增强

- **纯 SPA（React / Vue）** → 离线 / 协同 / 高度本地状态

</v-clicks>

---
transition: slide-up
---

# 经验法则

<v-clicks>

- **服务端返回 HTML 片段** → 最核心原则，违反就别用 HTMX
- **后端 partials 命名约定化** → Django `partials/` / Rails `_xxx.erb` / Blade `partials/`
- **`request.htmx` 判断 + 切换模板** → 服务端区分完整页 vs 片段
- **CSRF 在 `htmx:configRequest` 注入** → 不要每个表单写 hidden input
- **`HX-Trigger` 响应头做多元素联动** → 优于客户端定时刷新
- **`hx-boost` 用在最外层 body** → 整站渐进增强，禁用 JS 仍可用
- **`hx-target` + `hx-swap` 写在最小元素上** → 减少继承误用
- **Idiomorph 保焦点** → 列表 / 表单刷新场景默认 swap 会丢焦点
- **`response-targets` 处理错误** → 默认不交换 4xx/5xx
- **HTTP/2 必开** → 大量小请求性能基本面

</v-clicks>

---
layout: center
class: text-center
---

# 总结

适合：传统后端（Django / Rails / Laravel / FastAPI / Express）+ 常规 CRUD + 中小团队

少做：纯 JSON API 后端 / PWA 离线场景 / 高度本地状态的应用

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://htmx.org/" target="_blank">htmx.org</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/bigskysoftware/htmx" target="_blank">bigskysoftware/htmx</a>
</div>

<div class="mt-4">
  <carbon:book /> <a href="https://hypermedia.systems/" target="_blank">Hypermedia Systems</a>
</div>
