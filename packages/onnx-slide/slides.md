---
theme: seriph
background: https://cover.sli.dev
title: ONNX 完全指南
info: |
  ONNX 完全指南：跨框架标准 · ONNX Runtime 推理 · 量化优化 · 多硬件 EP · 性能调优

  Learn more at [https://onnx.ai](https://onnx.ai)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## ONNX

开放神经网络交换标准 · 跨框架互操作 · ONNX Runtime · IR 13 / opset 27

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
ONNX 是训练-推理解耦的事实标准，打破框架与硬件锁定。
-->

---
transition: fade-out
---

# ONNX 是什么

Microsoft/Meta 发起、Linux 基金会托管的开放模型表示标准

- **算子标准（opset）**：Conv/MatMul/Softmax 等跨框架共识算子
- **统一文件格式**：基于 protobuf 序列化
- **训练-推理解耦**：任意框架训练，任意引擎推理
- **ONNX Runtime**：微软高性能推理引擎，内核融合 + 多 EP
- **硬件覆盖极广**：NVIDIA/Intel/AMD/Apple/华为/高通

> 标准 IR 13 / opset 27（ONNX 1.22）；Runtime **1.28.0**（2026-07-25）

<!--
ONNX 不是训练框架，是跨框架的模型表示与交换标准。
-->

---

# ONNX 模型结构

一个 `.onnx` 文件本质是 protobuf 序列化的结构

```
ModelProto
├── ir_version: 13
├── opset_import: [opset 27]
└── graph: GraphProto
    ├── input/output: 张量名/形状/dtype
    ├── node: 算子节点序列（有序）
    │   ├── op_type: "Conv"
    │   └── input/output: 边名
    └── initializer: 初始权重
```

- **Node 不含数据**，只声明算子与边连接（边是张量名）
- **Initializer 是嵌入权重**（卷积核、BN 参数）
- **opset_import 声明算子版本**，引擎据此判断能否加载

> Node 是算子声明，initializer 是权重，opset 是版本契约。

<!--
理解 ModelProto/GraphProto/NodeProto 三层结构是调试 ONNX 的基础。
-->

---
layout: two-cols
---

# 从 PyTorch 导出

```python
import torch

model = Net().eval()
dummy = torch.randn(1, 784)

# 推荐：dynamo 导出
torch.onnx.export(
    model, (dummy,), "net.onnx",
    dynamo=True,
    input_names=["input"],
    output_names=["logits"],
)
```

`dynamo=True` 对动态控制流覆盖更好。

::right::

# 校验与推理

```python
import onnx, onnxruntime as ort
import numpy as np

model = onnx.load("net.onnx")
onnx.checker.check_model(model)   # 合规校验

sess = ort.InferenceSession("net.onnx",
    providers=["CUDAExecutionProvider",
               "CPUExecutionProvider"])
x = np.random.randn(1, 784).astype(np.float32)
out = sess.run(None, {"input": x})
```

> 输入必须是 NumPy 数组，providers 是优先级列表。

<!--
导出用 dynamo，校验用 onnx.checker，推理用 onnxruntime。
-->

---

# Execution Provider 速查

ONNX Runtime 通过 EP 机制适配十余种硬件后端

| Execution Provider | 厂商 | 备注 |
|------|------|------|
| `CPUExecutionProvider` | 通用 | 默认，MLAS 优化 |
| `CUDAExecutionProvider` | NVIDIA | cuDNN/cuFFT |
| `TensorrtExecutionProvider` | NVIDIA | 极致延迟 |
| `CoreMLExecutionProvider` | Apple | macOS/iOS ANE |

- `providers` 是优先级列表，第一个不可用才回退
- 1.28 新增 WebGPU EP（独立插件）；华为 CANN 为 preview

> NVIDIA 用 CUDA/TensorRT，Apple 用 CoreML，选对 EP 是性能第一步。

<!--
EP 机制是 ONNX Runtime 覆盖全硬件的秘诀，providers 是优先级列表。
-->

---

# 量化：动态 vs 静态

把 float32 压成 int8，体积降 4 倍+，延迟显著下降

```python
from onnxruntime.quantization import quantize_dynamic, QuantType

# 动态量化：推理时实时算激活 scale，无需校准数据
quantize_dynamic(
    model_input="model.onnx",
    model_output="model_int8.onnx",
    weight_type=QuantType.QInt8,
)
```

| 路线 | 激活 scale | 校准数据 | 推荐 |
|------|------|------|------|
| 动态 | 推理时实时算 | 不需要 | Transformer/RNN |
| 静态 | 预算写入常量 | 需要 | CNN |

> 动态量化一行命令，适合快速验证；静态量化性能更高但需校准集。

<!--
动态量化简单，静态量化性能更高，按模型类型选择。
-->

---

# 图优化

```python
import onnxruntime as ort

opts = ort.SessionOptions()
opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
opts.intra_op_num_threads = 8    # 算子内并行
opts.inter_op_num_threads = 4    # 算子间并行

sess = ort.InferenceSession("model.onnx", opts, providers=["CPUExecutionProvider"])
```

**优化级别**

- 常量折叠：编译期算出常量子图
- 内核融合：Conv+Add+ReLU 融合成单算子
- 布局转换：CPU 上 NCHW 转 NHWC 加速卷积

> 默认拉满 `ORT_ENABLE_ALL`，CPU 线程数通常设为物理核数。

<!--
图优化级别 + 线程数是 CPU 推理调优的两个关键旋钮。
-->

---

# 性能调优清单

**部署优化八步**

1. 选对 EP：NVIDIA 用 CUDA/TensorRT，Intel 用 OpenVINO
2. 优化级别拉满：`ORT_ENABLE_ALL`
3. 批量化推理：攒 batch 一起跑，吞吐显著提升
4. 量化：精度允许时上 int8，体积与延迟双降
5. 线程调优：`intra_op_num_threads` 设物理核数
6. CUDA Graph：固定 shape 消除算子启动开销
7. 内存模式：多模型共存关 arena（`enable_cpu_mem_arena=False`）
8. Profile 定位：`sess.enable_profiling()` 输出 Chrome trace

> Profile 是定位瓶颈的最后手段——用 chrome://tracing 打开找慢算子。

<!--
八步清单覆盖 EP、优化、批处理、量化、线程、内存、Profile。
-->

---
layout: quote
---

# ONNX 的价值

「PyTorch 训练 → ONNX → 任意引擎推理——训练与推理解耦，避免被单一框架或硬件锁定，这是 ONNX 作为交换标准的全部意义。」

---

# ONNX 生态与转换

| 框架 | 工具 | 命令 |
|------|------|------|
| PyTorch | `torch.onnx.export` | `export(model, args, "m.onnx", dynamo=True)` |
| TensorFlow | `tf2onnx` | `python -m tf2onnx.convert ...` |
| MindSpore | `ms.export` | `ms.export(net, ..., file_format="ONNX")` |
| scikit-learn | `skl2onnx` | `convert_sklearn(model, initial_types)` |

**转换后务必**

- `onnx.checker.check_model` 校验合规
- 比对转换前后输出（差异应在 1e-3 量级）
- 必要时用 `onnxsim` 简化图（折叠常量、消冗余）

> ONNX Model Zoo 提供预训练模型，Netron 可视化是标配工具。

<!--
跨框架转换后务必校验 + 比对输出 + 简化图。
-->

---
layout: center
class: text-center
---

# 小结

ONNX = 跨框架标准 + ONNX Runtime 推理

**opset · EP · 量化 · 图优化**

[ONNX 标准](https://onnx.ai) · [ONNX Runtime](https://onnxruntime.ai) · [Netron 可视化](https://netron.app)

<!--
训练-推理解耦 + 多硬件 EP = ONNX 的核心价值。
-->
