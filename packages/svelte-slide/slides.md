---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Svelte 5
info: |
  Presentation Svelte 5 + SvelteKit 2 for frontend developers.

  Learn more at [https://svelte.dev](https://svelte.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:svelte-icon class="text-7xl" />
</div>

<br/>

## Svelte 5：编译器即框架 + Runes 反应式

模板在构建时编译为命令式 DOM 操作，运行时只剩极薄响应式调度

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Svelte 5。

Rich Harris 主导的「编译器即框架」路线，2024.10 稳定的 Svelte 5 引入 Runes（$state / $derived / $effect / $props / $bindable / $inspect / $host），把响应式从「编译器静态分析变量声明」改成「运行时基于 signals 的细粒度追踪」，原理与 Solid / Vue 3 Composition API 更接近，但保留了 Svelte 模板的极简写法。
-->

---
transition: fade-out
---

# 什么是 Svelte？

Rich Harris 主导的「编译器即框架」——构建时编译成精简命令式 JS，零 Virtual DOM

<v-click>

- **编译时优化极致**：无 VDOM / 无 diff；Hello World gzip 后 <10 KB
- **心智模型最简**：`<script>` + 模板 + `<style>` 三段式，模板接近 HTML
- **Runes 设计优雅**：5-7 个 Runes vs React 20+ Hooks；无依赖数组 / 无 Rules of Hooks
- **响应式细粒度**：基于 signals（与 Solid / Preact 同思路），只更新相关 DOM
- **样式 Scoped 内置**：`<style>` 默认作用域到当前组件，`:global()` 显式开洞
- **SvelteKit 元框架成熟**：文件路由 / SSR / Form Actions / 多 adapter
- **过渡 / 动画一等公民**：`transition:` / `in:` / `out:` / `animate:` 零依赖
- **官方文档质量高**：[svelte.dev](https://svelte.dev/) 交互式 Tutorial 是行业标杆

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Svelte_](https://svelte.dev/)

</div>

<style>
h1 {
  background-color: #FF3E00;
  background-image: linear-gradient(45deg, #FF3E00 10%, #FF8C00 90%);
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

优点是「编译期极简 + bundle 极小」，缺点是「生态小 + 招聘窄」

<v-clicks>

**优点**
- bundle 比 React 小一个数量级（~10 KB vs ~45 KB）
- 心智极简：无 `.value` / 无依赖数组 / 无 Rules of Hooks
- Runes 与 Solid / Vue Composition 同级抽象，API 更少
- SvelteKit 元框架成熟；过渡 / 动画 / Scoped 样式内置
- 官方交互式 Tutorial 是行业标杆

**缺点**
- UI 库生态小（数量比 React 少 10 倍），企业级深度组件少
- Svelte 5 迁移成本：v4 `let count = 0` + `$:` → v5 Runes 逐文件改写
- 招聘市场偏小，候选人比 React / Vue 少一个数量级
- SvelteKit 几乎是唯一 SSR 路线，Svelte Native 已沉寂
- Signal-based 调试稍难，DevTools 仍在适配 Svelte 5

</v-clicks>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 关键变化 |
|---|---|---|
| **1** | 2016.11 | Rich Harris 首个开源版本 |
| **2** | 2018.4 | 简化语法，移除 magical class bindings |
| **3** | 2019.4 | 重大重写，`$:` reactive statements、stores |
| **4** | 2023.6 | TypeScript 重写，移除 IE 支持 |
| **5** | 2024.10 | **Runes** 系统、`onclick` 事件、Snippets 替代 slots |
| **SvelteKit 1** | 2022.12 | 替代 Sapper，基于 Vite，文件路由 |
| **SvelteKit 2** | 2023.12 | 简化 API（throw error/redirect） |

<v-click>

**今天主要讲 Svelte 5 + SvelteKit 2**。看到 `let count = 0` 隐式响应、`on:click`、`<slot>`、`export let` 都是 v4 时代写法。

</v-click>

---
transition: slide-up
---

# 心智模型

**编译时把模板转成命令式 DOM 操作，运行时基于 signals 细粒度追踪**

```
.svelte 文件
  ↓ @sveltejs/vite-plugin-svelte
  ├ <script>  → JS 模块（$state → 响应式 signal）
  ├ 模板      → 命令式 DOM 操作（template element + addEventListener）
  └ <style>   → 选择器加 hash（scoped）
  ↓
最终产物：极薄运行时 + 仅本组件的 DOM 操作
```

<v-click>

对比 React / Vue：

| 维度 | Svelte 5 | Vue 3 | React 19 |
|---|---|---|---|
| 模板 | 编译时 → 命令式 DOM | 编译时 patchFlag | JSX 全运行时 |
| Virtual DOM | **无** | 有 | 有 |
| Diff | **无** | patch + patchFlag | Fiber Reconciler |
| 状态变化 | 直接更新 DOM 节点 | 仅 diff 动态部分 | 整组件函数重跑 |

</v-click>

---
transition: slide-up
---

# 编译器框架 vs Runtime 框架

| 维度 | Svelte | React | Vue |
|---|---|---|---|
| 自我定位 | **编译器框架** | UI Library | 渐进式 Framework |
| 编译策略 | **重编译时 + 极薄运行时** | 轻编译时 + 重运行时 | 重编译时 + 中等运行时 |
| Virtual DOM | **无** | 有 | 有 |
| 响应式 | Signals（v5） | render + reconcile | Proxy（ref / reactive） |
| 组件文件 | `.svelte`（HTML 风格） | `.tsx`（JSX in JS） | `.vue`（SFC） |
| Bundle 体积 | **最小**（<10 KB） | 中等（~45 KB） | 较小（~25 KB） |

<v-click>

**含义**：

- 模板 → DOM 操作的计算全在**构建时**完成，运行时只剩响应式调度
- 不需要打包 VDOM / Reconciler 进 bundle —— 体积小的根本原因
- 代价：**框架升级**（如 v4 → v5）通常需要重新编译所有组件

</v-click>

---
transition: slide-up
---

# 快速开始

```bash
# 推荐：SvelteKit 官方全栈起点
pnpm dlx sv create my-app
# 交互式选 TS / ESLint / Prettier / Vitest / Playwright / Tailwind

# 或：纯 Vite + Svelte（SPA 起点）
pnpm create vite@latest my-app -- --template svelte-ts

cd my-app && pnpm install && pnpm dev
```

<v-click>

```
my-app/                          (SvelteKit)
├── src/
│   ├── routes/                  # 文件系统路由
│   │   ├── +layout.svelte
│   │   ├── +page.svelte
│   │   └── +page.ts             # 首页 load function
│   ├── lib/
│   │   ├── components/
│   │   ├── server/              # 仅服务端模块
│   │   └── index.ts             # $lib 别名
│   ├── app.html
│   └── hooks.server.ts
├── svelte.config.js
└── package.json
```

要求 Node 20.19+ / 22.12+（Vite 7 / SvelteKit 2）。

</v-click>

---
transition: slide-up
---

# `.svelte` 文件三段式

```svelte
<!-- src/lib/Counter.svelte -->
<script lang="ts">
  // 1. <script>：组件逻辑
  let count = $state(0)
  const increment = () => count++
</script>

<!-- 2. 模板：组件 HTML 结构 -->
<button onclick={increment}>
  Clicks: {count}
</button>

<style>
  /* 3. <style>：默认 scoped */
  button { padding: 8px 16px; background: #ff3e00; color: white; }
</style>
```

<v-click>

**三段都不是必需的**：

- 仅模板：`<h1>Hello!</h1>` 就是合法 `.svelte` 文件
- 仅 `<script>`：纯逻辑模块
- `.svelte.ts` / `.svelte.js`：带 Runes 的纯逻辑模块

</v-click>

---
transition: slide-up
---

# Svelte 5 vs Svelte 4 关键差异

| 维度 | Svelte 4 | Svelte 5 |
|---|---|---|
| 响应式状态 | `let count = 0`（编译器隐式） | `let count = $state(0)`（显式 Rune） |
| 派生值 | `$: doubled = count * 2` | `let doubled = $derived(count * 2)` |
| 副作用 | `$: console.log(count)` | `$effect(() => console.log(count))` |
| Props | `export let name: string` | `let { name } = $props()` |
| 事件 | `on:click={fn}` | `onclick={fn}` |
| 子组件事件 | `createEventDispatcher` | callback props |
| 插槽 | `<slot />` | `{@render children?.()}` + `{#snippet}` |
| 动态组件 | `<svelte:component this={Comp} />` | 直接 `<Comp />` |
| 组件实例 | `new App({ target })` | `mount(App, { target })` |

<v-click>

> 💡 **迁移自动化**
>
> `pnpm dlx sv migrate svelte-5` 自动转换大部分语法。复杂 `$:` 块、custom stores、测试代码需手动检查。

</v-click>

---
transition: slide-up
---

# 模板语法基础

```svelte
<script lang="ts">
  let name = $state('Svelte')
  let count = $state(5)
  const html = '<strong>Bold</strong>'
</script>

<!-- 表达式插值（不是 mustache） -->
<p>Hello, {name}!</p>
<p>{count > 3 ? 'many' : 'few'}</p>

<!-- 属性绑定 / 短属性 / 动态 class -->
<a href={`/users/${name}`}>Profile</a>
<input {value} {disabled} />
<div class={count > 3 ? 'big' : 'small'}>Item</div>
<div class:active={count > 3}>With class directive</div>

<!-- 原始 HTML（注意 XSS） -->
<p>{@html html}</p>
```

---
transition: slide-up
---

# `{#if}` 条件渲染

```svelte
{#if user}
  <p>Hello, {user.name}!</p>
{:else if loading}
  <p>Loading...</p>
{:else}
  <p>Please log in</p>
{/if}

<!-- 嵌套也 OK -->
{#if user}
  {#if user.isAdmin}<AdminPanel />{:else}<UserPanel {user} />{/if}
{/if}
```

<v-click>

> 💡 **Svelte 控制流块 vs Vue 指令 vs React JSX**
>
> Svelte 用 `{#if}` 块（接近 Twig / Handlebars），Vue 用 `v-if`（指令在元素上），React 用 `&&` / 三元（纯 JS）。Svelte 模板与 HTML 距离最近。

</v-click>

---
transition: slide-up
---

# `{#each}` 列表渲染

```svelte
<script lang="ts">
  let todos = $state([
    { id: 1, text: 'Learn Svelte', done: false },
    { id: 2, text: 'Build app', done: false }
  ])
</script>

<ul>
  {#each todos as todo, i (todo.id)}
    <li class:done={todo.done}>
      <input type="checkbox" bind:checked={todo.done} />
      {i + 1}. {todo.text}
    </li>
  {:else}
    <li>No todos</li>
  {/each}
</ul>

<!-- 解构 -->
{#each todos as { id, text, done } (id)}
  <li class:done>{text}</li>
{/each}
```

<v-click>

**`(todo.id)` 是 key**——告诉 Svelte 用什么标识 diff 列表（与 React `key` 同思路）。省略 key 用 index 兜底，复用错节点。

</v-click>

---
transition: slide-up
---

# `{#await}` 异步

```svelte
<script lang="ts">
  let promise = $state(loadUser())

  async function loadUser() {
    const res = await fetch('/api/me')
    if (!res.ok) throw new Error('Failed')
    return res.json()
  }
</script>

{#await promise}
  <p>Loading...</p>
{:then user}
  <p>Hello, {user.name}!</p>
{:catch error}
  <p style:color="red">Error: {error.message}</p>
{/await}

<!-- 仅 then 分支 -->
{#await promise then result}
  <p>{result}</p>
{/await}
```

<v-click>

`{#await}` 是 Svelte 独有特性——Vue / React 都需要手动管 `loading / error / data` 三个状态。

</v-click>

---
transition: slide-up
---

# `{#key}` 强制重建

```svelte
<script lang="ts">
  let key = $state(0)
</script>

<!-- key 变化时，子树销毁重建（含组件状态、过渡触发）-->
{#key key}
  <Counter />
{/key}

<button onclick={() => key++}>Reset Counter</button>

<!-- 路由 ID 变化时重建子组件，让 transition 重新跑 -->
{#key page.url.pathname}
  <div transition:fade>{@render children()}</div>
{/key}
```

<v-click>

**典型用途**：

- 重置子组件状态（Counter 重新归零）
- 触发过渡（结合 `transition:`）
- 路由变化时强制重建页面

</v-click>

---
transition: slide-up
---

# `{#snippet}` + `{@render}`（替代 slot）

```svelte
<!-- Card.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte'
  let { header, children }: { header?: Snippet; children: Snippet } = $props()
</script>

<div class="card">
  {#if header}<header>{@render header()}</header>{/if}
  <div class="body">{@render children()}</div>
</div>
```

```svelte
<!-- 使用 -->
<Card>
  {#snippet header()}<h2>Title</h2>{/snippet}
  <p>Card body</p>     <!-- 默认走 children snippet -->
</Card>
```

<v-click>

**vs Vue / React**：Vue 用 `<slot>` + `<template #header>`，React 用 children + render prop。Snippet 是真正的函数，可传参 / 复用 / 多次 render。

</v-click>

---
transition: slide-up
---

# Snippet 传参（带泛型）

```svelte
<!-- DataTable.svelte -->
<script lang="ts" generics="T extends { id: string }">
  import type { Snippet } from 'svelte'

  interface Props {
    items: T[]
    row: Snippet<[T]>           // 单参数：每行收到 item
    empty?: Snippet
  }

  let { items, row, empty }: Props = $props()
</script>

<table>
  {#each items as item (item.id)}
    <tr>{@render row(item)}</tr>
  {:else}
    {@render empty?.()}
  {/each}
</table>

<!-- 使用 -->
<DataTable items={users}>
  {#snippet row(user)}
    <td>{user.id}</td><td>{user.name}</td>
  {/snippet}
</DataTable>
```

---
transition: slide-up
---

# Runes 概览

| Rune | 用途 |
|---|---|
| `$state<T>(initial)` | 响应式状态（深响应式 Proxy） |
| `$state.raw<T>(initial)` | 浅响应式（整体替换才更新） |
| `$state.snapshot<T>(value)` | 取出 Proxy 的纯 JS 快照 |
| `$derived<T>(expr)` | 派生值（表达式版） |
| `$derived.by<T>(fn)` | 派生值（函数版） |
| `$effect(fn)` | 副作用（DOM 更新后） |
| `$effect.pre(fn)` | 副作用（DOM 更新前） |
| `$effect.tracking()` | 判断是否在响应式追踪上下文 |
| `$effect.root(fn)` | 独立 effect 作用域（手动 cleanup） |
| `$props<T>()` | 接收组件 props |
| `$bindable<T>(default?)` | 标记 prop 可双向绑定 |
| `$inspect(...values)` | 开发期响应式日志（生产剥离） |
| `$inspect.trace(label?)` | 追踪 effect / derived 触发原因 |
| `$host()` | 自定义元素宿主 DOM 节点 |

<v-click>

> 💡 **Runes 不是函数**——编译器识别的特殊语法，前缀 `$` 标记。运行时不存在「`$state` 函数」，编译后变成 `__signal()` / `__set()` 等内部 API。

</v-click>

---
transition: slide-up
---

# `$state` —— 响应式状态

```svelte
<script lang="ts">
  // 基本类型
  let count = $state(0)
  let name = $state('')

  // 对象 / 数组：深响应式（Proxy 包装）
  let user = $state({ name: 'Alice', age: 30 })
  let todos = $state<Todo[]>([])

  function update() {
    count++                              // 直接赋值即更新
    user.name = 'Bob'                     // 深响应式
    user.address = { city: 'NY' }         // 添加新属性也响应
    todos.push({ id: 1, text: 'A' })     // 数组方法也响应
  }
</script>
```

<v-click>

**三要点**：

1. **直接读写**——`count` 就是值（不是 `count.value` / `count()`）
2. **深响应式**——对象 / 数组用 Proxy 自动包装
3. **解构会断**——`let { name } = user` 是普通值，不再响应

</v-click>

---
transition: slide-up
---

# `$state` 三大陷阱

```svelte
<script lang="ts">
  let user = $state({ name: 'Alice', age: 30 })

  // 1. 解构丢失响应式
  let { name, age } = user            // ❌ 普通变量，不响应
  // 解决：直接 user.name / user.age

  // 2. Proxy ≠ 原对象
  const obj = { name: 'A' }
  const proxy = $state(obj)
  console.log(proxy === obj)          // false

  // 3. JSON.stringify 走 Proxy
  let u = $state({ name: 'A' })
  JSON.stringify($state.snapshot(u))  // ✅ 先取快照
</script>
```

<v-click>

> 💡 **与 Vue Composition API 同坑**
>
> `reactive()` 解构也丢响应。Svelte 5 / Vue 3 都需要先 destructure proxy 再拷贝普通变量时小心。

</v-click>

---
transition: slide-up
---

# `$state.raw` / `$state.snapshot`

```svelte
<script lang="ts">
  // $state.raw：浅响应式（整体替换才更新）
  let person = $state.raw({ name: 'Heraclitus', age: 49 })
  person.age = 50                  // ❌ 无效
  person = { ...person, age: 50 }  // ✅ 整体替换

  // 大对象避免 Proxy 开销
  let bigList = $state.raw<Item[]>([])
  bigList = bigList.map(transform)

  // $state.snapshot：取出干净 JS 对象（不再是 Proxy）
  let user = $state({ name: 'Alice', tags: ['vue', 'react'] })
  function save() {
    const plain = $state.snapshot(user)
    api.save(plain)
    localStorage.setItem('user', JSON.stringify(plain))
  }
</script>
```

<v-click>

| 场景 | 推荐 |
|---|---|
| 表单数据 / 配置对象 / 用户对象 | `$state`（要改属性） |
| 来自后端的只读数据 | `$state.raw` |
| Map / Set / 类实例 | `$state.raw` |
| 大数组（性能敏感） | `$state.raw` |

</v-click>

---
transition: slide-up
---

# `$derived` —— 派生值

```svelte
<script lang="ts">
  let firstName = $state('')
  let lastName = $state('')
  let numbers = $state<number[]>([])

  // 表达式版（最常用）
  let fullName = $derived(`${firstName} ${lastName}`)
  let isAdult = $derived(age >= 18)

  // 函数版（多语句、复杂逻辑）
  let stats = $derived.by(() => {
    let sum = 0
    for (const n of numbers) sum += n
    return { sum, avg: sum / numbers.length }
  })
</script>

<p>{fullName} (Avg: {stats.avg})</p>
```

<v-click>

**三特性**：

1. **懒计算**——只在被读取时才执行
2. **自动追踪**——内部读取的 `$state` 自动成为依赖
3. **引用相等优化**——重算结果与上次相同时，下游不重渲染

</v-click>

---
transition: slide-up
---

# `$effect` —— 副作用

```svelte
<script lang="ts">
  let count = $state(0)

  // 自动追踪：count 是依赖
  $effect(() => {
    console.log('count is', count)
    document.title = `Count: ${count}`
  })

  // 带 cleanup
  $effect(() => {
    const timer = setInterval(() => count++, 1000)
    return () => clearInterval(timer)
  })
</script>
```

<v-click>

**五要点**：

1. **自动追踪依赖**——内部访问的 `$state` 自动被追踪（无依赖数组）
2. **mount 时跑一次**——之后依赖变化重跑
3. **返回 cleanup**——下次重跑前或组件卸载时执行
4. **不要用 effect 派生状态**——派生用 `$derived`
5. **`untrack(fn)`** 可读值但不追踪

</v-click>

---
transition: slide-up
---

# `$effect` 反模式

```svelte
<script lang="ts">
  let first = $state(''), last = $state('')

  // ❌ 用 effect 派生
  let fullName = $state('')
  $effect(() => { fullName = `${first} ${last}` })

  // ✅ 派生用 $derived
  let fullName2 = $derived(`${first} ${last}`)

  // ❌ 响应用户事件（应该在 onclick 里调）
  let submitting = $state(false)
  $effect(() => { if (submitting) postData() })

  // ✅ 直接事件处理
  function handleSubmit() { postData() }
</script>
```

<v-click>

> 💡 **与 React `useEffect` 反模式一致**
>
> React / Vue / Svelte 在这点的设计准则完全统一：effect 不该派生状态、不该响应用户事件。

</v-click>

---
transition: slide-up
---

# `$effect.pre` / `$effect.tracking` / `$effect.root`

```svelte
<script lang="ts">
  // 1. $effect.pre：DOM 更新前（替代 v4 beforeUpdate）
  let container: HTMLDivElement
  let shouldScrollDown = $state(false)
  $effect.pre(() => {
    if (!container) return
    shouldScrollDown =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 1
    messages.length   // 触发依赖追踪
  })

  // 2. $effect.tracking()：判断是否在追踪上下文
  function watch(getter, callback) {
    if ($effect.tracking()) {
      $effect(() => { getter(); return callback })
    } else { /* 不在 effect 内 */ }
  }
</script>
```

<v-click>

```ts
// 3. $effect.root：组件外的 effect 作用域
const cleanup = $effect.root(() => {
  let count = $state(0)
  $effect(() => console.log('Outside:', count))
  setInterval(() => count++, 1000)
  return () => console.log('Cleaning up')
})
cleanup()
```

**用途**：插件、共享状态模块、Vitest 测试 Runes 时需要手动管 effect 生命周期。

</v-click>

---
transition: slide-up
---

# `$props` —— 组件输入

```svelte
<!-- Button.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    label: string
    variant?: 'primary' | 'secondary' | 'danger'
    disabled?: boolean
    onclick?: (e: MouseEvent) => void
    children?: Snippet
  }

  let { label, variant = 'primary', disabled = false, onclick, children }: Props = $props()
</script>

<button class={variant} {disabled} {onclick}>
  {#if children}{@render children()}{:else}{label}{/if}
</button>
```

<v-click>

**高级用法**：

```svelte
<script lang="ts">
  // 重命名（关键字 / 数字 / 含连字符）
  let { class: className, 'data-id': dataId } = $props()

  // Rest 收集所有其他 props
  let { variant, ...rest } = $props()
</script>

<button class={variant} {...rest}>...</button>
```

</v-click>

---
transition: slide-up
---

# `$bindable` —— 双向绑定 prop

```svelte
<!-- Modal.svelte -->
<script lang="ts">
  let { open = $bindable(false) }: { open?: boolean } = $props()
</script>

{#if open}
  <div class="modal">
    <button onclick={() => open = false}>Close</button>
  </div>
{/if}
```

```svelte
<!-- 父组件 -->
<script lang="ts">
  let isOpen = $state(false)
</script>

<Modal bind:open={isOpen} />
<button onclick={() => isOpen = true}>Open</button>
```

<v-click>

**vs Vue `defineModel`**：Vue 3.4 `defineModel<T>()` 概念几乎一致——子组件显式声明可绑定 prop。

</v-click>

---
transition: slide-up
---

# `$inspect` / `$host`

```svelte
<script lang="ts">
  let count = $state(0)
  let user = $state({ name: 'Alice' })

  // 1. $inspect：开发期响应式日志
  $inspect(count)                      // 每次 count 变化都打印
  $inspect(count, user)                // 多值
  $inspect(count).with((type, value) => console.log(type, value))

  // 追踪 derived / effect 为什么重跑
  let doubled = $derived.by(() => {
    $inspect.trace('doubled-derived')
    return count * 2
  })
</script>
```

```svelte
<!-- 2. $host：仅在编译为 Custom Element 时可用 -->
<svelte:options customElement="my-button" />

<script>
  function dispatch() {
    $host().dispatchEvent(new CustomEvent('greet', { detail: 'hello' }))
  }
</script>
```

<v-click>

> 💡 **`$inspect` 生产环境被剥离**——`vite build` 后编译成 no-op，可以放心散布。

</v-click>

---
transition: slide-up
---

# 事件：v5 `onclick` vs v4 `on:click`

Svelte 5 把事件从「指令」改为「**属性**」，对齐原生 HTML：

```svelte
<script lang="ts">
  let count = $state(0)

  function handleClick(e: MouseEvent) {
    e.preventDefault()
    count++
  }
</script>

<!-- v5：与原生 HTML 同形态 -->
<button onclick={handleClick}>+1</button>
<button onclick={() => count++}>+1 (inline)</button>

<!-- Capture 阶段事件 -->
<div onclickcapture={handleCaptureClick}>...</div>

<!-- v4（已 deprecated） -->
<button on:click={handleClick}>+1</button>
```

<v-click>

**优点**：与原生 HTML 一致 / 类型检查更直接（`MouseEvent` 直接对应 `onclick`）/ 与 React `onClick` 命名几乎一致。

</v-click>

---
transition: slide-up
---

# 事件修饰符已废弃

Svelte 4 的 `|preventDefault` / `|stopPropagation` / `|self` / `|once` 全部移除：

```svelte
<!-- Svelte 4 (deprecated) -->
<form on:submit|preventDefault={save}>...</form>
<button on:click|stopPropagation={fn}>Click</button>
<button on:click|once={fn}>Once</button>

<!-- Svelte 5：在函数里写 -->
<form onsubmit={(e) => { e.preventDefault(); save() }}>...</form>
<button onclick={(e) => { e.stopPropagation(); fn() }}>Click</button>
```

<v-click>

> 💡 **`once` 用 use: action 实现**
>
> ```svelte
> <button use:onceClick={fn}>Once</button>
> ```
> 在 action 内部 `addEventListener({ once: true })`。

</v-click>

---
transition: slide-up
---

# 表单：`bind:value` / `bind:checked`

```svelte
<script lang="ts">
  let text = $state('')
  let count = $state(0)
  let agreed = $state(false)
</script>

<!-- 文本 -->
<input bind:value={text} />

<!-- 数字（自动转 number） -->
<input type="number" bind:value={count} />

<!-- Checkbox -->
<label>
  <input type="checkbox" bind:checked={agreed} />
  I agree
</label>

<!-- Textarea -->
<textarea bind:value={text}></textarea>

<!-- Select -->
<select bind:value={text}>
  <option value="a">A</option>
  <option value="b">B</option>
</select>

<!-- File input -->
<input type="file" bind:files multiple />
```

---
transition: slide-up
---

# `bind:group` —— 选项组

```svelte
<script lang="ts">
  let favorite = $state('svelte')
  let selected = $state<string[]>([])
</script>

<!-- Radio group（单选） -->
<label><input type="radio" bind:group={favorite} value="vue" /> Vue</label>
<label><input type="radio" bind:group={favorite} value="react" /> React</label>
<label><input type="radio" bind:group={favorite} value="svelte" /> Svelte</label>
<p>Favorite: {favorite}</p>

<!-- Checkbox group（多选） -->
<label><input type="checkbox" bind:group={selected} value="vue" /> Vue</label>
<label><input type="checkbox" bind:group={selected} value="react" /> React</label>
<p>Selected: {selected.join(', ')}</p>
```

<v-click>

**优点**：Svelte 自动处理 radio 单值 / checkbox 数组的差异，不需要手写 onChange 转换逻辑（React / Vue 都需要）。

</v-click>

---
transition: slide-up
---

# `bind:this` + 媒体绑定

```svelte
<script lang="ts">
  import { onMount } from 'svelte'

  let inputEl: HTMLInputElement
  let currentTime = $state(0)
  let duration = $state(0)
  let paused = $state(true)

  onMount(() => inputEl.focus())
</script>

<!-- DOM 引用 -->
<input bind:this={inputEl} />
<button onclick={() => inputEl.focus()}>Focus</button>

<!-- 媒体元素双向绑定 -->
<video src="movie.mp4" bind:currentTime bind:duration bind:paused />
<p>{currentTime.toFixed(1)} / {duration.toFixed(1)}s</p>
<button onclick={() => paused = !paused}>{paused ? 'Play' : 'Pause'}</button>
```

<v-click>

**媒体可绑定属性**：`currentTime` / `duration` / `paused` / `volume` / `muted` / `playbackRate` / `seeking` / `ended` / `played` / `buffered` / `seekable` / `readyState`

Svelte 把 HTMLMediaElement 属性映射成双向绑定，省去 onTimeUpdate / onVolumeChange 等十几个事件监听。

</v-click>

---
transition: slide-up
---

# 父子通信：Props + Callback Props

Svelte 5 没有 `createEventDispatcher`——子→父直接传函数：

```svelte
<!-- 子组件 Search.svelte -->
<script lang="ts">
  interface Props {
    onSearch: (query: string) => void
    onCancel?: () => void
  }
  let { onSearch, onCancel }: Props = $props()
  let query = $state('')
</script>

<input bind:value={query} />
<button onclick={() => onSearch(query)}>Go</button>
<button onclick={onCancel}>Cancel</button>
```

```svelte
<!-- 父组件 -->
<Search
  onSearch={(q) => console.log('Searching for', q)}
  onCancel={() => console.log('Cancelled')}
/>
```

<v-click>

**vs v4 createEventDispatcher**：

```svelte
<!-- v4 -->
const dispatch = createEventDispatcher<{ select: { id: string } }>()
dispatch('select', { id: '1' })
// 父：<Child on:select={(e) => console.log(e.detail.id)} />
```

callback props 类型推导更好。

</v-click>

---
transition: slide-up
---

# Stores —— `writable` / `readable` / `derived`

```ts
// stores/counter.ts
import { writable, readable, derived } from 'svelte/store'

// writable：可读可写
export const count = writable(0)

// readable：仅读
export const time = readable(new Date(), (set) => {
  const timer = setInterval(() => set(new Date()), 1000)
  return () => clearInterval(timer)
})

// derived：派生
export const doubled = derived(count, ($count) => $count * 2)

// 多 store 派生
export const summary = derived(
  [count, doubled],
  ([$count, $doubled]) => `${$count} doubled is ${$doubled}`
)
```

```svelte
<script lang="ts">
  import { count, doubled, time } from './stores/counter'
</script>

<!-- $ 自动订阅 + cleanup -->
<p>{$count} doubled = {$doubled}</p>
<p>Time: {$time.toLocaleTimeString()}</p>
<button onclick={() => $count++}>+1</button>
```

---
transition: slide-up
---

# `$` 自动订阅 + `get` + `readonly`

```ts
// get：一次性取值（不订阅）
import { get, readonly } from 'svelte/store'
import { count } from './stores'

function logCurrent() {
  console.log(get(count))   // 不创建订阅
}

// readonly：包装为只读
const _user = writable(null)
export const user = readonly(_user)
export function setUser(u: User) { _user.set(u) }
```

<v-click>

**`$store` 自动订阅** 是 Svelte 独有的语法糖：

- 在 `<script>` 顶层或模板读 `$count` —— 自动 subscribe + cleanup
- 写 `$count = 5` —— 等价 `count.set(5)`
- 组件销毁自动 unsubscribe

React 用 useSyncExternalStore / Vue 用 ref.value 都需要显式。

</v-click>

---
transition: slide-up
---

# Stores vs Runes —— 选哪个？

| 场景 | 推荐 |
|---|---|
| 单组件状态 | `$state` |
| 父子共享 | `$props` + `$bindable` 或 prop 传递 |
| 跨组件共享（兄弟） | `$state` + `.svelte.ts` 模块导出 |
| 全局唯一（用户、主题） | stores 或 `.svelte.ts` 单例 |
| 异步流（WebSocket、订阅） | stores（更适合命令式订阅） |

<v-click>

**Svelte 5 推荐**：新代码优先用 `$state` + `.svelte.ts` 模块；stores 仅在需要外部订阅 / 异步流 / 兼容老代码时用。

</v-click>

---
transition: slide-up
---

# `.svelte.ts` 模块化共享状态

```ts
// stores/cart.svelte.ts
interface CartItem { id: string; name: string; quantity: number }

let _items = $state<CartItem[]>([])

export const cart = {
  get items() { return _items },
  get total() { return _items.reduce((s, i) => s + i.quantity, 0) },
  add(item: Omit<CartItem, 'quantity'>) {
    const existing = _items.find(i => i.id === item.id)
    if (existing) existing.quantity++
    else _items.push({ ...item, quantity: 1 })
  },
  remove(id: string) { _items = _items.filter(i => i.id !== id) },
  clear() { _items = [] }
}
```

```svelte
<!-- 任意组件 -->
<script lang="ts">
  import { cart } from '$lib/stores/cart.svelte'
</script>

<p>Total items: {cart.total}</p>
<button onclick={() => cart.add({ id: '1', name: 'Book' })}>Add</button>
```

<v-click>

> 💡 **必须用 `.svelte.ts` 后缀**——普通 `.ts` 不会被 Svelte 编译，`$state` 等 Runes 无效。

</v-click>

---
transition: slide-up
---

# Context API

```svelte
<!-- App.svelte（顶层） -->
<script lang="ts">
  import { setContext } from 'svelte'
  let theme = $state<'light' | 'dark'>('light')

  setContext('theme', {
    get value() { return theme },
    toggle() { theme = theme === 'light' ? 'dark' : 'light' }
  })
</script>

<DeepChild />
```

```svelte
<!-- DeepChild.svelte（任意层级深处） -->
<script lang="ts">
  import { getContext } from 'svelte'
  const theme = getContext<{ value: string; toggle: () => void }>('theme')
</script>

<p>Theme: {theme.value}</p>
<button onclick={theme.toggle}>Toggle</button>
```

<v-click>

**API**：`setContext(key, value)` / `getContext<T>(key)` / `hasContext(key)` / `getAllContexts()`

必须在组件 `<script>` 顶层调用（不能在事件回调、async 内）。

</v-click>

---
transition: slide-up
---

# 类型安全 Context（Symbol Key）

```ts
// theme-context.ts
import { getContext, setContext } from 'svelte'

interface ThemeContext {
  value: 'light' | 'dark'
  toggle(): void
}

const KEY = Symbol('theme')

export function setThemeContext(ctx: ThemeContext) { setContext(KEY, ctx) }
export function getThemeContext(): ThemeContext { return getContext<ThemeContext>(KEY) }
```

```svelte
<!-- 提供 -->
<script lang="ts">
  import { setThemeContext } from './theme-context'
  let theme = $state<'light' | 'dark'>('light')
  setThemeContext({
    get value() { return theme },
    toggle() { theme = theme === 'light' ? 'dark' : 'light' }
  })
</script>

<!-- 消费 -->
<script lang="ts">
  import { getThemeContext } from './theme-context'
  const theme = getThemeContext()
</script>
```

---
transition: slide-up
---

# 生命周期：`onMount` / `onDestroy`

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  let ref: HTMLDivElement
  let data = $state<Item[]>([])

  onMount(async () => {
    // 1. 客户端独占（SSR 不跑）
    ref.focus()

    // 2. 取数据
    data = await fetch('/api/items').then(r => r.json())

    // 3. 返回 cleanup（onDestroy 的简写）
    const handler = () => console.log('online')
    window.addEventListener('online', handler)
    return () => window.removeEventListener('online', handler)
  })

  onDestroy(() => {
    // 卸载前清理（SSR 也跑）
    console.log('Component destroyed')
  })
</script>
```

<v-click>

`onMount` 仅客户端跑（SSR 不跑），`onDestroy` 双端都跑。能在 `onMount` 返回 cleanup 就别拆 `onDestroy`，更紧凑。

</v-click>

---
transition: slide-up
---

# `tick` / `untrack` / `flushSync`

```svelte
<script lang="ts">
  import { tick, untrack, flushSync } from 'svelte'

  let count = $state(0)
  let a = $state(0), b = $state(0)

  // 1. tick：等 DOM 更新
  async function clickAndMeasure() {
    count++
    console.log(document.querySelector('p')?.textContent)   // 旧值
    await tick()
    console.log(document.querySelector('p')?.textContent)   // 新值
  }

  // 2. untrack：读值但不追踪
  $effect(() => {
    console.log('a:', a)                       // 追踪 a
    console.log('b:', untrack(() => b))        // 读 b 但不追踪
  })

  // 3. flushSync：强制同步执行 pending effects（测试常用）
  function update() {
    a = 1
    flushSync()
  }
</script>
```

---
transition: slide-up
---

# v4 → v5 生命周期变化

| Svelte 4 | Svelte 5 | 备注 |
|---|---|---|
| `onMount` | 保留 | 建议改用 `$effect`（自动追踪） |
| `onDestroy` | 保留 | 建议改用 `$effect` return cleanup |
| `beforeUpdate` | **deprecated** | 用 `$effect.pre`（依赖控制） |
| `afterUpdate` | **deprecated** | 用 `$effect`（依赖控制） |
| `tick` | 保留 | 等 DOM 更新 |

<v-click>

**为什么 `beforeUpdate` / `afterUpdate` deprecated**：

```svelte
<!-- v4：任何 state 变化都触发，无依赖控制 -->
<script>
  beforeUpdate(() => console.log('before'))
  afterUpdate(() => console.log('after'))
</script>

<!-- v5：显式读取追踪 -->
<script>
  $effect.pre(() => { someState; console.log('before DOM update') })
  $effect(() => { someState; console.log('after DOM update') })
</script>
```

</v-click>

---
transition: slide-up
---

# 样式：默认 Scoped

```svelte
<!-- Card.svelte -->
<div class="card">
  <h2>Title</h2>
</div>

<style>
  /* 选择器自动加 hash，仅作用本组件 */
  .card { padding: 16px; border: 1px solid #ddd; }
  h2 { font-size: 18px; }
</style>
```

<v-click>

编译后：

```html
<div class="card svelte-abc123">
  <h2 class="svelte-abc123">Title</h2>
</div>
<style>
  .card.svelte-abc123 { ... }
  h2.svelte-abc123 { ... }
</style>
```

**vs React / Vue**：

- React：无内置 scoped，需 CSS Modules / styled-components / Tailwind
- Vue：`<style scoped>` 需显式标 scoped
- Svelte：**默认 scoped**，无需任何额外标记

</v-click>

---
transition: slide-up
---

# `:global(...)` + 动态 class

```svelte
<style>
  /* 仅本组件 .button */
  .button { padding: 8px; }

  /* 全局 .button（影响所有组件） */
  :global(.button) { font-family: sans-serif; }

  /* 子选择器全局 */
  .wrapper :global(strong) { color: red; }

  /* 整块全局 */
  :global { body { margin: 0; } }
</style>
```

```svelte
<!-- 动态 class -->
<div class="btn" class:active>Click</div>
<div class:active={count > 5}>...</div>

<!-- 普通属性 -->
<div class="btn {size} {active ? 'active' : ''}">Click</div>

<!-- v5 实验：clsx 风格 -->
<div class={['btn', size, { active }]}>Click</div>
```

---
transition: slide-up
---

# `style:` + CSS 变量传递

```svelte
<script lang="ts">
  let color = $state('red')
  let size = $state(16)
</script>

<!-- style:property -->
<p style:color style:font-size={`${size}px`}>Hello</p>

<!-- 等价 -->
<p style="color: {color}; font-size: {size}px;">Hello</p>
```

<v-click>

**CSS 自定义属性传递**：

```svelte
<!-- Parent.svelte -->
<Card --bg-color="lightblue" --text-color="darkblue" />

<!-- Card.svelte -->
<div class="card">Hello</div>
<style>
  .card {
    background: var(--bg-color, white);
    color: var(--text-color, black);
  }
</style>
```

这种「父组件用 CSS 变量定制子组件」是 Svelte 独家——React / Vue 都没有内置语法糖。

</v-click>

---
transition: slide-up
---

# 过渡：`transition:` / `in:` / `out:`

```svelte
<script lang="ts">
  import { fade, fly, slide, scale, blur } from 'svelte/transition'
  let visible = $state(true)
</script>

<button onclick={() => visible = !visible}>Toggle</button>

{#if visible}
  <!-- transition: 双向（进 + 出）-->
  <div transition:fade={{ duration: 300 }}>Fade</div>
  <div transition:fly={{ y: 50, duration: 400 }}>Fly</div>
  <div transition:slide={{ axis: 'y' }}>Slide</div>
  <div transition:scale={{ start: 0.5 }}>Scale</div>
  <div transition:blur={{ amount: 10 }}>Blur</div>

  <!-- in: 仅进入 / out: 仅离开 -->
  <div in:fly={{ y: 50 }} out:fade>Hello</div>
{/if}
```

<v-click>

**内置函数**：`fade` / `fly` / `slide` / `scale` / `blur` / `draw`（SVG path） / `crossfade`

零依赖即可做出漂亮过渡——React 需要 framer-motion / Vue 需要 `<Transition>` + CSS。

</v-click>

---
transition: slide-up
---

# `animate:` + `crossfade`

```svelte
<script lang="ts">
  import { flip } from 'svelte/animate'
  import { crossfade } from 'svelte/transition'

  const [send, receive] = crossfade({ duration: 400 })

  let todos = $state([{ id: 1, done: false }, { id: 2, done: true }])
  let active = $derived(todos.filter(t => !t.done))
  let completed = $derived(todos.filter(t => t.done))
</script>

<!-- animate:flip 列表项重排（FLIP 技术）-->
<ul>
  {#each todos as todo (todo.id)}
    <li animate:flip={{ duration: 300 }}>{todo.text}</li>
  {/each}
</ul>

<!-- crossfade：Todo 项在两列间「飞过去」 -->
<ul>
  {#each active as todo (todo.id)}
    <li in:receive={{ key: todo.id }} out:send={{ key: todo.id }}>
      {todo.text}
    </li>
  {/each}
</ul>
```

<v-click>

`animate:flip` 是 **F**irst **L**ast **I**nvert **P**lay 技术，Svelte 内置 1 行 API。`crossfade` 实现跨容器过渡——React / Vue 通常需要 Framer Motion / FLIP plugin。

</v-click>

---
transition: slide-up
---

# 自定义过渡 + `svelte/motion`

```ts
// myTransition.ts
import type { TransitionConfig } from 'svelte/transition'

export function whirl(node: Element, params?: { duration?: number }): TransitionConfig {
  return {
    duration: params?.duration ?? 400,
    css: (t, u) => `transform: scale(${t}) rotate(${u * 720}deg); opacity: ${t};`
  }
}
```

```svelte
<script lang="ts">
  import { whirl } from './myTransition'
  import { tweened, spring } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  // tweened：渐变 store / spring：弹性 store
  const progress = tweened(0, { duration: 400, easing: cubicOut })
  const x = spring(0, { stiffness: 0.1, damping: 0.4 })

  let visible = $state(true)
</script>

{#if visible}<div transition:whirl={{ duration: 600 }}>Spinning!</div>{/if}
<div class="bar" style:width={`${$progress}%`}></div>
<div class="ball" style:transform={`translateX(${$x}px)`}></div>
```

<v-click>

**缓动函数**：`linear` / `cubicOut` / `bounceOut` / `elasticOut` etc. from `svelte/easing`

</v-click>

---
transition: slide-up
---

# `<svelte:component>` / `<svelte:element>`

```svelte
<!-- v4：动态组件 -->
<svelte:component this={CurrentTab} {...props} />

<!-- v5：直接当组件用（不再需要 svelte:component） -->
<script lang="ts">
  import Tab1 from './Tab1.svelte'
  import Tab2 from './Tab2.svelte'

  let active = $state<'tab1' | 'tab2'>('tab1')
  let CurrentTab = $derived(active === 'tab1' ? Tab1 : Tab2)
</script>

<CurrentTab />
```

<v-click>

**`<svelte:element>` —— 动态元素标签**：

```svelte
<script lang="ts">
  let tag = $state<'h1' | 'h2' | 'h3'>('h1')
</script>

<svelte:element this={tag}>Heading</svelte:element>
<!-- tag='h1' → <h1>Heading</h1> -->
```

</v-click>

---
transition: slide-up
---

# `<svelte:window>` / `<svelte:document>` / `<svelte:body>`

```svelte
<script lang="ts">
  let scrollY = $state(0)
  let innerWidth = $state(0)
  let online = $state(true)
</script>

<!-- 监听 window 事件 + 绑定属性 -->
<svelte:window
  bind:scrollY
  bind:innerWidth
  bind:online
  onkeydown={(e) => e.key === 'Escape' && console.log('Esc')}
/>

<svelte:document onvisibilitychange={handleVisibility} />
<svelte:body onmouseenter={() => isHovered = true} />

<p>Scroll: {scrollY}px, Width: {innerWidth}px, Online: {online}</p>
```

<v-click>

**`<svelte:window>` 可绑定**：`innerWidth` / `innerHeight` / `outerWidth` / `outerHeight` / `scrollX` / `scrollY` / `online` / `devicePixelRatio`

Svelte 自动管理 mount/unmount 时的 addEventListener，比 React `useEffect` 简洁。

</v-click>

---
transition: slide-up
---

# `<svelte:head>` / `<svelte:options>`

```svelte
<!-- 注入到 <head> -->
<svelte:head>
  <title>My Page Title</title>
  <meta name="description" content="Page description" />
  <link rel="canonical" href="https://example.com/page" />
</svelte:head>

<!-- 编译选项 -->
<svelte:options
  customElement="my-button"
  immutable={true}
  accessors={false}
  runes={true}
/>
```

<v-click>

**`<svelte:options>` 选项**：

- `customElement` —— 编译成 Web Component
- `immutable` —— props 引用变化才更新（性能优化）
- `accessors` —— 暴露 get / set（Svelte 4 兼容）
- `runes` —— 强制启用 / 禁用 Runes（迁移期单文件用）

> 💡 SvelteKit 自动合并多层 layout / page 的 `<svelte:head>`，子页面覆盖父 layout 的 `<title>`。

</v-click>

---
transition: slide-up
---

# `<svelte:boundary>` —— 错误边界（v5.3+）

```svelte
<script lang="ts">
  function logError(error: Error) {
    console.error(error)
    sentry.captureException(error)
  }
</script>

<svelte:boundary onerror={logError}>
  <RiskyComponent />

  {#snippet failed(error, reset)}
    <p>Error: {error.message}</p>
    <button onclick={reset}>Retry</button>
  {/snippet}
</svelte:boundary>
```

<v-click>

**vs React ErrorBoundary**：

- React 16+：必须用 class 组件（`componentDidCatch`）
- Svelte 5.3+：声明式 `<svelte:boundary>` + snippet
- Vue 3：`onErrorCaptured` 钩子

Svelte 把错误边界做成元素 + snippet，比 React 的「class only」更现代。

</v-click>

---
transition: slide-up
---

# Actions —— `use:` 自定义指令

```ts
// actions/clickOutside.ts
import type { Action } from 'svelte/action'

export const clickOutside: Action<HTMLElement, () => void> = (node, callback) => {
  function handle(e: MouseEvent) {
    if (!node.contains(e.target as Node)) callback()
  }
  document.addEventListener('click', handle, true)

  return {
    destroy() {
      document.removeEventListener('click', handle, true)
    }
  }
}
```

```svelte
<script lang="ts">
  import { clickOutside } from './actions/clickOutside'
  let open = $state(false)
</script>

{#if open}
  <div use:clickOutside={() => open = false}>Dropdown content</div>
{/if}
```

<v-click>

**vs React 自定义 Hook / Vue 自定义指令**：Svelte `use:fn={params}` 一行；返回 `{ update, destroy }` 钩子；类型 `Action<E, P>`。

</v-click>

---
transition: slide-up
---

# Action with `update`

```ts
// actions/tooltip.ts
import type { Action } from 'svelte/action'

interface TooltipParams { text: string; position?: 'top' | 'bottom' }

export const tooltip: Action<HTMLElement, TooltipParams> = (node, params) => {
  let { text, position = 'top' } = params
  const el = document.createElement('div')
  el.textContent = text

  function show() { /* 定位 + appendChild */ }
  function hide() { el.remove() }

  node.addEventListener('mouseenter', show)
  node.addEventListener('mouseleave', hide)

  return {
    update(newParams) {
      text = newParams.text
      el.textContent = text
    },
    destroy() {
      node.removeEventListener('mouseenter', show)
      node.removeEventListener('mouseleave', hide)
      el.remove()
    }
  }
}
```

```svelte
<button use:tooltip={{ text: 'Click me', position: 'top' }}>Hover</button>
```

---
transition: slide-up
---

# SvelteKit 是什么

SvelteKit 是 Svelte 官方元框架（基于 Vite），类比 Vue 的 Nuxt / React 的 Next.js：

```
SvelteKit 提供：
  ├── 文件系统路由（src/routes/）
  ├── SSR + Hydration
  ├── Form Actions（渐进增强）
  ├── Server Endpoints（+server.ts）
  ├── Server-only modules（$lib/server/）
  ├── Hooks（中间件）
  ├── 多 Adapter
  └── 内置 alias（$lib / $app/* / $env/*）
```

<v-click>

| Adapter | 用途 |
|---|---|
| **adapter-auto** | 自动检测部署平台 |
| **adapter-node** | 自托管 Node.js |
| **adapter-static** | 完全静态（SSG） |
| **adapter-vercel** | Vercel Edge / Serverless |
| **adapter-cloudflare** | Cloudflare Workers / Pages |
| **adapter-netlify** | Netlify Functions |

</v-click>

---
transition: slide-up
---

# 文件路由

```
src/routes/
├── +layout.svelte                # 根布局
├── +layout.ts                    # 根 load function
├── +page.svelte                  # /
├── +page.ts                      # / load function
├── about/+page.svelte            # /about
├── users/
│   ├── +page.svelte              # /users
│   └── [id]/
│       ├── +page.svelte          # /users/:id
│       ├── +page.ts              # /users/:id load
│       └── +page.server.ts       # 服务端 load + actions
├── blog/[...rest]/+page.svelte   # /blog/* catch-all
├── api/users/+server.ts          # /api/users REST endpoint
└── (auth)/                       # 命名分组（不出现在 URL）
    ├── login/+page.svelte        # /login
    └── register/+page.svelte     # /register
```

<v-click>

`[param]` 动态段、`[...rest]` catch-all、`[[optional]]` 可选段、`(group)/` 命名分组、`+page@.svelte`（带 `@`）重置布局继承。

</v-click>

---
transition: slide-up
---

# `+page.svelte` + `+page.ts`

```svelte
<!-- src/routes/users/[id]/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types'
  let { data }: { data: PageData } = $props()
</script>

<h1>{data.user.name}</h1>
<ul>
  {#each data.posts as post (post.id)}<li>{post.title}</li>{/each}
</ul>
```

```ts
// src/routes/users/[id]/+page.ts
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, fetch, parent }) => {
  const { id } = params
  const parentData = await parent()       // 合并父 layout data

  const res = await fetch(`/api/users/${id}`)
  if (!res.ok) throw error(404, 'User not found')

  return {
    user: await res.json(),
    posts: fetch(`/api/users/${id}/posts`).then(r => r.json())   // stream
  }
}
```

---
transition: slide-up
---

# Universal vs Server Load

| 文件 | 运行位置 | 用途 |
|---|---|---|
| `+page.ts` | **客户端 + 服务端** | universal load |
| `+page.server.ts` | **仅服务端** | 需数据库、密钥、cookies |
| `+layout.ts` / `+layout.server.ts` | 同上 | layout 级数据 |

```ts
// +page.server.ts —— 服务端独占
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'

export const load: PageServerLoad = async ({ locals, params }) => {
  // 直接访问数据库（不进客户端 bundle）
  const user = await db.user.findUnique({ where: { id: params.id } })

  // locals 来自 hooks（如认证用户）
  if (!user || user.orgId !== locals.user?.orgId) {
    throw error(403, 'Forbidden')
  }
  return { user }
}
```

<v-click>

**对比 Next.js**：Next.js 用 `'use client'` 切换 Server / Client Component；SvelteKit 明确文件名 `+page.server.ts` vs `+page.ts`，类型更显式。

</v-click>

---
transition: slide-up
---

# Form Actions（渐进增强）

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms'
  let { form } = $props()
</script>

<form method="POST" use:enhance>
  <input name="email" type="email" required />
  <input name="password" type="password" required />
  <button type="submit">Login</button>
  {#if form?.error}<p class="error">{form.error}</p>{/if}
</form>
```

```ts
// +page.server.ts
import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData()
    const email = data.get('email') as string
    const user = await db.user.findUnique({ where: { email } })
    if (!user) return fail(400, { error: 'Invalid', email })

    cookies.set('token', sign(user.id), { path: '/' })
    throw redirect(302, '/dashboard')
  }
}
```

---
transition: slide-up
---

# 多个 named actions

```ts
// +page.server.ts
export const actions: Actions = {
  login: async ({ request }) => { /* ... */ },
  register: async ({ request }) => { /* ... */ },
  logout: async ({ cookies }) => {
    cookies.delete('session', { path: '/' })
    throw redirect(302, '/login')
  }
}
```

```svelte
<!-- 指定 action -->
<form method="POST" action="?/login" use:enhance>...</form>
<form method="POST" action="?/register" use:enhance>...</form>
<form method="POST" action="?/logout" use:enhance>
  <button>Logout</button>
</form>
```

<v-click>

**Form Actions 优势**：

1. **渐进增强**——无 JS 也能用（浏览器原生表单提交）
2. **类型安全**——`Actions` + `ActionData` 自动推导
3. **进度可视**——`use:enhance` 自动 disable button、loading state
4. **无需手写 fetch**——表单提交逻辑全在服务端

</v-click>

---
transition: slide-up
---

# Server Endpoints `+server.ts`

```ts
// src/routes/api/users/+server.ts
import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
  const limit = Number(url.searchParams.get('limit') ?? 10)
  const users = await db.user.findMany({ take: limit })
  return json(users)
}

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized')
  const body = await request.json()
  const user = await db.user.create({ data: body })
  return json(user, { status: 201 })
}

export const PUT: RequestHandler = async ({ request, params }) => { /* ... */ }
export const DELETE: RequestHandler = async ({ params, locals }) => { /* ... */ }
```

<v-click>

`json()` / `error()` / `redirect()` / `fail()` 都是 `@sveltejs/kit` 提供的便利函数。

</v-click>

---
transition: slide-up
---

# Hooks（中间件）

```ts
// src/hooks.server.ts
import type { Handle, HandleServerError, HandleFetch } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

const authentication: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('token')
  if (token) event.locals.user = verify(token)
  return resolve(event)
}

const logging: Handle = async ({ event, resolve }) => {
  const start = Date.now()
  const response = await resolve(event)
  console.log(`${event.request.method} ${event.url.pathname} ${Date.now() - start}ms`)
  return response
}

export const handle = sequence(authentication, logging)

export const handleError: HandleServerError = ({ error, event }) => {
  console.error(error)
  return { message: 'Internal error' }
}

export const handleFetch: HandleFetch = ({ event, request, fetch }) => {
  if (request.url.startsWith('https://api.internal.com')) {
    request.headers.set('X-API-Key', env.INTERNAL_API_KEY)
  }
  return fetch(request)
}
```

---
transition: slide-up
---

# 渲染模式 + Streaming SSR

```ts
// +page.server.ts 或 +page.ts
export const ssr = true        // 服务端渲染（默认）
export const csr = true        // 客户端 Hydration（默认）
export const prerender = false // 构建时预渲染（默认 'auto'）
```

| ssr | csr | prerender | 类型 |
|---|---|---|---|
| true | true | false | 默认 SSR + CSR |
| true | true | true | **SSG**（构建时预渲染） |
| true | false | false | **纯 SSR**（无客户端 JS） |
| false | true | false | **SPA**（仅客户端渲染） |

<v-click>

**Streaming SSR**：

```ts
export const load = async ({ fetch }) => {
  return {
    user: await fetch('/api/me').then(r => r.json()),   // 等
    posts: fetch('/api/posts').then(r => r.json())     // ← 不 await，stream
  }
}
```

用户立刻看到 user，posts 准备好后流式注入。

</v-click>

---
transition: slide-up
---

# 环境变量 + Server-only modules

```ts
// 私有 + 静态（仅服务端，构建时注入）
import { SECRET_API_KEY } from '$env/static/private'

// 私有 + 动态（仅服务端，运行时读取）
import { env } from '$env/dynamic/private'
console.log(env.DATABASE_URL)

// 公开 + 静态（客户端可见，前缀 PUBLIC_）
import { PUBLIC_SITE_URL } from '$env/static/public'

// 公开 + 动态
import { env } from '$env/dynamic/public'
```

```bash
# .env
SECRET_API_KEY=sk_xxxxx               # 私有
DATABASE_URL=postgres://...           # 私有
PUBLIC_SITE_URL=https://example.com   # 公开（前缀 PUBLIC_）
```

<v-click>

**Server-only Modules**：`$lib/server/**` 路径永远不会进客户端 bundle。在 client 文件 import 会 build error（设计意图）。

</v-click>

---
transition: slide-up
---

# 客户端导航 + Preload

```ts
import {
  goto, invalidate, invalidateAll, preloadData
} from '$app/navigation'

// 编程式导航
await goto('/dashboard')
await goto('/dashboard', { replaceState: true, invalidateAll: true })

// 重新跑 load function
await invalidate('app:users')          // 触发 depends('app:users') 的 load
await invalidateAll()                  // 触发所有 load

// 预取（hover 时调用）
await preloadData('/dashboard')
```

```svelte
<!-- 内置 preload 链接（zero JS API） -->
<a href="/about" data-sveltekit-preload-data>About</a>
<a href="/about" data-sveltekit-preload-data="hover">About (hover)</a>
<a href="/about" data-sveltekit-preload-data="tap">About (mousedown)</a>

<!-- 仅预取代码 -->
<a href="/about" data-sveltekit-preload-code>About</a>
```

---
transition: slide-up
---

# `$app/state` —— Runes 版 stores

SvelteKit 2.7+ 引入 `$app/state` 替代 `$app/stores`（Runes 化）：

```svelte
<!-- v2.7+ 推荐：Runes 风格 -->
<script lang="ts">
  import { page, navigating, updated } from '$app/state'
</script>

<p>Current path: {page.url.pathname}</p>
<p>Route ID: {page.route.id}</p>
<p>Status: {page.status}</p>

{#if navigating.to}
  <p>Navigating to {navigating.to.url.pathname}...</p>
{/if}

{#if updated.current}
  <button onclick={() => location.reload()}>Reload for new version</button>
{/if}
```

<v-click>

**vs `$app/stores`**（v2.6 及之前）：

```svelte
<script>
  import { page } from '$app/stores'    // stores 版本
</script>
<p>{$page.url.pathname}</p>             <!-- 需要 $ 前缀 -->
```

新代码推荐 `$app/state`（无 `$`，直接属性访问）。

</v-click>

---
transition: slide-up
---

# TypeScript 集成 + 泛型组件

```svelte
<!-- DataTable.svelte -->
<script lang="ts" generics="T extends { id: string }">
  import type { Snippet } from 'svelte'

  interface Props {
    items: T[]
    row: Snippet<[T]>
    keyExtractor?: (item: T) => string
  }

  let {
    items,
    row,
    keyExtractor = (item) => item.id
  }: Props = $props()
</script>

<table>
  {#each items as item (keyExtractor(item))}
    <tr>{@render row(item)}</tr>
  {/each}
</table>
```

```svelte
<!-- 使用：T 自动推导为 User -->
<DataTable items={users}>
  {#snippet row(user)}<td>{user.name}</td>{/snippet}
</DataTable>
```

<v-click>

**vs Vue Generic Components**：Vue 3.3 `<script setup lang="ts" generic="T">`，写法几乎一致。

</v-click>

---
transition: slide-up
---

# Component / Snippet / Action 类型

```ts
import type {
  Snippet,         // Snippet 类型（替代 v4 SlotsType）
  Component,        // 组件类型
  ComponentProps,   // 取 Component 的 props 类型
  Action,           // use: action 类型
  ActionReturn
} from 'svelte'

// Snippet 用法
let { row }: { row: Snippet<[User]> } = $props()                  // 单参数
let { children }: { children: Snippet } = $props()                 // 无参
let { cell }: { cell: Snippet<[User, number]> } = $props()         // 多参

// Component<Props>
import Button from './Button.svelte'

type ButtonComponent = Component<{ label: string; variant?: 'primary' | 'danger' }>
let MyButton: ButtonComponent = Button

// ComponentProps（取 props 类型）
type ButtonProps = ComponentProps<typeof Button>
```

<v-click>

> 💡 **v4 `$$Props` / `$$Events` 已废弃**——Svelte 5 `$props()` 直接推导 + `Snippet` 替代 SlotsType。

</v-click>

---
transition: slide-up
---

# `svelte-check` 类型检查

```bash
pnpm add -D svelte-check
pnpm svelte-check --tsconfig ./tsconfig.json
```

```json
// package.json
{
  "scripts": {
    "check": "svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-check --tsconfig ./tsconfig.json --watch"
  }
}
```

<v-click>

VS Code 装 **Svelte for VS Code** 插件，编辑器自动跑 `svelte-check`，类似 `vue-tsc` 的体验：

- 模板里的类型错误（如 `bind:value` 类型不匹配）
- props 类型不一致
- 未使用的 import / 未使用的 CSS 类（编译器警告）

</v-click>

---
transition: slide-up
---

# 测试：Vitest + `@testing-library/svelte`

```ts
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts']
  }
})
```

```ts
// Counter.test.ts
import { render, screen } from '@testing-library/svelte'
import { fireEvent } from '@testing-library/dom'
import { expect, it } from 'vitest'
import Counter from './Counter.svelte'

it('increments on click', async () => {
  render(Counter, { props: { initial: 0 } })
  const button = screen.getByRole('button', { name: /\+1/ })
  await fireEvent.click(button)
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument()
})
```

---
transition: slide-up
---

# 测试 Runes 模块

Runes 需要 `.svelte.ts` / `.svelte.test.ts` 后缀：

```ts
// counter.svelte.ts
class Counter {
  count = $state(0)
  get doubled() { return this.count * 2 }
  increment() { this.count++ }
}

export const counter = new Counter()
```

```ts
// counter.svelte.test.ts
import { describe, it, expect } from 'vitest'
import { flushSync } from 'svelte'
import { counter } from './counter.svelte'

describe('Counter', () => {
  it('increments', () => {
    const cleanup = $effect.root(() => {
      counter.increment()
      flushSync()
      expect(counter.count).toBe(1)
      expect(counter.doubled).toBe(2)
    })
    cleanup()
  })
})
```

<v-click>

`$effect.root` 在测试中创建独立作用域；`flushSync` 强制同步执行 pending effects。

</v-click>

---
transition: slide-up
---

# E2E：Playwright

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  webServer: {
    command: 'pnpm build && pnpm preview',
    port: 4173
  },
  testDir: 'tests'
})
```

```ts
// tests/login.spec.ts
import { test, expect } from '@playwright/test'

test('login flow', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

<v-click>

**测试栈推荐**：

- 单元 / 集成：Vitest + `@testing-library/svelte`
- 浏览器测试：Vitest browser mode（Playwright provider）
- E2E：Playwright
- 组件测试：`@playwright/experimental-ct-svelte`

</v-click>

---
transition: slide-up
---

# 编译器内部

```
.svelte 文件
  ↓
[Parser] 把 <script> / template / <style> 三段分离
  ↓
[模板 AST]  +  [Script AST（acorn）]  +  [CSS AST（postcss）]
  ↓
[Analyzer] 静态分析（变量声明、reactive deps、scope）
  ↓
[Transformer] AST 重写（$state → 响应式 getter，{#if} → 命令式 if）
  ↓
[Generator] 输出 JS（component function）+ CSS
```

<v-click>

**关键能力**：

- **CSS Pruning**：未使用规则警告 + 移除
- **Tree-shaking 友好**：输出是普通 ES Module
- **Preprocess**：TS / SCSS / PostCSS / 自定义
- **编译器 API**：`compile` / `parse` / `preprocess` 可编程调用

</v-click>

---
transition: slide-up
---

# 编译输出示例

源代码：

```svelte
<script>
  let count = $state(0)
</script>

<button onclick={() => count++}>Clicks: {count}</button>
```

<v-click>

简化后的编译输出（Svelte 5 内部表示）：

```js
import * as $ from 'svelte/internal/client'

function App($$anchor, $$props) {
  let count = $.state(0)
  const template = $.template(`<button> </button>`)

  const button = template()
  const text = button.firstChild

  button.addEventListener('click', () => $.set(count, $.get(count) + 1))

  $.template_effect(() => {
    $.set_text(text, `Clicks: ${$.get(count)}`)
  })

  $.append($$anchor, button)
}
```

**关键**：没有 vnode、没有 reconcile、没有组件函数重跑——直接 addEventListener + 局部 setText。

</v-click>

---
transition: slide-up
---

# Runes 反应式 = Signals

Svelte 5 的 Runes 内部是 **signals**（与 Solid / Preact Signals 同思路）：

```ts
// 简化的内部表示
interface Signal<T> {
  value: T
  consumers: Set<Computation>     // 谁依赖了我
}

interface Computation {
  fn: () => void
  deps: Set<Signal<any>>           // 我依赖了谁
}
```

<v-click>

**依赖图**：

```
   count (signal)
     ↓ (consumer)
   doubled (derived)
     ↓ (consumer)
   effect
```

**推-拉混合（Push-Pull）**：

- `count = 1` → push 通知 consumers「我变了」（标记 dirty，不立即重算）
- 读 `doubled` → pull 此时才计算（懒）
- `$effect` 在 microtask 里 batched 触发

</v-click>

---
transition: slide-up
---

# 细粒度更新（fine-grained）

```svelte
<script lang="ts">
  let count = $state(0)
  let name = $state('Alice')

  console.log('Component setup')  // 仅挂载时打印一次
</script>

<p>{count}</p>      <!-- count 变化时仅更新这个文本节点 -->
<p>{name}</p>       <!-- name 变化时仅更新这个文本节点 -->
<button onclick={() => count++}>+1</button>
```

<v-click>

**对比 React**：

```tsx
function Counter() {
  console.log('Component runs')   // 每次 state 变化都打印
  const [count, setCount] = useState(0)
  const [name, setName] = useState('Alice')
  return <><p>{count}</p><p>{name}</p>...</>
}
```

React 19 + Compiler 自动 memo 后差距缩小，但「组件函数仅跑一次」仍是 Svelte 5 / Solid 的独特优势。

</v-click>

---
transition: slide-up
---

# Effect 调度 + flushSync

`$effect` 默认在 **microtask** 调度，多个状态变化批处理：

```svelte
<script lang="ts">
  let a = $state(0)
  let b = $state(0)

  $effect(() => {
    console.log('effect:', a, b)
  })

  function update() {
    a = 1
    b = 1
    // effect 只跑一次（batched），不是两次
  }
</script>
```

<v-click>

**强制同步执行**：

```ts
import { flushSync } from 'svelte'

a = 1
flushSync()    // 立即执行所有待处理 effects
```

测试时常用——保证断言时所有 effect 已跑完。

</v-click>

---
transition: slide-up
---

# SSR + Hydration

```
1. HTTP 请求 → SvelteKit 服务器
   ↓
2. Router 匹配路由 → 执行 +page.server.ts load
   ↓
3. 渲染组件树 → HTML（含序列化的 data）
   ↓
4. 浏览器立刻显示 HTML（First Paint）
   ↓
5. 加载 JS bundle → Hydrate（接管为可交互组件）
   ↓
6. 之后所有导航走客户端路由（SPA 模式）
```

<v-click>

**Hydration Mismatch** 修复：

```svelte
<script lang="ts">
  import { browser } from '$app/environment'
  // ❌ 服务端 / 客户端值不同
  // const now = Date.now()

  // ✅ 用 browser 判断
  const now = browser ? Date.now() : 0
</script>
```

</v-click>

---
transition: slide-up
---

# Svelte 4 → 5 迁移

```bash
# 自动迁移工具（先 commit 干净再跑）
pnpm dlx sv migrate svelte-5
```

工具自动转换：

- `on:click` → `onclick`
- `$:` → `$state` / `$derived` / `$effect`
- `export let` → `$props()`
- `createEventDispatcher` → callback props
- `<slot>` → `{#snippet}` + `{@render}`
- `<script context="module">` → `<script module>`

<v-click>

**需要手动检查**：

- 复杂 `$:` 块（依赖多状态、含 side-effect）
- 自定义 stores（API 可能与 v5 习惯不同）
- 测试代码（mount/unmount API 变化）
- `beforeUpdate` / `afterUpdate` 需手动改为 `$effect.pre` / `$effect`
- `<svelte:component this={X}>` 可去掉（v5 直接 `<X>`）

</v-click>

---
transition: slide-up
---

# 渐进迁移策略

不能一次全改时（大项目），Svelte 5 支持新旧混用：

```js
// svelte.config.js
export default {
  compilerOptions: {
    runes: false  // 全局默认沿用 v4 风格
  }
}
```

```svelte
<!-- 单文件启用 Runes -->
<svelte:options runes />

<script>
  let count = $state(0)  // ← 启用了 Runes
</script>
```

<v-click>

**或反过来**：

```js
// 全局启用 Runes（v5 默认）
compilerOptions: { runes: true }
```

```svelte
<!-- 单文件回退（仅过渡期用） -->
<svelte:options runes={false} />
```

</v-click>

---
transition: slide-up
---

# 性能优化

```svelte
<script lang="ts">
  // 1. $state.raw 避免 Proxy 开销（大对象）
  let bigList = $state.raw<Item[]>([])
  function update() {
    bigList = bigList.map(transform)
  }

  // 2. 代码分割（lazy load 组件）
  let Modal = $state<typeof import('./Modal.svelte').default | null>(null)
  async function openModal() {
    if (!Modal) Modal = (await import('./Modal.svelte')).default
  }
</script>

<!-- 3. immutable 优化（props 引用稳定） -->
<svelte:options immutable />
```

<v-click>

**4. 列表虚拟化**（>500 行）：

```svelte
<script lang="ts">
  import { createVirtualizer } from '@tanstack/svelte-virtual'
  const virtualizer = $derived(
    createVirtualizer({
      count: items.length,
      getScrollElement: () => parentRef,
      estimateSize: () => 40
    })
  )
</script>
```

</v-click>

---
transition: slide-up
---

# 桌面端：Tauri + SvelteKit

Tauri 用 Rust 写后端、系统原生 WebView 渲染前端：

```bash
pnpm create tauri-app
# 选 SvelteKit + TypeScript 模板
```

```rust
// src-tauri/src/main.rs
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}
```

```svelte
<script lang="ts">
  import { invoke } from '@tauri-apps/api/core'
  let name = $state(''), result = $state('')

  async function greet() {
    result = await invoke('greet', { name })
  }
</script>

<input bind:value={name} />
<button onclick={greet}>Greet</button>
<p>{result}</p>
```

---
transition: slide-up
---

# Tauri vs Electron

| 维度 | Tauri | Electron |
|---|---|---|
| 后端语言 | Rust | Node.js |
| 渲染引擎 | 系统原生 WebView | 嵌入 Chromium |
| Bundle 大小 | ~5-10 MB | ~100-150 MB |
| 内存占用 | ~50 MB | ~200-500 MB |
| 启动速度 | 毫秒级 | 数百毫秒 |
| 跨平台一致 | 不同 WebView 渲染差异 | Chromium 一致 |
| 生态成熟度 | 较新（2022 发布） | 老牌（2013） |

<v-click>

**结论**：

- 新项目优先 **Tauri**（极小体积 + 高性能）
- 需要 Node.js 生态强集成的工具型应用（如 VS Code 类）用 Electron
- **Svelte Native（已沉寂）**：基于 NativeScript，社区维护已久未活跃，**不推荐新项目**
- 移动端用 **Capacitor**（H5 壳，配合 adapter-static）

</v-click>

---
transition: slide-up
---

# Web Components 输出

Svelte 可以编译组件为原生 Custom Element：

```svelte
<!-- MyButton.svelte -->
<svelte:options customElement="my-button" />

<script lang="ts">
  let { label = 'Click', variant = 'primary' }: {
    label?: string; variant?: string
  } = $props()
</script>

<button class={variant}>{label}</button>

<style>.primary { background: blue; color: white; }</style>
```

```js
import './MyButton.svelte'
// 任意 HTML 中使用
// <my-button label="Save" variant="primary"></my-button>
```

<v-click>

**用途**：

- 给非 Svelte 项目（React / Vue / 原生）输出组件
- 微前端中作为框架无关的「壳」
- 设计系统跨技术栈复用

</v-click>

---
transition: slide-up
---

# UI 库选型

| UI 库 | 风格 | 适用场景 |
|---|---|---|
| **Skeleton UI** | Tailwind 全套设计系统 | 快速搭建 |
| **shadcn-svelte** | 复制粘贴源码 | 完全控制样式 + 行为 |
| **Bits UI / Melt UI** | 无样式行为组件（Headless） | 自定义样式 |
| **Flowbite Svelte** | Tailwind UI 风格 | 后台 / 内部工具 |
| **SVAR** | 企业级数据组件 | CRM / ERP / Admin |
| **Svelte Material UI** | Material Design 3 | Material 风格 |
| **Carbon for Svelte** | IBM Carbon Design | 企业风格 |

<v-click>

> 💡 **Skeleton 3.x / Flowbite Svelte 仍在适配 Svelte 5**
>
> 新项目选 UI 库时，先确认 Svelte 5 + Runes 支持情况。无样式 + 自定义首选 **shadcn-svelte** / **Bits UI**。

</v-click>

---
transition: slide-up
---

# 样式 / i18n / 数据 / 图标 / 测试生态

| 类别 | 推荐 |
|---|---|
| **样式** | Tailwind / `@unocss/svelte-scoped` / Pico CSS |
| **UI 库** | shadcn-svelte / Bits UI / Melt UI / Skeleton / Flowbite |
| **i18n** | svelte-i18n（社区主流） / Paraglide（类型最强 / 编译时） |
| **数据获取** | SvelteKit `load`（首选） / TanStack Query Svelte |
| **图标** | lucide-svelte / @iconify-icon/svelte |
| **表单** | Form Actions（内置） / Superforms + Zod（端到端类型安全） |
| **认证** | Auth.js Svelte / Lucia / Clerk |
| **ORM** | Prisma / Drizzle / Kysely |
| **CMS** | Sanity / Strapi / Contentful（+ SvelteKit load） |
| **Storybook** | 官方支持（CSF3 / Args / Controls） |
| **测试** | Vitest + `@testing-library/svelte` + Playwright |
| **桌面** | Tauri / Electron |
| **移动 H5 壳** | Capacitor + adapter-static |
| **微前端** | Svelte → Web Component / Module Federation |

---
transition: slide-up
---

# Svelte 5 vs Solid

| 维度 | Svelte 5 | Solid |
|---|---|---|
| 模板 | `{#if}` / `{#each}` 控制流块 | JSX |
| 反应式 | `let count = $state(0)`（自动 getter/setter） | `const [count, setCount] = createSignal(0)` |
| 派生 | `$derived(count * 2)` | `createMemo(() => count() * 2)` |
| Effect | `$effect(...)` | `createEffect(...)` |
| 编译策略 | 模板 → 命令式 DOM | JSX → 命令式 DOM |
| 生态 | SvelteKit 较成熟 | SolidStart 较新 |

<v-click>

**比较**：

- 写法 Svelte 更接近 HTML（控制流块），Solid 用 JSX（接近 React）
- 反应式 Solid 更纯粹（`createSignal` 直接返回 `[get, set]`），Svelte 5 隐藏了 getter/setter
- 生态 Svelte 更成熟（SvelteKit 比 SolidStart 更稳定 / 文档更全）

</v-click>

---
transition: slide-up
---

# Svelte 5 vs Vue 3

| 维度 | Svelte 5 | Vue 3 |
|---|---|---|
| 文件 | `.svelte`（三段式） | `.vue`（SFC 三段） |
| 状态 | `let count = $state(0)` | `const count = ref(0)` + `count.value` |
| 派生 | `$derived(count * 2)` | `computed(() => count.value * 2)` |
| Effect | `$effect(...)` | `watchEffect(...)` |
| 模板 | `{#if}` 块 / `onclick={fn}` | `v-if` / `@click="fn"` 指令 |
| Props | `$props()` | `defineProps()` |
| 双向 | `bind:value` + `$bindable` | `v-model` + `defineModel` |
| Slot | `{#snippet}` + `{@render}` | `<slot>` + `<template #name>` |
| 元框架 | SvelteKit | Nuxt |
| Bundle | ~10 KB | ~25 KB |
| 生态 | 较小 | 较大（国内尤其） |

<v-click>

- 心智模型 Svelte 更简单（无 `.value`、无 `<script setup>` 宏负担）
- 模板 Vue 更直观（`v-model` / `v-if` 一目了然）
- 生态 Vue 大很多（国内 Element Plus / Ant Design Vue / Nuxt 全官方）

</v-click>

---
transition: slide-up
---

# Svelte 5 vs React 19

| 维度 | Svelte 5 | React 19 |
|---|---|---|
| 文件 | `.svelte`（三段式） | `.tsx`（JSX in JS） |
| 状态 | `let count = $state(0)` | `const [count, setCount] = useState(0)` |
| 派生 | `$derived(count * 2)` | `useMemo` / Compiler 自动 |
| Effect | `$effect(...)` | `useEffect(...)` |
| 模板 | `{#if}` 块 | JSX 内 `&&` / 三元 |
| Slot | `{#snippet}` | children / render props |
| 元框架 | SvelteKit | Next.js / Remix / TanStack Start |
| Bundle | ~10 KB | ~45 KB |
| 招聘 | 较少 | 全球最大 |

<v-click>

- Bundle Svelte 小一个数量级
- 心智 Svelte 极简（无 deps array / 无 Rules of Hooks）
- 生态 React 巨大（10 倍以上）；招聘也是 React 多
- React 19 + Compiler 缩小了「自动 memo」差距

</v-click>

---
transition: slide-up
---

# Svelte 5 vs Angular 21

| 维度 | Svelte 5 | Angular 21 |
|---|---|---|
| 文件 | `.svelte`（三段式） | `.ts` + `.html` 分离 |
| 状态 | `$state(0)` | `signal(0)` |
| 派生 | `$derived(...)` | `computed(...)` |
| Effect | `$effect(...)` | `effect(...)` |
| 模板 | `{#if}` 块 | `@if` / `@for`（v17+） |
| DI | Context / Stores | Hierarchical Injector（强类型） |
| 范式 | 函数 + Runes | OOP + 装饰器 |
| 元框架 | SvelteKit | Angular SSR + Universal |
| Bundle | ~10 KB | ~150 KB |

<v-click>

- Bundle Svelte 极小（Angular 是 15 倍）
- Angular 强约定（DI / 装饰器 / 模板编译），适合企业级
- Svelte 极简（无 NgModule / 无装饰器 / 无 Zone.js）
- Angular 21 Signals 设计与 Svelte 5 Runes 几乎是兄弟，但生态差距大

</v-click>

---
transition: slide-up
---

# Runes / Signals 精神近亲

```ts
// Solid
const [count, setCount] = createSignal(0)
const doubled = createMemo(() => count() * 2)

// Preact Signals
const count = signal(0)
const doubled = computed(() => count.value * 2)

// Vue 3 Composition API
const count = ref(0)
const doubled = computed(() => count.value * 2)

// Angular 21 Signals
count = signal(0)
doubled = computed(() => this.count() * 2)

// Svelte 5 Runes（编译器隐藏 getter / setter）
let count = $state(0)
let doubled = $derived(count * 2)
```

<v-click>

**Svelte 5 的差异**：编译器把 `count` 重写为 `getSignal()` / `setSignal(v)` 调用——用户写普通赋值即可。模板里也是同样的「自动 getter/setter」编译，比手写 `count()` / `count.value` 更简洁。

</v-click>

---
transition: slide-up
---

# 选型建议（场景对照）

| 场景 | 推荐栈 |
|---|---|
| **SPA + 后端 API** | Vite + Svelte 5 + svelte-spa-router |
| **全栈 SaaS** | SvelteKit + Drizzle / Prisma + shadcn-svelte |
| **静态站 / 博客** | SvelteKit + adapter-static + mdsvex |
| **后台管理** | SvelteKit + SVAR DataGrid + Flowbite |
| **桌面应用** | Tauri + SvelteKit + Tailwind |
| **移动 H5 壳** | SvelteKit + adapter-static + Capacitor |
| **设计系统跨栈** | Svelte + customElement + Storybook |
| **嵌入式 / IoT** | Vite + Svelte 5（bundle 极小） |
| **微前端子应用** | Svelte 编译 Web Component |

<v-click>

**新项目选 Svelte 5 的强信号**：

- bundle / 启动速度敏感
- 设计 / 动画 / 交互重，过渡需求多
- 全栈 SvelteKit 一体化方案
- 团队对 Runes 心智模型买账

</v-click>

---
transition: slide-up
---

# 常见陷阱速查

<v-clicks>

- **解构 `$state` 失去响应** → 直接 `obj.prop` 访问 或 `$derived`
- **`{#each}` 缺 key** → 列表插入 / 移除时复用错节点
- **`$effect` 派生状态** → 应该用 `$derived`
- **`$effect` 响应用户事件** → 直接在 onclick 里调
- **`JSON.stringify($state(...))`** → Proxy 影响，先用 `$state.snapshot`
- **Hydration mismatch** → 客户端独有内容用 `onMount` 或 `if (browser)`
- **`.ts` 模块用 Runes** → 必须改名 `.svelte.ts`
- **测试 Runes** → 必须 `.svelte.test.ts` + `$effect.root` + `flushSync`
- **`beforeUpdate` / `afterUpdate` 警告** → 改用 `$effect.pre` / `$effect`
- **`<svelte:component this={X}>`** → v5 可去掉（直接 `<X>`）
- **server-only module 被 client 引用** → build error（这是设计意图）
- **Form Actions 没用 `use:enhance`** → 提交时整页刷新（SPA 体验降级）
- **stores `$` 自动订阅 + Runes 混用** → 命名冲突要小心

</v-clicks>

---
transition: slide-up
---

# 经验法则

<v-clicks>

- **新项目用 SvelteKit + Runes**，不要从零拼路由 / SSR / 数据获取
- **状态管理用 `$state` + `.svelte.ts` 模块**——stores 仅在异步流 / 兼容老代码时用
- **派生用 `$derived`，副作用用 `$effect`**——不要在 effect 里 setState
- **表单首选 Form Actions + use:enhance**——渐进增强 + 零客户端代码
- **复杂表单上 Superforms + Zod**——端到端类型安全
- **样式优先 Tailwind / UnoCSS**——`<style>` 本身已 scoped
- **UI 用 shadcn-svelte / Bits UI / Melt UI**——源码可控
- **桌面用 Tauri，移动用 Capacitor**——RN 替代品当前 Svelte 没有
- **TypeScript 用 `interface Props` + `Snippet<[T]>`**
- **测试 Vitest + `@testing-library/svelte`**——Runes 必须 `.svelte.test.ts`
- **生产关闭 sourcemap**，**dev 多用 `$inspect.trace()`** 调试

</v-clicks>

---
transition: slide-up
---

# 不要选 Svelte 的场景 + 工具 + 学习路径

<v-clicks>

**不要选 Svelte**：团队全是 React / Vue 老手（招聘 / 迁移成本）/ 超大型项目（>50 万行，UI 库覆盖不足）/ 严重依赖 React Native 或 AG Grid / 微前端 host 是 React 全家桶 / 已重度押注 Next.js RSC

**开发工具**：Svelte for VS Code（必装）/ `svelte-check`（CLI 类型检查）/ Svelte DevTools（Chrome 扩展）/ `$inspect` / `$inspect.trace`（内置调试）/ Svelte REPL + Tutorial

**学习路径**：
1. **第 1 周**：`.svelte` 三段式 → `$state` / `$derived` / `$effect` → `{#if}` / `{#each}` → 受控表单
2. **第 2 周**：`$props` / `$bindable` / Snippets → Stores → Context API → 生命周期
3. **第 3 周**：自定义 Actions → `transition:` / `animate:` → SvelteKit 路由 / Load function
4. **第 4 周**：Form Actions → Server-only modules → Hooks → adapter 部署
5. **持续提升**：编译器内部 → Signal 反应式系统 → SSR / Hydration → 性能优化

</v-clicks>

---
transition: slide-up
---

# 完整生态包

| 包 | 用途 |
|---|---|
| `svelte` | 核心库（`onMount` / `mount` / `tick` / `untrack` / `flushSync` / `getContext`） |
| `svelte/store` | Stores API（`writable` / `readable` / `derived` / `get`） |
| `svelte/transition` | 过渡（`fade` / `fly` / `slide` / `scale` / `blur` / `draw` / `crossfade`） |
| `svelte/animate` | 列表动画（`flip`） |
| `svelte/easing` | 缓动函数（`cubicOut` / `bounceOut` / `elasticOut` etc.） |
| `svelte/motion` | 物理动画（`tweened` / `spring`） |
| `svelte/action` | Action 类型（`Action` / `ActionReturn`） |
| `svelte/compiler` | 编译器 API（`compile` / `parse` / `preprocess`） |
| `svelte/server` | SSR `render` 函数 |
| `svelte/legacy` | v4 兼容 API |
| `@sveltejs/kit` | SvelteKit 元框架 |
| `@sveltejs/vite-plugin-svelte` | Vite 集成 |
| `@sveltejs/adapter-*` | 部署 adapter |
| `@sveltejs/package` | 包发布工具 |
| `svelte-check` | 类型检查 CLI |

---
layout: center
class: text-center
---

# 总结

适合：新项目 + bundle / 启动速度敏感 + 全栈 SvelteKit + 设计动画密集

少做：纯 React 团队 / 已重度押注 Next.js RSC / 超大型 UI 库需求

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://svelte.dev/" target="_blank">svelte.dev</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/sveltejs/svelte" target="_blank">sveltejs/svelte</a>
</div>

<div class="mt-4">
  <carbon:play /> <a href="https://svelte.dev/playground" target="_blank">Svelte REPL</a>
</div>

<div class="mt-4">
  <carbon:education /> <a href="https://svelte.dev/tutorial" target="_blank">Svelte Tutorial</a>
</div>
