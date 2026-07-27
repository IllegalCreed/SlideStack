---
theme: seriph
background: https://cover.sli.dev
title: 集成学习与树模型完全指南
info: |
  集成学习与树模型完全指南：CART · Bagging · Boosting · 随机森林 · XGBoost · LightGBM · CatBoost

  Learn more at [https://scikit-learn.org/stable/modules/ensemble.html](https://scikit-learn.org/stable/modules/ensemble.html)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 集成学习与树模型

组合多个弱学习器成强模型 · scikit-learn · XGBoost · LightGBM

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
集成学习是表格数据任务的事实标准。
-->

---
transition: fade-out
---

# 偏差-方差分解

泛化误差 = 偏差² + 方差 + 噪声

| 误差来源 | 含义 | 应对 |
|------|------|------|
| **偏差（Bias）** | 模型预测的期望与真值的差距 | 换更强模型（Boosting） |
| **方差（Variance）** | 不同训练集训出的模型差异 | 集成平均（Bagging） |
| **噪声** | 数据本身的不可约误差 | 无法消除 |

**两大主线**

- **Bagging**：并行采样平均，**降方差**（随机森林）
- **Boosting**：串行修错误，**降偏差**（GBDT）

> 单棵决策树高方差低偏差 → 用 Bagging 降方差。

<!--
偏差方差分解是理解集成学习为何有效的基础。
-->

---

# CART 决策树

递归二分特征空间，形成 if-else 规则树

| 任务 | 分裂准则 | sklearn |
|------|------|------|
| 分类 | gini（默认）/ entropy | DecisionTreeClassifier |
| 回归 | squared_error | DecisionTreeRegressor |

**关键参数**

- `max_depth`：树最大深度（防过拟合首选）
- `min_samples_split`：节点分裂最小样本数
- `min_samples_leaf`：叶节点最小样本数

**致命弱点**：单棵深树过拟合（训练集 100% 准确）

> 单棵树几乎不用，实际都用它的集成版。

<!--
CART 是所有树模型集成的基础构件。
-->

---
layout: two-cols
---

# Bagging 与随机森林

**Bootstrap Aggregating**

- 有放回采样生成多份训练集
- 每份训一棵树，投票/平均
- **降方差**，不易过拟合

**随机森林额外随机**

- `max_features` 每分裂只选特征子集
- 进一步降低树间相关性

**OOB 评估**

- Bootstrap 没采到的样本（~37%）
- 天然验证集，免额外划分

::right::

# 随机森林要点

```python
from sklearn.ensemble import RandomForestClassifier

clf = RandomForestClassifier(
    n_estimators=100,
    max_features='sqrt',
    oob_score=True,
    n_jobs=-1,
)
```

- 并行训练（快）
- 准确率有上限
- 特征重要性可读

> OOB 评估是 Bagging 的「免费午餐」。

<!--
随机森林是入门表格任务的首选基线。
-->

---
layout: two-cols
---

# Boosting 与 GBDT

**核心思想**：串行训树，每棵拟合前一棵的**负梯度**

```python
from sklearn.ensemble import GradientBoostingClassifier

clf = GradientBoostingClassifier(
    n_estimators=100,
    learning_rate=0.1,   # shrinkage
    max_depth=3,
)
```

- `learning_rate` 与 `n_estimators` **此消彼长**
- 小学习率 + 多树 = 更稳更准

::right::

# AdaBoost（Boosting 始祖）

- 样本加权：错分样本权重↑
- 弱学习器加权投票
- sklearn 1.6 起用 SAMME.R

**Boosting vs Bagging**

| | Bagging | Boosting |
|------|------|------|
| 训练 | 并行 | 串行 |
| 目标 | 降方差 | 降偏差 |
| 过拟合 | 不易 | 易（需早停） |

<!--
GBDT 串行拟合残差，是现代 Boosting 的核心。
-->

---

# 现代 Boosting 三巨头

| 框架 | 核心创新 | 优势 |
|------|------|------|
| **XGBoost** | 二阶泰勒展开 + gamma 剪枝 + 正则化 | 精度高、工业标杆 |
| **LightGBM** | 直方图加速 + leaf-wise 生长 | 训练快、内存省 |
| **CatBoost** | Ordered Boosting + 对称树 | 类别特征原生支持 |

**XGBoost 核心**

- 二阶泰勒展开（一阶+二阶导数）
- `gamma`：分裂最小增益阈值（剪枝）
- `scale_pos_weight`：处理类别不平衡

> 三者是 Kaggle 表格赛常胜将军，下页详解 LightGBM 加速。

<!--
XGBoost/LightGBM/CatBoost 是表格打榜三巨头。
-->

---

# LightGBM 为何快

两大加速技术

**直方图算法**：连续特征分桶（如 255 bins），分裂搜索从 O(样本数) 降到 O(桶数)

**Leaf-wise 生长**：选增益最大叶分裂（vs 随机森林的 level-wise 按层生长），更优但易过拟合

| 算法 | 分裂搜索 | 生长策略 |
|------|------|------|
| 随机森林/XGBoost | 预排序 O(n) | level-wise |
| **LightGBM** | 直方图 | leaf-wise |

> Leaf-wise 需配合 `num_leaves` 限制防止过拟合。

<!--
直方图 + leaf-wise 让 LightGBM 显著快于 XGBoost。
-->

---

# CatBoost 的独特价值

类别特征的原生处理，免 OneHot

**Ordered Boosting**：每棵树只用「之前」的样本算统计量，防类别编码泄漏

**对称树**：同层节点用相同分裂条件，推理快 + 正则化

**类别特征原生支持**：免 OneHot（高基数友好）+ 自动 Target Encoding

> 类别特征多（用户ID/商品ID）的场景 CatBoost 占优。

<!--
CatBoost 对类别特征的处理是独门绝技。
-->

---

# Stacking（堆叠）

训练多个异质模型，再用元模型学如何组合

```text
基模型 1（SVM）──┐
基模型 2（RF）──┤→ 元模型（逻辑回归）→ 最终预测
基模型 3（XGB）─┘
```

- 基模型需**异质**（互补），同质则收益小
- 元模型用基模型**交叉验证预测**训练（防泄漏）
- sklearn `StackingClassifier` / `StackingRegressor`

> Stacking 是 Kaggle 冲冠常用招式（vs Bagging 降方差/Boosting 降偏差）。

<!--
Stacking 融合异质模型，常用于比赛冲分。
-->

---
layout: quote
---

# 树模型免标准化

「决策树基于阈值分裂而非距离，对特征量纲不敏感——随机森林/GBDT 无需 StandardScaler。但 KNN/SVM/神经网络必须标准化，否则大量纲特征淹没小量纲特征。」

---

# 特征重要性三件套

| 方法 | 原理 | 局限 |
|------|------|------|
| **MDI**（mean decrease impurity） | 分裂带来的 gini/entropy 减少 | 偏向高基数特征 |
| **MDA**（permutation） | 打乱特征后性能下降多少 | 相关特征会分摊 |
| **SHAP** | 博弈论 Shapley 值 | 计算贵但最公平 |

```python
# MDI（树模型自带）
clf.feature_importances_

# SHAP（最推荐）
import shap
shap_values = shap.TreeExplainer(clf).shap_values(X)
```

> SHAP 是现代可解释 AI 的事实标准，公平且可可视化。

<!--
SHAP 是特征重要性最公平的方法。
-->

---
layout: center
class: text-center
---

# 小结

集成学习 = 组合弱学习器成强模型

**偏差方差 · Bagging/Boosting/Stacking · 树模型免缩放 · 三巨头**

[scikit-learn ensemble](https://scikit-learn.org/stable/modules/ensemble.html) · [XGBoost](https://xgboost.readthedocs.io/) · [LightGBM](https://lightgbm.readthedocs.io/)

<!--
集成学习是表格数据任务的事实标准，三巨头是打榜主力。
-->
