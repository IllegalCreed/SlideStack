---
theme: seriph
background: https://cover.sli.dev
title: Hugging Face Transformers 完全指南
info: |
  Hugging Face Transformers：pipeline · AutoModel · Trainer · generate · push_to_hub

  Learn more at [https://huggingface.co/docs/transformers](https://huggingface.co/docs/transformers)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Hugging Face Transformers

预训练模型推理与训练框架 · AutoModel · pipeline · 5.x

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
一套 API 横跨数千模型，Hub 100 万+ checkpoint。
-->

---
transition: fade-out
---

# Transformers 是什么

Hugging Face 维护的开源预训练模型推理与训练框架

- **模型覆盖碾压级**：Hub 100 万+ checkpoint，一行加载
- **AutoClass 自动化**：按 config 自动选实现类，不必记类名
- **pipeline 一行推理**：封装 tokenize + 模型 + 后处理
- **Trainer 全家桶**：fp16/bf16、FSDP/DeepSpeed、push_to_hub
- **三件套模型**：config + model + tokenizer/processor

> 当前主线 **v5.x**，与 LangChain 应用编排区分，本叶聚焦训练侧 API

<!--
核心定位：一套 API 横跨数千模型，覆盖推理与训练。
-->

---

# pipeline：一行推理

不指定模型时自动选该任务的默认 checkpoint

```python
from transformers import pipeline

# 任务名（非模型名）作第一位置参数
classifier = pipeline("text-classification")
print(classifier("I love HF!"))
# [{'label': 'POSITIVE', 'score': 0.9998}]

# 指定模型 + 批量 + 全标签
clf = pipeline("text-classification", model="bert-base-uncased")
clf(["Great!", "Terrible..."], top_k=None)
```

> **铁律**：`pipeline(task)` 第一参数是**任务名**，模型用 `model=` 传。

<!--
pipeline 封装了 tokenize + 模型 + 后处理，适合原型与脚本。
-->

---

# 任务 → pipeline 名对照

| 任务 | pipeline 名 | 典型 head |
|------|------|------|
| 文本分类 | `text-classification` | `*ForSequenceClassification` |
| 命名实体识别 | `token-classification` | `*ForTokenClassification` |
| 抽取式问答 | `question-answering` | `*ForQuestionAnswering` |
| 文本生成 | `text-generation` | `*ForCausalLM` |
| 掩码填充 | `fill-mask` | `*ForMaskedLM` |
| 零样本分类 | `zero-shot-classification` | `*ForSequenceClassification` |

> 任务名与 pipeline 返回结构一一对应。

<!--
每种任务对应一种 pipeline 与一个 *ForXxx head。
-->

---
layout: two-cols
---

# AutoModel 自动推断

不必记具体类名，AutoClass 按 config 自动选

```python
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
)

model_id = "bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForSequenceClassification.from_pretrained(
    model_id, num_labels=2)

inputs = tokenizer("Hello!", return_tensors="pt")
print(model(**inputs).logits.shape)  # [1, 2]
```

::right::

# 常用 AutoModel 变体

| AutoClass | 适用任务 |
|------|------|
| `AutoModel` | 取隐藏态 |
| `...SequenceClassification` | 文本分类 |
| `...TokenClassification` | NER |
| `...QuestionAnswering` | 抽取式 QA |
| `...CausalLM` | 自回归生成 |
| `...MaskedLM` | 掩码语言模型 |
| `...Seq2SeqLM` | T5/BART 生成 |

> 模型与 tokenizer 必须**同 model_id** 加载。

<!--
AutoClass 是 Transformers 的枢纽：按任务自动选实现类。
-->

---

# from_pretrained 加载语义

参数是 repo id（联网下载）或本地目录（save 产物）

```python
from transformers import AutoModelForCausalLM

# ① Hub repo id（自动下载并缓存）
model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-0.5B-Instruct")

# ② 本地目录（save_pretrained 产物）
model = AutoModelForCausalLM.from_pretrained("./my-model/")

# ③ 指定 dtype / revision / 设备分卡
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3.2-1B",
    dtype="bfloat16",   # v5：dtype 从 config 推断，可覆盖
    device_map="auto",  # 配合 accelerate 自动分卡
)
```

> 同 repo id + revision 第二次加载直接命中缓存。

<!--
from_pretrained 是 AutoClass 与具体模型类共用的加载入口。
-->

---
layout: two-cols
---

# save / push_to_hub

```python
# 保存到本地目录
model.save_pretrained("./my-model")
tokenizer.save_pretrained("./my-model")
# 生成 config.json + 权重 + tokenizer

# 上传到 Hub（需 huggingface-cli login）
model.push_to_hub("user/my-model")
tokenizer.push_to_hub("user/my-model")

# 之后任何人都能一行加载
model = AutoModel.from_pretrained("user/my-model")
```

::right::

# 模型架构覆盖

| 类型 | 代表架构 |
|------|------|
| 编码器 | BERT、RoBERTa |
| 解码器 | GPT、LLaMA、Qwen |
| 编码解码 | T5、BART |
| 多模态 | CLIP、Whisper |

加载方式完全统一——`AutoModelFor*` + `from_pretrained`。

> save_pretrained 与 from_pretrained 互为逆操作。

<!--
目录结构是跨框架、跨工具通用的标准格式。
-->

---

# Trainer 训练框架

封装完整的训练/评估/预测循环，省去手写 optimizer/scheduler

```python
from transformers import TrainingArguments, Trainer, DataCollatorWithPadding

args = TrainingArguments(
    output_dir="./imdb-bert", num_train_epochs=3,
    per_device_train_batch_size=16, learning_rate=2e-5,
    eval_strategy="epoch", save_strategy="epoch",
    load_best_model_at_end=True, bf16=True,
)
trainer = Trainer(
    model=model, args=args,
    train_dataset=tokenized["train"],
    eval_dataset=tokenized["test"],
    data_collator=DataCollatorWithPadding(tokenizer=tokenizer),
    compute_metrics=compute_metrics,
)
trainer.train()
```

> **铁律**：dataset 列名应与模型输入键对齐，标签列默认叫 `labels`。

<!--
Trainer 内置混合精度、梯度累积、checkpoint、分布式、上传。
-->

---

# TrainingArguments 关键参数

| 参数 | 默认 | 作用 |
|------|------|------|
| `num_train_epochs` | `3.0` | 训练总轮数 |
| `per_device_train_batch_size` | `8` | 每卡训练 batch |
| `learning_rate` | `5e-5` | 初始学习率 |
| `eval_strategy` | `"no"` | 评估时机 no/steps/epoch |
| `save_strategy` | `"steps"` | 保存时机 no/steps/epoch/best |
| `fp16`/`bf16` | `False` | 混合精度（二选一） |

> v5 改名：`evaluation_strategy`→`eval_strategy`、`tokenizer`→`processing_class`。

<!--
参数改名历史多，遇旧脚本报错先查版本变更。
-->

---
layout: two-cols
---

# 混合精度与显存优化

```python
args = TrainingArguments(
    output_dir="./model",
    bf16=True,                    # Ampere+ 优先，无需 loss scaling
    gradient_accumulation_steps=4,# 小 batch 累积模拟大 batch
    gradient_checkpointing=True,  # 重算激活省显存
    per_device_train_batch_size=4,
    optim="adamw_torch_fused",    # fused 优化器更快
)
```

**bf16 vs fp16**

- bf16 范围同 fp32，不溢出，无需 loss scaling
- 有效 batch = batch × devices × accum

::right::

# 分布式训练

```python
# FSDP（PyTorch 原生，推荐）
args = TrainingArguments(
    output_dir="./llama-fsdp",
    fsdp="full_shard auto_wrap",
    bf16=True,
)

# DeepSpeed（极致大模型）
args = TrainingArguments(
    output_dir="./big-model",
    deepspeed="ds_config.json",
)
```

启动用 accelerate 或 torchrun：

```bash
accelerate launch --num_processes=4 train.py
```

> 大模型直接加载 OOM：先试 `device_map="auto"` + bf16。

<!--
bf16 + gradient_checkpointing + accumulate 是省显存三件套。
-->

---

# generate 文本生成

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained(
    "Qwen/Qwen2.5-0.5B-Instruct", dtype="bfloat16", device_map="auto")
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-0.5B-Instruct")

inputs = tokenizer("The capital of France is", return_tensors="pt").to(model.device)

# 采样解码（多样）
out = model.generate(**inputs, max_new_tokens=50,
    do_sample=True, temperature=0.7, top_p=0.9,
    top_k=50, repetition_penalty=1.1)
print(tokenizer.decode(out[0], skip_special_tokens=True))
```

> 用 `max_new_tokens`（生成数）而非旧 `max_length`（总长度）。

<!--
generate 解码参数多，temperature/top_p/top_k 组合需经验。
-->

---

# generate 解码参数

| 参数 | 作用 |
|------|------|
| `max_new_tokens` | 生成的最大 token 数（推荐） |
| `do_sample` | False=贪心，True=采样 |
| `temperature` | 越高越发散，0 退化贪心 |
| `top_k` | 只在概率最高 k 个里采样 |
| `top_p` | nucleus sampling，累计概率达 p |
| `num_beams` | 束搜索宽度（>1 启用 beam） |
| `repetition_penalty` | 抑制重复 token |

> temperature=0 退化为贪心；beam search 与 sampling 互斥。

<!--
调出稳定输出需经验：贪心确定但重复，采样多样但发散。
-->

---
layout: quote
---

# Transformers 训练万能模板

「pipeline 一行推理，AutoModel 自动选类，Trainer 全家桶训练，generate 多样生成，push_to_hub 一键分享——这就是 Transformers 的精髓。」

---

# 陷阱与最佳实践

- **tokenizer 与 model 不同源**：必须同 model_id，否则 vocab 不匹配
- **labels 列名**：Trainer 默认找 `labels`，改名要 `args.label_names`
- **dtype 默认值变了**：v5 起从 config 推断，显式 `dtype="float32"` 固定
- **fp16 与 bf16 同开**：会报错，二选一
- **streaming dataset 无长度**：必须设 `max_steps`
- **大模型直接加载 OOM**：先试 `device_map="auto"` + bf16，再上量化/FSDP

> 极致吞吐场景（高 QPS、长上下文）仍需 vLLM/TGI 专用引擎。

<!--
Trainer 抽象有天花板，高度定制化训练回原生 PyTorch 或转 TRL。
-->

---
layout: center
class: text-center
---

# 小结

Transformers = AutoModel + pipeline + Trainer + generate

**三件套模型 · 一行推理 · 全家桶训练 · 一键分享**

[Transformers 文档](https://huggingface.co/docs/transformers) · [GitHub](https://github.com/huggingface/transformers)

<!--
一套 API 横跨数千模型，覆盖推理与训练。
-->
