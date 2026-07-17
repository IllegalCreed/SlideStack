---
theme: seriph
background: https://cover.sli.dev
title: Vercel AI SDK Skills
info: |
  vercel/ai 官方 AI SDK 技能：用 AI SDK 建应用 + v6→v7 迁移。
  别信记忆，读版本匹配文档。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Vercel AI SDK Skills

`vercel/ai` 官方技能——**用 AI SDK 建应用**，拒绝过时 API

<div class="pt-6 opacity-80">
npx skills add vercel/ai · use-ai-sdk / migrate v6→v7 · Apache-2.0
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/vercel/ai" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Vercel AI SDK Skills 是 vercel/ai 主仓库随源码维护的官方 agent 技能，帮 agent 正确地用 AI SDK 建应用、做 v6 到 v7 迁移。核心是别信记忆、读版本匹配文档。
-->

---
transition: fade-out
---

# 别和批 3 搞混

两个「Vercel + Skills」是完全不同的东西

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**本叶：Vercel AI SDK Skills**

- 仓库 `vercel/ai`（AI SDK 本体）
- 教 agent **用 AI SDK 建应用 / 迁移**
- `use-ai-sdk` + `migrate-v6-v7`
- **Apache-2.0**

</div>
<div v-click>

**批 3：Vercel Agent Skills**

- 仓库 `vercel-labs/agent-skills`
- deploy / optimize / react 通用规范
- 9 个工程技能集
- **MIT**

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

不同仓、不同叶、不同许可——本叶只讲 **AI SDK**。

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
这一页是本叶最重要的澄清：Vercel AI SDK Skills 是 vercel/ai 本体仓的技能，教你用 AI SDK；批 3 的 Vercel Agent Skills 是 vercel-labs/agent-skills，是 deploy/优化的通用规范。不同仓、不同许可。
-->

---
transition: fade-out
---

# 安装：一条命令

<div v-click>

```bash
npx skills add vercel/ai
```

</div>

<div v-click class="mt-4">

- `-y` 非交互；`-a` 指定 agent 装到 `.agents/skills`
- 支持 **Claude Code / Codex / OpenCode / Cursor** 等
- 装入 `.claude/skills` / `.codex/skills`，多 agent 用 symlink
- **渐进披露**：启动只载 name+description，用到才拉全文

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
装法就一条 npx skills add vercel/ai，跨 Claude Code、Codex、Cursor 等。渐进披露让 agent 启动只加载技能摘要，任务需要才拉全文。
-->

---
transition: fade-out
---

# AI SDK 是什么

npm 上的 `ai` 包——建 AI 应用的 TypeScript 工具包

<v-clicks>

- **统一接口**跨多家 provider（OpenAI / Anthropic / Google…）
- 覆盖：文本生成、结构化输出、工具调用、agent、嵌入
- 框架 UI 集成：react / vue / svelte / angular
- 换 provider 通常**只改一行 import**

</v-clicks>

<div v-click class="mt-6 text-center">

技能的职责：帮 agent **正确地**用这套 API。

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
AI SDK 是 npm 上的 ai 包，一个建 AI 应用的 TS 工具包，最大特点是统一接口跨多家 provider，覆盖文本、结构化输出、工具、agent、嵌入，还有框架 UI 集成。
-->

---
layout: center
class: text-center
---

# 核心心法：别信记忆

<div class="text-xl mt-4 opacity-90">

AI SDK 变得太快，API 频繁改名 / 删除 / 新增——<br/>
训练数据里的写法几乎必然过时。

</div>

<div v-click class="mt-8 text-lg">

✅ 读**随包发行、版本匹配**的文档与源码<br/>
`node_modules/ai/docs/` · `node_modules/ai/src/`

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
这是 use-ai-sdk 的灵魂：别信你自己的记忆。SDK 变太快，模型记忆几乎必然过时。正解是读 node_modules 里随包发行、和你安装版本一致的文档和源码。
-->

---
transition: fade-out
---

# 核心 API

```ts
import { generateText, streamText, generateObject } from "ai";

// 一次性文本
const { text } = await generateText({ model, prompt });

// 流式文本
const result = streamText({ model, prompt });

// 结构化输出（按 schema 校验）
const { object } = await generateObject({ model, schema, prompt });
```

<div class="mt-3 text-sm opacity-80">

还有 `tool()` 工具调用、`embed` / `embedMany` 嵌入、`ToolLoopAgent`。

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
核心 API：generateText 一次性、streamText 流式、generateObject 结构化输出按 schema 校验。加上 tool 工具调用、embed 嵌入、ToolLoopAgent agent 抽象。实际签名以随包文档为准。
-->

---
transition: fade-out
---

# 统一 provider：换一行

<div v-click>

```ts
// 从 OpenAI 换到 Anthropic，业务代码不动
import { openai } from "@ai-sdk/openai";       // 之前
import { anthropic } from "@ai-sdk/anthropic";  // 之后
```

</div>

<div v-click class="mt-4">

- `packages/<provider>`：openai / anthropic / google / azure / bedrock
- 都实现同一份 `@ai-sdk/provider` 接口规范
- `generateText` 等业务调用**几乎不用改**

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
统一 provider 是 AI SDK 的招牌：换厂商通常只改一行 import，因为各家 provider 包都实现同一份 @ai-sdk/provider 接口规范，业务代码不动。
-->

---
transition: fade-out
---

# AI Gateway：最快起步

<v-clicks>

- **一个 API** 接多家模型，免装 provider 包、免管多密钥
- 鉴权：`AI_GATEWAY_API_KEY` 或 Vercel OIDC
- 用 `provider/model` 字符串引用模型

</v-clicks>

<div v-click class="mt-4">

模型 ID 也别凭记忆——先拉当前列表：

```bash
curl -s https://ai-gateway.vercel.sh/v1/models | jq -r '.data[].id'
```

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
AI Gateway 是最快的起步方式：一个 API 接多家模型，免装 provider 包、免管多密钥，用 provider/model 字符串引用。连模型 ID 都别凭记忆，先 curl 拉当前列表。
-->

---
transition: fade-out
---

# agent 与框架集成

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**agent**

- 用内置 `ToolLoopAgent`
- 别手搓工具调用循环
- 从 agent 定义推断 UI 消息类型 → 端到端类型安全

</div>
<div v-click>

**框架 UI**

- `@ai-sdk/react` / vue / svelte / angular
- `useChat` / `useCompletion`
- ⚠️ `useChat` 改动最频繁，务必查当前版本

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
agent 用内置 ToolLoopAgent，别手搓工具循环，并从 agent 定义推断 UI 消息类型做端到端类型安全。前端用 useChat/useCompletion，注意 useChat 是改动最频繁的 API。
-->

---
transition: fade-out
---

# 迁移 v6 → v7：高频改名

| v6 | v7 |
| --- | --- |
| 顶层 `system` | `instructions` |
| `fullStream` | `stream` |
| `onFinish` / `onStepFinish` | `onEnd` / `onStepEnd` |
| `stepCountIs` | `isStepCount` |
| `experimental_*` | 去掉前缀 |

<div class="mt-3 text-sm opacity-80">

`migrate-ai-sdk-v6-to-v7` 是一份可执行的迁移工作清单。

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
迁移技能给出高频改名清单：system 改 instructions、fullStream 改 stream、onFinish 改 onEnd、stepCountIs 改 isStepCount、experimental 前缀去掉。技能本身是可执行的工作清单。
-->

---
transition: fade-out
---

# 迁移 v6 → v7：语义与运行时

<v-clicks>

- **运行时**：Node ≥ 22、**ESM-only**（`require()` 改 `import`）
- **多步结果**：顶层 `content` / `usage` 现含**全部步骤**；旧「仅最后一步」用 `finalStep`
- **遥测**：OpenTelemetry 移出 `ai`，改装 `@ai-sdk/otel`
- **优先保持行为不变**，只改存在的老写法，改完跑类型检查

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
迁移不只是改名，还有语义变化：多步结果顶层字段现在包含全部步骤，旧的只取最后一步要用 finalStep；遥测移出 ai 改装 @ai-sdk/otel；运行时要 Node 22 且 ESM only。原则是优先保持行为不变。
-->

---
transition: fade-out
---

# 两个用户向技能

| 技能 | 用途 |
| --- | --- |
| `use-ai-sdk` | 建 AI 功能、答用法（版本匹配文档 / AI Gateway / agent） |
| `migrate-ai-sdk-v6-to-v7` | v6.x → 7.0 迁移工作清单 |

<div v-click class="mt-6 text-sm opacity-80">

仓库 `skills/` 还有 `add-provider-package`、`adr-skill` 等**贡献者向**技能，面向给 SDK 提代码的人。

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
两个用户向技能：use-ai-sdk 帮你建 AI 功能，migrate-ai-sdk-v6-to-v7 帮你升级。仓库里还有一批贡献者向技能，是给 SDK 本身提代码用的。
-->

---
transition: fade-out
---

# 边界

<v-clicks>

- **强绑 AI SDK 生态**——只服务用 `ai` 建应用
- **不替你写业务**——保证 API 用对，逻辑 / prompt / 选型靠你
- **是「用 AI SDK 的技能」**，不是 SDK 本身
- **≠ 批 3**：这里没有 deploy / optimize，那是 Vercel Agent Skills

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
边界：技能强绑 AI SDK 生态，非 AI SDK 项目用不上；它保证你用对 API 但不替你写业务；它是用 AI SDK 的技能不是 SDK 本身；再次强调不等于批 3。
-->

---
layout: center
class: text-center
---

# 一句话记住

**`npx skills add vercel/ai`：让 agent 用「版本匹配的一手文档」正确写 AI SDK——统一 provider、AI Gateway 起步、`ToolLoopAgent`、v6→v7 迁移。别信记忆。**

<div class="mt-8 opacity-80">

用 AI SDK 建应用 · 拒绝过时 API · 官方随源码维护 · Apache-2.0

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/vercel/ai" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://ai-sdk.dev/docs" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。一条命令装官方 AI SDK 技能，让 agent 用版本匹配的一手文档正确写 AI SDK：统一 provider、AI Gateway 起步、ToolLoopAgent、v6 到 v7 迁移。核心心法就四个字：别信记忆。
-->
