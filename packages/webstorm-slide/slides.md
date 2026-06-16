---
theme: seriph
background: https://cover.sli.dev
title: WebStorm — JS/TS 专精 IDE
info: |
  Presentation WebStorm — JetBrains 出品的 JavaScript/TypeScript 专精 IDE。

  Learn more at [https://www.jetbrains.com/webstorm/](https://www.jetbrains.com/webstorm/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🧠</span>
</div>

<br/>

## WebStorm — JS/TS 专精 IDE

JetBrains 出品，开箱即语义理解；重构、调试、数据库工具一体内置

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://www.jetbrains.com/webstorm/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
今天聊 WebStorm：JetBrains 的 JavaScript/TypeScript 专精 IDE。

如果说 VS Code 是轻量可插拔的编辑器，WebStorm 就是开箱即重的 IDE：不装插件就懂你的整个项目。

主线：定位 → 导航 → 智能编码 → 重构 → 运行调试 → Local History → 内置工具 → AI 与 Junie → 免费政策 → keymap 与对比 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么

<v-clicks>

- ✅ JetBrains **JS/TS 专精 IDE**，开箱即语义化
- ✅ 重构一等公民 + 跨文件 Find Usages
- ✅ 数据库工具、HTTP Client、调试器全内置
- ✅ Local History：独立于 Git 的本地安全网

</v-clicks>

<div v-click class="mt-6">

边界：

- ❌ 基于 JVM，**资源重**、启动慢、内存 GB 级
- ❌ 商业付费（非商业/学生/开源免费）

</div>

<!--
WebStorm 的定位：JetBrains 的前端专精 IDE。最大特点是开箱即语义化——基于类型推断的补全、跨文件查找用法、声明实现跳转，不装插件就理解整个 JS/TS 项目。

它还把重构做成一等公民，数据库工具、HTTP Client、调试器全部内置，外加 Local History 这个独立于 Git 的本地安全网。

边界两条：基于 JVM 资源重、启动慢、内存能到 GB 级;商业付费，但非商业用途、学生、开源项目免费。
-->

---

# 导航：Search Everywhere

JetBrains 效率核心是强大的导航：

<v-clicks>

- **Search Everywhere**：**双击 Shift** —— 搜文件/类/符号/动作/文本/Git，还能算数学
- **Find Action** `Ctrl+Shift+A` —— 执行任何动作，哪怕它没绑快捷键
- Go to File `Ctrl+Shift+N`、Recent Files `Ctrl+E`
- Go to Declaration `Ctrl+B`、Find Usages `Alt+F7`

</v-clicks>

<!--
导航是 JetBrains 的效率核心。记住两个万能入口：Search Everywhere 双击 Shift，统一搜文件、类、符号、动作、文本，甚至能当计算器;Find Action，Ctrl+Shift+A，能执行任何动作，哪怕它没绑快捷键，配合它你不用记一大堆键。

再加上 Go to File、Recent Files、Go to Declaration、Find Usages 这些定向跳转，代码间穿梭如飞。
-->

---

# 智能编码与意图动作

补全：基础 `Ctrl+Space`、智能 `Ctrl+Shift+Space`、语句 `Ctrl+Shift+Enter`

**意图动作 vs 快速修复**（都用 `Alt+Enter`）：

| 灯泡 | 含义 |
| --- | --- |
| 🟡 黄 | 意图动作：优化/转换建议（非错误） |
| 🔴 红 | 快速修复：针对错误/警告（`Alt+Shift+Enter` 直接套） |

<!--
智能编码方面，补全分三种：基础 Ctrl+Space，按类型推断的智能补全 Ctrl+Shift+Space，还有自动补全括号分号的语句补全。

JetBrains 有个核心概念要分清：意图动作和快速修复，都用 Alt+Enter 触发。黄灯泡是意图动作，给你优化或转换建议，不一定是错;红灯泡是快速修复，针对真正检测到的错误或警告，Alt+Shift+Enter 可以直接套用。
-->

---

# 重构：Refactor This

`Ctrl+Alt+Shift+T` 弹出当前上下文所有可用重构：

| 重构 | 快捷键 |
| --- | --- |
| Rename（跨文件更新引用） | `Shift+F6` |
| Extract Variable / Method | `Ctrl+Alt+V` / `Ctrl+Alt+M` |
| Inline（与 Extract 互逆） | `Ctrl+Alt+N` |
| Safe Delete（删前检查引用） | `Alt+Delete` |

<div v-click class="mt-3">

带 **Preview** 预览影响 + **Conflict Detection** 冲突检测

</div>

<!--
重构是 WebStorm 的招牌。Refactor This，Ctrl+Alt+Shift+T，一键弹出当前位置所有能做的重构。

常用的：Rename 跨文件自动更新所有引用，不是文本替换;Extract 提取变量或方法，Inline 是它的逆操作;Safe Delete 删除前先检查谁在引用，防止误删。所有重构都带预览和冲突检测，跨文件也安全。这是 VS Code 较难比的地方。
-->

---

# 运行与调试

**Run/Debug Configuration**：临时（右键自动生成，半透明，**上限 5 个**）/ 永久（持久化，可随 VCS 共享）

<v-clicks>

- 断点：行 `Ctrl+F8`、**条件断点**（填 JS 布尔表达式）、异常断点
- Logpoint 通过断点的 **Log 属性**实现（不挂起也能打印）
- 单步：Step Over `F8` / Into `F7` / Out `Shift+F8` / **Smart Step Into** `Shift+F7`

</v-clicks>

<div v-click class="mt-3 text-rose-400">

⚠️ 浏览器端 JS 调试仅支持 Chrome/Chromium 系

</div>

<!--
运行调试围绕 Run/Debug Configuration，它是一组命名的启动属性。分临时和永久：临时配置右键运行时自动生成、半透明图标、默认最多留 5 个;永久配置持久化，勾上 Store as project file 还能随 VCS 共享给团队。

断点除了普通行断点，还有条件断点填 JS 表达式、异常断点;Logpoint 在这里是通过断点的 Log 属性实现的，不挂起也能打印。单步注意 Smart Step Into，一行有多个调用时让你选进哪个。一个坑：浏览器端 JS 调试只支持 Chrome 系。
-->

---

# 版本控制与 Local History

- Commit `Ctrl+K`、Push `Ctrl+Shift+K`；支持 Changelists、行级部分提交、Staging Area

<div v-click class="mt-4">

**Local History（本地历史）** —— JetBrains 独有：

- **独立于 Git**，自动持续记录项目改动
- 可恢复**未入库**的已删文件

</div>

<div v-click class="mt-3 text-rose-400">

⚠️ 不能替代正式 VCS；升级 WebStorm 会清空；默认仅留约 5 工作日

</div>

<!--
版本控制方面，Commit 是 Ctrl+K，Push 是 Ctrl+Shift+K，支持变更列表、行级部分提交、暂存区。

真正的特色是 Local History，本地历史，这是 JetBrains 独有的。它独立于 Git，自动持续记录你项目的每一次改动，哪怕你还没 git commit，甚至文件已经删了，都能从这里找回来，是个强力安全网。

但记住边界：它不能替代正式版本控制做长期管理，升级 WebStorm 时会被清空，默认只保留约 5 个工作日。
-->

---

# 内置工具

<v-clicks>

- **集成终端** `Alt+F12`（可启 Junie / Claude Code / Codex）
- **HTTP Client**：`.http` / `.rest` 文件，编辑器内 Run，支持环境变量、WebSocket/gRPC
- **数据库工具**：内嵌 DataGrip 全功能
- **Prettier**：非内置，装依赖后 `Ctrl+Alt+Shift+P`
- **ESLint**：默认自动检测 node_modules，可保存时 fix

</v-clicks>

<!--
内置工具是 WebStorm 重的原因，也是值的原因。集成终端 Alt+F12，还能在里面起 AI Agent。

HTTP Client 用 .http 文件直接在编辑器里写请求、点 Run，支持环境变量、WebSocket、gRPC，相当于内置了 Postman。数据库工具更夸张，直接内嵌了 DataGrip 全功能。

注意两个集成方式不同：Prettier 非内置，要装成项目依赖才出现;ESLint 默认就自动检测 node_modules 里的 ESLint，可以配置保存时自动 fix。
-->

---

# AI：AI Assistant 与 Junie

WebStorm 有两个 AI 产品，共用一个订阅：

| 产品 | 定位 |
| --- | --- |
| **AI Assistant** | 补全、Next edit、Chat（含 agent）、commit message |
| **Junie** | agentic 编码 agent，自主干活 |

Junie 两模式：**Code**（自主跑命令/改代码/跑测试）/ **Ask**（只读理解）

<div v-click class="mt-3 text-rose-400">

⚠️ 敏感动作需批准；Brave Mode 绕过审批（官方 not recommended）

</div>

<!--
AI 方面 WebStorm 有两个产品，共用一个 JetBrains AI 订阅。AI Assistant 偏内联：补全、下一处编辑建议、Chat 带 agent 模式、自动生成 commit message。Junie 是独立的 agentic agent，能自主干活。

Junie 两种模式要分清：Code mode 自主跑命令、建文件、改代码、跑测试;Ask mode 只读，理解和答疑不改代码。安全上敏感动作默认要批准，有个 Brave Mode 能绕过审批，但官方明确不推荐。它的项目规约写在 .junie/AGENTS.md。
-->

---

# AI 免费政策与模型

<div class="text-rose-400">

⚠️ **易错边界**：2025.1 起 **AI Free** 层 —— **无限补全 + 本地模型**免费；**云端 AI 与 Junie 按额度**。

</div>

<v-clicks>

- AI Free ≠ WebStorm 非商业免费（两条独立政策）
- 云端模型：Claude / GPT / Gemini / Grok
- 本地模型：Ollama / LM Studio；也支持 BYOK

</v-clicks>

<!--
免费政策是高频易错点。2025.1 起 JetBrains 加了 AI Free 层：无限代码补全加本地模型是真免费;但云端 AI 和 Junie 是按额度 credit 用的，不是无限。

还要区分两条独立政策：AI Free 是 AI 功能的免费层;WebStorm 非商业免费是 IDE 本身的授权，两者无关，IDE 免费不代表云端 AI 无限。

模型很全：云端 Claude、GPT、Gemini、Grok;本地通过 Ollama 和 LM Studio，隐私敏感可以走本地，也支持自带 key。
-->

---

# keymap 与 vs VSCode

`Settings | Keymap` 可切 **VS Code keymap**；Vim 用 **IdeaVim 插件**（`.ideavimrc`）

| 维度 | WebStorm | VS Code |
| --- | --- | --- |
| 语义/重构 | 开箱即深 | 靠 LSP/扩展 |
| 资源 | 重、GB 级 | 轻、启动快 |
| 价格 | 商业付费 | 免费开源 |

<!--
迁移成本上 WebStorm 很贴心：Settings Keymap 里可以直接切成 VS Code 键位;想用 Vim 装 IdeaVim 插件，配置写在 .ideavimrc。

和 VS Code 怎么选？一句话：WebStorm 用资源重和付费，换来开箱即深的语义理解、重构和一体化工具;VS Code 用轻量免费和庞大扩展生态，换取灵活和低门槛。纯前端深度开发选 WebStorm，轻量通用和远程开发选 VS Code。
-->

---
layout: center
class: text-center
---

# 总结

WebStorm = 开箱即懂的 JS/TS 重型 IDE

Search Everywhere · Refactor This · Local History · 内置全家桶 · AI Assistant + Junie

<div class="mt-8 flex justify-center gap-6 text-xl">
  <a href="https://www.jetbrains.com/help/webstorm/" target="_blank">📖 官方文档</a>
  <a href="https://www.jetbrains.com/webstorm/" target="_blank">⬇️ 下载</a>
</div>

<!--
总结：WebStorm 是开箱即懂你项目的 JS/TS 重型 IDE。

抓手记牢：Search Everywhere 万能搜、Refactor This 一键重构、Local History 本地安全网、内置数据库和 HTTP Client 全家桶、AI Assistant 加 Junie 两个 AI 产品。它重、它付费，但深度和一体化是它的价值。谢谢。
-->
