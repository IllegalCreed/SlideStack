---
theme: seriph
background: https://cover.sli.dev
title: Perplexity API 指南
info: |
  Perplexity API 指南：sonar 系列 · 联网生成 · 引用机制 · Agent API · 流式

  Learn more at [docs.perplexity.ai](https://docs.perplexity.ai)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Perplexity API

在线检索 + 生成的 Answer Engine API

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
一次调用完成联网搜索 + 阅读源材料 + 引用生成答案。
-->

---
transition: fade-out
---

# Perplexity API 是什么

通过 `sonar` 系列模型，一次调用完成「联网搜索 + 引用生成答案」

- **真联网**：每次回答基于实时网页，几乎无知识截止
- **自带引用**：`search_results` 数组列出每个来源 URL + 标题 + 日期
- **OpenAI 兼容**：Sonar Chat 改 base URL 即可接入现有代码
- **多档模型**：从轻量 sonar 到深度 research，按复杂度选
- **流式**：内容 chunk + 引用 + usage 渐进返回

> 区别于纯 LLM（GPT-5），sonar 每次回答都基于实时网页

<!--
Perplexity 是端到端的答案引擎，搜索+生成一体。
-->

---

# 四档模型 + 四类 API

**模型矩阵**

| 模型 | 用途 |
|------|------|
| `sonar` | 轻量搜索，快速事实 |
| `sonar-pro` | 复杂查询 + 多步 follow-up |
| `sonar-reasoning-pro` | 精确推理（CoT） |
| `sonar-deep-research` | 专家级深度研究报告 |

**API 形态**：Sonar Chat（`/v1/sonar`，最常用）/ Agent API（`/v1/agent`，新方向）/ Search API（纯检索）/ Embeddings

> 官方未把 Sonar Chat 正式 deprecated，提供迁移路径而非强制下线

<!--
四档模型按复杂度选，四类 API 按集成方式选。
-->

---
layout: two-cols
---

# 第一次调用

```python
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["PERPLEXITY_API_KEY"],
    base_url="https://api.perplexity.ai/v1")

response = client.chat.completions.create(
    model="sonar-pro",
    messages=[{"role": "user", "content": "v7 有哪些变化？"}])

print(response.choices[0].message.content)
print(response.search_results)  # 引用列表
```

::right::

# 响应结构（简化）

```json
{
  "choices": [{"message": {
    "content": "v7 主要变化..."}}],
  "search_results": [
    {"title": "AI SDK v7 Migration",
     "url": "https://ai-sdk.dev/...",
     "date": "2026-01-15"}],
  "usage": {"prompt_tokens": 24,
   "cost": {"total_cost": 0.011}}
}
```

> 用 `search_results`，旧 `citations` 已 deprecated

<!--
OpenAI SDK 兼容，改 base_url 即可。
-->

---

# 引用机制

```json
// 旧（deprecated）
"citations": ["https://a.com"]

// 新（推荐）
"search_results": [
  {"title": "...", "url": "https://a.com",
   "date": "2026-01-15"}
]
```

`search_results` 提供 title / date，文档明确建议替代 `citations`

**渲染引用**：在答案末尾附 Sources 列表，按 `search_results` 顺序编号

**内联引用**：system prompt 要求模型用 `[n]` 标记，后处理替换成超链接

> 别依赖 JSON 模式返回 URL——文档警告「may not always work reliably」

<!--
引用从 search_results 取，别依赖 JSON 模式。
-->

---

# 关键参数

| 参数 | 取值 | 含义 |
|------|------|------|
| `search_recency_filter` | hour/day/week/month/year | 时间过滤 |
| `search_domain_filter` | 域名数组 | 限定/排除域名 |
| `search_context_size` | low/medium/high | 搜索深度（影响成本） |
| `reasoning_effort` | low/medium/high | 推理强度 |
| `search_mode` | `academic` | 限定学术源 |

新闻场景必用 `search_recency_filter=week`；学术用 `search_mode=academic` + domain_filter

> `search_context_size` 是成本核心：low 最便宜，high 最贵最全

<!--
recency/domain/context_size 是三大调参旋钮。
-->

---
layout: two-cols
---

# 流式响应

```python
stream = client.chat.completions.create(
    model="sonar-pro",
    messages=[{"role": "user", "content": "..."}],
    stream=True,
)

for chunk in stream:
    delta = chunk.choices[0].delta
    if delta.content:
        print(delta.content, end="", flush=True)
```

::right::

# 引用在最后 chunk

```python
full_text = ""
search_results = []

for chunk in stream:
    delta = chunk.choices[0].delta
    if delta.content:
        full_text += delta.content
    # 最后 chunk 才有 search_results
    if hasattr(chunk, "search_results"):
        search_results = chunk.search_results
```

**重要**：搜索结果与 metadata 在**最后 chunk** 才返回

需等流结束才能拿到完整引用

> 流式中途拿不到引用，要等结束

<!--
流式内容渐进，但引用要等最后 chunk。
-->

---

# Agent API（新方向）

```bash
curl https://api.perplexity.ai/v1/agent \
  -H "Authorization: Bearer $PERPLEXITY_API_KEY" \
  -d '{
    "model": "sonar-pro",
    "messages": [{"role": "user", "content": "..."}],
    "tools": [{"type": "function", "function": {...}}],
    "file_url": "https://example.com/doc.pdf"
  }'
```

Agent API 相比 Sonar Chat 多：

- **原生 tool / function calling**（Sonar Chat 不支持）
- **多模态附件**（`file_url` 文档 / 图像）
- **异步任务**（`POST /v1/async/sonar`，适合 deep-research）
- `web_search_options` 更细粒度

> 新项目建议直接上 Agent API；`/v1/responses` 是 OpenAI 兼容别名

<!--
Agent API 是主推方向，支持工具与多模态。
-->

---

# 成本控制

| 场景 | 模型 | 单次预估 |
|------|------|------|
| 简单事实 | sonar (low) | ~$0.001 |
| 一般查询 | sonar-pro (medium) | ~$0.01 |
| 复杂研究 | sonar-deep-research | ~$0.05-0.5 |

**降级策略**：简单事实用 sonar + low context；需推理才上 reasoning-pro

**缓存**：Redis 缓存（key = query hash，TTL 1 小时）

> per-request 费按 context_size 分档（$5-$14/1k 请求），不只看 token 单价

<!--
成本不只看 token，per-request 费是大头。
-->

---

# 常见陷阱

| 陷阱 | 解决 |
|------|------|
| `citations` 为空 | 改用 `search_results` |
| JSON 模式 URL 不可靠 | 用 search_results，别依赖 JSON |
| 流式拿不到引用 | 引用在最后 chunk，等流结束 |
| Sonar Chat 无 tool calling | 用 Agent API `/v1/agent` |
| 成本爆炸 / 引用过时 | 降 context_size + 缓存 / 加 recency_filter |

**与 Tavily 区别**：Perplexity 端到端（搜索+生成+引用一体）；Tavily 是纯搜索（含可选 answer），适合要原始结果做 RAG。

> Perplexity API 不是 Chat 产品的简单包装，是面向开发者的独立产品线

<!--
API 与 Chat 产品定位不同，参数更细、模型更多。
-->

---
layout: quote
---

# Perplexity API 核心价值

「一次调用完成联网搜索 + 引用生成——sonar 系列按复杂度分档，OpenAI 兼容接入，自带 search_results 引用列表。」

---
layout: center
class: text-center
---

# 小结

Perplexity API = 联网搜索 + 引用生成 + OpenAI 兼容

**sonar 系列 · search_results · Agent API · 流式**

[docs.perplexity.ai](https://docs.perplexity.ai) · [GitHub](https://github.com/perplexity-ai)

<!--
Perplexity 是端到端答案引擎，真联网 + 自带引用。
-->
