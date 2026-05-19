---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Claude Code
info: |
  Presentation Claude Code for developers.

  Learn more at [https://docs.claude.com/en/docs/claude-code/overview](https://docs.claude.com/en/docs/claude-code/overview)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:anthropic-icon class="text-7xl" />
</div>

<br/>

## Claude Code：Anthropic 官方 Agent CLI

Agent in your terminal —— 把 Claude 放进真实开发环境，读写文件 / 跑命令 / 调 MCP

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Claude Code —— Anthropic 自家出品的 AI 编码 Agent。

不同于 claude.ai 对话框，它直接接管 shell + 文件系统 + Git，把 AI 写代码做到「事实标准」级别。
-->

---
transition: fade-out
---

# 什么是 Claude Code？

Anthropic 官方出品的 Agent 化编码助手，三种载体一致体验

<v-clicks>

- **CLI（核心）**：装一行命令，终端里跑 Agent，读写本地文件 / 执行命令
- **VS Code / JetBrains 扩展**：IDE 内嵌对话 + 右键 Refactor / Explain
- **Web（claude.ai/code）**：浏览器免安装版，可直连 GitHub 仓库
- **Agent SDK**：把 Claude Code 内核嵌进自家应用（Slack bot / 内部工具）

</v-clicks>

<br>

<div v-click text-xs>

_Read more about_ [_Claude Code_](https://docs.claude.com/en/docs/claude-code/overview)

</div>

<style>
h1 {
  background-color: #C15F3C;
  background-image: linear-gradient(45deg, #C15F3C 10%, #4A1E0C 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---
transition: slide-up
level: 2
---

# 定位：Agent in your terminal

不是聊天框，是会自己读写文件 + 跑命令 + 调外部工具的 Agent

<v-clicks>

- **直接接管 shell + 文件系统**：不需要复制粘贴代码段
- **多轮 + 工具循环**：观察执行结果继续推理，遇错自动修正
- **持久化记忆**：跨会话累积项目知识 / 用户偏好 / 反馈
- **多模态**：粘图 / 读截图 / 解析 PDF / 看 Jupyter 都能识别
- **可编程性**：Hooks / Skills / MCP / Subagents 四级扩展
- **生态闭环**：与 Anthropic 自家模型深度耦合，Opus / Sonnet / Haiku 一键切

</v-clicks>

<v-click>

定位关键词：**Agent**（非 Copilot）+ **CLI 优先**（IDE 是壳子）+ **可扩展**（钩子 / 技能 / 协议）。

</v-click>

---
transition: slide-up
---

# 优劣速读

<v-clicks>

**优点**

- 与 Anthropic 模型深度集成，1M 上下文版本直接选
- 内置 Read / Write / Edit / Bash / Grep / Glob / Agent 等核心工具
- Skills / Hooks / MCP / Subagents 四层可扩展机制
- 持久化 Memory + Auto-Memory，跨会话累积知识
- CLI / IDE / Web 三端体验一致

**缺点**

- 闭源，只跑在 Anthropic 服务（仅 Bedrock / Vertex 算「企业自托管」）
- 按 token 计费成本不低，重度用户必上 Max 订阅
- 中国大陆访问需自备网络
- 高级特性（hook / skill / MCP）文档分散，学习曲线偏陡
- Web 版能力少于 CLI（hook / 部分 MCP 仅 CLI 可用）

</v-clicks>

---
transition: slide-up
---

# 安装

```bash
# npm 全局装（最直接）
npm install -g @anthropic-ai/claude-code

# 或 pnpm
pnpm add -g @anthropic-ai/claude-code

# 或 macOS brew
brew install --cask claude-code

# 验证
claude --version    # 2.x.x
claude -h           # 列子命令与 flag
```

<v-click>

**Node 版本要求**：Node 18+，推荐 Node 22 LTS。

</v-click>

<v-click>

**Windows**：推荐 WSL2 + Ubuntu；原生 Windows 也能跑，但 shell / 路径会略有摩擦。

</v-click>

---
transition: slide-up
---

# 认证：三选一

| 方式 | 适合场景 | 计费 |
| --- | --- | --- |
| `claude.ai` 账号（Pro / Max） | 个人 + 中度使用 | 月费定额 |
| Anthropic Console（API key） | 团队 + 重度 | 按 token |
| Vertex AI / AWS Bedrock | 企业有 GCP / AWS | 走云厂商账单 |

```bash
claude
# 首次启动 → 浏览器跳 OAuth
# 凭据写入：~/.config/claude/credentials.json

# 切换登录
/login

# 看当前账号 + 模型
/model
```

<v-click>

**Pro / Max 订阅价**（截至 2026）：$20 / $100 / $200/月，含一定额度后超出按 token。

</v-click>

---
transition: slide-up
---

# 模型选择：四档矩阵

| 模型 ID | 别名 | 上下文 | 适合 |
| --- | --- | --- | --- |
| `claude-opus-4-7` | Opus 4.7 | 200K | 复杂规划 / 大重构 / 难 debug |
| `claude-opus-4-7[1m]` | Opus 4.7 1M | 1M | 整本仓库 / 长会话 |
| `claude-sonnet-4-6` | Sonnet 4.6 | 200K | 日常编码（90% 时间） |
| `claude-haiku-4-5-20251001` | Haiku 4.5 | 200K | 简单 grep / 快速回答 |

```bash
# 启动时指定
claude --model opus
claude --model sonnet
claude --model haiku

# 交互里切
/model
```

<v-click>

**直觉决策**：方案设计上 Opus；写实现 / 改 bug Sonnet；整仓库塞上下文用 Opus 1M；一行答用 Haiku。

</v-click>

---
transition: slide-up
---

# 价格速查（截至 2026）

按 token 计费（输入 / 输出价格分开），单位 $/1M tokens

<v-clicks>

| 模型 | 输入 | 输出 | Prompt cache 读 |
| --- | --- | --- | --- |
| Opus 4.7 | $15 | $75 | $1.50 |
| Opus 4.7 (1M) | $30 | $150 | $3 |
| Sonnet 4.6 | $3 | $15 | $0.30 |
| Haiku 4.5 | $0.80 | $4 | $0.08 |

</v-clicks>

<v-click>

**优化套路**：长会话开 prompt cache（自动）；大仓库分析用 Sonnet 而非 Opus 1M；只有规划复杂方案才切 Opus。

</v-click>

<v-click>

`/cost` 看当前会话的 token 分布与花费实时数字。

</v-click>

---
transition: slide-up
---

# 第一次对话

```bash
cd ~/projects/my-app
claude
```

```
╭─────────────────────────────────╮
│  Claude Code  v2.x.x            │
│  cwd: ~/projects/my-app         │
│  model: Sonnet 4.6              │
╰─────────────────────────────────╯

> 帮我看看 src/index.ts 文件里的 main 函数
```

<v-click>

Claude 会：

1. 调 `Read` 工具读 `src/index.ts`
2. 分析后回复说明
3. **所有 tool 调用都留在屏幕上**，可随时打断纠正

</v-click>

---
transition: slide-up
---

# 退出 / 暂停

| 操作 | 快捷键 / 命令 |
| --- | --- |
| 退出 / 中断 | `Ctrl+C` 两次（`/quit`）/ `Esc` |
| 清空 / 压缩 | `/clear` / `/compact <提示>` |
| 后台任务 | 自动放后台，UI 提示 running |
| 恢复上次 / 指定会话 | `claude --continue` / `--resume <id>` |

<v-click>

会话超长触发 `context_length_exceeded` 错误时，**/compact** 会让 Claude 自己总结历史并替换原对话，token 压力立刻缓解。

</v-click>

---
transition: slide-up
---

# 项目说明书：CLAUDE.md

Claude Code 启动时自动读项目根目录的 `CLAUDE.md`，把它放进系统提示

```md
# AI 开发指南

## 项目概述

本仓库是 Vue 3 + Vite + TS 的电商前台...

## 代码规范

- 注释用中文（函数加 JSDoc）
- 组件 PascalCase，函数 camelCase
- 偏好 SCSS + UnoCSS @apply

## 常用命令

- `pnpm dev`：启动 dev server（端口 10000）
- `pnpm test`：单元测试
- `pnpm lint:fix`：自动修复格式
```

<v-click>

每次启动 / `cd` 切目录时会重新加载。**这是教 Claude 项目约定最有效的方式**。

</v-click>

---
transition: slide-up
---

# CLAUDE.md vs 用户全局 Memory

| 路径 | 范围 | commit |
| --- | --- | --- |
| `<project>/CLAUDE.md` | 项目级（团队共享） | ✓ |
| `~/.claude/CLAUDE.md` | 用户级（本人偏好） | ✗ |
| `<project>/.claude/settings.json` | 项目共享配置 | ✓ |
| `~/.claude/settings.json` | 用户全局 | ✗ |

<v-click>

**冲突时**：项目级 > 用户级（specific > general）。

</v-click>

<v-click>

```bash
# 新项目快速生成 CLAUDE.md 骨架
/init
```

Claude 会扫 README / package.json / 路由文件 自动起草内容。

</v-click>

---
transition: slide-up
---

# 权限模式：Shift+Tab 循环

按 `Shift+Tab` 在四种模式间切换，UI 实时显示当前模式

<v-clicks>

| 模式 | 行为 |
| --- | --- |
| `default` | 每次写操作（Edit / Write / Bash）都询问 |
| `acceptEdits` | 自动接受 Edit / Write；Bash 仍询问 |
| `bypassPermissions` | 全部自动（**仅本地受信任仓库**） |
| `plan` | 仅读不写，规划阶段用 |

</v-clicks>

<v-click>

```bash
# 或 CLI flag 启动时指定
claude --plan                          # plan 模式
claude --dangerously-skip-permissions  # 等价 bypassPermissions（慎用）
```

</v-click>

<v-click>

**经验**：日常用 `acceptEdits`（编辑自动，Bash 卡审批）即可；探索陌生仓库回到 `default`。

</v-click>

---
transition: slide-up
---

# 权限规则：PermissionRule

```json
// ~/.claude/settings.json
{
  "permissions": {
    "allow": ["Read(*)", "Bash(pnpm:*)", "mcp__context7__*"],
    "deny": ["Bash(rm -rf:*)", "Bash(git push --force:*)"],
    "defaultMode": "acceptEdits"
  }
}
```

<v-click>

| 格式 | 匹配 |
| --- | --- |
| `<Tool>` / `<Tool>(<pattern>)` | 全部 / 前缀（`Bash(pnpm:*)`） |
| `<Tool>(<exact>)` | 单条命令 |
| `mcp__<server>__<tool>` / `mcp__<server>__*` | 具体工具 / server 全部 |

</v-click>

---
transition: slide-up
---

# 内置工具：文件读写

| 工具 | 用途 |
| --- | --- |
| `Read` | 读文件 / 图片 / PDF / Jupyter notebook |
| `Write` | 写整个文件（覆盖） |
| `Edit` | 精确 string replace 编辑（推荐） |
| `NotebookEdit` | 编辑 Jupyter notebook 单元 |

<v-click>

**Edit vs Write 选择**：

- **改局部 → Edit**：只传 old_string + new_string，token 省
- **建新文件 / 整文件重写 → Write**：传完整内容
- **AI 默认偏好 Edit**：每次 Read 后只 patch 改动行

</v-click>

<v-click>

`Read` 支持 `offset` / `limit` 读大文件分段，PDF 用 `pages: "1-5"` 范围。

</v-click>

---
transition: slide-up
---

# 内置工具：搜索 / 命令

| 工具 | 用途 |
| --- | --- |
| `Glob` | 文件名模式匹配（`**/*.ts`） |
| `Grep` | 正则全文搜索（基于 ripgrep） |
| `Bash` | 执行 shell 命令（可后台跑） |
| `WebFetch` / `WebSearch` | 抓 URL / Web 搜索 |

<v-click>

**搜索决策**：知文件名走 Glob，找内容走 Grep；不确定先 Glob 看候选再 Grep 缩范围。Bash 长跑命令自动后台化，配 `Monitor` 读 stdout。

</v-click>

---
transition: slide-up
---

# 内置工具：协作 / 任务

| 工具 | 用途 |
| --- | --- |
| `Agent` / `TodoWrite` | spawn 子代理 / 维护任务清单 |
| `Monitor` / `BashOutput` / `KillShell` | 后台进程 stdout / 读输出 / 终止 |
| `AskUserQuestion` | 交互式问用户（卡点决策） |
| `ScheduleWakeup` / `ToolSearch` | 定时唤醒 / 搜索可用工具 |

<v-click>

**TodoWrite 不是装饰**：> 3 步骤任务必须列 todos，方便用户跟进 + Claude 自检遗漏。

</v-click>

---
transition: slide-up
---

# Slash 命令：CLI 内输入 `/`

| 命令 | 作用 |
| --- | --- |
| `/help` / `/model` | 显示命令 / 选模型 |
| `/init` | 生成 `CLAUDE.md` 骨架 |
| `/clear` / `/compact` | 清空 / 压缩会话 |
| `/cost` | 显示 token 用量 + 费用 |
| `/permissions` / `/hooks` | 管理权限 / 查看 hook |
| `/mcp` / `/agents` | 查看 MCP / subagent 状态 |
| `/login` / `/quit` | 切账号 / 退出 |

---
transition: slide-up
---

# 自定义 Slash 命令

把任意 markdown 放 `~/.claude/commands/<name>.md`，文件内容即 prompt

```md
<!-- ~/.claude/commands/lint.md -->
对当前 staged 文件跑 lint 检查，输出问题列表。
不要自动修复，仅报告。
```

```md
<!-- ~/.claude/commands/release.md -->
做一次 patch 版本发布：
1. 用 changelogen 生成 CHANGELOG
2. bump package.json 到下一 patch
3. git tag + push
4. npm publish
```

<v-click>

CLI 里 `/lint` 或 `/release` 触发，Claude 按 markdown 内容理解并执行。

</v-click>

<v-click>

> 💡 **项目级命令**
>
> `./.claude/commands/<name>.md` commit 进仓库，团队共享。常用于「跑测试」「打包发布」流程封装。

</v-click>

---
transition: slide-up
---

# Skills 机制：核心扩展点 (1/3)

Skill = 一个 SKILL.md 文件 + 关联资源，可被 `/<name>` 触发自动加载

```
~/.claude/skills/cypress-skill/
├── SKILL.md              # 主指令（必需）
├── references/           # 引用资源
│   ├── good-test.cy.ts
│   └── bad-test.cy.ts
├── scripts/              # 工具脚本
│   └── helper.sh
└── data/                 # 静态数据
    └── snippets.json
```

<v-click>

启动时 Claude Code 扫 `~/.claude/skills/*/SKILL.md`，把 `name + description` 放进系统提示。当用户问题匹配 description 时，**Claude 自动调用**。

</v-click>

---
transition: slide-up
---

# Skills 机制：SKILL.md frontmatter (2/3)

```md
---
name: cypress-skill
description: Use when writing Cypress E2E tests for this project
---

# Cypress 测试规范

1. 用 test 服务器（端口 10060，test DB）
2. beforeEach 展开侧边栏（默认折叠）
3. `el-tree-select` 用 `.el-tree-node__content`
```

<v-click>

| 字段 | 必需 | 说明 |
| --- | --- | --- |
| `name` | ✓ | skill 名，slash 命令 `/<name>` |
| `description` | ✓ | 何时使用（Claude 据此判断是否自动调） |

</v-click>

<v-click>

**关键**：description 写「Use when X」格式，匹配率高于「This skill does Y」。

</v-click>

---
transition: slide-up
---

# Skills 机制：流行 skills (3/3)

<v-clicks>

| Skill | 来源 | 用途 |
| --- | --- | --- |
| `superpowers` | 社区 | 通用工程实践（TDD / 调试 / 评审） |
| `cypress-skill` | 项目级 | 自家 Cypress 测试规范 |
| `find-skills` / `update-config` | 内置 | 发现 skill / settings.json 配置 |

</v-clicks>

<v-click>

**项目级 skill** 放 `<project>/.claude/skills/<name>/` 提交进仓库，团队共享。

</v-click>

<v-click>

**Skill vs 自定义命令**：

- Skill：description 触发（Claude 自动调）+ 多文件资源
- 自定义命令：用户显式 `/<name>` 触发，单文件 prompt

</v-click>

---
transition: slide-up
---

# Hooks 机制：tool 前后注入逻辑 (1/3)

Hook = tool 调用前/后跑的自定义 shell 命令——审计 / 通知 / lint 都靠它

```json
// ~/.claude/settings.json
{
  "hooks": [
    {
      "matcher": { "tool": "Edit" },
      "hooks": [
        { "type": "command", "command": "echo $CLAUDE_TOOL_PATH >> ~/edit.log" }
      ]
    },
    {
      "matcher": { "tool": "Bash" },
      "hooks": [
        { "type": "command", "command": "echo $CLAUDE_TOOL_COMMAND >> ~/bash.log" }
      ]
    }
  ]
}
```

---
transition: slide-up
---

# Hooks 机制：matcher + 环境变量 (2/3)

**matcher**：`tool`（精确）/ `tool_pattern`（glob）/ `command`（Bash 前缀）/ `path`（路径 glob）/ `event`（pre / post）

<v-click>

**环境变量**：

| 变量 | 含义 |
| --- | --- |
| `$CLAUDE_TOOL_NAME` / `$CLAUDE_TOOL_PATH` | 工具名 / 操作路径 |
| `$CLAUDE_TOOL_COMMAND` / `$CLAUDE_TOOL_INPUT` | Bash 命令 / 完整输入 JSON |
| `$CLAUDE_TOOL_OUTPUT` | 工具结果（仅 post 事件） |
| `$CLAUDE_SESSION_ID` / `$CLAUDE_PROJECT_DIR` | 会话 ID / 项目根 |
| `$CLAUDE_HOOK_EVENT` | pre / post |

</v-click>

---
transition: slide-up
---

# Hooks 机制：典型场景 (3/3)

```json
// Edit 后自动 prettier 格式化
{
  "matcher": { "tool": "Edit" },
  "hooks": [
    {
      "type": "command",
      "command": "cd $CLAUDE_PROJECT_DIR && pnpm exec prettier --write $CLAUDE_TOOL_PATH"
    }
  ]
}

// 阻止 git push origin main
{
  "matcher": { "tool": "Bash", "command": "git push origin main" },
  "hooks": [
    { "type": "command", "command": "echo 'Blocked: main is protected' && exit 1" }
  ]
}
```

<v-click>

> ⚠️ **阻塞 hook**
>
> hook 退出码非 0 会**阻塞 tool 调用**。可用于「lint 不通过禁止 commit」，但要小心别卡死整个会话。

</v-click>

<v-click>

debug hook：`CLAUDE_NO_HOOKS=1 claude` 临时禁用所有 hook。

</v-click>

---
transition: slide-up
---

# MCP（Model Context Protocol）(1/3)

MCP 是 Anthropic 推的「让 LLM 接外部工具」开放协议；Claude Code 一类支持

```json
// ~/.claude/settings.json
{
  "mcpServers": {
    "context7": { "command": "npx", "args": ["-y", "@upstash/context7-mcp"] },
    "chrome-devtools": { "command": "npx", "args": ["-y", "chrome-devtools-mcp"] }
  }
}
```

<v-click>

`/mcp` 看连接状态：

```
context7              ✓ connected   (2 tools)
chrome-devtools       ✓ connected   (24 tools)
```

</v-click>

---
transition: slide-up
---

# MCP：常用 server (2/3)

| Server | 提供工具 |
| --- | --- |
| `@upstash/context7-mcp` | resolve-library-id / query-docs（最新库文档） |
| `chrome-devtools-mcp` | 浏览器操作 / 截图 / Console / 网络监控 |
| `@modelcontextprotocol/server-filesystem` | 受限文件读写 |
| `@modelcontextprotocol/server-github` | Issue / PR / Repo 操作 |
| `@modelcontextprotocol/server-postgres` | Postgres 查询 |
| `brave-search-mcp` | Brave Search API |

<v-click>

**远程 MCP**：除了 `command + args` 启 stdio 进程，也支持 `url + headers` 接远程 HTTP MCP server（Claude.ai 托管的不少）。

</v-click>

---
transition: slide-up
---

# MCP vs 内置工具 (3/3)

| 维度 | 内置工具 | MCP |
| --- | --- | --- |
| 数量 / 启动 | 固定 / 即时 | 任意 / spawn 子进程 |
| 范围 | 通用（Read / Bash） | 专项（一 server 一类） |
| 命名 | `Read` / `Bash` | `mcp__<server>__<tool>` |

<v-click>

**一类 vs 二类**：内置永远可用；MCP 默认允许 `mcpServers` 全部，可单独 deny。启动用 `--mcp-config <path>` 切换 profile。

</v-click>

---
transition: slide-up
---

# Subagents：并行任务

Agent 工具可 spawn 子代理处理独立任务

```
> 帮我并行做三件事：
>   1. 用 Explore 查找所有 React 组件
>   2. 用 general-purpose 总结测试覆盖率
>   3. 用 code-reviewer 评审 PR #123
```

<v-click>

Claude 调 Agent 工具三次，**每个子代理独立上下文**，并行执行。

</v-click>

<v-click>

**关键属性**：

- 主线程只看子代理最终报告，不污染主上下文
- 子代理可用工具子集（如 Explore 只读）
- 失败可独立重试
- 适合并行 / 大搜索 / 领域专家场景

</v-click>

---
transition: slide-up
---

# Subagents：内置类型

| 类型 | 工具 | 适合 |
| --- | --- | --- |
| `Explore` / `Plan` | 只读 | 大范围搜索 / 规划实施 |
| `general-purpose` | 全工具 | 复杂多步任务 |
| `feature-dev:code-explorer` | 只读 | 深入分析现有代码 |
| `feature-dev:code-architect` | 只读 + 写设计 | 设计新功能 |
| `feature-dev:code-reviewer` | 只读 | 代码评审 |

<v-click>

**何时 spawn**：独立大任务 / 避免污染主上下文 / 需特定 prompt + tool 子集的领域专家

</v-click>

---
transition: slide-up
---

# Subagents：自定义

`~/.claude/agents/<name>.md`：

```md
---
name: typescript-bug-hunter
description: Specialized agent for finding subtle TS bugs
tools: ["Read", "Grep", "Glob"]
model: claude-opus-4-7
---

You are an expert TypeScript bug hunter. Focus on:

- Type narrowing issues
- Generic constraint problems
- Missing `as const` / `satisfies`
- Discriminated union exhaustiveness

Output format: { file, line, issue, suggested fix }
```

<v-click>

调用：`subagent_type: "typescript-bug-hunter"`。`model` 字段可让子代理用不同模型（如主线程 Sonnet，子代理 Opus 跑深度分析）。

</v-click>

---
transition: slide-up
---

# Memory 系统：持久化记忆

Claude Code 2.x 引入跨会话累积的 Memory

```
~/.claude/projects/<encoded-cwd>/memory/
├── MEMORY.md                       # 索引（前 200 行常驻上下文）
├── user_role.md
├── feedback_quiz_quantity.md
├── project_release_freeze.md
└── reference_grafana.md
```

<v-click>

每条 memory 是独立 markdown，含 frontmatter：

```md
---
name: feedback-tdd-required
description: integration tests must hit real DB
metadata:
  type: feedback
---

集成测试必须连真实数据库。

Why: 上季度 mock 测试通过但 prod migration 挂了。
How to apply: 看到 vi.mock 立即提醒。
```

</v-click>

---
transition: slide-up
---

# Memory 类型

| type | 用途 |
| --- | --- |
| `user` | 用户角色 / 偏好（永远用 pnpm / 偏好中文注释） |
| `feedback` | 用户纠正过的事（避免重犯） |
| `project` | 项目动向（计划 / 决策 / 里程碑） |
| `reference` | 外部资源指针（Linear / Grafana / Slack 链接） |

<v-click>

**写 Memory 时机**：

- 用户**显式要求**记下来
- Claude **学到新事实**（如「这个 RDS 不支持 shadow DB」）
- 用户**纠正过**的行为（如「不要 commit .env 文件」）

</v-click>

<v-click>

每次会话开场，把 `MEMORY.md` 索引塞进系统提示。Claude 据此「想起」该项目的所有约定。

</v-click>

---
transition: slide-up
---

# 后台任务

长跑命令（dev server / 测试 / build）Claude 自动放后台

```
> 启动 dev server，跑测试
（Claude 调 Bash run_in_background: true）

You can now do other things. Notifications arrive when ready.

> 怎么 dev server 加 --host 0.0.0.0？
（Claude 用 KillShell 停掉，改命令重启）
```

<v-click>

`Monitor` 工具：实时读 stdout，按需停或继续——一个会话能同时跑多个进程。

</v-click>

<v-click>

**典型组合**：

```
- pnpm dev          （前台 dev server，后台）
- pnpm test --watch （watch 模式测试，后台）
- pnpm storybook    （Storybook，后台）
- 主线程继续读写代码
```

</v-click>

---
transition: slide-up
---

# VS Code 扩展

装 publisher `Anthropic` 的 `Claude` 扩展，体验比裸 CLI 顺滑

<v-clicks>

**核心能力**：

- 选中代码后右键 / 命令面板 → Refactor / Explain / Fix
- 文件树整合：点文件加进对话上下文
- diff 视图：提议修改可逐 hunk 接受
- 内嵌 Markdown 渲染对话

**和 CLI 共享配置**：`~/.claude/settings.json` / hooks / MCP 通用

</v-clicks>

<v-click>

> ⚠️ **部分高级特性仅 CLI**
>
> hooks 配置 / MCP 复杂调试 / Slash 命令历史 仍要在 CLI 里完成。IDE 扩展更适合 **当下编辑场景**，CLI 适合 **长任务 / 跨文件大动作**。

</v-click>

---
transition: slide-up
---

# JetBrains 扩展

IDEA / WebStorm / PyCharm 等装 `Claude Code` 插件

<v-clicks>

- Plugin Marketplace 搜 `Claude Code`
- 与 VS Code 扩展功能对齐：右键操作 / 文件树 / diff
- 共享 `~/.claude/settings.json` 配置
- 支持 IDE 内 terminal 直接挂 Claude CLI

</v-clicks>

<v-click>

**适合**：

- Java / Kotlin / Android 项目（JetBrains 生态强）
- 已习惯 IDEA 的团队，不想切 VS Code

</v-click>

<v-click>

**注意**：插件版本可能滞后 CLI 几周，新特性（如 1M 上下文）有时晚到。

</v-click>

---
transition: slide-up
---

# Web 版（claude.ai/code）

[claude.ai/code](https://claude.ai/code) —— 浏览器即开即用版

<v-clicks>

**特点**：

- 无需安装
- 与桌面 Claude.ai 共享对话历史
- 支持 GitHub 仓库直连（Pro+）

**限制**：

- 无本地文件 / shell
- MCP 仅支持远程 MCP（Anthropic 托管的少量）
- hooks 不可用
- 自定义 skills 不可用

</v-clicks>

<v-click>

适合 **轻量场景 / 出差 / 不想装本地工具** 时用。日常开发还是 CLI 香。

</v-click>

---
transition: slide-up
---

# Plan Mode：先规划后实施

```bash
claude --plan
```

<v-click>

**plan 模式行为**：

- **只读**：能 Read / Glob / Grep / WebFetch
- **不写**：Edit / Write / Bash 写操作禁用
- **产物**：详细实施计划（含分步、风险、回滚）

</v-click>

<v-click>

**典型工作流**：

```
1. claude --plan --model opus       # Opus 规划
   > 帮我设计 Phase 2 的用户系统
   （Claude 产出 plan.md）

2. 切回 default 模式 + Sonnet
   > 按 plan.md 实施
   （Claude 按步骤改代码）
```

</v-click>

<v-click>

Shift+Tab 也能切到 plan 模式（无需重启）。

</v-click>

---
transition: slide-up
---

# Agent SDK：嵌入自家应用

[Anthropic Agent SDK](https://docs.claude.com/en/api/agent-sdk) 让你的应用嵌入 Claude Code 内核

```python
from claude_agent_sdk import Agent, tool

@tool
def search_db(query: str) -> str:
    return db.query(query)

agent = Agent(
    model="claude-opus-4-7",
    tools=[search_db],
    permission_mode="acceptEdits",
    settings_path="~/.claude/settings.json",  # 复用 Claude Code 配置
)

result = agent.run("帮我查一下昨天注册的用户")

# 多轮
session = agent.session()
session.send("...")
session.send("...")
```

<v-click>

**适合**：自家 CLI / Web 工具集成 / Slack bot / Discord bot / 内部工具自动化。

</v-click>

---
transition: slide-up
---

# 环境变量：CLI 行为控制

| 变量 | 作用 |
| --- | --- |
| `ANTHROPIC_API_KEY` / `ANTHROPIC_BASE_URL` | API key / endpoint |
| `CLAUDE_MODEL` / `CLAUDE_PROJECT_DIR` | 默认模型 / 项目根 |
| `CLAUDE_NO_UPDATE` / `CLAUDE_NO_HOOKS` | 禁用更新提示 / 禁用 hook |
| `CLAUDE_LOG_LEVEL` | debug / info / warn / error |
| `HTTPS_PROXY` / `HTTP_PROXY` | 网络代理 |

<v-click>

`env` 字段在 `settings.json` 中也能注入到 Claude 启动环境，方便 hooks / MCP 拿到。

</v-click>

---
transition: slide-up
---

# vs Codex / Gemini CLI / OpenCode

| 维度 | Claude Code | Codex | Gemini CLI | OpenCode |
| --- | --- | --- | --- | --- |
| 模型 | Opus / Sonnet / Haiku | GPT / o-series | Gemini | 任意（本地） |
| 上下文 | 200K / 1M | 200K | 1M | 取决于模型 |
| Hooks / Skills | ✓ / ✓ | - / - | - / - | ✓ / - |
| MCP | ✓ 一类 | ✓ | ✓ 部分 | ✓ |
| 开源 / 私有部署 | ✗ / Bedrock 等 | ✗ / OpenAI | 部分 / Vertex | ✓ / 任意 |

<v-click>

**怎么选**：需 hook + skill + 1M 上下文 → Claude Code；需开源 + 本地模型 → OpenCode；已重 OpenAI / Google 生态 → Codex / Gemini CLI。

</v-click>

---
transition: slide-up
---

# 实战 1：接手陌生项目

```
> 这是个新仓库我刚 clone。先帮我快速理解：
>   1. 项目用什么技术栈？
>   2. 主要功能有哪些（看 README + 路由 + 主入口）
>   3. 怎么本地起？
```

<v-click>

Claude 会：

- 调 `Read` 看 `package.json` / `README.md` / `tsconfig.json`
- 调 `Glob` 看 `pages/**`、`routes/**`、`src/**` 目录结构
- 调 `Grep` 找 dev / start 脚本

回总结后**自动写 CLAUDE.md 草稿**（如果不存在），下次启动直接复用。

</v-click>

---
transition: slide-up
---

# 实战 2：紧急 hotfix

```
> 线上报错 "Cannot read property 'name' of undefined"
> 在 /api/users/[id] 路由。
> 帮我查根因 + 修复 + 加测试
```

<v-click>

Claude 流程：

1. **Grep** 找路由实现文件
2. **Read** 看代码 + 周边逻辑
3. **Edit** 加空值判断 / optional chain
4. **Read** 看测试目录结构
5. **Write** 加 unit test 复现 + 验证
6. **Bash** 跑测试确认通过
7. 产出 commit 消息 + 总结

</v-click>

<v-click>

整流程 5-10 分钟，比人工断点调试快得多。

</v-click>

---
transition: slide-up
---

# 实战 3：重构

```
> 把 src/utils/format.ts 里的 formatDate 函数重构：
>   1. 支持 i18n（接 locale 参数）
>   2. 抽出常量
>   3. 加 JSDoc
> 现有调用点不能改，保持 API 兼容
```

<v-click>

Claude 流程：

1. **Grep** `formatDate` 找所有调用点（确认现有 API 形状）
2. **Read** 现有实现 + 测试
3. **Edit** 重构（保签名兼容，可选参数加默认值）
4. **Edit** 测试补 i18n 用例
5. **Bash** 跑测试

</v-click>

<v-click>

**经验**：「现有 API 不能改」要明说，否则 Claude 可能改完调用点（多数情况这其实更好，但要事先确认）。

</v-click>

---
transition: slide-up
---

# 实战 4：文档撰写

```
> 给 packages/ui 包写一份 README：
>   1. 安装步骤
>   2. 三个最常用组件的代码示例（看 src/index.ts 导出哪些）
>   3. 链接到 Storybook
```

<v-click>

Claude 流程：

1. **Read** `packages/ui/src/index.ts` 看导出清单
2. **Read** 三个常用组件源码理解 API
3. **Read** `package.json` 看版本 / Storybook 配置
4. **Write** README.md

</v-click>

<v-click>

提示词加约束：「**用中文写 + 示例代码用 TypeScript + 不超过 200 行**」效果最好。

</v-click>

---
transition: slide-up
---

# 实战 5：调试

```
> 我跑 pnpm test:e2e 失败，错误是
> "Cannot find module './fixtures'"
> 帮我查根因
```

<v-click>

Claude 流程：

1. **Bash** 复现错误（拿完整 stack trace）
2. **Read** `cypress.config.ts` / `tsconfig.json`
3. **Glob** 找 `fixtures` 相关文件
4. **Grep** 查 alias 配置
5. 定位通常是 path alias / build 步骤漏
6. **Edit** 修复 + 重跑

</v-click>

<v-click>

调试技巧：**让 Claude 用 `--debug` 启动子命令**，拿到更详细的错误日志。

</v-click>

---
transition: slide-up
---

# 实战 6：Git 工作流

```
> 看看当前 staged 改动，写个合适的 conventional commit message
（Claude 调 git diff + 分析 + 提议消息）

> commit 并 push
（Claude 调 git commit + push）

> 给最近的 commit 开 PR
（Claude 调 gh pr create）
```

<v-click>

> ⚠️ **默认不 push 到 main**
>
> Claude Code 内置 hook 阻止 `git push origin main`（防误操作）。需要时显式说「push 这一次」。

</v-click>

<v-click>

**Conventional Commit 风格** Claude 自动遵循：

```
feat(quiz-backend): 新增 Claude Code 题目（30 道）
fix(quiz-app): 修复历史抽屉滚动不重置
refactor(ui): BaseDialog 拆出 placement 逻辑
```

</v-click>

---
transition: slide-up
---

# 实战 7：多文件协同改动

```
> 把整个 quiz-admin 项目里的 console.log 换成自家 logger
```

<v-click>

Claude 流程：

1. **Grep** `console\.log` 找所有调用（50+ 文件）
2. **TodoWrite** 列出文件清单
3. 批量 spawn **Subagent**（general-purpose）按目录并行改
4. 主线程汇总修改
5. **Bash** 跑 lint + test

</v-click>

<v-click>

**为什么用 subagent**：50 个文件的内容塞主上下文会爆。子代理只返回最终 diff 摘要，主线程上下文压力小。

</v-click>

---
transition: slide-up
---

# 调试 Claude Code 自身

```bash
# 详细日志
claude --debug

# 启动时 dump 配置
claude --print-config

# 跳过 update notifier（CI 用）
CLAUDE_NO_UPDATE=1 claude

# 强制不读 hooks（debug hook 卡死时用）
CLAUDE_NO_HOOKS=1 claude

# 指定 MCP 配置文件
claude --mcp-config ./profile-ci.json

# 仅允许指定工具
claude --allowed-tools "Read,Grep,Glob"

# 禁用指定工具
claude --disallowed-tools "Bash"
```

<v-click>

日志位置：`~/.claude/logs/`，按会话 ID 分目录。

</v-click>

---
transition: slide-up
---

# 性能优化

<v-clicks>

- **大仓库**：用 Opus[1m] 1M 上下文，或先 `/compact` 压缩历史
- **多文件读取慢**：一个 message 多个 Read tool call 并行
- **MCP / hook 拖慢**：禁用不用的 MCP server / 复杂 hook 改异步
- **Prompt cache**：长会话命中 cache 后费用骤降
- **避免无意义 grep**：知文件名直接 Read

</v-clicks>

---
transition: slide-up
---

# 常见错误码

| 现象 | 含义 / 处理 |
| --- | --- |
| `authentication_error` | OAuth 过期 → `/login` |
| `rate_limit_error` | 速率限制 → 切 Sonnet 或等几分钟 |
| `context_length_exceeded` | 上下文满 → `/compact` 或换 1M |
| `tool_use_failed` | 参数错 / 权限拒 |
| `mcp_connection_failed` | MCP server 启动失败 → 终端跑命令看错 |

---
transition: slide-up
---

# 故障排查清单

| 现象 | 排查方向 |
| --- | --- |
| `Authentication failed` | `/login` 重新 OAuth |
| 模型回复总被截断 | `/compact` 或换 1M 上下文 |
| Hook 不触发 | `/hooks` 看配置 / 路径对吗 |
| MCP server 未连接 | 终端跑 server 命令看错 / npx 缓存 |
| Skill 不被识别 | SKILL.md 名字对吗 + 重启 |
| 高 token 用量 | `/cost` 看分布 + 关 1M / 用 Sonnet |
| 后台任务停不掉 | `KillShell` 或 `ps + kill` |

---
transition: slide-up
---

# 安全考量

<v-clicks>

- **bypassPermissions 不要全局开**：陌生 / 公开仓库回到 default
- **CLAUDE.md 是 prompt injection 面**：克隆陌生仓库先看 CLAUDE.md 内容
- **MCP server 是代码执行点**：装 server 前看源码 / 用知名包
- **hook 命令是 shell 注入面**：`$CLAUDE_TOOL_COMMAND` 在 hook 里要 quote
- **credentials 默认 chmod 600**：`~/.config/claude/credentials.json` 别提权
- **token 别 commit**：`.gitignore` 加 `.env*` `credentials.json`
- **deny 规则兜底**：全局加 `Bash(rm -rf:*)` / `Bash(git push --force:*)`

</v-clicks>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 主要变化 |
| --- | --- | --- |
| 1.0 / 1.5 | 2024 | 首个稳定版 / Hooks 引入 |
| 1.8 | 2025 初 | MCP 一类支持 |
| 2.0 | 2025 | Skills / Subagents / Memory 三件套 |
| 2.x | 2025-2026 | 1M 上下文 / IDE 扩展 / Agent SDK GA |

<v-click>

**关键演进**：Hooks 给 power user 可编程性 / MCP 打开外部工具生态 / Skills 用户自带插件 / Memory 跨会话连续性 / Subagents 并行 + 上下文隔离

</v-click>

---
transition: slide-up
---

# 学习路径

<v-clicks>

**Week 1 — 上手**：装 + OAuth + 写 `CLAUDE.md` + 让 Claude 改一个小 bug

**Week 2 — 进阶**：切换模型 / 自定义 slash 命令 / Plan Mode 规划 + Sonnet 实施

**Week 3 — 扩展**：装 1-2 个 MCP server / 写第一个 Hook / 装社区 Skill

**Week 4 — 工作流**：配 permissions + hooks / spawn subagent / 积累 Memory

</v-clicks>

---
transition: slide-up
---

# 资源链接

| 资源 | 链接 |
| --- | --- |
| 官方文档 | [docs.claude.com/en/docs/claude-code](https://docs.claude.com/en/docs/claude-code/overview) |
| GitHub | [anthropics/claude-code](https://github.com/anthropics/claude-code) |
| Agent SDK | [docs.claude.com/en/api/agent-sdk](https://docs.claude.com/en/api/agent-sdk) |
| MCP 协议 | [modelcontextprotocol.io](https://modelcontextprotocol.io/) |
| 社区清单 | [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) |
| Discord / 状态页 | [discord](https://www.anthropic.com/discord) / [status](https://status.anthropic.com/) |

---
layout: center
class: text-center
---

# 总结

把 Claude Code 当 **可编程 Agent** 用，而非聊天框

<div class="mt-6 text-left max-w-2xl mx-auto text-base op-90">

- **基础**：CLAUDE.md + 权限模式 + 模型选择三件套
- **可扩展**：Hooks / Skills / MCP / Subagents 四级机制
- **可观测**：`/cost` 看花费、`/permissions` 看授权、`Monitor` 看后台
- **可移植**：CLI / IDE / Web / SDK 一致体验

</div>

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://docs.claude.com/en/docs/claude-code/overview" target="_blank">docs.claude.com</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/anthropics/claude-code" target="_blank">anthropics/claude-code</a>
</div>
