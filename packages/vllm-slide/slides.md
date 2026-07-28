---
theme: seriph
background: https://cover.sli.dev
title: vLLM 完全指南
info: |
  vLLM 完全指南：PagedAttention · Continuous Batching · OpenAI API · 多卡并行 · 量化 · Speculative Decoding

  Learn more at [https://docs.vllm.ai](https://docs.vllm.ai)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## vLLM

高吞吐低延迟 LLM 推理与服务引擎 · PagedAttention · 0.26.x

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
vLLM 是开源 LLM serving 的事实标准。
-->

---
transition: fade-out
---

# vLLM 是什么

UC Berkeley 开源的高吞吐、低延迟 LLM 推理与服务引擎

- **PagedAttention 显存革命**：虚拟内存式 KV Cache，利用率从 ~20-40% 提升到 ~96%
- **Continuous Batching**：动态批处理，每个 step 加入/移除请求
- **OpenAI API 零成本迁移**：`vllm serve` 一行起服务，端点完全兼容
- **多卡扩展成熟**：Tensor / Pipeline / Data Parallel，Ray + NCCL 底层
- **量化生态全**：GPTQ / AWQ / FP8 / BitsAndBytes / GGUF

> 单卡吞吐比 HF `generate` 高 **2-24 倍**

<!--
vLLM 三件套：PagedAttention + Continuous Batching + OpenAI API。
-->

---
layout: two-cols
---

# 为什么快：PagedAttention

KV Cache 是 LLM 推理显存主要消耗者，传统连续分配浪费严重。

借鉴 OS **虚拟内存分页**：

- 每个请求 KV Cache 切成固定大小 **block**
- 维护 **block table**（逻辑→物理映射）
- 物理 block 按需分配、可任意离散存放
- 池共享给所有请求，结束立即归还

| 指标 | 传统 | PagedAttention |
|------|------|------|
| 显存利用率 | ~20-40% | **~96%** |
| 单卡吞吐 | 基准 | **2-24x** |

::right::

# Copy-on-Write

分块离散管理使多个请求**共享相同前缀**（如 system prompt）时，用 CoW 只读共享同一物理 block，分叉后才各自复制。

这是 **`--enable-prefix-caching`** 的底层基础——RAG / Agent 场景能把 TTFT 砍掉一半以上。

> KV Cache 大小公式（FP16）：

```
2 × L × H × D × N × 2 bytes
```

Llama-2-70B、batch=32、N=2048 时 KV Cache 约 **26 GB**，比模型权重还吃显存。

<!--
PagedAttention 是 vLLM 一战成名的根本。
-->

---

# Continuous Batching

第二个核心优化——每个 iteration 重新决定 batch 成员

```
iteration 1: [req_A, req_B, req_C]  → 生成 token
iteration 2: [req_A, req_B]          → req_C 完成，剔除
iteration 3: [req_A, req_B, req_D]   → req_D 从队列加入
```

**对比静态批处理**：

- **静态批**：凑齐 N 个请求，等最长的生成完才整体结束，GPU 大量空转
- **Continuous**：某请求生成完 `<eos>` 立即移除释放 KV；新请求立即加入

> 相比静态批处理吞吐提升 **2-10 倍**（TGI / TensorRT-LLM 也用，叫 in-flight batching）

<!--
动态批处理消除 GPU 空转。
-->

---

# 离线推理：Python API

与服务化 API 共用同一引擎，适合离线评测/数据合成

```python
from vllm import LLM, SamplingParams

llm = LLM(model="Qwen/Qwen2.5-1.5B-Instruct")

sampling_params = SamplingParams(
    temperature=0.8, top_p=0.95, max_tokens=128,
)

prompts = ["解释 KV Cache。", "写一个反转字符串的函数。"]
outputs = llm.generate(prompts, sampling_params)

# 或直接传 messages，自动套 chat template
outputs = llm.chat(
    [{"role": "user", "content": "你好"}], sampling_params)
```

> 传入多个 prompt，vLLM 自动 continuous batching

<!--
离线 API 与服务化共用引擎。
-->

---
layout: two-cols
---

# 起一个 OpenAI 兼容服务

```bash
# 最简：一行起服务
vllm serve Qwen/Qwen2.5-1.5B-Instruct

# 指定端口与鉴权
vllm serve Qwen/Qwen2.5-1.5B-Instruct \
  --host 0.0.0.0 --port 8000 \
  --api-key sk-my-secret
```

**端点**：

| 端点 | 用途 |
|------|------|
| `/v1/chat/completions` | 对话补全 |
| `/v1/completions` | 文本补全 |
| `/v1/embeddings` | 向量化 |
| `/v1/models` | 已加载模型 |

::right::

# OpenAI SDK 零改动

只改 `base_url` 和 `api_key`：

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="sk-my-secret",
)
resp = client.chat.completions.create(
    model="Qwen/Qwen2.5-1.5B-Instruct",
    messages=[{"role": "user",
               "content": "你好"}],
)
# 流式：stream=True，SSE 格式
```

> 现有代码改 `base_url` 即可迁移

<!--
OpenAI 兼容是 vLLM 的部署优势。
-->

---

# 量化方案

通过 `--quantization` 用显存换吞吐

| 方案 | bit | 显存 | 速度 | 典型场景 |
|------|------|------|------|------|
| FP16/BF16 | 16 | 1.0x | 1.0x | 基准 |
| **GPTQ** | 4/8 | ~0.3x | 1.1x | 显存吃紧 |
| **AWQ** | 4 | ~0.3x | 1.2x | 4bit 精度更稳 |
| **FP8**（H100） | 8 | 0.5x | **2.0x** | H100/H200 首选 |
| BitsAndBytes | 8/4 | 0.5x | 0.7x | 兜底兼容 |

```bash
vllm serve TheBloke/Llama-2-13B-AWQ --quantization awq
vllm serve meta-llama/Llama-3-70B --quantization fp8
```

> **H100/H200/Ada L40S 硬件原生 FP8**——砍一半显存又近翻倍吞吐，精度损失可忽略，生产首选

<!--
FP8 是 Hopper 架构时代首选。
-->

---

# 多卡并行

大模型单卡装不下（70B FP16 需 140GB），必须切分

| 并行 | 切分方式 | 特点 | 命令 |
|------|------|------|------|
| **TP**（张量） | 权重按维切 | 通信大，需 NVLink；N 须整除头数 | `--tensor-parallel-size 4` |
| **PP**（流水线） | 按层切段 | 通信小，适合跨节点；有气泡 | `--pipeline-parallel-size 2` |
| **DP**（数据） | 每节点一份副本 | 前置 L7 负载均衡 | Ray 多节点 |

**组合示例**（8 卡部署 405B）：

```bash
vllm serve <model> \
  --tensor-parallel-size 4 \
  --pipeline-parallel-size 2
```

> 单机 NVLink 用 TP；跨机用 PP 或 TP+PP

<!--
TP 最常用，PP 适合跨节点。
-->

---
layout: two-cols
---

# Speculative Decoding

用小而快的 **draft model** 猜接下来 K 个 token，大模型一次性验证——猜对接受，猜错回退。

```bash
# n-gram 推测（无需额外模型）
vllm serve <model> \
  --speculative-model "[ngram]" \
  --num-speculative-tokens 5

# 小模型作 draft
vllm serve Llama-3-70B \
  --speculative-model Llama-3-1B \
  --num-speculative-tokens 5
```

::right::

# 高级优化速查

| 特性 | Flag | 场景 |
|------|------|------|
| Prefix Caching | `--enable-prefix-caching` | RAG/Agent 共享 prompt |
| Chunked Prefill | `--enable-chunked-prefill` | 长 prompt 不阻塞 decode |

**Speculative 适用**：

- 输出可预测（代码/JSON/重复结构）→ 接受率高，砍 30-70% 延迟
- 高温度随机生成 → 接受率低，收益小甚至负

> 结构化输出场景收益最大

<!--
Speculative Decoding 在结构化输出场景收益最大。
-->

---

# 部署运维

vLLM serve 内部基于 `uvicorn` + async，**不需要套 gunicorn**。多 worker 用 Data Parallel + 前置负载均衡。

**监控**（Prometheus `/metrics`）：

| 指标 | 含义 |
|------|------|
| `vllm:gpu_cache_usage_perc` | KV Cache 使用率 |
| `vllm:num_requests_waiting` | 等待队列长度 |
| `vllm:time_to_first_token_seconds` | TTFT 首字延迟 |

**OOM 排查**：

- 启动即 OOM → 调低 `--gpu-memory-utilization` / `--max-model-len`，换量化
- 跑一段 OOM → KV Cache 满，调 `--max-num-seqs`，开 prefix caching

> 盯 `gpu_cache_usage_perc`（接近 1 该加显存/限流）与队列堆积

<!--
监控 + OOM 排查是运维关键。
-->

---

# 与其他方案对比

| 需求 | 推荐 |
|------|------|
| 数据中心高吞吐 LLM serving | **vLLM** |
| 极致 NVIDIA 性能 + 工程预算 | TensorRT-LLM |
| 本地消费级 / CPU | Ollama / llama.cpp |
| 全栈 ML serving | BentoML / Triton / TGI |

**vLLM 局限**：

- 显存门槛高，小显存卡易 OOM；消费级用 Ollama
- CPU / 消费级 GPU 支持弱，主要面向 A100/H100/L40S
- 首次启动慢（加载模型 + 编译 CUDA graph）；版本迭代激进，需锁定版本

<!--
vLLM 是数据中心 LLM serving 的默认选择。
-->

---

# 性能调优 Checklist

1. **硬件匹配**：H100/H200 优先 FP8；A100 用 BF16 或 AWQ；消费卡换 Ollama
2. **量化**：能 FP8 就 FP8；社区有 AWQ 模型直接用
3. **开 Prefix Caching**：RAG/Agent 场景必开 `--enable-prefix-caching`
4. **开 Chunked Prefill**：长 prompt 场景必开
5. **`--max-model-len` 别设太大**：按业务最大长度设，留更多显存给 KV
6. **TP 选对**：单机 NVLink 用 TP；跨机用 PP 或 TP+PP
7. **Speculative Decoding**：结构化输出试 `--speculative-model "[ngram]"`
8. **监控**：必上 Prometheus + Grafana，盯 KV 使用率与队列

> 八步调优覆盖绝大多数生产场景

<!--
性能调优的八步 Checklist。
-->

---
layout: quote
---

# vLLM 精髓

「PagedAttention 让显存利用率从 ~30% 跃升到 ~96%，Continuous Batching 消除 GPU 空转——这就是 vLLM 单卡吞吐高 2-24 倍的根本。」

---
layout: center
class: text-center
---

# 小结

vLLM = PagedAttention + Continuous Batching + OpenAI API

**高吞吐 · 低延迟 · 数据中心首选**

[vLLM 文档](https://docs.vllm.ai/) · [GitHub](https://github.com/vllm-project/vllm)

<!--
vLLM 是开源 LLM serving 的事实标准。
-->
