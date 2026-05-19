---
theme: seriph
background: https://cover.sli.dev
title: Welcome to TanStack Router
info: |
  Presentation TanStack Router for React developers.

  Learn more at [https://tanstack.com/router](https://tanstack.com/router)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:react class="text-7xl" />
</div>

<br/>

## TanStack Router — 100% Type-Safe React Router

独立的类型安全路由库（TanStack Start 元框架的内核），把路径 / 参数 / search params / loader / context 的类型一气贯穿到组件

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 TanStack Router —— React 生态里把"类型安全"做到极致的路由库。

由 Tanner Linsley（React Query / React Table 作者）+ TanStack 团队维护。
2024 年 1 月发布首个稳定版 1.0，之后持续在 1.x 主线迭代到今天。

定位：纯客户端 / SPA 路由库，能独立使用；也是 TanStack Start 元框架的运行内核。
核心卖点：编译期就把路径、参数、search、loader、context 的类型推到组件里——
开发者写 hook 的时候无需任何泛型，IDE 直接亮起完整类型提示。
-->

---
transition: fade-out
---

# 什么是 TanStack Router？

为 React 而生的类型安全路由库，把端到端推导做到极致

<v-click>

- **作者**：Tanner Linsley + TanStack 团队（React Query 同一拨人）
- **当前版本**：1.x 稳定线（2024.1 首发，2026 持续迭代）
- **核心卖点**：100% type-safe —— 路径 / params / search / loader / context 全自动推导
- **两种路由**：File-based（推荐）+ Code-based（编程式拼装）
- **Search params 一等公民**：内置 schema 校验 + 类型推导 + URL 状态化
- **Loader 体系**：beforeLoad / loader / loaderDeps / SWR / 流式
- **Pending UI**：原生 `pendingComponent` + Suspense + 错误边界
- **预加载**：链接 hover / intent / viewport 自动预取
- **Code Splitting**：路由级 lazy + preload 一条龙
- **与 TanStack Query 协作**：双层缓存的标准答案

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_TanStack Router Overview_](https://tanstack.com/router/latest/docs/framework/react/overview)

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

类型安全是真的吊打，但学习曲线偏陡 + 文档密度高得让人想睡觉

<v-clicks>

**优点**
- 类型推导业界顶配：路径 / search / loader / context 全链路编译期校验
- File-based + Code-based 双模式，从原型到大型项目都有匹配方案
- Search params 作为应用状态，内置 schema + 序列化，胜过手写 URLSearchParams
- Loader 体系完整：并行加载 / SWR / preload / pending / error 边界一应俱全
- 1.x 稳定线已经成熟，API 几乎不再大改
- 与 TanStack Query 协作天然，业界事实标准
- 不与任何元框架绑定，独立可用（SPA / Vite / Webpack 都行）

**缺点**
- 学习曲线偏陡，loader / beforeLoad / context 概念需要时间消化
- 类型推导编译开销大，超大项目 IDE 响应需调优
- 文件路由生成 `routeTree.gen.ts` 偶尔失同步
- 文档体量大但密度高，初学者容易迷路
- 招聘候选人少于 React Router，团队上手需培训
- 不带数据变更（mutation）原语，需配 Query 或自己写

</v-clicks>

---
transition: slide-up
---

# TanStack 生态：Router 的位置

```
TanStack/
├── router        ← 类型安全路由（本场主角）
├── start         ← 基于 router 的全栈元框架
├── query         ← 异步数据缓存（双层缓存搭档）
├── form          ← 类型安全表单
├── table         ← Headless 数据表格
├── virtual       ← 虚拟列表
├── store         ← 细粒度状态库
├── ranger        ← 滑块 / 区间
└── pacer         ← 速率限制
```

<v-click>

**Router vs Start**：

- **TanStack Router** = 纯客户端 / SPA 路由库（类型安全 + 嵌套 + Suspense）
- **TanStack Start** = Router + Vite plugin + SSR pipeline + Server Functions + adapter
- 只要 SPA 路由用 Router；要 SSR / Server Functions / 全栈才升级 Start

</v-click>

<v-click>

> 💡 **提示**
>
> 本场幻灯片只聊 Router，所有内容在 SPA 场景下都成立；SSR / Server Functions 在 Start 幻灯片里讲。

</v-click>

---
transition: slide-up
---

# 定位与生态

TanStack Router 在 React 路由版图里的位置

<v-clicks>

- **谁在做**：Tanner Linsley（React Query / React Table 作者）+ TanStack 核心团队
- **基础栈**：纯 React 客户端库，配合 Vite / Webpack / 任何打包工具都行
- **当前状态**：1.x 稳定线，已 GA，可放心生产用
- **与 React Router v7 类比**：都强调类型安全，但 RR v7 走 Remix 框架路径，TSR 走纯路由库路径
- **与 Vue Router 类比**：定位相似（嵌套路由 + 守卫），但类型推导更激进
- **关键卖点**：**编译期类型校验 + Search params 一等公民 + Loader 体系完整**
- **学习路径**：File-based 路由 → Link / useNavigate → loader / beforeLoad → search + Zod → Query 协作 → preload + code-split

</v-clicks>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 关键事件 |
|---|---|---|
| **0.x Beta** | 2023 | 早期预览，API 频繁迭代 |
| **1.0 GA** | 2024.1 | 首个稳定版，类型安全路由正式发布 |
| **1.x** | 2024-2025 | Loader / Search / Preload 体系完善 |
| **1.x + Start** | 2024 中 | TanStack Start 元框架基于 Router 打造 |
| **1.x 持续迭代** | 2026 初 | 类型推导优化 / 文件路由编译加速 |

<v-click>

今天讲的是 **Router 1.x 稳定线**。API 几乎不再大改，可用于生产；只需关注 minor 版本的非破坏性增强。

</v-click>

---
transition: slide-up
---

# 创建项目

```bash
# 方式一：官方 CLI（推荐）
npx create-tsrouter-app@latest my-app
# → 交互式选模板：file-based / code-based / 集成 Query

cd my-app
pnpm install
pnpm dev                # http://localhost:5173
```

<v-click>

或者手动加进现有 Vite + React 项目：

```bash
pnpm add @tanstack/react-router
pnpm add -D @tanstack/router-plugin
```

</v-click>

<v-click>

要求 Node 20+ / React 18+。最简单的代码版 (无文件路由)：

```tsx
import { RouterProvider, createRouter, createRootRoute } from '@tanstack/react-router'

const rootRoute = createRootRoute({ component: () => <div>Hello</div> })
const router = createRouter({ routeTree: rootRoute })

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)
```

</v-click>

---
transition: slide-up
---

# vite.config.ts：File-based 启用

```ts
import { defineConfig } from 'vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // 文件路由插件 —— 必须在 React 之前
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,         // 默认开启路由级 code split
      // routesDirectory: './src/routes',
      // generatedRouteTree: './src/routeTree.gen.ts',
    }),
    viteReact(),
  ],
})
```

<v-click>

**`tanstackRouter()` 做了什么**：

- 扫描 `src/routes/` 目录的文件结构
- 自动生成 `routeTree.gen.ts`（**勿手改、加 .gitignore**）
- 自动按路由切分 chunk，配合 `defaultPreload: 'intent'` 预取
- HMR 友好，新增 / 删除 / 重命名路由文件自动更新树

</v-click>

---
transition: slide-up
---

# 项目结构

```
my-app/
├── src/
│   ├── routes/                # 文件路由根
│   │   ├── __root.tsx         # 根布局
│   │   ├── index.tsx          # /
│   │   ├── about.tsx          # /about
│   │   └── posts/
│   │       ├── index.tsx      # /posts
│   │       └── $postId.tsx    # /posts/:postId
│   ├── routeTree.gen.ts       # ← 自动生成，勿手改
│   ├── router.tsx             # createRouter()
│   └── main.tsx               # RouterProvider 挂载
├── vite.config.ts             # tanstackRouter() + viteReact()
└── package.json
```

<v-click>

**关键文件**：

- `__root.tsx` 必须导出含 `<Outlet />` 的根布局
- `routeTree.gen.ts` 由 Vite 插件**自动生成**——加进 `.gitignore`
- `router.tsx` 集中创建 router 实例 + 声明 module 类型注册

</v-click>

---
transition: slide-up
---

# router.tsx：创建实例 + 类型注册

```tsx
// src/router.tsx
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',          // 链接 hover 预加载
  defaultPreloadStaleTime: 0,        // 预加载数据立即视为 stale，下次进入再 fetch
  scrollRestoration: true,           // 自动滚动恢复
  defaultErrorComponent: ErrorFallback,
  defaultNotFoundComponent: NotFoundPage,
  defaultPendingComponent: LoadingSpinner,
})

// 端到端类型推导依赖：注册 router 类型到全局 namespace
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

<v-click>

**`declare module` 的作用**：让全局所有 `Link` / `useNavigate` / `useParams` 等 hook 拿到 typed 路径联合类型——这是 100% 类型安全的前置条件。

</v-click>

---
transition: slide-up
---

# main.tsx：RouterProvider 挂载

```tsx
// src/main.tsx
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
)
```

<v-click>

整个应用的 React 根就是一个 `<RouterProvider>`——无需 `<BrowserRouter>` 或额外 wrapper。Router 实例自带历史 / 滚动 / 预加载 / 缓存全套机制。

</v-click>

<v-click>

> 💡 **提示**
>
> StrictMode 兼容：建议外层包 `<StrictMode>`，Router 1.x 全面支持双调用的副作用安全。

</v-click>

---
transition: slide-up
---

# 文件路由约定

```
src/routes/
├── __root.tsx                # 根布局（特殊）
├── index.tsx                 # /
├── about.tsx                 # /about
├── posts.tsx                 # /posts 父布局（可选）
├── posts/
│   ├── index.tsx             # /posts
│   ├── $postId.tsx           # /posts/:postId
│   └── new.tsx               # /posts/new
├── _auth.tsx                 # 路由分组（不影响 URL）
├── _auth/
│   ├── login.tsx             # /login
│   └── signup.tsx            # /signup
└── rest/
    └── $.tsx                 # /rest/* (catch-all)
```

<v-click>

| 文件名 | 含义 |
|---|---|
| `index.tsx` | 当前目录的根路径 |
| `$param.tsx` | 动态参数（`params.param`） |
| `$.tsx` | catch-all 通配 |
| `_layout.tsx` 前缀 | 分组布局，URL 不含 |
| `__root.tsx` | 应用根，每项目唯一 |

</v-click>

---
transition: slide-up
---

# __root.tsx：根布局

```tsx
// src/routes/__root.tsx
import { createRootRoute, Outlet, Link } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <nav className="p-4 flex gap-4">
        <Link to="/" activeProps={{ className: 'font-bold' }}>Home</Link>
        <Link to="/posts">Posts</Link>
      </nav>
      <hr />
      <Outlet />
    </>
  ),
  notFoundComponent: () => <p>404 Not Found</p>,
})
```

<v-click>

**核心组件**：

- `<Outlet />` 渲染子路由
- `activeProps` 自动判断当前 active 状态（含 `inactiveProps` 反向写法）
- `notFoundComponent` 兜底未匹配路径

</v-click>

---
transition: slide-up
---

# Code-based routing：手动拼装

无文件结构时也能跑，适合超小应用 / 库内嵌：

```tsx
import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'

const rootRoute = createRootRoute({ component: () => <Outlet /> })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <h1>Home</h1>,
})

const postsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/posts/$postId',
  component: () => <PostDetail />,
})

const routeTree = rootRoute.addChildren([indexRoute, postsRoute])
const router = createRouter({ routeTree })
```

<v-click>

> 💡 **取舍**
>
> Code-based 拼装的灵活度高（可程序化生成），但失去了文件路由的自动 type 推导。中大型项目推荐 File-based。

</v-click>

---
transition: slide-up
---

# createFileRoute：类型安全路由

```tsx
// src/routes/posts/$postId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  // 1. 数据加载
  loader: async ({ params }) => {
    const post = await fetchPost(params.postId)
    if (!post) throw notFound()
    return post
  },

  component: PostComponent,
})

function PostComponent() {
  const post = Route.useLoaderData()    // 类型自动推导为 Post
  const { postId } = Route.useParams()  // postId: string

  return <h1>{post.title}</h1>
}
```

<v-click>

`/posts/$postId` 字符串由 Vite 插件**自动写入**，开发者只关心组件逻辑——端到端类型推导一气贯穿。

</v-click>

---
transition: slide-up
---

# 导航：Link 组件

```tsx
import { Link } from '@tanstack/react-router'

// 静态路径
<Link to="/about">About</Link>

// 动态参数（编译期校验 params 必填）
<Link to="/posts/$postId" params={{ postId: '1' }}>Post 1</Link>

// 带 search params
<Link to="/posts" search={{ page: 2, tag: 'react' }}>Page 2</Link>

// 函数式更新 search
<Link to="/posts" search={(prev) => ({ ...prev, page: prev.page + 1 })}>
  Next page
</Link>

// 当前 active 高亮
<Link
  to="/posts"
  activeProps={{ className: 'font-bold underline' }}
  activeOptions={{ exact: true }}
>
  Posts
</Link>
```

<v-click>

**类型亮点**：`to` 必须是 router tree 里存在的路径字面量，`params` / `search` 类型由路径自动约束——拼错路径或漏写参数直接 TS 报错。

</v-click>

---
transition: slide-up
---

# 导航：useNavigate

```tsx
import { useNavigate, useRouter } from '@tanstack/react-router'

function LoginButton() {
  const navigate = useNavigate()

  const handleLogin = async () => {
    await login()
    // 命令式跳转，类型与 Link 完全一致
    navigate({ to: '/dashboard', search: { from: 'login' } })
  }

  return <button onClick={handleLogin}>Login</button>
}
```

<v-click>

**绑定到当前路由**（推荐）—— params / search 类型基于当前路由推导：

```tsx
function PostActions() {
  const navigate = Route.useNavigate()  // ← 来自当前 createFileRoute 的 Route
  navigate({ search: (prev) => ({ ...prev, page: prev.page + 1 }) })
}
```

</v-click>

<v-click>

**底层 router 实例**：`useRouter()` 拿到 router 全套方法（history / invalidate / preloadRoute 等）。

</v-click>

---
transition: slide-up
---

# Type-safe params：动态段

```tsx
// 单参数
// src/routes/users/$userId.tsx
export const Route = createFileRoute('/users/$userId')({
  loader: ({ params }) => fetchUser(params.userId),  // params.userId: string
  component: UserDetail,
})

// 多参数
// src/routes/teams/$teamId/members/$memberId.tsx
export const Route = createFileRoute('/teams/$teamId/members/$memberId')({
  loader: ({ params }) => fetchMember(params.teamId, params.memberId),
  component: MemberDetail,
})
```

<v-click>

**类型推导**：路径里的 `$xxx` 自动映射到 `params.xxx: string`。Hook 内不需要任何泛型：

```tsx
function MemberDetail() {
  const { teamId, memberId } = Route.useParams()
  //      ↑ string    ↑ string  —— 类型自动推导
}
```

</v-click>

<v-click>

**`parseParams` / `stringifyParams`**：需要 number / Date 时可在 Route 定义里自定义解析与序列化函数。

</v-click>

---
transition: slide-up
---

# Search Params：Zod validator

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  page: z.number().int().min(1).catch(1),
  tag: z.string().optional(),
  sort: z.enum(['date', 'title']).catch('date'),
})

export const Route = createFileRoute('/posts/')({
  // 校验 + 转换 URL search params
  validateSearch: searchSchema,

  // search 变化触发 loader 重跑
  loaderDeps: ({ search }) => ({ page: search.page, tag: search.tag }),

  loader: async ({ deps }) => fetchPosts(deps),

  component: PostsList,
})

function PostsList() {
  const search = Route.useSearch()      // 类型: { page, tag?, sort }
  const navigate = Route.useNavigate()
  return (
    <button onClick={() => navigate({ search: (s) => ({ ...s, page: s.page + 1 }) })}>
      Next page
    </button>
  )
}
```

---
transition: slide-up
---

# Search Params：为何作为应用状态？

| 场景 | 传统做法 | TanStack Router |
|---|---|---|
| 列表分页 | 组件 useState + 同步 URL | URL 即 state，`useSearch()` 直读 |
| 筛选条件 | 手写 URLSearchParams | Zod schema 自动校验 + 类型 |
| 详情弹窗开关 | 局部 state，刷新即丢 | `?modal=user-1` URL 反映 |
| 共享链接 | 复杂 query 拼接 | `navigate({ search })` 完成 |
| 浏览器前进 / 后退 | 状态不同步 | URL 是真理之源，自动同步 |

<v-click>

**核心心智**：URL search params 是应用状态的一部分，能被序列化、能被分享、能被前进 / 后退恢复——这是 TanStack Router 与 React Router 心智最大差异之一。

</v-click>

<v-click>

> 💡 **建议**
>
> 任何"组件级、需要刷新 / 分享时保留"的状态，优先放进 search params，再考虑 useState。

</v-click>

---
transition: slide-up
---

# Loaders + beforeLoad

```tsx
// src/routes/dashboard.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  // 1. beforeLoad —— 路由匹配前跑（权限拦截）
  beforeLoad: async ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    // 返回值合并进子路由 context
    return { user: context.user }
  },

  // 2. loader —— 数据加载
  loader: async ({ context }) => ({
    stats: await fetchStats(context.user.id),
  }),

  component: DashboardLayout,
})
```

<v-click>

**执行顺序**：

- `beforeLoad` 自上而下**串行**，可 `throw redirect()` / `throw notFound()` 拦截
- `loader` 默认**并行**（父子同时跑），可读父级 `context`
- 任何一层抛错 → 最近 `errorComponent` 兜底

</v-click>

---
transition: slide-up
---

# loaderDeps：精准缓存控制

```tsx
export const Route = createFileRoute('/posts/')({
  validateSearch: z.object({
    page: z.number().catch(1),
    tag: z.string().optional(),
  }),

  // 声明 loader 的依赖
  loaderDeps: ({ search: { page, tag } }) => ({ page, tag }),

  // deps 变化才重跑
  loader: async ({ deps }) => fetchPosts(deps),

  component: PostsList,
})
```

<v-click>

**心智**：

- 路由的缓存 key 默认 = `路径 + params + loaderDeps`
- 不在 `loaderDeps` 里的 search params 变化**不会**触发重跑（避免不必要的请求）
- params 变化 / loaderDeps 变化 → loader 自动重跑

</v-click>

<v-click>

**典型用法**：列表页 page / tag / sort 入 `loaderDeps`；详情弹窗 modal id 等纯 UI 状态不入。

</v-click>

---
transition: slide-up
---

# Pending UI + Suspense

```tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: ({ params }) => fetchPost(params.postId),

  // 1. Pending 占位
  pendingComponent: () => <Skeleton />,

  // 2. 错误兜底
  errorComponent: ({ error }) => <p>出错了：{error.message}</p>,

  // 3. 慢于此阈值才显示 pending（避免闪烁）
  pendingMs: 500,
  // 4. 最小显示时长（避免一闪而过）
  pendingMinMs: 200,

  component: PostDetail,
})
```

<v-click>

**`pendingComponent` 触发时机**：

- 首次进入路由 + loader 未完成
- 配合 `pendingMs` 阈值，快路由不会闪 skeleton
- 配合 `pendingMinMs` 最低显示时长，避免视觉突变

</v-click>

<v-click>

> 💡 **可选**：用 `defaultPreloadStaleTime: 0` 让预加载数据进入页面再重新 fetch（SWR 体验）。

</v-click>

---
transition: slide-up
---

# 错误边界 + Stale-while-revalidate

```tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: ({ params }) => fetchPost(params.postId),

  // 错误边界（任意一层抛错都会到最近的 errorComponent）
  errorComponent: ({ error, reset }) => (
    <div>
      <p>{error.message}</p>
      <button onClick={() => reset()}>重试</button>
    </div>
  ),

  // 数据陈旧时长（SWR 阈值）
  staleTime: 30_000,            // 30s 内视为 fresh，不重 fetch
  gcTime: 5 * 60_000,           // 5min 后回收缓存

  // shouldReload —— 自定义是否重 fetch
  shouldReload: ({ params }) => params.postId === 'critical',

  component: PostDetail,
})
```

<v-click>

**心智**：

- `staleTime` 内重新进入路由 → 用缓存（snappy）
- `staleTime` 之后 → 显示旧数据 + 后台刷新（SWR）
- `gcTime` 超时 → 缓存彻底丢弃

</v-click>

---
transition: slide-up
---

# Code Splitting + Preloading

```ts
// vite.config.ts
tanstackRouter({
  target: 'react',
  autoCodeSplitting: true,    // 默认开启：每个 route 一个 chunk
})
```

```tsx
// router.tsx
createRouter({
  routeTree,
  defaultPreload: 'intent',           // hover / focus 时预加载
  defaultPreloadStaleTime: 0,         // 预加载数据立即 stale，确保进入再 fetch
  // defaultPreload: 'viewport',      // 进入视口预加载（aggressive）
  // defaultPreload: false,           // 关闭预加载
})
```

<v-click>

**预加载策略**：

| 值 | 触发时机 | 适合 |
|---|---|---|
| `'intent'` | `<Link>` hover / focus | 默认，最常用 |
| `'viewport'` | `<Link>` 进入视口 | 列表 / 卡片墙 |
| `'render'` | `<Link>` 挂载即预取 | 强相关导航 |
| `false` | 不预加载 | 慢网 / 数据敏感 |

</v-click>

<v-click>

> 💡 **效果**：用户点击 `<Link>` 前数据已经在飞，跳转近乎瞬间。

</v-click>

---
transition: slide-up
---

# Route Context：依赖注入

```tsx
// 1. 根路由声明 context 类型
import { createRootRouteWithContext } from '@tanstack/react-router'

interface RouterContext {
  queryClient: QueryClient
  user: User | null
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
})

// 2. 创建 router 时注入
createRouter({
  routeTree,
  context: { queryClient, user: null },
})

// 3. 子路由的 beforeLoad 可读取并扩展
export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    const fresh = await context.queryClient.fetchQuery({...})
    return { dashboardData: fresh }   // ← 合并进下游 context
  },
  loader: ({ context }) => context.dashboardData,  // 子层可见
})
```

<v-click>

**用途**：把 `queryClient` / `auth` / `theme` 等跨路由共享对象注入 loader 与组件——避免到处 import 单例。

</v-click>

---
transition: slide-up
---

# 与 TanStack Query 协作

```tsx
// 1. router.tsx —— 共享 queryClient
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export const router = createRouter({
  routeTree,
  context: { queryClient },          // 注入路由 context
  defaultPreload: 'intent',
})
```

```tsx
// 2. 路由 loader 中 prefetch
export const Route = createFileRoute('/posts')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: ['posts'],
      queryFn: () => getPosts(),
    }),
  component: PostsList,
})

function PostsList() {
  // 组件中读同一份 cache，命中即同步返回
  const { data } = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
  })
  return data.map((p) => <Post key={p.id} {...p} />)
}
```

<v-click>

**双层缓存**：Router loader（per-route）+ Query cache（全局共享）—— 工程化标准答案。

</v-click>

---
transition: slide-up
---

# 嵌套路由 + 多层 Outlet

```tsx
// /settings 父布局
// src/routes/settings.tsx
export const Route = createFileRoute('/settings')({
  component: () => (
    <div className="flex">
      <nav className="w-48 border-r p-4">
        <Link to="/settings/profile">Profile</Link>
        <Link to="/settings/billing">Billing</Link>
      </nav>
      <main className="flex-1 p-4">
        <Outlet />            {/* 子路由插入点 */}
      </main>
    </div>
  ),
})

// /settings/profile 子页
// src/routes/settings/profile.tsx
export const Route = createFileRoute('/settings/profile')({
  component: () => <h2>Profile Page</h2>,
})
```

<v-click>

**心智**：

- 父级文件存在 → 子级自动嵌套在父的 `<Outlet />` 内
- 多层嵌套 → 多层 `<Outlet />`，自然形成树状布局
- `_layout.tsx` 前缀 → 仅布局，URL 不含此段（路由分组）

</v-click>

---
transition: slide-up
---

# 路由守卫：beforeLoad 拦截

```tsx
import { redirect, notFound } from '@tanstack/react-router'

// 1. 权限拦截
export const Route = createFileRoute('/admin')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' })
    if (context.user.role !== 'admin') throw redirect({ to: '/403' })
  },
  component: AdminLayout,
})

// 2. 404
export const Route = createFileRoute('/posts/$id')({
  loader: async ({ params }) => {
    const post = await fetchPost(params.id)
    if (!post) throw notFound()
    return post
  },
})

// 3. 通用错误 + 重试
export const Route = createFileRoute('/data')({
  loader: () => fetchData(),
  errorComponent: ({ error, reset }) => (
    <button onClick={reset}>Retry: {error.message}</button>
  ),
})
```

<v-click>

**关键**：守卫不是 `next()` 回调，而是 `throw redirect()` / `throw notFound()` 的**异常控制流**——一行代码完成跳转 / 404。

</v-click>

---
transition: slide-up
---

# Devtools

```tsx
// main.tsx
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={router} />
    {/* 仅开发环境注入 */}
    {import.meta.env.DEV && <TanStackRouterDevtools router={router} />}
  </>,
)
```

<v-click>

**Devtools 能看什么**：

- 当前路由树 + match 链
- 各路由的 loader / beforeLoad 状态、context、deps
- Preload 队列与 cache 状态
- Search params 变化时间线
- History stack 与导航 trace

</v-click>

<v-click>

> 💡 **建议**：开发期开着 Devtools，loader 链一目了然，调试时间大幅缩短。

</v-click>

---
transition: slide-up
---

# vs React Router v7

| 维度 | TanStack Router | React Router v7 (lib mode) |
|---|---|---|
| 路由配置 | 文件 + `createFileRoute` | 配置数组 `createBrowserRouter` |
| 路由类型 | 编译期路径校验（字面量联合） | 框架模式自动 `+types/` |
| Search Params | `validateSearch` + Zod 一等公民 | `useSearchParams` 字符串手解析 |
| Loaders | `loader` + `loaderDeps` + SWR | `loader` + auto revalidate |
| 守卫 | `throw redirect()` 异常控制流 | `loader` 内 `throw redirect()` |
| Preload | `intent` / `viewport` 内置 | 手动 `prefetch` |
| 数据变更 | 需配 Query 或手写 | `action` + 自动 revalidate |
| 心智 | "URL 即应用状态" | "URL 即匹配规则" |

<v-click>

**关键区别**：

- **TSR 类型推导更激进**：`<Link>` 路径编译期校验，search 必带 schema
- **RR 自动 revalidation**：action 完成后自动重跑 loader，TSR 需手动 `invalidate`
- **TSR 与 TanStack Query 是绝配**，RR 自带数据层不需要 Query

</v-click>

---
transition: slide-up
---

# vs Next.js / Vue Router

| 维度 | TanStack Router | Next.js App Router | Vue Router 4 |
|---|---|---|---|
| 框架范畴 | 纯路由库 | 元框架（含 SSR） | 纯路由库 |
| UI 库 | React | React | Vue 3 |
| 路由配置 | File + Code 双模 | File-based (App) | Code-based 数组 |
| 类型推导 | 编译期 + Zod | 字符串 + 基础 | 4.x 弱 / 5.x unplugin 加持 |
| Search Params | 一等公民 + schema | 字符串手解析 | `route.query` 对象 |
| 守卫 | `beforeLoad` + 异常 | middleware.ts | `beforeEach` 全局 |
| 数据加载 | `loader` + Query | RSC async / Route Handler | 无原生（自行写） |

<v-click>

**何时选 TanStack Router**：

- React 项目追求**极致类型安全**
- Search params 是核心交互状态（dashboard / 复杂列表筛选）
- 已经在用 TanStack Query / Form / Table 全家桶
- 想脱离 Next.js / Remix 框架锁定，纯 SPA + Vite 起步

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

# 或手动跑 generator
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

# 常见踩坑（二）：忘了 declare module

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

**模板项目自带**：CLI 创建的项目已注册；手工搭建的容易漏。

</v-click>

---
transition: slide-up
---

# 常见踩坑（三）：Search Params 序列化

```tsx
// ❌ 复杂对象进 URL 失败
navigate({ search: { filter: { tag: 'x', dates: [d1, d2] } } })
// URL: ?filter=%5Bobject+Object%5D —— 默认 JSON stringify 可能丢类型

// ✅ 显式用 z.coerce 解析 / 限定 schema
const searchSchema = z.object({
  tag: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
})
```

<v-click>

**默认序列化策略**：

- 简单类型（string / number / boolean）→ URL safe
- Array / Object → JSON.stringify
- Date / Map / Set → 需 `z.coerce.*` 或自定义 `parseSearch` / `stringifySearch`

</v-click>

<v-click>

**自定义序列化**：

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

# 常见踩坑（四）：loaderDeps 漏了字段

```tsx
// ❌ search.page 变化时 loader 不重跑
export const Route = createFileRoute('/posts/')({
  validateSearch: z.object({ page: z.number(), tag: z.string().optional() }),
  // loaderDeps 没声明 —— 默认 {} 永远不变
  loader: async ({ search }) => fetchPosts(search.page),
  //                  ↑ ❌ 此处 search 类型为 unknown，且不会触发重跑
})
```

```tsx
// ✅ 显式声明依赖
export const Route = createFileRoute('/posts/')({
  validateSearch: z.object({ page: z.number(), tag: z.string().optional() }),
  loaderDeps: ({ search: { page, tag } }) => ({ page, tag }),
  loader: async ({ deps }) => fetchPosts(deps),   // ← 用 deps
})
```

<v-click>

**心智**：loader 看的是 `deps`，不是 `search` 本身——把"影响数据"的 search 字段挑出来声明 `loaderDeps`。

</v-click>

---
transition: slide-up
---

# 常见踩坑（五）：缓存失效 invalidate

```tsx
// 用户修改了 post 后，列表页应该看到新数据
await updatePost({ id, title })

// ❌ 单纯 navigate 回去不会重新 fetch（loader 数据被缓存）
navigate({ to: '/posts' })

// ✅ 主动失效
import { useRouter } from '@tanstack/react-router'
const router = useRouter()

await updatePost(...)
await router.invalidate()            // 当前所有 match 失效
// 或精准失效
router.invalidate({ filter: (m) => m.routeId === '/posts' })

navigate({ to: '/posts' })           // 此时会重 fetch
```

<v-click>

**心智**：

- TanStack Router **没有自动 revalidation**（区别于 React Router action）
- 数据写后，开发者负责 `router.invalidate()` 或配 Query 用 `queryClient.invalidateQueries()`
- 这是 TSR 设计取舍：显式好过隐式

</v-click>

---
transition: slide-up
---

# 常见踩坑（六）：类型推导编译慢

```bash
# 现象：超大项目 IDE 卡顿，tsc 编译时长涨明显
```

<v-click>

**根因**：File-based 路由 + 端到端类型推导 = `routeTree.gen.ts` 里产生大量字面量联合类型。500+ 路由时 tsc 工作量陡增。

**应对**：

- **`tsconfig.json` 开启 `incremental: true`** —— 缓存编译产物
- **拆分子应用**：超大业务按模块拆 monorepo 子 router
- **降低 path 字符串泛化深度**：避免极深嵌套的动态段
- **关闭 IDE 的全项目 type check**：用 vite-plugin-checker 单独跑

</v-click>

<v-click>

> 💡 **基准**：500 路由以下基本无感；1000+ 时考虑拆 monorepo + 分包发布。

</v-click>

---
transition: slide-up
---

# 经验法则

<v-clicks>

- **从模板起步** → `npx create-tsrouter-app` 给你的配置最准
- **`routeTree.gen.ts` 进 gitignore** → 由插件生成，手改会被覆盖
- **`declare module` 注册 router** → 端到端类型推导的前置条件
- **Search params 永远配 Zod schema** → `validateSearch` + 类型自动可见
- **`loaderDeps` 声明影响数据的 search 字段** → 不在内的字段变化不重 fetch
- **写守卫用 `throw redirect()`** → 比 next()-style 异步控制更清晰
- **预加载用 `intent`** → hover 即预取，体感瞬时
- **数据写完手动 `router.invalidate()`** → TSR 没有自动 revalidation
- **Query 协作 `ensureQueryData`** → loader prefetch + 组件 `useSuspenseQuery`
- **开 Devtools 调试 loader 链** → match 树 + cache 状态一目了然

</v-clicks>

---
transition: slide-up
---

# 不适合 TanStack Router 的场景

<v-clicks>

- **Vue / Svelte / Solid 项目** → 仅 React 适用（其他生态自有方案）
- **小到一两个页面的应用** → 引一个 React 路由库可能过度，原生 history API 即可
- **强依赖 RR v7 框架模式（Remix 派）** → action 自动 revalidation / `<Form>` 渐进增强是 RR 强项
- **团队类型水平不足** → Loader / context / search schema 心智门槛高
- **追求最大社区生态** → 文档 / 教程 / 招聘候选人仍少于 React Router
- **超大项目（5000+ 路由）类型编译卡顿** → 需要工程化拆分缓解
- **不愿手动管理缓存失效** → RR / Next 的自动 revalidation 更省心

</v-clicks>

<v-click>

> **经验**：TanStack Router 最强场景是"**中型 React 应用 + Search params 复杂 + 团队类型水平好 + 已在用 TanStack Query**"。在 Vite + SPA 起步的项目里几乎是当下最优解。

</v-click>

---
transition: slide-up
---

# 下一步学习路径

```
入门
├── 跑通 npx create-tsrouter-app 默认模板
├── 读 Overview + Quick Start + File-based Routing
├── 写一个 CRUD：Posts 列表 + 详情 + 新建
└── 理解 createFileRoute + loader + Outlet

进阶
├── Search Params + validateSearch + Zod schema
├── loaderDeps + staleTime + SWR 缓存
├── beforeLoad + redirect + notFound 拦截
├── Route Context + createRootRouteWithContext
└── TanStack Query 集成 ensureQueryData

实战
├── 错误边界 + pendingComponent + Suspense
├── Preload 策略：intent / viewport
├── Code Splitting 与 autoCodeSplitting
├── router.invalidate() 缓存失效模式
└── Devtools 调试 loader 链

延伸
├── 从 React Router 迁移实操
├── 与 TanStack Form / Table 集成
├── 升级到 TanStack Start 走 SSR
└── 大型项目类型性能调优
```

<v-click>

**官方资源**：

- 文档：[tanstack.com/router](https://tanstack.com/router)
- Examples：[github.com/TanStack/router/tree/main/examples/react](https://github.com/TanStack/router/tree/main/examples/react)
- Discord：TanStack 官方社区
- 升级到 Start：[tanstack.com/start](https://tanstack.com/start)

</v-click>

---
layout: center
class: text-center
---

# 总结

适合：中型 React 应用 / 复杂 Search Params / TanStack 全家桶 / 类型至上

少做：Vue / Svelte 生态 / 超小项目 / 想要自动 revalidation / 反类型推导编译开销

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://tanstack.com/router" target="_blank">tanstack.com/router</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/TanStack/router" target="_blank">TanStack/router</a>
</div>

<div class="mt-4">
  <carbon:play /> <a href="https://tanstack.com/router/latest/docs/framework/react/quick-start" target="_blank">Quick Start</a>
</div>
