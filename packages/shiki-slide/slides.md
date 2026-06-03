---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Shiki
info: |
  Presentation Shiki — the beautiful syntax highlighter.

  Learn more at [https://shiki.style](https://shiki.style)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎨</span>
</div>

<br/>

## Shiki — 精确又好看的语法高亮器

用 VS Code 同款的 TextMate 语法 + VS Code 主题，把代码渲染成内联样式 HTML，高亮效果与 VS Code 一致；零运行时（当前 v4.x，Pine Wu 创建 / Anthony Fu 维护）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/shikijs/shiki" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Shiki —— Pine Wu 创建、Anthony Fu 维护的精确语法高亮器。

定位一句话：用 VS Code 同款的 TextMate 语法和 VS Code 主题，把代码高亮成内联样式 HTML，
效果与 VS Code 编辑器完全一致。

核心路线是「精确 + 零运行时」：基于真实 TextMate 语法做 scope 着色，精度媲美 VS Code；
可以在构建期或服务端把代码高亮成静态 HTML，前端无需任何 Shiki 运行时 JS。
代价是 grammar 体积大、传统上需异步加载。

VitePress、Astro、Slidev、Nuxt 文档的代码高亮默认都是 Shiki。当前 v4.x。

后面顺序：定位 → 对比 Prism/highlight.js → 核心 API → 双主题 → 转换器 →
两种正则引擎 → 细粒度打包与集成 → 踩坑 → 总结。
-->

---
transition: fade-out
---

# 什么是 Shiki？

VS Code 级精确高亮 + 零运行时

<v-clicks>

- **TextMate 语法 + VS Code 主题**：用真实语法做 scope 着色，结果与 VS Code 一致
- **输出内联样式 HTML**：`<pre class="shiki">` + 每个 token 颜色写在 style 里，无需外部 CSS
- **零运行时**：构建期/服务端高亮成静态 HTML，前端无需 Shiki 的 JS
- **复用 VS Code 主题**：nord / vitesse / catppuccin / min-light 等大量内置
- **shikiji 已合并回 Shiki**：ESM、细粒度打包、双主题等改进并入主线
- **被广泛采用**：VitePress / Astro / Slidev / Nuxt 默认高亮

</v-clicks>

<style>
h1 {
  background-color: #CA8A04;
  background-image: linear-gradient(45deg, #CA8A04 10%, #F59E0B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] TextMate 语法 + VS Code 主题，用真实语法做 scope 着色，结果与 VS Code 一致。
[click] 输出内联样式 HTML，每个 token 颜色直接写在 style 属性，无需外部 CSS。
[click] 零运行时，构建期/服务端高亮成静态 HTML，前端无需 Shiki 的 JS。
[click] 复用 VS Code 主题生态，内置 nord、vitesse、catppuccin、min-light 等大量主题。
[click] shikiji 这个分叉的改进已经合并回 Shiki 主线，现在直接用 shiki。
[click] VitePress、Astro、Slidev、Nuxt 文档的代码高亮默认都是 Shiki。
-->

---
transition: fade-out
---

# 与 Prism.js / highlight.js 的区别

精确 + 零运行时 vs 轻量 + 客户端运行时

<v-click>

| 维度 | Shiki | Prism.js | highlight.js |
|---|---|---|---|
| 引擎 | **TextMate（同 VS Code）** | 自有正则 | 自有正则 |
| 精度 | **高** | 中 | 中 |
| 输出 | **内联样式 HTML** | CSS class | CSS class |
| 运行时 | **可零运行时** | 客户端 | 客户端 |
| 体积 | 较重（异步） | **轻** | 轻 |

</v-click>

<v-click>

> 💡 要「VS Code 级精确 + 零运行时」选 Shiki（文档/博客构建期）；要「极小体积 + 纯客户端实时」可能仍选 Prism。

</v-click>

<style>
h1 {
  background-color: #CA8A04;
  background-image: linear-gradient(45deg, #CA8A04 10%, #F59E0B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 对比三者：Shiki 用 TextMate 语法精度高、输出内联样式、可零运行时，但体积较重需异步；
Prism 和 highlight.js 用自有正则、精度中等、输出 CSS class、客户端运行时、但很轻。
[click] 结论：要精确和零运行时选 Shiki（文档博客构建期高亮）；要极小体积纯客户端实时可能仍选 Prism。
-->

---
transition: fade-out
---

# 核心 API：简写 vs 单例

```ts
// ① 简写函数：最简单，内部用单例自动按需加载（async）
import { codeToHtml } from 'shiki'
const html = await codeToHtml('const a = 1', { lang: 'ts', theme: 'nord' })

// ② 显式单例：多次高亮推荐（v1 起 getHighlighter → createHighlighter）
import { createHighlighter } from 'shiki'
const hl = await createHighlighter({ themes: ['nord'], langs: ['ts'] })
const out = hl.codeToHtml(code, { lang: 'ts', theme: 'nord' }) // 实例方法同步
await hl.loadLanguage('css')   // 动态加载更多
```

<v-click>

> ⚠️ `createHighlighter` 实例**必须当长生命周期单例复用** —— 每次创建都重载 WASM + grammar，渲染里反复创建会内存泄漏。还有 `codeToHast`（→HAST）/ `codeToTokens`（→token）。

</v-click>

<style>
h1 {
  background-color: #CA8A04;
  background-image: linear-gradient(45deg, #CA8A04 10%, #F59E0B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
核心 API 两种用法：
① 简写函数 codeToHtml，最简单，内部用单例自动按需加载 grammar，是 async 的。
② 显式单例 createHighlighter，多次高亮推荐。注意 v1 起 getHighlighter 改名 createHighlighter。
实例方法 codeToHtml 是同步的，还能 loadLanguage / loadTheme 动态加载更多。

[click] 一个大坑：createHighlighter 的实例必须当长生命周期单例复用，
每次创建都重新加载 WASM 和 grammar，在渲染里反复创建会内存泄漏。
还有 codeToHast 输出 HAST 树、codeToTokens 输出 token 数组供自定义渲染。
-->

---
transition: fade-out
---

# 双主题（明暗切换）

```ts
const html = await codeToHtml(code, {
  lang: 'js',
  themes: { light: 'min-light', dark: 'nord' },  // 用 themes 代替 theme
})
// token 输出：style="color:#1976D2;--shiki-dark:#D8DEE9"
```

```css
/* 双主题不自动切换，需自己写 CSS（!important 覆盖内联色） */
html.dark .shiki, html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
```

<v-click>

> 💡 `defaultColor: false` → 只出 CSS 变量（无内联色）；`defaultColor: 'light-dark()'` → 用原生 CSS `light-dark()`；`cssVariablePrefix` 改前缀。

</v-click>

<style>
h1 {
  background-color: #CA8A04;
  background-image: linear-gradient(45deg, #CA8A04 10%, #F59E0B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
双主题：用 themes 对象代替单个 theme，传 light 和 dark。
输出时默认色内联，其它主题写成 CSS 变量，比如 --shiki-dark。

关键：双主题不会自动切换，需要自己写 CSS，用 !important 覆盖 .shiki span 的颜色为 var(--shiki-dark)，
触发条件可用 html.dark class 或 prefers-color-scheme 媒体查询。

[click] 几个选项：defaultColor false 只出 CSS 变量无内联色；
defaultColor 'light-dark()' 用原生 CSS light-dark 函数（新浏览器）；cssVariablePrefix 改变量前缀。
-->

---
transition: fade-out
---

# 转换器 @shikijs/transformers

通过 `transformers: [...]` 增强高亮

<v-clicks>

- **Notation 系（写在注释里）**：`transformerNotationDiff`（`// [!code ++]` / `[!code --]`）、`transformerNotationHighlight`（`[!code highlight]`）、`transformerNotationFocus`（`[!code focus]`）、`transformerNotationWordHighlight`（`[!code word:X]`）
- **Meta 系（写在围栏里）**：`transformerMetaHighlight`（` ```js {1,3-4} `）、`transformerMetaWordHighlight`（` ```js /Hello/ `）
- **hook 执行顺序**：`preprocess → tokens → span → line → code → postprocess`
- ⚠️ **转换器只加 class / data 属性，不附带视觉 CSS** —— diff 的红绿底、focus 的模糊得自己写 CSS
- ⚠️ `postprocess` **只在 `codeToHtml` 下触发**，`codeToHast` 不触发

</v-clicks>

<style>
h1 {
  background-color: #CA8A04;
  background-image: linear-gradient(45deg, #CA8A04 10%, #F59E0B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 转换器分两系。Notation 系写在代码注释里：
transformerNotationDiff 用 // [!code ++] 和 // [!code --] 标增删行，
transformerNotationHighlight 行高亮，transformerNotationFocus 聚焦，transformerNotationWordHighlight 词高亮。
[click] Meta 系写在代码围栏的 meta 串里：transformerMetaHighlight 用 {1,3-4} 高亮行，
transformerMetaWordHighlight 用斜杠词高亮。VitePress 的代码块特性就基于这些。
[click] 自定义转换器的 hook 执行顺序：preprocess、tokens、span、line、code、postprocess。
[click] 关键坑：转换器只给元素加 class 和 data 属性，不附带视觉 CSS，diff 的红绿底、focus 的模糊都要自己写 CSS。
[click] 另一个坑：postprocess 钩子只在 codeToHtml 下触发，用 codeToHast 时不触发。
-->

---
transition: fade-out
---

# 两种正则引擎 & 细粒度打包

<v-clicks>

- **Oniguruma（默认，WASM）**：`createOnigurumaEngine(import('shiki/wasm'))` —— **最大兼容、最准**
- **JavaScript RegExp 引擎**：`createJavaScriptRegexEngine()` —— 更轻、浏览器/Workers 友好、**可完全同步**；但部分复杂语法不兼容（`forgiving: true` 容错）
- **细粒度打包**：`createHighlighterCore`（`shiki/core`）+ 显式 import `@shikijs/themes/*` · `@shikijs/langs/*` + 指定 engine → bundle 最小
- **同步高亮**：`createHighlighterCoreSync`（全部主题/语言传对象 + JS 引擎）
- **集成包**：`@shikijs/rehype` / `@shikijs/markdown-it` / `@shikijs/twoslash`（类型悬浮）/ `@shikijs/monaco` / `@shikijs/cli`

</v-clicks>

<style>
h1 {
  background-color: #CA8A04;
  background-image: linear-gradient(45deg, #CA8A04 10%, #F59E0B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 两种正则引擎。Oniguruma 是默认的 WASM 引擎，最大兼容、最准。
[click] JavaScript RegExp 引擎更轻、浏览器和 Cloudflare Workers 友好、可完全同步，
但部分复杂语法的正则不兼容，可用 forgiving 容错。
[click] 细粒度打包：用 createHighlighterCore 从 shiki/core，显式 import 需要的主题和语言，再指定引擎，bundle 最小。
[click] 同步高亮用 createHighlighterCoreSync，要求所有主题语言以对象传入加 JS 引擎。
[click] 集成包丰富：rehype、markdown-it、twoslash 类型悬浮、monaco、cli。VitePress 内置 Shiki 无需手动装。
-->

---
transition: fade-out
---

# 常见坑

<v-clicks>

- **`createHighlighter` 必须复用单例**：反复创建重载 WASM/grammar → 内存泄漏；缓存或用 `getSingletonHighlighter`
- **转换器不附带 CSS**：只加 class/data 属性，视觉样式自己写
- **`postprocess` 仅 `codeToHtml`**：`codeToHast` 不触发
- **JS 引擎不完全兼容**：部分语法不行，需 `forgiving` 或回退 Oniguruma
- **`getHighlighter` 已改名**：v1 起用 `createHighlighter`
- **双主题不自动切换**：自己写 CSS 用 `!important` 覆盖 `--shiki-dark`
- **完整 bundle 较重**：浏览器/Workers 用细粒度 core + JS 引擎
- **简写 async、实例方法 sync**：`codeToHtml` 简写要 await

</v-clicks>

<style>
h1 {
  background-color: #CA8A04;
  background-image: linear-gradient(45deg, #CA8A04 10%, #F59E0B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] createHighlighter 必须复用单例，反复创建重载 WASM 和 grammar 会内存泄漏。
[click] 转换器不附带 CSS，视觉样式自己写。
[click] postprocess 钩子仅 codeToHtml 触发。
[click] JS 引擎部分语法不兼容，需 forgiving 或回退 Oniguruma。
[click] getHighlighter 在 v1 已改名 createHighlighter。
[click] 双主题不自动切换，自己写 CSS 用 !important 覆盖 --shiki-dark。
[click] 完整 bundle 较重，浏览器和 Workers 用细粒度 core 加 JS 引擎。
[click] 简写函数是 async 要 await，实例方法是同步的。
-->

---
layout: center
class: text-center
transition: slide-up
---

# 总结 & 资源

Shiki = VS Code 级精确高亮 + 零运行时

<div class="text-left max-w-2xl mx-auto mt-4">

- **精确**：TextMate 语法（同 VS Code），结果与编辑器一致
- **零运行时**：构建期高亮成内联样式 HTML，前端无需 JS
- **双主题 + 转换器**：CSS 变量明暗切换；`@shikijs/transformers` 做 diff/行高亮（需自写 CSS）
- **可控体积**：两种引擎 + 细粒度 `createHighlighterCore`；记得单例复用

</div>

<div class="mt-6 text-sm opacity-80">
  官网 shiki.style · GitHub shikijs/shiki · npm shiki
</div>

<style>
h1 {
  background-color: #CA8A04;
  background-image: linear-gradient(45deg, #CA8A04 10%, #F59E0B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
收尾总结：
- Shiki 用 TextMate 语法做 VS Code 级精确高亮，结果与编辑器一致。
- 零运行时，构建期把代码高亮成内联样式 HTML，前端无需 JS。
- 双主题用 CSS 变量明暗切换；@shikijs/transformers 做 diff、行高亮，但需自己写 CSS。
- 体积可控：两种正则引擎加细粒度 createHighlighterCore；记得 highlighter 单例复用。

资源：官网 shiki.style、GitHub shikijs/shiki、npm 包 shiki。谢谢！
-->
