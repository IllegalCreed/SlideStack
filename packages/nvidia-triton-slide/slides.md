---
theme: seriph
background: https://cover.sli.dev
title: NVIDIA Triton 推理服务器完全指南
info: |
  NVIDIA Triton 推理服务器完全指南：多后端托管 · Dynamic Batching · Concurrent Execution · Model Repository · KServe 部署

  Learn more at [https://docs.nvidia.com/deeplearning/triton-inference-server/](https://docs.nvidia.com/deeplearning/triton-inference-server/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## NVIDIA Triton

多框架推理服务器 · Dynamic Batching · 26.06

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Triton 把多框架多模型 GPU 托管做成生产级。
-->

---
transition: fade-out
---

# Triton 是什么

NVIDIA 开源的**多框架推理服务器**（Triton Inference Server）

- **多后端统一**：TensorRT / PyTorch / TensorFlow / ONNX / Python / OpenVINO 一套接管
- **Dynamic Batching**：请求动态聚合成大 batch，最大化吞吐
- **Concurrent Execution**：同 GPU 多模型实例并发，榨干 SM
- **协议齐全**：HTTP/REST + gRPC 双协议，C++/Python 客户端带共享内存
- **模型仓库即配置**：文件系统目录 + `config.pbtxt`，Git/CI 天然契合

> 当前主线 **NGC 容器 26.06**（仓库 v2.70.x），内置 Prometheus metrics

<!--
核心价值：多后端 + 动态批处理 + 并发执行。
-->

---

# 三端口与启动

一条命令拉起服务，三个端口各司其职

```bash
docker pull nvcr.io/nvidia/tritonserver:26.06-py3

docker run --gpus=all \
  -p 8000:8000 -p 8001:8001 -p 8002:8002 \
  -v "$PWD/model_repo:/models" \
  nvcr.io/nvidia/tritonserver:26.06-py3 \
  tritonserver --model-repository=/models
```

| 端口 | 协议 | 用途 |
|------|------|------|
| **8000** | HTTP/REST | 调试方便，curl 直连 |
| **8001** | gRPC | 生产低延迟首选 |
| **8002** | /metrics | Prometheus 监控 |

> 健康检查：`curl localhost:8000/v2/health/live`

<!--
8000 调试、8001 生产、8002 监控。
-->

---

# Model Repository 结构

基于文件系统的模型仓库，目录即配置

```
model_repo/
└── identity_onnx/
    ├── config.pbtxt       # 模型配置
    └── 1/                 # 版本子目录
        └── model.onnx     # 模型文件
```

**自动发现**：默认 `--model-control-mode=poll`，每 15s 扫描仓库

- 新增模型 → 自动加载，无需重启
- 新版本上线 → `cp -r 1 2 && 替换权重`
- 版本策略：`specific` / `latest` / `all`

> config.pbtxt 三件套：`name` · `backend` · `max_batch_size` + `input[]` + `output[]`

<!--
目录即配置，文件系统天然 CI/CD 友好。
-->

---

# config.pbtxt 配置示例

声明模型 + 动态批处理 + 并发实例

```protobuf
name: "identity_onnx"
backend: "onnxruntime"
max_batch_size: 8
input [{ name: "INPUT0" data_type: TYPE_FP32 dims: [16] }]
output [{ name: "OUTPUT0" data_type: TYPE_FP32 dims: [16] }]
dynamic_batching {
  preferred_batch_size: [4, 8]          # 优先凑这些 batch
  max_queue_delay_microseconds: 100000  # 100ms 兜底
}
instance_group [{ count: 2 kind: KIND_GPU }]
```

> 放进仓库目录后 Triton 自动加载，无需重启

<!--
配置即声明，四件套开箱即用。
-->

---
layout: two-cols
---

# Python 客户端

```python
import numpy as np
import tritonclient.grpc as grpcclient

client = grpcclient.InferenceServerClient(
    url="localhost:8001")
assert client.is_server_live()

inp = grpcclient.InferInput("INPUT0", [1, 16], "FP32")
inp.set_data_from_numpy(
    np.random.rand(1, 16).astype(np.float32))

out = grpcclient.InferRequestedOutput("OUTPUT0")
resp = client.infer("identity_onnx",
                    inputs=[inp], outputs=[out])
print(resp.as_numpy("OUTPUT0").shape)  # (1,16)
```

::right::

# 协议选择

| 协议 | 端口 | 场景 |
|------|------|------|
| gRPC | 8001 | 生产低延迟 |
| HTTP | 8000 | 调试方便 |

**共享内存加速**

- `cuda_shared_memory`：GPU 零拷贝
- `system_shared_memory`：host 零拷贝
- 大 tensor 端到端延迟显著降低

> 生产首选 gRPC + 共享内存

<!--
gRPC 低延迟，共享内存零拷贝。
-->

---

# Dynamic Batching 调优

吞吐与延迟的折中，Triton 杀手锏

**核心字段**

- `preferred_batch_size`：优先凑到的尺寸，如 `[4, 8]`
- `max_queue_delay_microseconds`：兜底超时，凑不齐也发
- `preserve_ordering`：响应顺序一致（牺牲吞吐）

**选 batch 大小三步**

1. `perf_analyzer -b 1 -b 4 -b 8 -b 16` 跑曲线
2. 找吞吐趋平的 batch 作 `preferred_batch_size`
3. 设 `max_queue_delay` 等于 p99 SLA

> GPU 利用率没满而延迟高时，加 `instance_group.count` 通常有效

<!--
perf_analyzer 扫曲线，找吞吐拐点。
-->

---

# Concurrent Model Execution

同一 GPU 跑多个执行实例，交错利用 CUDA streams

```protobuf
# 默认 GPU 0 上 2 个实例
instance_group [{ count: 2  kind: KIND_GPU }]

# 多 GPU 分布
instance_group [
  { count: 1  kind: KIND_GPU  gpus: [0] }
  { count: 1  kind: KIND_GPU  gpus: [1] }
]
```

**调优经验**

- 单实例 = 一条独立执行流，多实例通过 CUDA streams 交错
- `count` 越大并行度越高，但实例切换有显存开销
- 当 GPU 没满而延迟高时，加 `count` 通常有效

> 配合 Dynamic Batching 是生产推理服务标配

<!--
并发实例 + CUDA streams 榨干 GPU。
-->

---
layout: two-cols
---

# TensorRT 加速链路

PyTorch/TF → ONNX → plan，极致性能

```bash
# 1. 导出 ONNX（带动态 batch）
torch.onnx.export(model, dummy, "model.onnx",
    opset_version=17, dynamic_axes={"x":{0:"batch"}})

# 2. trtexec 编译 plan
trtexec --onnx=model.onnx \
        --saveEngine=model.plan --fp16 \
        --optShapes=INPUT0:8x16

# 3. 放进 1/model.plan，config 改 backend: tensorrt
```

::right::

# 精度权衡

| 精度 | 速度 | 损失 | 适用 |
|------|------|------|------|
| FP32 | 基线 | 无 | 校验 |
| FP16 | ~2x | 极小 | 通用首选 |
| INT8 | 3-4x | 中等 | 有校准集 |

> 链路长且对算子版本敏感，新模型常踩兼容性坑

<!--
TensorRT 是 NVIDIA 极致优化，代价是链路复杂。
-->

---

# 多模型流水线（Ensemble）

单次 infer 调用串起多模型，中间 tensor 不出进程

```protobuf
name: "pipeline"
platform: "ensemble"
ensemble_scheduling {
  step [
    { model_name: "preprocess"  output_map { key: "T" value: "TENSOR" } },
    { model_name: "resnet50"    output_map { key: "L" value: "LOGITS" } },
    { model_name: "postprocess" output_map { key: "OUT" value: "LABEL" } }
  ]
}
```

**收益**

- 中间 tensor 不出进程，省序列化/网络往返
- 端到端延迟比手工串联低 30%+
- 客户端一次调用完成预处理→推理→后处理

> 适合「预处理 → 推理 → 后处理」固定链路

<!--
Ensemble 把多模型串成流水线，延迟大降。
-->

---

# 部署形态

| 形态 | 适用 | 说明 |
|------|------|------|
| **Docker 单机** | 开发/小规模 | `docker run --gpus=all` |
| **K8s + KServe** | 生产集群 | 原生 InferenceService 后端 |
| **NVIDIA NIM** | 商业封装 | 预置热门模型权重 |
| **Bare metal** | 不推荐 | 缺容器隔离 |

**KServe 示例片段**

```yaml
spec:
  predictor:
    triton:
      storageUri: gs://my-bucket/models
      runtimeVersion: 26.06-py3
```

> KServe 自动注入负载均衡、自动扩缩容与 Canary 发布

<!--
Docker 开发，KServe 生产，NIM 商业。
-->

---

# 性能分析与调优

```bash
# 单模型吞吐/延迟（找 batch 拐点）
perf_analyzer -m identity_onnx -u localhost:8001 -i grpc

# 自动遍历 batch/instance 组合
model-analyzer profile --model-repository ./repo \
  -m resnet50_onnx --triton-launch-mode=docker \
  --concurrency 1,4,8,16
```

**调优清单**

- Dynamic Batching：`preferred_batch_size` + `max_queue_delay`
- 并发执行：`instance_group.count`
- 模型预热：`model_warmup` 避免首请求抖动
- 共享内存：大 tensor 零拷贝
- 响应缓存：`response_cache` 命中即返回

> Model Analyzer 自动输出对比表与显存占用，省去手工扫描

<!--
perf_analyzer + model-analyzer 是调优双武器。
-->

---
layout: quote
---

# Triton 生产四件套

「Dynamic Batching + Concurrent Execution + Model Warmup + Response Cache，配置文件改几个字段就能上，这就是 Triton 的全部精髓。」

---
layout: center
class: text-center
---

# 小结

NVIDIA Triton = 多后端托管 + Dynamic Batching

**Model Repository · 并发执行 · TensorRT 加速 · KServe 部署**

[Triton 文档](https://docs.nvidia.com/deeplearning/triton-inference-server/) · [GitHub](https://github.com/triton-inference-server/server) · [NGC 容器](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/tritonserver)

<!--
多后端 + 动态批处理 + 并发执行 = 生产级 GPU 推理服务。
-->
