---
theme: seriph
background: https://cover.sli.dev
title: HTML 文档结构与元数据
info: |
  HTML 文档骨架与 head 元数据 —— 编码、视口、SEO、社交、资源提示
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:html-5 class="text-8xl" />
</div>

<br/>

## HTML 文档结构与元数据

看不见、却最先执行的页面基础设施（基于 HTML Living Standard）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
每个页面都从同一套骨架开始，真正决定页面命运的是 head 里那些不可见的元数据。
-->

---
transition: fade-out
---

# 这一章讲什么

`<head>` 里看不见的配置，决定页面的「命运」

<v-click>

- **怎么被解析**：字符编码、渲染模式
- **怎么被收录**：`<title>`、description、robots、canonical
- **怎么被分享**：Open Graph、Twitter Card
- **加载多快**：preload、preconnect、modulepreload

</v-click>

<v-click>

> 配错的代价大多是**隐性的**——乱码、移动端不缩放、分享没缩略图、首屏更慢，且**不报错**。

</v-click>

---

# `<head>` 里只能放 7 类元素

| 元素 | 作用 |
| --- | --- |
| `<meta>` | 编码、视口、SEO、社交、主题色 |
| `<title>` | 文档标题（**唯一**） |
| `<link>` | 样式表、图标、canonical、preload |
| `<style>` | 内联 CSS |
| `<base>` | 相对 URL 基准 |
| `<script>` / `<noscript>` | 脚本 / 无脚本回退 |

<v-click>

放可见元素（`<div>`、`<p>`）进 `<head>`，浏览器会**强制开 `<body>`**，其后 meta 失效。

</v-click>

---

# 文档骨架

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <!-- 元数据 -->
  </head>
  <body>
    <!-- 可见内容 -->
  </body>
</html>
```

- `<!DOCTYPE html>`：触发**标准模式**（不是 HTML 标签）
- `<head>`：元数据容器，不渲染
- `<body>`：用户看到的内容

---

# DOCTYPE 与渲染模式

省略 / 用旧 DOCTYPE → 落入**怪异模式**，复刻上世纪行为

| 模式 | 触发 | `document.compatMode` |
| --- | --- | --- |
| 标准 | `<!DOCTYPE html>` | `"CSS1Compat"` |
| 怪异 | 无 / 无法识别 | `"BackCompat"` |

<v-click>

怪异模式的坑：怪异盒模型（`width` 含 padding）、`height: 100%` 失效、行内图片底部 4px 缝隙。

</v-click>

---

# `<html lang>`：声明语言

```html
<html lang="zh-CN">
```

<v-click>

`lang` 不是「填个 en 应付」，它影响：

- **无障碍**：屏幕阅读器选对发音
- **SEO / 翻译**：判断受众、提示翻译
- **排版**：断词、引号、中日韩字体匹配

</v-click>

<v-click>

```html
<p>有个法语词 <span lang="fr">croissant</span></p>
```

书写方向用 `dir`：`ltr` / `rtl`（阿拉伯语）/ `auto`

</v-click>

---

# 字符编码：第一个 `<meta>`

```html
<meta charset="utf-8" />
```

三条硬规则：

<v-click>

1. **位置**：在 `<head>` 最前、文档**前 1024 字节**内
2. **取值**：HTML5 只认 `utf-8`
3. **写法**：别再用旧式 `http-equiv="Content-Type"`

</v-click>

<v-click>

声明太晚 → 前面字节已被默认编码（`windows-1252`）解析 → 中文乱码

</v-click>

---

# 编码优先级

谁说了算（从高到低）：

<v-click>

1. HTTP 头 `Content-Type: …; charset=utf-8`（**最高**）
2. 文件 BOM
3. `<meta charset>`

</v-click>

<v-click>

::: tip 排查乱码
① 文件存为 UTF-8 → ② 响应头 charset → ③ meta 够靠前。生产最稳：让服务器发对的头。
:::

</v-click>

---

# 视口：移动端的地基

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

<v-click>

不写它 → 移动浏览器假装有 ~980px 宽，再把整页缩小 → 响应式全失效、字小到看不清

</v-click>

<v-click>

- `width=device-width`：布局视口 = 设备宽度
- `initial-scale=1`：初始缩放 1

</v-click>

---

# viewport 取值

| 取值 | 含义 |
| --- | --- |
| `width` | 视口宽度（常用 `device-width`） |
| `initial-scale` | 初始缩放 |
| `user-scalable` | 是否允许缩放 |
| `viewport-fit` | 刘海屏：`auto`/`contain`/`cover` |
| `interactive-widget` | 虚拟键盘行为 |

<v-click>

::: warning 无障碍红线
别用 `user-scalable=no` / `maximum-scale=1` 禁止缩放——低视力用户放不大。
:::

</v-click>

---

# 刘海屏适配

```html
<meta name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

<v-click>

`viewport-fit=cover` 铺满物理屏，再用 CSS `env()` 留安全边距：

```css
.header {
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
}
```

</v-click>

---

# `<title>`：页面的名字

```html
<title>页面主题 · 站点名</title>
```

- 出现在标签页、收藏、搜索结果、分享卡片
- **每页唯一**，最重要的词放前面
- 搜索结果约 60 字符后截断
- 别堆砌关键词

---

# description 与 keywords

```html
<meta name="description" content="约 150 字的页面摘要。" />
```

<v-click>

- description **不参与排名**，但常作搜索摘要 → 影响点击率
- 不写：搜索引擎自己截一段，往往更差

</v-click>

<v-click>

- `keywords`：早被主流引擎**忽略**，不必写

</v-click>

---

# robots：爬虫指令

```html
<meta name="robots" content="noindex, nofollow" />
```

| 取值 | 含义 |
| --- | --- |
| `index` / `noindex` | 是否收录本页 |
| `follow` / `nofollow` | 是否跟随链接 |
| `nosnippet` / `noarchive` | 不要摘要 / 快照 |

<v-click>

⚠️ `noindex` 要生效，别同时在 `robots.txt` 里 `Disallow`——爬不到就读不到这条。

</v-click>

---

# canonical：规范 URL

```html
<link rel="canonical" href="https://example.com/article" />
```

<v-click>

同一内容多个 URL（`?utm_*`、`www`、尾斜杠）→ 告诉搜索引擎「哪个是权威版」，集中排名信号、防重复内容。

</v-click>

<v-click>

务必用**绝对 URL**。

</v-click>

---

# 暗色：theme-color

```html
<meta name="theme-color" content="#fff"
  media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#0d1117"
  media="(prefers-color-scheme: dark)" />
```

- 给移动地址栏 / PWA 标题栏上色
- 可用 `media` 分亮暗
- **渐进增强**：移动 + Safari 15+ 支持，桌面 Firefox 忽略

---

# 暗色：color-scheme

```html
<meta name="color-scheme" content="light dark" />
```

<v-click>

- 让**默认 UI**（表单、滚动条、根背景）跟随明暗
- 已广泛可用（Baseline）

</v-click>

<v-click>

::: tip 配色双保险
`color-scheme` 管浏览器自带 UI；页面自身配色仍靠 CSS `prefers-color-scheme`。两者配合，暗色才完整。
:::

</v-click>

---
layout: section
---

# 社交分享元数据

链接贴出去，长什么样？

---

# 为什么需要社交标签

HTML 没有「分享预览」元素。社交平台靠**自己的爬虫**抓 `<head>` 里约定好的 meta，拼出预览卡。

<v-click>

不写 → 分享出去就是一条干巴巴的纯链接。

两套约定：**Open Graph**（微信 / LinkedIn / Slack / Discord 都认）+ **Twitter / X Card**。

</v-click>

---

# Open Graph 四件套

用 `property`（不是 `name`）：

```html
<meta property="og:title" content="标题" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://ex.com/og.png" />
<meta property="og:url" content="https://ex.com/page" />
```

| 属性 | 含义 |
| --- | --- |
| `og:title` / `og:url` | 标题 / 规范 URL |
| `og:type` | 类型（`website` / `article`） |
| `og:image` | 预览图（**绝对 URL**） |

---

# og:image 的讲究

```html
<meta property="og:image" content="https://ex.com/og.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="封面替代文本" />
```

- **绝对 URL**、带 `https://`
- 推荐 **1200×630**（1.91:1）
- 给宽高 → 平台先占位、少抖动
- 别忘 `alt`：社交卡片也要无障碍

---

# og:type 与扩展

```html
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2026-06-24" />
<meta property="article:author" content="..." />
```

| `og:type` | 扩展属性 |
| --- | --- |
| `website` | 仅基础四件套 |
| `article` | `published_time`、`author`、`section` |
| `profile` | `first_name`、`username` |

---

# Twitter / X Card

用 `name="twitter:*"`：

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@yoursite" />
```

| `twitter:card` | 效果 |
| --- | --- |
| `summary` | 小图卡 |
| `summary_large_image` | 大图卡（最常用） |
| `player` / `app` | 播放器 / 应用卡 |

---

# Twitter 会回退读 OG

::: tip 通常只写一行 `twitter:card`
缺 `twitter:title` / `description` / `image` 时，X 会**回退读对应的 Open Graph 标签**。
:::

<v-click>

所以写好 Open Graph 后，Twitter 这边往往**只需补 `twitter:card`** 指定样式，不必整套重复。

</v-click>

---

# 调试：改了不生效？

社交平台会**缓存**抓取结果，改完不会立刻更新。用官方调试器强制重抓：

<v-click>

- **Facebook / 通用**：Sharing Debugger
- **LinkedIn**：Post Inspector
- **通用预览**：opengraph.xyz 等第三方

</v-click>

<v-click>

⚠️ 旧的 `cards-dev.twitter.com/validator` 已下线——把 OG 写规范，X 卡片基本能正确回退。

</v-click>

---
layout: section
---

# `<link>` 与资源提示

`<head>` 里最忙的元素

---

# `<link>`：靠 rel 表达关系

```html
<link rel="stylesheet" href="/css/main.css" />
```

| 属性 | 用途 |
| --- | --- |
| `rel` | 关系类型（**必需**） |
| `href` | 资源 URL |
| `as` | 资源类型（preload 必需） |
| `media` | 条件加载 |
| `crossorigin` | CORS 模式 |

---

# 样式表与 media

```html
<link rel="stylesheet" href="print.css" media="print" />
<link rel="stylesheet" href="dark.css"
  media="(prefers-color-scheme: dark)" />
```

<v-click>

放 `<head>` 的样式表**阻塞渲染**（避免无样式闪烁 FOUC）。

非阻塞加载非关键 CSS 的经典技巧：

```html
<link rel="stylesheet" href="extra.css"
  media="print" onload="this.media='all'" />
```

</v-click>

---

# 图标 icon

```html
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

<v-click>

现代极简组合：

- `favicon.ico`（老浏览器回退）
- `favicon.svg`（矢量、自适应明暗）
- 180×180 `apple-touch-icon`（iOS 主屏）

</v-click>

---

# 文档关系与 manifest

```html
<link rel="alternate" hreflang="en" href="https://ex.com/en/" />
<link rel="alternate" type="application/rss+xml" href="/feed.xml" />
<link rel="manifest" href="/site.webmanifest" />
```

- `alternate`：多语言（`hreflang`）/ RSS / 备用样式
- `author` / `license` / `me` / `search`：元信息 / 身份
- `manifest`：PWA 应用级元数据（name、icons、theme_color…）

---

# 五种资源提示

| 方式 | 时机 | 优先级 | 用途 |
| --- | --- | --- | --- |
| `preload` | 立即 | 高 | 当前页关键资源 |
| `preconnect` | 立即 | 高 | 提前连第三方源 |
| `dns-prefetch` | 立即 | 低 | 仅 DNS 解析 |
| `prefetch` | 空闲 | 低 | 下一页资源 |
| `modulepreload` | 立即 | 中高 | ES 模块图 |

---

# preload：抢跑关键资源

```html
<link rel="preload" href="/fonts/inter.woff2"
  as="font" type="font/woff2" crossorigin />
```

两条硬规则：

<v-click>

1. **必须带 `as`**：否则可能下载两次或被丢弃
2. **字体必须 `crossorigin`**：否则预加载的字体不被复用

</v-click>

<v-click>

⚠️ 别 preload 用不到的东西——浪费带宽 + 控制台告警。

</v-click>

---

# preconnect / prefetch / modulepreload

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="prefetch" href="/next-page.html" />
<link rel="modulepreload" href="/js/app.js" />
```

- `preconnect`：提前 DNS + TCP + TLS 握手（连第三方源）
- `prefetch`：赌下一跳，空闲低优先级取
- `modulepreload`：预取 + 预解析 ES 模块依赖（Baseline）

---

# 现代：fetchpriority 与 Speculation Rules

```html
<link rel="preload" href="/hero.jpg" as="image" fetchpriority="high" />
```

<v-click>

- `fetchpriority`：`high` / `low` 微调优先级（Baseline 新近，2024）

</v-click>

<v-click>

```html
<script type="speculationrules">
{ "prerender": [{ "where": { "href_matches": "/*" } }] }
</script>
```

整页预渲染，点击秒开。⚠️ **非 Baseline，仅 Chromium**——纯渐进增强，必须能降级。

</v-click>

---

# 最佳实践小结

<v-click>

- `<!DOCTYPE html>` + `<html lang>` + `charset` + `viewport` 是四件套地基
- 顺序：`charset` → `viewport` → `title` → 其余 meta → CSS / preload
- 社交：OG 四件套 + 一张 1200×630 图 + 一行 `twitter:card`
- 资源提示用在刀刃上：`preload` 带 `as`、字体 `crossorigin`
- 无障碍红线：别禁缩放、别 `http-equiv="refresh"`

</v-click>

---
layout: center
class: text-center
---

# 谢谢

把 `<head>` 写对，页面在浏览器、搜索引擎、社交平台的「第一印象」就稳了

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
