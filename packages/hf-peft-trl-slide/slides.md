---
theme: seriph
background: https://cover.sli.dev
title: Hugging Face PEFT 与 TRL 完全指南
info: |
  Hugging Face PEFT 与 TRL：LoRA · QLoRA · SFTTrainer · DPOTrainer · GRPOTrainer · 后训练流水线

  Learn more at [https://huggingface.co/docs/peft](https://huggingface.co/docs/peft) · [https://huggingface.co/docs/trl](https://huggingface.co/docs/trl)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Hugging Face PEFT 与 TRL

参数高效微调与对齐训练 · LoRA · QLoRA · DPO · GRPO

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
PEFT 让大模型微调平民化，TRL 覆盖对齐全链路。
-->

---
transition: fade-out
---

# PEFT 与 TRL 是什么

让大模型微调既便宜又对齐的两个互补库

- **PEFT**：冻结基模全部权重，注入少量可训练 adapter
- **参数降级**：可训参数降一到两个数量级（最多降 10000 倍）
- **单卡可训**：7B–65B 模型单卡微调，性能接近全量
- **TRL**：SFT/DPO/PPO/Reward/GRPO 等对齐训练器
- **后训练流水线**：SFT → 奖励建模 → RLHF/DPO/GRPO

> QLoRA + SFTTrainer/DPOTrainer 是消费级 GPU 微调大模型的事实标准

<!--
PEFT 降参数，TRL 覆盖对齐，两者常组合使用。
-->

---

# PEFT 核心三件套

Config + get_peft_model + PeftModel

```python
from transformers import AutoModelForCausalLM
from peft import LoraConfig, get_peft_model

model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-0.5B-Instruct")

config = LoraConfig(
    r=8, lora_alpha=16,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05, task_type="CAUSAL_LM",
)
model = get_peft_model(model, config)
model.print_trainable_parameters()
# trainable%: 0.06  仅训零点几
```

> **铁律**：`get_peft_model` 冻结基模并注入 adapter。

<!--
print_trainable_parameters 是确认只训零点几的标配检查。
-->

---

# LoRA 关键参数

| 参数 | 含义 | 经验 |
|------|------|------|
| `r` | 低秩矩阵的秩 | 8/16/32/64，任务越复杂越大 |
| `lora_alpha` | 缩放，有效系数=alpha/r | 常取 r 的 1-2 倍 |
| `target_modules` | 注入哪些层 | `all-linear`（QLoRA 标配） |
| `lora_dropout` | adapter 的 dropout | 防过拟合，0.05–0.1 |
| `bias` | 是否训练 bias | `none`（默认只训 adapter） |
| `task_type` | 任务类型 | CAUSAL_LM / SEQ_CLS 等 |

> r 翻倍 ≈ 参数翻倍；alpha 远小于 r 会让 adapter 几乎不起作用。

<!--
LoRA 冻结 W，旁路注入低秩更新 ΔW = B·A。
-->

---
layout: two-cols
---

# QLoRA：4-bit + LoRA

单卡微调大模型的关键：基模 4-bit nf4 量化 + LoRA

```python
import torch
from transformers import BitsAndBytesConfig

bnb = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
)
model = AutoModelForCausalLM.from_pretrained(
    "Qwen/Qwen2.5-7B-Instruct",
    quantization_config=bnb, device_map="auto")

config = LoraConfig(
    r=64, lora_alpha=16,
    target_modules="all-linear",
    task_type="CAUSAL_LM")
model = get_peft_model(model, config)
```

::right::

# 保存/加载/合并

```python
# 保存：只存 adapter（几 MB~几百 MB）
model.save_pretrained("./my-lora")

# 加载：基模 + adapter
from peft import PeftModel
base = AutoModelForCausalLM.from_pretrained(model_id)
model = PeftModel.from_pretrained(base, "./my-lora")

# 合并：融入基模，推理无额外开销
merged = model.merge_and_unload()
merged.save_pretrained("./my-merged")
```

> QLoRA 基模占显存约为 fp16 的 1/4。

<!--
nf4 为正态分布权重设计的 4-bit 类型，比 int4 更准。
-->

---

# 量化模型训练必备

```python
from peft import prepare_model_for_kbit_training

# 4-bit 加载后、注入 LoRA 前，必经此步
model = prepare_model_for_kbit_training(model)
```

- **作用**：启用梯度检查点、确保输入嵌入参与梯度
- **省略后果**：反传报错或梯度异常

> **铁律**：量化模型做训练的必经步骤。

<!--
prepare_model_for_kbit_training 是 QLoRA 训练的必经步骤。
-->

---
layout: two-cols
---

# 各 PEFT 方法对比

| 方法 | 思路 |
|------|------|
| **LoRA** | 低秩分解旁路注入 |
| **QLoRA** | 4bit 量化 + LoRA |
| AdaLoRA | 自适应分配秩 |
| Prefix/Prompt Tuning | 软前缀/软提示 |
| IA³ / VeRA | 重缩放/共享矩阵 |

**LoRA 是通用首选**，QLoRA 是单卡大模型标配。

::right::

# 后训练（post-training）流水线

| 阶段 | 训练器 | 数据 |
|------|------|------|
| **SFT** | `SFTTrainer` | prompt-completion |
| 奖励建模 | `RewardTrainer` | preference 对 |
| RLHF/PPO | `PPOTrainer` | prompt+reward |
| **DPO** | `DPOTrainer` | preference 对 |
| **GRPO** | `GRPOTrainer` | prompt+奖励函数 |

> SFT 学会指令 → 奖励建模学偏好 → DPO/GRPO 对齐。

<!--
SFT→Reward→RLHF/DPO/GRPO 是现代大模型后训练的标准链路。
-->

---

# SFTTrainer 监督微调

```python
from trl import SFTTrainer, SFTConfig
from datasets import load_dataset

dataset = load_dataset("trl-lib/Capybara", split="train")

trainer = SFTTrainer(
    model="Qwen/Qwen2.5-0.5B-Instruct",
    train_dataset=dataset,
    args=SFTConfig(
        output_dir="./sft-out", num_train_epochs=3,
        per_device_train_batch_size=4,
        learning_rate=2e-5, bf16=True,
    ),
)
trainer.train()
```

> SFTTrainer 自动 tokenize + chat template + packing。

<!--
SFTTrainer 也可直接接收字符串模型 id 与 peft_config。
-->

---
layout: two-cols
---

# DPOTrainer 直接偏好优化

把 RLHF 一步化为分类损失，无需显式奖励模型

```python
from trl import DPOTrainer, DPOConfig

dataset = load_dataset(
    "trl-lib/ultrafeedback_binarized", split="train")

trainer = DPOTrainer(
    model="Qwen/Qwen2.5-0.5B-Instruct",
    train_dataset=dataset,
    args=DPOConfig(
        output_dir="./dpo-out",
        beta=0.1,            # 偏离参考模型的强度
        loss_type="sigmoid", # 默认
        learning_rate=1e-6,  # 比 SFT 小
        bf16=True,
    ),
)
trainer.train()
```

::right::

# GRPOTrainer 组相对策略优化

DeepSeek-R1 等推理模型核心，无需 critic

```python
from trl import GRPOTrainer, GRPOConfig

def reward_fn(completions, ground_truth, **kw):
    # 比对生成答案与 ground_truth
    return [1.0 if ok else 0.0 for ...]

trainer = GRPOTrainer(
    model="Qwen/Qwen2.5-0.5B-Instruct",
    reward_funcs=reward_fn,
    train_dataset=dataset,
    args=GRPOConfig(output_dir="./grpo-out", bf16=True),
)
trainer.train()
```

> DPO 数据须有 chosen + rejected。

<!--
GRPO 按组生成 + 组相对优势，奖励函数返回等长 list[float]。
-->

---

# RLHF vs DPO vs GRPO

| 维度 | RLHF/PPO | DPO | GRPO |
|------|------|------|------|
| 需奖励模型 | 是 | 否（隐式） | 否（用函数） |
| 需价值模型 | 是 | 否 | 否 |
| 数据 | prompt+reward | preference 对 | prompt+奖励 |
| 在线采样 | 是 | 否（离线） | 是（组生成） |
| 稳定性 | 难调 | 稳定易实现 | 介于二者 |
| 典型用途 | 经典对齐 | 偏好对齐 | 推理（数学） |

> DPO 简化 RLHF，GRPO 解锁推理模型的强化学习。

<!--
三者各有定位：PPO 经典、DPO 简化、GRPO 推理。
-->

---

# TRL + PEFT 组合（QLoRA 微调）

所有 TRL 训练器原生支持 `peft_config=`

```python
from trl import SFTTrainer, SFTConfig
from peft import LoraConfig

trainer = SFTTrainer(
    model="Qwen/Qwen2.5-7B-Instruct",
    train_dataset=load_dataset("trl-lib/Capybara", split="train"),
    args=SFTConfig(output_dir="./qlora-sft", bf16=True, learning_rate=1e-4),
    peft_config=LoraConfig(r=64, lora_alpha=16,
        target_modules="all-linear", task_type="CAUSAL_LM"),
)
trainer.train()
```

> **铁律**：PEFT 训练 adapter 时，学习率比全量高一个数量级（SFT~1e-4，DPO~1e-5）。

<!--
QLoRA + SFT/DPO 是消费级 GPU 微调大模型的事实标准。
-->

---

# SFTConfig 默认值差异

TRL 的 SFTConfig 继承 TrainingArguments 但改了关键默认：

| 参数 | TrainingArguments | SFTConfig |
|------|------|------|
| `learning_rate` | `5e-5` | `2e-5` |
| `logging_steps` | `500` | `10` |
| `bf16` | `False` | `True`（若 fp16 未设） |
| `gradient_checkpointing` | `False` | `True` |
| `loss_type` | — | `chunked_nll`（省显存） |

> TRL 的 trainer 类与 config 字段随版本持续调整，旧脚本需跟进。

<!--
SFTConfig 默认值更贴合大模型微调场景。
-->

---
layout: quote
---

# PEFT 与 TRL 精髓

「LoRA 冻结基模只训 adapter，SFT 学指令、DPO 学偏好、GRPO 学推理——后训练流水线的全部精髓。」

---

# 陷阱与最佳实践

- **量化模型没调 prepare_model_for_kbit_training**：反传报错，QLoRA 必备
- **LoRA r 过小**：任务复杂时 r=8 可能欠拟合，升到 32/64
- **DPO 数据格式错**：必须有 chosen + rejected（非 completion）
- **GRPO 奖励函数返回长度不对**：必须返回与 completions 等长 list
- **用 PEFT 但学习率没调高**：adapter 训不动，SFT~1e-4
- **推理没合并/没加载 adapter**：保存的只是 adapter，需 merge 或 PeftModel 加载

> 极端任务（与基模差异大）下 PEFT 可能逊于全量微调。

<!--
PEFT 不是银弹，但性价比极高；RLHF/PPO 不稳定优先选 DPO。
-->

---
layout: center
class: text-center
---

# 小结

PEFT 冻结基模注入 adapter，TRL 覆盖对齐全链路

**LoRA · QLoRA · SFT · DPO · GRPO**

[PEFT 文档](https://huggingface.co/docs/peft) · [TRL 文档](https://huggingface.co/docs/trl)

<!--
QLoRA + SFT/DPO 是消费级 GPU 微调大模型的事实标准。
-->
