---
theme: seriph
background: https://cover.sli.dev
title: 推荐系统入门
info: |
  推荐系统入门：协同过滤 · 矩阵分解 · Two-Tower 召回 · 召回排序架构 · NDCG 评估

  Learn more at https://en.wikipedia.org/wiki/Recommender_system
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 推荐系统

预测用户对物品的偏好 · 猜你喜欢 · 召回排序两阶段

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
推荐系统本质是用户-物品匹配。
-->

---
transition: fade-out
---

# 推荐系统是什么

在海量物品中为每用户筛出最可能感兴趣的 Top-K

- **本质**：用户-物品匹配，估计偏好分
- **形式化**：学函数 `f(u, i) → r̂`，按分排序取前 K
- **场景**：电商、短视频、新闻、音乐、广告
- **核心难题**：冷启动（新用户/新物品无行为）
- **与 RAG 区别**：推荐无显式 query，RAG 有 query

> 解决信息过载，是平台核心增长引擎

<!--
推荐是「猜你喜欢」，与 RAG 问答检索目标不同。
-->

---

# 协同过滤（CF）

核心思想：和你品味相似的人喜欢的你也喜欢

```python
from sklearn.metrics.pairwise import cosine_similarity
# 评分矩阵：行用户，列物品，0 未交互
item_sim = cosine_similarity(R.T)  # 物品相似度
def predict(user, item, R, sim):
    rated = np.where(R[user] > 0)[0]
    if len(rated) == 0: return 0
    sims = sim[item, rated]; scores = R[user, rated]
    return (sims * scores).sum() / (np.abs(sims).sum() + 1e-8)
```

- **User-based**：找邻居用户推荐
- **Item-based**：找相似物品推荐（亚马逊经典）
- **缺点**：数据稀疏、冷启动差、可扩展性弱

> 相似度常用余弦或 Pearson 相关

<!--
Item-based 比 User-based 更稳定。
-->

---

# 矩阵分解（MF）

Netflix Prize 标志技术，稀疏矩阵分解为低秩

```
R ≈ U · Vᵀ   (U 用户隐因子，V 物品隐因子)
```

```python
def als(R, k=2, steps=100, lam=0.1):
    m, n = R.shape
    U = np.random.rand(m, k); V = np.random.rand(n, k)
    mask = (R > 0).astype(float)
    for _ in range(steps):       # 交替最小二乘
        # 固定 V 更新 U，再固定 U 更新 V（略）
        pass
    return U, V
pred = U @ V.T   # 补全的完整矩阵
```

> ALS 适合大规模并行；SGD 版（SVD++）精度更高

<!--
隐因子向量就是最早的 Embedding。
-->

---

layout: two-cols

---

# 深度学习推荐

Neural CF 用 MLP 替代内积学非线性交互

```python
class NCF(nn.Module):
  def __init__(self, n_users, n_items, dim=32):
    super().__init__()
    self.user_emb = nn.Embedding(n_users, dim)
    self.item_emb = nn.Embedding(n_items, dim)
    self.mlp = nn.Sequential(
      nn.Linear(dim*2, 64), nn.ReLU(),
      nn.Linear(64, 1), nn.Sigmoid())
  def forward(self, u, i):
    x = torch.cat([self.user_emb(u),
      self.item_emb(i)], dim=-1)
    return self.mlp(x).squeeze()
```

::right::

# 经典模型谱系

| 模型 | 特点 |
|------|------|
| Wide & Deep | 记忆+泛化 |
| DeepFM | FM 交叉+DNN |
| DIN | 目标注意力 |
| DIEN | 序列兴趣演化 |
| MMoE | 多任务门控 |

> Wide & Deep（Google 2016）开启深度推荐

<!--
DIN 引入目标注意力建模用户兴趣。
-->

---

# Two-Tower 召回

工业级 Embedding 召回的事实标准

```python
class TwoTower(nn.Module):
  def __init__(self, uf, itf, dim=64):
    super().__init__()
    self.user_tower = nn.Sequential(
      nn.Linear(uf, 128), nn.ReLU(), nn.Linear(128, dim))
    self.item_tower = nn.Sequential(
      nn.Linear(itf, 128), nn.ReLU(), nn.Linear(128, dim))
  def forward(self, uf, itf):
    u = nn.functional.normalize(self.user_tower(uf), dim=-1)
    v = nn.functional.normalize(self.item_tower(itf), dim=-1)
    return (u * v).sum(dim=-1)  # 余弦相似度
```

> 物品 Embedding 可离线预算入 ANN 索引，在线毫秒级

<!--
Uber、YouTube、Pinterest 均采用 Two-Tower 召回。
-->

---

# 召回-排序两阶段架构

```
亿级物料库
   │
   ▼
[召回 Retrieval] 多路召回 → 几百候选
   │
   ▼
[粗排 Pre-ranking] 轻量模型 → 几十
   │
   ▼
[精排 Ranking] DeepFM/DIN 多目标 → 打分
   │
   ▼
[重排 Re-ranking] 多样性/业务规则 → Top-K
```

- **召回重 Recall**：宁滥勿缺，ANN + 多路混合
- **排序重 Precision**：GBDT/DNN，多目标加权
- **重排**：MMR 多样性、打散、探索新内容

> 多路召回：Embedding + CF + 热门 + 标签 + 图

<!--
工业系统普遍采用多阶段架构。
-->

---

# 冷启动问题

新用户/新物品无行为数据，无法用 CF/MF

| 类型 | 策略 |
|------|------|
| 新用户 | 兴趣标签 + 人口属性 + 热门兜底 |
| 新物品 | 内容特征 + 多臂老虎机探索 |
| 通用 | Contextual Bandit（LinUCB）|

```python
import random
def recommend_with_explore(user, model, items, eps=0.1):
    if random.random() < eps:
        return random.sample(items, 10)  # 探索
    return model.topk(user, items, 10)   # 利用
```

> epsilon-greedy：大部分利用，小部分探索新物品

<!--
冷启动常用多臂老虎机与内容特征缓解。
-->

---

# 评估指标

NDCG@K 因考虑位置折扣被最广泛使用

```python
import numpy as np
def dcg(rels):
    return sum(r / np.log2(i + 2) for i, r in enumerate(rels))
def ndcg_at_k(rels, k):
    dcg_k = dcg(rels[:k])
    idcg_k = dcg(sorted(rels, reverse=True)[:k])
    return dcg_k / idcg_k if idcg_k > 0 else 0
print(ndcg_at_k([3, 0, 2, 1, 0], k=5))
```

- **Precision@K**：推荐中相关的比例
- **Recall@K**：相关物品被召回的比例
- **NDCG@K**：考虑位置折扣，最常用

> 排第 1 与排第 10 的相关项贡献不同

<!--
NDCG 符合用户主要看前几条的行为。
-->

---

layout: quote

---

# 召回排序两段式

「召回重 Recall 宁滥勿缺，排序重 Precision 宁缺勿滥，再加重排保证多样性——这是工业级推荐系统的万能架构。」

---

# 推荐 vs 搜索 vs RAG

| 维度 | 推荐系统 | 搜索 | RAG |
|------|------|------|------|
| 输入 | 用户（无 query）| 显式 query | 显式 query |
| 匹配 | 用户↔物品 | query↔文档 | query↔文档 |
| 目标 | 猜你喜欢 | 找相关信息 | 喂 LLM 生成 |
| 触发 | 主动推送 | 用户搜索 | 用户提问 |
| 评估 | NDCG/留存 | NDCG/MAP | 答案准确性 |

> 推荐是无 query 个性化匹配，底层都用向量检索

<!--
推荐与 RAG 底层相似但目标不同。
-->

---
layout: center
class: text-center
---

# 小结

推荐系统 = 召回 + 排序 + 重排

**CF/MF 基石 · Two-Tower 召回 · 多目标排序 · NDCG 评估**

[Wikipedia](https://en.wikipedia.org/wiki/Recommender_system) · [NVIDIA Merlin](https://nvidia-merlin.github.io) · [GitHub](https://github.com/IllegalCreed/SlideStack)

<!--
两阶段架构 + 冷启动策略 + 多目标排序。
-->
