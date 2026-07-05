---
theme: seriph
background: https://cover.sli.dev
title: vanilla-extract 零运行时样式
info: |
  Presentation vanilla-extract —— TypeScript-first 的零运行时 CSS-in-JS。

  Learn more at [https://vanilla-extract.style](https://vanilla-extract.style)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-6xl font-mono tracking-tight">styles<span class="opacity-50">.css.ts</span></span>
</div>

<br/>

## vanilla-extract —— 把样式写进 TypeScript

零运行时（zero-runtime）：`.css.ts` 构建期出静态 CSS + 类型安全令牌

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://vanilla-extract.style" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
今天聊 vanilla-extract —— 一个 TypeScript-first 的零运行时样式方案，官方标语是 Zero-runtime Stylesheets-in-TypeScript。当前版本 @vanilla-extract/css 1.21.1。

核心一句话：你把样式写在 .css.ts 文件里，用 style、createTheme 这些 API 以 TS 对象声明，构建期由打包器编译成静态 CSS 和作用域类名，运行时零样式开销，还带端到端类型安全。

今天顺序：定位与编译模型 → style 与选择器 → at-rules 与变量 → globalStyle 组合 → 主题系统 → recipes 与 sprinkles → dynamic 运行时变量 → 构建集成 → SSR/RSC → 选型对比 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 是什么：TS-first 零运行时

样式写在 `.css.ts`，构建期出静态 CSS：

<v-clicks>

- 用 `style()` 等 API 以 **TypeScript 对象**声明样式
- 打包器**构建期执行** `.css.ts`，抽取成**静态 CSS 文件**
- 每条规则生成**局部作用域、唯一哈希**的类名
- 文件导出**类名字符串**，组件里当 className 用
- 令牌带**类型**：改名 / 漏值编译期报错

</v-clicks>

<div v-click class="mt-4 text-sm">

> 心智：像「用 TS 写、编译成静态 CSS 的 Sass」——但带类型安全。

</div>

<!--
vanilla-extract 是 TypeScript-first 的零运行时样式方案。

工作方式：你在 styles.css.ts 文件里，用 style 等 API 以 TS 对象写样式；打包器插件在构建期执行这个文件，把样式抽取成静态 CSS 文件，并为每条规则生成局部作用域、唯一哈希的类名；文件导出的是类名字符串，你在组件里当 className 使用。

它和运行时 CSS-in-JS 最大的不同就是零运行时——一切构建期固化。同时因为用 TS 写，设计令牌、主题契约都带类型，改名或漏赋值在编译期就报错。

一句话心智：它像用 TypeScript 写、编译成静态 CSS 的 Sass，但多了端到端类型安全。
-->

---

# 编译模型：为什么值要能静态求值

`.css.ts` **在构建期由打包器在 Node 里执行**，不是发给浏览器：

```ts
const spacing = 8;
export const box = style({ padding: spacing * 2 }); // ✅ 构建期可求值

export const bad = style({
  width: window.innerWidth,  // ❌ 构建期没有 window
  color: props.color,        // ❌ 构建期没有 props
});
```

<v-clicks>

- 值必须能**静态求值** → 生成静态 CSS
- 运行时数据（props / window / 请求）构建期**不存在**
- 要动态 → CSS 变量占位 + `assignInlineVars` 改内联值

</v-clicks>

<!--
这是理解 vanilla-extract 一切约束的钥匙。

.css.ts 文件不是发给浏览器执行的，而是构建期由打包器插件在 Node 环境里执行，执行产物（类名、变量引用）留下，其中 style 调用产生的 CSS 被抽取到静态文件。

所以文件里的样式值必须能在构建期静态求值。常量、模块内计算、其他 vanilla-extract API 的返回值都行；但 window、组件 props、请求数据这些运行时信息构建期根本不存在，写了会报错或拿到错值。

想让样式随运行时数据变化，正确姿势是用 CSS 变量占位，运行时用 dynamic 包的 assignInlineVars 只改变量的内联值。这条分工后面细讲。
-->

---

# `style()`：最基础的 API

```ts
import { style } from '@vanilla-extract/css';

export const container = style({
  padding: 10,               // 数字默认补 px → 10px
  display: 'flex',
  flexGrow: 1,               // 无单位属性保持原值
  WebkitTapHighlightColor: 'transparent', // 前缀属性 PascalCase
  ':hover': { background: '#fafafa' },     // 简单伪类写顶层
});
```

<v-clicks>

- 返回**作用域类名字符串**，赋给 `className` / `class`
- 属性 **camelCase**；数字补 `px`（`flexGrow`/`opacity` 除外）
- 框架无关：React / Vue / Solid 都用这个类名

</v-clicks>

<!--
style 是最核心的 API，接受一个样式对象，返回一个作用域化的类名字符串。

几个要点：属性用 camelCase，由 csstype 提供类型补全；数字默认补 px，比如 padding 10 变成 10px，但无单位属性如 flexGrow、opacity、zIndex 保持原值；带浏览器前缀的属性用 PascalCase 去掉前导横线，比如 WebkitTapHighlightColor；简单伪类比如 hover、before 可以直接写在顶层。

返回的类名框架无关，React 用 className、Vue 用 class，Solid 也一样，vanilla-extract 本身不绑定任何框架。
-->

---

# 选择器：简单 vs 复杂

```ts
export const parent = style({});
export const item = style({
  ':hover': { color: 'pink' },          // 简单伪类：顶层
  selectors: {
    '&:not(:first-child)': { marginTop: 8 },   // 复杂：& 在主语位
    [`${parent}:focus &`]: { outline: '2px solid' },
  },
});
```

<v-clicks>

- 复杂选择器进 `selectors`，`&` 必须是**当前元素（主语）**
- ⚠️ `'& .child'` 目标是**子元素** → 不允许，改用 `globalStyle`
- 循环引用 → `get selectors() { return {...} }` getter

</v-clicks>

<!--
选择器分两类。简单伪类和伪元素，比如 hover、before，可以直接写在 style 顶层。

复杂选择器——带 not、组合器、引用别的 class 的——必须放进 selectors 键，而且有个硬规则：选择器的目标必须是当前元素，也就是 & 要处在被选中的主语位。像 nav li 大于号 & 合法，因为 & 是目标。

反过来，& 空格 .child 这种，目标是子元素，不是当前元素，vanilla-extract 不允许。给后代上样式要改用 globalStyle。

还有个坑：两个 class 的选择器互相引用时会遇到初始化顺序问题，用 JS getter 把 selectors 写成 get 访问器，延迟到读取时求值就能绕开。
-->

---

# at-rules 与 CSS 变量

```ts
import { style, createVar, fallbackVar } from '@vanilla-extract/css';

export const accent = createVar();   // 造引用，创建时不生成 CSS
export const panel = style({
  color: fallbackVar(accent, 'black'),   // 回退值
  vars: { [accent]: 'blue' },            // 赋值
  overflow: ['auto', 'overlay'],         // 数组 = 属性回退
  '@media': { 'screen and (min-width: 768px)': { padding: 20 } },
});
```

<v-clicks>

- `@media` / `@supports` / `@container` / `@layer` 都是「键 + 条件对象」
- `createVar()` 造引用；可传 `@property` 配置生成**类型化变量**

</v-clicks>

<!--
这页三件事：at-rules、CSS 变量、属性回退。

at-rules 都用两层结构：外层是 @media、@supports、@container、@layer 这些键，内层是条件字符串到样式对象的映射。容器查询配 createContainer 生成的具名容器，级联层配 layer 生成的引用。

CSS 变量：createVar 造一个作用域化的变量引用，注意创建时不生成任何 CSS，只是引用；之后在 vars 键里赋值、在属性值里使用。fallbackVar 提供回退值。createVar 还能传 @property 配置，生成带类型的注册自定义属性，支持角度、颜色这类可插值动画。

属性回退用数组，比如 overflow 传 auto 和 overlay，旧浏览器识别不了后者就退回前者。
-->

---

# globalStyle 与样式组合

```ts
import { style, globalStyle } from '@vanilla-extract/css';

globalStyle('html, body', { margin: 0 });    // 全局重置

export const card = style({});
globalStyle(`${card} a`, { color: 'pink' });  // 给后代上样式

export const primary = style([                 // 数组组合
  card,
  { background: 'blue', color: 'white' },
]);
```

<v-clicks>

- `globalStyle(selector, styles)`：不作用域化的全局规则
- 后代样式的**正解**（selectors 做不到）
- `style([...])`：合并类名 / sprinkles / 行内对象

</v-clicks>

<!--
globalStyle 定义不被作用域化的全局规则，直接对选择器生效。两个典型用途：一是全局重置，比如 html body 归零；二是给某个作用域 class 的后代上样式，因为 selectors 只能针对自身，后代必须用 globalStyle。同类还有 globalKeyframes、globalFontFace、globalLayer。

样式组合用 style 传数组，元素可以是别处的类名、sprinkles 的结果、或行内样式对象，vanilla-extract 会合并成一个类。这是 vanilla-extract 复用样式的基石，取代了继承或字符串拼接。
-->

---

# styleVariants / keyframes / fontFace

```ts
export const bg = styleVariants({          // 一组命名样式
  primary: { background: 'blue' },
  danger: { background: 'red' },
});  // 用：className={bg[props.variant]}

const rotate = keyframes({                 // 作用域动画名
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});
export const spin = style({ animationName: rotate, animationDuration: '1s' });
```

<v-clicks>

- `styleVariants`：prop → 样式的映射（可带 mapper 函数）
- `keyframes` 返回动画名；步骤里 `vars` 还能给变量做动画
- `fontFace(cfg)` 返回作用域 font-family 名（数组定义多字重）

</v-clicks>

<!--
三个便捷 API。

styleVariants 一次生成一组命名样式，返回键到类名的对象，天然映射组件 prop，比如 bg 中括号 props.variant。还能传第二个映射函数从数据批量生成。

keyframes 定义动画，返回一个作用域化的动画名，赋给 animationName，避免全局命名冲突；关键帧步骤里还能用 vars 给 CSS 变量做动画，配合 @property 类型化变量能做渐变旋转这类效果。全局动画名用 globalKeyframes。

fontFace 生成 font-face 规则，返回作用域化的字体名，赋给 fontFamily；传数组能为同一 family 定义多种字重。
-->

---

# 主题：`createTheme`

```ts
import { createTheme } from '@vanilla-extract/css';

export const [themeClass, vars] = createTheme({
  color: { brand: '#5b21b6', text: '#1f2937' },
  space: { small: '4px', medium: '8px' },
});
// 引用：background: vars.color.brand（→ var(--color-brand__hash)）
```

<v-clicks>

- 返回元组 **`[themeClass, vars]`**
- `themeClass` 挂元素上 → 子树用这套值
- `vars`：与传入**同形**、每个叶子是 CSS 变量引用
- 令牌值是**字符串**（最终是 CSS 变量值）

</v-clicks>

<!--
主题系统的入口是 createTheme。它一步到位：生成一份 CSS 变量声明，返回一个元组，解构成 themeClass 和 vars 两部分。

themeClass 是一个 class 名，挂到某个元素上，它的子树就能通过 vars 读到这套值。vars 是一份和你传入结构同形的对象，但每个叶子已经变成对应 CSS 变量的引用，比如 vars.color.brand 编译成 var 括号 --color-brand 加哈希。

在样式里直接 background 等于 vars.color.brand 就能引用。注意令牌值都是字符串，比如 space small 是 4px，因为它们最终是 CSS 变量的值，用的时候不用再补单位。
-->

---

# 多主题：复用同一套契约

```ts
export const [lightClass, vars] = createTheme({
  color: { bg: '#fff', text: '#111' },
});

// 复用 vars 契约，只赋新值 → 新 class
export const darkClass = createTheme(vars, {
  color: { bg: '#111', text: '#eee' },
});
```

<v-clicks>

- 组件始终读 `vars.color.bg`——引用不变
- 切换根元素 class（light / dark）即切主题
- **零运行时**：只是换了个 class
- ⚠️ 别再 `createTheme({...})` 造全新变量——引用会对不上

</v-clicks>

<!--
做深浅两套主题，关键是复用同一批 CSS 变量。

正确做法：第一次 createTheme 产出契约 vars；第二次把 vars 作为第一个参数传进去，vanilla-extract 复用同一批变量，只在一个新 class 里赋新值。

这样组件里始终读 vars.color.bg，引用不变，你只要把根元素的 class 在 lightClass 和 darkClass 之间切换，整棵子树的取值就跟着切换，而且是零运行时，因为只是换了个 class 名。

千万别为暗色再 createTheme 大括号生成一套全新变量，那样会造出新变量，组件里读的引用对不上，主题切换失效。
-->

---

# 契约先行 与 全局主题

```ts
// contract.css.ts —— 只定义结构，不产 CSS
export const vars = createThemeContract({
  color: { bg: null, text: null },
});

// 全局默认主题：赋到 :root，不返回 class
export const rootVars = createGlobalTheme(':root', {
  color: { brand: 'blue' },
});
```

<v-clicks>

- `createThemeContract`：**不生成 CSS**，契约与实现分离 → 代码分割
- `createGlobalTheme(sel, tokens)`：令牌落到全局选择器，无需挂 class
- `createGlobalThemeContract(map, fn)`：对接已有 `--变量`命名

</v-clicks>

<!--
两个进阶主题 API。

createThemeContract 只定义契约的结构，不生成任何 CSS，值由后续的 createTheme 或 createGlobalTheme 去实现。它把契约和实现解耦，好处是支持按主题代码分割：主契约文件很小，各主题实现文件各自 import 自己的 CSS，用户只加载当前主题。

createGlobalTheme 把令牌赋到指定的全局选择器，比如 root，不生成也不返回 class，适合一套全站默认主题。它的三参形式还能实现一个既有契约。

createGlobalThemeContract 用于对接已有命名约定的全局 CSS 变量，第二个映射函数自定义每个 token 生成的变量名，跟设计系统现有的 --变量 对齐，而不是自动哈希。
-->

---

# `assignVars` 与类型安全

```ts
export const root = style({
  vars: assignVars(vars.color, { bg: '#fff', text: '#111' }),
  '@media': {
    '(prefers-color-scheme: dark)': {
      vars: assignVars(vars.color, { bg: '#111', text: '#eee' }),
    },
  },
});
```

<v-clicks>

- `assignVars` 在 style / 媒体查询里**整组赋值**（漏项报错）
- 令牌是**类型化契约**：改名 / 漏值 → 编译期暴露
- 把设计令牌从「一堆字符串」升级为**可校验契约**

</v-clicks>

<!--
assignVars 用于在某个 style、选择器或媒体查询里，一次性给整个契约或其子树赋值，常用于深浅模式的条件覆盖。比如默认亮色，在 prefers-color-scheme dark 的媒体查询里整组覆盖成暗色。它按契约结构完整赋值，漏项会类型报错，比逐个赋值更安全。

这就引出 vanilla-extract 相对 CSS Modules 的核心增量：主题契约是类型化的。引用不存在的令牌编译期报错，实现契约时漏赋值编译期报错，契约结构调整时所有实现处都会暴露，不会静默漂移。它把设计令牌从一堆约定俗成的字符串，升级为编译期可校验的契约。
-->

---

# recipes：多变体组件样式

```ts
import { recipe } from '@vanilla-extract/recipes';

export const button = recipe({
  base: { borderRadius: 6 },
  variants: {
    color: { neutral: { background: '#eee' }, brand: { background: '#5b21b6' } },
    size: { small: { padding: 8 }, large: { padding: 16 } },
  },
  compoundVariants: [
    { variants: { color: 'brand', size: 'large' }, style: { boxShadow: '0 4px 12px' } },
  ],
  defaultVariants: { color: 'neutral', size: 'small' },
});
// 用：button({ color: 'brand', size: 'large' })
```

<!--
@vanilla-extract/recipes 解决一个组件有多个变体维度的样式管理，形态非常接近 cva，灵感来自 Stitches。

recipe 接受四段配置：base 是所有变体共享的基础样式；variants 定义变体分组，每组多个可选值；compoundVariants 是特定变体组合同时命中时才叠加的样式，比如只有 color brand 且 size large 时才加阴影，避免在 variants 里穷举组合；defaultVariants 是未指定时的默认变体。

调用它返回组合好的类名，比如 button 括号 color brand size large。只传需要覆盖的维度，其余走默认。
-->

---

# `RecipeVariants`：变体类型复用

```ts
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';

export const button = recipe({ /* ... */ });

// 抽取 { color?: 'neutral' | 'brand'; size?: 'small' | 'large' }
export type ButtonVariants = RecipeVariants<typeof button>;

type ButtonProps = ButtonVariants & { children: React.ReactNode };
```

<v-clicks>

- 从 recipe 抽取变体 props 的 **TS 类型**
- 样式变体与组件类型**单一事实来源**
- 改 recipe 的变体 → 组件类型自动跟随

</v-clicks>

<!--
recipes 配套一个类型工具 RecipeVariants，从 recipe 定义里抽取出它的变体 props 的 TS 类型。

比如 ButtonVariants 等于 RecipeVariants typeof button，得到 color 可选 neutral 或 brand、size 可选 small 或 large 这样的类型。你把它和组件自己的 props 交叉，组件的类型就和样式变体保持单一事实来源。

好处是改了 recipe 的变体定义，组件的 props 类型自动跟随，不会出现样式和类型两处对不上的情况。这是纯类型层工具，不产生任何运行时值。
-->

---

# sprinkles：零运行时原子化

```ts
import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';

const responsive = defineProperties({
  conditions: {
    mobile: {},
    desktop: { '@media': 'screen and (min-width: 1024px)' },
  },
  defaultCondition: 'mobile',
  responsiveArray: ['mobile', 'desktop'],
  properties: { display: ['none', 'flex'], paddingX: { sm: '4px', lg: '16px' } },
});
export const sprinkles = createSprinkles(responsive);
```

<div v-click class="text-sm mt-2">

> 自建一个**类型安全版的 Tailwind / Styled System**。

</div>

<!--
@vanilla-extract/sprinkles 是官方的零运行时、类型安全的原子化 CSS 框架，让你像 Tailwind 一样用类型安全的 props 拼样式，却没有运行时样式生成开销。一句话，自建一个类型安全版的 Tailwind 或 Styled System。

搭建两步。先用 defineProperties 定义属性集合：properties 把 CSS 属性映射到可选值；conditions 定义媒体查询等条件，defaultCondition 指定无条件值时用哪个；responsiveArray 定义条件顺序，支持响应式数组；shorthands 把简写属性映射到多个底层属性。可以定义多组，比如响应式一组、颜色一组。

再用 createSprinkles 把多组合并成一个类型安全的 sprinkles 函数。
-->

---

# sprinkles：用法 与 零运行时自洽

```ts
export const box = sprinkles({
  display: 'flex',
  paddingX: 'lg',                          // 原始值 → defaultCondition
  // 条件对象 / 响应式数组：
  // display: { mobile: 'none', desktop: 'flex' }
  // display: ['none', 'flex']
});
```

<v-clicks>

- 条件值三写法：**对象** / **响应式数组** / **原始值**
- `sprinkles()` 运行时只**查表**拼预生成的原子类名——**不生成新 CSS**
- 可与 `style([...])` 组合补齐非原子样式

</v-clicks>

<!--
用法上，sprinkles 函数接受原子属性。条件值有三种写法：原始值走 defaultCondition；条件对象比如 mobile none、desktop flex；响应式数组比如中括号 none flex，按 responsiveArray 顺序，null 表示跳过该断点。三种可以混用。

关键问题：sprinkles 号称零运行时，可它的函数明明能在运行时调用，如何自洽？答案是——所有原子工具类在构建期就生成好了，运行时调用 sprinkles 只是按参数查表，拼出已经存在的原子类名字符串，不生成任何新 CSS，所以没有运行时样式注入开销，仍是零运行时，运行时只做极轻量的类名查找。

sprinkles 结果还能和 style 数组组合，补齐原子类覆盖不到的样式。
-->

---

# dynamic：运行时改变量值

```ts
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { progress, bar } from './slider.css'; // progress = createVar()

<div
  className={bar}                             // width: var(progress)
  style={assignInlineVars({ [progress]: `${percent}%` })}
/>;
```

<v-clicks>

- `assignInlineVars`：**声明式**，返回对象放 `style` 属性
- `setElementVars`：**命令式**，直接写到 DOM 元素
- 只改**内联变量值**，不新增 CSS → 仍零运行时（< 1kB 运行时）
- `null` / `undefined` 的项被省略

</v-clicks>

<!--
运行时动态怎么办？@vanilla-extract/dynamic 是个小于 1kB 的运行时，用来运行时改 scoped CSS 变量的值。

套路：.css.ts 里用 createVar 声明变量、样式引用它；运行时用 assignInlineVars 把变量值内联到元素的 style 属性上。比如进度条，width 引用 progress 变量，运行时 assignInlineVars 把 progress 设成百分比。

两个 API：assignInlineVars 是声明式，返回对象放进 style 属性，React 友好；setElementVars 是命令式，直接把变量写到某个 DOM 元素上，适合原生 JS 或逐帧更新。

关键：它们只改内联的 CSS 变量值，不新增任何 CSS 规则，所以仍然是零运行时 CSS。值为 null 或 undefined 的项会被省略。
-->

---

# 构建集成

| 打包器 | 包 / 入口 |
| --- | --- |
| Vite | `@vanilla-extract/vite-plugin` · `vanillaExtractPlugin()` |
| webpack | `@vanilla-extract/webpack-plugin` |
| esbuild | `@vanilla-extract/esbuild-plugin` |
| Next.js | `@vanilla-extract/next-plugin` · `createVanillaExtractPlugin()` |
| Astro / Remix | 复用 Vite 插件 |

<v-clicks>

- Vite `identifiers`：`'short'`（生产）/ `'debug'`（开发）/ 函数
- Next：第三方含 ve 样式的库要加进 `transpilePackages`

</v-clicks>

<!--
vanilla-extract 靠打包器插件在构建期抽取 css.ts。

常用集成：Vite 用 vanilla-extract vite-plugin 的 vanillaExtractPlugin；webpack 用 webpack-plugin；esbuild 用 esbuild-plugin；Next 用 next-plugin 的 createVanillaExtractPlugin 包裹配置；Rollup、Parcel、Gatsby 各有包；Astro 和 Remix 因为基于 Vite，复用 Vite 插件。

两个实用选项。Vite 插件的 identifiers 控制生成的类名和变量标识符格式：short 是短哈希，产物小，适合生产；debug 带文件名和规则名，便于调试定位，适合开发；也可传自定义函数。

Next 里如果引用了第三方发布的含 vanilla-extract 样式的库，要把它加进 transpilePackages，让它的 css.ts 也被编译。Next 16 以上同时支持 Turbopack 和 Webpack。
-->

---

# 为什么对 SSR / RSC 友好

<v-clicks>

- 样式是构建期生成的**静态 CSS 文件**
- SSR 无需「收集运行时样式再注水」，客户端不注入 `<style>`
- 没有运行时 CSS-in-JS 的**样式闪烁（FOUC）**与注水成本
- 不依赖运行时状态 → 直接用于 **React Server Components**
- 动态部分走 `assignInlineVars`，不破坏静态 CSS 可缓存性

</v-clicks>

<div v-click class="mt-4 text-sm">

> 零运行时不是性能口号，而是让样式天然适配现代 SSR / RSC 架构。

</div>

<!--
vanilla-extract 对 SSR 和 React Server Components 特别友好，根因还是零运行时。

样式是构建期生成的静态 CSS 文件，服务端渲染时无需收集运行时生成的样式再注水，也不需要在客户端注入 style 标签。因此没有 styled-components、Emotion 那类运行时 CSS-in-JS 的 SSR 样式闪烁和注水成本。

因为不依赖运行时状态和上下文，样式可以直接用在 React Server Components 里，而 RSC 是不能带运行时 JS 状态的。需要运行时动态的部分用 assignInlineVars 走内联 CSS 变量，只改变量值，不破坏静态 CSS 的可缓存性。

一句话，零运行时不只是性能口号，它让样式天然适配现代 SSR 和 RSC 架构。
-->

---

# 选型对比

| 维度 | vanilla-extract | StyleX | Panda CSS | CSS Modules |
| --- | --- | --- | --- | --- |
| 运行时 | 零 | 零 | 零 | 零 |
| 模型 | `.css.ts` 文件 | Babel 就地共置 | 配置 + codegen | 标准 CSS |
| 类型令牌 | ✅ 契约 | ✅ | ✅ | ❌ |
| 原子化 | 靠 sprinkles | ✅ 内建 | ✅ 内建 | ❌ |

<v-clicks>

- **vanilla-extract**：TS 写样式 + 类型契约 + 独立样式文件
- vs **styled-components/Emotion**：那些是**运行时**注入，SSR/RSC 逊色

</v-clicks>

<!--
放进 CSS-in-JS 谱系对比。本组邻叶都零运行时，差异在模型。

vanilla-extract 是 TS-first 的独立 css.ts 文件模型，样式与组件分离，更贴近手写 CSS。StyleX 是 Meta 的方案，走 Babel、样式对象与组件就地共置，主打原子化合并、后者胜。Panda CSS 是配置驱动加代码生成，提供 style props 和 patterns。CSS Modules 只是标准 CSS 加作用域，没有类型安全令牌。

选型速记：想要 TS 写样式加类型安全令牌加独立样式文件加零运行时，选 vanilla-extract；想要原子化加就地共置加可预测优先级，选 StyleX；想要配置驱动的设计系统，选 Panda；只想给标准 CSS 加作用域，用 CSS Modules。

至于 styled-components、Emotion，它们是运行时注入的 CSS-in-JS，在 SSR 和 RSC 场景明显逊色于这些零运行时方案，属于衰退期，这里带过。
-->

---
layout: intro
---

# 总结

vanilla-extract = **TS-first 的零运行时样式**

- `.css.ts` 构建期出**静态 CSS + 作用域类名**，运行时零开销
- 核心：`style` / `selectors` / `vars` / `globalStyle` / 数组组合
- 主题：`createTheme`（`[class, vars]`）/ 契约先行 / `assignVars`，**类型安全令牌**
- 生态：`recipes` 多变体 · `sprinkles` 原子化 · `dynamic` 运行时变量
- 天然 SSR / RSC 友好；同为零运行时，胜在 `.css.ts` 文件模型

<!--
总结一下。vanilla-extract 是 TypeScript-first 的零运行时样式方案。

它把样式写在 css.ts 里，构建期出静态 CSS 和作用域类名，运行时零开销。核心 API 是 style 加选择器、vars 变量、globalStyle 全局样式、数组组合。

主题系统是它的亮点：createTheme 返回类名和令牌契约的元组，支持契约先行和多主题复用，assignVars 整组赋值，全程类型安全，令牌改名漏值编译期就报错。

生态三件套：recipes 管多变体组件样式，类似 cva；sprinkles 造零运行时原子化工具类，自建 Tailwind；dynamic 用 assignInlineVars 运行时改变量值实现动态主题。

因为零运行时，它天然对 SSR 和 React Server Components 友好。同为零运行时，它胜在 TS-first 的 css.ts 文件模型，更贴近手写 CSS 的心智。谢谢大家。
-->
