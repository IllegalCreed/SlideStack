---
theme: seriph
background: https://cover.sli.dev
title: Welcome to TanStack Start
info: |
  Presentation TanStack Start for frontend developers.

  Learn more at [https://tanstack.com/start](https://tanstack.com/start)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:react class="text-7xl" />
</div>

<br/>

## TanStack Start — Type-Safe Full-Stack React

Built on TanStack Router：以类型安全的路由为内核，向上长出 SSR / 流式渲染 / Server Functions 的全栈元框架

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 TanStack Start。

TanStack 生态里继 Router / Query / Form / Table 之后的元框架收官之作 —— 把
TanStack Router 包装成完整的全栈框架：SSR / 流式 / Server Functions / 部署 adapter
都齐了。

定位：React 世界里"以类型安全为核心卖点"的 Next.js / Remix 替代品。当下 (2026) 仍处
Release Candidate（RC）阶段，API 已 freeze，等 v1 正式发布。
-->

---
transition: fade-out
---

# 什么是 TanStack Start？

基于 TanStack Router 的全栈 React 元框架，把"端到端类型安全"做到极致

<v-click>

- **TanStack Router 内核**：文件 / 代码两种路由模式，编译期校验路径、参数、search
- **类型贯穿**：URL params / search params (Zod) / loader / server function 全链路推导
- **SSR + Streaming**：默认 SSR，流式渲染、Selective SSR、SPA / SSG 一份代码切换
- **Server Functions**：`createServerFn` 把服务端函数变成可远程调用的 RPC（类型安全）
- **Middleware 体系**：路由中间件 / Server Function 中间件，可组合可链式
- **Server Routes**：和路由同源的 API endpoints（GET / POST / PUT / DELETE）
- **Vite 原生**：构建工具直接是 Vite，开发体验对齐其它 Vite 生态
- **部署灵活**：Cloudflare / Netlify / Vercel / Node / Bun / Static 任选

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_TanStack Start_](https://tanstack.com/start)

</div>

<style>
h1 {
  background-color: #FF4154;
  background-image: linear-gradient(45deg, #FF4154 10%, #38BDF8 90%);
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

类型安全是真的强，但 RC 阶段 + 文档稚嫩是真的得忍

<v-clicks>

**优点**
- 类型推导业界顶配：路径 / search / loader / server fn 全链路编译期校验
- Vite 构建快，Router 内核成熟，无 Webpack/Turbopack 历史包袱
- Server Functions 心智近 React Server Actions，但更通用
- 中间件可组合 + 工厂模式，权限 / 日志 / 限流好抽象
- 部署无锁定（Cloudflare / Vercel / Netlify / Node 同源）
- 与 TanStack Query 双层缓存协作天然

**缺点**
- RC 阶段（2026 仍未 v1），API freeze 但偶有边角变动
- 文档体量 vs Next.js 仍小，深度场景需读源码 / Discord
- 招聘候选人少，主要靠 React Router / Next.js 迁移
- 类型推导编译开销大，超大项目 IDE 响应吃力

</v-clicks>

---
transition: slide-up
---

# TanStack 生态：Start 的来历

```
TanStack/
├── router        ← 类型安全路由（Start 内核）
├── query         ← 异步数据缓存（双层缓存搭档）
├── form          ← 类型安全表单
├── table         ← Headless 数据表格
├── virtual       ← 虚拟列表
├── store         ← 细粒度状态库
├── ranger        ← 滑块 / 区间
├── pacer         ← 速率限制
└── start         ← 元框架（整合 router + ssr + server fn + adapter）
```

<v-click>

**Start vs Router**：

- **TanStack Router** 是纯客户端 / SPA 路由库（类型安全 + Suspense + 嵌套）
- **TanStack Start** = Router + Vite plugin + SSR pipeline + Server Functions + adapter
- 关系类似 Next.js 之于 React、SolidStart 之于 SolidJS

</v-click>

<v-click>

> 💡 **提示**
>
> 只要 SPA 路由用 Router 即可；要 SSR / Server Functions / 全栈才升级 Start。

</v-click>

---
transition: slide-up
---

# 定位与生态

TanStack Start 在元框架版图里的位置

<v-clicks>

- **谁在做**：Tanner Linsley（React Query / React Table 作者）+ TanStack 团队
- **基础**：基于 Vite + TanStack Router，未来部署层走 Nitro adapter
- **当下状态**：**Release Candidate（RC）**——API 已 freeze 但仍标记 "may have bugs"
- **与 Next.js 类比**：定位重合（SSR + 全栈），但反 RSC 默认 / 反 Vercel 锁定
- **与 React Router v7 类比**：都强调类型安全，RR v7 走 Remix 路径，Start 走 Query 范式
- **与 SolidStart 类比**：`createServerFn` 心智 ≈ `"use server"`，但更显式
- **关键卖点**：**编译期类型校验 + 部署平台无锁定 + Vite 速度**
- **学习路径**：Router 基础 → Start 项目结构 → loader + server fn → SSR/SSG → 部署

</v-clicks>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 关键事件 |
|---|---|---|
| **Router 1.0** | 2024.1 | TanStack Router 首个稳定版（类型安全路由 GA） |
| **Start Alpha** | 2024.中 | 早期元框架预览，基于 Vinxi |
| **Start Beta** | 2024.下半 | 切换到 Vite 直连，`createServerFn` 范式确立 |
| **Start RC** | 2025 | API freeze，进入 Release Candidate |
| **Start RC.x** | 2026 初 | 中间件 / Selective SSR / Server Routes 完善 |
| **v1 GA** | 2026+ | 正式 v1 待官方宣告 |

<v-click>

今天讲的是 **Start RC 稳定线**——API 与 v1 完全一致，可用于生产，但需关注 Discord / Changelog 跟进小调整。

</v-click>

---
transition: slide-up
---

# 创建项目

```bash
# 官方 CLI（推荐）
npx @tanstack/cli@latest create
# → 交互式选模板：basic / basic-react-query / auth / supabase / ...
# → 选包管理器、ESLint、Tailwind

cd my-app
pnpm install
pnpm dev                # http://localhost:3000
```

<v-click>

或者从模板克隆：

```bash
npx gitpick TanStack/router/tree/main/examples/react/start-basic my-app
cd my-app && pnpm install && pnpm dev
```

</v-click>

<v-click>

要求 Node 20+ / React 19+。生产构建：

```bash
pnpm build              # 产物默认 .output/
pnpm start              # 启动 Node server
```

</v-click>

<v-click>

> 💡 **提示**
>
> 还有 TanStack Builder（AI-first 在线脚手架），适合从零起步、不想本地装环境。

</v-click>

---
transition: slide-up
---

# 项目结构

```
my-app/
├── src/
│   ├── routes/                # 文件路由根
│   │   ├── __root.tsx         # 根布局（含 HeadContent / Scripts）
│   │   ├── index.tsx          # /
│   │   ├── posts/
│   │   │   ├── index.tsx      # /posts
│   │   │   └── $postId.tsx    # /posts/:postId
│   │   └── api/users.ts       # /api/users (server route)
│   ├── routeTree.gen.ts       # ← 自动生成，勿手改
│   ├── router.tsx             # createRouter()
│   └── start.ts               # 全局 middleware 注册（可选）
├── vite.config.ts             # tanstackStart() + viteReact()
└── package.json
```

<v-click>

**关键点**：

- `__root.tsx` 必须含 `<HeadContent />` + `<Scripts />`
- `routeTree.gen.ts` 由 Vite 插件自动生成，加 `.gitignore`
- `start.ts` 全局配置入口（middleware / 默认 SSR）

</v-click>

---
transition: slide-up
---

# vite.config.ts

```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    tanstackStart({
      // spa: { enabled: true },                    // SPA 模式
      // prerender: { enabled: true, crawlLinks: true },  // SSG
    }),
    viteReact(),
  ],
})
```

<v-click>

**`tanstackStart()` 做了什么**：

- 读 `src/routes/` 生成 `routeTree.gen.ts`
- 注入 client / server 双 entry + SSR pipeline
- 编译 `createServerFn` 为客户端 fetch stub
- 桥接部署 adapter（Nitro / 平台 plugin）

</v-click>

---
transition: slide-up
---

# router.tsx + start.ts

```tsx
// src/router.tsx
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',     // 链接 hover 预加载
    defaultErrorComponent: ErrorFallback,
  })
}

// 类型注册（端到端推导依赖）
declare module '@tanstack/react-router' {
  interface Register { router: ReturnType<typeof getRouter> }
}
```

```ts
// src/start.ts（可选 — 全局中间件）
export const startInstance = createStart(() => ({
  requestMiddleware: [globalLogging],
  functionMiddleware: [globalAuth],
  defaultSsr: true,
}))
```

---
transition: slide-up
---

# __root.tsx：根布局

```tsx
// src/routes/__root.tsx
import { createRootRoute, Outlet, HeadContent, Scripts } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  component: () => (
    <html>
      <head><HeadContent /></head>
      <body><Outlet /><Scripts /></body>
    </html>
  ),
})
```

<v-click>

**核心**：`<HeadContent />` 渲染匹配路由的 `head`；`<Scripts />` 注入 hydration；`<Outlet />` 渲染子路由。

</v-click>

---
transition: slide-up
---

# 文件路由约定

```
src/routes/
├── __root.tsx                # 根布局（特殊）
├── index.tsx                 # /
├── posts.tsx                 # /posts 父布局
├── posts/$postId.tsx         # /posts/:postId
├── _auth/login.tsx           # /login（分组不影响 URL）
└── rest/$.tsx                # /rest/* (catch-all)
```

<v-click>

| 文件名 | 含义 |
|---|---|
| `index.tsx` / `$param.tsx` / `$.tsx` | 根路径 / 动态参数 / catch-all |
| `_xx.tsx` 前缀 / `__root.tsx` | 分组布局（URL 不含）/ 应用根（唯一） |

</v-click>

---
transition: slide-up
---

# createFileRoute：类型安全路由

```tsx
// src/routes/posts/$postId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  beforeLoad: async ({ params }) => ({ breadcrumb: `Post ${params.postId}` }),

  loader: async ({ params }) => {
    const post = await fetchPost(params.postId)
    if (!post) throw notFound()
    return post
  },

  component: PostComponent,
})

function PostComponent() {
  const post = Route.useLoaderData()    // ← 类型自动推导为 Post
  const { postId } = Route.useParams()  // ← postId: string
  return <h1>{post.title}</h1>
}
```

<v-click>

`/posts/$postId` 字符串由 Vite 插件自动写入，开发者只关心组件——类型推导端到端贯穿。

</v-click>

---
transition: slide-up
---

# Search Params：Zod 校验

```tsx
// src/routes/posts/index.tsx
import { z } from 'zod'

const searchSchema = z.object({
  page: z.number().int().min(1).catch(1),
  tag: z.string().optional(),
  sort: z.enum(['date', 'title']).catch('date'),
})

export const Route = createFileRoute('/posts/')({
  validateSearch: searchSchema,                                  // URL 校验 + 转换
  loaderDeps: ({ search }) => ({ page: search.page, tag: search.tag }),
  loader: async ({ deps }) => fetchPosts(deps),                  // search 变化重跑
  component: PostsList,
})

function PostsList() {
  const search = Route.useSearch()      // ← { page, tag?, sort }
  const navigate = Route.useNavigate()
  return <button onClick={() => navigate({ search: (s) => ({ ...s, page: s.page + 1 }) })}>Next</button>
}
```

---
transition: slide-up
---

# loader + beforeLoad

```tsx
// src/routes/dashboard.tsx
export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context, location }) => {
    if (!context.user) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
    return { user: context.user }                       // 返回值进入子 context
  },
  loader: async ({ context }) => ({
    stats: await fetchStats(context.user.id),
  }),
  component: DashboardLayout,
})
```

<v-click>

**层级关系**：

- `beforeLoad` 自上而下串行，可 `throw redirect()` / `notFound()` 拦截
- `loader` 默认并行（父子同时跑），子可读父 `context`
- 任何一层抛错 → 最近的 `errorComponent` 兜底

</v-click>

---
transition: slide-up
---

# Server Functions：createServerFn

```ts
// src/server/posts.ts
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export const getPost = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const post = await db.posts.findUnique({ where: { id: data.id } })
    if (!post) throw notFound()
    return post
  })

export const createPost = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ title: z.string().min(2) }))
  .handler(async ({ data }) => db.posts.create({ data }))
```

<v-click>

**核心特性**：函数体只进服务端 bundle，客户端调用编译为 `fetch` POST stub；端到端类型推导，无需手写 API contract；`inputValidator` 支持 Zod / Yup / 自定义。

</v-click>

---
transition: slide-up
---

# Server Function：客户端调用

```tsx
// 方式 A：在 route loader 中调用
export const Route = createFileRoute('/posts/$id')({
  loader: ({ params }) => getPost({ data: { id: params.id } }),
  component: PostView,
})

// 方式 B：在组件中用 useServerFn 直接调
function CreateButton() {
  const create = useServerFn(createPost)
  return <button onClick={() => create({ data: { title: 'New' } })}>Create</button>
}

// 方式 C：配合 TanStack Query
const { data } = useQuery({
  queryKey: ['post', id],
  queryFn: () => getPost({ data: { id } }),
})
```

---
transition: slide-up
---

# Server Function：错误与重定向

```ts
import { redirect, notFound } from '@tanstack/react-router'

export const requireAuth = createServerFn().handler(async () => {
  const user = await getCurrentUser()
  if (!user) throw redirect({ to: '/login' })  // 客户端自动跟随
  return user
})

export const getResource = createServerFn()
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const item = await db.resource.findUnique({ where: { id: data.id } })
    if (!item) throw notFound()
    return item
  })

export const riskyOp = createServerFn().handler(async () => {
  throw new Error('Boom')   // → 客户端 try/catch 捕获，message 序列化
})
```

<v-click>

> 💡 **可序列化要求**：返回值必须 JSON 可序列化（含 Date / Map / Set / Promise）。函数 / class instance 会丢失。

</v-click>

---
transition: slide-up
---

# Middleware：基础

```ts
import { createMiddleware } from '@tanstack/react-start'

// 1. Request middleware（包整个请求）
const logging = createMiddleware().server(async ({ next, request }) => {
  const t0 = Date.now()
  const res = await next()
  console.log(`${request.method} ${request.url} - ${Date.now() - t0}ms`)
  return res
})

// 2. Server Function middleware
const auth = createMiddleware({ type: 'function' })
  .server(async ({ next }) => {
    const user = await getCurrentUser()
    if (!user) throw new Error('Unauthorized')
    return next({ context: { user } })   // 注入下游 context
  })
```

<v-click>

**两种类型**：`createMiddleware()` 包整个 HTTP 请求；`createMiddleware({ type: 'function' })` 只包 server fn 调用。

</v-click>

---
transition: slide-up
---

# Middleware：链式 + 工厂

```ts
// 中间件可以依赖其他中间件
const adminOnly = createMiddleware({ type: 'function' })
  .middleware([auth])                             // ← 依赖 auth
  .server(async ({ next, context }) => {
    if (context.user.role !== 'admin') throw new Error('Forbidden')
    return next()
  })

// 工厂：参数化中间件
export function requireRole(role: string) {
  return createMiddleware({ type: 'function' })
    .middleware([auth])
    .server(async ({ next, context }) => {
      if (context.user.role !== role) throw new Error('Forbidden')
      return next()
    })
}

// 应用到 server function
const deleteUser = createServerFn({ method: 'POST' })
  .middleware([requireRole('admin')])
  .handler(async () => db.users.delete(...))
```

<v-click>

> 💡 `next({ context: {...} })` 注入下游，下游 `context.xxx` 类型自动可见——中间件组合的核心机制。

</v-click>

---
transition: slide-up
---

# 渲染模式：SSR / SPA / SSG

```ts
// vite.config.ts
tanstackStart({
  // SSR（默认）—— 无需配置
  // spa: { enabled: true },                          // SPA 纯客户端
  // prerender: {                                     // SSG 预渲染
  //   enabled: true,
  //   crawlLinks: true,
  //   pages: ['/', '/about', '/pricing'],
  // },
})
```

<v-click>

| 模式 | 配置 | 适合 |
|---|---|---|
| **SSR** | 默认 | 动态内容、个性化 |
| **SPA** | `spa: { enabled }` | 后台 / SaaS |
| **SSG** | `prerender: { enabled, crawlLinks }` | 博客 / 文档 |

</v-click>

---
transition: slide-up
---

# Selective SSR：单路由开关

每个路由都能独立决定 SSR 行为：

```tsx
export const Route = createFileRoute('/dashboard')({
  // ssr: true,             // 完整 SSR（默认）
  // ssr: 'data-only',      // 数据预取，组件在客户端渲染
  ssr: false,               // 全部客户端

  loader: () => fetchDashboard(),
  component: Dashboard,
})
```

<v-click>

**三档语义**：

- `true`（默认）→ beforeLoad + loader + render 全在服务端
- `'data-only'` → beforeLoad + loader 服务端，render 在客户端
- `false` → 全部客户端

</v-click>

<v-click>

> 💡 **继承规则**：子路由只能比父更严格（`true → data-only → false`），不能反向。

</v-click>

---
transition: slide-up
---

# 流式渲染：defer + Await

```tsx
import { Await } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    const user = await getCurrentUser()                  // 关键数据 await
    const reportPromise = generateReport(user.id)        // 慢数据不 await
    return { user, reportPromise }
  },
  component: Dashboard,
})

function Dashboard() {
  const { user, reportPromise } = Route.useLoaderData()
  return (
    <>
      <h1>Welcome {user.name}</h1>
      <Suspense fallback={<Skeleton />}>
        <Await promise={reportPromise}>{(report) => <Chart data={report} />}</Await>
      </Suspense>
    </>
  )
}
```

---
transition: slide-up
---

# 与 TanStack Query 协作

```tsx
// src/router.tsx —— 共享 queryClient
const queryClient = new QueryClient()

export function getRouter() {
  return createRouter({ routeTree, context: { queryClient } })
}

// 路由 loader 中 prefetch
export const Route = createFileRoute('/posts')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({ queryKey: ['posts'], queryFn: getPosts }),
  component: PostsList,
})

function PostsList() {
  // 组件中读同一个 cache，命中即 sync 返回
  const { data } = useSuspenseQuery({ queryKey: ['posts'], queryFn: getPosts })
  return data.map((p) => <Post key={p.id} {...p} />)
}
```

<v-click>

**双层缓存**：Router loader（per-route）+ Query cache（全局）——SSR 数据序列化进 HTML，客户端 hydration 直接命中。

</v-click>

---
transition: slide-up
---

# Server Routes：API endpoints

```ts
// src/routes/api/users.ts
export const Route = createFileRoute('/api/users')({
  server: {
    handlers: {
      GET: async () => Response.json(await db.users.findMany()),
      POST: async ({ request }) => {
        const user = await db.users.create({ data: await request.json() })
        return Response.json(user, { status: 201 })
      },
    },
  },
})

// src/routes/api/users/$id.ts → /api/users/:id
export const Route = createFileRoute('/api/users/$id')({
  server: {
    handlers: {
      GET: async ({ params }) => Response.json(await db.users.get(params.id)),
      DELETE: async ({ params }) => (await db.users.delete(params.id), new Response(null, { status: 204 })),
    },
  },
})
```

---
transition: slide-up
---

# Server Routes vs Server Functions

| 维度 | Server Route | Server Function |
|---|---|---|
| 暴露 | 公开 URL（`/api/x`） | 内部 RPC endpoint |
| 调用 | `fetch` / 外部 client | `useServerFn` / loader 内直调 |
| 类型推导 | 需手写契约 | 端到端自动 |
| 适合 | webhook / 三方集成 | UI 自家用 |
| 中间件 | `server.middleware` | `.middleware([...])` |

<v-click>

**经验**：UI 内部数据流用 `createServerFn`（类型最舒服）；第三方 webhook / OAuth callback / GraphQL 用 Server Route；两边都用则写 Route，UI 再包 `createServerFn`。

</v-click>

---
transition: slide-up
---

# Auth：完整流程

```ts
// 1. 当前用户 server function
export const getCurrentUser = createServerFn().handler(async () => {
  const session = await getSession()
  if (!session?.userId) return null
  return db.users.get(session.userId)
})

// 2. 根 route 注入 context
export const Route = createRootRouteWithContext<{ user: User | null }>()({
  beforeLoad: async () => ({ user: await getCurrentUser() }),
  component: () => <Outlet />,
})

// 3. 受保护路由
export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context, location }) => {
    if (!context.user) throw redirect({ to: '/login', search: { redirect: location.href } })
  },
  loader: async ({ context }) => ({ stats: await getStats(context.user!.id) }),
  component: Dashboard,
})
```

<v-click>

**模式**：根 route 拉一次 user → 子 route `beforeLoad` 检查 → 未登录 `throw redirect()`。

</v-click>

---
transition: slide-up
---

# 部署：Cloudflare / Netlify / Vercel

```ts
// vite.config.ts —— Cloudflare Workers
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  plugins: [cloudflare(), tanstackStart(), viteReact()],
})
```

<v-click>

**官方支持平台**：

| 平台 | 配置 |
|---|---|
| **Cloudflare** | `@cloudflare/vite-plugin` |
| **Netlify** | `@netlify/vite-plugin-tanstack-start` |
| **Vercel** | Nitro preset（自动检测） |
| **Node / Static** | 默认产物 / `prerender: { enabled }` |

</v-click>

---
transition: slide-up
---

# 类型贯穿：举例

```tsx
// 1. 文件路径 → 路由类型自动生成到 routeTree.gen.ts
// /posts/$postId → typeof Route.fullPath = '/posts/$postId'

// 2. params 类型来自路径
const { postId } = Route.useParams()    // postId: string

// 3. search 类型来自 validateSearch
const { page, tag } = Route.useSearch() // page: number, tag?: string

// 4. loaderData 来自 loader 返回类型
const post = Route.useLoaderData()      // Post

// 5. Server Function 类型从 validator + handler 推导
const post = await getPost({ data: { id: '1' } })
//    ↑ Post                    ↑ { id: string }

// 6. <Link> 路径检查
<Link to="/posts/$postId" params={{ postId: '1' }} />
//        ↑ 编译期校验存在该路由              ↑ params 必填且类型匹配
```

<v-click>

**唯一手动声明**：在 `router.tsx` 里 `declare module '@tanstack/react-router'` 注册 router 类型——之后所有泛型自动推导。

</v-click>

---
transition: slide-up
---

# vs Next.js App Router

| 维度 | TanStack Start | Next.js 16 |
|---|---|---|
| UI 模型 | React Component（无 RSC） | React Server Components |
| 数据加载 | `loader` / `createServerFn` | RSC async component |
| 数据变更 | `createServerFn({ POST })` | Server Actions |
| 路由 | File-based + 类型推导 | File-based（基础类型） |
| Search Params | Zod 校验 + 类型 | 字符串 / 手动解析 |
| 部署 | 任意平台 | Vercel 最优 |

<v-click>

**何时选 TanStack Start**：极致类型安全 / 反 RSC 心智 / 不被 Vercel 锁定 / 已用 TanStack 全家桶。

</v-click>

---
transition: slide-up
---

# vs React Router v7

| 维度 | TanStack Start | React Router v7 (Framework) |
|---|---|---|
| 路由配置 | 文件 + `createFileRoute` | `routes.ts` / `flatRoutes()` |
| 路由类型 | 编译期路径校验 | 自动生成 `+types/` |
| 数据变更 | `createServerFn` + 手动 invalidate | `action` + 自动 revalidate |
| Search Params | `validateSearch` (Zod) | 自己解析 |
| 渐进增强（无 JS） | 弱 | 强（`<Form>` 原生） |
| 当前状态 | RC | 稳定 |

<v-click>

**关键区别**：TSR 类型推导更激进（`<Link>` 编译期校验，search 必带 schema）；RR action 完成后自动重跑 loader，TSS 需手动 `invalidate`；TSS 与 TanStack Query 绝配。

</v-click>

---
transition: slide-up
---

# vs Remix / SolidStart

| 维度 | TanStack Start | Remix (已并入 RR v7) | SolidStart |
|---|---|---|---|
| UI 库 | React | React | SolidJS |
| 类型推导 | 编译期 + Zod | 自动 `+types/` | 端到端 |
| 服务端函数 | `createServerFn` | `loader` / `action` | `"use server"` |
| 中间件 | 独立 API + 链式 | route module 导出 | Vinxi 全局 |
| 部署 | Vite plugin + Nitro | Adapter 体系 | Vinxi preset |
| 心智 | TanStack 全家桶派 | Remix 派 | Solid 反应式派 |

<v-click>

> 💡 **现状对比**
>
> Remix 已并入 RR v7；SolidStart 1.x 稳定但生态小；TanStack Start 仍 RC——三者都是"反 Next.js 锁定 + 反 RSC 复杂度"的同盟。

</v-click>

---
transition: slide-up
---

# 常见踩坑（一）：routeTree.gen.ts 不同步

```bash
# 现象：改了 src/routes/ 结构后 IDE 报路径不存在
src/routes/posts.tsx  ← 新加的
<Link to="/posts" />   ← TS 报错：not found
```

<v-click>

**根因**：`routeTree.gen.ts` 由 Vite plugin 在 dev / build 时生成。Pure tsc / 第一次 clone 时可能未触发。

**解决**：

```bash
# 启动 dev 让插件生成一次
pnpm dev

# 或手动跑（部分 CLI 版本支持）
npx @tanstack/router-cli generate

# CI / tsc check 之前先 build / dev 一次
pnpm dev & sleep 5 && kill $! ; pnpm typecheck
```

</v-click>

<v-click>

> 💡 **注意**：把 `routeTree.gen.ts` 加进 `.gitignore`——手改会被覆盖。

</v-click>

---
transition: slide-up
---

# 常见踩坑（二）：Search Params 序列化

```tsx
// ❌ 复杂对象进 URL 失败
navigate({ search: { filter: { tag: 'x', dates: [d1, d2] } } })
// URL: ?filter=%5Bobject+Object%5D —— 默认 JSON stringify 可能丢类型

// ✅ 显式 schema + z.coerce
const searchSchema = z.object({
  tag: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
})
```

<v-click>

**默认序列化**：简单类型 URL safe；Array / Object → JSON.stringify；Date / Map / Set 需 `z.coerce.*` 或自定义 `parseSearch` / `stringifySearch`。

</v-click>

<v-click>

```ts
createRouter({
  routeTree,
  parseSearch: (s) => qs.parse(s),
  stringifySearch: (o) => '?' + qs.stringify(o),
})
```

</v-click>

---
transition: slide-up
---

# 常见踩坑（三）：RC 阶段 API 抖动

```ts
// ❌ 教程是半年前的，API 可能改名
import { createServerFn } from '@tanstack/start'          // 旧路径
// 新路径：'@tanstack/react-start'

createServerFn({ method: 'POST' })
  .validator(z.object(...))                                // 旧
// 新：.inputValidator(...)
```

<v-click>

**应对策略**：

- **盯官方 Discord / changelog**：RC 阶段每次 minor 都可能改 API
- **优先看官方 examples**（`TanStack/router/examples/react/start-*`），与最新 API 同步
- **AI 教程谨慎**：训练数据可能是 alpha / beta，与 RC 不一致
- **重大 API 改名**：`@tanstack/start` → `@tanstack/react-start`、`validator` → `inputValidator`

</v-click>

<v-click>

> 💡 **建议**：项目 README 标注当前 Start 版本，升级前先读 changelog 再 `pnpm up`。

</v-click>

---
transition: slide-up
---

# 常见踩坑（四）：Server Function 序列化

```ts
// ❌ 返回不可序列化值
export const getStuff = createServerFn().handler(async () => {
  return {
    user: { name: 'A' },
    handler: () => 'hi',                  // ← 函数丢失
    cls: new MyClass(),                   // ← class instance 丢 prototype
  }
})
```

<v-click>

**可序列化**：基础类型 / Array / Object / Map / Set / Date / Error / Promise（用于 streaming）。

**不支持**：函数 / class instance / Symbol / 循环引用。

</v-click>

<v-click>

```ts
createServerFn({ strict: false })                // 完全关闭检查
createServerFn({ strict: { output: false } })    // 仅关返回值检查
```

</v-click>

---
transition: slide-up
---

# 常见踩坑（五）：Loader 在客户端也跑

```ts
// ❌ 直接读 process.env / 用 Node 模块
export const Route = createFileRoute('/x')({
  loader: async () => {
    const data = await fs.readFile('./data.json')   // ← 客户端导航也会跑，崩
    return JSON.parse(data.toString())
  },
})
```

<v-click>

**根因**：loader 是**同构（isomorphic）**——SSR 时服务端跑，客户端导航时浏览器跑。直接用 Node API 会报错。

**解决**：把服务端逻辑包进 `createServerFn`，loader 调用它：

```ts
const getJson = createServerFn().handler(async () => {
  const data = await fs.readFile('./data.json')   // 只服务端
  return JSON.parse(data.toString())
})

export const Route = createFileRoute('/x')({
  loader: () => getJson(),                         // 客户端会变成 fetch
})
```

</v-click>

---
transition: slide-up
---

# 常见踩坑（六）：忘了 declare module

```ts
// ❌ 不加 declare module
const router = createRouter({ routeTree })

// 之后 <Link to="/posts" /> 路径推导成 string 而不是字面量联合
// useNavigate() 也丢类型
```

```ts
// ✅ 在 router.tsx 注册类型
const router = createRouter({ routeTree, ... })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

<v-click>

**作用**：把 router 类型注册到全局 namespace，让 `<Link>` / `useNavigate` / `useParams` 等 hook 拿到 typed 路径联合。

**模板项目自带**：`pnpm create` 出来的项目已注册；手工搭建的容易漏。

</v-click>

---
transition: slide-up
---

# 经验法则

<v-clicks>

- **从模板起步** → 别从 scratch 搭，`pnpm create` 给你的配置最准
- **`routeTree.gen.ts` 进 gitignore** → 由插件生成，手改会被覆盖
- **`declare module` 注册 router** → 端到端类型推导的前置条件
- **search params 永远配 Zod schema** → `validateSearch` + 类型自动可见
- **loader 是同构** → 服务端逻辑包进 `createServerFn` 再调
- **server function 的输入用 validator** → Zod 比手写 type assert 安全
- **Auth 在 beforeLoad 拦截** → `throw redirect({ to: '/login' })`
- **Query 协作 `ensureQueryData`** → loader prefetch + 组件 `useSuspenseQuery`
- **中间件工厂化** → `requireRole(role)` 而不是写死多份
- **盯 RC changelog** → API 升级前先读，特别是 `inputValidator` 命名变动

</v-clicks>

---
transition: slide-up
---

# 不适合 TanStack Start 的场景

<v-clicks>

- **重 RSC 心智 / 流式 server component** → Next.js + RSC 仍领先
- **需要绝对稳定的元框架** → RC 阶段，等 v1 GA 更稳
- **企业中后台依赖 Ant Design Pro / MUI Dashboard 模板** → 这些默认 Next.js / CRA
- **大量招聘候选人储备** → React Router / Next.js 候选远多于 TSS
- **追求最大社区资源** → 文档 / 教程仍小于 Next.js
- **强 Vercel 全家桶绑定（AI SDK / Analytics / Blob）** → Next.js 一体化更顺
- **不接受类型推导的编译开销** → 超大项目 IDE 卡顿可能成本

</v-clicks>

<v-click>

> **经验**：TanStack Start 最强场景是"**中型应用 / 团队已重度用 TanStack Query / Form / Table / 反 Vercel 锁定 / 看重类型安全胜过生态规模**"。等 v1 GA 后会迎来一波增长。

</v-click>

---
transition: slide-up
---

# 下一步学习路径

```
入门
├── 跑通 npx @tanstack/cli create 默认模板
├── 读 Overview + Getting Started + Routing
└── 写 CRUD：理解 createFileRoute + loader + Outlet

进阶
├── createServerFn + inputValidator (Zod)
├── Search Params + validateSearch + loaderDeps
├── beforeLoad + redirect / notFound 拦截
└── Middleware 链式 + Query ensureQueryData 集成

实战
├── Selective SSR / 流式渲染 defer + Await
├── 部署：Cloudflare / Netlify / Vercel / Node
└── 静态预渲染 + Server Routes API endpoints

延伸：从 RR / Next 迁移、RC→v1 changelog、Form/Table 全家桶
```

<v-click>

**官方资源**：[tanstack.com/start](https://tanstack.com/start) | [tanstack.com/router](https://tanstack.com/router) | [Examples](https://github.com/TanStack/router/tree/main/examples/react) | Discord `#start`

</v-click>

---
layout: center
class: text-center
---

# 总结

适合：中型 React 应用 / 重度 TanStack 生态 / 反 Vercel 锁定 / 类型至上

少做：重 RSC 场景 / 求最大社区 / 求稳定 v1 / 企业重 UI 模板

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://tanstack.com/start" target="_blank">tanstack.com/start</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/TanStack/router" target="_blank">TanStack/router</a>
</div>

<div class="mt-4">
  <carbon:play /> <a href="https://tanstack.com/start/latest/docs/framework/react/getting-started" target="_blank">Getting Started</a>
</div>
