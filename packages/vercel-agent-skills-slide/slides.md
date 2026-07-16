---
theme: seriph
background: https://cover.sli.dev
title: Vercel Agent Skills
info: |
  Vercel 官方 agent 技能集：部署、优化审计、React/Web 设计/写作规范。
  vercel-labs/agent-skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Vercel Agent Skills

Vercel 官方技能集——**对话即部署** + 工程规范沉淀

<div class="pt-6 opacity-80">
vercel-labs/agent-skills · deploy / optimize / react / design / writing · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/vercel-labs/agent-skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Vercel Agent Skills 是 Vercel 官方的 agent 技能集，把工程团队的部署、优化、React 性能、Web 设计、写作规范打包成可按需调用的技能。
-->

---
transition: fade-out
---

# 9 个技能，两大类

动作型 + 审计型

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**动作型**

- `deploy-claimable` 对话里部署
- `optimize` 审计降成本
- `react-view-transitions` 过渡动画
- `composition-patterns` 组合模式

</div>
<div v-click>

**审计型（评审器）**

- `react-best-practices` 40+ 性能规则
- `web-design-guidelines` 100+ UI 规则
- `writing-guidelines` 80+ 写作规则
- `react-native-guidelines` 16 规则

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

装：`npx skills add vercel-labs/agent-skills`，任务匹配自动激活。

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
9 个技能分两大类：动作型（部署、优化、过渡、组合）和审计型（React 性能、Web 设计、写作、RN 规则）。装一条命令，任务匹配自动激活。
-->

---
transition: fade-out
---

# deploy-claimable：对话即部署

「Deploy my app」→ 上线 + 链接

<div v-click>

```text
Deploy my app
  ↓
1. 打包（排除 node_modules / .git）
2. 检测框架（Next.js / Vite / Astro… 40+）
3. 上传部署
  ↓
Preview URL: https://skill-deploy-abc123.vercel.app
Claim URL:   https://vercel.com/claim-deployment?code=...
```

</div>

<div v-click class="mt-3 text-center">

**claim URL 是亮点**：部署「可认领」——AI 帮你部署，所有权转到你的账号。

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
deploy-claimable 让你在对话里说 Deploy my app 就上线：打包、检测 40+ 框架、上传，返回 preview 和 claim URL。claim URL 是亮点——部署可认领，AI 帮你部署但所有权归你。
-->

---
transition: fade-out
---

# optimize：先量后查

不盲扫全库

<v-clicks>

- **先收集 Vercel 指标**——成本、性能、缓存、函数用量、账单
- **只调查指标指向的路由/文件**——不全库扫描
- **产出排名报告**——按成本与性能影响排序

</v-clicks>

<div v-click class="mt-6 text-center">

把精力花在真正**花钱/变慢**的地方，而非无差别扫描。

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
vercel-optimize 的设计哲学是先量后查：先收集指标，只调查指标指向的地方，产出排名报告。把精力花在真正花钱变慢的热点，比无差别扫全库高效。
-->

---
transition: fade-out
---

# react-best-practices：40+ 规则按影响力分级

告诉 agent「先做影响大的」

| 优先级 | 类别 |
| --- | --- |
| **Critical** | 消除瀑布 · Bundle 体积 |
| **High** | 服务端性能 |
| **Medium-High** | 客户端数据获取 |
| **Medium** | 重渲染 · 渲染性能 |
| **Low-Medium** | JS 微优化 |

<div v-click class="mt-3 text-center text-sm opacity-80">

来自 Vercel Engineering 实战——优先级排序让 agent 不平均用力。

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
react-best-practices 是 Vercel Engineering 的 40+ 条 React/Next.js 性能规则，按影响力分 8 类。关键是优先级排序——消除瀑布和 bundle 是 Critical，微优化是 Low，让 agent 先做影响大的。
-->

---
transition: fade-out
---

# 审计式技能：规则集变评审器

对照 Vercel 规则扫你的产物

<v-clicks>

- **web-design-guidelines**（100+）——「Review my UI」审 a11y/焦点/表单/动画/排版/i18n
- **writing-guidelines**（80+）——「Review my docs」对照 Vercel 写作手册

</v-clicks>

<div v-click class="mt-4">

writing 会揪出这些：

```text
❌ 禁词：easy / simple / quick
❌ em dash 当标点
✅ 主动语态、TypeScript 优先、代码 80 列/25 行限
```

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
三个审计型技能把 Vercel 的规则集变成评审器：web-design 审 UI 100+ 规则，writing 对照写作手册审文案。writing 会揪出禁词 easy simple quick、em dash 当标点，要求主动语态、TypeScript 优先。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Vercel 官方 9 技能：deploy-claimable 对话即部署（claim URL 转所有权）、optimize 先量后查、react/design/writing 审计器对照 Vercel 规范。**

<div class="mt-8 opacity-80">

官方沉淀 · 对话即部署 · 先量后查 · 规则分级 · 审计评审器

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/vercel-labs/agent-skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://vercel.com/docs/agent-resources/skills" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #525252 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Vercel 官方 9 技能：deploy-claimable 对话即部署、optimize 先量后查、react design writing 三个审计器对照 Vercel 规范。官方工程沉淀，非泛泛而谈。
-->
