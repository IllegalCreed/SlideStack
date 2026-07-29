---
theme: seriph
background: https://cover.sli.dev
title: RAG 检索增强生成完全指南
info: |
  RAG（Retrieval Augmented Generation）完全指南：四阶段架构 · 向量库 · Embedding · Chunk · Reranker · HyDE

  Learn more at [https://www.pinecone.io/learn/retrieval-augmented-generation/](https://www.pinecone.io/learn/retrieval-augmented-generation/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## RAG 检索增强生成

给大语言模型外挂可即时更新的知识库 · LangChain / LlamaIndex · BGE-M3

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
RAG 本质是给 LLM 外挂一个可即时更新的知识库——检索 + 增强 + 生成三步走。
-->

---
transition: fade-out
---

# 什么是 RAG

检索增强生成（Retrieval Augmented Generation）

- **本质**：把「检索」插在「生成」之前，让 LLM 「看着资料答题」
- **解决**：LLM 训练后知识被冻结，无法答新事件/私有数据/长尾领域
- **离线**：语料切块→向量化→入向量库（一次性，可增量）
- **在线**：查询来了才检索+生成，每次都是最新资料
- **来源可引用**：每条答案都能追溯到具体 chunk
- **降低幻觉**：明确「基于 CONTEXT 回答」+ 来源引用

> RAG 不是模型，是**架构模式**——同一套模型开 RAG 后知识库动态更新。

<!--
RAG 是架构模式而非模型，重点是「检索插在生成前」。
-->

---

# RAG vs Fine-tuning vs Long Context

| 维度 | RAG | Fine-tuning | Long Context |
|------|------|------|------|
| **注入内容** | 事实/知识 | 风格/格式/任务 | 单次临时上下文 |
| **更新成本** | 改文档即时 | 重训（贵） | 塞 prompt（按 token） |
| **生产成本** | 中 | 高 | **20–24x** RAG |
| **时效性** | 实时 | 训练截止 | 实时 |
| **来源引用** | ✅ | ❌ | ✅（难追溯） |

**2025 年行业共识**：三者**互补非互斥**

- 生产常组合：Fine-tuning（固化行为）+ RAG（动态事实）+ Long Context（按需调用）

<!--
三者互补非互斥，生产环境常组合使用。
-->

---

# RAG 四阶段（一）：Ingestion

离线入库：把语料加工成可检索向量

```text
原始文档（PDF/HTML/Markdown）
  ↓ Document Loader / Data Connector
Document（文本 + metadata）
  ↓ Text Splitter / NodeParser
Chunk（语义完整的小段）
  ↓ Embedding 模型（OpenAI / BGE）
向量（1536 / 3072 / 1024 维）
  ↓ 入库
Vector Store（Pinecone / Weaviate / pgvector）
```

**关键决策**：Loader → Splitter → Embedding → Vector Store

> 改 Embedding 必须**重建整个索引**——不同模型向量空间不兼容。

<!--
离线阶段是 RAG 工程链最长的一段，每一步都影响最终检索质量。
-->

---
layout: two-cols
---

# 在线三阶段

**Retrieval（检索）**

- 查询向量化（同模型）
- 相似度检索 top-k
- metadata 预过滤
- 典型 top_k = 3–10

**Augmentation（拼 prompt）**

- CONTEXT 塞检索 chunk
- 指令「基于 CONTEXT 答」
- 无答案答「我不知道」
- 要求引用来源

::right::

# Generation

**Generation（生成）**

- LLM 仅基于 CONTEXT 作答
- 标注 chunk id / source
- 满足合规审计
- 流式输出 + Response Synthesizer

**Pinecone 模板**

```text
基于 CONTEXT 回答。
若 CONTEXT 无答案，答「我不知道」。
不要使用 CONTEXT 之外的知识。
```

<!--
Augmentation 阶段的 prompt 模板设计直接决定 hallucination 程度。
-->

---

# Embedding 模型选型

| 模型 | 维度 | max input | 特点 |
|------|------|------|------|
| **OpenAI text-embedding-3-small** | 1536 | 8192 token | 性价比首选 |
| **OpenAI text-embedding-3-large** | 3072（可降） | 8192 token | 性能最强 |
| **BGE-M3（BAAI）** | 1024 | 8192 token | 100+ 语言，三模一体 |
| OpenAI ada-002（旧版） | 1536 | 8192 token | 已过时，新项目别用 |

**MRL 降维**（Matryoshka Representation Learning）

- `text-embedding-3-large` 默认 3072 维
- 用 `dimensions=1024` 直接生成 1024 维
- **性能仍胜 ada-002 的 1536 维**
- 存储与检索成本降一半以上

> OpenAI 向量已归一化，cosine 可用更快的 **dot product** 等价计算。

<!--
MRL 是 OpenAI 3 系列的关键特性，可在保持性能的前提下大幅省存储。
-->

---

# 向量库四选型

| 维度 | Pinecone | Weaviate | Chroma | pgvector |
|------|------|------|------|------|
| **部署** | 托管 SaaS | 自托管 | 轻量自托管 | PostgreSQL 扩展 |
| **索引** | 闭源 | HNSW + 倒排 | HNSW | **HNSW / IVFFlat** |
| **过滤** | 后过滤 + 优化 | **预过滤** | 后过滤 | 0.8.0+ 内联 |
| **Hybrid** | ✅ | ✅ | ✅ | 需配合 BM25 |
| **场景** | 不想运维 | 多租户生产 | 原型小规模 | 已有 PG 生态 |

> HNSW 召回与性能整体优于 IVFFlat，**新项目首选 HNSW**。

<!--
四库定位完全不同：Pinecone 是托管 SaaS、Weaviate 是自托管生产、Chroma 是原型、pgvector 复用 PG 生态。
-->

---
layout: two-cols
---

# pgvector 参数

**HNSW（推荐）**

| 参数 | 默认 | 调参 |
|------|------|------|
| `m` | 16 | 召回↑内存↑ |
| `ef_construction` | 64 | 索引质量↑建库慢 |
| `ef_search` | 40 | 召回↑查询慢 |

**IVFFlat**

| 参数 | 默认 |
|------|------|
| `lists` | rows/1000 |
| `probes` | sqrt(lists) |

::right::

# 距离操作符

| 符 | 距离 |
|------|------|
| `<->` | L2 欧氏 |
| `<#>` | 负内积 |
| `<=>` | **余弦** |
| `<+>` | L1 曼哈顿 |
| `<~>` | 汉明 |
| `<%>` | Jaccard |

**经验**

- HNSW 0.5.0+ 引入
- 内联过滤 0.8.0+
- 支持 PG 13+

<!--
HNSW 三参数是 pgvector 调参的核心，ef_search 可用 SET LOCAL 单事务调。
-->

---

# Chunk 策略四类

| 策略 | 适用 | 工具 |
|------|------|------|
| **递归字符（推荐）** | 通用文本 | RecursiveCharacterTextSplitter |
| 固定字符 | 入门理解 | CharacterTextSplitter |
| 语义切分 | 学术、长文档 | SemanticChunker |
| 结构化 | Markdown / 代码 | MarkdownHeaderTextSplitter |

**RecursiveCharacterTextSplitter 默认分隔符**

```text
separators = ["\n\n", "\n", " ", ""]
```

递归逻辑：段落 → 行 → 空格 → 字符，**优先在语义边界切**。

> `chunkSize:1000` + `chunkOverlap:200` 是通用起点；单 chunk token 不超过 8192。

<!--
RecursiveCharacterTextSplitter 是 LangChain 通用文本的首选起点。
-->

---

# Hybrid Search：dense + sparse

**为何不能只用 dense**

纯语义检索遇到以下查询会丢召回：

- **产品名 / 缩写**：GPT-4、K8s、BGE-M3
- **代码标识符**：`getUserById`、`useState`
- **专有术语**：HNSW、BM25、SPLADE
- **数字 / 版本号**：v0.8.0、pgvector-0.7.0

**sparse vector 解决什么**

- BM25：经典全文检索（词频 + IDF）
- SPLADE：神经网络稀疏化，学到同义词
- BGE-M3 sparse：与 dense 同源对齐

**融合公式**

```text
final_score = (1 - alpha) * sparse + alpha * dense
```

> alpha 通常 0.5–0.7 起步，根据评估集调。

<!--
Hybrid Search 是行业最低门槛——查产品名/缩写/术语必备。
-->

---
layout: two-cols
---

# Reranker（必上）

**两阶段架构**

```text
query → bi-encoder 召回 top-k
       ↓
[query+doc] → cross-encoder 精排
       ↓
重排后的 top-k
```

**为何 cross-encoder 更准**

- bi-encoder 独立编码 → 语义压平
- cross-encoder **联合编码 + cross-attention**
- 保留全部 token 交互信息

::right::

# Reranker 模型

| 模型 | 输入上限 | 部署 |
|------|------|------|
| **Cohere Rerank 3.5/4.0** | 4096 | 商用 |
| **bge-reranker-v2-m3** | 8192 | 开源 |
| bge-reranker-v2-gemma | 8192 | 大杯 |

**收益**

- 提升准确率
- 压缩送入 LLM 的 token
- 降本降延迟

> cross-encoder 精排几乎是**免费收益**。

<!--
两阶段：bi-encoder 粗召（快便宜）+ cross-encoder 精排（慢准贵）。
-->

---

# HyDE 与 Query Transformation

**HyDE（Gao 2022）原理**

- query → LLM 生成**假设答案文档**
- 对假设文档做嵌入（而非 query 本身）
- 在 document embedding 空间检索 top-k
- 规避 query-doc 语义鸿沟

**为何有效**：假设文档与真实文档都是陈述句，分布更近

**Query Transformation 家族**

| 方法 | 适用 |
|------|------|
| HyDE | 零样本场景 |
| Multi-Query | 召回↑ |
| Step-Back | 需原则性知识 |
| Sub-Question | 多跳推理 |

> HyDE 多一次 LLM 调用延迟，简单查询不必上。

<!--
HyDE 是零样本场景的利器，论文显示性能接近有监督方法。
-->

---

# 范式演进

| 范式 | 特征 | 局限 |
|------|------|------|
| **Naive RAG** | 单次检索 + 生成 | 复杂查询召不回 |
| **Advanced RAG** | 加 Query Transform / Reranking | 流水线固定 |
| **Modular RAG** | 模块化可替换组件 | 仍是预定义流程 |
| **Agentic RAG** | agent 自主决定何时检索 | 复杂度高、token 大 |

**Agentic RAG**

- LangChain `create_agent` + `@tool`
- agent 自主判断：要不要检索？够不够？要不要重检索？
- 研究助手 / 多跳问答 / 多源数据场景显著优于固定流水线

> LangChain 经典 `RetrievalQA` 已 legacy，当前推荐 LCEL / `create_agent` / Deep Agents。

<!--
Agentic RAG 是 2025 年的前沿范式，复杂度最高但效果最好。
-->

---
layout: quote
---

# 检索质量是 RAG 的天花板

「RAG 不能让模型学会新能力（新语言、新推理范式），只能提供新事实。检索不到的知识模型答不出——garbage in garbage out。」

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 只用 dense 检索（跳过 sparse，召回暴跌）
- 不做 Reranking（噪声文档直接喂 LLM）
- chunk 过大塞爆 / 过小切断 / 不设 overlap
- 用固定字符切分处理 Markdown / 代码 / 表格
- 没有评估集就反复调 chunk_size / top_k
- 改 Embedding 模型却不重建索引（直接崩塌）
- 把 RAG 当 Fine-tuning 用
- 把所有知识塞 Long Context 替代 RAG
- 用 Naive RAG 硬扛多跳问答

<!--
检索不到的知识模型答不出——评估集 + Hybrid + Reranker 是基本盘。
-->

---
layout: center
class: text-center
---

# 小结

RAG = 给 LLM 外挂可即时更新的知识库

四阶段 · 四库 · 三件套 · 范式演进

**评估集先行 · Hybrid + Reranker 必上 · 改 Embedding 必重建**

[Pinecone RAG 入门](https://www.pinecone.io/learn/retrieval-augmented-generation/) · [LangChain Retrieval](https://docs.langchain.com/oss/python/langchain/retrieval) · [LlamaIndex](https://developers.llamaindex.ai/python/framework/understanding/)

<!--
评估集 + Hybrid + Reranker 是 RAG 生产化的基本盘。
-->
