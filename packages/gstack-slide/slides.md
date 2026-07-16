---
theme: seriph
background: https://cover.sli.dev
title: gstack
info: |
  把 Claude Code 变成一支虚拟工程团队：23 角色 + 8 工具，一套冲刺流程。
  garrytan/gstack，MIT。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# gstack

把 Claude Code 变成一支**虚拟工程团队**——23 个角色，一套冲刺流程

<div class="pt-6 opacity-80">
Garry Tan · CEO / 工程经理 / 设计师 / 审查员 / QA / 安全官 / 发布工程师 · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/garrytan/gstack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
gstack 是 Garry Tan 开源的 Claude Code 技能集。核心立意：把单个 AI 助手变成一支虚拟工程团队，23 个角色各做一条 slash 命令，串成一套软件冲刺流程。
-->

---
transition: fade-out
---

# 立意：一次冲刺本该有很多角色

不是「让 AI 多写代码」，而是「给每个角色一条命令」

<v-clicks>

- 重新思考产品的 **CEO**（`/plan-ceo-review`）
- 锁架构的**工程经理**（`/plan-eng-review`）
- 抓 AI slop 的**设计师**（`/plan-design-review`）
- 找生产 bug 的**审查员**（`/review`）
- 开真浏览器的 **QA**（`/qa`）
- 跑 OWASP+STRIDE 的**安全官**（`/cso`）
- 发 PR 的**发布工程师**（`/ship`）

</v-clicks>

<div v-click class="mt-3 text-center">

你像 CEO 管团队那样管这些 AI 专家：只盯要紧决策，其余放手。

</div>

<style>
h1 { background: linear-gradient(45deg, #ea580c 10%, #ca8a04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
立意很清晰：一次软件冲刺本该有很多角色——CEO、工程经理、设计师、审查员、QA、安全官、发布工程师。gstack 把它们各做成一条命令，你像 CEO 管团队一样管它们。
-->

---
transition: fade-out
---

# 冲刺七阶段：技能链式衔接

gstack 是一套**流程**，不是一堆工具

<div class="text-center text-lg mt-4 mb-4 font-mono">
Think → Plan → Build → Review → Test → Ship → Reflect
</div>

<v-clicks>

- `/office-hours` 写的设计文档 → `/plan-ceo-review` 读
- `/plan-eng-review` 写的测试计划 → `/qa` 接手
- `/review` 抓的 bug → `/ship` 核实已修

</v-clicks>

<div v-click class="mt-4 text-center">

没有东西掉链子——**每一步都知道前一步做了什么**。

</div>

<style>
h1 { background: linear-gradient(45deg, #ea580c 10%, #ca8a04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
最重要的一张：gstack 是流程不是工具堆。技能按冲刺顺序跑，每个喂给下一个。office-hours 的设计文档喂给 ceo-review，eng-review 的测试计划被 qa 接手。环环相扣不掉链。
-->

---
transition: fade-out
---

# 一条冲刺跑到底

你说「日报应用」，agent 说「你在建幕僚长 AI」

```
You:  /office-hours 我想做一个日历日报应用
Claude: [追问痛点——要具体例子而非假设]
        [把「日报应用」重构为「个人 AI 幕僚长」]
        [写设计文档 → 自动喂给下游]

You:  /plan-ceo-review    # 找藏在需求里的「10 星产品」
You:  /plan-eng-review    # 锁架构、数据流、测试矩阵
You:  Approve. Exit plan mode.   # 写 2400 行 / 11 文件 / ~8 分钟
You:  /review             # 抓过 CI 却会炸生产的 bug
You:  /qa https://staging # 真浏览器点击流程，发现并修
You:  /ship               # 同步 main、测试、发 PR
```

<div v-click class="mt-2 text-center">

它听的是你的**痛点**，不是你的功能需求。八条命令端到端。

</div>

<style>
h1 { background: linear-gradient(45deg, #ea580c 10%, #ca8a04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
用一条真实冲刺演示：从 office-hours 到 ship 八条命令。亮点是 office-hours 会重构你的框架——你说日报应用，它听出你要的是幕僚长 AI，因为它听痛点不听功能需求。
-->

---
transition: fade-out
---

# Think + Plan：想清楚，锁方案

| 技能 | 角色 | 做什么 |
| --- | --- | --- |
| `/office-hours` | YC Office Hours | 6 逼问，重构产品、挑战前提 |
| `/plan-ceo-review` | CEO | 找「10 星产品」，4 模式：扩张/守范围/缩减 |
| `/plan-eng-review` | 工程经理 | 锁架构、数据流、测试矩阵、失败模式 |
| `/plan-design-review` | 高级设计师 | 每维度 0-10 打分 + AI Slop 检测 |
| `/autoplan` | 评审流水线 | 自动跑 CEO→design→eng→DX，只抛品味决策 |

<style>
h1 { background: linear-gradient(45deg, #ea580c 10%, #ca8a04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Think 和 Plan 阶段的角色。office-hours 逼问重构产品，ceo-review 找 10 星产品，eng-review 锁架构。懒得一个个跑？autoplan 一条命令自动串起来，只把需要你品味判断的决策抛给你。
-->

---
transition: fade-out
---

# Review：跨模型交叉审查

同一份 diff，两个不同模型看

| 技能 | 角色 | 做什么 |
| --- | --- | --- |
| `/review` | 资深工程师（Claude） | 抓过 CI 却炸生产的 bug，自动修明显的 |
| `/codex` | 第二意见（OpenAI Codex） | 独立审查：门禁/对抗挑战/开放咨询 |
| `/investigate` | 调试者 | 无调查不修复，3 次失败即停 |

<div v-click class="mt-4">

> `/review`（Claude）+ `/codex`（OpenAI）都跑过后，得到跨模型分析：哪些发现重叠、哪些各自独有——一个模型的盲区另一个可能看见。

</div>

<style>
h1 { background: linear-gradient(45deg, #ea580c 10%, #ca8a04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Review 阶段的亮点是跨模型审查：review 用 Claude，codex 用 OpenAI Codex，同一 diff 两个不同模型看，互补盲区。investigate 有铁律「无调查不修复」，3 次失败即停避免瞎改。
-->

---
transition: fade-out
---

# Test：给 agent 一双眼睛

`/qa` 用**真** Chromium，不是猜

<v-clicks>

- **真浏览器**：真点击、真截图，~100ms/命令
- **发现即修复**：找到 bug 就原子提交修复，再核实
- **自动回归测试**：每个 bug 修复自动生成回归测试
- `/benchmark`：Core Web Vitals、资源大小，每个 PR 前后对比

</v-clicks>

<div v-click class="mt-4 text-center">

作者说 `/qa` 让他从 6 个并行 worker 涨到 12 个——「agent 有眼睛了」。

</div>

<style>
h1 { background: linear-gradient(45deg, #ea580c 10%, #ca8a04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Test 阶段核心是 qa：它开真 Chromium 浏览器，真点击真截图，发现 bug 就修、再核实、还自动生成回归测试。作者说这是个大解锁——agent 终于有眼睛了，让他从 6 个并行 worker 涨到 12 个。
-->

---
transition: fade-out
---

# 该用哪个 review？

按「给谁建」选评审角色

| 给谁建 | 计划阶段（写码前） | 实时审计（上线后） |
| --- | --- | --- |
| **终端用户**（UI/web/移动） | `/plan-design-review` | `/design-review` |
| **开发者**（API/CLI/SDK） | `/plan-devex-review` | `/devex-review` |
| **架构**（数据流/性能/测试） | `/plan-eng-review` | `/review` |
| **以上全部** | `/autoplan`（自动判定） | — |

<div v-click class="mt-3 text-center">

像管得好的初创：CEO 不用看基础设施 bug，设计评审不用管后端改动。

</div>

<style>
h1 { background: linear-gradient(45deg, #ea580c 10%, #ca8a04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
这么多 review 用哪个？按你在给谁建来选：终端用户用 design，开发者用 devex，架构用 eng。全都要就用 autoplan 自动判定。就像管得好的初创，合适的人看合适的事。
-->

---
transition: fade-out
---

# 安全护栏：按需开启

prod 工作时的刹车

| 技能 | 作用 |
| --- | --- |
| `/careful` | 危险命令预警（`rm -rf`、`DROP TABLE`、force-push） |
| `/freeze` | 锁编辑到一个目录，防误改无关代码 |
| `/guard` | `/careful` + `/freeze` 合一 |
| `/unfreeze` | 解除 freeze |

<div v-click class="mt-3">

浏览器侧还有**提示注入防御**：本地 ML 分类器扫每页 + canary token 抓外泄 + 双分类器一致才拦（防单模型误报）。

</div>

<style>
h1 { background: linear-gradient(45deg, #ea580c 10%, #ca8a04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
安全护栏按需开：careful 预警危险命令，freeze 锁编辑范围，guard 两者合一。浏览器侧还有提示注入防御，双分类器一致才拦截，避免单模型误报。
-->

---
transition: fade-out
---

# ETHOS：Boil the Ocean

注入每个工作流技能前言的哲学

<div v-click>

> 「『别啃下整片海』是工程时间是瓶颈时的对的建议。那个时代结束了。AI 让完整性的边际成本趋近于零——当完整实现只比捷径多花几分钟，就做完整的那个。」

</div>

<div v-click class="mt-3">

| 任务 | 人类团队 | AI 辅助 | 压缩比 |
| --- | --- | --- | --- |
| 样板/脚手架 | 2 天 | 15 分 | ~100× |
| 测试编写 | 1 天 | 15 分 | ~50× |
| 功能实现 | 1 周 | 30 分 | ~30× |
| 架构设计 | 2 天 | 4 时 | ~5× |

</div>

<style>
h1 { background: linear-gradient(45deg, #ea580c 10%, #ca8a04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
gstack 的哲学写在 ETHOS：Boil the Ocean。当 AI 让完整性成本趋零，过去团队跳过的最后 10% 完整性现在只花几秒，所以别跳。但注意：这指把该做的做完整，不是无限揽范围。
-->

---
transition: fade-out
---

# 理性看待：LOC 生产力争议

学它的**方法论**，别把数字当承诺

<v-clicks>

- README 大量援引作者个人产出（如「逻辑行 810× 于 2013」）
- 作者**承认原始 LOC 被 AI 膨胀**，改用「逻辑行」度量 + 附方法论与复现脚本
- 但这仍是**单个高强度用户的极端个案**，非普适生产力

</v-clicks>

<div v-click class="mt-4 text-center text-lg">

gstack 的工程价值在**角色化冲刺方法论**——明确职责、链式交接、多重审查、真浏览器 QA、安全护栏。

</div>

<style>
h1 { background: linear-gradient(45deg, #ea580c 10%, #ca8a04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
必须理性看待 LOC 争议。作者宣称的高产出用逻辑行度量、附了方法论，但仍是个人极端案例。本课的立场很明确：学 gstack 的角色化流程方法论，别把那些生产力数字当成对你的承诺。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 规模化：多 agent、团队、并行

一条冲刺很好，十条才有意思

::left::

<div v-click>

**多 agent + 团队**

- 支持 10 家 agent（`--host`）
- `--team` 模式：整仓库自动获得
- 限流静默自更新

</div>

::right::

<div v-click>

**并行冲刺**

- 配合 Conductor
- 隔离工作区，10-15 个同时跑
- 一个想点子、一个审 PR、一个测 staging

</div>

::bottom::

<div v-click class="mt-3 text-center">

冲刺结构是并行的前提——**没有流程，十个 agent 是十个混乱源**。

</div>

<style>
h1 { background: linear-gradient(45deg, #ea580c 10%, #ca8a04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
规模化三条线：多 agent 支持 10 家、团队模式让整仓库自动获得、配合 Conductor 并行 10-15 个隔离冲刺。关键洞察：正是冲刺流程让并行可控，没有流程十个 agent 就是十个混乱源。
-->

---
layout: center
class: text-center
---

# 一句话记住

**gstack 把 Claude Code 变成一支团队：Think→Plan→Build→Review→Test→Ship→Reflect，23 角色链式衔接。价值在流程，不在 LOC 数字。**

<div class="mt-8 opacity-80">

角色化冲刺 · 跨模型审查 · 真浏览器 QA · 安全护栏 · Boil the Ocean

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/garrytan/gstack" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://gstacks.org" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #ea580c 10%, #ca8a04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。gstack 把 Claude Code 变成一支团队，用 Think 到 Reflect 七阶段串起 23 个角色。记住：它的价值在角色化流程方法论，不在那些生产力数字。
-->
