---
theme: seriph
background: https://cover.sli.dev
title: Transformer 完全指南
info: |
  Transformer 完全指南：Self-Attention · Multi-Head · 位置编码四代 · 三大变体 · RoPE/ALiBi

  Learn more at [https://nlp.seas.harvard.edu/annotated-transformer/](https://nlp.seas.harvard.edu/annotated-transformer/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Transformer

完全基于注意力的序列架构 · Attention Is All You Need (2017)

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Transformer 摒弃 RNN/CNN，完全靠 Self-Attention 建模序列。
-->

---
transition: fade-out
---

# 为何取代 RNN

RNN 致命伤：逐步计算 + 长序列梯度消失

| 维度 | RNN | Transformer |
|------|------|------|
| **并行性** | ❌ 必须逐步 | ✅ 全并行 |
| **长程依赖** | O(n) 路径 | **O(1)** 直接交互 |
| **训练效率** | 低（GPU 利用差） | 高（充分利用 GPU） |
| **位置感知** | 天然有序 | 需额外位置编码 |

> 「Attention Is All You Need」——注意力机制确立核心地位。

<!--
Transformer 两大优势：全并行 + O(1) 长程依赖。
-->

---

# Self-Attention 核心公式

三要素：Query（查询）/ Key（键）/ Value（值）

```text
Attention(Q, K, V) = softmax(Q · K^T / √dk) · V

Q = X · W_Q   K = X · W_K   V = X · W_V
```

**直觉**：「我问(Q)，谁相关(K)，取它的内容(V)」

- Q·K^T：算每个位置与所有位置的相关性分数
- softmax：归一化成权重（和为 1）
- ·V：按权重加权求和 Value

> 除以 √dk 是数值稳定——dk 大时点积大，softmax 饱和梯度消失。

<!--
核心公式：QK^T 算相关性，softmax 归一化，加权 V。
-->

---

# 为何除以 √dk

点积方差随维度 dk 线性增长，导致 softmax 饱和

| 不除 √dk | 除 √dk |
|------|------|
| dk=64 时点积值大 | 方差缩回 1 量级 |
| softmax 进入饱和区 | softmax 分布正常 |
| 梯度接近 0（学习停滞） | 梯度健康 |

**经验**：√dk 比 dk 效果更好（方差恰好为 1）

> 这是数值稳定性技巧，不除会导致深网络训练崩溃。

<!--
√dk 缩放保证 softmax 梯度健康，是注意力稳定的关键。
-->

---
layout: two-cols
---

# Multi-Head Attention

单头只能学一种关系，多头并行捕捉不同子空间

```text
MultiHead = Concat(head_1, ..., head_h) · W_O

head_i = Attention(Q·W_Q_i, K·W_K_i, V·W_V_i)
```

- 原论文 **h=8 头**
- 每头维度 dk = d_model/h = 64
- 总参数量与单头相同

::right::

# 不同头学不同关系

- 语法关系（主谓）
- 语义相似
- 长距离指代
- 共指消解

> 8-16 头是常见配置。头太多每头维度太小信息不足。

<!--
多头让模型从不同子空间看关系，表达力更强。
-->

---

# 位置编码为何必要

Self-Attention **排列不变**——「猫咬狗」与「狗咬猫」输出相同！

**必须注入位置信息**才能感知语序

| 方案 | 类型 | 外推性 |
|------|------|------|
| Sinusoidal | 固定正余弦 | 一般 |
| 学习式绝对 | 可学习嵌入 | ❌ 无 |
| 相对（T5） | 距离偏置 | 中 |
| **RoPE** | 旋转 | ✅ 强 |
| **ALiBi** | 线性偏置 | ✅ 极强 |

> 不加位置编码是新手最易忽略的错误。

<!--
Self-Attention 排列不变，位置编码是必须的外挂。
-->

---
layout: two-cols
---

# 位置编码四代演进

**第一代：Sinusoidal**

- 固定 sin/cos 不同频率
- 无需训练，可外推

**第二代：学习式绝对**

- 每位置学一个嵌入
- BERT/GPT-2 用
- **无法外推**（512→1024 崩）

**第三代：相对（T5）**

- 编码 token 间距离
- 不兼容高效注意力

::right::

# 第四代：现代主流

**RoPE（旋转位置编码）**

- 位置表为复数旋转
- Q·K 只依赖相对位置
- 外推性强
- **LLaMA/Qwen/Mistral**

**ALiBi（线性偏置）**

- 免位置嵌入
- attention 加 `-m·距离`
- 外推极强
- **BLOOM/MPT**

> RoPE 是当前绝对主流。

<!--
RoPE 统一绝对与相对，外推性强，是现代 LLM 标配。
-->

---

# 三大变体

| 变体 | 代表 | 注意力 | 适用 |
|------|------|------|------|
| **Encoder-only** | BERT | 双向 | 理解：分类/NER/问答 |
| **Decoder-only** | GPT/LLaMA | 单向自回归 | 生成：对话/代码 |
| **Encoder-Decoder** | T5/Whisper | Enc双向+Dec单向 | 翻译/摘要 |

**Decoder-only 为何成主流**

- 生成任务天然自回归
- 结构简单、Scaling 友好
- 数据利用率高（每 token 是信号）
- GPT 证明涌现通用能力

> BERT 用于理解，GPT 用于生成，T5 用于翻译/摘要。

<!--
Decoder-only 因 Scaling 友好成为现代 LLM 绝对主流。
-->

---
layout: two-cols
---

# Encoder-Decoder 结构

**Encoder 块（2 子层）**

1. Multi-Head Self-Attention（双向）
2. Feed-Forward Network

**Decoder 块（3 子层）**

1. **Masked** Self-Attention（只看前面）
2. **Cross-Attention**（Q 来自 Dec，K/V 来自 Enc）
3. Feed-Forward Network

::right::

# 每子层外包

```text
output = LayerNorm(x + Sublayer(x))
```

- 残差连接：深网络梯度流通
- LayerNorm：稳定训练

**原论文参数**

- N=6 层 Enc + 6 层 Dec
- d_model=512, h=8
- dk=64, d_ff=2048

<!--
Encoder 双向，Decoder 掩码自回归 + 交叉注意力。
-->

---

# 注意力 O(n²) 之痛

序列长度 n 的注意力矩阵 n×n

| 序列长度 | 矩阵大小 | 显存(FP16) |
|------|------|------|
| 4K | 16M | 32 MB |
| 32K | 1G | 2 GB |
| 128K | 16G | 32 GB（单层！） |
| 1M | 1T | 爆炸 |

**优化方向**

- **Flash Attention**：分块 SRAM 计算，快 2-4x 省 5-20x 显存
- **稀疏注意力**：跳过部分位置
- **线性注意力**：近似降复杂度

<!--
O(n²) 是长上下文的主要瓶颈，Flash Attention 是标配优化。
-->

---
layout: quote
---

# KV Cache 是推理加速关键

「Decoder 自回归生成时，每步都要算所有历史 token 的注意力。KV Cache 缓存历史 K/V，每步从 O(t²) 降到 O(t)。代价是显存随序列线性增长。」

---

# Pre-Norm vs Post-Norm

深网络训练稳定性的关键差异

```text
Post-Norm（原论文）：LayerNorm(x + Sublayer(x))
Pre-Norm（现代主流）：x + Sublayer(LayerNorm(x))
```

**Pre-Norm 优势**

- 残差路径「干净」（无 LayerNorm 阻挡）
- 深网络梯度更稳定
- GPT-2 后几乎所有 LLM 都用

> 原论文 Post-Norm 训练深网络不稳定，现代全改 Pre-Norm。

<!--
Pre-Norm 让残差路径干净，是现代 LLM 训练稳定的关键。
-->

---
layout: center
class: text-center
---

# 小结

Transformer = 完全基于注意力的序列架构

**Self-Attention · 多头 · 位置编码 · 三大变体 · O(n²) 优化**

[Annotated Transformer](https://nlp.seas.harvard.edu/annotated-transformer/) · [原始论文](https://arxiv.org/abs/1706.03762) · [RoPE 详解](https://blog.eleuther.ai/rotary-embeddings/)

<!--
Transformer 是现代 LLM 的基石，理解它才能理解 GPT/BERT/LLaMA。
-->
