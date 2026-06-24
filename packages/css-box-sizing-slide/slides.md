---
theme: seriph
background: https://cover.sli.dev
title: CSS 盒模型与尺寸
info: |
  CSS 盒模型与尺寸 —— 盒模型四层、box-sizing、display 全谱、外边距合并与 BFC、内在尺寸、aspect-ratio、overflow
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:css-3 class="text-8xl" />
</div>

<br/>

## CSS 盒模型与尺寸

一个盒子有多大、怎么排、装不下怎么办（基于 CSS 现代标准）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
CSS 布局再花哨，底座永远是这条主线：一个盒子占多大、它在流里怎么排、装不下怎么办。
-->

---
transition: fade-out
---

# 一条主线：五个问题

CSS 布局再花哨，底座永远是这五问

<v-click>

- **一个盒子占多大？** → 盒模型四层 + `box-sizing`
- **它在流里是块还是行？** → `display` 外 / 内显示类型
- **相邻盒子间距怎么算？** → 外边距合并与 BFC
- **大小由谁说了算？** → 固定值 vs 内在尺寸关键字
- **装不下怎么办？** → `aspect-ratio` 预留、`overflow` 裁切或滚动

</v-click>

<v-click>

> 这五问是 CSS 一切布局的原子，本场顺着它逐一拆开。

</v-click>

---
layout: section
---

# 一、盒模型与 box-sizing

一个盒子，到底占多大空间？

---

# 一切皆盒：四层区域

每个元素都是一个矩形盒，由内向外四层

<v-click>

```
┌──────── margin（外边距 · 透明 · 盒间间隔）────────┐
│  ┌───── border（边框 · 可见的框）────────────┐  │
│  │  ┌── padding（内边距 · 背景铺到这里）──┐  │  │
│  │  │      content（内容 · 文字/图片）    │  │  │
│  │  └────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

</v-click>

<v-click>

`width` / `height` 默认量**内容盒**；`outline` 与 `box-shadow` 画在外边距区之上，**不占布局空间**。

</v-click>

---

# 四层各管什么

<v-click>

- **内容盒**：文字 / 图片真正所在，`width` / `height` 默认量这层
- **内边距盒**：`padding` 撑开，在边框**内**侧——**背景铺到这里**
- **边框盒**：`border` 画出的可见框
- **外边距盒**：盒子**之间**的透明间隔，`margin` 留出

</v-click>

<v-click>

::: tip padding 与 margin 最直观的区别
背景会铺满到**内边距**区，但**不会**进外边距区（外边距透明）。
:::

</v-click>

---

# `box-sizing`：width 量哪一层

同写 `width: 350px`，盒子最终多宽取决于它

<v-click>

```css
.box {
  box-sizing: content-box; /* 默认值 */
  width: 350px;
  padding: 20px;
  border: 10px solid;
}
```

</v-click>

<v-click>

默认 `content-box` 下，`width` **只算内容**，内边距 / 边框往外加：

```
350 + 20×2 + 10×2 = 410px  ← 你写的 350 不是最终宽
```

</v-click>

---

# `border-box`：所见即所得

把 `width` 应用到**边框盒**，内边距 / 边框往里挤

<v-click>

```css
.box {
  box-sizing: border-box;
  width: 350px; /* 最终就铁定是 350px */
  padding: 20px;
  border: 10px solid;
}
/* 留给内容：350 − 20×2 − 10×2 = 290px */
```

</v-click>

<v-click>

::: tip 一个安全保证
`border-box` 下内容盒最小被钳到 **0，不会变成负数**——即便内边距 + 边框超过 `width`，盒子也不会塌掉。
:::

</v-click>

---

# content-box vs border-box

| | `content-box`（默认） | `border-box`（推荐） |
| --- | --- | --- |
| `width` 量的是 | 内容盒 | 边框盒 |
| 加内边距 / 边框 | 往外加，盒子变大 | 往里挤，盒子不变 |
| 写 `width: 350px` | 350 + 内边距 + 边框 | 恰好 350 |
| 加内边距时 | 整体「胀」开，易溢出 | 外尺寸纹丝不动 |

<v-click>

布局时不必反复做加法——这正是 `border-box` 更可预测的原因。

</v-click>

---

# 第一条规则：全局 border-box

几乎每个现代项目样式表的开头第一段

```css
/* 所有元素 + 所有伪元素都用 border-box */
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

<v-click>

- `box-sizing` **不会继承**——只设在 `body` 上，子元素仍是默认 `content-box`
- 必须用 `*` 通配（或 `html` 设 + `* { box-sizing: inherit }`）
- Baseline 广泛可用（2015 起全浏览器支持）

</v-click>

---

# padding 与 margin 的差异

都是「留白」，性质不同，混用是常见 bug 源

| | `padding`（内边距） | `margin`（外边距） |
| --- | --- | --- |
| 位置 | 边框**内**侧 | 边框**外**侧 |
| 背景 | 铺到内边距区 | 透明，不显示 |
| 负值 | **不允许** | **允许**（拉近 / 重叠） |
| 合并 | 不合并 | 块向会**合并** |
| 点击区 | 算进元素 | 不算 |

---

# 逻辑属性：跟着书写方向走

物理 `padding-left` 永远指左；逻辑属性按**书写方向**取值

<v-click>

```css
.card {
  padding-inline: 1rem; /* 行向（横排时 = 左右内边距） */
  padding-block: 0.5rem; /* 块向（横排时 = 上下内边距） */
  margin-inline-start: auto; /* 行向起点（LTR 下 = 左） */
}
```

</v-click>

<v-click>

- `*-inline`：沿**行**方向（文字流动方向）
- `*-block`：沿**块**方向（行堆叠方向）
- 随 `writing-mode` 自动适配阿拉伯语 / 竖排，国际化更稳

</v-click>

---
layout: section
---

# 二、display 全谱

这个盒子在流里，是块还是行？

---

# display 其实设两件事

规范里它**同时**设定两个维度

<v-click>

- **外显示类型**：这个盒子对**外**怎么参与父级的流——块盒 `block` / 行内盒 `inline`
- **内显示类型**：这个盒子对**内**怎么排子元素——`flow` / `flow-root` / `flex` / `grid` / `table`

</v-click>

<v-click>

> 理解了「外管参与方式、内管子元素布局」，`display` 一长串取值就不再需要死记。

</v-click>

---

# 现代双值语法

把两个维度**显式分开写**

```css
.a { display: block flow; }       /* 块盒 + 普通流 */
.b { display: inline flow; }      /* 行内盒 + 普通流 */
.c { display: inline flow-root; } /* 行内盒 + 开 BFC */
.d { display: block flow-root; }  /* 块盒 + 开 BFC */
.e { display: block flex; }       /* 块级 flex 容器 */
```

<v-click>

只写一个内显示类型时，外类型默认补 `block`（`ruby` 例外，默认 `inline`）。

</v-click>

---

# 单值简写 = 双值

平时写的全是双值的**预合成简写**

| 单值（你写的） | = 双值（真正的意思） |
| --- | --- |
| `block` | `block flow` |
| `inline` | `inline flow` |
| `inline-block` | `inline flow-root` |
| `flow-root` | `block flow-root` |
| `flex` / `grid` | `block flex` / `block grid` |

<v-click>

一眼看穿：`inline-block` 其实是「行内盒 + flow-root」。

</v-click>

---

# block / inline / inline-block

普通流里最常打交道的三种身份

```css
.block        { display: block; }        /* 独占一行，默认占满 */
.inline       { display: inline; }       /* 随文字排，宽高无效 */
.inline-block { display: inline-block; } /* 随文字排，宽高生效 */
```

<v-click>

- **`block`**：前后换行，**默认填满父级行向空间**（`<div>` `<p>`）
- **`inline`**：嵌在文字里不换行；`width` / `height` 无效（`<span>` `<a>`）
- **`inline-block`**：随文字排，但**尊重宽高与上下外边距**，且自己开 BFC

</v-click>

---

# inline 的外边距「不被尊重」

<v-click>

web.dev 原话：`inline` 元素「有块向外边距，但**其他元素不尊重它**」。

</v-click>

<v-click>

意思是：外边距值**存在**，却不会真的把上下的元素推开。

</v-click>

<v-click>

::: warning 需要垂直间距，别用纯 inline
`inline-block` 修好了这点——「其他元素会尊重它的块向外边距」。需要上下间距时改用它，或交给 Flex / Grid。
:::

</v-click>

---

# flow-root：专为开 BFC 而生

<v-click>

`display: flow-root` 生成一个**块盒**，并让它**建立一个新 BFC**——没有任何别的副作用。

</v-click>

<v-click>

名字 `flow-root`（流的根）点明意图：让这个盒子像文档根 `<html>` 一样，**为内部普通流开一个独立上下文**。

</v-click>

<v-click>

> 它最经典的两个用途——**包住内部浮动**、**阻止父子外边距合并**——是下一节的主角。2019 起 Baseline。

</v-click>

---

# none vs contents：两种「消失」

都让元素「不见了」，但机制完全相反

<v-click>

```css
.hidden { display: none; }      /* 从盒树彻底移除 */
.unwrap { display: contents; }  /* 移除自己这层盒子 */
```

</v-click>

<v-click>

- **`none`**：从盒树**彻底删除**——不渲染、不占空间、**子孙全消失**、从无障碍树移除
- **`contents`**：只移除**自己这层盒子**，**子元素上浮**，当作父级的直接子元素

</v-click>

<v-click>

::: tip 想留占位空间？用 visibility: hidden
`none` 不留空间；要「看不见但位置还在」用 `visibility: hidden`。
:::

</v-click>

---

# contents 的杀手级场景

让包装层「脱壳」，子元素直接参与父级 Flex / Grid

```html
<ul style="display: flex">
  <li>A</li>
  <!-- 这层包装 div 脱壳，让 li 直接成为 flex item -->
  <div style="display: contents">
    <li>B</li>
    <li>C</li>
  </div>
</ul>
```

<v-click>

::: warning 带语义元素上的无障碍坑
早期实现有 bug：会连同语义一起从无障碍树移除。现代浏览器基本修复，但用在 `<ul>` / `<table>` 等带语义元素上仍建议实测读屏；纯 `<div>` 包装层安全。
:::

</v-click>

---

# table 系列：CSS 模拟表格

让任意元素表现得像 `<table>` 的各部分

| `display` 值 | 等价 HTML |
| --- | --- |
| `table` | `<table>` |
| `table-row` | `<tr>` |
| `table-cell` | `<td>` |
| `table-row-group` | `<tbody>` |
| `table-caption` | `<caption>` |

<v-click>

Flex / Grid 普及前用于「等高列」「垂直居中」；注意 `table-cell` / `table-caption` 也**开 BFC**。

</v-click>

---
layout: section
---

# 三、外边距合并与 BFC

相邻盒子之间的间距，到底怎么算？

---

# 外边距合并：最反直觉的间距

```html
<p style="margin-bottom: 30px">第一段</p>
<p style="margin-top: 20px">第二段</p>
```

<v-click>

你以为间距是 `30 + 20 = 50px`？**错，实际只有 30px**。

</v-click>

<v-click>

相邻的**块向（垂直）**外边距不会相加，而是**合并成一个**，取**较大的那个**。这是普通流里刻意的规则——避免段落、标题堆叠时间距反复累加。

</v-click>

---

# 只有块向（垂直）合并

<v-click>

::: warning 水平方向永不合并
左右相邻元素的 `margin-left` / `margin-right` 老老实实**相加**。
:::

</v-click>

<v-click>

- 合并只发生在普通流的**块向**（横排时即垂直方向）
- **Flex / Grid 子项之间也不会**发生外边距合并

</v-click>

<v-click>

> 所以「为什么我的间距没翻倍」往往就是块向外边距合并在起作用。

</v-click>

---

# 三种合并场景

外边距合并恰好发生在三种情形

<v-click>

- **① 相邻兄弟**：前一个的 `margin-bottom` 与后一个的 `margin-top` 合并（最常见）
- **② 父与首/末子元素**：父子间无 `border` / `padding` / 内容隔开时，子的外边距**穿透**父级（最隐蔽）
- **③ 空块自身**：空块的上下 margin 合并成一个

</v-click>

<v-click>

> 场景 ② 正是「我给子元素设了 `margin-top`，父容器却整体往下掉、父子间没间距」的元凶。

</v-click>

---

# 场景二：父子穿透（最坑）

父子之间**没东西隔开**时，子的外边距跑到父级外面

```html
<div class="parent">
  <!-- 这个 h2 的 margin-top 穿透 parent，跑到 parent 上方 -->
  <h2 style="margin-top: 40px">标题</h2>
</div>
```

<v-click>

打断穿透的隔离：给父级加 `padding-top`（哪怕 `1px`）或 `border-top`；或开 BFC。

</v-click>

<v-click>

> 同理，父的 `margin-bottom` 会和**末子元素**合并（除非父设了 `height` / `padding-bottom` 等）。

</v-click>

---

# 负外边距的合并规则

掺入负值后按这套算

<v-click>

- **有正有负**：结果 = **最大正值** − **最大负值的绝对值**
  - 例：`30px` 与 `-20px` → `30 − 20 = 10px`

</v-click>

<v-click>

- **全是负值**：结果 = **绝对值最大（最负）的那个**
  - 例：`-20px` 与 `-30px` → `-30px`

</v-click>

<v-click>

> 这套规则对相邻兄弟和父子嵌套都成立。

</v-click>

---

# BFC：一块自成一体的区域

**块格式化上下文（BFC）** = 页面里一块**独立的布局区域**，与外界隔离

<v-click>

建立新 BFC 后获得三种能力：

1. **包住内部浮动**——浮动不溢出它（解决高度塌陷）
2. **挡开外部浮动**——外面浮动不侵入它
3. **阻止外边距合并**——它与内部子元素的外边距不再合并

</v-click>

<v-click>

> 这三件事正是 CSS 布局里最经典的三个「怎么又踩坑」。

</v-click>

---

# 怎么阻止外边距合并

合并不是你想要的时（尤其场景二），任选其一打断

<v-click>

- 父子间**加隔离**：父级加 `padding-top` 或 `border-top`
- 让父级**开一个 BFC**（最干净）
- 换成 **Flex / Grid** 容器——子项不发生合并
- 父级**浮动**或**绝对定位**——永远不合并
- 给父级设 `height` / `min-height`（针对末子穿透）

</v-click>

---

# 用途一：BFC 清浮动

浮动脱离普通流 → 父容器「**高度塌陷**」，背景 / 边框缩成一条线

```css
/* 父容器开 BFC，把浮动子元素「包」回来，恢复高度 */
.clearfix {
  display: flow-root;
}
```

<v-click>

父级算不进浮动子元素的高度——开 BFC 后，浮动被「关」在里面，父级高度恢复正常。

</v-click>

---

# 用途二：阻止父子合并

回到场景二的难题——给父级开 BFC

```css
.parent {
  display: flow-root; /* 子元素的 margin-top 被关在里面，不再穿透 */
}
```

<v-click>

子元素的 `margin-top` 被**关在 BFC 里**，不再穿透到父级外——父子之间恢复正常间距。

</v-click>

---

# 怎么创建一个 BFC

以下任意一条都会让元素建立新 BFC（节选最常用）

| 触发方式 | 说明 |
| --- | --- |
| `display: flow-root` | **现代正解**，零副作用 |
| `overflow` 非 `visible`/`clip` | `hidden` / `auto` / `scroll`（有副作用） |
| `float` 不为 `none` | 浮动元素 |
| `position: absolute` / `fixed` | 绝对 / 固定定位 |
| `display: inline-block` / `table-cell` | 行内块 / 表格单元 |
| Flex / Grid 子项、多列容器 | — |

---

# 现代正解：flow-root

历史上靠 `overflow: hidden` 顺手开 BFC，但 MDN 明确指出其问题

<v-click>

> 用 `overflow` 开 BFC，可能导致**意外的滚动条**或**被裁切的阴影**，也让后来者**看不懂为什么用了 `overflow`**。

</v-click>

<v-click>

```css
.bfc     { display: flow-root; } /* 推荐：语义明确、零副作用 */
.bfc-old { overflow: hidden; }   /* 不推荐：靠副作用，意图不明 */
```

`flow-root` 自 2019 起 Baseline，新代码应优先用它。

</v-click>

---
layout: section
---

# 四、尺寸与内在尺寸关键字

盒子的大小，由谁说了算？

---

# 外在 vs 内在：谁决定大小

盒子的大小，本质是两种思路的较量

<v-click>

- **外在尺寸（extrinsic）**：**你**用 `width` / `height` 给固定值——可控，但内容比尺寸大就**溢出**
- **内在尺寸（intrinsic）**：让**浏览器**按**内容**定大小——天然防溢出，但放弃精确控制

</v-click>

<v-click>

> web.dev 的比喻：固定尺寸像**硬玻璃杯**（水太多会溢），内在尺寸像**能随水量变形的杯子**（永远刚好装下）。

</v-click>

---

# 外在尺寸：固定值与百分比

```css
.box {
  width: 400px; /* 固定宽 */
  width: 50%; /* 父级可用宽度的一半 */
}
```

<v-click>

::: warning padding/margin 百分比的坑
`padding` / `margin` 的百分比，**无论方向**（含上下），**一律相对父级宽度**算——`padding-top: 10%` 是父级**宽度**的 10%，不是高度。
:::

</v-click>

---

# min / max 设上下限

```css
.box {
  width: 50%;
  min-width: 320px; /* 再窄不能窄于 320px */
  max-width: 1200px; /* 再宽不能宽于 1200px */
}
```

<v-click>

- 优先级：**`max-width` 覆盖 `width`，`min-width` 又覆盖 `max-width`**
- 「先按 `width`，再被 `max` 压顶、被 `min` 托底」
- ⚠️ `min-width: 100%` / `min-content` 在某些上下文**可能比父级还宽**而溢出

</v-click>

---

# 视口单位

```css
.hero {
  height: 100vh; /* 视口高度的 100% */
  width: 100vw; /* 注意含滚动条宽，可能横向溢出 */
}
```

<v-click>

- `vw` / `vh` 相对**视口**；`vmin` / `vmax` 取宽高中较小 / 较大者
- 移动端地址栏伸缩：`svh`（最小）/ `lvh`（最大）/ `dvh`（动态）
- 做全屏首屏时，`dvh` 通常比 `vh` 体验更稳

</v-click>

---

# min-content：缩到最长单词

```css
.box {
  width: min-content;
}
```

<v-click>

把盒子缩到**不溢出的最小宽**——文字在每个换行点都折行，盒子只有**最长单词**那么宽。

```
┌──────┐
│ Item │
│ with │  ← 每个词都折行，
│ more │    盒子 = 最长单词宽
│ text │
└──────┘
```

</v-click>

---

# max-content：撑到一行不换

```css
.box {
  width: max-content;
}
```

<v-click>

把盒子撑到**容纳全部内容、完全不折行**所需的宽——一个换行都不打，哪怕**溢出**容器也在所不惜。

```
┌────────────────────────────┐
│ Item with more text in it. │  ← 一行到底，可能冲出容器
└────────────────────────────┘
```

</v-click>

---

# fit-content：聪明的折中

实务中最常用——像 `max-content` 贴内容，但**绝不超过可用空间**

```css
/* 标题背景色块只包住文字，而非铺满一整行 */
.tag {
  width: fit-content;
  padding: 0.25rem 0.75rem;
}
```

<v-click>

MDN 等价公式（永不小于 `min-content`、永不大于 `max-content`）：

```
fit-content = min( max-content, max( min-content, 可用空间 ) )
```

</v-click>

---

# fit-content() 函数：带上限

注意区分：`fit-content` **关键字** 和 `fit-content()` **函数** 是两回事

```css
/* 内容自适应，但最宽不超过 20em */
.col {
  width: fit-content(20em);
}

/* 多用于 Grid 轨道：按内容伸缩，但封顶 300px */
.grid {
  grid-template-columns: fit-content(300px) 1fr;
}
```

<v-click>

函数版接收一个参数作为**上限**，把 `fit-content` 的自适应「封顶」。

</v-click>

---

# 三个关键字对照

| 关键字 | 文字怎么排 | 盒子宽度 | 典型用途 |
| --- | --- | --- | --- |
| `min-content` | 能折就折，挤最窄 | = 最长单词宽 | 极窄列、避免溢出 |
| `max-content` | 完全不折行 | = 一整行宽（可溢出） | 不希望折行的标签 |
| `fit-content` | 够不折、不够才折 | 贴内容 ≤ 可用空间 | **贴文字的按钮**（最常用） |

<v-click>

三者均 Baseline 广泛可用（`min/max-content` 2020 起、`fit-content` 2021 起）。

</v-click>

---

# 别忘了逻辑属性

尺寸也有逻辑等价物——**优先用它们**，国际化更稳

```css
.box {
  inline-size: 50%; /* = 书写方向下的「宽」（横排时即 width）*/
  block-size: 200px; /* = 书写方向下的「高」 */
  max-inline-size: 65ch; /* = max-width，65 字符宽，最佳阅读行长 */
}
```

<v-click>

`inline-size` / `block-size` 等会随 `writing-mode` 自动对应物理宽或高，一套代码适配横排与竖排。

</v-click>

---
layout: section
---

# 五、aspect-ratio 与防 CLS

锁定宽高比，消除图片加载时的页面跳动

---

# 一行锁定宽高比

过去要用「`padding-top` 百分比 + 绝对定位」hack，现在一行搞定

```css
.video {
  width: 100%;
  aspect-ratio: 16 / 9; /* 宽随容器变，高自动 = 宽 × 9/16 */
}
```

<v-click>

无论容器或视口怎么变，浏览器都**自动调整另一边**来维持比例。Baseline 2021 广泛可用。

</v-click>

---

# 取值速览

```css
aspect-ratio: auto; /* 默认；替换元素则用固有比例 */
aspect-ratio: 1 / 1; /* 正方形 */
aspect-ratio: 16 / 9; /* 宽屏 */
aspect-ratio: 0.5; /* = 1 / 2，高是宽两倍 */
aspect-ratio: 3 / 2 auto; /* 替换元素回退 */
```

<v-click>

`<ratio>` 写成 `宽 / 高`；**省略斜杠和高度时，高度默认为 1**——`aspect-ratio: 1` 就是 `1 / 1`。

</v-click>

---

# 生效前提：至少一边 auto

最容易踩的一点——MDN 说得很直接

```css
/* ✅ 生效：宽固定、高 auto，高被算成 200×9/16 ≈ 112px */
.a { width: 200px; height: auto; aspect-ratio: 16 / 9; }

/* ❌ 不生效：宽高都写死，aspect-ratio 被忽略 */
.b { width: 200px; height: 200px; aspect-ratio: 16 / 9; }
```

<v-click>

- 宽固定、高 auto → **高**被算出来维持比例
- 高固定、宽 auto → **宽**被算出来维持比例
- 宽高都显式指定 → 比例**被忽略**

</v-click>

---

# 内容比盒子大时会「让步」

<v-click>

`aspect-ratio` 设的是**首选**比例。

</v-click>

<v-click>

::: warning 内容会撑破比例
如果盒子里的内容撑得比按比例算出的尺寸还大，盒子会**被内容撑开**而打破比例（为了不裁切内容）。
:::

</v-click>

<v-click>

> 需要严格锁定时，配合 `overflow: hidden` 或 `min-height: 0` 使用。

</v-click>

---

# 替换元素的占位回退

`<img>` / `<video>` 自带**固有宽高比**；`auto && <ratio>` 提供「占位 + 固有」回退

```css
img {
  width: 200px;
  aspect-ratio: 3 / 2 auto;
}
```

<v-click>

- **图片加载前**：用 `3 / 2` 作占位比例，先占好空间
- **图片加载后**：`auto` 接管，改用图片的**真实固有比例**

</v-click>

---

# 用 aspect-ratio 消除图片 CLS

**累积布局偏移（CLS）** 是 Core Web Vitals 之一

<v-click>

图片加载完成的瞬间，若之前**没占住高度**，下方内容被突然推下去——页面一跳，体验差还扣分。

</v-click>

<v-click>

> 解法：让图片在**加载前就预留正确高度**，加载完成时不再跳动。

</v-click>

---

# 现代答案：HTML 写 width/height

给 `<img>` 同时写 HTML 的 `width` / `height` **属性**（不是 CSS）

```html
<!-- 浏览器据此自动推导 aspect-ratio = 800/600，加载前就占好位 -->
<img src="photo.jpg" width="800" height="600" alt="一张照片" />
```

```css
img {
  height: auto;
  max-width: 100%;
}
```

<v-click>

浏览器**根据属性自动算出 `aspect-ratio`**，加载前预留高度——这是今天处理图片 CLS 的标准做法。

</v-click>

---

# 显式 CSS 写法

适合背景图、`object-fit` 裁切等场景

```css
.thumb {
  aspect-ratio: 1 / 1; /* 正方形缩略图，加载前就占好位 */
  width: 100%;
  object-fit: cover; /* 图片填满并裁切，不变形 */
}
```

<v-click>

::: tip box-sizing 对它的影响
`<ratio>` 形式作用于哪层盒子取决于 `box-sizing`（全局 `border-box` 下算边框盒）；`auto`（固有比例）**始终基于内容盒**。
:::

</v-click>

---
layout: section
---

# 六、overflow 与滚动容器

内容装不下盒子，是裁切还是滚动？

---

# 溢出是什么

**溢出** = 内容**太大、装不下它所在的盒子**

<v-click>

尺寸被 `width` / `height` 限死，内容又比它大，多出来的部分要有去处——这正是 `overflow` 管的事。

</v-click>

<v-click>

> web.dev 的设计原则：**「安全的布局优先于精确的布局」**——默认 `visible`，宁可让内容溢出**显示**（你能看见、能修），也不默默裁掉造成数据丢失。

</v-click>

---

# overflow 的五个取值

```css
.box {
  overflow: visible; /* 默认：溢出照常显示在盒外 */
  overflow: hidden; /* 裁切，无滚动条 */
  overflow: scroll; /* 恒显示滚动条（哪怕没溢出）*/
  overflow: auto; /* 按需：溢出才出条（最常用）*/
  overflow: clip; /* 裁切，且禁一切滚动 */
}
```

<v-click>

`overflow-x` / `overflow-y` 分轴控制；简写 `overflow: hidden scroll` 中**第一值给 x、第二值给 y**。

</v-click>

---

# scroll vs auto：条何时出现

差别只在**滚动条的显隐时机**

| | 内容**没**溢出 | 内容溢出 |
| --- | --- | --- |
| `scroll` | **仍显示**（空滑道） | 显示滚动条 |
| `auto` | 不显示 | 显示滚动条 |

<v-click>

日常想要「内容多了能滚」用 `auto`；想避免滚动条忽有忽无导致横向跳动，用 `scroll` 恒占位或 `scrollbar-gutter`。

</v-click>

---

# clip vs hidden：能否程序滚

都裁切看不见的部分，区别在**能不能用 JS 滚**

<v-click>

- **`hidden`**：视觉上裁切，但元素**仍可滚动**——`scrollTo()` / `scrollLeft` 仍有效
- **`clip`**：**彻底禁止滚动**，连程序化滚动也不行，性能略轻

</v-click>

<v-click>

> 需要「就是要硬裁、绝不滚动」时用 `clip`；需要保留 JS 滚动能力时用 `hidden`。

</v-click>

---

# 分轴控制的一个坑

```css
.table-wrap {
  overflow-x: auto; /* 横向按需滚（宽表格常用）*/
  overflow-y: hidden; /* 纵向裁切 */
}
```

<v-click>

::: warning 另一轴会被「连累」成 auto
某一轴设成**非 `visible`** 时，另一轴的 `visible` 会被**强制计算为 `auto`**。所以 `overflow-x: hidden; overflow-y: visible` 实际跑起来 `overflow-y` 变成 `auto`——「只裁一个方向、另一向完全溢出可见」CSS 做不到。
:::

</v-click>

---

# 滚动容器：必须有确定高度

`overflow` 取**非 `visible`** 值 → 元素成为**滚动容器**（同时也开 BFC）

<v-click>

但有个常被忽略的前提：**滚动容器必须有一个确定的尺寸**，内部才滚得起来。

```css
/* 想让聊天记录区内部滚动，必须给它高度上限 */
.messages {
  height: 400px; /* 或 max-height / flex 约束 */
  overflow-y: auto;
}
```

</v-click>

<v-click>

只设 `overflow-y: auto` 却没限高的 `<div>`，会一直被内容撑高、**永远不出滚动条**。

</v-click>

---

# scrollbar-gutter：防滚动条挤动

桌面**经典滚动条**出现时占掉一条宽，把内容往里挤——整页**横向抖一下**

```css
html {
  scrollbar-gutter: stable; /* 始终预留滚动条槽位，不抖动 */
}
```

<v-click>

- `stable`：经典滚动条下，即使没溢出也**预留**槽位
- `stable both-edges`：对侧也预留，保持左右对称（居中布局适用）
- Baseline 2024 新近可用；覆盖式滚动条本就不占空间

</v-click>

---

# overscroll-behavior：阻断滚动链

滚动容器**滚到边界**后继续滚，默认带动父级 / 整页一起滚（**滚动链**）

```css
.modal-body {
  overflow-y: auto;
  overscroll-behavior-y: contain; /* 滚到边界不再带动背景页面 */
}
```

<v-click>

- `contain`：内部保留默认（如回弹），但**不向相邻滚动区传播**——模态框 / 侧栏必备
- `none`：既不传播，也禁止默认溢出行为（可阻止移动端下拉刷新）
- ⚠️ **尚非 Baseline**，纯渐进增强，不支持时退回默认滚动链

</v-click>

---

# 最佳实践小结

<v-click>

- 第一条规则：`*, *::before, *::after { box-sizing: border-box; }`
- `display` = 外（怎么参与流）+ 内（子元素怎么排）；开 BFC 用 `flow-root`
- 外边距合并取**较大值**，最坑是父子穿透——加 `padding` / `border` / BFC 挡掉
- 让内容定大小：`fit-content` 最常用；视口高用 `dvh`
- `aspect-ratio` 至少一边 auto 才生效，配 `<img>` 的 `width`/`height` 防 CLS
- 装不下：`overflow: auto` 最常用，滚动容器记得给确定高度

</v-click>

---
layout: center
class: text-center
---

# 谢谢

把「盒子多大、怎么排、装不下怎么办」想清楚，CSS 布局的地基就稳了

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
