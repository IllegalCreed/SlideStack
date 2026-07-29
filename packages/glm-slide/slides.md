---
theme: seriph
background: https://cover.sli.dev
title: GLM 完全指南
info: |
  智谱 GLM 大模型完全指南：GLM-5.2 / 5.1 / 5 / 4.7 / 4.6 · ARC 三能力融合 · BigModel API

  Learn more at [https://docs.bigmodel.cn](https://docs.bigmodel.cn)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## GLM 完全指南

智谱 AI · GLM-5.2 / 5.1 / 5 · ARC 三能力融合 · MIT 开源

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/zai-org/GLM-4.5" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
GLM 是智谱 AI 自研的国产大语言模型家族，2026-06-16 主推 GLM-5.2 长任务时代旗舰。
-->

---
transition: fade-out
---

# 什么是 GLM

智谱 AI（Z.ai）自研的**国产大语言模型家族**

- **国产合规**：国内调用无墙、合规走国内云，中文场景体验好
- **ARC 三能力融合**：Agentic + Reasoning + Coding 同一模型原生支持
- **MoE 混合专家**：GLM-5 总参数 744B / 激活 40B，预训练 28.5T tokens
- **深度思考可控**：`thinking.type` 开关 + `reasoning_effort` 五档（none~max）
- **OpenAI 兼容**：`messages` / `tools` / `stream` / `temperature` 结构对齐
- **MIT 开源**：HuggingFace `zai-org/GLM-4.5/4.5-Air/5/5.2` 全权重放出来

> GLM ≠ OpenAI 1:1 等价。`thinking` / `reasoning_effort` / `web_search` / MCP 是 GLM 特色字段。

<!--
强调结构兼容 + 特色字段：迁移成本最低，但差异化能力来源在 GLM 特色字段。
-->

---

# 全模型矩阵（按模态分工）

| 类型 | 代表模型 | 用途 |
|------|------|------|
| **文本旗舰** | glm-5.2 / 5.1 / 5 | 长任务 / Agent / 编码 |
| **文本中端** | glm-4.7 / 4.7-flash / 4.6 | 日常生产 |
| **文本普惠** | glm-4.5-air(x) / glm-4-long(1M) | 高并发 / 调试 |
| **视觉多模态** | glm-5v-turbo / 4.6v / 4.6v-flash | 图像理解 |
| **OCR / 文档** | glm-ocr | PDF（单图 ≤10MB / PDF ≤100 页） |
| **文生图** | glm-image / cogview-4 | 图像生成 |
| **视频** | cogvideox-3 / vidu-q1 | 视频生成 |
| **语音** | glm-tts / asr-2512 / realtime | 合成 / 识别 / 实时 |
| **向量与检索** | embedding-3 / rerank | RAG 增强 |
| **Agent** | autoglm-phone | 手机 / 浏览器自动化 |

> 不存在「一模型打天下」，文本模型无视觉通道，硬接图像 / PDF 会失败。

<!--
按模态分工是 GLM 的核心定位。
-->

---

# 各代基座定位

| 模型 | 上下文 | 对标对象 | 关键基准 |
|------|------|------|------|
| **GLM-5.2** | **1M** | 介于 Opus 4.7 / 4.8 | FrontierSWE 落后 Opus 4.8 ~1% |
| **GLM-5.1** | 200K | Opus 4.6 | SWE-Bench Pro **58.4**（超 GPT-5.4） |
| **GLM-5** | 200K | Opus 4.5 | 744B / 40B 激活，预训练 28.5T |
| **GLM-4.7** | 200K | - | SWE-bench **73.8** |
| **GLM-4.6** | 200K | Sonnet 4 | 思考开启省 30%+ token |
| GLM-4.5 / 4.5-X | 128K | - | **即将下线**，迁 4.7 |

> 别拿 GLM-4.5（2025）参数规模当 GLM-5/5.2（2026）事实。两代架构。

<!--
对标阶梯清晰：每代都对标一个 Claude Opus / Sonnet 版本。
-->

---

# MoE 参数规模

| 模型 | 总参数 | 激活 | 预训练 tokens |
|------|------|------|------|
| GLM-4.5 | 355B | 32B | 15T |
| GLM-4.5-Air | 106B | 12B | - |
| GLM-4.7-Flash | 30B | 3B | - |
| **GLM-5 / 5.1 / 5.2** | **744B** | **40B** | **28.5T** |

**关键技术**

- 集成 **DeepSeek Sparse Attention**（稀疏注意力）
- 采用 **Slime 异步 RL**（强化学习）
- ARC 三能力（Agentic + Reasoning + Coding）原生融合

> GLM-5.2 把上下文推到 1M tokens、最大输出 128K，承载整工程仓库级上下文。

<!--
GLM-5 系列是真正的旗舰代，与 GLM-4.5 完全不在一个量级。
-->

---
layout: two-cols
---

# 上下文与输出阶梯

| 模型档位 | 上下文 | 最大输出 |
|------|------|------|
| Air 系列 | 128K | 96K |
| 4.6 / 4.7 / 5 / 5.1 | 200K | 128K |
| GLM-4-Long / **GLM-5.2** | **1M** | 128K |

**Context Cache**

- 承载长对话 / 项目级工程上下文
- 重复长前缀**不缓存会重复计费**
- 延迟也会翻倍

::right::

# API 双端点

**通用 PaaS**

- `open.bigmodel.cn/api/paas/v4`
- 通用 Agent 工具
- 走次级调度 + 尽力交付

**Coding Plan 专属**

- `open.bigmodel.cn/api/coding/paas/v4`
- Claude Code / Cline / Roo Code / Kilo Code
- **享优先保障**

> 通用 Agent 走 PaaS，高峰期可能降级。

<!--
编码场景必须走 coding/paas/v4 才有优先保障。
-->

---

# 一次最小调用

```bash
curl -X POST https://open.bigmodel.cn/api/paas/v4/chat/completions \
  -H "Authorization: Bearer $BIGMODEL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-5.2",
    "messages": [
      {"role": "system", "content": "你是资深前端工程师"},
      {"role": "user", "content": "用三句话介绍 GLM"}
    ],
    "thinking": {"type": "enabled"},
    "reasoning_effort": "medium",
    "stream": false
  }'
```

> 认证：HTTP Bearer Token。API Key 在 `bigmodel.cn/usercenter/proj-mgmt/apikeys`。

<!--
结构兼容 OpenAI，但 thinking / reasoning_effort 是 GLM 特色字段。
-->

---

# thinking 参数族

| 参数 | 取值 | 用途 |
|------|------|------|
| `thinking.type` | `enabled` / `disabled` | 开关深度思考 |
| `reasoning_effort` | `none` / `low` / `medium` / `high` / `max` | 按任务调推理强度 |
| Interleaved Thinking | 自动 | 每次工具调用前先思考 |
| Preserved Thinking | 自动 | GLM-4.7+ 多轮保留思考 |
| Turn-level Thinking | 自动 | 按对话轮次开关 |

> 默认 thinking 全开是反模式：简单问答 / 分类全开会成倍增加 token 与延迟。

<!--
按任务调档：简单问答用 none，数学/工程规划用 max。
-->

---

# Agent 工具链：Function Calling

```json
{
  "model": "glm-5.2",
  "messages": [{"role": "user", "content": "查上海今天天气"}],
  "tools": [{
    "type": "function",
    "function": {
      "name": "get_weather",
      "parameters": {
        "type": "object",
        "properties": {"city": {"type": "string"}}
      }
    }
  }],
  "tool_choice": "auto"
}
```

**内置工具**：`web_search`（联网搜索）· `retrieval`（检索）· **MCP 工具调用**

> Coding Agent 享优先保障；通用 Agent 走次级调度 + 尽力交付，高峰期可能降级。

<!--
三件套：Function Calling + web_search + MCP。
-->

---
layout: two-cols
---

# SDK 三件套

**Python（新，推荐）**

- `pip install zai-sdk`
- `ZhipuAiClient`
- 原生支持 thinking / MCP

**Python（旧）**

- `pip install zhipuai`
- `ZhipuAI`
- 仍可用，建议迁新

**Java**

- `ai.z.openapi:zai-sdk:0.3.5`

::right::

# Coding Plan 套餐

| 套餐 | 价格 | 配额 | 并发 |
|------|------|------|------|
| **Lite** | ¥20/月 | ~120 prompts/天 | 10 |
| **Pro** | ¥100/月 | ~600 prompts/天 | 30 |

**对接**

- Claude Code
- Cline
- Roo Code
- Kilo Code

> 编码场景享优先保障。

<!--
国内 Coding Agent 最便宜的订阅方案之一。
-->

---

# 自部署（开源 MIT 权重）

**vLLM 部署（推荐）**

```bash
vllm serve zai-org/GLM-4.5-FP8 \
  --tool-call-parser glm47 \
  --reasoning-parser glm45 \
  --enable-auto-tool-choice \
  --max-model-len 131072
```

**显存预估**

| 权重 | GLM-4.5 全 128K | GLM-4.5-Air FP8 |
|------|------|------|
| BF16 | H100 × 32 | H100 × 4 |
| **FP8** | **H100 × 16** | **H100 × 2** |

> 生产硬部署 BF16 是反模式。默认 FP8 + 投机解码（EAGLE / mtp）才经济。

<!--
SGLang 也可用，开 EAGLE 投机解码进一步提速。
-->

---
layout: quote
---

# finish_reason: sensitive

「别期待 GLM 完全绕过中文内容审核，涉政 / 违规内容会被截断。」

`stop` / `tool_calls` / `length` / **`sensitive`**（GLM 特色）/ `network_error`

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 把 GLM API 当 OpenAI 1:1 等价直接替换
- 用文本模型（glm-5 / 4.6）处理图像或 PDF（应走 GLM-5V / OCR）
- 继续接入即将下线的模型（GLM-4.5 / 4.5-X / Z1 / 4-0520）
- 在通用 Agent 场景期待 Coding Plan 优先级
- 期待 GLM 完全绕过中文内容审核
- 生产环境硬部署 BF16 权重（需 H100×32）
- 默认 thinking 全开跑所有请求
- 拿 GLM-4.5 参数规模当 GLM-5/5.2 事实
- Coding 端点跑通用 Agent（混用易被限流）

<!--
反模式部分是 GLM 与 OpenAI 等其他模型差异最大的地方。
-->

---
layout: center
class: text-center
---

# 小结

GLM = 国产合规 + ARC 三能力融合 + MIT 开源

**GLM-5.2 旗舰 · 1M 上下文 · Coding Plan ¥20 起**

按任务选模型 · 按 `reasoning_effort` 调档 · Coding Agent 走专属端点

[文档](https://docs.bigmodel.cn/cn/guide/start/model-overview) · [GitHub](https://github.com/zai-org/GLM-4.5) · [HuggingFace](https://huggingface.co/zai-org/GLM-5)

<!--
掌握按任务选模型 + 特色字段保留 + 端点分流，就能把 GLM 用到生产水准。
-->
