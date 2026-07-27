---
theme: seriph
background: https://cover.sli.dev
title: 神经网络完全指南
info: |
  神经网络完全指南：感知机与MLP · 前向与反向传播 · 激活函数 · 损失与优化器 · 初始化与正则化

  Learn more at https://cs231n.github.io/neural-networks-1/
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 神经网络

层叠非线性变换的端到端特征学习 · 多层感知机 MLP

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
神经网络是深度学习的公共地基：CNN、RNN、Transformer 都只是「如何组织连接拓扑」的变体，可学习权重、梯度下降、反向传播这套机制完全一致。
-->

---
transition: fade-out
---

# 神经网络是什么

把生物学「神经元」抽象为可微算子，通过**层叠的非线性变换**从数据端到端学习特征表示。

<v-clicks>

- **感知机**：单层线性神经元，做二分类（等价逻辑回归）
- **多层感知机 MLP**：至少一个隐藏层，靠通用近似定理拟合任意连续函数
- **前向传播**：`a = activation(W·x + b)`，逐层矩阵乘 + 激活
- **反向传播**：链式法则把 `∂L/∂y` 逐层回传成 `∂L/∂W`
- **优化器更新**：SGD / Momentum / Adam 按梯度方向走

</v-clicks>

> 工程价值在「可微 + 链式法则 + 梯度下降」，让上亿参数联合优化可计算。

<!--
真正价值不在生物学类比，而在数学机制：可微算子加链式法则加梯度下降，这套机制让上亿参数的联合优化变得可计算。
-->

---
transition: fade-out
---

# 感知机 vs MLP

| 维度 | 感知机（单层） | MLP（多层） |
| --- | --- | --- |
| **结构** | 输入直连输出，无隐藏层 | 至少一个隐藏层 |
| **表达能力** | 仅线性可分（解不了 XOR） | 通用近似，拟合任意连续函数 |
| **决策边界** | 超平面 | 任意非线性曲面 |
| **训练** | 感知机算法 / 逻辑回归 | 反向传播 + 梯度下降 |
| **典型用途** | 线性二分类基线 | 函数逼近、特征学习主干 |

> 经典例：单层感知机解不了 XOR，加一个 2 单元隐藏层 + ReLU 即可——「深度」必要性的最小演示。

<!--
XOR 是深度必要性的最小演示：单层感知机解决不了异或，但加一个 2 单元隐藏层加 ReLU 就能解决，这正是隐藏层引入非线性的价值。
-->

---
layout: two-cols
---

# 第一个神经网络

MNIST 手写数字，3 层 MLP：

```python
class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Flatten(),
            nn.Linear(784, 128), nn.ReLU(), nn.Dropout(0.2),
            nn.Linear(128, 64),  nn.ReLU(), nn.Dropout(0.2),
            nn.Linear(64, 10),  # logits，不加激活
        )
    def forward(self, x):
        return self.net(x)
```

::right::

<div class="pl-4">

## 训练四步循环

```python
for X, y in loader:
    pred = model(X)              # 前向
    loss = loss_fn(pred, y)      # 算损失
    optimizer.zero_grad()        # 清旧梯度
    loss.backward()              # 反向求导
    optimizer.step()             # 更新参数
```

> GPU 上 30 秒训到 97%，换数据集只改 DataLoader。

</div>

<!--
MNIST 是神经网络的 Hello World：3 层 MLP 在 GPU 上 30 秒可训到 97% 准确率。换数据集只需改 DataLoader，模型结构和训练循环完全通用。四步循环是所有神经网络训练的通用骨架：前向、算损失、清梯度、反向、更新。
-->

---
transition: fade-out
---

# 前向传播与反向传播

**前向**：数据从输入层逐层流到输出层，每层做线性变换 + 非线性激活。

```text
x → [Linear W₁x+b₁] → ReLU → [Linear W₂x+b₂] → ReLU → [Linear W₃+b₃] → logits
反向：∂L/∂W = ∂L/∂a · ∂a/∂z · ∂z/∂W ← 沿计算图逐层回传
```

<v-clicks>

- **隐藏层必须加激活**：否则多层线性堆叠等价于单层（`W₂(W₁x) = (W₂W₁)x`）
- **输出层不加激活**：分类 Softmax 放进 `CrossEntropyLoss` 内部，避免数值不稳
- **autograd 自动求导**：`loss.backward()` 沿计算图回传，梯度存入 `.grad`
- **必须 zero_grad**：PyTorch 默认梯度累加，不清零会把上一 batch 叠进来

</v-clicks>

<!--
前向传播是数据从输入层逐层流到输出层的过程，每层做两件事：线性变换 W·x+b，再过非线性激活。如果所有隐藏层都是纯线性，多层堆叠等价于一个单层线性变换，完全失去拟合非线性的能力，网络退化成感知机。反向传播用链式法则计算损失对每个参数的偏导。PyTorch 的 autograd 在前向时自动构建计算图并缓存中间值，调用 loss.backward 时沿图反向遍历，对每个 requires_grad 为真的张量算出梯度并存入 grad 属性。清梯度是必做动作，PyTorch 默认梯度累加，每个 batch 开头务必 optimizer.zero_grad。
-->

---
transition: fade-out
---

# 激活函数选型

| 名称 | 公式 | 优点 | 适用 |
| --- | --- | --- | --- |
| **ReLU** | `max(0,x)` | 计算快、非饱和、稀疏激活 | **隐藏层默认首选** |
| **Leaky ReLU** | `max(αx,x)` | 解决死亡 ReLU | ReLU 失声备选 |
| **GELU** | `x·Φ(x)` | 处处可微、平滑 | BERT/GPT |
| **SiLU/Swish** | `x·σ(x)` | 平滑、自门控 | 现代大模型 |
| **Sigmoid** | `1/(1+e⁻ˣ)` | 输出可解释为概率 | 仅输出层二分类 |

> cs231n 明确建议：**ReLU 是默认非线性的首选**。Sigmoid 做隐藏层会饱和杀梯度，深层训不动。

<!--
激活函数引入非线性，是神经网络区别于线性回归的本质。cs231n 重点对比几个经典激活函数。ReLU 是默认首选：计算快、非饱和加速收敛、稀疏激活，唯一缺点是负区梯度恒零可能导致神经元死亡。Sigmoid 有两大坑：饱和区梯度近零 kill gradient，输出非零均值致 zig-zag 更新，所以深层隐藏层避免用 Sigmoid。新项目从 ReLU 起步，遇死亡神经元再换 GELU 或 Leaky ReLU。Transformer 选 GELU 或 SiLU。
-->

---
transition: fade-out
---

# 损失函数选型

| 任务 | 损失 | PyTorch | 要点 |
| --- | --- | --- | --- |
| **回归** | MSE | `nn.MSELoss()` | 对大误差敏感 |
| **多分类** | 交叉熵 | `nn.CrossEntropyLoss()` | 内含 Softmax，输入 **logits** |
| **二分类** | 二元交叉熵 | `nn.BCEWithLogitsLoss()` | 内含 Sigmoid |
| **类别极不平衡** | Focal Loss | 自定义 | `(1-p_t)^γ · CE`，γ=2 |

> 切勿手动 Softmax 后再传 CrossEntropyLoss，会做两次导致数值错误。直接传 logits。

<!--
损失函数告诉网络预测得有多错，直接决定优化方向。回归用 MSE 对大误差敏感，或用 MAE 对异常值鲁棒。多分类用 CrossEntropyLoss，它内部先对 logits 做 Softmax 再算负对数似然，所以输入必须是原始 logits 不能是概率，y 是类索引不是 one-hot。二分类用 BCEWithLogitsLoss 内部已含 Sigmoid。Focal Loss 用 1 减 p_t 的 gamma 次方把已分对样本的损失权重压低，让网络聚焦难分样本，在目标检测正负样本比 1 比 1000 中效果显著。
-->

---
transition: fade-out
---

# 优化器对比

| 优化器 | 核心思想 | 默认超参 | 适用 |
| --- | --- | --- | --- |
| **SGD** | 沿负梯度方向走 | lr=0.01 | 简单任务 |
| **SGD+Momentum** | 引入「速度」累积方向 | lr=0.1, μ=0.9 | 大模型精调（CV） |
| **RMSProp** | 自适应学习率 | lr=0.001, ρ=0.9 | RNN、非平稳目标 |
| **Adam** | Momentum + RMSProp | lr=0.001, β=(0.9,0.999) | **默认首选** |

```python
optim.Adam(model.parameters(), lr=1e-3)  # 默认首选
optim.SGD(model.parameters(), lr=0.1, momentum=0.9, weight_decay=1e-4)  # CV 精调
```

> cs231n 结论：**Adam 是当前推荐的默认算法**。ImageNet 级 CV 精调可换 SGD+Momentum。

<!--
优化器决定拿到梯度后如何更新参数。三大流派：SGD 沿负梯度走，SGD 加 Momentum 引入速度累积方向，RMSProp 自适应学习率按梯度平方衰减。Adam 是 Momentum 加 RMSProp：一阶动量 m 提供方向，二阶动量 v 提供自适应步长，还有偏差校正。新项目从 Adam 起步，默认 lr 等于 1e-3。若做 ImageNet 级 CV 大模型精调追求极致泛化，考虑 SGD 加 Momentum，带 weight_decay 后泛化常优于 Adam。
-->

---
layout: two-cols
---

# 正则化与归一化

**Dropout**：训练时按概率 `p` 随机置零神经元，强制网络不依赖单一单元。

```python
nn.Dropout(p=0.5)          # 全连接层常用
nn.BatchNorm1d(128)        # 按 batch 归一，CNN 友好
nn.LayerNorm(128)          # 按特征归一，Transformer/RNN 友好
```

::right::

<div class="pl-4">

## BN vs LN 一句话

- **BatchNorm**：跨样本归一
  - 依赖 batch size（<8 失效）
  - CNN 友好
- **LayerNorm**：跨特征归一
  - batch 无关
  - RNN/Transformer 友好

> Transformer 一律用 LN。推理前务必 `model.eval()` 切换。

</div>

<!--
正则化与归一化防止过拟合、稳定训练。Dropout 训练时按概率 p 随机把神经元置零，强制网络不依赖单一神经元，相当于训练指数级多个子网络的集成，PyTorch 用 model.eval 自动切换推理模式。BatchNorm 在层与激活之间归一化，强制每层输入分布稳定，让网络对初始化更鲁棒可用更大学习率，但它依赖 batch size 太小统计量不准。LayerNorm 按特征维度对单个样本归一，与 batch size 无关，这是 RNN 和 Transformer 选 LN 不选 BN 的根本原因。一句话：BN 跨样本归一 CNN 友好，LN 跨特征归一序列模型友好，Transformer 一律用 LN。
-->

---
transition: fade-out
---

# 初始化与学习率

**权重初始化**决定训练能否起步。全零初始化让所有神经元对称（梯度相同），永远学不到差异化特征。

| 初始化 | 公式 | 适用 |
| --- | --- | --- |
| **零初始化** | `W=0` | **禁用**（对称性破坏失败） |
| **Xavier/Glorot** | `sqrt(2/(fan_in+fan_out))` | Tanh / Sigmoid |
| **He/Kaiming** | `sqrt(2/fan_in)` | ReLU 系（默认） |

> 学习率是第一超参：太大 loss 震荡甚至 NaN，太小收敛极慢。Adam `1e-3`、SGD `1e-2` 起步，配 Step/Cosine 衰减。

<!--
初始化决定训练能否起步。全零初始化会让所有神经元对称，前向相同反向梯度相同，网络永远等价于单神经元。PyTorch 线性层默认就是 Kaiming uniform 多数情况无需改。ReLU 系必须用 He 否则容易训练崩溃，Tanh 和 Sigmoid 用 Xavier。cs231n 警告初始化不当会导致前向值爆炸或反向梯度消失。学习率是最重要的单一超参，太大 loss 震荡甚至 NaN 梯度爆炸，太小收敛极慢可能卡局部最优。衰减策略有 Step 每 10 epoch 乘 0.1、Cosine 余弦退火、Warmup 先升后降是 Transformer 训练标配。
-->

---
transition: fade-out
---

# 反模式 Top 7

<v-clicks>

- **Sigmoid 做隐藏层激活** → 梯度全饱和消失，深层训不动
- **全零初始化** → 神经元对称，网络永远等价单神经元
- **手动 Softmax 后传 CrossEntropyLoss** → 概率压到极小，数值错误
- **忘记 zero_grad** → 梯度累加把上 batch 方向叠进来，训练发散
- **Dropout 推理时未关闭** → 预测结果随机抖动
- **学习率一刀切不衰减** → 后期在最优点附近震荡无法精调
- **BatchNorm 用 batch_size=1** → 方差统计为 0，归一化崩坏

</v-clicks>

> 生产坑都源于违反基本机制：正确配置激活、初始化、清梯度、eval 模式。

<!--
过一遍最高频的生产坑。第一 Sigmoid 做隐藏层，深层网络梯度全部饱和消失，正确做法隐藏层用 ReLU 或 GELU，Sigmoid 只留给输出层二分类。第二全零初始化所有神经元对称，正确做法用 He 或 Xavier。第三手动 Softmax 后传 CE，CE 内部已含 Softmax 会做两次，正确做法直接传 logits。第四忘记 zero_grad，PyTorch 默认梯度累加，正确做法每个 batch 开头 zero_grad。第五 Dropout 推理未关闭预测随机抖动，正确做法 model.eval 自动切换。第六学习率不衰减后期震荡，正确做法加 Step 或 Cosine scheduler。第七 BN 用 batch size 等于 1 方差统计为 0，正确做法训练 batch 大于等于 8，推理用滑动统计。
-->

---
layout: center
class: text-center
---

# 小结

神经网络是 CNN/RNN/Transformer 的公共地基，差异只在连接拓扑，梯度下降与反向传播机制完全一致。

**通用近似 · 前向反向 · 激活函数 · Adam · He 初始化**

[cs231n 神经网络笔记](https://cs231n.github.io/neural-networks-1/) · [PyTorch torch.nn 文档](https://docs.pytorch.org/docs/stable/nn.html)

<!--
总结：神经网络是深度学习的公共地基，CNN RNN Transformer 都只是如何组织连接拓扑的变体，可学习权重、梯度下降、反向传播这套机制完全一致。掌握 MLP 加前向反向传播加激活函数加 Adam 加 He 初始化这五件套，就掌握了所有现代深度学习架构的训练根基。新项目从 PyTorch 起步，nn Module 把所有零件做成可组合积木。谢谢大家。
-->
