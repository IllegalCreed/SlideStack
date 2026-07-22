---
theme: seriph
background: https://cover.sli.dev
title: 页面 SEO 完全指南
info: |
  页面 SEO（On-page SEO）完全指南：title / meta description / heading / URL slug / image alt / Open Graph / Twitter Card

  基于 Google Search Central + Open Graph 协议（ogp.me）官方文档
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 页面 SEO 完全指南

站内可控的搜索引擎优化 · 三支柱 · 官方最佳实践

<div class="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-2xl font-bold mt-8">
  On-page SEO · Google Search Central · Open Graph
</div>

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
页面 SEO 是站内完全可控的优化对象，本章聚焦 HTML 元数据与内容语义。
-->

---

# 什么是页面 SEO

**在站点自身可控范围内**对单个网页进行的搜索引擎优化

- **站内完全可控**：所有元素都在 HTML / 模板层，不依赖外链 / 第三方
- **开发者友好**：可被 lint / CI 自动校验
- **多目标协同**：同一套元数据服务 SERP、CTR、社交分享、a11y

> 页面 SEO ≠ 整体 SEO。它是开发者最直接的抓手，但 Google 排名还包含技术 SEO、内容质量、外链、Core Web Vitals。

---

# 三支柱

| 支柱 | 关注点 | 核心元素 |
|------|------|------|
| **内容语义** | 主题与搜索意图匹配 | `<title>`、`<meta description>`、`<h1>`–`<h6>`、关键词 |
| **HTML 结构** | 抓取与解析 | URL slug、`<img alt>`、内链锚文本、`rel="canonical"` |
| **社交分享** | 社交平台可控预览 | Open Graph、Twitter Card |

三支柱不是排名因素的分层，而是**优化对象的组织方式**

---

# 一、title 标签

每页唯一、主关键词前置、经验值 50–60 字符

::right::

**Google 生成 title link 会综合**：

- 页面 `<title>`（首选）
- 第一个可见 `<h1>`
- `<meta property="og:title">`
- 指向该页的**锚文本**
- WebSite 结构化数据

**Google 会改写不佳 title**：半空 / 过时 / 不准确 / 模板化 / 无明确主标题

> Google **无字符硬上限**，按设备宽度截断；50–60 字符是行业 CTR 经验

---

# 二、meta description

经验值 150–160 字符，每页唯一

**Google 官方四条最佳实践**：

- 每页**唯一**
- **包含关键信息**（价格 / 作者 / 日期 / 卖点）
- 可程序化生成**高质量描述**
- **避免关键词列表**（几乎不被采用）

> Google 主要用页面内容生成 snippet，仅在 meta description 更准确时采用。把它当「SERP 上的广告文案」。

---

# 三、heading 层级

第一个可见 `<h1>` 是主标题，每页**唯一 H1**

::right::

**规则**：

- 用 `<h2>`–`<h6>` 组织层级
- 不跳级（`<h1>` 直接到 `<h3>` 是反模式）
- heading 文本要描述性

**官方态度**：严格 H1–H6 层级**非关键排名因素**，但利于 a11y 与内容理解

**反模式**：多个视觉权重相同的 `<h1>` 让 Google 困惑

---

# 四、关键词策略与搜索意图

**搜索意图四分类**

| 意图 | 用户在找什么 | 典型查询 |
|------|------|------|
| **informational** | 学习 / 了解 | `什么是页面 SEO` |
| **navigational** | 找特定站点 | `moz seo guide` |
| **commercial** | 比较选项 | `best seo tools 2026` |
| **transactional** | 准备交易 | `buy ahrefs` |

> 「LSI 关键词」已被 Google John Mueller **公开否认**——Google 不使用 LSI 技术。正确做法是**自然覆盖语义相关词**。

---

# 五、URL slug

用**连字符 `-`** 分词，非下划线 `_`

- **描述性**：从 URL 就能猜到内容
- **简短**：冗长 ID 浪费抓取预算
- **含目标关键词**：但不堆砌
- **统一大小写**：Google 视 URL 为**大小写敏感**（`/APPLE` ≠ `/apple`）
- **用 `rel="canonical"` 合并重复**

> 官方理由：下划线 `_` 在编程语言里表「不可分概念」，连字符 `-` 帮助识别概念边界。

---

# 六、内部链接与锚文本

描述性锚文本（约 2–5 词），避免「点击这里」

::right::

**最佳实践**：

- 锚文本概括目标页主题
- 重要页面 2–3 次点击内可达
- 用普通 `<a href>`，不用 JS onclick

**反模式**：

```html
<a href="/x/">点击这里</a>
<a href="/x/">了解更多</a>
```

**好**：

```html
<a href="/x/">meta description 最佳实践</a>
```

---

# 七、image alt 与图片 SEO

Google 称 alt 是**图片最重要的元数据**

::right::

**规则**：

- 内容图：描述性 alt + 结合上下文
- 装饰图：空 `alt=""`
- 内容图用 `<img src>`，**不用 CSS `background-image`**
- 提供 `width` / `height` 避免 CLS
- 文件名描述性

> Google **明确不索引 CSS `background-image`**。内容图必须用 `<img>` 或 `<picture>` + `srcset`。

---

# 八、Open Graph 协议

控制 Facebook / LinkedIn / WhatsApp 预览（ogp.me）

```html
<meta property="og:title" content="页面 SEO 完全指南">
<meta property="og:type" content="article">
<meta property="og:image" content="https://example.com/og/x.png">
<meta property="og:url" content="https://example.com/zh/seo/on-page-seo/">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="三支柱示意图">
```

四个**必需属性**：`og:title` / `og:type` / `og:image` / `og:url`

推荐图：**1200×630（1.91:1）**，≤5MB

---

# 九、Twitter Card（X Card）

控制 X 平台预览（docs.x.com）

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="页面 SEO 完全指南">
<meta name="twitter:description" content="title / meta / heading / OG 最佳实践">
<meta name="twitter:image" content="https://example.com/og/x.png">
<meta name="twitter:image:alt" content="三支柱示意图">
```

- 卡类型：`summary`（小图）/ `summary_large_image`（大图）
- `summary_large_image` 图规格：约 **1200×628**，2:1，≤5MB

> Card Validator 已失效，但 `twitter:*` 标签仍是事实标准

---

# 反模式（避坑）

- **关键词堆砌**：title / alt / meta 中重复塞满关键词变体
- **模板化 title**：全站复用或仅微小差异
- **meta description 写成关键词列表**：几乎不被采用
- **URL 用下划线**：`summer_clothing` 不符合官方连字符推荐
- **CSS `background-image` 展示内容图**：Google 不索引
- **robots.txt 阻止爬取以为能阻止索引**：要用 `noindex`
- **锚文本写「点击这里」**：浪费内链语义价值
- **多个视觉权重相同的 `<h1>`**：Google 不清楚哪个是主标题
- **误把 title 50–60 字符当硬性排名规则**：Google 无硬上限
- **盲目堆砌「LSI 关键词」**：Google 已否认使用 LSI

---

# 速查总结

| 元素 | 经验值 | 官方硬上限 | 关键约束 |
|------|------|------|------|
| `<title>` | 50–60 字符 | **无** | 每页唯一、关键词前置 |
| `<meta description>` | 150–160 字符 | **无** | 每页唯一、自然句子 |
| `<h1>` | 不限 | 不限 | **每页唯一**（主标题） |
| URL slug | 简短 | 无 | 连字符 `-`、统一大小写 |
| `alt` | 描述性 | 无 | 装饰图空 `alt=""` |
| `og:image` | 1200×630 | 无 | 提供 width / height / alt |

> 完整指南见笔记 `/zh/frontend-develop-tools/optimization/seo/on-page-seo/`
