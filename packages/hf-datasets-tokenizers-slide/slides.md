---
theme: seriph
background: https://cover.sli.dev
title: Hugging Face Datasets 与 Tokenizers 完全指南
info: |
  Hugging Face Datasets 与 Tokenizers：Arrow 内存映射 · load_dataset · map · streaming · BPE/WordPiece/Unigram

  Learn more at [https://huggingface.co/docs/datasets](https://huggingface.co/docs/datasets) · [https://huggingface.co/docs/tokenizers](https://huggingface.co/docs/tokenizers)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Hugging Face Datasets 与 Tokenizers

数据与文本表示基础库 · Arrow · map · BPE

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Datasets 用 Arrow 零拷贝，Tokenizers 用 Rust 极速分词。
-->

---
transition: fade-out
---

# Datasets 与 Tokenizers 是什么

HF 生态中数据与文本表示的两大基础库

- **Datasets**：数据集加载/处理/分享库
- **Arrow 内存映射**：零拷贝读取，数据集可远超内存
- **load_dataset**：一行加载 Hub 20 万+ 数据集 + 本地多格式
- **Tokenizers**：Rust 实现的极速分词库（1GB <20s）
- **三算法**：BPE / WordPiece / Unigram 覆盖主流模型

> Datasets 的 `map` + Tokenizers 的 `encode` 是训练预处理标准管线

<!--
Arrow 内存映射是 Datasets 区别于 pandas 的核心优势。
-->

---

# Datasets：加载与查看

```python
from datasets import load_dataset

# 从 Hub 加载（自动下载并缓存）
ds = load_dataset("stanfordnlp/imdb", split="train")
print(ds)
# Dataset({ features: ['text', 'label'], num_rows: 25000 })

print(ds[0])               # 取第 0 行（dict）
print(ds["text"][0][:50])  # 取某列
print(ds.features)         # 查看列类型
```

> 底层是 Arrow 表，`ds[i]` 零拷贝读取，数据集可远大于内存。

<!--
ds[i] 是零拷贝，数据集可比 RAM 大，RAM 占用恒定。
-->

---
layout: two-cols
---

# load_dataset 加载来源

```python
# ① Hub 数据集（repo id）
ds = load_dataset("rajpurkar/squad")
ds = load_dataset("imdb", split="train")

# ② 本地文件（按扩展名推断）
ds = load_dataset("csv", data_files="train.csv")
ds = load_dataset("json", data_files="data.json")
ds = load_dataset("parquet", data_files="train.parquet")

# ③ 多 split 映射
ds = load_dataset("ns/ds",
    data_files={"train":"tr.csv","test":"te.csv"})

# ④ 切片
ds = load_dataset("imdb", split="train[:10%]")
```

::right::

# map / filter / select

```python
# map：返回新 Dataset
def add_prefix(ex):
    ex["text"] = "REVIEW: " + ex["text"]
    return ex
ds2 = ds.map(add_prefix)

# 批量 map（fn 接收列字典）
ds_tok = ds.map(
    lambda ex: tok(ex["text"], truncation=True),
    batched=True)

# filter：保留满足条件的行
ds_pos = ds.filter(lambda ex: ex["label"] == 1)

# select：按下标取行
ds_small = ds.select([0, 10, 100])
```

> **铁律**：map/filter/select **都返回新对象，不原地修改**。

<!--
记得接收返回值：ds = ds.map(...)。
-->

---

# map 进阶：批量与多进程

```python
# batched：fn 接收「列→值列表」字典，支持一对多拆分
ds = ds.map(tokenize_fn, batched=True,
            batch_size=1000, remove_columns=["text"])

# num_proc：多进程并行（shard 化数据集效果最好）
ds = ds.map(tokenize_fn, batched=True, num_proc=8)
```

**streaming 模式**

```python
# streaming=True 返回 IterableDataset，逐条产出，不必整体下载
ds = load_dataset("allenai/c4", "en", streaming=True, split="train")
for ex in ds:              # TB 级也能跑
    print(ex["text"][:30]); break
for ex in ds.take(3):
    print(ex)
```

> streaming 代价：无 `len()`、无随机访问、shuffle 近似（用 buffer）。

<!--
batched map 比逐条快得多；streaming 适合超大/在线数据。
-->

---

# Tokenizers：三种子词算法

| 算法 | 思路 | 代表模型 |
|------|------|------|
| **BPE** | 字符起，迭代合并最高频对 | GPT、LLaMA、Qwen |
| **WordPiece** | 贪心最长匹配，`##` 续接 | BERT、DistilBERT |
| **Unigram** | 最大化句子概率的子词集 | T5、ALBERT（+SentencePiece） |
| WordLevel | 纯词表映射，OOV 多 | 教学/简单场景 |

> 三算法都靠子词组合，几乎无 OOV。

<!--
BPE 自底向上、WordPiece 贪心、Unigram 自顶向下。
-->

---
layout: two-cols
---

# 加载已训练词表

```python
from tokenizers import Tokenizer

tokenizer = Tokenizer.from_pretrained("bert-base-uncased")

# 编码（文本 → token ids）
enc = tokenizer.encode("Hello, transformers!")
print(enc.ids)
# [101, 7592, 1010, 19081, 999, 102]
print(enc.tokens)
# ['[CLS]', 'hello', ',', 'transformers', '!', '[SEP]']

# 解码（ids → 文本）
print(tokenizer.decode(enc.ids))
```

::right::

# 训练 BPE tokenizer

```python
from tokenizers import Tokenizer
from tokenizers.models import BPE
from tokenizers.trainers import BpeTrainer
from tokenizers.pre_tokenizers import Whitespace

tokenizer = Tokenizer(BPE(unk_token="<unk>"))
tokenizer.pre_tokenizer = Whitespace()
trainer = BpeTrainer(
    vocab_size=30000,
    special_tokens=["<unk>", "<pad>", "<bos>", "<eos>"],
)
tokenizer.train(["corpus.txt"], trainer)
tokenizer.save("my-bpe.json")
```

> encode 输出含 offsets，支持对齐追踪。

<!--
Tokenizers 用 Rust 实现，训练与分词都极快。
-->

---

# Tokenizer 五组件

```
原始文本
  │
  ▼ Normalizer   归一化（lowercase/NFD/StripAccents）
  │
  ▼ PreTokenizer 预切分（Whitespace/ByteLevel）
  │
  ▼ Model        核心算法（BPE/WordPiece/Unigram）→ ids
  │
  ▼ PostProcessor 插特殊 token（[CLS]/[SEP]）
  │
  ▼ Decoder       ids → 可读文本
```

> Model 是必填组件，其余可选；Model 与 Decoder/PreTokenizer 必须匹配。

<!--
五大组件可自由组合构建任意分词器。
-->

---

# PostProcessor：特殊 token

```python
from tokenizers.processors import TemplateProcessing

# 给 BERT 风格加 [CLS] ... [SEP]
tokenizer.post_processor = TemplateProcessing(
    single="[CLS] $A [SEP]",
    pair="[CLS] $A [SEP] $B:1 [SEP]:1",
    special_tokens=[("[CLS]", 1), ("[SEP]", 2)],
)
```

- `$A`/`$B`：单/双序列占位
- `:1`/`:2`：type_id
- 漏配会导致模型输入与预训练不一致

> ByteLevel PreTokenizer 必须配 ByteLevel Decoder，否则乱码。

<!--
TemplateProcessing 模板化插入特殊 token 并设 type_id。
-->

---
layout: two-cols
---

# save / push_to_hub

```python
# 本地 Arrow（快、uncompressed）
ds.save_to_disk("./my-dataset")
ds = load_from_disk("./my-dataset")

# Hub Parquet（压缩、可分享）
ds.push_to_hub("user/my-dataset")
ds = load_dataset("user/my-dataset")  # 任何人一行加载
```

**DatasetDict 多 split**

```python
raw = load_dataset("nyu-mll/glue", "mrpc")
# 一次 map 所有 split
tokd = raw.map(lambda ex: tok(ex["sentence1"], ex["sentence2"],
                              truncation=True), batched=True)
```

::right::

# 与 Transformers 关系

AutoTokenizer 是 Tokenizers 的「高层封装」：

- **用现成模型** → 直接 `AutoTokenizer.from_pretrained`
  （已封装好 tokenizer.json + 特殊 token）
- **从零训练** → 用 `tokenizers` 库拼组件 + train，
  再转 `PreTrainedTokenizerFast` 接入 Transformers

> Tokenizers 也是 AutoTokenizer 的快速后端。

<!--
AutoTokenizer 已封装模型特定的特殊 token 与 chat template。
-->

---

# 陷阱与最佳实践

- **map/filter 返回新对象不接收**：必须 `ds = ds.map(...)`
- **shuffle 后变慢**：产生 indices mapping 慢约 10x，用 `flatten_indices()` 恢复
- **streaming 无 len()**：Trainer 配 streaming 必须设 `max_steps`
- **大数据集不限定 data_files**：load_dataset 全量下载（C4 约 13TB！）
- **Tokenizer 漏配 PostProcessor**：模型输入与预训练不一致
- **中文用错算法**：WordPiece 按空格切，中文无空格需配 PreTokenizer

> 缓存目录会膨胀，设 `HF_HOME` 改路径，定期清理。

<!--
Tokenizers 组件较底层，多数场景直接用 AutoTokenizer 更省事。
-->

---
layout: quote
---

# 数据与表示基石

「Arrow 让数据集零拷贝可超内存，Rust 让分词极速，map + encode 是训练预处理的标准管线。」

---

# 三算法对比

| 维度 | BPE | WordPiece | Unigram |
|------|------|------|------|
| **方向** | 自底向上 | 贪心最长匹配 | 自顶向下 |
| **确定性** | 是 | 是 | 否（选概率最高） |
| **续接标记** | 无 | `##` 前缀 | 无（▁ 表词首） |
| **代表** | GPT、LLaMA | BERT | T5、ALBERT |

> WordPiece/BPE/Unigram 对中文、emoji 表现不同，需按语言选算法。

<!--
中文处理需按语言选算法与预处理。
-->

---
layout: center
class: text-center
---

# 小结

Arrow 零拷贝 + Rust 极速分词，数据与表示的基石

**load_dataset · map · streaming · BPE/WordPiece/Unigram**

[Datasets 文档](https://huggingface.co/docs/datasets) · [Tokenizers 文档](https://huggingface.co/docs/tokenizers)

<!--
Datasets + Tokenizers 是 HF 生态的数据与表示基础。
-->
