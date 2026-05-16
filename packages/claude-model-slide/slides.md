---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Claude
info: |
  Presentation Claude for AI engineers and developers.

  Learn more at [https://docs.claude.com](https://docs.claude.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:anthropic-icon class="text-7xl" />
</div>

<br/>

## Claude：Anthropic 的旗舰大模型家族

安全可控 + 长上下文 + 工具使用，编码与 Agent 场景的事实第一梯队

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Claude 大模型家族。

主力是 Claude 4 系列（Opus 4.7 / Sonnet 4.6 / Haiku 4.5），覆盖「旗舰复杂任务」「日常生产」「轻量快速」三档。

接口能力是它的核心差异点，重点聊它和 GPT / Gemini 的接口差异。
-->

---
transition: fade-out
---

# 什么是 Claude？

Anthropic 推出的大语言模型家族，主打「安全可控 + 长上下文 + 工具使用」

<v-click>

- **Constitutional AI**：自家训练范式，拒绝率低 + 安全护栏稳
- **编码 / Agent 强项**：HumanEval / SWE-bench / Aider 长期榜首
- **200K-1M 上下文**：Opus 4.7 标配 200K，可选 `[1m]` 后缀切 1M
- **Prompt Caching**：长系统提示重复用，命中读 90% 折扣
- **Tool Use 一类公民**：JSON Schema 全集 + 多 tool 并行 + tool_choice 控制
- **MCP 协议自家推**：让 LLM 接外部工具的开放标准
- **三档分明**：Opus 复杂 / Sonnet 日常 / Haiku 简单，按需选不浪费

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Claude_](https://docs.claude.com/)

</div>

<style>
h1 {
  background-color: #D97757;
  background-image: linear-gradient(45deg, #D97757 10%, #1F1F1F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---
transition: slide-up
level: 2
---

# 评价

<v-clicks>

**优点**

- 编码能力顶尖（HumanEval / SWE-bench / Aider 榜首）
- 长上下文（Opus 4.7 1M / Sonnet 4.6 200K）
- Tool Use API 接 function calling 极顺滑，MCP 自家推
- Constitutional AI 训练，拒绝率低于 GPT
- Prompt Caching 命中 token 90% 折扣
- 多模态：图像 + PDF + 截图都识别

**缺点**

- 闭源，仅 Anthropic API / Bedrock / Vertex AI
- 中国大陆不直接服务，需自备网络 / 代理
- 价格相对 OpenAI 略贵（Opus > GPT 旗舰）
- 不支持图像 / 音频 / 视频生成
- 中文能力略弱于 GPT-4o / Gemini

</v-clicks>

---
transition: slide-up
---

# 模型矩阵（2026）

| 模型 | 上下文 | 用途 | $/M 输入 | $/M 输出 |
| --- | --- | --- | --- | --- |
| `claude-opus-4-7` | 200K | 旗舰复杂任务 | $15 | $75 |
| `claude-opus-4-7[1m]` | 1M | 整本仓库 / 长会话 | $30 | $150 |
| `claude-sonnet-4-6` | 200K | 日常生产 | $3 | $15 |
| `claude-haiku-4-5-20251001` | 200K | 简单 / 快速 | $0.80 | $4 |

<v-click>

旧版（仍可调，逐步 retire）：`claude-opus-4` / `claude-sonnet-3-5` / `claude-haiku-3-5`

</v-click>

<v-click>

**1M 上下文的玩法**：模型 ID 加 `[1m]` 后缀，即 `claude-opus-4-7[1m]`，价格翻倍但能塞整本仓库。

</v-click>

---
transition: slide-up
---

# 三档模型怎么选？

```text
你的问题
   ↓
[需要复杂规划 / 重构 / 调试？]
   │
   ├─ 是 → 上下文够？
   │       ├─ <200K → Opus 4.7
   │       └─ ≥200K → Opus 4.7[1m]
   │
   └─ 否 → 简单查询 / 翻译 / 格式化？
            │
            ├─ 是 → Haiku 4.5
            └─ 否 → Sonnet 4.6（默认）
```

<v-click>

实际 90% 场景 Sonnet 4.6 已足够。Opus 仅当 Sonnet 明显不够时切。

</v-click>

---
transition: slide-up
---

# 三种接入方式

| 方式 | 适合 | 定价 |
| --- | --- | --- |
| **Anthropic API** | 开发者 / 应用集成 | 按 token |
| **claude.ai** | 网页聊天 | Free / Pro $20 / Max $100-200 |
| **Claude Code** | CLI / IDE 编码 | 包含在 Pro / Max 订阅 |
| **Amazon Bedrock** | 已有 AWS 体系 | Bedrock 定价 |
| **Google Vertex AI** | 已有 GCP 体系 | Vertex 定价 |
| **OpenRouter / Poe / 代理** | 大陆用户 | 代理服务自行定价 |

<v-click>

API key 在 console.anthropic.com 申请；后面所有示例都用 API 方式。

</v-click>

---
transition: slide-up
---

# 第一次调用

```bash
pip install anthropic                # Python
npm install @anthropic-ai/sdk        # Node.js

export ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
```

```python
from anthropic import Anthropic

client = Anthropic()  # 自动读 ANTHROPIC_API_KEY

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "用 Python 写个 quicksort"}
    ],
)

print(message.content[0].text)
```

---
transition: slide-up
---

# API Endpoint

```
POST https://api.anthropic.com/v1/messages
Authorization: Bearer ${ANTHROPIC_API_KEY}
anthropic-version: 2025-12-01
content-type: application/json
```

<v-click>

**版本头是必须的**。不同 `anthropic-version` 决定接口能力——新功能（Extended Thinking / MCP）只在新版本可用。

</v-click>

---
transition: slide-up
---

# Request Schema 关键字段

```ts
interface MessagesCreateParams {
  model: string;                       // 必填
  max_tokens: number;                  // 必填，<= 模型上限
  messages: Message[];                 // 必填
  system?: string | SystemBlock[];     // 系统提示，可分块（用于 cache）
  stream?: boolean;
  temperature?: number;                // 0-1，默认 1.0
  tools?: Tool[];                       // function calling
  tool_choice?: ToolChoice;
  thinking?: { type: "enabled"; budget_tokens: number };  // Extended Thinking
  mcp_servers?: MCPServer[];           // MCP 集成
  service_tier?: "auto" | "standard_only" | "priority";   // Priority 加速
}
```

<v-click>

注意：`system` 是**顶层字段**，不是 message 列表里的一条——这是与 GPT 的关键差异。

</v-click>

---
transition: slide-up
---

# Response Schema

```ts
interface Message {
  id: string;
  type: "message";
  role: "assistant";
  model: string;
  content: ContentBlock[];
  stop_reason: "end_turn" | "max_tokens" | "stop_sequence" | "tool_use" | "pause_turn";
  usage: Usage;
}

interface Usage {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number;    // Prompt Cache 首次写入
  cache_read_input_tokens?: number;        // Prompt Cache 命中
}
```

<v-click>

`stop_reason` 是判断 Tool Use 循环是否结束的关键——`end_turn` 表示模型主动停止。

</v-click>

---
transition: slide-up
---

# ContentBlock：六种类型

```ts
type ContentBlock =
  | { type: "text"; text: string; cache_control?: CacheControl }
  | { type: "image"; source: ImageSource }
  | { type: "document"; source: DocumentSource; cache_control?: CacheControl }
  | { type: "thinking"; thinking: string; signature: string }
  | { type: "tool_use"; id: string; name: string; input: unknown }
  | { type: "tool_result"; tool_use_id: string; content: string | ContentBlock[] };
```

<v-clicks>

- **text**：标准文本块（默认）
- **image**：图像（base64 / URL）
- **document**：PDF（原生支持，无需先 OCR）
- **thinking**：Extended Thinking 输出的推理 block
- **tool_use**：Claude 调用工具的请求
- **tool_result**：用户把工具执行结果回传

</v-clicks>

---
transition: slide-up
---

# 接口能力 1：Prompt Caching

长系统提示（>1024 tokens）启用缓存，命中后 90% 折扣

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": LONG_SYSTEM_PROMPT,   # 几 K tokens 的项目说明
            "cache_control": {"type": "ephemeral"},
        }
    ],
    messages=[{"role": "user", "content": "今天的问题"}],
)
```

<v-click>

- **TTL**：5 分钟（ephemeral）
- **首次写入**：成本 25% 额外
- **命中读**：90% 折扣（仅 10% 常规价）
- **最大 4 个 cache breakpoint**：粒度控制

</v-click>

---
transition: slide-up
---

# Prompt Cache：用量观察

```python
# 首次写入
response.usage
# Usage(
#   input_tokens=10,
#   cache_creation_input_tokens=8000,    # 首次写入
#   cache_read_input_tokens=0,
#   output_tokens=100,
# )

# 5 分钟内同样请求
# Usage(
#   input_tokens=10,
#   cache_creation_input_tokens=0,
#   cache_read_input_tokens=8000,         # 命中 90% 折扣
#   output_tokens=100,
# )
```

<v-click>

**适合**：RAG 应用 / Claude Code 类长会话 / 多轮对话不变的开头部分。命中率 80%+ 时综合成本降到原来的 20%。

</v-click>

---
transition: slide-up
---

# 接口能力 2：Extended Thinking

模型先思考再答，复杂问题质量提升明显

```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=2048,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000,  # 思考阶段最多 10K tokens
    },
    messages=[
        {"role": "user", "content": "证明：对任意正整数 n，n^2 - n 是偶数"}
    ],
)

for block in response.content:
    if block.type == "thinking":
        print(f"[内部推理]\n{block.thinking}\n")
    elif block.type == "text":
        print(f"[最终回答]\n{block.text}")
```

---
transition: slide-up
---

# Extended Thinking：何时开？

<v-clicks>

**适合开**

- 数学 / 逻辑证明
- 复杂代码生成（多步骤设计）
- 战略规划 / 多约束权衡

**不要开**

- 简单事实问答
- 翻译 / 摘要
- 流式 UI 场景（用户等不及）

**关键参数**

- `budget_tokens`：1024 - 65536，思考阶段上限
- 思考 token 按 output 价计费（贵）
- thinking block 用户可见，可以审计模型推理

</v-clicks>

---
transition: slide-up
---

# 接口能力 3：Tool Use

```python
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {"type": "string"},
            },
            "required": ["city"],
        },
    }
]

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "上海现在多少度？"}],
)
```

<v-click>

Claude 返回 `tool_use` 类型的 content block，你执行函数，把结果作为 `tool_result` 传回。

</v-click>

---
transition: slide-up
---

# Tool Use：完整循环

```python
messages = [{"role": "user", "content": "查账单然后邮件回复 alice@example.com"}]

while True:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        tools=tools,
        messages=messages,
    )

    messages.append({"role": "assistant", "content": response.content})

    if response.stop_reason == "end_turn":
        break

    tool_results = []
    for block in response.content:
        if block.type == "tool_use":
            result = call_my_function(block.name, block.input)
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": result,
            })

    messages.append({"role": "user", "content": tool_results})
```

---
transition: slide-up
---

# tool_choice：控制行为

```python
# 1. auto（默认）：Claude 决定是否调
tool_choice = {"type": "auto"}

# 2. any：必须调一个工具
tool_choice = {"type": "any"}

# 3. tool：必须调指定工具
tool_choice = {"type": "tool", "name": "search_db"}

# 4. none：禁用工具
tool_choice = {"type": "none"}
```

<v-click>

**特色**：

- Claude 默认支持**多 tool 并行调用**
- `disable_parallel_tool_use: true` 可关闭并行（兼容性）
- JSON Schema 全集——不像 GPT 早期有子集限制

</v-click>

---
transition: slide-up
---

# 接口能力 4：MCP 集成

Anthropic 推动的 Model Context Protocol，Claude API 一类支持

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    mcp_servers=[
        {
            "type": "url",
            "url": "https://mcp.example.com",
            "name": "example",
            "authorization_token": "Bearer xxx",
        }
    ],
    messages=[...],
)
```

<v-click>

**MCP server 上的 tool 自动暴露给 Claude**——无需手写 `tools` 数组。这是与 GPT / Gemini 的关键差异之一。

</v-click>

---
transition: slide-up
---

# 接口能力 5：PDF 原生

无需先转图，直接送 PDF

```python
import base64

with open("paper.pdf", "rb") as f:
    pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "base64",
                        "media_type": "application/pdf",
                        "data": pdf_data,
                    },
                    "cache_control": {"type": "ephemeral"},   # PDF 也可缓存
                },
                {"type": "text", "text": "总结这篇论文的核心贡献"},
            ],
        }
    ],
)
```

---
transition: slide-up
---

# PDF：限制

<v-clicks>

**规格**

- 单 PDF ≤ 32MB
- 单 PDF ≤ 100 页（超过需先切分）
- 支持文字 PDF（扫描 PDF 不识别，需 OCR）

**最佳实践**

- 配合 `cache_control` 大幅降本
- 文字 + 图表 + 表格都能识别
- 适合：论文阅读 / 合同审查 / 报表分析

**对比**

- Claude / Gemini：原生支持 PDF
- GPT：需先 vision OCR 转图

</v-clicks>

---
transition: slide-up
---

# 接口能力 6：Vision

```python
import base64

with open("screenshot.png", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": image_data,
                    },
                },
                {"type": "text", "text": "这截图里是什么错误？"},
            ],
        }
    ],
)
```

---
transition: slide-up
---

# Vision：能力清单

<v-clicks>

**支持**

- OCR（图中文字）准确率高
- 图表理解 / 数据提取
- UI 截图 → 代码（HTML / Vue / React）
- 截图 debug（看 error 截图定位）
- 复杂图（架构图 / 流程图）描述

**不支持**

- 图像生成（用 DALL-E / Imagen / SD）
- 视频（仅静态图）

**规格**

- 格式：png / jpeg / gif / webp
- 自动 resize 最长边 ≤ 1568 px
- 每图 token 估算：≈ (W × H) / 750

</v-clicks>

---
transition: slide-up
---

# 接口能力 7：Batches 50% 折扣

异步批处理，1 小时内返回结果

```python
batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": "task-1",
            "params": {
                "model": "claude-sonnet-4-6",
                "max_tokens": 1024,
                "messages": [{"role": "user", "content": "翻译 ..."}],
            },
        },
        {"custom_id": "task-2", "params": {...}},
    ]
)

while batch.processing_status != "ended":
    time.sleep(60)
    batch = client.messages.batches.retrieve(batch.id)

for result in client.messages.batches.results(batch.id):
    print(result.custom_id, result.result.message.content)
```

---
transition: slide-up
---

# Batches：适用场景

<v-clicks>

**特点**

- 单 batch 最多 10,000 请求
- 24 小时内完成承诺（实际多在 1 小时内）
- **价格 50%**——比标准便宜一半
- 不占 RPM 配额

**适合**

- 离线数据处理（标注 / 翻译 / 摘要批量）
- 不需要实时性的任务
- 高并发场景：Tier 4 + Batches 组合

**不适合**

- 实时聊天 UI
- 用户即时反馈需求

</v-clicks>

---
transition: slide-up
---

# 接口能力 8：Files API

上传文件复用，避免每次重传 base64

```python
file = client.files.upload(
    file=open("paper.pdf", "rb"),
    purpose="user_data",
)

client.messages.create(
    messages=[{
        "role": "user",
        "content": [
            {"type": "document", "source": {"type": "file", "file_id": file.id}},
            {"type": "text", "text": "总结这份文档"},
        ]
    }],
    ...
)
```

<v-click>

- 文件最大 32MB（PDF）/ 5MB（图）
- 保留 30 天
- 复用次数无限——长文档反复问只上传一次

</v-click>

---
transition: slide-up
---

# 接口能力 9：Streaming

```python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=2048,
    messages=[{"role": "user", "content": "解释 React 18 并发模式"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

<v-click>

底层事件类型：

| 事件 | 含义 |
| --- | --- |
| `message_start` | 消息开始 |
| `content_block_start` | 新 content block 开始 |
| `content_block_delta` | block 内容增量 |
| `content_block_stop` | 当前 block 结束 |
| `message_delta` | 消息级 delta（usage） |
| `message_stop` | 完结 |

</v-click>

---
transition: slide-up
---

# 接口能力 10：Service Tier

```python
client.messages.create(
    service_tier="priority",     # auto / standard_only / priority
    ...
)
```

<v-clicks>

**三档**

- **auto**（默认）：自动选 standard，过载时降级
- **standard_only**：标准档，过载时排队
- **priority**：付费加速（约 +50% 价格，延迟降 30%+）

**省钱玩法**

- 闲时 standard，高峰 priority
- Batches 离线 50% 折扣作为补充

</v-clicks>

---
transition: slide-up
---

# XML Tags：结构化输入

Claude 训练数据偏好 XML 风格的结构化标记

```text
请评审这段代码：

<code language="python">
def divide(a, b):
    return a / b
</code>

<context>
这是一个生产环境工具函数，调用方不会预校验输入。
</context>

请按以下结构回复：
<issues>...</issues>
<suggestions>...</suggestions>
```

<v-click>

Claude 会理解 `<code>` `<context>` 等标签的语义边界，回复也按结构走。**比纯文本提示效果好得多**。

</v-click>

---
transition: slide-up
---

# Rate Limits：Tier 系统

| Tier | 月消费 | RPM | ITPM | OTPM |
| --- | --- | --- | --- | --- |
| 1 | $0+ | 50 | 50K | 10K |
| 2 | $40+ | 1000 | 100K | 20K |
| 3 | $200+ | 2000 | 200K | 40K |
| 4 | $400+ | 4000 | 400K | 80K |
| 自定义 | $5000+ | 联系销售 | - | - |

<v-clicks>

- RPM = requests / minute
- ITPM = input tokens / minute
- OTPM = output tokens / minute
- **按 model 独立计**：Opus 限速不影响 Sonnet
- Bursts 用 Batches（不受 RPM 限制）

</v-clicks>

---
transition: slide-up
---

# 价格速查（2026）

| 模型 | 输入 $/M | 输出 $/M | Cache 写入 | Cache 读 |
| --- | --- | --- | --- | --- |
| Opus 4.7 | $15 | $75 | $18.75 | $1.50 |
| Opus 4.7 (1M) | $30 | $150 | $37.50 | $3 |
| Sonnet 4.6 | $3 | $15 | $3.75 | $0.30 |
| Haiku 4.5 | $0.80 | $4 | $1.00 | $0.08 |

<v-clicks>

- Batches: **50%** 折扣
- Priority: **+50%** 加价
- Cache 读：标准价 **0.10x**（大头省钱处）

</v-clicks>

---
transition: slide-up
---

# 错误码速查

| HTTP | 类型 | 含义 |
| --- | --- | --- |
| 400 | `invalid_request_error` | 参数错（max_tokens 太大 / model ID 错） |
| 401 | `authentication_error` | API key 错 / 过期 |
| 403 | `permission_error` | 该 model 无访问权限 |
| 413 | `request_too_large` | 请求体太大 |
| 429 | `rate_limit_error` | 超 RPM / ITPM / OTPM |
| 500 | `api_error` | Anthropic 内部错 |
| 529 | `overloaded_error` | 服务过载（重试） |

<v-click>

响应 header 含 `retry-after` / `anthropic-ratelimit-*-remaining` 等关键信息。

</v-click>

---
transition: slide-up
---

# SDK 列表

| 语言 | 包 | 维护 |
| --- | --- | --- |
| Python | `anthropic` | 官方 |
| TypeScript / JS | `@anthropic-ai/sdk` | 官方 |
| Go | `github.com/anthropics/anthropic-sdk-go` | 官方 |
| Ruby | `anthropic` (gem) | 官方 |
| Java | `com.anthropic:anthropic` | 官方 |
| Rust | 社区 | - |
| Swift | 社区 | - |

<v-click>

所有官方 SDK 行为一致——SDK 之间切换只换 import。

</v-click>

---
transition: slide-up
---

# Bedrock / Vertex AI 三家差异

| 维度 | Anthropic API | Bedrock | Vertex AI |
| --- | --- | --- | --- |
| 模型 ID | `claude-sonnet-4-6` | `anthropic.claude-sonnet-4-6-v1:0` | `claude-sonnet-4-6@20250620` |
| 鉴权 | API key | AWS SigV4 | GCP IAM |
| 价格 | 标准 | 同标准 | 同标准 |
| 1M 上下文 | ✓ | 部分 region | 部分 region |
| MCP | ✓ | ✗ | ✗ |
| Prompt Cache | ✓ | ✓ | ✓ |
| Extended Thinking | ✓ | ✓ | ✓ |
| Batches | ✓ | ✓ | ✓ |

<v-click>

**MCP 仅 Anthropic 直连支持**——这是选 Anthropic API 的核心动机之一。

</v-click>

---
transition: slide-up
---

# SDK 三家切换

```python
# Anthropic 直连
from anthropic import Anthropic
client = Anthropic()

# Bedrock（AWS）
from anthropic import AnthropicBedrock
client = AnthropicBedrock(aws_region="us-west-2")

# Vertex（GCP）
from anthropic import AnthropicVertex
client = AnthropicVertex(region="us-east5", project_id="my-gcp-project")
```

<v-click>

**API 调用代码完全一致**——只换 client 构造。便于在三家之间切换或做 fallback。

</v-click>

---
layout: section
---

# 重点：与 GPT / Gemini 接口差异

<v-click>

接下来 10 张幻灯片专门聊三家接口差异——选型时最关心的部分

</v-click>

---
transition: slide-up
---

# 横向对比总览

| 能力 | Claude | GPT | Gemini |
| --- | --- | --- | --- |
| **Prompt Caching** | 一类（4 breakpoints） | 自动（5-15min） | Implicit + Explicit |
| **Extended Thinking** | ✓ (`thinking`) | ✓ (o-series) | ✓ (`thinkingConfig`) |
| **Tool Use** | JSON Schema 全集 | 受限子集 | Function Calling |
| **MCP** | ✓ 一类 | ✗（社区） | ✗（社区） |
| **PDF 原生** | ✓ | ✗（需 OCR） | ✓ |
| **图像生成** | ✗ | ✓ (DALL-E) | ✓ (Imagen) |
| **音频/视频** | ✗ | ✓ | ✓ |
| **Web 搜索** | 需 MCP | ✓ 内置 | ✓ 内置 |
| **结构化输出** | 通过 tool_use | ✓ 一类 | ✓ 一类 |
| **上下文** | 200K / 1M | 128K-256K | 1M / 2M |

---
transition: slide-up
---

# 差异 1：System Prompt 位置

**Claude**：顶层 `system` 字段

```python
client.messages.create(
    system="你是一个 Python 助手",
    messages=[{"role": "user", "content": "..."}],
)
```

**GPT**：作为 `role: system` 消息

```python
openai_client.chat.completions.create(
    messages=[
        {"role": "system", "content": "你是一个 Python 助手"},
        {"role": "user", "content": "..."},
    ],
)
```

**Gemini**：`systemInstruction` 字段

```python
model.generate_content(
    contents=[{"role": "user", "parts": [{"text": "..."}]}],
    system_instruction="你是一个 Python 助手",
)
```

---
transition: slide-up
---

# 差异 2：Prompt Caching

| 维度 | Claude | GPT | Gemini |
| --- | --- | --- | --- |
| 触发 | 显式 `cache_control` | 自动（≥1024 tokens） | Implicit + Explicit |
| TTL | 5 分钟 | 5-15 分钟 | 5-60 分钟 / 1 小时 |
| 折扣 | 命中读 90% | 命中读 50% | 命中读 75% |
| Breakpoints | 4 个（粒度控制） | 自动决定 | Explicit 可自定 |
| 控制力 | 强 | 弱 | 中 |

<v-clicks>

**Claude 优势**

- 折扣最深（90%）
- 控制力最强（4 个 breakpoint 任意分段）
- 适合 Claude Code 类「同 system prompt 反复用」场景

**GPT 优势**

- 自动，零代码

**Gemini 优势**

- TTL 最长（Explicit 1 小时）

</v-clicks>

---
transition: slide-up
---

# 差异 3：Tool Use Schema

**Claude**：JSON Schema 全集

```python
tools = [{
    "name": "search",
    "description": "...",
    "input_schema": {  # 完整 JSON Schema
        "type": "object",
        "properties": {
            "query": {"type": "string", "format": "uri"},
            "filters": {"anyOf": [{"type": "object"}, {"type": "null"}]},
        },
    },
}]
```

**GPT**：早期受限子集

```python
tools = [{
    "type": "function",
    "function": {
        "name": "search",
        "parameters": {  # 注意是 parameters 不是 input_schema
            "type": "object",
            "properties": {"query": {"type": "string"}},
        },
    },
}]
```

---
transition: slide-up
---

# 差异 4：MCP 集成

**Claude**：一类公民

```python
client.messages.create(
    mcp_servers=[
        {"type": "url", "url": "https://mcp.example.com", "name": "example"}
    ],
    ...
)
```

<v-clicks>

**这是 Anthropic 主推的差异化能力**——MCP（Model Context Protocol）是它们牵头的开放标准。

**GPT**：

- 无官方 MCP 支持
- 需要把 MCP server 的 tool 手动转成 OpenAI function 格式

**Gemini**：

- 同 GPT，社区有适配器
- Google 自家有「Function Calling + Extensions」生态

**意义**

- 第三方工具开发者只需写一次 MCP server，Claude 直接接入
- Claude Code / Claude Desktop 内置 MCP 客户端

</v-clicks>

---
transition: slide-up
---

# 差异 5：多模态广度

| 能力 | Claude | GPT | Gemini |
| --- | --- | --- | --- |
| 图像输入 | ✓ | ✓ | ✓ |
| 图像生成 | ✗ | ✓ DALL-E | ✓ Imagen |
| PDF 输入 | ✓ 原生 | ✗（需 OCR） | ✓ 原生 |
| 音频输入 | ✗ | ✓ Whisper | ✓ |
| 音频输出 | ✗ | ✓ TTS | ✓ |
| 视频输入 | ✗ | ✓ | ✓ |
| 实时模式 | ✗ | ✓ Realtime | ✓ Live |

<v-clicks>

**Claude 取舍**：只投资文本 + 图像 + PDF 三个核心模态。

- 不做生成（让 DALL-E / SD 专长）
- 不做音视频（让 Whisper / Gemini Live 专长）

**适合 Claude**：纯文本 / 代码 / 文档场景
**不适合**：多模态创意工作流（用 GPT-4o / Gemini 2.5）

</v-clicks>

---
transition: slide-up
---

# 差异 6：内置工具

| 工具 | Claude | GPT | Gemini |
| --- | --- | --- | --- |
| Web 搜索 | ✗（需 MCP） | ✓ `web_search` | ✓ Grounding |
| 代码解释器 | ✗（需 MCP） | ✓ `code_interpreter` | ✓ |
| 图像生成 | ✗ | ✓ `image_generation` | ✓ |
| 文件搜索 | ✗ | ✓ Assistants API | ✓ |

<v-clicks>

**Claude 哲学**：不内置，通过 MCP 接外部
- 优点：可换源
- 缺点：自己接入

**GPT 哲学**：内置一整套
- 优点：一行配置
- 缺点：绑定 OpenAI 自家服务

**实际选型**

- 要 Web 搜索 / 代码沙箱 → GPT 最快
- 要灵活换源 / 私有数据 → Claude + MCP

</v-clicks>

---
transition: slide-up
---

# 差异 7：结构化输出

**Claude**：通过 tool_use 间接做

```python
response = client.messages.create(
    tools=[{
        "name": "extract_info",
        "input_schema": MY_SCHEMA,
    }],
    tool_choice={"type": "tool", "name": "extract_info"},
    ...
)
# 从 response.content[0].input 拿结构化输出
```

**GPT**：一类公民

```python
openai_client.chat.completions.create(
    response_format={
        "type": "json_schema",
        "json_schema": {"name": "result", "schema": MY_SCHEMA, "strict": True},
    },
    ...
)
```

**Gemini**：一类公民

```python
model.generate_content(
    generation_config={"response_schema": MY_SCHEMA, "response_mime_type": "application/json"},
)
```

---
transition: slide-up
---

# 差异 8：上下文窗口

| 模型 | 标准上下文 | 大上下文模型 |
| --- | --- | --- |
| Claude Opus 4.7 | 200K | 1M (`[1m]` 后缀) |
| Claude Sonnet 4.6 | 200K | - |
| Claude Haiku 4.5 | 200K | - |
| GPT-5 | 256K | - |
| GPT-4o | 128K | - |
| Gemini 2.5 Pro | 1M | 2M |
| Gemini 2.5 Flash | 1M | - |

<v-clicks>

- **Gemini 上下文最长**（2M），但召回率随长度下降快
- **Claude 200K 是默认**——大多数场景够用
- **Claude 1M 用法**：模型 ID 加 `[1m]` 后缀，价格翻倍

</v-clicks>

---
transition: slide-up
---

# 差异 9：Streaming 事件

三家都用 SSE，但事件命名 / 粒度不同

**Claude** —— 6 种事件（细粒度）

```text
message_start → content_block_start → content_block_delta → content_block_stop
              → message_delta → message_stop
```

**GPT** —— chunk 流（粗粒度）

```python
for chunk in stream:
    delta = chunk.choices[0].delta
    if delta.content:
        print(delta.content, end="")
```

**Gemini** —— 类 GPT 但用 `parts`

```python
for chunk in stream:
    for part in chunk.parts:
        if part.text:
            print(part.text, end="")
```

<v-click>

**Claude 优势**：事件类型多，UI 可精准展示 thinking / text / tool_use 各阶段。

</v-click>

---
transition: slide-up
---

# 差异 10：定价模型

| 维度 | Claude | GPT | Gemini |
| --- | --- | --- | --- |
| Input | $0.80 - $30 | $0.10 - $10 | $0.075 - $5 |
| Output | $4 - $150 | $0.40 - $40 | $0.30 - $20 |
| Batches | 50% off | 50% off | - |
| Cache | 命中 90% off | 命中 50% off | 命中 75% off |
| Priority | +50% | - | - |

<v-clicks>

**Claude**：整体偏贵，但 Cache 命中后 0.1x（深度折扣）
**GPT**：中间档次性价比高（GPT-4o-mini）
**Gemini**：整体最便宜（Flash 系列）

**结论**：Cache 用得好的话 Claude 综合成本可能比 GPT / Gemini 低。

</v-clicks>

---
transition: slide-up
---

# 综合选型建议

<v-clicks>

**选 Claude**

- 编码 / Agent 长任务
- 长系统提示反复用（Cache 命中率高）
- 安全敏感场景（Constitutional 拒绝率低）
- 需要 MCP 生态
- Tool Use 灵活度需求高

**选 GPT**

- 多模态全栈（图 / 音 / 视频）
- 实时语音应用（Realtime API）
- 需要内置 web 搜索 / 代码沙箱
- 已有 OpenAI 生态投入

**选 Gemini**

- 超长上下文（2M）
- 多模态视频 / 音频
- 已有 Google Cloud 生态
- 成本敏感（Flash 系列便宜）

</v-clicks>

---
transition: slide-up
---

# 大陆访问方案

Anthropic API 在中国大陆不直接服务，常见方案

| 方案 | 难度 | 成本 |
| --- | --- | --- |
| 自备代理（梯子） | 低 | 仅代理费 |
| 经 OpenRouter / Poe / 第三方代理 | 低 | +10-30% 中间费 |
| Vercel / Cloudflare Edge 转发 | 中 | 服务器费 |
| Bedrock 香港 / 新加坡 region | 中 | AWS 费用 |

<v-click>

**推荐**

- 个人开发：OpenRouter（统一接口，多家可切）
- 企业：Bedrock 香港 region（合规 + 稳定）

</v-click>

---
transition: slide-up
---

# Constitutional AI 与拒绝率

<v-clicks>

**与 GPT 对比**

- GPT 拒绝率偏高（一些边界场景过度谨慎）
- Claude 倾向「先帮再警告」（解释危险知识时附风险提醒）
- 真正硬拒（CSAM / 武器制造 / 大规模伤害）两者都不会做

**绕过尝试**

- Jailbreak 类（DAN / Sydney 等）几乎全失效
- 角色扮演在 Claude 上很难突破
- 但合理的安全研究 / 红队场景 Claude 会配合（说明目的即可）

</v-clicks>

---
transition: slide-up
---

# 配合 Claude Code

Anthropic 自家 CLI 工具，深度集成 Claude 模型

```bash
# 安装
npm install -g @anthropic-ai/claude-code

# 启动
claude

# 在仓库目录里直接对话
> 帮我重构这个 React 组件，把 useState 改成 useReducer
```

<v-click>

**特色**

- 模型 + Skills + MCP + 文件系统集成
- 项目级 `CLAUDE.md` 自动注入（Prompt Cache 命中）
- 内置 `/compact` 压缩历史
- Subagent 系统并行任务
- Pro / Max 订阅包含，按使用量限速

</v-click>

---
transition: slide-up
---

# 生产部署 checklist

<v-clicks>

**接入**

- API key 走 Secret Manager，不进代码
- 三家通道（Anthropic / Bedrock / Vertex）准备 fallback
- 模型 ID 配置化，方便切换

**性能**

- 长 system prompt 加 `cache_control`
- 高并发用 Batches（不占 RPM）
- 流式响应改善体验

**监控**

- 记录 token / cost / latency 每次调用
- 监控 cache 命中率（< 50% 该重新设计 prompt）
- 设置 daily budget 上限

**容灾**

- 多模型 fallback（Opus → Sonnet 链路）
- 多通道 fallback（Anthropic → Bedrock）
- 429 / 529 retry with 指数退避

</v-clicks>

---
transition: slide-up
---

# 评估与对比

| Benchmark | Opus 4.7 | Sonnet 4.6 | Haiku 4.5 | GPT-5 | Gemini 2.5 |
| --- | --- | --- | --- | --- | --- |
| HumanEval | 95 | 90 | 78 | 92 | 89 |
| SWE-bench Verified | 68 | 55 | 30 | 60 | 50 |
| MMLU | 90 | 86 | 78 | 89 | 87 |
| GPQA | 60 | 50 | 30 | 55 | 48 |
| Aider | 82 | 75 | 50 | 78 | 72 |

<v-click>

数字为示意，以官方公布为准。

**关键观察**

- Claude Opus 4.7 在编码相关 benchmark 一致领先
- GPT-5 在 MMLU / GPQA 等通用知识略占优
- Sonnet 4.6 是性价比之王（接近 Opus 的 70% 能力，价格 20%）

</v-click>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 主要变化 |
| --- | --- | --- |
| Claude 2 | 2023 | 100K 上下文 |
| Claude 2.1 | 2023 末 | 200K |
| Claude 3 系列 | 2024 | 多模态首发 / 三档分明 |
| Claude 3.5 Sonnet | 2024 中 | Artifacts UI / Tool Use 大改 |
| Claude 3.5 Haiku | 2024 末 | Sonnet 3.5 同级性能但低价 |
| Claude 4 | 2025 | Constitutional AI v2 / Extended Thinking |
| Claude 4.7 / 4.6 / 4.5 | 2025-2026 | 1M 上下文 / 编码进一步提升 |

<v-click>

**Anthropic 节奏**：每年 1-2 次大版本，每季度小迭代。

</v-click>

---
transition: slide-up
---

# 关键文档资源

<v-clicks>

**官方**

- 文档首页：[docs.claude.com](https://docs.claude.com/)
- API Reference：[docs.claude.com/en/api](https://docs.claude.com/en/api/overview)
- Cookbook：[github.com/anthropics/anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook)
- Status：[status.anthropic.com](https://status.anthropic.com/)
- Console：[console.anthropic.com](https://console.anthropic.com/)

**SDK**

- Python：[anthropic-sdk-python](https://github.com/anthropics/anthropic-sdk-python)
- TypeScript：[anthropic-sdk-typescript](https://github.com/anthropics/anthropic-sdk-typescript)

**协议**

- MCP：[modelcontextprotocol.io](https://modelcontextprotocol.io/)

</v-clicks>

---
layout: center
class: text-center
---

# 总结

适合：编码 / Agent / 长系统提示 Cache / Tool Use / MCP 生态

不适合：多模态创意（音/视频）/ 内置 web 搜索 / 实时语音 → 用 GPT / Gemini

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://docs.claude.com" target="_blank">docs.claude.com</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/anthropics/anthropic-sdk-python" target="_blank">anthropics/anthropic-sdk-python</a>
</div>
