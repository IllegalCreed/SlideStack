---
theme: seriph
background: https://cover.sli.dev
title: MindSpore 完全指南
info: |
  MindSpore 完全指南：函数式自动微分 · 动静统一 · 昇腾 NPU 适配 · 自动并行 · 全场景部署

  Learn more at [https://www.mindspore.cn](https://www.mindspore.cn)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## MindSpore 昇思

华为全场景深度学习框架 · 函数式微分 · 昇腾 NPU · 2.9.0

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
MindSpore 以函数式微分 + 昇腾深度适配成为国产算力栈事实标准。
-->

---
transition: fade-out
---

# MindSpore 是什么

华为开源的全场景深度学习框架，一套 API 覆盖端/边/云

- **函数式自动微分**：`grad(fn)` 把求导当高阶函数
- **动静统一**：PyNative 调试 + `@jit` 加速共享后端
- **昇腾 NPU 深度适配**：算子级 + 图级双重优化
- **自动并行**：框架自动搜索数据/模型/流水线切分
- **全场景一次开发**：云训模型平滑下沉端侧

> 稳定版 **2.9.0**，新增无图融合（性能 +5%~15%）、HyperParallel

<!--
MindSpore 四大支柱：函数式微分 + 动静统一 + 昇腾适配 + 自动并行。
-->

---
layout: two-cols
---

# Tensor 与执行模式

```python
import mindspore as ms
from mindspore import ops, Tensor

a = Tensor([[1, 2], [3, 4]])
b = ops.ones((2, 3), ms.float32)
z = ops.matmul(a, b)

ms.set_context(mode=ms.GRAPH_MODE,
               device_target="Ascend")
```

两种模式：PyNative（默认，可调试）/ Graph（编译加速）。

::right::

# @mindspore.jit 动静统一

```python
import mindspore as ms

# 不改全局，只给热点函数加 @jit
@ms.jit
def add(x, y):
    return x + y

# 关键参数
# capture_mode="ast"|"trace"|"bytecode"
# jit_level="O0"|"O1"
# fullgraph=True 强制整图
```

> `@jit` 是动静统一精髓：eager 环境里临时给函数加静态图加速。

<!--
PyNative 调试 + @jit 加速共享同一编译后端，这是动静统一。
-->

---

# 函数式自动微分

把求导当高阶函数，与 PyTorch 面向对象风格截然不同

```python
import mindspore
from mindspore import ops

def function(x, y, w, b):
    z = ops.matmul(x, w) + b
    return ops.binary_cross_entropy_with_logits(z, y)

# 对第 2、3 个参数（w、b）求导
grad_fn = mindspore.grad(function, grad_position=(2, 3))
grads = grad_fn(x, y, w, b)       # 返回 (grad_w, grad_b)
```

**训练循环最常用：value_and_grad**

```python
grad_fn = ms.value_and_grad(forward_fn, None, weights=model.trainable_params())
loss, grads = grad_fn(x, y)       # 同时返回 loss 与对参数的梯度
```

> 梯度是返回值而非副作用，每次返回新梯度，不累加。

<!--
函数式微分是 MindSpore 与 PyTorch 最大的心智差异。
-->

---

# nn.Cell：网络骨架

```python
import mindspore.nn as nn

class Net(nn.Cell):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Dense(28 * 28, 512)   # Dense 对应 Linear
        self.relu = nn.ReLU()
        self.fc2 = nn.Dense(512, 10)

    def construct(self, x):                 # 不是 forward！
        return self.fc2(self.relu(self.fc1(x)))
```

| PyTorch | MindSpore | 说明 |
|------|------|------|
| `nn.Module` / `forward()` | `nn.Cell` / `construct()` | 基类与前向方法 |
| `nn.Linear` | `nn.Dense` | 全连接层 |

> `construct` 不是 `forward`——PyTorch 迁移最易遗漏的改名点。

<!--
nn.Cell + construct 是 MindSpore 网络定义范式，注意命名差异。
-->

---

# 训练循环：函数式骨架

```python
import mindspore as ms

loss_fn = nn.CrossEntropyLoss()
optimizer = nn.Momentum(net.trainable_params(), learning_rate=1e-2, momentum=0.9)

def forward_fn(data, label):
    return loss_fn(net(data), label)

grad_fn = ms.value_and_grad(forward_fn, None, weights=net.trainable_params())

def train_step(data, label):
    loss, grads = grad_fn(data, label)
    optimizer(grads)                        # 函数式：optimizer(梯度)
    return loss

net.set_train()                             # 训练模式
```

> 或用高层封装 `Model(net, loss_fn, optimizer).train(epoch, ds)`，类 Keras。

<!--
函数式训练循环 + optimizer(grads) 是 MindSpore 标准模式。
-->

---
layout: two-cols
---

# Dataset：声明式管线

```python
import mindspore.dataset as ds

def gen():
    for i in range(1000):
        yield (np.random.rand(3, 32, 32)
               .astype(np.float32), i % 10)

dataset = ds.GeneratorDataset(
    gen, ["data", "label"], shuffle=True)
dataset = dataset.batch(64).repeat(10)
```

C++ 实现，吞吐远超纯 Python 迭代器。

::right::

# 性能与变换

```python
from mindspore.dataset import vision

transforms = [
    vision.Decode(),
    vision.Resize(256),
    vision.CenterCrop(224),
    vision.ToTensor(),
    vision.Normalize(mean=[0.485],
                     std=[0.229]),
]
dataset = dataset.map(
    operations=transforms,
    input_columns="image")
```

性能技巧：

- `batch(drop_remainder=True)`
- `num_parallel_workers=8`
- `create_tuple_iterator()` 更快

> 声明式管线 + C++ 多线程，瓶颈场景吞吐显著领先。

<!--
mindspore.dataset 是高性能 C++ 管线，性能优于纯 Python DataLoader。
-->

---

# 自动微分进阶

```python
import mindspore as ms

f = lambda x: ops.sin(x)
first = ms.grad(f)                  # 一阶：cos
second = ms.grad(first)             # 二阶：-sin
third = ms.grad(second)             # 三阶：-cos

# has_aux：辅助输出不参与求导
def fn_with_aux(x):
    return ops.sin(x).sum(), x * 100

grad_fn = ms.grad(fn_with_aux, has_aux=True)
grads, aux = grad_fn(x)
```

**与 PyTorch autograd 对照**

- 范式：函数式 `grad(fn)` vs 面向对象 `.backward()`
- 累加：MindSpore **不累加**（每次新梯度）vs PyTorch 累加需 zero_grad
- 高阶：直接 `grad(grad(fn))` vs 需 `create_graph=True`

> 函数式微分像组合普通函数，二阶/Jacobian 开箱即用。

<!--
函数式微分的高阶组合比 PyTorch 的 create_graph 更优雅。
-->

---

# 自动并行：大模型利器

声明并行模式，框架自动搜索切分策略

```python
from mindspore import ParallelMode, set_auto_parallel_context

set_auto_parallel_context(
    parallel_mode=ParallelMode.SEMI_AUTO_PARALLEL, device_num=8)

# 在层上标注切分策略
net.fc1.matmul.shard(((1, 8), (8, 1)))
```

| 模式 | 含义 | 适用 |
|------|------|------|
| DATA_PARALLEL | 数据并行 | 中小模型 |
| SEMI_AUTO | 标 shard 后自动 | 大模型 |

> 自动并行是 MindSpore 区别于 PyTorch DDP/FSDP 的标志性能力。

<!--
自动并行让大模型分布式训练门槛大幅降低。
-->

---

# 混合精度与昇腾适配

```python
import mindspore as ms

# 自动转 fp16
net = ms.amp.auto_mixed_precision(net, amp_level="O2")
# 动态 loss scale 防 fp16 梯度下溢
scale = nn.DynamicLossScaleManager(init_loss_scale=2**16)
```

**昇腾 NPU 性能红利三层**

- 算子级：达芬奇架构 Cube/Vector 手写高性能算子（FlashAttention）
- 图级：MS IR 整图融合、内存复用、通信重叠
- 全栈：与 CANN、HCCL 集合通信深度协同

```python
ms.set_context(device_target="Ascend", device_id=0)
ms.set_context(enable_task_sink=True)   # 任务下沉 AI Core
```

> 同代码切 `device_target="GPU"` 也能跑，但昇腾最优红利在华为栈内。

<!--
昇腾适配是 MindSpore 最大的护城河，性能红利主要在华为栈内兑现。
-->

---
layout: quote
---

# MindSpore 的定位

「函数式微分优雅、动静统一、昇腾深度适配、自动并行开箱即用——MindSpore 是国产算力栈的事实标准。」

---

# MindSpore vs PyTorch vs PaddlePaddle

| 维度 | MindSpore | PyTorch | PaddlePaddle |
|------|------|------|------|
| **微分** | 函数式 grad(fn) | backward 副作用 | backward 副作用 |
| **前向** | construct | forward | forward |
| **国产硬件** | 昇腾一等 | 需适配 | 昆仑芯/昇腾 |
| **并行** | 自动并行 | DDP/FSDP | Fleet + 自动 |
| **端侧** | MindSpore Lite | ExecuTorch | Paddle Lite |

> MindSpore 昇腾最强，函数式范式独特，GPU/海外生态较弱。

<!--
三大国产/主流框架各有侧重，MindSpore 赢在昇腾与函数式。
-->

---
layout: center
class: text-center
---

# 小结

MindSpore = 函数式微分 + 动静统一 + 昇腾适配

**grad · construct · @jit · 自动并行**

[MindSpore 文档](https://www.mindspore.cn) · [教程](https://www.mindspore.cn/tutorials/zh-CN/r2.9.0/index.html) · [GitHub](https://github.com/mindspore-ai/mindspore)

<!--
函数式 + 动静统一 + 昇腾 = MindSpore 的核心价值。
-->
