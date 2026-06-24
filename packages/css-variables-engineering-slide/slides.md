---
theme: seriph
background: https://cover.sli.dev
title: CSS 自定义属性、函数与工程化
info: |
  CSS 作为可编程语言 —— 自定义属性、@property、原生嵌套、数学函数、组织方法论与调试
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:css-3 class="text-8xl" />
</div>

<br/>

## CSS 自定义属性、函数与工程化

把 CSS 当成一门可编程、可工程化的语言（基于 CSS 现代标准）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
CSS 早已不只是写死颜色和间距的静态样式表。这一章把变量、类型化、嵌套、数学函数、组织方法论、调试一次讲透。
-->

---
transition: fade-out
---

# 这一章讲什么

CSS 从「上古静态样式」到「可工程化资产」的分水岭

<v-click>

- **变量化**：`--x` + `var()`，运行时换肤、与 JS 双向交互
- **类型化**：`@property` 给变量加类型，顺带解锁动画
- **原生能力**：嵌套 `&` 替代 Sass、`calc/clamp/min/max` 流式排版
- **工程化**：BEM / `@layer` / `@scope` 组织样式，DevTools 调试

</v-click>

<v-click>

> 掌握后：少写一大半媒体查询、丢掉换肤的 JS 黑魔法、告别 Sass 也能舒服嵌套、多人协作样式不互相污染。

</v-click>

---
layout: section
---

# 自定义属性与 `var()`

活在浏览器里的「真·CSS 变量」

---

# 不是 Sass 变量

```css
:root {
  --accent: #0066ff;
}
a {
  color: var(--accent);
}
```

<v-click>

- Sass 变量 `$x`：**编译期**被替换掉，产物里不存在
- CSS 自定义属性 `--x`：**活在浏览器里**的真实值
- 能被层叠、被继承、被 JS 运行时改写 —— 这是「运行时换肤」的基础

</v-click>

---

# 声明与取值

```css
.card {
  --base-size: 1em;
  --card-bg: #f5f5f5;
}
.card-title {
  font-size: calc(2 * var(--base-size));
}
```

<v-click>

- 名字必须以**两个连字符** `--` 开头
- **大小写敏感**：`--my-color` 与 `--My-color` 是两个变量
- `var()` 取值，可与 `calc()` 等函数嵌套使用

</v-click>

---

# 回退值：变量「没定义」时

```css
.button {
  /* --btn-bg 没定义时，退而用 hotpink */
  background: var(--btn-bg, hotpink);
}
```

<v-click>

回退可层层嵌套，组成「优先变体色、没有就用主色」的降级链：

```css
#el {
  background: var(--variant-bg, var(--primary-bg));
}
```

</v-click>

---

# 回退 ≠ 非法值兜底

::: warning 两套机制要分清
回退值**只在变量完全没定义时**生效。
:::

<v-click>

- 变量**未定义** → 用 `var()` 的第二参数（回退值）
- 变量**有定义但值非法**（如把长度赋给颜色）→ 走另一套「计算值时非法」逻辑，**不会**用回退值

</v-click>

---

# 作用域：默认继承 + 参与层叠

```css
:root {
  --first-color: #1166ff;
}
#container {
  /* 仅本子树里，--first-color 变绿 */
  --first-color: #229900;
}
```

<v-click>

- 写在 `:root`（即 `<html>`）→ 整页可读
- 在更具体的选择器里**重新声明** → 就近覆盖、只影响它和后代
- 「就近覆盖 + 自动向下继承」正是换肤的全部原理

</v-click>

---

# 杀手锏：运行时换肤

```css
:root {
  --bg: #ffffff;
  --fg: #1a1a1a;
}
:root.dark {
  --bg: #0d1117; /* 暗色只覆盖这几个变量 */
  --fg: #e6edf3;
}
body { background: var(--bg); color: var(--fg); }
```

组件只引用变量、不写死颜色。

---

# 换肤：JS 只翻一个开关

```js
// 一行切换整站主题
document.documentElement.classList.toggle("dark");
```

<v-click>

- **JS 完全不碰具体样式**，只加 / 去一个类
- 「整页同步变色」由 CSS 继承机制完成：性能好、组件零耦合
- 可叠加 `@media (prefers-color-scheme: dark)` 做「跟随系统」

</v-click>

---

# 值是「文本片段」

自定义属性存的是一段**未解析的 token 流**，可存半截值、用时再拼：

```css
.box {
  --shadow-color: rgb(20 32 54 / 30%);
  --shadow-geometry: 0 4px 12px;
  /* 拼接两个变量组成完整 box-shadow */
  box-shadow: var(--shadow-geometry) var(--shadow-color);
}
```

<v-click>

让变量不止能存颜色 / 尺寸，还能存一组可复用的样式参数。

</v-click>

---

# 坑：「计算值时非法」退回初始值

```css
.content {
  background-color: blue;
}
.content.invalid {
  --length: 2rem; /* 一个长度 */
  /* 背景不接受长度 → 计算值时非法 */
  background-color: var(--length);
}
```

<v-click>

结果**不是 blue**，而是退回背景的初始值 `transparent`！给关键 `var()` 带类型安全的回退，或用 `@property` 定 `initial-value`。

</v-click>

---

# 两条易踩的限制

<v-click>

**① 媒体查询条件里用不了 `var()`**

```css
/* ❌ 无效：浏览器不会解析这个变量 */
@media (min-width: var(--bp)) {
}
```

</v-click>

<v-click>

**② `all` 简写不重置自定义属性**

`all: initial` 能重置全部标准属性，但**碰不到** `--x`，它们仍保留继承值。

</v-click>

---

# 与 JS 交互：读

```js
// 拿「计算后」的最终值（字符串），常有前导空格，记得 trim
const accent = getComputedStyle(document.documentElement)
  .getPropertyValue("--accent")
  .trim();
```

<v-click>

- 读的是**计算值**，不是声明文本；返回字符串，务必 `.trim()`
- 写：`el.style.setProperty("--x", v)` 立即向下继承生效

</v-click>

---

# 与 JS 交互：跟随鼠标的光效

```js
// 把指针坐标实时写进变量，纯 CSS 消费
card.addEventListener("pointermove", (e) => {
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
});
```

<v-click>

```css
.card {
  background: radial-gradient(200px circle at var(--mx, 50%) 50%, #fff2, transparent);
}
```

JS 只负责喂数据，光效由纯 CSS 实现。**自定义属性自 2017-04 起 Baseline 广泛可用，可无脑用。**

</v-click>

---
layout: section
---

# `@property` 类型化变量

给变量加类型，解锁动画（Baseline 2024）

---

# 为什么要给变量加类型

普通自定义属性对浏览器只是**一串不透明文本**，于是：

<v-click>

- **不能动画**：浏览器不懂这串文本是什么类型，无法插值
- **不能类型校验**：赋错值照单全收，错误推迟到使用处
- **没类型化兜底**：非法只能退「计算值时非法」

</v-click>

<v-click>

`@property` 属于 CSS Houdini，**显式登记**变量的类型、是否继承、初始值。

</v-click>

---

# 基本语法：三个描述符

```css
@property --rotation {
  syntax: "<angle>"; /* 类型，必填 */
  inherits: false; /* 是否继承，必填 */
  initial-value: 45deg; /* 初始值，多数必填 */
}
```

<v-click>

- 变量名是 `<dashed-ident>`（`--` 开头、大小写敏感）
- `syntax` 与 `inherits` **缺一个，整条规则非法被忽略**

</v-click>

---

# `syntax`：常用类型

| `syntax` | 含义 |
| --- | --- |
| `"<color>"` | 颜色 |
| `"<length>"` / `"<percentage>"` | 长度 / 百分比 |
| `"<length-percentage>"` | 长度或百分比 |
| `"<number>"` / `"<integer>"` | 数值 / 整数 |
| `"<angle>"` | 角度（`deg`/`turn`） |
| `"*"` | 万能（不校验、不可动画） |

---

# `syntax`：组合符

```css
@property --size {
  syntax: "<length> | <percentage>";
  inherits: true;
  initial-value: 200px;
}
```

<v-click>

- `|` —— 二选一：`"<length> | <percentage>"`
- `+` —— 空格分隔列表：`"<length>+"`
- `#` —— 逗号分隔列表：`"<color>#"`

</v-click>

---

# `inherits` 与 `initial-value`

<v-click>

**`inherits`（必填）**：`inherits: false` 时设的值**只作用于该元素本身、不向下继承** —— 这和普通自定义属性「永远继承」是重要区别。

</v-click>

<v-click>

**`initial-value`（条件必填）**：

- `"*"` 时**可省略**；其余类型**必须给**，否则整条失效
- 必须**计算独立**：`10px`/`45deg`/`rebeccapurple` 可；依赖父级的 `3em` 不可

</v-click>

---

# 杀手锏：让变量能动画

```css
@property --progress {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 25%;
}
@keyframes run {
  to {
    --progress: 100%;
  }
}
```

注册成 `<percentage>` 后，浏览器才懂得在 `25%` 与 `100%` 间平滑插值。

---

# 注册 vs 未注册

| | 未注册 `--x` | 已注册 `@property` |
| --- | --- | --- |
| 浏览器视角 | 不透明 token 流 | 有明确类型 |
| 能否动画 | **不能** | **能**（`"*"` 除外） |
| 是否继承 | 永远继承 | 由 `inherits` 决定 |
| 类型校验 | 无 | 有，赋非法即拒 |
| 非法兜底 | 退「计算值时非法」 | 退到 `initial-value` |

---

# JS 等价写法

```js
CSS.registerProperty({
  name: "--accent",
  syntax: "<color>",
  inherits: true,
  initialValue: "rebeccapurple",
});
```

<v-click>

::: tip 谁优先
同名既在 CSS 用 `@property`、又在 JS 用 `CSS.registerProperty()` 时，**JS 注册优先**；多条同名 `@property` 取**最后出现的那条**。
:::

</v-click>

---

# `@property` Baseline 与降级

::: warning Baseline 2024（newly available）
自 2024-07 起主流浏览器较新版本广泛可用，旧设备可能不支持。
:::

<v-click>

- 不支持的浏览器**忽略这条规则** → 变量退化为普通自定义属性
- 颜色 / 尺寸照常显示，只是「动画」那层不生效
- 当作**渐进增强**：核心样式别依赖它，动画作锦上添花

</v-click>

---
layout: section
---

# 原生 CSS 嵌套

不装 Sass，CSS 自己就能嵌套（Baseline 2023）

---

# CSS 终于能原生嵌套

```css
.feature {
  button {
    color: blue;
  }
  .link {
    color: red;
  }
}
```

<v-click>

等价于展开后的扁平写法 `.feature button` / `.feature .link`。默认在父子之间**自动补空格**，生成**后代组合器**。

</v-click>

---

# `&`：后代 vs 复合

```css
.notice {
  & .child {} /* = .notice .child（后代，自动补空格） */
  &:hover {} /* = .notice:hover（复合，同一元素） */
  &.warning {} /* = .notice.warning（复合） */
}
```

`&` 指代**父选择器**，会被替换成解析后的父选择器。

---

# 最常见的坑：一个空格之差

::: warning 含义完全不同
- `.notice { .warning {} }`（有空格）= `.notice .warning`（**后代**）
- `.notice { &.warning {} }`（`&` 贴着）= `.notice.warning`（**复合**）
:::

<v-click>

想表达「这个元素**自己的**状态 / 变体」时，永远别忘 `&`。

</v-click>

---

# 反向嵌套：`&` 放后面

```css
img {
  .my-component & {
    /* = .my-component img（组件内的图片） */
  }
}
```

<v-click>

- `&` 不一定在开头，放后面可「反转上下文」
- 类型选择器与 `&` 同写时**类型在前**：`p&` 合法（= `p.foo`），`&p` 非法

</v-click>

---

# 嵌套 at 规则

```css
.card {
  padding: 8px;
  @media (min-width: 40em) {
    padding: 16px;
  }
  @container (inline-size > 900px) {
    flex-direction: row;
  }
}
```

<v-click>

可嵌套 `@media` / `@container` / `@supports` / `@layer`；**`@import` 不行**（它必须待在样式表最前）。

</v-click>

---

# 特异性陷阱：`&` 像 `:is()`

```css
#main-header,
.intro {
  & a {
    color: green; /* 特异性 (1,0,1)：ID 把整组拉高 */
  }
}
.intro a {
  color: blue; /* (0,1,1) 更低 → 被压住 */
}
```

分组父选择器里**混进一个 ID**，整组嵌套规则特异性都被抬到 ID 高度。

---

# 与 Sass 的根本区别

| | 原生 CSS 嵌套 | Sass / SCSS |
| --- | --- | --- |
| `&` 是什么 | 已解析的父选择器 | 可拼接的字符串占位符 |
| `&__elem` / `&--mod` | **非法** | **合法**（拼成 `.block__elem`） |
| 处理时机 | 浏览器运行时解析 | 编译期展开 |

<v-click>

迁移自 Sass 时，所有 `&__xxx` / `&--xxx` 都得改写成**完整类名**。

</v-click>

---

# 别嵌套太深

::: tip 社区共识：2~3 层以内
层数越深越难维护，特异性也越积越高、越难覆盖。
:::

<v-click>

- 嵌套是「就近组织相关样式」的工具
- **不是**「复刻 DOM 结构」的借口
- 超过 2~3 层，扁平写法往往反而更清晰

</v-click>

---

# 嵌套 Baseline 与降级

::: tip Baseline 2023（广泛可用）
自 2023-12 起主流浏览器广泛可用，日常项目可放心使用。
:::

<v-click>

兼容更老环境时，用构建期工具把嵌套**展开成扁平 CSS**：

- PostCSS 的 `postcss-nesting`
- 或继续用 Sass —— 得到完全一致的产物

</v-click>

---
layout: section
---

# 数学函数与流式排版

把响应式从「按断点切换」升级成「随视口流动」

---

# `calc()`：在值里做运算

```css
.el {
  /* 百分比减固定长度：CSS 别处做不到的混合单位 */
  width: calc(100% - 2rem);
  height: calc(var(--root-height) * 3);
}
```

<v-click>

- 最大价值是**混合不同单位**
- 能**嵌套**，也能配合自定义属性

</v-click>

---

# `calc()` 的空格规则

::: warning 运算符两侧空格
`+` 和 `-` 两侧**必须各留一个空格**。
:::

<v-click>

- `calc(100% -2rem)` ❌ → `-2rem` 被看成负长度而非减法
- `calc(100% - 2rem)` ✅ 才对
- `*` `/` 没这么严格，但**除数必须是无单位的数**

</v-click>

---

# `min()` 取小 = 设「上限」

```css
.el {
  /* 宽度随视口走，但永远不超过 30rem */
  width: min(20vw, 30rem);
}
```

<v-click>

- `min()` 取较小值 → 结果**不会超过**最小的那个上界
- 实际效果是「**封顶**」：视口大到 `20vw` 超过 `30rem` 时被卡住

</v-click>

---

# `max()` 取大 = 设「下限」

```css
.el {
  /* 高度随视口走，但永远不小于 20rem */
  height: max(20vh, 20rem);
}
```

<v-click>

- `max()` 取较大值 → 结果**不会低于**最大的那个下界，效果是「**保底**」
- 记牢：**`min()` 设上限（封顶），`max()` 设下限（保底）** —— 名字取「返回哪个值」，响应式效果恰好相反，最容易绕晕

</v-click>

---

# `clamp()`：把值夹在区间里

```css
h1 {
  font-size: clamp(2rem, 1rem + 3vw, 3rem);
}
```

<v-click>

- 视口很窄：`1rem + 3vw` < `2rem` → 取下限 `2rem`
- 视口很宽：> `3rem` → 取上限 `3rem`
- 中间区段：随 `vw` **平滑变化**
- 等价 `max(min, min(理想, max))`，一行顶好几个 `@media`

</v-click>

---

# 理想值为什么要带 rem

::: tip 可访问性
经典写法 `clamp(2rem, 1rem + 3vw, 3rem)` 的理想值**特意混入 `rem`**。
:::

<v-click>

- 纯 `vw` 的字号在用户**放大页面**时不会跟着变大 → 伤害可访问性
- 混入 `rem` 后，字号仍能响应用户的缩放设置
- 这是流式字号的最佳实践

</v-click>

---

# 流式排版实战

```css
.prose {
  /* 小屏占满、大屏封顶到易读的 65 字符宽 */
  inline-size: min(65ch, 100%);
  /* 区块间距随视口微调，夹在 1rem~3rem */
  padding-block: clamp(1rem, 5vw, 3rem);
  margin-inline: auto;
}
```

用极少代码做出「无媒体查询」的响应式排版。

---

# 配 `var()` 做动态布局

```css
.grid {
  --min-col: 16rem;
  /* 每列至少 --min-col 宽，放不下就换行 */
  grid-template-columns: repeat(auto-fill, minmax(min(var(--min-col), 100%), 1fr));
  gap: clamp(0.5rem, 2vw, 1.5rem);
}
```

<v-click>

- 数学函数 + 自定义属性天生一对，组合出变量驱动的「自适应卡片网格」
- 都能**跨单位类型**比较 / 运算、互相嵌套、接受 `var()` 作参数
- **Baseline**：`calc` 历史悠久，`min/max/clamp` 自约 2020 年起全主流支持，无需降级

</v-click>

---
layout: section
---

# 组织方法论

三层武器：BEM → `@layer` → `@scope`

---

# 从「约定」到「语言」

样式一多，核心难题是**类名别打架**、**样式别外泄**：

<v-click>

- **BEM** —— 命名约定，靠**团队纪律**维持，不依赖新特性
- **`@layer`** —— 用语言机制让样式按层排座次
- **`@scope`** —— 用语言机制把样式圈进 DOM 子树

</v-click>

<v-click>

三件工具**层层递进**，从「靠人」到「靠语言」。

</v-click>

---

# 一、BEM：靠命名纪律

```css
.card {
} /* Block：独立组件 */
.card__title {
} /* Element：组成部分 */
.card--featured {
} /* Modifier：变体 / 状态 */
```

<v-click>

好处全在「**选择器几乎都是单个类**」：特异性恒 `0-1-0` 好覆盖、自带命名空间、结构自解释。代价是类名长、靠人自觉。

</v-click>

---

# 二、`@layer`：靠层序排座次

```css
/* 先声明的层优先级最低，后声明的最高 */
@layer reset, base, components, utilities;

@layer components {
  .card {
    padding: 1rem;
  }
}
```

<v-click>

让**层序直接决定优先级、与特异性脱钩**。

</v-click>

---

# `@layer` 经典用法：驯服第三方

```css
@layer framework, app;
@import url("bootstrap.css") layer(framework);

/* app 层轻松压过 framework，零 !important */
.btn {
  background: var(--accent);
}
```

<v-click>

把框架塞进**低层**，自己样式放高层（或不分层）→ 总能用简单的 `.btn` 覆盖框架的高特异性选择器。**Baseline 2022**。

</v-click>

---

# 三、`@scope`：基本作用域

```css
/* 这些规则只在 .card 子树内生效，不外泄 */
@scope (.card) {
  img {
    border-radius: 8px;
  }
  :scope {
    background: var(--bg);
  }
}
```

`.card` 是**作用域根**；`:scope` 伪类指代根元素自身。

---

# `@scope`：甜甜圈（root … to … limit）

```css
/* 管 .article-body 内的图片，但跳过 figure 里的 */
@scope (.article-body) to (figure) {
  img {
    border: 5px solid black;
  }
}
```

<v-click>

- `.article-body` 是上界（**含**），`figure` 是下界（**不含**）
- 两者之间的「甜甜圈」区域才受样式影响
- 适合「管文章正文，但别动里面嵌套的组件」

</v-click>

---

# `@scope`：特异性与作用域邻近

<v-click>

- **裸选择器零特异性**：`@scope` 里直接写的 `img` 隐式带 `:where(:scope)`，特异性 `0-0-1`
- **作用域邻近**：两个作用域冲突时，**DOM 上更近的根赢** —— 层叠里一条新增裁决维度（介于书写顺序之上、特异性之下）

</v-click>

<v-click>

> 嵌套 `.light-theme` > `.dark-theme` > `.light-theme` 时，离最近根更近的 `light` 赢。

</v-click>

---

# `@scope` 较新，按渐进增强用

::: warning Baseline 2025（newly available）
自 2025-12 起较新浏览器支持，**比本章其他特性都新**。
:::

<v-click>

- 不支持的浏览器**忽略整个 `@scope` 块**，里面样式全不生效
- 别把**关键布局**只放进 `@scope`
- 当「锦上添花的隔离」，对老环境留 BEM 命名空间兜底

</v-click>

---

# 三者怎么配合

| 工具 | 解决什么 | 依赖 | Baseline |
| --- | --- | --- | --- |
| BEM | 类名不打架、低特异性 | 团队纪律 | 永远可用 |
| `@layer` | 谁覆盖谁、驯服框架 | 语言机制 | 2022 |
| `@scope` | 样式不外泄、组件隔离 | 语言机制 | 2025 |

<v-click>

范式：BEM 保低特异性 → `@layer` 排座次 → 需强隔离再叠 `@scope`。

</v-click>

---
layout: section
---

# CSS 调试与 DevTools

CSS 从不报错，得靠工具看真相

---

# 先建立一个认知：CSS 不报错

```css
.box {
  color: #zzz; /* 非法颜色 → 整条被静默丢弃 */
  /* 控制台不会有任何提示 */
}
```

<v-click>

- 遇到拼错选择器或非法值，**既不抛错也不中断，只默默忽略那一条**
- 「样式没生效」时**干瞪代码几乎没用**
- 正确做法：打开 DevTools，让它告诉你真相

</v-click>

---

# Styles 面板：删除线 = 被覆盖

右键元素 → **检查** → Elements → **Styles** 面板（CSS 调试主战场）：

<v-click>

- 按层叠顺序列出**所有命中该元素的规则**
- 被同属性更高优先级覆盖的声明**带删除线**
- 一眼看清：哪条**最终生效**、它**压住了哪些**

</v-click>

---

# Styles：规则「没出现」= 没命中

::: tip 最常见的真相
期望的规则**根本没出现**在列表里 = **选择器没匹配上**这个元素。
:::

<v-click>

- 多半是类名拼错、选择器语法错
- 或元素结构和你以为的不一样
- 这是「样式没生效」最常见的原因

</v-click>

---

# Computed 面板：最终值与继承来源

<v-click>

- **Styles 面板**看「有哪些规则在抢」
- **Computed 面板**看「抢完之后每个属性最终是多少」

</v-click>

<v-click>

排查继承的利器：展开某个属性，能看到**这个值具体从哪条规则、哪个祖先继承 / 计算而来** —— 疑惑「这个 `color` 哪来的」时直接给出溯源链路。

</v-click>

---

# 盒模型图 + 模拟状态

<v-click>

**盒模型图**：把 margin / border / padding / 内容尺寸分层画出，**双击数字就地改**、页面实时更新。

</v-click>

<v-click>

**`:hov` 按钮**：勾选 `:hover` / `:focus` / `:active` 强制进入状态，免手动悬停。

**`.cls` 按钮**：临时加 / 勾选类名，实时预览不同变体。

</v-click>

---

# 调试自定义属性

<v-click>

- 悬停 `var(--accent)` → 弹出它当前**解析到的实际值**，不用人肉追溯
- 想验证换肤：在 Styles 里找到 `:root`，**改那几个变量** → 因向下继承，整页即时更新
- 「计算值时非法」退回初始值时，**Computed 面板**能看清最终落值

</v-click>

---

# 全局体检：Overview 与 Coverage

<v-click>

- **CSS Overview** —— 一键扫描全站，汇总用到的颜色、字体、媒体查询、未使用声明，发现「色板太乱」「重复定义」
- **Coverage（覆盖率）** —— 记录页面实际用了多少 CSS / JS，标出**未使用的代码**，给样式表瘦身

</v-click>

---

# 一套高效排查顺序

<v-click>

1. **右键 → 检查**，选中出问题的元素
2. 看 **Styles**：期望的规则**在不在**列表里？
3. 不在 → 选择器没命中；带删除线 → 被谁覆盖（特异性？层？顺序？）
4. 拿不准最终值 → **Computed** 看计算值与继承来源
5. 涉及变量 → 悬停 `var()` 看解析值，或改 `:root` 验证

</v-click>

---

# 最佳实践小结

<v-click>

- 变量 + `clamp()` 几乎可无脑用；`@property`、原生嵌套 2024 后也稳妥
- `var()` 非法**退回初始值**（不是回退值）；关键属性给类型安全兜底
- 原生 `&` **不能拼字符串**（`&__elem` 非法）；嵌套别超 2~3 层
- `min()` 封顶、`max()` 保底、`clamp()` 夹中间，理想值带 `rem`
- 组织：BEM → `@layer` → `@scope`；调试记住「CSS 不报错」

</v-click>

---
layout: center
class: text-center
---

# 谢谢

把 CSS 当成可编程、可工程化的语言：变量换肤、类型化动画、原生嵌套、流式排版、分层圈作用域 —— 少写一半媒体查询，告别黑魔法

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
