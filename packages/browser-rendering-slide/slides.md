---
theme: seriph
background: https://cover.sli.dev
title: 浏览器渲染原理
info: |
  浏览器渲染原理 —— 经典 5 步关键渲染路径、HTML 解析与 DOM、CSSOM 与 render tree、布局重排、绘制合成、帧生命周期与输入、现代架构 RenderingNG
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:layers class="text-8xl" />
</div>

<br/>

## 浏览器渲染原理

从 HTML 字节流到屏幕像素：DOM → CSSOM → render tree → layout → paint → composite

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
渲染进程从收到 HTML 字节流到屏幕亮起像素，要走完一条长长的流水线。这一章把它完整拆开：既讲经典 5 步关键渲染路径这套通用心智模型，也讲 Chromium 现代实现 RenderingNG。
-->

---
transition: fade-out
---

# 这一章讲什么

一条主线：**从字节流到像素的流水线，每一步的产物、代价与线程归属**

<v-click>

- **经典管线总览**：5 步 CRP + 现代第 6 步 composite，代价链心智模型
- **HTML 解析与 DOM**：tokenization、容错、preload scanner、async/defer
- **CSSOM 与 render tree**：render-blocking 根因、可见性规则
- **布局与重排**：触发清单、强制同步布局、layout thrashing
- **绘制与合成**：stacking context、图层提升、will-change、合成器动画
- **帧生命周期与输入**：帧预算、rAF/rIC、passive、事件合并
- **现代架构 RenderingNG**：12 阶段、property trees、LayoutNG、CAP、Viz

</v-click>

<v-click>

> 经典模型面试通用、MDN 背书；RenderingNG 是引擎的现代真身——最后用**术语映射表**把两套话语对上。

</v-click>

<!--
全章按七个主题推进：先建立经典 5 步管线的主线心智模型，然后逐步拆开每一步，最后看 Chromium 现代架构怎么改写了这些经典说法。
-->

---
layout: section
---

# 经典渲染管线总览

五步 CRP：贯穿全章的心智模型

---

# 关键渲染路径 CRP

MDN 定义：浏览器把 HTML、CSS、JS **转换为屏幕像素**所经历的步骤序列

<v-click>

```text
HTML ──解析──▶ DOM ──┐
                     ├──▶ render tree ──▶ layout ──▶ paint ──▶ (composite)
CSS ──解析──▶ CSSOM ─┘      (可见节点)      (几何)     (像素)      (分层合成)
```

</v-click>

<v-click>

- 理解一切渲染性能问题的**主线心智模型**
- **流水线级联**：每一步的输出是下一步的输入——改了 layout，受影响的 paint、composite 都要重来
- MDN 原文只列 5 步；**composite 是现代补充的第 6 步**，如今是理解性能的必备一环

</v-click>

<!--
CRP 是 Critical Rendering Path 的缩写。记住两个性质：流水线级联（前一步产物是后一步输入），以及第 6 步合成是现代补充，本章将其并入主线。
-->

---

# 六个步骤，一张表

前一步的产物是后一步的输入

<v-click>

| 步骤 | 产物 | 干什么 |
| --- | --- | --- |
| ① 解析 HTML | **DOM** | 字节流 → token → 节点 → 树；**增量构建** |
| ② 解析 CSS | **CSSOM** | 规则树 + 级联；**非增量**，必须完整才能用 |
| ③ 样式合成 | **render tree** | 只收**可见节点**及其计算样式 |
| ④ 布局 layout | 几何信息 | 算出每个盒子的尺寸与位置（依赖视口） |
| ⑤ 绘制 paint | 像素指令 | 文字、颜色、边框、阴影、图片 |
| ⑥ 合成 composite | 合成帧 | 分到多个**图层**，分别栅格化后按序拼合 |

</v-click>

<v-click>

> **DOM 构建是增量的，CSSOM 不是**——这一对比是后面两章的主线。

</v-click>

<!--
这张表是全章的地图。每行对应后面的一章。特别注意 DOM 增量、CSSOM 非增量这组对比，它决定了 CSS 为什么阻塞渲染。
-->

---

# 代价链：越靠前越贵

日常代码都在触碰管线的不同深度

<v-click>

```js
// ① 改几何 → 重跑 layout + paint + composite（最贵）
el.style.width = "300px";

// ② 只改颜色 → 跳过 layout，重跑 paint + composite
el.style.background = "red";

// ③ 只改 transform/opacity → layout、paint 都跳过，合成器线程直接出帧（最便宜）
el.style.transform = "translateX(100px)";
```

</v-click>

<v-click>

- 更隐蔽的是**读取也有代价**：改样式后立刻读 `offsetWidth`，浏览器被迫**立即同步布局**（布局章细讲）

</v-click>

<v-click>

> 代价链 **layout > paint > composite**——写代码时的每个样式选择都在选管线深度。

</v-click>

<!--
三行代码走三条不同深度的管线路径。这个代价链是全章反复出现的主旋律：动画为什么只碰 transform/opacity、读几何为什么贵，都从这里来。
-->

---

# 渲染发生在哪

渲染工作发生在**渲染进程**内，它「负责标签页里发生的一切」

<v-click>

| 线程 | 职责 |
| --- | --- |
| **主线程** | 解析 HTML/CSS、样式计算、layout、paint、执行 JS——管线大头 |
| **合成器线程** | 分层合成、滚动、合成器动画；**不等主线程**独立出帧 |
| **栅格线程** | 把绘制指令栅格化成像素（GPU 纹理块） |
| worker 线程 | Web Worker / Service Worker 的 JS |

</v-click>

<v-click>

- 现代 Chromium 把「最终画到屏幕」交给独立 **Viz 进程**统一聚合——RenderingNG 章展开

</v-click>

<v-click>

> **主线程生产画面内容，合成器线程保证画面流畅**——大量优化招式本质都是「别让合成器等主线程」。

</v-click>

<!--
一句话记住分工：主线程生产内容，合成器线程保证流畅。transform 动画、passive 监听、读写分离这些招式，本质都是别让合成器等主线程。
-->

---

# 三个经典症状，先挂个号

读完全章你能自己开处方

<v-click>

| 症状 | 管线视角的病因 |
| --- | --- |
| **首屏白屏久** | 同步 `<script>` 暂停解析、CSS 未就绪不渲染、关键资源没进 preload scanner 视野 |
| **交互/动画掉帧** | 动画碰盒模型属性走全管线、循环读写触发 layout thrashing |
| **滚动发闷、跟手差** | 监听器把合成器快速通道拖回主线程：非快速滚动区、缺 `passive` |

</v-click>

<v-click>

> 统一判断框架：先问「**这次改动落在管线哪一步**」，再问「**它在哪个线程执行、要不要等主线程**」。

</v-click>

<!--
三类最常见的性能症状各自对应管线的不同环节。全章所有页面都在反复练这两问：落在哪一步、在哪个线程。
-->

---
layout: section
---

# HTML 解析与 DOM 构建

流水线的源头：从字节流到 DOM 树

---

# 从字节到树

解析分两步：tokenization + 树构建（MDN）

<v-click>

```text
字节流 ──▶ token 流 ──▶ 节点 ──▶ DOM 树
          startTag / endTag /       <html> 为根，
          属性名 / 属性值 / 文本     嵌套即父子
```

</v-click>

<v-click>

- **tokenization（词法分析）**：把字符流切成 token；一个 DOM 节点始于 `startTag`、终于 `endTag`
- **增量式**：不必等 HTML 下载完，收到多少解析多少——流式 HTML 提前出首屏的原理
- **节点数量 = 全管线成本**：CRP 后续每步都按节点规模放大，滥用包装 `<div>` 不是免费的

</v-click>

<!--
DOM 既是浏览器对页面的内部表示，也是暴露给 JS 的数据结构。两个对写代码有直接影响的性质：增量构建，以及节点数是全管线的成本基数。
-->

---

# HTML 容错：浏览器从不报错

容错是 **HTML 规范内建设计**，修复规则标准化

<v-click>

```html
<!-- 你写的（交错标签） -->
Hi! <b>I'm <i>Chrome</b>!</i>

<!-- 解析器实际当作 -->
Hi! <b>I'm <i>Chrome</i></b><i>!</i>
```

</v-click>

<v-click>

- 漏写 `</p>` 是合法 HTML；修复规则由规范定义，**各浏览器结果一致**
- **容错 ≠ 无代价**：上例修复后多出一个 `<i>` 节点——CSS 选择器与 JS 遍历都会踩到

</v-click>

<v-click>

> 别依赖容错，写规范嵌套。

</v-click>

<!--
Chrome 官方原文：浏览器对 HTML 从不抛出错误。但修复出的 DOM 可能不是你想的那个结构，别把容错当免费午餐。
-->

---

# preload scanner：并行预取

与主解析器**并行运行**，扫 token 预取高优资源

<v-click>

- 发现 `<img>`、`<link>`、`<script src>` 就直接把请求发给**网络线程**，不等主解析器走到那儿
- 主解析器被脚本暂停时，后面的资源照样在下载
- MDN：等主解析器到达该资源时，「可能已在传输中甚至已下载完成」

</v-click>

<v-click>

- **写进早期标记才吃得到红利**：动态插入的 `<script>`、CSS `background-image`、`@import` 对它不可见
- 无法出现在早期标记的关键资源 → `<link rel="preload">` 声明「本次导航必需，尽快下载」

</v-click>

<!--
preload scanner 是解析阻塞的缓冲垫：解析器停了它还在预取。对写代码的启示是资源引用尽量写在 HTML 标记里，让它看得见。
-->

---

# JS 阻塞解析：document.write 之毒

遇到裸 `<script>`：先下载、**执行完**，解析才能继续

<v-click>

```html
<p>第一段</p>
<script>
  // 解析器必须暂停：这行会在当前解析位置插入新标记
  document.write("<p>我插进来了</p>");
</script>
<p>第二段——上面脚本执行完之前，解析器不敢碰我</p>
```

</v-click>

<v-click>

- 根因：JS 可能用 `document.write()` **改写文档结构**，解析器无法预知，只能保守停下
- **连坐**：CSS 阻塞 JS（JS 常查询样式）、JS 阻塞解析——同步脚本前有未就绪样式表就要连等两趟
- 文档解析完后再调用会隐式 `document.open()`，**清空整个文档**——经典事故

</v-click>

<!--
script 默认阻塞解析这条规则的根因就是 document.write 的存在。还有一层隐蔽连坐：CSS 阻塞 JS、JS 阻塞解析。
-->

---

# 脚本加载策略：async / defer / module

Chrome 建议：脚本不依赖 DOM 时用 async 或 defer 异步加载

<v-click>

| 方式 | 下载 | 执行时机 | 顺序 | document.write |
| --- | --- | --- | --- | --- |
| `<script>` 裸 | **阻塞解析** | 下载完立即执行 | 文档序 | 可用（毒） |
| `defer` | 并行不阻塞 | 解析完、`DOMContentLoaded` 前 | **文档序** | 禁用 |
| `async` | 并行不阻塞 | **下载完立即**（暂停解析） | 无序先到先跑 | 禁用 |
| `type="module"` | 并行含依赖图 | 默认同 defer | 依赖图序 | 禁用 |

</v-click>

<v-click>

- 依赖 DOM、依赖彼此顺序（主逻辑）→ **defer**（或 module 默认行为）
- 完全独立、越早跑越好（埋点/广告）→ **async**；必须同步注入的极少数 → 裸 script，尽量小、内联

</v-click>

<!--
defer 与放 body 底部的裸 script 执行时机接近，但 defer 版下载更早开始，通常更优。三种异步方式都禁用 document.write。
-->

---
layout: section
---

# CSSOM 与 render tree

CSS 为什么阻塞渲染、谁能进「可见树」

---

# CSS 为什么是 render-blocking

MDN：收齐并处理完**全部 CSS** 前，浏览器阻塞页面渲染

<v-click>

- 根因：**级联可覆盖**——同一元素，样式表第 500 行完全可能推翻第 3 行的声明
- 用「解析到一半的 CSSOM」渲染 = 先画一版**注定被覆盖**的样式，随后闪变（FOUC）
- 所以 **CSSOM 构建非增量**（对比 DOM 增量）：必须完整才能用

</v-click>

<v-click>

> 别妖魔化解析成本：**CSSOM 构建总耗时通常小于一次 DNS 查询**——真正贵的是「等 CSS 下载」的网络时间，优化火力应对准减少关键 CSS 字节数与请求往返。

</v-click>

<!--
一句话讲透：CSS 规则是级联的，后来者可以覆盖前者，所以半成品 CSSOM 不可用。但 MDN 特意泼冷水：解析本身极快，贵的是下载。
-->

---

# 三个「阻塞」分清楚

精确边界，别混为一谈

<v-click>

| 谁阻塞谁 | 结论 |
| --- | --- |
| CSS 阻塞 HTML **解析**？ | **不**。解析器遇到 `<link rel="stylesheet">` 继续往下 |
| CSS 阻塞**渲染**？ | **是**。CSSOM 没齐就不进 render tree / layout / paint |
| CSS 阻塞 **JS 执行**？ | **是**。JS 常查询样式；JS 又阻塞解析——间接连坐 |

</v-click>

<v-click>

> 对策：CSS 要**早、小、拆**——关键 CSS 尽早给（甚至内联首屏部分），非本媒体的样式用 `media` 标注。

</v-click>

<!--
三个阻塞是面试高频混淆点：CSS 不挡 HTML 解析，挡渲染、挡 JS 执行，并通过 JS 间接挡解析。
-->

---

# 让 CSS 退出关键路径

`media` 标注 + 远离 `@import`

<v-click>

```html
<!-- ① 默认：阻塞渲染（screen 全量样式） -->
<link rel="stylesheet" href="app.css" />

<!-- ② media 标注不匹配当前环境：照常下载，但不阻塞渲染 -->
<link rel="stylesheet" href="print.css" media="print" />
<link rel="stylesheet" href="wide.css" media="(min-width: 1200px)" />

<!-- ③ 反例：@import 要解析完外层 CSS 才发现内层请求，
     串行加载 + preload scanner 不可见，加深关键路径 -->
<style>
  @import url("more.css"); /* 避免 */
</style>
```

</v-click>

<!--
media 属性标注的样式表照常下载但不阻塞屏幕渲染。@import 是双重反面教材：串行加载且对 preload scanner 不可见。
-->

---

# 级联与 computed style

从**最一般**的规则开始，递归应用**更具体**的规则细化

<v-click>

- **UA 默认样式表打底**：没写 CSS 也有样式——`<h1>` 比 `<h2>` 大、段落有默认 margin；级联起点不是空白
- computed style = **选择器匹配 + 级联**后每个节点的最终样式集（DevTools 的 Computed 面板）
- 选择器匹配**从右向左**：`.bar .foo` 先找 `.foo`，再向上找祖先 `.bar`——右端越具体候选集越小

</v-click>

<v-click>

> MDN 定调：选择器性能差异在**微秒级**，不值得围绕它优化——真正的大头在**减少节点数与避免重排**。

</v-click>

<!--
两个常被忽略的事实：UA 样式表永远打底；选择器从最右侧关键选择器向左验证。但别把从右向左当性能军规，MDN 说收益只在微秒级。
-->

---

# render tree：只装「可见」的树

DOM + CSSOM 结合：从根遍历每个**可见节点**并附上计算样式

<v-click>

| 情形 | 进 render tree？ | 理由 |
| --- | --- | --- |
| `<head>` 及其子节点 | **否** | 不产生渲染输出 |
| `display: none` | **否，连同全部子孙** | 不显示、不占空间 |
| `visibility: hidden` | **是** | 不可见但**占布局空间** |
| `opacity: 0` | 是 | 参与布局与绘制（还能收事件） |
| `::before/::after`（有 `content`） | **是** | 不在 DOM 中，但有渲染输出 |

</v-click>

<v-click>

> render tree 是 layout 的输入——**不在 render tree 里的节点没有布局信息**。

</v-click>

<!--
关键在「可见」的判定：display none 整枝摘除，visibility hidden 留位，伪元素凭 content 上车。UA 样式表里 script 标签就是被 display none 排除的。
-->

---

# display:none vs visibility:hidden

不只是「看不看得见」

<v-click>

| | `display: none` | `visibility: hidden` |
| --- | --- | --- |
| 进 render tree | 否，**整棵子树摘除** | 是，保留 |
| 占布局空间 | 不占 | **占** |
| 切换代价 | **整段布局重算** | 只涉及绘制 |
| 读 `offsetWidth` | 恒为 **0**（无布局信息） | 正常值 |

</v-click>

<v-click>

- 对 `display: none` 的元素读 `offsetWidth` 恒为 0 的原理：它不在 render tree 里，没有布局信息

</v-click>

<v-click>

> 频繁闪烁切换的元素用 `visibility`（或 `opacity`）更省。

</v-click>

<!--
这组对比是章节要求的重点：前者把整棵子树从 render tree 摘除，切换时整段布局重算；后者保留几何，切换只涉及绘制。
-->

---
layout: section
---

# 布局与重排

几何计算的代价与纪律

---

# layout 在算什么

为每个可见节点算出**几何**——盒尺寸（宽高）+ 坐标（x, y）

<v-click>

- 从 render tree **根**开始遍历；Chromium 视角：产出带 x/y 坐标、边界框尺寸的 layout tree
- **视口是地基**：块级默认宽 = 父级 100%；没有 viewport meta 的老页面按默认视口（一般 960px）排
- **全局敏感**：字体大小与换行位置决定段落形状，进而推挤后续内容——牵一发动全身
- **替换元素占位**：未声明尺寸的 `<img>` 下载完、真实尺寸已知时**触发一次 reflow**——这就是写 `width/height` 或 `aspect-ratio` 防 CLS 的渲染层原因

</v-click>

<v-click>

> 引擎会尽量局部 reflow，但改动越靠上游影响越大——改 `<html>` 的 `font-size` ≈ 全页重排。

</v-click>

<!--
render tree 只知道谁可见、样式是什么，layout 补上多大、在哪。布局是级联依赖的全局计算，哪怕最简单的排版也要考虑换行位置。
-->

---

# reflow：触发清单

MDN：**首次**确定尺寸位置叫 layout，之后每次重算叫 **reflow（重排）**

<v-click>

| 触发类别 | 典型操作 |
| --- | --- |
| DOM 结构变化 | 增删/移动节点、`innerHTML` 重写 |
| 内容变化 | 改文本、未声明尺寸的图片加载完成 |
| 盒模型样式更新 | `width` / `padding` / `margin` / `border` / `top` / `font-size`… |
| 视口变化 | 窗口 resize、设备旋转（**每次都重新 layout**） |
| 伪类/类切换 | `:hover` 加边框、切换影响尺寸的 class |
| **读取几何属性** | 不改任何东西也能逼出一次布局（下一页） |

</v-click>

<v-click>

> MDN：**reflow 会引发 repaint 和 re-composite**——重排永远不是单独付费。

</v-click>

<!--
reflow 不是另一种计算，而是同一套几何计算的再执行，触发条件是 render tree 被修改。MDN 的量化感受：加载时 20ms 的布局没问题，动画滚动中的布局必然 jank。
-->

---

# 强制同步布局

不改任何东西，**读一下**也能逼出一次布局

<v-click>

```js
el.style.width = "300px"; // 写：布局失效，本想攒到帧末统一算
console.log(el.offsetHeight); // 读：为给你准确值，被迫当场跑一次 layout
```

</v-click>

<v-click>

- 正常节奏是**攒批**：改样式不立刻重排，失效标记攒到本帧渲染时机统一算一次
- 高危读取（有待处理样式改动时）：`offsetTop/Left/Width/Height`、`clientWidth/Height`、`scrollTop/scrollHeight`、`getBoundingClientRect()`、`getComputedStyle()` 几何值、`focus()`、`scrollIntoView()`

</v-click>

<v-click>

> 单次强制布局只是「把账提前结」；**灾难是在循环里反复结账**——下一页。

</v-click>

<!--
浏览器默认攒批重排，但读取依赖最新布局的几何属性会打断攒批：为了不给旧值，只能当场同步执行布局。
-->

---

# layout thrashing：好坏对比

循环里交替「写样式 → 读几何」，每圈强制一次布局

<v-click>

```js
// ❌ 坏：每圈 读 offsetWidth（逼布局）→ 写 width（又失效布局）→ 下圈再逼
// n 个元素 = n 次强制同步布局，帧预算瞬间爆掉
boxes.forEach((box) => {
  box.style.width = container.offsetWidth / 2 + "px";
});

// ✅ 好：读写分离——先集中读一次，再集中写
// 布局只失效一批，帧末统一重算一次
const half = container.offsetWidth / 2; // 读：至多逼一次布局
boxes.forEach((box) => {
  box.style.width = half + "px"; // 写：不再穿插读取
});
```

</v-click>

<!--
坏版每次循环都读 offsetWidth 又写 width，n 个元素就是 n 次强制同步布局。好版只在循环外读一次，写入不再穿插读取。
-->

---

# 药方：批处理法则

读写分离是纲

<v-click>

- **帧内先读后写**：所有测量放前面，所有修改放后面
- **缓存几何值**：布局没变的前提下，第一次读完存变量，别反复问浏览器
- **写入对齐帧**：连续视觉更新放进 `requestAnimationFrame` 回调，天然与渲染批次对齐
- **动画绕开布局**：位移缩放用 `transform`、显隐用 `opacity`——把工作推给合成器（下一章）

</v-click>

<v-click>

> DevTools 佐证：Performance 面板紫色 Layout 块的红三角警告「Forced reflow is a likely performance bottleneck」，就是在指认强制同步布局。

</v-click>

<!--
四条法则层层递进：先读后写、缓存测量、写入进 rAF、动画绕开布局。MDN 的结论也直白：批量更新，避免对盒模型属性做动画。
-->

---
layout: section
---

# 绘制与合成

从绘制指令到图层拼帧

---

# paint：产出指令，而非像素

主线程遍历 layout tree，生成 **paint records（绘制记录）**

<v-click>

- Chrome 原文形容：绘制过程的记录——「**先背景、然后文字、然后矩形**」
- 真正生成像素的是后面的**栅格化**；指令可缓存、复用、跨线程搬运
- MDN：首次绘制画整屏，**此后只重绘受影响的最小区域**
- RenderingNG 里 paint records 演化为 **display list**（最后一章）

</v-click>

<v-click>

> 单独的 repaint 很少是瓶颈；贵的是被 reflow **连坐**与高频重绘大面积区域。

</v-click>

<!--
paint 不直接画像素，产出的是指令。指令与像素分离是现代渲染的关键设计：指令可以缓存、复用、跨线程搬运。
-->

---

# 绘制顺序：stacking context

Chrome：按 HTML 标记顺序绘制而不考虑 z-index，**会画错**

<v-click>

- 顺序由 **CSS painting order** 决定：整体**自后向前（back-to-front）**分层压画
- **负 z-index 画到背景之后**——所以 paint records 必须全局排序，不能按文档流一路画
- **stacking context（层叠上下文）是排序的作用域**：`position`+`z-index`、`opacity<1`、`transform`、`filter` 等都会创建
- 上下文内的内容**作为整体**参与外层排序，内部 z-index 出不了这个门

</v-click>

<v-click>

> 改一个元素的外观，同 stacking context 内与它重叠的内容可能一并重绘——z-index 混战也在放大 paint 失效面。

</v-click>

<!--
绘制阶段要解决先画谁的问题。stacking context 既是理解 z-index 的钥匙，也影响绘制失效的粒度。
-->

---

# 合成：把页面拆成图层

Chrome：拆成多个图层**分别栅格化**，在**合成器线程**拼成页面

<v-click>

| 触发成层 | 说明 |
| --- | --- |
| `<video>` / `<canvas>` | 内容独立更新，天然适合单层 |
| `opacity`（动画场景） | 视觉效果可在合成时应用 |
| 3D `transform`（`translateZ` 等） | 变换在合成时应用 |
| `will-change: transform` | **显式提示**：要动，请预建层 |
| `position: fixed/sticky`、滚动容器 | 独立滚动/固定（实现相关） |

</v-click>

<v-click>

- **滚动/动画时图层已栅格化好**，只需移动图层、合成新帧——能用挪的就不重画
- 经典模型：主线程 layout 后生成 **layer tree**；元素成层后子孙跟着进同层

</v-click>

<!--
如果每帧都重跑 paint 加栅格化，帧预算根本不够。合成的思路是栅格化成果按层缓存，滚动和动画只改拼装参数。
-->

---

# will-change：收益与图层爆炸

给「应该独立成层却没被自动分层」的部分**预建图层**

<v-click>

```css
/* 侧滑菜单：即将频繁 transform，动画前预建图层 */
.side-menu {
  will-change: transform;
}
```

</v-click>

<v-click>

- 收益：动画开始时免做「成层 + 栅格化」的准备工作，**避免首帧卡顿**
- Chrome 冷水：「**跨过多图层做合成，可能比每帧重新栅格化页面小块更慢**」——要实测
- 层的代价在 **GPU 内存**：每层都持有栅格化纹理，移动端尤其敏感——图层爆炸反噬性能

</v-click>

<v-click>

> 纪律：预建节制、**动画结束移除 `will-change`** 释放资源、以实测为准。

</v-click>

<!--
will-change 是双刃剑：预建层避免首帧卡顿，但层耗 GPU 内存。无脑全局撒网是反模式，Chrome 官方强调测量你的应用渲染性能至关重要。
-->

---

# 从瓦片到 compositor frame

commit 之后，这段流水线**不再需要主线程**

<v-click>

```text
主线程 ──commit──▶ 合成器线程：把大图层切成瓦片（tiles）
                        ▼ 分发给多个栅格线程
                  栅格化 → 存入 GPU 内存（视口内及附近优先）
                        ▼
                  draw quads（瓦片位置信息）→ 组装 compositor frame
                        ▼ 经 IPC 提交
                  GPU：把合成器帧画上屏幕
```

</v-click>

<v-click>

- **compositor frame（合成器帧）** = 代表页面一帧的 draw quads 集合
- 滚动时合成器**直接生成下一帧**——瓦片早就栅格化好，改的只是拼装参数

</v-click>

<!--
图层可能很大（整页长的文档流），所以切瓦片调度，视口附近优先。经典文里帧交给浏览器进程转 GPU，现代由 Viz 进程统一聚合。
-->

---

# transform/opacity 为什么便宜

Chrome：**仅合成的动画**是流畅性能的最佳选择

<v-click>

| 动画属性 | 重跑阶段 | 线程 | 主线程卡顿时 |
| --- | --- | --- | --- |
| `width` / `top` / `margin` | layout + paint + composite | 主线程为主 | **动画冻结** |
| `background` / `box-shadow` | paint + composite | 主线程为主 | **动画冻结** |
| **`transform` / `opacity`**（已成层） | 仅 composite | **合成器线程** | **照常丝滑** |

</v-click>

<v-click>

```css
.bad  { transition: left 0.3s, width 0.3s; }        /* ❌ 每帧 layout+paint */
.good { transition: transform 0.3s, opacity 0.3s; } /* ✅ 仅合成，不等主线程 */
```

</v-click>

<v-click>

> 合成器线程**不需要等待样式计算或 JavaScript 执行**——这是各种动画军规的原理出处。

</v-click>

<!--
位移用 translate 不用 top/left、缩放用 scale 不用改 width、显隐过渡用 opacity——这些军规的原理都在这张表里。
-->

---
layout: section
---

# 帧生命周期与输入

帧预算、rAF/rIC 与滚动快速通道

---

# 帧预算 = 1000ms ÷ 刷新率

错过一拍这帧顺延，用户看到的就是卡顿（jank）

<v-click>

| 刷新率 | 每帧预算 | 场景 |
| --- | --- | --- |
| 60Hz | ≈**16.7ms** | 多数外接屏/中端机 |
| 90Hz | ≈11.1ms | 部分安卓机 |
| 120Hz | ≈**8.3ms** | ProMotion / 高刷旗舰 |

</v-click>

<v-click>

- MDN：占据主线程的一切——样式计算、reflow、paint——必须在 **16.67ms** 内完成（以 60Hz 为例）
- 预算内要装下：输入回调 + rAF + style + layout + paint + commit（主线程部分）

</v-click>

<v-click>

> 目标是**匹配显示器刷新率**，不是写死 60fps。

</v-click>

<!--
显示器按固定节奏刷新，浏览器出帧的目标就是跟上刷新率。高刷屏预算减半，这就是别写死 60fps 的原因。
-->

---

# 一帧之内发生什么

主线程的标准编排

<v-click>

```text
vsync ▶ 输入事件回调（合并后的 mousemove/touchmove 在此分发）
      ▶ requestAnimationFrame 回调    ← 视觉更新写在这里
      ▶ style → layout → paint → commit 给合成器线程
      ▶ 合成器接手：栅格化 → compositor frame → 送屏
      ▶ （若有富余）requestIdleCallback 空闲回调
```

</v-click>

<v-click>

- **不是每帧全跑**：没有失效就跳过对应阶段（没改几何就没有 layout）；一旦超预算，后面的 vsync 只能干等
- 渲染任务与 JS 任务**共享主线程**；宏微任务如何插队归事件循环章，这里只管帧内时序

</v-click>

<!--
一帧内主线程按输入、rAF、style/layout/paint、commit 编排，之后合成器接手，空闲期跑 rIC。这张时序图是后面几页的地图。
-->

---

# 主线程 vs 合成器线程

流畅的分工

<v-click>

| | 主线程 | 合成器线程 |
| --- | --- | --- |
| 干什么 | JS、样式、layout、paint、hit test、事件分发 | 拼帧、滚动、合成器动画、图层管理 |
| 被 JS 阻塞？ | 会 | **不会**——「不需要等待样式计算或 JS 执行」 |
| 滚动 | 仅当需要跑监听器时介入 | **默认在这里**：瓦片已栅格化，换偏移重新拼帧 |

</v-click>

<v-click>

> 「页面 JS 卡成狗、滚动依然顺滑」的原理——但这条快速通道**有条件**，一个不当的监听就能把它拖回主线程。

</v-click>

<!--
滚动默认走合成器线程的独立通道，这是流畅的本质。但快速通道有条件，后面两页讲输入事件怎么把它拖回主线程。
-->

---

# rAF：渲染前的黄金位置

Chrome 建议：用 `requestAnimationFrame()` 把 JS 操作切小块，安排在每一帧

<v-click>

```js
// 用 rAF 驱动动画：每帧执行一次，自动匹配 60Hz/120Hz
function tick(timestamp) {
  // timestamp 是本帧时间基准；用它算进度，别自己攒帧数
  box.style.transform = `translateX(${Math.min(progress(timestamp), 100)}%)`;
  if (!done) requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
```

</v-click>

<v-click>

- 时机：本帧渲染步骤（style/layout/paint）**之前**，与刷新率对齐
- 为什么不用 `setTimeout(fn, 16)`：不与 vsync 对齐、受任务队列影响，注定漂移掉帧；120Hz 上 16ms 本身就是错的节拍
- **rAF 里读几何最危险**：改样式后立刻读 `offsetWidth` 就是标准的强制同步布局

</v-click>

<!--
rAF 回调在本帧渲染步骤之前执行，是做视觉更新的标准位置。用 timestamp 算进度而不是攒帧数，才能自适应不同刷新率。
-->

---

# rIC：帧的边角料

一帧的活提前干完，到下一个 vsync 之间的**空闲期**

<v-click>

```js
requestIdleCallback((deadline) => {
  // deadline.timeRemaining()：本次空闲还剩多少毫秒
  while (deadline.timeRemaining() > 0 && tasks.length) {
    processNext(tasks); // 埋点上报、预热缓存等可推迟的低优工作
  }
}, { timeout: 2000 }); // 兜底：迟迟没空闲也要在 2s 内执行
```

</v-click>

<v-click>

- 只放**可推迟的低优先级工作**
- 纪律：rIC 里**不要改 DOM**——改了会在下一帧引发布局，等于把「空闲工作」变成「下一帧的账单」；要改就转投一个 rAF

</v-click>

<!--
rIC 把低优工作填进帧的空隙，timeout 参数兜底保证迟迟没空闲也能执行。改 DOM 请转投 rAF。
-->

---

# 输入事件路由与 hit test

「输入」指用户的一切手势：滚轮、触摸、鼠标移动都算

<v-click>

```text
用户手势
   ▼
浏览器进程（先收到；只知道手势发生在哪个坐标）
   ▼ 事件类型 + 坐标
渲染进程 · 合成器线程 ── 不涉及主线程监听？──▶ 直接拼新帧（快速通道）
   ▼ 落在非快速滚动区 / 需要跑监听
渲染进程 · 主线程：hit test 找目标 → 分发事件、执行监听器
```

</v-click>

<v-click>

- **浏览器进程只是邮差**：页面内容归渲染进程管，它只转交事件类型与坐标
- **hit test（命中测试）**：主线程**基于 paint records 数据**按坐标查找命中元素，再走捕获/冒泡分发

</v-click>

<!--
输入先到浏览器进程，但它只知道坐标不认识页面，转交给渲染进程。合成器线程能自己处理就不惊动主线程，需要监听器才做 hit test。
-->

---

# 非快速滚动区

一行监听毁掉丝滑滚动

<v-click>

- 页面绑定相关监听时，合成器把「附加了事件处理器的区域」标为**非快速滚动区**
- 区**外**输入 → 合成器不等主线程，直接合成新帧滚动
- 区**内**输入 → 事件必须先发主线程（万一监听器 `preventDefault()` 取消滚动呢）——**滚动开始前先等一趟主线程往返**

</v-click>

<v-click>

```js
// ❌ 委托到 document.body：合成器无法预知哪些区域有监听，
//    只能把整页标成非快速滚动区——所有滚动都得先问主线程
document.body.addEventListener("touchstart", (event) => {
  if (event.target === area) event.preventDefault();
});
```

</v-click>

<!--
最大的坑是事件委托：委托到 document 或 body 会把整页标成非快速滚动区，主线程忙时就是肉眼可见的滚动迟滞。
-->

---

# passive 与 touch-action

两个官方解法，救回快速通道

<v-click>

```js
// ✅ passive: true —— 向浏览器承诺「不会 preventDefault」
//    合成器不等主线程结果，立刻继续合成新帧（监听器照常异步执行）
document.body.addEventListener("touchstart", (event) => {
  // passive 监听里 preventDefault 无效；需要时先查 event.cancelable
  if (event.target === area && event.cancelable) event.preventDefault();
}, { passive: true });
```

</v-click>

<v-click>

```css
/* ✅ CSS touch-action：声明式禁掉默认手势，压根不需要 JS 监听 */
.drawing-area { touch-action: pan-y; /* 只允许纵向滚动，横向手势留给自己 */ }
```

</v-click>

<v-click>

> 定调：`passive: true` 不是「让回调跑得快」，而是**解除「滚动等待监听结果」的依赖**。

</v-click>

<!--
passive 承诺不取消默认行为，合成器就不用等主线程。touch-action 更进一步，用 CSS 声明式关掉手势，压根不需要监听。
-->

---

# 事件合并：mousemove 为何淹不死主线程

输入频率高于刷新率：触摸屏每秒 60–120 次、鼠标约 100 次

<v-click>

- **连续事件**（`wheel` / `mousemove` / `pointermove` / `touchmove`）：**合并（coalesce）**，延迟到**下一次 rAF 前**分发——一帧至多一发
- **离散事件**（`keydown` / `mousedown` / `touchstart`…）：**立即分发**不合并——点击/按键丢一个都是事故

</v-click>

<v-click>

```js
window.addEventListener("pointermove", (event) => {
  // 一次回调拿回本帧内被合并的全部中间点，笔迹不断线
  for (const e of event.getCoalescedEvents()) drawPoint(e.pageX, e.pageY);
});
```

</v-click>

<v-click>

> 给 `pointermove` 手写 `throttle(16)` 多半是多余的——引擎已按帧合并；节流的正当场景是进一步**降频**。

</v-click>

<!--
逐条分发既浪费又压垮主线程，所以连续事件按帧合并、离散事件立即发。绘图板要完整轨迹就用 getCoalescedEvents 找回中间点。
-->

---
layout: section
---

# 现代架构 RenderingNG

12 阶段、四棵树与 Viz

---

# 为什么要重写

2018 经典管线「**先分层、后绘制**」攒下的实现债

<v-click>

- 分层决策在 paint **之前**：主线程必须提前猜「谁会动」——猜错就是**图层爆炸**（层堆内存）或**错失合成机会**
- transform/clip/scroll 语义全挂在 layer tree 上，层的增删**连坐**一大片状态
- 布局对象可变、互相引用：增量布局和并行化都难做

</v-click>

<v-click>

> RenderingNG（2021 年宣布完成主体）的答案：把「内容」与「怎么合成」**解耦成独立数据结构**（property trees / display list / fragment tree），管线拆成**可单独跳过的 12 个阶段**。

</v-click>

<!--
经典模型是先分层后绘制，主线程要提前猜谁会动。RenderingNG 用数据结构解耦和阶段化管线来还这些债。
-->

---

# 12 阶段管线（上）：1–6

前段在渲染进程

<v-click>

| # | 阶段 | 干什么 | 位置 |
| --- | --- | --- | --- |
| 1 | **animate** | 按时间线随时间改计算样式、**改写 property trees** | 主线程/合成器 |
| 2 | **style** | 把 CSS 应用到 DOM，产出 computed styles | 主线程 |
| 3 | **layout** | 确定尺寸位置，产出**不可变 fragment tree** | 主线程 |
| 4 | **pre-paint** | 计算 **property trees**；按需失效旧产物 | 主线程 |
| 5 | **scroll** | 更新滚动偏移——**通过改写 property trees** | 主线程/合成器 |
| 6 | **paint** | 产出 **display list** | 主线程 |

</v-click>

<!--
前 6 阶段主要在渲染进程主线程：动画、样式、布局、pre-paint 算属性树、滚动、绘制。注意滚动和动画都是通过改写 property trees 实现的。
-->

---

# 12 阶段管线（下）：7–12

后段在合成器线程与 Viz 进程

<v-click>

| # | 阶段 | 干什么 | 位置 |
| --- | --- | --- | --- |
| 7 | **commit** | property trees + display list **拷贝**给合成器 | 主 → 合成器 |
| 8 | **layerize** | 把 display list 切成 **composited layer list** | 合成器线程 |
| 9 | **raster / decode** | 变成 **GPU 纹理瓦片** | 合成器 → **Viz（GPU）** |
| 10 | **activate** | 生成 compositor frame | 合成器线程 |
| 11 | **aggregate** | **所有**可见 compositor frame 合并成全局帧 | **Viz** |
| 12 | **draw** | 在 GPU 上执行聚合帧，产出屏幕像素 | **Viz（GPU）** |

</v-click>

<v-click>

> **阶段可跳过**：纯视觉效果动画与滚动可跳过 layout / pre-paint / paint——**整段在合成器线程，主线程零参与**。

</v-click>

<!--
后 6 阶段从 commit 开始离开主线程。阶段可跳过是经典模型 transform 动画便宜这个结论在新架构下的精确版本。
-->

---

# property trees：四棵树

取代「单一 layer tree 承载一切」的旧心智

<v-click>

| 树 | 承载 | 例子 |
| --- | --- | --- |
| **transform** | CSS transform 与滚动平移 | `translateX(…)`、滚动偏移 |
| **clip** | overflow 裁剪 | `overflow: hidden` 的裁剪矩形 |
| **effect** | 视觉效果 | opacity、filter、mask、blend mode |
| **scroll** | 滚动信息与滚动链 | 谁可滚、怎么链式传递 |

</v-click>

<v-click>

- 拓扑是 **DOM 的稀疏表示**；每个元素携带**四元组状态**——最近的 transform/clip/effect/scroll 祖先节点
- 算屏上位置沿树向上乘变换即可，**不需要遍历庞大的 DOM/layer 结构**
- 为什么四棵：**滚动只作用于包含子树**，`absolute/fixed` 常**逃出**祖先滚动器——硬塞一棵树正是图层爆炸的病根之一

</v-click>

<!--
四棵独立属性树把怎么动、怎么裁、加什么效果、怎么滚从 layer tree 中拆出来。滚动与其他视觉效果的拓扑天然错位，这是分四棵的根本原因。
-->

---

# LayoutNG：不可变 fragment tree

layout 的输出不再是可变的布局对象网

<v-click>

- fragment tree 表示所有元素的位置与尺寸，**不含 transform**——transform 归 property trees 管（解耦的体现）
- 两条纪律保证不可变：**禁止向上引用**（子不指父）、**禁止数据上浮**（子只读自己子树）
- **增量布局**：复用旧树绝大部分，只重建从变化点到根的「脊柱」——工作量与实际变化成正比
- 内联文本用**平面列表** + inline cursor 游标：遍历只是数组偏移递增，**快且省内存**
- 官方展望：不可变树可**跨线程传递**、做**并行推测布局**

</v-click>

<!--
不可变性靠禁向上引用、禁数据上浮两条纪律换来。收益是增量布局：大多数布局是增量更新，只重建从变化点到根的脊柱。
-->

---

# CompositeAfterPaint：先画后分层

分层决策移到 **paint 之后**、由**合成器侧**做出

<v-click>

- **display item**：可被 **Skia** 栅格化的低级绘制命令；没变的直接**复用**上次的，stacking context 没变就整段跳过
- **paint chunk**：共享同一 property tree state 四元组的**连续 display items** 分成一组
- **layerize 默认合并**：只把「合成器要独立动的」（合成器滚动 / transform 动画）保持独立——反图层爆炸

</v-click>

<v-click>

> 修正旧心智：现代 Chromium 主线程**不再产出 layer tree**——「分几层」是对 paint chunks 的后置决策；但「层耗内存、别滥用 `will-change`」的纪律不变。

</v-click>

<!--
2018 版文章说主线程在 layout 后建 layer tree，现代已改为先 paint 后 layerize。极端方案每 chunk 一层会迅速耗尽 GPU 内存，所以默认合并。
-->

---

# Viz 进程：聚合与 GPU 光栅化

「最终画到屏幕」独立成进程，**全系统一个**

<v-click>

- **display compositor thread**：把每个渲染进程 + 浏览器 UI 的 compositor frame **聚合（aggregate）**成单一全局帧；须时刻响应
- **GPU main thread**：**GPU 光栅化是默认路径**（光栅任务从渲染进程发到 Viz、在 GPU 上执行），并执行最终 **draw**
- **surface 机制**：每帧带 surface ID，别的帧用 surface draw quad 按 ID 引用嵌入——跨站 iframe 就这样嵌进父页帧
- 站点隔离贯通渲染层：不同站点必在不同渲染进程（OOPIF），各自产帧、Viz 统一拼装

</v-click>

<!--
经典文里合成器帧交给浏览器进程转 GPU，现代由独立的 Viz 进程统一聚合与绘制。surface ID 串起跨进程嵌套，性能隔离与安全隔离一次拿到。
-->

---

# 术语映射：两套话语对上号

经典模型管直觉，RenderingNG 管真相——**代价链在新架构下依然成立**

<v-click>

| 经典（2018 / MDN） | RenderingNG |
| --- | --- |
| render tree / layout tree | **不可变 fragment tree**（LayoutNG） |
| paint records | **display list**（items → paint chunks） |
| layer tree（主线程、layout 后） | **composited layer list**（paint 后 layerize） |
| layer tree 承载变换/裁剪/滚动 | **property trees** 四棵树 |
| 帧交浏览器进程转 GPU | 提交 **Viz**：聚合 + GPU draw |
| renderer 内 raster threads | **Viz GPU 光栅化**（默认） |
| style→layout→paint→composite | **12 阶段**，可按需跳过 |

</v-click>

<!--
经典 5 步仍是有效心智模型：MDN 用它讲授、面试用它提问，且可跳过阶段让代价链更精确。DevTools 里看到 pre-paint、layerize 时，知道它们落在旧模型哪个格子里即可。
-->

---
layout: center
class: text-center
---

# 小结

从字节流到像素，一条流水线贯穿始终

<v-click>

- **主线**：DOM → CSSOM → render tree → layout → paint → composite
- **代价链**：layout > paint > composite——每个样式选择都在选管线深度
- **解析**：JS 暂停解析、CSS 阻塞渲染与 JS；preload scanner 并行救场
- **布局纪律**：读写分离防 layout thrashing；动画只碰 `transform`/`opacity`
- **帧与输入**：预算 = 1000ms ÷ 刷新率；合成器不等 JS；`passive` 救滚动
- **RenderingNG**：property trees、LayoutNG、CAP、Viz——12 阶段可按需跳过

</v-click>

<v-click>

> 先问「**落在管线哪一步**」，再问「**在哪个线程执行、要不要等主线程**」。

</v-click>

<!--
六条收束全章。经典模型建立直觉，RenderingNG 对齐引擎真相，判断框架就是那两问：哪一步、哪个线程。
-->

---
layout: center
class: text-center
---

# 谢谢

浏览器渲染原理 · 从字节流到屏幕像素

<div class="mt-8 text-gray-400">
基于 Chromium 现代架构 · 面向前端工程师
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
全章覆盖经典 5 步渲染管线、HTML/CSSOM 解析、布局重排、绘制合成、帧生命周期与输入、现代架构 RenderingNG。感谢观看。
-->
