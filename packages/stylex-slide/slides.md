---
theme: seriph
background: https://cover.sli.dev
title: Welcome to StyleX
info: |
  Presentation StyleX —— Meta 出品的编译期原子化 CSS-in-JS。

  Learn more at [https://stylexjs.com](https://stylexjs.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎨</span>
</div>

<br/>

## StyleX —— 编译期原子化的 CSS-in-JS

Meta 出品，兼具 CSS-in-JS 人体工学与静态 CSS 性能，当前 `@stylexjs/stylex` 0.19.0

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/facebook/stylex" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 StyleX —— Meta 出品的编译期原子化 CSS-in-JS 样式系统。

一句话定位：它把「用 JavaScript 对象写样式」的人体工学，和「静态 CSS」的性能合二为一。样式写成 JS/TS 对象、就近共置在组件旁，享受类型检查；构建期由 Babel 编译器把每个属性-值对编译成单一原子类、全局去重，产出静态 CSS，运行时只剩极小的类名合并。

版本：@stylexjs/stylex 当前 0.19.0，2026 年 6 月发布。它 2023 年底开源，MIT 协议。

今天顺序：定位 → 工作原理 → 谁在用 → 安装 → create/props → 条件样式 → 合并优先级 → 变体 → 动态样式 → keyframes → 主题两页 → 类型 → 现代 API → vs Tailwind → vs 运行时/vanilla-extract/Panda → 易错点 → 生态与 Astryx → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 StyleX？

<v-clicks>

- **零运行时**：build 时出静态 CSS，运行时只合并类名，RSC 友好
- **可预测**：后应用者胜，摆脱 CSS 特异性大战
- **类型安全**：样式是真 JS 对象，可约束属性/取值
- **原子化去重**：CSS 体积随代码库增长趋于平台化

</v-clicks>

<div v-click class="mt-4">

但要认清边界：

- 必须走构建期编译，主题需开 `unstable_moduleResolution`
- AOT 约束严：`create` 内只许字面量/常量/StyleX 函数

</div>

<!--
为什么用 StyleX？四个卖点。

第一，零运行时：样式在构建期编译成静态 CSS，浏览器运行时不注入样式，只做类名合并，因此对 React Server Components 天然友好，这是它区别于 styled-components、Emotion 的根本点。

第二，可预测：合并规则是后应用者胜，只看 props 的应用顺序，与定义顺序、样式表顺序、选择器特异性都无关，彻底摆脱了 CSS 的特异性大战。

第三，类型安全：样式是真正的 JS/TS 对象，有补全、有类型检查，还能用类型约束组件能接收哪些属性甚至取值。

第四，原子化加去重：相同属性-值对只生成一个类、全应用复用，大型代码库的 CSS 体积趋于平台化。

边界也要讲清楚：它必须走构建期编译，不像运行时方案那样零配置直接跑；主题跨文件还要开 unstable_moduleResolution；而且 AOT 静态约束比较严，create 内只允许可静态分析的内容。
-->

---

# 定位：编译期 vs 运行时 CSS-in-JS

| 维度 | 运行时 CSS-in-JS | **StyleX（编译期）** |
| --- | --- | --- |
| 代表 | styled-components / Emotion | StyleX |
| 样式生成 | 浏览器运行时注入 `<style>` | 构建期出静态 CSS |
| 运行时开销 | 有（序列化 + 注入） | 极小（仅类名合并） |
| RSC / SSR | 不友好（styled 维护期） | 天然友好 |
| 产物 | 运行时注入的类 | 原子类 + 全局去重 |

<div v-click class="mt-4 text-sm">

> StyleX 是「CSS-in-JS」，但走的是编译期路线——拿到 CSS-in-JS 的人体工学，同时拿到静态 CSS 的性能。

</div>

<!--
StyleX 名字里有 CSS-in-JS，但一定要和 styled-components、Emotion 那种运行时 CSS-in-JS 区分开。

运行时方案是在浏览器里把样式序列化成 CSS 字符串、动态注入 style 标签，灵活但有运行时开销，而且对 React Server Components 不友好，styled-components 目前已经进入维护期。

StyleX 走编译期路线：构建时静态分析样式对象，生成静态 CSS，运行时只做类名合并，零注入开销，SSR 和 RSC 天然友好。

所以它的定位是：一个走编译期的 CSS-in-JS，两头好处都要——CSS-in-JS 的书写人体工学，加静态 CSS 的运行性能。
-->

---

# 工作原理：Babel 编译 + 原子化 + 去重

<v-clicks>

- **编译器**：`@stylexjs/babel-plugin`（或经 unplugin/postcss 集成）在构建期静态分析 `create`
- **原子化**：每个「属性-值对」编译成一个单一职责的原子类，如 `color: red` → 一个类
- **全局去重**：相同属性-值对全应用只生成一次、处处复用
- **替换引用**：源码里的样式引用被替换成类名字符串
- **运行时**：只剩「按 CSS 属性合并类名」的极小逻辑

</v-clicks>

<div v-click class="mt-4 text-sm">

> 为什么体积能平台化？应用越大，新样式越多命中已有原子类，CSS 增长曲线走平而非线性膨胀。

</div>

<!--
StyleX 是怎么把 JS 样式对象变成 CSS 的？核心机制五步。

第一，编译器：主力是 @stylexjs/babel-plugin，也可以经 unplugin 或 postcss 集成，在构建期静态分析 create 调用。

第二，原子化：把每个属性-值对，比如 color red，编译成一个单一职责的原子类。

第三，全局去重：相同的属性-值对在整个应用范围只生成一次，所有用到的地方复用同一个类。

第四，替换引用：源码里对样式的引用，编译后被替换成类名字符串。

第五，运行时：只剩下按 CSS 属性合并类名这一点极小的逻辑，没有任何样式生成或注入。

为什么 CSS 体积能平台化？因为应用越大，新写的样式越来越多地命中已经存在的原子类，需要新增的类越来越少，CSS 增长曲线逐渐走平，而不是随组件数量线性膨胀。这正是 Meta 支撑数十亿用户界面时最看重的特性。
-->

---

# 谁在用 + 心智模型

<div class="grid grid-cols-2 gap-8 mt-4">
<div>

**谁在用**

<v-clicks>

- Facebook / Instagram
- WhatsApp / Messenger
- Threads（Meta 全家桶）
- Figma / Snowflake（外部）

</v-clicks>

</div>
<div>

**官网五个关键词**

<v-clicks>

- 富表达力 expressive
- 类型安全 type-safe
- 可组合 composable
- 可预测 predictable
- 可主题化 themeable

</v-clicks>

</div>
</div>

<div v-click class="mt-6 text-sm">

> 2023 年底开源，MIT。它正是为「超大规模、多团队协作」的代码库打磨出来的。

</div>

<!--
谁在用 StyleX？它已经是 Meta 全家桶的标准样式系统：Facebook、Instagram、WhatsApp、Messenger、Threads 都在用，外部也有 Figma、Snowflake 这样的公司采用。

它 2023 年底开源，MIT 协议，正是为超大规模、多团队协作的代码库打磨出来的。

官网用五个关键词概括它：富表达力、类型安全、可组合、可预测、可主题化。文档里进一步概括为四大收益：可扩展、可预测、可组合、高性能。这五个词后面每一个我们都会展开讲到。
-->

---

# 安装与构建配置

```bash
# 核心运行时 / 类型
npm install @stylexjs/stylex
# 编译插件（按构建工具选）
npm i -D @stylexjs/babel-plugin      # Babel
npm i -D @stylexjs/unplugin          # Vite/webpack/rspack/esbuild
```

```js
// babel.config.js
export default {
  plugins: [['@stylexjs/babel-plugin', {
    dev: process.env.NODE_ENV === 'development',
    unstable_moduleResolution: { type: 'commonJS', rootDir: __dirname },
  }]],
};
```

<div v-click class="mt-2 text-sm">

> 官方集成覆盖 Next.js / Vite / webpack / rspack / esbuild / PostCSS / Bun / CLI；主题跨文件必须开 `unstable_moduleResolution`。

</div>

<!--
安装分两部分：核心库 @stylexjs/stylex，加一个编译插件。编译插件按你的构建工具选：Babel 用 @stylexjs/babel-plugin，Vite、webpack、rspack、esbuild 可以用通用的 @stylexjs/unplugin，PostCSS 有 @stylexjs/postcss-plugin。

配置以 Babel 为例，核心就是把 StyleX 变换加进 babel 配置，dev 选项区分开发/生产。这里要特别注意 unstable_moduleResolution 这个选项：主题 API，也就是 defineVars 和 createTheme，需要编译器跨文件解析 .stylex.js 里的变量，不开这个选项主题就不工作。

官方集成覆盖面很广：Next.js、Vite 含 React/RSC/SvelteKit 模板、webpack、rspack、esbuild、PostCSS、Bun，还有独立 CLI，本质都是把这一个 Babel 变换接进对应的构建管线。
-->

---

# 核心两步：create + props

```tsx
import * as stylex from '@stylexjs/stylex';

// 1. 定义：顶层键是命名空间，其下是属性-值对
const styles = stylex.create({
  base: { fontSize: 16, color: 'rgb(60,60,60)' },
  highlighted: { color: 'rebeccapurple' },
});

// 2. 应用：props 返回 { className, style }，展开到元素
function Text({ on }: { on: boolean }) {
  return <p {...stylex.props(styles.base, on && styles.highlighted)}>Hi</p>;
}
```

<div v-click class="mt-2 text-sm">

> `props()` 忽略 `false`/`null`/`undefined`，所以 `on && styles.x` 是最地道的条件写法。

</div>

<!--
StyleX 的用法就两步：create 定义、props 应用。

create 接收命名空间对象，base、highlighted 各是一组可独立引用的样式，属性名用驼峰式 CSS 属性。

props 接收一个或多个样式，返回一个包含 className 和按需的 style 的普通对象，用扩展语法展开到元素上就生效了。

这里有个关键写法：props 会忽略 false、null、undefined 这些假值，所以 on 逻辑与 styles.highlighted，当 on 是 false 时这一项被直接跳过，这就是 StyleX 里最地道的条件样式写法，不需要手拼类名字符串。
-->

---

# 条件样式：伪类 / 伪元素 / 媒体查询

```tsx
const styles = stylex.create({
  button: {
    // 伪类：属性内的条件值，default 是基态
    backgroundColor: { default: 'lightblue', ':hover': 'blue' },
    // 媒体查询：同样是属性级条件值
    width: { default: 800, '@media (max-width: 800px)': '100%' },
    // 伪元素：命名空间顶层键（高一层）
    '::placeholder': { color: '#999' },
  },
});
```

<div v-click class="mt-2 text-sm">

> ⚠️ 层级别混：**伪类 / 媒体查询**在属性内部，**伪元素**在命名空间顶层键。

</div>

<!--
StyleX 把状态条件收进属性内部，而不是像传统 CSS 那样另写选择器。三类条件写法要分清层级。

伪类，比如 hover、focus、active，是属性内部的条件值：把 backgroundColor 写成一个对象，default 是基态，冒号 hover 是悬停态。

媒体查询和伪类一样，也是属性级的条件值：width 的 default 是 800，命中 max-width 800 的媒体查询时变成 100%，同一属性可以叠多个断点。

伪元素，比如冒号冒号 placeholder，层级不一样，它是命名空间下的顶层键，值是一组样式。

一句话记住：伪类和媒体查询在属性内部，伪元素在命名空间顶层，别混。
-->

---

# 嵌套条件 + null 兜底

```tsx
const styles = stylex.create({
  link: {
    transform: {
      default: 'scale(1)',
      ':hover': {
        default: null,                       // 不支持 hover 时不变换
        '@media (hover: hover)': 'scale(1.1)',
      },
      ':active': 'scale(0.9)',
    },
  },
});
```

<v-clicks>

- 条件可**多层嵌套**：伪类里再嵌媒体查询
- `null` 表示该分支「不生效」的兜底，避免误伤触屏设备
- 把 `default` 设 `null` 也能在合并时**清除**某属性

</v-clicks>

<!--
条件可以多层嵌套，这一页是个经典例子：只在支持 hover 的设备上做放大变换。

transform 的 default 是 scale 1，hover 时进一步嵌套：内层 default 是 null，表示如果设备不支持 hover 就不变换，只有命中 at media hover hover 这个媒体查询时才 scale 1.1。这样就避免了在触屏设备上误触发 hover 样式。active 按下时 scale 0.9。

null 在 StyleX 里有两个用途：一是像这里做不生效分支的兜底；二是把某个属性直接设为 null，可以在合并时清除掉之前应用的这个属性，重置场景很常用。
-->

---

# props 合并：后者胜

```tsx
// 紫色：highlighted 在后
<div {...stylex.props(styles.base, styles.highlighted)} />
// 灰色：base 在后
<div {...stylex.props(styles.highlighted, styles.base)} />
```

<v-clicks>

- **只看应用顺序**：与定义顺序、样式表书写顺序、特异性都无关
- **底层机制**：合并时按 CSS 属性去重，同一属性只保留**最后一个**原子类
- **条件 + 透传**：`cond && styles.x`、外部 `style` 惯例放最后便于覆盖
- 接受数组：`props([styles.a, styles.b])` 与分开传等价

</v-clicks>

<!--
props 合并的核心规则：后应用者胜。

同样是 base 和 highlighted 两组样式，props base highlighted，highlighted 在后，冲突的 color 以它为准，是紫色；调换成 highlighted base，base 在后，就是灰色。

关键是：这只看 props 里的应用顺序，和你在 create 里谁先定义无关，也和样式表里类的书写顺序、选择器特异性都无关。

底层机制是：props 合并多组样式时，对每个 CSS 属性只保留最后一个设置它的原子类，冲突的前者类根本不会进入最终 className，所以后者胜是完全确定的。

实践中，条件应用用 cond and styles.x，组件接收的外部 style 惯例放在最后一个参数，方便覆盖本地样式。props 也接受数组，可以嵌套，和分开传参等价。
-->

---

# 变体 recipe

```tsx
const color = stylex.create({
  primary: { backgroundColor: 'blue', color: 'white' },
  secondary: { backgroundColor: 'gray', color: 'white' },
});
const size = stylex.create({
  small: { fontSize: '1rem', paddingBlock: 4 },
  medium: { fontSize: '1.2rem', paddingBlock: 8 },
});

function Button({ variant = 'primary', s = 'small', disabled }) {
  return <button {...stylex.props(
    base.button, color[variant], size[s], disabled && shared.off,
  )} />;
}
```

<div v-click class="mt-2 text-sm">

> 每个变体维度一个 `create`，按 prop 键入并组合；冲突交给 last-wins。配 `keyof typeof` 让变体名类型安全。

</div>

<!--
变体是组件库最常见的模式。做法：把每个变体维度做成一个 create，颜色一组、尺寸一组。

运行时按传进来的 prop 动态键入：color 方括号 variant、size 方括号 s，再和 base、以及 disabled 条件样式一起组合进 props。多维变体各自一个 create，组合即可，属性冲突交给 last-wins 自动解决，不需要手写复合变体的判断。

配合 TypeScript 的 keyof typeof color，可以让 variant、s 这些参数只接受合法的变体名，既声明式又类型安全。这就是 StyleX 版的 variants recipe。
-->

---

# 动态样式：函数样式

```tsx
const styles = stylex.create({
  bar: (height: number) => ({ height }),   // 函数体必须是对象字面量
});

function Bar({ height }: { height: number }) {
  return <div {...stylex.props(styles.bar(height))} />;
}
```

<v-clicks>

- 命名空间写成**返回对象字面量的函数**，应用时 `styles.bar(h)`
- 原理：编译期为该属性生成一个 **CSS 变量**，运行时经 `style` 内联赋值
- 既动态又**零运行时注入**（不每次渲染都生成新 CSS）
- ⚠️ 函数体不能有 `if`/`for`/中间变量，否则无法静态分析

</v-clicks>

<!--
样式值要依赖运行时变量，比如随 props 变化的高度、随数据变化的颜色，就用函数样式。

把命名空间写成一个函数，接收 height，返回一个对象字面量 height。应用时调用 styles.bar 传入高度。

原理很巧妙：StyleX 编译期为 height 这个属性生成一个 CSS 变量，运行时通过 props 返回的 style，把变量的值内联设置到元素上。所以它既支持动态值，又保持了零运行时注入，不会每次渲染都去生成新的 CSS 规则。

一个硬性约束：函数体必须是纯对象字面量，不能有 if、for、中间变量、异步，因为 StyleX 要在编译期静态分析出这个函数会生成哪些原子类和 CSS 变量。
-->

---

# keyframes + firstThatWorks

```tsx
// 关键帧动画
const fadeIn = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});
const styles = stylex.create({
  box: { animationName: fadeIn, animationDuration: '1s' },
  // 多值回退：浏览器取支持的第一个
  header: { position: stylex.firstThatWorks('sticky', '-webkit-sticky', 'fixed') },
});
```

<v-clicks>

- `keyframes()` 返回引用，赋给 `animationName`
- `firstThatWorks()` 绕开 JS「同键一值」限制，实现 CSS 多值降级

</v-clicks>

<!--
两个常用 API。

keyframes 定义关键帧动画：传入 from、to，或者百分比关键帧，返回一个引用，赋值给 animationName 使用，再配 animationDuration。

firstThatWorks 做多值回退：给一个属性提供多个候选值，比如 position 想用 sticky，但要兼容老浏览器的 webkit sticky，再降级到 fixed，浏览器会采用它支持的第一个。这等价于 CSS 的多值回退写法，但绕开了 JavaScript 对象同一个键只能有一个值的限制。
-->

---

# 主题①：defineVars + .stylex 文件

```tsx
// tokens.stylex.ts —— 必须专用扩展名 + 具名导出
export const colors = stylex.defineVars({
  accent: 'blue',
  primaryText: 'black',
  background: 'white',
});

// Card.tsx —— 像值一样引用
const styles = stylex.create({
  card: { color: colors.primaryText, backgroundColor: colors.background },
});
```

<v-clicks>

- `defineVars` 编译成**真正的 CSS 自定义属性**（`--xxx`），享受级联/继承
- 变量必须放 `.stylex.js`/`.ts` 且**具名导出**（编译器据此跨文件解析）
- `.stylex.js` 变量是 `create` 内**唯一允许的导入值**

</v-clicks>

<!--
主题化的起点是 defineVars。它声明一组变量，也就是设计令牌。

有两条硬性约定：第一，变量必须放在专用扩展名文件里，比如 tokens.stylex.ts；第二，必须具名导出，不能默认导出或包在中间对象里。编译器就是靠这两条在跨文件时稳定解析变量。

defineVars 编译后是真正的 CSS 自定义属性，也就是 dash dash 开头的 CSS 变量，名字由编译器自动生成且唯一，因此天然享受 CSS 的级联和继承。

在 create 里像普通值一样引用它们，比如 colors.primaryText。顺便说，从 .stylex.js 导入的变量，是 create 内部唯一被允许的导入值，正因为它们编译期可解析，这也是需要开 unstable_moduleResolution 的原因。
-->

---

# 主题②：条件值 / 派生 + createTheme

```tsx
const DARK = '@media (prefers-color-scheme: dark)';
export const colors = stylex.defineVars({
  text: { default: 'black', [DARK]: 'white' },          // 条件值：深浅模式
  muted: () => `color-mix(in srgb, ${colors.text}, transparent 50%)`, // 派生
});

// createTheme：为子树差量覆盖变量
export const dracula = stylex.createTheme(colors, { text: 'purple' });
<div {...stylex.props(dracula, styles.container)}>...</div>
```

<v-clicks>

- 变量支持**条件值**（深浅模式纯 CSS，无需 JS）与**派生**（引用同组变量）
- `createTheme` **差量覆盖**：未列出的回退默认值；作用于整棵子树；后者胜

</v-clicks>

<!--
主题的进阶能力两个。

第一，变量本身能带条件值和派生。条件值：把 text 写成 default black、dark 模式 white，深浅模式切换纯靠 CSS 媒体查询，完全不需要 JS 参与，也不用切 className。派生：值写成函数，编译期求值并引用同组其它变量，比如 muted 用 color-mix 基于 text 算出半透明色，编译器还会检测循环引用。

第二，createTheme 为某个子树换主题。它针对一个变量组，差量覆盖其中部分变量，比如 dracula 只改 text 为 purple，再用 props 把主题对象铺到子树根元素，这棵子树内引用这些变量的地方都改用新值。

三条规则：未覆盖的变量回退到 defineVars 的默认值；效果作用于整棵子树，靠 CSS 变量级联；同一变量组多个主题作用同一元素时，后者胜。整个主题切换是零运行时的纯 CSS 变量切换。
-->

---

# 类型安全：约束能收哪些样式

```tsx
import type { StyleXStyles, StaticStyles, StyleXStylesWithout } from '@stylexjs/stylex';

type A = { style?: StyleXStyles };                               // 收任意样式
type B = { style?: StyleXStyles<{ color?: string }> };           // 白名单
type C = { style?: StyleXStyles<{ marginTop: 0 | 4 | 8 }> };     // 值约束
type D = { style?: StyleXStylesWithout<{ position: unknown }> }; // 黑名单
type E = { style?: StaticStyles };                               // 拒动态样式
```

<div v-click class="mt-2 text-sm">

> ⚠️ TS 结构性子类型：白名单对「多出的属性」不总报错，Flow 更严——类型约束不是 100% 铁壁，需 lint/review 兜底。

</div>

<!--
StyleX 是 TypeScript、Flow 的一等公民，能用类型约束组件能接收哪些样式。

StyleXStyles 不带参数，接收任意 StyleX 样式，是组件 style prop 最常用的类型。

给它传类型参数就成了属性白名单，比如只接受 color；还能进一步做值约束，比如 marginTop 只能是 0、4、8 这几个值。

StyleXStylesWithout 是黑名单，禁掉列出的属性、放行其余，比如不许外部改 position 这类布局属性。

StaticStyles 只接受编译期常量样式，会拒绝动态的函数样式。

但有个现实边界一定要知道：因为 TypeScript 的结构性子类型，对象类型对多出的属性不总是报错，即便用了白名单，边缘情况下仍可能传进未列出的属性而不报错。StyleX 已经做了缓解但无法根除，Flow 在这点上更严格。所以类型约束不是百分百铁壁，团队里还要靠 eslint 和 code review 兜底。
-->

---

# 现代 API：when / positionTry / atoms

<v-clicks>

- **`when.*`**：按 DOM 关系条件化样式——`ancestor`/`descendant`/`anySibling`/`siblingBefore`/`siblingAfter`，配 `defaultMarker()`；不支持媒体/容器查询
- **`positionTry()`**：CSS 锚点定位（anchor positioning）候选回退位置
- **`viewTransitionClass()`**：生成 View Transitions API 过渡类
- **`@stylexjs/atoms`**：免 `create` 的预生成原子工具，类型安全的「Tailwind 风格」出口

</v-clicks>

```tsx
transform: { default: 'translateX(0)',
  [stylex.when.ancestor(':hover')]: 'translateX(10px)' }
```

<!--
StyleX 还有一批较新的、面向前沿 CSS 的 API。

when 系列：让一个元素根据其它元素，祖先、兄弟、后代的状态改变自身样式。五个方位：ancestor、descendant、anySibling、siblingBefore、siblingAfter，配合 defaultMarker 标记被观察的元素。它接受伪类和属性选择器，但注意不支持媒体查询和容器查询。下面代码就是父元素 hover 时子元素平移的例子，过去这要手写额外类名，现在编译成纯 CSS 关系选择器。

positionTry 对应 CSS 锚点定位，为浮层声明多个候选摆放位置，浏览器按空间自动挑一个可行的。

viewTransitionClass 生成用于视图过渡 API 的类，把页面元素切换动画接入 StyleX。

@stylexjs/atoms 提供免 create 的预生成原子工具，比如 x.display.flex，思路接近 Tailwind 工具类，但仍是类型安全的 JS，适合一次性微调。

这些 API 印证了 StyleX 的思路：不发明新方言，而是把标准 CSS 的新能力用类型安全的 JS 包装起来。
-->

---

# vs Tailwind：原子类殊途同归

| 维度 | **StyleX** | Tailwind CSS |
| --- | --- | --- |
| 授权 | 类型安全的 JS 对象 | 标签里的工具类字符串 |
| 类型安全 | 强（属性/取值可约束） | 弱（靠 IntelliSense） |
| 冲突解决 | `last-wins` + 编译器去重 | 源码顺序 / `tailwind-merge` |
| 主题 | `defineVars`/`createTheme` | 配置 + CSS 变量 |
| 心智 | 样式即数据，可组合/透传 | 标签即样式，零抽象 |

<div v-click class="mt-3 text-sm">

> 两者产物都是原子 CSS。要类型约束 + 编译去重 + 可组合 → StyleX；要标签即样式、上手快 → Tailwind。

</div>

<!--
StyleX 和 Tailwind 最终都产出原子化 CSS，但授权样式的方式南辕北辙。

Tailwind 是在标签里堆工具类字符串，上手快、标签即样式；类型安全弱，只有 IntelliSense 提示不是真类型；冲突要靠源码顺序或 tailwind-merge 处理；任意值用方括号转义。

StyleX 是用类型安全的 JS 对象授权，属性名和取值都能约束；冲突走 last-wins 确定性合并加编译器去重；主题用 defineVars 和 createTheme；心智是样式即数据，可以组合、透传。

Meta 的工程博客正是从大规模可维护性的角度对比二者。两者不是对错，是取舍：想要类型约束、编译去重、可组合，选 StyleX；想要标签即样式、零抽象、上手快，选 Tailwind。
-->

---

# vs 运行时 / vanilla-extract / Panda

| 方案 | 时机 | 默认产物 | 特点 |
| --- | --- | --- | --- |
| **StyleX** | 编译期 | 原子类 + 去重 | 类型安全 + 强约束 + Meta 生态 |
| styled/Emotion | **运行时** | 注入类 | 极致运行时灵活，RSC 不友好 |
| vanilla-extract | 编译期 | 语义作用域类 | TS-first，原子化靠 Sprinkles |
| Panda CSS | 编译期 | 原子类 | 配置驱动令牌/recipe + 代码生成 |
| CSS Modules | 编译期 | 语义作用域类 | 零运行时作用域基线，无类型 |

<div v-click class="mt-2 text-sm">

> 邻叶都零运行时；差异在**默认产物**（原子 vs 语义类）与**授权风格**（共置对象 vs 配置驱动）。

</div>

<!--
再和其它主流方案对比。

运行时 CSS-in-JS，styled-components、Emotion：在浏览器注入样式，极致运行时灵活，但有运行时开销、对 RSC 不友好，styled 已进维护期。StyleX 反其道，零运行时、RSC 友好，动态需求用函数样式以 CSS 变量承接。

vanilla-extract：同样零运行时、TypeScript-first，但默认生成作用域语义类，一块样式一个哈希类，类似 CSS Modules，原子化要靠它的 Sprinkles 插件；StyleX 默认就是原子类加去重。

Panda CSS：也是构建期原子化，但更偏配置驱动，集中定义令牌、用 cva recipe、加代码生成，框架 preset 丰富；StyleX 更偏组件旁写对象加 AOT 强约束，配置更薄。

CSS Modules：零运行时的作用域基线，写标准 CSS、局部类名，但没有类型安全、没有原子化、没有主题 API。

选型直觉：要原子加类型加强约束加 Meta 生态选 StyleX；要保留写 CSS 直觉加类型选 vanilla-extract；要配置驱动的设计系统选 Panda；只要作用域基线选 CSS Modules。
-->

---

# 易错点 + AOT 约束

<v-clicks>

- **忘开 `unstable_moduleResolution`**：`defineVars`/`createTheme` 跨文件解析失败
- **变量放错文件/默认导出**：必须 `.stylex.js` + 具名导出
- **`create` 里写函数调用/对象展开**：违反 AOT，只许字面量/常量/StyleX 函数（+ `.stylex.js` 变量）
- **动态样式函数体带逻辑**：必须是纯对象字面量
- **以为定义顺序决定优先级**：只有 `props()` 应用顺序决胜
- **伪类/伪元素层级混淆**：伪类在属性内、伪元素在命名空间顶层
- **`when.*` 里塞媒体查询**：它只管 DOM 关系状态

</v-clicks>

<!--
过一遍最高频的坑，很多都和 AOT 约束有关。

第一，忘开 unstable_moduleResolution，defineVars、createTheme 跨文件解析失败、主题不生效。

第二，变量放错文件或用了默认导出，必须放 .stylex.js 且具名导出。

第三，在 create 里写函数调用或对象展开，违反 AOT 约束。StyleX 要在构建期把样式静态编译成原子类，所以 create 内只允许对象、字符串、数字、数组字面量、null、常量和简单表达式、StyleX 自家函数，唯一的导入例外是 .stylex.js 里的变量。

第四，动态样式的函数体带了 if、for 或中间变量，必须是纯对象字面量。

第五，以为在 create 里先定义就优先级高，其实只有 props 的应用顺序决胜，后者胜。

第六，伪类和伪元素层级混淆，伪类在属性内条件值，伪元素在命名空间顶层键。

第七，往 when 里塞媒体查询，when 只管 DOM 关系状态。

这套 AOT 约束换来的正是零运行时，理解了这一点，大部分坑就自然规避了。
-->

---

# 生态与 Astryx

<v-clicks>

- **`@stylexjs/babel-plugin` / unplugin / postcss-plugin**：接入各构建管线的核心变换
- **`@stylexjs/eslint-plugin`**：校验 AOT 约束、排序属性、自动修复——团队护栏
- **`@stylexjs/atoms`**：免 `create` 的预生成原子工具
- **Astryx**：Meta 基于 StyleX 打造的 **React 设计系统**（MIT，150+ 组件，带 CLI + MCP、面向 AI agent 可读）——「StyleX 授权样式」的落地样板

</v-clicks>

<div v-click class="mt-4 text-sm">

> Astryx 是本站「组件库」章独立叶，展示了 StyleX 在真实设计系统上的样貌。

</div>

<!--
StyleX 的生态。

编译插件三件套：babel-plugin、unplugin、postcss-plugin，是接入各构建管线的核心变换。

eslint-plugin 很重要：它校验 AOT 约束、给属性排序、自动修复不合法写法，是保证团队产出可编译的关键护栏，强烈建议配上。

atoms 前面讲过，是免 create 的预生成原子工具。

最后重点提一下 Astryx：这是 Meta 基于 StyleX 打造的 React 设计系统，MIT 协议，150 多个组件，还自带 CLI 和 MCP，面向 AI agent 可读。它是 StyleX 授权样式在真实设计系统上的落地样板。Astryx 在本站组件库章有独立一叶，感兴趣可以去看，它展示了用 StyleX 建设计系统是什么样子。
-->

---
layout: intro
---

# 总结

StyleX = **Meta 出品的编译期原子化 CSS-in-JS**

- 编译期：Babel 编译成静态原子 CSS，零运行时、RSC 友好、体积平台化
- 两步：`create` 定义 → `props` 应用（返回 `className`/`style`，框架无关）
- 优先级：后应用者胜，可预测；条件样式靠忽略 falsy
- 主题：`defineVars`（CSS 变量 + 条件值 + 派生）+ `createTheme` 子树覆盖
- 类型：`StyleXStyles`/`StaticStyles`/`Without` 约束属性与取值
- 0.19.0：FB/IG/WhatsApp/Threads + Figma/Snowflake 的标准样式系统

<!--
总结一下。StyleX 是 Meta 出品的编译期原子化 CSS-in-JS 样式系统。

核心心智：它走编译期路线，Babel 把 JS 样式对象编译成静态原子 CSS，零运行时、RSC 友好、CSS 体积随代码库增长趋于平台化。

用法就两步：create 定义、props 应用，props 返回中立的 className 和 style，所以框架无关，React、Preact、Solid、lit-html、Angular 都能用。

优先级是后应用者胜，完全可预测，摆脱了 CSS 特异性大战；条件样式靠 props 忽略 falsy 值实现。

主题体系完整：defineVars 生成 CSS 变量、支持条件值和派生，createTheme 为子树差量覆盖，全程零运行时。

类型安全：StyleXStyles、StaticStyles、StyleXStylesWithout 能约束组件接收哪些属性甚至取值。

2026 年现状：0.19.0，已是 Facebook、Instagram、WhatsApp、Threads 加 Figma、Snowflake 的标准样式系统。它代表了 CSS-in-JS 从运行时走向编译期、原子化、类型安全的方向。谢谢大家。
-->
