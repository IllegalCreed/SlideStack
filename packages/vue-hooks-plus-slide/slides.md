---
theme: seriph
background: https://cover.sli.dev
title: Welcome to VueHooks Plus
info: |
  Presentation VueHooks Plus for Vue 3 developers.

  Learn more at [https://inhiblabcore.github.io/docs/hooks/](https://inhiblabcore.github.io/docs/hooks/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🪝</span>
</div>

<br/>

## VueHooks Plus — Vue 版的 ahooks

高性能 & 简约的 Vue 3 Hooks 库 —— 以插件化的旗舰 useRequest 为核心，约 50+ hook，Tree-shakeable + SSR 友好（当前 v2.x，要求 Vue 3.2.25+）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/InhiblabCore/vue-hooks-plus" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 VueHooks Plus —— InhiblabCore 维护的 Vue 3 组合式函数库。

一句话定位：Vue 版的 ahooks。
它把 React 生态里 ahooks 那套「以 useRequest 为核心、覆盖业务高频场景的企业级 Hook 集合」
原样搬到了 Vue 3。

核心要点先说清：
- 灵魂是那个插件化架构的旗舰 useRequest —— 一个把轮询、防抖、节流、聚焦刷新、
  错误重试、loading 延迟、SWR 缓存、依赖刷新全部内建的「请求中间层」。
- 约 50+ hook，分 State / Effect / DOM / Scene / Advanced 几大类。
- 100% TypeScript、完全 Tree-shakeable（支持单函数按需引入）、SSR 友好。
- 当前 v2.x（截至 2026 年 v2.4.3），要求 Vue 3.2.25+，Vue 3 专用，不支持 Vue 2。

后面顺序：定位 → 与 ahooks/VueUse/TanStack Query 对比 → 安装 → useRequest 全景 →
轮询/缓存/重试 → run 区别 → State/Effect/DOM/Scene 各类 hook → 踩坑 → 总结。
-->

---
transition: fade-out
---

# 什么是 VueHooks Plus？

把 ahooks 那套「以请求为核心的企业级 Hook」搬到 Vue 3

<v-clicks>

- **以请求为核心**：旗舰 `useRequest` 内建轮询 / 缓存 / 重试 / 防抖 / 聚焦刷新 —— 这是它区别于 VueUse 的杀手锏
- **ahooks 心智**：`useRequest` 的 Options / Result、`useBoolean` / `useCounter` 的 `[state, actions]` 元组，几乎与 React 的 ahooks 一致
- **约 50+ hook**：分 State / Effect / DOM / Scene / Advanced 五大类，覆盖业务高频场景
- **完全 Tree-shakeable**：支持 `import useRequest from 'vue-hooks-plus/es/useRequest'` 单函数按需引入
- **100% TypeScript**：`useRequest` 根据 service 返回类型自动推导 `data`，无需 `@types/*`
- **SSR 友好 + 自动清理**：服务端渲染不崩，DOM / 定时器类 hook 随组件 unmount 自动清理

</v-clicks>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 以请求为核心 —— 这是理解 VueHooks Plus 的第一句话。
它和 VueUse 最大的不同：VueUse 是「浏览器 API 工具集」，广度取胜；
VueHooks Plus 是「以 useRequest 为核心的业务 Hook」，深度取胜。

[click] ahooks 心智 —— 如果你用过 React 的 ahooks，几乎零学习成本。
useRequest 的配置项、useBoolean 返回 [状态, 操作方法] 元组，全是 ahooks 风格。

[click] 约 50+ hook，分五大类 —— 后面会逐类过一遍。

[click] 完全 Tree-shakeable —— 不止整包按需，还能直接 import 单个 hook 文件，体积更优。

[click] 100% TypeScript —— useRequest 的泛型会根据 service 的返回类型自动推导 data 的类型。

[click] SSR 友好 + 副作用自动清理 —— 这是组合式函数库的基本素养，它都做到了。
-->

---
transition: fade-out
---

# 与 ahooks / VueUse / TanStack Query 的区别

定位各有侧重，VueHooks Plus 与 VueUse 互补而非替代

<v-click>

| 维度 | VueHooks Plus | ahooks | VueUse | TanStack Query |
|---|---|---|---|---|
| 框架 | **Vue 3** | React | **Vue 3** | 多框架（含 Vue） |
| 核心定位 | **以 useRequest 为核心** | React 企业级 Hook | 浏览器 API 工具集（200+） | **专业服务端状态** |
| 杀手锏 | 轮询/缓存/重试/SWR | useRequest | 广度（useMouse/useDark…） | 缓存失效 + Devtools |
| 适合 | ahooks 转 Vue / 轻量请求管理 | React 项目 | 几乎所有 Vue 3 项目 | 大型数据密集应用 |

</v-click>

<v-click>

> 💡 **结论**：请求管理用 VueHooks Plus、通用工具用 VueUse（两者互补常同装）；要精细缓存失效则选 TanStack Query。

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这张表是选型的核心参考。

横向看四个库：
- VueHooks Plus 和 VueUse 都是 Vue 3，但定位不同 ——
  VueHooks Plus 以 useRequest 为核心（深度），VueUse 是 200+ 浏览器工具（广度）。
- ahooks 是 React 版，VueHooks Plus 基本是它的 Vue 移植。
- TanStack Query 是专业的服务端状态管理，缓存失效策略和 Devtools 最强。

[click] 结论一句话：请求管理用 VueHooks Plus、通用浏览器工具用 VueUse，两者互补。
真正大型、以服务端数据为中心的应用，可以考虑 TanStack Query。
注意 useToggle / useCounter / useLocalStorageState 这些 VueUse 里也有，
同装两库时要想清楚以谁为主，避免心智混乱。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与导入

整包 / 单函数按需 / 自动导入三种方式

::left::

<v-click>

**安装**

```bash
pnpm add vue-hooks-plus
```

**整包导入（配合 Tree-shaking）**

```ts
import { useRequest, useBoolean } from 'vue-hooks-plus'
```

**单函数按需引入（体积更优）**

```ts
import useRequest from 'vue-hooks-plus/es/useRequest'
```

</v-click>

::right::

<v-click>

**自动导入（免写 import）**

```ts
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
import { VueHooksPlusResolver } from '@vue-hooks-plus/resolvers'

AutoImport({
  imports: ['vue', 'vue-router'],
  dts: 'src/auto-imports.d.ts',
  resolvers: [VueHooksPlusResolver()],
})
```

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 安装就一句 pnpm add vue-hooks-plus，要求 Vue 3.2.25 以上。

导入有两种：
- 整包 import { useRequest } —— 写法简洁，配合 Tree-shaking 也只打包用到的。
- 单函数 import useRequest from 'vue-hooks-plus/es/useRequest' —— 显式只引入单个 hook。

[click] 嫌每个文件都写 import 啰嗦？官方提供 @vue-hooks-plus/resolvers，
配合 unplugin-auto-import，在 .vue 里直接调用 hook 而不写 import。
注意把生成的 auto-imports.d.ts 提交到仓库，避免 CI 首次构建报 TS 错。
webpack 配置同理，把 resolver 传给 unplugin-auto-import/webpack。
-->

---
transition: fade-out
---

# 旗舰 useRequest：data / loading / error 三件套

接收一个返回 Promise 的 service，默认自动执行

```vue
<script setup lang="ts">
import { useRequest } from 'vue-hooks-plus'

function getUserInfo(): Promise<{ name: string }> {
  return fetch('/api/user').then(res => res.json())
}
// 默认自动执行；data / loading / error 都是响应式 Ref
const { data, loading, error, run } = useRequest(getUserInfo)
</script>

<template>
  <p v-if="loading">加载中…</p>
  <p v-else-if="error">出错了：{{ error.message }}</p>
  <p v-else>你好，{{ data?.name }}</p>
  <button @click="run()">手动刷新</button>
</template>
```

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这是 useRequest 最基础的样子，也是 90% 场景的写法。

传入一个返回 Promise 的 service 函数，useRequest 默认在组件挂载时自动执行，
返回三件套：
- data —— 请求成功的数据，响应式 Ref
- loading —— 是否加载中
- error —— 请求失败的错误

外加 run 方法手动触发。模板里 v-if loading / v-else-if error / v-else 渲染数据，
就是一套完整的异步请求状态机 —— 而你只写了一行 useRequest。

对比裸 fetch：你不用自己声明 loading ref、不用 try/catch 设 error、
不用在 finally 里关 loading —— 全部内建。
-->

---
transition: fade-out
---

# useRequest 能力全景

一个 hook 内建的能力，裸 fetch 要写几十行

<v-clicks>

- **自动 / 手动**：`manual: true` 改为手动，`defaultParams` 设首次参数
- **就绪控制 `ready`**：依赖没准备好就不发请求，准备好自动触发
- **依赖刷新 `refreshDeps`**：监听响应式依赖，变化时自动重新请求（类似 watch）
- **轮询 `pollingInterval`**：按间隔重复请求，`pollingWhenHidden` 控制后台暂停
- **防抖 / 节流**：`debounceWait` / `throttleWait` —— 搜索框输入利器
- **聚焦刷新 `refreshOnWindowFocus`**：标签页重新聚焦时自动刷新（SWR 思路）
- **缓存 SWR**：`cacheKey` + `staleTime` —— 先用缓存、后台静默更新
- **重试 `retryCount`** / **乐观更新 `mutate`** / **中间件 `use`**

</v-clicks>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] manual + defaultParams —— 控制自动还是手动触发、首次用什么参数。

[click] ready —— 等某个依赖准备好再请求，常用于「userId 有值才查用户」。

[click] refreshDeps —— 监听响应式依赖，变化时自动重新请求，像 watch 一样。

[click] pollingInterval —— 轮询，按间隔重复请求，适合实时数据；
pollingWhenHidden 控制页面隐藏时是否暂停。

[click] debounceWait / throttleWait —— 防抖节流，搜索框输入的标配。

[click] refreshOnWindowFocus —— 标签页重新获得焦点时自动刷新，SWR 的经典思路。

[click] cacheKey + staleTime —— SWR 缓存，再次进页面先返回缓存、后台静默重新请求。

[click] 还有 retryCount 错误重试、mutate 乐观更新、use 中间件扩展。
这些能力全是独立插件组合而成 —— 既保证 tree-shaking，也支持自定义中间件。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 自动/手动 · ready · 依赖刷新

三种触发控制方式

::left::

<v-click>

**手动触发 + 首次参数**

```ts
const { run } = useRequest(submitForm, {
  manual: true,        // 不自动执行
  defaultParams: [1],  // run 的首次参数
})
```

**就绪控制**

```ts
const userId = ref<number>()
useRequest(() => getUser(userId.value!), {
  ready: () => !!userId.value, // 有值才请求
})
```

</v-click>

::right::

<v-click>

**依赖刷新（类似 watch）**

```ts
const page = ref(1)
const { data } = useRequest(
  () => getList(page.value),
  {
    refreshDeps: [page], // page 变自动刷新
  },
)
```

> 💡 `refreshDepsAction` 可自定义依赖变化时的动作，覆盖默认的 refresh。

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 左边两个：
- manual: true 改为手动，配 defaultParams 指定 run 的首次参数 ——
  典型场景是「点击按钮才提交表单」。
- ready —— 传一个返回布尔的函数，false 时不发请求，
  变 true 时自动触发，常用于「等 userId 有值再查」。

[click] 右边：refreshDeps —— 把响应式依赖放进数组，
依赖变化时自动用上次参数重新请求，行为像 watch。
分页场景里，page 一变就自动刷新列表。
如果默认的 refresh 不满足，可以用 refreshDepsAction 自定义动作。
-->

---
transition: fade-out
---

# 轮询 · 防抖 · 节流 · 缓存 · 重试

把复杂的请求策略变成配置项

```ts
// 轮询：每 3 秒请求一次，页面隐藏时暂停
useRequest(getStatus, { pollingInterval: 3000, pollingWhenHidden: false })

// 防抖：输入停止 500ms 后才请求（配 manual + 在事件里 run）
useRequest(search, { manual: true, debounceWait: 500 })

// SWR 缓存：先返回缓存、后台静默更新；staleTime 内不重新请求
useRequest(getUser, { cacheKey: 'user', staleTime: 5000, cacheTime: 600000 })

// 错误重试：失败后最多重试 3 次
useRequest(getUser, { retryCount: 3, retryInterval: 1000 })
```

<v-click>

> ⚠️ **踩坑**：`pollingInterval` 与 `debounceWait` / `throttleWait` 叠加时行为复杂，一般**二选一**；相同 `cacheKey` 会共享数据，key 设计需包含区分维度，否则会串数据。

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
四个最常用的高级能力，全是配置项：

- 轮询 pollingInterval：每隔几秒重复请求，pollingWhenHidden: false
  让页面切到后台时暂停，回前台恢复 —— 省流量。

- 防抖 debounceWait：搜索框输入停止 500ms 才真正请求。
  注意要配 manual: true，并在 input 事件里调 run。

- SWR 缓存：cacheKey 相同的请求共享缓存，再进页面先显示旧数据、
  后台静默重新请求。staleTime 是「新鲜期」，期内不重新请求；
  cacheTime 是「保留期」，超时清缓存。

- 重试 retryCount：失败后自动重试，retryInterval 设间隔。

[click] 两个坑：轮询和防抖节流一般二选一，叠加行为复杂；
cacheKey 是共享的，不同参数却用同一 key 会串数据，key 要带区分维度。
-->

---
transition: fade-out
---

# run vs runAsync vs refresh

四组触发方法，错误处理与参数不同

<v-click>

| 方法 | 返回 Promise | 错误处理 | 参数 | 典型用途 |
|---|---|---|---|---|
| `run(...args)` | 否 | 自动进 `onError` | 自定义 | `@click="run(id)"` |
| `runAsync(...args)` | **是** | **需 try/catch** | 自定义 | 拿结果做后续逻辑 |
| `refresh()` | 否 | 自动捕获 | **复用上次参数** | 刷新按钮 |
| `refreshAsync()` | 是 | 需 catch | 复用上次参数 | 刷新后等结果 |

</v-click>

<v-click>

```ts
run(1)                                  // 错误被内部捕获，不抛出
try {
  const user = await runAsync(1)        // 返回 Promise，错误会抛出
} catch (e) { console.error('失败', e) }
```

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是高频考点 —— 四组触发方法的区别。

核心两条线：
- 带 Async 的（runAsync / refreshAsync）返回 Promise，错误会抛出，需要你自己 try/catch；
  不带的（run / refresh）错误被内部捕获，进 onError 回调，不抛出。
- refresh 系列复用上次的参数，run 系列用你传的参数。

[click] 代码对比很直观：
run(1) 即使失败也不抛异常，错误进 onError；
runAsync(1) 返回 Promise，要拿结果或捕获异常就用它 + try/catch。

记忆口诀：要结果/要 catch 用 Async，纯触发用 run，重复上次用 refresh。
-->

---
transition: fade-out
---

# State 类：[state, actions] 元组约定

从 ahooks 继承的标志性返回风格

```ts
import { useBoolean, useToggle, useCounter, useSetState } from 'vue-hooks-plus'

// useBoolean → [布尔状态, { toggle, set, setTrue, setFalse }]
const [open, { toggle, setTrue, setFalse }] = useBoolean(false)

// useToggle → 在两个值间切换 [state, { toggle, setLeft, setRight }]
const [lang, { toggle: toggleLang }] = useToggle('zh', 'en')

// useCounter → 带 min/max 边界 [current, { inc, dec, set, reset }]
const [count, { inc, dec, reset }] = useCounter(0, { min: 0, max: 10 })

// useSetState → 合并式对象状态（不是替换）
const [state, setState] = useSetState({ name: 'Tom', age: 1 })
setState({ age: 2 }) // name 保留，仅更新 age
```

<v-click>

> 💡 还有 `useLocalStorageState` / `useUrlState` / `usePrevious` —— 注意 `useUrlState` 依赖 vue-router，需传入 `router.push`。

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
State 类 hook 最大的特点：返回 [state, actions] 二元组 —— 这是 ahooks 的标志性风格。
第一项是响应式状态，第二项是操作方法对象。

- useBoolean(false) → [open, { toggle, setTrue, setFalse }]，布尔开关。
- useToggle('zh', 'en') → 在两个值之间切换，不只是 true/false。
- useCounter(0, { min, max }) → 带边界的计数器，inc/dec 默认步进 1。
- useSetState → 合并式更新，setState({ age: 2 }) 只改 age、保留 name，
  类似 React 的 class setState。

[click] 还有 useLocalStorageState（响应式本地存储，[state, setState]）、
useUrlState（URL 同步，注意依赖 vue-router，要传 router.push）、
usePrevious（保存上一个值）。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# Effect 类 & DOM 类

副作用控制 + DOM 交互，全部自动清理

::left::

<v-click>

**Effect（副作用）**

- `useDebounceFn` / `useThrottleFn` —— 防抖/节流函数
- `useInterval` / `useTimeout` —— 自动清理的定时器
- `useLockFn` —— 异步加锁，防重复提交
- `useUpdate` —— 强制组件重渲染

```ts
// 提交中再点击被忽略，直到完成
const submit = useLockFn(async () => {
  await postForm()
})
```

</v-click>

::right::

<v-click>

**DOM（交互）**

- `useEventListener` —— 自动清理的事件监听
- `useMouse` / `useScroll` / `useSize`
- `useFullscreen` —— 全屏控制
- `useInViewport` —— 是否进入视口
- `useKeyPress` —— 键盘监听
- `useTitle` / `useFavicon` / `useNetwork`

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Effect 类 —— 控制副作用：
- useDebounceFn / useThrottleFn 返回防抖、节流后的函数。
- useInterval / useTimeout 是自动清理版的定时器，组件卸载自动 clear。
- useLockFn 很实用 —— 给异步函数加执行锁，提交中再点击被忽略，天然防重复提交。
- useUpdate 返回一个强制重渲染的函数。

[click] DOM 类 —— 浏览器交互，全部随组件卸载自动清理：
useEventListener、useMouse、useScroll、useSize、useFullscreen、
useInViewport、useKeyPress、useTitle、useFavicon、useNetwork……
这部分和 VueUse 有重叠，VueUse 覆盖更全；同装时这类工具优先用 VueUse 也行。
-->

---
transition: fade-out
---

# Scene 类：开箱即用的业务场景

复杂交互一个 hook 搞定

<v-clicks>

- **`useVirtualList`**：虚拟列表，只渲染视口内元素，万级长列表也流畅（`itemHeight` + `overscan`）
- **`useInfiniteScroll`**：无限滚动，触底自动加载下一页，多次结果自动合并（`target` + `isNoMore`）
- **`useWebSocket`**：WebSocket 封装，`latestMessage` / `sendMessage` / `readyState` + 自动重连
- **`useDrag` + `useDrop`**：拖拽，标记可拖元素与放置区

</v-clicks>

<v-click>

```ts
// 无限滚动：触底自动加载，结果自动合并
const { data, loading, loadingMore, noMore, loadMore } = useInfiniteScroll(
  (d) => getList(d?.nextId),
  { target: containerRef, isNoMore: (d) => d?.nextId === undefined },
)
```

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] useVirtualList —— 虚拟列表，只渲染视口内的行，
配 itemHeight 行高、overscan 缓冲行数，万级数据也不卡。

[click] useInfiniteScroll —— 无限滚动，滚到底部自动加载下一页，
多次请求结果自动合并成一个列表。

[click] useWebSocket —— WebSocket 封装，给你 latestMessage、sendMessage、
readyState，还有自动重连。

[click] useDrag + useDrop —— 拖拽，配合实现拖放交互。

[click] 看无限滚动的代码：传 service（接收当前数据、返回下一页）
和 target 滚动容器、isNoMore 末页判断，就拿到 data / loadingMore / noMore / loadMore
一整套分页状态 —— 这种业务 hook 是 VueHooks Plus 的另一大亮点。
-->

---
transition: fade-out
---

# 常见踩坑

写之前先知道这些

<v-clicks>

- **轮询与防抖叠加**：`pollingInterval` 与 `debounceWait` / `throttleWait` 同设行为复杂，通常二选一
- **`run` 吞错误**：`run` 的错误进 `onError` 不抛出 —— 要拿异常做后续用 `runAsync` + try/catch
- **`cacheKey` 串数据**：相同 key 共享数据，不同参数用同一 key 会串 —— key 要含区分维度
- **`useUrlState` 必须传 router**：依赖 vue-router，需显式传入 `router.push`
- **SSR hydration mismatch**：`useLocalStorageState` 等 SSR 阶段是默认值，参与首屏渲染需留意水合警告
- **与 VueUse 取舍**：工具型 hook 两库重叠 —— 建议「请求用 VueHooks Plus、通用工具用 VueUse」
- **`Hooks` 命名**：本库沿用 React 叫法，但它就是 Vue 组合式函数，受「setup 同步期调用」约束

</v-clicks>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 轮询与防抖节流叠加，行为复杂，二选一最省心。

[click] run 吞错误 —— 它的错误进 onError 不抛出，要 try/catch 拿异常就用 runAsync。

[click] cacheKey 共享是把双刃剑 —— 不同参数用同一 key 会串数据，key 要带区分维度。

[click] useUrlState 必须传 vue-router 的 router.push，否则无法同步 URL。

[click] SSR 场景，useLocalStorageState 在服务端是默认值，
参与首屏渲染时注意 hydration mismatch 警告。

[click] 与 VueUse 同装的取舍 —— 工具型 hook 两库重叠，
建议请求管理用 VueHooks Plus、通用浏览器工具用 VueUse。

[click] 最后：它叫 Hooks 但就是 Vue 的组合式函数，
不受 React Hook 规则约束，但必须在 setup 同步执行期调用。
-->

---
layout: center
class: text-center
transition: slide-up
---

# 总结 & 资源

VueHooks Plus = Vue 版 ahooks，以 useRequest 为核心

<div class="text-left max-w-2xl mx-auto mt-4">

- **一行搞定异步请求状态机**：`useRequest` 内建轮询 / 缓存 / 重试 / 防抖 / 聚焦刷新
- **ahooks 心智**：`[state, actions]` 元组、配置式 API —— React 转 Vue 零成本
- **TS + Tree-shakeable + SSR**：类型自动推导、单函数按需引入、服务端不崩
- **与 VueUse 互补**：请求用 VueHooks Plus、通用浏览器工具用 VueUse

</div>

<div class="mt-6 text-sm opacity-80">
  文档 inhiblabcore.github.io/docs/hooks · GitHub InhiblabCore/vue-hooks-plus · npm vue-hooks-plus
</div>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
收尾总结四句话：

- 一行 useRequest 搞定异步请求状态机 —— 轮询、缓存、重试、防抖、聚焦刷新全内建。
- ahooks 心智 —— [state, actions] 元组 + 配置式 API，React 团队转 Vue 几乎零成本。
- TypeScript + Tree-shakeable + SSR 友好 —— 类型自动推导、单函数按需引入、服务端不崩。
- 与 VueUse 互补 —— 请求管理用 VueHooks Plus、通用浏览器工具用 VueUse。

资源：官方文档 inhiblabcore.github.io/docs/hooks，
GitHub 仓库 InhiblabCore/vue-hooks-plus，npm 包名 vue-hooks-plus。

谢谢！
-->
