---
theme: seriph
background: https://cover.sli.dev
title: PaddlePaddle 完全指南
info: |
  PaddlePaddle 完全指南：动态图 · 产业模型库 · Fleet 分布式 · 国产硬件适配 · 部署工具链

  Learn more at [https://www.paddlepaddle.org.cn](https://www.paddlepaddle.org.cn)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## PaddlePaddle 飞桨

百度主导的工业级深度学习平台 · 产业模型库 · 国产硬件 · 3.3

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
飞桨以产业模型库 + 国产硬件适配成为中国工业落地首选。
-->

---
transition: fade-out
---

# PaddlePaddle 是什么

百度主导、中国唯一自研开源的工业级深度学习平台

- **产业模型库**：PaddleOCR/PaddleNLP/PaddleDetection 开箱即用
- **ERNIE 大模型**：百度自研家族，首发于 PaddleNLP
- **动静统一**：3.x 动态图开发，静态图产出一致
- **自动并行**：少量切分标注即可分布式训练
- **国产硬件一等支持**：昆仑芯/昇腾/海光/寒武纪

> 框架版本 **3.3**（2026），PaddleOCR GitHub 86k+ star

<!--
飞桨最大特色是产业套件开箱即用 + 国产芯片适配。
-->

---
layout: two-cols
---

# 张量与动态图

```python
import paddle

x = paddle.to_tensor([[1.0, 2.0], [3.0, 4.0]])
y = paddle.randn([2, 2])
z = x + y            # 逐元素加
m = x @ y            # 矩阵乘

print(x.shape, x.dtype, x.place)

if paddle.is_compiled_with_cuda():
    x = x.cuda()
```

API 与 PyTorch 高度相似，迁移成本低。

::right::

# nn.Layer 模型骨架

```python
import paddle.nn as nn

class MLP(nn.Layer):
    def __init__(self, din, dout):
        super().__init__()
        self.fc1 = nn.Linear(din, 64)
        self.fc2 = nn.Linear(64, dout)

    def forward(self, x):
        return self.fc2(paddle.relu(self.fc1(x)))

model = MLP(784, 10)
logits = model(paddle.randn([32, 784]))
```

> `nn.Layer` 对应 PyTorch 的 `nn.Module`，`forward` 名字一致。

<!--
飞桨动态图 API 风格与 PyTorch 高度对齐，学习成本低。
-->

---

# 训练循环

```python
loss_fn = nn.CrossEntropyLoss()
optimizer = paddle.optimizer.Adam(
    parameters=model.parameters(), learning_rate=1e-3)

model.train()
for x, y in loader:
    logits = model(x)           # 前向
    loss = loss_fn(logits, y)
    loss.backward()             # 反向
    optimizer.step()            # 更新
    optimizer.clear_grad()      # 清梯度
```

**关键差异（迁移最易踩坑）**

- 清梯度是 `clear_grad()`，**不是** PyTorch 的 `zero_grad()`
- 推理用 `model.eval()` + `with paddle.no_grad():`
- 参数文件后缀 `.pdparams`，优化器状态 `.pdopt`

> 飞桨与 PyTorch API 相似，但 clear_grad 命名差异是高频踩坑点。

<!--
五步训练循环与 PyTorch 几乎一致，注意 clear_grad 命名。
-->

---
layout: two-cols
---

# PaddleOCR：一行 OCR

```python
from paddleocr import PaddleOCR

ocr = PaddleOCR(use_angle_cls=True, lang='ch')
result = ocr.ocr('invoice.png', cls=True)

for line in result[0]:
    print(line[1][0])   # 识别文本
```

飞桨生态最出圈的产业套件。

::right::

# PaddleNLP 与 ERNIE

```python
from paddlenlp.transformers import (
    AutoTokenizer, AutoModelForCausalLM)

tok = AutoTokenizer.from_pretrained(
    'baidu/ERNIE-4.5-0.3B')
model = AutoModelForCausalLM.from_pretrained(
    'baidu/ERNIE-4.5-0.3B')

inputs = tok('你好', return_tensors='pd')
out = model.generate(**inputs)
```

> 接口与 Hugging Face transformers 对齐，迁移成本低。

<!--
PaddleOCR 和 ERNIE 是飞桨生态两大杀手锏。
-->

---

# 动静统一与自动并行

3.x 核心特性：动态图开发，静态图产出一致

```python
import paddle

# 动态图开发（默认）
x = paddle.randn([4, 3])

# 同一份代码转静态图部署（产出一致）
static_func = paddle.jit.to_static(dynamic_func)
```

**自动并行（3.2/3.3）**

- 只需给关键张量加**切分标注**（sharding annotation）
- 框架自动推导通信与切分
- 降低模型并行/张量并行工程门槛
- 适合大模型训练（千亿参数 ERNIE）

> 动静统一消除了「训练动态图、部署静态图」行为漂移的坑。

<!--
动静统一 + 自动并行是飞桨 3.x 的两大里程碑特性。
-->

---

# Fleet API：分布式训练

`paddle.distributed.fleet` 是分布式训练统一入口

```python
import paddle.distributed.fleet as fleet

fleet.init(is_collective=True)          # 数据并行
strategy = fleet.DistributedStrategy()
strategy.amp = True                     # 自动混合精度
strategy.recompute = True               # 梯度检查点
optimizer = fleet.distributed_optimizer(optimizer, strategy)
```

| 策略 | 适用 | 配置 |
|------|------|------|
| 数据并行 | 默认，切分数据 | collective |
| 模型并行 | 单卡装不下 | sharding |
| 混合并行 | 推荐系统 | data + model |

> Fleet API 经百度内部大规模场景锤炼，覆盖单机到千卡。

<!--
Fleet API 是飞桨分布式能力的统一入口，数据/模型/混合并行全覆盖。
-->

---

# 混合精度与部署导出

```python
# AMP 混合精度（API 与 PyTorch 对齐）
scaler = paddle.amp.GradScaler()
for x, y in loader:
    with paddle.amp.auto_cast():
        loss = loss_fn(model(x), y)
    scaled = scaler.scale(loss)
    scaled.backward()
    scaler.step(optimizer)
```

**动转静导出推理模型**

```python
model.eval()
paddle.jit.save(model, 'model',
    input_spec=[paddle.static.InputSpec(shape=[-1, 784], dtype='float32')])
# 产出 model.pdmodel + model.pdparams
```

> 训练用动态图，部署走 `paddle.jit.save` 转静态图推理模型。

<!--
AMP 与动转静导出是飞桨训练到部署的关键环节。
-->

---

# 部署工具链

从训练到部署完整工具链，覆盖服务端、端侧、在线服务

| 工具 | 场景 | 特点 |
|------|------|------|
| **Paddle Inference** | 服务端 GPU/CPU | 集成 TensorRT/oneDNN |
| **Paddle Lite** | 移动端/边缘/IoT | ARM/NPU，轻量 |
| **Paddle Serving** | 在线微服务 | HTTP/RPC，版本管理 |
| **Paddle2ONNX** | 跨框架转换 | 转 ONNX 交其他引擎 |

**国产化适配**：昆仑芯 XPU（原生）/ 华为昇腾 NPU（paddle-npu）/ 海光 DCU / 寒武纪 MLU

> 国产芯片一等支持是飞桨信创场景的刚需与差异化优势。

<!--
完整部署工具链 + 国产硬件适配是飞桨护城河。
-->

---
layout: quote
---

# 飞桨的定位

「PaddleOCR 开箱即用、ERNIE 中文强势、国产芯片一等支持——飞桨是中国工业落地与信创场景的务实之选。」

---

# PaddlePaddle vs PyTorch vs JAX

| 维度 | PaddlePaddle | PyTorch | JAX |
|------|------|------|------|
| **产业套件** | OCR/NLP/Det 全套 | 依赖第三方 | 仅 Flax |
| **国产硬件** | 昆仑芯/昇腾一等 | 需厂商适配 | 弱 |
| **大模型** | ERNIE 家族 | HF 一等公民 | Flax |
| **国际生态** | 较弱 | 最繁荣 | 科研强 |
| **分布式** | Fleet + 自动并行 | DDP/FSDP | pmap/pjit |

> 飞桨产业落地与国产化最强，国际生态不及 PyTorch。

<!--
三大框架各有定位，飞桨赢在产业套件与国产硬件。
-->

---
layout: center
class: text-center
---

# 小结

PaddlePaddle = 产业模型库 + 动静统一 + 国产硬件

**飞桨套件 · ERNIE · Fleet · 部署工具链**

[飞桨文档](https://www.paddlepaddle.org.cn) · [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) · [PaddleNLP](https://github.com/PaddlePaddle/PaddleNLP)

<!--
产业套件 + 国产硬件适配 = 飞桨的核心价值。
-->
