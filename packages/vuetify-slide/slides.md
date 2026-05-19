---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Vuetify
info: |
  Presentation Vuetify for Vue 3 developers.

  Learn more at [https://vuetifyjs.com/](https://vuetifyjs.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎨</span>
</div>

<br/>

## Vuetify — Vue Material Design UI Library

100+ Material Design 3 组件，由 Vuetify 团队主导，是 Vue 生态最资深的 Material UI 库（当前主线 v3.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Vuetify —— Vue 生态最早、最完整的 Material Design UI 组件库，由 John Leider 主导。

2016 年立项，2019 年发布 v2.x 服务 Vue 2，2022 年 5 月发布 v3.x「Titan」服务 Vue 3，
是与 Element Plus、Naive UI、Ant Design Vue 并列的四大 Vue UI 库之一。

核心卖点：100+ Material Design 3 风格组件、完整主题系统（多主题 / CSS 变量）、
useDisplay/useTheme/useLocale/useDate 四大 Composable、SSR 友好、官方 Nuxt 模块、
自动按需 import（vite-plugin-vuetify）、Material Symbols/MDI 双图标方案、原生 TypeScript。
-->

---
transition: fade-out
---

# 什么是 Vuetify？

Vue 3 时代 Material Design 设计语言的事实标准 UI 库

<v-click>

- **100+ 组件**：Application / Form / Data / Navigation / Feedback / Layout 六大分类
- **Material Design 3**：原生贴合 Material You 设计规范，无需额外适配
- **完整主题系统**：内置 light/dark + 自定义多主题 + 运行时 CSS 变量切换
- **TypeScript 优先**：全量类型声明，IDE 跳转 / 补全开箱即用
- **自动按需引入**：`vite-plugin-vuetify` 编译期 Tree-shaking，零配置
- **强大 Composables**：useDisplay / useTheme / useLocale / useDate
- **i18n + RTL**：50+ 语言 locale + 阿拉伯 / 希伯来等 RTL 完整支持
- **SSR 友好**：官方 `vuetify-nuxt-module` 一键集成 Nuxt

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Vuetify Introduction_](https://vuetifyjs.com/en/introduction/why-vuetify/)

</div>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vuetify 的核心定位非常清晰：「Vue 生态 Material Design 的事实标准」。

它的关键特征：
- 100+ 组件 覆盖企业应用 + C 端产品几乎所有场景，是 Vue UI 库中组件数量最多的
- Material Design 3 风格 —— 直接贴合 Google 设计规范，无需额外适配
- 主题系统极强 —— 内置 light/dark + 任意自定义多主题 + 运行时切换
- TypeScript 原生支持，IDE 智能补全无缝
- vite-plugin-vuetify 是「现代项目标配」—— 自动按需引入，bundle 减半
- 4 个核心 Composable 是 Vuetify 的灵魂：display 响应式断点、theme 主题切换、locale 国际化、date 日期适配
- 国际化 50+ 语言 + RTL 完整支持，跨国产品必选
- SSR 完美支持 —— 官方 Nuxt 模块 vuetify-nuxt-module 零配置上手

下面会按「定位 → 生态对比 → 设计理念 → 安装 → 第一个组件 → Form/Table/Layout/Grid/Theme/Defaults/i18n/SSR → 对比 → 踩坑」顺序讲透。
-->

---
transition: fade-out
---

# Vuetify 的定位与生态

为什么 Material Design 项目几乎必选 Vuetify？

<v-click>

| 维度          | Vuetify 3          | Element Plus       | Naive UI        | Ant Design Vue   | PrimeVue          |
| ------------- | ------------------ | ------------------ | --------------- | ---------------- | ----------------- |
| 框架绑定      | Vue 3              | Vue 3              | Vue 3           | Vue 3            | Vue 3 / React     |
| 设计语言      | **Material 3**     | 中后台通用         | 简约现代        | Ant Design       | 多 Preset 主题    |
| 组件数量      | **100+**           | 60+                | 70+             | 60+              | 80+               |
| TS 支持       | **原生**           | 原生               | **原生**        | 原生             | 原生              |
| 主题方案      | **JS Theme + CSS 变量** | SCSS + CSS vars | JS Theme Object | LESS + Token     | CSS vars + Theme  |
| 多主题支持    | **任意命名主题**   | 单 / 双            | 单 / 双         | 单 / 双          | 多 Preset         |
| 包体积        | 偏大（自动 tree-shake） | 中           | 小              | 偏大             | 中                |
| 国际化        | 50+ 语言 + RTL     | 66+ 语言           | 30+ 语言        | 20+ 语言         | 50+ 语言          |
| 主导团队      | Vuetify 团队       | 饿了么             | TuSimple 团队   | 蚂蚁集团         | PrimeTek          |
| 历史          | **2016 至今**      | 2020 至今          | 2021 至今       | 2017 至今        | 2014 至今         |
| 大版本风险    | 中（v2→v3 重写）   | 低（v2 长期）      | 低              | 低               | 中                |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Vue 3 UI Comparisons_](https://vuetifyjs.com/en/introduction/why-vuetify/)

</div>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比五大 Vue 3 UI 库，Vuetify 的护城河是「Material Design + 海量组件」：

- 100+ 组件是 Vue 3 生态最多的 —— 表单、表格、布局、反馈、导航、显示、图标全都覆盖
- Material Design 3 风格独此一家 —— 其它库都偏中后台通用风，Vuetify 的视觉更现代有「呼吸感」
- 主题系统是「JS Theme 对象 + CSS 变量」双层 —— 既能编译期定制色板，又能运行时动态切换
- 多主题支持是 Vuetify 的杀手锏 —— 不限于 light/dark，你可以注册 5 个主题（如「elegant / energetic / professional」），运行时无缝切换
- 包体积偏大是历史包袱 —— Material Design 视觉细节多（涟漪、阴影、字体），但 vite-plugin-vuetify 自动按需可大幅减小
- 历史悠久 —— 2016 年诞生于 Vue 1 时代，2019 年 v2 适配 Vue 2，2022 年 v3 重写适配 Vue 3，老牌可靠

对比 Element Plus：中后台风 vs Material 风，国内 vs 国际化
对比 Naive UI：偏简约现代 vs Material 浓墨重彩
对比 Ant Design Vue：蚂蚁体系 vs Material Design，国内偏好两极分化
对比 PrimeVue：跨框架（Vue / React 共享）多 Preset vs 单一 Material 但深度更强

选型逻辑：C 端 / 国际化 / Material 风产品首选 Vuetify，B 端中后台首选 Element Plus / Ant Design Vue。
-->

---
transition: fade-out
---

# Vuetify 演进史

从 Vue 1 到 Vue 3 的十年沉淀

<v-click>

| 版本             | 时间    | 关键事件                                                       |
| ---------------- | ------- | -------------------------------------------------------------- |
| Vuetify 0.x      | 2016    | 基于 Vue 1.x，John Leider 创立，Material Design 1 风格         |
| Vuetify 1.x      | 2018    | Vue 2 适配，组件数破 80                                        |
| Vuetify 2.x      | 2019    | 大幅重写，Material 2 风格，国际化 / 主题完整                   |
| **Vuetify 3.x「Titan」** | 2022.5 | 基于 Vue 3 Composition + TypeScript 重写，新主题 API   |
| Vuetify 3.4 "Blackguard" | 2023.10 | 数据表格虚拟化，Date Pickers 重写                    |
| Vuetify 3.5 "Polaris"    | 2024.1  | Snackbar Queue，DataTable Filter 重写                |
| Vuetify 3.7 "Odyssey"    | 2024.10 | 新增 VConfirmEdit / VStepperVertical，Material 3 持续推进     |
| Vuetify 3.10+    | 2026+   | 持续迭代，新 theming API、useRules 校验、AI 助手集成          |

</v-click>

<v-click>

NPM 包名一直是 `vuetify` —— v2 与 v3 共用同一包名，靠主版本号区分。

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vuetify 是 Vue 生态资历最老的 UI 库之一 ——

2016 年与 Vue 1 同期诞生，那时还没有 Element / Ant Design Vue，
John Leider（Vuetify 创始人）从 Material Design 规范着手，目标是「Vue 也能有 Google 同款 UI」。

v1 / v2 阶段稳步迭代，2019 年 v2.0 是分水岭 —— 重写了主题、栅格、表单系统，确立现代 API 范式。

[click] 2022 年 5 月 v3.0「Titan」是另一次大变 ——
- 完全基于 Vue 3 Composition API 重写
- TypeScript 优先（不再是「事后补丁」）
- 新的主题 API（多主题 + CSS 变量）
- vite-plugin-vuetify 替代手动 import 链路
- Material Design 3 风格初步落地

这次重写引发了一些社区分裂 —— 部分 v2 用户保留在 v2 维护，部分迁移到 Element Plus / Naive UI。
但 Vuetify 团队挺过这次转型，3.x 经过 3 年迭代已经非常成熟。

[click] v3.4 起持续推进 Material Design 3 适配，
v3.7 引入更多企业级组件（VConfirmEdit 内联编辑确认、VStepperVertical 垂直步骤条），
当前主线 v3.10+ 已经是 Vue 3 + Material 项目的事实标准。

NPM 包名一直是 `vuetify` —— v2 与 v3 共用同一包名，靠主版本号区分。
不同于 Element / Element Plus 这种「换包名」策略。
-->

---
transition: fade-out
---

# Vuetify 的核心理念

四条设计原则贯穿全部组件 API

<v-click>

**1. Material Design First（设计第一）**

不是「类 Material 风」，而是严格贴合 Google Material Design 3 规范 —— 颜色、间距、字体、动效全部对齐。

</v-click>

<v-click>

**2. Composition API + Composables（组合式优先）**

useDisplay / useTheme / useLocale / useDate 四大 composable 是 Vuetify 的灵魂，所有响应式状态都通过 composable 暴露。

</v-click>

<v-click>

**3. Theming Everywhere（处处可主题化）**

每个组件都吃 theme 系统 —— color prop 接收主题色（primary/secondary/success/error），不需要硬编码颜色值。

</v-click>

<v-click>

**4. SSR + Tree-shaking 标配**

vite-plugin-vuetify 让按需引入零配置，vuetify-nuxt-module 让 SSR 一键启用 —— 现代项目所需的工程化能力开箱即用。

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Material Design First 是 Vuetify 的灵魂 ——

不是「类 Material 风」（很多库会说「我们的设计像 Material 但有自己特色」），
而是「严格贴合 Material Design 3」—— Vuetify 团队定期与 Google Design 团队对齐规范。

这带来两个好处：
- 设计师不用学新规范，直接用 Material Guidelines 跟开发对接
- 用户对组件交互有预期（涟漪、阴影、过渡动效），上手成本低

代价：所有组件都带 Material 视觉印记 —— 圆角、阴影、淡色背景。
不适合「极简风」/「拟物风」/「中后台严肃风」的产品。

[click] Composition API + Composables 是 Vuetify 3 的核心机制 ——

v2 时代依赖 `$vuetify` 全局对象访问主题 / 显示信息，是 Options API 风格。
v3 全面拥抱 Composition：
- useDisplay() 拿响应式断点（xs / sm / md / lg / xl + mobile / mdAndUp 等）
- useTheme() 拿当前主题 + 切换函数
- useLocale() 拿当前 locale + 切换函数
- useDate() 拿日期适配器（dayjs / luxon / date-fns 等）

这些 composable 与 VueUse 风格一致，与 setup 语法无缝。

[click] Theming Everywhere ——

Vuetify 的每个组件都接受 color prop，但传的是「主题色名」而非颜色值：
- `<v-btn color="primary">` 而非 `<v-btn color="#1867C0">`
- 切换主题时所有组件自动更新颜色，零业务代码改动

这种「主题色语义化」是 Material Design 的核心理念 —— 颜色服务于功能而非装饰。

[click] SSR + Tree-shaking ——

Vuetify 在工程化层面的成熟度很高：
- vite-plugin-vuetify：自动按需引入组件 + 自动按需引入 SCSS
- vuetify-nuxt-module：Nuxt 一键集成，SSR 水合 / 样式注入 / 主题持久化全自动
- 不需要手动配 import { VBtn } / import 'vuetify/components/VBtn/VBtn.css' 这种低层细节

这套工具链是 Vuetify v3 与 v2 最大的差异之一，也是「现代 Vue 项目应有的标配」。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 创建项目：pnpm create vuetify

官方脚手架，5 秒生成完整项目

::left::

<v-click>

**官方 CLI 脚手架（推荐）**

```bash
pnpm create vuetify
# or npm create vuetify@latest
# or yarn create vuetify
# or bun create vuetify
```

| 选项     | 说明                              |
| -------- | --------------------------------- |
| Project Name | 项目名（默认 vuetify-project） |
| TypeScript | TS 还是 JS                      |
| Routing    | Vue Router + 文件路由         |
| Icons      | MDI / Material Symbols / FontAwesome |

</v-click>

::right::

<v-click>

**生成结构**

```text
my-vuetify-app/
├─ src/
│  ├─ plugins/
│  │  ├─ vuetify.ts        # createVuetify 入口
│  │  └─ index.ts          # 插件聚合
│  ├─ App.vue              # 根组件 (v-app)
│  ├─ main.ts              # 应用启动
│  └─ assets/
├─ vite.config.ts          # 内置 vite-plugin-vuetify
└─ package.json
```

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] `pnpm create vuetify` 是 Vuetify 官方的脚手架工具 ——
不同于 Vue CLI / Vite 直接生成空白项目，create-vuetify 会问几个问题：
- 项目名（默认 vuetify-project）
- TypeScript or JavaScript
- 是否启用 Vue Router + 文件路由（unplugin-vue-router）
- 选择默认图标库（MDI / Material Symbols / FontAwesome / Tabler / Lucide）
- 是否启用 ESLint
- 是否启用 Pinia 状态管理
- 是否启用 vee-validate 表单校验

5 秒钟生成一个完整、可立即运行的 Vuetify 项目。

[click] 生成结构是 Vuetify 官方推荐的「最佳实践布局」：
- plugins/vuetify.ts：createVuetify 配置入口 —— 主题、defaults、icons、locale 全在这里
- plugins/index.ts：聚合所有 Vue 插件（router/pinia/vuetify），main.ts 一次 use 多个
- App.vue：根组件，必须包一层 `<v-app>` 才能让所有组件吃到主题与布局系统

vite.config.ts 已经内置了 vite-plugin-vuetify，无需手动配置 —— 自动按需引入组件 + 样式。

这套结构与 Nuxt 风格类似，对从 Nuxt 迁移过来的开发者非常友好。
-->

---
transition: fade-out
---

# 手动安装：从零集成到现有项目

如果你已有 Vue 3 项目，三步接入 Vuetify

<v-click>

**1. 安装依赖**

```bash
pnpm i vuetify @mdi/font
pnpm i -D vite-plugin-vuetify
```

</v-click>

<v-click>

**2. vite.config.ts 配 plugin**

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),   // 自动按需引入组件 + 样式
  ],
});
```

</v-click>

<v-click>

**3. main.ts 注册插件**

```ts
import { createApp } from "vue";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import App from "./App.vue";

const vuetify = createVuetify();
createApp(App).use(vuetify).mount("#app");
```

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三个包要装清楚：
- `vuetify`：核心组件库 + 主题系统 + composables
- `@mdi/font`：Material Design Icons 字体（5K+ 图标）
- `vite-plugin-vuetify`：开发期插件，autoImport 是关键

注意 `vite-plugin-vuetify` 是 devDependency，不进 bundle。

如果用 SVG 图标方案（按需 + tree-shake 友好），可改用：
- `@mdi/js`：MDI SVG 图标数据（按需 import）
- `vuetify/iconsets/mdi-svg`：配 createVuetify 的 icons.sets

[click] vite.config.ts 配置极简 ——
- `vuetify({ autoImport: true })` 是核心：扫描模板里的 `<v-xxx>`，自动 import 对应组件 + CSS
- 必须放在 `vue()` 之后（顺序敏感，否则 plugin 转换链断）

autoImport: true 等价于「按需引入」—— 模板里没用的组件不进 bundle。
autoImport: false 等价于「全量引入」—— 体验差但调试方便。
默认值是 true，绝大多数项目保持默认即可。

[click] main.ts 三步走：
1. import 'vuetify/styles'：必须放在第一行 import vuetify 之前，加载主题基础样式
2. import '@mdi/font/css/...'：加载 MDI 字体（按需用 SVG 方案则可省略）
3. createVuetify() + use：注册到 Vue 实例

createVuetify() 不传参就是默认配置 —— light 主题、MDI 图标、英文 locale。
后续讲怎么定制主题、defaults、icons、locale。
-->

---
transition: fade-out
---

# 第一个组件：v-app 与 v-btn

熟悉的味道，Material 风加持

<v-click>

```vue
<script setup lang="ts">
import { ref } from "vue";

const loading = ref(false);

async function handleSubmit() {
  loading.value = true;
  try {
    await fetch("/api/submit", { method: "POST" });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <v-btn color="primary" variant="elevated" :loading="loading" @click="handleSubmit">
          提交订单
        </v-btn>
        <v-btn color="success" variant="tonal">成功</v-btn>
        <v-btn color="warning" variant="outlined">警告</v-btn>
        <v-btn color="error" variant="text">危险</v-btn>
        <v-btn icon="mdi-heart" color="error" />
      </v-container>
    </v-main>
  </v-app>
</template>
```

</v-click>

<v-click>

| Prop      | 取值                                              | 说明           |
| --------- | ------------------------------------------------- | -------------- |
| `color`   | primary / secondary / success / warning / error / info | 主题色名 |
| `variant` | elevated / flat / tonal / outlined / text / plain | 视觉变体       |
| `size`    | x-small / small / default / large / x-large       | 尺寸           |
| `loading` `disabled` `block` `rounded` | boolean              | 状态 + 形态    |

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v-app 是 Vuetify 应用的「根容器」—— 必须包一层，否则主题 / 布局 / 涟漪等系统功能全不工作。

`<v-main>` 是「主内容区」—— 自动避开 v-app-bar / v-navigation-drawer / v-footer 的占位空间。

`<v-container>` 是「居中限宽容器」—— 默认最大宽度 1280px，内边距 16px，自动响应式。

v-btn 是 Vuetify 最简单的组件，但 prop 比 Element 多得多 ——
type 在 Vuetify 叫 color，传的是「主题色名」而非颜色值 —— 这是 Material Design「颜色语义化」的核心。

variant 是 Vuetify 独有的「视觉变体系统」：
- elevated（默认）：有阴影的填充按钮
- flat：无阴影的填充按钮
- tonal：浅色调填充（适合次操作）
- outlined：边框按钮
- text：纯文字按钮
- plain：透明按钮

这套 variant 6 选 1 几乎所有按钮场景都能覆盖。

[click] color 的语义值对应主题系统：
- primary：主操作 / 品牌色（提交、保存）
- secondary：次操作 / 辅助色
- success：积极反馈（已完成）
- warning：提示（注意事项）
- error：危险操作（删除、错误）
- info：中性信息

这套 color 体系几乎所有组件（VAlert / VChip / VBadge / VProgressLinear）共享，认知成本极低。

icon 是 string 类型（不是 ComponentInstance），直接传 MDI 字符串 `mdi-xxx` 即可。
SVG 方案则传 SVG path 字符串。
-->

---
transition: fade-out
---

# 100+ 组件分类速览

按使用场景组织，记住分类即可快速定位

<v-click>

| 分类                | 代表组件                                                              |
| ------------------- | --------------------------------------------------------------------- |
| **Application**     | VApp / VAppBar / VNavigationDrawer / VMain / VFooter / VBottomNavigation |
| **Form Inputs**     | VTextField / VTextarea / VSelect / VAutocomplete / VCombobox / VFileInput |
| **Form Controls**   | VCheckbox / VRadio / VSwitch / VSlider / VRating / VOtpInput          |
| **Date & Time**     | VDatePicker / VDateInput / VTimePicker                                |
| **Data**            | VDataTable / VDataTableServer / VDataTableVirtual / VTreeview / VVirtualScroll |
| **Display**         | VCard / VList / VTimeline / VChip / VAvatar / VBadge / VImg / VCarousel |
| **Navigation**      | VTabs / VBreadcrumbs / VPagination / VStepper / VMenu / VBottomSheet  |
| **Feedback**        | VAlert / VSnackbar / VProgressLinear / VProgressCircular / VSkeletonLoader |
| **Overlay**         | VDialog / VBottomSheet / VOverlay / VMenu / VTooltip / VConfirmEdit   |
| **Layout & Grid**   | VContainer / VRow / VCol / VSpacer / VDivider / VSheet                |

</v-click>

<v-click text-xs class="mt-4">

> 💡 **设计原则**：每个组件都有 `density`（紧凑度）+ `variant`（视觉变体）+ `color`（主题色）三个核心维度。

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 100+ 组件听起来多，按分类记忆就清晰多了：

Application：应用骨架 —— v-app 是根容器，其它都是导航栏 / 抽屉 / 主体 / 底栏
Form Inputs：输入类组件 —— 文本 / 选择 / 自动完成 / 文件
Form Controls：选择类组件 —— 单选 / 多选 / 开关 / 滑块 / 评分
Date & Time：日期时间 —— 三大组件覆盖企业应用所有需求
Data：数据展示 —— DataTable 是「重头戏」，与 Element Table 旗鼓相当
Display：展示类 —— Card / List / Chip / Avatar 是 Material 风的视觉支柱
Navigation：导航类 —— Tabs / Stepper / Pagination 配合 vue-router 用
Feedback：反馈类 —— Alert / Snackbar / Progress 提升用户体验
Overlay：弹层类 —— Dialog / BottomSheet / Tooltip 复杂交互的载体
Layout & Grid：布局类 —— 12 栅格 + 工具元素

[click] 设计原则上 Vuetify 有三个独有维度：
1. density（紧凑度）：default / comfortable / compact —— 同一组件三档紧凑度
2. variant（视觉变体）：elevated / flat / tonal / outlined / text / plain —— 6 档视觉风格
3. color（主题色）：primary / secondary / success / warning / error / info —— 6 档语义色

这三个维度可任意组合，理论上每个组件有 3*6*6 = 108 种视觉表现。
你不需要全部记住 —— 选 default + elevated + primary 就是 Material Design 标准外观。
-->

---
transition: fade-out
---

# vite-plugin-vuetify：自动 Tree-shaking

按需引入 + 按需样式，bundle 减半

<v-click>

**vite.config.ts 配置**

```ts
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,            // 模板里的 <v-xxx> 自动 import 组件 + CSS
      styles: { configFile: "src/styles/settings.scss" },  // 主题 SCSS 入口
    }),
  ],
});
```

</v-click>

<v-click>

**模板里直接用，不用 import**

```vue
<template>
  <v-app>
    <!-- 这些组件全部自动 import + 按需加载 CSS -->
    <v-btn>按钮</v-btn>
    <v-text-field label="姓名" />
    <v-data-table :headers="headers" :items="rows" />
  </v-app>
</template>
```

</v-click>

<v-click>

> 💡 **效果**：全量 bundle 约 ~750 KB（含全部组件 + 样式），自动按需后通常降到 ~200 KB（仅含实际使用组件）。

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] vite-plugin-vuetify 是 Vuetify 工程化的核心 ——

它的工作原理：
- 扫描所有 .vue 文件的 template 部分
- 识别 `<v-xxx>` 标签，自动 inject `import { VXxx } from 'vuetify/components/VXxx'`
- 同时 inject 对应组件的 CSS（按需加载，不进全局 bundle）

autoImport: true 是默认值 —— 多数项目保持默认即可。
styles.configFile 指向 SCSS 入口文件 —— 用于「主题深度定制」（覆盖 Vuetify 内置 SCSS 变量）。

[click] 写法极简：
- 模板里直接写 `<v-btn>`、`<v-text-field>`、`<v-data-table>`
- 不需要 import { VBtn } from 'vuetify/components'
- 不需要 import 'vuetify/components/VBtn/VBtn.css'

vite-plugin-vuetify 自动处理，开发体验跟「全局注册」一致，但 bundle 跟「按需引入」一致。

[click] 实际 bundle 对比：
- 全量引入（不用 vite-plugin-vuetify）：~750 KB（含全部 100+ 组件 + 样式）
- 按需引入（用 vite-plugin-vuetify）：~200 KB（仅含实际使用组件，差异巨大）

这种「零成本按需引入」是 Vuetify 3 相对 v2 最大的工程化进步之一。
v2 时代需要手动 import 组件、手动写 babel-plugin-vuetify 配置、痛苦不堪。
v3 一行 plugin 解决，开发体验飞升。

注意：`vite-plugin-vuetify` 是 devDependency —— 它只在编译期工作，不进 runtime bundle。
-->

---
transition: fade-out
---

# v-form 深度：声明式校验

rules / validate / vee-validate 三选一

<v-click>

```vue
<script setup lang="ts">
import { ref, reactive } from "vue";

const formRef = ref();
const valid = ref(false);
const form = reactive({ name: "", email: "", age: 18 });

// 校验规则数组（每个 rule 是 value => true | string）
const nameRules = [
  (v: string) => !!v || "姓名必填",
  (v: string) => v.length >= 2 || "至少 2 个字",
];
const emailRules = [
  (v: string) => !!v || "邮箱必填",
  (v: string) => /.+@.+\..+/.test(v) || "邮箱格式不正确",
];

async function submit() {
  const { valid } = await formRef.value.validate();
  if (valid) await api.create(form);
}
</script>

<template>
  <v-form ref="formRef" v-model="valid" @submit.prevent="submit">
    <v-text-field v-model="form.name" :rules="nameRules" label="姓名" required />
    <v-text-field v-model="form.email" :rules="emailRules" label="邮箱" />
    <v-btn type="submit" color="primary" :disabled="!valid">提交</v-btn>
  </v-form>
</template>
```

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v-form 是 Vuetify 内置的轻量级表单容器 ——

核心机制：
- 包一层 `<v-form ref>`，内部所有 v-text-field / v-select 等输入组件被自动收集
- v-model="valid" 双向绑定全表单校验状态（true = 所有字段都通过）
- validate() 方法触发全表单校验，返回 { valid, errors }
- reset() 重置所有字段值
- resetValidation() 仅清除校验错误，保留字段值

rules 是「函数数组」—— 每个 rule 接收当前 value，返回 `true`（通过）或 `string`（错误提示）。
这种「函数 + 字符串」的设计比 Element 的 rules 对象更灵活 —— 可以动态生成 rule。

注意：
- `v-form @submit.prevent="submit"` —— prevent 阻止默认 form 提交（页面跳转）
- `:disabled="!valid"` —— 提交按钮可以根据校验状态自动禁用（提升 UX）
- `await formRef.value.validate()` —— 校验是异步的（支持异步校验器）

对于复杂表单（动态字段、跨字段联动、异步校验），推荐用 vee-validate 集成 ——
vee-validate 9.x 与 Vuetify 3 原生协作，参考 vee-validate 文档「Vuetify integration」章节。

新版 Vuetify 还提供 `useRules` composable（v3.10+）—— 内置 required / email / minLength 等常用 rule，无需手动写。
-->

---
transition: fade-out
---

# v-data-table 深度：声明式表格

headers + items 两要素

<v-click>

```vue
<script setup lang="ts">
import { ref } from "vue";

interface User {
  id: number; name: string; email: string; role: string;
}

const search = ref("");
const itemsPerPage = ref(10);
const headers = [
  { title: "ID", key: "id" },
  { title: "姓名", key: "name" },
  { title: "邮箱", key: "email" },
  { title: "角色", key: "role" },
  { title: "操作", key: "actions", sortable: false },
];
const users = ref<User[]>([
  { id: 1, name: "Tom", email: "tom@x.com", role: "Admin" },
  { id: 2, name: "Jerry", email: "j@x.com", role: "Editor" },
]);
</script>

<template>
  <v-data-table
    v-model:items-per-page="itemsPerPage"
    :headers="headers" :items="users" :search="search" class="elevation-1"
  >
    <template #top>
      <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="搜索" />
    </template>
    <template #item.actions="{ item }">
      <v-btn icon="mdi-pencil" size="small" variant="text" @click="edit(item)" />
      <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="del(item)" />
    </template>
  </v-data-table>
</template>
```

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v-data-table 是 Vuetify 最复杂、最强大的组件 —— 与 Element Table 旗鼓相当。

声明式比 Element Table 更简洁：
- headers 数组：每项 `{ title, key, sortable, ... }` 声明列
- items 数组：直接绑数据数组
- 不需要写 `<v-data-table-column>` 子组件（这是 v2 写法，v3 改成 headers 数组）

核心特性：
- 内置分页（v-model:items-per-page、v-model:page）
- 内置排序（headers 加 sortable: true，默认 true）
- 内置搜索（绑 :search，按所有列模糊匹配）
- elevation-1 是工具类，给表格加一层阴影（Material 风必备）

slot 写法极简：
- #top：表格上方区域（放工具栏 / 搜索框）
- #item.{key}：自定义某一列的内容渲染（接 { item, index, value }）
- #header.{key}：自定义某一列的表头
- #expanded-row：展开行内容

[click] 三个版本的 DataTable：
- v-data-table：客户端版本，内置分页 + 排序 + 搜索（适合小数据集）
- v-data-table-server：服务端版本，事件驱动（适合大数据集 + 服务端处理）
- v-data-table-virtual：虚拟化版本，渲染万级行不卡（适合大数据集 + 客户端处理）

选型逻辑：
- 数据量 < 1000：v-data-table
- 服务端分页：v-data-table-server
- 万级行客户端：v-data-table-virtual
-->

---
transition: fade-out
---

# v-data-table-server：服务端分页

事件驱动模式，大数据集首选

<v-click>

```vue
<script setup lang="ts">
import { ref } from "vue";

const loading = ref(false);
const itemsLength = ref(0);
const items = ref([]);

interface Options {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: "asc" | "desc" }[];
}

async function loadItems({ page, itemsPerPage, sortBy }: Options) {
  loading.value = true;
  try {
    const { list, total } = await api.queryUsers({ page, pageSize: itemsPerPage, sortBy });
    items.value = list;
    itemsLength.value = total;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-data-table-server
    :headers="headers" :items="items" :items-length="itemsLength"
    :loading="loading" @update:options="loadItems"
  />
</template>
```

</v-click>

<v-click>

> 💡 **关键差异**：相比 v-data-table，需提供 `items-length`（总数）+ 监听 `@update:options`（任何分页 / 排序 / 搜索变化触发）。

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v-data-table-server 是「服务端分页 + 排序 + 搜索」的专用版本 ——

核心差异：
- 不在前端做分页 / 排序 / 搜索 —— 全部交给后端
- 通过 `@update:options` 事件统一通知前端「分页或排序条件变了」
- 接收 `items-length`（总数）用于渲染分页器

`@update:options` 接收一个 options 对象：
- page：当前页码（1-based）
- itemsPerPage：每页条数
- sortBy：排序数组 `[{ key: 'name', order: 'asc' }]`（支持多列排序）
- search：搜索关键字
- groupBy：分组字段
- filters：列筛选条件

把这些参数原样转发给后端 API 即可。

`loading` prop 控制加载状态 —— 表格自动显示进度条 / 骨架屏。

[click] 这种「事件驱动 + 单一加载函数」的模式有几个优点：
- 不用手动 watch 多个 ref（pagination / sort / filter）
- 自动防抖（同一时刻多个状态变化合并成一次 update:options）
- 与 vue-router 同步 query 极简（loadItems 内调 router.replace）

对比 Element Table 的「@sort-change / @pagination-change / @filter-change」三个独立事件，
Vuetify 的统一事件模式更现代、更易维护。
-->

---
transition: fade-out
---

# Application Layout：应用骨架

v-app + v-app-bar + v-navigation-drawer + v-main + v-footer

<v-click>

```vue
<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>My Application</v-app-bar-title>
      <v-spacer />
      <v-btn icon="mdi-magnify" />
      <v-btn icon="mdi-account" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list nav>
        <v-list-item
          v-for="item in navItems" :key="item.title"
          :prepend-icon="item.icon" :title="item.title" :to="item.to"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }} My Company</span>
    </v-footer>
  </v-app>
</template>
```

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vuetify 的 Application Layout 系统是它的「拳头功能」——
五个组件搭配出最常见的「顶栏 + 侧栏 + 主体 + 底栏」企业应用骨架，几乎零 CSS。

v-app 是「布局根容器」—— 必须包一层，否则下面所有组件的「自动占位 + 偏移」失效。
v-app-bar 是「顶栏」—— 自动 fixed 在页面顶部，高度自动撑开 v-main。
v-navigation-drawer 是「侧栏」—— 自动 fixed 在左侧，宽度自动让出主体空间。
v-main 是「主体」—— 自动避开顶栏 / 侧栏占用，渲染 router-view。
v-footer 加 `app` 属性 = 自动 fixed 在底部，否则只是普通底栏。

这套布局的「魔法」在于：
- v-app 内部维护一个 layout system，记录所有 fixed 元素的位置 + 尺寸
- v-main 自动监听 layout 变化，调整 padding 适配
- 切换 drawer 时 v-main 自动 transition 平滑过渡

如果手写 CSS 实现同样效果，需要 position: fixed + JS 计算偏移 + transition 处理 ——
Vuetify 一键搞定，代码量减少 80%。

注意：drawer 默认在桌面端展开、移动端折叠。
可以通过 `permanent` / `temporary` / `rail` props 调整行为。
-->

---
transition: fade-out
---

# 12 栅格系统：v-container + v-row + v-col

响应式断点 + 自动 flex

<v-click>

```vue
<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" lg="4">
        <v-card>左列 (移动端全宽 / 平板 1/2 / 桌面 1/3)</v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card>中列</v-card>
      </v-col>
      <v-col cols="12" md="12" lg="4">
        <v-card>右列</v-card>
      </v-col>
    </v-row>

    <v-row align="center" justify="space-around" no-gutters>
      <v-col cols="auto"><v-btn>按钮 1</v-btn></v-col>
      <v-col cols="auto"><v-btn>按钮 2</v-btn></v-col>
    </v-row>
  </v-container>
</template>
```

</v-click>

<v-click>

| Prop                 | 取值                                  | 说明                          |
| -------------------- | ------------------------------------- | ----------------------------- |
| `cols`               | 1-12 / auto                           | 默认占多少格（共 12 格）      |
| `xs / sm / md / lg / xl` | 1-12 / auto                       | 各断点占多少格                |
| `align / justify`    | start / center / end / space-between  | 行内对齐（v-row 上）          |
| `dense / no-gutters` | boolean                               | 紧凑 / 无 gutter              |

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vuetify 的栅格系统沿用 Bootstrap 12 栅格的概念，但 API 更 Vue 化 ——

v-container：居中限宽容器（默认 max-width 1280px，可改 fluid）
v-row：行容器（内部用 flex 布局，自动处理 gutter 和 wrap）
v-col：列容器（cols 1-12 决定占多少格）

响应式断点：xs / sm / md / lg / xl 五档
- xs：< 600px（手机）
- sm：600-960px（平板竖屏）
- md：960-1280px（平板横屏 / 小桌面）
- lg：1280-1920px（标准桌面）
- xl：> 1920px（大屏）

cols="12" md="6" lg="4" 表示：
- 默认 12 格（手机全宽）
- md 及以上 6 格（平板 1/2 宽）
- lg 及以上 4 格（桌面 1/3 宽）

这套「移动优先 + 断点覆盖」的写法跟 Tailwind / Bootstrap 一致，前端通用。

[click] 实用属性：
- align / justify：用 flex 的 align-items / justify-content 概念
- no-gutters：去掉默认 24px 间距（紧贴布局必备）
- dense：减半 gutter（紧凑布局）
- cols="auto"：内容自适应宽度（不固定占几格）

对于「卡片网格 / 三列布局 / 响应式表单」等场景，Vuetify 栅格几乎是「不假思索的选择」。
-->

---
transition: fade-out
---

# Theme System：主题系统（一）

createVuetify 主题配置

<v-click>

```ts
// plugins/vuetify.ts
import { createVuetify } from "vuetify";

const customLightTheme = {
  dark: false,
  colors: {
    primary: "#1867C0",
    secondary: "#5CBBF6",
    success: "#4CAF50",
    warning: "#FFC107",
    error: "#FF5252",
    info: "#2196F3",
    background: "#FFFFFF",
    surface: "#F5F5F5",
  },
};

const customDarkTheme = {
  dark: true,
  colors: {
    primary: "#2196F3",
    secondary: "#424242",
    background: "#121212",
    surface: "#1E1E1E",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: { light: customLightTheme, dark: customDarkTheme },
  },
});
```

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vuetify 主题系统的核心是「JS Theme 对象」——
不像 Element Plus 用 SCSS 变量，Vuetify 用纯 JS 对象描述主题。

每个 theme 对象有两个字段：
- dark：boolean —— 是否暗色主题（影响内置图标 / 阴影颜色等）
- colors：颜色映射 —— 6 大语义色 + background/surface 等基础色

颜色覆盖：
- primary：主色（按钮 / 链接 / 选中态）
- secondary：次色（辅助操作）
- success/warning/error/info：语义反馈色
- background：页面底色
- surface：卡片 / 弹层底色
- on-primary / on-secondary 等：在对应色上的文字颜色（自动计算或手动指定）

defaultTheme 指定默认启用哪个主题（这里是 "light"）。
themes 是命名空间 —— 可注册任意多个主题（不限于 light/dark）：
- light / dark：标准明暗
- custom / brand / energetic / elegant：业务自定义主题

[click] 编译期 createVuetify 时设定的 colors 会被 Vuetify 转换为 CSS 变量 ——
- 注入到 :root（默认主题）
- 注入到 .v-theme--{name}（其它主题）

所有组件内部都通过 var(--v-theme-{color}) 读取颜色 —— 与 Element Plus CSS Variables 机制类似。
切换主题时，Vuetify 在根元素上改 class（如 `.v-theme--dark`），全站颜色立即切换。
-->

---
transition: fade-out
---

# Theme System：主题系统（二）

useTheme：运行时切换 + 多主题循环

<v-click>

```vue
<script setup lang="ts">
import { useTheme } from "vuetify";

const theme = useTheme();

// 当前主题名 / 当前是暗色?
console.log(theme.global.name.value);       // 'light'
console.log(theme.global.current.value.dark); // false
console.log(theme.global.current.value.colors.primary);   // '#1867C0'

// 切换方法（v3.10+ API）
theme.toggle();                        // 切换 light / dark
theme.change("dark");                  // 指定切换到 dark
theme.cycle();                         // 循环所有已注册主题
theme.cycle(["custom", "light", "system"]);  // 循环指定主题
</script>

<template>
  <v-btn
    :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
    @click="theme.toggle()"
  />
</template>
```

</v-click>

<v-click>

> 💡 **持久化**：用 VueUse `useStorage` 或 Pinia 保存当前 theme 名称，刷新后自动恢复。

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] useTheme 是 Vuetify 主题系统的「运行时入口」——
不需要操作 DOM、不需要写 :root CSS，直接调函数切换主题。

theme.global 是「全局主题状态」（区别于 v-card 的局部 theme prop）：
- name：当前主题名（ref）
- current：当前主题对象（colors / dark / variables 等）

读取当前主题信息时通过 .value 解开 ref：
- theme.global.name.value：当前主题字符串
- theme.global.current.value.dark：当前是否暗色
- theme.global.current.value.colors.primary：当前 primary 颜色值

切换方法（v3.10+ 新 API）：
- toggle()：切换 light / dark（最常用）
- toggle(['custom1', 'custom2'])：在两个指定主题间切换
- change(name)：跳到指定主题
- cycle()：循环所有已注册主题
- cycle(['a', 'b', 'c'])：循环指定主题列表

[click] 持久化通常用 VueUse 的 useStorage 配合：

```ts
import { useStorage } from '@vueuse/core'
import { useTheme } from 'vuetify'

const theme = useTheme()
const stored = useStorage('vuetify-theme', 'light')
watch(stored, (name) => theme.change(name))
theme.change(stored.value)  // 启动时恢复
```

也可以接 Pinia store 同步用户偏好到后端 ——「主题跟着账号走」的常见需求。
-->

---
transition: fade-out
---

# Global Defaults：全局默认 props

defaults 配置，零代码统一组件外观

<v-click>

```ts
// plugins/vuetify.ts
export default createVuetify({
  defaults: {
    // 所有组件的全局默认（少用）
    global: {
      ripple: false,
    },
    // v-btn 全局默认
    VBtn: {
      color: "primary",
      variant: "elevated",
      rounded: "lg",
    },
    // v-card 全局默认
    VCard: {
      elevation: 4,
      rounded: "lg",
    },
    // v-text-field 全局默认
    VTextField: {
      variant: "outlined",
      density: "comfortable",
      hideDetails: "auto",
    },
    // v-data-table 全局默认
    VDataTable: {
      itemsPerPage: 25,
      density: "comfortable",
    },
  },
});
```

</v-click>

<v-click>

> 💡 **价值**：全站 v-btn 不再需要重复传 `color="primary" variant="elevated"`，配置一次全局生效。

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] defaults 是 Vuetify 的「全局默认 props 系统」——
其它 UI 库（Element / Ant Design Vue）需要 ConfigProvider 包裹，
Vuetify 直接在 createVuetify 阶段配置，简洁很多。

global 字段：对所有组件生效（少用，避免影响过大）
  - ripple: false 全局关闭涟漪效果

具体组件字段（VBtn / VCard / VTextField 等）：
- key 必须是 PascalCase（VBtn 而非 v-btn）
- value 是该组件接受的 props 对象
- 任何 prop 都可设默认值

[click] 实际价值非常大 ——

没有 defaults 时：每个 v-btn 都要写 `<v-btn color="primary" variant="elevated">`，重复劳动。
有 defaults 时：直接写 `<v-btn>提交</v-btn>`，自动 color=primary + variant=elevated。
特定地方需要例外时显式传 prop 覆盖即可。

常见场景：
- VTextField 全局 variant="outlined"（统一边框风格）
- VTextField 全局 hideDetails="auto"（无错误时不显示底部空间）
- VDataTable 全局 itemsPerPage: 25（统一分页大小）
- VBtn 全局 color="primary"（默认主色，例外才传 secondary/error）

这种「全站统一外观」的能力是 Vuetify 的杀手锏 —— 它把「设计 token」从 SCSS 变量层面提升到 Props 层面，
开发者不需要写一行 CSS 就能实现设计系统统一。
-->

---
transition: fade-out
---

# i18n 国际化：多语言 + RTL

vue-i18n 适配器 + 50+ 内置 locale

<v-click>

**1. createVuetify 配置 locale**

```ts
import { createVuetify } from "vuetify";
import { en, zhHans, ar } from "vuetify/locale";

export default createVuetify({
  locale: {
    locale: "zhHans",       // 默认中文
    fallback: "en",         // 回退英文
    messages: { en, zhHans, ar },
    rtl: { ar: true },      // ar 阿拉伯启用 RTL
  },
});
```

</v-click>

<v-click>

**2. 切换语言（useLocale）**

```vue
<script setup lang="ts">
import { useLocale } from "vuetify";

const { current, t } = useLocale();

function switchLang(code: "zhHans" | "en" | "ar") {
  current.value = code;
}
</script>

<template>
  <v-btn @click="switchLang('en')">English</v-btn>
  <v-btn @click="switchLang('zhHans')">中文</v-btn>
  <v-btn @click="switchLang('ar')">العربية</v-btn>
  <v-data-table v-bind="tableProps" />
</template>
```

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vuetify 内置 50+ 语言 locale，涵盖：
- 中文简体（zhHans）/ 繁体（zhHant）
- 英文（en）
- 日文（ja）/ 韩文（ko）
- 欧洲语言（fr / de / es / it / pt / nl / pl / cs / hu ...）
- 中东语言（ar 阿拉伯 / he 希伯来 / fa 波斯）—— 这些是 RTL 语言
- 北欧语言（sv / no / da / fi）
- 其它（ru / tr / vi / th ...）

`vuetify/locale` 包导出全部 locale 对象，按需 import 减小 bundle。

[click] useLocale composable 是切换入口：
- current：响应式 ref，当前 locale 名
- t(key)：翻译函数（实际很少用，因为 Vuetify 内置文案已经够全）

修改 current.value 立即生效 —— 所有 Vuetify 组件（DataTable 分页文字 / Calendar 月份名 / DatePicker 等）瞬间切换。

[click] RTL（Right-To-Left）支持：
- locale.rtl: { ar: true } 标记某些 locale 是 RTL
- 切换到 RTL 语言时，整个应用自动镜像翻转（v-app 的根元素自动加 dir="rtl"）
- v-navigation-drawer 从右侧滑入而非左侧
- 图标方向自动镜像（v-icon-prepend / v-icon-append 调换）
- text-align: right 自动应用

RTL 是国际化 SaaS / 跨国电商的硬需求，Vuetify 是 Vue 生态里支持最完整的库 ——
比 Element Plus / Naive UI 强很多。

[click] 与 vue-i18n 集成（业务文案 + 组件文案统一管理）：

```ts
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { createI18n, useI18n } from 'vue-i18n'

const i18n = createI18n({ legacy: false, locale: 'zhHans', messages: {...} })
const vuetify = createVuetify({
  locale: { adapter: createVueI18nAdapter({ i18n, useI18n }) }
})
```

这样业务文案（user.profile.title）和组件文案（$vuetify.dataTable.itemsPerPage）共用 vue-i18n，
切换语言时两者同步更新。
-->

---
transition: fade-out
---

# Composables 套件

useDisplay / useTheme / useLocale / useDate

<v-click>

```vue
<script setup lang="ts">
import { useDisplay, useTheme, useLocale, useDate } from "vuetify";

// 1) useDisplay：响应式断点 + 平台检测
const { xs, sm, md, lg, xl, mobile, mdAndUp, platform } = useDisplay();
console.log(mobile.value);          // 是否移动端
console.log(mdAndUp.value);         // 是否 >= md 断点
console.log(platform.value.ios);    // 是否 iOS

// 2) useTheme：主题切换
const theme = useTheme();
theme.toggle();

// 3) useLocale：语言切换
const { current } = useLocale();
current.value = "en";

// 4) useDate：日期适配器
const date = useDate();
const today = date.date();
const formatted = date.format(today, "fullDate");   // "May 19, 2026"
const tomorrow = date.addDays(today, 1);
</script>
```

</v-click>

<v-click>

| Composable    | 主要 API                                       | 用途                       |
| ------------- | ---------------------------------------------- | -------------------------- |
| `useDisplay`  | xs/sm/md/lg/xl, mobile, mdAndUp, platform      | 响应式断点 + 平台检测      |
| `useTheme`    | theme.global.name, toggle, change, cycle       | 主题切换                   |
| `useLocale`   | current, t, fallback, isRtl                    | 语言切换                   |
| `useDate`     | date, format, addDays, isAfter                 | 日期适配（dayjs / luxon）  |

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vuetify 的 4 大 composable 是「Vue 3 风格 API」的核心 ——
所有运行时状态都通过 composable 访问，与 setup 语法无缝。

useDisplay：响应式断点 + 平台
- xs / sm / md / lg / xl：当前断点（ref<boolean>）
- mobile：是否移动端断点（< sm）
- mdAndUp / lgAndUp 等：组合断点
- platform.ios / .android / .mac / .windows：平台检测
- 用于「响应式布局 + 条件渲染」—— mobile 时隐藏侧栏 / 桌面端显示更多列

useTheme：主题切换
- theme.global.name / current / themes：状态访问
- toggle / change / cycle：切换方法（v3.10+ API）

useLocale：语言切换
- current：当前 locale ref
- t(key)：翻译（少用）
- isRtl：当前是否 RTL

useDate：日期适配（v3.4+ 新增）
- 默认使用 @date-io/date-fns 适配器
- 可换成 dayjs / luxon / moment 等
- 在 createVuetify 中配 `date.adapter` 切换

[click] 实战场景：

响应式渲染：
```vue
<v-col :cols="mobile ? 12 : 6">
```

主题切换 + 持久化：
```ts
const theme = useTheme()
const stored = useStorage('theme', 'light')
watchEffect(() => theme.change(stored.value))
```

日期格式化（接 dayjs）：
```ts
const date = useDate()
const display = date.format(item.createdAt, 'keyboardDate')  // 2026-05-19
```

这些 composable 与 VueUse 风格一致 —— 都是「响应式 ref + 函数」组合，与 `<script setup>` 无缝。
-->

---
transition: fade-out
---

# SSR + Nuxt 集成

vuetify-nuxt-module 一键启用

<v-click>

**1. 安装 Nuxt 模块**

```bash
pnpm i -D vuetify-nuxt-module
```

</v-click>

<v-click>

**2. nuxt.config.ts 配置**

```ts
export default defineNuxtConfig({
  modules: ["vuetify-nuxt-module"],
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: "light",
        themes: { light: { colors: { primary: "#1867C0" } } },
      },
      icons: {
        defaultSet: "mdi",
      },
      defaults: {
        VBtn: { variant: "elevated" },
      },
    },
    moduleOptions: {
      ssrClientHints: { reloadOnFirstRequest: false },
      styles: { configFile: "assets/settings.scss" },
    },
  },
});
```

</v-click>

<v-click>

> 💡 **零样板**：模块自动处理 SSR 水合、样式注入、主题持久化、字体预加载。

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] vuetify-nuxt-module 是「Nuxt + Vuetify」官方推荐方案 ——
不是 Vuetify 团队维护，而是 userquin 等社区核心成员维护，质量极高（与 Nuxt 团队深度协作）。

它的核心价值：「零配置 SSR」——
- 自动注入 plugin（不用手写 plugins/vuetify.ts）
- 自动注册组件（auto-import，模板里直接用）
- 自动按需加载 CSS
- 自动处理 SSR 水合（不会闪烁 / 不会样式错乱）

[click] vuetifyOptions 字段：完全复用 createVuetify 的配置结构 ——
- theme：主题
- icons：图标
- defaults：全局默认 props
- locale：国际化

moduleOptions 字段：是 Nuxt 模块特有配置 ——
- ssrClientHints：SSR 客户端提示（响应式断点 SSR 渲染优化）
- styles.configFile：自定义 SCSS 入口（深度主题定制）
- importComposables：是否自动 import useDisplay 等 composable

[click] 不用 Nuxt 模块的「手动 SSR 模式」（适合 Vite SSR / Quasar 等）：

```ts
// entry-server.ts
import { createSSRApp } from 'vue'
import { createVuetify } from 'vuetify'

export function createApp() {
  const app = createSSRApp(App)
  const vuetify = createVuetify({ ssr: true })  // ssr: true 是关键
  app.use(vuetify)
  return { app, vuetify }
}
```

`ssr: true` 让 Vuetify 知道当前在 SSR 环境，使用 useId() 等 SSR 安全 API。
配合 server.ts 调用 renderToString 即可。

但绝大多数项目都用 vuetify-nuxt-module —— 它把 Nuxt + Vuetify 的所有边角料都处理掉了。
-->

---
transition: fade-out
---

# 反馈组件三件套

v-alert / v-snackbar / v-dialog

<v-click>

**v-alert（行内警告，永久显示）**

```vue
<v-alert type="success" title="保存成功" closable>
  数据已保存到服务器
</v-alert>

<v-alert type="error" variant="tonal" prominent>
  操作失败，请稍后重试
</v-alert>
```

</v-click>

<v-click>

**v-snackbar（短暂提示，底部弹出）**

```vue
<v-snackbar v-model="snackbar" color="success" timeout="3000">
  操作成功
  <template #actions>
    <v-btn variant="text" @click="snackbar = false">关闭</v-btn>
  </template>
</v-snackbar>
```

</v-click>

<v-click>

**v-dialog（模态对话框，强制交互）**

```vue
<v-dialog v-model="dialog" max-width="500">
  <v-card>
    <v-card-title>确认删除？</v-card-title>
    <v-card-text>删除后不可恢复，确认继续？</v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="dialog = false">取消</v-btn>
      <v-btn color="error" variant="elevated" @click="confirm">删除</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
```

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v-alert 是「行内警告」组件 —— 嵌入到页面内容流，永久显示直到关闭。
- type：success / warning / error / info（决定颜色 + 图标）
- variant：elevated / flat / tonal / outlined / text（视觉变体）
- prominent：突出显示（更大尺寸 + 大图标）
- closable：显示关闭按钮

适合「重要通知 / 系统公告 / 错误说明」等需要持续展示的场景。
不会主动消失 —— 用户阅读后手动关闭。

[click] v-snackbar 是「短暂提示」—— 底部弹出，timeout 后自动消失。
- v-model 控制显示
- color：背景色（语义色名或 hex）
- timeout：自动消失时间（毫秒），-1 表示不自动消失
- location：位置（top / bottom / left / right）
- 嵌入 actions slot 可加交互按钮（如「撤销」）

适合「操作反馈 / 成功提示 / 网络异常提示」等瞬时反馈。
对比 Element Plus 的 ElMessage —— Vuetify 的 v-snackbar 是组件式（需要写 template），Element 是命令式（直接调函数）。

v3.5+ 新增 `v-snackbar-queue` —— 自动管理多个 snackbar 队列，避免同时弹多个互相覆盖。

[click] v-dialog 是「模态对话框」—— Element ElDialog 的对应。
- v-model 控制显示
- max-width：最大宽度
- persistent：点击遮罩 / 按 ESC 不关闭（强制交互）
- fullscreen：全屏模式（移动端常用）
- transition：进出动画

通常配合 v-card 使用（dialog 本身不带样式，需要 card 提供视觉容器）。
v-card-title / v-card-text / v-card-actions 三段式结构是 Material 标准。

注意：v-dialog 默认不带「确认 / 取消」按钮 —— 需要在 v-card-actions 内手动写。
对比 Element MessageBox.confirm 的「命令式 + 自带按钮」—— Vuetify 的写法更声明式但代码量稍多。
-->

---
transition: fade-out
---

# Material Design Icons 图标方案

字体方案 vs SVG 方案，按需选择

<v-click>

**方案一：MDI 字体（开箱即用）**

```ts
// main.ts
import "@mdi/font/css/materialdesignicons.css";

// createVuetify 默认就是 mdi 字体方案，无需额外配置
const vuetify = createVuetify({});
```

```vue
<v-icon icon="mdi-home" />
<v-btn prepend-icon="mdi-account" />
```

</v-click>

<v-click>

**方案二：MDI SVG（按需 + Tree-shake）**

```ts
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import { mdiAccount, mdiHome } from "@mdi/js";

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases: { ...aliases, account: mdiAccount },
    sets: { mdi },
  },
});
```

```vue
<script setup>
import { mdiHome } from "@mdi/js";
</script>

<template>
  <v-icon :icon="mdiHome" />
</template>
```

</v-click>

<v-click>

> 💡 **选择**：原型 / 演示用字体方案（一行 import 全部图标）；生产项目用 SVG 方案（仅打包用到的图标）。

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MDI 字体方案 —— 最简单的图标方案 ——

特点：
- 一行 `import '@mdi/font/css/materialdesignicons.css'` 加载全部 7K+ 图标
- 模板里直接用字符串 `icon="mdi-home"` 引用
- 浏览器加载一个 CSS + 一个 woff2 字体文件（约 ~200 KB）

优点：
- 配置零成本
- 用任意图标无需修改代码（数据库存图标名即可）
- 适合「图标多 / 经常变动 / 后台动态配置」场景

缺点：
- 字体文件大（200 KB），即使只用 10 个图标
- 首屏需要等字体下载，可能闪烁未渲染态

[click] MDI SVG 方案 —— 按需 + tree-shake 最优 ——

特点：
- 从 `@mdi/js` 按需 import 单个图标（每个图标 ~200 字节）
- 模板里传 SVG path 字符串而非图标名

优点：
- bundle 最小（仅打包用到的图标）
- 无字体加载，首屏更快
- tree-shake 友好（编译期确定哪些图标进 bundle）

缺点：
- 需要手动 import 每个图标
- 不能从字符串动态引用图标（数据库存图标名时需要写映射表）
- 配置稍复杂

[click] 选型建议：

原型 / 演示 / 内部工具：用 MDI 字体方案（一次配置全套图标）。
生产 C 端项目：用 MDI SVG 方案（性能优先 / bundle 最小）。
中后台后台动态图标：用 MDI 字体方案（图标可由后端配置）。

新版 Vuetify 还支持其它图标库：FontAwesome / Material Symbols / Tabler / Lucide / Unocss preset-icons。
社区主流选择：Material Symbols（Google 最新规范）+ MDI 兜底。
-->

---
transition: fade-out
---

# 生态对比：四大 Vue 3 UI 库选型

何时选 Vuetify，何时不选

<v-click>

**选 Vuetify 的场景**

- ✅ 产品定位 Material Design 风格（C 端 / 国际化 SaaS / 设计驱动产品）
- ✅ 需要多主题切换（5+ 主题动态切换）
- ✅ 跨国应用 + RTL 语言支持（中东 / 北非市场）
- ✅ 需要 100+ 组件覆盖度（包括 Timeline / Stepper / OtpInput 等冷门组件）
- ✅ 与 Nuxt 深度集成（vuetify-nuxt-module 一键启用）

</v-click>

<v-click>

**不选 Vuetify 的场景**

- ❌ 中国互联网中后台（Element Plus / Ant Design Vue 中文资源更丰富）
- ❌ 极简风 / 严肃风产品（Material Design 视觉太「重」）
- ❌ 移动端为主（vant / nutui 等专业移动库更适合）
- ❌ 包体积极致敏感（< 100 KB 限制下 Naive UI 更轻）
- ❌ 设计师执意自定义视觉（Vuetify 主题系统强大但仍跑不出 Material 框架）

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 选 Vuetify 的场景：

1. Material Design 风产品 —— 这是 Vuetify 唯一无敌的领域。
   Element Plus / Naive UI / Ant Design Vue 都不是 Material 风，要么改主题（费力）要么选 Vuetify。

2. 多主题切换 —— Vuetify 的 themes 是「命名空间」，理论上可注册无限多主题。
   Element Plus 主要支持 light/dark 二元切换，多主题需要写大量 CSS。

3. RTL 语言支持 —— Vuetify 是 Vue 生态对 RTL 支持最完整的库。
   Element Plus 的 RTL 支持比较弱，部分组件镜像不完整。

4. 100+ 组件覆盖 —— Vuetify 是 Vue 3 生态组件数最多的，包括很多冷门组件：
   - VOtpInput（验证码输入）
   - VStepperVertical（垂直步骤条）
   - VTimeline（时间线）
   - VTreeview（树状列表）
   - VConfirmEdit（内联编辑确认）—— Element 都没有

5. Nuxt 深度集成 —— vuetify-nuxt-module 是「Vue 3 + Nuxt」组合的事实标准。

[click] 不选 Vuetify 的场景：

1. 中国互联网中后台 —— 国内开发者更熟悉 Element Plus（饿了么）/ Ant Design Vue（蚂蚁），
   中文文档 / 教程 / 模板资源 Vuetify 偏少。

2. 极简风 / 严肃风 —— Vuetify 默认有阴影 / 涟漪 / 圆角，视觉「Material 化」。
   Naive UI 更适合极简风，Ant Design Vue 更适合严肃风。

3. 移动端为主 —— Vuetify 桌面端优化为主，移动端性能不如专门库（vant / nutui）。
   触摸交互、骨架屏、手势、底部抽屉等移动端高频场景 Vuetify 支持但不极致。

4. bundle 极小化 —— Vuetify 默认 ~200 KB（按需后），Naive UI 默认 ~80 KB。
   对 bundle 极致敏感的 C 端项目（首屏 LCP 关键）可选 Naive UI。

5. 设计师执意自定义 —— Vuetify 主题系统强大，但跑不出 Material 框架（圆角必有、阴影必有、涟漪必有）。
   完全自定义视觉的项目反而用 Headless UI（Reka UI 等）更自由。

选型逻辑总结：「Material 风 + 国际化 + Nuxt」三选一命中 → Vuetify。
否则就看团队熟悉度 + 业务定位。
-->

---
transition: fade-out
---

# 常见踩坑（一）：v-app 与样式

入门最高频的两类坑

<v-click>

**坑 1：忘记包 v-app，组件样式错乱**

</v-click>

<v-click>

```vue
<!-- ❌ 错：直接渲染 v-btn -->
<template>
  <v-btn>按钮</v-btn>
</template>

<!-- ✅ 对：必须包一层 v-app -->
<template>
  <v-app>
    <v-main>
      <v-btn>按钮</v-btn>
    </v-main>
  </v-app>
</template>
```

</v-click>

<v-click>

**坑 2：SSR 中样式闪烁（Flash of Unstyled Content）**

</v-click>

<v-click>

```ts
// main.ts —— 顺序关键
import "vuetify/styles";   // ✅ 必须放在第一行！
import { createApp } from "vue";
import { createVuetify } from "vuetify";

// SSR 模式必须传 ssr: true
const vuetify = createVuetify({ ssr: true });
```

</v-click>

<v-click>

> 💡 Nuxt 项目用 `vuetify-nuxt-module` 自动处理 SSR，避免手动配置。

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 坑 1：忘记包 v-app —— 是 Vuetify 新手 100% 会踩的坑。

[click] Vuetify 的所有组件都依赖一个「布局系统 + 主题系统 + 涟漪系统」的「应用上下文」，
这个上下文由 v-app 提供。

不包 v-app 的症状：
- 按钮看起来普通（涟漪效果失效）
- 主题色不生效（color="primary" 没颜色）
- v-app-bar / v-navigation-drawer 无法 fixed
- Dialog 弹层位置错乱（z-index 异常）

记住：「Vuetify 应用必须以 v-app 为根」，App.vue 的 template 最外层永远是 v-app。

[click] 坑 2：SSR 样式闪烁 —— Nuxt 集成的高频问题。

症状：页面首次加载时短暂显示「无样式版本」，几百毫秒后才应用 Vuetify 样式。

[click] 原因：CSS 加载顺序不对。

修复：
1. `import 'vuetify/styles'` 必须放在 main.ts 第一行（在 import App.vue 之前）
2. SSR 模式 `createVuetify({ ssr: true })` —— 启用 SSR 适配（useId 等 API 用 SSR 安全版本）

Nuxt 项目用 vuetify-nuxt-module 一键搞定 —— 自动注入 styles + ssr: true + 客户端水合 hint。

[click] vuetify-nuxt-module 还会注入 SSR Client Hints —— 服务端预渲染时根据 User-Agent 推测设备类型，
让 useDisplay 在 SSR 阶段就有正确的 xs/sm/md 值，避免「服务端渲染桌面版 → 客户端渲染移动版」的水合失败。

这是 Vuetify 团队精心打磨的 SSR 体验，远超 Element Plus 等同类库。
-->

---
transition: fade-out
---

# 常见踩坑（二）：使用层面

主题切换 / 表单校验 / DataTable

<v-click>

**坑 3：主题切换后 SSR 水合不匹配**

</v-click>

<v-click>

```ts
// ❌ 错：在客户端 mounted 后才设主题
onMounted(() => {
  const stored = localStorage.getItem("theme") ?? "light";
  theme.change(stored);   // 服务端是 light，客户端突然变 dark → 水合 mismatch
});

// ✅ 对：用 Nuxt cookie 持久化，服务端 / 客户端用同一值
// 或用 useStorage（在 created 阶段读取，client-only 模式）
```

</v-click>

<v-click>

**坑 4：v-data-table 行 key 警告**

</v-click>

<v-click>

```vue
<!-- ❌ 错：items 没有 id 字段，Vuetify 用 index 当 key -->
<v-data-table :items="rowsWithoutId" />

<!-- ✅ 对：明确指定 item-value 字段 -->
<v-data-table :items="rows" item-value="uuid" />
```

</v-click>

<v-click>

**坑 5：v-form 校验返回 Promise，必须 await**

</v-click>

<v-click>

```ts
// ❌ 错：valid 是 Promise 对象，永远 truthy
const valid = formRef.value.validate();
if (valid) submit();

// ✅ 对：解构 await
const { valid } = await formRef.value.validate();
if (valid) submit();
```

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 坑 3：SSR 主题切换水合不匹配 ——

[click] 经典症状：刷新页面瞬间看到「light → dark」闪烁，控制台报 hydration mismatch。

原因：
- 服务端渲染时不知道用户偏好（dark），按默认主题（light）渲染 HTML
- 客户端 mounted 后读 localStorage 发现是 dark，立刻切换 → DOM 与服务端 HTML 不一致

修复方案：
- Nuxt 项目用 useCookie 持久化（SSR 也能读到）
- 或在 createVuetify 之前在 server middleware / plugin 中读 cookie 设默认 theme
- vuetify-nuxt-module 内置 `ssrClientHints` 机制处理这类问题

[click] 坑 4：v-data-table 行 key 警告 ——

[click] 默认 v-data-table 用每行的 `id` 字段作为 Vue key。
如果数据没有 id 字段，Vue 用 index 当 key，会出现警告「Item must have unique key」+ 排序时行错位。

修复：明确指定 item-value="uuid"（或任意唯一字段），告诉 Vuetify 用哪个字段做 key。

特别注意：服务端分页时每页数据 id 唯一即可，不需要全局唯一。

[click] 坑 5：v-form validate 是异步 ——

[click] v3 的 validate() 返回 Promise<{ valid, errors }>（v2 是同步返回 boolean）。
新手习惯性写 `if (formRef.value.validate())` —— 这是判断 Promise 对象 truthy 永远进 if 分支。

正确写法：`const { valid } = await formRef.value.validate(); if (valid) ...`

注意 `valid` 是解构出来的 boolean，不是 ref ——不要再 .value 解开。

这是 v2 → v3 迁移最高频的踩坑，跟「rules 数组改写」并列。
-->

---
transition: fade-out
---

# 最佳实践清单

来自数千 Vuetify 项目的沉淀

<v-click>

**项目初始化**

- ✅ 必用 `pnpm create vuetify` 脚手架，省 30+ 分钟手动配置
- ✅ vite-plugin-vuetify 的 autoImport 保持默认 true
- ✅ SSR 项目用官方 `vuetify-nuxt-module`，不要手写 plugin

</v-click>

<v-click>

**主题与样式**

- ✅ JS Theme 对象定义主题色，不要写 SCSS 变量
- ✅ defaults 全局配 VBtn / VTextField / VCard 等高频组件的统一外观
- ✅ useTheme + useStorage 持久化主题偏好

</v-click>

<v-click>

**表单与表格**

- ✅ 复杂校验用 vee-validate 集成，简单校验用 rules 数组
- ✅ DataTable 必加 item-value，避免行 key 警告
- ✅ 大数据集用 v-data-table-server 服务端分页

</v-click>

<v-click>

**响应式与国际化**

- ✅ 用 useDisplay 而非 CSS @media 做条件渲染
- ✅ i18n 接 vue-i18n 适配器，业务文案 + 组件文案统一管理

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 项目初始化的几个关键决定：

`pnpm create vuetify` 是「最佳起点」—— 官方脚手架预配好 vite-plugin-vuetify、Vue Router、Pinia、ESLint、TypeScript、Vuetify plugin 入口、主题示例。
比手动配置省 30+ 分钟，且不容易踩坑。

vite-plugin-vuetify 的 autoImport: true 是默认值 —— 99% 项目保持默认即可。
关闭 autoImport 只有「自定义组件命名空间冲突」等极少数场景才需要。

SSR 项目必用 vuetify-nuxt-module —— 它处理了 hydration / styles / client hints 等所有边界情况。
手写 SSR plugin 容易遗漏，导致首屏闪烁 / 水合失败。

[click] 主题与样式：

Vuetify 3 的主题哲学是「JS Theme 对象优先」—— 在 createVuetify 中用 JS 对象描述颜色 / 暗色，
不用写 SCSS 变量（除非要覆盖 Vuetify 内部的设计 token，但 99% 项目不需要）。

defaults 是「设计系统统一」的核心机制 ——
全站 VTextField 都 outlined + comfortable density？一次配置全局生效。
全站 VBtn 都 elevated + primary？同上。
这种「props 层设计系统」比 SCSS 层更易维护、更易理解。

useTheme + useStorage 持久化 ——
```ts
const stored = useStorage('theme', 'light')
const theme = useTheme()
watchEffect(() => theme.change(stored.value))
```

[click] 表单与表格：

复杂表单（动态字段 / 跨字段联动 / 异步校验）一定要用 vee-validate ——
Vuetify 内置 rules 是「字段独立校验」，缺少跨字段依赖、Yup schema、字段数组等高级特性。

vee-validate 9.x 与 Vuetify 3 原生协作 —— 官方提供 v3 集成示例，代码量比 v2 少很多。

DataTable 必加 item-value —— 哪怕数据有 id 也建议显式指定（明确意图，避免维护时改字段名忘了改 item-value）。

服务端分页用 v-data-table-server —— 这是「真.大数据集」的唯一正确选择。
不要硬塞 10000 行进 v-data-table（虽然能跑但首屏渲染慢）。

[click] 响应式与国际化：

useDisplay 而非 @media —— useDisplay 是响应式 ref，可在 script 中用、可在 v-if 中用，比 CSS @media 灵活很多。
@media 只能控制样式，不能控制「是否渲染组件」（隐藏 vs 不挂载）。

i18n 接 vue-i18n 适配器是「业务 + 组件文案统一」的最佳实践 ——
所有翻译走 vue-i18n 系统（IDE 跳转、tools/CLI 提取、热更新），Vuetify 内置文案也自动跟着切换。
比维护两套翻译表（业务一套 + Vuetify 一套）省心得多。
-->

---
transition: fade-out
---

# 评价

设计成熟 / 组件最多 / Material 唯一，但视觉强势

<v-clicks>

**优点**

- 100+ 组件覆盖 Vue 生态最广，几乎不用找第三方
- Material Design 3 风格独此一家，C 端 / 国际化产品首选
- 主题系统强大：JS Theme + CSS 变量 + 多主题命名空间
- Composition API + Composables 高度 Vue 3 风格
- vite-plugin-vuetify 自动按需 + 自动样式按需
- vuetify-nuxt-module Nuxt 集成完美
- 50+ 语言 + RTL 完整支持，跨国 SaaS 首选

**缺点**

- 设计语言强势 —— 一眼能看出「这是 Vuetify」，自定义空间有限
- bundle 偏大（按需后 ~200 KB，比 Naive UI 大一倍）
- 中文资源弱于 Element Plus，国内文档 / 教程相对少
- v2 → v3 重写引发社区一定割裂，部分 v2 项目迁移困难
- 移动端性能一般，专门移动库（vant / nutui）更适合 H5

</v-clicks>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vuetify 的优点集中在「设计 + 组件 + 工程」三大维度 ——

100+ 组件是 Vue 3 生态最多的 —— 表单、表格、布局、反馈、导航全套覆盖。
Material Design 3 风格独此一家 —— 唯一严格贴合 Google 设计规范的 Vue 库。
主题系统是「JS Theme 对象 + CSS 变量」双层，多主题命名空间是杀手锏。
Composition API + Composables 与 Vue 3 哲学完美一致，与 VueUse 风格无缝。
vite-plugin-vuetify 自动按需是「现代项目应有的标配」，零成本工程化。
vuetify-nuxt-module 让 Nuxt 集成「零样板」，比手写 SSR plugin 强百倍。
50+ 语言 + RTL 是「跨国 SaaS」的硬需求支持。

[click] 缺点也很明确：

设计语言强势 —— Vuetify 的视觉「一眼能认出来」（圆角、阴影、涟漪、字体），自定义空间有限。
品牌方/设计师想要「独特视觉」时 Vuetify 难以完全满足，反而 Naive UI / Headless UI 更自由。

bundle 偏大 —— 按需后约 200 KB（含核心 + 几十个常用组件 + 样式）。
对比 Naive UI 约 80 KB，差异明显。
对 LCP 极致敏感的 C 端项目（电商首页）可能要选更轻的库。

中文资源弱于 Element Plus —— 国内开发者更熟悉 Element，问题搜索 / 模板代码 / 视频教程都更多。
Vuetify 主要是英文资源，国内门槛稍高。

v2 → v3 迁移问题 —— v2 项目升级 v3 几乎等于重写（API / 主题 / 工具链全变），
社区有一定割裂，部分 v2 项目长期停留在 v2 不升级。

移动端性能 —— Vuetify 桌面端优化为主，触摸交互、骨架屏、底部抽屉等移动端场景不极致。
H5 项目用 vant / nutui 等专业移动库更合适。

选型逻辑：
- Material 风 + 国际化 + Nuxt → Vuetify 几乎首选
- 国内中后台 → Element Plus
- 极简风 + bundle 敏感 → Naive UI
- 严肃风后台 → Ant Design Vue
- 移动端 H5 → vant / nutui

每个库都有自己的「黄金场景」，Vuetify 的黄金场景非常清晰。
-->

---
transition: fade-out
---

# 学习路径

从入门到企业级实战的 4 个阶段

<v-click>

**第 1 周：核心组件熟练**

- 跑通 `pnpm create vuetify` 脚手架，理解项目结构
- 通读官方文档 Application / Form / Data 三大分类
- 写一个 CRUD 页面（DataTable + Form + Dialog 三件套）

</v-click>

<v-click>

**第 2 周：主题 + Composables 精进**

- 实现多主题切换（light / dark / custom），useStorage 持久化
- 用 defaults 统一全站 VBtn / VTextField / VCard 外观
- 实现响应式布局（useDisplay 控制移动端 / 桌面端差异）

</v-click>

<v-click>

**第 3-4 周：企业级整合**

- 接入 Vue Router + Pinia + Vite + UnoCSS / Tailwind
- 实现 i18n（vue-i18n 适配器）+ RTL 切换
- 接入 ECharts / Apache Antv 等专业图表
- 配 vee-validate 处理复杂表单

</v-click>

<v-click>

**长期：Nuxt + SSR 深度**

- vuetify-nuxt-module 完整接入 Nuxt 项目
- 阅读 Vuetify 源码，理解 v-app / theme / composables 内部实现

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 第一周打基础 ——

`pnpm create vuetify` 是最快入门方式 —— 自动配好工程化，专注学组件。
官方文档结构清晰，Application（应用骨架）/ Form（表单）/ Data（数据展示）三大分类是基础。
完成一个 CRUD 页面就算入门 —— v-data-table 展示数据、v-form 编辑、v-dialog 承载、v-snackbar 反馈。

[click] 第二周进阶 ——

多主题切换是 Vuetify 的「软实力」分水岭 —— 跑通 light/dark/custom 三主题切换 + 持久化的开发者，
已经超过 80% 的同行。

defaults 是「设计系统」的核心 —— 全站统一外观一次配置生效，告别每个组件重复传 prop。

useDisplay 是「响应式开发」的核心 —— 学会用 ref<boolean> 控制条件渲染 + props 取值，
比 CSS @media 灵活得多。

[click] 第三到四周企业级整合 ——

单独的 Vuetify 是「组件库」，要变成「企业应用」需要拼接：
- Vue Router 4：路由系统
- Pinia：状态管理
- Vite：构建工具
- UnoCSS / Tailwind：原子 CSS（与 Vuetify 主题系统协作）
- vue-i18n + Vuetify locale 适配器：国际化
- vee-validate：复杂表单校验
- ECharts / Apache Antv：图表

这套技术栈是「Vue 3 + Material 应用」的事实标准。

[click] 长期投入推荐 Nuxt + SSR ——

vuetify-nuxt-module 接入 Nuxt 项目是「Vue 3 SaaS / 国际化产品」的最优解 ——
SSR + SEO + i18n + 主题持久化 + 客户端 hints 全部自动处理。

阅读源码推荐看：
- packages/vuetify/src/composables/theme.ts —— 主题系统实现
- packages/vuetify/src/composables/display.ts —— 响应式断点实现
- packages/vuetify/src/components/VApp/VApp.tsx —— v-app 根容器实现

这些都是「Vue 3 高级组件」的优秀教材。
-->

---
transition: fade-out
---

# 延伸学习资源

官方 + 社区精选

<v-click>

**官方资源**

- 📖 [Vuetify 官方文档](https://vuetifyjs.com/) —— 英文为主，质量第一档
- 🎮 [Vuetify Playground](https://play.vuetifyjs.com/) —— 在线编辑测试
- 💻 [GitHub](https://github.com/vuetifyjs/vuetify) —— 39K+ star
- 📺 [Vuetify Discord](https://community.vuetifyjs.com/) —— 活跃官方社区

</v-click>

<v-click>

**企业模板**

- [Materio](https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/) —— 商业模板，功能完整
- [Vuexy](https://demos.pixinvent.com/vuexy-vuejs-admin-template/) —— 经典 Vuetify 后台
- [Vuestic](https://github.com/epicmaxco/vuestic-admin) —— 免费开源后台

</v-click>

<v-click>

**配套技术栈**

- Vue Router 4 + Pinia + Vite + vuetify-nuxt-module = Vuetify 黄金组合
- vee-validate + Yup + VueUse + ECharts = 实用四件套
- vue-i18n + Vuetify locale 适配器 = 国际化标配

</v-click>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 官方资源是第一手信息 ——

官方文档英文质量极高，与 Vue / Nuxt 文档同档次。中文翻译相对滞后，建议直接读英文版。
Playground 是「踩坑前先试试」的最佳工具 —— 每个组件都能在线编辑代码 + 立即看到效果，比 jsfiddle / codepen 更聚焦 Vuetify 场景。
GitHub 仓库的 issue 区是「问题解答的金矿」—— 你的问题 90% 已经有人提过。
Discord 是 Vuetify 团队官方社区，遇到疑难直接问 maintainer，回复速度比 GitHub issue 快很多。

[click] 企业模板：

Materio：商业模板（约 $40），功能最完整，包含 JWT/ACL/Laravel/Nuxt/TypeScript/JavaScript 多版本。
Vuexy：另一商业模板（约 $30），经典 Vuetify 后台，更新维护活跃。
Vuestic：免费开源后台模板，质量不错，适合预算紧 / 个人项目。

商业模板的价值在于「省 30+ 小时的搭建时间」—— 登录、权限、菜单、表单设计、图表、暗色、i18n 全套现成。
个人项目用 Vuestic 起步，企业项目可考虑商业模板。

[click] 配套技术栈：

「Vue Router + Pinia + Vite + vuetify-nuxt-module」是 Vue 3 + Vuetify + Nuxt 的事实标准组合。
2024-2026 年 Vuetify 项目几乎都用这套架构。

vee-validate + Yup 是「企业级表单校验」的最佳组合 —— Yup 写 schema，vee-validate 处理 UI 绑定，
比 Vuetify 内置 rules 强大十倍。

VueUse 提供 200+ 实用 composable，与 Vuetify 完美协作（useStorage 持久化主题、useDark 系统跟随等）。

ECharts 是图表事实标准，Vuetify 主题色 + ECharts 配色协调起来效果极佳。

vue-i18n + Vuetify locale 适配器是「国际化标配」—— 一份翻译走全栈，覆盖业务文案 + 组件内置文案。
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 🎨

Vuetify — Vue 3 Material Design 的事实标准

<div class="mt-8 text-lg">

**核心心智**

- v-app 是必须的根容器，所有组件依赖它的「应用上下文」
- vite-plugin-vuetify 自动按需引入是现代项目标配，零配置工程化
- JS Theme 对象 + CSS 变量双层机制，多主题随便注册
- defaults 全局配 props，比 SCSS 变量更易维护
- Composables 四件套 useDisplay / useTheme / useLocale / useDate 是 Vue 3 风格的核心

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://vuetifyjs.com/" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/vuetifyjs/vuetify" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://play.vuetifyjs.com/" target="_blank" class="slidev-icon-btn">
    <carbon:play /> Playground
  </a>
</div>

<style>
h1 {
  background-color: #1867C0;
  background-image: linear-gradient(45deg, #1867C0 10%, #5CBBF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：Vuetify = Vue 3 Material Design UI 的事实标准 —— 100+ 组件 + 多主题 + 原生 Composables + RTL + Nuxt 完美。

核心心智五条：
1. v-app 是必须的根容器 —— 所有组件依赖它提供的「应用上下文」（主题、布局、涟漪）
2. vite-plugin-vuetify 自动按需引入是现代项目标配 —— 零配置工程化，bundle 减半
3. JS Theme 对象 + CSS 变量 —— 编译期定义主题色，运行时动态切换
4. defaults 全局配 props —— 比 SCSS 变量更易维护的「设计系统统一」机制
5. Composables 四件套 useDisplay / useTheme / useLocale / useDate —— Vue 3 风格的核心 API

下一步建议：跑 `pnpm create vuetify` 创建项目，跟着文档「Application」+「Form」+「Data」三大分类实战一个 CRUD 页面，
打通 v-app-bar + v-navigation-drawer + v-main 布局 + v-data-table + v-form + v-dialog —— 
之后再看 Vuetify 大型项目，就会有「一切尽在掌握」的感觉。

延伸学习：
- 主题 + 多主题切换 + i18n 三大「软实力」一定要花时间练
- Nuxt 项目必接 vuetify-nuxt-module，SSR 体验提升一个台阶
- 复杂表单接 vee-validate + Yup，业务表单不要再写 rules 数组

感谢观看！
-->
