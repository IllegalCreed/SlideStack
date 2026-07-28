---
theme: seriph
background: https://cover.sli.dev
title: 嵌入模型完全指南
info: |
  嵌入模型完全指南：维度与存储 · MRL 降维 · BGE-M3 三模一体 · 对称/非对称检索 · MTEB 选型

  Learn more at [huggingface.co/spaces/mteb/leaderboard](https://huggingface.co/spaces/mteb/leaderboard)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 嵌入模型

文本映射为高维稠密向量 · MRL · BGE-M3 · 对称/非对称检索

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
嵌入模型是 RAG、语义搜索、推荐的语义骨架。
-->

---
transition: fade-out
---

# 嵌入模型是什么

把文本（或图像、音频）映射为高维稠密向量

- **语义召回**：超越关键词，理解同义、改写、跨语言
- **开源选项强**：BGE-M3 / Nomic 可本地部署
- **维度可调**：MRL 输出 256/512/1024 多种维度
- **多语言**：BGE-M3 / Jina v3 支持 100+ 语言

> 「重置密码」与「忘记密码」经嵌入后向量非常接近——语义召回的本质。

<!--
嵌入模型让向量数据库能按「意思」而非「字面」召回。
-->

---

# 基本用法

输入文本 → 输出固定维度浮点向量，语义相近则距离近

```python
# OpenAI（闭源 API，1536 维）
from openai import OpenAI
resp = OpenAI().embeddings.create(model="text-embedding-3-small", input="如何重置密码")
vec = resp.data[0].embedding

# BGE-M3（开源，本地推理，1024 维）
from FlagEmbedding import BGEM3FlagModel
model = BGEM3FlagModel('BAAI/bge-m3', use_fp16=True)
emb = model.encode(["如何重置密码"])['dense_vecs'][0]
```

> 闭源 API 省心，开源 BGE-M3 零成本可本地部署。

<!--
OpenAI 是闭源默认，BGE-M3 是开源 SOTA。
-->

---
layout: two-cols
---

# 维度与存储

| 维度 | 100 万条 | 代表模型 |
|------|------|------|
| 384 | 1.5 GB | MiniLM |
| 768 | 3 GB | Nomic、bge-base |
| 1024 | 4 GB | BGE-M3 |
| 1536 | 6 GB | OpenAI 3-small |
| 3072 | 12 GB | OpenAI 3-large |

::right::

# 维度不是越大越好

::: tip

3072 维比 1024 维多 3 倍存储和内存，但召回提升常常只有 **1-2%**。

对成本敏感的场景，**1024 维 + MRL 截断**往往性价比最高。

:::

**OpenAI dimensions 降维**

```python
resp = client.embeddings.create(
    model="text-embedding-3-large",
    input="...",
    dimensions=1024,   # MRL 降维
)
```

> 维度翻倍，存储内存翻倍，召回提升常常只有 1-2%。

<!--
成本敏感选 1024 + MRL，是性价比甜点。
-->

---

# MRL：俄罗斯套娃表征

训练时让信息**前载**到前几维，截断后保留大部分语义

| 截到 | 相对维度 | 召回损失 |
|------|------|------|
| 1536 | 1/2 | ~1-2% |
| 1024 | 1/3 | ~2-3% |
| 256 | 1/12 | ~8-12% |

**策略**：建 recall@10 基线 → 逐步截断到 95% 就停 → 选最小可用维度

> 截断后无法「升级」——不确定时先存全维度。

<!--
MRL 是嵌入模型这几年的标志性技术，让维度按需取舍。
-->

---

# BGE-M3：三模一体

BAAI 出品，一个模型同时输出三种向量

| 输出 | 维度 | 用途 |
|------|------|------|
| **dense** | 1024 | 语义检索（默认） |
| **sparse** | 词表 | 词法匹配（类 BM25） |
| **multi-vector** | token 级 | 细粒度（ColBERT 风格） |

```python
model = BGEM3FlagModel('BAAI/bge-m3')
out = model.encode(["文档1"], return_dense=True,
    return_sparse=True, return_colbert_vecs=True)
```

> **100+ 语言**、**8192 token**——开源混合检索一站式方案。

<!--
BGE-M3 一个模型搞定 dense+sparse+colbert，开源混合检索首选。
-->

---
layout: two-cols
---

# 对称 vs 非对称检索

选型的核心分水岭。

| 类型 | 输入形态 | 典型任务 |
|------|------|------|
| **对称** | 句 vs 句 | STS、聚类、去重 |
| **非对称** | 短 query→长文档 | RAG、文档检索 |

::right::

# input_type 信号

::: warning 选错召回骤降

用对称模型做非对称检索，召回会明显下降——它们没学过「短问题匹配长答案」。

RAG 务必选非对称/检索专用模型。

:::

```python
# Cohere
co.embed(texts=["重置密码步骤"],
         input_type="search_document")  # 入库
co.embed(texts=["怎么改密码"],
         input_type="search_query")     # 查询
```

> 用错 input_type 召回掉几个点——入库 document、查询 query 必须区分。

<!--
对称/非对称是选型第一问，input_type 是非对称的关键信号。
-->

---

# 主流选手速览

| 模型 | 类型 | 默认维度 | 上下文 | 特色 |
|------|------|------|------|------|
| OpenAI 3-small/large | API | 1536/3072 | 8191 | 生态默认，MRL |
| Cohere Embed v3 | API | 1024/384 | 512 | input_type 信号 |
| Voyage voyage-3 | API | 可变 | 32k | 多领域 SOTA |
| Jina v3 | API/开源 | ≤1024 | 8192 | Task LoRA |
| **BGE-M3** | 开源 | 1024 | 8192 | 三模一体，多语 |

> 中文场景：BGE-M3 / Cohere multilingual / Voyage 普遍好于纯英文模型。

<!--
闭源看 OpenAI/Voyage，开源看 BGE-M3。
-->

---

# MTEB 排行榜

MTEB 是嵌入模型事实标准评测，覆盖 **8 类任务**

| 任务 | 说明 |
|------|------|
| **Retrieval** | 检索（RAG 核心） |
| STS / Clustering | 相似度 / 聚类 |
| Reranking / Bitext | 重排 / 双语对齐 |

**怎么读**：先看 Retrieval 子榜 + 你的语言 → 对比维度（同分选小维度）→ 开源 vs 闭源分榜

> MTEB 高分 ≠ 业务好——务必在自己数据上做 A/B 对比 recall@10。

<!--
MTEB 是参考，但业务数据分布不同，必须自测。
-->

---

# 选型决策表

| 你的情况 | 推荐 |
|------|------|
| 通用 RAG，闭源省心 | OpenAI 3-small（1536） |
| 极致召回 / 多语言 | OpenAI 3-large / BGE-M3 |
| 要混合检索（dense+sparse） | BGE-M3（一次产出两种） |
| 本地部署 / 成本敏感 | BGE-M3 + 1024 维 MRL |
| 长文档（> 8k token） | Voyage（32k）/ Jina v3 |

> 入库与查询必须用**同一模型同一维度**，否则距离无意义。

<!--
选型核心：任务类型（对称/非对称）+ 语言 + 成本 + 部署方式。
-->

---
layout: quote
---

# 嵌入模型的选型精髓

「任务定对称非对称，维度定成本，MRL 定弹性，MTEB 定参考——但最终要用自己的数据说话。」

---
layout: center
class: text-center
---

# 小结

嵌入模型 = 文本 → 向量 → 语义可计算

**MRL 降维 · BGE-M3 三模 · 非对称检索 · MTEB 自测**

[MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) · [BGE-M3](https://huggingface.co/BAAI/bge-m3)

<!--
嵌入模型四要点：任务/维度/MRL/自测。
-->
