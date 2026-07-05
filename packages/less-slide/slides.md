---
theme: seriph
background: https://cover.sli.dev
title: Less CSS 预处理器
info: |
  Presentation Less —— 向后兼容 CSS 的预处理器，由 JavaScript 实现。

  Learn more at [https://lesscss.org](https://lesscss.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl font-mono">@</span>
  <span class="text-6xl font-mono opacity-70">{ }</span>
</div>

<br/>

## Less —— CSS，加一点点

向后兼容 CSS 的预处理器，`@变量` / 混合 / 嵌套 / 运算，编译期产出标准 CSS

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://lesscss.org/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
今天聊 Less —— Leaner Style Sheets，一门向后兼容 CSS 的预处理器。

它由 JavaScript 实现，用变量、混合、嵌套、运算这些能力扩展 CSS，最终编译成标准 CSS。当前稳定版本 4.6.7。

今天顺序：定位 → 变量与作用域 → 插值 → 与 CSS 自定义属性的区别 → 嵌套与父选择器 → 混合与守卫 → 运算与数学模式 → 函数 → 导入与组织 → extend → 编译方式 → 与 Sass 对比 → 生态选型 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# Less 是什么

一门**向后兼容 CSS** 的预处理器：

<v-clicks>

- 用 `@变量` / 混合 / 嵌套 / 运算扩展 CSS，编译出**标准 CSS**
- 由 **JavaScript 实现**，Node（lessc / API）与浏览器都能跑
- **编译期**工具——产物里不再有 Less 语法（不是运行时 CSS-in-JS）
- 合法 CSS **基本都是**合法 Less，改扩展名即可渐进迁移

</v-clicks>

<div v-click class="mt-4 text-sm">

> 官方口号：It's CSS, with just a little more。贴近 CSS、学习成本低是它的核心气质。

</div>

<!--
Less 全称 Leaner Style Sheets。三条心智先立住。

第一，它是 CSS 的向后兼容扩展，几乎所有合法 CSS 都是合法 Less，迁移成本极低。

第二，它由 JavaScript 实现，这是它和用 Dart 实现的 Sass 的实现层区别，可以跑在 Node 和浏览器。

第三，它是编译期工具，变量嵌套混合都在编译时被解析掉，产物是普通 CSS，不是运行时 CSS-in-JS，也不是浏览器原生方言。
-->

---

# 四大核心特性

```less
@primary: #1677ff;              // 1. 变量（@ 前缀）
@radius: 4px;

.card {
  border-radius: @radius;       // 2. 运算 & 取值
  .title { font-weight: 600; }  // 3. 嵌套
  &:hover { color: @primary; }  // 父选择器 &
}

.rounded(@r: 4px) {             // 4. 混合（可参数化）
  border-radius: @r;
}
```

<div v-click class="mt-2 text-sm">

> 变量、嵌套、混合、运算——四件套覆盖日常样式复用需求，语法紧贴 CSS。

</div>

<!--
一页看全四大特性。第一是变量，用 @ 前缀声明，这是和 Sass 用美元符号最直观的区别。第二是运算和取值，可以对数值做加减乘除。第三是嵌套，子规则写进父规则里跟随结构层级，& 代表父选择器。第四是混合，像函数一样复用一段声明，还能带参数。

记住这四件套，就抓住了 Less 的骨架。
-->

---

# 变量：`@` 前缀与惰性求值

```less
@link-color: #428bca;
a { color: @link-color; }

.lazy {
  width: @w;      // 先用没关系
  @w: 100px;      // 后定义 —— 惰性求值
}
```

<v-clicks>

- 变量以 `@` 开头（对比 Sass 用 `$`）
- **惰性求值**：变量可以先用后声明，Less 在需要时才解析
- 变量是**编译期**常量，编译后被替换成静态值

</v-clicks>

<!--
Less 变量用 @ 前缀声明，@link-color 冒号颜色值，取值直接写 @link-color。

关键特性是惰性求值：变量不必先声明后使用，可以先引用再定义，Less 在真正需要它的时候才解析。

要记住变量是编译期的常量，编译之后就被替换成具体的值，产物 CSS 里看不到它。
-->

---

# 最反直觉的坑：最后定义生效

```less
@var: 0;
.class {
  @var: 1;
  .brass {
    three: @var;   // 3 —— 取本作用域「最后」一次定义
    @var: 3;
  }
  one: @var;        // 1 —— 取 .class 作用域最后一次定义
}
```

<div v-click class="mt-3 text-sm">

> ⚠️ 同一作用域内多次定义同名变量，**整个作用域采用最后一次的值**，不是「逐行覆盖」。带命令式直觉的人极易踩坑——要顺序覆盖请拆作用域或用参数传值。

</div>

<!--
这是 Less 变量最反直觉的语义，也是新手高频坑。

因为惰性求值，Less 在同一个作用域里多次定义同名变量时，整个作用域都采用最后一次的定义，而不是像 JS 或 Sass 那样从上到下逐行覆盖。

看例子：.brass 里 three 取到的是 3，因为本作用域最后一次把 @var 定义成 3；.class 里 one 取到的是 1，因为 .class 作用域最后一次定义是 1。

如果你想要顺序覆盖的效果，请拆分作用域，或者改用参数传递。
-->

---

# 变量插值 `@{var}`：嵌进名字与字符串

```less
@name: banner;
@images: "../img";
@property: color;

.@{name} { }                      // 选择器名 → .banner
.widget { @{property}: #0ee; }    // 属性名 → color: #0ee
.logo { background: url("@{images}/a.png"); }
@import "@{name}.less";           // import 路径
```

<div v-click class="mt-2 text-sm">

> **取值**用 `@var`；**嵌名字/字符串**用 `@{var}`。误在取值处写 `@{var}`、名字处写 `@var` 都得不到预期——这是插值最常见的困惑点。

</div>

<!--
普通取值直接写 @var 就行，但要把变量嵌进选择器名、属性名、URL、import 路径这类字符串上下文，必须用花括号插值 @{var}。

看例子：点 @{name} 花括号生成 .banner 这个选择器；@{property} 冒号生成 color 属性；url 里 @{images} 拼路径；import 也能用插值拼文件名。

记住分工：取值用 @var，嵌名字和字符串用 @{var}，别搞混。
-->

---

# 变量变量 `@@` 与属性作为变量 `$prop`

```less
// 变量变量：用变量的值当变量名
@primary: #1677ff;
@theme: primary;
.btn { color: @@theme; }   // @@theme → @primary → #1677ff

// 属性作为变量（v3.0+）：取同名属性最后的值
.widget {
  color: #efefef;
  background-color: $color;   // → #efefef
}
```

<div v-click class="mt-2 text-sm">

> `@@name` 间接取值（元编程味，慎用）；`$prop` 取「当前规则里同名 CSS 属性的值」——注意这里 `$` 语义与 Sass 变量、Less `@` 都不同。

</div>

<!--
两个进阶取值语法。

变量变量 @@，双 at 符号，先解析里层 @theme 得到名字 primary，再用这个名字去取 @primary 的值。适合按主题名动态选变量，但可读性差，慎用。

属性作为变量 $prop，是 3.0 引入的，引用当前规则里同名 CSS 属性最后设置的值。这里的美元符号语义是取属性值，和 Sass 的变量、Less 的 @ 变量都不一样，别混淆。
-->

---

# `@var` ≠ CSS 自定义属性 `--var`

| 维度 | Less `@var` | CSS `--var` |
| --- | --- | --- |
| 时机 | **编译期**静态替换 | **运行时** |
| 产物保留 | 否 | 是 |
| 参与级联 | 否 | 是 |
| JS 可改 | 否 | 是（setProperty） |

<div v-click class="mt-2 text-sm">

> 二者可配合：`:root { --brand: @brand; }` 把 Less 值烘焙进运行时变量。要**运行时切主题**必须落到 `--var`，`@var` 编译后就消失了。

</div>

<!--
这是最需要辨清的一点。Less 变量是编译期的，编译后被替换成静态值，产物里看不到，不参与级联，也不能被 JS 改。

CSS 自定义属性 --var 是运行时的，保留在 CSS 里，参与级联，可以被 JS 用 setProperty 动态修改，能在不同上下文取不同值。

两者可以配合：在 root 里写 --brand 冒号 @brand，把 Less 值烘焙进一个运行时自定义属性，兼得编译期组织和运行时动态。

一句话：要运行时切主题，必须用 --var，别指望 @var，它编译后就消失了。
-->

---

# 嵌套与父选择器 `&`

```less
.card {
  padding: 16px;
  .title { font-weight: 600; }   // → .card .title（后代）
  &:hover { box-shadow: 0 2px 8px #0002; }   // → .card:hover
  &--active { border-color: #1677ff; }        // → .card--active
}
```

<v-clicks>

- 无 `&` → 拼成**后代选择器**（多一个空格）
- 有 `&` → 贴合伪类 / 伪元素 / 状态类 / **BEM 修饰符**
- 嵌套别超 3 层：长选择器、抬优先级、难覆盖

</v-clicks>

<!--
嵌套让样式跟随结构层级书写。没有 & 时，子规则拼成后代选择器，比如 .card 空格 .title。

有 & 时，& 代表父选择器，可以贴合成伪类比如 &:hover 变成 .card:hover，或者 BEM 修饰符 &--active 变成 .card--active，注意是拼接没有空格。

一个忠告：嵌套别超过三层，否则会生成又长又脆的选择器，抬高优先级、难以覆盖。多用 & 平铺 BEM，而不是深挖层级。
-->

---

# `&` 的多种组合

| 写法（父为 `.link`） | 结果 | 用途 |
| --- | --- | --- |
| `&:hover` | `.link:hover` | 伪类 |
| `&&` | `.link.link` | 复合类，提权重 |
| `& &` | `.link .link` | 后代 |
| `& + &` | `.link + .link` | 相邻兄弟 |
| `.no-js &` | `.no-js .link` | 父级前置 |

<div v-click class="mt-2 text-sm">

> `&` 可出现多次、也可放选择器**后面**改变拼接顺序；逗号选择器 + `&` 会展开**所有排列**。

</div>

<!--
& 不止能贴伪类。看这张表，父选择器是 .link。

&& 无空格，得到 .link.link 复合类，常用来提高优先级。& 空格 & 得到 .link 空格 .link 后代。& 加号 & 得到相邻兄弟选择器。& 放在后面，比如 .no-js 空格 &，会把父级整体前置到 .no-js 之后。

而且 & 可以出现多次，逗号分隔的选择器配合 & 会展开所有排列组合，要留意可能生成很多规则。
-->

---

# 混合 mixin：定义与调用

```less
// 定义带括号 → 不单独输出到 CSS
.ellipsis() {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.title { .ellipsis(); }   // 调用带括号，展开三行
```

<v-clicks>

- 定义与调用**括号必需**；不带括号的老写法已 deprecated
- 带括号定义**不污染产物**，只在调用处展开
- 不带括号定义 `.foo {}` 会当普通类，额外输出一条规则

</v-clicks>

<!--
混合把一段声明复用到多处。定义 .ellipsis 带括号花括号里三行，调用 .ellipsis 带括号，就在调用处展开这三行。

三个要点：定义和调用都要带括号，不带括号的老写法已经被官方标注 deprecated。带括号的定义不会作为独立规则输出到产物，只在被调用的地方展开。如果定义时漏了括号写成 .foo 花括号，它会被当成普通类，除了能被混入，还会额外输出一条 .foo 规则，污染产物。
-->

---

# 参数化混合：默认 / 命名 / rest

```less
.radius(@r: 4px) { border-radius: @r; }      // 默认值

.box(@m: 20px; @c: #333) {                    // 命名参数（分号分隔）
  margin: @m; color: @c;
}
.a { .box(@c: #f00); }                        // 可乱序、传部分

.shadow(@x; @y; @blur; @c) {
  box-shadow: @arguments;                     // 全部入参
}
```

<div v-click class="mt-2 text-sm">

> 默认值让无参可调；命名参数用**分号**分隔（避开值内逗号）、可乱序；`@rest...` 收集多余参数；`@arguments` 代表全部入参。

</div>

<!--
参数化混合让同一段逻辑复用于不同取值。

默认值：.radius 括号 @r 冒号 4px，无参调用就用 4px。命名参数：按名字传值，可以乱序、可以只传部分，注意用分号分隔以避开值里的逗号。剩余参数 @rest 三个点，收集其余全部参数。@arguments 在混合体内代表全部入参、按空格连接，常直接铺给 box-shadow 这类多值属性。
-->

---

# 守卫 `when`：Less 的条件表达

```less
.contrast(@bg) when (lightness(@bg) >= 50%) { color: #000; }
.contrast(@bg) when (lightness(@bg) < 50%)  { color: #fff; }
.panel { .contrast(#eee); }   // → color: #000

// 逻辑组合
.m(@a) when (isnumber(@a)) and (@a > 0) { }   // and = 且
.m(@a) when (@a > 100), (@a < 0) { }           // 逗号 = 或
.m(@a) when not (@a > 0) { }                    // not = 非
```

<div v-click class="mt-2 text-sm">

> Less 没有 `@if`，条件靠守卫 `when` + 同名多定义。也能把 `when` 直接加在**选择器**上（CSS 守卫）：`.nav when (@dark) { }`。

</div>

<!--
Less 没有 @if @else 指令，条件靠混合守卫 when 来表达，条件为真该混合才生效。

看例子：背景亮度大于等于 50% 用黑字，小于 50% 用白字，配合同名多定义模拟 if else 分支。

逻辑组合：and 关键字表示且，逗号表示或，任一为真即匹配，not 表示非。守卫里只有 true 是真值。

还有一种 CSS 守卫，把 when 直接加在选择器上，条件为真整条规则才输出，相当于对一段 CSS 块做 if。
-->

---

# 模式匹配 · 混合当函数 · 循环

```less
.setColor(dark, @c)  { color: darken(@c, 10%); }   // 模式匹配
.setColor(light, @c) { color: lighten(@c, 10%); }

.average(@a, @b) { @result: ((@a + @b) / 2); }      // 当函数用
.box { padding: .average(16px, 50px)[@result]; }    // → 33px

.cols(@n) when (@n > 0) {                             // 递归循环
  .col-@{n} { width: (@n * 100% / 12); }
  .cols(@n - 1);
}
```

<div v-click class="mt-1 text-sm">

> 同名混合按参数**模式匹配**；取内部变量 `[@result]` 把混合当**函数**用；无 `@for`，靠**递归守卫**或 `each()`（3.7+）循环。

</div>

<!--
三个进阶技巧一页过。

模式匹配：定义多个同名混合，第一个参数传字面量关键字，Less 按参数匹配选版本，dark 走加深、light 走调亮。

混合当函数：Less 没有 @function，但可以调用混合再用中括号 @result 取它内部的变量当返回值，比如求平均。

循环：没有 @for @while，靠递归守卫混合自我调用加终止条件，或者用 3.7 引入的 each 函数遍历列表。都在编译期展开成多条静态规则。
-->

---

# 运算与 v4 数学模式

| 模式 | `+ - *` | `/` |
| --- | --- | --- |
| `always`（v3） | 算 | 算（误算 `14px/1.5`） |
| **`parens-division`（v4 默认）** | 算 | **需括号** |
| `parens` / strict | 需括号 | 需括号 |

```less
width: 3 + 5;         // 8
width: 100px / 4;     // 100px / 4（保留！）
width: (100px / 4);   // 25px
font: 14px/1.5 sans-serif;   // 斜杠保留，不误算
```

<!--
Less 4 把默认数学模式从 v3 的 always 改成了 parens-division。

看表：always 模式下所有运算都算，会把 font 冒号 14px 斜杠 1.5 里的斜杠误当除法。parens-division 是 v4 默认，加减乘照常算，只有除法需要括号。parens 严格模式所有运算都要括号。

看代码：默认模式下 3 加 5 得 8；100px 斜杠 4 原样保留不算；加括号才得 25px；font 的斜杠也被保留不误算。

改默认的根本动机就是消除斜杠歧义，因为 CSS 里斜杠大量用于简写分隔，比如 font 字号斜杠行高、aspect-ratio 16 斜杠 9、grid 的行列，而不是除法。
-->

---

# 颜色函数与内置函数

<v-clicks>

- **颜色操作**：`lighten` / `darken`（亮度）、`saturate` / `desaturate`（饱和度）、`fade` / `fadeout`（透明度）、`spin`（色相）、`mix`（混色）
- **颜色定义/通道**：`rgba` / `hsl` / `hsla`；`hue` / `lightness` / `alpha` / `luma`
- **数学**：`ceil` `floor` `round` `percentage` `min` `max` `pow` `sqrt`
- **字符串/列表/类型**：`e` `escape` `replace`；`length` `extract` `each`；`isnumber` `iscolor` `isunit`
- **杂项**：`if(cond, a, b)`、`unit` `convert` `data-uri` `default`

</v-clicks>

<div v-click class="mt-1 text-sm">

> ⚠️ 顺序影响保真：`spin(saturate(#aaa,10%),10)` 优于反过来；`image-size` 等需 Node 环境。

</div>

<!--
Less 内置函数按类别记。颜色操作最常用：lighten darken 调亮度，saturate desaturate 调饱和度，fade fadeout 调透明度，spin 转色相，mix 混色。

颜色定义和通道有 rgba hsl hsla，以及取 hue lightness alpha luma 分量。

数学有 ceil floor round percentage min max pow sqrt。字符串有 e escape replace，列表有 length extract each，类型判断有 isnumber iscolor isunit 这些。杂项里 if 是条件函数，还有 unit convert data-uri default。

一个提醒：颜色函数链式调用顺序会影响色彩保真，官方建议先做饱和度再 spin 色相。图像尺寸类函数需要 Node 环境。
-->

---

# `@import` 的精细选项

| 选项 | 作用 |
| --- | --- |
| `reference` | 只引用不输出，用到才产出（**控体积**） |
| `inline` | 原样包含、不编译 |
| `less` / `css` | 强制按 Less / 当 CSS 处理 |
| `once` / `multiple` | 只引一次（默认）/ 可多次 |
| `optional` | 缺失则跳过、不报错 |

```less
@import (reference) "toolkit.less";
@import (optional, reference) "a.less";   // 可组合
```

<div v-click class="mt-1 text-sm">

> 扩展名默认：`.less` 内联编译；`.css` 保留成原生 `@import`。`reference` 是把大型库瘦身进产物的关键。

</div>

<!--
@import 有一组精细选项，写在括号里、可组合。

reference 是控体积关键：引入但默认不输出，只有被 extend 或 mixin 用到的部分才产出。inline 原样包含不编译。less 和 css 强制按对应方式处理。once 默认只引一次，multiple 允许多次。optional 文件缺失时跳过不报错。

扩展名默认行为：.less 内联编译进来，.css 默认保留成原生 @import 不内联。

想复用一整套工具库又不想全打进 CSS，就用 import 括号 reference。
-->

---

# 组织：命名空间 · 映射 · extend

```less
#lib() {                           // 命名空间（私有）
  .rounded(@r) { border-radius: @r; }
  .colors() { primary: #1677ff; }
}
.card {
  #lib.rounded(8px);
  color: #lib.colors[primary];     // 当映射取值
}

.success:extend(.message) { }      // extend：合并选择器
```

<v-clicks>

- **命名空间** `#lib()` 组织样式库、隔离命名；**映射** `@m[key]`（3.5+）按键取值
- **脱离规则集** `@r: {..}` 把样式块当值传给混合
- **`:extend`** 合并选择器（不复制属性），`extend(.x all)` 做查找替换

</v-clicks>

<!--
Less 的模块化拼图。

命名空间：把混合分组进 #lib 括号，带括号是私有的不输出，用 #lib 点 rounded 调用、#lib 点 colors 中括号 primary 当映射取值，隔离命名。

映射：3.5 起把一组变量当映射，用中括号 key 下标取值。脱离规则集：把一段规则赋给变量，可以调用或传给混合，让混合决定包裹进什么上下文，比如媒体查询。

extend：把当前选择器追加到目标选择器上，合并选择器而不复制属性，产物更小。加 all 关键字做非破坏性查找替换。
-->

---

# extend vs mixin：怎么选

| 维度 | `:extend` | mixin |
| --- | --- | --- |
| 机制 | 合并选择器，**共享**声明 | **复制**声明到调用处 |
| 体积 | 更小 | 可能膨胀 |
| 副作用 | 改选择器分组/顺序 | 位置直观 |
| 传参 | 不支持 | 支持 |

<div v-click class="mt-3 text-sm">

> 大量**共享同一组静态声明** → `:extend`（省体积）；需要**参数化、位置可控** → mixin（更直观）。

</div>

<!--
extend 和 mixin 都是复用手段，但机制不同，一页讲清怎么选。

extend 合并选择器，多个选择器共享同一份声明，不复制属性，产物体积更小，但会改变选择器的分组和源码顺序，可能带来意外。mixin 把属性声明复制到调用处，位置直观、支持参数，但多处调用会重复输出、产物可能膨胀。

选择：如果是大量共享同一组静态声明，用 extend 省体积；如果需要参数化、或者在意输出位置，用 mixin 更直观。
-->

---

# 怎么把 Less 编译成 CSS

```bash
# 1) 命令行
lessc styles.less styles.css
lessc --source-map --math=parens styles.less out.css
lessc --modify-var="primary=#f00" theme.less red.css   # 多主题
```

```js
// 2) Node 编程式
const less = require("less");
const { css } = await less.render("@c: red; .a{color:@c}");
```

<div v-click class="mt-1 text-sm">

> 3) 浏览器 less.js（仅开发）；工程实践走构建集成：webpack **less-loader**、**Vite**（装 less 即可）、gulp-less。

</div>

<!--
Less 是 JS 实现，运行方式有三类。

第一是命令行 lessc，输入输出文件，可以加 source-map、math 指定数学模式、modify-var 从外部覆盖变量做多主题。第二是 Node 编程式，require less 后调 less.render，拿到 css 字符串。第三是浏览器端 less.js，但只建议开发用，生产要预编译。

工程实践里更常见的是通过构建工具集成：webpack 的 less-loader、Vite 内置支持只要装 less 包、以及 gulp-less。
-->

---

# Less vs Sass

| 维度 | Less | Sass（Dart） |
| --- | --- | --- |
| 变量 | `@`，惰性 + 最后定义生效 | `$`，命令式逐行覆盖 |
| 模块系统 | 无（`@import (reference)` 近似） | **`@use` / `@forward`** |
| 条件/循环 | 守卫 / 递归 / `each()` | `@if` / `@each` / `@for` |
| 函数 | 混合当函数 `[@x]` | `@function` / `@return` |
| 实现 | JavaScript | Dart（Ruby/LibSass 弃用） |

<div v-click class="mt-2 text-sm">

> 最大能力差距在**模块系统**：Sass 的 `@use` 带命名空间、私有成员、只加载一次；Less 只能靠 reference 近似。

</div>

<!--
客观对比两大预处理器。

变量：Less 用 @，惰性求值加最后定义生效，更像常量；Sass 用美元符号，命令式逐行覆盖，还有 default global 精细控制。

最大的能力差距在模块系统：Sass 也就是 Dart Sass 有一等模块系统 use 和 forward，带命名空间、私有成员、只加载一次；Less 没有正式模块系统，只能用 import reference 近似。

控制流：Sass 有真正的 if each for 指令，Less 靠守卫、递归、each 拼凑。函数：Sass 有 function return，Less 靠混合当函数。实现语言：Less 是 JS，Sass 参考实现是 Dart，Ruby Sass 和 LibSass 都已弃用。
-->

---

# 生态现状与选型

<v-clicks>

- **Less**：特性成熟稳定、**仍在维护**（4.x）、**存量庞大**——Ant Design 早期招牌（v5 起转 CSS-in-JS 令牌）
- **Sass**：预处理器里声量更大，Dart Sass 活跃演进；**Bootstrap 从 v4 起 Less → Sass**
- **PostCSS + 原生 CSS**：`autoprefixer`、`--var`、原生嵌套、`@layer`、`color-mix()` 持续挤压预处理器必要性

</v-clicks>

<div v-click class="mt-3 text-sm">

> 选型：**维护存量 / Ant 生态** 留 Less；**新项目强模块化** 选 Sass；**贴近标准** 走 PostCSS + 原生 CSS；**运行时切主题** 用 `--var`。

</div>

<!--
客观陈述现状。

Less：语言特性趋于成熟稳定，版本仍在维护 4.x，存量庞大，在 Ant Design 生态和大量企业老项目里广泛使用，Ant Design 早期以 Less 主题定制著称，v5 起转向 CSS-in-JS 设计令牌。

Sass：在预处理器里声量更大，Dart Sass 活跃演进，Bootstrap 从 v4 起由 Less 转 Sass 是标志性事件。

PostCSS 和原生 CSS：自动补前缀、自定义属性、原生嵌套、@layer、color-mix 持续挤压预处理器的必要性。

选型一句话：维护存量或 Ant 生态留在 Less；新项目要强模块化选 Sass；想贴近标准走 PostCSS 加原生 CSS；要运行时切主题就用 --var。
-->

---
layout: intro
---

# 总结

Less = **向后兼容 CSS、JS 实现的预处理器**

- 变量 `@`：惰性求值 + **最后定义生效**；插值用 `@{var}`
- 混合 `.m()`：括号必需、可参数化；守卫 `when` 代替 `@if`
- 嵌套 `&`：BEM 修饰符利器；运算除法 v4 需括号
- 组织：`@import (reference)` 控体积、命名空间、`:extend`
- 现状：成熟稳定、存量大，新项目主流让位 Sass / PostCSS / 原生 CSS

<!--
总结一下。Less 是一门向后兼容 CSS、由 JavaScript 实现的预处理器。

变量用 @ 前缀，惰性求值加最后定义生效是最反直觉的坑，嵌名字用 @{var} 插值。混合定义调用都要带括号、可参数化，守卫 when 代替 Less 没有的 @if。嵌套配合 & 是写 BEM 的利器，运算里除法在 v4 默认模式下需要括号。

组织上用 import reference 控制产物体积、命名空间隔离命名、extend 合并选择器。

现状是成熟稳定、存量庞大，但新项目的预处理器主流已让位于 Sass、PostCSS 与增强的原生 CSS。理解 Less，既能读懂海量存量代码，也是对比预处理器设计取舍的好样本。谢谢大家。
-->
