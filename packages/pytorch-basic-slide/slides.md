---
theme: seriph
background: https://cover.sli.dev
title: PyTorch 基础完全指南
info: |
  PyTorch 基础完全指南：Tensor · autograd · nn.Module · DataLoader · 训练循环 · torch.compile

  Learn more at [https://docs.pytorch.org](https://docs.pytorch.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## PyTorch 基础

动态图深度学习框架 · autograd · nn.Module · 2.13.0

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
PyTorch 以 eager + autograd 成为学术工业事实标准。
-->

---
transition: fade-out
---

# PyTorch 是什么

Meta AI 主导、Linux 基金会托管的开源深度学习框架

- **Tensor 计算库**：CPU/GPU 统一抽象（`torch.Tensor`）
- **autograd 自动微分**：任意张量运算自动可导，动态计算图
- **nn.Module 体系**：层 / 模型 / 优化器 / 数据加载
- **eager 优先**：模型即普通 Python，print/pdb 随便写
- **2.x + torch.compile**：eager 开发 + 图编译优化兼得

> 当前稳定版 **2.13.0**，Python 3.10–3.14，CUDA 13.0 wheel

<!--
PyTorch 核心三件：Tensor + autograd + nn.Module。
-->

---
layout: two-cols
---

# Tensor 基础

```python
import torch

# 建张量
x = torch.rand(5, 3)          # 均匀分布
x = torch.zeros(2, 3, dtype=torch.float64)
x = torch.tensor([1, 2, 3])

# 关键属性
x.shape    # torch.Size([5, 3])
x.dtype    # torch.float32
x.device   # device(type='cpu')

# GPU 搬运
x = x.to("cuda")  # 或 .cuda() / .mps()
```

::right::

# 运算与广播

```python
a = torch.rand(3, 4)
b = torch.rand(4)
c = a + b       # 广播: (3,4)+(4,)

# 形状操作
x.view(6, 2)    # reshape（需连续）
x.reshape(6, 2) # reshape（不要求连续）
x.transpose(0,1) # 转置两维

# 聚合
x.sum(dim=0)    # 沿第 0 维求和
x.mean()
x.max()
```

> 运算双方必须同设备，否则报错。

<!--
Tensor 是 NumPy 的 GPU 版，广播规则一致。
-->

---

# autograd 自动微分

动态图：前向即建图，backward 自动求导

```python
import torch

x = torch.tensor(2.0, requires_grad=True)
y = x ** 2 + 3 * x + 1   # 前向 = 建图
y.backward()              # 反向 = 求导
print(x.grad)             # dy/dx = 2x+3 = 7.0
```

**关键点**

- `requires_grad=True`：跟踪该张量的所有运算
- `.backward()`：从标量损失反向传播，梯度累积到 `.grad`
- `with torch.no_grad():`：推理时禁用建图（省显存）
- `optimizer.zero_grad()`：每步清零梯度（防累积）

> 梯度默认**累积**——训练循环必须先 zero_grad。

<!--
autograd 是 PyTorch 的灵魂：任意运算自动可导。
-->

---
layout: two-cols
---

# nn.Module 模型骨架

```python
import torch.nn as nn

class MLP(nn.Module):
  def __init__(self):
    super().__init__()
    self.fc1 = nn.Linear(784, 128)
    self.fc2 = nn.Linear(128, 10)
    self.relu = nn.ReLU()

  def forward(self, x):
    x = self.relu(self.fc1(x))
    return self.fc2(x)

model = MLP()
out = model(x)  # 别显式调 .forward()
```

::right::

# 训练循环五步

```python
optimizer = torch.optim.Adam(
  model.parameters(), lr=1e-3)
criterion = nn.CrossEntropyLoss()

for x, y in dataloader:
  # 1. 清梯度
  optimizer.zero_grad()
  # 2. 前向
  pred = model(x)
  # 3. 算损失
  loss = criterion(pred, y)
  # 4. 反向求导
  loss.backward()
  # 5. 更新参数
  optimizer.step()
```

> 五步循环是 PyTorch 训练的万能模板。

<!--
nn.Module 封装参数，训练循环五步是万能模板。
-->

---

# DataLoader 数据管线

Dataset 定义数据，DataLoader 批量加载

```python
from torch.utils.data import Dataset, DataLoader

class MyDataset(Dataset):
  def __init__(self, X, y):
    self.X, self.y = X, y
  def __len__(self): return len(self.X)
  def __getitem__(self, i):
    return self.X[i], self.y[i]

loader = DataLoader(
  MyDataset(X, y),
  batch_size=64,
  shuffle=True,       # 训练时打乱
  num_workers=4,      # 多进程加载
  drop_last=True,     # 丢弃不完整批次
)
```

> 自定义 Dataset 只需实现 `__len__` + `__getitem__`。

<!--
Dataset + DataLoader 是数据加载的标准模式。
-->

---

# 保存与加载

```python
# 推荐：只存参数（state_dict）
torch.save(model.state_dict(), "model.pth")

# 加载（必须先建同结构模型）
model = MLP()
model.load_state_dict(torch.load("model.pth"))
model.eval()  # 推理模式

# 存整个训练检查点（含优化器状态，可恢复训练）
checkpoint = {
  "model": model.state_dict(),
  "optimizer": optimizer.state_dict(),
  "epoch": 10,
}
torch.save(checkpoint, "ckpt.pth")
```

> **存 state_dict 而非整个 model**——后者绑定类路径，重构即坏。

<!--
state_dict 是推荐的持久化方式，跨环境安全。
-->

---
layout: two-cols
---

# 推理模式

```python
# eval 模式：关闭 Dropout/BN
model.eval()

# 禁用 autograd 建图（省显存）
with torch.no_grad():
  pred = model(x)

# 更彻底（2.0+，更快）
with torch.inference_mode():
  pred = model(x)
```

**eval vs train 差异**

| 模式 | Dropout | BatchNorm |
|------|------|------|
| train | 随机丢弃 | 用 batch 统计 |
| eval | 关闭 | 用全局统计 |

::right::

# GPU 设备管理

```python
# 检测
torch.cuda.is_available()
torch.backends.mps.is_available()

# 搬运
device = "cuda" if torch.cuda.is_available() else "cpu"
model = model.to(device)
x, y = x.to(device), y.to(device)

# 多卡（数据并行基础）
model = nn.DataParallel(model)
```

> 训练后 **必 eval()**，否则 BN/Dropout 行为错误。

<!--
推理要 eval() + no_grad，设备搬运要一致。
-->

---

# torch.compile（2.x）

一行获得图编译优化，不改 eager 习惯

```python
# 训练或推理前一行编译
model = torch.compile(model)

# 继续正常训练/推理，内部自动：
# - Dynamo 捕获计算图
# - Inductor 生成融合内核
# - 兼容 GPU/CPU
```

**收益**

- 内核融合（减少访存）
- 自动算子优化
- 典型 1.3–2x 加速（视模型）

> 首次调用会编译（慢），后续快；调试时可先注释 compile。

<!--
torch.compile 让 eager 享受图优化，是 2.x 标志特性。
-->

---
layout: quote
---

# PyTorch 训练万能模板

「zero_grad → forward → loss → backward → step，五步循环 + nn.Module + DataLoader + autograd，这就是 PyTorch 的全部精髓。」

---

# PyTorch vs TensorFlow vs JAX

| 维度 | PyTorch | TensorFlow | JAX |
|------|------|------|------|
| **计算图** | 动态（eager） | 静态(@tf.function) | 函数式(XLA) |
| **编程范式** | 面向对象 | 面向对象+声明 | 函数式纯函数 |
| **调试** | ✅ 最简单 | 中等 | 较难（无副作用） |
| **生态** | ✅ 最繁荣 | 工业部署成熟 | 科研/TPU |
| **主力模型库** | HF/LLaMA | KerasCV | Flax |

> 2026 年：PyTorch 学术工业双统治，JAX 在科研+TPU 占优，TF 部署侧仍有优势。

<!--
三大框架定位互补，PyTorch 是当前事实标准。
-->

---
layout: center
class: text-center
---

# 小结

PyTorch = Tensor + autograd + nn.Module

**eager 体验 · 动态图 · 五步训练 · torch.compile**

[PyTorch 文档](https://docs.pytorch.org) · [教程](https://docs.pytorch.org/tutorials/) · [GitHub](https://github.com/pytorch/pytorch)

<!--
PyTorch 三件套 + 五步循环 = 深度学习训练基础。
-->
