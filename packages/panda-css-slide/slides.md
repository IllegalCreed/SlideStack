---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Panda CSS
info: |
  Presentation Panda CSS —— 构建期的类型安全 CSS-in-JS 样式引擎。

  Learn more at [https://panda-css.com](https://panda-css.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🐼</span>
</div>

<br/>

## Panda CSS —— 构建期的类型安全 CSS-in-JS 引擎

静态分析源码 → PostCSS 生成原子 CSS → codegen；Chakra 团队出品，当前 `@pandacss/dev` 1.11.4

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/chakra-ui/panda" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Panda CSS —— 一个构建期的、类型安全的 CSS-in-JS 样式引擎。它在构建阶段静态分析源码里的样式对象，用 PostCSS 管线生成原子 CSS，同时 codegen 出一整套类型安全的样式工具。

它由 Chakra 团队打造，可以理解为 Chakra 把多年沉淀的样式系统抽出来、做成一个独立于组件、构建期提取的引擎。当前主线是 @pandacss/dev 1.11.4，MIT 协议。

诞生动机很明确：解决 Emotion、styled-components 这类运行时 CSS-in-JS 与 React Server Components 的不兼容。

今天顺序：定位与优缺点 → 构建期三步管线 → 零运行时辨析 → 安装与 codegen → css() → 条件样式两页 → recipes 三页 → patterns → tokens 两页 → cascade layers → styled JSX → 静态分析边界 → 选型对比 → 资源 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 Panda CSS？

构建期提取原子 CSS，运行时不注入样式：

<v-clicks>

- 零/轻运行时，兼容 RSC / SSR
- 设计系统层：tokens + recipes + patterns
- 类型安全，`strictTokens` 落到编译期
- cascade layers + `:where()` 管特异性

</v-clicks>

<div v-click class="mt-3 text-sm">

边界：

- 有 codegen 心智，需维护 `styled-system`
- 受静态分析约束；不含成品组件（Chakra UI 才是）

</div>

<!--
为什么用 Panda？它在构建期把样式提取成原子 CSS，运行时既不在浏览器生成样式、也不注入 head。

优势：第一是零或轻运行时，天然兼容 Server Components 和 SSR，没有 hydration 带来的样式闪烁；第二是完整的设计系统层，token、语义 token、明暗模式、变体配方、布局原语一套装齐，不用再拼第三方；第三是类型安全是一等公民，strictTokens 能把只准用 token 的约束落到编译期；第四是用 cascade layers 加 where 选择器管理特异性，覆盖可预测。

边界也要讲清：有 codegen 心智，需要生成并维护 styled-system 目录；受静态分析约束，运行时动态值提取不到；它本身不是组件库，要现成组件是 Chakra UI 的事，Chakra v3 底层才用 Panda。
-->

---

# 核心机制：构建期静态提取三步管线

Panda 的构建期工作可拆成三个机制：

<v-clicks>

1. **静态分析**：构建期解析源码，提取 `css()`/`cva`/recipe/pattern 里的样式定义
2. **PostCSS 管线**：把样式数据转成**原子 CSS** 文件（故「兼容任何支持 PostCSS 的框架」）
3. **Codegen**：产出轻量运行时工具 + `styled-system` 输出目录

</v-clicks>

<div v-click class="mt-4 text-sm">

> 关键结论：样式**构建期就定稿成静态 CSS**，浏览器直接引入——这正是它相对 Emotion / styled-components 的根本不同。

</div>

<!--
Panda 的构建期工作拆成三步。第一步静态分析：在构建期解析源码，识别并提取出 css、cva、recipe、pattern、styled 里的样式定义。第二步 PostCSS 管线：把提取到的样式数据转成原子 CSS 文件，这也是官方说它兼容任何支持 PostCSS 的框架的原因，因为提取管线本身就是一个 PostCSS 插件。第三步 codegen：生成一小段轻量运行时工具，以及 styled-system 输出目录。

关键结论是，样式在构建期就定稿成静态 CSS，浏览器直接引入，运行时不需要生成或注入。这正是它和运行时 CSS-in-JS 的根本区别，也是它能兼容 RSC 的原因。
-->

---

# 「零运行时」的真相（辨析）

官方更精确的说法：Panda **并非完全零运行时**。

<v-clicks>

- 它会生成**一小段轻量运行时 JS**——本质是把样式对象键值拼成类名的优化函数
- 但关键在于：它**不在浏览器生成样式，也不向 `<head>` 注入样式**
- 所以「零/轻运行时」是就『不在浏览器产出 CSS』而言，而非『一行 JS 都不带』

</v-clicks>

<div v-click class="mt-4 text-sm">

> 对比传统运行时方案（styled-components / Emotion）：它们在运行时**动态生成样式字符串并注入** `<head>`，有序列化 + 注入开销，且与 Server Components 不兼容。

</div>

<!--
关于零运行时，要做个辨析，避免误解。官方更精确的说法是 Panda 并非完全零运行时。

它确实会生成一小段轻量运行时 JS，本质上就是一个优化过的函数，把样式对象的键值对拼成类名字符串。所以 css、cva 这些仍然是运行时函数。但关键在于，这段运行时既不在浏览器里生成样式，也不向 head 注入样式。

所以说它零运行时或轻运行时，指的是不在浏览器产出 CSS，而不是说一行 JS 都不带。对比传统的 styled-components、Emotion，它们在运行时动态生成样式字符串并注入 head，有序列化和注入的开销，而且和 Server Components 不兼容，这正是 Panda 想解决的问题。
-->

---

# 安装与初始化（PostCSS 路线）

```bash
# 1. 安装开发依赖
npm install -D @pandacss/dev postcss

# 2. 初始化（-p 同时生成 postcss.config.cjs）
npx panda init -p
```

```js
// postcss.config.cjs
module.exports = {
  plugins: { '@pandacss/dev/postcss': {} },
};
```

```css
/* 入口 index.css：声明级联层顺序 */
@layer reset, base, tokens, recipes, utilities;
```

<!--
安装以最常见的 PostCSS 集成为例。第一步装开发依赖 @pandacss/dev 和 postcss。第二步 npx panda init 加 -p 参数，会同时生成 panda.config.ts 和 postcss.config.cjs 两份配置。

PostCSS 插件配置很简单，就是把 @pandacss/dev/postcss 挂进 plugins。

还有一件必须做的事：在入口 CSS 顶部声明级联层的顺序，reset、base、tokens、recipes、utilities，Panda 会把生成的规则填进这几层。这行声明的顺序决定了层的优先级。
-->

---

# codegen 与 styled-system 目录

```bash
panda codegen          # 生成 styled-system
panda codegen --watch  # 开发时持续生成
```

| 子路径 | 内容 |
| --- | --- |
| `styled-system/css` | `css` / `cva` / `sva` / `cx` |
| `styled-system/tokens` | `token()` 与 token 类型 |
| `styled-system/recipes` | 配置配方函数 |
| `styled-system/patterns` | 布局原语函数 |
| `styled-system/jsx` | `styled` 工厂与 JSX 组件 |

<div v-click class="mt-3 text-sm">

> `styled-system` 是构建产物，常进 `.gitignore` + 挂 `package.json` 的 `prepare: panda codegen` 自动重生。

</div>

<!--
panda codegen 会扫描源码、生成 styled-system 目录，这是你日常导入所有工具的地方。开发时可以加 --watch 持续生成。

目录的主要子模块：styled-system/css 里是 css、cva、sva、cx 这些核心函数；tokens 里是 token 函数和类型；recipes 里是配置配方生成的函数；patterns 里是布局原语函数；jsx 里是 styled 工厂和 JSX 组件，需要设 jsxFramework 才生成。

因为 styled-system 是构建产物，通常把它加进 gitignore，然后在 package.json 里挂一个 prepare 脚本跑 panda codegen，这样装完依赖会自动重新生成，不用提交到仓库。
-->

---

# css()：样式对象与原子类

```ts
import { css } from '../styled-system/css';

const cls = css({
  bg: 'red.400',        // backgroundColor 简写
  rounded: '9999px',    // borderRadius
  p: '10px 15px',       // padding
  _hover: { bg: 'red.700' },
});
// → "bg_red.400 rounded_9999px p_10px_15px ..." 一串原子类
```

<v-clicks>

- 每条声明生成一个单一职责的**原子类**，相同声明跨组件复用去重
- 简写（`bg`/`p`/`m`/`rounded`）与全称等价
- 多参**深合并、后者覆盖前者**：`css(base, override)`

</v-clicks>

<!--
css 是 Panda 最基础的入口，接一个样式对象，返回一串原子类名字符串。

这里 bg 是 backgroundColor 的简写，rounded 是 borderRadius，p 是 padding，_hover 是悬停伪状态。返回的是一串原子类，赋给 className 用。

三个要点：第一，每条声明生成一个单一职责的原子类，相同的声明跨组件复用同一个类，这就是原子 CSS 的去重红利，CSS 体积随声明种类而不是组件数增长。第二，简写和全称完全等价，按团队习惯选用。第三，css 接多个对象时会深合并，后者覆盖前者，这是组件默认样式加外部 css prop 覆盖的地基。
-->

---

# 条件样式：伪状态与响应式

```ts
// 伪状态：下划线前缀（内置 80+ 条件）
css({ _hover: { bg: 'orange.400' }, _disabled: { opacity: 0.5 } });

// 属性级条件：base 是无条件默认值
css({ bg: { base: 'red.500', _hover: 'red.700' } });

// 响应式：断点键直接作为条件（sm/md/lg/xl/2xl）
css({ fontSize: { base: 'sm', md: 'lg', lg: 'xl' } });
```

<v-clicks>

- 伪状态：`_hover` / `_focus` / `_active` / `_disabled` / `_before` …
- 条件可**嵌套**、可写在属性上，`base` 覆盖默认值
- 也支持原生嵌套选择器 `'&:hover'` 与 at-rule 键 `'@media (...)'`

</v-clicks>

<!--
条件样式有几种写法。第一种是伪状态，用下划线前缀，比如 _hover、_disabled，Panda 内置了 80 多个条件。第二种是属性级条件，把条件直接写在属性上，比如 bg 传一个对象，base 是无条件默认值，_hover 是悬停时的值。第三种是响应式，给属性传 base、sm、md、lg、xl、2xl 的条件对象，base 覆盖最小屏，其余键对应断点，移动优先。

要点：伪状态涵盖交互态、子元素、伪元素；条件可以嵌套，也可以写在属性上，base 是默认值；此外还支持原生嵌套选择器写 & 冒号 hover，以及把 at-rule 比如 media 查询当键写。
-->

---

# data / aria 条件与 group 选择器

```ts
// 语义条件：aria-expanded="true" 命中 _expanded
css({ _expanded: { transform: 'rotate(180deg)' } });

// 任意属性选择器
css({ '&[data-state=closed]': { color: 'red.300' } });
```

```tsx
// 父加 group 类，子用 _groupHover
<div className="group">
  <p className={css({ _groupHover: { bg: 'red.500' } })}>hover parent</p>
</div>
```

<div v-click class="mt-2 text-sm">

> 内置丰富 data / aria 条件（`_checked` / `_selected` / `_expanded`…），干净配合 Radix / Ark 等以 data 属性表达状态的**无头组件**。

</div>

<!--
Panda 内置了对 data 属性和 aria 属性状态的语义条件。比如 _expanded 对应 aria-expanded 等于 true，命中时旋转 180 度。也可以直接写任意属性选择器，比如 data-state 等于 closed。

父子联动用 group 机制，跟 Tailwind 一样：父元素加 group 类，子元素用 _groupHover，父悬停时子变样式。类似的还有 peer 用于兄弟元素。

这套 data、aria 条件的价值在于，它能非常干净地配合 Radix、Ark 这类无头组件，因为这些组件正是用 data 属性来表达开关、选中、展开这些状态的。
-->

---

# Recipes①：cva 原子配方

```ts
import { cva } from '../styled-system/css';

const button = cva({
  base: { display: 'flex', alignItems: 'center' },
  variants: {
    visual: { solid: { bg: 'red.200' }, outline: { borderWidth: '1px' } },
    size: { sm: { p: '4' }, lg: { p: '8' } },
  },
  defaultVariants: { visual: 'solid', size: 'lg' },
});

<button className={button({ visual: 'outline', size: 'sm' })} />;
```

<div v-click class="mt-2 text-sm">

> 四要素：`base` / `variants` / `compoundVariants` / `defaultVariants`。cva **全量生成**所有变体、可与组件共置，但**不支持响应式变体 props**。

</div>

<!--
Recipe 就是多变体样式，四要素：base 基础样式、variants 变体、compoundVariants 组合变体、defaultVariants 默认取值。

原子配方用 cva 函数，从 styled-system/css 导入，就地定义。这个 button 有 visual 和 size 两个变体维度，defaultVariants 设了默认值。调用时传变体值，返回对应类名。

cva 的特点：它会把所有变体组合的样式提前全量生成为原子类；可以和组件写在同一个文件里，共置很方便；但它不支持把响应式对象传给变体 props，这是它和配置配方的关键区别，下一页讲。
-->

---

# Recipes②：配置配方 defineRecipe

```ts
// button.recipe.ts
import { defineRecipe } from '@pandacss/dev';
export const buttonRecipe = defineRecipe({
  className: 'button',
  base: { display: 'flex' },
  variants: { size: { sm: { p: '4' }, lg: { p: '8' } } },
});
// panda.config.ts → theme.extend.recipes.button = buttonRecipe
// 消费：import { button } from '../styled-system/recipes'
```

| 维度 | 配置配方 `defineRecipe` | 原子配方 `cva` |
| --- | --- | --- |
| 生成时机 | JIT——只出用到的变体 | 所有变体全量生成 |
| 响应式变体 | ✅（无 compoundVariants 时） | ❌ |
| 与组件共置 | ❌（须注册 config） | ✅ |

<!--
配置配方用 defineRecipe，从 @pandacss/dev 导入，单独文件定义，然后注册进 panda.config 的 theme.extend.recipes，最后从 styled-system/recipes 导入同名函数消费。

对比很关键。生成时机上，配置配方是 JIT，只生成实际用到的变体；原子配方 cva 是把所有变体提前全量生成。响应式变体上，配置配方支持给变体传响应式对象，前提是不用 compoundVariants；cva 不支持。共置上，cva 能和组件写一起，配置配方必须注册进 config。

选型信号：需要响应式变体或想 JIT 精简产物，用配置配方；想和组件共置、变体不多，用 cva。组件库对外分发时，还要用配置里的 staticCss 强制全量生成，保证所有变体都在 CSS 里。
-->

---

# Recipes③：slot recipes 多部件组件

```ts
import { sva } from '../styled-system/css';

const checkbox = sva({
  slots: ['root', 'control', 'label'],
  base: {
    root: { display: 'flex', gap: '2' },
    control: { borderWidth: '1px', rounded: 'sm' },
  },
  variants: { size: { sm: { control: { w: '8' } } } },
});

const s = checkbox({ size: 'sm' });
// s.root / s.control / s.label 分别是各部件类名
```

<div v-click class="mt-2 text-sm">

> 带多个子部件的组件（Checkbox / Tabs / Menu…）用**插槽配方**：原子式 `sva`、配置式 `defineSlotRecipe`；声明 `slots`，各 slot 分写样式，一次调用返回各部件类名映射。

</div>

<!--
第三种是插槽配方，专门给多部件组件用。比如一个 Checkbox 有 root、control、label 三个子部件，一个 Tabs 有 root、list、trigger、content，这些组件的每个部件都要有自己的样式和变体。

用 sva 函数，声明 slots 数组列出所有部件，然后 base 和 variants 里为每个 slot 分别写样式。调用一次，返回一个对象，里面 root、control、label 分别是各部件的类名。

原子式用 sva，从 styled-system/css 导入；配置式用 defineSlotRecipe，从 @pandacss/dev 导入注册进 config。这套机制让多部件组件的变体样式能内聚地统一管理，而不是散在各处手写。
-->

---

# Patterns：布局原语

```tsx
// 函数式：从 styled-system/patterns 导入
import { stack, grid } from '../styled-system/patterns';
<div className={stack({ gap: '6', align: 'center' })} />;

// JSX 式：从 styled-system/jsx 导入（需 jsxFramework）
import { Stack, Grid } from '../styled-system/jsx';
<Stack gap="6"><div>A</div></Stack>;
```

<v-clicks>

- 内置：`stack`/`hstack`/`vstack`/`flex`/`grid`/`gridItem`/`container`/`center`/`aspectRatio`/`circle`/`wrap`/`divider`…
- 接收语义化 props：`gap`/`direction`/`align`/`justify`/`columns`
- ⚠️ 响应式**直接写在 prop 上**（`columns` 传 base/md 对象），别嵌成单独 `md` prop

</v-clicks>

<!--
Patterns 是布局原语，把常见的 flex、grid 布局封装成可复用的函数或组件。

两种形态：函数式从 styled-system/patterns 导入，比如 stack 返回类名；JSX 式从 styled-system/jsx 导入，比如 Stack 组件，需要设 jsxFramework。

内置的 pattern 很多：stack、hstack、vstack 管纵横排列，flex、grid、gridItem 管弹性和网格，container 是居中限宽容器，center 居中，aspectRatio 固定宽高比，circle、square、wrap、divider 等等。它们接收语义化的 props，比如 gap、direction、align、justify、columns。

有个坑要注意：pattern 的响应式 props 要直接写在 prop 上，比如给 columns 传 base、md 的响应式对象，别把断点嵌成一个单独的 md prop，那样是错的。
-->

---

# Tokens：设计 token

```ts
// panda.config.ts
export default defineConfig({
  theme: {
    extend: {
      tokens: {
        colors: { primary: { value: '#0FEE0F' } },
        spacing: { gutter: { value: '24px' } },
      },
    },
  },
});
```

<v-clicks>

- **必须用 `value` 包裹**：`{ value: '#0FEE0F' }`（为 `description` 等元数据留位）
- 20+ 类型：colors / spacing / fonts / sizes / radii / shadows / zIndex…
- 消费：`css({ color: 'primary' })`；按路径取值 `token('colors.red.400')`

</v-clicks>

<!--
Token 是管理设计决策的平台无关键值对。在 panda.config 的 theme 下按类型分组定义。

有个硬性要求：token 的值必须嵌套在带 value 键的对象里，比如 primary 冒号 value 冒号 十六进制色值，不能写成扁平的 primary 直接等于色值。用 value 包裹是为了给将来的 description 等元数据留位置。

Panda 支持 20 多种 token 类型：颜色、间距、字体、尺寸、圆角、阴影、层级等等。

消费时在样式对象里直接写 token 名，比如 color 冒号 primary。如果要在样式里按路径拿 token 的原始值或变量引用，比如拼进 boxShadow、gradient 这类复合值，用 token 函数，token.var 还能直接给 var 引用形式。
-->

---

# 语义 token 与明暗模式

```ts
semanticTokens: {
  colors: {
    // 花括号引用原始 token，解耦「意图」与「具体值」
    danger: { value: '{colors.red.500}' },
    // 条件值：为明暗分别引用
    'bg.canvas': {
      value: { base: '{colors.white}', _dark: '{colors.gray.900}' },
    },
  },
}
```

<div v-click class="mt-3 text-sm">

> 切到暗色（`.dark` / `[data-theme=dark]` 触发 `_dark`）时，token 自动指向暗色值——**所有用到它的样式代码一行都不用改**，因为切换发生在 CSS 变量层。

</div>

<!--
原始 token 描述具体值，比如 red.500；语义 token 描述设计意图，比如 danger。语义 token 用花括号引用语法指向原始 token，把意图和具体值解耦，改主题时只需换引用目标。

实现明暗模式，只需给语义 token 一个条件值对象，为明暗分别引用。比如 bg.canvas，base 引用白色，_dark 引用深灰。

切到暗色时，比如 html 上加 dark 类或者 data-theme 等于 dark，触发 _dark 条件，token 自动指向暗色引用。关键在于，所有用到这个 token 的样式代码一行都不用改，因为切换发生在 CSS 变量层。token 落地为 CSS 变量，改变量就等于整体换肤。
-->

---

# textStyles 与 cascade layers

```ts
// 命名排版组合：一处引用套整组字体属性
const textStyles = defineTextStyles({
  body: { value: { fontFamily: 'Inter', fontSize: '16px', lineHeight: '24px' } },
});
// 消费：css({ textStyle: 'body' })
```

| 层 | 内容 | 优先级 |
| --- | --- | --- |
| `reset` → `base` → `tokens` | reset / 全局 / 变量 | 低 → |
| `recipes` | 配方组件样式 | ↑ |
| `utilities` | 原子工具类（`css()`） | **最高** |

<div v-click class="text-sm">

> `@layer` 让**层顺序**而非选择器权重决定覆盖；配合 `:where()` 低特异性，覆盖可预测，不靠 `!important`。

</div>

<!--
textStyles 是命名的排版组合，用 defineTextStyles 把一组常用字体属性打包，比如 body 包含 fontFamily、fontSize、lineHeight。消费时用 textStyle 属性一处引用套用整组。官方建议 textStyle 里只放排版属性，别混入布局和颜色。

cascade layers 是 Panda 管理特异性的核心。它把生成的 CSS 组织进五个层：reset、base、tokens、recipes、utilities，样式表顶部一行声明它们的顺序。后声明的层优先级更高，所以 utilities 稳定压过 recipes 和 base。

好处是，层的先后而不是选择器复杂度决定谁覆盖谁，配合 token 用 where 选择器保持零特异性，样式覆盖变得可预测，完全不需要靠 important 或者加长选择器去提权。老浏览器不支持 layer 时，用 postcss-cascade-layers 插件做 polyfill。
-->

---

# styled JSX 工厂与样式 props

```tsx
import { styled } from '../styled-system/jsx';

// ① 直接把 CSS 属性当 props（构建期静态提取）
const Btn = styled('button');
<Btn bg="blue.500" px="4" rounded="md">Go</Btn>;

// ② 绑定配方
const Button = styled('button', {
  base: { px: '4' },
  variants: { tone: { primary: { bg: 'blue.500' } } },
});
```

<v-clicks>

- 需配置 `jsxFramework: 'react' | 'preact' | 'vue' | 'qwik' | 'solid'`
- 自定义组件吃样式 props：`splitCssProps` + `HTMLStyledProps<'div'>`
- `forwardProps` / `shouldForwardProp` 控制哪些 props 透传到 DOM

</v-clicks>

<!--
设置 jsxFramework 后，styled-system/jsx 会生成一个 styled 工厂，做出能直接接收 CSS 属性作为 props 的组件。

两种用法：第一种直接创建元素，样式当 props 写，比如 bg、px、rounded，Panda 在构建期静态提取，不是内联样式。第二种绑定配方，等价于把 recipe 挂到组件上，带 base 和 variants。

启用它需要在配置里声明框架，react、preact、vue、qwik、solid 都支持。想让自己写的组件也吃样式 props，用 splitCssProps 把样式 props 和其余 props 拆开，配合 HTMLStyledProps 类型。工厂选项里 forwardProps、shouldForwardProp 控制哪些 props 透传到 DOM，因为样式 props 默认被消费掉、不落到 DOM 上。
-->

---

# 静态分析的边界（易踩坑）

Panda 靠**静态分析源码**提取样式，值必须构建期可确定：

```ts
// ❌ 运行时才算出的动态值 → 提取不到
css({ color: getColorFromApi() });
// ✅ 用 token / CSS 变量，或有限取值做 recipe 变体
css({ color: 'brand.primary' });
button({ tone: userTone }); // tone 取值集合在配方里静态穷举
```

<v-clicks>

- ⚠️ **不能运行时重命名属性**：别把 `circleSize` 映射回 `size`，静态分析追不到
- 需要「无穷动态」→ 走 CSS 变量，在运行时改变量，而非让 Panda 提取看不见的值

</v-clicks>

<!--
Panda 的一切都建立在静态分析源码之上，所以值必须是构建期可确定的，这里有两类常见踩坑。

第一类，运行时才算出的动态值提取不到。比如 color 传一个 getColorFromApi 的返回值，构建期分析拿不到这个结果。正解是改用 token 或 CSS 变量，或者把有限的取值做成 recipe 变体，因为变体的取值集合在配方里是静态穷举的，可以提取。

第二类，不能在运行时重命名属性。别把自定义的 circleSize 这类 prop 名在运行时映射回样式属性 size，静态分析看不到这层动态映射，会漏提。正解是让 prop 名和样式属性直接对应，或者走 recipe 变体。

一句话，能被静态穷举或直接书写的值才安全；真需要无穷动态时，走 CSS 变量在运行时改变量，而不是让 Panda 去提取一个它看不见的值。
-->

---

# 选型对比：CSS-in-JS 组 + 邻居

| 方案 | 提取机制 | 设计系统层 | 一句话 |
| --- | --- | --- | --- |
| **Panda** | 静态分析 → PostCSS | 完整 | 类型安全的完整样式引擎 |
| StyleX（Meta） | 构建期编译 | 少（偏原语） | 可预测的原子样式原语 |
| vanilla-extract | 执行 `.css.ts` 求值 | 中 | 文件即样式契约 |
| CSS Modules | 打包器作用域类名 | 无 | 局部作用域基线 |
| Tailwind | 扫描 class 生成 | 中 | class 字符串原子化 |

<div v-click class="mt-2 text-sm">

> 同 Chakra 团队的 **Chakra UI v3** 是成品组件库（底层用 Panda 供样式）；Panda 是**无组件**的样式引擎。

</div>

<!--
把 Panda 放进 CSS-in-JS 组和邻居里横向对比。

Panda：静态分析源码经 PostCSS 生成原子 CSS，设计系统层最完整，一句话是类型安全的完整样式引擎。StyleX 是 Meta 的，同样构建期编译、几乎零运行时，但偏原子样式原语，设计系统层要自己搭。vanilla-extract 是构建期执行 css.ts 文件求值生成作用域 class，文件即样式契约。CSS Modules 是打包器做局部作用域类名，零运行时但没有 token、变体、类型体系，是最朴素的基线。Tailwind 扫描 class 字符串生成原子 CSS。

Panda 和 StyleX、vanilla-extract 都是零或轻运行时的构建期方案，机制同源，区别在 API 风格和范畴。Panda 和 Tailwind 都产原子 CSS，区别是 Panda 在 TS 里写类型安全的样式对象和配方。

最后，同样是 Chakra 团队出品，Chakra UI v3 是成品组件库，底层正是用 Panda 做样式引擎；Panda 本身不含任何组件，是样式引擎。要现成组件用 Chakra，要给自建组件当样式底座用 Panda。
-->

---

# 资源与延伸阅读

<v-clicks>

- 官方文档：https://panda-css.com/docs
- GitHub：https://github.com/chakra-ui/panda
- npm：`@pandacss/dev`（1.11.4，MIT，Chakra 团队）
- Why Panda：panda-css.com/docs/overview/why-panda
- 概念页：Writing Styles / Recipes / Patterns / Conditional Styles
- 主题页：Tokens / Text Styles / Cascade Layers

</v-clicks>

<!--
资源汇总。官方文档 panda-css.com/docs 是最权威的一手信源，导航清晰。GitHub 仓库 chakra-ui/panda 可以看源码和 issue。npm 包名 @pandacss/dev，当前 1.11.4，MIT 协议，Chakra 团队维护。

想快速理解定位，先读 Why Panda 那页。概念相关重点读 Writing Styles、Recipes、Patterns、Conditional Styles 四页。主题相关读 Tokens、Text Styles、Cascade Layers。这些页过一遍，Panda 的核心心智就齐了。
-->

---
layout: intro
---

# 总结

Panda CSS = **构建期静态提取的类型安全 CSS-in-JS 引擎**

- 三步管线：静态分析 → PostCSS 原子 CSS → codegen（`styled-system`）
- 零/轻运行时：不在浏览器生成/注入样式，天然兼容 RSC / SSR
- 设计系统层：`css()` + tokens/semanticTokens + recipes（`cva`/slot）+ patterns
- 明暗模式靠语义 token 条件值；特异性靠 cascade layers + `:where()`
- 受静态分析约束：值须可静态穷举，动态走 CSS 变量
- 1.11.4 · Chakra 团队 · 服务端优先时代的样式方案

<!--
总结一下。Panda CSS 是一个构建期静态提取的、类型安全的 CSS-in-JS 样式引擎。

核心心智：三步管线是静态分析源码、PostCSS 生成原子 CSS、codegen 出 styled-system 目录；它是零或轻运行时，不在浏览器生成或注入样式，天然兼容 RSC 和 SSR；它提供完整的设计系统层，css 加 tokens、语义 token，加 recipes，包括 cva 和 slot recipe，再加 patterns 布局原语；明暗模式靠语义 token 的条件值实现，特异性靠 cascade layers 加 where 选择器管理，不用 important。

一个必须记住的约束：它受静态分析约束，值必须可静态穷举，真需要动态就走 CSS 变量。

当前 1.11.4，Chakra 团队出品，是为服务端优先时代设计的、不牺牲开发体验的样式方案。谢谢大家。
-->
