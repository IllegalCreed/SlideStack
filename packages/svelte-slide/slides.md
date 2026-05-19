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
| **3** | 2019.4 | 重大重写，`$:` reactive statements、stores |
| **4** | 2023.6 | TypeScript 重写，移除 IE 支持 |
| **5** | 2024.10 | **Runes** 系统、`onclick` 事件、Snippets 替代 slots |
| **SvelteKit 1 / 2** | 2022.12 / 2023.12 | 替代 Sapper（基于 Vite）/ 简化 API |

**今天主要讲 Svelte 5 + SvelteKit 2**。`let count = 0` 隐式响应、`on:click`、`<slot>`、`export let` 都是 v4 写法。

---
transition: slide-up
---

# 心智模型

**编译时把模板转成命令式 DOM 操作，运行时基于 signals 细粒度追踪**

```
.svelte → vite-plugin-svelte → <script> 响应式 signal + 模板命令式 DOM + <style> hash scoped
```

对比 React / Vue：

| 维度 | Svelte 5 | Vue 3 | React 19 |
|---|---|---|---|
| 模板 | 编译时 → 命令式 DOM | 编译时 patchFlag | JSX 全运行时 |
| Virtual DOM / Diff | 无 / 无 | 有 / patch | 有 / Fiber |
| 状态变化 | 直接更新 DOM 节点 | 仅 diff 动态部分 | 整组件函数重跑 |

---
transition: slide-up
---

# 编译器框架 vs Runtime 框架

| 维度 | Svelte | React | Vue |
|---|---|---|---|
| 定位 / 策略 | 编译器框架 / 重编译 | UI Lib / 轻编译 | 渐进式 / 重编译 |
| Virtual DOM / 响应式 | 无 / Signals | 有 / render+reconcile | 有 / Proxy |
| 文件 / Bundle | `.svelte` / <10 KB | `.tsx` / ~45 KB | `.vue` / ~25 KB |

**含义**：模板 → DOM 操作全在**构建时**完成；不打包 VDOM / Reconciler（体积小的根本原因）；代价是框架升级需重编译所有组件。

---
transition: slide-up
---

# 快速开始

```bash
# 推荐：SvelteKit 官方全栈（TS / Vitest / Playwright / Tailwind 等可选）
pnpm dlx sv create my-app

# 或：纯 Vite + Svelte（SPA 起点）
pnpm create vite@latest my-app -- --template svelte-ts
cd my-app && pnpm install && pnpm dev
```

```
my-app/  (SvelteKit)
├── src/
│   ├── routes/                  # 文件系统路由（+page.svelte / +page.ts / +layout）
│   ├── lib/                     # components / server / index.ts（$lib 别名）
│   ├── app.html
│   └── hooks.server.ts
├── svelte.config.js
└── package.json
```

要求 Node 20.19+ / 22.12+（Vite 7 / SvelteKit 2）。

---
transition: slide-up
---

# `.svelte` 文件三段式

```svelte
<!-- src/lib/Counter.svelte -->
<script lang="ts">
  // 1. <script>：组件逻辑
  let count = $state(0)
</script>

<!-- 2. 模板：组件 HTML 结构 -->
<button onclick={() => count++}>Clicks: {count}</button>

<style>
  /* 3. <style>：默认 scoped */
  button { padding: 8px 16px; background: #ff3e00; color: white; }
</style>
```

**三段都不是必需的**：仅模板 `<h1>Hello!</h1>` 合法；仅 `<script>` 纯逻辑模块；`.svelte.ts` 带 Runes 的纯逻辑。

---
transition: slide-up
---

# Svelte 5 vs Svelte 4 关键差异

| 维度 | Svelte 4 | Svelte 5 |
|---|---|---|
| 响应式状态 | `let count = 0`（隐式） | `let count = $state(0)`（显式 Rune） |
| 派生 / 副作用 | `$: doubled = count * 2` | `$derived(count * 2)` / `$effect(...)` |
| Props / 事件 | `export let name` / `on:click` | `$props()` / `onclick={fn}` |
| 插槽 / 动态组件 | `<slot />` / `<svelte:component>` | `{@render}` + `{#snippet}` / 直接 `<Comp />` |
| 实例化 | `new App({ target })` | `mount(App, { target })` |

> 💡 `pnpm dlx sv migrate svelte-5` 自动转换大部分。复杂 `$:` 块 / custom stores / 测试需手动检查。

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
  let todos = $state([{ id: 1, text: 'Learn Svelte', done: false }])
</script>

<ul>
  {#each todos as todo, i (todo.id)}
    <li class:done={todo.done}>
      <input type="checkbox" bind:checked={todo.done} /> {i + 1}. {todo.text}
    </li>
  {:else}
    <li>No todos</li>
  {/each}
</ul>

<!-- 解构 -->
{#each todos as { id, text } (id)}<li>{text}</li>{/each}
```

**`(todo.id)` 是 key**——告诉 Svelte 用什么标识 diff 列表。省略 key 用 index 兜底，复用错节点。

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
  interface Props { items: T[]; row: Snippet<[T]>; empty?: Snippet }
  let { items, row, empty }: Props = $props()
</script>

<table>
  {#each items as item (item.id)}<tr>{@render row(item)}</tr>{:else}{@render empty?.()}{/each}
</table>

<!-- 使用 -->
<DataTable items={users}>
  {#snippet row(user)}<td>{user.id}</td><td>{user.name}</td>{/snippet}
</DataTable>
```

---
transition: slide-up
---

# Runes 概览

| Rune | 用途 |
|---|---|
| `$state<T>(initial)` / `$state.raw` / `$state.snapshot` | 响应式状态（深 / 浅 / 快照） |
| `$derived(expr)` / `$derived.by(fn)` | 派生值（表达式 + 函数版） |
| `$effect(fn)` / `$effect.pre` / `.tracking` / `.root` | 副作用 + 前置 + 追踪判断 + 作用域 |
| `$props<T>()` / `$bindable(default?)` | 组件 props + 双向绑定 |
| `$inspect(values)` / `.trace(label?)` | 开发期日志（生产剥离） |
| `$host()` | 自定义元素宿主 DOM |

> 💡 **Runes 不是函数**——编译器识别的语法，前缀 `$` 标记，运行时不存在「`$state` 函数」。

---
transition: slide-up
---

# `$state` —— 响应式状态

```svelte
<script lang="ts">
  let count = $state(0)                          // 基本类型
  let user = $state({ name: 'Alice', age: 30 })  // 深响应式（Proxy 包装）
  let todos = $state<Todo[]>([])

  function update() {
    count++                              // 直接赋值即更新
    user.name = 'Bob'                     // 深响应式
    user.address = { city: 'NY' }         // 添加新属性也响应
    todos.push({ id: 1, text: 'A' })     // 数组方法也响应
  }
</script>
```

**三要点**：① 直接读写（不是 `.value`）② 深响应式（Proxy）③ 解构会断响应。

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

  // $state.snapshot：取出干净 JS 对象（不再是 Proxy）
  let user = $state({ name: 'Alice', tags: ['vue', 'react'] })
  const plain = $state.snapshot(user)
  api.save(plain)
</script>
```

| 场景 | 推荐 |
|---|---|
| 表单 / 配置 / 用户对象 | `$state`（要改属性） |
| 后端只读数据 / Map / Set / 类实例 / 大数组 | `$state.raw` |

---
transition: slide-up
---

# `$derived` —— 派生值

```svelte
<script lang="ts">
  let firstName = $state(''), lastName = $state(''), numbers = $state<number[]>([])

  // 表达式版（最常用）
  let fullName = $derived(`${firstName} ${lastName}`)

  // 函数版（多语句、复杂逻辑）
  let stats = $derived.by(() => {
    let sum = 0
    for (const n of numbers) sum += n
    return { sum, avg: sum / numbers.length }
  })
</script>
```

**三特性**：① 懒计算（被读取时才执行）② 自动追踪 `$state` 依赖 ③ 引用相等优化下游不重渲染。

---
transition: slide-up
---

# `$effect` —— 副作用

```svelte
<script lang="ts">
  let count = $state(0)

  // 自动追踪：count 是依赖
  $effect(() => {
    document.title = `Count: ${count}`
  })

  // 带 cleanup
  $effect(() => {
    const timer = setInterval(() => count++, 1000)
    return () => clearInterval(timer)
  })
</script>
```

**要点**：自动追踪依赖（无 deps array）/ mount 时跑一次后随依赖重跑 / return cleanup / 不要派生状态用 `$derived` / `untrack(fn)` 读值不追踪。

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
  $effect.pre(() => {
    if (!container) return
    shouldScrollDown = container.scrollTop + container.clientHeight >= container.scrollHeight - 1
    messages.length   // 触发依赖追踪
  })

  // 2. $effect.tracking()：判断是否在追踪上下文
  if ($effect.tracking()) { $effect(() => { getter(); return callback }) }
</script>
```

```ts
// 3. $effect.root：组件外的 effect 作用域（插件 / 测试 Runes）
const cleanup = $effect.root(() => {
  let count = $state(0)
  $effect(() => console.log('Outside:', count))
  return () => console.log('Cleaning up')
})
```

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

  let { label, variant = 'primary', disabled, onclick, children }: Props = $props()
</script>

<button class={variant} {disabled} {onclick}>
  {#if children}{@render children()}{:else}{label}{/if}
</button>
```

**高级**：`let { class: cls, 'data-id': id, ...rest } = $props()` —— 关键字重命名 + Rest 收集

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
  // 1. $inspect：开发期响应式日志
  $inspect(count)                      // 每次 count 变化都打印
  $inspect(count, user)                // 多值
  $inspect(count).with((type, value) => console.log(type, value))

  // 追踪 derived / effect 为什么重跑
  let doubled = $derived.by(() => {
    $inspect.trace('doubled-derived')
    return count * 2
  })

  // 2. $host：仅在编译为 Custom Element 时可用
  $host().dispatchEvent(new CustomEvent('greet', { detail: 'hello' }))
</script>
```

> 💡 **`$inspect` 生产环境被剥离**——`vite build` 后编译成 no-op。

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
  let text = $state(''), count = $state(0), agreed = $state(false)
</script>

<!-- 文本 / 数字（自动转 number） -->
<input bind:value={text} />
<input type="number" bind:value={count} />

<!-- Checkbox / Textarea -->
<label><input type="checkbox" bind:checked={agreed} /> I agree</label>
<textarea bind:value={text}></textarea>

<!-- Select / File -->
<select bind:value={text}>
  <option value="a">A</option>
  <option value="b">B</option>
</select>
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
  let currentTime = $state(0), duration = $state(0), paused = $state(true)
  onMount(() => inputEl.focus())
</script>

<input bind:this={inputEl} />
<button onclick={() => inputEl.focus()}>Focus</button>

<video src="movie.mp4" bind:currentTime bind:duration bind:paused />
<p>{currentTime.toFixed(1)} / {duration.toFixed(1)}s</p>
```

**媒体可绑定**：`currentTime` / `duration` / `paused` / `volume` / `muted` / `playbackRate` / `ended` 等十几个属性，省去事件监听。

---
transition: slide-up
---

# 父子通信：Props + Callback Props

Svelte 5 没有 `createEventDispatcher`——子→父直接传函数：

```svelte
<!-- 子组件 Search.svelte -->
<script lang="ts">
  interface Props { onSearch: (q: string) => void; onCancel?: () => void }
  let { onSearch, onCancel }: Props = $props()
  let query = $state('')
</script>

<input bind:value={query} />
<button onclick={() => onSearch(query)}>Go</button>
<button onclick={onCancel}>Cancel</button>

<!-- 父组件 -->
<Search onSearch={(q) => log(q)} onCancel={() => log('cancel')} />
```

**vs v4 createEventDispatcher**：v4 `dispatch('select', { id })` + `on:select`，v5 callback props 类型推导更好。

---
transition: slide-up
---

# Stores —— `writable` / `readable` / `derived`

```ts
// stores/counter.ts
import { writable, readable, derived } from 'svelte/store'

export const count = writable(0)                                    // writable
export const time = readable(new Date(), (set) => {                 // readable
  const timer = setInterval(() => set(new Date()), 1000)
  return () => clearInterval(timer)
})
export const doubled = derived(count, ($count) => $count * 2)       // derived
export const summary = derived([count, doubled], ([$c, $d]) => `${$c} → ${$d}`)
```

```svelte
<!-- $ 自动订阅 + cleanup -->
<p>{$count} doubled = {$doubled}, Time: {$time.toLocaleTimeString()}</p>
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
let _items = $state<CartItem[]>([])

export const cart = {
  get items() { return _items },
  get total() { return _items.reduce((s, i) => s + i.quantity, 0) },
  add(item: Omit<CartItem, 'quantity'>) {
    const existing = _items.find(i => i.id === item.id)
    if (existing) existing.quantity++
    else _items.push({ ...item, quantity: 1 })
  },
  remove(id: string) { _items = _items.filter(i => i.id !== id) }
}
```

```svelte
<script lang="ts">import { cart } from '$lib/stores/cart.svelte'</script>
<p>Total: {cart.total}</p>
<button onclick={() => cart.add({ id: '1', name: 'Book' })}>Add</button>
```

> 💡 **必须用 `.svelte.ts` 后缀**——普通 `.ts` 不会被 Svelte 编译，Runes 无效。

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

<!-- DeepChild.svelte（任意层级深处） -->
<script lang="ts">
  import { getContext } from 'svelte'
  const theme = getContext<{ value: string; toggle: () => void }>('theme')
</script>
<button onclick={theme.toggle}>{theme.value}</button>
```

**API**：`setContext` / `getContext<T>` / `hasContext` / `getAllContexts`。必须在 `<script>` 顶层调用。

---
transition: slide-up
---

# 类型安全 Context（Symbol Key）

```ts
// theme-context.ts
import { getContext, setContext } from 'svelte'
interface ThemeContext { value: 'light' | 'dark'; toggle(): void }
const KEY = Symbol('theme')
export const setThemeContext = (ctx: ThemeContext) => setContext(KEY, ctx)
export const getThemeContext = (): ThemeContext => getContext<ThemeContext>(KEY)
```

```svelte
<!-- 提供 -->
<script lang="ts">
  let theme = $state<'light' | 'dark'>('light')
  setThemeContext({
    get value() { return theme },
    toggle() { theme = theme === 'light' ? 'dark' : 'light' }
  })
</script>

<!-- 消费 -->
<script lang="ts">const theme = getThemeContext()</script>
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
    ref.focus()                                                  // 客户端独占（SSR 不跑）
    data = await fetch('/api/items').then(r => r.json())
    const handler = () => console.log('online')                  // 返回 cleanup（onDestroy 简写）
    window.addEventListener('online', handler)
    return () => window.removeEventListener('online', handler)
  })

  onDestroy(() => console.log('destroyed'))                      // 双端都跑
</script>
```

`onMount` 仅客户端，`onDestroy` 双端。能在 `onMount` return cleanup 就别拆 `onDestroy`。

---
transition: slide-up
---

# `tick` / `untrack` / `flushSync`

```svelte
<script lang="ts">
  import { tick, untrack, flushSync } from 'svelte'
  let a = $state(0), b = $state(0)

  // 1. tick：等 DOM 更新
  async function clickAndMeasure() {
    count++
    await tick()
    console.log(document.querySelector('p')?.textContent)   // 新值
  }

  // 2. untrack：读值但不追踪
  $effect(() => {
    console.log('a:', a, 'b (untracked):', untrack(() => b))
  })

  // 3. flushSync：强制同步执行 pending effects（测试常用）
  a = 1; flushSync()
</script>
```

---
transition: slide-up
---

# v4 → v5 生命周期变化

| Svelte 4 | Svelte 5 | 备注 |
|---|---|---|
| `onMount` / `onDestroy` | 保留 | 建议改用 `$effect`（自动追踪 + return cleanup） |
| `beforeUpdate` / `afterUpdate` | **deprecated** | 用 `$effect.pre` / `$effect`（依赖控制） |
| `tick` | 保留 | 等 DOM 更新 |

**为什么 deprecated**：v4 任何 state 变化都触发（无依赖控制）；v5 通过显式读取实现追踪：

```svelte
<script>
  $effect.pre(() => { someState; /* before DOM */ })
  $effect(() => { someState; /* after DOM */ })
</script>
```

---
transition: slide-up
---

# 样式：默认 Scoped

```svelte
<!-- Card.svelte -->
<div class="card"><h2>Title</h2></div>
<style>
  /* 选择器自动加 hash，仅作用本组件 */
  .card { padding: 16px; border: 1px solid #ddd; }
  h2 { font-size: 18px; }
</style>
```

编译后：`<div class="card svelte-abc123">` + `.card.svelte-abc123 { ... }`

**vs React / Vue**：React 需 CSS Modules / styled-components；Vue 需 `<style scoped>` 标注；Svelte **默认 scoped**，无需额外标记。

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
<script lang="ts">let color = $state('red'), size = $state(16)</script>

<!-- style:property -->
<p style:color style:font-size={`${size}px`}>Hello</p>
```

**CSS 自定义属性传递**：

```svelte
<!-- Parent.svelte -->
<Card --bg-color="lightblue" --text-color="darkblue" />

<!-- Card.svelte -->
<style>.card { background: var(--bg-color, white); color: var(--text-color, black); }</style>
```

「父组件用 CSS 变量定制子组件」是 Svelte 独家——React / Vue 都没有内置语法糖。

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
  let active = $derived(todos.filter(t => !t.done))
</script>

<!-- animate:flip 列表项重排（FLIP 技术）-->
<ul>
  {#each todos as todo (todo.id)}
    <li animate:flip={{ duration: 300 }}>{todo.text}</li>
  {/each}
</ul>

<!-- crossfade：Todo 项在两列间「飞过去」 -->
{#each active as todo (todo.id)}
  <li in:receive={{ key: todo.id }} out:send={{ key: todo.id }}>{todo.text}</li>
{/each}
```

`flip` = **F**irst **L**ast **I**nvert **P**lay；`crossfade` 实现跨容器过渡，1 行 API（React/Vue 需 Framer Motion）。

---
transition: slide-up
---

# 自定义过渡 + `svelte/motion`

```ts
// myTransition.ts
export function whirl(node: Element, params?: { duration?: number }): TransitionConfig {
  return {
    duration: params?.duration ?? 400,
    css: (t, u) => `transform: scale(${t}) rotate(${u * 720}deg); opacity: ${t};`
  }
}
```

```svelte
<script lang="ts">
  import { tweened, spring } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  // tweened：渐变 store / spring：弹性 store
  const progress = tweened(0, { duration: 400, easing: cubicOut })
  const x = spring(0, { stiffness: 0.1, damping: 0.4 })
</script>

<div transition:whirl={{ duration: 600 }}>Spinning!</div>
<div class="bar" style:width={`${$progress}%`}></div>
```

**缓动函数**：`linear` / `cubicOut` / `bounceOut` / `elasticOut` from `svelte/easing`。

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
  let scrollY = $state(0), innerWidth = $state(0), online = $state(true)
</script>

<!-- 监听 window 事件 + 绑定属性 -->
<svelte:window
  bind:scrollY bind:innerWidth bind:online
  onkeydown={(e) => e.key === 'Escape' && console.log('Esc')}
/>

<svelte:document onvisibilitychange={handleVisibility} />
<svelte:body onmouseenter={() => isHovered = true} />
```

**`<svelte:window>` 可绑定**：`innerWidth` / `innerHeight` / `scrollX` / `scrollY` / `online` / `devicePixelRatio` 等。Svelte 自动管理 add/removeEventListener，比 `useEffect` 简洁。

---
transition: slide-up
---

# `<svelte:head>` / `<svelte:options>`

```svelte
<!-- 注入到 <head> -->
<svelte:head>
  <title>My Page Title</title>
  <meta name="description" content="Page description" />
</svelte:head>

<!-- 编译选项 -->
<svelte:options customElement="my-button" immutable={true} runes={true} />
```

**`<svelte:options>` 选项**：`customElement`（编译成 Web Component）/ `immutable`（性能优化）/ `accessors`（v4 兼容）/ `runes`（迁移期）。

> 💡 SvelteKit 自动合并多层 layout / page 的 `<svelte:head>`，子页面覆盖父 `<title>`。

---
transition: slide-up
---

# `<svelte:boundary>` —— 错误边界（v5.3+）

```svelte
<script lang="ts">
  const logError = (e: Error) => { console.error(e); sentry.captureException(e) }
</script>

<svelte:boundary onerror={logError}>
  <RiskyComponent />
  {#snippet failed(error, reset)}
    <p>Error: {error.message}</p>
    <button onclick={reset}>Retry</button>
  {/snippet}
</svelte:boundary>
```

**vs React / Vue**：React 16+ 必须用 class（`componentDidCatch`）；Svelte 5.3+ 声明式元素 + snippet；Vue 3 用 `onErrorCaptured`。

---
transition: slide-up
---

# Actions —— `use:` 自定义指令

```ts
// actions/clickOutside.ts
import type { Action } from 'svelte/action'

export const clickOutside: Action<HTMLElement, () => void> = (node, callback) => {
  const handle = (e: MouseEvent) => {
    if (!node.contains(e.target as Node)) callback()
  }
  document.addEventListener('click', handle, true)
  return { destroy: () => document.removeEventListener('click', handle, true) }
}
```

```svelte
<script lang="ts">let open = $state(false)</script>
{#if open}<div use:clickOutside={() => open = false}>Dropdown</div>{/if}
```

**vs React Hook / Vue 自定义指令**：Svelte `use:fn={params}` 一行；返回 `{ update, destroy }`；类型 `Action<E, P>`。

---
transition: slide-up
---

# Action with `update`

```ts
// actions/tooltip.ts
interface TooltipParams { text: string; position?: 'top' | 'bottom' }

export const tooltip: Action<HTMLElement, TooltipParams> = (node, params) => {
  const el = document.createElement('div')
  el.textContent = params.text
  const show = () => { /* 定位 + appendChild */ }
  const hide = () => el.remove()
  node.addEventListener('mouseenter', show)
  node.addEventListener('mouseleave', hide)

  return {
    update(p) { el.textContent = p.text },
    destroy() {
      node.removeEventListener('mouseenter', show)
      node.removeEventListener('mouseleave', hide)
      el.remove()
    }
  }
}
```

```svelte
<button use:tooltip={{ text: 'Click me' }}>Hover</button>
```

---
transition: slide-up
---

# SvelteKit 是什么

SvelteKit 是 Svelte 官方元框架（基于 Vite），类比 Vue 的 Nuxt / React 的 Next.js：

文件系统路由（`src/routes/`）/ SSR + Hydration / Form Actions（渐进增强）/ Server Endpoints（`+server.ts`）/ Server-only modules（`$lib/server/`）/ Hooks（中间件）/ 多 Adapter / 内置 alias（`$lib` / `$app/*` / `$env/*`）

| Adapter | 用途 |
|---|---|
| **adapter-auto** / **node** | 自动检测 / 自托管 Node.js |
| **adapter-static** / **vercel** | SSG / Vercel Edge / Serverless |
| **adapter-cloudflare** / **netlify** | Cloudflare Workers / Netlify Functions |

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
{#each data.posts as post (post.id)}<li>{post.title}</li>{/each}
```

```ts
// src/routes/users/[id]/+page.ts
export const load: PageLoad = async ({ params, fetch, parent }) => {
  const parentData = await parent()                              // 合并父 layout data
  const res = await fetch(`/api/users/${params.id}`)
  if (!res.ok) throw error(404, 'User not found')
  return {
    user: await res.json(),
    posts: fetch(`/api/users/${params.id}/posts`).then(r => r.json())   // stream
  }
}
```

---
transition: slide-up
---

# Universal vs Server Load

| 文件 | 运行位置 | 用途 |
|---|---|---|
| `+page.ts` / `+layout.ts` | 客户端 + 服务端 | universal load |
| `+page.server.ts` / `+layout.server.ts` | **仅服务端** | 数据库 / 密钥 / cookies |

```ts
// +page.server.ts —— 服务端独占
export const load: PageServerLoad = async ({ locals, params }) => {
  const user = await db.user.findUnique({ where: { id: params.id } })
  if (!user || user.orgId !== locals.user?.orgId) throw error(403, 'Forbidden')
  return { user }
}
```

**对比 Next.js**：Next.js 用 `'use client'` 切换 Server / Client；SvelteKit 用文件名 `+page.server.ts` vs `+page.ts`，更显式。

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
  {#if form?.error}<p>{form.error}</p>{/if}
</form>
```

```ts
// +page.server.ts
export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData()
    const user = await db.user.findUnique({ where: { email: data.get('email') as string } })
    if (!user) return fail(400, { error: 'Invalid' })
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
<form method="POST" action="?/login" use:enhance>...</form>
<form method="POST" action="?/register" use:enhance>...</form>
<form method="POST" action="?/logout" use:enhance><button>Logout</button></form>
```

**Form Actions 优势**：渐进增强（无 JS 也能用）/ 类型安全（`Actions` 自动推导）/ 进度可视（`use:enhance` 自动 disable + loading）/ 无需手写 fetch。

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
import type { Handle, HandleServerError } from '@sveltejs/kit'
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

export const handleError: HandleServerError = ({ error }) => {
  console.error(error)
  return { message: 'Internal error' }
}
```

---
transition: slide-up
---

# 渲染模式 + Streaming SSR

```ts
export const ssr = true        // 服务端渲染（默认）
export const csr = true        // 客户端 Hydration（默认）
export const prerender = false // 构建时预渲染
```

| ssr / csr / prerender | 类型 |
|---|---|
| true / true / false | 默认 SSR + CSR |
| true / true / true | **SSG**（构建时预渲染） |
| true / false / false | **纯 SSR**（无客户端 JS） |
| false / true / false | **SPA**（仅客户端渲染） |

**Streaming SSR**：`load` 中 `await` 的字段先返回，未 `await` 的字段流式注入。

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

<p>Path: {page.url.pathname}, Status: {page.status}</p>
{#if navigating.to}<p>Navigating to {navigating.to.url.pathname}...</p>{/if}
{#if updated.current}<button onclick={() => location.reload()}>Reload</button>{/if}
```

**vs `$app/stores`**（v2.6 之前）：`import { page } from '$app/stores'` + `{$page.url.pathname}`（需要 `$` 前缀）。新代码推荐 `$app/state`。

---
transition: slide-up
---

# TypeScript 集成 + 泛型组件

```svelte
<!-- DataTable.svelte -->
<script lang="ts" generics="T extends { id: string }">
  import type { Snippet } from 'svelte'
  interface Props { items: T[]; row: Snippet<[T]>; keyExtractor?: (i: T) => string }
  let { items, row, keyExtractor = (i) => i.id }: Props = $props()
</script>

<table>
  {#each items as item (keyExtractor(item))}<tr>{@render row(item)}</tr>{/each}
</table>

<!-- 使用：T 自动推导为 User -->
<DataTable items={users}>
  {#snippet row(user)}<td>{user.name}</td>{/snippet}
</DataTable>
```

**vs Vue Generic Components**：Vue 3.3 `<script setup lang="ts" generic="T">`，写法几乎一致。

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
export default defineConfig({
  plugins: [sveltekit()],
  test: { environment: 'jsdom', globals: true, setupFiles: ['./src/test-setup.ts'] }
})
```

```ts
// Counter.test.ts
import { render, screen } from '@testing-library/svelte'
import { fireEvent } from '@testing-library/dom'
import Counter from './Counter.svelte'

it('increments on click', async () => {
  render(Counter, { props: { initial: 0 } })
  await fireEvent.click(screen.getByRole('button', { name: /\+1/ }))
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
it('increments', () => {
  const cleanup = $effect.root(() => {
    counter.increment()
    flushSync()
    expect(counter.count).toBe(1)
    expect(counter.doubled).toBe(2)
  })
  cleanup()
})
```

`$effect.root` 创建独立作用域；`flushSync` 强制同步执行 pending effects。

---
transition: slide-up
---

# E2E：Playwright

```ts
// playwright.config.ts
export default defineConfig({
  webServer: { command: 'pnpm build && pnpm preview', port: 4173 },
  testDir: 'tests'
})

// tests/login.spec.ts
test('login flow', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

**测试栈**：单元 Vitest + `@testing-library/svelte`；浏览器测试 Vitest browser mode；E2E Playwright；组件 `@playwright/experimental-ct-svelte`

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

```svelte
<script>let count = $state(0)</script>
<button onclick={() => count++}>Clicks: {count}</button>
```

简化后的编译输出（Svelte 5 内部表示）：

```js
import * as $ from 'svelte/internal/client'

function App($$anchor, $$props) {
  let count = $.state(0)
  const template = $.template(`<button> </button>`)
  const button = template()
  const text = button.firstChild

  button.addEventListener('click', () => $.set(count, $.get(count) + 1))
  $.template_effect(() => $.set_text(text, `Clicks: ${$.get(count)}`))
  $.append($$anchor, button)
}
```

**关键**：没有 vnode、没有 reconcile、没有组件函数重跑——直接 addEventListener + 局部 setText。

---
transition: slide-up
---

# Runes 反应式 = Signals

Svelte 5 Runes 内部是 **signals**（与 Solid / Preact Signals 同思路）：

```ts
// 简化的内部表示
interface Signal<T> { value: T; consumers: Set<Computation> }
interface Computation { fn: () => void; deps: Set<Signal<any>> }
```

**依赖图**：`count (signal) → doubled (derived) → effect`

**推-拉混合（Push-Pull）**：

- `count = 1` → push 通知 consumers「我变了」（标记 dirty，不立即重算）
- 读 `doubled` → pull 此时才计算（懒）
- `$effect` 在 microtask 里 batched 触发

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
  let a = $state(0), b = $state(0)
  $effect(() => console.log('effect:', a, b))

  function update() {
    a = 1; b = 1
    // effect 只跑一次（batched），不是两次
  }
</script>
```

**强制同步**：`flushSync()` 立即执行所有 pending effects（测试时保证断言时所有 effect 已跑完）。

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

**自动转换**：`on:click` → `onclick` / `$:` → `$state` / `$derived` / `$effect` / `export let` → `$props()` / `createEventDispatcher` → callback / `<slot>` → `{#snippet}` + `{@render}` / `<script context="module">` → `<script module>`

**手动检查**：复杂 `$:` 块 / 自定义 stores / 测试代码（mount/unmount API）/ `beforeUpdate` `afterUpdate` 改为 `$effect.pre` / `$effect` / `<svelte:component this={X}>` 可去掉（v5 直接 `<X>`）

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

  // 2. 代码分割（lazy load 组件）
  let Modal = $state<typeof import('./Modal.svelte').default | null>(null)
  async function openModal() {
    if (!Modal) Modal = (await import('./Modal.svelte')).default
  }
</script>

<!-- 3. immutable 优化（props 引用稳定） -->
<svelte:options immutable />
```

**4. 列表虚拟化**（>500 行）：`@tanstack/svelte-virtual` 的 `createVirtualizer` + `$derived`

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
| 后端 / 渲染 | Rust / 系统 WebView | Node.js / 嵌入 Chromium |
| Bundle / 内存 | ~5-10 MB / ~50 MB | ~100-150 MB / ~200-500 MB |
| 启动 / 跨平台 | 毫秒级 / WebView 差异 | 数百毫秒 / Chromium 一致 |
| 生态 | 较新（2022） | 老牌（2013） |

**结论**：新项目优先 **Tauri**（极小体积 + 高性能）；强 Node.js 集成（VS Code 类）用 Electron；移动用 **Capacitor**（adapter-static）；Svelte Native 已沉寂。

---
transition: slide-up
---

# Web Components 输出

Svelte 可编译组件为原生 Custom Element：

```svelte
<!-- MyButton.svelte -->
<svelte:options customElement="my-button" />
<script lang="ts">
  let { label = 'Click', variant = 'primary' } = $props()
</script>
<button class={variant}>{label}</button>
```

```html
<!-- 任意 HTML 中使用 -->
<my-button label="Save" variant="primary"></my-button>
```

**用途**：给非 Svelte 项目输出组件 / 微前端框架无关「壳」 / 设计系统跨技术栈复用。

---
transition: slide-up
---

# UI 库选型

| UI 库 | 风格 | 适用场景 |
|---|---|---|
| **Skeleton UI** / **shadcn-svelte** | Tailwind 设计系统 / 复制粘贴源码 | 快速搭建 / 完全控制 |
| **Bits UI / Melt UI** | 无样式 Headless | 自定义样式 |
| **Flowbite Svelte** / **SVAR** | Tailwind UI / 企业级数据 | 后台 / CRM / ERP |
| **Svelte Material UI** / **Carbon** | MD3 / IBM Carbon | Material / 企业风 |

> 💡 新项目先确认 Svelte 5 + Runes 支持情况。无样式 + 自定义首选 **shadcn-svelte** / **Bits UI**。

---
transition: slide-up
---

# 样式 / i18n / 数据 / 图标 / 测试生态

| 类别 | 推荐 |
|---|---|
| **样式 / UI** | Tailwind / UnoCSS；shadcn-svelte / Bits UI / Melt UI |
| **i18n / 表单** | Paraglide（编译时）；Form Actions + Superforms + Zod |
| **数据 / ORM** | SvelteKit `load`（首选）；Prisma / Drizzle / Kysely |
| **图标 / 认证** | lucide-svelte / iconify；Auth.js / Lucia / Clerk |
| **测试 / Storybook** | Vitest + `@testing-library/svelte` + Playwright；官方支持 |
| **桌面 / 移动 / 微前端** | Tauri / Electron；Capacitor + adapter-static；编译 Web Component |

---
transition: slide-up
---

# Svelte 5 vs Solid

| 维度 | Svelte 5 | Solid |
|---|---|---|
| 模板 / 反应式 | 控制流块 / `let count = $state(0)` | JSX / `[count, setCount] = createSignal(0)` |
| 派生 / Effect | `$derived(...)` / `$effect(...)` | `createMemo(...)` / `createEffect(...)` |
| 编译 / 生态 | 模板 → 命令式 DOM / SvelteKit 较成熟 | JSX → 命令式 DOM / SolidStart 较新 |

- Svelte 更接近 HTML，Solid 用 JSX；Solid 反应式更纯粹（`[get, set]`）；Svelte 生态更稳。

---
transition: slide-up
---

# Svelte 5 vs Vue 3

| 维度 | Svelte 5 | Vue 3 |
|---|---|---|
| 状态 / 派生 | `$state(0)` / `$derived(x*2)` | `ref(0)` + `.value` / `computed` |
| Effect / Props | `$effect` / `$props()` | `watchEffect` / `defineProps` |
| 模板 / 双向 | `{#if}` 块 / `bind:value` + `$bindable` | `v-if` / `v-model` + `defineModel` |
| Slot / 元框架 | `{#snippet}` + `{@render}` / SvelteKit | `<slot>` + `<template #name>` / Nuxt |
| Bundle / 生态 | ~10 KB / 较小 | ~25 KB / 较大（国内尤甚） |

- 心智 Svelte 更简单（无 `.value` / 无 setup 宏）；模板 Vue 更直观；生态 Vue 大很多

---
transition: slide-up
---

# Svelte 5 vs React 19

| 维度 | Svelte 5 | React 19 |
|---|---|---|
| 状态 / 派生 | `$state(0)` / `$derived` | `useState` / `useMemo`（Compiler 自动） |
| Effect / 模板 / Slot | `$effect` / `{#if}` / `{#snippet}` | `useEffect` / JSX `&&` 三元 / children |
| 元框架 / Bundle / 招聘 | SvelteKit / ~10 KB / 较少 | Next.js / Remix / ~45 KB / 全球最大 |

- Bundle Svelte 小一个数量级；心智 Svelte 极简（无 deps array）；生态 React 巨大；React 19 + Compiler 缩小了自动 memo 差距。

---
transition: slide-up
---

# Svelte 5 vs Angular 21

| 维度 | Svelte 5 | Angular 21 |
|---|---|---|
| 状态 / 派生 / Effect | `$state` / `$derived` / `$effect` | `signal` / `computed` / `effect` |
| 模板 / DI / 范式 | `{#if}` / Context / 函数 + Runes | `@if` / Hierarchical Injector / OOP + 装饰器 |
| 元框架 / Bundle | SvelteKit / ~10 KB | Angular SSR / ~150 KB |

- Bundle Svelte 是 Angular 的 1/15；Angular 适合企业级（DI / 装饰器）；Angular Signals 设计与 Runes 是兄弟。

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
| **桌面 / 移动 H5** | Tauri / Capacitor + SvelteKit |
| **微前端 / 嵌入式** | Svelte 编译 Web Component / bundle 极小 |

**新项目选 Svelte 5 的强信号**：bundle 敏感 / 动画密集 / 全栈 SvelteKit / 团队认可 Runes

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
| `svelte` / `svelte/store` | 核心库 / Stores API |
| `svelte/transition` / `animate` / `motion` / `easing` | 过渡 + 动画 + 物理 + 缓动 |
| `svelte/action` / `compiler` / `server` / `legacy` | Action + 编译器 + SSR + v4 兼容 |
| `@sveltejs/kit` + `vite-plugin-svelte` + `adapter-*` + `svelte-check` | 元框架 + Vite + 部署 + 类型 CLI |

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
