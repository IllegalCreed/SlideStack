---
theme: seriph
background: https://cover.sli.dev
title: Grill Me
info: |
  动工前让 agent 不留情面地盘问你的计划，直到达成共识。
  来自 Matt Pocock 的 Skills For Real Engineers。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Grill Me

动工前，让 agent **不留情面地盘问**你的计划——直到达成共识才开写

<div class="pt-6 opacity-80">
Matt Pocock · Skills For Real Engineers · productivity/grill-me
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/mattpocock/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Grill Me 是 Matt Pocock 最受欢迎的技能。它反转了通常的姿势：不是你给 agent 交代需求，而是 agent 反过来盘问你，在动工前把「你到底要什么」问透。
-->

---
transition: fade-out
---

# 痛点：没人确切知道自己想要什么

> 「No-one knows exactly what they want.」——《程序员修炼之道》

<v-clicks>

- AI 时代最常见的失败：你以为 agent 懂你要什么
- 等它写完，才发现**完全跑偏**——它根本没理解你
- 你和 agent 之间，隔着一道**沟通鸿沟**

</v-clicks>

<div v-click class="mt-6 text-center text-xl">

修法：让 agent **反过来盘问你**，在动工前填平这道鸿沟。

</div>

<style>
h1 { background: linear-gradient(45deg, #dc2626 10%, #ea580c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Grill Me 治的病是 misalignment——AI 编码最常见的失败。你以为交代清楚了，agent 做完才发现跑偏。根源是沟通鸿沟。修法就是让 agent 反过来盘问你。
-->

---
transition: fade-out
---

# 架构：薄封装 + 可复用引擎

grill-me 的 `SKILL.md` 全文只有一句话

```markdown
---
name: grill-me
description: A relentless interview to sharpen a plan or design.
disable-model-invocation: true
---

Run a `/grilling` session.
```

<v-clicks>

- 真正的盘问逻辑在 `grilling` 引擎里（一个 model-invoked 技能）
- 同一个 `grilling` 引擎，被 `grill-me` 和 `grill-with-docs` **共用**
- 这是「用户触发的薄封装 + 可复用引擎」的教科书范式

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #dc2626 10%, #ea580c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
grill-me 本体只有一句「Run a /grilling session」。真正逻辑在可复用的 grilling 引擎里，被 grill-me 和 grill-with-docs 共用。这是薄封装加可复用引擎的经典范式。
-->

---
transition: fade-out
---

# grilling 引擎的五条规则

每一句都在治一种具体病

| # | 规则 | 治什么 |
| --- | --- | --- |
| 1 | 不留情面盘问每个方面，直到共识 | 浅尝辄止就动手 |
| 2 | 沿决策树逐分支，解决决策间依赖 | 只问表面、不理决策牵制 |
| 3 | 一次一问、每问给推荐答案 | 一股脑抛十问令人困惑 |
| 4 | 事实自查环境，决策抛给你 | 拿可自查的事实烦你 |
| 5 | 达成共识前不要动手 | 盘问一半就猜着开写 |

<style>
h1 { background: linear-gradient(45deg, #dc2626 10%, #ea580c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
grilling 引擎的 SKILL.md 只有五句话，但每一句都在治一种病。逐条看：不留情面直到共识、沿决策树逐分支、一次一问给推荐、事实自查决策问你、共识前不动手。
-->

---
transition: fade-out
---

# 一次一个问题，每问给推荐

「一股脑抛十个问题令人困惑」——所以逐个决策推进

<div v-click>

```
You:   /grill-me 我想给应用加「答题历史导出」

Agent: 导出范围是「当前用户」还是「全体」？
       （推荐：先做当前用户，最小可用）
You:   当前用户

Agent: 格式 CSV 还是 JSON？（推荐：CSV，Excel 友好）
You:   CSV

Agent: 大数据量要流式避免内存爆吗？（推荐：>1万行时流式）
You:   要
```

</div>

<div v-click class="mt-3 text-center">

逐个分支走，让你能专注想清楚**每一个决策**。

</div>

<style>
h1 { background: linear-gradient(45deg, #dc2626 10%, #ea580c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
用一段真实对话演示节奏：一次只问一个决策，每个问题都附上 agent 的推荐答案。这样你不会被十个问题淹没，能专注想清楚每一个分支。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 事实自查 vs 决策问你

grilling 与普通「多问几句」的关键差别

::left::

<div v-click>

**事实**（自己查）

能从环境查到的，它自己查——

- 翻代码确认现状
- 用工具查配置
- 读文件看结构

不拿这些来烦你。

</div>

::right::

<div v-click>

**决策**（问你）

只有需要你拍板的，才抛给你——

- 范围/取舍
- 优先级
- 验收标准

每个都等你答复。

</div>

::bottom::

<div v-click class="mt-3 text-center">

聚焦在真正需要你拍板处，不浪费回合确认代码里写着的现状。

</div>

<style>
h1 { background: linear-gradient(45deg, #dc2626 10%, #ea580c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
这是 grilling 最聪明的一条规则：明确区分事实与决策。能查的事实自己查，只把真正需要你拍板的决策抛给你。这让盘问高效，不浪费你的回合去确认代码里明摆着的东西。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 为什么它只能手动触发

`disable-model-invocation: true` 的取舍

::left::

<div v-click>

**grill-me**（user-invoked）

- 只有你 `/grill-me` 才启动
- agent 不自作主张盘问
- 零上下文负载
- 代价：你要记得它存在

</div>

::right::

<div v-click>

**grilling**（model-invoked）

- 带 description、可被自动触发
- 可被其它技能复用
- 持有可复用的盘问纪律

</div>

::bottom::

<div v-click class="mt-3 text-center">

铁律：user-invoked 可调 model-invoked，但**绝不调另一个 user-invoked**。

</div>

<style>
h1 { background: linear-gradient(45deg, #dc2626 10%, #ea580c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
grill-me 是用户触发的编排层，grilling 是模型可触发的引擎层。分工规则：用户触发的技能可以调用模型触发的技能，但绝不调用另一个用户触发的技能。这保证了编排清晰。
-->

---
transition: fade-out
---

# 它治的病：四大失败模式之首

Matt 把 AI 编码失败归为四类，Grill Me 直击第一类

| # | 失败模式 | 修法 |
| --- | --- | --- |
| **1** | **agent 没做出我想要的**（misalignment） | **grill-me / grill-with-docs** |
| 2 | agent 太啰嗦（verbose） | grill-with-docs 的共享语言 |
| 3 | 代码不工作 | tdd / diagnosing-bugs |
| 4 | 建成一团泥（ball of mud） | to-spec / improve-architecture |

<div v-click class="mt-3">

> 「你以为开发者懂你要什么，等看到成品才发现它根本没理解你。AI 时代一模一样——修法就是一场盘问。」

</div>

<style>
h1 { background: linear-gradient(45deg, #dc2626 10%, #ea580c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Matt 把 AI 编码的失败归为四类：跑偏、啰嗦、不工作、一团泥。Grill Me 直击第一类也是最常见的一类——misalignment。对齐先于一切。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 定位：小而可组合，不接管流程

和「重流程框架」划清界限

::left::

<div v-click>

**GSD / BMAD / Spec-Kit**

- 通过**接管流程**来帮忙
- 代价：夺走你的控制权
- 流程里的 bug 难排查

</div>

::right::

<div v-click>

**Grill Me（这套技能）**

- **小、易改、可组合**
- 适配任何模型
- 随手拿起、随手改
- 一块积木，不是仪式

</div>

::bottom::

<div v-click class="mt-3 text-center">

它不是你必须照走的仪式，而是你可以 hack 的积木。

</div>

<style>
h1 { background: linear-gradient(45deg, #dc2626 10%, #ea580c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Matt 明确和 GSD、BMAD、Spec-Kit 这类重流程框架划清界限：它们接管流程、夺走控制权、bug 难查。Grill Me 反其道，做成小而可组合的积木，你随手拿起随手改。
-->

---
transition: fade-out
---

# 对比 Superpowers 的 brainstorming

都在「动工前苏格拉底式反问」，侧重不同

| 维度 | Grill Me | brainstorming |
| --- | --- | --- |
| 触发 | 用户手动 | 自动（新需求即触发） |
| 强度 | relentless 逐决策树分支 | 问范围/约束/优先级/验收 |
| 特色 | 每问给推荐 + 事实自查 + 共识门禁 | mandatory workflow 一环 |
| 哲学 | 小、可组合、不接管流程 | 全流程强制 |

<div v-click class="mt-3 text-center">

要「自动、强制、全流程」选 Superpowers；要「手动、轻量、可 hack」选 Grill Me。可并存。

</div>

<style>
h1 { background: linear-gradient(45deg, #dc2626 10%, #ea580c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
和 Superpowers 的 brainstorming 对比：都在动工前反问，但 brainstorming 是自动触发的强制流程一环，Grill Me 是手动、轻量、可 hack 的积木。想要哪种风格自己选，两者能并存。
-->

---
transition: fade-out
---

# 反模式

| 反模式 | 问题 |
| --- | --- |
| 需求已明确还硬跑 | 盘问变多余，直接做即可 |
| 一股脑回答一堆问题 | 破坏「逐决策」节奏 |
| 当成写代码/出方案工具 | 它只做对齐，产出是共识 |
| 盘问一半就催 agent 开写 | 违背「共识前不动手」 |
| 拿它建文档 | 那是 grill-with-docs 的活 |

<style>
h1 { background: linear-gradient(45deg, #dc2626 10%, #ea580c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
五个反模式。最关键：需求已清楚就别硬跑；它只做对齐不写代码；要文档产物请升级到 grill-with-docs。
-->

---
layout: center
class: text-center
---

# 一句话记住

**动工前 `/grill-me`：逐决策树分支、一次一问给推荐、事实自查决策问你、共识前不动手。**

<div class="mt-8 opacity-80">

对齐先于编码 · 事实/决策分野 · 共识门禁 · 小而可组合

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/mattpocock/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me" target="_blank" class="slidev-icon-btn"><carbon:chat /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #dc2626 10%, #ea580c 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。记住这套盘问的四个动作：逐决策树分支、一次一问给推荐、事实自查决策问你、共识前不动手。对齐先于编码。想要文档产物就用它的升级版 grill-with-docs。
-->
