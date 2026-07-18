---
theme: seriph
background: https://cover.sli.dev
title: Gemini Skills
info: |
  Google Gemini 官方 agent 技能集：4 个 skill 覆盖 Gemini API 基础、
  Interactions 主 API、Live 实时流、Omni Flash 视频生成。
  google-gemini/gemini-skills · Apache-2.0
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Gemini Skills

Google Gemini 官方技能集——给 agent 补**关于 Gemini 自己**的最新知识

<div class="pt-6 opacity-80">
google-gemini/gemini-skills · api-dev / interactions / live / omni-flash · Apache-2.0
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/google-gemini/gemini-skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Gemini Skills 是 Google Gemini 官方维护的 agent 技能集，目的是补足模型关于 Gemini API 自身的最新知识——新模型、新 SDK、新 API、新最佳实践。
-->

---
transition: fade-out
---

# 为什么需要它

模型训练数据是静态的，Gemini API 迭代太快

<v-clicks>

- 模型不知道**自己被怎么调用**——SDK 已改名、模型已废弃
- 旧代码常见错误：`gemini-2.0-*` 废弃模型 / `google-generativeai` 废弃 SDK
- 最佳实践更新（如 **thought signatures** 思路签名）模型不一定知道

</v-clicks>

<div v-click class="mt-6 text-center">

skill 顶部一句话强约束：<br/>
`> These rules override your training data.`

</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

官方评估：加 skill 后生成正确 API 代码命中率 **87%**（Gemini 3 Flash）/ **96%**（Gemini 3.1 Pro）

</div>

<style>
h1 { background: linear-gradient(45deg, #4285F4 10%, #A468C4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
LLM 训练数据静态，Gemini API 迭代极快——新模型、SDK 改名、最佳实践（thought signatures）更新，模型不知道自己被怎么调用。skill 用 Critical Rules 强制覆盖训练数据，命中率显著提升。
-->

---
transition: fade-out
---

# 4 个 skill，分工清晰

按 API 类型分层

| Skill | 何时用 |
| --- | --- |
| `gemini-api-dev` | 基础：模型名 / SDK / 4 语言 Quick Start |
| `gemini-interactions-api` | **推荐主 API**：文本·多轮·流式·Agent·图像·视频 |
| `gemini-live-api-dev` | 实时双向音/视频/文本流（WebSocket） |
| `gemini-omni-flash-api` | 视频生成与编辑（文生/图生/编辑） |

<div v-click class="mt-4 text-center text-sm opacity-80">

装：`npx skills add google-gemini/gemini-skills --skill <name>`

</div>

<style>
h1 { background: linear-gradient(45deg, #4285F4 10%, #A468C4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
4 个 skill 分层：api-dev 是基础入口，interactions 是推荐的现代主 API，live 是实时流，omni-flash 是视频专精。可按需单装。
-->

---
transition: fade-out
---

# 当前模型与 SDK

skill 强制覆盖训练数据

<div class="grid grid-cols-2 gap-6 mt-2">
<div>

**当前模型**

- `gemini-3.5-flash` 1M 通用
- `gemini-3.1-pro-preview` 复杂推理
- `gemini-3.1-flash-lite-preview` 低成本
- `gemini-omni-flash-preview` 视频
- `gemini-3.1-flash-live-preview` 实时
- `gemma-4-31b-it` 开源

</div>
<div v-click>

**当前 SDK**

- Py：`google-genai`
- JS/TS：`@google/genai`
- Go：`google.golang.org/genai`
- Java：`com.google.genai:google-genai`

</div>
</div>

<div v-click class="mt-4 p-3 border border-red-300 rounded text-sm">

❌ 禁用：`gemini-2.0-*` / `gemini-1.5-*` / `gemini-2.5-*` 旧模型；<br/>
❌ 禁用：`google-generativeai` / `@google/generative-ai` 旧 SDK

</div>

<style>
h1 { background: linear-gradient(45deg, #4285F4 10%, #A468C4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
skill 顶部 Critical Rules 明列当前模型与 SDK，禁用所有 2.x 旧模型和旧 SDK 包。这是 skill 最核心的价值。
-->

---
transition: fade-out
---

# interactions-api：推荐主 API

一个方法覆盖绝大多数场景

```python
from google import genai

client = genai.Client()
interaction = client.interactions.create(
    model="gemini-3.5-flash",
    input="Tell me a short joke about programming."
)
print(interaction.output_text)
```

<v-click>

**统一入口**：文本 / 多轮（`previous_interaction_id`）/ 流式（`stream=True`）/ function calling / 结构化输出 / 图像 / Deep Research / Antigravity managed agent

</v-click>

<div v-click class="mt-2 text-sm opacity-80">

默认 `store=True`（付费 55 天 / 免费 1 天）；`store=False` 禁用多轮与 background

</div>

<style>
h1 { background: linear-gradient(45deg, #4285F4 10%, #A468C4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Interactions API 是推荐的现代主调用方式，一个 client.interactions.create() 方法统一了文本、多轮、流式、工具、Agent、多模态生成。从 generateContent 迁移过来读 references/migration.md。
-->

---
transition: fade-out
---

# interactions：Agent 能力

Deep Research + Antigravity + 自定义

<v-clicks>

- **Deep Research**：`agent="deep-research-preview-04-2026"` + `background=True`，轮询 `status`
- **Antigravity**：`agent="antigravity-preview-05-2026"` + `environment="remote"`，托管 Linux 沙箱里跑代码 / 读写文件 / 搜网
- **自定义 Agent**：`client.agents.create(id=..., base_agent=..., system_instruction=...)`，每次调用 fork 基础环境

</v-clicks>

<div v-click class="mt-4 text-sm opacity-80">

Managed agent 必须配 `environment="remote"`（或环境 ID/配置对象）才能开沙箱

</div>

<style>
h1 { background: linear-gradient(45deg, #4285F4 10%, #A468C4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
interactions-api 内置 managed agent 能力：Deep Research 做长任务研究、Antigravity 在沙箱里跑代码、自定义 agent 在你指定环境里 fork。
-->

---
transition: fade-out
---

# live-api-dev：实时双向流

WebSocket 低延迟对话

<div class="grid grid-cols-2 gap-6 mt-2">
<div>

**能力**

- 双向音频 + 视频 + 文本流
- VAD 自动处理打断
- 原生音频 + thinking
- 同步 function calling
- Google Search grounding
- Live Translate（70+ 语言）
- Ephemeral tokens（浏览器安全）

</div>
<div v-click>

**关键陷阱**

- 发新输入只用 `send_realtime_input`
- `send_client_content` 仅播种初始历史
- 不要在 sendRealtimeInput 用 `media`——用 `audio`/`video`/`text`
- 每个事件可能含多 parts，要全处理
- 收到 `interrupted` 要清空播放队列

</div>
</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

模型 `gemini-3.1-flash-live-preview`；输入 PCM 16kHz / 输出 PCM 24kHz；当前**不支持 WebRTC**（用 LiveKit/Pipecat 桥接）

</div>

<style>
h1 { background: linear-gradient(45deg, #4285F4 10%, #A468C4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Live API 走 WebSocket 做实时双向对话。最大坑是用 send_realtime_input 发所有新输入，send_client_content 只能播种初始历史；服务端单事件可能含多个 parts，必须全处理。
-->

---
transition: fade-out
---

# omni-flash-api：视频生成与编辑

`gemini-omni-flash-preview` + 配套脚本

```bash
# 文生视频
./scripts/video/generate_video.py "A cat drinking tea" --output media/cat.mp4

# 首帧到视频
./scripts/video/generate_video.py "Waves crash" --image ref.png --output media/waves.mp4

# 视频编辑（剥音重生成）
./scripts/video/generate_video.py "Anime style" --video in.mp4 --strip-audio --output out.mp4

# 逐轮编辑（复用上次结果）
./scripts/video/generate_video.py "Snowy scene" --previous-interaction-id abc123 --output out.mp4
```

<v-click>

**4 大能力**：文生视频 · 首帧到视频 · 图像参考生成 · 视频编辑（含插值）

</v-click>

<style>
h1 { background: linear-gradient(45deg, #4285F4 10%, #A468C4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
omni-flash skill 用 gemini-omni-flash-preview 模型，自带 generate_video.py 端到端跑通文生视频、图生视频、视频编辑。要剥音频重生成必须 --strip-audio。
-->

---
transition: fade-out
---

# omni-flash：边界与 prompt 技巧

<v-clicks>

- **时长**：最长 10 秒，建议 720p/24fps（`prep_video.py` 自动规范化）
- **区域**：视频编辑上传在 EEA/瑞士/英国/部分美国州不可用（空输出 = 此因）
- **依赖**：Python >= 3.10，`google-genai >= 2.10.0`，系统装 `ffmpeg`/`ffprobe`

</v-clicks>

<div v-click class="mt-4">

**Prompt 角色标签**：

```text
<FIRST_FRAME> a woman is walking              # 起始帧
in the style of <IMAGE_REF_0> a woman ...     # 参考图（N 从 0）
[0-3s] A person is walking                    # 时间码
No scene cuts / in a single unbroken scene    # 单场景
```

</div>

<style>
h1 { background: linear-gradient(45deg, #4285F4 10%, #A468C4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
omni-flash 边界：10s 上限，EEA/瑞士/英国不可编辑。Prompt 用 <FIRST_FRAME>/<IMAGE_REF_N> 标签绑角色，时间码控制节奏。
-->

---
transition: fade-out
---

# MCP 优先的文档查询

skill 既懂捷径也懂 fallback

<v-clicks>

- **若装了 Google MCP `search_docs` 工具** → **只**用它，信任结果为唯一权威
- 比手动 fetch URL 更准、更省 token
- **没装 MCP（fallback）** → fetch `llms.txt` 索引再拉具体页

</v-clicks>

<div v-click class="mt-4 text-center">

```text
https://ai.google.dev/gemini-api/docs/llms.txt   # 文档索引
```

</div>

<div v-click class="mt-4 p-3 border border-blue-300 rounded text-sm">

这个设计让 skill 在 MCP 环境走最短路径，在裸 agent 环境也能保证**可查证**——不靠模型瞎编。

</div>

<style>
h1 { background: linear-gradient(45deg, #4285F4 10%, #A468C4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
每个 skill 都规定文档查询优先用 Google MCP 的 search_docs，落空时回退到 llms.txt 索引 fetch。这样不靠模型瞎编 API 细节。
-->

---
transition: fade-out
---

# 反模式速查

避开这些常见坑

<div class="grid grid-cols-2 gap-6 mt-2">
<div>

❌ 用 `gemini-2.0-*`/`1.5-*`/`2.5-*`

❌ 装旧 SDK `google-generativeai`

❌ Live 用 `send_client_content` 发新消息

❌ Live 单会话既要 TEXT 又要 AUDIO

</div>
<div v-click>

❌ Omni 编辑超 10s（先 prep_video）

❌ Omni 要全新音频却没 `--strip-audio`

❌ `store=False` 还想用 `previous_interaction_id`

❌ 从 `generateContent` 迁移不读 migration.md

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">

每个 skill 顶部 Critical Rules 把这些明写为「禁用」

</div>

<style>
h1 { background: linear-gradient(45deg, #4285F4 10%, #A468C4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
反模式集中在旧模型/旧 SDK/Live API 错用方法/Omni Flash 音视频处理。skill 的 Critical Rules 段把禁用清单明写出来。
-->

---
transition: fade-out
---

# 小结

给 agent 配上「Gemini 官方知识包」

<v-clicks>

- **官方出品**：Google Gemini 团队维护，Apache-2.0
- **4 skill 分层**：api-dev 基础 · interactions 主 API · live 实时 · omni-flash 视频
- **强制覆盖训练数据**：列当前模型/SDK、明禁旧版本
- **MCP 优先 + llms.txt fallback**：不靠模型瞎编
- **配套可执行脚本**：omni-flash 自带 generate/prep/inspect/upload
- **门面效果**：代码命中率提升至 87%~96%

</v-clicks>

<div v-click class="mt-6 text-center">

```bash
npx skills add google-gemini/gemini-skills
```

</div>

<style>
h1 { background: linear-gradient(45deg, #4285F4 10%, #A468C4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
小结：Gemini Skills 是官方的 agent 知识包，4 skill 分层，强制覆盖训练数据避免旧模型旧 SDK，MCP 优先保证文档实时性，omni-flash 还自带脚本。装一条命令即可。
-->
