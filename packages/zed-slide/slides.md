---
theme: seriph
background: https://cover.sli.dev
title: Zed — Rust 写的高性能编辑器
info: |
  Presentation Zed — 用 Rust 从零编写、GPU 渲染的高性能编辑器，内置协作与 AI。

  Learn more at [https://zed.dev](https://zed.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">⚡</span>
</div>

<br/>

## Zed — Rust 写的高性能编辑器

用 Rust 从零编写、GPU 渲染；内置实时协作与 AI，免费开源

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/zed-industries/zed" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Zed：用 Rust 从零写、GPU 渲染的高性能代码编辑器，内置实时协作和 AI，而且免费开源。

它是 Electron 阵营之外的另一条路：原生、快、轻。主线：定位 → 为何快 → Multibuffer → 协作 → Vim 与 Git → Agent Panel → Edit Prediction → MCP → 扩展 → 对比 VS Code → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么

<v-clicks>

- ✅ **Rust + GPUI**（GPU 渲染），原生非 Electron
- ✅ 实时协作 + AI 原生内置，无需扩展
- ✅ Multibuffer 多文件同视图编辑；免费开源

</v-clicks>

<div v-click class="mt-6">

边界：

- ❌ 扩展生态小，且是 Rust→WASM（不能跑任意 JS）
- ❌ 无 .code-workspace（打开文件夹即项目）

</div>

<!--
Zed 的定位：Rust 加 GPUI 渲染的原生编辑器，不是 Electron。它把实时协作和 AI 做成原生内置，不像 VS Code 要靠扩展。Multibuffer 让你在一个视图里编辑多个文件。免费开源。

边界两条：扩展生态比 VS Code 小很多，而且扩展是 Rust 编译成 WASM，不能跑任意 JS;它没有 code-workspace 这种东西，打开一个文件夹就是你的项目上下文。
-->

---

# 为何快

<v-clicks>

- **Rust 从零重写**：高效利用多核 CPU + GPU
- **GPUI**：自研 GPU 加速 UI 框架，界面由 GPU 渲染
- **原生应用，不基于 Electron**

</v-clicks>

<div v-click class="mt-6 text-gray-400">

主打低输入延迟与快启动（官方未公布具体毫秒数）

</div>

<!--
Zed 为什么快？三个原因。第一，用 Rust 从零重写，能高效利用多核 CPU 和 GPU。第二，自研了 GPUI 这个 GPU 加速的 UI 框架，界面是 GPU 渲染的。第三，它是原生应用，不基于 Electron，这是和 VS Code 最根本的架构差异。

它主打低输入延迟和快启动。提一句：官方文档没公布具体的毫秒数字，所以别去记什么 0.4 秒之类的，那是第三方评测，知道它"快"和"为什么快"就够了。
-->

---

# Multibuffer：招牌特性

在**一个视图里同时编辑多个文件**的片段（excerpt），改动自动回写：

<v-clicks>

- 项目搜索（每条匹配 = 一个 excerpt）
- Find All References（查找所有引用）
- Diagnostics（全项目诊断）
- Go to Definition（多定义时）

</v-clicks>

<div v-click class="mt-3">

配合多光标 `cmd-d`，做大规模重构最强

</div>

<!--
Multibuffer 是 Zed 的招牌。它让你在一个视图里同时编辑多个文件的片段，每个片段叫 excerpt，你的改动会自动回写到底层文件。

什么时候会打开 multibuffer？项目搜索，每条匹配行就是一个 excerpt;查找所有引用;全项目诊断;还有跳转定义但有多个定义时。把它和多光标 cmd-d 组合，做跨文件的大规模重构特别强，这是 VS Code 比较难比的体验。
-->

---

# 协作

`cmd-shift-c` 打开协作面板（需 GitHub 登录）：

<v-clicks>

- **Channels**：持久化团队协作房间，**默认 private**，guest 只读
- **Channel Notes**：关联 Markdown 笔记，**无需加入即可查看**
- **Share Project**：协作者像本地一样编辑你机器上的代码

</v-clicks>

<div v-click class="mt-3 text-rose-400">

⚠️ 共享项目会暴露你的本地文件系统，只与信任的人协作

</div>

<!--
协作是 Zed 原生内置的，cmd-shift-c 打开面板，用 GitHub 登录。

Channels 是持久化的团队协作房间，默认是 private，访客是只读。每个频道关联一个 Markdown 笔记，叫 Channel Notes，而且不用加入频道就能查看。Share Project 让协作者像在本地一样编辑你机器上的代码，做结对编程很爽。

但有个安全警告：共享项目会让协作者访问你这个项目内的本地文件系统，所以只跟你信任的人协作。
-->

---

# Vim mode 与 Git

Vim：`workspace: toggle vim mode` 启用，「Vim 模态 + Zed 现代特性」

<div v-click class="mt-2 text-rose-400">

⚠️ 正则用 Zed 引擎：捕获组 `(` `)` 非 `\(` `\)`，替换 `$1` 非 `\1`

</div>

<div v-click class="mt-4">

Git：Git Panel + 行内 blame + 逐 hunk 暂存 `cmd-y` + 提交 `cmd-enter`

</div>

<!--
Vim mode 用命令面板的 toggle vim mode 启用。它不是 1 比 1 复刻 Vim，而是 Vim 的模态设计加上 Zed 的现代特性，比如 tree-sitter 的语义文本对象、gd 跳定义这些扩展。

一个高频易错点：Zed 的 Vim 用自家正则引擎，捕获组用普通括号不用反斜杠括号，替换用美元符号 1 不是反斜杠 1，默认还是全局的，和原生 Vim 不一样。

Git 方面有 Git Panel、行内 blame、逐 hunk 暂存 cmd-y、提交 cmd-enter，都内置。
-->

---

# Agent Panel：三条路径

`cmd-shift-a` 打开。三种 agent harness：

| harness | 说明 |
| --- | --- |
| **Zed Agent** | 原生，用配置的 LLM + 工具 + MCP |
| **External Agents** | 经 **ACP** 接入 Claude/Codex/Copilot |
| **Terminal Threads** | 终端里跑 CLI agent |

Profiles：Write / Ask / Minimal；Checkpoints 可回滚

<!--
Agent Panel 是 Zed 的核心 AI 界面，cmd-shift-a 打开。它有三条 agent 路径，文档叫 harness。

第一种 Zed Agent，原生的，用你配置的 LLM、内置工具加 MCP;第二种 External Agents，通过 ACP 协议，也就是 Agent Client Protocol，接入 Claude、Codex、Copilot 这些外部 agent;第三种 Terminal Threads，直接在终端里跑 CLI agent。

它有三个 Profile：Write、Ask、Minimal，控制可用工具;还有 Checkpoints 可以回滚改动。
-->

---

# Edit Prediction 与 Inline Assistant

**Edit Prediction**：默认 **Zeta** 模型（Zed 自研开源），免费 2000 次/月

<v-clicks>

- Eager（内联显示）/ Subtle（按住 Alt 才显示）
- 接受键 `Alt+Tab`；**Linux 是 `Alt+L`**

</v-clicks>

<div v-click class="mt-3">

**Inline Assistant**（`ctrl-enter`）：显式 prompt 替换选区 —— 区别于自动的 Edit Prediction

</div>

<!--
Zed 的 AI 补全叫 Edit Prediction，默认模型是 Zeta，Zed 自研的开源模型，免费版每月 2000 次。

它有两种显示模式：Eager 是内联直接显示，Subtle 是只在你按住 Alt 时才显示。接受键是 Alt+Tab，但 Linux 上是 Alt+L，因为要避开窗口管理器冲突，这是个易错点。

另一个是 Inline Assistant，ctrl-enter 调用，它需要你显式给 prompt 描述怎么改，然后用结果替换选区。和自动建议的 Edit Prediction 正好互补：一个自动、一个手动给指令。
-->

---

# MCP 与扩展

**MCP**：Zed 里叫 **context servers**，在 `settings.json` 的 `context_servers` 键配置

<div v-click class="mt-2 text-rose-400">

⚠️ 不是 `mcpServers`/`servers`，而是 `context_servers`

</div>

<div v-click class="mt-4">

**扩展**：Rust 编译成 **WASM**，不能跑任意 JS；能力沙箱 `process:exec` / `download_file` / `npm:install`

</div>

<!--
MCP 在 Zed 里有个特别的名字，叫 context servers，配置写在 settings.json 的 context_servers 键下。注意它不叫 mcpServers，也不叫 servers，是 context_servers，这是 Zed 特有的命名，易错。

扩展是 Zed 和 VS Code 最根本的差异：Zed 扩展用 Rust 编译成 WASM，不能跑任意 JS 或 Node，类型也限于语言、主题、片段、调试器、MCP 这些。它有个能力沙箱系统，扩展要显式申请 process exec 执行命令、download file 下载、npm install 装包这些权限。
-->

---

# vs VS Code

| 维度 | Zed | VS Code |
| --- | --- | --- |
| 架构 | Rust + GPUI 原生 | Electron |
| 协作/AI | 原生内置 | 靠扩展 |
| 扩展 | Rust→WASM 沙箱 | Node.js/JS 全权 |
| 生态 | 较小 | 庞大 |

默认 VS Code keymap，迁移成本低

<!--
和 VS Code 怎么比？架构上 Zed 是 Rust 加 GPUI 原生，VS Code 是 Electron;协作和 AI，Zed 原生内置，VS Code 靠扩展;扩展模型，Zed 是 Rust 编译 WASM 加能力沙箱，VS Code 是 Node 全权扩展，更灵活但也更重;生态 Zed 还小，VS Code 庞大。

一句话：要极致性能和原生协作选 Zed，要庞大生态和灵活扩展选 VS Code。好在 Zed 默认就用 VS Code 键位，从 VS Code 过来几乎零成本。
-->

---
layout: center
class: text-center
---

# 总结

Zed = Rust + GPUI 的高性能原生编辑器

Multibuffer · 实时协作 · Agent Panel(三 harness) · Edit Prediction(Zeta) · context_servers · WASM 扩展

<div class="mt-8 flex justify-center gap-6 text-xl">
  <a href="https://zed.dev/docs" target="_blank">📖 官方文档</a>
  <a href="https://zed.dev" target="_blank">⬇️ 下载</a>
</div>

<!--
总结：Zed 是 Rust 加 GPUI 的高性能原生编辑器。

抓手记牢：Multibuffer 多文件同视图编辑、原生实时协作、Agent Panel 三条 harness、Edit Prediction 的 Zeta 模型、MCP 叫 context servers、扩展是 Rust 编 WASM。它免费开源、默认 VS Code 键位，追求速度的人值得一试。谢谢。
-->
