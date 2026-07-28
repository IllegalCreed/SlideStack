---
theme: seriph
background: https://cover.sli.dev
title: PyTorch 分布式训练完全指南
info: |
  PyTorch 分布式训练完全指南：DDP · torchrun · FSDP/FSDP2 · DeviceMesh · DTensor · TP · PP · torchcomms

  Learn more at https://docs.pytorch.org/docs/2.13/distributed.html
drawings:
  persist: false
transition: slide-left
mdc: true
---

## PyTorch 分布式训练

DDP + FSDP2 + DeviceMesh/DTensor + TP/PP：从单机多卡到万卡集群（基于 PyTorch 2.13.0）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
SPMD 是灵魂：同一份脚本跑 N 个进程，靠 rank 区分身份，通信藏在原语背后。
-->

---
transition: fade-out
---

# 分布式栈全景

`torch.distributed` 三层体系：

- **通信层**：ProcessGroup + 集合通信原语（all_reduce / all_gather / reduce_scatter）
- **数据并行**：DDP（复制模型）→ FSDP2（分片参数/梯度/优化器状态）
- **张量并行**：DeviceMesh + DTensor → TP（切权重）/ PP（切段）/ CP（切序列）

```python
# 一切从进程组开始
import torch.distributed as dist
dist.init_process_group("nccl")   # GPU 首选 NCCL，CPU 用 gloo
```

> 启动器统一用 `torchrun`，不要手写 `mp.spawn` 或手动设端口。

<!--
生态位：TorchTitan、Megatron-LM、DeepSpeed 的底座。
-->

---
transition: fade-out
---

# 核心概念：rank 与进程组

SPMD：同一脚本 N 个进程，三个编号定身份：

- **RANK**：全局进程号（0 ~ world_size-1）
- **LOCAL_RANK**：节点内编号 → 决定绑哪块 GPU
- **WORLD_SIZE**：总进程数（一进程一卡，GPU 不可共享）

```python
local_rank = int(os.environ["LOCAL_RANK"])
torch.accelerator.set_device_index(local_rank)   # 绑卡
rank, world = dist.get_rank(), dist.get_world_size()
```

- 各 rank 必须以**相同顺序**发起**匹配**的集合调用，否则挂死超时

<!--
torchrun 自动注入 RANK/LOCAL_RANK/WORLD_SIZE/MASTER_ADDR/MASTER_PORT。
-->

---
transition: fade-out
---

# torchrun：标准启动器

```bash
# 单机 4 卡（2.12 起默认 OS 分配空闲端口）
torchrun --nproc-per-node=4 train.py

# 多机 2 节点 × 8 卡：rdzv_endpoint 指向同一主机
torchrun --nnodes=2 --nproc-per-node=8 \
  --rdzv-id=100 --rdzv-backend=c10d \
  --rdzv-endpoint=$MASTER_ADDR:29400 train.py
```

- `--standalone`：单机便捷模式；`--max-restarts=3`：故障自动重启
- rendezvous 后端：`c10d` 推荐；etcd 系已入维护
- `RANK` 跨重启**不稳定**，禁止硬编码 rank 假设

<!--
弹性模式：--nnodes=1:4 允许节点进出，配合定期 checkpoint。
-->

---
transition: fade-out
---

# DDP：最小工作流

```python
from torch.nn.parallel import DistributedDataParallel as DDP

model = ToyModel().to(local_rank)
model = DDP(model, device_ids=[local_rank])

# 数据切片：各 rank 吃不重叠的样本
sampler = DistributedSampler(ds, shuffle=True)
loader = DataLoader(ds, batch_size=32, sampler=sampler)

for epoch in range(epochs):
    sampler.set_epoch(epoch)        # 每 epoch 重洗
    loss = loss_fn(model(x), y)
    loss.backward()                 # 梯度同步在这里自动完成
    optimizer.step()
```

- 训练循环与单机版完全一致——DDP 把通信藏进 backward

<!--
存档：rank==0 时 torch.save(model.module.state_dict(), ...)。
-->

---
transition: fade-out
---

# DDP 原理：梯度桶化

- 构造时 rank 0 广播初始参数 → 各副本起点一致
- 每个参数注册 autograd hook，梯度凑满一桶（默认 25MB）异步 all-reduce
- 通信与反向计算**重叠**：backward 返回时 `param.grad` 已是全组均值

```python
DDP(model, device_ids=[local_rank],
    bucket_cap_mb=25,               # 桶大小
    gradient_as_bucket_view=True,   # 省一次拷贝
    static_graph=False)             # 图固定设 True 提速
```

> 三个同步点：构造器 / forward / backward——各 rank 调用次数顺序必须一致。

<!--
负载不均时空等直到 init_process_group 的 timeout。
-->

---
transition: fade-out
---

# DDP 陷阱与梯度累积

- 条件控制流部分参数无梯度 → `find_unused_parameters=True`（有开销，优先改代码）
- 各 rank forward 次数不一致 → NCCL 超时挂死
- 梯度累积中间步免同步用 `no_sync`：

```python
for i, (x, y) in enumerate(loader):
    ctx = model.no_sync() if (i + 1) % accum else nullcontext()
    with ctx:
        loss = model(x, y) / accum
        loss.backward()
    if (i + 1) % accum == 0:
        optimizer.step(); optimizer.zero_grad()
```

<!--
排查：TORCH_DISTRIBUTED_DEBUG=DETAIL 给出具体不匹配参数名。
-->

---
transition: fade-out
---

# FSDP2：把状态切到 1/N

DDP 每卡全量复制；FSDP2（`fully_shard`）把三样状态按 dim-0 分片：

- **参数**：前向时 all-gather 出全量，用完即释放
- **梯度**：反向后 reduce-scatter，各 rank 只留自己那片
- **优化器状态**：建在 DTensor 参数上，天然分片

```python
from torch.distributed.fsdp import fully_shard
for layer in model.layers:     # bottom-up：先每层
    fully_shard(layer)
fully_shard(model)             # 再根模块
optimizer = AdamW(model.parameters(), lr=1e-3)  # 必须在分片后建
```

> 训练循环不变——前向自动 all-gather，反向自动 reduce-scatter。

<!--
模型越大 N 越大越划算：用通信换显存。
-->

---
transition: fade-out
---

# FSDP2：通信组与重叠

- 每次 `fully_shard(m)` = 一个通信组，组内参数一次集合通信
- **没有 bucket_cap_mb**——组边界由模块结构决定
- 只包根模块 = 一次巨型 all-gather 零重叠，几乎永远是错法

```python
mp = MixedPrecisionPolicy(param_dtype=torch.bfloat16,
                          reduce_dtype=torch.float32)
fully_shard(layer, mp_policy=mp,
            offload_policy=CPUOffloadPolicy(pin_memory=True))
```

- 前向：下一组 all-gather 走独立 stream 与当前计算重叠
- 反向：自动预取 all-gather + reduce-scatter 独立 stream，零配置

<!--
2D mesh = HSDP：跨节点复制、节点内分片。
-->

---
transition: fade-out
---

# FSDP2 契约与 2.13 新特性

**契约**

- 永远 `model(x)`，别 `model.forward(x)`（钩子不触发）
- 自定义前向方法：`register_fsdp_forward_method(model, "generate")`
- 异常中断后：根模块调 `FSDPModule.reset_iter_state()` 再跑

**2.13 通信重叠（opt-in）**

```python
model.set_separate_reduce_scatter_group(True)
# reduce-scatter 独立进程组，与 all-gather 真并发
```

<!--
梯度累积免通信：set_requires_gradient_sync(False)。
-->

---
transition: fade-out
---

# DeviceMesh：设备拓扑语言

N 维数组描述集群拓扑，是多维并行的地基：

```python
from torch.distributed.device_mesh import init_device_mesh

# 2 节点 × 4 卡：dp 跨节点、tp 节点内
mesh = init_device_mesh("cuda", (2, 4),
                        mesh_dim_names=("dp", "tp"))
tp_mesh = mesh["tp"]   # 切 1D 子网格喂 TP
dp_mesh = mesh["dp"]   # 喂 FSDP2 / DDP
```

- 2.11 起：**先 `init_process_group` 再建 mesh**（PG 注册表内置）
- 通信最密的维度（TP）放节点内吃 NVLink

<!--
mesh_dim_names 显式命名，后续切片全靠名字。
-->

---
transition: fade-out
---

# DTensor：三种 placement

`torch.Tensor` 子类，SPMD 编程如单设备：

- **`Shard(dim)`**：按维切分（chunk 语义）
- **`Replicate()`**：全量复制
- **`Partial("sum")`**：待规约中间态（梯度常见）

```python
from torch.distributed.tensor import distribute_tensor, Shard

dx = distribute_tensor(x, mesh, [Shard(0)])  # 全局张量 → DTensor
dx.to_local().shape                          # 本 rank 分片
full = dx.full_tensor()                      # all-gather 回收（可微）
```

- 算子参数必须全是 DTensor，混普通 Tensor 直接报错

<!--
from_local 反向梯度布局：Shard→Shard、Replicate→Replicate、Partial→Replicate。
-->

---
transition: fade-out
---

# DTensor redistribute：布局转换

`redistribute` 换布局，通信自动插入：

| 转换 | 通信 |
| --- | --- |
| `Shard` → `Replicate` | all_gather |
| `Shard(a)` → `Shard(b)` | all_to_all |
| `Replicate` → `Shard` | 本地 chunk（免通信） |
| `Partial` → `Replicate` | all_reduce |
| `Partial` → `Shard` | reduce_scatter |

<!--
调试：CommDebugMode 数集合通信；TORCH_LOGS=dtensor。
-->

---
transition: fade-out
---

# TP：张量并行

`parallelize_module` + 声明式 plan，把权重切到多卡：

```python
from torch.distributed.tensor.parallel import (
    parallelize_module, ColwiseParallel, RowwiseParallel)

parallelize_module(model, mesh["tp"], {   # 只收 1D mesh
    "mlp.w1": ColwiseParallel(),   # 输出按最后一维切
    "mlp.w2": RowwiseParallel(),   # 输入按最后一维切，输出复制
})
```

- Colwise + Rowwise 成对：中间激活保持分片，出口一次 all-reduce
- LayerNorm/RMSNorm/Dropout 用 `SequenceParallel()`（按序列维切）
- 大词表损失：`with loss_parallel():` 内算 cross_entropy

<!--
TP 通信最密，务必放节点内 NVLink 域。
-->

---
transition: fade-out
---

# PP：流水并行

`torch.distributed.pipelining`（alpha）：切分段 + 调度 micro-batch：

```python
from torch.distributed.pipelining import (
    pipeline, SplitPoint, ScheduleGPipe)

pipe = pipeline(module=model, mb_args=(x,),
                split_spec={"layers.7": SplitPoint.BEGINNING})
stage = pipe.build_stage(stage_idx, device, group)

schedule = ScheduleGPipe(stage, n_microbatches=8)
out = schedule.step(x) if rank == 0 else schedule.step()
```

- 硬约束：形状必须静态，运行期变化抛 `PipeliningShapeError`

<!--
自动切分用 torch.export 追踪；不能全图追踪时手工建 PipelineStage。
-->

---
transition: fade-out
---

# PP 调度选型

| 调度 | 特点 |
| --- | --- |
| `ScheduleGPipe` | 填充-排空，最简、气泡大 |
| `Schedule1F1B` | 稳态一进一出，激活显存大降 |
| `ScheduleInterleaved1F1B` | 每 rank 多段，气泡更小 |
| `ScheduleLoopedBFS` | 多段广度优先 |
| `ScheduleInterleavedZeroBubble` | 权重反向填泡 |
| `ScheduleDualPipeV` | DeepSeek DualPipe 变体 |

<!--
跨节点带宽受限时 PP 是首选：激活通信量远小于权重。
-->

---
transition: fade-out
---

# 组合策略：N 维并行

| 场景 | 组合 |
| --- | --- |
| 装得下单卡纯提速 | DDP / FSDP2 |
| 装不下单卡 | FSDP2 + 激活检查点 |
| 超大稠密 LLM | TP（节点内）× FSDP2（跨节点） |
| 跨节点带宽受限 | 加 PP 第三维（3D 并行） |
| 长序列 | 叠 context_parallel（prototype） |

- 参考实现：TorchTitan（官方 3D 并行范本）
- 上线前用 `CommDebugMode` 核对通信次数

<!--
HSDP：2D mesh 变体，跨节点复制省通信。
-->

---
transition: fade-out
---

# 排障工具箱

```bash
TORCH_DISTRIBUTED_DEBUG=DETAIL      # DDP 同步不匹配定位参数名
TORCH_NCCL_TRACE_BUFFER_SIZE=1000   # flight recorder 通信记录
TORCH_LOGS=dtensor,pp               # DTensor / 流水日志
```

- 挂死第一嫌疑：各 rank 集合通信序列不一致
- 第二嫌疑：节点间网络（先跑 nccl-tests）
- `--max-restarts` 只重启进程，**状态恢复靠自己定期 checkpoint**

<!--
torchcomms（2.13）：集群级容错 + 结构化日志，排障体验升级。
-->

---
transition: fade-out
---

# 2.13 分布式亮点

- **torchcomms**：新通信后端，容错 / 可扩展 / 可调试（experimental）
  - 试用：`pip install torchcomms` + `TORCH_DISTRIBUTED_USE_TORCHCOMMS=1`
- **FSDP2 通信重叠**：reduce-scatter 与 all-gather 独立进程组（opt-in）
- 2.12：torchrun 单机默认 OS 空闲端口
- 2.11：DeviceMesh 内置 PG 注册表；可微集合通信
- 源码构建 NCCL ≥ 2.23（pip 用户不受影响）

<!--
torchcomms 仓库：github.com/meta-pytorch/torchcomms。
-->

---
transition: fade-out
---

# 速查表

| 主题 | 一行 |
| --- | --- |
| 启动 | `torchrun --nproc-per-node=N` + `init_process_group("nccl")` |
| DDP | `DDP(model, device_ids=[local_rank])` |
| FSDP2 | bottom-up `fully_shard(layer)` 再根 |
| 网格 | `init_device_mesh("cuda", shape, names)` |
| DTensor | `Shard / Replicate / Partial` |
| TP | `parallelize_module(m, mesh1d, plan)` |
| PP | `pipeline()` + `Schedule1F1B.step(x)` |

<!--
完整内容见笔记站 PyTorch 分布式训练章节。
-->

---

## 谢谢观看

PyTorch 分布式训练 · DDP / torchrun / FSDP2 / DeviceMesh / DTensor / TP / PP / torchcomms

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
