---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Remix
info: |
  Presentation Remix — full-stack React web framework.

  Learn more at [https://remix.run](https://remix.run)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">💿</span>
</div>

<br/>

## Remix — 全栈 React Web 框架

拥抱 Web 标准、嵌套路由、SSR 与渐进增强，用 loader/action 数据模型 —— Shopify 维护（已收敛进 React Router v7）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/remix-run/remix" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Remix —— Ryan Florence 与 Michael Jackson 创建、Shopify 维护的全栈 React Web 框架。

定位一句话：拥抱 Web 标准、嵌套路由、SSR 与渐进增强，用 loader/action 数据模型构建全栈 React 应用。

但 2026 年聊 Remix 必须先讲清一件最重要的事：Remix 已经和 React Router 收敛了 ——
原计划的 Remix v3 直接以 React Router v7 名义发布。这是高频考点，下一页专门讲。

后面顺序：定位 → 收敛关系（重点）→ 路由模块与 loader → action 与 Form →
useFetcher 与 useNavigation → 流式与错误边界 → 生态部署 → 踩坑 → 总结。
-->

---
transition: fade-out
---

# 什么是 Remix？

Web 标准优先的全栈 React 框架

<v-clicks>

- **构建在 React Router 之上**：嵌套路由 + 服务端渲染 + 渐进增强
- **`loader` / `action` 数据模型**：数据加载与变更和路由共置，嵌套 loader **并行加载**
- **渐进增强**：`<Form>` 基于原生表单，**无 JS 也能提交**，JS 加载后增强为 SPA
- **路由级错误边界**：`ErrorBoundary` 就近兜底
- **Shopify 维护**：2022 年 10 月收购 Remix 团队
- **多运行时部署**：作为 handler 嵌入 Node / Cloudflare / Deno

</v-clicks>

<style>
h1 {
  background-color: #1E3A8A;
  background-image: linear-gradient(45deg, #1E3A8A 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 构建在 React Router 之上，嵌套路由加 SSR 加渐进增强。
[click] loader/action 数据模型，数据加载和变更与路由共置，嵌套路由的 loader 并行加载消除瀑布。
[click] 渐进增强，Form 基于原生表单，无 JS 也能提交，JS 加载后增强为 SPA 体验。
[click] 路由级错误边界，ErrorBoundary 就近兜底，不整页崩。
[click] Shopify 2022 年 10 月收购了 Remix 团队并维护。
[click] 不是 HTTP 服务器，作为 handler 嵌入 Node、Cloudflare、Deno 等多运行时。
-->

---
transition: fade-out
---

# ⚠️ Remix ↔ React Router v7 ↔ Remix 3

2026 最高频、最易答错的考点——分清三个东西

<v-click>

| 名称 | 是什么 | 关键事实 |
|---|---|---|
| **Remix v2** | Remix 框架**最后一个独立主版本** | 官方建议升级到 RR7 |
| **「原计划 Remix v3」** | **就是 React Router v7** | RR7 稳定 **2024-11-22**，把 Remix 能力并入「Framework Mode」 |
| **Remix 3** | **全新、去 React 的 Preact 重构** | 2025-05-28 公布，2026 Beta，用 Web 原语不是 Hooks |

</v-click>

<v-click>

> ⚠️ 把「Remix v3」当成「RR7 的薄包装」错；把「Remix 3」当成用 React/Hooks 的 v2 升级也错。升级 v2→RR7：`npx codemod remix/2/react-router/upgrade`。

</v-click>

<style>
h1 {
  background-color: #1E3A8A;
  background-image: linear-gradient(45deg, #1E3A8A 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 2026 年关于 Remix 最高频也最易答错的考点，必须分清三个东西：
Remix v2 是 Remix 框架最后一个独立主版本，官方建议升级到 React Router v7。
原计划的 Remix v3 直接以 React Router v7 名义发布，RR7 稳定于 2024 年 11 月 22 日，
把 Remix 的编译器和服务端运行时并入 React Router 的 Framework Mode，所以 RR7 等于 v6 加 Remix。
而 Remix 3 是另一回事，2025 年 5 月 28 日 Wake up Remix 公布的全新去 React、基于 Preact 的重构，2026 Beta，用 Web 原语而非 Hooks。

[click] 两个错法：把原计划的 Remix v3 说成 RR7 的薄包装是错的，它直接就是 RR7；
把 Remix 3 当成用 React 和 Hooks 的 v2 升级也是错的，它去掉了 React。
升级 v2 到 RR7 用 codemod npx codemod remix/2/react-router/upgrade。
-->

---
transition: fade-out
---

# 路由模块导出 & loader

```tsx
// 一个路由文件按需导出这些约定：
export async function loader({ params, request }) {}  // 服务端：GET 数据加载
export async function action({ request }) {}           // 服务端：非 GET 变更
export default function Route() {}                      // 路由组件
export function ErrorBoundary() {}                      // 路由级错误边界
export const meta = () => [...]; export const links = () => [...]

// loader + useLoaderData（类型安全）
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
export async function loader({ params }) { return json({ user: await getUser(params.id) }) }
export default function P() { const { user } = useLoaderData<typeof loader>(); return <h1>{user.name}</h1> }
```

<style>
h1 {
  background-color: #1E3A8A;
  background-image: linear-gradient(45deg, #1E3A8A 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Remix 的核心是路由模块约定，一个路由文件按需导出：
loader 服务端 GET 数据加载、action 服务端非 GET 变更、default 路由组件、
ErrorBoundary 错误边界、meta SEO、links 样式预加载。

loader 仅服务端运行，用 useLoaderData 加 typeof loader 泛型类型安全地读。
嵌套路由的多个 loader 并行加载不是瀑布。数据经 JSON 序列化。
loader/action/headers 服务端专用，客户端用 clientLoader/clientAction。
-->

---
transition: fade-out
---

# action + Form：渐进增强

```tsx
import { redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'

// action 在 loaders 前运行；完成后 loaders 自动重新校验；一次提交只跑一个 action
export async function action({ request }) {
  const form = await request.formData()
  const todo = await createTodo({ title: form.get('title') })
  return redirect(`/todos/${todo.id}`)   // 可 return 或 throw
}

export default function New() {
  // <Form> 渐进增强：无 JS 也能提交（原生只支持 GET + POST）
  return <Form method="post"><input name="title" /><button>创建</button></Form>
}
```

<style>
h1 {
  background-color: #1E3A8A;
  background-image: linear-gradient(45deg, #1E3A8A 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
变更用 action 加 Form。action 是服务端函数处理非 GET 请求，在 loaders 之前运行，
完成后 loaders 自动重新校验，一次提交只跑一个 action（最深匹配路由）。
redirect 既可以 return 也可以 throw。

Form 是渐进增强的原生表单，无 JS 也能提交，JS 加载后拦截为客户端导航。
原生 Form 只支持 GET 和 POST。用 useActionData 读 action 返回，比如校验错误。
-->

---
transition: fade-out
---

# useFetcher & useNavigation

```tsx
// useFetcher：不导航、不改 URL 的服务端交互（点赞/加购/自动保存）
const fetcher = useFetcher()
fetcher.submit({ liked: 'true' }, { method: 'post', action: '/like' })
// fetcher.state（idle/submitting/loading）/ fetcher.data / fetcher.formData

// useNavigation：导航/提交状态，做 pending UI
const navigation = useNavigation()
const busy = navigation.state === 'submitting'  // 乐观 UI 用 navigation.formData
```

<v-clicks>

- `useFetcher` **不导航、不改 URL**——适合点赞、加购、自动保存
- `useNavigation` 拿全局导航/提交状态做 pending UI；`useSubmit` 命令式提交
- 乐观 UI：用 `navigation.formData` / `fetcher.formData` 在请求完成前先渲染预期结果

</v-clicks>

<style>
h1 {
  background-color: #1E3A8A;
  background-image: linear-gradient(45deg, #1E3A8A 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
useFetcher 用于不导航、不改 URL 的服务端交互，有 Form、submit、load、state、data、formData。
useNavigation 拿全局导航和提交状态做 pending UI。

[click] useFetcher 不导航不改 URL，适合点赞、加购、自动保存这类交互。
[click] useNavigation 拿导航提交状态做 pending UI，useSubmit 命令式提交。
[click] 乐观 UI：用 navigation.formData 或 fetcher.formData 在请求完成前先渲染预期结果。
-->

---
transition: fade-out
---

# 流式渲染 & 错误边界

```tsx
// 流式：关键数据先 await，次要数据不 await 流式补齐
import { defer } from '@remix-run/node'
import { Await } from '@remix-run/react'
export async function loader({ params }) {
  return defer({ product: await getProduct(params.id), reviews: getReviews(params.id) })
}
// <Suspense fallback><Await resolve={reviews}>{(r) => ...}</Await></Suspense>

// 路由级错误边界
import { useRouteError, isRouteErrorResponse } from '@remix-run/react'
export function ErrorBoundary() {
  const e = useRouteError()
  return isRouteErrorResponse(e) ? <p>{e.status}</p> : <p>{e.message}</p>
}
```

<v-click>

> ⚠️ 版本差异：Remix v2 用 `defer()` 包装未 await 的 Promise；**React Router v7 改为直接返回原始 Promise**（`json`/`defer` 在 RR7 已弃用）。

</v-click>

<style>
h1 {
  background-color: #1E3A8A;
  background-image: linear-gradient(45deg, #1E3A8A 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
流式渲染：loader 用 defer 包装，关键数据先 await，次要数据不 await 让它流式补齐，
组件里用 Suspense 加 Await 渲染。

错误边界：导出 ErrorBoundary，用 useRouteError 拿错误，isRouteErrorResponse 判断是不是主动 throw 的 Response。
它捕获本路由组件、loader、action 的错误，就近兜底。v2 起 CatchBoundary 已并入 ErrorBoundary。

[click] 版本差异：Remix v2 用 defer 包装未 await 的 Promise；
React Router v7 改为直接从 loader 返回原始 Promise，json 和 defer 在 RR7 已弃用。
-->

---
transition: fade-out
---

# 生态、部署 & 常见坑

<v-clicks>

- **Vite 插件**：`import { vitePlugin as remix } from '@remix-run/dev'`（v2 默认，Classic Compiler 已弃用）
- **不是 HTTP 服务器**：handler 嵌入 Node/Cloudflare/Deno；cookies `createCookie`、sessions `createCookieSessionStorage`
- **RR7 三模式**：Declarative / Data / **Framework（= 原 Remix）**
- ⚠️ 坑：**版本三者别混**；新项目用 RR7；RR7 弃用 `json`/`defer`；loader/action 服务端专用；嵌套 loader 并行；一提交一 action；`<Form>` 原生只 GET+POST；`.server`/`.client` 分离模块

</v-clicks>

<style>
h1 {
  background-color: #1E3A8A;
  background-image: linear-gradient(45deg, #1E3A8A 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 构建用 @remix-run/dev 的 Vite 插件，v2 默认，Classic Compiler 已弃用。
[click] Remix 不是 HTTP 服务器，是嵌入现有服务器的 handler，多运行时；cookies 用 createCookie，sessions 用 createCookieSessionStorage 等。
[click] React Router v7 三种模式：Declarative 基础路由、Data 数据路由、Framework 等于原 Remix 框架能力。
[click] 常见坑：版本三者别混是头号坑；新项目用 RR7；RR7 弃用 json 和 defer；
loader/action 服务端专用；嵌套 loader 并行加载；一次提交一个 action；Form 原生只 GET POST；用 .server 和 .client 分离模块。
-->

---
layout: center
class: text-center
transition: slide-up
---

# 总结 & 资源

Remix = Web 标准优先的全栈 React 框架（已并入 RR7）

<div class="text-left max-w-2xl mx-auto mt-4">

- **loader/action 数据模型**：数据与路由共置、嵌套 loader 并行、渐进增强
- **核心 API**：`<Form>` / `useFetcher` / `useNavigation` / `defer`+`Await` / `ErrorBoundary`
- **版本必记**：Remix v2 最后独立；原计划 Remix v3 = **React Router v7**；Remix 3 = 去 React 重构
- **新项目用 React Router v7**（Remix 框架能力的延续）

</div>

<div class="mt-6 text-sm opacity-80">
  官网 remix.run · React Router v7 reactrouter.com · GitHub remix-run/remix
</div>

<style>
h1 {
  background-color: #1E3A8A;
  background-image: linear-gradient(45deg, #1E3A8A 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
收尾总结：
- Remix 是 Web 标准优先的全栈 React 框架，已并入 React Router v7。
- loader/action 数据模型，数据与路由共置、嵌套 loader 并行、渐进增强。
- 核心 API：Form、useFetcher、useNavigation、defer 加 Await、ErrorBoundary。
- 版本必记：Remix v2 是最后独立版；原计划的 Remix v3 就是 React Router v7；Remix 3 是去 React 的重构。
- 新项目官方建议直接用 React Router v7，即 Remix 框架能力的延续。

资源：官网 remix.run、React Router v7 在 reactrouter.com、GitHub remix-run/remix。谢谢！
-->
