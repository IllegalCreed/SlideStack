---
theme: seriph
background: https://cover.sli.dev
title: Next.js Workflow Skills
info: |
  Next.js 官方工作流技能：版本随框架，Skills vs AGENTS.md 分工，dev-loop 双视角验证。
  vercel/next.js/skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Next.js Workflow Skills

Next.js **官方**工作流技能——住在框架仓库，版本随框架

<div class="pt-6 opacity-80">
vercel/next.js/skills · Skills vs AGENTS.md 分工 · dev-loop 双视角验证 · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/vercel/next.js/tree/canary/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Next.js Workflow Skills 是 Next.js 官方工作流技能，源码住在框架主仓库，版本随框架同步。
-->

---
transition: fade-out
---

# 核心决策：Skills vs AGENTS.md

按类型拆分——用对地方

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**横向参考知识**

→ AGENTS.md + 内置文档

- `next dev`（16.3+）自动生成
- 全量前置，agent 总遵守
- **零假阴性**
- best-practices / 升级指南走这

</div>
<div v-click>

**垂直工作流**

→ Skills

- 用户显式触发的动作
- 按需拉取（可能假阴性）
- 动作明确、可复用
- 采纳/优化/验证走这

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

Vercel eval：横向知识「AGENTS.md outperforms skills」——不是 skills 不行，是用对地方。

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
最值得学的工程决策：按类型拆分内容。横向参考知识放 AGENTS.md，全量前置总遵守零假阴性；垂直工作流留作技能，动作明确可复用。Vercel eval 说横向知识 AGENTS.md 优于 skills，不是 skills 不行，是用对地方。
-->

---
transition: fade-out
---

# 4 个 workflow 技能

垂直、显式触发的动作

| 技能 | 干什么 |
| --- | --- |
| `next-dev-loop` | 改后验证运行时——确认真跑，不只编译过 |
| `next-cache-components-adoption` | 采纳 cacheComponents |
| `next-cache-components-optimizer` | 优化 cacheComponents（页壳 + 即时导航） |
| `next-partial-prefetching-adoption` | 采纳部分预取 |

<div v-click class="mt-3 text-center text-sm opacity-80">

装：`npx skills add vercel/next.js`；旧 vercel-labs/next-skills 已迁入主仓库。

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
当前 4 个 workflow 技能：dev-loop 验证运行时、cache-components 采纳和优化、partial prefetching 采纳。都是垂直、用户显式触发的动作。
-->

---
transition: fade-out
---

# dev-loop：双视角验证运行时

「编译过了但运行时不对」——用两个视角交叉核

| 视角 | 端点/工具 | 知道什么 |
| --- | --- | --- |
| **Next.js 视角** | `/_next/mcp` | 路由、RSC、server actions、server 日志、错误 |
| **浏览器视角** | agent-browser | DOM、console、network、React fiber、vitals |

<v-clicks>

- 两个视角**互相印证**——一个说路由 OK，另一个确认页面真渲染了
- 比只看编译输出可靠得多

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
next-dev-loop 治的是编译过了但运行时不对。它用两个视角交叉核：/_next/mcp 是 Next.js 视角知道路由 RSC server actions，agent-browser 是浏览器视角知道 DOM console vitals。两个视角互相印证，比只看编译可靠。
-->

---
transition: fade-out
---

# 硬门槛：缺了就停，不退化

hard floors, not soft preferences

<v-clicks>

- Next.js **16.3+ 带 Turbopack**——`/_next/mcp` + 主动编译检查
- agent-browser **≥0.31.1**——React introspection、幂等 restore
- running `next dev`

</v-clicks>

<div v-click class="mt-4 text-center">

缺任何一个 → **告诉你怎么升级并停下**，不退化成 grep 源码或更弱探测。

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
dev-loop 的门槛是硬性的：Next.js 16.3+ Turbopack、agent-browser 0.31.1、running next dev。缺任何一个，它会告诉你怎么升级并停下，不退化成 grep 源码或更弱的探测。它假定两个视角都活着。
-->

---
transition: fade-out
---

# optimizer：cache-components 两循环

针对 `cacheComponents: true` 项目

<div class="grid grid-cols-2 gap-4 mt-4">
<div v-click>

**页壳循环（PPR）**

- 长单页的静态壳
- shell-only 渲染
- 排名 Suspense fallback 区
- 首屏静态部分尽量大

</div>
<div v-click>

**即时导航循环**

- 点 A→B 链接
- 立即显 B 的静态布局
- 而非挂 A 直到 B 数据 resolve
- 捕 pushstate 后 suspended 边界

</div>
</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

前置：`next-dev-loop` 已启动——workflow 技能之间链式依赖。

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
optimizer 针对 cacheComponents 项目，两个诊断循环：页壳循环让首屏静态部分尽量大，即时导航循环让点链接立即显示 B 的静态布局。前置是 dev-loop 已启动——workflow 技能之间会链式依赖。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Next.js 官方 workflow 技能：版本随框架；横向知识走 AGENTS.md、垂直工作流留 skills；dev-loop 双视角验证运行时、optimizer 优化 cache-components。**

<div class="mt-8 opacity-80">

版本随框架 · Skills vs AGENTS.md · dev-loop 双视角 · 硬门槛 · cache-components

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/vercel/next.js/tree/canary/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://nextjs.org/docs/app/guides/ai-agents" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Next.js 官方 workflow 技能：版本随框架；横向知识走 AGENTS.md、垂直工作流留 skills；dev-loop 双视角验证运行时、optimizer 优化 cache-components。
-->
