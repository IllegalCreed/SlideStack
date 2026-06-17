---
theme: seriph
background: https://cover.sli.dev
title: CodePen
info: |
  CodePen —— 面向前端 / 设计的社区型在线代码 Playground（纯前端 iframe 沙箱）。

  Learn more at [https://codepen.io/](https://codepen.io/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# CodePen

面向前端 / 设计的社区型在线代码 Playground · 纯前端 iframe 沙箱

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 {
  background-color: #47cf73;
  background-image: linear-gradient(45deg, #47cf73 10%, #1e8e4f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
大家好，今天聊 CodePen —— 前端和设计圈最有名的在线代码 Playground。
它的关键定位是：在浏览器里写 HTML/CSS/JS、实时预览，围绕"展示作品 + 社区互动 + 文档嵌入"展开。
本质是纯前端的 iframe 沙箱，不跑 Node、没有后端——这条能力边界贯穿全篇。
-->

---
transition: fade-out
---

# 什么是 CodePen？

浏览器里的前端 / 设计 Playground + 作品社区

<v-clicks>

- 在线写 **HTML / CSS / JS**（含预处理器），**实时渲染预览**
- 本质是**纯前端 iframe 沙箱**：所有 JS 在浏览器端跑
- **不跑 Node、无后端、无数据库、无服务端语言**（PHP/Ruby 都不行）
- 围绕**展示作品 + 社区互动 + 文档嵌入**构建，社交属性远强于 JSFiddle

</v-clicks>

<div v-click text-xs mt-4>

_Read more about_ [_CodePen Documentation_](https://blog.codepen.io/documentation/)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #47cf73 10%, #1e8e4f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
先说 CodePen 是什么。

[click] 它让你在浏览器里写 HTML、CSS、JS，含各种预处理器，边写边实时预览。
[click] 它的本质是一个纯前端的 iframe 沙箱，你的 JS 全在浏览器端执行。
[click] 因此它不跑 Node，没有后端、没有数据库，也不支持任何服务端语言——PHP、Ruby 这些都不行。
[click] 它真正的重心是社区：展示作品、互相点赞关注、把可运行示例嵌进文档，社交属性比 JSFiddle 强得多。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 能力边界：和 StackBlitz / CodeSandbox 比

一句话：要装包跑构建就别用 CodePen

::left::

<div v-click>

### 三家定位

- **CodePen**：浏览器 iframe 沙箱，**纯前端**
- **StackBlitz**：WebContainers，浏览器内**跑 Node**
- **CodeSandbox**：云容器 / microVM，**跑全栈**

</div>

::right::

<div v-click>

### 选型口诀

- React 片段 / CSS 动画 / 设计 demo → **CodePen**
- 要 `npm install`、起服务器 → **StackBlitz / CodeSandbox**

</div>

<div v-click text-xs mt-6 col-span-2>

经典 Pen 还有一坑：**相对路径不可用**，外链资源须写完整 URL（2.0 多文件已解除）。

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #47cf73 10%, #1e8e4f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
理解 CodePen，关键是和另外两家划清边界。

[click] 三家的运行技术完全不同：CodePen 是浏览器里的 iframe 沙箱，纯前端；StackBlitz 用 WebContainers，能在浏览器内跑完整 Node；CodeSandbox 用云容器或 microVM，能跑全栈。
[click] 所以选型口诀很简单：React 片段、CSS 动画、设计 demo，用 CodePen；一旦需要 npm install、需要起服务器，就去 StackBlitz 或 CodeSandbox。
[click] 还有个高频坑：经典 Pen 里相对路径不可用，外部资源必须写完整 URL；这条限制在 2.0 多文件 Pen 里才被解除。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 预处理器（Preprocessors）

各面板齿轮里选；版本以官方 versions 页为准

::left::

<div v-click>

### HTML / CSS

- **HTML**：Markdown、Pug、~~Haml~~、~~Slim~~
- **CSS**：Sass/SCSS、Less、Stylus、PostCSS、Autoprefixer

</div>

::right::

<div v-click>

### JS

- Babel（**JSX → 写 React**）、TypeScript
- ~~CoffeeScript~~、~~LiveScript~~
- 单独支持 **ES Modules / import**（配 Skypack/esm CDN）

</div>

<div v-click text-xs mt-6 col-span-2>

划删除线者在 **CodePen 2.0 已废弃**；内置 quick-add 可直接搜 **CDNjs** 数千个库，免手填 URL。

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #47cf73 10%, #1e8e4f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
CodePen 的一大卖点是预处理器，在各代码面板的齿轮图标里选。

[click] HTML 端支持 Markdown、Pug，以及打了删除线的 Haml、Slim；CSS 端支持 Sass/SCSS、Less、Stylus、PostCSS 和 Autoprefixer，相当齐全。
[click] JS 端有 Babel——它带 JSX，所以你能直接写 React——还有 TypeScript；CoffeeScript 和 LiveScript 也打了删除线。另外 ES Modules 的 import 是单独支持的，常配合 Skypack 这类 CDN。
[click] 打删除线的这几个在 CodePen 2.0 里都已废弃。还有，内置的 quick-add 搜索框能直接搜 CDNjs 上数千个库，选版本就行，不用手填 URL。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 多文件 Pen（CodePen 2.0）

Pen = 根文件夹，已取代旧版 Projects

::left::

<div v-click>

### 文件系统

- Pen 内含**文件 + 子文件夹**，可拖拽 / 重命名
- 编译器按扩展名**自动判定 Block**（`.scss`→Sass）
- **相对路径可用**：`./mountains.jpg` 直接 import

</div>

::right::

<div v-click>

### 文件数（按 PRO 等级）

| 等级 | 文件数上限 |
| --- | --- |
| Free | 3 |
| Starter / Dev / Super | 50 / 150 / 300 |

</div>

<div v-click text-xs mt-4 col-span-2>

旧 **Projects 已并入 2.0 多文件 Pen**：不再指定入口、移除 Minification、PostCSS Block 接管 Autoprefixer。

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #47cf73 10%, #1e8e4f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
经典 Pen 是 HTML/CSS/JS 三块面板，单文件级别。CodePen 2.0 带来了真正的多文件。

[click] 现在一个 Pen 就是一个根文件夹，里面可以有文件和子文件夹，能拖拽、能重命名；编译器会按扩展名自动判定需要哪些 Block，比如 .scss 自动触发 Sass。关键是相对路径终于能用了，可以直接 import ./mountains.jpg。
[click] 文件数按 PRO 等级分层：免费版只有 3 个；Starter、Developer、Super 分别是 50、150、300。
[click] 还要交代一句：旧的 Projects 产品线已经并入 2.0 多文件 Pen——不再需要指定入口文件，移除了 Minification，Autoprefixer 也改由 PostCSS Block 接管。
-->

---
transition: fade-out
---

# Prefill Embed API（教学核心）

代码留在你自己站点，CodePen 只负责渲染成可运行嵌入

<v-clicks>

- 无需事先建 Pen；代码即文章源码，**SEO 友好**、读者可改可 Fork
- 外层 `<div class="codepen" data-prefill='{...}'>` + 多个 `<pre data-lang>`
- `<pre>` 内代码**必须 HTML 转义**（`<` → `&lt;`）；脚本异步加载

</v-clicks>

<div v-click>

```html
<div class="codepen" data-prefill='{"title":"Demo"}'
     data-height="300" data-default-tab="js,result">
  <pre data-lang="html">&lt;div id="root"&gt;&lt;/div&gt;</pre>
  <pre data-lang="babel">ReactDOM.render(&lt;App /&gt;, root)</pre>
</div>
<script async src="https://public.codepenassets.com/embed/index.js"></script>
```

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #47cf73 10%, #1e8e4f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
如果只记一个 API，那就是 Prefill Embed——写笔记和幻灯片里"可运行示例"的标准做法。

[click] 它的理念是：代码放在你自己的网站或仓库里，对 SEO 友好，CodePen 只负责把它渲染成一个可运行、可编辑、可 Fork 的交互嵌入，你完全不用事先去 CodePen 建 Pen。
[click] 结构是外层一个带 data-prefill 的 div，里面塞多个 pre，每个 pre 用 data-lang 标一种语言。
[click] 有两个必须注意的点：pre 里的代码必须做 HTML 转义，小于号要写成 &lt；嵌入脚本是异步加载的。
[click] 下面这段就是最小例子。注意嵌入脚本域名是 public.codepenassets.com，这是新嵌入用的域名，别和旧文档里 cpwebassets 那套混用。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 嵌入已有 Pen + 可编辑嵌入

放占位元素 + 异步脚本，脚本替换成 iframe

::left::

<div v-click>

### 标准嵌入

- `class="codepen"` 占位 + 异步 `ei.js`
- 关键属性：`data-slug-hash`、`data-user`、`data-default-tab`、`data-height`、`data-theme-id`
- 快捷法：URL 里 `/pen/` 改 `/embed/` 直取 iframe

</div>

::right::

<div v-click>

### Editable Embeds（PRO）

- 访客在嵌入里**直接改代码、实时看预览**
- 适合**文档 / 教程**，改完可 Fork 进自己账号
- PRO 还解锁**无限自定义嵌入主题**

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #47cf73 10%, #1e8e4f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
除了 Prefill，把一个已经存在的 Pen 嵌进页面也很常用。

[click] 机制和 Prefill 一样：放一个 class 等于 codepen 的占位元素，加上异步的 ei.js 脚本，脚本会把它替换成 iframe。关键属性有 data-slug-hash 标识这个 Pen、data-user 作者、data-default-tab 默认展示哪些面板、还有高度和主题。一个更快的法子是直接把 URL 里的 /pen/ 改成 /embed/，拿到的就是 iframe 地址。
[click] PRO 还有个很适合教学的功能：可编辑嵌入。访客能在嵌入框里直接改代码、实时看预览，改完还能 Fork 一份进自己账号，特别适合文档和教程；PRO 同时解锁无限自定义嵌入主题。
-->

---
transition: fade-out
---

# CodePen 2.0：Next.js 重写

从 Rails 的 Classic 全面重写，公开 Beta（`codepen.io/beta`）

<v-clicks>

- **技术栈**：Classic 是 Ruby on Rails；2.0 用 **Next.js + SSR**，页面带可渲染 HTML（改善加载可见性 + 社交 unfurl）
- **Files**：多文件多类型 + 文件夹（见前页）
- **Omnibar 命令面板**：**⌘K / Ctrl-K** 模糊搜一切命令、跳文件、改设置
- **原生 Collaboration**：邮箱 / 用户名邀请即可实时共编，**不再需要特殊 URL**
- **一键部署成网站**（PRO）：Deploy 面板点一下得子域名，可绑自定义域

</v-clicks>

<style>
h1 {
  background-image: linear-gradient(45deg, #2c3e50 10%, #000000 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
CodePen 正在经历它十多年来最大的一次变动：2.0。

[click] Classic 1.0 基于 Ruby on Rails；2.0 完全重写，前端选了 Next.js 加 SSR，目的是让浏览器拿到的是充满可渲染 HTML 的页面，而不是空 div，从而改善加载可见性和社交分享时的预览展开。现在它处于公开 Beta，入口是 codepen.io/beta。
[click] 第一大变化是 Files 文件系统，多文件多类型加文件夹，上一页讲过。
[click] 第二是 Omnibar 命令面板，按 Cmd-K 或 Ctrl-K 就能模糊搜索几乎所有命令、跳转文件、修改设置，很像 VS Code。
[click] 第三是原生协作，用邮箱或用户名邀请任何人就能实时共编，不再需要过去那种特殊的协作 URL。
[click] 第四，也是很有意思的一点：任意 2.0 Pen 都能一键部署成线上网站，PRO 功能，点一下 Deploy 就拿到子域名，还能绑自定义域名。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 已废弃清单 + 部署细节

2.0 砍掉低使用率特性，迁移时别踩

::left::

<div v-click>

### 已废弃（2.0）

- **Haml、Slim**（HTML 预处理器）
- **CoffeeScript、LiveScript**（JS）
- **Flutter**、**Professor Mode**
- 独立 **Projects** 产品线（并入多文件 Pen）

</div>

::right::

<div v-click>

### 部署成网站（PRO）

- 默认新保存**不自动部署**，用 "Save & Deploy"
- Undeploy 后重部署**换新子域名**，旧的找不回
- 限制：**需 PRO**、每站 **1TB/月**带宽

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2c3e50 10%, #000000 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
重写总会做减法，2.0 砍掉了一批低使用率特性，迁移时要心里有数。

[click] 已废弃的包括：HTML 预处理器里的 Haml 和 Slim；JS 里的 CoffeeScript 和 LiveScript；还有 Flutter 支持和教学用的 Professor Mode；以及独立的 Projects 产品线，它被并入了多文件 Pen。这些都写成"已废弃"，不是猜测。
[click] 右边补充部署的几个细节：默认新保存不会自动部署，要用 Save and Deploy 手动推；下线后再重新部署会换一个新子域名，旧的找不回来；硬限制是需要 PRO，且每个站点每月 1TB 带宽。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# Pro 套餐（功能向）

具体金额以官方 codepen.io/pricing 实时为准

::left::

<div v-click>

### PRO 解锁能力

- **Private** 私有 Pen / Collection（免费全公开）
- **Asset Hosting** 资源托管（拖拽传图床，分层容量）
- **可编辑嵌入** + 无限自定义嵌入主题
- **一键部署成网站**、2.0 文件数 / 媒体上限提升

</div>

::right::

<div v-click>

### 教学 / 协作视图

- **Live View**：整页预览 URL，多设备同步刷新
- **Collab Mode**：实时共编（并发 2 / 6 / 10）
- **Presentation Mode**：演示用整页视图

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #47cf73 10%, #1e8e4f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
最后看 PRO 套餐，这里只讲功能向，具体金额请以官方 pricing 页实时为准。

[click] PRO 解锁的核心能力有：私有 Pen 和私有 Collection，因为免费版的内容全是公开的；Asset Hosting 资源托管，相当于自带图床，容量按等级分层；可编辑嵌入加无限自定义嵌入主题；还有刚说的一键部署成网站，以及 2.0 里文件数和媒体文件大小上限的提升。
[click] 另外有一组很适合教学和协作的视图：Live View 给你一个整页预览 URL，可以在多台设备上同步刷新，方便跨设备测试；Collab Mode 是实时共编，并发人数按等级是 2、6、10；Presentation Mode 是演示用的整页视图。
-->

---
layout: intro
transition: fade-out
---

# 结尾

纯前端 Playground + 强社区，把"可运行示例"嵌进文档

- 纯前端 iframe 沙箱：写前端 demo / 设计，不跑 Node
- Prefill Embed：代码留自有站点，渲染成可改可 Fork 的嵌入
- CodePen 2.0：多文件 + Omnibar + 原生协作 + 一键部署

<div class="abs-br m-6 text-xl">
  <a href="https://codepen.io/" target="_blank" class="slidev-icon-btn">
    <carbon:launch />
  </a>
  <a href="https://blog.codepen.io/documentation/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
  <a href="https://illegalcreed.github.io/zh/frontend-develop-tools/online-editor/codepen/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #47cf73 10%, #1e8e4f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这就是 CodePen 的全景。

它是一个纯前端的 iframe 沙箱，最适合写前端 demo 和设计作品，不跑 Node；Prefill Embed 让你把代码留在自有站点，再渲染成可改、可 Fork 的可运行嵌入，是做教学内容的利器；CodePen 2.0 则带来了多文件、Omnibar 命令面板、原生协作和一键部署。

官网、官方文档和我的笔记链接都在右下角，去探索吧！
-->

---
layout: end
---
