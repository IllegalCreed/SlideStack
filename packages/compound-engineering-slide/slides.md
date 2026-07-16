---
theme: seriph
background: https://cover.sli.dev
title: Compound Engineering
info: |
  每单元工程使下一单元更易：80% 规划审查 / 20% 执行 + 知识复利。
  EveryInc/compound-engineering-plugin。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Compound Engineering

每一单元工程工作，都让**下一单元更容易**——不是更难

<div class="pt-6 opacity-80">
Every（Kieran Klaassen）· 80% 规划审查 / 20% 执行 · 知识复利
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/EveryInc/compound-engineering-plugin" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Compound Engineering 是 Every 团队的 Claude Code 技能插件。核心一句话：每单元工程工作让下一单元更容易。它把配比倒过来——80% 规划审查、20% 执行，还用知识复利让工具越用越聪明。
-->

---
transition: fade-out
---

# 传统开发 vs 复利工程

技术债 vs 复利——方向相反

<div class="grid grid-cols-2 gap-6 mt-6">
<div v-click>

**传统：累积技术债**

- 每个功能加复杂度
- 每个 bug 留下本地知识要人重学
- 代码库越来越难 hold
- 下次改动越来越**慢**

</div>
<div v-click>

**复利：每单元使下次更易**

- 好 brainstorm 让 plan 更锐
- 好 plan 让执行更小
- 好 review 抓模式不只 bug
- compound note 让下个 agent 不重学

</div>
</div>

<div v-click class="mt-6 text-center text-xl">

配比反转：**80% 规划与审查，20% 执行**。

</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0d9488 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
核心对比：传统开发累积技术债，每次改动越来越慢；复利工程反过来，每单元使下次更易。关键手段是配比反转——80% 花在规划审查，20% 才是执行。
-->

---
transition: fade-out
---

# 核心 6 步复利循环

跑完一圈，带着更好的上下文跑下一圈

```text
/ce-brainstorm  →  /ce-plan  →  /ce-work
     ↑                              ↓
/ce-compound  ←  /ce-code-review  ←  /ce-simplify-code
```

<v-clicks>

- **brainstorm** 想清需求 → **plan** 变可实施 → **work** 执行
- **simplify** 精简 → **review** 多 agent 审查 → **compound** 沉淀 learning
- `/ce-compound` 写进 `docs/solutions/`，下轮 brainstorm/plan **读它做 grounding**

</v-clicks>

<div v-click class="mt-3 text-center">

那根**返回箭头**才是全部意义——下一圈从更聪明处起步。

</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0d9488 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
核心是六步循环：brainstorm 想清、plan 落地、work 执行、simplify 精简、review 审查、compound 沉淀。最关键是那根返回箭头——compound 写的 learnings 被下一轮读作 grounding，下圈从更聪明处起步。
-->

---
transition: fade-out
---

# compound：系统带记忆

每个 PR 教系统，每个 bug 成永久教训

| 工件 | 教谁 | 是什么 |
| --- | --- | --- |
| **Learning**（solution doc） | 库的未来工作 | 过去问题的解法，带元数据供检索 |
| **Pattern doc** | 库的未来工作（更广） | 从多个 Learning 泛化的规则 |
| **Explainer** | 开发者**本人** | 写给你的密集教学 + check-in 预测-揭示 |

<div v-click class="mt-4 text-center">

Learning 教库的未来工作，Explainer 教人——agent 写代码时，你也在学。

</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0d9488 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
compound 的记忆分三种工件：Learning 是过去问题的解法喂给库的未来工作；Pattern doc 是从多个 Learning 泛化的规则；Explainer 教开发者本人。这样 agent 写代码时人也在学。
-->

---
transition: fade-out
---

# `/lfg`：自主流水线

先 brainstorm，再放手

```text
/ce-brainstorm describe the feature
/lfg
```

<v-clicks>

- plan → work → simplify → 跑代码审查并**应用修复**
- → 跑浏览器测试 → commit → push → **开 PR**
- → 盯 CI 并修复失败**直到变绿**

</v-clicks>

<div v-click class="mt-4 text-center">

走开，回来看到一个**开好的绿 PR**。先 brainstorm 让它对着真需求规划。

</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0d9488 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
/lfg 是标准循环的自动驾驶版：plan、work、simplify、审查+修复、浏览器测试、commit、push、开 PR、盯 CI 修到绿。关键是先 brainstorm 再 lfg，让它对真需求规划而非一句话 prompt。
-->

---
transition: fade-out
---

# 完整流水线：不止核心循环

围绕循环的上下游技能

| 技能 | 位置 | 做什么 |
| --- | --- | --- |
| `/ce-ideate` | 循环**前** | 还没想法时，生成并排名有依据的候选 |
| `/ce-strategy` | 上游**锚** | 维护 STRATEGY.md，被 ideate/plan 读 |
| `/ce-debug` | **替代**循环 | 输入是 bug 时：复现→根因→修 |
| `/ce-product-pulse` | 外循环 | 用户实际体验报告，回流 ideation |
| `/ce-explain` | 随时 | 产 explainer 让你保持学习 |

<div v-click class="mt-2 text-sm opacity-80 text-center">

共 30 个 `/ce-*` 技能，每个交耐用工件给下一阶段。

</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0d9488 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
除核心循环，还有围绕它的技能：没想法时 ideate、战略锚 strategy、bug 走 debug、用户体验回流 product-pulse、保持学习 explain。共 30 个技能，每个交耐用工件给下一阶段。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 定位与反模式

opinionated by design——为长期杠杆付前期功夫

::left::

<div v-click>

**适合**

- 长期维护、要知识不流失的库
- 认同 80/20 哲学
- 想要 `/lfg` 自主体验
- 团队固化规划+审查+复利

</div>

::right::

<div v-click>

**反模式**

- 跳过 compound 直接下一轮（丢复利）
- `/lfg` 前不 brainstorm
- 简单一行改动也走全流程
- Pattern doc 不刷新（陈旧风险高）

</div>

::bottom::

<div v-click class="mt-3 text-center">

一行 typo 别上 80/20；长期项目才见复利。

</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0d9488 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
它是强观点设计，为长期杠杆付前期功夫。适合长期维护的库、认同 80/20 的人。反模式：跳过 compound 丢复利、lfg 前不 brainstorm、简单改动也走全流程。一行 typo 别上，长期项目才见复利。
-->

---
layout: center
class: text-center
---

# 一句话记住

**每单元工程使下一单元更易：80% 规划审查 / 20% 执行，`/ce-compound` 沉淀 learning 让工具越用越聪明。**

<div class="mt-8 opacity-80">

复利哲学 · 6 步循环 · Learning 记忆 · /lfg 自主 · 反技术债

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/EveryInc/compound-engineering-plugin" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://every.to/chain-of-thought/compound-engineering-how-every-codes-with-agents" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0d9488 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。记住：每单元工程使下一单元更易，80% 规划审查 20% 执行，用 ce-compound 沉淀 learning 让工具越用越聪明。这就是 compound engineering 的全部。
-->
