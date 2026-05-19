---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Zustand
info: |
  Presentation Zustand for developers.

  Learn more at [https://zustand.docs.pmnd.rs/](https://zustand.docs.pmnd.rs/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-9xl">🐻</span>
</div>

<br/>

## Zustand — Small, Fast, Scalable State

hooks-only flux，~1KB 极致轻量，Poimandres 团队出品（最新 v5.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Zustand —— React 生态当前最受欢迎的轻量状态管理库。

「Zustand」是德语「状态」的意思，由 Poimandres（pmndrs）团队主导。
这个团队的成员还做出了 Jotai（原子化）、Valtio（mutable proxy）、React Three Fiber（R3F），
是 React 生态的「状态管理三件套」+「3D 渲染天花板」。

最新主线 v5.x，包体积约 1 KB（gzipped），是同类里最小的。
核心心智：没有 Provider，函数即 store，hook 即订阅。

下面会按照「定位 → 核心理念 → 第一个 store → 选择器 → middleware → 进阶 → 踩坑」的顺序讲透。
-->

---
transition: fade-out
---

# 什么是 Zustand？

为 React 应用提供共享状态的极简 store 库

<v-click>

- **极致轻量**：~1 KB gzipped，是同类里最小的
- **hooks-only**：useStore 即订阅，无 Provider 包裹
- **flux 风格**：单向数据流，set/get 修改状态
- **TypeScript 优先**：curried create 推断完整状态类型
- **middleware 生态**：persist / devtools / immer 等
- **React 18+ 友好**：内置 useSyncExternalStore，并发安全

</v-click>

<div v-click text-xs mt-4>

_Read more about_ [_Zustand Introduction_](https://zustand.docs.pmnd.rs/getting-started/introduction)

</div>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Zustand 的核心定位是「最小化的 React 状态管理库」。

设计目标非常明确：
- 把全局状态做到「一个 hook 就能用」
- 包体积极小（~1 KB），按需打包
- 不依赖 React Context，避免 Provider 嵌套金字塔
- 函数即 store，set/get 直接修改，没有 action type / reducer 这层抽象
- middleware 系统按需引入（persist 持久化、devtools Redux DevTools 集成）

最关键的差异：「没有 Provider」—— 这是 Zustand 与 Redux / React Context 最本质的不同。
你可以在任何文件 import useStore 并立即使用，不需要在根组件包一层。

下面会展示这种「极简哲学」如何贯穿全部 API。
-->

---
transition: fade-out
---

# Zustand 的定位与生态

为什么 React 项目纷纷从 Redux 切到 Zustand？

<v-click>

| 维度       | Zustand 5            | Redux Toolkit  | Jotai          | Valtio          | Pinia 3        |
| ---------- | -------------------- | -------------- | -------------- | --------------- | -------------- |
| 框架绑定   | React (vanilla 可用) | React          | React          | React           | **Vue 3 官方** |
| API 风格   | **hook + flux**      | Slice + Hook   | Atom 原子化    | Proxy mutable   | Composition    |
| Provider   | **无需**             | 需要           | 需要           | 需要            | 需要           |
| TS 支持    | **curried 推导**     | 优             | 优             | 优              | **原生推导**   |
| 包体积     | **~1 KB**            | ~10 KB         | ~3 KB          | ~3 KB           | ~1.5 KB        |
| SSR        | store-per-request    | 中等           | 中等           | 中等            | 官方支持       |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Zustand Comparison_](https://zustand.docs.pmnd.rs/getting-started/comparison)

</div>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比五大状态库的护城河 ——

Zustand 的护城河是「极简 + 无 Provider + 轻量」：
- 无 Provider 意味着没有嵌套金字塔，store 可以在任何模块顶层创建
- 1 KB 体积是 Redux Toolkit 的 1/10
- curried create 让 TypeScript 推断丝滑（`create<State>()(...)`）
- 与 React 18 useSyncExternalStore 深度协同，并发安全

对比 Redux Toolkit：Zustand 没有 reducer / action type 这层心智负担，写 store 像写一个普通 hook。
对比 Jotai：Jotai 是「atom 原子化」，颗粒度最小但需要 Provider；Zustand 是「单 store」哲学。
对比 Valtio：Valtio 用 proxy 实现 mutable 写法，Zustand 走 immutable set 路线。
对比 Pinia：Pinia 是 Vue 生态的官方对应物，思路类似（无 mutations、TS 友好）。

选型逻辑：React 项目想要「轻量 + 简单」首选 Zustand，需要「严格架构 + 大型团队」选 Redux Toolkit，需要「细粒度订阅」选 Jotai。
-->

---
transition: fade-out
---

# Poimandres 团队与生态

一个团队，半个 React 状态管理生态

<v-click>

| 库          | 定位                 | 哲学              |
| ----------- | -------------------- | ----------------- |
| **Zustand** | 全局 store           | hooks-only flux   |
| **Jotai**   | 原子状态             | atom 派生 + 订阅  |
| **Valtio**  | mutable proxy        | 直接 state.x = y  |
| **R3F**     | React Three Fiber 3D | 声明式 Three.js   |
| **Leva**    | GUI 调试控件         | 类 dat.gui        |

</v-click>

<v-click>

**三种状态哲学**：Zustand「单 store」/ Jotai「多 atom」/ Valtio「proxy mutable」—— 同团队，按场景选。

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Poimandres 团队是 React 生态里非常有意思的存在 ——
他们的产品都「一专多能」，每个库都极小但都能扛大型项目。

Daishi Kato（加藤大史）是团队核心成员，同时维护 Zustand / Jotai / Valtio 三个状态库。
他在 NEC 工作多年，著有《Micro State Management with React Hooks》。

[click] 三种状态哲学共存，是 Poimandres 的有趣之处：
- Zustand「单店」适合应用级别的全局状态（用户、主题、购物车）
- Jotai「原子」适合大量独立小状态（每个 input、每个 toggle）
- Valtio「proxy」适合需要 mutable 写法的场景（游戏、复杂表单）

实际项目里这三者甚至可以混用 —— Zustand 管全局，Jotai 管局部，Valtio 管热点。
R3F 是 3D 渲染天花板，Three.js 的声明式 React 封装，主流游戏 / 数据可视化都在用。
-->

---
transition: fade-out
---

# Zustand 的核心理念

五个设计哲学贯穿全部 API

<v-click>

**1. 函数即 store**

`create(stateCreator)` 接收一个函数，返回一个可订阅的 hook。store 本质上就是一个函数闭包，没有 class、没有 reducer。

</v-click>

<v-click>

**2. 选择器订阅**

`useStore(selector)` 必传 selector 函数，只订阅 selector 返回值的变化。零渲染浪费。

</v-click>

<v-click>

**3. 无 Provider**

store 在模块顶层创建，import 即用。不需要 React Context 包裹，不会有嵌套 Provider 金字塔。

</v-click>

<v-click>

**4. 不可变更新**

`set(partial)` 走 immutable 路线，与 React 心智一致。需要 mutable 写法时配 immer middleware。

</v-click>

<v-click>

**5. 并发安全**

底层用 `useSyncExternalStore`，React 18 并发模式下不会撕裂（tearing）。

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 函数即 store 的含义 ——
create 第二参传一个 (set, get) => ({ ... }) 函数，
里面的字段就是 state，方法就是 action。零模板代码。

[click] 选择器订阅是性能关键 ——
React 组件只会在 selector 返回值变化时重渲，
比 Context 那种「整树重渲」精确得多。
useStore(state => state.bears) 只订阅 bears。

[click] 无 Provider 的妙处：
- 在工具函数、测试代码里都能 import store 直接用
- 不需要在 App 根组件包一层 Provider
- 多个 store 可以独立存在，互相 import 调用

唯一例外：Next.js SSR 需要 Provider 实现 store-per-request 隔离（后面讲）。

[click] 不可变更新与 React 哲学一致 ——
set({ count: 1 }) 浅合并到 state，需要嵌套更新时手动 spread 或者用 immer。

[click] 并发安全来自 useSyncExternalStore（React 18+ API）—— 
旧版本的状态库在 startTransition 下会撕裂（部分组件看旧值、部分看新值），
Zustand v4+ 通过 useSyncExternalStore 彻底解决。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与初始化

::left::

<v-click>

**安装**

```bash
pnpm add zustand
```

| 版本 | React 兼容   |
| ---- | ------------ |
| v5.x | 18+ 主线     |
| v4.x | 16.8+ 仍维护 |

</v-click>

::right::

<v-click>

**最小示例**

```ts
import { create } from "zustand";

export const useBearStore = create<{
  bears: number;
  increase: () => void;
}>()((set) => ({
  bears: 0,
  increase: () => set((s) => ({ bears: s.bears + 1 })),
}));
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Zustand 安装极简 —— 一个包，没有 peer dependency。
v5.x 要求 React 18+（依赖 useSyncExternalStore），v4.x 兼容 React 16.8+。
新项目无脑 v5。

[click] 最小可运行示例只需要 3 步：
1. import { create } from 'zustand'
2. create 传 (set) => ({ ... })
3. 任意组件 useBearStore(selector)

注意 create 的「双重调用」语法：`create<State>()(...)` —— 
这是 TypeScript curry 模式，第一对括号传类型参数，第二对传 state creator。
不这样写 TS 推导会出问题（后面 TypeScript 章节会讲）。

整个示例没有 Provider，没有 createContext，没有 useReducer —— 这就是 Zustand 的极简哲学。
-->

---
transition: fade-out
---

# 第一个 Store：完整示例

set / get / actions 一次讲清

<v-click>

```ts
import { create } from "zustand";

type CounterState = { count: number; step: number };
type CounterActions = {
  increment: () => void; decrement: () => void;
  setStep: (step: number) => void; reset: () => void;
};

export const useCounterStore = create<CounterState & CounterActions>()((set, get) => ({
  count: 0, step: 1,                                                 // state
  increment: () => set((s) => ({ count: s.count + s.step })),        // actions
  decrement: () => set((s) => ({ count: s.count - s.step })),
  setStep: (step) => set({ step }),
  reset: () => set({ count: 0, step: 1 }),
  log: () => console.log("current:", get().count),                   // get()
}));
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Zustand 最经典的 store 写法 ——

类型组织：State + Actions 分两个 interface，最后 `State & Actions` 合并。
这是社区惯例，方便 partialize、selector 类型推导。

set 的两种用法：
- `set({ count: 1 })` —— 直接传部分对象，浅合并到 state
- `set((s) => ({ count: s.count + 1 }))` —— 传函数，从当前 state 派生新值

set 默认走「浅合并」，即只覆盖传入的字段，其他保留。
传第二参 `set(partial, true)` 会变「完全替换」，慎用。

get() 用来在 action 内部读当前 state ——
注意不要在 React 组件里直接调 get()，那样不会订阅变化。
组件里始终用 useStore(selector)。

reset 模式：保留一个 initialState 常量，reset 时 set(initialState)。
更优雅的方式见后面「测试」章节的全局 reset 模式。
-->

---
transition: fade-out
---

# 在组件中使用 Store

useStore(selector) 是唯一推荐入口

<v-click>

```tsx
// CounterDisplay.tsx
import { useCounterStore } from "@/store/useCounterStore";

export function CounterDisplay() {
  // 只订阅 count 字段 → 只在 count 变化时重渲
  const count = useCounterStore((s) => s.count);
  return <h1>{count}</h1>;
}

// CounterControls.tsx
export function CounterControls() {
  // action 是稳定引用，订阅它不会引发额外重渲
  const increment = useCounterStore((s) => s.increment);
  const decrement = useCounterStore((s) => s.decrement);
  return (
    <div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 核心规则：每个组件只订阅它真正用到的字段。

CounterDisplay 只需要 count → 只订阅 count → 别人改 step 不会让它重渲。
CounterControls 只需要 actions → 订阅 actions → state 变化完全不影响它。

这种「字段级订阅」是 Zustand 比 React Context 强的地方 ——
Context 是「整树重渲」，任何子节点用了哪怕一个字段都得整体重渲。
Zustand 用 selector + 浅比较实现「字段级」更新。

注意：每个组件可以多次 useCounterStore，每次订阅不同字段。
- ❌ `const { count, step } = useCounterStore(s => s)` —— 订阅整个 state（任何变化都重渲）
- ✅ `const count = useCounterStore(s => s.count)` —— 只订阅 count
- ✅ 需要多个字段用 useShallow（下页讲）

action 函数是稳定引用（create 时已固定），订阅它们不会触发重渲。
-->

---
transition: fade-out
---

# Selectors：必传 selector

性能关键 —— 字段级订阅 vs 全状态订阅

<v-click>

**❌ 不传 selector（订阅整个 state）**

```tsx
// 任何字段变化都会重渲此组件
const state = useCounterStore();
return <h1>{state.count}</h1>;
```

</v-click>

<v-click>

**✅ 传 selector（字段级订阅）**

```tsx
// 只在 count 变化时重渲
const count = useCounterStore((s) => s.count);
return <h1>{count}</h1>;
```

</v-click>

<v-click>

**Selector 返回值的相等性比较**

Zustand 默认用 `Object.is` 比较 selector 上次和这次的返回值：

- 返回 primitive（number / string / boolean）→ 始终能正确比较
- 返回新对象 / 新数组 → **每次都新引用 → 总是重渲** → 需要 useShallow

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 不传 selector 是 Zustand 最大的反模式之一 ——
等同于「订阅所有字段」，任何 set 都会让此组件重渲。

[click] 必须传 selector，让 Zustand 知道你关心哪些字段。

[click] 这里有个细节：Zustand 用 Object.is 判断「上次 selector 结果」和「这次 selector 结果」是否相等。
- 返回 number / string / boolean / null / undefined → Object.is 直接比较，没问题
- 返回 `{ a: state.a, b: state.b }` 这种新对象 → 每次调用都是新引用 → Object.is 永远 false → 永远重渲

解决方案两个：
1. 多次 useStore 分别取每个字段（最简单）
2. 用 useShallow 包一层 selector，让它走「浅比较」

下一页详细展开 useShallow。
-->

---
transition: fade-out
---

# useShallow：选多个字段的正确姿势

避免「新对象引用」导致的无限重渲

<v-click>

**❌ 每次 selector 都返回新对象 → 总是重渲**

```tsx
const { count, step } = useCounterStore((s) => ({ count: s.count, step: s.step }));
```

</v-click>

<v-click>

**✅ 用 useShallow 包一层**

```tsx
import { useShallow } from "zustand/react/shallow";
const { count, step } = useCounterStore(useShallow((s) => ({ count: s.count, step: s.step })));
```

</v-click>

<v-click>

**或：拆成多个 useStore（最简单）**

```tsx
const count = useCounterStore((s) => s.count);
const step = useCounterStore((s) => s.step);
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Zustand 新手坑 Top 1 ——
组件用了 destructure 风格的 selector 后渲染不停，控制台无报错，
检查后发现 selector 每次返回的 object 引用都不同。

[click] useShallow 是 v4 引入的官方解决方案 ——
内部用浅比较（对每个 key 做 Object.is）判断对象是否变化。
只要顶层 key 的值没变，就认为「相等」，不触发重渲。

注意 useShallow 只做一层比较，嵌套对象需要自己保证引用稳定。
比如 `{ user: state.user }`，user 字段本身是对象，只要 state.user 引用没变就 ok。

[click] 第三种方案最朴素：拆成多个 useStore。
代码稍长但绝对没有引用陷阱，性能反而最好（每个 useStore 独立订阅，互不影响）。

何时用哪个？
- 取 1~2 个字段 → 拆成多个 useStore
- 取 3+ 字段且要返回对象 → useShallow
- 永远不要不传 selector
-->

---
transition: fade-out
---

# 异步 actions：直接 async/await

不需要 thunk / saga 中间件

<v-click>

```ts
type UserState = {
  user: User | null; loading: boolean; error: string | null;
  fetchUser: (id: number) => Promise<void>;
};

export const useUserStore = create<UserState>()((set) => ({
  user: null, loading: false, error: null,
  fetchUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error("Network error");
      set({ user: await res.json(), loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },
}));
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Zustand 的异步 action 就是「普通 async 函数」——
没有 redux-thunk / redux-saga / redux-observable 这层中间件。

写法很自然：
1. 进入 action，set loading: true
2. 等异步操作
3. 成功 set 数据，失败 set 错误信息

这里有几个最佳实践：
- loading / error 字段在 action 开头清空，避免上次失败残留
- try/catch 包整个 await，确保失败也清 loading
- 不要在 action 内部 throw，而是把错误存进 state，让组件用 useStore 订阅 error 字段统一处理

注意：Zustand 不是「服务端状态缓存」库 —— 
重复请求、缓存失效、自动重试这种需求请用 TanStack Query / SWR 配合。
Zustand 适合「客户端状态」（UI、表单、用户偏好）。

混用模式：TanStack Query 管 API 数据 + Zustand 管 UI 状态（弹窗、主题、登录状态）。
-->

---
transition: fade-out
---

# Middleware 全景

<v-click>

| Middleware                | 作用                       |
| ------------------------- | -------------------------- |
| **persist**               | localStorage 持久化        |
| **devtools**              | Redux DevTools 集成        |
| **immer**                 | mutable 写法（嵌套友好）   |
| **subscribeWithSelector** | subscribe 支持 selector    |
| **combine**               | 自动类型推断               |

</v-click>

<v-click>

**洋葱顺序**：devtools（外）→ persist（中）→ immer（内）

```ts
create<State>()(
  devtools(persist(immer((set) => ({ /* state */ })), { name: "my-store" })),
);
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Middleware 是 Zustand 的核心扩展机制 ——
每个 middleware 都是一个高阶函数，包裹原始 stateCreator。

最常用的四个：
- persist：localStorage 持久化，刷新页面状态还在
- devtools：Redux DevTools 集成，可以 time-travel
- immer：嵌套更新场景下用 `state.user.address.city = 'x'` 这种 mutable 写法
- subscribeWithSelector：让 store.subscribe() 接收 selector + callback

[click] 顺序很重要 —— middleware 是「洋葱模型」（类似 Koa）：
- devtools 最外层：能看到所有 middleware 处理后的最终 state
- persist 在中间：把已经过 immer 处理的 state 持久化
- immer 最内层：直接接收原始 set，转译 mutable 写法

错误顺序会出现奇怪 bug：比如 persist 包在 devtools 外面，
DevTools 看不到 hydrate 行为；immer 包在 persist 外面，
persist 序列化失败（Immer Draft 无法 JSON.stringify）。

记忆口诀：「看得见的在外层，处理 state 的在内层」。
-->

---
transition: fade-out
---

# persist：localStorage 持久化

最常用的 middleware，几乎所有项目都要用

<v-click>

```ts
import { persist, createJSONStorage } from "zustand/middleware";

type ThemeState = { theme: "light" | "dark"; toggle: () => void };

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggle: () => set({ theme: get().theme === "light" ? "dark" : "light" }),
    }),
    {
      name: "theme-storage",                            // localStorage key
      storage: createJSONStorage(() => localStorage),   // 默认就是 localStorage
      partialize: (state) => ({ theme: state.theme }),  // 只持久化 theme
      version: 1,                                       // 版本号
      migrate: (persisted, version) => persisted as ThemeState,
    },
  ),
);
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] persist 是日常项目里几乎必用的 middleware ——
主题、登录状态、表单草稿、UI 偏好都会持久化。

关键配置：
- name：localStorage 的 key（多个 store 要保证唯一）
- storage：默认 localStorage，可以换成 sessionStorage / AsyncStorage（RN）/ 自定义
- partialize：只持久化指定字段（actions 不应该持久化，否则反序列化拿不到函数）
- version + migrate：数据结构变更时的迁移钩子，避免老用户报错

createJSONStorage 帮你包一层 JSON.parse/stringify，
如果换成自定义 storage（如 IndexedDB）需要自己实现 getItem / setItem。

进阶用法：
- onRehydrateStorage：hydrate 完成时的钩子（可以在这里设 loading: false）
- skipHydration：跳过自动 hydrate，手动调 store.persist.rehydrate()（SSR 必用）
- merge：自定义合并策略（默认浅合并 persisted 到 currentState）

持久化最容易踩的坑 —— SSR hydration mismatch：服务端没有 localStorage，
导致初始渲染和 hydrate 后的状态不一致。解决方案见后面 SSR 章节。
-->

---
transition: fade-out
---

# devtools：Redux DevTools 集成

调试神器，time-travel + action log

<v-click>

```ts
import { devtools } from "zustand/middleware";

export const useCartStore = create<CartState>()(
  devtools(
    (set) => ({
      items: [],
      addItem: (item) => set(
        (s) => ({ items: [...s.items, item] }),
        false,           // replace：false = 浅合并
        "cart/addItem",  // action name（DevTools 显示）
      ),
    }),
    { name: "CartStore", enabled: process.env.NODE_ENV === "development" },
  ),
);
```

</v-click>

<v-click>

**DevTools 能做什么？** 时间旅行 / Action log / State diff / 跨 store 切换

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] devtools 让 Zustand 接上 Redux DevTools 浏览器扩展 ——
即使你没用 Redux，也能享受 time-travel 调试体验。

set 的第三参 action name 是 devtools 最大的价值：
- 不传 → DevTools 显示「anonymous」（一串 set 看不出区别）
- 传 'cart/addItem' → 时间线上每条记录都有名字，bug 定位极快

最佳实践：每个 set 调用都加 action name，命名格式 'sliceName/actionName'。

[click] DevTools 具体能力：
- 时间旅行：点历史记录里的任何一条，state 立刻回滚到那个时间点
- Action 日志：每条 set 显示前后 state diff，类似 git diff
- 手动操作：dispatch 自定义 action / 修改任意字段 / 导出 state JSON

注意：
- 生产环境务必用 `enabled: process.env.NODE_ENV === 'development'` 关掉
- 或者用 `import.meta.env.DEV`（Vite）/ `import.meta.env.MODE`
- 生产开 devtools 会泄露 store 结构 + 性能损耗

DevTools 配 persist 同时用，开发体验拉满 —— 写代码 + 刷新页面 + 状态都在。
-->

---
transition: fade-out
---

# immer：mutable 写法

嵌套更新的救星

<v-click>

**❌ 不用 immer：嵌套 spread 地狱**

```ts
set((s) => ({
  user: { ...s.user, profile: { ...s.user.profile,
    address: { ...s.user.profile.address, city: "Shanghai" }
  }},
}));
```

</v-click>

<v-click>

**✅ 用 immer：直接赋值**

```ts
import { immer } from "zustand/middleware/immer";

export const useUserStore = create<UserState>()(
  immer((set) => ({
    user: { profile: { address: { city: "Beijing" } } },
    setCity: (city) => set((draft) => { draft.user.profile.address.city = city }),
  })),
);
```

</v-click>

<v-click>

底层用 Proxy 拦截 draft 修改，最后生成不可变新对象。

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是没有 immer 时的痛苦写法 ——
更新一个嵌套三层的字段，要写一坨 spread。
写错一个地方就静默失败（比如忘了 spread 中间某层，那一层就被新对象覆盖了）。

[click] immer 让你写「看起来 mutable 但实际 immutable」的代码 ——
draft 是 Proxy 包裹的对象，你怎么改它都不会影响原 state，
immer 在 produce 结束时根据 draft 的变更生成新对象。

底层原理：
- Proxy 拦截 get / set / has 等操作
- 标记被改过的路径，未改的部分保持原引用（结构共享）
- 最终 return 新对象，没改的子树和旧对象共享引用（GC 友好）

[click] immer 几个注意点：
- 不要从 draft 里 return（return 会被当成完全替换）
- 数组用 `draft.items.push(x)` 即可，不需要 spread
- Map / Set 需要 enableMapSet() 启用
- 性能：immer 适合「中等复杂度」嵌套，超大对象（>10MB）反而比手写 spread 慢

什么时候用 immer？嵌套 3 层以上时强烈推荐，否则手写 set 即可。
对比 Redux Toolkit：Toolkit 内置 immer，Zustand 是按需引入 —— 哲学一致。
-->

---
transition: fade-out
---

# subscribeWithSelector：精细订阅

监听特定字段变化（不触发渲染）

<v-click>

默认 subscribe 接收整个 state，任何变化都触发；middleware 让其支持 selector。

```ts
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";

const useDogStore = create(
  subscribeWithSelector(() => ({ paw: true, snout: true, fur: true })),
);

// 只在 paw 变化时触发
useDogStore.subscribe((s) => s.paw, console.log);

// 接收 previous value
useDogStore.subscribe((s) => s.paw, (paw, prev) => console.log(prev, "→", paw));

// 多字段 + 浅比较 + 立即触发
useDogStore.subscribe(
  (s) => [s.paw, s.fur], console.log,
  { equalityFn: shallow, fireImmediately: true },
);
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] store.subscribe 是 Zustand 的「副作用通道」——
不引发渲染，只在 state 变化时调一个回调。
适合「与外界同步」场景：日志、analytics、WebSocket 推送、URL 同步。

默认 subscribe 接收 (state, prev) => void，任何字段变化都触发。
大多数场景下我们只关心某个字段，需要自己手写 if (state.x !== prev.x) 判断。

[click] subscribeWithSelector middleware 把这个能力下沉到框架：
- subscribe 第一参变成 selector
- selector 返回值变化才触发 listener
- 自动传 (current, previous) 给 listener
- 支持 equalityFn（如 shallow）和 fireImmediately（注册时立即跑一次）

典型用例：
1. URL 同步：state.filter 变化 → 写到 URL query
2. WebSocket 上报：state.user.id 变化 → 重新订阅频道
3. analytics：state.cart 变化 → 发埋点
4. 日志：所有 action 都打 console（开发模式）

注意 subscribe 不在 React 渲染流程里 —— 不能在 listener 里调 useState 等 hook。
要更新组件用 useStore，要做副作用用 subscribe。
-->

---
transition: fade-out
---

# combine：自动类型推断

<v-click>

**普通写法（手写 State 类型）**

```ts
type State = { count: number; name: string };
type Actions = { increment: () => void };

export const useStore = create<State & Actions>()((set) => ({
  count: 0, name: "Zustand",
  increment: () => set((s) => ({ count: s.count + 1 })),
}));
```

</v-click>

<v-click>

**combine 写法（自动推断 State）**

```ts
import { combine } from "zustand/middleware";

export const useStore = create(
  combine(
    { count: 0, name: "Zustand" },   // 初始 state → 推断类型
    (set) => ({ increment: () => set((s) => ({ count: s.count + 1 })) }),
  ),
);
```

</v-click>

<v-click>

适合小型 store / Demo；大型项目仍推荐显式 `create&lt;State&gt;()`。

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Zustand TS 模板的标准写法 ——
先定义 State / Actions 类型，再 `create<State & Actions>()(...)`。
clarity 拉满但每次都要写两段 type。

[click] combine 是 Zustand 提供的「类型推断辅助」middleware ——
你只给「初始 state 对象」+「actions 工厂」，TypeScript 自动从初始 state 推 State 类型。
省掉了显式 type 声明。

适合：
- 小型 demo / 原型
- store 字段 < 5 个
- 团队成员对 TS 不太熟悉

[click] 不适合：
- 大型项目（type 集中定义更好维护）
- 需要 readonly / never / 联合类型等复杂 state
- 配合 persist 的 partialize（partialize 需要 State 类型显式标注）

社区里大部分人还是用 `create<State & Actions>()` 模板，combine 用得不算多。
但作为「快速起手」工具值得知道。
-->

---
transition: fade-out
---

# Slices 模式：拆分大型 Store

StateCreator 组合多片状态

<v-click>

```ts
// store/slices/bearSlice.ts
import type { StateCreator } from "zustand";

export interface BearSlice {
  bears: number;
  addBear: () => void;
  eatFish: () => void;
}

export const createBearSlice: StateCreator<
  BearSlice & FishSlice,  // 整个 store 的类型
  [],
  [],
  BearSlice               // 此 slice 贡献的类型
> = (set) => ({
  bears: 0,
  addBear: () => set((s) => ({ bears: s.bears + 1 })),
  eatFish: () => set((s) => ({ fishes: s.fishes - 1 })),
});
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 单个 store 字段太多时（>10 个）需要拆分 slice ——
slices 模式是社区惯例，类似 Redux Toolkit 的 createSlice。

StateCreator 是 Zustand 暴露的工具类型，签名很复杂但只要记住四个泛型：
1. 整个 store 类型（slice 之间可能互相调用，需要知道完整类型）
2. middleware mutators 入参（一般 []）
3. middleware mutators 出参（一般 []）
4. 此 slice 贡献的类型

这种类型约束让 set / get 在 slice 内部也能拿到完整 store 类型，
跨 slice 调用（如 bear 吃 fish）类型推导完美。

下页展示组合。
-->

---
transition: fade-out
---

# Slices 模式（续）：组合多个 Slice

create 时直接 spread 各 slice 工厂

<v-click>

```ts
// fishSlice.ts
export interface FishSlice { fishes: number; addFish: () => void }
export const createFishSlice: StateCreator<
  BearSlice & FishSlice, [], [], FishSlice
> = (set) => ({
  fishes: 0,
  addFish: () => set((s) => ({ fishes: s.fishes + 1 })),
});

// store/index.ts —— 关键技巧：(...args) 透传给每个 slice
export const useBoundStore = create<BearSlice & FishSlice>()((...args) => ({
  ...createBearSlice(...args),
  ...createFishSlice(...args),
}));

const bears = useBoundStore((s) => s.bears);
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 关键技巧：`(...args) => ({ ...createBearSlice(...args), ...createFishSlice(...args) })`

把 create 传给 stateCreator 的所有参数（set / get / store）透传给每个 slice 工厂，
然后把各 slice 返回的对象浅合并成一个大 state。

这种模式的好处：
- 每个 slice 独立文件，职责清晰
- slice 之间能互相调用（bears 吃 fishes 时 set 既改 bears 又改 fishes）
- 类型推导依然完整
- 测试时可以单独 import 某个 createXxxSlice 测试

vs 多个独立 store：
- slices 模式：一个 store，多个 slice 共享 set/get（适合状态间有强关联）
- 多 store 模式：多个 store 独立，互相 import useXxxStore（适合状态间无关）

实际项目里我建议「应用级共享状态用 slices」+「页面独立状态用独立 store」混合。
没有银弹，看耦合度。

注意：slices 数量多了之后，combine 后的 store 体积会变大。
但 Zustand 不像 Redux 那样有「root reducer 性能问题」—— 每个 selector 还是只订阅自己关心的字段。
-->

---
transition: fade-out
---

# vanilla store：脱离 React

createStore + getState/setState/subscribe

<v-click>

```ts
import { createStore } from "zustand/vanilla";

type PositionStore = {
  x: number; y: number;
  setPosition: (pos: { x: number; y: number }) => void;
};

const positionStore = createStore<PositionStore>()((set) => ({
  x: 0, y: 0,
  setPosition: (pos) => set(pos),
}));

const current = positionStore.getState();                        // 读
positionStore.getState().setPosition({ x: 10, y: 20 });          // 写
const unsub = positionStore.subscribe((s, prev) => console.log(s.x, prev.x));  // 订阅
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] zustand/vanilla 是脱离 React 的纯净 store 实现 ——
适合在 Web Worker、Service Worker、Node.js 工具脚本、甚至 Vue / Svelte 项目里用。

createStore vs create：
- create（来自 'zustand'）= createStore + React hook 封装
- createStore（来自 'zustand/vanilla'）= 纯 store 对象，没有 React 依赖

vanilla store 的 API：
- getState() → 同步读当前 state
- setState(partial) → 同步写 state
- subscribe(listener) → 注册监听器，返回 unsubscribe
- getInitialState() → 拿初始 state（v4 引入，测试 reset 神器）
- destroy() → v4 已废弃（subscribe 返回 unsub 即可）

实际场景：
- WebSocket 客户端：vanilla store 存连接状态，React 组件 useStore 订阅
- Web Worker 计算：worker 内部用 vanilla store，主线程用 React 版
- 跨框架共享：Zustand vanilla 当「单一数据源」，React / Vue / Svelte 各自订阅

Next.js SSR 场景（下页）就是 vanilla createStore 的典型应用。
-->

---
transition: fade-out
---

# SSR / Next.js：store-per-request

避免请求间状态污染

<v-click>

**为什么不能直接用 create？** Next.js 服务端「单进程多请求」—— 模块顶层 store 跨用户共享，A 污染 B。必须每个请求新建 store。

</v-click>

<v-click>

**Step 1：vanilla store 工厂**

```ts
import { createStore } from "zustand/vanilla";

export type CounterStore = { count: number; increment: () => void };
export const defaultInitState = { count: 0 };

export const createCounterStore = (initState = defaultInitState) =>
  createStore<CounterStore>()((set) => ({
    ...initState,
    increment: () => set((s) => ({ count: s.count + 1 })),
  }));
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] SSR 是 Zustand 文档里最常被忽视的细节 ——

在 Next.js / Remix 等 SSR 框架里，模块在服务器上只 import 一次，
但每个 HTTP 请求都会触发一次渲染。
如果你直接 `export const useStore = create(...)`，
那这个 store 会跨请求共享 ——
请求 A 改了状态，请求 B 看到的是 A 改过的值。
这是经典的「服务端状态污染」。

[click] 正确做法：把 create 包成「工厂函数」，每次调用生成新 store。
这就是为什么 SSR 场景必须用 zustand/vanilla 的 createStore（不带 React hook），
然后在 Provider 里实例化。

createCounterStore 接收可选的 initState ——
适合 SSR 时从后端传 hydrationData 注入初始状态。

下一页讲怎么在 React 里消费这个 vanilla store。
-->

---
transition: fade-out
---

# SSR / Next.js（续）：Provider + useStore

唯一需要 Provider 的场景

<v-click>

**Step 2：Provider 包一层**

```tsx
"use client";
import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";
import { type CounterStore, createCounterStore } from "@/stores/counter-store";

type StoreApi = ReturnType<typeof createCounterStore>;
const CounterContext = createContext<StoreApi | undefined>(undefined);

export function CounterProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<StoreApi>(null);
  if (!storeRef.current) storeRef.current = createCounterStore();
  return <CounterContext.Provider value={storeRef.current}>{children}</CounterContext.Provider>;
}

export function useCounter<T>(selector: (s: CounterStore) => T): T {
  const ctx = useContext(CounterContext);
  if (!ctx) throw new Error("useCounter must be used within CounterProvider");
  return useStore(ctx, selector);
}
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Next.js 官方推荐的 SSR pattern ——

- useRef 保证每个组件实例只创建一次 store（首次渲染时 storeRef.current 是 null，赋值 store；后续渲染直接复用）
- React Context 把 store 实例传给子树
- useStore（来自 zustand）+ selector 让组件订阅

注意细节：
- useState 和 useRef 都能保证「只创建一次」，但 useRef 不会触发额外渲染
- 不能用模块顶层 const store = createStore()，否则又回到「跨请求污染」的坑
- 'use client' 必须加，Provider 是客户端组件

在 layout.tsx 里包一层：
```tsx
export default function RootLayout({ children }) {
  return <CounterProvider>{children}</CounterProvider>
}
```

之后任何 client component 里：
```tsx
const count = useCounter(s => s.count)
const inc = useCounter(s => s.increment)
```

这是 Zustand 唯一推荐用 Provider 的场景。
非 SSR 项目（Vite SPA / CRA）请保持简单 —— 模块顶层 create 就够了。

如果用 Pages Router 而不是 App Router，把 Provider 放在 _app.tsx 里效果一样。
-->

---
transition: fade-out
---

# TypeScript：curried create

为什么是 `create&lt;State&gt;()(...)` 而不是 `create&lt;State&gt;(...)`?

<v-click>

**TS 推导陷阱**：不支持「部分泛型推断」—— 要么全推、要么全不推，没法「我给 T、函数参数让你推」。

</v-click>

<v-click>

**curried 解法：拆成两次调用**

```ts
// ✅ Zustand v4+ 推荐：set/get 类型自动推断
create<State>()((set, get) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}));

// ❌ set/get 变 unknown
create<State>((set, get) => ({ /* ... */ }));
```

</v-click>

<v-click>

第一对 `()` 固定 State 类型，第二对接收 stateCreator，TS 推断 set/get。

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Zustand TypeScript 用法里最让人困惑的地方 ——
看到 `create<State>()((set) => ...)` 这种空括号，新手会问「这是什么写法？」

原因纯粹是 TypeScript 语法限制 ——
TS 现在还不支持「Partial Type Argument Inference」，
即不能「我指定 T，让你推断 U」（issue #26242 长期挂着）。

[click] curry 是经典解法 ——
把 `create<T, U>(creator)` 拆成 `create<T>()(creator)`：
- 第一次调用 `<State>()`：手动给 State 类型，返回一个 (creator) => Store 函数
- 第二次调用 `(creator)`：传 stateCreator，让 TS 自动推断 set / get 的精确类型

这样 set 在 (s) => ({ count: s.count + 1 }) 里就有完整的 State 类型提示。

如果你写成 `create<State>(creator)`，set 会变 unknown，所有 IDE 提示挂掉。

[click] 如果不想写 type，用 combine middleware（之前讲过）：
combine 让 TS 自动从「初始 state 对象」推断 State 类型，省掉 `<State>` 部分。

记住口诀：「想要类型？带空括号。不想写类型？用 combine。」
-->

---
transition: fade-out
---

# 测试：mock + reset 方案

避免测试间状态泄漏 —— 模块顶层 store 跨测试共享，A 改了 B 看到

<v-click>

**`__mocks__/zustand.ts` 全局自动 reset**

```ts
import { act } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import * as Zustand from "zustand";

const { create: actualCreate } = await vi.importActual<typeof Zustand>("zustand");
const storeResetFns = new Set<() => void>();

export const create = (<T,>(creator: Zustand.StateCreator<T>) => {
  const store = actualCreate(creator);
  const initial = store.getState();
  storeResetFns.add(() => store.setState(initial, true));
  return store;
}) as typeof Zustand.create;

afterEach(() => act(() => storeResetFns.forEach((fn) => fn())));
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是写 Zustand 测试时绕不开的问题 ——
store 在模块顶层创建（运行时只一次），多个测试共用同一个实例。
测试 A 改了 state，测试 B 跑的时候 state 还在改过的状态，导致测试相互影响。

[click] 官方推荐方案是「全局 mock zustand 模块」——
__mocks__/zustand.ts 拦截 create 调用，注册一个 reset 函数，
afterEach 钩子里把所有 store 重置到初始状态。

实现要点：
- vi.importActual 拿到真实的 create（mock 不能递归调到自己）
- 在真 create 之后立刻 getState() 拿初始值
- 把 () => setState(initial, true) 加入 reset 集合
- afterEach 里 act() 包装所有 reset（避免 React warning）

Vitest 配置：
- vitest.config.ts 里 `test.setupFiles: ['__mocks__/zustand.ts']`
- 或者顶层加 `import.meta.vitest` 守护

Jest 类似，把 `await vi.importActual` 换成 `jest.requireActual` 即可。

替代方案：
- 每个测试用例手动 useXxxStore.setState(initial, true)（朴素但繁琐）
- 用 @pinia/testing 那种「createTestingPinia」工厂模式 ——
  Zustand 没有官方等价物，但社区有 zustand-testing-utils 之类的包

记住：测试隔离 = 状态隔离，不解决会写出「跑一次过、跑两次挂」的脆弱测试。
-->

---
transition: fade-out
---

# 测试组件：Render + Act

实战 React Testing Library

<v-click>

```tsx
// useCounter.test.tsx
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { Counter } from "./Counter";
import { useCounterStore } from "./useCounterStore";

describe("Counter", () => {
  it("increments when clicking +", async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByText("+"));
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("can seed state via store API", () => {
    // 直接 setState 注入初始状态（vanilla API）
    act(() => useCounterStore.setState({ count: 100 }, true));
    render(<Counter />);
    expect(screen.getByText("100")).toBeInTheDocument();
  });
});
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 实际写测试时，Zustand 的 store 直接当「测试 API」用 ——
组件内部用 hook 订阅，测试代码用 setState 注入 / getState 断言。

关键点：
- 配合上一页的 __mocks__/zustand.ts，每个测试开始时 state 已自动重置
- setState 第二参 `true` 表示完全替换（不浅合并）—— 测试场景常用
- 用 act() 包裹 setState 避免 React 18 警告

测试模式总结：
1. **黑盒**：只看 UI 渲染 + 用户交互（推荐，符合 RTL 哲学）
2. **状态注入**：useStore.setState 准备初始数据，再 render
3. **state 断言**：useStore.getState() 检查 action 后的状态变化

不推荐：
- mock useCounterStore hook 本身（会让 store 失去意义）
- 在测试里 import 内部实现细节

集成 React Query：
- TanStack Query 也有类似的「测试间污染」问题，用 QueryClientProvider 包一层 + new QueryClient() 重置
- Zustand 跟它配合得很好，两者都遵循「显式重置」哲学

最后建议：Zustand 测试不需要复杂 mock 框架 ——
Vitest + RTL + 上面的全局 reset 就能覆盖 90% 场景。
-->

---
transition: fade-out
---

# Auto-generating selectors

省掉每次写 `(s) => s.xxx` —— 用 createSelectors 自动生成

<v-click>

```ts
type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } } : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {} as never;
  for (const k of Object.keys(store.getState()))
    (store.use as never)[k] = () => store((s) => s[k as keyof typeof s]);
  return store;
};

export const useBearStore = createSelectors(useBearStoreBase);
const bears = useBearStore.use.bears();
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 手写 selector 没问题，但每个组件里写一堆 (s) => s.x 确实啰嗦。
对大型项目来说一致性也是负担 —— 不同人写法不同，review 时浪费精力。

[click] createSelectors 是社区惯例，Zustand 文档里直接给了实现 ——
遍历 store 初始 state 的 key，给每个 key 生成一个 `store.use.xxx()` hook。

效果：
- `useBearStore.use.bears()` 等价于 `useBearStore((s) => s.bears)`
- IDE 自动补全：输入 `useBearStore.use.` 看到所有字段列表
- 类型推导完整：每个 use.xxx 的返回值类型对应 state 字段类型

代价：
- 需要手动包一层 createSelectors
- store 上多了一个 .use 属性，调试 DevTools 时会看到
- 嵌套对象需要二级 selector：`useStore.use.user().profile.name` 仍订阅整个 user

什么时候用？
- 团队规模大（5+ 人）：统一写法
- 字段名重复使用（>3 处）：节省重复代码
- 小项目：保持 (s) => s.xxx 即可，不必额外封装

Zustand 官方文档专门写了一页 "Auto Generating Selectors"，
值得作为团队规范的一部分纳入项目模板。
-->

---
transition: fade-out
---

# 生态对比：选谁，何时？

每个状态库都有它的场景

<v-click>

| 场景                  | 推荐方案           | 原因                       |
| --------------------- | ------------------ | -------------------------- |
| React 中小项目        | **Zustand**        | 极简、无 Provider、TS 友好 |
| React 大型团队        | **Redux Toolkit**  | 规范化、社区成熟           |
| 大量独立小状态        | **Jotai**          | atom 颗粒度小              |
| Vue 3 项目            | **Pinia**          | 官方推荐                   |
| 异步数据 / 请求缓存   | **TanStack Query** | Zustand 不是数据缓存层     |
| URL state             | URL params + nuqs  | Zustand 不该管路由         |
| 表单状态              | React Hook Form    | 全局存表单 = 污染          |

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Zustand 适合「中小型 React 项目的应用级状态」——
但不是所有状态都该塞进 Zustand。

「服务端数据」（API 响应、缓存、重试、失效）走 TanStack Query / SWR ——
它们解决了 Zustand 不擅长的「数据生命周期」问题。
最佳实践：TanStack Query 管 API，Zustand 管 UI 状态。

「URL state」（分页、筛选条件、tab 选中）应该是 URL 的职责 ——
用 nuqs / next-usequerystate 双向绑定 URL params，
刷新 / 分享 / 后退都自动同步。Zustand 存这种数据 = 用户分享不了链接。

「表单状态」用 React Hook Form / Formik —— 
表单字段 + 校验 + 提交流程是独立领域，Zustand 全局存表单会污染。
表单提交成功后的「提交后状态」（如「请稍候」「成功」）才适合放 Zustand。

「单组件 / 父子组件」用 useState / Context 即可 ——
状态没有跨组件树共享需求，没必要引入 Zustand。

记住：Zustand 是「应用级跨组件状态」的工具，
其他类型状态各有更合适的方案。
-->

---
transition: fade-out
---

# 常见踩坑（一）：解构丢响应性

新手 Top 1 误用

<v-click>

**❌ 错误：destructure 后变成快照值**

```tsx
const { count, increment } = useCounterStore();
// 不传 selector = 订阅整个 state，任何字段变化都重渲
```

</v-click>

<v-click>

**✅ 正确：每个字段独立 selector**

```tsx
const count = useCounterStore((s) => s.count);
const increment = useCounterStore((s) => s.increment);
```

</v-click>

<v-click>

**或：useShallow 包多字段**

```tsx
const { count, increment } = useCounterStore(
  useShallow((s) => ({ count: s.count, increment: s.increment })),
);
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 看起来跟 Pinia 的「解构丢响应性」很像 —— 但本质不同。

Pinia 是因为 ref / computed 被解构后丢响应包装，
Zustand 是因为 `useCounterStore()` 调用返回的就是「快照值」+「订阅整个 state」。

[click] 「订阅整个 state」是更严重的问题 ——
即使表面上 count 在重渲时拿到了新值（因为重渲了），
但任何无关字段变化都触发重渲，性能爆炸。

实际表现：
- 看似工作正常（count 数字会更新）
- React DevTools Profiler 显示组件频繁重渲
- 大型 store 下页面卡顿

[click] [click] 解决方案两个：
1. 每个字段独立 selector（最朴素，性能最好）
2. useShallow 包对象 selector（多字段时方便）

写代码时养成习惯：永远传 selector，永远不要 `useStore()` 空调用。
ESLint 可以加 `eslint-plugin-zustand`（社区维护）自动检测。

团队规范层面建议：写一个 createSelectors 工具（前面讲过），
所有 store 自动生成 `useStore.use.xxx()`，从根本上避免 destructure。
-->

---
transition: fade-out
---

# 常见踩坑（二）：SSR hydration mismatch

服务端没有 localStorage

<v-click>

**问题**：服务端 `theme='light'` → 客户端 hydrate 后从 localStorage 读到 `'dark'` → React 报 `Hydration failed`。

</v-click>

<v-click>

**方案 1：等 hydration 完成再渲染**

```tsx
const [hydrated, setHydrated] = useState(false);
useEffect(() => setHydrated(true), []);
const theme = useThemeStore((s) => s.theme);
if (!hydrated) return null;
return <div className={theme}>{children}</div>;
```

</v-click>

<v-click>

**方案 2：persist 的 skipHydration + 手动 rehydrate**

```ts
persist(creator, { name: "theme", skipHydration: true })
// 客户端 useEffect 里：useStore.persist.rehydrate()
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是用 persist + Next.js 时必踩的坑 ——
React 18 对 hydration mismatch 异常严格，theme 类需求几乎必中。

根本原因：服务端没有 localStorage，所以服务端拿到的是「persist 默认值」，
客户端 hydrate 完后 persist 会立刻读 localStorage 并更新 state，
两次渲染输出不一致 → 报错。

[click] 解决方案 1 最简单：
hydrated flag 控制渲染时机，服务端 + 客户端首次都返回 null，
useEffect 之后再渲染真实内容。
代价是「主题闪烁」—— 用户看到一瞬间空白。

[click] 解决方案 2 更优雅：
告诉 persist「先别自动 hydrate」，
等客户端组件 mount 后手动触发：
```tsx
useEffect(() => { useThemeStore.persist.rehydrate() }, [])
```
配合 onRehydrateStorage 钩子做完成回调。

进阶方案（生产推荐）：
- SSR 时根据 cookie 判断 theme，传给客户端
- 客户端 persist 用 cookie 做 storage（next-cookies + zustand-cookie-storage）
- 既无闪烁，又能跨设备记忆

记住：persist + SSR 永远要思考「服务端拿到的初始值是什么」。
-->

---
transition: fade-out
---

# 常见踩坑（三）：state 浅合并

set 不是 setState

<v-click>

**默认行为：set 是浅合并（只覆盖顶层 key）**

```ts
// state: { user: { name: 'A', age: 20 }, count: 0 }
set({ user: { name: 'B' } });
// state: { user: { name: 'B' }, count: 0 }  ← age 丢了！
```

</v-click>

<v-click>

**修复方法 1：手动 spread**

```ts
set((s) => ({ user: { ...s.user, name: 'B' } }));
```

</v-click>

<v-click>

**修复方法 2：用 immer middleware**

```ts
set((draft) => { draft.user.name = 'B'; });
```

</v-click>

<v-click>

**完全替换（小心使用）**

```ts
set({ user: null }, true);  // 第二参 true → 完全替换 root state
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Redux 用户切到 Zustand 时容易踩的坑 ——
Redux 的 reducer 必须 return 完整新 state，不能丢字段。
Zustand 的 set 默认走「浅合并」，只覆盖你传的字段，但只在「顶层」浅合并。

[click] 嵌套对象就出问题了：
set({ user: { name: 'B' } }) 直接把整个 user 替换掉，age 就没了。

[click] 修复方法 1 手动 spread：维持了 immutable 心智，但嵌套多层很痛苦。
[click] 修复方法 2 用 immer：直接赋值，immer 自动处理 spread。

[click] set 第二参 `true` 是「root replace」——
不是浅合并而是完全替换 state（包括 actions 字段会被清掉！）。
这个参数主要用于 reset：set(initialState, true)。
日常 set 不要乱传 true，会把 actions 清光。

口诀：
- set(partial) = 顶层浅合并（90% 场景用这个）
- set(fn) = 派生 + 顶层浅合并（需要 prev 值时用）
- set(state, true) = 完全替换（仅 reset 用）

嵌套结构超过 2 层强烈建议引入 immer，否则代码会逐渐变成 spread 火葬场。
-->

---
transition: fade-out
---

# 常见踩坑（四）：循环依赖

slice A 用 slice B 的方法时

<v-click>

**问题：slice 间互相 import**

```ts
// bearSlice.ts → import { useFishStore } from "./fishStore"
// fishStore.ts → import { useBearStore } from "./bearStore"
// 顶层循环，Vite/Webpack 可能初始化为 undefined
```

</v-click>

<v-click>

**做法 1：合并到同一个 store（slices pattern）**

bear / fish 共享 set/get，互相调用不需要 import。适合「业务概念耦合度高」。

</v-click>

<v-click>

**做法 2：事件总线（松耦合）**

```ts
export const useEventBus = create(() => ({}));
// A subscribe / B setState 发事件，解耦但稍绕
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 多个 store 互相调用 action 是项目规模上来后的常见需求 ——
比如「购物车下单」需要调「用户 store 扣余额」+「库存 store 减库存」+「订单 store 加订单」。

直接互相 import 容易陷入循环依赖：
- A.ts 顶层 `import { useB } from './b'`
- B.ts 顶层 `import { useA } from './a'`
- Webpack / Vite 解析时可能其中一个先初始化为 undefined，运行时报错

[click] 推荐做法 1：紧密耦合的 state 用 slices pattern 合并 ——
bear 吃 fish 这种业务关联强的，把它们放进同一个 store 的不同 slice。
通过 set/get 共享访问，不需要跨 store import。

[click] 推荐做法 2：松耦合用事件总线 ——
新建一个空 store useEventBus，
A store 通过 subscribe 监听变化，B store 通过 setState 发事件。
解耦但稍微绕。

实践经验：
- 业务概念耦合度高 → 合并到一个 store（slices）
- 业务概念无关但有跨模块通信 → 事件总线 / 自定义 hook
- 一定要互相 import → 至少把 import 写到函数体内（避开顶层循环）

最大原则：不要让 store 之间形成图状依赖，保持「DAG」（有向无环图）。
-->

---
transition: fade-out
---

# 实战：构建一个 Cart Store

persist + immer + devtools 三件套

<v-click>

```ts
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface Item { id: string; name: string; price: number; qty: number }
interface CartState {
  items: Item[]; total: () => number;
  add: (item: Omit<Item, "qty">) => void;
  remove: (id: string) => void; setQty: (id: string, qty: number) => void;
}

export const useCartStore = create<CartState>()(
  devtools(persist(immer((set, get) => ({
    items: [],
    add: (item) => set((d) => {
      const e = d.items.find((i) => i.id === item.id);
      e ? e.qty++ : d.items.push({ ...item, qty: 1 });
    }, false, "cart/add"),
    remove: (id) => set((d) => { d.items = d.items.filter((i) => i.id !== id) }, false, "cart/remove"),
    setQty: (id, q) => set((d) => { const i = d.items.find(x => x.id === id); if (i) i.qty = q }, false, "cart/setQty"),
    total: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
  })), { name: "cart-storage", partialize: (s) => ({ items: s.items }) }), { name: "CartStore" }),
);
```

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 一个生产级 Cart Store 涵盖了 Zustand 的所有重要 pattern ——

类型设计：
- Item 是数据实体
- CartState 包含 items + actions + computed（total 函数）
- total 不是 state 字段，是「派生」—— 通过 get() 即时计算

middleware 洋葱顺序：
- devtools 最外层（看到所有变化，包括 persist 的 hydrate）
- persist 中间（持久化 immer 处理后的 state）
- immer 最内层（接收原始 set，转译 draft mutation）

set 三参数都用上：
- set(draft => {...}) —— immer 风格修改
- false —— 不替换 root state（默认 false，写出来更清晰）
- 'cart/add' —— action name，DevTools 时间线显示

partialize 只持久化 items：
- actions 不应该序列化（函数会变 null）
- total 不应该持久化（每次 get() 重算）

补充改进点（生产项目可能需要的）：
- 数量上限检查（库存）
- 价格变动同步（外部 API 推送）
- 跨标签页同步（subscribeWithSelector + BroadcastChannel）
- 服务端校验回写（与 TanStack Query mutation 配合）

这个 store 不到 30 行，承载了一个完整电商功能。这就是 Zustand 的威力。
-->

---
transition: fade-out
---

# 性能优化技巧

大型 store + 高频更新场景

<v-click>

**1. 选择器粒度尽量小**

```ts
const name = useStore((s) => s.user.name);  // ✅ 叶子字段
const user = useStore((s) => s.user);       // ❌ 整对象
```

</v-click>

<v-click>

**2. 多字段用 useShallow**

```ts
const { a, b } = useStore(useShallow((s) => ({ a: s.a, b: s.b })));
```

</v-click>

<v-click>

**3. 派生状态用 selector 函数，不进 state**

```ts
const useStore = create((set, get) => ({
  items: [],
  total: () => get().items.reduce(...),  // get() 即时计算
}));
```

</v-click>

<v-click>

**4. subscribe 配合 selector 避免无谓监听**

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 大型应用里 Zustand 的性能瓶颈通常来自三个方向：

[click] 第一是「订阅粒度太粗」——
user.name 变了 → 整个 user 引用变 → 订阅 user 的所有组件都重渲。
解决方案：selector 直接拿叶子节点（s.user.name），不要中间对象。

[click] 第二是「selector 返回新引用」——
返回 `{ ... }` 这种字面量每次都是新对象，必须配 useShallow。
团队规范里强制启用 useShallow 或拆成多次 useStore。

[click] 第三是「重型计算放进 state」——
total / filteredList / sortedItems 这种派生值，
存进 state 会有「来源数据变了但派生值没同步」的 bug 隐患。
改成 get() 函数即时计算，selector 订阅源数据，渲染时算一次。

如果派生计算很贵（O(n²) 之类），可以：
- useMemo 在组件里缓存：`const total = useMemo(() => calc(items), [items])`
- 第三方库（reselect 风格）做 memoize

[click] 第四是 subscribe 监听器无差别触发 ——
用 subscribeWithSelector + selector 只在关心字段变化时跑 listener。
不然每个 set 都跑全部 listener，几十个 listener 性能爆炸。

最后一招：用 immer 反而能优化性能 —— 
immer 结构共享让没改的子树保持原引用，
依赖 immer draft 输出的 selector 命中率会更高。
-->

---
transition: fade-out
---

# 调试技巧：Redux DevTools

时间旅行 + state diff + action log

<v-click>

**1. 启用 + 命名**

```ts
create()(devtools(creator, { name: "MyStore" }))
set({ count: 1 }, false, "counter/increment")  // 时间线显示名字
```

</v-click>

<v-click>

**2. DevTools 实操**

- F12 → Redux DevTools 标签
- 时间线：每条记录显示 action name + payload
- Diff：当前 state vs 上一刻（绿/红高亮）
- 滑动：state 实时回滚到任意时刻
- Dispatcher：手动修改 state

</v-click>

<v-click>

**3. 多 store 共享** —— 每个 devtools 配不同 name，下拉切换实例。

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] [click] devtools 用法前面讲过，再次强调最佳实践 ——
所有 set 都带 action name，命名格式 'feature/action'，
DevTools 时间线就是「业务日志」，bug 复现一目了然。

[click] DevTools 具体能做的事情：
- 时间旅行：拖动 slider 让 state 回到任意时刻，组件 UI 跟着回到那时
- Diff：每条 action 显示前后 state 差异，红色删/绿色加
- Skip：可以跳过某些 action 看「如果没发生会怎样」
- Lock：暂停 state 更新，调试 race condition
- Export / Import：导出 state JSON，用例分享

实际开发流程：
1. 用户报 bug：「点了 X 按钮后 Y 不见了」
2. DevTools Export 用户的 state
3. Import 到本地，时间旅行到出问题前一步
4. 看 action log 找到「丢失 Y 的那个 action」
5. 定位 reducer 逻辑修复

[click] 多 store 项目：每个 createStore 给不同的 name —— 
DevTools 顶部下拉框可以切换不同实例，互不干扰。

注意生产环境务必关掉 devtools（之前讲过的 enabled 选项）。
泄露 state 结构对攻击者是一份「业务说明书」。

补充工具：
- @redux-devtools/extension（浏览器扩展）
- redux-devtools-cli（独立 Electron 客户端，远程调试 RN/Node）
-->

---
transition: fade-out
---

# 项目结构最佳实践

中大型项目的 store 组织

<v-click>

```
src/
  stores/
    use-auth-store.ts        # 登录状态
    use-cart-store.ts        # 购物车
    use-ui-store.ts          # UI 状态（侧栏、主题）
    use-bound-store.ts       # 合并多 slice
    slices/                  # bear-slice / fish-slice
    middleware/              # 自定义 middleware（logger）
    selectors/               # 派生选择器
  __mocks__/zustand.ts       # 测试自动 reset
```

</v-click>

<v-click>

**命名约定**：文件 kebab-case (`use-cart-store.ts`) / Hook camelCase (`useCartStore`) / action 动词起头 (`addItem` / `setQty`)

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Zustand 项目结构没有官方规范，下面是社区主流共识 ——

stores/ 目录平铺多个独立 store，每个文件单一职责。
小项目（< 5 个 store）直接平铺即可，不必嵌套。

slices/ 子目录放「需要合并到 bound store 的 slice」——
比如 e-commerce 项目可能有 cart / catalog / user 三个紧密关联的 slice，
合并到 useBoundStore 共享 set/get。

middleware/ 自定义 middleware 集中放 ——
logger / analytics / persistance-with-encryption 之类。

selectors/ 派生选择器集中放（社区做法分裂，部分人喜欢就近放 store 里）。
优点：测试时可以单独 import selector 测试纯函数。

__mocks__/zustand.ts 是测试 reset 文件，必须在项目根目录或 src/ 根。

[click] 命名约定：
- 文件 use-xxx-store.ts（kebab-case + use 前缀 + store 后缀）
- 导出名 useXxxStore（驼峰 + use 前缀 + Store 后缀）
- action 动词起头：addItem / removeItem / setQty / clearCart
- state 名词：items / count / loading
- 派生选择器以 select 前缀：selectCartTotal / selectIsEmpty

这种结构让 IDE 跳转、grep 搜索、code review 都更高效。
团队规模上来后，规范统一比聪明设计更值钱。
-->

---
transition: fade-out
---

# 生产部署清单

上线前必做的 5 项检查

<v-click>

**1. devtools 已关闭**

```ts
devtools(creator, { name: "MyStore", enabled: process.env.NODE_ENV === "development" });
```

</v-click>

<v-click>

**2. persist 设置 version + migrate** —— 数据结构变更时迁移钩子。

</v-click>

<v-click>

**3. partialize 过滤敏感字段** —— token / 密码绝不写 localStorage。

</v-click>

<v-click>

**4. SSR 项目用 store-per-request** —— Next.js / Remix 必须 vanilla + Provider。

</v-click>

<v-click>

**5. Bundle size 验证** —— `npx vite-bundle-visualizer` 确认 Zustand ~1 KB。

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 生产部署前必做的检查清单 ——

[click] devtools 在生产环境是「免费攻击面」——
攻击者打开 DevTools 就能看到 store 结构 + 实时操作 state，
甚至 dispatch 越权 action（如改 isAdmin 为 true）。
务必用 enabled 选项关闭。

[click] persist version 是「老用户保护机制」——
你今天发布 v1，state 是 `{ user: { name } }`，
明天 v2 改成 `{ user: { firstName, lastName } }`，
不写 migrate 的话，v1 用户打开 v2 就崩。
version + migrate 配合是必备。

[click] partialize 过滤敏感字段 ——
登录态用 cookie + httpOnly，不要把 token 写进 localStorage（XSS 风险）。
partialize: (s) => ({ theme: s.theme })  ← 白名单只放安全字段。

[click] SSR 项目检查 store-per-request ——
本地 dev 单用户测试看不出来，上线后多用户并发立刻翻车。
Code review 时强制要求 SSR 项目用 Provider 模式。

[click] Bundle size 验证 ——
vite-bundle-visualizer / rollup-plugin-visualizer / source-map-explorer 都行，
确认 Zustand 占 ~1 KB、未引用的 middleware 已被 tree-shake。

补充：
- E2E 测试用 store API 注入状态（playwright + window.useStore.setState）
- 监控：sentry / datadog 把 store 当 context 一起上报
- 性能：useStore 高频组件用 useShallow + 细粒度 selector
-->

---
transition: fade-out
---

# 学习路径

从入门到精通的资源地图

<v-click>

**官方资源** —— [文档](https://zustand.docs.pmnd.rs/) / [GitHub](https://github.com/pmndrs/zustand) / [Poimandres](https://pmnd.rs/)

</v-click>

<v-click>

**生态插件**

- [zundo](https://github.com/charkour/zundo) — undo/redo
- [zustand-x](https://github.com/udecode/zustand-x) — auto selector + slice helper
- [zustand-querystring](https://www.npmjs.com/package/zustand-querystring) — URL 同步
- [zustand-computed](https://www.npmjs.com/package/zustand-computed) — computed 属性

</v-click>

<v-click>

**实战参考** —— [Excalidraw](https://github.com/excalidraw/excalidraw) / [R3F](https://github.com/pmndrs/react-three-fiber) / 《Micro State Management with React Hooks》

</v-click>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Zustand 学习路径推荐：

1. 官方文档先看一遍 —— 比 Redux 文档短得多，2 小时能过完核心
2. 跟着写一个 Todo / Cart 项目 —— create + selector + persist + immer 都用上
3. 阅读《Micro State Management》—— 作者 Daishi Kato 系统讲解状态管理设计
4. 读 Zustand 源码（不到 1000 行）—— 理解 useSyncExternalStore + middleware 洋葱模型

[click] 生态插件按需选用：
- zundo：所有需要 undo 的应用必装（编辑器、表单流程）
- zustand-x：team 想统一 selector 规范时用
- zustand-computed：习惯 Vue computed / MobX computed 的人会爱
- zustand-querystring：搜索 / 筛选场景必备
- zustand-persist-storage：超过 localStorage 5MB 上限时（图片缓存等）

[click] 实战参考：
- Excalidraw 是公认的 Zustand 大型实战范本，画板状态、撤销栈、协作同步都很值得学
- R3F（React Three Fiber）是同团队产品，Zustand 用法最纯正
- Daishi Kato 的书是「状态管理设计原理」级别的内容，强推

[click] 学习节奏建议：
- 第 1 周：把官方文档刷完，写一个 Todo
- 第 2 周：上 immer + persist + devtools，写一个 Cart
- 第 3 周：上 slices + vanilla + Provider，写一个 SSR demo
- 第 4 周：读源码 + 写一个自定义 middleware

一个月时间能从入门到能 hold 住中大型项目。
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 🐻

Zustand — Small, Fast, Scalable State Management

<div class="mt-6">

**核心心智**

- 函数即 store / selector 必传 / 多字段配 useShallow
- middleware 洋葱模型 / SSR 用 store-per-request

</div>

<div class="mt-8 flex justify-center gap-6">
  <a href="https://zustand.docs.pmnd.rs/" target="_blank" class="slidev-icon-btn">📖 官方文档</a>
  <a href="https://github.com/pmndrs/zustand" target="_blank" class="slidev-icon-btn"><carbon:logo-github /> GitHub</a>
</div>

<style>
h1 {
  background-color: #FFB347;
  background-image: linear-gradient(45deg, #FFB347 10%, #8B4513 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：Zustand = React 时代的 "1 KB Pinia" —— 函数即 store，hook 即订阅，没有 Provider 嵌套。

核心心智五条：
1. create + selector 是基本姿势，不传 selector 等于性能自杀
2. 多字段配 useShallow 或拆多次 useStore，避免新引用陷阱
3. middleware 按需组合，洋葱顺序：devtools → persist → immer
4. immer 解决嵌套更新地狱；persist 解决持久化；devtools 解决调试
5. SSR 是 Zustand 唯一推荐用 Provider 的场景，store-per-request 不可少

下一步建议：跟着官方文档实战一个 Cart 项目，把今天讲的所有 API 用一遍 ——
那时再回头看 Redux 项目，就能体会到 Zustand 的极简哲学有多舒服。

最后留一句话：Zustand 不是为了取代 Redux，而是给「不需要那么严格」的项目一个轻量选择。
中小项目 + 个人项目 → Zustand 几乎是最优解。
大型团队 + 严格架构 → Redux Toolkit 仍是首选。

感谢观看！🐻
-->
