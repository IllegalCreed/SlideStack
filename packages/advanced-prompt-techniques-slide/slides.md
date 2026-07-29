---
theme: seriph
background: https://cover.sli.dev
title: 高级提示技巧完全指南
info: |
  高级提示技巧完全指南：ReAct · Self-Consistency · Tree of Thoughts · Prompt Chaining · DSP · Prompt Injection

  来源：ReAct / Self-Consistency / ToT / DSP 四篇学术论文 + OWASP LLM01:2025
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 高级提示技巧完全指南

LLM 推理增强型范式 · 6 项技术 · 学术奠基（2022-2023）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
6 项技术覆盖「推理增强」与「提示安全」两大方向，互补而非替代。
-->

---
transition: fade-out
---

# 什么是高级提示技巧

相对基础提示（Zero-shot / Few-shot / CoT）的**推理增强型范式**

- **学术奠基**：ReAct / ToT / Self-Consistency 来自 NeurIPS / ICLR 2022-2023
- **工程升级**：Prompt Chaining 把单次调用升级为可追踪流水线
- **黑盒引导**：DSP 用小 Policy LM 不动 LLM 参数也能定向引导
- **安全边界**：Prompt Injection 是 OWASP LLM01:2025 #1 风险
- **范式已被原生支持**：Claude tool use / OpenAI function calling 内置 ReAct 思想

> 本质：用范式约束推理路径与输出结构，工程层做兜底。

<!--
核心：不是让模型「更聪明」，而是用范式约束 + 工程兜底。
-->

---

# 六项技术全景

| 技术 | 解决问题 | 代表数据 |
|------|------|------|
| **ReAct** | 推理 + 外部工具协同 | 1-2 个 few-shot 超 RL 基线 |
| **Self-Consistency** | 单次贪婪解码不可靠 | GSM8K **+17.9%** |
| **Tree of Thoughts** | 需探索 + 回溯的搜索任务 | 24 点：CoT 4% → ToT **74%** |
| **Prompt Chaining** | 流水线任务 | 三大收益：透明 / 可控 / 可调试 |
| **Directional Stimulus** | 黑盒 LLM 定向引导 | MultiWOZ **+41.4%**（80 条对话） |
| **Prompt Injection** | LLM 应用安全 | OWASP #1 风险 |

> 6 项技术互补而非替代——按任务类型选用。

<!--
按任务类型（推理 / 决策 / 流水线 / 黑盒引导）和阶段（推理优化 vs 安全防护）选用。
-->

---

# ReAct：推理与行动协同

`Thought N → Action N → Observation N` 三段式交错循环到 `Finish`

- **Thought**：内部推理，决定下一步
- **Action**：工具调用（`Search[...]` / `Lookup[...]` / `Finish[答案]`）
- **Observation**：环境反馈，作为下一步推理输入

**与 CoT 的核心区别**

| 维度 | CoT | ReAct |
|------|-----|-------|
| 信息来源 | 仅内部 | 外部工具 |
| 错误纠正 | 不能 | 能 |
| 幻觉风险 | 高 | 低 |

> 论文实证：**ReAct + CoT 混合**最优（纯 CoT 易幻觉、纯 ReAct 过度依赖检索）。

<!--
现代 LLM 已原生支持工具调用，但底层提示范式不变。
-->

---

# ReAct 模板示例

```text
Question: 科罗拉多造山运动东部延伸区域的海拔范围？
Thought 1: 我需要先搜索科罗拉多造山运动
Action 1: Search[科罗拉多造山运动]
Observation 1: 科罗拉多造山运动……
Thought 2: 它没提到东部延伸，我需要查找「东部」
Action 2: Lookup[东部]
Observation 2: ……高地地区……
Thought 3: 高地地区海拔范围是 1800 至 2400 米
Action 3: Finish[1800 至 2400 米]
```

> 工程层加 `max_iterations` 兜底，避免循环不收敛。

<!--
固定结构让工程层能可靠截取 Action 与 Observation。
-->

---

# Self-Consistency：多路径投票

**纯解码阶段策略**，不改变 prompt，不需要额外训练

- **采样**：temperature 0.5-0.7 采样 N 条（典型 5-10）路径
- **生成**：每条路径独立推出最终答案
- **投票**：多数投票（majority vote）聚合

**性能提升**（Wang et al., 2022）

| 任务 | CoT | Self-Consistency | 提升 |
|------|-----|------|------|
| GSM8K | 17.7% | 35.6% | **+17.9%** |
| AQuA | 40.4% | 52.6% | +12.2% |
| StrategyQA | 63.8% | 70.2% | +6.4% |

> 仅适用「离散可验证答案」；开放生成（创意写作）不适用。

<!--
核心假设：多路径收敛到同一正确答案；多数路径错时反而放大错误。
-->

---

# Tree of Thoughts：思维树

四要素 + 树搜索 + 回溯

- **Thought 分解**：问题切成 k 步（24 点分 3 步等式）
- **Thought 生成**：每步 b=5 候选（beam width）
- **状态评估器**：`sure / maybe / impossible` 或 0-1 value，**采样 3 次**
- **搜索算法**：BFS（广度筛选）/ DFS（深入 + 回溯）

**Game of 24 对比**

| 方法 | 成功率 |
|------|------|
| CoT | **4%** |
| ToT (BFS) | **74%** |

> BFS 适合状态可枚举（24 点 / 填字）；DFS 适合深度探索（创意写作）。

<!--
70% 提升来自「评估 + 回溯」——能识别不可能分支并放弃。
-->

---
layout: two-cols
---

# Prompt Chaining

子任务拆解 + 结构化中间标签

- 节点 1 输出 `<quotes>` → 节点 2 输入
- 每节点只做一件事
- 插入**确定性清洗步骤**（去引用 / 截断 / 格式校验）
- 把数据变换交给**代码**而非 LLM

**三大收益**

- 透明度（每步可追踪）
- 可控性（针对薄弱环节调优）
- 可调试性（逐节点定位）

::right::

# Directional Stimulus

小 Policy LM 生成 hint 拼进冻结 LLM

- Policy LM：T5 等小模型
- 目标 LLM：ChatGPT / Codex（冻结）
- 训练：监督微调 / 强化学习
- 把「怎么提示」参数化

**MultiWOZ 数据**

- 仅 **80 条对话** 训练
- ChatGPT **+41.4%**

> 绕开 LLM 微调的成本 / 权限 / 版本漂移。

<!--
Chaining 是工程范式；DSP 是参数化「怎么提示」本身。
-->

---

# Prompt Injection 两分类

OWASP LLM01:2025 #1 风险，与 MITRE ATLAS 对齐

| 类型 | 子类 | 说明 |
|------|------|------|
| **Direct（直接）** | Payload Splitting | 载荷分割绕过关键词过滤 |
| | Adversarial Suffix | 对抗后缀让格式合法但内容被操纵 |
| | Multilingual/Obfuscated | 多语言 / Unicode 混淆 |
| | Code Injection | 如 CVE-2024-5184 |
| **Indirect（间接）** | RAG 投毒 | 检索源植入恶意指令 |
| | 网页隐藏文本 | 爬取网页含隐藏指令 |
| | 多模态图片藏指令 | 图片藏 prompt |
| **Jailbreaking（越狱）** | 子集 | 让模型完全无视安全协议 |

> 越狱是注入的子集，不等于所有注入。

<!--
混淆 Prompt Injection 与 Jailbreaking 是常见误区：越狱目标是绕过安全协议。
-->

---

# OWASP 七项缓解策略

LLM 应用安全的纵深防御

1. **约束模型行为**：system prompt 明确角色 + 「忽略修改核心指令」
2. **校验输出格式**：确定性代码校验 JSON schema
3. **输入输出过滤**：Guardrails + **RAG Triad**（context relevance / groundedness / answer relevance）
4. **最小权限**：独立 API token，特权操作代码层执行
5. **人在回路（HITL）**：高风险动作人工审批
6. **隔离并标注外部内容**：明确「不可信内容」边界
7. **对抗性红队**：用 Payload Splitting / 对抗后缀定期演练

> OWASP 明确「**没有 fool-proof 方法**」——必须纵深防御并假设模型会被攻破。

<!--
RAG 与微调都不能完全缓解注入——这是 OWASP 的根本立场。
-->

---

# 工程防御技术

| 技术 | 作用 |
|------|------|
| **分隔符** | `"""` / `---` / XML 标签隔离不可信输入 |
| **Sandwich defense** | 用户输入夹在两段系统指令之间 |
| **Guardrails** | 实时过滤（NeMo / Guardrails AI） |
| **结构化输出 schema** | 强制 JSON Schema，确定性校验 |
| **代码层特权执行** | 转账 / 删除 / 发邮件不交给模型 |

**MITRE ATLAS 映射**

- `AML.T0051.000` 直接注入
- `AML.T0051.001` 间接注入
- `AML.T0054` 越狱

> 以为「格式校验通过 = 没被注入」是常见反模式——对抗后缀可绕过。

<!--
格式校验只是必要条件，需配合语义过滤与 RAG Triad。
-->

---
layout: quote
---

# 没有 fool-proof 方法

「生成式 AI 的随机性本质决定了**没有 fool-proof 方法**——RAG 与微调都不能完全缓解 Prompt Injection，必须纵深防御并假设模型会被攻破。」

—— OWASP LLM01:2025

---
layout: center
class: text-center
---

# 反模式与陷阱

- 把 Self-Consistency 用于开放生成（无单一正确答案可投票）
- 用 ToT 解简单任务（成本不抵收益）
- Prompt Chaining 过度拆分（徒增延迟）
- ReAct 不设 `max_iterations`（循环不收敛）
- 纯 ReAct 依赖检索解决一切（应回退 CoT）
- Prompt Injection 防御仅靠 system prompt 一层
- DSP 训练数据与评测数据混用（Policy LM 过拟合）
- 以为「格式校验通过 = 没被注入」

<!--
每条反模式背后都有论文或 OWASP 官方依据。
-->

---
layout: center
class: text-center
---

# 小结

高级提示技巧 = 推理增强 + 提示安全

**6 项技术互补**：ReAct / Self-Consistency / ToT / Chaining / DSP / Injection

- 算术任务 → Self-Consistency（+17.9%）
- 搜索任务 → ToT（4% → 74%）
- 流水线 → Chaining；黑盒引导 → DSP
- 安全 → OWASP 七项纵深防御

[ReAct 论文](https://arxiv.org/abs/2210.03629) · [ToT 论文](https://arxiv.org/abs/2305.10601) · [OWASP LLM01](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)

<!--
掌握按任务类型选用 + 纵深防御，就能把提示工程用到生产水准。
-->
