---
theme: seriph
background: https://cover.sli.dev
title: Welcome to JSDoc
info: |
  Presentation about JSDoc for developers.

  Learn more at [https://jsdoc.app/](https://jsdoc.app/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# JSDoc

用注释为 JavaScript 生成 API 文档（基于 v4.0.5）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天我们聊 JSDoc —— 用代码里的注释，自动生成一整套 API 文档。
它是 JavaScript 生态的注释事实标准，配合 TypeScript 还能让纯 JS 拥有类型检查。
-->

---
transition: fade-out
---

# JSDoc 是什么？

一种「注释规范」加一个「文档生成器」

<v-clicks>

- 解析源码里 `/**` 注释中的标签，生成 HTML API 文档站点
- **不编译、不做运行时分析**：纯静态解析注释
- 主战场是**纯 JavaScript**，注释语法是 JS 生态事实标准
- 成熟稳定、feature-complete，更新节奏慢但不停滞

</v-clicks>

<div v-click="4" text-xs mt-6>

_Read more about_ [_JSDoc_](https://jsdoc.app/)

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
JSDoc 是什么？它由两部分组成：一套注释规范，加一个文档生成器。

[click] 它读取你代码里以斜杠星星星开头的注释，把里面的标签解析出来，生成一套 HTML 文档站点。

[click] 注意它不编译、不做运行时分析，纯粹是静态解析注释。

[click] 它的主战场是纯 JavaScript，注释语法是整个 JS 生态的事实标准。

[click] 它已经非常成熟，功能完备，更新慢但并没有停滞。
-->

---
transition: fade-out
---

# 工具链坐标

JSDoc / TypeDoc / TypeScript 三者互补，不是替代关系

<v-clicks>

- **JSDoc**：注释驱动，主纯 JS，输出 HTML 文档
- **TypeDoc**：从 **TS 类型系统**读信息生成文档，TS 项目更省注释
- **TypeScript 编译器**：能**消费** `.js` 里的 JSDoc 类型注解做类型检查
- 文档站点 SSG（VitePress / Docusaurus）渲染 Markdown，与「从代码生成 API 文档」是不同层

</v-clicks>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
把 JSDoc 放进工具链坐标看清边界。

[click] JSDoc 注释驱动，主打纯 JS，输出 HTML。

[click] TypeDoc 从 TypeScript 类型系统读信息，TS 项目用它更省注释。

[click] 而 TypeScript 编译器，能反过来消费 JS 里的 JSDoc 注解做类型检查。

[click] 至于 VitePress 这类文档站点工具，渲染的是 Markdown，和从代码生成 API 文档是不同层次。三者互补，不互斥。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-12
---

# 安装与命令行

本地安装，跑命令生成文档

::left::

<div v-click>

- **安装**:

  ```bash
  pnpm add -D jsdoc
  pnpm exec jsdoc -v
  ```

</div>

<div v-click>

- **生成文档**:

  ```bash
  # 递归 src/，输出到 docs/
  pnpm exec jsdoc src/ -r -d docs/
  ```

  <span text-xs text-gray>

  默认输出目录是 `out/`（不是 dist/）

  </span>

</div>

::right::

<div v-click>

- **常用参数**

  | 参数 | 作用 |
  | --- | --- |
  | `-r` | 递归扫描子目录 |
  | `-d <dir>` | 输出目录 |
  | `-c <file>` | 指定配置文件 |
  | `-t <dir>` | 指定模板 |
  | `-R <file>` | 指定首页 README |

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
安装和使用都很简单。

[click] 推荐本地安装，团队和 CI 版本一致；用 -v 查版本。

[click] 一行命令递归扫描 src，输出到 docs。注意默认输出目录是 out，别找错地方。

[click] 右边是常用参数：递归、输出目录、配置文件、模板、首页 README。
-->

---
transition: fade-out
---

# 注释语法与放置

第一道坎：注释必须以 `/**` 开头

<v-clicks>

- 必须以 `/**`（斜杠 + **两个**星号）起手，`/*` 和 `//` 都**不会**被解析
- 注释**紧贴在被记录代码正上方**，解析器把它与紧随的符号关联

</v-clicks>

<div v-click>

```js
/** 表示一本书。
 * @param {string} title - 书名。
 * @param {string} author - 作者。
 */
function Book(title, author) {}
```

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这是新手第一道坎。

[click] 注释必须以斜杠加两个星号开头，普通块注释和行注释都不会被解析。

[click] 而且注释要紧贴在被记录的函数、类或变量正上方，解析器靠位置把注释和符号关联。

[click] 这就是一个最小示例：描述一本书，标注两个参数。
-->

---
transition: fade-out
---

# 块标签 vs 内联标签

两种标签形态，写法和位置不同

<v-clicks>

- **块标签**：以 `@` 起行、独占一行，如 `@param` / `@returns`，多个之间换行分隔
- **内联标签**：写在花括号 `{}` 内、嵌入描述文本中
- 内联标签**仅 4 个**：`{@link}` / `{@linkcode}` / `{@linkplain}` / `{@tutorial}`
- 文本若含 `}` 要用反斜杠转义

</v-clicks>

<div v-click>

```js
/** 设置鞋的颜色。可用 {@link Shoe#setSize} 设置尺寸。
 * @param {string} color - 颜色。
 */
```

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
JSDoc 标签分两种形态。

[click] 块标签以 @ 起行、独占一行，比如 param 和 returns，多个之间要换行分隔。

[click] 内联标签写在花括号里、嵌在描述文本中。

[click] 内联标签只有四个：link、linkcode 等宽、linkplain 纯文本、tutorial。

[click] 如果文本里出现右花括号，记得用反斜杠转义。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 核心块标签

最常用的一批标签速记

::left::

<div v-click>

| 标签 | 用途 |
| --- | --- |
| `@param` | 参数（名后 `-` 可选） |
| `@returns`/`@return` | 返回值，互为别名 |
| `@type` | 变量/常量类型 |
| `@typedef` | 定义命名类型 |
| `@property`/`@prop` | 对象成员 |
| `@example` | 示例代码块 |

</div>

::right::

<div v-click>

| 标签 | 用途 |
| --- | --- |
| `@throws` | 可能抛出的异常 |
| `@template` | 声明泛型参数 |
| `@deprecated` | 弃用标记 |
| `@see` | 交叉引用 |
| `@ignore` | 不出现在文档中 |
| `@private` 等 | 访问可见性（语义） |

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这是最常用的一批块标签。

[click] 左边：param 标参数，returns 和 return 完全等价；type 标类型，typedef 定义命名类型，property 描述对象成员，example 写示例。

[click] 右边：throws 标异常，template 声明泛型，deprecated 弃用，see 交叉引用，ignore 让符号不出现在文档里，private 这类标访问可见性，注意只是文档语义，运行时不强制。
-->

---
transition: fade-out
---

# 类型表达式

花括号内的类型写法（来自 JSDoc + Closure）

<v-clicks>

- 基础：`{string}` `{number}` `{boolean}` `{*}`（any）
- 可空 / 非空：`{?number}`（含 null）、`{!string}`（非空，来自 Closure）
- 可变参数：`{...number}`；联合类型：`{(string|number)}`
- 数组：`Array.<number>` 或 `number[]`（注意 `Array.<>` 带点）
- 映射：`Object.<string, number>`；对象字面量：`{{a: number, b: string}}`
- 函数：`{function(string, number): boolean}`

</v-clicks>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
花括号里能写相当丰富的类型表达式。

[click] 基础类型，星号表示任意。

[click] 前缀问号表示可空，前缀感叹号表示非空，这个来自 Closure。

[click] 三个点表示可变参数；竖线连接是联合类型。

[click] 数组有两种写法，注意 Array 点的写法带点。

[click] 还能写键值映射和对象字面量。

[click] 甚至能写函数类型，参数序列冒号返回类型。
-->

---
transition: fade-out
---

# 自定义类型

`@typedef` 定义可复用类型，`@callback` 定义回调签名

<div v-clicks>

```js
/** @typedef {(number|string)} NumberLike */

/**
 * @typedef {Object} Triforce
 * @property {boolean} hasCourage - 是否有勇气。
 * @property {boolean} [hasWisdom] - 可选属性。
 */

/**
 * @callback Predicate
 * @param {string} data
 * @returns {boolean}
 */
```

</div>

<div v-click text-xs mt-2>

`@typedef {Object}` 与 `{object}` 均可；定义后可跨文件按名引用

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
当类型复杂、需要复用时，用 typedef 和 callback。

[click] 第一行用 typedef 定义一个联合别名；中间用 typedef 加 property 描述一个对象的形状，方括号表示可选属性；最后用 callback 定义回调函数的签名。

[click] typedef 的 Object 大小写都行，定义之后就能在 param、returns、type 里按名字引用，还能跨文件复用。
-->

---
transition: fade-out
---

# 实战：完整函数文档

把标签组合起来，描述一个真实函数

<div v-click>

```js
/**
 * 把价格格式化为带货币符号的字符串。
 * @param {number} amount - 金额（分）。
 * @param {string} [currency="¥"] - 货币符号。
 * @returns {string} 形如 "¥12.34"。
 * @throws {RangeError} amount 为负时抛出。
 * @example
 * format(1234);        // "¥12.34"
 * format(1234, "$");   // "$12.34"
 */
function format(amount, currency = "¥") {}
```

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
把前面学的标签组合起来，看一个真实函数怎么写。

[click] 这是一个价格格式化函数：描述放在最上面；param 标了两个参数，第二个用方括号带默认值表示可选；returns 说明返回形态；throws 标出负数会抛 RangeError；最后 example 给了两段可运行的示例。一套标签下来，这个函数的契约就一清二楚了。
-->

---
transition: fade-out
---

# 类与继承

ES2015 class 大多自动识别，无需到处写标签

<v-clicks>

- JSDoc **自动识别** class、constructor、静态方法、继承
- **无需** 到处写 `@class` / `@constructor`，主要补 `@param` / `@returns`
- 继承显式用 `@extends`（别名 `@augments`）
- 相关：`@implements` + `@interface`、`@override`、`@abstract`、`@mixin`

</v-clicks>

<div v-click>

```js
/** 表示一个点。 */
class Point {
  /** @param {number} x @param {number} y */
  constructor(x, y) { this.x = x; this.y = y; }
}
/** @extends Point */
class Dot extends Point {}
```

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
对现代 class，JSDoc 很省心。

[click] 它自动识别 class、构造函数、静态方法和继承。

[click] 所以你不用到处写 class 或 constructor 标签，主要补参数和返回值。

[click] 继承关系要显式用 extends，别名是 augments。

[click] 相关还有 implements 配 interface、override、abstract、mixin 这些。

[click] 代码里只需在构造函数标参数，继承处标 extends 即可。
-->

---
transition: fade-out
---

# 实战：跨文件复用 + 解构

`@typedef` 抽公共类型，`@param` 描述解构入参

<div v-click>

```js
/**
 * @typedef {Object} RequestOptions
 * @property {string} url
 * @property {"GET"|"POST"} [method]
 * @property {Record<string, string>} [headers]
 */

/**
 * @param {RequestOptions} opts
 * @returns {Promise<Response>}
 */
async function request(opts) {}
```

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
再看一个工程里高频的实战：抽公共类型加描述解构入参。

[click] 先用 typedef 把 RequestOptions 这个对象类型抽出来，里面用 property 列出 url、method、headers，方括号表示可选；method 还用联合类型限定只能是 GET 或 POST。下面的 request 函数直接 param 引用这个类型名，returns 是一个 Promise。类型抽出来后可以跨文件复用，入参一目了然。
-->

---
transition: fade-out
---

# 模块与 namepaths

`@module` 标记模块，namepaths 精确定位符号

<v-clicks>

- `@module color/mixer` 标记文件为模块，符号路径带 `module:` 前缀
- 支持 CommonJS / ES2015 / AMD；导出复杂时用 `@exports`

</v-clicks>

<div v-click>

| 符号 | 含义 | 例 |
| --- | --- | --- |
| `#` | 实例成员 | `Book#title` |
| `.` | 静态成员 | `Point.fromString` |
| `~` | 内部成员（inner） | `Person~say` |
| `module:` | 模块 | `module:foo/bar` |
| `event:` | 事件 | `module:foo/bar.event:Evt` |

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
讲模块和命名路径。

[click] 用 module 标记一个文件是模块，它的符号路径会带 module 冒号前缀；CommonJS、ES Module、AMD 都支持，导出形态复杂时用 exports 显式标注。

[click] namepaths 用符号精确定位：井号是实例成员，点是静态成员，波浪号是内部成员，module 冒号是模块，event 冒号是事件。名称含特殊字符时用引号包裹。
-->

---
transition: fade-out
---

# 配置文件 jsdoc.json

把命令行参数沉淀进配置，用 `-c` 传入

<div v-click>

```json
{
  "source": {
    "include": ["src/"],
    "excludePattern": "(^|\\/|\\\\)_"
  },
  "plugins": ["plugins/markdown"],
  "sourceType": "module",
  "tags": { "dictionaries": ["jsdoc", "closure"] },
  "opts": { "destination": "./docs/", "recurse": true }
}
```

</div>

<v-clicks>

- 格式：JSON（3.3.0+ 可带注释）或 CJS 模块（3.5.0+）
- `tags.dictionaries`：`jsdoc`（标准）+ `closure`（含 `!` `?`），默认都启用
- **命令行参数优先级 > 配置文件**

</v-clicks>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
项目大了就该用配置文件，用 -c 传入。

[click] 这是一份典型配置：source 控制扫描范围，excludePattern 默认跳过下划线开头的文件；plugins 挂插件；sourceType 默认 module；tags 指定字典；opts 把输出目录、递归这些命令行参数写进来。

[click] 格式可以是 JSON，3.3.0 起还能带注释，或者写成 CJS 模块。

[click] dictionaries 里 jsdoc 是标准、closure 含感叹号问号语法，默认两个都启用。

[click] 切记：命令行参数会覆盖配置文件。
-->

---
transition: fade-out
---

# 模板与插件

模板决定外观，插件扩展解析能力

<v-clicks>

- **模板**决定文档外观，用 `-t` 或 `opts.template` 切换
- 社区模板：**docdash** / **better-docs** / **minami**
- 内置插件：`plugins/markdown`（注释内 Markdown 渲染成 HTML）、`plugins/summarize`
- `plugins` 路径相对 JSDoc 安装目录

</v-clicks>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
外观和扩展性靠模板与插件。

[click] 模板决定文档长什么样，用 -t 或配置里的 template 切换。

[click] 默认模板之外，社区有 docdash、better-docs、minami 几款常见模板。

[click] 内置插件里最常用的是 markdown，它让注释里的 Markdown 渲染成 HTML；还有 summarize。

[click] 注意 plugins 的路径是相对 JSDoc 安装目录的。
-->

---
transition: fade-out
---

# 配合 TypeScript ①

让纯 `.js` 拥有类型检查，无需迁移到 `.ts`

<v-clicks>

- 单文件：顶部 `// @ts-check`
- 全项目：tsconfig `"checkJs": true`（配 `"allowJs": true`）
- TS 语言服务读 JSDoc 注解 → 补全 / 悬停 / 类型报错

</v-clicks>

<div v-click>

```js
// @ts-check
/** @type {Map<string, number>} */
const scores = new Map();
scores.set("a", 1);
scores.set("b", "2"); // ❌ TS: string 不能赋给 number
```

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这是 JSDoc 的现代金矿：让纯 JS 拥有类型检查。

[click] 单个文件，顶部写 ts-check 注释即可；想全项目开，就在 tsconfig 里把 checkJs 设为 true，并配上 allowJs。

[click] 这样 TS 语言服务就会读 JS 里的 JSDoc 注解，给你补全、悬停提示和类型报错，纯 JS 也能类型安全。

[click] 比如这段，给 b 设了字符串，TS 立刻报错，根本不用迁移到 ts 文件。
-->

---
transition: fade-out
---

# 配合 TypeScript ①（续）

可选参数的三种语法（重要考点）

<div v-click>

```js
/**
 * @param {string} p1        - 必填
 * @param {string=} p2       - 可选（Closure 风格）
 * @param {string} [p3]      - 可选（JSDoc 风格）
 * @param {string} [p4="x"]  - 可选 + 默认值
 */
```

</div>

<v-clicks>

- 类型后 `=` 与参数名加 `[]` 等价，都表示可选
- `[name=default]` 同时给默认值
- 三种写法**别混淆**：`=` vs `[]` vs `[=默认]`

</v-clicks>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
可选参数有三种语法，是个重要考点。

[click] 看这段：p1 必填；p2 用类型后加等号，是 Closure 风格的可选；p3 用参数名加方括号，是 JSDoc 风格的可选；p4 在方括号里给默认值。

[click] 类型后加等号和参数名加方括号是等价的，都表示可选。

[click] 方括号里写等号还能同时给默认值。

[click] 这三种写法容易混，记清楚：等号、方括号、方括号带默认。
-->

---
transition: fade-out
---

# 配合 TypeScript ②

现代特性：断言 / `@import` / `@satisfies`

<div v-click>

```js
// 类型断言（casting）：括号包裹表达式
var n = /** @type {number} */ (someValue);

// @import 导入类型（TS 扩展，运行时 no-op）
/** @import {Pet} from "./types" */

// @satisfies：校验但不改变类型
/** @satisfies {Record<string, number>} */
const cfg = { a: 1 };

// @template 约束 + 默认
/** @template {string} K */   // 仅首个类型参数受约束
/** @template [T=object] */   // 默认类型
```

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
TypeScript 还给 JSDoc 加了一批现代特性。

[click] 第一，类型断言，用 type 标签加括号包裹表达式，相当于 as。第二，import 导入类型，是 TS 的扩展，运行时是空操作。第三，satisfies，校验但不改变推断出的类型。第四，template 能加约束和默认值，注意约束只作用于第一个类型参数。
-->

---
transition: fade-out
---

# 配合 TypeScript ②（坑）

TS 不支持的标签 + legacy 同义词陷阱

<v-clicks>

- **TS 不支持**的标签：`@memberof`、`@yields`、`@member`、`@async`
- 语法差异：`!number` 非空 TS 当普通类型**忽略 `!`**
- `?number` 可空 → 官方建议写 `number | null`
- 后缀 `=` 可选属性 `{{ b: number= }}` → TS **不支持**，用 `?`

</v-clicks>

<div v-click text-xs mt-2>

**legacy 同义词**：`String→string`、`Object`/`object`→**any**（`noImplicitAny` 下禁用）、`function→Function`

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
配合 TS 也有一批坑，是高手级考点。

[click] 有些 JSDoc 标签 TS 根本不认：memberof、yields、member、async。

[click] 语法语义也有差异：JSDoc 的感叹号表示非空，但 TS 把它当普通类型，直接忽略感叹号。

[click] 问号可空在 TS 里只有开了 strictNullChecks 才有意义，官方建议直接写 number 竖线 null。

[click] 后缀等号的可选属性 TS 不支持，要用问号。

[click] 还有 legacy 同义词陷阱：大写 String 应写小写，Object 在 noImplicitAny 下会退化成 any 报错，明确写类型最稳。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 工具链对比

各司其职，按项目形态选型

::left::

<div v-click>

| 工具 | 角色 |
| --- | --- |
| **JSDoc** | 注释生成 HTML，主纯 JS |
| **TypeDoc** | 从 TS 类型生成文档 |
| **API Extractor** | .d.ts rollup + API 报告 |

</div>

::right::

<div v-click>

| 工具 | 角色 |
| --- | --- |
| **TSDoc** | TS 注释**规范**（非生成器） |
| **eslint-plugin-jsdoc** | 校验注释规范，适合 CI |
| documentation.js | 放缓；ESDoc 已弃用 |

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
横向对比一圈，各司其职。

[click] 左边：JSDoc 注释生成 HTML，主纯 JS；TypeDoc 从 TS 类型生成文档，是 TS 项目的对位选择；API Extractor 是微软的，做 d.ts 的 rollup 和 API 报告，库作者向。

[click] 右边：TSDoc 是微软的注释规范，注意它本身不是生成器；eslint-plugin-jsdoc 用 ESLint 规则校验注释完整性，适合 CI 门禁；documentation.js 放缓了，ESDoc 已经弃用。
-->

---
transition: fade-out
---

# 踩坑清单

容易翻车的八个点

<v-clicks>

1. 注释必须 `/**`，`/*` 不解析
2. `@returns` / `@return` 完全等价，别纠结
3. JSDoc 的 `!` 非空 / `?` 可空在 TS 里语义不同甚至被忽略
4. `@memberof` / `@yields` / `@async` 等 TS 不认
5. `Object` / `object` 在 TS `noImplicitAny` 下退化成 any
6. 默认输出 `out/`，别找错目录
7. 可选参数三种写法别混淆（`=` vs `[]` vs `[=默认]`）
8. 命令行参数会覆盖配置文件

</v-clicks>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
最后把容易翻车的点收成一张清单。

[click] 注释必须斜杠双星。

[click] returns 和 return 等价。

[click] 感叹号问号在 TS 里语义不同甚至被忽略。

[click] memberof、yields、async 这些 TS 不认。

[click] Object 在 noImplicitAny 下退化成 any。

[click] 默认输出 out 目录。

[click] 可选参数三种写法别混。

[click] 命令行参数覆盖配置文件。
-->

---
layout: center
class: text-center
transition: slide-up
---

# 谢谢观看

JSDoc：用注释让 JavaScript 既有文档，又有类型

<div class="mt-8 flex justify-center gap-6 text-sm">
  <a href="https://jsdoc.app/" target="_blank">官方文档</a>
  <a href="https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html" target="_blank">TS 中的 JSDoc</a>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天就到这里。

一句话总结 JSDoc：用注释让 JavaScript 既拥有文档，又拥有类型。纯 JS 项目它是文档标准，配合 TypeScript 它又能撑起类型检查。需要深入就看官方文档和 TS 那篇 JSDoc 支持列表。谢谢大家！
-->
