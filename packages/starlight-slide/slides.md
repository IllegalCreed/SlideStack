---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Starlight
info: |
  Presentation Starlight for developers.

  Learn more at [https://starlight.astro.build/](https://starlight.astro.build/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center text-9xl">
  ✦
</div>

<br/>

## Starlight — Astro Documentation Theme

由 Astro 团队官方主导的文档主题，跑在 Astro Islands 之上，默认零客户端 JS（基于 v0.36+）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天讲 Starlight —— Astro 团队官方维护的文档站主题。
它不是独立 SSG，而是建立在 Astro 之上的「集成」（Integration）——
你装 Astro + 启用 starlight 集成，就拥有一个开箱即用的文档站。

最新稳定版是 v0.36.x（也有部分项目在用 v0.39+，本次讲解以 0.36+ 为主）。
核心卖点是「Astro Islands 架构 + 默认零 JS + Pagefind 内置搜索」——
Lighthouse 几乎都是 100 分。
知名用户包括 Astro 自家文档、Cloudflare Workers Docs、Bun 部分页面，
Web 性能党与文档站团队的事实选择之一。
-->

---
transition: fade-out
---

# 什么是 Starlight？

Astro 出品，跑在 Astro Islands 之上的文档主题

<v-click>

- **Astro 集成**：不是独立 SSG，而是 Astro 的官方 Integration
- **零客户端 JS 默认**：Astro Islands 架构，仅交互组件 hydrate
- **Pagefind 内置搜索**：构建期生成索引，零运行时成本
- **Expressive Code 高亮**：Shiki + 行号 + 高亮 + diff，开箱即用
- **i18n / dark mode / 主题定制**：全套配置驱动，无需写组件
- **MDX + Astro Component**：能 import 任意 React / Vue / Svelte / Solid 岛

</v-click>

<br>

<div v-click>

```bash
npm create astro@latest -- --template starlight
```

</div>

<div v-click text-xs>

_Read more about_ [_Getting Started_](https://starlight.astro.build/getting-started/)

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Starlight 与 Nextra / VitePress 最大的不同是「它不是独立 SSG」——
它就是 Astro 的一个 integration。你的项目本质上是 Astro 项目，
只是启用了 starlight 集成后，得到一套完整的文档站 UI + 配置体系。

这种「站在巨人肩膀上」的设计带来三个好处：
1. 完全复用 Astro 生态 —— 任意 framework 组件（React/Vue/Svelte/Solid）都能 import
2. 零默认 JS —— Astro Islands 架构本身就是「按需 hydrate」
3. 构建速度极快 —— Vite + esbuild 加持

[click] 安装命令：用 Astro 官方脚手架 + starlight 模板，
一条命令生成完整可运行的文档项目（含示例内容 + 配置）。
-->

---
transition: fade-out
---

# Starlight 的定位与生态

为什么文档站团队偏爱它？

<v-click>

| 维度 | Starlight | VitePress 1 | Nextra 4 | Docusaurus 3 | MkDocs |
| --- | --- | --- | --- | --- | --- |
| 底层运行时 | **Astro 5 Islands** | Vue 3 + Vite | Next.js 15 + RSC | React 18 + Webpack | Python + Jinja |
| 默认首屏 JS | **0 KB** | 极少 | 80~200 KB | 较多 | 0 KB |
| 内容格式 | MD + MDX | Markdown + Vue | MDX 3 | MDX 3 | Markdown |
| 路由模型 | 文件路由 (Astro) | 文件路由 | App Router | 文件路由 | 配置文件 |
| 搜索 | **Pagefind 内置** | MiniSearch 内置 | Pagefind 内置 | Algolia | 内置 |
| 多版本文档 | 第三方 | 第三方 | 第三方 | **✅ 一等公民** | mike 插件 |
| 部署目标 | 任意（静态） | 任意 | Vercel / 任意 | 任意 | 任意 |
| 典型用户 | **Astro / Cloudflare** | Vue / Vite | SWR / Turborepo | React Native / Jest | FastAPI |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Starlight Showcase_](https://starlight.astro.build/resources/showcase/)

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 五大主流文档框架对比 ——

Starlight 的护城河是「Astro Islands + 0 KB 默认 JS + 多框架自由 import」：
- 跟 Nextra / Docusaurus 同样支持 MDX + 组件，但运行时开销几乎为零
- 跟 VitePress 同样追求极简，但能 import React/Vue/Svelte 组件（不锁单一 framework）
- 跟 Hugo 同样零 JS，但有完整现代 UI（响应式 / 暗黑模式 / 全文搜索）

选型逻辑：
- 极致性能 + 文档主题完备 ⇒ Starlight（推荐默认选）
- Vue 生态 + 团队倾向 Vite ⇒ VitePress
- Next.js 项目融合 / Vercel 部署 ⇒ Nextra
- 多版本文档 + 博客一体化 ⇒ Docusaurus
- Python 团队 + 纯文本工作流 ⇒ MkDocs
-->

---
transition: fade-out
---

# 知名用户：Astro 团队与 Cloudflare 押注

<v-click>

**Astro 自家与核心生态**

- Astro 官方文档（docs.astro.build）—— 用 Starlight 自举
- Starlight 文档站本身 —— 自家 dogfooding 最佳示例
- Astro Showcase / Astro Blog 也部分集成

**Cloudflare 生态（最大商业用户之一）**

- **Cloudflare Workers Docs**（部分章节）—— 边缘计算文档
- Wrangler CLI 文档 / Cloudflare Pages 部分页面

**主流开源项目**

- Bun（部分页面）/ Biome / Astro 周边社区项目
- Outerbase / Sentry 部分文档 / Triplit Docs

</v-click>

<div v-click>

> 💡 **观察**：Starlight 用户的共同特征 —— **极致性能要求**、**多 framework 内容嵌入需求**、**喜欢 Astro 生态**。Cloudflare 选 Starlight 是「企业级背书」的代表案例。

</div>

<div v-click text-xs text-right>

_Read more about_ [_Showcase_](https://starlight.astro.build/resources/showcase/)

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Starlight 的用户里最有分量的是 Cloudflare ——
Workers Docs / Wrangler 文档都用 Starlight，意味着「全球边缘计算文档背书」。
这跟 MDN 选 Eleventy 一样，是「大厂级别的生产验证」。

Astro 自家文档（docs.astro.build）也是 Starlight 构建 ——
团队自己用，意味着 bug fix 优先级最高、需求嗅觉最准。

[click] 共同特征：
- 极致性能（CDN 全球分发，零运行时 hydration 开销）
- 多框架内容嵌入（一篇文档里可能既有 React demo 又有 Vue demo）
- Astro 生态 / 喜欢「集成式架构」
对企业级文档站而言，Starlight 是 Nextra/Docusaurus 之外的另一个稳健选择。
-->

---
transition: fade-out
---

# 核心理念：Astro Islands + 零 JS 默认

Starlight 的精神图腾来自 Astro

<v-click>

**Astro Islands 是什么？**

- 默认所有组件都**编译成 HTML**，不向浏览器发送 JS
- 只有显式标记 `client:load` / `client:visible` 的组件才 hydrate
- 一个页面里可以同时有 React 岛、Vue 岛、Svelte 岛 —— 互不干扰
- 没有交互组件 = 没有运行时 JS = 0 KB 首屏

</v-click>

<div v-click>

```astro
---
import ReactCounter from '../components/Counter.jsx'
import VueChart from '../components/Chart.vue'
---

<h1>静态内容，零 JS</h1>

<!-- 仅这两个组件 hydrate，其他都是纯 HTML -->
<ReactCounter client:visible />
<VueChart client:idle />
```

</div>

<div v-click>

**Starlight 的体现**

- 文档站 90% 内容是静态文章 ⇒ 几乎零 JS
- 搜索 / 主题切换 / 折叠侧边栏 才是 hydrate 的少数岛
- Lighthouse Performance 默认 95~100 分

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Astro Islands 是 Astro 与所有现代框架最大的差异点 ——
React/Next.js 默认是「全页 hydrate」，所有组件都要 client runtime；
Astro 默认是「全页静态 HTML」，只有显式 client:* 才 hydrate。

[click] 代码示例展示「同一页面 + 多框架 + 零 JS 默认」——
ReactCounter 用 client:visible（进入视口才 hydrate），
VueChart 用 client:idle（浏览器空闲时 hydrate）。
其他静态内容（h1 / 文章）完全是 HTML，浏览器不下载任何 JS。

[click] Starlight 的实际收益：
- 文档站 90% 是静态文章（API 文档、教程、说明）
- 真正需要交互的就是搜索框（hydrate）、主题切换器（hydrate）、可折叠侧边栏（hydrate）
- 其他全部静态 → Lighthouse 几乎都是 100

这是为什么 Cloudflare / Astro 团队选它做大型文档站 —— 性能天花板很高。
-->

---
transition: fade-out
---

# 创建项目：零配置脚手架

Node.js 18+，一条命令拉起

<v-click>

**推荐：从官方模板创建**

```bash
# 用 Astro 脚手架 + starlight 模板
npm create astro@latest -- --template starlight

# 也可以用 pnpm / yarn
pnpm create astro@latest --template starlight
yarn create astro --template starlight
```

</v-click>

<div v-click>

**启动 / 构建 / 预览**

```bash
cd my-docs
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # 输出 dist/
pnpm preview      # 预览生产构建
```

</div>

<div v-click>

**手动安装（已有 Astro 项目）**

```bash
pnpm astro add starlight   # 自动改 astro.config + 装依赖
```

</div>

<div v-click>

> 💡 **零配置即用**：Astro CLI 的 `astro add` 子命令会自动注册集成、写入 `astro.config.mjs`、安装依赖 —— 比 Nextra 手动接入更省事。

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Starlight 的安装体验是几大文档框架里最丝滑的 ——
跟 Nextra 需要手动建 mdx-components.tsx / next.config.mjs / app/layout.tsx 不同，
Starlight 用 Astro 脚手架一条命令搞定全部初始化。

模板会附带：示例内容（intro / example-page）、astro.config.mjs、content/config.ts、
src/content/docs/ 目录、tsconfig.json 等所有必需文件。

[click] dev/build/preview 是 Astro 标准命令 ——
dev 启 4321 端口（注意不是 3000 / 8080），build 输出 dist/，preview 启静态服务器。

[click] 手动接入只要 `astro add starlight` 一行 ——
Astro CLI 会读取 astro.config，自动添加 integration + 装依赖。

[click] 这个体验意味着「新手 5 分钟跑起来一个完整文档站」。
比 Docusaurus 的 init 流程更轻，比 Nextra 4 的 App Router 改造更简单。
-->

---
transition: fade-out
---

# 项目结构

starlight 模板生成的标准目录

<v-click>

```text
my-docs/
├── astro.config.mjs            # ⚙️ Astro 配置（集成 starlight）
├── src/
│   ├── content.config.ts       # 📚 Content Collections 配置
│   ├── content/
│   │   └── docs/               # ⭐ 文档内容根目录
│   │       ├── index.mdx
│   │       ├── guides/
│   │       │   ├── installation.md
│   │       │   └── configuration.md
│   │       └── reference/
│   │           └── components.mdx
│   ├── components/             # 🧩 自定义 Astro/React/Vue 组件
│   ├── styles/                 # 🎨 自定义 CSS
│   │   └── custom.css
│   └── assets/                 # 📷 图片 / 字体
├── public/                     # 📦 静态资源（直接拷贝）
├── package.json
└── tsconfig.json
```

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Authoring Content_](https://starlight.astro.build/guides/authoring-content/)

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Starlight 的目录约定非常清晰：

关键三件套：
1. `astro.config.mjs` —— 集成入口，所有 Starlight 选项在这里配
2. `src/content.config.ts` —— Content Collections 类型 schema 注册
3. `src/content/docs/` —— ⭐ 所有文档 MD/MDX 文件根目录

`src/content/docs/` 是约定俗成的位置 ——
Starlight 默认从这里加载所有文档，不能改名（除非通过 srcDir 全局改 Astro 行为）。

其他目录都是 Astro 标准：
- src/components/ 自定义组件（任意 framework）
- src/styles/ 自定义 CSS（custom.css 是约定名）
- src/assets/ 图片资源（被 Astro 优化）
- public/ 不优化的静态资源（直接拷贝到 dist 根）

对比 Nextra：Nextra 4 用 content/，Starlight 用 src/content/docs/。
两者都是「文件路由」—— 文件名 → URL 路径自动映射。
-->

---
transition: fade-out
---

# 核心配置 astro.config.mjs

集成 starlight，所有特性从这里开关

<v-click>

```js {1-2|5-12|13-23|all}
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Docs',
      description: '一个 Starlight 文档站示例',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/x/y' },
        { icon: 'discord', label: 'Discord', href: 'https://astro.build/chat' },
      ],
      sidebar: [
        { label: '开始', link: '/intro/' },
        {
          label: '指南',
          items: ['guides/installation', 'guides/configuration'],
        },
        {
          label: '参考',
          autogenerate: { directory: 'reference' },
        },
      ],
    }),
  ],
})
```

</v-click>

<div v-click>

`starlight()` 是 Astro 集成工厂函数，接受配置对象 ⇒ 返回 Astro 集成对象，由 Astro 加载后注入文档站 UI + 路由 + 数据。

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三段看 astro.config.mjs：
1. import —— defineConfig 是 Astro 标准、starlight 是集成函数
2. starlight 集成配置 —— title / description / social / sidebar 是最基本的几个字段
3. sidebar 数组是核心 —— 控制左侧导航的层级结构

社交链接 social 用「图标数组」格式（0.36+ 新规）——
每个对象 `{ icon, label, href }`，图标名来自 Starlight 内置图标集。
旧版本（0.30 之前）是 object map 写法（已废弃）。

[click] sidebar 是 Starlight 最常配置的字段 ——
三种条目类型：
- 单链接：`{ label, link }`
- 分组手动列表：`{ label, items: [...] }`
- 分组自动生成：`{ label, autogenerate: { directory: 'reference' } }` —— 扫描目录自动展开

[click] starlight() 是个 Astro 集成 ——
Astro 集成系统类似 Vite 插件，可以注入路由、组件、中间件、构建钩子。
你也可以自己写集成，但 Starlight 已经把文档站需要的全部封装好了。
-->

---
transition: fade-out
---

# Content Collections：内容即数据

Astro 内置的内容管理系统 + Starlight 配套 schema

<v-click>

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content'
import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema(),
  }),
}
```

</v-click>

<div v-click>

**docsLoader / docsSchema 做什么？**

- **`docsLoader()`**：告诉 Astro 从 `src/content/docs/` 读 MD/MDX，自动建立文件 → 路由映射
- **`docsSchema()`**：Zod 类型 schema，校验 frontmatter（title / description / sidebar / hero / template ...）
- 写错字段 IDE 立即报红、build 阶段直接失败
- 0.36+ 推荐用 loader + schema 写法（旧版用 `type: 'content'`，已弃用）

</div>

<div v-click>

> 💡 **i18n 进阶**：同时注册 `i18n` collection（`i18nLoader()` + `i18nSchema()`）启用多语言文档。

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Content Collections 是 Astro 内置的内容管理系统 ——
把 markdown / MDX 当成「类型化数据」管理，不是当成「页面」直接渲染。
好处是：类型安全 / 数据查询 / 关系建立 / SEO 自动化全套。

Starlight 提供了两个配套 helper：
- `docsLoader()`：把 src/content/docs/ 下的所有 md/mdx 自动注册为可路由内容
- `docsSchema()`：内置 Zod schema 覆盖 Starlight 所有 frontmatter 字段

[click] 这个组合的好处：
- 写错 frontmatter 字段名 / 类型 → IDE / build 立刻报错
- 不写 docsSchema 等于失去类型保护，自定义字段也无法用 type-safe 方式访问

实际用法：把这个 content.config.ts 当模板抄，不需要改任何东西。

[click] i18n collection 是 0.36+ 引入的「翻译字符串集合」——
跟 docs collection 并列，专门管 UI 翻译（自定义的、不在 Starlight 内置翻译里的）。
对中英双语项目几乎是必需的。

注意：Astro 5 引入了 Content Layer API，docsLoader 是基于这个新 API 构建的，
比老式 Content Collections（`type: 'content'`）性能更好、扩展更灵活。
-->

---
transition: fade-out
---

# Sidebar 配置：autogenerate vs 手动

两种模式，按需混用

<v-click>

**手动模式（精细控制）**

```js
sidebar: [
  { label: '介绍', link: '/intro/' },
  { label: '快速开始', link: '/getting-started/', badge: 'New' },
  {
    label: '指南',
    items: [
      { label: '安装', link: '/guides/install/' },
      { label: '配置', link: '/guides/config/' },
      { label: '部署', link: '/guides/deploy/', badge: { text: 'beta', variant: 'caution' } },
    ],
  },
  {
    label: '外部链接',
    items: [
      { label: 'GitHub', link: 'https://github.com/x/y', attrs: { target: '_blank' } },
    ],
  },
]
```

</v-click>

<div v-click>

**自动生成模式（约定优先）**

```js
sidebar: [
  {
    label: 'Reference',
    autogenerate: { directory: 'reference' },     // 扫描 src/content/docs/reference/
  },
  {
    label: 'Plugins',
    autogenerate: { directory: 'plugins', collapsed: true },  // 默认折叠
  },
]
```

每个目录加 `_meta` frontmatter 或文件顺序前缀可控制次序。

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 手动模式优势：
- 完全控制顺序、显示名、外链
- 支持 badge（New / beta / deprecated 等标签）
- 支持 attrs（target="_blank" / rel="noopener"）
- 嵌套层级随意（实际 2 层够用，再深用户找不到）

badge 写法两种：
- 简写：`badge: 'New'` —— 默认样式
- 对象：`badge: { text: 'beta', variant: 'caution' }` —— note / tip / caution / danger / success 五种 variant

[click] 自动生成模式（autogenerate）：
- 适合「内容固定 + 大量页面」的场景，比如 API 参考、博客归档
- 扫描指定目录，按文件名 / frontmatter sidebar.order 排序
- collapsed: true 默认折叠该组，节省视觉空间

混合用法：顶层用手动（精细），叶子用 autogenerate（省心）。
大型文档站通常 70% 手动 + 30% autogenerate。

每个文档的 frontmatter 可以加 `sidebar: { order: 1, label: '别名', badge: '...' }`
精细覆盖该页面在 sidebar 中的显示。
-->

---
transition: fade-out
---

# 编写内容：MD + MDX + Astro

frontmatter 标准化 + 内容自由度极高

<v-click>

```md
---
title: Starlight 入门
description: 5 分钟搭建一个 Astro 文档站
sidebar:
  order: 1
  badge: New
hero:
  tagline: 文档站的优雅未来
  image:
    file: ../../assets/hero.png
  actions:
    - text: 开始
      link: /getting-started/
      icon: right-arrow
      variant: primary
---

import { Card, CardGrid } from '@astrojs/starlight/components';

# Starlight 入门

欢迎来到 Starlight 文档。

<CardGrid>
  <Card title="安装" icon="rocket">
    npm create astro@latest -- --template starlight
  </Card>
  <Card title="配置" icon="setting">
    在 astro.config.mjs 启用 starlight 集成
  </Card>
</CardGrid>
```

</v-click>

<div v-click>

> 💡 **frontmatter 类型保护**：所有字段都由 `docsSchema()` 校验，IDE 提示 + build 期报错。

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Starlight 的 MDX 写法分三部分：

1. frontmatter —— 受 docsSchema 严格校验
   - title / description：必填，用于 SEO + 页面 H1
   - sidebar.order / sidebar.label / sidebar.badge：单页精细控制
   - hero：仅首页 / 落地页用，触发 hero 布局
   - template: 'splash' / 'doc'：切换页面模板

2. import 区域 —— 从 @astrojs/starlight/components 引内置组件

3. 正文 —— Markdown 标准语法 + 内置组件 JSX 标签

[click] frontmatter 类型保护是 Starlight 一大亮点 ——
docsSchema() 用 Zod 严格校验，写错字段名 / 类型立刻 build 失败。
比 VitePress / Nextra 的「松散 frontmatter」靠谱很多。

hero 字段是「落地页专用」—— 触发首页大图 + tagline + 行动按钮的布局。
普通文档页不写 hero，正文走默认的「doc」模板。
-->

---
transition: fade-out
---

# 内置组件：Card / CardGrid / Tabs / Steps

文档站常用 UI 全套，零导入烦恼

<v-click>

```mdx
import { Card, CardGrid, Tabs, TabItem, Steps } from '@astrojs/starlight/components';

<CardGrid stagger>
  <Card title="快速开始" icon="rocket">
    一行命令拉起项目
  </Card>
  <Card title="完整配置" icon="setting">
    所有选项参考
  </Card>
</CardGrid>

<Tabs>
  <TabItem label="pnpm">pnpm add astro</TabItem>
  <TabItem label="npm">npm install astro</TabItem>
  <TabItem label="yarn">yarn add astro</TabItem>
</Tabs>

<Steps>
1. 安装依赖：pnpm install
2. 启动 dev：pnpm dev
3. 打开浏览器：http://localhost:4321
</Steps>
```

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Components_](https://starlight.astro.build/components/using-components/)

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Starlight 提供的 11+ 内置组件全部从 `@astrojs/starlight/components` 导入：

最常用的 4 个：
- Card：卡片（icon + title + body）
- CardGrid：网格容器（stagger 让奇偶行错开）
- Tabs / TabItem：多 tab 内容（包管理器选择经典场景）
- Steps：分步流程（自动编号）

Card 的 icon 接 Starlight 内置图标集（>100 个）—— rocket / setting / open-book / star / pencil 等。

[click] 注意：这些组件都是 Astro 组件（编译期渲染）——
不像 Nextra 的 React 组件，不会在浏览器执行 JS。
所以即使你的页面有几十个 Card，首屏 JS 仍然是 0 KB。

Tabs 有运行时交互（点击切换），但只有「点了之后」才 hydrate，
默认渲染就是「显示第一个 tab 的 HTML」+ 极小的 JS 切换逻辑（<2KB）。
-->

---
transition: fade-out
---

# 内置组件：Aside / FileTree / LinkCard / Icon

警告框、目录树、跳转卡片、图标系统

<v-click>

```mdx
import { Aside, FileTree, LinkCard, LinkButton, Icon } from '@astrojs/starlight/components';

<Aside type="note">普通提示</Aside>
<Aside type="tip" title="建议">这是建议</Aside>
<Aside type="caution">谨慎操作</Aside>
<Aside type="danger">危险</Aside>

<FileTree>
- src/
  - content/
    - docs/
      - index.mdx
      - guides/
        - intro.md
  - components/
- astro.config.mjs
</FileTree>

<LinkCard
  title="深入 Starlight"
  description="完整参考文档"
  href="/reference/configuration/"
/>

<LinkButton href="/getting-started/" variant="primary" icon="right-arrow">
  开始
</LinkButton>

<Icon name="star" color="goldenrod" size="2rem" />
```

</v-click>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 第二批组件覆盖文档站常见 UI：

- Aside：4 种 type（note / tip / caution / danger）—— 类似 VitePress 的 `::: info`
- FileTree：用 Markdown 列表语法描述目录结构，自动渲染为可视化树（比 Nextra 的嵌套 JSX 写法更简洁）
- LinkCard：跳转卡片（title + description + href），常用于「下一步建议」
- LinkButton：跳转按钮（primary / secondary / minimal 三种 variant + icon）
- Icon：图标渲染（name + color + size + class），Starlight 内置图标集

注意：Aside 的 type 是字符串，不是组件类型。
custom title 可选 —— 不写时显示默认翻译（中文「注意」/「提示」/「警告」/「危险」）。

[click] FileTree 用 Markdown 列表语法是设计精髓 ——
不像 Nextra 用嵌套 `<FileTree.Folder>` JSX 写法繁琐，
Starlight 直接复用 Markdown unordered list，写起来跟普通笔记一样。
带 `/` 后缀视为文件夹，无 `/` 视为文件。
-->

---
transition: fade-out
---

# Expressive Code：代码高亮神器

Astro 团队开发的代码块增强引擎

<v-click>

````md
```js title="astro.config.mjs" {3-5} ins={6} del={7} showLineNumbers
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  integrations: [
    starlight({ title: '我的文档' }),
  ],
  // 这一行将被标记为删除
})
```
````

</v-click>

<div v-click>

**支持的元数据**

- `title="..."` —— 代码块顶部标题（文件名）
- `{3-5}` —— 高亮行范围
- `ins={6}` / `del={7}` —— 标记新增 / 删除（diff 视图）
- `showLineNumbers` / `hideLineNumbers` —— 行号控制
- `frame="terminal"` / `frame="code"` / `frame="none"` —— 边框样式
- `'pattern'` —— 高亮匹配字符串
- `collapse={2-5}` —— 折叠某段（点击展开）

</div>

<div v-click>

> 💡 **不需要配置**：Expressive Code 跟 Starlight 默认集成，所有上面的语法直接可用，不需要额外装包。

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Expressive Code 是 Astro 团队的开源代码块增强引擎 ——
基于 Shiki（VS Code 同款语法高亮），加上行号、diff、标题、折叠、文本标记等丰富特性。
跟 Starlight 默认集成，写代码块时直接用 fence 元数据。

[click] 元数据写在反引号语言后空格分隔，类似 HTML 属性：
- title：代码块顶部显示文件名
- {3-5} / {3,5,7-9}：高亮特定行
- ins / del：diff 视图（绿色加 / 红色删）
- showLineNumbers / hideLineNumbers：行号显隐
- frame：边框样式（自动检测 bash → terminal，其他 → code）
- collapse={2-5}：折叠中间行，鼠标点击展开 —— 长配置文件神器

[click] 跟其他 SSG 对比：
- VitePress / Nextra 用 Shiki，但只有最基础的高亮 + 复制
- Starlight 用 Expressive Code，是 Shiki 的「增强版」，
  diff / 行号 / 折叠 / 标题这套现成的工具链是 VitePress 没有的
- 类似 Docusaurus 的 magic-comments，但比 magic-comments 更标准化（不需要在代码里嵌注释）
-->

---
transition: fade-out
---

# Pagefind：零配置全文搜索

Starlight 自带，构建期生成索引

<v-click>

**默认启用，无需配置**

```js
// astro.config.mjs
starlight({
  title: 'My Docs',
  // 搜索默认开启，使用 Pagefind
  pagefind: true,  // 默认值，可省略
})
```

</v-click>

<div v-click>

**工作机制**

1. `astro build` 完成后，Starlight 自动调用 Pagefind 扫描 `dist/` HTML
2. 生成 `dist/pagefind/` 目录（含索引切片 + 客户端 JS）
3. Starlight 顶部搜索框（Cmd/Ctrl + K）自动调用 Pagefind 提供 UI

</div>

<div v-click>

**特点**

- 完全本地化 / 零成本 / 零外部依赖
- 多语言内置（按 locale 自动分词）
- 索引按需懒加载（搜什么加载什么切片）
- 中等大小站（200 页）典型索引 ~50 KB

</div>

<div v-click>

> 💡 **企业级替代**：自部署的 [Algolia DocSearch](https://docsearch.algolia.com/) 对开源项目免费，可用 `pagefind: false` 关闭后接入 `algolia` 字段配置。

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Pagefind 是 CloudCannon 团队的开源静态搜索引擎 ——
跟 Nextra 用的是同一个，但 Starlight 把集成做得更深：
不需要单独装 Pagefind 包、不需要在 build script 后跟命令，
Starlight 在 build hook 里自动跑 pagefind。

[click] 工作机制三步：
1. astro build 完成后，Starlight 在 astro:build:done 钩子里调用 pagefind CLI
2. pagefind 扫描 dist/ 里的 HTML，提取文本生成索引切片
3. Starlight 内置的搜索框组件运行时加载 _pagefind/，提供 UI

[click] Pagefind 的核心优势：
- 完全静态（构建期生成索引，运行时无需服务器）
- 零成本（CDN 托管，免费方案够用）
- 多语言（自动分词）
- 按需切片（不像 MiniSearch 一次加载完整索引）

中等大小站（200 页）索引约 50 KB，对比 VitePress MiniSearch 同等内容
通常要 200+ KB —— Pagefind 在大站场景显著省带宽。

[click] Algolia DocSearch 适合：
- 跨语言搜索体验诉求强（中英文混合搜索 Algolia 更准）
- 想要查询分析（DocSearch dashboard 提供搜索词热度）
- 不在乎外部依赖
开源项目 DocSearch 免费但要申请 + 走它的审核流程。
-->

---
transition: fade-out
---

# i18n：内置多语言完整方案

配置驱动，无需手写中间件

<v-click>

**Step 1：astro.config.mjs 声明 locale**

```js
starlight({
  defaultLocale: 'zh-cn',
  locales: {
    'zh-cn': { label: '简体中文', lang: 'zh-CN' },
    'en': { label: 'English', lang: 'en' },
    'ar': { label: 'العربية', lang: 'ar', dir: 'rtl' },
  },
})
```

</v-click>

<div v-click>

**Step 2：按 locale 拆 content 目录**

```text
src/content/docs/
├── zh-cn/
│   ├── intro.md
│   └── guides/install.md
├── en/
│   ├── intro.md
│   └── guides/install.md
└── ar/
    └── intro.md
```

URL：`zh-cn` → `/zh-cn/intro/`，`en` → `/en/intro/`

</div>

<div v-click>

**Step 3（可选）：i18n collection 覆盖 UI 翻译**

```ts
// src/content.config.ts
import { i18nLoader } from '@astrojs/starlight/loaders'
import { i18nSchema } from '@astrojs/starlight/schema'

i18n: defineCollection({
  loader: i18nLoader(),
  schema: i18nSchema(),
})
```

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Starlight 的 i18n 是「声明式」—— 不需要写中间件、不需要写路由逻辑，
config 里声明 locales + defaultLocale，Starlight 自动接管：
- Navbar 右上出现语言切换下拉
- URL 自动加 locale 前缀（如 /zh-cn/intro/）
- 每篇文档自动识别所属 locale
- 缺失翻译自动 fallback 到 defaultLocale

每个 locale 字段：
- label：下拉中显示的名字
- lang：HTML lang 属性值（影响 SEO / 屏幕阅读器）
- dir：'ltr'（默认） / 'rtl'（阿拉伯语 / 希伯来语）

[click] 内容目录按 locale 拆子目录是约定 ——
src/content/docs/<locale>/<route>.md
路径结构必须保持对称（否则 Starlight 会警告「missing translation」）。

[click] i18n collection 用来「覆盖 UI 翻译」——
Starlight 自带英文 / 法文 / 西班牙文 / 中文等几十种 UI 翻译（搜索 / 上一页 / 暗黑模式等按钮的文字）。
如果想自定义某段翻译（比如把「Search」改成「查询」），
就用 i18n collection 写覆盖文件。

对比 Nextra：Nextra 静态导出时 middleware 失效，无法自动 locale 检测。
Starlight 完全声明式，所有路由都在 build 期生成，部署到任何静态主机都正常。
-->

---
transition: fade-out
---

# Theme 定制：CSS 变量 + 自定义组件

三层定制路线

<v-click>

**Level 1：CSS 变量（最轻量）**

```css
/* src/styles/custom.css */
:root {
  --sl-color-accent-low: #c0a3ff;
  --sl-color-accent: #6b46e5;
  --sl-color-accent-high: #2a0a99;
}

:root[data-theme='dark'] {
  --sl-color-accent: #a78bfa;
}
```

```js
// astro.config.mjs
starlight({
  customCss: ['./src/styles/custom.css'],
})
```

</v-click>

<div v-click>

**Level 2：自定义 Logo / Social / Footer**

```js
starlight({
  logo: { src: './src/assets/logo.svg', replacesTitle: true },
  social: [{ icon: 'github', label: 'GitHub', href: '...' }],
  components: {
    Footer: './src/components/CustomFooter.astro',
    Head: './src/components/CustomHead.astro',
  },
})
```

</div>

<div v-click>

**Level 3：组件 Overrides（重定制）**

通过 `components` 字段覆盖 Starlight 内部任意组件（Hero / Sidebar / PageTitle ...）—— 类似 Docusaurus swizzle。

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Starlight 的定制路线分三级：

Level 1 —— CSS 变量（推荐起点）
- Starlight 暴露 `--sl-color-accent-*` / `--sl-color-bg-*` / `--sl-text-*` 等设计 token
- 在 customCss 配置的文件里覆盖即可，明暗主题用 `[data-theme='dark']` 区分
- 改一处全站生效，是 80% 项目的最佳选择

Level 2 —— Logo / Social / 局部组件覆盖
- logo.replacesTitle：用 logo 替代文字标题
- components 字段：覆盖 Starlight 内部部分槽位组件
  常见覆盖：Footer（添加版权、链接）、Head（添加 GA、字体）

[click] Level 3 —— 组件 Overrides 是 Starlight 的「类 swizzle」机制：
- 几乎所有内置组件都可以被覆盖（Hero / Sidebar / PageTitle / TableOfContents / 等）
- 用 Astro 组件覆盖，可以 import 原组件做 wrap
- 比 Nextra 的「只能切 Custom Theme」灵活很多

但 Level 3 失去 Starlight 升级时的 UI 跟随能力 —— 谨慎使用。
官方推荐：先 Level 1 + 2，真不够再 Level 3。
-->

---
transition: fade-out
---

# Plugins 生态：扩展 Starlight 能力

社区已经积累了几十个插件

<v-click>

**热门官方 / 社区插件**

- **starlight-blog**：在文档站上嵌入博客模块（列表 / 标签 / RSS）
- **starlight-openapi**：从 OpenAPI spec 自动生成 API 参考页
- **starlight-image-zoom**：点击图片放大 lightbox
- **starlight-links-validator**：build 期校验内部链接，断链自动报错
- **starlight-sidebar-topics**：sidebar 顶部多 topic 切换
- **starlight-versions**：多版本文档（v1 / v2 / v3 切换）
- **starlight-typedoc**：从 TypeScript 类型自动生成参考文档
- **starlight-llms-txt**：自动生成 `/llms.txt` 给 LLM 抓取

</v-click>

<div v-click>

**插件接入示例**

```js
import starlight from '@astrojs/starlight'
import starlightBlog from 'starlight-blog'

starlight({
  plugins: [starlightBlog({ authors: { zhangxu: { name: 'Hillary', title: 'Engineer' } } })],
})
```

</div>

<div v-click text-xs text-right>

_Read more about_ [_Plugins & Integrations_](https://starlight.astro.build/resources/plugins/)

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Starlight Plugins 是 v0.16+ 引入的扩展机制 ——
让第三方插件能 hook 进配置、注入路由、改写 sidebar、覆盖组件。
社区已经积累了几十个高质量插件，覆盖了大部分文档站常见需求。

最值得知道的 5 个：
- **starlight-blog**：把博客功能加到文档站（很多文档站都有 blog 模块需求）
- **starlight-openapi**：从 OpenAPI YAML 自动生成 API 参考（节省几百小时手写）
- **starlight-links-validator**：build 期校验所有内部链接，断链自动失败 —— 大型文档站救命插件
- **starlight-versions**：实现多版本切换（Docusaurus 一等公民功能，Starlight 走插件路线）
- **starlight-typedoc**：TS 项目从类型定义自动生成文档

[click] 插件接入超简洁 —— 跟集成集成模式一样，
通过 `plugins: [...]` 字段配置，每个插件返回的对象会被 Starlight 合并到自身配置里。

[click] 完整插件列表在 starlight.astro.build/resources/plugins/，
持续更新，可以按需挑选。
绝大多数插件是 Astro / Starlight 团队成员或核心贡献者维护，质量较高。
-->

---
transition: fade-out
---

# 部署：Vercel / Netlify / Cloudflare Pages

Astro 静态产物 ⇒ 任意 CDN

<v-click>

**1. Vercel（推荐，零配置）**

```bash
pnpm dlx vercel deploy
# 或 GitHub repo 接入 Vercel Dashboard → 自动 PR 预览 + main 生产
```

Vercel 直接识别 Astro 项目（`astro build` → `dist/`），无需写 vercel.json。

</v-click>

<div v-click>

**2. Netlify**

```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = "dist"
```

</div>

<div v-click>

**3. Cloudflare Pages（推荐免费方案）**

```text
Build command: pnpm build
Build output directory: dist
```

Cloudflare 免费额度大方（500 build / month + 全球 CDN），适合中大型文档站。

</div>

<div v-click>

**4. GitHub Pages**

```yaml
# .github/workflows/deploy.yml
- uses: withastro/action@v3   # 官方 Action
```

需要在 `astro.config.mjs` 配 `site` + `base: '/repo-name/'`。

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vercel 路线最简单 ——
Astro 是 Vercel 一等公民（Vercel 文档明确支持），自动识别 dist/ 输出。
适合个人 / 小团队，免费额度对文档站够用。

[click] Netlify ——
Astro 跟 Netlify 关系也非常好（Astro 创始人之一 Fred K. Schott 曾在 Netlify），
集成度高 + 免费额度大。netlify.toml 两行配置就行。

[click] Cloudflare Pages 是「免费 + 性能」最优解 ——
- 全球 200+ 节点 CDN，国内访问也较快
- 免费额度 500 build/month + 无限带宽
- 跟 Cloudflare Workers / Functions 无缝集成（动态需求时可加）

适合中大型公开文档站。

[click] GitHub Pages 用官方 Action（withastro/action）——
比手写 npm install + build + deploy steps 简洁。
注意 base 配置 —— repo 子路径部署（user.github.io/repo）必须设 base，
否则资源 404。
-->

---
transition: fade-out
---

# vs Nextra：Astro 阵营 vs Next.js 阵营

两种路线，两种哲学

<v-click>

| 维度 | Starlight | Nextra 4 |
| --- | --- | --- |
| 底层 | Astro Islands | Next.js 15 + RSC |
| 默认 JS | **0 KB** | 80-200 KB |
| 多 framework | **✅ 任意 import** | 仅 React |
| 集成方式 | Astro Integration | Next.js HOC + Theme |
| 多版本 | 插件 (starlight-versions) | 第三方 |
| 学习曲线 | 低（Astro 直观） | 中（Next.js 全栈） |
| 适合 | 纯文档 / Web 性能党 | Next.js 项目融合 |

</v-click>

<div v-click>

**典型场景对比**

- **要文档 + 主站融合（如 SaaS）** ⇒ Nextra（同栈复用）
- **纯文档 + 极致性能** ⇒ Starlight（首屏 0 JS 天花板）
- **要 React Server Components / Server Actions** ⇒ Nextra
- **要 i18n / 多版本 + 静态部署** ⇒ Starlight（i18n 内置无中间件依赖）
- **团队已有 Astro 项目** ⇒ Starlight（共享 astro.config / 组件）

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Starlight vs Nextra 是文档站选型最常见的二选一 ——
两者都支持 MDX、都内置主题 + 搜索 + i18n，但底层运行时完全不同。

关键差异：
- **首屏 JS**：Starlight 是 0 KB（Astro Islands），Nextra 是 80-200 KB（React + Next runtime）
- **多 framework**：Starlight 能同页混 React/Vue/Svelte/Solid 岛，Nextra 只能 React
- **集成模式**：Starlight 是 Astro integration（plug-in），Nextra 是 Next.js + Theme 组合

[click] 选型决策：

- 文档 + 主站融合 → Nextra 占优（如果主站本身是 Next.js）
- 纯文档 + 性能极致 → Starlight 占优（首屏 0 JS）
- 要 RSC / Server Actions → 必须 Nextra（Starlight 不支持，因为 Astro 不是 React-server-side）
- 静态部署 + i18n → Starlight 占优（无 middleware 依赖）
- 团队已用 Astro → Starlight（共用集成 + 配置 + 组件）

没有绝对优劣，要看团队栈和项目类型。
-->

---
transition: fade-out
---

# vs VitePress / Docusaurus

另两个常见对手

<v-click>

**vs VitePress**

- VitePress = Vue 3 + Vite，**Vue 单一 framework**
- Starlight 能 import React/Vue/Svelte/Solid 岛 —— framework 自由
- VitePress 构建更快（纯 Vite），但功能比 Starlight 少（无 hero / 无内置组件库 / 无 i18n 配置）
- **决策**：纯 Vue 团队 + 极简 → VitePress；多 framework 内容 + 完整 UI → Starlight

</v-click>

<div v-click>

**vs Docusaurus**

- Docusaurus = Meta 出品 React-based，**多版本 + 博客 + i18n** 都是一等公民
- Starlight 多版本走插件路线，博客走 starlight-blog
- Docusaurus 首屏 ~150 KB JS（React），Starlight ~0 KB
- **决策**：要多版本 + 博客一体化 → Docusaurus；要极致性能 + Astro 生态 → Starlight

</div>

<div v-click>

**vs MkDocs Material**

- MkDocs = Python + Jinja，**纯 Markdown + YAML 配置**
- Starlight 用 JS / TS 配置 + MDX 内容，扩展性远超 MkDocs
- MkDocs Material 主题美但只能 Markdown，Starlight 能 MDX + 组件
- **决策**：Python 团队 + 纯文档 → MkDocs；想要现代组件 + JS 生态 → Starlight

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] vs VitePress —— 都追求极简、都极快 ——
但 Starlight 的优势在「framework 自由 + 完整 UI 库」：
- VitePress 只能用 Vue 组件，深入定制时 React 党劝退
- VitePress 的内置组件少（没有 Card / Tabs / Steps / Aside 等开箱组件，全靠 Markdown extension）
- Starlight 自带完整文档站 UI，开箱即用
代价：Starlight 构建稍慢（Astro vs 纯 Vite），但对中等规模项目可忽略。

[click] vs Docusaurus —— 都 React-based 但路线完全不同 ——
- Docusaurus 是「文档站全套工具箱」—— 多版本 / 博客 / 翻译都一等公民，但首屏 JS 重
- Starlight 是「极简核心 + 插件扩展」—— 多版本 / 博客都走插件，但首屏 0 JS

大型文档站 + 复杂业务需求 → Docusaurus 仍是稳健选择；
追求性能 + 轻量 → Starlight。

[click] vs MkDocs Material —— 都是文档社区耳熟能详 ——
但生态完全不同：MkDocs 在 Python 圈（FastAPI / Pydantic / SQLAlchemy 都用 MkDocs Material），
Starlight 在 JS 圈。
Python 团队继续用 MkDocs Material 完全没问题；
JS 团队想要类似体验，Starlight 是 MkDocs Material 的 JS 平替。
-->

---
transition: fade-out
---

# 常见踩坑

社区常见 issue 总结

<v-click>

- **路由 base 配置漏掉**：部署到 GitHub Pages `user.github.io/repo` 时未配 `base: '/repo/'`，资源 404
- **content.config.ts 用旧语法**：从 0.30 之前升级时仍用 `type: 'content'`，0.36+ 必须用 docsLoader + docsSchema
- **frontmatter 字段写错**：Zod 严格校验，title 必填，sidebar.order 必须是数字（不是字符串）
- **autogenerate 顺序不对**：默认按文件名字母序，要用 `sidebar.order: 1` 在 frontmatter 中覆盖
- **i18n 缺翻译报警**：每个 locale 目录结构必须对称，缺失文件 Starlight 警告（可改 fallback 策略）
- **customCss 顺序**：customCss 数组里的 CSS 按声明顺序加载，覆盖 Starlight 默认要写在末尾
- **Pagefind 索引不更新**：本地 dev 模式不跑 Pagefind，只有 build 才生成索引（测搜索必须 build + preview）
- **组件 client:* 滥用**：Astro 默认 0 JS 是核心卖点，乱加 client:load 会破坏性能优势
- **navbar 配置不直接**：Starlight 没有 navbar 字段，导航靠 sidebar 顶层 + social
- **Astro 5 升级**：升级到 Astro 5 + Starlight 0.30+ 时 Content Collections 大改，注意 migration 指南

</v-click>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
10 条社区踩坑，按出现频率排序：

- GitHub Pages base 漏配 —— 子路径部署最常见的资源 404 原因
- content.config.ts 旧语法 —— Astro 5 + Starlight 0.36 Content Layer API 切换
- frontmatter 字段写错 —— Zod 校验严格，IDE 提示能挡 90% 但偶尔漏（特别是从 nextra/vitepress 项目搬来的 frontmatter）
- autogenerate 顺序 —— 新人不知道 sidebar.order 这个 frontmatter 字段
- i18n 缺翻译警告 —— 大项目多语言文件不同步时刷屏，可在配置里关掉警告或写 fallback
- customCss 顺序 —— 自定义样式不生效时通常是被 Starlight 默认覆盖了
- Pagefind 索引调试 —— 很多人在 dev 模式找搜索功能找不到，要切 build + preview
- client:* 滥用 —— Astro 性能优势在「默认不 hydrate」，加 client:load 等于破坏 islands 模型
- navbar 期待落空 —— Starlight 0.x 暂时没有完整 navbar 配置（只能靠 sidebar 顶层 + social + 自定义 Header 组件）
- Astro 5 升级 —— 用 starlight-versions 等插件的项目升级 Astro 5 时要看 migration 指南，Content Collections 改动大
-->

---
transition: fade-out
---

# 经验法则

来自 Astro 团队 + 大型用户实践

<v-click>

- **TypeScript 必选** —— content.config.ts + frontmatter 全程类型保护
- **从官方模板起步** —— `npm create astro@latest -- --template starlight` 省 90% 踩坑
- **基于 docsSchema 扩展** —— 自定义 frontmatter 字段用 `docsSchema({ extend: ... })`，保留内置校验
- **优先用 autogenerate** —— sidebar 配置中 80% 的目录用 autogenerate 就行，省维护
- **frontmatter title/description 必填** —— SEO + sidebar 标签都依赖
- **Pagefind 默认够用** —— 中小项目（<500 页）不用切 Algolia
- **CSS 变量优先** —— 90% 视觉定制用 `--sl-color-*` 变量，不要轻易 override 组件
- **慎用 client:load** —— 默认 0 JS 是 Starlight 性能根基，需要才 hydrate
- **i18n 提早规划** —— 后期补 i18n 比一开始就规划文件结构成本高很多
- **starlight-links-validator 必装** —— 大型项目断链是 SEO + UX 杀手，build 期挡住

</v-click>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
10 条经验法则，来自 Astro 团队 + 大型用户（Cloudflare / Astro Docs 团队）：

- TypeScript：content.config.ts 提供完整类型推断，比 JS 模板省 5× 排错时间
- 官方模板：模板永远跟最新 release 同步，自己拼经常落后
- docsSchema extend：要加自定义 frontmatter 字段时用 extend 保留内置校验，避免重写整个 schema
- autogenerate：大项目维护 manually 列出每个文件几乎不可能，autogenerate 是默认选择
- frontmatter SEO：自动化的代价是必须填字段，title/description 不能省
- Pagefind 优先：免费 + 零依赖 + 增量不破坏 build，先用 Pagefind，真不够再切 Algolia
- CSS 变量：Starlight 的设计 token 体系完整，90% 定制只需要改 4-5 个变量
- client:* 谨慎：Astro 的性能根基是 Islands，乱加 client:* 等于自废武功
- i18n 早规划：等内容堆起来再加 i18n，所有路径都要改 / 翻译要补全，成本指数上升
- links-validator：build 期挡断链比上线后用户报错好太多，开发体验救命插件
-->

---
transition: fade-out
---

# 下一步学习路径

按场景挑章节

<v-click>

**入门 → 进阶**

- [Getting Started](https://starlight.astro.build/getting-started/) —— 官方手把手
- [Authoring Content](https://starlight.astro.build/guides/authoring-content/) —— frontmatter + MDX 完整能力
- [Sidebar Configuration](https://starlight.astro.build/reference/configuration/#sidebar) —— sidebar 字段全表
- [Components Overview](https://starlight.astro.build/components/using-components/) —— 11+ 内置组件

</v-click>

<div v-click>

**专题深入**

- [Site Search](https://starlight.astro.build/guides/site-search/) —— Pagefind / Algolia 配置
- [Internationalization (i18n)](https://starlight.astro.build/guides/i18n/) —— 多语言完整流程
- [CSS & Styling](https://starlight.astro.build/guides/css-and-tailwind/) —— Tailwind 集成 + 变量定制
- [Overriding Components](https://starlight.astro.build/guides/overriding-components/) —— 重定制路线
- [Plugins](https://starlight.astro.build/resources/plugins/) —— 完整插件列表

</div>

<div v-click>

**社区资源**

- [Showcase](https://starlight.astro.build/resources/showcase/) —— Cloudflare / Astro Docs 真实案例
- [Astro Discord](https://astro.build/chat) —— 官方答疑，#starlight 频道
- [Starlight GitHub](https://github.com/withastro/starlight) —— issues + discussions

</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 入门 4 篇必读：
- Getting Started：把项目跑起来
- Authoring Content：理解 frontmatter + MDX
- Sidebar Configuration：sidebar 几种用法吃透
- Components Overview：拿到所有「免费组件」

[click] 专题按需深入：
- Site Search：Pagefind 还是 Algolia
- i18n：多语言文档完整流程
- CSS & Styling：Tailwind 集成（Starlight 提供 @astrojs/starlight-tailwind 包）
- Overriding Components：终极定制
- Plugins：完整列表，至少看一遍知道有哪些选择

[click] 社区资源：
- Showcase：看 Cloudflare Workers Docs / Astro Docs 等真实生产案例
- Astro Discord：#starlight 频道，Astro 核心团队成员长期在线答疑
- Starlight GitHub：issues 跟踪 + 路线图
-->

---
layout: intro
transition: fade-out
---

# 总结

Starlight 把「Astro Islands + 文档主题」融为一体

- **Astro Integration** ⇒ 跑在 Astro 之上，零默认 JS，性能天花板
- **多 framework Island** ⇒ React / Vue / Svelte / Solid 任意 import
- **Pagefind 内置 + i18n + Expressive Code** ⇒ 零配置开箱即用
- **CSS 变量 + 组件 Overrides** ⇒ 三层定制路线满足各种需求
- **Astro 团队主推** ⇒ Astro Docs / Cloudflare Workers Docs 等明星项目验证

<div class="abs-br m-6 text-xl">
  <a href="https://starlight.astro.build" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
  <a href="https://github.com/withastro/starlight" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/frontend-framework/ssg/starlight/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #6B46E5;
  background-image: linear-gradient(45deg, #6B46E5 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结 Starlight 在 SSG 生态的位置：

- 它不是「最快构建」—— Astro 比纯 Vite 稍慢
- 它不是「最功能丰富」—— Docusaurus 多版本 / 博客一等公民
- 但它是「最 Astro 原生 + 最零 JS」的文档主题

如果你的项目：
- 追求极致性能（Lighthouse 100 / 首屏 0 JS）
- 需要多 framework 混合内容
- 已经在 Astro 生态 / 想用 Astro 做主站
- 喜欢「配置驱动 + 集成式架构」

Starlight 是 SSG 选型矩阵里非常稳的一个选择。
由 Astro 核心团队（Sarah Rainsberger 等）维护，
Cloudflare / Astro Docs 等大厂用 —— 长期可下注。
-->

---
layout: end
---

# Thanks

Starlight: <https://starlight.astro.build>

GitHub: <https://github.com/withastro/starlight>
