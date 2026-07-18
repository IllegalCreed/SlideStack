---
theme: seriph
background: https://cover.sli.dev
title: 异步组件完全指南
info: |
  异步组件完全指南：Vue defineAsyncComponent + Suspense / React lazy + Suspense
  代码分割 · 占位 UI · 错误处理 · 路由懒加载 · Lazy Hydration
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 异步组件完全指南

Vue defineAsyncComponent + Suspense · React lazy + Suspense

<div class="ab-gradient mt-6 inline-block px-8 py-4 text-3xl text-white rounded-xl shadow-lg">
代码分割 · 按需加载 · 占位兜底
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
异步组件 = 把组件加载与渲染解耦：渲染时才动态 import() 对应 chunk。
-->

---
transition: fade-out
---

# 什么是异步组件

把组件代码从主 bundle 拆出，渲染时才动态加载

- **本质**：组件**定义**本身是异步获取的，使用方仍按普通组件写
- **机制**：构建工具的 ESM 动态 `import()` 自动产生独立 chunk
- **占位**：加载期间用 fallback / loadingComponent 兜底
- **目标**：缩减首屏 JS 体积，按需加载

```ts
// Vue：loader 返回 Promise，解析后取 default
const Foo = defineAsyncComponent(() => import('./Foo.vue'))

// React：lazy + Suspense 协同
const Foo = lazy(() => import('./Foo'))
;<Suspense fallback={<Spinner />}><Foo /></Suspense>
```

> 关键：异步是「定义」层面的，使用方无感知。

<!--
Vue 和 React 都把代码分割 + 占位 + 错误处理收敛成稳定 API。
-->

---

# 为什么要异步组件：代码分割

大型应用所有组件同步打包的问题

- 主 bundle 越大，下载 / 解析 / 执行时间越长
- 用户**首屏看不到**的模块也占用首屏预算
- 单页应用尤其严重——所有路由代码默认都在初始包

**分割点的成本极低**：把同步 `import` 换成动态 `import()`

```ts
// 这一行就是分割点，构建工具会生成单独的 js 文件
const Settings = defineAsyncComponent(() => import('./Settings.vue'))
```

**效果**：首屏只下载主 bundle；用户点到「设置」时才下载 Settings 对应 chunk，并在加载期间显示 loading。

> 与「按需引入第三方库」不同：异步组件拆的是**应用自身业务代码**。

<!--
代码分割是首屏优化的核心手段。
-->

---

# Vue：defineAsyncComponent

两种入参形式

```ts
// 1. 简化：只传 loader
const Foo = defineAsyncComponent(() => import('./Foo.vue'))

// 2. 选项对象：完整控制 loading / error / delay / timeout / 重试
const Foo = defineAsyncComponent({
  loader: () => import('./Foo.vue'),
  loadingComponent: Loading,   // 加载期间
  errorComponent: Error,       // 失败 / 超时
  delay: 200,                  // 显示 loading 前等待（默认 200）
  timeout: 3000,               // 超时（默认 Infinity）
  suspensible: true,           // 默认 true
  onError(err, retry, fail, attempts) {
    if (attempts <= 3) retry()
    else fail()
  },
})
```

> loader 只在组件**实际渲染时**调用一次，结果被缓存。

<!--
delay=200 的设计意图：快网下避免 loading 闪烁。
-->

---

# Vue：选项默认值速查

| 选项 | 默认 | 说明 |
|------|------|------|
| `loadingComponent` | — | 加载期间占位组件 |
| `errorComponent` | — | 失败 / 超时显示 |
| `delay` | `200` ms | 显示 loading 前等待，避免闪烁 |
| `timeout` | `Infinity` | 超过则显示 errorComponent |
| `suspensible` | `true` | 是否交给 Suspense 接管 |
| `onError` | — | `(err, retry, fail, attempts)` 决定重试或放弃 |

> **关键易误解点**：`suspensible=true` 时（默认），组件自身 loading/error/delay/timeout **被 Suspense 接管忽略**。

<!--
「我的 loadingComponent 不显示」——99% 是被外层 Suspense 接管了。
-->

---

# Vue：`<Suspense>` 内置组件

两个具名插槽，**每个只允许 1 个直接子节点**

```vue
<Suspense @pending="..." @resolve="..." @fallback="...">
  <template #default>
    <AsyncComponent />  <!-- 唯一直接子节点 -->
  </template>
  <template #fallback>
    <Spinner />         <!-- 唯一直接子节点 -->
  </template>
</Suspense>
```

**状态机**：`initial → pending(显示 fallback) → resolved(显示 default)`

**重要**：resolved 后**只有 `#default` 根节点被替换**才会重新 pending；深层新出现的 async 依赖不会触发。

> Suspense 自身**不提供错误 UI**，错误用父级 `onErrorCaptured` 钩子捕获。

<!--
每个插槽单子节点是硬约束，多根节点会报错。
-->

---

# Vue：嵌套 Suspense（3.3+）与组合顺序

内层加 `suspensible` 把 async 依赖与事件委托给父 boundary

```vue
<!-- 父 -->
<Suspense>
  <template #default><Layout /></template>
  <template #fallback><PageSpinner /></template>
</Suspense>

<!-- Layout 内部 -->
<Suspense suspensible>
  <template #default><AsyncContent /></template>
  <template #fallback><ContentSpinner /></template>
</Suspense>
```

**官方正确组合顺序**（必须这样）：

```text
Transition(mode=out-in) > KeepAlive > Suspense > component
```

> 颠倒会导致过渡 / 缓存 / loading 三者行为互相干扰。

<!--
嵌套 Suspense 是 3.3+ 的能力。
-->

---

# Vue：Lazy Hydration（3.5+，仅 SSR）

把组件**水合**也按需发生，降低低端机首屏负担

| 策略 | 触发时机 |
|------|----------|
| `hydrateOnIdle()` | 浏览器空闲时 |
| `hydrateOnVisible({ rootMargin })` | 进入视口 |
| `hydrateOnMediaQuery('(max-width:500px)')` | 媒体查询匹配 |
| `hydrateOnInteraction('click')` | 用户交互 |
| 自定义 `HydrationStrategy(hydrate, forEachElement)` | 任意逻辑 |

```ts
const Heavy = defineAsyncComponent({
  loader: () => import('./Heavy.vue'),
  hydrate: hydrateOnVisible({ rootMargin: '100px' }),
})
```

<!--
Lazy Hydration 是 Vue 3.5 的重要能力。
-->

---

# React：lazy 契约

`React.lazy(load)` 接受**无参函数 `load`**，返回 Promise

```tsx
// ✅ 顶层声明：lazy 自动取 .default
const Foo = lazy(() => import('./Foo'))

// ❌ 反模式：写在组件函数体内
function App() {
  const Foo = lazy(() => import('./Foo'))  // 每次渲染都是新 lazy
  return <Foo />
}
```

**契约要点**：

- `load` 仅在第一次需要时调用一次，结果被缓存
- 解析值必须含 `.default`，且为合法 React 组件类型
- **必须在模块顶层声明**——组件内声明会导致子树状态重置

> 官方 troubleshooting 明确列「组件内声明 lazy」为反模式。

<!--
顶层声明是硬性要求，违反会导致状态被重置。
-->

---

# React：`<Suspense>` + Error Boundary

Suspense 提供 fallback，错误处理必须自写 Error Boundary

```tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(err) { console.error(err) }
  render() {
    return this.state.hasError ? <Error /> : this.props.children
  }
}

// ErrorBoundary 必须包在 Suspense 外层
;<ErrorBoundary fallback={<Error />}>
  <Suspense fallback={<Spinner />}>
    <Foo />
  </Suspense>
</ErrorBoundary>
```

> React **没有内置 errorComponent** 选项，loader reject 直接 throw 给最近 Error Boundary。

<!--
Error Boundary 必须是 class 组件。
-->

---

# React：Suspense 激活条件

哪些场景能让组件 suspend

| 激活源 | 备注 |
|--------|------|
| `lazy()` 加载组件 | 最常见 |
| `use(Promise)` | React 19 |
| `<link rel="stylesheet" precedence>` | React 19 |
| 流式 SSR HTML | 服务端流式 |

**不激活**：`useEffect` 内的 `fetch`、事件处理器内的 `fetch`、普通 `await`。

```tsx
useEffect(() => fetch('/api').then(setData), [])  // ❌ 不触发
const data = use(fetchPromise)                    // ✅ 触发（React 19）
```

> 想让数据获取走 Suspense：用 Suspense-aware 数据库或 `use()`。

<!--
关键：useEffect 内的 fetch 不触发 Suspense。
-->

---

# React：startTransition 避免内容打回 fallback

**核心问题**：已显示内容更新时触发 suspend，会把已揭示 UI 直接换成 fallback，造成跳变

```tsx
import { useTransition } from 'react'

const [isPending, startTrans] = useTransition()

function navigate(next) {
  startTrans(() => setTab(next)) // 标记非紧急
}
```

**适用场景**：路由导航、Tab 切换、过滤条件变化

- `startTransition(fn)`：把 fn 内更新标记为非紧急
- `useTransition()`：拿 `[isPending, startTransition]`
- `useDeferredValue(v)`：延迟应用某值
- `key={id}`：重置 boundary，跨实体切换立即显示 fallback

> Suspense-aware 路由默认用 startTransition 包裹导航。

<!--
startTransition 让 React 尽量保留旧 UI 直到新内容就绪。
-->

---

# 嵌套 Suspense：一起揭示 vs 逐步揭示

React 边界组合决定揭示策略

```tsx
// 一起揭示：A、B 都好才显示
<Suspense fallback={<PageSpinner />}>
  <A /><B />
</Suspense>

// 逐步揭示：A、B 各自揭示
<Suspense fallback={<ASkeleton />}><A /></Suspense>
<Suspense fallback={<BSkeleton />}><B /></Suspense>
```

**官方建议**：

- 300ms 揭示节流会让一个窗口内就绪的 boundary 合并揭示
- **不要给每个组件都包 Suspense boundary**
- 粒度应贴合用户期望的 loading 序列——问设计师 loading 应放在哪

> 合理分层能避免长时间白屏；过度分层反而碎。

<!--
嵌套策略是 React Suspense 的核心设计点。
-->

---

# 反模式速查

Vue 与 React 都要避开的坑

| 反模式 | 后果 |
|--------|------|
| Vue: 以为 Suspense 父链下组件 loading 还生效 | 默认 `suspensible=true` 被接管 |
| Vue: `<Suspense>` 插槽多根节点 | 报错 |
| Vue: 以为路由 `() => import()` 会触发 Suspense | 「目前」不会，只有内部 async 子组件 |
| React: 组件函数体内声明 `lazy(...)` | 每次渲染新 lazy，子树状态重置 |
| React: 期待 `useEffect` fetch 触发 Suspense | 明确不激活 |
| React: 不给 lazy 配 Error Boundary | loader reject 直接抛错 |
| 两边: 过度分割（每个小组件都 lazy） | chunk waterfall，反而慢 |

<!--
反模式集中体现了两个框架的「易踩坑点」。
-->

---
layout: center
class: text-center
---

# 小结

异步组件 = 代码分割 + 占位 + 错误处理的统一模型

**Vue**: `defineAsyncComponent` + `<Suspense>`（Experimental，3.3+ 嵌套，3.5+ Lazy Hydration）
**React**: `lazy` + `<Suspense>` + Error Boundary + `startTransition`（均稳定）

路由级懒加载是最划算的分割点 · fallback 要轻量 · 避免过度分割

[Vue 异步组件](https://vuejs.org/guide/components/async.html) · [React lazy](https://react.dev/reference/react/lazy) · [React Suspense](https://react.dev/reference/react/Suspense)

<!--
掌握两条主线：组件入口（lazy/defineAsyncComponent）+ 占位边界（Suspense）。
-->
