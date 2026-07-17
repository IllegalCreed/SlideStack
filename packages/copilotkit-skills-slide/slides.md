---
theme: seriph
background: https://cover.sli.dev
title: CopilotKit Skills
info: |
  CopilotKit 官方 agent 技能集：给 React 应用加 AI copilot 的全生命周期技能。
  CopilotKit/skills，遵 agentskills.io，MIT。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# CopilotKit Skills

CopilotKit 官方技能集——给 React 应用加 **AI copilot** 的全生命周期

<div class="pt-6 opacity-80">
CopilotKit/skills · 路由 skill + 8 专用 · v2 / AG-UI · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/CopilotKit/CopilotKit/tree/main/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #6366f1 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
CopilotKit Skills 是 CopilotKit 官方的 agent 技能集，教 AI 助手用 CopilotKit v2 API 从零到上线地给 React 应用加 AI copilot。
-->

---
transition: fade-out
---

# 官方出品，一条命令装

教 AI agent 用 CopilotKit **v2**（`@copilotkit/*`）建产品级 copilot

<v-clicks>

- **CopilotKit** = 给 React 应用加 AI 副驾 / 生成式 UI 的框架
- **skills** = 把「初装 → 建功能 → 集成 → 调试 → 升级 → 贡献」拆成可按需调用的技能
- 遵 [agentskills.io](https://agentskills.io) 开放格式，跨 Claude Code / Codex / Cursor 通用

</v-clicks>

<div v-click class="mt-5">

```bash
npx skills add CopilotKit/CopilotKit/skills -y   # fresh clone，永远拿最新
```

</div>

<div v-click class="mt-3 text-sm opacity-70">

权威源已迁入主 monorepo `CopilotKit/CopilotKit` 的 `skills/`；独立仓 `CopilotKit/skills` 不再是 source of truth。

</div>

<style>
h1 { background: linear-gradient(45deg, #6366f1 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
一条命令装进任意 agent CLI。注意仓库已迁移到主 monorepo，安装命令用 CopilotKit/CopilotKit/skills。
-->

---
transition: fade-out
---

# 1 路由 + 8 专用

一个入口 skill，按任务分派到 8 个专用 sub-skill

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**建功能全生命周期**

- `copilotkit` — 路由入口
- `copilotkit-setup` — 初装接线
- `copilotkit-develop` — 建功能
- `copilotkit-integrations` — 接 agent 框架

</div>
<div v-click>

**运维与协议**

- `copilotkit-debug` — 排障
- `copilotkit-upgrade` — 版本迁移
- `copilotkit-agui` — AG-UI 自建后端
- `copilotkit-contribute` / `-self-update`

</div>
</div>

<div v-click class="mt-5 text-center text-sm opacity-80">

不是零散 prompt，而是与源码同仓、随版本同步的**技能矩阵**。

</div>

<style>
h1 { background: linear-gradient(45deg, #6366f1 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
这套技能是 1 路由加 8 专用的矩阵，覆盖 CopilotKit 全生命周期，与源码同仓同步更新。
-->

---
transition: fade-out
---

# 路由 skill：按任务分派

入口 `copilotkit` 自己不干活，靠 Routing Table 分派

| 任务 | 分派到 |
| --- | --- |
| 初装 / 加进项目 | `copilotkit-setup` |
| 建功能（工具 / 状态 / 生成式 UI） | `copilotkit-develop` |
| 接 agent 框架（LangGraph / CrewAI…） | `copilotkit-integrations` |
| 调错、修 runtime | `copilotkit-debug` |
| 升级版本、迁移 API | `copilotkit-upgrade` |
| AG-UI 协议、自建后端 | `copilotkit-agui` |

<div v-click class="mt-3 text-center text-sm opacity-80">

两条约定：**任务模糊先问一句**再路由；**默认路径 = `copilotkit-setup`**。

</div>

<style>
h1 { background: linear-gradient(45deg, #6366f1 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
路由 skill 的核心是一张 Routing Table，按你想做什么分派。任务模糊先问一句，默认走 setup。
-->

---
transition: fade-out
---

# CopilotKit 是什么

给 React 应用加 AI copilot / 生成式 UI

<div class="grid grid-cols-2 gap-6 mt-4">
<div>

**它让你嵌入**

- 聊天 UI：`CopilotChat` / `Sidebar` / `Popup`
- 前端工具：agent 调浏览器里的函数
- 共享状态：把应用数据喂给 agent
- 生成式 UI + 人在环路

</div>
<div v-click>

**v2 三层栈（建在 AG-UI 上）**

- `@copilotkit/runtime` — 服务端，托管 agent
- `@copilotkit/core` — 状态 / 工具注册表
- `@copilotkit/react` — provider / 组件 / hook

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #6366f1 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
CopilotKit 给 React 应用加聊天、前端工具、共享状态、生成式 UI、人在环路。v2 栈分 runtime、core、react 三层，都建在 AG-UI 协议上。
-->

---
transition: fade-out
---

# setup：五步跑通首个聊天

框架检测 → 装包 → runtime → provider → Key

```typescript
// 服务端：app/api/copilotkit/[[...slug]]/route.ts
import { CopilotRuntime, createCopilotEndpoint } from "@copilotkit/runtime";
import { BuiltInAgent } from "@copilotkit/agent";
import { handle } from "hono/vercel";

const runtime = new CopilotRuntime({
  agents: { default: new BuiltInAgent({ model: "openai/gpt-4o" }) },
});
const app = createCopilotEndpoint({ runtime, basePath: "/api/copilotkit" });
export const GET = handle(app), POST = handle(app);
```

<div v-click class="mt-3 text-sm">

前端：`<CopilotKitProvider runtimeUrl="/api/copilotkit"><CopilotChat/></CopilotKitProvider>` + 配 `OPENAI_API_KEY`（按 model 前缀自动取）。

</div>

<style>
h1 { background: linear-gradient(45deg, #6366f1 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
setup 教从零跑通：服务端建 CopilotRuntime 用 createCopilotEndpoint 暴露，前端 CopilotKitProvider 包住加 CopilotChat，配 Key。BuiltInAgent 按 model 前缀自动取 env key。
-->

---
transition: fade-out
---

# develop：v2 hook 全家桶

在浏览器侧建功能

| Hook | 用途 |
| --- | --- |
| `useFrontendTool` | 让 agent 调浏览器里的函数 |
| `useAgentContext` | 把可 JSON 序列化的应用状态喂给 agent |
| `useRenderToolCall` | 生成式 UI：工具调用时渲染自定义卡片 |
| `useInterrupt` / `useHumanInTheLoop` | 人在环路，暂停等用户确认 |
| `useAgent` | 拿 agent 实例、订阅消息 / 状态 / run |
| `useSuggestions` | 建议 pill（静态或 LLM 生成） |

<style>
h1 { background: linear-gradient(45deg, #6366f1 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
develop 是 v2 hook 全家桶：前端工具、共享状态、生成式 UI、人在环路、agent 订阅、建议。注意都是 v2 名字，v1 的 useCopilotAction 已改名。
-->

---
transition: fade-out
---

# integrations：经 AG-UI 接 agent 框架

架构恒定：agent 服务器 → AG-UI 适配器 → CopilotKit runtime → 前端

| 框架 | route.ts 里的 AG-UI client |
| --- | --- |
| LangGraph | `LangGraphAgent` / `LangGraphHttpAgent` |
| CrewAI | `CrewAIAgent` / `HttpAgent` |
| Mastra | `MastraAgent` |
| PydanticAI / ADK / Agno / Strands | `HttpAgent`（通用） |
| LlamaIndex | `LlamaIndexAgent` |
| A2A / MCP Apps | `A2AMiddlewareAgent` / `MCPAppsMiddleware` |

<style>
h1 { background: linear-gradient(45deg, #6366f1 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
integrations 把 LangGraph、CrewAI、Mastra 等经 AG-UI 协议接进前端。选对 AG-UI client 类是关键，通用框架用 HttpAgent。
-->

---
transition: fade-out
---

# AG-UI 协议：事件驱动

CopilotKit v2 的通信底座——类型化事件经 SSE 流式传输

| 事件族 | 代表事件 |
| --- | --- |
| Lifecycle | `RUN_STARTED` / `RUN_FINISHED` / `RUN_ERROR` |
| Text | `TEXT_MESSAGE_START` / `_CONTENT` / `_END` |
| Tool Calls | `TOOL_CALL_START` / `_ARGS` / `_END` / `_RESULT` |
| State | `STATE_SNAPSHOT` / `STATE_DELTA`（JSON Patch） |
| Reasoning / Activity | 思维链可见性 / 结构化进度 |
| Custom | `RAW` / `CUSTOM` |

<style>
h1 { background: linear-gradient(45deg, #6366f1 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
AG-UI 是 CopilotKit 的开放事件协议。agent 实现 AbstractAgent.run 返回 Observable，事件分七族经 SSE 传输，state delta 用 RFC 6902 JSON Patch。
-->

---
transition: fade-out
---

# AG-UI：铁律 + SSE 线格式

<div class="grid grid-cols-2 gap-6 mt-3">
<div>

**协议铁律**

- 每个 run 必 `RUN_STARTED` 开头
- 必 `RUN_FINISHED` / `RUN_ERROR` 收尾
- `TEXT_MESSAGE_CONTENT.delta` 不能空
- 工具事件用 `toolCallId` 关联
- 多 run 顺序执行、消息累积

</div>
<div v-click>

**SSE 就是一行行 data:**

```text
data: {"type":"RUN_STARTED",...}
data: {"type":"TEXT_MESSAGE_
  CONTENT","delta":"Hi"}
data: {"type":"RUN_FINISHED",...}
```

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #6366f1 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
AG-UI 铁律：run 必须闭合、delta 非空、工具用 toolCallId 关联。SSE 线格式就是每个事件一行 data 冒号加 JSON。
-->

---
transition: fade-out
---

# debug：先取证，后开方

不猜——先集信息再对症

<v-clicks>

1. **集信息**：包版本（不一致是常见根因）、runtime 模式、`runtimeUrl` 是否匹配 `basePath`、agent 类型、精确错误
2. **查错误码**：v1（`AGENT_NOT_FOUND`）/ v2 `CopilotKitCoreErrorCode`（`agent_connect_failed`）/ 转录码
3. **追 AG-UI 事件流**：`RunStarted` → Text/Tool → `RunFinished`，用 `@copilotkit/web-inspector` 或看 Network SSE
4. **修复验证**：`/info` 报告预期 agent、SSE 流完整闭合

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #6366f1 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
debug 严格先取证后开方：集版本传输错误码信息，查三套错误码目录，追 AG-UI 事件流，修完验证 info 端点和 SSE 闭合。
-->

---
transition: fade-out
---

# upgrade：v1 → v2 迁移

v2 是建在 AG-UI 上的重写，API 全变

| v1 | v2 |
| --- | --- |
| `useCopilotAction` | `useFrontendTool` |
| `useCopilotReadable` | `useAgentContext` |
| `useCoAgent` | `useAgent` |
| `CopilotKit`（provider） | `CopilotKitProvider` |
| `CopilotTextarea` | 移除（用标准 textarea + 工具） |
| GraphQL 协议 / service adapter | AG-UI（SSE）/ `BuiltInAgent` |

<style>
h1 { background: linear-gradient(45deg, #6366f1 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
upgrade 逐条把 v1 换成 v2：hook 改名、provider 改名、CopilotTextarea 移除、协议从 GraphQL 换成 AG-UI、runtime 从 service adapter 换成 agent 实例。
-->

---
transition: fade-out
---

# 边界与心法

<v-clicks>

- **不是单个技能，是官方矩阵**：1 路由 + 8 专用，按任务激活
- **v2 优先**：v1 弃用词（`useCopilotAction` / `CoAgents` / `CopilotTextarea`）被显式拦截
- **强绑 CopilotKit + React**：非平台无关的通用 agent 教程
- **需自备**：LLM Key（`OPENAI_API_KEY`…）+ 能跑的 runtime
- **`self-update` ≠ `upgrade`**：前者刷技能知识，后者升项目依赖

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #6366f1 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
边界：是官方技能矩阵非单技能；v2 优先且拦 v1 弃用词；强绑 CopilotKit React；需自备 Key 和 runtime；self-update 只刷技能知识、不升项目依赖。
-->

---
layout: center
class: text-center
---

# 一句话记住

**CopilotKit 官方技能矩阵：`copilotkit` 路由分派到 setup / develop / integrations / debug / upgrade / agui；给 React 加 AI copilot，全程走 v2 与 AG-UI 协议。**

<div class="mt-8 opacity-80">

官方沉淀 · 路由分派 · v2 API · AG-UI 事件流 · 全生命周期

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/CopilotKit/CopilotKit/tree/main/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://docs.copilotkit.ai" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #6366f1 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。CopilotKit 官方技能矩阵，路由 skill 分派到各专用 sub-skill，给 React 加 AI copilot，全程 v2 与 AG-UI 协议。
-->
