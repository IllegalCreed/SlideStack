---
theme: seriph
background: https://cover.sli.dev
title: Welcome to UnoCSS
info: |
  Presentation UnoCSS —— 即时按需的原子化 CSS 引擎。

  Learn more at [https://unocss.dev](https://unocss.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">⚡</span>
</div>

<br/>

## UnoCSS —— 即时按需的原子化 CSS 引擎

no core utilities、一切来自 preset 的同构引擎，当前 v66.7.4

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/unocss/unocss" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 UnoCSS —— 即时按需的原子化 CSS 引擎，由 Anthony Fu 发起，被视为 Windi CSS 的精神续作。

三个关键词：即时（无 AST、无扫描）、按需（只生成用到的类）、引擎（内核不预置任何工具类，一切来自 preset）。当前主线 v66.7.4。

今天的顺序：定位 → 引擎 vs 框架 → no core utilities → 安装接入 → 配置骨架 → 预设体系两页 → rules → shortcuts → variants → 指令两页 → 属性化 → 纯 CSS 图标 → pnpm 踩坑 → 配置全景 → layers 与 CDN 运行时 → Wind4 迁移 → 易错点 → 选型与总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 UnoCSS？

即时按需的原子化 CSS 引擎，一切皆可编程：

<v-clicks>

- 无解析 / 无 AST / 无扫描，约 5x 于 Windi/TW JIT
- 零依赖，内核约 6kb（min+brotli）
- 同构引擎：Vite / CLI / ESLint / CDN 运行时
- 纯 CSS 图标、属性化、变体分组等 DX 创新

</v-clicks>

<div v-click class="mt-6">

但要认清边界：

- 内核无工具类，不配 preset 就啥都没有
- 不支持 Tailwind 插件生态，重度定制迁移要重写

</div>

<!--
为什么用 UnoCSS？它是即时按需的原子化 CSS 引擎，最大卖点是灵活可编程与性能。

性能上，它无解析、无 AST、无大范围扫描，官方称约为 Windi CSS、Tailwind JIT 的 5 倍；零依赖，内核只有约 6kb。它是同构引擎，不绑定 PostCSS，能跑在 Vite、CLI、ESLint，甚至一行 CDN script 的浏览器运行时里。DX 上有纯 CSS 图标、属性化、变体分组等一批创新。

但边界也要讲清楚：no core utilities 意味着装了 UnoCSS 但不配 preset，页面上一个工具类都不会生成；而且官方明确不支持 Tailwind 的插件系统，重度定制的 Tailwind 项目迁移时这部分要重写。
-->

---

# 引擎 vs 框架：与 Tailwind 的根本分野

| 维度 | UnoCSS | Tailwind CSS |
| --- | --- | --- |
| 本质 | **引擎**（内核无工具类） | **框架**（内建约定与工具类） |
| 工作形态 | 同构引擎（Vite/CLI/CDN 运行时） | 主要是 PostCSS 插件 |
| 工具类来源 | preset（可自定义/封装复用） | 框架内建 + 插件 |
| 独有能力 | 纯 CSS 图标 / 属性化 / 变体分组 | 成熟插件生态 / 海量模板 |
| 插件系统 | 不支持 Tailwind 插件 | 有官方/社区插件 |

<div v-click class="mt-4 text-sm">

> 一句话：要 Tailwind 那套齐全工具类 → `presetWind3/Wind4`（兼容度高）；要自建设计系统、极致灵活性能 → `presetMini` 或从零写 rules。

</div>

<!--
UnoCSS 和 Tailwind 最根本的区别是引擎 vs 框架。

Tailwind 是一个框架，内建一整套预置的设计约定和工具类，主要作为 PostCSS 插件工作。UnoCSS 是一个引擎，内核不含任何工具类，一切通过 preset 配置，而且是同构的，能跑在多种宿主环境。

工具类来源上，UnoCSS 全靠 preset，且可以自定义、封装成 preset 跨项目复用；独有能力上，纯 CSS 图标、属性化、变体分组都是 UnoCSS 的特色；但 Tailwind 有更成熟的插件生态和海量社区模板，UnoCSS 明确不支持 Tailwind 插件。

选型一句话：要 Tailwind 那套齐全工具类就用 presetWind3 或 Wind4，兼容度很高；要自建设计系统、追求极致灵活和性能，就用 presetMini 甚至从零写 rules。
-->

---

# no core utilities：一切来自 preset

UnoCSS 内核**不预置任何工具类**——`flex`、`m-4`、`text-red` 全部来自 preset。

<v-clicks>

- 装了 UnoCSS 但不配 preset → **一个类都不生成**
- 要 Tailwind 风格 → `presets: [presetWind4()]`
- 团队设计系统 → 封装成自定义 preset 跨项目复用

</v-clicks>

<div v-click class="mt-4">

**按需（on-demand）**：只为源码里真实用到的类生成 CSS

- 产物体积只与实际使用的类相关，天生无冗余
- 无需像早期 Tailwind 那样配 purge 删无用类

</div>

<!--
no core utilities 是 UnoCSS 最核心的设计哲学：引擎内核不内建任何工具类，flex、m-4、text-red 这些常见类全部来自 preset。

这带来一个最容易让新手困惑的点：装了 UnoCSS 但没配任何 preset，页面上一个工具类都不会生成。要 Tailwind 风格就引 presetWind4；团队的设计系统可以封装成自定义 preset，各项目引一下就复用了。

另一个核心是按需：UnoCSS 只为源码里真实出现过的工具类生成 CSS，没用到的一律不生成，所以产物体积只与你实际使用的类相关，天生无冗余，也不需要像早期 Tailwind 那样配 purge 去删没用的类。
-->

---

# 安装与 Vite 接入（含头号坑）

```ts
// vite.config.ts
import UnoCSS from 'unocss/vite'          // 插件在 unocss/vite 子路径
export default defineConfig({
  plugins: [UnoCSS()],
})
```

```ts
// main.ts —— 关键一步，漏了则所有工具类失效
import 'virtual:uno.css'
```

<div v-click class="mt-3 text-sm">

> ⚠️ Vite 插件通过「虚拟模块」注入生成的样式表，**必须**在入口 `import 'virtual:uno.css'`。「接入后样式完全没出来」十有八九就是漏了这行。

</div>

<!--
安装很简单，pnpm add -D unocss，它是个 meta 包，主入口还导出了 defineConfig 和各个 preset、transformer。

Vite 接入两步：第一步在 vite.config.ts 里从 unocss/vite 子路径导入插件，放进 plugins 数组；第二步是关键，必须在入口文件 main.ts 里 import 'virtual:uno.css'。

UnoCSS 的 Vite 插件通过虚拟模块注入生成的样式表，如果漏了这一行，页面上所有工具类都不会生效。接入后样式完全没出来，十有八九就是漏了这行导入，这是最常见的第一个坑。
-->

---

# uno.config.ts 配置骨架

约定用 `uno.config.ts` + `defineConfig()`，完整类型提示：

```ts
import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [presetWind4()],   // 工具类来源
  rules: [],                  // 自定义原子规则
  shortcuts: {},              // 工具类组合别名
  variants: [],               // 前缀 → 选择器改写
  theme: { colors: { primary: '#6366f1' } }, // 设计令牌
  transformers: [],           // 源码转换器
})
```

<div v-click class="text-sm">

> `theme` 定义后即可用 `text-primary` / `bg-primary`。

</div>

<!--
配置文件约定叫 uno.config.ts，用 defineConfig 包裹获得完整类型提示。

几个核心字段：presets 是工具类的来源，至少引一个 Wind 预设；rules 定义自定义原子规则；shortcuts 把一串工具类组合成新类名；variants 定义前缀到选择器的改写；theme 存设计令牌，比如颜色、间距、断点；transformers 是源码转换器。

theme 里定义了 colors.primary 之后，就能直接用 text-primary、bg-primary 这样的工具类，Wind 预设会消费 theme 的值。
-->

---

# 预设体系①：Mini / Wind3 / Wind4

| 预设 | 对标 | 定位 |
| --- | --- | --- |
| `presetMini` | —— | 最小必要规则，Wind 系基础子集 |
| `presetWind3` | TW3 / Windi | 完整 Tailwind 风格工具类 |
| `presetWind4` | Tailwind 4 | 主题 CSS 变量化 + 内建 reset + oklch |

<div v-click class="mt-4 text-sm">

> ⚠️ `presetUno` **已弃用**，更名为 `presetWind3`。看到老教程的 `presetUno()`，心里换成 `presetWind3()` 即可。三者是递进超集：Mini ⊂ Wind3 ⊂ Wind4 特性。

</div>

<!--
预设体系里工具类主体是三兄弟，关系是递进超集。

presetMini 是最小但必要的规则与变体集合，是 Wind 系的基础子集，想极致精简、自建设计系统用它。presetWind3 在 Mini 之上补齐完整的 Tailwind 风格工具类，对标 Tailwind 3 和 Windi。presetWind4 对标 Tailwind 4，兼容 Wind3 全部特性并增强：主题以 CSS 变量输出、内建 reset、采用 oklch 色彩。

一个重要提醒：presetUno 是早期的默认预设，现在已经弃用并更名为 presetWind3，只作兼容别名保留。看到老教程里的 presetUno，直接理解成 presetWind3 就行。
-->

---

# 预设体系②：功能型 presets

<v-clicks>

- **presetAttributify**：属性化模式 `bg="blue-500" text="sm white"`
- **presetIcons**：纯 CSS 图标 `i-carbon-sun`，数据来自 Iconify
- **presetTypography**：`prose` 类给富文本成套排版
- **presetWebFonts**：集成 Google Fonts 等，绑定 `font-sans`
- **presetTagify**：标签化模式（工具类当标签名）
- **presetRemToPx**：rem → px（Wind4 已内建）

</v-clicks>

<div v-click class="mt-3 text-sm">

> `presets` 是数组，多个叠加生效；同名规则**后者优先**。

</div>

<!--
除了工具类主体，官方还有一批功能型预设，按需叠加。

presetAttributify 启用属性化模式，把工具类按前缀拆进 HTML 属性。presetIcons 提供纯 CSS 图标，把 Iconify 十万级图标做成单个 class。presetTypography 提供 prose 类，给富文本容器成套排版，常用于渲染 Markdown。presetWebFonts 集成 Google Fonts 等网络字体，绑定到 font-sans 这类工具类。

presetTagify 是标签化模式，把工具类当标签名用，比较少见但独特。presetRemToPx 把 rem 单位的工具类转成 px，但 Wind4 已经内建这个能力，从 Wind3 迁移时应该移除它。presets 是数组，多个预设叠加生效，同名规则靠后的优先。
-->

---

# rules：可编程的生成规则

规则决定「一个类名生成什么 CSS」，是引擎最底层单元：

```ts
rules: [
  // 静态规则：精确字符串 → CSS 对象
  ['flex', { display: 'flex' }],

  // 动态规则（招牌）：正则捕获 + 函数，一条覆盖无穷变体
  [/^m-([\.\d]+)$/, ([, num]) => ({ margin: `${num}px` })],
]
```

<v-clicks>

- 第一参 = 正则匹配数组，常解构 `[, num]` 取捕获组
- 第二参 = 上下文（含 `theme`），让规则消费设计令牌
- 返回 `undefined` = 本规则不处理，交后续规则

</v-clicks>

<!--
rules 是 UnoCSS 最底层的单元，决定一个类名生成什么 CSS，所有 preset 本质上都是一堆规则的集合。

静态规则是二元组，匹配字符串加 CSS 对象，比如 flex 生成 display flex。但一个类要写一条显然不现实。

动态规则是招牌能力：用正则加函数，一条覆盖无穷变体。比如这条 m 减横杠的正则，能匹配 m-1、m-2、m-7.5 等所有间距类。函数第一个参数是正则匹配数组，常用解构跳过全匹配取捕获组；第二个参数是上下文，可以拿到 theme，让规则消费设计令牌避免硬编码；返回 undefined 表示本规则不处理，交给后续规则。这就是 UnoCSS 区别于一张静态类表的关键，规则是可编程的。
-->

---

# shortcuts：把一串类组合成一个名字

```ts
// 静态：对象形式
shortcuts: {
  btn: 'py-2 px-4 rounded bg-blue-500 text-white',
  'btn-lg': 'btn text-lg py-3 px-6',  // 可引用别的 shortcut
}

// 动态：正则 + 函数返回工具类字符串
shortcuts: [
  [/^btn-(\w+)$/, ([, c]) => `bg-${c}-500 text-white py-2 px-4 rounded`],
]
```

<div v-click class="mt-2 text-sm">

> **rule vs shortcut**：rule 直接产出 CSS 声明；shortcut 只是展开成别的工具类，再由它们各自的规则产出 CSS。需要新 CSS 语义写 rule，只是组合现有类写 shortcut。

</div>

<!--
shortcuts 解决的是一串工具类反复出现的问题，给它起个别名，既复用又保持原子化。

静态形式用对象，比如把一串按钮类命名为 btn，shortcut 之间还能互相引用。动态形式和规则一样用正则加函数，返回一段工具类字符串，比如 btn-green、btn-red、btn-blue 都能工作。

rule 和 shortcut 的区别要分清：rule 直接产出 CSS 声明，shortcut 只是展开成别的工具类，再由这些工具类各自的规则产出 CSS。所以需要新的 CSS 语义就写 rule，只是组合现有的类就写 shortcut。
-->

---

# variants：前缀即选择器改写

`hover:` / `dark:` / `sm:` 的前缀都是变体：匹配 → 剥离 → 改写选择器。

```ts
variants: [
  (matcher) => {
    if (!matcher.startsWith('hover:')) return matcher
    return {
      matcher: matcher.slice(6),        // 剥离 hover: 前缀
      selector: (s) => `${s}:hover`,    // 选择器包上 :hover
    }
  },
]
```

<div v-click class="mt-2 text-sm">

> **变体分组**（transformerVariantGroup）：`hover:(bg-blue-500 text-white)` = `hover:bg-blue-500 hover:text-white`，纯书写简写，减少重复前缀。

</div>

<!--
variants 变体是理解 UnoCSS 灵活性的关键。hover 冒号、dark 冒号、sm 冒号这些前缀都是变体，职责是匹配前缀、剥离前缀、把剩余部分交给规则，再改写生成的选择器。

看这个自定义 hover 变体的骨架：不匹配就原样返回，匹配就剥离 hover 冒号前缀，再给选择器包上冒号 hover。理解了这个模型，就明白为什么 UnoCSS 能实现任意的前缀到选择器逻辑，媒体查询、伪类、伪元素都是变体在改写选择器。

还有变体分组，由 transformerVariantGroup 提供：共享同一前缀的多个类可以用括号合并，hover 括号 bg 加 text，等价于分别加 hover 前缀。它只是书写简写，语义完全等价，但能显著减少重复前缀。
-->

---

# 指令①：@apply / --at-apply

由 `transformerDirectives` 提供，在 CSS 里复用工具类：

```css
.custom-btn {
  @apply text-center my-2 font-medium rounded bg-blue-500 text-white;
}

/* 纯原生 CSS 更友好：自定义属性形式，语义等价 */
.custom-btn {
  --at-apply: text-center my-2 font-medium;
}
```

<div v-click class="mt-2 text-sm">

> ⚠️ 不配 `transformerDirectives()`，`@apply` 会原样残留导致报错/无效——「@apply 没生效」的头号原因。`applyVariable` 默认识别 `--at-apply`/`--uno-apply`/`--uno`。

</div>

<!--
指令由 transformerDirectives 提供，第一组是 @apply 和 --at-apply。

@apply 让你在手写的 CSS 或 SCSS 规则里直接套用 UnoCSS 工具类，适合组件级样式还是想写在 style 里但不想重复手写属性值的场景。

--at-apply 是纯原生 CSS 更友好的替代：@apply 是自定义 at-rule，某些纯 CSS 工具链会对未知 at-rule 报错，而 --at-apply 用自定义属性承载，是合法 CSS 声明，兼容性更好。二者语义完全等价。

一个重点坑：不配 transformerDirectives，@apply 不会被处理，会原样残留在样式表里导致报错或无效，这是 @apply 没生效的头号原因。applyVariable 选项默认识别 --at-apply、--uno-apply、--uno 三种变量名。
-->

---

# 指令②：theme() / @screen

```css
.btn {
  /* theme()：构建期内联主题令牌的具体值 */
  background-color: theme('colors.blue.500'); /* → #3b82f6 */
}

/* @screen：断点名 → 媒体查询 */
@screen sm {
  .grid { --uno: grid-cols-3; }  /* → @media (min-width: 640px) */
}
```

<v-clicks>

- `theme()` 内联**具体值**，不是留运行时 `var(--x)`
- `@screen` 支持 `lt-sm`（max-width）、`at-xl`（区间）
- 手写响应式不必再记具体像素值

</v-clicks>

<!--
第二组指令是 theme 函数和 @screen。

theme 函数按点路径读取主题配置的值，在构建期内联成具体值，比如 theme colors blue 500 会被替换成 #3b82f6。它让手写 CSS 也能复用 theme 里的设计令牌，避免把色值到处硬编码。注意是构建期内联具体值，不是留一个运行时的 var。

@screen 把主题断点名翻译成媒体查询，比如 @screen sm 生成 min-width 640px 的媒体查询。它还支持两个变体：lt-sm 是 max-width，比断点更小；at-xl 是区间范围查询。这样手写响应式就不必再记具体的像素值了。
-->

---

# 属性化模式（presetAttributify）

把工具类按前缀拆进 HTML 属性，长标签更易读：

```html
<button bg="blue-500 hover:blue-600" text="sm white" p="4">
  Button
</button>

<div flex></div>                  <!-- 无值属性 = class="flex" -->
<button border="~ red"></button>  <!-- ~ 引用属性名本身 = border border-red -->
<a un-text="red"></a>             <!-- un- 前缀防与组件 prop 冲突 -->
```

<div v-click class="mt-2 text-sm">

> ⚠️ JSX 里 `<div grid>` 被编译成 `grid={true}` 破坏匹配 → 需 `@unocss/transformer-attributify-jsx`；HTML/Vue 模板无此问题。

</div>

<!--
属性化模式由 presetAttributify 提供，把工具类按前缀拆进 HTML 属性，让长组件标签更有条理、更易读。

比如 bg 等于 blue-500 加 hover blue-600，text 等于 sm white。三个进阶点：无值属性，工具类名和属性名相同时直接写 div flex，等价 class flex；波浪号引用属性名本身，border 等于波浪号 red 展开为 border 加 border-red，不然会漏掉单独的 border；un 前缀避免和组件框架的 prop 撞名，必要时用 prefixedOnly 强制只识别带前缀的属性化。

一个 JSX 专属坑：JSX 编译器会把无值属性 div grid 转成 grid 等于 true，属性值变成布尔破坏匹配，需要加 transformer-attributify-jsx 修复。纯 HTML 和 Vue 模板没有这个问题，只有 JSX 需要。
-->

---

# 纯 CSS 图标 presetIcons

把 Iconify 十万级图标做成单个 class，无字体、无 SVG 文件：

```html
<span class="i-carbon-sun"></span>
<span class="i-mdi-account text-red-500"></span>  <!-- 单色可随 text-* 变色 -->
```

| 项 | 说明 |
| --- | --- |
| 类名 | `i-[图标集]-[图标名]`，如 `i-carbon-sun` |
| 安装 | 按需装 `@iconify-json/[集合]` |
| 模式 | `mask`（单色变色）/ `bg`（多色）/ `auto`（默认） |

<!--
presetIcons 走的是纯 CSS 图标：图标数据来自 Iconify，构建时把对应 SVG 内联进 CSS，一个 class 就渲染一个图标，无需图标字体或 SVG 文件。

类名约定是 i 减图标集减图标名，比如 carbon 的 sun 写作 i-carbon-sun，mdi 的 account 写作 i-mdi-account。每个图标集以 @iconify-json 斜杠集合名独立发布，用哪个装哪个。

三种渲染模式：mask 用 CSS 遮罩加背景色渲染单色图标，能随 color 和 text 变色；bg 把图标当静态背景图，保留原本的多色但不可变色；auto 是默认，按图标是否单色自动选择。大多数情况交给 auto 就行。
-->

---

# ⚠️ 踩坑：pnpm 图标自动发现失效

**现象**：开发正常，生产 build 后所有 `i-carbon-*` 不显示：

```
[unocss] failed to load icon "carbon-home"
```

**根因**：pnpm 严格依赖隔离下，`presetIcons` 的**自动发现** `@iconify-json/*` 失效（即使已安装）。unocss#2905。

```ts
// ✅ 解法：不依赖自动发现，显式传入 collections
import { icons as carbonIcons } from '@iconify-json/carbon'
presetIcons({ collections: { carbon: () => carbonIcons } })
```

<div v-click class="text-sm">

> 只加 `.npmrc` 的 `public-hoist-pattern` **不够**；不是没装、不是断网（纯 CSS 图标本地内联不联网）。

</div>

<!--
这是本项目踩过的真实坑，很有价值。

现象：开发环境图标一切正常，但生产构建后所有 i-carbon 星号图标不显示，构建日志报 failed to load icon carbon-home 之类。

根因：pnpm 的严格依赖隔离下，非扁平 node_modules、依赖不提升，presetIcons 的自动发现 @iconify-json 星号机制找不到已安装的图标集包，即使它确实装了。开发时有时因缓存侥幸能过，生产构建把问题暴露，这是 pnpm monorepo 的已知问题 unocss#2905。

关键认知：不是图标没装，不是图标集下架，更不是生产环境断网，因为纯 CSS 图标是本地构建内联根本不联网。是自动发现机制在严格隔离下解析不到包。

解法：不依赖自动发现，显式导入图标集并传给 collections。显式提供后引擎不再走自动发现，生产构建稳定。注意仅在 .npmrc 加 public-hoist-pattern 不足以解决，必须在配置里显式导入传入。这个道理和浏览器运行时必须显式提供 collections 是相通的。
-->

---

# 配置字段全景

```ts
export default defineConfig({
  content: { filesystem: ['src/**/*.{vue,ts,tsx}'] }, // 扫描范围
  safelist: ['i-carbon-home'],   // 强制生成（动态类兜底）
  blocklist: ['container'],       // 禁止生成（收窄设计系统）
  preflights: [{ getCSS: () => ':root { --gap: 8px }' }], // 全局 CSS
})
```

<v-clicks>

- `safelist`：运行时**动态拼接的类**扫描不到 → 强制生成
- `blocklist`：黑名单，即使出现也不生成
- `content` + `extractors`：配置扫描哪些文件、如何切类名
- `preflights`：注入 reset / `:root` 变量 / body 基础样式

</v-clicks>

<!--
除了前面讲的字段，还有一批常用配置。

content 配置扫描哪些文件，filesystem 指定 glob。safelist 是强制生成，专治运行时动态拼接的类名扫描不到的问题，比如菜单配置里 i-carbon 加变量拼出来的图标类，静态扫描器看不到完整字符串就不生成，加进 safelist 兜底。blocklist 是黑名单，列出的类即使出现也不生成，用于禁用不希望被使用的类、收窄设计系统，和 safelist 互为反向。

content 配合 extractors 提取器决定扫描哪些文件、如何从源码切出候选类名 token。preflights 注入全局原始 CSS，比如 reset、root 变量、body 基础样式，输出到 preflights 层。

要区分两个不同问题：图标集包发现不到靠 collections，类名字面量扫描不到靠 safelist，别混淆。
-->

---

# layers 与 CDN 运行时

**layers**：控制各类别工具类的层叠/输出顺序（数值小的先输出、优先级低）：

```ts
layers: { components: -1, default: 1, utilities: 2 }
// 需接入原生 @layer：outputToCssLayers: true + cssLayerName
```

**CDN 运行时**：同构引擎的独门能力，一行 script 无构建：

```html
<script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"></script>
<div class="m-4 p-2 bg-blue-500 rounded">运行时生成</div>
```

<!--
layers 控制不同类别工具类在产物 CSS 里的层叠和输出顺序，数值小的先输出、优先级低。这决定了 shortcut 和直接写的工具类冲突时谁覆盖谁。需要接入原生 CSS @layer 级联时，开 outputToCssLayers，用 cssLayerName 命名。layers 排序加 outputToCssLayers 映射是精确控制优先级的结构化手段，比到处打 important 干净得多。

CDN 运行时是 UnoCSS 同构引擎的独门能力，是 Tailwind 这种 PostCSS 插件形态难有的：一行 CDN script，@unocss/runtime 会在浏览器端扫描 DOM 上的类名并动态生成 CSS，完全不走构建，适合原型、演示、无构建的静态页。
-->

---

# Wind3 → Wind4 迁移清单

| 项 | Wind3 | Wind4 |
| --- | --- | --- |
| 字体族键 | `fontFamily` | `font` |
| 圆角键 | `borderRadius` | `radius` |
| 缓动键 | `easing` | `ease` |
| 主题输出 | 常规值 | **CSS 变量**（默认 on-demand） |
| reset | 自引 `@unocss/reset` | **内建** |
| `presetRemToPx` | 引入 | 内建，**移除** |
| `presetLegacyCompat` | 可用 | 与 oklch 冲突，**移除** |

<div v-click class="text-sm">

> 三大翻车点：旧主题键名失效、reset 重复引、残留 legacy 预设。

</div>

<!--
presetWind4 对标 Tailwind 4，兼容 Wind3 全部特性但带一批破坏性变化，迁移时逐条核对。

主题键重命名：fontFamily 变 font，borderRadius 变 radius，easing 变 ease，fontSize 和 lineHeight 归入 text，宽高等尺寸统一到 spacing。主题输出从常规值改成 CSS 变量，默认 on-demand 只生成用到的键。reset 从自引 @unocss/reset 变成内建，收进 base 层。色彩改用 oklch 模型。

两个预设要移除：presetRemToPx 已经内建，残留会重复处理；presetLegacyCompat 与 Wind4 的 oklch 色彩不兼容。

三大翻车点：一是还用旧主题键名导致定制失效，逐个改新键名；二是 reset 重复引，Wind4 已内建别再手动引；三是残留 legacy 预设，两个都要从 presets 移除。
-->

---

# 易错点 Top 8

<v-clicks>

- 工具类完全不生效：没引 preset，或漏 `import 'virtual:uno.css'`
- `@apply` 报错/残留：没启用 `transformerDirectives`
- 生产 `failed to load icon`：pnpm 隔离下自动发现失效 → 显式 `collections`
- 动态拼接的类/图标不显示：加进 `safelist`
- 变体分组 `hover:(...)` 不展开：没启用 `transformerVariantGroup`
- JSX 无值属性 `<div grid>` 不生效：加 `transformer-attributify-jsx`
- 还在用 `presetUno`：已弃用，改 `presetWind3`
- Wind4 主题定制失效：用了旧键名（`font`/`radius`/`ease`）

</v-clicks>

<!--
过一遍最高频的踩坑点。

第一，工具类完全不生效，要么没引任何 preset，要么漏了入口的 import virtual uno.css。第二，@apply 报错或原样残留，是没启用 transformerDirectives。第三，生产构建报 failed to load icon，是 pnpm 严格隔离下图标自动发现失效，解法是显式传 collections。第四，运行时动态拼接的类或图标不显示，加进 safelist 兜底。

第五，变体分组 hover 括号语法不展开，是没启用 transformerVariantGroup。第六，JSX 里无值属性 div grid 不生效，被编译成 grid 等于 true，加 transformer-attributify-jsx。第七，还在用 presetUno，它已弃用，改用 presetWind3。第八，Wind4 主题定制失效，是用了旧键名，要改成 font、radius、ease 等新键名。
-->

---

# 选型对比与总结

| 维度 | UnoCSS | Tailwind | 原生 CSS |
| --- | --- | --- | --- |
| 形态 | 同构引擎 | 框架/PostCSS 插件 | 语言本身 |
| 工具类 | preset 提供、可编程 | 内建约定 | 无 |
| 独有 | CSS 图标/属性化/CDN 运行时 | 插件生态/模板 | 零依赖 |
| 性能 | 无 AST/扫描，约 5x | JIT 按需 | —— |

<div v-click class="mt-3 text-sm">

> **UnoCSS = 即时按需的原子化 CSS 引擎**：no core utilities、一切来自 preset；rules/shortcuts/variants 可编程；纯 CSS 图标 + 属性化 + 指令；同构可跑 CDN 运行时。要 Tailwind 那套 → Wind3/Wind4；要极致灵活/性能 → 引擎本色。v66.7.4。

</div>

<!--
最后选型对比与总结。

形态上，UnoCSS 是同构引擎，Tailwind 是框架加 PostCSS 插件，原生 CSS 是语言本身。工具类上，UnoCSS 靠 preset 提供且可编程，Tailwind 是内建约定，原生 CSS 没有工具类概念。独有能力上，UnoCSS 有纯 CSS 图标、属性化、CDN 运行时，Tailwind 有成熟插件生态和海量模板。性能上 UnoCSS 无 AST、无扫描，官方称约 5 倍。

一句话总结：UnoCSS 是即时按需的原子化 CSS 引擎，核心是 no core utilities、一切来自 preset；rules、shortcuts、variants 提供可编程内核；纯 CSS 图标、属性化、指令是 DX 亮点；同构引擎能跑 CDN 运行时。要 Tailwind 那套齐全工具类就用 Wind3 或 Wind4，要极致灵活和性能就发挥引擎本色。当前 v66.7.4。谢谢大家。
-->
