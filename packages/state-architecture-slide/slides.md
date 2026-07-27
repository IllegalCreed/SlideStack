---
theme: seriph
background: https://cover.sli.dev
title: 状态架构策略完全指南
info: |
  状态架构策略完全指南：本地 vs 全局 · 响应式 vs 不可变 · 原子化 vs 规范化 · 数据流方向

  Learn more at https://redux.js.org/understanding/thinking-in-redux/three-principles
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 状态架构策略完全指南

前端状态管理的四维度架构取舍 · Redux · Vue · MobX · Jotai

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
状态架构是「状态如何组织」的架构层取舍，决定后续重渲染性能、可调试性、SSR 成本与团队协作门槛。
-->

---
transition: fade-out
---

# 什么是状态架构策略

前端「应用状态如何组织」的**架构层**取舍

- **抽象先行，库在后**：把「状态怎么组织」与「用什么 API」解耦
- **四维度正交**：位置 / 变更范式 / 拆分粒度 / 数据流向
- **决策可跨库迁移**：Redux → Zustand、MobX → Pinia
- **不绑定具体 API**：本章不讲 store 创建，讲架构取舍

> 2026 走向：服务端状态 Query / 客户端 UI 轻量 store / 实体缓存 normalized 的**三分法**。

<!--
强调四维度是架构层，不是 API 层——边界：Pinia defineStore、Redux createSlice 等具体 API 属于其他章。
-->

---

# 四维度全景

| 维度 | 一端 | 另一端 |
|------|------|------|
| **位置** | 本地（组件内） | 全局（中心化 store） |
| **变更范式** | 响应式（可变） | 不可变（替换） |
| **拆分粒度** | 原子化（atom） | 规范化（中心表 + ID） |
| **数据流向** | 单向 / 双向 / 原子订阅 | — |

**核心认知**

- 每个维度都是**连续光谱**而非二元选择
- 四维度独立选择、组合出 16+ 种状态风格
- 没有任何「最优解」，只有「适合场景的解」

<!--
四维度是正交的——任何一个项目都是这四个维度的某个组合点。
-->

---

# 维度一：本地 vs 全局

**State Colocation 原则**（Kent C. Dodds）

- 把状态放在**离消费它的组件最近的层级**
- 「让东西变快的最佳方式是少做事」
- state 越高 → 失效子树越大、重渲染范围越广
- 下移 → React 只检查真正引用它的少量组件

**Lifting State Up 决策树**

```text
useState 起步
  → 只有当前组件用 → 留本地
  → 多组件共享但很近 → 提升到最近公共祖先
  → 跨路由共享 → 全局 store
  → 持续反向审视：只剩一个消费者就下推
```

> colocate 是**持续重构过程**，应用能跑 ≠ 位置最优。

<!--
「让东西变快的最佳方式是少做事」是性能优化的根本思路——少做事 = state 放近一点。
-->

---
layout: two-cols
---

# 本地状态示例

```ts
// 反模式：只被一个组件用的
// 输入值塞进全局 store
const useGlobalInput = create((set) => ({
  query: "",
  setQuery: (q) => set({ query: q })
}));

// 正确：colocate 在使用组件内
const SearchBox = () => {
  const [q, setQ] = useState("");
  return <input value={q} />;
};
```

::right::

# 状态归属判断

**保留在本地**

- 表单输入、modal 显隐
- 鼠标 / 滚动 / 拖拽
- 组件私有 UI 状态

**提升到全局**

- 跨路由共享领域实体
- 当前用户、购物车、配置
- 多模块共同读写

> 跨路由共享才考虑全局 store

<!--
两个判断核心：谁在用 + 用得多远。
-->

---

# 维度二：响应式 vs 不可变

| 维度 | 响应式 | 不可变 |
|------|------|------|
| **代表** | Vue reactive / MobX | Redux / setState |
| **状态** | 可变（直接赋值） | 只读（返回新对象） |
| **检测** | Proxy track / trigger | 引用相等 `===` |
| **依赖/派生** | 运行时自动 / `@computed` | 手动 useMemo / selector |
| **time-travel** | 难 | 易（核心卖点） |
| **SSR** | 难（observable 序列化） | 易（plain object） |

> Immer `produce` 桥接：可变书写 + 不可变结果，Redux Toolkit 内置。

<!--
Redux 与 MobX 的哲学差异是状态管理最经典的对比——可变 vs 只读、依赖追踪 vs 引用相等。
-->

---
layout: two-cols
---

# Redux 三大原则

1. **Single Source of Truth**
   - 全局 state 在单一 store 对象树
2. **State is Read-Only**
   - 唯一变更：dispatch 一个 action
3. **Changes via Pure Functions**
   - reducer 是 `(state, action) => newState`

**单向数据流五步**

```text
State → View → dispatch(Action)
       → Reducer → New State
```

::right::

# MobX 三大支柱 + Reactions

1. **Observable State**
   - `observable` 标记可观察
2. **Derivation / Computed**
   - `@computed` 自动派生
3. **Action**
   - 修改状态的函数
4. **Reactions**（副作用）
   - `autorun` / `reaction` / `when`

**指导原则**

> 任何能从 state 派生的东西
> 都应**自动派生**

<!--
Redux 靠约束赢可预测性，MobX 靠自动追踪赢最少样板——两种哲学。
-->

---

# Vue 深度响应式

**机制**：Proxy 拦截 get/set + 三层依赖结构

```text
WeakMap<target, Map<key, Set<effect>>>
  │          │           │
  对象       属性名      effect 集合
```

**`ref` vs `reactive`**

- `ref`：getter/setter 包裹基本类型，`.value` 访问
- `reactive`：Proxy 包裹对象，深度响应式

**解构陷阱**

```ts
const state = reactive({ count: 0 });
const { count } = state;  // 陷阱：丢响应性
const { count } = toRefs(state);  // 正确：ref 包裹
```

> Vue 3.4+ `defineModel()` 宏简化 v-model 组件封装；团队已放弃 Reactivity Transform。

<!--
reactive 解构丢响应性是 Vue 最经典的坑——必须 toRefs 包裹。
-->

---

# 维度三：原子化 vs 规范化

**Normalized State（Redux）**

```ts
{
  posts: {
    byId: { 1: { id: 1, title: "..." } },
    allIds: [1]
  }
}
```

**四规则**：每类一表 / ID 做 key / 引用用 ID / ID 数组表顺序

**Atomic State（Jotai）**

```ts
const priceAtom = atom(100);
const qtyAtom = atom(2);
const totalAtom = atom((get) =>
  get(priceAtom) * get(qtyAtom));  // 派生 atom
```

> Atomic 跳过组件树层级，订阅绑在 atom 依赖图上。

<!--
Normalized 解决关系型实体的更新成本问题；Atomic 解决深层嵌套兄弟组件共享难题。
-->

---
layout: two-cols
---

# Atomic vs Normalized

| 维度 | Atomic | Normalized |
|------|------|------|
| **结构** | 独立 atoms | 中心表 + byId |
| **订阅** | 天然按 atom | useSelector |
| **依赖** | atom 依赖图 | 组件树拓扑 |
| **重构树** | 不影响 | Provider 影响 |
| **Provider** | 可无（Jotai） | 必须 |

::right::

# 嵌套 vs 规范化

**嵌套（反模式）**

```ts
posts: [{
  id: 1,
  author: { id: 9, name: "Alice" },
  comments: [{ author: { id: 9 } }]
}]
// author 重复、复制祖先链
```

**规范化（推荐）**

```ts
posts: { byId: { 1: { authorId: 9 } } }
authors: { byId: { 9: { name: "Alice" } } }
```

> 更新复杂度：O(深度) → O(1)

<!--
嵌套结构是规范化最大的反面教材——重复、复制成本爆炸、重渲染范围广。
-->

---

# 维度四：数据流方向

| 方向 | 代表 | 底层机制 | 适用 |
|------|------|------|------|
| **单向** | Redux | action → reducer → state | 大型 / time-travel |
| **双向** | Vue v-model | prop + event 语法糖 | 表单 / 开关 |
| **原子订阅** | Jotai / Recoil | atom 依赖图 | 性能敏感 |

**v-model 展开为语法糖**

```text
<MyInput v-model="text" />
<!-- 等价 -->
<MyInput :modelValue="text"
  @update:modelValue="text = $event" />
```

> Vue 3.4+ 用 `defineModel()` 宏简化封装。

<!--
v-model 不是真的双向——它是 prop + event 的语法糖，本质仍是单向数据流。
-->

---
layout: two-cols
---

# 选型决策矩阵

| 场景 | 范式 |
|------|------|
| 表单 / 父子共享 | 本地 / 提升公共祖先 |
| 跨路由实体 | 全局 normalized |
| 大型 + time-travel | Redux Toolkit |
| 中小 + OOP | MobX |
| Vue 生态 | Pinia |
| 深层嵌套共享 | Jotai |
| 关系型实体 | RTK Query / TanStack Query |

::right::

# 三分法（2026 走向）

```text
应用状态
   ├─ 服务端状态
   │   → Query 库
   │     （RTK Query / TanStack Query）
   │
   ├─ 客户端 UI 状态
   │   → 轻量 store / atom
   │     （Pinia / Zustand / Jotai）
   │
   └─ 关系型实体缓存
       → normalized 或 Query 缓存
```

> 取代了过去「所有状态塞进 Redux」的单一范式

<!--
三分法是 Redux Toolkit Query 兴起后的最大架构变化。
-->

---
layout: quote
---

# 反模式与陷阱

「让东西变快的最佳方式是少做事。」

把所有状态塞进单一全局 store = React 性能首要杀手——Kent C. Dodds

---
layout: center
class: text-center
---

# 八大反模式速查

1. **所有状态塞单一全局 store** → 性能首要杀手
2. **嵌套结构存关系型数据** → 重复 + 复制祖先链爆炸
3. **Context 顶层 + 频繁变化 value** → 所有 consumer 重渲染
4. **响应式不开 `enforceActions`** → 状态散落难追踪
5. **Props drilling 过深** → 重构脆弱
6. **Redux reducer 直接 mutate** → 破坏引用相等 + time-travel
7. **`reactive` 对象直接解构** → 丢响应性
8. **双向绑定用于复杂场景** → 数据流隐式难追踪

<!--
这八条是 Kent C. Dodds + Redux + Vue + MobX 官方反复点名的反模式。
-->

---
layout: center
class: text-center
---

# 小结

状态架构 = 四维度正交取舍

位置 · 变更范式 · 拆分粒度 · 数据流向

**colocate 默认 · 跨路由才全局 · 三分法落地 · 反模式避坑**

[Redux 三原则](https://redux.js.org/understanding/thinking-in-redux/three-principles) · [Vue Reactivity](https://vuejs.org/guide/extras/reactivity-in-depth.html) · [Jotai](https://jotai.org/) · [State Colocation](https://kentcdodds.com/blog/state-colocation-will-make-your-react-app-faster)

<!--
掌握四维度正交 + colocate + 三分法，就能为任何场景选到合适的状态架构。
-->
