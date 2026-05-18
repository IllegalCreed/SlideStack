---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Hexo
info: |
  Presentation Hexo for developers.

  Learn more at [https://hexo.io/](https://hexo.io/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center text-9xl">
  📝
</div>

<br/>

## Hexo —— Fast & Simple Blog Generator

Node.js + Markdown，中文圈博客主流 SSG，由 Tommy Chen 于 2012 年创建（基于 v8.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天讲 Hexo —— 一款专注「个人博客」场景的 Node.js 静态站点生成器。
2012 年由台湾开发者 Tommy Chen（@tommy351）创建，至今已 10+ 年历史，
是中文圈博客圈最主流的 SSG，几乎 80% 的中文技术博客都在用它。
8.x 升级到 Node.js 18+，是这次讲解的目标版本（最新 8.1.0 于 2025 年 10 月发布）。
-->

---
transition: fade-out
---

# 什么是 Hexo？

Node.js 出品，专注「个人博客」场景的快速静态站点生成器

<v-click>

- **极简上手**：一行 `hexo init` 三分钟开张，不需要懂 Node.js
- **GFM 完整支持**：所有 GitHub Flavored Markdown 特性原生可用
- **主题生态成熟**：NexT / Butterfly / Fluid / Icarus 等数十款高质量主题
- **插件丰富**：300+ 官方/社区插件，从评论到 SEO 一应俱全
- **多模板引擎**：默认 EJS，可换 Pug / Nunjucks 任意组合
- **一行部署**：`hexo deploy` 推到 GitHub Pages / Heroku / Netlify

</v-click>

<br>

<div v-click>

```bash
npm install hexo-cli -g
hexo init blog && cd blog && npm install
hexo server
```

</div>

<div v-click text-xs>

_Read more about_ [_What is Hexo?_](https://hexo.io/docs/)

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Hexo 跟 Docusaurus / VitePress 不同 —— 它专注「博客」而非「文档站」。
分类 / 标签 / 归档 / 永久链接 / RSS 是一等公民，文档功能反而需要插件补齐。
GFM 是默认 Markdown 方言，几乎所有 GitHub 上的 Markdown 写法直接可用。
NexT / Butterfly / Fluid 是社区三大顶流主题，颜值和功能都对标商业产品。

[click] 安装 / 初始化 / 启动 三条命令搞定 —— 跟 Jekyll 比省去 Ruby 环境配置苦海。
新手开张时间不到 5 分钟，这是 Hexo 在中文圈称霸的最大原因。
-->

---
transition: fade-out
---

# Hexo 的定位与生态

为什么中文圈博客圈不约而同选它？

<v-click>

| 维度 | Hexo 8 | Hugo | Jekyll | Astro | VitePress |
| --- | --- | --- | --- | --- | --- |
| 语言 / 运行时 | **Node.js** | Go | Ruby | Node.js | Node.js |
| 安装成本 | 一行 npm | 一个二进制 | gem install | npm | npm |
| 主打场景 | **个人博客** | 多用途 SSG | 个人博客 | 内容站 | 文档站 |
| 模板引擎 | EJS / Pug / Nunjucks | Go Template | Liquid | Astro | Vue |
| 构建速度 | 中（千篇 ~10s） | **极快** | 慢 | 快 | 极快 |
| 主题生态 | **极丰富**（数十款）| 丰富 | 中 | 丰富 | 少 |
| 中文社区 | **极活跃** | 活跃 | 一般 | 活跃 | 活跃 |
| 典型用户 | 个人技术博客 | 文档 / 营销站 | GitHub Pages 默认 | 内容平台 | Vue / Vite 项目 |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Hexo Themes_](https://hexo.io/themes/)

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 五大同类对比一目了然 ——

Hexo 的护城河是「中文社区 + 博客主题生态」：
- NexT / Butterfly / Fluid 这种「博客主题之神」级别的项目，都是中文开发者维护
- 知乎 / SegmentFault / 掘金搜「Hexo」资源海量，新手友好度最高

Hugo 速度极快但 Go Template 学习曲线陡；
Jekyll 是 GitHub Pages 默认但 Ruby 环境劝退；
Astro / VitePress 偏内容站 / 文档站，博客场景不是它们重心。

所以选型逻辑很清晰：
- 个人技术博客 + 中文圈 ⇒ Hexo
- 速度优先 + 多用途 ⇒ Hugo
- 文档站 ⇒ VitePress / Docusaurus
- 内容平台 ⇒ Astro
-->

---
transition: fade-out
---

# 知名用户：中文圈博客圈的事实标准

<v-click>

**官方与开源项目**

- Hexo 官网自身 / Vue.js 早期文档站 / cnpm 部分页面

**中文技术博主圈**

- 阮一峰早期个人博客 / 廖雪峰部分专题 / 各路大厂工程师个人站

**主题作者的「自有博客」**

- NexT 作者 theme-next.org / Butterfly 作者 butterfly.js.org / Fluid 作者站

**企业 / 团队博客**

- 美团 / 网易 / 知乎多个团队的对外技术博客

</v-click>

<div v-click>

> 💡 **观察**：选择 Hexo 的项目几乎都有共同特征 —— **个人作者**或**小团队**、**Markdown 写作流**、需要**RSS** 和 **评论系统**、不要花太多时间在「搭站」上。

</div>

<div v-click text-xs text-right>

_Read more about_ [_Hexo Plugins_](https://hexo.io/plugins/)

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Hexo 在中文圈的地位类似 Jekyll 在英文圈 ——
不是「最快」也不是「最酷」，但是「最稳」、「文档最全」、「主题最美」。

随便打开 Google 搜「个人博客 + 教程」中文结果，前 10 个有 7 个是 Hexo 教程。
NexT 主题至今 GitHub 三万多 star，社区仍在持续更新；
Butterfly 主题更是把「博客美学」推到极致，配置文档堪比商业产品。

[click] 这些用户的共同特征非常一致：
- 个人作者 / 小团队，没精力维护复杂构建
- Markdown 写作流，文章是核心
- 要 RSS / 评论 / SEO 这些博客基础设施
- 不想被花哨的框架绑架，简单稳定就好
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 创建项目

Node 18+，三条命令完成脚手架

::left::

<v-click>

**前置 + 安装**

```bash
# Node.js 18+ 必须
node -v

# 全局安装 hexo-cli
npm install hexo-cli -g

# 初始化项目
hexo init blog
cd blog
npm install
```

**启动 / 构建 / 部署**

```bash
hexo server        # 本地 http://localhost:4000
hexo generate      # 构建输出到 public/
hexo deploy        # 一键部署（需配 deployer）
hexo clean         # 清除缓存
```

</v-click>

::right::

<v-click>

**命令简写（最常用）**

| 完整命令 | 简写 |
| --- | --- |
| `hexo new` | `hexo n` |
| `hexo server` | `hexo s` |
| `hexo generate` | `hexo g` |
| `hexo deploy` | `hexo d` |
| `hexo clean` | （无简写） |

常见组合：

```bash
hexo clean && hexo g -d
# 清缓存 + 构建 + 部署
```

</v-click>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Hexo 上手三步走 ——
1. npm install hexo-cli -g 全局装命令行
2. hexo init blog 在当前目录生成项目骨架（内部是 clone hexojs/hexo-starter）
3. cd blog && npm install 装项目依赖（默认包含 hexo + 各 generator）

启动用 hexo server（简写 hexo s），默认 4000 端口。
hexo generate 输出 public/ 目录，是最终静态文件。
hexo deploy 是「一键部署」，需要先配 deployer 插件（下面会讲）。

[click] 命令简写是 Hexo 高频用户的肌肉记忆 ——
`hexo s` / `hexo g` / `hexo d` / `hexo n` 都是日常单字符级输入。
`hexo clean && hexo g -d` 是部署前的「三连」组合，清缓存避免增量 bug。
-->

---
transition: fade-out
---

# 项目结构

`hexo init` 生成的标准目录

<v-click>

```text
blog/
├── _config.yml             # ⚙️ 站点配置（核心）
├── _config.landscape.yml   # 主题配置（可选，命名 _config.<theme>.yml）
├── package.json            # 依赖管理
├── scaffolds/              # 📝 文章模板
│   ├── post.md
│   ├── draft.md
│   └── page.md
├── source/                 # 📚 内容源（核心）
│   ├── _posts/             # 已发布文章
│   ├── _drafts/            # 草稿（不生成）
│   └── about/              # 自定义页面
├── themes/                 # 🎨 主题（外置）
│   └── landscape/          # 默认主题
├── node_modules/
└── public/                 # 📦 构建产物（部署目标）
```

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Setup_](https://hexo.io/docs/setup)

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 五个核心目录：

- `_config.yml` —— 站点全局配置，所有站点级设置都在这。
- `scaffolds/` —— 文章模板，`hexo new <layout>` 时按对应模板生成。
- `source/` —— 内容根目录。`_posts/` 放文章；`_drafts/` 放草稿（默认不生成）；
   其他子目录（如 `about/`）按 page 处理。
- `themes/` —— 主题装这里，每个主题是独立子目录。
- `public/` —— `hexo g` 后的产物，部署到 hosting 的就是这一坨。

注意 source 内：
- 下划线前缀的目录（_posts / _drafts / _data）有特殊语义
- 不带下划线的目录（about / projects）按 page 处理，路径映射 URL
-->

---
transition: fade-out
---

# 核心配置 _config.yml

站点元数据 + URL + 目录 + 主题 + 部署，一份文件全搞定

<v-click>

```yaml {1-5|7-12|14-18|20-25|27-31}
# Site —— 站点元数据
title: 我的博客
subtitle: 慢一点也没关系
description: 个人技术笔记
author: 我
language: zh-CN

# URL —— 链接结构
url: https://my-blog.com
root: /                                # 子目录部署改这里
permalink: :year/:month/:day/:title/   # 永久链接格式
permalink_defaults:
pretty_urls:
  trailing_index: true                 # /foo/index.html
  trailing_html: true

# Directory —— 目录约定
source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories

# Extensions —— 主题 + 部署
theme: landscape

deploy:
  type: git
  repo: git@github.com:user/user.github.io.git
  branch: main
```

</v-click>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 分五块看 _config.yml：

1. Site —— title / subtitle / description / author / language / timezone
   description 用于 SEO meta 和首页 head 区，author 出现在 RSS。

2. URL —— url 必须无尾斜杠；root 必须以 / 结尾。
   子目录部署（如 https://example.com/blog/）时 root: /blog/。
   permalink 控制每篇文章的 URL 结构，常见有日期型和分类型。

3. Directory —— 不常改，但要知道默认值。
   想换 archives 路径就改 archive_dir 即可。

4. Extensions —— theme 字段决定加载哪个主题（对应 themes/<name>/）。

5. deploy —— hexo-deployer-git 配置，多目标可写数组。
   ⚠️ 切记：仓库私钥 / token 不要直接写这里，用环境变量或 deploy key。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 写作流程：hexo new

`hexo new [layout] <title>` 三种 layout 各司其职

::left::

<v-click>

**三种 layout**

```bash
hexo new post "Hello Hexo"
# → source/_posts/Hello-Hexo.md

hexo new draft "WIP"
# → source/_drafts/WIP.md
# 默认不生成，预览加 --draft

hexo new page about
# → source/about/index.md
```

**草稿发布**

```bash
hexo publish draft WIP
# 把 _drafts/WIP.md 移到 _posts/

hexo server --draft     # 临时预览草稿
```

</v-click>

::right::

<v-click>

**文件名定制**

```yaml
# _config.yml
new_post_name: :year-:month-:day-:title.md
# 生成 2026-05-18-Hello-Hexo.md

# 占位符
# :year :month :day :i_year :i_month :i_day :title
```

**scaffolds/post.md（模板）**

```md
---
title: {{ title }}
date: {{ date }}
tags:
---
```

`hexo new` 会用这个模板渲染。<span v-pre>`{{ }}`</span> 是 scaffold 占位符，不是 Nunjucks 变量。

</v-click>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] hexo new 命令有三种 layout：
- post（默认）：丢到 _posts/，按文章生成
- draft：丢到 _drafts/，默认不生成（避免半成品上线）
- page：丢到 source/<name>/index.md，按独立页面生成

draft → post 用 `hexo publish` 命令一键迁移，本质就是 mv 文件。
预览草稿用 `hexo server --draft`，临时启用 render_drafts，不改配置。

[click] new_post_name 控制文件名格式 ——
默认是 `:title.md`，建议改成日期前缀格式方便归档管理。
:i_year / :i_month / :i_day 是 ISO 周历版本（很少用）。

scaffold 模板里 `{{ title }}` 是 Hexo CLI 在新建时的占位符，
跟 Nunjucks 模板变量没关系（虽然语法长得一样）。
-->

---
transition: fade-out
---

# Front Matter：每篇文章的元数据

YAML 头部声明 layout / title / date / tags / categories

<v-click>

```yaml
---
title: 我的第一篇博客
date: 2026-05-18 10:00:00
updated: 2026-05-19 12:30:00
tags:
  - hexo
  - 博客
categories:
  - 技术
  - SSG
permalink: my-first-post/        # 覆盖站点 permalink 设置
excerpt: 这是一段摘要，会出现在列表页
description: SEO 描述
keywords: hexo, ssg, blog
comments: true
published: true
disableNunjucks: false           # 关闭 Nunjucks 解析
lang: zh
---

正文从这里开始……

<!-- more -->

`<!-- more -->` 之前是摘要，之后是正文（列表页只显示摘要）。
```

</v-click>

<div v-click>

> 💡 **categories vs tags**：categories 有**层级关系**（数组顺序决定父子），tags 是**扁平**的（顺序无意义）。

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Front Matter 是 Hexo 文章的「灵魂」：

- title / date / updated：基础三件套，时间格式按 _config.yml 的 date_format 渲染。
- tags / categories：见下条说明。
- permalink：覆盖全站 permalink 规则，单篇文章自定义 URL。
- excerpt：手动指定摘要（与 <!-- more --> 二选一）。
- description / keywords：SEO 三剑客（主题决定是否注入到 head meta）。
- comments / published：评论开关 + 是否发布。
- disableNunjucks：含 Nunjucks 语法的文章设 true，避免 {% %} 被解析。

<!-- more --> 是经典的摘要分隔符，跨平台兼容性最好。

[click] categories 与 tags 的核心区别：
- categories: [技术, SSG] —— 表示「技术」是父、「SSG」是子
- tags: [hexo, 博客] —— 两个标签平等无序

想给文章打「多个独立分类」要用 `categories: [[A], [B]]` 嵌套数组语法，
否则会被理解成 A 是 B 的父级。
-->

---
transition: fade-out
---

# more 注释与摘要

控制列表页显示的摘要边界

<v-click>

**默认行为**：列表页显示**全文**

```md
---
title: 我的文章
---

第一段……第二段……第三段……  ← 全部出现在列表页
```

</v-click>

<div v-click>

**用 `<!-- more -->` 截断**

```md
第一段（摘要）

<!-- more -->

第二段、第三段……（仅文章页可见）
```

</div>

<div v-click>

**或用 Front Matter excerpt 字段**

```yaml
---
title: 我的文章
excerpt: 自定义摘要，与正文内容无关
---
```

</div>

<div v-click>

> ⚠️ **HTML 注释里的连字符**：`<!-- more -->` 必须**完全顶格写**，前后空一行，否则可能被 Markdown 渲染器吞掉。

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 默认列表页是全文显示 —— 文章一多首页加载就崩，必须截断。

[click] 经典做法 `<!-- more -->` 标记：
- 之前的内容显示在列表页 / RSS 摘要
- 之后的内容只在文章页可见
- 主题通常自动加「阅读全文」按钮

[click] 替代方案 Front Matter `excerpt:` 字段：
- 完全独立于正文，自由编辑
- 适合手动撰写 SEO 友好的摘要

[click] 实际项目里两种都用 ——
搬运型文章用 <!-- more --> 自然截断，
精选文章用 excerpt 字段写「钩子标题」吸引点击。
-->

---
transition: fade-out
---

# 主题系统：landscape / NexT / Butterfly / Fluid

四大主流主题各有定位

<v-click>

| 主题 | 风格 | 特色 | 适合 |
| --- | --- | --- | --- |
| **landscape** | 默认 / 简约 | 开箱即用 | 临时博客 / 学习 |
| **NexT** | 经典 / 多 schema | 5 套配色 + 极致可定制 | 技术博客 / 老牌党 |
| **Butterfly** | 现代 / 大图 | 颜值天花板 + 功能全 | 中文博客 / 颜值党 |
| **Fluid** | Material Design | 大字号 / 卡片式 | 简洁极客风 |

</v-click>

<div v-click>

**安装与切换**

```bash
# 拷贝主题到 themes/
git clone https://github.com/next-theme/hexo-theme-next themes/next

# 或用 npm 安装（新主题趋势）
npm install hexo-theme-butterfly

# _config.yml 切换
theme: next       # 或 butterfly / fluid

# 主题独立配置（推荐）
# 在站点根目录建 _config.next.yml，与站点配置合并
```

</div>

<div v-click text-xs text-right>

_Read more about_ [_Hexo Themes_](https://hexo.io/themes/) · [_NexT_](https://theme-next.org/) · [_Butterfly_](https://butterfly.js.org/) · [_Fluid_](https://hexo.fluid-dev.com/)

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 四大主流主题各有定位：

- landscape：Hexo 自带的官方默认主题，朴素到几乎没有任何花样。
  好处：学习 Hexo 主题系统的最佳样本，源码极简。
  坏处：颜值「上世纪 2010 年」级别，没人真用它做正式博客。

- NexT：中文圈第一神主题，5 套配色 schema、深度可定制。
  老牌博客几乎全用它，文档完善、社区庞大。

- Butterfly：近年崛起的颜值担当 ——
  大图封面、流光动效、各种小组件，文档堪比商业产品。
  Vue 风格的「现代博客美学」。

- Fluid：Material Design 风格 ——
  大字号、卡片化布局、简洁极客风。适合不喜欢花哨的人。

[click] 安装方式有两种：
- git clone 到 themes/（老牌做法，可改源码）
- npm install hexo-theme-* （新趋势，主题独立维护）

主题配置推荐用 `_config.<theme>.yml` 跟站点配置分离，避免升级冲突。
_config.<theme>.yml 优先级高于 themes/<name>/_config.yml。
-->

---
transition: fade-out
---

# 标签插件 Tag Plugins

Hexo 在 Markdown 基础上扩展的「短代码」语法

<v-click>

**内置常用标签**

```text
{% blockquote 作者, 来源 %}
引用内容
{% endblockquote %}

{% code lang:js %}
console.log('hello')
{% endcode %}

{% asset_img cover.jpg "封面图" %}      ← 引用文章 asset folder 图片

{% link 描述 https://example.com %}     ← 带 target="_blank" 的链接

{% post_link other-post-slug "看那篇" %}  ← 站内文章链接（自动转 URL）

{% raw %}{% verbatim %}{% endraw %}     ← 阻止 Nunjucks 解析
```

</v-click>

<div v-click>

> ⚠️ **Hexo 7.0.0 起**：内置的 `jsfiddle` / `gist` / `youtube` / `vimeo` 标签被**移除**，
> 用 [hexo-tag-embed](https://github.com/hexojs/hexo-tag-embed) 插件兼容回来。

</div>

<div v-click text-xs text-right>

_Read more about_ [_Tag Plugins_](https://hexo.io/docs/tag-plugins)

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 标签插件用 `{% %}` 包裹（Nunjucks 语法），
区别于变量插值的 `{{ }}` —— 这俩在 Hexo 里语义不同：
- {% xxx %} 是「调用一个标签函数」
- {{ xxx }} 是「插入一个变量值」

常用内置标签：
- blockquote：带作者来源的引用块
- code / codeblock：单语言代码块（fenced code 等价）
- asset_img / asset_link：引用文章 asset folder 内的资源
- link：带 target=_blank 的外链
- post_link：站内文章链接，输入 slug 自动算 URL
- raw / verbatim：保护代码不被 Nunjucks 解析

[click] Hexo 7.0.0 的重大变更 ——
4 个嵌入类标签（jsfiddle / gist / youtube / vimeo）从核心移除，
搬到 hexo-tag-embed 插件，理由是嵌入第三方服务太多边缘 case。

老博客升级到 7.x 别忘了 `npm install hexo-tag-embed`，
否则历史文章里的 `{% youtube ... %}` 全部渲染失败。
-->

---
transition: fade-out
---

# Asset Folders：文章配图最佳实践

每篇文章独立带图，便于管理

<v-click>

**开启 post_asset_folder**

```yaml
# _config.yml
post_asset_folder: true
```

开启后，`hexo new post "Hello"` 同时生成同名目录：

```text
source/_posts/
├── Hello.md
└── Hello/                  # ⭐ 配图都放这
    ├── cover.jpg
    └── chart.png
```

</v-click>

<div v-click>

**在文章中引用**

```md
推荐 ⭐ 标签插件方式：

{% asset_img cover.jpg "封面图" %}
{% asset_link report.pdf "下载报告" %}

或相对路径（部分主题不支持）：

![封面](cover.jpg)
```

</div>

<div v-click>

> 💡 **优势**：移动 / 删除文章时图片跟着走；多篇文章重名不冲突；CDN 路径自动跟随 permalink。

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] post_asset_folder 是 Hexo 配图管理的最佳实践 ——
默认是 false（关闭），所有图片都堆在 source/images/ 全局目录，
迁移文章时容易迷路。

开启后，每篇文章带自己的 asset folder（同名目录），
hexo new 自动创建，结构清晰。

[click] 引用语法两种：
- `{% asset_img file "alt" %}` 标签插件方式（最稳，跨主题兼容）
- `![alt](file)` 相对路径（依赖 marked 配置 + post_link relative_url）

[click] 实战收益巨大：
- 移动文章 → mv 整个文件夹
- 删除文章 → rm 整个文件夹
- 多年后翻旧文，图文绑定从不迷路

⚠️ 注意：开启后老文章的 source/images/ 引用可能要逐步迁移。
-->

---
transition: fade-out
---

# Data Files：跨文章共享数据

`source/_data/` 目录的 YAML / JSON

<v-click>

**典型场景：菜单 / 友链 / 项目展示**

```text
source/_data/
├── menu.yml         # 导航菜单
├── friends.yml      # 友情链接
└── projects.json    # 项目列表
```

```yaml
# source/_data/menu.yml
- name: 首页
  url: /
- name: 归档
  url: /archives/
- name: 关于
  url: /about/
```

</v-click>

<div v-click>

**在模板中使用**

```html
<!-- themes/next/layout/_partials/nav.ejs -->
<ul>
<% for (const item of site.data.menu) { %>
  <li><a href="<%= url_for(item.url) %>"><%= item.name %></a></li>
<% } %>
</ul>
```

</div>

<div v-click>

> 💡 **使用约定**：把「数据」从「文章」中剥离 —— 菜单 / 配置 / 表格数据放 `_data/`，
> 主题模板按需引用 `site.data.<file_basename>`。

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Data Files 是 Hexo 3+ 引入的特性 ——
允许在 source/_data/ 放 YAML / JSON 文件，模板里通过 site.data.X 访问。

典型场景：
- 菜单（导航栏 / 侧边栏）—— 不想硬编码在主题模板里
- 友情链接 —— 集中管理
- 项目展示 —— 结构化数据驱动展示

[click] 模板里取值：
- 文件名 menu.yml → site.data.menu
- 文件名 projects.json → site.data.projects

EJS 模板用 <% %> 控制流 + <%= %> 输出，类似 JSP / ERB 语法。

[click] 使用约定：
- 「内容」（文章）走 _posts/
- 「数据」（结构化）走 _data/
两者职责分离，主题维护更清晰。
-->

---
transition: fade-out
---

# 模板变量速查

`site` / `page` / `config` / `theme` / `path` / `url`

<v-click>

| 变量 | 用途 | 常用属性 |
| --- | --- | --- |
| `site` | 站点集合 | `site.posts` / `site.pages` / `site.categories` / `site.tags` |
| `page` | 当前页面 | `page.title` / `page.date` / `page.content` / `page.excerpt` |
| `config` | 站点配置 | `config.title` / `config.url` / `config.author` |
| `theme` | 主题配置 | `theme.<任意字段>`（合并自 `_config.theme.yml`） |
| `path` | 当前页面相对路径 | 用于生成相对链接 |
| `url` | 当前页面完整 URL | SEO 用 |
| `env` | 运行环境 | `env.version` / `env.args` |

</v-click>

<div v-click>

**最常用 Helpers**

| 函数 | 作用 |
| --- | --- |
| `url_for(path)` | 给路径加 root 前缀（必用） |
| `full_url_for(path)` | 加 url + root（绝对 URL） |
| `date(page.date, 'YYYY-MM-DD')` | 时间格式化 |
| `partial('_partials/header')` | 加载片段模板 |
| `list_categories()` / `list_tags()` | 分类 / 标签列表 |

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 模板里 7 个全局变量分两类：

数据型 —— site / page / config / theme
- site.posts 是「全站文章集合」（Warehouse 实例，可链式过滤）
- page.title / page.content / page.excerpt 当前页面属性
- config 直接对应 _config.yml
- theme 直接对应 _config.<theme>.yml

工具型 —— path / url / env
- path 是当前页相对路径，用于「上一篇/下一篇」逻辑
- url 是完整 URL，<head> 里的 og:url 用它

[click] Helpers 是模板里的「函数库」，最高频四个：
- url_for：必用，自动处理 root 前缀（子目录部署的救星）
- full_url_for：sitemap / RSS / og 标签用
- date：时间格式化，传 Moment.js 格式字符串
- partial：组件化模板复用，传第二参数 locals

记住：source/_posts/ 里的 markdown 不是模板，
不能用 helpers / template variables，
那是主题模板（themes/<name>/layout/）的事。
-->

---
transition: fade-out
---

# Permalinks：URL 结构定制

`:year/:month/:day/:title/` 全在你手

<v-click>

```yaml
# _config.yml
permalink: :year/:month/:day/:title/         # 默认
```

**常见格式对照**

| 配置 | 示例 URL |
| --- | --- |
| `:year/:month/:day/:title/` | `/2026/05/18/hello/` |
| `:year/:title.html` | `/2026/hello.html` |
| `posts/:title/` | `/posts/hello/` |
| `:category/:title/` | `/技术/hello/` |
| `:id` | `/abc123` |

</v-click>

<div v-click>

**所有可用占位符**

- 时间：`:year` `:month` `:day` `:hour` `:minute` `:second` `:timestamp`
- 内容：`:title`（slug 化）`:name`（文件名）`:post_title`（原标题）`:category`
- 标识：`:id`（自增）`:hash`（SHA1）

</div>

<div v-click>

**单篇覆盖**

```yaml
# 文章 front matter
---
title: 重要文章
permalink: special-post/         # 覆盖全站规则
---
```

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Permalink 是博客 URL 的「身份证」—— 一旦上线就别频繁改，否则 SEO 全断。

默认格式 :year/:month/:day/:title/ 是时间型，
适合「按发布顺序找文章」的博客（Jekyll 默认也是这个）。

[click] 占位符三组：
- 时间型：从 front matter date 提取，:i_year/:i_month/:i_day 是 ISO 周历版本
- 内容型：
  - :title 是 slug 化的标题（去掉中文 / 特殊字符 / 空格转 -）
  - :name 是文件名（不包含日期前缀）
  - :post_title 是原标题（带中文，URL 里直接用 / 编码后用）
  - :category 是第一个分类
- 标识型：:id 是自增 ID，:hash 是 SHA1 摘要

[click] front matter 里的 permalink 字段会**完全覆盖**全站规则 ——
适合：
- 重要文章想要短链（如 /about、/now）
- 历史文章迁移时保留旧链接（SEO 不断）
-->

---
transition: fade-out
---

# 插件生态：博客的「电池」

`hexo-*` 命名约定 + npm 一键装

<v-click>

| 分类 | 代表插件 | 作用 |
| --- | --- | --- |
| **部署** | `hexo-deployer-git` | git push 到 gh-pages |
| **部署** | `hexo-deployer-rsync` | rsync 到自建服务器 |
| **RSS** | `hexo-generator-feed` | 生成 atom.xml / rss2.xml |
| **Sitemap** | `hexo-generator-sitemap` | sitemap.xml（SEO 必装） |
| **搜索** | `hexo-generator-searchdb` | 客户端搜索索引 |
| **渲染** | `hexo-renderer-pandoc` | 用 Pandoc 替代默认 markdown 引擎 |
| **渲染** | `hexo-renderer-pug` | Pug 模板支持 |
| **统计** | `hexo-symbols-count-time` | 字数 / 阅读时间统计 |
| **嵌入** | `hexo-tag-embed` | YouTube / Gist / JsFiddle 嵌入 |
| **图片** | `hexo-img-lazyload` | 图片懒加载 |

</v-click>

<div v-click>

```bash
# 一行装 RSS + Sitemap，两个 SEO 必装
npm install hexo-generator-feed hexo-generator-sitemap --save
```

</div>

<div v-click text-xs text-right>

_Read more about_ [_Plugins Directory_](https://hexo.io/plugins/)

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Hexo 插件命名规则：`hexo-<type>-<name>`
- hexo-deployer-* —— 部署器（git / heroku / rsync / ftpsync）
- hexo-generator-* —— 生成器（feed / sitemap / searchdb / archive）
- hexo-renderer-* —— 渲染器（marked / pandoc / pug / stylus）
- hexo-tag-* —— 标签插件
- hexo-filter-* —— 过滤器（拦截渲染流程）
- hexo-server-* —— 服务器扩展

10 大常用插件覆盖 90% 博客刚需：
- 部署：git / rsync 二选一
- SEO：feed / sitemap 双开
- 内容：pandoc 增强渲染、tag-embed 找回 7.0 移除的功能
- 体验：symbols-count-time 字数统计、img-lazyload 懒加载

[click] 装完之后无需手动注册 —— Hexo 启动时扫描 node_modules，
所有 hexo- 前缀的包自动加载。
配置写到 _config.yml 即可生效，重启 hexo server。
-->

---
transition: fade-out
---

# 部署：GitHub Pages（一键）

`hexo-deployer-git` + 一行命令

<v-click>

**Step 1：安装 deployer**

```bash
npm install hexo-deployer-git --save
```

</v-click>

<div v-click>

**Step 2：配置 `_config.yml`**

```yaml
deploy:
  type: git
  repo: git@github.com:user/user.github.io.git
  branch: main                  # 用户站用 main，项目站用 gh-pages
  message: Site updated [skip ci]
```

</div>

<div v-click>

**Step 3：一行部署**

```bash
hexo clean && hexo deploy --generate
# 简写：hexo clean && hexo d -g
```

</div>

<div v-click>

> 💡 **用户站 vs 项目站**：
> - `user.github.io` 仓库 → 部署到 `main` → URL `https://user.github.io`
> - `blog` 仓库 → 部署到 `gh-pages` → URL `https://user.github.io/blog/`（要改 `root: /blog/`）

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] hexo-deployer-git 是 Hexo 部署器里最常用的一个 ——
内部逻辑：cd public && git init && commit && force push 到指定 repo+branch。

[click] 配置极简，三行搞定。
- repo：用 SSH（推荐）或 HTTPS（要配 PAT），别直接写明文密码
- branch：用户站用 main，项目站用 gh-pages（GitHub Pages 默认读这俩）
- message：自定义 commit message，[skip ci] 避免触发其他 CI

[click] 部署命令组合：
- hexo clean 清缓存（避免增量构建残留旧文件）
- hexo deploy --generate 先 build 再 deploy（-g 是简写）

[click] 用户站和项目站的区别要搞清楚：
- 用户站 user.github.io：root 不变（/），URL 干净
- 项目站 user.github.io/blog：必须 root: /blog/，否则 CSS 路径全错

很多新人栽在这 —— 改了 url 没改 root，部署后样式全丢。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 部署：GitHub Actions（推荐）

CI 自动构建，源码与产物分离

::left::

<v-click>

**`.github/workflows/pages.yml`**

```yaml
name: Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive    # 主题在 submodule 里要这行
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx hexo generate
      - uses: actions/upload-pages-artifact@v3
        with:
          path: public
      - uses: actions/deploy-pages@v4
```

</v-click>

::right::

<v-click>

**GitHub 仓库设置**

1. Settings → Pages
2. Source 选 **GitHub Actions**
3. push 到 main 自动构建

**优势对比 hexo-deployer-git**

- ✅ 源码与产物分离（main 是源码，无需 gh-pages）
- ✅ CI 自动构建（本地无需装 Node）
- ✅ 团队协作友好（PR 可预览）
- ✅ 缓存依赖加速

</v-click>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] GitHub Actions 是 2024+ Hexo 部署的「现代姿势」——
完全替代 hexo-deployer-git，理由：
- 源码留在 main，产物由 CI 推到 Pages，干净
- 多人协作时不需要本地 Node 环境对齐
- 主题在 git submodule 里时，submodules: recursive 一行解决

工作流核心 4 步：
1. checkout（recursive 拉 submodule 主题）
2. setup-node（v20，cache: npm 缓存依赖）
3. npm ci + npx hexo generate（生成 public/）
4. upload-pages-artifact + deploy-pages（GitHub 官方 action）

[click] 启用流程：
- Settings → Pages → Source 选「GitHub Actions」
- push 到 main 自动触发

[click] 对比 hexo-deployer-git 的好处：
- 不用维护 gh-pages 分支
- 不用本地装 Node（推荐 Codespaces 远程写）
- PR 可以加 preview 作业，发布前看效果
-->

---
transition: fade-out
---

# 部署：Vercel / Netlify / 自建服务器

零配置或 rsync 自建

<v-click>

**Vercel / Netlify（零配置）**

直接在 Dashboard 导入 GitHub 仓库 —— Build Command 和 Output Directory 自动识别：

```text
Build command: npx hexo generate
Output directory: public
```

每个 PR 自动生成 Preview 部署。

</v-click>

<div v-click>

**自建服务器：rsync**

```bash
npm install hexo-deployer-rsync --save
```

```yaml
deploy:
  type: rsync
  host: my-server.com
  user: deploy
  root: /var/www/blog/
  port: 22
  delete: true
  verbose: true
  ignore_errors: false
```

```bash
hexo clean && hexo d -g       # 一键推送
```

</div>

<div v-click>

**Nginx 配置**

```nginx
location / {
  root /var/www/blog;
  try_files $uri $uri/index.html /404.html;
}
```

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vercel / Netlify 零配置 ——
两家平台都自动识别 Hexo 项目（package.json 里有 hexo 依赖即可）。
Build command 自动填 `npx hexo generate`，Output 自动填 `public`。

PR 预览是 Vercel / Netlify 的杀手锏 —— GitHub Pages 没有这个能力，
团队协作或者公开博客接受外部投稿时这个特性救命。

[click] 自建服务器走 hexo-deployer-rsync ——
直接把 public/ 用 rsync 推到远端 root 目录。
- delete: true 删除目标多余文件（保持产物干净）
- ignore_errors: false 出错就退出（CI 友好）
- port 默认 22，自定义端口的服务器要明写

适合自己有 VPS 想完全掌控的玩家。

[click] Nginx 端的配置一行 try_files 兜底 ——
任意 URL 找不到时尝试加 /index.html 子路径，
最后 404.html 兜底（这个文件 Hexo 默认会生成）。
-->

---
transition: fade-out
---

# Syntax Highlighter：v7+ 重大变更

`highlight.js` vs `prismjs` 二选一

<v-click>

**v7.0.0+ 简化配置**

```yaml
# _config.yml
syntax_highlighter: highlight.js    # 或 prismjs，或留空禁用

highlight:                          # highlight.js 配置
  line_number: true
  auto_detect: false
  tab_replace: '  '
  wrap: true
  hljs: false

prismjs:                            # prismjs 配置
  preprocess: true                  # true = 构建期渲染，false = 浏览器渲染
  line_number: true
  tab_replace: ''
```

</v-click>

<div v-click>

**两库对比**

| 维度 | highlight.js | prismjs |
| --- | --- | --- |
| 默认 | ✅ | ❌ |
| 体积 | 较大（自动检测） | 极小（按需加载） |
| 服务端渲染 | ✅ 总是 | preprocess: true 时 |
| 浏览器渲染 | ❌ | preprocess: false 时 |
| 插件生态 | 中 | 丰富（line-number / copy / etc.） |
| 主题样式 | hljs CSS | prism CSS |

</div>

<div v-click>

> 💡 **怎么选**：默认就用 highlight.js（出厂配置，主题适配最好）；想要 line-number 插件 + Copy 按钮 ⇒ prismjs。

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v7.0.0+ 是 Hexo 的「配置大整理」版本 ——
之前要单独设 highlight.enable: true / prismjs.enable: true，
现在统一 syntax_highlighter 字段，二选一或空字符串禁用。

旧版升级注意：v7+ 不再读 highlight.enable / prismjs.enable 字段，
要改成 syntax_highlighter: highlight.js（或 prismjs）。

[click] 两库差异：
- highlight.js：服务端渲染，每段代码 figure+table 嵌套 —— 行号原生支持
- prismjs：preprocess: true 服务端渲染，false 浏览器渲染（用 prism.js 运行时）

prismjs 浏览器渲染模式适合接 prism-plugin 系列：
- Copy 按钮、Toolbar、Diff Highlight、Show Language……
preprocess: true 模式只支持有限插件。

[click] 怎么选：
- 主题（如 NexT / Butterfly）自带 hljs 样式 ⇒ 默认 highlight.js
- 想要 prism 插件（copy / toolbar）⇒ 切到 prismjs + preprocess: false
- 完全禁用 ⇒ `syntax_highlighter:` 空，让其他 renderer 接管
-->

---
transition: fade-out
---

# v7 / v8 升级关键变更

Hexo 7（2024）+ Hexo 8（2025）合集

<v-click>

**Hexo 7.0.0（2024）破坏性变更**

- ❌ 移除内置嵌入标签：`{% jsfiddle %}` `{% gist %}` `{% youtube %}` `{% vimeo %}`
  - **迁移**：`npm install hexo-tag-embed` 找回
- ❌ 旧版 `highlight.enable` / `prismjs.enable` 弃用
  - **迁移**：改用 `syntax_highlighter: highlight.js | prismjs`
- ✅ 新增 `url_for` / `full_url_for` 标签插件
- ✅ Node.js 14+（之后 7.x 又升到 16+）

</v-click>

<div v-click>

**Hexo 8.0.0（2025-09）+ 8.1.0（2025-10）**

- ⬆️ **Node.js 18+** 强制（旧版用户必须升级 Node）
- ⬆️ 依赖大更新：marked 13 / nunjucks 3.2.4 / moment 2.30 / chokidar 4
- 🔧 内部 API 重构，部分老插件可能不兼容（升级前 `npm outdated` 检查）
- 🔧 默认渲染器 markdown 升级到 marked 13，部分 GFM 行为变化

</div>

<div v-click>

> ⚠️ **升级建议**：先在测试分支跑 `hexo clean && hexo g` 完整构建一次，对比 public/ 输出差异。

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Hexo 7.0.0 是「现代化重构」版本：

破坏性变更两条：
1. 嵌入类标签搬家到 hexo-tag-embed —— 老博客升级第一坑
2. syntax_highlighter 配置统一 —— 老配置全 deprecated

新功能两条：
1. url_for / full_url_for 作为 tag plugin 暴露（文章里也能用）
2. Node.js 14+ 最低要求

[click] Hexo 8.x（2025）继续推进现代化：
- Node 18+（更激进）
- marked 13 升级 —— 部分 markdown 边缘 case 行为变化
- nunjucks / chokidar 等核心依赖大跳版本
- 内部 API 重构 —— 老插件可能要升级

8.1.0 修复了 8.0 的多个回归问题，建议跳 8.0 直接用 8.1+。

[click] 升级前必做：
- npm outdated 看哪些插件落后
- 测试分支构建一次，diff public/ 看产物差异
- 主题升级（NexT / Butterfly 都已适配 8.x）
-->

---
transition: fade-out
---

# 生态对比：四款 SSG

按「场景诉求」选型

<v-click>

| 诉求 | 首选 | 理由 |
| --- | --- | --- |
| 个人技术博客 + 中文社区 | **Hexo** | 主题美 / 教程多 / Markdown 友好 |
| 极速构建 + 多用途 | **Hugo** | Go 单二进制 / 千篇 1 秒构建 |
| GitHub Pages 默认 | **Jekyll** | 内置支持 / 不用 CI |
| Vue 文档站 / 项目文档 | **VitePress** | Vite 驱动 / Vue 生态 |
| 多版本文档 + 博客 + i18n | **Docusaurus** | React 圈一等公民 |

</v-click>

<div v-click>

**额外维度**

- **Hexo**：Node.js / 个人博客之王 / 主题颜值天花板 / 构建中等
- **Hugo**：Go / 多用途 SSG / 速度最快 / 学习曲线陡
- **Jekyll**：Ruby / GitHub Pages 原生 / 老但稳 / 速度慢
- **VitePress**：Node.js / Vue 项目首选 / 偏文档非博客

</div>

<div v-click>

> 💡 **决策路径**：先看「写什么」—— 个人博客 ⇒ Hexo / Hugo；项目文档 ⇒ VitePress / Docusaurus；介于之间 ⇒ Astro。

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 五款 SSG 各有定位 —— 不是「谁更好」是「谁更适合什么场景」。

[click] Hexo 的护城河：
- 中文社区最活跃（教程 + 主题 + 插件）
- 博客主题颜值天花板（NexT / Butterfly）
- Markdown 友好 + GFM 默认 + 标签插件
- Node.js 生态，前端开发者上手 0 成本

代价：构建速度比 Hugo 慢一截（千篇 ~10s vs ~1s），但博客一般也就几十到几百篇，无感。

Hugo 适合：高速构建强需求 + 多用途（博客 + 文档 + 营销站混用）。
Jekyll 适合：纯 GitHub Pages 用户（不用任何 CI 配置，零运维）。
VitePress 适合：Vue 项目文档 / 不需要博客功能的站点。
Docusaurus 适合：React 生态 + 大型多版本文档 + 多语言。

[click] 决策路径很简单：
- 「写文章」⇒ Hexo / Hugo
- 「写文档」⇒ VitePress / Docusaurus
- 介于二者 ⇒ Astro 是新生代万金油
-->

---
transition: fade-out
---

# 常见踩坑

经验法则速查

<v-click>

| 问题 | 原因 | 修复 |
| --- | --- | --- |
| YAML 解析报错 | 标题含 `:` 未引用 | 整行用双引号包裹 |
| 文章 <span v-pre>`{% raw %}{{ var }}{% endraw %}`</span> 字面被解析 | Nunjucks 语法冲突 | front matter 加 `disableNunjucks: true` |
| 子目录部署样式全丢 | `root` 没改 | `_config.yml` 设 `root: /sub/` |
| `hexo g` 后内容没更新 | 缓存残留 | `hexo clean` 后再 `hexo g` |
| 浏览器 404 但本地正常 | URL 大小写不一致 | 检查 permalink / 文件名 |
| 主题改了无反应 | 浏览器缓存 | Ctrl+F5 或换无痕窗口 |
| EMFILE 文件数过多 | 系统句柄限制 | `ulimit -n 10000` |
| Memory 不足 | Node 默认堆小 | `node --max_old_space_size=8192` |
| Git 部署失败 | 没装 deployer 或 SSH key | `npm i hexo-deployer-git` + 配 key |
| WSL 文件监听失效 | WSL 限制 | 用 `hexo g` 后跑 nginx 替代 server |

</v-click>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
10 个高频踩坑，按出现频率排序：

YAML & Nunjucks 三件套（前两行）—— 新手必撞：
- 标题里有「: 副标题」必须双引号包裹
- 教程类文章里写 Vue / Jinja / Hexo 自身的 {{ }} 代码示例时，
  整篇加 disableNunjucks: true 或用 raw 标签包裹

部署相关三条 ——
- root 与 url 配套配置，子目录部署必改
- hexo clean 是部署前的强制仪式，避免增量 bug
- 文件名 / permalink 大小写敏感，移到 Linux 服务器后会暴露

性能 / 环境两条 ——
- EMFILE：大量文章触发，ulimit 调整
- Memory：千篇以上博客可能撞默认堆，--max_old_space_size 加大

主题 / 部署技术问题两条 ——
- 主题改没反应：90% 是浏览器缓存，无痕窗口测一下
- Git 部署：deployer 没装 / SSH key 没配是 top 2 失败原因

WSL 文件监听：Hexo 在 WSL2 下 chokidar 监听不稳，
解决：放弃 hexo server，跑 nginx + hexo g。
-->

---
transition: fade-out
---

# 经验法则

来自社区大量项目的最佳实践

<v-click>

- **`hexo clean` 是部署前的圣礼** —— 任何「莫名其妙的旧内容」都先 clean 一次
- **`post_asset_folder: true` 必开** —— 图文绑定管理，移动文章无后顾之忧
- **主题用 `_config.<theme>.yml` 独立** —— 站点配置与主题配置分离，升级不冲突
- **SEO 双开**：`hexo-generator-feed` + `hexo-generator-sitemap` 标配
- **永久链接早定型** —— 上线前选好 permalink，事后改动等于 SEO 自杀
- **草稿走 `_drafts/`** —— 半成品别污染 `_posts/`，发布用 `hexo publish`
- **CI 部署优于本地部署** —— GitHub Actions 一次配好，永久零运维
- **`disableNunjucks` 救老文章** —— 写 Vue / Hexo / Jinja 教程时全篇加上
- **主题在 git submodule** —— 升级跟随上游，本地改 fork 提 PR
- **categories 别滥用层级** —— 一层够用，多层级走 tags 更灵活

</v-click>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
10 条经验法则，从中文圈大量博客踩坑总结而来：

- hexo clean：增量构建是 Hexo 性能优化，但代价是「奇怪的旧内容残留」。
  上线前任何变更都 clean 一次，几秒钟换零事故。

- post_asset_folder：图文绑定是后期维护的关键。
  开了之后再回头改就要批量迁移图片，不如一开始就开。

- _config.<theme>.yml：主题升级时不动你的配置。
  优先级：站点 _config.<theme>.yml > themes/<name>/_config.yml。

- feed + sitemap：博客 SEO 双子星，搜索引擎 / RSS 阅读器必备。

- permalink 定型：URL 一旦上线就是「合同」，频繁改等于和 SEO 撕逼。
  建议用日期型 :year/:month/:day/:title/，时间稳定。

- _drafts：未成型的稿子留在草稿，避免误发布。
  hexo publish 一键迁移到 _posts。

- CI 部署：本地部署的「依赖环境」是不稳定源头，CI 配好就是「写代码 push 完事」。

- disableNunjucks：写教程文章必备。
  Vue / Jinja / Hexo 自身的 {{ }} 都会被 Hexo 模板引擎误解析。

- 主题 submodule：fork 一份你的修改在自己仓库，上游升级 git pull origin master。

- categories 一层够用：分类太深 URL 长得难看，标签型自由组合更实用。
-->

---
transition: fade-out
---

# 下一步学习路径

按场景挑章节

<v-click>

**入门 → 进阶**

- [Setup](https://hexo.io/docs/setup) —— 官方安装与初始化
- [Writing](https://hexo.io/docs/writing) —— `hexo new` 全流程
- [Configuration](https://hexo.io/docs/configuration) —— `_config.yml` 字段全表
- [Front-matter](https://hexo.io/docs/front-matter) —— 文章元数据

</v-click>

<div v-click>

**专题深入**

- [Tag Plugins](https://hexo.io/docs/tag-plugins) —— Nunjucks 标签速查
- [Permalinks](https://hexo.io/docs/permalinks) —— URL 结构定制
- [Themes](https://hexo.io/docs/themes) —— 主题开发基础
- [Plugins](https://hexo.io/docs/plugins) —— 插件 API

</div>

<div v-click>

**社区资源**

- [Themes Gallery](https://hexo.io/themes/) —— 300+ 主题预览
- [Plugins Directory](https://hexo.io/plugins/) —— 官方插件目录
- [NexT 主题文档](https://theme-next.org/) · [Butterfly 文档](https://butterfly.js.org/)

</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 入门进阶推荐顺序：
Setup → Writing → Configuration → Front-matter
这 4 篇过完基本覆盖 80% 项目需求。

[click] 专题深入按需要选：
- 想理解 Nunjucks 标签 ⇒ Tag Plugins
- 想自定义 URL ⇒ Permalinks
- 想做自己的主题 ⇒ Themes
- 想写插件 ⇒ Plugins

[click] 社区资源：
- Themes Gallery 看 300+ 主题预览图（颜值挑选）
- Plugins Directory 找现成插件
- NexT / Butterfly 文档堪比小型 SSG 项目本身
-->

---
layout: intro
transition: fade-out
---

# 总结

Hexo 把「个人技术博客」需要的一切打包送达

- **极简上手**：`npm i -g hexo-cli` + `hexo init` 三分钟开张
- **Markdown 友好**：GFM 完整支持 + 丰富标签插件 + asset folder
- **主题颜值**：NexT / Butterfly / Fluid 等社区顶流随便挑
- **插件丰富**：300+ 官方/社区插件，从 RSS 到 SEO 一应俱全
- **部署灵活**：GitHub Pages / Vercel / Netlify / 自建服务器全支持

<div class="abs-br m-6 text-xl">
  <a href="https://hexo.io" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
  <a href="https://github.com/hexojs/hexo" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/frontend-framework/ssg/hexo/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #0E83CD;
  background-image: linear-gradient(45deg, #0E83CD 10%, #4FC3F7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一下 Hexo 在 SSG 生态的位置：

- 它不是「最快」—— 是「最适合个人博客」
- 它不是「最潮」—— 是「中文圈最稳的事实标准」
- 它不是「文档站工具」—— 是「Markdown 博客之神」

如果你的诉求是「个人技术博客 + Markdown 写作 + 颜值在线」，
Hexo 仍是 2026 年最稳健的选择。

由 Tommy Chen 维护，中文社区在用，开源 13+ 年仍在持续迭代 —— 长期可下注。
-->

---
layout: end
---
