---
theme: seriph
background: https://cover.sli.dev
title: Medium 完全指南
info: |
  Medium 完全指南：付费墙 · Partner Program · Publication · 自定义域名 · Boost 分发

  Learn more at [https://help.medium.com](https://help.medium.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Medium 指南

付费墙长文社区 · Partner Program · Publication · Boost

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Medium 是付费墙 + Partner Program 分成的英文长文平台。
-->

---
transition: fade-out
---

# Medium 是什么

Twitter 联创 Evan Williams 2012 创办的英文长文写作平台

- **付费墙会员制**：$5/月（$50/年），解锁全部会员文章 + 音频
- **Partner Program**：写作者按「会员阅读时长」分成
- **Publication**：多人协作的子站点，可绑自定义域名
- **Boost Program**：人工编辑提名优质文章获算法加权
- **2026 新规**：付费墙拉新会员可获额外推荐奖金

> 定位：面向严肃写作者的优质内容分发与变现平台

<!--
Medium = 付费墙 + Partner Program + Publication + Boost。
-->

---

# 平台对比

| 维度 | Medium | dev.to | Substack |
|---|---|---|---|
| 定位 | 付费墙长文 | 免费开源社区 | 邮件订阅 |
| 开源 | 闭源 | Forem 开源 | 闭源 |
| 收入 | 阅读时长分成 | 无直接分成 | 订阅 90% |
| 自有域名 | 会员可用 | 否 | 付费可用 |

> 适合用英文长文获得稳定收入的写作者

<!--
Medium 与 dev.to（免费）、Substack（订阅）形成对照。
-->

---
layout: two-cols
---

# 会员与注册

```text
免费账号：读所有公开文章
会员 $5/月 或 $50/年
  - 解锁全部会员文章
  - 解锁音频朗读
  - 获 Partner Program 资格
  - 获自定义域名功能
```

注册：邮箱 / Google / Apple / X 登录

::right::

# 写第一篇文章

头像 → **Write** 进入编辑器

- 所见即所得 Markdown 风格
- 支持代码块、引用、图片、Series
- 右侧齿轮勾选 **Metered story** 开付费墙
- 非会员每月限读 3 篇付费墙文章

> 技术教程类不建议锁付费墙

<!--
会员是加入 Partner Program 的前提。
-->

---

# Partner Program 收入

收入 = 会员阅读时长 × 互动加权 × 推荐奖励

- **会员阅读时长**：读者停留越久分成越高
- **互动加权**：点赞 / 评论 / 完成率提升权重
- **2026-02-17 推荐奖励**：拉新会员获一次性奖金
- **发放**：每月 8-15 日打款到 Stripe
- **门槛**：必须先成为 $5/月 会员

> AI 生成内容（2024-05 起）不得参与分成

<!--
优化方向：标题克制 + 开头钩子 + 结尾抛问题。
-->

---
layout: two-cols
---

# Publication 出版物

多人协作或公司技术博客的子站点

| 角色 | 权限 |
|---|---|
| Owner | 全部权限 |
| Editor | 编辑发布 |
| Writer | 提交草稿 |

适用：公司博客（Stripe / Airbnb）、开源布道、主题专栏

::right::

# 自定义域名

会员可把 Publication 绑自有域名

```text
1. Publication 设置 → Custom domain
2. 输入域名（如 blog.acme.com）
3. DNS 加 CNAME → medium.com
4. 等待自动签发 HTTPS
```

> 域名随会员，停缴即失效

<!--
Publication + 自定义域名是公司博客标配。
-->

---

# Boost 与分发

Boost 是算法加权分发，由 100+ 人工提名者评审

| 分发等级 | 流量 |
|---|---|
| On platform | 仅关注者可见 |
| Network | 进入主题推荐流 |
| **Boosted** | 算法加权大幅推送 |

**被 Boost 要点**

- 写 2000+ 字深度长文，含数据 / 案例
- 避免标题党、纯 AI 文、搬运
- 投到大型 Publication（提名人在此）

> Boost 后曝光可提升 10-100 倍

<!--
2026 起 Boost 升级为 Editor Partner Program。
-->

---

# 付费墙取舍

Medium 创作者最重要的决策

| 指标 | 开付费墙 | 不开 |
|---|---|---|
| 搜索收录 | 收录但跳出高 | 高收录高停留 |
| 社交分享 | 低 | 高 |
| 直接收入 | 有分成 | 无 |
| 长尾流量 | 弱 | 强 |

**经验法则**

- 技术教程类**不锁**（吃搜索流量）
- 观点 / 行业分析类**锁**（吃分成）

<!--
2026-02-17 新规：付费墙拉新会员有额外奖励。
-->

---

# Partner Program 收入优化

优化方向：阅读时长 × 互动 × 推荐奖励

- **标题克制**：与正文不符会让读者迅速跳出
- **开头 3 段**：用故事 / 反直觉结论 / 数据钩子
- **段落短、留白多**：手机阅读体验决定完成率
- **结尾抛问题**：评论会显著加权分成
- **Series 系列文章**：读者顺读下一篇，总时长翻倍

> 付费墙切割点设悬念，抓 2026 推荐奖励

<!--
开头钩子 + 结尾互动 + 系列连载 = 提升分成。
-->

---

# AI 内容政策

2024-05 起 AI 生成内容受限

- **禁入付费墙**：AI 生成内容不能进 Metered story
- **不参与分成**：不能进 Partner Program
- **合规做法**：用 AI 做调研 / 大纲，正文人工撰写
- **加入个人案例**：在编辑过程加入独家数据
- **纯 AI 文章**：发到不锁付费墙的开放栏目

> 全 AI 水文发到开放栏目，不锁付费墙

<!--
AI 仅用于调研，正文人工写是合规做法。
-->

---
layout: quote
---

# Medium 第一性原理

「会员费池 → 按阅读时长分配给作者——把读者付费直接转成作者收入的闭环，比广告 / 捐赏 / 自营订阅更省心。」

---

# 平台选择

| 需求 | 推荐 |
|---|---|
| 英文长文变现 | **Medium** |
| 开发者技术文章（英文） | dev.to |
| 邮件订阅自营 | Substack |
| 中文技术文章 | 掘金 / 知乎专栏 |
| 完全自有 | WordPress / 自建 |

> 多平台分发：Medium 付费墙 + dev.to 开放双发，吃两边流量

<!--
根据需求选平台，技术教程优先 dev.to / 掘金。
-->

---
layout: center
class: text-center
---

# 小结

Medium = 付费墙 + Partner Program + Publication

**阅读时长分成 · Boost 加权 · 自定义域名 · 双平台分发**

[Medium Help](https://help.medium.com) · [Partner Program](https://medium.com/creator-earnings) · [Membership](https://medium.com/membership)

<!--
Medium 适合严肃长文写作者获得稳定收入。
-->
