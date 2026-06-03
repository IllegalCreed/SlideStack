---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Iconify
info: |
  Presentation Iconify — the unified icon framework.

  Learn more at [https://iconify.design](https://iconify.design)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎨</span>
</div>

<br/>

## Iconify — 统一的开源图标框架

一套语法 prefix:name 访问 200+ 图标集、27 万+ 图标，按需加载零冗余 —— Web Component / React·Vue·Svelte 组件 / Tailwind·UnoCSS 全覆盖

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/iconify/iconify" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Iconify —— Vjacheslav Trushkin 维护的统一开源图标框架。

定位一句话：用一套语法 prefix:name 访问几乎所有开源图标集，并且只按需加载用到的图标。
聚合 200+ 个开源图标集、27 万+ 图标（Material Symbols、Carbon、Tabler、Lucide、Simple Icons、emoji 等）。

与 react-icons / Font Awesome / SVG sprite 整套打包不同，
Iconify 渲染像素级 SVG、从 API 只加载实际用到的图标，没用到的既不打包也不下载。

三种用法：Web Component（框架无关、SSR 安全）、各框架原生组件、构建时 Tailwind/UnoCSS。

后面顺序：定位 → 对比 → 三种用法 → 命名与尺寸颜色翻转 → 框架组件差异 →
Web Component 渲染模式 → API 与离线 → 工具链 → 踩坑 → 总结。
-->

---
transition: fade-out
---

# 什么是 Iconify？

一套语法访问所有图标集，真正按需加载

<v-clicks>

- **统一语法 `prefix:name`**：`mdi:home` / `carbon:add` / `simple-icons:github` —— 200+ 套同一种写法
- **按需加载、零冗余**：渲染 SVG，从 API 只取用到的图标，不像 react-icons / Font Awesome 整套打包
- **像素级 SVG（非字体）**：图标经清洗、优化、校验
- **全栈覆盖**：Web Component（SSR 安全）+ React/Vue/Svelte/Solid 组件 + Tailwind/UnoCSS 构建时
- **像字体一样用**：默认 `1em` 随字体缩放，单色图标 `currentColor` 跟随文字颜色
- **27 万+ 图标 / 200+ 套**（官网现值；旧版常引用的「150 套 / 20 万」是早期数字）

</v-clicks>

<style>
h1 {
  background-color: #E11D48;
  background-image: linear-gradient(45deg, #E11D48 10%, #F43F5E 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 统一语法 prefix:name，200+ 套图标同一种写法。
[click] 按需加载零冗余，这是和 react-icons、Font Awesome 整套打包最大的区别。
[click] 渲染像素级 SVG，不是字体，所有图标经清洗优化校验。
[click] 全栈覆盖：Web Component、各框架组件、构建时方案。
[click] 像字体一样用，默认 1em 随字体缩放，单色图标 currentColor 跟随文字色。
[click] 数字说明一下：官网现在说 27 万+ 图标、200+ 套；老版常引用的 150 套 20 万是早期数字，引用时注意来源。
-->

---
transition: fade-out
---

# 与 react-icons / Font Awesome 的区别

要「一套语法 + 真正按需」选 Iconify

<v-click>

| 维度 | Iconify | react-icons | Font Awesome |
|---|---|---|---|
| 图标来源 | **200+ 套统一聚合** | 多套（各自打包） | 主要自家集 |
| 加载 | **按需，零冗余** | 按 import 打包 | 字体/SVG，整套倾向 |
| 渲染 | 像素级 SVG | SVG 组件 | 字体 / SVG |
| 框架 | **全覆盖（含纯 HTML）** | React | 多框架 |

</v-click>

<v-click>

> 💡 要「一套语法用遍所有图标集 + 真正按需」选 Iconify；只在 React 用、不介意各套分别 import 可用 react-icons。

</v-click>

<style>
h1 {
  background-color: #E11D48;
  background-image: linear-gradient(45deg, #E11D48 10%, #F43F5E 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 对比三者：Iconify 聚合 200+ 套、真正按需、全框架覆盖（含纯 HTML）；
react-icons 多套各自打包、只 React；Font Awesome 主要自家集、偏整套。
[click] 结论：要一套语法用遍所有图标集且真正按需选 Iconify；只在 React 用可考虑 react-icons。
-->

---
transition: fade-out
---

# 三种使用方式

```html
<!-- ① Web Component（框架无关、SSR 安全）：npm i iconify-icon -->
<iconify-icon icon="mdi:home"></iconify-icon>
```

```tsx
// ② 框架原生组件：npm i -D @iconify/react（或 /vue /svelte）
import { Icon } from '@iconify/react'
<Icon icon="mdi:home" width={24} color="#1677ff" />
```

```ts
// ③ 构建时（零运行时）：UnoCSS presetIcons —— 本 quiz-monorepo 项目用法
presetIcons({ scale: 1.2, prefix: 'i-' })
// <div class="i-mdi-home" />   ← i-{prefix}-{name}
// 或 Tailwind：@iconify/tailwind(T3) / @iconify/tailwind4(T4)
```

<style>
h1 {
  background-color: #E11D48;
  background-image: linear-gradient(45deg, #E11D48 10%, #F43F5E 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
三种用法：
① Web Component iconify-icon，框架无关，用 Shadow DOM，SSR 安全 —— 纯 HTML 或任何框架都能用。
② 各框架原生组件，@iconify/react、@iconify/vue、@iconify/svelte。
③ 构建时方案零运行时：UnoCSS 的 presetIcons（本项目用法，class 形如 i-mdi-home），
或 Tailwind 的 @iconify/tailwind（T3）/ @iconify/tailwind4（T4），在构建期把图标内联进 CSS。
-->

---
transition: fade-out
---

# 命名 prefix:name & 尺寸/颜色/翻转

```html
<!-- 命名：[@provider:]prefix:name -->
<iconify-icon icon="mdi:home"></iconify-icon>      <!-- Material Design Icons -->
<iconify-icon icon="carbon:add"></iconify-icon>

<!-- 尺寸：默认 height:1em 随字体；或显式 width（另一维按比例算） -->
<iconify-icon icon="mdi:home" style="font-size: 32px"></iconify-icon>
<iconify-icon icon="mdi:home" width="48"></iconify-icon>

<!-- 颜色：单色图标用 currentColor，调文字 color（别设 fill！彩色图标改不了） -->
<iconify-icon icon="mdi:home" style="color: red"></iconify-icon>

<!-- 翻转旋转（在 SVG 内部完成，非 CSS）：rotate 1/2/3 = 90/180/270 -->
<iconify-icon icon="mdi:arrow-up" rotate="90deg" flip="horizontal"></iconify-icon>
```

<style>
h1 {
  background-color: #E11D48;
  background-image: linear-gradient(45deg, #E11D48 10%, #F43F5E 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
图标命名 [@provider:]prefix:name，provider 通常省略走公共 API，prefix 是图标集、name 是图标名。

尺寸：默认 height 1em 随字体大小，像字体一样用；或显式给 width/height，只给一个另一个按图标比例自动算。

颜色关键点：只有单色图标能改色，它们用 currentColor，调文字 color 即可 —— 千万别设 fill，
因为很多图标用 stroke，设 fill 无效甚至出错。彩色和 emoji 图标改不了色。

翻转旋转在 SVG 内部完成（改 viewBox），不是 CSS transform；rotate 用 1/2/3 表示 90/180/270 度。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 框架组件差异（跨框架易踩）

::left::

<v-click>

**翻转属性各端不同**

| 组件 | 翻转 | 导出 |
|---|---|---|
| `@iconify/react` | `hFlip`/`vFlip` | named |
| `@iconify/vue` | `horizontalFlip`/`verticalFlip` | named |
| `@iconify/svelte` | `hFlip`/`vFlip` | **default** |
| `iconify-icon` | 单个 `flip` 字符串 | — |

</v-click>

::right::

<v-click>

**SSR 行为**

- React/Vue 组件**挂载后才渲染 SVG**（避免 hydration 错）
- SSR 首屏出图：用 **Web Component** / 构建时方案 / 传**图标数据对象**
- Vue 有 `ssr` 布尔属性（v4.1.2+）
- `icon` 可传字符串名或 IconifyIcon 数据对象

</v-click>

<style>
h1 {
  background-color: #E11D48;
  background-image: linear-gradient(45deg, #E11D48 10%, #F43F5E 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 跨框架迁移最易踩的细节：翻转属性名不同 ——
React 和 Svelte 用 hFlip/vFlip，Vue 用 horizontalFlip/verticalFlip，Web Component 用单个 flip 字符串。
还有导出方式：React/Vue 是 named 导出 { Icon }，Svelte 是 default 导出。

[click] SSR 行为：React/Vue 组件默认挂载后才渲染 SVG，服务端 HTML 里没图标，避免 hydration 错。
要 SSR 首屏出图，用 Web Component、构建时方案、或给组件传图标数据对象（不是名字字符串）。
Vue 还有 ssr 布尔属性。
-->

---
transition: fade-out
---

# Web Component 渲染模式 & API/离线

<v-clicks>

- **Web Component 四种 `mode`**（React/Vue 总渲染 svg）：`svg`（默认）/ `style`（自动选）/ `bg`（span 背景图，彩色图标）/ `mask`（span 遮罩 + currentColor，单色图标）
- **公共 API** `api.iconify.design` + 备份 `simplesvg.com` / `unisvg.com`，**0.75s 故障切换**，只下载用到的图标
- **完全离线**：`@iconify/json`（全量，大）或 `@iconify-json/<prefix>`（单集合，推荐）+ `addCollection` / `addIcon` 预注册
- **IconifyJSON 格式**：必填 `prefix` + `icons`（body），默认 viewBox `0 0 16 16`
- ⚠️ **localStorage 图标缓存 2025 已废弃**（`enableCache` 失效）

</v-clicks>

<style>
h1 {
  background-color: #E11D48;
  background-image: linear-gradient(45deg, #E11D48 10%, #F43F5E 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Web Component 独有的 mode 属性，四种：svg 默认渲染 svg 元素；style 自动按调色板选；
bg 是 span 加 background-image 适合彩色图标；mask 是 span 加 mask-image 加 currentColor 适合单色图标。
bg/mask 还能避免 svg 模式在页面加载时的动画起始延迟。
[click] API：默认从 api.iconify.design 按需加载，带 simplesvg、unisvg 两个备份，0.75 秒超时自动切换，只下用到的。
[click] 完全离线：装 @iconify/json 全量（很大）或 @iconify-json 单集合（推荐），配 addCollection/addIcon 预注册。
[click] IconifyJSON 数据格式：必填 prefix 和 icons，默认 viewBox 0 0 16 16。
[click] 注意旧的 localStorage 图标缓存 2025 年已废弃，别再依赖 enableCache。
-->

---
transition: fade-out
---

# 工具链集成

<v-clicks>

- **Tailwind**：T3 用 `@iconify/tailwind`（`addDynamicIconSelectors()` / `addIconSelectors()`，`addCleanIconSelectors` 已弃用）；T4 用 `@iconify/tailwind4`。动态 class 图标名内 `-` 写**双连字符**：`icon-[mdi-light--home]`
- **UnoCSS（本项目）**：`@unocss/preset-icons`，默认 `prefix: 'i-'`、`scale: 1.2`，class 如 `i-mdi-home`
- **`@iconify/utils` 五函数**：`getIconData` / `iconToSVG` / `iconToHTML` / `replaceIDs` / `calculateSize`
- **其它**：Iconify for Figma 插件、Icon Finder 选图器、`@iconify-json/*` 按集合分发
- ⚠️ **pnpm + UnoCSS presetIcons 坑**：自动发现 `@iconify-json/*` 失效，**必须显式 `collections`**（本项目 CLAUDE.md 已记）

</v-clicks>

<style>
h1 {
  background-color: #E11D48;
  background-image: linear-gradient(45deg, #E11D48 10%, #F43F5E 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Tailwind 拆两个包：T3 用 @iconify/tailwind，插件函数 addDynamicIconSelectors 或 addIconSelectors，
注意 addCleanIconSelectors 已弃用；T4 用 @iconify/tailwind4。动态 class 里图标名的连字符要写成双连字符，
比如 icon-[mdi-light--home]。
[click] UnoCSS 是本项目用法，@unocss/preset-icons，默认 prefix i-、scale 1.2，class 如 i-mdi-home。
[click] @iconify/utils 五个函数：getIconData 取图标、iconToSVG 转 SVG 对象、iconToHTML 拼字符串、
replaceIDs 防 id 冲突、calculateSize 算尺寸。
[click] 还有 Figma 插件、Icon Finder 选图器、@iconify-json 按集合分发的数据包。
[click] 一个本项目相关的坑：pnpm 严格隔离下 presetIcons 自动发现图标集失效，必须显式传 collections。
-->

---
layout: center
class: text-center
transition: slide-up
---

# 总结 & 资源

Iconify = 一套语法用遍 200+ 图标集，真正按需加载

<div class="text-left max-w-2xl mx-auto mt-4">

- **统一 `prefix:name`**：27 万+ 图标 / 200+ 套，渲染像素级 SVG，零冗余
- **全栈覆盖**：Web Component（SSR 安全）/ React·Vue·Svelte / Tailwind·UnoCSS 构建时
- **像字体一样用**：`1em` 缩放、单色图标 `currentColor`（别设 fill）
- **离线可控**：自建 API 或 `@iconify-json` + `addCollection`；各端 flip 命名不同、注意 SSR

</div>

<div class="mt-6 text-sm opacity-80">
  官网 iconify.design · 图标搜索 icon-sets.iconify.design · GitHub iconify/iconify
</div>

<style>
h1 {
  background-color: #E11D48;
  background-image: linear-gradient(45deg, #E11D48 10%, #F43F5E 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
收尾总结：
- Iconify 用统一的 prefix:name 访问 27 万+ 图标、200+ 套，渲染像素级 SVG，真正按需零冗余。
- 全栈覆盖：Web Component（SSR 安全）、React/Vue/Svelte 组件、Tailwind/UnoCSS 构建时。
- 像字体一样用，1em 缩放，单色图标 currentColor 改色，别设 fill。
- 离线可控，自建 API 或 @iconify-json 加 addCollection；注意各端 flip 命名不同、React/Vue 默认不 SSR。

资源：官网 iconify.design、图标搜索 icon-sets.iconify.design、GitHub iconify/iconify。谢谢！
-->
