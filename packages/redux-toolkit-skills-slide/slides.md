---
theme: seriph
background: https://cover.sli.dev
title: Redux Toolkit Skills
info: |
  Redux 官方主仓库内建的 agent 技能集：现代 Redux、状态建模、RTK Query、副作用、诊断与迁移。
  reduxjs/redux-toolkit · packages/toolkit/skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Redux Toolkit Skills

Redux 官方**主仓库内建**的 agent 技能集——现代 Redux 最佳实践 + 反模式清单

<div class="pt-6 opacity-80">
reduxjs/redux-toolkit · packages/toolkit/skills · 9 SKILL.md / 5 任务类 · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/reduxjs/redux-toolkit" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #764ABC 10%, #B085E0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Redux Toolkit Skills 是 Redux 官方把现代 Redux 最佳实践面向 AI agent 打包的技能集，藏在主仓库 packages/toolkit/skills 里。
-->

---
transition: fade-out
---

# 官方定位：主仓库内建

不单开仓库，跟框架代码同仓演进

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**在哪**

- 源在 `packages/toolkit/skills/`（8 个）
- + `packages/rtk-query-codegen-openapi/`（1 个）
- 根 `skills/` 是 **symlink** 指过去
- 跟 Angular / Next.js 官方 skill 同款

</div>
<div v-click>

**干嘛**

- 把现代 Redux 姿势打包给 agent
- 每条规则引官方文档 / 风格指南
- 版本锁 RTK（`library_version 2.11.2`）
- 专治 agent 拿 RTK 1.x 语料生成的旧代码

</div>
</div>

<div v-click class="mt-5 text-center text-sm opacity-80">

每个 `SKILL.md`：frontmatter（Use when… + type + requires + sources）→ Setup → Core Patterns → Common Mistakes

</div>

<style>
h1 { background: linear-gradient(45deg, #764ABC 10%, #B085E0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
定位：源在主仓库 packages 下，根 skills 是 symlink，跟 Angular Next.js 一样官方 skill 藏在框架仓库里。核心价值是纠偏——让 agent 别再生成 RTK 1.x 老代码。
-->

---
transition: fade-out
---

# 9 个 SKILL.md，5 大任务类

| 任务类 | 技能 |
| --- | --- |
| **build-modern-redux-apps** | `modern-redux` · `redux-dataflow` |
| **model-redux-state** | `build-slices-and-selectors` · `design-state-ownership` |
| **manage-server-data** | `adopt-rtk-query` · `generate-rtk-query-from-openapi` |
| **orchestrate-side-effects** | `handle-side-effects` |
| **evolve-and-diagnose-redux-apps** | `debug-redux-toolkit-apps` · `migrate-to-modern-redux` |

<div v-click class="mt-5 text-center text-sm opacity-80">

`type` 三种：**lifecycle**（新建/采用/调试/迁移）· **core**（数据流/建模/副作用）· **composition**（openapi codegen）

</div>

<style>
h1 { background: linear-gradient(45deg, #764ABC 10%, #B085E0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
table td { font-size: 0.9em; }
</style>

<!--
5 大任务类：建现代应用、建模状态、管服务端数据、编排副作用、演进与诊断。9 个技能按 lifecycle/core/composition 分型，各有 requires 依赖图。
-->

---
transition: fade-out
---

# modern-redux：现代默认

configureStore + typed hooks，告别 createStore 样板

```ts
// store.ts —— 默认 middleware + DevTools 全自带
export const store = configureStore({
  reducer: { counter: counterSlice.reducer },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// hooks.ts —— 组件里只用这两个，不用 connect
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

<div v-click class="mt-3 text-sm opacity-80">

反模式：`HIGH` 组件里 `import { store }` 直读 · `HIGH` 新代码用 `connect()` · `HIGH` SSR 每次渲染 `makeStore()`（用 `useState(makeStore)`）

</div>

<style>
h1 { background: linear-gradient(45deg, #764ABC 10%, #B085E0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
modern-redux 覆盖 configureStore、Provider、typed hooks、SSR store 生命周期。现代默认是 hooks 不是 connect，SSR 要在 Provider 内 useState(makeStore) 保每请求一个稳定 store。
-->

---
transition: fade-out
---

# redux-dataflow：核心心智

event → reducer → selector → render

<v-clicks>

- **dispatch 事件，不 dispatch setter**——`postAdded({...})` 说「发生了什么」，不是 `setPosts(arr)`
- **reducer 拥有状态转换**——纯函数，混合新旧数据的合并逻辑归 reducer
- **selector 派生视图**——`createSelector` 记忆化，state 只留单一真相
- **异步 reducer 校验当前状态**——`fulfilled` 里判 `status === 'pending'`，防陈旧请求覆盖

</v-clicks>

<div v-click class="mt-4 text-center text-sm opacity-80">

`CRITICAL` 在 reducer 外 mutate 从 store 读出的对象——它仍是 store 状态

</div>

<style>
h1 { background: linear-gradient(45deg, #764ABC 10%, #B085E0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
redux-dataflow 是理解 Redux 的地基：事件式 action 描述发生了什么，reducer 纯函数拥有转换，selector 记忆化派生。最严重的错是在 reducer 外修改从 store 读出的对象。
-->

---
transition: fade-out
---

# build-slices-and-selectors：写 slice

Immer + slice selectors + create.asyncThunk

```ts
export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    todoAdded(state, action) {
      state.items.push(action.payload)   // Immer：直接改
    },
  },
  selectors: { selectItems: (state) => state.items },
})
```

<div v-click class="mt-3 text-sm opacity-80">

反模式：`CRITICAL` slice 外用 mutating 语法 · `HIGH` 手写 switch reducer · `HIGH` RTK 1.x `extraReducers` 对象语法（用 `(builder) => builder.addCase()`）· `HIGH` 忘 `selectId`

</div>

<style>
h1 { background: linear-gradient(45deg, #764ABC 10%, #B085E0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
createSlice 用 Immer，reducer 里直接改；selectors 写进 slice 就近状态位置。entity adapter 管归一集合、injectInto 懒注入。反模式集中在 RTK 1.x 遗留语法。
-->

---
transition: fade-out
---

# design-state-ownership：数据放哪

不是所有东西都该进 Redux

| 数据 | 归属 |
| --- | --- |
| 共享、持久的应用状态 | **Redux slice** |
| 表单编辑态（每次击键） | **组件 `useState`**，提交才 dispatch |
| URL / 筛选参数 | **路由**，selector 边缘合并，别同步进 Redux |
| 服务端缓存数据 | **RTK Query** |

<div v-click class="mt-4 text-center text-sm opacity-80">

state key 按**领域**命名（`auth`/`posts`），不按组件（`loginScreen`/`postsList`）

</div>

<style>
h1 { background: linear-gradient(45deg, #764ABC 10%, #B085E0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
design-state-ownership 讲数据归属：共享持久态进 Redux，表单态留组件，URL 状态归路由别同步进 Redux（否则两个真相源），服务端数据归 RTK Query。命名按领域不按组件。
-->

---
transition: fade-out
---

# adopt-rtk-query：服务端数据缓存

createApi + tag 失效，服务端数据首选

```ts
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Post'],
  endpoints: (build) => ({
    getPosts: build.query({ query: () => 'posts', providesTags: ['Post'] }),
    addPost: build.mutation({
      query: (body) => ({ url: 'posts', method: 'POST', body }),
      invalidatesTags: ['Post'],   // 变更后自动重取
    }),
  }),
})
```

<div v-click class="mt-2 text-sm opacity-80">

`CRITICAL` 一个后端多个 API 根（用 `injectEndpoints`）· `HIGH` 漏接 `api.reducer`/`api.middleware` · 失效只重取**活跃订阅**的查询

</div>

<style>
h1 { background: linear-gradient(45deg, #764ABC 10%, #B085E0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
RTK Query 是服务端数据首选：createApi 定义 endpoints，providesTags/invalidatesTags 管缓存失效，乐观更新写在 onQueryStarted lifecycle。一个后端只建一个 API 根，用 injectEndpoints 拆。
-->

---
transition: fade-out
---

# generate-rtk-query-from-openapi

从 OpenAPI schema 生成 endpoints（codegen 包）

```ts
const config: ConfigFile = {
  schemaFile: './openapi.json',
  apiFile: './src/store/emptyApi.ts',   // 生成进「空 API」
  apiImport: 'emptySplitApi',
  outputFile: './src/store/petApi.ts',
  hooks: true,
  endpointOverrides: [{ pattern: 'getPetById', providesTags: ['SinglePet'] }],
}
// npx @rtk-query/codegen-openapi openapi-config.ts
```

<div v-click class="mt-3 text-sm opacity-80">

`filterEndpoints` 收窄大 schema · `endpointOverrides` 修 type/参数/tag · 生成物当「已 review 的源码」别盲信

</div>

<style>
h1 { background: linear-gradient(45deg, #764ABC 10%, #B085E0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
codegen 从 OpenAPI 生成 RTK Query endpoints，生成进空 API 而非另立 API 根。filterEndpoints 收窄、endpointOverrides 修生成结果。默认 string-only tag 可能过度失效，需 override。
-->

---
transition: fade-out
---

# handle-side-effects：副作用怎么选

一棵决策树

| 场景 | 用什么 |
| --- | --- |
| 服务端数据、要缓存复用 | **RTK Query** |
| 一次命令式异步 | **`createAsyncThunk`** |
| 反应式（响应未来 action / 状态变化） | **`createListenerMiddleware`** |

<v-clicks>

- `CRITICAL` 别在 reducer 里跑副作用——reducer 必须纯
- `HIGH` listener middleware 要 **`prepend`**——其 action 携带函数，须在序列化检查前跑

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #764ABC 10%, #B085E0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
副作用决策树：服务端缓存用 RTK Query，一次命令式异步用 createAsyncThunk，反应式响应未来变化用 listener middleware。副作用绝不进 reducer；listener 要 prepend 因为它的 action 携带函数。
-->

---
transition: fade-out
---

# debug + migrate：演进与诊断

<div class="grid grid-cols-2 gap-6 mt-2">
<div v-click>

**debug-redux-toolkit-apps**

- 按序：action→reducer→selector→render
- 收窄订阅到使用点
- `HIGH` fetch thunk 用 `condition` guard（防 StrictMode 双跑）
- `HIGH` `Date`/`Set` 进 state（存 ISO / 数组）

</div>
<div v-click>

**migrate-to-modern-redux**

- 先换 `createStore`→`configureStore`
- 改到哪个 reducer 迁哪个
- codemod：`@reduxjs/rtk-codemods`
- `HIGH` 别大爆炸重写；`CRITICAL` 别抬旧数组 middleware

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

迁移是**增量**的——store 现代化后新代码不再加旧范式

</div>

<style>
h1 { background: linear-gradient(45deg, #764ABC 10%, #B085E0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
debug 按 action→reducer→selector→render 顺序排查，收窄订阅、guard 放 thunk、避免非序列化值。migrate 增量迁移：先换 store，改哪个 reducer 迁哪个，codemod 辅助，别大爆炸。
-->

---
transition: fade-out
---

# 反模式清单（跨技能）

agent 最爱犯的旧代码，技能全标 Wrong→Correct

| 旧（agent 常生成） | 现代正解 |
| --- | --- |
| `createStore` + `applyMiddleware` | `configureStore` |
| `connect()` 新组件 | `useAppSelector`/`useAppDispatch` |
| 手写 switch reducer | `createSlice`（Immer） |
| `extraReducers: {}` 对象 | `(builder) => builder.addCase()` |
| reducer 里 `fetch()` | thunk / listener |
| 一后端多个 `createApi` | `injectEndpoints` |

<style>
h1 { background: linear-gradient(45deg, #764ABC 10%, #B085E0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
table td { font-size: 0.88em; }
</style>

<!--
反模式清单是技能的核心价值：configureStore 代替 createStore、hooks 代替 connect、createSlice 代替 switch、builder 代替对象语法、thunk/listener 代替 reducer 副作用、injectEndpoints 代替多 API 根。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Redux 官方主仓库内建的 9 个 agent 技能：现代 Redux（configureStore/createSlice/typed hooks）+ 状态建模 + RTK Query + 副作用编排 + 诊断迁移，用带分级的「Wrong→Correct」纠正 agent 的过时代码。**

<div class="mt-8 opacity-80">

主仓库内建 · 现代默认 · 反模式驱动 · 官方一手 · 版本锚定 RTK 2.x

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/reduxjs/redux-toolkit" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://redux-toolkit.js.org/" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #764ABC 10%, #B085E0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Redux 官方 9 技能藏在主仓库，覆盖现代 Redux 全生命周期，用分级的 Wrong→Correct 对照纠正 agent 的过时代码。官方一手、版本锚定 RTK 2.x。
-->
