---
theme: seriph
background: https://cover.sli.dev
title: Welcome to OpenCode
info: |
  Presentation OpenCode for developers.

  Learn more at [https://opencode.ai/](https://opencode.ai/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <carbon:terminal class="text-7xl" />
</div>

<br/>

## OpenCode：开源、模型无关的 AI 编码 Agent

sst 团队出品，MIT 协议；Claude / GPT / Gemini / Llama / DeepSeek 一份 CLI 全打通

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/sst/opencode" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 OpenCode —— sst 团队（SST framework 出品者）开源的 AI 编码 Agent。

最大特点是模型无关：不绑死 Anthropic / OpenAI / Google 任何一家，75+ provider 一键切换。
MIT 开源 + 160K+ stars + 900+ contributors。
-->

---
transition: fade-out
---

# 什么是 OpenCode？

sst 团队开源的 Agent 化编码助手，**模型无关 + 多端体验一致**

<v-clicks>

- **TUI（核心）**：终端 UI，多主题（tokyonight / catppuccin / gruvbox...）
- **CLI（脚本化）**：`opencode run` 非交互执行，可接 CI
- **Web / Desktop**：`opencode web` 启浏览器 UI；桌面 App beta
- **Server**：`opencode serve` 启 HTTP API，远端 attach

</v-clicks>

<br>

<div v-click text-xs>

_Read more about_ [_OpenCode_](https://opencode.ai/docs)

</div>

<style>
h1 {
  background-color: #2EBFD7;
  background-image: linear-gradient(45deg, #2EBFD7 10%, #0F4C5C 90%);
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

# 定位：模型无关的 Agent

不绑 Anthropic / OpenAI / Google，谁家模型都能跑

<v-clicks>

- **Models.dev 接 75+ provider**：Claude / GPT / Gemini / Llama / DeepSeek / Ollama / LM Studio
- **一份配置接所有家**：`auth.json` 存凭据，`/models` 一键切换
- **MIT 开源**：可自托管 / 嵌入自家产品 / 二次开发
- **客户端 / 服务端分离**：本地 TUI + 远端 serve 解耦
- **大陆友好**：DeepSeek / Ollama / 自家代理任意接
- **sst 团队**：SST framework 同班人马，工程素养硬

</v-clicks>

<v-click>

定位关键词：**开源**（MIT）+ **模型无关**（75+ provider）+ **多端**（TUI / CLI / Web / Desktop）。

</v-click>

---
transition: slide-up
---

# 优劣速读

<v-clicks>

**优点**

- MIT 开源 + sst 团队出品，工程质量与生态信任有保障
- 75+ provider，可用任何家模型（含 Ollama / LM Studio 本地）
- 大陆访问极友好（DeepSeek / 智谱 / 月之暗面任意接）
- Plan / Build 两档主代理 + general / explore / scout 子代理
- AGENTS.md 兼容 CLAUDE.md，零成本从 Claude Code 切过来
- MCP 一类支持，本地 stdio + 远程 HTTP MCP 都行
- TUI 颜值与体验业界顶尖（多主题 + leader key + session 分享）

**缺点**

- 生态相对年轻（2025 起爆发），文档比 Claude Code 浅
- 没有 Skills 体系（只有 plugin / command 简化）
- IDE 扩展生态不如 Claude Code / Codex 成熟
- 多 provider 凭据管理略繁琐（每家 base URL + key）

</v-clicks>

---
transition: slide-up
---

# 安装

```bash
# npm 全局装（最通用）
npm install -g opencode-ai

# 或 curl 脚本（自动检测平台）
curl -fsSL https://opencode.ai/install | bash

# 或 macOS brew
brew install sst/tap/opencode

# 或 Arch Linux
yay -S opencode-bin

# Windows scoop
scoop install opencode

# 验证
opencode --version
```

<v-click>

> 💡 **Windows 用户**
>
> 推荐 WSL2 + Ubuntu。原生 Windows 也支持，Scoop / Chocolatey 都行。

</v-click>

---
transition: slide-up
---

# 多 Provider 配置（重点 1/3）

OpenCode 的核心卖点：一份 CLI 接所有家模型

```bash
# TUI 内添加 provider
/connect
```

<v-click>

弹出 75+ provider 选项，常见：

| Provider | 类型 |
| --- | --- |
| `anthropic` / `openai` / `google` | Claude / GPT / Gemini |
| `openrouter` / `ollama` | 100+ 模型聚合 / 本地推理 |
| `deepseek` | 国内可用 + 性价比高 |
| `azure` / `bedrock` / `vertex` | 企业云 |

凭据存 `~/.local/share/opencode/auth.json`（不 commit）。

</v-click>

---
transition: slide-up
---

# 多 Provider 配置（重点 2/3）

`opencode.json` 显式配 provider（用于自定义 baseURL / 自建）

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "deepseek": {
      "options": { "baseURL": "https://api.deepseek.com/v1" }
    },
    "my-corp-llm": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "https://llm.mycorp.com/v1",
        "headers": { "X-Org": "team-a" }
      },
      "models": {
        "gpt-4o-equivalent": { "name": "Corp Internal" }
      }
    }
  }
}
```

<v-click>

> 💡 任何 OpenAI 兼容 API（智谱 / Kimi / 阶跃星辰 / 自建 vLLM）都能走 `@ai-sdk/openai-compatible`，填 baseURL 就接好。

</v-click>

---
transition: slide-up
---

# 多 Provider 配置（重点 3/3）

环境变量插值，凭据从 env 取

```json
{
  "provider": {
    "anthropic": {
      "options": { "apiKey": "{env:ANTHROPIC_API_KEY}" }
    },
    "deepseek": {
      "options": { "apiKey": "{env:DEEPSEEK_API_KEY}" }
    }
  }
}
```

<v-click>

`{env:VAR}` 在所有字段可用，方便 CI / 团队共享配置：

```bash
ANTHROPIC_API_KEY=sk-ant-... \
DEEPSEEK_API_KEY=sk-... \
  opencode
```

</v-click>

<v-click>

`{file:path}` 也支持——读文件内容当字段值。适合 `instructions` 引用长规则文档。

</v-click>

---
transition: slide-up
---

# 模型切换

```bash
# TUI 内
/models
```

<v-click>

模型格式 **`provider/model`**：

| 模型 ID | 用途 |
| --- | --- |
| `anthropic/claude-opus-4-7` | 复杂规划 / 大重构 |
| `anthropic/claude-sonnet-4-6` | 日常编码 |
| `deepseek/deepseek-v3` | 国内 + 便宜 |
| `ollama/llama-3.3-70b` | 完全离线 |

```bash
opencode --model anthropic/claude-sonnet-4-6
```

</v-click>

---
transition: slide-up
---

# small_model：省钱关键

`opencode.json` 配两档模型——主任务一个，轻任务一个

```json
{
  "model": "anthropic/claude-sonnet-4-6",
  "small_model": "anthropic/claude-haiku-4-5"
}
```

<v-click>

- `model`：主推理（写代码 / 规划 / 调试）
- `small_model`：轻任务（生成会话标题、总结、补全）

</v-click>

<v-click>

**为什么省**：每次会话 OpenCode 自动跑很多「附加任务」（标题生成 / 历史压缩 / context 整理），这些用 Haiku / DeepSeek 等便宜模型完成，主任务才用 Sonnet / Opus。

</v-click>

<v-click>

跨家也行：主 Anthropic 旗舰，小任务用 DeepSeek 顶上，混搭最香。

</v-click>

---
transition: slide-up
---

# TUI 模式：默认体验

```bash
cd ~/projects/my-app
opencode
```

```
┌─ opencode ──────────────────────────────────┐
│  cwd: ~/projects/my-app                     │
│  agent: build  |  model: sonnet-4-6         │
├─────────────────────────────────────────────┤
│                                             │
│  > 帮我看看 src/index.ts 里的 main 函数      │
│                                             │
└─────────────────────────────────────────────┘
```

<v-click>

OpenCode 会：

1. 调 `read` 工具读 `src/index.ts`
2. 分析后回复
3. 所有 tool 调用 / 结果都展示在屏幕上

</v-click>

<v-click>

**多 session 并行**：同项目能跑多个 session，TUI 顶栏切，互不打扰。

</v-click>

---
transition: slide-up
---

# CLI 模式：脚本化

非交互场景（CI / 自动化）用 `run` 子命令

```bash
# 单次问答
opencode run "解释一下闭包"

# 指定模型 + JSON 输出（CI 友好）
opencode run --model deepseek/deepseek-v3 \
  --format json "总结 README.md"

# 继续上次会话
opencode run --continue "再补一段例子"

# 列 / 导出 session
opencode session list
opencode session export <id> > out.json
```

<v-click>

**服务化**：

```bash
opencode serve --port 8080 --password secret
# 启 HTTP API server，外部脚本可调

opencode web   # 浏览器 UI
opencode attach <url>   # 接远端实例
```

</v-click>

---
transition: slide-up
---

# AGENTS.md：项目说明书

OpenCode 启动时自动读项目根目录 `AGENTS.md`（兼容 `CLAUDE.md`）

```md
# 项目约定

## 技术栈

Vue 3 + Vite + TS 的电商前台

## 代码规范

- 注释用中文（函数加 JSDoc）
- 偏好 SCSS + UnoCSS @apply

## 常用命令

- `pnpm dev` / `pnpm test` / `pnpm lint:fix`
```

<v-click>

`/init` 扫 README / package.json / 路由 / 测试目录，自动起草 `AGENTS.md`。

> 💡 查找顺序：`AGENTS.md` → `CLAUDE.md` + `~/.config/opencode/AGENTS.md`。Claude Code 项目零成本切。

</v-click>

---
transition: slide-up
---

# 配置文件位置

| 路径 | 作用 |
| --- | --- |
| `~/.config/opencode/opencode.json` | 用户全局 |
| `<project>/opencode.json` | 项目共享（优先级更高） |
| Managed settings | admin 强制（最高） |

<v-click>

| 文件 | 作用 |
| --- | --- |
| `auth.json` | provider 凭据（`~/.local/share/opencode/`） |
| `tui.json` / `AGENTS.md` | 主题 / 项目说明书 |
| `.opencode/{commands,agents}/` | 自定义命令 / agent |

**合并而非替换**——多层配置字段累加，特定字段后者覆盖前者。

</v-click>

---
transition: slide-up
---

# Modes：Plan vs Build

按 `Tab` 在两档主代理切换

<v-clicks>

| Agent | 行为 |
| --- | --- |
| **Build**（默认） | 全权限——可改文件 / 跑 bash / 调外部工具 |
| **Plan** | 只读——能读 / 搜索 / 抓网页，但不动文件 |

</v-clicks>

<v-click>

**典型工作流**：

```
1. Plan 模式 + Opus 规划
   > 帮我设计 Phase 2 用户系统
   （OpenCode 产出详细方案，不动文件）

2. Tab 切 Build + Sonnet 实施
   > 按方案改代码
   （OpenCode 按步骤动手）
```

</v-click>

<v-click>

> 💡 **Plan 模式禁了什么**
>
> Plan 把 edit / write / bash（写命令）等工具 deny 掉，但 read / glob / grep / webfetch 仍可用。所以分析 + 检索 + 提议代码段都没问题。

</v-click>

---
transition: slide-up
---

# Subagents：子代理

OpenCode 主代理（Plan / Build）可调用**子代理**做独立子任务

| 子代理 | 工具 | 用途 |
| --- | --- | --- |
| `general` | 全 | 多步任务 |
| `explore` | 只读 | 大范围搜索 |
| `scout` | 只读 + webfetch | 依赖 / 文档调研 |

<v-click>

```
> 用 @explore 帮我找出所有 useUser 调用点
> 然后 @scout 看看 react-query v5 的迁移指南
```

**关键属性**：主线程只看最终报告（不污染上下文）、工具子集、失败可独立重试、适合并行 / 大搜索。

</v-click>

---
transition: slide-up
---

# 自定义 Agent（1/2）

`.opencode/agents/<name>.md`：

```md
---
description: TypeScript bug hunter for type narrowing issues
tools:
  read: allow
  grep: allow
  glob: allow
  edit: deny
  bash: deny
model: anthropic/claude-opus-4-7
temperature: 0.2
max_steps: 30
---

You are an expert TypeScript bug hunter. Focus on:

- Type narrowing issues
- Generic constraint problems
- Missing as const / satisfies
- Discriminated union exhaustiveness

Output: { file, line, issue, suggested fix }
```

---
transition: slide-up
---

# 自定义 Agent（2/2）

字段一览：

| 字段 | 说明 |
| --- | --- |
| `description` | 何时调用 |
| `model` / `small_model` | 模型覆盖 |
| `temperature` / `max_steps` | 温度 / 最大步数 |
| `tools` | 工具权限（object） |
| `mcp` | 允许的 MCP server（string[]） |
| `prompt` | 系统提示（也可写在 body） |

<v-click>

调用：`@bug-hunter 帮我...`。也可在 `opencode.json` 的 `agent` 字段内联，不必单独建文件。

</v-click>

---
transition: slide-up
---

# 内置工具（1/2）

| 工具 | 用途 |
| --- | --- |
| `read` / `write` | 读文件 / 写整个文件 |
| `edit` / `apply_patch` | 精确替换 / 应用 patch |
| `bash` | shell 命令（支持后台） |
| `glob` / `grep` | 文件名匹配 / 全文搜索（ripgrep） |
| `lsp` | LSP 集成（experimental） |

<v-click>

> 💡 **lsp 工具是亮点**：自动启动语言服务器（tsserver / gopls / rust-analyzer），LLM 可调「找引用」「跳定义」「重命名」。比 grep 精准但启动慢。

</v-click>

---
transition: slide-up
---

# 内置工具（2/2）

| 工具 | 用途 |
| --- | --- |
| `webfetch` / `websearch` | 抓 URL / Web 搜索（Exa AI） |
| `todowrite` | 任务清单 |
| `question` | 交互式问用户 |
| `task` | spawn 子代理 |

<v-click>

工具权限三档：`allow`（自动执行）/ `ask`（询问用户）/ `deny`（拒绝）。

`.env` 默认 `deny` 读取（安全），其他工具默认 `allow`（信任本地仓库）。

</v-click>

---
transition: slide-up
---

# 权限系统（1/2）

OpenCode 权限粒度比 Claude Code 更细——每工具单配

```json
{
  "permission": {
    "*": "ask",
    "read": "allow",
    "glob": "allow",
    "grep": "allow",
    "edit": "ask",
    "bash": {
      "*": "ask",
      "git status*": "allow",
      "git diff*": "allow",
      "pnpm *": "allow",
      "rm -rf*": "deny",
      "git push --force*": "deny"
    },
    "webfetch": "allow"
  }
}
```

<v-click>

bash 用 **glob 模式**匹配命令前缀。

</v-click>

---
transition: slide-up
---

# 权限系统（2/2）

**最后匹配获胜** —— 通配规则放前面，特定规则放后面

```json
{
  "bash": { "*": "ask", "git *": "allow", "rm -rf*": "deny" }
}
```

<v-click>

**Per-agent 权限**（覆盖全局）：

```json
{
  "agent": {
    "code-reviewer": {
      "tools": { "edit": "deny", "write": "deny", "bash": "deny" }
    }
  }
}
```

`code-reviewer` 永远只读，即使主代理 Build 模式启动它。

> ⚠️ 生产 / 共享机器建议改 `"*": "ask"` + 白名单。

</v-click>

---
transition: slide-up
---

# 自定义命令（1/2）

`.opencode/commands/<name>.md`：

```md
---
description: Run tests with coverage
agent: build
model: anthropic/claude-sonnet-4-6
---

跑完整测试并显示覆盖率报告，列出所有失败。
```

<v-click>

TUI 内 `/test` 触发。

字段：`description`（`/help` 显示）/ `agent`（用哪个 agent 跑）/ `model`（覆盖）/ `template`（可写在 frontmatter）。

</v-click>

---
transition: slide-up
---

# 自定义命令（2/2）

动态内容占位符：`$ARGUMENTS`（全部参数）/ `$1` `$2`（位置参数）/ `` !`cmd` ``（注入 bash 输出）/ `@filename`（引用文件）

```md
---
description: Lint a specific file
---

对 $ARGUMENTS 跑 lint，并修复可自动修复的问题。

参考当前 git 状态： !`git status --short`

参考规则： @docs/lint-rules.md
```

<v-click>

```
/lint src/utils/format.ts
```

</v-click>

---
transition: slide-up
---

# MCP 配置

OpenCode 一类支持 MCP，配在 `opencode.json` 的 `mcp` 字段

```json
{
  "mcp": {
    "context7": {
      "type": "local",
      "command": ["npx", "-y", "@upstash/context7-mcp"]
    },
    "github": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-github"],
      "environment": { "GITHUB_TOKEN": "{env:GITHUB_TOKEN}" }
    },
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/sse",
      "headers": { "Authorization": "Bearer {env:SENTRY_TOKEN}" }
    }
  }
}
```

<v-click>

**两类**：`type: "local"`（本地 stdio 进程）/ `type: "remote"`（远程 HTTP MCP，OAuth 自动处理）。

</v-click>

---
transition: slide-up
---

# MCP：Per-agent 启用

可把指定 MCP server 给某 agent，避免无关 tool 污染上下文

```json
{
  "agent": {
    "research-agent": {
      "mcp": ["context7", "scout"]
    },
    "github-bot": {
      "mcp": ["github"]
    }
  }
}
```

<v-click>

> ⚠️ **MCP 加进上下文要谨慎**
>
> `@modelcontextprotocol/server-github` 暴露 100+ tool，token 消耗大。原则：「**装少而精**」+ 按需开。

</v-click>

<v-click>

**常用 MCP server**：context7（文档）/ github / chrome-devtools / sentry / grep-vercel / filesystem-server。

</v-click>

---
transition: slide-up
---

# 主题与键位

```bash
# TUI 内
/theme
```

<v-click>

内置主题：`opencode`（默认）/ `tokyonight` / `everforest` / `catppuccin` / `gruvbox` / `nord` / `system`。

`tui.json` 配置：

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "theme": "tokyonight",
  "leader": "ctrl+x",
  "leader_timeout": 2000,
  "keybinds": {
    "session_new": "ctrl+x n",
    "session_list": "ctrl+x s",
    "model_select": "ctrl+x m"
  }
}
```

</v-click>

<v-click>

**leader key 机制**：避免与终端冲突。先按 `Ctrl+X`，再按操作键。

</v-click>

---
transition: slide-up
---

# Session 管理

```bash
# 列出 / 查看 / 导出 / 导入
opencode session list
opencode session show <id>
opencode session export <id> > out.json
opencode session import < out.json

# CLI 继续上次
opencode --continue
opencode --continue "再补一段例子"
```

<v-click>

**Share 链接**（TUI 内）：

```
/share
```

生成可读链接（含完整对话历史 + tool 调用）—— 适合：

- 让队友看你做了啥
- 给作者复现 bug
- 教学 / Demo

</v-click>

---
transition: slide-up
---

# vs Claude Code / Codex / Gemini CLI（重点 1/2）

| 维度 | OpenCode | Claude Code | Codex CLI | Gemini CLI |
| --- | --- | --- | --- | --- |
| 模型 | **75+ provider** | Anthropic | OpenAI | Google |
| 开源 | **✓ MIT** | ✗ | ✓ Apache-2.0 | 部分 |
| 中国可用 | **极友好** | 需网络 | 需网络 | 需网络 |

<v-click>

| 维度 | OpenCode | Claude Code | Codex CLI | Gemini CLI |
| --- | --- | --- | --- | --- |
| Skills / Hooks | 简化 | ✓ | ✓ | 受限 |
| Subagents | ✓ | ✓ | ✓ | ✗ |
| LSP / Session 分享 | **✓** | ✗ | ✗ | ✗ |

</v-click>

---
transition: slide-up
---

# vs Claude Code / Codex / Gemini CLI（重点 2/2）

怎么选？三句话决策

<v-clicks>

- **想用任意模型（含本地）+ 中国大陆** → **OpenCode**
- **重度 Anthropic 用户 + 要 Skill / Hook / Memory** → Claude Code
- **重度 OpenAI 用户 + 要 sandbox 细粒度** → Codex CLI
- **重度 Google 用户 + 要 1M Gemini** → Gemini CLI

</v-clicks>

<v-click>

> 💡 **多家混搭最爽**
>
> 装 Claude Code 用 Anthropic 自家模型，装 OpenCode 用 DeepSeek / Ollama。一个项目两种工具并存。

</v-click>

<v-click>

OpenCode 的开源属性也意味着——**自己改源码 / 二次开发** 是合法路径。

</v-click>

---
transition: slide-up
---

# 大陆访问优势（重点）

OpenCode 是大陆**最容易跑起来**的 Agent CLI

<v-clicks>

```bash
# 方案 1：DeepSeek 直连（国内可用 + 便宜）
/connect
> deepseek
> [填 API key]
/models
> deepseek/deepseek-v3
```

```bash
# 方案 2：Ollama 本地（完全离线，无需网络）
ollama pull llama-3.3-70b
/connect
> ollama
> baseURL: http://localhost:11434
/models
> ollama/llama-3.3-70b
```

```bash
# 方案 3：自家公司的 OpenAI 兼容代理
/connect
> Other
> baseURL: https://llm.mycorp.com/v1
> model: gpt-4o
```

</v-clicks>

---
transition: slide-up
---

# 大陆混搭：实战配置

`opencode.json` 同时配多家，按需切

```json
{
  "model": "deepseek/deepseek-v3",
  "small_model": "deepseek/deepseek-coder",
  "provider": {
    "deepseek": {
      "options": { "apiKey": "{env:DEEPSEEK_API_KEY}" }
    },
    "ollama": {
      "options": { "baseURL": "http://localhost:11434" }
    },
    "zhipu": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "https://open.bigmodel.cn/api/paas/v4",
        "apiKey": "{env:ZHIPU_API_KEY}"
      },
      "models": { "glm-4.5": { "name": "智谱 GLM-4.5" } }
    }
  }
}
```

<v-click>

日常 DeepSeek，离线切 Ollama，复杂任务切智谱 GLM-4.5——一份配置全打通。

</v-click>

---
transition: slide-up
---

# Slash 命令完整列表

| 命令 | 作用 |
| --- | --- |
| `/help` / `/connect` | 帮助 / 添加 provider |
| `/models` / `/init` | 选模型 / 生成 AGENTS.md |
| `/undo` / `/redo` | 撤销 / 重做改动 |
| `/share` / `/theme` | 分享会话 / 切主题 |
| `/<custom>` | 用户 / 项目自定义命令 |
| `@<file>` | 引用文件加进上下文 |

---
transition: slide-up
---

# CLI flag 速查

| Flag | 说明 |
| --- | --- |
| `-c, --continue` | 继续上次 session |
| `-m, --model <provider/model>` | 指定模型 |
| `--agent <name>` | 指定 agent |
| `--config <path>` / `--format <text|json>` | 配置文件 / 输出格式 |
| `--debug` / `--print-config` | 详细日志 / 输出当前配置 |
| `--no-lsp` | 禁用 lsp |
| `--port <n>` / `--password <pwd>` | serve 端口 / 鉴权 |

---
transition: slide-up
---

# 环境变量

| 变量 | 作用 |
| --- | --- |
| `OPENCODE_CONFIG` | 指定配置文件 |
| `OPENCODE_SERVER_PASSWORD` | serve 模式鉴权 |
| `OPENCODE_EXPERIMENTAL_DISABLE_WATCHER` | 1 禁用文件 watcher |
| `OPENCODE_EXPERIMENTAL_DISABLE_LSP` | 1 禁用 LSP |
| `OPENCODE_LOG_LEVEL` | debug / info / warn / error |
| `ANTHROPIC_API_KEY` 等 | provider 凭据（替代 auth.json） |
| `HTTPS_PROXY` / `HTTP_PROXY` | 网络代理 |

<v-click>

env 变量可在 `opencode.json` 内用 `{env:NAME}` 插值，方便 CI / 团队共享。

</v-click>

---
transition: slide-up
---

# Plugin 与 instructions

`opencode.json` 还有两个扩展字段

```json
{
  "plugin": [
    "@some-npm-package/opencode-plugin",
    "./plugins/local-plugin.js"
  ],
  "instructions": [
    "docs/team-rules.md",
    "packages/*/AGENTS.md",
    "https://example.com/global-rules.md"
  ]
}
```

<v-click>

**plugin**：加载来自 npm 或本地的插件——可注册自定义工具 / hook / agent。生态尚年轻。

</v-click>

<v-click>

**instructions**：引用规则文件（本地路径 / glob / 远程 URL），自动合进系统提示。比写在 AGENTS.md 里更模块化。

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

OpenCode 流程：

- `read` 看 `package.json` / `README.md` / `tsconfig.json`
- `glob` 看 `pages/**`、`routes/**`、`src/**` 目录结构
- `grep` 找 dev / start 脚本
- 自动写 `AGENTS.md` 草稿（如果不存在）

</v-click>

<v-click>

`@explore` 子代理这步特别快——它只读，几十文件一气搜完不污染主上下文。

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

OpenCode 流程：

1. **grep** 找路由实现文件
2. **read** 看代码 + 周边逻辑
3. **edit** 加空值判断 / optional chain
4. **read** 看测试目录结构
5. **write** 加 unit test 复现 + 验证
6. **bash** 跑测试确认通过
7. 产出 commit 消息 + 总结

</v-click>

<v-click>

整流程 5-10 分钟，比人工断点调试快得多。Plan 模式可先规划再切 Build 实施。

</v-click>

---
transition: slide-up
---

# 实战 3：多文件协同改动

```
> 把整个 quiz-admin 项目里的 console.log 换成自家 logger
```

<v-click>

OpenCode 流程：

1. **grep** 找所有 console.log（50+ 文件）
2. **todowrite** 列出文件清单
3. 批量调 **@general** 子代理按目录并行改
4. 主线程汇总修改
5. **bash** 跑 lint + test

</v-click>

<v-click>

**为什么用子代理**：50 个文件的内容塞主上下文会爆。子代理只返回最终 diff 摘要，主线程上下文压力小。

</v-click>

<v-click>

`/undo` 一键回滚——OpenCode 自动 snapshot 改动前状态。

</v-click>

---
transition: slide-up
---

# 调试 OpenCode 自身

```bash
# 详细日志
opencode --debug

# dump 配置
opencode --print-config

# 临时禁用 LSP
opencode --no-lsp

# 禁用文件 watcher
OPENCODE_EXPERIMENTAL_DISABLE_WATCHER=1 opencode

# 强制走自定义配置
OPENCODE_CONFIG=./profiles/ci.json opencode
```

<v-click>

日志位置：`~/.local/share/opencode/logs/`。

</v-click>

<v-click>

`opencode --print-config` 列出**完整合并后**的配置——多层 config 合完后到底长啥样，一目了然。

</v-click>

---
transition: slide-up
---

# 性能优化

<v-clicks>

- **`small_model` 必配**：标题 / 总结用便宜模型，主任务用 Sonnet
- **MCP 装少**：每个 MCP server 占上下文，按需启
- **lsp 关闭**：experimental 阶段偶尔慢，复杂仓库可临时 `--no-lsp`
- **plan 模式规划**：复杂任务先 Plan 出方案，再 Build 实施
- **subagent 跑大搜索**：`@explore` 几十文件搜索后只返回结果
- **多 provider 备份**：限流时切 OpenRouter 或本地 Ollama 顶上
- **变量插值**：凭据用 `{env:VAR}` 走环境变量，方便切换

</v-clicks>

---
transition: slide-up
---

# 故障排查清单

| 现象 | 排查 |
| --- | --- |
| `/connect` 后没出现 provider | 检查 `auth.json` 写入了吗 |
| 模型选不到 | `/models` 看 provider 是否连通 |
| MCP server 红色未连接 | 终端跑 `command + args` 看 stderr |
| AGENTS.md 不生效 | 路径在项目根吗 + 重启 opencode |
| Plan 模式仍在改文件 | 确认顶栏 agent 显示 `plan` 而非 `build` |
| 大陆连不上 OpenAI / 限流 | 换 OpenRouter / DeepSeek / Ollama |

---
transition: slide-up
---

# 安全考量

<v-clicks>

- **auth.json 别 commit**：默认在 `~/.local/share/opencode/auth.json`（chmod 600）
- **AGENTS.md 是 prompt injection 面**：克隆陌生仓库先看内容
- **MCP server 是代码执行点**：装前看源码 / 用知名包
- **bash 全开很危险**：生产 / 共享机器改 `"*": "ask"` + 白名单
- **远程 MCP token 用变量**：`{env:...}` 而非硬编码
- **.env 默认 deny 读取**：保持默认，不要轻易改
- **doom_loop / external_directory 默认 ask**：防 agent 自循环 / 跨目录访问

</v-clicks>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 主要变化 |
| --- | --- | --- |
| 1.0 | 2025 中 | TypeScript 重写 / Models.dev 接入 |
| 1.5 | 2025 末 | MCP 一类支持 / Plan-Build agent |
| 2.0 | 2026 初 | Subagents 内置 / OpenCode Zen 上线 |
| 2.x | 2026 | Session 分享 / 桌面 App beta / Web UI |

<v-click>

**关键演进**：Models.dev（75+ provider）、AGENTS.md（兼容 Claude Code）、Plan/Build、Subagents、`/share`（业内首创）。

</v-click>

---
transition: slide-up
---

# 学习路径

<v-clicks>

**Week 1 — 上手**

- 装 + `/connect` 加 provider + 第一次对话
- 写 `AGENTS.md`（或从已有 `CLAUDE.md` 复制）

**Week 2 — 多 Provider 玩**

- 加 DeepSeek / Ollama 凭据 + 配 `small_model` 省钱
- 切 Plan 模式规划，再 Build 实施

**Week 3 — 扩展**

- 装 1-2 个 MCP server（context7 等）
- 写第一个自定义命令 / agent

**Week 4 — 工作流**

- 配 permissions / 多 provider + `@explore` / `/share`

</v-clicks>

---
transition: slide-up
---

# 资源链接

| 资源 | 链接 |
| --- | --- |
| 官方文档 | [opencode.ai/docs](https://opencode.ai/docs) |
| GitHub | [sst/opencode](https://github.com/sst/opencode) |
| 模型注册表 | [Models.dev](https://models.dev/) |
| OpenCode Zen | [opencode.ai/zen](https://opencode.ai/zen) |
| MCP 协议 | [modelcontextprotocol.io](https://modelcontextprotocol.io/) |
| SST 团队 | [sst.dev](https://sst.dev/) |
| 状态页 | [opencode.ai/status](https://opencode.ai/status) |

---
layout: center
class: text-center
---

# 总结

把 OpenCode 当 **开源 + 模型无关的 Agent 平台** 用，而非 Anthropic / OpenAI 的复刻

<div class="mt-6 text-left max-w-2xl mx-auto text-base op-90">

- **基础**：AGENTS.md + 多 provider auth.json + Plan/Build 三件套
- **扩展**：自定义 agent / 自定义命令 / MCP / Plugin 四级机制
- **可观测**：`/share` 看会话、`--print-config` 看配置、logs/ 看日志
- **大陆友好**：DeepSeek / Ollama / 智谱 任意接，离线也能跑

</div>

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://opencode.ai/" target="_blank">opencode.ai</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/sst/opencode" target="_blank">sst/opencode</a>
</div>
