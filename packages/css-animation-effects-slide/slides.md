---
theme: seriph
background: https://cover.sli.dev
title: CSS 过渡、动画与视觉
info: |
  CSS 动效与视觉 —— transition、animation、transform、滤镜、View Transitions、性能与无障碍
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:css-3 class="text-8xl" />
</div>

<br/>

## CSS 过渡、动画与视觉

从「补一个值」到「整页过渡」，再到不卡、不晕（基于 CSS 现代标准）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
CSS 的动效能力是分层的：越往上越强、也越需要降级。这一章顺着这条主线走一遍。
-->

---
transition: fade-out
---

# 这一章讲什么

CSS 动效是**分层**的，越往上越强、越需要降级

<v-click>

- **补一个值** → `transition`（状态变化触发）
- **自主多帧** → `@keyframes` + `animation`
- **移动 / 缩放 / 旋转** → `transform`
- **像素级视觉** → `filter` / 混合 / `clip-path` / `mask`
- **页面级 + 绑滚动** → View Transitions / 滚动驱动
- **怎么不卡、不晕** → 合成层 / `prefers-reduced-motion`

</v-click>

---

# 一眼区分三个名字

最容易混的 `transition` / `animation` / `transform`：

| | 是什么 | 怎么启动 |
| --- | --- | --- |
| `transition` | 属性**从 A 到 B** 的自动补间 | 状态改变触发 |
| `animation` | 按 `@keyframes` 自主播放 | 一出现就播、可循环 |
| `transform` | 几何**变换**（移 / 缩 / 转） | 只是目标样式，靠上二者驱动 |

<v-click>

关键：`transform` 不是「动画」，而是一种**不触发重排**的样式；`transition` / `animation` 才是让它动起来的引擎。

</v-click>

---

# 一段最小可用：悬停放大

最常见的「悬停轻微放大」= `transition` + `transform`：

```css
.card {
  transition: transform 200ms ease;
}
.card:hover {
  transform: scale(1.05);
}
```

<v-click>

`:hover` 让 `transform` 从 `none` 变成 `scale(1.05)`，浏览器按声明在 200ms 内补完中间帧。**只写在基态上的 `transition` 同时管进场和离场。**

</v-click>

---
layout: section
---

# transition：最轻量的动效

属性值一改，平滑过去

---

# transition 写在哪很关键

```css
.button {
  background-color: #3b82f6;
  transition: background-color 200ms ease;
}
.button:hover {
  background-color: #1d4ed8;
}
```

<v-click>

`transition` 写在**基态**（`.button`）上 → 进场 + 离场都走过渡。

只写在 `:hover` 上 → 只有进入有动画、离开瞬间复位。

</v-click>

---

# 四个子属性

`transition` 是这四个长写的简写：

```css
.box {
  transition-property: transform; /* 动哪个属性 */
  transition-duration: 300ms; /* 多久（默认 0s = 无动画） */
  transition-timing-function: ease; /* 缓动曲线 */
  transition-delay: 0s; /* 延迟多久才开始 */
}
```

<v-click>

简写里**时长是第一个时间值、延迟是第二个**（顺序固定）：`transition: transform 300ms 100ms` = 时长 300ms、延迟 100ms。

</v-click>

---

# 别用 `transition: all`

可以列多个属性、逗号分隔，各有自己的时长 / 缓动：

```css
.card {
  transition:
    transform 200ms ease,
    box-shadow 300ms ease-out;
}
```

<v-click>

::: warning 慎用 all
`all` 监听**所有**可动画属性，任何不经意的变化都可能触发补间——既难预期又拖性能。明确列出你真正想动的属性。
:::

</v-click>

---

# 哪些属性能过渡

过渡要求属性有「中间值」可插值：

<v-click>

- **能动**：`transform`、`opacity`、各种颜色、长度（`width` / `padding`…）、`box-shadow`、`filter`、`font-size`
- **不能动**：`font-family`、`display` 这类**离散属性**——没有「一半」的概念，默认在中点直接跳变

</v-click>

<v-click>

性能上优先动 `transform` / `opacity`（走合成层），避免 `width` / `top`（触发重排）。

</v-click>

---

# 缓动：五个关键字

缓动函数决定运动在时间上的**快慢分布**：

| 关键字 | 手感 | 适合 |
| --- | --- | --- |
| `ease`（默认） | 先快后慢 | 通用，绝大多数场景 |
| `linear` | 全程匀速 | 旋转 loading、进度条 |
| `ease-in` | 缓起加速 | 元素**离场** |
| `ease-out` | 快起缓停 | 元素**进场** |
| `ease-in-out` | 两端慢 | 来回 / 往返 |

<v-click>

口诀：**进场 `ease-out`、离场 `ease-in`**。

</v-click>

---

# `cubic-bezier()`：自定义曲线

五个关键字本质都是三次贝塞尔的别名。精确控制就给四个控制点坐标：

```css
.box {
  /* (x1,y1) (x2,y2)，x 必须在 [0,1] */
  transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
}
```

<v-click>

`x` 是时间进度（限 `0~1`），`y` 是运动进度。**`y` 允许超出 `[0,1]`** —— 这正是「过冲 / 回弹」的秘诀：

```css
.pop {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

</v-click>

---

# `linear()`：逼近弹簧与反弹

贝塞尔只有两个控制点，画不出「弹簧反复振荡」。`linear()` 用**一串点**连成折线逼近任意缓动：

```css
.bounce {
  transition-timing-function: linear(0, 0.25 25%, 0.5, 1 60%, 0.9, 1);
}
```

<v-click>

让纯 CSS 也能做出过去要靠 JS 物理引擎的弹簧 / 回弹手感（**Baseline 2023**）。点的数值通常由弹簧生成器算好后粘贴。

</v-click>

---

# `steps()`：逐帧跳变

`steps(n, end|start)` 把过渡切成 `n` 段**离散**跳变，不做连续插值：

```css
/* 分 10 步跳完，常配 @keyframes 做雪碧图动画 */
.sprite {
  transition-timing-function: steps(10, end);
}
```

<v-click>

非常适合精灵图逐帧、「打字机」效果。第二参数 `end`（默认）在每段**末尾**跳变，`start` 在**开头**跳变。

</v-click>

---

# 进 / 出场用不同曲线

很多优秀交互，进入和离开**不对称**——把 `transition` 分别写在两态上：

```css
.panel {
  opacity: 0;
  transition: opacity 400ms ease-in; /* 离场：慢、缓起 */
}
.panel.is-open {
  opacity: 1;
  transition: opacity 150ms ease-out; /* 进场：快、缓停 */
}
```

---

# 进场动画：`@starting-style`

过渡只在「值改变」时触发。元素**刚插入 DOM** 没有「旧值」，默认无进场动画。`@starting-style` 补上「起始值」：

```css
.toast {
  opacity: 1;
  transition: opacity 300ms ease;
}
@starting-style {
  .toast { opacity: 0; } /* 元素首次渲染从这里开始 */
}
```

<v-click>

元素一插入就从 `@starting-style` 过渡到正常值，无需 JS 加类（**Baseline 2024**）。

</v-click>

---

# 过渡 `display`：`allow-discrete`

想「淡出后再 `display: none`」一直很麻烦——`display` 一改就立即生效，掐断淡出。`allow-discrete` 解决：

```css
.dialog {
  opacity: 1;
  transition:
    opacity 300ms ease,
    display 300ms allow-discrete;
}
.dialog[hidden] { opacity: 0; display: none; }
```

<v-click>

离散属性在过渡**结束时刻**（离场）/ **开始时刻**（进场）跳变，把 `none` 推迟到动画播完。配 `@starting-style` = 纯 CSS 弹窗（**Baseline 2024**）。

</v-click>

---
layout: section
---

# @keyframes + animation

脱离触发，自主播放多帧

---

# animation 与 transition 的分工

`transition` 只能在状态改变时「A → B」补一次。`animation` **脱离触发、自主播放**，可多帧 / 循环 / 往返 / 暂停：

```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card {
  animation: fade-in-up 400ms ease-out;
}
```

<v-click>

元素挂上 `animation` 后**立即开播**，无需任何触发。

</v-click>

---

# `@keyframes`：from/to 与百分比

只有起止两帧用 `from`（= `0%`）/ `to`（= `100%`）；要中间帧用百分比，可任意多个：

```css
@keyframes pulse {
  0%   { opacity: 1;   scale: 1; }
  50%  { opacity: 0.4; scale: 1.4; } /* 中途放大变淡 */
  100% { opacity: 1;   scale: 1; } /* 回起点，循环无缝 */
}
```

<v-click>

要点：名字**区分大小写**、不能用关键字（如 `none`）；未在某帧出现的属性自动在相邻帧间插值；想循环无缝就让 `100%` 与 `0%` 一致。

</v-click>

---

# 八个子属性

```css
.box {
  animation-name: pulse; /* 用哪个 @keyframes */
  animation-duration: 2s; /* 默认 0s = 不播放 */
  animation-timing-function: ease-in-out; /* 每段之间的缓动 */
  animation-delay: 0.5s;
  animation-iteration-count: infinite; /* 循环几次 */
  animation-direction: alternate; /* 播放方向 */
  animation-fill-mode: both; /* 动画外如何留样式 */
  animation-play-state: running; /* 播放 / 暂停 */
}
```

---

# duration 必给 · 缓动作用在每段

::: warning 没动？多半忘了时长
`animation-duration` 默认 `0s`——**不写时长动画就不播放**，这是最常见的「加了 animation 怎么没动」。
:::

<v-click>

缓动作用于**相邻关键帧之间的每一段**，而非整条动画。整体匀速（如 loading）必须用 `linear`，否则每两帧之间都 `ease` 一下、一顿一顿。

</v-click>

---

# direction：播放方向

| 值 | 行为 |
| --- | --- |
| `normal`（默认） | 每轮 `0% → 100%` 正放 |
| `reverse` | 每轮 `100% → 0%` 倒放 |
| `alternate` | 奇数轮正、偶数轮倒（往返） |
| `alternate-reverse` | 奇数轮倒、偶数轮正 |

<v-click>

`alternate` 配 `infinite` 是「呼吸 / 心跳」类往返动画的标配——无需在 `@keyframes` 里手写返程帧。

</v-click>

---

# fill-mode：动画外留不留样式

动画只在「播放期间」改样式，前 / 后默认回到原本 CSS：

| 值 | 延迟期（开播前） | 结束之后 |
| --- | --- | --- |
| `none`（默认） | 元素自身样式 | 元素自身样式 |
| `forwards` | 元素自身样式 | **停在末帧** |
| `backwards` | **提前用首帧** | 元素自身样式 |
| `both` | 提前用首帧 | 停在末帧 |

---

# 一次性入场要 `forwards`

```css
.toast {
  animation: fade-in-up 400ms ease-out forwards; /* 淡入后停在终态 */
}
```

<v-click>

::: warning 没有 forwards 会「闪回」
一次性入场动画若不设 `forwards`，播放结束瞬间元素**跳回原始样式**（又变透明），像闪了一下。一次性入 / 出场几乎都要 `forwards` 或 `both`。
:::

</v-click>

---

# play-state：暂停与多动画

`paused` 冻结当前帧，恢复后从冻结处继续，不重头：

```css
.marquee { animation: scroll 10s linear infinite; }
.marquee:hover { animation-play-state: paused; }
```

<v-click>

一个元素可同时挂多个动画，逗号分隔、各自独立：

```css
.hero {
  animation:
    fade-in 600ms ease-out forwards,
    float 3s ease-in-out infinite; /* 入场 + 漂浮 */
}
```

</v-click>

<!--
animation-composition（replace / add / accumulate）决定多动画作用同一属性时如何合并，属进阶，日常用默认 replace 即可。
-->

---
layout: section
---

# transform：不动布局的变换

高性能动画的基石

---

# transform 是什么

`transform` 在元素**渲染时**做几何变换，但**不改变它在文档流里占的位置**——周围元素不重排：

```css
.box {
  transform: translateX(100px) scale(1.2); /* 移并放大，原位仍被占着 */
}
```

<v-click>

对比：改 `left: 100px` / `width` 会触发**重排**（layout），`transform` 不会。这正是它适合做动画的根本原因。

</v-click>

---

# 2D 变换函数

| 函数 | 作用 |
| --- | --- |
| `translate(x,y)` / `translateX/Y` | 平移（`%` 相对自身尺寸） |
| `scale(x,y)` / `scaleX/Y` | 缩放（无单位，`1` = 原始，负值翻转） |
| `rotate(deg)` | 旋转（`deg`/`rad`/`turn`） |
| `skew(x,y)` / `skewX/Y` | 倾斜成平行四边形 |

<v-click>

经典居中靠「百分比相对自身」：`transform: translate(-50%, -50%)` 把自身中心对齐到定位点。

</v-click>

---

# 多函数：从右往左

一个 `transform` 里多个函数**按从右到左**依次作用：

```css
.a { transform: translateX(100px) rotate(45deg); } /* 先转再移 */
.b { transform: rotate(45deg) translateX(100px); } /* 先移再转，画弧 */
```

<v-click>

顺序不同结果迥异——`.a` 原地转 45° 后沿新 X 轴右移；`.b` 先右移 100px 再绕原点转。记不住时：**靠近元素（最右）的先生效**。

</v-click>

---

# 独立变换属性（Baseline 2022）

把三种最常用变换拆成**独立属性**：

```css
.box {
  translate: 100px 20px;
  rotate: 45deg;
  scale: 1.2;
}
```

<v-click>

- **可分别过渡 / 动画**——只让 `scale` 在 hover 变、`rotate` 由另一段动画驱动，互不干扰
- **不互相覆盖**——`transform` 简写写两次后者整个覆盖前者，独立属性没这问题
- 应用顺序固定 `translate → rotate → scale`；需 `skew` 仍用 `transform`

</v-click>

---

# `transform-origin`：变换基点

所有变换默认绕元素**中心**（`50% 50%`）。改基点：

```css
.fan {
  rotate: 90deg;
  transform-origin: bottom left; /* 绕左下角转，像扇子展开 */
}
```

<v-click>

X 用 `left`/`center`/`right`/长度/`%`，Y 用 `top`/`center`/`bottom`/…，3D 可加 Z。对 `rotate` / `scale` 影响最直观（`translate` 不受其影响）。

</v-click>

---

# 3D：透视、保持、背面三件套

2D 函数加 Z 轴进入 3D。要有立体感需三件套配合：

<v-click>

- `perspective`（写在**父容器**）：观察距离，**越小透视越夸张**
- `transform-style: preserve-3d`：子元素保留各自 3D 位置、不被压平
- `backface-visibility: hidden`：元素转到背朝时藏起来

</v-click>

<v-click>

3D 函数：`translateZ` / `rotateX` / `rotateY` / `rotateZ` / `translate3d` / 底层 `matrix3d()`。

</v-click>

---

# 3D 翻牌最小例

```css
.scene { perspective: 800px; } /* 父级给观察距离 */
.card {
  transition: transform 600ms ease;
  transform-style: preserve-3d; /* 子面保留 3D，不被压平 */
}
.card:hover { transform: rotateY(180deg); } /* 悬停翻面 */
/* 两面都 backface-visibility: hidden，只在正对时可见 */
.card .back { transform: rotateY(180deg); } /* 背面预先翻好 */
```

---

# 为什么 transform 能上「合成层」

浏览器渲染：**布局 layout → 绘制 paint → 合成 composite**：

<v-click>

- 改 `width` / `top` / `margin` → 从 **layout** 重来，整页可能重排，最慢
- 改 `background` / `color` → 从 **paint** 重来，重绘像素
- 改 `transform` / `opacity` → 只在 **composite** 处理：提升为独立**合成层**，GPU 直接平移 / 缩放 / 调透明度，**不重排不重绘**

</v-click>

<v-click>

这就是「动画只动 `transform` / `opacity`」铁律的由来——能跑在**合成线程**，主线程繁忙也维持 60fps。

</v-click>

---

# transform 的两个「副作用」

::: warning 两个常踩的坑
- **创建层叠上下文**：设了 `transform`（非 `none`）的元素形成新层叠上下文，内部 `z-index` 自成一套
- **改变 `fixed` 的包含块**：祖先一旦有 `transform`，后代 `position: fixed` 相对**该祖先**而非视口定位——「fixed 莫名跟着滚」的常见原因
:::

<v-click>

另：**非替换行内元素**（未改 `display` 的 `<span>`）不能被变换，先给它 `display: inline-block`。

</v-click>

---
layout: section
---

# 滤镜 · 混合 · 裁剪

transform 之外的「像素级」视觉

---

# 四类视觉效果概览

改变像素外观的一组能力：

| 能力 | 作用对象 | 典型场景 |
| --- | --- | --- |
| `filter` | 元素**自身**像素 | 模糊、变灰、调色、异形投影 |
| `backdrop-filter` | 元素**背后**像素 | 毛玻璃面板、磨砂导航 |
| `mix-blend-mode` | 与**下层** / 背景层混合 | 双色叠加、文字穿透 |
| `clip-path` / `mask` | **裁剪 / 遮罩**形状 | 异形卡片、斜切、渐隐 |

---

# `filter`：对自身做滤镜

接一串滤镜函数，**从左到右**依次施加：

```css
.photo {
  filter: grayscale(0.5) brightness(1.1) contrast(1.05);
}
.photo:hover { filter: none; }
```

<v-click>

常用：`blur()` / `brightness()` / `contrast()` / `grayscale()` / `sepia()` / `saturate()` / `hue-rotate()` / `invert()` / `opacity()` / `drop-shadow()`。

</v-click>

---

# `drop-shadow()` vs `box-shadow`

`box-shadow` 永远是**矩形边界**的影子；`filter: drop-shadow()` 沿元素**实际非透明轮廓**投影：

```css
.icon {
  /* 沿图标镂空轮廓投影，而非外接矩形 */
  filter: drop-shadow(0 2px 4px rgb(0 0 0 / 0.4));
}
```

<v-click>

给透明 PNG、SVG 图标、`clip-path` 异形加阴影时，只有它能贴合形状。

</v-click>

---

# `backdrop-filter`：背后的毛玻璃

处理元素**背后**透出来的内容——「毛玻璃 / 磨砂」的标准做法。前提：元素自身得**半透明**：

```css
.glass {
  background: rgb(255 255 255 / 0.2); /* 半透明才看得到背后 */
  backdrop-filter: blur(12px) saturate(1.5);
}
```

<v-click>

**Baseline 2024**（早期 Safari 需 `-webkit-` 前缀）。它要实时采样并模糊背后像素，**开销很大**，大面积或滚动中尤甚——克制使用、别做动画。

</v-click>

---

# 混合模式：与下层叠加

`mix-blend-mode` 让元素像 PS 图层那样与**下方内容**按公式混色：

```css
.title {
  mix-blend-mode: difference; /* 与背景差值，任意底色上都清晰 */
  color: white;
}
```

<v-click>

常用：`multiply`（变暗）/ `screen`（变亮）/ `overlay`（增对比）/ `difference`。`background-blend-mode` 则作用于**同一元素的多个背景层**之间。

</v-click>

---

# `clip-path`：裁成任意形状

用一个形状把元素**裁剪**出来，形状外的部分被裁掉、不可见也不可点：

```css
.avatar { clip-path: circle(50%); } /* 圆形头像 */
.banner { clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%); } /* 斜切 */
```

<v-click>

形状函数：`circle()` / `ellipse()` / `inset(… round 圆角)` / `polygon()` / `path("SVG")`。**顶点数相同的 `polygon()` 之间可平滑补间**（动画化），顶点数不同则不能插值。

</v-click>

---

# `mask`：更细腻的遮罩

`clip-path` 是「硬边裁切」；`mask` 用图像 / 渐变的**亮度或 alpha** 当遮罩，能**羽化、渐隐**：

```css
.fade-bottom {
  mask-image: linear-gradient(to bottom, black 70%, transparent);
}
```

<v-click>

不透明 / 亮的地方显示、透明 / 暗的地方隐藏。口诀：**硬边异形用 `clip-path`，要羽化 / 渐变用 `mask`**。历史上 Safari / Chromium 长期需 `-webkit-mask-*` 前缀。

</v-click>

---

# 性能与降级

滤镜 / 混合 / 遮罩都触发**重绘**且常需离屏合成——比 `transform` / `opacity` 重得多：

```css
.glass { background: rgb(30 30 40 / 0.9); } /* 降级：不透明底 */
@supports (backdrop-filter: blur(1px)) {
  .glass {
    background: rgb(30 30 40 / 0.4);
    backdrop-filter: blur(12px);
  }
}
```

<v-click>

尽量别对 `filter` / `backdrop-filter` 做持续动画，并用 `@supports` 给不支持的浏览器朴素降级。

</v-click>

---
layout: section
---

# View Transitions 与滚动驱动

两项现代「页面级」能力

---

# View Transitions 是什么

过去做「列表点进详情、图片平滑放大铺满」要手动记位置、克隆节点、算补间——极繁琐。

<v-click>

View Transitions API 把它自动化了：

> **你只管改 DOM，浏览器负责对改动前后各截一张图、做交叉淡化 / 形变。**

</v-click>

---

# 同文档过渡（SPA）

核心是 `document.startViewTransition()`，把「改 DOM 的操作」作回调传进去：

```js
const transition = document.startViewTransition(() => {
  updateTheDOMSomehow(); // 切路由 / 替换列表
});
transition.ready.then(() => {}); // 伪元素就绪、即将动画
transition.finished.then(() => {}); // 动画播完
```

<v-click>

返回对象带 `ready` / `finished` / `updateCallbackDone` 三个 Promise。默认效果是整页**交叉淡化**。

</v-click>

---

# 「魔法移动」：view-transition-name

给某元素在新旧两态标**同一个** `view-transition-name`，浏览器把它当同一元素做形变补间：

```css
.thumbnail, .hero-image {
  view-transition-name: hero-image;
}
```

<v-click>

::: warning name 必须唯一
同一时刻每个 `view-transition-name` 只能对应**一个**渲染元素，否则过渡报错中断。动态列表用唯一 id 拼名（`card-42`）。
:::

</v-click>

---

# 定制动画：伪元素树

过渡时浏览器生成一棵伪元素树，截图挂在上面，用普通 CSS `animation` 定制：

```
::view-transition
└── ::view-transition-group(name)
    └── ::view-transition-image-pair(name)
        ├── ::view-transition-old(name) （旧截图）
        └── ::view-transition-new(name) （新截图）
```

<v-click>

`root` 是默认覆盖整页的名字。给 `::view-transition-old(root)` / `-new(root)` 写 `@keyframes` 即可做「旧滑出、新滑入」。

</v-click>

---

# 跨文档过渡（MPA）

传统多页应用（点链接真实导航）过去**无法**这样过渡。现在一条 CSS、且**两页同源**即可：

```css
/* 两个页面都加：开启同源导航的视图过渡 */
@view-transition {
  navigation: auto;
}
```

<v-click>

更细控制靠 `pageswap`（旧页将卸载）/ `pagereveal`（新页将显示）两个事件，都能拿到 `ViewTransition` 对象。

</v-click>

---

# View Transitions 的 Baseline

| 能力 | 状态 | 落地 |
| --- | --- | --- |
| 同文档 `startViewTransition()` | ✅ **Baseline 2025·新近** | 可用，仍按渐进增强写 |
| 跨文档 `@view-transition` | 🟠 **非 Baseline**（Chromium） | **纯渐进增强**，须降级 |

<v-click>

降级天然优雅——`startViewTransition` 不存在就直接执行更新：

```js
if (!document.startViewTransition) { updateDOM(); return; }
document.startViewTransition(updateDOM);
```

</v-click>

---

# 滚动驱动动画

普通 `animation` 进度跟着**时间**走；滚动驱动把进度改为跟着**滚动位置**走——滚到哪、放到哪，反向滚则倒放：

<v-click>

- **不需要 JS 监听 `scroll`**，由浏览器在合成线程驱动，因而很顺
- 核心是 `animation-timeline`，把动画接到「滚动时间线」上
- 两种时间线：`scroll()`（滚动条进度）/ `view()`（元素进出视口进度）

</v-click>

---

# `scroll()`：滚动条进度

进度 = 滚动容器**从顶滚到底**的百分比，常用于顶部「阅读进度条」：

```css
.progress-bar {
  transform-origin: left;
  animation: grow-progress linear; /* 不写 duration，由时间线驱动 */
  animation-timeline: scroll(root block); /* 跟随根视口纵向滚动 */
}
```

<v-click>

`scroll(axis scroller)`：`axis` = `block`（默认）/ `inline` / `x` / `y`；`scroller` = `nearest`（默认）/ `root` / `self`。

</v-click>

---

# `view()`：元素进出视口

进度 = 某元素**穿过视口**的过程，适合「滑入视口时淡入上移」：

```css
.card {
  animation: reveal linear both;
  animation-timeline: view(); /* 以自身进出视口为时间线 */
  animation-range: entry 0% cover 40%; /* 限定在哪一段播完 */
}
```

<v-click>

`animation-range` 命名区段：`cover`（任意重叠整段）/ `contain`（完全容纳）/ `entry`（进入）/ `exit`（离开）。命名时间线（`scroll-timeline-name` / `view-timeline-name`）可跨元素联动。

</v-click>

---

# 滚动驱动的 Baseline 与降级

🟠 **整体仍是非 Baseline**：Chromium 完整、Firefox 部分 / 需开关、Safari 未支持。**只能当渐进增强**：

```css
.card { opacity: 1; } /* 默认可见，不依赖滚动动画 */
@supports (animation-timeline: view()) {
  .card { animation: reveal linear both; animation-timeline: view(); }
}
```

<v-click>

::: warning 别把关键内容藏在滚动动画后
默认态**必须可见**，仅在 `@supports` 命中才改为初始透明——否则不支持的浏览器里内容永远停在透明起始帧。
:::

</v-click>

---
layout: section
---

# 性能与无障碍

怎么让它顺滑又不晕人

---

# 动画卡不卡，看你动哪个属性

```
布局 layout  →  绘制 paint  →  合成 composite
（算位置大小）  （填像素）      （把层拼到屏幕）
    最贵           中等            最便宜
```

<v-click>

> **能用 `transform` / `opacity` 实现的动画，就不要去动 `width` / `top` / `margin`。**

它们走合成线程、不重排不重绘，能稳 60fps——这是高性能动画第一铁律。

</v-click>

---

# 把「重排动画」改写成「合成动画」

| 想要的效果 | ❌ 触发重排 | ✅ 走合成层 |
| --- | --- | --- |
| 左右滑动 | `left` / `margin-left` | `transform: translateX()` |
| 放大缩小 | `width` / `height` | `transform: scale()` |
| 淡入淡出 | `visibility` / `display` | `opacity` |
| 从下方升起 | `top` / `margin-top` | `transform: translateY()` |

<v-click>

注意：`scale` 会拉伸文字（过程中模糊）；要「盒子变尺寸且文字清晰」是另一类需求，不能简单用 `scale`。

</v-click>

---

# `will-change`：提前提层，但要克制

告诉浏览器「这属性即将变，提前提层」，避免动画**首帧**临时提层卡顿：

```css
.card { transition: transform 200ms ease; }
.card-wrapper:hover .card {
  will-change: transform; /* 悬停前一刻准备好 */
}
```

<v-click>

::: warning 双刃剑
每个合成层都占**显存**。给成百上千元素无脑写 `will-change` 会吃光内存、反而更卡。正确姿势：**用之前临时加、用完移除**；本就流畅则根本不需要。
:::

</v-click>

---

# `prefers-reduced-motion`：无障碍红线

前庭障碍、晕动症用户，大幅运动可能引发**眩晕、恶心**。响应它**不是可选项**：

```css
.card { transition: transform 200ms ease; }
@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
}
```

<v-click>

更保守的写法：默认无动画，仅 `@media (prefers-reduced-motion: no-preference)` 命中时才加。

</v-click>

---

# 「减弱」而非一律「删除」

分清动画**承不承载信息**：

<v-click>

- **纯装饰**（漂浮 / 脉冲 / 视差 / 华丽转场）→ 直接 `none`
- **承载状态 / 反馈**（loading / 展开折叠 / 校验提示）→ **保留但减弱**：去掉大幅位移 / 旋转 / 闪烁，换近乎瞬时的淡化

</v-click>

<v-click>

别让动画成为**唯一**信息载体；关掉动画后内容仍须可见、可达、可操作；避免每秒闪 3 次以上（WCAG 光敏红线）。

</v-click>

---

# 落地自检清单

任何动画落地前对照：

<v-click>

1. 动的是 `transform` / `opacity` 吗？在动 `width` / `top` 能否改写？
2. 有没有滥用 `will-change`？是否「临时加、用完清」？
3. 循环用 `linear` 吗？一次性入场加 `forwards` 防闪回吗？
4. 响应 `prefers-reduced-motion` 了吗（装饰关、信息减弱）？
5. 关掉动画后内容仍完整可用、信息不丢吗？
6. 非 Baseline 特性做了 `@supports` 降级吗？

</v-click>

---
layout: center
class: text-center
---

# 谢谢

从 `transition` 到 View Transitions，把动效收敛到合成层、对敏感用户留好降级，页面才既好看又顺滑

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
