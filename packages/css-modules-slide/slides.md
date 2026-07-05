---
theme: seriph
background: https://cover.sli.dev
title: CSS Modules 构建期作用域方案
info: |
  Presentation CSS Modules —— 构建期把类名局部作用域化的样式方案。

  Learn more at [https://github.com/css-modules/css-modules](https://github.com/css-modules/css-modules)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎨</span>
</div>

<br/>

## CSS Modules —— 构建期把类名局部作用域化

写标准 CSS、零运行时的「作用域基线」：编译期把 `.foo` 改写成唯一名，导出映射供 JS 引用

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/css-modules/css-modules" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 CSS Modules —— 一种构建期把类名局部作用域化的样式方案。

它的定义只有一句：一个所有类名和动画名默认局部作用域的 CSS 文件。关键是你写的仍是标准 CSS，作用域在编译期完成，运行时零开销，所以它是「作用域基线」，不是运行时 CSS-in-JS。

注意它不是单一版本的库，而是一份约定加各构建工具的实现：Vite、webpack 的 css-loader、Next.js、CRA、postcss-modules 都支持。

今天顺序：定位 → 工作原理 → 基本用法 → 默认局部 → :global/:local → 命名与哈希 → composes 组合 → @value 值变量 → 框架集成 → TypeScript → 对照 CSS-in-JS → 选型 → 易错点 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 CSS Modules？

<v-clicks>

- 编译期改写成唯一哈希名，根治全局类名冲突
- 写标准 CSS，技能/工具链复用，可叠预处理器
- 零运行时：产物是普通 CSS + 映射，贴近手写
- 框架无关：Vite / webpack / Next.js / CRA 内建

</v-clicks>

<div v-click class="mt-4">

但它只是**作用域基线**：

- 不做运行时动态样式，只能切类 / 叠 `var()`
- TypeScript 默认无类型，写错类名不报错

</div>

<!--
为什么用 CSS Modules？它是构建期作用域化方案，写标准 CSS、零运行时。

优点：第一是编译期把类名改写成全局唯一哈希名，从根上消除跨文件同名类冲突，告别 BEM 式冗长命名。第二是写的仍是标准 CSS，既有 CSS 技能和工具链直接复用，还能叠加 SCSS 等预处理器。第三是零运行时，产物就是普通 CSS 加一份类名映射，浏览器端没有样式引擎在跑，性能贴近手写 CSS。第四是框架无关，Vite、webpack、Next.js、CRA 都内建支持。

但要认清边界：它只解决作用域这一件事，是作用域基线。它不做运行时动态样式，想按 props 动态只能切换预定义类或叠原生 var()。而且 TypeScript 默认不认识 CSS 资源导入，styles 是 any，写错类名不报错，需要额外补类型。后面会专门讲这些。
-->

---

# CSS Modules 是什么

官方定义：**一个所有类名和动画名默认被局部作用域化的 CSS 文件**。

<v-clicks>

- **CSS file**：写的是标准 CSS 文件，不在 JS 里写样式
- **scoped locally**：类名限定在导入它的模块内，跨文件互不干扰
- **by default**：**默认**就局部——与普通 CSS「默认全局」相反

</v-clicks>

<div v-click class="mt-4 text-sm">

> ⚠️ 它不是单一版本的库，而是**约定/规范**（css-modules/css-modules）+ 构建期**实现**（Vite 8.1 / css-loader 7.x / postcss-modules 9.x / Next.js 16.x）。没有「CSS Modules 3.0」这种版本号。

</div>

<!--
CSS Modules 是什么？官方定义原文只有一句：一个所有类名和动画名默认被局部作用域化的 CSS 文件。

拆成三个关键词。CSS file：你写的仍是标准 CSS 文件，不是在 JS 里写样式，这把它和 styled-components 那类在 JS 里写样式的真 CSS-in-JS 明确区分开。scoped locally：类名被限定在导入它的模块内，跨文件互不干扰。by default：默认就是局部，这和普通 CSS 默认全局正好相反。

一个很重要的澄清：它不是单一版本的库，而是一份约定或规范，加上各构建工具的编译期实现。真正带版本号的是各实现，比如 Vite 8.1、css-loader 7.x、postcss-modules 9.x、Next.js 16.x。不存在一个叫 CSS Modules 3.0 的东西。
-->

---

# 工作原理：改写类名 + 导出映射

```css
/* Button.module.css */
.button {
  padding: 8px 16px;
  border-radius: 6px;
}
```

编译期做两件事：**改写类名**（唯一哈希名）+ **导出映射对象**：

```js
// 编译产物（示意）
export default { button: '_button_x1y2' };
```

<div v-click class="mt-2 text-sm">

> 底层先编译到 **ICSS**（Interoperable CSS，用 `:import`/`:export` 描述绑定）。两个文件都写 `.button`，编译后是两个不同哈希名，互不覆盖。`@keyframes` 动画名同样被作用域化。

</div>

<!--
工作原理是理解 CSS Modules 的核心。给一个最小的 Button.module.css，里面写了一个 .button 类。

构建工具在编译期做两件事。第一，改写类名，把 .button 换成一个全局唯一的哈希名，比如 _button_x1y2，具体格式由配置决定。第二，导出一个映射对象，键是你写的原始类名 button，值是编译后的唯一名。

底层它先编译到 ICSS，也就是 Interoperable CSS，一种用 :import 和 :export 描述绑定关系的低层交换格式，各工具在 ICSS 之上生成最终映射。

唯一化类名正是避免冲突的手段：两个文件都写 .button，编译后是两个不同的哈希名，互不覆盖。另外 @keyframes 的动画名也同样被作用域化，不同模块定义同名动画不会互相污染。
-->

---

# 基本用法：import styles → styles.foo

```jsx
// Button.jsx
import styles from './Button.module.css';

export function Button() {
  // styles.button 运行时就是 '_button_x1y2' 真实哈希名
  return <button className={styles.button}>点我</button>;
}
```

<v-clicks>

- `import styles from ...` 是**默认导入**——映射对象作为 default export
- ⚠️ 原始类名已被哈希，直接写 `className="button"` **命不中**
- 多类拼接：`` className={`${styles.button} ${styles.primary}`} `` 或用 `clsx`

</v-clicks>

<!--
基本用法就三步：默认导入映射对象、用属性访问取真实类名、赋给 className。

看这个 Button 组件：import styles from Button.module.css 拿到映射对象，然后 className 等于 styles.button，这个 styles.button 在运行时就是 _button_x1y2 这个真实哈希类名。

三个要点。第一，import styles from 是默认导入，CSS Modules 默认把整份映射作为 default export 导出。第二个是最常见的坑：因为原始类名已经被哈希，你直接写 className 等于字面的 button 是命不中样式的，必须走 styles.button。第三，多个类拼接就用模板字符串把几个 styles 属性拼起来，或者用 clsx 这类小工具。
-->

---

# 默认局部 vs 普通 CSS 默认全局

| 维度 | 普通 CSS | CSS Modules |
| --- | --- | --- |
| 默认作用域 | **全局**（易冲突） | **局部**（限本模块） |
| 类名 | 原样输出 | 编译期改唯一哈希名 |
| 引用 | `class="button"` | `className={styles.button}` |
| 冲突风险 | 高 | 无（哈希唯一） |
| 触发 | 普通 `.css` | `.module.css` 后缀 |

<div v-click class="mt-3 text-sm">

> 一句话心智：CSS Modules 把 CSS 的「默认全局」**翻转**成「默认局部」，只解决作用域这一件事。

</div>

<!--
这张表是理解 CSS Modules 的关键对照。

默认作用域上，普通 CSS 是全局，一个 .button 到处生效、极易冲突；CSS Modules 是局部，限定在导入它的模块内。类名上，普通 CSS 原样输出，CSS Modules 编译期改写成唯一哈希名。引用上，普通 CSS 写字面 class 等于 button，CSS Modules 走 className 等于 styles.button。冲突风险上，普通 CSS 高，CSS Modules 因为哈希唯一所以无冲突。触发上，普通 .css 是全局，只有 .module.css 后缀才启用模块化。

一句话心智：CSS Modules 把 CSS 的默认全局翻转成默认局部，只解决作用域这一件事，这也是它被称为作用域基线的原因。
-->

---

# `:global` 全局例外

默认局部，但有时需要全局类（对接第三方、测试钩子、全站样式）：

```css
/* 局部（默认）：被哈希 */
.title { font-size: 20px; }

/* 全局例外：保持原名 .app-header，不哈希 */
:global(.app-header) { position: sticky; }

/* 局部类内引用全局后代 */
.title :global(.icon) { margin-right: 4px; }
```

<div v-click class="mt-2 text-sm">

> `:global(.app-header)` 编译后仍是 `.app-header`，全局可命中。`:global` 可出现在选择器任意位置，只影响其后部分。

</div>

<!--
默认局部很好，但有时你需要一个全局类。比如对接第三方库约定的类名 swiper-slide、给端到端测试留稳定钩子、或者写一段真正全站生效的样式。

这时用 :global 包裹。看例子：.title 是默认局部，会被哈希。:global 括号 .app-header 是全局例外，编译后保持原名 .app-header，不被哈希，全局可命中。第三个例子 .title 空格 :global 括号 .icon，表示局部 .title 后代里的全局 .icon，前半局部、后半全局，粒度很细。

关键点：:global 可以出现在选择器的任意位置，只影响它之后的部分，所以你能很精细地控制哪一段全局、哪一段局部。
-->

---

# `:local` / 块级切换 / scopeBehaviour

三种控制作用域的手段，粒度从小到大：

```css
/* 1) 函数式：精确到单个选择器 */
:global(.a) { }
:local(.b)  { }

/* 2) 块级切换：一段范围内改默认作用域 */
:global { .legacy-a { } .legacy-b { } }
```

```js
// 3) 配置级：改整个文件/项目默认作用域
css: { modules: { scopeBehaviour: 'local' } } // 默认；'global' 则默认不哈希
```

<!--
控制作用域有三种手段，粒度从小到大。

第一种函数式，精确到单个选择器：:global 括号 .a 让 a 全局，:local 括号 .b 让 b 局部。

第二种块级切换，在一段范围内改默认作用域：:global 花括号里放多个类，整块都当全局，适合批量声明多个全局类，省去逐个包裹。:local 花括号反之。

第三种配置级，改整个文件或项目的默认作用域：scopeBehaviour 默认是 local，也就是默认局部；设成 global 则默认不哈希，此时想局部化的类要显式用 :local 包裹。这个通常只在迁移旧全局样式时才用。
-->

---

# 命名约定：camelCase 与 localsConvention

官方推荐 **camelCase** 局部类名，纯为 JS 访问便利：

```jsx
<div className={styles.pullQuote} />      // ✅ 点号顺手
<div className={styles['pull-quote']} />  // ⚠️ kebab 只能方括号
```

`localsConvention` 控制导出映射的**键名风格**（让 CSS 写 kebab、JS 用驼峰）：

| 取值 | `.apply-color` 导出的键 |
| --- | --- |
| `camelCase` | `apply-color` **和** `applyColor` |
| `camelCaseOnly` | 只 `applyColor` |
| `dashesOnly` | 只转连字符版本 |

<!--
命名约定。官方在 naming 文档里明确推荐局部类名用 camelCase，原因纯粹是 JS 访问便利。

看例子：camelCase 的 pullQuote，JS 里 styles.pullQuote 点号访问很顺手。而 kebab-case 的 pull-quote，styles.pull-quote 会被 JS 当成 styles.pull 减 quote，只能退而用方括号 styles 中括号引号 pull-quote。注意 kebab-case 在 CSS 里完全合法，问题只出在 JS 点号访问。

这是推荐而非强制。如果你想在 CSS 里写 kebab-case，可以靠 localsConvention 自动转驼峰导出。它控制导出映射里键的命名风格。以 apply-color 为例：camelCase 会同时导出原名和 applyColor 两个键；camelCaseOnly 只导出 applyColor；dashesOnly 只转连字符版本。webpack css-loader 里对应选项叫 exportLocalsConvention，语义一致。
-->

---

# 哈希名格式：可读 vs 精简

哈希名怎么长，由生成模板控制——是**可读性 vs 隐私/体积**的取舍：

```js
// postcss-modules（Vite 底层）：generateScopedName
// 默认 [name]__[local]___[hash:base64:5] → Button__title___2xhGs
generateScopedName: '[name]__[local]___[hash:base64:5]'

// webpack css-loader：localIdentName（默认 [hash:base64]）
localIdentName: '[path][name]__[local]'  // 开发可读
// 生产换 '[hash:base64]' —— 更短、不泄露目录结构
```

<div v-click class="mt-2 text-sm">

> 占位符：`[name]` 文件名 / `[local]` 原类名 / `[hash:base64:5]` 短哈希 / `[path]` 路径。`hashPrefix` 加盐避免跨项目碰撞。

</div>

<!--
哈希名格式。哈希名怎么长由生成模板控制，这是可读性和隐私体积之间的取舍。

Vite 底层用 postcss-modules，配置项是 generateScopedName，默认模板是文件名加双下划线加原类名加三下划线加五位哈希，比如 Button 类 title 会变成 Button 双下划线 title 三下划线 2xhGs，既相对可读又足够唯一。

webpack 的 css-loader 用 localIdentName，默认是纯哈希 hash base64。开发环境推荐可读的 path name local，方便在 DevTools 里对照源码定位；生产环境换成纯哈希 hash base64，更短，还避免泄露目录结构。

常用占位符：name 是文件名，local 是原类名，hash base64 冒号 5 是五位短哈希，path 是相对路径。还有 hashPrefix 可以加盐，规避不同项目之间的哈希碰撞。两个选项也都支持传函数完全自定义。
-->

---

# `composes`：样式组合复用

CSS Modules 特有的复用机制——不是合并规则，而是**多个类名拼接**：

```css
.base {
  padding: 8px 16px;
  border-radius: 6px;
}
.primary {
  composes: base;        /* 组合 base */
  background: #3b82f6;
}
```

```js
// styles.primary === '_base_a1b2 _primary_c3d4'（两个类拼接）
```

<div v-click class="mt-2 text-sm">

> `className={styles.primary}` 会同时挂 `base` 和 `primary` 两个哈希类，浏览器按层叠合成。比 Sass `@extend` 更贴近「多类名叠加」。

</div>

<!--
composes 是 CSS Modules 特有的样式复用机制。关键是它不是把样式合并成一条规则，而是在 JS 侧把多个类名拼接起来。

看例子：.base 定义了内边距和圆角，.primary 里写 composes: base，组合 base，再加自己的背景色。编译后 styles.primary 实际是两个类名的拼接，_base 加空格加 _primary。

在 JSX 里 className 等于 styles.primary 会同时挂上 base 和 primary 两个哈希类，浏览器按 CSS 层叠合成最终样式。这个多类名叠加的心智比 Sass 的 @extend 更直观，@extend 是把选择器合并，composes 是把类名并列。
-->

---

# `composes` 三种来源

```css
/* 1) 同文件 */
.primary { composes: base; }

/* 2) 跨文件：from '路径' */
.card { composes: shadow from './effects.module.css'; }

/* 3) 全局：from global（组合未哈希的全局类） */
.toast { composes: animated from global; }

/* 一次多个：空格分隔 */
.fancy { composes: base shadow; }
```

<div v-click class="mt-2 text-sm">

> ⚠️ 约束：只能组合**单个局部类名**（不能复合选择器/标签）；`composes` 必须写在规则内**其他声明之前**。

</div>

<!--
composes 有三种来源。

第一种同文件，直接写类名：composes: base。第二种跨文件，用 from 加路径：composes: shadow from effects.module.css，这样 styles.card 会带上 effects 文件里 shadow 的哈希名，实现跨文件复用。第三种全局，用 from global：composes: animated from global，组合一个全局作用域的类，它保持原名不哈希，常用于对接第三方库类或全局动画。

还可以一次组合多个，空格分隔：composes: base shadow。

两条硬约束要记住：composes 只能组合单个局部类名，不能是复合选择器或标签选择器；而且 composes 必须写在规则内其他声明之前，否则报错。
-->

---

# `composes` 的两个坑

<v-clicks>

- **跨文件同属性冲突 = 未定义行为**：不要在组合进同一个类的、来自不同文件的多个来源里，为同一属性给不同值（谁赢未定义）
- **输出顺序不由 composes 位置决定**：composes 表达的是**依赖**，最终 CSS 层叠顺序由工具按依赖排布——别靠书写位置控制优先级

</v-clicks>

<div v-click class="mt-4 text-sm">

```css
.mixed {
  composes: a from './a.css'; /* a: color red */
  composes: b from './b.css'; /* b: color blue */
  /* 两个都设 color → 最终谁赢「未定义」，别这么写 */
}
```

</div>

<!--
composes 有两个容易踩的进阶坑。

第一个坑：跨文件同属性冲突是未定义行为。官方明确警告，不要在组合进同一个类的、来自不同文件的多个来源里，为同一个 CSS 属性定义不同的值。看下面代码，.mixed 同时组合了 a 文件的 a 和 b 文件的 b，而 a 设了红色、b 设了蓝色，都是 color 属性，最终谁赢是未定义的，别这么写。

第二个坑：CSS 输出顺序不由 composes 书写位置决定。composes 表达的是组合依赖，被组合类的 CSS 在产物里的先后由构建工具按依赖排布，不是你写 composes 的位置。所以别想靠 composes 的书写顺序来控制哪条样式最终胜出，要覆盖就用更明确的选择器，或者干脆避免冲突。
-->

---

# `@value`：编译期值变量

在 CSS Modules 里定义可复用的值（颜色/断点/选择器名），可跨文件导入：

```css
/* colors.module.css */
@value primary: #BF4040;
@value breakpointLarge: (min-width: 960px);

.header { color: primary; }
@media breakpointLarge { .header { padding: 20px; } }
```

```css
/* card.module.css —— 跨文件导入，集中管理令牌 */
@value primary from './colors.module.css';
.card { border-color: primary; }
```

<!--
@value 让你在 CSS Modules 里定义可复用的值，来源是 ICSS 的 css-modules-values 能力。它可以用于颜色、断点，甚至选择器名。

看第一个文件 colors.module.css：@value primary 等于一个颜色值，@value breakpointLarge 等于一个媒体查询条件。然后 .header 里 color 用 primary，媒体查询里直接用 breakpointLarge。

第二个文件 card.module.css 展示跨文件导入：@value primary from colors.module.css，从另一个 CSS Module 导入已定义的值变量，然后像本地值一样使用。这让你可以集中管理设计令牌，比如统一的色板、断点，改一处即可，多个模块共享同一份定义。
-->

---

# `@value` vs 原生 `var()`

本质是**编译期 vs 运行时**：

| 维度 | `@value` | `var(--x)` |
| --- | --- | --- |
| 时机 | **编译期**替换（固化） | **运行时**级联 |
| JS 动态改 | ❌ | ✅ `setProperty` |
| 参与级联 | ❌ | ✅ 随主题/媒体变化 |
| 可当选择器名 | ✅ | ❌ |
| 动态主题 | 不适合 | **首选** |

<div v-click class="mt-3 text-sm">

> 构建期固定令牌用 `@value`；运行时可变（暗色模式、JS 驱动）一律用原生 `var()`。两者可共存。

</div>

<!--
@value 和原生 CSS 变量 var() 是高频混淆点，本质是编译期和运行时的区别。

时机上，@value 是编译期文本替换，构建后值就写死固化了；var() 是运行时级联求值。能否 JS 动态改：@value 不能，构建后写死；var() 能，用 setProperty 就行。参与 CSS 级联：@value 不参与；var() 参与，随选择器、媒体查询、主题变化。可当选择器名：@value 可以，更灵活；var() 不行，只能当属性值。动态主题切换：@value 不适合；var() 是首选。

结论：需要构建期共享的固定令牌，比如团队统一色板、断点，用 @value 顺手；需要运行时可变，比如暗色模式切换、JS 驱动的动态值，一律用原生 var()。两者可以共存，各管一摊。
-->

---

# 框架集成：Vite / Next.js

```js
// Vite —— 内建，.module.css 自动识别
// vite.config.js
css: {
  modules: {                      // 选项透传给 postcss-modules
    localsConvention: 'camelCaseOnly',
    generateScopedName: '[name]__[local]___[hash:base64:5]',
  },
}
```

```jsx
// Next.js（16.x）—— 内建，官方推荐用于组件私有样式
import styles from './blog.module.css';
export default () => <main className={styles.blog} />;
```

<div v-click class="mt-1 text-sm">

> Vite 用 Lightning CSS 时改走 `css.lightningcss.cssModules`（`css.modules` 不生效）。

</div>

<!--
框架集成，先看 Vite 和 Next.js，两者都内建、开箱即用。

Vite 内建 CSS Modules，任何 .module.css 及 .module.scss 等都自动识别。配置在 css.modules 里，这些选项会透传给 postcss-modules，所以选项语义和它一致，比如 localsConvention、generateScopedName。有一个要点：如果你改用更快的 Lightning CSS，css.modules 不生效，要改用 css.lightningcss.cssModules，而且选项集不完全相同，迁移要对照。

Next.js 当前 16.x 也内建，官方把 CSS Modules 列为组件私有样式的推荐方案。建一个 blog.module.css，直接 import styles，然后 className 等于 styles.blog 即可。Next.js 建议全局重置和 Tailwind 基础样式用全局 CSS，组件自定义样式用 CSS Modules。
-->

---

# 框架集成：webpack css-loader

```js
// css-loader → options.modules
{
  auto: true,        // 默认对 /\.module\.\w+$/i 自动启用
  mode: 'local',     // 'local'|'global'|'pure'|'icss'
  localIdentName: '[path][name]__[local]',
  namedExport: true, // 允许 import { foo } from
}
```

| `mode` | 行为 |
| --- | --- |
| `'local'`（默认） | 默认局部 |
| `'global'` | 默认全局，局部要显式 `:local()` |
| `'pure'` | 选择器须含局部 class/id，否则报错 |
| `'icss'` | 只启 `:import`/`:export` |

<!--
原生 webpack 里由 css-loader 负责，核心是 modules 选项。

看配置：auto 设 true，默认对匹配 .module 点某后缀这个正则的文件自动启用，这就是 .module.css 后缀能自动生效的底层原因。mode 是作用域模式。localIdentName 前面讲过，开发用可读格式。namedExport 设 true 允许用 import 花括号 foo from 命名导入类名。

modules 的 mode 有四种。local 是默认，默认局部作用域。global 默认全局，想局部要显式 :local。pure 要求每个选择器至少含一个局部 class 或 id，否则报错，用于强制局部纪律、禁止裸全局选择器。icss 只启用最底层的 :import 和 :export，不做完整模块化，供其他工具在其上构建。

另外 CRA 也内建 CSS Modules，文件名符合 name.module.css 约定即可，无需 eject。
-->

---

# TypeScript：默认无类型，三条路补

默认 `import styles from './x.module.css'` 是 `any`，写错类名不报错。

<v-clicks>

- **通配环境声明**（最省事）：`declare module '*.module.css'` 导出字符串字典——只保证「是字典」，不校验具体类名
- **typed-css-modules（`tcm`）**：为每个模块生成 `.module.css.d.ts` 精确声明，拼错类名 `tsc` **会报错**（要接进构建）
- **typescript-plugin-css-modules**：TS 语言服务插件，编辑器实时补全，但**编译期不报错**（`tsc` 不加载 LSP 插件）

</v-clicks>

<div v-click class="mt-2 text-sm">

> Vite 项目 `vite/client` 已内置 `CSSModuleClasses` 声明，常无需手写通配。实践常「插件补全 + tcm 校验」互补。

</div>

<!--
TypeScript 默认无类型是 CSS Modules 的一个坑。默认 import styles from x.module.css，styles 是 any 或直接报找不到模块，你写错类名 styles.tilte 也不会报错，失去类型检查和补全。

补类型有三条路，按精度和成本排列。

第一条通配环境声明，最省事：加一段 declare module 星号 module.css，导出一个字符串字典。成本最低，但只保证是字符串字典，不校验具体类名是否存在。

第二条 typed-css-modules，命令是 tcm：为每个 module.css 生成对应的 .module.css.d.ts，把实际存在的类名逐个声明成属性，这样拼错类名 tsc 编译时会直接报错。代价是要把生成步骤接进构建或 watch 流程。

第三条 typescript-plugin-css-modules，是 TS 语言服务插件，在编辑器里实时补全提示，但关键限制是 TS 编译期不加载语言服务插件，所以它无法在 tsc 编译时报错，只管编辑体验。

Vite 项目 vite/client 已经内置了 CSSModuleClasses 声明，常常无需手写通配。实践中常把插件补全和 tcm 校验两者互补使用。
-->

---

# 对照真·CSS-in-JS

同组的 StyleX / Panda / vanilla-extract 是「真·CSS-in-JS」，差异不在运行时：

| 维度 | CSS Modules | StyleX / Panda / vanilla-extract |
| --- | --- | --- |
| 样式写在 | `.css` 文件 | **JS/TS 文件**里 |
| 运行时 | 零 | **也零**（编译抽取） |
| 类型安全 | 需补 `.d.ts` | **原生** |
| 设计令牌 | `@value`（弱） | **内建系统** |
| 动态样式 | 切类/`var()` | **变体 API** |

<div v-click class="mt-3 text-sm">

> 分野是**样式写在哪 + 能力广度**，不是「有无运行时」。CSS Modules 只做作用域，那三者在作用域之上给了整套「样式系统」。

</div>

<!--
对照真 CSS-in-JS。同组的 StyleX、Panda CSS、vanilla-extract 都属于真 CSS-in-JS，但它们和 CSS Modules 的根本差异不在有没有运行时，因为大家都是零运行时。

看表格。样式写在哪：CSS Modules 写在独立的 .css 文件里，那三者写在 JS 或 TS 文件里，用对象或函数式 API。运行时：CSS Modules 零运行时，那三者也主打编译期零运行时，从 JS/TS 抽取成静态 CSS。类型安全：CSS Modules 需要额外补 .d.ts，那三者是原生类型安全，TS 直接推导样式属性。设计令牌：CSS Modules 靠 @value，比较弱，那三者内建令牌系统，比如 vanilla-extract 的 createTheme、Panda 的 tokens、StyleX 的 vars。动态样式:CSS Modules 只能切类或叠 var，那三者有条件和变体 API，按 props 组合、编译期静态化。

所以核心分野是样式写在哪加上能力广度，不是有没有运行时这一条。CSS Modules 只做作用域，那三者在作用域之上还给了你一整套样式系统能力。
-->

---

# 选型：CSS Modules / Tailwind / CSS-in-JS

| 诉求 | 选择 |
| --- | --- |
| 写标准 CSS + 作用域 + 零运行时 + 框架无关 | **CSS Modules** |
| 原子类快开发 + 设计系统约束 | **Tailwind CSS** |
| 样式与组件强绑定 + 类型安全 + 令牌 | **StyleX/Panda/vanilla-extract** |
| 极致运行时动态（可接受开销、非 RSC） | styled-components/Emotion |
| 复杂项目分层 | **Tailwind 打底 + CSS Modules 补充** |

<div v-click class="mt-3 text-sm">

> ⚠️ 别下「CSS Modules 已过时」结论——它仍是主流内建的零运行时作用域方案，三者**可组合**、非互斥。

</div>

<!--
选型决策。这张表按诉求给方案。

想写标准 CSS、要作用域、要零运行时、要框架无关，选 CSS Modules。想用原子类快速开发、要统一设计系统约束、少写自定义 CSS，选 Tailwind。想让样式和组件强绑定、要原生类型安全、要设计令牌，选 StyleX、Panda 或 vanilla-extract。想要极致的运行时动态、能接受运行时开销、又不是 React Server Components 场景，才考虑 styled-components 或 Emotion。复杂项目常分层：Tailwind 打底做布局和常规样式，CSS Modules 兜复杂的自定义样式，比如动画、精细排版、第三方对接。

一个重要提醒：别轻易下 CSS Modules 已过时的结论。它没有过时，在 Vite、Next.js、CRA 里仍然是内建的、被推荐的零运行时作用域方案。它的定位是作用域基线，不追求做完整样式系统。而且这三者可以组合、不是互斥的，一个项目完全可以同时用。
-->

---

# 易错点 Top 8

<v-clicks>

- `className="foo"` 不生效——原类名已被哈希，改 `className={styles.foo}`
- `styles.pull-quote` 报错——kebab 名 JS 点号非法，用方括号或转驼峰
- TS 里 `styles` 是 any——默认无类型，补声明 / `typed-css-modules`
- `composes` 只能组单个局部类，且须写在其他声明之前
- 跨文件 `composes` 同属性冲突 = 未定义行为
- `@value` 是编译期固化，运行时可变要用原生 `var()`
- DevTools 看到乱码类名——生产用了纯哈希，开发换可读格式
- Vite 配了 `css.modules` 没用——启用了 Lightning CSS，改 `css.lightningcss.cssModules`

</v-clicks>

<!--
过一遍最高频的坑。

第一，className 等于字面 foo 不生效，因为原类名已被哈希，要改成 className 等于 styles.foo。第二，styles.pull-quote 报错，因为 kebab 名在 JS 点号里非法，用方括号或用 localsConvention 转驼峰。第三，TS 里 styles 是 any，默认无类型，要补环境声明或用 typed-css-modules。第四，composes 只能组合单个局部类，而且必须写在规则内其他声明之前。

第五，跨文件 composes 对同一属性给不同值是未定义行为，要避免。第六，@value 是编译期固化的，运行时可变的需求要用原生 var()。第七，DevTools 里看到乱码类名，是生产环境用了纯哈希，开发环境换成可读的 path name local 格式。第八，Vite 配了 css.modules 没生效，通常是启用了 Lightning CSS，要改用 css.lightningcss.cssModules。
-->

---
layout: intro
---

# 总结

CSS Modules = **构建期把类名局部作用域化的零运行时方案**

- 定位：写标准 CSS、只做作用域的**作用域基线**，非运行时 CSS-in-JS
- 原理：编译期 `.foo` → 唯一哈希名 + 导出 `{foo: '_foo_x1y2'}` 映射
- 用法：`import styles` → `className={styles.foo}`；默认局部
- 扩展：`:global` 例外、`composes` 组合、`@value` 值变量
- 集成：Vite / Next.js / webpack / CRA 内建；TS 需补类型
- 选型：与 Tailwind / StyleX / Panda / vanilla-extract 可组合

<!--
总结一下。CSS Modules 是一种构建期把类名局部作用域化的零运行时方案。

定位：它写的是标准 CSS，只做作用域，是作用域基线，不是运行时 CSS-in-JS。原理：编译期把 .foo 改写成全局唯一哈希名，并导出一个 foo 到哈希名的映射对象供 JS 引用，底层经过 ICSS。用法：import styles 拿映射对象，className 等于 styles.foo，默认局部作用域。

扩展点有三个：:global 做全局例外，composes 做样式组合复用，@value 做编译期值变量。集成上，Vite、Next.js、webpack、CRA 都内建支持，但 TypeScript 默认无类型，需要补声明或生成 d.ts。选型上，它和 Tailwind、StyleX、Panda、vanilla-extract 是可以组合的关系，不是互斥。

CSS Modules 用最轻的心智、贴近原生 CSS 的方式，把命名冲突这件最基础的事做稳、做轻，是现代前端零运行时样式方案里的作用域底座。谢谢大家。
-->
