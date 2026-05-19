---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Redux
info: |
  Presentation Redux for developers.

  Learn more at [https://redux.js.org/](https://redux.js.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-9xl">🟣</span>
</div>

<br/>

## Redux — Predictable State Container

now powered by Redux Toolkit，React 状态管理常青树，单一数据源 + 不可变更新 + 时间旅行调试

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Redux —— React 生态最经典的状态管理库，2015 年由 Dan Abramov 发布。

Redux 当年是 Flux 架构的「精装版」实现，把「单一 store + 纯函数 reducer + 时间旅行调试」这套范式
带到了 React 社区，迅速成为大型项目的事实标准。

但「原教旨 Redux」（手写 action types / action creators / reducer switch case）样板代码太多，
2019 年官方推出 Redux Toolkit（RTK），把所有最佳实践打包成开箱即用的工具集，
现在 Redux 官方明确推荐：新项目一律用 RTK + react-redux + RTK Query，不要再手写老 Redux。

当前主线：redux 5.x / @reduxjs/toolkit 2.x / react-redux 9.x，全部要求 React 18+。
-->

---
transition: fade-out
---

# 什么是 Redux？

为 JavaScript 应用提供可预测状态容器的库

<v-click>

- **单一数据源**：整个应用的 state 存在一个 store tree 里
- **State 只读**：唯一改变方式是 dispatch action
- **纯函数 reducer**：(state, action) =&gt; newState，无副作用
- **时间旅行调试**：DevTools 可回溯任意历史状态
- **预测性强**：相同 action 序列必定产生相同 state
- **生态成熟**：千万级 npm 周下载，标准化最佳实践
- **官方推荐 RTK**：90% 模板代码消除，类型推导完整

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Redux Introduction_](https://redux.js.org/introduction/getting-started)

</div>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Redux 的核心定位是「可预测的状态容器」——
强调「可预测」这三个字，意味着相同的输入必然产生相同的输出。

三大原则：
1. Single Source of Truth：整个应用的 state 用单棵树存储
2. State is Read-Only：不能直接修改 state，只能通过 dispatch action 表达「我想改」
3. Changes via Pure Reducers：reducer 是纯函数，接收旧 state 和 action，返回新 state

这三条规则让 Redux 拥有了「时间旅行」能力 ——
每次 dispatch 都被记录，可以回溯到任意历史状态，bug 复现极快。

但代价是样板代码（boilerplate）：原教旨 Redux 要写 action types 常量、action creators、
reducer switch case、selector，一个小功能要碰 4 个文件。

Redux Toolkit（RTK）就是为了解决这个痛点 —— 把 90% 的模板代码自动化，
保留 Redux 的「可预测」核心，开发体验向 Zustand / Pinia 看齐。

现在 Redux 官方明确：新项目一律用 RTK，不要手写老 Redux。
-->

---
transition: fade-out
---

# Redux 的定位与生态

为什么大型 React 项目仍在用 Redux？

<v-click>

| 维度          | Redux Toolkit 2     | Zustand 5             | Jotai             | Pinia 3           | MobX 6            |
| ------------- | ------------------- | --------------------- | ----------------- | ----------------- | ----------------- |
| 框架绑定      | React (vanilla 可用) | React (vanilla 可用)  | React             | **Vue 3 官方**    | React / Vue       |
| API 风格      | **Slice + Hook**    | hook + flux           | Atom 原子化       | Composition       | Reactive class    |
| Provider      | **需要**            | 无需                  | 需要              | 需要              | 无需              |
| 状态模型      | Slice / Immer       | 单 store / immutable  | 多 atom           | 多 store          | observable        |
| 异步方案      | **RTK Query / Thunk** | 普通 async           | jotai-tanstack    | 普通 async        | flow / async      |
| 数据获取层    | **RTK Query 内置**  | 需 TanStack Query 配合 | 同左            | 同左              | 同左              |
| TS 支持       | **完整推导**        | curried 推导          | 优                | **原生推导**      | 装饰器            |
| 包体积        | ~10 KB              | **~1 KB**             | ~3 KB             | ~1.5 KB           | ~16 KB            |
| DevTools      | **Redux DevTools**  | Redux DevTools        | Jotai DevTools    | Vue DevTools      | MobX DevTools     |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Redux Style Guide_](https://redux.js.org/style-guide/)

</div>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比五大 React 状态库的护城河 ——

Redux Toolkit 的护城河是「规范化 + 完整生态 + 数据层」：
- 配 RTK Query，一站式解决「客户端状态 + 服务端状态」
- Redux DevTools 时间旅行是状态管理库里最强的
- 规范一致，团队招人 / Code Review 友好
- 中后台 / 复杂业务流首选

对比 Zustand：Zustand 极简但需要自己搭异步数据层（配 TanStack Query），
RTK 把数据层内置了，「全家桶」体验更完整。

对比 Jotai：Jotai 颗粒度极小，适合大量独立小状态；
RTK 是「slice 集中管理」哲学，适合业务模型清晰的大型应用。

对比 Pinia：Pinia 是 Vue 的官方对应物，思路类似（slice = store、actions = methods）。

对比 MobX：MobX 是「reactive 写法」，RTK 是「函数式 immutable 写法」。
两者哲学不同，MobX 适合 Vue / Angular 开发者迁移过来，RTK 适合 React 一脉相承的开发者。

选型逻辑：
- 中小 React 项目 + 简单状态 → Zustand
- 大型 React 项目 + 复杂业务 / 多团队 → Redux Toolkit
- 大量原子状态 / Suspense 重度使用 → Jotai
- 重数据获取 / API 缓存 → RTK Query 或 TanStack Query
-->

---
transition: fade-out
---

# Redux 的演进史

从「样板代码地狱」到 RTK 时代

<v-click>

| 时期               | 代表 API                              | 痛点 / 亮点                           |
| ------------------ | ------------------------------------- | ------------------------------------- |
| **2015 元年**      | createStore + reducer + connect       | 模板代码多，类型推导差                |
| **2016 中间件爆发** | redux-thunk / redux-saga / observable | 异步方案百花齐放，学习成本陡升        |
| **2018 hooks 时代** | useSelector / useDispatch             | 摆脱 connect HOC，函数组件友好        |
| **2019 RTK 1.0**   | configureStore + createSlice          | Immer 内置，模板代码减 90%            |
| **2021 RTK Query** | createApi + useXxxQuery               | 内置数据获取层，对标 TanStack Query   |
| **2024 RTK 2.0**   | TypeScript 重写 + ESM only            | 类型完整，包体积优化                  |
| **2026 当前**      | redux 5.x + RTK 2.x + react-redux 9.x | React 18+ 生态对齐                    |

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Redux 十年演进 ——

2015 元年：Dan Abramov 在 React Europe 演讲发布 Redux，配套 Redux DevTools 让全场震撼。
那个年代的写法极其朴素：手写 action types 常量、reducer 大 switch case、用 connect HOC 把
state 注入组件。代码很多，但「可预测」三个字让团队愿意付出这个成本。

2016 中间件爆发：异步副作用怎么处理是核心难题，社区出了 redux-thunk（最简单）、
redux-saga（generator 风格）、redux-observable（RxJS 风格）三种主流方案。
选型撕裂，新人学习曲线陡。

2018 hooks 时代：react-redux v7 引入 useSelector / useDispatch hooks，
彻底告别 connect HOC，函数组件原生支持，开发体验大幅提升。

2019 RTK 1.0：Mark Erikson 领头推出 Redux Toolkit，把社区共识打包：
configureStore 内置 redux-thunk + DevTools + immer，
createSlice 自动生成 actions + reducer，
模板代码减 90%。

2021 RTK Query：Redux 团队意识到「数据获取」是状态管理最大痛点，
推出 RTK Query 与 createApi，自动生成 hooks、缓存、失效、轮询，
功能对标 TanStack Query，但更深度集成 Redux store。

2024 RTK 2.0：用 TypeScript 重写，类型推导更精确，ESM only（不再支持 CommonJS）。
要求 React 18+、Node 18+。

到 2026 今天，主线版本：redux 5.x / @reduxjs/toolkit 2.x / react-redux 9.x，
官方一句话总结：「新项目用 RTK，老 Redux 概念只用来理解原理」。
-->

---
transition: fade-out
---

# Redux 的核心理念

三大原则贯穿所有 API

<v-click>

**1. Single Source of Truth（单一数据源）**

整个应用的 state 存在一个 store 树里，便于调试、序列化、SSR hydration。

</v-click>

<v-click>

**2. State is Read-Only（State 只读）**

不能直接修改 state，唯一改变方式是 dispatch action（描述「发生了什么」的纯对象）。

</v-click>

<v-click>

**3. Changes via Pure Reducers（纯函数变更）**

reducer 接收旧 state 和 action，返回新 state，必须是纯函数（无副作用、相同输入相同输出）。

</v-click>

<v-click>

**RTK 在此之上叠加的现代理念**

- Slice = state + reducer + actions 一体化
- Immer 内置 → 可以写「mutable 风格」代码，输出仍是 immutable
- Thunk 内置 → 异步逻辑直接 async/await
- DevTools 自动接入 → 零配置时间旅行

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三大原则是 Redux 的「宪法」，理解它们就能理解整个 Redux 设计 ——

[click] 单一数据源：所有 state 集中在一棵 store 树里。
好处：
- 调试时一次 console.log(store.getState()) 看到全部 state
- SSR 时 state 可以 JSON.stringify 后传到客户端
- 不会出现「这个状态到底在哪个组件里」的迷茫
代价：
- 简单项目用 Redux 是 overkill（useState 就够了）

[click] State 只读：你不能 state.count = 1，必须 dispatch({ type: 'INCREMENT' })。
好处：
- 所有变更都通过 action 表达，DevTools 能记录全部变更
- 时间旅行成为可能（重放 action 序列）
- 多个 reducer 可以共享同一个 action

[click] 纯函数 reducer：reducer 必须没有副作用 ——
不能 fetch、不能 console.log（开发可以）、不能 Math.random、不能 mutate state。
好处：
- 测试极其简单，输入输出对照即可
- HMR 时不会丢状态
- 时间旅行可以重放历史

[click] RTK 把上述原则做了「现代化封装」——
slice 把相关 state + reducer + action 放在一个文件，
内置 Immer 让你写 state.count++ 这种 mutable 代码（Immer 自动转 immutable），
内置 thunk 让异步逻辑写起来跟普通 async 函数一样。

理解三大原则后再用 RTK，能避免「黑盒 API 出 bug 不知道为什么」。
-->

---
transition: fade-out
layoutClass: gap-x-8
layout: two-cols-header
---

# 安装与初始化

RTK 全家桶一行装齐

::left::

<v-click>

**安装**

```bash
pnpm add @reduxjs/toolkit react-redux
# 或
npm install @reduxjs/toolkit react-redux
```

| 包                  | 版本     | 作用                       |
| ------------------- | -------- | -------------------------- |
| redux               | 5.x      | 核心 store + reducer       |
| @reduxjs/toolkit    | 2.x      | 官方工具集（推荐入口）     |
| react-redux         | 9.x      | React 绑定（Provider + hooks） |

</v-click>

::right::

<v-click>

**最小可运行示例**

```ts
// store/index.ts
import { configureStore, createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1 },
  },
});

export const { increment } = counterSlice.actions;
export const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});
```

`@reduxjs/toolkit` 已经 re-export 了 redux，
项目里只 import RTK 即可，不必单独装 redux。

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Redux Toolkit 是新项目的官方推荐入口 ——
一行命令装齐两个包：@reduxjs/toolkit + react-redux。

版本对照：
- redux 5.x：核心库，RTK 已经把它做成 peer dependency，一般不必直接装
- @reduxjs/toolkit 2.x：官方工具集，包含 configureStore / createSlice / createAsyncThunk / RTK Query / Immer 等
- react-redux 9.x：React 绑定层，提供 <Provider /> + useSelector / useDispatch hooks
- 都要求 React 18+ / Node 18+

[click] 最小示例只要 3 步：
1. createSlice 定义一个 slice：包含 name + initialState + reducers
2. configureStore 创建 store，传入 reducer map
3. 导出 actions 给组件用

注意 reducers 里写的是 `state.value += 1` —— 看起来 mutable，但 RTK 内置了 Immer middleware，
实际产出的是新对象。这是 RTK 相对老 Redux 最大的开发体验提升。

老 Redux 写法：
```js
case 'INCREMENT':
  return { ...state, value: state.value + 1 }
```

RTK 写法：
```js
increment: (state) => { state.value += 1 }
```

代码量少 50%，可读性翻倍。下一页讲 Provider 怎么接入 React。
-->

---
transition: fade-out
---

# Provider 设置：react-redux 9.x

让组件能访问 store

<v-click>

```tsx
// main.tsx (Vite / CRA)
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
```

</v-click>

<v-click>

**Next.js App Router**

```tsx
// app/StoreProvider.tsx
"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/lib/store";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) storeRef.current = makeStore();
  return <Provider store={storeRef.current}>{children}</Provider>;
}
```

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 普通 React 项目（Vite / CRA）—— Provider 放在根组件外层即可。
全局只有一个 store，跨请求场景不存在污染问题。

[click] Next.js App Router 需要特殊处理 ——
原因和 Zustand SSR 那一页一样：服务端是「单进程多请求」，
模块顶层的 store 会被所有用户共享。

正确做法：
- makeStore() 工厂函数，每次调用返回新 store
- StoreProvider 是 client component（'use client'）
- useRef 保证每个组件实例只创建一次 store
- 然后在 layout.tsx 里包：<StoreProvider>{children}</StoreProvider>

注意 react-redux 9.x 的几个变化：
- 完全移除了 connect HOC 的官方推荐地位（仍能用，但官方文档全部用 hooks 示例）
- 要求 React 18+（依赖 useSyncExternalStore）
- Provider 不再支持 createStore 老用法，只接受 RTK store

如果你的项目还在用 connect + mapStateToProps，可以慢慢迁移到 hooks。
但新代码请直接用 useSelector / useDispatch，文档和资源更新都在 hooks 这边。

下一页讲 hooks 怎么用。
-->

---
transition: fade-out
---

# Hooks 用法：useSelector / useDispatch

react-redux 9.x 的现代姿势

<v-click>

```tsx
// CounterDisplay.tsx
import { useSelector, useDispatch } from "react-redux";
import { increment } from "./counterSlice";
import type { RootState, AppDispatch } from "@/store";

export function Counter() {
  // useSelector：订阅 state 的某个字段
  const count = useSelector((s: RootState) => s.counter.value);

  // useDispatch：拿到 dispatch 函数
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => dispatch(increment())}>+</button>
    </div>
  );
}
```

</v-click>

<v-click>

| Hook                | 作用                                   |
| ------------------- | -------------------------------------- |
| `useSelector`       | 订阅 state 派生值，类似 Zustand selector |
| `useDispatch`       | 拿到 dispatch 函数                     |
| `useStore`          | 直接访问 store 实例（少用）            |

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 现代 Redux 组件的标准写法 ——
useSelector + useDispatch 替代了老 Redux 的 connect HOC。

useSelector 的关键点：
- 必传 selector 函数：`(state) => state.xxx`
- 返回值变化才触发组件重渲（默认用 Object.is 比较）
- 不传 selector 等于订阅整个 state，绝对不要这么做

useDispatch 的关键点：
- 返回 store.dispatch 函数
- dispatch(actionCreator()) 触发 reducer
- TypeScript 项目要传泛型 <AppDispatch>，否则 thunk 会丢类型

[click] 三个 hook 各司其职：
- useSelector：读 state，最常用
- useDispatch：写 state（通过 dispatch action），其次常用
- useStore：拿到整个 store 实例，用于 imperative 场景（比如 thunk 外部调用）

注意：
- useSelector 默认浅比较返回值。返回新对象 / 新数组 → 每次都新引用 → 总是重渲
  解决方案：拆成多个 useSelector / 用 reselect createSelector / 配 `equalityFn: shallowEqual`
- useDispatch 返回的函数是稳定引用，可以放心放进 useEffect 依赖

react-redux 9.x 还提供 `useDispatch` 的 typed 版本：
import { useDispatch } from 'react-redux'
const dispatch = useDispatch<AppDispatch>()

后面 TypeScript 章节会展开「createTypedHooks」最佳实践。
-->

---
transition: fade-out
---

# createSlice：现代 Redux 的核心

state + reducer + actions 一站式

<v-click>

```ts
// store/counterSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: CounterState = { value: 0, status: "idle" };

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => { state.value += 1 },           // 无 payload
    decrement: (state) => { state.value -= 1 },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;                       // 有 payload
    },
    setStatus: (state, action: PayloadAction<CounterState["status"]>) => {
      state.status = action.payload;
    },
  },
});

// 自动生成的 action creators
export const { increment, decrement, incrementByAmount, setStatus } = counterSlice.actions;
// 自动生成的 reducer
export default counterSlice.reducer;
```

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] createSlice 是 RTK 的「灵魂 API」——
一个函数搞定老 Redux 需要写 4 个文件的内容：
- action types 常量
- action creators
- reducer
- selector（可选）

输入参数：
- name：slice 名字，自动用作 action type 前缀（如 'counter/increment'）
- initialState：state 初始值
- reducers：每个 reducer 函数对应一个 action

输出：
- counterSlice.actions：所有 reducer 名字对应的 action creators
- counterSlice.reducer：组合后的 reducer，传给 configureStore

PayloadAction<T> 是 RTK 提供的类型工具：
- 不带泛型 = action 只有 type 字段
- PayloadAction<number> = action 形如 { type: 'counter/incrementByAmount', payload: 100 }
- PayloadAction<{ a: string; b: number }> = 多字段 payload

关键 immutability 提醒：
- state.value += 1 —— RTK 内置 Immer，OK
- state = { ...state, value: 1 } —— ❌ 不要重新赋值 state 整体（破坏 Immer draft）
- return { value: 1 } —— ✅ 也可以 return 新对象（完全替换）
- 但不要既 mutate 又 return（Immer 会警告）

下一页讲 configureStore 怎么把多个 slice 组合起来。
-->

---
transition: fade-out
---

# configureStore：搭建 store

零配置 + 自动 middleware + DevTools

<v-click>

```ts
// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import userReducer from "./userSlice";
import { apiSlice } from "./apiSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,   // RTK Query slice
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: { ignoredActions: ["persist/REHYDRATE"] },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// TypeScript 类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

</v-click>

<v-click>

configureStore 自动开启：**Immer / Redux Thunk / DevTools / serializable-check / immutable-check**

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] configureStore 是老 createStore 的「全家桶版本」——

它做了什么：
- 自动合并多个 reducer（不用手写 combineReducers）
- 自动接入 redux-thunk middleware（异步 action）
- 自动接入 Redux DevTools Extension
- 自动开启 serializable-check（防止往 state 里放 Promise / Map / Set 等不可序列化对象）
- 自动开启 immutable-check（开发环境检测意外 mutate）

reducer 字段接收对象，key 是 slice 名（对应 state.counter），value 是 reducer。
RTK Query 的 slice 用 `[apiSlice.reducerPath]: apiSlice.reducer` 加进去。

middleware 配置用 callback 形式 ——
getDefault() 拿到默认 middleware 数组，然后 .concat() 追加自定义 middleware。
不要直接传数组（会覆盖默认值，丢掉 thunk / serializableCheck 等）。

serializableCheck.ignoredActions：persist 之类的 action 携带不可序列化内容（如 storage 实例），
加到白名单避免警告。

[click] configureStore 自动开了一堆好东西，但都是「开发环境强制 / 生产环境关闭」：
- serializableCheck / immutableCheck 仅 dev 环境运行
- DevTools 通过 NODE_ENV 控制
- 这种「开发友好但不影响生产性能」的设计是 RTK 的细致之处

TypeScript 必须导出 RootState 和 AppDispatch ——
后面 TypeScript 章节会讲怎么用它们配 useAppSelector / useAppDispatch。
-->

---
transition: fade-out
---

# createAsyncThunk：异步 action

3 个生命周期 action 自动派发

<v-click>

```ts
// store/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 定义 thunk：第一个泛型是 return 类型，第二个是 arg 类型
export const fetchUser = createAsyncThunk<User, number>(
  "user/fetchUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error("Network error");
      return (await res.json()) as User;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: { data: null, loading: false, error: null } as UserState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchUser.fulfilled, (s, { payload }) => { s.loading = false; s.data = payload })
      .addCase(fetchUser.rejected, (s, { payload }) => { s.loading = false; s.error = payload as string });
  },
});
```

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] createAsyncThunk 是 RTK 处理「一次性异步请求」的标准 API ——

它接收两个参数：
1. action type 前缀：用于自动生成三个 action（pending / fulfilled / rejected）
2. payloadCreator：async 函数，返回值会作为 fulfilled action 的 payload

thunk 自动派发三个 action：
- pending：刚开始执行（适合 set loading: true）
- fulfilled：异步成功（payload 是 payloadCreator 的返回值）
- rejected：异步失败（payload 是 throw 的错误或 rejectWithValue 的值）

extraReducers 用 builder pattern：
- builder.addCase(actionCreator, reducer) —— 处理特定 action
- builder.addMatcher((action) => action.type.endsWith('/rejected'), commonHandler) —— 模糊匹配
- builder.addDefaultCase(handler) —— 兜底

rejectWithValue 是关键：
- 直接 throw error，rejected action 的 payload 是 error 实例（序列化时丢失 message）
- rejectWithValue('错误信息') 让你显式控制 payload，serializable 友好

createAsyncThunk 的更多能力：
- thunkApi.dispatch：thunk 内部可以 dispatch 其他 action
- thunkApi.getState：拿到当前 state
- thunkApi.signal：AbortController，取消请求用
- thunkApi.requestId：每次调用的唯一 ID

注意：createAsyncThunk 适合「一次性数据获取」（用户提交表单、单次加载）。
对于「带缓存的数据查询」（如列表、详情）请用 RTK Query —— 下一页讲。
-->

---
transition: fade-out
---

# 组件中使用 thunk

dispatch 异步 action + 订阅 loading/error

<v-click>

```tsx
// UserProfile.tsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "@/store/userSlice";
import type { RootState, AppDispatch } from "@/store";

export function UserProfile({ id }: { id: number }) {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((s: RootState) => s.user);

  useEffect(() => {
    // dispatch thunk 返回一个 Promise（解析为最终 action）
    const promise = dispatch(fetchUser(id));
    return () => promise.abort();   // 卸载时取消请求
  }, [dispatch, id]);

  if (loading) return <p>加载中...</p>;
  if (error) return <p>错误：{error}</p>;
  if (!data) return null;
  return <h2>{data.name}</h2>;
}
```

</v-click>

<v-click>

`dispatch(fetchUser(1))` 返回的 Promise 上有 `.abort()` 方法 —— 配合 AbortController 在组件卸载时取消请求。

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] thunk 在组件中的标准用法 ——

useEffect 里 dispatch thunk，依赖 [dispatch, id]：
- dispatch 是稳定引用（react-redux 保证）
- id 变化时重新请求
- cleanup 函数调 promise.abort() 取消未完成的请求

这种「卸载即取消」对避免「数据竞争」非常重要：
- 用户快速切换 id：1 → 2 → 3
- 如果不 abort，三个请求都在执行
- 返回顺序可能是 2 → 3 → 1（取决于网络）
- 最终显示 id=1 的数据，但用户在看 id=3 → bug

abort 机制：
- createAsyncThunk 内部用 AbortController
- payloadCreator 的 thunkApi.signal 可以传给 fetch / axios，取消底层请求
- abort 后会派发 rejected action，payload 是 AbortError

[click] 注意 dispatch(fetchUser(1)) 的返回值：
- 是一个 Promise<Action>（resolved 是 fulfilled 或 rejected action）
- .abort() 是额外挂的方法
- .unwrap() 可以「解开」action，让你像普通 Promise 一样 catch error：

```ts
try {
  const user = await dispatch(fetchUser(1)).unwrap()
  console.log(user.name)
} catch (err) {
  console.error(err)
}
```

unwrap 是 RTK 处理 thunk 错误的官方推荐方式，比看 action.type 是否包含 '/rejected' 优雅得多。
-->

---
transition: fade-out
---

# RTK Query：数据获取层

createApi 一键生成 hooks + 缓存

<v-click>

```ts
// store/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Post", "User"],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "/posts",
      providesTags: ["Post"],
    }),
    addPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({ url: "/posts", method: "POST", body }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const { useGetPostsQuery, useAddPostMutation } = apiSlice;
```

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] RTK Query 是 Redux 团队对标 TanStack Query 的「数据获取层」——
深度集成 Redux store，自动生成 hooks、缓存、失效、轮询。

createApi 的核心字段：
- reducerPath：在 store 里的挂载点（'api'）
- baseQuery：基础请求函数，常用 fetchBaseQuery（fetch 封装）
- tagTypes：缓存标签类型（用于失效）
- endpoints：API 端点定义，builder 风格

每个 endpoint 是 query（GET / 读）或 mutation（POST / PUT / DELETE / 写）：
- query 自动生成 useXxxQuery hook
- mutation 自动生成 useXxxMutation hook

prepareHeaders 是请求拦截器，
- 接收 headers 对象和上下文
- 常用于注入 token / 默认 header

tags 机制（重要）：
- providesTags：query 给出的缓存标签 ['Post']
- invalidatesTags：mutation 触发后让哪些缓存失效 ['Post']
- 当 addPost 成功后，所有 providesTags 包含 'Post' 的 query 自动重新请求

更精细的标签：
- providesTags: (result) => [...result.map(p => ({ type: 'Post', id: p.id })), 'Post']
- invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }]

下一页讲怎么在组件里用这些自动生成的 hooks。
-->

---
transition: fade-out
---

# RTK Query：组件中使用

零模板代码完成 CRUD

<v-click>

```tsx
// PostList.tsx
import { useGetPostsQuery, useAddPostMutation } from "@/store/apiSlice";

export function PostList() {
  // 自动请求 + 缓存 + 重渲
  const { data: posts, isLoading, isError, refetch } = useGetPostsQuery();

  // mutation 返回元组：[trigger, result]
  const [addPost, { isLoading: isAdding }] = useAddPostMutation();

  if (isLoading) return <p>加载中...</p>;
  if (isError) return <button onClick={refetch}>重试</button>;

  return (
    <div>
      {posts?.map((p) => <h3 key={p.id}>{p.title}</h3>)}
      <button
        disabled={isAdding}
        onClick={async () => {
          await addPost({ title: "新帖子" }).unwrap();
          // 不需要手动刷新，invalidatesTags 自动触发 getPosts 重新请求
        }}
      >
        {isAdding ? "提交中..." : "新增"}
      </button>
    </div>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] RTK Query 的组件用法极简，对标 TanStack Query 的 useQuery / useMutation ——

useGetPostsQuery() 返回对象：
- data：成功的数据（types-safe）
- isLoading：首次加载
- isFetching：包括后续重新请求
- isSuccess / isError / error
- refetch()：手动触发重新请求
- currentData：当前数据（区分 lastData）

useAddPostMutation() 返回元组：
- 第一个：trigger 函数，调用它发请求
- 第二个：状态对象（isLoading / isSuccess / error / reset）

trigger 函数返回的对象有 .unwrap()：
- 成功返回数据
- 失败 throw error（可以 try/catch）

缓存自动管理：
- 首次 useGetPostsQuery：发请求
- 第二次 useGetPostsQuery（同参数）：直接读缓存，不再发请求
- 60 秒后无组件订阅：缓存被回收（可配 keepUnusedDataFor）
- addPost 成功：invalidatesTags 触发 getPosts 重新请求

对比 TanStack Query 的差异：
- RTK Query：与 Redux store 深度集成，可用 DevTools 看请求历史
- TanStack Query：独立缓存层，配合任意状态库，社区更大

选型：
- 已用 Redux → RTK Query（一站式，少装一个库）
- 不用 Redux → TanStack Query（更通用，文档更详细）

下一页讲 RTK Query 的进阶能力（轮询、乐观更新、infinite 等）。
-->

---
transition: fade-out
---

# RTK Query：进阶能力

轮询 / 乐观更新 / 条件查询 / pagination

<v-click>

```tsx
// 轮询：每 5 秒重新请求
const { data } = useGetPostsQuery(undefined, { pollingInterval: 5000 });

// 条件查询：skip 控制是否触发
const { data } = useGetUserQuery(userId, { skip: !userId });

// 转换返回数据：selectFromResult
const { ids } = useGetPostsQuery(undefined, {
  selectFromResult: ({ data }) => ({ ids: data?.map((p) => p.id) ?? [] }),
});

// refetchOnMountOrArgChange：参数变化时重新请求
useGetPostQuery(id, { refetchOnMountOrArgChange: true });

// 乐观更新（mutation）
addPost({ title }).unwrap()
// 或：updateQueryData 在 onQueryStarted 里手动更新
endpoints: {
  updatePost: builder.mutation({
    query: ({ id, ...patch }) => ({ url: `/posts/${id}`, method: "PATCH", body: patch }),
    async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
      const patchResult = dispatch(
        apiSlice.util.updateQueryData("getPost", id, (draft) => Object.assign(draft, patch)),
      );
      try { await queryFulfilled } catch { patchResult.undo() }
    },
  }),
}
```

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] RTK Query 的进阶配置 ——

pollingInterval：定时轮询，适合实时性要求不高的场景（聊天列表、通知）。
注意 RTK Query 是「全局轮询」（多个组件订阅同 query，只轮询一次共享给所有订阅者）。

skip 字段：条件查询，false 时不发请求，data 是 undefined。
适合：「id 加载完成后才请求 user」之类的依赖请求。

selectFromResult：组件级 selector，类似 useSelector 的字段订阅。
只有 selectFromResult 返回值变化才重渲。

refetchOnMountOrArgChange：
- true：mount 或参数变化都重新请求
- 数字（秒）：缓存超过该时间则视为过期，重新请求

乐观更新：用户体验最佳但实现复杂。
方法 1：trigger().unwrap()，等服务端响应后 invalidatesTags 自动刷新（朴素）。
方法 2：onQueryStarted 钩子里 dispatch updateQueryData 立刻改本地缓存，
        然后 await queryFulfilled，失败时 patchResult.undo() 回滚。

util.updateQueryData 是 RTK Query 提供的「手动改缓存」工具：
- 第一参：endpoint 名（'getPost'）
- 第二参：缓存 key（id）
- 第三参：Immer-style mutation
- 返回值：可以 .undo() 回滚的 patch result

其他常用配置：
- transformResponse：响应数据后处理（unwrap envelope、转 camelCase 等）
- transformErrorResponse：错误响应后处理
- keepUnusedDataFor：无订阅后缓存保留时间（默认 60 秒）
- refetchOnFocus / refetchOnReconnect：网页 focus / 重新联网时刷新（需要 setupListeners）
-->

---
transition: fade-out
---

# Listener Middleware

替代 Saga / Thunk 的复杂副作用场景

<v-click>

```ts
// store/listenerMiddleware.ts
import { createListenerMiddleware } from "@reduxjs/toolkit";
import { increment, decrement } from "./counterSlice";
import { fetchUser } from "./userSlice";

export const listenerMiddleware = createListenerMiddleware();

// 监听特定 action，执行副作用
listenerMiddleware.startListening({
  actionCreator: increment,
  effect: async (action, { dispatch, getState, cancelActiveListeners, delay }) => {
    cancelActiveListeners();       // 取消同名监听器的旧实例（防抖）
    await delay(500);              // 等 500ms
    const state = getState() as RootState;
    if (state.counter.value >= 10) {
      dispatch(fetchUser(1));      // 派发其他 action
    }
  },
});

// 用 matcher 监听多个 action
listenerMiddleware.startListening({
  matcher: isAnyOf(increment, decrement),
  effect: (action, { dispatch }) => {
    console.log("counter changed", action.type);
  },
});
```

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Listener Middleware 是 RTK 1.8+ 引入的「轻量副作用方案」——
官方推荐替代 redux-saga、redux-observable 这种重型方案。

何时用 listener middleware？
- 跨 slice 的副作用（A action 触发 B action）
- 防抖 / 节流 / 取消
- WebSocket 推送 / 服务器事件订阅
- analytics / 日志埋点
- localStorage 同步

API 设计：
- createListenerMiddleware() 创建实例
- startListening({ actionCreator, effect }) 注册监听
- effect 是异步函数，接收 (action, listenerApi)
- listenerApi 提供 dispatch / getState / delay / cancelActiveListeners / fork 等工具

匹配方式：
- actionCreator: increment —— 单 action
- type: 'counter/increment' —— 字符串匹配
- matcher: isAnyOf(a, b, c) —— 多 action 任意一个
- predicate: (action, state) => boolean —— 自定义匹配函数

API 工具集：
- delay(ms)：可取消的 setTimeout
- pause(promise)：可取消的等待
- fork(task)：派生子任务，可独立取消
- cancelActiveListeners()：取消同 effect 的旧实例（防抖关键）
- condition(predicate)：等到 predicate 返回 true

对比 thunk：
- thunk 适合「一次性」副作用（用户点击 → fetch）
- listener 适合「订阅式」副作用（state 变化 → 自动响应）

对比 saga：
- saga 是 generator 风格，学习曲线陡
- listener 是 async/await 风格，与 thunk 一脉相承

RTK 官方建议：80% 场景用 thunk，剩下 20% 用 listener，几乎不需要 saga。
-->

---
transition: fade-out
---

# Entity Adapter：normalized state

CRUD 列表数据的官方姿势

<v-click>

```ts
// store/postsSlice.ts
import { createSlice, createEntityAdapter, type PayloadAction } from "@reduxjs/toolkit";

interface Post { id: number; title: string; createdAt: number }

// 创建 adapter（提供标准 CRUD reducer 和 selectors）
const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.createdAt - a.createdAt,   // 按时间倒序
});

const postsSlice = createSlice({
  name: "posts",
  initialState: postsAdapter.getInitialState({ loading: false }),
  // 注意 state 形状：{ ids: number[], entities: { [id]: Post }, loading: boolean }
  reducers: {
    addPost: postsAdapter.addOne,                       // 自动生成
    updatePost: postsAdapter.updateOne,
    removePost: postsAdapter.removeOne,
    upsertMany: postsAdapter.upsertMany,
    setAll: postsAdapter.setAll,
  },
});

// 生成 selectors
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts);
```

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Entity Adapter 是 RTK 处理「列表数据」的官方工具 ——

为什么需要 normalized state？
- 直接用 Post[] 数组存所有帖子，查 ID=123 的要 O(n) 遍历
- normalize 成 { entities: { 123: Post }, ids: [123, 456] }，查询 O(1)
- 多个组件订阅同一个帖子，只看 entities[123] 引用稳定
- 这是 Redux 官方推荐的「关系型数据」管理模式

createEntityAdapter 自动提供：
- addOne / addMany / setOne / setMany / setAll
- updateOne / updateMany / upsertOne / upsertMany
- removeOne / removeMany / removeAll

每个 reducer 都内置 Immer，可以直接当 createSlice 的 reducer 用。

state 形状（自动管理）：
- ids: number[] | string[] —— 所有 entity 的 ID 列表（自动排序，按 sortComparer）
- entities: { [id]: Entity } —— ID 到 entity 的映射

getSelectors 自动生成的 selectors：
- selectAll —— 返回排序后的数组
- selectById(state, id) —— 按 ID 查询
- selectIds —— 返回 ID 数组
- selectEntities —— 返回 entity 映射
- selectTotal —— 数量

跟 RTK Query 配合：
- RTK Query 内部就用了 entity adapter 实现缓存
- query 的 selectFromResult 可以用 adapter selectors 进一步派生

何时用 entity adapter？
- 列表数据 >50 项（性能开始重要）
- 数据有 ID 字段（标准 entity）
- 频繁 CRUD（增删改 entity）
- 多组件订阅同一个 entity（引用稳定关键）

不需要用：
- 简单计数器 / 表单 state
- 单例对象（如 currentUser）
-->

---
transition: fade-out
---

# TypeScript：类型化 hooks

`useAppSelector` / `useAppDispatch` 标准姿势

<v-click>

```ts
// store/hooks.ts
import { useDispatch, useSelector, useStore } from "react-redux";
import type { RootState, AppDispatch, AppStore } from "./index";

// 类型化的 useDispatch：自动推断 thunk 返回类型
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// 类型化的 useSelector：state 自动推断为 RootState
export const useAppSelector = useSelector.withTypes<RootState>();

// 类型化的 useStore（很少用）
export const useAppStore = useStore.withTypes<AppStore>();
```

</v-click>

<v-click>

```tsx
// 组件里使用 typed hooks（type 自动推断）
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchUser } from "@/store/userSlice";

function MyComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.user.data);   // s 自动是 RootState 类型

  // dispatch thunk 返回 Promise，类型完整
  const handleClick = async () => {
    const result = await dispatch(fetchUser(1)).unwrap();
    console.log(result.name);                         // result 类型自动推断
  };
}
```

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] React-Redux 9.x 提供了 `withTypes` 工厂方法 —— 一行声明搞定类型推断 ——

老做法（v8 及更早）：
```ts
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch: () => AppDispatch = useDispatch
```

新做法（v9+）：
```ts
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

效果一样，新做法更简洁、命名一致。

[click] 在组件里：
- useAppSelector：传一个 (state) => ... ，state 自动是 RootState
- useAppDispatch：返回 AppDispatch（包含 thunk 类型信息）

为什么必须用 typed hooks？
- 默认 useSelector 的 state 是 any（unknown 在严格模式下）
- 默认 useDispatch 返回的 dispatch 不知道 thunk 类型，.unwrap() 报错
- 在 200+ 组件的项目里，每个文件手写 RootState 类型既啰嗦又容易漏

最佳实践：
- store/hooks.ts 文件统一导出 typed hooks
- 项目里所有组件 import { useAppSelector, useAppDispatch } from '@/store/hooks'
- 永远不要直接 import useSelector / useDispatch from 'react-redux'

ESLint 规则可以强制：
```js
'no-restricted-imports': ['error', {
  paths: [{
    name: 'react-redux',
    importNames: ['useSelector', 'useDispatch'],
    message: '请用 store/hooks 里的 useAppSelector / useAppDispatch',
  }],
}]
```

下一页讲 Redux DevTools 怎么用。
-->

---
transition: fade-out
---

# Redux DevTools：时间旅行调试

Redux 最大杀招

<v-click>

**configureStore 默认开启**

```ts
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
});
```

</v-click>

<v-click>

**DevTools 能做什么？**

- **Action log**：所有 dispatch 时间线，含 action type + payload
- **State diff**：每个 action 前后 state 差异（绿/红高亮）
- **时间旅行**：拖动 slider 让 state 回到任意时刻，UI 跟着回到那时
- **Skip action**：跳过某条 action 看「不发生会怎样」
- **Dispatcher**：手动 dispatch 任意 action
- **Export / Import**：导出当前 session JSON，发给同事复现 bug
- **State tree**：树形可视化整个 state

</v-click>

<v-click>

**最佳实践**

action type 用 `'slice/action'` 格式（createSlice 自动生成），DevTools 时间线一眼看出业务模块。

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Redux DevTools 是 Redux 长盛不衰的关键 ——
其他状态管理库（Zustand / Jotai）都通过 devtools middleware 接入 Redux DevTools，
可以说 Redux DevTools 已成为 React 状态调试的事实标准。

[click] DevTools 七大能力：
1. Action log：左侧时间线显示所有 dispatch 记录，时间戳 + action type + payload 一目了然
2. State diff：右侧显示当前 action 前后 state 的差异，红色删 / 绿色加 / 黄色改
3. 时间旅行：滑动时间线，state 实时回到那个时刻，整个 UI 同步回退（神奇）
4. Skip：勾选某条 action 表示「跳过」，重新计算后续 state（验证某个 action 的影响）
5. Dispatcher：右上角输入框，手动 dispatch 任意 action（测试边界条件）
6. Import / Export：JSON 格式，bug 复现神器 —— 用户报 bug 导出 session，开发者 import 后立刻看到现场
7. State tree：树形渲染整个 state，可以折叠展开

[click] 配合 createSlice 自动生成的 action type（'counter/increment'）：
- 'auth/login' / 'auth/logout' / 'auth/updateToken'
- 'posts/addOne' / 'posts/updateOne' / 'posts/removeOne'
- 'api/executeQuery/pending' / 'api/executeQuery/fulfilled'

时间线上一眼看出业务模块和操作类型，比手写常量更规范。

进阶配置：
- trace: true —— 每个 action 附加调用栈（性能损耗大，仅开发用）
- maxAge: 50 —— 保留多少条历史（默认 50）
- actionsDenylist: ['noisy/heartbeat'] —— 隐藏特定 action（高频心跳类）

生产环境：
- configureStore 默认开发开生产关
- 不要手动设 devTools: true 然后部署生产（state 结构泄漏）

DevTools 安装：Chrome / Firefox / Edge 扩展商店搜 "Redux DevTools" —— 必装。
-->

---
transition: fade-out
---

# Redux Persist：状态持久化

刷新后状态恢复

<v-click>

```ts
// store/index.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "user"],   // 只持久化这些 slice
  // 或 blacklist: ["ui"]          // 排除这些 slice
};

const rootReducer = combineReducers({ auth: authReducer, user: userReducer, ui: uiReducer });
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) => getDefault({
    // 必须忽略 persist 内部的非序列化 action
    serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
  }),
});

export const persistor = persistStore(store);
```

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] redux-persist 是社区最流行的状态持久化方案 ——
注意 RTK 没有官方 persist 工具，redux-persist 是第三方但生态最成熟。

核心 API：
- persistReducer(config, reducer)：把普通 reducer 包成「自动持久化版本」
- persistStore(store)：创建 persistor 对象，控制 persist 生命周期
- PersistGate（react 组件）：等 hydrate 完成再渲染 children（防闪烁）

config 字段：
- key：localStorage 的 key
- storage：存储引擎（默认 localStorage，可换 sessionStorage / IndexedDB / AsyncStorage）
- whitelist / blacklist：白名单 / 黑名单 slice
- transforms：序列化前 / 反序列化后的转换（加密、过滤敏感字段）
- version + migrate：版本迁移
- stateReconciler：合并策略（hardSet / autoMergeLevel1 / autoMergeLevel2）

ignoredActions 必须配：
- redux-persist 内部用 6 个特殊 action（REHYDRATE / PAUSE 等）
- 这些 action 的 payload 包含 storage 实例（非 plain object）
- 不加白名单 → serializableCheck 报错

App 入口配 PersistGate：
```tsx
import { PersistGate } from 'redux-persist/integration/react'

<Provider store={store}>
  <PersistGate loading={<Spinner />} persistor={persistor}>
    <App />
  </PersistGate>
</Provider>
```

替代方案：
- 手写 listener middleware：监听特定 action → 写 localStorage（更轻量但要自己实现 hydrate）
- LocalForage：换更强的 storage 后端（IndexedDB / WebSQL）
- redux-state-sync：跨 tab 同步状态

注意：和 Zustand persist 一样，SSR 项目持久化要小心 hydration mismatch。
-->

---
transition: fade-out
---

# 单元测试：reducer 是纯函数

reducer 测试零设置

<v-click>

```ts
// counterSlice.test.ts
import { describe, it, expect } from "vitest";
import counterReducer, { increment, incrementByAmount } from "./counterSlice";

describe("counterSlice", () => {
  const initialState = { value: 0, status: "idle" as const };

  it("should handle initial state", () => {
    expect(counterReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle increment", () => {
    const actual = counterReducer(initialState, increment());
    expect(actual.value).toEqual(1);
  });

  it("should handle incrementByAmount", () => {
    const actual = counterReducer(initialState, incrementByAmount(5));
    expect(actual.value).toEqual(5);
  });
});
```

</v-click>

<v-click>

reducer 是纯函数 → 输入 (state, action) → 输出 newState，零 mock 零 setup。

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Redux 的纯函数 reducer 让单元测试变得极其简单 ——

测试要点：
1. 传 undefined state + 任意 action → 返回 initialState（reducer 的「初始化」契约）
2. 传 initialState + 具体 action → 返回预期 newState
3. 同样的输入必须产生同样的输出（pure function 验证）

不需要：
- Provider 包裹
- store 实例
- async/await 设置
- mock fetch / mock dispatch

只需要：
- import reducer 和 action creators
- describe + it + expect

[click] 这是 Redux 相对其他状态库的「设计上的优势」——
Zustand 测试要 mock 整个 zustand 模块（前面讲过），
Pinia 测试要 createTestingPinia 工厂模式，
Redux reducer 直接当函数测试，自带可测试性。

测试 thunk：
```ts
import { configureStore } from '@reduxjs/toolkit'
import { fetchUser } from './userSlice'

const store = configureStore({ reducer: { user: userReducer } })

// mock fetch
global.fetch = vi.fn().mockResolvedValueOnce({
  ok: true,
  json: async () => ({ id: 1, name: 'Alice' }),
})

await store.dispatch(fetchUser(1))
expect(store.getState().user.data).toEqual({ id: 1, name: 'Alice' })
```

测试 RTK Query：
- 用 setupApiStore 工具（@reduxjs/toolkit/dist/query/tests/helpers）
- 或者 MSW（Mock Service Worker）拦截 fetch

测试组件：
- 用 react-redux 的 Provider 包裹 + render
- 推荐写 renderWithProviders 工具函数
- @testing-library/react + Vitest 配合极佳
-->

---
transition: fade-out
---

# 组件测试：renderWithProviders

每个测试用例独立 store

<v-click>

```tsx
// test-utils.tsx
import { render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer, { type RootState } from "@/store/rootReducer";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof setupStore>;
}

const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({ reducer: rootReducer, preloadedState });

export function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState, store = setupStore(preloadedState), ...options }: ExtendedRenderOptions = {},
) {
  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>, options),
  };
}

// 测试用例
it("renders user name", () => {
  renderWithProviders(<UserProfile />, {
    preloadedState: { user: { data: { name: "Alice" }, loading: false, error: null } },
  });
  expect(screen.getByText("Alice")).toBeInTheDocument();
});
```

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Redux 官方文档推荐的「组件测试工具函数」renderWithProviders ——

核心思路：
- 每个测试用例创建一个新 store（隔离）
- preloadedState 注入初始状态（直接编辑 state 比 dispatch 一堆 action 高效）
- 返回 store 实例，断言后续状态变化

工具函数签名：
- 第一参：React 组件
- 第二参：选项
  - preloadedState：预填充 state
  - store：可以传外部 store（不传则自动创建）
  - 其他 testing-library 选项

测试模式：
1. **状态快照**：preloadedState 注入，断言 UI 渲染
2. **用户交互**：用户点击 → fireEvent / userEvent → 断言 UI 更新
3. **状态断言**：用户操作后 → store.getState() 断言 state 变化

对比其他方案：
- 不要用全局 mock store（测试间污染）
- 不要 mock useSelector / useDispatch（失去集成测试价值）
- 不要直接 mock fetch 在 store 里（用 MSW 更现实）

进阶配置：
- preloadedState 用 RootState 的 Partial 让你只填关心的部分
- store 自动包含所有 middleware（thunk / listener / RTK Query）
- 配合 MSW，集成测试可以覆盖 thunk + API + reducer 全链路

社区还有 redux-mock-store，但官方已不推荐 ——
它只模拟 dispatch 不跑 reducer，测出来的「state」是假的。
正确做法永远是「真 store + 注入 preloadedState」。
-->

---
transition: fade-out
---

# 常见踩坑（一）：直接 mutate state

老 Redux 时代的禁忌，RTK 时代的局部反规则

<v-click>

**❌ 老 Redux：reducer 里直接修改 state**

```ts
// 老 Redux：必须 immutable，不能 mutate
function counterReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      state.value += 1;        // ❌ 严重错误：mutate state
      return state;             // 引用没变，组件不会重渲
  }
}
```

</v-click>

<v-click>

**✅ 老 Redux：必须返回新对象**

```ts
return { ...state, value: state.value + 1 };
```

</v-click>

<v-click>

**✅ RTK：reducer 内部可以 mutate（Immer 自动包装）**

```ts
const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1 },  // ✅ Immer 自动转 immutable
  },
});
```

</v-click>

<v-click>

注意：**只能在 createSlice 的 reducer 内部 mutate**，组件 / 外部代码绝对不能改 state！

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 老 Redux 时代最严格的规则是「reducer 必须 immutable」——
直接 mutate state 会导致：
- 组件订阅的引用没变 → useSelector 不重渲 → UI 不更新
- 时间旅行失效（历史 state 引用被覆盖）
- 测试不可靠（state 在多次测试间被改）

[click] 标准做法是返回新对象 / 新数组：
- { ...state, x: 1 } —— spread
- [...arr, newItem] —— concat
- arr.filter(x => x.id !== id) —— filter
嵌套深了会写出 spread 火葬场。

[click] RTK 引入 Immer 后，reducer 内部的 mutate 写法被「重新允许」——
但前提是「只在 createSlice / createReducer 内部」。
Immer 用 Proxy 拦截 state 的修改，根据修改路径生成新对象，
开发者写「mutable 风格」，输出仍是 immutable。

陷阱：什么时候 Immer 不工作？
1. createSlice 外部直接改 state（如组件里 state.x = 1） → 直接修改原对象，无 Proxy 包装
2. 用 JSON.parse(JSON.stringify(state)) 复制后再改 → 操作的是新对象，dispatch 不会发生
3. extraReducers 里 return state.something —— Immer 把这个值当成新 state（误以为是完全替换）

[click] 规则简化：
- ✅ createSlice 的 reducers / extraReducers 函数体内：可以 mutate
- ❌ 任何其他位置（组件、thunk、middleware）：必须 immutable / dispatch action

RTK 在开发环境会自动检测意外 mutate（immutableCheck middleware），
看到「state outside of slice is mutated」警告就是中招了。
-->

---
transition: fade-out
---

# 常见踩坑（二）：useSelector 返回新引用

每次都新对象 → 总是重渲

<v-click>

**❌ 错误：selector 返回新对象**

```tsx
// 每次 useSelector 调用都生成新对象 → 总是重渲
const { name, age } = useSelector((s: RootState) => ({
  name: s.user.name,
  age: s.user.age,
}));
```

</v-click>

<v-click>

**✅ 方案 1：拆成多个 useSelector（最朴素）**

```tsx
const name = useSelector((s: RootState) => s.user.name);
const age = useSelector((s: RootState) => s.user.age);
```

</v-click>

<v-click>

**✅ 方案 2：配 shallowEqual**

```tsx
import { shallowEqual } from "react-redux";

const { name, age } = useSelector(
  (s: RootState) => ({ name: s.user.name, age: s.user.age }),
  shallowEqual,
);
```

</v-click>

<v-click>

**✅ 方案 3：reselect 创建 memoized selector**

```tsx
import { createSelector } from "@reduxjs/toolkit";

const selectUserSummary = createSelector(
  [(s: RootState) => s.user.name, (s: RootState) => s.user.age],
  (name, age) => ({ name, age }),
);
const summary = useSelector(selectUserSummary);
```

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Redux 用户最常踩的性能坑 ——
看起来很自然的 destructure 写法实际上每次都返回新对象，
useSelector 默认用 Object.is 比较，永远不相等，永远重渲。

[click] 方案 1 最朴素：每个字段一个 useSelector ——
- 代码稍长
- 性能最好（每个 useSelector 独立订阅）
- 永远不会有引用陷阱

[click] 方案 2 用 shallowEqual：
- react-redux 提供的浅比较函数
- 第二个参数传给 useSelector
- 只比较顶层 key 的引用 → 顶层值没变就不重渲
- 适合「3+ 字段返回对象」场景

[click] 方案 3 用 reselect createSelector：
- @reduxjs/toolkit 已经 re-export 了 reselect
- 接收 input selectors 数组 + 合成函数
- 自动 memoize：相同输入返回相同输出（引用稳定）
- 适合「需要派生计算 + 跨组件共享」场景

何时用哪个？
- 1~2 字段 → 拆成多个 useSelector（方案 1）
- 多字段对象 → shallowEqual（方案 2）
- 复杂派生计算（filter / sort / map）→ createSelector（方案 3）

createSelector 进阶：
- 多层组合：let A = createSelector(input, ...); let B = createSelector(A, ...)
- 参数化：createSelector(state, (state, id) => state.users[id])
- weakMapMemoize：用 WeakMap 缓存（v5+ 默认），适合参数化 selector

RTK 2.x 默认 reselect 5.x，性能比 v4 大幅提升。
-->

---
transition: fade-out
---

# 常见踩坑（三）：Provider 包装错误

SSR / 测试 / 多 store 场景

<v-click>

**❌ 错误：Provider 内层创建 store**

```tsx
// 每次 App 重渲都新建 store，state 会重置
function App() {
  const store = configureStore({ reducer: rootReducer });
  return <Provider store={store}><Routes /></Provider>;
}
```

</v-click>

<v-click>

**✅ 正确：store 在 Provider 外层创建一次**

```tsx
// store/index.ts
export const store = configureStore({ reducer: rootReducer });

// main.tsx
createRoot(...).render(
  <Provider store={store}><App /></Provider>,
);
```

</v-click>

<v-click>

**✅ Next.js SSR：useRef 保证 store 单例**

```tsx
"use client";
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) storeRef.current = makeStore();
  return <Provider store={storeRef.current}>{children}</Provider>;
}
```

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Provider 包装错误最容易出现在「学习阶段」——
新手把 store 创建放进组件内部，每次组件重渲都新建一个 store，
表现：UI 看起来工作，但 dispatch 后 state 没保存，刷新组件就重置。

DevTools 表现：看到很多个独立 store 实例，时间线被切断。

[click] 标准 Vite / CRA 项目：store 在模块顶层创建，整个应用全局唯一。

[click] Next.js SSR 例外：
- 服务端单进程多请求 → 模块顶层 store 会被所有用户共享
- 必须用工厂函数 makeStore() 每请求新建一个
- 客户端用 useRef 保证组件实例只创建一次
- 整个 app 树用 <StoreProvider> 包裹

Next.js 官方示例：
https://github.com/vercel/next.js/tree/canary/examples/with-redux

测试场景：
- 每个测试用例新建 store（renderWithProviders 已展示）
- 不要全局共享 store（测试间状态污染）

多 store 场景：
- 通常不推荐（违反「单一数据源」原则）
- 真有需要：microfrontend 边界（每个 mf 独立 store）
- Provider 可以嵌套（内层覆盖外层），但要谨慎避免冲突

Provider 还有 context 选项：
```tsx
<Provider store={store1} context={CustomContext1}>
  <Provider store={store2} context={CustomContext2}>
    <App />
  </Provider>
</Provider>
```
useSelector 可以传 context 选择对应 store —— 微前端 / 模块联邦场景才用得到。
-->

---
transition: fade-out
---

# 常见踩坑（四）：thunk 错误未捕获

dispatch().unwrap() 才能 catch

<v-click>

**❌ 错误：以为 dispatch 抛错就能 catch**

```tsx
async function handleSubmit() {
  try {
    await dispatch(saveData(formValues));   // 不会 throw
    setSuccess(true);
  } catch (e) {
    // 永远不会进来！rejected action 不 throw
    setError(e.message);
  }
}
```

</v-click>

<v-click>

**✅ 正确：用 .unwrap() 解包 thunk action**

```tsx
async function handleSubmit() {
  try {
    const result = await dispatch(saveData(formValues)).unwrap();
    setSuccess(true);
    console.log("saved:", result);
  } catch (e) {
    setError((e as Error).message);
  }
}
```

</v-click>

<v-click>

**或：检查 action.meta.requestStatus**

```tsx
const action = await dispatch(saveData(formValues));
if (saveData.fulfilled.match(action)) {
  setSuccess(true);
  console.log(action.payload);
} else {
  setError(action.payload as string);
}
```

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] thunk 错误处理是 RTK 用户常常迷茫的地方 ——

createAsyncThunk 的 payloadCreator throw error 时：
- 不会让 dispatch 返回的 Promise reject
- 会派发 fetchUser.rejected action（payload 是 error message）
- await dispatch() 解析的是「rejected action 对象」，不是 throw error

所以 try/catch 包 dispatch 是无效的（永远进 try 分支）。

[click] 解决方案 1：.unwrap() ——
RTK 给 dispatch(thunk) 返回的 Promise 加了 unwrap 方法：
- 如果 fulfilled → 返回 payload
- 如果 rejected → throw rejected payload

这样 try/catch 就能正常工作了。

[click] 解决方案 2：match 函数 ——
每个 createAsyncThunk 的生命周期 action 都有 .match() 静态方法：
- fetchUser.pending.match(action) —— 是否 pending action
- fetchUser.fulfilled.match(action)
- fetchUser.rejected.match(action)

action 类型缩窄后可以安全读 payload。

推荐：90% 场景用 .unwrap()，简洁直观。
match 函数适合「需要根据状态分支处理」的复杂场景。

记忆口诀：
- 不在乎结果 → dispatch(thunk) 就行
- 想知道成功失败 → dispatch(thunk).unwrap() + try/catch
- 想知道详细 action → await dispatch(thunk) + match()
-->

---
transition: fade-out
---

# 从老 Redux 迁移到 RTK

旧项目的渐进式升级路径

<v-click>

| 老 Redux 写法                              | RTK 写法                              |
| ------------------------------------------ | ------------------------------------- |
| `createStore(reducer)`                     | `configureStore({ reducer })`         |
| `combineReducers({ ... })`                 | `configureStore({ reducer: { ... } })`|
| 手写 action types + creators               | `createSlice` 自动生成                |
| `switch(action.type)` reducer              | `createSlice` 的 reducers map         |
| 手写 immutable spread                      | Immer 内置，直接 `state.x = y`        |
| 手动 applyMiddleware(thunk, logger)        | `configureStore` 自动接 thunk         |
| 手写异步 action（thunk 函数）              | `createAsyncThunk`                    |
| 手写 normalized state CRUD                 | `createEntityAdapter`                 |
| 手写 fetch + cache                         | `RTK Query` createApi                 |
| `connect(mapState, mapDispatch)`           | `useSelector + useDispatch` hooks     |

</v-click>

<v-click>

**迁移建议**：旧项目不要一次性重写，按 slice 渐进式迁移 —— 老 reducer 和新 slice.reducer 可以同时存在于 configureStore 里。

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 老 Redux → RTK 迁移是当下大量项目的需求 ——
官方推荐路径：渐进式，不要 big-bang rewrite。

迁移步骤建议：
1. 装 RTK：pnpm add @reduxjs/toolkit
2. 替换 createStore → configureStore（保留所有旧 reducer，配置 middleware）
3. 替换 connect HOC → useSelector / useDispatch（一次一个组件，测试通过再下一个）
4. 重写老 reducer → createSlice（一次一个 slice，新老共存）
5. 重写老 thunk → createAsyncThunk
6. 新增数据获取层 → RTK Query
7. 删除老 action types 常量文件、老 action creators、老的 mapStateToProps

注意事项：
- combineReducers 可以混合「老 reducer」和「slice.reducer」
- store 形状保持兼容（state.user 还是 state.user）
- connect 和 hooks 可以共存（不同组件用不同方式）

时间预估（中型项目，20 个 slice）：
- 替换 configureStore：1 天
- connect → hooks：1-2 周（每天 1-2 个组件）
- 老 reducer → slice：1-2 周（每天 1 个 slice）
- 老 thunk → createAsyncThunk：1 周
- 引入 RTK Query：1-2 周（重写数据层）

总计 6-8 周可以让中型项目完全迁移到 RTK。

收益：
- 代码量减少 50%~70%
- 类型推导完整（IDE 提示拉满）
- DevTools 体验更好（action 自动有 'slice/action' 命名）
- 新人上手更快（社区文档统一指向 RTK）

不迁移的代价：
- 后续招人困难（新人都学的是 RTK）
- 老 redux 库已停止维护（功能性 bug fix only）
- 错过 RTK Query 这种生态级杀手锏
-->

---
transition: fade-out
---

# 实战：完整 Cart Store（RTK 版）

createSlice + createAsyncThunk + entity adapter

<v-click>

```ts
// store/cartSlice.ts
import { createSlice, createAsyncThunk, createEntityAdapter, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

interface CartItem { id: string; name: string; price: number; qty: number }
interface CartState { loading: boolean; error: string | null }

const cartAdapter = createEntityAdapter<CartItem>();

export const syncCart = createAsyncThunk<CartItem[]>("cart/sync", async () => {
  const res = await fetch("/api/cart");
  return res.json();
});

const cartSlice = createSlice({
  name: "cart",
  initialState: cartAdapter.getInitialState<CartState>({ loading: false, error: null }),
  reducers: {
    addItem: (s, { payload }: PayloadAction<Omit<CartItem, "qty">>) => {
      const exist = s.entities[payload.id];
      if (exist) exist.qty += 1;
      else cartAdapter.addOne(s, { ...payload, qty: 1 });
    },
    setQty: (s, { payload }: PayloadAction<{ id: string; qty: number }>) => {
      cartAdapter.updateOne(s, { id: payload.id, changes: { qty: payload.qty } });
    },
    removeItem: cartAdapter.removeOne,
    clear: cartAdapter.removeAll,
  },
  extraReducers: (b) => {
    b.addCase(syncCart.pending, (s) => { s.loading = true })
     .addCase(syncCart.fulfilled, (s, { payload }) => { s.loading = false; cartAdapter.setAll(s, payload) })
     .addCase(syncCart.rejected, (s, { error }) => { s.loading = false; s.error = error.message ?? null });
  },
});

export const { addItem, setQty, removeItem, clear } = cartSlice.actions;
export const { selectAll: selectCartItems, selectIds } = cartAdapter.getSelectors((s: RootState) => s.cart);
export default cartSlice.reducer;
```

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是一个生产级 Cart slice，展示了 RTK 的核心能力组合 ——

类型设计：
- CartItem：实体数据
- CartState：状态字段（loading / error）
- 用 entity adapter 自动管理 items 数组（normalized）

createEntityAdapter：
- 自动管理 ids + entities
- 提供 addOne / updateOne / removeOne / setAll 等 CRUD
- 自动生成 selectors

createAsyncThunk：
- syncCart 异步从服务端同步购物车
- pending / fulfilled / rejected 三个生命周期

createSlice reducers：
- addItem：业务逻辑（如已存在则 qty + 1）+ 调 entity adapter
- setQty：用 updateOne
- removeItem / clear：直接用 adapter 提供的 reducer 函数

extraReducers builder：
- 处理 thunk action（不需要在 reducers 里手写 action types）
- addCase 链式调用，类型推断完整

getSelectors：
- 接收 「state 提取函数」，返回标准 selectors
- selectAll 返回数组（用 sortComparer 排序）
- selectIds / selectEntities / selectById

派生计算：
- total 不放 state，用 createSelector 派生：
```ts
export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, i) => sum + i.price * i.qty, 0),
)
```

完整业务流：
- 用户登录 → dispatch(syncCart()) 拉远端
- 加购 → dispatch(addItem(item))（本地立刻响应）
- 下单后台 → 用 RTK Query mutation
- 失败回滚 → updateQueryData + undo

这一个 slice 不到 30 行代码，承载完整电商购物车业务。
-->

---
transition: fade-out
---

# 项目结构最佳实践

Feature-Folder 推荐

<v-click>

```
src/
  store/
    index.ts                  # configureStore + 类型导出
    hooks.ts                  # useAppSelector / useAppDispatch
    rootReducer.ts            # combineReducers（如需）
    listenerMiddleware.ts     # 自定义副作用
  features/
    auth/
      authSlice.ts            # createSlice
      authThunks.ts           # createAsyncThunk
      authSelectors.ts        # createSelector（可选）
      LoginForm.tsx           # 组件
      auth.test.ts            # 测试
    cart/
      cartSlice.ts
      cartApi.ts              # RTK Query createApi
      CartView.tsx
  api/
    baseApi.ts                # 共享 createApi（reducerPath: 'api'）
  test-utils.tsx              # renderWithProviders
```

</v-click>

<v-click>

**命名约定**

- Slice 文件：`featureNameSlice.ts`
- Thunk 函数：动词起头（`fetchUser` / `saveCart`）
- Action：自动生成（`auth/login` / `cart/addItem`）
- Selector：`select` 前缀（`selectAuthToken` / `selectCartTotal`）

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Redux 官方推荐「Feature-Folder」结构 ——

核心理念：按业务功能分目录，不按技术类型分。

老式结构（不推荐）：
```
src/
  actions/
    authActions.ts
    cartActions.ts
  reducers/
    authReducer.ts
    cartReducer.ts
  selectors/
    authSelectors.ts
    cartSelectors.ts
  components/
    LoginForm.tsx
    CartView.tsx
```
缺点：一个功能跨 4 个目录，改 auth 要在 4 个文件间切换。

[click] Feature-Folder 结构：
- features/auth/ 里所有 auth 相关代码（slice、thunk、selector、组件、测试）
- 删除一个功能只要删一个目录
- 团队协作时不会冲突（每个 feature 独立）
- 跨 feature 的代码放 store/ 或 utils/

store/ 目录：
- index.ts：configureStore + 类型
- hooks.ts：typed hooks
- listenerMiddleware.ts：跨 slice 副作用
- rootReducer.ts：可选（按需 lazy load slice）

api/ 目录：
- baseApi.ts：共享的 RTK Query API（一般一个 app 就一个 api）
- 各 feature 用 baseApi.injectEndpoints() 注入自己的 endpoint

[click] 命名约定：
- slice 文件用 camelCase + Slice 后缀
- thunk 函数动词起头（fetchUser, saveCart）
- action 自动有 'slice/action' 命名（无需手写）
- selector 用 select 前缀，便于 grep 和补全

实际经验：中型项目（20+ slice）按 feature 组织，维护性和扩展性都最好。
小项目（< 5 slice）可以平铺 store/ 目录，没必要过早抽象。
-->

---
transition: fade-out
---

# 性能优化技巧

大型 Redux 应用的关键

<v-click>

**1. selector 粒度细化**

```ts
// ❌ 订阅整个 user 对象
const user = useSelector((s: RootState) => s.user);
// ✅ 只订阅需要的字段
const name = useSelector((s: RootState) => s.user.name);
```

</v-click>

<v-click>

**2. memoize 派生计算**

```ts
// ❌ 每次重渲都重新计算 filtered
const filtered = useSelector((s) => s.posts.filter(p => p.public));
// ✅ createSelector 缓存
const selectPublicPosts = createSelector(
  [(s: RootState) => s.posts],
  (posts) => posts.filter(p => p.public),
);
```

</v-click>

<v-click>

**3. 用 entity adapter 而非数组**

</v-click>

<v-click>

**4. 用 RTK Query 而非自己写 cache**

</v-click>

<v-click>

**5. immutable check / serializable check 仅 dev 启用**

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 大型 Redux 应用的性能瓶颈通常在三个地方 ——

[click] 第一：selector 订阅过粗 ——
组件订阅整个 user 对象 → user.lastLogin 字段变化也触发重渲。
解决：每个组件只订阅它真正用到的字段。

[click] 第二：派生计算重复执行 ——
filter / sort / map / reduce 在每次重渲都跑一遍，
posts 列表有 1000 项时性能爆炸。
解决：createSelector memoize，依赖不变则返回上次结果（引用稳定）。

reselect 5.x 新特性（默认开启）：
- weakMapMemoize：参数化 selector 也能缓存
- lruMemoize：替换老 defaultMemoize，更精确

[click] 第三：normalized state ——
1000 项数组里删除一项 → 整个数组引用变 → 所有订阅这个数组的组件重渲。
用 entity adapter：每个 entity 独立 ID 索引，删一项只影响订阅那个 ID 的组件。

[click] 第四：手写 cache 代码很难写对 ——
- 哪些参数算同一个请求？
- 缓存多久过期？
- mutation 后哪些 query 要失效？
- 多组件订阅同一个 query 怎么去重？
RTK Query 把这些痛点全部内置，省下大量调试时间。

[click] 第五：开发检查仅 dev 启用 ——
serializableCheck 和 immutableCheck 是 RTK 内置的开发助手，
- 检测往 state 里塞 Promise / Date / Map
- 检测意外 mutate state
但是它们要遍历整个 state，生产环境跑会拖慢 dispatch。
configureStore 默认仅 dev 启用，正确做法。

补充：
- React.memo 包昂贵组件（与 useSelector 配合好）
- useCallback / useMemo 稳定 props 引用
- 拆分 slice：减少单 slice 的 state 大小
- Code splitting：lazy load feature 时按需加载 slice（用 store.injectReducer）
-->

---
transition: fade-out
---

# 生态对比：选谁，何时？

每种状态库都有它的场景

<v-click>

| 场景                            | 推荐方案              | 原因                                |
| ------------------------------- | --------------------- | ----------------------------------- |
| React 中大型项目 / 多团队       | **Redux Toolkit**     | 规范化、招人简单、生态完整          |
| 需要 API 缓存 + 状态管理一体    | **RTK Query**         | 一站式，省装 TanStack Query         |
| React 小型项目 / 个人项目       | **Zustand**           | 极简、无 Provider、~1 KB            |
| React + 大量独立小状态          | **Jotai**             | atom 颗粒度小，按需订阅             |
| React + Vue 风格响应式偏好      | **Valtio / MobX**     | proxy mutable 写法                  |
| Vue 3 项目                      | **Pinia**             | Vue 官方推荐                        |
| 异步数据（搭配任何状态库）      | **TanStack Query**    | 框架无关，社区最大                  |
| URL state（筛选 / 分页）        | URL params + nuqs     | 不要塞进 Redux                      |
| 表单状态                        | React Hook Form       | 不要塞进 Redux                      |

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Redux Toolkit 的最佳场景：
- 中大型 React 项目（10+ 个 feature）
- 多团队协作（规范统一比聪明设计更重要）
- 复杂业务流（Wizard、State Machine、协同编辑）
- 需要时间旅行调试（金融、医疗、关键业务）
- 已有 Redux 团队经验（迁移成本低）

什么时候 RTK 是 overkill？
- TodoMVC 级别的应用 → 用 useState
- 单页 SPA + 简单全局状态 → Zustand
- 个人项目 / 快速原型 → Zustand 或 Jotai

数据获取层选型：
- RTK Query：已用 Redux 时首选（一站式）
- TanStack Query：不用 Redux 时首选（框架无关，文档更详细）
- SWR：Next.js 项目（Vercel 出品，深度集成）
- 三者功能高度重叠，选已经会的那个

URL state（不要塞 Redux）：
- 分页：?page=2
- 筛选：?status=active&tag=tech
- Tab 选中：?tab=details
用 nuqs / next-usequerystate / use-query-params，自动绑定到 URL，
分享链接 / 后退按钮都能复用状态。

表单状态（不要塞 Redux）：
- React Hook Form / Formik / TanStack Form
- 表单字段、校验、提交是独立领域
- 全局存表单 → 切换路由清空 / 多个表单互相污染

记住：Redux 是「应用级跨组件状态」的工具，
URL / 表单 / 服务端缓存有各自更合适的方案。
-->

---
transition: fade-out
---

# 生产部署清单

上线前必做的 5 项检查

<v-click>

**1. devTools 关闭 / 限制**

```ts
configureStore({ reducer, devTools: process.env.NODE_ENV !== "production" });
```

</v-click>

<v-click>

**2. immutableCheck / serializableCheck 仅 dev**

`configureStore` 默认就是这样，不要手动开生产。

</v-click>

<v-click>

**3. persist 加 version + migrate**

老用户数据结构升级时需要迁移钩子。

</v-click>

<v-click>

**4. SSR 项目用 store-per-request**

Next.js / Remix 必须 useRef + makeStore 工厂模式。

</v-click>

<v-click>

**5. Bundle 验证 + tree-shake 检查**

```bash
npx vite-bundle-visualizer
# RTK Query 未引用的 endpoint 应该被 tree-shake
```

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 生产部署前的检查清单 ——

[click] devTools 安全：
- 不能在生产开 devTools: true，会泄漏 state 结构
- 攻击者可以打开 Redux DevTools 看到所有 action / state
- 极端情况可以 dispatch 越权 action（如改 user.isAdmin）

[click] check middleware：
- immutableCheck 遍历 state 深拷贝对比，每个 dispatch 都跑
- serializableCheck 遍历 action / state 检测非序列化
- 生产环境跑会让 dispatch 慢 10 倍
- configureStore 默认仅 dev 启用，不要手动开生产

[click] persist 版本管理：
- 你今天发 v1，state.user = { name }
- 明天发 v2，state.user = { firstName, lastName }
- 老用户打开 v2 → reducer 拿到旧格式 user → 报错
- 解决：persist version 升号，migrate 函数迁移数据

[click] SSR store 隔离：
- 本地 dev 单用户测试看不出来
- 上线后多用户并发立刻翻车（用户 A 看到用户 B 的购物车）
- Code Review 强制要求 Next.js 项目用 useRef + makeStore 模式

[click] Bundle 验证：
- RTK 整体 ~10 KB（包含 redux + immer + reselect + thunk）
- RTK Query 加 ~5 KB
- react-redux 加 ~6 KB
- 总计 ~20 KB，对中大型应用可接受
- 检查未引用的 endpoint 是否被 tree-shake（看 visualizer）

补充检查：
- ESLint 规则：no-restricted-imports 限制直接用 useSelector / useDispatch
- 错误监控：sentry / datadog 配 Redux integration（自动上报 state）
- E2E：playwright 可以注入 store action 测试边界
- 性能：RUM（Real User Monitoring）观察 dispatch 频率
-->

---
transition: fade-out
---

# 学习路径

从入门到精通的资源地图

<v-click>

**官方资源**

- [Redux 官方文档](https://redux.js.org/) — 必读，重点看 Tutorials / Style Guide
- [Redux Toolkit 文档](https://redux-toolkit.js.org/) — 现代 Redux 全套
- [Redux Essentials 教程](https://redux.js.org/tutorials/essentials/part-1-overview-concepts) — 6 part 完整实战
- [Redux Fundamentals 教程](https://redux.js.org/tutorials/fundamentals/part-1-overview) — 原理 + 老 Redux 用法

</v-click>

<v-click>

**生态插件**

- [redux-persist](https://github.com/rt2zz/redux-persist) — 状态持久化
- [reselect](https://github.com/reduxjs/reselect) — memoized selectors（RTK 已包含）
- [redux-logger](https://github.com/LogRocket/redux-logger) — console 日志 middleware
- [redux-saga](https://github.com/redux-saga/redux-saga) — Generator 副作用方案（高级场景）
- [redux-state-sync](https://github.com/aohua/redux-state-sync) — 跨 tab 同步

</v-click>

<v-click>

**实战项目参考**

- [RealWorld - React Redux](https://github.com/gothinkster/react-redux-realworld-example-app) — 完整 SPA 示例
- [Redux GitHub Issues 应用](https://redux.js.org/tutorials/essentials/part-5-async-logic) — 官方教程项目
- 《Learning Redux》 — Mark Erikson 著

</v-click>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Redux 学习资源是 React 生态里最完整的 ——

官方文档分两条线：
- Redux Essentials（推荐新人先看）：从 RTK 开始，2025 年视角的最佳实践
- Redux Fundamentals：从老 Redux createStore 讲起，理解底层原理后再用 RTK

Redux 文档还有几个独立部分：
- Style Guide：必读，里面是社区共识的最佳实践（命名、结构、避坑）
- FAQ：常见疑问汇总
- Recipes：实战配方（数据 normalization、迁移指南）

Mark Erikson（RTK 主要维护者）的博客 blog.isquaredsoftware.com 有大量深度文章 ——
特别是 "Idiomatic Redux" 系列，每年更新一次，覆盖最新最佳实践。

[click] 生态插件按需选用：
- redux-persist：几乎必装（localStorage 持久化）
- reselect：RTK 自动 re-export，写复杂 selector 时用
- redux-logger：开发体验补充（DevTools 不可用时用 console）
- redux-saga：复杂副作用方案，新项目优先选 listener middleware
- redux-state-sync：多 tab 应用必装

[click] 实战项目参考：
- RealWorld 项目（CodeMatcha 出品）有 React + Redux 完整实现，可对比其他状态库版本
- Redux 官方教程的 GitHub Issues 应用是 5000+ 字的 step-by-step
- Mark Erikson 在 Egghead 有付费视频课程，适合系统学习

学习节奏建议：
- 第 1 周：Redux Essentials Part 1-3，理解三大原则 + 写第一个 slice
- 第 2 周：Essentials Part 4-6，掌握 thunk + RTK Query
- 第 3 周：Advanced（entity adapter / listener middleware / typed hooks）
- 第 4 周：Style Guide + 性能优化 + 实战项目

一个月可以达到「能 hold 住中型项目」的水平。
后续深入 reselect 原理、Immer 内部、SSR hydration 等高级话题。
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看

Redux — Predictable State Container

<div class="mt-8 text-lg">

**核心心智**

- 三大原则 —— 单一数据源 / state 只读 / 纯函数 reducer
- 新项目用 RTK —— configureStore + createSlice + createAsyncThunk
- 数据获取用 RTK Query —— createApi 一站式缓存与失效
- typed hooks 必配 —— useAppSelector / useAppDispatch
- selector 精细化 —— 字段订阅 + reselect 派生

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://redux-toolkit.js.org/" target="_blank" class="slidev-icon-btn">
    RTK 文档
  </a>
  <a href="https://redux.js.org/" target="_blank" class="slidev-icon-btn">
    Redux 文档
  </a>
  <a href="https://github.com/reduxjs/redux-toolkit" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
</div>

<style>
h1 {
  background-color: #764ABC;
  background-image: linear-gradient(45deg, #764ABC 10%, #B583E0 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：Redux = React 时代的「可预测状态容器」，现代 Redux = Redux Toolkit。

核心心智五条：
1. 三大原则是 Redux 的「宪法」—— 单一数据源 + state 只读 + 纯函数 reducer
2. 新项目一律用 RTK —— configureStore + createSlice + createAsyncThunk + RTK Query
3. RTK Query 是 Redux 团队的「数据层」答案，对标 TanStack Query
4. TypeScript 必须配 useAppSelector / useAppDispatch typed hooks
5. selector 精细化 + reselect memoize 是大型应用性能关键

不要这么做（老 Redux 反模式）：
- 手写 action types 常量 / action creators / reducer switch case
- mapStateToProps + connect HOC
- 直接 mutate state（除 createSlice 内部外）
- 用 useSelector 返回新对象不配 shallowEqual
- 在生产开 devTools / immutableCheck

下一步建议：跟着 Redux Essentials 教程实战一个完整应用 ——
把 createSlice、createAsyncThunk、RTK Query、entity adapter 都用一遍，
然后你就能体会到为什么 Redux 在大型项目里依然是首选。

Redux Toolkit 不是「让 Redux 变简单」，而是「让正确做 Redux 变简单」。
所有最佳实践都已经在工具里了，开发者只需要遵循约定。

感谢观看！
-->
