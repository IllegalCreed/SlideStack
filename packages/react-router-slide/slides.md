---
theme: seriph
background: https://cover.sli.dev
title: Welcome to React Router v7
info: |
  Presentation React Router v7 for frontend developers.

  Learn more at [https://reactrouter.com](https://reactrouter.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:react class="text-7xl" />
</div>

<br/>

## React Router v7 — Remix Reunited

Remix 与 React Router 合二为一：一个项目同时支持 SSR 元框架 / 数据路由 / 声明路由三种模式

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 React Router v7。

2024 年底 Remix 团队宣布把 Remix 合并进 React Router，v7 是合并后第一个稳定版。
现在一个包同时提供三种使用模式：完整元框架（继承 Remix）/ 数据路由（继承 v6.4+）/
声明式路由（继承 v6 BrowserRouter）。

下一代 Remix 不再独立发版——所有 Remix 用户都将升级到 React Router v7 Framework 模式。
-->

---
transition: fade-out
---

# 什么是 React Router v7？

Remix + React Router 合并版，一个包覆盖路由全栈

<v-click>

- **Remix 继任者**：v7 = Remix v3，未来 Remix 不再独立发版
- **三种使用模式**：Framework / Data / Declarative，按需选择
- **Framework 模式**：完整元框架（SSR / file-based routing / loader / action / 部署 adapter）
- **Data 模式**：兼容 v6.4+ data router API（`createBrowserRouter` + `RouterProvider`）
- **Declarative 模式**：兼容 v6 `<BrowserRouter>` + `<Routes>` + `<Route>`
- **统一包名**：所有运行时 API 从 `react-router` 导入
- **类型安全**：自动生成 `+types/` 让 loader / action / params 端到端推导
- **Adapter 体系**：Node / Cloudflare / Express / Vercel / Netlify 多端部署

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_React Router v7_](https://reactrouter.com)

</div>

<style>
h1 {
  background-color: #F44250;
  background-image: linear-gradient(45deg, #F44250 10%, #61DAFB 90%);
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

设计成熟、生态稳定，但 Framework 模式 SSR 心智仍需投入学习

<v-clicks>

**优点**
- API 干净：`loader` / `action` / `<Form>` 三件套
- 端到端类型安全，`+types/Route` 自动生成
- 一个包三种模式，可循序渐进迁移
- 自动 revalidation：action 完成后 loader 自动重跑
- 渐进增强 + Adapter 完整（Node / CF / Vercel）

**缺点**
- 三种模式增加文档复杂度
- 与 Next.js 重叠较多，定位需明确
- 与 React 19 的 RSC 不兼容
- 生态规模仍小于 Next.js / Vercel 全家桶

</v-clicks>

---
transition: slide-up
---

# 定位与生态

React Router v7 在元框架版图里的位置

<v-clicks>

- **谁在做**：Ryan Florence / Michael Jackson（React Router 创始团队，已加入 Shopify）
- **历史**：Remix 2022 开源 → 2024.5 Remix v2 future flags 完备 → 2024.11 v7 发布，Remix 与 RR 合并
- **未来路线**：Remix 不再独立发版，所有 Remix 用户路径迁移到 RR v7 Framework
- **与 Next.js 类比**：Framework 模式定位重合 — SSR 元框架 + file routing + 部署 adapter
- **与 TanStack Router 类比**：都强调类型安全，但 TSR 主要是 SPA + 客户端路由，RR 覆盖更广
- **与 SolidStart 类比**：`loader` / `action` 范式非常相近，RR 早 SolidStart 数年
- **关键区别**：**没有 RSC 心智**——组件就是组件，无 `"use client"` / `"use server"` 边界
- **学习路径**：选模式 → 路由配置 → loader / action → 部署 adapter → 类型生成

</v-clicks>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 关键事件 |
|---|---|---|
| **RR v5** | 2019 | 经典 `<BrowserRouter>` 时代 |
| **RR v6** | 2021 | Hooks 优先、Outlet 嵌套、route objects |
| **RR v6.4** | 2022 | Data Router（`createBrowserRouter` + loader / action） |
| **Remix v2** | 2023.9 | Future flags 完备，为合并铺路 |
| **RR v7** | 2024.11 | Remix 合并版首发，三种模式 + Framework 模式 |
| **RR v7.x** | 2025+ | Single Fetch / RSC bridge / middleware / adapter 完善 |

<v-click>

今天主要讲 **v7 Framework 模式**——这是 Remix 用户路径，也是新项目最值得选的子集。

</v-click>

---
transition: slide-up
---

# 三种模式总览

```ts
// 1. Declarative —— 兼容 v6 BrowserRouter
<BrowserRouter><Routes><Route path="/" element={<Home />} /></Routes></BrowserRouter>

// 2. Data —— 兼容 v6.4+ data router
const router = createBrowserRouter([
  { path: '/', Component: Home, loader: loadHome },
])
<RouterProvider router={router} />

// 3. Framework —— 完整元框架（继承 Remix）
export default [index('./home.tsx'), route('users/:id', './user.tsx')] satisfies RouteConfig
```

<v-click>

| 模式 | 数据加载 | SSR | 类型生成 | 适用 |
|---|---|---|---|---|
| Declarative | 自己写 | ❌ | ❌ | CRA 迁移 |
| Data | `loader` / `action` | ❌ | ❌ | v6 升级 |
| Framework | `loader` / `action` | ✅ | ✅ | 新项目 / Remix |

</v-click>

---
transition: slide-up
---

# 创建项目（Framework 模式）

```bash
# 官方 CLI（推荐）
npx create-react-router@latest my-app
cd my-app
npm install
npm run dev                # http://localhost:5173

# 选模板：
npx create-react-router@latest --template remix-run/react-router-templates/default
# 可选模板：cloudflare / vercel / netlify / node-custom-server / ...
```

<v-click>

要求 Node 20+ / React 18+ / React DOM 18+。生产构建：

```bash
npm run build              # 构建 build/server + build/client
npm start                  # 启动 react-router-serve build/server/index.js
```

</v-click>

<v-click>

> 💡 **提示**
>
> Framework 模式默认开启 SSR。想做 SPA / SSG 只需要改 `react-router.config.ts` 一个字段——架构上**一份代码三种产物**。

</v-click>

---
transition: slide-up
---

# 项目结构

```
my-app/
├── app/
│   ├── root.tsx              # 根布局：<html> + <Outlet />
│   ├── routes.ts             # 路由配置入口
│   ├── routes/               # 路由组件目录
│   │   ├── home.tsx
│   │   └── users.$id.tsx
│   ├── entry.client.tsx      # 可选，默认自动生成
│   ├── entry.server.tsx      # 可选，默认自动生成
│   └── components/
├── react-router.config.ts    # 框架配置
├── vite.config.ts            # Vite 插件
└── package.json
```

<v-click>

**关键约定**：

- `app/` 是源码根目录（可配置）
- `app/routes.ts` 是唯一的路由配置入口
- `app/root.tsx` 是顶层布局，必须导出 `<Outlet />` 才能渲染子路由

</v-click>

---
transition: slide-up
---

# react-router.config.ts

```ts
import type { Config } from '@react-router/dev/config'

export default {
  ssr: true,                   // SSR 总开关，false → 退化成 SPA
  async prerender() {          // 静态预渲染（构建时生成 HTML）
    return ['/', '/about', '/blog']
  },
  basename: '/',               // 应用基础路径
  appDirectory: 'app',         // 自定义 app 目录
  buildDirectory: 'build',     // 构建目录
  future: { unstable_optimizeDeps: true },
} satisfies Config
```

<v-click>

`Config` 类型来自 `@react-router/dev/config`，是 Framework 模式的唯一权威配置。

</v-click>

---
transition: slide-up
---

# vite.config.ts

```ts
import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
  ],
})
```

<v-click>

**`reactRouter()` 插件做了什么**：

- 读 `react-router.config.ts` + `routes.ts`，生成路由表
- 注入 client / server 双 entry + 调度 SSR pipeline
- 生成 `.react-router/types/+types/` 类型文件
- 处理路由模块的 `loader` / `action` / `links` / `meta`

</v-click>

<v-click>

> 💡 **从 Remix 迁移**：`vitePlugin as remix` → `reactRouter`，单行替换即可。

</v-click>

---
transition: slide-up
---

# root.tsx：应用骨架

```tsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><Meta /><Links /></head>
      <body>{children}<ScrollRestoration /><Scripts /></body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
```

<v-click>

**核心组件**：`<Meta />` 渲染 meta 导出 / `<Links />` 渲染 links / `<Scripts />` 注入 hydration / `<ScrollRestoration />` 恢复滚动 / `<Outlet />` 渲染子路由

</v-click>

---
transition: slide-up
---

# routes.ts：路由配置

```ts
import { type RouteConfig, route, index, layout, prefix } from '@react-router/dev/routes'

export default [
  // 主页
  index('./routes/home.tsx'),

  // 普通路由
  route('about', './routes/about.tsx'),

  // 嵌套 + 布局
  layout('./routes/auth/layout.tsx', [
    route('login', './routes/auth/login.tsx'),
    route('register', './routes/auth/register.tsx'),
  ]),

  // 路径前缀（不引入新组件）
  ...prefix('concerts', [
    index('./routes/concerts/home.tsx'),
    route(':city', './routes/concerts/city.tsx'),
  ]),
] satisfies RouteConfig
```

<v-click>

四个 helper：`route()` / `index()` / `layout()` / `prefix()`——足够表达任意路由树。

</v-click>

---
transition: slide-up
---

# 文件约定路由（可选）

不想手写 `routes.ts` 可以启用文件约定：

```ts
// app/routes.ts
import { type RouteConfig } from '@react-router/dev/routes'
import { flatRoutes } from '@react-router/fs-routes'

export default flatRoutes() satisfies RouteConfig
```

```
app/routes/
├── _index.tsx                 # /
├── about.tsx                  # /about
├── users.$id.tsx              # /users/:id
├── concerts._index.tsx        # /concerts
├── concerts.$city.tsx         # /concerts/:city
└── _auth.login.tsx            # /login（_auth 是布局组）
```

<v-click>

**约定**（继承 Remix flat routes）：`.` 表示嵌套 / `_index` 是 index / `$param` 是动态参数 / `_layout` 是布局组（不影响 URL）

</v-click>

---
transition: slide-up
---

# 动态参数 + 可选 + Splat

```ts
// routes.ts
export default [
  // 动态参数
  route('teams/:teamId', './routes/team.tsx'),

  // 嵌套动态
  route('c/:categoryId/p/:productId', './routes/product.tsx'),

  // 可选段（`?` 后缀）
  route(':lang?/categories', './routes/categories.tsx'),

  // Splat / catch-all
  route('files/*', './routes/files.tsx'),
  route('*', './routes/404.tsx'),
] satisfies RouteConfig
```

```tsx
// app/routes/team.tsx
import type { Route } from './+types/team'

export async function loader({ params }: Route.LoaderArgs) {
  // params.teamId: string  ← 自动类型推导
  return db.teams.get(params.teamId)
}
```

---
transition: slide-up
---

# 嵌套路由 + Outlet

```ts
// routes.ts
export default [
  route('dashboard', './routes/dashboard.tsx', [
    index('./routes/dashboard.home.tsx'),               // /dashboard
    route('analytics', './routes/dashboard.analytics.tsx'),
    route('settings', './routes/dashboard.settings.tsx'),
  ]),
] satisfies RouteConfig
```

```tsx
// app/routes/dashboard.tsx
import { Outlet } from 'react-router'

export default function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside><Sidebar /></aside>
      <main><Outlet /></main>      {/* 子路由插入这里 */}
    </div>
  )
}
```

<v-click>

**机制**：路由匹配后从根到叶组件依次渲染，父组件通过 `<Outlet />` 占位让子组件嵌入。

</v-click>

---
transition: slide-up
---

# loader：服务端数据加载

```tsx
// app/routes/posts.$id.tsx
import type { Route } from './+types/posts.$id'
import { db } from '~/lib/db.server'

export async function loader({ params }: Route.LoaderArgs) {
  const post = await db.posts.findUnique({ where: { id: params.id } })
  if (!post) throw new Response('Not Found', { status: 404 })
  return post
}

export default function Post({ loaderData }: Route.ComponentProps) {
  return <h1>{loaderData.title}</h1>
}
```

<v-click>

**特点**：仅服务端执行（SSR + 客户端导航 fetch）/ 完整 `Request` + URL 参数 / `throw Response` 触发 404/401 / 0 字节进客户端 bundle

</v-click>

---
transition: slide-up
---

# clientLoader：浏览器数据加载

```tsx
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  // 浏览器中跑（不在 SSR / 预渲染期）
  const res = await fetch(`/api/posts/${params.id}`)
  return await res.json()
}

clientLoader.hydrate = true as const

export function HydrateFallback() {
  return <div>Loading...</div>
}

export default function Post({ loaderData }: Route.ComponentProps) {
  return <h1>{loaderData.title}</h1>
}
```

<v-click>

**三种用法**：

- 只导出 `loader` → SSR + 客户端导航都走服务端
- 只导出 `clientLoader` → 纯客户端数据（适合 SPA）
- 两者都导出 → SSR 用 `loader`，客户端导航走 `clientLoader`

</v-click>

---
transition: slide-up
---

# action：服务端突变

```tsx
// app/routes/posts.new.tsx
import type { Route } from './+types/posts.new'
import { Form, redirect } from 'react-router'
import { db } from '~/lib/db.server'

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const title = formData.get('title') as string
  if (title.length < 2) return { error: 'Title too short' }

  const post = await db.posts.create({ data: { title } })
  throw redirect(`/posts/${post.id}`)
}

export default function NewPost({ actionData }: Route.ComponentProps) {
  return (
    <Form method="post">
      <input name="title" required />
      <button type="submit">Create</button>
      {actionData?.error && <p className="error">{actionData.error}</p>}
    </Form>
  )
}
```

---
transition: slide-up
---

# action 完成后自动 revalidation

```tsx
import { Form } from 'react-router'

export async function loader() {
  return db.posts.findMany()
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  await db.posts.delete({ where: { id: formData.get('id') as string } })
  return null
  // ↓ action 返回后，所有 loader 自动重跑，UI 自动更新
}

export default function PostList({ loaderData }: Route.ComponentProps) {
  return loaderData.map((p) => (
    <Form key={p.id} method="post">
      <input type="hidden" name="id" value={p.id} />
      <button type="submit">Delete {p.title}</button>
    </Form>
  ))
}
```

<v-click>

> 💡 action 完成 → 自动 revalidate 当前页所有 loader → UI 同步更新，无需手写 `useState` / `mutate` / `swr`。

</v-click>

---
transition: slide-up
---

# Form 组件：渐进增强

```tsx
import { Form, useNavigation } from 'react-router'

export default function ContactForm() {
  const navigation = useNavigation()
  const submitting = navigation.state === 'submitting'

  return (
    <Form method="post" action="/contact">
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send'}
      </button>
    </Form>
  )
}
```

<v-click>

**Form vs 原生 form**：用浏览器原生 form 语义（无 JS 也能工作）/ 拦截默认行为走 fetch + 客户端路由 / 自动管理 pending、actionData、revalidation

</v-click>

---
transition: slide-up
---

# useFetcher：非导航突变

需要"提交但不改变 URL"——列表内联点赞、收藏：

```tsx
import { useFetcher } from 'react-router'

export default function TaskItem({ task }: { task: Task }) {
  const fetcher = useFetcher()
  const busy = fetcher.state !== 'idle'

  return (
    <fetcher.Form method="post" action={`/tasks/${task.id}/toggle`}>
      <input type="hidden" name="done" value={(!task.done).toString()} />
      <button type="submit" disabled={busy}>{task.title}</button>
    </fetcher.Form>
  )
}
```

<v-click>

**fetcher 三件套**：`fetcher.Form` 不导航表单 / `fetcher.submit()` 命令式触发 / `fetcher.load()` 命令式加载 / `fetcher.state` + `fetcher.data` 状态返回值

</v-click>

---
transition: slide-up
---

# Route Module：完整导出表

```tsx
// app/routes/posts.$id.tsx
export async function loader({ params }: Route.LoaderArgs) { /* SSR */ }
export async function clientLoader({ params }: Route.ClientLoaderArgs) { /* SPA */ }
export async function action({ request }: Route.ActionArgs) { /* POST */ }
export async function clientAction({ request }: Route.ClientActionArgs) {}

export function meta() {
  return [{ title: 'My Post' }, { name: 'description', content: '...' }]
}
export function links() {
  return [{ rel: 'stylesheet', href: '/post.css' }]
}
export function headers() {
  return { 'Cache-Control': 'max-age=300, s-maxage=3600' }
}

export function ErrorBoundary() { /* 错误回退 */ }
export function HydrateFallback() { /* clientLoader 等待时 */ }
export function shouldRevalidate(args) { return false }
export const handle = { breadcrumb: 'Post' }

export default function Component({ loaderData }: Route.ComponentProps) {}
```

---
transition: slide-up
---

# meta + links：document head

```tsx
export async function loader({ params }: Route.LoaderArgs) {
  return db.posts.get(params.id)
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: data?.title ?? 'Post' },
    { name: 'description', content: data?.excerpt },
    { property: 'og:title', content: data?.title },
    { property: 'og:image', content: data?.cover },
  ]
}

export function links() {
  return [
    { rel: 'canonical', href: `https://my-site.com/posts/${data?.slug}` },
    { rel: 'stylesheet', href: '/post.css' },
    { rel: 'preload', as: 'image', href: '/banner.jpg' },
  ]
}
```

<v-click>

**关键规则**：`meta` 不合并——**最后一个匹配路由的 meta 覆盖父级**。

</v-click>

---
transition: slide-up
---

# ErrorBoundary：错误回退

```tsx
import { isRouteErrorResponse, useRouteError } from 'react-router'

export async function loader({ params }: Route.LoaderArgs) {
  const post = await db.posts.findUnique({ where: { id: params.id } })
  if (!post) throw new Response('Post not found', { status: 404 })
  return post
}

export function ErrorBoundary() {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return <div><h1>{error.status} {error.statusText}</h1><p>{error.data}</p></div>
  }
  if (error instanceof Error) return <p>{error.message}</p>
  return <h1>Unknown error</h1>
}
```

<v-click>

**机制**：loader / action / 组件渲染中**任何抛出**都被最近的 `ErrorBoundary` 捕获——无需 try/catch。

</v-click>

---
transition: slide-up
---

# HydrateFallback + shouldRevalidate

```tsx
// clientLoader 期间渲染（仅初次 hydration）
export function HydrateFallback() {
  return <div className="skeleton">Loading dashboard...</div>
}

export async function clientLoader() {
  return await fetchHeavyData()
}

clientLoader.hydrate = true as const

// 控制 loader 是否在导航/提交后重跑
export function shouldRevalidate({
  currentUrl, nextUrl, defaultShouldRevalidate,
}: Route.ShouldRevalidateArgs): boolean {
  if (currentUrl.pathname === nextUrl.pathname) return false
  return defaultShouldRevalidate
}
```

---
transition: slide-up
---

# 渲染模式：SSR / SPA / SSG

```ts
// react-router.config.ts
export default {
  ssr: true,                    // 1. SSR（默认）/ ssr: false → SPA
  async prerender() {           // 2. SSG（构建时预渲染）
    return ['/', '/about', '/pricing', '/blog']
  },
} satisfies Config
```

<v-click>

| 模式 | `ssr` | `prerender` | 适合 |
|---|---|---|---|
| **SSR** | `true` | - | 动态内容 |
| **SPA** | `false` | - | 后台 / 不需要 SEO |
| **SSG** | `true` | 返回 URL 列表 | 博客 / 文档 |
| **混合** | `true` | 部分路由 | 部分预渲染 + 其余 SSR |

**一份代码，三种产物**——只改配置不动业务代码。

</v-click>

---
transition: slide-up
---

# 预渲染：动态 URL 列表

```ts
// react-router.config.ts
import { db } from './app/lib/db.server'

export default {
  ssr: true,
  async prerender() {
    const posts = await db.posts.findMany({ select: { slug: true } })
    return ['/', '/about', ...posts.map((p) => `/posts/${p.slug}`)]
  },
} satisfies Config
```

<v-click>

**机制**：

- 构建时启动 build server，对每个 URL 调用 loader
- 序列化结果到 `build/client/`（HTML + 数据 payload）
- 部署静态 HTML + JS bundle，可与 SSR 路由混合

</v-click>

---
transition: slide-up
---

# Streaming with defer + Await

```tsx
import { Suspense } from 'react'
import { Await } from 'react-router'

export async function loader({}: Route.LoaderArgs) {
  // 关键数据 await（阻塞 HTML 首字节）
  const user = await db.users.getCurrent()
  // 慢数据不 await，作为 Promise 流式发出
  const reportPromise = db.reports.generateExpensive(user.id)
  return { user, reportPromise }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h1>Welcome {loaderData.user.name}</h1>
      <Suspense fallback={<Skeleton />}>
        <Await resolve={loaderData.reportPromise}>
          {(report) => <Chart data={report} />}
        </Await>
      </Suspense>
    </>
  )
}
```

---
transition: slide-up
---

# Streaming 工作流

```
1. 请求到达
   ↓
2. loader 跑：user await，reportPromise 不 await
   ↓
3. 服务端立即 flush HTML（含 user + <Skeleton />）
   ↓ 浏览器接收 → 首屏可见
4. reportPromise resolve → 服务端继续流式发 chunk
   ↓
5. 浏览器内联脚本替换 <Skeleton /> 为 <Chart />
```

<v-click>

**对比 React Server Components**：

- RR v7 流式机制是 **Promise + Suspense**，无需 RSC 协议
- 服务端代码（DB / SDK）放进 loader 即可，无 `"use server"` 心智
- 客户端组件无标记区分——所有组件都是普通 React Component

</v-click>

<v-click>

> 💡 **React 19 兼容**
>
> 在 React 19 下，`<Await>` 的内容也可以用 `use(promise)` 替代——同效，写法更紧凑。

</v-click>

---
transition: slide-up
---

# 类型安全：+types 自动生成

```tsx
// app/routes/posts.$id.tsx
import type { Route } from './+types/posts.$id'
//                          ↑ 自动生成（.react-router/types/）

export async function loader({ params }: Route.LoaderArgs) {
  //                            ↑ params.id 类型已知（来自 URL pattern）
  return db.posts.get(params.id)
}

export async function action({ request }: Route.ActionArgs) {
  return db.posts.update(/* ... */)
}

export function meta({ data }: Route.MetaArgs) {
  //              ↑ data 类型 = loader 返回类型
  return [{ title: data?.title }]
}

export default function Post({
  loaderData, actionData, params,
}: Route.ComponentProps) {
  return <h1>{loaderData.title}</h1>
}
```

---
transition: slide-up
---

# tsconfig + typegen 配置

```json
// tsconfig.json
{
  "include": [".react-router/types/**/*", "**/*.ts", "**/*.tsx"],
  "compilerOptions": {
    "types": ["@react-router/node", "vite/client"],
    "rootDirs": [".", "./.react-router/types"],
    "moduleResolution": "Bundler"
  }
}
```

```bash
# .gitignore: .react-router/
# package.json: "typecheck": "react-router typegen && tsc"
```

<v-click>

**工作流**：dev 模式自动重新生成 `+types/` / CI 跑 `react-router typegen && tsc` / 不要手写 `+types/`（会被覆盖）

</v-click>

---
transition: slide-up
---

# Session + Cookies

```ts
// app/lib/session.server.ts
import { createCookieSessionStorage } from 'react-router'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session', httpOnly: true, sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  },
})

export async function getSession(request: Request) {
  return sessionStorage.getSession(request.headers.get('Cookie'))
}
export async function commitSession(session: Session) {
  return sessionStorage.commitSession(session)
}
```

<v-click>

三种 session 存储工厂：`createCookieSessionStorage` / `createMemorySessionStorage` / `createFileSessionStorage`。CF 还提供 KV 版本。

</v-click>

---
transition: slide-up
---

# Auth 完整流程

```tsx
// app/routes/login.tsx
import { redirect, Form } from 'react-router'
import { commitSession, getSession } from '~/lib/session.server'

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const user = await db.users.findByEmail(formData.get('email') as string)
  if (!user) return { error: 'No user' }

  const session = await getSession(request)
  session.set('userId', user.id)
  return redirect('/dashboard', {
    headers: { 'Set-Cookie': await commitSession(session) },
  })
}

export default function Login({ actionData }: Route.ComponentProps) {
  return (
    <Form method="post">
      <input name="email" type="email" required /><button>Login</button>
      {actionData?.error && <p>{actionData.error}</p>}
    </Form>
  )
}
```

---
transition: slide-up
---

# 路由保护

```tsx
// app/lib/auth.server.ts
import { redirect } from 'react-router'

export async function requireUser(request: Request) {
  const session = await getSession(request)
  const userId = session.get('userId')
  if (!userId) throw redirect('/login')
  return db.users.get(userId)
}
```

```tsx
// app/routes/dashboard.tsx
import { requireUser } from '~/lib/auth.server'

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request)
  return { user, stats: await db.stats.get(user.id) }
}
```

<v-click>

**模式**：`throw redirect()` 在 loader 中等同于"权限不足拦截"，React Router 自动跟随 redirect。

</v-click>

---
transition: slide-up
---

# Adapter 体系：多端部署

```bash
npm install @react-router/node          # Node / @react-router/cloudflare
npm install @react-router/express       # Express / @react-router/serve
```

<v-click>

**官方模板**：

| 模板 | 平台 |
|---|---|
| `default` | Node + `react-router-serve` |
| `cloudflare` | Cloudflare Workers + KV |
| `vercel` / `netlify` | Vercel / Netlify Functions |
| `node-custom-server` | 自定义 Express server |

`npx create-react-router@latest --template remix-run/react-router-templates/<name>`

</v-click>

---
transition: slide-up
---

# Cloudflare Workers 部署

```ts
// vite.config.ts
import { reactRouter } from '@react-router/dev/vite'
import { cloudflareDevProxy } from '@react-router/dev/vite/cloudflare'

export default defineConfig({
  plugins: [cloudflareDevProxy(), reactRouter()],
})
```

```ts
// workers/app.ts
import { createRequestHandler } from 'react-router'

export default {
  fetch(request, env, ctx) {
    return createRequestHandler(
      () => import('virtual:react-router/server-build'), 'production',
    )(request, { cloudflare: { env, ctx } })
  },
} satisfies ExportedHandler<Env>
```

<v-click>

部署：`wrangler deploy`。无 cold start，毫秒级响应。`AppLoadContext` 注入 `env.MY_KV` 等 binding。

</v-click>

---
transition: slide-up
---

# 从 Remix 迁移：4 步流程

```bash
# 1. Remix v2 + 启用所有 future flags
# 2. 跑 codemod
npx codemod remix/2/react-router/upgrade && npm install

# 3. 添加 app/routes.ts
import { flatRoutes } from '@react-router/fs-routes'
export default flatRoutes() satisfies RouteConfig

# 4. 添加 react-router.config.ts
export default { ssr: true } satisfies Config
```

<v-click>

**核心改动**：

- `@remix-run/react` → `react-router`
- `@remix-run/node` → `@react-router/node`
- `vitePlugin as remix` → `reactRouter`
- `<RemixServer>` / `<RemixBrowser>` → `<ServerRouter>` / `<HydratedRouter>`

</v-click>

---
transition: slide-up
---

# Data 模式：兼容 v6.4+

不要 SSR / Vite 插件，只用数据路由：

```tsx
import { createBrowserRouter, RouterProvider } from 'react-router'

const router = createBrowserRouter([
  {
    path: '/', Component: Root,
    children: [
      { index: true, Component: Home },
      {
        path: 'posts/:id', Component: Post,
        loader: async ({ params }) => {
          const res = await fetch(`/api/posts/${params.id}`)
          return res.json()
        },
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)
```

<v-click>

**适用**：v6.4+ data router 项目升级 / 不想要 Vite 插件 / 保留 SPA 心智

</v-click>

---
transition: slide-up
---

# Declarative 模式：兼容 v6

最简模式，等同于经典 `<BrowserRouter>`：

```tsx
// src/main.tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router'
import { createRoot } from 'react-dom/client'

function App() {
  return (
    <BrowserRouter>
      <nav><Link to="/">Home</Link> | <Link to="/about">About</Link></nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
```

<v-click>

**适用**：CRA 迁移、不需要 loader / action、需要把路由配置写在 JSX 中（动态嵌套）。

**功能**：仅匹配 + 导航，**无 loader / action / 代码分割**。

</v-click>

---
transition: slide-up
---

# 何时选哪个模式？

<v-clicks>

- **新项目 / Remix 用户** → **Framework 模式**（最完整，未来主流）
- **既有 v6 项目升级到 v6.4 data router** → **Data 模式**（无 Vite 插件，最小改动）
- **CRA / Vite SPA 升级，不需要数据加载** → **Declarative 模式**（最轻）
- **要 SSR / SSG / 部署 adapter** → 必须 Framework 模式
- **要类型自动生成 `Route.LoaderArgs`** → 必须 Framework 模式（仅它支持）
- **要写在客户端但用 loader 心智** → Framework 模式 + `ssr: false`

</v-clicks>

<v-click>

> 💡 **三种模式可以共存**
>
> 一个项目可以从 Declarative 起步，需要数据时切 Data，最终升级到 Framework——所有 API 同源，迁移路径平滑。

</v-click>

---
transition: slide-up
---

# vs Next.js App Router

| 维度 | React Router v7 | Next.js 16 |
|---|---|---|
| UI 模型 | React Component（无 RSC） | RSC |
| 数据加载 | `loader` / `clientLoader` | RSC async component |
| 数据变更 | `action` / `<Form>` | Server Actions |
| Client / Server | **无显式边界** | `"use client"` 强制 |
| 流式 SSR | `Suspense` + `Await` | RSC streaming |
| 部署 | Node / CF / Vercel / Netlify | Vercel 最优 |

<v-click>

**何时选 RR v7**：拒绝 RSC 复杂度 / 保留传统 React 模型 / 部署 CF Workers / 从 Remix 升级

</v-click>

---
transition: slide-up
---

# vs Remix（已合并）

| 维度 | Remix v2 | React Router v7 |
|---|---|---|
| 包来源 | `@remix-run/*` | `react-router` / `@react-router/*` |
| Vite 插件 | `vitePlugin as remix` | `reactRouter` |
| 入口组件 | `<RemixServer>` / `<RemixBrowser>` | `<ServerRouter>` / `<HydratedRouter>` |
| 路由配置 | 文件约定（隐式） | `routes.ts`（显式）/ `flatRoutes()`（可选） |
| 类型 | 手写 `LoaderFunctionArgs` | 自动生成 `Route.LoaderArgs` |
| 路线 | 不再独立发版 | 继任者 |

<v-click>

**实操**：跑 codemod 即可——大部分 Remix v2 项目能在 30 分钟内迁移到 v7。

```bash
npx codemod remix/2/react-router/upgrade
```

</v-click>

---
transition: slide-up
---

# vs TanStack Router

| 维度 | React Router v7 | TanStack Router |
|---|---|---|
| 主要场景 | SSR 元框架 + SPA | SPA 类型安全路由 |
| 路由配置 | `routes.ts` / `flatRoutes()` | `__root.tsx` + 文件树 |
| 类型安全 | `+types/` 自动生成 | 编译期路径校验 |
| 数据加载 | `loader` + auto revalidation | `loader` + react-query |
| SSR | 一等公民 | TanStack Start（独立） |

<v-click>

**关键区别**：TSR 类型推导更激进 / TSR SPA 优化更彻底 / RR 生态更大、Adapter 完整

</v-click>

---
transition: slide-up
---

# 常见踩坑（一）：.server / .client 边界

```ts
// ❌ db client 被组件直接 import → 客户端 bundle 泄漏
// app/lib/db.ts
import { PrismaClient } from '@prisma/client'
export const db = new PrismaClient()

// app/routes/users.tsx
import { db } from '~/lib/db'                    // ← 客户端也打包了 prisma
```

```ts
// ✅ 用 .server.ts 后缀强制服务端独占
// app/lib/db.server.ts
import { PrismaClient } from '@prisma/client'
export const db = new PrismaClient()

// 同样可用 .client.ts 标记仅客户端
```

<v-click>

**规则**：

- `.server.ts` / `.server.tsx` → 只在服务端 bundle，客户端引用编译报错
- `.client.ts` / `.client.tsx` → 只在客户端 bundle，服务端引用为空 stub
- 默认（无后缀）→ 双端 bundle

</v-click>

---
transition: slide-up
---

# 常见踩坑（二）：loader 序列化限制

```ts
// ❌ 不可序列化的值会丢失
export async function loader() {
  return {
    user: { name: 'Alice' },
    onClick: () => console.log('hi'),     // ← 函数不可序列化
    map: new Map([['a', 1]]),             // ← Map 序列化后变 {}（旧版）
    date: new Date(),                      // ✅ v7 支持 Date
  }
}
```

<v-click>

**v7 支持的可序列化类型**（对齐 React Server Components）：

- 基础：string / number / boolean / null / undefined
- 集合：Array / Object / **Map** / **Set**
- 时间：**Date**
- 错误：**Error**（堆栈丢失）
- Promise（用于 streaming）

</v-click>

<v-click>

**不支持**：函数 / class instance（含 prototype）/ Symbol / 循环引用。

</v-click>

---
transition: slide-up
---

# 常见踩坑（三）：忘加 ScrollRestoration

```tsx
// ❌ 路由切换后滚动位置不重置
export function Layout({ children }) {
  return <html><body>{children}<Scripts /></body></html>
}
```

```tsx
// ✅ 必须有 ScrollRestoration
import { ScrollRestoration } from 'react-router'

export function Layout({ children }) {
  return (
    <html><body>
      {children}<ScrollRestoration /><Scripts />
    </body></html>
  )
}
```

<v-click>

**机制**：前进/后退 → 恢复历史位置；新导航 → 顶部；自定义 `getKey={(loc) => loc.pathname}`

</v-click>

---
transition: slide-up
---

# 常见踩坑（四）：revalidation 默认全部

```tsx
// 一个无关变更，触发了整页 loader 全部重跑
// app/routes/list.tsx
export async function loader() {
  return db.posts.findMany()       // ← 任何 action 完成都会重跑
}

// app/routes/list._index.tsx
export async function action({ request }) {
  await db.user.updateProfile(...)   // ← 与 posts 无关，但 list 也重跑了
}
```

```tsx
// ✅ 用 shouldRevalidate 精确控制
export function shouldRevalidate({ formAction, defaultShouldRevalidate }) {
  if (formAction === '/user/profile') return false   // 无关变更不重跑
  return defaultShouldRevalidate
}
```

<v-click>

**默认行为**：action 完成 → **当前路由树所有 loader** 重跑（保证一致性）。需精细控制时手写 `shouldRevalidate`。

</v-click>

---
transition: slide-up
---

# 常见踩坑（五）：HydrateFallback 必须导出

```tsx
// ❌ 用了 clientLoader.hydrate = true 但忘了 HydrateFallback
export async function clientLoader() {
  return await fetchHeavyData()
}
clientLoader.hydrate = true as const

// 初次访问会报错：missing HydrateFallback
export default function Page({ loaderData }) {
  return <h1>{loaderData.title}</h1>
}
```

```tsx
// ✅ 配套 HydrateFallback
export function HydrateFallback() {
  return <Skeleton />
}
```

<v-click>

**规则**：

- 只有 `clientLoader` 而无 `loader` → 初次访问必须 `HydrateFallback`
- `clientLoader.hydrate = true` → 哪怕有 `loader`，hydration 期也需要 `HydrateFallback`

</v-click>

---
transition: slide-up
---

# 常见踩坑（六）：useNavigation vs useFetcher state

```tsx
// 不同场景看不同 state
import { useNavigation, useFetcher } from 'react-router'

// 全局导航状态（路由跳转 / Form 提交）
const nav = useNavigation()
nav.state              // 'idle' | 'loading' | 'submitting'
nav.formData           // 进行中的提交数据
nav.location           // 目标 location

// 局部 fetcher 状态（无导航）
const fetcher = useFetcher()
fetcher.state          // 'idle' | 'loading' | 'submitting'
fetcher.data           // action 返回值
fetcher.formData       // 进行中的提交数据
```

<v-click>

**经验**：

- 全屏 loading 条 / 进度指示 → `useNavigation`
- 列表项内的"保存中..." → `useFetcher` 上的局部状态
- 多个 fetcher 同时进行 → `useFetchers()`（返回数组）

</v-click>

---
transition: slide-up
---

# 经验法则

<v-clicks>

- **新项目选 Framework 模式** → 最完整，未来主流
- **`.server.ts` 隔离服务端代码** → DB / secrets 都加后缀
- **loader 优先 over clientLoader** → 让数据先在 SSR 跑，搜索引擎友好
- **action 不要手写 revalidate** → 框架自动重跑所有 loader
- **路由保护用 `throw redirect()`** → loader 中拦截未登录
- **`<Form>` 优先 over `useFetcher`** → 渐进增强、无 JS 也工作
- **`useFetcher` 用在列表内联突变** → 不改 URL 不导航
- **类型用 `Route.LoaderArgs`** → 自动生成最准确
- **从 Remix 迁移跑 codemod** → 4 步 30 分钟搞定
- **三模式可演进** → Declarative → Data → Framework 平滑升级

</v-clicks>

---
transition: slide-up
---

# 不适合 React Router v7 的场景

<v-clicks>

- **重 RSC / 流式数据库 stream 直推 client** → Next.js + RSC 更成熟
- **强类型路径推导 / 编译期路由校验** → TanStack Router 类型更激进
- **极小 SPA / 不需要数据加载** → React Router Declarative 模式过重，可选 Wouter
- **Vercel 全家桶深度依赖（AI / Analytics / KV）** → Next.js + Vercel 一体化更顺
- **企业中后台依赖 React 全家桶（Ant Design / MUI Dashboard）** → 这些模板默认 Next.js / CRA
- **想要内置静态站点优化（图片 / 字体）** → Astro / Next.js 自带，RR 需手动

</v-clicks>

<v-click>

> **经验**：React Router v7 最强场景是"**中型 SSR 应用 / Remix 项目升级 / Cloudflare Workers 部署 / 团队想要 React 但拒绝 RSC**"——传统 React 心智 + 现代 SSR 能力的最佳平衡点。

</v-click>

---
transition: slide-up
---

# 下一步学习路径

```
入门
├── 跑通默认模板 + 读 Quick Start
├── 写一个 CRUD：Posts 列表 + 新建 + 详情
└── 理解 routes.ts + 嵌套路由

进阶
├── loader / action / clientLoader 三件套
├── Form / useFetcher / useNavigation
└── ErrorBoundary + Session + Auth

实战
├── 选 Adapter 部署（Node / CF / Vercel）
├── 流式 SSR + SSG prerender 混合
└── 类型生成 + 性能调优
```

<v-click>

**官方资源**：[reactrouter.com](https://reactrouter.com) | [templates](https://github.com/remix-run/react-router-templates) | [examples](https://github.com/remix-run/react-router/tree/main/examples)

</v-click>

---
layout: center
class: text-center
---

# 总结

适合：中型 SSR 应用 / Remix 升级 / CF 部署 / 拒绝 RSC 复杂度

少做：重 RSC 流式 / Vercel 深度绑定 / 极简纯 SPA

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://reactrouter.com" target="_blank">reactrouter.com</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/remix-run/react-router" target="_blank">remix-run/react-router</a>
</div>

<div class="mt-4">
  <carbon:play /> <a href="https://reactrouter.com/start/framework/installation" target="_blank">Framework Quick Start</a>
</div>
