---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Gemini
info: |
  Presentation Gemini for AI engineers.

  Learn more at [https://ai.google.dev](https://ai.google.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:google-gemini class="text-7xl" />
</div>

<br/>

## Gemini：Google 旗下多模态 LLM 家族

超长上下文 + 原生视频音频 + Implicit Cache + Google 工具生态

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Gemini —— Google 出品的多模态大语言模型家族。

它是 Claude / GPT 之外的第三极。强在四个地方：超长上下文（2M）、原生视频音频、Implicit Cache 自动 75% 折扣，以及与 Google 工具生态的深度集成。
-->

---
transition: fade-out
---

# 什么是 Gemini？

Google DeepMind 推出的多模态大语言模型家族，与 Claude / GPT 并列三巨头

<v-clicks>

- **超长上下文**：Pro 2M / Flash 1M，整本仓库 + 文档同时塞进去
- **原生视频处理**：直接传 mp4 文件，最长 1 小时（无需抽帧）
- **原生音频处理**：直接传 mp3 / wav，最长 9.5 小时（无需先 Whisper）
- **Implicit Cache**：自动检测重复前缀，无需 cache_control，**75% 折扣**
- **Grounding**：内置 Google Search / Maps / URL Context（独家）
- **Live API**：实时双向音频 + 视频帧，5 种内置 voice
- **Vertex AI 集成**：企业级 SLA + 合规 + 私有 endpoint
- **价格亲民**：Flash $0.075/M 输入，业界最低旗舰价之一

</v-clicks>

<br>

<div v-click text-xs>

_Read more about_ [_Gemini_](https://ai.google.dev/)

</div>

<style>
h1 {
  background-color: #4285F4;
  background-image: linear-gradient(45deg, #4285F4 10%, #EA4335 40%, #FBBC04 70%, #34A853 100%);
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

- **超长上下文 2M / 1M**：业界第一
- **原生多模态**：image + video + audio + pdf 全 native
- **Implicit Cache 自动 75% 折扣** + Explicit Cache 1h+ TTL
- **Google 工具生态**：search / maps / url_context / code_execution 内置
- **Live API 含视频帧**：GPT Realtime 没有
- **Vertex AI 企业版**：合规 / SLA / 私有部署
- **Flash 价格极低**：$0.075/M 输入

</v-clicks>

<br>

**缺点**

<v-clicks>

- API 设计**两套并存**：`@google/generative-ai`（旧，废弃） + `@google/genai`（新）
- 编码略弱于 Claude，Function Calling 略晚成熟
- 中文回复不自然 / 内容审核更严
- 大陆不可直连，需 VPN / 代理 / Vertex

</v-clicks>

---
transition: slide-up
---

# 与 Claude / GPT 三足鼎立

每家强项不同，选型由场景决定

<v-clicks>

**Gemini 强在**

- 超长上下文（2M 业界第一） / 原生视频音频 / Google 工具生态 / Implicit Cache 自动 75% 折扣

**Claude 强在**

- 编码 / Agent / MCP 生态 / Computer Use / 长上下文（1M Opus）

**GPT 强在**

- 多模态全栈 / Realtime API / 内置工具丰富 / Structured Output strict / 中文

</v-clicks>

<v-click>

> **选型口诀**：超长文档 / 视频 / 音频选 Gemini；编码 / Agent 选 Claude；通用多模态选 GPT。

</v-click>

---
transition: slide-up
---

# 主力模型矩阵（2026）

| Model | 上下文 | 输出 | 思考 | 用途 |
|---|---|---|---|---|
| `gemini-2.5-pro` | **2M** | 8K | OK | 旗舰 / 超长上下文 |
| `gemini-2.5-flash` | 1M | 8K | OK | 日常生产 |
| `gemini-2.5-flash-lite` | 1M | 8K | - | 高并发 / 低成本 |
| `gemini-2.5-flash-image` | 1M | 8K | - | 图像生成（Nano Banana） |
| `gemini-live-2.5-flash-preview` | 32K | - | - | Live API 双向实时 |

<v-click>

旧版（仍可用，建议迁移到 2.5）：`gemini-1.5-pro` / `gemini-1.5-flash`（1M 上下文）/ `gemini-1.0-pro`（部分 retired）/ `gemini-pro-vision`（已 retired）

</v-click>

---
transition: slide-up
---

# 价格速查（2026）

| Model | Input $/M | Output $/M | Cache $/M | Storage $/M/h |
|---|---|---|---|---|
| 2.5 Pro (<=200K) | $1.25 | $5 | $0.31 | $1 |
| 2.5 Pro (>200K) | $2.50 | $10 | $0.625 | $1 |
| 2.5 Flash | $0.30 | $1.20 | $0.075 | $0.1875 |
| 2.5 Flash-Lite | $0.075 | $0.30 | $0.019 | - |

<v-click>

**Free Tier 配额**（个人开发，每分钟 / 每天）：

| Model | RPM | RPD | TPM |
|---|---|---|---|
| 2.5 Pro | 5 | 25 | 250K |
| 2.5 Flash | 10 | 250 | 250K |
| 2.5 Flash-Lite | 30 | 1500 | 1M |

</v-click>

---
transition: slide-up
---

# 新 SDK：google-genai 替代 generative-ai

旧 SDK 已 deprecated（2025 末），新项目必须用新 SDK

<v-clicks>

**旧（不要用）**

```bash
pip install google-generativeai      # 已废弃
npm install @google/generative-ai     # 已废弃
```

**新（标准）**

```bash
pip install google-genai              # Python
npm install @google/genai             # TypeScript / Node
go get google.golang.org/genai        # Go
```

两套 API **不完全兼容**，迁移时需调整 import / Client 初始化 / config 字段。

</v-clicks>

---
transition: slide-up
---

# 第一个调用（Python + Node）

```python
# Python
from google import genai

client = genai.Client()  # 自动读 GOOGLE_API_KEY

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="用 Python 写个 quicksort",
)
print(response.text)
print(f"用量: {response.usage_metadata}")
```

```typescript
// Node.js
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const response = await client.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "用 TS 写个 debounce",
});
console.log(response.text);
```

<v-click>

字段名差异：Python 用 snake_case（`system_instruction`），Node 用 camelCase（`systemInstruction`）。

</v-click>

---
transition: slide-up
---

# 接入方式

| 方式 | 鉴权 | Endpoint | 适合 |
|---|---|---|---|
| Google AI Studio | API key | `generativelanguage.googleapis.com` | 个人 / 中小应用 |
| Vertex AI | GCP ADC | `<region>-aiplatform.googleapis.com` | 企业 / GCP 用户 |
| Gemini App | 账号登录 | `gemini.google.com` | 聊天客户端 |
| OpenRouter | API key | 统一代理 | 大陆 / 多模型切换 |

```python
client = genai.Client(api_key="AIzaSy...")                       # AI Studio
client = genai.Client(vertexai=True, project="x", location="y")  # Vertex
```

<v-click>

**调用代码完全相同**——只有 Client 初始化不同。切换无成本。

</v-click>

---
transition: slide-up
---

# 接口结构：contents 顶层数组

```python
# 多 turn 对话
contents=[
    {"role": "user", "parts": [{"text": "你好"}]},
    {"role": "model", "parts": [{"text": "你好！"}]},
    {"role": "user", "parts": [{"text": "现在几点？"}]},
]

# 多模态
contents=[{
    "role": "user",
    "parts": [
        {"text": "这图是什么"},
        {"inline_data": {"mime_type": "image/png", "data": base64_str}},
    ],
}]
```

<v-click>

注意：Gemini role 只有 `user` / `model`（**没有 system**）；GPT / Claude 都用 `user` / `assistant`。System prompt 走单独字段 `system_instruction`。

</v-click>

---
transition: slide-up
---

# 与 Claude / GPT 命名差异

三家命名完全不同，封装层必须分别适配

```text
Claude:
  messages: [{role, content: [{type: "text", text: "..."}, {type: "image", source: {...}}]}]
  顶层 system 字段

GPT:
  messages: [{role, content: [{type: "text", text: "..."}, {type: "image_url", image_url: {url}}]}]
  messages: [{role: "system", content: "..."}]

Gemini:
  contents: [{role, parts: [{text: "..."}, {inline_data: {mime_type, data}}]}]
  config.system_instruction 字段
```

<v-clicks>

- **文本块**：Claude / GPT 用 `{type: "text", text}` / Gemini `{text}` 直接
- **图像块**：Claude `{source: {type: "base64"}}` / GPT `{image_url: {url}}` / Gemini `{inline_data: {mime_type, data}}`
- **role 名**：Claude / GPT 用 `assistant`，Gemini 用 `model`

</v-clicks>

---
transition: slide-up
---

# 超长上下文：业界第一

| 模型 | 上下文窗口 |
|---|---|
| **Gemini 2.5 Pro** | **2M** |
| **Gemini 2.5 Flash** | **1M** |
| Claude Opus[1m] | 1M |
| Claude Sonnet | 200K |
| GPT-5 | 256K |
| GPT-4o | 128K |

<v-click>

**2M 可塞什么**：整本仓库源码（500K+）+ 完整产品文档（200K）+ 历史对话（100K）→ 还有 1.2M 空闲。

实际案例：把整个 Vue 仓库 + Nuxt 文档同时丢进去问跨项目问题，**无需 RAG 切片**。

</v-click>

---
transition: slide-up
---

# 原生视频（Gemini 独家能力）

直接传 mp4——**Claude 没有视频 API，GPT 需手动抽帧**

```python
# 1. 上传文件（避免 base64 太大）
video_file = client.files.upload(file="meeting.mp4")

# 2. 等处理完（视频需要时间）
while video_file.state.name == "PROCESSING":
    time.sleep(5)
    video_file = client.files.get(name=video_file.name)

# 3. 调用
response = client.models.generate_content(
    model="gemini-2.5-pro",
    contents=[video_file, "请总结视频核心内容，列出关键时间戳。"],
)
```

<v-click>

**能力**：单视频最长 **1 小时**（Pro）/ 15 分钟（Flash）；自动抽帧（1 fps）+ 音轨理解；输出含 `[00:34]` 时间戳引用。支持 mp4 / mov / avi / webm / 3gpp 等。

</v-click>

---
transition: slide-up
---

# 视频用途场景

<v-clicks>

- **会议总结**：直接传录像，输出摘要 + 决议 + 时间戳
- **教学视频问答**：传课程视频问知识点位置
- **监控视频分析**：识别异常行为 + 时刻
- **YouTube 内容理解**：用 `file_data.file_uri` 传 YouTube 链接
- **广告 / 产品视频审核**：检测违禁内容
- **视频字幕生成**：自动多语字幕（含时间轴）

</v-clicks>

<v-click>

```python
# YouTube 直接传 URI（部分 region 支持）
contents=[
    {"file_data": {"mime_type": "video/mp4", "file_uri": "https://youtu.be/xxx"}},
    "这视频在讲什么？",
]
```

</v-click>

---
transition: slide-up
---

# 原生音频（一步完成）

直接传 mp3 / wav 分析——**Claude 无音频 API，GPT 需先 Whisper STT**

```python
audio_file = client.files.upload(file="speech.mp3")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[audio_file, "请转录这段录音并指出情绪变化。"],
)
```

<v-clicks>

**能力**：

- 单音频 < **9.5 小时**（业界最长）
- 转录 + 情感分析 + 关键词提取 **一次完成**
- 支持 PCM / MP3 / WAV / AAC / FLAC / OGG / AIFF

**对比 GPT**：Whisper STT → GPT 分析（两步 + 两次 API） vs Gemini **一步**。

</v-clicks>

---
transition: slide-up
---

# 文件 API：上传 + 等待 + 引用

```python
my_file = client.files.upload(file="paper.pdf",
    config={"mime_type": "application/pdf"})

# 视频 / 大 PDF 需等处理完
while my_file.state.name == "PROCESSING":
    time.sleep(5)
    my_file = client.files.get(name=my_file.name)

response = client.models.generate_content(
    model="gemini-2.5-pro",
    contents=[my_file, "总结这份文档"],
)
```

<v-click>

**格式上限**：图 7MB inline / 50MB File；视频 2GB / 1h；音频 9.5h；PDF 50MB / 1000 页；文本 100MB。**保留时长**：48 小时（免费 AI Studio）/ Vertex 可配。

</v-click>

---
transition: slide-up
---

# Implicit Cache：自动 75% 折扣

**默认开启**——无需 `cache_control` 配置，重复前缀自动命中

```python
# 第一次请求
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[LONG_CONTEXT, "问题 1"],
)

# 5 分钟内第二次（前缀相同）
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[LONG_CONTEXT, "问题 2"],
)

print(response.usage_metadata.cached_content_token_count)
```

<v-clicks>

**触发条件**：请求前缀（system + 早期 messages）总 >= 32K（Flash） / 4K（Pro），5 分钟内重复。

**价格**：cached tokens 按 **25% 原价**收费 = **75% 折扣**。

</v-clicks>

---
transition: slide-up
---

# Implicit Cache 与三家对比

| 维度 | Gemini | Claude | GPT |
|---|---|---|---|
| 触发 | **自动** | 手动 `cache_control` | 自动 |
| 折扣 | **75%** | **90%**（更大） | 50% |
| 写入费 | 无 | **25% 额外** | 无 |
| TTL | 5min / 1h+ | 5min ephemeral | 5-15min |
| 最小尺寸 | 32K (Flash) | 1024 tokens | 1024 tokens |

<v-clicks>

**结论**：

- 想躺平省钱 → **Gemini**（自动 + 无写入费）
- 高频复用同一个 prompt → **Claude**（90% 折扣，但有 25% 写入费）
- GPT 50% 折扣 + 自动 → 中规中矩

</v-clicks>

---
transition: slide-up
---

# Explicit Cache：手动 1h+ TTL

适合 RAG / 长文档问答这种**每天用同一上下文**的场景

```python
# 1. 创建 cache
cache = client.caches.create(
    model="gemini-2.5-flash",
    config={
        "contents": [{"role": "user", "parts": [{"text": LONG_DOC}]}],
        "system_instruction": "你是文档助手，简洁回答用户提问。",
        "ttl": "3600s",   # 1 小时（可更长）
    },
)

# 2. 调用时引用 cache name
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="文档里关于退款的部分？",
    config={"cached_content": cache.name},
)
```

<v-click>

**TTL**：默认 1h，最长可设到 days。**价格**：调用读 25% 原价 + 持续存储费 $1/M/h（Pro）/ $0.1875/M/h（Flash）。**经济模型**：> 5 次/天就划算。

</v-click>

---
transition: slide-up
---

# Grounding（独家三件套）

Gemini 内置 Google 工具——**Claude / GPT 都没有 Maps**

```python
# google_search：实时搜索增强
config={"tools": [{"google_search": {}}]}

# url_context：自动 fetch URL 内容
config={"tools": [{"url_context": {}}]}

# google_maps：地图查询
config={"tools": [{"google_maps": {}}]}
```

<v-click>

**对比**：

- Claude：**无 grounding 工具**，需自接 MCP
- GPT：仅 `web_search` 内置，**不含 Maps / 自动 URL fetch**
- Gemini：3 个 Google 工具一齐内置（**独家**）

</v-click>

---
transition: slide-up
---

# google_search 示例 + 引用源

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="2026 年最新的 Python 版本是？",
    config={"tools": [{"google_search": {}}]},
)

# 引用源
metadata = response.candidates[0].grounding_metadata

for chunk in metadata.grounding_chunks:
    print(chunk.web.uri, chunk.web.title)

for support in metadata.grounding_supports:
    seg = support.segment.text
    print(f"段落「{seg}」引用 {support.grounding_chunk_indices}")
```

<v-click>

**返回结构**：`grounding_chunks` 列出搜索来源，`grounding_supports` 标注哪段文本来自哪个 chunk——可在前端高亮 + 链回原文。

</v-click>

---
transition: slide-up
---

# url_context / google_maps 示例

```python
# url_context：自动 fetch + 展开 URL
config={"tools": [{"url_context": {}}]}
contents = "总结这篇文章：https://example.com/article"

# google_maps：地图 POI / 路线 / 地址校验
config={"tools": [{"google_maps": {}}]}
contents = "上海陆家嘴附近评分 4.5 以上的咖啡馆推荐 3 家"
```

<v-clicks>

**url_context 限制**：单次最多约 20 个 URL；过多 / 太大会截断。

**google_maps 能力**：POI 搜索（评分 / 营业时间 / 地址）+ 路线规划（驾车 / 步行 / 公交）+ 地址校验（输入模糊地址 → 标准化）。

**Claude / GPT 都没有 Maps**——这是 Gemini 独家。

</v-clicks>

---
transition: slide-up
---

# Code Execution（沙箱执行）

后台 Python sandbox 自动运行代码

```python
response = client.models.generate_content(
    model="gemini-2.5-pro",
    contents="计算 ln(2) 的连分数前 10 项",
    config={"tools": [{"code_execution": {}}]},
)

# 输出含 code + 执行结果
for part in response.candidates[0].content.parts:
    if part.executable_code:
        print(f"[Code]\n{part.executable_code.code}")
    elif part.code_execution_result:
        print(f"[Output]\n{part.code_execution_result.output}")
```

<v-click>

**对比**：Claude 完全无内置 code 工具（需 MCP） / GPT `code_interpreter`（命名不同能力相当） / Gemini `code_execution`。

</v-click>

---
transition: slide-up
---

# Thinking：thinking_budget 控制

2.5 系列内置推理模式，用 `thinking_budget` 控制思考预算

```python
response = client.models.generate_content(
    model="gemini-2.5-pro",
    contents="证明：对任意正整数 n，n^2 - n 是偶数",
    config={
        "thinking_config": {
            "thinking_budget": 8192,
        },
    },
)

print(f"思考 tokens: {response.usage_metadata.thoughts_token_count}")
```

<v-clicks>

| 值 | 行为 |
|---|---|
| `0` | **禁用思考**（直答模式） |
| `-1` | **无上限**（让模型自己决定） |
| 数字 | 上限（1024 / 8192 / 32768 ...） |

**三家对比**：Claude `thinking.budget_tokens` 数值 / GPT `reasoning_effort` 枚举 / Gemini `thinking_budget` 数值。日常对话用 `0`，数学算法用 `8192+`。

</v-clicks>

---
transition: slide-up
---

# Live API：双向实时（含视频帧）

实时音 / 文 / 视频帧双向流——**GPT Realtime 没有视频帧**

```python
import asyncio
from google import genai

async def live_chat():
    client = genai.Client()
    config = {"response_modalities": ["TEXT"]}

    async with client.aio.live.connect(
        model="gemini-live-2.5-flash-preview",
        config=config,
    ) as session:
        await session.send_client_content(
            turns={"role": "user", "parts": [{"text": "你好！"}]},
        )
        async for response in session.receive():
            if response.text:
                print(response.text, end="")

asyncio.run(live_chat())
```

---
transition: slide-up
---

# Live API 完整配置 + 视频帧

```python
from google.genai import types

config = types.LiveConnectConfig(
    response_modalities=["AUDIO"],
    speech_config=types.SpeechConfig(
        voice_config=types.VoiceConfig(
            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                voice_name="Aoede"
            )
        )
    ),
    system_instruction="你是友好的客服助手",
)

async with client.aio.live.connect(
    model="gemini-live-2.5-flash-preview",
    config=config,
) as session:
    # 实时发视频帧 / 音频块 / 文本
    await session.send_realtime_input(media=video_chunk)
```

<v-click>

**voices**：`Puck` / `Charon` / `Kore` / `Fenrir` / `Aoede`（5 种）。**对比 GPT Realtime**：Gemini Live 独家支持**视频帧输入**，但不支持文+音同时输出（单选 TEXT 或 AUDIO）。

</v-click>

---
transition: slide-up
---

# Structured Output（responseSchema）

直接传 Pydantic / JSON Schema，response 自动遵循

```python
from pydantic import BaseModel

class CodeReview(BaseModel):
    issues: list[str]
    suggestions: list[str]
    score: int

response = client.models.generate_content(
    model="gemini-2.5-pro",
    contents="评审：def divide(a, b): return a / b",
    config={
        "response_mime_type": "application/json",
        "response_schema": CodeReview,
    },
)

review: CodeReview = response.parsed
```

<v-click>

**对比**：GPT 用 `response_format: { json_schema: { strict: true } }`；Claude 通过 Tool Use 模拟；Gemini `responseSchema` 默认严格遵循。

</v-click>

---
transition: slide-up
---

# Function Calling：多层嵌套结构

注意 Gemini 用 `function_declarations` 包一层（GPT / Claude 没有）

```python
weather_function = {
    "name": "get_weather",
    "description": "Get current weather for a city",
    "parameters": {
        "type": "object",
        "properties": {
            "city": {"type": "string"},
            "unit": {"type": "string", "enum": ["c", "f"]},
        },
        "required": ["city"],
    },
}

response = client.models.generate_content(
    model="gemini-2.5-pro",
    contents="上海现在多少度？",
    config={
        "tools": [{"function_declarations": [weather_function]}],
    },
)
```

---
transition: slide-up
---

# Function Calling 三家命名对比

```text
GPT:
  tools: [{
    type: "function",
    function: { name, description, parameters }
  }]

Claude:
  tools: [{
    name, description, input_schema   // 无包装层
  }]

Gemini:
  tools: [{
    function_declarations: [           // 多一层数组
      { name, description, parameters }
    ]
  }]
```

<v-clicks>

**关键差别**：GPT 用 `type: "function"` 区分内置工具与自定义；Claude 直接平铺最简洁；Gemini 用 `function_declarations` 数组——**一次可声明多个**。

</v-clicks>

---
transition: slide-up
---

# Function Calling：tool_config 与处理调用

```python
config={
    "tools": [{"function_declarations": [weather_fn, search_fn]}],
    "tool_config": {
        "function_calling_config": {
            "mode": "AUTO",      # AUTO / ANY / NONE
            "allowed_function_names": ["weather"],
        },
    },
}

# 处理返回的 function call
for part in response.candidates[0].content.parts:
    if part.function_call:
        fn_name = part.function_call.name
        args = part.function_call.args
        result = my_handlers[fn_name](**args)
        # 把结果发回模型继续对话
```

<v-click>

| mode | 行为 |
|---|---|
| `AUTO` | 模型自己决定调不调 |
| `ANY` | **强制必调** |
| `NONE` | 禁止调（即便注册了） |

</v-click>

---
transition: slide-up
---

# Safety Settings：内容审核

Gemini 默认审核**比 GPT / Claude 严**，需主动调阈值

```python
config={
    "safety_settings": [
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_ONLY_HIGH"},
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    ],
}
```

<v-clicks>

**5 类**：harassment / hate_speech / sexually_explicit / dangerous_content / civic_integrity

**5 档**：BLOCK_NONE / BLOCK_ONLY_HIGH / **BLOCK_MEDIUM_AND_ABOVE**（默认）/ BLOCK_LOW_AND_ABOVE / OFF

技术黑客教学 / 中性医疗内容容易被 block，需调到 `BLOCK_ONLY_HIGH` 或 `BLOCK_NONE`。

</v-clicks>

---
transition: slide-up
---

# Streaming + generateContent 完整 config

```python
# 同步流
for chunk in client.models.generate_content_stream(
    model="gemini-2.5-flash",
    contents="写一首关于秋天的诗",
):
    print(chunk.text, end="", flush=True)
```

```typescript
interface GenerationConfig {
  temperature?: number;            // 0-2
  top_p?: number;
  max_output_tokens?: number;
  stop_sequences?: string[];
  response_mime_type?: "text/plain" | "application/json";
  response_schema?: JSONSchema | PydanticModel;
  seed?: number;                   // 确定性
  thinking_config?: { thinking_budget: number };
  cached_content?: string;         // Explicit cache name
}
```

---
transition: slide-up
---

# Vertex AI 与 AI Studio 差异

| 维度 | AI Studio API | Vertex AI |
|---|---|---|
| 鉴权 | API key | GCP ADC（OAuth / SA） |
| Endpoint | `generativelanguage.googleapis.com` | `<region>-aiplatform.googleapis.com` |
| SLA | 无 | Enterprise |
| Region | 全球自动 | 按 region 配 |
| Batches | NO | **OK**（50% 价） |
| 私有 endpoint | NO | OK |
| IAM / 微调 / 审计 | NO | OK |
| 价格 | 标准 | 同标准 |

```python
# Vertex AI 初始化（其他代码不变）
client = genai.Client(vertexai=True, project="my-gcp", location="us-central1")
```

```bash
gcloud auth application-default login    # 无需 API key
```

---
transition: slide-up
---

# 与 Claude / GPT 接口对比（核心）

| 能力 | Gemini | Claude | GPT |
|---|---|---|---|
| 上下文 | **2M Pro / 1M Flash** | 200K / 1M | 128K / 256K |
| 原生视频 | **OK mp4 直传** | NO | NO（需抽帧） |
| 原生音频 | **OK 一步分析** | NO | NO（两步） |
| 内置 Web Search | OK google_search | NO（需 MCP） | OK web_search |
| 内置 Maps | **OK google_maps** | NO | NO |
| Code Execution | OK code_execution | NO（需 MCP） | OK code_interpreter |
| Implicit Cache | **OK 自动 75%** | NO（手动 90%） | OK 自动 50% |
| Live 含视频帧 | **OK** | NO | NO（仅文+音） |
| MCP | 社区 | **官方一类** | 社区 |

<v-click>

**结论**：Gemini 独家 = 原生视频 / Maps / 自动 Cache 75% / Live 视频帧。

</v-click>

---
transition: slide-up
---

# 价格对比

| 模型 | Input $/M | Output $/M |
|---|---|---|
| **Gemini 2.5 Pro** | **$1.25** | $5 |
| Claude Opus | $15 | $75 |
| GPT-5 | $5 | $15 |
| **Gemini 2.5 Flash** | **$0.30** | $1.20 |
| Claude Sonnet | $3 | $15 |
| GPT-4o-mini | $0.15 | $0.60 |

<v-click>

Gemini Pro 旗舰**只要 Opus 的 1/12**；Flash 性价比接近 GPT-4o-mini，但能力（上下文 / 视频音频）远超。

</v-click>

---
transition: slide-up
---

# 选型决策树

```text
你的场景需要哪个？
│
├─ 超长文档 / 视频 / 音频 ──→ Gemini
├─ 编码 / Agent / Computer Use ──→ Claude
├─ Realtime 文+音同时 ──→ GPT
├─ Google 工具集成（Search / Maps）──→ Gemini
├─ MCP 生态 ──→ Claude
├─ 内置工具最全 ──→ GPT
├─ 中文场景 ──→ GPT > Claude > Gemini
└─ 大陆可用 ──→ GPT（API + 阿里云）
```

<v-click>

**多模型策略**：实际生产系统经常**同时挂三家**——用 OpenRouter 统一代理，按任务路由到不同 model。

</v-click>

---
transition: slide-up
---

# 大陆访问

Gemini 在大陆**不可直接访问**

| 方案 | 难度 | 速度 |
|---|---|---|
| 自备代理 / VPN | 低 | 慢 |
| Vertex AI（某些 region） | 中 | 中 |
| OpenRouter 代理 | 低 | 中 |
| 国内 alt（GLM / 通义 / DeepSeek） | 0 | 快 |

```python
# OpenRouter 统一接口（伪 OpenAI 协议）
from openai import OpenAI
client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key="sk-or-xxx")

response = client.chat.completions.create(
    model="google/gemini-2.5-pro",
    messages=[{"role": "user", "content": "hello"}],
)
```

<v-click>

**OpenRouter 限制**：不支持 Gemini 独家能力（视频 / Maps / Live 等），仅文本对话。

</v-click>

---
transition: slide-up
---

# 错误码 + 重试

| HTTP | google.rpc.Code | 含义 |
|---|---|---|
| 400 | INVALID_ARGUMENT | 参数错（model ID / mime / safety） |
| 401 | UNAUTHENTICATED | API key 错 / 过期 |
| 403 | PERMISSION_DENIED | model 无权限 / 配额超 |
| 429 | RESOURCE_EXHAUSTED | 超 RPM / TPM |
| 500 / 503 | INTERNAL / UNAVAILABLE | Google 内部错（重试） |

```python
from google.genai import errors

for attempt in range(3):
    try:
        return client.models.generate_content(**kwargs)
    except errors.APIError as e:
        if e.status_code == 429:
            time.sleep(2 ** attempt)
        elif e.status_code == 400:
            raise
```

---
transition: slide-up
---

# 故障排查 + Rate Limits

| 现象 | 排查 |
|---|---|
| 输出 `finish_reason: SAFETY` | 调低 safety_settings 阈值 |
| 视频 / PDF 超时 | 用 Files API 上传等处理完 |
| Function 不调 | `function_calling_config.mode: "ANY"` |
| 大陆延迟高 | 用 Vertex 或代理 |
| 中文回复不自然 | system_instruction 显式「用流畅中文回答」 |
| Implicit Cache 不命中 | 检查前缀字节相同（空格 / 标点） |

<v-click>

**Tier 配额**（gemini-2.5-flash）：Free 50 RPM / Tier 1 ($250+/月) 1000 RPM / Tier 2 ($1K+) 5000 / Tier 3 ($5K+) 10K。按 region + project 限速。

</v-click>

---
transition: slide-up
---

# 多模态：图像生成（Nano Banana）

`gemini-2.5-flash-image` 内置图像生成（代号 Nano Banana）

```python
response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents="一只在月球上跳舞的橘猫，写实风格",
    config={"response_modalities": ["TEXT", "IMAGE"]},
)

for part in response.candidates[0].content.parts:
    if part.text:
        print(part.text)
    elif part.inline_data:
        with open("output.png", "wb") as f:
            f.write(part.inline_data.data)
```

<v-click>

**价格**：$0.30/M text + **$0.039/image**。比 DALL-E 3 ($0.04/image) 略便宜。

</v-click>

---
transition: slide-up
---

# 跨模型迁移：Claude / GPT → Gemini

```python
# Claude
msg = anthropic.Anthropic().messages.create(
    model="claude-opus-4-7",
    system="你是助手",
    messages=[{"role": "user", "content": "hello"}],
    max_tokens=1024,
)

# 等价 Gemini
response = genai.Client().models.generate_content(
    model="gemini-2.5-pro",
    contents=[{"role": "user", "parts": [{"text": "hello"}]}],
    config={
        "system_instruction": "你是助手",
        "max_output_tokens": 1024,
    },
)
```

<v-clicks>

**核心调整**：`messages` → `contents` / 顶层 `system` → `config.system_instruction` / `content: "..."` → `parts: [{text: "..."}]` / `max_tokens` → `max_output_tokens` / `assistant` → `model`

</v-clicks>

---
transition: slide-up
---

# 旧 SDK → 新 SDK 迁移

```python
# 旧 SDK（已废弃，2025 末后停止维护）
import google.generativeai as genai
genai.configure(api_key="...")
model = genai.GenerativeModel("gemini-1.5-pro")
response = model.generate_content("hello")

# 新 SDK
from google import genai
client = genai.Client(api_key="...")
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="hello",
)
```

<v-clicks>

**关键变更**：

- 模块名：`google.generativeai` → `google.genai`（包名 `google-generativeai` → `google-genai`）
- `genai.configure(...)` → `genai.Client(api_key=...)`
- `genai.GenerativeModel("...")` → `client.models.generate_content(model="...")`
- config 参数名几乎全部 snake_case

</v-clicks>

---
transition: slide-up
---

# 实战：客服 Agent（多工具）

```python
config = {
    "system_instruction": "你是公司客服。引用文档 + 调订单 API + 联网搜资料。",
    "tools": [
        {"google_search": {}},
        {"url_context": {}},
        {"function_declarations": [{
            "name": "get_order",
            "description": "查询订单",
            "parameters": {
                "type": "object",
                "properties": {"order_id": {"type": "string"}},
                "required": ["order_id"],
            },
        }]},
    ],
    "cached_content": faq_cache.name,
}

response = client.models.generate_content(
    model="gemini-2.5-pro",
    contents="订单 12345 啥时候到？",
    config=config,
)
```

---
transition: slide-up
---

# 性能调优清单

<v-clicks>

- **首选 Flash**：除非旗舰场景，否则 Flash 性价比远超 Pro
- **Implicit Cache 命中**：长 prompt + 频繁调用，前缀稳定才能命中
- **Explicit Cache for RAG**：固定文档 + 24h+ TTL
- **Files API 复用**：同文件多次问，传一次复用多次
- **thinking_budget = 0**：日常对话直答省 tokens
- **响应 schema 严格**：避免 model 返回多余字段
- **Streaming 用户体验**：长输出走 stream
- **Vertex Batches**：离线批处理享 50% 价

</v-clicks>

---
transition: slide-up
---

# 监控 / 调试 / 合规

<v-clicks>

**调试**：`count_tokens` 预估 quota / `safety_ratings` 全打印查 block 类别 / 用 AI Studio Playground 调通 prompt 后复制 / dry-run 用 Flash-Lite

**监控**：AI Studio 自带 dashboard；Vertex AI 自动接 Cloud Logging + Monitoring。`usage_metadata` 含 input / cached / output tokens 可插 Prometheus。

**合规（Vertex）**：

- **数据驻留**：选 region 可控数据落地（EU / US / Asia）
- **VPC-SC**：Vertex 支持 VPC Service Controls 隔离
- **CMEK**：Customer-Managed Encryption Keys
- **日志审计**：内置 Cloud Audit Logs
- **不参与训练**：Vertex / paid AI Studio 数据**不用于训练**（免费 Tier 可能用，详 ToS）

</v-clicks>

---
transition: slide-up
---

# 版本里程碑 + 资源

| 模型 | 时间 | 主要变化 |
|---|---|---|
| Gemini 1.0 | 2023 末 | 首发（Bard 改名） |
| Gemini 1.5 | 2024 中 | **1M 上下文**（业界首） |
| Gemini 2.0 | 2024 末 | 全多模态 + Live API |
| Gemini 2.5 | 2025 | **Thinking + Pro 2M + Implicit Cache** |
| Gemini Live 2.5 | 2026 | 视频帧 + 多 voice |

<v-clicks>

**资源**：

- 官方 Cookbook：`github.com/google-gemini/cookbook`
- AI Studio Playground：`aistudio.google.com`
- API Reference：`ai.google.dev/api`
- Vertex AI 文档：`cloud.google.com/vertex-ai/docs`

</v-clicks>

---
layout: center
class: text-center
---

# 总结：Gemini 差异化定位

**Gemini = 多模态长上下文专家**

超长上下文 2M / 原生视频音频 / Implicit Cache 自动 75% / Google 工具生态 / Live 视频帧

适合：超长文档 / 视频音频 / 大规模 RAG / Google 生态

少做：纯编码 / MCP 重度依赖 / 中文创作密集

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://ai.google.dev/" target="_blank">ai.google.dev</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/google-gemini/cookbook" target="_blank">google-gemini/cookbook</a>
</div>
