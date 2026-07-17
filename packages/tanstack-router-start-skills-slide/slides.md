---
theme: seriph
background: https://cover.sli.dev
title: TanStack Router & Start Skills
info: |
  TanStack 官方 Agent Skills：走 TanStack Intent 随 npm 包发布，版本同步不漂移。
  Router + Start 官方 skills，源在 TanStack/router 仓库。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# TanStack Router & Start Skills

官方 skills 走 **TanStack Intent**——随 npm 包发布，版本同步**不漂移**

<div class="pt-6 opacity-80">
@tanstack/intent · Router + Start 官方 skills · MIT · agentskills.io
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/TanStack/intent" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
TanStack Router 和 Start 的官方 Agent Skills 走的是 TanStack Intent 这条路：维护者用 intent CLI 生成校验，随 npm 包一起发布 SKILL.md，装包就带技能，随版本同步不漂移。
-->

---
transition: fade-out
---

# TanStack Intent 是什么

给库维护者的 CLI：把 Agent Skills 当**包产物**发布与消费

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**是什么**

- `@tanstack/intent`，一个 CLI
- 技能 = 一份 **SKILL.md**，教 agent 正确用某个库
- 从项目与工作区依赖里**发现**技能，匹配任务时加载

</div>
<div v-click>

**解决什么**

- 传统「文档」和「代码」两条线，易脱节
- Intent 把技能**随库版本一起**进 npm 包
- 装哪个版本，就得到那个版本的 SKILL.md

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

源在 `TanStack/router` 仓库的 `packages/*/skills/`，遵 agentskills.io 开放标准，MIT。

</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Intent 是给库维护者用的 CLI，把 Agent Skills 当作包产物来发布和消费。技能就是一份 SKILL.md，教 agent 怎么正确用这个库。它解决的核心问题是文档和代码脱节——把技能随库版本进 npm 包。
-->

---
transition: fade-out
---

# skills 随包发布 —— 为什么不漂移

技能跟着库版本走同一条 release 流水线

<div v-click>

```text
库仓库 packages/*/skills/SKILL.md
        │  跟随同一条 release 流水线
        ▼
   发布进 npm 包（随版本一起）
        │  npm i @tanstack/react-start
        ▼
 intent load @tanstack/react-start#react-start
        │
        ▼
 打印「当前安装版本」的 SKILL.md → 不漂移
```

</div>

<div v-click class="mt-3 text-center">

库升级 → 包里 SKILL.md 一起更新 → agent 读到的永远匹配当前代码。

</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
随包发布是 Intent 的核心。维护者在库仓库的 skills 目录写 SKILL.md，跟着同一条 release 流水线发布。你装某个版本的包，就得到那个版本的技能。intent load 打印的是当前安装版本的内容，所以永远不漂移。
-->

---
transition: fade-out
---

# 消费者三步

install → 白名单 → load

<v-clicks>

1. **`intent install`**——写 `intent-skills` 引导块进 `AGENTS.md` / `CLAUDE.md` / `.cursorrules`
2. **配白名单**——`package.json#intent.skills` 显式授权哪些包能贡献技能
3. **`intent load`**——agent 按需加载当前版本的 SKILL.md

</v-clicks>

<div v-click class="mt-4">

```json
{ "intent": { "skills": ["@tanstack/*"] } }
```

</div>

<div v-click class="mt-2 text-center text-sm opacity-80">

npm `npx` · pnpm `pnpm dlx` · Yarn `yarn dlx` · Bun `bunx`，接 `@tanstack/intent@latest`

</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
消费者三步：intent install 写引导块进 agent 配置；在 package.json 配 intent.skills 白名单，授权哪些包能贡献技能；agent 按需 intent load 加载当前版本。包管理器不同就换对应的运行器。
-->

---
transition: fade-out
---

# 信任模型：发现 ≠ 授权

技能是 agent 会照做的指令，谁能贡献是**信任决策**

<div class="grid grid-cols-2 gap-6 mt-6">
<div v-click>

**发现（自动）**

- 扫每个带 `skills/` 的已安装包
- 含 `node_modules`、工作区、传递依赖
- 静态读文件，**从不执行**被发现包的代码

</div>
<div v-click>

**授权（显式）**

- `intent.skills` 白名单精确或 `*` 命中才生效
- 未列的包被丢弃并报告
- **信任不传递**——依赖的依赖仍需单独授权

</div>
</div>

<div v-click class="mt-6 text-center">

把一个包加进依赖树，**不会**因此通过 Intent 跑它的代码。

</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
信任模型很关键。发现是自动的——扫每个带 skills 目录的包，但只静态读文件，从不执行被发现包的代码。授权是显式的——白名单命中才生效，信任不传递。加个包进依赖树不会因此跑它的代码。
-->

---
layout: default
transition: slide-up
---

# Router vs Start 定位

上下两层：Router 管路由与类型，Start 加服务端

| 维度 | TanStack Router | TanStack Start |
| --- | --- | --- |
| 是什么 | 类型安全、文件式路由（SPA） | 建在 Router 上的**全栈**框架 |
| 核心 | route loaders、搜索参数、类型全推断 | server functions、SSR/streaming、RSC |
| 执行 | **client-first**（loader 默认跑客户端） | **默认同构**（两端都跑） |
| npm 包 | `@tanstack/react-router` | `@tanstack/react-start`（re-export Router） |

<div v-click class="mt-4 text-center text-sm opacity-80">

用 Start 时 Router 的技能同样适用——因为 Start re-export 了 Router 的能力。

</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Router 和 Start 是上下两层。Router 管类型安全的文件式路由，是 client-first。Start 建在它之上加全栈能力，默认同构。Start 的包 re-export 了 Router，所以用 Start 时 Router 的技能同样适用。
-->

---
transition: fade-out
---

# Router 技能：react-router

开篇即钉三条铁律

<v-clicks>

- **类型全推断**——永远别 cast、别注解推断出来的值
- **client-first**——loader 默认跑在客户端，不是服务端
- **别混淆**——`@tanstack/react-router` ≠ Remix 的 `react-router-dom`

</v-clicks>

<div v-click class="mt-3">

不写这段类型注册，`Link` / `useNavigate` / `useSearch` 就**没有类型安全**：

```tsx
const router = createRouter({ routeTree })
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
react-router 技能开篇钉三条铁律：类型全推断别 cast，loader 是 client-first 默认跑客户端，别把它当 Remix 的 react-router-dom。还有一个必写的类型注册，不写它 Link、useNavigate 就没有类型安全。
-->

---
transition: fade-out
---

# 组合技能：router-query

Router 当**协调者**，Query 当**缓存**

```tsx
export function createAppRouter() {
  const queryClient = new QueryClient() // 每请求一个，防跨请求泄漏
  return createRouter({
    routeTree,
    defaultPreloadStaleTime: 0, // 让 Query 掌控缓存
    context: { queryClient },
  })
}
```

<div v-click class="mt-3 grid grid-cols-2 gap-4 text-sm">
<div>

**`defaultPreloadStaleTime: 0`**——否则 Router 30s preload 缓存会盖过 Query

</div>
<div>

**SSR 下 `QueryClient` 建在工厂里**——模块级单例会跨请求泄漏数据

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
router-query 组合技能的心智模型是 Router 当协调者触发取数，Query 当缓存。两条铁律：必须设 defaultPreloadStaleTime 0，否则 Router 的 preload 缓存盖过 Query；SSR 下 QueryClient 要建在工厂函数里每请求一个，模块级单例会跨请求泄漏数据。
-->

---
transition: fade-out
---

# Start 技能：react-start

**默认同构**，server-only 才用 `createServerFn`

```tsx
const updatePost = createServerFn({ method: 'POST' })
  .validator((data: { id: string; title: string }) => data)
  .handler(async ({ data }) => {
    await db.posts.update(data.id, { title: data.title })
    return { success: true }
  })
```

<div v-click class="mt-3 text-sm">

- `@tanstack/react-start` re-export core（`createServerFn` / `createMiddleware` / `createStart`）
- 外加 React 专属 **`useServerFn`**——在组件里调 server function
- 服务端工具从 `@tanstack/react-start/server` 导入

</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
react-start 技能钉住默认同构——所有代码两端都跑，server-only 逻辑才用 createServerFn。server function 用 validator 校验入参、handler 处理。这个包 re-export 了 core 的能力，外加 React 专属的 useServerFn hook 在组件里调用。
-->

---
transition: fade-out
---

# Start 子技能：Server Components

把 RSC 当**可 fetch 的 Flight 载荷**，从归属出发选最小原语

<div class="grid grid-cols-3 gap-4 mt-6 text-sm">
<div v-click>

**传输原语**

- `renderServerComponent`
- `createCompositeComponent`
- Flight 低层 API

</div>
<div v-click>

**缓存归属**

- Router 缓存
- TanStack Query
- GET + 缓存头

</div>
<div v-click>

**刷新归属**

- `router.invalidate()`
- `invalidateQueries`
- 混合则两边都失效

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">

硬约束：loader 别放 DB/密钥/Node-only API；Query 缓存的 RSC 值要 `structuralSharing: false`。

</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
server-components 子技能针对 React 19 RSC。心智模型是把 RSC 当可 fetch 的 Flight 载荷，从三个归属出发：传输原语选最小够用的，缓存归属选 Router 还是 Query，刷新归属对准真正的缓存拥有者。硬约束是 loader 别放服务端专属的东西。
-->

---
layout: default
transition: slide-up
---

# 迁移技能：两条 lifecycle

可勾选的逐步迁移清单

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**migrate-from-react-router**

- 从 React Router v7 → TanStack Router
- 导航用 `to` + `params`，**别**插模板字符串
- `useSearchParams` → `validateSearch` + `useSearch`
- 卸载 `react-router` 让残留变 TS 错误

</div>
<div v-click>

**migrate-from-nextjs**

- 从 Next.js App Router → TanStack Start
- **同构 vs server-only**——与 Next.js 正相反
- Server Actions → `createServerFn`，去掉 `"use server"`
- `app/layout.tsx` → `src/routes/__root.tsx`

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
两个迁移技能都是可勾选的清单。migrate-from-react-router 从 v7 迁过来，关键是导航用 to 加 params 别插字符串，卸载残留让它变 TS 错误。migrate-from-nextjs 从 App Router 迁，最大差异是同构 vs server-only 正好相反，Server Actions 换成 createServerFn。
-->

---
transition: fade-out
---

# intent CLI 命令

消费侧发现加载，维护侧生成校验

<div class="grid grid-cols-2 gap-6 mt-4 text-sm">
<div v-click>

**消费侧**

- `list`——发现带 `skills/` 的包
- `install`——写 `intent-skills` 引导块
- `hooks install`——Claude Code / Codex 阻断钩子
- `load <包>#<技能>`——打印当前版本 SKILL.md

</div>
<div v-click>

**维护侧**

- `scaffold`——AI 辅助生成技能树
- `validate`——校验格式（`--fix` / `--check`）
- `stale`——报告技能是否引用过时源

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">

统一 `@tanstack/intent@latest <命令>`，随包管理器换运行器。

</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
CLI 命令分两侧。消费侧：list 发现、install 写引导块、hooks install 装阻断钩子、load 打印当前版本技能。维护侧：scaffold 生成、validate 校验、stale 报陈旧。
-->

---
transition: fade-out
---

# 反模式：别这么干

<v-clicks>

- 把 `@tanstack/react-router` 当 `react-router-dom` 用——两库 API 完全不同
- 导航把参数插进 `to` 字符串——应 `to` + `params`
- 忘了类型注册——`Link` / `useNavigate` 全无类型安全
- loader 里放 DB / 密钥 / Node-only API——loader 同构会泄漏
- Query + Router 忘设 `defaultPreloadStaleTime: 0`
- SSR 用模块级单例 `QueryClient`——跨请求泄漏数据
- 采用社区 UNOFFICIAL 技能集——以官方 Intent 随包发布为准

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
反模式快速过一遍：别把 TanStack Router 当 Remix 的 react-router-dom；导航用 to 加 params 别插字符串；别忘类型注册；loader 别放服务端专属的东西；Query 加 Router 记得设 defaultPreloadStaleTime 0；SSR 别用模块级单例 QueryClient；别采用社区非官方技能集。
-->

---
layout: center
class: text-center
---

# 一句话记住

**TanStack 官方 skills 走 Intent 随 npm 包发布、随版本同步不漂移；Router（类型全推断、client-first）+ Start（默认同构、`createServerFn`、RSC）各一组，白名单显式授权、静态发现不执行代码。**

<div class="mt-8 opacity-80">

随包发布 · 版本同步 · 静态发现 · 白名单信任 · Router + Start

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/TanStack/intent" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://tanstack.com/intent" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #6366f1 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。TanStack 官方 skills 走 Intent 随 npm 包发布、版本同步不漂移。Router 一组钉类型全推断和 client-first，Start 一组钉默认同构和 createServerFn 加 RSC。信任模型靠白名单显式授权、静态发现不执行代码。
-->
