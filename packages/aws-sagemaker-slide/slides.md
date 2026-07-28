---
theme: seriph
background: https://cover.sli.dev
title: AWS SageMaker 完全指南
info: |
  AWS SageMaker 完全指南：Studio · Training Job · Endpoint · Pipelines · HyperPod · 治理

  Learn more at [https://aws.amazon.com/sagemaker](https://aws.amazon.com/sagemaker)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## AWS SageMaker

全托管 ML 平台 · 训练 · 推理 · 治理 · 全生命周期

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
SageMaker 覆盖打标→准备→训练→部署→监控→治理全生命周期。
-->

---
transition: fade-out
---

# SageMaker 是什么

AWS 全托管机器学习平台（2024-12-03 起 ML 子产品更名 **SageMaker AI**）

- **全栈托管**：标注 → 准备 → 训练 → 评估 → 部署 → 监控 → 治理一站到位
- **基础设施托管**：Training Job 按秒计费、自动弹缩、Spot 省 90%
- **Studio 一体化 IDE**：JupyterLab + Code Editor + RStudio 共享空间
- **JumpStart 模型生态**：内置数百预训练模型（Llama / Mistral / SD）
- **HyperPod 应对大模型**：常驻集群 + Slurm/EKS + NeMo/Neuronx

> `boto3` / CloudFormation / IAM 命名空间保留旧 `sagemaker` 前缀以保后向兼容

<!--
SageMaker 是企业级 MLOps 一站式平台，团队不用自拼工具链。
-->

---
layout: two-cols
---

# 组件地图

围绕 ML 生命周期的托管服务

```
打标   Ground Truth / A2I
准备   Data Wrangler / Feature Store
       Processing Job / Clarify
训练   Training Job / Autopilot
       HyperPod / Canvas
评估   Processing Job / Model Cards
部署   Endpoint / Batch Transform
       Serverless / Neo
监控   Model Monitor / Shadow Tests
治理   Pipelines / Model Registry
       Lineage Tracking
IDE    Studio / Studio Classic
```

::right::

# Studio：一体化 IDE

基于 Web 的统一开发环境

| 应用 | 用途 |
|---|---|
| **JupyterLab** | 改进延迟的 Notebook |
| **Code Editor** | VS Code 开源版 |
| **RStudio** | R 语言 IDE |
| **Studio Classic** | 原始 ML 环境 |
| **Studio Lab** | 免费无需 AWS 账号 |

**共享空间**：域内用户共享 JupyterServer 与目录，可直连 EMR 处理大数据。

> Studio 是 SageMaker 主入口，跨账号协作 / Git 扩展齐全

<!--
Studio 把 notebook + 编辑器 + 终端 + Git 揉到一个界面。
-->

---

# Estimator：训练三行

SageMaker Python SDK 的核心抽象

```python
import sagemaker
from sagemaker.estimator import Estimator
role = sagemaker.get_execution_role()

estimator = Estimator(
    image_uri=f"...dkr.ecr.{region}.amazonaws.com/pytorch-training:2.3.0-cpu-py311",
    role=role,
    instance_count=1, instance_type="ml.m5.xlarge",
    use_spot_instances=True,            # Spot 省 90%
    max_run=3600, max_wait=7200,
    hyperparameters={"epochs": 10, "batch-size": 64},
)
estimator.fit({"train": "s3://bucket/train/"})   # ② 喂数据
predictor = estimator.deploy(initial_instance_count=1,
    instance_type="ml.t2.medium")                 # ③ 部署
```

**关键点**：`fit()` 触发 Training Job；Spot 配 `max_wait`；脚本读 `/opt/ml/input/data/`、写 `/opt/ml/model/`

<!--
Estimator 三步：建估计器 → fit → deploy，SDK 自动起 EC2 + 上传产物。
-->

---
layout: two-cols
---

# 训练容器路径契约

固定路径，脚本按约定读写

| 路径 | 用途 |
|---|---|
| `/opt/ml/input/data/` | 各 channel 数据 |
| `/opt/ml/model/` | 产物，打包 model.tar.gz 上传 |
| `/opt/ml/checkpoints/` | Spot 续训 checkpoint |

**Spot 续训**：`PyTorch(use_spot_instances=True, max_run=86400, max_wait=172800, checkpoint_s3_uri=...)`

::right::

# 分布式训练三档

```python
# ① 数据并行
distribution={"smdistributed": {"dataparallel": {"enabled": True}}}
# ② 模型并行（切到多卡）
distribution={"smdistributed": {"modelparallel": {"enabled": True}}}
# ③ 原生 PyTorch DDP（推荐）
distribution={"torch_distributed": {"enabled": True}}
```

**大模型转 HyperPod**：常驻集群 + Slurm/EKS + NeMo，节点宕机自动替换续训。

> Spot 必须配 `checkpoint_s3_uri`，否则中断丢进度

<!--
路径契约 + Spot checkpoint 是训练脚本的两个关键约定。
-->

---

# 推理六种形态

| 形态 | API | 适用场景 |
|---|---|---|
| 实时 Endpoint | `estimator.deploy()` | 在线低延迟，持久实例 |
| 异步 / 多模型 | Async / MultiModel | 大模型入队列 / 一实例多模型 |
| Serverless | ServerlessInferenceConfig | 突发流量，缩到 0 |
| Batch Transform | Transformer | 大批量离线，无持久端点 |

**辅助能力**

- **Shadow Tests**：候选与线上并行跑对比，再决定切流
- **Inference Recommender**：负载测试给最优实例配置
- **Neo / Edge Manager**：编译一次云端 + 端侧通用 / 管端侧舰队

> 实时端点不删就一直计费，长期不用切 Batch / Serverless

<!--
六种形态覆盖在线/离线/突发场景；实时端点要记得删。
-->

---
layout: two-cols
---

# Pipelines：DAG 工作流

```python
from sagemaker.workflow.pipeline import Pipeline
from sagemaker.workflow.steps import (
  ProcessingStep, TrainingStep, ConditionStep)

step_process = ProcessingStep(name="Preprocess", ...)
step_train   = TrainingStep(name="Train", ...)
step_cond = ConditionStep(
  name="CheckRMSE",
  conditions=[ConditionLessThanOrEqualTo(
    left=JsonGet("Eval", "rmse"), right=0.5)],
  if_steps=[RegisterModel(..., approval_status="Approved")])
pipeline = Pipeline(steps=[step_process, step_train, step_cond])
```

::right::

# Pipeline 要点

**步骤类型**：`ProcessingStep` / `TrainingStep` / `TuningStep` / `TransformStep` / `RegisterModel` / `ConditionStep` / `LambdaStep`

**核心模式**

- 步骤输出用 `step.properties.X` 引用，**不硬编码 S3 key**
- **ConditionStep** 是 Model Registry 审批标配：达标才注册
- 跨账号：A 注册模型，B `create_model` + `deploy` 拉镜像

> Pipeline 重跑会生成新 S3 路径，硬编码会断

<!--
Pipeline 把 Processing→Train→Eval→Register 编排成可复现流水线。
-->

---
layout: two-cols
---

# 治理四件套

| 工具 | 作用 |
|---|---|
| **Model Registry** | 版本化 + 审批 + 跨账号部署 |
| **Feature Store** | Online(μs) + Offline(S3) 特征仓库 |
| **Model Monitor / Cards** | 漂移告警 / 合规汇报 |
| **Lineage + Clarify** | 血缘追踪 + SHAP 可解释 |

**Feature Store 读写**：`feature_group.ingest(data_frame=df)` / `feature_store.get_record(feature_group_name="fg", record_identifier_value="123")`

::right::

# HyperPod 与加速器

**HyperPod：常驻大模型集群**

- 基础：Slurm（HPC）或 EKS（K8s）
- 适配器：NVIDIA NeMo / Neuronx Distributed Training
- **recipes**：端到端训练配方；节点宕机自动替换 + checkpoint 续训

**其他加速器**：**Autopilot**（AutoML）/ **JumpStart**（1-click 部署模型）/ **Canvas**（无代码 AutoML）

> Autopilot 的 Candidate Definitions notebook 完全可解释可干预

<!--
治理满足金融/医疗审计；HyperPod 是万卡级预训练的官方方案。
-->

---

# 与 Bedrock 的边界

**SageMaker AI**：自己训、自己部署（含 Fine-tune FM）
**Amazon Bedrock**：直接调托管 FM API（Claude / Titan / Llama）

| 场景 | 用谁 |
|---|---|
| 调 Claude / Titan 推理 | **Bedrock**（托管 API） |
| Fine-tune Llama / 训自研模型 | **SageMaker AI** |
| 端侧 / Neo 编译 | **SageMaker AI** |

> 常规分工：Bedrock 出 FM 推理 API，SageMaker AI 出训练 / 自定义部署；下一代 SageMaker 已纳入 Bedrock

<!--
SageMaker 训练 + Bedrock 推理 API 是 GenAI 的常规分工。
-->

---
layout: quote
---

# SageMaker 核心抽象

「Studio 是入口 · Training Job / Processing Job 是执行单元 · Endpoint 是服务形态 · Pipelines 串起全生命周期——这就是企业级 MLOps 的 AWS 答案。」

---
layout: center
class: text-center
---

# 小结

SageMaker = Studio + Training Job + Endpoint + Pipelines + 治理

**全托管 · Spot 省 90% · HyperPod 大模型 · Model Registry 审批 · Lineage 血缘**

[SageMaker AI 文档](https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html) · [Studio](https://docs.aws.amazon.com/sagemaker/latest/dg/studio-updated.html) · [示例库](https://github.com/aws/amazon-sagemaker-examples)

<!--
Studio + Training Job + Endpoint 三件套是入门核心，治理满足企业审计。
-->
