---
theme: seriph
background: https://cover.sli.dev
title: CSS 文字排版与字体
info: |
  CSS 文字排版与字体 —— 字体族、@font-face、可变字体、加载性能、行距折行、列表计数器
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:css-3 class="text-8xl" />
</div>

<br/>

## CSS 文字排版与字体

从「装字体」到「调每一行」的完整链路（基于 CSS 现代标准）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
排版是「内容优先」的工程：字体要装对、加载要快且不抖动、每一行要排得专业。
-->

---
transition: fade-out
---

# 这一章讲什么

一条主线：装字体 → 让它快又稳地显示 → 调好每一行

<v-click>

- **装字体**：通用族 / 系统栈、`@font-face`、可变字体
- **显示策略**：`font-display`、`preload`、压 CLS
- **排每一行**：行距字距、对齐、折行截断
- **标记与编号**：`list-style`、`::marker`、计数器

</v-click>

<v-click>

> 配错的代价多是**隐性**的——乱码、抖动、撑破容器、孤行，且大多**不报错**。

</v-click>

---
layout: section
---

# 字体族与 `@font-face`

文字的第一步：选对字体、装进页面

---

# `font-family` 是优先级列表

```css
font-family: "Inter", system-ui, sans-serif;
```

<v-click>

浏览器对**每个字符**独立地从左往右找第一款「已装且含该字形」的字体，缺字才往后退。

</v-click>

<v-click>

所以列表末尾**必须**有一个通用字体族兜底——它由操作系统映射到一款真实字体，保证总有字可显示。

</v-click>

---

# 通用字体族

| 通用族 | 含义 |
| --- | --- |
| `serif` / `sans-serif` | 衬线 / 无衬线 |
| `monospace` | 等宽（代码） |
| `cursive` / `fantasy` | 手写 / 装饰 |
| `system-ui` | 当前系统**默认 UI 字体** |
| `ui-serif` / `ui-sans-serif` / `ui-monospace` / `ui-rounded` | 系统原生各类 UI 字体 |

<v-click>

`system-ui` 让你零下载拿到「和操作系统一致」的字体观感。

</v-click>

---

# 系统字体栈：零下载、零 CLS

```css
font-family:
  system-ui,
  -apple-system,      /* 旧版 Safari */
  "Segoe UI",         /* Windows */
  Roboto,             /* Android / ChromeOS */
  sans-serif;         /* 兜底通用族 */
```

<v-click>

- 最简洁写法就是 `system-ui`，上面是兼容老浏览器的展开版
- GitHub、Bootstrap 5 都用类似栈
- 代价是「各平台字体不同」，换来零网络开销与原生手感

</v-click>

---

# `@font-face`：把字体装进页面

```css
@font-face {
  font-family: "MyBrand";  /* 自定义名字（必填） */
  src: url("/fonts/mybrand.woff2") format("woff2"); /* 来源必填 */
  font-weight: 400;
  font-display: swap;
}
```

<v-click>

- 它是一条**声明规则**，必须写在样式表顶层，**不能**嵌进选择器
- 之后在 `font-family` 里就能像系统字体一样用这个名字

</v-click>

---

# `src` 与回退链

```css
@font-face {
  font-family: "MyHelvetica";
  src:
    local("Helvetica Neue"),                     /* 本机有就直接用 */
    url("/fonts/helvetica.woff2") format("woff2"); /* 否则下载 */
}
```

<v-click>

- `local("名")`：先找本机已装的同名字体，命中就不下载
- `url(...) format(...)`：从服务器下载，`format()` 让浏览器跳过不支持的格式

</v-click>

---

# 2026 只发 WOFF2

```css
src: url("/fonts/Inter.woff2") format("woff2"); /* 一种格式足矣 */
```

<v-click>

- WOFF2 压缩率比 WOFF 高约 30%，现代浏览器全面支持
- 不必再写 `truetype` / `woff` 老格式回退链——CSS 更干净、下载更小

</v-click>

<v-click>

::: warning 跨域 CORS
字体放在不同域名，服务端必须配 `Access-Control-Allow-Origin`，否则浏览器拒绝加载——这也是 preload 字体必须带 `crossorigin` 的原因。
:::

</v-click>

---

# `font-weight` 与字重

```css
.normal { font-weight: 400; } /* = normal */
.bold   { font-weight: 700; } /* = bold */
.custom { font-weight: 550; } /* 仅可变字体有效 */
```

<v-click>

- 关键字 `normal`（400）/ `bold`（700）；相对值 `lighter` / `bolder`
- 数值 100–900：非可变字体只认 100 的整数倍
- **可变字体**可取任意连续值（如 `550`）

</v-click>

---

# `font-synthesis`：别让浏览器「假装」

```css
body {
  font-synthesis: none; /* 关掉合成的粗体/斜体/小型大写 */
}
```

<v-click>

若某字重/斜体的字形文件不存在，浏览器会**机械地把常规字形加粗或倾斜**（合成），效果往往很糟。

</v-click>

<v-click>

`font-synthesis: none` 强制只用真实字形——宁可不显示这个样式，也别要难看的伪粗体。

</v-click>

---

# 可变字体：一个文件覆盖所有变化

传统字体每个字重/字宽/斜体都是**独立文件**（Regular、Bold、Light…）。

<v-click>

可变字体把这些变化压进**一个文件**，并允许在各「轴」上取**连续值**：

- 省下多次请求
- 解锁「550 这种中间字重」之类精细排版
- 已是 **Baseline 广泛可用**

</v-click>

---

# 五个注册轴 + 对应标准属性

| 轴 | 标签 | 标准 CSS 属性 |
| --- | --- | --- |
| 字重 Weight | `wght` | `font-weight` |
| 字宽 Width | `wdth` | `font-stretch` / `font-width` |
| 斜角 Slant | `slnt` | `font-style: oblique <角度>` |
| 斜体 Italic | `ital` | `font-style: italic` |
| 光学尺寸 Optical | `opsz` | `font-optical-sizing` |

<v-click>

注册轴用**小写** 4 字母标签；**应优先用对应的标准属性**。

</v-click>

---

# 在 `@font-face` 里声明范围

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter.var.woff2") format("woff2");
  font-weight: 100 900;          /* 支持 100～900 全部字重 */
  font-stretch: 75% 125%;        /* 支持 75%～125% 字宽 */
  font-style: oblique 0deg 10deg; /* 支持 0～10 度倾斜 */
}
```

<v-click>

可变字体用**范围**告诉浏览器它支持的轴区间。

</v-click>

---

# `font-variation-settings`：底层兜底

```css
.fancy {
  font-variation-settings:
    "wght" 550,   /* 注册轴小写 */
    "GRAD" 88;    /* 自定义轴大写 */
}
```

<v-click>

- 标准属性覆盖不到的轴（尤其**自定义轴**），才用它
- 自定义轴（如 `GRAD` 字阶、`SOFT` 圆润度）用**大写**标签，只能经它设置

</v-click>

---

# 为什么优先用标准属性

<v-click>

- **必须一次写全**：改一个轴要把所有轴重声明，否则没写的被重置为默认值
- **动画/继承不如标准属性平滑**：级联行为不如 `font-weight` 自然

</v-click>

<v-click>

能用 `font-weight: 550` 就别写 `font-variation-settings: "wght" 550`。需动态调多轴时，用 CSS 变量缓冲「必须写全」的痛点。

</v-click>

---
layout: section
---

# 字体加载与性能

让字体**快**且**不抖动**地显示

---

# 加载的两段时间线

字体还没下载完时，浏览器经历两个阶段：

<v-click>

1. **block period（阻塞期）**：字体没就绪 → 文字**不可见** = **FOIT**（Flash of Invisible Text）
2. **swap period（交换期）**：先用**回退字体**显示；字体到了再换 = **FOUT**（Flash of Unstyled Text）

</v-click>

<v-click>

`font-display` 决定这两段各持续多久——看到的是「白字」还是「字体跳变」。

</v-click>

---

# `font-display` 五个取值

| 值 | 阻塞期 | 交换期 | 效果 |
| --- | --- | --- | --- |
| `auto` | 浏览器定 | 浏览器定 | 通常≈`block` |
| `block` | 约 3s 白字 | 无限 | 先白字（FOIT） |
| `swap` | 0ms | 无限 | 立刻回退（FOUT） |
| `fallback` | 约 100ms | 约 3s | 极短白字→回退 |
| `optional` | 约 100ms | 无 | 不到就这次不换 |

---

# `font-display` 怎么选

<v-click>

- **`swap`**：内容站点稳妥默认。用户立刻能读，代价是到位时跳变一下，配 preload 窗口很短
- **`optional`**：最友好 Core Web Vitals。100ms 内没到就用回退且**不再换** → 几乎零 CLS
- **`block`**：只用在「错字体比没字体更糟」（如图标字体，回退会显示一堆豆腐块）

</v-click>

<v-click>

普通文字别用 `block`——FOIT 白屏伤体验。

</v-click>

---

# 预加载关键字体

```html
<link rel="preload" href="/fonts/Inter.var.woff2"
  as="font" type="font/woff2" crossorigin />
```

<v-click>

字体在 CSS 里被引用 → 要先下载解析 CSS、再发现字体、再下载。`preload` 让下载**提前到解析 HTML 时**就开始，缩短 FOUT/FOIT。

</v-click>

---

# preload 的两个坑

<v-click>

1. **`crossorigin` 不能漏**：字体请求一律是 CORS 匿名模式，不带会被当成另一个请求 → **下载两次**
2. **别滥用**：`preload` 是「插队」，预加载太多会挤占首屏关键资源带宽

</v-click>

<v-click>

只预加载**首屏真正用到**的 1～2 款字重。

</v-click>

---

# 第三方字体源先 preconnect

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

<v-click>

- 用第三方字体（如 Google Fonts）时，提前完成 DNS + TLS 握手
- 注意取字体文件的 `gstatic.com` 这条要带 `crossorigin`

</v-click>

---

# 用度量覆盖压低 CLS

```css
@font-face {
  font-family: "Inter-fallback";
  src: local("Arial");
  size-adjust: 107%;       /* 整体缩放，对齐 x-height/字宽 */
  ascent-override: 90%;    /* 上升部高度 */
  descent-override: 22%;   /* 下降部高度 */
  line-gap-override: 0%;   /* 行间隙 */
}
```

<v-click>

把回退字体「调整成」和 Web 字体占一样的空间，交换近乎无感。

</v-click>

---

# 度量覆盖四描述符

| 描述符 | 作用 |
| --- | --- |
| `size-adjust` | 整体缩放，对齐 x-height 与字宽 |
| `ascent-override` | 覆盖上升部（基线以上） |
| `descent-override` | 覆盖下降部（基线以下） |
| `line-gap-override` | 覆盖行间隙 |

<v-click>

工具（Fontaine、Next.js 字体优化）会自动算出这组百分比；目标是让回退字体与 Web 字体占**尽量一致的盒子**。

</v-click>

---

# `unicode-range` 子集化

```css
@font-face {
  font-family: "Noto";
  src: url("/fonts/noto-cjk.woff2") format("woff2");
  unicode-range: U+4E00-9FFF; /* 仅页面出现 CJK 才下载本片 */
}
```

<v-click>

- 把大字体（尤其含 CJK 的）按码位拆成多片，浏览器**只下载实际用到的片**
- 中文字体动辄数 MB，子集化几乎是必做优化

</v-click>

---
layout: section
---

# 行距 · 字距 · 对齐与装饰

调「正常排开」的每一行

---

# `line-height`：务必用无单位数

```css
body {
  line-height: 1.5; /* ✅ 当前字号的 1.5 倍 */
}
```

<v-click>

- **无单位数**继承的是「比例」——每个后代按**自己**字号去乘，行距永远合理
- **带单位的值**（`24px`/`150%`/`1.5em`）继承的是**算出来的固定长度**——被钉死

</v-click>

---

# 经典坑：带单位 line-height

```css
body  { font-size: 16px; line-height: 24px; } /* 固定 24px */
h1    { font-size: 40px; }  /* 行高仍是继承来的 24px！ */
/* 结果：行高 < 字号，多行标题上下挤压、字叠在一起 */
```

<v-click>

改成 `line-height: 1.5`，`h1` 行高自动变成 `40 × 1.5 = 60px`，问题消失。

经验值：正文 `1.4`～`1.7`，大标题可收到 `1.1`～`1.3`。

</v-click>

---

# `letter-spacing` 与 `word-spacing`

```css
h1     { letter-spacing: -0.02em; } /* 大字号收紧更精神 */
.badge { letter-spacing: 0.08em; text-transform: uppercase; }
```

<v-click>

- `letter-spacing`：字符间距，正值放宽负值收紧；用 `em`（随字号缩放）比 `px` 稳健
- `word-spacing`：词间距（加在空格上），**中文几乎无用**（中文词间无空格）

</v-click>

---

# `text-align`：水平对齐

| 值 | 含义 |
| --- | --- |
| `start` / `end` | 随书写方向——**优于** `left`/`right`，天然支持 RTL |
| `left` / `right` | 物理左/右对齐 |
| `center` | 居中 |
| `justify` | 两端对齐：拉伸词间距让每行顶满两边 |

<v-click>

优先用 `start` / `end` 而非物理方向，多语言场景自动正确。

</v-click>

---

# `justify` 在西文里要配连字符

```css
.article {
  text-align: justify;
  hyphens: auto; /* 允许单词断开，空隙才均匀 */
}
```

<v-click>

- 西文 `justify` 靠拉伸**空格**对齐，长单词会撑出难看的「空隙河流」
- 配 `hyphens: auto` 让单词可断，空隙均匀
- **中文**每字等宽、无词间空格，两端对齐**天然平整**，不需连字符

</v-click>

---

# `text-indent`：首行缩进

```css
p {
  text-indent: 2em; /* 中文段首空两字 */
}
```

<v-click>

- 只缩进**首行**，`2em` 恰好是两个汉字宽
- 取**负值**可做「悬挂缩进」（首行突出、其余缩进）

</v-click>

---

# `text-decoration`：精修下划线

```css
a.fancy {
  text-decoration-line: underline;
  text-decoration-thickness: 2px; /* 线更粗 */
  text-underline-offset: 3px;     /* 离文字远一点，不压字母下沿 */
  text-decoration-color: currentColor;
}
```

<v-click>

简写 = 线型（`underline`/`line-through`）+ 样式（`wavy`/`dotted`）+ 颜色 + 粗细。`wavy` + 红色就是编辑器「拼写错误红波浪线」。

</v-click>

---

# `text-transform`：只改显示

```css
.title { text-transform: uppercase; }  /* 全大写 */
.name  { text-transform: capitalize; } /* 每词首字母大写 */
```

<v-click>

::: tip 只影响渲染，不改源文本
DOM 里、复制出来、屏幕阅读器读到的仍是**原始大小写**。所以「全大写」用它做（而非把源码写成大写），既保留语义又便于改样式。
:::

</v-click>

---
layout: section
---

# 截断 · 折行 · 断词

处理「排不下」时怎么办

---

# `white-space`：空白与折行总开关

| 值 | 合并空白 | 保留换行 | 自动折行 |
| --- | --- | --- | --- |
| `normal`（默认） | 是 | 否 | 是 |
| `nowrap` | 是 | 否 | **否** |
| `pre` | **否** | **是** | 否 |
| `pre-wrap` | **否** | **是** | 是 |
| `pre-line` | 是 | **是** | 是 |

<v-click>

`pre-wrap` 是聊天气泡、用户输入回显常用值：尊重用户敲的换行与空格，又不横向溢出。

</v-click>

---

# 单行省略号（三件套）

```css
.truncate {
  white-space: nowrap;     /* ① 不折行 */
  overflow: hidden;        /* ② 溢出隐藏 */
  text-overflow: ellipsis; /* ③ 末尾显示 … */
}
```

<v-click>

三者**缺一不可**：`text-overflow: ellipsis` 本身不触发截断，只决定「被裁掉时末尾画什么」，且只在「不折行 + 溢出隐藏」前提下才显示。

</v-click>

---

# 多行省略号（行数夹断）

```css
.clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* 最多 3 行，其余 … */
  line-clamp: 3;         /* 标准属性，逐步落地 */
  overflow: hidden;
}
```

<v-click>

目前主要靠 `-webkit-line-clamp`（带前缀但跨浏览器支持良好），标准 `line-clamp` 写上以备前向兼容。

</v-click>

---

# 长串怎么断

默认浏览器只在「合法折点」（空格、连字符）换行。一个**超长无空格的串**（长 URL、哈希）放不下时**直接溢出容器**。

```css
.content   { overflow-wrap: break-word; } /* 放不下才断词（首选） */
.aggressive { word-break: break-all; }    /* 任意字符可断（激进） */
```

<v-click>

防「长 URL 撑破布局」，记 `overflow-wrap: break-word` 即可。

</v-click>

---

# break-word vs break-all vs keep-all

<v-click>

- **`overflow-wrap: break-word`**（首选）：仅当一个词单独成行都放不下时才断它，正常文字仍按词折行
- **`word-break: break-all`**（激进）：每个字符都是潜在折点，西文被切得支离破碎，多用于展示哈希
- **`word-break: keep-all`**：让 CJK **不在字与字之间**断行

</v-click>

---

# `hyphens`：自动连字符

```css
.article { hyphens: auto; }
```

| 值 | 含义 |
| --- | --- |
| `none` | 从不加连字符 |
| `manual`（默认） | 仅在源码 `&shy;` 或连字符处断 |
| `auto` | 按语言规则自动断词加连字符 |

<v-click>

`auto` **依赖正确的 `<html lang>`**（各语言断词规则不同），对中文无意义。

</v-click>

---

# `text-wrap: balance`（标题均衡）

```css
h1, h2, .card__title, blockquote {
  text-wrap: balance;
}
```

<v-click>

- 让多行文本**每行字数尽量均衡**，避免「最后一行只剩一两个字」
- 适合**标题、副标题、引用、图说**这类短文本块
- **Baseline 2024**；只对少行生效（Chromium ≤6 行），所以性能开销可忽略

</v-click>

---

# `text-wrap: pretty`（正文消孤行）

```css
p, li {
  text-wrap: pretty;
}
```

<v-click>

- 折行结果与普通 `wrap` 类似，但用**更慢更讲究的算法**消除「末行只剩一个词（孤行）」
- 适合**正文长段落**；算法比 `balance` 重，别给所有文字无脑加
- **Baseline 2024 新近可用**，各家实现深浅不一，当渐进增强用

</v-click>

---

# 经验法则：balance 给标题、pretty 给正文

<v-click>

- **短文本（标题/图说/引用）→ `balance`**：每行字数均衡
- **长文本（正文段落）→ `pretty`**：消除末行孤字

</v-click>

<v-click>

两者都是**纯渐进增强**——不支持的浏览器自动退回普通折行，加了只赚不亏。

</v-click>

---
layout: section
---

# 列表样式与 `::marker`

文字前面的「标记盒」

---

# `list-style-type`：标记符号

| 类别 | 常用值 |
| --- | --- |
| 无序 | `disc` / `circle` / `square` / `none` |
| 有序 | `decimal` / `lower-alpha` / `upper-roman` |
| 中文 | `cjk-decimal`（一,二,三）/ `trad-chinese-formal` |
| 字符串 | 直接给字符串，如 `"→ "` |

```css
.checklist { list-style-type: "✅ "; } /* 字符串当标记 */
```

---

# 位置与简写

```css
li        { list-style-position: outside; } /* 默认：标记悬左外侧 */
.inside   { list-style-position: inside; }  /* 标记并入内容 */
ul        { list-style: square inside; }    /* type + position */
```

<v-click>

- `outside`（默认）：标记在内容盒**外**，多行文字左对齐、标记悬挂
- `inside`：标记算进内容**内**，折行后续行顶到标记下方
- `list-style` 简写可任意顺序写 `type` / `position` / `image`

</v-click>

---

# `::marker`：直接样式化标记

```css
ul li::marker { color: #e11d48; font-size: 1.3em; } /* 圆点上色放大 */
ol li::marker { color: #2563eb; font-weight: 700; } /* 编号加粗变色 */
```

<v-click>

- 直接选中「标记盒」（圆点/编号本身）来设样式，**Baseline 广泛可用**
- 任何 `display: list-item` 的元素都有标记盒——`<li>` 与 `<summary>`（`<details>` 标题三角）都能用

</v-click>

---

# 用 `content` 换标记内容

```css
li::marker { content: "👉 "; }              /* 圆点换箭头 */
details summary::marker      { content: "▶ "; }
details[open] summary::marker { content: "▼ "; } /* 按开合换图标 */
```

<v-click>

`::marker` 上的 `content` 能直接替换标记显示的字符，连 `<details>` 的展开三角都能换。

</v-click>

---

# `::marker` 只接受有限属性

<v-click>

- ✅ 可用：`color`、所有 `font-*`、`content`、`white-space`、`animation`/`transition`、`direction`、`counter-*`
- ❌ 无效：`background`、`width` / `height` / `margin` / `padding` / `border` 等盒模型属性

</v-click>

<v-click>

::: warning 要盒模型效果就退回 `::before`
想给标记加**背景色/边框**，得放弃 `::marker`，改用 `list-style: none` + `::before` 自己画（`::before` 是普通伪元素，不受此限制）。
:::

</v-click>

---

# 去标记的可访问性

```html
<ul role="list" style="list-style: none">
  <li>导航项 1</li>
  <li>导航项 2</li>
</ul>
```

<v-click>

- `list-style: none` 是导航/卡片列表常规操作
- 但在 **Safari + VoiceOver** 下，去标记可能让屏幕阅读器**不再当列表朗读**（丢失「共 N 项」）
- 承载信息的列表显式补 `role="list"`

</v-click>

---
layout: section
---

# 计数器与生成内容

自动编号：1.1 / 1.2.3、给标题编号

---

# 计数器三步走

```css
body      { counter-reset: section; }      /* ① 建并归零 */
h2        { counter-increment: section; }  /* ② 每次出现 +1 */
h2::before { content: "第 " counter(section) " 章　"; } /* ③ 显示 */
```

<v-click>

三步缺一不可：`counter-reset` 定「在哪个范围内从几开始」，`counter-increment` 定「每次 +几」，`counter()` 在 `content` 里取值显示。

</v-click>

---

# 三个属性

```css
counter-reset: section 3;        /* 新建并置初值 3 */
counter-reset: reversed(section); /* 倒数计数器 */
counter-increment: section -1;   /* 步长 -1（配合倒数） */
counter-set: section 20;         /* 更新已存在的计数器 */
```

<v-click>

- `counter-reset` 总是**开一个新计数器**（新作用域）
- `counter-set` **更新当前作用域已有**的——需「中途跳号」而不重置层级时用它

</v-click>

---

# `counter()` vs `counters()`

```css
content: counter(section);              /* 1, 2, 3… */
content: counter(section, upper-roman); /* I, II, III…（带样式） */
content: counters(item, ".") " ";       /* 1.1、2.3.1 整条链 */
```

<v-click>

- **`counter(名)`** 取**最内层**那一个值——适合单层编号（章号、图号）
- **`counters(名, 分隔符)`** 取**整条嵌套链**——多级编号（目录、1.2.3）一定用它（带 s）

</v-click>

---

# 给标题自动编号（实战）

```css
body { counter-reset: h2; }
h2 {
  counter-reset: h3;          /* 进入新章，重置子节 */
  counter-increment: h2;
}
h2::before { content: counter(h2) "　"; }
h3::before { content: counter(h2) "." counter(h3) "　"; } /* 1.1 */
```

<v-click>

诀窍：在 `h2` 上 `counter-reset: h3`——每开新章就把子节清零，于是每章子节都从 `.1` 重新开始。

</v-click>

---

# `@counter-style`：自定义编号系统

```css
@counter-style circled {
  system: fixed;                  /* 固定符号表 */
  symbols: "①" "②" "③" "④" "⑤";
  suffix: " ";
}
ol { list-style-type: circled; }
```

<v-click>

`system` 常见取值：`cyclic`（循环）/ `fixed`（用完即止）/ `numeric`（进制）/ `additive`（加法式，如罗马数字）。已是 Baseline 可用。

</v-click>

---

# 计数器注意事项

<v-click>

- 只对**生成盒子**的元素生效：`display: none` 不计数（`visibility: hidden` 仍计数）
- 名不能是 `none` / `inherit` / `initial`
- 作用域随 DOM**嵌套继承**，同名内层遮蔽外层
- `content` 生成的是**装饰性**内容，部分屏幕阅读器忽略——**别**把关键信息只放伪元素里

</v-click>

---

# Baseline 状态速记（2026-06）

| 特性 | 状态 |
| --- | --- |
| 可变字体 / `font-display` / `size-adjust` 系列 | ✅ 广泛可用 |
| `::marker`（`color`/`font-*`/`content`） | ✅ 广泛可用 |
| `@counter-style` | ✅ 广泛可用 |
| `text-wrap: balance` | ✅ Baseline 2024 |
| `text-wrap: pretty` | 🟡 2024 新近可用 |
| `line-clamp`（无前缀） | 🟡 逐步落地，用 `-webkit-` 兜底 |

---

# 全章小结

<v-click>

- **装字体**：`font-family` 带通用族兜底；`@font-face` 只发 WOFF2；可变字体优先标准属性
- **加载**：默认 `swap`、零 CLS 用 `optional`；`preload` 带 `crossorigin`；度量覆盖压 CLS
- **排版**：`line-height` 无单位；`text-align: start/end`；`justify` 配 `hyphens`
- **折行**：防溢出首选 `overflow-wrap: break-word`；`balance` 给标题、`pretty` 给正文
- **标记/编号**：`::marker` 有限属性；计数器三步、多级用 `counters()`

</v-click>

---
layout: center
class: text-center
---

# 谢谢

把字体装对、加载调稳、每一行排好，文字才真正「专业一档」

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
