---
theme: seriph
background: https://cover.sli.dev
title: 特征工程完全指南
info: |
  特征工程完全指南：数值缩放 · 类别编码 · 缺失值 · 特征选择 · feature-engine · category_encoders

  Learn more at [https://scikit-learn.org/stable/modules/preprocessing.html](https://scikit-learn.org/stable/modules/preprocessing.html)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 特征工程

把原始数据加工成模型易学的特征 · scikit-learn · feature-engine

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
特征工程决定传统 ML 模型的上限——垃圾进垃圾出。
-->

---
transition: fade-out
---

# 特征工程是什么

把原始数据加工成模型更容易学习的特征表示

- **数值特征**：缩放、分箱、变换（去偏态）
- **类别特征**：编码成数值（OneHot/Target/Hash）
- **时间特征**：拆解年月日、周期编码
- **文本特征**：TF-IDF、词嵌入
- **缺失值**：填充或作为信号
- **特征选择**：去冗余、留有效
- **特征交叉**：组合出交互效应

> 「数据和特征决定了 ML 的上限，模型和算法只是逼近这个上限。」

<!--
特征工程是传统 ML 最耗人工的环节。
-->

---

# 数值缩放选型

| Scaler | 作用 | 适用 |
|------|------|------|
| **StandardScaler** | 均值0标准差1（Z-score） | 默认首选 |
| **RobustScaler** | 用中位数+四分位距 | 有异常值 |
| **MinMaxScaler** | 缩放到 [0,1] | 要固定范围 |
| **MaxAbsScaler** | 缩放到 [-1,1] 不动零 | 稀疏数据 |

**关键判断**

- 树模型（RF/GBDT）**免缩放**（基于阈值分裂）
- KNN/SVM/SGD/神经网络**必须缩放**（基于距离/梯度）

> 稀疏数据用 MaxAbsScaler——StandardScaler 会破坏稀疏性。

<!--
缩放选型看数据分布和模型类型。
-->

---

# 偏态变换

把长尾分布压成接近正态，利于线性模型和梯度下降

| 方法 | 适用 | sklearn |
|------|------|------|
| **log1p** | 正偏态（右尾长） | np.log1p |
| **Box-Cox** | 仅正数 | PowerTransformer(method='box-cox') |
| **Yeo-Johnson** | 含 0 和负数 | PowerTransformer(method='yeo-johnson') |
| **分位数变换** | 强偏态/异常值 | QuantileTransformer |

```python
# 正偏态（收入、点击量）首选 log1p
df['income_log'] = np.log1p(df['income'])
```

> 线性模型/神经网络受益明显；树模型对单调变换不敏感。

<!--
log1p 是处理正偏态的常用招式。
-->

---

# 类别编码四类

| 编码 | 适用 | category_encoders |
|------|------|------|
| **OneHot** | 低基数（<10类） | OneHotEncoder |
| **Ordinal** | 有序类别（低/中/高） | OrdinalEncoder |
| **Target** | 高基数（邮编/ID） | TargetEncoder |
| **Hashing** | 超高基数/在线学习 | HashingEncoder |

**高基数陷阱**：OneHot 邮编（1000 类）→ 维度爆炸，应改用 TargetEncoder

**TargetEncoder 防泄漏**：必须交叉拟合（sklearn 1.3+ 内置），否则全量目标均值会泄漏

> 高基数特征用 Target/Hashing，别硬 OneHot。

<!--
类别编码选型看基数高低。
-->

---

# 缺失值处理

判断「缺失是否有信息」，而非简单填均值

| 策略 | 适用 | 工具 |
|------|------|------|
| **删除** | 缺失率 <5% 且随机 | dropna |
| **均值/中位数** | 数值随机缺失 | SimpleImputer |
| **众数** | 类别特征 | SimpleImputer(strategy='most_frequent') |
| **模型预测** | 缺失率高/有规律 | IterativeImputer / KNNImputer |
| **作为信号** | 缺失本身有意义 | 加 `is_missing` 指示列 |

**关键**：缺失常非随机（「不填收入」可能意味高收入）→ 加指示列保留信号；缺失率 >50% 考虑删除

> 简单填均值会丢失「缺失原因」这个信号。

<!--
缺失值处理要考虑「为什么缺失」。
-->

---

# 特征选择三类

| 范式 | 方法 | 原理 |
|------|------|------|
| **Filter** | SelectKBest / chi2 | 统计量打分，与模型无关 |
| **Wrapper** | RFE（递归消除） | 用模型反复评估子集 |
| **Embedded** | L1（Lasso）/ SelectFromModel | 训练时自动选（系数归零） |

```python
# Filter（快）
from sklearn.feature_selection import SelectKBest, f_classif
selector = SelectKBest(f_classif, k=10)

# Embedded（L1 自动稀疏）
from sklearn.linear_model import Lasso
model = Lasso(alpha=0.01)  # 无关特征系数归零
```

**注意**：chi2 要求特征非负（频数/计数场景）

> L1 是「训练即选特征」的优雅方案。

<!--
特征选择分三类：统计打分/包装器/嵌入式。
-->

---

# 时间特征拆解

把时间戳拆成模型易学的周期特征

```python
df['year'] = df['timestamp'].dt.year
df['month'] = df['timestamp'].dt.month
df['dayofweek'] = df['timestamp'].dt.dayofweek  # 0=周一
df['hour'] = df['timestamp'].dt.hour

# 周期编码（避免 23点 vs 0点 被当远距离）
df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
```

**周期编码的意义**

- 直接用 hour：23 点与 0 点差 23（实际只差 1 小时）
- sin/cos 编码：23 点与 0 点在单位圆上相邻

> 销量/流量预测等强周期任务必备周期编码。

<!--
周期编码让模型正确理解时间的循环性。
-->

---

# 工具对比

| 工具 | 特点 | 适用 |
|------|------|------|
| **scikit-learn preprocessing** | 内置基础变换 | 通用 |
| **feature-engine** | 按列名操作、链式 Pipeline | 复杂流水线 |
| **category_encoders** | 20+ 编码方案 | 类别编码专精 |

**feature-engine 优势**

- 按列名指定（比 sklearn 的列索引直观）
- 链式组合多个变换器
- 自动处理训练/测试集一致性

```python
from feature_engine.pipeline import Pipeline
```

> sklearn 处理基础，feature-engine/category_encoders 补强特定场景。

<!--
工具按场景选：基础用 sklearn，专精用 feature-engine。
-->

---

# 数据泄漏红线

特征工程中最隐蔽的坑

**错误做法**

```python
# 全量算 TargetEncoder 均值，再划分
encoder.fit_transform(X)  # 泄漏！
X_train, X_test = train_test_split(X)
```

**正确做法**：用 Pipeline 包裹，CV 折内 fit

```python
pipe = Pipeline([
    ('encoder', TargetEncoder()),
    ('scaler', StandardScaler()),
    ('model', RandomForestClassifier()),
])
cross_val_score(pipe, X, y, cv=5)  # 自动折内 fit
```

> 任何用到目标值（y）的变换都可能在 CV 泄漏——必须 Pipeline。

<!--
数据泄漏是特征工程的头号陷阱。
-->

---

# 特征交叉

组合多个特征捕捉交互效应

| 方法 | 适用 |
|------|------|
| **手动构造** | 领域知识（如 单价×数量=总价） |
| **PolynomialFeatures** | 自动生成组合（x1·x2, x1²） |
| **树模型自动学** | 决策树天然捕捉特征交互 |

```python
from sklearn.preprocessing import PolynomialFeatures
poly = PolynomialFeatures(degree=2, interaction_only=True)
# 生成 x1·x2 等交互项（不含 x1²）
```

> 线性模型受益最大（自身无法学交互）；树模型已内置交互能力。

<!--
特征交叉主要服务于线性模型。
-->

---

# 反模式（生产坑）

- 树模型也做 StandardScaler（无意义，基于阈值分裂）
- 高基数特征硬 OneHot（维度爆炸，应 Target/Hash）
- TargetEncoder 不交叉拟合（标签泄漏）
- 全量 fit 预处理再 CV（数据泄漏）
- 缺失值盲目填均值（丢失缺失信号）
- 时间特征不周期编码（23点与0点被当远距离）
- 稀疏数据用 StandardScaler（破坏稀疏性）

> 树模型免缩放 + 高基数用 Target + Pipeline 防泄漏 = 基本盘。

<!--
这七个反模式是生产最常见的坑。
-->

---
layout: center
class: text-center
---

# 小结

特征工程 = 把原始数据加工成模型易学的特征

**缩放 · 编码 · 缺失 · 选择 · 防泄漏**

[scikit-learn preprocessing](https://scikit-learn.org/stable/modules/preprocessing.html) · [feature-engine](https://feature-engine.trainindata.com/) · [category_encoders](https://contrib.scikit-learn.org/category_encoders/)

<!--
特征工程决定传统 ML 的上限，防泄漏是底线。
-->
