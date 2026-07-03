---
theme: seriph
background: https://cover.sli.dev
title: Ionic 深入浅出
info: |
  基于 Web Components 的框架无关 UI 组件库。

  基于 Ionic 8 · 了解更多 [ionicframework.com](https://ionicframework.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Ionic

基于 **Web Components** 的框架无关 UI 组件库（基于 Ionic 8）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://ionicframework.com/" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天我们讲 Ionic —— 一套基于 Web Components、框架无关的移动优先 UI 组件库。开场先钉死一个最容易混的点：Ionic 是 UI 层，不是运行时。
-->

---
transition: fade-out
---

# 什么是 Ionic

一句话：**基于 Web Components 的框架无关移动优先 UI 组件工具包**

<v-clicks>

- 用 **HTML / CSS / JS** 构建 iOS / Android / PWA / 桌面，一套代码多端跑
- 组件是标准 **Custom Elements**（`ion-*`），不绑定任何框架
- 底层由 **Stencil** 编译器构建，天然框架无关
- 内置 **iOS / Material Design 双 mode** 自适应，仍「看起来原生」
- **MIT 开源**，Ionic 团队维护；当前 **Ionic 8**（`8.8.12`）

</v-clicks>

<!--
Ionic 的定位是 UI 层：负责界面、交互、样式、导航、手势、动画。它把这些能力做成标准 Web Components，所以任何框架甚至纯 JS 都能用。
-->

---
transition: fade-out
---

# Ionic ≠ Capacitor（最高频误区）

**UI 层** 与 **原生运行时** 是两件事——同一团队，职责分离

<div grid="~ cols-2 gap-4">

<div>

**Ionic Framework**（UI 层）

- `ion-*` 组件、主题、导航、手势、动画
- 产出界面 + CSS
- 可脱离 Capacitor 单做 PWA / 网页

</div>

<div>

**Capacitor**（运行时）

- 把 Web App 装进原生壳 + 原生 API 桥
- 相机 / GPS / 文件系统等插件
- 可脱离 Ionic，用于任意 Web 应用

</div>

</div>

<div v-click class="mt-4 text-sm">

访问原生能力（相机 / GPS / 蓝牙）靠 **Capacitor / Cordova**，**不是** Ionic 本身

</div>

<!--
这是出题与面试最高频的靶点：Ionic 只管界面，装进原生壳、调原生 API 的是 Capacitor（或更老的 Cordova）。两者都是 Ionic 团队出品，可组合也可各自独立使用。
-->

---
transition: fade-out
---

# 架构：Web Components + Stencil

Ionic 4+ 起，所有组件都是 **Stencil 编译出的 Web Components**

<v-clicks>

- **Stencil**：Ionic 自研的 Web Components 编译器（TS + JSX + CSS）
- 产出标准 Custom Elements + 极小 runtime，并能生成**框架 wrapper**
- 心智图：**Stencil（编译器）→ `@ionic/core`（组件本体）→ 框架包**
- 多数组件用 **Shadow DOM** 封装样式与 DOM
- 外部普通选择器穿不进去 → 只能靠 **CSS 变量** 或 **Shadow Parts**

</v-clicks>

<!--
理解 Ionic 架构抓一条链：Stencil 是底座编译器，编出 @ionic/core 这套 Web Components，再包一层薄薄的 wrapper 给 Angular/React/Vue。Shadow DOM 是后面讲主题时要记住的前提。
-->

---
transition: fade-out
---

# 组件体系：`ion-*`

模板直接写自定义元素；框架包里是 PascalCase（`IonButton`）

<div grid="~ cols-2 gap-4">

<div>

- **骨架**：`ion-app` `ion-content` `ion-header`
- **导航**：`ion-tabs` `ion-menu` `ion-router-outlet`
- **表单**：`ion-input` `ion-select` `ion-toggle`

</div>

<div>

- **列表**：`ion-list` `ion-item` `ion-item-sliding`
- **展示**：`ion-card` `ion-chip` `ion-accordion`
- **浮层**：`ion-modal` `ion-alert` `ion-toast`

</div>

</div>

<div v-click class="mt-3 text-sm">

浮层两种用法：**内联**（模板 + `isOpen` 控制）或 **控制器 / 函数式**（`useIonAlert()` 等）

</div>

<!--
组件按功能分几大组：骨架、导航、表单、列表、展示、浮层。浮层类记住两种触发方式：写在模板里用 isOpen 控制，或用控制器 / composable 函数式调起。
-->

---
transition: fade-out
---

# iOS / MD 双 mode（自适应样式）

同一 `ion-*` 按平台自动切 iOS 或 Material Design 外观

<v-clicks>

- `mode` 取值 **`'ios'`** 或 **`'md'`**（Material Design）
- **自动规则**：iPhone / iPad → `ios`；Android 及桌面 / 网页 → `md`
- **全局覆盖**：初始化时传 `{ mode: 'ios' }`
- **单组件覆盖**：`<ion-button mode='ios'>`
- 波纹（ripple）等交互也由 mode 驱动，一套代码两端「像原生」

</v-clicks>

<!--
双 mode 是 Ionic 的招牌：不写两套 UI，组件根据平台自己换皮。默认按设备判定，也能全局或单个组件强制指定。注意代码里 mode 用单引号。
-->

---
transition: fade-out
---

# 主题系统：CSS 变量

运行时可改、**无需 Sass**；9 个应用色，每色一整套变量

```css
:root {
  --ion-color-primary: #3880ff;
  --ion-color-primary-rgb: 56, 128, 255;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-shade: #3171e0; /* 更深 */
  --ion-color-primary-tint: #4c8dff; /* 更浅 */
}
```

<v-clicks>

- 9 色：`primary` `secondary` `success` `warning` `danger` `light` `medium` `dark`…
- 每色含 `base / -rgb / -contrast / -shade / -tint`，**改色要成套改**

</v-clicks>

<!--
主题全靠 CSS 变量，运行时就能换肤，不依赖 Sass。关键提醒：每个颜色不是一个值，而是一整套（base、对比色、深浅），改就整套改，否则组件表现会不一致。
-->

---
transition: fade-out
---

# 暗色模式 + Shadow Parts

从 `css/palettes/` 导入 **3 选 1** 暗色调色板

<div grid="~ cols-2 gap-4">

<div>

| palette | 行为 |
| --- | --- |
| `dark.always` | 永远暗色 |
| `dark.system` | **默认推荐**·跟随系统 |
| `dark.class` | 手动切 `.ion-palette-dark` |

</div>

<div>

**Shadow Parts** 定制内部

- 优先用组件暴露的 **CSS 变量**
- 变量不够时用 `::part()` 穿透
- 例：`ion-select::part(icon)`
- 8.8 起暴露了更多 part 与 class

</div>

</div>

<!--
暗色三种预置 palette：always 永远暗、system 跟随系统（官方默认推荐）、class 手动切类。改 Shadow DOM 内部优先用 CSS 变量，不够就用 ::part() 选择器穿透。
-->

---
transition: fade-out
---

# 框架集成 & 版本矩阵

一套 Web Components，四种封装；wrapper 只是薄封装

| 包 | 目标框架 | 说明 |
| --- | --- | --- |
| `@ionic/angular` | Angular 16–20 | Standalone / NgModule 并存 |
| `@ionic/react` | React 17+ | React 19 自 8.5 起完整支持 |
| `@ionic/vue` | Vue 3.0.6+ | 仅 Vue 3，不支持 Vue 2 |
| `@ionic/core` | 无框架 / vanilla | Web Components 本体 + CDN |

<div v-click class="mt-3 text-sm">

各框架包本质是对 `@ionic/core` 的封装，API 与心智一致

</div>

<!--
记住这张表：三大框架各有官方 wrapper，外加不依赖框架的 @ionic/core。版本门槛是 Angular 16+、React 17+（19 从 8.5 起）、Vue 只支持 3。
-->

---
transition: fade-out
---

# 三框架：初始化 + 事件语法

安装 wrapper → 调 setup / provide → 用各框架自己的 router

| 框架 | 初始化入口 | 事件语法 |
| --- | --- | --- |
| Angular | `provideIonicAngular(cfg)` | `(ionChange)` |
| React | `setupIonicReact(cfg)` | `onIonChange` |
| Vue | `.use(IonicVue, cfg)` | `@ionChange` |

```ts
// 零框架：@ionic/core 就是 Web Components 本体
import { defineCustomElements } from '@ionic/core/loader';
defineCustomElements(window);
```

<!--
三框架初始化各有一个入口函数，事件命名沿用各框架惯例：Angular 括号、React onXxx、Vue @。若完全不想用框架，直接引 @ionic/core 也能跑。
-->

---
transition: fade-out
---

# 路由：`ion-router-outlet`

用**各框架自己的 router**，Ionic 只提供承载转场的 outlet

<v-clicks>

- Angular → **Angular Router** + `ion-router-outlet`（非普通 `router-outlet`）
- React → **React Router**（经 `@ionic/react-router` 封装 `IonReactRouter`）
- Vue → **Vue Router** + `ion-router-outlet`
- outlet 负责**页面转场动画 + 生命周期**，不是 Ionic 私有路由
- iOS 侧滑返回、返回按钮等也由 outlet 统一接管

</v-clicks>

<!--
一个常见误解：以为 Ionic 有自己一套路由。其实路由用各框架原生的 router，Ionic 只是把 outlet 换成 ion-router-outlet，接管转场动画和页面生命周期。
-->

---
transition: fade-out
---

# CLI & 生态

`npm i -g @ionic/cli` 后一条命令起项目

```bash
ionic start myApp tabs --type vue # 模板 blank/list/tabs/sidemenu
ionic serve                       # 本地开发 + 热更新
```

<v-clicks>

- 常用：`ionic build` / `ionic generate` / `ionic capacitor add`
- **Ionicons**：官方图标库，随框架附带，配 `ion-icon` 用
- **@ionic/storage**：key-value 存储，自动选 IndexedDB / SQLite
- **Appflow**：移动 CI/CD + Live Updates（官方正逐步停运，注意时效）

</v-clicks>

<!--
CLI 是开发主力，一条 ionic start 带模板起项目，serve 本地热更新，还能对接 Capacitor 加原生平台。生态里图标用 Ionicons，简单存储用 @ionic/storage；Appflow 这个 CI/CD 服务官方在逐步停运，新项目要留意替代方案。
-->

---
layout: center
class: text-center
---

# 选型总结

**要用 Web 技术做跨端 App、又想要接近原生的 UI** → Ionic

框架无关 · iOS/MD 双 mode · CSS 变量主题 · 配 Capacitor 上原生

<div class="mt-8 text-sm opacity-75">

[官方文档](https://ionicframework.com/docs) · [Stencil](https://stenciljs.com/) · [Capacitor](https://capacitorjs.com/)

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://ionicframework.com/" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
一句话选型：如果你想用熟悉的 Web 技术做跨端 App，还要接近原生的 UI 观感，Ionic 加 Capacitor 是很成熟的组合。谢谢大家！
-->
