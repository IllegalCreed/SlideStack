---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Gemini CLI
info: |
  Presentation Gemini CLI for developers.

  Learn more at [https://github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:google-gemini class="text-7xl" />
</div>

<br/>

## Gemini CLI：Google 官方开源编码 Agent

Vibe code from your terminal —— Gemini 模型 + 1M 上下文 + 业界最慷慨免费额度

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/google-gemini/gemini-cli" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Gemini CLI —— Google 2025 推出的开源 AI 编码 Agent，Apache 2.0 协议，跟 Claude Code / Codex 一档定位。

最大卖点：开源 + 免费额度（OAuth 1000 RPD 含 Gemini 3 Pro + 1M 上下文）。
-->

---
transition: fade-out
---

# 什么是 Gemini CLI？

Google 官方 + 开源（Apache 2.0）的 Agent 化编码助手

<v-clicks>

- **CLI（核心）**：装一行命令，终端跑 Agent
- **IDE 集成**：VS Code / JetBrains / Zed
- **GitHub Action**：在 PR / Issue 里 `@gemini` 触发
- **Headless 模式**：`-p` flag 单次执行，适合 CI

</v-clicks>

<br>

<div v-click text-xs>

_Read more about_ [_Gemini CLI_](https://github.com/google-gemini/gemini-cli)

</div>

<style>
h1 {
  background-color: #4285F4;
  background-image: linear-gradient(45deg, #4285F4 10%, #34A853 90%);
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

# 定位：Google 的开源回应

不是聊天框，是会读写文件 + 跑命令 + 联网搜索的 Agent

<v-clicks>

- **完全开源**：Apache 2.0，可二次开发 / 自部署 / 审计代码
- **1M 上下文标配**：Gemini 2.5+ / 3 全系，整本中型仓库直接塞
- **Google Search Grounding**：联网搜索自带 citation
- **业界最慷慨免费额度**：OAuth 1000 RPD + 60 RPM
- **生态完整**：MCP + Hooks + Skills + Extensions + Subagents + Checkpointing
- **多种部署**：CLI + IDE + GitHub Action + 沙箱镜像

</v-clicks>

<v-click>

定位关键词：**开源**（Apache 2.0）+ **免费**（最慷慨额度）+ **联网**（Google Search 内建）+ **大上下文**（1M）。

</v-click>

---
transition: slide-up
---

# 优劣速读

<v-clicks>

**优点**

- 完全开源（Apache 2.0），可 fork / 审计 / 自部署
- 1M 上下文标配，无需额外付费
- OAuth 免费 60 RPM + 1000 RPD（含 Gemini 3 Pro）
- 内置 Google Search grounding（带 citation）
- 11 个 hook 事件 + Skills + Extensions 一应俱全
- 沙箱（Docker / Podman / macOS Seatbelt）原生支持

**缺点**

- 国内访问需自备网络（Google API 不可达）
- 官方文档结构较散，版本演进快
- Skills 生态成熟度落后 Claude Code 一截
- Workspace / 学校账号需绑 GCP project
- YOLO 模式安全风险同样需谨慎

</v-clicks>

---
transition: slide-up
---

# 安装

```bash
# npm 全局装（最常用）
npm install -g @google/gemini-cli

# 或不安装直接试用
npx https://github.com/google-gemini/gemini-cli

# 或 macOS brew
brew install gemini-cli

# 或 MacPorts
sudo port install gemini-cli

# 验证
gemini --version    # 0.42.x
gemini -h           # 列 flag
```

<v-click>

**Node 版本要求**：Node 20.0.0+，推荐 22 LTS。

</v-click>

<v-click>

**Docker 沙箱镜像**：`us-docker.pkg.dev/gemini-code-dev/gemini-cli/sandbox`，CLI 用 `--sandbox` 自动拉。

</v-click>

---
transition: slide-up
---

# 免费额度：业界最慷慨

| 认证方式 | 免费额度 | 模型 | 上下文 |
| --- | --- | --- | --- |
| **Google OAuth**（个人） | **60 RPM + 1000 RPD** | Gemini 3 Pro | 1M |
| **Gemini API Key** | 1000 RPD | Gemini 全系 | 1M |
| Vertex AI（企业） | 按 GCP 账单 | Gemini 全系 | 1M |

<v-click>

```bash
# OAuth（推荐）
gemini
# 首次：浏览器跳 Google 授权

# API Key（CI / 脚本）
export GEMINI_API_KEY="from-aistudio.google.com/apikey"
gemini
```

</v-click>

<v-click>

> 💡 **对比**
>
> - Claude Code：无免费额度（按订阅 / token 计费）
> - Codex：无免费额度
> - **Gemini CLI：1000 次 / 天免费，含 1M 上下文 Gemini 3 Pro**

</v-click>

---
transition: slide-up
---

# 认证四种方式

```bash
# 1. Google OAuth（推荐个人）
gemini
# 浏览器跳转 → 凭据写入 ~/.gemini/credentials/

# 2. Gemini API Key（脚本 / CI）
export GEMINI_API_KEY="..."
gemini

# 3. Vertex AI（GCP 企业）
export GOOGLE_GENAI_USE_VERTEXAI=true
export GOOGLE_CLOUD_PROJECT="my-project"
export GOOGLE_CLOUD_LOCATION="us-central1"
gcloud auth application-default login
gemini

# 4. Workspace / 学校账号
# 需要先在 GCP Console 建 project
export GOOGLE_CLOUD_PROJECT="<project-id>"
gemini
```

<v-click>

切换认证：`/auth`。当前账号：`/about`。

</v-click>

---
transition: slide-up
---

# 模型选择：Gemini 全系

| 模型 ID | 上下文 | 适合 |
| --- | --- | --- |
| `gemini-3-pro-preview` | 1M | 旗舰，复杂规划 |
| `gemini-3-flash-preview` | 1M | 速度优先 |
| `gemini-2.5-pro` | 1M | 稳定版 Pro |
| `gemini-2.5-flash` | 1M | 速度 + 价格平衡 |
| `gemini-2.5-flash-lite` | 1M | 最轻量 |
| `auto` | - | 自动路由（默认） |

```bash
gemini --model gemini-3-pro-preview
gemini -m gemini-2.5-flash

/model              # 交互里切
```

<v-click>

**默认 `auto`**：让 CLI 按任务自动选模型，省心。Plan Mode 还会自动「规划 Pro / 实施 Flash」切换。

</v-click>

---
transition: slide-up
---

# 1M 上下文：默认配置

Gemini 2.5+ / 3 全系标配 **1,048,576 token** 上下文窗口

<v-clicks>

**意味着**：

- 整本中型仓库（100+ 文件）一次性塞进去
- 长会话不必频繁 `/compress`
- 大规模重构（30+ 文件统一改风格）一次过
- 跨文件协同改动（找所有 console.log 替换）不分批

**对比**：

- Claude Code：默认 200K，1M 要选 `claude-opus-4-7[1m]`（价格翻倍）
- Codex：默认 200K
- **Gemini CLI：1M 是默认值，免费用户也享**

</v-clicks>

<v-click>

`/stats` 实时看当前 context 占用百分比。

</v-click>

---
transition: slide-up
---

# 第一次对话

```bash
cd ~/projects/my-app
gemini
```

```
╭──────────────────────────────────────╮
│  Gemini CLI  v0.42.0                 │
│  cwd: ~/projects/my-app              │
│  model: gemini-3-pro-preview (auto)  │
│  context: 0 / 1,048,576 tokens       │
╰──────────────────────────────────────╯

> 帮我看看 src/index.ts 文件里的 main 函数
```

<v-click>

Gemini 会：

1. 调 `read_file` 读 `src/index.ts`
2. 分析后回复说明
3. **所有 tool 调用都留在屏幕**，可随时打断纠正

</v-click>

---
transition: slide-up
---

# 项目说明书：GEMINI.md

Gemini CLI 启动时**自动三级层次加载**：

| 层 | 路径 | 范围 |
| --- | --- | --- |
| 1 | `~/.gemini/GEMINI.md` | 全局（所有项目） |
| 2 | 项目根 + 上溯到 `.git` | Workspace |
| 3 | 子目录（最多 200 个） | Just-in-time |

```md
# AI 开发指南

## 项目概述
本仓库是 Vue 3 + Vite + TS 的电商前台...

## 代码规范
- 注释用中文
- 组件 PascalCase

## 常用命令
- `pnpm dev`：启动 dev server
- `pnpm test`：单元测试

@docs/style-guide.md
@docs/architecture.md
```

<v-click>

`@<path>` 支持模块化 import，拆分大型 GEMINI.md。

</v-click>

---
transition: slide-up
---

# GEMINI.md 管理

```bash
# 看当前加载了哪些 GEMINI.md
/memory show

# 重新扫描（改了 GEMINI.md 后）
/memory refresh
```

<v-clicks>

**自定义文件名**：

```json
{
  "context": {
    "fileName": ["GEMINI.md", "AGENTS.md"],
    "memoryBoundaryMarkers": [".git", ".hg"]
  }
}
```

支持数组 → 同时认 `GEMINI.md` 和 `AGENTS.md`（兼容其它工具约定）。

</v-clicks>

<v-click>

> 💡 **快速生成 GEMINI.md 骨架**
>
> `/init` 让 Gemini 扫 README / package.json 自动起草。

</v-click>

---
transition: slide-up
---

# 三种 + 一种权限审批模式

按 `Shift+Tab` 在四种模式间循环

<v-clicks>

| 模式 | 行为 |
| --- | --- |
| `default` | 每次写操作（write_file / replace / shell）都询问 |
| `auto_edit` | 自动接受文件编辑；shell 仍询问 |
| `yolo` | 全部自动（**仅本地受信任沙箱** + 警惕用） |
| `plan` | 仅读不写，规划阶段用 |

</v-clicks>

<v-click>

```bash
gemini --approval-mode=auto_edit
gemini --approval-mode=yolo          # 等价 --yolo（已弃用）
gemini --approval-mode=plan
```

</v-click>

<v-click>

**经验**：日常用 `auto_edit`（编辑自动，shell 卡审批）；探索陌生仓库回 `default`。

</v-click>

---
transition: slide-up
---

# Plan Mode：规划阶段（1/2）

```bash
gemini --approval-mode=plan
# 或交互里
/plan 设计 Phase 2 用户系统
```

<v-clicks>

**plan 模式行为**：

- **只读工具**：`read_file` / `list_directory` / `glob` / `grep_search` / `google_web_search` / `web_fetch`
- **唯一写权**：仅能往 `~/.gemini/tmp/<project>/<session>/plans/` 写 `.md` 计划
- **产物**：详细实施计划（分步 / 风险 / 回滚）

</v-clicks>

<v-click>

**自动模型路由**（默认开）：

- 规划阶段：路由到 Pro 模型（高推理）
- approve plan 后：切 Flash 模型（高速实施）
- 关掉路由：`plan.modelRouting=false`

</v-click>

---
transition: slide-up
---

# Plan Mode：协作编辑（2/2）

```
（plan mode）
> 帮我设计一个用户认证模块（OAuth + JWT）

Gemini：
1. read_file package.json / README 理解项目
2. grep_search 找现有 auth 相关代码
3. ask_user 确认需要支持的 OAuth provider
4. write_file plans/auth-design.md 产出计划

approve plan 后：
Shift+Tab 切到 default → Gemini 按 plan 实施
```

<v-click>

> 💡 **Ctrl+X 协作编辑**
>
> plan 产出后用外部编辑器（VS Code / vim）打开，加注释 / 改步骤后，Gemini 自动检测变化继续推进。

</v-click>

---
transition: slide-up
---

# 内置工具：文件读写

| 工具 | 用途 |
| --- | --- |
| `read_file` | 读文件（文本 / 图片 / 音频 / PDF） |
| `read_many_files` | 读多文件（`@` 语法触发） |
| `list_directory` | 列目录 |
| `write_file` | 创建 / 覆盖（要审批） |
| `replace` | 精确字符串替换（要审批） |

<v-click>

**`@` 注入语法**：

```
> 帮我重构 @src/utils/format.ts
> 看一下 @src/components/ 整个目录的代码风格
```

`@` 让 `read_many_files` 一次拉所有文件进上下文（git-aware，自动跳过 `node_modules/`、`.env` 等）。

</v-click>

---
transition: slide-up
---

# 内置工具：搜索 / 命令

| 工具 | 用途 |
| --- | --- |
| `glob` | 文件名模式匹配（`**/*.ts`） |
| `grep_search` | 正则全文搜索（默认 ripgrep） |
| `run_shell_command` | 执行 shell（要审批） |

<v-click>

**`!` 直接跑 shell**：

```
> !ls -la
> !git status
> !                # 进入 shell 模式（连续跑多条）
```

</v-click>

<v-click>

`!` 模式下命令直接走 shell，**不经 Gemini 中转**——适合「需要看真实输出」的场景（diff / log / ls）。子进程内 `GEMINI_CLI=1` 可检测。

</v-click>

---
transition: slide-up
---

# 内置工具：Web + GoogleSearch grounding

| 工具 | 用途 |
| --- | --- |
| `google_web_search` | **Google 搜索**（自带 citation） |
| `web_fetch` | 抓 URL（自动 markdown 转换） |

<v-clicks>

**为什么 GoogleSearch grounding 关键**：

- Google 自家搜索质量，比 Bing / DuckDuckGo 更准
- 答案自带 citation（可溯源链接）
- Real-time 信息（新版本 / 最新 best practice / 文档更新）
- 大模型 + 搜索增强 = 减少幻觉

</v-clicks>

<v-click>

```
> 用 google_web_search 拿 Vue 3.5 最新组件最佳实践，
> 然后给 packages/ui 写 README
```

Gemini 会拿 citation 后结合本地代码产出文档。

</v-click>

---
transition: slide-up
---

# 内置工具：协作 / Memory

| 工具 | 用途 |
| --- | --- |
| `activate_skill` | 激活 agent skill（按需加载） |
| `get_internal_docs` | 查 Gemini CLI 自身文档 |
| `ask_user` | 主动问用户（决策卡点） |
| `write_todos` | 维护任务清单 |
| `update_plan` | 更新当前 plan |
| `list_mcp_resources` | 列 MCP server 资源 |
| `read_mcp_resource` | 读 MCP 资源 |

<v-click>

`ask_user` 是 Plan Mode 的关键——Gemini 卡点时主动问用户决策，而不是猜。

</v-click>

---
transition: slide-up
---

# Slash 命令：完整清单

| 命令 | 作用 |
| --- | --- |
| `/help` | 显示所有 slash 命令 |
| `/auth` | 切换认证方式 |
| `/model` | 选模型 |
| `/clear` | 清空显示（Ctrl+L） |
| `/compress` | 压缩对话上下文 |
| `/memory` | 管理 GEMINI.md（show / refresh） |
| `/tools` | 列所有可用工具 |
| `/mcp` | 看 MCP server 状态 |
| `/extensions` | 装 / 看 / 卸 extension |
| `/skills` | 启用 / 禁用 skill |
| `/init` | 生成 GEMINI.md 骨架 |
| `/restore` | 列出 / 回滚 checkpoint |
| `/chat` | 浏览历史会话 |
| `/stats` | 看 token 用量 |
| `/plan <goal>` | 进 Plan Mode |

---
transition: slide-up
---

# 特殊语法：@ 和 !

```
# @ 注入文件 / 目录到 prompt
> 帮我重构 @src/utils/format.ts
> 看下 @src/components/ 目录的所有组件
> 总结 @README.md @CHANGELOG.md @package.json

# ! 直接跑 shell（不经 Gemini）
> !ls -la
> !git diff HEAD~1
> !pnpm test

# !（独占）进入 shell 模式
> !
shell> ls
shell> cd src
shell> exit          # 退回到 Gemini
```

<v-click>

`@` 是 git-aware 的：自动遵守 `.gitignore` + `.geminiignore`，跳过 `node_modules/`、`.env` 等。

</v-click>

---
transition: slide-up
---

# 自定义 Slash 命令（.toml）

```toml
# ~/.gemini/commands/lint.toml
description = "对当前 staged 文件跑 lint 检查"
prompt = """
对当前 staged 文件跑 lint 检查，输出问题列表。
不要自动修复，仅报告。
"""
```

```toml
# ~/.gemini/commands/release.toml
description = "做一次 patch 版本发布"
prompt = """
做一次 patch 版本发布：
1. 用 changelogen 生成 CHANGELOG
2. bump package.json
3. git tag + push
4. npm publish
"""
```

<v-click>

CLI 里 `/lint` 或 `/release` 触发。`/commands reload` 重新扫描。**项目级**放 `./.gemini/commands/<name>.toml`，commit 进仓库团队共享。

</v-click>

---
transition: slide-up
---

# Agent Skills：按需加载（1/2）

Skill = 自包含目录 + 描述常驻 system prompt，**激活时**才把完整内容塞进上下文

```
~/.gemini/skills/cypress-skill/
├── SKILL.md              # 主指令（必需）
├── references/           # 引用资源
│   ├── good-test.cy.ts
│   └── bad-test.cy.ts
├── scripts/              # 工具脚本
└── data/                 # 静态数据
```

<v-click>

```md
---
name: cypress-skill
description: Use when writing Cypress E2E tests for this project
---

# Cypress 测试规范

E2E 测试必须：

1. 用 test 服务器（端口 10060，test DB）
2. ...
```

</v-click>

---
transition: slide-up
---

# Agent Skills：激活流程（2/2）

<v-clicks>

1. **Discovery**：CLI 启动时扫所有 SKILL.md，`name + description` 注入 system prompt
2. **Activation**：模型读到用户问题匹配 description → 调 `activate_skill(name)` 工具
3. **Consent**：用户**主动确认**（一次性 / 永久允许）
4. **Injection**：SKILL.md 完整内容 + 引用资源加入对话历史
5. **Execution**：Gemini 按 skill 指令执行

</v-clicks>

<v-click>

**四级优先级**（低 → 高）：

1. 内置 skill（CLI 自带）
2. Extension skill（装的 extension 携带）
3. 用户 skill（`~/.gemini/skills/`）
4. Workspace skill（`.gemini/skills/`，commit 进仓库）

</v-click>

<v-click>

> 💡 **Progressive Disclosure**
>
> metadata 只塞 system prompt 几十 token，激活时才注入完整 SKILL.md——比 Claude Code 默认全注入更省 token。

</v-click>

---
transition: slide-up
---

# Hooks：11 个生命周期事件（1/3）

| 事件 | 触发时机 |
| --- | --- |
| `SessionStart` | 会话开始 |
| `SessionEnd` | 会话结束 |
| `BeforeAgent` | Agent loop 开始 |
| `AfterAgent` | Agent loop 结束 |
| `BeforeModel` | LLM 调用前 |
| `AfterModel` | LLM 返回后 |
| `BeforeToolSelection` | 工具选择前 |
| `BeforeTool` | tool 执行前 |
| `AfterTool` | tool 执行后 |
| `PreCompress` | 上下文压缩前 |
| `Notification` | 警告 / 通知 |

<v-click>

比 Claude Code 的 2 个 hook 事件多 9 个——可编程性强很多。

</v-click>

---
transition: slide-up
---

# Hooks：配置（2/3）

```json
// ~/.gemini/settings.json
{
  "hooks": {
    "BeforeTool": [
      {
        "matcher": "write_.*",
        "hooks": [
          {
            "name": "audit",
            "type": "command",
            "command": "echo \"$TOOL_NAME\" >> ~/audit.log",
            "timeout": 5000
          }
        ]
      }
    ],
    "AfterTool": [
      {
        "matcher": "write_file|replace",
        "hooks": [
          {
            "name": "prettier",
            "type": "command",
            "command": "cd $GEMINI_PROJECT_DIR && pnpm exec prettier --write \"$TOOL_FILE_PATH\""
          }
        ]
      }
    ]
  }
}
```

---
transition: slide-up
---

# Hooks：行为约定（3/3）

<v-clicks>

**stdout / stderr**：

- 必须**通过 stdout 输出 JSON**（其它内容破坏解析）
- 用 **stderr** 打 debug 日志

**退出码**：

| 码 | 含义 |
| --- | --- |
| `0` | 成功 |
| `0` + `{"decision":"deny"}` | 拒绝（不阻塞 hook 自身） |
| `2` | 系统级阻塞（stderr 是拒绝原因） |
| 其它 | 警告但放行 |

</v-clicks>

<v-click>

**环境变量**：`GEMINI_PROJECT_DIR` / `GEMINI_PLANS_DIR` / `GEMINI_SESSION_ID` / `GEMINI_CWD`。

</v-click>

<v-click>

> ⚠️ **Hook 是 shell 执行点**
>
> Project 级 hook 改动会触发 fingerprint 警告，防 git 拉下来的恶意 hook 自动跑。

</v-click>

---
transition: slide-up
---

# MCP（Model Context Protocol）(1/2)

MCP 是 Anthropic 推动的「让 LLM 接外部工具」开放协议，Gemini CLI 一类支持

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "remote": {
      "httpUrl": "https://my-mcp.example.com",
      "headers": { "Authorization": "Bearer ${API_KEY}" },
      "timeout": 5000,
      "trust": false
    }
  }
}
```

<v-click>

`/mcp` 看连接状态。stdio / SSE（`url`）/ HTTP（`httpUrl`）三种通信都支持。

</v-click>

---
transition: slide-up
---

# MCP：字段与常用 server (2/2)

| 字段 | 说明 |
| --- | --- |
| `command` + `args` | stdio MCP 启动命令 |
| `url` / `httpUrl` | 远程 MCP server |
| `headers` | 远程鉴权头 |
| `env` | 注入环境变量 |
| `trust` | 跳过该 server 工具审批 |
| `includeTools` / `excludeTools` | 工具白 / 黑名单 |

<v-click>

**常用 MCP server**：

| Server | 提供工具 |
| --- | --- |
| `@modelcontextprotocol/server-github` | Issue / PR / Repo |
| `@upstash/context7-mcp` | 最新库文档查询 |
| `@modelcontextprotocol/server-postgres` | Postgres 查询 |
| `chrome-devtools-mcp` | 浏览器自动化 |

</v-click>

---
transition: slide-up
---

# Extensions：一键装扩展 (1/2)

```bash
# 装一个 extension（直接 GitHub URL）
gemini extensions install https://github.com/gemini-cli-extensions/workspace

# 列出已装
gemini extensions list
/extensions list

# 启用 / 禁用
/extensions enable workspace
/extensions disable workspace

# 更新
gemini extensions update <name>
```

<v-click>

Extension 可包含：

- 自定义命令（`.toml`）
- MCP server 配置
- Prompts / Themes
- Hooks / Subagents / Agent Skills

</v-click>

---
transition: slide-up
---

# Extensions：官方画廊 (2/2)

[geminicli.com/extensions/browse](https://geminicli.com/extensions/browse/) 浏览社区 extension

<v-clicks>

| Extension | 用途 |
| --- | --- |
| `workspace` | 多目录 workspace 管理 |
| `cloud-run` | GCP Cloud Run 部署 |
| `bigquery` | BigQuery 查询 |
| `firebase` | Firebase 集成 |
| `git-pr-helper` | PR 工作流封装 |
| `kubernetes` | K8s 集群操作 |

</v-clicks>

<v-click>

> ⚠️ **Extension 安全**
>
> 装第三方 extension 等于在你机器上执行任意代码。可通过 `security.allowedExtensions: ["^@google/.*"]` 白名单限制；企业可用 `admin.extensions.enabled=false` 禁全部。

</v-click>

---
transition: slide-up
---

# Subagents：并行任务

Gemini CLI 内置 `codebase_investigator` 等 subagent，可独立上下文跑子任务

```
> 帮我并行做三件事：
>   1. 用 codebase_investigator 总结组件目录结构
>   2. grep 所有 TODO 注释
>   3. 用 web_fetch 拿 Vue 3.5 changelog
```

<v-click>

```json
{
  "agents": {
    "overrides": {
      "codebase_investigator": {
        "model": "gemini-3-pro-preview"
      }
    }
  }
}
```

可单独给 subagent 配模型——主线程 Flash，subagent 深度分析用 Pro。

</v-click>

<v-click>

`experimental.enableAgents=true` 启用 Local / Remote subagents（实验性）。

</v-click>

---
transition: slide-up
---

# Checkpointing：自动 Shadow Git 快照

```json
{
  "general": {
    "checkpointing": { "enabled": true }
  }
}
```

<v-clicks>

启用后每次 `write_file` / `replace` 前自动：

1. **Shadow Git 提交**：`~/.gemini/history/<project_hash>` 仓库提交一份当前状态
2. **会话快照**：`~/.gemini/tmp/<project_hash>/checkpoints/<timestamp>.json` 存对话历史 + tool 调用

</v-clicks>

<v-click>

```bash
# 列出所有 checkpoint
/restore

# 回滚到指定（文件 + 对话都恢复）
/restore 2026-05-15T10-00-00_000Z-src-index.ts-write_file
```

</v-click>

<v-click>

> 💡 **回滚 = 双重恢复**
>
> `/restore` 不仅还原文件，对话也回到那时——Gemini「忘记」之后做过什么，重新看到原 tool prompt。

</v-click>

---
transition: slide-up
---

# 沙箱（Sandbox）

```bash
gemini --sandbox        # 自动选 Docker / Podman / Seatbelt
gemini -s

# 环境变量
export GEMINI_SANDBOX=docker
gemini
```

<v-click>

**自定义 sandbox 镜像**：

```dockerfile
# .gemini/sandbox.Dockerfile
FROM gemini-cli-sandbox
USER root
RUN apt-get update && apt-get install -y python3
USER node
```

```bash
BUILD_SANDBOX=1 gemini -s
```

</v-click>

<v-click>

**macOS Seatbelt**（无需 Docker）：

```bash
export SEATBELT_PROFILE=strict-proxied
gemini --sandbox
```

profile：`permissive-open` / `restrictive-open` / `strict-open` / `strict-proxied`。

</v-click>

---
transition: slide-up
---

# Headless 模式（脚本 / CI）

```bash
# 单次 prompt 后退出
gemini -p "总结 README.md 主要内容"

# 结构化 JSON 输出
gemini -p "查 package.json 依赖" --output-format json

# 流式 JSON（每行一个事件）
gemini -p "改重构 src/" --output-format stream-json
```

<v-click>

退出码：

| 码 | 含义 |
| --- | --- |
| `0` | 成功 |
| `1` | 一般错误 / API 失败 |
| `42` | 输入校验错 |
| `53` | 超过 turn 限制 |

</v-click>

<v-click>

```bash
# CI 全自动
gemini -p "lint 检查并写报告" \
  --approval-mode=yolo \
  --output-format json
```

</v-click>

---
transition: slide-up
---

# GitHub Actions 集成

```bash
/setup-github
```

<v-click>

让 Gemini 自动给当前仓库装好 `.github/workflows/gemini-cli.yml`：

- PR 评审（`@gemini review`）
- Issue 自动分诊
- 自定义命令触发
- 跨 PR 维度的代码分析

</v-click>

<v-click>

底层用 [run-gemini-cli](https://github.com/google-github-actions/run-gemini-cli)：

```yaml
- uses: google-github-actions/run-gemini-cli@v0
  with:
    prompt: 帮我评审这次 PR 改动
    approval-mode: yolo
```

</v-click>

<v-click>

CI 内 `GEMINI_API_KEY` 走 GitHub Secrets，免费 1000 RPD 跑日常 PR 评审完全够。

</v-click>

---
transition: slide-up
---

# vs Claude Code（**重点**）

| 维度 | Gemini CLI | Claude Code |
| --- | --- | --- |
| **开源** | ✓ Apache 2.0 | ✗ 闭源 |
| **免费额度** | **1000 RPD（OAuth）** | 无 |
| **默认上下文** | **1M** | 200K |
| 模型 | Gemini 3 / 2.5 全系 | Opus / Sonnet / Haiku |
| 联网搜索 | **Google Search 内建** | WebFetch |
| Hooks 事件 | **11 个** | 2 个（pre/post） |
| Skills | ✓ `activate_skill` 按需 | ✓ 描述自动匹配 |
| Plan Mode | ✓ + 自动模型路由 | ✓ |
| Checkpointing | ✓ Shadow Git | ✗ |
| Extensions | ✓ 一键装 | ✗（用 skill / hook） |
| 沙箱 | ✓ Docker / Seatbelt | ✗（依赖 OS） |
| MCP | ✓ 一类 | ✓ 一类 |

<v-click>

**怎么选**：要开源 + 免费额度 → Gemini CLI；要成熟 Skills 生态 → Claude Code。

</v-click>

---
transition: slide-up
---

# vs Codex（**重点**）

| 维度 | Gemini CLI | Codex |
| --- | --- | --- |
| **开源** | ✓ Apache 2.0 | ✗ 闭源 |
| **免费额度** | **1000 RPD** | 无 |
| **上下文** | **1M** | 200K |
| 模型 | Gemini 全系 | GPT / o-series |
| 联网 | **Google Search** | WebSearch |
| Hooks | ✓ 11 事件 | -（受限） |
| Skills | ✓ | ✗（用 prompt） |
| Plan Mode | ✓ + 路由 | ✗ |
| Checkpointing | ✓ | ✗ |
| Extensions | ✓ 一键装 | ✗ |
| MCP | ✓ | ✓ |

<v-click>

**怎么选**：重度 OpenAI 生态（GPT / o-series）→ Codex；其它情况大概率 Gemini CLI 更划算。

</v-click>

---
transition: slide-up
---

# 大陆访问

Google API 国内不可达，需要

<v-clicks>

**方案 1：HTTPS 代理**

```bash
export HTTPS_PROXY="http://localhost:7890"
export HTTP_PROXY="http://localhost:7890"
gemini
```

**方案 2：自建 Base URL 代理**

```bash
export GOOGLE_GEMINI_BASE_URL="https://my-gemini-proxy.example.com"
# 或 Vertex 端
export GOOGLE_VERTEX_BASE_URL="https://my-vertex-proxy.example.com"
```

</v-clicks>

<v-click>

> ⚠️ **仅 HTTPS**
>
> Base URL 只接受 `https://`（localhost 例外）—— 自建代理必须带 TLS 证书。

</v-click>

---
transition: slide-up
---

# 实战 1：接手陌生项目

```
> 我刚 clone 这个仓库。先帮我快速理解：
>   1. 项目用什么技术栈？
>   2. 主要功能有哪些
>   3. 怎么本地起？
```

<v-click>

Gemini 会：

- 调 `read_file` 看 `package.json` / `README.md` / `tsconfig.json`
- 调 `list_directory` / `glob` 看目录结构
- 调 `grep_search` 找 dev / start 脚本

回总结后**自动写 GEMINI.md 草稿**，下次启动直接复用。

</v-click>

---
transition: slide-up
---

# 实战 2：1M 上下文大重构

```
> 把整个 src/utils/ 目录（30+ 文件）的代码风格统一改成 functional style。
> 现有公开 API 保持兼容
```

<v-click>

Gemini 用 **1M 上下文一次性读完整个 utils 目录**，统一改完。

</v-click>

<v-click>

**对比传统模型**：

- 200K 模型：必须分批改 → 跨文件一致性容易丢
- **1M 模型**：所有文件一次性塞，全局视角统一改

</v-click>

<v-click>

```
1. read_many_files src/utils/**/*.ts
2. 分析整体风格 + 找所有需要改的地方
3. 批量 replace（一次 message 多个 replace 工具调用）
4. run_shell_command 跑测试
```

</v-click>

---
transition: slide-up
---

# 实战 3：联网搜索 + 文档撰写

```
> 给 packages/ui 包写一份 README：
>   1. 安装步骤
>   2. 用 google_web_search 拿 Vue 3.5 的最新组件最佳实践
>   3. 三个常用组件示例（看 src/index.ts 导出哪些）
```

<v-click>

Gemini 流程：

1. **read_file** `packages/ui/src/index.ts` 看导出清单
2. **google_web_search** 查 Vue 3.5 最新组件实践（自带 citation）
3. **read_file** 三个常用组件源码
4. **write_file** README.md（带 citation 链接）

</v-click>

<v-click>

**Google Search Grounding 的价值**：实时信息 + 可溯源链接 = 减少幻觉。

</v-click>

---
transition: slide-up
---

# 实战 4：紧急 hotfix

```
> 线上报错 "Cannot read property 'name' of undefined"
> 在 /api/users/[id] 路由。
> 帮我查根因 + 修复 + 加测试
```

<v-click>

Gemini 流程：

1. **grep_search** 找路由实现文件
2. **read_file** 看代码 + 周边逻辑
3. **replace** 加空值判断
4. **write_file** 加 unit test 复现 + 验证
5. **run_shell_command** 跑测试确认通过

</v-click>

<v-click>

如果开了 **checkpointing**，每次 `replace` 前自动快照——错了直接 `/restore` 回滚。

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

Gemini 流程：

1. **run_shell_command** 复现错误
2. **read_file** `cypress.config.ts` / `tsconfig.json`
3. **glob** 找 `fixtures` 相关文件
4. **grep_search** 查 alias 配置
5. 定位通常是 path alias / build 步骤漏
6. **replace** 修复 + 重跑

</v-click>

<v-click>

调试技巧：让 Gemini 用 `--debug` 跑子命令拿详细日志。

</v-click>

---
transition: slide-up
---

# 实战 6：Git 工作流

```
> 看看当前 staged 改动，写个合适的 conventional commit message
（Gemini 调 git diff + 分析 + 提议消息）

> commit 并 push
（Gemini 调 git commit + push）

> 给最近的 commit 开 PR
（Gemini 调 gh pr create）
```

<v-click>

> 💡 **Git Worktree 集成**
>
> `-w <name>` 启动时自动创建 worktree（实验特性）：
>
> ```bash
> gemini -w feat-auth
> # 自动 git worktree add ../my-project-feat-auth feat-auth
> ```

</v-click>

---
transition: slide-up
---

# 实战 7：多文件并行改动

```
> 把整个 quiz-admin 项目里的 console.log 换成自家 logger
```

<v-click>

Gemini 流程：

1. **grep_search** `console.log` 找所有调用（50+ 文件）
2. **write_todos** 列文件清单
3. 批量 spawn **codebase_investigator** subagent 按目录并行改
4. 主线程汇总
5. **run_shell_command** 跑 lint + test

</v-click>

<v-click>

**1M 上下文 + Subagent 双保险**：单批不够放就分子代理跑，每个子代理独立上下文不污染主线程。

</v-click>

---
transition: slide-up
---

# 调试 Gemini CLI 自身

```bash
# 详细日志
gemini --debug
gemini -d
# F12 打开内置 console

# 看日志
ls ~/.gemini/logs/

# 跳过 trust 检查（仅当前 session）
gemini --skip-trust

# 列所有 extension
gemini -l
```

<v-click>

```bash
# Telemetry 本地导出
export GEMINI_TELEMETRY_ENABLED=true
export GEMINI_TELEMETRY_TARGET=local
export GEMINI_TELEMETRY_OUTFILE=/tmp/gemini-telemetry.json
gemini

# 关闭 trust 检查（CI）
export GEMINI_CLI_TRUST_WORKSPACE=true
```

</v-click>

---
transition: slide-up
---

# 性能优化

<v-clicks>

- **大仓库**：1M 上下文默认开，无需切换
- **MCP 启动慢**：`tools.useRipgrep=true`（替代 grep）+ 暂时禁不用的 server
- **token 缓存**：长会话自动开 prompt cache，命中后费用骤降
- **Skill 按需加载**：让 Gemini 主动 `activate_skill`，省 token
- **Plan Mode + 模型路由**：规划 Pro 实施 Flash，省 ~70% Pro 费
- **`@` 批量注入**：让 `read_many_files` 一次拉完，省工具调用次数
- **避免无意义 grep**：知文件名直接 `read_file`

</v-clicks>

---
transition: slide-up
---

# 故障排查

| 现象 | 排查 |
| --- | --- |
| `Authentication failed` | `/auth` 重新登录 |
| 模型回复总被截断 | `/compress` 释放 token |
| Hook 不触发 | `/hooks` 看配置 / matcher 模式 |
| MCP server 红色未连接 | 终端跑 server 命令看错 |
| Skill 不被识别 | `~/.gemini/skills/<name>/SKILL.md` 存在 + 重启 |
| 中国大陆连不上 | HTTPS_PROXY / `GOOGLE_GEMINI_BASE_URL` |
| 高 token 用量 | `/stats` + 切 Flash |
| YOLO 模式被禁 | `security.disableYoloMode=true` 已开 |
| Folder Trust 警告 | `/permissions` 信任目录 |

---
transition: slide-up
---

# 安全考量

<v-clicks>

- **YOLO 不要全局开**：陌生 / 公开仓库回 default
- **GEMINI.md 是 prompt injection 面**：克隆陌生仓库先看 GEMINI.md 内容
- **MCP server 是代码执行点**：装 server 前看源码 / 用知名包
- **Hook 命令是 shell 注入面**：环境变量在 hook 里要 quote
- **token 别 commit**：`environmentVariableRedaction` 默认遮蔽含 TOKEN / SECRET 的变量
- **Folder Trust**：首次进入新目录需用户确认信任（防恶意 GEMINI.md）
- **Extension 白名单**：`security.allowedExtensions: ["^@google/.*"]` 限制可装范围

</v-clicks>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 主要变化 |
| --- | --- | --- |
| 0.1 | 2025 中 | 首个 preview 版 |
| 0.10 | 2025 末 | MCP 一类支持 / Plan Mode |
| 0.20 | 2026 初 | Skills 系统 / Checkpointing |
| 0.30 | 2026 初 | Hooks 11 事件 / Extensions |
| 0.42 | 2026 5 月 | 当前稳定版（Gemini 3 默认） |

<v-click>

**关键演进**：

- **MCP + Plan Mode** → 早期生态对齐 Claude Code
- **Skills** → 按需加载比 Claude 全注入更省 token
- **Checkpointing** → Shadow Git 是独家亮点
- **Extensions** → 一键装机制对齐 vscode marketplace
- **11 hook 事件** → 可编程性强于 Claude Code

</v-click>

---
transition: slide-up
---

# 学习路径

<v-clicks>

**Week 1 — 上手**

- 装 + OAuth + 第一次对话
- 写 `GEMINI.md`，体会模型如何遵守规范
- 用 `/init` + 让 Gemini 改一个小 bug

**Week 2 — 进阶**

- 切换模型（Pro / Flash）感受差异
- 自定义 slash 命令（`.toml`）
- 试 Plan Mode + 自动模型路由

**Week 3 — 扩展**

- 装 1-2 个 MCP server / Extension
- 写第一个 Hook（如 AfterTool 自动 prettier）
- 装社区 Skill

**Week 4 — 工作流**

- 配 `~/.gemini/settings.json` 的 permissions / hooks
- spawn subagent 做并行任务
- 开 checkpointing + 沙箱

</v-clicks>

---
transition: slide-up
---

# 资源链接

| 资源 | 链接 |
| --- | --- |
| 官方文档 | [google-gemini.github.io/gemini-cli](https://google-gemini.github.io/gemini-cli/docs/) |
| GitHub | [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli) |
| 扩展画廊 | [geminicli.com/extensions](https://geminicli.com/extensions/browse/) |
| AI Studio（API key） | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| Google AI 文档 | [ai.google.dev](https://ai.google.dev) |
| Cloud Code Assist | [cloud.google.com/gemini/docs/codeassist](https://cloud.google.com/gemini/docs/codeassist/gemini-cli) |
| MCP 协议 | [modelcontextprotocol.io](https://modelcontextprotocol.io/) |
| GitHub Action | [run-gemini-cli](https://github.com/google-github-actions/run-gemini-cli) |
| Releases | [releases](https://github.com/google-gemini/gemini-cli/releases) |

---
layout: center
class: text-center
---

# 总结

把 Gemini CLI 当 **开源 + 免费 + 大上下文** 的 Agent 用

<div class="mt-6 text-left max-w-2xl mx-auto text-base op-90">

- **开源**：Apache 2.0，可 fork / 审计 / 自部署
- **免费**：OAuth 60 RPM + 1000 RPD（含 Gemini 3 Pro）
- **大**：1M 上下文默认，整本仓库一次塞
- **联网**：Google Search Grounding 自带 citation
- **完整生态**：MCP / Hooks / Skills / Extensions / Subagents / Checkpointing / 沙箱

</div>

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://google-gemini.github.io/gemini-cli/docs/" target="_blank">gemini-cli docs</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/google-gemini/gemini-cli" target="_blank">google-gemini/gemini-cli</a>
</div>
