---
theme: seriph
background: https://cover.sli.dev
title: Google Colab 完全指南
info: |
  Google Colab 完全指南：托管 Jupyter · 免费 GPU(T4) · TPU · Drive · Colab AI

  Learn more at [https://colab.research.google.com](https://colab.research.google.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Google Colab

托管式 Jupyter · 免费 GPU · TPU · Drive 集成 · Colab AI

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Colab 把「跑一个 GPU 实验」的门槛降到「点开一个网页」。
-->

---
transition: fade-out
---

# Colab 是什么

Google 出品的「托管式 Jupyter Notebook 服务」

- **零安装、零成本**：浏览器开即用，省去 Python / CUDA / 驱动配置
- **免费 GPU**：默认 NVIDIA T4（16GB 显存），够跑 BERT-base / SD / 小 LoRA
- **免费 TPU v2**：罕见免费 TPU 资源，跑 JAX / PyTorch-XLA
- **底层是 Jupyter 协议**：`.ipynb` 与本地 100% 兼容
- **Drive 深度集成**：notebook 自动存 Drive，Google Docs 式协作

> Pro（10 美元/月）/ Pro+（50 美元）/ Pay As You Go 升级 A100 / 后台执行

<!--
Colab = 托管版 Jupyter，免费 T4 GPU 是业界良心。
-->

---
layout: two-cols
---

# Colab vs 本地 Jupyter

| 维度 | 本地 Jupyter | Google Colab |
|---|---|---|
| 部署 / 环境 | 自装全栈 | 浏览器开即用，只能 `!pip` |
| 硬件 | 看本机 | 免费 T4 GPU / TPU |
| 存储 | 本地磁盘 | Google Drive |
| 协作 | 需 JupyterHub RTC | 默认实时协作 |
| `.ipynb` | ✅ 原生 | ✅ 完全兼容 |

> 本地写的 `.ipynb` 可直接上传 Colab 跑，反之亦然

::right::

# 首次启动与 GPU

**进入 Colab**

1. 开 https://colab.research.google.com
2. Google 账号登录 → `File → New notebook`

**切 GPU 运行时**

```
Runtime → Change runtime type
  Hardware accelerator: GPU  → Save
```

**验证 GPU**

```python
!nvidia-smi                    # Tesla T4, 16GB
import torch
torch.cuda.is_available()      # True
torch.cuda.get_device_name(0)  # 'Tesla T4'
```

<!--
切换后 VM 重启，分配新的 GPU 实例。
-->

---
layout: two-cols
---

# 挂载 Google Drive

VM 是临时的（断开就丢），数据要存 Drive

```python
from google.colab import drive
drive.mount('/content/drive')

# 挂载后 Drive 在
# /content/drive/MyDrive/
```

执行后弹 OAuth 链接，登录授权回贴。

**复制大数据到本地再操作**

```bash
!cp '/content/drive/MyDrive/data.tar.gz' /content/
!tar -xzf /content/data.tar.gz -C /content/
```

::right::

# 装包与表单

**安装 Python 包**

```python
!pip install peft accelerate bitsandbytes
# 推荐 %pip（绑定当前解释器）
%pip install peft accelerate
```

部分包改底层库需 `Runtime → Restart session`。

**表单（Forms）参数化**

```python
#@title 表单示例
lr = 0.001 #@param {type:"slider", min:0, max:0.1, step:0.001}
model = "bert" #@param ["bert", "gpt2", "t5"]
print(f"训练 {model}, lr={lr}")
```

Colab 自动渲染滑块 / 下拉。

> Drive 是对象存储，小文件读写极慢

<!--
大量小文件操作先复制到 /content/ 本地磁盘。
-->

---

# 运行时管理

| 类型 | 硬件 | 用途 |
|---|---|---|
| **None** | 普通 CPU | 数据处理、小模型推理 |
| **GPU**（默认） | NVIDIA T4 16GB | 训练 / 推理中型模型 |
| **TPU** | TPU v2（8 核） | JAX / XLA 大模型训练 |

**配额与限制**

- **免费层**：动态配额，idle 断开 + 最长 12 小时
- **Pro**（10 美元/月）：优先 GPU、最长 24 小时、A100 可申请
- **Pro+**（50 美元/月）：背景执行、High-RAM 83GB
- **临时磁盘 100GB**：VM 销毁即丢

> 免费层频繁申请 GPU 会被风控降权——一机一卡用完 Disconnect

<!--
免费 GPU 不是保证可用，高峰期会排队 / 拒绝分配。
-->

---

# GPU 训练实战：混合精度

T4 支持 Tensor Core FP16，混合精度提速 1.5–2 倍、显存减半

```python
from torch.cuda.amp import autocast, GradScaler

scaler = GradScaler()
for inputs, targets in loader:
    optimizer.zero_grad()
    with autocast():                      # FP16 前向
        outputs = model(inputs)
        loss = loss_fn(outputs, targets)
    scaler.scale(loss).backward()         # 缩放反向
    scaler.step(optimizer)
    scaler.update()
```

**显存管理（T4 仅 16GB 易 OOM）**

```python
import gc, torch
gc.collect()
torch.cuda.empty_cache()                  # 释放显存
torch.cuda.memory_allocated()/1024**3     # 已用 GB
```

> OOM 时先 `empty_cache()`，再降 batch / 用梯度累积

<!--
混合精度 + 显存管理是 T4 跑大模型的关键。
-->

---
layout: two-cols
---

# 大模型微调（PEFT + 4-bit）

T4 跑 7B 模型需 4-bit 量化 + LoRA

```python
from transformers import AutoModelForCausalLM
from peft import LoraConfig, get_peft_model
import torch

bnb = BitsAndBytesConfig(load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16)
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    quantization_config=bnb, device_map="auto")
```

::right::

# Checkpoint 与持久化

避免 12 小时墙丢了训练

```python
CKPT = '/content/drive/MyDrive/ckpt/'
# 每 N 步存
if step % 500 == 0:
    torch.save({'step': step,
        'model': model.state_dict(),
        'optimizer': optimizer.state_dict()},
        f'{CKPT}step-{step}.pt')
# 重启后恢复
c = torch.load(f'{CKPT}step-1000.pt')
model.load_state_dict(c['model'])
```

**大文件传输方案**

| 方案 | 速度 | 用途 |
|---|---|---|
| Drive | 慢 | notebook / 小文件 |
| GCS / HF | 快 | 大数据 / 公开数据 |

> 长任务超 24h：Checkpoint + Restart 或迁 Vertex AI

<!--
每 N 步存 Drive，VM 销毁后从头恢复；大数据用 GCS 而非 Drive。
-->

---

# Colab AI（Gemini）

右侧栏 Gemini 图标，AI 编程助手

- **自然语言生成代码**：「用 PyTorch 写 ResNet18 训练循环」→ 生成 cell
- **解释代码**：选中 →「Explain selection」→ 自然语言说明
- **修复报错**：cell 报错 →「Explain error」/「Suggest fix」
- **代码补全**：Tab 触发 AI 补全（类似 Copilot）
- **Data Science Agent**：描述分析目标，Agent 自动生成并执行 EDA 流水线

> 免费层有调用次数限制，Pro / Pro+ 配额更高、优先级更高

<!--
Colab AI = 免费版 Copilot，与 Gemini 2.5 深度集成。
-->

---
layout: quote
---

# Colab 核心价值

「开浏览器即用免费 GPU——把跑一个 GPU 实验的门槛从『装一整套环境』降到『点开一个网页』，学生与研究者最友好的入口。」

---
layout: center
class: text-center
---

# 小结

Colab = 托管 Jupyter + 免费 GPU/TPU + Drive + AI

**零安装 · 免费 T4 · 混合精度 · 12 小时墙 · 持久化 Checkpoint**

[Colab FAQ](https://research.google.com/colaboratory/faq.html) · [帮助中心](https://colab.research.google.com/notebooks/) · [googlecolab](https://github.com/googlecolab)

<!--
零安装 + 免费 GPU 是 Colab 的根本优势，长任务靠 Checkpoint 持久化。
-->
