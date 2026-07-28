---
theme: seriph
background: https://cover.sli.dev
title: Hugging Face 平台完全指南
info: |
  Hugging Face 平台完全指南：Hub · Models/Datasets/Spaces · Xet · Inference · ZeroGPU

  Learn more at [https://huggingface.co](https://huggingface.co)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Hugging Face 平台

开源 AI 的 GitHub · Hub · Spaces · Inference · ZeroGPU

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
HF 把发现→试用→微调→部署工作流压缩到一个站点。
-->

---
transition: fade-out
---

# Hugging Face 是什么

「开源 AI 的 GitHub」——托管模型 / 数据集 / 应用的中央协作平台

- **三大仓库**：Models（200 万+）/ Datasets（150 万+）/ Spaces（150 万+）
- **完全 Git-based**：每个仓库是 git repo，享受 commit / branch / PR / Discussions
- **Xet 大文件存储**：2025 年起取代 git-lfs，分块去重 + CDN
- **`from_pretrained` 一行加载**：transformers / diffusers / datasets 深度集成
- **Inference widget**：浏览器内一键试推理，无需写代码

> Meta / Mistral / DeepSeek / Qwen / Google 都把模型首发到 HF

<!--
HF 是 Open-source AI 的事实标准，类比 GitHub 之于代码。
-->

---
layout: two-cols
---

# Hub 是 AI 的 GitHub

| 维度 | GitHub | HF Hub |
|---|---|---|
| 主产物 | 源代码 | 模型/数据/应用 |
| 大文件 | git-lfs(10GB) | **Xet**（分块去重） |
| 元数据 | README.md | **Model Card** |
| 浏览器执行 | Codespaces | widget / Spaces |

**Models 仓库结构**

```
user/my-model/
├── config.json          # 配置
├── model.safetensors    # 权重
└── README.md            # ← Model Card
```

::right::

# Datasets 与 Spaces

**Datasets（推荐 parquet）**

```
user/my-dataset/
├── README.md            # Dataset Card
└── data/train-00000.parquet
```

**Spaces（SDK）**：**Gradio**（ML demo 首选）/ Streamlit / Docker / Static

```
user/my-space/
├── app.py               # 入口
└── requirements.txt
```

<!--
把 GitHub 工作流原样迁移，外加 AI 特有能力。
-->

---
layout: two-cols
---

# CLI 登录与上传

```bash
pip install huggingface_hub
hf auth login             # token 或 OAuth
# 上传整个目录（推荐）
hf upload user/my-model ./my-model-dir
hf upload user/data ./data --repo-type=dataset
```

`hf` CLI 自动处理 Xet 大文件，无需配置。

**Python 上传**

```python
from huggingface_hub import upload_folder
upload_folder(repo_id="user/my-model",
    folder_path="./dir", commit_message="v1")
```

::right::

# 下载与加载

**库内置加载（最常用）**

```python
from transformers import AutoModel, AutoTokenizer
m = AutoModel.from_pretrained("bert-base-uncased")
tok = AutoTokenizer.from_pretrained("bert-base-uncased")
from datasets import load_dataset
ds = load_dataset("imdb", split="train")
from diffusers import StableDiffusionPipeline
pipe = StableDiffusionPipeline.from_pretrained("...")
```

**国内加速**

```bash
pip install hf_transfer
export HF_HUB_ENABLE_HF_TRANSFER=1   # 3-10x
export HF_ENDPOINT=https://hf-mirror.com
```

> 库自动缓存到 `~/.cache/huggingface/hub/`

<!--
from_pretrained 是日常最高频用法，库自动管缓存。
-->

---

# Model Card 模型卡

每个仓库 README.md 渲染成 Model Card：YAML 元数据 + Markdown 描述

```yaml
---
language: [en, zh]
license: apache-2.0
library_name: transformers
pipeline_tag: text-generation
base_model: meta-llama/Llama-2-7b-hf
widget:
  - text: "Hello, my name is"
---
```

**关键字段**：`license`（影响商用）/ `pipeline_tag`（影响 widget）/ `base_model`（fine-tune 关系）/ `widget`（推理示例）

> Model Card 让模型可发现、可比较、可审计——Open LLM Leaderboard 基于此

<!--
Model Card 是 AI 仓库元数据标准，影响发现与审计。
-->

---
layout: two-cols
---

# Spaces：免费部署 ML 应用

[huggingface.co/new-space](https://huggingface.co/new-space) 几分钟把模型变 web demo

**Gradio 示例 `app.py`**

```python
import gradio as gr
from transformers import pipeline

pipe = pipeline("text-generation", model="gpt2")

def gen(text):
    return pipe(text, max_new_tokens=50)[0]["generated_text"]

gr.Interface(fn=gen, inputs="text",
             outputs="text").launch()
```

提交后自动构建，URL：`https://user-demo.hf.space`

::right::

# ZeroGPU：免费动态 GPU

调用时动态分配 NVIDIA RTX Pro 6000 Blackwell

```python
import spaces
import gradio as gr
from diffusers import DiffusionPipeline
import torch

pipe = DiffusionPipeline.from_pretrained(
    "stabilityai/sdxl-turbo", torch_dtype=torch.float16).to("cuda")

@spaces.GPU(duration=45)        # 请求 45s
def generate(prompt):
    return pipe(prompt, num_inference_steps=4).images[0]

gr.Interface(fn=generate,
  inputs="text", outputs="image").launch()
```

**配额**：免费 5 分钟/天，PRO 40 分钟/天

> ZeroGPU 仅支持 Gradio SDK，不支持 torch.compile

<!--
ZeroGPU 把 GPU 当按需资源，免费层够学习与个人项目。
-->

---

# Inference Endpoints：生产部署

付费专用推理实例，把任意 Hub 模型部署成生产级 HTTP API

| 特性 | 说明 |
|---|---|
| 完全托管 | 不管 K8s / CUDA / VPN |
| **Autoscaling** | 流量扩容，缩到 0（空闲不收费） |
| 内置引擎 | vLLM（推荐 LLM）/ TGI / Custom |

**价格参考（USD/小时）**：CPU ~0.06 · T4 ~0.6 · A10g ~1.0 · A100 ~6.0 · H100 ~10.0

> `min replicas = 0` 完全 serverless，冷启动约 30 秒

<!--
免费 Inference API 限流严格，生产用 Endpoints + autoscaling。
-->

---
layout: two-cols
---

# huggingface_hub 库

**仓库操作 + PR**

```python
from huggingface_hub import HfApi
api = HfApi()
models = api.list_models(filter="text-generation", limit=10)
api.create_pull_request(repo_id="user/model", title="Update")
```

**`push_to_hub` 一行上传**：`trainer.push_to_hub()` / `model.push_to_hub("user/m")` / `ds.push_to_hub("user/d")`

::right::

# 企业能力与生态

**PRO / Enterprise**

| 能力 | Free | PRO | Enterprise |
|---|---|---|---|
| 私有仓库 | 有限 | 10 | 不限 |
| ZeroGPU | 5min/天 | 40min/天 | 60min/天 |
| SSO | ✗ | ✗ | ✅ |

**配套生态（七大库）**

- `transformers` 模型 · `diffusers` 扩散 · `peft` 微调
- `datasets` 数据 · `accelerate` 分布式 · `gradio` 应用
- `tokenizers` 分词（与 Hub 深度集成）

> Storage Buckets / Jobs 是新功能：非版本化大文件 + serverless GPU

<!--
transformers/diffusers/datasets/peft/accelerate/gradio 七大库深度集成 Hub。
-->

---

# HF vs 其他平台

| 平台 | 定位 | 与 HF 差异 |
|---|---|---|
| **GitHub** | 代码托管 | HF 是 AI 产物托管 |
| **ModelScope** | 国内 AI 平台 | 国内快，生态小 |
| **W&B** | 训练追踪 | 重跟踪，HF 重分发 |
| **Vertex / Modal** | 企业 ML / Serverless GPU | HF Enterprise + Jobs 同类 |

> 2026 年 HF 是国际开源 AI 事实标准，主流实验室首发模型到 HF

<!--
HF 定位 = AI 产物分发平台，与 GitHub / W&B / 企业 ML 平台互补。
-->

---
layout: quote
---

# Hugging Face 核心定位

「发现 → 试用 → 微调 → 部署——AI 工作流压缩到一个站点，Git-based 仓库 + Xet 大文件 + 一行 `from_pretrained`，这就是开源 AI 的 GitHub。」

---
layout: center
class: text-center
---

# 小结

HF = Hub + Spaces + Inference + ZeroGPU

**三仓 Git-based · Model Card · ZeroGPU · Inference Endpoints · 七大库集成**

[HF Hub 文档](https://huggingface.co/docs/hub/index) · [Spaces](https://huggingface.co/docs/hub/spaces) · [Endpoints](https://huggingface.co/docs/inference-endpoints/index)

<!--
HF 把模型/数据/应用三仓统一，是开源 AI 协作的事实标准。
-->
