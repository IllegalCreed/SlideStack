---
theme: seriph
background: https://cover.sli.dev
title: CSS 响应式与现代查询
info: |
  CSS 现代响应式 —— 媒体查询 / 用户偏好 / 容器查询 / @supports / 逻辑属性 / 多列
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:css-3 class="text-8xl" />
</div>

<br/>

## CSS 响应式与现代查询

让样式随环境变化的五件套（基于 CSS 现代标准 · 2026-06）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
响应式早已不只是媒体查询。现代 CSS 有一整套工具让样式随环境变化——这一章把它们摆在一起逐件拆解。
-->

---
transition: fade-out
---

# 这一章讲什么

「响应式」早已不只是媒体查询

<v-click>

- **按视口**：媒体查询 + 现代 range 语法（`width >= 600px`）
- **按用户**：`prefers-color-scheme` / `prefers-reduced-motion`（无障碍）
- **按容器**：`container-type` + `@container`（组件级）
- **按能力**：`@supports` 渐进增强
- **按方向**：逻辑属性 + `writing-mode`（i18n）

</v-click>

<v-click>

> 多了一类工具：多列 `columns`，按可用宽度自动分栏，无需断点。

</v-click>

---

# 五个维度，正交互补

| 工具 | 决策依据 | 层级 |
| --- | --- | --- |
| `@media` | 视口 / 设备 | 页面级 |
| `@media (prefers-*)` | 系统偏好 | 无障碍 |
| `@container` | 祖先容器 | 组件级 |
| `@supports` | 浏览器能力 | 能力级 |
| 逻辑属性 | 书写方向 | 方向级 |

<v-click>

**媒体**问视口多大；**容器**问我所在容器多大；**`@supports`** 问浏览器支不支持；**逻辑属性**让方向自动跟随书写模式。

</v-click>

---
layout: section
---

# 媒体查询与 range 语法

按视口与设备决策，最经典的响应式工具

---

# 媒体查询的结构

一条查询 = 媒体类型 + 媒体特征 + 逻辑操作符

```css
@media screen and (width >= 900px) {
  article { padding: 1rem 3rem; }
}
```

<v-click>

- **类型**：`screen` / `print` / `all`（默认，可省）
- **特征**：括号里的条件，如 `(width >= 900px)`，**必须带括号**
- **操作符**：`and` / `,` / `not` / `only` 组合条件

</v-click>

---

# 三种媒体类型

| 类型 | 含义 |
| --- | --- |
| `all` | 全部（默认，省略时即此） |
| `screen` | 屏幕 |
| `print` | 打印 / 打印预览 |

<v-click>

Level 4 起 `tv`、`handheld`、`projection` 等类型**全部废弃**——别再用。

</v-click>

---

# 现代 range 语法

用比较运算符写区间，比 `min-/max-` 直观

```css
/* 旧写法：min-/max- 前缀 */
@media (min-width: 600px) { /* … */ }

/* 现代 range 语法 */
@media (width >= 600px) { /* … */ }
@media (width < 600px)  { /* … */ }
```

<v-click>

运算符：`<` `<=` `>` `>=` `=`，自 2023 起 Baseline 广泛可用。

</v-click>

---

# 双端闭区间：一行搞定

过去要 `and` 拼两段，现在一行写完

```css
/* 旧写法 */
@media (min-width: 400px) and (max-width: 700px) { /* … */ }

/* 现代写法 */
@media (400px <= width <= 700px) { /* … */ }
```

<v-click>

| range 语法 | 传统等价 |
| --- | --- |
| `(width >= 900px)` | `(min-width: 900px)` |
| `(width <= 500px)` | `(max-width: 500px)` |

</v-click>

---

# `>` 与 `>=` 不是一回事

边界差整 1px，能精确避开重叠

| range 语法 | 传统等价 |
| --- | --- |
| `(width >= 900px)` | `(min-width: 900px)` |
| `(width > 900px)` | `(min-width: 901px)` |
| `(width < 500px)` | `(max-width: 499px)` |

<v-click>

::: tip 边界重叠
旧写法里 `min-width: 900px` 与 `max-width: 900px` 会**同时命中 900px** 导致打架；range 用 `<` / `<=` 精确避开。
:::

</v-click>

---

# 逻辑操作符：`and` 与 `,`

`and` 全真，逗号（或 `or`）任一真

```css
@media screen and (width >= 900px) and (orientation: landscape) {
  /* 屏幕、宽 ≥ 900px、横向，三者都满足 */
}

@media screen, print {
  body { line-height: 1.4; }
}
```

<v-click>

Level 4 起逗号也可写成 `or` 关键字，语义等价。

</v-click>

---

# 逻辑操作符：`not` 与 `only`

`not` 取反**整条**；`only` 屏蔽老浏览器

```css
@media not all and (hover: hover) {
  /* 没有 hover 能力的设备（纯触屏） */
}

@media only screen and (width <= 500px) {
  /* 不识别 only 的远古浏览器整条跳过 */
}
```

<v-click>

`only` **必须搭配媒体类型**；`not` 作用于整条查询，不是单个特征。

</v-click>

---

# 常用特征：尺寸与方向

```css
@media (width >= 768px) { /* 视口宽（含滚动条） */ }
@media (height < 600px) { /* 矮屏收起非必要区 */ }
@media (orientation: landscape) { /* 横向 */ }
@media (aspect-ratio >= 16/9) { /* 视口宽高比 */ }
@media (resolution >= 2dppx) { /* 高密度屏，换 2x 图 */ }
```

<v-click>

`orientation` 取 `portrait` / `landscape`；`resolution` 用 `dppx` 判断 Retina。

</v-click>

---

# 交互特征：`hover` 与 `pointer`

探测输入设备的精度与悬停能力

```css
@media (hover: hover) and (pointer: fine) {
  .menu:hover .submenu { display: block; }
}
@media (pointer: coarse) {
  .btn { min-height: 44px; } /* 手指：加大点区 */
}
```

<v-click>

- `hover`：`hover` / `none`
- `pointer`：`fine`（鼠标）/ `coarse`（手指）/ `none`
- `any-hover` / `any-pointer`：换成判断「**任一**输入」

</v-click>

---

# 无障碍：断点用相对单位

`em` / `rem` 会跟随用户字号缩放

```css
/* 推荐：放大字体的用户更早进入宽松布局 */
@media (width >= 40em) { /* … */ }

/* 不推荐：固定像素，无视用户缩放 */
@media (width >= 640px) { /* … */ }
```

<v-click>

断点优先 `em` / `rem`，裸 `px` 不随用户缩放——这是一条无障碍细节。

</v-click>

---
layout: section
---

# 用户偏好查询

从「适配设备」推进到「尊重用户」

---

# 为什么需要用户偏好

上一组问「屏幕多大」；这一组问「**用户勾选了什么**」

<v-click>

读取的是操作系统 / 浏览器层面的设置：

- `prefers-color-scheme`：明暗
- `prefers-reduced-motion`：减弱动效
- `prefers-contrast`：对比度
- `prefers-reduced-data`：省流量

</v-click>

<v-click>

> 这不是锦上添花，而是「不照做就可能伤害到部分用户」的底线。

</v-click>

---

# `prefers-color-scheme`：暗色模式

默认浅色放外面，系统暗色时覆盖变量

```css
:root { --bg: #ffffff; --fg: #1a1a1a; }

@media (prefers-color-scheme: dark) {
  :root { --bg: #0d1117; --fg: #e6edf3; }
}
body { background: var(--bg); color: var(--fg); }
```

<v-click>

取值 `light` / `dark`。配 CSS 变量，暗色就只是「换一组变量值」。

</v-click>

---

# 暗色三件套

`prefers-color-scheme` 只切**你写的页面色**

```css
:root {
  color-scheme: light dark; /* 让原生控件也跟随明暗 */
}
```

<v-click>

浏览器默认 UI（表单、滚动条、根背景）要靠 `color-scheme` 切：

- `color-scheme` → 原生控件
- `prefers-color-scheme` → 页面色
- CSS 变量 → 集中切换

</v-click>

---

# `prefers-reduced-motion`：减弱动效

最该认真对待——前庭失调 / 晕动症用户会头晕

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

<v-click>

用户在系统里开「减弱动态效果」时，查询命中 `reduce`。

</v-click>

---

# 更推荐：反过来写

默认无动效，只在「未要求减弱」时加上

```css
.card { transform: none; } /* 默认静态，人人安全 */

@media (prefers-reduced-motion: no-preference) {
  .card { transition: transform 0.3s ease; }
  .card:hover { transform: translateY(-4px); }
}
```

<v-click>

好处：「减弱」是默认安全态，不靠 `!important` 覆盖，逻辑更清晰。

</v-click>

---

# 对比度与省流量

```css
@media (prefers-contrast: more) {
  .btn { border: 2px solid currentColor; }
}
@media (prefers-reduced-data: reduce) {
  .hero { background-image: url("hero-small.jpg"); }
}
```

<v-click>

- `prefers-contrast`：`more` / `less` / `custom` / `no-preference`
- `prefers-reduced-data`：`reduce`（省流量）
- 两者较新，**纯渐进增强**——不命中回退默认

</v-click>

---

# 在 JS 里读取偏好

`matchMedia` 读取并监听变化

```js
const dark = window.matchMedia("(prefers-color-scheme: dark)");
console.log(dark.matches); // true / false

dark.addEventListener("change", (e) => {
  console.log(e.matches ? "切到暗色" : "切到浅色");
});
```

<v-click>

用户切换系统主题时可实时响应。

</v-click>

---
layout: section
---

# 容器查询

把响应式从页面级带到组件级

---

# 为什么需要容器查询

媒体查询只知**视口**多大，不知组件**被放在哪**

<v-click>

> 同一张卡片，放进 320px 侧栏该竖排，放进 900px 正文该横排——可它们在同一视口里，媒体查询给不出不同答案。

</v-click>

<v-click>

容器查询让组件按「**自己所在容器的尺寸**」排版——同一组件丢进任何宽度容器都自适应。这才是真正的组件级响应式。

</v-click>

---

# 两步走

① 父声明容器 → ② 后代用 `@container` 查询

```css
.card-wrap {
  container-type: inline-size; /* 第一步：声明 */
}

@container (width >= 30em) { /* 第二步：查询 */
  .card {
    display: grid;
    grid-template-columns: 8rem 1fr;
  }
}
```

<v-click>

查询条件支持 `width` / `height` / `inline-size` / `aspect-ratio` 等，运算符同 range 语法。

</v-click>

---

# `container-type` 三取值

| 取值 | 含义 |
| --- | --- |
| `inline-size` | 只查 inline 轴（横排即宽度），**最常用** |
| `size` | 查双轴，需容器自带确定高度 |
| `normal` | 默认，不作尺寸容器（可做 style 查询） |

<v-click>

::: warning inline-size 查不了宽高比
`inline-size` 只约束 inline 轴，查不了 `aspect-ratio` / `height`——需 `size`，但 `size` 要求容器有确定高度否则塌陷。
:::

</v-click>

---

# 命名容器：精确指定查谁

`@container` 默认查**最近祖先**，命名可跨层

```css
.sidebar {
  container: sidebar / inline-size; /* 名字 / 类型 */
}

@container sidebar (width >= 20em) {
  .widget { display: flex; } /* 明确查 sidebar */
}
```

<v-click>

`container: <名字> / <类型>` 是 `container-name` + `container-type` 的简写。

</v-click>

---

# 容器查询长度单位

让尺寸按容器缩放，类似 `vw` / `vh` 之于视口

| 单位 | 含义 |
| --- | --- |
| `cqw` / `cqh` | 容器宽 / 高的 1% |
| `cqi` / `cqb` | 容器 inline-size / block-size 的 1% |
| `cqmin` / `cqmax` | `cqi` 与 `cqb` 中较小 / 较大者 |

<v-click>

```css
.card h2 { font-size: max(1.5em, 1.23em + 2cqi); }
```

常配 `min()` / `max()` 兜底；找不到容器时回退到小视口单位（`sv*`）。

</v-click>

---

# style 查询：按样式值查询

查容器的**计算样式**，最有用是查自定义属性

```css
@container style(--theme: dark) {
  .card { background: #0d1117; color: #e6edf3; }
}
@container style(--columns >= 3) {
  .grid { gap: 2rem; }
}
```

<v-click>

::: tip Baseline 提醒
size 查询 2023-02 起广泛可用；**style 查询较新**、支持仍在铺开——当渐进增强用，备好回退。
:::

</v-click>

---

# 容器查询 vs 媒体查询

| 维度 | `@media` | `@container` |
| --- | --- | --- |
| 决策依据 | 视口 / 设备 | 祖先容器尺寸 / 样式 |
| 适用层级 | 页面级 | 组件级 |
| 多处复用 | 每处写断点 | 一次定义到处适配 |

<v-click>

两者**互补而非替代**：媒体查询定页面骨架，容器查询让骨架里的每个组件自适应。

</v-click>

---
layout: section
---

# `@supports` 特性查询

用新 CSS 之前，先问浏览器支不支持

---

# 为什么需要特性查询

新特性分批落地——先问能力，再决定怎么写

```css
@supports (display: grid) {
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  }
}
```

<v-click>

声明**必须带括号**。它测的是「这个属性能否接受这个值」，不只是属性名是否认识。这是「渐进增强」的核心工具。

</v-click>

---

# `not`：不支持时降级

写回退最常用的形式

```css
.box { aspect-ratio: 16 / 9; } /* 现代浏览器 */

@supports not (aspect-ratio: 1) {
  .box {
    position: relative;
    padding-top: 56.25%; /* 老浏览器：9/16 撑高 */
  }
}
```

<v-click>

`not` 在浏览器**不支持**时才生效——专门给老浏览器喂回退。

</v-click>

---

# `and` / `or`：组合条件

混用时**必须加括号**定优先级

```css
@supports (position: sticky) or (position: -webkit-sticky) {
  .toolbar { position: sticky; }
}
```

<v-click>

::: warning 混用 and 与 or
`and` 和 `or` 同时出现时**必须用括号**，否则整条查询无效、被直接忽略：

```css
@supports (display: grid) and ((gap: 1rem) or (grid-gap: 1rem)) { /* … */ }
```
:::

</v-click>

---

# `selector()`：探测选择器

不止测属性，还能测选择器语法是否被支持

```css
@supports selector(:has(img)) {
  .card:has(img) { grid-template-rows: auto 1fr; }
}
```

<v-click>

对刚普及的 `:has()`、`:is()` 很有用。另有 `font-tech()` / `font-format()` 测字体，`at-rule()` 测 at-rule（如 `@scope`）。

</v-click>

---

# 渐进增强范式

「基础在外、增强在内」

```css
.menu > * { float: left; } /* 基础：人人可用 */

@supports (display: flex) {
  .menu { display: flex; gap: 0.5rem; }
  .menu > * { float: none; } /* 增强：升级 flex */
}
```

<v-click>

::: tip 何时不必用 @supports
若特性「不支持时自动忽略、且忽略不破坏布局」（如 `gap`），直接写、自然降级即可。
:::

</v-click>

---
layout: section
---

# 逻辑属性与书写模式

不靠查询，让方向自动跟随书写方向

---

# 物理属性的麻烦

`margin-left`、`text-align: right` 把方向**写死**

<v-click>

> 中英文从左到右（LTR），阿拉伯语 / 希伯来语从右到左（RTL）。一旦支持 RTL，所有 `left/right` 都要镜像翻转。

</v-click>

<v-click>

逻辑属性的思路：**不说「左右上下」，改说「开始 / 结束」**——让属性跟随内容流向，一套 CSS 同时适配 LTR 与 RTL。

</v-click>

---

# 两条轴：block 与 inline

与 Flexbox / Grid 的轴同一套思想

<v-click>

- **inline 轴**：文字**书写**方向（中英文水平左→右，阿拉伯语右→左）
- **block 轴**：内容**块**堆叠方向（中英文垂直上→下）

</v-click>

<v-click>

| 逻辑边 | LTR（中英） | RTL（阿语） |
| --- | --- | --- |
| `block-start` / `block-end` | 上 / 下 | 上 / 下 |
| `inline-start` | 左 | **右** |
| `inline-end` | 右 | **左** |

</v-click>

---

# 外边距、内边距、尺寸

物理换成 `*-inline` / `*-block` 系列

```css
.note {
  margin-inline-start: 1rem;     /* LTR 左、RTL 右 */
  padding-block: 0.5rem;          /* 上下一起设 */
  border-inline-start: 4px solid; /* 起始边竖条 */
  max-inline-size: 60ch;          /* 限制行长 */
}
```

<v-click>

`inline-size` / `block-size` 是 `width` / `height` 的逻辑版；`max-inline-size: 60ch` 限制行长尤其优雅。

</v-click>

---

# 定位与对齐

`inset-*` 替代 `top/right/…`，`start/end` 替代 `left/right`

```css
.badge {
  position: absolute;
  inset-block-start: 0.5rem;
  inset-inline-end: 0.5rem; /* RTL 下自动跑到左上 */
}
.cell { text-align: end; } /* LTR 在右、RTL 在左 */
```

<v-click>

视口单位也有逻辑版：`vi`（≈ `vw`）/ `vb`（≈ `vh`）；圆角如 `border-start-start-radius`。

</v-click>

---

# 书写模式：总开关

逻辑属性绑定到 `writing-mode` 与 `direction`

```css
.rtl-block { direction: rtl; }
.vertical { writing-mode: vertical-rl; } /* 竖排 */
```

<v-click>

- `direction`：`ltr` / `rtl`（推荐用 HTML `dir` 属性设，语义更完整）
- `writing-mode`：`horizontal-tb` / `vertical-rl` / `vertical-lr`

方向一变，所有 `*-inline` / `start` / `end` 自动跟随。

</v-click>

---

# 经典坑：图标 + 文字

`margin-right` 在 RTL 下间距跑错边

```css
/* 物理：切 RTL 后图标贴住文字 */
.icon { margin-right: 0.5em; }

/* 逻辑：间距永远在朝向文字那侧 */
.icon { margin-inline-end: 0.5em; }
```

<v-click>

`margin-inline-end` 让间距永远在「文字那一侧」，LTR / RTL 都对。

</v-click>

---
layout: section
---

# 多列布局与综合

无断点的响应式分栏 + 四工具协同

---

# 多列：报纸 / 杂志式排版

`columns` 简写，按列宽自动定列数

```css
.prose { columns: 18rem; }    /* 列宽自适应：1→2→3 列 */
.prose { columns: 3; }         /* 固定 3 列 */
.prose { columns: 3 18rem; }   /* 列宽 18rem，最多 3 列 */
```

<v-click>

`columns: 18rem` 是杂志式排版最省心的写法——随容器变宽列数平滑增加，**完全不用写媒体查询**。

</v-click>

---

# 间距、分隔线与跨列

```css
.prose {
  columns: 18rem;
  column-gap: 2rem;
  column-rule: 1px solid #ccc; /* 列间分隔线，不占布局 */
}
.prose h2 { column-span: all; } /* 标题横跨所有列 */
```

<v-click>

`column-rule` 写法同 `border`，但只画在列间隙、不占空间；`column-span: all` 让大标题跨列。

</v-click>

---

# 防止内容被拦腰切断

多列会沿列流动分割，可能把卡片切到两列

```css
.prose figure,
.prose .card {
  break-inside: avoid; /* 整块不被拆到相邻两列 */
}
```

<v-click>

::: tip multicol vs Grid
「一条长流被切成几栏」用 multicol；「一组各自独立的项」用 Grid。
:::

</v-click>

---

# 综合：媒体定骨架 + 容器定组件

```css
@media (width >= 64em) {
  .page { grid-template-columns: 18rem 1fr; }
}

.feed { container-type: inline-size; }
@container (width >= 28em) {
  .card { grid-template-columns: 8rem 1fr; }
}
```

<v-click>

媒体查询决定「侧栏 + 正文」骨架，容器查询决定卡片在它落脚的容器里横排还是竖排——互不干扰。

</v-click>

---

# 综合：能力兜底 + 方向适配 + 偏好

```css
.callout { border-inline-start: 4px solid royalblue; } /* 方向 */

@supports not (aspect-ratio: 1) {                       /* 能力 */
  .ratio-box { padding-top: 56.25%; }
}

@media (prefers-reduced-motion: no-preference) {        /* 偏好 */
  .card { transition: transform 0.25s ease; }
}
```

<v-click>

逻辑属性适配方向、`@supports` 兜能力、偏好查询尊重用户——三者各管一摊。

</v-click>

---

# 四种工具的分工总表

| 工具 | 决策维度 | 典型职责 |
| --- | --- | --- |
| `@media` | 视口 / 设备 | 页面骨架、导航折叠 |
| `@media (prefers-*)` | 系统设置 | 暗色、减弱动效（无障碍） |
| `@container` | 祖先容器 | 组件级自适应 |
| `@supports` | 浏览器能力 | 渐进增强、新旧二选一 |
| 逻辑属性 | 书写方向 | i18n、LTR / RTL |
| `columns` | 可用宽度 | 报纸 / 杂志式文本流 |

---

# 最佳实践小结

<v-click>

- 断点用 range 语法（`width >= 600px`、双端闭区间），优先 `em` / `rem`
- 暗色三件套：`color-scheme` + `prefers-color-scheme` + CSS 变量
- `prefers-reduced-motion` 是无障碍底线，推荐「默认无动效」范式
- 组件级响应用容器查询；style 查询当渐进增强用
- `@supports` 写降级用 `not`，逻辑属性适配 RTL
- 一句话：**媒体管页面、容器管组件、`@supports` 管能力、逻辑属性管方向、multicol 管文本流**

</v-click>

---
layout: center
class: text-center
---

# 谢谢

把这五件套按维度分工组合，就是一套现代、可复用、可访问、可国际化的响应式方案

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
