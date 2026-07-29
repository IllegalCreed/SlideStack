---
theme: seriph
background: https://cover.sli.dev
title: Llama 完全指南
info: |
  Meta Llama 4 完全指南：开源旗舰 · MoE 多模态 · 本地部署 · LoRA 微调

  Learn more at [https://www.llama.com](https://www.llama.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Llama 完全指南

Meta 开源旗舰 · MoE 多模态 · 本地部署 · 微调

<div @click="$slidev.nav.next" class="mt-12 py-1" class="hover:bg-white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Llama 4 herd 于 2025-04-05 由 Meta 发布，原生多模态 MoE 架构，开源权重旗舰。
-->

---
transition: fade-out
---

# 什么是 Llama

Meta 开源的**大语言模型系列**

- **开源旗舰**：Meta 出品，HuggingFace `meta-llama` 官方权重，vLLM/Ollama/LM Studio Day 0 支持
- **MoE 多模态**：alternating dense + MoE 层，原生 early fusion（文本+图像+视频）
- **三尺寸覆盖**：Scout 10M / Maverick 1M / Behemoth 教师
- **超长上下文**：iRoPE + attention temperature scaling，最长 10M token
- **生态完整**：本地桌面（Ollama/LM Studio）、生产服务（vLLM）、托管 API（Meta Model API）、微调（PEFT）
- **知识截止**：2024-10

> Llama 是 open-weight，但走 **Llama 4 Community License**，非 MIT/Apache。

<!--
强调：open-weight ≠ open-license，700M MAU 阈值是合规关键。
-->

---

# 三模型参数表

| 模型 | 激活 | 总参 | experts | 上下文 |
|------|------|------|------|------|
| **Scout** | 17B | 109B | 16E | **10M** |
| **Maverick** | 17B | 400B | 128E+1 shared | **1M** |
| **Behemoth** | 288B | 近 2T | 16E | - |

- Scout Int4 量化可塞进**单张 H100**
- Maverick FP8 可塞进**单台 8 卡 H100 DGX**
- **Behemoth 仍在训练**，作 Scout/Maverick 蒸馏教师，**非完全开源权重**

> Behemoth 在部分 STEM benchmark 超 GPT-4.5 / Claude Sonnet 3.7，但不要写进生产架构。

<!--
三模型分工：Scout 边缘 / Maverick 旗舰 / Behemoth 教师。
-->

---
layout: two-cols
---

# MoE vs Dense

**Dense 模型**

- 全部参数参与每个 token
- 显存按总参数
- 算力按总参数

**Llama 4 MoE**

- 每 token 仅激活**一小部分专家**
- 显存**仍按总参数**（全部常驻）
- 算力按**激活参数**（17B）

**显存 vs 算力**

| 估算 | 用哪个 |
|------|------|
| 显存 | **总参数** |
| 算力 | **激活参数** |

::right::

# 关键陷阱

**最易踩的坑**

- 把「17B 激活」当 17B dense 算显存 → **直接 OOM**
- 109B 总参 FP16 ≈ 218GB 显存
- 必须 INT4（~50GB）才能单卡 H100

**Maverick 路由**

- shared expert：每 token 必经
- routed experts：每 token 进 1/128
- 全部 expert 权重常驻显存

> MoE = 用更多显存换更少算力。

<!--
核心点：总参决定显存，激活参数决定算力。
-->

---

# 原生多模态 Early Fusion

文本 + 图像 + 视频**联合预训练**，不是外挂视觉模块

- 视觉编码器基于 **MetaCLIP**，与冻结的 Llama 联合训练
- 预训练阶段：每 prompt 最多 **48 张图**
- 后训练测试：每 prompt 最多 **8 张图**

**Early vs Late Fusion**

| 维度 | Late（外挂） | Early（Llama 4） |
|------|------|------|
| 视觉模块 | 独立 encoder 后接 LLM | 联合预训练 |
| 训练 | 多阶段 | 单阶段 |
| 优势 | 模块解耦 | 跨模态理解更深 |

> Early fusion 让多模态推理比「encoder + projector + LLM」三段式更稳。

<!--
early fusion 是 Llama 4 多模态能力的架构基础。
-->

---

# iRoPE 与超长上下文

**interleaved RoPE**：无位置编码的 global attention 与带 RoPE 的 chunked local attention 按 **1:3** 交错

- global：跨距离依赖（noPE）
- local：近距离细节（RoPE）
- 配合推理期 **attention temperature scaling** 做 length generalization

**Scout 10M 部署要点**

| 项 | 取值 |
|------|------|
| H100 单机可用 | ~1M |
| H200 单机可用 | ~3.6M（KV cache fp8） |
| 必开 | `attn_temperature_tuning=true` |
| 推荐 | `--kv-cache-dtype fp8` |

> 10M 是理论上限，不开温度调参会**掉精度**。

<!--
iRoPE 是 Scout 10M 上下文的关键架构创新。
-->

---
layout: two-cols
---

# 训练规模

- 数据：**>30T token**（Llama 3 的 2x+）
- 语言：**200+**（100+ 语言各 >1B token）
- 精度：**FP8**
- Behemoth 算力峰值：**390 TFLOPs/GPU**

::right::

# 后训练管线

**重构后的流程**

```
lightweight SFT
       ↓
online RL（连续 + 自适应过滤）
       ↓
lightweight DPO
```

**关键改动**

- 删除 **>50%** easy SFT 数据
- Behemoth 删 **95%**
- 与「数据越多越好」相反

> 不要把 Llama 4 后训练说成传统 SFT→DPO。

<!--
后训练管线被 Llama 4 彻底重构。
-->

---

# 三种本地部署工具

| 工具 | 定位 | 引擎 | 命令 |
|------|------|------|------|
| **Ollama** | 桌面 / 原型 | 自研 | `ollama run llama4` |
| **LM Studio** | GUI / 桌面 | llama.cpp + GGUF | 图形界面 + `lms` CLI |
| **vLLM** | 生产 / 服务化 | 自研 | `vllm serve <repo>` |

**选型建议**

- 桌面原型：Ollama（一行起）或 LM Studio（GUI）
- 生产服务：vLLM（continuous batching + PagedAttention）
- **不要混用**：vLLM 的 PagedAttention 优势在桌面用不上，Ollama 在生产无连续批处理能力

> 生产场景必须 vLLM，桌面级用 Ollama/LM Studio。

<!--
按场景选工具，别混用。
-->

---

# vLLM 速跑

```bash
# Scout 单机 8 卡（10M 上下文，需量化）
vllm serve meta-llama/Llama-4-Scout-17B-16E-Instruct \
  --tensor-parallel-size 8 \
  --max-model-len 1000000 \
  --limit-mm-per-prompt image=10 \
  --kv-cache-dtype fp8 \
  --override-generation-config attn_temperature_tuning=true

# Maverick FP8（单台 8 卡 H100 DGX）
vllm serve meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8 \
  --tensor-parallel-size 8
```

**关键 flag**：`--kv-cache-dtype fp8`（翻倍上下文）、`attn_temperature_tuning`（Scout 必需）

> v0.8.3+ Day 0 支持 Llama 4。

<!--
vLLM 是 Llama 4 生产部署的官方推荐引擎。
-->

---
layout: two-cols
---

# Ollama 速跑

```bash
ollama run llama4
```

REST API（默认 `localhost:11434`）

- `POST /api/generate` 单轮
- `POST /api/chat` 对话 + 工具
- `POST /api/embeddings` 向量
- `/api/pull` `/api/show` `/api/list` 管理

多模态：messages 内 `images: ["base64-string"]`

::right::

# Meta Model API

dev.meta.ai 托管，drop-in 兼容

```ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.META_API_KEY,
  baseURL: "https://api.llama.com/compat/v1/",
});
```

- 新账户 **$20 免费额度**
- 按 1M token 计费
- 限流 **3000 RPM/团队**
- Llama 3.3 70B 仍可用

<!--
Ollama 桌面 / Meta API 托管两条非 vLLM 通路。
-->

---

# LoRA 原理

冻结原权重 W，新增低秩矩阵 A、B 使 **ΔW ≈ B×A**

```text
原始前向：  y = W·x
LoRA 前向： y = W·x + B·A·x
```

- A 用 Kaiming-uniform 初始化，B 全零 → 初始恒等映射
- 4096×4096 矩阵（16.7M 参数），r=8 时仅 **65K 可训练**，削减 **256x**
- 原权重冻结，多个适配器可共享一个基础模型

**LoraConfig 必会**：`r`、`lora_alpha`（scale=alpha/r）、`target_modules`（覆盖 q/k/v/o）、`use_rslora`（alpha/√r）

> 109B/400B 总参全参微调成本极高，LoRA 是首选。

<!--
LoRA 是大模型微调的事实标准。
-->

---
layout: two-cols
---

# QLoRA + LoftQ

**QLoRA = NF4 量化 + LoRA**

- 基础模型 NF4（4-bit NormalFloat）
- 16GB GPU 可微调 7B 级

**LoftQ 初始化（官方推荐）**

- 标准流程：先量化再挂默认 LoRA → **丢精度**
- LoftQ：A/B 初始化即补偿量化误差

```ts
new LoraConfig({
  init_lora_weights: "loftq",
  loftq_config: { loftq_bits: 4 },
});
```

::right::

# 推理期合并

部署前必须 **merge_and_unload()**

```ts
const merged = peftModel.merge_and_unload();
await merged.savePretrained("./merged");
```

- 熔成独立模型，零额外延迟
- 可被 vLLM/Ollama 直接 serve
- 保留未合并版本以便迭代

**其他方法**

- `merge_adapter()` / `unmerge_adapter()`：热切换
- `add_weighted_adapter()`：多 LoRA 加权融合

> 不 merge 就上 vLLM 会掉性能或不支持。

<!--
QLoRA + LoftQ + merge 是微调部署的标准三件套。
-->

---
layout: quote
---

# open-weight ≠ open-license

「Llama 4 走 Llama 4 Community License，700M MAU 阈值是合规关键；HF 是 gated repo，绕过会被吊销授权。」

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 把 MoE 17B 激活当 17B dense 算显存 → OOM
- Scout 默认拉到 10M 不开温度调参 → 掉精度
- 拿 Behemoth 当生产模型写进架构
- QLoRA 先 bitsandbytes 量化再挂默认 LoRA → 丢精度
- LoRA 微调完不 merge 就上 vLLM serve
- target_modules 过窄（只挂 q_proj）→ 欠拟合
- 混淆「开源权重」与「开源许可」
- 用 Llama 4 回答 2024-10 之后事件不联网 / RAG

<!--
合规与部署陷阱集中页。
-->

---
layout: center
class: text-center
---

# 小结

Llama 4 = 开源 MoE 多模态旗舰

三尺寸覆盖 · 本地部署三件套 · LoRA/QLoRA 微调

**按总参备显存 · vLLM 生产首选 · 微调前 merge · 合规先核许可**

[文档](https://www.llama.com/) · [Meta Model API](https://dev.meta.ai/) · [HuggingFace](https://huggingface.co/meta-llama)

<!--
掌握 MoE 显存/算力区别 + 三种部署通路 + LoRA 三件套，就能把 Llama 4 用到生产水准。
-->
