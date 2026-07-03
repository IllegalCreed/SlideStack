---
theme: seriph
background: https://cover.sli.dev
title: Lynx 深入浅出
info: |
  字节跳动 2025 开源的高性能跨端 UI 框架。

  Write Once, Render Anywhere · 了解更多 [lynxjs.org](https://lynxjs.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Lynx

字节跳动 2025 开源的**高性能跨端 UI 框架**（新兴 / 观察）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/lynx-family/lynx" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Lynx —— 字节跳动 2025 年开源的跨端框架。它还很新，厂外生态处于早期，所以我们按「观察 / 前瞻」来讲：讲清它的架构与差异化，而不把它当成已经成熟的主力选型。
-->

---
transition: fade-out
---

# 什么是 Lynx

一句话：字节开源的**高性能跨端 UI 框架**，用 Web 技术写、**原生渲染**

<v-clicks>

- 2025-03 开源，仓库 **lynx-family/lynx**（C++ / Apache-2.0）
- 口号 **「Write Once, Render Anywhere」**，一套代码多端渲染
- 核心卖点：**双线程架构** + 自研 **PrimJS** 引擎，主打「秒开 + 丝滑」
- 标杆：字节系 **TikTok、CapCut** 等大规模生产验证
- 2026 定位：厂内大规模；**厂外生态尚早**，属「观察 / 前瞻」

</v-clicks>

<!--
Lynx 的关键词：用前端熟悉的 React + CSS 来写，最终是原生渲染而非套壳。它最大的两个标签是双线程架构和自研的 PrimJS 引擎。字节内部 TikTok、CapCut 已大规模使用，但厂外还很早期。
-->

---
transition: fade-out
---

# 技术全景

一套自研技术栈支撑跨端

| 项 | 值 |
| --- | --- |
| JS 引擎 | **PrimJS**（字节自研） |
| 上层框架 | **ReactLynx**（React 写法） |
| 脚手架 | `npm create rspeedy@latest` |
| 构建工具 | **Rspeedy**（基于 Rspack） |
| 样式 | 类 Web CSS（flex / **grid** / linear） |
| 平台 | iOS / Android / **鸿蒙** / Web / 桌面 |

<!--
从引擎到脚手架到样式，Lynx 是一套自研栈：PrimJS 引擎、ReactLynx 上层、Rspeedy 构建。值得注意的是平台里明确包含鸿蒙，这在跨端框架里比较少见。
-->

---
transition: fade-out
---

# 双线程架构（核心卖点）

Lynx 相对 RN 的最大差异化

<div grid="~ cols-2 gap-4">

<div>

**主线程 / UI 线程**

- 由 **PrimJS** 驱动
- 负责**首帧渲染**与高优先级事件（手势）
- 目标：instant launch 秒开

</div>

<div>

**后台线程 / JS 线程**

- 跑**业务逻辑 / 异步 / 网络**
- 与 UI 线程**解耦**
- 业务计算**不阻塞** UI

</div>

</div>

<div v-click class="mt-4 text-sm">

思路：「首屏关键渲染」放主线程同步做、「业务逻辑」放后台线程 → 比单 JS 线程更快响应（线程通信细节以官网为准）

</div>

<!--
双线程是 Lynx 的招牌。它把首帧渲染和手势这类高优先级、需要同步的操作放在主线程用 PrimJS 跑，把业务逻辑、网络请求放到后台线程。这样业务计算再重也不会卡住首屏。具体的线程通信机制细节以官网 Guide 为准。
-->

---
transition: fade-out
---

# PrimJS 引擎与性能故事

自研 JS 引擎，为「双线程 + 秒开」服务

<v-clicks>

- **PrimJS**：字节自研 JS 引擎，主打**快启动**与**高效 GC**
- 驱动**主线程**完成首帧同步渲染，追求 instant launch
- 与 RN 的 **Hermes**（AOT 预编译字节码）是不同技术路线
- ⚠️ 常见误读：官方「**2-4x**」是 **Web 页面 → Lynx** 的启动提升，**不是**「比 RN 快 2-4x」

</v-clicks>

<!--
PrimJS 是配合双线程的引擎，强调快启动和高效 GC。这里有个高频误读要澄清：网上常说的 2-4x，指的是从 Web 页面迁移到 Lynx 的启动提升口径，不是「比 React Native 快 2-4 倍」，别记错。基准的确切来源仍需以官方为准。
-->

---
transition: fade-out
---

# ReactLynx 与开发模型

官方为 Lynx 打造的 **React 框架**

<v-clicks>

- **ReactLynx**：idiomatic React 写法（组件 / Hooks / JSX），官方有「Thinking in ReactLynx」指南
- 内建元素 + CSS + 布局系统，前端心智迁移成本低
- **不与 React 强绑**：字节内部约一半使用非 React 框架（Vue / Svelte 等）
- 但**厂外对 Vue / Svelte 的官方支持成熟度仍待明确**，以官网为准

</v-clicks>

<!--
上层框架 ReactLynx 提供地道的 React 写法，会 React 的前端很容易上手。值得注意的是 Lynx 底层并不与 React 强绑，字节内部约一半用的是非 React 框架。不过 Vue、Svelte 在厂外的官方支持到什么程度，目前还不明确，先标注为待核。
-->

---
transition: fade-out
---

# 样式：更贴近 Web 的 CSS

相比 RN 的 Flexbox 子集，Lynx 更接近 Web 心智

<div grid="~ cols-2 gap-4">

<div>

**布局系统**

- linear（线性）
- **flexbox**
- **grid**（RN 没有）
- relative（相对）

</div>

<div>

**与 RN 的关键差异**

- 支持 **CSS Grid**，RN 不支持
- 类 Web 的 CSS 写法
- 更低的前端上手门槛
- 样式引擎实现细节以官网为准

</div>

</div>

<!--
样式是 Lynx 另一个差异化点。RN 只有 Flexbox 的一个子集、没有 Grid；Lynx 的布局系统包含 linear、flexbox、grid、relative，更贴近真正的 Web CSS，所以前端上手门槛更低。样式引擎具体怎么实现的以官网为准。
-->

---
transition: fade-out
---

# 起步与工具链

脚手架 **Rspeedy**（基于 Rspack）

```bash
npm create rspeedy@latest    # 创建项目
cd my-app && npm install
npm run dev                  # 终端出二维码
# → 用 Lynx Explorer App 扫码，或粘贴 bundle URL 预览
```

<v-clicks>

- **Rspeedy**：Lynx 官方构建工具，基于 **Rspack**
- 真机预览：**Lynx Explorer App** 扫码 / bundle URL
- 调试：官方 **DevTool**；文档中英双语

</v-clicks>

<!--
起步很简单：一条 create rspeedy 就能建项目，npm run dev 会在终端出一个二维码，用 Lynx Explorer App 扫码就能真机预览，或者粘贴 bundle URL。构建工具是基于 Rspack 的 Rspeedy，调试用官方 DevTool。
-->

---
transition: fade-out
---

# Lynx vs React Native

同为「JS 写跨端」，路线不同

| 维度 | Lynx | React Native |
| --- | --- | --- |
| 线程模型 | **双线程**（UI + 后台 JS） | JS 线程 + UI 线程（JSI） |
| JS 引擎 | **PrimJS**（自研） | Hermes |
| 样式 | 类 Web CSS，**含 Grid** | Flexbox 子集，无 Grid |
| 上层 DSL | ReactLynx（+ Vue/Svelte） | React |
| 成熟度 | 2025 新开源，**厂外早期** | 成熟、生态庞大 |

<!--
和 RN 对比，记两个差异化点：一是双线程架构，二是更贴近 Web、带 Grid 的 CSS。引擎也不同，Lynx 用自研 PrimJS、RN 用 Hermes。但成熟度上 RN 遥遥领先，Lynx 厂外还很早期。
-->

---
transition: fade-out
---

# 现状评估（如实）

<div grid="~ cols-2 gap-4">

<div>

**优势**

- 字节超大规模生产背书（TikTok / CapCut）
- 双线程 + PrimJS 的性能故事
- Web 化 CSS，前端上手门槛低
- 多端覆盖，**含鸿蒙**

</div>

<div>

**短板 / 风险**

- 2025 才开源，**厂外生态 / 三方库不成熟**
- 社区规模远小于 RN / Flutter
- 生产案例主要在字节系
- API 仍在演进，稳定性承诺待明确

</div>

</div>

<!--
客观说：优势是字节的超大规模背书加上性能故事和低上手成本；短板是太新，厂外生态、三方库、社区都还远不及 RN 和 Flutter，生产案例也集中在字节系。所以要如实告诉团队它的实验性。
-->

---
layout: center
class: text-center
---

# 选型总结

**关注 / 试验可以，当主力尚早**

双线程架构 · 自研 PrimJS · 类 Web CSS（含 Grid）· 字节大规模背书

<div class="mt-8 text-sm opacity-75">

[官网 lynxjs.org](https://lynxjs.org/) · [GitHub](https://github.com/lynx-family/lynx) · [Quick Start](https://lynxjs.org/guide/start/quick-start.html)

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/lynx-family/lynx" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
一句话收尾：Lynx 的架构和差异化很有看点，值得持续关注、可以试验；但在厂外生态成熟之前，一般团队还不宜把它当主力。谢谢大家。
-->
