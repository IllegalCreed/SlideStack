---
theme: seriph
background: https://cover.sli.dev
title: VSCode — 最主流的代码编辑器
info: |
  Presentation VSCode — 微软开源的跨平台代码编辑器，2026 演进为 agentic 开发平台。

  Learn more at [https://code.visualstudio.com](https://code.visualstudio.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">💻</span>
</div>

<br/>

## VSCode — 最主流的代码编辑器

微软开源的跨平台编辑器，扩展生态海量；2026 起深度集成 AI，从「编辑器」演进为「agentic 开发平台」

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/microsoft/vscode" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 VSCode：当今最主流的代码编辑器，微软开源、跨平台。

主线：定位与边界 → 界面 → 命令面板 → 扩展 → 设置 → 快捷键 → 终端 → Git → 调试 → AI 四连（补全、Chat、Agent、权限）→ 总结。

记住一条贯穿全篇的演进：2026 的 VSCode 不只是编辑器，而是带 Agent 的开发平台。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么

<v-clicks>

- ✅ 微软开源、跨平台；SO 2025 约 **75.9%** 使用率，连续多年第一
- ✅ 扩展生态海量，内置 Git / 调试 / 终端 / 远程开发
- ✅ 2026 深度集成 AI（Chat / Agent / MCP）

</v-clicks>

<div v-click class="mt-6">

边界（选型要知道）：

- ❌ 基于 Electron，启动与内存高于原生编辑器（Zed / Sublime）
- ❌ 开箱语义弱于 JetBrains，靠扩展补齐

</div>

<!--
先划定位与边界。

它是微软开源的跨平台编辑器，Stack Overflow 2025 调查约 75.9% 使用率，遥遥领先。强在扩展生态和开箱即用：Git、调试、终端、远程都内置。2026 年最大变化是深度集成 AI。

边界两条：一是 Electron 架构，启动和内存比 Zed、Sublime 这类原生编辑器重；二是开箱的语义分析和重构不如 JetBrains，要靠扩展补。
-->

---

# 界面：六大区域

| 区域 | 作用 |
| --- | --- |
| 活动栏 Activity Bar | 切换资源管理器 / 搜索 / 源控 / 调试 / 扩展 |
| 主侧栏 Primary Side Bar | 当前视图内容（如文件树） |
| 次侧栏 Secondary Side Bar | 默认放 AI 聊天 |
| 编辑器 Editor | 核心工作区，支持网格分组 |
| 面板 Panel | 终端 / 问题 / 输出 / 调试控制台 |
| 状态栏 Status Bar | 分支 / 错误数 / 编码 / 语言 |

<div v-click class="mt-4">

`Ctrl+B` 切换侧栏 · `Ctrl+\` 拆分编辑器 · `Ctrl+K Z` 专注模式

</div>

<!--
界面记住六大区域：左侧活动栏切换视图，主侧栏放对应内容比如文件树，次侧栏 2026 默认放 AI 聊天，中间编辑器支持网格分组，下方面板有终端，底部状态栏看分支和错误。

三个高频快捷键：Ctrl+B 收侧栏，Ctrl+反斜杠 拆分编辑器，Ctrl+K 再 Z 进专注模式。
-->

---

# 命令面板：一切入口

`Ctrl+Shift+P`（macOS `⇧⌘P`）是访问**所有功能**的总入口；换前缀切换模式：

| 输入 | 作用 | 快捷键 |
| --- | --- | --- |
| 命令名 | 运行命令 | `Ctrl+Shift+P` |
| 文件名 | 快速打开文件 | `Ctrl+P` |
| `:行号` | 跳到行 | `Ctrl+G` |
| `@符号` | 当前文件符号 | `Ctrl+Shift+O` |
| `#符号` | 跨工作区符号 | `Ctrl+T` |

<!--
命令面板是 VSCode 的灵魂，Ctrl+Shift+P 打开，能搜到所有命令。

它还是个多模态入口：直接输文件名等于 Ctrl+P 快速打开；输冒号加行号跳行；输 @ 跳当前文件符号；输 # 跨工作区搜符号。记住这个面板，等于记住了半个 VSCode。
-->

---

# 扩展：Marketplace 生态

`Ctrl+Shift+X` 打开扩展视图，连接 Marketplace。

```json
// .vscode/extensions.json —— 团队共享的推荐扩展
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode"
  ]
}
```

<v-clicks>

- 工作区推荐：成员打开项目即被提示安装
- `Disable (Workspace)` 仅当前项目禁用；离线装 `code --install-extension xxx.vsix`
- 1.97 起首次装第三方发布者扩展需确认信任

</v-clicks>

<!--
扩展是 VSCode 的核心竞争力。Ctrl+Shift+X 打开，搜索安装。

团队协作有个好习惯：把推荐扩展写进 .vscode/extensions.json，别人打开项目时 VSCode 会提示一键装齐。注意 Disable 可以只在当前工作区禁用，不影响其它项目。安全上，1.97 起首次安装某个第三方发布者的扩展会让你确认信任。
-->

---

# 设置：多级优先级

优先级由低到高：**默认 < 用户 < 远程 < 工作区 < 文件夹 < 企业策略**

```json
// .vscode/settings.json（随项目提交、团队共享）
{
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "[markdown]": { "editor.wordWrap": "on" }
}
```

<v-clicks>

- 语言特定设置（方括号包语言 ID）**始终覆盖**同级非语言设置
- `git.path` 等安全敏感项**只在用户级**生效

</v-clicks>

<!--
设置分多级，记住优先级链：默认最低，企业策略最高，中间是用户、工作区、文件夹。

两个易错点：一是语言特定设置，用方括号包语言 ID，它永远覆盖同级的普通设置，哪怕作用域更窄；二是 git.path 这类安全敏感项只在用户级生效，写进工作区无效，防止仓库注入恶意路径。
-->

---

# 快捷键自定义

`Ctrl+K Ctrl+S` 打开快捷键编辑器；底层是 `keybindings.json`：

```jsonc
[
  { "key": "ctrl+alt+f", "command": "editor.action.formatDocument" },
  // 移除默认绑定：命令名前加 "-"
  { "key": "ctrl+b", "command": "-workbench.action.toggleSidebar" }
]
```

<v-clicks>

- `when` 限定上下文，如 `editorTextFocus && !editorReadonly`
- **和弦**空格分隔（`ctrl+k ctrl+w`），`+` 表示同时按

</v-clicks>

<!--
快捷键全部可改。Ctrl+K Ctrl+S 打开编辑器，底层 keybindings.json。

两个要点：删除一个内置快捷键，不是删行，而是写一条命令名前加减号的规则；when 子句控制什么上下文下生效。还有，和弦快捷键用空格分隔两段，加号才是同时按，别搞混。
-->

---

# 集成终端

`` Ctrl+` `` 开关 · `` Ctrl+Shift+` `` 新建 · `Ctrl+Shift+5` 拆分

<v-clicks>

- **Profiles**：`terminal.integrated.defaultProfile.<平台>` 设默认 shell
- **Shell Integration**（默认自动注入）带来：
  - 命令装饰（成功蓝点 / 失败红叉）
  - 命令间导航 `Ctrl+Up/Down`
  - 运行最近命令 `Ctrl+Alt+R`、快速修复

</v-clicks>

<!--
集成终端不用切窗口。反引号那个键开关，Shift 加它新建，Ctrl+Shift+5 拆分并排。

真正强大的是 Shell Integration，默认自动注入到 bash/zsh/fish/pwsh：它让终端理解命令边界，于是有了命令装饰——成功蓝点失败红叉，命令间跳转，运行最近命令，还有端口占用、git push 失败这类快速修复建议。
-->

---

# 源代码管理（Git）

活动栏的**源控视图**集中管理 Git：

<v-clicks>

- 暂存：hover 点 `+`；还能**按选区暂存**（diff 里选行点 Stage）
- 提交：输消息点 Commit；下拉可 Commit (Amend)
- 合并冲突：内联 **Accept Current / Incoming / Both**
- 复杂冲突用 **3-way 合并编辑器**：左 Incoming、右 Current、底 Result

</v-clicks>

<div v-click class="mt-4">

易错：**Current = 你当前分支**，**Incoming = 被合并进来的分支**

</div>

<!--
Git 内置，源控视图搞定日常。暂存提交都点点鼠标；VSCode 特色是能按选区暂存，相当于图形化的 git add -p。

合并冲突有两层：简单的用内联 CodeLens 选 Accept Current 或 Incoming；复杂的开 3-way 合并编辑器，左边 Incoming 右边 Current 底下是结果。一定记住 Current 是你当前分支，Incoming 是合并进来的那个，方向别反。
-->

---

# 调试

`F5` 启动；`.vscode/launch.json`（`version: 0.2.0`）配置：

```json
{
  "type": "node",
  "request": "launch",
  "name": "运行当前文件",
  "program": "${workspaceFolder}/app.js"
}
```

<v-clicks>

- 三个必填：**`type` / `request` / `name`**；`request` = `launch`（自启）或 `attach`（连已运行进程）
- `F9` 断点 · `F10` 跳过 · `F11` 进入 · `Shift+F11` 跳出

</v-clicks>

<!--
调试按 F5 启动，配置写在 launch.json，版本号是 0.2.0。

记三个必填字段：type 调试器类型，request 是 launch 还是 attach，name 显示名。launch 是自己启动应用，attach 是连一个已经在跑的进程。

单步快捷键：F9 下断点，F10 跳过函数，F11 进入函数，Shift+F11 跳出。F11 和 Shift+F11 方向相反，最容易记混。
-->

---

# AI（1）：补全与 NES

| 能力 | 说明 | 接受 |
| --- | --- | --- |
| 内联建议 | 光标处续写的灰色幽灵文本 | 全部 `Tab`；按词 `Ctrl+→` |
| **NES** | 预测**下一处要改的位置和内容** | gutter 箭头 → `Tab` 跳转再接受 |

<div v-click class="mt-6">

NES（Next Edit Suggestions）由 `github.copilot.nextEditSuggestions.enabled` 单独控制——它跨行联动，不只是光标处续写。

</div>

<!--
AI 第一层是边写边补。普通内联建议是光标处的灰色幽灵文本，Tab 全部接受，Ctrl 右箭头按词接受。

进阶的是 NES，下一处编辑建议：它预测你接下来要改哪里、改成什么，比如改了一个类型，它提示你另一处也要跟着改，靠行号槽的箭头加 Tab 跳过去。它和普通补全是两个独立开关。
-->

---

# AI（2）：Chat 三种 persona

`Ctrl+Alt+I` 开 Chat 视图 · `Ctrl+I` 行内 Chat

| persona | 定位 | 改文件 |
| --- | --- | --- |
| **Ask** | 问答、解释代码 | 否 |
| **Plan** | 研究 + 出实现计划 | 否 |
| **Agent** | 自主：规划→多文件改→跑命令→自纠 | 是 |

<div v-click class="mt-4 text-rose-400">

⚠️ 旧「Edit 模式」已被 Agent 吸收；custom modes 改名 custom agents（`.agent.md`）

</div>

<!--
AI 第二层是对话。Ctrl+Alt+I 开侧边 Chat，Ctrl+I 在编辑器里就地改。

内置三种角色：Ask 只问答不改文件；Plan 先研究、提澄清、产出一份实现计划，也不直接写；Agent 才是自主干活的，规划、多文件编辑、跑命令、自我纠错直到完成。

一个高频考点：旧版的 Edit 模式已经被 Agent 吸收，不再独立；自定义模式也改名叫 custom agents，文件后缀从 chatmode 改成 agent.md。
-->

---

# AI（3）：Agent 类型与自定义

<div class="grid grid-cols-2 gap-4">
<div>

**Agent 类型**

- **Local**：编辑器内跑，关窗即停
- **Copilot CLI**：后台进程，关窗仍跑
- **Cloud**：远程跑，自动开 PR

</div>
<div>

**自定义文件**

- `.github/copilot-instructions.md`
- `*.instructions.md`（`applyTo`）
- `.agent.md` / `.prompt.md`
- `.vscode/mcp.json`（键 `servers`）

</div>
</div>

<div v-click class="mt-4 text-rose-400">

⚠️ MCP 顶层键是 `servers`，不是 Claude 那种 `mcpServers`

</div>

<!--
Agent 还分类型：Local 在编辑器内跑、关窗就停；Copilot CLI 是后台独立进程、关了 VSCode 还在跑，能镜像到 GitHub 远程审批；Cloud 跑在云端、自动开 PR。

自定义是 VSCode AI 的精髓：全局指令写 copilot-instructions.md，作用域指令用 applyTo 按文件类型生效，还有 prompt 文件、custom agent 文件、接外部工具的 MCP。注意 VSCode 的 mcp.json 顶层键是 servers，跟 Claude Desktop 的 mcpServers 不一样，这是个坑。
-->

---

# AI（4）：Agents Window 与权限

<v-clicks>

- **Agents Window**（`code --agents`）：agent-first 专用窗口，跨工作区并行编排多 agent，与 Chat 共享会话
- **三级权限**：
  - **Default**：按配置弹确认
  - **Bypass**：自动批准工具，仍问澄清
  - **Autopilot**：自动批准 **+** 自动答澄清，持续自主

</v-clicks>

<div v-click class="mt-4 text-rose-400">

⚠️ Bypass / Autopilot 会跳过删文件、跑命令的确认，谨慎

</div>

<!--
AI 第四层是规模化和安全。Agents Window 是个 agent 优先的专用窗口，命令行 code --agents 启动，可以跨所有工作区并行编排多个 agent，和 Chat 共享会话。

权限三级很重要：Default 每步弹确认；Bypass 自动批准工具调用但还会问你澄清问题；Autopilot 连澄清都自动回答，完全自主。后两级会跳过删文件、跑命令的确认，生产项目里要谨慎，终端自动批准甚至可能被提示注入绕过。
-->

---
layout: center
class: text-center
---

# 总结

VSCode = 编辑器 + 扩展生态 + 内置工具链 + **2026 Agent 平台**

命令面板找一切 · 设置分级 · 三件套 `settings/keybindings/launch` · AI 四层（补全 / Chat / Agent / 权限）

<div class="mt-8 flex justify-center gap-6 text-xl">
  <a href="https://code.visualstudio.com/docs" target="_blank">📖 官方文档</a>
  <a href="https://github.com/microsoft/vscode" target="_blank">💻 GitHub</a>
</div>

<!--
总结一句话：VSCode 是编辑器加扩展生态加内置工具链，2026 又长出了 Agent 平台这一层。

记住几个抓手：命令面板找一切功能；设置分用户和工作区多级；三个核心配置文件 settings、keybindings、launch；AI 分四层，补全、Chat、Agent、权限。

入门到这里，深入就去翻官方文档。谢谢。
-->
