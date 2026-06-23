---
theme: seriph
background: https://cover.sli.dev
title: Redux DevTools 完全指南
info: |
  Redux DevTools 完全指南：可预测状态容器调试 · 时间旅行 / action 重放 / 跨库通用

  Learn more at [https://github.com/reduxjs/redux-devtools](https://github.com/reduxjs/redux-devtools)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Redux DevTools 完全指南

状态调试 · 时间旅行 / action 重放 · 跨库通用

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Redux DevTools 确立了时间旅行的状态调试范式。
-->

---
transition: fade-out
---

# 什么是 Redux DevTools

调试可预测状态容器的浏览器扩展

- **时间旅行调试**：回放 action、前后跳转 state
- **跨库通用**：Redux / RTK / Zustand / Jotai / NgRx 开箱接入
- **state diff**：高亮每个 action 的状态改动
- **手动 dispatch**：直接派发 action 测 reducer
- **import/export**：导出 state 历史，分享调试会话

> 本项目 Pinia 用 Vue DevTools；本工具面向 Redux 系生态。

<!--
Redux DevTools 是状态调试范式的奠基者。
-->

---

# 为什么能时间旅行

依赖 Redux 的设计：单向数据流 + 纯函数 reducer

- 每个状态变更由一个 **action** 触发
- reducer 是**纯函数**：`(state, action) => newState`
- 从初始 state + 一串 action，可**确定性重建任意时刻 state**

> 时间旅行不是魔法，而是纯函数可重放的自然结果。

<!--
纯函数 reducer 是时间旅行的根基。
-->

---

# 安装与接入

```text
Chrome / Firefox 商店搜「Redux DevTools」
```

**Redux Toolkit**（默认集成）

```ts
const store = configureStore({ reducer: rootReducer });
// 开发环境自动连接扩展
```

**Zustand**（devtools 中间件）

```ts
create(devtools((set) => ({ count: 0 })));
```

<!--
RTK 开箱即用，Zustand 用中间件接入。
-->

---

# 核心面板

| 区域 | 内容 |
|------|------|
| **Action 列表** | 每次 dispatch 的 action（类型+payload+时间） |
| **状态 / Diff** | 当前 state 或选中 action 的改动 |
| **控制条** | 时间旅行滑块、跳过、回放、dispatch |

<!--
三块区域构成 Redux DevTools 的主界面。
-->

---

# 时间旅行：jump

点 action 列表任意 action

- 应用 state **立即回到那一刻**
- 页面 UI 同步还原
- 在历史间自由前后跳

> 复现「状态是怎么一步步变成现在这样」。

<!--
jump 是时间旅行最直接的用法。
-->

---

# 时间旅行：skip 与 slider

**skip：跳过某个 action**

- 标记 action 为 skip，重算「没有它」时的 state
- 验证某 action 的真实影响、定位问题 action

**slider：连续回放**

- 拖时间线滑块，像进度条一样回放状态变化

<!--
skip 验证影响，slider 连续回放。
-->

---

# Action 列表与过滤

- 按时间列出每次 dispatch 的 action
- **类型**（如 `counter/increment`）+ **payload** + **时间戳**
- **过滤**：按类型搜索，海量 action 中快速定位

> 点 action 看内容与它对 state 的影响。

<!--
action 列表是状态变更的完整记录。
-->

---

# State 检查的多种视图

选中 action，查看那一刻的 state

| 视图 | 用途 |
|------|------|
| **Tree** | 树形展开逐层查看 |
| **Raw** | 原始 JSON |
| **Chart** | state 树图形化 |

<!--
多视图适应不同的 state 查看需求。
-->

---

# Diff：状态改动一目了然

展示选中 action 对 state 的具体改动

- 绿色 = 新增
- 红色 = 删除
- 黄色 = 修改

> 不必对比两份完整 state——Diff 直接高亮改了哪几个字段。

<!--
Diff 让状态改动一眼可见。
-->

---

# 手动 dispatch 与生成测试

**手动 dispatch**

```text
Dispatcher 输入：{ "type": "counter/increment" }
→ 直接测 reducer 处理
```

**生成测试**

- 基于 action 序列与 state 生成测试代码
- 把手动调试沉淀为回归测试

<!--
dispatch 测 reducer，生成测试沉淀用例。
-->

---

# 跨库接入

| 库 | 接入 |
|----|------|
| Redux Toolkit | configureStore 默认集成 |
| 原生 Redux | composeWithDevTools() |
| Zustand | devtools 中间件 |
| Jotai | jotai-devtools |
| NgRx | StoreDevtoolsModule.instrument() |

> 只要状态变更可表达为「action → state」，就能接入。

<!--
Redux DevTools 已成为状态调试的通用协议。
-->

---

# Zustand 接入细节

```ts
import { devtools } from "zustand/middleware";

const useStore = create(
  devtools((set) => ({
    count: 0,
    inc: () => set((s) => ({ count: s.count + 1 }), false, "inc"),
  })),
);
```

> `set` 第三参 `"inc"` 让 action 列表显示有意义的名字，而非匿名更新。

<!--
标注 action 名让调试更清晰。
-->

---

# Import / Export

**分享调试会话**

- **Export**：导出 action 历史与 state 为 JSON
- **Import**：导入后本地完整复现同样的序列

> 排查难复现 bug 利器：让用户导出 state 历史，你导入后本地回放，无需复述操作。

<!--
import/export 解决「难复现」的痛点。
-->

---

# Persist 与 Pause

**Persist**：刷新页面保持状态历史

- 调试跨刷新流程时不丢上下文

**Pause / Lock**：暂停录制

- 避免无关 action（如轮询）刷屏
- 专注分析已记录的序列

<!--
persist 保上下文，pause 减噪音。
-->

---

# 时间旅行的前提

要让时间旅行可靠工作

- **reducer 必须是纯函数**：无副作用、不可变更新
- **state 应可序列化**：不放函数 / 类实例
- 副作用放 reducer 之外（thunk / saga / listener）

> 这些约束正是 Redux「可预测」的代价与收益。

<!--
遵守约束才能享受时间旅行。
-->

---

# 与 Vue DevTools 的边界

| | Redux DevTools | Vue DevTools |
|---|---|---|
| 生态 | Redux/Zustand/Jotai/NgRx | Vue / Pinia |
| time-travel | ✅ | ✅ Pinia 集成 |

> 本项目（Vue 3 + Pinia）状态调试用 Vue DevTools，无需 Redux DevTools。

<!--
区分两个工具的适用生态。
-->

---
layout: center
class: text-center
---

# 小结

Redux DevTools = 时间旅行 + action 重放 + 跨库通用

确立了「可预测状态」的调试范式

**纯函数 reducer 让状态可重放、可回溯**

[GitHub](https://github.com/reduxjs/redux-devtools) · [Redux Toolkit](https://redux-toolkit.js.org/)

<!--
理解时间旅行范式，把握可预测状态的调试哲学。
-->
