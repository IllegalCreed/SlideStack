---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Jotai
info: |
  Presentation Jotai for developers.

  Learn more at [https://jotai.org/](https://jotai.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-9xl">⚛️</span>
</div>

<br/>

## Jotai — Primitive and Flexible State Management

atom-based 原子化状态管理，~3KB 极致轻量，Poimandres 团队出品（最新 v2.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Jotai —— React 生态里「原子化」状态管理的代表作。

Jotai 是日语「状态」（じょうたい）的意思，由 Daishi Kato（加藤大史）创建，
和 Zustand 是同一作者、同一团队（Poimandres / pmndrs）。

如果说 Zustand 是「单一 store」哲学，那 Jotai 就是「多原子 atom」哲学。
颗粒度做到 React useState 级别 —— 每个状态都是独立的 atom，
派生关系自动追踪，订阅自动精确到字段级。

最新主线 v2.x，包体积约 3 KB（gzipped），是 Recoil 被 Meta archive 之后
社区公认的接替者，且 API 更简洁、依赖更轻。

下面按「定位 → 第一个 atom → 派生 → 异步 → Provider → utils → SSR → 生态对比 → 踩坑」的顺序展开。
-->

---
transition: fade-out
---

# 什么是 Jotai？

为 React 应用提供原子化（atomic）状态管理的极简库

<v-click>

- **原子化**：每个状态是独立的 atom，组件按需订阅
- **极致轻量**：~3 KB gzipped，核心 API 只有一个 atom 函数
- **bottom-up**：从最小 atom 组合派生，对应 Redux/Zustand 的 top-down 单 store
- **派生自动追踪**：read 函数里 get(otherAtom) 自动建立依赖图
- **异步友好**：atom 内可直接 async / await，与 Suspense 深度集成
- **TypeScript 优先**：atom(0) 自动推导出 PrimitiveAtom&lt;number&gt;
- **无 Provider 默认可用**：单页应用直接 import 即用，多 store 才需 Provider

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Jotai Introduction_](https://jotai.org/docs/introduction)

</div>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Jotai 的核心定位是「原子化的 React 状态管理库」。

设计目标三句话讲清：
- 把全局状态拆成最小颗粒（atom），每个 atom 像一个 useState
- 派生关系自动追踪 —— 不用手写 selector，read 函数里 get() 哪个就依赖哪个
- 异步天然支持 —— atom 的 read 可以 async，组件直接拿 Promise 用，Suspense 帮你接住

bottom-up 是 Jotai 最大的设计哲学：
- Redux / Zustand：从顶层一个大 store 开始切分（top-down）
- Jotai / Recoil：从最小 atom 开始组合派生（bottom-up）

这种哲学的好处：组件依赖什么 atom 就 import 什么，没有任何额外结构开销。
唯一的代价：项目里 atom 数量会比 Zustand 的 store 字段数多很多，需要文件组织规范。
-->

---
transition: fade-out
---

# Jotai 的定位与生态

为什么 Recoil 被 archive 之后大家纷纷迁移到 Jotai？

<v-click>

| 维度       | Jotai 2           | Recoil             | Zustand 5        | Redux Toolkit |
| ---------- | ----------------- | ------------------ | ---------------- | ------------- |
| API 风格   | **atom 原子化**   | atom + selector    | hook + flux      | Slice + Hook  |
| Provider   | 可选              | 必需               | 无需             | 需要          |
| 包体积     | **~3 KB**         | ~22 KB             | ~1 KB            | ~10 KB        |
| 异步       | **atom 内 async** | selector 内 async  | 手动 action      | RTK Query     |
| 维护状态   | **活跃 v2.20+**   | **已 archive**     | 活跃 v5          | 活跃 v2       |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Jotai Comparison_](https://jotai.org/docs/basics/comparison)

</div>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比五大状态库，Jotai 的护城河在哪里？

最直接的事实：Recoil 2024 年被 Meta 正式 archive，
社区想找一个「原子化 + 派生 + Suspense」的接替方案 → 唯一选择是 Jotai。

Jotai 比 Recoil 强在哪：
- 体积：3 KB vs 22 KB
- 不需要 string key（Jotai 用 atom 对象引用 identity，Recoil 用 string）
- API 更简洁，没有 Recoil 的 selectorFamily / atomFamily / waitForAll 等复杂概念
- 活跃维护，1.7K commit、20K+ star

和 Zustand 对比：同作者，但哲学相反。
- Zustand 单 store 适合「应用级状态」（user、theme、cart 这种）
- Jotai 多 atom 适合「组件级状态 + 派生计算」（form、filter、UI 状态）
- 实际项目两者甚至可以混用 —— Zustand 管全局，Jotai 管局部派生

和 Redux Toolkit 对比：完全不同的范式。
- RTK 是「结构化 + 严格规范」（slice + reducer + selector + thunk）
- Jotai 是「灵活 + 自由组合」（一个 atom 函数走天下）
- 大型团队 + 严格架构 → RTK；中小项目 + React 心智优先 → Jotai
-->

---
transition: fade-out
---

# Poimandres 团队与生态

一个团队，半个 React 状态管理生态

<v-click>

**Poimandres（pmndrs）核心库一览**

| 库          | 定位                  | 哲学               |
| ----------- | --------------------- | ------------------ |
| **Jotai**   | 原子状态              | atom 派生 + 订阅   |
| **Zustand** | 全局 store            | hooks-only flux    |
| **Valtio**  | mutable proxy         | 直接 state.x = y   |
| **R3F**     | React Three Fiber 3D  | 声明式 Three.js    |

</v-click>

<v-click>

**Daishi Kato 的「状态三剑客」**：Jotai（多 atom 自动派生）/ Zustand（单 store hook 订阅）/ Valtio（proxy mutable）—— 同作者，三种范式覆盖不同场景。

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Poimandres 团队是 React 生态里非常独特的存在 ——
他们的库都「一专多能」，每个库都极小但都能扛大型项目。

Daishi Kato（加藤大史）同时是 Jotai / Zustand / Valtio 的核心维护者，
著有《Micro State Management with React Hooks》（中文版《React Hooks 微观状态管理》）。
他在书中系统讲解了三种状态管理哲学的差异 —— 这本书是 Jotai 学习的最佳伴读。

[click] 三种状态哲学共存是 Poimandres 的有趣之处：
- Jotai「原子」适合大量独立小状态（每个 input、每个 toggle、每个派生计算）
- Zustand「单店」适合应用级全局状态（用户、主题、购物车）
- Valtio「proxy」适合需要 mutable 写法的场景（游戏、复杂表单）

R3F 是 3D 渲染天花板，Three.js 的声明式 React 封装，
游戏、数据可视化、Web 3D 应用都在用，内部状态正是 Zustand 实现。

为什么同一个团队做三个状态库？
作者的观点：没有银弹，不同场景需要不同的状态原语。
强行用一个范式覆盖所有场景，反而会让代码变扭曲。
-->

---
transition: fade-out
---

# Jotai 的核心理念

五个设计哲学贯穿全部 API

<v-click>

**1. 一切皆 atom**

`atom(initialValue)` 是唯一的 API。primitive、derived、async、write-only 全用 atom 函数创建。

</v-click>

<v-click>

**2. 引用即身份**

atom 用对象引用（不是字符串 key）作为唯一标识。多次调用 atom(0) 是三个不同的 atom。

</v-click>

<v-click>

**3. 派生自动追踪**

read 函数里 `get(otherAtom)` 自动建立依赖。源 atom 变化，所有派生 atom 自动重算。

</v-click>

<v-click>

**4. 异步天然支持**

atom 的 read 可以 async，组件用 useAtomValue 直接拿值，Promise 由 React Suspense 接住。

</v-click>

<v-click>

**5. 默认无 Provider**

provider-less 模式自动启用全局 default store。多树隔离时再用 Provider + createStore。

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 一切皆 atom —— Jotai 的核心 API 只有一个 atom 函数，
重载签名根据参数自动判定是 primitive / read-only / write-only / read-write。
没有 createSlice / createStore / makeAutoObservable 这种额外概念。

[click] 引用即身份是 Jotai 和 Recoil 最大的区别 ——
Recoil 用 string key 区分 atom（key: 'count' 不能重复），
Jotai 用 atom 对象的引用区分（同一个 atom 实例就是同一个状态）。
这意味着：
- 不需要担心 key 冲突
- 不需要为每个 atom 起字符串名字
- 但调试时需要手动设 debugLabel（后面讲）

[click] 派生自动追踪是「原子化」的关键 ——
你不用手写 selector / reselect / memo，
read 函数里 get 哪个 atom，就自动订阅哪个 atom。
get(userAtom).name 这种链式访问也能正确追踪。

[click] 异步天然支持 ——
其他库需要在 action 里 await fetch 再 setState，
Jotai 直接在 atom 的 read 函数里 async / await，
组件 useAtomValue 自动拿 resolved 值，Suspense 接管 loading。

[click] 默认无 Provider 是 v2 的重要改进 ——
v1 时代 Recoil-like 强制 RecoilRoot 包裹，
Jotai v2 默认全局 default store，写 demo / 单页应用直接 import 就能用。
只有需要多 store 隔离（SSR / 多租户 / micro-frontend）时才用 Provider。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与初始化

3 行代码接入任意 React 项目

::left::

<v-click>

**安装**

```bash
pnpm add jotai
# 或
npm install jotai
```

| 版本   | React 兼容    | 状态                 |
| ------ | ------------- | -------------------- |
| v2.x   | React 18+     | **当前主线**         |
| v1.x   | React 16.8+   | 维护，建议升 v2      |
| v0.x   | 已废弃        | 不推荐               |

</v-click>

::right::

<v-click>

**最小可运行示例**

```ts
// atoms/counter.ts
import { atom } from "jotai";

// 创建一个 primitive atom，初始值 0
export const countAtom = atom(0);
```

```tsx
// Counter.tsx
import { useAtom } from "jotai";
import { countAtom } from "./atoms/counter";

export function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

无需 Provider，直接 import 即可。

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Jotai 安装极简 —— 一个包，零 peer dependency（除了 react）。
v2.x 要求 React 18+（依赖 useSyncExternalStore），v1.x 兼容 React 16.8+。
新项目无脑 v2。

[click] 最小可运行示例只需要 3 步：
1. import { atom } from 'jotai'
2. 在模块顶层 atom(initialValue)
3. 组件里 useAtom(theAtom) 拿 [value, setValue]

useAtom 的返回值和 useState 完全一样：[state, setState]。
心智迁移成本几乎为零 —— 唯一区别是 atom 在组件外定义，可跨组件共享。

注意：atom() 必须在组件外、模块顶层调用。
绝对不要写在组件 render 里 —— 每次 render 会创建新的 atom 引用，
导致 useAtom 一直拿不到正确的状态（这是后面踩坑章节的 Top 1）。

第一段示例没有 Provider，没有 createContext，没有 store —— 这就是 Jotai 的极简哲学。
-->

---
transition: fade-out
---

# 第一个 atom：完整示例

primitive atom + setter 的两种用法

<v-click>

```ts
// atoms/counter.ts
import { atom } from "jotai";

export const countAtom = atom(0);                          // 数字
export const nameAtom = atom("Jotai");                     // 字符串
export const userAtom = atom({ id: 1, name: "Alice" });    // 对象（整体替换才触发更新）
export const todosAtom = atom<string[]>([]);               // 数组（空数组需显式类型）
```

```tsx
function CounterApp() {
  const [count, setCount] = useAtom(countAtom);

  // setter 两种用法
  const incDirect   = () => setCount(count + 1);        // 直接传新值
  const incUpdater  = () => setCount((c) => c + 1);     // updater 函数

  return <button onClick={incUpdater}>{count}</button>;
}
```

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] primitive atom 的 4 种典型形态：
- atom(0) → PrimitiveAtom&lt;number&gt;
- atom('Jotai') → PrimitiveAtom&lt;string&gt;
- atom({ id, name }) → PrimitiveAtom&lt;User&gt;
- atom&lt;string[]&gt;([]) → 显式类型，TS 推导 empty array 为 never[]

TS 推导规则：
- 有具体初始值 → 直接推导（atom(0) 推出 number）
- 空数组 / null / undefined → 必须显式 atom&lt;T&gt;(init)
- 联合类型 → atom&lt;User | null&gt;(null)

setter 两种用法：
- setCount(newValue) → 直接替换
- setCount((prev) => newValue) → 基于上一个值派生

注意「整体替换」语义 ——
对象 atom 修改字段必须 setUser({ ...user, name: 'Bob' })，
不能 user.name = 'Bob'（这样不会触发更新）。
嵌套对象的更新地狱用 jotai-immer 解决（后面讲）。

useAtom 返回的 tuple 命名约定：
- 通用：[value, setValue]
- 计数器：[count, setCount]
- 布尔：[isOpen, setIsOpen]
- 数组：[todos, setTodos]
-->

---
transition: fade-out
---

# useAtom / useAtomValue / useSetAtom

三个 hook 的正确使用场景

<v-click>

```tsx
import { useAtom, useAtomValue, useSetAtom } from "jotai";

// 1. useAtom —— 同时需要读和写时
function FullControl() {
  const [count, setCount] = useAtom(countAtom);  // [value, setter]
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// 2. useAtomValue —— 只读
function ReadOnly() {
  const count = useAtomValue(countAtom);          // 只拿 value
  return <h1>{count}</h1>;
}

// 3. useSetAtom —— 只写（不订阅 value，不会因 value 变化而重渲）
function WriteOnly() {
  const setCount = useSetAtom(countAtom);         // 只拿 setter
  return <button onClick={() => setCount((c) => c + 1)}>+1</button>;
}
```

</v-click>

<v-click>

**选择规则**：组件需要哪部分就用对应的 hook。**只写组件用 useSetAtom 是性能关键**。

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Jotai 用三个 hook 实现「读写分离」——
对比 useState 只有一个返回 tuple，Jotai 让你按需取用。

useAtom 等价于 [useAtomValue, useSetAtom] 的语法糖，
组件既订阅 value 又拿到 setter，value 变化会触发重渲。

useAtomValue 只订阅 value，没有 setter，value 变化触发重渲。

useSetAtom 只拿 setter，不订阅 value，
value 变化「不会」让此组件重渲 —— 这是性能优化关键。

[click] 选择规则：
- 计数器、表单组件 → useAtom（既读又写）
- 展示组件、Display → useAtomValue（只读）
- 按钮、Trigger → useSetAtom（只写）

经典场景：一个「+1」按钮组件
- ❌ useAtom 拿 [count, setCount]，count 变化时按钮也重渲（无意义）
- ✅ useSetAtom 只拿 setCount，按钮永远不会因 count 变化而重渲

这种「订阅粒度」优化在大型应用里很关键 ——
深层组件树里的按钮如果用错 hook，每次 state 变化都白白重渲一遍。

对比 Zustand：Zustand 必须传 selector 才能精确订阅，
Jotai 直接用 hook 区分订阅 vs 更新意图，更直观。
-->

---
transition: fade-out
---

# 派生 atom：基于其他 atom 计算

read 函数里 get(...) 自动建立依赖图

<v-click>

```ts
import { atom } from "jotai";

// 源 atom
export const priceAtom    = atom(100);
export const quantityAtom = atom(2);
export const taxRateAtom  = atom(0.1);

// 派生 atom：read 函数里 get(otherAtom) 自动建立依赖
export const subtotalAtom = atom((get) => get(priceAtom) * get(quantityAtom));

// 派生 atom 也可基于其他派生 atom
export const totalAtom = atom((get) => {
  const subtotal = get(subtotalAtom);
  return subtotal + subtotal * get(taxRateAtom);
});
```

</v-click>

<v-click>

```tsx
function Cart() {
  const total = useAtomValue(totalAtom);  // 自动拿到 (100 * 2) * 1.1 = 220
  return <h1>Total: ${total}</h1>;
}
```

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 派生 atom 是 Jotai 的核心特性 ——
对应 Vue 的 computed、Recoil 的 selector、Redux 的 reselect。

read 函数签名：(get) => value
- get(otherAtom) 读取另一个 atom 的当前值，并建立依赖
- 任何被 get 的 atom 变化，当前派生 atom 自动重算
- 重算结果被缓存，多个组件订阅时只计算一次

派生链条可以任意深 ——
priceAtom → subtotalAtom → totalAtom
源头 price 变化 → subtotal 重算 → total 重算，
中间没有变化的派生会保持原值（结构共享）。

[click] 组件订阅派生 atom 和订阅普通 atom 完全一样：
useAtomValue(totalAtom) 直接拿值。
不需要写 selector，不需要 useMemo。

派生 atom vs Zustand selector 的对比：
- Zustand：useStore(s => s.items.reduce(...)) —— 每次组件 render 都跑 reduce
- Jotai：派生 atom 全局只算一次，组件订阅结果

派生 atom vs useMemo：
- useMemo 是组件局部，每个组件重新算一次
- 派生 atom 是 store 级别，所有订阅者共享结果

性能心智：派生 atom 是「正确的全局派生」，应优先用它，
组件内的 useMemo 只在「派生依赖组件 prop」时才用。
-->

---
transition: fade-out
---

# write-only atom：封装写操作

只暴露 setter，不暴露 value

<v-click>

```ts
import { atom } from "jotai";

const countAtom = atom(0);

// write-only atom：第一参数 null，第二参数是 write 函数
// write 函数签名：(get, set, ...args) => Result
export const incrementAtom = atom(
  null,
  (get, set) => set(countAtom, get(countAtom) + 1),
);

// 接受参数的 write-only atom（write 函数也可是 async）
export const addByAtom = atom(
  null,
  (get, set, step: number) => set(countAtom, get(countAtom) + step),
);
```

</v-click>

<v-click>

```tsx
function Buttons() {
  const addBy = useSetAtom(addByAtom);
  return <button onClick={() => addBy(5)}>+5</button>;
}
```

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] write-only atom 是 Jotai 「action」的实现方式 ——
对应 Redux 的 action creator、Zustand store 的 action 方法。

签名特点：
- 第一参 read 始终返回 null（或固定值）
- 第二参 write 函数才是真正的「action 逻辑」
- write 接收 (get, set, ...args)：可以读多个 atom、写多个 atom、接受参数

为什么不直接在组件里写 setCount(get(otherAtom) + 1)？
- 封装：复杂业务逻辑集中在一个 atom 里
- 复用：多个组件可以 useSetAtom(incrementAtom) 共享同一逻辑
- 测试：可以单独测试 atom 的行为（不需要渲染组件）
- 异步：async write 自然集成，组件代码保持同步

[click] 组件使用 write-only atom 用 useSetAtom，
useAtom 也可以但会拿到 [null, setter]，没意义。

write 函数里的 get 是「非响应式」的 —— 
read 函数里 get 会建立依赖，write 函数里 get 只是「读一次当前值」，不订阅。
这一点很关键：write 是事件触发，不需要响应。

实战 pattern：
- 表单提交：write-only atom 收集多个字段 + 调 API
- 用户操作：addToCart、removeItem、login 等动作
- 派生写：写一个 atom 同时影响多个其他 atom（事务）
-->

---
transition: fade-out
---

# read-write atom：双向派生

既能读派生值，又能写回到源 atom

<v-click>

```ts
import { atom } from "jotai";

const celsiusAtom = atom(25);   // 源 atom：摄氏度

// 读写 atom：read 派生华氏度，write 反算回摄氏度
export const fahrenheitAtom = atom(
  (get) => get(celsiusAtom) * 1.8 + 32,
  (get, set, newFahrenheit: number) => {
    set(celsiusAtom, (newFahrenheit - 32) / 1.8);
  },
);
```

</v-click>

<v-click>

```tsx
function TempInput() {
  // 看起来像 useState，但底层是「读派生 + 写源」
  const [fahrenheit, setFahrenheit] = useAtom(fahrenheitAtom);
  return <input type="number" value={fahrenheit}
    onChange={(e) => setFahrenheit(Number(e.target.value))} />;
}
```

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] read-write atom 是「派生」的最强形态 ——
对应 Vue 的「可写 computed」、Recoil 的「writable selector」。

签名：atom(readFn, writeFn)
- read：(get) => derivedValue
- write：(get, set, ...args) => void

经典场景：单位换算
- 后端存摄氏度，UI 显示华氏度
- 用户在 UI 改华氏度，要写回摄氏度
- 如果只用派生 atom（read-only），就只能读不能写
- read-write atom 让 useAtom 表现得像 useState，UI 代码不感知底层换算

其他用例：
- 表单字段映射（display name → split first/last name）
- 单位换算（货币、长度、时间）
- 路由参数 ↔ atom 双向绑定（atomWithLocation）
- 排序 / 筛选规则的「显示形式」与「内部存储」分离

[click] UI 代码完全像普通 useState ——
useAtom(fahrenheitAtom) 返回 [value, setter]，
看不到底层是派生的、setter 实际改的是别的 atom。

这种抽象让组件保持「单一职责」 ——
组件只关心「UI 展示什么单位」，业务逻辑在 atom 层。
-->

---
transition: fade-out
---

# async atom：直接 async / await

异步状态的极简方案

<v-click>

```ts
import { atom } from "jotai";

export const userIdAtom = atom(1);

// async atom：read 函数可以是 async，返回 Promise
export const userAtom = atom(async (get) => {
  const res = await fetch(`/api/users/${get(userIdAtom)}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
});
```

</v-click>

<v-click>

```tsx
import { Suspense } from "react";

function UserProfile() {
  // Promise resolve 前自动抛给 Suspense
  const user = useAtomValue(userAtom);
  return <div>Welcome, {user.name}</div>;
}

// 使用：<Suspense fallback={<div>Loading...</div>}><UserProfile /></Suspense>
```

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] async atom 是 Jotai 比所有其他状态库都更优雅的地方 ——
其他库需要手动维护 loading / error / data 三个字段，
Jotai 把这一切交给 React Suspense + Error Boundary。

机制：
- atom 的 read 函数返回 Promise
- 组件 useAtomValue 读取时，Promise 未 resolve → 抛出 Promise
- React Suspense 接住这个抛出的 Promise，渲染 fallback
- Promise resolve 后 React 自动重新渲染组件

依赖追踪也是自动的 ——
userIdAtom 变化 → userAtom read 重新跑 → 新的 fetch → 新的 Promise → 再次 suspend → 重渲。

[click] Suspense 边界放在哪？
- 粒度小 → 每个数据卡片包一层 Suspense（瀑布式 loading）
- 粒度大 → 整页一个 Suspense（统一 loading 体验）

错误处理用 ErrorBoundary：
- atom 的 read 抛出错误 → ErrorBoundary 接住 → 渲染错误 UI

注意 abortSignal：
- v2 的 read 函数第二参可以拿到 { signal: AbortSignal }
- userIdAtom 快速切换时旧 fetch 自动 cancel
- fetch(url, { signal }) 配合使用

对比 React 18 的 use() hook：use() 也能拿 Promise，
但 Jotai 把「promise + 状态管理」整合在一起，比纯 use() 更结构化。
-->

---
transition: fade-out
---

# loadable：不用 Suspense 的方案

把 async 转成 { state, data, error } 对象

<v-click>

```ts
import { atom } from "jotai";
import { loadable } from "jotai/utils";

const userAtom = atom(async (get) => {
  const res = await fetch(`/api/users/${get(userIdAtom)}`);
  return res.json();
});

// loadable 包装后变成同步 atom
export const userLoadableAtom = loadable(userAtom);
```

</v-click>

<v-click>

```tsx
function UserProfile() {
  // 拿到 { state: 'loading' | 'hasData' | 'hasError' }
  const userLoadable = useAtomValue(userLoadableAtom);

  if (userLoadable.state === "loading") return <Spinner />;
  if (userLoadable.state === "hasError") return <ErrorMsg error={userLoadable.error} />;
  return <div>Welcome, {userLoadable.data.name}</div>;
}
// 不需要 Suspense / ErrorBoundary 包裹
```

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] loadable 是「不想用 Suspense」时的备选方案 ——
有些团队对 Suspense 心智不熟，或者项目里 ErrorBoundary 复杂，
loadable 把 async atom 包装成「同步 atom 输出对象」。

包装机制：
- loadable(asyncAtom) → 同步 atom，返回 { state, ... }
- state === 'loading' → 还在 pending
- state === 'hasData' → resolve 完成，.data 拿数据
- state === 'hasError' → reject，.error 拿错误

组件代码用 if-else 判断 state，
不需要 Suspense / ErrorBoundary 包裹。

[click] 何时用 loadable vs Suspense？

用 Suspense（推荐）：
- 项目已经用了 React 18 + Suspense（如 RSC、TanStack Query）
- 想要统一的 loading / error UI
- 嵌套 async 依赖（loading 串行）能自动展开

用 loadable：
- 想精细控制 loading UI（每个卡片独立 spinner）
- 不想引入 Error Boundary
- 配合「保留旧数据 + 后台刷新」的 UX 模式

性能：loadable 包装会多一次 atom 间转换，
高频更新场景略有开销，但通常可忽略。
-->

---
transition: fade-out
---

# unwrap：派生中使用 async atom

把 Promise 解包成同步值，便于派生

<v-click>

**问题：派生 atom 想用 async atom 的值**

```ts
const asyncUserAtom = atom(async () => fetch("/api/me").then(r => r.json()));

// ❌ v2 中 get(asyncUserAtom) 拿到 Promise，不能直接 .name
const greetingAtom = atom((get) => `Hello, ${get(asyncUserAtom).name}`);
//                                            ^^^ Promise<User>.name 报错
```

</v-click>

<v-click>

**解法：unwrap 提供 fallback**

```ts
import { unwrap } from "jotai/utils";

// 用 fallback 函数提供 pending 期间的默认值
const userOrEmptyAtom = unwrap(asyncUserAtom, (prev) => prev ?? { name: "Anonymous" });

const greetingAtom = atom((get) => {
  const user = get(userOrEmptyAtom);    // 同步拿到 User
  return `Hello, ${user.name}`;
});
```

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Jotai v2 的一个常见困惑 ——
v2 改了 get() 在派生中的语义：
- v1：get(asyncAtom) 自动 await，派生 atom 也变 async
- v2：get(asyncAtom) 拿到的是 Promise 对象本身，不会 await

v2 这样设计是为了让派生 atom 的同步/异步更显式，
减少「无心插柳变 async」的意外。

[click] unwrap 是 v2 的官方解法 ——
unwrap(asyncAtom, fallbackFn) 返回一个「同步」atom：
- 异步未完成时：返回 fallbackFn(prevValue)
- 异步完成后：返回 resolved 值
- prevValue 是「上一次同步值」，配合 fallback 可实现「保留旧值，后台刷新」

签名：unwrap&lt;V, F&gt;(atom, fallback?: (prev: F | undefined) => F)

典型 fallback 写法：
- (prev) => prev ?? defaultValue —— 没有旧值用默认
- (prev) => prev —— 只在异步完成后才更新派生
- 不传 fallback → undefined 期间会让派生变成 Promise（回到 v1 行为）

[click] 用法示例：
- 「上次的用户信息 + 后台刷新」：fallback 返回 prev
- 「加载中显示占位」：fallback 返回 { name: 'Loading...' }

对比 loadable：
- loadable 输出 { state, data }，组件侧判断
- unwrap 直接给同步值（fallback / 旧值），适合在派生 atom 内部用
-->

---
transition: fade-out
---

# Provider：多 store 隔离

默认是 default store，需要隔离时用 Provider

<v-click>

**默认 store（绝大多数场景够用）**：不写 Provider 时所有 atom 共享全局 default store。

</v-click>

<v-click>

**多 store 隔离（SSR / 多租户 / 测试）**

```tsx
import { Provider, createStore } from "jotai";

const storeA = createStore();
const storeB = createStore();

function App() {
  return (
    <>
      <Provider store={storeA}><TenantApp /></Provider>
      <Provider store={storeB}><TenantApp /></Provider>
    </>
  );
}
```

</v-click>

<v-click>

也可不传 store，仅用 `<Provider initialValues={[[countAtom, 100]]}>` 注入初始值，Provider 自动建独立 store。

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Jotai v2 默认无 Provider —— 这是和 Recoil / 老 Jotai v1 最大的区别。
不写 Provider 时，所有 atom 共享一个「default store」，
对单页应用、纯前端项目最方便。

[click] 何时需要 Provider + createStore？

场景 1：SSR 隔离
- 每个 request 一个独立 store，避免 user A 的数据泄露到 user B 的页面
- Next.js / Remix 必备

场景 2：多租户 / 子应用
- 同一页面内多个独立子树，各自维护状态
- micro-frontend、admin + preview 并排展示

场景 3：测试
- 每个测试用例一个 Provider + createStore，互不干扰
- 跨测试 state 污染问题彻底解决

场景 4：Storybook
- 每个 story 用 Provider 包一层，可以注入特定初始值
- 隔离 story 之间的状态

[click] Provider 的两种用法：
- store 属性：传入手动创建的 store（精细控制）
- initialValues：不传 store，Provider 自动创建独立 store，并设置初始值

createStore 的能力：
- store.get(atom) / store.set(atom, value)：在组件外读写
- store.sub(atom, listener)：订阅变化
- 测试 / 调试时极其方便
-->

---
transition: fade-out
---

# atomWithStorage：localStorage 持久化

key + initialValue，自动同步浏览器存储

<v-click>

```ts
import { atomWithStorage, createJSONStorage } from "jotai/utils";

// 1. 默认 localStorage
export const darkModeAtom = atomWithStorage("darkMode", false);

// 2. sessionStorage（关闭标签丢失）
const sess = createJSONStorage(() => sessionStorage);
export const draftAtom = atomWithStorage("draft", "", sess);

// 3. 自定义存储：createJSONStorage(() => myCustomStorageImpl)
```

</v-click>

<v-click>

**关键选项：getOnInit**

```ts
// 默认 getOnInit: false —— 初始用 initialValue，hydration 后才读 storage
// getOnInit: true —— 立即读 storage，避免初始闪烁
export const themeAtom = atomWithStorage("theme", "light", undefined, {
  getOnInit: true,
});
```

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] atomWithStorage 是 Jotai 持久化的标准方案 ——
对应 Zustand 的 persist middleware、Pinia 的 pinia-plugin-persistedstate。

API：atomWithStorage(key, initialValue, storage?, options?)
- key：localStorage 里的 key
- initialValue：默认值（storage 没有时用）
- storage：可选，默认 localStorage
- options：可选，{ getOnInit: boolean }

storage 是一个接口对象：
- getItem(key, initialValue) → Value | Promise&lt;Value&gt;
- setItem(key, value) → void | Promise
- removeItem(key) → void | Promise
- subscribe?(key, callback) → unsubscribe（跨 tab 同步）

createJSONStorage 是工厂函数 ——
传入一个 () => Storage 函数（懒求值，避免 SSR 报错），
返回包装好的 JSON 序列化存储对象。

[click] getOnInit 选项的含义：

false（默认）：
- 初始渲染：使用 initialValue
- useEffect 后：读 storage，触发 re-render
- 优点：SSR 友好（服务端没有 localStorage）
- 缺点：客户端有「闪烁」（深色模式先白后变黑）

true：
- 同步读 storage（仅 SPA / client-only 场景）
- 没有闪烁，但 SSR 会 hydration mismatch

SPA 项目 → getOnInit: true
SSR / Next.js → 默认 false，或者用 useHydrateAtoms

跨 tab 同步：默认监听 storage 事件，A tab 改 → B tab 自动更新。
-->

---
transition: fade-out
---

# atomWithReset + RESET：重置语义

resettable atom 与统一的重置符号

<v-click>

```ts
import { atomWithReset, useResetAtom, RESET } from "jotai/utils";

// atomWithReset 创建可重置的 atom
export const formAtom = atomWithReset({ name: "", email: "", bio: "" });
```

</v-click>

<v-click>

```tsx
function FormResetButton() {
  // 方式 A：useResetAtom（最简单）
  const resetForm = useResetAtom(formAtom);
  return <button onClick={resetForm}>Reset</button>;
}

function FormResetButtonV2() {
  // 方式 B：useSetAtom + RESET symbol（更灵活）
  const setForm = useSetAtom(formAtom);
  return <button onClick={() => setForm(RESET)}>Reset</button>;
}
```

</v-click>

<v-click>

派生 atom 也可转发 RESET：`write` 函数判断 `update === RESET` → 转发到源 atom，整套表单一键重置。

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] atomWithReset 是 Jotai 的「重置语义」标准化 ——
普通 atom 想重置只能手动记 initialValue 然后 setAtom(initial)，
atomWithReset 把这件事内建。

RESET 是一个 unique symbol，专门用作「重置信号」：
- setAtom(RESET) 等价于「回到初始值」
- 类型签名里允许 RESET 作为 setter 的参数

[click] 使用方式：
- useResetAtom(atom) → 拿到一个 () => void 函数，直接调即可
- useSetAtom + RESET → 显式传 RESET，可以混在条件分支里

为什么需要这个 API 而不直接 setAtom(initialValue)？
- 初始值可能在 atom 定义里，组件不该重复硬编码
- RESET 是「显式意图声明」—— 看到 RESET 就知道是「恢复初始态」
- 派生 atom 可以拦截 RESET，做联动重置（重置 form 同时清空 errors）

[click] 派生 atom 转发 RESET 是高级用法 ——
当你写一个「读写派生 atom」时，
write 函数可以判断 update === RESET 来转发重置到源 atom。
这让 RESET 的语义跨 atom 链传递，整套表单可以一键重置。

实战场景：
- 表单重置（form + errors + touched 同时清零）
- 筛选器重置（filters + page + sort 一键恢复）
- 多步骤 wizard 退出（每个 step 的 atom 都需要重置）
-->

---
transition: fade-out
---

# atomFamily：参数化 atom

按 key 动态创建一族 atom，自动缓存

<v-click>

```ts
import { atomFamily } from "jotai/utils";

// 一个 todoFamily 管理任意 id 的 todo atom
export const todoAtomFamily = atomFamily((id: number) =>
  atom({ id, text: "", done: false }),
);

// 同一 param 返回同一 atom 引用（缓存）
const todo1Atom = todoAtomFamily(1);
console.log(todoAtomFamily(1) === todo1Atom); // true
```

</v-click>

<v-click>

```tsx
function TodoItem({ id }: { id: number }) {
  const [todo, setTodo] = useAtom(todoAtomFamily(id));  // 按 id 订阅
  return <input value={todo.text} onChange={e => setTodo({ ...todo, text: e.target.value })} />;
}
```

</v-click>

<v-click>

**清理避免泄漏**：`family.remove(1)` 删单个；或 `family.setShouldRemove((createdAt, param) => Date.now() - createdAt > 60_000)` 自动 LRU。

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] atomFamily 是 Jotai 对应 Recoil atomFamily 的实现 ——
当你需要「同一种结构、不同 key」的 atom 时用它。

API：atomFamily(initializeAtom, areEqual?)
- initializeAtom：(param) => Atom，按 param 创建新 atom
- areEqual：(a, b) => boolean，自定义 param 相等性比较（默认 Object.is）

核心特性：
- 同一个 param 多次调用返回同一个 atom 引用（缓存）
- 不同 param 返回不同 atom 实例
- 引用稳定 → useAtom 不会因为重渲创建新 atom

[click] 经典使用场景：
- 列表项：todoAtomFamily(id) 让每个 todo 独立订阅
- 用户卡片：userAtomFamily(userId) 拉取并缓存用户数据
- 表单字段：fieldAtomFamily(name) 每个 input 独立 atom
- 路由参数：根据 :id 动态创建详情页 atom

[click] 内存管理是 atomFamily 的隐患 ——
Map 内部累积所有用过的 param，
SPA 长时间运行可能积累大量无用 atom（比如浏览过的所有商品详情）。

清理三种方式：
1. family.remove(param) → 手动删除单个
2. family.setShouldRemove(predicate) → 设置自动清理策略
   - predicate(createdAt, param) → 返回 true 表示删除
   - 适合 LRU、超时清理
3. family.getParams() → 获取所有缓存的 param（调试用）

⚠️ 注意：官方文档提到 atomFamily 在 v3 会迁移到 jotai-family 独立包。
现阶段 v2 直接 from 'jotai/utils' 即可，但写新代码可以留意未来路径变化。
-->

---
transition: fade-out
---

# atomWithDefault + atomWithLazy

延迟初始化和默认值派生

<v-click>

**atomWithDefault：基于其他 atom 派生默认值，可被覆盖**

```ts
import { atomWithDefault } from "jotai/utils";

// 默认值跟随 user.theme，但用户可单独覆盖
export const themeAtom = atomWithDefault((get) => get(userAtom).theme);

setTheme("light");  // 脱离派生，独立存储
// 重置回派生：setTheme(RESET)
```

</v-click>

<v-click>

**atomWithLazy：延迟初始化（仅 v2.10+）**

```ts
import { atomWithLazy } from "jotai/utils";

// 只在第一次访问时计算初始值
export const heavyAtom = atomWithLazy(() => {
  console.log("computing once...");
  return expensiveInitialization();  // 路由切换才跑
});
```

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] atomWithDefault 解决「默认值想派生，但用户可以覆盖」的场景 ——

例子：
- 用户偏好 theme 默认跟随系统 prefers-color-scheme
- 但用户在 UI 切换后，应该保持自己的选择，不再跟随系统
- 系统主题变化时，已覆盖的用户不受影响

普通派生 atom 做不到这点 —— 派生 atom 是只读的，
而且每次源变化派生也跟着变（无法「定住」用户选择）。

atomWithDefault：
- 初始值通过函数派生（响应源 atom）
- 一旦 setAtom 写入，就脱离派生，独立存储
- 想恢复派生 → setAtom(RESET)

[click] atomWithLazy 是 v2.10 引入的延迟初始化工具 ——

普通 atom(initialValue) 在模块加载时就求值，
如果 initialValue 是个很贵的计算（解析大 JSON、初始化 WebGL context），
这个开销会在每次进入页面都发生，即使用户没访问该 atom。

atomWithLazy(initFn) 把这个开销推迟到「第一次被 get」时：
- atom 创建时不跑 initFn
- 首次 useAtom / get(thisAtom) 时跑一次
- 之后行为和普通 atom 一致

典型用例：
- 路由懒加载场景的初始 state
- WebGL / Canvas 上下文（只在编辑器路由初始化）
- 解析大量 JSON（如 i18n 资源）

注意：store 重建时（如 logout）initFn 会重跑，
这一点和 atom() 的「模块级单次执行」不同。
-->

---
transition: fade-out
---

# DevTools 集成

React DevTools 自动支持 + jotai-devtools 进阶

<v-click>

**1. debugLabel**：用 `@swc-jotai/debug-label` 自动给所有 atom 加 label（变量名）。

```ts
const countAtom = atom(0);
countAtom.debugLabel = "count";   // 手动写法
```

</v-click>

<v-click>

**2. React DevTools 集成**

```tsx
import { useAtomsDebugValue } from "jotai-devtools/utils";

function DebugAtoms() {
  useAtomsDebugValue();  // 在 React DevTools 显示所有 atom
  return null;
}
```

</v-click>

<v-click>

**3. 浏览器 DevTools 面板**：`pnpm add jotai-devtools` 后挂载 `<DevTools />`，右下角浮窗支持 time-travel + state tree。

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] debugLabel 是 Jotai 调试的基石 ——
没有 label 时 atom 在 DevTools 里显示 "atom1" / "atom2"，根本看不出谁是谁。

手动加 debugLabel 太繁琐 —— SWC / Babel plugin 自动化：
- @swc-jotai/debug-label（Vite / Next.js）
- jotai/babel/plugin-debug-label（CRA）

配置后 const countAtom = atom(0) 自动等价于：
const countAtom = atom(0); countAtom.debugLabel = 'countAtom';
开发体验拉满，0 维护成本。

[click] useAtomsDebugValue 是 React DevTools 的集成 ——
内部用 React 的 useDebugValue API，
让所有挂载的 atom 出现在 DevTools Components 面板的 hooks 列表。

放在 App 根附近即可（确保所有 atom 被遍历到）。

[click] jotai-devtools 是独立的浏览器调试面板 ——

功能：
- 实时 state tree 展示（atom 名 + 当前值 + 依赖关系图）
- Time-travel：回到任意历史 state
- 手动 dispatch：修改任意 atom 的值
- Atom 详情：debugLabel、依赖、订阅者数量

生产环境会自动 tree-shake 掉 DevTools 组件，无需手动 if (DEV) 判断。
但建议显式用 import.meta.env.DEV 防御性包裹。

对比 Redux DevTools 集成：
- jotai-devtools 是 Jotai 专属面板
- 如果想用 Redux DevTools，可以用 useAtomDevtools hook（旧版兼容）
-->

---
transition: fade-out
---

# SSR / Next.js：useHydrateAtoms

服务端拉数据 → 客户端 hydrate 到 atom

<v-click>

**服务端组件传数据 → 客户端 hydrate**

```tsx
// Server Component (Next.js App Router)
async function UsersPage() {
  const users = await fetchUsersFromDB();
  return <UsersHydrate users={users} />;
}

// "use client" 组件
import { useHydrateAtoms } from "jotai/utils";
export function UsersHydrate({ users }: { users: User[] }) {
  useHydrateAtoms([[usersAtom, users]]);   // 仅首次有效
  return <UserList />;
}
```

</v-click>

<v-click>

**SSR 必备：Provider + createStore（每个请求独立 store，避免泄露）**

```tsx
// app/layout.tsx ("use client")
const store = useMemo(() => createStore(), []);
return <Provider store={store}>{children}</Provider>;
```

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] SSR 项目（Next.js / Remix / Waku）必须解决两个问题：
1. 服务端的 atom 状态如何传到客户端？→ useHydrateAtoms
2. 多请求并发时如何避免 atom 互相污染？→ Provider + createStore

useHydrateAtoms 签名：useHydrateAtoms([[atom, value], ...])
- 接收 atom + value 的 pair 数组
- 仅第一次渲染时生效，后续 setValue 才能改变
- 必须配合 'use client'（不能在 server component 里用）

[click] 数据流：
1. Server Component 拉数据（fetch / DB）
2. 数据作为 props 传给 Client Component
3. Client Component 用 useHydrateAtoms 把 props 注入 atom
4. 同页面其他组件 useAtomValue(usersAtom) 拿到值

为什么不直接传 props？
- 数据需要全局共享（多个无关组件都用）
- 后续可能 setAtom 修改（用户操作）
- 派生 atom 自动响应

[click] Provider + createStore 必须用 useMemo / useRef 缓存 ——
直接 createStore() 写在组件 body 里，每次 re-render 都新 store，
所有 atom 状态丢失，等于没用。

Next.js App Router 完整模板：
- layout.tsx 用 Client Component 包 Provider
- store 用 useMemo(() => createStore(), [])
- 每个请求一个独立 store，互不污染

注意：useHydrateAtoms 只 hydrate「初始 prop 值」——
prop 变化时 atom 不会更新。如果需要响应 prop 变化，
要写个 useEffect 手动 setAtom。
-->

---
transition: fade-out
---

# TypeScript：atom 类型推导

primitive / derived / write-only 的泛型签名

<v-click>

```ts
import { atom, type PrimitiveAtom, type Atom, type WritableAtom } from "jotai";

// 1. primitive：自动推导
const numAtom = atom(0);                                    // PrimitiveAtom<number>

// 2. 空数组 / null 需要显式
const todosAtom = atom<string[]>([]);                       // PrimitiveAtom<string[]>
const userAtom  = atom<User | null>(null);                  // PrimitiveAtom<User | null>

// 3. 派生只读：read 返回值即类型
const doubleAtom = atom((get) => get(numAtom) * 2);         // Atom<number>

// 4. write-only：WritableAtom<null, [step: number], void>
const addAtom = atom(null, (get, set, step: number) => set(numAtom, get(numAtom) + step));
```

</v-click>

<v-click>

**ExtractAtomValue：从 atom 取出值类型**

```ts
import type { ExtractAtomValue } from "jotai";
type UserValue = ExtractAtomValue<typeof userAtom>;  // User | null
```

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Jotai 的 TS 推导非常自然 —— 几乎不需要手写泛型。

类型层级：
- Atom&lt;Value&gt; → 只读 atom（派生 read-only）
- WritableAtom&lt;Value, Args, Result&gt; → 可写 atom（primitive / write-only / read-write）
- PrimitiveAtom&lt;Value&gt; → WritableAtom 的特化（args 是 [SetStateAction&lt;Value&gt;]）

推导规则：
- atom(initialValue) → 根据 initialValue 推 Value
- 派生只读：read 函数返回值类型即 Value
- 写函数的 args 类型来自 write 函数的剩余参数
- write 返回值类型作为 Result（一般是 void，async 是 Promise&lt;void&gt;）

常见踩坑：
- atom([]) 推成 never[]，需要 atom&lt;string[]&gt;([])
- atom(null) 推成 null，需要 atom&lt;User | null&gt;(null)
- atom({}) 推成 {}，需要 atom&lt;Partial&lt;User&gt;&gt;({})

[click] ExtractAtomValue 用于从 atom 类型反查 Value ——

场景：
- 写一个 generic hook：useAtomLog&lt;A extends Atom&lt;unknown&gt;&gt;(a: A) =&gt; ExtractAtomValue&lt;A&gt;
- 工具函数：log(atom): logger 应当知道 atom 的值类型
- 工厂模式：根据 atom 类型生成对应的表单组件

其他类型工具：
- ExtractAtomArgs&lt;Atom&gt; → 取 write 函数的 args 类型
- ExtractAtomResult&lt;Atom&gt; → 取 write 函数的返回类型
- SetStateAction&lt;T&gt; → 标准 React 类型，T | ((prev: T) => T)

要求：tsconfig 必须开 strictNullChecks，Jotai 大量依赖此特性做推导。
-->

---
transition: fade-out
---

# jotai-immer：mutable 写法

嵌套对象更新的救星

<v-click>

**❌ 不用 immer：嵌套 spread 地狱**

```ts
setCity((u) => ({
  ...u,
  profile: { ...u.profile, address: { ...u.profile.address, city: "Shanghai" } },
}));
```

</v-click>

<v-click>

**✅ atomWithImmer：直接 draft 赋值**

```ts
import { atomWithImmer } from "jotai-immer";

export const userAtom = atomWithImmer({ name: "", profile: { address: { city: "" } } });
```

```tsx
const setUser = useSetAtom(userAtom);
setUser((draft) => {
  draft.profile.address.city = "Shanghai";  // 直接 mutable，immer 帮你转 immutable
});
```

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 嵌套对象更新是 React 永恒痛点 ——
深度 3+ 的对象 spread 写起来又长又容易出错。

[click] jotai-immer 提供三种集成方式：

1. atomWithImmer(initialValue) → 创建一个 setter 接受 draft 函数的 atom
2. withImmer(atom) → 把现有 atom 转成 immer 风格
3. useImmerAtom(atom) → hook 层包裹，组件内决定是否用 immer

推荐：直接用 atomWithImmer 创建 atom，
比 useImmerAtom 更类型友好、性能更好。

依赖：
- pnpm add immer jotai-immer
- 不需要其他配置

immer 原理回顾：
- setter 接 (draft) => void
- draft 是 Proxy 包裹的原对象
- 任何 draft.x = y 被 Proxy 拦截，记录变更
- produce 结束时生成新对象（未修改部分保持原引用，结构共享）

性能：
- 中等深度（3-5 层）immer 比手写 spread 快（结构共享 + 跳过未变更子树）
- 超大数据（10MB+）immer 略慢（Proxy 开销）
- 一般业务场景无需担心

注意 immer 几个坑：
- draft 上 return 等于「完全替换」（一般不要 return）
- 数组 push / splice / pop 都支持，不需要 spread
- Map / Set 需要 enableMapSet() 开启
- 类实例需要 immerable 标记

对比 Zustand 的 immer middleware：
- Jotai 的 jotai-immer 在「atom 粒度」选择性使用
- Zustand 的 immer middleware 是整个 store 一刀切

灵活性 Jotai 略胜，但需要逐 atom 决定要不要用 immer。
-->

---
transition: fade-out
---

# 生态扩展：jotai-* 全家桶

按需安装的扩展包矩阵

<v-click>

| 包                       | 典型场景                  |
| ------------------------ | ------------------------- |
| **jotai-immer**          | 深层嵌套对象更新          |
| **jotai-tanstack-query** | 服务端状态 + 客户端 atom  |
| **jotai-effect**         | onMount 监听 / 自动同步   |
| **jotai-xstate**         | 复杂流程 / wizard         |
| **jotai-location**       | URL ↔ atom 双向同步       |
| **jotai-history**        | undo / redo               |

</v-click>

<v-click>

**Recipes 文档**：atomWithToggle / atomWithDebounce / atomWithRefresh 等小工具，复制粘贴即用。

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Jotai 的扩展生态非常丰富，且都遵循「按需安装」原则。

核心库 jotai 只有 3 KB，每个扩展都是独立包：
- 用什么装什么
- 不用的扩展完全 tree-shake 掉
- 这种「微包」哲学和 Lodash / VueUse 一致

[click] 各扩展的具体场景：

jotai-tanstack-query：
- 服务端状态用 TanStack Query 管，客户端状态用 Jotai 管
- atomWithQuery / atomWithMutation 让两者无缝桥接
- 比单用 Jotai async atom 多了 cache / refetch / pagination 等能力

jotai-effect：
- 让 atom 在 mount 时跑副作用（订阅 WebSocket、注册 listener）
- onMount 是核心：mount 时跑、unmount 时清理

jotai-xstate：
- 复杂 wizard / 表单流程用状态机表达
- atomWithMachine 把 XState 状态机包装成 atom
- 状态机 + 派生 atom = 表达力极强的复杂状态

jotai-location：
- URL query string 双向绑定到 atom
- 用户筛选「商品 + 价格 + 排序」自动同步到 URL
- 刷新页面 / 分享链接保留状态

jotai-cache：
- 派生 atom 默认每次依赖变化都重算
- jotai-cache 提供 LRU 缓存策略
- 适合「同样的输入反复出现」的场景（虚拟列表）

[click] Recipes 是社区维护的「代码片段库」——
不是独立包，是文档里的「拿来即用代码」。

典型 recipes：
- atomWithToggle：boolean 翻转，setAtom() 直接 flip
- atomWithDebounce：写入时 debounce
- atomWithRefresh：手动触发 async atom 重新拉取
- atomWithListeners：监听 atom 变化跑回调

复制到项目即可，不需要安装额外包。
-->

---
transition: fade-out
---

# 完整实战：购物车 Store

primitive + derived + write + persist 全部用上

<v-click>

```ts
// atoms/cart.ts
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type CartItem = { id: number; name: string; price: number; qty: number };

// 1. 持久化 / 2. 派生：总数量 / 总价
export const cartItemsAtom = atomWithStorage<CartItem[]>("cart", []);
export const cartCountAtom = atom((get) => get(cartItemsAtom).reduce((s, i) => s + i.qty, 0));
export const cartTotalAtom = atom((get) => get(cartItemsAtom).reduce((s, i) => s + i.price * i.qty, 0));

// 3. write-only：添加 / 清空
export const addItemAtom = atom(null, (get, set, item: Omit<CartItem, "qty">) => {
  const items = get(cartItemsAtom);
  const existing = items.find((i) => i.id === item.id);
  set(cartItemsAtom, existing
    ? items.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
    : [...items, { ...item, qty: 1 }]);
});
export const clearCartAtom = atom(null, (_get, set) => set(cartItemsAtom, []));
```

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 一个完整的购物车 store 涵盖 Jotai 所有重要 pattern ——

1. atomWithStorage：items 是唯一数据源，自动持久化
2. 派生 atom：cartCountAtom / cartTotalAtom 自动跟随 items 变化
3. write-only atom：addItemAtom / clearCartAtom 封装业务逻辑
4. 类型：每个 atom 自动推导类型，CartItem 接口集中定义

文件组织：
- atoms/cart.ts 集中所有购物车 atom
- 组件只 import 需要的 atom，按 hook 类型订阅
- 这种「按业务领域分文件」是 Jotai 推荐结构

对比 Zustand 实现：
- Zustand 是「一个 store 里写所有方法」
- Jotai 是「每个 atom 独立导出，组件按需 import」
- Jotai 文件数量更多，但每个 atom 更小、更易测试

组件使用：
- 商品卡片 → useSetAtom(addItemAtom)（只写）
- Header 数量徽标 → useAtomValue(cartCountAtom)（只读派生）
- 结算页 → useAtomValue(cartTotalAtom) + useSetAtom(clearCartAtom)
- 购物车列表 → useAtom(cartItemsAtom)（读 + 写）

性能：
- 派生 atom 全局只算一次，多个组件订阅共享
- write-only atom 不订阅 value，按钮组件不会因 cart 变化重渲
- atomWithStorage 跨 tab 自动同步

整个 store 不到 30 行，承载完整电商功能。这就是 Jotai 的威力。
-->

---
transition: fade-out
---

# 常见踩坑（一）：atom 必须在组件外

render 中创建 atom = 永远拿不到正确状态

<v-click>

**❌ 错误：在组件内创建 atom**

```tsx
function Counter() {
  // 每次 render 都创建新 atom 引用 → useAtom 永远拿默认值
  const countAtom = atom(0);
  const [count, setCount] = useAtom(countAtom);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

</v-click>

<v-click>

**✅ 正确：atom 在模块顶层**

```tsx
const countAtom = atom(0);  // 模块顶层，整个 app 共享

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

</v-click>

<v-click>

**例外**：必须在组件作用域时用 `useMemo(() => atom({ id }), [id])` 稳定引用；更优雅的方案是 `atomFamily`（自动缓存）。

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Jotai 新手坑 Top 1 ——
组件里写 const xxxAtom = atom(0)，看起来很合理，
但每次 render 都创建新 atom 引用，
useAtom 拿到的是「这次 render 的新 atom 的默认值」，
状态完全无法持久化。

调试时会发现：
- 点击 +1 看到 set 被调了
- 但 count 显示永远是 0
- console.log 显示每次 render 是不同的 atom

原因：Jotai 用 atom 对象的引用作为 store key。
新的 atom 引用 → store 里没有这个 key → 返回 initialValue。

[click] 解决方案 1（最常见）：atom 放模块顶层
- 整个 app 共享同一个 atom
- 跨组件、跨路由都能用
- 简单全局状态用这个

[click] 解决方案 2：必须在组件作用域时用 useMemo + 稳定 deps
- itemAtom 依赖 id，id 变化才新建
- useRef 也行：useRef(atom(...)).current
- 适合「每个列表项一个独立 atom」

更优雅的方案：atomFamily（前面讲过）
- todoAtomFamily(id) 自动按 id 缓存 atom
- 不需要手动 useMemo，引用天然稳定
- 工业级方案

诊断技巧：
- 状态总是默认值 → 检查 atom 是否在组件内创建
- 加 console.log(atom) 看引用是否每次 render 都变
- React DevTools 看 atom 的 debugLabel 是否相同
-->

---
transition: fade-out
---

# 常见踩坑（二）：async atom 重复请求

依赖变化导致重复 fetch + Suspense 闪烁

**❌ 现象**：userId 切换时旧 fetch 还没完成，新 fetch 又触发，谁后返回谁覆盖。

<v-click>

**✅ 解决方案：用 abortSignal 取消**

```ts
const userAtom = atom(async (get, { signal }) => {
  const res = await fetch(`/api/users/${get(userIdAtom)}`, { signal });
  if (!res.ok) throw new Error("Failed");
  return res.json();
});
// userId 切换时旧 fetch 自动 abort，AbortError 静默丢弃
```

</v-click>

<v-click>

**额外**：用 `loadable(userAtom)` 切换时显示「上一个用户 + Loading...」覆盖层，UX 更平滑。

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] async atom 第二大坑：竞态条件（race condition）——
快速切换依赖时，旧请求和新请求都在 pending，
谁后返回谁就「赢」，可能出现 user 2 的数据被 user 1 的旧响应覆盖。

最经典的表现：
- 快速点击切换用户
- 显示的数据偶尔和选中的用户不匹配
- F12 看 Network 有多个 pending 请求

[click] AbortSignal 是标准解法 ——
Jotai v2 在 read 函数第二参数提供 { signal }：
- signal 是 AbortSignal 实例
- fetch(url, { signal }) 配合传给底层 fetch API
- 依赖变化时，旧 read 的 signal 会自动 abort
- 旧 fetch 收到 abort 信号，throw AbortError
- AbortError 被 Jotai 静默丢弃（不会进入 ErrorBoundary）

注意：
- 自定义 HTTP 库要确保支持 AbortSignal（axios v0.22+ 支持）
- 自己写的 setTimeout / 长轮询要手动监听 signal.aborted
- Promise.race([fetch, abortPromise]) 也是一种实现

[click] 更进一步：loadable + 保留旧值
- 切换时不抛出 Suspense → 不闪烁 → 更好的 UX
- 显示「上一个用户的卡片 + 半透明 loading 浮层」
- 新数据 ready 后丝滑切换

进阶方案：用 jotai-tanstack-query
- TanStack Query 内置 stale-while-revalidate
- 自带 cache、refetch、retry、stale time 等高级特性
- 服务端状态用它 + 客户端纯 UI 状态用 Jotai = 黄金组合
-->

---
transition: fade-out
---

# 性能优化技巧

大规模 atom + 频繁更新场景

<v-click>

**1. 用 useSetAtom 避免无意义订阅**

```tsx
// ❌ 按钮不需要读 count，但 useAtom 让它订阅了
const [count, setCount] = useAtom(countAtom);
// ✅ 只拿 setter，不订阅 value
const setCount = useSetAtom(countAtom);
```

</v-click>

<v-click>

**2. 优先用派生 atom 而非组件内 useMemo**

```ts
// ❌ 每个订阅组件各算一遍
const total = useMemo(() => items.reduce(...), [items]);
// ✅ 全局只算一次，共享结果
const totalAtom = atom((get) => get(itemsAtom).reduce(...));
```

</v-click>

<v-click>

**3. selectAtom 做自定义相等判断**：`selectAtom(itemsAtom, (items) => items.map(i => i.id), isEqual)` 引用变了但内容相同时不重渲。

</v-click>

<v-click>

**4. atomFamily / focusAtom / splitAtom 切分大对象**

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Jotai 性能优化的四个方向：

[click] 第一是「Hook 选用」—— useSetAtom 不订阅 value
- 按钮、Trigger、Action 这类组件应该用 useSetAtom
- 一个 list 渲染 100 个 row，每个 row 的删除按钮都用 useSetAtom
- 全局 state 变化时这 100 个按钮不会被牵连重渲

[click] 第二是「派生 atom vs useMemo」——
派生 atom 是 store 级别缓存，所有订阅组件共享一次计算。
组件内 useMemo 是组件级别，每个组件独立缓存（同样的计算跑 N 次）。

什么时候用 useMemo？
- 派生依赖来自组件 prop（不是来自 atom）
- 计算结果是 component-specific（不希望全局共享）

其他场景一律优先派生 atom。

[click] 第三是 selectAtom —— 自定义相等性
默认 Object.is 比较新旧值，
对象 / 数组引用变了但内容相同 → 仍触发重渲。

selectAtom(sourceAtom, selectorFn, equalityFn?) 提供 escape hatch：
- equalityFn 自定义比较逻辑
- 深比较用 lodash isEqual
- 数组顺序无关比较用自定义函数

⚠️ 官方文档警告：selectAtom 不是 100% 「纯 atom」，
应该优先用派生 atom，selectAtom 仅在 equalityFn 必要时用。

[click] 第四是「切分大对象」——
单个大 atom（如整个 todos 数组）任何修改都让所有订阅者重渲。

切分方案：
- atomFamily：todoAtomFamily(id) 让每个 todo 是独立 atom
- focusAtom（jotai-optics 扩展）：用 optic 切片到子字段
- splitAtom：把数组 atom 拆成 atom[] 的派生，每项独立订阅

性能心智：
- atom 颗粒度对应组件颗粒度
- 一个组件一个 atom → 订阅最精确
- 一个 atom 多组件订阅 → 共享派生缓存
-->

---
transition: fade-out
---

# 测试：Provider + createStore 隔离

每个测试一个独立 store，零跨用例污染

<v-click>

```tsx
import { render, screen } from "@testing-library/react";
import { Provider, createStore } from "jotai";

test("counter increments", async () => {
  // 1. 每个测试用例独立 store + 注入初始值
  const store = createStore();
  store.set(countAtom, 10);

  // 2. Provider 包裹 + 渲染 + 触发
  render(<Provider store={store}><Counter /></Provider>);
  await userEvent.click(screen.getByRole("button"));

  // 3. UI 层 + state 层双重断言
  expect(screen.getByRole("button")).toHaveTextContent("11");
  expect(store.get(countAtom)).toBe(11);
});
```

</v-click>

<v-click>

**关键点**：`store.get(atom)` 和 `store.set(atom, v)` 让测试可以「跳过 UI 直接验证 state」。

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Jotai 测试的核心模式 = Provider + createStore：

每个 test 创建独立 store →
注入初始 state 用 store.set →
Provider 把 store 注入组件树 →
渲染组件 + 触发交互 →
断言：UI 用 testing-library、state 用 store.get

为什么这种模式好？
- 测试隔离：每个用例完全独立的 store，没有跨用例污染
- 灵活初始化：store.set 可以注入任意 state 组合（比 useHydrateAtoms 更直接）
- 双重验证：UI 层 + state 层都能断言
- 不需要 mock：atom 本身就是测试单元，无需替换实现

[click] store API 在测试里非常好用：

- store.get(atom) → 同步读当前值
- store.set(atom, value) → 同步写
- store.sub(atom, callback) → 订阅变化（监听 listener 触发次数）

进阶 pattern：
- 用 renderHook 测试自定义 atom hook
- 异步 atom 用 await screen.findBy... 等 Suspense 解析
- ErrorBoundary 测试：用 spyOn + toThrow 验证错误传播

对比 Redux 测试：
- Redux 也是用 Provider + createStore，模式几乎一样
- 区别：Jotai 不需要 reducer / action type，测试更直接

对比 Zustand 测试：
- Zustand 需要在 setup 文件 mock store reset
- Jotai 每个测试新建 store，天然干净

Testing Library 哲学：测「用户看到什么」而不是「state 内部结构」，
但 Jotai 允许两者结合，灵活性更好。
-->

---
transition: fade-out
---

# 项目结构建议

大规模 Jotai 应用的目录组织

<v-click>

```
src/
├── atoms/                    # atom 按业务领域分组
│   ├── auth.ts               # user / token / isLoggedIn
│   ├── cart.ts               # items / total / addItem
│   ├── theme.ts              # mode / colorScheme
│   └── ui.ts                 # modals / drawers / toasts
├── hooks/                    # 自定义 hook（封装 atom 组合）
│   ├── useAuth.ts            # 组合 user + login + logout
│   └── useFormState.ts       # atomFamily 表单工厂
├── components/
└── pages/
```

</v-click>

<v-click>

**命名约定**

- atom 后缀：xxxAtom（`countAtom`、`userAtom`）
- 派生 atom：形容词在前（`isLoggedInAtom`、`filteredItemsAtom`）
- 写 atom：动词在前（`addItemAtom`、`loginAtom`）
- family：xxxAtomFamily（`todoAtomFamily`）

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Jotai 没有官方推荐的项目结构 —— 灵活但需要团队自律。

社区常见的两种风格：

风格 A：按业务领域分文件（推荐）
- atoms/auth.ts、atoms/cart.ts、atoms/theme.ts
- 每个文件集中一个领域的所有 atom（primitive + derived + write）
- 优点：业务边界清晰，import 简单
- 缺点：单文件可能较长，需要内部分组

风格 B：按 atom 类型分目录
- atoms/primitive/、atoms/derived/、atoms/effects/
- 优点：按 atom 性质找方便
- 缺点：跨领域跳转多，business logic 分散

建议小项目用 A 风格，大项目可以混用（领域内再按类型分子目录）。

[click] 命名约定：

atom 变量名一律 xxxAtom 后缀 —— 一眼能区分 atom 和普通变量
- countAtom（primitive）
- isLoggedInAtom（派生 boolean）
- userProfileAtom（派生 object）

派生 atom 用属性 / 形容词 / 标识符开头：
- filteredXxxAtom：筛选后的派生
- sortedXxxAtom：排序后的派生
- isXxxAtom：boolean 派生
- xxxCountAtom：聚合计数派生

write-only / read-write atom 用动词开头：
- addItemAtom：添加
- removeItemAtom：删除
- updateItemAtom：更新
- loginAtom / logoutAtom

family 一律 xxxAtomFamily —— 提示这是工厂
- todoAtomFamily(id) 看一眼就知道按 id 取 atom

自定义 hook 用 useXxx，封装 atom 组合：
- useAuth() 返回 { user, login, logout }
- 内部用 useAtomValue / useSetAtom 组合 3-4 个 atom

这种命名让 IDE 跳转、grep 搜索、code review 都更高效。
团队规模上来后，规范统一比聪明设计更值钱。
-->

---
transition: fade-out
---

# 生产部署清单

上线前必做的检查项

<v-click>

**1. 开发工具不进生产**：`jotai-devtools` / `@swc-jotai/debug-label` 只在 `NODE_ENV === 'development'` 启用。

</v-click>

<v-click>

**2. atomWithStorage 检查**

- key 加版本前缀（`v1:cart`），未来改结构方便迁移
- 敏感字段（token / password）不要进 localStorage

</v-click>

<v-click>

**3. SSR 项目检查 Provider + createStore**：每个请求一个独立 store，否则用户 A 的 atom 状态会泄露到用户 B。

</v-click>

<v-click>

**4. Bundle 验证**：`npx vite-bundle-visualizer` 确认 jotai 占用 ~3 KB，未使用的扩展已 tree-shake。

</v-click>

<v-click>

**5. atomFamily 内存管理**：长期 SPA 设置 `setShouldRemove` 自动清理，避免泄漏。

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 生产部署前的检查清单：

[click] debugLabel SWC plugin / DevTools 都应该只在 dev 环境启用：
- jotai-devtools 自带 tree-shake，但保险起见显式判断
- @swc-jotai/debug-label 通过 NODE_ENV 控制
- import.meta.env.DEV 是 Vite 的判断方式

生产开 DevTools 的风险：
- 性能：每个 atom 多一层 wrap
- 安全：state 树暴露在浏览器 DevTools 面板
- bundle：DevTools 代码进生产构建

[click] localStorage key 加版本前缀是迁移友好做法：
- 'v1:cart' → 'v2:cart' 不冲突
- 旧用户的 v1 数据可以平滑读取并迁移
- 不写版本 → 改结构时旧用户白屏

敏感数据不能进 localStorage：
- token → httpOnly cookie + Set-Cookie 由服务端管理
- 个人信息 → 加密或不持久化
- 任何 XSS 都能读 localStorage（防御性思维）

[click] SSR Provider 检查是上线前最易漏的 ——
本地 dev 单用户测试看不出来，
上线后多用户并发立刻翻车（用户 A 看到用户 B 的数据）。
Code review 时强制要求 SSR 项目的根 layout 有 Provider + createStore。

[click] Bundle 体积验证：
- Jotai 核心 ~3 KB
- 每个扩展独立计算（jotai-immer ~14 KB 含 immer）
- 用 vite-bundle-visualizer / rollup-plugin-visualizer 可视化

[click] atomFamily 内存泄漏防御：
- 长期 SPA（admin、IDE、IM）必须设 setShouldRemove
- 短期 SPA（电商、博客）可以忽略
- 用 family.getParams() 监控当前缓存数量

补充：
- E2E 测试用 store API 注入状态（playwright + store.set）
- 监控：Sentry / Datadog 把 atom 当 context 一起上报
- 性能：高频组件用 useSetAtom + 细粒度 atom
-->

---
transition: fade-out
---

# 学习路径

从入门到精通的资源地图

<v-click>

**官方资源**

- [Jotai 官方文档](https://jotai.org/) — 结构清晰，3 小时能过完核心
- [Jotai GitHub](https://github.com/pmndrs/jotai) — 源码 + Issue + Discussions
- [Jotai Recipes](https://jotai.org/docs/recipes/atom-with-toggle) — 复制即用的代码片段

</v-click>

<v-click>

**生态扩展**：[jotai-immer](https://jotai.org/docs/extensions/immer) / [jotai-tanstack-query](https://jotai.org/docs/extensions/query) / [jotai-effect](https://jotai.org/docs/extensions/effect) / [jotai-xstate](https://jotai.org/docs/extensions/xstate) / [jotai-location](https://jotai.org/docs/extensions/location)

</v-click>

<v-click>

**实战参考**

- Daishi Kato《Micro State Management with React Hooks》— 作者亲著
- [jotai-demo](https://github.com/jotaijs/jotai-demo) — 官方示例项目

</v-click>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Jotai 学习路径建议：

1. 官方文档 Core 章节 —— atom / useAtom / Provider 是基本盘
2. 跟着写一个 Cart / Todo 项目 —— primitive + derived + write + persist 全部用一遍
3. Utilities 章节 —— atomWithStorage / atomFamily / loadable 都很常用
4. Guides → Performance / Testing / Debugging
5. Recipes 浏览一遍 —— 知道社区有哪些常用 pattern
6. 选 1-2 个 Extensions 深入用（推荐 jotai-tanstack-query）

[click] 生态扩展按需选用：

jotai-immer：深层嵌套对象更新场景必装
jotai-tanstack-query：和后端打交道的项目必装
jotai-effect：需要 atom 监听 / 副作用时
jotai-xstate：复杂表单流程、wizard 用状态机表达
jotai-location：搜索 / 筛选页 URL 同步

[click] 实战参考：

Daishi Kato 的书是「状态管理设计原理」级别的内容，
系统讲解 Zustand / Jotai / Valtio 三种范式的差异和选型。
强推 React 工程师必读。

jotai-demo 是官方 monorepo 示例 ——
TODO / Counter / Form / Async 各种场景的最佳实践。

R3F（React Three Fiber）虽然主要用 Zustand 但生态里很多组件用 Jotai 管 UI 状态，
是研究「大型项目状态分层」的好案例。

学习节奏建议：
- 第 1 周：把官方文档 Core + Utilities 刷完，写一个 Cart
- 第 2 周：上 atomWithStorage + atomFamily + async atom + Suspense
- 第 3 周：上 jotai-immer + jotai-tanstack-query 实战
- 第 4 周：读源码 + 看 Daishi 的书

一个月能从入门到能 hold 住中大型项目。
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 ⚛️

Jotai — Primitive and Flexible State Management

<div class="mt-8 text-lg">

**核心心智**

- 一切皆 atom —— 一个函数走天下
- 引用即身份 —— 不用 string key，TS 推导更自然
- 派生自动追踪 —— get(otherAtom) 即建立依赖
- async 天然支持 —— atom 内 async / await + Suspense
- 默认无 Provider —— 单页应用直接 import 即用

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://jotai.org/" target="_blank" class="slidev-icon-btn">
    📖 官方文档
  </a>
  <a href="https://github.com/pmndrs/jotai" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
</div>

<style>
h1 {
  background-color: #000000;
  background-image: linear-gradient(45deg, #000000 10%, #555555 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：Jotai = React 时代的「原子化状态管理」—— 每个状态都是独立 atom，自动派生 + Suspense 集成。

核心心智五条：
1. atom 是唯一 API：primitive / derived / write-only / read-write 全用一个 atom 函数
2. 引用即身份：模块顶层创建，跨组件共享同一引用
3. 派生自动追踪：read 里 get(otherAtom) 自动建立依赖图，无需 selector / memo
4. async 天然支持：atom 内 async / await，组件用 Suspense 接住 Promise
5. 默认无 Provider：v2 全局 default store，SSR / 多 store 才用 Provider

下一步建议：跟着官方文档 Core + Utilities 实战一个 Cart 项目 ——
把今天讲的 primitive / derived / write / async / storage / family 全部用上，
那时再回头看 Recoil / Zustand 项目，能立刻体会到 Jotai 的「原子化」哲学有多优雅。

最后留一句话：Jotai 不是为了取代 Zustand 或 Redux，
而是给「需要细粒度派生 + Suspense 集成」的项目一个轻量选择。
- 应用级全局状态 → Zustand 仍是最优解
- 大型团队 + 严格架构 → Redux Toolkit
- 大量独立小状态 + 派生 + async → Jotai 几乎无敌

感谢观看！⚛️
-->
