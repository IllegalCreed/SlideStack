---
theme: seriph
background: https://cover.sli.dev
title: MLflow 完全指南
info: |
  MLflow 完全指南：Tracking · autolog · Models · Model Registry · Projects · Deployments · GenAI 评测

  Learn more at [https://mlflow.org](https://mlflow.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## MLflow

ML/AI 生命周期管理平台 · 框架无关 · 3.14.0

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
MLflow 围绕「实验可复现、模型可治理、部署可落地」提供组件化工具。
-->

---
transition: fade-out
---

# MLflow 是什么

Databricks 主导、Apache 2.0 开源的 ML/AI 生命周期平台

- **框架无关**：sklearn/PyTorch/TF/XGBoost/LightGBM/ONNX/Spark 都有 flavor + autolog
- **组件齐全**：Tracking + Models + Registry + Projects + Deployments + Evaluate 一条龙
- **autolog 极快**：`mlflow.autolog()` 一行，param/metric/model 自动落盘
- **pyfunc 解耦部署**：任何模型统一 `predict()`，下游不必懂每个框架
- **3.x GenAI 友好**：`mlflow.genai` 评测 LLM/Agent、Tracing、Prompt 管理

> 稳定版 **3.14.0**（2026-06-17），Python ≥ 3.9

<!--
核心卖点是组件齐全 + autolog + pyfunc。
-->

---

# 八大组件

| 组件 | 职责 |
|------|------|
| **Tracking** | 记录参数/指标/产物（实验可复现） |
| **Models** | 标准化模型打包格式（flavor） |
| **Model Registry** | 中央模型仓库（版本+阶段+标签） |
| **Projects** | 可复现运行的可打包格式 |
| **Recipes** | 结构化可复用流水线（原 Pipelines） |
| **Deployments** | 统一推理服务 + LLM 网关 |
| **Evaluate** | 模型与 LLM/Agent 评测框架 |

> Tracking 数据模型：**experiment → run → param / metric / artifact**

<!--
八个组件覆盖从实验到上线的全生命周期。
-->

---
layout: two-cols
---

# Tracking：autolog 三行

```python
import mlflow
import mlflow.sklearn

mlflow.autolog()              # ① 一行开启

with mlflow.start_run(run_name="rf-iris"):
    clf = RandomForestClassifier()
    clf.fit(X_tr, y_tr)        # ② fit 触发
    # ③ param/metric/model 全落盘
```

支持：PyTorch / sklearn / XGBoost / TF / LightGBM / PySpark / Keras

::right::

# 手动记录：精控

```python
with mlflow.start_run(run_name="manual"):
    mlflow.log_param("lr", 0.01)
    mlflow.log_params({"bs": 64})
    for step in range(100):
        mlflow.log_metric("loss", l, step=step)
    mlflow.log_artifact("cm.png")
    mlflow.sklearn.log_model(clf, "model")
```

> **param** 一次性配置；**metric** 可时序；**artifact** 任意文件

<!--
autolog 抓不到的自定义内容用手动 API。
-->

---

# Models 与 Flavor

标准目录结构（`MLmodel` 元数据 + 权重 + 依赖），由 flavor 描述如何加载

```python
# 记录（带 pyfunc 基础 flavor）
mlflow.sklearn.log_model(clf, "model")

# 用具体 flavor 加载（保留原生对象）
clf = mlflow.sklearn.load_model("runs:/<id>/model")

# 用通用 pyfunc 加载（统一 predict）
m = mlflow.pyfunc.load_model("runs:/<id>/model")
preds = m.predict(X_te)
```

**`python_function`（pyfunc）是所有 Python 模型的基础 flavor**——框架 flavor（sklearn/pytorch/tensorflow...）在其上叠加，记录时自动带上。下游部署只需懂 pyfunc 一个接口。

<!--
pyfunc 让「一次打包、多下游通用」。
-->

---

# 自定义 pyfunc：封装推理管线

把「预处理 + 模型 + 后处理」封装成一个可部署单元

```python
import mlflow.pyfunc

class Bundle(mlflow.pyfunc.PythonModel):
    def load_context(self, context):
        self.model = mlflow.pyfunc.load_model(self.uri)
    def predict(self, context, model_input, params=None):
        tokens = self.tokenize(model_input)
        raw = self.model.predict(tokens)
        return self.postprocess(raw)

mlflow.pyfunc.log_model(
    artifact_path="bundle",
    python_model=Bundle(...),
)
```

> 下游部署只调一次 `predict`，不暴露内部多模型结构

<!--
自定义 pyfunc 封装完整推理管线。
-->

---
layout: two-cols
---

# Model Registry 治理

```python
from mlflow.tracking import MlflowClient
client = MlflowClient()

# 注册新版本（version 自增）
mv = mlflow.register_model(
    "runs:/<id>/model", "IrisClf")

# Alias（3.x 推荐，灵活）
client.set_registered_model_alias(
    "IrisClf", "champion", version=3)
client.set_registered_model_alias(
    "IrisClf", "challenger", version=4)
```

::right::

# Stage vs Alias

**Stage**（互斥枚举）：None / Staging / Production / Archived

**Alias**（任意键值）：champion / challenger / canary 并行

| URI | 含义 |
|------|------|
| `models:/Name/Production` | 某 stage 最新版 |
| `models:/Name@v3` | 指定版本号 |
| `models:/Name@champion` | 指定 alias |

> 金丝雀/AB/灰度场景用 alias 更合适

<!--
3.x 推荐 alias，更适合多版本并行。
-->

---

# Projects：可复现运行

`MLproject` 文件定义入口与环境（conda/docker）

```yaml
name: my-project
conda_env: conda.yaml
entry_points:
  train:
    parameters:
      lr: {type: float, default: 0.01}
      epochs: {type: int, default: 10}
    command: "python train.py --lr {lr}"
```

```bash
mlflow run . -P lr=0.001 -P epochs=50   # 拉环境 → 跑入口 → 记 run
mlflow run git@github.com:org/repo.git  # 直接跑远程仓库
```

> 把「代码 + 环境 + 入口」打包，保证他人能复现你的 run

<!--
Projects 保证运行可复现。
-->

---

# Deployments + GenAI 评测

统一推理网关 + LLM/Agent 评测

```bash
mlflow deployments start --host 0.0.0.0 --port 7000
```

**Deployments Server** 既可服务本地 pyfunc（统一 `/invocations`），也可作 **LLM 网关**——把 OpenAI / Cohere / 自托管模型抽象成统一 API。

```python
# LLM 评测（3.x 一等公民）
result = mlflow.evaluate(
    model=llm_predict_fn,
    data=eval_df,
    model_type="question-answering",
    extra_metrics=[
        mlflow.metrics.genai.answer_relevance(...),  # judge LLM
    ],
)
```

> 内置 toxicity / faithfulness / answer_relevance，配合 Tracing 串起 Agent

<!--
3.x 把 GenAI 评测作为一等公民。
-->

---

# 陷阱与最佳实践

- **param 别当 metric**：param 一次性、唯一，重复 `log_param` 同名会被忽略；时序用 `log_metric`
- **autolog 关 model 谨慎**：默认记完整模型（含依赖），大模型拖慢；用 `log_models=False` 只留指标
- **Stage 与 Alias 别混用**：3.x 推荐 alias；团队约定统一，避免同一版本在两套体系打架
- **`end_run` 必须调用**：`with mlflow.start_run()` 最安全；裸调忘 end 会留「幽灵 run」
- **自托管重**：要管 DB（PostgreSQL）+ artifact（S3）+ 反代 + 鉴权；小团队考虑 Databricks 托管

<!--
关键是 param/metric 区分 + run 生命周期管理。
-->

---
layout: quote
---

# MLflow 精髓

「`autolog()` 一行接入 · pyfunc 统一部署 · Registry 治理版本——从实验到上线不用拼多个工具。」

---

# MLflow vs W&B vs DVC

| 维度 | MLflow | W&B | DVC |
|------|------|------|------|
| **定位** | 全生命周期平台 | 实验可视化协作 | 数据/流水线版本 |
| **部署** | 自托管 / 托管 | SaaS 为主 | Git 扩展 |
| **运行追踪** | ✅ Tracking | ✅ 最强可视化 | 弱（dvc exp） |
| **模型注册** | ✅ Registry | ✅ Registry | 部分 |
| **数据版本** | artifact | ✅ Artifacts | ✅ 核心能力 |
| **流水线复现** | Projects（弱） | — | ✅ dvc.repro |

> 三者互补：MLflow 全家桶，W&B 重协作可视化，DVC 重数据版本

<!--
三者定位互补，常组合使用。
-->

---
layout: center
class: text-center
---

# 小结

MLflow = Tracking + Models + Registry + GenAI

**autolog · pyfunc · Registry · 一条龙**

[MLflow 文档](https://mlflow.org/docs/latest/) · [GitHub](https://github.com/mlflow/mlflow) · [Autolog](https://mlflow.org/docs/latest/tracking/autolog/)

<!--
MLflow 组件齐全，autolog + pyfunc 是核心抽象。
-->
