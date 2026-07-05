---
theme: seriph
background: https://cover.sli.dev
title: MDX —— Markdown + JSX
info: |
  Presentation MDX —— 在 Markdown 里写 JSX 的融合格式。

  Learn more at [https://mdxjs.com](https://mdxjs.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-7xl font-mono">＃</span>
  <span class="text-5xl op-60">+</span>
  <span class="text-7xl font-mono">&lt;/&gt;</span>
</div>

<br/>

## MDX —— 在 Markdown 里写 JSX

Markdown 的超集：可 import 组件、写 JSX、插 `{表达式}`，当前 v3（`@mdx-js/mdx` 3.1.1）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/mdx-js/mdx" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 MDX —— Markdown 加 JSX 的融合格式。一句话定义：它让你在 Markdown 内容里直接写 JSX，import 一个组件然后像写标签一样嵌进正文。

它是 Markdown 的超集，绝大多数合法 CommonMark 都能直接当 MDX 处理，只是额外叠加了 JSX 元素、花括号表达式插值、以及 ESM 的 import/export。

版本背景：当前主线 v3，核心编译器 @mdx-js/mdx，npm 实测 3.1.1，官方包全部 ESM only，要求 Node 16 以上。

今天顺序：定位 → 与 Markdown 对比 → 一个完整示例 → 语法五连（ESM / JSX 元素 / 表达式 / 混排 / 注释转义）→ 文件即模块 → 编译管线 → 三组 API → 核心选项 → 三层插件 → 组件映射与 Provider → 框架集成 → 多框架 runtime → v2 到 v3 迁移 → 常见坑 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 MDX？

在 Markdown 里无缝嵌入可交互组件：

<v-clicks>

- `import` 并使用可复用、可传 props 的组件
- Markdown 超集：现有 `.md` 基本可直接改名 `.mdx`
- 文件即 ES module：默认导出内容组件
- remark / rehype / recma 三层插件生态成熟

</v-clicks>

<div v-click class="mt-4 text-sm">

但它有边界：

- 是**编程语言**，会执行代码——不可信内容不安全
- 产物依赖 JSX runtime，纯静态站需预渲染

</div>

<!--
为什么用 MDX？核心价值是内容与组件的无缝融合。

很多 Markdown 处理器允许内嵌裸 HTML，但那只是静态字符串，无法传状态、无法复用带逻辑的组件。MDX 用 JSX 组件取代裸 HTML，让文档真正接入前端组件体系，这是它相对 Markdown 加裸 HTML 的本质飞跃。

优点：可以 import 并使用可复用、可传 props 的组件；它是 Markdown 超集，迁移平滑，现有 md 基本改名就能跑；文件即 ES module，默认导出内容组件、具名导出元数据；插件生态分三层，各司其职。正因如此 Docusaurus、Astro、Next.js、Nextra 都把它当主力写作格式。

但要认清边界：MDX 是一门编程语言，会被编译成可执行 JS，渲染不可信来源的内容等于让对方运行任意代码，只有信任作者才可用。而且产物依赖 React、Preact、Vue 等 JSX runtime，即便内容全静态也要框架参与，纯零 JS 静态站得靠 SSR 或预渲染。
-->

---

# MDX vs Markdown：区别与取舍

| 维度 | Markdown | MDX |
| --- | --- | --- |
| 能力 | 静态文本结构 | + JSX 组件 / 表达式 / ESM |
| 产物 | HTML | JS 组件（依赖 JSX runtime） |
| 交互 | 无（除非嵌裸 HTML） | 可复用、可传 props 的组件 |
| 工程成本 | 极低 | 需构建集成，TS 需 `@types/mdx` |
| 安全 | 相对安全 | 会执行代码，不可信内容不安全 |

<div v-click class="mt-3 text-sm">

> 纯静态文档 → Markdown 更轻；需嵌交互组件 / 复用设计系统 / 内容驱动站点 → MDX；渲染不可信内容 → **绝不能**用 MDX。

</div>

<!--
MDX 和 Markdown 怎么选？看这张表。

能力上，Markdown 只能表达静态文本结构，MDX 额外加了 JSX 组件、花括号表达式、ESM 导入导出。产物上，Markdown 编译成 HTML，MDX 编译成依赖 JSX runtime 的 JS 组件。交互上，Markdown 除非嵌裸 HTML 否则没有交互，MDX 能用可复用、可传 props 的组件。

工程成本上，Markdown 极低，丢个文件就能渲染；MDX 需要构建工具集成，TypeScript 还要装 @types/mdx 补类型。安全上，Markdown 相对安全，MDX 会执行代码，不可信内容不安全。

选型口径：纯静态文档、无交互需求，用 Markdown 更轻，上 MDX 是过度工程；需要嵌交互组件、复用设计系统、做内容驱动站点，MDX 无可替代；渲染不可信内容，绝对不能用 MDX，应回退到受控的 Markdown 渲染器。
-->

---

# 一个 MDX 文件长什么样

```mdx
import {Chart} from './chart.js'   // ← ESM
export const year = 2026

# 今年销售报告

这是 **普通 Markdown** 段落，带 [链接](https://mdxjs.com)。

<Chart data={sales} year={year} />

当前年份 {year}，圆周率两倍是 {Math.PI * 2}。

{/* 这是 MDX 注释，不会渲染出来 */}
```

<div v-click class="mt-2 text-sm">

> 四类内容混排：**ESM**（import/export）、**Markdown**（标题/加粗/链接）、**JSX 元素**（`<Chart />`）、**`{表达式}` 插值**（`{year}`）。

</div>

<!--
先看一份典型 MDX，四类内容一次看全。

最上面 import 和 export 是标准 ESM 语句，引入 Chart 组件、导出 year 常量。中间井号标题、双星号加粗、方括号链接是普通 Markdown，原样可用。Chart 那行是 JSX 元素，像写标签一样使用组件，data 和 year 用花括号传 props。再往下花括号里的 year 和 Math.PI 乘 2 是表达式插值，编译时求值渲染。最后花括号斜杠星号是 MDX 注释，不会渲染出来。

所以 MDX 文件里能出现的内容归为四类：ESM 的 import export、Markdown 正文、JSX 元素、以及花括号表达式插值。记住这四类，后面逐个展开。

一个提醒：注释只能用花括号斜杠星号这种 JSX 风格，HTML 注释在 MDX 里不被支持。
-->

---

# 语法①：ESM —— import / export

```mdx
import {Chart} from './chart.js'
import * as UI from './ui.js'
export const title = '年度报告'

# {title}

<Chart /> 与 <UI.Button>点我</UI.Button> 都能直接用。
```

<v-clicks>

- `import` 把组件绑定到模块作用域，正文**任意处**可作 JSX 标签用
- `export` 的具名值成为模块具名导出，外部可 `import {title}` 读取
- 具名值在**本文件**也可见，可被 `{title}` 表达式引用

</v-clicks>

<!--
第一类语法：ESM。MDX 文件即模块，可以直接写标准的 import 和 export。

import 把组件或值绑定到当前模块作用域，绑定之后，正文任意位置都能把它当 JSX 标签使用，import 通常写顶部但会被提升。这里 import 了 Chart 组件和整个 UI 命名空间，正文里 Chart 和 UI 点 Button 都能直接用。

export 的具名值有双重身份：一是成为该 MDX 模块的具名导出，外部可以 import 花括号 title 读取，常用于声明标题、日期这类元数据；二是它在本文件作用域内也可见，可以被花括号 title 这样的表达式引用，既对外导出又在正文复用同一个值，避免重复书写。
-->

---

# 语法②：JSX 元素与命名规则

编译器如何区分「组件引用」与「字面元素」，看名字形态：

| 写法 | 判定 | 含义 |
| --- | --- | --- |
| `<Planet />` | 首字母**大写** | 组件**引用**，需 import/提供 |
| `<section />` | 首字母**小写** | **字面** HTML 元素 |
| `<lib.Button />` | 带**点号** | **成员表达式**，取 `lib.Button` |
| `<a-b />` | 带**连字符** | **字面**元素（类自定义元素） |

<div v-click class="mt-2 text-sm">

> ⚠️ 自定义组件**忘记大写**会被当字面元素而静默渲染错；空元素**忘自闭合**（`<img>`）会报未闭合。

</div>

<!--
第二类语法：JSX 元素。使用组件就是 JSX，像写 HTML 标签一样，无子节点时自闭合，可传 props。编译器怎么区分你写的是组件引用还是字面元素，取决于名字形态。

首字母大写，比如大写 Planet，被当作组件引用，需要你 import 或通过 components、Provider 提供。首字母小写，比如 section，被当作字面 HTML 元素名。带点号，比如 lib 点 Button，是成员表达式，从 lib 这个对象上取 Button，lib 必须是作用域内已绑定的对象。带连字符，比如 a 减 b，因为不是合法 JS 标识符，也按字面元素处理，类似自定义元素。

两个高频坑：自定义组件忘记大写开头，会被当成字面 HTML 元素而不是你的组件，静默渲染错误；空元素忘记自闭合，写成没有斜杠的 img，会因未闭合标签报错。
-->

---

# 语法③：`{表达式}` 插值

```mdx
export const items = ['a', 'b', 'c']

一共 {items.length} 项；π×2 = {Math.PI * 2}。

<ul>{items.map((x) => <li key={x}>{x}</li>)}</ul>
```

<v-clicks>

- 花括号里放能**求值**的 JS **表达式**，编译时求值渲染
- **不能**放 `if` / `for` / `const` 等**语句**——用三元、`&&`、`.map()`
- 想显示字面 `{`：写 `\{` 转义，或放进代码块

</v-clicks>

<!--
第三类语法：花括号表达式插值。花括号里放一个 JavaScript 表达式，编译时求值并把结果渲染进内容，这套语法来自 JSX。

比如花括号 items 点 length 显示数组长度，花括号 Math.PI 乘 2 显示计算结果。甚至可以用 items 点 map 返回一组 li 元素来动态生成列表。

关键约束：花括号里必须是能求值的表达式，不能放 if、for、const 这类语句。要条件就用三元运算符或逻辑与，要循环就用数组的 map。

还有个转义点：正文里裸写左花括号会被当作表达式起始，想显示字面的左花括号，写反斜杠花括号转义，或者放进行内代码、围栏代码块里。
-->

---

# 语法④：Markdown 与 JSX 混排

规则可概括为「**inline 通融，block 分界**」：

```mdx
<Note>

这里的 **加粗** 和 [链接](https://mdxjs.com) 会正常渲染。

</Note>

<Note>这里的 **加粗** 未必生效</Note>
```

<v-clicks>

- **行内** Markdown（`**加粗**`、`` `code` ``）能在 JSX 内工作
- **块级 JSX 内跨行内容默认不再按 Markdown 解析**
- 想让组件内部吃 Markdown → 用**空行**分隔成独立块
- ⚠️ 标签一开一闭跨块不匹配（misnested）会**报错**

</v-clicks>

<!--
第四类是混排规则，这是 MDX 最需要理解的一处。可以概括成一句话：inline 通融，block 分界。

看代码：第一个 Note 组件，标签和内部内容之间有空行，内部的加粗和链接会被当独立 Markdown 块正常解析渲染。第二个 Note，内容和标签紧贴没有空行，内部内容按 JSX 子节点处理，加粗未必生效，可能原样输出双星号。

规则展开：同一行里的行内 Markdown，比如加粗、行内代码，能在 JSX 元素内部工作。但当 JSX 是块级、内部内容跨多行时，其内部默认不再按 Markdown 解析。想让组件内部继续吃 Markdown，必须用空行把内容与标签分隔，形成独立的 Markdown 块。

还有个坑：跨越不同块、标签一开一闭不匹配，也就是 misnested，会直接报错。养成组件与内部 Markdown 之间空一行的习惯，能避开大多数混排问题。
-->

---

# 语法⑤：注释与「像 Markdown 却不同」的坑

| 现象 | 规则 | 正确做法 |
| --- | --- | --- |
| 注释被渲染 | HTML 注释不支持 | `{/* ... */}` |
| 裸 `<` / `{` 报错 | 当标签/表达式起始 | `\<` `\{` 或代码块 |
| 缩进代码块失效 | 缩进用于排布 JSX | 用围栏（```） |
| 裸 URL 不成链 | 不支持 autolink | 写 `[text](url)` |
| `<img>` 报错 | JSX 要求闭合 | 自闭合 `<img />` |

<!--
第五类，注释以及一批像 Markdown 却不同的坑，从纯 Markdown 迁过来最容易翻车的就是这些。

注释：HTML 注释在 MDX 里不被支持，因为 HTML 被 JSX 取代了，必须用花括号斜杠星号这种 JSX 注释。

裸的左尖括号和左花括号会被当作标签或表达式起始而报错，要显示字面量得转义成反斜杠尖括号、反斜杠花括号，或者放进代码块。

缩进四空格的代码块在 MDX 里失效，因为缩进被 MDX 用来排布 JSX 结构，代码块只能用三反引号围栏写法。

裸 URL 不会自动变成链接，MDX 不支持 autolink，得写完整的方括号加圆括号链接语法。

空元素比如 img 忘了自闭合会报未闭合错误，必须写成带斜杠的自闭合形式。
-->

---

# 文件即 ES module（本质心智）

理解 MDX 最关键一句：**一个 `.mdx` 文件编译后就是一个 ES module**。

```js
// 前提：构建工具已配 MDX 集成，能处理 .mdx 后缀
import Post, {author} from './post.mdx'

function Page() {
  // Post 是函数组件，可渲染、传 props / components
  return <Post components={{h1: MyHeading}} />
}
```

<v-clicks>

- **默认导出** = 渲染内容的组件（官方名 `MDXContent`）
- **具名导出** = `export` 的常量/函数，外部可读（如元数据）
- ⚠️ 报「无法解析模块」多是**没配 MDX 集成**，非文件写错

</v-clicks>

<!--
理解 MDX 最关键的一句话：一个 mdx 文件编译后就是一个 ES module。

正因如此，在应用里使用一份 MDX，就是导入一个组件。import Post 拿到默认导出，同时可以用花括号 author 拿具名导出。Post 是函数组件，可以直接渲染，还能传 props 和 components。

具体来说：默认导出是一个渲染该内容的组件，官方生成名为 MDXContent 的函数组件；具名导出是你用 export 声明的常量或函数，外部可以 import 读取，常用于声明标题、日期这类元数据。

一个高频坑：如果 import 点 mdx 报无法解析该模块，多半是没在构建工具里配置 MDX 集成，因为 mdx 不是 JS 原生识别的后缀，而不是文件本身写错了。
-->

---

# 编译流程：三层 AST 管线

```text
MDX 源文本
  │  remark-parse + remark-mdx
  ▼
mdast（Markdown 树）    ← remarkPlugins
  │  remark-rehype
  ▼
hast（HTML 树）         ← rehypePlugins
  │  rehype-recma
  ▼
estree（JavaScript 树） ← recmaPlugins
  │
  ▼
JavaScript 模块（默认导出组件）
```

<div v-click class="mt-2 text-sm">

> 选层决定能拿到的节点：**remark** 管 Markdown 语法、**rehype** 管 HTML 结构、**recma** 管生成的 JS。

</div>

<!--
MDX 的编译是一条清晰的多层 AST 转换链，理解它才能对号入座地选对插件。

第一步，remark-parse 加 remark-mdx 把 MDX 源文本解析成 mdast，也就是 Markdown 语法树，remark 插件在这一层工作。第二步，remark-rehype 把 mdast 转成 hast，也就是 HTML 语法树，rehype 插件在这一层工作。第三步，rehype-recma 把 hast 转成 estree，也就是 JavaScript 语法树，recma 插件在这最后一层工作。最后序列化成 JavaScript 模块，默认导出内容组件。

选层决定你能拿到什么节点：remark 插件适合处理 Markdown 级语法，比如 GFM 表格、frontmatter、数学公式解析；rehype 插件适合更接近 HTML 输出的变换，比如语法高亮处理 pre 和 code 节点、给标题加锚点；recma 插件适合直接改写生成的 JavaScript，比如注入额外 export、改写组件函数。挂错层就拿不到期望的节点。
-->

---

# 三组 API：compile / evaluate / run

```js
import {compile, evaluate, run} from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'

// 1) 只编译出 JS 代码（最推荐，安全可缓存）
const code = String(await compile('# Hi {1 + 1}'))

// 2) 编译 + 就地运行得组件（需内容可信）
const {default: C} = await evaluate('# Hi', {...runtime})
```

<v-clicks>

- `compile` / `compileSync`：只编译，产物待运行——**首选**
- `evaluate` / `evaluateSync`：编译并执行，方便但需**可信内容**
- `run` / `runSync`：执行 `outputFormat:'function-body'` 代码（MDX on demand）

</v-clicks>

<!--
@mdx-js/mdx 暴露三组函数，对应不同使用方式。

第一组 compile 和同步版 compileSync，只做编译，把 MDX 转成可运行的 JS 代码字符串或 VFile，你负责后续运行，最推荐，安全可缓存。

第二组 evaluate 和 evaluateSync，编译加就地运行，直接在当前进程拿到组件，方便，但要求内容可信，因为等于执行任意代码。要传 JSX runtime 进去。

第三组 run 和 runSync，执行用 outputFormat function-body 编译出的代码，是 MDX on demand 也就是按需编译场景的运行侧：服务端 compile 成 function-body 存起来或传给客户端，客户端再 run 执行成组件。

官方安全建议：能用 compile 就用 compile，编译后落文件再运行；evaluate 和 run 只用于信任的内容，MDX 是编程语言，运行不可信内容等于开后门。
-->

---

# 核心编译选项

| 选项 | 默认 | 作用 |
| --- | --- | --- |
| `jsx` | `false` | `true` 保留 JSX 交下游转 |
| `jsxImportSource` | `'react'` | runtime 来源（preact/vue…） |
| `jsxRuntime` | `'automatic'` | v3 推荐 automatic |
| `providerImportSource` | — | 启用 Provider 上下文取组件 |
| `outputFormat` | `'program'` | 或 `function-body`（配合 run） |
| `format` | `'detect'` | `md`/`mdx`/按后缀 |
| `baseUrl` | — | 运行时含 import 时**必传** |

<!--
compile 和 evaluate 接受一组关键选项，挑重点讲。

jsx 默认 false，把 JSX 编译成 jsx 函数调用；设 true 则保留 JSX 语法不编译，交给下游 esbuild、Babel、Vite 再转，常用于让打包器统一处理 JSX。

jsxImportSource 默认 react，指定自动 runtime 的导入来源，Preact、Vue、Solid 要显式改。jsxRuntime 默认 automatic，v3 推荐自动 runtime，自动从来源 import jsx 函数，无需手动引入 React。

providerImportSource 设它，比如指向 @mdx-js/react，产物才会从 Provider 上下文取组件。outputFormat 默认 program 是完整 ESM 程序，function-body 是函数体配合 run 用。format 默认 detect 按 md 还是 mdx 后缀判断，md 按纯 Markdown、mdx 启用 JSX 表达式。

baseUrl 很关键，v3 里用 evaluate、run 或 function-body 且内容含 import export 时必须传，通常设成 import.meta.url，用于解析相对导入。
-->

---

# 三层插件生态

| 层 | AST | 常用插件 |
| --- | --- | --- |
| **remark** | mdast | `remark-gfm`、`remark-frontmatter`、`remark-math` |
| **rehype** | hast | `rehype-highlight`、`rehype-katex`、`rehype-slug` |
| **recma** | estree | 自定义 estree 变换 |

```js
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

await compile(file, {
  remarkPlugins: [remarkGfm],       // Markdown 层：GFM 表格/删除线
  rehypePlugins: [rehypeHighlight], // HTML 层：代码高亮
})
```

<div v-click class="text-sm">

> ⚠️ MDX 默认只 **CommonMark**，GFM 表格/任务列表需 `remark-gfm`。

</div>

<!--
三类插件分别传入对应数组，各在其 AST 层工作。

remark 插件在 mdast 也就是 Markdown 层，常用的有 remark-gfm 加表格删除线任务列表、remark-frontmatter 加 YAML 元数据、remark-math 解析数学公式。rehype 插件在 hast 也就是 HTML 层，常用的有 rehype-highlight 或 rehype-starry-night 做语法高亮、rehype-katex 渲染数学、rehype-slug 给标题加锚点。recma 插件在 estree 也就是 JS 层，一般是自定义的 estree 变换。

代码示例：import remark-gfm 和 rehype-highlight，分别放进 remarkPlugins 和 rehypePlugins 数组，一个管 Markdown 层的 GFM，一个管 HTML 层的代码高亮。

一个重点：MDX 默认只支持 CommonMark，表格、删除线、任务列表、自动链接这些 GitHub 风格特性不内置，必须显式加 remark-gfm 才有。
-->

---

# 组件映射：`components` 是核心入口

```js
const components = {
  h1: 'h2',            // 值可为字符串标签名
  a: MyLink,           // 或组件：所有链接用 MyLink
  code: MyCode,        // 覆盖 Markdown 生成的元素
  Planet: MyPlanet,    // <Planet /> 解析到 MyPlanet
}

<Post components={components} />
```

<v-clicks>

- 一个「元素名 → 实现」的映射，值可为**组件**或**字符串标签名**
- 覆盖：HTML 元素、Markdown 生成元素、JSX 组件、嵌套对象
- 一次性把 `h1`~`h6`/`a`/`code` 换成设计系统组件（注入结构与逻辑）

</v-clicks>

<!--
定制 MDX 渲染的核心是一个 components 映射对象，键是元素或组件名，值是要用来渲染它的实现。

看代码：h1 映射到字符串 h2，表示所有一级标题改用 h2 渲染，说明值可以是字符串标签名；a 映射到 MyLink 组件，所有链接用它渲染；code 覆盖 Markdown 生成的代码元素；大写 Planet 让 MDX 里的 Planet 标签解析到 MyPlanet。把这个对象作为 components prop 传给内容组件即可。

它覆盖四类目标：内置 HTML 元素、Markdown 生成的元素、MDX 里用到的 JSX 组件、以及供成员表达式用的嵌套对象。

最大价值是给内容套设计系统：一次性把 h1 到 h6、a、code、pre 这些原生元素全部替换成你设计系统里的组件。CSS 只能改样式，而组件覆盖能注入结构与逻辑，比如标题锚点、代码复制按钮、埋点。作者写标准 Markdown，渲染层统一换皮，内容与呈现解耦。
-->

---

# MDXProvider vs 传 props

```jsx
import {MDXProvider} from '@mdx-js/react'

// 方式一：直接传 prop（简单场景够用）
<Post components={{h1: MyHeading}} />

// 方式二：Provider 经上下文注入（多个嵌套 MDX 共享）
<MDXProvider components={{h1: MyHeading}}>
  <Post />
</MDXProvider>
```

<v-clicks>

- Provider 需编译时设 `providerImportSource: '@mdx-js/react'`
- 嵌套 Provider 组件映射**合并**，**内层覆盖外层**
- ⚠️ v3：`MDXContext`/`withMDXComponents` → `useMDXComponents`

</v-clicks>

<!--
把 components 交给 MDX 有两种方式。

方式一，直接传 components prop，简单直接，适合单个或少量 MDX。方式二，用 MDXProvider 经上下文注入：当应用里嵌套渲染很多 MDX、都想共享同一套映射时，逐个传 prop 很啰嗦，在外层用一次 MDXProvider，内部所有 MDX 都能从上下文拿到组件，省样板。

选择口径：简单场景传 prop 就够，有大量嵌套 MDX 需共享映射时用 Provider。

三个要点：一是用 Provider 必须在编译时设 providerImportSource 指向 @mdx-js/react，产物才会 import useMDXComponents 去读上下文；二是嵌套多层 Provider 时组件映射会合并，内层也就是更靠近内容的一层覆盖外层同名项，想精细控制可以给内层 components 传函数；三是 v3 把旧的 MDXContext 和 withMDXComponents 弃用了，统一改用 useMDXComponents。
-->

---

# 框架集成

<v-clicks>

- **Vite / Rollup** → `@mdx-js/rollup`
- **webpack** → `@mdx-js/loader`
- **esbuild / Bun** → `@mdx-js/esbuild`
- **Node.js**（直跑 `.mdx`）→ `@mdx-js/node-loader`
- **Next.js** → `@next/mdx`（内部走 webpack loader）
- **Astro** → `@astrojs/mdx`（内建）
- **Docusaurus** → 原生以 MDX 为文档格式
- **Gatsby** → `gatsby-plugin-mdx`；**Parcel** → `@parcel/transformer-mdx`

</v-clicks>

<div v-click class="mt-2 text-sm">

> `.mdx` 需构建工具注册处理器才能识别；TS 项目另装 `@types/mdx` 补类型。

</div>

<!--
mdx 不是 JS 原生识别的后缀，必须由构建工具注册处理器。按打包器和框架选集成包。

打包器侧：Vite 和 Rollup 用 @mdx-js/rollup，Vite 基于 Rollup 插件体系所以通用；webpack 用 @mdx-js/loader；esbuild 和 Bun 用 @mdx-js/esbuild；Node.js 想直接运行 mdx 用 @mdx-js/node-loader。

框架侧：Next.js 用官方 @next/mdx，内部仍走 webpack loader，帮你封装了 Next 特有配置；Astro 用官方 @astrojs/mdx 集成，内建；Docusaurus 原生就以 MDX 作为文档格式，站点里所有 md 和 mdx 都按 MDX 处理；Gatsby 用 gatsby-plugin-mdx；Parcel 用 @parcel/transformer-mdx。

编程式场景，比如服务端按需编译、构建脚本，则直接用核心的 @mdx-js/mdx。另外 TypeScript 项目要装 @types/mdx 才认识 mdx 模块类型。
-->

---

# 多框架 JSX runtime

MDX 产物依赖某个 JSX runtime，`jsxImportSource` 指定来源：

| 目标框架 | `jsxImportSource` |
| --- | --- |
| React（默认） | `'react'` |
| Preact | `'preact'` |
| Vue | `'vue'` |
| Solid | `'solid-js/h'` |
| Emotion | `'@emotion/react'` |

<div v-click class="mt-3 text-sm">

> 设错来源 → 产物 import 不到正确的 `jsx` 函数。用 Provider 时 `providerImportSource` 也要换成对应框架的包。

</div>

<!--
MDX 产物最终是 JSX 组件，依赖某个 JSX runtime 来渲染，通过 jsxImportSource 指定来源。

默认是 react，用于 React 的自动 runtime。其他框架要显式配置：Preact 设 preact，Vue 设 vue，Solid 设 solid-js 斜杠 h，Emotion 设 @emotion 斜杠 react。

设错来源会导致产物 import 不到正确的 jsx 函数，渲染直接失败。

还有一点：如果同时用 Provider 上下文注入组件，providerImportSource 也要换成对应框架的包，React 用 @mdx-js/react，Preact 用 @mdx-js/preact。框架无关是 MDX 的一大优势，但配置时要成套切换。
-->

---

# v2 → v3 关键变化

| 变化 | 说明 |
| --- | --- |
| Node 16+ | v3 要求至少 Node 16 |
| classic → **automatic** | classic 告警、趋于废弃 |
| `baseUrl` **必传** | run/evaluate/function-body 含 import 时 |
| `useDynamicImport` **移除** | 改由 `baseUrl` 解析运行时导入 |
| 上下文 API | `MDXContext` → `useMDXComponents` |
| Node loader | `@mdx-js/register` → `@mdx-js/node-loader` |

<!--
跨大版本升级，按官方迁移指南逐条核对，这是最高频的几组变化。

第一，Node 版本要求提到 16 以上。第二，如果还在用经典 JSX runtime，切换到自动 runtime，classic 会告警且趋于废弃，所有主流框架都支持 automatic。第三，用 run、evaluate 或 outputFormat function-body，且内容含 import export 或 import.meta.url 时，必须传 baseUrl，通常设为 import.meta.url。

第四，v2 时代控制动态导入的 useDynamicImport 选项在 v3 已移除，改由 baseUrl 解析运行时的相对导入。第五，基于 context 的 MDXContext 和高阶组件 withMDXComponents 弃用，统一改用 useMDXComponents。第六，废弃的 @mdx-js/register 改用 @mdx-js/node-loader。

另外，如果用了 rehype 和 remark 插件也要更新，内部类型和解析有变化，remark-gfm、remark-math 这些要升到兼容版本。
-->

---

# 常见坑 Top 8

<v-clicks>

- `.mdx` 无法解析：**没配 MDX 集成**（loader/插件），非文件错
- 自定义组件没生效：**组件名小写**被当字面元素
- `<img>` 报未闭合：JSX 要求闭合，写 `<img />`
- 缩进代码块失效：缩进用于排布 JSX，改**围栏**
- HTML 注释无效：改 `{/* ... */}`
- 组件内 `**加粗**` 原样输出：块级 JSX 内不解析 md，**空行分隔**
- `evaluate` 含 import 报错：缺 `baseUrl`，传 `import.meta.url`
- RSC 下交互组件报错：MDX 默认 server 组件，交互组件加 `'use client'`

</v-clicks>

<!--
过一遍最高频的八个坑。

第一，import 点 mdx 无法解析，多半是没在构建工具里配置 MDX 集成，而非文件写错。第二，自定义组件没生效，往往是组件名小写开头被当成字面 HTML 元素，要首字母大写。第三，img 报未闭合，JSX 要求标签闭合，写成带斜杠的自闭合。第四，缩进代码块失效，因为缩进被 MDX 用于排布 JSX，改用围栏代码块。

第五，HTML 注释不被支持，改用花括号斜杠星号。第六，组件内部的加粗原样输出，因为块级 JSX 内跨行内容默认不解析 Markdown，要用空行把内容分隔成独立块。第七，evaluate 或 run 时内容含 import 报错，是缺了 baseUrl，传 import.meta.url。第八，Next.js App Router 也就是 RSC 环境下，MDX 编译出的组件默认是服务端组件，不能直接用 useState 或事件，交互组件要单独放到带 use client 指令的文件里再 import 使用。
-->

---
layout: intro
---

# 总结

MDX = **Markdown + JSX 的融合格式**，Markdown 超集

- 四类内容：Markdown / JSX 元素 / `{表达式}` / ESM
- 文件即模块：默认导出内容组件、具名导出元数据
- 管线：mdast → hast → estree → JS，三层插件各司其职
- 组件映射：`components` prop / `MDXProvider` 覆盖原生元素
- 集成：Vite/webpack/Next/Astro/Docusaurus；runtime 可切多框架
- v3：automatic runtime、`baseUrl` 必传；是编程语言，**不可信内容不安全**

<!--
总结一下。MDX 是 Markdown 加 JSX 的融合格式，是 Markdown 的超集。

核心心智：文件里四类内容混排，Markdown 正文、JSX 元素、花括号表达式、ESM 的 import export；文件即 ES module，默认导出渲染内容的组件、具名导出元数据；编译走 mdast 到 hast 到 estree 再到 JS 的管线，remark、rehype、recma 三层插件各司其职。

定制渲染靠 components 映射或 MDXProvider，可以把 h1 到 h6、a、code 这些原生元素一次性换成设计系统组件。集成上，Vite、webpack、esbuild 各有包，Next.js、Astro、Docusaurus 一等支持，jsxImportSource 还能切到 Preact、Vue、Solid 等多框架。

2026 年现状：主线 v3，实测 3.1.1，默认自动 JSX runtime，运行时含导入要传 baseUrl。最后再强调一次安全红线：MDX 是一门编程语言，会执行代码，绝不能把不可信来源的内容直接当 MDX 编译执行。谢谢大家。
-->
