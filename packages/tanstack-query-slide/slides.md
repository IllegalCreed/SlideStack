---
theme: seriph
background: https://cover.sli.dev
title: Welcome to TanStack Query
info: |
  Presentation TanStack Query (FKA React Query) v5.

  Learn more at [https://tanstack.com/query](https://tanstack.com/query/latest)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🐼</span>
</div>

<br/>

## TanStack Query — 服务端状态管理库

「Web 应用缺失的数据请求库」—— 获取/缓存/同步/更新服务端状态，多框架适配（React/Vue/Solid/Svelte），Tanner Linsley 出品（原 React Query，当前 v5）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/TanStack/query" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 TanStack Query，原名 React Query，Tanner Linsley 和 TanStack 团队维护，当前 v5。

定位一句话：Web 应用缺失的数据请求库 —— 专注服务端状态的获取、缓存、同步、更新。

最关键的认知：它管的是服务端状态 —— 存在远端、你不拥有、需异步获取、可能被他人改动、会过期的数据，
和 Redux/Pinia 管的客户端状态正交，两者常配合用。

框架无关，一线适配 React/Vue/Solid/Svelte/Angular。核心是创建 QueryClient 并通过 Provider 提供，
组件里用 useQuery 读、useMutation 写、useInfiniteQuery 无限滚动。

后面顺序：定位 → 对比 → 初始化与 useQuery → 状态模型与激进默认 → Mutations 乐观更新 →
缓存失效 → 进阶 → v5 改名与踩坑 → 总结。
-->

---
transition: fade-out
---

# 什么是 TanStack Query？

管「服务端状态」，与客户端状态正交

<v-clicks>

- **服务端状态**：远端的、异步的、可能被他人改动、会过期的数据 —— **不是** Redux/Pinia 管的客户端 UI 状态
- **缓存 + 同步 + 失效**：自动缓存、后台刷新（SWR）、按 `queryKey` 失效重取
- **激进默认**：开箱即「stale-while-revalidate」—— 聚焦/重连/挂载自动刷新
- **多框架**：React/Vue/Solid/Svelte/Angular 同一套心智
- **完整能力**：mutation、乐观更新、无限滚动、SSR 水合、Devtools、持久化
- **消灭样板**：告别手写 `useEffect + loading/error + 缓存`

</v-clicks>

<style>
h1 {
  background-color: #BE185D;
  background-image: linear-gradient(45deg, #BE185D 10%, #DB2777 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 服务端状态是核心定位：远端、异步、可能被他人改、会过期的数据，不是 Redux/Pinia 管的客户端 UI 状态，两者配合用。
[click] 缓存加同步加失效，自动缓存、后台刷新（SWR 模式）、按 queryKey 失效重取。
[click] 激进默认，开箱即 stale-while-revalidate，聚焦、重连、挂载自动刷新。
[click] 多框架，React/Vue/Solid/Svelte/Angular 同一套心智。
[click] 完整能力：mutation、乐观更新、无限滚动、SSR 水合、Devtools、持久化。
[click] 最大价值是消灭样板代码，告别手写 useEffect 加 loading/error 加缓存。
-->

---
transition: fade-out
---

# 与 SWR / ahooks / Redux 的区别

服务端状态 vs 客户端状态

<v-click>

| 维度 | TanStack Query | SWR | ahooks useRequest | Redux/Pinia |
|---|---|---|---|---|
| 管什么 | **服务端状态** | 服务端状态 | 服务端状态（轻） | **客户端状态** |
| 框架 | 多框架 | React | React/Vue | 多框架 |
| 能力 | **最全** | 轻量 | 轻量企业级 | 通用容器 |
| 适合 | 数据密集中大型 | 简单请求 | 中后台快速 | 复杂前端状态 |

</v-click>

<v-click>

> 💡 服务端数据用 TanStack Query / SWR / ahooks（按复杂度选）；客户端 UI 状态用 Redux/Pinia/Zustand —— 它们正交、常配合。

</v-click>

<style>
h1 {
  background-color: #BE185D;
  background-image: linear-gradient(45deg, #BE185D 10%, #DB2777 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 对比四者：TanStack Query 管服务端状态、多框架、能力最全；SWR 轻量只 React；
ahooks 轻量企业级；Redux/Pinia 管客户端状态、是通用状态容器。
[click] 结论：服务端数据按复杂度在 TanStack Query / SWR / ahooks 里选；
客户端 UI 状态用 Redux/Pinia/Zustand。它们正交、常配合，不是二选一。
-->

---
transition: fade-out
---

# 初始化 & 第一个 useQuery

```tsx
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const queryClient = new QueryClient()
// <QueryClientProvider client={queryClient}> ... </QueryClientProvider>
// Vue: app.use(VueQueryPlugin)

function Todos() {
  const { data, isPending, error } = useQuery({
    queryKey: ['todos'],                              // 必填：缓存键 + 依赖
    queryFn: ({ signal }) => fetch('/api/todos', { signal }).then((r) => r.json()), // 必填：返回 Promise
  })
  if (isPending) return <p>加载中…</p>
  if (error) return <p>出错：{error.message}</p>
  return <ul>{data.map((t) => <li key={t.id}>{t.title}</li>)}</ul>
}
```

<style>
h1 {
  background-color: #BE185D;
  background-image: linear-gradient(45deg, #BE185D 10%, #DB2777 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
初始化：创建一个 QueryClient，通过 QueryClientProvider 提供给应用。Vue 用 app.use(VueQueryPlugin)。

useQuery 两个必填：queryKey 是数组，既是缓存键又是依赖，变化自动重新请求；
queryFn 是返回 Promise 的请求函数，能拿到 signal 用于取消。
返回 data、isPending、error 等，直接渲染三态，无需手写 loading/error 状态。
-->

---
transition: fade-out
---

# 状态模型 & 激进默认

```
status（关于数据）:   pending | error | success   → isPending/isError/isSuccess
fetchStatus（关于请求）: fetching | paused | idle    → isFetching
isLoading = isPending && isFetching（首次硬加载）
```

<v-clicks>

- **两套状态正交**：`success` 的查询也能在后台 `fetching`（刷新）；离线时 `pending` 查询是 `paused`
- **激进默认**：`staleTime: 0`（立即 stale）+ 挂载/聚焦/重连自动刷新 + 失败重试 3 次 + `gcTime` 5 分钟回收
- ⚠️ 不调 `staleTime` 会很「勤快」地刷新 —— 多数团队第一件事就是设全局 `staleTime`

</v-clicks>

<style>
h1 {
  background-color: #BE185D;
  background-image: linear-gradient(45deg, #BE185D 10%, #DB2777 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
状态模型有两套：status 关于数据，pending/error/success；fetchStatus 关于请求，fetching/paused/idle。
isLoading 等于 isPending 且 isFetching，表示首次硬加载。

[click] 两套状态正交：success 的查询也能在后台 fetching 刷新，离线时 pending 查询是 paused。
[click] 激进默认：staleTime 0 立即 stale，挂载聚焦重连自动刷新，失败重试 3 次，gcTime 5 分钟回收不活跃缓存。
[click] 一个坑：不调 staleTime 会很勤快地刷新，多数团队第一件事就是按数据变化频率设全局 staleTime。
-->

---
transition: fade-out
---

# Mutations & 乐观更新四步

```tsx
const { mutate, mutateAsync } = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] })   // 1. 取消在途请求
    const prev = queryClient.getQueryData(['todos'])            // 2. 存快照
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo]) // 3. 乐观写入
    return { prev }
  },
  onError: (e, v, ctx) => queryClient.setQueryData(['todos'], ctx.prev), // 4a. 回滚
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }), // 4b. 校准
})
mutate(newTodo)  // 即发即弃（void）；await mutateAsync(newTodo) 才返回 Promise
```

<style>
h1 {
  background-color: #BE185D;
  background-image: linear-gradient(45deg, #BE185D 10%, #DB2777 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
useMutation 做写操作。乐观更新的经典四步：
onMutate 里第一步 cancelQueries 取消在途请求防覆盖，第二步 getQueryData 存快照，
第三步 setQueryData 乐观写入并返回 context；
onError 用 context 回滚；onSettled 最后 invalidateQueries 跟服务端校准。

注意 mutate 是即发即弃返回 void，await 它立即得 undefined；要等结果或拿异常用 mutateAsync 加 try/catch。
mutation 不缓存，默认也不重试，这点和 query 不同。
-->

---
transition: fade-out
---

# 缓存失效：两套匹配规则别混

<v-clicks>

- **`invalidateQueries({ queryKey })`** —— **前缀模糊匹配**（默认）：`['todos']` 匹配 `['todos', 1]`；标记 stale + 重新请求活跃查询
- **`setQueryData` / `getQueryData`** —— **精确键**：直接写/读缓存（乐观更新用），传部分键不匹配子查询
- **`refetchQueries`**（无视新鲜度强制重取）/ **`removeQueries`**（删缓存）/ **`prefetchQuery`**（预取暖缓存，返回 `Promise<void>` 不返回数据）
- **`queryKey` 确定性哈希**：对象 key 顺序无所谓，数组顺序有所谓
- **`staleTime`**（何时变 stale → 是否重取）vs **`gcTime`**（不活跃缓存何时回收）—— 两个独立计时器

</v-clicks>

<style>
h1 {
  background-color: #BE185D;
  background-image: linear-gradient(45deg, #BE185D 10%, #DB2777 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] invalidateQueries 默认前缀模糊匹配，['todos'] 能匹配 ['todos', 1]，标记 stale 并重新请求活跃查询。
[click] setQueryData 和 getQueryData 用精确键，直接写读缓存做乐观更新，传部分键不会匹配子查询 —— 两套匹配规则别混。
[click] 还有 refetchQueries 强制重取、removeQueries 删缓存、prefetchQuery 预取暖缓存（返回 Promise void 不返回数据）。
[click] queryKey 是确定性哈希，对象 key 顺序无所谓但数组顺序有所谓。
[click] staleTime 管何时变 stale 决定是否重取，gcTime 管不活跃缓存何时回收，是两个独立计时器。
-->

---
transition: fade-out
---

# 进阶 & v5 改名

<v-clicks>

- **`useInfiniteQuery`**：无限滚动，v5 **必填 `initialPageParam`** + `getNextPageParam`（返回 `undefined` 表示无下一页）；`data.pages` / `fetchNextPage` / `hasNextPage`
- **`queryOptions()` 工厂**：类型安全地复用查询配置；**`useSuspenseQuery`**：`data` 保证有值
- **SSR 水合**：`dehydrate(queryClient)` + `<HydrationBoundary>`；**Devtools**：`<ReactQueryDevtools />`；**持久化**：`persistQueryClient`
- **v5 改名**：`cacheTime`→`gcTime`、`isLoading`→`isPending`（status `'loading'`→`'pending'`）、`keepPreviousData`→`placeholderData`、**单对象签名**、`useQuery` 移除 `onSuccess`/`onError`/`onSettled`

</v-clicks>

<style>
h1 {
  background-color: #BE185D;
  background-image: linear-gradient(45deg, #BE185D 10%, #DB2777 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] useInfiniteQuery 做无限滚动，v5 必填 initialPageParam 加 getNextPageParam，返回 undefined 表示没有下一页；
data.pages 是每页数组，fetchNextPage 加载下一页，hasNextPage 判断还有没有。
[click] queryOptions 工厂类型安全复用配置；useSuspenseQuery 配 Suspense，data 保证有值不会 undefined。
[click] SSR 水合用 dehydrate 加 HydrationBoundary；Devtools 用 ReactQueryDevtools；持久化用 persistQueryClient。
[click] v5 改名务必记牢：cacheTime 改 gcTime、isLoading 改 isPending、keepPreviousData 改 placeholderData、
全部改单对象签名、useQuery 移除了 onSuccess/onError/onSettled（只 useMutation 保留）。
-->

---
layout: center
class: text-center
transition: slide-up
---

# 总结 & 资源

TanStack Query = 服务端状态的完整方案

<div class="text-left max-w-2xl mx-auto mt-4">

- **管服务端状态**：缓存/同步/失效/重试/去重一站式，与客户端状态正交
- **激进默认**：stale-while-revalidate；按需调 `staleTime` 控刷新频率
- **乐观更新四步**：`cancelQueries`→`setQueryData`→回滚→`invalidateQueries`
- **v5 记牢**：`gcTime` / `isPending` / 单对象签名 / 两套 key 匹配规则

</div>

<div class="mt-6 text-sm opacity-80">
  官网 tanstack.com/query · GitHub TanStack/query · npm @tanstack/react-query
</div>

<style>
h1 {
  background-color: #BE185D;
  background-image: linear-gradient(45deg, #BE185D 10%, #DB2777 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
收尾总结：
- TanStack Query 是服务端状态的完整方案，缓存、同步、失效、重试、去重一站式，与客户端状态正交。
- 激进默认 stale-while-revalidate，按需调 staleTime 控制刷新频率。
- 乐观更新四步：cancelQueries、setQueryData、回滚、invalidateQueries。
- v5 记牢：gcTime、isPending、单对象签名、invalidateQueries 前缀模糊 vs setQueryData 精确两套 key 匹配规则。

资源：官网 tanstack.com/query、GitHub TanStack/query、npm @tanstack/react-query。谢谢！
-->
