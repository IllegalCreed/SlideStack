---
theme: seriph
background: https://cover.sli.dev
title: GEO 完全指南
info: |
  GEO（Generative Engine Optimization）完全指南：生成式引擎优化 · llms.txt · Princeton 研究 · AI 搜索引擎

  Learn more at https://llmstxt.org/ and https://arxiv.org/abs/2311.09735
drawings:
  persist: false
transition: slide-left
mdc: true
---

# GEO 完全指南

生成式引擎优化 · 让内容被 AI 搜索引擎引用

<div class="text-xl opacity-80 mt-4">
Princeton 研究 · llms.txt · ChatGPT / Perplexity / Gemini / Claude
</div>

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
GEO 由 Princeton 团队 2023 年提出，目标是让内容被 ChatGPT/Perplexity/Gemini 等生成式引擎引用。
-->

---
transition: fade-out
---

# 什么是 GEO

**Generative Engine Optimization（生成式引擎优化）**

- **目标**：让内容被 AI 搜索引擎**引用**（非排名点击）
- **提出**：Princeton 团队 2023 年论文（arXiv 2311.09735，KDD 2024）
- **服务对象**：ChatGPT 搜索 / Perplexity / Gemini / Google AI Overviews / Claude
- **底层机制**：RAG / grounding 检索网页 → 生成回答 → 内联引用来源
- **可见度模型**：富文本内联引用（位置 / 长度 / 风格多维），非「平均排名」

> GEO ≠ SEO 替代品——Google 官方明确「GEO/AEO 仍是 SEO」。

<!--
核心差异：从「排名列表」转向「富文本内联引用」。
-->

---

# GEO vs 传统 SEO

| 维度 | 传统 SEO | GEO |
|------|------|------|
| 优化对象 | 关键词排名 | AI 回答中的**引用** |
| 可见度 | 平均排名 | 引用位置 / 长度 |
| 用户行为 | 看标题点链接 | 直接读 AI 回答 |
| 核心手段 | 关键词 / 反链 | 引用源 / 统计 / 引语 |
| 转化路径 | 排名→点击→站内 | 引用曝光→可能不点击 |
| 度量 | Search Console | GSC Generative AI report |

> Google 官方定调：**GEO/AEO 仍是 SEO**，跳过基础 SEO 直接做 GEO 是本末倒置。

<!--
传统 SEO 是 GEO 的地基——可抓取、可索引、内容质量、核心排名是进入 AI 候选池的前提。
-->

---

# AI 搜索引擎生态

| 引擎 | 厂商 | 搜索露出爬虫 | 训练爬虫 |
|------|------|------|------|
| **ChatGPT 搜索** | OpenAI | OAI-SearchBot | GPTBot |
| **Perplexity** | Perplexity | PerplexityBot | （兼任） |
| **AI Overviews** | Google | Googlebot | Google-Extended |
| **Gemini** | Google | Googlebot | Google-Extended |
| **Copilot** | Microsoft | Bingbot | - |
| **Claude** | Anthropic | ClaudeBot | ClaudeBot |

> 各引擎爬虫策略仍在高频变动，需以官方文档为准。

<!--
重点区分「搜索露出爬虫」与「训练爬虫」——禁 OAI-SearchBot = 放弃 ChatGPT 搜索曝光。
-->

---

# AI 爬虫的关键区分

**搜索露出 ≠ 训练**

- **OAI-SearchBot**：仅用于 ChatGPT 搜索结果露出（**非训练**）
- **GPTBot**：OpenAI 模型训练
- **PerplexityBot**：Perplexity 搜索索引 / 链接露出
- **Perplexity-User**：用户实时浏览，**一般忽略 robots.txt**

**工程要点**

- 每个 bot 标签相互独立，可只允许搜索露出爬虫、拒训练爬虫
- robots.txt 改动约 **24 小时生效**
- OpenAI / Perplexity 均发布可验证的 IP 段 JSON 端点

> 禁 OAI-SearchBot 等于放弃 ChatGPT 搜索曝光——站点不会出现在 ChatGPT 搜索回答中。

<!--
一刀切 Disallow 所有 AI 爬虫会同时丢全部 AI 搜索曝光，应区分管理。
-->

---

# Princeton 9 种优化方法

| 方法 | 中文 | 效果档位 |
|------|------|------|
| **Cite Sources** | 引用源 | **Top-performing** |
| **Quotation Addition** | 引语 | **Top-performing** |
| **Statistics Addition** | 统计 | **Top-performing** |
| **Authoritative** | 权威语气 | 中等 |
| **Fluency Optimization** | 流畅度 | 中等 |
| Easy-to-Understand / Unique Words / Technical Terms | 弱效果 | 弱 |
| **Keyword Stuffing** | 关键词堆砌 | **负效果（约 -10%）** |

> 生成式引擎偏好可核验、可归因的事实依据，关键词堆砌这种传统 SEO 手段在 GEO 中失效。

<!--
重点：top-performing 三类（引用源/引语/统计）对低排名站点尤其有效。
-->

---

# Princeton 关键数字

**整体效果**

- GEO-bench 综合可见度提升 **up to 40%**
- 真实引擎 Perplexity.ai 上 **up to 37%**

**低排名站点获益最大**

| 方法（Rank-5 站点） | 相对提升 |
|------|------|
| **Cite Sources** | **+115.1%** |
| **Quotation Addition** | **+99.7%** |
| **Statistics Addition** | **+97.9%** |
| **Keyword Stuffing** | **约 -10%**（负效果） |

> 新站 / 低权威站通过加入可验证引用，相对提升反而最大。

<!--
低排名红利是 GEO 的关键机会窗口——Rank-5 站点 Cite Sources +115%。
-->

---

# llms.txt 是什么

**社区提案**（[llmstxt.org](https://llmstxt.org/)，v1.7.0）

- **提出**：Jeremy Howard / Answer.AI，2024-09-03
- **定位**：为大语言模型提供简洁、markdown 化的站点摄入入口
- **状态**：**非 IETF / W3C 官方 Web 标准**
- **部署位置**：站点根路径 `/llms.txt`
- **主要场景**：面向 inference（用户按需查询时），非 training
- **采用方**：Perplexity / OpenAI / Anthropic / MCP 等开发者文档生态

> **Google 官方明确不使用 llms.txt**——做了对 Google 排名无增益，但对面向 Claude/Perplexity 的文档生态有价值。

<!--
llms.txt 不是 Google 通用搜索的敲门砖，但开发者文档生态已广泛采用。
-->

---

# llms.txt 格式规范

**唯一必需段**：H1 标题；其余可选

```text
# Example Project

> 一句话摘要（blockquote）

详细说明段落（可选）。

## Docs

- [Quickstart](https://example.com/start.md): 5 分钟跑起来
- [API](https://example.com/api.md): 完整接口

## Optional

- [Changelog](https://example.com/changelog.md): 次要信息
```

**## Optional 特殊语义**：需要短上下文时可跳过该段 URL。

<!--
唯一必需段是 H1，其余都是可选。Optional 段有特殊语义——需要短上下文时可被跳过。
-->

---
layout: two-cols
---

# 放行 AI 搜索爬虫

**推荐策略**

- 允许搜索露出爬虫（OAI-SearchBot / PerplexityBot）
- 按需拒绝训练爬虫（GPTBot）
- 别一刀切 Disallow 全部

```text
User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Disallow: /
```

::right::

# 避免一刀切

**反模式**

```text
# 一刀切（不推荐）
User-agent: *
Disallow: /
```

**后果**

- 丢 ChatGPT 搜索曝光
- 丢 Perplexity 索引
- 丢 Gemini / Copilot 引用
- 流量损失难恢复

> Perplexity-User 一般忽略 robots.txt（用户实时浏览）。

<!--
一刀切是最常见的反模式——丢了所有 AI 搜索曝光还以为是在保护内容。
-->

---
layout: quote
---

# 引用 ≠ 推荐

被 AI 引用为信息来源 **不等于** 被推荐 / 背书——引擎可能引用后给出**负面或中立**评价。

<!--
最易混淆的概念：citation 与 recommendation 不等价。
-->

---

# 第三方露出比自有站更重要

AI 引擎常从**高权威三方站**取材

- **Wikipedia**：高权威 + 结构化内容
- **Reddit**：真实用户讨论，Perplexity / ChatGPT 常引用
- **评测站**（G2 / Trustpilot / Capterra）：产品类查询核心
- **行业媒体**（TechCrunch / The Verge）：新闻类查询核心
- **GitHub / Stack Overflow**：开发者技术类核心

> 对很多企业，**经营第三方高权重露出比堆自有站内容更有效**——多渠道露出。

<!--
自有站被引难度高，先经营 Wikipedia / Reddit / GitHub 等高权威三方站。
-->

---

# 清晰问答结构

**工程动作**

- **H1 / H2 / H3 层级清晰**：每段聚焦一个问题
- **段落短小**：方便 RAG 切片
- **FAQPage / HowTo schema**：声明问答关系
- **直接回答体**：标题后第一段直接给答案
- **列表 / 表格**：结构化信息更易被抽取

```json
{
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "GEO 是什么？",
    "acceptedAnswer": { "@type": "Answer", "text": "..." }
  }]
}
```

> Google 强调：生成式搜索**不要求特殊 schema**，结构化数据服务于整体 SEO。

<!--
清晰问答结构既利于人类阅读，也利于 RAG 检索切片与抽取。
-->

---
layout: center
class: text-center
---

# 反模式（避坑）

- **关键词堆砌**：约 **-10%** 负效果
- **llms.txt 万能论**：Google 明确不使用
- **为查询变体造页**：违反 scaled content abuse 政策
- **为 AI 切碎内容**：系统能理解单页多主题
- **为 AI 改写文风**：AI 理解同义词，无需穷举
- **刷虚假提及**：核心排名系统会拦截
- **结构化数据当万能药**：生成式搜索不要求特殊 schema
- **一刀切封禁 AI 爬虫**：丢全部 AI 搜索曝光
- **把 GEO 当 SEO 替代**：基础 SEO 是地基

<!--
九大反模式是 GEO 实践中最易踩的坑。
-->

---
layout: center
class: text-center
---

# 小结

GEO = 让内容被 AI 搜索引擎**引用**

引用源 + 引语 + 统计 · 清晰问答结构 · 放行搜索爬虫 · 经营第三方露出

**低排名红利 +115% · 引用 ≠ 推荐 · GEO 仍是 SEO**

[llmstxt.org](https://llmstxt.org/) · [Princeton 论文](https://arxiv.org/abs/2311.09735) · [Google AI 指南](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

<!--
掌握三策略 + 引用≠推荐 + 第三方露出，就能把 GEO 用到生产水准。
-->
