---
theme: seriph
background: https://cover.sli.dev
title: 监督学习完全指南
info: |
  监督学习（Supervised Learning）完全指南：分类与回归 · scikit-learn 17 算法族 · 过拟合 · 交叉验证 · 评估指标

  Learn more at [https://scikit-learn.org/stable/supervised_learning.html](https://scikit-learn.org/stable/supervised_learning.html)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 监督学习

带标签训练数据学映射 · scikit-learn 1.9.0 · 17 算法族

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
监督学习是机器学习最成熟范式：带标签数据学映射，预测新样本。
-->

---
transition: fade-out
---

# 什么是监督学习

带标签训练数据 `(X, y)` → 学映射 `f` → 预测新样本 `ŷ = f(x')`

- **输入**：特征矩阵 `X` + 标签向量 `y`（「监督信号」=正确答案）
- **目标**：学出从特征到标签的映射，对新输入给出预测
- **监督**：每次预测错了，用 `y` 算损失并修正模型
- **两大任务**：**分类**（y 离散类别）/ **回归**（y 连续数值）

> 对比无监督学习（无 y，发现内在结构如聚类）与强化学习（无固定标签，靠奖励试错）。

<!--
「监督」来自标签——训练数据带正确答案，算法学映射。
-->

---

# 分类 vs 回归

判据：**标签是数还是类？**

| 维度 | 分类（Classification） | 回归（Regression） |
|------|------|------|
| **标签 y** | 离散类别（垃圾/正常、猫/狗） | 连续数值（房价 350 万） |
| **输出空间** | 有限离散集合 | 实数域 |
| **决策方式** | 决策边界划分区域 | 拟合曲线/超平面 |
| **评估指标** | accuracy / precision / recall / F1 | MSE / RMSE / R² |
| **业务例子** | 垃圾邮件、疾病诊断 | 房价、销量、温度预测 |

> 有序类别（评分 1-5 星）边界模糊，看业务目标决定当回归还是分类。

<!--
分类输出类别，回归输出数值，评估指标与算法选型完全不同。
-->

---

# scikit-learn 统一 API

所有估计器遵循相同契约：`fit → predict → score`

```python
from sklearn.linear_model import LogisticRegression

clf = LogisticRegression(C=1.0, max_iter=1000)  # 实例化
clf.fit(X_train, y_train)                        # 训练
y_pred = clf.predict(X_test)                     # 预测标签
acc = clf.score(X_test, y_test)                  # 评分（accuracy）
y_proba = clf.predict_proba(X_test)              # 预测概率
```

**换算法只改 import 一行**——`fit/predict/score` 完全一致

> 这是 sklearn 「算法即换插件」的设计哲学，Pipeline / GridSearchCV 通用的前提。

<!--
统一 API 是 scikit-learn 生态繁荣的根基。
-->

---

# 训练集 vs 测试集

终极目标：**泛化**（对新数据预测准，非背熟训练数据）

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,        # 测试集占 20%
    random_state=42,      # 固定种子保复现
    stratify=y,           # 分层抽样保类别比例
)
```

- `random_state`：固定整数，实验可复现的关键
- `stratify=y`：分类任务**必设**，否则不平衡数据测试集可能缺类

> 三层划分：训练（训模型）→ 验证（调超参）→ 测试（终评一次）。测试集碰越多越不可信。

<!--
训练测试集划分是防止「自欺欺人」的第一道闸门。
-->

---

# 过拟合 vs 欠拟合

监督学习头号敌人：**过拟合**（模型记噪声非规律）

| 现象 | 训练集 | 测试集 | 应对 |
|------|------|------|------|
| **欠拟合** | 差 | 差 | 加特征 / 换强模型 / 降正则化 |
| **正好** | 好 | 好 | — |
| **过拟合** | 极好 | 差 | 加数据 / 加正则化 / 降复杂度 |

**过拟合应对**

1. 更多训练数据（最根本）
2. 正则化（L1 Lasso 稀疏 / L2 Ridge 平滑）
3. 降低模型复杂度（树剪枝 `max_depth`）
4. 交叉验证（用验证集而非测试集调参）

> 学习曲线诊断：训练/验证分数差距大=过拟合；两条线都低=欠拟合。

<!--
过拟合是监督学习头号敌人，核心应对是正则化 + 交叉验证。
-->

---
layout: two-cols
---

# 6 主力算法族

- **线性模型**：快、稳、可解释（基线首选）
- **SVM**：最大间隔 + 核技巧（非线性）
- **最近邻**：物以类聚（懒惰学习）
- **朴素贝叶斯**：贝叶斯 + 独立假设
- **决策树**：if-else 规则树（可解释）
- **集成方法**：多树聚强（**表格主力**）

::right::

# 算法选型一句话

| 场景 | 首选 |
|------|------|
| 表格打榜 | 梯度提升 |
| 线性基线 | 逻辑回归 |
| 小样本高维 | 朴素贝叶斯 |
| 强可解释 | 决策树 |
| 大数据 | LinearSVC |

> 生产打榜用 **XGBoost / LightGBM / CatBoost**

<!--
6 大主力算法族覆盖绝大多数表格数据任务，集成方法是现代表格任务事实标准。
-->

---

# 线性模型正则化三式

在损失函数加惩罚项，限制参数大小防过拟合

| 类型 | 附加项 | 效果 | 适用 |
|------|------|------|------|
| **L2（Ridge）** | `λ·Σw²` | 参数平滑防震荡 | 多重共线性 |
| **L1（Lasso）** | `λ·Σ|w|` | 系数归零，稀疏解 | 特征选择 |
| **ElasticNet** | L1 + L2 | 既稀疏又稳定 | 两者兼顾 |

```python
LogisticRegression(C=1.0, penalty='l2')  # C 是正则化强度的倒数
```

> `C` 大=正则化弱=更拟合训练集（易过拟合）；`C` 小=正则化强=更平滑。

<!--
L1 做特征选择（稀疏），L2 防震荡，C 是正则化强度的倒数。
-->

---

# 决策树与集成方法

**决策树**：CART 递归二分特征空间，可解释性最强

```python
DecisionTreeClassifier(
    criterion='gini',     # gini(默认) / entropy
    max_depth=None,       # 防过拟合首选参数
)
```

**致命弱点**：单棵深树严重过拟合 → 用集成方法

| 范式 | 代表 | 机制 | 解决 |
|------|------|------|------|
| **Bagging** | 随机森林 | 并行多树投票 | 降方差 |
| **Boosting** | 梯度提升 | 串行修残差 | 降偏差 |
| **Stacking** | 堆叠 | 元模型组合 | 融合互补 |

> sklearn 梯度提升是基线，**真打榜用 XGBoost / LightGBM**（Kaggle 常胜将军）。

<!--
单棵决策树易过拟合，集成方法是表格任务的事实标准。
-->

---
layout: two-cols
---

# 分类评估指标

混淆矩阵是基础：

```text
              预测正  预测负
实际正    TP     FN
实际负    FP     TN
```

- **accuracy** = 正确数/总数（平衡数据）
- **precision** = TP/(TP+FP)
- **recall** = TP/(TP+FN)
- **F1** = 调和平均（不平衡必看）

::right::

# 业务对齐

**先问漏报误报哪个代价高**

- 疾病筛查重 **recall**
  （宁误报不漏诊）
- 垃圾邮件重 **precision**
  （宁放过不误杀）

> 不平衡数据**禁用 accuracy**——99% 负样本全猜负也有 99% 准确率。用 `class_weight='balanced'` 或 SMOTE。

<!--
评估指标选择强依赖业务：漏报 vs 误报哪个代价高。
-->

---

# 回归评估指标

| 指标 | 公式 | 特点 |
|------|------|------|
| **MSE** | `mean((y-ŷ)²)` | 对大误差敏感，单位是 y² |
| **RMSE** | `sqrt(MSE)` | 与 y 同单位，最直观 |
| **MAE** | `mean(|y-ŷ|)` | 对异常值鲁棒 |
| **R²** | `1 - SS_res/SS_tot` | 方差解释率，越接近 1 越好 |

**R² 解读**

- R² = 1：完美拟合
- R² = 0：和直接用均值预测一样
- R² < 0：比均值预测还差（模型有问题）

> 回归首选看 RMSE（直观）+ R²（拟合优度）组合。

<!--
MSE 对大误差敏感，R² 衡量方差解释率，越接近 1 越好。
-->

---

# 交叉验证

单次划分方差大，多折平均更稳健

```python
from sklearn.model_selection import StratifiedKFold, cross_val_score

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(clf, X, y, cv=skf, scoring='f1_macro')
print(f"F1: {scores.mean():.3f} ± {scores.std():.3f}")
```

- **KFold**：通用（回归）
- **StratifiedKFold**：分类**必用**——保每折类别比例
- **GridSearchCV**：内置 CV 调超参

> 普通划分可能让某折完全没有少数类，分层 K 折保证比例一致。

<!--
交叉验证用多折平均降低评估方差，分类必须用分层 K 折。
-->

---
layout: quote
---

# 数据泄漏是隐蔽杀手

「标准化、特征选择、降维必须在 CV 折内做——用 Pipeline 包裹。先全量 fit 再 CV，测试折信息泄漏进标准化参数，评估虚高。」

---

# 数据泄漏红线

**错误做法**

```python
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)          # 全量 fit，泄漏！
cross_val_score(clf, X_scaled, y, cv=5)     # 评估虚高
```

**正确做法**：用 Pipeline 包裹，标准化在每折 CV 内做

```python
from sklearn.pipeline import Pipeline
pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('svm', SVC()),
])
cross_val_score(pipe, X, y, cv=5)  # Pipeline 自动在折内 fit
```

> 同理：特征选择、降维（PCA）都必须在 Pipeline 内，否则都会泄漏。

<!--
数据泄漏是最隐蔽的评估虚高来源，Pipeline 是标准解法。
-->

---
layout: center
class: text-center
---

# 小结

监督学习 = 带标签数据学映射，预测新样本

**分类 vs 回归 · 6 算法族 · 过拟合克星正则化 · 数据泄漏红线**

[scikit-learn 监督学习](https://scikit-learn.org/stable/supervised_learning.html) · [模型选择](https://scikit-learn.org/stable/modules/cross_validation.html) · [评估指标](https://scikit-learn.org/stable/modules/model_evaluation.html)

<!--
监督学习四件事：数据质量、特征工程、防过拟合、合理评估。
-->
