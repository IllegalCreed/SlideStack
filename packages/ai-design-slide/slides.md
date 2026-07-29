---
theme: seriph
background: https://cover.sli.dev
title: AI 设计工具完全指南
info: |
  AI UI 设计工具完全指南：Stitch · Claude Design · Artifacts

  Learn more at https://stitch.withgoogle.com/ · https://www.anthropic.com/news/claude-design-anthropic-labs
drawings:
  persist: false
transition: slide-left
mdc: true
---

## AI 设计工具完全指南

Stitch · Claude Design · Artifacts · 设计稿与前端代码

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
AI 设计工具：把想法 / 草图 / 截图 / 既有产品直接转成 UI 设计稿与前端代码，定位设计探索 + design→dev 交接。
-->

---
transition: fade-out
---

# 什么是 AI 设计工具

以生成式 AI 为核心、产物是 **UI 设计稿 / 原型 / 前端代码** 的工具

- **输入多模态**：prompt / 草图 / 截图 / URL / DESIGN.md / 代码片段
- **产物是设计资产**：UI 设计稿 + HTML/CSS + DESIGN.md + 可点击原型
- **定位上游 ideation**：Figma / 真实工程的上游，**不是替代品**
- **不出可交付应用**：无后端 / DB / auth / 部署

> 产物是否「需要后端 / 数据库 / 部署」是最快的判定准则。

<!--
强调 AI 设计工具 ≠ AI 应用生成器，本主题只覆盖前者。
-->

---

# 当前两强

| 维度 | Google Stitch | Anthropic Claude Design |
|------|---------------|-------------------------|
| **厂商** | Google Labs | Anthropic Labs |
| **发布** | 2025-05-20 I/O | 2026-04-17 |
| **模型** | Gemini 2.5 Pro | Claude Opus 4.7 |
| **阶段** | Labs 实验 | Research Preview |
| **侧重** | 从零生成多变体 | 既有品牌体系内精修 |
| **画布** | infinite canvas | 组织级协作空间 |

> Claude Artifacts 已 GA，是更通用的产物面板（轻量同源）。

<!--
Stitch 偏「发散变体」，Claude Design 偏「在既有品牌内精修」。
-->

---
layout: two-cols
---

# Stitch 输入

**画布上下文（全部共享）**

- 自然语言 prompt
- 图片 / 草图 wireframe
- 截图（现有产品 / 竞品）
- **URL**：抽设计系统
- **DESIGN.md**：跨工具流动
- 代码片段

::right::

# Stitch 输出

**设计资产 + 前端代码**

- 高保真 UI 设计稿
- HTML / CSS（.zip 整包）
- **DESIGN.md**
- 「Paste to Figma」
- 可点击原型（Play）

> 输入共享画布上下文，Stitch 综合推理出稿。

<!--
Stitch 的多模态不是任选一种，而是全部作为约束。
-->

---

# Stitch AI-native 五大组件

从「prompt→稿」升级为「AI-native 软件设计画布」

| 组件 | 解决什么 |
|------|----------|
| **infinite canvas** | 多变体平铺对比，不再单线串行 |
| **Design Agent** | 跨项目演进推理，自动迭代 |
| **Agent Manager** | 并行管理多个 idea / agent |
| **Voice**（vibe design） | 语音实时 critique 与访谈 |
| **DESIGN.md** | 跨工具真相源 |

> 官方把这个阶段称为 vibe design（AI-native 软件设计画布）。

<!--
五个组件让 Stitch 从单输入单输出变成画布式协作。
-->

---

# Stitch + Play 交互原型

把多个屏幕「Stitch」成可点击流程

- 点 **Play** 预览
- 自动生成 **logical next screens**
- 映射用户旅程
- 在写代码前暴露交互断点

**为何重要**

- 单屏漂亮 ≠ 流程通
- 单屏都好看，点过去才发现断点
- 适合产品发现 / UX 探索阶段验证假设

> Play 把「静态稿」变成「可验证流程」。

<!--
Play 是 Stitch 把静态稿激活为流程的关键能力。
-->

---

# Stitch 开发者集成

让设计→编码链路可程序化

- **MCP Server**：接入 Claude / Cursor 等 MCP-aware 客户端
- **SDK**：[google/stitch-sdk](https://github.com/google/stitch-sdk)（GitHub ~2.4k stars）
- **Skills（stitch-skills）**：可复用设计技能包
- **导出到**：AI Studio / Antigravity / Jules / Lovable / Dyad / Cursor / Gemini

> 设计系统通过 DESIGN.md 双向流动，不依赖人肉拷贝 token。

<!--
Stitch 的开发者出口让它能嵌入既有编码工具链。
-->

---

# Claude Design：Brand-aware 设计系统

onboarding 读代码库 + 设计文件，自动应用现有视觉规范

- **自动套用** colors / typography / components
- **避免视觉漂移**（drift）
- **每团队可多套**：多品牌 / 多产品线独立维护
- 不用反复纠正风格，Claude 主动遵守规范

> Stitch 偏「从零生成变体」，Claude Design 偏「既有品牌体系内精修」。

<!--
brand-aware 是 Claude Design 区别于 Stitch 的核心差异。
-->

---
layout: two-cols
---

# 多格式导入 + 协作

**导入**

- text / images
- DOCX / PPTX / XLSX
- codebase references
- **web capture tool**（抓在线元素）

**三档协作（org-scoped）**

- private
- view-only link
- edit access（多人 + Claude）

::right::

# 导出 + Handoff

**导出清单**

- Internal URL / Folder
- **Canva（直连）**
- PDF / PPTX / Standalone HTML

> **官方未提 Figma 导出**

**Handoff Bundle**

- 一条指令把设计 + 意图
- 传给 **Claude Code**
- 用于 design→dev 交接

<!--
导出无 Figma 是常见踩坑，要走 Figma 用 Stitch 的 Paste to Figma。
-->

---
layout: two-cols
---

# Claude Artifacts 六类

已 GA 的通用产物面板

- Documents（Markdown / 文本）
- Code snippets
- **单页 HTML 网站**
- SVG
- Diagrams / flowcharts
- **Interactive React components**

触发：significant + self-contained + ~15 行

::right::

# Artifacts 能力与限制

**面板**

- dedicated window
- Version selector
- Code view / Edit with Claude
- Multi-file editing

**高级**

- Publish / Share / Fork
- AI-powered artifacts（嵌入 API）
- **Persistent storage**：20MB/artifact、text-only

> unpublish 永久删全部存储数据。

<!--
Artifacts 是 Claude Design 的轻量同源，但 Design 有团队级设计系统与 org 控制。
-->

---

# AI 设计 vs AI 应用生成器

判定准则：产物是否「需要后端 / 数据库 / 部署」？

| 类别 | 代表 | 产物 | 后端 | 部署 |
|------|------|------|------|------|
| **AI 设计工具** | Stitch / Claude Design / Artifacts | UI 设计稿 + HTML/CSS + DESIGN.md | 否 | 仅 preview |
| **AI 应用生成器** | Firebase Studio / AI Studio App Builder / Lovable / Dyad / v0 / bolt.new / Cursor | 可运行 app | 是 | 可 deploy |

> 把 v0 / bolt.new / Lovable / Dyad 归入「AI 设计工具」是常见误区。

<!--
判定准则：是否需要后端 / DB / 部署，定位是设计探索 vs 可交付应用。
-->

---

# Google 官方串行工作流

三者可分别独立起点，不是替代关系而是接力

```text
Stitch（UX 探索）
   ↓
AI Studio（app 原型 preview / deploy）
   ↓
Firebase Studio（生产代码 / 后端 / auth / DB）
```

- **Stitch**：UX 探索 / 设计变体 / 交互原型
- **AI Studio（Build mode / App Builder）**：app 原型，preview + deploy 到稳定 URL
- **Firebase Studio**：生产代码、后端、auth、DB

> Stitch 的 HTML 进 AI Studio 加逻辑，AI Studio 的原型进 Firebase Studio 上生产。

<!--
三者分别独立起点，但串起来构成 Google 官方推荐的端到端链路。
-->

---
layout: quote
---

# preview ≠ deploy

「Stitch / Claude Design 只出 preview，稳定 URL 与计费须走 AI Studio / Firebase Studio。」

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 把 Stitch 当 Figma 替代品做像素稿
- 期望 Claude Design 导出 Figma（官方无）
- 把 Claude Design 等同于 Artifacts
- 直接拿原型 HTML 上生产（prototype-grade）
- Enterprise 默认开启就推全员（实际默认 off）
- Artifacts 存图片 / 二进制 / 超 20MB
- 把 v0 / bolt.new / Lovable / Dyad 归入「AI 设计工具」
- 混淆 preview 与 deploy

<!--
把这些反模式记牢，避免在选型与产物预期上踩坑。
-->

---
layout: center
class: text-center
---

# 小结

AI 设计工具 = 设计探索 + design→dev 交接

Stitch · Claude Design · Artifacts · prototype-grade

**变体探索 · brand-aware · Handoff Bundle · preview ≠ deploy**

[Stitch](https://stitch.withgoogle.com/) · [Claude Design](https://www.anthropic.com/news/claude-design-anthropic-labs) · [Artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them) · [Stitch SDK](https://github.com/google/stitch-sdk)

<!--
掌握产物边界 + 串行工作流，就能把 AI 设计工具用到生产水准。
-->
