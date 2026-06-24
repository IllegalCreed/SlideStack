---
theme: seriph
background: https://cover.sli.dev
title: HTML 语义化与文档大纲
info: |
  HTML 语义化 —— 按含义选元素、分区与地标、article vs section、标题层级与那段「从未实现」的大纲算法
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:html-5 class="text-8xl" />
</div>

<br/>

## HTML 语义化与文档大纲

按内容的「含义」选元素，把结构写进标签里（基于 HTML Living Standard）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
语义化的核心只有一句话：按「这是什么」选标签，把「长什么样」交给 CSS。
-->

---
transition: fade-out
---

# 这一章讲什么

不是「页面长什么样」，而是「每块内容是什么」

<v-click>

- **为什么值得**：可访问性、SEO、可维护性三笔账
- **怎么搭骨架**：`<header>` `<nav>` `<main>` `<article>` `<section>` `<aside>` `<footer>`
- **最纠结的抉择**：`<article>` 还是 `<section>`？还是 `<div>`？
- **标题与大纲**：`<h1>`–`<h6>` 层级，以及那段「从未实现」的大纲算法

</v-click>

<v-click>

> 一句心法：**「哪个元素最能表达这块内容的功能？」** 答得上来，就选它。

</v-click>

---

# 一句话讲清「语义化」

> 「按每个元素的**含义**、而不是它的**外观**来组织内容。」（web.dev）

<v-click>

分工很清楚：

- **HTML** 负责「这是什么」——导航、按钮、文章
- **CSS** 负责「它长什么样」——颜色、间距、布局

哪怕 CSS 把它们改成别的样子，标签里记录的「含义」不会变。

</v-click>

---

# 反面教材：div 汤

整页除了 `<div>` `<span>` 几乎没有别的元素，靠 class 硬撑视觉结构。

```html
<!-- div 汤：照样渲染，但「含义」是零 -->
<div class="header">
  <span class="title">标题</span>
  <div class="nav"><a>链接</a></div>
</div>
```

<v-click>

```html
<!-- 语义化：标签本身就讲清了结构 -->
<header>
  <h1>标题</h1>
  <nav><a>链接</a></nav>
</header>
```

</v-click>

---

# 第一笔账：可访问性（最硬）

浏览器解析时除了 DOM，还构建一棵**无障碍树**（AOM）——读屏读的就是它。

<v-click>

语义元素带来两样东西：

- **地标 + 标题导航**：`<header>` `<nav>` `<main>` 登记成地标，`<h1>`–`<h6>` 生成大纲，读屏快捷键秒级跳转
- **隐式角色 + 内置行为**：每个语义元素自带 ARIA 角色和原生交互

</v-click>

<v-click>

div 汤里这些**统统不存在**——读屏只能从头一行行听。

</v-click>

---

# `<button>`：免费的内置行为

```html
<button>点我</button>
```

<v-click>

用 `<button>`，下面三条全是**免费**的：

- 自动进 **Tab 键顺序**，键盘可聚焦
- 自动响应 **Enter / Space** 触发
- 自带 `button` 角色，读屏会念「这是个按钮」

改用 `<div>` 模拟，每一条都得自己用 JS / `tabindex` / ARIA 补，**极易漏**。

</v-click>

---

# 不要用 role 替代原生元素

```html
<p role="button">点我</p>
```

<v-click>

::: warning 只补了「角色」，没补「功能」
`<p role="button">` 拿到了角色这层语义，但**原生功能一样都不会来**——不可聚焦、不响应键盘。web.dev：「直接用 `<button>` 容易太多了。」
:::

</v-click>

<v-click>

反过来，给真正的 `<button>` 再加 `role="button"` 是**多余**的。`role` 只在「实在没有合适原生元素」时才登场。

</v-click>

---

# 第二笔账：SEO

爬虫和读屏面对同一个问题：**不理解内容，也要看懂结构**。

<v-click>

- `<main>` 标主体，`<aside>` / `<nav>` / `<footer>` 标辅助区 → 分清主次，不把侧栏当正文
- `<h1>`–`<h6>` 层级 → 理解「这页讲什么、分几块」
- `<article>` 等自包含单元 → 利于识别、聚合与生成摘要

</v-click>

<v-click>

⚠️ 泼盆冷水：语义标签**不是**排名魔法，但让爬虫**更容易正确理解**你的内容。

</v-click>

---

# 第三笔账：可维护性

受益的是**写代码的人**——包括三个月后的你。

```html
<!-- 不读内容，你能一眼看出这是页眉吗？ -->
<div class="hdr">
  <div class="t1">…</div>
  <div class="lnks">…</div>
</div>
```

<v-click>

语义化顺带消灭两类垃圾：为找 CSS 钩子而硬起的无意义 class（`class="header"`），以及给一堆 `</div>` 收尾的 `<!-- end header -->` 注释。

</v-click>

---

# div 汤的代价为什么总被忽视

因为它**几乎全是隐性的**：

<v-click>

- 页面照常渲染，视觉上看不出问题
- 不抛任何错误、任何警告
- 写代码的人（鼠标 + 正常视力）几乎感受不到差异

</v-click>

<v-click>

受害的是你**看不见**的那批用户和系统：读屏访客、搜索引擎、接手代码的同事。把语义化当**默认习惯**，是避免这笔隐性债的唯一办法。

</v-click>

---
layout: section
---

# 分区元素与页面骨架

七个元素，一张骨架

---

# 七件套骨架

一个语义化页面，几乎都能用这七个元素拼出来：

| 元素 | 角色 | 顶层地标 |
| --- | --- | --- |
| `<header>` | 页眉 / 引导内容 | `banner` |
| `<nav>` | 主要导航块 | `navigation` |
| `<main>` | 文档主体（每页唯一） | `main` |
| `<article>` | 自包含可复用单元 | `article` |
| `<section>` | 主题分组 | 有名→`region` |
| `<aside>` | 间接相关的旁支 | `complementary` |
| `<footer>` | 页脚 | `contentinfo` |

---

# header / footer：地标看位置

`<header>` 和 `<footer>` 是不是地标，**取决于它在哪**。

<v-click>

- **顶层**（直接挂 `<body>`）：`banner` / `contentinfo` 地标
- **嵌套**（在 `article` / `aside` / `main` / `nav` / `section` 内）：退化为 `generic`，只是「这一段的页眉 / 页脚」

</v-click>

<v-click>

一页可有**多个** `<header>`：一个顶层 + 每个 `<article>` 各自的。注意 `<header>` 内不能再放 `<header>` / `<footer>`。

</v-click>

---

# `<nav>`：只给主要导航（别滥用）

> 「不必把所有链接都放进 `<nav>`，它只给**主要的导航块**。」（MDN）

<v-click>

- **该用**：主菜单、面包屑、文章目录
- **不必用**：页脚里那串杂七杂八的链接

一页多个 `<nav>` 时用 `aria-label` 区分，否则读屏只念一串重复的「navigation」：

```html
<nav aria-label="主导航">…</nav>
<nav aria-label="本页目录">…</nav>
```

</v-click>

---

# `<main>`：正文（每页唯一）

`<main>` 标出本页**独有**的核心内容，两条铁律：

<v-click>

1. **每页只能有一个**可见的 `<main>`（多余的须带 `hidden`）
2. **不能**嵌在 `article` / `aside` / `footer` / `header` / `nav` 里

</v-click>

```html
<body>
  <a href="#main">跳到主内容</a>
  <header>…</header>
  <main id="main"><h1>本页核心内容</h1></main>
</body>
```

<v-click>

经典搭配「跳转链接」：第一个可聚焦元素让读屏 / 键盘**一键跳过**重复导航。

</v-click>

---

# `<aside>`：旁支内容（侧栏）

`<aside>` 表示与周围内容**间接相关**、可单独拎出的内容——相关链接、作者简介、广告。隐式角色 `complementary`。

<v-click>

一个关键**反例**：别拿 `<aside>` 包正文里的「插话 / 括号补充」——那种文字属于主内容流。

</v-click>

<v-click>

::: tip 含义优先，位置随意
`<aside>` 表达「间接相关」这层**含义**，它在视觉上是不是真在侧边，是 CSS 的事。
:::

</v-click>

---

# `<footer>`、`<address>` 与「重名」陷阱

顶层 `<footer>`（`contentinfo`）常放版权与 `<address>` 联系方式：

```html
<footer>
  <p>&copy; 2026 我的站点</p>
  <address>联系：<a href="mailto:hi@x.com">hi@x.com</a></address>
</footer>
```

<v-click>

::: warning 同类地标出现多个就起名
两个 `<nav>` / 两个 `<aside>`，读屏会念出一模一样的地标名。用 `aria-label` / `aria-labelledby` 给每个起名区分。
:::

</v-click>

---
layout: section
---

# `<article>` vs `<section>`

最纠结的一对，外加「其实该用 `<div>`」

---

# 一句话先分清

> 「把这块内容单独拎出去——放进 RSS、被别站转载、做成卡片——它自己还讲得通吗？」

<v-click>

- **讲得通** → 自包含单元 → `<article>`
- **讲不通，但是「同一主题的一段」** → `<section>`
- **纯布局 / 样式容器** → `<div>`

</v-click>

<v-click>

> 反过来记：`<section>` **不是**高级 `<div>`；选不出语义元素时，正确答案常常就是 `<div>`。

</v-click>

---

# `<article>`：自包含、可复用

心智模型：「**报纸 / 杂志上的一篇文章**」——剪下来单独读，换个版面照样成立。

<v-click>

典型场景：

- 论坛帖、博客文章、新闻报道
- 用户提交的评论
- 商品卡片
- 可独立运行的交互小部件

</v-click>

<v-click>

每个 `<article>` **都该被标识**，通常给一个标题（`<h1>`–`<h6>`）作子元素。

</v-click>

---

# 嵌套 article：文章 + 评论

`<article>` 可嵌套，内层表示与外层相关的文章。

```html
<article>
  <h2>侏罗纪公园</h2>
  <section>
    <h3>用户评论</h3>
    <article>
      <h4>太吓人了！</h4>
      <p>对我来说太恐怖了。</p>
    </article>
  </section>
</article>
```

<v-click>

每条评论是一个 `<article>`，「用户评论」这个**主题块**用 `<section>` 包——各司其职。

</v-click>

---

# `<section>`：主题分组，几乎总该带标题

> 「`<section>` **不是**一个通用容器元素」「**应当总是带一个标题**，极少数情况例外。」

```html
<section>
  <h2>选购标准</h2>
  <p>挑苹果要考虑大小、颜色、硬度……</p>
</section>
```

<v-click>

- 默认隐式角色 `generic`，对读屏没特别意义
- **只有**给它无障碍名（`aria-label` 或关联标题），才升级为 `region` 地标
- 没标题、没名字的 `<section>`，语义上和 `<div>` 几乎没区别

</v-click>

---

# 决策流程：四步选元素

<v-click>

1. 这块是**导航 / 主体 / 旁支**吗？→ `<nav>` / `<main>` / `<aside>`
2. 单独拎出去还**成立**吗？→ `<article>`
3. 是「同一主题的一段」、且**能给它标题**吗？→ `<section>`
4. 以上都不是，只想要个**样式钩子**？→ `<div>`

</v-click>

<v-click>

```html
<!-- ❌ 误用：只想要布局容器，却用了 section -->
<section class="card-grid">…</section>
<!-- ✅ 正确：纯布局容器用 div -->
<div class="card-grid"><article class="card">…</article></div>
```

</v-click>

---
layout: section
---

# 标题层级与文档大纲

外加一段「从未实现」的避坑史料

---

# 六级标题：三条规则

> 铁律：**「别用标题来把文字变粗变大，那是 CSS 的活。」** 标题级别表达**结构层级**，不是字号。

```html
<!-- ❌ 缺了 h2  →  ✅ 逐级递进 -->
<h1>一级标题</h1>
<h3>三级标题</h3>
```

<v-click>

- **别向下跳级**：跳级让读屏用户纳闷「缺掉的那级去哪了」；收束子区段时**向上回跳合法**（`<h4>`→`<h2>`）
- **一页通常一个 `<h1>`**：描述整页主题（类似 `<title>`）；多 `<h1>` 标准允许但**非最佳实践**

</v-click>

---

# ⚠️ 那个「从未存在」的大纲算法

早期 HTML 有一套迷人的设想：浏览器**根据分区元素嵌套自动计算标题层级**。

```html
<!-- 曾经的设想：每层都用 h1，靠 section 自动降级 -->
<h1>顶级标题</h1>
<section>
  <h1>本该被算成 h2 的标题</h1>
</section>
```

<v-click>

设想下，你可以在每个 `<section>` 里都写 `<h1>`，由嵌套深度自动「降级」。

</v-click>

---

# 残酷的现实：从未被实现

> 「嵌套多个 `<h1>`……**从来不是最佳实践，如今已属不符合规范**。」（MDN）

<v-click>

后果：屏幕阅读器和搜索引擎看到的，就是**一连串平级的一级标题**，结构信息**全部丢失**。社区名篇《There Is No Document Outline Algorithm》讲的就是这件事。

</v-click>

<v-click>

结论很简单——**显式写出真实级别**，嵌套**不会**自动降级：

```html
<main>
  <h1>苹果</h1>
  <article><h2>红蛇果</h2></article>
</main>
```

</v-click>

---
layout: section
---

# 三个易错语义元素

`<search>` · `<address>` · `<hgroup>`

---

# `<search>`：搜索区的语义容器（新）

标明「这块是搜索 / 筛选功能」，自带 `search` 地标，**取代手写的 `role="search"`**。

```html
<!-- 旧：div + role  →  新：语义元素，自带 search 地标 -->
<search>
  <form action="/search"><input type="search" name="q" /></form>
</search>
```

<v-click>

::: warning 包控件，不包结果
`<search>` 用于搜索的**控件与功能**，**不用于呈现结果**——结果应属于页面主内容；内部可放「即时搜索建议」。
:::

</v-click>

<v-click>

兼容性：**2023-10 起 Baseline 广泛可用**；极老浏览器降级回 `<div role="search">`。

</v-click>

---

# `<address>`：联系方式，不是「地址标签」

> 「为其**最近的 `<article>` 或 `<body>` 祖先**提供**联系方式**。」可以是邮箱、电话、社交账号——只要是「联系到这个人 / 组织」的信息。

```html
<address>作者：<a href="mailto:tom@x.com">tom@x.com</a></address>
```

<v-click>

三条「别」：

- **别**包与联系无关的任意地址（文中「故宫位于北京……」是普通内容）
- **别**塞发布日期等元信息（日期属于 `<time>`）
- **别**嵌套 `<address>`，也别在里面放分区内容

</v-click>

---

# `<hgroup>`：语义已经变了

很多老资料还停留在旧定义。它**现在**的含义：

> 「把**一个** `<h1>`–`<h6>`，与**一个或多个** `<p>` 组合在一起。」

```html
<hgroup>
  <h1>科学怪人</h1>
  <p>又名：现代普罗米修斯</p>
</hgroup>
```

<v-click>

用来给**单个标题**配上副标题 / 标语（用 `<p>` 承载）。旧法（包多个标题）**已废弃**——那样副标题会被当成真标题，污染大纲。

</v-click>

---

# 三者对照

| 元素 | 真正含义 | 最常见误用 |
| --- | --- | --- |
| `<search>` | 搜索 / 筛选**控件**区 | 把搜索**结果**塞进去 |
| `<address>` | 最近祖先的**联系方式** | 包任意地址 / 发布日期 |
| `<hgroup>` | **一个**标题 + 若干 `<p>` | 沿用旧法包**多个标题** |

<v-click>

共同点：都有「看着像、其实不是」的陷阱——按**含义**用，别按外观套。

</v-click>

---
layout: section
---

# 分组内容

正文内部：段落、引用、图表、分隔

---

# `<p>`：段落（别撑间距）

`<p>` 是文本最基本的分组单位。高频误用：拿空 `<p>` 制造垂直间距。

```html
<!-- ❌ 用空段落撑间距 -->
<p>第一段。</p>
<p></p>
<p>第二段。</p>

<!-- ✅ 间距交给 CSS -->
<p>第一段。</p>
<p>第二段。</p>
```

<v-click>

段落之间要多少留白，是 `margin` / `gap` 的职责。

</v-click>

---

# blockquote / q / cite 分工

| 元素 | 用途 |
| --- | --- |
| `<blockquote>` | **块级**长引用（独立成段，带 `cite` 属性） |
| `<q>` | **行内**短引用（自动加引号） |
| `<cite>` | 被引**作品的标题**（非人名） |

<v-click>

- ⚠️ 引用的**署名必须放在 `<blockquote>` 外面**（规范硬要求）
- `cite="URL"` 是机器读的元信息，浏览器默认**不显示**
- 默认缩进是浏览器样式，**别因为「想要缩进」去用 `<blockquote>`**

</v-click>

---

# `<figure>` + `<figcaption>`

自包含的图 / 代码 / 图表 + 可选说明，**作为整体**被正文引用。

```html
<figure>
  <img src="/logo.png" alt="站点 Logo" />
  <figcaption>本站 Logo</figcaption>
</figure>
```

<v-click>

- 判断关键：在正文中被引用，但**可移到别处 / 附录而不影响正文流畅**
- `<figcaption>` 必须是**第一个或最后一个**子元素，为 `<figure>` 提供**无障碍名**（与图片 `alt` 各司其职）

</v-click>

---

# `<hr>` 与 `<pre>`

`<hr>` 在 HTML5 里**有语义**——表示**段落级主题转换**，不是「画装饰横线」。

```html
<p>……第一个话题到此为止。</p>
<hr />
<p>接下来是完全不同的话题……</p>
```

<v-click>

`<pre>` **原样保留**空白与换行，配 `<code>` 是展示代码块的标准写法：

```html
<pre><code>function add(a, b) {
  return a + b;
}</code></pre>
```

</v-click>

---

# `<div>`：最后手段

`<div>` 是**完全没有语义**的通用容器，存在的唯一正当理由是**纯布局 / 样式包裹**。

<v-click>

选择顺序：

1. 先问「**哪个语义元素能表达这块内容的含义？**」
2. 只有答案是「它没含义，我纯粹需要个盒子」时，**才**用 `<div>`

</v-click>

<v-click>

`<div>` 块级、`<span>` 行内，都只为样式而生。**用错位置**才是问题，`<div>` 本身不坏。

</v-click>

---

# 最佳实践小结

<v-click>

- **心法一句**：哪个元素最能表达这块内容的功能，就选它
- **七件套**：`header`·`nav`·`main`·`article`·`section`·`aside`·`footer` 拼骨架
- **article vs section**：自包含用 `article`，主题分组用 `section`，纯样式盒子用 `div`
- **标题**：用真实级别、别向下跳级、一页一个 `<h1>`
- **红线**：能用原生元素就别贴 `role`；大纲算法**从未实现**，别依赖

</v-click>

---
layout: center
class: text-center
---

# 谢谢

把「这是什么」写进标签，结构、可访问性、SEO 就一起到位了

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
