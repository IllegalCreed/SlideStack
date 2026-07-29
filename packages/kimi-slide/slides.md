---
theme: seriph
background: https://cover.sli.dev
title: Kimi 完全指南
info: |
  Kimi（月之暗面 Moonshot AI）完全指南：超长上下文 · 思考模型 · Function Calling · OpenAI 兼容

  Learn more at [https://platform.kimi.ai/docs](https://platform.kimi.ai/docs)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Kimi 完全指南

<h1 class="!text-7xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
Kimi
</h1>

月之暗面 · 超长上下文 · 思考模型 · OpenAI 兼容

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/moonshotai/Kimi-K2" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Kimi 是月之暗面（Moonshot AI）的国产大模型 + 智能助手产品，2026-07-17 发布旗舰 kimi-k3。
-->

---
transition: fade-out
---

# 什么是 Kimi

**月之暗面（Moonshot AI）**推出的国产大语言模型 + 智能助手产品

- **超长上下文起家**：智能助手产品层支持 **200 万字**长文档分析
- **OpenAI SDK 完全兼容**：`base_url` 改成 Moonshot 端点即可
- **中文写作「AI 味最低」**：国产大模型横向评测公认靠前
- **思考模型一等公民**：kimi-k3 始终开启推理
- **K2 开源体量最大**：1T 总参 MoE，Modified MIT 协议
- **Function Calling 全栈**：并行 / 流式 / Dynamic Loading / Partial Mode

> 区分三个层次：智能助手产品 / 开放平台 API / K2 开源。

<!--
强调 Kimi 不是单一产品，是「模型 + 助手 + 平台」三层。
-->

---

# 三个层次：先分清「是哪个 Kimi」

| 层次 | 面向 | 入口 | 上下文 |
|------|------|------|------|
| **智能助手产品** | C 端用户 | kimi.com | **200 万字** |
| **开放平台 API** | 开发者 | platform.kimi.ai | kimi-k3 = **1M tokens** |
| **K2 开源模型** | 自部署 / 微调 | HuggingFace | K2 = 128K |

**最常见的混淆**

- 把「200 万字」当 API 默认能力 → API 上限实际是 kimi-k3 的 1M tokens
- 把 Kimi-K2-Base 直接用于对话 → 应该用 Kimi-K2-Instruct（后训练版）
- 以为长上下文 = 无限记忆 → 超出窗口仍会截断

<!--
200 万字是产品层能力（含检索/无损压缩），API 模型参数是另一回事。
-->

---

# 模型 ID 体系（2026-07）

| 模型 ID | 上下文 | 用途 | 状态 |
|------|------|------|------|
| `kimi-k3` | **1M** | 旗舰推理/视觉 | 主力 |
| `kimi-k2.7-code` | 256K | 编程专用 | 主力 |
| `kimi-k2.7-code-highspeed` | 256K | 编程高速 180 tok/s | 主力 |
| `kimi-k2.6` | 256K | 通用多模态 | 主力 |
| `kimi-k2.5` | 256K | 开源 SoTA | 存量可用 |
| `moonshot-v1-8k/32k/128k/auto` | 8-128K | 旧通用 | 逐步停用 |

**已停用**：`kimi-k2-0905-preview` / `kimi-k2-thinking-*` / `kimi-latest` / `kimi-thinking-preview` → 均迁 `kimi-k3`

<!--
moonshot-v1 系列仅维护存量，新项目不要用。
-->

---

# Kimi K2 开源架构

Modified MIT 协议，全球最大开源 MoE

| 项 | 取值 |
|------|------|
| 总参数 | **1T（1 万亿）** |
| 激活参数 | 32B（每 token） |
| 专家数 | 384（每 token 选 8 + 1 共享） |
| 层数 | 61（含 1 Dense 层） |
| 注意力 | MLA（Multi-head Latent Attention） |
| 词表 | 160K |
| 上下文 | 128K |
| 预训练 | 15.5T tokens |
| 优化器 | MuonClip |

**两版**：`Kimi-K2-Base`（基座，供微调）/ `Kimi-K2-Instruct`（后训练，开箱即用）

<!--
技术报告 arxiv:2507.20534；Base 不能直接对话，要用 Instruct。
-->

---

# OpenAI SDK 零摩擦迁移

只改两行：`base_url` + `api_key`

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-moonshot-api-key",
    base_url="https://api.moonshot.ai/v1",
)

resp = client.chat.completions.create(
    model="kimi-k3",
    messages=[{"role": "user", "content": "Hello Kimi!"}],
)
print(resp.choices[0].message.content)
```

> 认证：`Authorization: Bearer $MOONSHOT_API_KEY`

<!--
Kimi API 请求/响应格式完全 OpenAI 兼容，迁移成本仅一行配置。
-->

---
layout: two-cols
---

# 思考模型：kimi-k3

**始终开启**，用顶层 `reasoning_effort` 调深度

- `low`：简单任务，降延迟与 token
- `high`：标准推理
- `max`（默认）：最深推理

```python
resp = client.chat.completions.create(
    model="kimi-k3",
    reasoning_effort="low",
    messages=[{"role": "user", "content": "..."}],
)
# reasoning_content 在 content 之前输出
```

> kimi-k3 **不支持** `thinking` 参数，传了报错。

::right::

# k2.6 / k2.5

用 `thinking.type` 开关

- `enabled`：开启思考
- `disabled`：关闭

```python
resp = client.chat.completions.create(
    model="kimi-k2.6",
    extra_body={
        "thinking": {"type": "enabled"}
    },
    messages=[...],
)
```

> **Preserved Thinking**：`thinking.keep='all'` 跨轮次保留推理链（多步 Agent 必备）

<!--
注意 k3 与 k2.6/k2.5 思考参数完全不同，混淆会直接报错。
-->

---

# Function Calling：完整循环

走 `tool_calls` 循环，**非**已废弃的 `function_call`

```python
tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "parameters": {
            "type": "object",
            "properties": {"city": {"type": "string"}},
            "required": ["city"],
        },
    },
}]

# 循环：append assistant(tool_calls) → 执行 → 回传 role:'tool'
```

**关键点**

- 必须 `messages.append(choice.message)` 再回传 tool 结果
- 工具结果用 `role:'tool'` + 匹配 `tool_call_id`
- 原生支持并行 `tool_calls`
- 命名正则：`^[a-zA-Z_][a-zA-Z0-9-_]{2,63}$`

> 漏 append assistant 消息会报 `tool_call_id not found`。

<!--
tool_calls 比 function_call 更省 token，且原生支持并行。
-->

---
layout: two-cols
---

# Partial Mode（Prefill）

最后一条 assistant 消息加 `partial:true`，提供输出前缀

```python
messages = [
    {"role": "user", "content": "返回 JSON 数组"},
    {"role": "assistant",
     "content": "```json\n[",
     "partial": True},
]
```

**红线**：与 `response_format:json_object` **互斥**，禁止组合

::right::

# Context Caching

`prompt_cache_key` 复用前缀

```python
client.chat.completions.create(
    model="kimi-k3",
    messages=messages,
    extra_body={
        "prompt_cache_key": f"user-{uid}-{doc}"
    },
)
# usage.cached_tokens 按缓存价计费
```

**Dynamic Tool Loading**

`KimiK3DynamicToolMessage`（role=system，无 content，带 tools）按需注入工具

<!--
Partial+json_object 同用会输出异常；Context Caching 是长文档降本关键。
-->

---

# 国产大模型对比定位

| 模型 | 起家优势 | 典型场景 |
|------|------|------|
| **Kimi** | 超长上下文 / 中文写作 | 长文档、写作、Agent |
| **DeepSeek** | 编程调试 / 性价比 | 代码、低成本生产 |
| **通义千问** | Arena 代码榜国产前列 | 综合编码、企业服务 |
| **文心一言** | 1M+ 上下文 / 合规 | 政企合规、搜索 |
| **智谱 GLM** | 综合均衡 / 企业级 | 企业级 API |

> 国产对比结论来自第三方 2026 评测，能力数值随版本快速变化。

<!--
按场景选型：长文档/中文写作用 Kimi，编程性价比用 DeepSeek，合规用文心。
-->

---
layout: quote
---

# 200 万字 ≠ API 默认能力

「200 万字是 Kimi 智能助手**产品层**的能力；API 模型 kimi-k3 上限 **1M tokens**、K2 系列 **128K/256K**，需区分产品能力与 API 模型参数。」

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 对 kimi-k3 传 `thinking` 参数（应用 `reasoning_effort`）
- Partial Mode 与 `response_format:json_object` 同用（互斥）
- 对 kimi-k2.7-code 传 `thinking.type='disabled'` 或改 `temperature`（不可改）
- 用 `max_tokens` 而非 `max_completion_tokens`（已废弃）
- tool 结果不 append 中间的 assistant(tool_calls) 消息
- 把 Kimi-K2-Base 直接用于对话（应用 Instruct）
- 把 200 万字当 API 默认能力（API 上限 1M tokens）

---
layout: center
class: text-center
---

# 小结

Kimi = 超长上下文 + 思考模型 + OpenAI 兼容

三层（智能助手/API/开源） · kimi-k3 旗舰 · Modified MIT 开源

**按场景选型 · Partial/Preserved/Dynamic 三件套 · 用 max_completion_tokens**

[文档](https://platform.kimi.ai/docs/introduction) · [GitHub](https://github.com/moonshotai/Kimi-K2) · [技术报告](https://arxiv.org/abs/2507.20534)

<!--
掌握三层定位 + 思考模型参数差异 + Function Calling 循环，就能把 Kimi 用到生产水准。
-->
