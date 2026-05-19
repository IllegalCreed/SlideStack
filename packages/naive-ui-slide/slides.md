---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Naive UI
info: |
  Presentation Naive UI for Vue 3 developers.

  Learn more at [https://www.naiveui.com/](https://www.naiveui.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎨</span>
</div>

<br/>

## Naive UI — Vue 3 UI Library by TUSEN AI

90+ 组件 / 100% TypeScript / 主题深度定制 —— 由 TUSEN AI（图森未来）开源，尤雨溪推荐的现代 Vue 3 组件库（当前主线 v2.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Naive UI —— TUSEN AI（图森未来）开源的 Vue 3 现代组件库，
由前 Vue.js 团队成员 07akioni 主导设计与开发，
2020 年 Vue 3 发布后立项，2021 年正式发布 1.0，
当前主线 v2.x（npm 上从 2.0 持续迭代到 2.44+）。

核心卖点：
- 100% TypeScript 编写，从 props 到主题全链路类型安全
- 90+ 高质量组件，覆盖企业后台 / C 端 / 设计型应用
- 主题系统纯 JS 对象，无需 CSS 变量 / SCSS / PostCSS / 任何预处理器
- 4 个 Composable API（useMessage / useDialog / useNotification / useLoadingBar）
- 默认采用 CSS-in-JS，零样式文件 import 即可使用
- 设计语言现代清新，颜值在 Vue 3 UI 库中名列前茅

尤雨溪曾在多个公开场合推荐 Naive UI ——「我自己的 vue-vapor 项目就在用 Naive UI」。
-->

---
transition: fade-out
---

# 什么是 Naive UI？

为 Vue 3 应用提供「现代设计 + 类型安全 + 主题深度可定制」的组件库

<v-click>

- **90+ 组件**：Common / Layout / Navigation / Feedback / Data Display / Data Entry / Others 七大分组
- **100% TypeScript**：从 props 到主题 token 全链路类型推导，IDE 体验一流
- **类型安全主题系统**：纯 JS 对象配置，无需 CSS 变量 / SCSS / 任何预处理器
- **零样式 import**：CSS-in-JS 方案，组件挂载时按需注入样式
- **Tree-shaking 友好**：所有组件支持按需导入，bundle 极致优化
- **Composable API**：useMessage / useDialog / useNotification / useLoadingBar 四件套
- **暗色 + 多主题**：内置 darkTheme + GlobalThemeOverrides 任意定制
- **虚拟列表**：Select / Tree / Transfer / Table / Cascader 默认大数据集优化

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Naive UI Introduction_](https://www.naiveui.com/en-US/os-theme/docs/introduction)

</div>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Naive UI 的核心定位很清晰：「现代 Vue 3 设计型组件库」——

它不是「中后台专用」（Element Plus 那种），也不是「Material Design 实现」（Vuetify 那种），
而是一个「设计感优先、类型安全极致、主题极度灵活」的 Vue 3 UI 库。

- 90+ 组件覆盖企业后台 + C 端 + 数据可视化的常见需求
- 100% TypeScript 不是营销词 —— 是从源码到 props 到主题 token 全链路类型推导
- 主题系统是 Naive UI 的杀手锏：纯 JavaScript 对象，无需任何编译流程
- 零 CSS import 大幅简化项目配置：`import { NButton } from 'naive-ui'` 就能用
- 虚拟列表默认开启，大数据集场景（10K+ 行）也丝滑

下面会按「定位 → 安装 → 第一个组件 → NConfigProvider → 核心场景 → 主题深度 → 4 个 Composable → 国际化 → SSR → TypeScript → 对比 → 踩坑」顺序展开。
-->

---
transition: fade-out
---

# Naive UI 的定位与生态

为什么尤雨溪推荐？为什么设计师团队偏爱？

<v-click>

| 维度          | Naive UI           | Element Plus      | Vuetify 3       | Ant Design Vue   | PrimeVue          |
| ------------- | ------------------ | ----------------- | --------------- | ---------------- | ----------------- |
| 框架绑定      | **Vue 3**          | Vue 3             | Vue 3           | Vue 3            | Vue 3 / React     |
| 设计语言      | **现代简约**       | 中后台通用        | Material 3      | Ant Design       | 多 Preset 主题    |
| 组件数量      | **90+**            | 60+               | 80+             | 60+              | 80+               |
| TS 支持       | **100% 原生**      | 原生              | 原生            | 原生             | 原生              |
| 主题方案      | **JS Object**      | SCSS + CSS vars   | SCSS + Theme    | LESS + Token     | CSS vars + Theme  |
| 样式文件      | **零 import**      | 需 import CSS     | 需 import CSS   | 需 import CSS    | 需 import CSS     |
| 包体积        | **小（CSS-in-JS）**| 中                | 偏大            | 偏大             | 中                |
| 主导团队      | **TUSEN AI**       | 饿了么            | 社区 / Vuetify  | 蚂蚁集团         | PrimeTek          |
| 颜值评分      | **★★★★★**          | ★★★               | ★★★★            | ★★★★             | ★★★               |
| 尤雨溪点名    | **是**             | 否                | 否              | 否               | 否                |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Vue 3 UI Comparisons_](https://www.naiveui.com/)

</div>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比五大 Vue 3 UI 库，Naive UI 的护城河是「设计感 + 类型安全 + 主题灵活」：

- 设计语言走「现代简约」路线 —— 没有强烈的设计语言束缚，适配性极强
- 90+ 组件刚好覆盖企业后台 + C 端 + 数据可视化场景
- TypeScript 不是「补丁式支持」—— 是从源码生根的全链路类型
- 主题系统是 JS 对象 —— 不需要 SCSS / PostCSS / CSS Variables 任何预处理器
- 零样式 import —— 这点对项目初始化体验非常友好
- 尤雨溪在多次直播 / 推特中点名推荐，是 Vue 官方光环加持的少数 UI 库

对比 Element Plus：Naive UI 更现代 / 颜值更高 / 主题更灵活，但中文生态稍弱
对比 Vuetify：Naive UI 包更小 / 颜值同档但不绑定 Material Design，更通用
对比 Ant Design Vue：Naive UI 设计自由度更高，不强制 Ant 设计语言
对比 PrimeVue：Naive UI 是 Vue 3 原生设计，更贴合 Composition API

选型逻辑：追求颜值 / TS / 主题灵活度 → Naive UI；追求生态成熟度 / 中文文档 → Element Plus。
-->

---
transition: fade-out
---

# TUSEN AI 与 07akioni

为什么自动驾驶公司做了一个 Vue UI 库？

<v-click>

| 时间     | 关键事件                                                       |
| -------- | -------------------------------------------------------------- |
| 2015     | TuSimple（图森未来）成立，专注 L4 级自动驾驶                  |
| 2018     | 07akioni（曾文涛）加入 TuSimple，负责内部前端工具链            |
| 2020.09  | Naive UI 立项，基于 Vue 3 Composition API + TypeScript 重写    |
| 2021     | Naive UI 1.0 正式发布，定位「现代 Vue 3 设计型组件库」         |
| 2022     | Naive UI 2.0，主题系统重构 + 虚拟列表全面落地                  |
| 2023     | 尤雨溪在多次公开场合推荐 Naive UI，社区急速扩张                |
| 2024     | TuSimple 更名为 TUSEN AI，Naive UI 继续维护                    |
| 2025-26  | 当前主线 v2.40+，活跃迭代，18.3k+ GitHub star                  |

</v-click>

<v-click>

> 💡 **冷知识**：07akioni 曾是 Vue.js 官方团队成员，加入 TuSimple 后将这套组件库开源，TUSEN AI 公司提供持续支持。

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Naive UI 的故事很有意思 —— 一个自动驾驶公司孵化出了 Vue 3 生态最受设计师欢迎的 UI 库。

07akioni（曾文涛）是 Naive UI 的灵魂人物 —— 他曾是 Vue.js 官方团队成员，
加入 TuSimple 后负责内部前端基建。2020 年 Vue 3 发布后，
他认为「Vue 3 的 Composition API + TypeScript 能力，应该有一个全新设计的组件库来匹配」。

不复用 Element / Vuetify 是因为：
- Vue 2 时代的 UI 库 API 设计与 Composition API 哲学不太契合
- TypeScript 不是后期补丁，而是从源码生根的设计
- 主题系统应该用纯 JS 对象，而不是依赖 SCSS / CSS Variables 等编译流程
- 默认设计语言要现代 / 中性 / 颜值在线

[click] 尤雨溪推荐这件事在社区影响很大 —— 尤雨溪自己的 vue-vapor 实验项目就用 Naive UI，
推特上多次点赞，B 站直播中也推荐过。
这种「Vue 作者亲自加持」的光环，让 Naive UI 在 2023-2026 年急速扩张。

TuSimple 在 2024 年因业务调整更名 TUSEN AI，但 Naive UI 的维护团队（07akioni 等）继续投入，
v2.x 主线持续小版本迭代，企业选型上没有维护风险。
-->

---
transition: fade-out
---

# Naive UI 的核心理念

四条设计原则贯穿全部组件 API

<v-click>

**1. 类型安全（Type Safe）**

从 props 到主题 token 全链路 TypeScript 推导 —— 写错一个变量名，IDE 立刻红框。

</v-click>

<v-click>

**2. 主题灵活（Theme Customizable）**

主题用 JS 对象配置，运行时动态切换 —— 不依赖 SCSS / CSS Variables 编译，多租户多主题一行搞定。

</v-click>

<v-click>

**3. 性能优先（Performance Oriented）**

Select / Tree / Transfer / Table / Cascader 默认虚拟列表 —— 10K+ 行数据丝滑滚动。

</v-click>

<v-click>

**4. 朴素直觉（Naive Defaults）**

合理默认 + 极简 API —— 90% 场景不需要查文档，剩下 10% 场景文档极其详尽。

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 类型安全是 Naive UI 与其他 Vue UI 库最大的差异化 ——
不是「也支持 TypeScript」，而是「TypeScript 是设计起点」。

GlobalThemeOverrides 类型让主题对象的每个键都能被 IDE 自动补全；
每个组件都导出对应的 props 类型（如 ButtonProps、FormProps）；
slot 上下文也都有完整类型。
写错 type、写错 key、写错主题变量名 —— IDE 立刻报错。

[click] 主题系统是另一个杀手锏 ——
其他 UI 库用 SCSS（编译期）或 CSS Variables（运行时）做主题，
Naive UI 用「纯 JS 对象」+「CSS-in-JS」运行时注入。

切换主题就是改一个 ref 对象 —— 不需要重新编译、不需要切换样式表、
不需要给 html 加 class —— 应用看起来更像是「主题响应式数据」。

[click] 性能优先体现在「常用组件默认虚拟化」——
10K 行的 Table、10K 项的 Select、10K 节点的 Tree —— 滚动起来都丝滑。
这是 Naive UI 在数据可视化 / 大型管理后台场景的核心优势。

[click] 朴素（Naive）就是它的名字 —— 朴素的默认值、朴素的 API、朴素的设计。
Button 加 `type="primary"` 就有主色；Input 加 `v-model:value` 就双向绑定；
Form 加 `:rules` 就自动校验 —— 不需要复杂配置。
名字虽然叫「Naive」（朴素），但功能完全不简单。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与初始化

3 分钟接入任意 Vue 3 项目

::left::

<v-click>

**安装**

```bash
pnpm add naive-ui
# 或
npm install naive-ui
```

**字体（可选但推荐）**

```bash
pnpm add vfonts
```

| 版本   | Vue 兼容  | 状态                 |
| ------ | --------- | -------------------- |
| v2.x   | Vue 3.0+  | **当前主线**         |

</v-click>

::right::

<v-click>

**入口注册（NConfigProvider 包根）**

```vue
<script setup lang="ts">
import { NConfigProvider, NMessageProvider } from "naive-ui";
import "vfonts/Lato.css";
import "vfonts/FiraCode.css";
</script>

<template>
  <n-config-provider>
    <n-message-provider>
      <App />
    </n-message-provider>
  </n-config-provider>
</template>
```

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Naive UI 安装一行命令搞定，且「不需要 import 任何 CSS」——
这是它的最大特色之一（CSS-in-JS 方案，组件挂载时自动注入样式）。

vfonts 是配套字体包（Lato 主字体 + Fira Code 代码字体）——
不是必须，但极大提升默认视觉效果。如果项目已有自己的字体方案可以跳过。

v2.x 是 Vue 3 项目的当前主线，没有 Vue 2 版本（Naive UI 是为 Vue 3 而生）。

[click] NConfigProvider 必须包根 —— 这是 Naive UI 与其他 UI 库最大的差异之一。

为什么？因为 Naive UI 用「Provider 模式」分发主题 / 国际化 / Message 实例：
- NConfigProvider：分发 theme / themeOverrides / locale / dateLocale
- NMessageProvider / NDialogProvider / NNotificationProvider / NLoadingBarProvider：
  分发对应 Composable 的实例
- NDialogProvider 是可选的（如果你不用 useDialog 可以省略）

最佳实践：把所有 Provider 嵌套在最外层，一次包好，
所有子组件就能用 useMessage / useDialog 等 Composable API。

vfonts 是配套字体包：
- `import 'vfonts/Lato.css'` 提供 Lato 字体（主字体）
- `import 'vfonts/FiraCode.css'` 提供 Fira Code（代码字体）

这是「除了组件本身样式之外，唯一需要 import 的 CSS」。
-->

---
transition: fade-out
---

# 完整入口示例

NConfigProvider + 全套 Provider + App

<v-click>

```vue
<script setup lang="ts">
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NLoadingBarProvider,
  darkTheme,
} from "naive-ui";
import { ref } from "vue";

const isDark = ref(false);
const theme = computed(() => (isDark.value ? darkTheme : null));
</script>

<template>
  <n-config-provider :theme="theme">
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <App />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>
```

</v-click>

<v-click>

> 💡 **要点**：theme 传 `null`（或 undefined）= 浅色模式；传 `darkTheme` = 暗色模式；传自定义对象 = 完全自定义主题。

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Naive UI 项目最完整的入口配置 ——

Provider 嵌套顺序看起来吓人，但其实有规律：
- 最外层：NConfigProvider（分发 theme / locale / 全局配置）
- 中间层：四个反馈组件 Provider（按需嵌套）
  - NLoadingBarProvider：useLoadingBar（顶部进度条）
  - NDialogProvider：useDialog（模态对话框）
  - NNotificationProvider：useNotification（右上角通知）
  - NMessageProvider：useMessage（顶部 Toast）
- 最内层：你的 App

不用的 Provider 可以省略 —— 比如你只用 Message 和 Dialog，就只嵌套这两个。

[click] theme prop 的三种取值：
- null / undefined：默认浅色主题
- darkTheme（从 naive-ui 导入）：内置暗色主题
- 自定义 BuiltInGlobalTheme 对象：完全自定义（极少用）

最常见的暗色切换模式：
- ref<boolean> 控制开关
- computed 根据开关返回 darkTheme 或 null
- 配合 useDark（VueUse）自动跟随系统 + 持久化

themeOverrides prop（下面会讲）让你「在主题基础上微调」——
比如「保留暗色背景，但把主色从绿色改成蓝色」。
-->

---
transition: fade-out
---

# 第一个组件：NButton

熟悉的味道，原生 TypeScript 加持

<v-click>

```vue
<script setup lang="ts">
import { ref } from "vue";
import { NButton } from "naive-ui";

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
  <n-button type="primary" :loading="loading" @click="handleSubmit">
    提交订单
  </n-button>
  <n-button type="success">成功</n-button>
  <n-button type="warning" ghost>警告</n-button>
  <n-button type="error" round>危险</n-button>
  <n-button circle>+</n-button>
</template>
```

</v-click>

<v-click>

| Prop      | 取值                                       | 说明           |
| --------- | ------------------------------------------ | -------------- |
| `type`    | default / primary / success / warning / error / info / tertiary | 颜色语义 |
| `size`    | tiny / small / medium / large              | 尺寸           |
| `ghost` `dashed` `round` `circle` `text` `quaternary` | boolean | 形态变体 |
| `loading` `disabled`     | boolean                  | 状态           |

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NButton 是 Naive UI 最简单的组件 —— 几条 prop 覆盖 90% 场景。

注意几个细节：
- `error` 取代了 Element Plus 的 `danger` —— 更符合「语义」（错误状态，而不是「危险动作」）
- `tertiary` 是第三级按钮（介于 primary 和 default 之间）—— 这是其他 UI 库少见的细分
- `quaternary` 是「极弱按钮」（hover 才显示边框）—— 适合表格行的行内操作
- `ghost` 透明背景 + 边框（类似 Element Plus 的 plain）
- `text` 无背景无边框 —— 完全像文字链接
- `dashed` 虚线边框 —— 通常用于「添加项」「上传区」

loading 是 boolean prop，提交期间自动禁用 + 显示加载小圈，无需手动控制 disabled。

[click] type 的七个语义值对应组件库的颜色系统：
- default：默认（次操作）
- primary：主操作（提交、保存）
- success：积极反馈（已完成）
- warning：提示（注意事项）
- error：错误 / 危险（删除、解绑）
- info：中性信息
- tertiary：第三级（介于主次之间）

这套 type 体系 Tag、Alert、Message 等组件全部共享，认知成本极低。

形态变体的丰富度是 Naive UI 的一大特色 —— ghost / dashed / round / circle / text / quaternary
六种变体配合 type 和 size 三档，理论上可以组合出几百种风格，覆盖几乎所有 UI 场景。
-->

---
transition: fade-out
---

# 按需引入：NaiveUiResolver

中大型项目推荐配置，开箱即省 ~100 KB

<v-click>

**1. 安装 unplugin 依赖**

```bash
pnpm add -D unplugin-vue-components unplugin-auto-import
```

</v-click>

<v-click>

**2. 配置 vite.config.ts**

```ts
import { defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
        "vue",
        {
          "naive-ui": [
            "useDialog", "useMessage",
            "useNotification", "useLoadingBar",
          ],
        },
      ],
    }),
    Components({ resolvers: [NaiveUiResolver()] }),
  ],
});
```

</v-click>

<v-click>

> 💡 **效果**：模板里直接写 `<n-button>`，自动 import；脚本里直接调 `useMessage()`，自动 import。

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 按需引入的核心是两个 unplugin：
- `unplugin-vue-components` 扫描模板，自动 import 用到的组件
- `unplugin-auto-import` 扫描脚本，自动 import 用到的 Composable（useMessage 等）

[click] vite.config.ts 配 NaiveUiResolver 是关键 ——
它告诉 unplugin「遇到 `<n-xxx>` 就去 `naive-ui` 包里找对应组件」，
路径解析完全自动（不需要手动样式 import，因为 Naive UI 是 CSS-in-JS）。

AutoImport 的 imports 配置里特别说明 naive-ui 的几个 Composable ——
useDialog / useMessage / useNotification / useLoadingBar 是脚本里调用的函数，
不是模板组件，需要 AutoImport 处理。

注意：与 Element Plus 不同，Naive UI 「不需要 importStyle 配置」——
因为它本身就是 CSS-in-JS，没有独立的样式文件。

[click] 实际开发体验：
模板里写 `<n-button>I am button</n-button>` —— 不用手动 import NButton
脚本里写 `const message = useMessage()` —— 不用手动 import useMessage

bundle 大小本来就因 CSS-in-JS 减少了 CSS 包体积，
配合按需引入后 gzipped 大小相比 Element Plus 全量小约 30-50%。

这是「Tree-shaking 友好 + 零样式 import」双 buff 的胜利。
-->

---
transition: fade-out
---

# 90+ 组件分组速览

按使用场景组织，记住分组即可快速定位

<v-click>

| 分组             | 代表组件                                                     |
| ---------------- | ------------------------------------------------------------ |
| **Common**       | Button / Icon / Tag / Avatar / Badge / Divider / Typography  |
| **Layout**       | Layout / Grid / Space / Flex / Card / Page Header            |
| **Navigation**   | Menu / Tabs / Breadcrumb / Steps / Anchor / BackTop / Pagination |
| **Feedback**     | Alert / Message / Dialog / Notification / LoadingBar / Progress / Spin / Result |
| **Data Display** | Table / Tree / List / Calendar / Image / Statistic / Descriptions / Empty |
| **Data Entry**   | Form / Input / Select / DatePicker / Switch / Slider / Upload / Cascader / Rate |
| **Others**       | Affix / Auto Complete / Collapse / Drawer / Modal / Popover / Tooltip / Watermark |

</v-click>

<v-click text-xs class="mt-4">

> 💡 **设计原则**：高频组件（Button / Input / DataTable）API 极简，低频组件（Tree / Cascader / Transfer）功能完整。

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 90+ 组件听起来多，但按分组记忆很容易上手 ——

Common：原子展示元素，每个页面都用
Layout：布局骨架，Card 是其中最高频的「卡片容器」
Navigation：导航类组件，Menu 是企业后台核心
Feedback：反馈通知，「四件套」useMessage / useDialog / useNotification / useLoadingBar 是 Naive UI 特色
Data Display：数据展示，DataTable 功能极强（支持虚拟滚动 / 树形数据 / 拖拽列）
Data Entry：表单交互，Form 校验体系完整
Others：辅助组件，按需取用

[click] 设计原则上有个有意思的规律：
高频组件 API 极简（Button 4 个核心 prop 就够用），
低频组件 API 完整（DataTable 几十个 prop / slot 覆盖各种企业场景）。

这种「按使用频次分配复杂度」是优秀组件库的共性。

Naive UI 特别之处在于「冷门但实用的组件」也做得很完整 ——
比如 Watermark（水印）、Anchor（锚点）、Statistic（统计数字）—— 这些在 Ant Design Vue 也有，
但在 Element Plus 需要自己造或用第三方库。
-->

---
transition: fade-out
---

# NForm 深度（一）：基础结构

label-placement / model / rules 三要素

<v-click>

```vue
<script setup lang="ts">
import { reactive, ref } from "vue";
import type { FormInst, FormRules } from "naive-ui";

const formRef = ref<FormInst | null>(null);
const form = reactive({
  name: "",
  email: "",
  age: 18,
});

const rules: FormRules = {
  name: { required: true, message: "请输入姓名", trigger: "blur" },
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: "blur" },
  ],
  age: { type: "number", min: 1, max: 120, message: "1-120", trigger: "blur" },
};
</script>

<template>
  <n-form ref="formRef" :model="form" :rules="rules" label-placement="left" label-width="80">
    <n-form-item label="姓名" path="name">
      <n-input v-model:value="form.name" />
    </n-form-item>
    <n-form-item label="邮箱" path="email">
      <n-input v-model:value="form.email" />
    </n-form-item>
  </n-form>
</template>
```

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NForm 是 Naive UI 表单交互的核心 ——
企业后台 80% 的页面都是「表单 + 表格」组合。

三要素（与 Element Plus 对齐）：
- model：表单数据对象（必须是 reactive）
- rules：校验规则（required / type / min / max 等）
- path：每个 NFormItem 的字段路径（替代 Element Plus 的 prop，命名更清晰）

注意几个 Naive UI 特色：
- `v-model:value` 而不是 `v-model`（Naive UI 全组件统一约定）
- `path` 而不是 `prop`（form item 关联字段名的 prop）
- `label-placement` 控制 label 位置：`left` / `top`（默认）
- `FormInst` 而不是 FormInstance（命名风格）

校验规则底层用的也是 async-validator（与 Element Plus 同源），
所以 type / pattern / enum 等校验类型完全兼容。

trigger 决定何时触发校验 —— blur（失焦）/ change（改值）/ submit（提交）。
最佳实践：blur + 提交时 validate 全表，避免输入过程中频繁红框。
-->

---
transition: fade-out
---

# NForm 深度（二）：校验 + 提交

validate / restoreValidation / 自定义校验器

<v-click>

**提交 + 重置**

```ts
async function handleSubmit() {
  try {
    await formRef.value?.validate();
    await api.createUser(form);
    message.success("创建成功");
  } catch (errors) {
    console.warn("校验未通过", errors);
  }
}

function handleReset() {
  formRef.value?.restoreValidation();   // 清除红框
  Object.assign(form, initialForm);     // 手动重置值
}
```

</v-click>

<v-click>

**自定义校验器（异步可用）**

```ts
const checkUsername = async (rule: any, value: string) => {
  if (!value) return new Error("用户名必填");
  const exists = await api.checkUserName(value);
  if (exists) return new Error("用户名已被占用");
  return true;
};

const rules: FormRules = {
  name: { validator: checkUsername, trigger: "blur" },
};
```

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] validate() 返回 Promise，校验通过 resolve、失败 reject 一个 errors 对象。
推荐用 try/catch 写法（async/await），比 callback 风格清晰。

Naive UI 与 Element Plus 的几个差异：
- restoreValidation() 只清除「校验状态」（红框 / 错误消息），不重置 model 值
- 重置 model 值需要自己手动 Object.assign 或重新赋值（这是有意设计）

设计理由：很多场景下用户不希望「点重置就清空所有字段」——
比如表单局部修改 + 校验失败时，应该只清掉错误提示，保留用户输入。

如果确实想「值 + 校验」全清，自己写一个 reset 函数处理两件事。

[click] 自定义校验器签名比 Element Plus 更现代 ——
`async (rule, value) => Error | true | undefined` —— 直接 return，不用 callback。

return new Error('xxx') = 校验失败
return true 或 undefined = 校验通过

这种「直接 return」的设计比 Element Plus 的 `callback(new Error(...))` 风格更符合现代 JavaScript 习惯。
-->

---
transition: fade-out
---

# NDataTable 深度：声明式 columns

columns 数组定义列结构

<v-click>

```vue
<script setup lang="ts">
import { h, ref } from "vue";
import { NButton, NDataTable } from "naive-ui";
import type { DataTableColumns } from "naive-ui";

interface User {
  id: number;
  name: string;
  age: number;
  createdAt: string;
}

const data = ref<User[]>([
  { id: 1, name: "Tom", age: 28, createdAt: "2026-05-01" },
  { id: 2, name: "Jerry", age: 32, createdAt: "2026-04-15" },
]);

const columns: DataTableColumns<User> = [
  { type: "selection" },
  { title: "ID", key: "id", width: 80, sorter: "default" },
  { title: "姓名", key: "name", sorter: "default" },
  { title: "年龄", key: "age", sorter: (a, b) => a.age - b.age },
  { title: "创建时间", key: "createdAt", sorter: "default" },
  {
    title: "操作",
    key: "actions",
    render: (row) => h(NButton, { size: "small", onClick: () => edit(row) }, "编辑"),
  },
];
</script>

<template>
  <n-data-table :columns="columns" :data="data" :bordered="false" striped />
</template>
```

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NDataTable 是 Naive UI 最强大、也最特别的组件 ——
它的列定义方式与 Element Plus 完全不同。

Element Plus：`<el-table-column>` 子组件模板式声明
Naive UI：JS 数组对象式声明（`columns: DataTableColumns<T>`）

为什么 JS 对象式？
- TypeScript 友好 —— `DataTableColumns<User>` 让每个列定义都有完整类型推导
- 动态列友好 —— 可以根据条件动态生成列（filter / map / push）
- 配置即代码 —— 列定义可以保存到 store / localStorage（用户自定义列）
- render 函数灵活 —— 用 h() 函数渲染任意 Vue 组件（按钮、图标、Tag）

代价：写法相比模板式更「程序员风」—— 设计师 / 新人需要适应。
但好处也很多 —— Ant Design 系列、Element Plus 的高级 Table 也在向这个方向迁移。

核心字段：
- type: 'selection' / 'expand' —— 特殊列类型
- title: 表头文字
- key: 关联 data 字段名（TS 友好）
- width: 列宽
- sorter: 排序函数（'default' 表示按 key 字段默认排序）
- render: 自定义渲染函数（h() 返回 VNode）
- fixed: 'left' / 'right' —— 固定列
- ellipsis: 文字超长省略

bordered / striped / size 控制表格外观，
不需要 SCSS / class 调整，prop 一行搞定。
-->

---
transition: fade-out
---

# NDataTable 进阶：分页 + 虚拟滚动

服务端分页 + 虚拟列表大数据

<v-click>

**服务端分页**

```vue
<script setup lang="ts">
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  onChange: (page: number) => {
    pagination.page = page;
    load();
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    load();
  },
});

async function load() {
  const { list, total } = await api.queryUsers({
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  data.value = list;
  pagination.itemCount = total;
}
</script>

<template>
  <n-data-table :columns="columns" :data="data" :pagination="pagination" remote />
</template>
```

</v-click>

<v-click>

**虚拟滚动（大数据集）**

```vue
<n-data-table :columns="columns" :data="bigData" :max-height="400" virtual-scroll />
```

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 分页配置全部塞进 pagination 对象里 —— 这是 Naive UI 的设计模式。

Element Plus 是「Table + Pagination 两个组件分开」，Naive UI 是「Pagination 内置到 Table 里」。

好处：
- pagination 对象集中所有分页相关状态 + 回调
- showSizePicker / pageSizes 一并配置，不需要单独的组件
- 不需要管理两个 v-model（currentPage / pageSize）

`remote` 属性表示「服务端分页」—— 不要前端自动切片数据，依赖外部 load() 函数。

[click] 虚拟滚动是 Naive UI 的杀手锏 ——
其他 UI 库要么不支持（Element Plus 需要 ElTableV2），要么需要专门配置（Ant Design Vue）。

Naive UI 只需一个 `virtual-scroll` prop —— 10K+ 行数据照样丝滑滚动。

实现原理：
- DOM 只渲染当前可视区域 + 上下缓冲区的行（通常 20-30 行）
- 滚动时复用 DOM 节点，更新内容
- 配合 max-height 限定容器高度，启用滚动

适用场景：
- 日志查看（千万条记录滚动）
- 大型订单列表（无分页流式加载）
- 自动驾驶数据回放（实时数据展示）

注意：virtual-scroll 要求每行高度固定，不支持动态高度（这是虚拟列表的通用限制）。
-->

---
transition: fade-out
---

# 反馈四件套：Composable API

useMessage / useDialog / useNotification / useLoadingBar

<v-click>

**useMessage（轻提示，顶部短暂显示）**

```ts
import { useMessage } from "naive-ui";

const message = useMessage();
message.success("保存成功");
message.warning("当前网络不稳定");
message.error("请求失败");
message.info("操作未保存");
message.loading("处理中...", { duration: 0 });
```

</v-click>

<v-click>

**useDialog（模态对话框，强制确认）**

```ts
import { useDialog } from "naive-ui";

const dialog = useDialog();

dialog.warning({
  title: "危险操作",
  content: "删除后不可恢复，确认删除？",
  positiveText: "删除",
  negativeText: "取消",
  onPositiveClick: async () => {
    await api.delete(id);
    message.success("已删除");
  },
});
```

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] useMessage 是「最轻量」的反馈 —— 顶部居中、3 秒后自动消失、不阻断用户操作。
适合「保存成功 / 删除完成 / 网络异常」这种瞬时反馈。

五种 type：success / warning / error / info / loading，颜色与图标自动匹配。

注意：必须在 setup 内调用 useMessage()！
- 必须有 NMessageProvider 包根（前面入口章节讲过）
- 返回的 message 对象是当前组件的 message API
- 配置选项：duration / closable / icon / keepAliveOnHover

不能在 setup 外调用（比如 router guard、axios interceptor），
这种场景需要用 createDiscreteApi（下面会讲）。

[click] useDialog 是「最重」的反馈 —— 模态遮罩 + 必须点确认 / 取消才能继续。

与 Element Plus 的 ElMessageBox 相比，Naive UI 的 useDialog 设计更现代：
- 不返回 Promise（用 onPositiveClick / onNegativeClick 回调）
- positiveText / negativeText 替代 Element Plus 的 confirmButtonText / cancelButtonText
- onPositiveClick 可以 return false 阻止关闭

四种 type：success / warning / error / info（对应不同图标颜色）。

危险操作必用！删除、批量操作、不可逆变更 —— 没有 dialog confirm 等于挖坑等用户踩。

注意：必须有 NDialogProvider 包根才能用 useDialog。
-->

---
transition: fade-out
---

# 反馈四件套（续）：notification / loadingBar

`useNotification` + `useLoadingBar`

<v-click>

**useNotification（右上角通知）**

```ts
import { useNotification } from "naive-ui";

const notification = useNotification();

notification.info({
  title: "系统消息",
  content: "您有 3 条新待办",
  meta: "5 秒前",
  duration: 0,
  keepAliveOnHover: true,
});
```

</v-click>

<v-click>

**useLoadingBar（顶部进度条，路由切换神器）**

```ts
import { useLoadingBar } from "naive-ui";

const loadingBar = useLoadingBar();

router.beforeEach((to, from, next) => {
  loadingBar.start();
  next();
});

router.afterEach(() => {
  loadingBar.finish();
});

router.onError(() => {
  loadingBar.error();
});
```

</v-click>

<v-click>

> 💡 **设计原则**：紧急度从低到高 → Message → Notification → Dialog；进度反馈 → LoadingBar（顶部细线）。

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] useNotification 介于 Message 和 Dialog 之间 ——
右上角浮层、信息更丰富（带标题 + 内容 + meta）、可手动关闭。

适合「待办提醒 / 系统消息 / 长文本通知」这种「非紧急但需要用户注意」的场景。

配置选项：
- title：标题（粗体）
- content：主体内容（可以是字符串或 VNode）
- meta：附加元信息（通常是时间戳，灰色小字）
- duration: 0 表示「不自动关闭，必须用户点 X 才消失」—— 重要通知必用
- keepAliveOnHover: true 鼠标悬停时暂停倒计时（关键体验细节）
- avatar / icon：左侧图标

[click] useLoadingBar 是 Naive UI 独有的反馈类型 ——
其他 UI 库一般没有这个组件（NProgress 是社区项目）。

它在浏览器顶部渲染一根「2px 高的进度条」，路由切换 / 异步操作时显示进度。
这是 GitHub / Vercel / 现代单页应用的「标志性反馈」。

API：
- start()：显示进度条（从 0% 开始，缓慢自增到 80%）
- finish()：完成（瞬间 100% 后消失）
- error()：错误（瞬间变红后消失）

最佳场景：Vue Router 守卫 —— beforeEach start，afterEach finish，onError error。
路由切换 + 接口请求结合时，progress bar 给用户「应用还在响应」的强烈反馈。

[click] 四件套的设计哲学：
- Message：瞬时（成功 / 失败）
- Notification：稍微重一些（带标题 / 不自动消失）
- Dialog：最重（必须用户决策）
- LoadingBar：长操作进度反馈（路由 / 大文件上传）

按场景选用，不要混用 —— 否则用户被反馈淹没。
-->

---
transition: fade-out
---

# createDiscreteApi：在 setup 外调用

Composable 离不开 Provider，但有时候 setup 外也要用

<v-click>

**问题**：useMessage 等只能在 setup 内调用，但 axios interceptor / router guard 在 setup 外。

</v-click>

<v-click>

**解决方案**：用 createDiscreteApi

```ts
// utils/discrete.ts
import { createDiscreteApi } from "naive-ui";

const { message, dialog, notification, loadingBar } = createDiscreteApi(
  ["message", "dialog", "notification", "loadingBar"],
  {
    configProviderProps: {
      theme: darkTheme,   // 可独立配置
    },
  },
);

export { message, dialog, notification, loadingBar };
```

</v-click>

<v-click>

**使用**

```ts
// axios.ts
import { message } from "@/utils/discrete";

axios.interceptors.response.use(undefined, (err) => {
  message.error(err.message || "请求失败");
  return Promise.reject(err);
});
```

</v-click>

<v-click>

> 💡 **重要约束**：discrete API 不受 NConfigProvider 影响，使用独立 DOM 容器。不要把同一应用混用 useMessage + discrete message。

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Naive UI 「Composable + Provider 架构」的最大陷阱 ——

useMessage / useDialog / useNotification / useLoadingBar 都依赖 Provider 在组件树中分发实例。
但在 setup 之外（比如 axios interceptor、router guard、Pinia store action），
你拿不到组件实例，自然也调不了 inject —— 报错「inject must be called from setup」。

[click] createDiscreteApi 是官方解决方案 ——

它在模块加载时（不在 setup 内）创建一个「独立的」消息系统：
- 不需要组件树中的 Provider
- 不受当前应用的 NConfigProvider 影响（独立的 theme / locale）
- 在 document.body 下挂载独立的 DOM 容器

用法：
- 传入需要的 API 列表（'message' / 'dialog' / 'notification' / 'loadingBar'）
- 可选传入各 Provider 的配置（configProviderProps / messageProviderProps 等）
- 返回各 API 对象，可以 export 出去全局使用

[click] 实际使用：
- axios interceptor：网络错误时 message.error
- router guard：beforeEach loadingBar.start, afterEach loadingBar.finish
- Pinia action：API 调用失败时 dialog.warning

[click] 但有几个重要约束！

1. **不要在 setup 内调用 createDiscreteApi**！它会重复创建实例，且无法正确 unmount。
   写在模块顶层（utils/discrete.ts），import 即可。

2. **不要把 useMessage 和 discrete message 混用** ——
   它们是「两个独立系统」，主题 / locale 可能不一致，用户看到的样式会乱。
   选一个用，且全应用统一。

3. **discrete API 不响应 NConfigProvider 的 theme 变化** ——
   如果应用支持暗色切换，要自己监听 isDark 状态并手动 unmount/remount discrete API。
   或者：在 createDiscreteApi 的 configProviderProps 传入响应式 ref。
-->

---
transition: fade-out
---

# 主题深度（一）：GlobalThemeOverrides

不需要 CSS Variables / SCSS，纯 JS 对象配置

<v-click>

```vue
<script setup lang="ts">
import { NConfigProvider, darkTheme } from "naive-ui";
import type { GlobalThemeOverrides } from "naive-ui";

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#FF6B35",
    primaryColorHover: "#FF8C5C",
    primaryColorPressed: "#E55A2B",
    successColor: "#28A745",
    borderRadius: "6px",
    fontSize: "14px",
  },
  Button: {
    textColor: "#FF6B35",
    fontWeight: "600",
  },
  Select: {
    peers: {
      InternalSelection: {
        textColor: "#FF6B35",
      },
    },
  },
};
</script>

<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
    <App />
  </n-config-provider>
</template>
```

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Naive UI 主题系统的「核心三段式」：

- `theme` prop：基础主题（null = 浅色 / darkTheme = 暗色 / 自定义 GlobalTheme = 完全替换）
- `theme-overrides` prop：在主题基础上「微调」
- `peers`：嵌套覆盖某个子组件（比如 NSelect 内部用的 NInternalSelection）

GlobalThemeOverrides 类型让每个 key 都有完整的 IDE 补全 —— 不需要查文档。

common 字段是「全局共享 token」：
- primaryColor / primaryColorHover / primaryColorPressed / primaryColorSuppl —— 主色四态
- successColor / warningColor / errorColor / infoColor —— 语义色
- borderRadius / fontSize / fontWeight —— 通用 token
- textColorBase / textColor1 / textColor2 / textColor3 —— 文字色阶
- bodyColor / cardColor / popoverColor / modalColor —— 背景色阶

组件级覆盖（如 Button）只影响该组件 —— 这是「全局基线 + 局部微调」的优雅设计。

peers 是嵌套覆盖 —— 比如 NSelect 内部用了 NInternalSelection 组件，
想改 Select 下拉框的字体颜色，需要 `Select.peers.InternalSelection.textColor`。
这种嵌套结构 IDE 自动补全也能引导，不会写错路径。

最大的优势：所有主题改动都是「JavaScript 对象」——
- 可以保存到 localStorage / 后端（多租户场景）
- 可以根据 ref 动态切换（不需要重新编译 / 刷新）
- 可以根据用户角色 / 时间段 / 系统设置实时生成
-->

---
transition: fade-out
---

# 主题深度（二）：动态切换 + 多主题

ref + computed 实现运行时切换

<v-click>

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { NConfigProvider, darkTheme } from "naive-ui";

type ThemeMode = "light" | "dark" | "brand";

const mode = ref<ThemeMode>("light");

const theme = computed(() => (mode.value === "dark" ? darkTheme : null));

const themeOverrides = computed(() => {
  switch (mode.value) {
    case "light":
      return { common: { primaryColor: "#18A058" } };
    case "dark":
      return { common: { primaryColor: "#63E2B7" } };
    case "brand":
      return { common: { primaryColor: "#FF6B35", borderRadius: "12px" } };
  }
});
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-button @click="mode = 'light'">浅色</n-button>
    <n-button @click="mode = 'dark'">暗色</n-button>
    <n-button @click="mode = 'brand'">品牌色</n-button>
    <App />
  </n-config-provider>
</template>
```

</v-click>

<v-click text-xs class="mt-2">

> 💡 切换主题 = 改一个 ref。整个应用样式立即更新，无需重新编译。

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Naive UI 主题系统最让人惊艳的地方 ——

切换主题 = 改一个 ref。
所有用了 Naive UI 组件的地方，瞬间应用新主题。
不需要重新编译、不需要切换样式表、不需要给 html 加 class —— 整个应用看起来就是「响应式数据」。

实现原理：
- NConfigProvider 通过 provide/inject 把 theme + themeOverrides 注入到子组件树
- 每个 Naive UI 组件内部用 inject + computed 计算最终样式
- CSS-in-JS 引擎根据计算结果实时生成 style 标签
- ref 变化 → computed 重新计算 → style 重新生成 → 视觉更新

对比其他 UI 库的主题切换：
- Element Plus：需要切 CSS Variables 或重新加载 SCSS
- Vuetify：需要 useTheme().global.name = 'dark'
- Ant Design Vue：通过 ConfigProvider 但样式切换有延迟

Naive UI 的方案在「响应式 + 灵活性」上是顶尖的 —— 因为主题对象就是普通 ref / computed。

[click] 多主题场景例子：
- 不同租户用不同品牌色 → 后端返回主题对象，前端直接 apply
- 节日主题切换 → 圣诞节绿红、春节红金 → 改 themeOverrides 即可
- 高对比度模式（无障碍）→ 增加 textColor 对比度
- A/B 测试 → 用户被随机分到不同主题对照实验

代价：渲染需要 CSS-in-JS 运行时开销 —— bundle 包含 css-render 库（约 10KB gzipped）。
但相比「不能动态切换主题」的限制，这点开销非常划算。
-->

---
transition: fade-out
---

# 国际化：locale + dateLocale

切换语言 = 改 locale 对象

<v-click>

**配置 locale**

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { NConfigProvider, zhCN, enUS, dateZhCN, dateEnUS } from "naive-ui";

const lang = ref<"zh" | "en">("zh");

const locale = computed(() => (lang.value === "zh" ? zhCN : enUS));
const dateLocale = computed(() => (lang.value === "zh" ? dateZhCN : dateEnUS));
</script>

<template>
  <n-config-provider :locale="locale" :date-locale="dateLocale">
    <n-button @click="lang = lang === 'zh' ? 'en' : 'zh'">
      切换 / Switch
    </n-button>
    <n-date-picker type="date" />
    <App />
  </n-config-provider>
</template>
```

</v-click>

<v-click>

> 💡 **locale 与 dateLocale 是两个独立 prop** —— locale 控制组件内置文字（如「确定 / 取消」），dateLocale 控制日期组件的月份星期。

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Naive UI 的国际化方案：

NConfigProvider 接两个 locale prop：
- `locale`：组件内置文字（确定 / 取消、分页 / 搜索、空状态等）
- `date-locale`：日期组件的月份 / 星期名（基于 date-fns）

这两个是「独立的两个 prop」—— 一些组件库（包括 Element Plus）把它们合并成一个，
Naive UI 故意分开是为了「灵活性」—— 比如你可以用中文界面但显示英文日期。

支持的语言（部分）：
- zhCN / dateZhCN：简体中文
- zhTW / dateZhTW：繁体中文
- enUS / dateEnUS：美式英语
- enGB / dateEnGB：英式英语
- jaJP / dateJaJP：日语
- koKR / dateKoKR：韩语
- frFR / dateFrFR：法语
- deDE / dateDeDE：德语
- ruRU / dateRuRU：俄语
- arDZ / dateArDZ：阿拉伯语
- ...等 25+ 语言

通过 `import { zhCN } from 'naive-ui'` 引入，Tree-shaking 友好 —— 只打包用到的语言。

[click] 与 vue-i18n 协同的标准模式：
- vue-i18n 管业务文案
- Naive UI locale 管组件内置文案
- 两者共享同一个 locale state（写在 Pinia 或 useStorage）
- 切换时同步更新两边

注意：dateLocale 用的是 date-fns 的 locale，与 Naive UI 自带的 dateZhCN 等 export 一致。
如果项目里也单独用 date-fns 格式化日期，可以共享同一个 locale 对象。
-->

---
transition: fade-out
---

# SSR + Nuxt 集成

零样式 import = SSR 友好

<v-click>

**Vite SSR / Vue 原生 SSR**

```ts
import { renderToString } from "vue/server-renderer";
import { setup } from "@css-render/vue3-ssr";

async function render(app: App) {
  const { collect } = setup(app);
  const html = await renderToString(app);
  const styleTag = collect();   // 收集 CSS-in-JS 注入的样式
  return `
    <head>${styleTag}</head>
    <body><div id="app">${html}</div></body>
  `;
}
```

</v-click>

<v-click>

**Nuxt 3 集成（推荐）**

```bash
pnpm add -D nuxtjs-naive-ui
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["nuxtjs-naive-ui"],
  build: {
    transpile: process.env.NODE_ENV === "production"
      ? ["naive-ui", "vueuc", "@css-render/vue3-ssr", "@juggle/resize-observer"]
      : ["@juggle/resize-observer"],
  },
});
```

</v-click>

<v-click>

> 💡 **要点**：CSS-in-JS 的 SSR 需要 collect() 把 server 端注入的 CSS 输出到 HTML head，否则首屏 FOUC（无样式闪烁）。

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Naive UI 的 SSR 比一般 UI 库稍微复杂 —— 因为 CSS-in-JS 的特殊性。

CSS-in-JS 的工作流程：
- 客户端：组件挂载时，运行时生成 style 标签插入 head
- 服务端：组件渲染时，需要收集所有 style 内容，输出到 HTML 的 head

如果不做这一步，浏览器先看到「无样式 HTML」，CSS-in-JS 引擎运行后才注入样式 ——
中间会有「短暂的样式闪烁」（FOUC），用户体验糟糕。

解决：用 `@css-render/vue3-ssr` 包的 `setup(app)` ——
它返回 `collect()` 函数，渲染完成后调用收集所有 style，
拼接到 HTML 的 `<head>` 即可。

代价：SSR 渲染稍微复杂（多了 setup + collect 两步），
但 Naive UI 的 SSR 在 Vite / Nuxt 等现代框架下早已成熟。

[click] Nuxt 3 项目用社区维护的 `nuxtjs-naive-ui` 模块 ——

它自动处理：
- SSR style collect
- 组件按需引入
- transpile 列表（production 必须 transpile naive-ui 等 ESM 模块）

注意：transpile 列表在 dev 和 production 不同 ——
dev 模式 Vite 处理 ESM 直接，production 时 esbuild 需要明确 transpile。

[click] 与 Element Plus / Vuetify 对比：
- Element Plus：官方 @element-plus/nuxt 模块，更成熟
- Vuetify：官方 Nuxt module，但配置复杂
- Naive UI：社区 module，但因 CSS-in-JS 设计配置反而简单

整体来说，SSR 是 Naive UI 在「企业级框架」标签上稍弱的一环 ——
官方没有自维护 Nuxt 模块，但社区方案足够稳定。
-->

---
transition: fade-out
---

# TypeScript 实战：组件实例类型

获取实例调方法 / 解构 props

<v-click>

**获取组件实例**

```ts
import type {
  FormInst,
  DataTableInst,
  InputInst,
  SelectInst,
  UploadInst,
} from "naive-ui";

const formRef = ref<FormInst | null>(null);
const tableRef = ref<DataTableInst | null>(null);
const inputRef = ref<InputInst | null>(null);

onMounted(() => {
  inputRef.value?.focus();
  tableRef.value?.clearSorter();
  tableRef.value?.scrollTo({ top: 0 });
});

async function submit() {
  await formRef.value?.validate();
}
```

</v-click>

<v-click>

**主题 token 类型推导**

```ts
import type { GlobalThemeOverrides } from "naive-ui";

// IDE 自动补全所有可覆盖的 token
const theme: GlobalThemeOverrides = {
  common: {
    primaryColor: "#FF6B35",
    // ^^^ Hover 显示完整类型，写错立刻报错
  },
};
```

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Naive UI 为每个组件导出对应的 Instance 类型 ——
FormInst / DataTableInst / InputInst / SelectInst / UploadInst ……

命名风格：组件名 + Inst（不是 Element Plus 的 Instance）—— 更简短。

用法：`ref<FormInst | null>(null)` —— 标注 ref 的类型，IDE 立刻知道实例上有哪些方法。
然后通过 .value? 安全访问（template ref 初始 null）。

常用实例方法：
- FormInst：validate / restoreValidation / clearValidation
- DataTableInst：clearFilters / clearSorter / page / scrollTo / filter / sort
- InputInst：focus / blur / select / activate / deactivate
- SelectInst：focus / blur
- UploadInst：submit / openOpenFileDialog / clear
- ScrollbarInst：scrollTo / scrollBy

[click] 主题 token 类型推导是 Naive UI 真正惊艳的地方 ——

`GlobalThemeOverrides` 不是「object 类型」—— 它是「每个 key 都有完整定义」的类型。
打开 IDE 写 `theme.common.` 会自动列出所有可覆盖的 token：
- primaryColor、primaryColorHover、primaryColorPressed、primaryColorSuppl
- successColor、warningColor、errorColor、infoColor
- borderRadius、borderRadiusSmall
- fontSize、fontSizeMini、fontSizeSmall、fontSizeMedium、fontSizeLarge
- textColorBase、textColor1、textColor2、textColor3、textColorDisabled
- bodyColor、cardColor、modalColor、popoverColor

每个组件级覆盖（Button、Input、Select 等）也都有自己的可覆盖 token 列表，
都通过 TypeScript 类型暴露出来。

这种「类型即文档」的设计让开发者完全不需要查文档 ——
打开 IDE，敲一个点，所有可选都列出来。这是 Naive UI 与同类 UI 库最大的体验差异。
-->

---
transition: fade-out
---

# Modal / Drawer / Popover

模态 / 抽屉 / 浮层三件套

<v-click>

**NModal（模态对话框）**

```vue
<n-modal v-model:show="visible" preset="card" title="编辑用户" style="width: 500px">
  <n-form :model="form">…</n-form>
  <template #footer>
    <n-button @click="visible = false">取消</n-button>
    <n-button type="primary" @click="handleSubmit">保存</n-button>
  </template>
</n-modal>
```

</v-click>

<v-click>

**NDrawer（侧边抽屉）**

```vue
<n-drawer v-model:show="drawerVisible" :width="400" placement="right">
  <n-drawer-content title="筛选条件" closable>
    <n-form :model="filters">…</n-form>
  </n-drawer-content>
</n-drawer>
```

</v-click>

<v-click>

**NPopover（轻量浮层）**

```vue
<n-popover placement="top" trigger="hover" :width="200">
  <template #trigger>
    <n-button>悬停查看</n-button>
  </template>
  <p>这是一段提示内容</p>
</n-popover>
```

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NModal 是 Naive UI 弹层的「最强组件」——

注意几个 Naive UI 的独特设计：
- `v-model:show` 而不是 `v-model:visible` —— 全组件统一约定
- `preset="card"` 用预设卡片样式（带 title / footer / padding）—— 不用 preset 是完全自定义
- preset 还有 `dialog` / `confirm` —— 用 dialog 模式（带 type icon、positiveText）

为什么有 preset？
- preset="card"：通用模态（带头部 footer，自由内容）
- preset="dialog"：固定布局的对话框（标题 + 内容 + 按钮，类似 useDialog 的样式）
- 不传 preset：完全自定义内容（自己写所有结构）

[click] NDrawer 是侧边抽屉 —— 适合长内容 / 筛选条件 / 帮助文档。
placement 四个方向：`right` / `left` / `top` / `bottom`。

特别注意：NDrawer 内部必须有 NDrawerContent 包装内容 ——
NDrawer 本身只是「容器」，NDrawerContent 提供 title / closable / footer 等结构。

这种「双层组件」设计在 Naive UI 很常见 ——
- NCard 单层
- NDrawer + NDrawerContent 双层
- NModal + preset 视情况单/双层

[click] NPopover 是「最轻」的浮层 —— hover 或 click 触发，跟随触发元素。

注意 trigger slot ——
Naive UI 用 `<template #trigger>` 包裹触发元素（Element Plus 是 `<template #reference>`）。
trigger prop 三种：`hover` / `click` / `manual`（手动控制 show）。

placement 12 个方向：top / top-start / top-end / bottom / left / right / left-start ……
与 Element Plus 完全一致（都用了 popper.js 同款 placement 定义）。
-->

---
transition: fade-out
---

# 生态与配套库

围绕 Naive UI 的官方 / 社区工具链

<v-click>

| 库                          | 作用                                         |
| --------------------------- | -------------------------------------------- |
| **@vicons/ionicons5**       | Ionicons 5 图标包（ionicons.com）            |
| **@vicons/antd**            | Ant Design 图标包                            |
| **@vicons/material**        | Material Design 图标包                       |
| **@vicons/tabler**          | Tabler Icons 图标包                          |
| **@vicons/fluent**          | Fluent UI 图标包                             |
| **vfonts**                  | Lato 主字体 + Fira Code 代码字体             |
| **nuxtjs-naive-ui**         | Nuxt 3 集成模块（社区维护）                  |
| **naive-ui-admin**          | 开源后台模板（jekip 团队）                   |
| **vue-naive-admin**         | 现代化后台模板（zclzone）                    |
| **pinx-admin**              | TypeScript 后台模板（pinx-docs）             |
| **NaiveAdmin**              | 商业版后台框架                               |
| **@bluryar/naive-ui-themes**| 主题切换工具库                               |

</v-click>

<v-click text-xs class="mt-4">

> 💡 **图标方案**：Naive UI 不绑定图标库 —— 推荐 @vicons/* 系列，按需引入任意图标集合。

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Naive UI 生态分三层 ——

图标方案：
Naive UI 没有官方图标库（这一点与 Element Plus 不同）——
官方推荐用 @vicons/* 系列（07akioni 维护），覆盖主流图标集：
- ionicons5：Ionic 图标，风格圆润
- antd：Ant Design 图标，企业风
- material：Material Design 图标，Google 风
- tabler：Tabler Icons 极简风
- fluent：Microsoft Fluent UI 图标

用法：`import { Search } from '@vicons/ionicons5'` + `<n-icon><Search /></n-icon>`

字体方案：
vfonts 是 07akioni 维护的字体包（Lato 主字体 + Fira Code 代码字体）——
不依赖第三方 CDN，本地打包，加载快。

[click] 中后台模板：
- naive-ui-admin（jekip）：开源后台框架，社区活跃
- vue-naive-admin（zclzone）：现代化模板，TypeScript + Pinia + Vite
- pinx-admin：企业级模板，包含权限 / 多租户
- NaiveAdmin：商业版（收费）—— 更完整的企业功能

中后台技术栈标配：
Vue 3 + Naive UI + Vue Router + Pinia + Vite + TypeScript + UnoCSS（或 Tailwind）+ ECharts

[click] 主题切换工具：
@bluryar/naive-ui-themes 提供「多主题预设 + 切换」的封装，
适合「不想自己写 themeOverrides」的快速启动场景。
-->

---
transition: fade-out
---

# 常见踩坑（一）：Provider 与 setup

useMessage 报错 / NConfigProvider 缺失

<v-click>

**坑 1：useMessage is undefined**

```ts
// ❌ 没有 NMessageProvider 包根
const App = createApp(MyApp);  // MyApp 里直接 useMessage()
// → 控制台报错：injection key not found / message is undefined

// ✅ 必须包根 NMessageProvider
<n-message-provider>
  <MyApp />
</n-message-provider>
```

</v-click>

<v-click>

**坑 2：在 axios interceptor 调 useMessage**

```ts
// ❌ setup 外调用
axios.interceptors.response.use(undefined, (err) => {
  const message = useMessage();   // 报错：inject must be called from setup
});

// ✅ 用 createDiscreteApi
import { message } from "@/utils/discrete";
axios.interceptors.response.use(undefined, (err) => {
  message.error(err.message);
});
```

</v-click>

<v-click>

**坑 3：主题切换无效**

`theme-overrides` 必须传 reactive 才能动态切换 —— 传字面量对象会失效。

```ts
const themeOverrides = computed(() => ({ common: { primaryColor: color.value } }));
//  ^^^ 必须 computed
```

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 「useMessage is undefined」是 Naive UI 新手的头号踩坑 ——

useMessage 的工作原理是：从 Vue 组件树中 inject 一个 message 实例。
但是这个实例必须先由 NMessageProvider 通过 provide 注入到组件树中。

如果忘了包 NMessageProvider，inject 拿不到值，
useMessage() 返回 undefined，调用 .success() 立即报错。

类似的：
- useDialog 需要 NDialogProvider
- useNotification 需要 NNotificationProvider
- useLoadingBar 需要 NLoadingBarProvider

最佳实践：项目入口（main.ts 或 App.vue）一次性嵌套全部四个 Provider，
所有子组件就能用对应的 Composable。

[click] 「inject must be called from setup」是另一个高频坑 ——

useMessage 等 Composable 必须在 setup 上下文内调用：
- setup() 函数体内
- `<script setup>` 顶层
- 由 setup 调用的同步代码

不能在以下场景使用：
- axios interceptor / fetch wrapper
- router guard（beforeEach / beforeEnter）
- Pinia store action
- 模块顶层 / 立即执行函数

解决：用 createDiscreteApi 创建「独立的消息系统」（前面章节讲过）。
然后 import 这个 message 对象，在任何地方调用。

[click] 「主题切换无效」是更隐蔽的坑 ——

`theme-overrides` prop 必须是「响应式数据」（ref / computed），
传字面量 `:theme-overrides="{ common: { primaryColor: '#FF6B35' } }"` 是「常量字面量」，
NConfigProvider 不会监听这个对象的变化。

解决：
- 静态主题：传字面量没问题（不需要切换）
- 动态主题：必须 reactive / computed，让 Vue 能跟踪依赖

写代码时一定要意识到「响应式系统是基于依赖追踪」—— 传字面量等于「断开了响应式链路」。
-->

---
transition: fade-out
---

# 常见踩坑（二）：API 与样式

NDataTable render / 字体丢失 / SSR 闪烁

<v-click>

**坑 4：DataTable render 函数不响应数据变化**

```ts
// ❌ render 闭包捕获了「初始 row」
const columns = data.value.map((row) => ({
  render: () => h("span", row.name),    // row 不变
}));

// ✅ render 接收当前 row 参数
const columns = [
  { render: (row) => h("span", row.name) },
];
```

</v-click>

<v-click>

**坑 5：默认字体丢失 / 中文字体异常**

Naive UI 默认用 Lato 字体（vfonts/Lato.css），中文系统下可能 fallback 到衬线字体。

```ts
// 解决：覆盖 common.fontFamily
const themeOverrides = {
  common: {
    fontFamily: '"Inter", "PingFang SC", "Microsoft YaHei", sans-serif',
  },
};
```

</v-click>

<v-click>

**坑 6：SSR 首屏样式闪烁（FOUC）**

CSS-in-JS 默认运行时生成样式，SSR 必须 collect → 注入到 HTML head。

```ts
import { setup } from "@css-render/vue3-ssr";
const { collect } = setup(app);
const styleTag = collect();   // 拼到 HTML <head>
```

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NDataTable render 函数闭包问题 ——

这是 JavaScript 闭包的经典陷阱：
- 在 map 里定义 render，render 是闭包，捕获了 map 时的 row
- 当 data 变化（比如 splice / push），重新 map 会重建 columns，但 row 引用过期

解决：render 函数应该接收 row 参数（Naive UI 的标准 API），不要依赖闭包：
```
render: (row, rowIndex) => h(...)
```

这样每次渲染时，row 是「当前实际行」，不会有闭包过期问题。

类似的：filter 函数、sort 函数也都接收 row / column 参数 —— 不要靠闭包。

[click] 中文字体问题是「Naive UI + 国内项目」的高频坑 ——

Naive UI 默认 `font-family: 'Lato', sans-serif` —— Lato 是英文字体，没有中文字形。
浏览器 fallback 到 sans-serif，在 macOS 下可能变成宋体 / 楷体（衬线字体），
在 Windows 下可能变成默认无衬线字体（但字间距异常）。

解决：在 themeOverrides 里覆盖 `common.fontFamily`，
加入中文字体（PingFang SC / Microsoft YaHei / Source Han Sans）。

最佳实践 font stack：
`'Inter', 'PingFang SC', 'Microsoft YaHei', 'Source Han Sans', sans-serif`
- Inter：现代英文字体（漂亮）
- PingFang SC：macOS 中文字体
- Microsoft YaHei：Windows 中文字体
- Source Han Sans：Linux / Android 中文字体

[click] SSR 首屏 FOUC 是 CSS-in-JS 的「原罪」——

客户端组件挂载时才生成 style，所以 SSR HTML 里没有任何样式 ——
浏览器先渲染「无样式 HTML」，等 JS 加载完成后才注入 CSS。
中间会有「无样式闪烁」（FOUC, Flash Of Unstyled Content）。

解决：服务端渲染时用 `@css-render/vue3-ssr` 的 `setup(app)` 配合 `collect()`：
1. setup() 注册一个收集器
2. renderToString() 期间，所有 CSS-in-JS 引擎注入的样式被收集
3. collect() 返回收集到的 style 标签字符串
4. 拼接到 HTML 的 `<head>` 里

Nuxt 3 用 `nuxtjs-naive-ui` 模块会自动处理，不需要手动写。
-->

---
transition: fade-out
---

# 最佳实践清单

来自 Naive UI 大型项目沉淀

<v-click>

**项目初始化**

- ✅ 入口包好全部 Provider（Config / Message / Dialog / Notification / LoadingBar）
- ✅ 安装 vfonts，import Lato.css + FiraCode.css
- ✅ themeOverrides 覆盖 fontFamily 加入中文字体
- ✅ 按需引入用 NaiveUiResolver + AutoImport（useMessage 等 Composable）

</v-click>

<v-click>

**表单 + 表格**

- ✅ Form 配 `FormRules` 类型，prop 改用 `path`（不是 prop）
- ✅ DataTable columns 用 `DataTableColumns<T>` 泛型推导
- ✅ render 函数接收 row 参数，不要依赖闭包
- ✅ 大数据集启用 `virtual-scroll`，10K+ 行也丝滑

</v-click>

<v-click>

**主题与暗色**

- ✅ themeOverrides 用 computed 包裹，支持动态切换
- ✅ darkTheme 配合 VueUse useDark 实现暗色 + 持久化
- ✅ axios / router 用 createDiscreteApi 调 message / loadingBar

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 项目初始化阶段的关键决定：

Provider 嵌套是 Naive UI 的必经之路 —— 一次包好节省以后大量「为什么 useMessage 报错」的排查时间。
vfonts + 中文字体覆盖是国内项目的必修课 —— 默认 Lato 字体在中文环境效果差。
按需引入 + AutoImport 几乎是「必选」—— 不然到处写 import 维护成本高。

[click] 表单 + 表格：

FormRules 类型让校验规则与 form 对象强类型关联。
path 是 Naive UI 的命名（不是 prop）—— 与 path-based form 操作思路一致（lodash.get/set 风格）。
DataTableColumns<T> 泛型让每个列定义都能 TS 推导 row 字段。
render 函数闭包陷阱（前面踩坑章节有讲）必须避开。
virtual-scroll 是 Naive UI 杀手锏，大数据场景必启用。

[click] 主题与暗色：

themeOverrides 必须 computed —— 静态字面量不会响应切换（前面踩坑章节）。
useDark + darkTheme 是「自动跟随系统 + localStorage 持久化」的标准组合。

createDiscreteApi 是「setup 外用 Naive UI 反馈」的唯一方案 ——
但要注意：discrete API 与 setup-based API 互不影响，
统一项目里要么全用 useMessage，要么全用 discrete message，不要混。
-->

---
transition: fade-out
---

# 评价

类型最强 / 颜值最高 / 主题最灵活，但中文生态稍弱

<v-clicks>

**优点**

- 100% TypeScript 从源码到 props 到主题全链路类型安全
- 90+ 组件覆盖企业后台 + C 端 + 数据可视化场景
- 主题系统 JS 对象 + CSS-in-JS，运行时动态切换无限灵活
- 零样式 import，CSS-in-JS 自动注入
- 虚拟列表默认开启，大数据场景丝滑
- 设计语言现代清新，Vue 3 UI 库颜值之最
- 尤雨溪官方推荐，Vue 团队成员主导
- 4 个 Composable API 设计优雅，符合 Vue 3 哲学

**缺点**

- 中文生态弱于 Element Plus（文档 / 教程 / Stack Overflow 资源少）
- Provider 嵌套写法对新手不友好（容易忘记导致 useMessage 报错）
- CSS-in-JS 运行时开销（虽然只有 ~10KB gzipped）
- SSR 配置比纯 CSS UI 库稍复杂（FOUC 问题需要 collect）
- 国内大厂采用率低于 Element Plus / Ant Design Vue
- 默认中文字体支持不佳（需要手动覆盖 fontFamily）

</v-clicks>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Naive UI 的优点很集中 —— 「Vue 3 时代最现代 / 最 TS / 最灵活」——

100% TypeScript 不是营销词 —— 是从源码生根的设计哲学，
GlobalThemeOverrides 类型让主题对象的每个 key 都有 IDE 补全，这是其他 UI 库做不到的。

90+ 组件覆盖度 Vue 3 生态第一档，
主题系统的运行时 JS 对象方案在所有 Vue UI 库中是「设计最现代」的，
虚拟列表默认开启的性能优化在数据可视化场景几乎无对手。

设计语言「现代简约」—— 没有 Material Design 的强烈视觉烙印，
也没有 Ant Design 的「企业感」—— 适配性极强，颜值在线。

尤雨溪推荐这件事在 Vue 圈是巨大的光环 —— vue-vapor 实验项目就用 Naive UI。

[click] 缺点也很明确：

中文生态是最大短板 —— 虽然官方有中文文档，但社区教程 / 博客 / Stack Overflow 资源
明显少于 Element Plus。
遇到偏门问题时，「Naive UI 怎么 XXX」搜出来的资源可能不够。

Provider 嵌套写法对新手不友好 —— 第一次接触的人经常忘记包 Provider，
然后控制台一堆 inject 报错，得花时间理解架构。

CSS-in-JS 运行时开销是「设计取舍」—— 换来的是动态主题切换的无限灵活，
但对极致性能敏感的项目（嵌入式 / 低端设备）是负担。

SSR 配置稍复杂 —— 需要 collect FOUC 注入，Nuxt 3 没官方模块（社区维护）。

国内大厂采用率低 —— 阿里、字节、美团等大厂前端 PaaS 还是以 Element Plus / 自研为主。
但中小公司 / 设计驱动型团队对 Naive UI 接受度极高。

中文字体问题是「国内项目必踩」—— 第一次启动看到衬线字体懵了，
查清楚后覆盖 fontFamily 就好。

选型逻辑：追求颜值 / 类型 / 主题灵活度 → Naive UI；中后台模板成熟度 / 中文生态 → Element Plus。
-->

---
transition: fade-out
---

# 学习路径

从入门到熟练应用的 4 个阶段

<v-click>

**第 1 周：核心组件熟练**

- 通读官方文档 Common + Data Entry + Data Display 三大分组
- 跟着官方示例改例子（每个组件 demo 都能在线编辑）
- 实现一个 CRUD 页面（DataTable + Form + Modal 三件套）

</v-click>

<v-click>

**第 2 周：Provider + Composable**

- 入口包好四个 Provider（Message / Dialog / Notification / LoadingBar）
- 熟练 useMessage / useDialog / useNotification / useLoadingBar
- 用 createDiscreteApi 处理 axios / router 场景

</v-click>

<v-click>

**第 3-4 周：主题 + 企业级整合**

- 跑通 GlobalThemeOverrides + 动态切换
- 接 darkTheme + VueUse useDark 实现暗色模式
- 接入 Vue Router + Pinia + Vite + UnoCSS
- 实现登录 / 权限 / 菜单 / 表单 / 表格全套

</v-click>

<v-click>

**长期：源码 + 主题系统深入**

- 阅读 NConfigProvider / DataTable / Form 等核心组件源码
- 理解 css-render（07akioni 团队的 CSS-in-JS 引擎）原理
- 参与 issue / PR，理解 Naive UI 设计取舍

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 第一周打基础 ——
官方文档结构清晰，Common → Data Entry → Data Display 三个分组覆盖 80% 日常组件。
官方所有 demo 都能在线编辑（沙箱式），改一改就能看到效果，是最快的学习方式。
完成一个 CRUD 页面就算入门了 —— DataTable 展示 + Form 编辑 + Modal 承载 + Message 反馈。

[click] 第二周进阶 ——
Provider + Composable 是 Naive UI 与其他 UI 库最大的差异化，必须吃透。
能熟练用四个 Composable + 区分 setup-based 和 discrete API 的差别，
就已经超过 80% 的初学者。

[click] 第三到四周企业级整合 ——

主题系统是 Naive UI 的「软实力」分水岭 ——
能完整跑通动态主题切换的开发者，已经超过 90% 的同行。

darkTheme + useDark 是「自动跟随系统 + localStorage 持久化」的标准组合。

单独的 Naive UI 只是「组件库」，要变成「企业后台」需要拼接：
- 路由系统：Vue Router 4
- 状态管理：Pinia
- 构建工具：Vite
- 原子 CSS：UnoCSS（或 Tailwind）
- HTTP 客户端：axios + createDiscreteApi
- 图表：ECharts / Apache Antv

把这些拼通就是一个完整的「企业级 Naive UI 前端项目」。

[click] 长期投入推荐看源码 ——

Naive UI 的源码是「Vue 3 + TypeScript 组件库设计」的优秀教材 ——
读完会对「Composition API + CSS-in-JS + Provider 模式」有更深理解。

特别推荐看 css-render（07akioni 团队的 CSS-in-JS 引擎）——
理解了它就理解了 Naive UI 主题系统的全部秘密。
-->

---
transition: fade-out
---

# 延伸学习资源

官方 + 社区精选

<v-click>

**官方资源**

- 📖 [官方文档](https://www.naiveui.com/) —— 中英双语
- 💻 [GitHub](https://github.com/tusen-ai/naive-ui) —— 18K+ star
- 🎮 [在线 Playground](https://www.naiveui.com/) —— 每个组件 demo 可在线编辑
- 🐦 [07akioni 推特](https://twitter.com/07akioni) —— 维护者动态

</v-click>

<v-click>

**生态项目**

- [@vicons/](https://www.xicons.org/) —— 图标聚合（Ionicons / Antd / Material / Tabler / Fluent）
- [vfonts](https://www.npmjs.com/package/vfonts) —— 字体包
- [css-render](https://css-render.org/) —— CSS-in-JS 引擎
- [nuxtjs-naive-ui](https://github.com/07akioni/nuxtjs-naive-ui) —— Nuxt 3 集成

</v-click>

<v-click>

**配套技术栈**

- Vue Router 4 + Pinia + Vite + UnoCSS = 黄金组合
- VueUse + axios + ECharts = 实用三件套
- vee-validate / unplugin-vue-router = 进阶选配

</v-click>

<style>
h1 {
  background-color: #18A058;
  background-image: linear-gradient(45deg, #18A058 10%, #4098FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 官方资源是第一手信息 ——

官方文档中英双语，质量极高，所有组件 demo 都能在线编辑测试。
GitHub 仓库的 issue / discussions 区是「问题解答的金矿」——
你的问题 90% 已经有人提过，特别是英文社区资源比中文多。

07akioni 是主要维护者 —— 推特上经常分享 Naive UI 设计细节 + Vue 3 经验。

[click] 生态项目：

@vicons/ 是 07akioni 团队维护的图标聚合方案 ——
覆盖 10+ 主流图标集，每个都做了 SVG 组件化封装，Tree-shaking 友好。

vfonts 是配套字体包 —— Lato 主字体 + Fira Code 代码字体。

css-render 是 Naive UI 底层的 CSS-in-JS 引擎 ——
07akioni 自研，专为 Vue 优化，性能优于 emotion / styled-components。

nuxtjs-naive-ui 是 Nuxt 3 集成模块（社区维护）——
自动处理 SSR / 按需引入 / transpile 等配置。

[click] 配套技术栈：

「Vue Router + Pinia + Vite + UnoCSS」是 2024-2026 年 Vue 3 现代项目的事实标准。
VueUse 提供 200+ 实用 composable，与 Naive UI 完美协作（特别是 useDark）。
axios 配 createDiscreteApi 处理网络错误反馈。
ECharts 是图表事实标准，配合 Naive UI Card / DataTable 做数据看板极佳。

vee-validate 适合「复杂表单」场景（动态字段 / 跨字段联动 / 分步表单）——
Naive UI 内置 rules 适合「简单到中等」表单，
深度场景可以 vee-validate + Naive UI 组件组合使用。

unplugin-vue-router 适合「文件约定路由」场景（类似 Nuxt 自动路由）。
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 🎨

Naive UI — Vue 3 现代设计型组件库

<div class="mt-8 text-lg">

**核心心智**

- NConfigProvider 必须包根，四个 Provider 嵌套是必经之路
- 100% TypeScript，GlobalThemeOverrides 让主题类型安全
- 主题用 JS 对象 + CSS-in-JS，运行时切换无需重新编译
- useMessage / useDialog / useNotification / useLoadingBar 四件套
- createDiscreteApi 解决 setup 外调用 Composable 的问题
- DataTable 默认虚拟滚动，10K+ 行也丝滑
- 中文字体必须覆盖 fontFamily，否则 Lato 字体 fallback

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://www.naiveui.com/" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/tusen-ai/naive-ui" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://www.xicons.org/" target="_blank" class="slidev-icon-btn">
    <carbon:star /> @vicons 图标
  </a>
</div>
