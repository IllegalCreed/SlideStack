---
theme: seriph
background: https://cover.sli.dev
title: Claude 模型完全指南
info: |
  Claude 模型完全指南：Opus 4.7 · Sonnet 4.6 · Haiku 4.5 · Tool Use · Prompt Caching · Extended Thinking

  Learn more at [docs.claude.com](https://docs.claude.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Claude 模型

Opus 4.7 · Sonnet 4.6 · Haiku 4.5 · 安全可控 + 长上下文

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Claude 4 系列：Anthropic 旗舰，编码与 Agent 综合最强闭源之一。
-->

---
transition: fade-out
---

# Claude 是什么

Anthropic 推出的大语言模型家族

- **安全可控**：Constitutional AI 训练，拒绝率低但护栏可靠
- **长上下文**：Opus / Sonnet / Haiku 标配 200K，Opus 可选 1M
- **工具使用一类公民**：Tool Use 极顺滑，MCP 协议自家推
- **编码顶尖**：HumanEval / SWE-bench / Aider 长期榜首
- **价格分档**：Opus 复杂 / Sonnet 日常 / Haiku 简单

> 当前主力 Claude 4 系列，覆盖旗舰 / 日常 / 轻量三档。

<!--
Claude 主打安全 + 长上下文 + 工具使用。
-->

---

# 模型列表（2026）

| 模型 | 上下文 | 用途 | $/M（输入/输出） |
|------|------|------|------|
| `claude-opus-4-7` | 200K | 旗舰复杂任务 | $15 / $75 |
| `claude-opus-4-7[1m]` | 1M | 整本仓库 / 长会话 | $30 / $150 |
| `claude-sonnet-4-6` | 200K | 日常生产 | $3 / $15 |
| `claude-haiku-4-5` | 200K | 简单 / 快速 | $0.80 / $4 |

> 实际 90% 场景 Sonnet 4.6 已足够，Opus 仅当 Sonnet 明显不够时切。

<!--
1M 上下文加 [1m] 后缀，成本翻倍。
-->

---

# 选哪个模型

简单决策表

| 任务 | 选 |
|------|------|
| 复杂规划 / 大重构 / 难 debug | **Opus 4.7** |
| 整本仓库 / 长对话 | **Opus 4.7 (1M)** |
| 日常 90% 编码 / 通用问答 | **Sonnet 4.6** |
| 简单问答 / 高并发 | **Haiku 4.5** |

> 涉及多模态时 Haiku 弱，用 Sonnet 或 Opus。

<!--
默认 Sonnet 4.6，复杂上 Opus，轻量用 Haiku。
-->

---
layout: two-cols
---

# 第一次 API 调用

```python
from anthropic import Anthropic
client = Anthropic()  # 读环境变量
message = client.messages.create(
    model="claude-sonnet-4-6", max_tokens=1024,
    system="你是简洁的代码评审助手。",
    messages=[{"role": "user", "content": "用 Python 写个 quicksort"}])
print(message.content[0].text)
```

::right::

# 流式响应

```python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=2048,
    messages=[{"role": "user",
               "content": "解释 React 18 并发模式"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)  # 逐块输出
```

> 长回复用 stream 逐块拿到结果。

<!--
create 一次性返回，stream 逐块流式输出。
-->

---

# Tool Use（function calling）

```python
tools = [{"name": "get_weather",
    "description": "Get current weather for a city",
    "input_schema": {"type": "object",
        "properties": {"city": {"type": "string"}}, "required": ["city"]}}]
resp = client.messages.create(
    model="claude-sonnet-4-6", max_tokens=1024, tools=tools,
    messages=[{"role": "user", "content": "上海现在多少度？"}])
# resp 含 tool_use 调用，你执行后把结果传回
```

> `tool_choice` 控制行为：auto / any / tool / none。

<!--
Tool Use：tools 数组 + tool_choice 控制。
-->

---

# Prompt Caching：长系统提示省钱

长系统提示（>1024 tokens）重复用时缓存，命中后输入 token 90% 折扣

```python
response = client.messages.create(
    model="claude-sonnet-4-6", max_tokens=1024,
    system=[{"type": "text", "text": LONG_SYSTEM_PROMPT,
             "cache_control": {"type": "ephemeral"}}],
    messages=[{"role": "user", "content": "今天的问题"}])
```

**适合**：RAG 灌相同 context / Claude Code 重复用 CLAUDE.md / 多轮不变开头

> TTL 5 分钟，首次写入算 25% 额外费，命中读 90% 折扣。

<!--
Prompt Caching：长系统提示重复用省 90%。
-->

---

# Extended Thinking：先思考再答

模型先生成内部推理 token（不展示），再生成最终答

```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=2048,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "证明 n^2-n 是偶数"}])
# response.content 含 thinking + text 两个 block
```

**何时开**：数学 / 逻辑证明 / 复杂代码生成 / 战略规划

**不要开**：简单事实问答 / 翻译摘要 / 流式 UI 场景

> 复杂问题质量提升明显，但思考也消耗 token。

<!--
Extended Thinking 适合多步推理，简单任务别开。
-->

---
layout: two-cols
---

# 多模态：发图

```python
import base64
img = base64.standard_b64encode(open("x.png","rb").read()).decode()
client.messages.create(
    model="claude-sonnet-4-6", max_tokens=1024,
    messages=[{"role": "user", "content": [
        {"type": "image", "source": {"type": "base64",
            "media_type": "image/png", "data": img}},
        {"type": "text", "text": "这截图里是什么错误？"}]}])
```

::right::

# 能力与限制

**支持**

- OCR（图中文字）准确率高
- 图表理解 / 数据提取
- UI 截图 → 代码（HTML / Vue）
- PDF 原生输入（无需转图）

**不支持**

- 图像生成（用 DALL-E / SD）
- 视频（仅静态图）

> PDF 限制：单文件 < 32MB / < 100 页。

<!--
多模态：content 用数组混 image + text block。
-->

---

# 速率限制与成本

Anthropic API 按 token / minute 和 request / minute 限速

| Tier | 月消费 | 限制（RPM / ITPM / OTPM） |
|------|------|------|
| 1 | $0+ | 50 / 50K / 10K |
| 2 | $40+ | 1K / 100K / 20K |
| 3 | $200+ | 2K / 200K / 40K |
| 4 | $400+ | 4K / 400K / 80K |

- **Batches**：异步批处理，1 小时内返回，标准价 50% 折扣
- **Retry**：SDK 自带指数退避；高并发 Tier 4 + 多账号 sharding

> Bursts 用 Batches 不受 RPM 限制。

<!--
限速按 Tier，Batches 省 50% 且不受 RPM 限制。
-->

---

# Constitutional AI 与大陆访问

**Constitutional AI**：内嵌「有用、无害、诚实」三原则

- GPT 拒绝率偏高（边界场景过度谨慎）
- Claude 倾向「先帮再警告」（附风险提醒）
- 真正硬拒（CSAM / 武器）两者都不做

**大陆访问**（API 不直接服务）

| 方案 | 难度 | 成本 |
|------|------|------|
| 自备代理 | 低 | 仅代理费 |
| OpenRouter / Poe | 低 | 加 10-30% 中间费 |
| Bedrock 港 / 新 region | 中 | AWS 费用 |

> 合理安全研究 / 红队场景 Claude 会配合，说明目的即可。

<!--
Claude 拒绝率低但护栏可靠；大陆需自备网络或代理。
-->

---
layout: center
class: text-center
---

# 小结

Claude = 安全 + 长上下文 + Tool Use

**Opus · Sonnet · Haiku · Prompt Cache**

[文档](https://docs.claude.com/) · [Cookbook](https://github.com/anthropics/anthropic-cookbook)

<!--
Claude 4 系列：安全可控 + 长上下文 + 工具使用一类公民。
-->
