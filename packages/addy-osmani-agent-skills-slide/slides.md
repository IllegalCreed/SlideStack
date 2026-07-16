---
theme: seriph
background: https://cover.sli.dev
title: Addy Osmani Agent Skills
info: |
  生产级工程技能：6 阶段生命周期 + 反合理化 + 证据要求 + Google 工程文化。
  addyosmani/agent-skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Addy Osmani Agent Skills

**生产级**工程技能——把资深工程师的纪律，装进 AI agent

<div class="pt-6 opacity-80">
Addy Osmani（Google）· 6 阶段 24 技能 · 反合理化 + 证据要求
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/addyosmani/agent-skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Addy Osmani 的 agent-skills，生产级工程技能。它把资深工程师的工作流、质量门、最佳实践编码成 24 个结构化技能，让 AI agent 一致地遵循。
-->

---
transition: fade-out
---

# 为什么需要它

AI agent 默认走**最短路径**

<v-clicks>

- 最短路径常意味着：跳过 spec、跳过测试、跳过安全审查
- 跳过让软件可靠的实践 → 原型质量，不是生产质量
- 结果：能跑一次的 demo，撑不住生产

</v-clicks>

<div v-click class="mt-6 text-center text-xl">

Agent Skills 给 agent 结构化工作流，强制它带**资深工程师的纪律**。

</div>

<style>
h1 { background: linear-gradient(45deg, #0284c7 10%, #4f46e5 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
问题：AI agent 默认走最短路径——跳过 spec、测试、安全审查。结果是原型质量。Agent Skills 给结构化工作流，强制带资深工程师的纪律，把原型质量拉到生产质量。
-->

---
transition: fade-out
---

# 6 阶段生命周期，8 命令入口

```text
 DEFINE     PLAN      BUILD     VERIFY    REVIEW     SHIP
  /spec  →  /plan  →  /build  →  /test  →  /review →  /ship
```

<div class="mt-3 text-sm">

| 阶段 | 命令 | 原则 |
| --- | --- | --- |
| DEFINE | `/spec` | Spec 先于代码 |
| PLAN | `/plan` | 小而原子的任务 |
| BUILD | `/build`（`/build auto`）| 一次一片 |
| VERIFY | `/test` | 测试即证据 |
| REVIEW | `/review` `/webperf` `/code-simplify` | 改善代码健康 |
| SHIP | `/ship` | 更快即更安全 |

</div>

<div v-click class="mt-2 text-center text-sm opacity-80">

设计 API 自动触发 api-and-interface-design，建 UI 触发 frontend-ui-engineering。

</div>

<style>
h1 { background: linear-gradient(45deg, #0284c7 10%, #4f46e5 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
6 阶段 DEFINE 到 SHIP，8 个 slash 命令作入口。spec 先于代码、小原子任务、测试即证据、更快即更安全。技能还会按你在做什么自动激活。
-->

---
transition: fade-out
---

# 每个技能：六段式解剖

两段最有特色——反合理化 + 证据要求

```text
SKILL.md
├─ Overview         → 做什么
├─ When to Use      → 触发条件
├─ Process          → 分步工作流
├─ Rationalizations → 借口 + 反驳  ★
├─ Red Flags        → 出问题的迹象
└─ Verification     → 证据要求      ★
```

<v-clicks>

- **process not prose**——技能是工作流（步骤/检查点/退出判据），不是拿来读的文档
- **渐进披露**——SKILL.md 是入口，支撑参考按需加载

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #0284c7 10%, #4f46e5 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
每个技能六段式：Overview、When、Process、Rationalizations、Red Flags、Verification。两段最特别：反合理化和证据要求。技能是流程不是散文，agent 跟着步骤走。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 两大杀手锏

堵偷懒 + 要证据

::left::

<div v-click>

**反合理化（Rationalizations）**

每技能列 agent 常用的跳步借口 + 反驳：

- 「测试以后再补」→ 反驳
- 「这个边界不会发生」→ 反驳

当 agent 想跳步，技能已预置驳斥。

</div>

::right::

<div v-click>

**证据要求（Verification）**

每技能以证据收尾：

- 测试通过
- 构建输出
- 运行时数据

**「seems right」永远不够。**

</div>

::bottom::

<div v-click class="mt-4 text-center">

把「声称完成」变成「拿证据证明完成」。

</div>

<style>
h1 { background: linear-gradient(45deg, #0284c7 10%, #4f46e5 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
两大杀手锏：反合理化堵偷懒——每技能预置 agent 跳步借口的反驳；证据要求要真凭实据——测试通过、构建输出、运行时数据，seems right 永远不够。把声称完成变成证明完成。
-->

---
transition: fade-out
---

# 内嵌 Google 工程文化

不是抽象原则，是嵌进步骤的具体约束

| 实践 | 出现在 |
| --- | --- |
| **Hyrum's Law** | API 设计 |
| **Beyoncé Rule** | 测试（喜欢就加个测试） |
| **测试金字塔 80/15/5** | test-driven-development |
| **Chesterton's Fence** | code-simplification |
| **trunk-based** | git-workflow |
| **Shift Left** + feature flag | ci-cd |
| **代码即负债** | deprecation-and-migration |

<style>
h1 { background: linear-gradient(45deg, #0284c7 10%, #4f46e5 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
技能内嵌 Google 工程文化：Hyrum's Law 进 API 设计、Beyoncé Rule 和测试金字塔进测试、Chesterton's Fence 进简化、trunk-based 进 git、Shift Left 进 CI/CD、代码即负债专设一个废弃技能。都是嵌进步骤的具体约束。
-->

---
transition: fade-out
---

# Distinctive 技能

几个特别值得一提的

<v-clicks>

- **`interview-me`** —— 一次一问访谈，挖真实需求到 ~95% 置信（触发「grill me」）
- **`source-driven-development`** —— 每个框架决策**扎根官方文档**，引用来源、标注未验证
- **`doubt-driven-development`** —— 对抗性 fresh-context 审查：**CLAIM → EXTRACT → DOUBT → RECONCILE → STOP**，高风险时用
- **`context-engineering`** —— 在对的时间喂 agent 对的信息

</v-clicks>

<div v-click class="mt-3 text-center text-sm opacity-80">

`/build auto` 自主实现每个任务——但仍逐个 test-driven + commit，失败/风险处暂停。

</div>

<style>
h1 { background: linear-gradient(45deg, #0284c7 10%, #4f46e5 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
几个特别的技能：interview-me 一次一问挖真实需求；source-driven 每个框架决策扎根官方文档；doubt-driven 对抗性审查 CLAIM-EXTRACT-DOUBT-RECONCILE-STOP。build auto 自主但仍 test-driven，失败暂停。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Addy Osmani Agent Skills：6 阶段 24 生产级技能，每个带反合理化借口表 + 证据要求，把 Google 工程纪律装进 agent。**

<div class="mt-8 opacity-80">

生产级 · 6 阶段 · 反合理化 · 证据非可选 · Google 工程文化

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/addyosmani/agent-skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://github.com/addyosmani/agent-skills/blob/main/docs/skill-anatomy.md" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #0284c7 10%, #4f46e5 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Addy Osmani Agent Skills：6 阶段 24 个生产级技能，每个带反合理化借口表和证据要求，把 Google 工程纪律装进 agent。核心是证据非可选、反合理化堵偷懒。
-->
