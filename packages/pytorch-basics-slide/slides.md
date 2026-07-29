---
theme: seriph
background: https://cover.sli.dev
title: PyTorch 基础完全指南
info: |
  PyTorch 基础完全指南：Tensor · autograd · nn.Module · DataLoader · 训练循环 · AMP · torch.compile

  Learn more at https://docs.pytorch.org/en/stable/
drawings:
  persist: false
transition: slide-left
mdc: true
---

## PyTorch 基础

Tensor + autograd + nn.Module：Pythonic 的深度学习框架（基于 PyTorch 2.13.0）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
eager 即图：前向计算的同时动态建图，pdb 可以断在任何一行，这是 PyTorch 的灵魂。
-->

---
transition: fade-out
---

# PyTorch 是什么

Meta AI 主导的开源深度学习框架，三部分核心：

- **Tensor**：CPU/GPU 统一的多维数组 + GPU 加速运算
- **autograd**：任意运算自动建动态图，一行反向求导
- **nn / optim / data**：层、优化器、数据管线的标准件

```python
import torch
x = torch.rand(5, 3)
print(x.shape, x.dtype, x.device)   # torch.Size([5, 3]) float32 cpu
torch.cuda.is_available()           # GPU 可用性自检
```

> 2.13.0（2026-07）：Python 3.10–3.14，PyPI 默认 CUDA 13.0 wheel。

<!--
eager 模式：模型就是普通 Python 代码，与 TensorFlow 静态图路线相对。
-->

---
transition: fade-out
---

# 安装与设备

```bash
# 默认：CUDA 13.0（Turing/SM 7.5+ 显卡）
pip install torch torchvision

# 旧驱动回退 CUDA 12.6（含 Volta/Maxwell/Pascal）
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu126
```

```python
import torch
torch.cuda.is_available()            # NVIDIA / ROCm
torch.backends.mps.is_available()    # Apple Silicon
x = x.to("cuda")                     # 设备搬运：运算双方必须同设备
```

- Python 支持 **3.10–3.14**（2.9 起最低 3.10）
- 源码构建（2.13）：CUDA ≥ 12.6、C++20、NCCL ≥ 2.23

<!--
换大版本先看 Release Notes 的 Backwards Incompatible 一节。
-->

---
transition: fade-out
---

# Tensor：一切皆张量

```python
a = torch.rand(2, 3)                     # 均匀 [0,1)
b = torch.zeros(2, 3, dtype=torch.long)  # 全 0 指定 dtype
c = torch.tensor([[1, 2], [3, 4]])       # 从 Python 数据
```

**常用运算（与 NumPy 同构）**

```python
z = x + y        # 逐元素（广播）
z = x @ y.T      # 矩阵乘
z = x * y        # 逐元素乘（不是矩阵乘！）
x.add_(5)        # 下划线结尾 = 原地操作
v = y.view(12)   # 共享内存重排
```

- 三属性：`shape` / `dtype` / `device`
- `x.numpy()` / `torch.from_numpy()`：CPU 上共享内存

<!--
广播：从右对齐，长度为 1 或缺失的维可广播。
-->

---
transition: fade-out
---

# 数据管线：Dataset → DataLoader

```python
from torch.utils.data import Dataset, DataLoader

class MyDataset(Dataset):
    def __len__(self):
        return len(self.labels)
    def __getitem__(self, idx):
        return self.features[idx], self.labels[idx]

loader = DataLoader(ds, batch_size=64, shuffle=True,
                    num_workers=4, pin_memory=True)
```

- `Dataset`：怎么取一条（`__len__` + `__getitem__`）
- `DataLoader`：批量 / 打乱 / 并行预取
- `shuffle=True` 只给训练集；`num_workers` 常用 4–8

<!--
内置数据集：torchvision.datasets.FashionMNIST 等，transform=ToTensor()。
-->

---
transition: fade-out
---

# nn.Module：模型骨架

```python
from torch import nn

class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.flatten = nn.Flatten()
        self.stack = nn.Sequential(
            nn.Linear(784, 512), nn.ReLU(),
            nn.Linear(512, 512), nn.ReLU(),
            nn.Linear(512, 10),
        )
    def forward(self, x):
        return self.stack(self.flatten(x))

model = Net().to("cuda")
logits = model(x)      # 用 model(x)，别写 model.forward(x)
```

- `__init__` 定义层（注册参数），`forward` 定义流向
- 输出是 **logits**，概率化交给损失函数

<!--
普通 Python list 里的子模块不注册参数——必须用 nn.ModuleList。
-->

---
transition: fade-out
---

# 训练循环：五行骨架

```python
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD(model.parameters(), lr=1e-3)

model.train()
for X, y in train_loader:
    X, y = X.to(device), y.to(device)
    optimizer.zero_grad()      # ① 清梯度（默认累加！）
    loss = loss_fn(model(X), y)  # ② 前向+损失
    loss.backward()            # ③ 反向求导
    optimizer.step()           # ④ 更新参数
```

**三大坑**：忘 `zero_grad()` 梯度累加 / 忘 `.to(device)` 设备不匹配 / 忘 `model.eval()` Dropout 还在丢。

<!--
评估：model.eval() + with torch.no_grad():。
-->

---
transition: fade-out
---

# autograd：动态计算图

```python
x = torch.ones(2, 2, requires_grad=True)
y = x + 2
z = (y * y * 3).mean()
z.backward()          # d(z)/d(x) 写入 x.grad
print(x.grad)         # tensor([[4.5, 4.5], [4.5, 4.5]])
```

**三条铁律**

- 梯度**累加**：每个 step 前 `optimizer.zero_grad()`
- 只有**标量**能直接 `backward()`
- 图只建一次：二次反向 `backward(retain_graph=True)`

<!--
define-by-run：前向跑的同时建图，与静态图框架相对。
-->

---
transition: fade-out
---

# 控制梯度流的三种方式

```python
model.eval()
with torch.no_grad():          # ① 评估标准写法
    pred = model(x)

with torch.inference_mode():   # ② 纯推理更快更彻底
    pred = model(x)

feat = backbone(x).detach()    # ③ 截断梯度流
```

- `no_grad`：不建图、省显存，评估时用
- `inference_mode`：连版本计数都省，产出不可再求导
- `detach()`：GAN 冻结判别器、特征提取不回传

<!--
三者粒度不同：上下文、上下文（更强）、张量级。
-->

---
transition: fade-out
---

# 自定义可微算子

```python
class MyCube(torch.autograd.Function):
    @staticmethod
    def forward(ctx, x):
        ctx.save_for_backward(x)
        return x ** 3

    @staticmethod
    def backward(ctx, grad_out):
        (x,) = ctx.saved_tensors
        return grad_out * 3 * x ** 2
```

- `forward` 算结果，`ctx.save_for_backward` 留证据
- `backward` 返回各输入的梯度（向量-Jacobian 积）

> 2.13 起返回值不得与输入共享存储：`return x.clone()`。

<!--
torch.compile 下别名输出会 UserWarning，未来变硬错误。
-->

---
transition: fade-out
---

# 参数、Buffer 与冻结

```python
lin = nn.Linear(784, 256)
lin.weight.shape          # torch.Size([256, 784])

model.state_dict()        # 有序字典：层名 → 张量
for name, p in model.named_parameters():
    print(name, p.requires_grad)

# 冻结骨干，只训头部
for p in model.backbone.parameters():
    p.requires_grad = False
```

- **Parameter**：随优化器更新
- **Buffer**（`register_buffer`）：随 state_dict 保存、不求梯度

<!--
BatchNorm 的 running_mean 就是 buffer：保存但不求导。
-->

---
transition: fade-out
---

# 常用层速查

| 层 | 用途 | 关键点 |
| --- | --- | --- |
| `nn.Linear` | 全连接 | 自动 weight+bias |
| `nn.Conv2d` | 卷积 | `stride/padding/groups` |
| `nn.BatchNorm2d` | 批归一化 | train/eval 行为不同 |
| `nn.LayerNorm` | 层归一化 | Transformer 标配 |
| `nn.Dropout` | 正则 | 仅 train 生效 |
| `nn.Embedding` | 词嵌入 | 输入 long 型 id |
| `nn.MultiheadAttention` | 注意力 | `batch_first=True` |

<!--
子模块容器：nn.Sequential / nn.ModuleList / nn.ModuleDict。
-->

---
transition: fade-out
---

# 损失与优化器

```python
# 损失按任务选
nn.CrossEntropyLoss()      # 多分类：吃 logits + long 标签
nn.MSELoss()               # 回归
nn.BCEWithLogitsLoss()     # 二分类（别先 sigmoid）

# 优化器
opt = torch.optim.AdamW(model.parameters(), lr=3e-4,
                        weight_decay=0.01)
sched = torch.optim.lr_scheduler.CosineAnnealingLR(opt, T_max=100)
```

- AdamW：权重衰减解耦，Transformer 事实标准
- SGD+momentum：CNN 上常更稳
- 每个 epoch 末 `sched.step()`

<!--
参数分组：骨干小 lr、头部大 lr，传 dict 列表。
-->

---
transition: fade-out
---

# 混合精度训练（AMP）

```python
scaler = torch.cuda.amp.GradScaler()

for X, y in loader:
    optimizer.zero_grad()
    with torch.autocast(device_type="cuda"):
        loss = criterion(model(X), y)
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()
```

- 大部分算子半精度，关键部分 float32
- 提速 + 省显存，大 batch 必备

<!--
CPU 侧：torch.autocast(device_type="cpu", dtype=torch.bfloat16)。
-->

---
transition: fade-out
---

# torch.compile：免费加速

```python
model = torch.compile(model)                  # 一行提速
model = torch.compile(model, mode="max-autotune")
```

- Dynamo 捕获字节码成图，Inductor 生成融合内核
- 典型 1.3–2× 加速，与 eager 完全互操作
- 编译失败自动回退 eager（graph break），不报错

> 2.13：FlexAttention 登陆 Apple Silicon（稀疏模式 ~12×）

<!--
部署侧整图导出用 torch.export；torch.jit 持续退役。
-->

---
transition: fade-out
---

# 2.13 亮点速览

- **`nn.LinearCrossEntropyLoss`**：投影+损失融合，大词表峰值显存最多省 4×
- **FlexAttention on MPS**：Apple Silicon 稀疏注意力大幅提速
- **FSDP2 通信重叠**：reduce-scatter 与 all-gather 重叠（opt-in）
- **torchcomms**：新分布式通信后端，容错/可调试
- Python 3.15 Linux wheel；移除 named tensor、Bazel 构建

<!--
分布式细节见「PyTorch 分布式训练」专题。
-->

---
transition: fade-out
---

# 保存与加载

```python
# 推荐：只存参数
torch.save(model.state_dict(), "weights.pth")
model.load_state_dict(
    torch.load("weights.pth", map_location="cpu",
               weights_only=True))

# 断点续训：连优化器一起存
torch.save({"epoch": epoch,
            "model": model.state_dict(),
            "optimizer": optimizer.state_dict()},
           "checkpoint.pth")
```

- `weights_only=True`：反序列化更安全（2.6 起默认）
- 大模型权重首选 **safetensors**

<!--
ONNX：2.9 起默认 dynamo 导出、默认 opset 20。
-->

---
transition: fade-out
---

# 版本速览（2.8 → 2.13）

| 版本 | 关键变化 |
| --- | --- |
| 2.9 | Python 最低 3.10；ONNX 默认 dynamo |
| 2.10 | compile 支持 Python 3.14 |
| 2.11 | PyPI 默认 CUDA 13.0（SM 7.5+） |
| 2.12 | torchrun 默认 OS 空闲端口 |
| 2.13 | LinearCrossEntropyLoss / torchcomms |

- 升级先看 Backwards Incompatible
- 生产锁定 `torch==x.y.z`

<!--
CUDA 与 wheel 强绑定：cu130 默认、cu126 回退。
-->

---
transition: fade-out
---

# 速查表

| 主题 | 一行 |
| --- | --- |
| 张量 | `rand/zeros/tensor`，dtype/device |
| 数据 | `Dataset` → `DataLoader(shuffle=True)` |
| 模型 | `nn.Module`：`__init__` + `forward` |
| 训练 | `zero_grad → forward → backward → step` |
| 推理 | `model.eval()` + `no_grad()` |
| AMP | `autocast` + `GradScaler` |
| 加速/保存 | `torch.compile` / `state_dict` |

<!--
完整内容见笔记站 PyTorch 基础章节。
-->

---

## 谢谢观看

PyTorch 基础 · Tensor / autograd / nn.Module / DataLoader / 训练循环

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
