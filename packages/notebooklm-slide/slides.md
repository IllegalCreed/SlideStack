---
theme: seriph
background: https://cover.sli.dev
title: NotebookLM 完全指南
info: |
  NotebookLM 完全指南：源接地 · 引用可追溯 · Audio Overview · Deep Dive 播客 · Mind Map

  Learn more at [notebooklm.google](https://notebooklm.google/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## NotebookLM

源接地 AI 研究助手 · 引用可追溯 · Audio Overview

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
NotebookLM 靠源接地把幻觉降到极低，Deep Dive 播客是出圈招牌。
-->

---
transition: fade-out
---

# NotebookLM 是什么

Google 推出的源接地 AI 笔记与研究助手（现名 Gemini Notebook）

- **源接地**：答案只从你上传的源里找，每句带可点击引用
- **多源混合**：单笔记本最多 50 个源，PDF/网页/YouTube/音频
- **Audio Overview**：一键生成 Deep Dive 式播客（80+ 语言）
- **多形态输出**：FAQ / 学习指南 / 时间线 / 思维导图 / 辩论
- **隐私可控**：上传内容不用于训练 Gemini 通用模型
- **免费可用**：Google 账号直接登录，Free tier 覆盖多数研究

> 核心机制：**答案可追溯、可核对**——这是它有别于通用聊天机器人的根本。

<!--
源接地是 NotebookLM 的灵魂，引用让答案不是黑盒。
-->

---

# 第一次使用

入口 [notebooklm.google](https://notebooklm.google/)，Google 账号登录即用

1. 点 **Create new notebook** 创建笔记本
2. 左侧 **Sources** 面板点 **Add**，上传第一份资料
3. 等待处理（几秒到几十秒，看资料大小）
4. 中间聊天框提问，答案带可点击引用
5. 右侧 **Studio** 面板生成 Audio Overview / Mind Map

**支持源类型**

- Google Docs / Slides / PDF / Text / Markdown
- 粘贴文本 / Web URL / YouTube URL / 音频文件

> 单笔记本 **50 源**上限，单源约 **200MB / 50 万词**。

<!--
五步上手：建笔记本→加源→提问→看引用→Studio 生成。
-->

---
layout: two-cols
---

# 提问与引用

提问示例：

> 这三篇论文在「注意力机制」上的核心分歧是什么？

回答里每个论断后跟数字角标，点击会**高亮跳到对应源的原句**。

- 这是 grounding 的核心价值：**答案不是黑盒**
- 事实必核对——点角标读原文上下文
- 矛盾时说明源不够，补充源再问

::right::

# 不会用通用知识补

::: warning grounding 的代价

如果你问的资料**没提**，NotebookLM 会直接说「这些源里没有相关信息」，而**不会**像 ChatGPT 那样用训练知识硬答。

这是可靠性的来源，也是能力的边界。

:::

> 需要广覆盖、强生成的日常任务用 ChatGPT。

<!--
引用可追溯是 NotebookLM 最有别于通用聊天机器人的地方。
-->

---

# 生成 Audio Overview

Studio 面板一键把资料变成「Deep Dive」式播客

1. 进入含源的笔记本 → 右侧 **Studio**
2. 选 **Audio Overview** 格式
3. 选**形态**：Deep Dive / Brief / Critique / Debate
4. 选**语言**（80+ 可选）
5. 可加 **Custom instructions** 聚焦特定主题
6. 点生成——后台跑，完成后通知

**生成后**

- 在线播放，**同步看引用**
- 下载音频 / 链接分享
- **Interactive mode**（英语）：随时打断主持人追问

<!--
Audio Overview 是 NotebookLM 出圈的招牌功能。
-->

---

# 四种 Audio 形态

| 形态 | 形式 | 适合 |
|------|------|------|
| **Deep Dive** | 两主持人轻松对话 | 默认、通勤听、通读资料 |
| **The Brief** | 单口 < 2 分钟 | 快速抓要点、会议开场 |
| **The Critique** | 两主持人建设性批评 | 评审草稿、找漏洞 |
| **The Debate** | 两主持人正反辩论 | 决策权衡、看清多面 |

**Custom instructions 调教**

```text
重点讨论第三章的实验设计缺陷，
解释时假设听众是数据科学家，
加入对结论的批判性反思。
```

> 效果：从「资料复读」变成「有观点的深度讨论」。

<!--
四种形态覆盖通读、要点、评审、辩论四类需求。
-->

---
layout: two-cols
---

# 多源策略

源接地意味着**模型看不到源外的世界**，挑源决定答案质量。

**推荐**

- 一手资料优先：论文原文 > 综述 > 博客
- 覆盖完整：正反观点都放
- 时间新鲜：政策 / 行业数据用近 1 年的
- 结构化文本：Markdown / 文字 PDF

::right::

# 50 源规划

::: tip 推荐组合

- 5–10 篇核心论文
- 3–5 份行业报告
- 5–10 篇权威博客 / 新闻
- 1–3 个相关 YouTube 视频
- 余下放补充与对立观点

:::

**避免**

- 整本 1000 页 PDF 不切
- 自相矛盾的源混在一起

<!--
源质量决定一切：50 个高质量源 > 50 个垃圾源。
-->

---

# 输出形态全景

Studio 面板可生成的形态

| 输出 | 用途 |
|------|------|
| **Audio Overview** | 播客式音频 |
| **Mind Map** | 思维导图 |
| **Briefing Doc** | 一页摘要 |
| **Study Guide** | 学习指南（术语/问题/答案） |
| **FAQ / Timeline** | 问答 / 时间线（历史事件类） |

**Mind Map**：自动生成可视化思维导图，节点点击可展开提问。适合摸清陌生论文 / 报告结构、备课复习梳理脉络。

> 把碎片资料串成体系，一个笔记本 = 一份完整研究产物。

<!--
Studio 把资料转成多种可消费形态，播客+导图+摘要全覆盖。
-->

---
layout: two-cols
---

# 协作工作流

**团队研究**

1. Lead 建笔记本，加 5–10 个核心源
2. Share → 加成员为 **Editor**
3. 各人分头加自己负责的源
4. 统一在聊天框提问、对结论
5. Studio 生成 Audio Overview 通勤听

::right::

# 教学场景

1. 教师建笔记本，上传课程阅读材料
2. Share 给学生为 **Viewer**（只读）
3. 学生在副本里提问、生成 Mind Map 复习
4. Audio Overview 当「随身复习课」

> Share → Viewer / Editor 两档权限覆盖团队与教学。

<!--
协作让一个笔记本变成团队 / 课堂的共享研究空间。
-->

---

# 与 Gemini Deep Research 组合

Google Deep Research 是 Gemini 的深度联网研究能力

```text
Gemini Deep Research（联网广撒网）
    ↓ 产出报告 / 引用列表
NotebookLM（接地深加工）
    ↓ 上传报告 + 一手论文
    ↓ 提问、对比、生成 Audio Overview
最终交付（可追溯的研究产物）
```

- **Deep Research** 负责「**找到**」
- **NotebookLM** 负责「**读懂 + 可核对**」

> 组合 = 终极研究工作流：广撒网 + 深加工 + 可追溯。

<!--
Deep Research 找到，NotebookLM 读懂，分工互补。
-->

---

# NotebookLM vs ChatGPT

| 维度 | NotebookLM | ChatGPT |
|------|------|------|
| **知识来源** | 仅你上传的源 | 训练数据 + 联网搜索 |
| **引用** | 每句带可点击引用 | 一般无引用 |
| **幻觉风险** | 低（被源约束） | 较高 |
| **典型场景** | 文献综述 / 论文阅读 | 创意写作 / 代码 |
| **工作流** | **源优先**（先传再问） | **提示优先**（直接问） |

> 一句话：**可追溯、可核对的研究用 NotebookLM；广覆盖、强生成的日常用 ChatGPT**。

<!--
两者定位互补，不是替代关系——研究用 NotebookLM，通用任务用 ChatGPT。
-->

---
layout: center
class: text-center
---

# 小结

NotebookLM = 源接地 + 引用 + Audio Overview

**可追溯 · 多源混合 · Deep Dive 播客 · Studio 多形态**

[NotebookLM](https://notebooklm.google/) · [官方支持文档](https://support.google.com/gemininotebook/)

<!--
源接地 + 引用 + 播客 = NotebookLM 三件套。
-->
