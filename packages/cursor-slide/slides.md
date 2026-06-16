---
theme: seriph
background: https://cover.sli.dev
title: Cursor — AI 原生代码编辑器
info: |
  Presentation Cursor — 基于 VS Code 构建的 AI 原生编辑器，Tab 预测 + Agent 自主编程。

  Learn more at [https://cursor.com](https://cursor.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">✨</span>
</div>

<br/>

## Cursor — AI 原生代码编辑器

基于 VS Code 构建，以 Tab 预测补全与 Agent 自主编程为核心；扩展/快捷键一键迁移

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://cursor.com/docs" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
今天聊 Cursor：2026 年最火的 AI 原生代码编辑器之一。

它的根基是 VS Code 的 fork，所以上手零门槛；它的灵魂是 AI——Tab 预测、Cmd+K 内联编辑、Agent 自主开发。

主线：定位 → 从 VS Code 迁移 → Tab → Cmd+K → Chat 四模式 → @ 上下文 → 代码库索引 → 模型 → Rules → MCP 与隐私 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么

<v-clicks>

- ✅ **VS Code 的 fork** + 原生 AI，Stack Overflow 约 18%、百万级日活
- ✅ Tab 预测、Cmd+K 内联、Agent 多文件自主
- ✅ 代码库语义索引，AI 理解整个项目

</v-clicks>

<div v-click class="mt-6">

边界：

- ❌ 扩展走 **Open VSX**，部分扩展缺失/行为不同
- ❌ 闭源、AI 按 token/额度计费；上下文需发往模型方

</div>

<!--
Cursor 的定位：VS Code 的 fork 加上原生 AI。Stack Overflow 约 18% 使用率，史上最快登场的编辑器之一。

强项是三把斧：Tab 预测补全、Cmd+K 内联编辑、Agent 多文件自主开发，再加上代码库语义索引让 AI 理解整个项目。

边界两条：扩展用 Open VSX 不是微软 Marketplace，少数扩展会缺；闭源、按 token 计费，代码上下文要发给模型方，隐私敏感要注意。
-->

---

# 从 VS Code 迁移

`Cmd+Shift+J` → General → Account → 「VS Code Import」一键导入

<v-clicks>

- 迁移 **扩展 / 主题 / 设置 / 快捷键**，几乎零成本
- 默认快捷键与 VS Code 一致，可与 VS Code 并存同一项目

</v-clicks>

<div v-click class="mt-6 text-rose-400">

⚠️ 扩展来自 **Open VSX** 而非微软 Marketplace —— 多数热门扩展有，但不保证全部

</div>

<!--
迁移是 Cursor 的杀手锏。Cmd+Shift+J 打开设置，General 里 VS Code Import 一键把扩展、主题、设置、快捷键全导过来，几乎零成本，还能和 VS Code 并存。

唯一要记的坑：Cursor 扩展来自 Open VSX 注册表，不是微软官方 Marketplace，所以个别扩展可能缺失或行为不同。
-->

---

# Tab：预测式补全

招牌能力，基于近期编辑、周围代码、linter 错误预测：

<v-clicks>

- `Tab` 接受整条；`Cmd+→` 逐词接受；`Esc` 拒绝
- **jump-in-file**：接受后再按 `Tab` 跳到下一处预测点
- 能预测**跨文件**改动，不止光标处续写

</v-clicks>

<!--
Tab 是 Cursor 的招牌。它不只看你光标处，而是结合近期编辑、周围代码、甚至 linter 错误来预测。

Tab 接受整条，Cmd 右箭头逐词接受，Esc 拒绝。更强的是 jump-in-file：接受一处后再按 Tab，它直接把光标跳到下一处该改的地方；还能预测跨文件的连锁改动。这是它和传统补全最大的不同。
-->

---

# Cmd+K：内联编辑

编辑器内对选中代码做**定向小改**，不开聊天面板：

<v-clicks>

- `Cmd+K` 打开 → 描述需求 → `Return` 应用
- `Opt+Return` 切「快速提问」
- `Cmd+L` 把选中代码升级到 Agent 做多文件任务
- 终端里 `Cmd+K` 用自然语言生成命令，`Cmd+Return` 执行

</v-clicks>

<!--
Cmd+K 是内联编辑，适合改一小段：选中代码，Cmd+K，描述要怎么改，回车应用。

它还能 Opt+Return 切成快速提问模式；如果改动太大，Cmd+L 把选中代码带进 Agent 升级成多文件任务。终端里也有 Cmd+K，用自然语言生成 shell 命令，Cmd+Return 执行。同一个键，不同场景。
-->

---

# Chat：四种模式

`Cmd+I` / `Cmd+L` 打开侧栏，`Shift+Tab` 循环切换：

| 模式 | 作用 | 改代码 |
| --- | --- | --- |
| **Agent** | 搜代码库、多文件改、跑命令、修错迭代 | 是 |
| **Ask** | 只读理解代码、答疑 | 否 |
| **Plan** | 先调研提问、出实施计划再执行 | 否 |
| **Debug** | 需运行时证据的疑难 bug | 是 |

<!--
Chat 面板是个容器，Cmd+I 或 Cmd+L 打开，里面用 Shift+Tab 循环四种模式。

Agent 是主力，自主搜代码库、多文件编辑、跑命令、修错;Ask 是只读，纯理解和答疑，不改代码;Plan 先调研、提澄清、产出可编辑的实施计划再执行,适合复杂任务;Debug 专攻要运行时证据的疑难 bug。一个面板四种模式，按任务切。
-->

---

# @ 上下文 与 Checkpoints

聊天里输 `@` 精确指定上下文：

<v-clicks>

- `@Files` / `@Folders` / `@Docs` / `@Terminals`
- `@Past Chats` / `@Commit` / `@Branch` / `@Browser`
- 不确定就别加 `@`，Agent 会靠语义索引自己找

</v-clicks>

<div v-click class="mt-4 text-rose-400">

⚠️ Checkpoints（改动前自动快照）独立于 Git，可一键回滚 —— 不是 commit

</div>

<!--
需要精确指定上下文时输 @：文件、文件夹、已索引文档、终端输出、历史对话、commit/branch 的 diff、浏览器内容。官方建议：明确知道相关文件才用 @，不确定就别加，Agent 会靠代码库语义索引自己找。

一个安全网叫 Checkpoints：Agent 每次改动前自动快照，可一键 Restore 回滚。注意它独立于 Git，不是 commit，别混。
-->

---

# 代码库索引与忽略

打开项目自动**语义索引**：切语义块 → 向量化 → 入库，约 80% 完成即可用，每 5 分钟增量同步。

| 文件 | 作用 |
| --- | --- |
| `.cursorignore` | 屏蔽索引 **+ 所有 AI 访问** |
| `.cursorindexingignore` | **仅**排除索引，AI 仍可见 |

<div v-click class="mt-3 text-rose-400">

⚠️ `.cursorignore` 是 best-effort；Terminal/MCP 工具仍能访问被忽略代码

</div>

<!--
打开项目，Cursor 自动做语义索引：把代码切成语义块、向量化、存库，约 80% 完成时语义搜索就能用，之后每 5 分钟增量同步。

两个忽略文件别搞混：.cursorignore 尽力屏蔽索引和所有 AI 访问;.cursorindexingignore 只排除索引，AI 功能仍能看到文件。注意 .cursorignore 是 best-effort，不保证 100%，而且终端和 MCP 工具仍能访问被忽略的代码，安全敏感场景要小心。
-->

---

# 模型：Auto vs Max

<div class="grid grid-cols-2 gap-6 mt-4">
<div>

**Auto**

- 自动选模型
- 走折扣的 Auto+Composer 池
- 日常任务首选、省额度

</div>
<div>

**Max Mode**

- 上下文窗口拉到模型上限
- 大型代码库复杂任务
- 按 token 计费、更贵

</div>
</div>

<div v-click class="mt-6">

可选模型：自研 **Composer** + Claude / GPT / Gemini / Grok 等

</div>

<!--
模型有两种取舍。Auto 模式自动选模型，走折扣的 Auto 加 Composer 池，日常任务用它最省。Max Mode 把上下文窗口拉到模型上限，适合大型代码库的复杂任务，但按 token 计费、更贵。

可选模型很全：Cursor 自研的 Composer，加上 Claude、GPT、Gemini、Grok 等主流模型。记住一句：Auto 省钱，Max 拉满，按任务选。
-->

---

# Rules：给 AI 的项目规约

`.cursor/rules/*.mdc`（纯 `.md` 无效，缺 frontmatter）：

```yaml
---
alwaysApply: false
description: 仅在写 React 组件时生效
globs: src/components/**/*.tsx
---
```

| 类型 | 配置 |
| --- | --- |
| Always | `alwaysApply: true`（globs/description 被忽略） |
| Auto Attached | `false` + `globs` |
| Agent Requested | `false` + `description` |
| Manual | 都不给，靠 `@规则名` 调 |

<!--
Rules 是给 AI 的项目规约，写在 .cursor/rules 下的 .mdc 文件，纯 md 因为没 frontmatter 会被忽略。

frontmatter 三字段：alwaysApply、description、globs，它们的组合推导出四种类型：always 始终注入，注意这时 globs 和 description 会被忽略;auto attached 按 glob 匹配文件自动附加;agent requested 让 Agent 读 description 自己决定;manual 只能 @规则名 手动调。旧的根目录 .cursorrules 已经是 legacy。
-->

---

# MCP 与隐私

**MCP**：`.cursor/mcp.json`（项目）/ `~/.cursor/mcp.json`（全局），顶层键 `mcpServers`

```json
{ "mcpServers": { "name": {
  "command": "npx", "args": ["mcp-server"] } } }
```

<div v-click class="mt-4">

**隐私模式**（`Cmd+Shift+J` → General）：代码不用于训练 + 零数据保留(ZDR)

</div>

<div v-click class="mt-2 text-rose-400">

⚠️ MCP 顶层键是 `mcpServers`（VS Code 是 `servers`）；BYOK 自带 key 不享 ZDR

</div>

<!--
MCP 接入外部工具，配置文件 .cursor/mcp.json，顶层键是 mcpServers，注意和 VS Code 的 servers 不一样，这是高频坑。

隐私模式在 Cmd+Shift+J 的 General 里开，承诺代码不用于训练并零数据保留。但有个例外：用自带 API key 也就是 BYOK 时不享 ZDR，要遵循你自己 provider 的隐私政策。
-->

---
layout: center
class: text-center
---

# 总结

Cursor = VS Code 的壳 + 原生 AI 的魂

Tab 预测 · Cmd+K 内联 · Chat 四模式 · @ 上下文 · 语义索引 · Rules · Auto/Max

<div class="mt-8 flex justify-center gap-6 text-xl">
  <a href="https://cursor.com/docs" target="_blank">📖 官方文档</a>
  <a href="https://cursor.com" target="_blank">⬇️ 下载</a>
</div>

<!--
总结：Cursor 是 VS Code 的壳加上原生 AI 的魂。

抓手记牢：Tab 预测、Cmd+K 内联、Chat 四模式、@ 上下文、代码库语义索引、Rules 规约、Auto 与 Max 两种模型取舍。从 VS Code 迁移几乎零成本，值得一试。谢谢。
-->
