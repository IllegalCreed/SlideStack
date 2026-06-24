---
theme: seriph
background: https://cover.sli.dev
title: CSS 选择器与层叠
info: |
  CSS 选择器全谱 + 层叠算法 —— 特异性、@layer、!important、继承
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:css-3 class="text-8xl" />
</div>

<br/>

## CSS 选择器与层叠

写下一条规则，浏览器要回答：「打中谁」与「听谁的」（基于 CSS 现代标准）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
布局、动画、主题切换，都建立在「选择器命中」和「层叠决胜」这两件事之上。
-->

---
transition: fade-out
---

# 这一章讲什么

CSS 的两大引擎：**选择器**负责命中，**层叠**负责决胜

<v-click>

- **选择器全谱**：基础 / 属性 / 组合器 / 伪类伪元素
- **特异性**：`ID-CLASS-TYPE` 三列逐列比
- **级联四步**：来源 → 层叠层 → 特异性 → 书写顺序
- **现代利器**：`:has()`、`:where()`、`@layer`

</v-click>

<v-click>

> CSS **不报错**：选择器没命中、值非法，浏览器都静默忽略——调样式只能靠 DevTools 看谁被划掉。

</v-click>

---

# 从一条规则说起

```css
a.button {            /* 选择器：打中谁 */
  color: white;       /* 声明：属性 color，值 white */
  background: navy;
}
```

- **选择器**回答「命中哪些元素」
- **声明块**里每条 `属性: 值;` 回答「怎么改」
- 一页常有上千条规则，同一元素被多条命中
- 于是有两问：怎么命中、冲突听谁的

---
layout: section
---

# 第一部分

选择器全谱：怎么命中

---

# 三种基础选择器

按精度递增：

```css
p {
}             /* 类型：所有 <p> */
.note {
}             /* 类：class 含 note 的元素 */
#sidebar {
}             /* ID：id="sidebar" 的那一个 */
```

- 类是复用主力；ID 一个文档内应唯一
- 通用选择器 `*` 匹配任意元素，特异性 `0-0-0`

---

# 复合（与）vs 列表（或）

长得像、含义相反，最易混：

```css
a.button {
}                        /* 复合·无空格＝与：同一元素同时满足 */
h1, h2, .title {
}                        /* 列表·逗号＝或：任一命中即套用 */
```

- 复合：类型选择器若出现必须写最前（`a.button` ✅）
- 列表传统**不容错**：一处非法整条作废
- 容错要靠 `:is()` / `:where()` 包裹

---

# 属性选择器（上）：存在与全等

用 `[ ]` 按属性及其值匹配：

```css
[disabled] {
}                       /* 存在即匹配，不看值 */
[type="email"] {
}                       /* 值完全等于 */
```

- 表单、链接、国际化场景的利器
- 属性选择器特异性算 CLASS 列（`0-1-0`）
- 注意：`[id="x"]` 是属性选择器，远弱于 `#x`

---

# 属性选择器（下）：子串与词匹配

| 写法 | 含义 |
| --- | --- |
| `[a~="v"]` | 空格词表里含 `v` 这个词 |
| <code v-pre>[a\|="v"]</code> | 等于 `v` 或以 `v-` 开头（语言子标签） |
| `[a^="v"]` | 以 `v` 开头（前缀） |
| `[a$="v"]` | 以 `v` 结尾（后缀） |
| `[a*="v"]` | 含子串 `v` |

<v-click>

大小写标记写在 `]` 前：`[src$=".png" i]` 忽略大小写、`[…  s]` 强制区分。

</v-click>

---

# 属性选择器实战

```css
a[href^="https"]::after {
  content: " ↗";        /* 外链加图标 */
}
a[href$=".pdf"] {
  font-weight: 600;     /* PDF 链接加粗 */
}
[class*="btn-"] {
  cursor: pointer;      /* 工具类前缀批量命中 */
}
```

前缀 / 后缀 / 子串三件套，覆盖绝大多数「按值挑元素」需求。

---

# 四个组合器

表达元素间的**结构关系**：

```css
article a {
}             /* 后代（空格）：任意层级 */
.menu > li {
}             /* 子 >：仅直接子元素 */
h2 + p {
}             /* 相邻兄弟 +：紧邻的下一个 */
h2 ~ p {
}             /* 后续兄弟 ~：之后所有同级 */
```

组合器本身不加特异性；只能向「下 / 后」匹配。

---

# 组合器：经典「猫头鹰」

```css
.stack > * + * {
  margin-top: 1rem;
}
```

<v-click>

- 每个直接子元素，只要**前面还有兄弟**，就加间距
- 等价于「除第一个外，所有子元素加上边距」
- 优雅地给堆叠布局排版，无需给首项特判

</v-click>

<v-click>

> 痛点：选择器历来**无法向上选父级**——这个十几年的限制，由 `:has()` 解决。

</v-click>

---
layout: section
---

# 伪类与伪元素

感知状态、结构，甚至「反选」父级

---

# 一冒号之差

- **伪类** `:hover`（单冒号）：按**状态 / 位置**选**已存在**的元素
- **伪元素** `::before`（双冒号）：**凭空造**一个虚拟盒子

```css
a:hover {
}                       /* 处于悬停态的 <a> */
a::before {
  content: "→ ";        /* 在 <a> 内容前插入虚拟盒子 */
}
```

> `::before` 等四个「元老」兼容单冒号；新代码一律双冒号。

---

# 状态伪类

响应交互与表单状态：

```css
input:focus-visible {
}                       /* 键盘聚焦才画焦点环 */
input:checked + label {
}                       /* 勾选的复选框 */
input:disabled {
}                       /* 禁用 */
:target {
}                       /* URL #锚点 指向的元素 */
```

> 优先 `:focus-visible`：只在键盘操作时命中，不打扰鼠标用户。

---

# 结构伪类

按 DOM 位置匹配，无需加类：

```css
:root {
}                       /* 文档根，常放 CSS 变量 */
li:first-child {
}                       /* 第一个 <li> */
li:last-child {
}                       /* 最后一个 */
div:empty {
}                       /* 无任何子节点 */
```

`:root` 等价 `<html>` 但特异性更高。

---

# `:nth-child()` 的 `An+B`

```css
tr:nth-child(odd) {
}                       /* 奇数行（= 2n+1） */
li:nth-child(3) {
}                       /* 第 3 个 */
li:nth-child(3n) {
}                       /* 第 3、6、9… */
li:nth-child(-n + 3) {
}                       /* 前 3 个 */
```

`even` = `2n`；公式从序号 1 开始数。

---

# `:nth-child` vs `:nth-of-type`

常见坑——数的范围不同：

```html
<section><h2>标题</h2><p>第一段</p><p>第二段</p></section>
```

```css
p:nth-child(1) {
}                       /* 不命中！第 1 个子元素是 <h2> */
p:nth-of-type(1) {
}                       /* 命中「第一段」：<p> 里排第 1 */
```

- `:nth-child`：在**所有兄弟**里排第几
- `:nth-of-type`：在**同类型兄弟**里排第几

---

# `:is()`：分组 + 容错

把选择器列表折叠，治「组合数爆炸」：

```css
:is(section, article, aside, nav) h1 {
  font-size: 1.5rem;
}
```

- **容错**：参数里有不认识的选择器，只忽略那一项
- **特异性取参数里最高**：`:is(p, #id)` 算 `1-0-0`
- Baseline 2021，放心用；旧名 `:matches()` 已弃用

---

# `:where()`：和 `:is()` 一样，但归零

语法、容错完全相同，**唯一区别**——特异性永远 `0-0-0`：

```css
:where(article a) {
  color: teal;          /* 0-0-0 */
}
article a {
  color: crimson;       /* 0-0-2 > 0-0-0，轻松覆盖 */
}
```

写**重置 / 设计系统基础层**的理想工具：默认值「软」到人人能覆盖。

---

# `:not()`：取反（小心抬权重）

```css
li:not(:last-child) {
  border-bottom: 1px solid #eee;
}
```

<v-click>

::: warning 两个坑
① `:not()` 算入**参数最高特异性**：`p:not(#x)` 是 `1-0-1`，平白难覆盖。
② 全集陷阱：`body :not(table) a` **仍命中表格内链接**（`<td>` 自身满足 `:not(table)`）。
:::

</v-click>

---

# `:has()`：期盼已久的父选择器

终结「只能向下选」的历史限制：

```css
section:has(.featured) {
}                       /* 含 .featured 后代的 section——父选择器 */
.card:has(> img) {
}                       /* 只看直接子 */
h2:has(+ p) {
}                       /* 后面紧跟 <p> 的 h2——前兄弟选择器 */
```

参数是锚定在当前元素上的**相对选择器**。

---

# `:has()` 组合逻辑与真实场景

```css
article:has(video, audio) {
}                       /* 或：含 video 或 audio */
article:has(video):has(audio) {
}                       /* 与：链式，两者都含 */
form:has(input:invalid) {
  outline: 2px solid #e11;   /* 字段非法 → 整表单变红 */
}
```

> 过去这要靠 JS 监听；现在纯 CSS 搞定。

---

# `:has()` 的限制

::: warning 四条硬规则
① **不能嵌套**：`.a:has(.b:has(.c))` 非法
② **参数不能含伪元素**：`:has(::before)` 非法
③ 特异性取参数里最高（同 `:is()`）
④ 锚点选 `body` / `*` + 内部无约束时**匹配成本高**
:::

<v-click>

Baseline 2023-12「新近可用」；更老环境可用 `:is()` 包裹降级。

</v-click>

---

# 伪元素全谱

「凭空造盒子」，最常用几个：

```css
.tag::before {
  content: "#";         /* 必须有 content */
}
p::first-letter {
}                       /* 首字母下沉 */
::selection {
}                       /* 选中文字样式 */
input::placeholder {
}                       /* 占位文字 */
```

还有 `::marker`（列表符）、`::backdrop`（`<dialog>` 遮罩）。

---

# `::before` / `::after` 要点

```css
.decor::before {
  content: "";          /* 空串：造纯装饰盒子 */
}
```

<v-click>

- 没有 `content`，伪元素**根本不会生成**
- 造装饰盒写 `content: "";` 即可
- **替换元素**（`<img>` / `<input>`）上不能用

</v-click>

---
layout: section
---

# 第二部分

特异性：ID-CLASS-TYPE 计分

---

# 特异性是三列，不是一个数

把它想成版本号那样的三元组 `(ID, CLASS, TYPE)`：

```css
#title {
  color: green;         /* 1-0-0 */
}
.page .section .box [data-id] {
  color: orange;        /* 0-4-0 */
}
```

- **逐列从左往右比**，左列更大直接赢
- **永不进位**：标题是绿色——4 个类也凑不出 1 个 ID

---

# 三列权重表

| 选择器种类 | 计入 | 单权重 |
| --- | --- | --- |
| ID `#main` | ID 列 | `1-0-0` |
| 类 / 属性 / 伪类 `.x` `[a]` `:hover` | CLASS 列 | `0-1-0` |
| 类型 / 伪元素 `div` `::before` | TYPE 列 | `0-0-1` |
| 通用 `*` / 组合器 / `:where()` / `&` | 不计 | `0-0-0` |

> 易错：属性算 CLASS（不是 TYPE）；伪元素算 TYPE（不是 CLASS）。

---

# 一步步累加

```css
a {
}                       /* 0-0-1  类型 a */
a.btn {
}                       /* 0-1-1  + 类 .btn */
a.btn.primary {
}                       /* 0-2-1  + 类 .primary */
a.btn.primary[href]:hover {
}                       /* 0-4-1  + 属性 + 伪类 */
```

类、属性、伪类都进 CLASS 列累加；这条 `0-4-1` 已相当难覆盖。

---

# 函数式伪类对特异性的影响

现代 CSS 的关键考点，四个各有脾气：

```css
:where(#sidebar) a {
}                       /* 0-0-1  :where 归零，只剩 a */
:is(p, #id) {
}                       /* 1-0-0  取参数最高 */
p:not(#id) {
}                       /* 1-0-1  p + 参数里 #id */
h1:has(> #id) {
}                       /* 1-0-1  h1 + 参数里 #id */
```

> `:is` / `:not` / `:has` 都会被参数里的「权重炸弹」（尤其 ID）抬高。

---

# 行内样式与 `!important`：在特异性之外

两样东西**不参与**三列计分，但优先级更高：

```css
/* 行内 style 概念上记 1-0-0-0，压过任何选择器 */
a {
  color: red !important;    /* 0-0-1 但带 !important → 赢 */
}
#nav .menu a.link {
  color: blue;              /* 1-2-1 普通声明 → 输 */
}
```

- 行内 `style=""` 只有 `!important` 能压它
- 两条 `!important` 之间，才重新回到「比特异性」

---

# 赢得特异性，而不滥用 `!important`

比堆 `!important` 克制的手法：

```css
.btn.btn {
  color: green;         /* 重复类名，0-1-0 → 0-2-0 */
}
.btn[class] {
  color: green;         /* 属性复述，效果类似 */
}
```

<v-click>

> 更治本：用 `@layer` 装第三方样式、用 `:where()` 给基础样式归零——从架构上消解特异性战争。

</v-click>

---
layout: section
---

# 第三部分

层叠：冲突裁决四阶段

---

# 层叠的四个阶段

像漏斗，**上一步分不出才进下一步**：

<v-click>

1. **来源与重要性**——从哪来、带不带 `!important`
2. **层叠层**——作者样式内按 `@layer` 排序
3. **特异性**——选择器谁更具体
4. **书写顺序**——以上全平，后写的赢

</v-click>

<v-click>

> 来源在最前：UA 默认样式特异性再高，也压不过你任意一条普通作者规则。

</v-click>

---

# 第一阶段：三种来源

普通声明优先级**由低到高**：

| 来源 | 是什么 | 普通优先级 |
| --- | --- | --- |
| 浏览器 UA | 内置默认样式 | 最低 |
| 用户 | 浏览器偏好 / 扩展注入 | 中 |
| 作者 | **你写的** CSS | 最高 |

> 所以 `h1 { font-size: 2rem }` 总能盖过浏览器默认字号——作者天然高于 UA。

---

# `!important` 把来源倒过来

```
普通声明：   UA  <  用户  <  作者      （作者最强）
!important： 作者 <  用户  <  UA       （UA 最强，完全反转）
```

<v-click>

**为什么反转**？为用户兜底无障碍——

低视力用户用浏览器强制放大字体（用户 `!important`），网站作者就**不该**能用自己的 `!important` 压回去。

</v-click>

---

# 完整优先级阶梯

低 → 高：

| 档位 | 说明 |
| --- | --- |
| 1–4 | UA / 用户 / 作者 / 行内 **普通声明** |
| 5 | **动画 `@keyframes`**（压过所有普通声明） |
| 6–8 | 作者 / 用户 / UA `!important` |
| 9 | **过渡 transition**（最高，连 `!important` 都压） |

> 用 `!important` 去「锁」一个正在过渡的属性，是锁不住的。

---

# 为什么动画 / 过渡能压 `!important`

::: tip 视觉顺滑优先
动画和过渡正在「进行时」，本职就是**逐帧改变视觉状态**。
:::

<v-click>

- 若一条 `!important` 能在动画中途把属性钉死，动画就会**卡住、抖动**
- 所以规范让激活中的**过渡排在最顶**、动画稍低但仍高于所有普通声明
- 保证视觉过渡顺滑

</v-click>

---

# 第四阶段：书写顺序

来源、层、特异性全平时，**后写的赢**：

```css
.alert {
  color: orange;
}
.alert {
  color: crimson;       /* 同特异性，后写 → 最终 crimson */
}
```

- 靠后的规则、靠后加载的 `<link>` 都「后来居上」
- 这就是「保证你的 CSS 在组件库之后加载」即可覆盖的原理

---

# 渐进增强：同属性写两遍

```css
.box {
  color: rgb(0 128 0);          /* 老浏览器用这条 */
  color: oklch(0.6 0.15 150);   /* 认识的浏览器覆盖 */
}
```

<v-click>

- 同一声明块内，同名属性也是**后者覆盖前者**
- 不认识 `oklch()` 的浏览器**静默丢弃**第二条 → 回退到第一条
- 这正是「CSS 不报错」反而有用的一面

</v-click>

---
layout: section
---

# 第四部分

`@layer` 级联层

---

# 为什么需要级联层

特异性是把双刃剑：

<v-click>

- UI 框架内部可能写 `.dropdown .menu li a`（`0-3-1`）
- 想覆盖：要么写**更高特异性**（越写越长），要么 `!important`（军备竞赛）
- 两条路都把代码推向失控

</v-click>

<v-click>

> `@layer` 第三条路：把样式归入**有序的层**，让**层序**直接决定优先级——与特异性脱钩。

</v-click>

---

# 声明层序

最关键一步——**先用一行把顺序定下来**：

```css
@layer reset, base, theme, components, utilities;
```

- 铁律：**写在前的层优先级最低**，后者更高
- 上面 `utilities` 最强、`reset` 最弱
- 建议样式表开头集中声明一次，座次就此锁定

---

# 往层里写样式

```css
@layer base, special;   /* 定序：base 低，special 高 */

@layer special {
  .item { color: rebeccapurple; }
}
@layer base {
  .item { color: green; }   /* 即便写在后面 */
}
/* 结果：rebeccapurple——special 赢，与代码先后无关 */
```

> 同名层可多次追加，优先级始终由**首次出现在层序里的位置**决定。

---

# 核心规则一：层序压过特异性

最反直觉、也最有用——层之间**完全无视特异性**：

```css
@layer theme, utilities;

@layer theme {
  .box p { color: green; }   /* 0-1-1，按理更高 */
}
@layer utilities {
  p { color: red; }          /* 0-0-1，按理更低 */
}
/* 结果：红色！utilities 在后 → 整层胜出 */
```

只有**同层内部**冲突时，才回到比特异性。

---

# 核心规则二：未分层赢过所有分层

```css
@layer framework {
  .btn { background: blue; }   /* 分层 */
}
.btn {
  background: green;           /* 未分层 → 赢 */
}
/* 结果：绿色，哪怕特异性相同甚至更低 */
```

普通声明优先级阶梯（低 → 高）：

```
先声明的层 < … < 后声明的层 < 未分层样式
```

---

# 核心规则三：`!important` 全反转

```css
@layer a, b;            /* 普通：a 弱 b 强 */

@layer a {
  p { color: green !important; }
}
@layer b {
  p { color: red !important; }
}
/* 结果：绿色！!important 下，先声明的 a 反而最强 */
```

> 且 `!important` 下**分层强于未分层**。一句话：普通后来者赢、未分层最赢；`!important` 一切反转。

---

# 把第三方导入到层

`@import` + `layer()`，MDN 推荐的替代 `!important` 范式：

```css
@layer reset, vendor, app;          /* 先定序 */
@import url("normalize.css") layer(reset);
@import url("bootstrap.css") layer(vendor);

.btn {
  background: var(--brand);         /* 未分层，天然覆盖 */
}
```

> `@import` 须在样式表**最前**（仅排在 `@charset`、纯定序 `@layer` 之后）。

---

# `revert-layer`：撤销本层

让某属性**回退到上一个层叠层**的值：

```css
@layer base {
  p { color: red; }
}
@layer override {
  p { color: blue; }
  p.reset { color: revert-layer; }   /* 撤销 override → 露出 base 的 red */
}
/* p.reset 最终是红色 */
```

等于「撤销本层对它的设定，露出下层」。

---

# 一份可套用的层架构

```css
@layer reset, tokens, base, components, utilities;
@import url("normalize.css") layer(reset);

@layer tokens {
  :root { --brand: #0066ff; }
}
@layer utilities {
  .hidden { display: none; }
}
.theme-dark .card { background: #111; }   /* 未分层：一锤定音 */
```

`utilities` 压 `components` 压 `base`，第三方永在最底；要强制覆盖就写未分层。

---
layout: section
---

# 第五部分

继承与全局关键字

---

# 继承：层叠之外的兜底

**没有任何规则**命中某属性时：

```css
body {
  color: #333;
  border: 1px solid red;
}
/* <body> 里未写样式的 <p>： */
/* color → 继承 #333（可继承）              */
/* border → 用初始值 none（非继承，不继承红框） */
```

- **可继承**：`color`、`font-*`、`line-height`…（文字排版）
- **非继承**：`margin`、`padding`、`width`…（盒模型）

---

# 直接命中永远压过继承

::: warning 继承值是最弱的值
只要有**任何一条规则**直接命中该元素的该属性（哪怕特异性极低、哪怕来自 UA 默认），就盖过从父级继承来的值。
:::

<v-click>

> 「父级设了 `color` 但子元素颜色不对」时，先查是不是有别的规则**直接命中**了子元素。

</v-click>

---

# 五个全局关键字

任何属性都能接收，差别全在「**回退到哪里**」：

| 关键字 | 取什么值 |
| --- | --- |
| `inherit` | 父元素该属性的计算值 |
| `initial` | 该属性在 **CSS 规范**里的初始值 |
| `unset` | 可继承→当 `inherit`；非继承→当 `initial` |
| `revert` | 回退到更低来源（用户 / UA）的值 |
| `revert-layer` | 回退到上一个层叠层的值 |

---

# 坑：`initial` ≠ 浏览器默认

::: warning 最常见的误解
以为 `display: initial` 会让 `<div>` 回到 `block`——其实 `display` 的**规范初始值是 `inline`**！
:::

<v-click>

- 想「恢复浏览器默认外观」用 `revert`（回退到 UA 的 `display: block`）
- `initial` 给的是**规范定义的初始值**，常与直觉里的「默认」不同

</v-click>

---

# `unset` vs `revert`

走的是两条不同逻辑：

```css
/* 假设 UA 给 <a> 设了 color: blue */
a { color: red; }                  /* 作者样式 */

.use-unset  { color: unset; }      /* 可继承 → 取父级文字色，可能是黑 */
.use-revert { color: revert; }     /* 撤销作者 → 回到 UA 的蓝色 */
```

- `unset` 走「继承 / 初始值」逻辑
- `revert` 走「回退低来源」逻辑

---
layout: section
---

# 第六部分

性能与最佳实践

---

# 先破迷思：选择器性能通常不是瓶颈

<v-click>

- 2026 年现代引擎下，普通选择器匹配开销**极少**可感知
- 真正拖慢页面的是布局抖动、大图、阻塞脚本
- 别为微优化牺牲可读性

</v-click>

<v-click>

> 浏览器匹配选择器是**从右往左**读的：最右段（关键选择器）越宽，候选越多。别把最右段写成 `*` 或裸标签即可。

</v-click>

---

# 真正要当心的：`:has()` 成本

```css
/* 慢：锚点是 body / *，内部无约束 → 可能遍历整页 */
body:has(.expanded) {
}
/* 快：锚点具体，组合器收窄 */
.panel:has(> .expanded) {
}
```

- **锚点要具体**：`.panel:has()` 而非 `body:has()`
- **用组合器约束**：`> .b`（直接子）比任意后代遍历小得多
- 用对了仍非常值——替代大量 JS DOM 监听

---

# 比速度更重要：特异性可控

「选择器健康度」90% 在**特异性是否可控**：

```css
.page .sidebar .widget .title {
  color: navy;          /* 反例：0-4-0，又长又脆 */
}
.widget-title {
  color: navy;          /* 正例：0-1-0，扁平好覆盖 */
}
```

深链三宗罪：特异性虚高难覆盖、强耦合 DOM、可读性差。

---

# 最佳实践小结

<v-click>

- 优先**单类**、扁平命名（BEM / 工具类），让选择器自解释
- 慎用 ID（`1-0-0` 难覆盖）与 `!important`（破坏可预测性）
- 提权优先 `:is()` / 重复类，而非加 ID
- 用 `@layer` + `:where()` 从架构上管理优先级
- 避免过度限定：`button.btn` 里的 `button` 多半多余

</v-click>

---
layout: center
class: text-center
---

# 谢谢

选择器决定「打中谁」，层叠决定「听谁的」——
看懂这两件事，调样式就不必再靠猜和堆 `!important`

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
