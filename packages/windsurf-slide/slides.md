---
theme: seriph
background: https://cover.sli.dev
title: Windsurf — Cascade 驱动的 AI IDE
info: |
  Presentation Windsurf — 原 Codeium 出品的 AI 原生编辑器，Cascade agent 高自主。

  Learn more at [https://windsurf.com](https://windsurf.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🏄</span>
</div>

<br/>

## Windsurf — Cascade 驱动的 AI IDE

原 Codeium 出品的 AI 原生编辑器，以 Cascade agent 的高自主性著称（2026 更名 Devin Desktop）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://docs.devin.ai/desktop/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
今天聊 Windsurf：原 Codeium 出品的 AI 原生编辑器，灵魂是 Cascade agent。

一个背景要先说：2026 年 6 月 Windsurf 被 Cognition AI 收购后更名 Devin Desktop，文档迁到 devin.ai，但功能延续，大家还是习惯叫 Windsurf。

主线：定位 → Cascade 三模式 → Cascade 能力 → Tab → Command → Rules → Memories → MCP 与 Workflows → 模型 → 对比 Cursor → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么

<v-clicks>

- ✅ VS Code fork 的 AI IDE，**Cascade** agent 高自主
- ✅ 读文件→定位调用点→改动→跑测试，仅歧义处求确认
- ✅ 实时感知你在编辑器/终端的操作

</v-clicks>

<div v-click class="mt-6">

边界：

- ❌ 品牌多变：Codeium→Windsurf→**Devin Desktop**(2026-06)
- ❌ 扩展走 Open VSX；闭源、按 credits/quota 计费

</div>

<!--
Windsurf 是 VS Code 的 fork，定位 AI 原生 IDE。它最大的卖点是 Cascade agent 的高自主：你提需求，它读文件、定位所有调用点、改动、跑测试，只在真有歧义时才回来问你，比那种每步都要你确认的 agent 更省心。还有实时感知，它能感觉到你在编辑器和终端的实时操作。

边界两条：品牌变动频繁，从 Codeium 到 Windsurf 再到 2026 年 6 月的 Devin Desktop;扩展走 Open VSX，闭源、按额度计费。
-->

---

# Cascade：三种模式

`Cmd+L` 打开，`Cmd+.` 切换：

| 模式 | 行为 |
| --- | --- |
| **Code**（默认） | 全 agentic：改文件、跑命令、自动装依赖 |
| **Plan** | 先产出 Markdown 计划，有「Implement」转 Code |
| **Ask** | **只读**：搜索分析，不做改动 |

<div v-click class="mt-3 text-rose-400">

⚠️ 旧称 Write/Chat，现为 Code/Ask，Plan 为新增

</div>

<!--
Cascade 是核心 agent，Cmd+L 打开，Cmd+点号 切三种模式。

Code 是默认的全自主模式，改文件、跑命令、自动装缺失依赖;Plan 先探索代码库、追问、产出一份写进 Markdown 的计划，确认后点 Implement 转 Code;Ask 是只读，搜索分析但不改任何东西。

一个高频易错点：早期叫 Write 和 Chat 模式，现在改名 Code 和 Ask，Plan 是后来新增的，旧题旧资料容易过时。
-->

---

# Cascade 能力

<v-clicks>

- **工具调用**：每个 prompt 最多 **20 次** tool calls，配 Auto-Continue 续长任务
- **实时感知**：感知编辑器/终端操作，选中文本自动入上下文
- **Checkpoints**：可回滚到对话中的检查点
- **自动装依赖**：检测并安装缺失的包与工具

</v-clicks>

<!--
Cascade 的能力细节：工具调用每个 prompt 最多 20 次，配合 Auto-Continue 处理长任务;实时感知是它的独有卖点，能感知你在编辑器和终端的实时动作，你选中的文本自动进上下文;Checkpoints 让你回滚到对话中的某个检查点;它还能检测代码需要哪些包没装，直接帮你装上。
-->

---

# Tab：补全与导航引擎

自研模型驱动的 diff 建议引擎，两种模式 + 两个 Tab-to：

<v-clicks>

- **Supercomplete**（推荐）：光标周围**同时建议删除与新增**，可改写不止补全
- **Autocomplete**：传统灰字行内/多行补全
- **Tab to Jump**：预测下一光标位，按 `Tab` 跳过去
- **Tab to Import**：定义新依赖后按 `Tab` 自动顶部 import

</v-clicks>

<!--
Tab 在 Windsurf 里不只是补全，是上下文感知的 diff 建议加导航引擎。

两种模式：Supercomplete 是推荐的，它在光标周围同时建议删除和新增，相当于能改写代码，不只是往后补;Autocomplete 是传统的灰字补全。

还有两个 Tab-to 动作：Tab to Jump 预测你下一个光标位置，按 Tab 跳过去;Tab to Import 在你用了新依赖后，按 Tab 自动在文件顶部补 import。
-->

---

# Command：内联编辑

`Cmd+I` 在编辑器或**终端**内用自然语言生成/改写：

<v-clicks>

- 编辑器内：选中片段，自然语言指令改写
- 终端内：自然语言生成 CLI 命令
- **不消耗 premium credits**

</v-clicks>

<div v-click class="mt-4">

三分法：**Cascade**=主动 agent · **Tab**=被动建议 · **Command**=主动内联

</div>

<!--
Command 是内联编辑，Cmd+I 唤起。它能在编辑器里选中片段用自然语言改写，也能在终端里用自然语言生成命令行。一个好处：它不消耗 premium 额度。

记住 Windsurf 的三分法：Cascade 是主动 agent，你提需求它干活;Tab 是被动建议，你打字它跟;Command 是主动内联，你给指令它改一小段。三者分工清晰。
-->

---

# Rules：给 Cascade 的规约

四层作用域（注意新旧路径双轨）：

| 作用域 | 路径 |
| --- | --- |
| Workspace（首选） | `.devin/rules/*.md` |
| Workspace（legacy） | `.windsurf/rules/` · `.windsurfrules` |
| Global | `~/.codeium/windsurf/memories/global_rules.md` |

激活模式：`always_on` / `model_decision` / `glob` / `manual`

<!--
Rules 是给 Cascade 的规约，四层作用域。首选写在 .devin/rules 下;旧路径 .windsurf/rules 和单文件 .windsurfrules 作为 legacy 回退还能用;全局规则有点反直觉，在 codeium 的老目录下的 global_rules.md。

四种激活模式要记：always_on 完整注入每条消息;model_decision 只放描述，让 Cascade 自己判断;glob 按文件匹配触发;manual 要 @ 手动唤起。
-->

---

# Memories：自动记忆

<v-clicks>

- 自动生成，或对 Cascade 说 `create a memory of …`
- 存 `~/.codeium/windsurf/memories/`，绑定单个 workspace

</v-clicks>

<div v-click class="mt-4 text-rose-400">

⚠️ 只在本机、不跨工作区、**不进仓库、不消耗 credits**；要共享改用 Rules / AGENTS.md

</div>

<!--
Memories 是自动记忆，Cascade 觉得某段上下文值得记就自动存，你也能主动说 create a memory of。它存在本地，绑定具体 workspace。

一个高频易错点：Memories 只在你本机，不跨工作区、不进 Git 仓库、也不消耗额度。所以如果你想让团队共享持久的项目上下文，别指望自动记忆，要写进 Rules 或者 AGENTS.md。
-->

---

# MCP 与 Workflows

**MCP**：`~/.codeium/windsurf/mcp_config.json`，顶层键 `mcpServers`

<v-clicks>

- 最多访问 **100 个工具**；stdio 用 `command`，远程用 `serverUrl`
- **Workflows**：`.windsurf/workflows/*.md`，斜杠 `/name` 调用
- Workflows 是 **manual-only**，Cascade 永不自动跑

</v-clicks>

<!--
MCP 接外部工具，配置文件 mcp_config.json 在 codeium 目录下，顶层键是 mcpServers，和 Claude Desktop 一样。Cascade 任意时刻最多访问 100 个工具，本地用 command，远程用 serverUrl。

Workflows 是可复用的步骤序列，放 .windsurf/workflows 下，用斜杠命令 name 调用。重点：Workflows 是纯手动的，Cascade 永远不会自动跑 workflow，这和 Rules 能自动激活正好相反，是个考点。
-->

---

# 模型与对比 Cursor

模型：自研 **SWE-1.5/1.6** + 第三方（Claude/GPT/Gemini）；**Adaptive Router** 自动选模型省额度

| | Windsurf Cascade | Cursor Agent |
| --- | --- | --- |
| 自主度 | 高，跑完再确认 | 每步 diff 审批 |
| 自研模型 | SWE-1.x 系列 | cursor-small/Composer |

<!--
模型方面，Windsurf 有自研的 SWE 系列，加上 Claude、GPT、Gemini 等第三方;还有 Adaptive Router 自动选模型，让额度更耐用。

和 Cursor 怎么比？核心差异在 agent 行为：Windsurf 的 Cascade 更自主，它会一口气读文件、改动、跑测试，跑完再回来确认;Cursor 的 Agent 更偏每步出 diff 等你批准，交互更频繁。两者都是 VS Code fork，都有自研模型，但风格不同：要高自主选 Windsurf，要每步可控选 Cursor。
-->

---
layout: center
class: text-center
---

# 总结

Windsurf = Cascade 高自主 agent + 自研 Tab

Cascade 三模式（Code/Plan/Ask）· Supercomplete · Command 内联 · Rules/Memories/Workflows · SWE 模型

<div class="mt-8 flex justify-center gap-6 text-xl">
  <a href="https://docs.devin.ai/desktop/" target="_blank">📖 官方文档</a>
  <a href="https://windsurf.com" target="_blank">⬇️ 下载</a>
</div>

<!--
总结：Windsurf 的核心是 Cascade 这个高自主 agent，加上自研的 Tab 引擎。

抓手记牢：Cascade 三模式 Code、Plan、Ask;Tab 的 Supercomplete;Command 内联编辑;Rules、Memories、Workflows 三件套;SWE 自研模型加 Adaptive 路由。记住它已更名 Devin Desktop。谢谢。
-->
