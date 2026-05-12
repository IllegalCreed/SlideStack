---
theme: seriph
background: https://cover.sli.dev
title: Welcome to VitePress
info: |
  Presentation VitePress for developers.

  Learn more at [https://vitepress.dev/](https://vitepress.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center text-9xl">
  📘
</div>

<br/>

## VitePress：Vite 驱动的开发者文档框架

VuePress 1 的精神继任者，由 Vue 团队维护（基于 v1.6.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天讲 VitePress —— Vue 团队维护的开发者文档框架。
它是 VuePress 1 的"精神继任者"：完全重写、Vite 驱动、Markdown 中可嵌 Vue。
-->

---
transition: fade-out
---

# 什么是 VitePress？

为开发者文档场景设计的静态站点生成器

<v-click>

- **Vite 驱动**：dev server 秒开，HMR 流畅
- **Markdown 为内容主体**：可嵌入 Vue 3 组件
- **基于文件系统的路由**：md 文件即路由
- **默认主题开箱即用**：导航 / 侧边栏 / 大纲 / 搜索 / i18n
- **SSR + SPA 混合**：构建期预渲染，运行期接管为 SPA
- **内置 Shiki**：代码高亮 + 行高亮 + diff / focus 标记

</v-click>

<br>

<div v-click>

```bash
pnpm add -D vitepress       # 仅装 VitePress（已自带 Vue 3）
pnpm dlx vitepress init      # setup wizard
```

</div>

<div v-click text-xs>

_Read more about_ [_What is VitePress?_](https://vitepress.dev/guide/what-is-vitepress)

</div>

<style>
h1 {
  background-color: #41b883;
  background-image: linear-gradient(45deg, #41b883 10%, #34495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] VitePress 卖点：所有功能都为开发者文档量身定做。
默认主题就能直接用，不必为了 nav / sidebar 自己写组件。

[click] 安装只需一个包——vue 不用单独装，VitePress 已内置 Vue 3。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 安装与默认结构

Node 20+，setup wizard 一条命令搞定

::left::

<v-click>

**前置 + 安装**

```bash
# Node.js v20+ 必须
pnpm add -D vitepress
pnpm dlx vitepress init
```

**启动 / 构建 / 预览**

```bash
pnpm docs:dev         # http://localhost:5173
pnpm docs:build
pnpm docs:preview     # http://localhost:4173
```

</v-click>

::right::

<v-click>

**默认目录结构**

```text
.
├─ docs                    # 站点根
│  ├─ .vitepress
│  │  └─ config.{js,ts,mjs,mts}
│  ├─ index.md
│  └─ getting-started.md
└─ package.json
```

配置文件 4 种扩展名都行；VitePress 是 **ESM-only**。

</v-click>

<style>
h1 {
  background-color: #41b883;
  background-image: linear-gradient(45deg, #41b883 10%, #34495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Node 必须 20+。setup wizard 默认生成的站点根是 docs/，里面才是 .vitepress/。

[click] 配置文件 4 种扩展名都行，但记住 ESM-only：用 .js 要么加 type:module，要么干脆用 .mjs。
-->

---
transition: fade-out
---

# 配置文件：`.vitepress/config.ts`

站点级 + 主题级 配置都在这一份

<v-click>

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/my-docs/',           // 部署子路径
  title: 'My Docs',
  cleanUrls: true,             // 隐藏 .html 后缀
  lastUpdated: true,
  themeConfig: {
    nav: [{ text: 'Guide', link: '/guide/' }],
    socialLinks: [{ icon: 'github', link: '...' }],
    search: { provider: 'local' },   // 内置全文搜索
  },
})
```

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Site Config_](https://vitepress.dev/reference/site-config)

</div>

<style>
h1 {
  background-color: #41b883;
  background-image: linear-gradient(45deg, #41b883 10%, #34495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 站点根配置和默认主题配置都写在同一份文件。
cleanUrls 把 /guide.html 改成 /guide/，对 SEO 和分享链接更友好。
search.provider 选 'local' 直接拿到内置全文搜索。
-->

---
transition: fade-out
---

# 路由：基于文件系统

`.md` 文件即一条路由

<v-click>

| 文件路径                | 生成的 URL                                  |
| ----------------------- | ------------------------------------------- |
| `docs/index.md`         | `/`                                         |
| `docs/guide/index.md`   | `/guide/`                                   |
| `docs/packages/[pkg].md`| 动态路由 `/packages/foo` ...                |

</v-click>

<div v-click>

**动态路由** 用 `[param].paths.ts` 提供路径，页面里 `useData()` 或 `{{ $params.pkg }}` 取参：

```ts
export default {
  paths() { return [{ params: { pkg: 'foo' } }, { params: { pkg: 'bar' } }] }
}
```

**路由重写**：`config.rewrites` 把长路径映射到短 URL。

</div>

<div v-click text-xs text-right>

_Read more about_ [_Routing_](https://vitepress.dev/guide/routing)

</div>

<style>
h1 {
  background-color: #41b883;
  background-image: linear-gradient(45deg, #41b883 10%, #34495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 文件即路由。`[pkg].md` 这种方括号文件是动态路由。

[click] 动态路由必须配 .paths.ts 提供参数列表，可以 async fetch 远程数据生成。

[click] rewrites 用来"美化"URL，常用于 monorepo 文档把 packages/foo/index.md 暴露成 /foo/。
-->

---
transition: fade-out
---

# Markdown 扩展：容器与代码

<v-click>

````md
::: tip
小提示
:::

::: warning
警告
:::

::: details 点开看代码
内容
:::
````

7 种容器：`info / tip / warning / danger / details / raw / v-pre`。

</v-click>

<div v-click>

````md
```ts {2,4-5} :line-numbers
// 行号 + 高亮第 2 行、第 4-5 行
const a = 1; const b = 2; const c = 3; const d = 4
```
````

代码块语法：花括号写行号、`:line-numbers` 启用行号。还有 `// [!code focus]` / `// [!code ++]` / `// [!code --]` 等内联标记。

</div>

<div v-click text-xs text-right>

_Read more about_ [_Markdown Extensions_](https://vitepress.dev/guide/markdown)

</div>

<style>
h1 {
  background-color: #41b883;
  background-image: linear-gradient(45deg, #41b883 10%, #34495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 7 种容器覆盖技术文档常见诉求。::: details 是折叠容器，对长代码 / FAQ 特别有用。

[click] 代码块 + [!code ...] 标记是开发者文档代码演示的事实标准。
-->

---
transition: fade-out
---

# Markdown 里直接写 Vue

可以用组件、`{{ }}` 插值、组合式 API

<v-click>

```md
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

当前计数 {{ count }}
<button @click="count++">+1</button>

<MyChart :data="[1, 2, 3]" />
```

</v-click>

<div v-click>

::: warning 组件命名
**组件名要么 PascalCase（`<MyChart />`），要么含连字符（`<my-tag />`）**；否则会被包到 `<p>` 标签里造成 hydration mismatch。
:::

</div>

<div v-click>

转义 Vue 模板语法：用 `::: v-pre` 容器或 `<span v-pre>{{ raw }}</span>`。

</div>

<div v-click text-xs text-right>

_Read more about_ [_Using Vue_](https://vitepress.dev/guide/using-vue)

</div>

<style>
h1 {
  background-color: #41b883;
  background-image: linear-gradient(45deg, #41b883 10%, #34495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Markdown 里直接 <script setup>，跟写 .vue SFC 体验一致，但不用 <template>。

[click] 组件命名规则是新手最容易踩的雷：lowercase 单词组件名会被 markdown-it 当成 HTML 块元素处理，包到 <p> 里，SSR 时 hydration mismatch。

[click] 文档里要展示双花括号字面量，用 v-pre 跳过 Vue 解析。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# Frontmatter + Data Loader

页面元信息 + 构建期数据

::left::

<v-click>

**Frontmatter**

```md
---
title: 入门
layout: doc          # 默认；可选 home / page
outline: [2, 3]
lastUpdated: true
prev: /guide/intro
next: /guide/advanced
---

# 内容...
```

</v-click>

::right::

<v-click>

**Data Loader**

```ts
// posts.data.ts
export default {
  async load() {
    return await fetch('https://api.example.com/posts')
      .then(r => r.json())
  }
}
```

```md
<script setup>
import { data as posts } from './posts.data.ts'
</script>

{{ posts.length }} 篇文章
```

</v-click>

<style>
h1 {
  background-color: #41b883;
  background-image: linear-gradient(45deg, #41b883 10%, #34495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 每个 md 文件顶部 frontmatter 控制页级行为。
layout: home 用来做首页 hero；layout: page 是纯页面（无 sidebar / outline）。

[click] data loader 是 VitePress 招牌特性：*.data.ts 在构建期执行，
返回的数据可以被任意 md 用 import { data } from ... 引入。
适合做 blog 列表、API 文档、changelog 这种"从外部数据生成内容"的场景。
-->

---
transition: fade-out
---

# 默认主题配置

nav / sidebar / outline / search / editLink

<v-click>

```ts
themeConfig: {
  nav: [
    { text: 'Guide', link: '/guide/' },
    { text: 'API', link: '/api/' },
  ],
  sidebar: {
    '/guide/': [
      { text: '入门', items: [
        { text: '安装', link: '/guide/install' },
      ]},
    ],
  },
  outline: { level: [2, 3], label: '本页目录' },
  socialLinks: [{ icon: 'github', link: 'https://github.com/me/repo' }],
  search: { provider: 'local' },
  editLink: {
    pattern: 'https://github.com/me/repo/edit/main/docs/:path',
  },
}
```

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Default Theme Config_](https://vitepress.dev/reference/default-theme-config)

</div>

<style>
h1 {
  background-color: #41b883;
  background-image: linear-gradient(45deg, #41b883 10%, #34495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 默认主题几乎覆盖所有开发者文档需求。
sidebar 可按路径前缀分组：/guide/ 一套、/api/ 一套。
search.provider 用 'local' 直接拿到内置全文搜索。
editLink 给每页加 "Edit this page on GitHub" 按钮。
-->

---
transition: fade-out
---

# 部署：GitHub Pages

`base` + Actions workflow（v5/v6 + Node 24）

<v-click>

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v6
        with: { node-version: 24, cache: pnpm }
      - uses: actions/configure-pages@v5
      - run: pnpm install
      - run: pnpm docs:build
      - uses: actions/upload-pages-artifact@v3
        with: { path: docs/.vitepress/dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
```

</v-click>

<div v-click>

`base: '/my-repo/'` 设子路径；`public/` 里资源引用**不需要**手动加 base 前缀，VitePress 自动补。

</div>

<div v-click text-xs text-right>

_Read more about_ [_Deploy_](https://vitepress.dev/guide/deploy)

</div>

<style>
h1 {
  background-color: #41b883;
  background-image: linear-gradient(45deg, #41b883 10%, #34495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是官方最新的 deploy workflow：checkout@v5 / setup-node@v6 / Node 24。
upload-pages-artifact 的 path 是 docs/.vitepress/dist，不是 .vitepress/dist。

[click] base 是站点 URL 前缀。public/ 目录里的资源 VitePress 会自动加 base，不要手动写。
-->

---
transition: fade-out
---

# i18n 与自定义主题

多语言开箱即用，深度定制也跑得通

<v-click>

**i18n**：根语言放根目录，其他语言放子目录；每个 locale 可单独配 `themeConfig`

```ts
export default {
  locales: {
    root: { label: 'English', lang: 'en' },
    zh: { label: '简体中文', lang: 'zh-CN', themeConfig: { /* 专属 */ } },
  },
}
```

</v-click>

<div v-click>

**自定义主题**：`theme/index.ts` 继承默认主题，按需替换

```ts
import DefaultTheme from 'vitepress/theme'
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) { app.component('MyGlobal', MyGlobal) },
}
```

轻微扩展用默认主题的 **layout slots**（如 `nav-bar-content-after`），不必换整个 Layout。

</div>

<div v-click text-xs text-right>

_Read more about_ [_i18n_](https://vitepress.dev/guide/i18n) · [_Custom Theme_](https://vitepress.dev/guide/custom-theme)

</div>

<style>
h1 {
  background-color: #41b883;
  background-image: linear-gradient(45deg, #41b883 10%, #34495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 多语言开箱即用：每个 locale 可以单独配 themeConfig。RTL 语言加 dir: 'rtl'。

[click] 自定义主题：extends 默认主题，只覆盖需要的部分。
app.component 注意第二个参数前面的逗号，别像我之前那样写漏。

[click] 多数场景不需要换 Layout——默认主题预留了几十个 slot，直接用 slot 就能加自定义内容。
-->

---
layout: intro
transition: fade-out
---

# 总结

VitePress 让"写技术文档"成为一件轻松的事

- **Markdown + Vue + Vite** ⇒ 开发者熟悉的栈
- **基于文件系统的路由** ⇒ 零路由配置
- **默认主题** ⇒ nav / sidebar / outline / search 全套开箱即用
- **Data Loader + Dynamic Routes** ⇒ 灵活生成内容
- **Node 20+，ESM-only** ⇒ 现代化项目要求

<div class="abs-br m-6 text-xl">
  <a href="https://vitepress.dev" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
  <a href="https://github.com/vuejs/vitepress" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/frontend-framework/ssg/vite-press/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #41b883;
  background-image: linear-gradient(45deg, #41b883 10%, #34495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
VitePress 把 Markdown / Vue / Vite 这套开发者熟悉的栈，原样搬到文档站点。
零配置就能跑、需要扩展也跑得通。是当下写技术文档的事实默认。
-->

---
layout: end
---
