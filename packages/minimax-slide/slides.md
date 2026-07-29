---
theme: seriph
background: https://cover.sli.dev
title: MiniMax 完全指南
info: |
  MiniMax 大模型完全指南：M3 旗舰 · Lightning Attention · 全模态 · 双协议接入

  Learn more at [https://platform.minimaxi.com](https://platform.minimaxi.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## MiniMax 完全指南

国产通用大模型 · M3 旗舰 · 全模态 · Lightning Attention

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/MiniMax-AI/MiniMax-01" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
MiniMax 是国内头部通用大模型厂商，2026-06 主推 M3（1M 上下文）+ 开源 MiniMax-Text-01（456B MoE）。
-->

---
transition: fade-out
---

# 什么是 MiniMax

国内头部**通用大模型厂商**的多模态大模型家族

- **全模态覆盖**：语言（M 系列）/ 语音（Speech）/ 视频（Hailuo）/ 图像 / 音乐
- **超长上下文**：M3 **1M token**，承载整工程仓库 / 长会话
- **Lightning Attention**：MiniMax-01 自研闪电注意力，推理外推 4M token
- **双协议接入**：Anthropic + OpenAI 双兼容（M3 独有特色）
- **国产合规**：国内调用无墙，中文场景体验好
- **C 端品牌**：海螺 AI（hailuoai.com）/ B 端 MiniMax 开放平台

> MiniMax ≠ OpenAI / Anthropic / Google。是国产厂商，与 GPT / Claude / Gemini 属不同厂商。

<!--
强调全模态 + 双协议 + 国产合规三大差异化标签。
-->

---

# 五大模态矩阵

| 类型 | 代表模型 | 用途 |
|------|------|------|
| **文本旗舰** | MiniMax-M3 | Agent / 长上下文 / 代码 |
| **文本高速** | M2.7 highspeed | 极速响应（~100 tps） |
| **文本开源** | MiniMax-Text-01 | 自部署 / 推理外推 4M |
| **同步 TTS** | speech-2.8-hd / turbo | 短文本（10000 字符） |
| **异步 TTS** | t2a_async_v2 | 长文本（100 万字符） |
| **音色复刻** | voice_clone | 10s~5min 个性化音色 |
| **实时对话** | Realtime API | 全双工 < 250ms |
| **视频** | Hailuo-2.3 / Fast | 文生 / 图生视频 |
| **图像** | image-01 / live | 文生图 / 图生图 |
| **音乐** | Music-3.0 | 灵感 + 歌词生成 |

> 不存在「一模型打天下」，跨模态串联需自行编排。

<!--
按模态分工是 MiniMax 的核心定位，与 GLM 类似。
-->

---

# M3 旗舰与上下文

| 维度 | 指标 |
|------|------|
| **上下文窗口** | **1,000,000 token（1M）** |
| 发布时间 | 2026-06 |
| 定位 | Agent 推理 / Tool Use / 代码 / 多模态 |
| Anthropic 兼容 | ✓（含 `thinking` 块） |
| OpenAI 兼容 | ✓ |
| 输入模态 | 文本 + 图像 + 视频 |

**Interleaved Thinking（交错思考）**

- M3 在**工具调用多轮之间**原生推理
- Anthropic 路径返回 `thinking` 类型响应块
- 区别于 Claude 的单次 Extended Thinking

> Anthropic 端点显示 200K 是客户端 bug，实际 1M（GitHub Issue #46）。

<!--
M3 是当前旗舰，1M 上下文 + Interleaved Thinking 是核心卖点。
-->

---
layout: two-cols
---

# 双协议接入

**OpenAI 兼容**

- 端点：`/v1/chat/completions`
- 平迁成本最低
- 不支持 `thinking` 块
- 通用问答 / 翻译

**Anthropic 兼容（推荐）**

- 端点：`/anthropic/v1/messages`
- 支持 `thinking` 块
- 支持 Interleaved Thinking
- 提供 token 计数端点
- **Agent 推理 / Tool Use 首选**

::right::

# 为何官方推荐 Anthropic

**M3 专为 Agent 优化**

- 工具调用表现更优
- 多步推理原生支持
- `thinking` 块可读
- 事件粒度更细

```text
POST /anthropic/v1/messages
Authorization: Bearer $MINIMAX_API_KEY
anthropic-version: 2023-06-01
```

> MiniMax 区别于 GLM / DeepSeek 等仅 OpenAI 兼容的国产模型。

<!--
双协议是 MiniMax 独有能力，Anthropic 路径是 M3 推荐姿势。
-->

---

# Tool Use 完整示例

```json
{
  "model": "MiniMax-M3",
  "messages": [{"role": "user", "content": "查上海天气"}],
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

**`tool_choice` 四档**：`auto`（默认）/ `any`（必调）/ `tool`（指定）/ `none`（禁用）

> M3 是原生 Agentic 模型，工具调用 + Interleaved Thinking 是核心能力。

<!--
工具调用结构与 OpenAI 兼容，迁移成本低。
-->

---
layout: two-cols
---

# Lightning Attention

**MiniMax-01（开源 456B MoE）**

- 总参 **456B** / 激活 **45.9B**
- 自研闪电注意力机制
- 长序列推理 ~O(n) 复杂度
- 训练 **1M** / 推理外推 **4M** token

**MoE 架构经济**

- 每 token 仅激活 1/10 参数
- 推理算力远低于 Dense 同规模
- 可自部署（HuggingFace / GitHub）

::right::

# 与其他长上下文对比

| 方案 | 复杂度 | 外推 |
|------|------|------|
| **Lightning** | ~O(n) | 4M |
| Sparse Attn | O(n log n) | 1M |
| Ring Attn | O(n²) 分片 | 10M |
| Native Long | O(n²) | 2M |

> 详见 arXiv:2501.08313。

<!--
Lightning Attention 是 MiniMax-01 的核心创新，开源旗舰的差异化卖点。
-->

---

# 语音合成（T2A）三档接口

| 接口 | 协议 | 文本上限 | 适用 |
|------|------|------|------|
| **`t2a_v2`** | HTTP | 10000 字符 | 短文本 |
| **`t2a_v2` WSS** | WebSocket | 10000 字符 | 流式播放 |
| **`t2a_async_v2`** | HTTP | **100 万字符** | 有声书 |

**异步接口核心能力**

- 单次最大 **100 万字符**
- 句级时间戳（字幕对齐）
- 结果 URL 有效期 **9 小时**

> 同步接口跑 > 10000 字符会直接报错，必须切 `t2a_async_v2`。

<!--
同步 10000 字符是硬上限，长文本必须异步。
-->

---
layout: two-cols
---

# 音色复刻规则

- 音频时长：**10 秒 ~ 5 分钟**
- 音频大小：≤ **20 MB**
- `voice_id` 长度：8 ~ 256
- 首字符：**必须英文字母**
- 末位不可为 `-` 或 `_`
- 临时音色有效期：**7 天**
- 复刻权限：需个人/企业认证

::right::

# 语气词标签（独有）

仅 `speech-2.8` 系列支持，22 种：

| 标签 | 含义 |
|------|------|
| `(laughs)` | 笑 |
| `(sighs)` | 叹气 |
| `(crying)` | 哭 |
| `(gasps)` | 倒吸一口气 |
| `(humming)` | 哼唱 |
| `(whispers)` | 耳语 |

> 旧系列（speech-02 / 01）忽略或报错。

<!--
音色克隆 7 天保活是最大坑；语气词标签是 2.8 独有。
-->

---

# 一次最小调用

```bash
# OpenAI 兼容路径（M3）
curl -X POST https://api.minimaxi.com/v1/chat/completions \
  -H "Authorization: Bearer $MINIMAX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "MiniMax-M3",
    "messages": [
      {"role": "system", "content": "你是资深前端工程师"},
      {"role": "user", "content": "用三句话介绍 MiniMax"}
    ],
    "stream": false
  }'
```

**SDK 切换**：用 `anthropic` 或 `openai` SDK，把 `base_url` 指向 `https://api.minimaxi.com/anthropic` 或 `/v1` 即可。

> MiniMax 不发布自有 SDK，全部通过主流 SDK 兼容接入。

<!--
SDK base_url 切换是 MiniMax 接入的核心模式。
-->

---
layout: two-cols
---

# 实时语音（Realtime API）

- HTTP + WebSocket 双协议
- 全双工流式对话
- 端到端延迟 **< 250ms**
- 超拟人音色库
- 含语气词标签

**事件流**

- `task_started` 任务开始
- `task_continue` 流式增量
- `task_stopped` 任务停止

::right::

# 反模式：轮询 T2A

**禁止做对话级实时**

- ASR → LLM → TTS 串行
- 延迟远超 500ms
- 增加连接开销

**正确选择**

- 实时对话 → Realtime API
- 单次合成 → `t2a_v2`
- 长文本 → `t2a_async_v2`

> Realtime API 是端到端方案，不可用同步 TTS 轮询替代。

<!--
Realtime API 是端到端方案，禁止用 T2A 轮询做对话。
-->

---
layout: quote
---

# abab ≠ 当前主推

「`abab6.5`（万亿参数 / 245K）已升级命名为 M 系列，当前主推为 **MiniMax-M3**。`abab` 仅作为第三方云（阿里云百炼等）遗留 ID 存在。」

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 把 `abab` 当作当前主推模型（实际已升级 M 系列）
- 同步 T2A 跑 > 10000 字符（必须切异步）
- 克隆音色后长期不调用（7 天删除）
- `voice_id` 命名违规（首字符非字母 / 末位为 `-`）
- 把 MiniMax-Text-01（开源）与 M3（API 旗舰）混淆
- 对 `speech-02/01` 使用语气词标签（仅 2.8 支持）
- 误信 Anthropic 端点 200K 显示（实际 1M）
- 通用 Agent 期待 highspeed 极速版（仅编码工作流）
- 不限流跑 1M 上下文（成本与延迟上升）

<!--
反模式部分是 MiniMax 与其他模型差异最大的地方。
-->

---
layout: center
class: text-center
---

# 小结

MiniMax = 全模态 + 双协议 + Lightning Attention

**M3 旗舰 · 1M 上下文 · Interleaved Thinking**

按模态选模型 · M3 走 Anthropic 路径 · 长文本 TTS 切异步

[文档](https://platform.minimaxi.com/docs) · [GitHub](https://github.com/MiniMax-AI/MiniMax-01) · [HuggingFace](https://huggingface.co/MiniMaxAI)

<!--
掌握按模态分工 + Anthropic 路径优先 + TTS 三档分流，就能把 MiniMax 用到生产水准。
-->
