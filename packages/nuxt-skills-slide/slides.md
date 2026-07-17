---
theme: seriph
background: https://cover.sli.dev
title: Nuxt Skills
info: |
  Nuxt Skills（onmax/nuxt-skills）——面向 AI 编码助手的 Vue / Nuxt / NuxtHub 技能集。
  社区项目，非官方，MIT。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Nuxt Skills

面向 AI 编码助手的 **Vue / Nuxt / NuxtHub 技能集** · 21 个 skill

<div class="pt-6 opacity-80">
onmax/nuxt-skills · 社区项目（非官方）· agentskills.io · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/onmax/nuxt-skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #36E4DA 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Nuxt Skills 是 onmax 维护的社区项目，把 Nuxt 全栈知识打包成 21 个可按需加载的 AI agent 技能。开场先点明：社区、非官方、MIT。
-->

---
transition: fade-out
---

# 定位：社区项目，非官方

一句话说清它是什么、不是什么

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**它是**

- 作者 **onmax**（Nuxt 生态贡献者）的个人仓库
- 21 个 Vue/Nuxt/NuxtHub 的 AI agent 技能
- agentskills.io 开放格式，MIT，★688

</div>
<div v-click>

**它不是**

- ❌ 不是 `nuxt` 官方 org 的发布物
- ❌ 官方 PR #33498 已关闭未合并
- ⚠️ README 预告可能迁站 nuxt-skill.onmax.me

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">
官方内置仍在讨论：RFC #34059「在 Nuxt 模块里内置 Agent Skills」
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #36E4DA 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
最关键的一页：如实呈现社区、非官方定位。官方尝试 PR 已关闭，官方化走的是 RFC 34059 让模块自带 skills 的路。别把它当官方产物。
-->

---
transition: fade-out
---

# 21 个 skill，五大组

一条命令装进「Nuxt 全栈那套」

<div class="grid grid-cols-3 gap-3 mt-4 text-sm">
<div v-click class="p-3 rounded border border-teal-500/40">

**核心**

`nuxt` · `vue`

</div>
<div v-click class="p-3 rounded border border-teal-500/40">

**Nuxt 生态**

`nuxthub` `nuxt-content` `nuxt-ui` `nuxt-modules` `nuxt-seo` `nuxt-studio` `nuxt-better-auth`

</div>
<div v-click class="p-3 rounded border border-teal-500/40">

**Vue 生态**

`reka-ui` `vueuse` `motion` `tresjs`

</div>
<div v-click class="p-3 rounded border border-teal-500/40">

**工具链**

`vite` `vitest` `pnpm` `tsdown` `ts-library`

</div>
<div v-click class="p-3 rounded border border-teal-500/40">

**写作 / 游戏**

`document-writer` `writing-web-documentation` `phaser-best-practices`

</div>
<div v-click class="p-3 rounded border border-teal-500/40 opacity-80">

**小注**

README 列 19，仓库实 ships **21** 个文件夹

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #36E4DA 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
21 个 skill 分五组：核心、Nuxt 生态、Vue 生态、工具链、写作与游戏。注意 README 表只列 19 行，磁盘上实际有 21 个文件夹（多 nuxt-studio 和 phaser）。
-->

---
transition: fade-out
---

# 安装：一条命令

自动检测 agent，交互式挑选

<div v-click>

```bash
npx skills add onmax/nuxt-skills
# -g 装到用户级（全局）  ·  -y 一次装全部
```

</div>

<div v-click class="mt-3">

Claude Code 用户还可作为一个插件装（内部动态发现全部 skill）：

```bash
/plugin marketplace add onmax/nuxt-skills
/plugin install nuxt-skills@nuxt-skills
```

</div>

<div v-click class="mt-3 text-center text-sm opacity-80">
跨 agent：Claude Code · Cursor · Codex · OpenCode · Copilot · Gemini · Antigravity · Roo Code
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #36E4DA 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
装法：npx skills add onmax/nuxt-skills，自动检测已装 agent。Claude Code 还能走 marketplace 作为插件装。一套 skill 跨八种 agent 通用。
-->

---
transition: fade-out
---

# 渐进披露：省 token 的分层

入口常驻，子文件按需

<v-clicks>

- **`SKILL.md`**（~300 token）：只讲「何时用 / 有哪些子文件 / 快速开始」
- **`references/*.md`**（每个 ~800–1500 token）：任务相关时才加载
- 入口明写 **「DO NOT load all files at once」**

</v-clicks>

<div v-click class="mt-3">

`nuxt` skill 的加载清单（agent 按当前任务勾选）：

```md
- [ ] references/server.md     # 建 API 端点时
- [ ] references/routing.md    # 建 pages / layouts 时
- [ ] references/nuxt-config.md # 改 nuxt.config.ts 时
```

</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #36E4DA 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
渐进披露是省 token 的核心：主 skill 只 300 token 作入口，references 子文件用到才加载，用完即走。别一次全读。
-->

---
transition: fade-out
---

# Nuxt 核心：锁定 Nuxt 4+ 写法

`nuxt` skill 用对照表纠正旧写法

| 旧（Nuxt 2/3） | 新（Nuxt 4） |
| --- | --- |
| `<Nuxt />` | `<NuxtPage />` |
| `context.params` | `getRouterParam(event, 'name')` |
| `window.origin` | `useRequestURL().origin` |
| 字符串路由 | 类型化 router（路由名） |
| 独立 `layouts/` | 父路由 + `<slot>` |

<div v-click class="mt-3 text-center text-sm opacity-80">
版本锁：Nuxt 4.3+ · h3 v1 · nitropack v2（别套 h3 v2 / nitro v3 文档）
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #36E4DA 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
nuxt skill 明确锁 Nuxt 4.3+、h3 v1、nitro v2，用对照表把 Nuxt 3 旧写法映射到新写法。红旗机制会主动拦截过时念头。
-->

---
transition: fade-out
---

# Nuxt 核心：数据获取与共享态

用 `useFetch` / `useAsyncData`，别用裸 `fetch()`

```ts
// 组件里取数据：自带去重 + SSR
const { data, error, refresh } = await useFetch('/api/users')

// 带 key 去重（同一 key 只发一次）
const { data: user } = await useFetch(`/api/users/${id}`, {
  key: `user-${id}`,
})

// 跨组件共享状态（SSR 安全）
const counter = useState('counter', () => 0)
```

<div v-click class="mt-2 text-sm opacity-80">
Nuxt 4：<code>useAsyncData</code> 的 data 默认<strong>浅响应式</strong>（需 <code>deep: true</code>）；4.2+ 支持 <code>dedupe</code> 与 AbortController 取消。
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #36E4DA 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
数据获取用 useFetch/useAsyncData，自带去重和 SSR，别用裸 fetch。跨组件共享态用 useState。Nuxt 4 里 useAsyncData 默认浅响应式，是个易踩的变化。
-->

---
transition: fade-out
---

# Nuxt 核心：server 路由

文件名 = HTTP 方法 + 路由

```ts
// server/api/users/[userId].get.ts → GET /api/users/:userId
export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')
  if (!userId)
    throw createError({ statusCode: 400, message: 'required' })
  return await fetchUserById(userId)
})
```

<div v-click class="mt-3 text-sm">

- `users.get.ts` → `GET /api/users`；`users.post.ts` → `POST`
- 取参用 `getRouterParam`，**别用** `event.context.params`
- 用**描述性参数名** `[userId]`，别用泛化 `[id]`

</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #36E4DA 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
server 路由靠文件名决定方法和路径。取参用 getRouterParam，不是 event.context.params。红旗强调用描述性参数名 userId，不用泛化 id。
-->

---
transition: fade-out
---

# Nuxt 核心：SSR 与 hydration

服务端先渲染，客户端再注水

<v-clicks>

- **`window` 在 SSR 阶段不存在** → 取地址用 `useRequestURL()`（两端通用）
- **数据获取要 SSR 安全** → `useFetch`/`useAsyncData` 服务端取好、随 HTML 送达，避免二次请求与 hydration 不匹配
- **私有配置只在服务端** → `useRuntimeConfig().apiSecret` 客户端为 `undefined`，公开值放 `.public`

</v-clicks>

<div v-click class="mt-3">

```ts
const url = useRequestURL()
const apiUrl = `${url.origin}/api/users` // SSR 也可用
```

</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #36E4DA 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
SSR/hydration 三要点：window 在服务端不存在用 useRequestURL；数据获取用 useFetch 保证 SSR 安全避免 hydration 不匹配；私有配置只在服务端。
-->

---
transition: fade-out
---

# 生态 skills：全家桶

各管一摊，组合覆盖全栈

<div class="grid grid-cols-2 gap-x-6 gap-y-1 mt-4 text-sm">
<div v-click>

- **`nuxthub`** DB(Drizzle)/KV/Blob/Cache、多云
- **`nuxt-content`** collections/queryCollection/MDC
- **`nuxt-ui`** v4 组件/表单校验/主题

</div>
<div v-click>

- **`reka-ui`** 无头 Vue（前 Radix Vue）
- **`nuxt-seo`** sitemap/og-image/schema-org
- **`tresjs`** Vue 版 Three.js（3D）

</div>
</div>

<div v-click class="mt-3">

```ts
// NuxtHub：server 端自动导入 db 与 schema
import { db, schema } from 'hub:db'
const users = await db.select().from(schema.users)
```

</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #36E4DA 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
生态 skills 各管一摊：nuxthub 管全栈存储、nuxt-content 管内容、nuxt-ui 管界面、reka-ui 无头、nuxt-seo、tresjs 3D。NuxtHub 用 hub:db 虚拟模块自动导入 db 和 schema。
-->

---
layout: default
transition: fade-out
---

# 官方化进程

社区先行，官方内置在路上

<div class="mt-6 space-y-3">
<div v-click class="flex items-center gap-3">
  <span class="text-teal-400 font-bold w-28">社区仓库</span>
  <span>onmax/nuxt-skills 活跃维护，CI 自动从上游更新</span>
</div>
<div v-click class="flex items-center gap-3">
  <span class="text-red-400 font-bold w-28">PR #33498</span>
  <span>给 nuxt 官方仓库加 Claude Code skill —— <strong>已关闭未合并</strong></span>
</div>
<div v-click class="flex items-center gap-3">
  <span class="text-amber-400 font-bold w-28">RFC #34059</span>
  <span>讨论「在 Nuxt 模块里内置 Agent Skills」—— 落地则「装模块即得 skill」</span>
</div>
<div v-click class="flex items-center gap-3">
  <span class="text-gray-400 font-bold w-28">未来</span>
  <span>README 预告可能迁站 nuxt-skill.onmax.me</span>
</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #36E4DA 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
官方化时间线：社区仓库先行；官方 PR 33498 已关闭；官方化改走 RFC 34059 让模块自带 skills；未来可能迁站。现在用社区版没问题，但要知道官方内置还在讨论。
-->

---
transition: fade-out
---

# 反模式与边界

用之前先记住这些

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**❌ 别这样**

- 把它标成「Nuxt 官方 Skills」
- 用 `event.context.params`、泛参 `[id]`
- 一次加载所有 references
- 用裸 `fetch()` 取数据

</div>
<div v-click>

**✅ 该这样**

- 如实标注：社区、非官方
- 用 `getRouterParam` + 描述性参数名
- 按任务勾选加载子文件
- 用 `useFetch` / `useAsyncData`

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">
skill 里的版本号（NuxtHub v0.10.6、Nuxt UI v4.4）是快照，破坏性变更以上游官方为准。
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #36E4DA 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
反模式：别当官方、别用 Nuxt 3 旧写法、别一次加载全部、别用裸 fetch。版本号是快照，以上游官方为准。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Nuxt Skills（onmax，社区非官方）= 21 个 Vue/Nuxt/NuxtHub 的 AI agent 技能，`npx skills add onmax/nuxt-skills` 一键装、渐进披露省 token、锁定 Nuxt 4+ 写法。**

<div class="mt-8 opacity-80">
社区项目 · 21 skills · 渐进披露 · Nuxt 4+ · 跨 agent · 官方化在路上（RFC #34059）
</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/onmax/nuxt-skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://nuxt.com/docs" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #36E4DA 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Nuxt Skills 是社区非官方的 21 个 Nuxt 全栈 AI 技能，一键装、渐进披露省 token、锁定 Nuxt 4 写法。官方内置还在 RFC 讨论。
-->
