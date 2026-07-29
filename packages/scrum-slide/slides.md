---
theme: seriph
background: https://cover.sli.dev
title: Scrum
info: |
  Scrum：轻量级框架 · 经验主义 · 3 accountability · 5 事件 · 3 工件 · 5 价值观

  Learn more at [https://scrumguides.org](https://scrumguides.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Scrum

轻量级框架 · 经验主义 · 2020 版

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Scrum 让团队现有实践的效能与差距透明可见。
-->

---
transition: fade-out
---

# Scrum 是什么

基于经验主义的轻量级框架（Scrum Guide 2020）

- **经验主义三柱**：透明、检视、适应
- **3 accountability**：PO / SM / Developers
- **5 事件**：Sprint + Planning/Daily/Review/Retro
- **3 工件 + 3 commitment**：Backlog/Increment
- **5 价值观**：承诺、专注、开放、尊重、勇气

> Scrum 不产生价值，价值由团队在框架内创造。

<!--
Scrum 让经验主义可操作，本身不解决工程。
-->

---

# 经验主义三柱

| 支柱 | 含义 | Scrum 支撑 |
|------|------|------|
| 透明 | 过程与产物可见 | 工件公开、DoD 共识 |
| 检视 | 定期查看偏差 | 5 事件强制节奏 |
| 适应 | 偏离及时调整 | Retro 改进流程 |

**适应前提**：偏离发现不能太晚——这正是 Sprint「≤1 个月」的原因。

> 经验主义是 Scrum 的地基，三柱缺一不可。

<!--
经验主义三柱通过短 Sprint 与事件落地。
-->

---

# 3 个 Accountability（2020）

```text
Product Owner（PO）  最大化产品价值，管理 Product Backlog
Scrum Master（SM）   确立 Scrum 定义，true leader who serves
Developers           每 Sprint 创造可用的 Increment
```

**要点**

- **PO** 是一个人，非委员会；对「做什么、什么顺序」负责
- **SM** 是真正的服务型领导，不是项目经理、不分配任务
- **Developers** 是 self-managing，内部决定谁做什么、何时、如何

> Scrum Team 通常 10 人或更少，无子层级、无头衔。

<!--
2020 用 accountability 取代 role，削弱层级感。
-->

---

# 5 个事件

**Sprint**：容器事件，≤1 个月

| 事件 | 时长 | 目的 |
|------|------|------|
| Planning | ≤8h | 定 Why/What/How |
| Daily | 15 分钟 | 检视进展、调当日计划 |
| Review | ≤4h | 检视 Increment、协作 |
| Retrospective | ≤3h | 反思流程、计划改进 |

**Daily Scrum**：仅 Developers，非状态汇报，非给经理看。

> 事件目的：减少其他未定义会议。

<!--
5 事件压缩必要沟通进时间盒。
-->

---
layout: two-cols
---

# 3 工件 + commitment

| 工件 | commitment | 含义 |
|------|------|------|
| Product Backlog | Product Goal | 长期目标 |
| Sprint Backlog | Sprint Goal | 本期唯一目标 |
| Increment | DoD | 完成标准 |

**Increment 核心属性**：可用、满足 DoD、累加、朝 Product Goal。

::right::

# 5 价值观

```text
承诺 Commitment  达成目标、互相支持
专注 Focus       聚焦当前 Sprint
开放 Openness    对工作挑战透明
尊重 Respect     彼此视为有能力的人
勇气 Courage     做正确的事
```

> 有规则无价值观的 Scrum 是僵化的。

<!--
工件 commitment 增强透明；价值观让 Scrum 活起来。
-->

---

# 2020 vs 2017 关键变化

| 维度 | 2017 | 2020 |
|------|------|------|
| 称谓 | roles 角色 | accountabilities 问责 |
| 团队 | self-organizing | self-managing |
| SM 定位 | servant leader | true leader who serves |
| 工件 | 无统一承诺 | 引入 commitment |

> self-managing 更进一步：内部决定谁/何时/如何。

<!--
2020 强调问责、自管理、真正的服务型领导。
-->

---

# Sprint Planning 三问

```text
Why  —— 这次 Sprint 的目标？（Sprint Goal）
What —— 选哪些 Product Backlog 项？
How  —— 如何完成？（计划）
```

**产物**：Sprint Backlog = Sprint Goal + 选中项 + 完成计划。

**Review**：协作式，非单向演示；共同规划下一步。

**Retrospective**：聚焦「如何工作」，产物是可执行改进项。

<!--
Planning 主题：Why 优先于 What。
-->

---
layout: quote
---

# Scrum 的核心

「Scrum 让团队现有实践的相对效能和差距透明可见——它本身不产生价值。」

---

# Scrum 不解决工程

Scrum Guide 不含 TDD/CI/重构/结对——这些是 Developers 自己的实践

- **DoD 拉入工程**：若 DoD 写「须过 CI + 单测」，则工程实践被拉进框架
- **无工程底座的 Scrum**：易堆技术债，常需配合 XP 实践
- **规模扩展**：单团队跑顺→多团队用 Nexus/LeSS/SAFe

> 单团队 Scrum 都跑不顺，扩展框架救不了。

<!--
工程实践通过 DoD 进入框架；先打牢单团队。
-->

---
layout: center
class: text-center
---

# 小结

Scrum = 经验主义 + 3 accountability + 5 事件 + 3 工件 + 5 价值观

**透明 · 检视 · 适应 · self-managing · true leader**

[Scrum Guide 2020](https://scrumguides.org/scrum-guide.html) · [历史版本](https://scrumguides.org/) · [SlideStack](https://github.com/IllegalCreed/SlideStack)

<!--
Scrum 让经验主义可操作，价值由团队创造。
-->
