---
theme: seriph
background: https://cover.sli.dev
title: Welcome to usehooks-ts
info: |
  Presentation usehooks-ts for React developers.

  Learn more at [https://usehooks-ts.com](https://usehooks-ts.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🪝</span>
</div>

<br/>

## usehooks-ts — TypeScript-first 的精简 React Hooks 库

juliencrn 出品，刻意保持小而专注：33 个高频 hook，类型最干净，SSR 友好，纯 ESM，每个 hook 单文件可复制（当前 v3.1.1）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/juliencrn/usehooks-ts" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 usehooks-ts —— Julien Caron（juliencrn）维护的 TypeScript-first React Hooks 库。

定位一句话：最克制、类型最干净、即拿即用的基础 React Hooks。
当前 v3.1.1，刻意保持小而专注，只有 33 个高频 hook。

它在组合式函数库里是最克制的一档：比 react-use（100+）和 ahooks（企业级）都小、更聚焦，
完全没有数据请求 hook —— v3 已移除 useFetch，也没有 ahooks 式 useRequest。

特点：100% TypeScript、SSR 友好、纯 ESM、完全 Tree-shakeable，
每个 hook 独立单文件，文档站 usehooks-ts.com 上可直接复制源码，甚至可以不装包直接拷进项目。

后面顺序：定位 → 对比 → 安装与 v3 变更 → 对象vs元组陷阱 → 状态 → 存储 →
主题媒体/DOM → 定时防抖 → 生命周期与移除清单 → 总结。
-->

---
transition: fade-out
---

# 什么是 usehooks-ts？

最克制、类型最干净的一档 React Hooks 库

<v-clicks>

- **小而精**：仅 33 个高频 hook，比 react-use（100+）/ ahooks（企业级）都小、更聚焦
- **TypeScript-first**：100% TS 编写，类型体验最好，无需额外 `@types`
- **单文件可复制**：每个 hook 独立单文件，文档站可直接拷源码 —— 甚至可以不装包
- **完全没有数据请求**：v3 移除 `useFetch`，无 ahooks 式 `useRequest`，请求用 SWR / TanStack Query
- **SSR 友好 + 纯 ESM + Tree-shakeable**：`initializeWithValue` 选项规避水合不一致
- **`useLocalStorage` 跨标签同步**：自定义事件，多标签/多组件自动同步

</v-clicks>

<style>
h1 {
  background-color: #0D9488;
  background-image: linear-gradient(45deg, #0D9488 10%, #10B981 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 小而精，仅 33 个高频 hook，是组合式函数库里最克制的一档。
[click] TypeScript-first，类型体验最好。
[click] 每个 hook 单文件，文档站可直接复制源码，甚至不装包直接拷进项目。
[click] 完全没有数据请求 hook —— v3 移除了 useFetch，请求用 SWR / TanStack Query。
[click] SSR 友好、纯 ESM、Tree-shakeable，提供 initializeWithValue 规避水合不一致。
[click] useLocalStorage 通过自定义事件实现跨标签和多组件同步。
-->

---
transition: fade-out
---

# 与 react-use / ahooks 的区别

要克制选 usehooks-ts，要广覆盖选 react-use，要请求选 ahooks

<v-click>

| 维度 | usehooks-ts | react-use | ahooks |
|---|---|---|---|
| 规模 | **小而精（33）** | 大而全（100+） | 企业级（70+） |
| 风格 | **TS-first、克制** | 社区大杂烩 | 阿里、成体系 |
| 数据请求 | **无**（v3 移除 useFetch） | useAsync（轻量） | useRequest（轮询/缓存/SWR） |
| 适合 | 少而干净的基础 hook | 海量通用 hook | 企业级请求管理 |

</v-click>

<v-click>

> 💡 usehooks-ts 胜在「类型干净、依赖少、看得懂源码」；输在「覆盖面」。选型看你要「克制」还是「全能」。

</v-click>

<style>
h1 {
  background-color: #0D9488;
  background-image: linear-gradient(45deg, #0D9488 10%, #10B981 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三个库对比：usehooks-ts 最小（33），react-use 最全（100+），ahooks 企业级（70+，含 useRequest）。
数据请求能力：usehooks-ts 完全没有，react-use 有轻量 useAsync，ahooks 有重型 useRequest。
[click] 结论：要类型干净、依赖少、看得懂源码选 usehooks-ts；要海量通用 hook 选 react-use；
要企业级请求管理选 ahooks。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与 v3 重大变更

npm i usehooks-ts，纯 ESM 包

::left::

<v-click>

**安装与导入**

```bash
npm i usehooks-ts
```

```ts
import { useBoolean, useLocalStorage } from 'usehooks-ts'
```

纯 ESM（v3 起）；React 16.8 ~ 19。

</v-click>

::right::

<v-click>

**v3 破坏性变更（升级必读）**

- `useDebounce` **拆分** → `useDebounceValue` + `useDebounceCallback`
- **移除**：`useFetch` / `useSsr` / `useElementSize` / `useUpdateEffect` / `useIsFirstRender`
- 整包改 **ESM-only**
- `useLocalStorage` 元组**新增第 3 元素 `removeValue`**（v3.1.0）

</v-click>

<style>
h1 {
  background-color: #0D9488;
  background-image: linear-gradient(45deg, #0D9488 10%, #10B981 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 安装一句 npm i usehooks-ts，纯 ESM 包，支持 React 16.8 到 19。
[click] v3 破坏性变更很多，从 v2 升级必读：
useDebounce 拆成 useDebounceValue 和 useDebounceCallback；
移除了 useFetch、useSsr、useElementSize、useUpdateEffect、useIsFirstRender；
整包改成 ESM-only；useLocalStorage 的返回元组新增第三个元素 removeValue。
按旧签名写的代码会直接报错。
-->

---
transition: fade-out
---

# 头号坑：返回形态「对象 vs 元组」不统一

同是状态 hook，返回结构却不同 —— 用前必看

```tsx
import { useBoolean, useToggle, useCounter, useLocalStorage } from 'usehooks-ts'

// 对象：按 key 解构
const { value, setTrue, setFalse, toggle } = useBoolean(false)
const { count, increment, decrement, reset } = useCounter(0)

// 元组：按位置解构（⚠️ useToggle 顺序是 [value, toggle, setValue]，toggle 在 setValue 前！）
const [on, toggleOn, setOn] = useToggle(false)
const [name, setName, removeName] = useLocalStorage('name', '') // 第三个是 removeValue
```

<v-click>

> 💡 记忆法：带 helper 名字的（setTrue/increment）→ **对象**；纯 set/value 的（存储/toggle）→ **元组**。

</v-click>

<style>
h1 {
  background-color: #0D9488;
  background-image: linear-gradient(45deg, #0D9488 10%, #10B981 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这是 usehooks-ts 最容易踩的坑：返回形态不统一。

useBoolean、useCounter、useDarkMode 返回对象，按 key 解构；
useToggle、useLocalStorage、useCopyToClipboard 返回元组，按位置解构。

特别注意 useToggle 的顺序是 [value, toggle, setValue] —— toggle 在 setValue 前，别假设成 [value, setValue, toggle]。
useLocalStorage 第三个元素是 removeValue（v3 新增）。

[click] 记忆法：带 helper 名字的返回对象，纯 set/value 的返回元组。用前查文档确认。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 状态 & 存储

::left::

<v-click>

**状态类**

- `useBoolean` → 对象 `{value,toggle,setTrue,setFalse}`
- `useToggle` → 元组 `[value,toggle,setValue]`
- `useCounter` → 对象 `{count,increment,decrement,reset}`
- `useStep` → 元组（`canGoToNextStep` 是布尔）
- `useMap` → 元组，**必须用 actions 改**

</v-click>

::right::

<v-click>

**存储 & 剪贴板（全元组）**

- `useLocalStorage` → `[value, setValue, removeValue]`，跨标签同步
- `useSessionStorage` → 同形态
- `useReadLocalStorage` → **裸值**（只读）
- `useCopyToClipboard` → `[copiedText, copy]`，`copy` 异步

</v-click>

<style>
h1 {
  background-color: #0D9488;
  background-image: linear-gradient(45deg, #0D9488 10%, #10B981 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 状态类：useBoolean 对象、useToggle 元组、useCounter 对象（注意没有 min/max，与 ahooks 不同）、
useStep 元组（canGoToNextStep 是布尔值不是函数）、useMap 元组且必须通过 actions 改（map.set 被隐藏）。
[click] 存储和剪贴板全是元组：useLocalStorage 返回三元素含 removeValue、跨标签同步；
useSessionStorage 同形态；useReadLocalStorage 是只读裸值；useCopyToClipboard 返回 [copiedText, copy]，copy 异步返回 Promise<boolean>。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 主题/媒体 & DOM/布局

::left::

<v-click>

**主题 & 媒体**

- `useDarkMode` → 对象 `{isDarkMode,toggle,...}`
- `useTernaryDarkMode` → 三态 light/dark/system
- `useMediaQuery(query)` → 裸布尔

</v-click>

::right::

<v-click>

**DOM & 布局**

- `useEventListener` / `useOnClickOutside`
- `useResizeObserver({ ref })` —— ref 在 options 内
- `useIntersectionObserver` —— 对象/元组混合
- `useScrollLock` / `useWindowSize` / `useDocumentTitle`

</v-click>

<style>
h1 {
  background-color: #0D9488;
  background-image: linear-gradient(45deg, #0D9488 10%, #10B981 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 主题与媒体：useDarkMode 对象返回，读 prefers-color-scheme 并持久化；
useTernaryDarkMode 三态 light/dark/system；useMediaQuery 返回裸布尔。
[click] DOM 与布局：useEventListener 自动清理监听、useOnClickOutside 点外部；
useResizeObserver 注意 ref 放在 options 对象内（替代被移除的 useElementSize）；
useIntersectionObserver 返回对象和元组混合；还有 useScrollLock、useWindowSize、useDocumentTitle。
-->

---
transition: fade-out
---

# 定时/防抖 & 生命周期工具

<v-clicks>

- **定时**：`useInterval(cb, delay)` / `useTimeout`（`delay=null` 暂停）/ `useCountdown(options)` → 元组 `[count, controllers]`
- **防抖（v3 拆分）**：`useDebounceValue(v, delay)` → 元组防抖**值**；`useDebounceCallback(fn, delay)` → 防抖**函数**（带 `.cancel()`/`.flush()`/`.isPending()`）
- **`useEventCallback(fn)`**：引用稳定、却总调最新闭包（类似 ahooks `useMemoizedFn`）
- **生命周期**：`useIsClient()` 裸布尔 / `useIsMounted()` 返回**函数** / `useUnmount` / `useIsomorphicLayoutEffect` / `useScript`
- ⚠️ `useUpdateEffect` 与 `useIsFirstRender` 在 **v3 已移除**，不可再导入

</v-clicks>

<style>
h1 {
  background-color: #0D9488;
  background-image: linear-gradient(45deg, #0D9488 10%, #10B981 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 定时类：useInterval / useTimeout 声明式定时器，delay 传 null 暂停；
useCountdown 接收单个 options 对象，返回元组 [count, controllers]。
[click] 防抖在 v3 拆成两个：useDebounceValue 防抖一个值返回元组、
useDebounceCallback 防抖一个函数，带 cancel/flush/isPending 方法。
[click] useEventCallback 返回引用稳定却总调最新闭包的回调，类似 ahooks 的 useMemoizedFn。
[click] 生命周期工具：useIsClient 裸布尔、useIsMounted 返回函数要调用、useUnmount、
useIsomorphicLayoutEffect、useScript 动态加载脚本。
[click] 注意 useUpdateEffect 和 useIsFirstRender 在 v3 已移除，不能再导入。
-->

---
layout: center
class: text-center
transition: slide-up
---

# 总结 & 资源

usehooks-ts = 最克制、类型最干净的 React Hooks 库

<div class="text-left max-w-2xl mx-auto mt-4">

- **小而精**：33 个高频 hook，TypeScript-first，单文件可复制
- **无数据请求**：v3 移除 useFetch，请求用 SWR / TanStack Query
- **头号坑**：返回形态「对象 vs 元组」不统一，`useToggle` 是 `[value, toggle, setValue]`
- **v3 变更多**：useDebounce 拆分、多 hook 移除、ESM-only；SSR 用 `initializeWithValue`

</div>

<div class="mt-6 text-sm opacity-80">
  文档 usehooks-ts.com · GitHub juliencrn/usehooks-ts · npm usehooks-ts
</div>

<style>
h1 {
  background-color: #0D9488;
  background-image: linear-gradient(45deg, #0D9488 10%, #10B981 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
收尾总结：
- usehooks-ts 是最克制、类型最干净的 React Hooks 库，33 个高频 hook，TypeScript-first，单文件可复制。
- 没有数据请求 hook，v3 移除了 useFetch，请求用 SWR 或 TanStack Query。
- 头号坑是返回形态对象 vs 元组不统一，useToggle 是 [value, toggle, setValue]。
- v3 破坏性变更多：useDebounce 拆分、多个 hook 移除、ESM-only；SSR 用 initializeWithValue。

资源：文档站 usehooks-ts.com、GitHub juliencrn/usehooks-ts、npm 包 usehooks-ts。谢谢！
-->
