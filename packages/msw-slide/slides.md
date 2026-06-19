---
theme: seriph
background: https://cover.sli.dev
title: MSW：网络层 API Mock 的工业标准
info: |
  Presentation MSW for developers.

  Learn more at [https://mswjs.io/](https://mswjs.io/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <span class="text-8xl font-bold" style="color: #E05D26;">MSW</span>
</div>

<br/>

## MSW：网络层 API Mock 的工业标准

网络层拦截 · 客户端无关 · 一套 handler 跨全场景（基于 v2.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 MSW（Mock Service Worker）—— 前端 API mock 的工业标准。

它不 patch fetch/axios，而是在网络层拦截请求，业务代码零改动，同一套 handler 可在测试、开发、Storybook、Playwright 里共用。
-->

---
transition: fade-out
---

# 什么是 MSW？

在网络层拦截，不侵入业务代码

<v-click>

- **网络层拦截**：浏览器用 Service Worker、Node.js 用原生 `http`/`https` 拦截器
- **不 patch 任何 HTTP 库**：fetch / axios / ky / got 全部通吃，无需依赖注入
- **业务代码零改动**：请求照常发，MSW 在底层返回 mock 数据
- **一套 handler 多处复用**：Vitest 测试、开发期 mock、Storybook、Playwright 共享
- **拥抱 Web 标准**：v2 完全基于 Fetch API 的 `Request` / `Response`

</v-click>

<div v-click text-xs>

_State of JS 2024 使用率持续增长 ·_ [_mswjs.io_](https://mswjs.io/)

</div>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MSW 的核心价值：拦截发生在网络层，而不是在 JS 调用栈里。
这意味着你不需要给 axios 注入 mock adapter，也不需要用 vi.mock 替换整个 fetch 模块。
业务代码照常写、照常跑，MSW 悄悄地在底层返回你定义的数据。

[click] 同一套 handler 可以跨环境复用，这是 MSW 相比竞品最大的优势。
-->

---
transition: fade-out
---

# 拦截原理

浏览器 Service Worker + Node 原生拦截器

<v-click>

**浏览器环境（`setupWorker`）**

```
fetch("/api/user")
    ↓ 浏览器网络层
Service Worker（mockServiceWorker.js）
    ↓ 匹配 handler → 返回 mock 响应
    ↓ 无匹配 → passthrough 发真实请求
```

</v-click>

<v-click>

**Node.js 环境（`setupServer`）**

```
fetch("/api/user")
    ↓ Node.js http/https 模块
MSW Node interceptor（猴补丁原生模块）
    ↓ 匹配 handler → 返回 mock 响应
    ↓ 不启动任何真实 TCP 服务器
```

</v-click>

<v-click>

两套拦截机制共享同一套 `handlers`，切换环境只需换入口。

</v-click>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 浏览器里 MSW 注册了一个 Service Worker 文件，所有 fetch 请求在网络层经过它。
SW 查找匹配的 handler，有则返回 mock；没有则让请求正常发出。

[click] Node.js 里没有 Service Worker，MSW 改而猴补丁（monkey-patch）原生 http/https 模块。
重点：它不启动任何 TCP 服务器，一切发生在进程内，零延迟、零端口冲突。

[click] handlers 是共享的，这就是一套代码多处复用的基础。
-->

---
transition: fade-out
---

# 安装与初始化

两条命令起步

<v-click>

```bash
# 安装 MSW
pnpm add -D msw
```

</v-click>

<v-click>

```bash
# 仅浏览器/Storybook 场景：生成 Service Worker 文件
npx msw init public/ --save
```

</v-click>

<v-click>

::: tip Node 测试不需要 Service Worker 文件
Vitest / Jest 走 `setupServer`，在进程内拦截，**不需要** `mockServiceWorker.js`。
只有浏览器里的 `setupWorker` 才需要 `msw init`。
:::

</v-click>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MSW 只有一个包，dev dependency 即可。

[click] msw init 把 mockServiceWorker.js 放到 public/，Vite 会把它复制到构建产物根目录。
--save 把路径写入 package.json 的 msw.workerDirectory，方便后续版本更新自动同步文件。

[click] 一个常见误解：测试里也要 init。不用，Node 环境完全不需要 SW 文件。
-->

---
transition: fade-out
---

# 定义 Handler（一）

`http.*` + `HttpResponse`

<v-click>

```ts
// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/user", () => {
    return HttpResponse.json({ id: "1", name: "John" });
  }),
];
```

</v-click>

<v-click>

支持所有 HTTP 方法：`get` / `post` / `put` / `patch` / `delete` / `head` / `options` / `all`

</v-click>

<v-click>

`HttpResponse` 工厂方法：

| 方法 | 说明 |
| ---- | ---- |
| `.json(data, { status })` | 自动设 `Content-Type: application/json` |
| `.error()` | 网络错误（连接中断） |

</v-click>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] handler 的结构很简单：方法 + URL + resolver 函数。
URL 可以是精确字符串，也可以带路径参数（:id 这类）。
HttpResponse 代替了 v1 的 res(ctx.json())，完全基于 Web 标准。

[click] all 匹配所有 HTTP 方法，适合拦截"不管什么动词都返回同一结果"的场景。

[click] 三种常用工厂方法。HttpResponse.error() 模拟的是网络连接中断，不是 4xx/5xx。
-->

---
transition: fade-out
---

# 定义 Handler（二）

resolver 参数：路径参数 / 查询参数 / 请求体

<v-click>

**路径参数**（`:id` 捕获）

```ts
http.get("/posts/:id", ({ params }) => {
  return HttpResponse.json({ id: params.id });
});
```

</v-click>

<v-click>

**查询参数**（手动 `new URL`）

```ts
http.get("/products", ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  return HttpResponse.json({ id });
});
```

</v-click>

<v-click>

**请求体**（Fetch API 标准，必须 `await`）

```ts
http.post("/users", async ({ request }) => {
  const user = await request.json();
  return HttpResponse.json({ id: "new-1", name: user.name });
});
```

</v-click>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] resolver 接收单个对象，可解构出 request、params、cookies、requestId。
params 自动从 URL 路径提取，值是字符串（MSW 不做类型转换）。

[click] v2 的 request.url 是字符串，要手动 new URL 才能取 searchParams。
这是最常忘的一个点，搞 v1 的人会习惯性以为 url 已经是对象。

[click] 请求体完全走 Fetch API 标准：request.json() / formData() / text()，都要 await。
v1 的 req.body 是同步自动解析的，v2 改掉了这个"魔法"。
-->

---
transition: fade-out
---

# 定义 Handler（三）

TypeScript 泛型 + cookie

<v-click>

**TS 泛型四参数**（按需传）

```ts
http.post<
  { postId: string },     // 路径参数类型
  { comment: string },    // 请求体类型
  { commentUrl: string }  // 响应体类型
>("/post/:postId", async ({ params, request }) => {
  const body = await request.json();
  return HttpResponse.json({
    commentUrl: `/post/${params.postId}`,
  });
});
```

</v-click>

<v-click>

**cookie**（直接从 resolver 解构）

```ts
http.get("/api/user", ({ cookies }) => {
  if (!cookies.authToken)
    return new HttpResponse(null, { status: 403 });
  return HttpResponse.json({ name: "John" });
});
```

</v-click>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] http.* 的泛型让 params 和 request.json() 的返回值有类型提示。
实际项目里可以把 API 类型定义复用进来，handler 和业务代码共享同一套类型。

[click] cookie 已经过 MSW 解析成键值对对象，不需要手动 parse Cookie 头。
直接解构取 cookies.authToken 即可。
-->

---
transition: fade-out
---

# setupServer + 生命周期三步

Vitest 集成核心配置

<v-click>

```ts
// src/mocks/node.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

</v-click>

<v-click>

```ts
// vitest.setup.ts
import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./src/mocks/node";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

</v-click>

<v-click>

```ts
// vitest.config.ts
export default defineConfig({
  test: { setupFiles: ["./vitest.setup.ts"] },
});
```

</v-click>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] setupServer 从 msw/node 导入，传入 handlers 数组。
名字叫 server 但它不是 HTTP 服务器——完全在进程内同步拦截，零端口冲突。

[click] 生命周期三步是固定模板：
listen 开始拦截，放 beforeAll；
resetHandlers 清运行时覆盖，放 afterEach 防污染；
close 还原原生模块，放 afterAll。

[click] setupFiles 让这三步在每个测试文件跑之前自动执行。
-->

---
transition: fade-out
---

# 生命周期三步详解

为什么每步都不可省

<v-click>

| 钩子 | 调用 | 作用 |
| ---- | ---- | ---- |
| `beforeAll` | `server.listen()` | 开始拦截请求 |
| `afterEach` | `server.resetHandlers()` | 清除运行时 handler，防止测试间污染 |
| `afterAll` | `server.close()` | 停止拦截、还原 Node 原生 http 模块 |

</v-click>

<v-click>

- **为什么不能省 `resetHandlers`？**

  `server.use()` 添加的运行时 handler 会跨测试存活，不 reset 就会污染下一个测试。

- **`resetHandlers` 只清运行时 handler**

  `setupServer(...handlers)` 传入的初始 handler 不受影响，始终有效。

</v-click>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三步各有职责，缺一不可。listen 是启动，close 是停止，resetHandlers 是测试间的隔离墙。

[click] resetHandlers 容易被忽视。如果一个测试用 server.use 覆盖了 /api/user，
不 reset 的话，下一个测试拿到的还是被覆盖后的 handler，产生难以排查的测试间依赖。
初始 handler 不受影响，reset 后立刻恢复正常路径的 mock。
-->

---
transition: fade-out
---

# onUnhandledRequest 严格模式

未 mock 的请求不能悄悄发出

<v-click>

```ts
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
```

</v-click>

<v-click>

| 值 | 行为 |
| -- | ---- |
| `"error"` | 抛错、测试失败（**测试场景推荐**） |
| `"warn"` | 控制台警告，继续放行 |
| `"bypass"` | 静默放行，发真实请求（默认） |

</v-click>

<v-click>

**为什么推荐 `"error"`？**

- 防止遗漏 handler 的请求悄悄命中真实后端
- 迫使开发者为每个用到的接口都写 handler
- 让测试报错信息精准指向"缺少 mock"

</v-click>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] onUnhandledRequest 是 listen 的第一个参数对象里的选项。

[click] 三种模式对应三种不同的严格程度。

[click] 测试里强烈推荐 error：你不希望在单元测试里不知不觉发出真实的 HTTP 请求。
一旦漏写 handler，测试会立即报错并告诉你哪个 URL 没有被 mock 覆盖，非常好排查。
-->

---
transition: fade-out
---

# server.use 运行时覆盖

在单个测试里临时替换 handler

<v-click>

```ts
import { server } from "./src/mocks/node";

test("接口 500 时显示错误提示", async () => {
  server.use(
    http.get("/api/user", () =>
      new HttpResponse(null, { status: 500 }),
    ),
  );
  const res = await fetch("/api/user");
  expect(res.status).toBe(500);
  // afterEach 的 resetHandlers() 自动清掉这个覆盖
});
```

</v-click>

<v-click>

**一次性覆盖**（只生效一次，之后回退初始 handler）：

```ts
server.use(
  http.get("/api/user", () => HttpResponse.text("一次性"), { once: true }),
);
```

</v-click>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] server.use 的典型用场：初始 handler 覆盖正常路径（返回 200 + 数据），
单个测试里用 server.use 覆盖为错误路径（500 / 403 / 超时），测试错误处理逻辑。
afterEach 的 resetHandlers 会自动清掉这个覆盖，不影响其他测试。

[click] { once: true } 让覆盖只生效一次，第二次请求就回退到初始 handler。
适合"第一次请求失败、重试成功"这类场景。
-->

---
transition: fade-out
---

# 网络行为（一）

错误响应 vs 网络错误 + 延迟

<v-click>

**两者语义不同**

```ts
// HTTP 错误响应（服务器回了 5xx，fetch 不 throw）
http.get("/api/data", () => new HttpResponse(null, { status: 503 }));

// 网络错误（连接中断，触发 TypeError: Failed to fetch）
http.get("/api/data", () => HttpResponse.error());
```

</v-click>

<v-click>

**精确延迟**（毫秒）

```ts
import { delay } from "msw";

http.get("/slow", async () => {
  await delay(1000);
  return HttpResponse.json({ ok: true });
});
```

</v-click>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这个区别很重要：HTTP 错误（4xx/5xx）和网络错误不是一回事。
fetch 收到 500 不会 throw，你得手动检查 res.ok。
HttpResponse.error() 才会让 fetch 抛 TypeError——模拟断网、连接被拒。

[click] delay 也是从 msw 导入。Node 测试里默认延迟值会自动变 0，不会拖慢 CI。
delay("infinite") 用来测 loading 态——组件渲染了没有？取消按钮有没有显示？
-->

---
transition: fade-out
---

# 网络行为（二）

passthrough 与 bypass

<v-click>

**`passthrough`** — 放行当前请求，走真实网络

```ts
import { http, passthrough, HttpResponse } from "msw";

http.get("/resource", ({ request }) => {
  if (request.headers.has("x-skip-mock")) return passthrough();
  return HttpResponse.text("Mocked");
});
```

</v-click>

<v-click>

**`bypass`** — 在 handler 内部发一个不被 MSW 拦截的真实请求

```ts
import { http, HttpResponse, bypass } from "msw";

http.get("/resource", async ({ request }) => {
  const real = await fetch(bypass(request));
  const data = await real.json();
  return HttpResponse.json({ ...data, mocked: true });
});
```

</v-click>

<v-click>

> `passthrough` 放行**当前**请求；`bypass` 用于在 handler 里**额外**发真实请求。

</v-click>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] passthrough 的使用场景：某些请求（如静态资源、监控上报）不需要 mock，
直接让它走真实网络。可以在 handler 里根据条件判断是否 passthrough。

[click] bypass 的使用场景：你想拦截请求、对真实数据加工再返回。
直接 fetch(request) 会被 MSW 再次拦截形成死循环，bypass 包装一下就能跳过拦截。

[click] 一句话区分：passthrough 是"我不处理，让它过去"；bypass 是"我要用真实数据，但不想被自己拦截"。
-->

---
transition: fade-out
---

# GraphQL 支持

`graphql.query` / `graphql.mutation`

<v-click>

**Query**（按 operation name 匹配）

```ts
import { graphql, HttpResponse } from "msw";

graphql.query("ListUsers", () => {
  return HttpResponse.json({
    data: { users: [{ id: "1", name: "John" }] },
  });
});
```

</v-click>

<v-click>

**Mutation**（从 `variables` 取变量）

```ts
graphql.mutation("CreateUser", ({ variables }) => {
  return HttpResponse.json({
    data: { createUser: { id: "abc", name: variables.name } },
  });
});
```

</v-click>

<v-click>

::: warning v2 必须显式写 `data:` 根字段
v1 的 `ctx.data(...)` 会自动包一层 `data`；v2 取消了这个处理，
必须在 `HttpResponse.json({ data: ... })` 里自己写 `data` 根字段。
:::

</v-click>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MSW 对 GraphQL 的支持是开箱即用的。
按 operation name 匹配，query 和 mutation 分别用 graphql.query / graphql.mutation。
variables 从 resolver 参数里直接取，和 HTTP handler 一样的解构风格。

[click] v1 → v2 最容易漏的 GraphQL 坑：v1 帮你包了 data 层，v2 不包了。
从 v1 迁移过来的 handler 如果只写 { users: [...] } 而不写 { data: { users: [...] } }，
客户端收到的 data 字段会是 null。
-->

---
transition: fade-out
---

# 1.x → 2.x 迁移对照（一）

核心 API 变更

<v-click>

| 场景 | 1.x | 2.x |
| ---- | ---- | ---- |
| 命名空间 | `rest.get(...)` | `http.get(...)` |
| 浏览器导入 | from `"msw"` | from `"msw/browser"` |
| resolver 签名 | `(req, res, ctx) =>` | `({ request, params }) =>` |
| JSON 响应 | `res(ctx.json(data))` | `HttpResponse.json(data)` |
| 状态码 | `res(ctx.status(201))` | `new HttpResponse(null, { status: 201 })` |

</v-click>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v2 是一次彻底拥抱 Web 标准的破坏性重构，但方向是正确的。
最显眼的变化：rest → http，res(ctx.json()) → HttpResponse.json()，
resolver 三参数 → 单对象解构。

[click] 代码对比一目了然：v2 更简洁，API 更符合 Fetch 标准的直觉。
官方有合作 Codemod 可以自动迁移大部分 v1 代码。
-->

---
transition: fade-out
---

# 1.x → 2.x 迁移对照（二）

参数取法 + 其他变更

<v-click>

| 场景 | 1.x | 2.x |
| ---- | ---- | ---- |
| 路径参数 | `req.params.id` | `params.id`（解构） |
| 查询参数 | `req.url.searchParams` | `new URL(request.url).searchParams` |
| 请求体 | `req.body`（自动解析） | `await request.json()`（Fetch 标准） |
| 一次性 | `res.once(...)` | 第三参数 `{ once: true }` |
| 网络错误 | `res.networkError(...)` | `HttpResponse.error()` |

</v-click>

<v-click>

- **环境要求**：Node ≥ 18、TypeScript ≥ 4.7
- 官方合作 Codemod 可自动迁移大部分 1.x 代码

</v-click>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这张表是迁移 checklist。最容易忘的是请求体：v1 的 req.body 是同步自动解析的，
v2 必须 await request.json()，忘了 await 会拿到 Promise 对象而不是数据。

[click] Node 18+ 是因为 v2 依赖 Web Streams 和 Fetch API 的原生支持。
Codemod 能处理大部分机械性替换，但 GraphQL data 根字段这类语义变化需要人工检查。
-->

---
transition: fade-out
---

# 对比 axios-mock-adapter

为什么新项目应该选 MSW

<v-click>

| 维度 | MSW v2 | axios-mock-adapter |
| ---- | ------ | ------------------ |
| 拦截层 | 网络层（SW / Node interceptor） | axios adapter 层 |
| 客户端兼容 | fetch / axios / ky / got 通吃 | **仅 axios** |
| 多环境复用 | 测试 / 开发 / Storybook 共享 | 仅测试 |
| Web 标准 | 完全基于 Fetch Request/Response | 私有 API |
| 维护状态 | 活跃 | **2024-10 起零 commit，停滞** |

</v-click>

<v-click>

::: tip 新项目无条件选 MSW
axios-mock-adapter 已停止维护且只服务 axios。新项目应选 MSW，
或对纯函数用 Vitest 内置 `vi.mock`。
:::

</v-click>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 拦截层的区别是根本性的：MSW 在网络层工作，换掉 axios 用 fetch 或 ky 完全不影响 handler。
axios-mock-adapter 绑死在 axios 的 adapter 机制上，换库就得重写所有 mock。

[click] 2024 年 10 月后 axios-mock-adapter 没有任何提交，实质性停滞。
加上只支持 axios 这个根本局限，新项目没有理由选它。
-->

---
transition: fade-out
---

# MSW vs vi.mock：如何取舍

两者互补，不是替代关系

<v-click>

| 场景 | 推荐方案 | 理由 |
| ---- | -------- | ---- |
| 纯函数 / 工具逻辑 | `vi.mock` | 最轻量，无需网络层 |
| 组件测试（有 HTTP 调用） | **MSW** | 业务代码不动，跨环境复用 |
| 集成测试（多接口协作） | **MSW** | handler 复用，贴近真实行为 |
| 模块级依赖替换 | `vi.mock` | 不涉及网络 |

</v-click>

<v-click>

**最佳实践**：

- 正常路径放初始 handler，异常路径用 `server.use` 覆盖
- 开 `onUnhandledRequest: "error"`，杜绝遗漏
- 别断言「请求发了几次」——在 handler 里体现校验、通过 UI 行为断言

</v-click>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这两个工具各有分工，不要用 MSW 测纯函数，也不要用 vi.mock 替代所有 HTTP mock。
判断标准很简单：有没有真实的 HTTP 请求发出？有就用 MSW，没有就用 vi.mock。

[click] 最佳实践三条：
handler 分正常路径和异常路径分层管理；
严格模式避免漏 mock；
不断言请求次数，这是 MSW 官方反模式——你应该测 UI 行为，而不是"fetch 调了几次"。
-->

---
layout: intro
transition: fade-out
---

# 总结

MSW = 网络层拦截 · 零侵入 · 一套 handler 全场景

- **安装简单**：`pnpm add -D msw`，测试场景不需要 Service Worker 文件
- **handler 直观**：`http.get(url, () => HttpResponse.json(data))`，完全 Web 标准
- **测试集成三步**：`listen` → `resetHandlers` → `close`，缺一不可
- **严格模式**：`onUnhandledRequest: "error"` 杜绝遗漏
- **异常路径**：`server.use` 运行时覆盖，`afterEach` 自动清理
- **跨环境复用**：同一套 handlers 跑测试 / 开发 / Storybook

<div class="abs-br m-6 text-xl">
  <a href="https://mswjs.io" target="_blank" class="slidev-icon-btn">
    <carbon:api />
  </a>
  <a href="https://github.com/mswjs/msw" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/frontend-develop-tools/testing/unit-testing/msw/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #E05D26;
  background-image: linear-gradient(45deg, #E05D26 10%, #FF9770 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
MSW 精华浓缩在六条：
- 安装和配置足够简单
- handler 写法符合直觉、完全基于 Web 标准
- 生命周期三步是固定模板，背下来就行
- 严格模式是最佳实践，必须开
- server.use 是测异常路径的标准姿势
- 一套 handler 跨全场景，这是 MSW 相比所有竞品的核心优势

每个涉及 HTTP 调用的前端测试都应该用 MSW。
-->

---
layout: end
---
