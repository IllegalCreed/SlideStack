---
theme: seriph
background: https://cover.sli.dev
title: AutoML 完全指南
info: |
  AutoML 完全指南：超参调优 · 端到端 AutoML · 模型集成 · NAS

  Learn more at https://automl.github.io/auto-sklearn/master/
drawings:
  persist: false
transition: slide-left
mdc: true
---

## AutoML

把 ML 流程的人工经验环节自动化 · Optuna · Auto-sklearn · H2O · NAS

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
AutoML 自动化 ML 流程中需要人工经验的环节——超参调优、特征工程、模型选择、模型集成，让非专家能用、专家更高效。核心权衡是自动化便利 vs 黑盒可控性。
-->

---
transition: fade-out
---

# AutoML 是什么

- 把传统 ML 流水线的人工环节自动化
- **四大环节**：超参调优 / 特征工程 / 模型选择 / 模型集成
- 不是「替代数据科学家」，而是解放重复调参
- 让专家聚焦业务理解和高级建模

> 统一心智：AutoML ≠ 免数据清洗，垃圾进垃圾出

<!--
典型 ML 流水线：清洗 → 特征工程 → 算法选择 → 超参调优 → 集成 → 部署，后四步高度依赖人工经验，是 AutoML 主战场。
-->

---
transition: fade-out
---

# 三档自动化

| 档次 | 代表 | 自动化范围 |
|---|---|---|
| 超参调优库 | Optuna/Hyperopt | 仅超参搜索 |
| 端到端 AutoML | Auto-sklearn/H2O/FLAML | 算法+超参+集成 |
| NAS（架构搜索） | AutoKeras/Google AutoML | 连网络结构都搜 |

> 档次越高自动化越深，但计算成本指数级上升

<!--
超参调优库需手写训练代码；端到端 AutoML 一行 fit 出模型；NAS 连神经网络架构都自动搜索。成本：Optuna 几小时、AutoML 几小时到一天、NAS 数百 GPU-天。
-->

---
transition: fade-out
---

# FLAML：5 行入门

```python
from flaml import AutoML
automl = AutoML()
automl.fit(X_train, y_train,
           time_budget=60, task='classification')
print(automl.best_estimator)   # 选中的算法
print(automl.best_config)      # 最佳超参
```

> FLAML 入门最友好：API 简洁、速度快、微软维护

<!--
FLAML 默认集成 LightGBM/XGBoost/catboost/random_forest。time_budget 控制时间预算，task 选分类/回归/时序/排序。
-->

---
transition: fade-out
---

# Auto-sklearn：sklearn drop-in

三件套核心技术：

- **贝叶斯优化**：高效搜索超参空间
- **元学习**：相似数据集初始化，跳过冷启动
- **集成构造**：bagging 多模型降过拟合

> 局限：依赖 SWIG，Windows 支持差，聚焦表格数据

<!--
Auto-sklearn 把 sklearn 的 17 算法族全自动化。2.0 版本的「Hands-free AutoML」论文核心是元学习进一步降低调参需求。time_left_for_this_task 控制总预算。
-->

---
transition: fade-out
---

# TPOT：遗传编程导出 Python

```python
from tpot import TPOTClassifier
tpot = TPOTClassifier(generations=100, population_size=100,
                      cv=5, scoring='accuracy', random_state=42)
tpot.fit(X_train, y_train)
tpot.export('best_pipeline.py')   # 导出 sklearn 代码
```

> 杀手锏：export 导出可复现代码，告别黑盒

<!--
TPOT 把整个流水线（预处理→特征选择→模型→超参）编码为「基因」用遗传算法进化。config_dict 有 'TPOT light'(快)/'TPOT MDR'/'TPOT sparse' 预设。generations=100 常需数小时。
-->

---
transition: fade-out
---

# H2O AutoML：企业级集成

- 覆盖 GBM/XGBoost/DRF/GLM/DeepLearning
- **自动 Stacked Ensemble**（All Models + Best of Family）
- 元学习器用正则 GLM 防堆叠过拟合
- leader 通常是 Stacked Ensemble 而非单模型

> 常比单模型强 1-3 个百分点，分布式支持 Spark

<!--
H2O leaderboard 排序指标按问题自动选：二分类 AUC、多分类 logloss、回归 RMSE。优势是生产部署成熟（POJO/MOJO 导出），局限是需启动独立 H2O 集群、数据转 H2OFrame。
-->

---
transition: fade-out
---

# Optuna：Define-by-Run 调参

```python
def objective(trial):
    lr = trial.suggest_float('lr', 1e-5, 1e-1, log=True)
    opt = trial.suggest_categorical('opt', ['adam', 'sgd'])
    return train_and_eval(build_model(lr, opt))
study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=100)
```

> 搜索空间在 objective 内动态构造，灵活度最高

<!--
Optuna 不端到端，是纯超参优化框架。核心概念 Study/Trial/Objective。与任意框架（PyTorch/TF/sklearn）集成，可视化 dashboard 优秀。比 GridSearchCV 高效且支持条件参数。
-->

---
transition: fade-out
---

# Optuna Sampler 与 Pruner

| Sampler | 机制 | 适用 |
|---|---|---|
| TPESampler（默认） | 树结构 Parzen | 通用 |
| CMAESampler | 协方差自适应 | 连续空间 |
| GridSampler | 穷举网格 | 离散小空间 |

- Pruner：MedianPruner / HyperbandPruner 提前终止无望 trial
- 不用 prune 会浪费大量算力在差 trial 上

> TPE 贝叶斯优化比网格搜索高效得多

<!--
Samplers 决定下一组超参怎么选，Pruners 提前终止差 trial。两者配合是 Optuna 高效的关键。默认 TPESampler + MedianPruner 覆盖大多数场景。
-->

---
transition: fade-out
---

# NAS：神经架构搜索

三大方法搜索网络结构：

- **强化学习**（NASNet）：Controller RNN，1800 GPU-天
- **进化算法**（AmoebaNet）：种群变异选择，数百 GPU-天
- **梯度**（DARTS）：连续参数化可微，1-4 GPU-天
- 产出 EfficientNet 等 SOTA 架构

> 表格数据用 NAS 是过度（树模型已够强），NAS 主战场是图像/NLP

<!--
DARTS 把成本降到 GPU-天级使 NAS 民主化。EfficientNet 系统化缩放（depth/width/resolution 平衡）广泛用作 backbone。NAS 核心限制是算力，只有大厂能负担。
-->

---
transition: fade-out
---

# 选型一句话

- 写训练代码只调参 → **Optuna**
- sklearn 端到端 → **Auto-sklearn**
- 要导出 Python 代码 → **TPOT**
- 企业级分布式+集成 → **H2O AutoML**
- 快速低成本 → **FLAML**
- 零代码云 → **Google AutoML/Vertex AI**

> AutoML 适合快速基线，不适合 Kaggle 打榜

<!--
自动化很难超过资深专家精调水平，Kaggle 顶级方案仍是人工设计。AutoML 最大价值是几分钟出首个合理模型，省去 80% 重复劳动。
-->

---
transition: fade-out
---

# 反模式（生产坑）

- 用 AutoML 跳过数据清洗 → 先 EDA + 清洗再喂
- NAS 用于表格数据 → 用 Auto-sklearn/H2O/FLAML
- 盲目信任 leaderboard 第一 → 留独立测试集终评
- Optuna 不用 prune → 配 MedianPruner/Hyperband
- H2O 不设 max_models → 结果不可复现

> 黑盒难解释：业务审计和合规场景慎用

<!--
AutoML 对数据质量敏感，不会自动修复缺失/异常/标签错误。leaderboard 第一名可能是验证集过拟合，必须留独立测试集做最终评估。H2O 官方建议设 max_models 保证可复现。
-->

---
layout: center
class: text-center
---

# 小结

AutoML = **自动化 ML 人工环节**的效率倍增器

**超参调优 · 模型选择 · 模型集成 · NAS**

[Optuna 文档](https://optuna.readthedocs.io/en/stable/) · [H2O AutoML](https://docs.h2o.ai/h2o/latest-stable/h2o-docs/automl.html)

<!--
AutoML 按深度分三档：超参调优库（Optuna）、端到端 AutoML（Auto-sklearn/H2O/FLAML）、NAS（AutoKeras）。核心权衡自动化便利 vs 黑盒可控——适合快速基线/提速/自助，不适合打榜/合规/深度调优。
-->
