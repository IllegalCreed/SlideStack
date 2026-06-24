---
theme: seriph
background: https://cover.sli.dev
title: CSS Grid 网格布局
info: |
  CSS Grid 网格布局 —— 轨道、区域、放置、隐式网格、auto-fit/fill、subgrid、对齐
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:css-3 class="text-8xl" />
</div>

<br/>

## CSS Grid 网格布局

唯一真正的二维布局，横竖同时由你掌控（基于 CSS 现代标准）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
在 Grid 之前，CSS 没有真正的二维布局；float、inline-block、表格都是「借用」别的机制凑版面。Grid 让横竖两个方向同时受控。
-->

---
transition: fade-out
---

# 这一章讲什么

先画一张网格，再把元素放进格子——横竖同时掌控

<v-click>

- **划轨道**：`grid-template-columns/rows`、`fr` / `minmax` / `repeat`
- **画版面**：`grid-template-areas` 用字符画描述布局
- **放元素**：基于线坐标、`span`、负数线、命名线
- **自动化**：隐式网格、`auto-fill` vs `auto-fit`、RAM 模式
- **进阶**：`subgrid` 对齐、`place-items` 对齐

</v-click>

<v-click>

> 一句话判断 Grid 还是 Flexbox：**内容决定布局用 Flexbox，布局决定内容用 Grid**。

</v-click>

---

# 从一维到二维

Flexbox 是**一维**（单轴排一串），Grid 是**二维**（行列同时）

<v-click>

| 维度 | 谁 | 适合 |
| --- | --- | --- |
| 一维 | Flexbox | 沿一根轴排、数量不定（导航条、图标+文字） |
| 二维 | Grid | 先有版面格子、再往里填（整页骨架、卡片画廊） |

</v-click>

<v-click>

二者可嵌套：**Grid 划大版面，每个格子内部再用 Flexbox 排内容**。

</v-click>

---

# 五个核心概念

理解 Grid 只需记住五个词

<v-click>

| 概念 | 说明 |
| --- | --- |
| 容器 container | 设了 `display: grid` 的元素 |
| 网格项 item | 容器的**直接子元素**（孙元素不算） |
| 网格线 line | 横竖分隔线，从 `1` 编号 |
| 轨道 track | 相邻两线之间，即一行 / 一列 |
| 区域 area | 跨多个单元格围成的**矩形** |

</v-click>

<v-click>

⚠️ 线从 `1` 开始，不是 0：三列网格有 **4 条竖线**。

</v-click>

---

# 开网格：最小可跑

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 三等分列 */
  gap: 16px; /* 单元格之间留 16px */
}
```

<v-click>

- `display: grid` 后，**直接子元素**自动成为网格项
- 只定义了三列、没定义行 → 多出的项**自动换到下一行**
- 这些自动新增的行就是「隐式网格」

</v-click>

---

# 间距用 `gap`，别用 margin

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px; /* 行列都 16px；也可 gap: 行 列 */
}
```

<v-click>

- `gap` 在网格里像「**透明的粗线**」占位
- **先于 `fr` 分配**：先扣掉间距，剩下的才按 `fr` 分给各列
- 用 `margin` 会在边缘多留间距、且难以均匀

</v-click>

---
layout: section
---

# 轨道与 fr / minmax / repeat

Grid 灵活性的来源

---

# 轨道：网格的骨架

```css
.container {
  display: grid;
  grid-template-columns: 200px 100px 30%; /* 三列 */
  grid-template-rows: 100px auto; /* 两行 */
}
```

<v-click>

值里写几个尺寸，就有几条轨道。尺寸可以是：

- 固定 `px` / `em` / `rem`、百分比 `%`
- 弹性单位 `fr`、内容关键字、`minmax()` / `fit-content()`

</v-click>

---

# `fr`：弹性的份额

`fr` = 网格容器中**剩余可用空间**的一份

```css
.container {
  grid-template-columns: 250px 1fr 2fr; /* 定宽 + 弹性混合 */
}
```

<v-click>

关键在「**剩余**」二字：先扣掉 `250px` 和两段 `gap`，余下的再按 `1:2` 分给后两列。

</v-click>

<v-click>

- `1fr 1fr 1fr` = 三等分
- `1fr 2fr 1fr` = 中间列是两侧的两倍

</v-click>

---

# 等分坑：`minmax(0, 1fr)`

裸 `fr` 隐含 `minmax(auto, 1fr)`——有个 `auto` 最小值

<v-click>

塞进一张很宽的图 / 一长串不可断英文时，轨道**不会被压到比内容窄**，于是撑破等分比例。

</v-click>

<v-click>

```css
/* 严格 1:1:1，即使内容很宽也不破坏比例 */
.container {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
```

这是「为什么我的等分列没对齐」的**头号原因**，记住这个修复配方。

</v-click>

---

# `minmax()`：给轨道伸缩范围

`minmax(min, max)` 让轨道在最小与最大间伸缩

```css
.container {
  grid-template-columns: minmax(200px, 1fr); /* 最少 200，最多 1 份 */
}
```

<v-click>

| 位置 | 可取 | 不可取 |
| --- | --- | --- |
| `min` | `<length>` / `%` / `min-content` / `auto` | **不能是 `fr`** |
| `max` | 上述全部 **+ `fr`** | — |

</v-click>

<v-click>

`max < min` 时 `max` 被忽略，整体当 `min`。

</v-click>

---

# `repeat()`：别手写一堆 `1fr`

```css
.container {
  grid-template-columns: repeat(12, 1fr); /* 12 列栅格 */
}
```

<v-click>

- 重复模式：`repeat(5, 1fr 2fr)` = 10 条轨道
- 部分重复：`20px repeat(6, 1fr) 20px`（首尾固定，中间均分）

</v-click>

<v-click>

把次数换成 `auto-fill` / `auto-fit`，浏览器**自动算能放几列**——响应式的关键（后面详谈）。

</v-click>

---

# 内容驱动尺寸

让**内容自己决定**轨道尺寸

<v-click>

| 关键字 | 含义 |
| --- | --- |
| `min-content` | 不溢出的最小宽（取最长不可断元素） |
| `max-content` | 内容一行排完、绝不换行（可能很宽） |
| `auto` | 近 `max-content`，但**可被** `align/justify-content` 拉伸 |

</v-click>

<v-click>

```css
.container {
  grid-template-columns: max-content 1fr min-content;
}
```

</v-click>

---

# `auto` 与 `fr` 谁吃剩余空间

这是个容易混的点

<v-click>

- **`fr` 轨道**：靠自身弹性份额**主动**吃掉剩余空间
- **`auto` 轨道**：默认不主动伸展，但**可被** `justify/align-content` 拉伸

</v-click>

<v-click>

> 全是 `auto` 列、内容不满 → 列挤在一起、右侧留白；有 `fr` 列 → 剩余空间被 `fr` 占满。

</v-click>

---

# `fit-content()`：到上限就换行

内容少时像 `max-content`，多到超 `limit` 就在 `limit` 封顶换行

```css
.container {
  grid-template-columns: fit-content(10em) 1fr; /* 最宽 10em */
}
```

<v-click>

等价公式：`fit-content(L)` ≈ `min(max-content, max(min-content, L))`

适合「标题列：短标题贴合、长标题封顶换行」这类自适应侧栏。

</v-click>

---

# 三种轨道策略各司其职

```css
.layout {
  display: grid;
  grid-template-columns: fit-content(16em) minmax(0, 1fr) 240px;
  gap: 24px;
}
```

<v-click>

- `fit-content(16em)`：自适应侧栏（按内容、最宽 16em）
- `minmax(0, 1fr)`：严格弹性主区（不被内容撑破）
- `240px`：定宽边栏

正是真实页面里最常见的组合。

</v-click>

---
layout: section
---

# 模板区域 grid-template-areas

可读性最高的特性：用字符画描述版面

---

# 用「字符画」描述版面

```css
.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
}
```

<v-click>

读这段几乎不需解释：第一列两行都是 `sidebar`（纵跨整列），第二列是 `header` / `main`。**版面一目了然**。

</v-click>

---

# 项认领区域

每个网格项用 `grid-area` 认领名字

```css
.page > header { grid-area: header; }
.page > aside  { grid-area: sidebar; }
.page > main   { grid-area: main; }
```

<v-click>

- 元素放哪只由**名字**决定，和它在 HTML 里的**源顺序无关**
- 可以先写 `<main>`、视觉上却让它排最后

</v-click>

---

# 跨多格：同名相邻自动合并

让同一名字在**相邻位置**重复，自动拼成矩形

```css
.dashboard {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas:
    "hero hero stats"
    "hero hero feed";
}
```

<v-click>

`hero` 横向两列、纵向两行，自动围成一个 **2×2** 的矩形区域。

</v-click>

---

# 留空与矩形铁律

留空单元格用一个点 `.`（连续多个点中间**不能有空格**）

```css
grid-template-areas:
  "header header header"
  "main   main   ."      /* 右上角留白 */
  "footer footer footer";
```

<v-click>

::: warning 区域必须是矩形
同名格子只能围成**矩形**。L 形 / T 形 = **非法**，整条 `grid-template-areas` 失效（散架）。每行单元格数也必须相等。
:::

</v-click>

---

# 命名区域自动生成命名线

定义区域 `content` 会**隐式生成**四条命名线

<v-click>

- 列方向：`content-start` / `content-end`
- 行方向：同名起止线

</v-click>

<v-click>

```css
/* 用区域 main 自动产生的列起始线对齐另一个元素 */
.banner {
  grid-column-start: main-start;
}
```

命名线与命名区域是**一体两面**，可互通混用。

</v-click>

---

# `grid-template` 简写

区域 + 行高 + 列宽一步到位

```css
.page {
  display: grid;
  grid-template:
    "header header" auto
    "sidebar main" 1fr
    "footer footer" auto
    / 200px 1fr;
}
```

<v-click>

每行字符串后跟该**行高度**，所有**列宽**写在末尾 `/` 之后。非常紧凑。

</v-click>

---

# 响应式重排：只改这张图

模板区域最大价值：**换布局只改 `grid-template-areas`**

```css
@media (min-width: 768px) {
  .page {
    grid-template-columns: 200px 1fr;
    grid-template-areas:
      "header  header"
      "sidebar main"
      "footer  footer";
  }
}
```

<v-click>

子元素的 `grid-area` 声明**一行不动**——布局与内容彻底解耦。

</v-click>

---
layout: section
---

# 基于线与区域放置

在已定义的网格里精确摆元素

---

# 网格线坐标系

每条线有编号，从 `1` 开始（左→右、上→下）

```
列线:  1     2     3     4
       ├─────┼─────┼─────┤
       │  A  │  B  │  C  │   ← 三列 = 四条竖线
       └─────┴─────┴─────┘
```

<v-click>

把项「钉」在哪两条线之间，它就占据其间的轨道。

</v-click>

---

# 简写：`grid-column` / `grid-row`

用斜杠简写「`起始线 / 结束线`」

```css
.item {
  grid-column: 1 / 4; /* 从第 1 条到第 4 条 = 横跨 3 列 */
  grid-row: 1 / 3;    /* 纵跨 2 行 */
}
```

<v-click>

```css
.item {
  grid-column: 2; /* 只占一格可省结束值，等价 2 / 3 */
}
```

</v-click>

---

# `span`：只要跨几格

不关心起点，只说「占 N 格」，起点交给自动布局

```css
.wide   { grid-column: span 2; }        /* 跨 2 列 */
.item   { grid-column: 2 / span 3; }    /* 从线 2 起跨 3 列 */
.back   { grid-column: span 2 / 4; }    /* 到线 4、往回跨 2 列 */
```

<v-click>

`span N` 既能放起始侧也能放结束侧，配合另一端的具体线号，灵活表达「锚定一端、延伸 N 格」。

</v-click>

---

# 负数线：`-1` 即最后一条

线编号可用负数，从网格**末尾**往回数

```css
/* 无论几列，都从第一条占到最后一条 = 横跨整个显式网格 */
.full-width {
  grid-column: 1 / -1;
}
```

<v-click>

`grid-column: 1 / -1` 是**出现频率极高**的惯用法——做整页通栏标题 / 分隔条，不必知道有几列。

</v-click>

---

# 负数线只认显式网格

::: warning 隐式轨道数不到
`-1` 指向**显式网格**（你用 `grid-template-*` 定义的部分）的最后一条线。
:::

<v-click>

元素若被放进**隐式网格**（自动新增的轨道），负数线**数不到**它们——这是 `1 / -1` 在自动布局场景偶尔「不如预期」的根源。

</v-click>

---

# 命名线：给坐标起名字

方括号包裹，一条线可起多个名

```css
.container {
  grid-template-columns:
    [full-start] 1fr
    [main-start] minmax(0, 60ch)
    [main-end] 1fr [full-end];
}
```

<v-click>

```css
.article { grid-column: main-start / main-end; }
```

远比记「2 / 3」直观；命名线与命名区域**完全打通**。

</v-click>

---

# `grid-area`：一个属性两副面孔

容易困惑，因为它有**两种完全不同**的用法

<v-click>

```css
/* 用法一：认领命名区域（写名字） */
.sidebar { grid-area: sidebar; }

/* 用法二：四线简写（写数字），顺序 行起 / 列起 / 行止 / 列止 */
.item { grid-area: 1 / 2 / 3 / 4; }
```

</v-click>

<v-click>

记忆：从 `row-start` 开始**逆时针**绕一圈（上→左→下→右）。有没有斜杠决定走哪条路，两者不能混写。

</v-click>

---

# 重叠与层级：`z-index`

多个项落到**同一格**会重叠——「图片上压标题」的原生手段

```css
.stack > .photo,
.stack > .caption {
  grid-column: 1;
  grid-row: 1;
}
.stack > .caption {
  z-index: 1;       /* 标题压在图片之上 */
  align-self: end;  /* 贴到格子底部 */
}
```

<v-click>

配合 `align-self` / `justify-self` 可把重叠的项对齐到格子任意角落。

</v-click>

---
layout: section
---

# 隐式网格与自动布局

项超出显式网格时，自动新增轨道

---

# 显式 vs 隐式网格

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 只显式定义 3 列 */
  gap: 12px; /* 没定义行！ */
}
```

<v-click>

放 7 个项：前 3 个填满第一行，Grid **自动开**第二、三行容纳其余。

这些凭空生出的行就是「隐式网格」。

</v-click>

---

# 控制隐式轨道尺寸

隐式轨道默认 `auto`，用 `grid-auto-rows` / `grid-auto-columns` 指定

```css
.grid {
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(120px, auto); /* 自动行至少 120px */
}
```

<v-click>

接收多个值会**循环套用**：

```css
.grid { grid-auto-rows: 100px 200px; } /* 隐式行高交替 */
```

</v-click>

---

# 自动布局方向：`grid-auto-flow`

控制项往哪个方向填

<v-click>

| 值 | 行为 |
| --- | --- |
| `row`（默认） | 先填满一行的列，再换下一行 |
| `column` | 先填满一列的行，再换下一列 |
| `dense` | 把后面较小的项回填进前面的空洞 |

</v-click>

<v-click>

```css
.grid {
  grid-auto-flow: column;       /* 按列填 */
  grid-auto-columns: 200px;     /* 隐式列宽 */
}
```

</v-click>

---

# `dense` 会伤无障碍

::: warning 视觉顺序与 DOM 脱节
`dense` 让网格更紧凑无空隙，代价是**屏幕上靠前的项、DOM 里可能靠后**。
:::

<v-click>

键盘 Tab 和屏幕阅读器仍按 DOM 顺序走，于是「看到的顺序」≠「读到的顺序」。

</v-click>

<v-click>

只在**纯装饰性、顺序无意义**的画廊用 `dense`；表单 / 列表 / 排名慎用。

</v-click>

---

# `auto-fill` vs `auto-fit`

塞轨道**算法一样**，差别只在「空轨道怎么处理」

```css
.gallery {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
```

<v-click>

> 这个差别决定最终视觉效果，是 Grid **最常被问**的点——下一页用具体场景说清。

</v-click>

---

# 分水岭：3 个项、能放 5 列

容器宽 1000px、每列最小 200px → 可塞 5 列，现仅有 **3 个项**

<v-click>

| 关键字 | 空轨道 | 视觉 |
| --- | --- | --- |
| `auto-fill` | **保留占位** | 3 项靠左排、右侧留两格空白 |
| `auto-fit` | **塌缩为 0** | 3 项被 `1fr` 拉伸**吃满整行** |

</v-click>

<v-click>

> 项数足以填满所有轨道时，两者**表现完全一致**——差异只在「项数 < 可容纳轨道数」时显现。

</v-click>

---

# 怎么选

<v-click>

- 想让项**保持最大宽、不被拉伸、靠左排，不够一行留白** → `auto-fill`
- 想让**内容总填满整行、列数自适应、无空格** → `auto-fit`

</v-click>

<v-click>

```css
/* 最常见的响应式画廊默认选 auto-fit */
.gallery {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

</v-click>

---

# RAM 模式：零媒体查询响应式

**R**epeat + **A**uto + **M**inmax，Grid 最著名的响应式配方

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
  gap: 16px;
}
```

<v-click>

效果：宽屏多列、窄屏自动减列直到单列，**全程零媒体查询**——现代卡片画廊的事实标准。

</v-click>

---

# RAM 模式逐段拆解

```css
grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
```

<v-click>

| 片段 | 作用 |
| --- | --- |
| `auto-fit` | 列数随容器宽度变化、项填满整行 |
| `minmax(…, 1fr)` | 每列在「下限」与「均分 1 份」间伸缩 |
| `min(100%, 250px)` | 容器**窄于 250px** 时下限降到 100%、单列不溢出 |

</v-click>

<v-click>

这层 `min()` 是 RAM 在窄屏稳健的关键。

</v-click>

---
layout: section
---

# subgrid 子网格

解决「嵌套网格内部对不齐父网格」

---

# 痛点：普通嵌套对不齐

把网格项再设 `display: grid` → 成了**独立**新网格

```css
/* ❌ 普通嵌套：每张卡片内部行高独立 */
.card {
  display: grid;
  grid-template-rows: auto 1fr auto; /* 各算各的，跨卡片对不齐 */
}
```

<v-click>

一排卡片，各自内容长短不一，于是标题底边、按钮顶边**参差不齐**——普通嵌套**不继承**父级轨道 / 间距 / 命名线。

</v-click>

---

# `subgrid` 做什么

在 `grid-template-columns/rows` 上写 `subgrid`，嵌套网格**不再建自己的轨道**

<v-click>

而是**直接采用父网格在该方向的轨道**——于是子网格里的元素，对齐的是**父网格的线**。

</v-click>

<v-click>

::: tip Baseline：放心用
✅ **广泛可用**，自 **2023 年 9 月**起跨浏览器（Chrome/Edge 117、Firefox 71、Safari 16.0，约 88%）。需兼容更老浏览器则渐进降级（退回普通嵌套，仅失对齐、不破版）。
:::

</v-click>

---

# 语法与前提

两步：① 先在父网格里**跨轨道** ② 再 `subgrid` 继承

```css
.item {
  display: grid;
  grid-column: 2 / 7; /* ① 占父网格 5 列 */
  grid-template-columns: subgrid; /* ② 继承这 5 条轨道 */
}
```

<v-click>

- 子网格轨道数 = 它在父网格**跨越的轨道数**
- 子网格内线编号**从 1 重新开始**（组件可复用）
- 可只在**一个方向**用 `subgrid`，另一方向照常自定义

</v-click>

---

# 杀手级场景：卡片对齐

让每张卡片**继承父网格的行轨道**

```css
.cards {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto; /* 标题 / 正文 / 按钮 */
}
.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid; /* 行继承父级 → 跨卡片对齐 */
}
```

<v-click>

所有卡片的标题底边、按钮顶边**严丝合缝**——无需固定高度或 JS 测量。

</v-click>

---

# 命名线传入 + 间距继承

父网格的**命名线**自动传入子网格，可直接用名字放置

```css
.item {
  grid-template-columns: subgrid [sub-a] [sub-b]; /* 还能追加 */
}
```

<v-click>

- 父级 `gap` 默认被子网格**继承**，可单独覆盖
- `row-gap: 0`（小于父级）让子项「回吐」间距空间，类似负 margin

</v-click>

<v-click>

⚠️ `masonry`（瀑布流）是**另一个**特性、仍实验中、**未** Baseline，别混淆。

</v-click>

---
layout: section
---

# 对齐与实战配方

`place-items` 三件套 + 可直接抄走的配方

---

# 一行垂直水平居中

Grid 提供 CSS 里**最短**的「垂直 + 水平居中」写法

```css
.center {
  display: grid;
  place-items: center; /* 两个方向都居中 */
  min-height: 100vh;
}
```

<v-click>

`place-items` = `align-items`（纵向）+ `justify-items`（横向）。

</v-click>

---

# 三组对齐简写

记住这张表即可

<v-click>

| 简写 | 等于 | 作用对象 |
| --- | --- | --- |
| `place-items` | `align-items` + `justify-items` | 容器统一设所有项 |
| `place-content` | `align-content` + `justify-content` | 整个网格在容器内 |
| `place-self` | `align-self` + `justify-self` | 单个项覆盖自身 |

</v-click>

<v-click>

`align-*` 管纵向（块向）、`justify-*` 管横向（行内向）；`*-content` 仅轨道有富余时可见。

</v-click>

---

# 配方一：整页骨架

`grid-template-areas` + `min-height: 100vh`，铺满视口

```css
.app {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
}
```

<v-click>

`main` 行设 `1fr` → 吃掉头脚之外全部高度，把页脚顶到视口底部。

</v-click>

---

# 配方二：圣杯布局

三列 `auto 1fr auto` + 三行 `auto 1fr auto`，主区两向吃满

```css
.holy-grail {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
}
.holy-grail > header,
.holy-grail > footer {
  grid-column: 1 / -1; /* 头脚通栏 */
}
```

<v-click>

`1 / -1` 让头脚无视列数横跨整行；中间三元素按源顺序落入第二行。

</v-click>

---

# 配方三：仪表盘拼图

`span` 让特定卡片跨多格，`dense` 回填空洞

```css
.dashboard {
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 160px;
  grid-auto-flow: row dense; /* 紧凑无空洞 */
}
.dashboard > .chart-main { grid-column: span 2; grid-row: span 2; }
.dashboard > .wide       { grid-column: span 2; }
```

<v-click>

⚠️ `dense` 改变视觉顺序、Tab 仍按 DOM——卡片有阅读逻辑时慎用。

</v-click>

---

# 配方四：媒体对象

左侧头像定宽、右侧文字弹性，一行列定义搞定

```css
.media {
  display: grid;
  grid-template-columns: max-content 1fr; /* 头像按内容、文字吃剩余 */
  gap: 12px;
  align-items: center; /* 垂直居中 */
}
```

<v-click>

`max-content` 让头像列恰好容纳内容宽，`1fr` 让文字吃掉剩余空间。

</v-click>

---

# 选型速记

| 需求 | 配方 |
| --- | --- |
| 自适应列数画廊 | `repeat(auto-fit, minmax(min(100%, N), 1fr))` |
| 整页骨架、响应式重排 | `grid-template-areas` + 媒体查询改图 |
| 通栏元素 | `grid-column: 1 / -1` |
| 不规则拼图无空洞 | `grid-auto-flow: dense`（注意 Tab 序） |
| 一行居中 | `place-items: center` |
| 卡片内部跨行对齐 | `grid-template-rows: subgrid` |

---

# 最佳实践小结

<v-click>

- 等分用 `repeat(N, 1fr)`；**严格等分**防撑破用 `minmax(0, 1fr)`
- 响应式首选 **RAM**：`repeat(auto-fit, minmax(min(100%, 250px), 1fr))`
- `auto-fill` 留空轨道、`auto-fit` 塌缩填满——按需选
- 间距用 `gap`（先于 `fr` 分配），别用 `margin`
- `subgrid` 已 Baseline（2023-09），放心做卡片内部对齐
- `dense` 与 `masonry` 留意无障碍 / 兼容性红线

</v-click>

---
layout: center
class: text-center
---

# 谢谢

先画网格、再填格子——横竖同时受控，二维布局从此优雅

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
