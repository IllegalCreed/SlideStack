---
theme: seriph
background: https://cover.sli.dev
title: MCP 协议基础
info: |
  Model Context Protocol 完全入门：JSON-RPC · Transport · 五原语 · 安全

  Learn more at [https://modelcontextprotocol.io](https://modelcontextprotocol.io)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# MCP 协议基础

AI 应用的 USB-C · JSON-RPC 2.0 · 2025-11-25

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
MCP 由 Anthropic 2024-11 发布，2025-11-25 为当前最新规范版本。
-->

---
transition: fade-out
---

# 什么是 MCP

Anthropic 2024-11 开放的「**AI 应用 USB-C**」协议

- **协议基底**：JSON-RPC 2.0 + UTF-8 编码
- **双层架构**：Data 层（消息 + 生命周期 + 原语）+ Transport 层
- **三层参与者**：Host / Client / Server
- **五原语**：Resources / Tools / Prompts / Sampling / Roots
- **开放治理**：已捐赠 Linux Foundation，SEP 提案流程
- **跨厂商生态**：Claude / Cursor / Cline / VS Code / ChatGPT 均已接入

> MCP ≠ 某框架，也 ≠ 某模型的 function calling——是协议层开放标准。

<!--
MCP 定义「上下文如何交换」，不规定 AI 应用如何使用 LLM。
-->

---

# 三层参与者

| 角色 | 职责 | 例子 |
|------|------|------|
| **Host** | 协调多个 client 的 AI 应用 | Claude Desktop / VS Code |
| **Client** | 与**单个** server 维持一条专属连接 | Host 内部为每个 server 创建 |
| **Server** | 提供上下文的程序（本地或远程） | 文件 / DB / GitHub server |

- 1 Host 可同时连 N 个 Server
- 每个连接独立隔离，互不影响
- Host 负责用户交互与权限审批

<!--
1 Host → N Client → N Server 的拓扑是 MCP 的基础结构。
-->

---

# 双层架构

**Data 层**（跨 transport 复用）

- JSON-RPC 2.0 消息格式
- 生命周期与能力协商
- 五类原语 + 通知机制

**Transport 层**（通信机制 / 鉴权）

- `stdio`：本地子进程，newline-delimited JSON
- `Streamable HTTP`：远程单一 endpoint + SSE 流

> 同一份 server 代码，理论上可同时挂到两个 transport 上。

<!--
Data 层与 Transport 层解耦是 MCP 设计的关键。
-->

---

# 生命周期

三阶段：`initialize` → `notifications/initialized` → operation → shutdown

**Initialization**

- Client 发 `initialize`：含 `protocolVersion` + `capabilities` + `clientInfo`
- Server 回选定的 `protocolVersion` + `serverInfo` + `capabilities`

**版本协商**

- Client 发其最新版
- Server 同版回同版，否则回自己最新版
- Client 不支持则断开

**Shutdown**：无专用消息，靠 transport 关闭（stdio close stdin → SIGTERM → SIGKILL）

> 未协商的能力调用返回 `-32601 Method not found`。

<!--
能力协商是硬前提，operation 阶段调用任何原语都需先声明 capability。
-->

---

# Transport：stdio

**本地通信首选，零网络开销**

- Client 拉起 Server 子进程（`command` + `args`）
- stdin/stdout 传 newline-delimited JSON
- stderr 仅用于日志
- **stdout 严禁写非协议内容**

| 语言 | 日志写法 |
|------|------|
| TypeScript | `console.error(...)` |
| Python | `print(..., file=sys.stderr)` |
| Java | `System.err.println(...)` |
| Go | `fmt.Fprintln(os.Stderr, ...)` |
| Rust | `eprintln!(...)` |

> `console.log` / `print` 写 stdout = server 直接崩坏。

<!--
stdio 是 99% 本地 MCP server 的默认 transport。
-->

---

# Transport：Streamable HTTP

**远程连接首选，取代旧 HTTP+SSE**

- 单一 endpoint（如 `/mcp`），支持 POST + GET
- `Accept` 须含 `application/json` 与 `text/event-stream`
- `Mcp-Session-Id` 头标识会话
- SSE event id + `Last-Event-ID` 头**断线续传**
- HTTP DELETE 终止会话
- 推荐叠加 OAuth 2.1 / OIDC 鉴权

> 2024-11-05 旧 HTTP+SSE transport（双端点）已在 2025-03-26 标记 `deprecated`。

<!--
新写的远程 server 应直接用 Streamable HTTP，不要再用旧 SSE。
-->

---
layout: two-cols
---

# Server 三原语

按「谁来触发」划分

**Resources（应用控制）**

- `resources/list` / `read`
- `templates/list`（RFC 6570 URI）
- 内容为 text 或 base64 blob
- 适合「给模型读的上下文」

**Tools（模型控制）**

- `tools/list` / `call`
- LLM 自动发现与调用
- **需 human-in-the-loop**

::right::

# Prompts

**Prompts（用户控制）**

- `prompts/list` / `get`
- 返回 `PromptMessage[]`
- 常**作 slash command** 暴露
- 用户显式触发，不让模型自动决定

| 原语 | 控制方 |
|------|------|
| Resources | 应用 |
| Tools | 模型 |
| Prompts | 用户 |

<!--
三原语的区分点在于「谁来决定触发」。
-->

---

# Tool 字段与错误

**字段规则**

- `name`：1–128 字符，`A-Za-z0-9_-./`，大小写敏感，server 内唯一
- `inputSchema`：必填 JSON Schema 2020-12 object（无参写 `{type:"object", additionalProperties:false}`）
- `outputSchema` + `structuredContent`：结构化输出
- `annotations`：`readOnly` / `destructive` / `idempotent` / `openWorld` Hint

**两类错误（关键区分）**

| 类型 | 返回方式 | 用途 |
|------|------|------|
| 工具执行错误 | `isError:true` + 文本 | LLM 自纠正后重试 |
| 协议错误 | JSON-RPC error `-32xxx` | 结构本身有问题 |

> `annotations` **视为不可信**——不能据此做自动批准。

<!--
把业务错误当 JSON-RPC error 是常见反模式，LLM 失去自纠正机会。
-->

---
layout: two-cols
---

# Client 原语

**Sampling（反向调 LLM）**

- `sampling/createMessage`
- `modelPreferences`：hints + cost/speed/intelligence 三维
- 2025-11-25 新增 `tools` + `toolChoice`
- **强制 human-in-the-loop**

**Roots（文件系统边界）**

- `roots/list` 返回 `file://` URI
- `notifications/roots/list_changed`
- 定义 server 可操作范围

::right::

# Elicitation

**Elicitation（2025-11-25）**

- `elicitation/create`
- 两种模式：`form` / `url`
- server 向用户**请求输入或确认**
- 用于工具执行中澄清问题

**Logging**

- `notifications/message`
- server → client 结构化日志
- 含 log level

<!--
Sampling 是嵌套 LLM 调用，无审查 = 提示注入面。
-->

---

# 第一个 MCP Server

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// 创建 server 实例，声明名称与版本
const server = new McpServer({ name: "echo-server", version: "0.1.0" });

// 注册工具：原样回显输入文本
server.registerTool(
  "echo",
  { description: "原样回显输入文本",
    inputSchema: { text: { type: "string" } } },
  async ({ text }) => ({ content: [{ type: "text", text: `echo: ${text}` }] }),
);

// 挂到 stdio transport 并启动
await server.connect(new StdioServerTransport());
```

<!--
TypeScript SDK：McpServer + registerTool + StdioServerTransport + connect。
-->

---

# 挂到 Claude Desktop

`claude_desktop_config.json` 配置：

```json
{
  "mcpServers": {
    "echo": {
      "command": "node",
      "args": ["/absolute/path/to/server.js"]
    }
  }
}
```

**注意点**

- `args` 必须用**绝对路径**
- Claude Desktop 以子进程方式拉起 server
- 通过 stdio 双向通信
- 重启 Claude Desktop 后生效

> Python SDK 用 `FastMCP` + `@mcp.tool()` 装饰器 + `mcp.run(transport="stdio")`。

<!--
绝对路径是 Claude Desktop 配置最常见的踩坑点。
-->

---

# 安全要点

**Streamable HTTP 防 DNS rebinding**

- 本地绑 `127.0.0.1`，不要绑 `0.0.0.0`
- 校验 `Origin` 头，拒绝跨域
- 实现 OAuth / OIDC 鉴权

**stdio server**

- stdout 是 JSON-RPC 通道，**严禁写日志**
- 任何非协议字节 = server 失联

**Tool annotations**

- `readOnlyHint` 等位**视为不可信**
- 不能据此做自动批准决策

**Sampling / Tools**

- 都需 **human-in-the-loop**
- Host 须让用户审查 prompt / 响应 / 工具调用

<!--
远程 MCP server 的安全模型仍偏手动，靠开发者自觉。
-->

---
layout: quote
---

# stdout 是 JSON-RPC 的命脉

「在 stdio server 里写 `console.log` = 直接拆掉协议通道。」

---
layout: center
class: text-center
---

# 反模式速记

- stdio server 用 `console.log` 写日志
- 未协商 capability 就调用原语（`-32601`）
- 业务错误当 JSON-RPC protocol error 返回
- 信任 `readOnlyHint` 做自动批准
- Sampling 无 human-in-the-loop
- HTTP server 绑 `0.0.0.0` + 不校验 Origin
- 仍用 2024-11-05 旧 HTTP+SSE transport
- Tool `inputSchema` 写 null 或省略
- 硬编码模型名（应用 `modelPreferences`）

<!--
最常见的 9 个踩坑，开发前过一遍。
-->

---
layout: center
class: text-center
---

# 小结

MCP = AI 应用的 USB-C

JSON-RPC · 三参与者 · 五原语 · stdio/HTTP · 2025-11-25

**能力协商是前提 · stdout 是命脉 · Sampling 要审查**

[文档](https://modelcontextprotocol.io) · [规范](https://modelcontextprotocol.io/specification) · [TS SDK](https://github.com/modelcontextprotocol/typescript-sdk)

<!--
掌握能力协商 + stdout 纪律 + Sampling 审查三件套，就能写出生产可用的 MCP server。
-->
