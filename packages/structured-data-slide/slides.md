---
theme: seriph
background: https://cover.sli.dev
title: 结构化数据完全指南
info: |
  前端结构化数据（Schema.org / JSON-LD）：Rich Results 富媒体结果 · 三种格式 · 核心类型 · Rich Results Test

  Learn more at [https://developers.google.com/search/docs/appearance/structured-data](https://developers.google.com/search/docs/appearance/structured-data)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 结构化数据完全指南

Schema.org · JSON-LD · Rich Results · 三种格式对比

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
结构化数据是 SEO 中让搜索引擎读懂页面语义的标准化标注机制，由 Schema.org 词汇 + 三种格式构成。
-->

---
transition: fade-out
---

# 什么是结构化数据

让搜索引擎「读懂」页面语义的**标准化标注机制**

- **语义层补充**：可见 HTML 描述「页面长什么样」，结构化数据描述「页面是什么意思」
- **官方标准**：Schema.org 由 Google / Microsoft / Yahoo / Yandex 联合维护
- **Rich Snippets 入口**：Markup 是获得 Google 富媒体结果的**必要条件**（非充分）
- **三格式任选**：JSON-LD / Microdata / RDFa
- **JS 动态生成友好**：Googlebot 可读 DOM 渲染后的 JSON-LD
- **CTR 提升实证**：富媒体卡片比纯文本结果视觉权重高

> 结构化数据 ≠ Open Graph / Twitter Card（那是社交分享 meta）。

<!--
强调语义层补充 + Rich Snippets 入口的两个定位。
-->

---

# 三种格式速览

| 格式 | 载体 | 标识属性 | Google 推荐度 |
|------|------|------|------|
| **JSON-LD** | `<script type="application/ld+json">` | `@context` / `@type` / `@id` | **Recommended** |
| **Microdata** | HTML 属性内联 | `itemscope` / `itemtype` / `itemprop` | legacy |
| **RDFa** | HTML 属性内联 | `vocab` / `typeof` / `property` | 支持 |

**判别技巧**

- 看到 `@context` / `@type` → JSON-LD
- 看到 `itemscope` / `itemprop` → Microdata
- 看到 `vocab` / `typeof` / `property` → RDFa

> Google 在三格式中**唯一标记 JSON-LD 为 Recommended**。

<!--
新实现一律 JSON-LD，Microdata 已停止演进。
-->

---
layout: two-cols
---

# JSON-LD 为什么推荐

- **与可见 HTML 分离**：单独 `<script>` 块，不污染页面结构
- **嵌套易表达**：Event → MusicVenue → PostalAddress → Country 树形清晰
- **JS 动态注入**：SPA / SSR / GTM 均可
- **规模化出错少**：模板化输出 JSON 比手写属性内联不易漏字段

**三件套**

- `@context` 固定 `https://schema.org`
- `@type` 指定类型
- `@id` 跨 item 引用

::right::

# 载体位置

**可放 `<head>` 或 `<body>`**

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "入门",
  "author": {
    "@type": "Person",
    "name": "张三"
  }
}
```

> Googlebot 可读 DOM 渲染后的 JSON-LD。

<!--
JSON-LD 与可见 HTML 解耦是它最大的工程优势。
-->

---

# JSON-LD 最小示例（Article）

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "结构化数据入门",
  "image": [
    "https://example.com/img/16x9.jpg",
    "https://example.com/img/4x3.jpg",
    "https://example.com/img/1x1.jpg"
  ],
  "datePublished": "2026-07-22T08:00:00+08:00",
  "dateModified": "2026-07-22T10:00:00+08:00",
  "author": [
    { "@type": "Person", "name": "张三", "url": "https://example.com/a/zhangsan" },
    { "@type": "Person", "name": "李四", "url": "https://example.com/a/lisi" }
  ],
  "publisher": {
    "@type": "Organization",
    "name": "IllegalCreed"
  }
}
```

> 多作者拆数组，不要合并成字符串塞进单个 `author.name`。

<!--
author.name 只写名字，职位用 jobTitle、发布者用 publisher。
-->

---
layout: two-cols
---

# Microdata 对照

把数据「贴」在可见 HTML 上

```html
<div itemscope itemtype="https://schema.org/Article">
  <h1 itemprop="headline">结构化数据入门</h1>
  <time itemprop="datePublished"
        datetime="2026-07-22">2026-07-22</time>
  <span itemprop="author"
        itemscope
        itemtype="https://schema.org/Person">
    <span itemprop="name">张三</span>
  </span>
</div>
```

::right::

# RDFa 对照

```html
<div vocab="https://schema.org/"
     typeof="Article">
  <h1 property="headline">结构化数据入门</h1>
  <time property="datePublished"
        datetime="2026-07-22">2026-07-22</time>
  <span property="author"
        typeof="Person">
    <span property="name">张三</span>
  </span>
</div>
```

> 两者都是 HTML 属性内联，深层嵌套难写、JS 注入麻烦。

<!--
Microdata 是 W3C Note 已停止演进；RDFa 1.1 仍维护但生态采用度低。
-->

---

# Rich Snippets 价值数据

Google 官方案例实证

| 站点 | 提升 |
|------|------|
| **Rotten Tomatoes** | CTR **+25%** |
| **Food Network** | 访问 **+35%** |
| **Nestlé** | CTR **+82%** |
| **Rakuten** | 用户停留 **1.5x** |

**Search Gallery 全目录**（部分）

Article · Breadcrumb · Carousel · Course · Dataset · Event · JobPosting · LocalBusiness · Movie · Organization · Product · ProfilePage · Q&A · Recipe · ReviewSnippet · SoftwareApp · Speakable · Subscription · Video

> 富媒体卡片比纯文本结果视觉权重高，CTR 提升是结构化数据的核心卖点。

<!--
这些是 Google 官方在 Search Central 反复引用的案例数据。
-->

---

# Schema.org 核心类型

| 类型 | 用途 | 关键属性 |
|------|------|------|
| **Organization / LocalBusiness** | 组织 / 实体店 | `name`、`url`、`address`、`geo` |
| **BreadcrumbList** | 面包屑层级 | `itemListElement`（≥2 ListItem） |
| **Article** | 文章（NewsArticle / BlogPosting） | `headline`、`image`、`author[]`、`datePublished` |
| **Product / Offer** | 商品 / 价格（Offer 嵌套） | `name`、`offers`、`price`、`availability` |
| **Event / VideoObject** | 活动 / 视频 | `name`、`startDate`、`uploadDate`、`duration` |

> 每类先查 Search Gallery 的 feature guide 确认「必需 / 推荐」属性。

<!--
schema.org 是全集，Google 只支持子集且各 feature 规则不同。
-->

---
layout: two-cols
---

# BreadcrumbList

**必需**：`itemListElement` 含 **≥2 个 ListItem**

每个 ListItem 必需：

- `item`（URL / `@id`）
- `name`（Text）
- `position`（Integer）

**最佳实践**

- 用**用户典型到达路径**而非镜像 URL
- 不必为顶层域名加 ListItem
- 末项（当前页）可不带 `item`

::right::

# 示例

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "SEO",
      "item": "https://example.com/seo/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "结构化数据"
    }
  ]
}
```

> 至少 2 个 ListItem，末项可不带 item。

<!--
面包屑用用户典型路径而非镜像 URL 结构。
-->

---

# Product 与 Offer

**两类用途**

- **Product snippet**（非可购买页）：强调评论 / 优缺点
- **Merchant listing**（可购买页）：含 price / availability / shipping / returns

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "结构化数据手册",
  "offers": {
    "@type": "Offer",
    "price": "59.90",
    "priceCurrency": "CNY",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "128"
  }
}
```

> 价格经 `offers` → `Offer`，快变价 / 库存优先 SSR 输出。

<!--
Product 这类快速变化的数据，纯客户端 JS 注入会让 Google Shopping 抓取更不可靠。
-->

---
layout: quote
---

# FAQPage / HowTo 已大幅限缩

「2023-08-09 起 FAQ rich result **限缩为权威政府 / 健康站**；HowTo rich result 已于 2023-09-13 **完全弃用**。普通站写了 markup 不报错但基本不显示——属无效投入。」

---
layout: two-cols
---

# @graph 多实体

单个 `<script>` 内组织多个互相引用的实体

- `@graph` 数组，每项是一个实体
- 用 `@id` 标识节点身份
- 用 `@id` 引用建立关联

**适用场景**

- 同页 Organization + WebSite + Article + Breadcrumb
- Recipe + VideoObject 关联

::right::

# 示例（节选）

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#org",
      "name": "IllegalCreed"
    },
    {
      "@type": "Article",
      "@id": "https://example.com/a#article",
      "headline": "结构化数据",
      "publisher": {
        "@id": "https://example.com/#org"
      }
    }
  ]
}
```

> 不用 @id 串联，Google 不知道两 item 关系。

<!--
同页多 item 两种方式：Nesting 或 Individual items + @id。
-->

---

# JS 动态生成 + 校验

**两种动态注入方式**

- **GTM**：Custom HTML 标签 + 变量 `{{recipe_name}}` 从页面抽取
- **自定义 JS**：`createElement('script')` + `setAttribute` + `textContent` + `appendChild`

```js
const script = document.createElement("script");
script.setAttribute("type", "application/ld+json");
script.textContent = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: document.title,
});
document.head.appendChild(script);
```

**校验**：[Rich Results Test](https://search.google.com/test/rich-results) 输 **URL** 非 code（规避 JS/CORS）

> Googlebot 可读 DOM 渲染后的 JSON-LD，SPA 也能用此方式。

<!--
Rich Results Test 必须输 URL，粘贴代码会因 JS/CORS 误报。
-->

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 用 `data-vocabulary.org` 词汇（已 sunset，不产生 rich result）
- 给所有 FAQ / HowTo 页堆 markup（2023-08 起大幅限缩）
- JSON-LD 描述页面上不可见的内容（spammy markup，触发 manual action）
- 同页混用多种格式或重复定义同 item 不用 `@id` 串联
- 多作者合并成字符串塞进单个 `author.name`
- 用 Rich Results Test 的**代码输入**测 JS 动态生成的 JSON-LD
- 假设 markup 通过 = 一定显示富结果（**Google 不保证**）
- 填虚假评分 / 自造 aggregateRating（manual action）
- Product 页用纯客户端 JS 注入价格却不给服务器足够资源

<!--
质量红线：markup 必须如实描述可见内容，违反 manual action 但不影响常规网页排名。
-->

---
layout: center
class: text-center
---

# 小结

结构化数据 = 让搜索引擎读懂页面语义的标注机制

Schema.org · JSON-LD（Recommended）· Rich Results Test

**JSON-LD 优先 · markup 如实可见 · enable ≠ guarantee**

[文档](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) · [Search Gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) · [Rich Results Test](https://search.google.com/test/rich-results)

<!--
掌握 JSON-LD 优先 + 质量红线 + 不保证原则，就能把结构化数据用到生产水准。
-->
