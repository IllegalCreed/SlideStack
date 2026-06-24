---
theme: seriph
background: https://cover.sli.dev
title: CSS Flexbox 弹性布局
info: |
  CSS Flexbox 弹性盒布局 —— 一维布局、主轴 / 交叉轴、对齐、伸缩与实战配方
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:css-3 class="text-8xl" />
</div>

<br/>

## CSS Flexbox 弹性布局

把一组项目沿「一条轴」排开、再灵活分配空间与对齐（基于 CSS 现代标准）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
垂直居中、等高列、自适应导航这些过去要靠 hack 的需求，在 Flexbox 里都成了一两行声明。
-->

---
transition: fade-out
---

# 这一章讲什么

给父元素一行 `display: flex`，子元素就「弹」起来了

<v-click>

- **轴向模型**：主轴 / 交叉轴，`flex-direction` 四方向
- **对齐**：主轴 `justify-content`、交叉轴 `align-items` / `self` / `content`
- **伸缩**：`flex` 三值（grow / shrink / basis）与简写
- **多行**：`flex-wrap`、`order`、`gap`
- **实战配方**：圣杯、等高列、媒体对象、自适应导航

</v-click>

<v-click>

> 半数属性不用背——只要先分清「这是在**主轴**上做，还是在**交叉轴**上做」。

</v-click>

---

# 一维 vs 二维：与 Grid 的分工

<v-click>

- **Flexbox 是一维的**：一次只管一条轴——要么一行，要么一列
- **Grid 是二维的**：同时控制行与列、可跨行跨列
- 两者**互补、不是替代**，常常嵌套配合

</v-click>

<v-click>

| 需求 | 选谁 |
| --- | --- |
| 一行 / 一列内的分布与对齐 | **Flexbox** |
| 整页二维骨架、行列都要对齐 | **Grid** |

</v-click>

---

# `display`：开启弹性容器

```css
.container {
  display: flex; /* 块级容器：自身像 block 独占一行 */
}
.inline-container {
  display: inline-flex; /* 行内容器：像 inline-block 与文字同排 */
}
```

<v-click>

- 唯一区别是**容器自身**在外部如何排版（块级 vs 行内）
- 对**内部弹性项目**的影响完全一致，日常九成用 `display: flex`

</v-click>

---

# 「弹性项目」只算直接子元素

```html
<nav class="bar">      <!-- display: flex -->
  <span>Logo</span>    <!-- ✅ 弹性项目 -->
  <div class="menu">   <!-- ✅ 弹性项目 -->
    <a>文档</a>        <!-- ❌ 孙子，不受影响 -->
  </div>
</nav>
```

<v-click>

- `display: flex` 只把**直接子元素**变成弹性项目
- 想让更深层参与，得在那一层**再开一个 Flex 容器**（可任意嵌套）

</v-click>

---

# 两根轴：主轴与交叉轴

这是整个 Flexbox **最核心**的概念

<v-click>

- **主轴（main axis）**：弹性项目沿它依次排开，方向由 `flex-direction` 决定
- **交叉轴（cross axis）**：始终与主轴**垂直**，用来对齐单行内部、分布多行之间

</v-click>

<v-click>

> 记住这条对应关系：**主轴用 `justify-*`，交叉轴用 `align-*`**——半数属性就不用背了。

</v-click>

---

# `flex-direction`：决定主轴的四方向

```css
flex-direction: row;            /* 横向（默认） */
flex-direction: row-reverse;    /* 横向，顺序颠倒 */
flex-direction: column;         /* 纵向，自上而下 */
flex-direction: column-reverse; /* 纵向，自下而上 */
```

<v-click>

| `flex-direction` | 主轴 | 交叉轴 |
| --- | --- | --- |
| `row`（默认） | 横向 | 纵向 |
| `column` | 纵向 | 横向（**轴互换**） |

</v-click>

---

# 谁管横、谁管纵？取决于方向

```css
.vertical {
  display: flex;
  flex-direction: column;  /* 主轴变纵向 */
  justify-content: center; /* 此时是【垂直】居中整组 */
}
```

<v-click>

同一句 `justify-content: center`：

- `row` 下 → **水平**居中
- `column` 下 → **垂直**居中（因为它永远作用在主轴上，而主轴翻转了）

</v-click>

---

# 起点 / 终点：为什么不说「左右」

Flexbox 刻意用**逻辑方位**，不用 `left` / `right`

<v-click>

- 主轴：**main-start** → **main-end**；交叉轴：**cross-start** → **cross-end**
- 目的是适配**书写模式与文字方向**

</v-click>

<v-click>

| 文字方向 | `row` 起点 | `row` 终点 |
| --- | --- | --- |
| LTR（中英文） | 左 | 右 |
| RTL（阿拉伯语） | 右 | 左 |

`flex-start` 表达「贴起点」而非「贴左」——天生国际化友好。

</v-click>

---

# 容器开启后的默认行为

只写 `display: flex`、其余不加时，隐含这组默认：

```css
/* flex-direction: row;   主轴横向 */
/* flex-wrap: nowrap;     不换行 */
/* align-items: stretch;  交叉轴拉伸 */
```

<v-click>

- 项目排成**单独一行**、从主轴**起点**挨个排
- 主轴上**不主动变大**、空间不够**可收缩**（即 `flex: 0 1 auto`）
- 交叉轴**拉伸**到等高 → 这正是「自动等高列」的来源
- 总宽超容器则**溢出**而非换行（`nowrap`）

</v-click>

<!--
后面学每个属性，其实都是在「改写其中一条默认」而已。
-->

---

# `justify-content`：分配剩余空间

```css
.container {
  display: flex;
  justify-content: center; /* 把整组项目在主轴上居中 */
}
```

<v-click>

它分配的是**剩余的正空间**——一个关键前提：

- 项目若已挤满 / 溢出 → 没有空间可分
- 某项 `flex-grow > 0` 抢光空间 → `justify-content` 也「无空可分」

</v-click>

---

# 定位类取值

```css
justify-content: flex-start; /* 默认：整组贴主轴【起点】 */
justify-content: flex-end;   /* 整组贴主轴【终点】 */
justify-content: center;     /* 整组在主轴上【居中】 */
```

<v-click>

- `flex-start` / `flex-end`：贴主轴起点 / 终点（跟随文字方向）
- 初始值规范上是 `normal`，在 flex 中表现等同 `flex-start`
- 还有 `start` / `end` / `left` / `right`，日常上面三个已足够

</v-click>

---

# 三个 space 值：精确区别

差别只在**两端怎么留空**（3 项、剩 6 份空间为例）：

| 值 | 两端 | 项目间 | 直观（`|`=容器边） |
| --- | --- | --- | --- |
| `space-between` | 0 | 各 3 份 | `\|■···■···■\|` |
| `space-around` | 各半份 | 各 2 份 | `\|·■··■··■·\|` |
| `space-evenly` | 各 1.5 份 | 各 1.5 份 | `\|·■·■·■·\|` |

<v-click>

`between` 两端不留、`around` 两端半份、`evenly` 所有缝隙完全相等。

</v-click>

---

# `gap`：项目之间的固定间距

`justify-content` 分「弹性剩余空间」，`gap` 设「固定最小间距」——常**叠加**：

```css
.toolbar {
  display: flex;
  gap: 12px;                      /* 相邻项目至少 12px，不会被压没 */
  justify-content: space-between; /* 多出来的空间再按两端分配 */
}
```

<v-click>

相比 `margin`：`gap` **只在项目之间**生效、首尾不多边、无外边距合并。

</v-click>

---

# `margin: auto`：把单个项目推开

弹性项目上的 `auto` 外边距能**吃掉该方向所有剩余空间**：

```css
.navbar { display: flex; gap: 16px; }
.navbar .login {
  margin-left: auto; /* 左外边距吃光剩余，把按钮挤到最右 */
}
```

<v-click>

- 「一群靠左 + 一个靠右」的导航，无需拆容器
- 四周都 `auto` → 项目在主轴上居中。这是「按项目」的对齐手段

</v-click>

---

# 三个属性，三种粒度

| 属性 | 写在哪 | 管什么 |
| --- | --- | --- |
| `align-items` | 容器 | **所有项目**的交叉轴对齐 |
| `align-self` | 项目 | **单个项目**，覆盖 `align-items` |
| `align-content` | 容器 | **多行之间**的分布（仅多行） |

<v-click>

前两个管「项目在自己那行里如何对齐」，最后一个管「多行整体如何分布」——别搞混。

</v-click>

---

# `align-items`：所有项目的对齐

```css
align-items: stretch;    /* 默认：交叉轴拉伸填满（等高 / 等宽） */
align-items: flex-start; /* 贴起点（row 时为顶部） */
align-items: flex-end;   /* 贴终点（row 时为底部） */
align-items: center;     /* 交叉轴居中 */
align-items: baseline;   /* 按各项内文字【基线】对齐 */
```

<v-click>

- `stretch` 是「自动等高列」的来源；`baseline` 适合一行里字号不一的元素

</v-click>

---

# `stretch` 等高的前提

```css
.card-row { display: flex; }
.card-row > .card {
  /* ✅ 不写 height → 自动拉伸等高 */
  /* ❌ height: 200px → 固定高度覆盖 stretch，等高失效 */
}
```

<v-click>

::: tip 「为什么卡片不等高？」
十有八九是给卡片设了固定 `height`。想靠默认 `stretch` 等高，项目在交叉轴方向**别写死尺寸**。
:::

</v-click>

---

# `align-self`：单独覆盖某个项目

```css
.container {
  display: flex;
  align-items: flex-start; /* 整组顶部对齐 */
}
.container .avatar {
  align-self: center;      /* 唯独头像在交叉轴居中 */
}
```

<v-click>

- 取值同 `align-items`，外加 `auto`（默认，沿用容器值）
- 这是 Flexbox「整体统一、个别例外」的标准做法

</v-click>

---

# `align-content`：多行之间怎么分布

```css
.gallery {
  display: flex;
  flex-wrap: wrap;             /* 必须先允许换行 */
  height: 400px;              /* 交叉轴上要有富余空间 */
  align-content: space-between;
}
```

<v-click>

- 取值与 `justify-content` 高度对应，只是作用在「行」上、沿交叉轴
- `normal` / `flex-start` / `center` / `space-*` / `stretch`

</v-click>

---

# ⚠️ `align-content` 对单行容器无效

::: warning 最容易踩的坑
容器是 `flex-wrap: nowrap`（默认，单行）时，无论 `align-content` 写什么都**完全没效果**——只有一行，没有「行与行之间」可分布。
:::

<v-click>

- 生效前提：`flex-wrap: wrap` 且确实换出多行、交叉轴有富余
- **单行想调对齐，请用 `align-items`**，而不是 `align-content`

</v-click>

---

# 一锤定音：完美居中

```css
.center-box {
  display: flex;
  justify-content: center; /* 主轴居中 */
  align-items: center;     /* 交叉轴居中 */
  min-height: 100vh;
}
```

<v-click>

无论内容多大、是文字还是图片，这两行都稳——Flexbox 最常被记住的一招。

</v-click>

---

# `flex-grow`：怎么分「多出来」的空间

主轴有**剩余空间**时，按比例系数抢占（不是具体尺寸）：

```css
flex-grow: 0; /* 默认：不抢，保持基础尺寸 */
flex-grow: 1; /* 参与瓜分剩余空间 */
flex-grow: 2; /* 抢占速度是 grow:1 项目的两倍 */
```

<v-click>

- 只有存在剩余空间才生效；都 `1` → **均分剩余**
- 注意：按比例分的是「**剩余空间**」，不是「总宽」

</v-click>

---

# `flex-shrink`：空间不够时谁先缩

项目总尺寸**超过容器**时，按比例收缩：

```css
flex-shrink: 1; /* 默认：可以收缩 */
flex-shrink: 0; /* 不缩，宁可让容器溢出也保持尺寸 */
flex-shrink: 2; /* 收缩速度是 shrink:1 项目的两倍 */
```

<v-click>

- 只有项目溢出时才生效
- `flex-shrink: 0` 常用来锁死「不能被压扁」的图标 / 头像

</v-click>

---

# `flex-basis`：从多大开始算

伸缩**发生之前**的起始尺寸，grow / shrink 都在它上面做加减：

```css
flex-basis: auto;    /* 默认：取 width/height，没设则取内容尺寸 */
flex-basis: 200px;   /* 起始 200px，再按 grow/shrink 调整 */
flex-basis: 0;       /* 起始为 0，完全交给 flex-grow 分配 */
```

<v-click>

- **`auto`**：先按内容 / `width` 占位再分剩余 → 内容多的更宽
- **`0`**：全部从 0 起算 → 完全按 grow 比例分，这才是**真正等分**

</v-click>

---

# ⚠️ 子项不肯缩、把父级撑破

::: warning Flexbox 最常见的「玄学溢出」
弹性项目默认**不会缩到比自身 `min-content` 更小**。项目里有长单词 / 长 URL / `nowrap` 文本时，`min-content` 很大，顶破容器。
:::

```css
.body {
  flex: 1;
  min-width: 0; /* 解除最小尺寸下限，让 flex-shrink 真正生效 */
}
```

<v-click>

纵向布局用 `min-height: 0`。记住这条，省下无数排查时间。

</v-click>

---

# `flex` 简写：一值 / 二值展开规则

记住「**单数字当 grow、单长度当 basis**」：

```css
flex: 2;        /* → 2 1 0   （单数字 → grow，basis 归 0） */
flex: 200px;    /* → 1 1 200px（单长度 → basis） */
flex: 30%;      /* → 1 1 30% */
flex: 2 2;      /* → 2 2 0   （两数字 → grow | shrink） */
flex: 1 30px;   /* → 1 1 30px（数字+长度 → grow | basis） */
```

<v-click>

**强烈推荐用简写**——它会把省略项设成更合理的默认（尤其 basis）。

</v-click>

---

# 四个必背关键字

| 写法 | 等价于 | 含义 |
| --- | --- | --- |
| `flex: initial` | `0 1 auto` | 默认：不伸、可缩、按内容起算 |
| `flex: auto` | `1 1 auto` | 可伸可缩，从内容尺寸起算 |
| `flex: none` | `0 0 auto` | 完全锁死，不伸不缩 |
| `flex: 1` | `1 1 0` | 从 0 起算等比抢空间（**等分列**） |

<v-click>

这四个覆盖了绝大多数真实需求，建议直接背下展开式。

</v-click>

---

# ⚠️ `flex: 1` ≠ `flex: auto`

两者都「可伸可缩」，差别全在 `flex-basis`：

```css
.a { flex: 1; }    /* basis = 0：忽略内容宽，严格等分（各 1/3） */
.b { flex: auto; } /* basis = auto：先占内容宽，再分剩余 */
```

<v-click>

- 做「均匀栅格」→ 用 `flex: 1`
- 做「按内容比例、但都能伸缩」→ 用 `flex: auto`

</v-click>

<v-click>

> 省略 basis（如 `flex: 2`）时，浏览器实际按 `0%` 而非纯 `0` 计算——复杂百分比布局里偶有差异。

</v-click>

---

# `flex-wrap`：让项目换行

默认项目**死守一行**——不够就一起缩、再不够就溢出，但绝不换行：

```css
flex-wrap: nowrap;       /* 默认：全挤一行，可能溢出 */
flex-wrap: wrap;         /* 放不下就另起一行 */
flex-wrap: wrap-reverse; /* 换行，但新行往交叉轴起点堆 */
```

<v-click>

- 一旦换行，**每条「行」都是独立的弹性容器**，各自按主轴排列
- 行与行整体怎么分布 → 交给 `align-content`（仅多行有效）

</v-click>

---

# `flex-flow`：方向 + 换行的简写

```css
.box {
  display: flex;
  flex-flow: row wrap; /* = flex-direction: row; flex-wrap: wrap; */
}
```

<v-click>

- 写法「**方向在前、换行在后**」
- 其他组合：`flex-flow: column nowrap` / `row-reverse wrap-reverse`
- 写多行布局时比分两行更紧凑

</v-click>

---

# `order`：调整视觉排序

整数控制视觉先后，**小的在前**，默认 `0`：

```css
.item--featured { order: -1; } /* 负值：排到默认项之前 */
.item--last     { order: 99; } /* 大值：排到最后 */
```

<v-click>

- 相同 `order` 按 DOM 先后排
- 常用来在不同断点不改 HTML 地重排卡片

</v-click>

---

# ⚠️ `order` / `*-reverse` 的无障碍代价

::: warning 只改视觉、不改 DOM
`order` 与 `flex-direction: *-reverse` 都**只改变视觉顺序**：屏幕阅读器仍按 DOM 朗读、Tab 焦点仍按 DOM 跳转。
:::

<v-click>

- 结果：「看到的顺序」与「读到 / 跳到的顺序」脱节
- **别用它修补本该在 HTML 结构里解决的顺序问题**
- 只在「视觉重排不影响阅读逻辑」时用，并用键盘实测 Tab 路径

</v-click>

---

# `gap`：现代间距方案的三个好处

```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;       /* 行 + 列都 16px */
  gap: 12px 20px;  /* 也可分写：行 12px、列 20px */
}
```

<v-click>

- **只在项目之间**生效，容器首尾不多边
- 不存在相邻 `margin` **合并**问题
- 换行后**行与行之间**也自动留 `row-gap`，卡片墙不用手补

</v-click>

---

# 配方一：圣杯 + 粘性页脚

「页头 + 自适应主区 + 永远沉底的页脚」：

```css
body {
  min-height: 100vh;     /* 至少占满一屏，才有空间可分 */
  display: flex;
  flex-direction: column; /* 主轴变纵向，三块自上而下 */
}
main { flex: 1; }        /* 吃掉页头页脚之外的全部高度 */
```

<v-click>

只要 `main` 写了 `flex: 1`，内容再短 `footer` 都贴在视口底部。

</v-click>

---

# 配方二：三栏圣杯（固定侧栏 + 自适应中栏）

```css
.holy-grail { display: flex; gap: 16px; }
.holy-grail .side {
  flex: 0 0 200px; /* 锁死 200px：不伸不缩 */
}
.holy-grail .content {
  flex: 1;         /* 抢占中间剩余空间 */
  min-width: 0;    /* 防内部长内容把中栏顶宽 */
}
```

<v-click>

两侧 `flex: 0 0 200px` 固定，中栏 `flex: 1` 弹性，别忘补 `min-width: 0`。

</v-click>

---

# 配方三：等高列

Flexbox **默认就送**的能力（`align-items` 初始即 `stretch`）：

```css
.card-row {
  display: flex;
  gap: 16px;
  /* align-items: stretch; —— 默认值，无需写 */
}
.card-row > .card { flex: 1; } /* 顺便等宽均分 */
```

<v-click>

几乎什么都不用做列就等高。唯一禁忌：**别给卡片设固定 `height`**。

</v-click>

---

# 配方四：自适应导航栏

「左 Logo + 一组链接 + 右登录按钮」，垂直居中、登录靠右：

```css
.navbar {
  display: flex;
  align-items: center; /* 所有项目垂直居中 */
  gap: 20px;
}
.navbar .login {
  margin-left: auto;   /* 左外边距吃光剩余，按钮推到最右 */
}
```

<v-click>

核心两招：`align-items: center` 解决垂直对齐 + `margin-left: auto` 解决「左群 + 右单」。

</v-click>

---

# 配方五：媒体对象（头像 + 文字）

评论 / 通知 / 聊天气泡的「左图右文」——图不被压扁、文吃剩余宽：

```css
.media { display: flex; gap: 12px; align-items: flex-start; }
.media__avatar {
  flex: none;   /* = 0 0 auto：头像绝不被压扁 */
}
.media__body {
  flex: 1;      /* 吃掉剩余宽度 */
  min-width: 0; /* 关键：长单词 / URL 才正常换行 */
}
```

<v-click>

这三行把全章避坑点都用上了：`flex: none` 锁死 + `flex: 1` 自适应 + `min-width: 0` 防溢出。

</v-click>

---

# 一维到此为止：何时换 Grid

这些模式都是**一维**的——靠换行凑多行，但**行与行的列并不会对齐**（每行独立计算）

<v-click>

- 一旦需求变成「严格二维网格：行列都对齐、要跨行跨列」→ 该用 **Grid**
- Flexbox 与 Grid **互补**：一行 / 一列内用 Flexbox，整页二维骨架用 Grid，常嵌套配合

</v-click>

---

# 三大避坑速查

| 现象 | 根因 | 解法 |
| --- | --- | --- |
| 长文本 / URL 顶破容器 | 默认不缩小于 `min-content` | 给该项 `min-width: 0` |
| 图标 / 头像被压扁 | 默认 `flex-shrink: 1` | 给它 `flex: none` |
| 卡片不等高 | 设了固定 `height` 覆盖 `stretch` | 去掉固定高度 |
| `align-content` 没反应 | 容器是单行 `nowrap` | 改 `flex-wrap: wrap` |

---

# 最佳实践小结

<v-click>

- 先分清**主轴 / 交叉轴**——「主轴用 `justify-*`、交叉轴用 `align-*`」
- 居中一招：`justify-content: center` + `align-items: center`
- 等分列 `flex: 1`、锁死尺寸 `flex: none`、防溢出 `min-width: 0`
- 间距一律用 `gap`，单项推开用 `margin: auto`，等高靠默认 `stretch`
- 无障碍红线：`order` / `*-reverse` 只改视觉、慎用且必测键盘

</v-click>

---
layout: center
class: text-center
---

# 谢谢

分清两根轴、记牢 `flex: 1` / `none` / `min-width: 0`，日常布局就稳了

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
