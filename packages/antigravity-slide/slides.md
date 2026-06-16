---
theme: seriph
background: https://cover.sli.dev
title: Antigravity — Google 的 agent-first IDE
info: |
  Presentation Antigravity — Google 推出的 agent-first 开发平台，由 Gemini 3 驱动。

  Learn more at [https://antigravity.google](https://antigravity.google)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🚀</span>
</div>

<br/>

## Antigravity — Google 的 agent-first IDE

Google 推出的 agentic 开发平台，由 Gemini 3 驱动；以 Agent Manager 编排多 agent

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://antigravity.google" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
今天聊 Antigravity：Google 在 2025 年 11 月和 Gemini 3 同期推出的 agent-first 开发平台。

它的理念很激进：agent 不该只是侧栏的聊天机器人，应该有自己的专属工作空间。所以它把开发范式从补全上移到编排——编排任务、agent、artifacts。

主线：定位 → 两个界面 → agent 三段式 → 两种模式 → Artifacts → 反馈 → 浏览器 → 终端策略与知识库 → 模型 → 总结。这是 2025 末新品，迭代很快。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么

<v-clicks>

- ✅ Google 的 **agent-first 开发平台**，Gemini 3 驱动
- ✅ Agent Manager 异步编排多个 agent 并行
- ✅ agent 自验，产出可审查的 Artifacts

</v-clicks>

<div v-click class="mt-6">

边界：

- ❌ 2025-11 新品，稳定性/记忆仍在打磨
- ❌ 基于 VS Code fork（报道源自 Windsurf）；浏览器验证依赖 Chrome

</div>

<!--
Antigravity 的定位：Google 的 agent-first 开发平台，由 Gemini 3 驱动。核心是 Agent Manager，可以异步编排多个 agent 并行干活，agent 还能自我验证、产出可审查的 Artifacts。

边界两条：它是 2025 年 11 月的新品，稳定性和上下文记忆还在打磨，版本配额定价变动快;它基于 VS Code fork，业界报道源自 Windsurf 代码库，浏览器验证还依赖 Google Chrome 加专用扩展。
-->

---

# 两个界面（surface）

`Cmd/Ctrl + E` 在两者间切换：

| 界面 | 作用 |
| --- | --- |
| **Editor View** | 同步编码：文件树、tab 补全、inline commands |
| **Agent Manager** | "Mission Control"：异步派发/编排/观察多个 agent |

<div v-click class="mt-4">

Agent Manager 可「派 5 个 agent 同时修 5 个 bug」

</div>

<!--
Antigravity 有两个界面，官方叫 surface，Cmd 或 Ctrl 加 E 切换。

Editor View 就是传统同步编码，文件树、tab 补全、inline commands，跟 VS Code、Cursor 差不多，用来审查和打磨代码。

Agent Manager 是它的灵魂，像个 Mission Control 任务控制台，你在这里异步派发、编排、观察多个 agent，跨多个 workspace。一个形象的说法：你可以派 5 个 agent 同时去修 5 个 bug，自己在上层看进度。
-->

---

# agent：plan → execute → verify

agent 自主**规划 → 执行 → 验证**，跨 editor / terminal / browser：

<v-clicks>

- editor 脚手架应用 → terminal 起 dev server
- browser 加载并跑 E2E → 发现问题 → 改代码
- 验证修复 → 截图 → 附摘要交付

</v-clicks>

<div v-click class="mt-3 text-rose-400">

⚠️ 关键是跨 **editor / terminal / browser** 三处，不止改代码

</div>

<!--
Antigravity 的 agent 是三段式：plan、execute、verify，规划、执行、验证。它最大的不同是能跨三个地方操作：editor、terminal、还有 browser。

举个典型闭环：在 editor 里脚手架一个应用，在 terminal 起 dev server，在 browser 里加载页面跑端到端测试，发现问题回来改代码，再验证修复，最后截图加摘要交付给你。

记住这个 browser 维度，是 Antigravity 区别于多数 AI IDE 的地方——它能真的打开浏览器验证你的功能。
-->

---

# 两种模式

<div class="grid grid-cols-2 gap-6 mt-6">
<div>

**Planning Mode**

- 先研究、产出计划再执行
- 复杂 / 研究型任务
- 产出丰富 artifacts

</div>
<div>

**Fast Mode**

- 直接执行
- 简单任务（改名、跑几条 bash）

</div>
</div>

<!--
Antigravity 的 agent 有两种模式。Planning Mode 是先研究、产出计划，再执行，适合复杂任务或需要深度研究的工作，会产出丰富的 artifacts 给你审查。

Fast Mode 是直接执行，适合简单任务，比如改个变量名、跑几条 bash 命令，不用先规划。按任务复杂度选模式。
-->

---

# Artifacts：可审查交付物

取代原始日志，给人看的 human-friendly 交付物：

| Artifact | 时机/内容 |
| --- | --- |
| **Implementation Plan** | 开工**前**的研究+改动，需审批 |
| **Task List** | 结构化任务清单，跟踪进度 |
| **Walkthrough** | 完工**后**的总结+验证步骤 |

<!--
Artifacts 是 Antigravity 的核心概念，是 agent 工作的产出物，给人看的、可审查的交付物，用来取代那些看不懂的原始日志。

三种主要类型：Implementation Plan 是开工前的研究加上打算怎么改，要你审批通过才动手;Task List 是结构化的任务清单，agent 用来跟踪自己的进度;Walkthrough 是完工后的变更总结加验证步骤，含截图、命令、测试结果。记住时机：Plan 在前要审批，Walkthrough 在后做交付。
-->

---

# 类 Google Doc 的反馈

<v-clicks>

- 在 artifacts 上**高亮文本 + 留评论**
- agent 实时纳入这些 pending comments
- **无需打断工作流**

</v-clicks>

<div v-click class="mt-6">

加上 **Knowledge base**：agent 把有用片段/模式沉淀，改进后续任务（自我改进）

</div>

<!--
反馈机制是 Antigravity 的差异化亮点。你可以像在 Google Doc 里那样，直接在 artifacts 上高亮文本、留评论，agent 会实时把这些待处理的评论纳入，调整它的执行，而且不打断整个工作流。这种协作感是其它 AI IDE 少见的。

另外它有个 Knowledge base 知识库，agent 会把有用的上下文、代码片段沉淀进去，用来改进后续任务，越用越对齐你的偏好，这是它的自我改进机制。
-->

---

# 浏览器集成

agent 直接操控浏览器做验证（点击/滚动/交互/跑 E2E）：

<v-clicks>

- 需 **Google Chrome + Antigravity Chrome 扩展**
- 经 debugging session 由 browser subagent 接管
- 操作录成 **browser recordings / screenshots**，写进 Walkthrough

</v-clicks>

<!--
浏览器集成是 Antigravity 验证闭环的关键。agent 能直接操控浏览器，点击、滚动、交互，跑端到端测试，真的去验证你的功能能不能用。

实现上需要 Google Chrome 加一个 Antigravity 的 Chrome 扩展，agent 通过 Chrome 的 debugging session 接管，内部有个 browser subagent 专门干这事。它把浏览器操作录制成 browser recordings 和截图，写进 Walkthrough 作为可视化证据，让你看到它确实验证过。
-->

---

# 终端策略与模型

**Terminal Execution Policy**：三档自治分级

```text
Off    → 手动审查每条命令
Auto   → 部分自动
Turbo  → 全自动
```

<div v-click class="mt-4">

模型：**Gemini 3 Pro** 主力 + **Claude Sonnet 4.5** + **GPT-OSS**

</div>

<div v-click class="mt-2 text-rose-400">

⚠️ GPT-OSS 是 OpenAI 开源权重模型，不是 GPT-4/5 旗舰

</div>

<!--
终端执行策略体现 agent 的自治分级，三档：Off 是每条命令都要你手动审查;Auto 是部分自动;Turbo 是全自动。你按对它的信任度调整风险姿态。

模型方面，主力是 Gemini 3 Pro，毕竟是 Google 自家的。但它也官方支持第三方：Anthropic 的 Claude Sonnet 4.5，和 OpenAI 的 GPT-OSS。注意这个 GPT-OSS 是 OpenAI 的开源权重模型，不是 GPT-4 或 GPT-5 那种闭源旗舰，这是个高频易错点。它还内置 MCP 支持。
-->

---
layout: center
class: text-center
---

# 总结

Antigravity = agent-first 的 Google 开发平台

Agent Manager 编排 · plan/execute/verify · Artifacts 审查 · 浏览器验证 · Gemini 3 Pro

<div class="mt-8 flex justify-center gap-6 text-xl">
  <a href="https://antigravity.google" target="_blank">📖 官方网站</a>
</div>

<!--
总结：Antigravity 是 Google 的 agent-first 开发平台。

抓手记牢：Agent Manager 编排多个 agent、agent 的 plan execute verify 三段式、Artifacts 可审查交付物、能开浏览器做验证、主力模型 Gemini 3 Pro 加 Claude 和 GPT-OSS。它是 2025 末新品，理念很前沿，但还在快速迭代，值得关注。谢谢。
-->
