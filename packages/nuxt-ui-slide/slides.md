---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Nuxt UI
info: |
  Presentation Nuxt UI v4 for Vue & Nuxt developers.

  Learn more at [https://ui.nuxt.com](https://ui.nuxt.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">💚</span>
</div>

<br/>

## Nuxt UI — Nuxt 官方维护的现代 Vue UI 组件库

125+ 组件 / Reka UI + Tailwind CSS 4 / Pro 免费开源 —— Nuxt 核心团队打造、Vercel 资源加持，当前主线 v4.x

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Nuxt UI —— Nuxt 官方团队（Pooya Parsa、Benjamin Canac、Sebastien Chopin 等）
于 2022 年开源的 Vue 3 UI 组件库，是 Nuxt 生态唯一官方钦定的 UI 库。

2025 年 NuxtLabs 被 Vercel 收购后，Nuxt UI 获得了专职团队 + Vercel 商业资源支持。
2026 年 2 月发布的 v4 是一次史诗级大重写 —— v3 只有一年寿命就被全面替代。

核心卖点：
- Nuxt 官方背书 —— 等价于 React 生态 shadcn/ui 的地位
- v4 重磅：原本付费 $249 的 Nuxt UI Pro 现在完全免费 + 开源，全部 125+ 组件合并到 @nuxt/ui
- 基于 Reka UI（Radix UI 的 Vue 版无样式 primitives）—— 所有组件天然 a11y 优秀
- Tailwind CSS 4 CSS-first 主题 —— @theme 指令 + 7 色语义化别名
- v4 支持纯 Vue 项目（Vite + Inertia）—— 不再绑死 Nuxt
- Standard Schema 表单校验 —— Zod / Valibot / Yup / Joi / Superstruct 五大库统一接口
- UTable 基于 TanStack Table v8 —— 业内最强表格实现
- AI Chat 组件 + Dashboard 模板（v4 新）—— 直接搭 AI 产品 + 中后台

下面会按「定位 → Nuxt 团队 → 核心理念 → 安装 → UApp → Tailwind 4 → 主题 →
组件速览 → UForm → UTable → Overlay → useToast → 图标 → 暗色 → i18n →
AI Chat → Dashboard → 集成 → 迁移 → 踩坑 → 评价 → 学习路径」顺序展开。
-->

---
transition: fade-out
---

# 什么是 Nuxt UI？

为 Vue 3 / Nuxt 应用提供「Nuxt 官方背书 + Tailwind 风格 + a11y 优秀」的现代组件库

<v-click>

- **125+ 组件**：Layout / Element / Form / Data / Navigation / Overlay / Page / Dashboard / AI Chat / Editor / Content / Color Mode 十二大类
- **Nuxt 官方钦定**：Nuxt 核心团队亲自维护，Nuxt 文档处处推荐 —— Vue 生态的 shadcn/ui
- **Reka UI primitives 底层**：WAI-ARIA 合规 + 键盘导航 + 焦点管理 + Screen Reader 优秀
- **Tailwind CSS 4 主题**：CSS-first `@theme` 指令 + 7 色语义化别名，零配置文件
- **Standard Schema 校验**：Zod / Valibot / Yup / Joi / Superstruct 五大校验库随时切换
- **UApp 必须包根**：内置 OverlayProvider + ToastProvider + 主题注入
- **TypeScript 优先**：Vue Generics + 全组件类型推导 + `app.config.ts` 类型安全主题
- **v4 支持纯 Vue 项目**：通过 `@nuxt/ui/vite` 插件，不再绑死 Nuxt

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Nuxt UI Introduction_](https://ui.nuxt.com/getting-started)

</div>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Nuxt UI 的核心定位很清晰：「Nuxt 生态唯一官方钦定的 UI 库」——

它和 Element Plus（企业管理后台）、Naive UI（设计型 + CSS-in-JS）、
Vuetify（Material Design）都不同，走的是「Tailwind 风格 + Vercel 设计美学」路线。

- 125+ 组件覆盖中后台 + 营销页 + Dashboard + AI 产品 + 编辑器 + 多语言全部场景
- Nuxt 官方背书是它最大的护城河 —— 等价于 React 生态 shadcn/ui 的地位
  （虽然 shadcn 是社区项目，Nuxt UI 是官方项目）
- 底层用 Reka UI（Radix UI 的 Vue 版）—— 这意味着所有组件天然 a11y 优秀，
  这是 Element Plus 历史遗留 a11y 弱项无法比的
- 主题用 Tailwind 4 的 @theme CSS 指令 —— 不再用 SCSS / CSS-in-JS
- 表单校验通过 Standard Schema 规范，五大主流校验库统一接口
- UApp 必须包根 —— 这是 Nuxt UI 与其他 UI 库最大的差异之一，后面会专门讲
- TypeScript 体验是 Vue UI 库中最好的 —— Volar 补全极致
- v4 最大的新特性：支持纯 Vue 项目 —— v3 只能 Nuxt 用，v4 是真正的「Vue UI 库」

下面会按「定位 → 安装 → UApp → Tailwind 4 → 核心场景 → 主题 → 国际化 →
AI / Dashboard → 迁移 → 踩坑」顺序展开。
-->

---
transition: fade-out
---

# Nuxt UI 的定位与生态

为什么 Nuxt 官方做了一个 UI 库？为什么 Tailwind 派偏爱？

<v-click>

| 维度       | Nuxt UI v4        | Element Plus    | Naive UI       | Vuetify 3      |
| ---------- | ----------------- | --------------- | -------------- | -------------- |
| 阵营       | **Nuxt 官方+Vercel** | 饿了么 + 社区   | 图森未来       | Vuetify Team   |
| 设计语言   | **Tailwind 风格** | 企业管理后台    | 现代极简       | Material 3     |
| 底层       | **Reka UI**       | 自研            | 自研           | 自研           |
| 样式方案   | **Tailwind 4 + tv()** | CSS Vars+SCSS | CSS-in-JS      | SCSS + theme   |
| 组件数量   | **125+**          | 80+             | 90+            | 80+            |
| AI/Dashboard | **完整（v4 新）** | 无              | 无             | 无             |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Vue 3 UI Comparisons_](https://ui.nuxt.com/)

</div>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比四大 Vue 3 UI 库，Nuxt UI 的护城河是「Nuxt 官方 + Tailwind 4 + Reka UI + AI/Dashboard」：

- 阵营是 Nuxt 官方团队 + Vercel —— 这是「官方光环」最重的一个
- 设计语言走 Tailwind 风格 + Vercel 设计美学 —— 现代、克制、克隆度低
- 底层是 Reka UI（Radix Vue），不是自研 —— 意味着 a11y 能力天然优秀
- 样式方案是 Tailwind 4 + tv() Variants —— 类型安全、可覆盖、不重叠
- 125+ 组件（Pro 合并后）覆盖度领先 —— 单库覆盖中后台/营销页/Dashboard/AI
- AI Chat 组件 + Dashboard 模板是 v4 独有 —— 其他三家都没有

对比 Element Plus：Element Plus 国内市场断层第一、招聘市场绝对主流，
但 Nuxt UI Tailwind 风格更现代、a11y 优秀、AI / Dashboard 组件更完整。
国内 Vue 中后台目前仍优先选 Element Plus，追求设计 + AI 时代选 Nuxt UI。

对比 Naive UI：Naive UI 设计品质 + TS 严格 + 尤雨溪推荐 + CSS-in-JS 主题；
Nuxt UI Tailwind 风格 + Nuxt 官方 + Reka UI 底层 + Pro 免费 —— 纯 Vue 项目两者旗鼓相当。

对比 shadcn-vue：shadcn-vue 是「复制源码到项目」模式，同样基于 Reka UI + Tailwind 4，
Nuxt UI 是「包」、shadcn-vue 是「源码复制」—— 目标用户重叠但维护方式不同。

选型逻辑：Nuxt 全栈 / Tailwind 派 / AI 产品 → Nuxt UI；招聘市场 / 中文生态 → Element Plus。
-->

---
transition: fade-out
---

# Nuxt 团队与 v3 到 v4 大重写

Pro 免费开源、支持纯 Vue、Tailwind 4 强制

<v-click>

| 时间    | 关键事件                                              |
| ------- | ----------------------------------------------------- |
| 2022    | Nuxt 核心团队开源 Nuxt UI，作为 Nuxt 生态官方 UI 库   |
| 2024-25 | Tailwind 4 重大重写 + Reka UI 成熟，技术栈现代化      |
| 2025    | NuxtLabs 被 Vercel 收购，获得专职团队 + 商业资源      |
| 2026.02 | **v3 → v4 大重写**，Pro 免费 + 支持纯 Vue + Tailwind 4 |

</v-click>

<v-click>

> 💡 **v4 史诗级变更**：原本付费 $249 的 **Nuxt UI Pro 完全免费 + 开源**，Dashboard / Page / AuthForm / ChatPrompt 等 80+ 高级组件全部合并到 `@nuxt/ui`；v4 还支持**纯 Vue 项目**（不再绑死 Nuxt），并**强制 Tailwind 4**。

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Nuxt UI 的发展轨迹非常清晰 ——

2022 年由 Nuxt 核心团队开源 —— Pooya Parsa（Nuxt 核心）、Benjamin Canac、
Sebastien Chopin（Nuxt 创始人）等亲自维护，定位是「Nuxt 生态官方 UI 库」。

2024-2025 是技术栈大升级期 —— Tailwind 4 的重大重写（Rust 引擎、CSS-first 配置）
加上 Reka UI（Radix Vue）成熟，让 Nuxt UI 的底层全面现代化。

2025 年是关键转折 —— NuxtLabs（Nuxt UI 母公司）被 Vercel 收购。
这件事对企业选型很重要：Nuxt UI 从此有专职团队 + Vercel 的商业资源，
长期维护更有保障 —— 对比 Naive UI 主要依赖 07akioni 一人，稳定性更高。

2026 年 2 月 v4 发布 —— 这是一次史诗级大重写，v3 只有一年寿命就被全面替代。

[click] v4 的三大史诗级变更：

1. Pro 完全免费 + 开源 —— 这是最重磅的。
   v3 时代 Nuxt UI Pro 是付费产品（$249），含 Dashboard、Page、AuthForm、
   PricingPlans、ChatPrompt 等 80+ 高级组件。
   v4 把它们全部合并到 @nuxt/ui，完全免费 + 开源 —— 等价于免费送你 $249 的中后台组件库。
   连完整的 Figma Kit 也免费了。

2. 支持纯 Vue 项目 —— v3 只能在 Nuxt 项目里用，v4 通过 @nuxt/ui/vite 插件
   + @nuxt/ui/vue-plugin，可独立用在 Vue 3 + Vite + Inertia.js 项目里。
   这让 Nuxt UI 第一次成为真正意义上的「Vue UI 库」。

3. Tailwind 4 强制 —— v3 还兼容 Tailwind 3，v4 必须 Tailwind 4。
   这是 v3 → v4 最大的破坏性变更之一，已有 Tailwind 3 项目升级有迁移成本。

代价是 v3 → v4 破坏性变更大 —— 组件改名、Form 校验架构变化、AI 集成 API 重写，
后面「v3 → v4 迁移」章节会详细讲。
-->

---
transition: fade-out
---

# Nuxt UI 的核心理念

四条设计原则贯穿全部组件 API

<v-click>

**1. Reka UI primitives 底层**

基于 Reka UI（Radix UI 的 Vue 版无样式 primitives）—— 所有组件天然 WAI-ARIA 合规 + 键盘导航 + 焦点管理 + Screen Reader 优秀。

</v-click>

<v-click>

**2. Tailwind CSS 4 CSS-first 主题**

主题用 `@theme` CSS 指令 + `app.config.ts` 语义化别名 —— 不再用 SCSS / CSS-in-JS，零 `tailwind.config.js`。

</v-click>

<v-click>

**3. Standard Schema 表单校验**

统一接口适配 Zod / Valibot / Yup / Joi / Superstruct / Regle —— 校验库随时切换、不绑死。

</v-click>

<v-click>

**4. TypeScript 优先**

Vue Generics + 全组件类型推导 + `defineAppConfig` 主题类型安全 + `TableColumn<T>` 泛型表格。

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Reka UI primitives 是 Nuxt UI 与其他 Vue UI 库最大的差异化 ——

Reka UI 原名 Radix Vue，是 React 生态 Radix UI 的 Vue 移植版。
它是「无样式 primitives 库」—— 只提供行为逻辑（开关、聚焦、键盘导航），不带任何样式。

Nuxt UI 在 Reka UI 之上加 Tailwind 样式，组装成有视觉的组件。
好处：所有 Nuxt UI 组件天然继承 Reka UI 的可访问性 ——
WAI-ARIA 合规、键盘导航、焦点陷阱（focus trap）、Screen Reader 支持全部内置。

这是 Element Plus 历史遗留 a11y 弱项无法比的。
代价：遇到复杂自定义需求时，可能要懂 Reka UI primitives 的 API。

[click] Tailwind CSS 4 CSS-first 主题 ——

v4 强制 Tailwind 4。Tailwind 4 最大的变化是「CSS-first 配置」——
不再用 tailwind.config.js（JS 对象），而是在 CSS 里用 @theme 指令定义变量。

主题色就是 CSS variables（--color-primary-500），配合 app.config.ts 的语义化别名。
这是 2024-2025 的 Tailwind 大趋势，比 SCSS variables 更现代。

[click] Standard Schema 表单校验 ——

Standard Schema 是一个跨校验库的统一规范。
UForm 通过它支持 Zod / Valibot / Yup / Joi / Superstruct / Regle 六大库。
你只要传 :schema，UForm 自动识别用的是哪个库，统一处理校验和类型推导。
这意味着「校验库随时切换、不绑死」—— 想从 Zod 换 Valibot，改个 schema 就行。

对比 Element Plus 自带的 async-validator —— 那个难配合 TypeScript，
Standard Schema 方案在 TS 体验上是降维打击。

[click] TypeScript 优先 ——

不是「也支持 TypeScript」，而是「TypeScript 是设计起点」。
Vue Generics 让 UTable<T> 这种泛型组件成为可能；
FormSubmitEvent<Schema> 让提交事件的 data 自动推导出类型；
defineAppConfig 让主题配置每个 key 都有 IDE 补全。
Volar 体验是 Vue UI 库中最好的。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装：Nuxt 项目集成

`modules` 一行 + 两行 CSS import + UApp 包根

::left::

<v-click>

**安装（必须同时装 tailwindcss）**

```bash
pnpm add @nuxt/ui tailwindcss
```

**nuxt.config.ts 加模块**

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
})
```

> 💡 Nuxt UI 自动注册 `@nuxt/icon` `@nuxt/fonts` `@nuxtjs/color-mode` 三个核心模块，无需手动 install。

</v-click>

::right::

<v-click>

**创建 main.css（两行不能少、顺序不能错）**

```css
@import "tailwindcss";
@import "@nuxt/ui";
```

**app.vue 用 UApp 包根**

```vue
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

新手最推荐直接用模板：`npm create nuxt@latest -t ui`

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Nuxt 项目集成 Nuxt UI 非常简单 ——

第一步：pnpm add @nuxt/ui tailwindcss。
注意必须同时装 tailwindcss —— Nuxt UI v4 必须 Tailwind 4，不再内置，要单独装。

第二步：nuxt.config.ts 里 modules 加 '@nuxt/ui'，并配置 css 入口。

关键提示：Nuxt UI 会自动注册三个核心模块 ——
- @nuxt/icon：图标系统（Lucide + Iconify）
- @nuxt/fonts：字体优化（Google Fonts 等）
- @nuxtjs/color-mode：暗色模式切换
这三个不需要你手动 install、也不用加到 modules 数组里，Nuxt UI 自动处理。

[click] 第三步：创建 main.css，写两行 import ——
@import "tailwindcss" 在前（提供基础 utilities），
@import "@nuxt/ui" 在后（覆盖 UI 主题变量）。
两行不能少、顺序不能错，错了样式会乱。

第四步：app.vue 用 <UApp> 包住 <NuxtPage>。
UApp 必须包根 —— 后面会专门讲为什么。

如果是新项目，最推荐直接用官方模板 npm create nuxt@latest -t ui ——
这个 ui 模板创建后直接含 Nuxt UI v4 + Tailwind 4 + 完整配置，新手零踩坑。

启动后访问 localhost:3000 就能用 <UButton> 等组件了。
注意：Nuxt 项目升级 v4 必须先把 Nuxt 框架升级到 Nuxt 4 ——
Nuxt 3 项目不能直接用 Nuxt UI v4，只能用 v3.x（但 v3 已停止新特性开发）。
-->

---
transition: fade-out
---

# 安装：纯 Vue 项目集成（v4 新）

`@nuxt/ui/vite` 插件 + `@nuxt/ui/vue-plugin` + `isolate` 类

<v-click>

```ts
// vite.config.ts —— 加 ui() 插件
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [vue(), ui()],
})
```

```ts
// src/main.ts —— app.use(ui)，CSS 入口必须在 createApp 之前 import
import ui from '@nuxt/ui/vue-plugin'
import './assets/css/main.css'
const app = createApp(App)
app.use(router).use(ui)
app.mount('#app')
```

</v-click>

<v-click>

> 💡 `index.html` 根 div 必须加 `class="isolate"` —— 否则 Tailwind 4 隔离丢失、Overlay 与 z-index 冲突。`<div id="app" class="isolate"></div>`

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v4 重大新特性：纯 Vue 项目集成 ——

v3 只能在 Nuxt 项目用，v4 终于可以独立用在 Vue 3 + Vite + Inertia.js 项目里。

配置分两步：
第一步：vite.config.ts 加 ui() 插件（从 @nuxt/ui/vite 导入）。
ui() 插件负责自动 import 组件、自动注册 colorMode 等。
它还能配置：prefix（改组件前缀，默认 'U'）、colorMode（是否启用暗色，默认 true）。

第二步：main.ts 里 app.use(ui)（这个 ui 从 @nuxt/ui/vue-plugin 导入，
注意和 vite 插件是两个不同的包路径）。
关键细节：CSS 入口（main.css）必须在 createApp 之前 import。
而且 app.use(ui) 必须在 app.use(router) 等之后、app.mount 之前 ——
位置错了组件不渲染、主题不生效。

main.css 内容和 Nuxt 项目一样 —— @import "tailwindcss"; @import "@nuxt/ui";

[click] 最容易漏的一步：index.html 根 div 加 class="isolate" ——

<div id="app" class="isolate"></div>

为什么？isolate 是 Tailwind 的 CSS isolation 工具类，创建一个新的层叠上下文。
Nuxt UI 的 Overlay（Modal / Slideover / Tooltip）用 Portal 渲染，
依赖这个隔离来保证 z-index 不冲突。
漏了它，Modal 渲染位置会错乱、Overlay 层级会出问题。

这是 Vue 项目独有的踩坑点 —— Nuxt 项目 Nuxt UI 自动处理了。

还有一些 TypeScript 配置细节：
- tsconfig.app.json 要 include 自动生成的 auto-imports.d.ts 和 components.d.ts
- .gitignore 要忽略这两个生成文件
官方 ui-vue 模板都配好了，建议直接用模板起步。
-->

---
transition: fade-out
---

# UApp 包根 + 第一个组件

UButton / UForm + Zod，useToast 一把梭

<v-click>

```vue
<template>
  <UApp :locale="zhCn">
    <UButton color="primary" icon="i-lucide-bell" @click="notify">显示 Toast</UButton>
    <UForm :schema="schema" :state="state" @submit="onSubmit">
      <UFormField label="姓名" name="name">
        <UInput v-model="state.name" class="w-full" />
      </UFormField>
      <UButton type="submit" color="primary" block>提交</UButton>
    </UForm>
  </UApp>
</template>

<script setup lang="ts">
import { zhCn } from '@nuxt/ui/locale'
import * as z from 'zod'
const toast = useToast()                                  // 必须 setup 内
const schema = z.object({ name: z.string().min(2, '至少 2 字') })
const state = reactive<Partial<z.output<typeof schema>>>({ name: undefined })
const notify = () => toast.add({ title: '消息', color: 'info' })
const onSubmit = (e: any) => toast.add({ title: `欢迎 ${e.data.name}`, color: 'success' })
</script>
```

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这段代码浓缩了 Nuxt UI 的核心心智 —— 一页看懂整个使用范式。

关键概念 UApp Provider：

1. <UApp> 必须包根 —— 所有 Nuxt UI 组件都必须是它的子孙。
   UApp 内置 OverlayProvider + ToastProvider + TooltipProvider + LocaleProvider + 主题注入。

2. 不用 <UApp> 会怎样？—— <UButton> 等基础组件还能用，
   但 useToast() / useOverlay() / <UModal> / <UTooltip> 完全不工作。
   这是 Nuxt UI v4 最高频的踩坑。

3. i18n 通过 :locale prop 注入 —— 默认英文，中文要 import zhCn 并传入。

组件命名：所有组件以 U 开头（PascalCase）—— <UButton> / <UInput> / <UForm> / <UFormField>。
可以通过 prefix 配置改成别的前缀（比如 'Nuxt' → <NuxtButton>）。

UButton：color 接 7 个语义化别名之一（primary 等），icon 用 i-lucide-* 命名。
注意 UButton 的 type="submit" 配合 UForm 自动触发表单提交。

UForm + UFormField + UInput 是表单三件套：
- UForm 接 :schema（这里是 Zod）+ :state（响应式数据对象）
- UFormField 的 name 必须与 state 的字段名一致 —— 错误自动绑定到该字段
- UInput 用 v-model 双向绑定

useToast() 是 Composable，必须在 setup 内调用 —— 它依赖 UApp 注入的 ToastProvider。
toast.add({ title, color }) 弹出一条通知。

TypeScript：z.output<typeof schema> 从 Zod schema 推导出表单数据类型，
state 用 Partial 包裹（初始值都是 undefined）。
onSubmit 的 event.data 已经过 Zod 校验、类型就是 Schema。

注意 Nuxt 项目里 UButton / useToast / reactive 等都不需要 import ——
@nuxt/ui 自动注册。Vue 项目通过 @nuxt/ui/vite 插件也自动 import。
这里写 import 只是为了演示清楚来源。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# Tailwind CSS 4 必装

v4 强制 Tailwind 4 —— v3 → v4 最大破坏性变更之一

::left::

<v-click>

**Tailwind 3 vs Tailwind 4**

| 维度    | Tailwind 3            | Tailwind 4         |
| ------- | --------------------- | ------------------ |
| 入口    | `@tailwind` 三条指令  | **`@import`**      |
| 配置    | `tailwind.config.js`  | **CSS `@theme`**   |
| PostCSS | 必需                  | **可选**           |
| 引擎    | 中速                  | **Rust 极快**      |
| 主题变量| JS 对象               | **CSS variables**  |

</v-click>

::right::

<v-click>

**入口必须改为 `@import`**

```css
/* ❌ Tailwind 3 写法（v4 报错） */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ✅ Tailwind 4 + Nuxt UI */
@import "tailwindcss";
@import "@nuxt/ui";
```

> 💡 `@tailwind` 指令已废弃，`tailwind.config.js` 删除 —— 主题搬到 CSS 的 `@theme` 指令。

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Tailwind 4 是 Nuxt UI v4 的硬性前提 —— 必须理解它和 Tailwind 3 的区别。

Tailwind 4 是 2024-2025 的重大重写，五个核心变化：

1. 入口变了 —— Tailwind 3 用 @tailwind base / components / utilities 三条指令，
   Tailwind 4 改成一行 @import "tailwindcss"。

2. 配置方式变了 —— Tailwind 3 用 tailwind.config.js（JavaScript 对象），
   Tailwind 4 是「CSS-first」—— 配置写在 CSS 里，用 @theme 指令。
   tailwind.config.js 整个文件可以删掉。

3. PostCSS 从「必需」变「可选」—— Tailwind 4 内置了编译能力。

4. 引擎换成 Rust —— 构建速度大幅提升。

5. 主题变量从 JS 对象变成 CSS variables —— 比如 --color-blue-500，
   可以直接在 CSS 里 var() 引用。

[click] 对 Nuxt UI 项目最直接的影响：CSS 入口必须改写法。

如果你从 Tailwind 3 项目迁移过来，看到的是 @tailwind base; @tailwind components; @tailwind utilities;
这三条在 Tailwind 4 下会报错「Module @tailwind not found」。

必须改成：
@import "tailwindcss";
@import "@nuxt/ui";

注意这两行的顺序 —— tailwindcss 在前提供基础工具类，@nuxt/ui 在后覆盖 UI 主题。

已有 Tailwind 3 项目升级到 4 是有破坏性变更的：
- @tailwind directives → CSS imports
- tailwind.config.js → @theme 指令
- PostCSS 配置可能要调整
所以 v3 项目升级 Nuxt UI v4 工作量不小，要做好心理准备。
-->

---
transition: fade-out
---

# 主题语义化 7 色别名

7 个语义化别名映射到具体 Tailwind 颜色

<v-click>

| 别名 | 默认色 | 用途 | 别名 | 默认色 | 用途 |
| ---- | ------ | ---- | ---- | ------ | ---- |
| **primary** | green | 主 CTA / 品牌色 | **info** | blue | 信息提示 / 帮助 |
| **secondary** | blue | 次要按钮 / 辅助 | **warning** | yellow | 警告 / 待处理 |
| **success** | green | 成功 / 完成确认 | **error** | red | 错误 / 危险操作 |
| **neutral** | slate | 文本 / 边框 / 背景 / 禁用 |  |  |  |

</v-click>

<v-click>

```ts
// app.config.ts —— 修改语义化色，只能用 Tailwind 21 色或 @theme 自定义色
export default defineAppConfig({
  ui: { colors: { primary: 'blue', secondary: 'purple', neutral: 'zinc' } },
})
```

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Nuxt UI 主题的核心是「7 个语义化别名」——

这是一套抽象层：组件不直接引用具体颜色（red / blue），而是引用语义别名。
每个别名映射到一个具体的 Tailwind 颜色。

七个别名各有职责：
- primary：主色，主 CTA 按钮、激活状态、品牌色 —— 默认 green（Nuxt 绿）
- secondary：次色，次要按钮、辅助 UI —— 默认 blue
- success：成功，完成状态、正向确认 —— 默认 green
- info：信息，提示、Tooltip、帮助文本 —— 默认 blue
- warning：警告，待处理、需注意 —— 默认 yellow
- error：错误，校验错误、危险操作 —— 默认 red
- neutral：中性，文本、边框、背景、禁用态 —— 默认 slate

注意 primary 和 success 默认都是 green，secondary 和 info 默认都是 blue ——
但它们是独立的别名，你可以分别改。

为什么这么设计？因为「语义」比「颜色」稳定 ——
你可以把 primary 从绿改成蓝，所有用 color="primary" 的组件一起变，
代码里完全不用动。

[click] 修改语义化色在 app.config.ts 的 ui.colors 里 ——

只要写 colors: { primary: 'blue' }，主色就从绿变蓝。

约束：值只能是「Tailwind 默认的 21 个色」之一 ——
red / orange / amber / yellow / lime / green / emerald / teal / cyan /
sky / blue / indigo / violet / purple / fuchsia / pink / rose /
slate / gray / zinc / neutral / stone。
或者用 @theme 自定义的色（下面主题深度章节会讲）。

组件里用语义化色：<UButton color="primary"> / <UButton color="error"> ——
color prop 只接受这 7 个别名，不接受具体颜色名（不能写 color="red"）。

Vue 项目没有 app.config.ts，把 ui 配置写在 vite.config.ts 的 ui() 选项里。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 125+ 组件按 12 大类速览

记住分组即可快速定位组件

::left::

<v-click>

| 分组 | 代表组件 |
| ---- | -------- |
| **Layout（8）/ Element（16）** | App / Header / Button / Card / Icon |
| **Form（20）/ Data（9）/ Navigation（8）** | Form / Input / Table / Tabs |

</v-click>

::right::

<v-click>

| 分组 | 代表组件 |
| ---- | -------- |
| **Overlay（8）/ Page（23）** | Modal / Slideover / PageHero / AuthForm |
| **Dashboard / AI Chat / Editor / Content / Color Mode** | DashboardPanel / ChatPrompt / Editor |

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Nuxt UI 的 125+ 组件按 12 大类组织 —— 加上 i18n 分组的 1 个，总共 127 个组件。

左边六类是「通用组件」，几乎所有项目都用：
- Layout（8）：页面骨架 —— App（必须包根）、Container、Header、Sidebar
- Element（16）：基础元素 —— Button、Badge、Card、Alert、Icon、Avatar、Progress
- Form（20）：表单输入 —— Form、Input、Select、Checkbox、Switch、Slider、FileUpload
- Data（9）：数据展示 —— Table（核心）、Tree、Accordion、Timeline、Carousel
- Navigation（8）：导航 —— Tabs、Breadcrumb、Pagination、CommandPalette（Cmd+K）
- Overlay（8）：弹层 —— Modal、Slideover、Drawer、Popover、Tooltip、Toast

[click] 右边六类是「v4 新免费」的高级组件 —— 这是原本 Nuxt UI Pro 的付费内容：

- Page（23）：营销 / 落地页 —— PageHero（大图区）、PricingPlans（价格方案）、
  AuthForm（一行登录页）、BlogPost。这一类最多，专门做营销页。
- Dashboard（10）：中后台布局 —— DashboardSidebar、DashboardPanel、
  DashboardSearch（全局搜索）。整套搭中后台骨架。
- AI Chat（8）：AI 产品 UI —— ChatPrompt（输入框）、ChatMessage（消息）、
  ChatReasoning（推理过程展示）。配合 Vercel AI SDK 搭 ChatGPT 风格界面。
- Editor（6）：富文本编辑器 —— 基于 TipTap，含工具栏、@ 提及、/ 命令菜单。
- Content（5）：配合 Nuxt Content 的文档组件 —— 侧栏、TOC、搜索。
- Color Mode（5）：暗色切换组件 —— Button、Switch、Select 三种切换 UI。

i18n 分组只有 1 个 LocaleSelect（语言下拉选择）。

设计规律：高频组件 API 极简（Button 几个 prop 够用），
低频高级组件 API 完整（Table 基于 TanStack Table，几十个能力）。
按使用频次分配复杂度，是优秀组件库的共性。

记住分组比记住具体组件名更有用 —— 要做表格找 Data 类，
要做弹层找 Overlay 类，要做营销页找 Page 类。
-->

---
transition: fade-out
---

# UForm 深度（一）：Standard Schema + Zod

`:schema` + `:state` + `UFormField` 三要素

<v-click>

```vue
<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <UFormField label="姓名" name="name">
      <UInput v-model="state.name" class="w-full" />
    </UFormField>
    <UFormField label="邮箱" name="email" hint="必填" required>
      <UInput v-model="state.email" type="email" class="w-full" />
    </UFormField>
    <UButton type="submit" color="primary" block>提交</UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
const schema = z.object({ name: z.string().min(2, '至少 2 字'), email: z.string().email('邮箱格式不正确') })
type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({ name: undefined, email: undefined })
// onSubmit 的 event.data 已通过 Zod 校验、类型为 Schema
async function onSubmit(event: FormSubmitEvent<Schema>) { console.log(event.data) }
</script>
```

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] UForm 是 Nuxt UI 最复杂、最高频使用的组件 ——
企业后台 80% 的页面都是「表单 + 表格」组合。

三要素：
- :schema —— 校验规则（这里用 Zod，也可以 Valibot / Yup / Joi 等）
- :state —— 表单数据对象（必须 reactive）
- UFormField 的 name —— 字段名，必须与 state 的 key 一致

工作机制：
- UFormField 的 name="email" 与 state.email 字段名一致，
  校验失败时错误自动绑定到这个 FormField，在它下方渲染红色错误文字。
- UFormField 的 label / hint / description / required 自动渲染对应的 UI ——
  label 是字段标签、hint 是提示（label 右侧灰字）、
  description 是描述（输入框下方说明）、required 显示红星。

注意和 Element Plus 的差异：
- Element Plus 的 Form 用 :rules（async-validator 规则对象），
  Nuxt UI 用 :schema（Standard Schema 规范的 schema 对象）。
- Schema 方案的最大优势：类型推导。
  z.output<typeof schema> 直接从 Zod schema 推导出 TypeScript 类型，
  不用手写 interface。

提交事件 onSubmit 接收 FormSubmitEvent<Schema> ——
event.data 是已经通过 Zod 校验的数据，类型就是 Schema，IDE 完整补全。
拿到 event.data 直接 await api.create(event.data) 就行。

state 用 reactive<Partial<Schema>> —— Partial 因为初始值都是 undefined，
还没填完整。校验通过后 event.data 才是完整的 Schema 类型。

UInput 上的 class="w-full" 是让输入框撑满 —— Nuxt UI 组件默认不是 100% 宽。
-->

---
transition: fade-out
---

# UForm 深度（二）：多校验库 + 提交事件

Valibot / Yup / Joi 切换 + 程序化提交 + onError

<v-click>

**Standard Schema 支持五大校验库 —— API 统一，随时切换**

```ts
import * as z from 'zod'            // 最流行、生态最完整
const zodSchema = z.object({ age: z.number().min(18, '≥ 18') })

import * as v from 'valibot'        // 最轻量、tree-shaking 极佳
const valibotSchema = v.object({ age: v.pipe(v.number(), v.minValue(18)) })
```

</v-click>

<v-click>

**程序化提交 + 错误事件**

```ts
const form = useTemplateRef('form')
await form.value?.submit()          // 外部按钮触发校验 + 提交
await form.value?.validate()        // 仅校验
form.value?.clear()                 // 清空错误

const onError = (event: FormErrorEvent) => {            // 滚动到首个错误字段
  document.getElementById(event.errors[0]?.id)?.scrollIntoView({ block: 'center' })
}
```

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Standard Schema 让 UForm 支持五大主流校验库 —— 这是 Nuxt UI 表单的核心优势。

Standard Schema 是一个跨库的统一规范 ——
Zod、Valibot、Yup、Joi、Superstruct、Regle 都实现了它。
UForm 只要传 :schema，自动识别这是哪个库的 schema，统一处理。

各库对比：
- Zod：最流行、TS 优先、生态最完整 —— 默认选它
- Valibot：最轻量（比 Zod 小约 30 倍）、tree-shaking 极佳 —— 对包体积敏感选它
- Yup：经典老牌、文档丰富
- Joi：Hapi 生态、复杂校验强
- Superstruct：简洁 API
- Regle：Vue 专属、响应式校验

切换库只要换 schema 写法 —— UForm 用法完全不变。
比如从 Zod 换 Valibot：z.object 改 v.object，z.number().min(18) 改 v.pipe(v.number(), v.minValue(18))，
UForm 的 :schema 还是照传，onSubmit 还是照接。

注意：不用 schema 库也行 —— 可以传 :validate prop 写一个函数，
返回 FormError[] 数组。适合简单校验。

校验时机用 validateOn prop 控制 —— ['blur', 'change'] 等。
input 时机有 300ms 防抖，可以用 validate-on-input-delay 调。
但 submit 时始终校验，无论 validateOn 怎么设。

[click] 程序化提交 —— 用 useTemplateRef 拿 form 实例。

场景：表单在 Modal / Slideover 里，提交按钮在弹层底部（不在 UForm 内部）。
这时外部按钮 @click 调 form.value?.submit() ——
submit() 会触发 HTML5 校验 + schema 校验 + submit 事件。

其他实例方法：
- validate()：仅校验、不触发 submit，返回错误数组
- clear()：清空所有错误状态

错误事件 @error —— 校验失败时触发，event.errors 是 FormError 数组。
经典用法：滚动到第一个错误字段。
event.errors[0].id 是出错字段的 DOM id，
用 getElementById + scrollIntoView 滚过去，体验好。

v4 还有一些 Form 新特性：
- 嵌套表单必须加 nested prop（v3 是自动的）
- 数组字段的错误 path 是 tags.0 / tags.1，用 error-pattern 正则捕获
- schema transforms 只作用于 submit data、不再 mutate state
-->

---
transition: fade-out
---

# UTable 深度：基于 TanStack Table v8

`columns` 是 `TableColumn<T>` 的 JS 数组

<v-click>

```vue
<template>
  <UTable :data="data" :columns="columns" v-model:pagination="pagination" sticky />
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { h, resolveComponent } from 'vue'
const UBadge = resolveComponent('UBadge')           // columns 写在 script，需手动解析组件
interface Payment { id: string; user: string; amount: number; status: string }
const data = ref<Payment[]>([/* ... */])
const columns: TableColumn<Payment>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'amount', header: '金额', cell: ({ row }) => `¥${row.getValue('amount')}` },
  { accessorKey: 'status', header: '状态',
    cell: ({ row }) => h(UBadge, { color: 'success', variant: 'subtle' }, () => row.getValue('status')) },
]
const pagination = ref({ pageIndex: 0, pageSize: 10 })
</script>
```

</v-click>

<v-click>

> 💡 排序 / 筛选 / 行选 / 列固定 / 虚拟化全部内置：`v-model:sorting` / `v-model:row-selection` / `v-model:column-pinning` / `:virtualize`。

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] UTable 是 Nuxt UI 最强大的组件 —— 它基于 TanStack Table v8，
是 Vue UI 库中最强的表格实现。

TanStack Table 是业内最强的表格逻辑库（headless table），
排序、筛选、分页、行选、列固定、虚拟化、树形全部由它提供。
Nuxt UI 的 UTable 把它包装成有样式的 Vue 组件。

列定义方式：columns 是 TableColumn<T> 类型的 JS 数组 ——
不是 Element Plus 那种 <el-table-column> 子组件模板写法。

每个列对象的核心字段：
- accessorKey：关联 data 的字段名（必需）
- header：表头文字（字符串或返回 VNode 的函数）
- cell：单元格自定义渲染 —— 接收 { row } 上下文
  - 简单场景返回字符串：cell: ({ row }) => `¥${row.getValue('amount')}`
  - 复杂场景返回 VNode：用 h() 渲染任意组件，比如 UBadge

注意一个关键细节：在 columns 里渲染 Nuxt UI 组件，
要用 resolveComponent('UBadge') 拿到组件引用 ——
因为 columns 写在 script 里，不是 template，自动 import 不覆盖这里。
resolveComponent 在运行时从已注册组件里解析。

为什么用 JS 数组而不是模板？
- TypeScript 友好 —— TableColumn<Payment> 让每个列定义都有类型推导
- 动态列友好 —— 可以 filter / map / push 动态生成列
- 配置即代码 —— 列定义可以存到 store / localStorage（用户自定义列）

代价：写法比模板式更「程序员风」—— 模板派开发者上手陡。
但 Ant Design、Element Plus 的高级表格也在往这个方向走。

[click] UTable 的高级能力全部通过 v-model 暴露：
- v-model:sorting —— 排序状态
- v-model:column-filters —— 列筛选
- v-model:global-filter —— 全局搜索
- v-model:pagination —— 分页（pageIndex 从 0 开始）
- v-model:row-selection —— 行选（配合特殊的 select 列）
- v-model:column-pinning —— 列固定（left / right 数组）
- v-model:column-visibility —— 列可见性（隐藏列）
- v-model:expanded —— 可展开行

虚拟化用 :virtualize="{ enabled: true, rowHeight: 40 }" —— 10 万行也丝滑。
sticky 让表头固定。:loading 显示加载态，empty 自定义空状态文案。

踩坑：columns 必须是 TableColumn<T>[]，data 必须是数组 ——
传错会报 columns is required 或渲染空白。
-->

---
transition: fade-out
---

# Overlay 全套：Modal / Slideover / Drawer / Popover

全部基于 Reka UI primitives + Portal，`v-model:open` 统一控制

<v-click>

```vue
<template>
  <!-- UModal 模态对话框 -->
  <UModal v-model:open="open" title="确认操作" description="此操作不可撤销">
    <UButton label="打开 Modal" />
    <template #body><p>确定要删除这条记录吗？</p></template>
    <template #footer>
      <UButton color="neutral" variant="ghost" @click="open = false">取消</UButton>
      <UButton color="error" @click="confirm">确认删除</UButton>
    </template>
  </UModal>

  <!-- USlideover 抽屉：side 控制方向 -->
  <USlideover v-model:open="drawer" side="right" title="编辑用户">
    <UButton label="打开 Slideover" />
    <template #body>表单内容...</template>
  </USlideover>
</template>
```

</v-click>

<v-click>

> 💡 四件套统一规律：`v-model:open` 控制开关，`#body` / `#footer` 具名 slot 填内容；`UModal` 居中、`USlideover` 侧滑、`UDrawer` 移动端友好、`UPopover` 轻量浮层。

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Nuxt UI 的弹层全部基于 Reka UI primitives + Portal + Tailwind transitions ——
最大的优点是「API 高度统一」。

四件套：
- UModal —— 模态对话框，居中显示，背景遮罩
- USlideover —— 抽屉式弹层，从边缘滑入（side 控制 left/right/top/bottom）
- UDrawer —— 抽屉，Vaul 风格，动画更细腻，移动端友好
- UPopover —— 弹出气泡，轻量，跟随触发元素

统一规律：
1. 都用 v-model:open 控制开关 —— open 是 boolean ref
2. 都用具名 slot 填内容 —— #body 是主体、#footer 是底部按钮区
3. 默认 slot 放「触发元素」—— 比如 <UButton label="打开"> 写在组件标签内，
   它就是点击后打开弹层的按钮

UModal 的常用 props：
- title / description —— 标题和描述
- dismissible —— 点遮罩 / Esc 是否关闭（默认 true）
- fullscreen —— 全屏
- close —— 关闭按钮（默认 true）
- scrollable —— 内容可滚动

USlideover 的特殊 prop 是 side —— left / right / top / bottom，
默认 right。这是它和 UModal 的主要差异。

UDrawer 类似 Slideover 但动画是 Vaul 风格（可拖拽、有惯性），移动端体验更好。

注意 USlideover 里放表单时的技巧：
表单加 id（比如 id="user-form"），底部按钮用 type="submit" form="user-form"，
这样底部按钮（在 #footer slot，不在 UForm 内）也能触发表单提交。

UPopover 下一页会单独讲（有 hover / click 两种触发模式）。
UTooltip 也属于 Overlay 类 —— 但它必须在 UApp 内（UApp 内置 TooltipProvider）。

为什么基于 Reka UI 重要？因为 Reka UI 处理了焦点陷阱、Esc 关闭、
ARIA 属性、滚动锁定等所有 a11y 细节 —— 你不用操心。
-->

---
transition: fade-out
---

# useOverlay 程序化 API

`overlay.create()` + `await modal.open()` 返回 Promise

<v-click>

```vue
<!-- ConfirmModal.vue —— 自定义弹层组件，通过 emit('close', value) 返回结果 -->
<script setup lang="ts">
defineProps<{ title: string; description: string }>()
const emit = defineEmits<{ close: [confirmed: boolean] }>()
</script>
```

</v-click>

<v-click>

```ts
// 使用方 —— 创建一次，await 拿结果
import ConfirmModal from './ConfirmModal.vue'

const overlay = useOverlay()
const confirmModal = overlay.create(ConfirmModal)

async function handleDelete() {
  const result = await confirmModal.open({       // 打开并 await
    title: '确认删除',
    description: '此操作不可撤销，确定继续吗？',
  })
  if (result) await api.delete(id)                // 用户点了确认
}
```

</v-click>

<v-click>

> 💡 `useOverlay` 优势：Promise 返回结果、可传任意自定义组件、TypeScript 自动推导 props，避免一堆 `const open = ref(false)`。

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] useOverlay 是 Nuxt UI 弹层的「程序化打开」方案 ——
对比声明式（v-model:open + ref），它更优雅。

声明式的痛点：每个弹层都要 const open = ref(false)，
要监听结果还要再加 ref，多个弹层就一堆 ref，状态散落。

useOverlay 的思路：把弹层变成「函数调用」——
open() 返回 Promise，await 它直接拿到用户的选择结果。

第一步：写一个自定义弹层组件（这里是 ConfirmModal.vue）。
关键是它 defineEmits 一个 close 事件 —— close 携带一个值。
组件内部「确认」按钮 emit('close', true)，「取消」按钮 emit('close', false)。
这个 close 事件的值就是 open() 这个 Promise 最终 resolve 的结果。

[click] 第二步：使用方 ——

const overlay = useOverlay()  —— 拿到 overlay 管理器
const confirmModal = overlay.create(ConfirmModal)  —— 注册一次组件

然后在需要的地方：
const result = await confirmModal.open({ title, description })

open() 接收的对象会作为 props 传给 ConfirmModal。
await 会一直等到组件内部 emit('close', value)，
result 就是那个 value。

这样删除确认就是一行 await —— 比 ElMessageBox.confirm 更类型安全，
而且可以传任意自定义组件（不绑死某个 Modal 样式）。

[click] useOverlay 的四个优势：

1. Promise 返回 —— await modal.open(props) 直接拿结果，代码线性、好读
2. 任意自定义组件 —— 不绑死 UModal，可以传 USlideover、Drawer 等任何 Overlay
3. 类型安全 —— TypeScript 自动推导组件的 props 和 emit
4. 避免一堆 ref —— 不用 const open = ref(false)，状态由 overlay 管理器统一管

完整 API 还有：
- modal.close(value) —— 程序化关闭
- modal.patch({ ... }) —— 动态修改已打开弹层的 props
- modal.isOpen —— 响应式的打开状态

注意 useOverlay 也是 Composable，必须在 setup 内调用，且 UApp 必须包根。
-->

---
transition: fade-out
---

# useToast Composable

`toast.add()` 弹通知，全局可访问（含 Pinia store）

<v-click>

```ts
const toast = useToast()

toast.add({
  title: '保存成功',
  description: '用户信息已更新',
  color: 'success',                    // 7 个语义化别名之一
  icon: 'i-lucide-check-circle',
  duration: 3000,                      // ms，0 = 不自动关闭
  actions: [{ label: '撤销', click: () => undo() }],   // 操作按钮
})

toast.remove('my-toast')               // 删除单个（需创建时传 id）
toast.update('my-toast', { title: '新标题' })          // 更新
toast.clear()                          // 清空全部
```

</v-click>

<v-click>

```ts
// Pinia store 里也能用 —— 前提是整个 App 在 <UApp> 内
export const useUserStore = defineStore('user', () => {
  const toast = useToast()                              // setup store 内合法
  const login = async () => { toast.add({ title: '登录成功', color: 'success' }) }
  return { login }
})
```

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] useToast 是 Nuxt UI 的轻量通知 Composable ——
替代 v3 时代的全局 Toast API，与 Vue 3 Composition API 风格一致。

toast.add() 弹出一条通知，配置项：
- title —— 标题（粗体）
- description —— 描述（次要文字）
- color —— 7 个语义化别名之一（success / error / warning / info 等），
  决定通知的颜色和默认图标
- icon —— 自定义图标（i-lucide-* 命名）
- duration —— 显示时长，单位 ms；duration: 0 表示不自动关闭，必须用户手动关
- actions —— 操作按钮数组，每个有 label + click 回调
  经典场景：删除后弹「已删除 3 条记录」+「撤销」按钮

完整 API：
- toast.add(options) —— 添加（返回会带 id）
- toast.remove(id) —— 删除单个（需要创建时指定 id）
- toast.update(id, props) —— 更新已有 toast（比如把「上传中」改成「上传完成」）
- toast.clear() —— 清空全部
- const { toasts } = useToast() —— 读取当前所有 toast 的响应式数组

Toast 的全局位置、默认时长在 app.config.ts 的 toaster 字段配 ——
position（top-right 等）、expand（展开模式）、duration。

[click] useToast 的一个关键能力：全局可访问 —— 包括 Pinia store。

因为 Toast 通过 <UApp> 注入，只要整个 App 在 UApp 内，
任意组件、Pinia store、异步逻辑都能用 useToast()。

经典模式：在 Pinia store 的 action 里 ——
登录成功 toast.add 绿色提示，登录失败 toast.add 红色提示。
业务逻辑和反馈写在一起，组件里调 store.login() 就行。

但有个重要约束（下面踩坑章节会强调）：
useToast() 必须在「Composable 上下文」内调用 ——
- 组件 setup 内：OK
- Pinia setup store 的函数体内：OK（setup store 本身就是 Composable 上下文）
- Pinia store 顶层（defineStore 外）：报错
- Vue Router 守卫里：报错（不是 setup 上下文）

Router 守卫里要用 Toast，得通过 Pinia store 中转。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 主题深度：app.config.ts + 组件 ui prop

语义色 + 单组件覆盖 + Tailwind Variants slot

::left::

<v-click>

**app.config.ts 完整结构**

```ts
export default defineAppConfig({
  ui: {
    colors: {                  // 1. 语义化色别名
      primary: 'green',
      neutral: 'slate',
    },
    button: {                  // 2. 单组件主题覆盖
      slots: { base: 'font-medium rounded-lg' },
      defaultVariants: { size: 'md' },
    },
    theme: {                   // 3. 主题全局
      radius: 0.25,            // border-radius rem
    },
  },
})
```

</v-click>

::right::

<v-click>

**组件 ui prop —— 单次覆盖优先级最高**

```vue
<UButton
  color="primary"
  :ui="{
    base: 'rounded-xl shadow-lg',
    label: 'font-bold',
  }"
>
  自定义样式按钮
</UButton>
```

> 💡 样式覆盖只能通过 `ui` prop（Tailwind Variants 的 slot 覆盖）或 `app.config.ts` —— 不能直接写 CSS。`ui` prop 优先级高于 `app.config.ts`。

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Nuxt UI 的主题系统分两层 —— 全局（app.config.ts）和局部（组件 ui prop）。

app.config.ts 的 ui 字段有几个核心部分：

1. colors —— 7 个语义化色别名（前面讲过）。
   改 primary、neutral 等，全局所有组件一起变。

2. 单组件主题覆盖 —— 用组件名作为 key（button、input、table 等）。
   每个组件的样式由 Tailwind Variants（tv() 函数）定义，包含：
   - slots：组件内部的「区域」—— 比如 button 有 base（主容器）、
     label（文字）、leadingIcon（前置图标）等
   - variants：变体 —— size、color、variant 等
   - defaultVariants：默认变体值
   你可以覆盖任意 slot 的 class，或自定义新的 variant。

3. theme —— 全局主题配置，比如 radius（圆角，影响所有组件）、
   transitions（是否启用动画）。

Tailwind 4 的 @theme 自定义颜色也配合这套 ——
在 main.css 用 @theme static 定义 --color-brand-* 11 级色阶，
然后 app.config.ts 里 colors: { primary: 'brand' } 引用。

[click] 组件 ui prop —— 局部、单次覆盖。

每个 Nuxt UI 组件都接受一个 ui prop —— 它是一个对象，
key 是组件的 slot 名，value 是要追加的 Tailwind class。

比如 <UButton :ui="{ base: 'rounded-xl shadow-lg', label: 'font-bold' }">
就给这一个按钮的 base 区域加圆角和阴影，label 区域加粗体。

优先级：ui prop > app.config.ts。
ui prop 是「单次覆盖」—— 只影响这一个组件实例，不影响全局。

重点提示：Nuxt UI 的样式覆盖思维和 Element Plus 完全不同。
Element Plus 你可以直接写 CSS、用 :deep() 改样式。
Nuxt UI 推荐通过 ui prop / app.config.ts —— 因为它的样式是 Tailwind Variants 生成的，
直接写 CSS 覆盖容易和组件内部的 class 打架。
要查每个组件有哪些 slot，看官方文档每个组件的 Theme 一节。

IDE 提示：VSCode 装 Tailwind CSS IntelliSense 扩展，
settings.json 里 tailwindCSS.classAttributes 加 "ui"，
这样 ui prop 里的 Tailwind 类也能自动补全。
-->

---
transition: fade-out
---

# 图标：Lucide + Iconify 20 万图标

`i-lucide-*` 命名，任意 Iconify 集合可装

<v-click>

```vue
<template>
  <!-- UIcon 组件 -->
  <UIcon name="i-lucide-home" class="size-5" />

  <!-- 大部分组件含 icon prop -->
  <UButton icon="i-lucide-plus" label="新增" />
  <UInput leading-icon="i-lucide-search" placeholder="搜索..." />
</template>
```

</v-click>

<v-click>

**安装其他 Iconify 集合 —— 200,000+ 图标可选**

```bash
pnpm add @iconify-json/mdi             # Material Design Icons → i-mdi-*
pnpm add @iconify-json/simple-icons    # 品牌 logo → i-simple-icons-github
pnpm add @iconify-json/carbon          # IBM Carbon → i-carbon-*
```

</v-click>

<v-click>

> 💡 生产构建必须本地安装 `@iconify-json/*` 包 —— 否则会请求 Iconify CDN（性能差 + 离线不可用）；连默认的 Lucide 也建议显式装 `@iconify-json/lucide`。

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Nuxt UI 的图标系统基于 @nuxt/icon（自动注册）—— 默认用 Lucide 图标集。

Lucide 是 Feather Icons 的现代分支 —— 风格现代极简，是 Nuxt UI 的默认选择。
命名约定：i-lucide-* —— 比如 i-lucide-home、i-lucide-settings、i-lucide-search。

两种用法：
1. UIcon 组件 —— <UIcon name="i-lucide-home" class="size-5" />
   name 是图标名，class 控制大小（size-5 是 1.25rem）和颜色。
2. 组件的 icon prop —— 大部分 Nuxt UI 组件都有 icon 相关 prop：
   - UButton 的 icon —— 按钮图标
   - UButton 的 trailing-icon —— 后置图标（文字后面）
   - UInput 的 leading-icon —— 输入框前置图标
这种内置 prop 比手动塞 UIcon 更方便。

[click] 安装其他图标集 —— Nuxt UI 通过 Iconify 提供 200,000+ 图标。

Iconify 是一个图标聚合平台，收录了几乎所有主流图标集。
任何 Iconify 集合都可以装 —— pnpm add @iconify-json/{集合名}：
- @iconify-json/mdi —— Material Design Icons，用 i-mdi-*
- @iconify-json/simple-icons —— 品牌 logo（GitHub / Google / X 等），
  用 i-simple-icons-github 这种
- @iconify-json/carbon —— IBM Carbon，企业稳重风
- @iconify-json/heroicons —— Tailwind 官方风格
- @iconify-json/tabler、@iconify-json/ph（Phosphor）等等

装好直接用 —— <UIcon name="i-mdi-home" />，前缀对应集合名。

想浏览所有图标，去 icones.js.org —— Iconify 20 万图标在线搜索。

还可以自定义本地 SVG 图标 —— nuxt.config.ts 的 icon.customCollections
配置一个目录，把 SVG 放进去，用 i-custom-xxx 引用。

[click] 重要踩坑：生产构建必须本地安装 @iconify-json/* 包。

如果不装，Nuxt UI 运行时会去请求 Iconify 的 CDN 拉图标 ——
性能差、而且离线环境（内网）完全不可用。

连默认的 Lucide 都建议显式 pnpm add @iconify-json/lucide ——
因为 pnpm 严格依赖隔离下，@nuxt/icon 有时找不到自动安装的 Lucide 包，
图标会空白。这个坑和我们项目里 UnoCSS carbon 图标的坑是同一类问题。
-->

---
transition: fade-out
---

# 暗色模式

`<html class="dark">` 类驱动，`useColorMode` 切换

<v-click>

**现成组件（Nuxt 项目自动注册 @nuxtjs/color-mode）**

```vue
<template>
  <UColorModeButton />      <!-- 一键切换按钮 -->
  <UColorModeSwitch />      <!-- 开关 -->
  <UColorModeSelect />      <!-- 下拉：light / dark / system -->
</template>
```

</v-click>

<v-click>

**自定义切换 UI —— useColorMode Composable**

```vue
<template>
  <ClientOnly>
    <UButton :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'" variant="ghost" @click="toggle" />
  </ClientOnly>
</template>
<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const toggle = () => { colorMode.preference = isDark.value ? 'light' : 'dark' }
</script>
```

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Nuxt UI 的暗色模式用「<html class="dark"> 类名驱动」——
这是 Tailwind 4 的 darkMode: 'class' 模式。

注意这和 Naive UI 完全不同 —— Naive UI 用 <n-config-provider :theme="darkTheme">
（JS 对象切换），Nuxt UI 用 HTML class。两者不兼容。

Nuxt 项目里暗色模式是「自动」的 —— Nuxt UI 自动注册 @nuxtjs/color-mode 模块，
无需任何配置，自动支持：
- prefers-color-scheme: dark 跟随系统
- localStorage 持久化（重开浏览器记住选择）

最简单的用法是直接用三个现成组件：
- UColorModeButton —— 一键切换按钮（点一下亮↔暗）
- UColorModeSwitch —— 切换开关样式
- UColorModeSelect —— 下拉选择，有 light / dark / system 三个选项
塞到 Header 里就行，零代码。

[click] 想自定义切换 UI，用 useColorMode() Composable。

colorMode.value —— 当前实际生效的主题（'light' | 'dark'，响应式）
colorMode.preference —— 用户偏好（'light' | 'dark' | 'system'）
colorMode.system —— 系统主题

切换就是改 colorMode.preference：
- 设为 'dark' / 'light' —— 强制某个主题
- 设为 'system' —— 跟随系统
preference 自动持久化到 localStorage。

注意代码里用了 <ClientOnly> 包裹 ——
这是为了避免 SSR hydration mismatch。
服务端渲染时不知道客户端的主题偏好（localStorage 在客户端），
如果服务端渲染太阳图标、客户端是暗色应该是月亮图标，就会 hydration 不匹配。
<ClientOnly> 让这部分只在客户端渲染，规避问题。

Vue 项目里：@nuxt/ui/vue-plugin 内置 useColorMode，默认开启暗色支持。
如果不需要暗色模式，vite.config.ts 的 ui() 里设 colorMode: false 关闭。

踩坑：Vue 项目 v4 默认 colorMode: true ——
如果发现页面默认就是暗色，那是跟随了系统的 prefer-color-scheme，
不想要就 colorMode: false 完全禁用。
-->

---
transition: fade-out
---

# 国际化：50+ 语言 + RTL

`@nuxt/ui/locale` import + `<UApp :locale>`

<v-click>

```vue
<template>
  <UApp :locale="currentLocale"><NuxtPage /></UApp>
</template>

<script setup lang="ts">
import { en, zhCn } from '@nuxt/ui/locale'
const currentLang = ref<'zh' | 'en'>('zh')
// locale 控制组件内置文案（分页 / 空状态等），切换语言改 currentLang 即可
const currentLocale = computed(() => (currentLang.value === 'zh' ? zhCn : en))
</script>
```

</v-click>

<v-click>

**50+ 语言 + RTL 双向**

| 语言     | locale | 方向 | 语言     | locale | 方向    |
| -------- | ------ | ---- | -------- | ------ | ------- |
| 简体中文 | `zhCn` | ltr  | 阿拉伯文 | `ar`   | **rtl** |
| 英文     | `en`   | ltr  | 希伯来文 | `he`   | **rtl** |

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Nuxt UI 内置 50+ 语言包 —— 国内项目必须切到中文（默认是英文）。

国际化方案非常简单：
- 从 @nuxt/ui/locale import 语言包 —— 比如 zhCn（简体中文）、en（英文）
- 传给 <UApp> 的 :locale prop

locale 控制的是「组件内置文案」—— 比如分页器的「上一页」、
表格的空状态、CommandPalette 的「无匹配」等。不是你的业务文案。

动态切换语言：用 computed 根据当前语言状态返回不同 locale，
切换时改状态，UApp 的 :locale 跟着变。

[click] 50+ 语言 + RTL 双向 —— 这是 Nuxt UI 比 Naive UI 更国际化的地方。

常用语言：
- 简体中文 zhCn、繁体中文 zhTw、英文 en（默认）
- 日文 ja、韩文 ko、法文 fr、德文 de、西班牙文 es、俄文 ru 等等

RTL（从右到左）语言是亮点：
- 阿拉伯文 ar、希伯来文 he、波斯文 fa、乌尔都文 ur
当 locale 是 RTL 语言时，UApp 自动给根元素加 dir="rtl"，
整个布局自动镜像 —— 文字方向、图标位置、间距全部反过来。
这对面向中东市场的产品很重要。

还可以自定义 locale —— 用 defineLocale 完全自定义，
或 extendLocale 扩展现有 locale（只改个别文案）。

和 Nuxt i18n 模块集成：
如果项目用 @nuxtjs/i18n 管业务文案，
让 UApp 的 :locale 跟着 useI18n() 的 locale 走 ——
业务文案和组件文案同步切换。

ULocaleSelect 组件是现成的语言下拉选择器，自动绑 Nuxt i18n。
-->

---
transition: fade-out
---

# AI Chat 组件（v4 新）

`UChatPrompt` / `UChatMessage` + AI SDK v5

<v-click>

```vue
<template>
  <UChatMessages :messages="chat.messages">
    <template #message="{ message }">
      <UChatMessage :role="message.role" :content="message.content" />
    </template>
  </UChatMessages>
  <UChatPrompt v-model="input" @submit="onSubmit">
    <UChatPromptSubmit :status="chat.status" :disabled="!input.trim()" />
  </UChatPrompt>
</template>
<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'                  // v4 用 Chat 类（v3 是 useChat()）
const input = ref('')
const chat = new Chat({ api: '/api/chat' })         // api 指向流式聊天后端
async function onSubmit() {
  await chat.sendMessage({ text: input.value })
  input.value = ''
}
</script>
```

</v-click>

<v-click>

> 💡 还有 `UChatReasoning`（推理过程展示，适配 GPT-o1 / Claude reasoning）、`UChatTool`（工具调用展示）、`UChatShimmer`（加载骨架屏）。

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] AI Chat 组件是 Nuxt UI v4 的全新分组 —— 8 个组件专门做 AI 产品 UI。

这是其他三大 Vue UI 库（Element Plus / Naive UI / Vuetify）都没有的。
Nuxt UI 抓住了 AI 时代的需求 —— 配合 Vercel AI SDK v5，
可以直接搭出 ChatGPT 风格的对话界面。

核心组件：
- UChatMessages —— 消息列表容器，自动滚动到底部
- UChatMessage —— 单条消息，role 区分 user / assistant / system
- UChatPrompt —— 底部输入框（含 send 按钮、上传、模型选择）
- UChatPromptSubmit —— 提交按钮，status 自动控制 loading 状态

代码逻辑：
new Chat({ api: '/api/chat' }) —— 创建一个 Chat 实例，
api 指向你的后端聊天接口（流式返回 AI 响应）。
chat.messages 是响应式的消息数组，chat.status 是当前状态。
chat.sendMessage({ text }) 发送一条用户消息，
AI 的流式响应会自动追加到 chat.messages。

注意 v4 的重要变化：v3 是 useChat() Composable，v4 改成 new Chat() 类。
v4 配合的是 AI SDK v5（Vercel 的 ai 包升级到 v5）。
Message 结构也从 message.content 改成 message.parts。

[click] 其他 AI Chat 组件：

- UChatReasoning —— 推理过程展示。
  适用于 GPT-o1、Claude Sonnet 这种 reasoning 模型 ——
  把模型的「思考过程」单独展示出来（可折叠）。

- UChatTool —— 工具调用展示。
  展示 AI 的 function calling / MCP 工具调用详情 ——
  工具名、输入参数、输出结果、调用状态。

- UChatShimmer —— 加载中的骨架屏，AI 还在生成时显示。

- UChatPalette —— 聊天命令面板。

官方还有现成的 AI Chat 起步模板：
npm create nuxt@latest -- --no-modules -t ui-vue/chat ——
一行命令拿到含 UChatPrompt + AI SDK v5 的完整对话应用骨架。

对 AI 产品开发者来说，这套组件比手写省 90% 的 UI 工作。
但注意：AI Chat 组件依赖 Vercel AI SDK 等外部包 ——
单装 @nuxt/ui 这部分组件无法独立工作。
-->

---
transition: fade-out
---

# Dashboard 模板 + UAuthForm（v4 新）

原 Pro 付费内容，v4 起免费开源

<v-click>

**Dashboard 全套布局**

```vue
<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible resizable>
      <UNavigationMenu :items="links" orientation="vertical" />
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />        <!-- Cmd+K 全局搜索 -->

    <UDashboardPanel id="home">
      <template #header><UDashboardNavbar title="仪表盘" /></template>
      <template #body><div class="grid gap-4 lg:grid-cols-4"><!-- 内容 --></div></template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
```

</v-click>

<v-click>

> 💡 `<UAuthForm>` 一行实现登录页 —— 含 Email / Password 字段 + 社交登录按钮（Google / GitHub / Apple）。完整模板：`npm create nuxt@latest -- -t ui-vue/dashboard`。

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Dashboard 模板是 v4 免费的「重磅赠品」—— 这是原本 Nuxt UI Pro 的付费内容。

v3 时代要做中后台 Dashboard，要么自己拼，要么买 Nuxt UI Pro（$249）。
v4 把整套 Dashboard 组件（10 个）合并进 @nuxt/ui，完全免费。

Dashboard 全套布局组件：
- UDashboardGroup —— 根容器，包住整个 Dashboard
- UDashboardSidebar —— 侧边栏，collapsible（可折叠）、resizable（可调宽）
- UDashboardSidebarCollapse / Toggle —— 折叠按钮
- UDashboardNavbar —— 顶部导航栏
- UDashboardPanel —— 主面板（内容区）
- UDashboardToolbar —— 工具栏（放 filter、actions）
- UDashboardSearch —— 全局搜索（Cmd+K 命令面板风格）
- UDashboardResizeHandle —— 可拖拽调整分栏宽度

典型结构（代码示例）：
UDashboardGroup 里放 UDashboardSidebar（侧栏）+ UDashboardSearch（搜索）
+ UDashboardPanel（主面板）。
Panel 用 #header / #body 具名 slot 分区 ——
header 放 Navbar 和 Toolbar，body 放实际内容（栅格布局）。
侧栏里塞 UNavigationMenu，orientation="vertical" 纵向菜单。

侧栏的折叠状态、宽度可以用 useState 持久化（resize-storage）。

[click] UAuthForm —— 一行实现登录页。

UAuthForm 是 Page 分组里的组件，专门做 SaaS 产品的登录 / 注册页。

传几个 prop 就搭好整个登录页：
- :schema —— Zod 校验（邮箱、密码）
- :fields —— 字段定义（email 文本框、password 密码框）
- :providers —— 社交登录按钮（Google / GitHub / Apple / Twitter，
  配 icon 和 onClick OAuth 回调）
- title / description / icon —— 页面标题、描述、图标

UAuthForm 自动渲染出：标题区 + 字段 + 提交按钮 + 社交登录按钮 + 分隔线。
还有 #footer slot 放「服务条款」链接等。

这是 SaaS 产品起步神器 —— 登录页这种「每个项目都要写一遍」的页面，
现在一个组件搞定。

官方有完整 Dashboard 起步模板：
npm create nuxt@latest -- --no-modules -t ui-vue/dashboard ——
一行命令拿到完整中后台骨架（侧栏 + 全套 Dashboard 组件）。

注意：部分 Page 组件（如 UPricingPlans 配 Stripe、UAuthForm 配 OAuth provider）
完整 SaaS 上线仍需付费第三方服务 —— 组件免费，但支付 / 认证服务另算。
-->

---
transition: fade-out
---

# 与 Vue Router + Pinia 集成

纯 Vue 项目零冲突，`app.use(ui)` 在 `mount` 前

<v-click>

```ts
// src/main.ts —— 插件顺序：router / pinia 在前，ui 在 mount 前
import ui from '@nuxt/ui/vue-plugin'
import './assets/css/main.css'
const app = createApp(App)
app.use(router)         // Vue Router
app.use(createPinia())  // Pinia
app.use(ui)             // Nuxt UI，必须在 mount 之前
app.mount('#app')
```

</v-click>

<v-click>

```vue
<!-- App.vue —— UNavigationMenu 的 to 自动接 Vue Router -->
<template>
  <UApp :locale="zhCn">
    <UNavigationMenu :items="navItems" />
    <RouterView />
  </UApp>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
// 菜单项的 to 自动通过 ULink 包装，支持 Vue Router 跳转
const navItems: NavigationMenuItem[] = [{ label: '首页', icon: 'i-lucide-home', to: '/' }]
</script>
```

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 纯 Vue 项目里，Nuxt UI + Vue Router + Pinia 一起用零冲突 ——
但插件注册顺序有讲究。

main.ts 的关键点：
- import './assets/css/main.css' —— CSS 入口必须 import，且在 createApp 之前
- app.use(router) / app.use(createPinia()) —— router 和 pinia 先注册
- app.use(ui) —— Nuxt UI 插件必须在 router / pinia 之后、mount 之前
- app.mount('#app') —— 最后挂载

为什么 app.use(ui) 的位置重要？
如果 ui 插件注册在 mount 之后，组件不渲染、主题不生效。
如果在 router 之前，ULink / 导航相关组件拿不到 router 上下文。
所以记住：router、pinia 先，ui 在它们之后、mount 之前。

[click] App.vue 里和 Vue Router 的集成 ——

UNavigationMenu 是导航菜单组件，用 :items 数组定义菜单项（不是 slot）。
每个菜单项是 NavigationMenuItem 类型：
- label —— 文字
- icon —— 图标
- to —— 路由路径

关键：菜单项的 to 会自动通过 <ULink> 包装 ——
ULink 是 Nuxt UI 的智能链接组件，自动判断：
- 有 to → 渲染成 router-link（Vue Router 导航）
- 有 href / external → 渲染成 <a> 标签

所以 UNavigationMenu 的 to 天然支持 Vue Router，
点击菜单项自动路由跳转、当前路由对应的菜单项自动高亮。

NavigationMenuItem 类型从 @nuxt/ui import —— 完整 TS 推导。

Pinia 集成：Pinia store 里可以用 useToast()、useColorMode() 等
Nuxt UI Composable（setup store 内合法）—— 前面 useToast 章节讲过。

Nuxt 项目更简单 —— Nuxt 自带 router 和（可选）Pinia 模块，
Nuxt UI 作为模块自动集成，不用手动 app.use。

defineShortcuts 是 Nuxt UI 提供的全局快捷键 Composable ——
meta_k 注册 Cmd+K（自动跨平台 Mac Cmd / Windows Ctrl），
配合 UCommandPalette 做命令面板。
-->

---
transition: fade-out
---

# v3 到 v4 迁移要点

六个破坏性变更，v3 项目升级前必读

<v-click>

| 变更               | v3                          | v4                              |
| ------------------ | --------------------------- | ------------------------------- |
| **包结构**         | `@nuxt/ui` + `@nuxt/ui-pro` | 合并为 `@nuxt/ui` 一个包        |
| **Tailwind**       | 兼容 Tailwind 3             | **强制 Tailwind 4**             |
| **CSS 入口**       | `@tailwind` 三条指令        | `@import "tailwindcss"`         |
| **ButtonGroup**    | `<UButtonGroup>`            | `<UFieldGroup>` 改名            |
| **PageAccordion**  | `<UPageAccordion>`          | 移除（用 `<UAccordion>`）       |
| **AI 集成**        | `useChat()` Composable      | `new Chat()` 类 + AI SDK v5     |

</v-click>

<v-click>

> 💡 还有：嵌套 Form 必须加 `nested` prop（v3 自动）/ `v-model.nullify` 改 `v-model.nullable` / `<MDC>` 改名 `<Comark>` / Nuxt 项目必须先升级到 Nuxt 4。

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v3 → v4 是一次大重写 —— v3 项目升级前必须了解这六个破坏性变更。

1. 包结构合并 ——
   v3 是两个包：@nuxt/ui（免费）+ @nuxt/ui-pro（付费）。
   v4 合并成一个 @nuxt/ui。
   迁移：pnpm remove @nuxt/ui @nuxt/ui-pro，然后 pnpm add @nuxt/ui。
   nuxt.config.ts 的 modules 从 ['@nuxt/ui', '@nuxt/ui-pro'] 改成 ['@nuxt/ui']。

2. 强制 Tailwind 4 ——
   v3 还兼容 Tailwind 3，v4 必须 Tailwind 4。
   这是工作量最大的一项 —— 涉及 Tailwind 自身的迁移。

3. CSS 入口 ——
   @tailwind base/components/utilities 三条指令改成 @import "tailwindcss"。
   main.css 里还要把 @import "@nuxt/ui-pro" 删掉（Pro 合并了）。
   tailwind.config.js 整个删除，主题搬到 CSS 的 @theme 指令。

4. 组件改名 ——
   <UButtonGroup> 改名 <UFieldGroup>。
   升级后如果报 "Failed to resolve component: UButtonGroup"，就是这个原因。

5. PageAccordion 移除 ——
   <UPageAccordion> 没了，用 <UAccordion> 代替。
   <UPageMarquee> 也改名成 <UMarquee>。

6. AI 集成升级 ——
   v3 是 useChat() Composable，v4 是 new Chat() 类。
   配合的 AI SDK 从 v4 升到 v5。
   Message 结构从 message.content 改成 message.parts。

[click] 其他零散变更：

- 嵌套表单：v3 嵌套 UForm 是自动识别的，v4 必须显式加 nested prop。

- Form 修饰符：v-model.nullify 改名 v-model.nullable。
  v4 还新增了 optional 修饰符（把空值转成 undefined）。
  另外 schema transforms 在 v4 只作用于 submit data，不再 mutate state。

- <MDC> 组件（Markdown 渲染）改名 <Comark>。

- Nuxt 项目的硬前提：v4 必须 Nuxt 4。
  Nuxt 3 项目不能直接用 Nuxt UI v4，要先把 Nuxt 框架升级到 v4。
  如果暂时升不了 Nuxt，只能继续用 Nuxt UI v3.x（但 v3 已停止新特性开发）。

总结：v3 → v4 工作量不小，特别是 Tailwind 3→4 + Nuxt 3→4 两个底层升级。
但 v4 带来的 Pro 免费 + 纯 Vue 支持 + 更现代的技术栈，长期看值得迁移。
详细迁移清单看官方 v4 迁移文档。
-->

---
transition: fade-out
---

# 常见踩坑

Tailwind 4 必装 / Nuxt 4 必须 / UApp 包根 / isolate 类

<v-clicks>

- **`<UApp>` 没包根** → `useToast()` / `useOverlay()` / `<UModal>` / `<UTooltip>` 全部失效。所有 Nuxt UI 组件必须是 UApp 子孙。
- **Vue 项目 `class="isolate"` 没加** → Modal 渲染位置错乱、Overlay 与 z-index 冲突。`<div id="app" class="isolate">`。
- **Tailwind 4 没装 / `@tailwind` 没改** → 样式全失效或报 `Module @tailwind not found`。改用 `@import "tailwindcss"`。
- **Nuxt 项目没升 Nuxt 4** → Nuxt UI v4 必须 Nuxt 4，Nuxt 3 只能用 Nuxt UI v3.x。
- **Pinia store 顶层 / Router 守卫调 `useToast()`** → 报 `No active instance`。Composable 必须在 setup 上下文（setup store 函数体内合法）。
- **`i-lucide-*` 图标空白** → pnpm 隔离下找不到图标包。显式 `pnpm add @iconify-json/lucide`。
- **主题色不生效** → `@theme` 自定义色必须在 `app.config.ts` 的 `ui.colors` 中映射。
- **`UButtonGroup` 报 unknown component** → v4 改名 `<UFieldGroup>`。

</v-clicks>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] UApp 没包根 —— 这是 Nuxt UI v4 的头号踩坑。
症状：useToast() / useOverlay() / <UModal> / <UTooltip> 完全不工作。
原因：UApp 内置 OverlayProvider + ToastProvider + TooltipProvider。
不包根，这些 Provider 不存在，相关组件和 Composable 全失效。
解决：app.vue / App.vue 一定用 <UApp> 包住根路由出口。
注意 <UButton> 等基础组件不包 UApp 还能用 —— 所以容易漏，
直到用 Toast / Modal 才发现。

[click] Vue 项目 class="isolate" 没加 ——
症状：Modal 渲染位置错乱、Overlay 层级冲突。
原因：Tailwind 4 的 isolate 工具类创建层叠上下文，
Overlay 的 Portal 渲染依赖它保证 z-index 正确。
解决：index.html 里 <div id="app" class="isolate">。
这是 Vue 项目独有的 —— Nuxt 项目自动处理了。

[click] Tailwind 4 没装 / @tailwind 没改 ——
症状：所有样式失效，或构建报 Module @tailwind not found。
原因：v4 必须 Tailwind 4，@tailwind 三条指令已废弃。
解决：pnpm add tailwindcss@latest，CSS 入口改 @import "tailwindcss"; @import "@nuxt/ui";

[click] Nuxt 项目没升 Nuxt 4 ——
Nuxt UI v4 硬依赖 Nuxt 4。Nuxt 3 项目装 Nuxt UI v4 会出问题。
要么升级 Nuxt 框架到 v4，要么继续用 Nuxt UI v3.x。

[click] Pinia store 顶层 / Router 守卫调 useToast() ——
症状：报 No active instance found，Toast 不显示。
原因：Composable 必须在「组件 setup 上下文」内调用。
- 组件 setup 内：OK
- Pinia setup store 的函数体内：OK（setup store 本身是 Composable 上下文）
- Pinia store 顶层（defineStore 外，模块顶层）：报错
- Vue Router 守卫（beforeEach 等）：报错
解决：Router 守卫里要用 Toast，通过 Pinia store 中转。

[click] i-lucide-* 图标空白 ——
原因：pnpm 严格依赖隔离下，@nuxt/icon 找不到自动安装的 @iconify-json/lucide；
或离线环境无法访问 Iconify CDN。
解决：显式 pnpm add @iconify-json/lucide。
这和我们项目 CLAUDE.md 里 UnoCSS carbon 图标的坑是同一类 pnpm monorepo 问题。

[click] 主题色不生效 ——
症状：<UButton color="primary"> 还是默认绿。
原因：在 main.css 用 @theme 定义了 --color-brand-* 自定义色，
但忘了在 app.config.ts 的 ui.colors 里把 primary 映射成 'brand'。
解决：两步都要做 —— @theme 定义 + app.config.ts 映射。

[click] UButtonGroup 报 unknown component ——
症状：Failed to resolve component: UButtonGroup。
原因：v4 改名 <UFieldGroup>。
解决：全局把 <UButtonGroup> 替换成 <UFieldGroup>。

补充一个 Vue 项目的坑：main.ts 里 app.use(ui) 的位置 ——
必须在 app.use(router) 之后、app.mount 之前，位置错了组件不渲染。
-->

---
transition: fade-out
---

# 评价

Nuxt 官方背书 / Tailwind 现代 / a11y 优秀，但中文生态起步

<v-clicks>

**优点**

- Nuxt 官方钦定 + Vercel 资源加持，长期维护有保障
- v4 重磅：原 $249 的 Pro 完全免费开源，125+ 组件全套
- 基于 Reka UI，所有组件天然 a11y 优秀（WAI-ARIA / 键盘 / Screen Reader）
- Standard Schema 表单校验 + TanStack Table 表格 + TypeScript 极致
- AI Chat 组件 + Dashboard 模板（v4 新），AI 时代的独家优势
- v4 支持纯 Vue 项目，不再绑死 Nuxt

**缺点**

- v3 → v4 破坏性变更大，迁移工作量不小（Tailwind 3→4 + Nuxt 3→4）
- 国内招聘市场 / 中文教程 / 解决方案储备极少，遇坑靠英文文档
- 样式覆盖只能走 `ui` prop / `app.config.ts`，思维不同于 SCSS
- 绑死 Tailwind 风格美学，要 Material / Ant 风格需深度主题化

</v-clicks>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Nuxt UI 的优点很集中 —— 「Nuxt 官方 + Tailwind 现代 + a11y 优秀 + AI 时代」——

Nuxt 官方背书是最大的护城河 —— Nuxt 核心团队亲自维护，
加上 2025 年 NuxtLabs 被 Vercel 收购，有专职团队 + 商业资源，
长期维护比依赖个人维护者的项目更有保障。

v4 的 Pro 免费是真金白银的红利 —— 原本 $249 的 Dashboard / Page / AuthForm /
ChatPrompt 等 80+ 高级组件，现在全部免费开源。

基于 Reka UI 让所有组件天然 a11y 优秀 —— WAI-ARIA 合规、键盘导航、
焦点管理、Screen Reader 支持全部内置。这是 Element Plus 历史遗留弱项无法比的。

Standard Schema 表单校验（多库统一接口）+ TanStack Table 表格（业内最强）
+ TypeScript 极致（Vue Generics、Volar 体验最好）—— 技术栈现代。

AI Chat 组件 + Dashboard 模板是 v4 独家 —— 其他三大 Vue UI 库都没有。
在 AI 产品爆发的时代，这是差异化优势。

v4 支持纯 Vue 项目 —— 不再绑死 Nuxt，可以作为 Element Plus / Naive UI 的
现代替代用在任何 Vue 3 + Vite 项目里。

[click] 缺点也很明确：

v3 → v4 破坏性变更大 —— v3 只有一年寿命就被重写。
迁移涉及 Tailwind 3→4 和 Nuxt 3→4 两个底层升级，工作量不小。

中文生态是最大短板 —— 国内招聘市场 Nuxt UI 起步阶段，
对比 Element Plus 国内 70%+ 市占率差距巨大。
中文教程、掘金 / 知乎 / B 站的解决方案几乎为零，遇到问题完全靠英文官方文档
+ GitHub Discussion。

样式覆盖思维不同 —— 只能通过 ui prop / app.config.ts，
不像 Element Plus 可以直接写 SCSS 覆盖。习惯 SCSS 的团队要转变思维。

绑死 Tailwind 风格美学 —— 设计语言是 Tailwind 默认 + Vercel 美学。
想要 Material Design / Ant Design 风格的团队，需要深度主题化或选其他库。

还有：组件 API 偏函数式 / TS 重（UTable 的 columns 是 JS 对象数组），
模板派开发者上手陡；部分 Pro 组件依赖 Nuxt Content / AI SDK 等外部包。

选型逻辑：
- Nuxt 全栈 / Tailwind 派 / AI 产品 / 设计驱动 SaaS → Nuxt UI
- 国内招聘市场 / 接手已有 Element Plus 项目 / 中文生态 → Element Plus
- 严格 Material Design → Vuetify
- 不接受 Tailwind 但要设计感 → Naive UI
-->

---
transition: fade-out
---

# 学习路径

从入门到熟练应用的 4 个阶段

<v-click>

**第 1 周：安装 + 核心组件**

- 用 `npm create nuxt@latest -t ui` 起步，理解 UApp 包根 + Tailwind 4 + main.css 两行
- 熟练 Element + Form 组件，实现 CRUD 页面（UTable + UForm + UModal 三件套）

</v-click>

<v-click>

**第 2 周：Overlay + Composable**

- 熟练 useToast / useOverlay 程序化 API，Modal / Slideover / Drawer 全套

</v-click>

<v-click>

**第 3-4 周：主题 + 企业级整合**

- 跑通 app.config.ts + Tailwind 4 `@theme` + 组件 ui prop 覆盖
- 接入 Vue Router + Pinia，跑通 Dashboard 模板 + i18n + 暗色模式

</v-click>

<v-click>

**长期**：深入 Reka UI primitives，理解 Tailwind Variants 样式系统

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 第一周打基础 ——

强烈建议用官方模板起步：npm create nuxt@latest -t ui ——
这个模板含 Nuxt UI v4 + Tailwind 4 + 完整配置，新手零踩坑。

第一周要吃透三个核心概念：
- UApp 必须包根 —— 否则 Toast / Overlay 失效
- Tailwind 4 是硬前提 —— 理解 @import 入口、@theme 配置
- main.css 两行 import 不能漏、顺序不能错

然后熟练 Element 类（Button / Card / Badge）和 Form 类（Input / Select / Checkbox）。
完成一个 CRUD 页面就算入门 ——
UTable 展示数据 + UForm 编辑 + UModal 承载弹窗 + useToast 反馈。

[click] 第二周进阶 ——

Overlay 全套 + Composable 是 Nuxt UI 的核心能力。
重点掌握 useOverlay 的程序化 API —— await modal.open() 返回 Promise，
这是比声明式 v-model:open 更优雅的方式。
区分 Modal（居中）/ Slideover（侧滑）/ Drawer（移动端）/ Popover（轻量）的适用场景。

[click] 第三到四周企业级整合 ——

主题系统是分水岭 ——
能完整跑通 app.config.ts 配置 + Tailwind 4 @theme 自定义色 +
组件 ui prop 局部覆盖，就掌握了 Nuxt UI 的样式体系。

单独的 Nuxt UI 只是组件库，变成企业应用需要拼接：
- 路由：Vue Router 4
- 状态：Pinia
- 构建：Vite
- Dashboard 模板：v4 免费的全套中后台布局
- i18n：@nuxt/ui/locale 50+ 语言
- 暗色模式：@nuxtjs/color-mode

Nuxt 全栈项目还可以叠加 Nuxt Content（文档）、Nuxt Image（图片优化）等。

[click] 长期投入推荐深入两个底层 ——

Reka UI primitives —— Nuxt UI 的组件行为逻辑都来自 Reka UI。
理解 Reka UI 的 primitives API，遇到复杂自定义需求时才能游刃有余。

Tailwind Variants（tv() 函数）—— Nuxt UI 的样式系统基于它。
理解 slots / variants / compoundVariants 的概念，
才能真正掌握组件主题覆盖的全部能力。

读 Nuxt UI 源码也是优秀的 Vue 3 组件库设计教材 ——
理解「Reka UI + Tailwind Variants + app.config 主题」的组合模式。
-->

---
transition: fade-out
---

# 延伸学习资源

官方 + 生态精选

<v-click>

**官方资源**

- 📖 [Nuxt UI 官网](https://ui.nuxt.com/) —— 每个组件含 Theme 一节，可在线预览
- 💻 [GitHub nuxt/ui](https://github.com/nuxt/ui) —— 9k+ star，主仓库
- 🎨 [Figma Kit](https://ui.nuxt.com/figma) —— v4 免费的官方设计组件库

</v-click>

<v-click>

**底层与生态**

- [Reka UI](https://reka-ui.com/) —— 底层无样式 primitives 库（原 Radix Vue）
- [Tailwind CSS 4](https://tailwindcss.com/) / [Tailwind Variants](https://www.tailwind-variants.org/) —— 样式引擎
- [TanStack Table](https://tanstack.com/table) —— UTable 底层 / [Lucide](https://lucide.dev/) —— 默认图标集

</v-click>

<v-click>

**配套技术栈**

- Nuxt 4 / Vue Router + Pinia + Vite = 黄金组合
- Vercel AI SDK + Nuxt Content = AI 产品 / 文档站三件套

</v-click>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #36E4DA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 官方资源是第一手信息 ——

Nuxt UI 官网（ui.nuxt.com）质量极高 ——
每个组件页面都有完整的 props / slots / events 文档，
特别是每个组件都有 Theme 一节，列出所有可覆盖的 slot 和 variant。
所有组件都能在线预览效果。

GitHub 主仓库 nuxt/ui，9k+ star —— issue / discussions 区是问题解答的金矿。
因为中文资源少，遇到问题主要靠这里 + 官方文档。

Figma Kit 是 v4 免费的官方设计组件库 ——
设计师可以直接拖 Nuxt UI 组件出原型，开发者复用设计稿。
设计开发一体化。

[click] 底层与生态 ——

Reka UI（reka-ui.com）是 Nuxt UI 的底层 primitives 库 ——
原名 Radix Vue，是 React Radix UI 的 Vue 版。
深度自定义时要读它的文档。

Tailwind CSS 4 是样式引擎，Tailwind Variants（tv() 函数）是 Nuxt UI
组件样式的组织方式 —— 理解 tv() 才能真正掌握主题覆盖。

TanStack Table 是 UTable 的底层 —— 表格的排序 / 筛选 / 虚拟化等
高级能力的文档要去 TanStack 看。

Lucide 是默认图标集，icones.js.org 可以浏览 Iconify 全部 20 万图标。

[click] 配套技术栈 ——

Nuxt 全栈项目：Nuxt 4 + Nuxt UI + 自带的 router / Pinia 模块。
纯 Vue 项目：Vue Router + Pinia + Vite + Nuxt UI。
这是 2026 年 Vue 3 现代项目的事实标准组合。

AI 产品方向：Nuxt UI 的 AI Chat 组件 + Vercel AI SDK v5 ——
搭 ChatGPT 风格应用。

文档站方向：Nuxt UI 的 Content 组件 + Nuxt Content ——
搭文档 / 博客站。

Nuxt UI 背靠 Vercel + Nuxt 生态，配套工具链非常完整 ——
从中后台到营销页到 AI 产品到文档站，一套技术栈全覆盖。
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 💚

Nuxt UI — Nuxt 官方维护的现代 Vue UI 组件库

<div class="mt-8 text-lg">

**核心心智**

- UApp 必须包根，Vue 项目根 div 加 isolate 类
- v4 必装 Tailwind 4，main.css 两行 import 不能漏
- 主题 = 7 色语义化别名 + app.config.ts + 组件 ui prop
- UForm 接 Standard Schema，UTable 基于 TanStack Table
- v4 重磅：Pro 免费开源、支持纯 Vue、AI / Dashboard 全套

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://ui.nuxt.com/" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/nuxt/ui" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://reka-ui.com/" target="_blank" class="slidev-icon-btn">
    <carbon:star /> Reka UI
  </a>
</div>
