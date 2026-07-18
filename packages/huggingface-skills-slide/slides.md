---
theme: seriph
background: https://cover.sli.dev
title: Hugging Face Skills
info: |
  Hugging Face 官方 agent 技能集：Hub CLI / SageMaker 部署 / 训练 / 数据集 / Spaces / 论文。
  huggingface/skills · Apache-2.0。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Hugging Face Skills

Hugging Face 官方技能集——**覆盖 HF 全生态**工程实践

<div class="pt-6 opacity-80">
huggingface/skills · hf-cli / cloud / trainer / datasets / spaces / papers · Apache-2.0
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/huggingface/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #FFD21E 10%, #FF9D00 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Hugging Face Skills 是 HF 官方出品的 AI/ML 工程技能集，把全生态（Hub 操作、训练、部署、数据集、Spaces、论文）打包成 agent 可按需调用的技能。Apache-2.0，遵循 agentskills.io 标准格式。
-->

---
transition: fade-out
---

# 它是什么：25 个官方 skill

<div class="grid grid-cols-2 gap-4 mt-3 text-sm">
<div v-click>

**Hub CLI（引导）**
- `hf-cli` —— 所有 hf 命令

**Cloud / SageMaker（6）**
- aws-context / python-env
- sagemaker planner / iam
- production-defaults / serving-image

**训练（6）**
- llm-trainer / trl-training
- vision-trainer / sentence-transformers
- trackio / zerogpu

</div>
<div v-click>

**数据 / 评测（2）**
- datasets（Viewer API）
- community-evals

**Spaces / Gradio（3）**
- spaces / gradio / lora-space-builder

**本地推理（2）**
- local-models（GGUF/llama.cpp）
- transformers-js

**论文 / 工具（5）**
- papers / paper-publisher
- best / tool-builder / hf-mem

</div>
</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

装：`hf skills add <name>`；引导 skill = `hf-cli`。

</div>

<style>
h1 { background: linear-gradient(45deg, #FFD21E 10%, #FF9D00 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
25 个 skill 分 7 类：Hub CLI 一个引导，Cloud/SageMaker 6 件套，训练 6 个，数据/评测 2 个，Spaces/Gradio 3 个，本地推理 2 个，论文/工具 5 个。引导是 hf-cli。
-->

---
transition: fade-out
---

# 安装：4 客户端通用

先装 hf CLI，再按客户端装 skill 集

```bash
# 1. 装 hf CLI
curl -LsSf https://hf.co/cli/install.sh | bash -s
hf auth login   # OAuth 一次性 code
hf auth whoami  # 验证
```

<v-clicks>

- **Claude Code**：`/plugin marketplace add huggingface/skills` → `/plugin install hf-cli@huggingface/skills`
- **Codex**：复制 `skills/<name>` 到 `.agents/skills`（仓库级 / 用户级）
- **Gemini CLI**：`gemini extensions install . --consent`
- **Cursor**：仓库含 `.cursor-plugin/plugin.json` + `.mcp.json`

</v-clicks>

<div v-click class="mt-3 text-center text-sm opacity-80">

市场入口仅 `hf-cli`，其余用 `hf skills add <name>`。

</div>

<style>
h1 { background: linear-gradient(45deg, #FFD21E 10%, #FF9D00 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
先装 hf CLI 并登录；再按客户端装。Claude Code 走 plugin marketplace，Codex 复制到 .agents/skills，Gemini CLI 装 extension，Cursor 用 plugin manifest。市场只暴露 hf-cli。
-->

---
transition: fade-out
---

# hf-cli：引导 skill

由本地 hf CLI 动态生成，始终最新

<div class="grid grid-cols-2 gap-4 mt-3 text-sm">
<div v-click>

| 命令族 | 用途 |
| --- | --- |
| `hf auth` | 登录/whoami/token |
| `hf download/upload/cp/sync` | 上下行 / 同步 |
| `hf buckets` | 云存储 |
| `hf cache` | 本地缓存 |

</div>
<div v-click>

| 命令族 | 用途 |
| --- | --- |
| `hf datasets` | 元信息/parquet/SQL |
| `hf spaces` | Spaces 生命周期 |
| `hf jobs` | HF Jobs |
| `hf papers/collections` | 论文 / 集合 |

</div>
</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

取代旧 `huggingface-cli`；触发词：`hf` / `huggingface` / HF 生态任何操作。

</div>

<style>
h1 { background: linear-gradient(45deg, #FFD21E 10%, #FF9D00 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
hf-cli 由本地 CLI 生成（huggingface_hub v1.23.0），覆盖所有 Hub 命令族：auth/download/upload/buckets/cache/datasets/spaces/jobs/papers/collections/discussions。取代旧的 huggingface-cli。任务是 HF 生态操作时自动触发。
-->

---
transition: fade-out
---

# SageMaker 部署：6 skill 工作流

由 planner 编排

```text
hf-cloud-sagemaker-deployment-planner
  ├─ 1. aws-context-discovery      探测 AWS 上下文
  ├─ 2. python-env-setup           隔离 Python + boto3
  ├─ 3. sagemaker-iam-preflight    确保 execution role
  ├─ 4. serving-image-selection    选 serving 容器
  └─ 5. production-defaults        real-time / async 端点
```

<div class="mt-3 text-sm">

| Pathway | 适用 |
| --- | --- |
| **Real-time** | 稳态流量、LLM 默认 |
| **Async** | 长推理（>60s）、突发 |
| Serverless / Batch / Bedrock CMI | 按需 |

</div>

<div v-click class="mt-2 text-center text-sm opacity-80">

GPU 配额默认常为 0——**先查 quota 再推实例**。

</div>

<style>
h1 { background: linear-gradient(45deg, #FFD21E 10%, #FF9D00 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
SageMaker 部署 6 件套按工作流编排：discovery → env → iam → image → production-defaults。Real-time 是 LLM 默认 pathway，async 适合长推理。GPU 配额默认常为 0，一定要先查 quota 再推实例。
-->

---
transition: fade-out
---

# 训练：TRL + HF Jobs

云 GPU 训练，无需本地 GPU

<v-clicks>

- **llm-trainer**：TRL（SFT/DPO/GRPO/Reward Modeling）或 **Unsloth**（省 ~60% VRAM、~2x 快）
- **vision-trainer**：D-FINE / RT-DETR / DETR / YOLOS / timm / SAM2
- **train-sentence-transformers**：bi-encoder / CrossEncoder / SparseEncoder
- **trackio**：实验追踪与可视化

</v-clicks>

<div v-click class="mt-3 text-sm">

```python
# llm-trainer 关键约束
hf_jobs("uv", {...})   # 始终用 MCP 工具提交，不要 bash trl-jobs
# 每个训练脚本加 Trackio 监控
```

</div>

<div v-click class="mt-2 text-center text-sm opacity-80">

提交后给 job ID + 监控 URL + 预计时长。

</div>

<style>
h1 { background: linear-gradient(45deg, #FFD21E 10%, #FF9D00 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
训练系 skill 跑在 HF Jobs 云 GPU 上。llm-trainer 支持 TRL 四法和 Unsloth；vision-trainer 覆盖检测/分类/分割；sentence-transformers 三种 encoder。关键约束：必须用 hf_jobs MCP 工具提交，每个脚本加 Trackio 监控。
-->

---
transition: fade-out
---

# Spaces：三种 SDK

每个 Space 是一个 git repo

| SDK | 适用 | ZeroGPU |
| --- | --- | --- |
| **Gradio** | 公开 ML Demo，Python | ✅ |
| **Docker** | 非 Python / 预置模板 | ❌ |
| **Static** | 浏览器 ML / 项目页 | N/A |

<v-clicks>

- **ZeroGPU**（`zero-a10g`）：RTX PRO 6000 Blackwell；large=48GB / xlarge=96GB；需 PRO/Team/Enterprise
- **Dedicated GPU**：T4/L4/A10G/L40S/A100/H200；按小时计费；需 `canPay=True`
- **默认**：公开 Demo → Gradio + ZeroGPU；非 PyTorch 主推理 → dedicated GPU

</v-clicks>

<div v-click class="mt-2 text-center text-sm opacity-80">

ZeroGPU hijack 只 patch torch——非 torch 主路径需切 dedicated 或包进 `@spaces.GPU`。

</div>

<style>
h1 { background: linear-gradient(45deg, #FFD21E 10%, #FF9D00 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Spaces 三 SDK：Gradio 支持 ZeroGPU，Docker 不支持，Static 免费。ZeroGPU 在 RTX PRO 6000 Blackwell 上动态分配。默认公开 Demo 选 Gradio + ZeroGPU。注意 ZeroGPU 只 patch torch，非 PyTorch 主推理要切 dedicated 或包进 spaces.GPU。
-->

---
transition: fade-out
---

# 数据 / 论文 / 本地推理

只读 + 工具型 skill

<div class="grid grid-cols-2 gap-4 mt-3 text-sm">
<div v-click>

**datasets（Viewer API）**
- `/is-valid` → `/splits`
- `/first-rows` → `/rows`（≤100）
- `/search` / `/filter`
- `/parquet` `/size` `/statistics`

</div>
<div v-click>

**papers / paper-publisher**
- 读论文页 + 论文 API
- 元数据：作者 / 关联
- 在 Hub 发布论文

</div>
</div>

<v-clicks>

- **local-models**：选模型用 llama.cpp + GGUF（CPU/Metal/CUDA/ROCm）
- **transformers-js**：在 JS/TS 跑 SOTA ML
- **best / tool-builder / hf-mem**：选模型 / 建工具 / 估算显存

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #FFD21E 10%, #FF9D00 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
数据集走只读 Viewer API：从 is-valid 到 splits/rows/search/filter/parquet/size/statistics。papers 读论文页元数据，paper-publisher 发布论文。local-models 用 GGUF+llama.cpp，transformers-js 在浏览器跑。best/tool-builder/hf-mem 是工具型。
-->

---
transition: fade-out
---

# 反模式：别踩

<v-clicks>

- ❌ **绕开 `hf_jobs()`**：llm-trainer 要求用 MCP 工具，不要 bash 跑 trl-jobs
- ❌ **用旧 `huggingface-cli`**：已被 `hf` 取代，auth 全在 `hf auth` 下
- ❌ **市场装非 `hf-cli`**：市场只暴露 hf-cli，其余 `hf skills add`
- ❌ **ZeroGPU 跑非 PyTorch 主推理**：hijack 只 patch torch
- ❌ **不查 quota 推 SageMaker 实例**：GPU 配额默认常为 0
- ❌ **gated 数据集不加 token**：Viewer 调用会失败

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #FFD21E 10%, #FF9D00 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
六个常见反模式：绕开 hf_jobs MCP、用旧 huggingface-cli、市场装非 hf-cli、ZeroGPU 跑非 torch、不查 quota 推实例、gated 数据集漏 token。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Hugging Face 官方 25 skill：hf-cli 是引导（覆盖所有 hf 命令）、Cloud 6 件套编排 SageMaker 部署、训练在 HF Jobs、Spaces 三 SDK、Apache-2.0 跨 4 客户端。**

<div class="mt-8 opacity-80">

官方沉淀 · 全生态覆盖 · hf-cli 引导 · SageMaker 工作流 · Apache-2.0

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/huggingface/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://huggingface.co/docs/hub/agents-cli" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #FFD21E 10%, #FF9D00 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Hugging Face 官方 25 个 skill：hf-cli 是引导路径覆盖所有 hf 命令，Cloud 6 件套编排 SageMaker 部署工作流，训练跑在 HF Jobs，Spaces 有三种 SDK，Apache-2.0 开源跨 4 客户端。
-->
