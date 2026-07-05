---
theme: seriph
background: https://cover.sli.dev
title: Welcome to PostCSS
info: |
  Presentation PostCSS —— 用 JavaScript 插件转换 CSS 的工具 / AST 平台。

  Learn more at [https://postcss.org](https://postcss.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎨</span>
</div>

<br/>

## PostCSS —— 用 JavaScript 转换 CSS 的工具

不是语言、不是预处理器，而是「CSS → AST → 插件 → CSS」的转换平台，当前 v8.5

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/postcss/postcss" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 PostCSS —— 一个被高频误解的工具。很多人第一次见它，会把它归到 Sass、Less 那一档，以为又是个预处理器。这是最需要先纠正的。

官方对它的定义只有一句：A tool for transforming CSS with JavaScript，用 JavaScript 转换 CSS 的工具。它不是新语言、不是预处理器、也不是框架，而是一个把 CSS 解析成 AST、交给 JS 插件遍历修改、再输出回 CSS 的转换平台。

版本背景：当前稳定版 8.5.16，2026 年 6 月发布，8.x 大版本已稳定多年，插件生态极其庞大。

今天的顺序：定位澄清 → 工作原理 → AST 与节点 → 插件机制 → 主流插件 → 配置与集成 → 与预处理器和原子化的边界 → 误区与选型 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么会有 PostCSS？

只写标准 CSS，兼容与优化交给构建期插件：

<v-clicks>

- 自动加浏览器前缀，不再手写 `-webkit-`
- 提前用未来 CSS 语法，自动降级兼容
- 生产压缩、内联 `@import`、校验规范
- 用 JS 就能写自定义 CSS 转换

</v-clicks>

<div v-click class="mt-6">

但要认清它的边界：

- **本体几乎什么都不做**——全靠插件
- 它是平台，不是「装上就自动生效」的功能包

</div>

<!--
为什么会有 PostCSS？核心动机是把「兼容与优化」这类脏活从手写里解放出来。你只写标准 CSS，加前缀、降级未来语法、压缩、内联 import、校验这些都交给构建期的插件自动完成。而且写插件用的是 JavaScript，前端团队零门槛就能定制自己的 CSS 转换。

但必须认清边界：PostCSS 本体几乎什么都不做，它只提供解析、遍历、序列化的骨架，真正干活的全是插件。它是平台不是功能包，不配插件基本就是原样输出。这是理解它最关键的一点，后面会反复强调。
-->

---

# 核心澄清：它不是预处理器

三句话记住 PostCSS 到底是什么：

<v-clicks>

- **不是语言**：不发明新语法，输入就是标准 CSS
- **不是预处理器**：预处理器是「新语法→编译成 CSS」的单向编译器；PostCSS 是「CSS→AST→插件→CSS」的**通用转换平台**
- **本体什么都不做**：只提供骨架，真正干活的是插件

</v-clicks>

<div v-click class="mt-6 text-center text-lg">

💡 PostCSS 之于 CSS ≈ **Babel 之于 JavaScript**

一个把源码解析成 AST、让插件转换、再输出的平台

</div>

<!--
把最核心的澄清单独放一页。三句话：

第一，PostCSS 不是语言，它不发明任何新语法，你喂给它的就是标准 CSS。

第二，它不是预处理器。预处理器像 Sass、Less，是把新语法单向编译成 CSS 的编译器；而 PostCSS 是通用转换平台，输入输出都是 CSS，中间经过 AST，能做的事远不止预处理——既能做预处理器式的嵌套，也能做后处理的加前缀压缩，还能做校验。

第三，也是最容易忽略的：PostCSS 本体几乎什么都不做，一切靠插件。

一个最好的类比：PostCSS 之于 CSS，约等于 Babel 之于 JavaScript。都是把源码解析成 AST、让插件转换、再输出的平台。记住这个类比，后面所有内容都好理解了。
-->

---

# 工作原理：三段式管线

```text
   CSS 字符串
      │  ① 解析 tokenizer 切 token → parser 建树
      ▼
  AST（Root / Rule / Declaration / AtRule / Comment）
      │  ② 转换 各插件遍历 AST，增删改节点
      ▼
   改后的 AST
      │  ③ 序列化 stringifier 遍历还原
      ▼
   CSS 字符串（+ source map）
```

<div v-click class="mt-3 text-sm">

> ⚠️ 官方架构文档：**tokenize（切 token）约占处理耗时 90%**，是被重度优化的热点——这也是它刻意把 tokenize 与 parse 分成两层的原因（优化热点 + 保持代码清晰）。

</div>

<!--
PostCSS 的处理管线是三段式，非常清晰。

第一步解析：tokenizer 把 CSS 字符串切成一串 token，parser 再把 token 组装成 AST 抽象语法树。注意 parser 是在 token 上工作，不是直接啃字符串。

第二步转换：Processor 调度所有插件遍历这棵 AST，插件找到目标节点后读改、替换、克隆或删除。

第三步序列化：stringifier 从根节点遍历，把改后的 AST 还原成 CSS 文本，并生成 source map。

一个有意思的架构细节：官方文档明确指出 tokenize 这一步约占整体处理耗时的 90%，是最热的一步。所以 PostCSS 刻意把 tokenize 和 parse 分成两层——这样能对最慢的 tokenize 做重度性能优化，同时让 parser 代码保持清晰。这是一次典型的性能与可维护性的分层取舍。
-->

---

# AST：五种核心节点

一段 CSS 会解析成以 `Root` 为根的节点树：

```css
.btn { color: red !important; }
@media (min-width: 600px) { .btn { color: blue } }
```

<div class="text-sm mt-2">

| 节点 | 代表 | 关键字段 |
| --- | --- | --- |
| `Root` | 整棵树根 | `nodes` |
| `Rule` | `.btn { … }` | `selector` + 声明子节点 |
| `Declaration` | `color: red` | `prop`、`value`、`important` |
| `AtRule` | `@media …` | `name`、`params` |
| `Comment` | `/* … */` | `text` |

</div>

<!--
理解 PostCSS 的关键是理解它的 AST 节点，一共五种核心类型。

以这段 CSS 为例。整份样式表是 Root 节点。点 btn 那条规则是 Rule 节点，它有个 selector 字段是点 btn，内部的声明是它的子节点。color 冒号 red 这条声明是 Declaration 节点，用 prop 存属性名 color、value 存值 red、important 存是否有叹号 important。at media 是 AtRule 节点，用 name 存 media、params 存括号里的媒体条件。注释是 Comment 节点，用 text 存内容。

写插件时最常操作的就是 Declaration 的 prop 和 value。比如一个把所有颜色改红的插件，核心就一句 decl.value 等于 red。记住这五种节点和它们的关键字段，写插件就有了地图。
-->

---

# 节点体系：Node 与 Container

```text
Node（所有节点基类）
├─ type / parent / source / raws
├─ clone() / remove() / replaceWith()
│
└─ Container（能容纳子节点，继承 Node）
   ├─ nodes / each() / walk()
   ├─ append() / prepend() / insertBefore()
   │
   ├─ Root · Rule · AtRule   ← 容器
   └─ （叶子）Declaration · Comment
```

<v-clicks>

- **通用能力在 `Node`**：任何节点都能 `remove` / `replaceWith` / `clone`
- **容器能力在 `Container`**：只有 Root/Rule/AtRule 有 `nodes`、能 `walk`、能 `append`
- `Declaration` / `Comment` 是**叶子**，没有子节点

</v-clicks>

<!--
节点分两大类，理解继承关系能让你知道哪个节点有哪些方法。

Node 是所有节点的基类，提供通用能力：type 类型、parent 父节点、source 源码位置、raws 原始格式，以及 clone 克隆、remove 删除、replaceWith 替换这些方法。任何节点都有这些。

Container 继承自 Node，是能容纳子节点的节点的基类，额外有 nodes 子节点数组、each 和 walk 遍历、append prepend insertBefore 增删子节点。

关键点：只有 Root、Rule、AtRule 是 Container，它们才有 nodes、才能 walk 遍历、才能 append 子节点。而 Declaration 和 Comment 是叶子节点，没有子节点，对它们调 walkDecls 是没意义的。搞清楚这个继承体系，写插件时就不会调错方法。
-->

---

# 最小用法：Node API + 配置

<div class="grid grid-cols-2 gap-4">
<div>

**Node API（底层）**

```js
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

const result = await postcss([autoprefixer])
  .process(css, { from: undefined });

console.log(result.css);
```

</div>
<div>

**postcss.config.js（日常）**

```js
export default {
  plugins: [
    autoprefixer(),
    cssnano(),
  ],
};
```

</div>
</div>

<div v-click class="mt-4 text-sm">

> `postcss([...plugins]).process(css)` 返回**惰性** `LazyResult`——取 `result.css` / `await` 时才真正跑，支持异步插件。日常用构建工具时只写 `postcss.config.js`。

</div>

<!--
PostCSS 的核心入口就一句：postcss 传插件数组构造 processor，再点 process 传入 CSS 和选项。左边是底层 Node API 写法，process 的 from 选项用于 source map 和报错定位，最后从 result.css 取转换后的 CSS。

但日常开发几乎不直接写这段，构建工具帮你封装了。你只需在项目根目录放一个 postcss.config.js，导出一个对象，用 plugins 声明要启用的插件。右边这样。

一个进阶细节：process 返回的不是立即算好的结果，而是一个惰性的 LazyResult，真正的转换推迟到你第一次取 result.css 或 await 时才执行。因为有些插件是异步的，所以优先用 await 取结果最稳妥。
-->

---

# 写一个插件：标准结构（PostCSS 8）

```js
// 把所有 color 值改成 red 的最小插件
const plugin = (opts = {}) => {
  return {
    postcssPlugin: 'to-red',   // 插件名（必填）
    Declaration(decl) {        // 访问器：遇每个声明回调
      if (decl.prop === 'color') {
        decl.value = 'red';
      }
    },
  };
};
plugin.postcss = true;         // 标记这是 PostCSS 插件（必填）
export default plugin;
```

<div v-click class="mt-3 text-sm">

> 三要素：**函数返回对象** + `postcssPlugin` **名字** + `plugin.postcss = true` **标记**。对象里挂**访问器**方法。

</div>

<!--
一个现代 PostCSS 8 插件就是一个函数，返回一个对象。这段是把所有颜色改红的最小插件。

三个要素。第一，它是个函数，可以接收 opts 选项，返回一个对象。第二，对象里的 postcssPlugin 字段是插件名，必填，用于报错和调试。第三，在函数上打标记 plugin.postcss 等于 true，告诉 PostCSS 这是个插件，CommonJS 写法是 module.exports.postcss 等于 true。

对象里挂的 Declaration 就是访问器方法，PostCSS 遍历 AST 时，每遇到一个声明节点就回调它。这里判断如果属性名是 color 就把值改成 red。就这么简单，几行 JS 就是一个能用的 PostCSS 插件。
-->

---

# 访问器 visitor：按节点类型回调

<div class="text-sm">

| 进入型（子节点**前**） | 退出型（子节点**后**） | 触发次数 |
| --- | --- | --- |
| `Once` | `OnceExit` | 每轮**一次** |
| `Root` | `RootExit` | 可**多次** |
| `Rule` | `RuleExit` | 每条规则 |
| `Declaration` | `DeclarationExit` | 每条声明 |
| `AtRule` | `AtRuleExit` | 每个 @规则 |

</div>

<v-clicks>

- 进入型 = 前序（深入子树前就地改）；退出型 = 后序（子孙处理完再处理父）
- ⚠️ 只跑一次的逻辑放 `Once`，别放 `Root`（`Root` 可能被 re-visit 多次）

</v-clicks>

<!--
访问器是 PostCSS 8 的核心机制：你按节点类型命名方法，框架在遍历时把对应节点分发给你。

每种节点都有进入型和退出型两个时机。进入型比如 Rule、Declaration，在处理这个节点的子节点之前触发，是前序遍历，适合深入子树前就地修改当前节点。退出型比如 RuleExit、DeclarationExit，在子节点全部处理完之后触发，是后序遍历，适合先让子孙都处理完、再基于结果处理父节点的逻辑。

特别注意 Once 和 Root 的区别：Once 每处理一个文件只触发一次，适合放一次性逻辑；而 Root 在遍历中每遇到 Root 节点触发，由于后面要讲的 re-visit 机制，树被改动后 Root 可能被多次触发。所以需要保证只跑一遍的逻辑，一定放 Once 而不是 Root。
-->

---

# 遍历与节点增删改

<div class="grid grid-cols-2 gap-4 text-sm">
<div>

**主动遍历 walk 系列**

```js
root.walkRules(r => {});
root.walkDecls('color', d => {});
root.walkAtRules('media', a => {});
root.walk(n => {});   // 全部
// each() 只遍历直接子节点
```

</div>
<div>

**增删改（DOM 风格）**

```js
decl.value = 'red';        // 改
decl.replaceWith(node);    // 替换
decl.clone({ value: 'x' });// 复制
decl.remove();             // 删
rule.append({ prop, value });// 增
```

</div>
</div>

<div v-click class="mt-4 text-sm">

> `walkXxx` **递归**深入子孙，可传名字过滤；`each` 只浅层。新建/替换节点后记得**复制 `node.source`**，否则 source map 定位失真。

</div>

<!--
除了被动等访问器回调，容器节点还提供 walk 系列做主动递归查找，旧式插件常这么写。左边：walkRules 遍历所有规则，walkDecls 可以传 color 只遍历属性名是 color 的声明，walkAtRules 传 media 只遍历 at media，walk 遍历全部。注意 walk 系列是递归深入所有子孙，而 each 只遍历直接子节点不递归。

右边是节点的增删改，都是 DOM 风格。改就直接给 value 赋值；替换用 replaceWith；复制用 clone，可以就地覆盖字段；删用 remove 把自己从父节点移除；增用容器的 append，接受节点对象或 prop value 简写。

一个容易漏的点：当你新建或替换节点时，一定要把原节点的 source 字段复制过去，否则生成的 CSS 在 source map 里会丢失来源位置，DevTools 定位和报错都会失真。
-->

---

# 关键坑：re-visit 与死循环

PostCSS 会**重新访问你改过/新增的节点**（让其他插件也能处理）→ 无条件改动会**死循环**：

```js
// ❌ 反例：改动触发 re-visit → 又加一遍 → 死循环
Declaration(decl) {
  decl.cloneBefore({ prop: '-webkit-' + decl.prop });
}
```

<div v-click>

**幂等判重三招**：

```js
if (decl.prop.startsWith('-webkit-')) return;  // 1. 判目标态
const seen = new WeakSet();                     // 2. WeakSet
const DONE = Symbol();                          // 3. 节点挂标记
```

</div>

<div v-click class="mt-2 text-sm">

> ⚠️ 死循环**不会被框架自动救**——判重是**插件作者的责任**。

</div>

<!--
这是写插件最经典的坑。PostCSS 有一条重要语义：你在访问器里改过或新增的节点，会被重新访问，也就是 re-visit，目的是让其他插件和你自己都能处理到这些新内容。这很强大，但埋着陷阱。

看反例：一个无条件给声明加 webkit 前缀的插件，它改动了节点，改动触发 re-visit 再次访问同一节点，又给它加一遍前缀，无限循环。

规避的核心思想是幂等，保证同一节点不会被重复无意义地再处理。三招：第一判目标状态是否已达成，比如属性名已经是 webkit 开头就跳过；第二用 WeakSet 记录处理过的节点对象；第三在节点上挂一个 Symbol 标记，处理过就跳过。

特别强调：PostCSS 不替你判断业务上算不算已处理，re-visit 是它的既定行为，判重是插件作者的责任，框架不会自动救你的死循环。
-->

---
layout: section
---

# 主流插件生态

Autoprefixer · preset-env · nesting · cssnano · import

<!--
讲完了 PostCSS 的原理和插件机制，现在进入最实用的部分：主流插件生态。因为 PostCSS 本体什么都不做，真正让它有价值的就是这些插件。接下来几页逐个拆解最常用的几个：Autoprefixer 加前缀、postcss-preset-env 降级未来 CSS、CSS 嵌套插件、cssnano 压缩、postcss-import 内联。这些基本覆盖了 90% 的日常场景。
-->

---

# Autoprefixer：最流行的加前缀插件

只写标准 CSS，前缀按目标浏览器自动补齐/清理：

```css
/* 输入 */          .box { user-select: none; }
/* 输出 */
.box {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
```

<v-clicks>

- **两大依据**：Can I Use 兼容数据 + **Browserslist** 目标；目标越新前缀越少
- **也会删前缀**：`remove` 默认 `true`，清理已不需要的旧前缀
- 「Google 推荐，Twitter / Alibaba 在用」，装机量最大

</v-clicks>

<!--
Autoprefixer 是 PostCSS 生态装机量最大的插件，一句话：你只写标准无前缀 CSS，前缀交给它按目标浏览器自动补齐和清理。

看例子，输入只写 user-select none，输出自动补上 webkit 和 moz 前缀，具体加哪些取决于你的目标浏览器。

它有两大依据：一是 Can I Use 的兼容性数据，知道哪些属性在哪些浏览器需要前缀；二是 Browserslist 指定的目标浏览器范围。目标越现代，加的前缀越少。

一个常被忽略的能力：它不只会加前缀，也会删。remove 选项默认开启，对当前目标已经不需要的旧前缀会被清理，让输出既不缺也不冗余。官方说它被 Google 推荐，用于 Twitter 和 Alibaba，是 PostCSS 生态的标配。
-->

---

# postcss-preset-env：CSS 版 Babel

用未来 CSS 写代码，按目标浏览器**降级** + 按需 polyfill：

```css
/* 输入：嵌套 + 自定义媒体查询 */
.card { & > .title { color: red; } }

/* 输出：降级成广泛兼容的普通 CSS */
.card > .title { color: red; }
```

<div class="grid grid-cols-2 gap-3 mt-2 text-sm">
<v-clicks>

<div>

**`stage` 特性成熟度**
- `4` 最稳定 → `0` 最实验
- **默认 stage 2**

</div>
<div>

**关键点**
- **内置 autoprefixer**（别再单独装）
- `features` 逐特性开关

</div>

</v-clicks>
</div>

<!--
postcss-preset-env 是 CSS 世界的 Babel preset-env。它让你用未来、现代的 CSS 语法写代码，据目标浏览器把这些语法降级成大多数浏览器能理解的等价写法，并按需引入 polyfill。

看例子，输入用了嵌套语法，输出降级成普通的后代选择器。支持的现代特性还包括自定义媒体查询、自定义选择器、现代颜色函数、逻辑属性等。

两个关键点。stage 是特性成熟度档位，4 最稳定对应 W3C 候选推荐，0 最激进对应早期实验特性，数字越小纳入的实验特性越多风险越高，默认是 stage 2。官方也提示特性很少能推进到 stage 2 以上。

第二个关键点非常重要：preset-env 已经内置了 autoprefixer，所以用了它就别再单独装 autoprefixer，否则重复处理。另外可以用 features 选项逐个特性精细开关。
-->

---

# CSS 嵌套：nesting vs nested

名字极像，遵循**不同规范**，别混用：

<div class="text-sm mt-2">

| | **postcss-nesting** | **postcss-nested** |
| --- | --- | --- |
| 遵循 | 官方 **CSS 嵌套规范**（W3C） | **Sass** 风格宽松语法 |
| `&` | 标准用法，展开可用 `:is()` | Sass 式拼接 `&-active` |
| 定位 | 面向**原生标准**（配 preset-env） | 面向 **Sass 老习惯** |

</div>

```css
.foo { color: red; &:hover { color: green; } }
/* nesting 输出 */
.foo { color: red; }  .foo:hover { color: green; }
```

<div v-click class="text-sm mt-1">

> 想贴原生标准 → `nesting`；想要 Sass 拼接体验 → `nested`。**别同时挂两个**。

</div>

<!--
CSS 嵌套有两个名字极像的插件，但遵循不同规范，选错会得到不一样的展开结果。

postcss-nesting 遵循官方的 W3C CSS 嵌套规范，用 and 符号做嵌套选择器，展开时可能用 is 伪类包裹父选择器来正确处理特异性，它有 2024-02 和 2021 两个 edition，新版默认用 is 并移除了早期草案的 at nest。它面向原生 CSS 标准，可以配合 preset-env。

postcss-nested 则遵循 Sass 风格的更宽松语法，支持 and 减 active 这种 Sass 式拼接。它面向 Sass 老习惯的迁移。

看下面的例子，foo 里嵌套 hover，nesting 展开成两条独立规则。

怎么选：想贴合原生 CSS 标准、未来浏览器原生支持后能平滑去插件，就用 nesting；只是想要 Sass 那种拼接式体验，就用 nested。切记别同时挂两个。
-->

---

# cssnano 压缩 + postcss-import 内联

<div class="grid grid-cols-2 gap-4 text-sm">
<div>

**cssnano —— 模块化压缩器**
- 删注释空白、压颜色、合并规则
- 预设驱动：
  - `default` 安全变换（推荐）
  - `advanced` 激进、有前提
- 生产构建放插件链**最后**

</div>
<div>

**postcss-import —— 内联 @import**
- 构建期把 `@import` 内容合并进来
- 产**单文件**，减运行时请求
- 放插件链**最前**
- Vite **已内置**

</div>
</div>

<div v-click class="mt-4 text-sm">

> 压缩权衡：`default` 任何站点都不改变视觉；`advanced` 压得更狠但需满足前提。生产**默认 default 更稳**。

</div>

<!--
再讲两个常用插件，放一页。

cssnano 是基于 PostCSS 生态的模块化 CSS 压缩器，做的优化远不止删空白：压缩颜色写法、删除注释、丢弃被覆盖的规则、归一化取值、合并规则等。它是预设驱动的，default 预设只做安全变换，在任何站点都不改变视觉结果；advanced 预设做更激进的变换，能压得更小但只有站点满足特定前提才安全。所以核心权衡是压缩率对安全性，生产默认用 default 更稳。它一般放在插件链最后一位。

postcss-import 让 CSS 里的 at import 在构建期被内联，把被导入文件的内容直接合并进来，产出单一 CSS，避免浏览器运行时再发额外请求。因为它改变文件结构，通常放在插件链最前，先把所有片段拼齐后续插件才能处理到完整内容。好消息是 Vite 已经内置了这个能力，无需手动挂。
-->

---

# 配置与插件顺序

```js
// postcss.config.js —— 顺序即执行顺序（自上而下）
export default {
  plugins: [
    require('postcss-import'),      // 1. 先内联 @import
    require('postcss-preset-env')({ stage: 2 }), // 2. 降级（含加前缀）
    require('cssnano')({ preset: 'default' }),   // 3. 最后压缩
  ],
};
```

<v-clicks>

- **顺序错会漏处理**：import 靠前、加前缀居中、压缩垫底
- 两种写法：数组，或对象 `{ 插件名: 选项 }`（值设 `false` 可关闭）
- 函数式配置 `(ctx) => ({...})`：用 `ctx.env` 区分开发/生产

</v-clicks>

<!--
配置文件的核心是 plugins 字段，而且插件顺序至关重要，因为声明顺序就是执行顺序，自上而下。

看这条典型的生产插件链：第一步 postcss-import 先内联 import 把内容拼齐，第二步 preset-env 降级未来 CSS 并顺带加前缀，第三步 cssnano 最后压缩。顺序错了会导致后面的插件处理不到前面本应生成的内容，比如压缩放在 import 前面，就压不到被内联进来的那部分。

plugins 有两种写法，数组形式显式调用插件，或对象形式键是插件名值是选项，对象形式里把值设成 false 可以关闭某个插件。

还可以导出一个函数接收 ctx 上下文，用 ctx.env 区分环境，最常见的用法就是只在生产环境启用 cssnano 压缩，开发环境跳过加快构建。
-->

---

# Browserslist：单一事实来源

一处声明目标浏览器，多个工具统一遵循：

```jsonc
// package.json
{ "browserslist": ["> 0.5%", "last 2 versions", "not dead"] }
```

<v-clicks>

- **autoprefixer / preset-env / cssnano / Babel 共享同一份配置**
- 改一次目标 → 加前缀 / 降级 / 安全压缩策略**全链路同步**
- 也可写 `.browserslistrc`；`npx browserslist` 查命中的浏览器
- ⚠️ 只从配置读，**不会**从 CSS 注释 / HTML meta 读

</v-clicks>

<!--
Browserslist 是理解整条 CSS 工具链的一把钥匙。Autoprefixer、postcss-preset-env、cssnano，乃至 Babel 的 preset-env，都读同一份 Browserslist 目标配置。

你只在一处声明要兼容哪些浏览器，比如写在 package.json 的 browserslist 字段，或者根目录的点 browserslistrc 文件。常用 query 有大于百分之零点五的市占率、每个浏览器最近两个版本、排除已停止维护的 not dead。

这带来的核心价值是单一事实来源：改一次目标浏览器，加前缀、未来 CSS 降级、面向目标的安全压缩这些策略全链路同步调整，不会各个工具各说各话。

一个提醒：Browserslist 只从配置文件读取目标，不会从 CSS 注释或 HTML 的 meta 标签读。想查当前配置命中哪些浏览器，跑 npx browserslist 就能看到具体列表。
-->

---

# 构建集成：Vite / webpack

<div class="grid grid-cols-2 gap-4 text-sm">
<div>

**Vite —— 零配置自动加载**

```js
// 放一个 postcss.config.js
// Vite 自动应用到所有导入的 CSS
```
- 内置 `@import` 内联 + url() 重写
- 也可 `vite.config` 的 `css.postcss` 内联

</div>
<div>

**webpack —— postcss-loader**

```js
use: [
  'style-loader',
  'css-loader',
  'postcss-loader', // 读 config
]
```
- 放 `css-loader` **之前**（右→左执行）

</div>
</div>

<div v-click class="mt-4 text-sm">

> PostCSS 是**构建期**工具，不通过浏览器 `<script>`。主流构建工具都原生集成。

</div>

<!--
PostCSS 怎么接进项目？看两大构建工具。

Vite 是零配置自动加载。官方原文：只要项目里存在有效的 PostCSS 配置，任意 postcss-load-config 支持的格式，它就会被自动应用到所有被导入的 CSS，无需额外接线。你只要放一个 postcss.config.js 就行。Vite 还预置了 import 内联和 url 重写。也可以在 vite.config 里用 css.postcss 内联配置。

webpack 侧通过 postcss-loader 接入，它会自动发现并加载同一份 postcss.config.js。注意 loader 要放在 css-loader 之前，因为 webpack loader 从右向左执行，PostCSS 要先处理原始 CSS 再交给 css-loader。

统一强调：PostCSS 是构建期工具，不通过浏览器 script 标签引入，主流构建工具都原生集成它。
-->

---

# 边界一：与 Sass / Less 可组合

**不是竞争，是分工**——串联在同一条流水线：

```text
.scss ──(Sass 编译)──▶ 标准 CSS ──(PostCSS 加前缀/降级/压缩)──▶ 产物
```

<div class="text-sm mt-2">

| | Sass / Less（预处理器） | PostCSS |
| --- | --- | --- |
| 本质 | 新语法→编译成 CSS | CSS→AST→插件→CSS |
| 主战场 | 语法糖（作者体验） | 兼容/优化/校验 |

</div>

<div v-click class="text-sm mt-2">

> 顺序必须**预处理器在前**：PostCSS 解析不了 `$变量`、`@mixin`，得先编译掉。二者**按需组合**。

</div>

<!--
接下来两页讲边界，先说和 Sass、Less 的关系。这是最高频的混淆，很多人以为用了 Sass 就不能用 PostCSS，其实它们不是竞争，是分工，串联在同一条流水线里。

看这条链路：scss 先被 Sass 编译成标准 CSS，再把这份 CSS 交给 PostCSS 做加前缀、降级、压缩等后处理。

对比一下：Sass、Less 是预处理器，本质是把新语法编译成 CSS，主战场是变量、嵌套、mixin 这些语法糖，服务作者写代码的体验。PostCSS 本质是 CSS 到 AST 到插件到 CSS 的转换平台，主战场是兼容、优化、校验，服务构建产物。

顺序必须是预处理器在前，因为 PostCSS 解析不了美元变量、at mixin 这类 Sass 语法糖，得先让 Sass 编译掉。Less、Stylus 同理。所以正确心智是按需组合，而不是二选一。
-->

---

# 边界二：Tailwind / UnoCSS 澄清

<div class="text-sm">

| | 与 PostCSS 的关系 |
| --- | --- |
| **Tailwind CSS** | v3 **本身就是 PostCSS 插件**；v4 提供 `@tailwindcss/postcss`，也可用独立 `@tailwindcss/vite`（更快） |
| **UnoCSS** | **独立引擎**，**不是 PostCSS 插件、不基于 PostCSS**，走 Vite/webpack 插件 |

</div>

<div v-click class="mt-3">

⚠️ 「Tailwind 和 UnoCSS 都基于 PostCSS」是**不准确**的：

- Tailwind **配合** PostCSS（v4 起不再唯一绑定）
- UnoCSS **独立于** PostCSS

</div>

<div v-click class="text-sm mt-2">

> 二者是本章「样式方案」组的**独立叶子**，此处只厘清边界、不展开。

</div>

<!--
第二个边界，也是最容易说错的：Tailwind 和 UnoCSS 与 PostCSS 的关系。

Tailwind 与 PostCSS 关系密切且随版本演进。v3 本身就是一个 PostCSS 插件，你在 postcss.config.js 里挂上 tailwindcss 即可。到 v4，把 PostCSS 集成拆成独立包 at tailwindcss slash postcss，继续走 PostCSS 路线；同时新增了不依赖 PostCSS 的专用 Vite 插件 at tailwindcss slash vite，Vite 项目官方推荐用后者，性能更好。

而 UnoCSS 完全不同，它是一个自成一体的即时原子化引擎，不是 PostCSS 插件、也不基于 PostCSS，用自己的引擎扫描源码按需生成原子类，以 Vite、webpack 等构建插件形式直接运行，根本不走 PostCSS 的管线。

所以笼统说 Tailwind 和 UnoCSS 都基于 PostCSS 是不准确的。准确表述是：Tailwind 配合 PostCSS，v4 起不再唯一绑定；UnoCSS 独立于 PostCSS。本仓库就是用 UnoCSS，所以根本没有 postcss.config.js。这两个是本章样式方案组的独立叶子，这里只厘清边界不展开。
-->

---

# 常见误区 Top 6

<v-clicks>

- 「PostCSS 是预处理器 / 又一个 Sass」→ 它是**通用转换平台**
- 「装了就自动加前缀/压缩」→ **本体不做事**，全靠插件
- 「用了 Sass 就不能用 PostCSS」→ **串联共存**
- 「Tailwind/UnoCSS 都基于 PostCSS」→ Tailwind 配合、**UnoCSS 独立**
- 「preset-env 外还得单独装 autoprefixer」→ **已内置**，重复冗余
- 「插件顺序无所谓」→ 顺序=执行顺序，配错会**漏处理**

</v-clicks>

<!--
把最高频的六个误区集中过一遍。

第一，以为 PostCSS 是预处理器、又一个 Sass。纠正：它是通用转换平台，能做的远超预处理。

第二，以为装了 PostCSS 就自动加前缀、压缩。纠正：本体不做任何事，一切靠插件，空配置约等于原样输出。这是最核心的误区。

第三，以为用了 Sass 就不能用 PostCSS。纠正：二者串联共存，Sass 先编译、PostCSS 后处理。

第四，以为 Tailwind 和 UnoCSS 都基于 PostCSS。纠正：Tailwind 配合 PostCSS，UnoCSS 独立于 PostCSS。

第五，以为用了 preset-env 还得单独装 autoprefixer。纠正：preset-env 已内置 autoprefixer，重复挂冗余。

第六，以为插件顺序无所谓。纠正：顺序就是执行顺序，import 靠前压缩垫底，配错会漏处理。
-->

---

# 选型速记

<div class="text-sm">

| 需求 | 选择 |
| --- | --- |
| 只想加前缀 | Autoprefixer（或 preset-env 顺带） |
| 提前用现代 CSS | postcss-preset-env（配 Browserslist） |
| 变量/嵌套/mixin 体验 | Sass/Less，或 PostCSS 对应插件拼 |
| 原子化 class | Tailwind / UnoCSS（本章独立叶子） |
| 极致构建速度、固定转换 | 评估 Lightning CSS（Rust） |
| 团队私有 CSS 规范 | 写个 PostCSS 插件，几十行 JS |

</div>

<div v-click class="mt-3 text-sm">

> **Lightning CSS**：固定任务更快，但不是任意 JS 插件平台，跑不了任意 PostCSS 插件。**按任务选、常并存**，不是淘汰赛。

</div>

<!--
最后给一张选型速记表。

只想加前缀，用 Autoprefixer，或者 preset-env 顺带。想提前用现代 CSS 语法，用 postcss-preset-env 配好 Browserslist。想要变量、嵌套、mixin 的作者体验，用 Sass、Less，或者用 PostCSS 的对应插件拼出来。想要原子化 class，用 Tailwind 或 UnoCSS，这是本章的独立叶子。追求极致构建速度、只做固定转换，可以评估 Rust 实现的 Lightning CSS。要落地团队私有的 CSS 规范或迁移，写个 PostCSS 插件，几十行 JS 就够。

关于 Lightning CSS 补一句：它在加前缀、压缩、降级这类固定任务上比等价的 PostCSS 插件链快很多，是很好的替代或补充，但它不是任意 JS 插件平台，跑不了任意 PostCSS 插件。所以正确的态度是按任务选型、常常并存，而不是笼统宣布谁淘汰谁。
-->

---
layout: intro
---

# 总结

PostCSS = **用 JS 插件转换 CSS 的工具 / AST 平台**

- 心智：**parse → 插件转换 AST → stringify**，CSS 进 CSS 出
- **本体不做事，全靠插件**：autoprefixer / preset-env / cssnano / import
- 节点：Root / Rule / Declaration / AtRule / Comment；visitor + 防 re-visit
- 配置：`postcss.config.js` + Browserslist；Vite/webpack 原生集成
- 边界：与 Sass/Less **可组合**；Tailwind 配合、**UnoCSS 独立**
- v8.5：CSS 工具链事实上的公共底座

<!--
总结一下。PostCSS 是用 JS 插件转换 CSS 的工具、AST 平台，不是语言、不是预处理器。

核心心智：parse 解析成 AST，插件转换 AST，stringify 序列化回 CSS，CSS 进 CSS 出。最要记住的一点是本体几乎什么都不做，一切靠插件，最常用的四个是 autoprefixer 加前缀、preset-env 降级、cssnano 压缩、import 内联。

AST 有五种核心节点：Root、Rule、Declaration、AtRule、Comment；写插件用访问器 visitor，注意 re-visit 会导致死循环要做幂等判重。配置写在 postcss.config.js，配合 Browserslist 做单一事实来源，Vite 和 webpack 都原生集成。

边界上：与 Sass、Less 可组合非互斥，先编译后处理；Tailwind 配合 PostCSS，UnoCSS 独立于 PostCSS。

2026 年现状：v8.5.16，PostCSS 是现代前端 CSS 工具链事实上的公共底座。谢谢大家。
-->
