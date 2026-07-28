---
theme: seriph
background: https://cover.sli.dev
title: 向量数据库完全指南
info: |
  向量数据库完全指南：距离度量 · ANN 索引 · HNSW/IVF 调参 · 混合检索 · 选型决策

  Learn more at [milvus.io](https://milvus.io/docs/index.md)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 向量数据库

存储·索引·检索高维向量 · HNSW · IVF · 混合检索

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
向量数据库三件事：存向量 / 建索引 / 算相似度。
-->

---
transition: fade-out
---

# 向量数据库是什么

专门存储、索引与检索高维向量的数据库系统

- **语义检索**：按「意思」而非字面匹配，同义/改写/跨语言都召回
- **多模态统一**：文本/图/音/代码都变向量，一套相似度接口
- **高效 ANN**：HNSW / IVF 索引让百万级向量毫秒级返回
- **混合检索**：dense + sparse 同库查询（Weaviate/Qdrant/Milvus）
- **生态成熟**：LangChain / LlamaIndex / Vercel AI SDK 开箱即接
- **与现有 DB 融合**：pgvector 让 Postgres 一库搞定关系 + 向量

> 三类选手：托管 SaaS（Pinecone）/ 自托管开源（Milvus、Qdrant）/ 数据库扩展（pgvector）。

<!--
向量数据库把「按意思查」变成工程化的存储与检索系统。
-->

---
layout: two-cols
---

# 三类距离度量

| 度量 | 适用 | pgvector |
|------|------|------|
| 余弦距离 | 文本嵌入 | `<=>` |
| L2 欧氏 | 图像/几何 | `<->` |
| 负内积 | 归一化向量 | `<#>` |

::right::

# 归一化后余弦 = 内积

::: tip

OpenAI / BGE 等模型输出**已归一化**向量（模长为 1），此时 `A·B = cos(θ)`，用更快的**内积**代替余弦即可。

pgvector 里归一化向量可用 `<#>` 配 `vector_ip_ops`，避免每次重算模长。

:::

> 度量选错 = 距离语义全错，迁移时维度和 metric 必须一致。

<!--
文本用余弦，归一化后用内积更省——这是最常被忽略的优化。
-->

---

# 精确 vs 近似检索

**FLAT（暴力）**：逐一算距离排序取 top-k

- 召回 **100%**，但 O(N) 复杂度
- 适合 < 10 万条 + 要求精确（法律、医疗去重）

**ANN（近似最近邻）**：牺牲少量召回换巨大速度提升

- **基于聚类**：IVF 系列（把空间分桶，只查最近的几个桶）
- **基于图**：HNSW（多层小世界图，沿图跳着找）

> 除 FLAT 外所有 ANN 索引都是近似结果，召回 < 100%——这是速度的代价。

<!--
精确 vs 近似是速度与召回的根本权衡。
-->

---

# Milvus 索引矩阵

| 索引 | 原理 | 内存 | 召回 | 适用 |
|------|------|------|------|------|
| **FLAT** | 暴力比对 | 高 | 100% | 小数据，要求精确 |
| **IVF_FLAT** | 聚类分桶+桶内暴力 | 高 | 高 | 速度召回均衡 |
| **IVF_SQ8/PQ** | IVF+量化压缩 | 中~最低 | 良/较低 | 内存吃紧 |
| **HNSW** | 多层小世界图 | 高 | 很高 | 低延迟高召回 |
| **DISKANN** | 磁盘图索引 | 低 | 高 | 海量超 RAM |

**量化**：float32 有损压缩——SQ8 省 4 倍召回略降，PQ 省 8-16 倍召回降更多。

<!--
Milvus 索引矩阵最全，按内存/召回/规模三轴选。
-->

---
layout: two-cols
---

# HNSW 三参数

| 参数 | 作用 | 典型值 |
|------|------|------|
| `M` | 节点最大邻居数 | 16-64 |
| `ef_construction` | 建图候选数 | 200-500 |
| `ef_search` | 查询候选数 | 64-256 |

**调参策略**

```text
1. 默认值建基线（M=16, ef_c=200）
2. 召回不够先提 ef_search（最省）
3. 再不够重建提 ef_construction
4. 极致召回才提 M（内存最贵）
```

::right::

# IVF 两参数

| 参数 | 经验 |
|------|------|
| `nlist` | `sqrt(N)` 到 `4*sqrt(N)` |
| `nprobe` | `nlist` 的 1%-5% |

**IVF 量化取舍**：FLAT 无损 · SQ8 内存 25%/召回 -1-3% · PQ 内存 6-12%/召回 -5-15%

> 别盲目调大 `M`——翻倍内存也接近翻倍。

<!--
HNSW 调参先 ef_search，再 ef_construction，最后才动 M。
-->

---
layout: two-cols
---

# pgvector 基础

PG 扩展，复用现有 Postgres，关系数据 + 向量一库搞定。

```sql
CREATE EXTENSION vector;

CREATE TABLE docs (
  id serial PRIMARY KEY,
  content text,
  embedding vector(1536)
);

-- 建索引（opclass 必须匹配查询操作符）
CREATE INDEX ON docs
  USING hnsw (embedding vector_cosine_ops);

-- 查询用 <=> 才命中索引
SELECT id, content
FROM docs
ORDER BY embedding <=> '[0.1,...]'::vector
LIMIT 5;
```

::right::

# 操作符必须匹配 opclass

::: warning

- `<=>` 配 `vector_cosine_ops`
- `<->` 配 `vector_l2_ops`
- `<#>` 配 `vector_ip_ops`

用错操作符会导致 `EXPLAIN` 显示 **Seq Scan**（全表扫描），索引完全不生效。

:::

**确认走索引**

```sql
EXPLAIN SELECT id FROM docs
ORDER BY embedding <=> '[...]'::vector
LIMIT 5;
```

> 看到 `Index Scan` = 走索引；`Seq Scan` = 全表扫，检查 opclass。

<!--
pgvector 最大陷阱：操作符和 opclass 必须配对，否则索引白建。
-->

---

# 混合检索（Hybrid Search）

把关键词检索（BM25 / sparse）和语义检索（dense）结果融合

**融合方法：RRF（Reciprocal Rank Fusion）**

```text
RRF_score(d) = Σ 1 / (k + rank_i(d))   # k 通常 60
```

每条文档在每个检索器里有排名，倒数加权求和。简单、无需分数归一化，是 Weaviate / Qdrant 默认。

**Weaviate 原生 hybrid**

```python
result = collection.query.hybrid(
    query="reset password",
    alpha=0.5,   # 0=纯关键词，1=纯向量
    limit=5,
)  # 内部同时跑 BM25 + dense，RRF 融合
```

> `alpha` 控制融合偏向但**不等于简单加权**——内部仍是 RRF。

<!--
RRF 是混合检索的事实标准融合算法。
-->

---
layout: two-cols
---

# 元数据过滤

检索时常需「在某个 category 内查」或「时间在 2024 后」。

| 策略 | 做法 | 召回 |
|------|------|------|
| Pre-filtering | 先过滤再向量搜索 | 准 |
| Post-filtering | 先 top-k 再过滤 | 可能不足 |

Qdrant / Weaviate 用前者（pre-filtering）。

::right::

# 批量插入与 HNSW 陷阱

**批量 upsert**：一次 100-1000 条，别一条条插。

```sql
-- pgvector 并发重建（不停服）
DROP INDEX CONCURRENTLY docs_embedding_idx;
CREATE INDEX CONCURRENTLY ON docs
  USING hnsw (embedding vector_cosine_ops);
```

::: warning HNSW 写入陷阱

HNSW 增删后图要重新平衡，**大批量更新应重建索引**而非增量 upsert。

:::

> HNSW 图碎片化会让写入越来越慢——定期重建。

<!--
批量写 + 定期重建是 HNSW 运维的两大要点。
-->

---

# 选型决策表

| 你的情况 | 推荐 |
|------|------|
| 已有 Postgres，向量 < 100 万 | **pgvector** |
| 不想运维，规模中等到大 | **Pinecone** serverless |
| 海量数据 + 自建 / 超 RAM | **Milvus**（DISKANN） |
| 重视混合检索 / 强过滤 | **Weaviate** / **Qdrant** |
| 原型验证 / 学习 / 单机小项目 | **Chroma** |

> 选错迁移成本极高——规划时先确定 embedding 模型与维度。

<!--
选型三问：托管还是自建？规模多大？要不要混合检索？
-->

---
layout: quote
---

# 向量检索的工程精髓

「距离度量定语义，索引定速度，量化定内存，混合检索定召回——四轴调好，向量库就稳了。」

---
layout: center
class: text-center
---

# 小结

向量数据库 = 存向量 + 建索引 + 算相似度

**HNSW 高召回 · IVF 可调 · RRF 混合 · pgvector 复用**

[Milvus 文档](https://milvus.io/docs/index.md) · [pgvector](https://github.com/pgvector/pgvector)

<!--
四轴：度量/索引/量化/混合——向量库调参的核心框架。
-->
