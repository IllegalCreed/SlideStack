---
theme: seriph
background: https://cover.sli.dev
title: Mastra Skills
info: |
  Mastra AI 框架官方 agent skill：教 coding agent 找最新文档、验证 API、
  建 agents 与 workflows。核心理念：别信记忆，永远查最新文档。mastra-ai/skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Mastra Skills

Mastra 框架**官方** agent skill —— 别信记忆，永远查最新文档

<div class="pt-6 opacity-80">
mastra-ai/skills · 单技能 + 渐进式披露 · agents / workflows / tools / memory · Apache-2.0
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/mastra-ai/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #fb923c 10%, #fbbf24 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Mastra Skills 是 Mastra AI 框架的官方 agent 技能，教 coding agent 用当前版本的 Mastra 正确写代码。核心一条：别信你脑子里的 Mastra 记忆。
-->

---
transition: fade-out
---

# 它是什么：官方的单一技能

不是技能集，是一个 `mastra` 技能 + 渐进式披露

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**定位**

- Mastra 框架**官方** agent 技能
- 面向 coding agent（Claude Code / Cursor / Codex）
- 让 AI 写出对照当前代码库校验过、可跑的 Mastra 代码

</div>
<div v-click>

**形态**

- 仓库里只有**一个** `mastra` 技能
- 渐进式披露：主 `SKILL.md` + 8 篇 reference
- 按问题路由到对应 reference，控制上下文

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

Mastra = 现代 TypeScript 技术栈的 AI 应用与 agent 框架

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #f97316 88%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
和一个仓库塞一堆技能不同，mastra-ai/skills 里只有一个 mastra 技能，用渐进式披露：主技能讲理念，再按问题路由到 reference 文件。
-->

---
transition: fade-out
---

# 安装：CLI 与 well-known 自动发现

三种方式，well-known 无需手配

```bash
# ① skills CLI
npx skills add mastra-ai/skills

# ② .well-known 自动发现（RFC 8615）
npx skills add https://mastra.ai/

# ③ 手动克隆
git clone https://github.com/mastra-ai/skills.git
```

<div v-click class="mt-3 text-sm">

`.well-known` 端点：agent 拉取即自动发现，无需手动配置

```text
https://mastra.ai/.well-known/skills/index.json
https://mastra.ai/.well-known/skills/mastra/SKILL.md
```

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #f97316 88%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
装法有三种。亮点是走 RFC 8615 的 .well-known 标准，agent 指向 mastra.ai 站点根就能自动发现技能，不用手动配置路径。
-->

---
layout: center
class: text-center
transition: fade-out
---

# 核心理念

<div class="text-2xl mt-6 leading-relaxed">

「你对 Mastra 的一切认知<br/>**很可能已经过时或错误**。<br/>永远别靠记忆，务必对照最新文档验证。」

</div>

<div class="mt-8 opacity-80 text-base">

训练数据里全是废弃 API、过时模式、错误用法 · Mastra 演进极快，API / 构造签名 / 模式常变

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #f97316 88%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
这是整个技能最重要的一条，写在 SKILL.md 第一节。因为 LLM 训练数据有截止日期，而 Mastra 迭代远快于此，凭记忆写代码必翻车。
-->

---
transition: fade-out
---

# 写代码前：三级文档优先级

Never write code without checking current docs first

```text
装了 @mastra/* 包吗？
  ├─ 是 → ① embedded docs：node_modules/@mastra/*/dist/docs/   ← 最可靠，版本精确匹配
  │       ② 源码类型定义（.d.ts）                              ← docs 不够时
  └─ 否 → ③ remote docs：https://mastra.ai/llms.txt            ← 可能领先本地版本
```

<div v-click class="mt-4 text-center">

看到 `Property X does not exist` / `Cannot find module`？<br/>
**先怀疑你的知识过时，而不是用户写错。**

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #f97316 88%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
理念落到操作：写任何代码前先查文档。装了包用 embedded docs 最可靠，不够就读源码类型定义，没装包才用远程文档。类型报错往往是知识过时，不是用户的错。
-->

---
transition: fade-out
---

# 文档查找一：embedded docs

装了包时首选——与安装版本精确匹配

```bash
# 确认装了哪些包
ls node_modules/@mastra/

# 在 references/ 里 grep 找 API
grep -r "Agent" node_modules/@mastra/core/dist/docs/references

# 从 SOURCE_MAP 找类型定义文件，再读 .d.ts
cat node_modules/@mastra/core/dist/docs/assets/SOURCE_MAP.json | grep '"Agent"'
cat node_modules/@mastra/core/dist/agent/agent.d.ts
```

<div v-click class="mt-2 text-sm opacity-80">

结构：`SKILL.md`（概览）+ `SOURCE_MAP.json`（export→文件）+ `references/`（`<category>-<topic>.md`）

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #f97316 88%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
embedded docs 就在 node_modules 里，和安装版本精确匹配，还不用联网。grep references 找 API，SOURCE_MAP 找到类型定义文件再读 .d.ts 拿精确签名。
-->

---
transition: fade-out
---

# 文档查找二：remote docs

没装包 / 探索新特性时用

<div class="grid grid-cols-2 gap-6 mt-3">
<div v-click>

**入口与技巧**

- 先看总览：`https://mastra.ai/llms.txt`
- 任意文档 URL 加 `.md` → 纯 markdown
- 或发 `text-markdown` 请求头

</div>
<div v-click>

**该用哪个**

| 场景 | 用 |
| --- | --- |
| 装了包 | embedded |
| 没装包 | remote |
| 要精确签名 | embedded |
| 概念指南 | remote |

</div>
</div>

<div v-click class="mt-3 text-sm opacity-80">

URL 模式：`/docs/{主题}/overview` · `/reference/{主题}/` · `/guides/{主题}/`

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #f97316 88%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
远程文档先看 llms.txt 总览，任意 URL 加 .md 后缀取干净 markdown。装了包优先 embedded 保证版本匹配，探索新特性或没装包用 remote。
-->

---
transition: fade-out
---

# 核心概念：agents vs workflows

要它自己拿主意 → agent；流程已定好 → workflow

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**Agent（智能体）**

- 自主、会决策、用工具
- 开放式任务
- 客服、调研、分析、工具型助手

</div>
<div v-click>

**Workflow（工作流）**

- 结构化的步骤序列
- 确定的流程
- 管道、审批、ETL、可恢复流程

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

workflow 骨架：`createWorkflow().then(step).commit()` —— **忘了 `.commit()` 会崩**

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #f97316 88%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
选原语的第一刀：需要它自主决策用 agent，流程你已经定好用 workflow。workflow 链末尾必须 commit，忘了运行就崩。
-->

---
transition: fade-out
---

# tools / memory / RAG

工具扩能力，记忆保上下文，RAG 走向量库

<div v-click>

Memory **必须**配 storage；语义召回还需 vector + embedder：

```typescript
const memory = new Memory({
  storage,      // 必需，否则报 "Storage is required for Memory"
  vector,       // 语义召回必需
  embedder,     // 语义召回必需
  options: { lastMessages: 10, semanticRecall: true },
});
```

</div>

<div v-click class="mt-2 text-sm opacity-80">

Tool：`createTool({ id, inputSchema, outputSchema, execute })` + Zod 校验 · 调用时用**一致的 `threadId`**，否则 agent 记不住上一轮

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #f97316 88%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Tools 用 Zod 定义输入输出扩展能力。Memory 必须配 storage 后端，要语义召回还得配向量库和 embedder，调用全程用同一 threadId。RAG 走 @mastra/rag 向量库。
-->

---
transition: fade-out
---

# 反模式：凭记忆写过时 API

技能针对的头号问题

<div v-click>

症状（一堆 TypeScript 报错）：

```text
Property 'tools' does not exist on type 'Agent'
Cannot find module '@mastra/core'
Constructor parameter errors / Type mismatch
```

</div>

<div v-click class="mt-4 text-center text-lg">

技能的态度：**这往往是你的知识过时，不是用户写错。**<br/>
<span class="text-sm opacity-80">对策：查 embedded docs、核 SOURCE_MAP 当前 exports、`npm list` / `npm update`</span>

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #f97316 88%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
最典型的反模式就是 agent 自信地用记忆里的旧签名写代码，结果满屏类型报错。技能要求先怀疑自己的知识过时，去查当前文档验证。
-->

---
transition: fade-out
---

# 常见错误速查

来自 `references/common-errors.md`

| 症状 | 根因 → 对策 |
| --- | --- |
| `Cannot find module` | CommonJS → tsconfig 用 ES2022 + bundler |
| agent 不用工具 | id 不匹配 → Mastra 与 Agent 两处都引用 |
| 记忆不持久 | 没 storage / threadId 不一致 |
| workflow 立即崩 | 忘 `.commit()` |
| 语义召回不生效 | 缺 vector / embedder / `semanticRecall` |
| `Model not found` | 漏 provider 前缀 → `"provider/model"` |

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #f97316 88%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
这些是最高频的坑：CommonJS、工具没接上、记忆没配 storage、workflow 忘 commit、语义召回三件套缺一、模型漏 provider 前缀。技能都给了对照解法。
-->

---
transition: fade-out
---

# 技能教什么 + 路由表

三件事，都建立在「别信记忆」之上

<div class="grid grid-cols-2 gap-6 mt-3">
<div v-click>

**教三件事**

1. 找最新文档
2. 验证 API 签名
3. 建 agents 和 workflows

</div>
<div v-click>

**问题 → reference**

| 问题 | reference |
| --- | --- |
| 新建项目 | create-mastra |
| 选原语 | core-concepts |
| 报错了 | common-errors |
| 升版本 | migration-guide |

</div>
</div>

<div v-click class="mt-3 text-sm opacity-80">

硬要求：ES2022（CommonJS 报错）· Node 20+ · 模型 `"provider/model-name"`（写前跑 provider-registry 校验）

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #f97316 88%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
技能核心教三件事：找文档、验签名、建 agents 与 workflows。主技能用路由表把不同问题导向对应 reference。别忘硬要求：ES2022、Node 20+、模型带 provider 前缀。
-->

---
transition: fade-out
---

# 边界与定位

<v-clicks>

- **是官方 agent 技能，不是 Mastra 框架本身**——框架源码在 mastra-ai/mastra
- **单技能而非技能集**——只有一个 `mastra`（对比 vercel 的 9 个）
- **教「怎么查」而非「背答案」**——API 细节以 embedded/remote docs 现查为准
- **绑 Mastra 生态 + 强 TypeScript**——ES2022 / Node 20+
- **许可 Apache-2.0**——README/LICENSE 明写；GitHub 一度显示 NOASSERTION，以仓库为准

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #f97316 88%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
边界要说清：这是让 agent 正确用 Mastra 的技能，不是框架。只有一个技能。它的资产是查文档的方法论而非写死的 API。许可以仓库声明的 Apache-2.0 为准。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Mastra 官方 agent 技能：别信记忆，写代码前先查文档（embedded → 源码 → remote），再建 agents / workflows / tools / memory。**

<div class="mt-8 opacity-80">

官方一手 · 单技能渐进式披露 · 反幻觉查文档 · well-known 自动发现 · Apache-2.0

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/mastra-ai/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://mastra.ai/docs" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #f97316 88%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Mastra 官方技能的精髓：别信记忆，先查文档再写代码，在验证过的当前 API 上建 agents 和 workflows。核心是反幻觉的文档查找方法论。
-->
