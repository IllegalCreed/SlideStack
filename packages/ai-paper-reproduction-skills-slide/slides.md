---
theme: seriph
background: https://cover.sli.dev
title: AI 论文复现 Skills
info: |
  用 AI agent 自动复现 AI/ML 论文的实验与代码。
  方法论叶：PaperBench 基准 + DeepCode/AutoReproduce/paper-replicate-agent 生态。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# AI 论文复现 Skills

用 agent 复现论文——**从读懂到跑通**的全流程方法论

<div class="pt-6 opacity-80">
方法论叶 · PaperBench · DeepCode 84.8% · AutoReproduce · paper-replicate-agent
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<style>
h1 { background: linear-gradient(45deg, #1e3a8a 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
AI 论文复现 Skills 是一类方法论技能——用 AI agent 自动复现 AI/ML 论文的实验与代码。没有单一官方仓库，社区以 PaperBench 基准 + DeepCode/AutoReproduce/paper-replicate-agent 生态为代表。
-->

---
transition: fade-out
---

# 这是什么

方法论叶，无单一官方仓

<v-clicks>

- **目标**：让 agent 把一篇 AI/ML 论文的实验**复现**出来
- **流程**：理解论文 → 还原环境 → 写代码 → 跑实验 → 对齐指标 → 报告差异
- **生态代表**：
  - PaperBench（OpenAI 基准，Claude 第一）
  - DeepCode（港大，PaperBench 84.8%）
  - AutoReproduce（Paper Lineage）
  - paper-replicate-agent（Claude Code 指令模板）
- **不是**：某个具体的官方仓库、也不是通用 ML 训练框架

</v-clicks>

<div v-click class="mt-4 text-center text-sm opacity-80">

核心是**复现工作流**本身，工具任选其一即可落地。

</div>

<style>
h1 { background: linear-gradient(45deg, #1e3a8a 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
这页讲清楚定位：方法论叶，不是某个具体仓库。目标是让 agent 把论文实验复现出来，核心是工作流，工具任选其一。
-->

---
transition: fade-out
---

# PaperBench：权威基准

OpenAI 提出的人类级复现挑战

<v-clicks>

- **要求 agent 完整复现**一篇 ICML/NeurIPS/ICLR 论文
- 流程：**论文理解 → 代码库开发 → 实验执行 → 调试**
- **人类专家需数天**——难度真实
- **Claude 在该榜第一**（通用 agent 里最强）
- 用途：**衡量能力**，不是直接拿来复现的工具

</v-clicks>

<div v-click class="mt-4 text-center">

意义：让「能不能复现论文」从主观感觉变成**可量化分数**。

</div>

<style>
h1 { background: linear-gradient(45deg, #1e3a8a 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
PaperBench 是 OpenAI 提出的论文复现基准，要求 agent 完整复现一篇顶会论文，人类专家也要数天。Claude 在这个榜上是通用 agent 第一。它的意义是把复现能力变成可量化的分数。
-->

---
transition: fade-out
---

# 复现率对比

谁更强？

| 工具 | PaperBench | 说明 |
| --- | --- | --- |
| **DeepCode**（港大） | **84.8%** | SOTA，GitHub 8k+ 星 |
| Claude Code | 58.7% | 通用 agent 强基线 |
| PaperCoder | ~51.1% | 对比基线 |

<div v-click class="mt-4">

**关键事实**：

- DeepCode 领先 Claude Code 约 **26 个百分点**
- **首次在论文复现代码任务上超过剑桥、伯克利等高校的 ML 博士**
- DeepCode 适合直接拿来跑，PaperBench 只用来评测

</div>

<style>
h1 { background: linear-gradient(45deg, #1e3a8a 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
对比三家：DeepCode 84.8% 是 SOTA，领先 Claude Code 约 26 个百分点，首次超过剑桥伯克利的 ML 博士。注意 PaperBench 是评测基准，DeepCode 才是拿来跑的 agent。
-->

---
transition: fade-out
---

# 复现工作流六步

无论用哪个工具，共识流程

<v-clicks>

1. **理解**——抽方法 / 数据 / 指标 / 超参
2. **环境**——还原 Python/CUDA/依赖版本
3. **代码**——实现模型、训练/评估循环
4. **执行**——跑实验、log 指标、保存 checkpoint
5. **对齐**——与论文指标对比、判容差
6. **报告**——写差异分析、记录未公开超参

</v-clicks>

<div v-click class="mt-4 text-center text-sm opacity-80">

AutoReproduce 的 **Paper Lineage** 会把这六步每步决策留痕，便于审计。

</div>

<style>
h1 { background: linear-gradient(45deg, #1e3a8a 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
六步工作流：理解、环境、代码、执行、对齐、报告。无论用哪个工具，流程都是这样。AutoReproduce 的 Paper Lineage 会把每步决策留痕。
-->

---
transition: fade-out
---

# 第 1-3 步深入

理解、环境、代码

<div class="grid grid-cols-3 gap-4 mt-2">
<div>

**1 理解**

- 方法：架构/loss/forward
- 数据：集/预处理/批大小
- 指标：用哪个数对比
- 超参：lr/warmup/epoch

坑：超参藏附录

</div>
<div>

**2 环境**

```bash
python -m venv .venv
pip install torch==2.x
nvidia-smi
```

锁 Python/CUDA/驱动
用容器或锁文件固化

</div>
<div>

**3 代码**

- 模型定义
- DataLoader
- 训练循环
- 评估循环
- checkpoint

坑：伪代码 ≠ 实现

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #1e3a8a 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
前三步：理解抽要素、环境锁版本、代码实现循环。坑分别是超参藏附录、版本不匹配、伪代码与实现有差距。
-->

---
transition: fade-out
---

# 第 4-6 步深入

执行、对齐、报告

<div class="grid grid-cols-3 gap-4 mt-2">
<div>

**4 执行**

- 固定随机种子
- log 每 epoch 指标
- 多 seed 平均（≥3）
- 监控显存/时间

</div>
<div>

**5 对齐**

```text
指标     论文    复现    差异
Acc     87.3%  86.8%  -0.5pp ✅
FID     12.4   14.1   +1.7   ⚠️
```

容差无共识——看相对趋势

</div>
<div>

**6 报告**

- 复现了哪些表/图
- 差异原因
- 未公开超参处理
- 可重复命令

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #1e3a8a 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
后三步：执行固定种子跑实验、对齐对比指标判容差、报告写差异分析。容差无共识，看相对趋势。
-->

---
transition: fade-out
---

# AutoReproduce：Paper Lineage

把复现每步决策留痕

<v-clicks>

- **是什么**：论文谱系——追溯复现过程的每个选择
- **记录什么**：
  - 为什么选这个超参（猜测依据）
  - 为什么跳过某步（数据/算力）
  - 哪些代码来自官方、哪些是补的
  - 每次实验的种子/配置/结果

</v-clicks>

<div v-click class="mt-4 text-center">

**用途**：事后审计 · 复现报告 · 改进复现流程

</div>

<div v-click class="mt-3 text-sm opacity-80">

适合科研合规、需要可追溯的复现场景。

</div>

<style>
h1 { background: linear-gradient(45deg, #1e3a8a 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
AutoReproduce 的 Paper Lineage 把复现每步决策留痕：超参猜测依据、跳过原因、代码来源、实验配置。适合需要审计和可追溯的场景。
-->

---
transition: fade-out
---

# 生态五件套

各司其职

<div class="grid grid-cols-2 gap-4 mt-2">
<div>

**基准**

- **PaperBench**（OpenAI）
  衡量 agent 复现能力

**agent 框架**

- **DeepCode**（港大，84.8%）
  端到端复现
- **AutoReproduce**
  Paper Lineage 追溯
- **PaperCoder**（51.1%）
  对比基线

</div>
<div>

**指令模板**

- **paper-replicate-agent**
  Claude Code 当「研究承包商」

**怎么选**：

- 评测自己 → 跑 PaperBench
- 直接复现 → DeepCode
- 要审计 → AutoReproduce
- 给现有 agent 装 → 指令模板

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #1e3a8a 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
五件套：PaperBench 是基准，DeepCode/AutoReproduce/PaperCoder 是 agent 框架，paper-replicate-agent 是 Claude Code 指令模板。按需求选。
-->

---
transition: fade-out
---

# paper-replicate-agent：研究承包商

给 Claude Code 一段明确指令

```text
你是研究承包商：
1. 读这篇论文 PDF
2. 用我提供的数据复现核心结果
3. 输出可重复的 R/Python 代码
4. 跑实验、验证输出
5. 记录差异并报告（不假装完美复现）
```

<div v-click class="mt-4">

特点：

- **无需换框架**——装进现有 Claude Code/Cursor
- 输入：论文 PDF + 数据
- 输出：可重复代码 + 质量报告
- 关键：**诚实记录差异**

</div>

<style>
h1 { background: linear-gradient(45deg, #1e3a8a 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
paper-replicate-agent 是社区给 Claude Code 的指令模板，把 agent 当研究承包商用：读论文、写代码、跑实验、记差异。优点是不用换框架。
-->

---
transition: fade-out
---

# 五大难点

复现为什么这么难

| 难点 | 表现 | 应对 |
| --- | --- | --- |
| **数据可得性** | 闭源/受限 | 找替代或注明 |
| **随机种子** | 同代码差 1-2 点 | 固定种子、多 seed 平均 |
| **未公开超参** | 正文不写 | 挖附录/代码/issue |
| **算力** | 大模型成本高 | 小规模验趋势 |
| **模糊描述** | 归一化/激活没写 | 参考惯例、做消融 |

<style>
h1 { background: linear-gradient(45deg, #1e3a8a 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
五大难点：数据、种子、超参、算力、模糊描述。每个都有应对策略。
-->

---
transition: fade-out
---

# 反模式与边界

避免这些坑

<v-clicks>

- **跳过环境固化**——「我机器能跑」≠ 可复现
- **只跑一次**——随机性会误导判断
- **对齐容差拍脑袋**——没标准就扯皮
- **不写差异报告**——「差不多」不叫完成
- **把基准当工具**——PaperBench 衡量能力，不是 agent

</v-clicks>

<div v-click class="mt-4">

**边界**：

- 复现不是抄袭——仅用于学习/验证/对比
- 不替代研究品味——「该复现哪篇」仍靠人判断
- agent 写得出代码 ≠ 跑得起（算力仍是门槛）

</div>

<style>
h1 { background: linear-gradient(45deg, #1e3a8a 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
反模式：跳过环境、只跑一次、拍脑袋容差、不写报告、把基准当工具。边界：复现不是抄袭，不替代研究品味，算力仍是门槛。
-->

---
layout: center
class: text-center
---

# 一句话记住

**用 AI agent 自动复现 AI/ML 论文：六步工作流（理解→环境→代码→执行→对齐→报告），PaperBench 衡量能力，DeepCode 84.8% 是 SOTA，AutoReproduce 追溯谱系，paper-replicate-agent 给 Claude Code 装上「研究承包商」。**

<div class="mt-8 opacity-80">

方法论叶 · 无单一官方仓 · 基准驱动 · 工作流共识 · 谱系可追溯

</div>

<style>
h1 { background: linear-gradient(45deg, #1e3a8a 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。方法论叶，六步工作流，PaperBench 衡量能力，DeepCode 84.8% 是 SOTA，AutoReproduce 追溯谱系，paper-replicate-agent 给 Claude Code 装研究承包商。
-->
