---
theme: seriph
background: https://cover.sli.dev
title: 敏捷开发
info: |
  敏捷开发：价值观伞 · 4 价值观 · 12 原则 · Scrum/Kanban/XP/Lean

  Learn more at [https://agilemanifesto.org](https://agilemanifesto.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 敏捷开发

价值观伞 · 4 价值观 · 12 原则 · 2001 雪鸟

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
敏捷是价值观伞，Scrum/Kanban/XP/Lean 是伞下实现。
-->

---
transition: fade-out
---

# 敏捷是什么

2001 雪鸟会议产出的价值观与原则，非单一方法

- **价值观伞**：4 价值观 + 12 原则，不规定具体流程
- **「左>右」非「左弃右」**：重视左项，右项仍有价值
- **落地靠框架**：Scrum / Kanban / XP / Lean 是伞下实现
- **以人为本**：个体与互动高于流程与工具
- **拥抱变化**：以短迭代应对需求不确定性

> 核心：敏捷是价值观不是流程，落地要贴合团队上下文。

<!--
敏捷是伞，伞下挂着具体框架。
-->

---

# 4 价值观（原文 + 解读）

| 主题 | 左项（更重视） | 右项（仍有价值） |
|------|------|------|
| 以人为本 | 个体与互动 | 流程与工具 |
| 交付优先 | 可用软件 | 详尽文档 |
| 协作共赢 | 客户协作 | 合同谈判 |
| 拥抱变化 | 响应变化 | 遵循计划 |

**免责声明**：尽管右项有其价值，我们更重视左项。

> 判断真假敏捷的试金石：拿「敏捷」当不写文档借口的是假。

<!--
左>右 是优先级，不是否定右项。
-->

---

# 12 原则四主题

| 主题 | 要点 |
|------|------|
| 客户与交付 | 早交付、欢迎变化、短迭代 |
| 协作与团队 | 每日协作、自组织、面对面 |
| 质量与节奏 | 可用软件度量、可持续、简洁 |
| 改进闭环 | 定期反思并调整行为 |

**工程底座**（来自 XP）：

- 自动化测试 → 变更有安全网
- 持续集成 → 集成债不积累
- 重构 → 控制复杂度

<!--
原则展开为四主题，工程实践是敏捷能持续的地基。
-->

---
layout: two-cols
---

# 敏捷 vs 瀑布

| 维度 | 瀑布 | 敏捷 |
|------|------|------|
| 流程 | 线性 | 迭代 |
| 需求 | 前期冻结 | 欢迎变化 |
| 反馈 | 末期验收 | 每迭代 Review |
| 风险 | 晚暴露 | 早暴露 |

> 需求稳定高合规→瀑布；需求不确定→敏捷。

::right::

# 伞下框架

| 框架 | 机制 | 适用 |
|------|------|------|
| Scrum | 时间盒 | 复杂产品 |
| Kanban | WIP 限制 | 运维/支持 |
| XP | TDD/结对 | 质量优先 |
| Lean | 消除浪费 | 从 0 到 1 |

> 选型：不确定→Scrum/XP；流式运维→Kanban。

<!--
瀑布线性 vs 敏捷迭代；伞下框架按场景选。
-->

---

# 计划与估算

敏捷的计划是**滚动的**，估算服务容量规划，非硬承诺

```text
Product Backlog（远期，粗估，按价值排序）
        │ 每个 Sprint Planning 拉一批
        ▼
Sprint Backlog（本期，细估，承诺完成）
        │ 每日立会跟踪
        ▼
Increment（可用增量，满足 DoD）
```

- 估算用故事点（相对复杂度）或理想日
- 估算用于「这迭代装多少」，非「3 月 1 日上线」

<!--
计划是滚动的，估算服务容量规划。
-->

---

# 反模式清单

| 反模式 | 表现 | 纠正 |
|------|------|------|
| 假敏捷 | 拿敏捷当不写文档借口 | 补 DoD、补 ADR |
| 站会变汇报 | Daily 给经理汇报 | 聚焦计划调整 |
| 估算变承诺 | 故事点当交付承诺 | 仅用于容量规划 |
| 回顾变甩锅 | Retro 互相指责 | 对事不对人 |

<!--
反敏捷信号：仪式僵化、缺工程底座。
-->

---
layout: quote
---

# 敏捷的本质

「尽管右项有其价值，我们更重视左项——这是判断真假敏捷的试金石。」

---

# 敏捷与 DevOps

| 维度 | 敏捷 | DevOps |
|------|------|------|
| 关注 | 需求与协作 | 开发运维协同 |
| 实践 | 短迭代、回顾 | CI/CD、监控 |
| 关系 | 敏捷「写」软件 | DevOps「交付」软件 |

**规模化**：单团队顺→多团队用 Nexus/LeSS/SAFe。

> 先让单团队敏捷跑顺，再谈规模扩展。

<!--
敏捷与 DevOps 互补；规模化先打牢单团队基础。
-->

---
layout: center
class: text-center
---

# 小结

敏捷 = 4 价值观 + 12 原则的价值观伞

**以人为本 · 可用软件 · 客户协作 · 响应变化**

[敏捷宣言](https://agilemanifesto.org/) · [12 原则](https://agilemanifesto.org/principles.html) · [SlideStack](https://github.com/IllegalCreed/SlideStack)

<!--
敏捷是价值观不是流程，落地靠具体框架。
-->
