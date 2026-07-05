---
theme: seriph
background: https://cover.sli.dev
title: Tailwind CSS 工具类优先的 CSS 框架
info: |
  Presentation Tailwind CSS —— 工具类优先的 CSS 框架，v4 + Oxide 引擎。

  Learn more at [https://tailwindcss.com](https://tailwindcss.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎨</span>
</div>

<br/>

## Tailwind CSS —— 工具类优先的 CSS 框架

在标签上「拼」样式，状态/响应式/深色全靠变体前缀，当前 v4.3（Oxide 引擎）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/tailwindlabs/tailwindcss" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Tailwind CSS —— 工具类优先（utility-first）的 CSS 框架。它不给成品组件，而是给成百上千个单一职责的原子类，让你直接在 HTML 的 class 上把样式拼出来。

版本背景：当前主线 v4，npm 实测 4.3.2，MIT 协议。v4.0 于 2025 年 1 月发布，是相对 v3 的架构级升级——全新 Oxide 引擎、CSS-first 配置。

今天的顺序：定位 → v4 与 Oxide → 工具类优先范式 → 为什么不用行内样式 → 安装 → CSS-first 配置 @theme → 令牌即变量 → 响应式 → 容器查询 → 状态变体 → group/peer → has/not/aria/data → 任意值 → 深色模式 → 颜色系统 → 自定义 @utility → @apply → v3→v4 迁移 → 生态与选型 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 Tailwind？

工具类优先，样式与结构同处一地：

<v-clicks>

- **快**：不用起类名、不用切换 HTML/CSS 文件
- **约束即设计系统**：`bg-blue-500` 而非 magic number
- **变体覆盖广**：hover/focus/响应式/深色全能表达
- **CSS 不膨胀**：工具类高度复用，体积趋稳

</v-clicks>

<div v-click class="mt-6">

但要认清边界：

- HTML 会变长，需编辑器插件 + 组件抽象缓解
- 它不是组件库，成品组件靠 shadcn/Headless 等上层方案

</div>

<!--
为什么用 Tailwind？核心是工具类优先带来的四点收益。

第一，开发速度快，不用为每个元素苦想语义化类名，也不用在 HTML 和 CSS 文件间来回跳。第二，工具类背后是一套设计令牌，天然避免随手写的 magic number，bg-blue-500 比 #3b82f6 更一致好维护。第三，变体体系让 hover、focus、响应式断点、深色模式全都能表达，这是行内 style 做不到的。第四，工具类高度复用，项目越大新增的类越少，CSS 体积趋于稳定而非线性膨胀。

但要认清边界：HTML 上堆十几个类是常态，初见者觉得脏，需要编辑器智能提示、类名排序插件加组件抽象来缓解；而且它只给样式底座，不是组件库，成品交互组件要靠 shadcn/ui、Headless UI 这类上层生态。
-->

---

# v4 是什么：Oxide 引擎 + CSS-first

当前主线 **v4**（npm 实测 `4.3.2`，MIT），v4.0 于 2025-01 发布，两大架构级变化：

| 维度 | v3 | v4 |
| --- | --- | --- |
| 引擎 | PostCSS 插件 + JIT | **Oxide**：Rust 热点 + 内建 Lightning CSS |
| 引入 | 三条 `@tailwind …` | 一行 `@import "tailwindcss";` |
| 配置 | `tailwind.config.js` | **CSS-first** `@theme`（默认无配置文件） |

<div v-click class="mt-4 text-sm">

> Oxide：把最昂贵、可并行的部分迁到 **Rust**，核心留 **TypeScript** 可扩展；唯一依赖是 Rust 写的 **Lightning CSS**。全量构建约快 3.5×，增量最高百倍量级。

</div>

<!--
v4 是什么？当前主线，npm 实测 4.3.2，MIT 协议，2025 年 1 月发布 v4.0。相对 v3 有两大架构级变化。

第一是引擎：v3 是 PostCSS 插件加 JIT，v4 换成了全新的 Oxide 引擎。官方把框架里最昂贵、可并行的部分迁移到 Rust，同时核心保留 TypeScript 方便社区扩展；新引擎唯一的依赖就是同样用 Rust 写的 Lightning CSS，它负责解析、嵌套、供应商前缀、现代语法转换，所以 v4 内建了这些能力，不再需要单独配 postcss-import 和 autoprefixer。官方基准是全量构建约快 3.5 倍，增量在没有新类时能快到百倍量级。

第二是配置：v3 的三条 @tailwind base/components/utilities 指令，v4 简化成一行 @import "tailwindcss"；配置从 JS 文件搬进 CSS，用 @theme 完成，默认不再需要 tailwind.config.js。
-->

---

# 工具类优先：把样式「拼」出来

每个类只做一件事，组合成完整样式：

```html
<div class="mx-auto flex max-w-sm items-center gap-4 rounded-xl bg-white p-6 shadow-lg">
  <img class="size-12 shrink-0" src="/logo.svg" />
  <div>
    <div class="text-xl font-medium text-black">ChitChat</div>
    <p class="text-gray-500">You have a new message!</p>
  </div>
</div>
```

<div v-click class="mt-3 text-sm">

> `flex` 弹性布局 · `items-center` 交叉轴居中 · `gap-4` 子项间距 · `p-6` 内边距 · `rounded-xl` 圆角 · `shadow-lg` 阴影。读类名即还原样式，改动只影响此元素。

</div>

<!--
工具类优先的核心就在这一屏。看这个卡片，class 里堆了一串类，但每个类都是单一职责的。

mx-auto 水平居中，flex 开弹性布局，max-w-sm 限制最大宽度，items-center 交叉轴居中，gap-4 设子项间距，rounded-xl 大圆角，bg-white 白底，p-6 内边距，shadow-lg 阴影，size-12 设宽高，shrink-0 禁止收缩。

好处是：读类名就能还原出样式，不需要跳到 CSS 文件查规则；改样式就是在这里加减类，只影响当前元素，不会牵连别处；复制这一整块到另一个项目就能直接用，因为结构和样式绑在一起。这就是 utility-first 的价值。
-->

---

# 为什么不直接写行内 style？

行内 `style` 有三道天花板，工具类都能跨过：

| 能力 | 行内 `style` | Tailwind |
| --- | --- | --- |
| 伪类状态 hover/focus/active | ❌ | ✅ `hover:` `focus:` |
| 媒体查询 / 响应式 | ❌ | ✅ `sm:` `md:` |
| 深色模式 | ❌ | ✅ `dark:` |
| 设计系统约束 | ❌ magic number | ✅ 令牌化 |

<div v-click class="mt-4 text-sm">

> 行内 style 仍有位置：值来自**运行时数据**（用户自选色、进度百分比）时，用 `style` 或 CSS 变量 `style="--bg:…"` 配 `bg-(--bg)`。

</div>

<!--
初学者最常问：为什么不直接写行内 style？因为行内样式有三道天花板。

第一，它无法表达伪类状态，hover、focus、active 都写不了。第二，它无法写媒体查询，做不了响应式。第三，它无法跟随深色模式切换。而且行内样式往往是随手写的 magic number，脱离设计系统。工具类通过 hover:、md:、dark: 这些变体前缀，把这三样能力全带了进来，同时约束在令牌范围内。

但要补一句：行内 style 并非一无是处。当值来自运行时数据，比如用户自选的主题色、后端返回的进度百分比，这些是构建期确定不了的，用行内 style 或者 CSS 变量配合 bg-(--bg) 这种写法仍然是合适的。工具类是构建期的类，表达不了纯运行时的动态值。
-->

---

# 安装：v4 + Vite 三步（首选）

```bash
npm install tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [tailwindcss()] })
```

```css
/* src/style.css —— 一行引入，取代 v3 三条 @tailwind */
@import "tailwindcss";
```

<div v-click class="mt-2 text-sm">

> 其它：PostCSS 用 `@tailwindcss/postcss`，无构建用 `@tailwindcss/cli`。v4 **默认无需 config 文件**，自动探测模板（尊重 `.gitignore`），补路径用 `@source`。

</div>

<!--
安装以 Vite 为例，v4 提供了一等公民插件，三步搞定。

第一步，装两个包：tailwindcss 和 @tailwindcss/vite。第二步，在 vite.config 的 plugins 里加上 tailwindcss()。第三步，在 CSS 入口写一行 @import "tailwindcss"，这一行取代了 v3 的三条 @tailwind 指令。

其它环境：走 PostCSS 的项目比如 Next 用 @tailwindcss/postcss；没有打包器就用 @tailwindcss/cli 命令行产出 CSS。一个关键差异：v3 需要 tailwindcss init 生成配置文件并写 content 数组，v4 默认不需要配置文件，也不用手配 content，它会自动探测模板文件、尊重 gitignore、跳过二进制；范围外的目录用 @source 补扫描路径。
-->

---

# CSS-first 配置：@theme（重点）

配置搬进 CSS，用令牌命名空间声明设计系统：

```css
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(0.62 0.19 260);
  --font-display: "Satoshi", sans-serif;
  --breakpoint-3xl: 120rem;
}
```

<div v-click class="mt-3 text-sm">

> 命名空间决定生成什么：`--color-*`→`bg-*`/`text-*`；`--font-*`→字体族；`--breakpoint-*`→`sm:`/`3xl:`。扩展=直接加；覆盖=同名；清空=`--color-*: initial`。

</div>

<!--
v4 最核心的变化就是 CSS-first 配置。v3 的心智是 JS 配置文件加三条指令，v4 统一进 CSS，用 @theme 块声明设计令牌。

看这个例子：@theme 里声明 --color-brand-500、--font-display、--breakpoint-3xl。这些变量的命名空间决定了它们生成什么工具类：--color- 开头的会生成 bg-、text-、border- 等颜色工具类；--font- 生成字体族工具类；--breakpoint- 生成响应式断点前缀，比如这里的 3xl:。

管理方式很直观：直接写新变量就是扩展；写同名变量就是覆盖默认；想清空整套默认调色板用 --color-*: initial；想连间距字体一起清做完全自定义用 --*: initial。这套配置和样式同处一个 CSS 文件，少了一层 JS 构建耦合。
-->

---

# 令牌即 CSS 变量：一条声明，两种产物

```css
@theme {
  --color-mint-500: oklch(0.72 0.11 178);
}
```

<v-clicks>

- ① 生成工具类：`bg-mint-500` `text-mint-500` `fill-mint-500`
- ② 同时以真实 CSS 变量输出到 `:root`：`var(--color-mint-500)`
- 可参与 `calc()`：`rounded-[calc(var(--radius-xl)-1px)]`（同心圆角随主题联动）

</v-clicks>

<div v-click class="mt-3 text-sm">

> 这是 v4「设计令牌即 CSS 变量」的核心——令牌可被浏览器直接理解、被 DevTools 调试。`theme()` 函数因此**已弃用**，改用 `var(--…)`。

</div>

<!--
v4 的令牌有个关键特性：双重身份，一条声明产出两种东西。

写 --color-mint-500，第一，它生成了一整套工具类，bg-mint-500、text-mint-500、fill-mint-500 等等；第二，它同时作为真实的 CSS 变量输出到 :root，你可以在任意值或普通 CSS 里用 var(--color-mint-500) 引用。

因为令牌就是 CSS 变量，它能参与 calc 运算。比如做同心圆角，内层要比外层精确小 1px，写 rounded-[calc(var(--radius-xl)-1px)]，而且会随主题联动。

这就是 v4 设计令牌即 CSS 变量的核心思想：令牌能被浏览器直接理解、被 DevTools 调试。正因如此，v3 那个 theme() 函数在 v4 被视为遗留、弃用了，官方推荐直接用 var(--...)。
-->

---

# 响应式：移动优先与断点

**无前缀 = 所有尺寸；带前缀 = 该断点及以上**。默认断点：

| `sm` | `md` | `lg` | `xl` | `2xl` |
| --- | --- | --- | --- | --- |
| 640px | 768px | 1024px | 1280px | 1536px |

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">…</div>
```

<div v-click class="mt-3 text-sm">

> ⚠️ `sm:` 不是「仅手机」，而是「≥640px」——头号翻车点。想只作用小屏用 `max-sm:`（「以下」）；区间用 `md:max-lg:`；一次性用 `min-[600px]:`。

</div>

<!--
响应式，Tailwind 是移动优先的：无前缀的类对所有尺寸生效，带断点前缀的只在该断点及以上生效。默认五个断点，sm 640、md 768、lg 1024、xl 1280、2xl 1536 像素，对应 40 48 64 80 96 rem。

看例子：grid-cols-1 是手机默认一列，sm:grid-cols-2 是 640 以上两列，lg:grid-cols-4 是 1024 以上四列。

这里有个头号翻车点必须强调：sm: 不是针对手机、不是只在小屏生效，它是 640 像素及以上。想让默认含手机就生效、大屏再改，要把无前缀类当默认。想只作用于小屏，用 max-sm: 这个以下方向的变体；想锁定某个区间，把两者堆叠比如 md:max-lg:；想要一次性的断点，用方括号 min-[600px]:。
-->

---

# 容器查询：按容器宽度（v4 内建）

不再需要插件，父级 `@container`，子级按**容器宽度**响应：

```html
<div class="@container">
  <div class="flex flex-col @md:flex-row">…</div>
</div>
```

<v-clicks>

- `@sm:`/`@lg:` 容器≥该尺寸；`@max-md:` 容器<该尺寸
- 具名容器：`@container/main` + `@sm/main:`
- 一次性：`@min-[475px]:`；单位 `w-[50cqw]`

</v-clicks>

<div v-click class="mt-2 text-sm">

> `md:` 看**视口**、`@md:` 看**最近的 @container 父级**。做「放哪都自适应」的可复用组件时优先容器查询。

</div>

<!--
容器查询在 v4 内建进了核心，不再需要 v3 那个 @tailwindcss/container-queries 插件。

用法：父级加 @container，子级用 @md: 这种前缀，它根据父容器的宽度而不是视口宽度来响应。看例子，容器窄时纵向排列，容器达到 md 宽度时横向排列。

要点：@sm:、@lg: 是容器大于等于该尺寸，@max-md: 是容器小于该尺寸；多层嵌套可以用具名容器 @container/main 加 @sm/main: 精确指向；一次性用 @min-[475px]:；还能用容器查询长度单位 cqw，w-[50cqw] 就是容器宽度的一半。

一句话区分：md: 看的是浏览器视口宽度，@md: 看的是最近的 @container 父级宽度。做那种放到任何宽度槽位都要自适应的可复用组件时，优先用容器查询。
-->

---

# 状态变体：条件前缀

`前缀:工具类`，把样式限定在某状态下生效：

```html
<button class="bg-violet-500 hover:bg-violet-600
               focus-visible:ring-2 active:bg-violet-700 disabled:opacity-50">
  Save
</button>
```

<v-clicks>

- 交互：`hover` `focus` `focus-visible` `focus-within` `active` `visited`
- 表单：`checked` `disabled` `required` `valid`/`invalid` `placeholder-shown`
- ⚠️ v4 `hover` 默认受 `@media (hover: hover)` 约束，纯触屏不触发

</v-clicks>

<!--
状态变体，写法是前缀冒号加工具类，把样式限定在某个状态下生效。

看按钮例子：hover:bg-violet-600 悬停变色，focus-visible:ring-2 键盘聚焦时出现焦点环，active:bg-violet-700 按下变色，disabled:opacity-50 禁用时变淡。

交互态有 hover、focus、focus-visible、focus-within、active、visited。focus 和 focus-visible 的区别：focus 只要获焦就生效，focus-visible 通常只在键盘导航时生效，给按钮加焦点环用 focus-visible 体验更好，鼠标点击不会出现难看的框。表单态很齐全，checked、disabled、required、valid、invalid、placeholder-shown 等，配合原生校验能做无 JS 的即时反馈。

一个 v4 变化：hover 默认包在 @media (hover: hover) 里，只在支持真正悬停的设备生效，纯触屏不会点一下就卡在悬停态。从 v3 迁移如果依赖触屏触发 hover，要留意这点。
-->

---

# group 与 peer：父子与兄弟联动

```html
<!-- group：父加 group，子随父状态变 -->
<a class="group rounded-lg p-8 hover:bg-sky-500">
  <h3 class="text-gray-900 group-hover:text-white">New project</h3>
</a>

<!-- peer：标记 peer，其后兄弟随它状态变 -->
<input class="peer" required />
<p class="invisible peer-invalid:visible">请输入有效值</p>
```

<div v-click class="mt-2 text-sm">

> 具名 `group/item`+`group-hover/item:` 区分嵌套；`in-*` 免 group。⚠️ `peer-*` 受 CSS 组合器限制，**只能作用于 peer 之后的兄弟**。

</div>

<!--
group 和 peer 是两种联动机制。

group 是父子联动：父元素标记 group 类，子元素用 group-hover、group-focus 响应父级状态。最经典的场景是悬停整张卡片，内部的标题、图标一起变色，看例子，鼠标悬停这个链接卡片，里面的 h3 用 group-hover:text-white 变白。

peer 是兄弟联动：标记 peer 的元素，让它后面的兄弟根据它的状态变化。看表单校验例子，input 标记 peer，后面的提示 p 用 peer-invalid:visible，校验不通过时才显示。

补充两点：嵌套时用具名 group/item 加 group-hover/item: 区分层级，避免相互干扰；不想加 group 可以用 in-* 直接响应任意可聚焦祖先。还有一个关键限制：peer-* 受 CSS 相邻和通用兄弟组合器限制，只能作用于 peer 之后的兄弟，所以目标元素必须排在 peer 后面。
-->

---

# has / not / aria / data：关系与属性

```html
<!-- has-*：父随后代变（CSS :has()），无 JS 联动 -->
<label class="ring has-[:checked]:bg-indigo-50 has-[:checked]:ring-indigo-500">
  <input type="radio" /> Google Pay
</label>

<!-- not-*（v4 新增取反）/ data-* / aria-* -->
<button class="hover:not-focus:bg-indigo-700">…</button>
<div data-state="open" class="opacity-0 data-[state=open]:opacity-100">…</div>
```

<div v-click class="mt-2 text-sm">

> `has-*` 让父随后代高亮；`not-*` 对伪类/媒体取反；`aria-*`/`data-*` 跟随属性状态，天然配合 Headless UI / Radix 的 `data-state`。

</div>

<!--
这一屏讲四个高阶变体：has、not、aria、data。

has-* 对应 CSS 的 :has() 关系伪类，让元素根据是否包含匹配的后代来应用样式，这是无 JS 联动的利器。看例子，容器里的 radio 被选中时，用 has-[:checked]: 让整个 label 高亮加环。

not-* 是 v4 新增的取反变体，对伪类、媒体查询、@supports 取反，hover:not-focus: 表示悬停但未聚焦时。

aria-* 和 data-* 跟随元素的属性状态。data-[state=open]: 会在 data-state 等于 open 时生效。这两个变体特别适合配合 Headless UI、Radix 这类库，它们会在元素上写 data-state="open" 这样的属性，你用 data-[state=open]: 直接据此设样式，样式和交互状态天然同步。
-->

---

# 任意值 [...]：主题的逃生舱

主题外的确切值免改配置直接用：

```html
<button class="bg-[#316ff6]">Sign in</button>
<div class="grid grid-cols-[24rem_2.5rem_minmax(0,1fr)]">…</div>
<div class="[mask-type:luminance]">…</div>            <!-- 任意属性 -->
<div class="[&>[data-active]+span]:text-blue-600">…</div> <!-- 任意变体 -->
<div class="bg-(--brand)">…</div>                     <!-- v4 引用变量 -->
```

<div v-click class="mt-2 text-sm">

> 值里空格用 `_`。方括号 `[...]`=字面任意值；圆括号 `(...)`=引用 CSS 变量（v4 改动，v3 是 `bg-[--brand]`）。

</div>

<!--
任意值是主题的逃生舱，设计系统覆盖不到的确切值，用方括号语法临时插入，无需改配置。

第一行 bg-[#316ff6] 是任意颜色；第二行是任意栅格模板；第三行 [mask-type:luminance] 是任意属性，直接写属性冒号值，生成没有对应工具类的 CSS；第四行是任意变体，用 & 代表当前元素写任意选择器；第五行 bg-(--brand) 是 v4 引用 CSS 变量的写法。

两个细节：任意值里不能直接含空格，要用下划线代替。方括号和圆括号分工不同：方括号是字面任意值比如 bg-[#316ff6]，圆括号专门用于引用 CSS 变量比如 bg-(--brand)。这是 v4 的一个改动，v3 里引用变量写的是方括号 bg-[--brand]，迁移时要注意。
-->

---

# 深色模式：默认跟随系统 + 手动切换

```html
<div class="bg-white text-black dark:bg-gray-800 dark:text-white">…</div>
```

默认 `dark:` 基于 `prefers-color-scheme`。要手动切换，用 `@custom-variant` 重定义：

```css
/* class 策略（取代 v3 darkMode: 'class'） */
@custom-variant dark (&:where(.dark, .dark *));
/* data 策略 */
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

<div v-click class="mt-2 text-sm">

> JS 切换：`documentElement.classList.toggle('dark')`；判定脚本放 `<head>` 尽早执行，避免首屏闪烁。

</div>

<!--
深色模式。写法约定是无前缀为浅色默认，dark: 覆盖为深色，看例子 bg-white 配 dark:bg-gray-800。

默认情况下 dark: 基于 CSS 的 prefers-color-scheme，跟随系统明暗偏好，什么都不用配。但产品常需要让用户手动切换，这时用 @custom-variant 重定义 dark 变体，取代 v3 的 darkMode: 'class' 配置。可以用 class 策略，基于 .dark 类；也可以用 data 策略，基于 data-theme 属性，更贴合多主题体系。

落地时用 JS toggle documentElement 的 dark 类，配合 localStorage 记住选择。一个关键细节：判定脚本要放在 head 里、body 渲染前同步执行，否则会先闪一下浅色再变深，这是消除深色模式首屏闪烁的通用做法。
-->

---

# 颜色系统：OKLCH 广色域

<v-clicks>

- v4 默认调色板改用 **OKLCH**（P3 广色域），更鲜艳、感知更均匀
- **22 家族**：slate/gray/zinc/neutral/stone + red…rose（17 彩色）+ 黑白
- 每家族 **11 档**：`50 100 … 900 950`，500 常作基准
- 透明度修饰符 `bg-sky-500/50`（底层 `color-mix()`）

</v-clicks>

```html
<div class="bg-sky-500/50 text-black/70 border-brand-500">…</div>
```

<div v-click class="text-sm">

> 颜色能用于 `bg-`/`text-`/`border-`/`ring-`/`fill-`/`from-` 等；⚠️ v4 裸 `border`/`ring` 默认色由 `gray-200` 改为 `currentColor`。

</div>

<!--
颜色系统。v4 把默认调色板从 v3 的 rgb 升级为 OKLCH，面向 P3 广色域，在支持的屏幕上更鲜艳，而且 OKLCH 相比 HSL 感知更均匀，便于程序化调色。

调色板有 22 个颜色家族：5 组灰 slate、gray、zinc、neutral、stone，加 17 组彩色 red 到 rose，再加黑白。每个家族 11 档，从 50 到 950，50 最浅、950 最深、500 常作基准色。

透明度用斜杠修饰符，bg-sky-500/50 就是 50% 不透明度，底层是 CSS 的 color-mix，比 v3 那个已废弃的 bg-opacity-50 更直观。同一套颜色能用在 bg-、text-、border-、ring-、fill-、from- 等大量属性上。

一个迁移坑：v4 里裸 border、ring、divide 的默认色从 gray-200、blue-500 改成了 currentColor，跟随文字色，依赖旧灰色默认值的地方升级后要显式写颜色。
-->

---

# 自定义：@utility 与 @custom-variant

```css
/* 自定义工具类（取代 v3 @layer utilities），自动支持全部变体 */
@utility tab-4 {
  tab-size: 4;
}

/* 自定义变体（新前缀） */
@custom-variant pointer-coarse (@media (pointer: coarse));
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

```html
<pre class="tab-4 lg:tab-4">…</pre>
<div class="p-2 pointer-coarse:p-4 theme-midnight:bg-black">…</div>
```

<!--
v4 的两个自定义指令。

@utility 定义自定义工具类，取代 v3 往 @layer utilities 手写类的做法。看例子 @utility tab-4 设 tab-size 4，它和引擎集成，自动支持所有变体，hover:tab-4、lg:tab-4 开箱可用。

@custom-variant 定义自定义变体，也就是新的前缀。可以按媒体特性，比如 pointer-coarse 匹配粗指针设备；也可以按属性选择器，比如 theme-midnight 匹配某个主题属性。定义后就能像内建变体一样用 pointer-coarse:p-4、theme-midnight:bg-black。前面讲的深色模式 class 策略，本质就是用 @custom-variant 重定义 dark。
-->

---

# @apply：适用与滥用

```css
/* 覆盖第三方库样式，同时复用设计令牌 */
.select2-dropdown {
  @apply rounded-b-lg shadow-md;
}
```

<div v-click class="mt-4">

⚠️ **别把 `@apply` 当默认写法**

</div>

<v-clicks>

- 把每个组件写成 `.btn { @apply … }` = 把工具类优势又抽象回传统 CSS
- 要复用一块 UI，优先抽**组件/模板片段**（结构+样式一起封装）
- 组件 `<style>` 里用 `@apply` 需先 `@reference "…"` 引主题

</v-clicks>

<!--
@apply 这一屏要讲清楚适用和滥用的边界。

@apply 把已有工具类内联进自定义 CSS 规则，它的正当用途是覆盖那些你控制不了的第三方库样式，同时还能复用你的设计令牌。看例子，给第三方下拉组件的类加 rounded-b-lg 和 shadow-md。

但要警告：别把 @apply 当默认写法。如果你把每个组件都写成 .btn { @apply ... }、.card { @apply ... }，等于把工具类样式即类名、可读可搬运的优势重新抽象回了传统 CSS，得不偿失。要复用一块 UI，优先抽组件或模板片段，把结构和样式一起封装，而不是抽一个 @apply 类。官方明确把 @apply 定位为补充手段。

还有个实操点：在 Vue、Svelte 组件的 style 块里用 @apply，因为那是独立编译单元看不到主题，需要先在顶部写 @reference 引用主题，它只引用不重复输出 CSS。
-->

---

# v3 → v4 迁移速览（重点）

先跑 `npx @tailwindcss/upgrade`（Node 20+），再自查：

| v3 | v4 |
| --- | --- |
| `@tailwind base/components/utilities` | `@import "tailwindcss";` |
| `shadow-sm` / `shadow` | `shadow-xs` / `shadow-sm` |
| `outline-none` · `ring`(3px) | `outline-hidden` · `ring`(1px，`ring-3`) |
| 边框默认 `gray-200` | `currentColor` |
| `!flex` · `bg-[--v]` | `flex!` · `bg-(--v)` |

<div v-click class="mt-2 text-sm">

> 浏览器要求 Safari 16.4+/Chrome 111+/Firefox 128+；需兼容更老留 **v3.4**。最易静默出错：**默认边框色**、**`space-*` 选择器变更**（建议改 `gap`）。

</div>

<!--
v3 到 v4 迁移，第一步永远是官方升级工具 npx @tailwindcss/upgrade，需要 Node 20 以上，它自动处理大部分改名和语法迁移，但跑完必须人工复核。

看这张对照表挑最高频的：三条 @tailwind 改成一行 @import；阴影模糊圆角整体下移一档，shadow-sm 变 shadow-xs、shadow 变 shadow-sm；outline-none 改名 outline-hidden，ring 默认宽度从 3px 变 1px，要 3px 用 ring-3；边框默认色从 gray-200 改成 currentColor；important 感叹号从前置 !flex 改成后置 flex!；变量任意值从方括号改圆括号。

两个提醒：浏览器要求抬高到 Safari 16.4、Chrome 111、Firefox 128 以上，不支持 IE11，需要兼容更老环境就留在 v3.4。最容易静默出错的两处是默认边框色变化，页面边框颜色悄悄变了，和 space-* 选择器变更，含内联元素的间距会变样，官方建议能用 flex/grid 加 gap 的地方就别用 space-*。
-->

---

# 生态与选型

组件方案都建立在工具类之上：

| 方案 | 定位 |
| --- | --- |
| **shadcn/ui** | Tailwind + Radix，复制源码进项目，可改 |
| **Headless UI** | 官方无样式可访问组件，样式你写 |
| **Radix** | 无样式原语，写 `data-state` 配 `data-*` 变体 |

<div v-click class="mt-3 text-sm">

> **边界**：UnoCSS 是同赛道竞品（原子化引擎，有兼容 Tailwind 的 preset，可互替）；PostCSS 是底层机制（v4 内建 Lightning CSS，免手配 postcss-import/autoprefixer）；原生现代 CSS 是它的底座。

</div>

<!--
生态与选型。Tailwind 只给样式底座，成品组件靠上层生态，它们的共同点是样式全用 Tailwind 工具类写。

shadcn/ui 基于 Tailwind 加 Radix，特点是复制源码进项目而不是 npm 黑盒，类名可以直接改，定制自由度高。Headless UI 是 Tailwind 官方的无样式可访问组件，下拉、对话框这些，交互和无障碍它管、样式你用工具类写。Radix 是无样式的可访问原语，会在元素上写 data-state，正好配 data-* 变体，shadcn 就是基于它。

再说边界，把几个同组的邻居理清楚：UnoCSS 是同赛道竞品，即时按需的原子化引擎，主打高度可定制，还提供兼容 Tailwind 类名的 preset，两者可以互相替代，是不同选择不是依赖关系。PostCSS 是底层机制，v4 内建了 Lightning CSS，不再需要你手配 postcss-import 和 autoprefixer。原生现代 CSS，变量、:has、color-mix、容器查询，是 Tailwind 的底座，归 Web 基础章。
-->

---
layout: intro
---

# 总结

Tailwind CSS = **工具类优先 + 设计令牌 + 变体体系**

- 在标签上拼样式；状态/响应式/深色靠 `hover:`/`md:`/`dark:` 变体
- v4 CSS-first：`@import "tailwindcss"` + `@theme`，默认无 config
- 令牌**即 CSS 变量**：一条声明既生成工具类又暴露 `var(--…)`
- Oxide 引擎（Rust + Lightning CSS）：全量约 3.5×、增量百倍量级
- 容器查询/OKLCH/`not-*`/3D/`@starting-style` 全内建
- v4.3：面向现代浏览器，生态（shadcn/Headless）成熟

<!--
总结一下。Tailwind CSS 是工具类优先加设计令牌加变体体系的 CSS 框架。

核心心智：在标签上用原子类拼样式，状态、响应式、深色模式全靠 hover:、md:、dark: 这些变体前缀表达，行内 style 做不到的它都能做。

v4 的关键变化：走 CSS-first，一行 @import "tailwindcss" 加 @theme 配置，默认不再需要配置文件；设计令牌即 CSS 变量，一条声明既生成工具类又暴露 var(--...)，能参与 calc；全新的 Oxide 引擎把热点迁到 Rust、内建 Lightning CSS，全量构建约快 3.5 倍、增量百倍量级；容器查询、OKLCH 广色域调色板、not-* 取反变体、3D 变换、@starting-style 全部内建。

2026 年现状：v4.3，面向现代浏览器 Safari 16.4、Chrome 111、Firefox 128 以上，生态里 shadcn/ui、Headless UI 这些组件方案都建立在它的工具类之上，非常成熟。是当下做设计系统、要状态响应式深色开箱即用的原子化 CSS 首选。谢谢大家。
-->
