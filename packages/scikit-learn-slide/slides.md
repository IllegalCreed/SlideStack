---
theme: seriph
background: https://cover.sli.dev
title: scikit-learn 完全指南
info: |
  scikit-learn 完全指南：Estimator API · Pipeline/ColumnTransformer · GridSearch · HistGradientBoosting · 概率校准

  Learn more at https://scikit-learn.org/
drawings:
  persist: false
transition: slide-left
mdc: true
---

## scikit-learn

统一 Estimator API · Pipeline 工程化 · 传统机器学习算法集（基于 scikit-learn 1.9.0）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
sklearn 的灵魂是接口一致性：所有模型 fit/predict/transform/score 同构。
-->

---
transition: fade-out
---

# scikit-learn 是什么

基于 NumPy/SciPy 的传统机器学习库：

- **统一 Estimator API**：分类 / 回归 / 聚类 / 变换器同构契约
- **Pipeline + ColumnTransformer**：串联预处理→模型，防数据泄漏
- **超参搜索**：GridSearchCV / RandomizedSearchCV / HalvingSearchCV
- **ensemble**：RandomForest、GradientBoosting、HistGradientBoosting

```python
from sklearn.linear_model import LogisticRegression
clf = LogisticRegression(C=1.0)      # 超参构造时传入
clf.fit(X_train, y_train)             # 学习
clf.score(X_test, y_test)             # 默认返回 accuracy
```

> 稳定版 **1.9.0**（2026-06），Python ≥ 3.9，纯 CPU。

<!--
sklearn 不做深度学习；GPU 要 cuML/RAPIDS。
-->

---
transition: fade-out
---

# 安装

```bash
pip install scikit-learn          # 含 NumPy/SciPy/joblib 依赖
pip install -U scikit-learn       # 升级到 1.9.0
pip install scikit-learn pandas matplotlib seaborn   # 推荐配套
```

- 依赖：NumPy ≥ 1.22、SciPy ≥ 1.8、joblib、threadpoolctl
- **不自带 GPU**：要 GPU 加速用 [RAPIDS cuML](https://docs.rapids.ai/api/cuml/stable/)
- DataFrame 列名场景推荐 pandas；绘图推荐 matplotlib/seaborn

> 单机内存瓶颈：超大数据靠 `partial_fit` 增量或转 Spark/Dask。

<!--
sklearn 是 Python 数据栈（pandas + NumPy + sklearn）的事实标准。
-->

---
transition: fade-out
---

# Estimator API 契约

| 方法 | 对象 | 作用 |
| --- | --- | --- |
| `fit(X, y)` | 所有估计器 | 学习参数（权重/均值/聚类中心） |
| `predict(X)` | 分类 / 回归 | 预测标签或数值 |
| `transform(X)` | 变换器 | 按学到的规则变换特征 |
| `fit_transform` | 变换器 | fit 后立即 transform（常有优化） |
| `score(X, y)` | 分类 / 回归 | 分类=acc，回归=R² |
| `get/set_params` | 所有估计器 | 读改超参（网格搜索基础） |

- 学习参数以下划线结尾：`.coef_`、`.classes_`、`.center_`
- 实例化只存超参，真参数在 `fit` 后才出现

<!--
set_params 是 GridSearchCV 切换超参的底层机制。
-->

---
transition: fade-out
---

# 第一个流程：Pipeline

把「标准化 → 训练」串成一个对象，**防 CV 时验证集泄漏**：

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('svc', SVC(C=1.0, kernel='rbf')),
])
pipe.fit(X_train, y_train)
pipe.predict(X_test)          # scaler.transform → svc.predict
cross_val_score(pipe, X, y, cv=5)   # 每折独立 fit/transform
```

- `make_pipeline(...)` 简写（名字由类名小写生成）
- 显式命名更可读，且能跨层网格搜索寻址

<!--
Pipeline 方法自动级联：fit=每步 fit_transform + 末步 fit。
-->

---
transition: fade-out
---

# ColumnTransformer：混合列预处理

数值列 + 类别列差异化变换，最后水平拼接：

```python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer

pre = ColumnTransformer([
    ('num', Pipeline([
        ('imp', SimpleImputer(strategy='median')),
        ('sc', StandardScaler())]), ['age', 'income']),
    ('cat', OneHotEncoder(handle_unknown='ignore'), ['city']),
], remainder='drop')          # 'passthrough' 原样保留
```

- 列选择：列名 / 索引 / 布尔掩码 / `make_column_selector`
- **高频坑**：OneHot 期望 2D（传列表）；文本向量化器期望 1D（传字符串）

<!--
make_column_selector(dtype_include=np.number) 按 dtype 自动选列。
-->

---
transition: fade-out
---

# 超参搜索：GridSearchCV

```python
from sklearn.model_selection import GridSearchCV

param_grid = {
    'svc__C': [0.1, 1, 10],          # svc__ 前缀跨 Pipeline 寻址
    'svc__kernel': ['rbf', 'linear'],
}
grid = GridSearchCV(pipe, param_grid, cv=5,
                    scoring='accuracy', n_jobs=-1)
grid.fit(X_train, y_train)
best = grid.best_estimator_          # refit=True 在全集重训
y_pred = best.predict(X_test)
```

- `step__param` 双下划线穿透任意层 Pipeline 嵌套
- `n_jobs=-1` 并行全部 CPU 核
- 大空间改 `RandomizedSearchCV`（用 scipy 分布采样）

<!--
GridSearch 穷举笛卡尔积；RandomizedSearch 适合连续超参。
-->

---
transition: fade-out
---

# Pipeline 进阶

```python
from sklearn.preprocessing import FunctionTransformer
from joblib import Memory

# 自定义函数变变换器，融入 Pipeline（可进 GridSearch）
log_t = FunctionTransformer(np.log1p, feature_names_out='one-to-one')

# 缓存中间结果（反复 GridSearch 时省大量时间）
pipe = Pipeline([...], memory=Memory(location=cachedir))
```

- **FeatureUnion**：多变换器并行跑，输出**横向拼接**（特征更宽）
- 嵌套寻址：`{'prep__num__scaler__with_mean': [True, False]}`
- `feature_names_out='one-to-one'` 保留原列名（pandas 输出）

<!--
Pipeline 纵向串联；FeatureUnion 横向拼接，二者可叠加。
-->

---
transition: fade-out
---

# HistGradientBoosting

受 LightGBM 启发，**比原版快约 10×**，原生支持缺失与类别：

```python
from sklearn.ensemble import HistGradientBoostingClassifier

clf = HistGradientBoostingClassifier(
    max_iter=300, learning_rate=0.1,
    max_leaf_nodes=31, min_samples_leaf=20,
    categorical_features=[0, 3],   # 原生类别，无需 OneHot
    early_stopping=True,           # 自动验证子集提前停
)
```

- 原生 **NaN**：自动学缺失值走哪个分支，无需 imputer
- `n_samples >= 10k` 优势最明显
- 生产结构化数据首选；极致工程化再考虑 LightGBM/XGBoost

<!--
原版 GradientBoosting 需手动处理缺失值、手动 OneHot。
-->

---
transition: fade-out
---

# 概率校准

SVM/RandomForest 的 `predict_proba` 只是相对置信度，非真概率：

```python
from sklearn.calibration import CalibratedClassifierCV
from sklearn.svm import LinearSVC

calibrated = CalibratedClassifierCV(
    LinearSVC(), method='sigmoid', cv=5)   # Platt scaling
calibrated.fit(X_train, y_train)
calibrated.predict_proba(X_test)           # 现在是可信概率
```

| method | 原理 | 适用 |
| --- | --- | --- |
| `'sigmoid'` | Platt scaling | 小样本、保序单调 |
| `'isotonic'` | 保序回归（非参） | 任意失真，**需 >1000** |
| `'temperature'` | softmax 温度 | 多分类、深度网络 |

> `ensemble=True`（默认）交叉训练 k 对取平均，更稳更慢。

<!--
CalibrationDisplay.from_estimator 画可靠性图诊断。
-->

---
transition: fade-out
---

# HalvingGridSearchCV

successive halving「锦标赛」搜索，比 GridSearch 快得多：

```python
from sklearn.experimental import enable_halving_search_cv  # noqa
from sklearn.model_selection import HalvingGridSearchCV

search = HalvingGridSearchCV(
    pipe, {'clf__C': [0.1, 1, 10, 100]},
    factor=3, cv=5, n_jobs=-1,
).fit(X_train, y_train)
```

- 第一轮少量资源评估全部候选，每轮淘汰差、加资源
- `factor`（>1）：资源增长与淘汰比率
- `resource`：默认 `'n_samples'`，可换 `n_estimators`
- **仍实验性**：需显式 enable，API 可能变

<!--
同族 HalvingRandomizedSearchCV 从分布采样候选。
-->

---
transition: fade-out
---

# 自定义估计器

继承 `BaseEstimator` + Mixin 即成 Pipeline / GridSearch 一等公民：

```python
from sklearn.base import BaseEstimator, TransformerMixin

class DebugTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, verbose=False):
        self.verbose = verbose     # 超参必须 __init__ 原样存储

    def fit(self, X, y=None):
        return self                # 校验放这里

    def transform(self, X):
        return X
```

- `__init__` 只做 `self.param = param`，校验放 `fit`
- 变换器实现 `fit + transform`；预测器 `fit + predict`
- joblib 序列化兼容，可进 Pipeline 与 GridSearch

<!--
_imbalanced-learn_ 的 Pipeline 兼容 sklearn 且支持 SMOTE 采样。
-->

---
transition: fade-out
---

# 保存与加载

```python
import joblib

joblib.dump(best_model, 'model.joblib')   # 序列化整个 Pipeline
model = joblib.load('model.joblib')       # 反序列化
model.predict(new_data)
```

- 序列化绑定 **Python / sklearn 版本**
- 跨大版本不保证 pickle 兼容——生产锁 `scikit-learn==1.9.0`
- 整个 Pipeline（含 ColumnTransformer）一次性落盘

<!--
新版本可能改参数默认值或内部结构，老 joblib 文件未必能读。
-->

---
transition: fade-out
---

# 版本速览

| 版本 | 关键变化 |
| --- | --- |
| 1.0 | API 稳定声明；`feature_names_in_` |
| 1.2 | metadata_routing 引入 |
| 1.4 | `TargetEncoder`；Array API 后端实验 |
| 1.6 | 元数据路由增强 |
| 1.9 | 当前稳定版（2026-06） |

- 依赖：NumPy ≥ 1.22、SciPy ≥ 1.8
- 互操作：imbalanced-learn / category-encoders / scikit-optimize / cuML

<!--
开发版 1.10；HalvingSearchCV 仍需 experimental 显式开启。
-->

---
transition: fade-out
---

# 常见坑

- **Pipeline 外单独 fit 变换器** → CV 时验证集统计量泄漏进训练
- **OneHot 传 1D / 文本向量化器传 2D** → 报维度错误
- **shuffle(100)** 对百万级数据 ≈ 没打乱，buffer 给足
- **跨大版本 joblib 加载** → 可能不兼容，锁版本
- **类别编码忘 `handle_unknown='ignore'`** → 新类别线上直接炸
- **predict_proba 当真概率** → SVM/RF 需 CalibratedClassifierCV 校准

<!--
TargetEncoder（1.4+）可在 Pipeline 内直接做目标编码。
-->

---
transition: fade-out
---

# 速查表

| 主题 | 一行 |
| --- | --- |
| 契约 | `Estimator(param=) → fit → predict/score` |
| 流水线 | `Pipeline([(name, step), ...])` |
| 列变换 | `ColumnTransformer([(name, est, cols)])` |
| 寻址 | `step__param`（双下划线穿透嵌套） |
| 搜索 | `GridSearchCV / RandomizedSearchCV` |
| 梯度提升 | `HistGradientBoostingClassifier` |
| 持久化 | `joblib.dump / load` |

<!--
完整内容见笔记站 scikit-learn 章节。
-->

---

## 谢谢观看

scikit-learn · Estimator API / Pipeline / ColumnTransformer / GridSearch / HistGB

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
