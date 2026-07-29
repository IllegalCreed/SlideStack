---
theme: seriph
background: https://cover.sli.dev
title: DeepSeek
info: |
  DeepSeek 开源大模型家族 · V3 通用 + R1 推理 · OpenAI SDK 兼容
  V3.1 Hybrid Inference / V3.2 Thinking+tool-use / V4 thinking 开关

  Learn more at [https://api-docs.deepseek.com/](https://api-docs.deepseek.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# DeepSeek

开源大模型 · V3 通用 + R1 推理 · OpenAI SDK 兼容

<div class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
DeepSeek 定位：开源 + 推理强 + 极致性价比，API 100% 兼容 OpenAI SDK。
-->

---
transition: fade-out
---

# 两条主线

DeepSeek 把「通用大模型」与「推理模型」拆成两条独立产品线

- **V3 系列**：通用 MoE 大模型，671B 总参 / 37B 激活，128K 上下文，对标 GPT-4o / Claude-3.5
- **R1 系列**：首个开源长 CoT 推理模型，对标 OpenAI o1，强在数学/代码/逻辑

> V3.1 起「一模型两模式」：同一权重支持 `deepseek-chat`（非思考）/ `deepseek-reasoner`（思考）

<!--
两条线互补：V3 处理日常通用任务，R1 处理需要深度推理的场景。
-->

---
layout: two-cols
layoutClass: gap-8
---

# 模型家族

V3 / R1 / V3.1 / V3.2 / V4 + 6 蒸馏版

| 模型 | 类型 |
|------|------|
| **V3** | 通用 MoE |
| **R1** | 推理（CoT） |
| **V3.1** | 一模型两模式 |
| **V3.2** | Thinking + tool |
| **V4-pro/flash** | thinking 开关 |

::right::

<br>

**关键数字**

| 项 | 数字 |
|------|------|
| 总参 | 671B |
| 激活 | 37B |
| 上下文 | 128K |
| 预训练 | 14.8T |
| 训练成本 | 2.788M H800h |

> R1 代码+权重 MIT 开源

<!--
671B 总参但每 token 仅激活 37B，是 MoE 的核心优势。
-->

---

# 三种 Base URL + 模型 ID

100% 兼容 OpenAI SDK，换 `base_url` 即用

```text
OpenAI 兼容    →  https://api.deepseek.com
Anthropic 兼容 →  https://api.deepseek.com/anthropic
Beta 功能      →  https://api.deepseek.com/beta   (FIM / Strict)
```

**模型 ID 与模式映射（V3.1 双约定）**

| 模型 ID | 模式 | 用途 |
|---------|------|------|
| `deepseek-chat` | 非思考 | 通用对话 |
| `deepseek-reasoner` | 思考（CoT） | 数学/代码/Agent |
| `deepseek-v4-pro` | thinking 开关 | V4 合并 |

> V4 起 `deepseek-chat` / `deepseek-reasoner` 合并为单一模型 + `thinking` 参数

<!--
OpenAI SDK 直接换 base_url 即可，DeepSeek 专属参数走 extra_body。
-->

---
layout: two-cols
layoutClass: gap-8
---

# thinking 参数

V4+ 推荐用 thinking 开关统一两模式

```python
client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[...],
    extra_body={
        "thinking": {"type": "enabled"},
        "reasoning_effort": "high"
    },
)
```

::right::

<br>

**取值与默认**

| 参数 | 取值 | 默认 |
|------|------|------|
| `thinking.type` | enabled / disabled | enabled |
| `reasoning_effort` | high / max | high |

> effort 映射：low/medium → high；xhigh → max；agent 场景自动 max

<!--
OpenAI SDK 不认 thinking 字段，必须放 extra_body 透传给 DeepSeek。
-->

---

# reasoning_content 字段

思考模式下与 `content` 同级返回推理链

```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "答案是 2。",
      "reasoning_content": "首先假设... 由此推出矛盾..."
    }
  }],
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 200,
    "reasoning_tokens": 150,
    "prompt_cache_hit_tokens": 800
  }
}
```

- 流式：通过 `delta.reasoning_content` 单独推送（先推完整 CoT，再推 content）
- **多轮 tool-call**：触发 `tool_calls` 的轮次，`reasoning_content` 必须原样回传，**否则 400**

<!--
漏传 reasoning_content 是 tool-call 多轮里最常见的 400 原因。
-->

---
layout: two-cols
layoutClass: gap-8
---

# Context Caching

KV Cache on Disk · 默认开启 · 命中价约低 98%

**最佳实践**

```python
messages = [
    {"role": "system", "content": LONG_SYSTEM},  # 稳定
    {"role": "user", "content": LONG_DOC},       # 稳定
    {"role": "user", "content": user_question},  # 变量
]
```

::right::

<br>

**usage 字段**

| 字段 | 含义 |
|------|------|
| `prompt_cache_hit_tokens` | 命中（约 98% 折扣） |
| `prompt_cache_miss_tokens` | 未命中（原价） |

> best-effort 非保证，TTL 几小时到几天；前缀稳定性决定命中率

<!--
稳定长上下文放前面、变量放后面是命中缓存的关键。
-->

---

# 思考模式硬约束（关键坑）

thinking 启用时，下列采样参数**全部不生效**（官方仅为兼容旧软件保留入参）

| 参数 | 思考模式行为 |
|------|------|
| `temperature` | ❌ 不生效 |
| `top_p` | ❌ 不生效 |
| `presence_penalty` | ❌ 不生效 |
| `frequency_penalty` | ❌ 不生效 |

> 设了也是空操作，反而误导调试。思考模式的采样由模型自主控制。

<!--
官方文档明确这四个参数在 thinking 模式被忽略，调参前先确认模式。
-->

---

# JSON Output

`response_format` 触发，但 prompt 必含 'json' 字样

```python
resp = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{
        "role": "user",
        # ⚠️ prompt 必须包含 'json' 字样并给结构示例
        "content": "请输出用户信息 JSON，结构如 {\"name\":\"\",\"age\":0}。只返回 JSON。"
    }],
    response_format={"type": "json_object"},
    max_tokens=1024,  # ⚠️ 合理预估防截断
)
```

**已知问题**：偶发返回空内容，结构越复杂截断概率越高，需调 prompt + `max_tokens` 兜底

<!--
JSON 模式依赖 prompt 里的 'json' 信号触发，没这词可能不进 JSON 模式。
-->

---
layout: two-cols
layoutClass: gap-8
---

# Function Calling / Strict

标准协议 + Beta 严格模式

```python
tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "parameters": {
            "type": "object",
            "properties": {"city": {"type": "string"}},
            "required": ["city"]
        }
    }
}]
```

::right::

<br>

**Strict 模式（Beta）**

```python
# ⚠️ 必须切 /beta
strict_client = OpenAI(
    base_url="https://api.deepseek.com/beta",
    api_key=KEY
)
# strict: true
# additionalProperties: false
# 全部 required
```

> strict 不支持 string 的 minLength/maxLength、array 的 minItems/maxItems

<!--
Strict 适合 Agent 场景需要严格契约保证下游解析稳定。
-->

---

# FIM 填空补全（代码补全专用）

`/beta` + `POST /completions` + `prompt` + `suffix`

```python
# ⚠️ 必须切 /beta
fim_client = OpenAI(api_key=KEY, base_url="https://api.deepseek.com/beta")

resp = fim_client.completions.create(
    model="deepseek-chat",
    prompt="def fibonacci(n):\n    ",       # 前缀
    suffix="\n    return result",            # 后缀
    max_tokens=4000,  # ⚠️ 硬上限 4K
)
```

- 走 `client.completions.create`（**不是** `chat.completions`）
- `max_tokens` 硬上限 **4K**
- 主用于 IDE 代码补全（如 Continue 插件）

<!--
FIM 是「前缀+后缀填中间」专用，chat completions 不接受 suffix。
-->

---

# R1 推理最佳实践

官方 README 推荐采样配置

```python
client.chat.completions.create(
    model="deepseek-reasoner",
    messages=[{
        "role": "user",  # ⚠️ 不放 system prompt
        "content": "证明根号 2 是无理数，请一步步推理，并把最终答案放进 \\boxed{}"
    }],
    temperature=0.6,   # 推荐范围 0.5–0.7
    top_p=0.95,
)
```

**关键约束**：

- `temperature` 0.5–0.7（推荐 **0.6**），`top_p` 0.95
- **不要加 system prompt**（所有指令塞 user prompt）
- 数学题答案放 `\boxed{}`

<!--
这些是官方复现 AIME/MATH 基准的采样参数，加 system prompt 会干扰推理链。
-->

---
layout: two-cols
layoutClass: gap-8
---

# 蒸馏版与本地部署

6 个 Distill + 671B 全量部署方案

| Distill | Base | AIME 2024 |
|---------|------|-----------|
| 1.5B/7B/14B/32B | Qwen2.5 | 32B: 72.6 |
| 8B | Llama-3.1 | 50.4 |
| 70B | Llama-3.3 | 70.0 |

> 32B Distill 反超 o1-mini（63.6）

::right::

<br>

**部署方案**

```bash
# 蒸馏版：标准 vLLM 直接 serve
vllm serve deepseek-ai/DeepSeek-R1-Distill-Qwen-32B \
    --port 8000 --max-model-len 32768

# 671B 全量：走 DeepSeek-V3 仓库
# HuggingFace transformers 不直接支持
```

> 蒸馏版须叠加 Qwen/Llama 上游 License，非纯 MIT

<!--
671B 需要 MoE + MLA 专用推理内核，标准 transformers 跑不起来。
-->

---
layout: section
---

# V3.2 / V4 演进

Thinking 集成 tool-use · 单模型 + thinking 开关

<!--
V3.2 把思考链与工具调用打通，V3.2-Speciale 在 IMO/CMO/ICPC/IOI 2025 夺金。
-->

---
layout: center
class: text-center
---

# 反模式速查

思考模式设 temp/top_p → 空操作　·　多轮 tool-call 丢 reasoning_content → 400
　·　给 R1 加 system prompt → 干扰推理链　·　FIM 不切 `/beta` → 失败
　·　FIM max_tokens > 4K → 截断　·　Strict 漏 additionalProperties:false → 报错
　·　把 R1 当全场景最强 → 通用/软件工程劣于 o1/Claude

<!--
这些反模式都在生产环境频繁出现，逐一对照排查。
-->

---
layout: center
class: text-center
---

# 小结

DeepSeek = 开源 + 推理强 + 极致性价比 + OpenAI SDK 兼容

**通用**：deepseek-chat / V3 系列　·　**推理**：deepseek-reasoner / R1 系列
**特色**：reasoning_content · Context Caching · JSON · FIM · Strict FC
**开源**：R1 MIT · V3 自有 License · 6 蒸馏版（1.5B~70B）

[API 文档](https://api-docs.deepseek.com/) · [R1 GitHub](https://github.com/deepseek-ai/DeepSeek-R1) · [HuggingFace](https://huggingface.co/deepseek-ai)

<!--
两条产品线 + 多种 API 兼容 + 开源权重 = DeepSeek 的核心价值主张。
-->
