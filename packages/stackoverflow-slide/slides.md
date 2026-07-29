---
theme: seriph
background: https://cover.sli.dev
title: Stack Overflow 完全指南
info: |
  Stack Overflow 完全指南：问答 · 声誉系统 · 徽章 · Collectives · AI 时代的协作

  Learn more at [https://stackoverflow.com](https://stackoverflow.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Stack Overflow 指南

程序员问答社区 · 声誉系统 · 徽章 · AI 协作

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Stack Overflow 是全球最大的程序员问答社区。
-->

---
transition: fade-out
---

# Stack Overflow 是什么

Atwood 与 Spolsky 2008 创办的程序员问答社区

- **问答为核心**：提问、回答、采纳形成知识库
- **声誉系统**：被赞 +10，被采纳 +15，游戏化激励
- **徽章体系**：Bronze / Silver / Gold 三级
- **严格治理**：对题、复现、最小示例规范
- **Collectives**：厂商赞助的技术栈子社区

> 全球最大编程知识库，AI 工具训练数据核心来源

<!--
2021 年被 Prosus 以 18 亿美元收购。
-->

---

# 平台对比

| 维度 | Stack Overflow | dev.to | Medium |
|---|---|---|---|
| 内容形态 | 问答 | 文章 | 长文 |
| 治理 | 声誉 + 徽章 | 反应表情 | 算法 + Boost |
| 商业模式 | 广告 + Teams | 免费 / 赞助 | $5/月会员 |
| 激励 | 声誉（非现金） | 无 | 阅读时长分成 |

> 沉淀可复用知识的事实平台

<!--
想写文章用 dev.to，想变现用 Medium。
-->

---
layout: two-cols
---

# 提一个好问题

提问质量直接决定能否得到答案

**提问前必做**

1. 先搜索：80% 的问题已被问过
2. 检查 duplicate：读类似问题
3. 准备最小可复现示例（MRE）

**提问结构**

- 标题：一句话概括
- 正文：背景→期望→实际→已尝试
- 代码：MRE（用 ``` 包裹）
- 标签：最多 5 个，具体相关

::right::

# 常见 close 原因

| 原因 | 含义 |
|---|---|
| Duplicate | 已有相同问题 |
| Needs details | 信息不足 |
| Needs focus | 太宽泛 |
| Opinion-based | 观点题 |

**反模式**

- 「我的代码不工作，怎么办」
- 「急！！！在线等」
- 中文提问

> 用英文提问，带 MRE + 完整报错

<!--
新手被 close 多因提问方式而非技术问题。
-->

---

# 声誉系统（Reputation）

Stack Overflow 的核心游戏化机制

| 行为 | 声誉变化 |
|---|---|
| 回答被 up vote | **+10** |
| 回答被采纳 | **+15** |
| 被下 vote | -2（作者） |
| 每日上限 | **+200**（采纳除外） |

**声誉解锁权限**

- 15：up vote；50：评论他人帖
- 125：down vote；3000：close / reopen 投票

> 声誉是程序员的社区背书

<!--
声誉越高权限越大，越贡献越有权。
-->

---

# 徽章（Badges）

按贡献类型颁发，分 Bronze / Silver / Gold

| 徽章 | 等级 | 获得方式 |
|---|---|---|
| Student | Bronze | 首次提问被赞 |
| Good Answer | Silver | 答案获 25 赞 |
| Necromancer | Silver | 回答 60 天前问题获 5 赞 |
| Great Answer | Gold | 答案获 100 赞 |
| Famous Question | Gold | 问题浏览 1 万次 |

> 徽章激励持续贡献与深度参与

<!--
Gold 徽章是社区顶级荣誉背书。
-->

---
layout: two-cols
---

# Collectives 子社区

2021 推出的技术栈子社区

- 厂商赞助（Google Cloud / AWS / Go / Kotlin）
- 聚合该技术栈的标签、文章、专家
- 厂商工程师（Recognized Member）直接答疑
- **2026 年仍活跃**，未受流量下滑影响

加入：Collective 页点击 Join，主页展示徽章

::right::

# AI 冲击下的现状

ChatGPT 后新提问量断崖下滑

| 时间 | 新问题量 |
|---|---|
| 2022-11 | ChatGPT 发布 |
| 2024-25 | **同比下降 ~64%** |
| 2025 vs 峰值 | **下降 90%+** |

**2023 版主罢工**：禁 AI 检测工具致 70%+ 罢工

**2026 改版失败**：4-30 放弃 beta 回滚

> 仍是 Google 搜索的事实答案源

<!--
老问题答案仍是 AI 训练与搜索核心。
-->

---

# 与 AI 工具协作

Stack Overflow 与 ChatGPT / Copilot 互补而非替代

| 场景 | 工具 |
|---|---|
| 快速报错排查 | ChatGPT / Copilot |
| 深度原理理解 | **Stack Overflow** |
| 验证 AI 答案 | **Stack Overflow** |
| 最新版本 API | 官方文档 + SO |

**警惕 AI 答案的「看似合理」**

- ChatGPT 可能编造库 / API
- 直接粘贴 AI 答案会被 close / ban

> 2024 起与 OpenAI / Google 签数据授权协议

<!--
AI 即时答疑 + SO 深度沉淀，互补使用。
-->

---

# 声誉与求职

声誉是程序员的「社区背书」

| 声誉 | 水平 |
|---|---|
| 1-100 | 新手 |
| 1000-10000 | 资深用户 |
| 10000-100000 | 专家 |
| 100000+ | Top 0.1% |

**求职应用**

- 简历附 Stack Overflow 主页链接，高声誉 + Top 标签是强力背书
- 面试官常查候选人主页验证技术深度

> 声誉是程序员社区的硬通货

<!--
声誉可作为求职背书，面试官常查。
-->

---

# 提问的艺术

新手最常被 close 的原因是提问方式

**正模式（应这样问）**

- 标题：一句话概括问题（如「Pandas groupby 后如何应用自定义函数」）
- 正文：背景 → 期望 → 实际 → 已尝试
- 代码：最小可复现示例（MRE）
- 报错：完整粘贴，不截图
- 语言：用英文提问

**反模式（被 close）**

- 「我的代码不工作，怎么办」→ Needs details
- 「Python 怎么学」→ Opinion-based
- 「急！在线等」→ 标题党被 down vote

> 英文 + MRE + 完整报错 = 好问题

<!--
提问方式比技术本身更决定能否获答。
-->

---
layout: quote
---

# Stack Overflow 第一性原理

「十几年沉淀的 Q&A 是 AI 时代最宝贵的『人类答案语料』——尽管实时问答被 AI 分流，它仍是 Google 搜索与 AI 训练的核心来源。」

---

# 平台选择

| 需求 | 推荐 |
|---|---|
| 报错求助（英文） | **Stack Overflow** |
| 报错求助（中文） | SegmentFault / 博客园 |
| 写技术文章 | dev.to / 掘金 |
| 长文变现 | Medium |
| 团队内部 Q&A | SO for Teams |

> 提问前先搜，MRE 必备，英文提问

<!--
声誉是求职背书，简历可附 SO 主页。
-->

---
layout: center
class: text-center
---

# 小结

Stack Overflow = 问答 + 声誉 + 徽章 + 严格治理

**人类知识库 · AI 协作 · Collectives · 求职背书**

[Stack Overflow](https://stackoverflow.com) · [Tour](https://stackoverflow.com/tour) · [Help](https://stackoverflow.com/help)

<!--
AI 时代仍是最权威的人类编程知识库。
-->
