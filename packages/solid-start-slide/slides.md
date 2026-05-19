---
theme: seriph
background: https://cover.sli.dev
title: Welcome to SolidStart
info: |
  Presentation SolidStart for frontend developers.

  Learn more at [https://start.solidjs.com](https://start.solidjs.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:solidjs-icon class="text-7xl" />
</div>

<br/>

## SolidStart — SolidJS Meta-Framework

Server Functions + File Routing：在 SolidJS 之上补齐 SSR / 路由 / 数据流 / 部署适配

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 SolidStart。

SolidJS 的官方元框架，基于 Vinxi（即将迁移到 Nitro 直连），把 SolidJS 包装成
完整的全栈框架 —— 文件路由、SSR / SSG / SPA、`"use server"` RPC、跨平台部署。

定位类似 SolidJS 世界的 Next.js / Nuxt / SvelteKit。
-->

---
transition: fade-out
---

# 什么是 SolidStart？

SolidJS 官方元框架，把响应式 UI 库扩展成全栈应用框架

<v-click>

- **文件路由 + SSR**：`src/routes/` 自动建路由，SSR / SSG / SPA 一份代码三种模式
- **Server Functions**：`"use server"` 指令，函数级 RPC，类型端到端推导
- **`query` + `action`**：声明式数据加载与变更，与 `<Suspense>` 自动协作
- **Middleware + Session**：基于 Vinxi http helpers 的 cookie / 会话管理
- **API Routes**：`GET` / `POST` 等命名导出，文件即 endpoint
- **Adapter 体系**：Vercel / Netlify / Cloudflare / Node / Bun / Deno / Static
- **基于 Vinxi**：Vite 之上的元框架平台（未来计划接入 Nitro）

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_SolidStart_](https://start.solidjs.com)

</div>

<style>
h1 {
  background-color: #2C4F7C;
  background-image: linear-gradient(45deg, #2C4F7C 10%, #76B3E1 90%);
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

范式现代、API 干净，但生态规模与稳定度仍在追赶

<v-clicks>

**优点**
- API 极简——`query` + `action` + `createAsync` 三件套覆盖大部分场景
- Server Functions 端到端类型推导，且服务端代码零字节进 client
- 与 SolidJS 细粒度响应式无缝集成，状态变化只更新必要 DOM
- 单一 adapter 配置切换部署平台，Edge / Serverless / Static 一致
- 流式 SSR 默认开启，无需 RSC 心智

**缺点**
- 基于 Vinxi——上下游变动较快，1.0 路线刚稳定
- 生态规模远小于 Next.js / Nuxt（认证 / UI / Admin 模板少）
- `query` / `action` 是相对新 API（曾命名 `cache` / `useSubmission`），旧教程混乱
- 招聘候选人少

</v-clicks>

---
transition: slide-up
---

# 定位与生态

SolidStart 在元框架版图里的位置

<v-clicks>

- **谁在做**：Ryan Carniato（SolidJS 作者）+ SolidJS 核心团队，OpenCollective 支持
- **基于什么**：Vinxi（Vite 之上的元框架平台，类似 Nuxt 的 Nitro 角色）
- **与 SolidJS 关系**：SolidStart = SolidJS + Vinxi + `@solidjs/router` + adapter 体系
- **与 Next.js 类比**：定位对应 Next.js 之于 React、Nuxt 之于 Vue、SvelteKit 之于 Svelte
- **与 Remix / React Router 7 类比**：`action` / `loader` 范式非常接近，但用 Signals + JSX
- **是否要先学 SolidJS**：是——SolidStart 全部 UI 部分依赖 SolidJS 心智（signals / `<Show>` / `<For>`）
- **学习路径**：SolidJS 基础 → `query` + `createAsync` → `action` + `useSubmission` → `"use server"` → adapter 部署

</v-clicks>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 关键事件 |
|---|---|---|
| **Beta** | 2022-2023 | 早期 API 探索，多次 API 重命名 |
| **1.0** | 2024.5 | 首个稳定版，基于 Vinxi，`query` / `action` 范式确立 |
| **1.0.x** | 2024.下半 | SSR streaming、单飞 mutation、preload 完善 |
| **1.1** | 2025 | Adapter 完整覆盖，Cloudflare / Bun / Deno 稳定 |
| **未来** | 2026+ | 计划迁移底座到 Nitro 直连（去 Vinxi 中间层） |

<v-click>

今天主要讲 **SolidStart 1.x（稳定线）**——API 已经 freeze，正式生产可用。
注意：1.0 之前的教程里 `query` 叫 `cache`，遇到旧文档需要替换。

</v-click>

---
transition: slide-up
---

# 创建项目

```bash
# 官方脚手架（推荐）
pnpm create solid
# → 选 "SolidStart"
# → 选模板：bare / hackernews / with-auth / with-tailwindcss / ...

# 或者用 npm / yarn / bun
npm create solid@latest
bunx create-solid

cd my-app && pnpm install && pnpm dev   # http://localhost:3000
```

<v-click>

要求 Node 18.18+（推荐 20+ LTS）。生产构建：

```bash
pnpm build    # 默认 node-server preset；切其它平台改 app.config.ts
pnpm start    # 启动产物
```

</v-click>

<v-click>

> 💡 **提示**
>
> 脚手架会问"是否启用 SSR"——不启用就退化成 SPA，但仍可享受文件路由 + `"use server"`。

</v-click>

---
transition: slide-up
---

# 项目结构

```
my-app/
├── src/
│   ├── app.tsx               # 根组件：Router + FileRoutes
│   ├── entry-client.tsx      # 客户端入口（mount）
│   ├── entry-server.tsx      # 服务端入口（StartServer）
│   ├── routes/               # 文件路由根
│   │   ├── index.tsx         # /
│   │   ├── about.tsx         # /about
│   │   ├── [id].tsx          # /:id
│   │   └── api/
│   │       └── hello.ts      # /api/hello（API route）
│   ├── components/
│   ├── lib/                  # 通用模块（db / utils / auth）
│   └── middleware/
│       └── index.ts          # 全局 middleware
├── public/                   # 静态资源
├── app.config.ts             # Vinxi / SolidStart 配置（adapter / preset）
├── tsconfig.json
└── package.json
```

<v-click>

**关键文件**：`app.config.ts` 控制构建 / 部署 preset，`entry-server.tsx` 包装 SSR，`src/routes/` 是约定根目录。

</v-click>

---
transition: slide-up
---

# app.config.ts：核心配置

```ts
import { defineConfig } from '@solidjs/start/config'

export default defineConfig({
  // 部署 preset：决定生成什么平台的产物
  server: {
    preset: 'vercel',          // 'netlify' / 'cloudflare-pages' / 'node-server' /
                               // 'bun' / 'deno' / 'static' / ...（Nitro 全部 preset）
  },

  // 中间件入口
  middleware: 'src/middleware/index.ts',

  // SSR 开关
  ssr: true,                   // false → 退化成 SPA

  // Vite 配置透传
  vite: {
    plugins: [/* unocss, ... */],
  },
})
```

<v-click>

`defineConfig` 来自 `@solidjs/start/config`，本质包装 Vinxi config + 注入 SolidStart 默认行为。

</v-click>

---
transition: slide-up
---

# Vinxi：底层平台

```
SolidStart  ← UI 框架（routes / FileRoutes / Suspense / createAsync）
    ↓
Vinxi       ← 元框架平台（多 entry / router 抽象 / SSR pipeline）
    ↓
Vite        ← 开发服务器 + 构建工具
    ↓
Nitro       ← Nuxt 团队的服务运行时（adapter / preset / minimal server）
```

<v-click>

**Vinxi 角色**：

- 抽象 client / server 多 entry
- 调度 SSR pipeline（与 Solid 流式 renderer 协作）
- 桥接 Vite + Nitro adapter
- 未来路线图：SolidStart 可能直接接入 Nitro，去掉 Vinxi 中间层

</v-click>

<v-click>

> 💡 **提示**
>
> 不需要直接学 Vinxi——SolidStart 把它隐藏在 `defineConfig` 背后。但遇到 `vinxi/http` 引入（cookie / session），就是在调用底座 API。

</v-click>

---
transition: slide-up
---

# 文件路由：FileRoutes 组件

```tsx
// src/app.tsx
import { Suspense } from 'solid-js'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import './app.css'

export default function App() {
  return (
    <Router
      root={(props) => (
        <Suspense>{props.children}</Suspense>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
```

<v-click>

**约定**：`src/routes/**/*.tsx` 全部自动注册到 router——文件结构即路由表。

</v-click>

<v-click>

> 💡 **重要**
>
> 根组件必须用 `<Suspense>` 包裹 `props.children`——否则 hydration 期间会报错。这是 SSR + lazy 路由的需求。

</v-click>

---
transition: slide-up
---

# 路由约定

```
src/routes/
├── index.tsx                # /
├── users/[id].tsx           # /users/:id（动态参数）
├── blog/[...slug].tsx       # /blog/*（catch-all）
├── (auth)/login.tsx         # /login（分组目录，URL 不含）
└── api/hello.ts             # /api/hello（API endpoint）
```

<v-click>

| 文件名 | 路径 |
|---|---|
| `index.tsx` | 当前目录的根路径 |
| `[param].tsx` | 动态参数（`useParams().param`） |
| `[...slug].tsx` | catch-all 通配 |
| `(group)/` | 分组目录，URL 不包含 |
| `api/*.ts` | 命名导出 `GET` / `POST` / ... 即 endpoint |

</v-click>

---
transition: slide-up
---

# 嵌套布局

```tsx
// src/routes/dashboard.tsx —— 布局组件
import type { RouteSectionProps } from '@solidjs/router'

export default function DashboardLayout(props: RouteSectionProps) {
  return (
    <div class="dashboard">
      <aside><Sidebar /></aside>
      <main>{props.children}</main>
    </div>
  )
}
```

```
src/routes/
├── dashboard.tsx              # 布局
└── dashboard/
    ├── index.tsx              # /dashboard
    ├── analytics.tsx          # /dashboard/analytics
    └── settings.tsx           # /dashboard/settings
```

<v-click>

**约定**：与目录同名的 `.tsx` 文件自动作为该目录子路由的布局。`props.children` 渲染子页面。

</v-click>

---
transition: slide-up
---

# 数据加载：query + createAsync

```tsx
// src/routes/posts/[id].tsx
import { query, createAsync, type RouteDefinition } from '@solidjs/router'

// 定义查询（带 cache key 实现去重）
const getPost = query(async (id: string) => {
  const res = await fetch(`https://api/posts/${id}`)
  return res.json()
}, 'post')

// 路由配置：预加载
export const route = {
  preload: ({ params }) => getPost(params.id),
} satisfies RouteDefinition

export default function PostPage(props) {
  const post = createAsync(() => getPost(props.params.id))

  return (
    <article>
      <h1>{post()?.title}</h1>
      <p>{post()?.body}</p>
    </article>
  )
}
```

---
transition: slide-up
---

# query 的去重 + 缓存语义

```ts
import { query, createAsync } from '@solidjs/router'

const getUser = query(async (id: string) => {
  const r = await fetch(`/api/user/${id}`)
  return r.json()
}, 'user')   // ← 第二个参数：cache key
```

<v-click>

**特性**：

- **同 key + 同参数**：自动去重，整个渲染树共享一次结果
- **失效**：`revalidate(getUser.keyFor(id))` 主动重新拉取
- **SSR**：服务端跑一次，结果序列化进 HTML
- **`preload`**：路由匹配同时启动（不等组件渲染）

</v-click>

<v-click>

> 💡 1.0 之前 `query` 叫 `cache`，遇到旧博客需替换。

</v-click>

---
transition: slide-up
---

# "use server" 指令

把函数体编译成只在服务端执行：

```ts
import { query } from '@solidjs/router'
import { db } from '~/lib/db'

const getPosts = query(async () => {
  'use server'    // ← 函数级 RPC 边界
  return await db.posts.findMany()
}, 'posts')
```

<v-click>

**编译产物**：

- **服务端 bundle**：直接调用函数体（含 `db` 引入）
- **客户端 bundle**：函数体被替换为 `fetch('/_server', {...})` POST stub
- **类型**：客户端 `getPosts()` 返回类型仍是 `Promise<Post[]>`，端到端推导
- **零字节泄漏**：`db` 包 / SECRET 完全不进客户端 bundle

</v-click>

<v-click>

> 💡 **核心规则**
>
> `"use server"` **必须**是函数体第一行字符串字面量。不能 import 时调，不能动态拼接——编译器是按位置识别的。

</v-click>

---
transition: slide-up
---

# use server vs React Server Action

| 维度 | SolidStart `"use server"` | React Server Action |
|---|---|---|
| 触发器 | 函数体第一行 `"use server"` | 文件 / 函数体第一行 |
| 调用方式 | 任何函数（query / action / 工具函数） | 主要在 form action / event handler |
| 序列化 | JSON / FormData | JSON / FormData / React 类型 |
| 客户端 stub | fetch POST | RSC 协议 |
| RSC | **无 RSC 心智** | 必须区分 Client / Server Component |

<v-click>

> 💡 SolidStart 没有 RSC 心智——组件就是组件，`"use server"` 只标记单个函数。这是与 Next.js App Router 最大的范式差异。

</v-click>

---
transition: slide-up
---

# preload：路由级数据预加载

```tsx
// src/routes/posts/[id].tsx
import { query, createAsync, type RouteDefinition } from '@solidjs/router'

const getPost = query(async (id: string) => {
  'use server'
  return await db.posts.get(id)
}, 'post')

const getComments = query(async (postId: string) => {
  'use server'
  return await db.comments.findMany({ where: { postId } })
}, 'comments')

// 路由匹配时立刻并行触发两个 query
export const route = {
  preload: ({ params }) => {
    void getPost(params.id)
    void getComments(params.id)
  },
} satisfies RouteDefinition
```

<v-click>

**优势**：`preload` 在路由匹配（hover `<A>` 时）启动 fetch——**无瀑布**，组件渲染时数据可能已就绪。

</v-click>

---
transition: slide-up
---

# 数据变更：action

```tsx
// src/routes/posts/index.tsx
import { action, useSubmission } from '@solidjs/router'
import { Show } from 'solid-js'

const addPost = action(async (formData: FormData) => {
  'use server'
  const title = formData.get('title') as string
  if (title.length < 2) return { error: 'Title too short' }
  await db.posts.create({ data: { title } })
}, 'addPost')

export default function Page() {
  const submission = useSubmission(addPost)

  return (
    <form action={addPost} method="post">
      <input name="title" required />
      <button disabled={submission.pending}>Add</button>
      <Show when={submission.result?.error}>
        <p class="error">{submission.result?.error}</p>
      </Show>
    </form>
  )
}
```

---
transition: slide-up
---

# action：useSubmission 状态

```ts
import { action, useSubmission, useSubmissions } from '@solidjs/router'

const updatePost = action(async (formData: FormData) => { /* ... */ }, 'updatePost')

// 单个最近一次提交
const sub = useSubmission(updatePost)
sub.pending   // boolean    sub.input    // FormData
sub.result    // 返回值     sub.error    // 错误
sub.clear()   // 清状态     sub.retry()  // 重试

// 所有进行中的提交（乐观 UI 列表）
const subs = useSubmissions(updatePost)
```

<v-click>

**典型用法**：

- 按钮 `disabled={sub.pending}` → 防重复提交
- 列表项渲染 `useSubmissions` 中的 `input` → 乐观显示

</v-click>

---
transition: slide-up
---

# action：redirect + revalidate

```ts
import { action, redirect, revalidate } from '@solidjs/router'

const addPost = action(async (formData: FormData) => {
  'use server'
  const post = await db.posts.create({ data: { /* ... */ } })
  throw redirect(`/posts/${post.id}`)   // 重定向（throw）
}, 'addPost')

const deletePost = action(async (id: string) => {
  'use server'
  await db.posts.delete({ where: { id } })
  revalidate(getPosts.key)              // 失效 query 让 UI 重拉
}, 'deletePost')
```

<v-click>

> 💡 **单飞 mutation**：action 完成后，server 端同一请求里跑的相关 query 结果会**搭便车**回传——一次 POST 完成"变更 + 取新数据"。

</v-click>

---
transition: slide-up
---

# action：JSON 调用（非表单）

```tsx
import { action, useAction } from '@solidjs/router'

const likePost = action(async (id: string) => {
  'use server'
  await db.likes.create({ data: { postId: id, userId: getUserId() } })
}, 'likePost')

export default function Post(props: { id: string }) {
  const submit = useAction(likePost)

  return (
    <button onClick={() => submit(props.id)}>
      Like
    </button>
  )
}
```

<v-click>

**`action` 的两种触发方式**：

- `<form action={addPost} method="post">` → 表单 FormData，渐进增强（无 JS 也工作）
- `useAction(addPost)` → 取出可调用函数，用任意参数（JSON 序列化）

</v-click>

---
transition: slide-up
---

# Middleware：请求拦截

```ts
// src/middleware/index.ts
import { createMiddleware } from '@solidjs/start/middleware'
import { getCookie, setCookie } from 'vinxi/http'

export default createMiddleware({
  onRequest: async (event) => {
    const theme = getCookie(event.nativeEvent, 'theme')      // 读 cookie
    setCookie(event.nativeEvent, 'session', 'abc123', {       // 写 cookie
      httpOnly: true, secure: true, maxAge: 60 * 60 * 24,
    })
    event.locals.theme = theme ?? 'light'  // 注入 locals
  },
  onBeforeResponse: (event, response) => { /* 修改响应 */ },
})
```

<v-click>

`app.config.ts` 中 `middleware: 'src/middleware/index.ts'` 注册。

</v-click>

---
transition: slide-up
---

# Session：基于 cookie 的会话

```ts
import { useSession } from 'vinxi/http'

type SessionData = { userId?: string }

export async function getSession() {
  'use server'
  return await useSession<SessionData>({
    password: process.env.SESSION_SECRET!,    // ≥ 32 字节
    name: 'session',
  })
}

// 登录
export const login = action(async (formData: FormData) => {
  'use server'
  const user = await db.users.findByEmail(formData.get('email') as string)
  if (!user) return { error: 'No user' }
  const session = await getSession()
  await session.update({ userId: user.id })
  throw redirect('/dashboard')
}, 'login')
```

<v-click>

**机制**：`useSession` 用对称加密把 session data 塞进 cookie，无需服务端存储。

</v-click>

---
transition: slide-up
---

# 完整 Auth 流程速通

```ts
// 1. 当前用户 query（多页面共享）
const getCurrentUser = query(async () => {
  'use server'
  const session = await getSession()
  if (!session.data.userId) throw redirect('/login')
  return db.users.get(session.data.userId)
}, 'currentUser')

// 2. 路由 preload + protect
export const route = { preload: () => getCurrentUser() } satisfies RouteDefinition

export default function Dashboard() {
  const user = createAsync(() => getCurrentUser())
  return <h1>Welcome {user()?.name}</h1>
}

// 3. 退出 action
export const logout = action(async () => {
  'use server'
  await (await getSession()).clear()
  throw redirect('/login')
}, 'logout')
```

---
transition: slide-up
---

# API Routes

```ts
// src/routes/api/users/[id].ts
import type { APIEvent } from '@solidjs/start/server'

export async function GET({ params }: APIEvent) {
  const user = await db.users.get(params.id)
  if (!user) return new Response('Not Found', { status: 404 })
  return new Response(JSON.stringify(user), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST({ request, params }: APIEvent) {
  await db.users.update(params.id, await request.json())
  return new Response(null, { status: 204 })
}
```

<v-click>

文件按 HTTP 方法命名导出：`GET` / `POST` / `PUT` / `PATCH` / `DELETE`。返回标准 `Response`。

</v-click>

---
transition: slide-up
---

# API Routes vs Server Functions

| 维度 | API Route | Server Function (`"use server"`) |
|---|---|---|
| 暴露 | 公开 URL（`/api/x`） | 内部 endpoint（路径不固定） |
| 调用 | `fetch` / 外部 client | `query` / `action` / `useAction` |
| 类型推导 | 手动写类型契约 | 端到端自动推导 |
| 适合 | webhook / 第三方调用 / tRPC 端点 | 自家 UI 内部用 |
| HTTP 方法 | 多个命名导出 | POST（自动） |

<v-click>

**经验**：UI 内部数据用 `query` + `action`；webhook / GraphQL 端点用 API route；两者皆需则写 API route，UI 用 `fetch` 包 `query`。

</v-click>

---
transition: slide-up
---

# 流式 SSR

```tsx
import { Suspense } from 'solid-js'

export default function Home() {
  return (
    <>
      <h1>Welcome</h1>
      <Nav />                          {/* 立即发送 */}
      <Suspense fallback={<Skeleton />}>
        <SlowFeed />                   {/* 数据慢，先发 fallback */}
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <Sidebar />                    {/* 独立流，不阻塞主流 */}
      </Suspense>
    </>
  )
}
```

<v-click>

服务器立即 flush `<h1>` + `<Nav />` + `<Skeleton />`；数据 ready 后再发 `<template>` + 内联脚本替换 fallback——首屏 TTI **不被慢数据阻塞**。**默认开启**，Solid 1.7+ 直接支持。

</v-click>

---
transition: slide-up
---

# 渲染模式：SSR / SSG / SPA

```ts
export default defineConfig({
  ssr: true,            // 默认 true（SSR）；false → SPA
  server: {
    preset: 'static',   // → SSG（全量预渲染）
    prerender: { crawlLinks: true, routes: ['/sitemap.xml', '/about'] },
  },
})
```

<v-click>

| 模式 | `ssr` | `preset` | 适合 |
|---|---|---|---|
| **SSR** | `true` | `vercel` / `node-server` | 动态内容、个性化、最常见 |
| **SSG** | `true` | `static` + `prerender` | 博客、文档、Marketing |
| **SPA** | `false` | 任意 | 后台 / SaaS（不需要 SEO） |
| **混合** | `true` | 单 route 加 `route.prerender = true` | 部分 SSG，其余 SSR |

</v-click>

---
transition: slide-up
---

# Route-Level Prerender

混合渲染：动态站点中把部分页面静态化。

```tsx
// src/routes/about.tsx
import type { RouteDefinition } from '@solidjs/router'

export const route = {
  // 这个路由在构建时预渲染
  prerender: true,
} satisfies RouteDefinition

export default function About() {
  return <h1>About Us</h1>
}
```

<v-click>

**典型组合**：`/`、`/about`、`/pricing` → 预渲染；`/dashboard/**` → SSR；`/api/**` → 服务端 endpoint。一份代码，混合部署，无需手动切两种构建。

</v-click>

---
transition: slide-up
---

# Adapter 体系：preset 切换

```ts
// app.config.ts —— 改一行切换部署平台
export default defineConfig({ server: { preset: 'vercel' } })
```

<v-click>

**支持的 preset（继承 Nitro 全集）**：

| Preset | 平台 |
|---|---|
| `node-server` | 自己跑 Node 服务（默认） |
| `vercel` / `vercel_edge` | Vercel Serverless / Edge |
| `netlify` / `netlify_edge` | Netlify Functions / Edge |
| `cloudflare-pages` / `cloudflare_module` | CF Pages / Workers |
| `bun` / `deno-deploy` / `static` | Bun / Deno / SSG |

> 💡 同一份代码改 `preset` 即可切平台——Server Functions 自动适配。

</v-click>

---
transition: slide-up
---

# Vercel 部署示例

```bash
# 1. 改 app.config.ts → server: { preset: 'vercel' }

# 2. push 到 GitHub → Vercel 自动构建，或本地预览：
pnpm build              # 产物在 .vercel/output/

# 3. 用 vercel CLI 部署
vercel --prod
```

<v-click>

**注意事项**：

- 默认 `preset: 'vercel'` 是 Serverless（Node runtime）
- `'vercel_edge'` → Edge（V8 isolate，启动快但 API 受限）
- Server Functions 路径会被映射为 `/_server` endpoint

</v-click>

---
transition: slide-up
---

# Cloudflare / Bun / Deno

```ts
preset: 'cloudflare-pages'   // CF Pages
preset: 'cloudflare_module'  // CF Workers
preset: 'bun'                // Bun runtime
preset: 'deno-deploy'        // Deno Deploy
```

<v-click>

**Edge 平台限制**：不能用 Node API（`fs` / `child_process`），必须用 Web standard（`fetch` / `Request` / Web Crypto）。Cloudflare 有 KV / D1 / R2 / Durable Objects 绑定。

</v-click>

<v-click>

**经验**：选 Edge 前确认依赖兼容；数据库走 HTTP API（PlanetScale / Neon / D1）不要 TCP；文件存储用 R2 / S3。

</v-click>

---
transition: slide-up
---

# 环境变量

```bash
# .env / .env.local（git ignore）—— 前缀决定可见性
DATABASE_URL=postgres://...   # 无前缀：只服务端可读
SESSION_SECRET=long-random-string-at-least-32-bytes
VITE_API_URL=...              # VITE_ 前缀：客户端 + 服务端都可读
```

```ts
// 服务端代码（"use server" / middleware / API route）
process.env.DATABASE_URL        // OK
// 客户端代码（组件）
import.meta.env.VITE_API_URL    // OK（VITE_ 前缀）
```

<v-click>

> 💡 无 `VITE_` 前缀的变量**永远不会**进入客户端 bundle——只能在 `"use server"` / middleware / API route 中读 `process.env.XXX`。

</v-click>

---
transition: slide-up
---

# vs Next.js App Router

| 维度 | SolidStart | Next.js 16 |
|---|---|---|
| UI 库 | SolidJS（Signals） | React（Hooks + RSC） |
| 数据加载 | `query` + `createAsync` | RSC（async component） |
| 数据变更 | `action` + `useSubmission` | Server Actions |
| Client / Server | **无 RSC 心智** | 必须区分 `"use client"` |
| 流式 SSR | 默认开启 | 支持（需 Suspense） |

<v-click>

**何时选 SolidStart**：性能敏感 UI bundle 想小；不想接受 RSC 复杂度；团队 JSX 习惯但拒绝 React 大生态绑定。

</v-click>

---
transition: slide-up
---

# vs Nuxt / SvelteKit / Astro

| 维度 | SolidStart | Nuxt 4 | SvelteKit 2 | Astro |
|---|---|---|---|---|
| UI | SolidJS JSX | Vue SFC | Svelte SFC | 多框架 + Islands |
| 文件路由 | `src/routes/` | `pages/` / `app/` | `src/routes/` | `src/pages/` |
| 数据加载 | `query` | `useFetch` | `+page.server.ts` | `getStaticPaths` |
| 数据变更 | `action` | `$fetch` | `actions` | Action（实验） |
| 服务端 | `"use server"` | Nitro Server | Server Hooks | Server Endpoints |
| 默认 JS | 极小 | 中（Vue runtime） | 极小（编译） | **0**（Island） |

---
transition: slide-up
---

# 常见踩坑（一）：props 解构

```tsx
// ❌ 解构丢响应性
export default function Detail({ params }: RouteSectionProps) {
  const post = createAsync(() => getPost(params.id))   // params.id 是初始值
  return <h1>{post()?.title}</h1>                       // 路由切换不更新
}

// ✅ 用 props.xxx
export default function Detail(props: RouteSectionProps) {
  const post = createAsync(() => getPost(props.params.id))
  return <h1>{post()?.title}</h1>
}
```

<v-click>

**根因**：SolidJS 组件只跑一次，props 是 Proxy；解构相当于一次性拷贝当前值，之后路由参数变化无法穿透。这是从 SolidJS 继承的"头号坑"，在 SolidStart 路由场景里尤其常见。

</v-click>

---
transition: slide-up
---

# 常见踩坑（二）：忘加 Suspense 边界

```tsx
// ❌ 没 Suspense：createAsync 触发 Promise，渲染时抛错
export default function Page() {
  const post = createAsync(() => getPost('1'))
  return <h1>{post()?.title}</h1>      // hydration mismatch
}

// ✅ 套 Suspense（或在 Router root 套）
export default function Page() {
  const post = createAsync(() => getPost('1'))
  return (
    <Suspense fallback={<Skeleton />}>
      <h1>{post()?.title}</h1>
    </Suspense>
  )
}
```

<v-click>

**规则**：`createAsync` 的值是 Promise，必须在 `<Suspense>` 内消费。推荐根组件套一层 `<Suspense>`，局部 `<Suspense>` 用于流式（快数据先 paint，慢数据后流入）。

</v-click>

---
transition: slide-up
---

# 常见踩坑（三）：use server 误用

```ts
// ❌ 不在函数体第一行
const handler = async () => {
  console.log('start')
  'use server'              // 无效——必须是第一行
  return db.posts.findMany()
}

// ❌ 动态拼接
const directive = 'use server'
const handler = async () => {
  directive                 // 编译器不识别
  return db.posts.findMany()
}

// ❌ 闭包捕获服务端变量传到客户端
function Page() {
  const secret = process.env.SECRET   // 仅服务端可读 → 客户端为 undefined
  return <p>{secret}</p>
}
```

<v-click>

**规则**：`"use server"` 必须是函数体第一行字面量；入参 / 返回值必须 JSON 可序列化；服务端独占资源（DB、secrets）只能在 `"use server"` 函数内访问。

</v-click>

---
transition: slide-up
---

# 常见踩坑（四）：query key 重名

```ts
// ❌ 两个 query 用相同 cache key
const getUser = query(async (id: string) => { ... }, 'user')
const getUserPosts = query(async (uid: string) => { ... }, 'user')   // 撞了

// ✅ key 必须唯一
const getUser = query(async (id: string) => { ... }, 'user')
const getUserPosts = query(async (uid: string) => { ... }, 'user.posts')
```

<v-click>

**额外注意**：

- `revalidate('user')` 会失效所有同 key 的 query
- 同 key + 同参数 = 同一 cache entry
- key 推荐用 `'user'` / `'user.posts'` / `'user.comments.list'` 这种点号命名空间

</v-click>

---
transition: slide-up
---

# 常见踩坑（五）：useSubmission 多个 action

```tsx
// 同一组件多个 action：
const addPost = action(/* ... */, 'addPost')
const deletePost = action(/* ... */, 'deletePost')

export default function Page() {
  const addSub = useSubmission(addPost)         // ✅ 只追加 addPost
  const delSub = useSubmission(deletePost)      // ✅ 只追删除

  // ❌ 写错：复用同一个变量
  const sub = useSubmission(addPost)
  // 然后 delete 提交也用 sub → 状态永远空
}
```

<v-click>

**规则**：

- 每个 action 各自有 `useSubmission` / `useSubmissions`
- 多个并发提交看 `useSubmissions(action)`（复数 hook）
- 列表场景做乐观 UI：渲染 `useSubmissions` 中的 `input` + 实际数据

</v-click>

---
transition: slide-up
---

# 经验法则

<v-clicks>

- **数据加载用 `query` + `createAsync`** → 别用 `createResource`（SolidStart 范式优先）
- **变更用 `action` + `useSubmission`** → 表单优先，乐观 UI 用 `useSubmissions`
- **`"use server"` 包敏感操作** → 数据库 / secrets / 文件 IO 全放进去
- **`preload` 把数据提前** → 路由匹配时启动 fetch，无瀑布
- **revalidate 失效 cache** → mutation 后让 query 重新跑
- **Suspense 包数据消费点** → 局部 fallback，流式 paint
- **适配器选 preset** → Vercel / Netlify / CF 一行配置切换
- **环境变量加 `VITE_` 前缀才进 client** → 服务端 secrets 永远不带前缀
- **不要解构 props** → SolidJS "头号坑"在 SolidStart 路由组件中常见
- **2.0 / Nitro 整合还在路上** → 暂时学 1.x 范式

</v-clicks>

---
transition: slide-up
---

# 不适合 SolidStart 的场景

<v-clicks>

- **团队深度依赖 Next.js 生态（RSC 中间件 / Vercel AI / Clerk）** → 切换成本高
- **企业中后台依赖 Ant Design / Element Plus / Mantine** → SolidJS UI 库覆盖不足
- **大量招聘需求** → 候选人远少于 React / Vue
- **复杂 RSC 流式场景（数据库 stream 直推 client）** → Next.js + RSC 仍领先
- **追求最稳元框架** → SolidStart 1.x 仍在 Vinxi → Nitro 迁移路上
- **重 React Native 跨端** → solid-native 远不如 RN 成熟

</v-clicks>

<v-click>

> **经验**：SolidStart 最强场景是"**中小型 SSR / SSG 应用，性能敏感，团队接受 SolidJS 心智，无重度生态绑定**"——独立产品 / 内容站 / 性能优先的 SaaS。

</v-click>

---
transition: slide-up
---

# 下一步学习路径

```
入门：跑通模板 → 官方 Tutorial → 写一个 CRUD
进阶：query + createAsync + preload / action + useSubmission /
      "use server" + Session + Auth / Middleware + API routes
实战：Adapter 部署 / 流式 SSR / 混合渲染 / 性能调优
延伸：Vinxi 源码 / SolidStart 2.0 路线图
```

<v-click>

**官方资源**：

- 文档：[start.solidjs.com](https://start.solidjs.com) / [docs.solidjs.com/solid-start](https://docs.solidjs.com/solid-start)
- 示例：[github.com/solidjs/solid-start/tree/main/examples](https://github.com/solidjs/solid-start/tree/main/examples)
- Discord：SolidJS 官方社区（#solid-start 频道）

</v-click>

---
layout: center
class: text-center
---

# 总结

适合：中小型 SSR / SSG 应用 / 性能敏感 / 拒绝 RSC 复杂度

少做：React 生态深绑定 / 大团队招聘 / 企业中后台依赖大 UI 库

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://start.solidjs.com/" target="_blank">start.solidjs.com</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/solidjs/solid-start" target="_blank">solidjs/solid-start</a>
</div>

<div class="mt-4">
  <carbon:play /> <a href="https://docs.solidjs.com/solid-start" target="_blank">SolidStart Docs</a>
</div>
