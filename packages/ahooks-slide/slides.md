---
theme: seriph
background: https://cover.sli.dev
title: Welcome to ahooks
info: |
  Presentation ahooks for React developers.

  Learn more at [https://ahooks.js.org](https://ahooks.js.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🪝</span>
</div>

<br/>

## ahooks — 阿里出品的 React Hooks 库

一套高质量、可靠的 React Hooks 集合 —— 以插件化的旗舰 useRequest 为核心，约 70+ hook 分八大类（当前 v3.x，React 专用）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/alibaba/hooks" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 ahooks —— 阿里巴巴出品（GitHub alibaba/hooks）、React 生态里最主流的企业级 Hooks 库之一。

一句话定位：一套高质量、可靠的、覆盖业务高频场景的 React Hooks 集合。

核心要点先说清：
- 灵魂是那个插件化架构的旗舰 useRequest —— 把轮询、防抖、节流、聚焦刷新、错误重试、
  loading 延迟、SWR 缓存、依赖刷新、乐观更新全部内建的异步数据管理 Hook。
- 约 70+ hook，分八大类：useRequest / Scene / LifeCycle / State / Effect / Dom / Advanced / Dev。
- 还有几个明星 hook：useMemoizedFn（根治闭包陷阱）、useReactive（Vue 式可变响应状态）、useLatest。
- 当前 v3.x，React 专用（16.8~19，含 18），100% TypeScript，SSR 友好。

补一句关系：VueHooks Plus 就是「Vue 版的 ahooks」—— 两者 useRequest 心智几乎同构，只是分属 React/Vue。

后面顺序：定位 → 对比 → 安装与八大类 → useRequest 全景 → run 区别 →
State/Effect/Dom/Scene/Advanced/Dev 各类 → 踩坑 → 总结。
-->

---
transition: fade-out
---

# 什么是 ahooks？

阿里出品、以 useRequest 为核心的企业级 React Hooks 集合

<v-clicks>

- **React 专用**：服务 React 16.8~19（含 18）；Vue 项目用它的孪生兄弟 **VueHooks Plus**
- **以请求为核心**：旗舰 `useRequest` 内建轮询/缓存(SWR)/重试/防抖/聚焦刷新；分页三件套与无限滚动都建在它之上
- **`useMemoizedFn` 是日常标配**：引用恒定却总调最新闭包，根治 React 闭包陷阱
- **约 70+ hook 八大类**：useRequest / Scene / LifeCycle / State / Effect / Dom / Advanced / Dev
- **100% TypeScript**：`useRequest` 根据 service 自动推导 `data` / `run` 参数类型
- **SSR 友好 + Tree-shakeable**：浏览器 hook 提供 `getInitialValueInEffect` 规避水合不一致

</v-clicks>

<style>
h1 {
  background-color: #F5511E;
  background-image: linear-gradient(45deg, #F5511E 10%, #FF8A00 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] React 专用 —— 这是第一句话。Vue 项目别用它，用 VueHooks Plus。

[click] 以请求为核心 —— useRequest 是灵魂，分页三件套 usePagination/useAntdTable/useFusionTable
和 useInfiniteScroll 全建在它之上。

[click] useMemoizedFn 是 ahooks 用户的日常标配 —— 返回引用恒定、却总调最新闭包的函数，
根治 React 最常见的闭包陷阱，后面专门讲。

[click] 约 70+ hook，分八大类 —— 后面逐类过。

[click] 100% TypeScript —— useRequest 的泛型会根据 service 返回类型自动推导 data。

[click] SSR 友好 + 完全 Tree-shakeable —— 浏览器相关 hook 提供 getInitialValueInEffect 选项规避水合不一致。
-->

---
transition: fade-out
---

# 与 VueHooks Plus / react-use / TanStack Query 的区别

定位各有侧重

<v-click>

| 维度 | ahooks | VueHooks Plus | react-use | TanStack Query |
|---|---|---|---|---|
| 框架 | **React** | Vue 3 | React | 多框架 |
| 出品 | **阿里巴巴** | InhiblabCore | 社区 | Tanner Linsley |
| 定位 | **企业级 · useRequest 为核心** | ahooks 的 Vue 版 | 社区 Hook 大杂烩 | **专业服务端状态** |
| 适合 | React 中后台 / 一库覆盖请求+工具 | Vue 项目 | React 通用工具 | 大型数据密集应用 |

</v-click>

<v-click>

> 💡 **结论**：ahooks 与 VueHooks Plus 是同一套设计的 React/Vue 两版；要精细缓存失效 + Devtools 则选 TanStack Query。

</v-click>

<style>
h1 {
  background-color: #F5511E;
  background-image: linear-gradient(45deg, #F5511E 10%, #FF8A00 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向看四个库：
- ahooks 和 VueHooks Plus 几乎是同一套设计的 React 版和 Vue 版，useRequest 心智一致。
- react-use 是社区的 Hook 大杂烩，数量多但不如 ahooks 成体系、企业级。
- TanStack Query（React Query）是专业服务端状态管理，缓存失效和 Devtools 最强。

[click] 结论：React 中后台、想一库覆盖请求+分页+表格+工具，用 ahooks；
真正大型、以服务端数据为中心、要精细缓存失效的应用，考虑 TanStack Query。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与八大类

npm i ahooks，按需导入

::left::

<v-click>

**安装与导入**

```bash
npm i ahooks
```

```ts
import { useRequest, useMemoizedFn } from 'ahooks'
```

ESM 天然 Tree-shaking；旧 Babel 可配 `babel-plugin-import`。`useUrlState` 在独立包 `@ahooksjs/use-url-state`。

</v-click>

::right::

<v-click>

**八大类**

- **useRequest** — 异步请求（唯一插件化）
- **Scene** — 分页/无限滚动/虚拟列表…
- **LifeCycle** — useMount/useUnmount
- **State** — useSetState/useToggle…
- **Effect** — useUpdateEffect/useLockFn…
- **Dom** — useEventListener/useFullscreen…
- **Advanced** — useMemoizedFn/useReactive…
- **Dev** — useWhyDidYouUpdate

</v-click>

<style>
h1 {
  background-color: #F5511E;
  background-image: linear-gradient(45deg, #F5511E 10%, #FF8A00 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 安装一句 npm i ahooks，直接按需导入，ESM 天然 Tree-shaking。
旧版 Babel 项目可加 babel-plugin-import 进一步精确按需。
注意 useUrlState 不在主包，要单独装 @ahooksjs/use-url-state。

[click] 八大类记住就好定位：useRequest 是请求核心、Scene 是业务场景、
State/Effect/Dom 是基础三类、Advanced 是明星 hook 集中地、Dev 是调试、LifeCycle 是生命周期。
-->

---
transition: fade-out
---

# 旗舰 useRequest：data / loading / error 三件套

接收一个返回 Promise 的 service，默认自动执行

```tsx
import { useRequest } from 'ahooks'

function getUserInfo(): Promise<{ name: string }> {
  return fetch('/api/user').then((res) => res.json())
}

function Demo() {
  // 默认自动执行；data / loading / error 都是状态
  const { data, loading, error, run } = useRequest(getUserInfo)

  if (loading) return <p>加载中…</p>
  if (error) return <p>出错了：{error.message}</p>
  return <div><p>你好，{data?.name}</p><button onClick={() => run()}>刷新</button></div>
}
```

<style>
h1 {
  background-color: #F5511E;
  background-image: linear-gradient(45deg, #F5511E 10%, #FF8A00 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这是 useRequest 最基础的样子，覆盖 90% 场景。

传入一个返回 Promise 的 service，默认在组件挂载时自动执行，返回三件套：
data 成功数据、loading 加载中、error 错误，外加 run 手动触发。

对比裸 fetch：你不用自己声明 loading state、不用 try/catch 设 error、
不用 finally 关 loading —— 全部内建。传 { manual: true } 则改为手动，需 run 触发。
-->

---
transition: fade-out
---

# useRequest 能力全景

一个 hook 内建的能力，裸 fetch 要写几十行

<v-clicks>

- **自动/手动**：`manual` + `defaultParams`（首次参数）
- **就绪 `ready`**：false 不发请求，true 自动触发
- **依赖刷新 `refreshDeps`**：依赖变化自动重新请求（类似 watch）
- **轮询 `pollingInterval`**：上次完成后再等间隔；`pollingWhenHidden` 控后台暂停
- **防抖/节流**：`debounceWait` / `throttleWait`
- **聚焦刷新 `refreshOnWindowFocus`**：标签页重新聚焦自动刷新
- **缓存 SWR**：`cacheKey` + `staleTime` + `cacheTime`；`clearCache()` 清缓存
- **重试 `retryCount`** / **乐观更新 `mutate`** / 生命周期 `onBefore/onSuccess/onError/onFinally`

</v-clicks>

<style>
h1 {
  background-color: #F5511E;
  background-image: linear-gradient(45deg, #F5511E 10%, #FF8A00 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] manual + defaultParams 控制自动还是手动、首次用什么参数。
[click] ready 等依赖准备好再请求。
[click] refreshDeps 监听依赖变化自动重查，像 watch。
[click] 轮询 pollingInterval —— 注意是「上次完成后再等间隔」，不是固定频率；pollingWhenHidden 控后台暂停。
[click] 防抖 debounceWait、节流 throttleWait，搜索框标配。
[click] refreshOnWindowFocus 聚焦刷新，SWR 思路。
[click] 缓存 cacheKey + staleTime + cacheTime，独立的 clearCache 函数清缓存。
[click] 还有 retryCount 重试、mutate 乐观更新、四个生命周期回调。
这些进阶能力全是独立插件 —— useRequest 是 ahooks 唯一插件化的 hook。
-->

---
transition: fade-out
---

# run vs runAsync vs refresh（cancel 有坑）

四组触发方法，错误处理与参数不同

<v-click>

| 方法 | 返回 Promise | 错误处理 | 参数 |
|---|---|---|---|
| `run(...args)` | 否 | 自动进 `onError` 不抛 | 自定义 |
| `runAsync(...args)` | **是** | **需 try/catch** | 自定义 |
| `refresh()` | 否 | 自动捕获 | **复用上次** |
| `refreshAsync()` | 是 | 需 catch | 复用上次 |

</v-click>

<v-click>

> ⚠️ **`cancel` 的真相**：它**只让 useRequest 忽略当前 promise 的响应**，**并不会真正取消底层请求**（fetch 仍发出）。要真中止，自己接 `AbortController`。

</v-click>

<style>
h1 {
  background-color: #F5511E;
  background-image: linear-gradient(45deg, #F5511E 10%, #FF8A00 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 四组触发方法，核心两条线：
- 带 Async 的返回 Promise、错误抛出需自己 try/catch；不带的错误进 onError 不抛。
- refresh 系列复用上次参数，run 系列用你传的参数。
口诀：要结果/要 catch 用 Async，纯触发用 run，重复上次用 refresh。

[click] 一个大坑：cancel 名不副实 —— 它只让 useRequest 忽略当前 promise 的 data/error，
并不会真正取消底层请求，fetch 照样发出去。要真正中止得自己在 service 里接 AbortController。
-->

---
transition: fade-out
---

# State 类：[state, actions] 元组

ahooks 的标志性返回风格（VueHooks Plus 也继承了它）

```tsx
import { useBoolean, useToggle, useSetState, useGetState } from 'ahooks'

// useBoolean → [布尔值, { setTrue, setFalse, set, toggle }]
const [open, { toggle, setTrue, setFalse }] = useBoolean(false)

// useToggle → 两值切换 [state, { toggle, setLeft, setRight }]
const [lang, { toggle: toggleLang }] = useToggle('zh', 'en')

// useSetState → 对象浅合并（不替换），用法似 class setState
const [state, setState] = useSetState({ name: 'Tom', age: 1 })
setState({ age: 2 }) // name 保留

// useGetState → getState() 在异步回调里拿最新值（绕过闭包）
const [count, setCount, getCount] = useGetState(0)
```

<style>
h1 {
  background-color: #F5511E;
  background-image: linear-gradient(45deg, #F5511E 10%, #FF8A00 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
State 类最大特点：返回 [state, actions] 二元组 —— 这是 ahooks 的标志性风格，VueHooks Plus 也继承了它。

- useBoolean(false) → [open, { setTrue, setFalse, set, toggle }]。
- useToggle('zh','en') → 在两个任意值之间切换。
- useSetState → 对象浅合并，setState({ age: 2 }) 只改 age 保留 name，像 class setState。
- useGetState → 多返回一个 getState()，在 setTimeout/异步回调里拿到最新值，绕过 React 闭包。

还有 useResetState 一键重置、useLocalStorageState/useSessionStorageState 持久化、
useCookieState、useDebounce/useThrottle 值防抖节流等。
注意 useUrlState 在独立包 @ahooksjs/use-url-state。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# Effect 类 & Dom 类

副作用控制 + DOM 交互，自动清理

::left::

<v-click>

**Effect**

- `useUpdateEffect` — 跳过首次的 useEffect
- `useDebounceFn` / `useThrottleFn` — `{ run, cancel, flush }`
- `useInterval` / `useTimeout` — 自动清理定时器
- `useLockFn` — 异步加锁，防重复提交
- `useDeepCompareEffect` — 依赖深比较

```tsx
const submit = useLockFn(async () => {
  await postForm() // 执行中再点被忽略
})
```

</v-click>

::right::

<v-click>

**Dom**

- `useEventListener` — 自动清理监听
- `useClickAway` — 点击外部（关弹层）
- `useFullscreen` — 全屏控制
- `useInViewport` — 是否进视口
- `useKeyPress` — 键盘监听
- `useResponsive` — 响应式断点
- `useHover` / `useMouse` / `useScroll` / `useSize`
- `useTitle` / `useFavicon` / `useExternal`

</v-click>

<style>
h1 {
  background-color: #F5511E;
  background-image: linear-gradient(45deg, #F5511E 10%, #FF8A00 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Effect 类控制副作用：
- useUpdateEffect 是跳过首次渲染的 useEffect。
- useDebounceFn / useThrottleFn 返回 { run, cancel, flush }。
- useInterval / useTimeout 自动清理定时器。
- useLockFn 给异步函数加锁，提交中再点被忽略，防重复提交。

[click] Dom 类浏览器交互，全部自动清理：useEventListener、useClickAway（点外部关弹层）、
useFullscreen、useInViewport、useKeyPress、useResponsive、useHover/useMouse/useScroll/useSize、
useTitle/useFavicon/useExternal。
-->

---
transition: fade-out
---

# Scene 类：开箱即用的业务场景

建立在 useRequest 之上

<v-clicks>

- **`usePagination`**：分页，service 收 `{ current, pageSize }` 返 `{ total, list }`，返回 `pagination` 直接喂 `<Pagination />`
- **`useAntdTable` / `useFusionTable`**：表格 + 表单联动（继承 usePagination）
- **`useInfiniteScroll`**：无限滚动，触底自动加载并拼接（**必须配 `isNoMore`**，否则无限触发）
- **`useVirtualList`**：虚拟列表，只渲染可视区（`list` 须完整、容器须固定高度）
- **`useCountDown` / `useWebSocket` / `useDynamicList` / `useSelections` / `useNetwork` / `useHistoryTravel`**

</v-clicks>

<v-click>

```tsx
const { data, pagination } = usePagination(
  ({ current, pageSize }) => fetchList({ current, pageSize }),
)
// pagination.total / current / onChange 直接给 antd <Pagination/>
```

</v-click>

<style>
h1 {
  background-color: #F5511E;
  background-image: linear-gradient(45deg, #F5511E 10%, #FF8A00 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] usePagination —— 分页神器，service 收 current/pageSize 返 total/list，
返回的 pagination 对象直接喂给 antd 的 Pagination 组件。

[click] useAntdTable / useFusionTable —— 表格 + 查询表单联动，继承 usePagination，中后台标配。

[click] useInfiniteScroll —— 无限滚动，触底自动加载并自动拼接 list。
注意必须配 isNoMore 判末页，否则会无限触发加载。

[click] useVirtualList —— 虚拟列表，只渲染可视区；但它不负责加载数据，list 要完整、容器要固定高度。

[click] 还有 useCountDown 倒计时、useWebSocket、useDynamicList、useSelections 多选、
useNetwork 网络状态、useHistoryTravel 撤销重做。

[click] 看分页代码就一行，pagination 直接对接 UI 组件 —— 这种业务 hook 是 ahooks 的核心价值。
-->

---
transition: fade-out
---

# Advanced 明星 hook

闭包陷阱、可变响应、最新值

<v-clicks>

- **`useMemoizedFn`**：引用恒定、却总调最新闭包 —— `useCallback` 的更优替代，**根治闭包陷阱**，可放心进依赖数组
- **`useReactive`**：返回**可变响应式代理**，直接 `state.count++` 即更新（Vue `reactive` 式心智）
- **`useLatest`**：始终指向**最新值**的 ref —— 在定时器/闭包里拿最新 state
- **`useCreation`**：比 `useMemo` 更可靠的「仅依赖变化才重算」，适合创建昂贵实例
- **`useControllableValue`**：同时支持受控/非受控的组件状态（封装组件常用）

</v-clicks>

<v-click>

```tsx
const onSave = useMemoizedFn(() => save(form))   // 引用不变、闭包最新
const state = useReactive({ count: 0 })          // state.count++ 即更新
```

</v-click>

<style>
h1 {
  background-color: #F5511E;
  background-image: linear-gradient(45deg, #F5511E 10%, #FF8A00 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] useMemoizedFn 是 ahooks 最被推崇的 hook —— 返回引用恒定、却总调最新闭包的函数，
根治 React 闭包陷阱，可放心传子组件、进依赖数组而不引发重渲染，是 useCallback 的更优替代。

[click] useReactive —— 返回可变响应式代理对象，直接 state.count++ 就触发更新，Vue reactive 式心智，来自 Vue 的同学很亲切。

[click] useLatest —— 始终指向最新值的 ref，在 setTimeout/事件回调里拿最新 state。

[click] useCreation —— 比 useMemo 更可靠的「仅依赖变化才重算」，useMemo 不保证一定不重算，它保证，适合创建昂贵实例。

[click] useControllableValue —— 封装组件时同时支持受控/非受控，很实用。

[click] 代码两行感受一下 useMemoizedFn 和 useReactive。
-->

---
transition: fade-out
---

# Dev 调试 & 常见坑

<v-clicks>

- **Dev**：`useWhyDidYouUpdate`（打印哪些 props 变化致更新）/ `useTrackedEffect`（追哪个依赖触发 effect）
- **`manual: true` 连锁失效**（最易踩）：同时让 `refreshDeps` / 轮询自动启动 / `ready` 失效 —— 都得手动 `run`
- **`cancel` 不真取消**：只忽略响应，底层 fetch 仍发出；真中止自接 `AbortController`
- **轮询非固定间隔**：`pollingInterval` 是「上次完成后再等」，慢请求拉长周期
- **缓存共享与 `cacheTime`/`staleTime` 冲突**：设了二者会让同 `cacheKey` 的实时数据共享失效
- **`run` 吞错误**：错误进 `onError`，要拿异常用 `runAsync` + try/catch
- **React 专用 + Hook 规则**：只能在组件/自定义 Hook 顶层调用

</v-clicks>

<style>
h1 {
  background-color: #F5511E;
  background-image: linear-gradient(45deg, #F5511E 10%, #FF8A00 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Dev 类两个调试 hook：useWhyDidYouUpdate 打印哪些 props 变化导致更新，
useTrackedEffect 追踪是哪个依赖触发了 effect。

[click] 最易踩的坑：manual: true 会连锁让 refreshDeps、轮询自动启动、ready 全失效，手动模式下都得自己 run。
[click] cancel 不真取消请求，只忽略响应，真中止自接 AbortController。
[click] 轮询是上次完成后再等间隔，不是固定频率。
[click] 设了 cacheTime/staleTime 会让同 cacheKey 的实时数据共享失效。
[click] run 吞错误进 onError，要异常用 runAsync。
[click] 终究是 React Hook，受 Hook 规则约束，只能在顶层调用。
-->

---
layout: center
class: text-center
transition: slide-up
---

# 总结 & 资源

ahooks = 阿里出品的企业级 React Hooks 库，以 useRequest 为核心

<div class="text-left max-w-2xl mx-auto mt-4">

- **一行搞定异步请求状态机**：`useRequest` 内建轮询/缓存/重试/防抖/聚焦刷新，分页表格场景开箱即用
- **`useMemoizedFn` 根治闭包陷阱**：引用恒定、闭包最新，`useCallback` 的更优替代
- **70+ hook 八大类**：覆盖请求/场景/状态/副作用/DOM/进阶/调试/生命周期
- **TS + SSR + Tree-shakeable**；React 专用，Vue 用孪生的 VueHooks Plus

</div>

<div class="mt-6 text-sm opacity-80">
  文档 ahooks.js.org/zh-CN · GitHub alibaba/hooks · npm ahooks
</div>

<style>
h1 {
  background-color: #F5511E;
  background-image: linear-gradient(45deg, #F5511E 10%, #FF8A00 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
收尾总结四句话：
- 一行 useRequest 搞定异步请求状态机，轮询缓存重试防抖聚焦刷新全内建，分页表格场景开箱即用。
- useMemoizedFn 根治闭包陷阱，引用恒定闭包最新，useCallback 的更优替代。
- 70+ hook 八大类，覆盖请求/场景/状态/副作用/DOM/进阶/调试/生命周期。
- TypeScript + SSR + Tree-shakeable，React 专用，Vue 用孪生兄弟 VueHooks Plus。

资源：官方文档 ahooks.js.org/zh-CN，GitHub alibaba/hooks，npm 包 ahooks。谢谢！
-->
