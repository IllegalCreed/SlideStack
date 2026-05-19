---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Eleventy
info: |
  Presentation Eleventy (11ty) for developers.

  Learn more at [https://www.11ty.dev/](https://www.11ty.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center text-9xl">
  🦝
</div>

<br/>

## Eleventy — Simpler Static Sites

Zero-config, multi-template SSG by Zach Leatherman，由独立开发者维护的极简主义代表（基于 v3.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天讲 Eleventy（也叫 11ty）—— 一款由 Zach Leatherman 独立创建并长期维护的 JavaScript 静态站点生成器。
2017 年首次发布，定位是「比 Jekyll 更简单、比 Hugo 更灵活、比 Next 更克制」。
2024 年 9 月发布 3.0，全面拥抱 ESM，引入 Bundle Plugin 等重大升级，
当前稳定版 3.1.5（2025-11 发布），是这次讲解的目标版本。
Eleventy 的核心信条是「Zero client-side JavaScript by default」——
默认输出零客户端 JS 的纯 HTML，是 Web 性能社区的精神图腾。
-->

---
transition: fade-out
---

# 什么是 Eleventy？

Node.js 编写的极简主义静态站点生成器

<v-click>

- **零配置启动**：`npx @11ty/eleventy` 一行命令即开始，无需配置文件
- **11 种模板引擎**：HTML / Markdown / Liquid / Nunjucks / WebC / JSX / TS …… 任选组合
- **零客户端 JS 默认**：不预设任何前端框架，输出纯静态 HTML
- **不预设技术栈**：没有 React / Vue 绑架，完全你说了算
- **Data Cascade 七层数据级联**：front matter / 目录 / 全局任意层级合并
- **小而美**：完整依赖树仅 ~10MB，构建一千页通常 <2 秒

</v-click>

<br>

<div v-click>

```bash
mkdir my-site && cd my-site
npm init -y
npm install @11ty/eleventy
npx @11ty/eleventy --serve
```

</div>

<div v-click text-xs>

_Read more about_ [_Get Started_](https://www.11ty.dev/docs/get-started/)

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Eleventy 的核心定位「Simpler Static Sites」—— 这是首页 slogan。

与 Next / Nuxt / Astro 这类「all-in-one 框架」不同，
Eleventy 只做「把模板编译为静态 HTML」这一件事，
任何客户端运行时（JS / CSS 框架）都由你自己决定加不加。

11 种模板引擎是 Eleventy 的杀手锏 ——
HTML、Markdown、Liquid、Nunjucks、WebC、JSX、TypeScript、Handlebars、Mustache、EJS、Pug
甚至可以在同一个项目里混用，例如「文章用 Markdown + 布局用 Nunjucks + 组件用 WebC」。

Data Cascade 是 Eleventy 的数据系统精髓，下面会详细讲。

[click] 启动步骤极简 —— 不需要任何配置文件、不需要选择模板。
mkdir / npm install / npx 三行进入开发服务器。
-->

---
transition: fade-out
---

# Eleventy 的定位与生态

为什么 Web 性能社区不约而同选它？

<v-click>

| 维度 | Eleventy 3 | Hugo | Astro 5 | Next.js 15 |
| --- | --- | --- | --- | --- |
| 语言 | **Node.js 18+** | Go | Node.js | Node.js |
| 默认 JS | **0KB** | 0KB | 极少（Island） | 较多（hydration） |
| 模板引擎 | **11 种** | Go Template | Astro JSX | React / MDX |
| 构建速度 | 快（千页 ~2s） | **极快** | 快 | 中 |
| 学习曲线 | **极平缓** | 中 | 中 | 陡 |
| 典型用户 | 性能党 / 个人 | 文档 / 营销 | 内容平台 | SaaS / 全栈 |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Why Eleventy?_](https://www.11ty.dev/docs/)

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 五款主流 SSG / 全栈框架对比一目了然 ——

Eleventy 的护城河是「零默认 JS + 多模板引擎自由组合」：
- 零客户端 JS 输出是 Eleventy 与 Web 性能社区的精神契约
- 11 种模板引擎自由组合，是 Hugo / Jekyll / Astro 都做不到的

Hugo 速度最快但 Go Template 学习曲线陡；
Jekyll 是 GitHub Pages 默认但 Ruby 环境劝退；
Astro 用 Island 架构折衷，但有 hydration 开销；
Next.js 功能最全但 200KB+ 首屏 JS 包让性能党头疼。

所以选型逻辑很清晰：
- 极致性能 + 简洁配置 ⇒ Eleventy
- 速度优先 + 多用途 ⇒ Hugo
- GitHub Pages 原生 ⇒ Jekyll
- Island 性能 + 内容站 ⇒ Astro
- 全栈应用 ⇒ Next.js
-->

---
transition: fade-out
---

# 知名用户：Web 性能党的事实标准

<v-click>

**主流文档与产品站**

- **MDN Web Docs**（Mozilla 文档）—— 全球 Web 开发者必读
- **Smashing Magazine**（前端权威媒体）—— 从 WordPress 迁移到 Eleventy
- **web.dev**（Google Web 文档）—— Web 性能黄金标准
- **tailwindcss.com**（早期版本）—— Tailwind 官网历史选型

**Web 性能社区**

- Google Chrome Developers / Netlify Blog / Cloudflare Pages docs（部分）
- Zach Leatherman 自己的博客（11ty.dev 也是 Eleventy 构建）

**独立开发者博客**

- 多位 Web 性能专家个人站（Jeremy Keith / Stephanie Eckles / Andy Bell）

</v-click>

<div v-click>

> 💡 **观察**：选择 Eleventy 的项目几乎都有共同特征 —— **极致性能要求**、**内容驱动**、**不愿被框架绑架**、**重视开发者自由度**。

</div>

<div v-click text-xs text-right>

_Read more about_ [_Eleventy Built With_](https://www.11ty.dev/speedlify/)

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Eleventy 在 Web 性能领域的地位无可撼动：

MDN 用 Eleventy —— 这是全球 Web 开发者每天都看的站点，
能撑起几千页文档 + 几十种语言 + 数百万 PV，证明 Eleventy 完全 production-ready。

Smashing Magazine 是大型迁移案例 —— 从 WordPress 这种重型 CMS 切到 Eleventy，
公开过详细博客文章讲性能提升（首屏 LCP 从 8s 降到 1.5s）。

web.dev 是 Google 自家的 Web 性能宣传站，
他们选 Eleventy 等于「Google 工程师为 Web 性能背书」。

tailwindcss.com 早期用 Eleventy，后来切到 Next.js（因为做了 Tailwind UI 商业产品）。
但这段历史证明 Eleventy 完全能 hold 住主流前端项目。

[click] 这些用户的共同特征非常一致：
- 性能优先（追求 Lighthouse 100 / Core Web Vitals 全绿）
- 内容驱动（文章 / 文档 / 博客是核心，不需要复杂交互）
- 反对框架绑架（不想 React 18 -> 19 升级时大改全站）
- 重视开发者自由（爱选哪个模板引擎就选哪个）

如果你的项目符合这四点，Eleventy 几乎是最优选择。
-->

---
transition: fade-out
---

# 「零客户端 JS 默认」哲学

Eleventy 的核心信条与差异化卖点

<v-click>

> _"Zero client-side JavaScript by default."_

- 构建产物默认是**纯 HTML + CSS**，不强加任何 JS 框架运行时
- 写不写客户端 JS、用什么框架，**完全你说了算**

</v-click>

<div v-click>

**对比首屏 JS 体积**

| SSG / 框架 | 默认 First Load JS |
| --- | --- |
| **Eleventy / Hugo** | **0 KB** |
| Astro | ~3 KB（Island） |
| Next.js | ~80-200 KB（React Runtime） |

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Eleventy 的精神图腾就是「零客户端 JS 默认」——
这是 Zach Leatherman 多年坚持的哲学，也是 Eleventy 与所有其他框架最大的差异点。

[click] 含义其实非常朴素：
- Eleventy 只负责把模板「编译成 HTML」，不强迫你引入任何运行时
- 你想加 Alpine.js 就加 Alpine.js，想加 React 就加 React，想纯静态就纯静态
- 默认情况下，浏览器收到的就是「HTML + CSS」，没有任何 JavaScript

这种哲学的实际收益巨大：
- Lighthouse Performance 几乎 100 分（无 JS 解析阻塞）
- 首屏 LCP 在 1 秒内（CDN 命中时）
- SEO 友好（搜索引擎拿到的就是完整 HTML）
- 跨设备稳定（低端机 / 老浏览器都能用）

[click] 首屏 JS 对比表说明问题：
- Eleventy / Hugo：0 KB —— 纯静态，最理想
- Astro：~3 KB —— Island 架构的「hydration runtime」
- Next.js / Nuxt：80-200 KB —— React / Vue runtime 是必须的

性能党选 SSG 时，看这一栏数字一目了然。
追求 First Input Delay (FID) < 100ms 的项目，Eleventy / Hugo 是唯二选择。
-->

---
transition: fade-out
---

# 创建项目：零配置上手

Node.js 18+，三条命令搞定脚手架

<v-click>

**前置 + 安装**

```bash
# Node.js 18+ 必须（v3 起强制）
mkdir my-site && cd my-site
npm init -y
npm pkg set type="module"        # ESM 推荐
npm install @11ty/eleventy
```

</v-click>

<div v-click>

**启动开发服务器**

```bash
npx @11ty/eleventy            # 首次构建（输出到 _site/）
npx @11ty/eleventy --serve    # 开发服务器（localhost:8080）
npx @11ty/eleventy --watch    # 监听文件变化，不启服务器
```

</div>

<div v-click>

> 💡 **零配置即用**：没有 `eleventy.config.js` 也能跑 —— 默认源码目录是当前目录，输出到 `_site/`。

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Eleventy 安装三步走 ——
1. 检查 Node 版本：v3 起强制 Node 18+，老项目要先升级
2. mkdir + npm init -y 初始化项目，再 `npm pkg set type="module"` 切到 ESM
   （Eleventy 3 全面拥抱 ESM，CommonJS 是「能用但不推荐」）
3. npm install @11ty/eleventy 装本体（不是 CLI 工具，是项目依赖）

注意没有「全局安装」推荐 —— Eleventy 团队鼓励项目内依赖，每个项目锁定版本。

[click] 启动方式：
- `npx @11ty/eleventy` 单次构建
- `npx @11ty/eleventy --serve` 启动开发服务器（默认 8080）
- `npx @11ty/eleventy --watch` 监听文件变化但不起服务器（适合接其他静态服务器）

实际项目用 npm scripts 包装，`pnpm dev` / `pnpm build` 标准化命令。

[click] Eleventy 的「零配置」体验是真的：
- 不需要写任何配置文件
- 默认源码目录是当前目录（你愿意改就改）
- 默认输出 _site/
- 默认 HTML / Markdown / Liquid / Nunjucks 都开箱即用

新人 5 分钟就能跑起来一个简单博客，这是 Eleventy 的最强卖点。
-->

---
transition: fade-out
---

# 项目结构：约定大于配置

最常见的目录约定

<v-click>

```text
my-site/
├── eleventy.config.js       # ⚙️ 配置（可选，无即用默认值）
├── package.json
├── _site/                   # 📦 构建产物（自动生成，git ignore）
├── _includes/               # 🧩 布局 + 组件（约定，不输出）
│   ├── base.njk
│   └── post.njk
├── _data/                   # 📊 全局数据（JSON / JS）
│   ├── site.json
│   └── navigation.js
├── posts/                   # 📚 文章（任意命名）
│   ├── posts.json           # 目录数据（自动应用到同目录文件）
│   ├── hello-world.md
│   └── second-post.md
├── index.md                 # 首页
├── style.css                # 静态资源（默认透传）
└── README.md
```

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Project Structure_](https://www.11ty.dev/docs/sample-content/)

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Eleventy 目录约定极简，五个特殊目录要记：

- `_site/` —— 构建产物，git ignore 必加。可以改名（`output: "dist"`）。
- `_includes/` —— 布局 + 组件目录，名字以 `_` 开头表示「不直接输出」。
- `_data/` —— 全局数据目录，JSON / JS 文件自动加载为模板可用变量。

非 `_` 开头的目录都按内容处理 ——
- `posts/` / `pages/` / `about/` 等都是「内容目录」
- 子目录里放同名 `xxx.json` 是「目录数据」，自动级联到同目录文件

文件级别两种约定：
- `posts.json`（目录同名 JSON）是目录数据
- `hello-world.11tydata.js`（特定模板的数据）是模板数据

这些约定都遵循 Eleventy 的「Data Cascade」机制（下面专门讲）。

不在任何特殊目录的根级文件（index.md / style.css）都会按 1:1 输出到 _site/。
-->

---
transition: fade-out
---

# 11 种模板引擎一览

Eleventy 最大杀手锏：自由组合任意引擎

<v-click>

| 引擎 | 扩展名 | 典型用途 |
| --- | --- | --- |
| **Markdown** | `.md` | 内容主力（文章 / 博客） |
| **Nunjucks** | `.njk` | 推荐布局引擎（Mozilla 出品） |
| **Liquid** | `.liquid` | Shopify / Jekyll 同款 |
| **WebC** | `.webc` | Eleventy 自家组件化 |
| **11ty.js / JSX / TS** | `.11ty.{js,jsx,ts}` | 程序化生成 |
| **其他** | `.hbs / .mustache / .ejs / .pug` | 按需启用 |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Template Languages_](https://www.11ty.dev/docs/languages/)

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 11 种模板引擎是 Eleventy 区别于其他 SSG 的最大特征 ——

Hugo 只有 Go Template，Jekyll 只有 Liquid，Astro 只有 Astro 自家语法。
Eleventy 让你随意混搭：内容写 Markdown、布局写 Nunjucks、组件写 WebC、
脚本生成写 11ty.js / TypeScript —— 一个项目里同时存在 11 种文件类型也完全没问题。

推荐组合（Eleventy 社区主流）：
- 内容：Markdown
- 布局：Nunjucks（或 Liquid，二选一即可）
- 组件：WebC（Eleventy 3 强推）
- 程序化生成：11ty.js（纯函数式）

冷门引擎按需启用：
- HAML / Pug：缩进式语法党
- Handlebars / Mustache：逻辑无关模板的传统派
- JSX / TS：来自 React / TS 圈的开发者

每个引擎都通过插件机制按需加载，
不用的引擎不会增加构建时间（Eleventy 启动时按 package.json 扫描已装的引擎包）。
-->

---
transition: fade-out
---

# Front Matter + Layouts

YAML 头部 + 布局继承

<v-click>

**文章 Front Matter（content/post.md）**

```yaml
---
title: 我的第一篇博客
layout: base.njk
date: 2026-05-18
tags: [tutorial, eleventy]
---

# {{ title }}
```

</v-click>

<div v-click>

**布局文件（\_includes/base.njk）**

```jinja
<!doctype html>
<html lang="zh-CN">
  <head><title>{{ title }}</title></head>
  <body><main>{{ content | safe }}</main></body>
</html>
```

> 💡 **layout 链**：布局可嵌套 —— `base.njk` 可再指定 `layout: skeleton.njk`。

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Front Matter 是 Eleventy 的「元数据中心」——
任何模板顶部的 YAML 块都会被 Eleventy 解析为模板可用变量。

注意几个关键字段：
- `layout: base.njk` —— 引用 _includes/ 下的布局文件
- `tags: [a, b]` —— 自动加入对应的 collection（详见后面 Collections 章节）
- `date` —— 控制文章日期（不写则取文件创建时间）
- `permalink` —— 覆盖 URL 默认规则

任何自定义字段（如 `author`）都可以在模板中通过 `{{ author }}` 读取。

[click] 布局文件用 Nunjucks 写最常见 ——
`{{ content | safe }}` 是 Eleventy 注入子内容的标准做法。
`safe` filter 必须加，否则 HTML 会被转义为字符串。

注意：Markdown 内容会先被渲染为 HTML，再注入到 layout 的 `{{ content }}`。

[click] layout 链 ——
布局文件本身也可以指定 layout，形成多层嵌套：
- `post.njk` (post layout) → 引用 `base.njk` (site shell)
- `base.njk` (site shell) → 引用 `skeleton.njk` (doctype)

这种链式继承允许复用 site shell 同时为不同内容类型定制中间层。
-->

---
transition: fade-out
---

# Permalinks：URL 结构定制

文件结构 → URL，或 Front Matter 覆盖

<v-click>

**默认（基于文件路径）**

| 输入路径 | URL |
| --- | --- |
| `index.md` | `/` |
| `about.md` | `/about/` |
| `posts/hello.md` | `/posts/hello/` |

</v-click>

<div v-click>

**Front Matter 覆盖**

```yaml
---
permalink: /me/                              # 自定义路径
permalink: "/blog/{{ title | slugify }}/"    # 模板插值
permalink: false                             # 禁止输出（仅进 collections）
---
```

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Eleventy 默认 URL 规则（trailing slash style）：
- 文件名为 index 时不加目录前缀（index.md → /）
- 非 index 文件名自动加目录后缀（about.md → /about/）
- 这是「Cool URIs don't change」哲学的实现 ——
  保证未来文件改类型（.md → .html）URL 不变

[click] permalink 字段两种用法：
- 字符串：直接指定路径，可以用模板插值
- false：禁止生成文件，但保留模板参与数据流

permalink 中可以使用：
- `{{ title | slugify }}` —— 标题 slug 化
- `{{ page.date }}` —— 文章日期
- `{{ page.fileSlug }}` —— 文件名（不含扩展名）

slug 函数是 Eleventy 内置 filter，支持中文 → 拼音转换（按 git 仓库 plugin 配置）。

[click] permalink: false 的实际用途：
- 数据模板（只产生数据，不输出页面）
- 草稿（写在源码但不发布）
- 静态资源元数据

注意：与 Hexo 的 `published: false` 不同 ——
Eleventy 的 `permalink: false` 仍然让文章出现在 collections 里。
要完全排除，加 `eleventyExcludeFromCollections: true`。
-->

---
transition: fade-out
---

# Collections：自动 + 自定义

按 tag 自动归类 + Collections API 灵活定制

<v-click>

**Tag-based 自动 collection**

```yaml
---
tags: [posts, tutorial]
---
```

```jinja
<ul>
  {% for post in collections.posts %}
    <li><a href="{{ post.url }}">{{ post.data.title }}</a></li>
  {% endfor %}
</ul>
```

</v-click>

<div v-click>

**自定义 collection（eleventy.config.js）**

```js
eleventyConfig.addCollection("latestPosts", (api) =>
  api.getFilteredByTag("posts").reverse().slice(0, 5),
);
```

</div>

<div v-click>

> 💡 **特殊集合**：`collections.all` 包含所有内容；`eleventyExcludeFromCollections: true` 可排除。

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Collections 是 Eleventy 内容分组的核心机制 ——
你可以理解为「数据库视图」：基于 tag 把内容自动归到一个数组里。

最常见用法：
- `tags: posts` 让文章归到 `collections.posts`
- `tags: [posts, tutorial]` 同时归到两个

注意 tag 名是普通字符串 ——
和数据库里的 column 是一样的概念，你可以叫任何名字（posts / blog / docs / news 都行）。

[click] 自定义 collection 通过 Configuration API：
- `addCollection` 接收一个回调，回调参数是 collections API
- `api.getFilteredByTag("posts")` 拿到 tag 过滤的数组
- `api.getAllSorted()` 拿到所有内容
- `api.getFilteredByGlob("posts/**.md")` 按 glob 模式过滤

返回的数组可以 reverse / slice / sort / filter，
最终结果在所有模板里通过 `collections.<name>` 访问。

[click] 特殊集合：
- `collections.all` 包含所有内容（包括首页）
- `collections.<tag>` 按 tag 自动生成

排除规则：
- `eleventyExcludeFromCollections: true` —— 不进任何 collection
- 不写 `tags` —— 只进 `collections.all`

这套机制比 Jekyll / Hugo 的 collection 都灵活 ——
基本就是「在配置文件里写 lodash 函数」的级别。
-->

---
transition: fade-out
---

# Data Cascade：7 层数据合并

Eleventy 最强大也最容易迷糊的机制

<v-click>

**优先级从高到低（高优先级覆盖低优先级）**

1. **Computed Data** — `eleventyComputed.title = (data) => ...`
2. **模板 Front Matter** — `--- title: 标题 ---`
3. **模板专属数据** — `posts/hello.11tydata.js`
4. **目录数据文件** — `posts/posts.json`
5. **Layout Front Matter** — layout 自身 front matter
6. **Configuration API** — `eleventyConfig.addGlobalData()`
7. **全局数据文件** — `_data/site.json`

</v-click>

<div v-click>

> 💡 对象 / 数组默认 deep merge；单个 key 覆盖加 `override:tags:` 前缀。

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Data Cascade 是 Eleventy 的「数据系统设计哲学」——
7 层数据源按优先级合并，理解了这个机制就理解了 Eleventy 数据传递的全部。

7 层从高到低：
1. Computed Data —— 计算属性，最后才合并，可以引用其他数据
2. 模板 Front Matter —— 模板自己头部 YAML
3. 模板专属数据 —— `xxx.11tydata.js` / `xxx.11tydata.json` 与模板同名
4. 目录数据 —— `<dirname>.json` 与目录同名，自动应用到目录下所有模板
5. Layout Front Matter —— 布局文件自己的 front matter
6. Configuration API —— `eleventyConfig.addGlobalData(...)` 注册
7. 全局数据文件 —— `_data/*.json` 或 `_data/*.js` 文件

实际用法举例：
- 全站站点信息 → `_data/site.json`
- 一个目录的默认 layout / tags → 目录数据文件
- 单篇文章覆盖 → front matter

[click] 默认是「深合并」—— object 和 array 都会递归合并。
但有时候你想「完全覆盖」而非合并，加 `override:` 前缀。

例如：父目录 tags: [posts] + 模板 tags: [new]
默认合并：[posts, new]
override: 覆盖：[new]

这个机制初学时让人迷糊，但用熟了非常强大 ——
比 Hugo 的 page bundle 灵活，也比 Jekyll 的 defaults 直观。
-->

---
transition: fade-out
---

# 全局数据 + 目录数据

`_data/` 与 `<dir>.json`

<v-click>

**全局数据（`_data/site.json`）**

```json
{ "name": "我的博客", "url": "https://example.com", "author": "张三" }
```

模板中：`{{ site.name }} —— {{ site.author }}`

</v-click>

<div v-click>

**动态全局数据（`_data/navigation.js`，支持 async）**

```js
export default async function () {
  const res = await fetch("https://my-cms.com/menu.json");
  return res.json();
}
```

</div>

<div v-click>

**目录数据（`posts/posts.json`）**

```json
{ "layout": "post.njk", "tags": ["posts"] }
```

> posts/ 下所有 .md 自动继承 layout + tags，无需重复。

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 全局数据是 Eleventy 最常用的「站点信息」存储 ——
`_data/site.json` 这种文件，对应模板里 `site.*` 变量（文件名为变量名）。

实际项目里通常会有：
- `_data/site.json` —— 站点基础信息
- `_data/navigation.js` —— 导航菜单
- `_data/authors.json` —— 作者信息库

[click] 动态全局数据用 .js 文件 + export default 函数 ——
支持 async！这意味着你可以在构建期从远端拉数据：
- 从 Headless CMS 拉文章列表
- 从 GitHub API 拉项目数据
- 从本地 SQLite 查询

返回值可以是任何 JSON 兼容结构，
模板里通过 `navigation.*` 访问（文件名为变量名）。

注意：构建期拉数据意味着每次 build 才会更新。
要实时性高的内容，搭配 ISR 或客户端 fetch 才合适。

[click] 目录数据是「DRY 之神」——
posts/ 目录下所有 .md 都要 `layout: post.njk` + `tags: posts`？
不用每篇都写，扔到 `posts.json` 里一次性配置。

目录数据文件命名约定：
- `<dirname>.json` —— 静态数据
- `<dirname>.11tydata.js` —— 动态数据（可 async）
- `<dirname>.11tydata.json` —— 等价 .json

子目录会继承父目录的目录数据，再合并自己的（按 Data Cascade 规则）。
-->

---
transition: fade-out
---

# Filters + Shortcodes：扩展模板能力

Configuration API 三件套：`addFilter` / `addShortcode` / `addGlobalData`

<v-click>

**自定义 filter（最常用）**

```js
eleventyConfig.addFilter("dateFormat", (date) =>
  new Intl.DateTimeFormat("zh-CN", { dateStyle: "long" }).format(date),
);
```

```jinja
{{ page.date | dateFormat }}  <!-- 2026 年 5 月 18 日 -->
```

</v-click>

<div v-click>

**Shortcode（可带参数 + body）**

```js
eleventyConfig.addShortcode("youtube", (id, title) =>
  `<iframe src="https://www.youtube.com/embed/${id}" title="${title}" loading="lazy"></iframe>`,
);
```

```jinja
{% youtube "dQw4w9WgXcQ", "教程视频" %}
```

</div>

<div v-click text-xs text-right>

_Read more about_ [_Filters_](https://www.11ty.dev/docs/filters/) · [_Shortcodes_](https://www.11ty.dev/docs/shortcodes/)

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Filters 是「模板里的函数」——
形如 `{{ value | filter }}` 或 `{{ value | filter("arg") }}`。

Eleventy 内置 filters：
- `url` —— 给路径加 pathPrefix（子目录部署必用）
- `slugify` —— 中文 / 特殊字符转 URL 友好 slug
- `log` —— console.log（调试用）
- `inputPathToUrl` —— 输入路径转 URL

自定义 filter 用 `addFilter` 注册，
所有模板引擎自动可用（Nunjucks / Liquid / Markdown 都行）。

异步 filter 也支持（Eleventy 2.0+）：
```js
eleventyConfig.addFilter("fetchMeta", async (url) => {
  const res = await fetch(url);
  return await res.json();
});
```

[click] Shortcodes 是「模板里的标签」——
形如 `{% myShortcode(args) %}` 调用，返回 HTML 字符串。

适合「组件型」内容：
- YouTube / Twitter 嵌入
- 图片处理（结合 eleventy-img）
- 复杂结构封装（卡片 / 引用 / Callout 块）

Paired shortcodes 支持 body 内容（类似 React children）：
```js
eleventyConfig.addPairedShortcode("callout", (content, type) => {
  return `<div class="callout-${type}">${content}</div>`;
});
```
```jinja
{% callout "warn" %}
注意事项内容……
{% endcallout %}
```
-->

---
transition: fade-out
---

# Plugins 生态：官方 + 社区

`eleventyConfig.addPlugin()` 一行集成

<v-click>

**官方核心插件（@11ty/* 命名空间）**

- `eleventy-img` —— 图片优化（多尺寸 / AVIF / WebP）
- `eleventy-fetch` —— 构建期 HTTP 请求 + 缓存
- `plugin-syntaxhighlight` —— Prism.js 代码高亮
- `plugin-rss / i18n / navigation` —— SEO / 多语言 / 导航
- `plugin-bundle / webc` —— CSS-JS bundle / WebC 组件

</v-click>

<div v-click>

**使用方式**

```js
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
eleventyConfig.addPlugin(syntaxHighlight);
```

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Eleventy 插件生态相对小但精 ——
不像 Hexo 几百个社区插件，Eleventy 的官方插件就 10 个左右，
但覆盖了 90% 的常见需求。

8 大官方插件覆盖：
- 图片：eleventy-img（必装 —— 自动生成 webp/avif）
- 数据获取：eleventy-fetch（构建期 fetch 带缓存）
- 高亮：syntaxhighlight（Prism.js 包装）
- SEO：rss / i18n / navigation
- 资源：bundle（CSS/JS 包管理）
- 组件：webc（Eleventy 3 推荐组件方案）

社区插件主要补充：
- @11tyrocks/* 系列（aspect-image / spinner / dark-mode）
- eleventy-plugin-toc（目录生成）
- eleventy-plugin-reading-time（阅读时间）

[click] 安装与使用一致：
- npm install @11ty/eleventy-plugin-xxx
- import + addPlugin

注意：插件第二参数可传 options：
```js
eleventyConfig.addPlugin(plugin, {
  myOption: "value",
});
```

详细 options 看每个插件 README。
-->

---
transition: fade-out
---

# WebC：Eleventy 自家组件方案

无需打包工具的 web components 风格组件

<v-click>

**安装 + 启用**

```js
import pluginWebC from "@11ty/eleventy-plugin-webc";

eleventyConfig.addPlugin(pluginWebC, {
  components: "_components/**/*.webc",
});
```

</v-click>

<div v-click>

**组件文件（`_components/btn.webc`）**

```html
<style webc:scoped>
  button { background: red; color: white; }
</style>
<button @text="label"></button>
```

使用：`<btn label="点我"></btn>`

</div>

<div v-click>

> 💡 **零运行时**：WebC 编译为纯 HTML，**不引入任何客户端 JS**。

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] WebC 是 Eleventy 自家维护的组件方案，
2022 年发布，2024 年随 Eleventy 3 进入「生产就绪」状态。

定位：「无需打包工具的 web components 风格 SSR 组件」
- 写法像 Vue SFC：HTML + style + script 一个文件
- 渲染方式是 SSR：编译期把组件展开为纯 HTML
- 命名约定：标签名直接对应文件名（btn.webc → `<btn>`）

[click] 核心语法：
- `webc:scoped` —— 样式作用域（自动加 unique 前缀）
- `@text` / `@html` —— 文本 / HTML 绑定
- `webc:if` / `webc:else` —— 条件渲染
- `webc:for` —— 列表渲染
- `webc:import` —— 跨组件引用

样式 / 脚本自动「聚合」—— 整页用了哪些组件，
就只输出对应的 CSS / JS（按需打包）。

[click] WebC 最大特点：「零客户端运行时」——
区别于 React / Vue SSR：
- React / Vue 输出 HTML + 几十 KB 的 runtime 用于 hydration
- WebC 输出纯 HTML，没有任何客户端 JS（除非你自己写 script 标签）

这完美契合 Eleventy 的「Zero client-side JS by default」哲学。
对于内容站 / 博客 / 营销页，WebC 是最优组件方案。
-->

---
transition: fade-out
---

# Bundle Plugin：CSS/JS 包不依赖外部

Eleventy 3 起内置，零运行时 in-template bundling

<v-click>

**配置 + 启用**

```js
import { bundlerPlugin } from "@11ty/eleventy-plugin-bundle";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(bundlerPlugin); // 默认开启 css / js / html bundle
};
```

</v-click>

<div v-click>

**模板内累积 CSS**

```jinja
{% css %}
  body { font-family: system-ui; }
{% endcss %}

<style>{% getBundle "css" %}</style>
<!-- 或 hash 化外部文件： -->
<link rel="stylesheet" href="{% getBundleFileUrl 'css' %}">
```

</div>

<div v-click>

> 💡 **Asset Bucketing**：`{% css "defer" %}` 用第二参数分桶 —— Critical CSS 内联 + 其他 CSS 异步加载。

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Bundle Plugin 是 Eleventy 3 的旗舰新功能 ——
它解决一个普遍痛点：「我想在组件附近写样式，但又不想每个组件都引入 webpack/rollup」。

定位：纯文本「bundler」——
- 把多个模板里的 {% css %} / {% js %} 累积起来
- 在 layout 输出时一次性 emit（内联或写文件）
- 自动去重、自动 hash 文件名

[click] 实战流程：
1. 模板里把组件 CSS 写在 `{% css %}` 块内
2. layout 里用 `{% getBundle "css" %}` 输出累计
3. 或者用 `{% getBundleFileUrl "css" %}` 写到外部文件 + 链接

这避免了「全局 CSS 文件 + 各组件 selectors 散乱」的问题，
也避免了「上 webpack + 整套 build pipeline 杀鸡用牛刀」。

[click] Asset Bucketing 是高级技巧：
- `{% css %}` 默认进 "default" 桶
- `{% css "defer" %}` 进 "defer" 桶（用第二参数命名）
- `{% getBundle "css", "default" %}` 输出 default 桶
- `{% getBundle "css", "defer" %}` 输出 defer 桶

实战：default 桶内联到 <head>（Critical CSS），
defer 桶写到外部文件 + async 加载，
完美实现 Core Web Vitals 优化。

注意：Bundle plugin 不做 minification / autoprefixer 等转换，
那些用 transforms（postcss / lightningcss）配合实现。
-->

---
transition: fade-out
---

# Image Optimization：@11ty/eleventy-img

构建期生成多尺寸 + AVIF / WebP

<v-click>

**HTML Transform 模式（最简单）**

```js
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
  formats: ["avif", "webp", "auto"],
  widths: ["auto", 400, 800, 1200],
});
```

</v-click>

<div v-click>

**HTML 中直接写 `<img>` 即可，构建后自动展开为：**

```html
<picture>
  <source srcset="...avif" type="image/avif">
  <source srcset="...webp" type="image/webp">
  <img src="...jpg" alt="封面" loading="lazy" decoding="async">
</picture>
```

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] eleventy-img 是 Eleventy 王牌插件之一 ——
基于 Sharp（业界最快 image processing 库），构建期生成响应式图片。

两种使用模式：
1. HTML Transform 模式（推荐 / 最简单）—— 自动扫描 HTML 里的 <img>，无需改源码
2. Shortcode 模式（精细控制）—— 模板里用 `{% image %}` 调用，手动指定参数

[click] HTML Transform 模式优势：
- 不改源码：保留 `<img src="cover.jpg">` 写法
- 构建期 swap：自动展开为 picture + source 多格式
- 缓存友好：图片 hash 化文件名 + 完美 CDN 缓存

配置三大关键：
- formats: 输出格式列表（avif > webp > auto 是推荐顺序）
- widths: 输出尺寸列表（auto = 保留原始尺寸）
- htmlOptions: img 标签默认属性（loading lazy 等）

[click] 性能收益巨大：
- AVIF 比 JPEG 小 50%
- WebP 比 JPEG 小 30%
- 多尺寸响应式 srcset 让移动端只下小图
- 构建期处理 = 用户零计算开销

注意：AVIF 编码慢（首次构建会卡几秒），eleventy-img 自带缓存到 .cache/，
第二次构建跳过已处理图片，开发体验 OK。
-->

---
transition: fade-out
---

# Pagination：从数据生成多页

任何数据集 → 自动分页

<v-click>

**遍历集合分页（archive.njk）**

```yaml
---
pagination:
  data: collections.posts        # 数据源
  size: 10                       # 每页 10 条
  alias: chunks
permalink: "/blog/page-{{ pagination.pageNumber + 1 }}/"
---
```

```jinja
{% for post in chunks %}<a href="{{ post.url }}">{{ post.data.title }}</a>{% endfor %}
<a href="{{ pagination.href.previous }}">上一页</a> · <a href="{{ pagination.href.next }}">下一页</a>
```

</v-click>

<div v-click>

**从数据生成详情页（`size: 1`，每条数据一页）**

```yaml
---
pagination: { data: collections.posts, size: 1, alias: post }
permalink: "/posts/{{ post.data.slug }}/"
---
```

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Pagination 是 Eleventy 数据驱动的核心机制 ——
任何数组类数据都可以「分页化」，自动生成多个 HTML 文件。

核心字段：
- data：数据源路径（collections.posts / globalData.list / front matter array）
- size：每页条数
- alias：变量别名（不写默认是 pagination.items）
- reverse：是否反向

模板里通过 pagination 对象访问：
- pagination.items —— 当前页数据数组
- pagination.pageNumber —— 当前页号（0-indexed）
- pagination.href.previous / next —— 上下页 URL
- pagination.pages —— 总页数

[click] 高级用法：pagination.size = 1 实际是「从数据生成页面」——
适用场景：
- 从 Headless CMS 拉来一堆文章 → 每条生成一个详情页
- 从全局数据 list 生成 N 个 landing page
- 标签页 / 分类页生成（每个 tag 一个页面）

这种「数据 → 模板 → N 页」是 Eleventy 程序化页面生成的核心套路。
比 Next.js 的 getStaticPaths 更直观 ——
直接在 front matter 里写「分页规则」+ 模板内容，搞定。
-->

---
transition: fade-out
---

# Incremental Builds + Watch

`--incremental` 只重建变化的文件

<v-click>

**单次增量构建**

```bash
npx @11ty/eleventy --incremental
# 只重建变化的文件，不重建整站
```

</v-click>

<div v-click>

**Watch 模式（默认增量）**

```bash
npx @11ty/eleventy --watch        # 监听文件 + 触发构建（无 HTTP 服务器）
npx @11ty/eleventy --serve        # 监听 + 开发服务器（推荐）
```

</div>

<div v-click>

**配置自定义 watch 路径**

```js
// 额外监听 _styles/，默认只监听输入目录
eleventyConfig.addWatchTarget("./_styles/");
eleventyConfig.setWatchThrottleWaitTime(100); // 防抖
```

</div>

<div v-click>

> 💡 **构建速度**：1000 篇文章首次构建 ~2 秒；增量构建单文件改动 ~50ms —— 开发体验丝滑。

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Eleventy 增量构建是开发体验关键 ——
全量构建虽然快（千篇 ~2s），但开发时编辑一篇文章重建一次还是嫌慢。
`--incremental` 让 Eleventy 只重建直接变化的文件 + 其依赖。

[click] Watch 模式两种：
- `--watch` —— 监听文件，触发构建，但不起 HTTP 服务器
  适合：搭配 nginx / serve / cloudflare-pages 等外部静态服务器
- `--serve` —— 监听 + 内置开发服务器（基于 Eleventy Dev Server）
  适合：日常开发，自带 LiveReload

[click] 自定义 watch：
- addWatchTarget —— 添加额外监听路径
  例如：CSS 在 _styles/ 目录，默认不监听，需要手动加
- setWatchThrottleWaitTime —— 防抖时间，避免连续保存触发多次构建

[click] 性能数据是 Eleventy 的「面子卡」——
官方文档明确给过：
- 1000 篇文章首次构建：~2 秒（Hugo 约 ~1 秒，Jekyll 约 ~30 秒）
- 增量构建单文件改动：~50ms
- watch 模式重建 + LiveReload 刷新：浏览器看几乎实时

这种开发体验在 SSG 圈算第一梯队 ——
Hugo 比它稍快，但 Eleventy 的 JavaScript 生态优势完全弥补。
-->

---
transition: fade-out
---

# 内置 i18n 多语言

`@11ty/eleventy-plugin-i18n` + 目录约定

<v-click>

**目录结构（推荐）**

```text
en/  ├── en.json (lang: en)  ├── index.md  └── about.md
zh/  ├── zh.json (lang: zh)  ├── index.md  └── about.md
_data/i18n.js     # 字符串字典
```

</v-click>

<div v-click>

**字典 + 模板**

```js
// _data/i18n.js
export default {
  en: { hello: "Hello", read_more: "Read more" },
  zh: { hello: "你好", read_more: "阅读更多" },
};
```

```jinja
<h1>{{ i18n[lang].hello }}</h1>
<a href="{{ post.url | locale_url }}">{{ i18n[lang].read_more }}</a>
```

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Eleventy 的 i18n 思路是「约定 + 工具」——
不像 Docusaurus 那样深度集成，但因为 Eleventy 的 Data Cascade 灵活，
通过目录数据 + 字典文件可以非常优雅地实现多语言。

推荐目录结构：
- 每个语言一个顶级目录（en/ zh/ ja/）
- 每个语言目录里有同名 JSON 目录数据，设 lang 字段
- 字符串字典放 _data/i18n.js，按 lang 分桶

文件复制规则：
- 内容文件结构 1:1 复制（en/about.md 与 zh/about.md 内容并行）
- 用 i18n filter 自动匹配 URL（避免硬编码）

[click] 字典访问模式：
模板里 `{{ i18n[lang].key }}` 这种写法，
key 集中维护，组件复用同一份字典。

也可以更精细：
- 大型项目用 i18next / rosetta（社区库）做嵌套字典 + 复数
- 简单项目就用扁平字典 + Data Cascade

[click] eleventy-plugin-i18n 提供的核心 filter：
- `locale_url(url)` —— 给 URL 加当前 lang 前缀
- `locale_links(url)` —— 生成 hreflang 切换链接（SEO 友好）

注意：URL 策略两种选：
- 独立路径（/en/about/ /zh/about/）—— 推荐，SEO 友好
- 内容协商（同 URL + Accept-Language）—— 静态站难做，不推荐
-->

---
transition: fade-out
---

# 部署：Netlify / Vercel / GitHub Pages

主流 PaaS 自动识别 Eleventy 项目

<v-click>

**Netlify（netlify.toml）**

```toml
[build]
publish = "_site"
command = "npx @11ty/eleventy"

[build.environment]
NODE_VERSION = "20"
```

</v-click>

<div v-click>

**Vercel（vercel.json）**

```json
{ "buildCommand": "npx @11ty/eleventy", "outputDirectory": "_site" }
```

**GitHub Pages**：用 `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`，
源码在 main 分支，无需维护 gh-pages。

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Netlify 是 Eleventy 最佳搭档（Netlify 工程师早期就资助 Zach 维护 Eleventy）：
- 自动检测 package.json 的 @11ty/eleventy 依赖
- 自动设 build command 为 `npx @11ty/eleventy`
- 自动设 publish dir 为 `_site`

netlify.toml 几乎可以不写，但显式配置更稳定。

[click] Vercel 也完美支持 —— 配置极简：
- buildCommand 和 outputDirectory 即可
- Node 版本自动用 20+

PR 预览是 Netlify / Vercel 的杀手锏 ——
每个 PR 自动生成 preview 部署，QA 团队 / 协作者直接看效果。

[click] GitHub Pages 的现代部署用 Actions：
- checkout + setup-node + npm ci + 构建 + upload + deploy 五步
- 不用维护 gh-pages 分支，源码在 main 即可
- 缓存 npm 依赖加速

实际项目里三选一：
- 想要 PR 预览 + 表单 / 函数 / CMS 集成 ⇒ Netlify
- Vue / React 项目栈匹配 ⇒ Vercel
- 开源项目要免费 + 与 GitHub Issues 集成 ⇒ GitHub Pages
-->

---
transition: fade-out
---

# 自建服务器：Cloudflare Pages / Nginx

GitHub Action + Cloudflare API 或 rsync 到 VPS

<v-click>

**Cloudflare Pages（推荐）**

```bash
# Cloudflare 控制台连接 GitHub 仓库即可
# Build command: npx @11ty/eleventy   Output: _site
# 免费 + 全球 Edge 网络
```

</v-click>

<div v-click>

**VPS + rsync + Nginx**

```bash
npx @11ty/eleventy
rsync -avz --delete _site/ deploy@server.com:/var/www/blog/
```

```nginx
server {
  root /var/www/blog;
  location / { try_files $uri $uri/index.html /404.html; }
  location ~* \.(css|js|webp|avif|woff2)$ {
    expires 1y; add_header Cache-Control "public, immutable";
  }
}
```

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Cloudflare Pages 是当前最强势的 PaaS ——
免费额度对个人项目几乎无限制（500 次构建/月、无带宽限制）。
全球 Edge 网络让 TTFB 控制在 50ms 以内。

部署方式：
- 控制台连接 GitHub 仓库
- Build command: `npx @11ty/eleventy`
- Output: `_site`
- 完事

Eleventy 文档站（11ty.dev）自己就在 Cloudflare Pages 上。

[click] VPS + rsync 是最朴素的部署方式 ——
对完全掌控 + 自定义 nginx / 缓存 / 日志的用户最合适。

部署流程：
1. 本地或 CI 构建 _site/
2. rsync 推到服务器 webroot
3. nginx 直接 serve 静态文件

nginx 配置三要点：
- `try_files` 兜底（Eleventy URL 都带 /index.html）
- 静态资源 long-term cache（图片 / CSS / JS 一年）
- HTTP/2 + Brotli（gzip 替代）

Brotli 压缩可以再省 15-20% 体积，
nginx-brotli 模块需要单独编译，但收益值得。
-->

---
transition: fade-out
---

# Eleventy 3 重大新特性

2024-09 发布的 3.0 + 2025 持续迭代

<v-click>

**ESM 优先 + 配置文件名简化**

```js
// eleventy.config.js（新名，v3+）
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);
};
```

旧名 `.eleventy.js`（CJS）仍兼容，但官方推荐新名 + ESM。

</v-click>

<div v-click>

**其他 3.x 亮点**

- Bundle Plugin 内置（CSS/JS bundling 无需外部工具）
- HTML Transform Plugin（图片 / 链接预处理）
- WebC 进入生产就绪
- 千页 ~2 秒构建；Node 18+ 强制
- v3.1：transforms 链 + virtual templates

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Eleventy 3.0 是 2024 年的里程碑版本，
2024 年 9 月发布，目标是「现代化 + 性能 + ESM」。

最大变化是 ESM 优先 —— 配置文件用 export default + import 语法。
CommonJS（module.exports）仍然支持，但官方文档全部以 ESM 为主。

迁移 CommonJS → ESM 一般只需：
1. `package.json` 加 `"type": "module"`
2. 配置文件改 `module.exports` 为 `export default`
3. 改 `require` 为 `import`

[click] 配置文件名简化：
- 旧名 `.eleventy.js`（点开头隐藏文件）
- 新名 `eleventy.config.js`（与 vite.config.js / next.config.js 风格一致）
- 旧名仍然支持（向后兼容），但官方推荐用新名

[click] 3.x 五大亮点：
- Bundle Plugin 内置 —— 不用单独 webpack/rollup
- HTML Transform 系列 —— 在 HTML 生成后做后处理
  （图片优化 / 链接补全 / 性能优化）
- WebC 生产就绪 —— 推荐作为组件方案
- 构建性能 —— 千页 ~2 秒，开发增量 ~50ms
- Node 18+ 强制 —— 旧版用户必须先升级 Node

v3.1（2025 年）继续推进：
- transforms 链可以多个 transform 顺序应用
- virtual templates 允许程序化注册模板（无需文件）
-->

---
transition: fade-out
---

# 生态对比：五大 SSG 决策矩阵

按「场景诉求」选型

<v-click>

| 诉求 | 首选 | 理由 |
| --- | --- | --- |
| 极致性能 + 零默认 JS | **Eleventy** | 唯一「真零 JS」的 JS 框架 |
| 个人博客 + 中文社区 | **Hexo** | 主题美 / 教程多 / 上手快 |
| 极速构建 + 多用途 | **Hugo** | Go 单二进制 / 千篇 1 秒 |
| Vue 文档站 | **VitePress** | Vite 驱动 / Vue 生态 |
| 多版本文档 + i18n | **Docusaurus** | React 圈一等公民 |
| Island 性能 + 内容平台 | **Astro** | 适合需要少量交互的内容站 |

</v-click>

<div v-click>

> 💡 **Eleventy 决策树**：「我要内容驱动 + 极致性能 + JS 生态」⇒ Eleventy。三个条件缺一项就选别的。

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 七大场景诉求 vs 七大 SSG 决策矩阵：

Eleventy 的护城河：
- 零默认 JS（唯一真零 JS 的 JS SSG）
- 多模板引擎自由组合
- 最贴近 Web 平台原生（HTML + CSS + 渐进 JS）
- 开发者自由度最高（不绑架技术栈）

代价：
- 主题生态比 Hexo 小很多
- 没有 Docusaurus 的多版本文档开箱
- 不是「设计好就能用」，更像「乐高积木自己拼」

[click] Eleventy 决策树：
- 内容驱动？（文章 / 文档 / 博客为主，不是 SaaS）✅
- 极致性能？（追求 100 Lighthouse / 1s LCP）✅
- JS 生态？（团队熟悉 Node / npm，不想学 Go / Ruby）✅

三个条件都满足 ⇒ Eleventy 最优。
任何一个条件缺 ⇒
- 缺「内容驱动」⇒ Next.js / Nuxt（应用型）
- 缺「极致性能」⇒ Docusaurus / Astro（功能取舍）
- 缺「JS 生态」⇒ Hugo / Jekyll（其他语言）

实际选型流程：先问诉求，再看决策树，最后看团队偏好。
不要迷信「最快」「最热门」—— 适合的才是最好的。
-->

---
transition: fade-out
---

# 常见踩坑

经验法则速查

<v-click>

| 问题 | 修复 |
| --- | --- |
| 模板插值 `<span v-pre>{{ var }}</span>` 不渲染 | 改扩展名 `.html` → `.njk` |
| Markdown 内 HTML 被 Liquid 解析 | front matter 加 `templateEngineOverride: md` |
| Collection 为空 | 确认 `tags` 是字符串或数组 |
| 子目录部署 CSS 全丢 | `pathPrefix` + 所有链接走 url filter |
| `{{ content }}` 输出转义字符 | 加 `safe` filter |
| pagination 不分页 | 用 `collections.posts` 而非 `posts` |
| Date 格式怪 | 加自定义 dateFormat filter |

</v-click>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
10 个高频踩坑，按出现频率排序：

模板与渲染（前 4 行）—— 新手必撞：
- 模板插值不渲染：90% 是文件扩展名问题
  `.html` 默认按 Liquid 预处理，简单插值 OK；
  复杂逻辑（条件 / 循环）建议改 `.njk` 或显式声明
- HTML 在 Markdown 中被 Liquid 误解析：
  用 templateEngineOverride 跳过 Liquid 预处理
- Layout 找不到：检查 _includes 目录位置（默认相对源码根）
- Collection 空：tag 字段类型 / 拼写

部署相关 ——
- pathPrefix 与 url filter 是子目录部署必修
  配 `pathPrefix: "/blog/"` + 所有链接走 `{{ url("/about/") }}`

模板细节 ——
- Nunjucks 默认转义 HTML → 加 safe filter
- 端口冲突 → --port 自定义

性能 / 数据 ——
- AVIF 编码慢首次 build：靠 .cache 缓存（默认在 .gitignore 里）
- pagination data 路径错：用 collections.xxx 不是 xxx
- Date 默认 toString 难看：加 dateFormat / Intl.DateTimeFormat

每个坑都不是 Eleventy 的 bug，是「约定不熟」的表现 ——
熟练后基本不会再撞。
-->

---
transition: fade-out
---

# 经验法则

来自 Eleventy 社区大量项目的最佳实践

<v-click>

- **ESM 优先** —— 新项目直接 `"type": "module"` + `eleventy.config.js`
- **目录数据 DRY** —— 重复的 layout / tags 提到 `<dir>.json`，每篇文章不重复
- **Data Cascade 心智图** —— 复杂数据合并问题先画 7 层优先级图
- **HTML Transform > Shortcode** —— 能用 HTML Transform 就别写 shortcode，作者体验更好
- **WebC 是 Eleventy 3 推荐组件方案** —— 零运行时 + scoped 样式 + 完整支持
- **Bundle Plugin 替代 webpack** —— CSS/JS 不上 bundler 也能管理良好
- **图片必装 eleventy-img** —— 现代图片格式 + 响应式 srcset 是 SEO 必要项
- **`--incremental` 开发体验提升 10 倍** —— watch 模式必加
- **`url` filter 强制** —— 所有内部链接走 filter，子目录部署不踩坑
- **Markdown 内 HTML 加 `templateEngineOverride`** —— 避免 Liquid 误解析

</v-click>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
10 条经验法则，从 Eleventy 社区大量项目踩坑总结而来：

- ESM 优先 —— Eleventy 3 已经把 ESM 作为一等公民，
  CJS 仍然支持但官方文档 / 教程都以 ESM 为主，新项目别绕路
- 目录数据 DRY —— 同目录 layout / tags 重复就提到目录数据文件，
  避免每篇文章前面塞同样的 5 行 YAML
- Data Cascade 心智图 ——
  数据合并问题先列「7 层来源」，
  从高优先级（computed）到低优先级（global）逐层 trace

- HTML Transform > Shortcode ——
  能用 HTML Transform 自动处理就别让作者写 shortcode
  `<img src="x">` 比 `{% image "x" %}` 友好得多
- WebC vs JSX vs Vue —— Eleventy 3 推荐 WebC：
  零运行时 + 自动样式作用域 + 完整 Eleventy 集成
- Bundle Plugin —— CSS / JS 用 bundle plugin 管理足够，
  不上 webpack/vite 减少配置复杂度

- 图片优化必装 —— eleventy-img 是性能党的标配
  AVIF + WebP + 响应式 srcset 一行配置全套
- 增量构建必加 —— `--incremental` 让开发体验从「秒级」到「亚秒级」
- url filter 强制 —— 所有 `{{ "/about/" | url }}` 写法
  子目录部署 / 域名变更时 pathPrefix 一改全适配
- templateEngineOverride —— Markdown 文章里有大量 HTML 时
  `templateEngineOverride: md` 跳过 Liquid 预处理避免误伤
-->

---
transition: fade-out
---

# 下一步学习路径

按场景挑章节

<v-click>

**入门 → 进阶**

- [Get Started](https://www.11ty.dev/docs/get-started/) · [Sample Content](https://www.11ty.dev/docs/sample-content/) · [Configuration](https://www.11ty.dev/docs/config/) · [Template Languages](https://www.11ty.dev/docs/languages/)

</v-click>

<div v-click>

**专题深入**

- [Data Cascade](https://www.11ty.dev/docs/data-cascade/) · [Collections](https://www.11ty.dev/docs/collections/) · [Permalinks](https://www.11ty.dev/docs/permalinks/) · [Plugins](https://www.11ty.dev/docs/plugins/)

</div>

<div v-click>

**社区资源**

- [Starter Projects](https://www.11ty.dev/docs/starter/) · [Speedlify](https://www.11ty.dev/speedlify/) · [11ty Rocks](https://11ty.rocks/)

</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 入门进阶推荐顺序：
Get Started → Sample Content → Configuration → Template Languages
这 4 篇过完基本覆盖 80% 项目需求。

Get Started 是 5 分钟跑通的最小项目。
Sample Content 是更完整的博客 / 文档示例。
Configuration 是配置文件全字段速查（设 inputDir / outputDir / dir / etc）。
Template Languages 是 11 种引擎逐个介绍 + 选择建议。

[click] 专题深入按需要选：
- 数据合并复杂 ⇒ Data Cascade（必读）
- 内容分类组织 ⇒ Collections（博客必备）
- 自定义 URL ⇒ Permalinks（迁移老站必读）
- 找插件 ⇒ Plugins 目录

[click] 社区资源：
- Starter Projects —— 不想从零搭，找官方 starter 改改即可
- Speedlify —— 看其他 Eleventy 站点性能榜（学优秀架构）
- 11ty Rocks —— Stephanie Eckles 的教程站，
  社区最热门的非官方资源，文章质量极高

进阶推荐项目：
- 看 MDN 仓库（yari）—— 大型 Eleventy 项目源码
- 看 web.dev 仓库 —— Google 的 Eleventy 实践
- 看 tailwindcss.com 早期仓库（v1/v2 时代）—— Tailwind 团队的最佳实践
-->

---
transition: fade-out
---

# 总结

Eleventy 把「极致性能 + 开发者自由」打包送达

<v-click>

- **零客户端 JS 默认**：Lighthouse 100 分不是梦，性能党的精神图腾
- **11 种模板引擎**：HTML / Markdown / Liquid / Nunjucks / WebC / JSX / TS …… 自由组合
- **Data Cascade 7 层**：从 front matter 到全局数据完整级联
- **Bundle Plugin + WebC + eleventy-img**：现代 SSG 全套工具链
- **小而美**：MDN / Smashing Magazine / web.dev 大型生产案例背书
- **独立维护 8+ 年**：Zach Leatherman 长期投入 + Netlify 资助

</v-click>

<div v-click>

> _"Eleventy is a simpler static site generator."_
>
> 不追风口、不绑架技术栈、不强制 JS —— 这就是 Eleventy 的全部哲学。

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://www.11ty.dev" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
  <a href="https://github.com/11ty/eleventy" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/frontend-framework/ssg/eleventy/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #C73B41;
  background-image: linear-gradient(45deg, #C73B41 10%, #F26B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一下 Eleventy 在 SSG 生态的位置：

- 它不是「最快」—— Hugo 速度仍领先一截
- 它不是「最潮」—— Next/Astro 噱头更多
- 它不是「主题最美」—— Hexo / Hugo / Docusaurus 都有现成漂亮主题
- 但它是「最自由 + 性能最好的 JS SSG」

Eleventy 的核心价值：
- 不强加技术栈 ⇒ 你想怎么写就怎么写
- 不强加运行时 ⇒ 客户端 0 KB 是默认
- 不强加框架 ⇒ Vanilla JS / Alpine / React / Vue 都行
- 不强加更新节奏 ⇒ 不会半年大改一次 API

如果你的诉求是：
- 内容驱动（博客 / 文档 / 营销页）
- 极致性能（Lighthouse 100 / 1s LCP）
- JavaScript 生态（团队熟悉 npm / Node）
- 长期稳定（不想每年大改技术栈）

Eleventy 仍是 2026 年最稳健、最值得长期投资的选择。

由 Zach Leatherman 维护，Netlify 资助开发，
MDN / Smashing Magazine / web.dev 等大型项目背书 ——
长期可下注。
-->

---
layout: end
---
