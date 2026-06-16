---
theme: seriph
background: https://cover.sli.dev
title: Trae — 国内第一 AI IDE
info: |
  Presentation Trae — 字节跳动出品的 AI 原生 IDE，IDE 与 SOLO 双模式。

  Learn more at [https://trae.ai](https://trae.ai)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🤖</span>
</div>

<br/>

## Trae — 国内第一 AI IDE

字节跳动出品的 AI 原生 IDE，提供「IDE」与「SOLO」双模式；国内市场份额第一

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://docs.trae.ai" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
今天聊 Trae：字节跳动出品的 AI 原生 IDE，IDC 报告里国内市场份额第一，约 41%，是国产 AI 编程工具的黑马。

它最大的特色是 IDE 和 SOLO 双模式，从你完全掌控到 AI 全程主导，一键切换。

主线：定位 → 双模式 → SOLO Agent → Plan/Spec → CUE 补全 → # 引用 → Rules → MCP → 自定义 Agent → 国内外版本 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么

<v-clicks>

- ✅ 字节出品，**国内第一 AI IDE**（IDC 约 41.2%、600万+用户）
- ✅ VS Code fork，可从 VS Code/Cursor 一键导入
- ✅ IDE/SOLO 双模式 + 国产模型直供（豆包等）

</v-clicks>

<div v-click class="mt-6">

边界：

- ❌ 闭源；部分平台扩展需手动 VSIX
- ❌ 国内/国际版模型分化（美国用户不可用 GPT/MiniMax）

</div>

<!--
Trae 的定位：字节跳动的 AI 原生 IDE，IDC 报告国内份额约 41%、600 万用户，国内第一。它是 VS Code 的 fork，从 VS Code 或 Cursor 都能一键导入设置。

国内版直供豆包等国产模型，符合合规，这是它在国内的优势。边界两条：闭源，部分平台特定扩展要手动下 VSIX;国内版国际版模型分化，比如美国用户用不了 GPT 和 MiniMax 系列。
-->

---

# IDE 与 SOLO 双模式

顶部一键切换的两种工作方式：

| 模式 | 主导 | 行为 |
| --- | --- | --- |
| **IDE mode** | 开发者 | 完全掌控，AI 辅助（补全/Chat/Agent） |
| **SOLO mode** | AI | plan → 代码 → 测试 → preview → 部署 |

<div v-click class="mt-4">

SOLO 是 Trae 区别于多数 AI IDE 的"接管式"自动编排

</div>

<!--
双模式是 Trae 的招牌。顶部一个开关切换：IDE mode 是开发者完全掌控，AI 只做补全、Chat、Agent 这些辅助;SOLO mode 是 AI 主导，从规划、生成代码、测试、预览到部署全程自动编排。

这种接管式的整 UI 自动编排，是 Trae 区别于 Cursor、Windsurf 这些 AI IDE 的地方，更适合"一句话出项目"的场景。
-->

---

# SOLO Agent：AI 团队

SOLO mode 的核心，可自主编排多个自定义 agent 组成「AI 团队」：

<v-clicks>

- 主 agent 按上下文调度子 agent（内置 `Search` agent）
- **仅 SOLO Agent 能调用自定义 agent**
- 2026-05 更名：SOLO Coder → **SOLO Agent**；Builder → **Agent**

</v-clicks>

<!--
SOLO Agent 是 SOLO 模式的核心。它能自主编排多个自定义 agent 组成一个 AI 团队，主 agent 根据上下文调度子 agent，内置一个 Search agent。

一个关键限制：只有 SOLO Agent 能调用自定义 agent，普通 Agent 和 IDE mode 不能编排子 agent。还有命名要注意，2026 年 5 月改过名：SOLO Coder 改叫 SOLO Agent，Builder 和 Builder with MCP 合并成统一的 Agent，用旧名会过时。
-->

---

# Plan 与 Spec 模式

SOLO Agent 的两个进阶子模式：

| 模式 | 命令 | 产出 |
| --- | --- | --- |
| **Plan** | `/plan` | 规划文档 |
| **Spec** | `/spec` | `spec.md` + `tasks.md` + `checklist.md` |

Spec 文档存 `.trae/specs/<任务名>/`，作为长期知识资产

<!--
SOLO Agent 有两个进阶子模式。Plan 模式用斜杠 plan 触发，生成一份规划文档。Spec 模式用斜杠 spec，产出三件套文档：spec.md 规格、tasks.md 任务、checklist.md 检查清单，存在 .trae/specs 目录下。

这些 Spec 文档不是一次性的，而是作为项目的长期知识资产沉淀下来，让 AI 在后续开发中持续参考，这是规格驱动开发的思路。
-->

---

# CUE：智能补全

CUE（Context Understanding Engine）≈ Cursor Tab：

<v-clicks>

- 多行编辑、下一编辑点预测
- 智能导入、智能重命名
- 智能导入/重命名限 **Python / TypeScript / Go**

</v-clicks>

<!--
CUE 是 Trae 的智能补全引擎，全称 Context Understanding Engine，定位类似 Cursor 的 Tab：支持多行编辑、预测下一个编辑点、智能导入、智能重命名。

注意一个细节：智能导入和智能重命名目前限定 Python、TypeScript、Go 三种语言，其它语言只有基础补全。出题时这是个易错点。
-->

---

# Chat：用 # 引用上下文

Trae 用 **`#`** 引用上下文（区别于 Cursor/VS Code 的 `@`）：

<v-clicks>

- `#Rule`：引用规则（**优先级最高**）
- `#Doc`：引用文档（最多 1000 文件 / 50MB）
- `#Web`：联网搜索
- `@`：在 Trae 里是**创建自定义 agent**

</v-clicks>

<!--
这是 Trae 和其它 AI IDE 一个明显的不同：它用井号 # 引用上下文，不是 @。# Rule 引用规则，且优先级最高;# Doc 引用文档，最多 1000 个文件、总共 50MB;# Web 联网搜索。

而 @ 在 Trae 里是创建自定义 agent 的入口。所以从 Cursor 过来的人要适应：引用上下文用 #，调 agent 用 @，正好和 Cursor 反过来。
-->

---

# Rules：用户规则与项目规则

| 类型 | 落地 |
| --- | --- |
| **User Rules** | 存设置中，**不生成文件** |
| **Project Rules** | 生成 `.trae/rules/*.md` |

四种 Application Mode：`alwaysApply` / `globs` / `description` / 手动 `#Rule`

<div v-click class="mt-3 text-rose-400">

⚠️ `.trae/rules/` 最多 3 级嵌套；`#Rule` 手动引用优先级最高

</div>

<!--
Rules 分两类：User Rules 是个人偏好、对所有项目生效，但它存在设置里、不生成文件;Project Rules 才会在 .trae/rules 下生成 Markdown 文件。

四种应用模式对应 frontmatter：alwaysApply 始终生效、globs 按文件匹配、description 让 AI 智能判断、手动靠 #Rule 引用。两个要点：.trae/rules 支持子文件夹但最多 3 级嵌套;#Rule 手动引用优先级最高，能让任何规则强制生效。
-->

---

# MCP：接入外部工具

项目级配置 `.trae/mcp.json`，需开 `Enable Project MCP`：

```json
{ "mcpServers": { "name": {
  "command": "npx", "args": ["mcp-server"] } } }
```

<div v-click class="mt-3 text-rose-400">

⚠️ stdio 的 `command` 不能含空格；变量仅支持 `${workspaceFolder}`

</div>

<!--
MCP 接外部工具，在 Trae 里 agent 作为 MCP client 调用工具，MCP 要挂到自定义 agent 上。项目级配置写在 .trae/mcp.json，还要在设置里打开 Enable Project MCP 开关。顶层键是 mcpServers，和 Claude、Cursor 一样。

两个坑：stdio 的 command 字段不能含空格;MCP 变量只支持 workspaceFolder 一个，不像 VS Code 有一堆变量。三种传输 stdio、SSE、Streamable HTTP。
-->

---

# 自定义 Agent

聊天里输 `@` → Create Agent（智能生成 / 手动）：

<v-clicks>

- Tools 两类：**MCP servers** + 5 内置工具
- 内置工具：Read / Edit / Terminal / Preview / Web search
- 可分享/导入（含 prompt + MCP 配置）

</v-clicks>

<!--
自定义 Agent 在聊天里输 @ 创建，可以智能生成也可以手动写。每个 agent 配的工具分两类：挂 MCP servers，加 5 个内置工具——Read、Edit、Terminal、Preview、Web search，正好 5 个，别记多记少。

做好的 agent 还能分享或导入，链接里带着 prompt 和 MCP 配置，所以官方也提供了 UI Designer、Frontend Architect 这些现成 agent 一键导入。分享前记得清掉敏感信息。
-->

---

# 国内外版本与模型

| | 国际版 trae.ai | 国内版 trae.cn |
| --- | --- | --- |
| 模型 | GPT/Gemini/Claude/Kimi/DeepSeek | 偏国产（豆包/DeepSeek/Kimi/通义） |
| 合规 | — | 符合中国合规 |
| 网络 | 海外 | 国内优化 |

<div v-click class="mt-3 text-rose-400">

⚠️ 美国用户不可用 GPT、MiniMax 系列

</div>

<!--
Trae 分国内外两个版本，界面功能一致，差别在模型和合规。国际版 trae.ai 用 GPT、Gemini、Claude、Kimi、DeepSeek;国内版 trae.cn 偏国产模型，豆包、DeepSeek、Kimi、通义，符合中国合规，网络也针对国内优化。

一个版本差异的易错点：美国用户在国际版里也用不了 GPT 系列和 MiniMax 系列模型。所以选版本要看你在哪、用什么模型、合规要求。
-->

---
layout: center
class: text-center
---

# 总结

Trae = 国内第一 AI IDE + IDE/SOLO 双模式

SOLO Agent 编排 · Plan/Spec · CUE 补全 · # 引用 · Rules/MCP · 国产模型

<div class="mt-8 flex justify-center gap-6 text-xl">
  <a href="https://docs.trae.ai" target="_blank">📖 官方文档</a>
  <a href="https://trae.ai" target="_blank">⬇️ 下载</a>
</div>

<!--
总结：Trae 是国内第一的 AI IDE，核心是 IDE 和 SOLO 双模式。

抓手记牢：SOLO Agent 的 AI 团队编排、Plan 和 Spec 模式产出文档、CUE 智能补全、用 # 引用上下文、Rules 和 MCP、直供国产模型。它是 VS Code fork，迁移成本低，国内合规和性价比是它的主场。谢谢。
-->
