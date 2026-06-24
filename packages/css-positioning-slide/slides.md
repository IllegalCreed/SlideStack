---
theme: seriph
background: https://cover.sli.dev
title: CSS 定位与层叠上下文
info: |
  CSS 定位与层叠 —— position 五取值、包含块、z-index 与层叠上下文、float/BFC、锚点定位、popover/dialog
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:css-3 class="text-8xl" />
</div>

<br/>

## CSS 定位与层叠上下文

把元素从正常流里「拎出来」精确摆放，再决定重叠时谁压谁（基于 CSS 现代标准）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
定位是 CSS 里坑最密集的一块：sticky 静默失效、fixed 被祖先夺走、z-index 写到 9999 还压不住，根因都在「包含块」与「层叠上下文」这两个概念。
-->

---
transition: fade-out
---

# 这一章讲什么

把元素「拎出正常流」精确摆放，再解决重叠时的层级

<v-click>

- **怎么摆**：`position` 五取值、包含块、`inset`
- **谁压谁**：`z-index`、层叠上下文、七层顺序、`isolation`
- **遗留地基**：`float` / `clear` 清浮动、BFC
- **现代武器**：CSS 锚点定位、`popover` / `<dialog>` 顶层

</v-click>

<v-click>

> 定位的坑大多**不报错**——`sticky` 没吸住、`fixed` 跟着滚、`z-index: 9999` 压不住，全是「静默失效」。

</v-click>

---
layout: section
---

# 一、position 五取值

`static` / `relative` / `absolute` / `fixed` / `sticky`

---

# 五个取值，一句话区分

| 取值 | 在正常流 | 相对谁偏移 |
| --- | --- | --- |
| `static` | 是 | 不可偏移（默认） |
| `relative` | 是（原位占位） | 自己原来的位置 |
| `absolute` | 否（脱流） | 最近的已定位祖先 |
| `fixed` | 否（脱流） | 视口（滚动不动） |
| `sticky` | 是 → 吸住 | 滚到阈值后吸在容器边 |

<v-click>

只有非 `static`（统称「定位元素」），偏移属性与 `z-index` 才开始工作。

</v-click>

---

# `static` 与 `relative`

```css
.box {
  /* position: static 是默认值 */
  top: 50px;     /* ← 无效 */
  z-index: 10;   /* ← 无效 */
}
```

<v-click>

`relative` 最温和：**仍在正常流、原位仍占着**，只是视觉上按 `top`/`left` 挪一挪，不影响任何兄弟元素。

</v-click>

<v-click>

::: warning relative 的「幽灵空白」
偏移后原位仍占空间——挪开后原处留一块「看不见但占着」的空白，后面元素**不会**顶上来。要补位请用 `absolute`。
:::

</v-click>

---

# `relative` 最高频用法：当参照系

给容器加 `relative` 但**不写任何偏移**，把它变成子元素的「定位锚」：

```css
.card {
  position: relative; /* 不偏移，只为把坐标系交给子元素 */
}
.card__close {
  position: absolute;
  top: 8px;
  right: 8px;
}
```

<v-click>

这套「父 relative + 子 absolute」是定位里**最高频的组合**——把子元素坐标系从「视口」收回到「这张卡片」。

</v-click>

---

# `absolute`：脱流，找最近定位祖先

```css
.menu { position: relative; }      /* 关键：给下拉一个参照 */
.menu__dropdown {
  position: absolute;
  top: 100%;                       /* 紧贴菜单底部 */
  left: 0;
}
```

<v-click>

- **脱流**：原位不占空间，后续元素顶上来
- **参照**：最近已定位祖先的内边距盒；找不到则相对视口
- **尺寸**：`width`/`height` 为 `auto` 时按内容收缩，不撑满父级

</v-click>

---

# 找错包含块：`absolute` 第一大坑

::: tip 排查口诀
忘了给预期父级加 `position: relative`，浏览器会**继续往上找**，可能一路找到 `<body>`——角标就跑到了页面左上角。
:::

<v-click>

排查 `absolute` 位置不对时，先问自己一句：

> **「我想让它相对谁，那个谁定位了吗？」**

</v-click>

---

# `fixed`：相对视口，滚动不动

```css
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
}
```

- 参照物通常是**视口**——页面怎么滚，它都钉在屏幕同一处
- 吸顶导航、回到顶部、全屏遮罩都靠它
- 打印时**出现在每一页的同一位置**
- **始终创建层叠上下文**（与 `z-index` 无关）

---

# `fixed` 的致命例外（高频坑）

> 祖先的 `transform` / `perspective` / `filter` 非 `none` 时，**该祖先取代视口成为 `fixed` 的包含块**。

```css
.page  { transform: translateZ(0); } /* 哪怕只是「触发 GPU 层」 */
.modal {
  position: fixed;
  inset: 0;        /* 本想铺满屏幕，结果只铺满了 .page */
}
```

<v-click>

同类「夺权者」还有：`will-change: transform`、`backdrop-filter`、`contain: paint/layout/strict/content`。`fixed` 跟着滚 / 没铺满屏，就沿 DOM 往上找它们。

</v-click>

---

# `sticky`：流内吸附，越界即停

`relative` 与 `fixed` 的混血——滚到阈值前像 `relative`，越过后像 `fixed` 吸住：

```css
.section-heading {
  position: sticky;
  top: 0;                  /* 没这一行，sticky 形同 relative */
  background: var(--bg);   /* 吸住时盖住下方内容，记得给背景 */
}
```

<v-click>

经典用途：吸顶表头、分组标题、侧栏吸附。它**始终创建层叠上下文**。

</v-click>

---

# `sticky` 三大「静默失效」

不报错，失效时只是「没吸住」，排查全靠经验：

<v-click>

1. **忘写阈值**——该轴上 `top`/`bottom`/… 全 `auto`，退化为普通 `relative`，永不吸
2. **父级 `overflow` 抢成滚动容器**——父级设了 `overflow: hidden/auto/scroll`（哪怕只为清浮动），`sticky` 就以那个**不滚动的父级**为参照，像被钉死
3. **父级高度不足**——父级没有「可供滑动吸附」的空间，从头到尾都贴着

</v-click>

<v-click>

::: tip 表格里的额外坑
吸顶表头给 `th` / `td` 设 `sticky` 比给 `tr` 更稳（部分浏览器对 `tr` 的 `sticky` 支持受表格布局限制）。
:::

</v-click>

---

# `inset` 简写与逻辑偏移

```css
.fill   { position: absolute; inset: 0; }                  /* 撑满包含块 */
.corner { position: fixed; inset: 12px 12px auto auto; }   /* 钉右上角 */
```

- `inset` 顺序同 `margin`：上、右、下、左
- `inset: 0` 是「铺满父容器 / 视口」的现代写法
- 逻辑写法 `inset-block-start` / `inset-inline-end` 自动适配 RTL

<v-click>

反直觉点：同写 `top`+`bottom`（且 `height: auto`）→ 元素被**上下拉伸填满**；冲突且尺寸固定时 `top` 胜 `bottom`（LTR）。

</v-click>

---

# 哪些定位会创建层叠上下文？

::: warning 一条容易忽略的规则
- `relative` / `absolute`：**仅当 `z-index ≠ auto`** 时才创建
- `fixed` / `sticky`：**只要定位就创建**（与 `z-index` 无关）
:::

<v-click>

给 `position: relative` 容器随手加 `z-index: 0`，就悄悄给后代「圈了一个层叠上下文」——后代的 `z-index` 从此被困在里面。这正是下一节「困局」的伏笔。

</v-click>

---
layout: section
---

# 二、z-index 与层叠上下文

「我都写到 9999 了，为什么还压不住？」

---

# `z-index` 的前提：先定位

```css
.up-front {
  position: relative;  /* 没这一行，z-index 在普通流里无效 */
  z-index: 2;
}
```

<v-click>

- 控制 Z 轴层级，数值大在上、可负、默认 `auto`
- **只对定位元素生效**——给 `static` 元素写一律无效
- **唯一例外**：Flex / Grid 容器的直接子项，不写 `position` 也生效

</v-click>

---

# 没有 z-index 时：源序决定

> 没给元素设 `z-index` 时，由**文档源序**决定 Z 轴顺序——文档中靠后的元素盖在靠前的之上。（web.dev）

<v-click>

所以两个重叠的定位元素，谁都不写 `z-index` 时，**HTML 里写在后面的那个在上面**。

</v-click>

<v-click>

很多人以为「不写 `z-index` 就没有层叠顺序」——其实浏览器有一整套默认规则（见后文七层模型）。

</v-click>

---

# 层叠上下文：一起升降的一组元素

> 层叠上下文是**一组拥有共同父级、作为整体沿 Z 轴一起升降的元素**。（web.dev）

<v-click>

关键推论：一旦某元素「创建了层叠上下文」，它内部所有后代的层叠就被**封进这个上下文**——

- 后代之间可以用 `z-index` 互相比较
- 但它们**无论写多大的 `z-index`**，都越不过这个上下文整体在父级里的排位

</v-click>

---

# z-index 困局（面试最爱）

```html
<div class="ctx-a"><div class="overlay">我 z-index: 9999</div></div>
<div class="ctx-b">普通内容</div>
```

```css
.ctx-a   { position: relative; z-index: 1; }    /* 创建上下文，排位 1 */
.overlay { position: absolute; z-index: 9999; } /* 只在 ctx-a 内有意义 */
.ctx-b   { position: relative; z-index: 2; }    /* 排位 2，整体高于 1 */
```

<v-click>

结果：`.overlay` 的 `9999` **压不过** `.ctx-b`。MDN 比作「版本号」：`1.9999` 永远小于 `2.0`。

</v-click>

---

# 破解困局的正确姿势

::: warning 别无脑加大 z-index
那是在**错误的上下文**里加，再大也没用。
:::

<v-click>

正确做法二选一：

- **调对「创建上下文那一层」**——把 `.ctx-a` 的 `z-index` 提到比 `.ctx-b` 高
- **干脆别让中间层创建多余上下文**——去掉那个随手写的 `z-index: 1` 或 `transform` / `opacity < 1`

</v-click>

<v-click>

很多「`z-index` 失控」，其实是某个祖先**无意中创建了层叠上下文**。

</v-click>

---

# 什么会创建层叠上下文（上）

记不住没关系，但要知道「条件比想象中多得多」：

| 触发条件 | 备注 |
| --- | --- |
| 根元素 `<html>` | 最顶层上下文 |
| 定位 + `z-index ≠ auto` | 经典触发 |
| `fixed` / `sticky` | 定位即触发 |
| Flex / Grid 子项 + `z-index ≠ auto` | 无需 `position` |
| `opacity < 1` | 隐形（`0.99` 即触发） |

---

# 什么会创建层叠上下文（下）

| 触发条件 | 备注 |
| --- | --- |
| `transform`/`scale`/`rotate`/`translate`（非 `none`） | 隐形（`translateZ(0)` hack） |
| `filter` / `backdrop-filter` / `perspective` / `clip-path` / `mask` | 非 `none` 即触发 |
| `mix-blend-mode ≠ normal` | — |
| `isolation: isolate` | 零副作用，主动隔离首选 |
| `will-change`（指定上述属性） | 隐形触发 |
| `contain` / `container-type` / 顶层元素 | — |

---

# 最坑的三个「隐形」触发器

::: tip 都不改变外观或位置，却悄悄开新上下文
- `opacity: 0.99`
- `transform: translateZ(0)`（常被当「GPU 加速 hack」）
- `will-change: transform`
:::

<v-click>

当 `z-index` 行为诡异时，沿 DOM 往上 `grep` 这三个属性，往往就是元凶。

</v-click>

---

# 上下文内部的七层层叠顺序

同一上下文内，从底到顶按固定顺序绘制（MDN）：

| 层 | 内容 |
| --- | --- |
| 1（底） | 创建上下文元素的**背景 / 边框** |
| 2 | **负 `z-index`** 子上下文 |
| 3 | 正常流**块级盒**（非定位） |
| 4 ~ 5 | **浮动盒** → 正常流**行内 / 行内块盒** |
| 6 | `z-index: auto / 0` 的**定位元素** |
| 7（顶） | **正 `z-index`** 子上下文 |

---

# 七层模型的两条常识

```css
.hero    { position: relative; }
.hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;  /* 钻到文字背后，但仍在 .hero 背景之上 */
}
```

<v-click>

- **负 `z-index`**（第 2 层）在背景之上、块级内容之下——这就是「装饰元素垫到文字背后」的原理
- **定位元素**（第 6 层，哪怕 `z-index: 0`）天然压在普通块级 / 浮动 / 行内内容之上

</v-click>

---

# 主动隔离：`isolation: isolate`

写可复用组件、又不想内部 `z-index` 跟外部「打架」：

```css
.widget {
  isolation: isolate; /* 内部 z-index 从此与页面其余部分隔离 */
}
```

<v-click>

- **不改变任何视觉效果**，只是把内部层叠战争「关进笼子」
- 是**唯一**一个「专门用来创建层叠上下文、且零副作用」的属性
- 比用 `transform` / `opacity` 去「凑」一个上下文干净得多

</v-click>

---
layout: section
---

# 三、float / clear 与 BFC

回归图文环绕本职，理解清浮动的关键概念

---

# `float` 本来是干什么的

```css
.article__figure {
  float: left;
  width: 200px;
  margin: 0 1rem 1rem 0;  /* 给环绕文字留间距 */
}
```

<v-click>

- 取值：`left` / `right` / `none` / 逻辑值 `inline-start` / `inline-end`
- 元素**脱流**、靠边，**文字与行内内容环绕**它——这是 Flex/Grid **都做不到**的效果
- 2010 年代曾被滥用搭整页布局；**2026 年页面布局用 Flex / Grid**，`float` 退回本职

</v-click>

---

# 高度坍塌：float 最经典的坑

```html
<div class="parent">     <!-- 高度坍塌为 0！ -->
  <div class="child" style="float: left">浮动子元素</div>
</div>
```

<v-click>

浮动脱流，于是父元素「看不到」它——容器里**只有浮动子元素**时，高度**坍塌为 0**：背景看不到、后续元素跑上来重叠。

</v-click>

<v-click>

解决它，就是「清除浮动 / 包含浮动」——下面三种办法。

</v-click>

---

# 清浮动三法

```css
/* ① 现代首选：开 BFC，零副作用 */
.parent { display: flow-root; }

/* ② 经典 clearfix（读老代码会遇到） */
.cf::after { content: ""; display: block; clear: both; }

/* ③ overflow（老办法，有副作用） */
.parent { overflow: auto; }
```

<v-click>

`display: flow-root` 专为「创建干净 BFC」而生，**零副作用，第一选择**。能用它就别用后两种。

</v-click>

---

# `overflow` 清浮动的隐藏代价

::: warning 老办法的副作用反咬一口
给父级加 `overflow: hidden` 清浮动，会把它变成**滚动容器**——导致内部 `position: sticky` 子元素莫名其妙吸附失效。
:::

<v-click>

这正好呼应前面 `sticky` 三大失效的第 ② 条。又一个改用 `display: flow-root` 的理由。

</v-click>

---

# BFC：块级格式化上下文

一块**独立的布局区域**，对内自成排版、对外与世隔绝，三个最有用的特性：

<v-click>

1. **包含内部浮动**——算进自己高度，不再坍塌（清浮动的原理）
2. **阻止外边距穿透折叠**——挡住父子 / 相邻块的 margin 合并
3. **不与外部浮动重叠**——可做「自适应宽度的右栏」

</v-click>

<v-click>

::: tip BFC 与层叠上下文别搞混
BFC 管**二维布局**（浮动、外边距、避让）；层叠上下文管 **Z 轴层级**。名字像、概念不同。
:::

</v-click>

---
layout: section
---

# 四、CSS 锚点定位

把「拴住并跟随」「溢出自动翻面」搬进纯 CSS（Baseline 2026）

---

# 它解决什么问题

> 过去，把元素关联到另一元素、并据锚点动态改位置与尺寸，需要 JavaScript，带来复杂度与性能问题。（MDN）

<v-click>

tooltip、下拉、popover 的定位需求，长期只能靠 JS：监听滚动缩放、读 `getBoundingClientRect()`、算坐标、判断溢出再翻面。

</v-click>

<v-click>

CSS 锚点定位把这一整套搬进**纯 CSS 声明**——`anchor-name` / `position-anchor` / `anchor()` / `position-area`。

</v-click>

---

# 三步把元素拴到锚点

```css
.trigger { anchor-name: --trigger; }   /* ① 声明锚点，必须 -- 开头 */

.tooltip {
  position: fixed;
  position-anchor: --trigger;          /* ② 关联（仅关联，还没定位）*/
  position-area: bottom;               /* ③ 放在锚点正下方 */
}
```

<v-click>

`position-area` 用 3×3 网格摆放最直观：`top right`（右上）、`bottom span-all`（底部横跨）。也可用 `anchor()` 取某条边：`top: anchor(bottom)`。

</v-click>

---

# 按锚点尺寸定尺寸 + 自动避让

```css
.dropdown {
  position: absolute;
  position-anchor: --trigger;
  top: anchor(bottom);
  width: anchor-size(width);                 /* 与锚点等宽 */
  position-try-fallbacks: flip-block;        /* 下方放不下自动翻上面 */
}
```

<v-click>

`position-try-fallbacks` 给内置策略（`flip-block` 上下翻 / `flip-inline` 左右翻），浏览器挑第一个「放得下」的——这就是过去 JS 翻面逻辑的**纯 CSS 替代**。

</v-click>

---

# 自定义备选位置 `@position-try`

```css
@position-try --to-bottom { position-area: bottom; margin-top: 8px; }
@position-try --to-left   { position-area: left; margin-right: 8px; }

.tooltip {
  position-area: top;
  position-try-fallbacks: --to-bottom, --to-left;  /* 按序尝试 */
}
```

<v-click>

- `position-try-order`：初始就挑「空间最大」的备选（`most-height` 等）
- `position-visibility: anchors-visible`：锚点滚没了，浮层也跟着「强隐藏」

</v-click>

---

# 必须降级：Baseline 2026 新特性

> 自 2026 年 1 月起，此特性在最新设备与浏览器间打通。**老设备或旧浏览器可能不支持**。（MDN）

```css
.tooltip { position: absolute; top: 100%; left: 0; }  /* ① 人人可用的兜底 */

@supports (anchor-name: --x) {                        /* ② 支持才增强 */
  .trigger { anchor-name: --trigger; }
  .tooltip { position-anchor: --trigger; position-area: bottom; }
}
```

<v-click>

它**还没「广泛可用」**——生产用 `@supports` 包裹，不支持时回退传统 `absolute` 或 JS（Floating UI）。**这是渐进增强，不是默认能力。**

</v-click>

---
layout: section
---

# 五、popover / dialog 与顶层

终结 z-index 战争的终极武器

---

# 核心概念：顶层（top layer）

浏览器在普通文档之上额外维护的一个渲染层。进顶层的元素：

<v-click>

- **无视 `z-index`**——不参与页面层叠博弈，再大的 `z-index: 99999` 也跟它无关
- **无视祖先 `overflow`**——不被任何 `overflow: hidden` 裁掉，也不被滚动容器困住

</v-click>

<v-click>

能进顶层的三类：`popover` 弹层、`showModal()` 的模态 `<dialog>`、全屏元素。从根本上终结「弹窗被裁 / `z-index` 永远不够大」。

</v-click>

---

# `popover`：声明式轻量弹层

```html
<button popovertarget="menu">打开菜单</button>
<div id="menu" popover>
  <ul><li><a href="#">新建</a></li></ul>
</div>
```

<v-click>

> 打开时 popover 出现在顶层、位于所有元素之上，**不受父元素 `position` 或 `overflow` 影响**。（MDN）

**无需任何 JS**——一个属性 + 一个 `popovertarget` 就够了。

</v-click>

---

# 三种 `popover` 值

| 值 | 轻触关闭 | 同类互斥 | 典型场景 |
| --- | --- | --- | --- |
| `auto`（默认） | 是 | 是，只显示一个 | 菜单、下拉 |
| `manual` | 否，须显式关 | 否，可并存 | 常驻面板、Toast |
| `hint` | 是 | 关其他 `hint`，**不关 `auto`** | tooltip、提示 |

<v-click>

JS API：`showPopover()` / `hidePopover()` / `togglePopover()`；CSS：`:popover-open`、`::backdrop`。

</v-click>

---

# `<dialog>`：原生对话框，模态首选

```html
<dialog id="confirm">
  <form method="dialog">
    <p>确定删除吗？</p>
    <button value="ok" autofocus>确定</button>
  </form>
</dialog>
```

```js
document.getElementById("confirm").showModal(); // 模态打开
```

<v-click>

`<form method="dialog">` 提交会自动关闭并把按钮 `value` 写入 `returnValue`。

</v-click>

---

# `showModal()` vs `show()` vs `open`

| 打开方式 | 进顶层 | `::backdrop` | 焦点陷阱 | 自动居中 |
| --- | --- | --- | --- | --- |
| `showModal()`（模态） | ✅ | ✅ | ✅ | ✅ |
| `show()`（非模态） | ❌ | ❌ | ❌ | ❌ |
| `open` 属性 | ❌ | ❌ | ❌ | ❌ |

<v-click>

::: warning 别用 `open` 属性开模态
`<dialog open>` 得到的是**非模态**——不进顶层、无遮罩、不困焦点、`Esc` 不关。要真模态**必须** `showModal()`。
:::

</v-click>

---

# `::backdrop` 与自动居中

```css
dialog::backdrop {
  background: rgb(0 0 0 / 50%);
  backdrop-filter: blur(2px);
}
```

<v-click>

模态 `<dialog>` 进顶层后**浏览器自动把它居中**——省掉 `inset:0 + margin:auto` 或 `translate(-50%,-50%)` 那套手工活，也绕开 `transform` 夺包含块的坑。

</v-click>

---

# 顶层弹层 + 锚点定位：天作之合

```css
#menu {
  /* #menu 是 popover，触发按钮已是隐式锚点，无需手写 anchor-name */
  position-area: bottom;   /* 直接摆到按钮正下方 */
  margin-top: 0.4rem;
}
```

<v-click>

`popover` / `<dialog>` 解决「层级与裁剪」，但默认不贴按钮（多为居中）。叠加锚点定位 → 同时拿下「免 `z-index`/`overflow`」与「跟随 + 自动避让」。

</v-click>

<v-click>

::: tip 仍需降级
锚点定位是 Baseline 2026——不支持时弹层落到默认居中位置，**功能不坏、只是位置退化**。
:::

</v-click>

---

# Baseline 状态速查（2026-06 核）

| 特性 | 状态 | 建议 |
| --- | --- | --- |
| `position` 五取值 / `inset` | ✅ 广泛可用（2015） | 放心用 |
| `display: flow-root` / `isolation` | ✅ 广泛可用 | 首选 |
| `<dialog>`（`showModal`/`::backdrop`） | ✅ 广泛可用（2022） | 模态首选 |
| `popover` 属性 | 🟡 新近可用（2024） | 老浏览器需回退 |
| CSS 锚点定位 | 🟠 **新近可用（2026）** | **必须 `@supports` 降级** |

---
layout: center
class: text-center
---

# 谢谢

包含块决定「相对谁」，层叠上下文决定「谁压谁」——吃透这两个概念，`sticky` 静默失效、`fixed` 被夺权、`z-index` 困局就都迎刃而解

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
