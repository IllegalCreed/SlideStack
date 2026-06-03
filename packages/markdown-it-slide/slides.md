---
theme: seriph
background: https://cover.sli.dev
title: Welcome to markdown-it
info: |
  Presentation markdown-it — the CommonMark parser.

  Learn more at [https://github.com/markdown-it/markdown-it](https://github.com/markdown-it/markdown-it)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📝</span>
</div>

<br/>

## markdown-it — 高速的 CommonMark 解析器

100% CommonMark 合规的 JS Markdown 解析器/渲染器，token 流模型 + 强大插件系统 —— VitePress 等众多工具的 Markdown 引擎（当前 v14.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/markdown-it/markdown-it" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 markdown-it —— Vitaly Puzrin 与 Alex Kocharin 维护的高速 Markdown 解析器/渲染器。

定位一句话：高速、100% 遵循 CommonMark 规范、可深度定制的 Markdown 转 HTML 引擎，当前 v14。

最关键的架构认知：markdown-it 不构建嵌套 AST，而是先把 Markdown 解析成一串扁平的 Token 流，
再逐 token 渲染成 HTML —— 这是它和 remark/unified（AST 生态）的根本区别，
也和 marked（更快更简、扩展点少）不同。

它结合严格 CommonMark + 可选扩展 + 排版糖 + 强大的插件系统。VitePress 底层就是 markdown-it 加 mdit-vue。

后面顺序：定位 → 对比 → 核心 API → 选项与安全 → 插件 → Token 流与渲染器 →
架构三级 Ruler → 踩坑 → 总结。
-->

---
transition: fade-out
---

# 什么是 markdown-it？

高速、CommonMark 合规、token 流模型

<v-clicks>

- **100% CommonMark + 扩展**：严格遵循规范，可选开启表格、删除线等 GFM 风格 + 排版糖
- **Token 流，不是 AST**：先 parse 成扁平 Token 数组，再逐 token 渲染 —— 定制靠覆盖 `renderer.rules`
- **插件化**：`.use()` 加载海量 `markdown-it-*` 插件（锚点、容器、属性、任务列表…）
- **安全默认**：`html: false` 默认转义原始 HTML
- **高速**：优化过的解析器，渲染大量 Markdown 仍快
- **被广泛采用**：VitePress（底层 + mdit-vue）、众多 SSG 与文档工具的 Markdown 引擎

</v-clicks>

<style>
h1 {
  background-color: #16A34A;
  background-image: linear-gradient(45deg, #16A34A 10%, #4ADE80 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 100% CommonMark 加可选扩展，严格遵循规范同时能开 GFM 风格扩展和排版糖。
[click] 核心架构：token 流不是 AST，先 parse 成扁平 Token 数组再逐 token 渲染，定制靠覆盖 renderer.rules。
[click] 插件化，.use() 加载海量 markdown-it 插件。
[click] 安全默认，html false 默认转义原始 HTML。
[click] 高速，优化过的解析器。
[click] 被广泛采用，VitePress 底层就是 markdown-it 加 mdit-vue。
-->

---
transition: fade-out
---

# 与 marked / remark 的区别

token 流，介于 marked 的简快与 remark 的 AST 之间

<v-click>

| 维度 | markdown-it | marked | remark/unified |
|---|---|---|---|
| 模型 | **Token 流** | 直接渲染 | **AST (mdast)** |
| 规范 | **100% CommonMark** | CommonMark/GFM | CommonMark+ |
| 扩展 | **插件丰富、定制强** | 较少 | **AST 转换最强** |
| 速度 | 快 | **更快更小** | 较重 |

</v-click>

<v-click>

> 💡 转 HTML + 丰富插件 + 定制渲染选 markdown-it（VitePress 底层）；简单快速用 marked；AST 级转换/lint 用 remark/unified。

</v-click>

<style>
h1 {
  background-color: #16A34A;
  background-image: linear-gradient(45deg, #16A34A 10%, #4ADE80 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三者对比：markdown-it 是 token 流、100% CommonMark、插件丰富、速度快；
marked 直接渲染、更快更小但扩展少；remark/unified 是 AST 模型、转换能力最强但较重。
[click] 结论：要转 HTML 加丰富插件加定制渲染选 markdown-it；要简单快速用 marked；要 AST 级转换或 lint 用 remark/unified。
-->

---
transition: fade-out
---

# 核心 API

```js
import markdownit from 'markdown-it'

// 默认导出即构造器，可不加 new；预设 commonmark/default/zero
const md = markdownit()                  // default：全开
const strict = markdownit('commonmark')  // 严格 CommonMark
const minimal = markdownit('zero', { html: true }) // 预设 + 选项组合

md.render('**bold**')        // → <p><strong>bold</strong></p>（块级裹 <p>）
md.renderInline('**bold**')  // → <strong>bold</strong>（行内，不裹 <p>）
md.parse(src, env)           // → Token[]（扁平 token 流，非 AST）

md.use(plugin, opts)         // 链式加载插件
  .enable(['link']).disable(['image']) // 开关规则（未知名抛错，除非 ignoreInvalid）
```

<style>
h1 {
  background-color: #16A34A;
  background-image: linear-gradient(45deg, #16A34A 10%, #4ADE80 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
核心 API 极简：
markdownit 默认导出即构造器，可不加 new。预设三种：commonmark 严格、default 全开、zero 全禁，可与选项组合。
render 渲染完整 HTML 块级裹 p；renderInline 渲染行内不裹 p；parse 返回扁平 Token 数组而非 AST。
use 链式加载插件；enable/disable 开关规则，注意未知规则名会抛错除非传 ignoreInvalid true。
-->

---
transition: fade-out
---

# 核心选项与安全

```js
const md = markdownit({
  html: false,        // 默认 false：转义原始 HTML（安全）；true=原样输出（不安全！）
  linkify: true,      // 自动把 URL 文本变成链接
  typographer: true,  // 智能引号/破折号（quotes 仅在此开启时生效）
  breaks: false,      // true: 段落内 \n → <br>
  highlight(str, lang) { return '' }, // 高亮回调（接 Shiki/highlight.js/Prism）
})
```

<v-click>

> ⚠️ **`html: true` 不安全** —— markdown-it 不做 sanitize，处理不可信输入**必须**配 `DOMPurify`。`highlight` 返回以 `<pre` 开头的串会跳过默认 `<pre><code>` 包裹。

</v-click>

<style>
h1 {
  background-color: #16A34A;
  background-image: linear-gradient(45deg, #16A34A 10%, #4ADE80 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
核心选项默认都偏保守：
html 默认 false 转义原始 HTML 是安全的；linkify 自动链接 URL；typographer 排版糖，注意 quotes 只在 typographer 开启时生效；
breaks 把段落内换行转 br；highlight 是代码高亮回调，可接 Shiki、highlight.js、Prism。

[click] 最重要的安全点：html true 不安全，markdown-it 本身不 sanitize，处理用户内容必须配 DOMPurify。
还有 highlight 返回以 <pre 开头的字符串会跳过 markdown-it 自己的 pre code 包裹。
-->

---
transition: fade-out
---

# 插件 .use()

```js
import markdownit from 'markdown-it'
import anchor from 'markdown-it-anchor'
import container from 'markdown-it-container'

const md = markdownit()
  .use(anchor)            // 标题锚点
  .use(container, 'tip')  // ::: tip 容器（VitePress 风格）
// 插件签名 function(md, ...params) {} —— 直接改 md 实例并返回，故可链式
```

<v-clicks>

- 常用：`markdown-it-anchor`（锚点）/ `markdown-it-attrs`（`{.class #id}`）/ `markdown-it-container`（`:::` 容器）/ `markdown-it-emoji` / `markdown-it-footnote` / `markdown-it-task-lists`
- 高亮插件：`markdown-it-highlightjs` / `markdown-it-prism`（也可用 `options.highlight` 接 Shiki）
- **VitePress** 用 `mdit-vue` + `@mdit/plugin-*` 在 markdown-it 之上做 Vue 增强

</v-clicks>

<style>
h1 {
  background-color: #16A34A;
  background-image: linear-gradient(45deg, #16A34A 10%, #4ADE80 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
插件用 .use 链式加载，签名是 function(md, ...params)，直接修改传入的 md 实例并返回它，所以可链式。

[click] 常用插件：anchor 锚点、attrs 行内属性、container 自定义容器、emoji、footnote 脚注、task-lists 任务列表。
[click] 高亮插件 markdown-it-highlightjs 和 markdown-it-prism，也可以用 options.highlight 直接接 Shiki。
[click] VitePress 用 mdit-vue 和 @mdit/plugin 系列在 markdown-it 之上做 Vue 增强。
-->

---
transition: fade-out
---

# Token 流与渲染器

```js
// markdown-it parse 成扁平 Token[]，Token.nesting: 1 开 / 0 自闭 / -1 闭
// 覆盖某类 token 渲染：function(tokens, idx, options, env, self) => htmlString
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet('target', '_blank')   // attrGet/attrSet/attrPush/attrJoin
  return self.renderToken(tokens, idx, options) // 无默认规则 → renderToken 兜底
}
```

<v-clicks>

- Token 字段：`type` / `tag` / `nesting` / `attrs` / `content` / `children` / `markup` / `info` / `map` / `block` / `hidden`
- ⚠️ 多数 `*_open` token（`paragraph_open`/`link_open`…）**无默认规则**，覆盖时调 `self.renderToken` 兜底
- 辅助：`renderAttrs` / `renderInline` / `renderInlineAsText`（图片 alt 专用）

</v-clicks>

<style>
h1 {
  background-color: #16A34A;
  background-image: linear-gradient(45deg, #16A34A 10%, #4ADE80 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
markdown-it parse 成扁平 Token 数组。Token.nesting 取值 1 开标签、0 自闭、-1 闭标签。
覆盖某类 token 渲染：renderer.rules.类型 = 函数 (tokens, idx, options, env, self) 返回 HTML 字符串。
代码示例给链接加 target=_blank，用 attrSet 改属性，再调 self.renderToken 兜底。

[click] Token 字段：type、tag、nesting、attrs、content、children、markup、info、map、block、hidden。
[click] 一个坑：多数 _open token 比如 paragraph_open、link_open 没有默认渲染规则，覆盖时要调 self.renderToken 兜底。
[click] 辅助方法：renderAttrs、renderInline、renderInlineAsText 图片 alt 专用。
属性方法 attrGet、attrSet、attrPush、attrJoin。
-->

---
transition: fade-out
---

# 架构：core/block/inline 三级 Ruler

```js
// 源码 → core 链 → block 链(生成块 token) → inline 链(解析行内) → Token[] → renderer → HTML
md.inline.ruler.before('emphasis', 'my_rule', (state, silent) => { /* ... */ })
md.core.ruler.push('my_core', (state) => { /* 后处理 token */ })
// Ruler: before / after / push / at / enable / disable
```

<v-clicks>

- 三级解析器各带一条 **Ruler**，可 `before` / `after` / `push` / `at` 插入自定义规则
- **`env` 沙箱**：`render(src, env)` 的 `env` 是一次渲染内跨规则/插件共享的数据对象（脚注、引用），**不是选项**
- 安全：`html:false` 默认转义（安全）；`html:true` 需 `DOMPurify`；`linkify` 用 linkify-it

</v-clicks>

<style>
h1 {
  background-color: #16A34A;
  background-image: linear-gradient(45deg, #16A34A 10%, #4ADE80 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
架构是三级解析器：core、block、inline。源码经 core 链、block 链生成块 token、inline 链解析行内，
得到 Token 数组，再由 renderer 渲染成 HTML。

[click] 每级带一条 Ruler，可用 before、after、push、at 插入自定义规则。
[click] env 沙箱：render 的第二个参数 env 是一次渲染内跨规则和插件共享的数据对象，比如脚注、引用定义，注意它不是选项。
[click] 安全：html false 默认转义安全；html true 需 DOMPurify；linkify 用 linkify-it 库。
-->

---
layout: center
class: text-center
transition: slide-up
---

# 总结 & 资源

markdown-it = 高速 CommonMark 解析器，token 流 + 插件化

<div class="text-left max-w-2xl mx-auto mt-4">

- **100% CommonMark**：预设 commonmark/default/zero，可选扩展 + 排版糖
- **Token 流非 AST**：覆盖 `renderer.rules` 精确定制 HTML 输出
- **插件丰富**：`.use()` 加载锚点/容器/属性…；VitePress 底层引擎
- **安全默认**：`html:false` 转义；`html:true` 需 DOMPurify

</div>

<div class="mt-6 text-sm opacity-80">
  README github.com/markdown-it/markdown-it · API markdown-it.github.io/markdown-it · npm markdown-it
</div>

<style>
h1 {
  background-color: #16A34A;
  background-image: linear-gradient(45deg, #16A34A 10%, #4ADE80 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
收尾总结：
- markdown-it 是高速 CommonMark 解析器，token 流加插件化。预设 commonmark/default/zero，可选扩展和排版糖。
- token 流非 AST，覆盖 renderer.rules 精确定制 HTML 输出。
- 插件丰富，.use 加载锚点、容器、属性等；VitePress 底层就是它。
- 安全默认 html false 转义；html true 需配 DOMPurify。

资源：README、API 文档、npm 包 markdown-it。谢谢！
-->
