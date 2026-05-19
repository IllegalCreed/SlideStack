---
theme: seriph
background: https://cover.sli.dev
title: Welcome to NgRx
info: |
  Presentation NgRx for developers.

  Learn more at [https://ngrx.io/](https://ngrx.io/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-9xl">🅰️</span>
</div>

<br/>

## NgRx — Reactive State for Angular

Redux pattern + Angular Signals，Angular 主流状态管理方案（最新 v19.x / Signals Store 时代）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 NgRx —— Angular 生态里最主流的状态管理方案，2016 年由 Rob Wormald 与 Mike Ryan 在 Redux 思想基础上为 Angular 量身打造。

NgRx 早期完全照搬 Redux 三大原则：单一 store + 不可变 + dispatch action，
不同的是用 RxJS Observable 替换了 React 的同步 selector，
让 Angular 的「reactive everything」哲学（依赖 RxJS）与 Redux 模式融合。

经过近十年演进，NgRx 已经从一个 store 包发展成一整套模块矩阵 ——
@ngrx/store / effects / entity / router-store / component-store，
而 2024 年推出的 @ngrx/signals 是基于 Angular Signals 的新一代 store，
彻底降低了 Redux 模式在 Angular 里的样板代价。

当前主线 NgRx 19.x，配合 Angular 19+ 的 Signals + Standalone Components，
对中大型 Angular 应用来说，NgRx 仍然是事实标准。

GitHub 8K+ star，npm 周下载 700K+，被 IBM / Adobe / Capital One 等企业广泛采用。

下面按「定位 → Redux 三件套 → Effects → 高级模块 → SignalStore → 测试」的顺序展开。
-->

---
transition: fade-out
---

# 什么是 NgRx？

为 Angular 应用提供 Redux 模式状态管理 + RxJS 副作用编排的官方推荐方案

<v-click>

- **Redux 派 + RxJS**：Action / Reducer / Selector 经典三件套，副作用用 Observable 编排
- **Angular 优先**：与 DI / Standalone / Signals / Router / SSR 深度集成
- **模块矩阵**：store / effects / entity / router-store / component-store / signals
- **@ngrx/signals 新引擎**：基于 Angular Signals 的 SignalStore，零 boilerplate
- **完整生态**：DevTools / schematics / 时间旅行 / 测试工具一应俱全
- **类型完整**：createAction / createReducer / createFeature 全链路类型推导
- **企业级首选**：大型 Angular 项目（IBM / Adobe / Capital One）实战验证

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_NgRx Introduction_](https://ngrx.io/docs)

</div>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NgRx 的核心定位是「Angular 上的 Redux + RxJS」——
它把 Redux 的单一数据源 / 不可变 / dispatch action 三大原则原封不动搬到 Angular，
但副作用层用 RxJS Observable 编排（而不是 React 那边的 thunk）。

特色一：Angular 优先
- 依赖注入：store 通过 DI 注入到组件、service、guard
- Standalone API：provideStore / provideEffects 配 standalone 组件
- Signals 集成：@ngrx/signals 是基于 Angular Signals 的新引擎
- Router 同步：@ngrx/router-store 把路由 state 也纳入 store

特色二：模块矩阵
- @ngrx/store：核心 store + reducer
- @ngrx/effects：副作用层（基于 RxJS）
- @ngrx/entity：normalized state 适配器
- @ngrx/router-store：路由 state 同步
- @ngrx/component-store：组件级局部 store
- @ngrx/signals：基于 Angular Signals 的新一代 store
- @ngrx/store-devtools：Redux DevTools 集成
- @ngrx/schematics：CLI 代码生成

特色三：@ngrx/signals 新引擎
- 2024 年正式发布的 SignalStore
- 基于 Angular 16+ 的 Signals API
- withState / withMethods / withComputed / withHooks
- 替代 component-store，可选替代主 store（小型项目）
- 学习曲线显著低于经典 store + effects

[click] 适合什么团队？
- 中大型 Angular 应用 + 多团队协作
- 需要时间旅行调试 + DevTools 全套
- RxJS 重度用户（已习惯 stream 思维）
- 想用 Redux 模式但避免手写样板代码
- 从 Angular Services 升级到全局状态管理
-->

---
transition: fade-out
---

# NgRx 的定位与生态

Angular 状态管理模块矩阵，按规模分层使用

<v-click>

| 维度          | @ngrx/store        | @ngrx/signals      | @ngrx/component-store | Angular Services |
| ------------- | ------------------ | ------------------ | --------------------- | ---------------- |
| 范围          | **全局 store**     | 全局 / 局部均可    | **组件级局部 store**  | 任意（无强约束） |
| 模式          | Redux (Action/Reducer) | Signal-first   | Reactive (RxJS)       | DIY              |
| 写法          | createAction + reducer | withState + withMethods | initialState + updater | 类 + Observable  |
| 派生          | createSelector     | **withComputed**   | select(...)           | 手写 pipe        |
| 副作用        | @ngrx/effects      | rxMethod / 自定义  | effect(...)           | service 内 RxJS  |
| DevTools      | **Redux DevTools** | Redux DevTools     | Redux DevTools        | 无               |
| 样板代码      | 较多               | **极少**           | 中等                  | 视实现           |
| TypeScript    | 完整推导           | **优秀（Signal 推导）** | 完整推导          | 视实现           |
| 适用场景      | **企业级 / 多人**  | 中小型 / 单页面    | 复杂组件局部状态      | 简单 service     |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_NgRx Architecture_](https://ngrx.io/guide/store)

</div>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NgRx 现在是「全家桶」级别 ——
你不需要把所有包都装，而是按项目规模和需求分层选用。

选型决策树：
1. 组件局部 + 复杂逻辑 → @ngrx/component-store 或 @ngrx/signals
2. 全局 state + 中小型 → @ngrx/signals SignalStore
3. 全局 state + 大型 + 时间旅行 → 经典 @ngrx/store + effects
4. 简单状态共享 → Angular Service + BehaviorSubject

对比 RTK（React 阵营对应物）：
- 哲学一致：都遵循 Redux 三大原则
- 副作用层：RTK 用 thunk（同步函数），NgRx 用 RxJS Observable
- 数据获取：RTK 有 RTK Query，NgRx 社区有 ngrx-toolkit / ngrx-data
- DevTools：都用 Redux DevTools 浏览器扩展
- Signals 时代：@ngrx/signals 对标 RTK 2.x 的 Slice + Hook 模式

对比 Pinia（Vue 阵营）：
- Pinia store 写法接近 SignalStore，但更轻量
- NgRx 经典 store 与 Pinia 区别大：NgRx 用 Action，Pinia 直接调 method
- 选型：Vue → Pinia，Angular → NgRx，React → RTK

对比 MobX：
- MobX 是「mutable observable」，NgRx 是「immutable + dispatch」
- MobX 多框架支持，NgRx 只为 Angular
- 大型 Angular 项目，NgRx 是社区共识

护城河三件套：
1. 官方推荐 + Angular 生态唯一标准
2. RxJS + Effects 配合，复杂异步流编排无敌
3. SignalStore 新引擎让样板代码归零，体验向 Pinia 看齐

什么团队适合 NgRx？
- 中大型 Angular 应用 + 多团队协作
- RxJS 老手（业务大量用 Observable）
- 严格审计 / 时间旅行调试需求
- 团队招人友好（NgRx 是 Angular 工程师的必备技能）

什么场景不适合？
- 小型 Angular 项目（用 Services + Signals 就够）
- 团队没人会 RxJS（经典 NgRx 学习曲线陡）
- 偏好「mutable + 自动追踪」（应该选 MobX）
-->

---
transition: fade-out
---

# NgRx 的演进史

从 ngrx-store 1.x 到 SignalStore 时代

<v-click>

| 时期               | 代表 API                              | 痛点 / 亮点                           |
| ------------------ | ------------------------------------- | ------------------------------------- |
| **2016 元年**      | StoreModule.provideStore + reducer    | Redux 模式首次为 Angular 移植         |
| **2018 v6 重写**   | createAction + createReducer          | TypeScript 友好，告别 enum action types |
| **2019 v8 Entity** | createEntityAdapter                   | normalized state 标准化               |
| **2020 v10 selector** | createFeatureSelector + createSelector | selector 类型推导完善              |
| **2022 v14 standalone** | provideStore / provideEffects      | 配合 Angular Standalone API           |
| **2023 v16 Signals** | @ngrx/signals 实验性发布            | 探索 Angular Signals 集成             |
| **2024 v18 SignalStore GA** | withState / withMethods         | 新一代 store，零 boilerplate          |
| **2026 v19 当前**  | Functional Effects + SignalStore 稳定 | Standalone-first 全面对齐 Angular 19  |

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NgRx 十年演进：

2016 元年：Rob Wormald（当时 Angular Core 团队成员）受 Redux 启发，
为 Angular 做了一个 RxJS-based 的 Redux 实现，命名 ngrx-store。
当时写法非常啰嗦：手写 Action 接口 + 枚举常量 + reducer switch case，
和原教旨 Redux 一样的「样板代码地狱」。

2018 v6 重写：引入 createAction / createReducer，告别 enum + class action types，
TypeScript 类型推导大幅改善，开发体验追上 Vue / React 的状态管理。

2019 v8 Entity：发布 @ngrx/entity，提供 createEntityAdapter，
标准化 normalized state 模式（{ ids, entities } 结构）。
这是 NgRx 区别于 RTK 的早期亮点（RTK 后来才有 createEntityAdapter）。

2020 v10 Selector 完善：createFeatureSelector / createSelector 类型推导精确，
开发者可以放心写复杂的派生 selector，TS 完整提示。

2022 v14 Standalone API：随 Angular 14 推出 standalone components，
NgRx 同步提供 provideStore() / provideEffects() 函数式注册，
告别 NgModule.forRoot() 风格。

2023 v16 Signals 实验：@ngrx/signals 首次预览，
试探基于 Angular Signals 的新一代 store API。

2024 v18 SignalStore GA：@ngrx/signals 正式发布 GA 版本，
withState / withMethods / withComputed / withHooks 函数式 builder API，
样板代码归零，对标 Pinia / Zustand 的开发体验。

2026 v19 当前：NgRx 19.x，
- Functional Effects 成熟（不再强制类）
- SignalStore 全面成熟（rxMethod / withStorageSync 等扩展）
- 与 Angular 19 的 Standalone-first / Zone-less 配合优化
- 官方文档明确推荐：新项目优先评估 SignalStore，复杂场景用经典 store + effects

时至今日，NgRx 已经成为 Angular 状态管理的事实标准，
和 RTK / Pinia 一起组成「三大企业级状态管理」格局。
-->

---
transition: fade-out
---

# NgRx 的核心理念

Redux 三大原则 + Angular 集成 + RxJS 副作用

<v-click>

**1. Single Source of Truth（单一数据源）**

整个应用 state 存在一棵 store 树，便于调试 / SSR hydration / 时间旅行。

</v-click>

<v-click>

**2. State is Read-Only（State 只读）**

不能直接修改 state，唯一变更方式是 dispatch action。

</v-click>

<v-click>

**3. Changes via Pure Reducers（纯函数变更）**

reducer 接收旧 state 和 action，返回新 state（必须纯函数，无副作用）。

</v-click>

<v-click>

**NgRx 在此之上叠加的现代理念**

- Effects = 副作用专属层（基于 RxJS Observable）
- Selectors = memoized 派生计算（自动缓存）
- Entity Adapter = normalized state 标准化
- SignalStore = 基于 Angular Signals 的零样板新引擎
- DevTools = 时间旅行 + action 重放

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三大原则是 NgRx 与 Redux 共享的「宪法」——
理解它们才能理解 NgRx 设计哲学。

[click] 单一数据源：整个应用 state 集中在一棵 store 树。
好处：
- 调试时一次 store.select(state => state) 拿到全部 state
- SSR 时 state 可以 JSON.stringify 传给客户端
- 跨组件状态共享：组件 A 改了，组件 B 自动收到

代价：
- 简单 Angular 项目用 NgRx 是 overkill（Service + Signal 就够）

[click] State 只读：不能直接 store.state.count = 1，
必须 dispatch({ type: 'INCREMENT' }) 表达「我想改」。

好处：
- 所有变更都通过 action 表达，DevTools 能记录全量变更
- 时间旅行成为可能（重放 action 序列）
- action 可以多个 reducer 同时响应（cross-slice 通信）

[click] 纯函数 reducer：reducer 不能 fetch、不能 console.log（开发可以）、不能 Math.random、不能 mutate。
好处：
- 测试极其简单，输入输出对照即可
- HMR 时不会丢状态
- 时间旅行可以重放历史

[click] NgRx 现代理念的关键演进：

Effects 层：
- Redux 用 thunk / saga / observable，三选一
- NgRx 直接用 RxJS Observable（@ngrx/effects）
- 在 Angular 生态里，开发者本来就熟 RxJS，零学习成本
- createEffect + ofType 监听 action stream，触发副作用，再 dispatch 后续 action

Selectors：
- createSelector 自动 memoize，依赖未变不重算
- createFeatureSelector 取 feature slice
- 组合 selector 实现复杂派生

Entity Adapter：
- 标准化 { ids: [], entities: {} } 结构
- 提供 selectAll / selectEntities / addOne / updateOne 等工具
- 避免每个开发者各自写 normalized helpers

SignalStore（新）：
- 基于 Angular Signals
- 没有 action / reducer / dispatch，直接写 method
- 体验向 Pinia / Zustand 看齐
- 是 NgRx 团队对「Redux 模式样板代码」问题的最终答案

DevTools：
- @ngrx/store-devtools 包接入 Redux DevTools 浏览器扩展
- 时间旅行 / action 重放 / state 快照
- 是 NgRx 大型项目调试杀手锏
-->

---
transition: fade-out
layoutClass: gap-x-8
layout: two-cols-header
---

# 安装与初始化

NgRx 全家桶，一行 ng add 装齐

::left::

<v-click>

**安装**

```bash
# 通过 Angular CLI（推荐）
ng add @ngrx/store@latest
ng add @ngrx/effects@latest
ng add @ngrx/store-devtools@latest

# 或手动安装
pnpm add @ngrx/store @ngrx/effects \
  @ngrx/store-devtools @ngrx/entity \
  @ngrx/router-store @ngrx/signals
```

| 包                     | 作用                          |
| ---------------------- | ----------------------------- |
| @ngrx/store            | 核心 store + reducer          |
| @ngrx/effects          | 副作用（RxJS）                |
| @ngrx/entity           | normalized state              |
| @ngrx/router-store     | 路由 state 同步               |
| @ngrx/signals          | SignalStore（新引擎）         |
| @ngrx/store-devtools   | Redux DevTools 集成           |

</v-click>

::right::

<v-click>

**Standalone API 注册（推荐）**

```ts
// app.config.ts
import { ApplicationConfig, isDevMode } from "@angular/core";
import { provideStore } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { provideRouterStore } from "@ngrx/router-store";
import { reducers } from "./reducers";
import { CounterEffects } from "./counter.effects";

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(reducers),
    provideEffects([CounterEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
    provideRouterStore(),
  ],
};
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NgRx 19.x 推荐用 Angular CLI 的 ng add 命令安装 ——
schematics 会自动注册 provider，免去手动改 app.config.ts。

包结构按需引入：
- 必装：@ngrx/store + @ngrx/store-devtools（开发期）
- 通常装：@ngrx/effects（异步 / 副作用都要）
- 按需：@ngrx/entity（列表 CRUD）、router-store（路由相关 selector）
- 新项目可考虑：@ngrx/signals（SignalStore）

版本要求：
- NgRx 19.x 要求 Angular 19+ + TypeScript 5.6+
- RxJS 7.4+
- Node 18.13+

NgRx 与 Angular 主版本号同步发布（19 对 19、18 对 18），
升级 Angular 通常同时升 NgRx。

[click] Standalone API 是 NgRx 14+ 引入的现代写法 ——
取代了老的 NgModule.forRoot(...) 风格。

provideStore：注册 root reducer
provideEffects：注册 effects 数组
provideStoreDevtools：注册 DevTools（生产 logOnly: true 只读模式）
provideRouterStore：注册路由 state 同步

isDevMode() 是 Angular 内置函数，
区分开发 / 生产环境，常用于 DevTools 配置。

logOnly 配置：
- false（开发）：完整 DevTools 功能（时间旅行 / dispatch 注入）
- true（生产）：只读模式（避免攻击者通过 DevTools 篡改 state）

老 NgModule 写法（仍支持，但不推荐）：
- StoreModule.forRoot({ counter: counterReducer })
- EffectsModule.forRoot([CounterEffects])
- StoreDevtoolsModule.instrument({ maxAge: 25 })

Standalone 写法的优势：
- 类型推导更精确
- 树摇友好（按需打包）
- 配合 inject() 函数式 DI 更自然
- Angular 19 全面推荐 standalone-first

下一页讲第一个 reducer 怎么写。
-->

---
transition: fade-out
---

# Action / Reducer / Selector 三件套

NgRx 经典 store 的核心三个原语

<v-click>

```ts
// counter.actions.ts
import { createAction, props } from "@ngrx/store";

export const increment = createAction("[Counter] Increment");
export const decrement = createAction("[Counter] Decrement");
export const set = createAction("[Counter] Set", props<{ value: number }>());

// counter.reducer.ts
import { createReducer, on } from "@ngrx/store";
import * as CounterActions from "./counter.actions";

export interface CounterState {
  value: number;
}

const initialState: CounterState = { value: 0 };

export const counterReducer = createReducer(
  initialState,
  on(CounterActions.increment, (state) => ({ ...state, value: state.value + 1 })),
  on(CounterActions.decrement, (state) => ({ ...state, value: state.value - 1 })),
  on(CounterActions.set, (state, { value }) => ({ ...state, value })),
);

// counter.selectors.ts
import { createFeatureSelector, createSelector } from "@ngrx/store";

export const selectCounterState = createFeatureSelector<CounterState>("counter");
export const selectValue = createSelector(selectCounterState, (s) => s.value);
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NgRx 经典三件套：Action + Reducer + Selector。

Actions：描述「发生了什么」
- createAction(type, props?) 创建 action factory
- type 字符串约定：[Source] Event，比如 [Counter] Increment、[Auth] Login Success
- props 用于带 payload 的 action，类型严格

可选的 action 写法：
- createAction('[Counter] Increment')  // 无 payload
- createAction('[Counter] Set', props<{ value: number }>())  // 带 payload
- createAction('[Counter] Add', (amount: number) => ({ amount }))  // 自定义 props mapper

为什么 type 用 [Source] Event 格式？
- 便于 DevTools 看到 action 来源
- 大型项目里同名事件（Click）来自不同模块，加 source 避免歧义
- 这是 Redux Style Guide 的官方推荐

Reducer：纯函数 state 变更
- createReducer(initialState, ...handlers)
- on(action, (state, payload) => newState) 描述每个 action 的处理
- 必须返回新对象（unchanged state 直接 return state）

注意 NgRx 不自带 Immer，所有 reducer 必须手动展开 ...state
- 想用 Immer 风格：装 ngrx-immer 包（社区维护）
- 或自己 wrap on() 实现

Selector：派生计算
- createFeatureSelector<T>(featureName)：取顶层 feature slice
- createSelector(...inputs, projector)：组合 selector
- 自动 memoize，输入未变不重算

selector 三大特点：
1. 自动 memoize（基于引用相等）
2. 可组合（一个 selector 是另一个的输入）
3. 类型推导：projector 函数参数类型自动推断

这套写法的「样板」感比 RTK 的 createSlice 重 ——
要分三个文件 / 三个 API。
所以 NgRx 19 推出了 createFeature 来一站式封装，下一页讲。
-->

---
transition: fade-out
---

# createFeature 一站式简化样板

把 reducer + selectors 打包，告别三文件分离

<v-click>

```ts
// counter.feature.ts
import { createFeature, createReducer, on } from "@ngrx/store";
import * as CounterActions from "./counter.actions";

export interface CounterState {
  value: number;
  loading: boolean;
}

const initialState: CounterState = { value: 0, loading: false };

export const counterFeature = createFeature({
  name: "counter",
  reducer: createReducer(
    initialState,
    on(CounterActions.increment, (s) => ({ ...s, value: s.value + 1 })),
    on(CounterActions.loadStart, (s) => ({ ...s, loading: true })),
    on(CounterActions.loadSuccess, (s, { value }) => ({ ...s, value, loading: false })),
  ),
});

// 自动生成 selector：
// counterFeature.selectCounterState
// counterFeature.selectValue
// counterFeature.selectLoading

// app.config.ts
providers: [
  provideStore(),
  provideState(counterFeature),  // 注册 feature
],

// 组件里使用
constructor(private store: Store) {}
value$ = this.store.select(counterFeature.selectValue);
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] createFeature 是 NgRx 16+ 推出的「createSlice 等价物」——
把 reducer + selectors 打包，告别三文件分离的麻烦。

API：createFeature({ name, reducer, extraSelectors? })
- name：feature key，对应 state 顶层字段
- reducer：和 createReducer 一样
- extraSelectors：额外的复合 selector（可选）

自动生成的 selector：
- selectCounterState（顶层 feature selector）
- 对每个 state 字段，生成 selectXxx（比如 value → selectValue）

这是 NgRx 团队回应 RTK createSlice 体验的关键 API ——
现在写一个 feature 只要一个文件、一个对象，
代码量与 RTK createSlice 接近（甚至更少，因为不用导出 actions / reducer / name 三次）。

注册方式：
- 根级：provideState(counterFeature) 或 provideStore({ counter: counterFeature.reducer })
- 懒加载路由：provideState(counterFeature) 放在路由 providers 里

为什么 createFeature 不取代 createSlice？
- 因为 NgRx 设计 Action 是「跨 feature 共享」的，
  一个 action 可以被多个 reducer 响应（cross-slice 通信）
- 所以 Actions 仍然独立定义（createAction），
  createFeature 只是简化「reducer + selectors」打包

vs RTK createSlice：
- createSlice 自动生成 actions（actions.increment 是 action creator）
- createFeature 需要手动 createAction，但 actions 可跨 feature 共享
- 哲学差异：NgRx 更显式，RTK 更隐式

实战经验：
- 小 feature（单一职责）：用 createFeature，一文件搞定
- 大 feature（10+ action）：拆 actions.ts + reducer.ts + selectors.ts + effects.ts
- 团队规范：能用 createFeature 就用，需要拆时再拆
-->

---
transition: fade-out
---

# 在组件中使用 Store

inject() + select / dispatch 两步走

<v-click>

```ts
// counter.component.ts
import { Component, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { CommonModule } from "@angular/common";
import * as CounterActions from "./counter.actions";
import { counterFeature } from "./counter.feature";

@Component({
  selector: "app-counter",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="counter">
      <h2>Count: {{ value$ | async }}</h2>
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
    </div>
  `,
})
export class CounterComponent {
  private store = inject(Store);

  // 订阅 selector：async pipe 自动 subscribe / unsubscribe
  value$ = this.store.select(counterFeature.selectValue);

  increment() {
    this.store.dispatch(CounterActions.increment());
  }

  decrement() {
    this.store.dispatch(CounterActions.decrement());
  }
}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NgRx 组件里只用两个 API：select / dispatch。

inject(Store) vs constructor 注入：
- Angular 14+ 推荐 inject() 函数式 DI
- 比 constructor(private store: Store) 更灵活（可以在 standalone 工厂里调用）
- 与 standalone 组件配合更自然

select 三种用法：
1. store.select(selectorFn)：返回 Observable<T>
2. store.select(featureKey)：返回 Observable<FeatureState>
3. store.select(memoizedSelector)：复用 createSelector 的缓存

async pipe 自动 subscribe / unsubscribe：
- 模板里 {{ value$ | async }} 是 Angular 标配
- 不需要手动 ngOnDestroy 清理订阅
- 配合 OnPush 变更检测，性能最佳

dispatch：
- store.dispatch(actionCreator())
- 注意 () 调用，actionCreator() 返回的是 action 对象
- 无 payload：increment()，有 payload：set({ value: 10 })

注意事项：
- 不要在 template 里直接 store.select（每次变更检测都会重新调用）
- 不要订阅整个 state（store.select(s => s)）
- selector 应该返回 primitive 或稳定引用，避免无效更新

性能优化：
- OnPush + async pipe 是 NgRx 组件性能黄金组合
- selector memoization 让重复 select 不重算
- distinctUntilChanged() 可以进一步减少 emit

Angular 19+ 新选择：
- toSignal(this.store.select(...)) 把 Observable 转 Signal
- 模板里 {{ value() }} 调用 Signal
- 配合 Angular Signals 的细粒度变更检测

这是 NgRx 与 Signals 融合的过渡方案，
后面 @ngrx/signals 章节会讲完整的 SignalStore。
-->

---
transition: fade-out
---

# Effects 副作用层

@ngrx/effects 用 RxJS 编排异步与副作用

<v-click>

```ts
// counter.effects.ts
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { HttpClient } from "@angular/common/http";
import { map, mergeMap, catchError, of } from "rxjs";
import * as CounterActions from "./counter.actions";

@Injectable()
export class CounterEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadCounter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CounterActions.loadStart),        // 只监听这个 action
      mergeMap(() =>
        this.http.get<{ value: number }>("/api/counter").pipe(
          map(({ value }) => CounterActions.loadSuccess({ value })),
          catchError((error) => of(CounterActions.loadFailure({ error }))),
        ),
      ),
    ),
  );

  // 日志副作用（不 dispatch 新 action）
  logActions$ = createEffect(
    () => this.actions$.pipe(tap((a) => console.log(a))),
    { dispatch: false },     // 关键：声明这个 effect 不产生新 action
  );
}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @ngrx/effects 是 NgRx 的副作用层 ——
所有不能放进 reducer 的逻辑（fetch、setTimeout、navigation）都在 effects 里处理。

核心模式：
1. inject Actions$ stream（action 流，所有 dispatch 的 action 都流过）
2. ofType(...actionCreators) 过滤特定 action
3. RxJS operator 链处理（map / mergeMap / switchMap / catchError）
4. 最后 emit 新 action，自动 dispatch 到 store

createEffect 内部做了什么？
- 装饰 Observable，让 NgRx 自动 subscribe + dispatch 返回值
- { dispatch: false } 关掉自动 dispatch（用于日志 / navigation 这种不需要新 action 的副作用）

操作符选择决策：
- mergeMap：并发，每个 action 独立处理（用于 add / delete）
- switchMap：取消上一个，用最新（用于 search / autocomplete）
- concatMap：串行排队（用于必须有序的操作）
- exhaustMap：忽略新的直到完成（用于防重复提交）

错误处理黄金法则：
- catchError 必须放在内层（mergeMap 内部）
- 外层 catchError 会导致 effect stream 整体死掉，之后 action 都不响应

为什么？
- effects 是「永久订阅」的 stream
- 一旦外层 catchError 触发，stream 终结
- 后续 action 没法走到这个 effect

正确写法：
```
this.actions$.pipe(
  ofType(loadStart),
  mergeMap(() =>
    this.http.get(...).pipe(
      map(...),
      catchError(err => of(loadFailure({ err })))  // 在内层
    )
  )
)
```

错误写法：
```
this.actions$.pipe(
  ofType(loadStart),
  mergeMap(() => this.http.get(...)),
  map(...),
  catchError(err => of(loadFailure({ err })))  // 在外层 ❌
)
```

[click] dispatch: false 用于：
- 日志（console / 远程上报）
- 通知（toast / snackbar）
- 路由跳转（Router.navigate）
- 任何不需要修改 state 的副作用

下一页讲 Functional Effects（NgRx 16+ 新写法，告别 class）。
-->

---
transition: fade-out
---

# Functional Effects（NgRx 16+）

告别 class，函数式 effect 配合 standalone

<v-click>

```ts
// counter.effects.ts（函数式写法）
import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { HttpClient } from "@angular/common/http";
import { map, mergeMap, catchError, of } from "rxjs";
import * as CounterActions from "./counter.actions";

// 1. 每个 effect 是一个独立函数
export const loadCounter = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) =>
    actions$.pipe(
      ofType(CounterActions.loadStart),
      mergeMap(() =>
        http.get<{ value: number }>("/api/counter").pipe(
          map(({ value }) => CounterActions.loadSuccess({ value })),
          catchError((error) => of(CounterActions.loadFailure({ error }))),
        ),
      ),
    ),
  { functional: true },     // 关键：声明 functional effect
);

// 2. 注册
// app.config.ts
providers: [
  provideEffects({ loadCounter }),   // 传对象（函数式）
  // 老写法仍支持：provideEffects([CounterEffects])  // 传类
],
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Functional Effects 是 NgRx 16+ 推出的函数式写法 ——
不再需要 class + @Injectable，每个 effect 是独立函数。

对比传统 class 写法：
- 老写法：@Injectable + class CounterEffects { ... }
- 新写法：每个 effect export 一个函数

为什么要新写法？
- 配合 Angular Standalone API 风格
- 树摇友好（未使用的 effect 自动 tree-shake）
- 更易拆分（按 effect 一个文件 vs 一个 class 多个 effect）
- inject() 函数式 DI 更自然

createEffect 第三个参数 { functional: true }：
- 告诉 NgRx 这是函数式 effect
- 自动用 inject() 注入依赖
- effect 返回 Observable<Action>

注册：
- provideEffects({ effectName1, effectName2 })：对象形式，键值是 effect 名
- provideEffects([ClassA, ClassB])：数组形式，老 class 写法

混合使用：
- 一个项目里可以同时用 class effects 和 functional effects
- 推荐新代码全部 functional，存量 class 慢慢迁

迁移成本：
- 一个 class CounterEffects 拆成多个独立函数
- 把 @Injectable + constructor 换成 inject()
- 把 createEffect(() => ...) 加上 { functional: true }

如果你的 effect 内部用 this.something（私有方法 / 字段），
迁移函数式要把这些提到模块顶层或独立函数。

CRUD 模式参考：
```
export const loadAll = createEffect(...);
export const create = createEffect(...);
export const update = createEffect(...);
export const remove = createEffect(...);

// 一个文件 export 多个 effect 函数
// provideEffects({ loadAll, create, update, remove })
```

下一页讲 Effects 常见 RxJS 操作符的选择。
-->

---
transition: fade-out
---

# Effects 操作符选择速查

mergeMap / switchMap / concatMap / exhaustMap

<v-click>

| 操作符        | 行为                                | 典型场景                            |
| ------------- | ----------------------------------- | ----------------------------------- |
| `mergeMap`    | **并发执行**，所有 action 都处理    | 添加、删除、独立请求               |
| `switchMap`   | **取消上一个**，用最新              | 搜索、自动补全、单选过滤           |
| `concatMap`   | **串行排队**，按顺序执行            | 必须有序的操作（如撤销栈）         |
| `exhaustMap`  | **忽略新的**，直到当前完成          | 防重复提交（登录、保存）           |

</v-click>

<v-click>

```ts
// 经典模式：搜索（switchMap）
search$ = createEffect(
  (actions$ = inject(Actions), api = inject(SearchService)) =>
    actions$.pipe(
      ofType(searchQuery),
      debounceTime(300),
      distinctUntilChanged((a, b) => a.query === b.query),
      switchMap(({ query }) =>
        api.search(query).pipe(
          map((results) => searchSuccess({ results })),
          catchError((err) => of(searchFailure({ err }))),
        ),
      ),
    ),
  { functional: true },
);

// 经典模式：保存（exhaustMap）
save$ = createEffect(
  (actions$ = inject(Actions), api = inject(UserService)) =>
    actions$.pipe(
      ofType(saveProfile),
      exhaustMap(({ data }) =>
        api.save(data).pipe(
          map(() => saveSuccess()),
          catchError((err) => of(saveFailure({ err }))),
        ),
      ),
    ),
  { functional: true },
);
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这四个 RxJS 操作符是 NgRx Effects 的核心选择题 ——
选错会导致 race condition 或重复请求。

mergeMap（并发）：
- 每个进来的 action 都独立处理
- 多个并发同时跑
- 典型：addTodo / deleteTodo / 独立资源请求
- 注意：可能产生 race condition（response 乱序）

switchMap（取消旧的）：
- 新 action 进来时取消上一个 inner observable
- 永远只有一个 inner stream 活跃
- 典型：搜索（用户快速输入只关心最新）、autocomplete、过滤切换
- 注意：取消时 HTTP 请求会 abort（如果用 fetch / HttpClient）

concatMap（串行排队）：
- 严格按顺序排队，前一个完成才处理下一个
- 适用：必须有序的操作（撤销栈、保存草稿队列）
- 注意：队列堆积时延迟很大

exhaustMap（忽略新的）：
- 当前 inner observable 活跃时，新 action 被忽略
- 完成后再接受新的
- 典型：防重复提交（登录、保存、支付）
- 注意：用户在等待时点击多次只触发一次

[click] 搜索 + switchMap 经典组合：
- debounceTime(300)：用户停止输入 300ms 后再触发
- distinctUntilChanged：连续相同 query 不重复请求
- switchMap：取消旧请求

[click] 保存 + exhaustMap 经典组合：
- exhaustMap：第一个保存请求处理中，后续点击被忽略
- 完成后用户可以再次保存
- 比 disable 按钮更体验友好

操作符选错的典型 bug：
1. 搜索用 mergeMap → 响应乱序（用户输入 "abc"，"ab" 的响应晚到，覆盖 "abc"）
2. 保存用 mergeMap → 用户点击 5 次保存，5 个请求并发，DB 写 5 次
3. 删除用 switchMap → 删除多个时只删了最后一个（前面被 cancel）

口诀：
- 增删 → mergeMap（并发）
- 搜索 → switchMap（取消旧）
- 排队 → concatMap（顺序）
- 防抖 → exhaustMap（忽略新）

实战建议：
- 写 effect 之前先想清楚业务场景
- 不确定就用 mergeMap，但要考虑乱序
- 让 reviewer 重点检查操作符选择
-->

---
transition: fade-out
---

# Selectors 进阶

createSelector + memoization + 组合 selector

<v-click>

```ts
// user.selectors.ts
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./user.feature";

// 1. 顶层 feature selector
export const selectUserState = createFeatureSelector<UserState>("user");

// 2. 简单派生：取字段
export const selectAllUsers = createSelector(selectUserState, (s) => s.users);
export const selectFilter = createSelector(selectUserState, (s) => s.filter);

// 3. 组合多个 selector
export const selectFilteredUsers = createSelector(
  selectAllUsers,
  selectFilter,
  (users, filter) =>
    users.filter((u) => u.name.toLowerCase().includes(filter.toLowerCase())),
);

// 4. 参数化 selector（factory 模式）
export const selectUserById = (id: string) =>
  createSelector(selectAllUsers, (users) => users.find((u) => u.id === id));

// 使用
constructor(private store: Store) {}
filteredUsers$ = this.store.select(selectFilteredUsers);
user$ = this.store.select(selectUserById("123"));
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] createSelector 是 NgRx 性能优化的核心 ——
所有从 store 派生的值都应该走 selector 而不是组件里 RxJS 链。

工作原理：
- createSelector(...inputSelectors, projector)
- inputs 变化（引用相等比较）才重算 projector
- 否则返回上次的缓存结果

memoization 关键：
- 默认用 === 严格相等比较
- 上次输入 === 这次输入 → 跳过 projector，返回缓存
- 否则跑 projector，缓存新结果

selector 设计原则：
1. 单一职责：一个 selector 取一个东西
2. 可组合：复杂派生用多个 selector 组合
3. 不要返回新对象 / 数组的引用（除非内容变了）

参数化 selector：
- 工厂函数模式：返回 createSelector
- 注意：每次调用工厂创建新 selector，所以 memoize 缓存不共享
- 想跨调用共享缓存：用 createSelectorFactory（高级用法）

性能踩坑：
- selector 里 .filter() / .map() 总返回新数组
- 但因为 createSelector memoize，相同输入返回相同引用
- 所以下游 observer 不会无效更新

什么时候不用 selector？
- 一次性派生 + 简单逻辑：直接 store.select(s => s.xxx).pipe(map(...))
- 仅在一个组件用：放组件内 computed
- 跨多个组件用 / 大数据集 / 复杂派生：用 createSelector

vs RTK reselect：
- NgRx createSelector 内部就是 reselect 实现
- API 一致，行为一致
- 学过 RTK 的开发者无缝迁移

[click] 复杂派生最佳实践：
- 把 store state 平铺（不要嵌套太深）
- 用 createEntityAdapter 标准化（下一页讲）
- selector 链：原始 → 派生1 → 派生2 → 最终
- 每一步都 memoize，整体性能最佳

调试技巧：
- selector 加日志：console.log('compute filtered') 看是否真的 memoize 生效
- 频繁调用但每次都重算 → 检查输入引用是否变了
- Redux DevTools 也能看 selector 缓存命中情况
-->

---
transition: fade-out
---

# Entity Adapter

@ngrx/entity 标准化 normalized state

<v-click>

```ts
// user.feature.ts
import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createFeature, createReducer, on } from "@ngrx/store";
import * as UserActions from "./user.actions";

export interface User {
  id: string;
  name: string;
  email: string;
}

// EntityState<User> = { ids: string[], entities: { [id]: User } }
export interface UserState extends EntityState<User> {
  loading: boolean;
}

export const adapter = createEntityAdapter<User>({
  selectId: (u) => u.id,                   // 默认就用 id 字段
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState: UserState = adapter.getInitialState({ loading: false });

export const userFeature = createFeature({
  name: "user",
  reducer: createReducer(
    initialState,
    on(UserActions.addOne, (s, { user }) => adapter.addOne(user, s)),
    on(UserActions.upsertMany, (s, { users }) => adapter.upsertMany(users, s)),
    on(UserActions.removeOne, (s, { id }) => adapter.removeOne(id, s)),
    on(UserActions.updateOne, (s, { update }) => adapter.updateOne(update, s)),
  ),
  extraSelectors: ({ selectUserState }) => ({
    ...adapter.getSelectors(selectUserState),  // 自动生成 selectAll/selectEntities/selectIds/selectTotal
  }),
});
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @ngrx/entity 是「列表 CRUD」的标准化方案 ——
解决「state 里数组操作样板代码多 + 查找 O(n) 慢」问题。

normalized state 是什么？
- 老写法：state.users = [...] 数组
- normalized：state.users = { ids: ['1', '2'], entities: { '1': {...}, '2': {...} } }
- 优势：按 id 查找 O(1)、更新只动一个 entity、序列化清晰

createEntityAdapter 配置：
- selectId：从 entity 提取 id，默认 entity.id
- sortComparer：排序函数，false 关闭排序

adapter.getInitialState({ ...extraFields })：
- 返回 { ids: [], entities: {}, ...extraFields }
- 可以混合自定义字段（loading / error 等）

CRUD operators：
- addOne(entity, state)：添加一个
- addMany(entities, state)：批量添加
- setAll(entities, state)：替换全部
- setOne / setMany：添加或替换
- upsertOne / upsertMany：存在更新，不存在添加
- updateOne / updateMany：部分更新（{ id, changes: { ... } }）
- removeOne / removeMany / removeAll：删除
- mapOne / map：映射（少用）

adapter.getSelectors(featureSelector)：
- selectAll：所有 entity 数组（按 sortComparer 排序）
- selectEntities：{ [id]: entity } 字典
- selectIds：id 数组
- selectTotal：总数

实战经验：
- 列表页用 selectAll，详情页用 selectEntities[id]（O(1)）
- 大数据集（1000+）用 normalized 比数组快 10x+
- 配合 trackBy 索引 / @for trackBy id 性能更佳

vs RTK createEntityAdapter：
- API 几乎完全一致
- NgRx 是 entity 的先驱，RTK 后来实现
- 两边的 entity adapter 可以互相借鉴最佳实践

什么时候不用 entity？
- 顺序固定的列表（如分页结果）+ 简单 CRUD
- 数据少（< 100 entity）
- 嵌套深的对象树（用 immer 风格更直接）

注意 sortComparer 的影响：
- selectAll 总是按 sortComparer 排序输出
- 如果业务需要多种排序，selector 里再排
- 不要把 sort 逻辑放 reducer（会影响 entity 数据结构）
-->

---
transition: fade-out
---

# Router Store

@ngrx/router-store 把路由 state 同步到 store

<v-click>

```ts
// app.config.ts
import { provideRouterStore, routerReducer } from "@ngrx/router-store";

providers: [
  provideRouter(routes),
  provideStore({ router: routerReducer }),
  provideRouterStore(),     // 关键：注册同步
];

// router.selectors.ts
import { getRouterSelectors } from "@ngrx/router-store";

export const {
  selectCurrentRoute,
  selectFragment,
  selectQueryParams,
  selectQueryParam,
  selectRouteParams,
  selectRouteParam,
  selectRouteData,
  selectUrl,
  selectTitle,
} = getRouterSelectors();

// 使用
constructor(private store: Store) {}
userId$ = this.store.select(selectRouteParam("id"));
queryFilter$ = this.store.select(selectQueryParam("filter"));

// 在 effect 里监听路由变化
import { ROUTER_NAVIGATED } from "@ngrx/router-store";

loadUserOnNavigate$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      filter((action) => action.payload.event.url.startsWith("/user/")),
      map(() => UserActions.loadCurrentUser()),
    ),
  { functional: true },
);
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @ngrx/router-store 把 Angular Router 的状态变化同步到 store。

为什么需要？
- 路由参数（route params / query params）也是「状态」
- 想在 selector / effects 里响应路由变化（不只是组件）
- 时间旅行调试要回溯 URL

注册步骤：
1. provideStore({ router: routerReducer })：注册 reducer
2. provideRouterStore()：启动同步

routerReducer 维护的 state：
- state.router.state：序列化的 RouterStateSnapshot
- state.router.navigationId：当前 navigation ID

[click] getRouterSelectors() 提供的 selectors：
- selectCurrentRoute：当前激活的 route
- selectUrl：当前 URL 字符串
- selectQueryParams / selectQueryParam(key)：query 参数
- selectRouteParams / selectRouteParam(key)：路由参数
- selectRouteData：路由 data（router config 里的）
- selectFragment：URL #fragment
- selectTitle：页面标题

实战用法：
- 详情页：selectRouteParam('id') → effect 加载数据
- 列表页：selectQueryParams → 同步到 filter state
- 面包屑：selectCurrentRoute → 派生面包屑路径
- 守卫前置：selectUrl → 记录上一次访问位置

[click] ROUTER_NAVIGATED action：
- 每次路由完成 navigation 后 dispatch
- 在 effect 里可以监听并触发其他 action
- 经典模式：进入 detail 页自动 load 数据

其他 router actions：
- ROUTER_REQUEST：navigation 开始
- ROUTER_NAVIGATION：开始 navigating（hooks 之前）
- ROUTER_NAVIGATED：完成
- ROUTER_CANCEL：被 guard 取消
- ROUTER_ERROR：navigation 错误

注意：
- selectRouteParam 取最深 child 的参数（不是直接 root）
- query params 是数组（同名 key 会被收集为数组）
- 如果 router state 太大（深 component tree），可以自定义 RouterStateSerializer 裁剪

vs 直接用 ActivatedRoute：
- ActivatedRoute 在组件里方便，但不能在 effect / selector 里用
- router-store 让路由状态进入 store，effect 和 selector 都能访问
- 大型应用推荐 router-store
-->

---
transition: fade-out
---

# @ngrx/signals — 新一代 SignalStore

基于 Angular Signals 的零样板 store

<v-click>

```ts
// user.store.ts
import { signalStore, withState, withMethods, withComputed, withHooks, patchState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";
import { UserService } from "./user.service";

type User = { id: string; name: string; email: string };

export const UserStore = signalStore(
  { providedIn: "root" },        // 全局单例（也可以 providedIn: 'any' 用作组件级）

  // 1. 状态
  withState({
    users: [] as User[],
    filter: "",
    loading: false,
  }),

  // 2. 派生（computed signals）
  withComputed(({ users, filter }) => ({
    filtered: computed(() =>
      users().filter((u) =>
        u.name.toLowerCase().includes(filter().toLowerCase()),
      ),
    ),
    total: computed(() => users().length),
  })),

  // 3. 方法（直接调用，无 action / dispatch）
  withMethods((store, userService = inject(UserService)) => ({
    setFilter: (filter: string) => patchState(store, { filter }),
    async load() {
      patchState(store, { loading: true });
      const users = await userService.getAll();
      patchState(store, { users, loading: false });
    },
  })),

  // 4. 生命周期 hooks
  withHooks({
    onInit(store) { store.load() },
  }),
);
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @ngrx/signals 是 NgRx 团队对「Redux 样板代码」问题的最终答案 ——
2024 年 GA，基于 Angular Signals API，零 action / 零 reducer / 零 dispatch。

signalStore() 是 builder API：
- 接受多个 feature（withState / withMethods / withComputed / withHooks）
- 每个 feature 是一个增量 builder
- 最后返回一个 Angular service（可 inject）

withState：定义初始 state
- patchState(store, { ... }) 部分更新
- patchState(store, (s) => ({ ... })) updater 函数风格
- 内部用 Signal 包装，自动响应式

withComputed：派生 signal
- 接收 store 当前 signal map
- 返回 { 派生名: computed(...) }
- 用 Angular 的 computed() 函数

withMethods：定义方法
- 接收 store + 注入的依赖
- 返回方法对象 { methodName: () => ... }
- 方法里用 patchState 更新状态
- 异步方法：直接 async/await（不需要 effect 包装）

withHooks：生命周期
- onInit：store 创建时
- onDestroy：store 销毁时（providedIn: 'root' 通常不会销毁）

providedIn 选项：
- 'root'：全局单例（类似经典 store）
- 'any' / 在 component providers 里提供：组件级实例

vs 经典 NgRx Store：
- 经典：3 文件（actions / reducer / selectors）+ effects 文件
- SignalStore：1 文件，方法 / 状态 / 派生 / 生命周期都在一起
- 经典：dispatch action 触发 reducer
- SignalStore：直接调用 method，内部 patchState

vs Pinia / Zustand：
- 体验非常接近：method-based store
- Angular Signals 让响应式更细粒度
- 类型推导：与 Pinia 一致水平

什么时候用 SignalStore？
- 中小型 Angular 项目
- 需要全局或组件级 store
- 想要 Redux 模式但讨厌样板代码
- 已经在用 Angular Signals

什么时候继续用经典 store？
- 已有大型 NgRx 项目（迁移成本高）
- 严重依赖 Redux DevTools 时间旅行
- 跨多个 reducer 共享 action
- 复杂副作用编排（effects 已有完整 RxJS 体系）

注意：
- @ngrx/signals 仍然能集成 Redux DevTools（通过 withDevtools 扩展）
- 也可以用 rxMethod 集成 RxJS（下一页讲）
- 不是替代经典 store，而是「另一种范式」
-->

---
transition: fade-out
---

# SignalStore 进阶：rxMethod + 扩展

rxMethod 把 RxJS 流接入 SignalStore

<v-click>

```ts
// user.store.ts
import { signalStore, withState, withMethods, patchState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";

export const UserStore = signalStore(
  { providedIn: "root" },
  withState({ users: [] as User[], loading: false, error: null as string | null }),

  withMethods((store, api = inject(UserService)) => ({
    // rxMethod 把 RxJS 流和 store 方法串起来
    loadUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() =>
          api.getAll().pipe(
            tapResponse({
              next: (users) => patchState(store, { users, loading: false }),
              error: (err: Error) =>
                patchState(store, { error: err.message, loading: false }),
            }),
          ),
        ),
      ),
    ),
  })),
);

// 使用
@Component({...})
export class UsersPage {
  store = inject(UserStore);
  ngOnInit() {
    this.store.loadUsers();   // 触发流（无参数）
  }
  // 模板里：{{ store.users() }} {{ store.loading() }}
}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] rxMethod 是 SignalStore 的「effects 替代品」——
让你在 SignalStore 内写 RxJS 流。

使用场景：
- 异步请求 + 防抖 / 节流 / 取消
- 流式数据（WebSocket / SSE）
- 复杂副作用编排

API：rxMethod<Input>(operator)
- Input：触发时传入的参数类型（void 表示无参数）
- operator：RxJS pipe，返回 Observable
- 返回一个函数，调用即触发流

tapResponse 是 @ngrx/operators 提供的工具：
- 简化 next / error 分支
- 替代 map + catchError 的模板

vs @ngrx/effects：
- effects 监听全局 action stream
- rxMethod 是 store 内置方法触发流
- effects 在 SignalStore 里通常不需要（rxMethod 替代）

rxMethod 调用方式：
- store.loadUsers()：触发一次
- store.loadUsers(payload)：传 payload 触发
- store.loadUsers$.next(payload)：用 Subject 风格触发（少见）
- 把 signal 传进去：store.loadUsers(query)，query 变化自动触发

rxMethod + signal 组合：
```
loadUsers: rxMethod<string>(
  pipe(
    debounceTime(300),
    switchMap(query => api.search(query).pipe(...))
  )
)

// 使用
store.loadUsers(this.queryInputSignal)  // signal 变化自动触发
```

[click] SignalStore 扩展生态：
- @ngrx/signals/rxjs-interop：rxMethod 接入 RxJS
- @ngrx/signals/entities：normalized entity 适配器（withEntities）
- ngrx-toolkit（社区）：withStorageSync / withDataService / withRedux
- withDevtools：集成 Redux DevTools

withEntities 示例：
```
import { withEntities } from '@ngrx/signals/entities';

signalStore(
  withState({ filter: '' }),
  withEntities<User>(),  // 自动提供 entities / ids / addOne / updateOne
  withMethods(store => ({
    add: (u: User) => addEntity(u, store),
  }))
)
```

实战经验：
- 小 store + 同步状态：纯 withState + withMethods
- 异步 + 防抖：用 rxMethod
- 列表 CRUD：用 withEntities
- DevTools 调试：用 withDevtools
- 持久化：用 withStorageSync（社区扩展）

NgRx Signals 已经是 Angular 19 时代的「轻量首选」——
对中小项目可以完全替代经典 NgRx Store + Effects。
-->

---
transition: fade-out
---

# @ngrx/component-store

组件级局部 store，适合复杂表单 / 向导

<v-click>

```ts
// movies.store.ts
import { ComponentStore } from "@ngrx/component-store";
import { Injectable } from "@angular/core";
import { tap, switchMap, catchError, EMPTY } from "rxjs";

interface MoviesState {
  movies: Movie[];
  loading: boolean;
}

@Injectable()
export class MoviesStore extends ComponentStore<MoviesState> {
  constructor(private api: MovieService) {
    super({ movies: [], loading: false });
  }

  // 1. selectors（自动 memoize）
  readonly movies$ = this.select((s) => s.movies);
  readonly loading$ = this.select((s) => s.loading);

  // 2. updaters（同步 state 更新）
  readonly setLoading = this.updater((state, loading: boolean) => ({ ...state, loading }));
  readonly addMovie = this.updater((state, movie: Movie) => ({
    ...state, movies: [...state.movies, movie],
  }));

  // 3. effects（RxJS 副作用，集成在 store 内部）
  readonly loadMovies = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(() =>
        this.api.getAll().pipe(
          tap({
            next: (movies) => this.patchState({ movies, loading: false }),
            error: () => this.setLoading(false),
          }),
          catchError(() => EMPTY),
        ),
      ),
    ),
  );
}

// 在组件里
@Component({ providers: [MoviesStore] })  // 关键：组件级提供
export class MoviesPage {
  constructor(public store: MoviesStore) {}
  ngOnInit() { this.store.loadMovies() }
}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @ngrx/component-store 是「组件级局部 store」——
2020 年发布，定位是「全局 NgRx Store 之外的补充」。

适用场景：
- 复杂表单状态（多步向导、动态字段）
- 单页面专属状态（不需要跨页面共享）
- 业务复杂但又不想污染全局 store

API 三件套：
- selectors：this.select(projector)，返回 Observable
- updaters：this.updater((state, payload) => newState)
- effects：this.effect(stream => stream.pipe(...))

vs 全局 Store：
- 生命周期：跟随组件销毁
- 注册方式：组件 providers 里 [MoviesStore]
- 不需要 actions / reducer / 注册到 root state

vs Service + RxJS：
- ComponentStore 提供标准化 API（updater / effect / select）
- 不需要自己写 BehaviorSubject + 派发逻辑
- selectors 自动 memoize（避免每次 next 都重算）

[click] 关键 API：
- setState(newState | (state) => newState)：全量替换
- patchState(partialState | (state) => partial)：部分更新
- updater((state, payload) => newState)：返回方法
- effect(stream$ => stream$.pipe(...))：RxJS 副作用
- select(projector): Observable

在组件 providers 里提供：
@Component({ providers: [MoviesStore] })
- 组件销毁时 store 也销毁
- 每个组件实例有独立 store（不共享）

如果在 module / root 提供：
@Injectable({ providedIn: 'root' })
- 退化成全局 service（不推荐，应该用全局 Store）

[click] 与 SignalStore 的关系：
- component-store 是 2020 年的解决方案
- SignalStore 在 2024 年发布后，定位变得有些重叠
- NgRx 官方推荐：新代码优先考虑 SignalStore（组件级也能用）
- 老 component-store 代码仍然能用，无需强制迁移

迁移路径：
- selectors → withComputed
- updaters → withMethods + patchState
- effects → withMethods + rxMethod

迁移成本：
- API 直接对应，机械迁移可行
- 但要测试覆盖率高时再大规模迁移
- 小步快走，新 feature 用 SignalStore，老的不动
-->

---
transition: fade-out
---

# DevTools 集成与时间旅行

@ngrx/store-devtools 接入 Redux DevTools

<v-click>

```ts
// app.config.ts
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { isDevMode } from "@angular/core";

providers: [
  provideStore(reducers),
  provideStoreDevtools({
    maxAge: 25,                 // 保留最近 25 个 action
    logOnly: !isDevMode(),      // 生产环境只读（不能 dispatch）
    autoPause: true,            // window 未聚焦时暂停记录
    trace: false,               // 性能：false（开启 true 会记录 stack trace）
    traceLimit: 75,
    connectInZone: true,        // Zone-less 项目设 false
    actionsBlocklist: ["[Router] *"],  // 排除噪声 action
    name: "My App Store",
    features: {
      pause: true, lock: true, persist: true,
      export: true, import: "custom",
      jump: true, skip: true,
      reorder: true, dispatch: true, test: true,
    },
  }),
];
```

</v-click>

<v-click>

> 💡 **提示**：浏览器需装 [Redux DevTools 扩展](https://github.com/reduxjs/redux-devtools)（Chrome / Firefox / Edge 都有），开发期打开就能看时间旅行 / action 重放。

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @ngrx/store-devtools 是 NgRx 大型项目调试的「杀手锏」——
接入 Redux DevTools 浏览器扩展，提供时间旅行 / action 重放 / state 快照。

provideStoreDevtools 配置：

maxAge：
- 保留多少个 action（默认 50）
- 数值越大内存占用越高
- 大项目 25-50 够用

logOnly：
- !isDevMode() 在生产开 true
- 生产 logOnly: true 只读模式
- 攻击者打不开 DevTools 篡改 state（重要安全防护）

autoPause：
- 浏览器 window 失焦时停止记录
- 减少 idle 时的内存占用
- 推荐 true

trace：
- 记录每个 action 的 stack trace
- 调试「这个 action 哪里 dispatch 的」神器
- 但性能开销大，仅 dev 用

actionsBlocklist：
- 数组，正则 / 字符串
- 过滤噪声（如 [Router] * 路由 action 太频繁）
- 让 DevTools 只看业务 action

features：
- 控制 DevTools 哪些功能可用
- 默认全开（开发环境）
- 生产可以关掉 jump / dispatch（防篡改）

connectInZone：
- Zone-less 项目（Angular 18+ Zone-less mode）设 false
- 默认 true，配合传统 Zone.js

[click] Redux DevTools 扩展常用功能：
- Action 列表：所有 dispatched action 时间线
- State 树：当前 state JSON view
- Diff：每个 action 前后的 state 差异
- Jump to action：跳到某个历史 state
- Replay：从开始重放所有 action
- Import / Export：state 快照导入导出
- Pause / Lock：暂停记录 / 锁定不接受新 action

时间旅行调试场景：
- 复现 bug：用户报 bug 时 Export state.json，开发者 Import 复现
- A/B 测试：跳到关键点比较两种操作路径
- 教学 / Code Review：演示 state 变化流程

vs SignalStore DevTools：
- @ngrx/signals 也支持 DevTools（通过 withDevtools 扩展）
- 但 SignalStore 没有 action / dispatch 概念
- DevTools 展示的是 state 变更，不是 action 列表

注意事项：
- maxAge 太大可能内存爆炸（生产更要小心）
- 敏感数据（token / 密码）不应该进 store
- 生产 logOnly 是默认且必须的
-->

---
transition: fade-out
---

# TypeScript 完整类型

createAction 自动推导 + Store 类型

<v-click>

```ts
// 1. createAction 自动推导 type 字符串和 payload
import { createAction, props } from "@ngrx/store";

export const setUser = createAction(
  "[User] Set",
  props<{ id: string; name: string }>(),
);

// 自动推导：setUser.type === "[User] Set"
// 自动推导：setUser({ id: '1', name: 'A' }) 返回 { type: "[User] Set", id: '1', name: 'A' }

// 2. createReducer 类型严格
import { createReducer, on, ActionReducer } from "@ngrx/store";

interface UserState { id: string; name: string }
const initialState: UserState = { id: "", name: "" };

const reducer: ActionReducer<UserState> = createReducer(
  initialState,
  on(setUser, (s, { id, name }) => ({ ...s, id, name })),
  //  ↑ payload 类型自动从 setUser props 推导
);

// 3. Store 类型化
import { Store } from "@ngrx/store";

interface AppState {
  user: UserState;
  counter: CounterState;
}

constructor(private store: Store<AppState>) {}
// store.select(s => s.user) 自动推导出 UserState
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NgRx 全链路 TypeScript 推导，几乎不需要手写类型 ——

createAction 推导：
- 第一个参数 type 字符串 → action.type 字面量类型
- props<T>() 注入 payload 类型 → action 对象就有 T 的所有字段
- 调用 setUser({ id, name }) 时 IDE 自动提示 payload 字段

旧 Redux 写法（手写类型）：
```
interface SetUserAction {
  type: 'SET_USER';
  payload: { id: string; name: string };
}
```
NgRx 不需要这种手写，createAction 全自动。

createReducer / on 推导：
- on(actionCreator, handler) 中 handler 第二个参数自动是 action 类型
- 解构 { id, name } 时类型完整提示

Store 类型化：
- Store<AppState> 让 store.select() 推导精确
- 不传泛型：Store<object>，select 返回 Observable<any>（不推荐）

[click] AppState 接口约定：
- 集中定义 root state 形状
- 每个 feature 接口 + 顶层 AppState 组合
- 不要把 AppState 写在 reducer 文件里（循环依赖）

selector 推导：
```
export const selectUser = (state: AppState) => state.user;
// or
export const selectUser = createFeatureSelector<UserState>('user');
// or（最佳）
export const userFeature = createFeature({ ... });
this.store.select(userFeature.selectUserState)
```

createFeatureSelector 的两种写法：
- createFeatureSelector<UserState>('user')：传 key 字符串
- createFeatureSelector<UserState, AppState>('user')：双泛型（少见）

[click] 实战类型规范：
1. 一个 feature 一个 *.feature.ts 文件，导出 createFeature
2. AppState 在 reducers/index.ts 中集中
3. action 文件用 import * as XxxActions from './xxx.actions'
4. selectors 优先用 feature.selectXxx（自动生成）
5. effect 函数式 inject() 全程类型推导

调试 TypeScript 错误：
- "Type 'never' is not assignable" → 通常 selector 泛型未推导
- "Property 'xxx' does not exist on 'Store<unknown>'" → Store 没传泛型
- action payload 类型错 → 检查 props<...>() 泛型是否对

NgRx 类型推导深度甚至超过 RTK ——
RTK 因为 immer 包装，部分场景类型推导失效，
NgRx 显式 ...state 让类型链完整。
-->

---
transition: fade-out
---

# 异步与错误处理模式

Loading / Error / Success 状态机

<v-click>

```ts
// user.feature.ts
interface UserState {
  data: User | null;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
}

const initialState: UserState = { data: null, status: "idle", error: null };

export const userFeature = createFeature({
  name: "user",
  reducer: createReducer(
    initialState,
    on(loadUser, (s) => ({ ...s, status: "loading", error: null })),
    on(loadUserSuccess, (s, { user }) => ({ ...s, data: user, status: "success" })),
    on(loadUserFailure, (s, { error }) => ({ ...s, status: "error", error })),
  ),
});

// user.effects.ts
export const loadUser = createEffect(
  (actions$ = inject(Actions), api = inject(UserService)) =>
    actions$.pipe(
      ofType(UserActions.loadUser),
      switchMap(({ id }) =>
        api.getUser(id).pipe(
          map((user) => UserActions.loadUserSuccess({ user })),
          catchError((err: HttpErrorResponse) =>
            of(UserActions.loadUserFailure({ error: err.message })),
          ),
        ),
      ),
    ),
  { functional: true },
);
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NgRx 异步操作的标准模式：三个 action（trigger / success / failure）+ 状态机字段。

action 三件套约定：
- loadUser：trigger 加载（带 id 参数）
- loadUserSuccess：成功（带 user 数据）
- loadUserFailure：失败（带 error 信息）

为什么不用一个 action？
- Redux 不允许异步 action（reducer 必须纯函数）
- 用 effect 监听 trigger，发起请求，再 dispatch success / failure
- 这是 Redux 模式异步处理的标准流程

state 状态机：
- status: 'idle' | 'loading' | 'success' | 'error'
- 四种状态明确，UI 决策简单（loading → spinner，error → 错误提示）

vs 多个布尔字段：
- 老写法：{ loading: boolean, error: any, success: boolean }
- 问题：三个布尔可能矛盾（loading && success）
- 状态机字段强制互斥

[click] effect 错误处理黄金法则：
- catchError 必须放在内层 switchMap 内部
- 否则一次错误后整个 effect stream 死掉
- 错误正确：每次失败 emit failure action 重新进入 idle

完整 retry 模式：
```
loadUser$ = createEffect(...)
  ofType(loadUser),
  switchMap(({ id }) =>
    api.getUser(id).pipe(
      retry({ count: 3, delay: 1000 }),  // 重试 3 次
      map(user => loadUserSuccess({ user })),
      catchError(err => of(loadUserFailure({ error: err.message })))
    )
  )
```

并发请求模式（混用 mergeMap）：
- ofType(loadAll) → mergeMap(() => combineLatest([api.a(), api.b()]))
- 等待所有并发完成
- 注意每个 api call 内部自己 catchError，否则一个失败导致全部失败

错误信息存储：
- 推荐存 error.message 字符串（避免存整个 Error 对象，序列化困难）
- 复杂错误对象：转 plain object { code, message, details }

selector 派生 UI 状态：
```
selectIsLoading = createSelector(userFeature.selectStatus, s => s === 'loading')
selectHasError = createSelector(userFeature.selectStatus, s => s === 'error')
selectErrorMessage = userFeature.selectError
```

组件用法：
```
@Component({ template: `
  <div *ngIf="isLoading$ | async">加载中...</div>
  <div *ngIf="hasError$ | async">错误：{{ errorMessage$ | async }}</div>
  <user-card *ngIf="user$ | async as user" [user]="user" />
` })
```

这是 NgRx 大型应用的标准异步模式，
每个 feature 都遵循这个流程，团队规范一致。
-->

---
transition: fade-out
---

# 测试：MockStore + provideMockStore

@ngrx/store 测试工具简化单元测试

<v-click>

```ts
// counter.component.spec.ts
import { TestBed } from "@angular/core/testing";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { CounterComponent } from "./counter.component";
import { counterFeature } from "./counter.feature";
import * as CounterActions from "./counter.actions";

describe("CounterComponent", () => {
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;
  const initialState = { counter: { value: 0 } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CounterComponent],
      providers: [provideMockStore({ initialState })],
    });
    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, "dispatch");
  });

  it("should select value", (done) => {
    store.overrideSelector(counterFeature.selectValue, 42);
    const fixture = TestBed.createComponent(CounterComponent);
    fixture.detectChanges();

    const componentInstance = fixture.componentInstance;
    componentInstance.value$.subscribe((value) => {
      expect(value).toBe(42);
      done();
    });
  });

  it("should dispatch increment", () => {
    const fixture = TestBed.createComponent(CounterComponent);
    fixture.componentInstance.increment();
    expect(dispatchSpy).toHaveBeenCalledWith(CounterActions.increment());
  });
});
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @ngrx/store/testing 提供 provideMockStore + MockStore，简化 NgRx 组件 / service 测试。

provideMockStore：
- 注入一个 Mock 版的 Store
- 接受 initialState 配置
- spy 可以监听 dispatch 调用

MockStore 关键 API：
- overrideSelector(selector, value)：让某个 selector 返回固定值
- setState(newState)：直接设置 state
- refreshState()：强制 selector 重算
- 可以 spyOn(store, 'dispatch') 监听 dispatch

测试流程：
1. configureTestingModule 注入 provideMockStore
2. inject MockStore
3. overrideSelector 让组件读到固定值
4. spy on dispatch 验证组件触发 action

注意要点：
- overrideSelector 必须用 selector 引用（不是 selector 名字）
- selector 改名 / 删除时测试自动失败（编译时报错）
- 多个测试间用 beforeEach 重置 state

reducer 测试（最简单）：
```
import { counterReducer } from './counter.reducer';
import * as CounterActions from './counter.actions';

it('increments', () => {
  const initialState = { value: 0 };
  const action = CounterActions.increment();
  const state = counterReducer(initialState, action);
  expect(state.value).toBe(1);
});
```
不需要 TestBed，纯函数测试。

selector 测试（也简单）：
```
import { counterFeature } from './counter.feature';

it('returns value', () => {
  const result = counterFeature.selectValue.projector({ value: 42 });
  expect(result).toBe(42);
});
```
selector.projector 取出底层函数，不需要 store。

[click] Effects 测试：
```
import { provideMockActions } from '@ngrx/effects/testing';
import { TestScheduler } from 'rxjs/testing';

describe('CounterEffects', () => {
  let actions$: Observable<Action>;
  let effects: CounterEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CounterEffects,
        provideMockActions(() => actions$),
        // ... mock dependencies
      ],
    });
    effects = TestBed.inject(CounterEffects);
  });

  it('loadCounter dispatches success', () => {
    actions$ = of(loadStart());
    effects.loadCounter$.subscribe(action => {
      expect(action.type).toBe('[Counter] Load Success');
    });
  });
});
```

实战经验：
- reducer / selector 测试简单，应该 100% 覆盖
- 组件测试用 provideMockStore，不需要真 store
- effects 测试用 provideMockActions + marble testing（高级）
- 集成测试用 StoreModule.forRoot 真 store（很少需要）

测试金字塔：
- 70% reducer / selector 单元测试
- 20% 组件 + MockStore 测试
- 10% effects + 端到端测试
-->

---
transition: fade-out
---

# Action Group Creator

createActionGroup 一组 action 一行声明

<v-click>

```ts
// counter.actions.ts
import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const CounterActions = createActionGroup({
  source: "Counter",
  events: {
    "Increment": emptyProps(),
    "Decrement": emptyProps(),
    "Set Value": props<{ value: number }>(),
    "Load Start": emptyProps(),
    "Load Success": props<{ value: number }>(),
    "Load Failure": props<{ error: string }>(),
  },
});

// 自动生成 action creators（camelCase）：
// CounterActions.increment()                  // type: "[Counter] Increment"
// CounterActions.decrement()                  // type: "[Counter] Decrement"
// CounterActions.setValue({ value: 10 })      // type: "[Counter] Set Value"
// CounterActions.loadStart()
// CounterActions.loadSuccess({ value: 5 })
// CounterActions.loadFailure({ error: "..." })

// 使用
this.store.dispatch(CounterActions.increment());
this.store.dispatch(CounterActions.setValue({ value: 100 }));

// 在 reducer / effect 里
on(CounterActions.loadStart, (s) => ({ ...s, loading: true })),
ofType(CounterActions.loadSuccess),
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] createActionGroup 是 NgRx 16+ 推出的 action 批量声明 API。

API：createActionGroup({ source, events })
- source：action type 前缀（[Source]）
- events：一个对象，key 是事件名，value 是 props

events 的 key 自动 camelCase 化：
- "Increment" → CounterActions.increment
- "Set Value" → CounterActions.setValue
- "Load Failure" → CounterActions.loadFailure

emptyProps()：
- 表示「无 payload」
- 替代显式 createAction(type) 写法

props<T>()：
- 表示有 payload，类型 T
- 与 createAction 一致

为什么这样设计？
- 大型 feature 可能有 10+ action
- 老写法每个 action 单独 createAction，代码冗长
- createActionGroup 一行声明一个事件，更紧凑

vs 单独 createAction：
- createAction：独立 export，可以从任意文件 import
- createActionGroup：所有 action 是同一对象的属性，import 一个对象

实战经验：
- 单个 feature 内：用 createActionGroup
- 跨 feature 共享：用 createAction（独立 export）
- 通用 lifecycle action：用 createActionGroup（loadStart / loadSuccess / loadFailure 一组）

命名约定：
- source 用 PascalCase：[User] 而非 [user]
- events 用 Title Case：'Load Start' 而非 'load_start'
- 自动 camelCase：CounterActions.loadStart

[click] 与 createFeature 配合：
```
// 一个 feature 的标准 5 个文件：
// 1. user.actions.ts → createActionGroup
// 2. user.feature.ts → createFeature 包含 reducer + selectors
// 3. user.effects.ts → functional createEffect
// 4. user.service.ts → Angular service 包装 API
// 5. index.ts → 统一 re-export

// app.config.ts
providers: [
  provideStore(),
  provideState(userFeature),
  provideEffects({ loadUser, saveUser, deleteUser }),
]
```

这是 NgRx 19 推荐的标准 feature 结构 ——
和 RTK 的 slice + listener 一样简洁，
但保留了 Redux 模式的清晰拆分。

注意：
- createActionGroup 是 NgRx 16+ 才有
- 老项目升级时可以保留 createAction，新代码用 createActionGroup
- 不混用：一个 feature 内统一风格
-->

---
transition: fade-out
---

# Meta Reducers

全局拦截器：日志 / 持久化 / undo-redo

<v-click>

```ts
// meta-reducers.ts
import { ActionReducer, MetaReducer } from "@ngrx/store";

// 1. 日志 meta-reducer
export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    console.log("prev state", state);
    console.log("action", action);
    const next = reducer(state, action);
    console.log("next state", next);
    return next;
  };
}

// 2. localStorage 持久化
export function persist(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    if (action.type === "@ngrx/store/init") {
      const saved = localStorage.getItem("app-state");
      if (saved) return JSON.parse(saved);
    }
    const next = reducer(state, action);
    localStorage.setItem("app-state", JSON.stringify(next));
    return next;
  };
}

// 3. 注册
import { isDevMode } from "@angular/core";

export const metaReducers: MetaReducer[] = isDevMode()
  ? [logger, persist]
  : [persist];

// app.config.ts
providers: [
  provideStore(reducers, { metaReducers }),
];
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Meta-reducers 是 NgRx 的「全局拦截器」——
包装在所有 reducer 外层，每次 action 都经过它。

签名：(reducer) => (state, action) => newState
- 接收原 reducer
- 返回新 reducer
- 新 reducer 处理时可以做前置 / 后置逻辑

常见用途：
1. 日志（记录所有 action / state 变化）
2. 持久化（localStorage / sessionStorage）
3. undo-redo（栈式 state 历史）
4. 性能监控（计时 reducer 执行）
5. 错误捕获（reducer throw 时上报）

[click] 日志 meta-reducer：
- 适合开发期使用
- 类似 DevTools，但能输出到 console（特殊场景）
- 生产关掉（性能开销）

[click] 持久化 meta-reducer：
- INIT action 时从 storage 恢复
- 每次 action 后写回 storage
- 注意：每次 dispatch 都 JSON.stringify，性能差
- 推荐：用 throttle 或只持久化特定 slice

更好的持久化方案：
- ngrx-store-persist（社区包）：声明式配置，自动节流
- 自己写：只在特定 action 时持久化（避免高频 action 拖累性能）
- 或：单独的 effect 监听特定 action 写 storage

持久化要点：
- 不持久化 loading / error 等瞬态字段
- 不持久化敏感信息（token / 密码）
- key 加版本前缀（v1:app-state），便于 schema 升级
- try/catch JSON.parse（损坏数据不让 app 崩）

[click] undo-redo meta-reducer：
- 维护一个 state 历史栈
- UNDO action → 弹栈 → 设为当前 state
- REDO action → 推栈 → 设为当前 state
- 复杂应用（绘图 / 编辑器）必备

社区包：ngrx-wieder / ngrx-undo
- 提供成熟的 undo-redo 实现
- 比手写 meta-reducer 健壮

注意事项：
- meta-reducer 顺序很重要：[logger, persist] 先执行 logger 后执行 persist
- 不要在 meta-reducer 里 dispatch（会无限循环）
- 不要让 meta-reducer 修改 action（破坏纯函数原则）

vs 中间件（middleware）：
- Redux 有 middleware 概念（applyMiddleware）
- NgRx 用 meta-reducer 替代 middleware
- 副作用类的应该用 Effects，meta-reducer 只做 reducer 包装

性能考虑：
- 每个 action 都过所有 meta-reducer
- 数量越多越慢
- 通常 2-3 个为限
-->

---
transition: fade-out
---

# Lazy Loading 懒加载 Feature

按路由懒加载 NgRx state

<v-click>

```ts
// app.routes.ts
import { Routes } from "@angular/router";
import { provideState } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";

export const routes: Routes = [
  {
    path: "users",
    loadComponent: () => import("./users/users.page").then((m) => m.UsersPage),
    providers: [
      provideState(userFeature),                  // 懒加载 reducer
      provideEffects({ loadUsers, deleteUser }),  // 懒加载 effects
    ],
  },
  {
    path: "products",
    loadChildren: () => import("./products/products.routes").then((m) => m.productRoutes),
  },
];

// products/products.routes.ts
import { Routes } from "@angular/router";
import { provideState } from "@ngrx/store";
import { productFeature } from "./product.feature";

export const productRoutes: Routes = [
  {
    path: "",
    providers: [
      provideState(productFeature),
      provideEffects({ loadProducts }),
    ],
    children: [
      { path: "", loadComponent: () => import("./list.page") },
      { path: ":id", loadComponent: () => import("./detail.page") },
    ],
  },
];
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NgRx 14+ 配合 standalone API 支持「路由级懒加载 state」——
路由首次访问时才注册 feature reducer + effects。

为什么要懒加载？
- 大型应用每个模块都注册 → 初始 bundle 巨大
- 懒加载 → 进入对应路由再加载 reducer / effects
- 与 Angular 路由懒加载（loadChildren）天然契合

provideState 在路由 providers 里：
- 第一次进入路由时注册 feature reducer
- 同时 dispatch INIT action
- 路由切走后 reducer 仍保留（不卸载）

provideEffects 在路由 providers 里：
- 第一次进入路由时注册 effects
- effects 启动后持续监听 action stream
- 路由切走后 effects 仍订阅

注意：
- 懒加载的 reducer 不卸载（除非主动 removeFeatureState，少用）
- 进入两次同一路由不会重复注册（NgRx 内部去重）
- effects 同理，每个类 / 函数只注册一次

[click] 老 NgModule 写法（仍支持）：
```
@NgModule({
  imports: [
    StoreModule.forFeature('users', userReducer),
    EffectsModule.forFeature([UserEffects]),
  ]
})
export class UsersModule {}
```

新 standalone 写法（推荐）：
```
{
  path: 'users',
  providers: [
    provideState(userFeature),
    provideEffects({ loadUsers }),
  ],
  loadComponent: () => import('./users.page'),
}
```

混合：standalone 项目可以用 importProvidersFrom 引入 NgModule 风格的 forFeature。

实战经验：
- 大型项目按 feature 懒加载（每个业务模块独立 feature）
- 共享 feature（user / auth）放 root providers
- 临时 feature（向导 / 表单）懒加载，结束清理

测试懒加载：
- e2e 用 NetWork 标签看每个路由加载了什么
- 检查 bundle 分析器（vite-bundle-visualizer）confirm 拆包

懒加载坑：
- 跨 feature 共享 selector 时，被引用的 feature 必须已注册
- 进入 path: 'users' 前 selectUserList 返回 undefined（reducer 未注册）
- 解决：把跨用共享 feature 放在 root，业务专属 feature 懒加载

性能数据：
- 大型应用懒加载可减少 30-50% 初始 bundle
- 配合 preloadingStrategy: PreloadAllModules 后台预加载
- 用户体验：首屏快，导航无感
-->

---
transition: fade-out
---

# RxJS 实战：Effects 高级模式

retry / debounce / cache / cancellation

<v-click>

```ts
// 1. 重试（指数退避）
export const loadWithRetry = createEffect(
  (actions$ = inject(Actions), api = inject(Api)) =>
    actions$.pipe(
      ofType(loadStart),
      switchMap(() =>
        api.get().pipe(
          retry({
            count: 3,
            delay: (err, retryCount) => timer(1000 * Math.pow(2, retryCount)),
          }),
          map((data) => loadSuccess({ data })),
          catchError((err) => of(loadFailure({ err }))),
        ),
      ),
    ),
  { functional: true },
);

// 2. 缓存（withLatestFrom 检查 cache）
export const loadIfNeeded = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) =>
    actions$.pipe(
      ofType(loadIfNeeded),
      withLatestFrom(store.select(featureFeature.selectData)),
      filter(([_, data]) => !data || isStale(data)),
      switchMap(() => api.get().pipe(map((d) => loadSuccess({ data: d })))),
    ),
  { functional: true },
);

// 3. 取消（takeUntil 监听 cancel action）
export const cancellableLoad = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(loadStart),
      switchMap(() =>
        api.longRunning().pipe(
          takeUntil(actions$.pipe(ofType(loadCancel))),
          map((d) => loadSuccess({ data: d })),
        ),
      ),
    ),
  { functional: true },
);
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NgRx Effects 的强项是「能用 RxJS 全部威力」——
这是 NgRx 区别于 RTK thunk 的关键。

[click] 重试模式（指数退避）：
- retry({ count, delay }) 是 RxJS 7+ 的 API
- count: 最多重试次数
- delay: 计算每次重试间隔（这里指数退避 1s, 2s, 4s）
- 网络抖动 / 临时 503 经典处理

老 retry 写法（不推荐）：
```
retryWhen(errors => errors.pipe(delay(1000), take(3)))
```

新 retry 写法（推荐）：
```
retry({ count: 3, delay: 1000 })  // 简单
retry({ count: 3, delay: (err, n) => timer(...) })  // 复杂
```

注意区分：
- retry 是「重订阅 source」（重新调 api.get()）
- repeat 是「正常完成后再次订阅」（不同语义）

[click] 缓存模式（去重 / 跳过）：
- withLatestFrom(store.select(...)) 拿到当前 state
- filter 判断是否需要请求
- 已有数据且未过期 → 跳过
- 否则发请求

isStale 实现：
```
function isStale(data: { timestamp: number }): boolean {
  return Date.now() - data.timestamp > 5 * 60 * 1000;  // 5 分钟过期
}
```

更高级的缓存：
- 用 shareReplay + ttl
- 用 ngrx-data 内置缓存
- 用 @ngrx/signals withCache（社区扩展）

[click] 取消模式（用户主动取消）：
- takeUntil(actions$.pipe(ofType(cancel))) 监听取消 action
- 用户点击 cancel 时 dispatch cancel action
- 当前 inner observable 立即终止
- 适用于「上传文件 / 长查询 / 流式请求」

vs switchMap 的自动取消：
- switchMap 当新 action 进来才自动取消
- takeUntil 任何时候都能取消（用户主动）
- 可以同时用

竞速模式（race）：
```
race(
  api.fromServer(),
  api.fromCache().pipe(delay(500)),  // 500ms 后用 cache 兜底
)
```

并发请求（forkJoin / combineLatest）：
- forkJoin([a$, b$]) 等待全部完成
- combineLatest([a$, b$]) 任一变化时 emit
- 用于「列表 + 详情同时加载」

RxJS 进阶在 NgRx 项目里几乎是必需的 ——
团队招聘 NgRx 工程师，RxJS 是必考项。

学习路径：
- 看官方 RxJS 文档的 Operators 速查
- learnrxjs.io 的实战示例
- RxJS Marbles 测试（高级，写 effect 单元测试用）
-->

---
transition: fade-out
---

# 与 ngrx-data 数据层

声明式 entity CRUD，告别样板代码

<v-click>

```ts
// entity-metadata.ts
import { EntityMetadataMap } from "@ngrx/data";

export const entityMetadata: EntityMetadataMap = {
  Hero: {},        // 用默认配置
  Villain: {
    selectId: (v: Villain) => v.id,
    sortComparer: (a: Villain, b: Villain) => a.name.localeCompare(b.name),
  },
};

// app.config.ts
import { provideEntityData, withEffects } from "@ngrx/data";

providers: [
  provideStore(),
  provideEffects(),
  provideEntityData({ entityMetadata }, withEffects()),
];

// hero.service.ts
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from "@ngrx/data";

@Injectable({ providedIn: "root" })
export class HeroService extends EntityCollectionServiceBase<Hero> {
  constructor(factory: EntityCollectionServiceElementsFactory) {
    super("Hero", factory);
  }
}

// 组件里直接用，无需 actions / reducer / effects
constructor(public heroService: HeroService) {}
heroes$ = this.heroService.entities$;
ngOnInit() { this.heroService.getAll() }
add(hero: Hero) { this.heroService.add(hero) }
update(hero: Hero) { this.heroService.update(hero) }
remove(id: number) { this.heroService.delete(id) }
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @ngrx/data 是 NgRx 的「数据层」扩展 ——
为标准 REST CRUD 资源消除 90% NgRx 样板代码。

核心思想：
- 大部分实体 CRUD 操作都是相似的（getAll / getById / add / update / delete）
- @ngrx/data 用一份元数据 + 一行 service 声明
- 自动生成 actions / reducer / effects / selectors

工作流程：
1. 在 entityMetadata 声明每种 entity 的配置
2. provideEntityData 注册全局
3. 继承 EntityCollectionServiceBase 创建 service
4. 组件里直接调用 service.add / service.delete

vs 手写 NgRx：
- 手写：每个 entity 写 actions（5+）+ reducer + effects + selectors
- ngrx-data：一行 metadata + service 即可
- 代码量减少 80%+

底层实现：
- ngrx-data 内部用 entity adapter（@ngrx/entity）
- 自动生成 actions（Hero_GetAll / Hero_Add / ...）
- 默认用 RESTful 约定（GET /heroes / POST /heroes 等）
- 可以自定义 HttpUrlGenerator 改 URL 规则

适用场景：
- 标准 REST API + 标准 CRUD
- 大量 entity 类型（10+），手写工作量大
- 团队希望统一 CRUD 模式

不适用：
- 业务逻辑复杂（每个 action 都有特殊处理）
- 不是 REST 风格（GraphQL / RPC）
- 已有大量自定义 NgRx 代码

vs RTK Query：
- RTK Query 是 RTK 内置数据层（更现代）
- ngrx-data 是 NgRx 的对应物（但定位略不同）
- RTK Query 更强大（缓存 / 失效 / polling）
- ngrx-data 更轻量（只做 CRUD）

社区项目：
- @angular-architects/ngrx-toolkit（提供 withDataService 等扩展）
- 是 SignalStore 版本的 ngrx-data

实际使用建议：
- 中小项目：先用 SignalStore + 手写 service
- 大型项目 + 标准 REST：考虑 ngrx-data
- 复杂业务：手写 NgRx 仍然最灵活

ngrx-data 的「黑盒」感重 ——
不适合需要精细控制 action 流程的场景。
团队需要先理解 NgRx 基础，再决定是否引入 ngrx-data。
-->

---
transition: fade-out
---

# NgModule 到 Standalone 迁移

老项目升级到 NgRx 19 + Angular 19

<v-click>

**步骤 1：升级版本**

```bash
ng update @angular/core @angular/cli
ng update @ngrx/store @ngrx/effects @ngrx/store-devtools
# 自动跑 migrations，会改部分 import
```

</v-click>

<v-click>

**步骤 2：把 StoreModule.forRoot 改成 provideStore**

```ts
// 旧：app.module.ts
@NgModule({
  imports: [
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([AppEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
  ],
})

// 新：app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(reducers),
    provideEffects([AppEffects]),
    provideStoreDevtools({ maxAge: 25 }),
  ],
};
```

</v-click>

<v-click>

**步骤 3：feature module 改成 standalone routes**

```ts
// 旧：users.module.ts
@NgModule({
  imports: [
    StoreModule.forFeature('users', usersReducer),
    EffectsModule.forFeature([UserEffects]),
  ],
})

// 新：users.routes.ts
export const userRoutes: Routes = [{
  path: '',
  providers: [
    provideState('users', usersReducer),
    provideEffects([UserEffects]),
  ],
  loadComponent: () => import('./users.page'),
}];
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NgRx 19 配合 Angular 19 全面推动 standalone API ——
老项目从 NgModule 迁移成本不高，但需要分步骤。

[click] 步骤 1：ng update 自动迁移
- ng update 会跑官方 migration schematics
- 部分 import 自动改名（如 StoreModule → provideStore）
- 但 NgModule 结构不会自动改成 standalone

主要版本要求：
- NgRx 19 → Angular 19+ / TypeScript 5.6+ / RxJS 7.4+
- 升级前检查 peerDependencies
- 旧 NgRx 8.x 跨大版本升级需要中间版本

[click] 步骤 2：根 module → app.config.ts
- bootstrapModule(AppModule) → bootstrapApplication(AppComponent, appConfig)
- AppModule.imports 的 forRoot 改成 provideXxx
- 全局 services / interceptors 也迁移到 providers

provideStore 用法变化：
- forRoot(reducers, options) → provideStore(reducers, options)
- forFeature(name, reducer) → provideState(name, reducer)
- forRoot([effects]) → provideEffects([effects])

老 InjectionToken（少见但要注意）：
- StoreModule.forRoot(REDUCERS_TOKEN, { initialState: INIT_STATE })
- 迁移时确保 InjectionToken 的 provider 在 appConfig 里仍可用

[click] 步骤 3：feature module → standalone routes
- 每个 feature module 通常对应一个路由
- 把 module 内的 imports / providers 移到路由 providers
- loadChildren 用 routes 数组（不再用 () => XxxModule）

懒加载语法：
- 旧：loadChildren: () => import('./users.module').then(m => m.UsersModule)
- 新：loadChildren: () => import('./users.routes').then(m => m.userRoutes)

迁移策略：
- 不必一次全迁，可以 module + standalone 混用
- 新功能用 standalone，老 module 慢慢改
- 大型 monorepo：按 lib 渐进迁移

[click] 步骤 4：组件改 standalone
```
// 旧
@Component({...})
export class HomeComponent {}
// 在 NgModule.declarations 注册

// 新
@Component({ standalone: true, imports: [CommonModule, ...], ... })
export class HomeComponent {}
```

步骤 5：service 用 inject() 而非 constructor
```
// 旧
constructor(private store: Store, private api: Api) {}

// 新
private store = inject(Store);
private api = inject(Api);
```

迁移坑：
- Provider 顺序：providedIn vs root providers 优先级
- forRoot 选项映射：检查每个选项在 provideXxx 中的对应名
- 测试更新：TestBed.configureTestingModule 也要相应改
- 部分老 schematics（如 ng generate effect）可能产生 NgModule 风格代码，要手动改

预期收益：
- bundle 减小 5-15%（更好的 tree-shake）
- 启动速度略快
- 与 Angular 19 生态一致（DI / lifecycle / inject）

参考：Angular 官方 standalone migration guide + NgRx changelog。
-->

---
transition: fade-out
---

# 生态对比

NgRx vs RTK vs Pinia vs Akita

<v-click>

| 维度          | NgRx 19            | RTK 2 / React        | Pinia 3 / Vue        | Akita 8 (停更)     |
| ------------- | ------------------ | -------------------- | -------------------- | ------------------ |
| 框架          | **Angular 唯一**   | React / vanilla      | Vue 3 唯一           | Angular 唯一       |
| 哲学          | Redux + RxJS       | Redux + Hook         | Composition          | Reactive store     |
| 副作用        | **@ngrx/effects**  | thunk / listener     | actions 内           | service / akita-ng-effects |
| 数据层        | ngrx-data (社区)   | **RTK Query 官方**   | 无（配 TanStack）    | akita-ng-entity-service |
| Signals       | **@ngrx/signals**  | -                    | 原生 reactive        | -                  |
| DevTools      | Redux DevTools     | Redux DevTools       | Vue DevTools         | Redux DevTools     |
| 体积          | ~30 KB (核心)      | ~10 KB               | ~1.5 KB              | ~15 KB             |
| 学习曲线      | 陡（RxJS + Redux） | 中（Redux）          | 平（Composition）    | 中                 |
| 维护          | **官方活跃**       | **官方活跃**         | **官方活跃**         | 已停更（推荐 NgRx） |
| 招聘市场      | Angular 必备       | React 必备           | Vue 主流             | 已淘汰             |

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比四大「框架专属状态库」：

NgRx 19（Angular 专属）：
- 优势：Angular 生态唯一标准，社区资源最丰富
- 劣势：学习曲线陡（RxJS + Redux 双重门槛）
- 适合：中大型企业 Angular 应用

RTK 2（React 阵营对应物）：
- 优势：内置 RTK Query 数据层，bundle 比 NgRx 小
- 劣势：副作用层（thunk）远不如 RxJS Effects 强大
- 适合：React 大型项目

Pinia 3（Vue 阵营对应物）：
- 优势：Composition API 原生，体积极小（~1.5 KB）
- 劣势：没有数据层，需要配 TanStack Query
- 适合：所有 Vue 3 项目（官方推荐）

Akita 8（Angular 历史方案）：
- Datorama 团队 2018 年推出
- 比 NgRx 更轻量，更接近 reactive store
- 2023 年宣布停更，官方推荐迁移到 NgRx Signals
- 现在不应该选 Akita 做新项目

[click] 选型决策：
- Angular 项目 → NgRx 是唯一推荐
- 不愿意学 RxJS → 用 @ngrx/signals SignalStore（无 RxJS）
- 简单 state → Angular Service + Signal 就够
- 复杂应用 → 经典 NgRx Store + Effects

NgRx 的护城河：
1. Angular 生态默认（官方推广 / 企业培训 / 招聘标准）
2. RxJS 深度集成（Angular 重度 RxJS 用户的福音）
3. SignalStore 新引擎（解决样板代码痛点）
4. 完整工具链（DevTools / schematics / 测试工具）

哪些场景不应该用 NgRx？
- 极小 Angular 应用（Service + BehaviorSubject 就够）
- 一次性 prototype（用 signal + service）
- 团队没人会 RxJS 也不愿学（先用 SignalStore + 同步方法）

NgRx 学习投资：
- 学一次永不过时（10 年标准 + 持续演进）
- 大公司面试 Angular 必考
- 大型项目里 ROI 极高

vs MobX（多框架）：
- MobX 也能用在 Angular（mobx-angular 包）
- 但社区资源远不如 NgRx
- Angular 项目里 NgRx 是事实标准
-->

---
transition: fade-out
---

# 大型项目实战模式

按 feature 组织 + index.ts re-export

<v-click>

```
src/
  app/
    state/                 # 全局 / 跨 feature 状态
      index.ts             # 集中导出
      app.reducers.ts      # 根 reducer 组合
    features/
      users/
        users.actions.ts   # createActionGroup
        users.feature.ts   # createFeature
        users.effects.ts   # functional effects
        users.service.ts   # API 包装
        users.facade.ts    # 可选：facade 模式
        users.routes.ts    # 路由 + provideState
        users.page.ts      # 组件
        index.ts           # 统一 re-export
      products/
        ...
    shared/
      ui/, utils/, ...
```

```ts
// users/index.ts
export * from "./users.actions";
export * from "./users.feature";
export * from "./users.service";

// 在其他 feature 里跨用
import { UserActions, userFeature } from "@/features/users";
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 大型 NgRx 项目的标准目录结构：

按 feature 切分（feature-based）：
- 每个业务模块是一个 feature 目录
- 同 feature 的 actions / reducer / effects / service 在一起
- index.ts 统一 re-export，对外暴露 API

vs 按类型切分（type-based，老风格）：
- /actions、/reducers、/effects、/selectors 四个目录
- 同 feature 文件分散，导航不便
- 现在不推荐

feature 内文件命名：
- users.actions.ts：createActionGroup
- users.feature.ts：createFeature 包含 reducer + selectors
- users.effects.ts：functional effects
- users.service.ts：HttpClient 包装的 API 层
- users.facade.ts：可选，门面模式（下一页讲）
- users.routes.ts：路由 + 懒加载 providers
- users.page.ts、users.list.ts：组件

文件命名风格：
- kebab-case：user-list.component.ts
- 后缀清晰：.actions / .feature / .effects / .service
- 与 Angular CLI 默认风格一致

[click] index.ts 的作用：
- 单一入口（barrel pattern）
- 跨 feature import 时只写一行：from '@/features/users'
- 内部重构不影响外部使用

注意 barrel pattern 的坑：
- 循环依赖：feature A 引 feature B 的 index.ts，B 又引 A
- 解决：跨 feature 共享放 shared 目录或 root state
- 严禁两个 feature 直接互引

monorepo / Nx 项目：
- 每个 feature 是独立 Nx lib
- buildable / publishable lib 配置
- nx graph 可视化依赖关系

state vs feature：
- /state：全局 / 跨 feature 状态（user / auth / router）
- /features：业务 feature（每个独立懒加载）

shared 目录：
- /shared/ui：UI 组件
- /shared/utils：工具函数
- /shared/state：跨 feature 共用 actions / selectors

测试目录：
- 单元测试与源码同目录（users.feature.spec.ts）
- e2e 在 /e2e 单独目录

文档：
- 每个 feature 一份 README（可选）
- 大型项目用 storybook 文档化组件
- 状态机文档用 mermaid / draw.io 画图

团队规范要点：
- feature 间不能直接 import 内部文件，只能通过 index.ts
- actions 必须 createActionGroup（团队一致）
- effects 必须 functional + inject（不用 class）
- selectors 优先用 feature.selectXxx（自动生成）
- 复杂派生才单独写 createSelector
-->

---
transition: fade-out
---

# Facade 门面模式

封装 NgRx 细节，组件只依赖 facade

<v-click>

```ts
// users/users.facade.ts
import { Injectable, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { userFeature } from "./users.feature";
import { UserActions } from "./users.actions";

@Injectable({ providedIn: "root" })
export class UsersFacade {
  private store = inject(Store);

  // 暴露 selectors（Observable 或 Signal）
  users$ = this.store.select(userFeature.selectAllUsers);
  loading$ = this.store.select(userFeature.selectLoading);
  error$ = this.store.select(userFeature.selectError);

  // 暴露 actions（方法）
  loadUsers() {
    this.store.dispatch(UserActions.loadUsers());
  }
  addUser(user: User) {
    this.store.dispatch(UserActions.addUser({ user }));
  }
  deleteUser(id: string) {
    this.store.dispatch(UserActions.deleteUser({ id }));
  }
}

// 组件里不再直接 inject Store
@Component({...})
export class UsersPage {
  private facade = inject(UsersFacade);
  users$ = this.facade.users$;
  loading$ = this.facade.loading$;

  ngOnInit() { this.facade.loadUsers() }
  add(u: User) { this.facade.addUser(u) }
}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Facade（门面）模式是大型 NgRx 项目的「防腐层」——
组件不直接依赖 NgRx，只通过 Facade 操作状态。

好处：
1. 解耦：组件不知道用的是 NgRx / Service / SignalStore
2. 易测试：mock Facade 比 mock Store 简单
3. 可重用：Facade 可以被多组件共用
4. 易迁移：将来从 NgRx 迁到 SignalStore 只改 Facade 内部

Facade 职责：
- 暴露 Observable / Signal（selector 包装）
- 暴露方法（dispatch 包装）
- 不包含业务逻辑（业务逻辑在 effects / reducer）

vs 直接用 Store：
- 直接用：组件 import Store + selectors + actions
- Facade：组件只 import 一个 Facade service

vs SignalStore：
- SignalStore 自带 method 化 API
- Facade 模式应用到 SignalStore 时变成「双层抽象」（可能 over-engineering）
- 经典 NgRx + Facade 是最常见的搭配

什么时候用 Facade？
- 大型团队（多人协作，需要严格防腐）
- 长生命周期项目（5+ 年，可能换状态库）
- 复杂业务（业务规则可能跨多个 action）

什么时候不用？
- 小项目（增加抽象不值）
- 简单 CRUD（直接 store.select / dispatch 更直接）
- 团队对 NgRx 熟悉（无防腐需求）

Facade 反模式：
- 不要把业务逻辑放 Facade（应该在 effects）
- 不要让 Facade 调 HttpClient（应该在 service / effect）
- 不要把多个 feature 揉到一个 Facade

测试 Facade：
```
class MockUsersFacade {
  users$ = of([]);
  loading$ = of(false);
  loadUsers = jasmine.createSpy();
}

TestBed.configureTestingModule({
  providers: [{ provide: UsersFacade, useClass: MockUsersFacade }]
});
```

vs 直接 mock Store：
- mock Store 要 spy overrideSelector + dispatch
- mock Facade 更直接

实战经验：
- 中型团队普遍用 Facade
- Nx 项目里 Facade 是默认推荐
- 但要警惕「Facade 越界」—— 业务逻辑爬到 Facade 里
- 严格规定：Facade 只做转发，不做业务

替代方案：
- 直接用 SignalStore（自带 method 化，不需要 Facade）
- 用 store-feature pattern（NgRx 19 createFeature 已经简化）
- 用社区 NgRx Reactive Store 等更高级封装
-->

---
transition: fade-out
---

# SSR 与 Angular Universal

服务端渲染时的 NgRx 注意事项

<v-click>

```ts
// main.server.ts
import { bootstrapApplication } from "@angular/platform-browser";
import { provideServerRendering } from "@angular/platform-server";
import { provideStore } from "@ngrx/store";

const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    providers: [
      provideServerRendering(),
      provideStore(reducers, {
        // 每次请求创建新 store（默认就是）
        runtimeChecks: { strictStateImmutability: true },
      }),
      // ...
    ],
  });

export default bootstrap;
```

</v-click>

<v-click>

**Transfer State（避免客户端重复请求）**

```ts
// 在 effect 里检查是否 SSR 已经加载过
export const loadUser = createEffect(
  (
    actions$ = inject(Actions),
    api = inject(UserService),
    transfer = inject(TransferState),
  ) =>
    actions$.pipe(
      ofType(UserActions.loadUser),
      mergeMap(() => {
        const key = makeStateKey<User>("user-data");
        if (transfer.hasKey(key)) {
          const data = transfer.get(key, null)!;
          transfer.remove(key);
          return of(UserActions.loadUserSuccess({ user: data }));
        }
        return api.getUser().pipe(
          tap((user) => isPlatformServer(platformId) && transfer.set(key, user)),
          map((user) => UserActions.loadUserSuccess({ user })),
        );
      }),
    ),
  { functional: true },
);
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Angular Universal（SSR）+ NgRx 的注意事项：

1. 每个请求独立 store：
- Angular Universal 默认每个 HTTP 请求都 bootstrap 一次
- 所以 store 自然每个请求独立（不像 Next.js Pages Router 需要手动隔离）
- bootstrapApplication 每次都新创建

2. provideStore options：
- runtimeChecks: 启用严格检查（dev）
- metaReducers: 慎用 logger（污染 SSR 输出）
- initialState: 不要从 module 顶层依赖客户端 API

[click] Transfer State（关键性能优化）：
- SSR 时已经请求过 API
- 客户端 hydration 时不要重复请求
- 用 TransferState 把 SSR 数据传给客户端

工作流程：
1. SSR：effect 检查 TransferState 没数据 → API 请求 → 数据放进 TransferState
2. HTML 生成时 TransferState 被序列化到 <script> 标签
3. 客户端：app bootstrap 时 TransferState 已经有数据
4. effect 检查 TransferState 有数据 → 直接 dispatch success（跳过 API）

makeStateKey：
- 创建带类型的 key
- 区分不同数据（'user-data' / 'product-list' / ...）

transfer.get / set / has / remove：
- 标准 TransferState API
- 客户端读取后用 remove 清理

isPlatformServer / isPlatformBrowser：
- 区分代码是在 server 还是 browser 运行
- 只在 server 端 set TransferState

SSR 常见坑：
- localStorage / sessionStorage / window 在 server 不可用
  → meta-reducer 持久化要加 isPlatformBrowser 守卫
- HTTPInterceptor 转换 URL 要相对路径 → 绝对路径
- 时区 / 时间相关 selector 在 server / client 可能不一致

NgRx + Angular Universal 性能：
- TransferState 减少客户端冷启动请求
- selector memoization 在 SSR 和 hydration 间保持
- store-devtools 在 SSR 模式自动关闭

调试 SSR + NgRx：
- 在 server 端 console.log 看 effect 是否触发
- network 标签确认客户端没重复请求
- View Source 看 TransferState 序列化的 JSON

注意：
- @ngrx/signals SignalStore 在 SSR 模式下还需要更多手动配合（社区 evolving）
- 经典 Store + Effects 在 SSR 模式更成熟

Angular 19 SSR 改进：
- 支持 zoneless rendering
- 部分 hydration
- @defer 块延迟渲染
- 这些都与 NgRx 兼容

如果 SSR 复杂度高，可以考虑：
- Analog.js（Angular meta-framework，自带 NgRx 集成）
- Nx + Angular Universal preset
-->

---
transition: fade-out
---

# 性能优化清单

OnPush + selector + entity + lazy

<v-click>

**1. OnPush 变更检测**

```ts
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`,
})
```

</v-click>

<v-click>

**2. selector 精细化**

避免组件订阅整个 state；用 createSelector 派生最小所需字段。

</v-click>

<v-click>

**3. Entity normalized state**

列表项 > 100 时用 @ngrx/entity 标准化，避免 O(n) 查找。

</v-click>

<v-click>

**4. async pipe + trackBy**

```ts
template: `
  <user-card *ngFor="let u of users$ | async; trackBy: trackById" [user]="u" />
`
trackById = (i: number, u: User) => u.id;
```

</v-click>

<v-click>

**5. lazy load + standalone**

按路由懒加载 feature reducer，减少初始 bundle。

</v-click>

<v-click>

**6. Bundle 验证**

```bash
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NgRx 大型应用性能优化清单：

[click] 1. OnPush 变更检测：
- Angular 默认 Default 检测策略：每次事件都跑 ChangeDetection
- OnPush：只在 @Input 变化或 Observable emit 时才检测
- NgRx + async pipe + OnPush 是黄金组合
- 大型应用性能提升明显（50%+ 渲染次数减少）

实现：每个组件 @Component({ changeDetection: ChangeDetectionStrategy.OnPush })

注意：
- OnPush 下组件状态变化要走 Observable / Signal
- 直接赋值 this.x = y 不会触发检测
- 用 ChangeDetectorRef.markForCheck() 强制（少用）

[click] 2. selector 精细化：
- 不要订阅整个 feature state
- 用 createSelector 派生最小字段
- 多个组件订阅不同 selector，互不影响

反例：
```
// 整个 user state 订阅
user$ = this.store.select(s => s.user)
```
当 user.lastVisit 变化时，所有依赖 user 的组件都重渲。

正例：
```
userName$ = this.store.select(userFeature.selectUserName)
userEmail$ = this.store.select(userFeature.selectUserEmail)
```
各自独立 memoize。

[click] 3. Entity normalized：
- 列表数据量大时（> 100 entity）必须 normalized
- 数组 .find(u => u.id === id) 是 O(n)
- normalized entities[id] 是 O(1)
- 性能差距在 1000+ entity 时非常明显

[click] 4. async pipe + trackBy：
- async pipe 自动 subscribe / unsubscribe
- trackBy 函数让 *ngFor 复用 DOM 节点
- 同一 id 的项更新只 patch 内容，不重建 DOM

Angular 18+ 新语法（推荐）：
```
@for (u of users(); track u.id) {
  <user-card [user]="u" />
}
```
内置 track，更简洁。

[click] 5. lazy load：
- 懒加载 feature reducer / effects
- 初始 bundle 缩小
- 路由级 standalone 是默认推荐

[click] 6. Bundle 验证：
- webpack-bundle-analyzer / source-map-explorer
- 检查 NgRx 是否一份（不被多次打包）
- 检查 RxJS operators 按需导入

其他优化：
- 大量 dispatch 时用 store.dispatchSequence（批处理）
- DevTools 生产关闭（logOnly: true）
- runtimeChecks 生产关闭（strictStateImmutability 等）

Signal 时代的优化：
- @ngrx/signals SignalStore 内部用 Angular Signals
- 细粒度更新（只重渲依赖 changed signal 的部分）
- 无需 OnPush（Signals 已经是 push-based）
- 推荐新代码用 SignalStore + Signal-based 组件

监控指标：
- Lighthouse 性能分
- Web Vitals（LCP / FID / CLS）
- Angular DevTools profiler
- 自定义 timing API（performance.mark）
-->

---
transition: fade-out
---

# 生产部署清单

上线前必做的检查项

<v-click>

**1. DevTools 安全：logOnly 模式**

```ts
provideStoreDevtools({
  maxAge: 25,
  logOnly: !isDevMode(),    // 生产强制 true
});
```

</v-click>

<v-click>

**2. runtimeChecks 仅 dev**

```ts
provideStore(reducers, {
  runtimeChecks: {
    strictStateImmutability: isDevMode(),
    strictActionImmutability: isDevMode(),
    strictStateSerializability: isDevMode(),
    strictActionSerializability: isDevMode(),
    strictActionWithinNgZone: isDevMode(),
  },
});
```

</v-click>

<v-click>

**3. 敏感数据不入 store**

- token / 密码 / 信用卡号 → httpOnly cookie 或加密存储
- store 内容会进 DevTools / TransferState

</v-click>

<v-click>

**4. 持久化版本管理**

```ts
const SCHEMA_VERSION = 2;
// 升级前清理 v1 数据，或写 migration 转换
```

</v-click>

<v-click>

**5. 监控集成**

```ts
import * as Sentry from "@sentry/angular-ivy";
import { createReduxEnhancer } from "@sentry/redux";

// 把关键 action 自动上报到 Sentry
provideStore(reducers, {
  metaReducers: [Sentry.createReduxEnhancer()],
});
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 生产部署前的检查清单：

[click] 1. DevTools 安全
- logOnly: !isDevMode() 是必须
- 攻击者打开 Redux DevTools 看不到 dispatch / time-travel 入口
- 仍能看 state 结构 → 敏感数据不应该入 store

更严格：
```
provideStoreDevtools({
  logOnly: true,
  features: {
    pause: false, lock: false, persist: false,
    export: false, import: false,
    jump: false, skip: false,
    reorder: false, dispatch: false, test: false,
  },
})
```

[click] 2. runtimeChecks 性能
- 每次 dispatch / state 变更都跑严格性检查
- 深拷贝对比 immutability，每个 dispatch 拖累 10x
- 必须仅 dev 开启

isDevMode() 内置区分：
- 开发：所有检查 true
- 生产：所有检查 false

[click] 3. 敏感数据
- NgRx state 默认序列化（DevTools / TransferState）
- token / 密码 / 信用卡号 不应该入 store
- 解决方案：
  - JWT → httpOnly cookie（不入 JS 内存）
  - sensitive PII → 加密存储 + 仅服务端解密
  - state 里只放公开字段

如果必须入 store：
- 不持久化（不进 localStorage）
- 不进 TransferState
- 用 specific reducer 自己排除

[click] 4. 持久化版本管理
- 你今天发 v1 schema
- 明天升级 schema
- 老用户 localStorage 是 v1 数据 → 反序列化崩

解决：
- key 加版本前缀：`v2:app-state`
- migration 函数：v1 → v2 转换
- 或干脆 v1 清理（用户体验差）

社区包 ngrx-store-localstorage 提供：
- 自动 versioning
- migration hooks
- 部分 slice 持久化

[click] 5. 监控集成
- Sentry / Datadog 提供 Redux integration
- 每个 dispatch 自动添加 breadcrumb
- 错误发生时附带最近 N 个 action
- 复现 bug 极其方便

Sentry integration 示例：
```
import { createReduxEnhancer } from '@sentry/redux';

const sentryReduxEnhancer = createReduxEnhancer({
  actionTransformer: (action) => {
    // 过滤敏感 action（如 setPassword）
    if (action.type.includes('password')) return null;
    return action;
  },
  stateTransformer: (state) => {
    // 脱敏 state
    return { ...state, user: { ...state.user, ssn: 'REDACTED' } };
  },
});
```

补充检查：
- ESLint 规则：no-restricted-imports 限制直接 import @ngrx/store/internal
- CI 检查：测试覆盖率 / type-check / lint
- 性能预算：bundle size limit（angular.json budgets）
- 错误边界：组件 ErrorHandler 全局捕获
- 离线友好：Service Worker 缓存策略

部署后监控：
- Real User Monitoring（RUM）
- Action dispatch 频率（异常高 → 性能问题）
- Effects 错误率（异常高 → 后端服务异常）
- TTI / FCP / LCP 指标
-->

---
transition: fade-out
---

# 常见陷阱与排错

NgRx 老手都踩过的坑

<v-click>

**1. Reducer 直接 mutate state**

```ts
// ❌ 错：runtimeChecks 会报错
on(addItem, (s, { item }) => {
  s.items.push(item);
  return s;
})

// ✅ 对：返回新对象
on(addItem, (s, { item }) => ({ ...s, items: [...s.items, item] }))
```

</v-click>

<v-click>

**2. Effect 外层 catchError**

```ts
// ❌ 错：第一次失败后 effect stream 死掉
loadEffect$ = createEffect(() =>
  this.actions$.pipe(
    ofType(load),
    switchMap(() => this.api.get()),
    catchError((err) => of(loadFailure({ err }))),  // 在外层
  ),
);

// ✅ 对：catchError 在 inner observable
loadEffect$ = createEffect(() =>
  this.actions$.pipe(
    ofType(load),
    switchMap(() =>
      this.api.get().pipe(catchError((err) => of(loadFailure({ err })))),
    ),
  ),
);
```

</v-click>

<v-click>

**3. Selector 返回新对象 / 数组**

```ts
// ❌ 错：每次返回新引用，下游组件无效更新
export const selectUsers = createSelector(selectAll, (users) => [...users]);

// ✅ 对：让 createSelector 控制引用
export const selectUsers = createSelector(selectAll, (users) => users);
```

</v-click>

<v-click>

**4. async pipe 多次订阅**

```ts
// ❌ 错：每次 | async 都新订阅
template: `
  <div *ngIf="user$ | async as user">{{ user.name }}</div>
  <div *ngIf="user$ | async as user">{{ user.email }}</div>
`
// ✅ 对：用 *ngIf 解构一次
template: `
  <div *ngIf="user$ | async as user">
    {{ user.name }} - {{ user.email }}
  </div>
`
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这些陷阱都是 NgRx 开发期高频踩坑：

[click] 1. Reducer mutate state
- runtimeChecks.strictStateImmutability 会在 dev 时报 ImmutabilityError
- 必须返回新对象（...state, ...changes）
- 嵌套对象修改要 deep clone 路径
- 简化：用 Immer 风格（ngrx-immer）或直接 entity adapter

什么算 mutate？
- arr.push / pop / shift / unshift / splice / sort（原数组改）
- obj.x = y（对象直改）

什么不算 mutate？
- arr.map / filter / slice / concat（返回新数组）
- {...obj, x: y}（spread 新对象）

[click] 2. Effect catchError 外层
- 这是 NgRx Effects 最经典的 bug
- 外层 catchError 触发时，整个 effect stream 终结
- 之后 dispatch load action 不会触发这个 effect

为什么？
- effects 内部 NgRx 永久 subscribe
- catchError 完成后 stream complete
- subscribe 也 complete
- 后续 action 没人监听

正确：每个 inner observable（switchMap 内部）独立 catchError
错误的 effect 在测试时也能跑通，但生产偶发失败后整个 feature 死掉。

调试技巧：
- effects 加 tap 看每个 action 是否流到这里
- console.log 'effect triggered' 看是否被监听
- 配合 Redux DevTools 看 action 列表

[click] 3. Selector 返回新引用
- createSelector 自动 memoize：相同输入返回相同引用
- 但如果 projector 内部 [...arr] 或 {...obj}，每次都新引用
- 下游组件 OnPush 检测到新引用，无效重渲

记住：projector 应该返回「内容变才新引用」的东西
- 直接返回 state.users（数组本身）✓
- [...state.users] ✗（每次新数组）
- state.users.map(...) ✓（map 自身有 memoize 时）

[click] 4. async pipe 多次订阅
- 每个 | async 是独立订阅
- 同一 Observable 多次 |async → 多次 emit
- 性能浪费 + 可能 race condition

最佳实践：
- 顶层 *ngIf 解构一次
- 或用 ng-template + ngTemplateOutlet
- Angular 17+ @if 块也支持 as 绑定

补充陷阱：

[click] 5. Store.select 字符串 key
```
this.store.select('user')  // 字符串 key，无类型
this.store.select(selectUser)  // 推荐：用 selector
```

[click] 6. dispatch 在 effect map 内
```
// ❌ 错：返回 void 不是 action
ofType(load),
map(() => this.store.dispatch(loadSuccess()))  // 应该 return action
// ✅ 对：return action
ofType(load),
map(() => loadSuccess())
```

[click] 7. selector projector 副作用
```
// ❌ 错：selector 有副作用
createSelector(selectXxx, (x) => {
  console.log('triggered');  // 副作用
  return x.value;
});
```
selector 应该是纯函数。

[click] 8. action type 重复
```
// 两个文件都 createAction('[Counter] Increment') → 实际是同一 action
// 反例：跨 feature 用了同名 action，被各自 reducer 处理（有意 vs bug）
```
建议：每个 action type 全局唯一，[Source] Event 格式严格遵循。
-->

---
transition: fade-out
---

# 学习路径

从入门到精通的资源地图

<v-click>

**官方资源**

- [NgRx 官方文档](https://ngrx.io/) — 必读，模块矩阵全覆盖
- [NgRx GitHub](https://github.com/ngrx/platform) — 8K+ star，活跃维护
- [NgRx Walkthrough](https://ngrx.io/guide/store/walkthrough) — 经典 Counter 项目实战
- [NgRx Example App](https://github.com/ngrx/platform/tree/main/projects/example-app) — 官方完整示例

</v-click>

<v-click>

**Signals 时代**

- [@ngrx/signals 文档](https://ngrx.io/guide/signals) — SignalStore 完整指南
- [Angular Signals 指南](https://angular.dev/guide/signals) — 配合官方 Signals 教程
- [ngrx-toolkit](https://github.com/angular-architects/ngrx-toolkit) — withDataService / withStorageSync 等扩展

</v-click>

<v-click>

**进阶 / 实战**

- [NgRx Style Guide](https://ngrx.io/guide/store/style-guide) — 团队规范必读
- [Mike Ryan 演讲合集](https://www.youtube.com/@MikeRyanDev) — NgRx 核心贡献者
- [Tomas Trajan 博客](https://medium.com/@tomastrajan) — NgRx 模式 / 最佳实践
- [Brandon Roberts 教程](https://www.youtube.com/@brandonroberts) — RxJS + NgRx 配套

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NgRx 学习是 Angular 工程师的必修课，资源非常丰富。

官方资源优先级：
1. 官网首页 → 5 分钟扫一遍模块矩阵
2. Walkthrough → 跟着写 Counter 项目
3. Architecture Guide → 理解 action / reducer / effect / selector
4. Example App → 完整 Books App，包含 entity / router-store

NgRx 文档结构清晰：
- Store / Effects / Entity / Router-Store / Component-Store / Signals 各自一章
- 每章都有 Quick Start + API Reference + Recipes
- 配合代码示例

GitHub：
- 8K+ star
- 由 NgRx Core Team 维护（Brandon Roberts / Mike Ryan / Tim Deschryver / Marko Stanimirović 等）
- 高质量 issue 和 PR 讨论
- 看 changelog 了解每个版本变化

[click] Signals 时代：
- @ngrx/signals 是 2024 年 GA 的新引擎
- 官方文档持续完善（部分高级用法仍 evolving）
- Angular Signals 是基础，先掌握 Signals 再学 SignalStore
- ngrx-toolkit 是社区扩展（withDataService / withStorageSync 等实用扩展）

学习节奏建议：
- 第 1 周：Walkthrough + 三件套（action / reducer / selector）
- 第 2 周：Effects + RxJS 基础（确保会 mergeMap / switchMap / catchError）
- 第 3 周：Entity + Router-Store
- 第 4 周：Signals + SignalStore
- 第 2 月：实战项目 + 测试 + 性能优化
- 第 3 月：生产部署 + 监控 + 复杂业务模式

[click] 进阶学习：

NgRx Style Guide 必读：
- action 命名规范（[Source] Event）
- 文件命名 / 目录结构
- 副作用边界（什么放 effect 什么放 service）
- 团队规范基础

Mike Ryan：
- NgRx 核心 maintainer
- YouTube 频道有大量演讲录像
- Angular Connect / ng-conf 多届 keynote
- 讲解 NgRx 设计哲学最深入

Tomas Trajan：
- NgRx 资深布道者
- Medium 博客系列教程
- 写过多篇「Idiomatic NgRx」深度文章
- 适合理解模式 / 反模式

Brandon Roberts：
- NgRx + Analog.js 主要作者
- YouTube 频道有 RxJS + NgRx 配套教程
- 实战项目演示

实战项目参考：
- ngrx-realworld-conduit：RealWorld 项目 Angular 版
- ngrx-example-app（官方）：Books App，涵盖大部分概念
- 公司内部「ngrx-template」：通常每个团队都有一个

进阶话题：
- @ngrx/eslint-plugin：规则检测（避免反模式）
- redux-saga 风格副作用（用 RxJS effects 实现）
- 复杂状态机（XState + NgRx 集成）
- 微前端状态共享（Module Federation + NgRx）

社区参与：
- GitHub Discussions
- Discord NgRx 频道
- Twitter #ngrx tag
- Reddit r/angular

招聘市场：
- Angular 高级开发岗 NgRx 是标配
- 阿里 / 腾讯 / 字节 / 华为部分 Angular 团队用 NgRx
- 国外 IBM / Adobe / Capital One / Cisco 大量使用
- 简历加分项：NgRx + RxJS + 大型项目经验

掌握 NgRx 是 Angular 工程师走向高级的关键能力。
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看

NgRx — Reactive State for Angular

<div class="mt-8 text-lg">

**核心心智**

- Redux 三大原则 —— 单一数据源 / state 只读 / 纯函数 reducer
- 副作用走 Effects —— RxJS Observable + ofType + 操作符精选
- Selector 自动 memoize —— createFeature + createSelector 全链路类型
- Entity Adapter 标准化 —— normalized state + O(1) 查找
- 新项目优先 SignalStore —— withState / withMethods，零样板

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://ngrx.io/" target="_blank" class="slidev-icon-btn">
    NgRx 文档
  </a>
  <a href="https://github.com/ngrx/platform" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
</div>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：NgRx = Angular 上的 Redux + RxJS + Angular Signals。

核心心智五条：
1. Redux 三大原则是宪法 —— 单一数据源 / state 只读 / 纯函数 reducer
2. Effects 是副作用层 —— 用 RxJS 编排，比 thunk 强大十倍
3. Selectors 自动 memoize —— createFeature 一站式 + createSelector 组合派生
4. Entity Adapter 是列表 CRUD 标准 —— normalized state + O(1) 查找
5. SignalStore 是新引擎 —— 中小项目零样板首选，大型项目仍用经典 Store + Effects

适合什么团队？
- 中大型企业 Angular 应用（最优选）
- 多人协作 + 长生命周期项目
- RxJS 重度用户
- 需要时间旅行调试

不适合什么团队？
- 小型 Angular 应用（用 Service + Signal）
- 团队没人会 RxJS（学习曲线陡）
- 偏好 mutable + 自动追踪（应该选 MobX）

进阶建议：
- 第一步：跟官方 Walkthrough 写 Counter
- 第二步：实战 Books App（涵盖 entity / router-store）
- 第三步：尝试 @ngrx/signals SignalStore
- 第四步：大型项目 + Facade 模式 + 监控集成

NgRx 与 Angular 是绑定的 ——
学好 NgRx 就是学好 Angular 状态管理范式，
对中高级 Angular 工程师来说是必备技能。

Redux 模式 + RxJS 副作用 + Angular Signals 三位一体，
是 NgRx 在 2026 年依然是 Angular 状态管理事实标准的原因。

感谢观看！🅰️
-->
