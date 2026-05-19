---
theme: seriph
background: https://cover.sli.dev
title: Welcome to React 19
info: |
  Presentation React 19 for frontend developers.

  Learn more at [https://react.dev](https://react.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:react class="text-7xl" />
</div>

<br/>

## React 19：Server Components + Actions + Compiler

UI = f(state) 的纯函数模型，搭配 RSC 和 Compiler 进入全栈 + 自动 memo 时代

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 React 19。

Meta 主导的声明式 UI 库，把 UI 写成 f(state) => view 的纯函数。React 19 (2024.12 稳定) 引入 Server Components、Actions、use API、ref as prop、文档元数据原生支持等大批面向「全栈 React」的特性；同时配套的 React Compiler 进入 RC 阶段，自动 memoization 让 useMemo / useCallback 多数情况下不再必要。
-->

---
transition: fade-out
---

# 什么是 React？

Meta 开源的声明式 UI 库，把 UI 写成 `f(state) => view` 的纯函数

<v-click>

- **心智模型最纯粹**：UI = f(state)，没有指令、没有模板编译器；JSX 就是 JavaScript
- **生态体量最大**：MUI / Ant Design / Chakra / Mantine / shadcn 等每个赛道 5-10 个成熟方案
- **元框架繁荣**：Next.js 工业标准 + Remix（已并入 React Router v7）+ TanStack Start
- **跨端复用**：React Native / Expo / Tamagui 一套覆盖 iOS / Android / Web
- **招聘市场最大**：候选人比 Vue / Angular 多一个数量级
- **React 19 + Compiler 跃迁**：RSC 让数据获取下沉，Compiler 自动 memo
- **官方文档质量高**：react.dev 重写后是行业标杆

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_React_](https://react.dev/)

</div>

<style>
h1 {
  background-color: #61DAFB;
  background-image: linear-gradient(45deg, #61DAFB 10%, #20232A 90%);
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

优点压倒缺点，但「Library 不是 Framework」要正视

<v-clicks>

**优点**
- 纯函数心智模型，调试栈干净，JSX 就是 JS
- 生态最大：UI / 状态 / 数据 / 路由每赛道都多选
- React 19 + Compiler 双跃迁，性能心智负担降到接近 Solid / Vue
- 招聘市场最广，全球候选人多一个数量级

**缺点**
- 学习曲线分裂：Hooks + RSC + Compiler 三套并存
- Library 非 Framework：路由 / SSR / 表单要自己选
- Hooks Rules 心智负担：依赖数组、闭包陷阱
- RSC 复杂度高，`'use client'` 边界容易写错

</v-clicks>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 关键特性 |
|---|---|---|
| **16.8** | 2019.2 | **Hooks** 稳定 |
| **18** | 2022.3 | Concurrent、Auto Batching |
| **19** | 2024.12 | **RSC / Actions / use / ref as prop** |
| **Compiler** | 2024.10 | 自动 memoization，2025 RC |

---
transition: slide-up
---

# 心智模型：一句话总结

**UI 是 state 的纯函数，组件函数同样输入永远同样输出**

```
state 变化 → setState / dispatch
  ↓ Scheduler 入队 (Lane 优先级)
Reconciler 在 workInProgress 树 diff
  ↓ Commit: Before Mutation → Mutation → Layout
useEffect (paint 后异步调度)
```

<v-click>

对比 Vue：

| 维度 | React 19 | Vue 3.5 |
|---|---|---|
| 模板 | JSX + 全运行时 | SFC + 编译优化 |
| 响应式 | useState + 手动依赖 | Proxy 自动追踪 |
| 更新粒度 | 整组件函数重跑 | patchFlag 动态部分 |
| Server Component | 一等公民 | 暂无 |

</v-click>

---
transition: slide-up
---

# 与 Vue 心智差异

<v-clicks>

- **Vue 改 state**：`count.value++`，Proxy 自动追踪依赖，模板内的 `{{ count }}` 自动更新
- **React 改 state**：`setCount(c => c + 1)`，整个组件函数重跑，React diff 出变化
- **Vue 没有「依赖数组」**：Composition API 用 watch 显式指定，watchEffect 自动收集
- **React 有「依赖数组」**：useEffect / useMemo / useCallback 必须列依赖
- **Vue 局部更新**：编译时已标记 patchFlag，只 diff 动态部分
- **React 整组件 re-render**：靠 Compiler / React.memo / useMemo 跳过
- **Vue Composables**：内部状态用 ref，写成 `useXxx()`
- **React Custom Hook**：内部状态用 useState，写成 `useXxx()`（命名几乎一致）

</v-clicks>

---
transition: slide-up
---

# 快速开始：4 种推荐路径

```bash
# 推荐 A：Vite + React（SPA，最快起点）
pnpm create vite@latest my-app -- --template react-ts

# 推荐 B：Next.js（全栈 SSR / RSC，工业标准）
pnpm create next-app@latest

# 推荐 C：TanStack Start（类型最强全栈）
pnpm create tanstack-app@latest my-app

# 推荐 D：React Router v7（Remix 合并版）
pnpm create react-router@latest my-app
```

<v-click>

> 💡 **起步用元框架，不要从零拼**
>
> Next.js / Remix 已经替你选好了路由 / SSR / 数据获取的合理默认；新项目第一周省下选型时间。

</v-click>

<v-click>

要求 Node 20.19+ / 22.12+（Vite 7）。HMR 默认开启，浏览器打开 `http://localhost:5173`（Next.js 是 3000）。

</v-click>

---
transition: slide-up
---

# 项目结构

```
my-app/                      # Vite SPA
├── public/                  # 不经 bundler 的静态资源
├── src/
│   ├── App.tsx
│   ├── main.tsx             # createRoot + render
│   └── index.css
└── vite.config.ts
```

<v-click>

**Next.js App Router**（推荐 SSR / RSC）：

```
src/app/
├── layout.tsx       # 根 Layout
├── page.tsx         # /
├── api/route.ts     # API 路由
├── loading.tsx      # Suspense fallback
└── error.tsx        # Error Boundary
```

约定：`page.tsx` / `layout.tsx` / `loading.tsx` / `error.tsx` / `route.ts`

</v-click>

---
transition: slide-up
---

# JSX 基础

JSX 是 JavaScript 的语法扩展，写起来像 HTML、跑起来是 JavaScript：

```tsx
// JSX 写法
const element = <h1 className="title">Hello, {name}!</h1>

// 编译后（React 17+ 新 JSX Transform）
import { jsx as _jsx } from 'react/jsx-runtime'
const element = _jsx('h1', { className: 'title', children: ['Hello, ', name, '!'] })
```

<v-click>

**JSX 规则**：

1. 必须只有一个根节点 → `<></>` Fragment 包裹
2. 必须闭合标签 → `<img />`、`<br />`
3. 属性 camelCase → `className`、`htmlFor`、`onClick`
4. `{}` 嵌入 JS 表达式；`style` 是对象 `style={{ color: 'red' }}`
5. 大小写敏感：首字母大写当组件，小写当 HTML 标签

</v-click>

---
transition: slide-up
---

# 第一个函数组件

```tsx
// 函数声明
function Welcome(props: { name: string }) {
  return <h1>Hello, {props.name}!</h1>
}

// 箭头函数 + 解构 props（更常见）
const Welcome = ({ name }: { name: string }) => <h1>Hello, {name}!</h1>
```

<v-click>

**Class 组件已不推荐**——所有新特性围绕函数组件 + Hooks：

```tsx
class Welcome extends React.Component<{ name: string }> {
  render() { return <h1>Hello, {this.props.name}!</h1> }
}
```

> 💡 Suspense / Concurrent / RSC / Compiler 都只支持函数组件。

</v-click>

---
transition: slide-up
---

# `useState` —— 组件状态

```tsx
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>+1</button>
}
```

返回 `[state, setState]` / setState 触发整组件重渲染 / 连续更新用函数式避免闭包过期值。

<v-click>

**对象 / 数组要不可变更新**：

```tsx
// ❌ 直接修改：引用没变，React 不更新
user.name = 'Bob'; setUser(user)

// ✅ 新对象 / 新数组
setUser({ ...user, name: 'Bob' })
setList(list.map(x => x.id === id ? { ...x, done: true } : x))
```

**复杂状态用 Immer**：`useImmer(draft => { draft.x.y = ... })` 看似可变，实际不可变。

</v-click>

---
transition: slide-up
---

# `useEffect` —— 副作用

```tsx
// 基本：副作用 + cleanup
useEffect(() => {
  const timer = setInterval(() => console.log('tick'), 1000)
  return () => clearInterval(timer)
}, [])

// 数据获取 + AbortController
useEffect(() => {
  const controller = new AbortController()
  fetch(`/api/users/${userId}`, { signal: controller.signal }).then(...)
  return () => controller.abort()
}, [userId])
```

依赖数组：`[]` 仅挂载一次 / `[a, b]` 变化时跑 / 省略每次渲染都跑。

<v-click>

**派生状态不要用 effect**：

```tsx
// ❌ useEffect(() => setFullName(`${first} ${last}`), [first, last])
// ✅ 渲染时直接算
const fullName = `${first} ${last}`
```

</v-click>

---
transition: slide-up
---

# `useContext` —— 跨层级共享值

```tsx
import { createContext, useContext } from 'react'

// 1. 创建 Context
const ThemeContext = createContext<'light' | 'dark'>('light')

// 2. 提供值（React 19 直接用 Context，不需要 .Provider）
function App() {
  return <ThemeContext value="dark"><Page /></ThemeContext>
}

// 3. 消费
function DeepChild() {
  const theme = useContext(ThemeContext)
  return <div className={theme}>...</div>
}
```

<v-click>

**Context 两个坑**：

1. **Provider value 引用变 → 全树重渲染** → memo 起来
2. **不适合频繁更新的全局状态** → 用 Zustand / Jotai

</v-click>

---
transition: slide-up
---

# `useRef` —— 跨渲染保留可变值

```tsx
// 1. 持有 DOM 节点
function FocusInput() {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { ref.current?.focus() }, [])
  return <input ref={ref} />
}

// 2. 跨渲染保留任意值（不触发重渲染）
function ChatRoom() {
  const renderCount = useRef(0)
  renderCount.current++   // 改这个不会重渲染
}
```

<v-click>

| 维度 | `useRef` | `useState` |
|---|---|---|
| 改变后重渲染 | ❌ 不 | ✅ 会 |
| 读取方式 | `ref.current` | 直接读变量 |
| 适合 | DOM、计时器、上次值 | UI 显示的状态 |

</v-click>

---
transition: slide-up
---

# `useReducer` —— 复杂状态机

```tsx
type State = { count: number; step: number }
type Action = { type: 'inc' } | { type: 'dec' } | { type: 'setStep'; step: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'inc': return { ...state, count: state.count + state.step }
    case 'dec': return { ...state, count: state.count - state.step }
    case 'setStep': return { ...state, step: action.step }
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 })
  return <button onClick={() => dispatch({ type: 'inc' })}>{state.count}</button>
}
```

<v-click>

**何时用 `useReducer`** vs `useState`：多字段相互关联 / 下一态依赖前态 / 复杂状态机 → reducer；简单单字段 → state。

</v-click>

---
transition: slide-up
---

# `useMemo` / `useCallback` / `useLayoutEffect`

```tsx
// useMemo：缓存计算
const visibleTodos = useMemo(() => todos.filter(t => t.status === filter), [todos, filter])

// useCallback：缓存函数引用（给 React.memo 子组件用）
const handleClick = useCallback(() => doSomething(id), [id])

// useLayoutEffect：DOM 更新后、绘制前同步执行（避免视觉闪烁）
useLayoutEffect(() => {
  setHeight(ref.current!.getBoundingClientRect().height)
}, [])
```

<v-click>

**何时用**：

- **useMemo**：计算成本高 / 引用稳定避免子组件重渲染
- **useCallback**：子组件被 `React.memo` 包裹 / effect 依赖了 callback
- **useLayoutEffect**：读 DOM 几何后立即调整。**99% 场景用 `useEffect`**

> 💡 **React Compiler 改变游戏规则**——多数手写 `useMemo` / `useCallback` 不再必要。

</v-click>

---
transition: slide-up
---

# `useImperativeHandle` + `useId`

**`useImperativeHandle`**：父组件通过 ref 访问子组件方法：

```tsx
function MyInput({ ref }: { ref: React.Ref<{ focus: () => void }> }) {
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }))
  return <input ref={inputRef} />
}
```

<v-click>

**`useId`**：唯一 ID 生成（SSR 友好，**不要当列表 key**）：

```tsx
const id = useId()
<label htmlFor={`${id}-name`}>Name</label><input id={`${id}-name`} />
```

> 💡 SSR 项目里 label / aria 关联必备。Vue 3.5 才补齐。

</v-click>

---
transition: slide-up
---

# Concurrent Hooks：`useTransition` / `useDeferredValue`

```tsx
// useTransition：主动包装非紧急更新
function SearchPage() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  return (
    <input value={query} onChange={e => {
      setQuery(e.target.value)            // 紧急（输入框立刻显示）
      startTransition(() => setResults(search(e.target.value))) // 非紧急
    }} />
  )
}

// useDeferredValue：被动延迟某个值（React 19 加 initialValue）
const deferredQuery = useDeferredValue(query, '')
const results = useMemo(() => search(deferredQuery), [deferredQuery])
```

<v-click>

`useTransition` 主动 / `useDeferredValue` 被动。两者都降低优先级，紧急更新可插队。

</v-click>

---
transition: slide-up
---

# `useSyncExternalStore` —— 订阅外部 store

让 React 安全订阅外部状态源（Redux / Zustand 等）：

```tsx
import { useSyncExternalStore } from 'react'

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    callback => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', callback)
      return () => mql.removeEventListener('change', callback)
    },
    () => window.matchMedia(query).matches,
    () => false   // SSR snapshot
  )
}

const isMobile = useMediaQuery('(max-width: 768px)')
```

<v-click>

普通业务代码很少直接用，**主要给状态库作者用**——Zustand / Jotai / Valtio 等内部都在用。

</v-click>

---
transition: slide-up
---

# React 19 新 Hooks：`use`

`use` 是特殊 Hook：**可以在条件分支、循环、嵌套中调用**。

```tsx
import { use, Suspense } from 'react'

// 读 Promise（配合 Suspense）
function Comments({ commentsPromise }: { commentsPromise: Promise<Comment[]> }) {
  const comments = use(commentsPromise)
  return comments.map(c => <li key={c.id}>{c.text}</li>)
}

// 条件读 Context（普通 useContext 不能放条件里）
function MaybeTheme() {
  if (someCondition) { const theme = use(ThemeContext); return <span>...</span> }
  return null
}
```

<v-click>

> 💡 **use(promise) 三条铁律**：
> promise 必须父组件创建并通过 props 传入 / 必须在 Suspense 内 / 配合 ErrorBoundary。

</v-click>

---
transition: slide-up
---

# `useActionState` —— Action + 状态聚合

替代 React 18 的 `useFormState`，配合 Form Actions 用：

```tsx
async function loginAction(prev: string | null, formData: FormData) {
  return await login(formData.get('email'), formData.get('password'))
}

function LoginForm() {
  const [error, submitAction, isPending] = useActionState(loginAction, null)
  return (
    <form action={submitAction}>
      <input name="email" /><input name="password" type="password" />
      <button disabled={isPending}>{isPending ? '...' : 'Login'}</button>
      {error && <p>{error}</p>}
    </form>
  )
}
```

三元组：**state**（上一次 action 返回值） / **dispatch** / **isPending**。

---
transition: slide-up
---

# `useFormStatus` —— 读父 form 状态

从 `react-dom` 导入，子组件读父 `<form>` 的提交状态：

```tsx
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? '...' : 'Save'}</button>
}

function Form() {
  return (
    <form action={saveAction}>
      <input name="title" />
      <SubmitButton />   {/* 不需要传 pending 进来 */}
    </form>
  )
}
```

<v-click>

**关键点**：必须在 `<form>` 的子组件里用 / 自动取最近父 form 状态 / 返回 `pending` / `data` / `method` / `action`。

</v-click>

---
transition: slide-up
---

# `useOptimistic` —— 乐观更新

```tsx
function Todos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state: Todo[], newTodo: Todo) => [...state, { ...newTodo, sending: true }]
  )

  async function formAction(formData: FormData) {
    const newTodo = { id: Date.now(), text: formData.get('text') as string }
    addOptimistic(newTodo)            // 立即在 UI 显示（带 sending）
    const saved = await postTodo(newTodo)
    setTodos(prev => [...prev, saved])
  }

  return (
    <form action={formAction}>
      {optimisticTodos.map(t => <li key={t.id} style={{ opacity: t.sending ? 0.5 : 1 }}>{t.text}</li>)}
      <input name="text" /><button>Add</button>
    </form>
  )
}
```

<v-click>

Action 结束（成功或失败）自动回退到真实状态。

</v-click>

---
transition: slide-up
---

# 受控 vs 非受控组件

| 维度 | 受控 | 非受控 |
|---|---|---|
| 值来源 | React state | DOM 自己 |
| 必须用 | `value` + `onChange` | `defaultValue` + ref |
| 适合 | 实时校验 | 一次性提交 |

```tsx
// 受控
<input value={email} onChange={e => setEmail(e.target.value)} />

// 非受控
<input defaultValue="" ref={ref} />
```

> 💡 **React 19 推荐 Form Actions + FormData**：免去大量受控状态。

---
transition: slide-up
---

# React 19：Form Actions 一等公民

React 19 让 `<form action={fn}>` 直接传函数：

```tsx
async function saveUser(prev: FormState, formData: FormData): Promise<FormState> {
  const name = formData.get('name') as string
  if (!name) return { error: 'Name required', success: false }
  await api.save({ name })
  return { error: null, success: true }
}

function UserForm() {
  const [state, action, pending] = useActionState(saveUser, { error: null, success: false })
  return (
    <form action={action}>
      <input name="name" required />
      <button disabled={pending}>{pending ? '...' : 'Save'}</button>
      {state.error && <p>{state.error}</p>}
    </form>
  )
}
```

<v-click>

**为什么强推**：`FormData` 免写多份 useState / 服务端与客户端同接口 / 失败/成功/pending 统一 / `useOptimistic` 一行乐观更新。

</v-click>

---
transition: slide-up
---

# Props 与组件通信

```tsx
interface UserCardProps {
  name: string
  age?: number          // 可选
  onSelect?: (id: string) => void
  children?: React.ReactNode
}

function UserCard({ name, age = 18, onSelect, children }: UserCardProps) {
  return (
    <div onClick={() => onSelect?.(name)}>
      <h2>{name}</h2>
      {age && <p>Age: {age}</p>}
      {children}
    </div>
  )
}

<UserCard name="Alice" age={30} onSelect={id => console.log(id)}>
  <button>Edit</button>
</UserCard>
```

<v-click>

**React 没有 Vue 的 `emit`**——子组件通过调用「父传下来的回调函数」来通信（callback props）。

</v-click>

---
transition: slide-up
---

# 列表渲染（map + key）

```tsx
function TodoList({ todos }: { todos: Todo[] }) {
  return <ul>{todos.map(todo => <li key={todo.id}>{todo.title}</li>)}</ul>
}
```

<v-click>

**Key 三铁律**：必须给（否则用 index 兜底）/ 必须稳定（不要 `Math.random()`）/ 同级 sibling 中唯一即可。

```tsx
// ❌ 用 index 做 key：删除 / 排序时复用错节点
{items.map((item, i) => <Item key={i} data={item} />)}

// ✅ 用稳定 ID
{items.map(item => <Item key={item.id} data={item} />)}
```

</v-click>

---
transition: slide-up
---

# 条件渲染模式

```tsx
// 1. 三元
{isLoggedIn ? <Dashboard /> : <Login />}

// 2. && 短路（注意左边是 0 时会渲染 0）
{count > 0 && <Badge count={count} />}

// 3. 提前 return（推荐复杂逻辑）
function Page() {
  if (loading) return <Spinner />
  if (error) return <ErrorView error={error} />
  return <Content data={data} />
}
```

<v-click>

> 💡 **`&&` 短路陷阱**：`items.length && <List />` 当 length 为 0 时，渲染出 "0"。修复：显式 boolean `items.length > 0 && <List />`。

</v-click>

---
transition: slide-up
---

# 事件处理（合成事件）

React 用「合成事件 SyntheticEvent」统一各浏览器的事件 API：

```tsx
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  console.log(e.clientX, e.clientY)
}

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value)
}

<button onClick={handleClick}>Click</button>
<input onChange={handleChange} />
```

<v-click>

**捕获阶段**：事件名 + `Capture` 后缀 → `<div onClickCapture={handleCapture}>`

React 17+ 已移除「事件池」机制，可以放心异步访问 `e`。

</v-click>

---
transition: slide-up
---

# 组件复用：自定义 Hooks（首选）

**Hook 命名必须 `useXxx`**——否则 ESLint hooks 规则不识别 + Compiler 不优化。

```tsx
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : initial
  })
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value])
  return [value, setValue] as const
}

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}
```

**老式复用模式**（新代码用 Hook 替代）：HOC / Render Props。

---
transition: slide-up
---

# 错误边界（ErrorBoundary）

只有 Class 组件能定义错误边界（React 19 仍如此）：

```tsx
class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info)   // 上报 Sentry / DataDog
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}
```

<v-click>

**能捕获**：渲染期 / 生命周期 / 构造函数错误。**不能捕获**：事件处理器 / 异步 / SSR / 自身抛错。

**实用库** `react-error-boundary`：

```tsx
<ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => <button onClick={resetErrorBoundary}>Retry</button>}>
  <App />
</ErrorBoundary>
```

</v-click>

---
transition: slide-up
---

# Portal —— 跨 DOM 层级渲染

```tsx
import { createPortal } from 'react-dom'

function Modal({ children, open }: { children: ReactNode; open: boolean }) {
  if (!open) return null
  return createPortal(
    <div className="modal-overlay"><div className="modal-content">{children}</div></div>,
    document.getElementById('modal-root')!
  )
}
```

<v-click>

**Portal 关键点**：

- DOM 上挂在 `#modal-root`，逃出父组件 `overflow: hidden` / `z-index`
- React 树仍是父子关系——Context / 事件冒泡正常工作

适合 **Modal / Toast / Tooltip / Dropdown**——React 版的 Vue `<Teleport>`。

</v-click>

---
transition: slide-up
---

# Suspense + lazy（代码分割 + 嵌套）

```tsx
const Dashboard = lazy(() => import('./Dashboard'))

// 完整模式：ErrorBoundary（外） + Suspense（内）
<ErrorBoundary fallback={<p>Error loading</p>}>
  <Suspense fallback={<PageSkeleton />}>
    <Header />
    <Suspense fallback={<ContentSkeleton />}>
      <Content />
    </Suspense>
  </Suspense>
</ErrorBoundary>
```

<v-click>

**Suspense 触发条件**：子树有 `lazy` 组件未加载 / `use(promise)` 未 resolve / 支持 Suspense 的数据库。

每一层独立 fallback——内层 suspend 不会影响外层显示。

</v-click>

---
transition: slide-up
---

# StrictMode

```tsx
// main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

<v-click>

**StrictMode 开发期检查**：

1. **故意双调用**——`useState` / `useEffect` / 组件函数本身，暴露副作用
2. **检测废弃 API**（`findDOMNode`、`UNSAFE_*` 生命周期）
3. **检测过时 ref / context 用法**

生产环境 StrictMode 不生效。**把所有 effect 写成「跑两次也对」的就行**。

</v-click>

---
transition: slide-up
---

# React 19：ref as prop

React 18 风格（forwardRef）：

```tsx
const MyInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <input ref={ref} {...props} />
))
```

<v-click>

React 19 风格（推荐）：直接接 ref prop，不用 forwardRef：

```tsx
function MyInput({ ref, ...props }: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}
```

**官方 codemod 自动迁移**：`npx codemod@latest react/19/migrate-from-forward-ref`

</v-click>

<v-click>

**ref callback 可以返回 cleanup**（React 19 新增）：

```tsx
<input ref={node => {
  if (node) { console.log('mounted'); return () => console.log('unmounted') }
}} />
```

</v-click>

---
transition: slide-up
---

# Server Components 核心概念

React 19 真正稳定 RSC。两种组件：**Server**（默认，仅服务端）/ **Client**（`'use client'`，可 hooks）。

```tsx
// 默认 Server Component
async function ProductList() {
  const products = await db.product.findMany()
  return <ul>{products.map(p => <Product key={p.id} product={p} />)}</ul>
}

// Client Component
'use client'
export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

**Server 能做**：`async/await` / 数据库。**不能做**：`useState` / 事件 / 浏览器 API。

---
transition: slide-up
---

# RSC：组合模式 + 数据获取下沉

**Client → Server**：不能直接 import，必须通过 children/props 传：

```tsx
export default function Page() {
  return <ClientLayout><ServerPanel /></ClientLayout>
}
```

<v-click>

**数据获取下沉**：RSC 每个组件独立 await，自动并行。

```tsx
async function ProductDetail({ id }: { id: string }) {
  const product = await db.product.findUnique({ where: { id } })
  return (
    <article>
      <h1>{product.name}</h1>
      <Reviews productId={id} />          {/* 独立 await reviews */}
    </article>
  )
}
```

</v-click>

---
transition: slide-up
---

# Server Actions

```tsx
// app/actions.ts
'use server'
export async function createTodo(formData: FormData) {
  await db.todo.create({ data: { text: formData.get('text') as string } })
  revalidatePath('/todos')
}

// app/page.tsx (Server)
export default function Page() {
  return (
    <form action={createTodo}>
      <input name="text" /><button type="submit">Add</button>
    </form>
  )
}
```

<v-click>

**Server Actions 含义**：

- `'use server'` 标记的函数会被框架编译成 **RPC 端点**
- 客户端调用 = 自动序列化 → 后端执行 → 返回结果
- 不需要写 `/api/...` 路由 + fetch

</v-click>

---
transition: slide-up
---

# Server Actions：Progressive Enhancement + Streaming

Server Actions 的杀手特性：**JS 关闭也能用**——JS 加载前用原生 form 提交，加载后拦截提交调用 Action。

```tsx
'use client'
export function TodoForm() {
  const [state, formAction, pending] = useActionState(createTodo, null)
  return (
    <form action={formAction}>
      <input name="text" required />
      <button disabled={pending}>{pending ? '...' : 'Add'}</button>
      {state?.error && <p>{state.error}</p>}
    </form>
  )
}
```

<v-click>

**Streaming + Suspense**：服务端先发不带 Suspense 的部分，等数据到了再补 Suspense 子树。

```tsx
<Suspense fallback={<p>Loading product...</p>}><ProductDetail /></Suspense>
<Suspense fallback={<p>Loading reviews...</p>}><Reviews /></Suspense>
```

</v-click>

---
transition: slide-up
---

# React Compiler：自动 memoization

Meta 内部已生产 4 年（Instagram / Facebook），2024.10 开源，2025 RC。

```tsx
// 你写
function ProductList({ products, filter }) {
  const visible = products.filter(p => p.tag === filter)
  return <List items={visible} onClick={p => addToCart(p.id)} />
}

// Compiler 编译后（伪代码）
function ProductList({ products, filter }) {
  const $ = useMemoCache(3)
  let visible
  if ($[0] !== products || $[1] !== filter) {
    visible = products.filter(p => p.tag === filter)
    $[0] = products; $[1] = filter; $[2] = visible
  } else visible = $[2]
  return <List items={visible} onClick={memoizedOnClick} />
}
```

<v-click>

**收益**：自动 memo 计算 / 对象 / 函数引用 → 不需要手动 `React.memo` / `useMemo` / `useCallback`。

</v-click>

---
transition: slide-up
---

# Compiler 安装 + Rules of React

```ts
// Vite
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
})

// Next.js
export default { experimental: { reactCompiler: true } }
```

<v-click>

**Rules of React**（Compiler 假设代码符合）：

1. 组件 / Hooks 必须是纯函数（同输入 → 同输出）
2. 不要在渲染期修改 props / state
3. Effect 之外不要做副作用
4. Hooks 只在组件 / Hooks 内调用，顺序固定

**跳过某个组件**：`function Legacy() { 'use no memo'; ... }`

</v-click>

---
transition: slide-up
---

# Compiler 验证 + 兼容性

打开 React DevTools Components 面板，被 Compiler 优化的组件名右边有「**Memo ✨**」徽章。

<v-click>

| 优化方式 | Compiler 前 | Compiler 后 |
|---|---|---|
| `useMemo` | 缓存计算 | 多数自动 |
| `useCallback` | 缓存函数 | 多数自动 |
| `React.memo` | 跳过 props 没变的渲染 | 多数自动 |
| 心智负担 | 高 | 低 |

</v-click>

<v-click>

**兼容性**：React 19+ 完整支持，React 17 / 18 需 `target` + `react-compiler-runtime`。

> 💡 **何时不用**：老项目违反 Rules of React 修复成本高 / Hot path 已手动优化。

</v-click>

---
transition: slide-up
---

# 状态管理：策略 + 库对比

**策略**：2-3 层 → 直接 props / 超过 3 层 → Context（低频） / 多组件共享 + 高频 → 状态库 / 服务端状态 → **TanStack Query**。

| 库 | bundle | 心智模型 | DevTools |
|---|---|---|---|
| **Redux Toolkit** | ~20 KB | reducer + action | ✅ 强 |
| **Zustand** | ~1 KB | hook + setter | ✅ |
| **Jotai** | ~3 KB | atom（细粒度） | ✅ |
| **Valtio** | ~3 KB | proxy 可变写法 | ✅ |
| **MobX** | ~17 KB | observable + reaction | ✅ |

<v-click>

**经验**：中后台 → **Redux Toolkit**；中小项目 → **Zustand**；性能敏感 → **Jotai**；Vue 风格 → **Valtio**。

</v-click>

---
transition: slide-up
---

# Zustand：最简单状态库

```tsx
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: () => void
}

const useBearStore = create<BearState>(set => ({
  bears: 0,
  increase: () => set(state => ({ bears: state.bears + 1 })),
}))

function BearCounter() {
  const bears = useBearStore(s => s.bears)
  const increase = useBearStore(s => s.increase)
  return <button onClick={increase}>{bears}</button>
}
```

<v-click>

**三优点**：零 Provider 包裹（任意组件直接 hook）/ 选择器自动 memo / bundle 极小（1KB）。

</v-click>

---
transition: slide-up
---

# Redux Toolkit：企业首选

```tsx
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value++ },   // Immer 内置
    setBy: (state, action: PayloadAction<number>) => { state.value = action.payload },
  },
})

export const { increment, setBy } = counterSlice.actions
export const store = configureStore({ reducer: { counter: counterSlice.reducer } })
```

```tsx
function Counter() {
  const count = useSelector(s => s.counter.value)
  const dispatch = useDispatch()
  return <button onClick={() => dispatch(increment())}>{count}</button>
}

<Provider store={store}><Counter /></Provider>
```

---
transition: slide-up
---

# Jotai：atom 派

```tsx
import { atom, useAtom } from 'jotai'

const countAtom = atom(0)
const doubledAtom = atom(get => get(countAtom) * 2)

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  const [doubled] = useAtom(doubledAtom)
  return <button onClick={() => setCount(c => c + 1)}>{count} ({doubled})</button>
}
```

<v-click>

**Atom 是「最小响应单元」**，自动 fine-grained 重渲染。适合极致性能 / 复杂状态依赖图。

> 💡 **类似 Vue 的 ref + computed**：`atom(initial)` ≈ `ref()`，`atom(get => ...)` ≈ `computed()`。

</v-click>

---
transition: slide-up
---

# 路由：React Router v7（最主流）

Remix（v2）已并入 React Router v7（2024.12 稳定）：

```tsx
import { createBrowserRouter, RouterProvider } from 'react-router'

const router = createBrowserRouter([{
  path: '/',
  Component: Root,
  children: [
    { index: true, Component: Home },
    {
      path: 'users/:id',
      Component: UserProfile,
      loader: async ({ params }) => fetchUser(params.id!),
      action: async ({ request }) => updateUser(await request.formData()),
    },
  ],
}])

createRoot(root).render(<RouterProvider router={router} />)
```

<v-click>

**关键 Hooks**：`useParams` / `useNavigate` / `useLoaderData` / `useNavigation` / `useFetcher`。

> 💡 **Remix 哪儿去了？** 2024.12 合并到 React Router v7，生产能力 = 老 Remix + 全功能。

</v-click>

---
transition: slide-up
---

# TanStack Router：类型最强

```tsx
// 文件路由：src/routes/users.$id.tsx
export const Route = createFileRoute('/users/$id')({
  loader: async ({ params }) => fetchUser(params.id),
  component: UserProfile,
})

function UserProfile() {
  const user = Route.useLoaderData()   // 类型 = fetchUser 返回类型
  const { id } = Route.useParams()     // 类型从 $id 推导
  return <h1>{user.name}</h1>
}
```

**优势**：端到端 TypeScript 推导 / search params 一等公民 / 内置缓存 + 预加载。

---
transition: slide-up
---

# Next.js App Router：文件路由 + RSC

```
app/
├── layout.tsx           # 根 Layout
├── page.tsx             # /
├── users/[id]/page.tsx  # /users/:id
└── api/route.ts         # API 路由
```

<v-click>

约定：`page.tsx`（页面） / `layout.tsx`（布局） / `loading.tsx`（自动 Suspense） / `error.tsx`（自动 ErrorBoundary）。

**默认 Server Components**：组件直接 async 即可。

</v-click>

---
transition: slide-up
---

# TanStack Query：数据获取标杆

```tsx
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } },
})

// 查询
function UserPage({ id }: { id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetch(`/api/users/${id}`).then(r => r.json()),
  })
  if (isLoading) return <Spinner />
  return <h1>{data.name}</h1>
}

// 变更
function UpdateForm({ id }: { id: string }) {
  const mutation = useMutation({
    mutationFn: (data) => fetch(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user', id] }),
  })
  return <button onClick={() => mutation.mutate({ name: 'New' })}>Save</button>
}
```

**核心特性**：自动缓存 / 去重 / 后台刷新 / Suspense 集成 / 与 RSC 共存。

---
transition: slide-up
---

# 数据获取库对比

| 库 | 特色 | 适合 |
|---|---|---|
| **TanStack Query** | 最流行、文档完善 | 多数 REST API 项目 |
| **SWR** | Vercel 出品、API 简单 | 轻量项目 / Next.js |
| **RTK Query** | Redux 一体化 | 已用 Redux Toolkit |
| **Apollo Client** | GraphQL 标杆 | GraphQL 项目 |

<v-click>

```tsx
// SWR 极简风格
const { data, error, isLoading } = useSWR(`/api/users/${id}`, fetcher)
```

</v-click>

---
transition: slide-up
---

# 表单库：React Hook Form + 对比

```tsx
const schema = z.object({ email: z.string().email(), password: z.string().min(8) })

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })
  return (
    <form onSubmit={handleSubmit(login)}>
      <input {...register('email')} />
    </form>
  )
}
```

| 库 | 风格 | 适合 |
|---|---|---|
| **React Hook Form** | 非受控 + 注册 | 多数表单（推荐） |
| **TanStack Form** | Headless + 类型 | 强类型 |
| **React 19 Form Actions** | FormData + action | RSC |

---
transition: slide-up
---

# 样式方案

```tsx
// CSS Modules（零运行时，最稳）
import styles from './Button.module.css'
<button className={clsx(styles.button, primary && styles.primary)}>...</button>

// Tailwind（最流行）
<button className="px-4 py-2 bg-blue-500 text-white rounded">...</button>
```

| 方案 | 运行时 | RSC | 适合 |
|---|---|---|---|
| **CSS Modules** | 零 | ✅ | 简单项目 |
| **Tailwind 4** | 零 | ✅ | 大多数项目（最流行） |
| **Vanilla Extract** | 零 | ✅ | 类型 + RSC 友好 |
| **styled-components / Emotion** | 有 | ⚠️ | 维护遗留 |

> 💡 传统 CSS-in-JS 拖累 RSC——推荐零运行时。

---
transition: slide-up
---

# 动画：Framer Motion

```tsx
import { motion, AnimatePresence } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  Hello
</motion.div>

// 列表动画
<AnimatePresence>
  {items.map(item => (
    <motion.li key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {item.text}
    </motion.li>
  ))}
</AnimatePresence>
```

<v-click>

**还有**：React Spring（物理动画）/ Auto Animate（一行配置零样板）。

</v-click>

---
transition: slide-up
---

# UI 库选择

| 库 | 风格 | RSC | 适合 |
|---|---|---|---|
| **MUI** | Material Design | ✅ | 企业最稳，~80KB |
| **Ant Design** | 企业风 | ✅ | 中后台首选 |
| **Mantine** | 全功能 + Hooks | ✅ | 组件最多 |
| **shadcn/ui** | 复制粘贴源码 | ✅ | 最火 |
| **Radix UI / React Aria** | Headless | ✅ | shadcn 底层 |

<v-click>

**shadcn/ui**（**2024-2025 最火**）：不是 npm 包，**直接复制源码**到项目：

```bash
pnpm dlx shadcn@latest init && pnpm dlx shadcn@latest add button
```

源码在仓库里，可任意改 / 底层 **Radix UI + Tailwind + cva** / RSC 友好。

</v-click>

---
transition: slide-up
---

# TypeScript：Props + 事件 + 泛型组件

```tsx
// Props：直接给类型（推荐，不用 React.FC）
interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary'
}
function Button({ variant = 'primary', ...rest }: ButtonProps) {}

// 事件类型
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {}
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {}
```

<v-click>

**泛型组件**（React 一直支持，Vue 3.3 才补齐）：

```tsx
function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return <ul>{items.map(item => <li key={keyExtractor(item)}>{renderItem(item)}</li>)}</ul>
}

<List items={users} keyExtractor={u => u.id} renderItem={u => u.name} />
```

> 💡 **不推荐 `React.FC`**：隐式加 children / 不能写泛型 / 没有 displayName。

</v-click>

---
transition: slide-up
---

# TypeScript：Ref + 工具类型

```tsx
// Ref（三种形式）
const ref = useRef<HTMLInputElement>(null)        // 1. RefObject
<div ref={node => { /* ... */ }} />               // 2. Callback Ref
function MyComponent({ ref }: { ref?: React.Ref<HTMLDivElement> }) {}  // 3. React 19 ref as prop

// 工具类型
import {
  ReactNode, ReactElement, ComponentProps, ComponentType,
  PropsWithChildren, CSSProperties, Dispatch, SetStateAction,
} from 'react'

type ButtonProps = ComponentProps<typeof Button>          // 提取组件 props
type ButtonAttrs = React.ButtonHTMLAttributes<HTMLButtonElement>
function Card({ children }: PropsWithChildren<{ title: string }>) {}
```

<v-click>

```tsx
// 暴露自定义 handle（React 19 ref as prop）
function MyInput({ ref }: { ref?: React.Ref<{ focus: () => void }> }) {
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }))
  return <input ref={inputRef} />
}
```

</v-click>

---
transition: slide-up
---

# Fiber Reconciler 内部

React 16 引入 Fiber：把渲染从「**递归不可中断**」改成「**链表可中断**」。

```ts
interface Fiber {
  type: any                   // 组件函数 / DOM 标签
  stateNode: any              // 对应 DOM / 组件实例
  child: Fiber | null         // 第一个孩子
  sibling: Fiber | null       // 下一个兄弟
  return: Fiber | null        // 父节点
  memoizedState: any          // hooks 链表头
  alternate: Fiber | null     // 双 buffer 的另一棵
  lanes: number               // 优先级位图
  flags: number               // 副作用标记
}
```

<v-click>

**双 buffer**：`current 树（屏幕显示的） ↔ alternate ↔ workInProgress 树（构建中）`

渲染：在 workInProgress 树上 diff，完成后 commit；commit 时切到 current。

</v-click>

---
transition: slide-up
---

# Lane 优先级 + Commit Phase

**Lane Model**（React 18+）：

| Lane | 优先级 | 来源 |
|---|---|---|
| `SyncLane` | 最高 | 同步代码（点击、输入） |
| `InputContinuousLane` | 高 | hover / drag |
| `DefaultLane` | 中 | 常规更新 |
| `TransitionLane` | 低 | `useTransition` / `startTransition` |

高优先级插队（点击打断 transition）+ 同优先级 batched。这就是 React 要求渲染纯函数的原因。

<v-click>

**Commit Phase 三阶段**（不可中断）：Before Mutation（快照 + 调度 effect） → Mutation（DOM + cleanup） → Layout（`useLayoutEffect` 同步）。`useEffect` 在 commit 之后异步调度。

</v-click>

---
transition: slide-up
---

# RSC Payload / Flight 协议

Server Components 输出**不是 HTML**——而是序列化的 React 元素树：

```
// 简化的 payload
0:["$","html",null,{
  "children":[
    ["$","body",null,{
      "children":[
        ["$","h1",null,{"children":"Hello"}],
        ["$","$L1",null,{"props":{"id":"123"}}]   // Client Component 占位
      ]
    }]
  ]
}]
1:I["./Counter.js",["chunk-abc.js"],"Counter"]   // 模块映射
```

<v-click>

**关键设计**：

- 每个节点序列化成 `[type, key, props]` 三元组
- Client Components 序列化成「模块引用」——客户端按需加载 chunk
- Promises 直接被序列化，客户端 `await` 直到 resolve
- 二进制流式传输，浏览器边接收边渲染

</v-click>

---
transition: slide-up
---

# Hydration（含 Mismatch + Selective）

```tsx
import { hydrateRoot } from 'react-dom/client'
hydrateRoot(document.getElementById('root')!, <App />)
```

React 接收服务端 HTML，遍历虚拟 DOM 树绑定事件 + 初始化 state，**不重新生成 DOM**。

<v-click>

**Mismatch 常见原因**：`Math.random()` / `Date.now()` / `typeof window` 判断不同 / `useEffect` 设 state。

```tsx
// 解决：useEffect 后端跳过
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return null
```

**Selective**（React 18+）：流式输出 + 按 Suspense 边界分批 hydrate + 用户优先交互部分优先。

**Islands**（Astro / Qwik）：只 hydrate 需要交互的部分。**React + RSC ≈ Islands**。

</v-click>

---
transition: slide-up
---

# SSR / SSG / RSC 对比

| 方式 | 数据获取 | 首字节 | 客户端 JS |
|---|---|---|---|
| **CSR** | 客户端 | 快 | 全量 |
| **SSR** | 服务端每请求 | 慢 | 全量 + Hydration |
| **SSG** | 构建时 | 极快 | 全量 + Hydration |
| **RSC** | 服务端 + 客户端 | 中 | **仅 Client 部分** |

<v-click>

**Next.js App Router vs Pages**：默认 SSR → Server Components / 数据获取 getServerSideProps → 组件内 async/await / loading.tsx 自动 Suspense。新项目用 App Router。

</v-click>

---
transition: slide-up
---

# 性能优化：Profiler + 防止重渲染

```tsx
<Profiler id="App" onRender={(id, phase, actualDuration) => {
  if (actualDuration > 16) analytics.track('slow_render', { id, duration: actualDuration })
}}>
  <App />
</Profiler>
```

**DevTools Profiler**：录制 → flame graph → 关注 commit > 16ms / Why did this render / Ranked View。

<v-clicks>

**防止不必要重渲染**：

1. **`React.memo`** 包裹纯子组件（Compiler 后多数自动）
2. **状态下移**：把状态放在最需要它的最底层组件
3. **Context 拆分**：高频 / 低频变化的 Context 分开
4. **`useMemo` / `useCallback`** 给 memo 子组件稳定引用
5. **Zustand 选择器**：只订阅特定字段

</v-clicks>

---
transition: slide-up
---

# 大列表虚拟滚动

10000+ 行的列表必须虚拟化（TanStack Virtual / react-window / react-virtuoso）：

```tsx
function VirtualList() {
  const parentRef = useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  })

  return (
    <div ref={parentRef} style={{ height: 600, overflow: 'auto' }}>
      <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map(virtualRow => (
          <div key={virtualRow.key} style={{ position: 'absolute', transform: `translateY(${virtualRow.start}px)` }}>
            Item {virtualRow.index}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---
transition: slide-up
---

# 测试：Vitest + Testing Library

```ts
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', setupFiles: ['./test-setup.ts'], globals: true },
})
```

```tsx
// Counter.test.tsx
describe('Counter', () => {
  it('increments on click', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    expect(screen.getByText('0')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /increment/i }))
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
```

<v-click>

**查询优先级**：`getByRole`（推荐） → `getByLabelText` → `getByText` → `getByTestId`（兜底）。变体：`getBy*` 抛错 / `queryBy*` 返回 null / `findBy*` 异步等待。

</v-click>

---
transition: slide-up
---

# Playwright Component + Storybook

**Playwright Component**（真浏览器跑组件）：

```tsx
test('counter increments', async ({ mount }) => {
  const component = await mount(<Counter />)
  await component.locator('button').click()
  await expect(component).toContainText('1')
})
```

**Storybook**（UI 库 / 设计系统）：

```tsx
const meta: Meta<typeof Button> = { component: Button, tags: ['autodocs'] }
export const Primary: StoryObj<typeof Button> = { args: { variant: 'primary' } }
```

**测试金字塔**：Vitest 70% / Playwright 20% / E2E 10%。

---
transition: slide-up
---

# React Native + Expo + New Architecture

```tsx
function Counter() {
  const [count, setCount] = useState(0)
  return (
    <View><Text>{count}</Text><Pressable onPress={() => setCount(c => c + 1)}><Text>+</Text></Pressable></View>
  )
}
```

Web `<div>` → `<View>` / `<span>` → `<Text>` / CSS → StyleSheet。

**New Architecture（0.76+ 默认）**：

| 组件 | 旧 | 新 |
|---|---|---|
| **Bridge** | JSON | **JSI**：JS 直接调 C++ |
| **UI** | Paper | **Fabric** |
| **Modules** | Bridge | **TurboModules** |

---
transition: slide-up
---

# React 18 → 19 迁移

```bash
npx codemod@latest react/19/migration-recipe                # 通用
npx codemod@latest react/19/migrate-from-forward-ref        # forwardRef
npx codemod@latest react/19/replace-use-form-state          # useFormState
npx codemod@latest react/19/replace-context-provider        # <Ctx.Provider>
```

| 变化 | 旧 | 新 |
|---|---|---|
| ref 传递 | `forwardRef` | 直接 `ref` prop |
| Context Provider | `<Ctx.Provider>` | `<Ctx>` |
| `useFormState` | `react-dom` | `useActionState` from `react` |
| `act` 导入 | `react-dom/test-utils` | `react` |

<v-click>

**Hydration 错误改进**：React 19 把 mismatch 整合成单条消息附带 diff。常见 Error: `#418` Hydration mismatch / `#422` Object as child。

</v-click>

---
transition: slide-up
---

# React 19：文档元数据原生支持

React 19 原生支持 `<title>` / `<meta>` / `<link>` / `<script>` 在组件树任意位置：

```tsx
function BlogPost({ post }: Props) {
  return (
    <article>
      <title>{post.title}</title>
      <meta name="description" content={post.summary} />
      <link rel="stylesheet" href="/blog.css" precedence="default" />
      <h1>{post.title}</h1>
    </article>
  )
}
```

<v-click>

**React 自动**：Hoist 到 `<head>` / Stylesheet 去重 + 按 `precedence` 排序 / SSR / RSC 兼容。

> 💡 **告别 react-helmet**：现在直接在组件里写 `<title>` 即可。

</v-click>

---
transition: slide-up
---

# vs Vue

| 维度 | React 19 | Vue 3.5 |
|---|---|---|
| 模板 | JSX + 全运行时 | SFC 模板 + 编译优化 |
| 响应式 | useState + 手动依赖 | Proxy 自动追踪 |
| 更新粒度 | 整组件函数重跑 | patchFlag 动态部分 |
| TypeScript | hooks 手动类型 | 编译宏自动推导 |
| 状态管理 | Zustand / Redux | Pinia（官方） |
| 元框架 | Next.js / Remix | Nuxt |
| RSC | 一等公民 | 暂无 |

<v-click>

> 💡 **团队主语言决定 80%**：写 React 选 React，写 Vue 选 Vue。技术债 / 招聘比框架本身重要。

</v-click>

---
transition: slide-up
---

# vs Angular

| 维度 | React 19 | Angular 18+ |
|---|---|---|
| 范式 | 灵活（Hooks + JSX） | 严格（DI + RxJS） |
| 模板 | JSX（JavaScript） | 模板语法 + 结构指令 |
| 响应式 | useState + 手动 | Signal API + RxJS |
| Bundle | 小 | 较大 |
| 适合 | 中小型 / 灵活 | 大型企业 / 严格规范 |

<v-click>

**选 React**：中小型 / 快速迭代 / 国际招聘 / 跨端 / Next.js / Vercel 生态。

**选 Angular**：大型企业级（金融 / 电信 / 政府）/ 后端 OOP 思维 / 强约定 + DI 需求。

</v-click>

---
transition: slide-up
---

# vs Svelte / Solid / Preact / Inferno / Million

| 库 | bundle | API | 性能 | 适合 |
|---|---|---|---|---|
| **React 19** | ~45 KB | React Hooks | 中 | 主流项目 |
| **Svelte 5** | 极小 | runes (`$state`) | 强 | DX 极佳 / 小型项目 |
| **Solid** | ~7 KB | 类似 Hooks | 最强 | React 老手 + 性能敏感 |
| **Preact** | ~3 KB | React 同 API | 中 | 极致包体积 |
| **Million** | +5 KB | React + `block()` | 提升 | React 运行时优化 |

<v-click>

**Preact + compat**（直接当 React 用）：

```ts
resolve: { alias: { react: 'preact/compat', 'react-dom': 'preact/compat' } }
```

> 💡 **Solid 适合 React 老手**：API 像 Hooks 但底层细粒度信号。**Million 与 Compiler 二选一**——Compiler 普及后 Million 价值减弱。

</v-click>

---
transition: slide-up
---

# Edge + 微前端 + 桌面 + i18n

**Edge Runtime**（Vercel / Cloudflare Workers）：Web Standards / 不支持 Node API / 启动极快（10ms vs Node 100ms）/ 全球 CDN。

```ts
export const runtime = 'edge'
export async function GET() { return new Response('Hello from edge!') }
```

<v-click>

**Module Federation v2**：远程组件 lazy load → `lazy(() => import('remote/Button'))`。

**桌面：Electron vs Tauri**：

| | Electron | Tauri |
|---|---|---|
| 后端 | Node.js + Chromium | Rust + 系统 WebView |
| Bundle | ~150 MB | ~600 KB |

**i18n**：`react-i18next` / `react-intl` / `LinguiJS`。

</v-click>

---
transition: slide-up
---

# 自定义 Reconciler + react-three-fiber

React 把 Reconciler 抽成独立包，允许 host 平台自定义：

| 库 | 渲染目标 |
|---|---|
| **react-three-fiber** | Three.js 3D |
| **react-pdf** | PDF 文档 |
| **Ink** | 终端 CLI |

**react-three-fiber 速览**：

```tsx
function Box() {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame(() => { meshRef.current.rotation.x += 0.01 })
  return <mesh ref={meshRef}><boxGeometry /><meshStandardMaterial /></mesh>
}

<Canvas><ambientLight /><Box /></Canvas>
```

---
transition: slide-up
---

# 选型建议（场景对照）

| 场景 | 推荐栈 |
|---|---|
| **SPA + 后端 API** | Vite + React Router v7 + TanStack Query + Zustand |
| **全栈 SaaS** | Next.js App Router + Prisma + shadcn/ui |
| **后台管理** | Vite + Ant Design + Zustand |
| **博客 / 营销** | Astro + React Islands |
| **跨端移动** | Expo + TanStack Query |
| **桌面应用** | Tauri + React + Tailwind |
| **强类型项目** | Vite + TanStack Router + TanStack Query |

---
transition: slide-up
---

# 常见陷阱速查

<v-clicks>

- **`useEffect` 内 setState 无限循环** → 检查依赖数组 + cleanup
- **闭包过期值** → 用函数式 setter `setCount(c => c + 1)`
- **直接修改 state 引用** → 必须 `setState({ ...state, x: 1 })`
- **Context value 引用变 → 全树重渲染** → memo 起来
- **StrictMode 双调用导致 fetch 两次** → AbortController + signal
- **Hydration mismatch** → 客户端独有内容用 `useEffect` 后设
- **`use(promise)` 在组件内创建** → 必须父组件创建 + props 传入
- **`useFormStatus` 在 form 本身用** → 必须在 form 的子组件
- **forwardRef 还在写** → React 19 直接用 ref prop
- **Server Component import 'useState'** → Server 不支持，必须加 `'use client'`
- **`'use client'` 内不能定义 async 组件** → Client Component 只能在 Server 内 async

</v-clicks>

---
transition: slide-up
---

# 经验法则

<v-clicks>

- **新项目用元框架**（Next.js / TanStack Start / React Router v7）—— 不要从零拼路由 / SSR / 数据获取
- **状态库选 Zustand**——除非已用 Redux Toolkit 或团队要 DevTools 强一档
- **服务端状态用 TanStack Query**——不要塞进 Redux / Zustand
- **表单首选 React Hook Form + Zod**——React 19 后简单场景用 Form Actions
- **样式用 Tailwind**——CSS-in-JS 与 RSC 兼容差，零运行时优先
- **UI 用 shadcn/ui**——源码在仓库，可任意改
- **装 React Compiler**——多数 useMemo / useCallback / React.memo 不再必要
- **TypeScript 用 interface + ComponentProps**——不用 React.FC
- **`useEffect` 写成「跑两次也对」**——StrictMode 会双调用
- **Suspense + ErrorBoundary 双层包裹**——异步加载 + 错误捕获分离

</v-clicks>

---
transition: slide-up
---

# 不要选 React 的场景 + 工具 + 学习路径

<v-clicks>

**不要选 React**：团队全是 Vue / Angular 老手 / 需要极致包体积（→ Preact）/ 需要极致性能（→ Solid / Inferno）/ 强约定 + DI（→ Angular）/ 依赖 Vue 生态某个库

**开发工具**：React DevTools（组件树 / Memo 徽章）/ ESLint `eslint-plugin-react-hooks`（Rules of React）/ why-did-you-render（重渲染原因）/ React Profiler（flame graph）

**学习路径**：
1. **第 1 周**：JSX → 函数组件 → useState / useEffect → 受控表单
2. **第 2 周**：useContext / useReducer / useRef → 自定义 Hooks → 错误边界
3. **第 3 周**：Suspense → useTransition → React.memo → React Router v7
4. **第 4 周**：Next.js App Router → Server Components / Actions → TanStack Query
5. **持续提升**：React Compiler → Profiler 实战 → SSR / RSC 内部

</v-clicks>

---
layout: center
class: text-center
---

# 总结

适合：新项目 + 国际化 / 跨端 / 全栈 SSR + 现代生态优先

少做：纯 Vue 团队 / 极致包体积 / 已重度押注 Vue 生态的项目

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://react.dev/" target="_blank">react.dev</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/facebook/react" target="_blank">facebook/react</a>
</div>

<div class="mt-4">
  <carbon:play /> <a href="https://playcode.io/react" target="_blank">PlayCode React</a>
</div>
