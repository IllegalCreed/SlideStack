---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Qwik
info: |
  Presentation Qwik for frontend developers.

  Learn more at [https://qwik.dev](https://qwik.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:qwik-icon class="text-7xl" />
</div>

<br/>

## Qwik — Instant-On Resumable Framework

O(1) Hydration via Resumability：把状态序列化进 HTML，让客户端从服务端的位置直接「续跑」

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Qwik。

Builder.io 主导、Misko Hevery（Angular 创始人）操刀的新一代框架。
最大卖点是 Resumability：放弃 Hydration，把执行状态序列化进 HTML，让客户端从服务端的位置直接「续跑」——
初始 JS 永远 ~1KB，不论应用多大。
-->

---
transition: fade-out
---

# 什么是 Qwik？

Builder.io 维护的可恢复（Resumable）框架，把「初始 JS 体积」从应用规模解耦

<v-click>

- **Resumability 不是 Hydration**：服务端暂停、客户端恢复——不重放任何组件代码
- **初始 JS ~1KB**：无论应用多大，启动时只下载一个 Qwikloader（全局事件代理）
- **细粒度 lazy boundary**：`$` 后缀的每个函数都是独立 chunk，按需加载
- **Signals 响应式**：useSignal / useStore，与 React useState / Vue ref 心智相近
- **Qwik City 全栈**：file-based routing + routeLoader$ + routeAction$ + server$ RPC
- **JSX 模板**：React 开发者零成本切换语法
- **TypeScript 一流**：所有 API 类型完备
- **多端 Adapter**：Cloudflare / Vercel / Netlify / Node / Deno / Bun / AWS Lambda

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Qwik_](https://qwik.dev)

</div>

<style>
h1 {
  background-color: #18B6F6;
  background-image: linear-gradient(45deg, #18B6F6 10%, #AC7FF4 90%);
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

Resumability 是真创新，但代价是序列化约束 + 生态规模较小

<v-clicks>

**优点**
- 启动 JS ~1KB 常数级——大应用 TTI 显著优于 React/Vue/Svelte
- Optimizer 自动拆 chunk，无需手动 React.lazy / dynamic import
- JSX 语法零迁移成本（React 开发者直接上手）
- Signals 响应式精准，无 Virtual DOM diff 开销
- Qwik City 全栈一体化（路由 + RPC + Form）
- 多端 Adapter 完整，Edge 部署友好
- TypeScript 类型推导一流，server$ 自动 RPC

**缺点**
- 序列化约束有学习曲线（closures 必须 const + 可序列化）
- `$` 后缀心智模型独特，调试 chunk 加载较反直觉
- 生态规模远小于 React 生态（UI 库 / 教程 / 招聘）
- 实时交互（如重型 SPA）优势不如静态 + 偶发交互场景明显
- 部分边缘情况需要 `noSerialize()` 标记，违反框架直觉
- Builder.io 单一商业主体——长期投入需观察

</v-clicks>

---
transition: slide-up
---

# 定位与生态

Resumability 在前端框架版图里的位置

<v-clicks>

- **谁在做**：Builder.io（无头 CMS / 可视化编辑器厂商）主导，Misko Hevery（Angular 创始人）任 CTO
- **为什么有这个框架**：Builder.io 的页面构建器输出大量 HTML，React Hydration 在大页面上 TTI 灾难——Qwik 是为 Server-Rendered Heavy Page 量身打造
- **与 React 的关系**：JSX 语法相同，但执行模型完全不同（无 VDOM、无 Hydration、`$` 拆分）
- **与 Vue / Svelte 的关系**：Signals 响应式相近 Vue 3，但 Svelte 仍走编译时 + Hydration
- **与 SolidJS 的关系**：都用 Signals，但 Solid 仍走 Hydration，Qwik 走 Resumability
- **靠近 Astro 的中间地带**：Astro Islands 局部 Hydration / Qwik 全应用零 Hydration
- **学习路径**：React JSX 基础 → 接受 `$` 拆分思想 → 序列化约束 → Qwik City 路由

</v-clicks>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 关键事件 |
|---|---|---|
| **Qwik 0.x** | 2022 | Builder.io 开源，Resumability 概念落地 |
| **Qwik 1.0** | 2023.5 | 稳定版，正式生产可用 |
| **Qwik 1.2** | 2023.7 | useResource$ / Server$ 完善 |
| **Qwik 1.5** | 2024.5 | Qwik Insights、preventDefault、useStyles$ 优化 |
| **Qwik 1.7** | 2024.7 | Valibot 验证、SPA 模式优化 |
| **Qwik 1.13** | 2025 | Vite 6+ 兼容、SSR 性能提升 |
| **Qwik 2.0** | 2025 路线 | Signals v2、严格序列化、@qwik.dev/core 重组 |

<v-click>

**今天主要讲 Qwik 1.x（稳定线）**——2.0 正在 RC，API 大方向一致，主要是包名 + 类型重组。

</v-click>

---
transition: slide-up
---

# Resumability 核心：Hydration 的根本问题

```
传统 SSR + Hydration（React/Vue/Svelte）：
  Server: render(App) → HTML
  Client: 收到 HTML → 下载 App 全部 JS
       → 重新执行 render(App)（重建组件树）
       → 比对 DOM、附加事件监听
       → 终于「可交互」
```

<v-click>

**问题**：Hydration 必须**重放整棵应用**才能附加事件——TTI 与应用大小**线性相关**。

</v-click>

<v-click>

```
Qwik Resumability：
  Server: render(App) → HTML（事件标记序列化进 attribute）
  Client: 收到 HTML → 下载 1KB Qwikloader
       → 不重放任何组件代码
       → 用户点击时，按 attribute 拉对应 chunk → 执行 handler
```

</v-click>

<v-click>

**关键**：客户端**永远不重建组件树**——它只是「续跑」服务端暂停的位置。TTI 与应用大小**无关**（O(1)）。

</v-click>

---
transition: slide-up
---

# HTML 序列化执行状态

Qwik 在 SSR 期间把三件东西序列化进 HTML：

```html
<!-- 1. 事件监听器（attribute 形式） -->
<button on:click="./chunk-abc.js#handler_xyz">Click</button>

<!-- 2. 组件边界（注释标记） -->
<!--qv q:id=1 q:key=Counter-->
  <div>Count: 0</div>
<!--/qv-->

<!-- 3. 状态 + 订阅关系（页面底部 q:func JSON） -->
<script type="qwik/json">
{
  "refs": { "1": "0!" },
  "ctx": { ... },
  "subs": [["1","useSignal_0"]]
}
</script>
```

<v-click>

- **事件**：`on:click="./chunk.js#symbol"` 直接告诉 Qwikloader 加载哪个 chunk、调哪个 export
- **组件**：`<!--qv-->` 边界让 Optimizer 能定位每个组件的渲染范围
- **状态**：JSON blob 保存 signal 值 + 订阅关系——客户端按需复活，不重新初始化

</v-click>

---
transition: slide-up
---

# Qwikloader：全局事件代理

```html
<!-- HTML head 末尾自动注入：唯一的初始 JS -->
<script id="qwikloader">
  // 简化伪代码
  document.addEventListener('click', async (e) => {
    const el = e.target.closest('[on\\:click]')
    if (!el) return
    const qrl = el.getAttribute('on:click')   // "./chunk-abc.js#handler_xyz"
    const [path, symbol] = qrl.split('#')
    const module = await import(path)          // 按需加载
    module[symbol](e)                          // 调用 handler
  }, true)
</script>
```

<v-click>

::: tip ~1KB 常数初始负载
Qwikloader 本体 ~1KB（min+gzip），是**唯一**初始下载的 JS。无论应用有 10 个组件还是 10000 个组件，初始加载量不变。
:::

</v-click>

<v-click>

**对比传统框架**：React 应用初始下载至少 react + react-dom + 业务代码（数十到数百 KB），应用越大下载越多。

</v-click>

---
transition: slide-up
---

# `$` 后缀：lazy boundary 标记

```ts
import { component$, useSignal } from '@builder.io/qwik'

export const Counter = component$(() => {
  const count = useSignal(0)

  return (
    <button onClick$={() => count.value++}>
      Count: {count.value}
    </button>
  )
})
```

<v-click>

**`$` 不是装饰，是命令**——告诉 Optimizer：「这个函数请拆成独立 chunk」。

</v-click>

<v-click>

Optimizer 编译后大致变成：

```ts
// 主 chunk
export const Counter = componentQrl(qrl('./chunk-A.js', 'Counter_onMount'))

// chunk-A.js（仅 SSR 时执行）
export const Counter_onMount = () => {
  const count = useSignal(0)
  return qrl('./chunk-B.js', 'Counter_onRender', [count])
}

// chunk-B.js（用户点击时才下载）
export const Counter_onRender = () => {
  const [count] = useLexicalScope()
  return <button on:click="./chunk-C.js#handler" />
}
```

</v-click>

---
transition: slide-up
---

# Optimizer 自动拆分粒度

每个 `$` 标记都是一个 chunk 边界：

| `$` 函数 | 拆分时机 | 加载时机 |
|---|---|---|
| `component$()` | 组件级 | 组件首次渲染时 |
| `onClick$()` / `onScroll$()` | 事件级 | 用户触发事件时 |
| `useTask$()` | 任务级 | SSR 时 + 跟踪状态变化时 |
| `useVisibleTask$()` | 任务级 | 元素可见时（IntersectionObserver） |
| `server$()` | 函数级 | RPC 调用时（仅 fetch，代码不进 client） |
| `useResource$()` | 资源级 | useResource 触发时 |
| `$()` 包装的任意函数 | 自定义 | 调用时 |

<v-click>

**对比手动拆分**：
- React：`const Foo = React.lazy(() => import('./Foo'))` 手写、组件级
- Vue：`defineAsyncComponent(() => import('./Foo'))` 手写、组件级
- **Qwik：每个 `$` 自动是 chunk**，事件级粒度（手工做不到）

</v-click>

---
transition: slide-up
---

# 闭包捕获约束

`$` 标记的函数捕获的变量必须满足：

```ts
component$(() => {
  // ✅ const + 可序列化
  const name = 'Qwik'
  const obj = { count: 0 }

  // ❌ let（Optimizer 报错）
  let badName = 'oops'

  // ❌ 函数（不可序列化）
  const callback = () => console.log('hi')

  return (
    <button onClick$={() => {
      console.log(name)        // ✅ OK
      console.log(obj.count)   // ✅ OK
      callback()               // ❌ 序列化失败
    }}>
      Click
    </button>
  )
})
```

<v-click>

**为什么**：Optimizer 把闭包变量序列化进 HTML（`q:func` 区域），客户端 chunk 加载后通过 `useLexicalScope()` 恢复。函数对象无法 JSON 化——所以**只能捕获 const + serializable**。

</v-click>

---
transition: slide-up
---

# Signals：useSignal

```ts
import { component$, useSignal } from '@builder.io/qwik'

export const Counter = component$(() => {
  const count = useSignal(0)

  return (
    <div>
      <p>Count: {count.value}</p>
      <button onClick$={() => count.value++}>+1</button>
    </div>
  )
})
```

<v-click>

**心智模型**：
- `signal.value` 读取 → 自动建立订阅
- `signal.value = x` 写入 → 触发依赖该 signal 的组件重渲染
- **不是 Proxy**，是 getter/setter，所以必须 `.value`（不能直接 `count++`）

</v-click>

<v-click>

::: tip 与 Vue ref 几乎一致
`useSignal()` 心智 = Vue 3 `ref()`。但 Qwik 序列化 signal 进 HTML，客户端读 `.value` 时自动从 `qwik/json` 恢复初始值——无需重新初始化。
:::

</v-click>

---
transition: slide-up
---

# Signals：useStore

```ts
import { component$, useStore } from '@builder.io/qwik'

export const Form = component$(() => {
  const state = useStore({
    user: { name: 'Alice', age: 30 },
    items: [] as string[],
  })

  return (
    <div>
      <input
        value={state.user.name}
        onInput$={(_, el) => state.user.name = el.value}
      />
      <p>Age: {state.user.age}</p>
      <button onClick$={() => state.items.push('new')}>Add</button>
      <ul>{state.items.map(i => <li>{i}</li>)}</ul>
    </div>
  )
})
```

<v-click>

**`useStore` vs `useSignal`**：

| 维度 | `useSignal` | `useStore` |
|---|---|---|
| 类型 | 单值（含 `.value`） | 对象 / 数组 |
| 嵌套响应 | 不需要 | **默认深层响应** |
| 适用场景 | 计数器 / 文本 / 单值 | 表单 / 集合 / 复杂状态 |
| 关闭深响应 | - | `{ deep: false }` |

</v-click>

---
transition: slide-up
---

# Signals：useComputed$ 与 useResource$

```ts
import { component$, useSignal, useComputed$, useResource$, Resource } from '@builder.io/qwik'

export const UserCard = component$(() => {
  const userId = useSignal(1)

  // 同步派生值（基于 signal）
  const doubled = useComputed$(() => userId.value * 2)

  // 异步资源（fetch / 数据库）
  const userResource = useResource$(async ({ track, cleanup }) => {
    const id = track(() => userId.value)   // 跟踪 userId 变化时重新执行
    const ctrl = new AbortController()
    cleanup(() => ctrl.abort())              // 上次请求自动取消
    const res = await fetch(`/api/user/${id}`, { signal: ctrl.signal })
    return res.json()
  })

  return (
    <div>
      <p>doubled = {doubled.value}</p>
      <Resource
        value={userResource}
        onPending={() => <p>Loading...</p>}
        onRejected={(err) => <p>Error: {err.message}</p>}
        onResolved={(user) => <p>{user.name}</p>}
      />
    </div>
  )
})
```

---
transition: slide-up
---

# Tasks：useTask$

```ts
import { component$, useSignal, useTask$ } from '@builder.io/qwik'
import { isServer } from '@builder.io/qwik'

export const Search = component$(() => {
  const query = useSignal('')
  const debounced = useSignal('')

  useTask$(({ track, cleanup }) => {
    const q = track(() => query.value)

    // SSR 立即跑（首次渲染）
    if (isServer) {
      debounced.value = q
      return
    }

    // 客户端防抖
    const id = setTimeout(() => debounced.value = q, 500)
    cleanup(() => clearTimeout(id))
  })

  return <input value={query.value} onInput$={(_, el) => query.value = el.value} />
})
```

<v-click>

**`useTask$` 特点**：SSR + 客户端都跑、阻塞首次渲染、tracked signal 变化时重跑、`cleanup` 清理副作用。

</v-click>

---
transition: slide-up
---

# Tasks：useVisibleTask$（谨慎使用）

```ts
import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'

export const Clock = component$(() => {
  const time = useSignal('')

  useVisibleTask$(({ cleanup }) => {
    const id = setInterval(() => {
      time.value = new Date().toLocaleTimeString()
    }, 1000)
    cleanup(() => clearInterval(id))
  })

  return <p>{time.value}</p>
})
```

<v-click>

**`useVisibleTask$` 特点**：
- **只在客户端跑**（SSR 完全跳过）
- 元素进入视口（IntersectionObserver）后触发
- **强制下载 chunk** → 损失 lazy boundary 收益

</v-click>

<v-click>

::: warning 滥用是 Qwik 第一大坑
官方明确说「last resort」。每个 `useVisibleTask$` 都让客户端**必须下载并执行**一段 JS——破坏 Resumability 优势。优先考虑 `useTask$` / 事件 handler / `useOn`。
:::

</v-click>

---
transition: slide-up
---

# useOn / useOnDocument / useOnWindow

替代 `useVisibleTask$` 的更轻量方案：

```ts
import { component$, useOn, useOnDocument, useOnWindow, $ } from '@builder.io/qwik'

export const ShortcutListener = component$(() => {
  // host 元素上的事件
  useOn('click', $((e) => console.log('host clicked', e)))

  // document 事件
  useOnDocument('keydown', $((e) => {
    if ((e as KeyboardEvent).key === 'Escape') console.log('ESC')
  }))

  // window 事件
  useOnWindow('resize', $(() => console.log('resized')))

  return <div>Listen everywhere</div>
})
```

<v-click>

**优势**：
- 事件 handler 仍是 lazy chunk（用户触发才下载）
- **不会**强制下载组件代码
- 适合「想监听全局事件，但不想丢失 Resumability」的场景

</v-click>

---
transition: slide-up
---

# Server Functions：server$

```ts
import { component$, useSignal, $, server$ } from '@builder.io/qwik'

// 仅服务端执行的函数（客户端拿到一个 RPC stub）
export const getServerTime = server$(async function () {
  // this = RequestEvent，可访问 cookies / env / headers
  console.log('client IP:', this.clientConn?.ip)
  return new Date().toISOString()
})

export default component$(() => {
  const time = useSignal('')

  return (
    <button onClick$={$(async () => {
      time.value = await getServerTime()
    })}>
      Fetch server time: {time.value}
    </button>
  )
})
```

<v-click>

**机制**：
- 服务端：直接调用函数
- 客户端：编译成 `fetch('/qwik-rpc', { body: {...} })` 自动 POST
- **服务端代码 0 字节进客户端 bundle**（包括函数体 + 依赖）
- 端到端类型推导（client 端 `getServerTime` 的返回类型仍是 `Promise<string>`）

</v-click>

---
transition: slide-up
---

# routeLoader$：声明式数据加载

```ts
// src/routes/products/[id]/index.tsx
import { component$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'

export const useProduct = routeLoader$(async ({ params }) => {
  const res = await fetch(`https://api/products/${params.id}`)
  return res.json() as Promise<{ name: string; price: number }>
})

export default component$(() => {
  const product = useProduct()
  // product.value 类型自动推导为 { name: string; price: number }
  return (
    <div>
      <h1>{product.value.name}</h1>
      <p>¥{product.value.price}</p>
    </div>
  )
})
```

<v-click>

**特点**：
- 路由级 / layout 级声明
- 服务端执行（导航前），结果序列化进 HTML
- 客户端 `useProduct()` 拿到 readonly Signal，**不重新 fetch**
- 类型从 loader 返回值反向推到 component 端

</v-click>

---
transition: slide-up
---

# routeAction$：表单 + 突变

```ts
// src/routes/users/index.tsx
import { component$ } from '@builder.io/qwik'
import { routeAction$, Form, zod$, z } from '@builder.io/qwik-city'

export const useAddUser = routeAction$(
  async (data, { redirect, fail }) => {
    if (await db.exists(data.email)) {
      return fail(400, { error: 'Email taken' })
    }
    await db.users.create(data)
    throw redirect(302, '/users')
  },
  zod$({
    name: z.string().min(2),
    email: z.string().email(),
  })
)

export default component$(() => {
  const action = useAddUser()

  return (
    <Form action={action}>
      <input name="name" />
      {action.value?.failed && <p>{action.value.fieldErrors?.name}</p>}
      <input name="email" />
      <button type="submit">Create</button>
      {action.isRunning && <p>Submitting...</p>}
    </Form>
  )
})
```

---
transition: slide-up
---

# routeAction$ vs globalAction$

| 维度 | `routeAction$` | `globalAction$` |
|---|---|---|
| 声明位置 | **必须**在 `src/routes/.../index.tsx` 或 `layout.tsx` | **任意** `src/*` |
| 作用域 | 路由内 | 全局可调用 |
| URL | 该路由的 `?qaction=...` | `/q-action/...` |
| 典型用途 | 该页面的 form 提交 | 跨页面操作（登出 / 切换主题） |
| 推荐顺序 | **优先用** | 全局逻辑才用 |

<v-click>

```ts
// globalAction$ 示例：登出，任意页面可调
// src/actions/logout.ts
export const useLogout = globalAction$(async (_, { cookie, redirect }) => {
  cookie.delete('session', { path: '/' })
  throw redirect(302, '/login')
})
```

</v-click>

<v-click>

::: tip Form 组件 = 渐进增强
`<Form action={action}>` 无 JS 时走标准表单 POST，有 JS 时拦截成 SPA 提交——一份代码两个场景。
:::

</v-click>

---
transition: slide-up
---

# 路由约定：file-based

```
src/routes/
├── layout.tsx              ← 全局布局
├── index.tsx               ← /
├── about/
│   └── index.tsx           ← /about
├── products/
│   ├── index.tsx           ← /products
│   └── [id]/
│       └── index.tsx       ← /products/:id
├── docs/
│   ├── [...slug]/
│   │   └── index.tsx       ← /docs/* (catch-all)
│   └── layout.tsx          ← /docs/* 局部布局
└── api/
    └── hello/
        └── index.ts        ← API endpoint (GET/POST handler)
```

<v-click>

**特殊文件名**：

| 文件 | 用途 |
|---|---|
| `index.tsx` / `index.mdx` | 页面 |
| `index.ts` | API endpoint（导出 `onGet` / `onPost`） |
| `layout.tsx` | 嵌套布局 + middleware |
| `layout!.tsx` | 跳过父布局 |
| `(group)/` | 不影响 URL 的路由分组 |
| `[param]` / `[...catchAll]` | 动态参数 / catch-all |

</v-click>

---
transition: slide-up
---

# Link / useLocation / useNavigate

```tsx
import { component$ } from '@builder.io/qwik'
import { Link, useLocation, useNavigate } from '@builder.io/qwik-city'

export default component$(() => {
  const loc = useLocation()
  const nav = useNavigate()

  return (
    <div>
      {/* 声明式导航：默认 hover 预取 */}
      <Link href="/about">About</Link>
      <Link href="/heavy" prefetch={false}>Heavy（不预取）</Link>
      <Link href="/login" reload>Login（强刷新）</Link>

      {/* 路由信息 */}
      <p>Path: {loc.url.pathname}</p>
      <p>Param: {loc.params.id}</p>
      <p>Loading: {loc.isNavigating ? 'yes' : 'no'}</p>

      {/* 命令式导航 */}
      <button onClick$={() => nav('/products/1')}>Go</button>
    </div>
  )
})
```

<v-click>

::: tip 预取策略
`<Link>` 默认 hover 时预取目标页 JS chunk——用户点击时基本「秒开」。`prefetch={false}` 关闭、`prefetch="js"` 仅预取 JS。
:::

</v-click>

---
transition: slide-up
---

# 部署：Adapter 体系

```bash
# 一键添加部署适配器
pnpm run qwik add
# 选择目标平台 →
# - Cloudflare Pages / Workers
# - Vercel Edge / Serverless
# - Netlify Edge
# - Node.js Express / Fastify
# - Deno / Bun
# - AWS Lambda
# - Azure Static Web Apps
# - Google Cloud Run / Firebase
# - Static Site Generation
```

<v-click>

```
adapters/cloudflare-pages/vite.config.ts   ← 平台特定 Vite 配置
src/entry.cloudflare-pages.tsx              ← 平台 entry（middleware 包装）
```

</v-click>

<v-click>

**机制**：
- **Adapter**：Vite 配置 + entry 文件，把 Qwik City handler 适配到平台原生 API
- **Middleware**：`requestHandler()` 把平台 Request 转标准 Request，调用 Qwik City handler
- **Cloudflare 例**：entry 导出 `fetch(request, env, ctx)`，内部调 `requestHandler`

</v-click>

---
transition: slide-up
---

# vs Next.js / Nuxt

| 维度 | Qwik 1.x | Next.js 16 | Nuxt 4 |
|---|---|---|---|
| 启动 JS | **~1 KB 常数** | 数十-数百 KB | 数十 KB |
| Hydration | **无（Resumability）** | 渐进式 | 渐进式 |
| 语法 | JSX | JSX | Vue SFC |
| 响应式 | Signals | useState / RSC | ref / reactive |
| 数据加载 | routeLoader$ / server$ | RSC / Server Actions | useFetch / routeRules |
| 文件路由 | `src/routes/` | `app/` | `pages/` / `app/` |
| 渲染策略 | SSR + SSG | RSC + PPR | SSR + SSG + ISR |
| 生态规模 | 小 | **巨大** | 中等 |
| 学习曲线 | 中等（$ 心智） | 高（RSC 心智） | 低 |

<v-click>

**怎么选**：
- **重 SSR、初始 TTI 关键** → Qwik（启动量级跨级别小）
- **React 生态依赖 + 团队熟 RSC** → Next.js
- **Vue 生态偏好** → Nuxt
- **中型电商 / SaaS** → Qwik / Next.js 都可

</v-click>

---
transition: slide-up
---

# vs SvelteKit / Astro / Solid

| 维度 | Qwik | SvelteKit | Astro | SolidStart |
|---|---|---|---|---|
| 核心理念 | Resumability | 编译时优化 | Islands 部分水合 | 细粒度响应式 |
| 默认状态 | 全应用零 Hydration | 全应用 Hydration | 默认静态、组件级 Island | 全应用 Hydration |
| 模板 | JSX | Svelte SFC | `.astro` + 多框架 | JSX |
| 响应式 | Signals | Runes ($state) | 框架自带 | Signals |
| Bundle | **最小** | 极小 | **静态页 0 JS** | 极小 |
| 适合 | 中大型 SSR 应用 | 中型应用 | 内容站 | 中型应用 |

<v-click>

::: tip 三种「减少 JS」思路
- **Astro**：默认 0 JS，按 Island 加（页面驱动）
- **Qwik**：默认全交互，按事件加（用户驱动）
- **Svelte/Solid**：编译期优化，整体小但仍 Hydrate（框架驱动）

各有优势场景——Qwik 优势最明显是**重 SSR + 偶发交互**的大页面。
:::

</v-click>

---
transition: slide-up
---

# 常见陷阱：noSerialize

```ts
import { component$, useStore, noSerialize, useVisibleTask$ } from '@builder.io/qwik'
import type { NoSerialize } from '@builder.io/qwik'

interface State {
  // ❌ 直接放 WebSocket 实例：序列化报错
  // ws?: WebSocket

  // ✅ 用 NoSerialize 包装（运行时实例，不序列化）
  ws?: NoSerialize<WebSocket>
}

export const Chat = component$(() => {
  const state = useStore<State>({ ws: undefined })

  useVisibleTask$(({ cleanup }) => {
    const ws = new WebSocket('wss://...')
    state.ws = noSerialize(ws)   // 标记为「不序列化」
    cleanup(() => ws.close())
  })

  return <div>{state.ws ? 'connected' : 'connecting'}</div>
})
```

<v-click>

**何时用 noSerialize**：
- WebSocket / EventSource 实例
- 第三方库的运行时对象（Chart.js / Leaflet map）
- DOM 元素引用
- 包含函数的对象

**代价**：刷新页面后 `noSerialize` 字段为 `undefined`——必须重新创建。

</v-click>

---
transition: slide-up
---

# 常见陷阱：闭包不能含函数

```ts
component$(() => {
  // ❌ 错误：捕获了函数对象
  const handler = (e: Event) => console.log(e)

  return <button onClick$={handler}>Click</button>
  //                       ^^^^^^^ 序列化失败
})

// ✅ 正确：内联 / 用 $() 包装独立函数
component$(() => {
  return <button onClick$={(e) => console.log(e)}>Click</button>
})

// ✅ 正确：独立 $() 函数（可复用）
import { $ } from '@builder.io/qwik'
const logEvent = $((e: Event) => console.log(e))

component$(() => {
  return <button onClick$={logEvent}>Click</button>
})
```

<v-click>

**核心规则**：
- 闭包捕获的变量必须是 **const + 可 JSON 化**
- 函数对象必须是 **`$()` 包装的 QRL**（编译后是 chunk 引用，不是函数本体）
- 跨组件传递 handler → 提到模块顶层 `export const fn = $(...)` 或 inline

</v-click>

---
transition: slide-up
---

# 常见陷阱：useVisibleTask$ 滥用

```ts
// ❌ 反例：用 useVisibleTask$ 做能用事件 handler 解决的事
component$(() => {
  const open = useSignal(false)

  useVisibleTask$(() => {
    // 用 useVisibleTask 注册点击外部关闭逻辑 → 强制下载 chunk
    document.addEventListener('click', (e) => {
      if (!menuRef.value?.contains(e.target as Node)) open.value = false
    })
  })

  return <div>...</div>
})

// ✅ 正例：用 useOnDocument（仍是 lazy）
import { useOnDocument, $ } from '@builder.io/qwik'

component$(() => {
  const open = useSignal(false)

  useOnDocument('click', $((e) => {
    if (open.value && /* 检查 e.target */) open.value = false
  }))

  return <div>...</div>
})
```

<v-click>

**判定标准**：
- 必须组件 mount 后立刻跑（动画、第三方库初始化）→ `useVisibleTask$`
- 监听事件 → `useOn` / `useOnDocument` / `useOnWindow`
- SSR + 客户端都跑 → `useTask$`

</v-click>

---
transition: slide-up
---

# 常见陷阱：响应式订阅丢失

```ts
// ❌ 解构 store 字段：解构后的值不再响应
component$(() => {
  const state = useStore({ count: 0 })
  const { count } = state   // count 是普通 number，丢失订阅

  return <p>{count}</p>     // 不会响应 state.count 变化
})

// ✅ 直接读字段
component$(() => {
  const state = useStore({ count: 0 })
  return <p>{state.count}</p>   // OK
})

// ❌ 传整个 signal 给子组件做 props
component$(() => {
  const count = useSignal(0)
  return <Child sig={count} />   // ⚠️ Qwik 推荐传 value
})

// ✅ 传 value，子组件按需读
component$(() => {
  const count = useSignal(0)
  return <Child count={count.value} />
})
```

<v-click>

::: warning 与 Vue 的差异
Vue 3 解构 `reactive` 也丢响应（用 `toRefs`）；Qwik 类似但**没有 toRefs**，必须直接读字段。
:::

</v-click>

---
transition: slide-up
---

# 测试：Vitest + Playwright

```bash
# 单测：Vitest（默认）
pnpm add -D vitest @builder.io/qwik/testing

# E2E：Playwright
pnpm add -D @playwright/test
```

```ts
// my-counter.test.tsx
import { createDOM } from '@builder.io/qwik/testing'
import { test, expect } from 'vitest'
import { Counter } from './counter'

test('counter increments', async () => {
  const { screen, render, userEvent } = await createDOM()
  await render(<Counter />)
  expect(screen.outerHTML).toContain('Count: 0')

  await userEvent('button', 'click')
  expect(screen.outerHTML).toContain('Count: 1')
})
```

<v-click>

**E2E 建议**：
- Qwik 应用 SSR 后**不需要等 Hydration**——Playwright `goto` 后立即可点
- 注意 chunk 是 lazy 加载，首次点击可能多 ~100ms 拉 chunk
- `await page.waitForLoadState('networkidle')` 可等所有预取完成

</v-click>

---
transition: slide-up
---

# 性能优化清单

<v-clicks>

- **避免 `useVisibleTask$`** → 优先 `useOn` / 事件 handler
- **预取关键路径**：`<Link prefetch>` 让目标页 chunk 进缓存
- **server$ 大数据**：分页 / streaming（避免 RPC 单次返回 MB 级 JSON）
- **routeLoader$ 数据复用**：同一 layout 下多组件共享 loader 结果，无需重复 fetch
- **图片**：`<Image>` 来自 `qwik-image`，自动响应式 + 懒加载
- **不要全局 useStore**：状态尽量靠近使用组件，减少订阅广播
- **`useStyles$()` 而非 `useStylesScoped$()`** → 全局样式不重复注入
- **生产开 Qwik Insights**：实时分析用户路径，自动 prefetch 预测
- **Bundle 分析**：`pnpm run build.client` + 查看 `dist/build/` 下 chunk 大小

</v-clicks>

---
transition: slide-up
---

# 不适合 Qwik 的场景

<v-clicks>

- **重度客户端 SPA（如 Figma 类工具）** → 所有交互都需要 JS，Resumability 优势削弱
- **极小型纯静态站** → Astro 更轻量、更直接
- **团队完全 React 生态依赖（库 / 组件）** → 兼容层有限，生态差距明显
- **强依赖 React 服务端组件 / Suspense streaming** → Next.js 仍领先
- **招聘市场考虑** → React/Vue/Angular 候选人多一个数量级
- **客户端富交互（拖拽 / 动画 / Canvas）** → 主要瓶颈不在初始 TTI，Qwik 收益有限
- **极端浏览器兼容（IE11）** → Qwik 要求现代浏览器

</v-clicks>

<v-click>

> **经验**：Qwik 最强场景是「**内容驱动 + 偶发交互的中大型 SSR 应用**」——电商、SaaS Dashboard、内容站、Marketing Site。

</v-click>

---
transition: slide-up
---

# 经验法则

<v-clicks>

- **「能不能用 Hydration」是错误问题** → Qwik 已经选了 Resumability，接受心智差异
- **JSX 是 syntax，不是 React** → 不要混用 React 习惯（hooks 调用顺序、useEffect 心智）
- **`$` 后缀是命令，不是装饰** → 每个 `$` 都意味着「拆 chunk + lazy」
- **闭包必须 const + serializable** → 不行就 `noSerialize` 或提到模块顶层
- **`useVisibleTask$` 是最后手段** → 优先 `useOn` / `useTask$` / 事件 handler
- **`server$` 是 RPC 不是 fetch** → 类型自动推导、服务端代码不进客户端
- **routeLoader$ 数据序列化进 HTML** → 客户端不重复 fetch
- **`<Link>` 默认预取** → hover 时下载，点击秒开
- **测试用 `createDOM`** → Qwik 官方 Vitest 工具，比 jsdom 更贴近真实
- **生产前评估生态依赖** → 第三方库不一定有 Qwik 适配版

</v-clicks>

---
transition: slide-up
---

# 下一步学习路径

```
入门
├── 看完 qwik.dev/docs Introduction
├── 写一个 Counter + Todo
└── 理解 useSignal / useStore / $ 后缀

进阶
├── Qwik City 路由 + routeLoader$ + routeAction$
├── server$ RPC 模式
├── 部署到 Cloudflare / Vercel
└── Qwik Insights + 预取策略

实战
├── 重写一个内容站 / Dashboard
├── 集成第三方库（用 noSerialize）
├── 性能 profile + bundle 分析
└── E2E 测试（Playwright）

延伸
├── Qwik 2.0 RC 试用（Signals v2）
├── 阅读 Optimizer 源码
└── Builder.io 可视化编辑器集成
```

<v-click>

**官方资源**：
- 文档：[qwik.dev](https://qwik.dev)
- Tutorial：[qwik.dev/tutorial](https://qwik.dev/tutorial)
- Playground：[qwik.dev/playground](https://qwik.dev/playground)
- Discord：官方社区最活跃

</v-click>

---
layout: center
class: text-center
---

# 总结

适合：内容驱动 SSR 大页面 / 电商 / SaaS / Marketing Site

少做：富交互 SPA / 极小静态站 / React 生态强依赖

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://qwik.dev/" target="_blank">qwik.dev</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/QwikDev/qwik" target="_blank">QwikDev/qwik</a>
</div>

<div class="mt-4">
  <carbon:play /> <a href="https://qwik.dev/playground/" target="_blank">Qwik Playground</a>
</div>
