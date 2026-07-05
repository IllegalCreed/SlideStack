---
theme: seriph
background: https://cover.sli.dev
title: Sass CSS 预处理器
info: |
  Presentation Sass —— 历史最悠久、生态最成熟的 CSS 预处理器。

  Learn more at [https://sass-lang.com](https://sass-lang.com/documentation/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl font-mono font-bold" style="color:#cc6699">$</span>
  <span class="text-7xl font-bold" style="color:#cc6699">Sass</span>
</div>

<br/>

## Sass —— 给 CSS 加上编程能力的预处理器

变量 · 嵌套 · mixin · 函数 · 继承 · 模块系统，全部编译成干净 CSS

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://sass-lang.com/documentation/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
今天聊 Sass —— Syntactically Awesome Style Sheets，历史最悠久、生态最成熟的 CSS 预处理器。

它是一门「编译成 CSS 的样式表语言」：在兼容 CSS 的语法上，补齐了变量、嵌套、mixin、函数、继承、控制流和现代模块系统。浏览器不认识 Sass，所有代码都要先编译成 CSS。

当前官方主力实现是 Dart Sass，版本 1.101.0；老的 LibSass 和 Ruby Sass 都已停止维护。

今天顺序：定位与两种语法 → 变量嵌套 → & 父选择器 → mixin/@content → 函数 → @extend 与占位符 → 控制流 → 模块系统 @use/@forward → @import 弃用 → 内置模块与两大迁移 → 选型 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# Sass 是什么

一门**编译成 CSS** 的样式表语言（CSS 预处理器）：

<v-clicks>

- 在兼容 CSS 的语法上加**变量/嵌套/mixin/函数/继承/模块**
- 浏览器**不认识** Sass，必须先编译成普通 CSS
- 两种语法：**SCSS**（`.scss`，CSS 超集）+ **缩进语法**（`.sass`）
- 抽象都在**编译期**求值消除，产物是零运行时开销的 CSS
- 当前实现 **Dart Sass 1.101.0**；LibSass / Ruby Sass 已 EOL

</v-clicks>

<div v-click class="mt-4 text-sm">

> 心智：Sass 是「给 CSS 加了编程能力的编译期语言」——工程化在构建时，跑起来还是纯 CSS。

</div>

<!--
Sass 全称 Syntactically Awesome Style Sheets，定位是 CSS 预处理器。

它不改变 CSS 的运行方式，而是在写样式这一层提供工程化能力：变量、嵌套、混入、函数、继承、控制流、模块化。写好的代码经 Dart Sass 编译成标准 CSS。

它有两种语法，功能完全等价：SCSS 用花括号和分号，是 CSS 的超集，最流行；缩进语法用缩进代替花括号，是 Sass 最早的语法。

关键心智：所有抽象都在编译期消除，浏览器最终只加载干净 CSS，没有任何运行时负担。这也是它和 CSS 原生变量、CSS-in-JS 的根本区别。
-->

---

# 两种语法：SCSS vs 缩进语法

```scss
/* SCSS（.scss）—— 花括号 + 分号，CSS 超集，最流行 */
@mixin button-base {
  display: inline-flex;
  &:hover { cursor: pointer; }
}
```

```sass
// 缩进语法（.sass）—— 缩进代替花括号、换行代替分号
=button-base
  display: inline-flex
  &:hover
    cursor: pointer
```

<div v-click class="mt-3 text-sm">

> 二者**功能等价**。SCSS 兼容 CSS、可把 `.css` 直接改名起步，是默认选择；缩进语法更精简，mixin 定义用 `=`、引入用 `+`。

</div>

<!--
Sass 提供两种书写语法，功能完全一样，只是形式不同。

SCSS 是 CSS 的超集，几乎所有合法 CSS 都是合法 SCSS，所以最容易上手、最流行，可以把现有 css 文件直接改名 scss 起步。

缩进语法是 Sass 最早的语法，用缩进层级代替花括号、换行代替分号，风格类似 Python，更精简。它里面 mixin 定义用等号、引入用加号。

除非团队特别偏好缩进风格，默认选 SCSS。本次分享全部用 SCSS。
-->

---

# 变量与嵌套：最基础的两块

```scss
$primary: #cc6699;      // 变量：$ 开头，编译期求值并消除
$radius: 8px;

.card {
  background: $primary;
  border-radius: $radius;
  &__title { font-weight: bold; }   // → .card__title
  &:hover  { filter: brightness(1.05); }  // → .card:hover
}
```

<v-clicks>

- **变量** `$x`：编译后从产物**消失**，不是 CSS 里的 `--x`
- **嵌套**：选择器按结构层层写，编译展开成后代选择器
- `&` 是**父选择器**，拼后缀 / 伪类都靠它

</v-clicks>

<!--
先看最基础的两块：变量和嵌套。

变量以美元符号开头，写法像属性声明。它是编译期的，编译后从最终 CSS 里彻底消失，看不到美元符号。这和 CSS 自定义属性 --x 根本不同，后者会保留在输出里、运行时可变。

嵌套让选择器贴合 HTML 结构，编译器自动展开成后代选择器，省去反复写父选择器前缀。

嵌套里最灵活的是 & 父选择器，它指代外层选择器。这个例子里 &__title 展开成 .card__title，&:hover 展开成 .card:hover。下一页详细看 &。

提醒一点：嵌套别太深，一般不超过三层，否则生成的选择器又长、特异性又高、和结构耦合太死。
-->

---

# `&` 父选择器：嵌套里最灵活的一环

```scss
.button {
  &:hover     { opacity: .8; }   // → .button:hover      伪类
  &__icon     { margin: 4px; }   // → .button__icon      BEM 元素
  &--primary  { background: royalblue; } // → .button--primary  修饰符
  [dir=rtl] & { margin-left: 8px; }      // → [dir=rtl] .button 反转上下文
  &.is-active { font-weight: bold; }     // → .button.is-active 组合
}
```

<div v-click class="mt-3 text-sm">

> ⚠️ `&` 只能放在复合选择器**开头**（`span&` 非法，因为 `&` 可能是 `h1` 类型选择器）。样式规则**外** `&` 为 `null`，可用于写「选择器内外通用」的 mixin。

</div>

<!--
& 指代外层选择器，编译时被替换成它。这是 Sass 嵌套里最灵活的部分，主要四类用法。

第一，拼接伪类，&:hover 变成 .button:hover。第二，BEM 后缀，&__icon 变成 .button__icon，&--primary 变成 .button--primary，这是 Sass 写 BEM 的经典手法。第三，把 & 放后面反转上下文，[dir=rtl] & 变成 [dir=rtl] .button。第四，与其它选择器组合，&.is-active 变成 .button.is-active。

两个坑要记住：& 只能放在复合选择器开头，span& 是非法的，因为 & 可能被替换成 h1 这种类型选择器。另外在任何样式规则之外使用，& 的值是 null，这个特性可以用来写既能在选择器内、也能在顶层的 mixin。
-->

---

# `@mixin` / `@include`：复用样式块

```scss
// 定义：$radius 有默认值 → 可选参数
@mixin square($size, $radius: 0) {
  width: $size;
  height: $size;
  border-radius: $radius;
}

.avatar { @include square(48px, $radius: 8px); } // 关键字参数
.thumb  { @include square(64px); }               // 省略取默认 0
```

<v-clicks>

- 默认值可为任意表达式、可引用前面的参数
- **关键字参数**（`$radius: 8px`）：按名传、可读、可跳过中间参数
- 可变参数 `$args...` 收集多个实参为列表

</v-clicks>

<!--
mixin 是 Sass 最核心的复用机制，用 @mixin 定义一段可复用样式，用 @include 引入。

参数可以有默认值，比如 $radius 冒号 0，这让它成为可选参数，调用时不传就取默认。默认值可以是任意表达式，甚至能引用前面的参数。

调用时可以用关键字参数，按名字传，比如 $radius 冒号 8px，可读性好，还能跳过中间有默认值的参数。

参数名后面跟三个点是可变参数，能收集调用时多余的位置实参成一个列表。反过来把三个点放在调用处的实参上，是把列表展开成多个实参。
-->

---

# `@content`：把样式块传进 mixin

```scss
@mixin on-hover {
  &:not([disabled]):hover { @content; }  // 占位，接收传入的样式块
}

.button {
  @include on-hover {
    border-width: 2px;   // 这段被塞进 @content 位置
  }
}
```

<div v-click class="mt-3 text-sm">

> 进阶：`@content($type)` 可给内容块**传参**，调用端用 `using ($type)` 接收——常用于把媒体类型等上下文传进外部样式。

</div>

<!--
mixin 里的 @content 是一个占位，用来接收 @include 调用时以花括号传入的样式块。

这个例子里，on-hover 这个 mixin 包裹了 hover 逻辑，调用时传入的 border-width 2px 会被塞进 @content 的位置，最终展开成 hover 时边框变粗。这让 mixin 能包裹调用方传入的动态样式，非常灵活。

进阶用法是内容块传参：mixin 用 @content 括号 $type 传出值，调用端用 using 括号 $type 声明接收。常见场景是响应式 mixin，把当前媒体类型传进内容块里，让内容块根据类型做不同处理。
-->

---

# `@function` / `@return`：算值，不出样式

```scss
@use 'sass:math';

@function rem($px, $base: 16px) {
  @return math.div($px, $base) * 1rem;   // @return 立即结束并返回
}

.title { font-size: rem(24px); }   // → 1.5rem
```

| | `@function` | `@mixin` |
| --- | --- | --- |
| 产物 | 一个**值**（用于表达式） | 一段**样式声明** |
| 关键字 | `@return` | `@content`（可选） |

<div v-click class="text-sm">

> ⚠️ 函数名拼错**不报错**——会被当普通 CSS 函数原样输出，建议对产物跑 CSS lint。

</div>

<!--
函数用于计算并返回一个值，供表达式使用。用 @function 定义，@return 返回。这个 rem 函数把 px 换算成 rem，@return 会立即结束函数并返回结果。

函数和 mixin 的根本区别：函数算一个值，用在表达式里，比如 font-size 冒号 rem 括号 24px；mixin 产出一段样式声明，用 @include 展开。一句话：函数算值、mixin 出样式。官方建议函数只用来算值，别在函数里搞样式副作用。

一个坑：如果调用了 Sass 不认识的函数，比如把 math.div 拼错，Sass 会把它当成普通 CSS 函数原样输出，而且不报错。所以建议对编译产物跑一遍 CSS lint 兜底。
-->

---

# `@extend` 与占位符 `%`：继承

```scss
%card-base {                 // 占位符：只在被 @extend 时才输出
  border-radius: 8px;
  box-shadow: 0 1px 3px #0002;
}

.product-card { @extend %card-base; }
.user-card    { @extend %card-base; }
/* 输出：.product-card, .user-card { border-radius: 8px; ... } */
```

<v-clicks>

- `@extend` **不复制样式**，而是把选择器**并入**目标规则
- 占位符 `%foo` 自身不产出 CSS，是纯复用**基座**
- `-`/`_` 开头的占位符是私有的，只能本文件 `@extend`

</v-clicks>

<!--
@extend 是第三种复用机制，让一个选择器继承另一个的样式。它的关键特点是不复制样式，而是把当前选择器并入被继承者的选择器列表。

占位符选择器以百分号开头，专为被 @extend 而生：它自身不会出现在编译后的 CSS 里，只有被继承时样式才附着到继承它的选择器上。这个例子里，%card-base 不会单独输出，最终产物是 .product-card 逗号 .user-card 共享一条声明。

这样可以定义可复用的样式基座，又不产生无用的类。以连字符或下划线开头的占位符是私有的，只能在定义它的文件内被 @extend。
-->

---

# `@extend` 的限制与取舍

```scss
.x {
  @extend .a.b;    // ❌ 只能扩展简单选择器（不能复合/后代）
  @extend .maybe !optional;  // 目标不存在时不报错
}
@media screen {
  .z { @extend .error; }     // ❌ 不能跨 @media 继承外部规则
}
```

| 场景 | 用 `@extend` | 用 `@mixin` |
| --- | --- | --- |
| 语义「A 是一种 B」 | ✅ | |
| 需要传参数 | | ✅ |
| 跨 `@media` | ❌ 不能 | ✅ |
| 隐式牵连全局 | 有风险 | 无 |

<!--
@extend 虽好，但有三个限制要记住。

第一，只能扩展简单选择器，扩展复合选择器 .a.b 或后代选择器 .p .q 都会报错。第二，目标选择器不存在会报错，加 !optional 可以容忍。第三，不能跨 @media 边界去继承外部规则。

怎么取舍？看这张表。存在「A 是一种 B」的语义关系、且不需要参数，用 @extend，产物更紧凑。需要传参、想独立不耦合、或涉及 @media，用 mixin。

官方特别提醒：现代压缩算法对重复 CSS 处理得很好，不要单纯为了省字节硬上 @extend。很多团队因为 @extend 会隐式牵连所有出现被继承选择器的地方、行为不可预测，而更偏向 mixin。
-->

---

# 控制流：`@if` / `@each`

```scss
@mixin text($theme) {
  @if $theme == dark { color: #eee; }
  @else if $theme == light { color: #222; }
  @else { color: gray; }
}

$colors: ("primary": #cc6699, "danger": #c62828);
@each $name, $color in $colors {   // map 解构键值对
  .text-#{$name} { color: $color; }
}
```

<div v-click class="mt-2 text-sm">

> `@if`/`@else if`/`@else` 条件分支；`@each` 遍历列表或 map（用两个变量解构键值）。除 `false`/`null` 外都视为真。别混：`if($c, $a, $b)` 是返回值的**三元函数**。

</div>

<!--
Sass 有四条流控 at-rule，先看 @if 和 @each。

@if、@else if、@else 是条件分支，语义和常见语言一样。注意 Sass 里除了 false 和 null，其它值都视为真，包括 0、空字符串、空列表。

@each 遍历列表的每个元素，或者 map 的每个键值对。对 map 迭代时用两个变量解构出键和值，这是按配置批量生成工具类最常用的套路。这个例子遍历颜色 map，生成 .text-primary、.text-danger 这样一组类。注意循环里几乎都要用井号花括号插值，把值插进选择器名。

还要区分：@if 是控制样式是否输出的语句；而 if 括号条件逗号 a 逗号 b 是一个内置函数，像三元表达式一样返回一个值，两者用途不同。
-->

---

# 控制流：`@for` / `@while`

```scss
@use 'sass:math';

// through 含终点 → 1,2,3
@for $i from 1 through 3 {
  .col-#{$i} { width: math.percentage(math.div($i, 3)); }
}

// to 不含终点 → 1,2
@for $i from 1 to 3 { .order-#{$i} { order: $i; } }
```

<div v-click class="mt-3 text-sm">

> ⚠️ `through` 是**闭区间**（含终点），`to` 是**半开区间**（不含终点）——最容易记混。`@while` 能力最强但可读性差，多数场景 `@each`/`@for` 就够，少用。

</div>

<!--
再看 @for 和 @while。

@for 按数值范围循环，有两种边界形式，区别只在是否包含终点。from 1 through 3 遍历 1、2、3，包含 3；from 1 to 3 只遍历 1、2，不包含 3。这是最容易记混的点：through 是闭区间，to 是半开区间。想「到 N 为止都要」用 through。

这个例子用 @for 配合 math.div 和 math.percentage 生成三列栅格的宽度。注意实际文件里要先 @use sass:math。

@while 在条件为真时反复执行，能力最强，但也最容易写出难读甚至死循环的代码。它能表达的绝大多数场景，@each 或 @for 都能更清晰地表达，所以少用，只在步进不规则或终止条件复杂时才考虑。
-->

---

# 实战：一份 map 驱动一套工具类

```scss
$spacers: (0: 0, 1: 4px, 2: 8px, 3: 16px, 4: 24px);

@each $key, $val in $spacers {
  .m-#{$key}  { margin: $val; }
  .mt-#{$key} { margin-top: $val; }
  .px-#{$key} { padding-left: $val; padding-right: $val; }
}
```

<div v-click class="mt-3 text-sm">

> map + `@each` + 插值 `#{}` = 设计系统工具类的标准做法。改设计令牌只需改 map，几十个一致的类自动生成——这正是 Sass 相对手写 CSS 的工程化价值。

</div>

<!--
把 map、@each、插值组合起来，是生成设计系统工具类的标准做法，也是 Sass 工程化价值最直观的体现。

这个例子定义了一份间距令牌 map，从 0 到 4 对应不同的像素值。用 @each 遍历它，一次生成 margin、margin-top、水平 padding 三组工具类，一共十几个类。

关键在于：所有间距的真相都集中在这一份 map 里。设计要调整间距，只改 map 就行，所有工具类自动跟着变，保证一致性。这就是 Sass 相对手写 CSS 的核心优势——用数据驱动样式，而不是手工重复。
-->

---

# 模块系统：`@use` 带命名空间加载

```scss
// _corners.scss
$radius: 8px;
@mixin rounded { border-radius: $radius; }

// style.scss
@use 'corners';            // 命名空间默认 = 文件名
.button {
  @include corners.rounded;
  padding: corners.$radius;
}
```

<v-clicks>

- `@use 'x' as c`：自定义命名空间；`as *`：并入全局（慎用）
- 每个模块**只加载一次**（对比 `@import` 每次都执行输出）
- `@use` 须在文件开头、URL 带引号

</v-clicks>

<!--
2019 年 Sass 引入了模块系统，用 @use 和 @forward 取代 @import。先看 @use。

@use 加载另一个 Sass 文件，它的成员默认以命名空间方式访问，命名空间取文件名。这个例子里，访问 corners 模块的 mixin 是 corners.rounded，访问变量是 corners.$radius。你一眼就能看出成员来自哪个模块，这和 @import 把成员一股脑塞进全局根本不同。

可以用 as 改命名空间，用 as 星号并入全局、不带前缀，但 as 星号要慎用，官方建议只对自己写的文件用，否则第三方库新增同名成员会冲突。

还有个关键改进：无论一个模块被多少文件 @use，它只被加载执行一次，CSS 只输出一次。另外 @use 必须写在文件开头，URL 要带引号。
-->

---

# `@use` 配置、私有成员

```scss
// _library.scss
$-secret: #123456;          // 私有：-/_ 开头，外部拿不到
$black: #000 !default;      // 公开、可配置

// style.scss —— as 必须在 with 之前
@use 'library' as lib with ($black: #222);
```

<v-clicks>

- **私有成员** `-`/`_` 前缀：只在本文件可用，不进公共 API
- **`with`** 配置库里带 `!default` 的变量；⚠️ `as` 在 `with` **之前**
- 模块**只在首次加载时**接受配置，重复配置同一模块会报错

</v-clicks>

<!--
继续看 @use 的两个能力：私有成员和配置。

以连字符或下划线开头的成员是私有的，比如 $-secret，它在定义它的文件里照常使用，但不会成为模块公共 API，@use 或 @forward 的人访问不到。这是模块系统独有的封装能力，@import 做不到。

配置用 with 子句：库内用 !default 给默认值，使用方在 @use with 里传新值覆盖。注意两个约束：第一，既要自定义命名空间又要配置时，as 必须写在 with 之前，反了会报错。第二，一个模块只在首次加载时接受配置，如果它已经被某文件配置过，另一处再配置同一模块会报错，配置一次定终身，保证状态一致。
-->

---

# `@forward`：转发，搭建库入口

```scss
// src/_index.scss —— 库入口，把子模块转发给下游
@forward 'list';
@forward 'table' show table-base;   // 白名单
@forward 'list' as list-*;          // 批量加前缀 reset→list-reset
@forward 'theme' with ($radius: .5rem !default); // 改默认、留可覆盖

// 使用方只需 @use 一个入口
@use 'src';   // → src.table-base()、src.list-reset() ...
```

<div v-click class="mt-2 text-sm">

> `@forward` 把公共成员转发给**下游**（当前文件不直接可用）。修饰：`show`/`hide` 控制范围、`as prefix-*` 加前缀、`with (... !default)` 改上游默认且留下游可覆盖。

</div>

<!--
@forward 是模块系统的另一半，用来搭建库入口。

它像 @use 一样加载模块，但作用是把模块的公共成员转发给下游使用者，让别人 @use 你这个文件时，能像用你自己定义的成员一样用被转发的成员。注意被 forward 的成员在当前文件里并不直接可用，要用得再单独 @use。

典型场景是库入口文件：把分散在多个子文件的公共 API 汇聚成一个入口，使用方只 @use 一个入口就行。

它有几个修饰：show 是白名单、hide 是黑名单，控制转发范围；as prefix 星号给成员批量加前缀，避免子模块命名冲突；with 配置里可以带 !default，这是它区别于 @use with 的独特能力——中间层既能改上游默认值，又允许更下游继续覆盖。
-->

---

# ⚠️ `@import` 已弃用：时间线

<div class="grid grid-cols-2 gap-4 mt-4">
<div>

**时间线**

<v-clicks>

- **1.80.0** 起弃用（博客《@import is Deprecated》2024-10）
- 计划 **3.0.0** 移除（只给版本号，无具体日期）
- 现仍可用但**打弃用告警**，新代码一律 `@use`
- 官方 `sass-migrator` 可自动迁移

</v-clicks>

</div>
<div>

**弃用的 5 大理由**

<v-clicks>

- 全部成员**全局**，难追踪、易冲突
- 逼库作者手动加**前缀**防碰撞
- `@extend` **全局化**、不可预测
- 每次引入都**重复执行输出** CSS
- 无法定义**私有成员**与占位符

</v-clicks>

</div>
</div>

<!--
这是本次分享的重点：@import 已经弃用。准确的时间线要记清楚。

Dart Sass 1.80.0 起，@import 被正式弃用，对应官方博客那篇《@import is Deprecated》，2024 年 10 月发布，触发门槛是 Dart Sass 使用份额越过 80%。官方计划在 Dart Sass 3.0.0 从语言中移除它，注意官方只给了版本号，没有承诺具体日历日期。现阶段仍可用，但编译会打弃用告警，新代码应一律用 @use 和 @forward。

官方列了弃用的五大理由，正好对应模块系统解决的痛点：一，让所有成员全局可访问，难以追踪定义在哪、易冲突；二，逼库作者手动加长前缀防碰撞；三，让 @extend 全局化、样式继承不可预测；四，每次 @import 都重复执行并输出 CSS，拖慢编译、膨胀产物；五，没法定义私有成员和不可访问的占位符。

不用手工改，官方提供 sass-migrator 工具可以自动把 @import 代码转成 @use。
-->

---

# 内置模块：Sass 的标准库

| 模块 | 职责 | 代表函数 |
| --- | --- | --- |
| `sass:math` | 数值 | `math.div`、`math.round`、`math.percentage` |
| `sass:color` | 颜色 | `color.adjust`、`color.scale`、`color.mix` |
| `sass:string` | 字符串 | `string.slice`、`string.to-upper-case` |
| `sass:list` | 列表 | `list.nth`、`list.append`（不可变、1-based） |
| `sass:map` | 映射 | `map.get`、`map.has-key`、`map.merge` |
| `sass:meta` | 元编程 | `meta.keywords`、`meta.load-css` |

<div v-click class="mt-2 text-sm">

> 前缀统一 `sass:`，都用 `@use 'sass:xxx'` 加载、命名空间调用。全局别名逐步弃用；例外：颜色构造器 `rgb()`/`hsl()`/`hwb()` 仍仅全局。

</div>

<!--
Sass 的标准库被组织成内置模块，前缀统一是 sass 冒号，一共七个，这里列了最常用的六个，还有一个 sass:selector 管选择器引擎。

math 管数值运算，color 管颜色，string 管字符串，list 管列表，map 管映射，meta 管元编程。

它们都通过 @use 加载，比如 @use sass:math，然后用命名空间调用 math.round。要注意列表和映射是不可变的，函数都返回新值，索引是从 1 开始的。

历史上这些函数都有全局名，进入模块系统后官方推荐统一走命名空间，并会逐步弃用大部分全局别名。有个例外：颜色构造器 rgb、hsl、hwb 因为要处理特殊的 CSS 函数语法，被有意保留为仅全局函数，不进命名空间。
-->

---

# 两大迁移：`math.div` 与 `color.adjust`

```scss
@use 'sass:math';
@use 'sass:color';

// ❌ $w / 2         → ✅
$half: math.div($w, 2);
// ❌ darken($c, 20%) → ✅
$dark: color.scale($c, $lightness: -20%);
```

<v-clicks>

- **`/` 作除法**（1.33.0 弃用）：因与 CSS 简写 `font: 16px/1.5` 歧义 → `math.div()`
- **旧全局颜色函数** `darken`/`lighten`/`saturate`…（1.79.0 弃用）→ `color.adjust` / `color.scale`
- LibSass 已 **EOL**、`node-sass` EOL → 一律用 **Dart Sass**（`sass` 包）

</v-clicks>

<!--
迁移老代码时，除了 @import，还有两大高频迁移。

第一是除法。斜杠作为除法运算符自 1.33.0 起弃用，根本原因是斜杠在 CSS 里本身就有语义，用于分隔简写属性的值，比如 font 16px 斜杠 1.5、aspect-ratio 16 斜杠 9。继续把斜杠当除法就会歧义。所以现代 Sass 一律用 math.div 做除法。

第二是颜色。darken、lighten、saturate、desaturate、adjust-hue 这些全局颜色函数自 1.79.0 起弃用，官方认为 darken 这种线性减亮度通常不是让颜色变暗的最佳方式，改用 color.scale 或 color.adjust 更可控。

还有实现层面：LibSass 和它的 Node 绑定 node-sass 都已 EOL，Ruby Sass 更早废弃。凡是搜到基于 node-sass 的教程都视为过时，一律换成 Dart Sass 的 sass 包。
-->

---

# 选型：Sass vs Less vs PostCSS vs CSS 变量

| 维度 | Sass | Less | PostCSS | CSS 变量 |
| --- | --- | --- | --- | --- |
| 类型 | 预处理器 | 预处理器 | 后处理平台 | 原生运行时 |
| 变量 | `$x` 编译期 | `@x` 编译期 | 靠插件 | `--x` 运行时 |
| 逻辑 | 强 | 中 | 看插件 | 无 |
| 运行时动态 | 无 | 无 | 无 | **有** |

<div v-click class="mt-3 text-sm">

> 要成熟全能的样式工程化 → **Sass**；更轻/Less 生态 → **Less**；按标准转换（加前缀/降级新语法）→ **PostCSS**（常与 Sass **叠用**）；运行时随主题变的值 → **CSS 变量**（与 Sass **互补**）。

</div>

<!--
最后是选型。Sass、Less、PostCSS、CSS 变量常被拿来比，但定位不同。

Sass 和 Less 都是预处理器，变量都在编译期消除，Sass 逻辑能力更强，有完整的 mixin、函数、控制流、模块系统。PostCSS 严格说是后处理平台，本身不规定语法，靠插件生态做转换，比如 Autoprefixer 加前缀、把未来 CSS 语法降级。CSS 自定义属性是浏览器原生的运行时特性，不需要构建，最大特点是运行时可变、能随元素和主题动态切换。

选型一句话：要成熟全能的样式工程化，团队也熟，选 Sass；想更轻或已在 Less 生态，选 Less；要按标准做转换，选 PostCSS，而且它常和 Sass 叠用，Sass 编译加 PostCSS 后处理；要运行时随主题动态变化的值，用 CSS 变量，它和 Sass 是互补关系，不是二选一。
-->

---
layout: intro
---

# 总结

Sass = **给 CSS 加了编程能力的编译期预处理器**

- 两种语法：SCSS（`.scss`，CSS 超集）/ 缩进（`.sass`）；实现认准 **Dart Sass 1.101.0**
- 复用三件套：`@mixin`（出样式）/ `@function`（算值）/ `@extend`+`%`（并选择器）
- 控制流 `@if`/`@each`/`@for`/`@while` + 插值 `#{}` = 数据驱动样式
- 模块系统 `@use`/`@forward`（命名空间/私有/`with`）**取代 `@import`**（1.80 弃用、3.0 移除）
- 两大迁移：`/`→`math.div`、`darken`→`color.adjust`/`color.scale`

<!--
总结一下。Sass 是给 CSS 加了编程能力的编译期预处理器，抽象都在构建时消除，产物是干净 CSS。

第一，两种语法：SCSS 是 CSS 超集、最流行，缩进语法更精简；实现认准 Dart Sass，LibSass 已 EOL。

第二，复用三件套：mixin 产出样式、function 计算返回值、@extend 加占位符合并选择器，按语义和可控性选，别只为省体积上 @extend。

第三，控制流加插值，让一份 map 驱动出一整套一致的工具类，这是 Sass 的工程化价值。

第四，也是最重要的：现代 Sass 用模块系统 @use 和 @forward 取代 @import，带命名空间、私有成员、单次加载、可配置默认值。@import 已在 1.80.0 弃用、计划 3.0.0 移除。

第五，迁移老代码盯两处：斜杠除法改 math.div，darken lighten 改 color.adjust 或 color.scale。

Sass 用编译期的编程能力，让 CSS 真正可工程化。谢谢大家。
-->
