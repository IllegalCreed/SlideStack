---
theme: seriph
background: https://cover.sli.dev
title: Weights & Biases 完全指南
info: |
  Weights & Biases 完全指南：Run · Artifacts · Sweeps · Tables · Reports · Registry · Weave

  Learn more at [https://docs.wandb.ai](https://docs.wandb.ai)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Weights & Biases

AI 开发者平台 · 实验可视化与协作 · 0.28.1

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
W&B 核心诉求是「让实验看得见、让团队协作得起来」。
-->

---
transition: fade-out
---

# W&B 是什么

以 SaaS 为主、可自托管的 AI 开发者平台（SDK 包名 `wandb`）

- **可视化与协作是杀手锏**：图表自动聚合、Run 横向对比、Report 一键分享
- **SDK 上手极快**：`init` / `log` / `finish` 三行接入
- **Artifacts 血缘自动**：`log_artifact` + `use_artifact` 连成 lineage graph
- **Tables 支持任意媒体**：文本/图像/视频/音频/HTML 样本级评估
- **Weave 覆盖 GenAI 全链路**：scorer / judge / tracing / 可观测

> Python SDK 稳定版 **0.28.1**（2026-07-16）

<!--
协作可视化是 W&B 的核心差异化卖点。
-->

---

# 核心抽象：Run 与产品模块

围绕 **Run**（一次实验运行）展开

- **Run 生命周期**：`wandb.init()` → `run.log()` → `run.finish()`
- **Project**：一组 Run，便于横向对比
- **Entity**：用户/团队命名空间
- **Artifacts**：数据/模型版本化 + 血缘追踪
- **Sweeps**：超参搜索（grid/random/bayes）
- **Tables**：任意媒体样本级评估
- **Reports**：可分享的交互式研究报告
- **Registry + Automations**：模型注册 + 事件触发 CI

> `with wandb.init(...) as run:` 退出自动 `finish`

<!--
Run 是核心抽象，模块层层叠加。
-->

---
layout: two-cols
---

# 第一个 Run：三行接入

```python
import wandb

wandb.init(
    project="my-project",
    name="run-001",
    config={"lr": 0.01, "epochs": 10},
)

for epoch in range(wandb.config.epochs):
    loss = train_one_epoch()
    wandb.log({"epoch": epoch, "loss": loss})

wandb.finish()
```

::right::

# 要点

- **`config` 是分组依据**：把想筛选 Run 的超参都塞 config
- **`log` 接收 dict**：同名指标自动形成时序曲线
- **`finish` 必须调**：显式调用确保数据完整上传
- **step**：默认自增，可显式 `wandb.log({...}, step=)`

```python
run.define_metric(
    "train_loss", step_metric="epoch")
```

> 用 `with` 上下文管理自动结束最安全

<!--
init/log/finish 是 W&B 的万能三行。
-->

---

# autolog / 框架集成

主流框架都有官方集成钩子，无需手写 `log`

```python
import wandb
wandb.init(project="hf")

# HuggingFace Transformers
from transformers import Trainer, TrainingArguments
args = TrainingArguments(..., report_to="wandb")
trainer = Trainer(..., args=args)
trainer.train()   # 自动记录 loss/lr/eval/模型

# PyTorch Lightning
from pytorch_lightning.loggers import WandbLogger
logger = WandbLogger(project="lit")
trainer = pl.Trainer(logger=logger)
```

> PyTorch / TF / Keras / HF / SKlearn / XGBoost / Fastai 都有集成

<!--
框架集成让接入几乎零成本。
-->

---
layout: two-cols
---

# Artifacts：数据与模型版本

```python
with wandb.init(project="pipe") as run:
    # ① 标输入（已存在版本）
    art = run.use_artifact("data:latest")
    data_dir = art.download()
    # 训练...
    # ② 记输出为新版本
    m = wandb.Artifact("model", type="model")
    m.add_file("model.pt")
    run.log_artifact(m)
```

::right::

# 血缘自动

**`use_artifact` = 输入**，**`log_artifact` = 输出**——W&B 据此自动连成 lineage graph。

| 操作 | 含义 |
|------|------|
| `add_file` / `add_dir` | 文件/目录入库 |
| `add_reference` | 引用外部存储不复制 |
| `name:v3` / `name:latest` | 版本与别名 |
| `art.diff(other)` | 版本间文件差异 |

> 大数据集用 `add_reference` 引用 S3，避免重复存储

<!--
use + log 自动连成 lineage。
-->

---

# Sweeps：超参搜索

定义搜索空间与策略，自动调度多个 Run

```python
sweep_config = {
    "method": "bayes",            # grid / random / bayes
    "metric": {"name": "val_loss", "goal": "minimize"},
    "parameters": {
        "lr": {"min": 0.0001, "max": 0.1},
        "epochs": {"values": [5, 10, 20]},
    },
    "early_terminate": {"type": "hyperband"},
}
sweep_id = wandb.sweep(sweep_config, project="hpo")

def train():
    wandb.init()
    val_loss = train_model(wandb.config.lr)
    wandb.log({"val_loss": val_loss})

wandb.agent(sweep_id, function=train, count=20)
```

> **bayes** 贝叶斯优化样本效率高；**hyperband** 早停差 Run；多机并行跑同一 sweep_id

<!--
Sweeps 把超参搜索内建到工作流。
-->

---

# Tables：样本级评估

记录任意媒体做细粒度调试，比纯指标曲线更适合错误分析

```python
import wandb

with wandb.init(project="eval") as run:
    table = wandb.Table(
        columns=["image", "pred", "label", "correct"],
        data=[[wandb.Image(img), p, l, p == l]
              for img, p, l in zip(imgs, preds, labels)],
    )
    run.log({
        "predictions": table,
        "confusion": wandb.plot.confusion_matrix(...),
    })
```

支持文本/图像/视频/音频/HTML/分子，UI 可按列过滤、按媒体预览、导出。

<!--
Tables 适合细粒度样本级调试。
-->

---

# Weave：GenAI 评测与可观测

把 LLM 应用的追踪、评测、可观测统一在一个工具

```python
import weave

# 给 LLM 调用加 tracing
@weave.op
def my_llm_app(prompt: str) -> str:
    return llm.generate(prompt)

# 评测数据集 + scorer
dataset = weave.Dataset(name="qa-eval", rows=[...])
weave.evaluate(
    my_llm_app,
    dataset=dataset,
    scorers=[answer_correctness_scorer],
)
```

**Weave 覆盖**：调用追踪（tracing）、评测（scorer/judge）、可观测（observability）、持续改进。已 GA on SaaS 与 AWS。

<!--
Weave 把 GenAI 全链路统一。
-->

---
layout: two-cols
---

# init 参数全景

```python
run = wandb.init(
    project="my-project",
    entity="my-team",
    group="exp-lr-sweep",      # 聚一组
    job_type="train",          # lineage 分层
    tags=["baseline", "v2"],
    notes="试试 cosine",
    dir="./wandb",
    config={"lr": 0.01},
    mode="online",             # online/offline/disabled
)
```

::right::

# 离线与同步

```bash
# 不联网，数据落本地
WANDB_MODE=offline python train.py

# 事后上传
wandb sync ./wandb/latest-run/
wandb sync --view     # 查看待同步
```

> `group` + `job_type` 直接影响 lineage 分层与 UI 聚合

<!-- 
合理用 group/job_type 让多阶段流水线血缘清晰。
-->

---

# 陷阱与最佳实践

- **忘 `finish`**：异常退出留「crashed」Run，影响 Sweep 判断；用 `with` 或 try/finally 兜底
- **config 滥用**：所有变量塞 config 会让 UI 过滤爆炸；只放关键超参
- **artifact 大文件 add_dir**：默认上传，大数据集用 `add_reference` 引用外部存储
- **Sweep 单机串行慢**：`agent(count=N)` 单进程；要快需多机/多进程并行
- **自托管特性差异**：Sweeps/Automations/SSO 在开源 server 可能缺失或滞后
- **SaaS 强依赖**：敏感数据必须自托管或 Dedicated Cloud，成本陡升

<!--
关键是 config 精简 + finish 兜底 + 自托管特性对照。
-->

---
layout: quote
---

# W&B 精髓

「`init` / `log` / `finish` 三行接入 · Artifacts 自动血缘 · Report 一键分享——让实验看得见、让团队协作得起来。」

---

# MLflow vs W&B vs DVC

| 维度 | MLflow | W&B | DVC |
|------|------|------|------|
| **定位** | 全生命周期平台 | 实验可视化协作 | 数据/流水线版本 |
| **可视化** | 中等 | ✅ 最强 | 命令行图表 |
| **协作** | 一般 | ✅ Report 杀手锏 | Git 协作 |
| **数据血缘** | artifact | ✅ 自动 lineage | ✅ 内容寻址 |
| **LLM 评测** | ✅ genai | ✅ Weave | ✗ |
| **部署** | 自托管/托管 | SaaS 为主 | 无 |

> W&B 重协作可视化，MLflow 重组件齐全，DVC 重数据版本

<!--
三者定位互补。
-->

---
layout: center
class: text-center
---

# 小结

W&B = Run + Artifacts + Sweeps + Weave

**可视化 · 协作 · 血缘 · GenAI 评测**

[W&B 文档](https://docs.wandb.ai/) · [GitHub](https://github.com/wandb/wandb) · [Weave](https://wandb.ai/site/weave/)

<!--
W&B 的杀手锏是可视化与协作。
-->
