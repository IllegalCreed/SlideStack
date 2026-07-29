---
theme: seriph
background: https://cover.sli.dev
title: 看板方法 Kanban
info: |
  看板方法：渐进式演进 · 4 核心实践 · WIP 限制 · 拉系统 · 连续流

  Learn more at [https://kanbanize.com/kanban-resources](https://kanbanize.com/kanban-resources)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 看板方法 Kanban

渐进式演进 · WIP 限制 · 连续流

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Kanban 从现状起步，用可视化 + WIP 限制推动改进。
-->

---
transition: fade-out
---

# Kanban 是什么

源自丰田 TPS、David Anderson 2010 系统化的渐进式方法

- **从现状开始**：不重组团队、不改流程、不加角色
- **连续流**：无固定迭代，工作完成即拉入下一条
- **WIP 限制**：每阶段在制品上限，Kanban 的灵魂
- **拉系统**：下游空位才拉，非上游推
- **核心箴言**：Stop starting, start finishing

> 常见误解：分三列的白板 ≠ Kanban，缺 WIP 限制就不算。

<!--
Kanban 不要求改变现有流程，从现状起步。
-->

---

# 4 核心实践

```text
1. 可视化工作流  按流程阶段分列，让价值流透明
2. 限制在制品    每阶段设 WIP 上限，阻止过载
3. 管理流动      观察瓶颈，让工作快速顺畅流过
4. 显式化规则    写清「如何进入下一阶段」
```

**可视化深度**：列 + 卡片 + 泳道 + 入口/出口标准 + 阻塞标记。

> 目的：让价值流对所有人透明，问题无处藏身。

<!--
4 实践是 Kanban 的核心机制。
-->

---

# WIP 限制与拉系统

WIP 限制是 Kanban 的灵魂

- **硬约束**：达到上限时停止拉入，先完成现有的
- **拉系统**：下游有空位才拉，自动均衡负载
- **取值经验**：从当前在制品的略低值起步，渐进下调
- **弹性**：可为加急类预留一个缓冲位

**拉系统好处**：暴露瓶颈、防止过载、减少上下文切换浪费。

> 团队常在压力下偷偷突破 WIP——这会摧毁 Kanban 的机制。

<!--
WIP 限制制造拉系统，强制暴露问题。
-->

---
layout: two-cols
---

# Kanban vs Scrum

| 维度 | Kanban | Scrum |
|------|------|------|
| 工作模型 | 连续流 | 时间盒 |
| 迭代 | 无固定 | Sprint |
| 角色 | 无强制 | 3 accountability |
| 变更 | 随时拉 | Sprint 内不变 |
| 度量 | 前置时间 | Velocity |

::right::

# 流动指标三件套

| 指标 | 含义 |
|------|------|
| 前置时间 | 提出→交付 |
| 周期时间 | 开始→完成 |
| 吞吐率 | 单位时间完成数 |

用累积流图（CFD）斜率与带宽变化揭示瓶颈。

> 连续流做交付预测比 Velocity 更基于数据。

<!--
Kanban 连续流 vs Scrum 时间盒；流动指标驱动改进。
-->

---

# 推 vs 拉系统

```text
推系统 Push：上游做完就推下游 → 不顾容量 → 过载堆积
拉系统 Pull：下游有空位才拉 → 容量驱动 → 自动均衡
```

**Kanban 的拉系统**：源自丰田 JIT，生产由实际需求（下游消耗）触发，非上游预测。

**瓶颈管理**：

- 瓶颈前堆积、瓶颈后空闲
- 扩容瓶颈环节是最高杠杆
- 核心箴言：**停止启动，开始完成**

<!--
拉系统由下游容量触发，暴露瓶颈驱动改进。
-->

---

# 服务类别（Class of Service）

| 类别 | 特征 | 策略 |
|------|------|------|
| 标准 | 普通需求 | 正常排队 |
| 加速 | 紧急阻塞 | 可超 WIP，同时仅 1 个 |
| 固定日期 | 硬截止 | 按日倒排 |
| 无形 | 长期改进 | 填充剩余容量 |

让团队对不同紧急度有明确策略，非一律 FIFO。

> 加速类滥用（一切都标「紧急」）会摧毁优先级机制。

<!--
服务类别区分工作紧急度，配不同策略。
-->

---
layout: quote
---

# Kanban 的核心箴言

「Stop starting, start finishing——停止启动，开始完成。」

---

# 反模式清单

| 反模式 | 表现 | 纠正 |
|------|------|------|
| 无 WIP 的白板 | 只画列不限数 | 设 WIP 上限并执行 |
| 偷偷突破 WIP | 压力下随意加项 | 把 WIP 当硬约束 |
| 只可视化不改进 | 板漂亮但停滞 | 用 CFD 驱动改进 |
| 无显式规则 | 流转靠默契 | 写清入口/出口标准 |

<!--
反模式：缺 WIP 限制、不改进、无规则。
-->

---
layout: center
class: text-center
---

# 小结

Kanban = 可视化 + WIP 限制 + 管理流动 + 显式规则

**渐进式演进 · 连续流 · 拉系统 · 从现状开始**

[Kanban Resources](https://kanbanize.com/kanban-resources/getting-started/what-is-kanban/) · [David Anderson](https://www.djaa.com/) · [SlideStack](https://github.com/IllegalCreed/SlideStack)

<!--
Kanban 不解决「做什么」，解决「如何顺畅流动并持续改进」。
-->
