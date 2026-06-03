---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Preact
info: |
  Presentation Preact — fast 3kB alternative to React.

  Learn more at [https://preactjs.com](https://preactjs.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">⚛️</span>
</div>

<br/>

## Preact — 3kB 的 React 替代品

快速、贴近 DOM，拥有与 React 相同的现代 API（Class/Hooks/JSX/Context）；通过 preact/compat 兼容 React 生态（Jason Miller 出品，当前 v10.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/preactjs/preact" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Preact —— Jason Miller 与团队维护的快速 React 替代品，当前 v10.x。

定位一句话：快速的 3kB React 替代品，拥有相同的现代 API。
核心 gzip 仅约 3kB，提供尽可能薄的虚拟 DOM 抽象，diff 简单可预测，是最快的虚拟 DOM 库之一。

它拥有与 React 几乎相同的现代 API：Class、Hooks、函数组件、JSX、Context，
但不是 React —— 最根本的差异是不实现合成事件系统，直接用浏览器原生事件。
React 生态兼容靠 preact/compat 别名。

后面顺序：定位 → 对比 React → 核心 API → 与 React 关键差异 → preact/compat →
signals → 工具链 → 踩坑 → 总结。
-->

---
transition: fade-out
---

# 什么是 Preact？

相同的 React API，但只有 3kB

<v-clicks>

- **极小体积**：核心 gzip ~3kB —— 你的代码才是应用最大的部分
- **相同现代 API**：Class / Hooks / 函数组件 / JSX / Context 与 React 一致，零学习成本
- **贴近 DOM、高性能**：最薄虚拟 DOM 抽象 + 简单可预测 diff
- **不是 React**：无合成事件（用原生 `addEventListener`）、`onInput` 而非 `onChange`、Hooks 在 `preact/hooks`
- **React 生态兼容**：`preact/compat` 别名一配，无改动跑 React 库
- **可移植可嵌入**：Deno 的 Fresh 框架即基于 Preact

</v-clicks>

<style>
h1 {
  background-color: #673AB8;
  background-image: linear-gradient(45deg, #673AB8 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 极小体积，核心 gzip 约 3kB。
[click] 相同的现代 API，Class、Hooks、函数组件、JSX、Context 与 React 一致，零学习成本。
[click] 贴近 DOM、高性能，最薄虚拟 DOM 抽象加简单可预测的 diff。
[click] 但它不是 React：无合成事件系统、用原生 addEventListener、表单用 onInput 而非 onChange、Hooks 在 preact/hooks。
[click] React 生态兼容靠 preact/compat 别名，无改动跑 React 库。
[click] 可移植可嵌入，Deno 的 Fresh 全栈框架就基于 Preact。
-->

---
transition: fade-out
---

# 与 React 的区别

相同心智，更小更快，但默认有差异

<v-click>

| 维度 | Preact | React |
|---|---|---|
| 体积 | **~3kB** | ~40kB+ |
| 事件 | **原生 addEventListener** | 合成事件 |
| 表单事件 | **`onInput`** | `onChange`（实为 input） |
| class | **`class` + `className` 都行** | 只 `className` |
| SVG | **kebab-case 原样写** | camelCase |
| Hooks 位置 | **`preact/hooks`** | `react` 核心 |

</v-click>

<v-click>

> 💡 要「React 心智 + 更小更快」选 Preact；要「最大生态/团队」用 React。Preact 也能借 `preact/compat` 跑 React 库。

</v-click>

<style>
h1 {
  background-color: #673AB8;
  background-image: linear-gradient(45deg, #673AB8 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 对比表：Preact 3kB 对 React 40kB+；事件用原生 vs 合成；表单 onInput vs onChange；
class 两个都支持 vs 只 className；SVG kebab-case vs camelCase；Hooks 在 preact/hooks vs react 核心。
[click] 结论：要 React 心智加更小更快选 Preact；要最大生态和团队用 React。Preact 也能借 compat 跑 React 库。
-->

---
transition: fade-out
---

# 核心 API & Hooks

```jsx
import { h, render, hydrate, Component, Fragment } from 'preact'
import { useState, useEffect } from 'preact/hooks'  // ⚠️ Hooks 在 preact/hooks，不在核心

// render(vdom, container[, replaceNode])，replaceNode 将在 v11 移除
render(<App />, document.getElementById('app'))

// 类组件：render(props, state) 把 props/state 作参数传入（非 this.props）
class Hello extends Component {
  render({ name }) { return <h1>Hello {name}</h1> }
}
```

<v-clicks>

- 核心：`h`/`createElement` / `render` / `hydrate`（SSR 水合）/ `Component` / `Fragment` / `createContext` / `createRef`
- Hooks（`preact/hooks`）：`useState` / `useEffect` / `useRef` / `useMemo` / `useCallback` / `useContext` / `useId` / **`useErrorBoundary`**（Preact 特有）

</v-clicks>

<style>
h1 {
  background-color: #673AB8;
  background-image: linear-gradient(45deg, #673AB8 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
核心 API：从 preact 导 h、render、hydrate、Component、Fragment。
注意 Hooks 在 preact/hooks，不在核心，从 preact 导 useState 会失败。
render 签名带可选 replaceNode，将在 v11 移除。
类组件的 render 把 props 和 state 作参数传入，不是 this.props。

[click] 核心导出：h/createElement、render、hydrate 水合、Component、Fragment、createContext、createRef。
[click] Hooks 从 preact/hooks 导：useState、useEffect、useRef、useMemo 等，
还有 Preact 特有的 useErrorBoundary，React 没有内置等价。
-->

---
transition: fade-out
---

# 与 React 的关键差异（写代码必知）

```jsx
// 1. 原生事件：表单用 onInput（不是 React 的 onChange）
<input onInput={(e) => setValue(e.currentTarget.value)} />

// 2. class 和 className 都支持（多数人用更短的 class）
<div class="card" />

// 3. SVG 属性按原样写（kebab-case）—— 可直接粘贴设计工具 SVG
<svg><path stroke-width="2" /></svg>

// 4. Hooks 从 preact/hooks 导入（从 'preact' 导会失败）
import { useState } from 'preact/hooks'
```

<v-click>

> ⚠️ 别以为 Preact 把 `onChange` 当 input 事件 —— 纯 Preact 用 `onInput`；事件不穿 Portal 冒泡；完全 React 行为靠 `preact/compat`。

</v-click>

<style>
h1 {
  background-color: #673AB8;
  background-image: linear-gradient(45deg, #673AB8 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
四个写代码必知的差异：
1. 原生事件，表单用 onInput 不是 React 的 onChange。
2. class 和 className 都支持，多数人用更短的 class。
3. SVG 属性按原样写 kebab-case，可直接粘贴设计工具导出的 SVG。
4. Hooks 从 preact/hooks 导入，从 preact 核心导会失败。

[click] 提醒：别以为 Preact 把 onChange 当 input 事件，纯 Preact 用 onInput，onChange 是真 change 语义。
事件不穿过 Portal 冒泡。要完全的 React 行为靠 preact/compat。
-->

---
transition: fade-out
---

# preact/compat：跑 React 生态库

```ts
// Vite —— 官方 preset 自动配别名 react/react-dom → preact/compat
import preact from '@preact/preset-vite'
export default { plugins: [preact()] }
```

```js
// webpack/Jest 手动别名 ⚠️ 具体键在前、宽泛键在后
resolve: { alias: {
  'react/jsx-runtime': 'preact/compat/jsx-runtime',  // 具体在前
  react: 'preact/compat',
  'react-dom': 'preact/compat',
}}
```

<v-clicks>

- 配好后 `import { forwardRef, memo, createPortal, Suspense, lazy } from 'react'` 实际走 `preact/compat`，可跑 React Router / Redux 等
- 调试：`import 'preact/debug'`（须**首位**导入，开发警告 + DevTools）/ `preact/devtools`（更轻，生产可用）

</v-clicks>

<style>
h1 {
  background-color: #673AB8;
  background-image: linear-gradient(45deg, #673AB8 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
preact/compat 是 React 兼容层。
Vite 用官方 preset 自动配别名 react 和 react-dom 指向 preact/compat。
webpack 或 Jest 手动别名，注意顺序，具体键比如 react/jsx-runtime 放在宽泛的 react 之前，否则匹配错。

[click] 配好后 import forwardRef、memo、createPortal、Suspense、lazy 从 react 实际走 preact/compat，
可以跑 React Router、Redux 等库。
[click] 调试：import 'preact/debug' 须首位导入，提供开发警告和 DevTools 钩子；preact/devtools 更轻，生产可用。
-->

---
transition: fade-out
---

# @preact/signals：细粒度响应式

```jsx
import { signal, computed, effect, batch } from '@preact/signals'

const count = signal(0)                          // .value 读写
const double = computed(() => count.value * 2)   // 派生只读信号
effect(() => console.log(count.value))           // 依赖变即重跑
count.value++

function App() {
  // JSX 里直接用 signal（无需 .value）—— 只更新这个文本节点，跳过组件级重渲染
  return <p>Value: {count}</p>
}
```

<v-clicks>

- `batch(fn)` 合并多次写入；`.peek()` / `untracked()` 读值不订阅；组件内用 `useSignal` / `useComputed`
- **vs `useState`**：useState 每次变化重渲染**整个组件**；signal 在 JSX 直接用时**只更新真正用到的节点**，跳过组件 diff

</v-clicks>

<style>
h1 {
  background-color: #673AB8;
  background-image: linear-gradient(45deg, #673AB8 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
@preact/signals 是可选的细粒度响应式状态。
signal 创建一个有 .value 属性的响应式原语，读写都通过 .value；
computed 派生只读信号；effect 依赖变化即重跑；count.value++ 触发更新。
关键：在 JSX 里直接用 signal 无需 .value，它只更新这个文本节点，跳过组件级重渲染。

[click] batch 合并多次写入让 effect 只跑一次；.peek 和 untracked 读值但不建立订阅；组件内用 useSignal、useComputed。
[click] 和 useState 的本质区别：useState 每次变化重渲染整个组件；
signal 在 JSX 直接使用时只更新真正用到它的节点，跳过组件 diff，更细粒度更快。
-->

---
transition: fade-out
---

# 工具链 & 常见坑

<v-clicks>

- **脚手架**：`npm init preact`（create-preact，含 TS/路由/ESLint）；`@preact/preset-vite`；SSR 用 `preact-render-to-string` 的 `renderToString`
- **坑 1**：Hooks 不在核心，从 `preact` 导 `useState` 失败 → 用 `preact/hooks`
- **坑 2**：表单用 `onInput` 不是 `onChange`；事件不穿 Portal 冒泡
- **坑 3**：`preact/compat` 别名顺序——具体键在宽泛键之前
- **坑 4**：SVG 用 kebab-case；类组件 `render(props, state)` 取参数
- **坑 5**：`render()` 的 `replaceNode` 将在 v11 移除；`preact/debug` 须首位导入
- **坑 6**：不是 100% React，直接迁 React 代码要么改差异、要么上 `preact/compat`

</v-clicks>

<style>
h1 {
  background-color: #673AB8;
  background-image: linear-gradient(45deg, #673AB8 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 脚手架用 npm init preact，含 TS、路由、ESLint 选项；Vite 用 @preact/preset-vite；SSR 用 preact-render-to-string 的 renderToString。
[click] 坑 1：Hooks 不在核心，从 preact 导 useState 失败，要用 preact/hooks。
[click] 坑 2：表单用 onInput 不是 onChange，事件不穿 Portal 冒泡。
[click] 坑 3：preact/compat 别名顺序，具体键放在宽泛键之前。
[click] 坑 4：SVG 用 kebab-case，类组件 render 取 props、state 参数。
[click] 坑 5：render 的 replaceNode 将在 v11 移除，preact/debug 须首位导入。
[click] 坑 6：不是 100% React，直接迁 React 代码要么改差异要么上 preact/compat。
-->

---
layout: center
class: text-center
transition: slide-up
---

# 总结 & 资源

Preact = 3kB 的 React 替代品，相同 API 更小更快

<div class="text-left max-w-2xl mx-auto mt-4">

- **3kB + 相同现代 API**：Class/Hooks/JSX/Context，React 开发者零成本
- **与 React 差异**：原生事件 `onInput`、`class`+`className`、SVG kebab、Hooks 在 `preact/hooks`
- **生态兼容**：`preact/compat` 别名跑 React 库；`@preact/signals` 细粒度响应式
- **完整工程化**：create-preact / Vite preset / SSR；Deno Fresh 基于它

</div>

<div class="mt-6 text-sm opacity-80">
  官网 preactjs.com · GitHub preactjs/preact · npm preact
</div>

<style>
h1 {
  background-color: #673AB8;
  background-image: linear-gradient(45deg, #673AB8 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
收尾总结：
- Preact 是 3kB 的 React 替代品，相同的现代 API，Class/Hooks/JSX/Context，React 开发者零成本。
- 与 React 差异：原生事件 onInput、class 和 className 都支持、SVG kebab-case、Hooks 在 preact/hooks。
- 生态兼容靠 preact/compat 别名跑 React 库；@preact/signals 提供细粒度响应式。
- 完整工程化：create-preact、Vite preset、SSR；Deno Fresh 框架基于它。

资源：官网 preactjs.com、GitHub preactjs/preact、npm 包 preact。谢谢！
-->
