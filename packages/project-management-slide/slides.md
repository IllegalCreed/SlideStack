---
theme: seriph
background: https://cover.sli.dev
title: 项目管理工具指南
info: |
  项目管理工具指南：Jira · Trello · Linear —— 跟踪需求 · 组织协作 · 可视化进度

  Learn more at [Jira](https://support.atlassian.com/jira-software-cloud/) · [Linear](https://linear.app/docs)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 项目管理工具

Jira · Trello · Linear

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
把「谁在做什么、做到哪了」搬到结构化工作项。
-->

---
transition: fade-out
---

# 三款工具是什么

把工作拆成结构化工作项并跟踪流转的工具

- **Jira**（Atlassian）：企业级事实标准，强大但重
- **Trello**（Atlassian）：极简看板，简单直观
- **Linear**（2026 新主流）：键盘优先、速度极快
- 三者定位互补：复杂治理 / 轻量看板 / 现代体验
- 核心概念：Issue · Board · Sprint/Cycle · Workflow

> 本叶讲工具用法；敏捷方法论归「软件工程」章。

<!--
Jira 重、Trello 轻、Linear 快，定位互补。
-->

---

# 定位对比

| 维度 | Jira | Trello | Linear |
|------|------|------|------|
| 定位 | 企业级标准 | 极简看板 | 2026 新主流 |
| 查询 | JQL（强大） | 简单过滤 | 过滤+视图 |
| 速度 | 慢 | 中 | 极快（本地优先） |

> 大企业复杂流程选 Jira，软件团队提速选 Linear。

<!--
Linear 凭速度与体验从 Jira 抢走大量新客。
-->

---
layout: two-cols
---

# Jira 核心概念

- **Issue 类型**：Story / Bug / Task / Epic / Subtask
- **看板**：Scrum（Sprint）/ Kanban（连续流）
- **JQL**：复杂查询，存为过滤器
- **Custom Workflows**：状态+迁移规则可定制
- **估算**：Story Points（故事点）

**层级**

::right::

```
Initiative（战略）
  └── Epic（大需求）
       └── Story/Task/Bug
            └── Subtask
```

- Epic 承上启下

> Jira 能建模任意流程，但配置门槛高。

<!--
Jira 的可定制性是企业级的关键。
-->

---

# JQL 与工作流

JQL 可保存为过滤器，驱动看板/仪表盘/通知

```text
assignee = currentUser()
  AND sprint in openSprints()
  AND status != Done
```

- 运算符：`=` `!=` `IN` `~`（包含）
- 函数：`openSprints()` `startOfWeek()` `now()`
- 逻辑：`AND` `OR` `NOT`

**工作流组成**

- Status（状态）+ Transition（迁移）
- Conditions / Validators / Post functions

> 「转 Done 必须填 Fix Version」用 Validator。

<!--
JQL 是 Jira 的查询利器。
-->

---
layout: two-cols
---

# Trello 核心概念

Board（看板）→ List（列表）→ Card（卡片）

```
看板「产品迭代」
├── List「To Do」
│   └── Card「登录页改版」
└── List「Done」
```

- 卡片：due / checklist / label / 附件
- **Butler**：无代码自动化
- **Power-Ups**：第三方扩展

::right::

# Butler 自动化

「触发 → 条件 → 动作」

```text
When card moved to "Done",
  remove all members,
  and archive the card.
```

- 触发：移列 / 新建 / 定时 / 按钮
- 免费 Power-Up 有数量上限

> Trello 5 分钟上手，跨职能友好。

<!--
Trello 是极简看板的代表。
-->

---
layout: two-cols
---

# Linear 工作项模型

| 实体 | 说明 |
|------|------|
| Issue | 最小工作单元 |
| Project | 相关 Issue 集合 |
| Cycle | 时间盒周期 |

- **Cycles**：时间盒迭代，常 1-4 周
- 周期结束未完成项自动归档

::right::

# 键盘优先（核心）

- `Cmd+K`：全局命令面板
- `C` 创建 · `A` 指派 · `S` 改状态
- `#` 加 Label · `P` 设 Priority
- 本地优先 + 同步引擎，近瞬时

**分支命名约定**

```text
shop-123-feat-login
└─ 自动关联 issue
```

> 开 PR 自动改状态，merge 自动关 issue。

<!--
键盘流是 Linear 提效的核心。
-->

---

# 与代码仓库集成

三款都能与 GitHub/GitLab 联动（PR 关联工作项）

- **Jira**：commit/PR 提到 issue key（`SHOP-123`）自动关联
- **Trello**：Power-Up 把 PR 状态挂到卡片
- **Linear**：原生集成，分支命名约定自动关联

**报表与度量**

- Jira：燃尽图、速度图、累积流图
- Linear：Cycle burndown、Insights
- 关键指标：周期时间、吞吐量、在制品（WIP）

> 度量「cycle time / throughput」，而非代码行数。

<!--
工具是方法论的载体，不是方法论本身。
-->

---

# AI 与治理

- **Atlassian Intelligence**（Jira/Trello）：AI 总结、写描述、智能 JQL
- **Linear Agents**：Triage 自动分类路由、Code Intelligence

| 维度 | Jira | Trello | Linear |
|------|------|------|------|
| 权限粒度 | 极细（字段级） | 看板级 | 团队/项目级 |
| 自托管 | Data Center | 无 | 无 |
| 合规 | SOC2/ISO/HIPAA | 同 Jira | Enterprise |

> 超大企业 + 强合规 + 自托管 → Jira Data Center。

<!--
Atlassian AI 偏辅助写，Linear 偏流程自动化。
-->

---
layout: quote
---

# 三款工具的精髓

「Jira 治理复杂流程、Trello 极简跨职能、Linear 键盘优先速度极快——选型不在工具强弱，而在团队规模、流程复杂度与体验取向。」

---
layout: center
class: text-center
---

# 小结

项目管理 = 工作项 + 看板 + 流转

**Jira 重 · Trello 轻 · Linear 快**

[Jira](https://support.atlassian.com/jira-software-cloud/) · [Trello](https://trello.com/guide) · [Linear](https://linear.app/docs)

<!--
工具用法归本叶，敏捷方法论归软件工程章。
-->
