---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Codex CLI
info: |
  Presentation Codex CLI for developers.

  Learn more at [https://developers.openai.com/codex](https://developers.openai.com/codex)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:openai-icon class="text-7xl" />
</div>

<br/>

## Codex CLI：OpenAI 官方 Agent CLI

Lightweight coding agent that runs in your terminal —— Rust 写的开源 AI 编码 Agent

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Codex CLI —— OpenAI 自家的 AI 编码 Agent。

注意：这里说的 Codex 是 2025 年新版的开源 CLI，不是 2021 年那个已废弃的 code-davinci-002 API。仓库在 openai/codex，Rust 写的。
-->

---
transition: fade-out
---

# 什么是 Codex CLI？

OpenAI 官方出品的开源 Agent CLI，多端一致体验

<v-clicks>

- **CLI（核心）**：装一行命令，终端里跑 Agent，读写本地文件 / 执行命令
- **VS Code / Cursor / Windsurf 扩展**：IDE 内嵌对话
- **桌面 App**：`codex app` 启动
- **Web（chatgpt.com/codex）**：浏览器免安装
- **Agents SDK**：把 Codex 内核嵌进自家应用

</v-clicks>

<br>

<div v-click text-xs>

_Read more about_ [_Codex Documentation_](https://developers.openai.com/codex)

</div>

<style>
h1 {
  background-color: #10A37F;
  background-image: linear-gradient(45deg, #10A37F 10%, #064E3B 90%);
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

# Codex CLI ≠ 2021 旧 Codex API

老 Codex 已经废弃，此 Codex 是 2025 年重生的新产物

<v-clicks>

| 维度 | 2021 旧 Codex | 现 Codex CLI |
| --- | --- | --- |
| 形态 | API 模型（`code-davinci-002`） | 本地 CLI Agent |
| 模型 | 单一专用模型 | GPT-5.5 / o3 / o4-mini 等 |
| 状态 | 2023 年废弃 | 2025 年发布，**活跃维护** |
| 实现 | 闭源 | 开源（Rust，Apache-2.0） |
| 仓库 | - | [openai/codex](https://github.com/openai/codex) |

</v-clicks>

<v-click>

下文所有 Codex 都指**新版 CLI Agent**，不要混淆。

</v-click>

---
transition: slide-up
---

# 定位：Agent in your terminal

跟 Claude Code 同类——会自己读写文件 + 跑命令 + 调外部工具的 Agent

<v-clicks>

- **直接接管 shell + 文件系统**：不需要复制粘贴代码段
- **多轮 + 工具循环**：观察执行结果继续推理
- **多模型矩阵**：GPT 系 + o-series + 第三方 provider（OpenRouter / Azure）
- **三层 sandbox**：read-only / workspace-write / danger-full-access
- **细粒度审批**：untrusted / on-request / never
- **开源**：Rust 实现，可审计

</v-clicks>

<v-click>

定位关键词：**开源** + **Agent** + **CLI 优先** + **多 provider**。

</v-click>

---
transition: slide-up
---

# 优劣速读

<v-clicks>

**优点**

- 开源（Rust + Apache-2.0），可审计 / 可贡献
- 模型矩阵广（OpenAI 自家 + Azure / OpenRouter / Anthropic）
- 三层 sandbox 默认即安全
- AGENTS.md 已成多个 Agent CLI 的事实约定
- profiles 支持多套配置切换
- VS Code / Cursor / Windsurf / 桌面 / Web 多端

**缺点**

- ChatGPT 订阅或 API key 才能用
- 中国大陆访问需自备网络
- Skills 机制相比 Claude Code 缺失
- Hooks 配置存在但功能受限
- Web 版能力少于本地 CLI

</v-clicks>

---
transition: slide-up
---

# 安装

```bash
# npm 全局装（最直接）
npm install -g @openai/codex

# 或 pnpm
pnpm add -g @openai/codex

# 或 macOS brew
brew install --cask codex

# 或下二进制
# https://github.com/openai/codex/releases

# 验证
codex --version    # codex 0.130.0
codex --help       # 列子命令与 flag
```

<v-click>

**平台**：macOS（Apple Silicon / x86_64）、Linux（x86_64 / arm64）、Windows（原生 PS / WSL2）。

</v-click>

<v-click>

**性能**：Rust 实现，启动速度比 Node 实现的 CLI 快几倍。

</v-click>

---
transition: slide-up
---

# 认证：三选一

| 方式 | 适合 | 凭据位置 |
| --- | --- | --- |
| ChatGPT 账号（Plus / Pro / Business / Edu / Enterprise） | 个人 + 已订阅 | `~/.codex/auth.json` |
| OpenAI API key | 团队 + 重度 | 环境变量 `OPENAI_API_KEY` |
| 第三方 Provider | 已有其他渠道 | `config.toml` |

```bash
# 首次：浏览器 OAuth
codex login

# 远程 SSH：设备码
codex login --device-auth

# 切账号
codex login --logout && codex login
```

<v-click>

**ChatGPT 订阅价**（截至 2026）：Plus $20 / Pro $200 / Business $25 per seat / Enterprise 联系销售，订阅内含一定 Codex 额度。

</v-click>

---
transition: slide-up
---

# 模型矩阵：OpenAI 自家

| 模型 ID | 别名 | 上下文 | 适合 |
| --- | --- | --- | --- |
| `gpt-5.5` | GPT-5.5（默认） | ~200K | 日常 / 复杂规划 |
| `gpt-5.4` | GPT-5.4 | ~200K | 平衡 |
| `gpt-5.3-codex` | Codex 专用 | ~400K | 长上下文代码 |
| `o3` | o-series 旗舰 | ~200K | 深度推理 |
| `o4-mini` | 轻量 o-series | ~128K | 快速 / 便宜 |

```bash
codex --model gpt-5.5
codex --model o3
/model            # 交互里切
```

<v-click>

**直觉决策**：方案设计用 o3；写实现用 gpt-5.5；大代码理解用 gpt-5.3-codex；一行答用 o4-mini。

</v-click>

---
transition: slide-up
---

# reasoning_effort：调推理深度

部分模型（o3 / gpt-5.5）支持调推理量

```toml
# ~/.codex/config.toml
model = "gpt-5.5"
model_reasoning_effort = "high"   # low / medium / high / extra-high
```

<v-clicks>

| 等级 | 适合 |
| --- | --- |
| `low` | 简单 grep / 一行答（省 token） |
| `medium` | 日常编码（**默认**） |
| `high` | 复杂调试 / 多步推理 |
| `extra-high` | 大型重构 / 难解 bug |

</v-clicks>

<v-click>

**优化套路**：批量简单任务 `low`；卡住的难 bug 临时切 `extra-high`。

</v-click>

---
transition: slide-up
---

# 第一次对话

```bash
cd ~/projects/my-app
codex
```

```
╭───────────────────────────────────╮
│  Codex CLI v0.130.0               │
│  cwd: ~/projects/my-app           │
│  model: gpt-5.5                   │
│  sandbox: workspace-write         │
│  approval: on-request             │
╰───────────────────────────────────╯

> 帮我看看 src/index.ts 文件里的 main 函数
```

<v-click>

Codex 会：

1. 调 `file_search` / `read` 找到并读 `src/index.ts`
2. 分析后回复说明
3. **所有 tool 调用都留在屏幕上**，可随时打断纠正

</v-click>

---
transition: slide-up
---

# 退出 / 暂停

| 操作 | 快捷键 / 命令 |
| --- | --- |
| 退出 | `Ctrl+C` 两次 / `/quit` |
| 中断当前回复 | `Esc` |
| 清空会话 / 压缩 | `/clear` / `/compact` |
| 恢复上次 / 指定会话 | `codex resume --last` / `<session-id>` |
| 列出历史会话 | `codex resume` |

<v-click>

`context_length_exceeded` 时，**`/compact`** 让 Codex 自总结历史并替换原对话，立刻缓解 token 压力。

</v-click>

---
transition: slide-up
---

# 项目说明书：AGENTS.md

Codex 启动时自动读项目根 / 子目录 / 用户目录的 `AGENTS.md`

```md
# 项目说明（AGENTS.md）

## 仓库布局
- apps/web/：前端 Vue 3
- apps/api/：后端 NestJS
- packages/ui/：共享组件

## 构建命令
- pnpm dev：启动开发
- pnpm test：单元测试

## 工程约定
- TS 严格模式
- 提交用 conventional commit
- 不要 commit .env

## 验证方法
- 改动后必须 pnpm lint && pnpm test
```

<v-click>

每次启动 / cd 切目录时会重新加载。**这是教 Codex 项目约定最有效的方式**。

</v-click>

---
transition: slide-up
---

# AGENTS.md：发现顺序

按以下顺序加载并合并

<v-clicks>

| 优先级 | 路径 |
| --- | --- |
| 1（最高） | `~/.codex/AGENTS.override.md` |
| 2 | `~/.codex/AGENTS.md` |
| 3 | Git root 每层 `AGENTS.override.md` |
| 4 | Git root 每层 `AGENTS.md` |
| 5（最特定） | 当前目录 `AGENTS.md` |

</v-clicks>

<v-click>

**合并策略**：离当前目录越近的越后追加，**覆盖之前的指南**。子目录可用 `AGENTS.override.md` 完全替换祖先的某段约定。

</v-click>

<v-click>

**大小限制**：默认总 32 KiB（`project_doc_max_bytes`）。超过则停止加载——大型仓库拆到子目录写专项。

</v-click>

---
transition: slide-up
---

# AGENTS.md vs CLAUDE.md

| 对比 | AGENTS.md（Codex） | CLAUDE.md（Claude Code） |
| --- | --- | --- |
| 发现位置 | 项目根 / 子目录 / 用户目录 | 项目根 / 用户目录 |
| 子目录覆盖 | ✓（`AGENTS.override.md`） | ✗ |
| 大小限制 | 默认 32 KiB | 无硬限 |
| 备用文件名 | `project_doc_fallback_filenames` | 无 |
| 业界影响 | 多个 Agent CLI 共用 | Anthropic 独有 |

<v-click>

> 💡 **双工具共用建议**
>
> 同时用 Codex + Claude Code 的项目，建议**两个文件都写**（内容相同），两个 Agent 都能识别。也可以做 symlink：`ln -s AGENTS.md CLAUDE.md`。

</v-click>

---
transition: slide-up
---

# 验证 AGENTS.md 生效

```bash
codex --ask-for-approval never \
  "Summarize the current instructions"
```

<v-click>

Codex 会输出**当前已加载的所有 AGENTS.md 内容合并后的摘要**，方便检查：

- 是否触发了预期的覆盖路径
- 是否因总大小超 32KiB 被截断
- 是否找到了 `project_doc_fallback_filenames` 中的文件

</v-click>

<v-click>

每次跑都重新构建指令链，**无需手动清缓存**。

</v-click>

---
transition: slide-up
---

# Sandbox：三层文件系统隔离

| Mode | 行为 | 适合 |
| --- | --- | --- |
| `read-only` | 仅读，不能写 / 执行命令 | 探索陌生仓库 / 审计 |
| `workspace-write` | 在工作目录写 / 执行；不能触外部 | 日常（**默认**） |
| `danger-full-access` | 全机器随便 | sandbox 容器 / Docker 内 |

```bash
codex --sandbox read-only        # 只读
codex --sandbox workspace-write  # 默认
codex --sandbox danger-full-access  # 危险
/sandbox                         # 交互内切换
```

<v-click>

> ⚠️ **danger-full-access 慎用**
>
> 仅在 Docker / 一次性 VM 内使用。本地直接开等于把机器交给模型——可能跑 `rm -rf /` 等命令。

</v-click>

---
transition: slide-up
---

# Sandbox：workspace-write 配置

```toml
sandbox_mode = "workspace-write"

[sandbox_workspace_write]
network_access = true                      # 允许联网
writable_roots = ["/workspace", "/tmp"]    # 允许写的路径
exclude_slash_tmp = false                  # 排除 /tmp
exclude_tmpdir_env_var = false             # 排除 $TMPDIR
```

<v-click>

**writable_roots 不在 cwd 内的目录写**：例如 `/tmp` 临时文件、`/workspace` 跨目录工作区。

</v-click>

<v-click>

**network_access**：默认 `true`。设 `false` 后 shell 命令不能访问网络（拒绝 `curl` / `pip install` 等）。

</v-click>

---
transition: slide-up
---

# Approval：何时打断问用户

| Policy | 行为 |
| --- | --- |
| `untrusted` | 所有命令都问 |
| `on-request` | 模型自决「该问就问」（**默认**） |
| `never` | 从不问（适合 CI / `--full-auto`） |

```bash
codex --ask-for-approval untrusted
codex -a never
/approvals    # 交互内切换
```

<v-click>

**经验**：日常 `on-request`；探索陌生仓库回 `untrusted`；CI 容器内开 `never`。

</v-click>

---
transition: slide-up
---

# Approval：granular 模式

企业场景的细粒度审批

```toml
approval_policy = { granular = {
    sandbox_approval = true,
    request_permissions = true,
    skill_approval = true
} }
approvals_reviewer = "auto_review"   # user / auto_review
```

<v-clicks>

| 字段 | 含义 |
| --- | --- |
| `sandbox_approval` | 切 sandbox 模式时审批 |
| `request_permissions` | 权限提升时审批 |
| `skill_approval` | 触发 skill 时审批 |
| `rules` / `mcp_elicitations` | 修改规则 / MCP 询问审批 |

</v-clicks>

---
transition: slide-up
---

# --full-auto vs --dangerously-bypass

两种「自动跑」模式

<v-clicks>

| Flag | sandbox | approval | 适合 |
| --- | --- | --- | --- |
| `--full-auto` | `workspace-write` | `on-request` | 日常自动化 |
| `--dangerously-bypass-approvals-and-sandbox` | `danger-full-access` | `never` | 容器 / CI |

</v-clicks>

```bash
# 日常：相对安全的自动模式
codex --full-auto "重构这个文件"

# 容器：完全放开（慎用！）
codex --dangerously-bypass-approvals-and-sandbox \
  "跑所有测试 + 自动修复 + commit"
```

<v-click>

> ⚠️ **危险标志在名字里**
>
> `--dangerously-bypass-approvals-and-sandbox` 名字这么长是故意的——提醒你在按下回车前再想三次。

</v-click>

---
transition: slide-up
---

# Profiles：多套配置切换

```toml
[profiles.development]
model = "gpt-5.5"
sandbox_mode = "workspace-write"
approval_policy = "on-request"
web_search = "live"

[profiles.production]
model = "gpt-5.5"
sandbox_mode = "read-only"
approval_policy = "untrusted"
service_tier = "flex"

[profiles.enterprise]
sandbox_mode = "workspace-write"
approval_policy = { granular = { sandbox_approval = true } }
approvals_reviewer = "auto_review"
```

```bash
codex --profile development
codex --profile production
codex --profile enterprise
```

---
transition: slide-up
---

# 内置工具：文件操作

| 工具 | 用途 |
| --- | --- |
| `read` / `read_file` | 读文件 |
| `apply_patch` | 应用 unified diff 风格的代码修改 |
| `file_search` | 文件名 / 路径模式搜索 |
| `grep` | 全文搜索 |

<v-click>

**为什么用 patch 而非全文件写**：

- 对大文件来说，**只传 diff 比传完整内容省 90% 的 token**
- 易于审计：apply_patch 拒绝应用前用户能看完整 diff

</v-click>

---
transition: slide-up
---

# apply_patch：核心编辑工具

Codex 不调 `write_file` 覆盖文件，而是用 unified diff

```diff
*** Begin Patch
*** Update File: src/utils/format.ts
@@
-export function formatDate(date: Date): string {
-  return date.toISOString();
+export function formatDate(date: Date, locale = "zh-CN"): string {
+  return new Intl.DateTimeFormat(locale).format(date);
 }
*** End Patch
```

<v-click>

apply_patch 工具会：

1. 验证 patch 语法
2. 检查待改文件存在 + 未冲突
3. 应用 + 报告结果

</v-click>

<v-click>

冲突时 Codex 会自动 read 文件后重新 patch——但**频繁失败说明上下文需要刷新**，建议 `/compact` 或重新读全文。

</v-click>

---
transition: slide-up
---

# 内置工具：命令 / 联网 / 多代理

| 工具 | 用途 |
| --- | --- |
| `shell` | 执行 shell 命令（受 sandbox 约束） |
| `web_search` | Web 搜索 |
| `web_fetch` | 抓 URL（自动 markdown 转换） |
| `image_input` | 解析图片 / 截图 |
| `subagent` | spawn 子代理（独立上下文） |
| `mcp_tool` | 调 MCP server 提供的工具 |

<v-click>

**`--image` flag 一行附图**：

```bash
codex --image ./design.png "按图实现"
```

</v-click>

---
transition: slide-up
---

# Slash 命令 (1/2)

| 命令 | 作用 |
| --- | --- |
| `/help` | 显示所有 slash 命令 |
| `/login` / `/logout` | 切账号 |
| `/model` | 切模型 |
| `/approvals` | 切审批模式 |
| `/sandbox` | 切 sandbox 模式 |
| `/init` | 生成 `AGENTS.md` 骨架 |

---
transition: slide-up
---

# Slash 命令 (2/2)

| 命令 | 作用 |
| --- | --- |
| `/clear` | 清空会话 |
| `/compact` | 总结后压缩对话 |
| `/cost` | 显示 token 用量 + 费用 |
| `/mcp` | 查看 MCP server 状态 |
| `/review` | PR 风格代码评审 |
| `/release-notes` | 看本版本更新 |
| `/quit` | 退出 |

---
transition: slide-up
---

# 子命令：非交互模式

```bash
# 单次执行
codex exec "总结 README.md 主要内容"

# 指定模型 + 模式
codex exec --model o3 -s workspace-write -a never \
  "重构这个文件"

# 恢复
codex resume --last
codex resume <session-id>

# 列出历史会话
codex resume

# 沙盒里跑单条命令
codex sandbox "npm test"

# 桌面 App
codex app
```

<v-click>

**适合**：CI 自动化、批量任务、一次性脚本。

</v-click>

---
transition: slide-up
---

# MCP（Model Context Protocol）(1/3)

Codex 一类支持 MCP，跟 Claude Code 完全互通

```toml
# Stdio MCP（最常见）
[mcp_servers.github]
command = "npx -y @modelcontextprotocol/server-github"
enabled = true
required = false
startup_timeout_sec = 10
tool_timeout_sec = 60
enabled_tools = ["repos/list", "search", "create_pr"]
env = { GITHUB_TOKEN = "$GITHUB_TOKEN" }

[mcp_servers.context7]
command = "npx -y @upstash/context7-mcp"

# 远程 HTTP MCP
[mcp_servers.anthropic_remote]
url = "https://example.com/mcp"
bearer_token_env_var = "MCP_TOKEN"
http_headers = { "X-Custom" = "value" }
```

---
transition: slide-up
---

# MCP：状态 + 常用 server (2/3)

```
> /mcp

github                ✓ connected   (3 tools enabled)
context7              ✓ connected   (2 tools)
anthropic_remote      ✓ connected   (5 tools)
```

<v-clicks>

| Server | 提供工具 |
| --- | --- |
| `@modelcontextprotocol/server-github` | Issue / PR / Repo |
| `@modelcontextprotocol/server-postgres` | Postgres 查询 |
| `@upstash/context7-mcp` | 最新库文档 |
| `chrome-devtools-mcp` | 浏览器操作 |
| `brave-search-mcp` | Brave Search |

</v-clicks>

---
transition: slide-up
---

# MCP：白名单 + 互通 (3/3)

```toml
[mcp_servers.github]
command = "npx -y @modelcontextprotocol/server-github"
enabled_tools = ["repos/list", "search"]   # 只启用部分
```

<v-click>

**enabled_tools 优势**：

- 减少模型选择空间 → 提升准确率
- 降低误用风险（如不让 Agent 删除 PR）
- 减少上下文 schema 占用

</v-click>

<v-click>

> 💡 **MCP 是开放协议**
>
> 同一个 MCP server 在 Codex / Claude Code / Cline 上都能跑——配置写一次到处用。

</v-click>

---
transition: slide-up
---

# Permissions：细粒度

```toml
default_permissions = ":workspace"

[permissions.strict]

[permissions.strict.filesystem]
"/home/user/projects" = "write"
"/etc" = "read"
"**/*.env" = "none"        # 拒绝读 .env

[permissions.strict.network]
enabled = true
mode = "limited"
domains = { "github.com" = "allow", "*.internal" = "deny" }
unix_sockets = { "/var/run/docker.sock" = "allow" }
```

<v-click>

适合企业内做更严格的访问控制——`.env` / 内网域名 / Docker socket 单独管。

</v-click>

---
transition: slide-up
---

# Subagents：并行任务

Codex 支持 spawn 子代理

```toml
[features]
multi_agent = true
```

```
> 帮我并行做三件事：
>   1. 用子代理查找所有 React 组件
>   2. 用子代理总结测试覆盖率
>   3. 用子代理评审 PR #123
```

<v-click>

**子代理特性**：

- 独立上下文跑，主线程不污染
- 失败可独立重试
- 适合并行 / 大搜索 / 领域专家场景

</v-click>

---
transition: slide-up
---

# Web Search

```toml
web_search = "cached"   # disabled / cached / live

[tools.web_search]
context_size = "medium"   # small / medium / large
allowed_domains = ["github.com", "stackoverflow.com"]
location = { country = "US", region = "CA" }
```

<v-clicks>

| 模式 | 说明 |
| --- | --- |
| `disabled` | 关闭网搜 |
| `cached` | 预索引快照（便宜 + 快） |
| `live` | 实时网搜（贵 + 信息新） |

</v-clicks>

<v-click>

`allowed_domains` 限制只搜白名单域名，避免低质量信息源污染上下文。

</v-click>

---
transition: slide-up
---

# Memory（持久化记忆）

```toml
[features]
memories = true

[memories]
generate_memories = true
use_memories = true
max_rollout_age_days = 30
min_rollout_idle_hours = 6
extract_model = "gpt-5.5"
```

<v-click>

Codex 会从历史会话中提取知识，下次自动复用。

</v-click>

<v-click>

> 💡 **默认关闭**
>
> 与 Claude Code 不同，Codex 的 memories 默认 `false`。需手动开启 `[features].memories = true` 并配置 `[memories]` 块。

</v-click>

---
transition: slide-up
---

# /review：代码评审

```
> /review
```

或 PR 模式：

```bash
codex exec --sandbox read-only \
  "Review the diff between main and HEAD"
```

<v-clicks>

**评审内容**：

- 代码风格 / 一致性
- 潜在 bug / 边界 case
- 性能 / 安全问题
- 测试覆盖建议

</v-clicks>

<v-click>

GitHub 集成后可触发 **PR 自动评审**（在 PR 上 @codex 触发）。

</v-click>

---
transition: slide-up
---

# Provider：OpenAI（默认）

```toml
model = "gpt-5.5"
model_provider = "openai"

[model_providers.openai]
base_url = "https://api.openai.com/v1"
env_key = "OPENAI_API_KEY"
```

<v-click>

需要环境变量 `OPENAI_API_KEY` 或通过 `codex login` OAuth 认证 ChatGPT 账号。

</v-click>

<v-click>

**自定义 base_url** 可走代理 / 私有 OpenAI 兼容端点（如 LiteLLM、Ollama）。

</v-click>

---
transition: slide-up
---

# Provider：Azure / OpenRouter

```toml
# Azure OpenAI
model_provider = "azure"

[model_providers.azure]
base_url = "https://<resource>.openai.azure.com/"
env_key = "AZURE_OPENAI_API_KEY"
http_headers = { "api-key" = "$AZURE_OPENAI_API_KEY" }

# OpenRouter（多模型聚合）
model = "anthropic/claude-opus-4-7"
model_provider = "openrouter"

[model_providers.openrouter]
name = "OpenRouter"
base_url = "https://openrouter.ai/api/v1"
env_key = "OPENROUTER_API_KEY"
```

<v-click>

**OpenRouter 用途**：通过单一 API key 访问 GPT / Claude / Gemini / 开源大模型——大陆访问的常见跳板。

</v-click>

---
transition: slide-up
---

# Provider：Anthropic 直连

```toml
model = "claude-opus-4-7"
model_provider = "anthropic"

[model_providers.anthropic]
name = "Anthropic"
base_url = "https://api.anthropic.com"
env_key = "ANTHROPIC_API_KEY"
```

<v-click>

可在 Codex 里直接调 Claude 模型——但失去了 Anthropic 模型在 Claude Code 里的某些深度优化（如 1M 上下文）。

</v-click>

<v-click>

**典型用法**：A/B 对比同一 prompt 在 GPT-5.5 / o3 / Claude Opus 上的表现。

</v-click>

---
transition: slide-up
---

# IDE 集成：VS Code 扩展

OpenAI 发布的官方 VS Code 扩展

<v-clicks>

**核心能力**：

- 选中代码后右键 → Refactor / Explain / Fix
- 文件树整合：点文件加进对话上下文
- diff 视图：apply_patch 提议可逐 hunk 接受
- 内嵌 Markdown 渲染对话

**和 CLI 共享配置**：`~/.codex/config.toml` + `AGENTS.md` 通用

</v-clicks>

<v-click>

> 💡 **Cursor / Windsurf**
>
> Cursor 和 Windsurf 也支持 Codex（内置整合）。同一份 config.toml + AGENTS.md 在多个 IDE 都能用。

</v-click>

---
transition: slide-up
---

# 桌面 App + Web

```bash
# 启动桌面 App
codex app
```

<v-clicks>

**桌面 App 特点**：

- GUI 包装的 CLI
- 与 CLI 共享会话历史
- 适合不爱终端的用户

**Web 版（chatgpt.com/codex）**：

- 浏览器即开即用
- 与 ChatGPT 共享对话历史
- 支持 GitHub 仓库直连

</v-clicks>

<v-click>

> ⚠️ **Web 版限制**
>
> 无本地文件 / shell、MCP 仅支持远程、hooks 不可用。**轻量场景用，日常还是 CLI**。

</v-click>

---
transition: slide-up
---

# vs Claude Code（基础对比）

| 维度 | Codex CLI | Claude Code |
| --- | --- | --- |
| 模型 | GPT / o-series + 任意 provider | Anthropic Opus / Sonnet / Haiku |
| 上下文 | ~200K（按模型） | 200K / 1M |
| 项目说明 | `AGENTS.md` | `CLAUDE.md` |
| 子目录覆盖 | ✓（override.md） | ✗ |
| Sandbox | 三层独立配置 | 权限规则 |
| 多 Provider / 开源 | ✓ / Apache-2.0 | ✗ / ✗ |

---
transition: slide-up
---

# vs Claude Code（功能对比）

| 维度 | Codex CLI | Claude Code |
| --- | --- | --- |
| Profiles | ✓ | ✗（单 settings） |
| Skills | ✗ | ✓（成熟） |
| Hooks | 受限 | ✓ |
| Subagents | ✓（multi_agent） | ✓ |
| Memory | ✓（默认关） | ✓（默认开） |
| 编辑机制 | `apply_patch`（diff） | `Edit`（string replace） |

<v-click>

**本质**：Codex 走「配置驱动」（toml），Claude Code 走「指令驱动」（skills）。

</v-click>

---
transition: slide-up
---

# 双工具共用建议

如果你**同时用 Codex + Claude Code**

<v-clicks>

- **AGENTS.md 与 CLAUDE.md 并存**：内容相同，分别由两个 Agent 识别
- **`.gitignore` 加 `~/.codex/auth.json`** 和 `~/.config/claude/credentials.json`：别误提交凭据
- **MCP 配置可复用**：MCP 协议开放，同一个 server 两边都能接
- **profiles 对应 settings.json**：Codex profiles 可类比 Claude Code 的多套 settings
- **怎么选**：日常深度编码用谁顺手就用谁；想对比效果就并行跑同一 prompt

</v-clicks>

<v-click>

> 💡 **作者实测建议**
>
> Plan / 复杂规划 → o3 vs Claude Opus；日常编码 → gpt-5.5 vs Sonnet 4.6；longest context → gpt-5.3-codex vs Opus[1m]。

</v-click>

---
transition: slide-up
---

# 大陆访问

Codex CLI 调 OpenAI / 第三方 API，国内直连均不通

<v-clicks>

| 方案 | 适合 | 操作 |
| --- | --- | --- |
| 代理（VPN / 机场） | 个人 | `HTTPS_PROXY=http://localhost:7890 codex` |
| OpenRouter 中转 | 团队 | 配置 OpenRouter provider |
| Azure 国际版 | 企业 | 配置 Azure provider（**香港/新加坡区**） |

</v-clicks>

```toml
# OpenRouter 中转 OpenAI 模型
model = "openai/gpt-5.5"
model_provider = "openrouter"

[model_providers.openrouter]
name = "OpenRouter"
base_url = "https://openrouter.ai/api/v1"
env_key = "OPENROUTER_API_KEY"
```

<v-click>

> ⚠️ **Azure 国内 region 暂未开放** —— Azure OpenAI 在国内 region 不可用，需配置国际 region。

</v-click>

---
transition: slide-up
---

# 实战 1：接手陌生项目

```
> 这是个新仓库我刚 clone。先帮我快速理解：
>   1. 项目用什么技术栈？
>   2. 主要功能有哪些？
>   3. 怎么本地起？
```

<v-click>

Codex 会：

- 调 `read` 看 `package.json` / `README.md` / `tsconfig.json`
- 调 `file_search` 看 `pages/**`、`routes/**`、`src/**` 目录结构
- 调 `grep` 找 dev / start 脚本

回总结后**自动 `/init` 生成 AGENTS.md 草稿**（如果不存在），下次启动直接复用。

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

Codex 流程：

1. `grep` 找路由实现文件
2. `read` 看代码 + 周边逻辑
3. `apply_patch` 加空值判断 / optional chain
4. `read` 看测试目录结构
5. `apply_patch` 加 unit test 复现 + 验证
6. `shell` 跑测试确认通过
7. 产出 commit 消息 + 总结

</v-click>

---
transition: slide-up
---

# 实战 3：CI 自动化

```bash
# .github/workflows/codex-review.yml 里跑
codex exec \
  --sandbox read-only \
  --ask-for-approval never \
  --model gpt-5.5 \
  "Review the diff between main and PR head"
```

<v-clicks>

**适合场景**：

- PR 自动评审
- 文档自动生成
- 测试用例自动补
- changelog 自动写

</v-clicks>

<v-click>

`--sandbox read-only` 保证 CI 内 Codex 不能动代码（评审场景）；改为 `workspace-write` 则可让 Codex 自己 commit 修复。

</v-click>

---
transition: slide-up
---

# 调试 Codex 自身

```bash
# 详细日志
codex --debug

# 启动时 dump 配置
codex --print-config

# 临时换 CODEX_HOME（沙盒不同配置）
CODEX_HOME=/tmp/codex-test codex

# 调日志级别
CODEX_LOG_LEVEL=trace codex

# 跳过更新提示
codex --no-update-check
```

<v-click>

日志位置：`~/.codex/logs/`，按会话 ID 分目录。

</v-click>

---
transition: slide-up
---

# 性能优化

<v-clicks>

- **大仓库**：用 `gpt-5.3-codex`（长上下文），或先 `/compact` 压缩历史
- **多文件读取慢**：一次 message 批量调多个 read
- **MCP 启动慢**：`enabled_tools` 限制工具 + `startup_timeout_sec` 调短
- **shell 拖慢**：sandbox 越严越慢；常用命令加 `allowed_commands` 白名单
- **频繁 patch 失败**：让 Codex 先 read 全文再 patch，减少冲突
- **reasoning_effort**：简单任务降 `low`，省 token + 快

</v-clicks>

---
transition: slide-up
---

# 常见错误码

| 现象 | 含义 |
| --- | --- |
| `authentication_error` | OAuth 过期 / API key 无效 |
| `rate_limit_error` | 触发速率限制 |
| `context_length_exceeded` | 上下文窗口满 |
| `sandbox_denied` | 文件 / 命令超出 sandbox 范围 |
| `patch_apply_failed` | apply_patch 应用失败 |
| `mcp_connection_failed` | MCP server 启动失败 |
| `provider_error` | provider API 报错 |

---
transition: slide-up
---

# 错误处理对策

- `authentication_error` → `codex login` 重 OAuth
- `context_length_exceeded` → `/compact` 或换长上下文模型
- `patch_apply_failed` → 让 Codex 重读文件后再 patch
- `sandbox_denied` → 切 `workspace-write` 或加 `writable_roots`
- `rate_limit_error` → 等待重试或切 provider
- `mcp_connection_failed` → 检查 server 路径 / `env` 配置

---
transition: slide-up
---

# 安全考量

<v-clicks>

- **`--dangerously-bypass` 仅容器内用**：本地直接开等于交出机器
- **`~/.codex/auth.json` 不要提交**：里面有凭据
- **`shell_environment_policy` 屏蔽敏感环境变量**：`exclude = ["*KEY*", "*TOKEN*"]`
- **`enabled_tools` 白名单 MCP 工具**：减少模型可调用的攻击面
- **AGENTS.md 是 prompt injection 面**：克隆陌生仓库先看内容
- **sandbox 默认 workspace-write**：不要降到 danger-full-access
- **permissions 拒绝 `.env`**：`"**/*.env" = "none"`

</v-clicks>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 主要变化 |
| --- | --- | --- |
| 0.1 | 2025 初 | 首个公测版（Rust 重写） |
| 0.5 | 2025 中 | Sandbox / Approval 三档体系 |
| 0.10 | 2025 末 | MCP 一类支持 / profiles |
| 0.50 | 2026 Q1 | AGENTS.md override / multi-agent |
| 0.130 | 2026 Q2 | 当前版 / unified_exec / 完整 features |

<v-click>

**关键演进**：Rust 重写 → Sandbox/Approval → AGENTS.md → multi-provider

</v-click>

---
transition: slide-up
---

# 学习路径

<v-clicks>

**Week 1 — 上手**：装 + login，写 `AGENTS.md`，用 `/init` 改小 bug

**Week 2 — 进阶**：切模型、调 `reasoning_effort`、试 `--full-auto`

**Week 3 — 扩展**：装 MCP server（GitHub / Context7）、配 profiles、试 `/review`

**Week 4 — 工作流**：细粒度 `permissions`、spawn subagent、CI 集成 `codex exec`

</v-clicks>

---
transition: slide-up
---

# 资源链接

| 资源 | 链接 |
| --- | --- |
| 官方文档 | [developers.openai.com/codex](https://developers.openai.com/codex) |
| GitHub | [openai/codex](https://github.com/openai/codex) |
| CLI 参考 | [codex/cli/reference](https://developers.openai.com/codex/cli/reference) |
| AGENTS.md | [codex/guides/agents-md](https://developers.openai.com/codex/guides/agents-md) |
| 最佳实践 | [codex/learn/best-practices](https://developers.openai.com/codex/learn/best-practices) |
| Prompting 指南 | [Codex Prompting Guide](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide) |
| Web / 状态页 | [chatgpt.com/codex](https://chatgpt.com/codex) / [status.openai.com](https://status.openai.com/) |

---
layout: center
class: text-center
---

# 总结

把 Codex CLI 当**配置驱动的开源 Agent** 用

<div class="mt-6 text-left max-w-2xl mx-auto text-base op-90">

- **基础**：AGENTS.md + Sandbox + Approval 三件套
- **多 Provider**：OpenAI / Azure / OpenRouter / Anthropic 一键切
- **可观测**：`/cost` 看花费、`/approvals` 切策略、`--print-config` 看配置
- **多端**：CLI / VS Code / Cursor / 桌面 / Web 一致体验
- **与 Claude Code 互补**：AGENTS.md 与 CLAUDE.md 并存，MCP 配置可共用

</div>

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://developers.openai.com/codex" target="_blank">developers.openai.com/codex</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/openai/codex" target="_blank">openai/codex</a>
</div>
