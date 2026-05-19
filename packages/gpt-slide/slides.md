---
theme: seriph
background: https://cover.sli.dev
title: Welcome to GPT
info: |
  Presentation GPT (OpenAI) for developers.

  Learn more at [https://platform.openai.com/docs](https://platform.openai.com/docs)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:openai-icon class="text-7xl" />
</div>

<br/>

## GPT：多模态全栈 + 内置工具 + 结构化输出最全的 LLM

GPT-5 / o-series / GPT-4o + Realtime API + 内置 web_search / code_interpreter

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 GPT —— OpenAI 推出的大语言模型家族。

2022 年 ChatGPT 引爆 LLM 浪潮的源头，2026 年仍是接口能力最全面的厂商。
-->

---
transition: fade-out
---

# 什么是 GPT？

OpenAI 推出的大语言模型家族，**多模态全栈 + 内置工具 + 结构化输出**接口能力最全

<v-click>

- **多模态最全**：文本 + 视觉（图）+ 音频（输入 / 输出）+ 视频帧 + Realtime 实时双向语音
- **内置工具一类公民**：web_search / code_interpreter / image_generation / file_search 直接调
- **Structured Outputs**：业界最早一类支持 JSON Schema 强保证匹配
- **o-series 推理模型**：内置 chain-of-thought，复杂数学 / 物理基准业界顶尖
- **Realtime API**：低延迟双向语音对话（首响应 < 500ms），构建语音 Agent 首选
- **生态最广**：第三方集成 / 教程 / 工具最多；大陆 Azure 香港 region 可用

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_OpenAI Platform_](https://platform.openai.com/docs)

</div>

<style>
h1 {
  background-color: #10A37F;
  background-image: linear-gradient(45deg, #10A37F 10%, #1A1A1A 90%);
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

**优点**

<v-clicks>

- **多模态最全**：图 / 音（输入输出）/ 视频帧 / Realtime 双向语音全栈
- **内置工具一类公民**：web_search / code_interpreter / image_generation 无需自接 MCP
- **Structured Outputs**：传 JSON Schema 强保证——业界最早一类支持
- **o-series 推理顶尖**：复杂数学 / 物理 / 逻辑推理基准业界领先
- **大陆友好**：Azure OpenAI 香港 / 新加坡 region 替代多

</v-clicks>

<br>

**缺点**

<v-clicks>

- **编码弱于 Claude 4.7**（SWE-bench 略胜）/ **拒绝率偏高**
- **API 分裂**：旧 `chat.completions` + 新 `responses` 两套
- **价格策略复杂** / **MCP 非一类公民**（仅社区支持）

</v-clicks>

---
transition: slide-up
---

# 主力模型矩阵（2026）

| 模型 | 上下文 | 输出 | 用途 |
|---|---|---|---|
| `gpt-5` | 256K | 32K | 旗舰复杂任务 |
| `gpt-5-mini` | 256K | 32K | 日常生产 |
| `gpt-5-nano` | 128K | 16K | 简单 / 高并发 |
| `o3` | 200K | 100K | 深度推理 |
| `o4-mini` | 200K | 64K | 推理 + 低成本 |
| `gpt-4o` | 128K | 16K | 多模态（图 + 音 + 视频帧） |
| `gpt-4o-realtime-preview` | 128K | - | Realtime API（语音） |

---
transition: slide-up
---

# 怎么选模型？

<v-clicks>

- **简单 QA / 高并发**：`gpt-5-nano`（最便宜）
- **日常生产**：`gpt-5-mini`
- **旗舰复杂任务**：`gpt-5`（256K 上下文）
- **数学证明 / 物理推理**：`o3` + `reasoning_effort: "high"`
- **多模态（图 / 音 / 视频）**：`gpt-4o` 系列
- **语音 Agent / 双向对话**：`gpt-4o-realtime-preview`
- **图像生成 / STT / TTS**：`gpt-image-1` / `whisper-1` / `tts-1`

</v-clicks>

---
transition: slide-up
---

# API 双轨：chat.completions vs responses

OpenAI 2025 起推**新 API `responses`**——为 Agent 场景设计，将取代旧 `chat.completions`

| API | 端点 | 适合 |
|---|---|---|
| `chat.completions` | `POST /v1/chat/completions` | 旧式对话（兼容） |
| `responses` | `POST /v1/responses` | Agent / 内置工具 / 长任务 |

<v-click>

**核心差异**：

- 旧 API 用 `messages` 数组管理历史，每次传完整对话
- 新 API 用 `previous_response_id` 接续，OpenAI 服务器保留 30 天，省 token
- **内置工具（web_search / code_interpreter / image_generation）只能在 responses 用**

</v-click>

---
transition: slide-up
---

# chat.completions：旧 API

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-5",
    messages=[
        {"role": "system", "content": "你是简洁的代码评审助手"},
        {"role": "user", "content": "评审：def divide(a, b): return a / b"},
    ],
    max_completion_tokens=1024,
)

print(response.choices[0].message.content)
print(f"用量: {response.usage}")
```

<v-click>

适合：简单对话 / 已有 OpenAI 集成 / 不需要内置工具的场景。

</v-click>

---
transition: slide-up
---

# responses：新 API（Agent / 内置工具）

```python
response = client.responses.create(
    model="gpt-5",
    instructions="你是简洁的代码评审助手",   # 替代 system message
    input="评审：def divide(a, b): return a / b",
    tools=[{"type": "web_search"}],          # 内置 web 搜索
)

print(response.output_text)
print(f"response id: {response.id}")

# 接续（无需传整段历史，OpenAI 服务器保留 30 天）
followup = client.responses.create(
    model="gpt-5",
    previous_response_id=response.id,
    input="再补充一条建议",
)
```

---
transition: slide-up
---

# 内置工具：web_search

```python
response = client.responses.create(
    model="gpt-5",
    input="2026 年 NBA 总冠军是谁？",
    tools=[{
        "type": "web_search",
        "user_location": {"country": "US"},
        "search_context_size": "medium",     # low / medium / high
    }],
)

# 引用源
for citation in response.output_text_citations:
    print(citation.url, citation.title)
```

<v-click>

OpenAI 后台调搜索引擎，把结果注入 context。**Claude 没有这个**（需 MCP）；**Gemini** 用 `grounding: { google_search: {} }`。

</v-click>

---
transition: slide-up
---

# 内置工具：code_interpreter

```python
response = client.responses.create(
    model="gpt-5",
    input="计算 ln(2) 的连分数展开前 10 项",
    tools=[{
        "type": "code_interpreter",
        "container": {"type": "auto"},
    }],
)
# 模型自动写 Python + 执行 + 看结果迭代
```

<v-click>

OpenAI 后台启动 sandbox：**Python 3.12 + pandas / numpy / matplotlib / scipy**，会话独立、结束销毁。

**与其它 LLM 对比**：
- **Claude**：无内置 code interpreter，需自接 sandbox MCP
- **Gemini**：`code_execution` 一类支持

</v-click>

---
transition: slide-up
---

# 内置工具：image_generation

```python
response = client.responses.create(
    model="gpt-5",
    input="画一张未来感的赛博朋克街景",
    tools=[{
        "type": "image_generation",
        "size": "1024x1024",     # 256/512/1024/1024x1536/1536x1024
        "quality": "high",        # low / medium / high
        "n": 1,
    }],
)

for output in response.output:
    if output.type == "image_generation_call":
        print(output.image_url)
```

<v-click>

底层调 **GPT-Image-1**（DALL-E 继任者）。**Claude 完全不生图**；**Gemini** 用 Imagen 独立 API。

</v-click>

---
transition: slide-up
---

# 内置工具：file_search（内置 RAG）

```python
# 1. 创建 vector store
vs = client.vector_stores.create(name="my-docs")

# 2. 上传文件
client.vector_stores.files.upload(
    vector_store_id=vs.id,
    file=open("manual.pdf", "rb"),
)

# 3. 调用
response = client.responses.create(
    model="gpt-5",
    input="产品的退款政策是什么？",
    tools=[{
        "type": "file_search",
        "vector_store_ids": [vs.id],
        "max_num_results": 20,
    }],
)
```

<v-click>

**Claude** 无内置 RAG（需自接 vector DB）；**Gemini** 内置 Semantic Retrieval API。

</v-click>

---
transition: slide-up
---

# Structured Outputs：strict mode

GPT 业界最早一类支持「**强保证 JSON Schema 匹配**」

```python
from pydantic import BaseModel
from typing import Literal

class CodeReview(BaseModel):
    issues: list[str]
    suggestions: list[str]
    score: int
    polarity: Literal["positive", "neutral", "negative"]

response = client.chat.completions.parse(
    model="gpt-5",
    messages=[{"role": "user", "content": "评审：def divide(a, b): return a / b"}],
    response_format=CodeReview,
)

review: CodeReview = response.choices[0].message.parsed
print(review.issues, review.score)
```

---
transition: slide-up
---

# Structured Outputs：直接传 JSON Schema

```python
response = client.chat.completions.create(
    model="gpt-5",
    messages=[...],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "code_review",
            "strict": True,                    # 关键！
            "schema": {
                "type": "object",
                "properties": {
                    "issues": {"type": "array", "items": {"type": "string"}},
                    "score": {"type": "integer", "minimum": 0, "maximum": 10},
                },
                "required": ["issues", "score"],
                "additionalProperties": False,
            },
        },
    },
)
```

---
transition: slide-up
---

# strict: True 保证什么？

<v-clicks>

- **字段名严格匹配 schema**：不会出现拼写错误的 key
- **类型严格匹配**：不会 string 当 int 返回
- **enum 严格匹配**：只在枚举值中选
- **required 字段一定有**：必填字段绝不缺失
- **nested object 全递归校验**：嵌套对象也保证
- `additionalProperties: false` 必须显式设

</v-clicks>

<v-click>

**限制**：不支持 `not`、`anyOf` 部分场景 / 递归深度 ≤ 5 层 / 总 properties ≤ 100。

</v-click>

---
transition: slide-up
---

# Structured Outputs 厂商对比

| 厂商 | 方案 | 强保证？ |
|---|---|---|
| **GPT** | `response_format: { type: "json_schema", strict: true }` | ✓ 业界最早一类 |
| **Claude** | Tool Use 模拟（伪 function call 返回 JSON） | 部分 |
| **Gemini** | `responseSchema` 一类支持 | ✓ |

<v-click>

**经验**：GPT 的 strict 模式最稳——大批量结构化数据抽取场景首选。

</v-click>

---
transition: slide-up
---

# o-series 推理：reasoning_effort

`o3` / `o4-mini` 内置 chain-of-thought 推理

```python
response = client.chat.completions.create(
    model="o3",
    messages=[
        {"role": "user", "content": "证明：对任意正整数 n，n^2 - n 是偶数"}
    ],
    reasoning_effort="high",       # low / medium / high
    max_completion_tokens=4096,
)

print(response.choices[0].message.content)

# 推理 tokens（不可见但按 output 价计费）
print(f"reasoning_tokens: {response.usage.completion_tokens_details.reasoning_tokens}")
```

---
transition: slide-up
---

# reasoning_effort 选哪个？

| 等级 | 思考量 | 速度 | 价格 | 准确率 |
|---|---|---|---|---|
| `low` | 少 | 快 | 低 | 一般 |
| `medium` | 默认 | 中 | 中 | 高 |
| `high` | 多 | 慢 | 高 | 最高 |

<v-click>

**何时用 o-series**：数学证明 → `o3` high；物理 / 化学推理 → `o3` medium-high；复杂业务规则 → `o3` medium；代码生成 → GPT-5（o-series 慢 + 贵）；简单 QA → `gpt-5-mini` / `nano`

</v-click>

---
transition: slide-up
---

# o-series vs Claude vs Gemini 推理

<v-clicks>

- **GPT o-series**：`reasoning_effort: "low/medium/high"` 间接控制思考预算
- **Claude Extended Thinking**：`thinking: {enabled, budget_tokens}` 显式 token 预算
- **Gemini 2.5+**：`thinkingConfig: {thinkingBudget}` 类 Claude

</v-clicks>

<v-click>

**差异**：

- GPT 用 effort 等级抽象，简单但不可精确控制
- Claude 用 `budget_tokens` 显式（如 16384），可精确
- Gemini 类似 Claude，可 `0` 关闭思考

</v-click>

---
transition: slide-up
---

# Multimodal：图

```python
import base64

with open("screenshot.png", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "这截图里是什么错误？"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{image_data}",
                        "detail": "high",     # auto / low / high
                    },
                },
            ],
        }
    ],
)
```

---
transition: slide-up
---

# 图像格式：三家 API 不通用

<v-clicks>

- **GPT**：`{ "type": "image_url", "image_url": { "url": "..." } }`
- **Claude**：`{ "type": "image", "source": { "type": "base64", "media_type": "...", "data": "..." } }`
- **Gemini**：`{ "inlineData": { "mimeType": "...", "data": "..." } }`

</v-clicks>

<v-click>

**结论**：要在三家间切，必须封装 adapter。字段名、嵌套结构、data 编码全不一样。

</v-click>

---
transition: slide-up
---

# Multimodal：音频（Whisper + TTS）

```python
# 语音转文字（Whisper）
audio_file = open("speech.mp3", "rb")
transcript = client.audio.transcriptions.create(
    model="whisper-1",
    file=audio_file,
    language="zh",    # 可选
)
print(transcript.text)

# 文字转语音（TTS）
response = client.audio.speech.create(
    model="tts-1",                # 或 tts-1-hd
    voice="alloy",                # alloy / echo / fable / onyx / nova / shimmer
    input="你好，欢迎使用 OpenAI",
    response_format="mp3",
)
response.stream_to_file("output.mp3")
```

---
transition: slide-up
---

# 音频能力对比

<v-clicks>

- **Claude**：**完全没有音频 API**（没有 STT，没有 TTS）
- **Gemini**：原生集成（同一个 generate API 接受音频输入）
- **GPT**：Whisper 独立 endpoint + Realtime API 双向语音

</v-clicks>

<v-click>

**结论**：要做语音应用，**Claude 直接淘汰**；Gemini 和 GPT 都可以，GPT 的 Realtime API 更成熟。

</v-click>

---
transition: slide-up
---

# Multimodal：视频帧

GPT-4o 把视频拆成关键帧分析（手动抽帧）：

```python
import cv2, base64

cap = cv2.VideoCapture("video.mp4")
frames = []
while cap.isOpened():
    ret, frame = cap.read()
    if not ret: break
    _, buffer = cv2.imencode(".jpg", frame)
    frames.append(base64.b64encode(buffer).decode())
    cap.set(cv2.CAP_PROP_POS_FRAMES, cap.get(cv2.CAP_PROP_POS_FRAMES) + 29)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "总结这段视频内容"},
            *[{"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{f}"}}
              for f in frames[:10]],
        ],
    }],
)
```

---
transition: slide-up
---

# 视频对比

| 厂商 | 视频处理 |
|---|---|
| **GPT** | 手动抽帧 → 多张图发送 |
| **Claude** | **不支持**（只能处理静态图） |
| **Gemini** | 原生 video API（直接传视频文件，自动抽帧 + 时间戳） |

<v-click>

视频场景 **Gemini 最简单**；GPT 需要前置处理；Claude 不行。

</v-click>

---
transition: slide-up
---

# Realtime API：双向实时语音（GPT 独有）

构建语音对话 Agent 的低延迟双向接口

```python
import asyncio
from openai import AsyncOpenAI

async def voice_agent():
    client = AsyncOpenAI()
    async with client.beta.realtime.connect(
        model="gpt-4o-realtime-preview"
    ) as conn:
        await conn.session.update(session={
            "modalities": ["text", "audio"],
            "voice": "alloy",
            "instructions": "你是一个友好的客服助手",
            "input_audio_format": "pcm16",
            "output_audio_format": "pcm16",
            "input_audio_transcription": {"model": "whisper-1"},
            "turn_detection": {"type": "server_vad", "threshold": 0.5},
            "tools": [...],
        })
```

---
transition: slide-up
---

# Realtime：事件循环

```python
        # 麦克风音频流写入
        await conn.input_audio_buffer.append(audio_data=audio_chunk)

        # 接事件
        async for event in conn:
            if event.type == "response.audio.delta":
                play_audio(event.delta)               # 边收边播
            elif event.type == "response.audio_transcript.delta":
                print(event.delta, end="")            # 转写也回来
            elif event.type == "response.function_call_arguments.done":
                # 模型在语音中调函数
                result = call_func(event.name, event.arguments)
                await conn.conversation.item.create(item={
                    "type": "function_call_output",
                    "call_id": event.call_id,
                    "output": result,
                })

asyncio.run(voice_agent())
```

---
transition: slide-up
---

# Realtime 核心优势

<v-clicks>

- **首响应 < 500ms**：用户说话还没结束就开始回应
- **边说边听**：不需先停说话再回应（自然对话节奏）
- **VAD（语音活动检测）自动断句**：`server_vad` 自动判停顿
- **模型可在语音中调函数**：如「帮我查订单」→ 调 lookup → 继续说
- **WebSocket 双工**：`wss://api.openai.com/v1/realtime`
- **可同时返回 audio + text**：text 用于日志 / 字幕

</v-clicks>

<v-click>

**对比**：**Claude 完全没有这个能力** / **Gemini Live API 类似** / GPT Realtime 最成熟。

</v-click>

---
transition: slide-up
---

# Function Calling

```python
tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get current weather",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string"},
                "unit": {"type": "string", "enum": ["c", "f"]},
            },
            "required": ["city"],
        },
        "strict": True,            # GPT-5+ 强 schema 模式
    },
}]

response = client.chat.completions.create(
    model="gpt-5",
    messages=[{"role": "user", "content": "上海今天什么温度？"}],
    tools=tools,
    tool_choice="auto",                # auto / none / required
    parallel_tool_calls=True,          # 默认 True
)
```

---
transition: slide-up
---

# Function Calling 厂商对比

<v-clicks>

- **GPT**：`tools: [{"type": "function", "function": {...}}]`，`tool_choice: "auto/none/required"`
- **Claude**：`tools: [{name, input_schema, ...}]`（无 `parameters` 包裹），`tool_choice: {type: "any"}`
- **Gemini**：`tools: [{functionDeclarations: [...]}]`，`toolConfig` 控制
- **GPT-5+ strict 模式**：`"strict": True` 保证 schema 严格不漏字段
- **并行**：GPT 默认开 `parallel_tool_calls`；Claude 也默认并行

</v-clicks>

---
transition: slide-up
---

# Prompt Cache：自动 50% 折扣

```python
# 第二次相同 system + 前缀消息时自动命中
response = client.chat.completions.create(
    model="gpt-5",
    messages=[
        {"role": "system", "content": LONG_SYSTEM_PROMPT},   # > 1024 tokens
        {"role": "user", "content": "..."},
    ],
)

print(response.usage.prompt_tokens)
print(response.usage.prompt_tokens_details.cached_tokens)    # 命中数
```

<v-clicks>

- **自动启用**（不需 `cache_control`，最少 1024 tokens 才能进 cache）
- **TTL**：5-15 分钟动态（不像 Claude 严格 5 分钟）
- **价格**：`cached_tokens` 按 **50% 折扣**（不像 Claude 90% + 写入成本）

</v-clicks>

---
transition: slide-up
---

# Cache 厂商对比

<v-clicks>

- **GPT**：**自动**，5-15min TTL，**50% 折扣**，无写入成本
- **Claude**：**手动 `cache_control`**，5min TTL，**90% 折扣** + 25% 写入成本
- **Gemini**：implicit cache（自动）+ explicit cache（手动），75% 折扣

</v-clicks>

<v-click>

**取舍**：

- 长会话场景 **Claude 更划算**（90% + 写入摊销）
- 短重复场景 **GPT 更省事**（什么都不用配）
- 超大上下文 **Gemini implicit cache** 适合不可预测命中

</v-click>

---
transition: slide-up
---

# Batches API：50% 折扣

```python
# 1. 创建 batch file（JSONL 格式）
import json
with open("batch.jsonl", "w") as f:
    for i in range(10000):
        f.write(json.dumps({
            "custom_id": f"task-{i}",
            "method": "POST",
            "url": "/v1/chat/completions",
            "body": {
                "model": "gpt-5-mini",
                "messages": [{"role": "user", "content": f"翻译 {i}"}],
                "max_completion_tokens": 256,
            },
        }) + "\n")

# 2. 上传 + 创建 + 轮询 + 下载
batch_file = client.files.create(file=open("batch.jsonl", "rb"), purpose="batch")
batch = client.batches.create(input_file_id=batch_file.id,
                              endpoint="/v1/chat/completions",
                              completion_window="24h")
```

<v-click>

价格：**50%** 标准价。24 小时内完成（通常 1-2 小时）。

</v-click>

---
transition: slide-up
---

# 价格速查（2026）

| Model | Input $/M | Output $/M | Cached $/M |
|---|---|---|---|
| GPT-5 | $5 | $25 | $2.50 |
| GPT-5-mini | $0.50 | $2.50 | $0.25 |
| GPT-5-nano | $0.10 | $0.40 | $0.05 |
| o3 | $15 | $60 | $7.50 |
| o4-mini | $1.50 | $6 | $0.75 |
| GPT-4o | $2.50 | $10 | $1.25 |
| GPT-4o-mini | $0.15 | $0.60 | $0.075 |

<v-click>

**额外折扣**：Batches **50% off** / Flex tier **50% off**（延迟可能慢）。

</v-click>

---
transition: slide-up
---

# Azure OpenAI 差异

```python
from openai import AzureOpenAI

client = AzureOpenAI(
    azure_endpoint="https://my-resource.openai.azure.com/",
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version="2025-12-01-preview",
)

response = client.chat.completions.create(
    model="my-gpt5-deploy",   # ← Azure 用部署名，不是 model ID
    messages=[...],
)
```

| 维度 | OpenAI 直连 | Azure OpenAI |
|---|---|---|
| 模型 ID | `gpt-5` | 部署名（自定义） |
| Region | 全球（不含大陆） | 含香港 / 新加坡 |
| 模型更新 | 即时 | 滞后 1-2 月 |

---
transition: slide-up
---

# 与 Claude / Gemini 接口能力对比（重点）

| 能力 | GPT | Claude | Gemini |
|---|---|---|---|
| 内置 web_search | ✓ | -（需 MCP） | ✓（grounding） |
| 内置 code_interpreter | ✓ | -（需 MCP） | ✓ |
| 内置 image_generation | ✓ | ✗ | ✓（Imagen） |
| 内置 file_search RAG | ✓ | -（需自建） | ✓（Semantic Retrieval） |
| Realtime 双向语音 | ✓ | ✗ | ✓（Live API） |
| 音频 STT / TTS | ✓ Whisper / ✓ | ✗ | ✓ / ✓ |
| Video 帧 | ✓ 手动抽 | -（仅图） | ✓ 原生 |

---
transition: slide-up
---

# 接口能力对比续

| 能力 | GPT | Claude | Gemini |
|---|---|---|---|
| Structured Outputs | ✓ 一类 strict | -（Tool Use 模拟） | ✓ 一类 |
| Prompt Cache | 自动 5-15min / 50% | 手动 5min / 90% | implicit + explicit |
| Tool Use 严格 schema | ✓（strict: true） | ✓ | ✓ |
| MCP | -（社区） | ✓ 一类 | -（社区） |
| 上下文 | 128-256K | 200K / 1M | 1M / 2M |
| 推理模型 | o-series | Extended Thinking | thinkingConfig |
| Agent SDK | OpenAI Agents SDK | Claude Agent SDK | -（社区） |

---
transition: slide-up
---

# GPT 强项总结

<v-clicks>

- **多模态全栈**：图 + 音（输入 / 输出）+ 视频帧 + Realtime 实时语音——**Claude 完全不行**
- **内置工具**：web_search / code_interpreter / image_generation 不用自接 MCP
- **Structured Outputs strict**：JSON Schema 强保证业界最早一类支持
- **Realtime API**：< 500ms 首响应，构建语音 Agent 首选
- **生态最广**：第三方教程 / 框架 / SDK 最多
- **大陆友好**：Azure 香港 region 替代多

</v-clicks>

---
transition: slide-up
---

# Claude / Gemini 各强什么？

<v-clicks>

- **Claude 强在**：
  - 编码 / Agent（SWE-bench 略胜 GPT）
  - **MCP 一类公民**（Model Context Protocol 标准）
  - **Constitutional AI**（拒绝率更精准）
  - Extended Thinking 显式 budget
- **Gemini 强在**：
  - **超长上下文**（1M / 2M）
  - **大规模 implicit cache**（自动命中超大上下文）
  - **原生 video API**（不用抽帧）
  - 多模态原生集成（不需分 endpoint）

</v-clicks>

---
transition: slide-up
---

# 三家如何选？

<v-clicks>

- **多模态全栈应用**（语音 / 图 / 视频 + 内置工具）→ **GPT**
- **复杂 Agent / 编码 / MCP 标准** → **Claude**
- **超长上下文（书籍 / 大型代码库）/ 视频处理** → **Gemini**
- **不确定 → 三家都接 + adapter 层**（OpenRouter / LiteLLM 帮你统一）

</v-clicks>

<v-click>

**经验**：生产应用大多用 1-2 家。**重要功能用主厂商，次要功能可走便宜厂商节省成本**。

</v-click>

---
transition: slide-up
---

# 大陆访问

OpenAI 官方不直接服务大陆，方案：

| 方案 | 优势 | 劣势 |
|---|---|---|
| **Azure OpenAI（香港 / 新加坡）** | 企业级 SLA / 合规 | 模型滞后 1-2 月 |
| 自备代理（梯子） | 便宜 | 个人开发用 |
| OpenRouter / 代理服务 | 一键 | 加 10-30% 中间费 |
| 自部署 Edge 函数转发 | 灵活 / 隐私 | 维护成本 |
| 国内同款（DeepSeek / Qwen） | 直连快 | 能力差异 |

<v-click>

**企业用 Azure 香港，个人用 OpenRouter** 是大陆访问最常见组合。

</v-click>

---
transition: slide-up
---

# Error Handling 与错误码

```python
from openai import RateLimitError, APIStatusError
import time

try:
    response = client.chat.completions.create(...)
except RateLimitError:
    time.sleep(60); response = client.chat.completions.create(...)
except APIStatusError as e:
    if e.status_code == 503: response = fallback_to_azure(...)
```

| HTTP | 类型 | 含义 |
|---|---|---|
| 400 | `invalid_request_error` | 参数错 |
| 401 | `authentication_error` | API key 错 / 过期 |
| 429 | `rate_limit_exceeded` | 超 RPM / TPM |
| 500/503 | `server_error/service_unavailable` | OpenAI 内部 / 过载 |

---
transition: slide-up
---

# Rate Limits：Tier 系统

| Tier | 月消费 | RPM | TPM |
|---|---|---|---|
| Free | $0 | 3 | 200K |
| 1 | $5+ | 500 | 30K |
| 2 | $50+ | 5000 | 450K |
| 4 | $250+ | 10K | 2M |
| 5 | $1000+ | 30K | 8M |

<v-click>

按 **model + endpoint 独立限速**。重模型（o3 / GPT-5）配额更紧；mini / nano 宽松。响应 header：`x-ratelimit-*`。

</v-click>

---
transition: slide-up
---

# 故障排查

| 现象 | 排查 |
|---|---|
| `401` | API key 错 / 过期 |
| `429` | 超 RPM / TPM，看 `x-ratelimit-*` header |
| `400 context_length_exceeded` | 切大窗口 model |
| 流式断开 | SSE 超时（一般 10min） |
| Function 不调 | `tool_choice: required` 强制 |
| JSON Schema 不严格 | `strict: True` 必须开 |
| 大陆延迟高 | 用 Azure / 代理 |

---
transition: slide-up
---

# Endpoint 完整列表

| Endpoint | 用途 |
|---|---|
| `POST /v1/chat/completions` | 旧式对话 |
| `POST /v1/responses` | 新式 Agent / 内置工具 |
| `POST /v1/embeddings` / `images/generations` | 向量嵌入 / 图像生成 |
| `POST /v1/audio/speech` / `transcriptions` | TTS / STT |
| `POST /v1/files` / `batches` | 文件 / Batch |
| `WS /v1/realtime` | Realtime API（语音） |
| `POST /v1/vector_stores` | RAG vector store |

---
transition: slide-up
---

# 流式 + Service Tier

```python
# 流式
stream = client.chat.completions.create(
    model="gpt-5", messages=[...], stream=True,
)
for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)
```

```python
# Service Tier（控制延迟 / 价格）
client.chat.completions.create(
    model="gpt-5", messages=[...],
    service_tier="flex",   # default / flex（50% off）/ priority / auto
)
```

<v-click>

**Assistants API 弃用警告**：2023 旧 API 2026 后弃用——迁到 `responses` + `previous_response_id`。

</v-click>

---
transition: slide-up
---

# 版本里程碑

| 模型 | 时间 | 主要变化 |
|---|---|---|
| GPT-3.5 | 2022 | ChatGPT 引爆 LLM 浪潮 |
| GPT-4 | 2023 | 多模态首发 + Plugin |
| GPT-4-Turbo | 2023 末 | 128K 上下文 / Assistants API |
| GPT-4o | 2024 中 | 全模态 / Realtime API |
| o1 / o3 | 2024-2025 | 推理模型（CoT 训练） |
| GPT-5 / mini / nano | 2025 | 旗舰 + responses API + 内置工具 + 低成本档 |
| o4-mini | 2026 | 推理 + 低成本 |

---
transition: slide-up
---

# Embedding 模型 + 模型决策树

| Model | 维度 | 价格 |
|---|---|---|
| `text-embedding-3-large` | 3072 | $0.13/M |
| `text-embedding-3-small` | 1536 | $0.02/M |

<v-clicks>

**决策树**：

1. 要 chain-of-thought 推理 → `o3` / `o4-mini`
2. 要多模态 → `gpt-4o` / `gpt-4o-mini` / Realtime preview
3. 长上下文（200K+） → `gpt-5` / `gpt-5-mini`
4. 高并发省钱 → `gpt-5-nano` / `gpt-4o-mini`
5. 平衡（默认推荐） → `gpt-5-mini`

</v-clicks>

---
transition: slide-up
---

# 实战：内置工具组合用

```python
# 三个内置工具叠加（responses API）
response = client.responses.create(
    model="gpt-5",
    instructions="你是一个研究助手",
    input="2026 Q1 AI 行业有哪些重大事件？画一张事件时间线图。",
    tools=[
        {"type": "web_search"},                 # 搜资讯
        {"type": "code_interpreter",
         "container": {"type": "auto"}},        # 处理数据 / 画图
        {"type": "image_generation",
         "size": "1536x1024"},                  # 生成最终图
    ],
)

# 模型自动决定调哪个工具几次
for output in response.output:
    print(output.type, output)
```

---
transition: slide-up
---

# 实战：批量结构化数据抽取

```python
# 100 万条评论批量做情感分析
class Sentiment(BaseModel):
    polarity: Literal["positive", "negative", "neutral"]
    confidence: float

# 生成 batch JSONL
with open("sentiment.jsonl", "w") as f:
    for i, review in enumerate(reviews):
        f.write(json.dumps({
            "custom_id": f"r-{i}",
            "method": "POST",
            "url": "/v1/chat/completions",
            "body": {
                "model": "gpt-5-mini",
                "messages": [{"role": "user", "content": review}],
                "response_format": Sentiment.model_json_schema(),
            },
        }) + "\n")

# 提交 + 等结果（50% 折扣，24h）
```

---
transition: slide-up
---

# Best Practice

**成本** / **可靠性** / **安全**

<v-clicks>

- **成本**：Prompt Cache 自动 50% / Batches 50% / Flex tier 50% / mini-nano 预筛
- **可靠**：`strict: true` 永远开 / Retry with exponential backoff / Fallback model / Streaming 心跳
- **安全**：API key 仅服务端 / OIDC 替代长期 key / `omni-moderation-latest` 预筛 / PII 脱敏

</v-clicks>

---
transition: slide-up
---

# OpenAI Agents SDK（新）

```python
from openai import Agent, Runner

# 定义 Agent
weather_agent = Agent(
    name="WeatherAgent",
    instructions="你是天气助手",
    model="gpt-5",
    tools=[get_weather_tool],
)

# 多 Agent 协作
research_agent = Agent(
    name="Researcher",
    handoffs=[weather_agent],
)

# 跑
result = await Runner.run(research_agent, "上海明天会下雨吗？")
print(result.final_output)
```

<v-click>

**Agent SDK** = 多 Agent 协作 / handoff / 工具集中管理。**Claude Agent SDK** 类似。

</v-click>

---
transition: slide-up
---

# 关键 Take-away

<v-clicks>

1. **GPT 是多模态全栈 + 内置工具最全的 LLM**——图 / 音 / 视频 / 内置 search / RAG / 生图全有
2. **两套 API**：旧 `chat.completions` / 新 `responses`（Agent 必用）
3. **Structured Outputs strict mode** 业界最早，强保证 JSON Schema 匹配
4. **o-series 推理**：`reasoning_effort` 控制 chain-of-thought 深度
5. **Realtime API** GPT 独有（Claude 没有，Gemini 类似）—— < 500ms 首响应
6. **Prompt Cache 自动 50% / Batches 50%**——成本优化首选
7. **Claude / Gemini 各有强项**：编码 + MCP（Claude）/ 超长上下文（Gemini）

</v-clicks>

---
transition: slide-up
---

# 资源链接

<v-clicks>

- 主文档：[platform.openai.com/docs](https://platform.openai.com/docs)
- API Reference：[platform.openai.com/docs/api-reference](https://platform.openai.com/docs/api-reference)
- Cookbook：[github.com/openai/openai-cookbook](https://github.com/openai/openai-cookbook)
- 价格：[platform.openai.com/docs/pricing](https://platform.openai.com/docs/pricing)
- Status：[status.openai.com](https://status.openai.com/)
- Realtime 文档：[platform.openai.com/docs/guides/realtime](https://platform.openai.com/docs/guides/realtime)
- Azure OpenAI：[learn.microsoft.com/azure/ai-services/openai](https://learn.microsoft.com/azure/ai-services/openai/)

</v-clicks>

---
layout: center
class: text-center
---

# 总结

适合：多模态应用 / 语音 Agent / 需要内置工具 / Structured Outputs 严格 JSON

不需要：代码任务为主（Claude 略胜）/ 超长上下文 1M+（Gemini）/ 强 MCP 标准（Claude）

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://platform.openai.com/docs" target="_blank">platform.openai.com/docs</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/openai/openai-cookbook" target="_blank">openai/openai-cookbook</a>
</div>
