---
theme: seriph
background: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80
title: Angular Developer Skill
info: |
  ## Angular Developer Skill
  Angular 官方（Google）出品的 agent 技能——依赖图 + 渐进披露，版本感知，生成后必 ng build 验证。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Angular Developer Skill

Angular 官方（Google）出品的 agent 技能

<div class="pt-8 text-xl opacity-80">
依赖图 + 渐进披露 · 版本感知 · 生成后必 <code>ng build</code> 验证
</div>

<div class="abs-br m-6 text-sm opacity-60">
angular/skills · MIT · 源在 angular/angular
</div>

---
layout: two-cols
layoutClass: gap-8
---

# 它是什么

<v-clicks>

- **Angular 官方**：Copyright 2026 Google LLC，MIT
- 源在主仓库 `angular/angular` 的 `skills/dev-skills/`
- 经基建输出到 `angular/skills`
- **两个技能**：`angular-developer` + `angular-new-app`
- 覆盖组件 / reactivity / forms / DI / routing / SSR / a11y

</v-clicks>

::right::

<div v-click="1" class="mt-16 p-6 rounded-xl bg-gradient-to-br from-red-500/15 to-pink-500/10 border border-red-400/25">

**一句话**

> 官方沉淀的 Angular 开发工作流——不是文档封装，而是带**决策逻辑**和**验证闭环**的技能。

</div>

<div v-click="2" class="mt-4 p-4 rounded-lg bg-gray-500/10 text-sm">

```bash
npx skills add \
  https://github.com/angular/skills
```

</div>

---
layout: default
---

# 依赖图 + 渐进披露

<div class="grid grid-cols-2 gap-6 mt-4">

<div v-click="1" class="p-5 rounded-xl bg-blue-500/10 border border-blue-400/25">

**架构：精简 SKILL.md 作依赖图**

- 入口只列能力（组件 / 路由 / 表单…）
- 每个任务指向 `references/` 专项文件
- 30+ 引用文件，**按需加载**

</div>

<div v-click="2" class="p-5 rounded-xl bg-green-500/10 border border-green-400/25">

**按 prompt 精准取用**

- 问路由 → `define-routes.md` + `loading-strategies.md`
- 问组件 → `components.md`
- `reactive-forms.md`、`component-harnesses.md` **不加载**

</div>

</div>

<div v-click="3" class="mt-6 p-4 rounded-lg bg-amber-500/10 border-l-4 border-amber-500">

📖 这是 Agent Skills 规范里「**渐进披露**」的教科书落地——SKILL.md 是目录，references 是按需打开的章节。全塞进上下文会爆。

</div>

---
layout: center
class: text-center
---

# 三条核心规则

<div class="grid grid-cols-3 gap-6 mt-8">

<div v-click="1" class="p-6 rounded-xl bg-gradient-to-b from-red-500/20 to-transparent border border-red-400/30">

### ①

**先分析项目 Angular 版本**

最佳实践随版本变；建新项目除非用户要求别指定版本

</div>

<div v-click="2" class="p-6 rounded-xl bg-gradient-to-b from-orange-500/20 to-transparent border border-orange-400/30">

### ②

**用 Angular CLI 脚手架**

组件 / 服务 / 指令 / 管道 / 路由，遵循风格指南

</div>

<div v-click="3" class="p-6 rounded-xl bg-gradient-to-b from-pink-500/20 to-transparent border border-pink-400/30">

### ③

**生成后必 `ng build`**

有错分析修复再继续，关键步骤不跳

</div>

</div>

<div v-click="4" class="mt-8 text-lg opacity-80">

第 ③ 条最工程化：不是「生成完就说完成」，而是**用 build 当验证门**

</div>

---
layout: default
---

# 规则③：build 验证闭环

<div v-click="1" class="mt-4 p-5 rounded-xl bg-pink-500/10 border-l-4 border-pink-500">

> 生成代码后**必须跑 `ng build`** 确保无构建错误。有错就分析错误信息、修复，再继续。**不要跳过这步——它是确保生成代码正确、可运行的关键。**

</div>

<div class="grid grid-cols-2 gap-6 mt-6">

<div v-click="2">

**工作流（非文档）**

```text
生成组件/服务
      ↓
   ng build
      ↓
  有错？ ──是──▶ 分析错误 → 修复
      │                    │
      否                    │
      ▼            ◀────────┘
    完成
```

</div>

<div v-click="3" class="p-5 rounded-lg bg-gray-500/10 self-center">

**同源的严谨**

- Vercel 叶：「先量后查」
- Next.js 叶：「hard floors」
- 本叶：**build 当证据**

生成 → 验证 → 修复的闭环

</div>

</div>

---
layout: default
---

# `ng new` 版本检测三步

<div class="mt-6">

| 步 | 条件 | 命令 |
| :---: | --- | --- |
| **1** | 用户显式指定版本（如 Angular 15） | `npx @angular/cli@<version> new <name>` |
| **2** | 没指定 + `ng version` 成功（已装） | `ng new <name>` |
| **3** | 没指定 + `ng version` 失败（没装） | `npx @angular/cli@latest new <name>` |

</div>

<div v-click="1" class="mt-8 grid grid-cols-3 gap-4 text-sm">

<div class="p-4 rounded-lg bg-blue-500/10 text-center">
显式版本<br/>**绕过本地安装**
</div>

<div class="p-4 rounded-lg bg-green-500/10 text-center">
已装 CLI<br/>**用本地 / 全局**
</div>

<div class="p-4 rounded-lg bg-purple-500/10 text-center">
未装<br/>**npx 取最新**
</div>

</div>

<div v-click="2" class="mt-6 text-center text-lg opacity-80">

不盲目 ng new，先**探测环境**用最合适的命令 —— 版本感知

</div>

---
layout: two-cols
layoutClass: gap-6
---

# 现代 Angular：Reactivity

<v-clicks>

- **signal / computed**：核心信号、reactive context、untracked
- **linkedSignal**：依赖源信号的可写状态
- **resource**：异步数据直接 fetch 进 signal 状态
- **effect**：副作用（日志 / 第三方 DOM），且讲**何时不该**用 effect

</v-clicks>

::right::

<div v-click="1" class="mt-14">

```typescript
// signal + computed
const count = signal(0);
const double = computed(() => count() * 2);

// linkedSignal：可写但跟随源
const items = signal([1, 2, 3]);
const selected = linkedSignal(
  () => items()[0]
);

// resource：异步进 signal
const user = resource({
  request: () => ({ id: id() }),
  loader: ({ request }) =>
    fetchUser(request.id),
});
```

</div>

---
layout: default
---

# 现代 Angular：Forms & Templates

<div class="grid grid-cols-2 gap-6 mt-4">

<div v-click="1" class="p-5 rounded-xl bg-indigo-500/10 border border-indigo-400/25">

**Forms**

- **新 app 优先 Signal Forms**（v21+）
- 老 app / 既有 forms：用匹配现有策略的类型

```typescript
// Signal Forms（v21+）
const f = form(signal({ name: '' }));
```

</div>

<div v-click="2" class="p-5 rounded-xl bg-teal-500/10 border border-teal-400/25">

**Templates**

- 控制流 `@if` / `@for` / `@switch`
- signal-based inputs/outputs
- host bindings & attribute injection

```html
@if (user(); as u) {
  <p>{{ u.name }}</p>
} @for (item of items(); track item.id) {
  <li>{{ item.name }}</li>
}
```

</div>

</div>

<div v-click="3" class="mt-6 p-3 rounded-lg bg-gray-500/10 text-center text-sm">

需要更深文档 → SKILL.md 指向 `references/`（signals-overview.md / resource.md…）或 angular.dev

</div>

---
layout: center
class: text-center
---

# 两个技能

<div class="grid grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">

<div v-click="1" class="p-8 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/10 border border-red-400/30">

### `angular-developer`

生成 Angular 代码 + 架构指导

<div class="mt-4 text-sm opacity-80">
组件 · reactivity · forms · DI · routing · SSR · a11y · animations · styling · testing · CLI
</div>

</div>

<div v-click="2" class="p-8 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-400/30">

### `angular-new-app`

用 Angular CLI 建新 app

<div class="mt-4 text-sm opacity-80">
现代应用的设置与结构指引，配合 `ng new` 版本检测逻辑
</div>

</div>

</div>

<div v-click="3" class="mt-8 text-lg opacity-70">

一装两技能：`npx skills add https://github.com/angular/skills`

</div>

---
layout: default
---

# 为什么是工程价值，而非文档封装

<div class="grid grid-cols-2 gap-5 mt-6">

<div v-click="1" class="p-5 rounded-xl bg-green-500/10 border border-green-400/25">

**✓ 依赖图 + 渐进披露**

不是把整份 Angular 文档塞进来，而是精心组织的**按需加载图**

</div>

<div v-click="2" class="p-5 rounded-xl bg-green-500/10 border border-green-400/25">

**✓ 版本感知**

先查版本再指导，`ng new` 三步逻辑——是**决策逻辑**，非静态文档

</div>

<div v-click="3" class="p-5 rounded-xl bg-green-500/10 border border-green-400/25">

**✓ build 验证闭环**

生成后必 ng build、错了自己修——是**工作流**，非文档

</div>

<div v-click="4" class="p-5 rounded-xl bg-green-500/10 border border-green-400/25">

**✓ 官方 + 随框架演进**

源在 angular/angular，与框架同步，权威且不漂移

</div>

</div>

<div v-click="5" class="mt-6 text-center text-lg opacity-80">

远超「Angular 文档的离线封装」——官方沉淀的、带决策逻辑和验证闭环的**开发工作流**

</div>

---
layout: default
---

# 边界与反模式

<div class="grid grid-cols-2 gap-6 mt-4">

<div v-click="1">

**边界**

| 维度 | 说明 |
| --- | --- |
| 专注 | 只服务 Angular，非通用 |
| 版本 | Signal Forms 要 v21+ |
| 依赖 | 需 Angular CLI（ng） |
| references | 30+ 文件靠依赖图导航 |

</div>

<div v-click="2">

**反模式**

| 反模式 | 问题 |
| --- | --- |
| 不查版本就指导 | 违背规则① |
| 跳过 ng build | 违背规则③ |
| 手写脚手架 | 违背规则② |
| 一次读全 references | 依赖图就是让你按需读 |

</div>

</div>

<div v-click="3" class="mt-6 p-4 rounded-lg bg-amber-500/10 border-l-4 border-amber-500 text-sm">

💡 贡献改 `angular/angular` 主仓库的 `skills/dev-skills/`，遵循 Angular commit 规范，PR 提到那里

</div>

---
layout: center
class: text-center
---

# 小结

<div class="grid grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto text-left">

<div v-click="1" class="p-5 rounded-xl bg-red-500/10">

**核心机制**

- 依赖图 + 渐进披露（30+ references）
- 三规则：查版本 / CLI 脚手架 / 必 ng build
- `ng new` 版本检测三步

</div>

<div v-click="2" class="p-5 rounded-xl bg-blue-500/10">

**现代 Angular**

- Signals（signal/computed/linkedSignal/resource/effect）
- Signal Forms（v21+ 优先）
- @if/@for/@switch

</div>

</div>

<div v-click="3" class="mt-10 text-xl">

**Angular 官方 · MIT · 源在 angular/angular**

</div>

<div v-click="3" class="mt-3 text-base opacity-70">

`npx skills add https://github.com/angular/skills`

</div>

<div v-click="4" class="abs-br m-6 text-sm opacity-60">
angular.dev · 生成后必 ng build 验证
</div>
