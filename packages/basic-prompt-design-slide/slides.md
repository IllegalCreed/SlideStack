---
theme: seriph
background: https://cover.sli.dev
title: 基础提示设计 完全指南
info: |
  LLM Prompt Engineering 基础：Zero/Few-shot · CoT · 结构化输出 · Token 经济

  Learn more at https://developers.openai.com/api/docs/guides/prompt-engineering
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 基础提示设计 完全指南

与 LLM 交互的「提示侧」基础工程 · 2026-07

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
基础提示设计是 Prompt Engineering 的统一入口：范式、消息结构、结构化输出、Token 经济。
-->

---
transition: fade-out
---

# 什么是基础提示设计

与 LLM 交互的**「提示侧」基础工程**

- **四块核心**：提示范式 / 消息结构 / 结构化输出 / Token 经济
- **总入口策略**：先 Zero-shot → 不足加 Few-shot → 仍不行 fine-tune
- **杠杆比最高**：同一模型，提示从模糊改到清晰，效果提升常大过换模型
- **可版本化**：提示进代码模块、过 code review、走 CI/CD
- **结构化下沉**：`strict` / `adaptive` / `cache_control` 把控制下沉到 API 参数
- **跨模型通用**：四段式 + XML 在 OpenAI / Anthropic 两家基本通用

> Anthropic 黄金法则：把提示给零背景同事看，他若困惑模型也会困惑。

<!--
强调「提示是最性价比的工程手段」与「自然语言约束在向结构化 API 演进」。
-->

---

# 四种提示范式对比

| 范式 | 触发方式 | 适用场景 |
|------|------|------|
| **Zero-shot** | 直接下指令 | 通用任务（翻译、改写、分类） |
| **One-shot** | 1 个示例 | 简单格式迁移 |
| **Few-shot** | 3–5 个多样示例 | 格式迁移、风格对齐、边缘情况 |
| **Zero-shot CoT** | 「Let's think step by step」 | 通用触发推理 |
| **Few-shot CoT** | 示例带推理过程 | 推理范式迁移 |
| **Extended Thinking** | API 参数 / 推理模型 | 数学、代码、多跳推理 |

> 升级链：Zero-shot → Few-shot（3–5 个）→ fine-tune。

<!--
升级顺序是核心：能用 Zero-shot 解决就不要堆示例。
-->

---
layout: two-cols
---

# Zero-shot

**定义**：不提供任何示例，仅靠任务描述触发预训练知识

- **何时用**：通用任务（翻译、改写、分类、总结）
- **现代模型能力**：GPT-5 系列「no examples needed」
- **关键技巧**：
  - 明确输出格式
  - 明确步骤顺序
  - 明确约束（长度 / 风格 / 禁用词）

::right::

# Few-shot

**定义**：提供 3–5 个多样输入/输出示例

- **何时用**：格式迁移、风格对齐、边缘情况
- **质量原则**：
  - **多样性**：覆盖边界（最长 / 最短 / 反例）
  - **一致性**：格式严格统一
  - **代表性**：反映真实输入分布
- **包裹**：`<example>` 标签或代码块

> Anthropic：3–5 个高质量示例优于 20 个相似示例。

<!--
Few-shot 不是越多越好，多样性比数量重要。
-->

---

# Chain-of-Thought 三种形态

**分步推理显著降低复杂任务错误率**

| 形态 | 触发方式 | 适用 |
|------|------|------|
| **Zero-shot CoT** | 「Let's think step by step」 | 通用触发 |
| **Few-shot CoT** | 示例带推理过程 | 推理范式迁移 |
| **Extended Thinking** | API 参数（Anthropic）/ 推理模型（OpenAI） | 数学、代码、多跳推理 |

**Anthropic 演进**：

- 旧版：`thinking:{type:enabled, budget_tokens:N}`（4.6 deprecated）
- 新版：`thinking:{type:adaptive}` + `output_config:{effort:low/medium/high}`
- 4.7+ 设 `budget_tokens` 直接返回 400

> 简单分类任务别加 CoT——徒增 token、降低吞吐。

<!--
CoT 是为复杂推理任务设计的，简单任务别滥用。
-->

---

# 角色设定与 System Prompt

给模型套上**「人格 / 行为框架」**

- **承载内容**：tone、视角、不可违反的约束、全局规则、Few-shot 示例
- **OpenAI 写法**：`role: 'developer'`（取代 legacy `system`），或 `instructions` 参数
- **Anthropic 写法**：顶层 `system` 参数（字符串或 content blocks 数组）

**消息角色权威层级递减**：

```text
developer (system)  >  user  >  assistant
```

> OpenAI：`instructions` 参数只对当次响应生效、不跨 `previous_response_id` 持久化——需要每次重传。

<!--
把规则从 user 层抬到 developer 层，遵守度显著提高。
-->

---

# 四段式结构 + XML 标签

Anthropic 实测：XML 边界可显著降低「指令 vs 上下文」混淆

```xml
<identity>你是「车险理赔审核专家」，10 年经验。</identity>

<instructions>
审阅材料，输出是否赔付 + 理由。规则：
1. 只基于用户提供的材料
2. 金额四舍五入到 2 位小数
</instructions>

<examples>
<example>
<input>追尾，我方全责，5000 元。</input>
<output>赔付。5000.00 元。</output>
</example>
</examples>

<context><document index="1">...</document></context>
<question>是否赔付？赔付多少？</question>
```

> OpenAI 等价方案：Markdown 标题 + `Identity → Instructions → Examples → Context` 四段式。

<!--
四段式 + XML 是跨模型通用的最强结构。
-->

---
layout: quote
---

# 长文档布局

「数据置顶、提问置尾——Anthropic 实测可提升质量最高 30%。」

---
layout: two-cols
---

# 结构化输出三层演进

**Layer 1：JSON Mode**

- `response_format:{type:json_object}`
- 仅保证合法 JSON，不保证 schema
- 已被取代，仅向后兼容

**Layer 2：Structured Outputs**

- `response_format:{type:json_schema, strict:true}`
- schema 严格校验，可靠性 ~100%

::right::

# Function Calling

**Layer 3：触发外部动作**

- `tools:[...]` + `tool_choice`
- 触发外部函数 + 参数 schema 校验
- `strict:true` 内部走 Structured Outputs

**tool_choice 四种值**：

- `auto`（默认）
- `required`（强制调用）
- `none`（禁止调用）
- 指定 function

> 自然语言强制 JSON 是反模式——总会有响应违反约束。

<!--
Structured Outputs 是 schema 严格场景的正解，Function Calling 是 Agent 的基础。
-->

---

# Structured Outputs 硬限制

`strict: true` 必填时的 Schema 子集限制

| 限制 | 取值 |
|------|------|
| `additionalProperties` | 必须 `false` |
| `required` 字段 | 所有 key 必须列出 |
| 属性数上限 | 100 |
| 输出 token 上限 | 首 8192 内生效 |
| 递归 | 支持 `$ref` |
| 关键字转义 | 加 `_`（如 `class` → `class_`） |

> 把 schema 校验下沉到解码层，省掉重试与 parse 兜底。

<!--
strict 模式是 OpenAI 把格式控制从「自然语言」下沉到「API 参数」的关键演进。
-->

---

# Function Calling 速查

`tools` 数组 + `tool_choice` 参数

```json
{
  "tools": [{
    "type": "function",
    "function": {
      "name": "get_weather",
      "description": "Get current weather",
      "strict": true,
      "parameters": {
        "type": "object",
        "additionalProperties": false,
        "properties": {"location": {"type": "string"}},
        "required": ["location"]
      }
    }
  }],
  "tool_choice": "auto"
}
```

**最佳实践**：`description` 写清「何时用」、`enum` 让「非法状态不可表达」、开 `strict`、初始工具 ≤ 20 个。

<!--
description 是模型选择工具的依据，要写清「何时用」而非「是什么」。
-->

---

# Token 经济

| 估算维度 | 数值 |
|------|------|
| 1 token | ≈ 4 字符 / 0.75 英文词 |
| 中文每字 | 约 1–2 token |
| 上下文窗口 | ~100K（GPT-4o）/ 200K（Claude）/ 1M（GPT-4.1） |

**核心反模式**：长 system prompt 不打 cache、CoT 无限拉长、把已知参数交给模型瞎填——账单失控。

**最佳实践**：

- 稳定前缀置顶 + 打 `cache_control`
- 长文档「数据置顶 + 提问置尾」
- 简单任务关闭 thinking
- 已知值应用层注入而非让模型生成

> Prompt Caching：多轮场景可省 80–92% 输入费用。

<!--
Token 经济是 Prompt Engineering 的成本工程。
-->

---
layout: two-cols
---

# Prompt Caching

**写法**：在 content block 上加 `cache_control`

```json
{
  "system": [{
    "type": "text",
    "text": "稳定前缀...",
    "cache_control": {
      "type": "ephemeral",
      "ttl": "1h"
    }
  }]
}
```

- TTL：5min（默认）/ 1h（beta）
- 断点上限：4 个
- 最低可缓存：512 ~ 4096 token

::right::

# 计费折扣

**相对基础输入价**：

| 操作 | 折扣 |
|------|------|
| Cache 读（5min/1h） | **0.1×** |
| Cache 写（5min） | 1.25× |
| Cache 写（1h） | 2× |

**usage 字段**：

- `cache_read_input_tokens`
- `cache_creation_input_tokens`
- `input_tokens`

> 总输入 = cache_read + cache_creation + input。

<!--
稳定段打 cache、变化段放后面——这是 Prompt 经济学的核心切分。
-->

---

# Prompt 模板工程

**OpenAI 主张**：代码内 `prompt builder` 模块——类型化入参 + schema 注入

```ts
// prompts/classify.ts
export function buildClassifyPrompt(text: string) {
  return {
    system: "你是分类器。输出 {category, confidence}",
    user: text,
  };
}
```

**优势**：

- 过 code review、走 CI/CD
- 配合 feature flag 灰度
- diff、回滚正常化
- 利用 prompt caching 把稳定前缀置顶

> `v1/prompts` Saved Prompts 2026-11-30 关停，必须迁到代码内。

<!--
提示是代码——走 review、走测试、走 CI/CD。
-->

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 用「Do not」「NEVER」否定式约束——改为正向描述
- 靠自然语言强制 JSON schema——总会有响应违反
- 堆几十个 Few-shot 示例——过拟合到表面模式
- 4.7+ 模型还设 `budget_tokens`——直接返回 400
- 给 Adaptive Thinking 写死板推理脚本——限制模型推理
- Opus 4.5 上用「think」字眼——改用「consider / evaluate」
- 把「CRITICAL: You MUST...」搬给 4.6+ 模型——过度触发
- 长问题埋在长文档中间——Anthropic 实测提问置尾提升 30%
- 还在用 `v1/prompts` Saved Prompts——2026-11-30 关停

<!--
否定式提示与自然语言强制 JSON 是最常见的两个坑。
-->

---
layout: center
class: text-center
---

# 小结

基础提示设计 = LLM 提示侧的工程化基础

四范式 · 四段式结构 · 结构化输出三层 · Token 经济

**Zero-shot 优先 · Structured Outputs 强约束 · Prompt Caching 降本**

[OpenAI 指南](https://developers.openai.com/api/docs/guides/prompt-engineering) · [Anthropic 指南](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

<!--
掌握范式升级链 + 结构化下沉 + Token 经济，就能把提示工程用到生产水准。
-->
