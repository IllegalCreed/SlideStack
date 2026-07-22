---
theme: seriph
background: https://cover.sli.dev
title: 技术 SEO 完全指南
info: |
  前端技术 SEO 完全指南：crawl→render→index · robots/canonical/hreflang · CWV 信号

  Learn more at [https://developers.google.com/search/docs](https://developers.google.com/search/docs)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 技术 SEO 完全指南

让搜索引擎 / AI 爬虫能正确**发现 · 渲染 · 索引 · 理解**你的站点

<div class="pt-12">
  <span class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right />
  </span>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
技术 SEO 修路架桥，让内容能被收录、被理解、被排名。
-->

---
transition: fade-out
---

# 什么是技术 SEO

针对搜索引擎与 AI 爬虫的**工程性配置**——不写关键词，而是修路架桥

- **能不能进得来**：robots.txt / 抓取速度 / 服务器稳定
- **能不能看得见**：SSR / SSG / prerender / 不依赖用户交互
- **能不能读得懂**：canonical / hreflang / URL 规范 / 结构化数据
- **能不能收得下**：sitemap / 重定向链 / 防 soft 404 / 移动优先对等

> 技术 SEO 决定「能不能进索引」，是所有内容 / 外链优化的**前置条件**。

<!--
技术不过关，再好的内容也收不进来。
-->

---

# Google 三阶段：crawl → render → index

依赖 JS 的页面，Google 分三步处理

- **1. Crawl**：抓取**初始 HTML**（不执行 JS），沿 `<a href>` 发现新 URL
- **2. Render**：WRS（Web Rendering Service）用 **evergreen Chromium** 执行 JS
  - 渲染队列**单独排队**，可能延迟**数秒到数天甚至更久**
  - **非 200 状态码**可能直接**跳过渲染**
  - WRS 可能**忽略缓存头**，用过期 JS / CSS
- **3. Index**：把渲染后内容纳入索引，参与排名

> SSR / SSG 让 crawl 阶段就拿到完整内容，**绕开渲染队列延迟**——这是「服务器渲染利于 SEO」的根本原因。

<!--
渲染失败 = 内容对 Google 不可见。
-->

---

# 渲染模式选择

按对爬虫友好度排序

- **SSR / SSG / prerender**（首选）：crawl 阶段直接拿到完整 HTML ✓
- **动态渲染**（workaround）：中间层按 UA 区分，爬虫拿预渲染，用户拿 CSR
- **纯 CSR**（不推荐）：进渲染队列、可能延迟、可能渲染失败

**官方对动态渲染的定位**

- 文档已改用**过去式**（was a workaround）
- 明确是**过渡而非推荐方案**
- 推荐迁向 SSR / SSG / hydration

> 不要把动态渲染当作长期方案，增加运维复杂度与资源开销。

<!--
动态渲染不是 cloaking，前提是内容相似——见下页。
-->

---

# 动态渲染 ≠ cloaking

| 行为 | 判定 |
|------|------|
| 返回**内容相似**的页面（爬虫拿预渲染 HTML，用户拿 CSR） | **非 cloaking** ✓ |
| 返回**完全不同**内容（猫页给用户、狗页给爬虫） | **cloaking** ✗ |

- cloaking 违反 Google **垃圾政策**，会被惩罚
- 动态渲染的核心是「**同一内容，不同呈现**」，而非「不同内容」
- 何时仍用动态渲染：大型复杂 SPA 短期无法重构 SSR 的过渡

> 判别准则：用户和爬虫看到的核心内容**是否一致**。

<!--
cloaking 是给爬虫看 A、给用户看 B，技术 SEO 严格禁止。
-->

---

# robots.txt vs robots meta

最易混的一对，必须分清

| 维度 | robots.txt | robots meta / X-Robots-Tag |
|------|------|------|
| **作用** | 控制 **crawl**（抓不抓） | 控制 **index**（收不收） |
| **位置** | 站点根 `/robots.txt` | HTML `<head>` 或 HTTP 头 |
| **Noindex 支持** | **Google 自 2019 不再支持** | 完全支持 |

**误用陷阱**

- robots.txt `Disallow` 封锁想 noindex 的页面 → 爬虫不抓 → meta 没被发现 → 页面仍可能因外链被索引

> 想让 Google 别**抓** → robots.txt；想让 Google 别**收** → `<meta name=robots content=noindex>`。

<!--
这是技术 SEO 最经典的坑：用 robots.txt 阻止 indexing 做不到。
-->

---

# robots meta / X-Robots-Tag 指令值

控制 indexing 的指令（HTML meta 或 HTTP 头，取**最严格值**）

| 指令 | 含义 |
|------|------|
| `noindex` / `nofollow` | 不进索引 / 不跟踪该页链接 |
| `nosnippet` / `noarchive` / `noimageindex` | 不显示片段·视频预览 / 快照 / 不索引图片 |
| `unavailable_after:` / `max-snippet:` | 指定时间后不再索引 / 片段最大字符数 |

**X-Robots-Tag 适用非 HTML**：PDF / 图片 / 视频（robots meta 只作用 HTML），可按 UA 精细控制：`X-Robots-Tag: googlebot: noindex`

> `data-nosnippet`：HTML 布尔属性，仅限 `<div> / <span> / <section>`，元素级禁止用于片段。

<!--
X-Robots-Tag 对 PDF 等非 HTML 资源特别有用。
-->

---

# canonical：合并重复 URL

Google 综合约 **40 个信号**判定 canonical URL

**主要信号**

- `<link rel="canonical" href="绝对URL">`（head 内，**最强信号**）
- sitemap 中列出的 URL
- 301 永久重定向
- 内链一致性

**最佳实践**

- **写在 HTML head**，不要用 JS 注入
- 全页**只有一个 canonical**
- 指向**绝对 URL**且可访问
- 与 sitemap / 内链 / 重定向保持一致

> 反模式：JS 把 canonical 改成与原 HTML 不同的值，或注入多个 `<link rel=canonical>` → 冲突 → Google 选出意外 canonical。

<!--
canonical 写在 HTML head 是最稳的，JS 注入有渲染时机风险。
-->

---

# 重定向可靠性梯度

Google 官方给出的可靠性排序

| 类型 | 状态码 | canonical 信号 | 可靠性 |
|------|------|------|------|
| **永久** | **301 / 308** | **传** | **最高** |
| 临时 | 302 / 303 / 307 | 不传 | 高 |
| meta refresh | `<meta http-equiv="refresh">` | 0s=永久 / >0s=临时 | 中 |
| JS location | `window.location` | 不传 | 低（渲染失败即失效） |
| crypto | JS 加密跳转 | 不传 | 极低 |

> 反模式：永久迁移 / 换域名却用 **302** → 不传 canonical → 新旧 URL 都进索引 → 重复内容与权重分裂。

<!--
永久迁移一律 301/308，临时才用 302/307。
-->

---

# hreflang：多语言变体

三种等价实现（必须**双向链接 + 含自身 + x-default**）

- **HTML link**：`<link rel="alternate" hreflang="en" href="...">`
- **HTTP Link 头**：`Link: <url>; rel="alternate"; hreflang="en"`
- **XML sitemap**：`<xhtml:link rel="alternate" hreflang="..." href="...">`

**编码规则**

- 语言码 **ISO 639-1**（在前）+ 区域码 **ISO 3166-1 Alpha 2**（在后）
- 脚本码 **ISO 15924**：`zh-Hant / zh-Hans`

> `be` = **白俄罗斯语**（不是比利时）！比利时须用 `nl-be / fr-be / de-be`。

<!--
hreflang 缺反向链接 = 整个注解被忽略。
-->

---

layout: two-cols
---

# URL 结构规范

- 用**连字符**分词（非下划线）
  - `/black-pink-shoes` ✓
  - `/black_pink_shoes` ✗
- **大小写敏感**
  - `/Apple` ≠ `/apple` → 分裂权重
  - 统一**小写**
- **History API** 替代 fragment
  - `/products/123` ✓
  - `/#/products/123` ✗

::right::

# 移动优先索引

- **2021-03 起对新站默认启用**
- 移动版即**索引来源**
- 与桌面版**内容 / meta / 结构化数据 / 图片 alt 全对等**
- 移动版**不能加 noindex**
- 主要内容**不能依赖用户交互**才懒加载
- 推荐**响应式设计**

> 动态服务须配 `Vary: User-Agent` 响应头。

<!--
移动版内容缺失直接掉排名。
-->

---

# Core Web Vitals 作为 SEO 信号

Google **page experience** 体系的排名**信号之一**（非决定性）

| 指标 | 含义 | Good | Poor |
|------|------|------|------|
| **LCP** | 最大内容绘制（加载） | ≤ **2.5s** | > 4s |
| **INP** | 交互到下次绘制 | ≤ **200ms** | > 500ms |
| **CLS** | 累计布局偏移（分数） | ≤ **0.1** | > 0.25 |

- **INP 于 2024-03 正式替代 FID**——任何仍引用 FID 的资料已过时
- field 数据用 `web-vitals` 库（`onLCP / onINP / onCLS`）
- 底层优化机制归【性能优化】章，本页只讲 SEO 信号

> CWV 是信号之一，不是银弹——精调到极致不做内容 / 外链，排名不会突飞猛进。

<!--
FID 已下线，现在三指标是 LCP / INP / CLS。
-->

---

# sitemap + SPA soft 404

**sitemap 协议限制**

- 单文件 ≤ **50000 URLs** / **50MB**（未压缩）
- 超限用 **sitemap index**（≤ 50000 子 sitemap）
- robots.txt 用 `Sitemap:` 指令宣告位置

**SPA 防 soft 404**

SPA 客户端路由无法返回真实 HTTP 状态码，需：

- **方案 1（推荐）**：API 判定不存在时 **JS 跳服务端真实 404**
- **方案 2**：API 判定不存在时 **动态注入 `<meta name=robots content=noindex>`**

> sitemap 是提示而非命令；soft 404 会拖累整站质量评估。

<!--
SPA 必须主动处理 soft 404，否则 Google 会误判。
-->

---

# llms.txt：AI 爬虫时代

为 AI Overviews / ChatGPT / Claude 等 AI 爬虫提供**结构化站点概览**

- **`/llms.txt`**：站点 Markdown 概览（标题 / 简介 / 关键链接）
- **`/llms-full.txt`**：全量 Markdown 内容
- 规范来源：[llmstxt.org](https://llmstxt.org/)
- 当前约 **v1.7.0**，**新兴提案标准**
- **补充而非替代** robots.txt / sitemap
- 主流 AI 厂商支持仍在演进

> 适用场景：文档站 / 知识库 / 内容站希望被 AI 搜索正确引用 / 概述。

<!--
llms.txt 是 AI 时代的「sitemap」，但还在演进。
-->

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 把**动态渲染**当作长期方案（已过去式定位）
- JS 注入 canonical 与原 HTML 不同 / 多个 canonical
- SPA 用 `#/page` **fragment 路由**加载不同内容
- 在 robots.txt 写 `Noindex:` 指令（**Google 不支持**）
- 永久迁移用 **302** → 不传 canonical 信号
- hreflang 缺反向链接，或 `be` 当比利时
- 移动版加 **noindex** 或内容比桌面少
- URL 混用**大小写**或用**下划线**连词
- 主要内容放在需**用户交互**才加载的懒加载里
- noindex 页面又指望 JS 运行时**移除 noindex**

<!--
noindex 一旦放进初始 HTML，Google 可能直接跳过渲染与 JS 执行。
-->

---
layout: center
class: text-center
---

# 小结

技术 SEO = 让爬虫**进得来 · 看得见 · 读得懂 · 收得下**

crawl → render → index · robots/canonical/hreflang · CWV 信号

**SSR 优先 · robots 分工 · canonical 一致 · hreflang 双向**

[Search Central](https://developers.google.com/search/docs) · [sitemaps.org](https://www.sitemaps.org/protocol.html) · [web.dev/vitals](https://web.dev/articles/vitals) · [llmstxt.org](https://llmstxt.org/)

<!--
掌握三阶段 + robots 分工 + canonical/hreflang 一致，就能把技术 SEO 用到生产水准。
-->
