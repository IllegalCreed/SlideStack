---
theme: seriph
background: https://cover.sli.dev
title: 组件分类与设计原则 完全指南
info: |
  组件分类与设计原则完全指南：六种角色 / 三大原则 / API 模式 / 反模式

  基于 react.dev / vuejs.org / patterns.dev / Refactoring.Guru
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 组件分类与设计原则

React/Vue 通用 · 六种角色 · 三大原则 · API 模式 · React 19 / Vue 3.5

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
本章是组件化开发的通用方法论——不绑定具体框架，回答「组件按角色如何分类」与「API 表面如何设计」两大问题。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-12
---

# 两大契约：props 向下、events 向上

组件间数据流的标准契约

::left::

<div v-click>

### React 写法

```tsx
function Parent() {
  const [val, setVal] = useState("");
  return <Child value={val} onChange={setVal} />;
}
```

- 父传 `value` props
- 子触发 `onChange` 回调
- 子**不能直接改 props**

</div>

::right::

<div v-click>

### Vue 写法

```vue
<script setup lang="ts">
defineProps<{ modelValue: string }>();
defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>
```

- `defineProps` 接收
- `defineEmits` 上报
- 直接改 props **违反单向数据流**

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
两大契约在 React 与 Vue 中的具体写法。
-->

---
transition: fade-out
---

# 六种角色概览

按职责分类的六种组件角色

| 角色 | 别名 | 数据来源 | 现状 |
|------|------|----------|------|
| **展示型** | 木偶 | 全部 props | 思维模型仍可用 |
| **容器型** | 智能 | 取数据 + 状态 | Hooks 替代 |
| **受控** | - | 父 props 驱动 | 协调场景推荐 |
| **非受控** | - | 自身 useState | 独立组件推荐 |
| **复合** | Compound | Context 共享 | 声明式 API 推荐 |
| **高阶** | HOC | wrapper 注入 | legacy 不推荐 |

> Dan Abramov 2015 提出 Container/Presentational，**Hooks 发布后本人声明不再必要**。

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
六种角色一图概览，重点强调 Hook 时代的变化。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-12
---

# 展示型 vs 容器型

Dan Abramov 2015 原始分类，Hooks 后已不再严格

::left::

<div v-click>

### 展示型（木偶）

- 只关心视图渲染
- 数据全部从 props
- 不访问数据源

```tsx
function UserList({ users }) {
  return (
    <ul>{users.map(u =>
      <li key={u.id}>{u.name}</li>
    )}</ul>
  );
}
```

</div>

::right::

<div v-click>

### 容器型（智能）

- 取数据 + 持有状态
- 通过 props 下传

```tsx
function UserContainer() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("/api/users")
      .then(r => r.json())
      .then(setUsers);
  }, []);
  return <UserList users={users} />;
}
```

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
容器组件的取数据职责被 useUsers() 等 Hook 接管，组件回归描述 UI。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-12
---

# 受控 vs 非受控

按 state 归属区分的两种数据流角色

::left::

<div v-click>

### 非受控（独立）

```tsx
function Panel({ defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button onClick={() => setOpen(o => !o)}>
        toggle
      </button>
      {open && <div>...</div>}
    </div>
  );
}
```

- 配置少，开箱即用
- 父不需要管理

</div>

::right::

<div v-click>

### 受控（协调）

```tsx
function Accordion({
  openIndex, onChange
}) {
  return items.map((item, i) => (
    <Panel
      open={openIndex === i}
      onToggle={() => onChange(i)}
    />
  ));
}
```

- 父完全控制
- 同时间只展开一个

</div>

::bottom::

<div v-click text-xs text-right>

折中：**Controllable Component**（`defaultValue` / `value` 双 API，如原生 `<input>`）

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
判别：state 在自身 = 非受控；父驱动 props = 受控。
-->

---
transition: fade-out
---

# 复合组件（Compound）

声明式 API，最接近原生 HTML 语义

```tsx
<Tabs>
  <Tabs.List>
    <Tabs.Tab>简介</Tabs.Tab>
    <Tabs.Tab>详情</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panels>
    <Tabs.Panel>...</Tabs.Panel>
    <Tabs.Panel>...</Tabs.Panel>
  </Tabs.Panels>
</Tabs>
```

<div v-click>

**实现要点**：

- ✅ 用 **Context** 隐式共享状态，支持任意嵌套深度
- ❌ **不要**用 `React.Children.map + cloneElement` 注入（子组件被包裹即失效）

</div>

> Context 兼容 React 18+ Server Components；`Children.map` 仅作用于直接子节点。

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
复合组件的核心：用 Context，不用 Children.map + cloneElement。
-->

---
transition: fade-out
---

# HOC 三大约定（legacy）

legacy.reactjs.org 官方约定，新代码不推荐

<div v-click>

```tsx
function withTheme<P>(Wrapped: ComponentType<P>) {
  function WithTheme(props: P) {
    // ② 透传不相关 props
    const { extra, ...rest } = props as any;
    return <Wrapped {...rest} theme={useTheme()} />;
  }
  // ③ displayName 包裹
  WithTheme.displayName = `WithTheme(${getDisplayName(Wrapped)})`;
  return WithTheme;  // ① 用组合，不改原型
}
```

</div>

<div v-click>

- **① 不改原组件原型**：用组合，函数组件无生命周期方法会失败
- **② 透传无关 props**：被包裹组件接口一致，能独立复用
- **③ displayName 包裹**：DevTools 显示 `WithTheme(UserList)`

</div>

> **绝不在 render 中调 HOC**：每次新组件类型 → React 判定 `!==` → 整树卸载 → state 丢失。

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
HOC 三大约定的核心是「组合不改原型 / 透传 / displayName」。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-12
---

# 自定义 Hook vs HOC vs Render Props

三种逻辑复用方式的取舍

::left::

<div v-click>

### Hook（首选）

- 扁平：调用 `useX()`
- props 来源透明
- DevTools 清晰
- ref 直接用
- React 19 主推荐

```tsx
function useTheme() {
  const [theme, setTheme] = useState("dark");
  return { theme, setTheme };
}

// 任意组件调用
const { theme } = useTheme();
```

</div>

::right::

<div v-click>

### HOC（legacy）

- wrapper 嵌套地狱
- props 隐式注入
- ref 需 `forwardRef`
- 命名冲突

### Render Props

- 注入 index / 动态渲染
- 多层 render 回调
- 大幅被 Hook 取代

> **核心差异**：Hook 共享**逻辑**而非**状态本身**，每次调用独立 state。

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Hook 共享逻辑不共享状态是核心区别。
-->

---
transition: fade-out
---

# 设计原则三件套

横向组合复用的三大经典原则

<div v-click>

- **SRP（单一职责）**：一个组件只做一件事。拆分信号：用注释分块、CSS class 圈区域、设计图层
- **OCP（开闭）**：对扩展开放对修改关闭。前端用 Robert C. Martin 1990s 多态版本（基于抽象接口）
- **组合优于继承**：has-a 优于 is-a。Facebook 上万组件从未发现需要继承

</div>

<div v-click>

```tsx
// ❌ 反例：每加一个图标都要改 Button 源码
function Button({ icon }: { icon?: "save" | "delete" }) { ... }

// ✅ 正解：props 注入任意节点，扩展不改源码（OCP）
function Button({ icon }: { icon?: React.ReactNode }) { ... }
```

</div>

> SRP 不要过早拆——**当复杂度增长时再拆**（react.dev《Thinking in React》）。

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
三大原则源自 1988-1990s 软件工程经典，与框架版本解绑。
-->

---
transition: fade-out
---

# State 最小化三条过滤规则

判断某数据是否应为 state（react.dev《Thinking in React》）

| 规则 | 例子 | 结论 |
|------|------|------|
| **① 不随时间变化** | 列表项（来自父 props） | 不是 state |
| **② 可从 props 传入** | `initialValue`（父控制） | 不是 state |
| **③ 可从已有 state/props 计算**（DRY） | 过滤后列表 = `list.filter(...)` | 不是 state，实时计算 |

<div v-click>

```tsx
// ❌ 反例：派生值存为 state，违反 DRY
const [filtered, setFiltered] = useState(users);
useEffect(() => { setFiltered(users.filter(...)); }, [users]);

// ✅ 正解：派生值实时计算
const filtered = useMemo(
  () => users.filter(u => u.name.includes(query)),
  [users, query]
);
```

</div>

> 三条任一满足即**不是 state**。三条都不满足才能作为 state。

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
State 最小化的核心：派生值不存为 state。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-12
---

# 组合优于继承的三个落点

react.dev 官方结论：Facebook 上万组件从未需要继承

::left::

<div v-click>

### ① Containment（包含）

未知子节点用 children / 具名 prop：

```tsx
function Dialog({ children }) {
  return <div className="dialog">{children}</div>;
}
```

### ② Specialization（特化）

组合 + 配置 props：

```tsx
function PrimaryButton(props) {
  return <Button variant="primary" {...props} />;
}
```

</div>

::right::

<div v-click>

### ③ 逻辑复用

提取为 JS 模块 / Hook：

```tsx
// 提取为模块
function formatPrice(cents: number) {
  return (cents / 100).toFixed(2);
}

// 提取为 Hook
function useUser(id: string) {
  const [user, setUser] = useState(null);
  useEffect(() => { /* fetch */ }, [id]);
  return user;
}
```

**不用**继承基类！

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
组合的三个落点：包含 / 特化 / 逻辑复用。
-->

---
transition: fade-out
---

# Vue 插槽体系

Vue 等价于 React children + render props 的方案

<div v-click>

- **默认插槽 + 后备内容**：`<slot>默认</slot>`
- **具名插槽**：`<slot name="header" />` + `<template #header>`
- **作用域插槽**：`<slot :item="x" />` + `<template #default="{ item }">`

```vue
<!-- FancyList：封装数据获取，行渲染委托父组件 -->
<script setup lang="ts">
const items = await fetch("/api/items").then(r => r.json());
</script>
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item" :index="0" />
    </li>
  </ul>
</template>
```

</div>

> **渲染作用域规则**：父模板表达式只能访问父作用域；访问子数据须用作用域插槽。

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Vue 插槽四件套，作用域插槽就是 Vue 的 render props。
-->

---
transition: fade-out
---

# React.Children 是 Pitfall

react.dev 官方明确警告

<div v-click>

**问题**：`children` 是**不透明数据结构**，`React.Children.map` 看不到自定义组件内部渲染（即使内部渲染 10 个元素也只算 1）。

</div>

<div v-click>

**三种替代方案**：

```tsx
// ① 暴露多个具名子组件
<Dialog>
  <Dialog.Header>...</Dialog.Header>
  <Dialog.Body>...</Dialog.Body>
</Dialog>

// ② 结构化数组 prop
<List items={[{...}, {...}]} />

// ③ render prop
<List items={users} renderItem={(u, i) => <div>{i}. {u.name}</div>} />
```

</div>

> `React.Children` 与 `React.cloneElement` 在新文档标注 Pitfall，给出三种替代。

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
React.Children Pitfall 的三种替代方案。
-->

---
transition: fade-out
---

# 反模式黑名单

避坑清单（按危害排序）

<div v-click>

- **prop drilling**：多层级透传同一组 props → 状态提升 / Context / provide-inject
- **在 render 中调 HOC**：每次新组件类型 → 整树卸载 → state 丢失 → 顶层应用一次
- **Children.map + cloneElement 注入**：子组件被包裹即失效 → Context
- **直接修改 Vue props**：违反单向数据流 → emit 事件
- **派生值存为 state**：违反 DRY → 实时计算
- **HOC 内修改原型（mutation）**：组合替代
- **Hook 命名违规**：内部不调用 Hook 却加 `use` 前缀 → linter 失去保护
- **mixin / 继承基类复用逻辑**：Vue 3 用 Composable
- **把 ref 当普通 prop 传给 HOC**：用 `React.forwardRef`（16.3+）透传

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
反模式黑名单按危害排序。
-->

---
layout: intro
transition: fade-out
---

# 结尾与号召

让组件设计回归本质

- 分类与原则**与框架版本解绑**，跨 React/Vue/Angular 通用
- **Hooks/Composable** 以更低结构成本替代 HOC / mixin / 容器组件
- 组合优于继承，children + props + Context 解决一切

<div class="abs-br m-6 text-xl">
  <a href="https://react.dev/learn/thinking-in-react" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://vuejs.org/guide/essentials/component-basics.html" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
  <a href="https://illegalcreed.github.io/zh/architecture/component-design/component-design/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
组件设计的本质：分类 + 原则 + 组合。
-->

---
layout: end
---
