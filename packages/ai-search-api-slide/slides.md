---
theme: seriph
background: https://cover.sli.dev
title: AI 搜索 API 指南
info: |
  AI 搜索 API 指南：Tavily · Exa · Serper · Brave Search · SearXNG

  Learn more at [Tavily](https://docs.tavily.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## AI 搜索 API

为 LLM / RAG / Agent 设计的搜索接口

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
把关键词搜索升级为语义理解 + 答案生成 + 干净内容。
-->

---
transition: fade-out
---

# AI 搜索 API 是什么

为 LLM / RAG / Agent 设计的搜索接口，给 AI 应用联网能力

- **结构化输出**：JSON 而非 HTML，省去爬虫解析
- **LLM 答案摘要**：Tavily 直接返回 `answer` 字段
- **语义搜索**：Exa neural search 用向量匹配
- **干净无广告**：去掉 SERP 中的广告 / 追踪参数
- **专为 RAG 设计**：`chunks_per_source` / `contents.text`

> 关键差异：结构化 JSON + 自带答案 + 语义查询 + 按 token 计费

<!--
为 AI 应用提供联网能力，避免知识截止、降低幻觉。
-->

---

# 四类主流方案

- **AI 原生搜索**：Tavily（带 LLM 答案）/ Exa（神经语义）
- **SERP 抓取**：Serper / SerpAPI（返回 Google 结果 JSON）
- **独立索引**：Brave Search（自有 Web 索引，非 Google 代理）
- **元搜索 / 自托管**：SearXNG（聚合多引擎，开源自部署）

| 类型 | 代表 | 特点 |
|------|------|------|
| AI 原生 | Tavily / Exa | 带答案 / 语义 |
| SERP | Serper / SerpAPI | Google 结果 JSON |
| 独立索引 | Brave | 不依赖 Google |
| 自托管 | SearXNG | 开源免费 |

> 大陆 / 隐私场景用 SearXNG 自部署，无 API key 限制

<!--
四类方案按「要答案/要SERP/要独立/要自部署」选。
-->

---
layout: two-cols
---

# Tavily（带答案）

```python
from tavily import TavilyClient
tavily = TavilyClient(api_key="tvly-xxx")

response = tavily.search(
    query="Vercel AI SDK v7 主要变化",
    search_depth="advanced",
    include_answer=True, max_results=5)

print(response["answer"])  # LLM 答案
for r in response["results"]:
    print(r["title"], r["url"])
```

basic = 1 credit，advanced = 2 credit

::right::

# 关键参数

| 参数 | 含义 |
|------|------|
| `search_depth` | basic/advanced |
| `include_answer` | 返回 LLM 答案 |
| `max_results` | 0-20 |
| `topic` | general/news |
| `chunks_per_source` | advanced 片段数 |

basic：每 URL 1 摘要，快

advanced：多片段，质量高

> RAG 用 advanced + `chunks_per_source=3`

<!--
Tavily 自带 LLM 答案，是 RAG 联网首选。
-->

---
layout: two-cols
---

# Exa（语义搜索）

```python
from exa_py import Exa
exa = Exa(api_key="exa-xxx")

response = exa.search_and_contents(
    "how to build RAG with TS",
    num_results=5, type="neural",  # 神经搜索
    text=True, highlights=True)

for r in response.results:
    print(r.title, r.url)
```

::right::

# search type

| type | 含义 |
|------|------|
| `auto` | 默认平衡 |
| `neural` | 向量语义匹配 |
| `keyword` | 传统关键词 |
| `fast` | 高质量低延迟 |
| `deep` | 多步综合研究 |

neural：query 编码成向量比对

关键词不命中也能找到

> `use_autoprompt=true` 提升神经检索质量

<!--
Exa neural 适合「不知道确切词」的语义检索。
-->

---

# Serper（Google SERP）

```bash
curl -X POST https://google.serper.dev/search \
  -H "X-API-KEY: serper-xxx" \
  -d '{"q": "Vercel AI SDK", "num": 10, "gl": "us"}'
```

返回 `organic` 数组 + `knowledgeGraph` + `peopleAlsoAsk`

**Serper vs SerpAPI**

| 维度 | Serper | SerpAPI |
|------|------|------|
| 风格 | POST + JSON | GET + query |
| 引擎 / 价格 | 仅 Google / $0.30/1k | 多引擎 / $50/月起 |
| 适合 | 极致便宜 | 多引擎 + dashboard |

> 要原始 Google SERP 选 Serper，要可视化选 SerpAPI

<!--
Serper 最便宜最快，适合要原始 SERP 的场景。
-->

---

# SearXNG（自部署）

```yaml
# docker-compose.yml
services:
  searxng:
    image: searxng/searxng:latest
    ports: ["8080:8080"]
    volumes:
      - ./searxng:/etc/searxng
    environment:
      - SEARXNG_BASE_URL=http://localhost:8080/
```

开启 JSON API：`settings.yml` 的 `search.formats` 加 `json`

```bash
curl 'http://localhost:8080/search?q=Vercel+AI+SDK&format=json&engines=google,bing,duckduckgo'
```

**优势**：开源免费、无 API key 无配额、聚合 70+ 引擎、大陆可达、隐私友好

> 上游引擎反爬时该源失败，需定期更新 + 加 limiter

<!--
SearXNG 自部署，大陆/隐私/免费场景首选。
-->

---

# 与传统搜索对比

| 维度 | 传统 Google/Bing | AI 搜索 API |
|------|------|------|
| **输出** | HTML 页面 | 结构化 JSON |
| **答案** | SERP 摘要 | LLM 生成（Tavily） |
| **语义** | 关键词 | 神经匹配（Exa） |
| **集成** | 需爬虫解析 | SDK 直接用 |
| **新鲜度** | 实时 | 缓存层（几小时延迟） |

> AI 搜索 API 已成 RAG / Agent 标配，Tavily / Exa 与 LangChain 深度集成

<!--
AI 搜索 API 输出干净、自带答案，集成成本低。
-->

---

# 选型决策树

```text
需求？
├ 要 LLM 答案摘要？      → Tavily
├ 要语义搜索？           → Exa（neural）
├ 要原始 Google SERP？   → Serper（便宜）/ SerpAPI
├ 不依赖 Google？        → Brave Search
├ 大陆/隐私/自部署/免费？→ SearXNG
└ 学术/长文综合？        → Exa（deep）/ Tavily（advanced）
```

**Agent 多步搜索**：把 search 包成 tool，每步结果回填 LLM

**性能三板斧**：Redis 缓存（key = query hash）+ 并发 Semaphore + 选对 `search_depth`

> Chat 实时用 basic/fast；RAG 索引用 advanced

<!--
按需求选型，缓存+并发+depth 是性能关键。
-->

---

# 价格速查（2026）

| 服务 | 价格 | 免费 tier |
|------|------|------|
| **Tavily** | basic 1 / advanced 2 credit | 1000 credits/月 |
| **Serper** | $0.30/1k queries | 2500 次 |
| **Brave** | $0.003/查询起 | 2000 次/月 |
| **SearXNG** | 免费（自部署） | 无限 |
| **Exa** | 按 token + 请求数 | 1000 searches/月 |

> 成本爆炸时：加缓存 + 仅对热门 query 调用付费 API

<!--
SearXNG 免费，Serper 最便宜的付费方案。
-->

---
layout: quote
---

# AI 搜索 API 核心价值

「结构化 JSON + LLM 答案摘要 + 语义匹配——给 AI 应用装上联网的眼睛，让 RAG / Agent 告别知识截止。」

---
layout: center
class: text-center
---

# 小结

AI 搜索 API = 结构化输出 + 答案生成 + 语义检索

**Tavily · Exa · Serper · Brave · SearXNG**

[Tavily](https://docs.tavily.com) · [SearXNG](https://github.com/searxng/searxng)

<!--
AI 搜索 API 是 RAG / Agent 的联网标配。
-->
