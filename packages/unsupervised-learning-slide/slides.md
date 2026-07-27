---
theme: seriph
background: https://cover.sli.dev
title: 无监督学习完全指南
info: |
  无监督学习完全指南：聚类 · 降维 · 异常检测 · 关联规则

  Learn more at https://scikit-learn.org/stable/
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 无监督学习

无标签也能发现数据结构 · KMeans · PCA · UMAP · IsolationForest

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
无监督学习是机器学习第二大范式：训练数据只有特征矩阵 X、没有标签 y，算法从数据自身发现结构。它解决聚类、降维、异常检测、关联规则四类问题，scikit-learn 是 Python 生态主力库。
-->

---
transition: fade-out
---

# 无监督学习是什么

- 只有特征 `X`、**无标签 `y`**，从数据自身发现结构
- 对比：监督学习有标签「老师教」，无监督「自学」
- 解决：海量数据标不起时仍能提取价值
- 输出因任务而异：簇标签 / 低维坐标 / 离群标记

> 核心挑战：无 ground truth，靠轮廓系数与业务判断验证

<!--
无监督的「无监督」指没有标签，算法必须自己从统计规律中发现结构。典型价值是客户分群、异常检测、数据压缩、可视化探索。
-->

---
transition: fade-out
---

# 四大任务一览

| 任务 | 目标 | 代表算法 | 业务 |
|---|---|---|---|
| 聚类 | 相似归组 | KMeans/DBSCAN | 客户分群 |
| 降维 | 高维→低维 | PCA/t-SNE/UMAP | 可视化 |
| 异常检测 | 标记离群 | IsolationForest | 欺诈检测 |
| 关联规则 | 共现模式 | Apriori | 购物篮 |

> 判据：想分组→聚类；压缩→降维；找异常→异常检测

<!--
选任务先问自己「想发现什么」：分组用聚类、压缩可视化用降维、找离群用异常检测、找共现用关联规则。
-->

---
transition: fade-out
---

# sklearn 统一 API

```python
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
km = KMeans(n_clusters=3, n_init='auto', random_state=42)
labels = km.fit_predict(X)        # 聚类：一步出标签
pca = PCA(n_components=2)
X_2d = pca.fit_transform(X)       # 降维：一步出坐标
```

> 聚类有 `predict`、降维有 `transform`；t-SNE 无 transform 不能进流水线

<!--
沿用 sklearn 估计器接口，只是 fit 不传 y。关键差异：聚类 predict 可扩展新点，降维 transform 可扩展；t-SNE 没有显式映射，新点只能重跑全量。
-->

---
transition: fade-out
---

# KMeans：球形簇之王

- 最小化 inertia（簇内平方和），EM 迭代收敛
- `n_clusters` 靠**肘部法**或**轮廓系数**定（越大越好）
- 致命局限：假设凸球形，月牙形数据彻底失效
- 高维下距离失效，必须先降维再聚类

> KMeans 是聚类「Hello World」，选错形状等于白做

<!--
KMeans 假设簇是凸球形且大小相近。选 k 的官方推荐是轮廓系数 silhouette_score，范围 -1 到 1，越大越好。
-->

---
transition: fade-out
---

# KMeans vs DBSCAN：形状决定算法

| 维度 | KMeans | DBSCAN |
|---|---|---|
| 簇形状 | 凸球形 | 任意形状 |
| 指定簇数 | 必须 `n_clusters` | 不需要 |
| 噪声 | 强行归簇 | 标记 -1 |
| 关键参数 | n_clusters | eps / min_samples |

> eps 极敏感：画 k-距离图找拐点；密度不均换 HDBSCAN

<!--
聚类算法选用完全由数据形状决定。DBSCAN 按密度连通成簇、自动识别噪声，但 eps 太大成一簇、太小全噪声。
-->

---
transition: fade-out
---

# PCA：线性降维主力

- SVD 找方差最大正交方向，按贡献排序
- `n_components=0.95` 保留 95% 方差（自动定分量数）
- **center 但不 scale**：量纲差异大须先 StandardScaler
- 看 `explained_variance_ratio_` 判断保留几维

> 文本 TF-IDF 用 TruncatedSVD（PCA 破坏稀疏性），即 LSA

<!--
PCA 内部只去均值、不除标准差。特征量纲差异大时大量纲特征会主导，必须先标准化。变体有 IncrementalPCA、KernelPCA、SparsePCA。
-->

---
transition: fade-out
---

# t-SNE vs UMAP：流形降维

| 维度 | t-SNE | UMAP |
|---|---|---|
| 用途 | 仅可视化 | 可视化+通用 |
| transform | 无（不能进流水线） | 有（可扩展新点） |
| 速度 | 慢 O(d·N²) | 快（百万秒级） |
| 全局结构 | 弱（保局部） | 强 |

> 生产首选 UMAP；两者都不可作为聚类依据

<!--
t-SNE 严格只用于 2D/3D 可视化，簇间距离无意义、簇大小被夸大。UMAP 既能可视化又能做聚类前置，比 t-SNE 快且保留全局拓扑。
-->

---
transition: fade-out
---

# 异常检测：IsolationForest

```python
from sklearn.ensemble import IsolationForest
iso = IsolationForest(contamination=0.05, random_state=42, n_jobs=-1)
labels = iso.fit_predict(X)         # 1=正常, -1=异常
scores = iso.decision_function(X)   # 越负越异常
```

- 路径短=异常，高维高效，工业事实标准
- 局部密度异常用 LOF（`n_neighbors=20`）

> 无需「正常样本标签」，只用隔离度/密度标记离群点

<!--
IsolationForest 随机划分隔离样本，异常点路径短易隔离，线性复杂度无高维灾难。contamination 控制异常比例阈值。
-->

---
transition: fade-out
---

# 关联规则三指标

| 指标 | 公式 | 含义 |
|---|---|---|
| support | P(X∪Y) | 规则出现频率 |
| confidence | P(Y\|X) | 买 X 也买 Y 的概率 |
| lift | P(X∪Y)/(P(X)·P(Y)) | >1 正相关 |

> lift 是关键：confidence 高但 lift≈1 的规则无意义

<!--
关联规则用 mlxtend 的 apriori + association_rules。lift 接近 1 说明独立，只保留 lift>1 的规则；低 support 阈值会爆炸式产出规则需人工筛。
-->

---
transition: fade-out
---

# 评估难：没有准确率

- 聚类用 `silhouette_score`（-1 到 1，越大越好）
- 降维看 `explained_variance_ratio_` 累加到 95%
- 异常检测靠业务复核，无客观标准
- 结果不稳定：KMeans 对初始中心敏感，多跑取优

> 无监督的本质代价：主观性强且不可证伪

<!--
没有标签就没有准确率。聚类好坏靠轮廓系数加业务可解释性，降维保真度靠方差解释率加目视检查，这是无监督最棘手的地方。
-->

---
transition: fade-out
---

# 反模式（生产坑）

- KMeans 跑高维不降维 → 距离失效，先 PCA/UMAP
- t-SNE 结果当聚类依据 → 只是可视化假象
- DBSCAN 用默认 eps → 画 k-距离图找拐点
- 不标准化就跑 KMeans/PCA → 先 StandardScaler
- 关联规则只看 confidence → 必须同时看 lift

> 记住：垃圾进垃圾出，探索性分析仍需清洗

<!--
六大反模式都源于「无监督无验证」。高维必先降维、t-SNE 只看不聚类、DBSCAN 必调 eps、距离类算法必标准化、关联规则必看 lift。
-->

---
layout: center
class: text-center
---

# 小结

无监督学习 = **无标签发现结构**的四类利器

**聚类 · 降维 · 异常检测 · 关联规则**

[scikit-learn 聚类](https://scikit-learn.org/stable/modules/clustering.html) · [UMAP 文档](https://umap-learn.readthedocs.io/)

<!--
无监督学习用 scikit-learn 的 cluster/decomposition/manifold/ensemble 模块覆盖四大任务。核心心智：先问想发现什么，再按数据形状选算法，最后接受无客观评估的现实。
-->
