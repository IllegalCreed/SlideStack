---
theme: seriph
background: https://cover.sli.dev
title: 循环神经网络（RNN）完全指南
info: |
  循环神经网络（RNN）完全指南：隐藏状态 · 梯度消失爆炸 · LSTM 门控 · GRU · Seq2Seq · Attention 雏形

  Learn more at https://web.stanford.edu/class/cs224n/
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 循环神经网络（RNN）

为序列数据设计的神经网络 · 隐藏状态记忆时序依赖

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
RNN 在时间步之间引入隐藏状态作为记忆，建模当前输出依赖历史上下文的时序依赖。它是理解 Attention 为何被发明、为何有效的前提，也是孕育 Transformer 的孵化器。
-->

---
transition: fade-out
---

# RNN 是什么

处理**序列数据**的神经网络，核心是引入**时间维度上的循环连接**：每个时间步把新输入与上一时刻隐藏状态融合。

```text
时间步：  t=1      t=2      t=3      ...   t=T
输入：    x_1      x_2      x_3             x_T
        ┌─────┐ ┌─────┐ ┌─────┐        ┌─────┐
隐藏态：  │RNN │→│RNN │→│RNN │→ ... → │RNN │   ← 共享同一组权重 W_h, W_x
        └─────┘ └─────┘ └─────┘        └─────┘
输出：    h_1      h_2      h_3             h_T
```

> `h_t` 是截至第 t 步所有历史信息的压缩表示，每个时间步复用同一组权重——这是「循环」的本质。

<!--
RNN 在每个时间步 t 接收当前输入 x_t 与上一时刻隐藏状态 h_{t-1}，计算出新的隐藏状态 h_t，既作为该步输出表示也作为记忆传给下一步。所有 RNN 单元共享同一组权重 W_h 和 W_x，这是循环的本质也是参数高效的原因。权重共享让 RNN 同时解决 MLP 处理序列的三大问题：长度固定、位置无关、参数不共享。
-->

---
transition: fade-out
---

# 朴素 RNN 与梯度问题

```text
h_t = tanh(W_h · h_{t-1} + W_x · x_t + b)
反向：∂L/∂h_1 = ∂L/∂h_T · Π(t=2..T) ∂h_t/∂h_{t-1)   ← 连乘 T 个雅可比
```

| 问题 | 原因 | 后果 |
| --- | --- | --- |
| **梯度消失** | 连乘因子 \|·\| < 1 | 梯度指数衰减到 0，浅层不更新，记不住远距离 |
| **梯度爆炸** | 连乘因子 \|·\| > 1 | 梯度指数增长到 NaN，训练崩溃 |

> cs224n 经验：朴素 RNN 实际只能学到约 20 步以内的依赖。要学长距离依赖必须用 LSTM 或 GRU。

<!--
朴素 RNN 的更新公式是 h_t 等于 tanh 作用于 W_h 乘以上一时刻隐藏状态加 W_x 乘以当前输入加偏置。反向传播时损失对早期隐藏态的梯度需要连乘 T 个雅可比矩阵。两个极端：连乘因子绝对值小于 1 时梯度指数级衰减到 0，浅层即早期时间步参数几乎不更新，网络记不住远距离信息，这是朴素 RNN 在长序列上失效的根本原因；连乘因子大于 1 时梯度指数级增长到 NaN 训练直接崩溃。梯度爆炸的对策是梯度裁剪，把梯度范数截断到上限。梯度消失的对策是换用门控架构 LSTM 或 GRU，它们的细胞状态梯度近似为 1 可长距离无衰减流动。
-->

---
layout: two-cols
---

# PyTorch RNN 入门

```python
# 朴素 RNN（教学用，实际少用）
rnn = nn.RNN(input_size=64, hidden_size=128,
             num_layers=1, batch_first=False)
x = torch.randn(10, 32, 64)      # [seq, batch, feat]
output, h_n = rnn(x)             # h_n: [1, 32, 128]

# LSTM（推荐，解决梯度消失）
lstm = nn.LSTM(64, 128, num_layers=2,
               batch_first=True, dropout=0.5)
output, (h_n, c_n) = lstm(x)     # 多返回 cell state
```

::right::

<div class="pl-4">

## 维度坑

默认输入 `[seq, batch, feat]`，与直觉相反

```python
# 设 batch_first=True 改成
# [batch, seq, feat] 更顺手
lstm = nn.LSTM(64, 128, batch_first=True)
```

> LSTM 与 RNN/GRU 返回值不同：LSTM 额外返回细胞状态 `c_n`。

</div>

<!--
PyTorch RNN 入口有三个：nn.RNN 朴素版本、nn.LSTM 推荐、nn.GRU 更轻量。维度坑：PyTorch RNN 默认输入是 seq_len batch input_size 与多数直觉相反，设 batch_first 等于 True 可改成 batch 在前后续处理更顺手。LSTM 与 RNN 和 GRU 的返回值不同，LSTM 额外返回细胞状态 c_n。训练 RNN 时梯度裁剪几乎必备，torch.nn.utils.clip_grad_norm_ 把梯度范数截断到上限，max_norm 等于 5.0 是常用经验值，防止梯度爆炸把权重打飞。
-->

---
transition: fade-out
---

# LSTM 门控机制

通过**细胞状态传送带 + 三道门**解决梯度消失。关键：加法更新的梯度近似为 1，可长距离无衰减流动。

| 门 | 公式 | 作用 |
| --- | --- | --- |
| **遗忘门 f** | `σ(W_f·[h_{t-1},x_t])` | 决定保留多少旧信息（0 全弃，1 全留） |
| **输入门 i** | `σ(W_i·[h_{t-1},x_t])` | 决定写入多少新信息 |
| **输出门 o** | `σ(W_o·[h_{t-1},x_t])` | 决定读出多少到隐藏态 |

```text
C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t   ← 传送带更新（遗忘旧 + 写入新）
h_t = o_t ⊙ tanh(C_t)              ← 输出门控制读出
```

> 细胞状态是「长期记忆」可跨数百步，隐藏状态是「短期输出」每步更新——像有擦写控制的笔记本。

<!--
LSTM 通过精心设计的门控解决朴素 RNN 的梯度消失。细胞状态 C_t 像传送带，沿时间步线性流动，信息加上去或移除都由门控制，关键是这个加法更新的梯度近似为 1，梯度可以沿传送带长距离回流而不衰减，这是 LSTM 能学长距离依赖的数学根基。三道门：遗忘门决定细胞状态每个维度保留多少旧信息；输入门决定写入多少新信息；输出门决定细胞状态有多少输出到隐藏状态。完整前向六步：先遗忘决定该忘什么，再候选生成新信息，输入门决定写入多少，更新细胞传送带，输出门决定读出多少，最后算隐藏态。直觉上细胞状态是长期记忆可跨数百步，隐藏状态是短期输出每步更新，LSTM 像一个有擦写控制的笔记本。
-->

---
transition: fade-out
---

# GRU：LSTM 的轻量化

把 LSTM 三门简化为两门，合并细胞状态与隐藏状态，参数少 25%、训练更快，多数任务效果与 LSTM 相当。

| LSTM | GRU | 简化点 |
| --- | --- | --- |
| 遗忘门 f + 输入门 i | **更新门 z** | 合并控制新旧比例 |
| 独立细胞状态 C | 隐藏态 h 兼任 | 不再维护传送带 |
| 输出门 o | **重置门 r** | 控制候选用多少旧记忆 |

```text
z_t = σ(W_z·[h_{t-1}, x_t])              # 更新门
h_t = (1 - z_t) ⊙ h_{t-1} + z_t ⊙ h̃_t   # 1-z 与 z 互补更新
```

> 选择建议：**新项目优先 GRU**——参数少、训练快、效果通常持平。长距离极敏感任务可对比 LSTM。

<!--
GRU 把 LSTM 的三门简化为两门，合并细胞状态与隐藏状态，参数更少训练更快，多数任务效果与 LSTM 相当。更新门 z 合并了 LSTM 的遗忘门和输入门，直接控制新旧状态比例，注意更新公式是 1 减 z 与 z 互补。重置门 r 控制计算候选隐藏态时用多少旧记忆，替代了 LSTM 的输出门。选择建议：新项目优先 GRU，参数少 25%、训练快、效果通常与 LSTM 持平。若任务对长距离依赖极敏感如长文档摘要，可对比 LSTM 看是否有提升。
-->

---
transition: fade-out
---

# 双向 RNN

单向 RNN 的 `h_t` 只看左侧上下文，但理解常需右侧（如「我喜欢吃___」要填词得看后面）。**双向 RNN** 同时跑正向与逆向，拼接两者隐藏态。

```python
lstm = nn.LSTM(64, 128, batch_first=True, bidirectional=True)
# 输出 shape: [B, seq_len, 256]  ← 正向 128 + 逆向 128 拼接
```

<v-clicks>

- **优点**：每个位置都有完整左右上下文，表示质量显著提升
- **限制**：必须拿到完整序列才能跑，**不能用于实时流式**
- **用途**：离线 NLP（NER、句法分析、文本分类）几乎都用双向

</v-clicks>

> 生成任务（翻译解码器、语言模型）不能随意用双向——生成时未来词还未产生，无法看右侧。

<!--
单向 RNN 的 h_t 只看到左侧上下文，但语言理解常需右侧上下文，比如我喜欢吃后面要填什么得看后面。双向 RNN 同时跑正向与逆向两个 RNN，把两者的隐藏态拼接，每个位置都有完整左右上下文表示质量显著提升。但限制是必须拿到完整序列才能跑不能用于实时流式，比如语音识别实时转写、在线翻译。用途上离线 NLP 任务如命名实体识别、句法分析、文本分类几乎都用双向。注意双向 RNN 在生成任务中不能随意用，因为生成时未来词还未产生无法看右侧，它主要用在理解型任务上。
-->

---
transition: fade-out
---

# Seq2Seq 与 Attention 雏形

**Seq2Seq**：编码器把变长输入压成上下文向量 c，解码器从 c 展开生成输出（机器翻译开山范式）。

```text
编码器：我→爱→编→程 ──→ 上下文向量 c ──→ 解码器：I→love→coding
Attention：解码每步对编码器所有隐藏态算权重，加权求和得专属上下文 c_t
```

<v-clicks>

- **致命瓶颈**：基础 Seq2Seq 把整个输入压成**固定长度单一向量**，输入越长信息丢失越严重
- **Attention 突破**：解码器「直连」编码器任意位置，无需信息逐步传递
- **革命性**：Vaswani 2017 推到极致——干脆**完全抛弃 RNN 只用 Attention**，即 Transformer

</v-clicks>

> Attention 让解码器动态关注编码器不同位置而非依赖单一向量——这是 Transformer 的思想起点。

<!--
Seq2Seq 把变长输入序列映射到变长输出序列，是机器翻译、摘要、对话的开山范式。编码器 LSTM 读完整个输入序列把最终隐藏状态作为上下文向量 c，解码器以 c 为初始状态逐步生成输出。致命瓶颈是基础 Seq2Seq 把整个输入压成固定长度的单一向量 c，输入越长信息损失越严重，这是 Seq2Seq 在长句翻译上崩盘的根本原因。为破解这个瓶颈 Bahdanau 2014 提出 Attention：解码每一步不再依赖固定 c，而是动态计算对编码器每个隐藏态的关注权重加权求和。Attention 的革命性在于让解码器直连编码器任意位置无需信息逐步传递，这一思想被 Vaswani 2017 推到极致，干脆完全抛弃 RNN 只用 Attention，这就是 Transformer。
-->

---
transition: fade-out
---

# 为何 RNN 被 Transformer 取代

2017 年「Attention Is All You Need」发表后，RNN 在 NLP 主力任务上迅速被取代。三个工程动因：

| RNN 的缺陷 | Transformer 的解法 |
| --- | --- |
| **串行计算**：`h_t` 依赖 `h_{t-1}`，无法并行 | **全并行**：Self-Attention 同时算所有位置对 |
| **长距离建模弱**：即便门控仍需逐步传递衰减 | **直接直连**：任意两位置一步交互，距离无衰减 |
| **单一上下文瓶颈**：Seq2Seq 压成固定向量 | **动态聚合**：每步对全部位置动态加权 |

> RNN 仍保留场景：资源受限设备、实时流式、传统时序预测、教学。掌握 RNN 是理解 Attention 的前提。

<!--
2017 年 Attention Is All You Need 发表后 RNN 在 NLP 主力任务上迅速被 Transformer 取代，三个工程动因。第一串行计算无法并行，h_t 依赖 h_{t-1} 无法在时间步上并行训练速度远慢于可并行的 Transformer，Self-Attention 同时计算所有位置对 GPU 充分利用。第二长距离建模仍弱，即便有门控信息仍需逐步传递远距离信号衰减，Transformer 任意两位置一步 Attention 即可交互距离无衰减。第三单一上下文瓶颈，Seq2Seq 把输入压成固定向量，Transformer 每步对全部位置动态加权无信息瓶颈。结果：机器翻译、语言模型、文本分类 NER 全部转向 Transformer。RNN 仍保留在资源受限设备、实时流式、传统时序预测、教学场景，掌握 RNN 仍是理解 Attention 为何被发明为何有效的前提。
-->

---
layout: center
class: text-center
---

# 小结

RNN 用隐藏状态在时间步间传递记忆，门控变体 LSTM/GRU 缓解梯度消失，最终因串行计算与长距离瓶颈被 Transformer 取代。

**隐藏状态 · LSTM 门控 · GRU 简化 · Seq2Seq · Attention 雏形**

[cs224n NLP 课程](https://web.stanford.edu/class/cs224n/) · [Understanding LSTM Networks](https://colah.github.io/posts/2015-08-Understanding-LSTMs/)

<!--
总结：RNN 用隐藏状态在时间步之间传递记忆，建模时序依赖。朴素 RNN 因梯度连乘导致消失或爆炸只能学约 20 步依赖。LSTM 用细胞状态传送带加三道门让信息长距离无衰减流动，GRU 简化为两门参数更少效果相当。Seq2Seq 把变长输入压成单一向量是致命瓶颈，催生了 Attention 让解码器直连任意位置，最终演化为完全抛弃 RNN 的 Transformer。RNN 虽被取代，但掌握它是理解 Attention 为何被发明、为何有效的前提。新项目默认应选 Transformer 或至少 LSTM/GRU。谢谢大家。
-->
