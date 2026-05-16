---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Solid
info: |
  Presentation Solid 1.9 for frontend developers.

  Learn more at [https://www.solidjs.com](https://www.solidjs.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:solidjs-icon class="text-7xl" />
</div>

<br/>

## Solid 1.9：细粒度响应式 + JSX，无 Virtual DOM

组件只运行一次建立响应式图，状态变化只更新真正订阅的 DOM 节点

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Solid 1.9。

Ryan Carniato 主导的细粒度响应式 UI 库，JSX 与 React 一样，但响应式机制完全不同——组件只跑一次，没有 Virtual DOM。
-->

---
transition: fade-out
---

# 什么是 Solid？

Ryan Carniato 主导的细粒度响应式 JS UI 库，性能业界顶级

<v-click>

- **心智模型纯粹**：组件 = 工厂函数，只运行一次；signals + effects 自动追踪依赖
- **JSX 但无 VDOM**：dom-expressions 编译器把 JSX 直接编译成 DOM 操作
- **细粒度更新**：状态变化只重跑订阅了该信号的 effect / 单个文本节点
- **TypeScript 一流**：Signal / Resource / Store / JSX 全套泛型
- **SolidStart**：官方元框架，文件路由 + Server Functions + 多 adapter
- **Bundle 体积小**：Hello World ~7 KB，生产应用比 React 小 30-50%

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_SolidJS_](https://www.solidjs.com/)

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

优点突出，但生态规模仍是短板

<v-clicks>

**优点**
- 性能业界顶级，JS Framework Benchmark 长期前三
- 心智模型纯粹，无 Hooks Rules / 无依赖数组 / 无 StrictMode 双调用
- JSX 与 React 一致，TypeScript 推导极佳
- 细粒度更新无需手动 memo / Compiler
- SolidStart 与 Next.js / Remix 范式对齐

**缺点**
- 生态规模小，UI 库 / 第三方组件远少于 React / Vue
- 招聘市场小，候选人少一个数量级
- 「响应式心智」需要重学，从 React 来的人踩坑率高
- props 解构丢响应性（头号坑）
- 2.0 在 @solidjs/signals 实验分支，业界等了 1+ 年

</v-clicks>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 关键特性 |
|---|---|---|
| **1.0** | 2021.6 | 首个稳定版，确立 Signals + JSX 范式 |
| **1.3** | 2022.1 | Suspense / Resource 稳定 |
| **1.4** | 2022.5 | createSelector / startTransition |
| **1.5** | 2022.9 | createDeferred、useTransition |
| **1.7** | 2023.5 | 大量 SSR 优化（streaming、islands） |
| **1.8** | 2023.10 | hydration mismatch 修复 |
| **1.9** | 2024.9 | 1.x 收官版，TypeScript / SSR / hydration polishing |
| **2.0** | 开发中 | @solidjs/signals 新核心 / concurrent transitions |

<v-click>

**今天主要讲 1.9 + SolidStart 1.1**。2.0 仍是实验分支，正式生产请用 1.9。

</v-click>

---
transition: slide-up
---

# 心智模型：组件只运行一次

**Solid 的根本差异：组件函数只跑一次，建立响应式图，之后只更新真正订阅了变化信号的 DOM 节点**

```tsx
function Counter() {
  console.log('只打印一次')   // 永远只打 1 次
  const [count, setCount] = createSignal(0)
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count()}      {/* 只这个文本节点更新 */}
    </button>
  )
}
```

<v-click>

对比 React：

| 维度 | Solid | React 19 |
|---|---|---|
| 组件重跑 | **一次** | 每次 state 变化 |
| 状态原语 | `createSignal` | `useState` |
| 响应式 | Signals（自动追踪） | hooks（手动依赖） |
| Virtual DOM | **无** | 有 |
| 更新粒度 | 单个 textnode / 属性 | 整组件函数 |

</v-click>

---
transition: slide-up
---

# 快速开始

```bash
# SolidStart（推荐）：文件路由 + SSR + Server Functions
pnpm create solid

# 极简 Vite + Solid SPA
pnpm create vite@latest my-app -- --template solid-ts

# degit 拉模板
npx degit solidjs/templates/ts my-app

cd my-app && pnpm install && pnpm dev
```

<v-click>

```
my-app/                       # SolidStart 默认结构
├── src/
│   ├── app.tsx               # Router + Suspense
│   ├── entry-client.tsx
│   ├── entry-server.tsx
│   ├── routes/               # 文件路由根
│   │   ├── index.tsx         # /
│   │   ├── about.tsx         # /about
│   │   ├── [id].tsx          # /:id
│   │   └── api/hello.ts      # /api/hello
│   └── components/
├── app.config.ts             # Vinxi 配置
└── package.json
```

</v-click>

<v-click>

要求 Node 18.18+（推荐 20+）。浏览器打开 `http://localhost:3000`。

</v-click>

---
transition: slide-up
---

# 第一个组件

```tsx
import { createSignal } from 'solid-js'

function HelloButton(props: { label: string }) {
  const [count, setCount] = createSignal(0)

  function onClick() {
    setCount(c => c + 1)
  }

  return (
    <button class="hello-btn" onClick={onClick}>
      {props.label} ({count()})
    </button>
  )
}
```

<v-click>

**关键点**：

- 组件 = 返回 JSX 的普通函数，**只跑一次**
- `props.label` 访问 props（不能解构）
- `count()` 是 getter——必须**调用**才响应
- `setCount(c => c + 1)` 函数式更新

</v-click>

---
transition: slide-up
---

# JSX 与 React 的 9 条差异

```tsx
function App() {
  let ref: HTMLDivElement | undefined
  const [active, setActive] = createSignal(true)

  return (
    <div
      ref={ref}                                    /* 5. ref 是赋值 */
      class="card"                                 /* 1. class 不是 className */
      classList={{ active: active() }}             /* 4. 推荐 classList */
      style="color:red"                            /* 3. style 可以是字符串 */
      onClick={() => setActive(a => !a)}           /* 2. 委托事件 */
      on:click={handler}                           /* 6. on: 强制原生事件 */
    >
      <label for="x">Name</label>                  {/* 7. for 不是 htmlFor */}
      <input use:autofocus />                      {/* 8. use: 自定义指令 */}
    </div>
  )
}
```

<v-click>

**第 9 条**：列表用 `<For>` / `<Index>`，条件用 `<Show>` / `<Switch>`，不要用 `.map()` / `&&`。

</v-click>

---
transition: slide-up
---

# Signals 入门：createSignal

```ts
import { createSignal } from 'solid-js'

const [count, setCount] = createSignal(0)

// 读：调用 getter
console.log(count())            // 0

// 写：传新值或函数
setCount(5)                     // count() === 5
setCount(c => c + 1)            // 函数式更新，count() === 6

// 自定义相等性
const [arr, setArr] = createSignal([1, 2, 3], {
  equals: (prev, next) => prev.length === next.length,
})

// 永远更新（即使值相等）
const [tick, setTick] = createSignal(0, { equals: false })
```

<v-click>

**核心机制**：

- `count()` 在 reactive scope（effect / memo / JSX）内调用 → 自动订阅
- `setCount()` 触发所有订阅者重跑
- **不需要依赖数组**——读到什么就追什么

</v-click>

---
transition: slide-up
---

# createMemo：派生缓存值

```ts
import { createMemo, createSignal } from 'solid-js'

const [count, setCount] = createSignal(0)
const [factor, setFactor] = createSignal(2)

// 自动追踪 count + factor
const product = createMemo(() => count() * factor())

// 上次值
const sum = createMemo((prev) => prev + count(), 0)

// 命名 + 自定义相等性
const expensive = createMemo(
  () => doHeavyWork(count()),
  undefined,
  { equals: deepEqual, name: 'expensive' },
)
```

<v-click>

**何时用 createMemo**：

- 派生值复用：多处用同一个计算结果
- 昂贵计算：只有依赖变化才重算
- 维持引用稳定性：传给子组件作 prop，避免不必要订阅

</v-click>

---
transition: slide-up
---

# createEffect：副作用 + 自动清理

```ts
import { createEffect, createSignal, onCleanup } from 'solid-js'

const [count, setCount] = createSignal(0)

createEffect(() => {
  console.log('count =', count())   // 自动订阅
})

// 上次值
createEffect<number>((prev) => {
  console.log(prev, '→', count())
  return count()
}, 0)

// 异步清理
createEffect(() => {
  const id = setInterval(() => console.log(count()), 1000)
  onCleanup(() => clearInterval(id))
})
```

<v-click>

**与 React useEffect 三大差异**：

- 无依赖数组——自动追踪
- 立即同步执行首次（不在 commit 后）
- 清理函数用 `onCleanup`（可任意层调用）

</v-click>

---
transition: slide-up
---

# createResource：异步资源

```tsx
import { createResource, Suspense, ErrorBoundary, For } from 'solid-js'

const [userId, setUserId] = createSignal(1)

// source 是 reactive trigger；fetcher 返回 Promise
const [posts] = createResource(userId, async (id) => {
  const res = await fetch(`/api/users/${id}/posts`)
  if (!res.ok) throw new Error('Failed')
  return res.json()
})

// 状态字段
posts()             // 当前值
posts.loading       // boolean
posts.error         // Error | undefined
posts.state         // 'unresolved' | 'pending' | 'ready' | 'refreshing' | 'errored'
posts.latest        // 最后一次成功值（refresh 期间不闪烁）
```

<v-click>

**与 Suspense 自动集成**：

```tsx
<Suspense fallback={<Loading />}>
  <For each={posts()}>{(post) => <li>{post.title}</li>}</For>
</Suspense>
```

</v-click>

---
transition: slide-up
---

# Props：访问，不要解构

```tsx
// ❌ 解构丢响应性
function Greet(props: { name: string }) {
  const { name } = props        // name 永远是初始值
  return <p>Hello {name}</p>    // 不更新
}

// ✅ 访问 props.xxx
function Greet(props: { name: string }) {
  return <p>Hello {props.name}</p>   // 响应式
}
```

<v-click>

**多 props 用 splitProps / mergeProps**：

```tsx
import { splitProps, mergeProps } from 'solid-js'

function Btn(props: ButtonProps) {
  // 拆分：本地用的 + 透传给原生标签
  const [local, others] = splitProps(props, ['label', 'variant'])

  // 默认值
  const merged = mergeProps({ variant: 'primary' as const }, local)

  return <button {...others} class={`btn-${merged.variant}`}>{merged.label}</button>
}
```

</v-click>

---
transition: slide-up
---

# Stores：嵌套响应式

```tsx
import { createStore, produce } from 'solid-js/store'

const [state, setState] = createStore({
  filter: 'all',
  todos: [
    { id: 1, text: 'Learn Solid', done: false },
    { id: 2, text: 'Build app', done: false },
  ],
})

// 读：直接 state.xxx（嵌套 Proxy）
console.log(state.todos[0].text)

// 写：path-based setStore
setState('filter', 'active')
setState('todos', 0, 'done', true)               // todos[0].done = true
setState('todos', t => t.id === 1, 'text', 'X')  // 谓词
setState('todos', {}, 'done', true)              // 全部

// produce：Immer 风格
setState(produce((draft) => {
  draft.filter = 'done'
  draft.todos.push({ id: 3, text: 'New', done: false })
}))
```

---
transition: slide-up
---

# Store 工具：reconcile / unwrap / createMutable

```ts
import { reconcile, unwrap, createMutable } from 'solid-js/store'

// reconcile：差异化替换，保留引用稳定性
const fresh = await fetch('/api/todos').then(r => r.json())
setState('todos', reconcile(fresh, { key: 'id' }))

// unwrap：取出非 Proxy 对象（JSON / 第三方库）
const raw = unwrap(state)
console.log(JSON.stringify(raw))

// createMutable：完全可变（不用 setter）
const counter = createMutable({ count: 0 })
counter.count++                  // 直接改
```

<v-click>

::: warning createMutable 与 createStore
- **createStore + setStore**：可控、可追踪、推荐跨组件全局状态
- **createMutable**：单组件局部 / 与第三方库集成；不推荐跨组件
:::

</v-click>

---
transition: slide-up
---

# 控制流：&lt;Show&gt;

```tsx
import { Show } from 'solid-js'

// 基础
<Show when={user()} fallback={<Spinner />}>
  <UserCard />
</Show>

// keyed：when 变化时子树完全重建
<Show when={user()} keyed>
  {(user) => <UserCard user={user} />}
</Show>

// 默认（非 keyed）：when 变化保持子树
<Show when={user()}>
  <UserCard user={user()!} />
</Show>
```

<v-click>

::: warning 不要用 cond && <Comp/>
`&&` 在 false → true 切换时不会真正注册到响应式图，可能不更新。**用 `<Show>` 是 Solid 的强约定**。
:::

</v-click>

---
transition: slide-up
---

# 控制流：&lt;For&gt; vs &lt;Index&gt;

```tsx
import { For, Index } from 'solid-js'

// <For>：按对象身份（id）复用 DOM
<For each={todos()} fallback={<p>暂无</p>}>
  {(todo, index) => (
    <li>#{index()} - {todo.title}</li>     {/* index 是 accessor */}
  )}
</For>

// <Index>：按位置复用，item 是 accessor
<Index each={frames()}>
  {(frame, index) => (
    <span data-i={index}>{frame()}</span>  {/* frame 是 accessor */}
  )}
</Index>
```

<v-click>

| 维度 | `<For>` | `<Index>` |
|---|---|---|
| 映射依据 | 数组元素**引用** | 数组**位置（index）** |
| 元素 | 静态值 | accessor `() => T` |
| index | accessor | 普通 number |
| 适合 | 列表项有稳定 id | 固定长度 / 替换值 |

</v-click>

---
transition: slide-up
---

# 控制流：&lt;Switch&gt; + &lt;Match&gt;

```tsx
import { Switch, Match, createSignal } from 'solid-js'

const [status, setStatus] = createSignal<'loading' | 'success' | 'error'>('loading')

<Switch fallback={<p>未知状态</p>}>
  <Match when={status() === 'loading'}>
    <Spinner />
  </Match>
  <Match when={status() === 'success'} keyed>
    {(data) => <SuccessView data={data} />}    {/* keyed: when 值传入 */}
  </Match>
  <Match when={status() === 'error'}>
    <ErrorView />
  </Match>
</Switch>
```

<v-click>

适合：状态机渲染、多分支条件。比 if-else-if 链清晰，比三元嵌套可读。

</v-click>

---
transition: slide-up
---

# 控制流：&lt;Dynamic&gt;

动态组件 / 动态 HTML 标签：

```tsx
import { Dynamic } from 'solid-js/web'

const tag = () => isLink() ? 'a' : 'button'

<Dynamic
  component={tag()}
  href={isLink() ? '/home' : undefined}
  onClick={isLink() ? undefined : handleClick}
>
  Click me
</Dynamic>

// 也可以是函数组件
const View = () => isLoggedIn() ? UserView : GuestView
<Dynamic component={View()} {...props} />
```

<v-click>

适合：

- 标签名动态（`<h1>` / `<h2>` / `<h3>`）
- 多个组件之间切换（无需 if-else 包裹）

</v-click>

---
transition: slide-up
---

# 控制流：&lt;Portal&gt;

跳出 DOM 层级（Modal / Toast / Tooltip）：

```tsx
import { Portal } from 'solid-js/web'

function Modal(props: { open: boolean; onClose: () => void }) {
  return (
    <Show when={props.open}>
      <Portal mount={document.body}>
        <div class="modal-overlay" onClick={props.onClose}>
          <div class="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Modal Title</h2>
            <button onClick={props.onClose}>Close</button>
          </div>
        </div>
      </Portal>
    </Show>
  )
}
```

<v-click>

**关键 props**：

- `mount`：挂载到哪个 DOM（默认 `document.body`）
- `useShadow`：用 Shadow DOM 包裹
- `isSVG`：渲染到 SVG 上下文

</v-click>

---
transition: slide-up
---

# 控制流：&lt;ErrorBoundary&gt; + &lt;Suspense&gt;

```tsx
import { ErrorBoundary, Suspense, createResource, For } from 'solid-js'

function PostList() {
  const [posts] = createResource(async () => {
    const res = await fetch('/api/posts')
    if (!res.ok) throw new Error('Failed')
    return res.json()
  })

  return (
    <ErrorBoundary fallback={(err, reset) => (
      <div>
        Error: {err.message}
        <button onClick={reset}>Retry</button>
      </div>
    )}>
      <Suspense fallback={<Spinner />}>
        <For each={posts()}>
          {(post) => <li>{post.title}</li>}
        </For>
      </Suspense>
    </ErrorBoundary>
  )
}
```

<v-click>

**习惯：外层 ErrorBoundary 内层 Suspense**——错误优先于加载。

</v-click>

---
transition: slide-up
---

# 生命周期：只有两个

```tsx
import { onMount, onCleanup } from 'solid-js'

function Component() {
  onMount(() => {
    // 首次渲染后跑一次（client only），可访问 DOM
    console.log('mounted')
  })

  onCleanup(() => {
    // scope 销毁时跑
    console.log('unmounted')
  })

  return <div>Hello</div>
}
```

<v-click>

**没有 onUpdated**——更新由 effect 自动追踪：

```tsx
// React: useEffect(() => { ... }, [count])
// Solid 等价：
createEffect(() => {
  console.log('count changed to', count())
})

// 跳过首次执行
import { on, createEffect } from 'solid-js'
createEffect(on(count, (c, prev) => {
  console.log(prev, '→', c)
}, { defer: true }))
```

</v-click>

---
transition: slide-up
---

# Context API

```tsx
import { createContext, useContext, createSignal, JSX } from 'solid-js'

interface Theme {
  mode: 'light' | 'dark'
  toggle: () => void
}

const ThemeContext = createContext<Theme>()

export function ThemeProvider(props: { children: JSX.Element }) {
  const [mode, setMode] = createSignal<'light' | 'dark'>('light')
  const value: Theme = {
    get mode() { return mode() },       // getter 保持响应性
    toggle: () => setMode(m => m === 'light' ? 'dark' : 'light'),
  }
  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside <ThemeProvider>')
  return ctx
}
```

---
transition: slide-up
---

# ref：赋值不是 useRef

```tsx
import { onMount } from 'solid-js'

function FocusInput() {
  let inputRef: HTMLInputElement | undefined

  onMount(() => {
    inputRef?.focus()
  })

  return <input ref={inputRef} />
}

// 回调形式（更灵活）
function FocusInput2() {
  return (
    <input ref={(el) => {
      onMount(() => el.focus())
    }} />
  )
}
```

<v-click>

**关键差异**：

- Solid 在编译时把 `ref={inputRef}` 改写成 `(val) => inputRef = val`
- 赋值发生在 **DOM 节点插入文档之前**——`onMount` 之前 ref 已经有值
- 不是 React 的 `useRef`——Solid 的 ref 就是普通变量

</v-click>

---
transition: slide-up
---

# 自定义指令：use:

```tsx
import { onCleanup } from 'solid-js'

function clickOutside(el: HTMLElement, accessor: () => () => void) {
  const onClick = (e: MouseEvent) => {
    if (!el.contains(e.target as Node)) accessor()()
  }
  document.body.addEventListener('click', onClick)
  onCleanup(() => document.body.removeEventListener('click', onClick))
}

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      clickOutside: () => void
    }
  }
}

// 使用
<div use:clickOutside={() => setOpen(false)}>Menu</div>
```

<v-click>

**use: 限制**：必须是**静态名**——编译器扫描 JSX 时识别 directive 名字，不能 `use:[dynamic]`。

</v-click>

---
transition: slide-up
---

# SolidStart：文件路由

```
src/routes/
├── index.tsx                 # /
├── about.tsx                 # /about
├── users/
│   ├── index.tsx             # /users
│   └── [id].tsx              # /users/:id
├── blog/
│   └── [...slug].tsx         # /blog/* （catch-all）
├── (auth)/                   # 路由分组（不影响 URL）
│   ├── login.tsx             # /login
│   └── signup.tsx            # /signup
└── api/
    └── hello.ts              # /api/hello（API 路由）
```

```tsx
// src/routes/users/[id].tsx
import { useParams } from '@solidjs/router'

export default function UserDetail() {
  const params = useParams<{ id: string }>()
  return <h1>User {params.id}</h1>
}
```

---
transition: slide-up
---

# SolidStart：Server Functions

`'use server'` 指令把函数变成只在服务端执行：

```tsx
import { query, action, createAsync } from '@solidjs/router'

// query：读
const getUser = query(async (id: string) => {
  'use server'
  return db.user.findUnique({ where: { id } })
}, 'user')

// action：写
const updateUser = action(async (formData: FormData) => {
  'use server'
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  await db.user.update({ where: { id }, data: { name } })
})
```

<v-click>

**客户端代码不会包含 db 调用** —— SolidStart 把 `'use server'` 函数编译成 fetch + server endpoint。

</v-click>

---
transition: slide-up
---

# SolidStart：表单 + Action

```tsx
import { query, action, createAsync } from '@solidjs/router'

const updateUser = action(async (formData: FormData) => {
  'use server'
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  await db.user.update({ where: { id }, data: { name } })
})

export default function UserDetail(props: { params: { id: string } }) {
  const user = createAsync(() => getUser(props.params.id))

  return (
    <Show when={user()}>
      <form action={updateUser} method="post">
        <input type="hidden" name="id" value={user()!.id} />
        <input name="name" value={user()!.name} />
        <button type="submit">Save</button>
      </form>
    </Show>
  )
}
```

<v-click>

`<form action={updateUser}>` 把表单 submit 直接对接 server function。**渐进增强**——禁用 JS 也能工作。

</v-click>

---
transition: slide-up
---

# SolidStart：API 路由

```ts
// src/routes/api/users/[id].ts
import { APIEvent } from '@solidjs/start/server'

export async function GET({ params }: APIEvent) {
  return { id: params.id, name: 'Alice' }
}

export async function POST({ request, params }: APIEvent) {
  const body = await request.json()
  return new Response(JSON.stringify(body), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function DELETE({ params }: APIEvent) {
  await db.user.delete({ where: { id: params.id } })
  return new Response(null, { status: 204 })
}
```

<v-click>

文件导出 `GET` / `POST` / `PUT` / `PATCH` / `DELETE` 函数，对应 HTTP 方法。

</v-click>

---
transition: slide-up
---

# SolidStart：流式 SSR

```tsx
// src/routes/index.tsx
export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />          {/* createResource fetch */}
      </Suspense>
    </>
  )
}
```

<v-click>

**流式响应**：

1. 服务器立即发送 `<h1>Home</h1>` + `<Skeleton/>` HTML
2. `SlowComponent` 数据 ready 后，再发一段 `<template>` + 内联脚本替换 Skeleton
3. 浏览器边接收边渲染——**首屏不阻塞**

</v-click>

<v-click>

::: tip 与 React Suspense 的对比
Solid 流式 SSR 在 1.7 已稳定，且**自动开启**——不需要像 React Server Components 那样区分 RSC / Client Component。
:::

</v-click>

---
transition: slide-up
---

# SolidStart：Adapter 部署

```ts
// app.config.ts
import { defineConfig } from '@solidjs/start/config'

export default defineConfig({
  server: {
    preset: 'vercel',    // 或 'netlify' / 'cloudflare-pages' /
                         // 'node-server' / 'bun' / 'deno' / 'static'
  },
})
```

```bash
pnpm build               # 生成对应平台的产物
```

<v-click>

**支持 Nitro 全部 preset**：

- **Vercel** / **Netlify** / **Cloudflare Pages**
- **Node** / **Bun** / **Deno**
- **AWS Lambda** / **Azure Static Web Apps**
- **静态站点 (static)**

</v-click>

---
transition: slide-up
---

# Solid Router

```tsx
import { Router, Route } from '@solidjs/router'
import { render } from 'solid-js/web'

const Home = () => <h1>Home</h1>
const About = () => <h1>About</h1>
const User = () => <h1>User Detail</h1>

render(
  () => (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/users/:id" component={User} />
    </Router>
  ),
  document.getElementById('root')!,
)
```

<v-click>

**核心 API**：`<A>` / `<Navigate>` / `useNavigate()` / `useParams()` / `useSearchParams()` / `useLocation()`。

</v-click>

---
transition: slide-up
---

# Router：参数 + 导航

```tsx
import { A, useNavigate, useParams, useSearchParams, useLocation } from '@solidjs/router'

function Nav() {
  const navigate = useNavigate()
  return (
    <nav>
      <A href="/" end>Home</A>                              {/* end → 严格匹配 */}
      <A href="/about" activeClass="active">About</A>
      <button onClick={() => navigate('/about', { replace: true })}>
        Go About
      </button>
    </nav>
  )
}

function UserDetail() {
  const params = useParams<{ id: string }>()
  const [search, setSearch] = useSearchParams<{ tab?: string }>()
  const location = useLocation()

  return (
    <>
      <h1>User {params.id}</h1>
      <p>Tab: {search.tab}</p>
      <button onClick={() => setSearch({ tab: 'posts' })}>Posts</button>
    </>
  )
}
```

---
transition: slide-up
---

# Router：嵌套 + Lazy

```tsx
import { lazy } from 'solid-js'

const About = lazy(() => import('./About'))

<Router>
  <Route path="/" component={Layout}>
    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/users/:id" component={User}>
      <Route path="/" component={UserOverview} />
      <Route path="/posts" component={UserPosts} />
    </Route>
  </Route>
</Router>

function Layout(props) {
  return (
    <>
      <Nav />
      <main>{props.children}</main>
    </>
  )
}
```

<v-click>

`lazy` 自动配合外层 `<Suspense>`——路由切换时等 chunk 加载完成。

</v-click>

---
transition: slide-up
---

# TypeScript 集成

```tsx
import type { Component, ParentComponent, ParentProps, JSX } from 'solid-js'

// 不接收 children
const Avatar: Component<{ url: string }> = (props) => <img src={props.url} />

// 接收 children
const Card: ParentComponent<{ title: string }> = (props) => (
  <div>
    <h2>{props.title}</h2>
    {props.children}
  </div>
)

// 等价写法
function Card2(props: ParentProps<{ title: string }>) {
  return <div>{props.children}</div>
}

// 事件
const onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
  console.log(e.currentTarget.disabled)
}
```

---
transition: slide-up
---

# TS 工具类型表

| 类型 | 用途 |
|---|---|
| `Accessor<T>` | `() => T`（signal getter） |
| `Setter<T>` | signal setter |
| `Signal<T>` | `[Accessor<T>, Setter<T>]` 元组 |
| `Component<P>` | 函数组件 |
| `ParentComponent<P>` | 接收 children 的组件 |
| `FlowComponent<P, T>` | children 是函数 |
| `ParentProps<P>` | 给 P 加 children: JSX.Element |
| `Resource<T>` | `() => T` + loading/error/state |
| `JSX.Element` | JSX 表达式合法类型 |
| `JSX.HTMLAttributes<T>` | 原生 HTML 属性 |
| `JSX.EventHandler<E, Ev>` | 类型化事件 |

---
transition: slide-up
---

# 编译器：dom-expressions

Solid 用 babel-preset-solid 把 JSX 编译成直接 DOM 操作：

```tsx
// 源码
function App() {
  const [count, setCount] = createSignal(0)
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count()}
    </button>
  )
}

// 编译后（简化）
const _tmpl$ = template(`<button>Count: `)

function App() {
  const [count, setCount] = createSignal(0)
  return (() => {
    const _el$ = _tmpl$.cloneNode(true)
    _el$.$$click = () => setCount(c => c + 1)
    insert(_el$, count, null)    // 只更新 count() 文本节点
    return _el$
  })()
}
```

<v-click>

**关键优化**：静态 HTML 模板提到顶层 → cloneNode 复用 → 细粒度更新点 → 事件委托 → 无 vnode diff。

</v-click>

---
transition: slide-up
---

# vs React Compiler

| 维度 | React Compiler（RC） | Solid Compiler |
|---|---|---|
| 范围 | 自动 memo `useMemo` / `useCallback` | JSX → DOM 操作 |
| 输入 | JSX + Hooks | JSX + Signals |
| 输出 | 优化后的 React 函数 | DOM 模板 + insert 调用 |
| 心智 | 修复 React 性能心智 | 从头设计无重渲染 |
| 状态 | RC 阶段 + ESLint 规则 | 稳定 6+ 年，标配 |

<v-click>

::: tip Solid 没有「需要 Compiler 才优秀」
React Compiler 是为了**补救** Hooks 时代的 memo 心智负担。Solid 一开始就把这件事编译掉了——无需任何手动优化。
:::

</v-click>

---
transition: slide-up
---

# 性能优化清单

<v-clicks>

- **优先 `<For>` / `<Index>`** → 不要用 `.map`，前者细粒度
- **优先 `<Show>` / `<Switch>`** → 不要用 `&&` / 三元
- **`createMemo` 缓存昂贵计算** → 多处复用 / 派生值
- **避免 props 解构** → 用 `splitProps` 透传
- **大列表虚拟滚动** → @tanstack/solid-virtual
- **lazy 路由 + Suspense** → 分 chunk 按需加载
- **Server Functions 替代 client fetch** → SolidStart SSR 时数据已就绪
- **`shallow` store** → 大数据用 `createMutable` 显式控制

</v-clicks>

```tsx
// 例：lazy + Suspense
import { lazy, Suspense } from 'solid-js'
const Dashboard = lazy(() => import('./Dashboard'))

<Suspense fallback={<Skeleton />}>
  <Dashboard />
</Suspense>
```

---
transition: slide-up
---

# 测试：Vitest + @solidjs/testing-library

```bash
pnpm add -D vitest @solidjs/testing-library jsdom @testing-library/jest-dom
```

```ts
// vitest.config.ts
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: { conditions: ['development', 'browser'] },
})
```

```tsx
// Counter.test.tsx
import { render, fireEvent, screen } from '@solidjs/testing-library'

it('increments on click', () => {
  render(() => <Counter />)         // 必须传函数！
  fireEvent.click(screen.getByRole('button', { name: /increment/i }))
  expect(screen.getByTestId('count')).toHaveTextContent('1')
})
```

---
transition: slide-up
---

# vs React

| 维度 | Solid 1.9 | React 19 |
|---|---|---|
| 组件重跑 | **一次** | 每次 state 变化 |
| 响应式 | Signals（细粒度） | hooks + reconcile |
| 状态原语 | `createSignal` | `useState` |
| 派生 | `createMemo` | `useMemo`（Compiler 后自动） |
| 异步 | `createResource` | `use(promise)` / RSC |
| Memoization | 内置 | 需 React.memo / Compiler |
| Virtual DOM | **无** | 有（Fiber） |
| Bundle | ~7 KB | ~45 KB |
| 性能 | 顶级 | 中（Compiler 后接近 Solid） |
| 生态 | 小 | 最大 |
| 元框架 | SolidStart | Next.js / Remix |

<v-click>

> 团队主语言决定 80%——掌握 React JSX → 学 Solid 心智迁移更顺畅。

</v-click>

---
transition: slide-up
---

# vs Vue

| 维度 | Solid 1.9 | Vue 3.5 |
|---|---|---|
| 模板 | JSX | SFC 模板 |
| 响应式 | Signals（函数式） | Proxy（对象式） |
| 编译策略 | JSX → DOM 操作 | 模板 → vnode + patchFlag |
| Virtual DOM | **无** | 有（小核） |
| 状态原语 | `createSignal` getter | `ref().value` |
| 派生 | `createMemo` | `computed` |
| 副作用 | `createEffect` | `watchEffect` |
| 学习曲线 | 中等（要换思维） | 平缓 |

<v-click>

- **Solid**：React 经验 + JSX 偏好 + 性能至上
- **Vue**：HTML / SFC 偏好 + 国内招聘 + 渐进式

</v-click>

---
transition: slide-up
---

# vs Svelte

| 维度 | Solid | Svelte 5 |
|---|---|---|
| 模板 | JSX | `.svelte` SFC |
| 编译策略 | JSX → DOM 操作 | SFC → 极薄运行时 |
| 响应式 | Signals（运行时 + 编译辅助） | Runes（编译时） |
| Virtual DOM | **无** | **无** |
| 体积 | ~7 KB | ~5 KB |
| 元框架 | SolidStart | SvelteKit |
| 心智契合度 | React 思维 | HTML + 编译魔法 |

<v-click>

**怎么选**：

- **Solid**：React JSX 偏好、性能至上
- **Svelte**：HTML 偏好、体积最小、SvelteKit 文档好

</v-click>

---
transition: slide-up
---

# 常见陷阱速查

<v-clicks>

- **解构 props 失去响应性** → 用 `props.xxx` 或 `splitProps`
- **忘加 `()`** → 模板里 `{count}` 是 getter，必须 `{count()}` 才响应
- **`{cond && <Comp/>}` 不更新** → 用 `<Show when={cond()}>`
- **`.map()` 不细粒度** → 用 `<For>` / `<Index>`
- **`createEffect` 内同步 setSignal 自己 → 死循环** → 用 `untrack` 或 `createRenderEffect`
- **`createStore` 替换整体** → 用 `reconcile`，不要 `setState(fresh)`
- **`onMount` 不在 SSR 跑** → 仅 client 端跑
- **`use:directive` 必须静态名** → 不能 `use:[dynamic]`
- **测试 render 必须传函数** → `render(() => <X/>)` 不是 `render(<X/>)`

</v-clicks>

---
transition: slide-up
---

# 开发者工具：solid-devtools

```bash
pnpm add -D solid-devtools
```

```ts
// vite.config.ts
import devtools from 'solid-devtools/vite'

export default defineConfig({
  plugins: [
    devtools({ autoname: true }),
    solid(),
  ],
})
```

```ts
import 'solid-devtools'    // src/index.tsx 引入即生效
```

<v-clicks>

启动 dev server 后，浏览器扩展面板会显示：

- **Components**：组件树 + props
- **Signals**：所有 signal 值 + 订阅关系
- **Owners**：reactive owner 层级（调试内存泄漏）
- **Locator**：点元素跳源码

</v-clicks>

---
transition: slide-up
---

# 不要选 Solid 的场景

<v-clicks>

- **团队全是 React 老手 + 依赖 React 生态某 SDK** → 切换成本高
- **企业级中后台**（依赖 Ant Design / Element Plus） → Solid UI 库覆盖度不够
- **React Native 跨端需求** → solid-native 远不如 React Native 成熟
- **招聘大量人** → 候选人少，培训成本高
- **追求最稳定元框架** → Next.js 15 + RSC 仍领先 SolidStart
- **要 RSC + Edge Streaming 等最前沿特性** → React 19 / Next.js 走得更前

</v-clicks>

<v-click>

> **经验**：新项目 + 中小型 + 性能敏感 + 团队中立 → Solid 是优秀选择。

</v-click>

---
transition: slide-up
---

# 经验法则

<v-clicks>

- **小 / 中型项目 + 性能敏感** → Solid 是优秀选择
- **掌握 React JSX 经验** → 学 Solid 心智迁移最顺畅
- **不要解构 props** → Solid 的「头号坑」
- **优先用 `<Show>` / `<For>` / `<Switch>`** → 不要用 `&&` / `.map()`
- **`createStore` + `produce`** → 嵌套状态首选
- **SolidStart 用 `'use server'`** → 数据获取标准范式
- **2.0 别押注** → 仍在实验分支，正式生产用 1.9
- **测试用 `@solidjs/testing-library`** → 不要直接用 React Testing Library

</v-clicks>

---
layout: center
class: text-center
---

# 总结

适合：性能敏感的中小型应用 / SolidStart 全栈 / 已熟悉 React JSX 的团队

少做：纯 React 重生态 / 企业中后台 / 大团队招聘场景

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://www.solidjs.com/" target="_blank">solidjs.com</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/solidjs/solid" target="_blank">solidjs/solid</a>
</div>

<div class="mt-4">
  <carbon:play /> <a href="https://playground.solidjs.com/" target="_blank">Solid Playground</a>
</div>
