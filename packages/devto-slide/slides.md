---
theme: seriph
background: https://cover.sli.dev
title: dev.to 完全指南
info: |
  dev.to 完全指南：免费开源 · Forem · Liquid 标签 · 标签优化 · 跨平台分发

  Learn more at [https://dev.to](https://dev.to)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## dev.to 指南

免费开源开发者社区 · Forem · 450 万开发者

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
dev.to 是免费开源的英文开发者社区，2026 被 MLH 收购。
-->

---
transition: fade-out
---

# dev.to 是什么

完全免费、完全开源的英文开发者社区

- **免费 + 开源**：无付费墙、无分成、无广告骚扰
- **Forem 开源**：基于 Ruby on Rails，可自托管
- **开发者原生**：Markdown + Liquid 标签 + 代码高亮
- **450 万开发者**：英文技术内容曝光第一梯队
- **2026-02-18**：被 MLH（Major League Hacking）收购

> 与 Medium（付费墙闭源）形成鲜明对照

<!--
dev.to = 免费 + 开源（Forem）+ 开发者原生。
-->

---

# 平台对比

| 维度 | dev.to | Medium | Stack Overflow |
|---|---|---|---|
| 定位 | 免费开源社区 | 付费墙长文 | 开发者问答 |
| 开源 | Forem 开源 | 闭源 | 闭源 |
| 收入 | 无直接分成 | 阅读时长分成 | 声誉 |
| 内容 | 文章 + 讨论 | 长文 | 问答 |

> 技术教程、行业讨论、个人品牌建设的首选

<!--
想直接变现请用 Medium / Substack。
-->

---
layout: two-cols
---

# 写第一篇文章

Create Post → Markdown 编辑器

**frontmatter 字段**

- `title` 标题
- `published` true/false
- `tags` 最多 4 个
- `cover_image` 封面图
- `canonical_url` 跨平台首发声明
- `series` 归入系列

::right::

# Liquid 标签嵌入

```liquid
{% codepen https://codepen.io/u/pen/x %}
{% github user/repo %}
{% glitch xxx %}
{% youtube VIDEO_ID %}
{% twitter STATUS_ID %}
```

> canonical_url 是跨平台分发的标准做法

<!--
跨平台首发必设 canonical_url 指向原文。
-->

---

# 标签优化

标签是 dev.to 主要分发机制（最多 4 个）

**选择原则**

1. 大标签带流量：#webdev #javascript
2. 小标签带精准：#react #vue #devops
3. 功能标签带场景：#tutorial #discuss
4. 不堆砌：无关标签会被算法降权

| 文章类型 | 标签示例 |
|---|---|
| React 教程 | #react #javascript #tutorial |
| 新项目展示 | #showdev #opensource #webdev |

> 4 个标签组合「大 + 小 + 功能」

<!--
标签是 dev.to 分发的核心信号。
-->

---

# 社区互动

dev.to 以友好的社区氛围著称

- **反应表情**：❤️🦄🔥🤯，**无踩按钮**
- **评论**：支持 Markdown + 代码块
- **#discuss**：引发深度讨论的标签
- **#help**：求助标签，社区乐于回答
- **#showdev**：展示自己做的项目
- **Code of Conduct**：严格的社区准则

> 反应数是 dev.to 主要的互动指标

<!--
无踩按钮 + CoC 让社区对新手友好。
-->

---
layout: two-cols
---

# 跨平台分发

dev.to 是多平台分发的核心一环

```text
个人博客（首发 canonical 源）
  ↓ 同步
dev.to（开放吃英文搜索）
Hashnode（开发者博客）
  ↓ 同步（可付费墙）
Medium（吃分成）
  ↓ 引流
Twitter / X / LinkedIn
```

::right::

# Forem 自托管

dev.to 背后是开源 Forem，可自托管

```bash
git clone https://github.com/forem/forem.git
cd forem
bin/setup      # Ruby 3.x + Rails 7.x
bin/startup    # 启动开发服务器
```

技术栈：Rails + PostgreSQL + Preact + Redis

> 适用：企业内部社区 / 垂直技术社区

<!--
Forem 让你完全掌控自己的开发者社区。
-->

---

# MLH 收购（2026-02-18）

Major League Hacking 收购 dev.to / Forem

**对写作者**

- MLH 黑客马拉松生态导入学生开发者
- 可能强化 #hackathon #students 标签
- 暂未引入付费墙

**对 Forem 开源**

- 官方承诺继续独立开源
- 维护节奏需观察
- 可能通过 Forem Cloud 变现

> MLH CEO：AI 时代在线开发者社区依然重要

<!--
2026 MLH 收购后战略方向需观察。
-->

---

# 创作策略

适合 dev.to 的内容

| 内容类型 | 适合度 | 原因 |
|---|---|---|
| 入门到进阶教程 | ★★★★★ | 开放访问，搜索流量大 |
| 「我做了个 X」#showdev | ★★★★★ | 社区氛围鼓励分享 |
| 框架 / 库对比 | ★★★★ | 开发者关心选型 |
| 行业讨论 #discuss | ★★★★ | 引发互动 |

**不适合**：纯 AI 水文、付费墙预告、离技术太远的个人生活

> 目标是品牌曝光与引流，非直接变现

<!--
免费思维：不分成，靠引流间接变现。
-->

---

# Forem 自托管实战

dev.to 背后是开源 Forem，可自托管

**适用场景**

- 企业内部开发者社区
- 产品用户社区（框架 / SaaS）
- 垂直技术社区（某语言专精）
- 教育社区（编程训练营）

**技术栈**：Rails 7 + PostgreSQL + Preact + Redis + Elasticsearch

**部署方式**

- Forem Cloud（forem.com，免运维）
- 自托管 Docker（完全掌控）
- 本地开发（bin/setup + bin/startup）

> 2026 MLH 收购后 Forem 承诺继续独立开源

<!--
Forem 让企业搭建自己的开发者社区。
-->

---
layout: quote
---

# dev.to 第一性原理

「免费 + 开源 + 开发者原生——把托管、代码友好编辑器、分发、450 万开发者流量打包成免费服务，用开源 + 赞助维持。」

---

# 平台选择

| 需求 | 推荐 |
|---|---|
| 英文技术教程免费分发 | **dev.to** |
| 英文长文变现 | Medium |
| 自托管开发者社区 | **Forem** |
| 程序员问答 | Stack Overflow |
| 中文技术文章 | 掘金 |

> dev.to 不分成，目标是品牌曝光与引流

<!--
dev.to 是免费思维，靠引流间接变现。
-->

---
layout: center
class: text-center
---

# 小结

dev.to = 免费 + 开源（Forem）+ 开发者原生

**Liquid 标签 · canonical 分发 · 标签优化 · MLH 加持**

[dev.to](https://dev.to) · [Forem 文档](https://developers.forem.com) · [GitHub](https://github.com/forem/forem)

<!--
dev.to 是英文技术写作者建立品牌的首选。
-->
