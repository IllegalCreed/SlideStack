---
theme: seriph
background: https://cover.sli.dev
title: Vercel AI SDK 指南
info: |
  Vercel AI SDK 指南：Provider 抽象 · generateText · 流式 · 结构化输出 · Tool Calling

  Learn more at [https://ai-sdk.dev](https://ai-sdk.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Vercel AI SDK

TypeScript 统一 AI 工具包 · v7 · 25+ Provider

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Vercel AI SDK 用统一抽象把 25+ Provider 收敛到一套代码。
-->

---
transition: fade-out
---

# AI SDK 是什么

Vercel 出品的 TypeScript AI 应用工具包（主包 `ai`，主线 **v7**）

- **Provider 抽象**：OpenAI / Anthropic / Google 等 25+ 收敛为一套 API
- **Language Model Spec**：换 `model` 参数即可切厂商，调用代码不变
- **Core 函数**：`generateText` / `streamText` / `embedMany` / `generateImage`
- **UI Hooks**：`useChat` / `useCompletion`，React / Svelte / Vue / Solid
- **定位「SDK 非框架」**：不做编排，与 Next.js / Vite / RSC 无缝配合

> 比 LangChain 轻量，只管模型调用抽象 + UI 适配两层

<!--
SDK 而非框架——只做抽象与 UI，编排逻辑留给业务。
-->

---

# 两层架构

```text
┌─────────────────────────────────────┐
│  AI SDK UI（@ai-sdk/react 等）        │
│  useChat / useCompletion / useObject  │ ← 流式渲染 + 状态
├─────────────────────────────────────┤
│  AI SDK Core（ai 包）                 │
│  generateText / streamText / embed   │ ← provider-agnostic
├─────────────────────────────────────┤
│  Provider（@ai-sdk/openai 等 25+）    │
│  openai('gpt-5') / anthropic(...)    │ ← 模型实例
└─────────────────────────────────────┘
```

**关键变化（v7）**：`generateObject` / `streamObject` 统一收敛到 `generateText` + `Output.object`

<!--
Core 抽象模型调用，UI 适配框架，Provider 收敛厂商差异。
-->

---
layout: two-cols
---

# 第一次调用

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text, usage } = await generateText({
  model: openai('gpt-5'),
  prompt: '用 TS 写一个 quicksort',
});

console.log(text);
// usage: { promptTokens, completionTokens }
```

```bash
npm install ai @ai-sdk/openai zod
```

::right::

# 切换模型：改一行

```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

// 只换 model 实例，其余完全不变
anthropic('claude-sonnet-4.6')
google('gemini-2.5-pro')
mistral('mistral-large-latest')
```

环境变量按厂商：

```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

> 核心：调用代码不变，只换 model 实例

<!--
Provider 切换零成本是 AI SDK 的核心价值。
-->

---

# 流式：streamText

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = streamText({
  model: openai('gpt-5'),
  prompt: '讲个程序员笑话',
});

// textStream 既是 ReadableStream 又是 AsyncIterable
for await (const delta of result.textStream) {
  process.stdout.write(delta);
}
const { usage } = await result;  // 结束后拿元信息
```

返回对象还提供：`fullStream`（完整事件）、`toUIMessageStreamResponse()`（直接给前端）

<!--
streamText 返回流对象，可边读边渲染。
-->

---
layout: two-cols
---

# Next.js + useChat

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: openai('gpt-5'),
    messages,
  });
  return result.toUIMessageStreamResponse();
}
```

::right::

# 客户端 Hook

```tsx
'use client';
import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, sendMessage } = useChat({ api: '/api/chat' });
  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>{m.role}: {m.parts.map((p) => p.text).join('')}</div>
      ))}
      <button onClick={() => sendMessage('你好')}>发送</button>
    </div>
  );
}
```

> useChat 自动处理流式渲染、状态管理、错误恢复、`stop()`

<!--
后端 streamText + 前端 useChat = 完整聊天界面。
-->

---

# 结构化输出（v7）

```typescript
import { generateText, Output } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const { output } = await generateText({
  model: openai('gpt-5'),
  prompt: '生成番茄炒蛋食谱',
  output: Output.object({
    schema: z.object({
      name: z.string(),
      steps: z.array(z.string()),
    }),
  }),
});
console.log(output.name);  // 已类型推断
```

`Output` 还提供：`Output.array`（数组）、`Output.choice`（枚举选一）、`Output.json`（自由 JSON）

> v7 用 `generateText + output` 替代旧的 `generateObject`

<!--
结构化输出走 Zod schema，全程类型安全。
-->

---

# Tool Calling

```typescript
import { generateText, tool } from 'ai';
import { z } from 'zod';

const result = await generateText({
  model: openai('gpt-5'),
  prompt: '上海今天多少度？',
  tools: {
    getWeather: tool({
      description: '查询天气',
      parameters: z.object({ city: z.string() }),
      execute: async ({ city }) => ({ city, temp: 28 }),
    }),
  },
  maxSteps: 5,  // 多轮工具循环上限
});
console.log(result.text);  // 模型自动调工具并填入
```

> `maxSteps` 让模型多轮调工具；`stopWhen` 按条件终止更灵活

<!--
tool({ parameters, execute }) 是跨厂商一致的工具定义。
-->

---

# React Server Components

```tsx
import { streamUI } from 'ai';
import { openai } from '@ai-sdk/openai';

export default async function Page() {
  const result = await streamUI({
    model: openai('gpt-5'),
    prompt: '上海天气怎么样',
    text: ({ content }) => <p>{content}</p>,
    tools: { getWeather: { /* execute 返回 { city } */ } },
    generateComponent: ({ toolResult }) =>
      <WeatherCard city={toolResult.city} />,
  });
  return result.component;  // 流式渲染组件
}
```

> `streamUI` 是 AI SDK 与 Next.js App Router 的招牌——让 LLM 决定 UI

<!--
RSC 中按 token 渲染组件，是 SDK 与 Next.js 的深度集成。
-->

---

# v7 迁移要点

从 5.x / 6.x 升级到 v7 的常见破坏点

| 5.x / 6.x | v7 |
|------|------|
| `generateObject({ schema })` | `generateText + Output.object` |
| `tool({ inputSchema })` | `tool({ parameters })` |
| `result.object` | `result.output` |
| `Message` / `CoreMessage` | `UIMessage` / `ModelMessage` |
| `useChat` 的 `handleSubmit` | `sendMessage` / `parts` |

**升级前跑 codemod**：`npx @ai-sdk/migrate@latest`

> v7 把结构化输出统一收敛，更易组合但需重写调用代码

<!--
v7 是大版本，破坏性变更多，先跑 codemod。
-->

---

# vs LangChain

| 维度 | Vercel AI SDK | LangChain |
|------|------|------|
| **定位** | SDK（抽象 + UI） | 框架（编排 + 记忆 + RAG） |
| **语言** | TypeScript-only | Python + JS/TS |
| **UI 集成** | 一流（RSC / 4 框架） | 弱 |
| **RAG** | 不提供，需自配 | 内置 retriever / vectorstore |
| **Agent** | `generateText + maxSteps` | LangGraph |

> Web 前端选 AI SDK；复杂多 Agent pipeline 选 LangChain

<!--
AI SDK 轻、UI 强；LangChain 重、编排全。
-->

---
layout: quote
---

# AI SDK 核心价值

「一套代码、一个 model 参数，25+ Provider 自由切换；Core 函数 + UI Hooks，从后端到前端流式全包圆。」

---
layout: center
class: text-center
---

# 小结

Vercel AI SDK = Provider 抽象 + Core 函数 + UI Hooks

**TypeScript 一等公民 · 流式优先 · 结构化输出 · RSC 集成**

[ai-sdk.dev](https://ai-sdk.dev) · [GitHub](https://github.com/vercel/ai)

<!--
SDK 而非框架，统一抽象 + UI 适配 = AI Web 应用首选。
-->
