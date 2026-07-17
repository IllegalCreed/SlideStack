---
theme: seriph
background: https://cover.sli.dev
title: assistant-ui Skills
info: |
  assistant-ui 官方 skill：把 ChatGPT 式 AI 聊天 UI 接进你的 React 应用。
  assistant-ui/assistant-ui · primitives + runtime · MIT。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# assistant-ui Skills

把 **ChatGPT 式 AI 聊天体验**接进你的 React 应用

<div class="pt-6 opacity-80">
assistant-ui/assistant-ui · primitives + runtime · 官方 skill · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/assistant-ui/assistant-ui" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
assistant-ui 是一个开源 React 库，把 ChatGPT 式的 AI 聊天 UX 接进你自己的应用。这个官方 skill 教 AI agent 怎么把它集成进项目。
-->

---
transition: fade-out
---

# assistant-ui 是什么

「ChatGPT 的 UX，搬进你的 React 应用」

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**可组合 primitives**

- `Thread` / `Message` / `Composer`
- `ThreadList` / `ActionBar` …
- 逐像素自定义，或用 shadcn 主题起步

</div>
<div v-click>

**runtime**

- 管聊天状态（消息 / 流式 / 分支 / 附件）
- 把 UI 连到你的后端 LLM
- 换 hook 即换后端，UI 不动

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

关键分工：assistant-ui 管 **UI + 状态**，LLM 调用在**你自己的后端**。

</div>

<style>
h1 { background: linear-gradient(45deg, #18181b 10%, #7c3aed 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
assistant-ui 提供两样东西：可组合的 primitives（Thread/Message/Composer 等）和 runtime（管状态、连后端）。它只管 UI 和状态，真正的 LLM 调用在你自己的后端。
-->

---
transition: fade-out
---

# 官方 skill：在哪、教什么

随 CLI plugin 分发的产品 skill

<v-clicks>

- **位置**：`packages/cli/plugin/skills/assistant-ui/SKILL.md`
- **触发**：「加一个聊天 thread」「配 runtime」「接 AI SDK」「配工具」
- **本质**：给 AI 编码 agent 的「怎么集成 assistant-ui」操作手册
- **别混淆**：`.claude/skills/`（butflow / trusted-publishing）是**仓库维护 skill**，非产品 skill

</v-clicks>

<div v-click class="mt-4 text-center">

它把集成流程压成清晰的 **4 步**——下一页总览。

</div>

<style>
h1 { background: linear-gradient(45deg, #18181b 10%, #7c3aed 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
官方 skill 在 CLI plugin 里，教 agent 怎么把 assistant-ui 集成进项目。注意区分：.claude/skills 是仓库自己的维护 skill，不是产品 skill。
-->

---
transition: fade-out
---

# skill 的 4 步

从零到能聊天

| 步骤 | 做什么 | 关键 |
| --- | --- | --- |
| ① 查 setup | 看有无 `components.json` + `@assistant-ui/react` | `assistant-ui init` |
| ② 加组件 | shadcn registry copy 源码进项目 | `shadcn add assistant-ui/thread` |
| ③ 配 runtime | 挂 runtime + 后端 API 路由 | `useChatRuntime` |
| ④ 工具（可选） | 后端定义、前端渲染工具 UI | `defineToolkit` |

<div v-click class="mt-3 text-center text-sm opacity-80">

前 3 步跑起来一个聊天界面，第 4 步加工具调用与 Generative UI。

</div>

<style>
h1 { background: linear-gradient(45deg, #18181b 10%, #7c3aed 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
skill 把集成压成 4 步：查 setup、加组件、配 runtime、工具。前三步就能跑起来聊天界面，第四步加工具。
-->

---
transition: fade-out
---

# Step 1 + 2：setup 与加组件

先备好 shadcn，再 copy 组件源码

```bash
# Step 1：查有无 components.json + @assistant-ui/react，缺则 init
npx assistant-ui init --yes

# Step 2：用 shadcn registry 加组件（预设一键装齐）
npx shadcn@latest add "https://r.assistant-ui.com/chat/b/ai-sdk-quick-start/json"

# 也可按需装单个
npx shadcn@latest add assistant-ui/thread
```

<div v-click class="mt-3 text-center text-sm opacity-80">

组件是 **copy 进你项目的源码**，每一行你都拥有、可改——这是「逐像素可定制」的底气。

</div>

<style>
h1 { background: linear-gradient(45deg, #18181b 10%, #7c3aed 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Step 1 先查 setup、缺就 init（初始化 shadcn + 装默认组件）。Step 2 用 shadcn registry 加组件，源码 copy 进项目，你拥有并可改。
-->

---
transition: fade-out
---

# Step 3：配 runtime（后端）

API 路由用 AI SDK 流式返回

```ts
// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages, config } = await req.json();
  const result = streamText({
    model: openai("gpt-5.4-nano"), messages, ...config,
  });
  return result.toDataStreamResponse();
}
```

<div class="mt-2 text-center text-sm opacity-80">

用 OpenAI 时把 `OPENAI_API_KEY` 放 `.env.local`。

</div>

<style>
h1 { background: linear-gradient(45deg, #18181b 10%, #7c3aed 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Step 3 的后端：一个 API 路由，用 AI SDK 的 streamText 流式返回。密钥放 .env.local。
-->

---
transition: fade-out
---

# Step 3：配 runtime（前端）

`useChatRuntime` + `AssistantRuntimeProvider` + `Thread`

```tsx
"use client";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";

export const Assistant = () => {
  const runtime = useChatRuntime({ api: "/api/chat" });
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Thread />
    </AssistantRuntimeProvider>
  );
};
```

<style>
h1 { background: linear-gradient(45deg, #18181b 10%, #7c3aed 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Step 3 的前端：useChatRuntime 连路由，AssistantRuntimeProvider 注入 runtime，Thread 渲染聊天界面。三行核心。
-->

---
transition: fade-out
---

# Step 4：工具（后端定义）

用 AI SDK 的 `tool()` 声明 schema + 执行

```ts
import { tool } from "ai";
import { z } from "zod";

tools: {
  get_weather: tool({
    description: "Get weather for a location",
    parameters: z.object({ location: z.string() }),
    execute: async ({ location }) => ({ temperature: 72, location }),
  }),
}
```

<div v-click class="mt-2 text-center text-sm opacity-80">

工具在**后端执行**——前端只负责把结果画出来（下一页）。

</div>

<style>
h1 { background: linear-gradient(45deg, #18181b 10%, #7c3aed 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Step 4 后端：用 AI SDK 的 tool 声明工具的 schema 和执行逻辑。工具在后端跑，前端只画 UI。
-->

---
transition: fade-out
---

# Step 4：工具 UI（前端 toolkit）

`defineToolkit` + `externalTool()`，前端只画 UI

```tsx
"use generative";
import { defineToolkit, externalTool } from "@assistant-ui/react";

export default defineToolkit({
  get_weather: {
    execute: externalTool(),               // 后端执行
    render: ({ args, result }) => <WeatherCard {...args} data={result} />,
  },
});
// 注册：const aui = useAui({ tools: Tools({ toolkit }) })
```

<div v-click class="mt-2 text-center text-sm opacity-80">

⚠️ 旧 API `makeAssistantToolUI` / `useAssistantTool` 已**废弃**，改用 toolkit。

</div>

<style>
h1 { background: linear-gradient(45deg, #18181b 10%, #7c3aed 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Step 4 前端：defineToolkit 为工具挂渲染器，工具后端执行所以用 externalTool，前端只画 UI，再用 useAui + Tools 注册。旧的 makeAssistant* API 已废弃。
-->

---
transition: fade-out
---

# 核心包

按需取用

| 包 | 用途 |
| --- | --- |
| `@assistant-ui/react` | 核心组件与 primitives |
| `@assistant-ui/react-ai-sdk` | Vercel AI SDK 集成 |
| `@assistant-ui/react-markdown` | Markdown 渲染 |
| `@assistant-ui/react-syntax-highlighter` | 代码高亮 |
| `@assistant-ui/ui` | 预置 shadcn/ui 组件集 |
| `@assistant-ui/styles` | 预置 CSS（非 Tailwind 用户） |

<style>
h1 { background: linear-gradient(45deg, #18181b 10%, #7c3aed 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
核心包：react 是核心，react-ai-sdk 接 AI SDK，markdown 和 syntax-highlighter 管渲染，ui 是 shadcn 组件集，styles 给非 Tailwind 用户。
-->

---
transition: fade-out
---

# 换后端：runtime 抽象

换一个 hook，UI 不动

| 后端 | runtime / 集成包 |
| --- | --- |
| Vercel AI SDK | `useChatRuntime`（`react-ai-sdk`） |
| LangGraph / LangChain | `useLangGraphRuntime`（`react-langgraph`） |
| 自定义数据流 | `useDataStreamRuntime` |
| AG-UI / A2A 协议 | `react-ag-ui` / `react-a2a` |

<div v-click class="mt-3 text-center text-sm opacity-80">

runtime 是解耦点：`Thread` 等 UI 只认 runtime，不认具体后端。

</div>

<style>
h1 { background: linear-gradient(45deg, #18181b 10%, #7c3aed 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
runtime 是解耦点。默认 useChatRuntime 连 AI SDK，换成 useLangGraphRuntime、useDataStreamRuntime 或自定义就接别的后端，UI 层完全不动。
-->

---
transition: fade-out
---

# primitives 与生产 UX

开箱即用的聊天体验

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**primitives**

- `Thread` 对话主体
- `Message` 单条消息
- `Composer` 输入框
- `ThreadList` 会话列表
- `ActionBar` 操作栏

</div>
<div v-click>

**生产 UX（内置）**

- 流式 · 自动滚动 · 重试
- 附件 · markdown · 代码高亮
- 语音输入 · 快捷键 · 无障碍
- Generative UI：工具/JSON 渲染成组件

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #18181b 10%, #7c3aed 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
primitives 是 Thread/Message/Composer/ThreadList/ActionBar。生产 UX 全内置：流式、滚动、重试、附件、markdown、高亮、语音、快捷键、a11y，还有 Generative UI。
-->

---
transition: fade-out
---

# 反模式

别踩这些坑

<v-clicks>

- ❌ **用旧工具 API**：`makeAssistantToolUI` / `useAssistantTool` 等已废弃 → 用 toolkit
- ❌ **把 LLM 调用放前端**：密钥与模型调用要在后端 API 路由（`OPENAI_API_KEY` 放 `.env.local`）
- ❌ **跳过 Step 1**：没 `components.json` / shadcn 基建就 `shadcn add` 会失败 → 先 `init`
- ❌ **把仓库维护 skill 当产品 skill**：集成看 `packages/cli/plugin/skills/assistant-ui`

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #18181b 10%, #7c3aed 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
四个反模式：别用废弃的旧工具 API、别把 LLM 调用放前端、别跳过 Step 1、别把仓库维护 skill 当产品 skill。
-->

---
transition: fade-out
---

# 边界

用之前想清楚

<v-clicks>

- **只是 UI + runtime 层**，不含 LLM / 后端——LLM 调用在你的 API 路由
- **React 生态专属**，非 React 框架不适用
- **默认偏 shadcn / Tailwind**，非 Tailwind 用户需 `@assistant-ui/styles`
- 官方 skill 讲「集成 assistant-ui」，不是通用 AI 聊天教程

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #18181b 10%, #7c3aed 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
边界：只是 UI + runtime，不含后端；React 专属；默认偏 shadcn/Tailwind；skill 讲的是集成 assistant-ui。
-->

---
layout: center
class: text-center
---

# 一句话记住

**assistant-ui 官方 skill：4 步（查 setup → shadcn 加组件 → 配 runtime → 工具 toolkit）把 ChatGPT 式聊天 UI 接进 React；`AssistantRuntimeProvider` + `useChatRuntime` 起步，换 runtime 即换后端。**

<div class="mt-8 opacity-80">

React AI 聊天 UI · primitives + runtime · shadcn 交付 · 换后端不换 UI · MIT

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/assistant-ui/assistant-ui" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://www.assistant-ui.com/docs" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #18181b 10%, #7c3aed 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。assistant-ui 官方 skill 四步把 ChatGPT 式聊天 UI 接进 React：查 setup、shadcn 加组件、配 runtime、工具 toolkit。AssistantRuntimeProvider 加 useChatRuntime 起步，换 runtime 就换后端。
-->
