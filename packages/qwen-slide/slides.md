---
theme: seriph
background: https://cover.sli.dev
title: Qwen 完全指南
info: |
  阿里 Qwen 完全指南：开源 MoE 旗舰 · 混合思考模式 · 阿里云百炼 API · Qwen-Agent

  Learn more at https://qwenlm.github.io/blog/qwen3
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Qwen 完全指南

阿里通义千问 · 开源 MoE 旗舰 · 混合思考模式 · Apache 2.0

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/QwenLM/Qwen3" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Qwen3 2025-04 发布，开源 Dense 6 款 + MoE 旗舰 235B-A22B；Apache 2.0 全系列可商用。
-->

---
transition: fade-out
---

# 什么是 Qwen

阿里通义千问（Qwen）开源大语言模型家族

- **阿里达摩院 / 通义实验室**：阿里巴巴自研，2025-04 发布 Qwen3 主线
- **开源旗舰 + Apache 2.0**：MoE 235B-A22B 全量权重可下载、可商用
- **混合思考模式**：`enable_thinking` 一档开关 + `thinking_budget` 精控
- **119 种语言**：原生覆盖九大语系，中文 / 阿拉伯 / 印度语系表现优秀
- **OpenAI 兼容**：百炼 `compatible-mode/v1` 直接复用 OpenAI SDK
- **Qwen-Agent 框架**：内置函数调用 + MCP 集成

> Qwen3-235B-A22B 是业界最强势的开源 MoE 之一。

<!--
Qwen 与 GPT / Claude / Gemini 的差异在「开源旗舰 + 思考模式开关 + 多语言」。
-->

---

# 模型矩阵：开源 Dense + MoE

| 模型 | 总参 / 激活 | 上下文 |
|------|------|------|
| `Qwen3-0.6B / 1.7B / 4B` | Dense | 32K |
| `Qwen3-8B / 14B / 32B` | Dense | 128K |
| `Qwen3-30B-A3B` | 300 亿 / 30 亿 | 128K |
| `Qwen3-235B-A22B` | **2350 亿 / 220 亿** | 128K |
| `Qwen3-Coder-480B` | 4800 亿 / 350 亿 | 256K→1M |

**命名规则**：`Qwen3-{总参}B-A{激活}B`

- `A` 后数字 = MoE 实际激活参数
- 235B-A22B = 总参 2350 亿 / 激活 220 亿
- 128 专家中激活 8 个

<!--
开源 Dense 6 款覆盖 0.6B ~ 32B；MoE 旗舰 235B-A22B 性价比远高于同规模 Dense。
-->

---

# 编程旗舰与闭源旗舰

**Qwen3-Coder-480B-A35B-Instruct**（编程 SOTA）

- 总参 4800 亿 / 激活 350 亿 MoE
- 原生 **256K** 上下文，YaRN 扩展至 **1M**
- 预训练 7.5T tokens（含 70% 代码）
- SWE-bench 开源 SOTA

**闭源旗舰（仅百炼 API）**

- `qwen3.7-max`：2026 最新旗舰
- `qwen3.7-plus` / `qwen3.7-flash`：中阶 / 高并发
- `qwen3-max-thinking`：万亿级思考旗舰

> 开源系列是 Apache 2.0；闭源旗舰无权重下载。

<!--
仓库级代码分析首选 Coder 480B；通用生产首选 qwen-plus 或 235B-A22B。
-->

---

# 四端点定位

| 端点 | URL 路径 | 适用 |
|------|------|------|
| **OpenAI 兼容-Chat** | `compatible-mode/v1/chat/completions` | **默认首选** |
| OpenAI 兼容-Responses | `compatible-mode/v1/responses` | 内置联网 + 代码沙箱 |
| Anthropic 兼容-Messages | `compatible-mode/v1/messages` | 复用 Anthropic SDK |
| DashScope 原生 | `/api/v1/services/aigc/.../generation` | 全参数集 |

**国内 base_url**：`dashscope.aliyuncs.com`
**国际 base_url**：`dashscope-intl.aliyuncs.com`

> 选型原则：默认走 OpenAI 兼容-Chat，迁移成本接近 0。

<!--
四端点不是平行的，OpenAI 兼容是开发态主力，其他三个是补充。
-->

---

# 第一次调用

```bash
# 1. 设置 API Key（绝不硬编码）
export DASHSCOPE_API_KEY=sk-xxxxxxxxxxxx

# 2. curl 直调（OpenAI 兼容）
curl https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions \
  -H "Authorization: Bearer $DASHSCOPE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen-plus",
    "messages": [{"role": "user", "content": "介绍 Qwen3"}]
  }'
```

> 鉴权用 `Authorization: Bearer $DASHSCOPE_API_KEY`。

<!--
国内站与国际站 Key 不通用；国际站用 dashscope-intl 域名。
-->

---

# Python SDK 调用

```ts
// Node.js（OpenAI 兼容）
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY!,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

const resp = await client.chat.completions.create({
  model: "qwen-plus",
  messages: [{ role: "user", content: "介绍 Qwen3" }],
});
console.log(resp.choices[0].message.content);
```

> Python 同理：`from openai import OpenAI` + `base_url` 指向百炼。

<!--
直接复用 OpenAI SDK，无需新装 DashScope SDK。
-->

---

# 思考模式：开关

`enable_thinking` 总开关 + `thinking_budget` 精控

- **`enable_thinking`**：bool，总开关（放 `extra_body`）
- **`thinking_budget`**：int，思维链 token 上限
- **`reasoning_effort`**：`low / medium / high / xhigh`（自动互转）
- **`/think` / `/no_think`**：prompt 软指令，逐轮切换

**返回字段**：

- `reasoning_content`：思维链推理过程
- `content`：最终回答

> 解析时务必区分两字段，否则污染业务逻辑。

<!--
软切换适合「同一会话混合简单 / 复杂任务」场景。
-->

---
layout: two-cols
---

# 思考模式：SDK 参数

非标准参数必须放 `extra_body`

```json
{
  "model": "qwen3-235b-a22b-thinking-2507",
  "messages": [{"role": "user", "content": "证明 √2 是无理数"}],
  "temperature": 0.6,
  "top_p": 0.95,
  "max_completion_tokens": 8192,
  "enable_thinking": true,
  "thinking_budget": 4096,
  "top_k": 20
}
```

::right::

# curl vs SDK

**curl 调用**

- 上述参数放请求体**顶层**

**OpenAI SDK 调用**

- `enable_thinking` 等放 **`extra_body`**
- 顶层会被 SDK 拒绝或静默忽略

**长度限制**

- 用 `max_completion_tokens`
- 含「思维链 + 回答」总长
- 勿用即将废弃的 `max_tokens`

<!--
SDK 调用坑点：放顶层会被静默忽略，必须放 extra_body。
-->

---

# 采样参数：思考 vs 非思考

| 模式 | temperature | top_p | top_k |
|------|------|------|------|
| **思考模式** | **0.6** | **0.95** | **20** |
| 非思考模式 | 0.7 | 0.8 | 不设 |

**严禁思考模式用 `temperature=0`**：

- 思维链会重复、卡死
- 官方明确不推荐
- 性能塌陷

**不要同时设 `temperature` 与 `top_p`**：

- 官方建议二选一
- 同时设会相互冲突

> 简单任务用 `enable_thinking=false` 或 `/no_think` 关闭思考，省成本。

<!--
思考模式采样是 Qwen3 最易踩的坑，必须按官方推荐组合。
-->

---

# 长度限制坑：max_completion_tokens

| 参数 | 含义 | 状态 |
|------|------|------|
| `max_completion_tokens` | 含「思维链 + 回答」总长度 | **推荐** |
| `max_tokens` | 仅限 `content`（回答） | **即将废弃** |
| `thinking_budget` | 仅限思维链 | 思考模式用 |

**反模式**：用 `max_tokens` 限思考模型总输出

- 只限回答不限思维链
- token 超额仍失败

**多轮对话**：`preserve_thinking=true`

- 默认丢历史 `reasoning_content`
- 开启后保留历史思维链作为上下文

<!--
max_tokens 与 max_completion_tokens 的区别是面试 / 测试高频考点。
-->

---

# Function Calling 与 Qwen-Agent

**百炼工具名规则**：

- 仅允许字母 / 数字 / `_` / `-`
- 长度 ≤ 64 token
- 中文 / 空格 / 点号会被拒

**Qwen-Agent 框架三层**：

| 层 | 抽象 | 职责 |
|------|------|------|
| LLM | `BaseChatModel` | 对接后端 |
| 工具 | `BaseTool` + `@register_tool` | 工具定义 |
| Agent | `Assistant` / `FnCallAgent` / `ReActChat` | 编排 |

> Agent 场景优先用 Qwen-Agent，省去手写 ReAct prompt。

<!--
框架内置 nous 模板（适配 Qwen3）+ tool call parser。
-->

---
layout: quote
---

# 开源旗舰 ≠ 闭源旗舰

「Qwen3-235B-A22B 是 Apache 2.0 可下载；Qwen3-Max / Qwen3.7-Max 是闭源仅 API——别混淆。」

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 思考模式用 `temperature=0`（卡死）
- `enable_thinking` 放 SDK 顶层（必须 `extra_body`）
- 用 `max_tokens` 限思考模型（应用 `max_completion_tokens`）
- 同时设 `temperature` 与 `top_p`（互相冲突）
- 解析时混淆 `reasoning_content` 与 `content`
- 把 Qwen3-Max 当开源模型期待能下载权重
- 工具名包含中文 / 空格（百炼会拒）
- Qwen3 思考模型接 vLLM 加 `--enable-auto-tool-choice`（不应加）
- 百炼 API Key 硬编码到代码（必须环境变量）

<!--
vLLM 那个坑：Qwen-Agent 框架自己解析工具输出，不需要 vLLM 自动工具选择。
-->

---
layout: center
class: text-center
---

# 小结

Qwen = 开源 MoE 旗舰 + 混合思考模式 + Apache 2.0

四端点 · 思考模式开关 · Qwen-Agent · 119 语言

**默认走 OpenAI 兼容 · `enable_thinking` 放 extra_body · `max_completion_tokens`**

[Qwen3 博客](https://qwenlm.github.io/blog/qwen3) · [Qwen-Agent](https://github.com/QwenLM/Qwen-Agent) · [百炼帮助](https://help.aliyun.com/zh/model-studio/first-api-call-to-qwen)

<!--
掌握「思考模式开关 + extra_body 规则 + 四端点选型」三件套，就能把 Qwen3 用到生产水准。
-->
