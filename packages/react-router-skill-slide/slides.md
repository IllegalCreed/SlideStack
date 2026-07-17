---
theme: seriph
background: https://cover.sli.dev
title: React Router Skill
info: |
  React Router 官方随库 Agent Skill：识别模式、读 node_modules 版本对齐文档。
  remix-run/react-router · .agents/skills/react-router。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# React Router Skill

React Router 官方随库技能——**认模式** + 读**版本对齐**的一手文档

<div class="pt-6 opacity-80">
remix-run/react-router · .agents/skills/react-router · Framework / Data / Declarative / RSC · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/remix-run/react-router/tree/main/.agents/skills/react-router" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
React Router Skill 是 React Router 官方出品的 AI 编码 agent 技能，教 agent 用当前安装版本的 API 正确写 React Router，而非过时训练数据。
-->

---
transition: fade-out
---

# 它是什么

官方随库技能，不是通用教程

<div class="grid grid-cols-2 gap-6 mt-6">
<div v-click>

**做什么**

- 教 agent 配路由、写 `loader`/`action`
- 处理表单、导航、pending/optimistic UI
- 先**识别模式**，再套对应写法
- 引导读随包安装的最新文档

</div>
<div v-click>

**价值**

- 随主仓库维护，**版本对齐**
- 规避「训练数据过时」
- 反模式明确（正误对照）
- 一条命令装，可进 CLI

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">

remix-run 官方 · MIT · <code>node_modules</code> 文档为真相源

</div>

<style>
h1 { background: linear-gradient(45deg, #F44250 10%, #FF8A5B 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
它不是通用路由教程，而是让 agent 少犯错、跟得上库版本的官方随库技能。
-->

---
transition: fade-out
---

# 关键演进：迁入主仓库

从独立仓库到「随库 + node_modules 文档」

<v-clicks>

- **① 迁入主仓库**：skill 从独立仓库 `remix-run/agent-skills`（已 ARCHIVED）搬进主仓库 `remix-run/react-router/.agents/skills/react-router/`，与库同仓、同步版本
- **② 文档进 node_modules**：官方把 markdown 文档随 npm 包发布到 `node_modules/react-router/docs/`——文档版本 = 你装的库版本
- **③ skill 瘦身**：本体大幅精简，引导 agent **直接读 node_modules 里的文档**，而非固化知识或依赖训练数据

</v-clicks>

<div v-click class="mt-6 text-center">

真相源指向**随包安装、版本对齐**的一手文档 · 见 discussion #15099

</div>

<style>
h1 { background: linear-gradient(45deg, #F44250 10%, #FF8A5B 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
核心演进三步：迁入主仓库、文档进 node_modules、skill 瘦身引导读本地文档。工程价值是真相源指向版本对齐的一手文档。
-->

---
transition: fade-out
---

# node_modules 文档策略

把随包安装的文档当**真相源**

```txt
node_modules/react-router/docs/
├── index.md
├── start/         # 各模式起步：routing / data-loading / actions
├── how-to/        # spa / pre-rendering / react-server-components
├── explanation/
└── upgrading/      # future.md 及各版本升级
```

<div v-click class="mt-4">

- 文档顶部有**模式标记** `[MODES: framework, data, declarative]`，只应用匹配当前模式的
- 无本地 docs 时：仓库内回退仓库 `docs/`；消费方回退**版本匹配**的官网文档

</div>

<style>
h1 { background: linear-gradient(45deg, #F44250 10%, #FF8A5B 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
新 skill 明确把随包安装的文档当真相源。库升级文档跟着升级，agent 读到的自然是新版，解决 AI 用过时 API 的老问题。
-->

---
transition: fade-out
---

# 先认模式，再动手

React Router is mode-specific

| 模式 | 关键信号 | reference |
| --- | --- | --- |
| **Framework** | `@react-router/dev`、`react-router.config.ts`、`app/routes.ts` | `framework-mode.md` |
| **Data** | `createBrowserRouter` + `<RouterProvider>` | `data-mode.md` |
| **Declarative** | `<BrowserRouter>` + `<Routes>`/`<Route>` | `declarative-mode.md` |
| **unstable RSC** | `unstable_reactRouterRSC`、`@vitejs/plugin-rsc` | `+ rsc.md` |

<div v-click class="mt-5 text-center text-sm opacity-80">

别把框架 / 数据模式的 `loader`/`action` 硬套给声明式应用（除非有意迁移）

</div>

<style>
h1 { background: linear-gradient(45deg, #F44250 10%, #FF8A5B 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
第一原则是先识别模式，加载匹配 reference，再读文档。绝不能在没打算迁移时把框架模式套路塞给声明式应用。
-->

---
transition: fade-out
---

# 框架模式：全栈体验

`@react-router/dev` + Vite 插件

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**覆盖**

- 文件路由 `app/routes.ts`
- `loader`/`clientLoader` 加载
- `action`/`clientAction` 变更
- 会话鉴权、中间件（v7.9+）

</div>
<div v-click>

**渲染策略**

- SSR（默认 `ssr:true`）
- SPA（`ssr:false` + `clientLoader`）
- 预渲染（`prerender`）
- 类型安全 `./+types/...`

</div>
</div>

<div v-click class="mt-5 text-center text-sm opacity-80">

`action` 完成后，页面所有 `loader` **自动重新校验**

</div>

<style>
h1 { background: linear-gradient(45deg, #F44250 10%, #FF8A5B 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
框架模式是全栈开发体验：文件路由、服务端客户端渲染、数据加载变更、类型安全路由模块。action 完成后 loader 自动重新校验。
-->

---
transition: fade-out
---

# 数据模式：给已有应用补数据

`createBrowserRouter` + `RouterProvider`，无 Vite 插件

```tsx
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  { path: "/", Component: Root, children: [
    { index: true, Component: Home },
    { path: "about", Component: About },
  ]},
]);

createRoot(el).render(<RouterProvider router={router} />);
```

<div v-click class="mt-3 text-center text-sm opacity-80">

路由对象 · `loader`/`action` · `useNavigation` pending UI · `useFetcher` 乐观更新

</div>

<style>
h1 { background: linear-gradient(45deg, #F44250 10%, #FF8A5B 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
数据模式用 createBrowserRouter 加 RouterProvider，不需要 Vite 插件，适合给已有 React 应用补数据加载与变更能力。
-->

---
transition: fade-out
---

# 声明式模式：最简路由

`BrowserRouter`，仅路由 + 读 URL，无数据能力

```tsx
import { BrowserRouter, Routes, Route } from "react-router";

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="users/:userId" element={<User />} />
  </Routes>
</BrowserRouter>
```

<div v-click class="mt-3 text-center text-sm opacity-80">

`<Link>`/`<NavLink>` 导航 · `useParams` 读段 · `useSearchParams` 读查询串 · **无** `loader`/`action`

</div>

<style>
h1 { background: linear-gradient(45deg, #F44250 10%, #FF8A5B 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
声明式模式最简单：BrowserRouter 加 Routes/Route 做基础客户端路由，用 useParams useSearchParams 读 URL，没有数据加载能力。
-->

---
transition: fade-out
---

# unstable RSC 模式

React Server Components 支持（仍 unstable）

<v-clicks>

- 分两变体：**RSC Framework** 与 **RSC Data**
- 信号：`unstable_reactRouterRSC`、`@vitejs/plugin-rsc`、`entry.rsc`、`ServerComponent`/`ServerErrorBoundary`
- 指令：`"use client"` / `"server-only"` / `"client-only"`
- 读法：RSC Framework 读 `framework-mode.md` + `rsc.md`；RSC Data 读 `data-mode.md` + `rsc.md`
- 主文档：`node_modules/react-router/docs/how-to/react-server-components.md`

</v-clicks>

<div v-click class="mt-5 text-center text-sm opacity-80">

带 `unstable_` 前缀，API 可能变——勿在生产强依赖

</div>

<style>
h1 { background: linear-gradient(45deg, #F44250 10%, #FF8A5B 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
新版还覆盖 unstable 的 RSC，分 Framework 和 Data 两变体。因是 unstable，API 可能变，勿在生产强依赖。
-->

---
transition: fade-out
---

# 安装

一条命令装进项目

```bash
# 新版（主仓库，推荐）
npx skills add https://github.com/remix-run/react-router \
  --skill react-router

# 旧版（独立仓库，已归档 —— 仅作了解）
npx skills add remix-run/agent-skills
```

<div v-click class="mt-4">

- 装后 agent 写 / 改 React Router 代码时自动引用
- `create-react-router` 新建项目时可**默认带上**该技能

</div>

<style>
h1 { background: linear-gradient(45deg, #F44250 10%, #FF8A5B 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
新版一条 npx skills add 装进项目。create-react-router 新建项目时可默认带上，新项目即刻具备版本对齐的 agent 指引。
-->

---
transition: fade-out
---

# 表单与变更：选对姿势

搜索 vs 变更 vs 内联

| 场景 | 用法 | 原因 |
| --- | --- | --- |
| 搜索 / 筛选 | `<Form method="get">` | 自动更新 URL search params |
| 变更后跳转 | `<Form method="post">` | 创建后 redirect |
| 无导航变更 | `useFetcher` | 独立状态、不刷新、可乐观 |
| 一页多变更 | `useFetcher` | 每个 fetcher 状态独立 |

<div v-click class="mt-4 text-center text-sm opacity-80">

乐观 UI：用 `fetcher.formData` 立刻显示预期结果 · 默认用 `useFetcher` 做变更

</div>

<style>
h1 { background: linear-gradient(45deg, #F44250 10%, #FF8A5B 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
表单选型：搜索用 Form method get 自动更新 search params，内联变更用 useFetcher 不导航可乐观更新。默认用 useFetcher 做变更。
-->

---
transition: fade-out
---

# 反模式 & 边界

别踩这些坑

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**反模式**

- ❌ 框架/数据写法套给声明式
- ❌ 搜索手动 `setSearchParams`
- ❌ 内联变更用 `<Form>` 致整页刷新
- ❌ `meta` 用弃用的 `data`（应 `loaderData`）
- ❌ 依赖训练数据里的旧 API

</div>
<div v-click>

**边界**

- 只讲 React Router，别的路由库在相邻叶
- `node_modules` 文档策略需库随包发 docs
- RSC 为 unstable
- 中间件需 v7.9.0+
- 只教「怎么用」，选型靠你

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #F44250 10%, #FF8A5B 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
反模式：别把框架模式套给声明式、别手动处理 search params、内联变更别用 Form、meta 用 loaderData、别依赖旧 API。边界是单库聚焦、文档策略前提、RSC unstable。
-->

---
layout: center
class: text-center
---

# 一句话记住

**React Router 官方随库技能：先认模式（Framework/Data/Declarative/RSC），再读 `node_modules` 里版本对齐的文档——从根上规避「AI 用过时 API」。**

<div class="mt-8 opacity-80">

随库维护 · 版本对齐 · 认模式 · node_modules 真相源 · 反模式明确

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/remix-run/react-router/tree/main/.agents/skills/react-router" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://reactrouter.com" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #F44250 10%, #FF8A5B 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。React Router 官方随库技能：先认模式再读 node_modules 版本对齐文档，从根上规避 AI 用过时 API。演进即最佳实践范本。
-->
