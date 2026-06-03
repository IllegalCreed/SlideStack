---
theme: seriph
background: https://cover.sli.dev
title: Welcome to react-use
info: |
  Presentation react-use for React developers.

  Learn more at [https://github.com/streamich/react-use](https://github.com/streamich/react-use)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🪝</span>
</div>

<br/>

## react-use — 庞大的 React Hooks 工具集

streamich 出品的社区 React Hooks 大集合（100+ hook）—— 对标 Vue 的 VueUse，按 Sensors/UI/Animations/Side-effects/State/Lifecycles 六大类组织

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/streamich/react-use" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 react-use —— streamich 出品的社区 React Hooks 库，
是 React 生态里收录 hook 数量最多、覆盖面最广的工具型 Hook 集合，100+ hook。

最关键的定位认知先说清：react-use 在「组合式函数库」象限里对标的是 Vue 的 VueUse
（广覆盖的浏览器 API + 通用工具 hook），而不是 ahooks。
react-use 没有 ahooks 那种带轮询/缓存/SWR 的重型 useRequest，
异步只有 useAsync / useAsyncFn / useAsyncRetry，轻量。

文档形态：GitHub README 按使用场景分六大类
（Sensors / UI / Animations / Side-effects / State / Lifecycles），每个 hook 配 docs 和 Storybook 演示。

后面顺序：定位 → 对比 → 安装与六大类 → 异步三件套（与 ahooks 的关键区别）→
State / Side-effects / Sensors / UI&Animations / Lifecycles → createGlobalState → 踩坑 → 总结。
-->

---
transition: fade-out
---

# 什么是 react-use？

广覆盖的 React Hooks 工具集 —— 对标 VueUse，不是 ahooks

<v-clicks>

- **收录最多、覆盖最广**：100+ hook，覆盖 传感器/UI/动画/副作用/状态/生命周期 六大场景
- **对标 VueUse**：react-use ≈ React 版的 VueUse（广覆盖工具集）；ahooks ≈ React 版的 VueHooks Plus（企业级 useRequest）
- **没有重型 useRequest**：异步只有 `useAsync`（自动）/ `useAsyncFn`（手动）/ `useAsyncRetry`（+retry），无缓存/轮询/SWR
- **每个 hook 有独立文档 + Storybook**：边看边试
- **React 专用 + TypeScript + Tree-shakeable**
- **`createGlobalState`**：无需 Context 的零依赖跨组件全局状态

</v-clicks>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #6366F1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 收录最多、覆盖最广 —— 100+ hook，六大场景。
[click] 最关键的定位：react-use 对标 VueUse，不是 ahooks。
在组合式函数库这个象限里：react-use 之于 React，约等于 VueUse 之于 Vue —— 都是广覆盖工具集；
而 ahooks 之于 React，约等于 VueHooks Plus 之于 Vue —— 都是企业级 useRequest 体系。
[click] 所以 react-use 没有重型 useRequest，异步就三个：useAsync 自动、useAsyncFn 手动、useAsyncRetry 加重试，无缓存轮询 SWR。
[click] 每个 hook 有独立文档和 Storybook 演示，上手低。
[click] React 专用、TypeScript、Tree-shakeable。
[click] 还有 createGlobalState —— 不用 Context 就能跨组件共享状态。
-->

---
transition: fade-out
---

# 与 VueUse / ahooks / SWR 的区别

定位坐标：react-use ≈ React 版 VueUse

<v-click>

| 维度 | react-use | VueUse | ahooks | SWR / TanStack Query |
|---|---|---|---|---|
| 框架 | **React** | Vue 3 | React | 多框架 |
| 定位 | **广覆盖工具集** | 广覆盖工具集 | useRequest 为核心 | **专业服务端状态** |
| 对位 | **≈ React 版 VueUse** | ≈ Vue 版 react-use | ≈ React 版 VueHooks Plus | 跨框架数据层 |
| 异步 | useAsync（轻量） | useFetch（轻量） | useRequest（轮询/缓存） | 缓存失效 + Devtools |

</v-click>

<v-click>

> 💡 要海量通用 hook 选 react-use；要带轮询/缓存的企业级请求选 ahooks；要专业服务端状态选 SWR / TanStack Query。

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #6366F1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这张表是定位坐标。横向四个库：
react-use 和 VueUse 是「广覆盖工具集」的 React 版和 Vue 版；
ahooks 和 VueHooks Plus 是「企业级 useRequest」的 React 版和 Vue 版；
SWR / TanStack Query 是跨框架的专业服务端状态层。
异步能力：react-use 和 VueUse 都轻量，ahooks 有轮询缓存，TanStack Query 最专业。
[click] 结论：海量通用 hook 用 react-use，企业级请求用 ahooks，服务端状态用 SWR / TanStack Query。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与六大类

npm i react-use，按需导入

::left::

<v-click>

**安装与导入**

```bash
npm i react-use
```

```ts
import { useToggle, useLocalStorage } from 'react-use'
```

个别 hook 需子路径，如 `import useSpring from 'react-use/lib/useSpring'`。

</v-click>

::right::

<v-click>

**六大类**

- **Sensors** — 鼠标/滚动/窗口/网络/地理
- **UI** — 音视频/全屏/点击外部/拖放
- **Animations** — useRaf/useInterval/useSpring
- **Side-effects** — 异步/存储/防抖/剪贴板
- **State** — useToggle/useList/useMap/useSetState
- **Lifecycles** — useMount/useUpdateEffect

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #6366F1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 安装一句 npm i react-use，按需导入。
个别 hook 因可选依赖需子路径导入，比如 useSpring 要从 react-use/lib/useSpring 导。
[click] 六大类记住就好定位：Sensors 传感器、UI 界面、Animations 动画、
Side-effects 副作用（含异步和存储）、State 状态、Lifecycles 生命周期。
-->

---
transition: fade-out
---

# 异步三件套（与 ahooks useRequest 的本质区别）

react-use 的异步很轻 —— 没有缓存/轮询/SWR

```tsx
import { useAsync, useAsyncFn, useAsyncRetry } from 'react-use'

// 1. useAsync —— 挂载即自动执行、deps 变化重跑，返回对象 { loading, error, value }
const state = useAsync(async () => {
  const res = await fetch(`/api/user/${id}`)
  return res.json()
}, [id])              // ⚠️ fn 用到的外部变量须进 deps

// 2. useAsyncFn —— 手动调 callback 才发起，返回 [state, callback]
const [submitState, submit] = useAsyncFn(postForm, [])
// <button onClick={() => submit(data)}>提交</button>

// 3. useAsyncRetry —— 多一个 retry()
const { loading, value, retry } = useAsyncRetry(fetchData, [])
```

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #6366F1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这是 react-use 与 ahooks 最大的区别 —— 异步能力很轻。

三件套：
- useAsync：挂载即自动执行、deps 变化重跑，语义同 useEffect，返回对象 { loading, error, value }。
  注意 fn 内用到的外部变量必须进 deps，否则不重跑或拿旧闭包值。
- useAsyncFn：手动调 callback 才发起，返回 [state, callback]，适合点击提交。
- useAsyncRetry：多一个 retry()。

关键：它们只暴露 loading/error/value，没有缓存、去重、轮询、SWR、refreshDeps。
需要这些就用 ahooks useRequest 或 SWR / TanStack Query。
还要注意 useAsync 返回对象、useAsyncFn 返回数组，别搞混。
-->

---
transition: fade-out
---

# State 类：丰富的状态 hook

注意返回形态不统一

```tsx
import { useToggle, useCounter, useList, useSet, useSetState } from 'react-use'

const [on, toggle] = useToggle(false)               // [值, 切换]；onClick={() => toggle()}
const [n, { inc, dec, reset }] = useCounter(5, 10, 1) // (initial, max, min) 钳制
const [list, { push, removeAt, filter }] = useList<string>([])
const [set, { add, has, toggle: t, reset }] = useSet(new Set())
const [state, setState] = useSetState({ a: 1, b: 2 }) // 浅合并，非替换
```

<v-click>

> ⚠️ 返回形态不统一：`useToggle`/`useCounter`/`useList`/`useSet` 是 `[state, actions]` 元组，但 `useQueue`/`useStateList` 返回**对象**。还有 `useStateWithHistory` 带撤销重做。

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #6366F1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
State 类很丰富：
- useToggle 返回 [on, toggle]，注意 onClick 要包一层 () => toggle()。
- useCounter 传 (initial, max, min) 带边界钳制。
- useList / useSet 管理集合，actions 丰富。
- useSetState 是浅合并，像 class setState，不是整体替换。

[click] 最大的坑是返回形态不统一：大部分是 [state, actions] 元组，
但 useQueue 和 useStateList 返回对象。还有 useStateWithHistory 带撤销重做历史，三元组返回。
用前一定看清每个 hook 的返回结构。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# Side-effects & Sensors

副作用 + 传感器

::left::

<v-click>

**Side-effects**

- `useLocalStorage` — `[value, setValue, remove]`，默认 JSON
- `useCookie` / `useCopyToClipboard`
- `useDebounce` — **依赖驱动**，`[isReady, cancel]`
- `useThrottle` — 节流值
- `useTitle` / `useFavicon` / `useBeforeUnload`

</v-click>

::right::

<v-click>

**Sensors**

- `useMouse` / `useScroll` / `useWindowSize`
- `useMeasure` — ResizeObserver 测尺寸
- `useNetworkState` — 在线/类型/速率
- `useGeolocation` — 地理位置
- `useHover` / `useIdle` / `useOrientation`

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #6366F1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Side-effects 副作用类：
useLocalStorage 返回 [value, setValue, remove]，默认 JSON 序列化，raw:true 原样存。
useCookie、useCopyToClipboard 复制。
useDebounce 是依赖驱动的（deps 变化触发，不是手动调），返回 [isReady, cancel]。
useThrottle 节流值。useTitle / useFavicon / useBeforeUnload 操作文档和离开拦截。

[click] Sensors 传感器类：
useMouse 鼠标坐标、useScroll 滚动、useWindowSize 窗口尺寸、
useMeasure 用 ResizeObserver 测元素尺寸、useNetworkState 网络状态、
useGeolocation 地理位置、useHover / useIdle / useOrientation。
-->

---
transition: fade-out
---

# UI / Animations / Lifecycles

<v-clicks>

- **UI**：`useFullscreen` 全屏 / `useClickAway` 点击外部（默认 mousedown+touchstart，**非 click**）/ `useAudio` `useVideo` 声明式音视频 / `useSlider` / `useDrop`
- **Animations**：`useInterval` 声明式定时器（`delay=null` 暂停）/ `useTimeoutFn` / `useRaf` / `useSpring` 弹簧 / `useTween` 缓动
- **Lifecycles**：`useMount` / `useUnmount` / `useUpdateEffect`（跳过首次）/ `useEffectOnce` / `useDeepCompareEffect` / `useIsomorphicLayoutEffect`（SSR 安全）
- **`useMountedState`** 返回**函数** —— `if (isMounted())` 要调用，别写成 `if (isMounted)`

</v-clicks>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #6366F1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] UI 类：useFullscreen 全屏、useClickAway 点击外部（注意默认事件是 mousedown+touchstart，不是 click）、
useAudio/useVideo 声明式音视频、useSlider 滑块、useDrop 拖放。
[click] Animations 类：useInterval 声明式定时器（delay 传 null 暂停）、useTimeoutFn、
useRaf、useSpring 弹簧动画、useTween 缓动。
[click] Lifecycles 类：useMount/useUnmount、useUpdateEffect 跳过首次、useEffectOnce 只跑一次、
useDeepCompareEffect 深比较依赖、useIsomorphicLayoutEffect 是 SSR 安全的 layoutEffect。
[click] 一个坑：useMountedState 返回的是函数，要 isMounted() 调用，不是直接当布尔用。
-->

---
transition: fade-out
---

# createGlobalState：零依赖全局状态

无需 Context / Redux / Zustand 跨组件共享

```tsx
import { createGlobalState } from 'react-use'

const useGlobalCount = createGlobalState<number>(0)  // 工厂生成共享态 hook

function A() {
  const [count, setCount] = useGlobalCount()
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>
}
function B() {
  const [count] = useGlobalCount()  // 与 A 共享；A 改了 B 自动重渲染
  return <span>{count}</span>
}
```

<v-click>

> 💡 state 模块级存活，组件全卸载后值仍保留；复杂场景仍建议 Redux / Zustand。相关 `createReducer` / `createStateContext`。

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #6366F1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
createGlobalState 是 react-use 一个很实用的能力：
不用 Context、不用 Redux/Zustand，一个工厂生成共享态 hook，
多个组件调用同一个生成的 hook 就共享同一份 state，任一处 setValue 触发所有订阅组件重渲染。

代码里 A 和 B 共享 useGlobalCount，A 点击加 1，B 自动跟着更新。

[click] 注意 state 是模块级存活的，组件全卸载后值仍保留；
复杂场景还是建议用 Redux 或 Zustand。相关的还有 createReducer、createStateContext。
-->

---
transition: fade-out
---

# 常见坑

<v-clicks>

- **没有 ahooks 式 useRequest**：异步只有 `useAsync` / `useAsyncFn` / `useAsyncRetry`，无缓存/轮询/SWR
- **`toggle` 不能直传 onClick**：`onClick={toggle}` 会把 event 当真值写入 → 用 `onClick={() => toggle()}`
- **返回形态不统一**：多数是 `[state, actions]`，但 `useQueue`/`useStateList` 是对象，`useAsync` 对象、`useAsyncFn` 数组
- **`useMap` 不是 ES Map**：跟踪普通对象，无 `has`/`size`；要 Set 语义用 `useSet`
- **`useSetState` 仅浅合并**：嵌套对象整层覆盖
- **`useMountedState` 返回函数**：`isMounted()` 要调用
- **`useSpring` 直接 import**；**`useMeasure` 需 ResizeObserver polyfill**；SSR 下访问 window 的 hook 要降级

</v-clicks>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #6366F1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 最重要：没有 ahooks 式 useRequest，异步就三件套，无缓存轮询 SWR。
[click] toggle 不能直传 onClick，会把 event 当真值，要包一层。
[click] 返回形态不统一，用前看清是元组还是对象。
[click] useMap 不是 ES Map，是普通对象；要 Set 语义用 useSet。
[click] useSetState 浅合并，嵌套对象整层覆盖。
[click] useMountedState 返回函数，要调用 isMounted()。
[click] useSpring 要直接 import，useMeasure 旧浏览器需 polyfill，SSR 下访问 window 的 hook 要降级。
-->

---
layout: center
class: text-center
transition: slide-up
---

# 总结 & 资源

react-use = React 版的 VueUse，100+ 通用 Hook

<div class="text-left max-w-2xl mx-auto mt-4">

- **收录最多、覆盖最广**：六大类 100+ hook，浏览器交互/状态/副作用工具一网打尽
- **异步轻量**：`useAsync` / `useAsyncFn` / `useAsyncRetry` —— 无缓存/轮询，要这些用 ahooks 或 SWR
- **`createGlobalState`**：零依赖跨组件全局状态
- **React 专用**；Vue 用对位的 VueUse；返回形态不统一，用前看清

</div>

<div class="mt-6 text-sm opacity-80">
  README github.com/streamich/react-use · Storybook streamich.github.io/react-use · npm react-use
</div>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #6366F1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
收尾总结：
- react-use 是 React 版的 VueUse，六大类 100+ hook，浏览器交互、状态、副作用工具一网打尽。
- 异步轻量，useAsync/useAsyncFn/useAsyncRetry，没有缓存轮询，要这些用 ahooks 或 SWR。
- createGlobalState 零依赖跨组件全局状态。
- React 专用，Vue 用对位的 VueUse；返回形态不统一，用前看清是元组还是对象。

资源：README、Storybook 演示、npm 包 react-use。谢谢！
-->
