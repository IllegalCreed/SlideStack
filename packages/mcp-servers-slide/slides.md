---
theme: seriph
background: https://cover.sli.dev
title: 常用 MCP Server 集成
info: |
  常用 MCP Server 集成：12 个 server · 两种传输 · 配置与安全

  Learn more at https://modelcontextprotocol.io
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 常用 MCP Server 集成

12 个常用 Server · 两种传输 · 协议 2025-11-25

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
MCP 协议当前最新版 2025-11-25，定义 stdio 与 Streamable HTTP 两种传输。
-->

---
transition: fade-out
---

# 什么是 MCP Server

按 MCP 规范暴露能力的**独立进程**

- **协议统一**：JSON-RPC + Tools / Resources / Prompts 三原语
- **本地与远程并存**：stdio 子进程（数据不出本机）/ Streamable HTTP 远程端点
- **生态丰富**：搜索、代码、浏览器、数据库、设计、办公、监控全覆盖
- **官方仓库活跃**：Filesystem / Git / Memory / Fetch / Sequential Thinking / Time

> **MCP Server ≠ 安全边界**：本地 stdio 与 client 同权限运行；远程 HTTP 必须做 OAuth + Origin 校验。

<!--
强调「非安全边界」是 MCP 安全设计的核心前提。
-->

---

# 两种传输对比

| 维度 | stdio | Streamable HTTP |
|------|-------|-----------------|
| **进程模型** | client 把 server 当**子进程** | server 独立进程，多 client |
| **消息通道** | stdin 读 / stdout 写 | 单一 endpoint，POST + GET（SSE 流） |
| **认证** | 进程级（无协议级 auth） | OAuth / Bearer Token |
| **典型场景** | 本地工具（Filesystem / Playwright） | 远程 SaaS（GitHub / Notion） |

**协议版本演进**

- 2024-11-05：HTTP+SSE 旧传输
- 2025-03-26：**Streamable HTTP 取代 SSE**
- 2025-11-25：**当前最新版**

> 旧 SSE 端点仅作向后兼容保留；客户端探测先 POST，返回 400/404/405 再降级走老 SSE。

<!--
stdio 是默认推荐方式，敏感操作保留 human-in-the-loop。
-->

---

# 三大原语与 ToolAnnotations

| 原语 | 含义 | 典型例子 |
|------|------|---------|
| **Tools** | 模型可调用函数（带副作用） | `brave_web_search` / `browser_click` |
| **Resources** | 模型可读数据（只读） | `memo://insights` / `file:///README.md` |
| **Prompts** | 可复用提示模板 | `mcp-demo` / `code-review` |

**ToolAnnotations 四 hint 声明副作用**

| hint | 含义 |
|------|------|
| `readOnlyHint` | 是否纯读无副作用 |
| `destructiveHint` | 是否有破坏性 |
| `idempotentHint` | 是否幂等 |
| `openWorldHint` | 是否与外部世界交互（防路径逃逸） |

> Filesystem MCP 所有工具 `openWorldHint=false`——这是防路径逃逸的核心机制。

<!--
客户端按 hint 决定是否需要人类确认。
-->

---
layout: two-cols
---

# 配置文件结构

`claude_desktop_config.json` 顶层 `mcpServers`，每条三字段：

| 字段 | 作用 |
|------|------|
| `command` | `npx` / `uvx` / `node` / `cmd` / `docker` |
| `args` | 命令参数数组 |
| `env` | API Key / Token |

**API Key 三原则**

- 走 `env` 字段
- 入 `.gitignore`
- **绝不硬编码**进 config

::right::

# Windows 平台坑

`npx` 类 server 必须用 `cmd /c` 包裹：

```json
{
  "command": "cmd",
  "args": ["/c", "npx", "-y",
    "@modelcontextprotocol/server-filesystem",
    "C:\\Users\\me\\projects"]
}
```

> `uvx`（Python 包）**无需** `cmd /c` 包裹；JSON 路径反斜杠必须 `\\` 转义。

<!--
Windows 上 npx 找不到可执行文件是最常见配置错误。
-->

---

# 12 个常用 Server 速览

| Server | 包名 / 端点 | 传输 |
|--------|------------|------|
| **Brave Search** | `@brave/brave-search-mcp-server` | stdio |
| **GitHub** | `ghcr.io/github/github-mcp-server` 或 `api.githubcopilot.com/mcp/` | stdio / HTTP |
| **Context7** | `@upstash/context7-mcp` 或 `mcp.context7.com/mcp` | stdio / HTTP |
| **Playwright** | `@playwright/mcp@latest` | stdio |
| **Chrome DevTools** | `chrome-devtools-mcp@latest` | stdio |
| **Filesystem** | `@modelcontextprotocol/server-filesystem` | stdio + Roots |
| **SQLite** | `mcp-server-sqlite`（uvx） | stdio |
| **Notion** | `mcp.notion.com` 或 `makenotion/notion-mcp-server` | HTTP / stdio |
| **Sentry** | `mcp.sentry.dev` 或 `getsentry/sentry-mcp` | HTTP / stdio |
| **Supabase / Figma / Blender** | 各官方仓库 | stdio / HTTP |

> 2025-05 起 Slack / Google Drive / PostgreSQL / Puppeteer 等已归档至 `servers-archived`（read-only）。

<!--
Brave Search / GitHub / Sentry 已由各厂官方仓库接力维护。
-->

---

# 搜索类：Brave Search

`@brave/brave-search-mcp-server`（MIT，7 工具）

| 工具 | 用途 |
|------|------|
| `brave_web_search` | 通用网页搜索 |
| `brave_local_search` | 本地搜索（非 Pro 回退 web） |
| `brave_news_search` | 新闻搜索（默认近 24h） |
| `brave_image_search` | 图像搜索 |
| `brave_video_search` | 视频搜索 |
| `brave_place_search` | 按坐标 / 地点 POI |
| `brave_summarizer` | 摘要（需 web search 返回的 key） |

**配置**

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@brave/brave-search-mcp-server"],
      "env": { "BRAVE_API_KEY": "BSAxxx_xxxx" }
    }
  }
}
```

> `BRAVE_API_KEY` 必填；免费层有月度配额，超限降速。

<!--
非 Pro 计划下 brave_local_search 会回退到 web search。
-->

---
layout: two-cols
---

# GitHub 与 Context7

**GitHub MCP**：远程 `api.githubcopilot.com/mcp/`，PAT 优先于 OAuth

- `--toolsets`：context / repos / issues / pull_requests / users / actions
- 默认开 `context + repos + issues + pull_requests + users`
- PAT scope 最小：仅读 `read:org`，建 PR 才加 `repo`

**Context7**：两步工作流

- `resolve-library-id`：返回 `/org/project` 形式 `libraryId`
- `query-docs`：按 `query` 取文档片段
- `CONTEXT7_API_KEY` 可选（仅提速率）

::right::

# Filesystem 与 SQLite

**Filesystem**：13 工具

- 允许目录：CLI 参数（静态）/ Roots 协议（运行时动态）
- 所有工具 `openWorldHint=false` 防路径逃逸
- `edit_file` 支持 `dryRun` + git 风格 diff

**SQLite**：已归档

- 工具：`read_query` / `write_query` / `create_table` / `list_tables`
- 资源：`memo://insights`
- **仅 BI 演示定位，别挂生产库**

<!--
GitHub PAT 定期轮换；Filesystem Roots 协议无需重启动态替换允许目录。
-->

---

# Playwright MCP

`@playwright/mcp@latest`（Microsoft），跨浏览器通用自动化

- **默认走 accessibility tree**：`browser_snapshot` 优于截图，截图不能用于操作
- **坐标模式需显式开**：`--caps=vision`
- **浏览器选择**：`--browser=chromium|firefox|webkit|msedge`

**核心工具**

- `browser_navigate` / `browser_click` / `browser_type` / `browser_fill_form`
- `browser_press_key` / `browser_hover` / `browser_drag`
- `browser_take_screenshot` / `browser_find` / `browser_wait_for`
- `browser_evaluate` / `browser_console_messages` / `browser_network_requests`

> **`browser_run_code_unsafe` 等同 RCE**——浏览器自动化类 server 不是安全边界。

<!--
Playwright 的核心哲学：让 LLM 用 a11y tree 而非视觉坐标操作页面。
-->

---

# Chrome DevTools MCP vs Playwright

`chrome-devtools-mcp@latest`（Google，52 工具），Chrome 专用

| 维度 | Playwright MCP | Chrome DevTools MCP |
|------|----------------|---------------------|
| **浏览器** | chromium / firefox / webkit / msedge | Chrome 专用 |
| **核心价值** | 通用自动化、跨浏览器 | 性能 trace + Lighthouse + heap snapshot |
| **特殊能力** | 多浏览器、storage state | `performance_start_trace` / `lighthouse_audit` / `take_heapsnapshot` / CrUX |
| **典型场景** | 表单 / 抓取 / E2E | 性能调优 / 内存泄漏 / Core Web Vitals |

**Chrome DevTools 特有**

- `lighthouse_audit`（accessibility / SEO / best practices）
- `take_heapsnapshot`（内存分析）
- `performance_start_trace` + `performance_analyze_insight`
- Chrome 144+ 支持 `--autoConnect` 直连已开浏览器

> 性能 / 内存调试选 Chrome DevTools；通用自动化优先 Playwright。

<!--
两者定位差异是常见混淆点，重点强调。
-->

---
layout: two-cols
---

# 数据类：Notion

官方 `makenotion/notion-mcp-server`（v2.0 共 22 工具）

- **远程推荐**：`mcp.notion.com`，OAuth + Dynamic Client Registration
- **本地**：stdio 用 `NOTION_TOKEN`

**v2.0 关键变化**

- 迁移到 Notion API **2025-09-03** 版
- database-centric → **data source 抽象**
- 新增 `retrieve-page-markdown` / `update-page-markdown`

> 先用 Read content 权限做**只读 token** 验证流程。

::right::

# 其他数据 / 设计类

**Sentry**：远程 `mcp.sentry.dev` OAuth；本地 `SENTRY_AUTH_TOKEN` + org/project slug

**Supabase**：用 PAT，建库 / 管表 / 拉配置

**Figma**：官方 Dev Mode MCP（桌面会话本地 3845）；社区 Framelink（`--figma-api-key`）

**Blender**：官方 Lab + 社区 ahujasid/blender-mcp

> Blender 官方明说「**无 guard 执行 LLM 代码，可能删 / 外传数据**」，必须隔离运行。

<!--
Blender 类无约束代码执行 server 是高危场景。
-->

---

# 五大安全攻击向量

| 攻击 | 入口 | 缓解 |
|------|------|------|
| **Confused Deputy** | 静态 client_id + 动态注册 | 校验 redirect_uri + CSRF token |
| **Token Passthrough** | server 把 client token 不校验 audience 直接转发下游 | **规范明令禁止**；只接受发给本 server 的 token |
| **SSRF** | OAuth metadata URL 指向 `169.254.169.254` 元数据 | metadata IP allowlist |
| **Session Hijacking** | 可预测 session ID 或拿 `MCP-Session-Id` 当认证 | 密码学随机 + 绑定 user_id |
| **Local Server Compromise** | 恶意 startup command 藏 `curl` 外传 `~/.ssh` | 只跑可信源；逐条核对 |

> 远程 MCP server 三件套：**强制 OAuth + 校验 Origin 头 + 只绑 127.0.0.1**（不绑 0.0.0.0）。

<!--
Token Passthrough 是规范明令禁止的反模式，会绕过限流 / 审计 / 信任边界。
-->

---

# Inspector 调试 + 目录站性质

**MCP Inspector**：`npx @modelcontextprotocol/inspector`，浏览器 UI 调试任意 server

```bash
# 启动 Inspector（默认开浏览器）
npx @modelcontextprotocol/inspector

# 直接连某个 server
npx @modelcontextprotocol/inspector npx -y \
  @modelcontextprotocol/server-filesystem /tmp
```

- 选 stdio 或 Streamable HTTP 传输
- 直接发起 `tools/list` / `tools/call` / `resources/list`
- 实时看 server 日志，定位配置错误

> **社区目录站**（mcp.so / glama.ai / Smithery / MCPFind）**均为社区维护、非官方审核**——恶意 startup command 可藏 `curl` 外传 `~/.ssh`，必须逐条核对。

<!--
上线前用 Inspector 交互式验证，能避免 80% 配置类问题。
-->

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 明文 API Key 入 git（应走 env + `.gitignore`）
- 远程 server 不认证 + 绑 0.0.0.0 + 不校验 Origin（DNS rebinding 入口）
- Token passthrough（规范禁止）
- 拿 `MCP-Session-Id` 做认证（Session Hijacking）
- SQLite MCP 当生产数据库网关（应只读 + 副本）
- 混淆 Playwright 与 Chrome DevTools 定位
- Notion MCP 第一天就用全读写 token（应先 read-only）
- 盲目信任 mcp.so / glama.ai 配置直接复制粘贴启动
- Windows 漏 `cmd /c` 包裹 `npx`（`uvx` 不需要）

<!--
社区目录站配置直接复制粘贴是高频中招路径。
-->

---
layout: center
class: text-center
---

# 小结

MCP Server = 协议统一的能力提供方

12 个常用 Server · 两种传输 · 协议 2025-11-25

**stdio 优先 · API Key 走 env · 远程必做 OAuth + Origin · Inspector 先验**

[规范](https://modelcontextprotocol.io/specification/2025-11-25) · [安全最佳实践](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices) · [servers 仓库](https://github.com/modelcontextprotocol/servers)

<!--
掌握「非安全边界」+「5 大攻击向量」+「Inspector 先验」，就能把 MCP Server 用到生产水准。
-->
