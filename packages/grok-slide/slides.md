---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Grok
info: |
  Presentation Grok for AI engineers.

  Learn more at [https://x.ai](https://x.ai)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <simple-icons:x class="text-7xl" />
</div>

<br/>

## Grok：xAI 推出的实时搜索 + 多智能体 LLM

OpenAI SDK 兼容 + X 平台独家数据 + Heavy 多智能体 + Imagine 多模态

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Grok —— xAI 出品的大语言模型家族。

它是 LLM 第四极。强在四个地方：实时搜索（X + Web 双源）、多智能体 Heavy 架构、Imagine 图像视频生成、与 OpenAI SDK 零迁移兼容。
-->

---
transition: fade-out
---

# 什么是 Grok？

xAI 推出的大语言模型家族，与 Claude / GPT / Gemini 并列

<v-clicks>

- **OpenAI SDK 完全兼容**：仅改 `base_url=https://api.x.ai/v1`，现有代码全可复用
- **实时搜索原生集成**：Chat 内置 `search_parameters`，同时搜 Web + X 平台
- **X 平台独家数据源**：抓 verified 用户推文 / thread / 用户时间线
- **多智能体 Heavy 架构**：`grok-4.20-multi-agent-0309` 原生多 agent 并行推理
- **Imagine 图像 / 视频生成**：一站式多模态
- **风格不羁**：训练保留 rebellious streak，更少 guardrail
- **Prompt 缓存省钱**：cached input 仅 $0.30 vs $2.00，省 85%

</v-clicks>

<br>

<div v-click text-xs>

_Read more about_ [_xAI_](https://x.ai/)

</div>

<style>
h1 {
  background-color: #1D9BF0;
  background-image: linear-gradient(45deg, #1D9BF0 10%, #6BC9F0 50%, #FFD700 100%);
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

- **OpenAI SDK 零迁移**：复用现有 openai 库，base_url 一行切换
- **实时搜索原生**：`search_parameters` mode/sources/citations，无需自建 RAG
- **X 独家数据源**：4 种搜索（keyword/semantic/user/thread）
- **多智能体 Heavy**：原生多 agent 思考-辩论-共识
- **GPQA Diamond 88%**：优于 Gemini 2.5 Pro（84%）
- **成本透明**：`cost_in_usd_ticks` + `num_sources_used`

</v-clicks>

<br>

**缺点**

<v-clicks>

- 风格不可控，业务需用 system prompt 强约束
- Fun Mode 已于 2024-12 移除
- X 数据真实性需 `return_citations` + 人工核查
- 大陆不可直连，需 OpenRouter / 代理
- 部分参数不支持（logprobs/logit_bias）

</v-clicks>

---
transition: slide-up
---

# 与 Claude / GPT / Gemini 四极格局

每家强项不同，选型由场景决定

<v-clicks>

**Grok 强在**

- 实时搜索（X + Web 双源原生）/ 多智能体 Heavy / OpenAI SDK 兼容

**Claude 强在**

- 编码 / Agent / MCP 生态 / Computer Use

**GPT 强在**

- 多模态全栈 / Realtime API / Structured Output strict / 中文

**Gemini 强在**

- 超长上下文（2M）/ 原生视频音频 / Implicit Cache 自动 75%

</v-clicks>

<v-click>

> **选型口诀**：实时 X 舆情 / 多智能体选 Grok；编码 / Agent 选 Claude；通用多模态选 GPT；超长文档选 Gemini。

</v-click>

---
transition: slide-up
---

# 主力模型矩阵（2026-07）

| Model | 上下文 | 输出 | 用途 |
|---|---|---|---|
| `grok-4.5` | **500K** | 128K | 旗舰 / coding / agentic |
| `grok-4.3` | **1M** | 128K | 长上下文成本敏感 |
| `grok-4.20-0309-reasoning` | 1M | 128K | 推理专用 |
| `grok-4.20-0309-non-reasoning` | 1M | 128K | 高并发快速响应 |
| `grok-build-0.1` | 256K | 128K | 编码专用（Grok Build CLI） |
| `grok-4.20-multi-agent-0309` | 1M | 128K | 多智能体 Heavy |
| `grok-imagine-image(-quality)` | - | - | 图像生成 |
| `grok-imagine-video(-1.5)` | - | - | 视频生成 |

<v-click>

别名规则：`<name>`（最新稳定）/ `<name>-latest`（含最新功能）/ `<name>-<date>`（**生产环境锁版本**）

</v-click>

---
transition: slide-up
---

# 价格速查（2026）

| Model | Input $/M | Output $/M | Cache $/M |
|---|---|---|---|
| grok-4.5 (≤200K) | $2 | $6 | $0.30 |
| grok-4.5 (>200K) | $4 | $12 | $0.30 |
| grok-4.3 (≤200K) | $1.25 | $2.5 | - |
| grok-4.3 (>200K) | $2.5 | $5 | - |
| grok-build-0.1 | $1 | $2 | - |

<v-click>

**长上下文阶梯翻倍**：prompt ≥200K 时全量 token 按 2x 计费——grok-4.5 从 $2/$6 跳到 $4/$12，长文档场景优先选 grok-4.3（1M 窗口 + 单价更低）。

</v-click>

<v-click>

**工具计费（每千次）**：`x_search` / `web_search` / `code_execution` = $5；`attachment_search` = $10；`collections_search` = $2.5；Imagine image $0.02-0.05/张、video $0.05-0.08/sec

</v-click>

---
transition: slide-up
---

# OpenAI SDK 零迁移兼容

复用现有 openai 库代码，只改 `base_url` 与 `api_key`

```ts
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.x.ai/v1",       // 一行切换
  apiKey: "xai-xxxxx",
});

const response = await client.chat.completions.create({
  model: "grok-4.5",
  messages: [
    { role: "system", content: "你是资深工程师，用流畅中文回答。" },
    { role: "user", content: "用 TS 写个 debounce" },
  ],
});
console.log(response.choices[0].message.content);
```

<v-click>

也兼容 Vercel AI SDK（`@ai-sdk/xai`）/ LangChain / Cloudflare AI Gateway。**零迁移成本跨厂商 A/B 对比**。

</v-click>

---
transition: slide-up
---

# 实时搜索：Grok 独占卖点

Chat Completions 内置 `search_parameters`，让模型原生接入实时 Web + X

```ts
const response = await client.chat.completions.create({
  model: "grok-4.5",
  messages: [{ role: "user", content: "xAI 最新发布了什么？" }],
  // @ts-expect-error - xAI 独占字段
  search_parameters: {
    mode: "auto",                  // off / on / auto
    sources: ["web", "x"],         // 同时搜 Web + X
    max_search_results: 10,
    from_date: "2026-06-01",       // ISO-8601 时间窗
    return_citations: true,        // 返回引用列表
  },
} as any);
for (const cite of response.citations ?? []) {
  console.log(cite.url, cite.source);   // source: web | x
}
```

<v-click>

**mode 选取**：强时效用 `on` / 通用对话用 `auto` 省成本 / 纯知识用 `off`。⚠️ 知识 cutoff = 2026-02-01，实时事件必须开搜索。

</v-click>

---
transition: slide-up
---

# X Search vs Web Search 工具

::right::

<br>

**X Search（独占）**

```json
{
  "type": "x_search",
  "query_type": "semantic",
  "allowed_x_handles": ["elonmusk", "xai"],
  "enable_video_understanding": true,
  "from_date": "2026-06-01"
}
```

- 4 种搜索：keyword / semantic / user / thread
- `allowed_x_handles` 与 `excluded_x_handles` **互斥**，各 ≤20 个
- 收窄权威账号降低谣言风险

<br>

**Web Search**

```json
{
  "type": "web_search",
  "allowed_domains": ["x.ai", "docs.x.ai"],
  "enable_image_understanding": true,
  "enable_image_search": true
}
```

- `allowed_domains` 与 `excluded_domains` **互斥**，各 ≤5 个
- `enable_image_understanding` 自动延伸到同请求 X Search

---
transition: slide-up
---

# Function Calling（OpenAI 兼容）

```ts
const tools = [{
  type: "function" as const,
  function: {
    name: "get_order",
    description: "查询订单状态",
    parameters: {
      type: "object",
      properties: { order_id: { type: "string" } },
      required: ["order_id"],
    },
  },
}];

const response = await client.chat.completions.create({
  model: "grok-4.5",
  messages: [{ role: "user", content: "订单 12345 啥时候到？" }],
  tools,                          // 最多 128 个函数
  tool_choice: "auto",
  parallel_tool_calls: true,
});
```

<v-click>

**Structured Outputs**：`response_format: {type: "json_schema", json_schema: {strict: true, schema: {...}}}` 强制 JSON Schema。

</v-click>

---
transition: slide-up
---

# 异步 + Prompt Cache 省钱组合拳

**异步 deferred 模式（长任务）**

```bash
curl -X POST https://api.x.ai/v1/chat/completions \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{"model":"grok-4.5","messages":[...],"deferred":true}'
# → 返回 request_id，GET /v1/chat/deferred-completion/{id} 轮询
```

<br>

**Prompt Cache 粘性路由**

```ts
const response = await client.chat.completions.create({
  model: "grok-4.5",
  messages: [
    { role: "system", content: VERY_LONG_PROMPT },   // 固定不变
    { role: "user", content: "今天的问题" },
  ],
  // @ts-expect-error - xAI 独占字段
  prompt_cache_key: "my-app-prod-001",   // 粘性路由稳定命中
} as any);
// cached_tokens 命中数 → 省 85%
```

<v-click>

**Batch API**：grok-4.3 / 4.20-* 系列享 20% 折扣（grok-4.5 **不享**）。

</v-click>

---
transition: slide-up
---

# Imagine 图像 / 视频生成

一站式多模态——同一 xAI API Key 即可调用

```bash
# 图像
curl https://api.x.ai/v1/images/generations \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{"model":"grok-imagine-image-quality",
       "prompt":"赛博朋克风格的杭州西湖夜景",
       "n":1,"size":"1024x1024"}'

# 视频（POST /v1/video/generations）
# model: grok-imagine-video / grok-imagine-video-1.5
```

| Model | 单价 |
|---|---|
| `grok-imagine-image` | $0.02 / 张 |
| `grok-imagine-image-quality` | $0.05 / 张 |
| `grok-imagine-video` | $0.05 / sec |
| `grok-imagine-video-1.5` | $0.08 / sec |

<v-click>

**Voice API**：Realtime $0.05/min / TTS $15/1M 字符 / STT $0.10-0.20/hr

</v-click>

---
transition: slide-up
---

# 多智能体 Heavy 架构

`grok-4.20-multi-agent-0309` 原生多 agent 并行推理

<v-clicks>

- **思考-辩论-共识**：内部 4 个 agent 并行思考、互相辩论、达成共识后输出
- **效果优于手工 orchestrate**：xAI 训练阶段已优化 agent 协作
- **1M 上下文 + 128K 输出**：复杂深度研究场景

</v-clicks>

<br>

```ts
const response = await client.chat.completions.create({
  model: "grok-4.20-multi-agent-0309",
  messages: [{ role: "user", content: "深度分析：2026 年大模型格局" }],
  // @ts-expect-error - xAI 独占字段
  reasoning_effort: "high",
} as any);
```

<v-click>

> **适合**：深度研究 / 多视角辩论 / 复杂推理。**避免**自行用 grok-4.5 + orchestrate 框架拼装，原生 multi-agent 效果更好。

</v-click>

---
transition: slide-up
---

# 性能调优清单

<v-clicks>

- **生产锁 `<name>-<date>`**：避免别名随官方升级回归
- **长 prompt 设 `prompt_cache_key`**：cached input 省 85%
- **超长上下文选 grok-4.3**：1M 窗口 + 单价更低
- **强时效显式 `mode="on"` + 时间窗**：避免被旧网页带偏
- **X Search 收窄 `allowed_x_handles`**：≤20 个权威账号降低谣言
- **Web Search 开 `enable_image_understanding`**：自动延伸到 X Search
- **异步长任务用 `deferred=true`**：避免长连接超时
- **离线批用 Batch API**：grok-4.3 / 4.20-* 系列再省 20%
- **多智能体用原生 multi-agent**：优于手工拼装

</v-clicks>

<v-click>

::: warning 参数黑名单

- grok-4.20+ 不支持 `logprobs` / `top_logprobs`
- 全系不支持 `logit_bias`
- 推理模型不支持 `frequency_penalty` / `presence_penalty` / `stop`
- `max_tokens` 已弃用，改用 `max_completion_tokens`（默认 128K）

:::

</v-click>

---
transition: slide-up
---

# 版本里程碑

| 模型 | 时间 | 主要变化 |
|---|---|---|
| Grok-1 | 2023-11 | 首发，314B MoE，2024-03 开源 |
| Grok-1.5 | 2024-05 | 128K 上下文 |
| Grok-2 | 2024-08 | 130K + Flux 图像生成 |
| Grok-3 | 2025-02 | **1M 上下文** + Think 推理 |
| Grok-4 / 4 Heavy | 2025-07 | **多智能体并行** / native tool use |
| Grok-4.3 / 4.5 | 2026 | 旗舰升级 / coding / agentic 主打 |

<v-click>

**资源**：Docs `docs.x.ai` / Console `console.x.ai` / Playground SuperGrok / Pricing `docs.x.ai/developers/pricing`

</v-click>

---
layout: center
class: text-center
---

# 总结：Grok 差异化定位

**Grok = 实时搜索 + 多智能体专家**

OpenAI SDK 兼容 / X 平台独家数据 / Heavy 多智能体 / Imagine 多模态 / 不羁风格

适合：实时舆情 / 多视角分析 / X 数据应用 / 跨厂商 A/B 对比

少做：纯编码极致（Claude 更强）/ 严肃业务无 system prompt 约束

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://docs.x.ai/" target="_blank">docs.x.ai</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://x.ai/" target="_blank">x.ai</a>
</div>
