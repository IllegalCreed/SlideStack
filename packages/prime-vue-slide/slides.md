---
theme: seriph
background: https://cover.sli.dev
title: Welcome to PrimeVue
info: |
  Presentation PrimeVue 4 for Vue 3 developers.

  Learn more at [https://primevue.org/](https://primevue.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎨</span>
</div>

<br/>

## PrimeVue — Most Complete UI Component Library for Vue

100+ 组件 / 4 主题预设 / Styled + Unstyled 双模式 —— 由 PrimeTek 出品，国外最丰富的 Vue UI 库，当前主线 v4.5+

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 PrimeVue —— PrimeTek 出品的 Vue 3 全功能 UI 组件库，
由土耳其团队 PrimeTek 主导设计与开发，PrimeFaces / PrimeNG / PrimeReact 系列的 Vue 版本，
2019 年立项，2023 年发布 v3，2024 年发布 v4 重构版，
当前主线 v4.5+（npm 上从 4.0 持续迭代到 4.5+）。

核心卖点：
- 100+ 高质量组件，国外 Vue UI 库中组件数最多
- 4 个内置主题预设（Aura / Material / Lara / Nora），覆盖不同设计风格
- Styled + Unstyled 双模式：开箱即用 vs 自定义到底
- PassThrough (pt) API 深度自定义组件内部 DOM
- 设计 token 三层架构（Primitive / Semantic / Component）
- WCAG 2.1 AA 无障碍合规
- 100% TypeScript，与 Volt UI（Tailwind v4 衍生库）配套

PrimeVue 在国外 Vue 生态拥有「最丰富的组件矩阵 + 最成熟的企业级配套」标签，
特别适合中后台 / 仪表板 / 复杂数据应用。
-->

---
transition: fade-out
---

# 什么是 PrimeVue？

为 Vue 3 应用提供「组件最全 + 主题最多 + 定制最深」的企业级 UI 库

<v-click>

- **100+ 组件**：Form / Button / Data / Panel / Overlay / Menu / Chart / Messages / File 等 11 大分组
- **4 个主题预设**：Aura（默认）/ Material（Google）/ Lara（Bootstrap 风）/ Nora（企业风）
- **Styled + Unstyled 双模式**：开箱即用，或剥离样式用 Tailwind / UnoCSS 重写
- **PassThrough API**：通过 pt 属性直达组件每一层内部 DOM
- **设计 token 架构**：Primitive → Semantic → Component 三层级联
- **CSS 变量驱动**：v4 重构后完全 CSS 变量（v3 是 SASS）
- **WCAG 2.1 AA 合规**：每个组件文档都有无障碍章节
- **Figma Kit + Templates**：商业模板与设计稿生态完整

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_PrimeVue Introduction_](https://primevue.org/introduction/)

</div>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeVue 的核心定位是「Vue 生态组件最全、主题最多、商业生态最成熟」——

它不像 Naive UI 追求设计感与类型完美主义，也不像 Element Plus 走中文社区路线，
而是「全场景覆盖 + 企业级配套」—— 后台、仪表板、电商、CRM 全都打通。

- 100+ 组件是国外 Vue 3 UI 库中最多的（Naive UI 90+、Vuetify 80+、Element Plus 60+）
- 4 个主题预设让你不用 SCSS / 不用写主题代码就能切换设计语言
- Styled + Unstyled 双模式是 v4 的杀手锏：既能开箱即用，也能完全用 Tailwind 重写
- PassThrough（pt）API 让你直达组件内部 DOM，完全摆脱「组件库 prop 不够用」的痛苦
- 设计 token 三层架构（v4 重构）让主题定制有了清晰的语义层级
- v4 已经完全脱离 SASS，全部用 CSS 变量驱动，构建更快、运行时主题切换更稳

下面会按「定位 → 安装 → 第一个组件 → 主题深度 → DataTable → Forms → Pt → Toast/Confirm → SSR → 对比」展开。
-->

---
transition: fade-out
---

# PrimeVue 的定位与生态

为什么国外 Vue 3 项目偏爱 PrimeVue？

<v-click>

| 维度          | PrimeVue            | Element Plus      | Vuetify 3       | Naive UI         | Ant Design Vue   |
| ------------- | ------------------- | ----------------- | --------------- | ---------------- | ---------------- |
| 框架绑定      | **Vue 3**           | Vue 3             | Vue 3           | Vue 3            | Vue 3            |
| 组件数量      | **100+**            | 60+               | 80+             | 90+              | 60+              |
| 主题预设      | **4 个内置**        | 1（中后台）       | 1（Material）   | 1（默认 + 暗）   | 1（Ant Design）  |
| 设计语言      | **多 Preset 切换**  | 中后台通用        | Material 3      | 现代简约         | Ant Design       |
| 样式方案      | **CSS 变量**        | SCSS + CSS vars   | SCSS + Theme    | CSS-in-JS        | LESS + Token     |
| 深度定制      | **pt + Unstyled**   | 自定义主题        | SCSS 变量       | themeOverrides   | LESS 变量        |
| Tailwind 集成 | **官方插件**        | 社区              | 社区            | 社区             | 社区             |
| 主导团队      | **PrimeTek（土耳其）** | 饿了么          | 社区 / Vuetify  | TUSEN AI         | 蚂蚁集团         |
| 国外人气      | **★★★★★**           | ★★★               | ★★★★            | ★★★★             | ★★★              |
| 中文生态      | ★★★                 | **★★★★★**         | ★★★             | ★★★★             | ★★★★             |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Vue 3 UI Comparisons_](https://primevue.org/)

</div>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比五大 Vue 3 UI 库，PrimeVue 的护城河是「组件数量 + 主题预设 + 深度定制」：

- 100+ 组件，国外 Vue 3 UI 库中数量第一
- 4 个内置主题预设 = 不写一行 SCSS 就能切换 4 套设计语言
- Styled + Unstyled 双模式 + pt API = 定制深度无人能及
- Tailwind 官方插件 tailwindcss-primeui = 现代项目无痛融合
- 国外人气远超国内（Discord 活跃 / Reddit r/vuejs 推荐 / Stack Overflow 答案多）

对比 Element Plus：
- 组件数 PrimeVue 多约 60%
- 主题切换 PrimeVue 更现代（4 preset vs 1 套）
- 但 Element Plus 中文社区压倒性优势

对比 Vuetify：
- PrimeVue 不绑定 Material Design（多 preset 自由）
- Vuetify 更追求 Material Design 一致性
- PrimeVue Tailwind 集成更原生

对比 Naive UI：
- PrimeVue 组件更全（100+ vs 90+）
- Naive UI TypeScript / 主题灵活度更胜
- PrimeVue 商业模板与设计资源更成熟

对比 Ant Design Vue：
- PrimeVue 设计自由度更高
- Ant Design Vue 强制 Ant Design 风格

选型逻辑：
追求组件全 / 多 preset / 商业模板 → PrimeVue；
追求中文生态 → Element Plus；
追求颜值类型 → Naive UI。
-->

---
transition: fade-out
---

# PrimeTek 与 PrimeVue 的历史

土耳其团队 / Prime 系列的 Vue 分支

<v-click>

| 时间       | 关键事件                                                       |
| ---------- | -------------------------------------------------------------- |
| 2008       | PrimeTek 成立，发布 PrimeFaces（JSF 组件库）                   |
| 2014       | PrimeUI 发布（jQuery 时代）                                    |
| 2016       | PrimeNG 发布（Angular 版）                                     |
| 2017       | PrimeReact 发布（React 版）                                    |
| 2019       | **PrimeVue 立项**（Vue 2 时代）                                |
| 2021       | PrimeVue 3.0，全面适配 Vue 3 Composition API                   |
| 2024       | **PrimeVue 4.0 重构**：脱离 SASS、CSS 变量、4 个 Preset、pt API |
| 2025       | Volt UI 发布（基于 PrimeVue Unstyled + Tailwind v4）           |
| 2025-26    | 当前主线 v4.5+，活跃迭代，14K+ GitHub star                     |

</v-click>

<v-click>

> 💡 **冷知识**：PrimeTek 是土耳其 Çağatay Çivici 创立的开源公司，旗下 Prime 系列覆盖 JSF / jQuery / Angular / React / Vue 五大框架，是「跨框架组件库」的代表企业。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeVue 的故事很特殊 —— 它不是「专门为 Vue 写的组件库」，
而是 PrimeTek 跨框架战略中的「Vue 分支」。

PrimeTek 是土耳其的开源公司，Çağatay Çivici 在 2008 年创立。
从 PrimeFaces（JSF 时代企业 Java 主流）开始，
逐步扩展到 PrimeUI（jQuery）→ PrimeNG（Angular）→ PrimeReact（React）→ PrimeVue。

「跨框架同一套设计语言」是 Prime 系列的核心战略 ——
同样的组件名、同样的 prop、同样的主题预设，在五个框架里都能用。
对 PrimeTek 来说，这是「一份设计、五份代码」的复用红利。

[click] 2024 年的 v4 重构是 PrimeVue 历史上最重要的版本：

主要变化：
- 完全脱离 SASS，全部用 CSS 变量（v3 是 SASS 编译）
- 引入设计 token 三层架构（Primitive / Semantic / Component）
- 4 个主题预设取代「一个 theme.css 文件」模式
- pt（PassThrough）API 全面 v2，所有组件支持
- @primevue/themes 包独立，主题切换更灵活
- 与 Tailwind 集成升级到 tailwindcss-primeui v0.5+
- 一系列组件改名：Calendar → DatePicker / Dropdown → Select / Sidebar → Drawer
- TriStateCheckbox / DataViewLayoutOptions 等被移除

v4 与 v3 不兼容 —— 升级需要走 Migration Guide，但 v4 的 DX 比 v3 优秀很多。

Volt UI（2025 年发布）是 PrimeTek 的新尝试 ——
基于 PrimeVue Unstyled + Tailwind v4，组件不再从 node_modules import，
而是「直接放进项目源码」当作个人 UI 库（类似 shadcn 思路）。
这是「下一代组件库交付方式」的探索，但还在早期。

PrimeVue 在 GitHub 14K+ star，国外 Reddit / Stack Overflow 资源极丰富 ——
但中文社区与 Element Plus / Ant Design Vue 还有差距。
企业选型：国际化项目 / 国外团队 / 跨框架项目 → 选 PrimeVue 是稳妥的。
-->

---
transition: fade-out
---

# PrimeVue 的核心理念

四条设计原则贯穿全部组件 API

<v-click>

**1. 完整性（Completeness）**

100+ 组件覆盖企业后台 / 仪表板 / 电商 / CRM 全场景 —— 不用拼接第三方库。

</v-click>

<v-click>

**2. 主题预设（Theme Presets）**

4 个开箱即用的主题（Aura / Material / Lara / Nora）—— 切换设计语言只改一行配置。

</v-click>

<v-click>

**3. 双模式（Styled / Unstyled）**

Styled 模式开箱即用，Unstyled 模式让 Tailwind / UnoCSS 完全接管样式 —— 一个组件库满足两种偏好。

</v-click>

<v-click>

**4. 深度可定制（Deep Customization）**

pt（PassThrough）API 让你直达每个组件的每一层内部 DOM —— 「组件库 prop 不够用」永远不存在。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 完整性是 PrimeVue 在 Vue UI 库中的最大杀手锏 ——
100+ 组件包含很多其他 UI 库没有的「冷门但实用」组件：

- 表单：FloatLabel、IftaLabel、IconField、InputOtp、Stepper
- 数据：TreeTable、PickList、OrderList、Timeline
- 上传：FileUpload（chunked + progress + dragdrop）
- 编辑器：Editor（基于 Quill）
- 媒体：Galleria、Image（zoom + preview）
- 图表：Chart.js 集成（10+ 图表类型）

这些组件在 Element Plus / Naive UI 都需要自己造或用第三方库 ——
PrimeVue 一站式提供，企业开发节省巨量时间。

[click] 主题预设是 PrimeVue v4 的核心创新 ——
4 个内置主题覆盖最常见的设计语言诉求：

- Aura：PrimeTek 自家设计，现代简约
- Material：Google Material Design v2 风格
- Lara：Bootstrap 启发，传统企业风
- Nora：Enterprise 应用美学，简洁高端

每个 preset 都是「完整设计 token 集合」—— 颜色 / 间距 / 圆角 / 阴影 / 动画全套。
切换 preset = 改 `theme.preset` 配置一行代码，整个应用换皮肤。

[click] Styled / Unstyled 双模式是 v4 的另一项突破 ——

Styled 模式（默认）：
- 引入完整 CSS 变量样式
- 4 个 preset 自由切换
- 适合「快速搭建后台」「不想花心思设计」

Unstyled 模式：
- 设 `unstyled: true` 关闭所有内置样式
- 用 pt + Tailwind / UnoCSS 完全接管
- 适合「严格设计规范」「品牌一致性要求高」

同一个组件库满足两种工作流，这是 PrimeVue 与 Element Plus / Vuetify 最大的差异。

[click] PassThrough API 让定制深度直达 DOM ——

每个 PrimeVue 组件都暴露内部 DOM 结构（root / header / body / content / icon ...），
你可以通过 pt 属性给任意层级加 class / style / 事件。

例子：DataTable 的某一列单元格加 hover 高亮 —— pt 直接加 onMouseenter。
DataPicker 弹出层加自定义边框 —— pt 直接改 panel 的 class。

「组件库 prop 不够用」这个痛点，PrimeVue 用 pt 彻底解决。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与初始化

3 分钟接入 Vue 3 项目

::left::

<v-click>

**安装**

```bash
pnpm add primevue @primeuix/themes
# 或
npm install primevue @primeuix/themes
```

**图标包（可选）**

```bash
pnpm add primeicons
```

| 版本   | Vue 兼容  | 状态                 |
| ------ | --------- | -------------------- |
| v4.x   | Vue 3.4+  | **当前主线**         |
| v3.x   | Vue 3.0+  | 维护中               |

</v-click>

::right::

<v-click>

**入口注册（main.ts）**

```ts
import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import "primeicons/primeicons.css";
import App from "./App.vue";

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: "system",
      cssLayer: false,
    },
  },
});

app.mount("#app");
```

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeVue 安装两个包：
- `primevue` 主体组件库
- `@primeuix/themes` 主题包（4 preset + definePreset 工具）

primeicons 是配套图标包（基于 SVG webfont），不是必须 —— 但很多 PrimeVue 组件
默认用 pi 系列图标（pi pi-check / pi pi-times）—— 装上节省「自己找图标库」时间。

v4.x 是当前主线，需要 Vue 3.4+（Composition API + script setup 全面支持）。
v3.x 还在维护，但建议新项目直接上 v4。

[click] 入口配置 PrimeVue 是「单插件 + 选项对象」模式 ——
不需要像 Naive UI 那样嵌套多个 Provider，一行 app.use 搞定。

theme.preset 接收 4 个内置预设之一：
- Aura（默认推荐）：PrimeTek 自家现代设计
- Material：Google Material 风
- Lara：Bootstrap 风
- Nora：企业应用美学

theme.options 配置三个关键参数：
- prefix: 'p' —— CSS 变量前缀（生成 --p-primary-500 等）
- darkModeSelector: 'system' / '.dark' / 自定义 —— 暗色模式触发器
- cssLayer: false / true / 自定义 layer 名 —— CSS layer 隔离

后面会展开讲 cssLayer 在「与 Tailwind 共存」场景的重要性。

PrimeVue 4.x 的入口是「平铺式」——
所有配置都在 app.use 一次完成，
比 v3 时代「Provider 嵌套 + 全局 import CSS」简化很多。
-->

---
transition: fade-out
---

# 4 个内置主题预设

Aura / Material / Lara / Nora 切换设计语言只改一行

<v-click>

| Preset       | 设计风格               | 灵感来源              | 适合场景             |
| ------------ | ---------------------- | --------------------- | -------------------- |
| **Aura**     | 现代简约 / PrimeTek 出品 | 自家设计              | 默认推荐 / 通用      |
| **Material** | Material Design v2     | Google Material       | 移动端 / 谷歌生态项目 |
| **Lara**     | Bootstrap 启发         | Bootstrap 5           | 传统企业 / 后台      |
| **Nora**     | 企业应用美学           | Enterprise SaaS       | 高端商业 / 设计感强   |

</v-click>

<v-click>

```ts
// 切换 preset = 改一行 import
import Aura from "@primeuix/themes/aura";
import Material from "@primeuix/themes/material";
import Lara from "@primeuix/themes/lara";
import Nora from "@primeuix/themes/nora";

app.use(PrimeVue, { theme: { preset: Nora } });
```

</v-click>

<v-click>

> 💡 **要点**：4 个 preset 都是「完整 token 集合」—— 切换后整个应用换皮肤（颜色 / 间距 / 圆角 / 阴影 / 动画都变）。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 4 个 preset 对应不同的设计哲学 ——

Aura 是 PrimeTek 自家设计，特点：
- 圆角偏大（borderRadius: 6px）
- 主色 emerald（绿色）
- 动画柔和（200ms ease-in-out）
- 颜值在 4 个 preset 中最高
- 适合「不知道选什么就选 Aura」

Material 严格遵循 Google Material Design v2 ——
- 主色 indigo（蓝色）
- 阴影分明（elevation 0-24）
- Ripple 涟漪动画
- 适合「项目设计稿就是 Material 风格」

Lara 从 Bootstrap 5 启发 ——
- 主色 blue（Bootstrap primary blue）
- 圆角 6px
- 阴影中等
- 适合「团队习惯 Bootstrap」「迁移自 Bootstrap 项目」

Nora 是企业级设计 ——
- 颜色更克制（中性灰 + 重点色）
- 间距更大（卡片 padding 32px）
- 整体留白更多
- 适合「高端 SaaS」「设计感强的企业应用」

[click] 切换 preset 实操：
- 改一个 import，整个应用换皮肤
- 不需要重新编译（v4 是 CSS 变量驱动）
- 同一个项目可以做 4 个对比 demo

[click] preset 是「完整 token 集合」—— 切换的不只是颜色 ——
- 颜色 token：primary / surface / success / warning ...
- 间距 token：padding / margin / gap ...
- 圆角 token：rounded / pill ...
- 阴影 token：shadow / focusShadow ...
- 动画 token：transitionDuration / easing ...
- 字体 token：fontSize / fontWeight ...

所以「切换 preset」≠「换颜色主题」—— 是「换整套设计语言」。
这是 PrimeVue 与其他 UI 库（一般只支持改主色 / 暗色切换）最大的差异。
-->

---
transition: fade-out
---

# 第一个组件：Button

熟悉的味道，severity / variant / size 三档

<v-click>

```vue
<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";

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
  <Button label="提交订单" :loading="loading" @click="handleSubmit" />
  <Button label="成功" severity="success" />
  <Button label="警告" severity="warn" />
  <Button label="危险" severity="danger" outlined />
  <Button icon="pi pi-plus" rounded />
</template>
```

</v-click>

<v-click>

| Prop              | 取值                                                                  | 说明           |
| ----------------- | --------------------------------------------------------------------- | -------------- |
| `severity`        | primary / secondary / success / info / warn / help / danger / contrast | 颜色语义       |
| `variant`         | outlined / text / link                                                | 变体（替代 outlined / text prop） |
| `size`            | small / large（默认中等）                                             | 尺寸           |
| `raised` `rounded` `text` `outlined` `plain` | boolean                                              | 形态变体       |
| `loading` `disabled` | boolean                                                            | 状态           |

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeVue Button 是「最简单的组件」—— 一个 Button 就能展示 PrimeVue 的 API 哲学。

注意几个 PrimeVue 特色：
- 组件用 PascalCase（&lt;Button&gt;）而不是 kebab-case —— Vue 3 推荐写法
- `severity` 取代「type」—— 更符合 ARIA 语义（severity = 严重程度）
- 八个 severity 值：primary / secondary / success / info / warn / help / danger / contrast
- contrast 是 v4 新增：在背景色基础上「反相对比」—— 暗色背景白底，浅色背景黑底
- help 也是少见：紫色系，介于 info 和 secondary 之间

icon 用 `pi pi-plus` 是 primeicons 的 class 写法（webfont 风格）——
也可以用 `<i class="pi pi-plus" />` 内嵌图标，pt 加 SVG，或换 lucide-vue 等第三方。

[click] severity 八值的设计意图：

- primary：主操作（提交、保存）
- secondary：次操作（取消、返回）
- success：积极反馈（已完成、成功）
- info：中性信息
- warn：警示（注意事项）
- help：辅助（帮助、引导）—— 紫色，区别 info
- danger：危险（删除、解绑）
- contrast：反相高亮（与背景反差）—— v4 新增，用于强调

这套 severity 体系 Tag、Message、Toast 等组件全部共享，记忆负担小。

variant 是 v4 新增 prop —— 替代 v3 的 outlined / text prop 写法：
- variant="outlined" 边框透明背景
- variant="text" 无边框无背景（类似文字按钮）
- variant="link" 像链接一样（带下划线悬停）

形态变体（raised / rounded / outlined / text / plain）可以组合，
理论上几十种组合覆盖所有 UI 场景。
-->

---
transition: fade-out
---

# 按需引入：PrimeVueResolver

中大型项目推荐，自动 import + tree-shaking

<v-click>

**1. 安装 unplugin 依赖**

```bash
pnpm add -D unplugin-vue-components @primevue/auto-import-resolver
```

</v-click>

<v-click>

**2. 配置 vite.config.ts**

```ts
import { defineConfig } from "vite";
import Components from "unplugin-vue-components/vite";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        PrimeVueResolver(),
      ],
    }),
  ],
});
```

</v-click>

<v-click>

> 💡 **效果**：模板里直接写 &lt;Button&gt;、&lt;DataTable&gt;、&lt;Dialog&gt;，自动 import + tree-shaking 优化打包。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 按需引入是中大型 PrimeVue 项目「必选」——
100+ 组件如果全量打包，bundle 会很大；
按需引入让 Vite + Rollup 只打包用到的组件。

两个包：
- unplugin-vue-components 扫描模板，自动 import 模板里写的组件
- @primevue/auto-import-resolver 告诉 unplugin「Button / DataTable / Dialog 都来自 primevue」

[click] vite.config.ts 配置非常简洁 ——
只需一个 resolver，PrimeVueResolver 自动处理路径解析。

PrimeVueResolver 支持的功能：
- 解析组件名 → 'primevue/button' / 'primevue/datatable' 路径
- 自动处理别名（Calendar → DatePicker 等 v4 改名）
- Tree-shaking 友好（只 import 用到的组件）

注意：与 Naive UI 不同，PrimeVue 还需要 import 主题 CSS ——
但主题 CSS 是「全局一次性 import」（main.ts 里 import primeicons.css），
不需要每个组件单独 import 样式（v4 全 CSS 变量驱动）。

[click] 实际开发体验：
模板里写 `<Button label="提交" />` —— 不用手动 import Button
脚本里调用 `useToast()` —— 但服务（Toast / Confirm / Dialog 等）需要 app.use 注册

PrimeVue 4.x 的服务模式：
- 组件可以自动 import（Button / DataTable / Calendar 等）
- 服务必须显式 app.use（ToastService / ConfirmationService / DialogService）
- 服务 Composable（useToast / useConfirm / useDialog）从 'primevue/usexxx' 引入

这种「组件自动 + 服务显式」的模式比 Naive UI 的「Provider 嵌套」简单很多。
-->

---
transition: fade-out
---

# 100+ 组件分组速览

按使用场景组织，11 大分组覆盖企业应用全场景

<v-click>

| 分组             | 代表组件                                                              |
| ---------------- | --------------------------------------------------------------------- |
| **Button**       | Button / ButtonGroup / SpeedDial                                      |
| **Form**         | InputText / Textarea / Password / Checkbox / Select / DatePicker / FileUpload |
| **Data**         | DataTable / DataView / Tree / TreeTable / Timeline / OrderList / PickList |
| **Panel**        | Panel / Accordion / Card / Divider / Fieldset / Splitter / Tabs / Stepper |
| **Overlay**      | Dialog / Drawer / Popover / ConfirmDialog / ConfirmPopup / Tooltip   |
| **File**         | FileUpload                                                            |
| **Menu**         | Menu / Menubar / TieredMenu / ContextMenu / Breadcrumb / Steps / Dock |
| **Chart**        | Chart（基于 Chart.js）                                                |
| **Messages**     | Toast / Message / InlineMessage                                       |
| **Media**        | Carousel / Galleria / Image                                           |
| **Misc**         | Avatar / Badge / Chip / Tag / ScrollPanel / Skeleton / Terminal       |

</v-click>

<v-click text-xs class="mt-2">

> 💡 **设计原则**：高频组件（Button / InputText / DataTable）API 极简；低频组件（Tree / PickList / Editor）功能完整。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 100+ 组件听起来多，但按 11 大分组记忆很容易上手：

Button 类：单按钮、按钮组、悬浮按钮（SpeedDial 类似 FAB）

Form 类（最大分组）：
- 文本输入：InputText、Textarea、Password、InputOtp（验证码输入）、InputMask（掩码）、InputNumber
- 选择类：Select（v3 叫 Dropdown）、MultiSelect、Listbox、SelectButton、TreeSelect
- 日期类：DatePicker（v3 叫 Calendar）
- 切换类：Checkbox、RadioButton、ToggleSwitch（v3 叫 InputSwitch）、ToggleButton
- 高级：Slider、Rating、ColorPicker、AutoComplete、CascadeSelect、Knob
- 上传：FileUpload（chunked + multi-part + drag）
- 表单容器：FloatLabel、IftaLabel、IconField、Fluid

Data 类：
- DataTable：最重磅（虚拟滚动、行编辑、分组、lazy load、行展开）
- DataView：卡片式列表
- Tree：树形展示
- TreeTable：树 + 表格（Excel 折叠树）
- VirtualScroller：虚拟滚动容器
- Paginator：独立分页器
- PickList / OrderList：左右穿梭框 / 排序列表
- Timeline：时间线

Panel 类：
- Panel / Card：基础容器
- Accordion / Tabs：折叠 / 标签
- Stepper：步骤条
- Splitter：可拖拽分割面板
- Fieldset：带标题的边框组
- ScrollPanel / Toolbar / Divider

Overlay 类：
- Dialog：模态对话框
- Drawer：侧边抽屉（v3 叫 Sidebar）
- Popover（v3 叫 OverlayPanel）：轻量浮层
- ConfirmDialog / ConfirmPopup：确认弹窗
- Tooltip / DynamicDialog

File 类：FileUpload 独立分组（功能极强）

Menu 类：6 种菜单（Menu / Menubar / TieredMenu / ContextMenu / Breadcrumb / Steps / Dock）

Chart：基于 Chart.js 的图表集成

Messages：Toast / Message / InlineMessage 三档反馈

Media：Carousel / Galleria / Image（zoom + preview）

Misc：Avatar / Badge / Chip / Tag / Skeleton / Terminal 等小工具

[click] PrimeVue 的「冷门但实用」组件特别多：
- SpeedDial（悬浮 FAB）
- OrderList / PickList（穿梭框）
- TreeTable（树 + 表格）
- Knob（旋钮）
- InputOtp（OTP 验证码）
- Galleria（画廊）
- Editor（富文本，基于 Quill）
- Terminal（命令行模拟）

这些在 Element Plus / Naive UI 都没有，要自己造。
-->

---
transition: fade-out
---

# Form 组件深度（一）：InputText / Select

文本输入 + 下拉选择最常用三件套

<v-click>

```vue
<script setup lang="ts">
import { ref } from "vue";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Textarea from "primevue/textarea";

const name = ref("");
const city = ref(null);
const cities = ref([
  { name: "北京", code: "BJ" },
  { name: "上海", code: "SH" },
  { name: "广州", code: "GZ" },
]);
</script>

<template>
  <InputText v-model="name" placeholder="请输入姓名" />
  <InputText v-model="name" size="small" />
  <InputText v-model="name" size="large" variant="filled" :invalid="!name" />

  <Select v-model="city" :options="cities" optionLabel="name" placeholder="选择城市" />

  <Textarea v-model="description" rows="5" cols="30" autoResize />
</template>
```

</v-click>

<v-click>

> 💡 **v4 改名**：Calendar → DatePicker / Dropdown → Select / InputSwitch → ToggleSwitch / Sidebar → Drawer / OverlayPanel → Popover

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeVue 的 Form 组件 API 设计非常规整 ——
所有组件都遵循同样的 prop 模式：

通用 props（所有 Form 组件共享）：
- v-model：值绑定（不是 v-model:value）
- size: 'small' / 'large'（默认中等）
- variant: 'outlined'（默认）/ 'filled'
- invalid: boolean 表示错误状态（红色边框）
- disabled / readonly / placeholder

这种「规整」让记忆负担很小 —— 记住一个组件的 prop，其他组件几乎一样。

InputText 是最基础的文本输入：
- v-model 直接绑值
- size 三档
- variant 两种：outlined（边框）/ filled（背景色填充）
- invalid: true 显示红色错误状态（配合 Form library 自动管理）

Select（v3 叫 Dropdown）：
- options 数组（每项可以是 object）
- optionLabel: 'name' 告诉 PrimeVue 显示哪个字段
- v-model 默认返回整个 object（也可以 optionValue: 'code' 只返 code）
- 支持 filter / virtualScrollerOptions / loading 等高级特性

Textarea 比 native textarea 多了 autoResize（自动撑高）。

[click] v4 改名是必须记的「迁移坑」：
- Calendar → DatePicker（更清晰）
- Dropdown → Select（与 HTML <select> 对齐）
- InputSwitch → ToggleSwitch（更精确）
- Sidebar → Drawer（与 Material / Ant 等对齐）
- OverlayPanel → Popover（与 Tailwind / shadcn 对齐）
- TabView → Tabs
- TabPanel → Tab

从 v3 升级 v4 必须改 import 和模板，这部分是 Migration Guide 的重头戏。

新项目直接用 v4 名字，不要踩 v3 旧名的坑。
-->

---
transition: fade-out
---

# Form 组件深度（二）：DatePicker / FileUpload

日期选择 / 文件上传 / OTP 验证码

<v-click>

```vue
<script setup lang="ts">
import DatePicker from "primevue/datepicker";
import FileUpload from "primevue/fileupload";
import InputOtp from "primevue/inputotp";

const date = ref<Date | null>(null);
const dateRange = ref<Date[] | null>(null);
const otp = ref("");
</script>

<template>
  <DatePicker v-model="date" showTime hourFormat="24" />
  <DatePicker v-model="dateRange" selectionMode="range" :numberOfMonths="2" />
  <DatePicker v-model="date" view="month" dateFormat="mm/yy" />

  <FileUpload
    name="files[]"
    url="/api/upload"
    :multiple="true"
    accept="image/*"
    :maxFileSize="1000000"
    @upload="onUpload"
  />

  <InputOtp v-model="otp" :length="6" />
</template>
```

</v-click>

<v-click>

> 💡 **DatePicker 极强大**：date / time / range / month / year / multiple 六种模式，自带 i18n locale，无缝替代 dayjs/moment。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] DatePicker 是 PrimeVue Form 组件里最复杂、也最强大的之一 ——

selectionMode：
- 'single'（默认）：选单一日期
- 'multiple'：选多个日期（不连续）
- 'range'：选起止日期（区间）

view：
- 'date'（默认）：年月日完整选择
- 'month'：只选月
- 'year'：只选年
- 'time'：只选时间

showTime：显示时间选择（小时 / 分钟 / 秒）
hourFormat：'12' 或 '24'
numberOfMonths：同时显示几个月（区间选择常用 2）

dateFormat：日期格式（'dd/mm/yy'、'mm-dd-yyyy' 等）
minDate / maxDate：限制可选范围
disabledDates / disabledDays：禁用特定日期 / 星期

自带 locale：通过 PrimeVue locale 配置切换月份星期文字（中文 / 英文 / 日文等）
—— 不需要额外引入 dayjs locale。

[click] FileUpload 是 PrimeVue 最强大的组件之一：

基础功能：
- multiple：多文件
- accept：MIME 限制（'image/*'、'.pdf' 等）
- maxFileSize：单文件大小限制（字节）

高级功能：
- mode="basic"：简化模式（只是个 input file）
- mode="advanced"（默认）：完整 UI（拖拽 + 进度 + 预览）
- @upload @progress @error @select @clear @remove 事件全套
- customUpload + uploader prop：自定义上传逻辑（不用默认 XHR）
- chunkSize：分片上传支持

URL 模式：
- url prop：上传到指定 URL（默认 POST + multipart/form-data）
- 不传 url + customUpload：自己处理（比如阿里 OSS、腾讯 COS 直传）

InputOtp 是 v4 新增 —— 单独的 OTP 验证码输入：
- length="6" 表示 6 位
- v-model 返回拼接的字符串
- 自动 focus 下一位、删除回退
- 支持 mask（密码遮挡）
- 接收复制粘贴整个 OTP（智能分配到各位）

这些在国内项目高频用到，PrimeVue 一站式提供大幅节省时间。
-->

---
transition: fade-out
---

# @primevue/forms：表单库

Zod / Yup / Valibot 三大校验库官方集成

<v-click>

```bash
pnpm add @primevue/forms
```

```vue
<script setup lang="ts">
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(3, "用户名至少 3 个字符"),
  email: z.string().email("邮箱格式错误"),
  age: z.number().min(18, "需要年满 18 岁"),
});

const resolver = zodResolver(schema);
const initialValues = { username: "", email: "", age: 0 };

async function onFormSubmit({ valid, values, errors }) {
  if (valid) {
    await api.createUser(values);
  }
}
</script>

<template>
  <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit">
    <InputText name="username" placeholder="用户名" />
    <Message v-if="$form.username?.invalid" severity="error">
      {{ $form.username.error?.message }}
    </Message>
    <Button type="submit" label="提交" />
  </Form>
</template>
```

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @primevue/forms 是 PrimeVue v4 新引入的「表单状态管理 + 校验」库 ——
比传统的 :rules 配置式校验更现代化。

核心概念：
- Form 组件：包裹整个表单，管理状态 + 校验
- name 属性：每个 input 加 name 注册到 form state
- resolver：把 Zod / Yup / Valibot schema 转换成 PrimeVue 校验器
- $form 对象：通过 v-slot 暴露，包含每个字段的 valid / invalid / error / dirty / touched / value

三大校验库：
- Zod：TypeScript-first，国外最流行，类型推导极强
- Yup：JavaScript 老牌，社区资源多
- Valibot：新兴 minimal，bundle 极小（适合移动端）
- 还支持 Joi、Superstruct

resolver 函数：
- zodResolver(schema) → PrimeVue 内部校验器
- yupResolver(schema) → 同上
- valibotResolver(schema) → 同上
- 自定义 resolver：`async ({ values }) => ({ errors: {}, values })`

校验时机配置：
- validateOnSubmit（默认）：提交时校验
- validateOnBlur：失焦校验
- validateOnValueUpdate：实时校验（输入时）
- validateOnMount：挂载时校验（用于初始值校验）

[click] 这套表单库的优势：

1. **类型安全**：Zod schema 直接是 TypeScript 类型，自动推导 values 类型
2. **schema 复用**：同一个 Zod schema 前后端共用
3. **解耦**：校验逻辑与 UI 解耦，方便重构 + 测试
4. **错误信息丰富**：每个字段都有 valid / invalid / error / dirty / touched 状态

对比传统 :rules 配置：
- :rules 配置式校验：简单但难以处理复杂场景（条件校验 / 异步校验 / 跨字段联动）
- @primevue/forms：基于 schema，复杂场景天然支持

这是 PrimeVue 与 Element Plus / Naive UI 在表单校验上最大的差异 ——
PrimeVue 拥抱了「现代 JavaScript 校验生态」，
Element Plus / Naive UI 还是「自家 :rules 配置式」。
-->

---
transition: fade-out
---

# DataTable 重磅深度（一）：基础

100+ 组件里最强大的「表格之王」

<v-click>

```vue
<script setup lang="ts">
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  quantity: number;
}

const products = ref<Product[]>([
  { id: 1, code: "P001", name: "iPhone 15", category: "手机", quantity: 100 },
  { id: 2, code: "P002", name: "MacBook Pro", category: "电脑", quantity: 50 },
]);

const selectedProducts = ref<Product[]>([]);
</script>

<template>
  <DataTable
    v-model:selection="selectedProducts"
    :value="products"
    dataKey="id"
    selectionMode="multiple"
    tableStyle="min-width: 50rem"
    stripedRows
    showGridlines
    paginator
    :rows="10"
  >
    <Column selectionMode="multiple" headerStyle="width: 3rem" />
    <Column field="code" header="编号" sortable />
    <Column field="name" header="名称" sortable />
    <Column field="category" header="分类" sortable />
    <Column field="quantity" header="数量" sortable />
  </DataTable>
</template>
```

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] DataTable 是 PrimeVue 最强大的组件 —— 也是与 Element Plus / Naive UI 差异最大的组件。

声明方式：模板式声明（Column 子组件）—— 与 Element Plus 风格类似，与 Naive UI（JS 对象 columns）相反。

模板式声明的优势：
- 直观，Vue 模板开发者熟悉
- slot 自定义灵活（每列 #body / #header / #footer 都可以自定义）
- 与设计器工具兼容

劣势（vs Naive UI 的对象式）：
- 动态列稍麻烦（需要 v-for）
- 列定义无法独立保存到 store

核心 props：
- value：数据数组（必须）
- dataKey：行的唯一标识字段（多选 / 行编辑 / 行展开必须）
- selectionMode：'single' / 'multiple'（开启选择列）
- v-model:selection：选中的行（数组或单值）
- tableStyle / size：表格尺寸
- stripedRows / showGridlines：斑马纹 / 网格线
- paginator + rows：内置分页（不需要外接 Paginator）

Column props：
- field：关联 value 项的字段
- header：表头文字
- sortable：可排序（点表头切换）
- frozen：固定列
- style / headerStyle / bodyStyle：样式
- selectionMode="multiple" 在第一列：渲染多选 checkbox

排序 / 分页都内置 —— 比 Element Plus 配套更完整。

DataTable 与 Naive UI NDataTable 的取舍：
- DataTable：模板式，slot 灵活，新手友好
- NDataTable：对象式，TS 友好，动态列灵活
- 各有适用场景，看团队偏好。
-->

---
transition: fade-out
---

# DataTable 重磅深度（二）：虚拟滚动 + Lazy Load

10W+ 行数据丝滑滚动 / 服务端分页

<v-click>

**虚拟滚动（前端 10W+ 行）**

```vue
<DataTable
  :value="hugeData"
  :virtualScrollerOptions="{ itemSize: 46 }"
  scrollHeight="400px"
  tableStyle="min-width: 50rem"
>
  <Column field="id" header="ID" />
  <Column field="name" header="名称" />
</DataTable>
```

</v-click>

<v-click>

**Lazy Load（服务端分页 + 排序 + 过滤）**

```ts
const lazyParams = ref({ first: 0, rows: 10, sortField: null, sortOrder: null });
const totalRecords = ref(0);
const loading = ref(false);

async function loadLazyData(event) {
  loading.value = true;
  lazyParams.value = event;
  const { items, total } = await api.queryProducts(lazyParams.value);
  products.value = items;
  totalRecords.value = total;
  loading.value = false;
}
```

```vue
<DataTable
  :value="products" :totalRecords="totalRecords" :loading="loading"
  lazy paginator :rows="10" @page="loadLazyData" @sort="loadLazyData"
>
  …
</DataTable>
```

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 虚拟滚动是 PrimeVue DataTable 的杀手锏 —— 与 Naive UI virtualScroll 类似但配置更细致。

启用方式：
- `virtualScrollerOptions` 接收 `{ itemSize: 46 }` 必传 itemSize（行高，px）
- `scrollHeight="400px"` 限制容器高度（启用滚动）

工作原理：
- DOM 只渲染当前可视区域 + 上下缓冲区的行（通常 20-30 行）
- 滚动时复用 DOM 节点，更新内容
- 性能：10W+ 行也是 60fps 流畅

适用场景：
- 日志查看（百万条记录）
- 实时数据流（IoT / 监控）
- 大量历史订单（不分页一次性看）

注意：virtualScroller 要求每行高度固定，
不支持动态高度（这是虚拟列表的通用限制，可以用 itemSize 函数算精确值）。

[click] Lazy Load 是服务端分页 —— 与虚拟滚动是不同的概念！

- 虚拟滚动：数据全在前端，只渲染可视区域
- Lazy Load：每次只请求一页数据，分页器切换时再请求

启用方式：
- `lazy` prop 表示「服务端模式」（DataTable 不再前端切片）
- `totalRecords` 告诉分页器总条数
- `loading` 控制加载状态（自动遮罩 + 转圈）
- `@page` / `@sort` / `@filter` 事件触发请求

event 参数对象：
- first: 当前页第一条的 index
- rows: 每页条数
- sortField / sortOrder: 排序字段 / 方向
- filters: 过滤条件

实际项目中，「大数据 + 服务端」用 lazy + paginator，
「大数据 + 前端」用 virtualScroller，
「中等数据」直接 paginator 不开 lazy。

DataTable 还支持「行内编辑」「行展开」「行重排」「列重排」「列冻结」等高级功能 ——
这些功能完整度在 Vue 3 UI 库中无人能及。
-->

---
transition: fade-out
---

# Theming Styled：design tokens

设计 token 三层架构 —— Primitive / Semantic / Component

<v-click>

```ts
// 三层 token 架构示例
const Aura = {
  // 1. Primitive：原始色板（无语义）
  primitive: {
    blue: { 50: "#eff6ff", 500: "#3b82f6", 900: "#1e3a8a" },
    emerald: { 500: "#10b981" },
  },
  // 2. Semantic：语义 token（有上下文）
  semantic: {
    primary: {
      50: "{emerald.50}",
      500: "{emerald.500}",
      900: "{emerald.900}",
    },
    colorScheme: {
      light: { surface: { 0: "#ffffff", 100: "#f3f4f6" } },
      dark: { surface: { 0: "#020617", 100: "#1e293b" } },
    },
  },
  // 3. Component：组件级 token（按需）
  components: {
    button: { primary: { background: "{primary.500}" } },
  },
};
```

</v-click>

<v-click>

> 💡 **核心**：Primitive 是「色彩库」/ Semantic 是「主题映射」/ Component 是「细粒度覆盖」—— 改 Semantic 一行，全应用换色。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeVue v4 的主题系统是「Vue 3 UI 库设计上最先进的」——
对标 Tailwind v4 / shadcn 的 design token 体系。

三层 token 架构的设计哲学：

第一层 Primitive：
- 原始色板，无任何上下文语义
- 类似 Tailwind 的 colors 配置（blue-50 到 blue-900）
- 包含 100+ 颜色 token + 间距 / 圆角 / 阴影 / 字体 token
- 不直接被组件使用，只是「色彩库」

第二层 Semantic：
- 给原始色赋予语义（"primary" "surface" "success" "warn" ...）
- 用 `{token.path}` 语法引用 Primitive token
- 例如 `primary.500: '{emerald.500}'` —— primary 主色映射到 emerald 绿
- 改这一行 → 全应用主色变（不需要改 100 个组件）

第三层 Component：
- 组件级细粒度覆盖
- 例如 button.primary.background = '{primary.600}'（让按钮主色比 primary 深一档）
- 适合「全局主色不变，但按钮特别处理」的场景

这种三层架构的优势：
1. 改 Semantic 一行 = 全应用换色（不需要写 100 处 CSS 覆盖）
2. 不同 preset 共享相同的 Primitive（只是 Semantic 映射不同）
3. 设计师友好（先选色板，再选语义映射，最后细调组件）

CSS 变量驱动：
- 所有 token 编译成 CSS 变量（--p-primary-500 / --p-button-padding-x ...）
- 运行时切换主题 = 改 CSS 变量
- 不需要重新编译（v3 的 SASS 编译噩梦消失了）

darkModeSelector 决定如何切换暗色：
- 'system'：跟随系统 prefers-color-scheme
- '.my-app-dark'：当 html 有这个 class 时启用暗色（手动控制）
- false：禁用暗色

这套 token 架构在 4 个 preset 上一致，让定制成本可控。
-->

---
transition: fade-out
---

# Theming Styled：definePreset 自定义

在内置 preset 基础上微调

<v-click>

```ts
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{indigo.50}",
      100: "{indigo.100}",
      500: "{indigo.500}",
      900: "{indigo.900}",
      950: "{indigo.950}",
    },
    colorScheme: {
      light: { surface: { 50: "#fafafa", 100: "#f4f4f5" } },
      dark: { surface: { 0: "#18181b", 50: "#27272a" } },
    },
  },
});

app.use(PrimeVue, { theme: { preset: MyPreset } });
```

</v-click>

<v-click>

**运行时动态修改**

```ts
import { updatePreset, updatePrimaryPalette } from "@primeuix/themes";

// 完整替换 primary 色板
updatePrimaryPalette({ 500: "#FF6B35" });

// 合并 token 到当前 preset
updatePreset({ semantic: { primary: { 500: "{rose.500}" } } });
```

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] definePreset 是「基于已有 preset 微调」的标准模式 ——
不需要从零写一个 preset（那种工作量极大）。

工作流：
1. import 一个内置 preset（Aura / Material / Lara / Nora）
2. 用 definePreset 包裹，传入「想覆盖的 token」
3. 注册到 PrimeVue 配置

token 路径用 `{semantic.path}` 引用 Primitive ——
- `{indigo.500}` 引用预设的 indigo 色板
- 也可以直接写颜色值 `'#FF6B35'`

最常见的定制场景：
- 改 primary 色（品牌色）—— 改 semantic.primary
- 改 surface 色（背景 / 卡片）—— 改 semantic.colorScheme
- 改 borderRadius（更圆 / 更方）—— 改 semantic.borderRadius
- 改 typography（字体）—— 改 semantic.fontFamily

[click] 运行时动态修改是 PrimeVue v4 的杀手锏 ——
不需要重新挂载 app，CSS 变量实时更新。

usePreset()：替换整个 preset（重大切换，如 Aura → Material）
updatePreset()：合并 token 到当前 preset（局部调整）
updatePrimaryPalette()：快捷修改 primary 色板
$dt()：编程式访问 token 值（用于 inline style）

实际场景：
- 多租户 SaaS：每个租户登录后调用 updatePrimaryPalette 换品牌色
- 节日主题：圣诞节调用 updatePreset 换红绿配色
- 用户偏好：用户在设置页选「橙色 / 紫色 / 蓝色」→ updatePrimaryPalette 应用

代价：CSS 变量切换需要浏览器重排 + 重绘，
不像 Naive UI CSS-in-JS 那样响应式（但视觉效果一致）。

注意：updatePrimaryPalette 接收的对象会和当前 primary 合并 ——
传 `{ 500: '#FF6B35' }` 只改 500，其他 50-950 保留原值。
如果要全部替换，传完整的 50-950 对象。
-->

---
transition: fade-out
---

# Theming Styled：暗色模式

darkModeSelector 三种触发方式

<v-click>

```ts
// 方式 1：跟随系统（prefers-color-scheme）
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: { darkModeSelector: "system" },
  },
});

// 方式 2：手动控制（class 触发）
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: { darkModeSelector: ".my-app-dark" },
  },
});

// 切换函数
function toggleDarkMode() {
  document.documentElement.classList.toggle("my-app-dark");
}

// 方式 3：禁用暗色（只用浅色）
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: { darkModeSelector: false },
  },
});
```

</v-click>

<v-click>

> 💡 **VueUse 标准组合**：useDark + useToggle + darkModeSelector 配合，三行实现「自动跟随系统 + localStorage 持久化 + 手动切换」。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeVue 的暗色模式比其他 UI 库简洁 ——
不需要 import darkTheme（如 Naive UI），不需要切换 ConfigProvider，
只需配置 darkModeSelector 即可。

三种方式的适用场景：

darkModeSelector: 'system'（最简）
- 浏览器根据系统设置自动切换
- 用户改系统暗色 → 应用自动变暗
- 适合「不想加入主题切换按钮」的简单项目
- 缺点：用户不能在应用内手动切换

darkModeSelector: '.my-app-dark'（最常见）
- 当 html / body / 根元素有 .my-app-dark class 时启用暗色
- 完全手动控制（写一个 toggle 按钮）
- 配合 useDark from VueUse 可以「自动检测 + 持久化 + 手动覆盖」
- 这是 90% 项目的最佳实践

darkModeSelector: false
- 完全禁用暗色 token
- 适合「品牌只有浅色一套」「移动端浅色应用」
- 节省 CSS 变量数量（不生成暗色版本）

[click] VueUse useDark 标准组合：

```ts
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'my-app-dark',
  valueLight: '',
  storageKey: 'theme-mode',
})
const toggleDark = useToggle(isDark)
```

useDark 自动：
- 读取 localStorage 中的 'theme-mode' 偏好
- 没偏好则检测 prefers-color-scheme
- 切换时给 html 加 my-app-dark class
- 持久化到 localStorage

PrimeVue 通过 darkModeSelector: '.my-app-dark' 监听这个 class ——
useDark 加 class，PrimeVue 切换暗色 token，
整个应用换皮肤。

比 Naive UI 的 darkTheme ref 切换简单 —— 没有 Provider 嵌套。
比 Element Plus 的 html data-theme="dark" 更现代 —— 用 CSS 变量而非 import 多个 CSS。
-->

---
transition: fade-out
---

# Theming Unstyled：剥离样式

设 `unstyled: true` 让 Tailwind / UnoCSS 完全接管

<v-click>

```ts
// main.ts
app.use(PrimeVue, {
  unstyled: true,   // 全局禁用所有样式
});
```

```vue
<!-- 用 pt + Tailwind 自己写样式 -->
<Button
  label="提交"
  :pt="{
    root: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition',
    label: 'font-medium',
    icon: 'mr-2',
  }"
/>
```

</v-click>

<v-click>

**单组件 unstyled**

```vue
<Button label="自定义" icon="pi pi-check" unstyled />
```

</v-click>

<v-click>

> 💡 **Volt UI**：PrimeTek 2025 年推出的 Tailwind v4 衍生库 —— 基于 PrimeVue Unstyled + Tailwind 预制全套组件，类似 shadcn 思路。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Unstyled 模式是 PrimeVue v4 与 Naive UI / Element Plus 最大的差异 ——
其他 UI 库要么「全用自家样式」，要么「全用 Tailwind 重写」。
PrimeVue 提供「同一个组件库，两种工作流」。

Unstyled 模式的工作原理：
- 设 `unstyled: true` 后，PrimeVue 不再生成任何 CSS 变量 / 样式
- 组件渲染出 DOM 结构，但 class 是空的
- 你用 pt 给每个 DOM 加 class（通常是 Tailwind utility）

实际写法：
- 在 main.ts 全局开启 unstyled
- 在 PrimeVue 配置的 pt 选项中预设全局样式（避免每个组件重写）
- 单个组件如有特殊样式，再用 pt 局部覆盖

适合场景：
- 团队有严格设计系统（Figma → Tailwind utility 映射）
- 品牌一致性要求高（不能用 Aura 默认 emerald）
- 已有 Tailwind 项目想接入组件库
- 项目已经在用 shadcn-vue / radix-vue 等无样式库

不适合场景：
- 快速搭建后台（直接用 Styled + Aura 更快）
- 设计资源少（重新设计每个组件累）
- 团队不熟 Tailwind

[click] 单组件 unstyled 是中间路线 ——
项目整体用 Styled（开箱即用），但某些特殊组件用 unstyled 完全自定义。

例：DataTable 用默认样式（开箱即用），但项目头部的特殊 Button 用 unstyled + Tailwind。

[click] Volt UI 是 PrimeTek 2025 年的新尝试 ——
对标 shadcn 的「组件不在 node_modules，直接放在项目源码」模式。

工作流：
- 从 Volt 官网复制组件源码到自己项目
- 组件基于 PrimeVue Unstyled + Tailwind v4 写
- 你可以直接改源码（不需要 pt 覆盖）

优势：
- 完全掌控（源码在自己项目，没有 vendor lock-in）
- 升级渐进（不强制升级所有组件）
- 学习友好（读源码即学源码）

劣势：
- 没有自动更新（PrimeVue 升级，你的本地组件不自动同步）
- 维护成本高（自己负责修 bug + 改 API）

Volt 还在早期（2025-2026 发布），生态不如成熟 PrimeVue，但代表「下一代组件库交付方式」。
-->

---
transition: fade-out
---

# PassThrough (pt) 深度自定义

直达组件内部 DOM 的「上帝模式」

<v-click>

**基础用法**

```vue
<Panel header="标题" toggleable
  :pt="{
    root: 'border border-primary rounded-xl p-4',
    header: { class: 'flex items-center justify-between' },
    content: { class: 'text-primary-700 mt-4' },
    title: 'text-xl',
  }"
>
  内容
</Panel>
```

</v-click>

<v-click>

**声明式语法（v4 新增）**

```vue
<Panel
  pt:root:class="border border-solid"
  pt:header:id="headerId"
  pt:header:onClick="onHeaderClick"
>
</Panel>
```

</v-click>

<v-click>

**全局配置（避免每处重写）**

```ts
app.use(PrimeVue, {
  pt: {
    panel: {
      header: { class: "bg-primary text-primary-contrast" },
    },
    button: {
      root: { class: "shadow-md" },
    },
  },
});
```

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PassThrough (pt) 是 PrimeVue 与其他 UI 库最大的差异化 ——
其他 UI 库的定制深度通常止步于 prop / slot，
PrimeVue 用 pt 让你「直达每个组件的每一层内部 DOM」。

pt 对象的键对应「组件内部 DOM section」名字 ——
每个 PrimeVue 组件文档底部都有「PT Section」表格，列出所有可用的 section 名。

例如 Panel 的 section：
- root：最外层容器
- header：标题区
- title：标题文字
- toggler：折叠按钮
- icons：右侧图标区
- content：内容区
- footer：底部
- 还有 transition / pcToggleButton 等嵌套

pt 值可以是三种类型：

字符串：直接作为 class
```vue
:pt="{ root: 'my-class' }"
```

对象：可以传任意 HTML 属性 / 事件
```vue
:pt="{
  root: { class: 'my-class', style: { color: 'red' }, onClick: handler }
}"
```

函数：接收 options 参数，返回字符串或对象（条件渲染）
```vue
:pt="{
  root: (options) => ({
    class: options.state.collapsed ? 'collapsed' : 'expanded'
  })
}"
```

[click] 声明式语法（v4 新增）：

`pt:section:attribute="value"` 格式 ——
让 pt 配置看起来更像「Vue 模板原生」。

例：
- `pt:root:class="my-class"` 等价于 `:pt="{ root: 'my-class' }"`
- `pt:header:onClick="handler"` 等价于 `:pt="{ header: { onClick: handler } }"`

这种语法对喜欢「模板属性扁平化」的开发者友好。

[click] 全局 pt 配置是「项目级别预设」——
在 main.ts 一次定义，所有该类型组件自动应用。

例：项目所有 Panel header 都加深色背景，
所有 Button 都加阴影 ——
不用每处写 pt，全局 pt 一次设置。

注意：组件级 pt 会覆盖全局 pt（局部优先），
但默认是 merge 模式（class 累加）—— 可以用 ptOptions: { mergeProps: false } 切换为 override。

pc 前缀：当组件内部嵌套了其他 PrimeVue 组件时，用 pc 前缀引用 ——
```vue
<Button badge="2"
  :pt="{
    root: 'btn',
    pcBadge: { root: 'bg-violet-500' }   // pcBadge = PrimeVue Component Badge
  }"
/>
```

pcBadge 表示「Button 内部嵌套的 Badge 组件」—— 通过 pc 前缀进入子组件的 pt。
-->

---
transition: fade-out
---

# Toast + ConfirmDialog：命令式 API

useToast / useConfirm 两个 Composable

<v-click>

**Toast（顶部弹出消息）**

```ts
// main.ts
import ToastService from "primevue/toastservice";
app.use(ToastService);
```

```vue
<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";

const toast = useToast();

function showSuccess() {
  toast.add({ severity: "success", summary: "成功", detail: "保存完成", life: 3000 });
}
function showError() {
  toast.add({ severity: "error", summary: "错误", detail: "请求失败" });
}
</script>

<template>
  <Toast position="top-right" />
  <Button label="成功" @click="showSuccess" />
</template>
```

</v-click>

<v-click>

> 💡 **要点**：Toast 组件必须放在模板里（推荐放 App.vue 根部），useToast() 通过 ToastService 与之通信。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Toast 是 PrimeVue 的轻提示反馈组件 —— 顶部弹出、几秒后自动消失。

设置三步：
1. main.ts 注册 ToastService 插件
2. 模板某处放 <Toast /> 组件（推荐 App.vue 根部）
3. 用 useToast() Composable 调用 toast.add(message)

消息对象：
- severity: success / info / warn / error / secondary / contrast
- summary：标题（粗体）
- detail：详细内容
- life：自动消失时间（毫秒），不传则 sticky（手动关闭）
- closable：是否显示关闭按钮
- group：分组键（配合多个 Toast 实例用）
- styleClass：自定义 class

position 控制 Toast 位置（9 个方向）：
- top-left / top-center / top-right
- bottom-left / bottom-center / bottom-right
- center（中间居中）

[click] Toast 的设计与 Naive UI useMessage 差异：

Naive UI：useMessage() 直接返回 message 实例，调用方法即可弹消息。Provider 包根决定可用范围。
PrimeVue：useToast() 返回 toast 对象，需要模板里有 <Toast /> 组件接收消息。

PrimeVue 的好处：
- 一个项目可以放多个 <Toast /> 实例（不同 group / 不同 position）
- toast.add() 可以指定 group，控制消息显示在哪个 Toast 实例

PrimeVue 的代价：
- 必须在模板里放 <Toast />（容易忘）
- 单一全局 Toast 的简单场景反而稍麻烦

[click] 注意：与 Naive UI 不同，useToast() 可以在 setup 外调用 ——

```ts
// utils/toast.ts
import { useToast } from 'primevue/usetoast'
export const toast = useToast()  // ❌ 错！inject 必须在 setup 内
```

正确做法：
```ts
// 在每个组件 setup 内调用
const toast = useToast()
```

setup 外的场景（axios interceptor / router guard）：
- 推荐：从 Pinia store / Composable 中暴露方法
- 在 store 的 action 里调用 toast（store 是组件初始化时就有的）
- 或：通过 EventBus（VueUse useEventBus）触发，组件 setup 内监听并调 toast

这是 PrimeVue 与 Naive UI createDiscreteApi 思路不同的设计取舍。
-->

---
transition: fade-out
---

# ConfirmDialog：确认对话框

危险操作必用 / 服务化的 Dialog

<v-click>

```ts
// main.ts
import ConfirmationService from "primevue/confirmationservice";
app.use(ConfirmationService);
```

```vue
<script setup lang="ts">
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";

const confirm = useConfirm();

function handleDelete() {
  confirm.require({
    message: "确认删除此用户？此操作不可恢复。",
    header: "危险操作",
    icon: "pi pi-exclamation-triangle",
    rejectLabel: "取消",
    acceptLabel: "删除",
    acceptClass: "p-button-danger",
    accept: async () => {
      await api.deleteUser(id);
      toast.add({ severity: "success", summary: "已删除" });
    },
    reject: () => {
      // 取消逻辑
    },
  });
}
</script>

<template>
  <ConfirmDialog />
  <Button label="删除" severity="danger" @click="handleDelete" />
</template>
```

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] ConfirmDialog 是 PrimeVue 的「危险确认」组件 ——
设计与 Toast 完全一致：服务 + 模板 + Composable 三件套。

设置三步：
1. main.ts 注册 ConfirmationService 插件
2. 模板某处放 <ConfirmDialog /> 组件
3. 用 useConfirm() 触发

confirm.require 配置选项：
- message：内容
- header：标题
- icon：图标 class（pi pi-exclamation-triangle 等）
- acceptLabel / rejectLabel：按钮文字
- acceptClass / rejectClass：按钮 class（p-button-danger 等）
- accept / reject：回调函数
- defaultFocus：默认聚焦的按钮（'accept' / 'reject'）
- closable：是否显示右上角 X

与 Naive UI useDialog 差异：
- PrimeVue：通过 ConfirmationService 服务化，需要模板 <ConfirmDialog />
- Naive UI：通过 NDialogProvider 包根，useDialog() 直接弹

PrimeVue 的好处：
- 可以放多个 <ConfirmDialog group="xxx" /> 实例（不同区域不同样式）
- confirm.require({ group: 'xxx' }) 路由到指定 dialog

[click] ConfirmPopup 是 ConfirmDialog 的轻量版 ——
不是模态对话框，而是「贴在触发元素旁边的小气泡」。

适用场景：
- 删除单行（小范围确认，不需要 modal 阻断）
- 不重要的二次确认

```vue
<ConfirmPopup />
<Button @click="confirmDelete($event)" />

confirm.require({
  target: event.currentTarget,   // 关键：传入触发元素
  message: '确认删除？',
  accept: () => {...},
})
```

ConfirmPopup 与 ConfirmDialog 共用 ConfirmationService ——
只是组件不同（一个气泡 / 一个模态），call API 一致。

[click] DynamicDialog 是 v4 新增的「程序化打开 Dialog」——
不需要模板里写 <Dialog />，可以通过 useDialog().open(MyComponent) 程序化打开任意 Vue 组件。

```ts
import { useDialog } from 'primevue/usedialog'
import MyForm from './MyForm.vue'

const dialog = useDialog()
dialog.open(MyForm, {
  props: { header: '编辑用户', modal: true },
  data: { userId: 1 },
  onClose: (options) => console.log(options.data),
})
```

这套 API 类似 Element Plus 的 ElMessageBox.open 或 Naive UI 的 useDialog。
适合「弹窗内容动态决定」的场景（不能在编译期就写在模板里）。
-->

---
transition: fade-out
---

# Locale + i18n：国际化

PrimeVue 自带的 locale 配置

<v-click>

```ts
// main.ts
import { definePreset } from "@primeuix/themes";

app.use(PrimeVue, {
  theme: { preset: Aura },
  locale: {
    accept: "确定",
    reject: "取消",
    choose: "选择",
    upload: "上传",
    cancel: "取消",
    completed: "完成",
    pending: "等待中",
    dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月",
                 "七月", "八月", "九月", "十月", "十一月", "十二月"],
    today: "今天",
    clear: "清除",
    weekHeader: "周",
  },
});
```

</v-click>

<v-click>

**运行时切换**

```ts
import { usePrimeVue } from "primevue/config";
const PrimeVue = usePrimeVue();
PrimeVue.config.locale.accept = "OK";  // 直接修改 locale 字段
```

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeVue 的国际化方案 ——

与 Naive UI 不同（Naive UI 通过 NConfigProvider 接 locale），
PrimeVue 在 app.use 配置时一次传入 locale 对象。

locale 对象包含所有组件内置文案：
- 按钮：accept / reject / choose / cancel / clear
- 日期：dayNames / dayNamesShort / monthNames / monthNamesShort
- 日期组件：today / weekHeader / firstDayOfWeek
- 文件上传：uploadButtonLabel / cancelButtonLabel
- 表格：emptyMessage / emptyFilterMessage
- 分页：currentPageReportTemplate
- 校验：required / invalid
- 完整列表见 PrimeVue 文档「Locale」章节

社区维护的 locale 包：
- prime-locale（GitHub @primefaces/primelocale）
- 覆盖 30+ 语言（中英日韩法德俄阿等）
- 直接 import 使用 `import { zh_CN } from 'prime-locale'`

[click] 运行时切换 locale 是 PrimeVue 的特色 ——
不像 vue-i18n 那样维护两套 locale 文件，
PrimeVue 直接修改 config.locale 字段，所有组件实时响应。

但注意：
- PrimeVue locale 只管「组件内置文案」（确定 / 取消 / 月份 / 星期等）
- 业务文案（页面标题、错误提示）还是用 vue-i18n 管

标准协同模式：
- vue-i18n 管业务文案（90% 文案在这里）
- PrimeVue locale 管组件文案（10% 来自组件库）
- 两者共享同一个 locale state（写在 Pinia 或 useStorage）
- 切换时同步更新两边

```ts
const { locale } = useI18n()
watch(locale, (newLocale) => {
  const localeMap = { 'zh-CN': zhLocale, 'en-US': enLocale }
  Object.assign(PrimeVue.config.locale, localeMap[newLocale])
})
```

DatePicker 的日期格式（dateFormat: 'mm/dd/yy'）独立于 locale ——
按本地化习惯设置（美式 mm/dd/yy / 中式 yy-mm-dd）。
-->

---
transition: fade-out
---

# SSR + Nuxt：@primevue/nuxt-module

官方 Nuxt 模块，自动按需引入 + SSR 友好

<v-click>

```bash
pnpm add primevue @primeuix/themes
pnpm add -D @primevue/nuxt-module
```

```ts
// nuxt.config.ts
import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
  modules: ["@primevue/nuxt-module"],
  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: { darkModeSelector: ".my-app-dark" },
      },
      ripple: true,
    },
    importTheme: { from: "@/themes/my-preset.ts" },
    components: { include: "*" },        // 自动 import 所有组件
    directives: { include: ["Ripple", "Tooltip"] },
    composables: { include: ["useToast", "useConfirm"] },
  },
});
```

</v-click>

<v-click>

> 💡 **零样式 SSR**：v4 全 CSS 变量，SSR 不需要像 Naive UI 那样 collect FOUC —— Vite 编译期就把 CSS 静态化。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @primevue/nuxt-module 是 PrimeTek 官方维护的 Nuxt 模块 ——
比 Naive UI 的社区模块（nuxtjs-naive-ui）更稳定 + 功能更全。

主要功能：
- 自动 import：所有 PrimeVue 组件自动注册，不需要手动 import
- 自动 directives：v-ripple / v-tooltip 等指令自动注册
- 自动 composables：useToast / useConfirm / useDialog 自动可用
- SSR 友好：CSS 变量在编译期生成，没有 FOUC 问题
- Tree-shaking：只打包用到的组件

配置选项：
- options：传给 PrimeVue 配置（theme / ripple / locale 等）
- importTheme：自定义 preset 文件路径（写一个 definePreset 文件）
- components.include：组件 include 列表（'*' 表示全部）
- directives.include：指令 include 列表
- composables.include：composable include 列表
- importPT：自定义全局 pt 文件路径

PrimeVue v4 与 SSR 的兼容性：
- v3 时代有「FOUC」问题（CSS 在客户端 import）
- v4 改用 CSS 变量后，CSS 在 Vite 构建期就静态化
- SSR 渲染 HTML 时 CSS 已经在 <link> 标签中
- 完全消除了 FOUC

这是 v4 相比 v3 + Naive UI CSS-in-JS 方案的优势 ——
SSR 不需要任何特殊处理（collect / setup 等步骤）。

[click] 与 Nuxt 3 协同的最佳实践：

1. 创建 themes/my-preset.ts 定义自定义 preset
2. nuxt.config.ts 配置 importTheme.from 指向上面文件
3. 在 pages/components 中直接用 <Button>、useToast() 等（自动可用）

Nuxt 自带的 useState / useFetch 与 PrimeVue 组件无缝协作 ——
- useFetch 拿数据 → DataTable 渲染
- useState 存表单状态 → Form 校验
- useRuntimeConfig 配置 API base URL

整体 SSR 体验：开箱即用，比 v3 时代简单多了。
-->

---
transition: fade-out
---

# 与 Tailwind / UnoCSS 集成

tailwindcss-primeui 官方插件

<v-click>

```bash
pnpm add tailwindcss-primeui
```

**Tailwind v4 配置（CSS）**

```css
/* main.css */
@import "tailwindcss";
@plugin "tailwindcss-primeui";

@theme {
  --color-primary-500: var(--p-primary-500);
}
```

**Tailwind v3 配置（JS）**

```ts
// tailwind.config.ts
import PrimeUI from "tailwindcss-primeui";

export default {
  content: ["./src/**/*.{vue,ts}"],
  plugins: [PrimeUI],
};
```

</v-click>

<v-click>

**使用**

```vue
<!-- 用 PrimeVue 主题色的 Tailwind utility -->
<div class="bg-primary text-primary-contrast p-4 rounded-lg">主色卡片</div>
<div class="bg-surface-100 dark:bg-surface-900">背景色随主题切换</div>
```

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] tailwindcss-primeui 是 PrimeTek 官方维护的 Tailwind 插件 ——
让 PrimeVue 主题 token 与 Tailwind utility 无缝对接。

核心功能：
- 把 PrimeVue 的 token（--p-primary-500 / --p-surface-100 等）转成 Tailwind utility
- 写 `bg-primary` 自动应用 `background: var(--p-primary-500)`
- 写 `text-surface-50` 自动应用 `color: var(--p-surface-50)`
- 主题切换时（暗色 / 换 preset），utility 自动跟随变化

提供的 utility 系列：
- bg-primary / text-primary / border-primary
- bg-primary-contrast（反相对比色）
- bg-surface-{0,50,100,...,950}：背景色 11 档
- text-color / text-color-secondary / text-muted-color
- border-surface

Tailwind v4 vs v3 配置差异：
- v4：CSS-first 配置，用 `@plugin` 引入插件
- v3：JS 配置，用 `plugins` 数组引入

无论 v3 v4，插件功能一致 —— 都是把 PrimeVue token 暴露给 Tailwind。

[click] 实际使用场景：

场景 1：用 Tailwind 写布局，PrimeVue 写组件
```vue
<div class="grid grid-cols-3 gap-4 bg-surface-50 p-4">
  <Card>card 1</Card>
  <Card>card 2</Card>
</div>
```

场景 2：用 Tailwind utility 给 PrimeVue 组件加自定义样式（不用 pt）
```vue
<Button class="!shadow-lg !rounded-full" label="按钮" />
```

注意 ! 前缀（important）—— 因为 PrimeVue 的样式 specificity 较高，
直接 class 可能被覆盖，加 ! 强制生效。

场景 3：暗色模式联动
```vue
<div class="bg-surface-0 dark:bg-surface-900 text-color">
  内容
</div>
```

dark: 前缀基于 darkModeSelector 配置（'.my-app-dark' 等）—— Tailwind 与 PrimeVue 共享同一个 class。

[click] 与 UnoCSS 的协同：

UnoCSS 本身没有官方 PrimeVue 插件，
但可以通过 presetUno + presetIcons + 自定义 rules 实现类似功能：

```ts
// uno.config.ts
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      primary: 'var(--p-primary-500)',
      'primary-contrast': 'var(--p-primary-contrast-color)',
      'surface-50': 'var(--p-surface-50)',
      // ...
    },
  },
})
```

把 PrimeVue 的 CSS 变量映射到 UnoCSS 的 theme.colors，
然后写 `bg-primary` / `text-surface-50` 等就能用了。

国内项目用 UnoCSS 更多，这套手动配置是必经之路。
-->

---
transition: fade-out
---

# 生态对比：5 大 Vue 3 UI 库

PrimeVue 在「组件数 / 主题 / 定制」上是天花板

<v-click>

| 能力              | PrimeVue          | Element Plus       | Vuetify 3       | Naive UI          | Ant Design Vue |
| ----------------- | ----------------- | ------------------ | --------------- | ----------------- | -------------- |
| 组件数量          | **100+**          | 60+                | 80+             | 90+               | 60+            |
| 主题预设          | **4 内置**        | 1                  | 1（Material）   | 默认 + dark       | 1（Ant）       |
| 定制深度          | **pt + Unstyled** | SCSS / CSS vars    | SCSS            | themeOverrides    | LESS           |
| TS 支持           | 完整              | 完整               | 完整            | **100% 源码生根** | 完整           |
| 表格虚拟滚动      | **内置**          | ElTableV2          | 内置            | **内置**          | 内置           |
| Forms 校验        | **Zod/Yup/Valibot** | :rules 配置式    | VeeValidate     | :rules 配置式     | :rules 配置式  |
| Tailwind 集成     | **官方插件**      | 社区               | 社区            | 社区              | 社区           |
| Nuxt 集成         | **官方模块**      | 官方               | 官方            | 社区              | 社区           |
| 国外人气          | **★★★★★**         | ★★★                | ★★★★            | ★★★★              | ★★★            |
| 国内中文生态      | ★★★               | **★★★★★**          | ★★★             | ★★★★              | ★★★★           |
| 中后台模板        | **PrimeBlocks**   | vue-element-admin  | Materio         | naive-ui-admin    | vue-vben-admin |

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比五大 Vue 3 UI 库的最终结论：

PrimeVue 的护城河：
- 组件数量天花板（100+，比第二名 Naive UI 多 10+）
- 4 个主题预设（其他 UI 库都是 1 套）
- pt + Unstyled 双模式（定制深度无人能及）
- Forms 库官方支持 Zod/Yup/Valibot（其他都还是 :rules 配置式）
- Tailwind 官方插件（其他都是社区）
- Nuxt 官方模块（除 Element Plus / Vuetify 外都是社区）

PrimeVue 的弱项：
- 中文生态弱于 Element Plus / Naive UI / Ant Design Vue
- 中后台模板（PrimeBlocks）需要付费
- 国内大厂采用率低
- v3 → v4 升级成本高（API 改名多）

各家适合场景：

**PrimeVue**：
- 国际化项目 / 国外团队
- 组件需求复杂（PickList / OrderList / Editor / Galleria）
- 多主题切换需求（节日 / 多租户）
- Tailwind 用户 / 想用 Volt
- 跨框架团队（已用 PrimeReact / PrimeNG）

**Element Plus**：
- 国内中后台项目（中文社区压倒性优势）
- 团队熟悉 Element UI（迁移自 Vue 2）
- 中文文档 / 中文教程 / 中文 Stack Overflow 资源

**Vuetify 3**：
- 项目设计稿是 Material Design 风
- 移动端 / 谷歌生态项目
- 需要 Material 严格一致性

**Naive UI**：
- 追求 TypeScript / 颜值 / 主题灵活
- 设计驱动型团队
- 自动驾驶 / 数据可视化（虚拟列表强大）

**Ant Design Vue**：
- 项目设计稿是 Ant Design 风
- 中国大厂 / 蚂蚁生态项目
- 需要 Ant Design 严格一致性

选型时不要被「哪个最好」迷惑，
而应该问「哪个最匹配我的场景」—— 没有银弹，只有取舍。
-->

---
transition: fade-out
---

# v3 → v4 迁移指南

主要改动 + 升级路径

<v-click>

**主要变化**

- 完全脱离 SASS，全用 CSS 变量（删除 `primevue/resources` 引用）
- 引入 4 个主题预设（Aura / Material / Lara / Nora）
- pt（PassThrough）API v2，新增 `pc` 前缀引用嵌套组件
- 设计 token 三层架构（Primitive / Semantic / Component）

</v-click>

<v-click>

**组件改名（必改）**

| v3                | v4                |
| ----------------- | ----------------- |
| Calendar          | **DatePicker**    |
| Dropdown          | **Select**        |
| InputSwitch       | **ToggleSwitch**  |
| Sidebar           | **Drawer**        |
| OverlayPanel      | **Popover**       |
| TabView / TabPanel | **Tabs / Tab**   |

**移除组件**：TriStateCheckbox / DataViewLayoutOptions

</v-click>

<v-click>

**API 改动**

- `switchTheme()` 已废弃 → 用 `usePreset()`
- `primevue/api` 路径 → `@primevue/core/api`
- 自定义 theme.css 必须重写为 definePreset 形式

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeVue v3 → v4 是「不兼容升级」—— 但新项目直接用 v4，不要纠结 v3。

主要变化：
- 主题系统完全重构（v3 SASS → v4 CSS 变量）
- 移除 primevue/resources（v3 的 theme.css 路径）
- 引入 4 个主题预设（v3 是各种独立 theme.css 文件）
- pt API 升级到 v2（更强大）
- 设计 token 三层架构（v3 没有这个概念）

[click] 组件改名是「必改」工作量：

- Calendar → DatePicker：名字更清晰（包含 time / range / month 多种模式）
- Dropdown → Select：与 HTML &lt;select&gt; 对齐
- InputSwitch → ToggleSwitch：更精确（switch 容易与 v-switch 等混淆）
- Sidebar → Drawer：与 Material / Ant Design 等对齐
- OverlayPanel → Popover：与 Tailwind / shadcn / Bootstrap 对齐
- TabView → Tabs / TabPanel → Tab：简化

移除的组件：
- TriStateCheckbox（三态 checkbox）：用 Checkbox + indeterminate prop 替代
- DataViewLayoutOptions：用 SelectButton 自己实现

[click] API 改动：

- switchTheme()（v3 切换主题）已废弃 →
  用 usePreset() 替换整个 preset，或 updatePreset() 局部更新

- primevue/api 路径（FilterMatchMode / FilterOperator 等）→
  改为 @primevue/core/api

- 自定义主题 CSS 文件 →
  必须改写成 definePreset 形式

升级建议：

1. 先升级到 v3 最新（如果还在 v3.x 早期），减少破坏性变化
2. 用 codemod 工具（PrimeVue 官方提供）批量改组件名 / import 路径
3. 主题文件全部重写为 definePreset
4. 测试覆盖率高的项目用「小步快跑」—— 一个组件一个组件迁移

新项目：直接 v4，不要碰 v3，省心。
旧项目：评估收益，主题深度定制的旧项目升级成本最高。

PrimeVue 官方 Migration Guide 详尽，建议升级前完整看完。
-->

---
transition: fade-out
---

# 常见踩坑（一）：服务 + 模板

Toast / Confirm / Dialog 必须放模板

<v-click>

**坑 1：useToast 报错 / toast.add 无效果**

```vue
<!-- ❌ 模板里没放 <Toast /> -->
<script setup>
const toast = useToast()
toast.add({ severity: 'success', summary: '保存' })  // 调用了但不显示
</script>

<!-- ✅ App.vue 根部放 <Toast /> 接收消息 -->
<template>
  <Toast />
  <RouterView />
</template>
```

</v-click>

<v-click>

**坑 2：忘记注册 ToastService / ConfirmationService**

```ts
// ❌ main.ts 只 app.use(PrimeVue)
app.use(PrimeVue)
// useToast() 返回 undefined

// ✅ 服务必须显式 use
app.use(PrimeVue)
app.use(ToastService)
app.use(ConfirmationService)
app.use(DialogService)
```

</v-click>

<v-click>

**坑 3：v3 组件名继续用**

```vue
<!-- ❌ v4 已移除 -->
<Calendar v-model="date" />
<Dropdown :options="cities" />

<!-- ✅ v4 新名 -->
<DatePicker v-model="date" />
<Select :options="cities" />
```

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 「useToast 调用但不显示」是 PrimeVue 新手头号踩坑 ——

PrimeVue 的服务模式与 Naive UI / Element Plus 完全不同：
- Naive UI：Provider 包根 + useMessage() 直接弹
- Element Plus：全局 ElMessage.success() 直接弹
- PrimeVue：服务 + 模板 + Composable 三件套

工作原理：
- useToast() 返回的 toast 对象通过 ToastService 推消息到全局 store
- <Toast /> 组件订阅 store 变化，渲染消息
- 没有 <Toast /> = 没有渲染者 = 消息发出但不显示

最佳实践：在 App.vue 根部放一次 <Toast />，全应用通用：
```vue
<!-- App.vue -->
<template>
  <Toast />
  <ConfirmDialog />
  <DynamicDialog />
  <RouterView />
</template>
```

同理 ConfirmDialog / DynamicDialog 也是同样模式。

[click] 「服务没注册」是另一个高频坑：

PrimeVue 4.x 把不同功能拆成独立服务：
- PrimeVue（主插件，必装）
- ToastService（Toast 用）
- ConfirmationService（ConfirmDialog / ConfirmPopup 用）
- DialogService（DynamicDialog 用）

每个服务都要单独 app.use，没装就用对应 Composable 会返回 undefined。

main.ts 标准模板：
```ts
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(ToastService)
app.use(ConfirmationService)
app.use(DialogService)
app.mount('#app')
```

[click] v3 组件名继续用是「升级 v4 的最大踩坑」——

v3 项目升 v4 时，IDE 不会报错（因为 v3 组件名作为标签也是合法 HTML），
但运行时无法 resolve，组件不渲染或报警告。

主要改名（重复一遍重要！）：
- Calendar → DatePicker
- Dropdown → Select
- InputSwitch → ToggleSwitch
- Sidebar → Drawer
- OverlayPanel → Popover
- TabView → Tabs
- TabPanel → Tab

import 也要改：
```ts
// v3
import Calendar from 'primevue/calendar'

// v4
import DatePicker from 'primevue/datepicker'
```

建议升级时全局搜索 / 替换：
- 搜 `Calendar` → 检查是否 PrimeVue 组件 → 替换 DatePicker
- 搜 `Dropdown` → 同上 → 替换 Select
- 以此类推
-->

---
transition: fade-out
---

# 常见踩坑（二）：主题 + pt

CSS 优先级 / pt section 不存在 / 全局 vs 局部

<v-click>

**坑 4：Tailwind class 不生效（specificity 问题）**

```vue
<!-- ❌ PrimeVue 默认样式优先级高 -->
<Button class="bg-red-500" label="点我" />   <!-- 仍是绿色（primary） -->

<!-- ✅ 用 ! 前缀强制 -->
<Button class="!bg-red-500" label="点我" />

<!-- ✅ 或者用 pt 直接覆盖 -->
<Button :pt="{ root: 'bg-red-500' }" label="点我" />
```

</v-click>

<v-click>

**坑 5：pt section 名不存在**

```vue
<!-- ❌ Panel 没有 'body' section（只有 root / header / content / footer） -->
<Panel :pt="{ body: 'p-4' }">…</Panel>

<!-- ✅ 查文档 PT Section 表，找正确的 section 名 -->
<Panel :pt="{ content: 'p-4' }">…</Panel>
```

</v-click>

<v-click>

**坑 6：cssLayer 与 Tailwind 优先级冲突**

```ts
// ✅ 开启 cssLayer，让 PrimeVue 样式在 Tailwind layer 之后
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      cssLayer: { name: 'primevue', order: 'tailwind-base, primevue, tailwind-utilities' }
    }
  }
})
```

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] CSS specificity 问题是「PrimeVue + Tailwind 共存」的高频坑 ——

PrimeVue Styled 模式下，组件样式 specificity 较高（类似 `.p-button.p-component`），
Tailwind utility（如 `.bg-red-500`）只有 0,0,1,0，
所以直接 class 经常被覆盖。

三种解决方案：

方案 1：Tailwind 加 ! 前缀（important）
- `class="!bg-red-500"` 强制覆盖
- 简单但「!」满天飞影响可读性

方案 2：用 pt 直接覆盖
- `:pt="{ root: 'bg-red-500' }"` 加到 root section
- pt 中的 class 与 PrimeVue 自身 class 合并，specificity 相同
- 推荐用于「局部覆盖样式」

方案 3：开启 cssLayer
- PrimeVue 样式包在 @layer primevue { ... } 中
- 任何不在 layer 中的 CSS 都优先级更高
- 配合 Tailwind layer 顺序控制（见下）

[click] pt section 不存在是「不查文档导致」的坑：

每个 PrimeVue 组件的 pt section 都不同，
要查文档「PT Section」表才能知道正确的 section 名。

比如：
- Panel：root / header / title / icons / toggler / content / footer
- DataTable：root / header / footer / body / row / cell / column / paginator
- Button：root / label / icon / loadingIcon

写错 section 名不报错（pt 是宽松匹配），但 class 不会应用 ——
表现就是「pt 写了但没效果」。

解决方法：
- 浏览器 devtools 检查实际 DOM 结构
- 对照 PrimeVue 文档的 PT Section 表
- 找到对应 DOM 节点的 section 名

[click] cssLayer 是「与 Tailwind 共存的终极方案」——

CSS @layer 是浏览器原生功能（2022+），允许「分层管理 CSS 优先级」：
- layer 内的 CSS specificity 受 layer 顺序控制
- 后定义的 layer 整体优先级更高

cssLayer 配置：
- false（默认）：不使用 layer，PrimeVue 样式正常 inline
- true：PrimeVue 样式包在 `@layer primevue { ... }` 中
- 对象：自定义 layer 名 + 顺序

最佳实践（与 Tailwind v4）：
```ts
cssLayer: {
  name: 'primevue',
  order: 'tailwind-base, primevue, tailwind-utilities'
}
```

这告诉浏览器：
- tailwind-base 优先级最低（reset / preflight）
- primevue 中等
- tailwind-utilities 最高（写 bg-red-500 必生效）

这样 Tailwind utility 总是覆盖 PrimeVue 默认样式，
不需要满屏 ! 前缀。

注意：Tailwind v4 默认就是 layered 输出，
v3 需要手动 @layer { ... } 包裹（用 @apply 或 @import "tailwindcss/utilities" layer(tailwind-utilities)）。
-->

---
transition: fade-out
---

# 最佳实践清单

来自国外大型 PrimeVue 项目沉淀

<v-click>

**项目初始化**

- ✅ main.ts 一次注册 PrimeVue + ToastService + ConfirmationService + DialogService
- ✅ App.vue 根部放 &lt;Toast /&gt; + &lt;ConfirmDialog /&gt; + &lt;DynamicDialog /&gt;
- ✅ 按需引入用 PrimeVueResolver（@primevue/auto-import-resolver）
- ✅ 开启 cssLayer 配合 Tailwind / UnoCSS

</v-click>

<v-click>

**主题与样式**

- ✅ definePreset 在 Aura / Material / Lara / Nora 基础上微调
- ✅ darkModeSelector: '.my-app-dark' 配合 VueUse useDark
- ✅ tailwindcss-primeui 让 bg-primary / text-surface 与主题联动
- ✅ 全局 pt 配置项目级样式预设（避免每个组件重写）

</v-click>

<v-click>

**Form + DataTable**

- ✅ @primevue/forms 配 Zod schema 替代 :rules 配置式
- ✅ DataTable 大数据集启用 virtualScroller 或 lazy + paginator
- ✅ DataTable 行编辑用 editingRows + @row-edit-save 事件
- ✅ FileUpload 用 customUpload + uploader prop 接入七牛 / OSS 直传

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 项目初始化阶段的关键决定：

服务一次性 use 完整 ——
省去以后「为什么 useToast 没效果」「为什么 useConfirm 报错」的反复排查时间。
即使暂时用不到 ConfirmationService / DialogService，提前 use 也没有额外开销。

App.vue 根部放上 &lt;Toast /&gt; / &lt;ConfirmDialog /&gt; / &lt;DynamicDialog /&gt; ——
这三个组件「占位即可」，没消息时不渲染任何 DOM，零开销。

按需引入 + AutoImport 几乎是「必选」——
不然到处写 `import Button from 'primevue/button'` 维护成本高。

cssLayer 开启是「与 Tailwind / UnoCSS 长期共存」的根基 ——
省去满屏 ! 前缀的痛苦。

[click] 主题与样式：

definePreset 是「在内置 preset 基础上微调」的最佳工作流 ——
不要从零写一个 preset（工作量巨大），从 Aura 出发改 primary + surface 几个 token 即可。

darkModeSelector + useDark 是「自动跟随系统 + localStorage 持久化」的标准组合。

tailwindcss-primeui 插件让「Tailwind utility 与 PrimeVue 主题」联动 ——
切换主题时，bg-primary / text-surface 等 utility 自动变化。

全局 pt 配置：把「所有项目都用到的样式」提取到 main.ts，
避免每个组件重写。例如「所有 Panel header 加阴影」「所有 Button 加圆角」等。

[click] Form + DataTable：

@primevue/forms 是 PrimeVue v4 的核心新增 ——
拥抱现代 JavaScript 校验生态（Zod / Yup / Valibot）。
不要再用 :rules 配置式（那是 v3 风格）。

DataTable 性能要点：
- < 1000 行：默认即可
- 1000 - 10000 行：开启 virtualScroller
- 10000+ 行：lazy + paginator（前后端分页）

DataTable 行编辑（editingRows + @row-edit-save）是企业后台高频功能，
PrimeVue 提供完整 API，比 Element Plus 的「v-if 切换 edit mode」优雅。

FileUpload 接入云存储（七牛 / 阿里 OSS / 腾讯 COS）用 customUpload + uploader：
```ts
const customUpload = async (event) => {
  for (const file of event.files) {
    await uploadToOSS(file, getOSSToken())
  }
}
```

跳过 PrimeVue 默认的 XHR，直接走云存储 SDK，性能 + 灵活性双赢。
-->

---
transition: fade-out
---

# 评价

组件最全 / 主题最多 / 定制最深，但中文生态弱

<v-clicks>

**优点**

- 100+ 组件覆盖全场景（PickList / OrderList / Editor / Galleria 等冷门必备）
- 4 个内置主题预设 + definePreset 微调，开箱即用 + 灵活定制
- Styled / Unstyled 双模式，一个组件库满足两种工作流
- pt（PassThrough）API 让定制深度直达 DOM
- 设计 token 三层架构（Primitive / Semantic / Component）现代化
- @primevue/forms 拥抱 Zod / Yup / Valibot 现代校验生态
- tailwindcss-primeui 官方插件 + @primevue/nuxt-module 官方模块
- WCAG 2.1 AA 无障碍合规，国际化项目友好

**缺点**

- 中文生态弱于 Element Plus / Naive UI / Ant Design Vue
- v3 → v4 升级成本高（组件改名 + 主题重写）
- PrimeBlocks 商业模板需要付费（社区免费替代品少）
- 服务模式（Toast / Confirm / Dialog）新手容易踩坑
- 国内大厂采用率低（阿里 / 字节 / 美团很少用）
- CSS specificity 与 Tailwind 共存需要 cssLayer 配置

</v-clicks>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeVue 的优点非常集中 —— 「Vue 3 时代组件最全 / 主题最多 / 定制最深」——

100+ 组件是 Vue 3 UI 库的天花板 —— 国外项目「PickList / OrderList / Editor / Galleria 这些 PrimeVue 都有」是常见的赞美。

4 个内置主题预设让「不写 SCSS 不写主题」也能切换设计语言 ——
其他 UI 库都是「一套默认 + 暗色」结构，没有 PrimeVue 这么灵活。

Styled / Unstyled 双模式是 PrimeVue 与众不同的核心 ——
- 中小项目 / 快速搭建 → Styled 模式开箱即用
- 严格设计系统 / Tailwind 重度 → Unstyled 模式完全自定义
- 同一个组件库满足两种工作流，避免「需要换组件库」

pt API 让组件库 prop 不够用这个痛点彻底消失 ——
直达每个 DOM section，class / style / 事件全套自定义。

设计 token 三层架构对标 shadcn / Tailwind v4 ——
Vue UI 库里「设计最现代」的。

@primevue/forms 把 Zod / Yup / Valibot 这些现代校验库官方集成 ——
其他 UI 库还在用「字符串规则配置式」校验，PrimeVue 提前一代。

WCAG 2.1 AA 合规是「国际化项目」的硬要求 ——
PrimeVue 每个组件文档都有无障碍章节，企业合规友好。

[click] 缺点也很明确：

中文生态是最大短板 ——
- 中文文档：官方有但翻译质量参差
- 中文教程：博客 / B 站资源少（Element Plus 几十倍量）
- 中文社区：搜「PrimeVue XXX」找不到，得用英文搜
- 中文 Stack Overflow：英文资源压倒性多

v3 → v4 升级成本高 ——
组件改名 + 主题重写让旧项目升级心累，
很多团队选择「v3 继续维护」而不升级。

PrimeBlocks（官方商业模板）需要付费 ——
免费的 PrimeVue 核心组件没问题，但「模板 + Figma Kit」要收费。
社区免费替代品（如 sakai-vue）数量远少于 Element Admin 系列。

服务模式（Toast / Confirm / Dialog）对新手不友好 ——
忘记 app.use 服务 / 忘记模板放组件 / 忘记 useXxx 触发 ——
这套「服务 + 模板 + Composable」三件套需要适应。

国内大厂采用率低 ——
阿里 / 字节 / 美团 / 蚂蚁等公司前端 PaaS 基本是 Element Plus / Ant Design Vue / 自研，
PrimeVue 在国内大厂极少见。

CSS specificity 与 Tailwind 共存需要 cssLayer 配置 ——
不配 cssLayer 直接用 Tailwind class 经常被覆盖，
需要 ! 前缀或者手动配 layer 顺序，对新手不直观。

[click] 选型逻辑总结：

追求组件全 / 主题多 / 定制深 / 国际化项目 → 选 PrimeVue
追求中文生态 / 中后台模板 → 选 Element Plus
追求设计感 / TypeScript 极致 → 选 Naive UI
追求 Material Design / 谷歌生态 → 选 Vuetify 3
追求 Ant Design 风 / 蚂蚁生态 → 选 Ant Design Vue

没有银弹，按场景选。
-->

---
transition: fade-out
---

# 学习路径

从入门到熟练应用的 4 个阶段

<v-click>

**第 1 周：核心组件熟练**

- 通读官方文档 Form + Data + Panel + Overlay 四大分组
- 跟着官方示例改例子（每个组件都有 StackBlitz 在线编辑）
- 实现一个 CRUD 页面（DataTable + Form + Dialog + Toast 四件套）

</v-click>

<v-click>

**第 2 周：服务 + Composable**

- main.ts 注册 PrimeVue / ToastService / ConfirmationService / DialogService
- 熟练 useToast / useConfirm / useDialog 命令式 API
- 学习 @primevue/forms + Zod 表单校验

</v-click>

<v-click>

**第 3-4 周：主题 + 企业级整合**

- 用 definePreset 在 Aura 基础上定制项目品牌色
- 接 darkModeSelector + VueUse useDark 实现暗色模式
- 接入 tailwindcss-primeui + cssLayer 解决样式优先级
- 实现登录 / 权限 / 菜单 / 表单 / 表格全套

</v-click>

<v-click>

**长期：pt + Unstyled 深入**

- 项目级 pt 全局配置（main.ts 预设所有组件样式）
- 探索 Unstyled 模式 + Tailwind 重写关键组件
- 学习 Volt UI（PrimeTek 2025 新衍生库）

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 第一周打基础 ——

PrimeVue 官方文档结构清晰：
- Get Started：introduction + installation + auto-import
- Theming：styled + unstyled + tailwind + presets
- Forms：所有 Form 组件 + @primevue/forms
- Data：DataTable + Tree + Timeline 等
- Panel：Card + Accordion + Tabs 等
- Overlay：Dialog + Drawer + Popover + Toast 等
- Menu：Menu + Menubar 等
- Messages：Toast + Message
- Media：Carousel + Galleria
- Misc：其他

每个组件都有 StackBlitz 在线编辑 demo ——
点 Edit on StackBlitz 直接进 IDE 改代码看效果，是最快学习方式。

完成一个 CRUD 页面就算入门 ——
- DataTable 展示列表（含分页 / 排序）
- 点击行进入 Dialog 编辑（用 Form + 校验）
- Toast 提示成功 / 失败
- ConfirmDialog 删除确认

[click] 第二周进阶 ——

服务 + Composable 是 PrimeVue 与 Naive UI / Element Plus 最大的差异 ——
必须吃透「服务 + 模板 + Composable」三件套。

能熟练写一个：
- main.ts 注册四个服务
- App.vue 根部放四个 Provider 组件
- 任意业务组件中调用 useToast / useConfirm / useDialog

就已经超过 80% 的 PrimeVue 初学者。

@primevue/forms + Zod 是「现代化表单」标志 ——
学完后写表单不再用 :rules 字符串配置，
而是用 Zod schema 全程类型推导，体验远超 v3 时代。

[click] 第三到四周企业级整合 ——

definePreset 是 PrimeVue 主题定制的核心 ——
能完整跑通「Aura → 改 primary → 改 surface → 保存为项目 preset → 替换 Aura」工作流的开发者，
已经超过 90% 的同行。

darkModeSelector + useDark + tailwindcss-primeui 是「现代项目三件套」——
配齐后，「主题切换 + 暗色 + Tailwind 联动」完全打通。

cssLayer 解决 Tailwind specificity 问题是「项目长期可维护」的根基 ——
不配 cssLayer 的项目最后会变成「! 前缀地狱」。

单独的 PrimeVue 只是「组件库」，要变成「企业后台」需要拼接：
- 路由系统：Vue Router 4
- 状态管理：Pinia
- 构建工具：Vite
- 原子 CSS：Tailwind v4（搭配 tailwindcss-primeui） / UnoCSS
- HTTP 客户端：axios / ofetch
- 校验：Zod + @primevue/forms
- 图表：内置 Chart 组件（基于 Chart.js）

把这些拼通就是一个完整的「企业级 PrimeVue 前端项目」。

[click] 长期投入 pt + Unstyled 深入 ——

项目级 pt 全局配置：
把项目的视觉规范（圆角 / 阴影 / 间距 / 颜色）写到 main.ts 的 pt 配置中，
所有组件自动应用。这是「项目级 design system」的起点。

Unstyled 模式 + Tailwind 重写关键组件：
当 Styled 默认样式无法满足设计时，开 Unstyled 用 Tailwind 完全重写。
例如：项目要求「Button 必须是渐变背景 + 异形圆角」，Styled 模式难做，Unstyled 一行 class 搞定。

Volt UI 是 PrimeTek 的下一代尝试 ——
组件源码放在项目里（类似 shadcn），完全用 Tailwind v4 写。
2025 年新出，生态早期但代表未来方向，值得跟进。
-->

---
transition: fade-out
---

# 延伸学习资源

官方 + 社区精选

<v-click>

**官方资源**

- 📖 [官方文档](https://primevue.org/) —— 英文为主
- 💻 [GitHub](https://github.com/primefaces/primevue) —— 14K+ star
- 🎮 [StackBlitz 在线编辑](https://primevue.org/) —— 每个组件 demo 可在线编辑
- 🎨 [Theme Designer](https://designer.primevue.org/) —— 可视化主题编辑器

</v-click>

<v-click>

**生态项目**

- [Volt UI](https://volt.primevue.org/) —— PrimeVue Unstyled + Tailwind v4 衍生库
- [tailwindcss-primeui](https://www.npmjs.com/package/tailwindcss-primeui) —— Tailwind 集成插件
- [@primevue/nuxt-module](https://github.com/primefaces/primevue/tree/master/packages/nuxt-module) —— Nuxt 3 官方模块
- [PrimeBlocks](https://blocks.primevue.org/) —— 商业 UI 块（付费）
- [sakai-vue](https://github.com/primefaces/sakai-vue) —— 免费后台模板

</v-click>

<v-click>

**配套技术栈**

- Vue Router 4 + Pinia + Vite + Tailwind v4 = 黄金组合
- VueUse + axios + Zod + @primevue/forms = 实用四件套
- ECharts / Chart.js（PrimeVue 内置）= 图表选择
- @primevue/themes + tailwindcss-primeui = 主题双引擎

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #3B82F6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 官方资源是第一手信息 ——

官方文档 primevue.org 英文为主，中文翻译有限。
每个组件页面都有「Examples」「API」「Theming」「Accessibility」四大块，
建议学习时按顺序看（先 Examples 后 API）。

GitHub 仓库 issues / discussions 区是「问题解答的金矿」——
特别是英文社区资源比中文多 10 倍以上。

StackBlitz 在线编辑是 PrimeVue 文档的杀手锏 ——
每个组件都嵌入了 StackBlitz IDE，
点 Edit on StackBlitz 直接进编辑器改代码看效果。
比 CodeSandbox 加载更快，集成 PrimeVue 模板。

Theme Designer 是 PrimeVue 4.x 推出的可视化主题编辑器 ——
不写代码就能拖拉拽生成 definePreset：
- 选择基础 preset（Aura / Material / Lara / Nora）
- 调整 primary 色板
- 调整 surface 色板
- 调整圆角 / 间距 / 字体
- 一键 export 为 TypeScript 文件，放到项目里直接用

设计师 + 开发者协同利器。

[click] 生态项目：

Volt UI 是 PrimeTek 2025 年推出的衍生库 ——
基于 PrimeVue Unstyled + Tailwind v4，
类似 shadcn-vue 的「组件源码进项目」模式。
处于早期但是「下一代 Vue 组件库」的方向，值得跟进。

tailwindcss-primeui 是官方 Tailwind 插件，
让 bg-primary / text-surface 等 utility 与 PrimeVue 主题联动。
v4 + Tailwind 项目必装。

@primevue/nuxt-module 是 PrimeTek 官方维护的 Nuxt 3 模块 ——
比 Naive UI 的社区模块（nuxtjs-naive-ui）更稳定。

PrimeBlocks 是「商业 UI 块库」——
预制了几百个常用 UI 组合（登录页 / 表单 / 仪表板 / 营销页等）。
付费才能用全部，但有限制版免费试用。

sakai-vue 是 PrimeVue 官方维护的「免费开源后台模板」——
- Vue 3 + PrimeVue + Vite + Pinia + Vue Router
- 包含布局 / 路由 / 暗色切换 / 多语言 / 图表 demo
- 是学习「PrimeVue 企业级整合」的最佳样本

[click] 配套技术栈：

「Vue Router + Pinia + Vite + Tailwind」是 2024-2026 年 Vue 3 现代项目的事实标准。
VueUse 提供 200+ 实用 composable，与 PrimeVue 完美协作（特别是 useDark）。
axios 配 @primevue/forms / Zod 形成「网络 + 校验」双保险。
ECharts 是图表事实标准，PrimeVue 内置的 Chart 组件是 Chart.js 简单封装，
复杂图表场景还是 ECharts 更专业。

@primevue/themes + tailwindcss-primeui = 主题双引擎：
- @primevue/themes 管 PrimeVue 组件本身的主题
- tailwindcss-primeui 让 Tailwind utility 与上面联动
- 两者协同，主题切换一站式打通
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 🎨

PrimeVue — Most Complete UI Component Library for Vue

<div class="mt-8 text-lg">

**核心心智**

- 4 个内置主题预设（Aura / Material / Lara / Nora）切换即换皮
- 设计 token 三层架构（Primitive / Semantic / Component）现代化
- Styled / Unstyled 双模式，一个库满足两种工作流
- pt（PassThrough）API 直达组件内部 DOM
- 服务 + 模板 + Composable 三件套（Toast / Confirm / Dialog）
- @primevue/forms 拥抱 Zod / Yup / Valibot 校验生态
- tailwindcss-primeui + cssLayer 解决 Tailwind 共存优先级

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://primevue.org/" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/primefaces/primevue" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://designer.primevue.org/" target="_blank" class="slidev-icon-btn">
    <carbon:color-palette /> Theme Designer
  </a>
</div>
