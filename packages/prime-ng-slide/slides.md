---
theme: seriph
background: https://cover.sli.dev
title: Welcome to PrimeNG
info: |
  Presentation PrimeNG 20 for Angular developers.

  Learn more at [https://primeng.org/](https://primeng.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎨</span>
</div>

<br/>

## PrimeNG — Most Complete UI Component Library for Angular

80+ 组件 / 4 主题预设 / Styled + Unstyled 双模式 —— PrimeTek 出品，Prime 系列 Angular 旗舰，当前主线 v20+

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 PrimeNG —— PrimeTek 出品的 Angular 全功能 UI 组件库，
由土耳其团队 PrimeTek 主导设计与开发，Prime 系列（PrimeFaces / PrimeNG / PrimeReact / PrimeVue）的 Angular 版本。

2016 年立项，至今十年迭代，是国外 Angular 生态组件最丰富的 UI 库。
当前主线 v20+（与 Angular 20 同步），v21 即将到来。

核心卖点：
- 80+ 高质量 Angular 组件，国外 Angular UI 库中组件数最多
- 4 个内置主题预设（Aura / Material / Lara / Nora），与 PrimeVue 4 共享 @primeuix/themes
- Styled + Unstyled 双模式：开箱即用 vs Tailwind 接管
- PassThrough (pt) API 深度自定义组件内部 DOM
- 设计 token 三层架构（Primitive / Semantic / Component）
- Standalone Components 默认 + Zoneless / OnPush 友好
- providePrimeNG + provideAnimationsAsync 现代 functional providers
- WCAG 2.1 AA 无障碍合规，100% TypeScript

PrimeNG 在国外 Angular 生态拥有「组件最全 + 设计 token 现代化」标签，
特别适合中后台 / 仪表板 / 复杂数据应用 / 跨框架团队（已用 PrimeReact / PrimeVue）。

下面会按「定位 → 演进 → 安装 → 第一个组件 → 80+ 组件矩阵 → Form → Table → 4 主题 → Design Token → PassThrough → 服务 → 国际化 → SSR → 踩坑」展开。
-->

---
transition: fade-out
---

# 什么是 PrimeNG？

为 Angular 应用提供「组件最全 + 主题最多 + 定制最深」的企业级 UI 库

<v-click>

- **80+ 组件**：Form / Button / Data / Panel / Overlay / Menu / Chart / Messages / File 等 11 大分组
- **4 个主题预设**：Aura（默认）/ Material（Google）/ Lara（Bootstrap 风）/ Nora（企业风），与 PrimeVue 4 共享
- **Styled + Unstyled 双模式**：开箱即用，或剥离样式用 Tailwind / SCSS 重写
- **PassThrough API**：通过 pt 属性直达组件每一层内部 DOM
- **设计 token 三层架构**：Primitive → Semantic → Component 三层级联
- **CSS 变量驱动**：v17 重构后完全 CSS 变量（v16 前是 SCSS）
- **Standalone 默认** + **Zoneless 友好**：providePrimeNG + provideAnimationsAsync
- **WCAG 2.1 AA 合规**：每个组件文档都有无障碍章节

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_PrimeNG Introduction_](https://primeng.org/installation)

</div>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeNG 是 Angular 生态最早起步的 UI 组件库之一（2016 年立项），
其定位与 PrimeVue 在 Vue 生态完全一致：「组件最全、主题最多、商业生态最成熟」。

- 80+ 组件覆盖国外 Angular 企业项目几乎所有场景
- 4 个主题预设让你不写一行 SCSS / 不写主题代码就能切换设计语言
- Styled + Unstyled 双模式是 v17 重构的杀手锏：既能开箱即用，也能完全用 Tailwind 重写
- PassThrough（pt）API 让你直达组件内部 DOM
- 设计 token 三层架构与 PrimeVue 4 共享 @primeuix/themes
- v17+ 拥抱 Standalone Components 默认，与 Zoneless / OnPush 友好

下面会按「定位 → 安装 → 第一个组件 → 主题深度 → Table → Forms → Pt → Message/Confirm/Dialog → SSR → 对比」展开。
-->

---
transition: fade-out
---

# 定位与生态对比

Angular 生态四大 UI 库横向对比

<v-click>

| 维度       | PrimeNG          | Angular Material | NG-ZORRO         |
| ---------- | ---------------- | ---------------- | ---------------- |
| 设计语言   | **4 主题预设**   | Material 3       | Ant Design       |
| 主导团队   | **PrimeTek**     | Google 官方      | 阿里 NG-ZORRO    |
| 组件数量   | **80+**          | 60+              | 70+              |
| 主题方案   | **CSS Variables**| Material Tokens  | Less / CSS vars  |
| 定制深度   | **pt + Unstyled**| themeOverrides   | NzConfigService  |
| 国外 / 国内 | ★★★★★ / ★★      | ★★★★ / ★★★      | ★★ / ★★★★★      |

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比 Angular 主流 UI 库，PrimeNG 的护城河是「组件全 + 主题多 + 定制深 + 国外人气最高」：

- 80+ 组件，国外 Angular UI 库中数量第一
- 4 个内置主题预设 = 不写一行 SCSS 就能切换 4 套设计语言
- Styled + Unstyled 双模式 + pt API = 定制深度无人能及
- Tailwind 官方插件 tailwindcss-primeui = 现代项目无痛融合

对比 Angular Material：
- PrimeNG 不绑定 Material Design（多 preset 自由）
- Material 走 Google Material 3 + design tokens
- 中后台 / SaaS 项目 PrimeNG 组件更丰富（DataView / OrderList / Galleria 等冷门组件）
- Material 优势是 Google 官方背书 + Material Design 严格一致

对比 NG-ZORRO：
- PrimeNG 国外人气压倒性领先（Reddit / Stack Overflow 答案多）
- NG-ZORRO 中国生态压倒性领先（阿里背书 + 中文文档）
- 两者组件数相近（80 vs 70）
- 设计语言完全不同：PrimeNG 多 preset / NG-ZORRO 强制 Ant Design

对比 PrimeFaces：
- PrimeFaces 是 JSF（Java 后端）老牌组件库
- PrimeNG 是「PrimeFaces 的 Angular 现代版」
- 设计血脉相通，但 PrimeNG 是纯前端架构

选型逻辑：
- 国际化项目 / 国外团队 / 多 preset → 选 PrimeNG
- 中国 B 端 / Ant Design 风格 → 选 NG-ZORRO
- Google Material 3 严格风格 → 选 Angular Material
- 跨框架团队（已用 PrimeReact / PrimeVue）→ PrimeNG 最自然
-->

---
transition: fade-out
---

# 演进史

从 PrimeFaces 到 v20 的十年

<v-click>

| 时间       | 关键事件                                                        |
| ---------- | --------------------------------------------------------------- |
| 2008       | PrimeTek 成立，发布 PrimeFaces（JSF）                            |
| 2016       | **PrimeNG 立项**（Angular 2 时代），早期对标 PrimeFaces 设计语言 |
| 2019       | PrimeNG 8.x，主版本号开始与 Angular 同步                         |
| 2023       | **PrimeNG v17 重构**：CSS 变量 + 4 Preset + pt API + Standalone  |
| 2024       | PrimeNG v18，Zoneless 兼容                                       |
| 2025       | **PrimeNG v20 当前主线**，与 Angular 20 同步发布                 |

</v-click>

<v-click>

> 💡 **冷知识**：PrimeTek 是土耳其 Çağatay Çivici 创立的开源公司，旗下 Prime 系列覆盖 JSF / jQuery / Angular / React / Vue 五大框架，是「跨框架组件库」的代表企业。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeNG 的故事是 Prime 系列跨框架战略中的「Angular 分支」。

PrimeTek 是土耳其的开源公司，Çağatay Çivici 在 2008 年创立。
从 PrimeFaces（JSF 时代企业 Java 主流）开始，逐步扩展到：
- PrimeUI（jQuery，已停止维护）
- **PrimeNG（Angular，2016）**
- PrimeReact（React）
- PrimeVue（Vue，最新）

「跨框架同一套设计语言」是 Prime 系列的核心战略 ——
同样的组件名、同样的 prop、同样的主题预设，在五个框架里都能用。
对 PrimeTek 来说，这是「一份设计、五份代码」的复用红利。

PrimeNG 8.x（2019）开始与 Angular 主版本号同步：
- v8 对应 Angular 8 / v9 对应 Angular 9 / ... / v20 对应 Angular 20
- 与 NG-ZORRO 一致的版本策略，方便选版

PrimeNG v17 重构（2023）是历史上最重要的版本，主要变化：
- 完全脱离 SCSS，全部用 CSS 变量（v16 前是 SCSS 编译）
- 引入设计 token 三层架构（Primitive / Semantic / Component）
- 4 个主题预设取代「一个 theme.css 文件」模式
- pt（PassThrough）API 全面 v2，所有组件支持
- @primeuix/themes 包独立，主题切换更灵活
- 与 Tailwind 集成升级到 tailwindcss-primeui
- 一系列组件改名：Calendar → DatePicker / Dropdown → Select / Sidebar → Drawer
- 全面 Standalone Components，废弃 NgModule.forRoot
- providePrimeNG functional provider 替代 BrowserAnimationsModule.forRoot

PrimeNG v18（2024）：Zoneless 实验兼容 + Angular Signals 支持
PrimeNG v20（2025）：当前主线，与 Angular 20 同步发布

PrimeNG 在 GitHub 10K+ star，国外 Reddit / Stack Overflow 资源极丰富 ——
但中文社区与 NG-ZORRO 还有数量级差距。
企业选型：国际化项目 / 国外团队 / 跨框架项目 → 选 PrimeNG 稳妥。
-->

---
transition: fade-out
---

# PrimeNG 的核心理念

四条设计原则贯穿全部组件 API

<v-click>

**1. 完整性（Completeness）**

80+ 组件覆盖企业后台 / 仪表板 / 电商 / CRM 全场景 —— 不用拼接第三方库。

</v-click>

<v-click>

**2. 主题预设（Theme Presets）**

4 个开箱即用的主题（Aura / Material / Lara / Nora）—— 切换设计语言只改一行配置。

</v-click>

<v-click>

**3. 双模式（Styled / Unstyled）**

Styled 模式开箱即用，Unstyled 模式让 Tailwind / SCSS 完全接管样式 —— 一个组件库满足两种偏好。

</v-click>

<v-click>

**4. 深度可定制（Deep Customization）**

pt（PassThrough）API 让你直达每个组件的每一层内部 DOM —— 「组件库 prop 不够用」永远不存在。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 完整性是 PrimeNG 在 Angular UI 库中的最大杀手锏 ——
80+ 组件包含很多其他 UI 库没有的「冷门但实用」组件：

- 表单：FloatLabel、IftaLabel、IconField、InputOtp、Stepper
- 数据：TreeTable、PickList、OrderList、Timeline
- 上传：FileUpload（chunked + progress + dragdrop）
- 编辑器：Editor（基于 Quill）
- 媒体：Galleria、Image（zoom + preview）
- 图表：Chart.js 集成（10+ 图表类型）

这些组件在 Angular Material / NG-ZORRO 都需要自己造或用第三方库 ——
PrimeNG 一站式提供，企业开发节省巨量时间。

[click] 主题预设是 PrimeNG v17 的核心创新 ——
4 个内置主题覆盖最常见的设计语言诉求：

- Aura：PrimeTek 自家设计，现代简约
- Material：Google Material Design v2 风格
- Lara：Bootstrap 启发，传统企业风
- Nora：Enterprise 应用美学，简洁高端

每个 preset 都是「完整设计 token 集合」—— 颜色 / 间距 / 圆角 / 阴影 / 动画全套。
切换 preset = 改 `theme.preset` 配置一行代码，整个应用换皮肤。

[click] Styled / Unstyled 双模式是 v17 的另一项突破 ——

Styled 模式（默认）：
- 引入完整 CSS 变量样式
- 4 个 preset 自由切换
- 适合「快速搭建后台」「不想花心思设计」

Unstyled 模式：
- 设 `unstyled: true` 关闭所有内置样式
- 用 pt + Tailwind / SCSS 完全接管
- 适合「严格设计规范」「品牌一致性要求高」

同一个组件库满足两种工作流，这是 PrimeNG 与 Angular Material / NG-ZORRO 最大的差异。

[click] PassThrough API 让定制深度直达 DOM ——

每个 PrimeNG 组件都暴露内部 DOM 结构（root / header / body / content / icon ...），
你可以通过 pt 属性给任意层级加 class / style / 事件。

例子：p-table 的某一列单元格加 hover 高亮 —— pt 直接加 onMouseenter。
DatePicker 弹出层加自定义边框 —— pt 直接改 panel 的 class。

「组件库 prop 不够用」这个痛点，PrimeNG 用 pt 彻底解决。
-->

---
transition: fade-out
layout: two-cols-header
layoutClass: gap-x-8
---

# 安装与初始化

3 分钟接入 Angular 项目

::left::

<v-click>

**安装**

```bash
ng add primeng
# 或手动
pnpm add primeng @primeuix/themes primeicons
```

| 版本   | Angular 兼容 | 状态         |
| ------ | ------------ | ------------ |
| v20.x  | Angular 20   | **当前主线** |
| v18.x  | Angular 18   | 维护中       |
| v17.x  | Angular 17   | 维护中       |
| v16 前 | Angular 16-  | SCSS 时代    |

</v-click>

::right::

<v-click>

**入口注册（app.config.ts）**

```ts
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from
  '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: { preset: Aura,
        options: { darkModeSelector: '.my-app-dark' } },
    }),
  ],
};
```

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeNG 安装两个核心包：
- `primeng` 主体组件库
- `@primeuix/themes` 主题包（4 preset + definePreset 工具，与 PrimeVue 4 共享）

primeicons 是配套图标包（基于 SVG webfont），不是必须 —— 但很多 PrimeNG 组件默认用 pi 系列图标（pi pi-check / pi pi-times），装上节省「自己找图标库」时间。

v20.x 是当前主线，与 Angular 20 同步发布。
v18.x 引入 Zoneless 兼容。
v17.x 是首个 CSS 变量 + Standalone-first 重构版本。
v16 及之前是 SCSS 时代，已不推荐新项目使用。

[click] PrimeNG v17+ 的入口配置完全拥抱「functional providers」——
不再用老的 BrowserAnimationsModule.forRoot()、NgModule.forRoot(config) 风格，
全部改为 provideXxx() 平铺式注入。

provideAnimationsAsync()：
- 异步加载 Angular Animations
- 必须在 providePrimeNG 之前
- Zoneless 模式必选（async 版本不依赖 Zone.js）
- 老 provideAnimations() 同步版本仍可用但不推荐

providePrimeNG(config)：
- 主入口配置
- 接收 theme / ripple / inputStyle / csp / filterMode / translation 等

theme.preset 接收 4 个内置预设之一：
- Aura（默认推荐）：PrimeTek 自家现代设计
- Material：Google Material 风
- Lara：Bootstrap 风
- Nora：企业应用美学

theme.options 配置三个关键参数：
- prefix: 'p' —— CSS 变量前缀（生成 --p-primary-500 等）
- darkModeSelector: 'system' / '.my-app-dark' / false —— 暗色模式触发器
- cssLayer: false / true / 自定义 layer 名 —— CSS layer 隔离

后面会展开讲 cssLayer 在「与 Tailwind 共存」场景的重要性。

PrimeNG 20 的入口是「平铺式」+ Standalone 风格，与 Angular 现代实践完全对齐。
-->

---
transition: fade-out
---

# 第一个组件：p-button

Standalone 默认 + severity / size / variant 三档

<v-click>

```ts
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-demo',
  imports: [ButtonModule, InputTextModule],
  template: `
    <p-button label="提交" [loading]="loading" (onClick)="submit()" />
    <p-button label="成功" severity="success" />
    <p-button label="危险" severity="danger" [outlined]="true" />
    <p-button icon="pi pi-plus" [rounded]="true" />

    <input pInputText [(ngModel)]="name" placeholder="姓名" />
  `,
})
export class DemoComponent { loading = false; submit() {} }
```

</v-click>

<v-click>

> 💡 **API 双轨**：p-button 是 Component 写法；pInputText 是指令写法（增强原生 input）—— PrimeNG 长期保留两种风格。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeNG Button 是「最简单的组件」—— 一个 p-button 就能展示 PrimeNG 的 API 哲学。

注意几个 PrimeNG 特色：
- 组件用 p- 前缀（&lt;p-button&gt;）—— 与 Angular Material 的 mat- 前缀 / NG-ZORRO 的 nz- 前缀风格一致
- `severity` 取代「type」—— 更符合 ARIA 语义（severity = 严重程度）
- 八个 severity 值：primary / secondary / success / info / warn / help / danger / contrast
- contrast 是 v17 新增：在背景色基础上「反相对比」—— 暗色背景白底，浅色背景黑底
- help 也是少见：紫色系，介于 info 和 secondary 之间

icon 用 `pi pi-plus` 是 primeicons 的 class 写法（webfont 风格）——
也可以用 `<i class="pi pi-plus" />` 内嵌图标，pt 加 SVG，或换 lucide-angular 等第三方。

[click] severity 八值的设计意图：

- primary：主操作（提交、保存）
- secondary：次操作（取消、返回）
- success：积极反馈（已完成、成功）
- info：中性信息
- warn：警示（注意事项）
- help：辅助（帮助、引导）—— 紫色，区别 info
- danger：危险（删除、解绑）
- contrast：反相高亮（与背景反差）—— v17 新增，用于强调

这套 severity 体系 Tag、Message、Toast 等组件全部共享，记忆负担小。

variant 是 v17 新增 prop —— 替代 v16 前 outlined / text prop 写法：
- variant="outlined" 边框透明背景
- variant="text" 无边框无背景（类似文字按钮）
- variant="link" 像链接一样（带下划线悬停）

形态变体（raised / rounded / outlined / text / plain）可以组合，
理论上几十种组合覆盖所有 UI 场景。

[click] API 双轨是 PrimeNG 的历史特色 ——
- 强结构组件（p-button / p-table / p-dialog）用 Component
- 增强原生元素（pInputText / pTooltip / pRipple）用 Directive

这与 NG-ZORRO 的「button nz-button 指令式」、Angular Material 的「mat-button 属性指令」都不同 ——
PrimeNG 选择「最贴合组件本质」的写法：能独立成组件就用 Component，能增强原生就用 Directive。

新手可能困惑「为什么 Button 是 p-button，Input 却是 pInputText」——
答案是 Button 没有「原生 button」可增强（需要完整封装），
Input 完全可以增强原生 input（保留 type / disabled / autocomplete 等原生属性）。
-->

---
transition: fade-out
---

# 80+ 组件分组速览

按使用场景组织，11 大分组覆盖企业应用全场景

<v-click>

| 分组                  | 代表组件                                                              |
| --------------------- | --------------------------------------------------------------------- |
| **Form**              | InputText / Select / DatePicker / Checkbox / FileUpload / InputOtp 等 |
| **Data**              | **Table** / DataView / Tree / TreeTable / Timeline / PickList         |
| **Panel**             | Panel / Accordion / Card / Splitter / Tabs / Stepper                  |
| **Overlay**           | Dialog / Drawer / Popover / ConfirmDialog / DynamicDialog             |
| **Menu / Messages**   | Menubar / Breadcrumb / Toast / Message / InlineMessage                |
| **Media / Misc**      | Carousel / Galleria / Chart / Avatar / Badge / Tag / Skeleton         |

</v-click>

<v-click text-xs class="mt-2">

> 💡 **设计原则**：高频组件（Button / InputText / Table）API 极简；低频组件（Tree / PickList / Editor）功能完整。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 80+ 组件听起来多，但按 11 大分组记忆很容易上手。

Button 类：单按钮、按钮组、悬浮按钮（SpeedDial 类似 FAB）

Form 类（最大分组）：
- 文本输入：InputText、Textarea、Password、InputOtp（验证码输入）、InputMask（掩码）、InputNumber
- 选择类：Select（v16 前叫 Dropdown）、MultiSelect、Listbox、SelectButton、TreeSelect
- 日期类：DatePicker（v16 前叫 Calendar）
- 切换类：Checkbox、RadioButton、ToggleSwitch（v16 前叫 InputSwitch）、ToggleButton
- 高级：Slider、Rating、ColorPicker、AutoComplete、CascadeSelect、Knob
- 上传：FileUpload（chunked + multi-part + drag）
- 表单容器：FloatLabel、IftaLabel、IconField、Fluid

Data 类：
- Table：最重磅（虚拟滚动、行编辑、分组、lazy load、行展开）
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
- Drawer：侧边抽屉（v16 前叫 Sidebar）
- Popover（v16 前叫 OverlayPanel）：轻量浮层
- ConfirmDialog / ConfirmPopup：确认弹窗
- Tooltip / DynamicDialog

File 类：FileUpload 独立分组（功能极强）

Menu 类：6 种菜单（Menu / Menubar / TieredMenu / ContextMenu / Breadcrumb / Steps / Dock）

Chart：基于 Chart.js 的图表集成

Messages：Toast / Message / InlineMessage 三档反馈

Media：Carousel / Galleria / Image（zoom + preview）

Misc：Avatar / Badge / Chip / Tag / Skeleton / Terminal 等小工具

[click] PrimeNG 的「冷门但实用」组件特别多：
- SpeedDial（悬浮 FAB）
- OrderList / PickList（穿梭框）
- TreeTable（树 + 表格）
- Knob（旋钮）
- InputOtp（OTP 验证码）
- Galleria（画廊）
- Editor（富文本，基于 Quill）
- Terminal（命令行模拟）

这些在 Angular Material / NG-ZORRO 都没有，要自己造。
-->

---
transition: fade-out
---

# Form + Reactive Forms 完整方案

与 Angular Reactive Forms / Template Forms 完美集成

<v-click>

```ts
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule,
    PasswordModule, MessageModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input pInputText formControlName="username" placeholder="用户名" />
      @if (form.controls.username.invalid && form.controls.username.touched) {
        <p-message severity="error" text="请输入用户名" />
      }
      <p-password formControlName="password" [feedback]="true" />
      <p-button label="登录" type="submit" [disabled]="form.invalid" />
    </form>
  `,
})
export class LoginComponent {
  form = inject(FormBuilder).group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  onSubmit() { console.log(this.form.value); }
}
```

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeNG 表单组件与 Angular Reactive Forms / Template Forms 完美集成 ——
所有 Form 组件都实现 ControlValueAccessor，可直接用 formControlName / [(ngModel)]。

通用模式：
- input pInputText formControlName="username"：增强原生 input
- p-password formControlName="password"：Component 形式
- 错误显示：@if 控制流 + form.controls.x.invalid + p-message

vs NG-ZORRO 的 nz-form-item：
- NG-ZORRO 提供 nz-form-item / nz-form-control / nzErrorTip 配套组件
- PrimeNG 不强制结构，让你自由组合 input + message
- PrimeNG 更接近「原生 HTML form」，定制更灵活
- NG-ZORRO 更接近 antd 风格，开箱即用更快

vs Angular Material 的 mat-form-field：
- Material 强制 mat-form-field 容器（包裹 input + label + error）
- PrimeNG 让你自由组合（不强制容器）
- 各有取舍：Material 更一致，PrimeNG 更灵活

Reactive Forms 关键点：
- FormBuilder + FormGroup + FormControl
- formControlName 绑定（不是 ngModel）
- 内置 Validators.required / minLength / pattern / email
- form.value 取整个表单值
- form.controls.x.invalid / dirty / touched 状态

v17+ 控制流 @if / @for / @switch：
- 替代老的 *ngIf / *ngFor 结构指令
- 性能更好（编译期优化）
- 语法更直观（类似 Vue / React）
- PrimeNG 文档 demo 全面切换 @if / @for

实战经验：
- 复杂表单一律用 Reactive Forms（不要混 Template Forms）
- 错误显示：组件挂 invalid 状态 + p-message 显示文字
- 联动校验：FormGroup.setValidators + valueChanges
- 动态表单：FormArray + @for 渲染
-->

---
transition: fade-out
---

# Form 深度：InputText / Select / MultiSelect

文本输入 + 下拉选择三件套

<v-click>

```html
<!-- 基础文本输入：指令式增强原生 input -->
<input pInputText [(ngModel)]="name" placeholder="请输入姓名" />
<input pInputText [(ngModel)]="name" pSize="large" variant="filled" />

<!-- 下拉单选（v16 前叫 p-dropdown），支持 filter / virtualScroll -->
<p-select [(ngModel)]="city" [options]="cities" optionLabel="name"
  placeholder="选择城市" [filter]="true" />

<!-- 多选 chip 显示 -->
<p-multiselect [(ngModel)]="tags" [options]="tagOptions"
  optionLabel="label" [filter]="true" placeholder="选择标签" />

<!-- Textarea 增强：[autoResize] 自动撑高 -->
<textarea pInputTextarea [(ngModel)]="desc" rows="5"
  [autoResize]="true"></textarea>
```

</v-click>

<v-click>

> 💡 **v17 改名**：Calendar → DatePicker / Dropdown → Select / InputSwitch → ToggleSwitch / Sidebar → Drawer / OverlayPanel → Popover

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeNG 的 Form 组件 API 设计非常规整 ——
所有组件都遵循同样的 prop 模式：

通用 props（所有 Form 组件共享）：
- [(ngModel)]：双向绑定
- pSize: 'small' / 'large'（默认中等）
- variant: 'outlined'（默认）/ 'filled'
- invalid: boolean 表示错误状态（红色边框）
- disabled / readonly / placeholder

这种「规整」让记忆负担很小 —— 记住一个组件的 prop，其他组件几乎一样。

pInputText 是最基础的文本输入（指令式增强原生 input）：
- 直接绑值用 [(ngModel)]
- pSize 三档
- variant 两种：outlined（边框）/ filled（背景色填充）
- 配合 ReactiveForms 自动错误状态

p-select（v16 前叫 p-dropdown）：
- [options] 数组（每项可以是 object）
- optionLabel="name" 告诉 PrimeNG 显示哪个字段
- [(ngModel)] 默认返回整个 object（也可以 optionValue="code" 只返 code）
- 支持 [filter] / [virtualScrollerOptions] / [loading] 等高级特性

p-multiselect：
- 多选下拉，UI 与 p-select 类似但显示 chip
- [(ngModel)] 是数组类型
- 支持 [selectAll] / [showToggleAll] 等

p-inputtextarea / textarea pInputTextarea：
- 比 native textarea 多了 [autoResize]（自动撑高）

[click] v17 改名是必须记的「迁移坑」：
- Calendar → DatePicker（更清晰）
- Dropdown → Select（与 HTML &lt;select&gt; 对齐）
- InputSwitch → ToggleSwitch（更精确）
- Sidebar → Drawer（与 Material / Ant 等对齐）
- OverlayPanel → Popover（与 Tailwind / shadcn 对齐）
- TabView → Tabs / TabPanel → Tab

从 v16 升级 v17 必须改 import 和模板，这部分是 Migration Guide 的重头戏。
新项目直接用 v17+ 名字，不要踩 v16 旧名的坑。
-->

---
transition: fade-out
---

# Form 深度：DatePicker / Checkbox / FileUpload

日期 / 切换 / 文件上传 / OTP 验证码

<v-click>

```html
<!-- 日期：6 种模式 single/multiple/range + date/month/year + time -->
<p-datepicker [(ngModel)]="date" [showTime]="true" hourFormat="24" />
<p-datepicker [(ngModel)]="range" selectionMode="range"
  [numberOfMonths]="2" />
<p-datepicker [(ngModel)]="date" view="month" dateFormat="mm/yy" />

<!-- 单 checkbox 用 [binary]=true 绑布尔；不传 binary 是 group 模式绑数组 -->
<p-checkbox [(ngModel)]="agree" [binary]="true" inputId="agree" />
<p-toggleswitch [(ngModel)]="dark" />

<!-- FileUpload 完整 UI：拖拽 + 进度 + 预览 + chunked 上传 -->
<p-fileupload name="files[]" url="/api/upload" [multiple]="true"
  accept="image/*" [maxFileSize]="1000000"
  (onUpload)="onUpload($event)" />

<!-- v17 新增 OTP 验证码：自动 focus 下一位 + 智能粘贴分配 -->
<p-inputotp [(ngModel)]="otp" [length]="6" />
```

</v-click>

<v-click>

> 💡 **企业刚需**：DatePicker 6 种模式 / FileUpload chunked + customUpload / InputOtp 智能粘贴 —— PrimeNG 一站式覆盖。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] DatePicker 是 PrimeNG Form 组件里最复杂、也最强大的之一。

selectionMode：
- 'single'（默认）：选单一日期
- 'multiple'：选多个日期（不连续）
- 'range'：选起止日期（区间）

view：
- 'date'（默认）：年月日完整选择
- 'month'：只选月
- 'year'：只选年

[showTime]：显示时间选择（小时 / 分钟 / 秒）
hourFormat：'12' 或 '24'
[numberOfMonths]：同时显示几个月（区间选择常用 2）

dateFormat：日期格式（'dd/mm/yy'、'mm-dd-yyyy' 等）
[minDate] / [maxDate]：限制可选范围
[disabledDates] / [disabledDays]：禁用特定日期 / 星期

自带 locale：通过 providePrimeNG translation 配置切换月份星期文字。

FileUpload 是 PrimeNG 最强大的组件之一：

基础功能：
- [multiple]：多文件
- accept：MIME 限制（'image/*'、'.pdf' 等）
- [maxFileSize]：单文件大小限制（字节）

高级功能：
- mode="basic"：简化模式（只是个 input file）
- mode="advanced"（默认）：完整 UI（拖拽 + 进度 + 预览）
- (onUpload) (onProgress) (onError) (onSelect) (onClear) (onRemove) 事件全套
- [customUpload]=true + (uploadHandler)：自定义上传逻辑（不用默认 XHR）
- [chunkSize]：分片上传支持

URL 模式：
- url prop：上传到指定 URL（默认 POST + multipart/form-data）
- 不传 url + customUpload：自己处理（比如 AWS S3、阿里 OSS 直传）

p-inputotp 是 v17 新增 —— 单独的 OTP 验证码输入：
- [length]="6" 表示 6 位
- [(ngModel)] 返回拼接的字符串
- 自动 focus 下一位、删除回退
- 支持 [mask]（密码遮挡）
- 接收复制粘贴整个 OTP（智能分配到各位）

p-checkbox 注意：
- [binary]="true" 是「单 checkbox 模式」（绑布尔值）
- 不传 binary 是「checkbox group 模式」（绑数组）

p-toggleswitch（v16 前叫 p-inputswitch）：
- 比 checkbox 更直观的开关
- 移动端 / 设置页常用

这些在 Angular 项目高频用到，PrimeNG 一站式提供大幅节省时间。
-->

---
transition: fade-out
---

# Table 重磅深度（一）：基础

PrimeNG 最强大的组件，企业级数据表格

<v-click>

```html
<p-table [value]="products" dataKey="id" [(selection)]="selected"
  selectionMode="multiple" [paginator]="true" [rows]="10"
  [stripedRows]="true" [showGridlines]="true">
  <ng-template pTemplate="header">
    <tr>
      <th><p-tableHeaderCheckbox /></th>
      <th pSortableColumn="code">编号 <p-sortIcon field="code" /></th>
      <th pSortableColumn="name">名称 <p-sortIcon field="name" /></th>
      <th>状态</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-row>
    <tr>
      <td><p-tableCheckbox [value]="row" /></td>
      <td>{{ row.code }}</td>
      <td>{{ row.name }}</td>
      <td><p-tag [value]="row.status" severity="success" /></td>
    </tr>
  </ng-template>
</p-table>
```

</v-click>

<v-click text-xs>

> 💡 ng-template pTemplate 模板槽 —— 与 NG-ZORRO / Material 风格不同，灵活度最高。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Table 是 PrimeNG 最强大的组件 —— 也是与 NG-ZORRO NzTable / Angular Material Table 差异最大的组件。

声明方式：基于 ng-template 模板槽（pTemplate="header" / "body" / "footer" 等）——
与 NG-ZORRO 的「原生 table 增强」、Material Table 的「mat-cell 指令」都不同。

ng-template 模板槽的优势：
- 灵活性极高（每个区域都是独立模板）
- 与 Angular 模板系统深度集成
- 可以自定义 emptymessage / paginatorleft / paginatorright 等任意区域

劣势（vs NG-ZORRO 的原生 table 风格）：
- 学习曲线稍陡（需要理解 pTemplate）
- 模板嵌套深（4-5 层 ng-template）

核心 props：
- [value]：数据数组（必须）
- dataKey：行的唯一标识字段（多选 / 行编辑 / 行展开必须）
- selectionMode："single" / "multiple"（开启选择列）
- [(selection)]：选中的行（数组或单值）
- [tableStyle] / [size]：表格尺寸
- [stripedRows] / [showGridlines]：斑马纹 / 网格线
- [paginator] + [rows]：内置分页（不需要外接 Paginator）

列内置指令：
- pSortableColumn="field" + p-sortIcon：可排序列
- pSortableColumnDisabled：禁用特定列排序
- pTableCheckbox：行复选
- pTableHeaderCheckbox：全选

排序 / 分页都内置 —— 比 Angular Material 配套更完整。

Table 与 NG-ZORRO NzTable 的取舍：
- Table：ng-template 模板槽，灵活度极高
- NzTable：原生 table 增强，直观但灵活度略低
- Material Table：mat- 指令式，符合 Material 风格
- 各有适用场景，看团队偏好。
-->

---
transition: fade-out
---

# Table 重磅深度（二）：虚拟滚动 + Lazy Load

10W+ 行数据丝滑滚动 / 服务端分页

<v-click>

**虚拟滚动（前端 10W+ 行）** —— 每行高度固定，DOM 只渲染可视区

```html
<p-table [value]="hugeData" [scrollable]="true" scrollHeight="400px"
  [virtualScroll]="true" [virtualScrollItemSize]="46">
  <ng-template pTemplate="body" let-row>
    <tr style="height:46px"><td>{{ row.id }}</td></tr>
  </ng-template>
</p-table>
```

</v-click>

<v-click>

**Lazy Load（服务端分页 + 排序 + 过滤）**

```ts
onLazyLoad(event: TableLazyLoadEvent) {
  // event: { first, rows, sortField, sortOrder, filters }
  this.api.query(event).subscribe(res => {
    this.products = res.items; this.totalRecords = res.total;
  });
}
```

```html
<p-table [value]="products" [lazy]="true" [totalRecords]="totalRecords"
  [paginator]="true" [rows]="10" (onLazyLoad)="onLazyLoad($event)" />
```

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 虚拟滚动是 PrimeNG Table 的杀手锏 ——

启用方式：
- [scrollable]="true" 开启滚动模式
- scrollHeight="400px" 限制容器高度（启用滚动）
- [virtualScroll]="true" 启用虚拟滚动
- [virtualScrollItemSize]="46" 必传 itemSize（行高，px）

工作原理：
- DOM 只渲染当前可视区域 + 上下缓冲区的行（通常 20-30 行）
- 滚动时复用 DOM 节点，更新内容
- 性能：10W+ 行也是 60fps 流畅

适用场景：
- 日志查看（百万条记录）
- 实时数据流（IoT / 监控）
- 大量历史订单（不分页一次性看）

注意：virtualScroller 要求每行高度固定，
不支持动态高度（这是虚拟列表的通用限制）。

[click] Lazy Load 是服务端分页 —— 与虚拟滚动是不同的概念！

- 虚拟滚动：数据全在前端，只渲染可视区域
- Lazy Load：每次只请求一页数据，分页器切换时再请求

启用方式：
- [lazy]="true" 表示「服务端模式」（Table 不再前端切片）
- [totalRecords]：告诉分页器总条数
- [loading]：控制加载状态（自动遮罩 + 转圈）
- (onLazyLoad)：事件触发请求

TableLazyLoadEvent 参数对象：
- first: 当前页第一条的 index
- rows: 每页条数
- sortField / sortOrder: 排序字段 / 方向
- filters: 过滤条件
- globalFilter: 全局过滤

实际项目中，「大数据 + 服务端」用 lazy + paginator，
「大数据 + 前端」用 virtualScroll，
「中等数据」直接 paginator 不开 lazy。

Table 还支持「行内编辑」「行展开」「行重排」「列重排」「列冻结」「行分组」等高级功能 ——
这些功能完整度在 Angular UI 库中无人能及。
-->

---
transition: fade-out
---

# Table 高级：行编辑 + 列冻结

企业级表格的「最后一公里」

<v-click>

**行内编辑** —— editMode="row" + p-cellEditor 模板槽

```html
<p-table [value]="products" dataKey="id" editMode="row">
  <ng-template pTemplate="body" let-row let-editing="editing">
    <tr [pEditableRow]="row">
      <td>
        <p-cellEditor>
          <ng-template pTemplate="input">
            <input pInputText [(ngModel)]="row.name" />
          </ng-template>
          <ng-template pTemplate="output">{{ row.name }}</ng-template>
        </p-cellEditor>
      </td>
      <td>
        @if (!editing) { <button pButton pInitEditableRow></button> }
        @else { <button pButton pSaveEditableRow></button> }
      </td>
    </tr>
  </ng-template>
</p-table>
```

</v-click>

<v-click>

> 💡 **列冻结**：`<th pFrozenColumn alignFrozen="left">` 配合 `[scrollable]="true"`。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 行内编辑是企业后台高频功能，PrimeNG Table 提供完整 API。

editMode 三档：
- 'row'：整行编辑（点击编辑按钮进入）
- 'cell'：单元格编辑（双击进入）
- 不传：只读模式

行编辑模式的关键指令：
- pEditableRow：标记可编辑行
- pInitEditableRow：进入编辑模式按钮
- pSaveEditableRow：保存按钮
- pCancelEditableRow：取消按钮
- p-cellEditor：单元格编辑容器
  - pTemplate="input"：编辑时显示
  - pTemplate="output"：只读时显示

事件：
- (onEditInit) (onEditComplete) (onEditCancel)
- 配合 RxJS 自动保存 / 本地缓存

vs Material Table：
- Material 没有内置行编辑，要自己造（v-if 切换 + FormControl）
- PrimeNG 内置完整 API
- NG-ZORRO 也没有内置，要写 nzInplace 拼装

[click] 列冻结也是企业级硬需求 ——
横向列多（20+ 列）时，左侧 ID / 名称必须固定，便于横向滚动时识别行。

启用方式：
- p-table 必须 [scrollable]="true" + scrollWidth
- th / td 加 pFrozenColumn
- alignFrozen="left" / "right" 选择方向

注意：
- 列宽必须固定（[style]="{ width: '200px' }"）
- 移动端冻结列体验差（建议关闭）
- 多列冻结按 alignFrozen + DOM 顺序自动堆叠

其他高级 Table 功能：
- 行重排：[reorderableRows]="true" + (onRowReorder)
- 列重排：[reorderableColumns]="true"
- 行展开：[expandedRowKeys] + pTemplate="expandedrow"
- 行分组：[rowGroupMode]="subheader" + groupRowsBy
- 多列排序：[sortMode]="multiple" + [multiSortMeta]
- 全局过滤：[globalFilterFields] + p-iconfield 输入框

完整覆盖企业级表格需求。
-->

---
transition: fade-out
---

# 4 个内置主题预设

Aura / Material / Lara / Nora 切换设计语言只改一行

<v-click>

| Preset       | 设计风格                 | 灵感来源              | 适合场景               |
| ------------ | ------------------------ | --------------------- | ---------------------- |
| **Aura**     | 现代简约 / PrimeTek 出品 | 自家设计              | 默认推荐 / 通用        |
| **Material** | Material Design v2       | Google Material       | 移动端 / 谷歌生态项目  |
| **Lara**     | Bootstrap 启发           | Bootstrap 5           | 传统企业 / 后台        |
| **Nora**     | 企业应用美学             | Enterprise SaaS       | 高端商业 / 设计感强    |

</v-click>

<v-click>

```ts
// 切换 preset = 改一行 import
import Aura from '@primeuix/themes/aura';   // 或 material / lara / nora

providePrimeNG({ theme: { preset: Aura } });
```

</v-click>

<v-click>

> 💡 **要点**：4 个 preset 都是「完整 token 集合」—— 切换后整个应用换皮肤（颜色 / 间距 / 圆角 / 阴影 / 动画都变）。PrimeNG / PrimeVue 共享 @primeuix/themes 包。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
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
- 与 Angular Material 项目混用注意主题碰撞

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
- 不需要重新编译（v17+ 是 CSS 变量驱动）
- 同一个项目可以做 4 个对比 demo

[click] preset 是「完整 token 集合」—— 切换的不只是颜色 ——
- 颜色 token：primary / surface / success / warning ...
- 间距 token：padding / margin / gap ...
- 圆角 token：rounded / pill ...
- 阴影 token：shadow / focusShadow ...
- 动画 token：transitionDuration / easing ...
- 字体 token：fontSize / fontWeight ...

所以「切换 preset」≠「换颜色主题」—— 是「换整套设计语言」。
这是 PrimeNG 与 Angular Material（一套 Material Design）/ NG-ZORRO（一套 Ant Design）最大的差异。

跨框架红利：
- @primeuix/themes 是 PrimeNG 与 PrimeVue 共享的主题包
- 同一个 definePreset 文件可以在 Angular + Vue 项目复用
- 跨框架团队（PrimeReact / PrimeNG / PrimeVue 同时用）共享 token 体系
-->

---
transition: fade-out
---

# 设计 token 三层架构

Primitive / Semantic / Component 三层级联

<v-click>

```ts
const Aura = {
  // 1. Primitive：原始色板（无语义）
  primitive: {
    blue: { 500: '#3b82f6' },
    emerald: { 500: '#10b981' },
  },
  // 2. Semantic：语义 token（{token} 引用 Primitive）
  semantic: {
    primary: { 500: '{emerald.500}', 900: '{emerald.900}' },
    colorScheme: {
      light: { surface: { 0: '#ffffff', 100: '#f3f4f6' } },
      dark:  { surface: { 0: '#020617', 100: '#1e293b' } },
    },
  },
  // 3. Component：组件级 token（按需细粒度覆盖）
  components: {
    button: { primary: { background: '{primary.500}' } },
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
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeNG v17+ 的主题系统是「Angular UI 库设计上最先进的」——
对标 Tailwind v4 / shadcn 的 design token 体系，与 Material 3 design tokens 思路一致。

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
- 不需要重新编译（v16 前的 SCSS 编译噩梦消失了）

darkModeSelector 决定如何切换暗色：
- 'system'：跟随系统 prefers-color-scheme
- '.my-app-dark'：当 html 有这个 class 时启用暗色（手动控制）
- false：禁用暗色

这套 token 架构在 4 个 preset 上一致，让定制成本可控。

vs Material 3 tokens：
- Material 3：--mat-sys-* 变量体系，完全由 Material spec 定义
- PrimeNG：Primitive / Semantic / Component 三层，灵活度更高
- 两者本质相通（都基于 CSS 变量 + 语义层）

vs NG-ZORRO Less 变量：
- NG-ZORRO：400+ Less 变量，编译期确定
- PrimeNG：CSS 变量运行时，灵活度更高
- NG-ZORRO v18+ 实验性 CSS 变量，正在追赶
-->

---
transition: fade-out
---

# definePreset 自定义

在内置 preset 基础上微调

<v-click>

```ts
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      500: '{indigo.500}',
      900: '{indigo.900}',
    },
    colorScheme: {
      light: { surface: { 50: '#fafafa', 100: '#f4f4f5' } },
      dark:  { surface: { 0: '#18181b', 50: '#27272a' } },
    },
  },
});

providePrimeNG({ theme: { preset: MyPreset } });
```

</v-click>

<v-click>

**运行时动态修改** —— `updatePrimaryPalette({ 500: '#FF6B35' })` 替换 primary 色板；`updatePreset({ semantic: { primary: { 500: '{rose.500}' } } })` 合并 token。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
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
3. 注册到 providePrimeNG 配置

token 路径用 `{semantic.path}` 引用 Primitive ——
- `{indigo.500}` 引用预设的 indigo 色板
- 也可以直接写颜色值 `'#FF6B35'`

最常见的定制场景：
- 改 primary 色（品牌色）—— 改 semantic.primary
- 改 surface 色（背景 / 卡片）—— 改 semantic.colorScheme
- 改 borderRadius（更圆 / 更方）—— 改 semantic.borderRadius
- 改 typography（字体）—— 改 semantic.fontFamily

[click] 运行时动态修改是 PrimeNG v17 的杀手锏 ——
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
不像 CSS-in-JS 那样响应式（但视觉效果一致）。

注意：updatePrimaryPalette 接收的对象会和当前 primary 合并 ——
传 `{ 500: '#FF6B35' }` 只改 500，其他 50-950 保留原值。
如果要全部替换，传完整的 50-950 对象。

跨框架共享：
- 这套 API 在 PrimeNG 和 PrimeVue 完全一致
- 同一个 definePreset 文件可以在两个项目里用
- 设计师维护一份 preset，前端两端都能用
-->

---
transition: fade-out
---

# Styled vs Unstyled

剥离样式让 Tailwind / SCSS 完全接管

<v-click>

```ts
// Styled 模式（默认）：CSS 变量 + 4 preset
providePrimeNG({
  theme: { preset: Aura, options: { darkModeSelector: '.my-app-dark' } },
});

// Unstyled 模式：providePrimeNG 不传 theme，自己用 pt + Tailwind 接管
providePrimeNG({});
```

```html
<!-- 用 pt + Tailwind 自己写样式 -->
<p-button label="提交" [pt]="{
  root: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md',
  label: 'font-medium', icon: 'mr-2'
}" />

<!-- 单组件 unstyled：项目整体 Styled，特殊组件局部剥离 -->
<p-button label="自定义" [unstyled]="true" />
```

</v-click>

<v-click>

> 💡 **要点**：全局或单组件两档剥离 —— 严格设计系统 / Tailwind 重度项目用 Unstyled。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Unstyled 模式是 PrimeNG v17 与 Angular Material / NG-ZORRO 最大的差异 ——
其他 UI 库要么「全用自家样式」，要么「全用 Tailwind 重写」。
PrimeNG 提供「同一个组件库，两种工作流」。

Unstyled 模式的工作原理：
- providePrimeNG 不传 theme 配置，或单组件 [unstyled]="true"
- PrimeNG 不再生成任何 CSS 变量 / 样式
- 组件渲染出 DOM 结构，但 class 是空的
- 你用 pt 给每个 DOM 加 class（通常是 Tailwind utility）

实际写法：
- 在 providePrimeNG 全局开启 unstyled
- 在 providePrimeNG 配置的 pt 选项中预设全局样式（避免每个组件重写）
- 单个组件如有特殊样式，再用 pt 局部覆盖

适合场景：
- 团队有严格设计系统（Figma → Tailwind utility 映射）
- 品牌一致性要求高（不能用 Aura 默认 emerald）
- 已有 Tailwind 项目想接入组件库
- 项目已经在用 Angular shadcn 风格库（如 spartan-ui）

不适合场景：
- 快速搭建后台（直接用 Styled + Aura 更快）
- 设计资源少（重新设计每个组件累）
- 团队不熟 Tailwind

单组件 unstyled 是中间路线 ——
项目整体用 Styled（开箱即用），但某些特殊组件用 unstyled 完全自定义。

例：p-table 用默认样式（开箱即用），但项目头部的特殊 p-button 用 unstyled + Tailwind。

vs PrimeVue Volt UI（2025）：
- PrimeVue 配套发布了 Volt UI（Tailwind v4 衍生库）
- 类似 shadcn 思路：组件源码进项目
- PrimeNG 当前没有对应的 Volt-Angular 版本
- 但 Angular 生态有 spartan-ui / hlm-ui 等 shadcn-style 库可参考
- 跟进 PrimeTek 是否会推出 Volt-Angular（v22+ 可能）
-->

---
transition: fade-out
---

# PassThrough (pt) 深度自定义（一）

直达组件内部 DOM 的「上帝模式」

<v-click>

**基础用法**

```html
<p-panel header="标题" [toggleable]="true" [pt]="{
  root: 'border border-primary rounded-xl p-4',
  header: { class: 'flex items-center justify-between' },
  content: 'text-primary-700 mt-4'
}">
  内容
</p-panel>
```

</v-click>

<v-click>

**函数式 pt（接收 context）** —— 根据组件状态返回不同 class

```ts
ptConfig = {
  root: (options: any) => ({
    class: options.state?.collapsed ? 'collapsed' : 'expanded',
  }),
  header: ({ instance }: any) =>
    instance.toggleable ? 'cursor-pointer' : '',
};
```

```html
<p-panel header="标题" [pt]="ptConfig" />
```

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PassThrough (pt) 是 PrimeNG 与其他 UI 库最大的差异化 ——
其他 UI 库的定制深度通常止步于 prop / slot，
PrimeNG 用 pt 让你「直达每个组件的每一层内部 DOM」。

pt 对象的键对应「组件内部 DOM section」名字 ——
每个 PrimeNG 组件文档底部都有「PT Section」表格，列出所有可用的 section 名。

例如 p-panel 的 section：
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
```ts
[pt]="{ root: 'my-class' }"
```

对象：可以传任意 HTML 属性 / 事件
```ts
[pt]="{
  root: { class: 'my-class', style: { color: 'red' }, onClick: handler }
}"
```

函数：接收 options 参数，返回字符串或对象（条件渲染）
- options.state：组件内部状态
- options.props：组件属性
- options.instance：组件实例

[click] 函数式 pt 是 PrimeNG 强大的「状态驱动样式」——

例如 p-accordion 标签展开时变蓝、未展开时灰色：
```ts
ptConfig = {
  header: ({ context }: any) => ({
    class: context.active ? 'bg-blue-500' : 'bg-gray-100',
  }),
};
```

例如 p-button 在 loading 状态加自定义动画：
```ts
ptConfig = {
  root: ({ props }: any) => ({
    class: props.loading ? 'animate-pulse' : '',
  }),
};
```

函数式 pt 让组件「状态可视化」完全可控。
-->

---
transition: fade-out
---

# PassThrough (pt) 深度自定义（二）

声明式语法 + 全局配置 + 嵌套组件

<v-click>

**全局配置 + mergeSections** —— providePrimeNG 一次定义，所有同类组件自动应用

```ts
providePrimeNG({
  theme: { preset: Aura },
  pt: {
    panel: { header: { class: 'bg-primary text-primary-contrast' } },
    button: { root: { class: 'shadow-md' } },
  },
  ptOptions: {
    mergeSections: true,    // section 级合并
    mergeProps: true,       // class / style 累加
  },
});
```

</v-click>

<v-click>

**嵌套组件用 pc 前缀** —— Button 内部嵌套了 Badge，访问子组件用 pcBadge

```html
<p-button label="消息" badge="2" [pt]="{
  root: 'btn',
  pcBadge: { root: 'bg-violet-500 text-white' }
}" />
```

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 全局 pt 配置是「项目级别预设」——
在 providePrimeNG 一次定义，所有该类型组件自动应用。

例：项目所有 Panel header 都加深色背景，
所有 Button 都加阴影 ——
不用每处写 pt，全局 pt 一次设置。

ptOptions 控制合并行为：

mergeSections（默认 true）：
- 组件级 pt 与全局 pt 在 section 级合并
- 全局有 panel.header.class，组件有 panel.content.class
- 合并后两者都生效

mergeProps（默认 true）：
- class 累加（不覆盖）
- 全局 'bg-primary'，组件加 'text-bold'
- 最终 'bg-primary text-bold'
- 设为 false 切换为「覆盖模式」（组件 class 完全替换全局）

[click] pc 前缀是「组件嵌套的关键」——

当组件内部嵌套了其他 PrimeNG 组件时，用 pc 前缀引用 ——
pcBadge 表示「Button 内部嵌套的 Badge 组件」—— 通过 pc 前缀进入子组件的 pt。

例如：
- p-button + badge="2" 内部渲染 p-badge
- 访问内部 badge 的 root：pt.pcBadge.root
- 等价于直接渲染 p-badge 时的 pt.root

其他常见嵌套：
- p-table 内部的 pcPaginator（分页器）
- p-multiselect 内部的 pcOverlay（弹出层）
- p-cascadeSelect 内部的 pcTree（树）

完整的嵌套关系看每个组件文档的「PT Options」表。

声明式 pt 语法（与 PrimeVue 不同）：
- PrimeVue 4 引入了 pt:section:attr="value" 声明式语法
- PrimeNG 仍用对象式 [pt]="{ section: { attr: value } }"
- 这是因为 Angular 模板不支持 prop: 这种连续 binding 名
- 但函数化 + 全局 pt + ptOptions 已经足够强大

实战经验：
- 项目级共性放全局 pt（providePrimeNG）
- 单组件特殊样式放局部 [pt]
- 状态驱动样式用函数式 pt
- 嵌套组件用 pc 前缀
- 不要过度使用 pt（破坏可维护性）—— 优先用 prop + class
-->

---
transition: fade-out
---

# Tailwind 集成（v3 + v4）

tailwindcss-primeui 官方插件

<v-click>

`pnpm add tailwindcss-primeui` —— 让 PrimeNG token 与 Tailwind utility 联动

```css
/* Tailwind v4：CSS-first 配置 */
@import "tailwindcss";
@plugin "tailwindcss-primeui";
@theme { --color-primary-500: var(--p-primary-500); }
```

```ts
// Tailwind v3：tailwind.config.ts
import PrimeUI from 'tailwindcss-primeui';

export default {
  content: ['./src/**/*.{html,ts}'],
  plugins: [PrimeUI],
};
```

</v-click>

<v-click>

```html
<!-- 主题色 utility，主题切换时自动跟随 -->
<div class="bg-primary text-primary-contrast p-4 rounded-lg">主色卡片</div>
<div class="bg-surface-100 dark:bg-surface-900">背景色随主题切换</div>
```

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] tailwindcss-primeui 是 PrimeTek 官方维护的 Tailwind 插件 ——
让 PrimeNG 主题 token 与 Tailwind utility 无缝对接。

核心功能：
- 把 PrimeNG 的 token（--p-primary-500 / --p-surface-100 等）转成 Tailwind utility
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

无论 v3 v4，插件功能一致 —— 都是把 PrimeNG token 暴露给 Tailwind。

Tailwind v4 注意点：
- v4 默认输出在 @layer utilities 内
- 配合 PrimeNG cssLayer 才能控制优先级（下一页讲）
- v4 启用了 @theme 块，可以直接引用 CSS 变量

Tailwind v3 注意点：
- v3 默认不分 layer
- 需要手动配置 @layer 顺序（或者用 ! important）

[click] 实际使用场景：

场景 1：用 Tailwind 写布局，PrimeNG 写组件
```html
<div class="grid grid-cols-3 gap-4 bg-surface-50 p-4">
  <p-card>card 1</p-card>
  <p-card>card 2</p-card>
</div>
```

场景 2：用 Tailwind utility 给 PrimeNG 组件加自定义样式（不用 pt）
```html
<p-button class="!shadow-lg !rounded-full" label="按钮" />
```

注意 ! 前缀（important）—— 因为 PrimeNG 的样式 specificity 较高，
直接 class 可能被覆盖，加 ! 强制生效。

场景 3：暗色模式联动
```html
<div class="bg-surface-0 dark:bg-surface-900 text-color">
  内容
</div>
```

dark: 前缀基于 darkModeSelector 配置（'.my-app-dark' 等）—— Tailwind 与 PrimeNG 共享同一个 class。

vs Angular Material：
- Material 没有官方 Tailwind 集成插件
- PrimeNG 有官方支持
- 这是 PrimeNG 在「现代项目」中的优势
-->

---
transition: fade-out
---

# cssLayer 与 Tailwind 优先级

解决 PrimeNG + Tailwind specificity 冲突

<v-click>

```ts
providePrimeNG({
  theme: {
    preset: Aura,
    options: {
      cssLayer: {
        name: 'primeng',
        order: 'tailwind-base, primeng, tailwind-utilities',
      },
    },
  },
});
```

</v-click>

<v-click>

```css
/* styles.css —— Tailwind v3 需手动分 layer */
@layer tailwind-base, primeng, tailwind-utilities;

@layer tailwind-base { @tailwind base; }
@layer tailwind-utilities { @tailwind components; @tailwind utilities; }
```

</v-click>

<v-click>

> 💡 **要点**：Tailwind v4 默认 layered，配合 cssLayer 自动解决优先级。v3 需要手动 @layer 分组。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] CSS specificity 问题是「PrimeNG + Tailwind 共存」的高频坑 ——

PrimeNG Styled 模式下，组件样式 specificity 较高（类似 `.p-button.p-component`），
Tailwind utility（如 `.bg-red-500`）只有 0,0,1,0，
所以直接 class 经常被覆盖。

三种解决方案：

方案 1：Tailwind 加 ! 前缀（important）
- `class="!bg-red-500"` 强制覆盖
- 简单但「!」满天飞影响可读性
- 不推荐项目级使用

方案 2：用 pt 直接覆盖
- `[pt]="{ root: 'bg-red-500' }"` 加到 root section
- pt 中的 class 与 PrimeNG 自身 class 合并，specificity 相同
- 推荐用于「局部覆盖样式」

方案 3：开启 cssLayer（最佳）
- PrimeNG 样式包在 @layer primeng { ... } 中
- 任何不在 layer 中的 CSS 都优先级更高
- 配合 Tailwind layer 顺序控制

[click] cssLayer 是「与 Tailwind 共存的终极方案」——

CSS @layer 是浏览器原生功能（2022+），允许「分层管理 CSS 优先级」：
- layer 内的 CSS specificity 受 layer 顺序控制
- 后定义的 layer 整体优先级更高

cssLayer 配置：
- false（默认）：不使用 layer，PrimeNG 样式正常 inline
- true：PrimeNG 样式包在 `@layer primeng { ... }` 中
- 对象：自定义 layer 名 + 顺序

最佳实践（与 Tailwind v4）：
```ts
cssLayer: {
  name: 'primeng',
  order: 'tailwind-base, primeng, tailwind-utilities'
}
```

这告诉浏览器：
- tailwind-base 优先级最低（reset / preflight）
- primeng 中等
- tailwind-utilities 最高（写 bg-red-500 必生效）

这样 Tailwind utility 总是覆盖 PrimeNG 默认样式，
不需要满屏 ! 前缀。

[click] Tailwind v3 vs v4 区别：

v4（推荐）：
- 默认就是 layered 输出
- @plugin "tailwindcss-primeui" 自动配合 PrimeNG cssLayer
- 配置最简单

v3（老项目）：
- 需要手动 @layer 分组
- @tailwind base 包在 tailwind-base layer
- @tailwind utilities 包在 tailwind-utilities layer
- 中间留出 primeng layer
- styles.css 需要显式声明 @layer 顺序

vs NG-ZORRO：
- NG-ZORRO Less 编译期主题，与 Tailwind 共存需要 ! 前缀或自定义编译
- PrimeNG CSS 变量 + cssLayer，与 Tailwind v4 原生友好
- 这是 PrimeNG 在「现代项目」中的设计优势
-->

---
transition: fade-out
---

# 三大命令式服务（一）

MessageService — Toast 全局消息

<v-click>

```ts
// app.config.ts —— 三大服务全局 providers
providers: [
  provideAnimationsAsync(),
  providePrimeNG({ theme: { preset: Aura } }),
  MessageService, ConfirmationService, DialogService,
],

// 任意组件
@Component({
  imports: [ToastModule, ButtonModule],
  template: `
    <p-toast position="top-right" />
    <p-button label="成功" (onClick)="show()" />
  `,
})
export class ToastDemo {
  msg = inject(MessageService);
  show() { this.msg.add({ severity: 'success',
    summary: '成功', detail: '保存完成', life: 3000 }); }
}
```

</v-click>

<v-click>

> 💡 **三件套**：providers 注册服务 → 模板放 &lt;p-toast /&gt; → inject 调用 add。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeNG 的反馈组件采用「服务 + 模板 + Composable」三件套设计 ——
与 PrimeVue 完全一致的设计哲学，但 Angular 风格用 inject() + RxJS Subject 实现。

MessageService 是核心服务，与 p-toast 组件配套使用。

设置三步：
1. providePrimeNG 配置 + 注入 MessageService 到 providers
2. 模板某处放 <p-toast /> 组件（推荐放 app.component.ts 根部）
3. 注入 MessageService 调用 add(message)

消息对象：
- severity: success / info / warn / error / secondary / contrast
- summary：标题（粗体）
- detail：详细内容
- life：自动消失时间（毫秒），不传则 sticky（手动关闭）
- closable：是否显示关闭按钮
- key：分组键（配合多个 Toast 实例用）
- styleClass：自定义 class

position 控制 Toast 位置（9 个方向）：
- top-left / top-center / top-right
- bottom-left / bottom-center / bottom-right
- center（中间居中）

[click] MessageService 的设计与 NG-ZORRO NzMessageService 差异：

NG-ZORRO NzMessageService：
- inject 即用，调用 message.success() 直接弹
- 内部已经在根部渲染了 message-container
- 不需要模板里放任何组件

PrimeNG MessageService：
- inject 即用，但需要模板里放 <p-toast /> 组件接收消息
- 没有 <p-toast /> = 没有渲染者 = 消息发出但不显示
- 一个项目可以放多个 <p-toast key="xxx" /> 实例（不同分组）

PrimeNG 的好处：
- 灵活：不同区域不同 toast 样式
- 解耦：服务发消息，组件订阅渲染

PrimeNG 的代价：
- 必须在模板里放 <p-toast />（容易忘）
- 单一全局 Toast 的简单场景反而稍麻烦

最佳实践：在 app.component.ts 根部放一次 p-toast，全应用通用 ——
template 里放 p-toast / p-confirmdialog / p-dynamicdialog 三个组件，
搭配 router-outlet 一起渲染。

services 全局注入：
- v17+ 推荐在 app.config.ts providers 数组里加 MessageService 等
- 替代老的 root-level providers 写法
- @Injectable({ providedIn: 'root' }) 也可（PrimeNG 服务已默认）

实战经验：
- 不要在 root 之外的 component providers 再次声明 MessageService
- 否则会创建新实例，与 p-toast 订阅的实例不同 → 消息不显示
- 这是新手最易踩坑点之一
-->

---
transition: fade-out
---

# 三大命令式服务（二）

ConfirmationService — 危险操作必用

<v-click>

```ts
@Component({
  imports: [ConfirmDialogModule, ButtonModule],
  template: `
    <p-confirmdialog />
    <p-button label="删除" severity="danger" (onClick)="del()" />
  `,
})
export class ConfirmDemo {
  confirm = inject(ConfirmationService);
  del() {
    this.confirm.confirm({
      message: '确认删除此用户？此操作不可恢复。',
      header: '危险操作', icon: 'pi pi-exclamation-triangle',
      acceptLabel: '删除', rejectLabel: '取消',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.api.deleteUser(id),
    });
  }
}
```

</v-click>

<v-click>

> 💡 **ConfirmPopup**：轻量气泡版（不是 modal）。`<p-confirmpopup />` + `confirm({ target: event.currentTarget })`，适合列表行删除等小范围确认。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] ConfirmationService 是 PrimeNG 的「危险确认」服务 ——
设计与 MessageService 完全一致：服务 + 模板 + inject() 三件套。

设置三步：
1. providers 里加 ConfirmationService
2. 模板某处放 <p-confirmdialog /> 组件
3. inject(ConfirmationService) 调用 confirm()

confirm() 配置选项：
- message：内容
- header：标题
- icon：图标 class（pi pi-exclamation-triangle 等）
- acceptLabel / rejectLabel：按钮文字
- acceptButtonStyleClass / rejectButtonStyleClass：按钮 class
- accept / reject：回调函数
- defaultFocus：默认聚焦的按钮（'accept' / 'reject'）
- closable：是否显示右上角 X

与 NG-ZORRO NzModalService.confirm 差异：
- NG-ZORRO：inject 直接弹，不需要模板组件
- PrimeNG：通过 ConfirmationService 服务化，需要模板 <p-confirmdialog />

PrimeNG 的好处：
- 可以放多个 <p-confirmdialog key="xxx" /> 实例（不同区域不同样式）
- confirm({ key: 'xxx' }) 路由到指定 dialog

[click] ConfirmPopup 是 ConfirmDialog 的轻量版 ——
不是模态对话框，而是「贴在触发元素旁边的小气泡」。

适用场景：
- 删除单行（小范围确认，不需要 modal 阻断）
- 不重要的二次确认

```html
<p-confirmpopup />
<p-button (onClick)="confirmDelete($event)" />
```

```ts
confirmDelete(event: Event) {
  this.confirm.confirm({
    target: event.currentTarget as HTMLElement,   // 关键：传入触发元素
    message: '确认删除？',
    accept: () => {...},
  });
}
```

ConfirmPopup 与 ConfirmDialog 共用 ConfirmationService ——
只是组件不同（一个气泡 / 一个模态），call API 一致。

实战经验：
- 危险操作（删除 / 解绑 / 重置）一律 ConfirmDialog
- 列表内的小操作（行删除）用 ConfirmPopup（更轻量）
- 二次确认必须有 icon + 颜色（视觉警示）
- accept 回调必须返回 Observable / Promise 处理异步逻辑
-->

---
transition: fade-out
---

# 三大命令式服务（三）

DialogService — 动态打开任意组件

<v-click>

```ts
// 父组件：程序化打开
export class DialogDemo {
  dialog = inject(DialogService);
  open() {
    const ref = this.dialog.open(UserEditComponent, {
      header: '编辑用户', width: '50vw',
      data: { userId: 1 }, modal: true, closeOnEscape: true,
    });
    ref.onClose.subscribe(result => console.log('关闭', result));
  }
}

// 弹窗内组件：inject DynamicDialogRef / Config
@Component({ template: `...` })
export class UserEditComponent {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  save() { this.ref.close({ ok: true, id: this.config.data.userId }); }
}
```

</v-click>

<v-click>

> 💡 **优势**：不需要模板写 &lt;p-dialog /&gt;，组件解耦，多弹窗自动堆叠 —— Angular Material MatDialog 同款 API 风格。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] DialogService 是 PrimeNG 的「动态弹窗服务」——
不需要模板里写 <p-dialog />，可以通过 dialog.open(Component) 程序化打开任意 Angular 组件。

设置：
- providers 里加 DialogService（v17+ 默认 providedIn: 'root'）
- 模板不需要放任何 Dialog 组件（DialogService 内部用 ViewContainerRef 动态创建）

dialog.open() 接收：
- 第一个参数：要弹出的 Component 类
- 第二个参数：配置对象
  - header：标题
  - width / height：尺寸（'50vw' / '600px' 等）
  - data：传给组件的数据（组件用 inject(DynamicDialogConfig).data 获取）
  - modal：是否模态（true 阻塞背景）
  - closeOnEscape：ESC 关闭
  - closable：右上角 X
  - dismissableMask：点击遮罩关闭
  - styleClass：自定义 class

返回 DynamicDialogRef：
- ref.close(result)：关闭并传回结果
- ref.onClose：Observable，订阅关闭事件
- ref.onMaximize / onDestroy：其他生命周期

弹窗内组件控制：
- inject(DynamicDialogRef) 拿到 ref 实例
- 调 ref.close(result) 关闭并传值
- inject(DynamicDialogConfig) 拿到 data + 其他配置

这套 API 类似 Angular Material 的 MatDialog 或 NG-ZORRO NzModalService.create({ nzContent: Component })。
适合「弹窗内容动态决定」的场景（不能在编译期就写在模板里）。

实战经验：
- 表单编辑用 DialogService（不要用静态 p-dialog）
- 详情查看用 p-drawer（侧边滑出）
- 简单确认用 ConfirmDialog（不用 DialogService）
- 关闭后处理：ref.onClose.subscribe(result => ...)

vs Material MatDialog：
- API 几乎一致（open / close / onClose）
- PrimeNG 多了 maximize / minimize / position 等
- 都是 Angular CDK 风格

vs NG-ZORRO NzModalService.create：
- NzModalService 用 nzContent 传 Component
- PrimeNG DialogService 用 .open(Component)
- API 略不同但本质一致
-->

---
transition: fade-out
---

# 静态 p-dialog vs 动态 DialogService

何时用哪个？

<v-click>

**静态 p-dialog（模板里 v-if 切换）**

```html
<p-dialog [(visible)]="showEdit" header="编辑" [modal]="true"
  [style]="{ width: '50vw' }">
  <app-user-edit-form [userId]="currentUserId" (saved)="close()" />
  <ng-template pTemplate="footer">
    <p-button label="取消" severity="secondary" (onClick)="close()" />
    <p-button label="保存" (onClick)="save()" />
  </ng-template>
</p-dialog>
```

</v-click>

<v-click>

**动态 DialogService（程序化打开）**

```ts
this.dialog.open(UserEditComponent, {
  header: '编辑', data: { userId },
});
```

</v-click>

<v-click>

> 💡 **取舍**：静态适合「固定弹窗 + 父子组件强关联」；动态适合「按需打开 + 解耦 + 多个不同弹窗」。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 静态 p-dialog 是「模板里写 dialog，用 [(visible)] 切换显示」的传统模式。

适合场景：
- 弹窗内容简单（不用动态切换组件）
- 父子组件强关联（父组件管 dialog 状态）
- 弹窗个数固定且少
- 需要 ng-template pTemplate 自定义 footer / header

静态 dialog 的优势：
- 模板可视化（直观）
- 父子组件通过 @Input / @Output 通信
- 不需要 inject Service
- 适合「单个固定弹窗」

静态 dialog 的劣势：
- 不能动态决定弹什么组件
- 多个弹窗模板冗长
- 父组件耦合度高

[click] 动态 DialogService 是「服务式 + Component 工厂」模式。

适合场景：
- 弹窗内容动态决定（不同操作弹不同组件）
- 多个弹窗需要解耦
- 弹窗内容复杂（需要独立组件管理状态）
- 弹窗可能多个同时打开（DialogService 自动堆叠）

动态 dialog 的优势：
- 父组件不耦合弹窗逻辑
- 弹窗组件可以独立测试
- 多个弹窗可堆叠（DialogService 维护栈）
- 数据传递更清晰（config.data）

动态 dialog 的劣势：
- 需要 inject DynamicDialogRef / Config
- 调试稍麻烦（弹窗组件不在父模板）
- ChangeDetection 上下文需要注意

[click] 实战取舍：

简单确认 → ConfirmDialog
固定编辑（单一） → 静态 p-dialog
复杂编辑（多个） → DialogService + Component
详情查看 → p-drawer（侧边）
全屏编辑 → p-dialog [maximizable]="true"

不要混用 —— 项目要么统一用静态，要么统一用 DialogService。
混用会让团队代码风格不一致。

vs Vue/React 生态：
- Vue: 静态 v-model:visible + Composition API setupDialog
- React: useState + show ? <Dialog /> : null
- Angular: 静态 [(visible)] / 动态 DialogService 两选一
- 都各有取舍

PrimeNG 在 Angular 生态最大优势：
- DialogService 完整 + 易用
- 不需要像 Material 那样写复杂的 inject + ComponentRef 模板
-->

---
transition: fade-out
---

# Router 集成

PrimeNG Menu / Menubar / Breadcrumb + Angular Router

<v-click>

```ts
@Component({
  imports: [MenuModule, MenubarModule, BreadcrumbModule, RouterModule],
  template: `
    <p-menubar [model]="topItems" />
    <p-breadcrumb [model]="crumbs" [home]="home" />
    <router-outlet />
  `,
})
export class LayoutComponent {
  // MenuItem 支持 routerLink / queryParams / fragment
  topItems: MenuItem[] = [
    { label: '首页', icon: 'pi pi-home', routerLink: '/' },
    { label: '产品', icon: 'pi pi-box', items: [
      { label: '列表', routerLink: ['/products'] },
      { label: '新增', routerLink: ['/products/new'] },
    ] },
  ];
  crumbs: MenuItem[] = [{ label: '产品' }, { label: '详情' }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
}
```

</v-click>

<v-click>

> 💡 **数据驱动**：MenuItem[] 模型适合「权限菜单 / 动态菜单 / 多语言菜单」场景。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeNG 的菜单类组件（Menu / Menubar / Breadcrumb / TieredMenu / Steps / Dock 等）都使用 MenuItem 模型作为数据源。

MenuItem 接口字段：
- label：显示文字
- icon：图标 class（pi pi-xxx）
- items：子菜单数组（递归）
- routerLink：Angular Router 链接（数组或字符串）
- queryParams：查询参数
- fragment：fragment（#hash）
- url：外部链接（与 routerLink 二选一）
- target：'_blank' 等
- command：点击回调函数（与 routerLink 二选一）
- disabled / visible：状态
- separator：分割线
- escape：HTML 转义（默认 true）
- styleClass：自定义 class
- tooltip：悬停提示

routerLink 完整支持 Angular Router：
- 数组形式 ['/products', id] 自动拼接
- queryParams 对象映射 URL query
- fragment 映射 # 锚点
- target='_blank' 新窗口打开

vs NG-ZORRO 菜单：
- NG-ZORRO 用 nz-menu + nz-menu-item + nz-submenu 模板式
- PrimeNG 用 MenuItem[] 数据驱动
- 数据驱动更适合「菜单动态生成」（如权限菜单）

vs Material：
- Material 用 mat-menu + mat-menu-item 模板式
- 与 NG-ZORRO 风格类似

PrimeNG 数据驱动的优势：
- 权限菜单：从 API 拿 MenuItem 数组直接渲染
- 多语言菜单：MenuItem.label 用 ngx-translate
- 动态菜单：MenuItem[] 通过 signal 响应式

[click] Breadcrumb 是面包屑组件：
- model: MenuItem[] 显示路径
- home: 首页配置（左侧固定）
- 路由变化时手动更新（或用 router events）

实战经验：
- 顶部菜单用 p-menubar
- 侧边菜单用 p-menu / p-panelmenu（多级折叠）
- 面包屑用 p-breadcrumb（路由变化自动更新）
- Steps 步骤条用 p-steps（与 routerLink 集成可以做步骤导航）

完整布局示例：
- header: p-menubar（横向顶部）
- aside: p-panelmenu（侧边多级）
- main: router-outlet + p-breadcrumb
- 配合 p-toast / p-confirmdialog 全局反馈

整体与 NG-ZORRO ng-alain 布局类似。
-->

---
transition: fade-out
---

# ngx-translate i18n

PrimeNG 自带 translation + ngx-translate 业务文案

<v-click>

```ts
// app.config.ts —— PrimeNG 组件文案
providePrimeNG({
  theme: { preset: Aura },
  translation: {
    accept: '确定', reject: '取消', choose: '选择', upload: '上传',
    today: '今天', clear: '清除', weekHeader: '周',
    dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
    monthNames: ['一月','二月','三月','四月','五月','六月',
                  '七月','八月','九月','十月','十一月','十二月'],
  },
});

// 运行时切换：inject(PrimeNG).setTranslation(zhCN)
const pn = inject(PrimeNG);
pn.setTranslation(newLocale);
```

</v-click>

<v-click>

> 💡 **分工**：PrimeNG translation 管组件文案（确定 / 月份）；ngx-translate 管业务文案（页面标题 / 错误提示）。两者通过 onLangChange 同步。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeNG 的国际化方案 ——

PrimeNG 的 translation 对象 = 组件内置文案（确定 / 取消 / 月份 / 星期等）。

providePrimeNG translation 配置：
- accept / reject / choose / cancel / clear
- 日期：dayNames / dayNamesShort / monthNames / monthNamesShort
- 日期组件：today / weekHeader / firstDayOfWeek
- 文件上传：uploadButtonLabel / cancelButtonLabel
- 表格：emptyMessage / emptyFilterMessage
- 校验：required / invalid
- 完整列表见 PrimeNG 文档「I18N」章节

社区维护的 translation 包（部分语言）：
- 项目 README 列出 70+ 语言模板（zh-CN / en-US / ja-JP 等）
- 直接复制到自己项目

[click] 运行时切换 translation：
- inject(PrimeNG).setTranslation(newLocale) 替换整个
- inject(PrimeNG).config.translation.accept 单字段修改
- 切换后所有 PrimeNG 组件文案实时响应

但注意：
- PrimeNG translation 只管「组件内置文案」（确定 / 取消 / 月份 / 星期等）
- 业务文案（页面标题、错误提示）还是用 ngx-translate 管

标准协同模式：
- ngx-translate 管业务文案（90% 文案在这里）
- PrimeNG translation 管组件文案（10% 来自组件库）
- 两者共享同一个 locale state（写在 Service / Signal）
- 切换时同步更新两边

```ts
constructor(translate: TranslateService, pn: PrimeNG) {
  translate.onLangChange.subscribe(({ lang }) => {
    pn.setTranslation(langMap[lang]);
  });
}
```

vs NG-ZORRO i18n：
- NG-ZORRO 用 provideNzI18n(zh_CN) 注入 70+ 内置 locale
- PrimeNG 用 translation 对象 + setTranslation 切换
- NG-ZORRO 自带完整 70+ 语言包
- PrimeNG 需要自己复制 / 写 translation 对象（或用社区包）

NG-ZORRO 更开箱即用，PrimeNG 更灵活但需要更多设置。

DatePicker 的日期格式（dateFormat: 'mm/dd/yy'）独立于 translation ——
按本地化习惯设置（美式 mm/dd/yy / 中式 yy-mm-dd）。

时区：
- PrimeNG DatePicker 默认是本地时区
- 跨时区项目需要在传值前 toUTC，显示时反转
- 配合 date-fns-tz / dayjs.tz 处理时区
-->

---
transition: fade-out
---

# Angular SSR 适配

@angular/ssr + PrimeNG SSR 友好

<v-click>

```ts
// ng add @angular/ssr 一键启用
// app.config.ts —— SSR + PrimeNG
export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } }),
  ],
};

// 浏览器端 only 组件保护
export class FloatingComponent {
  platformId = inject(PLATFORM_ID);
  dialog = inject(DialogService);
  openModal() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.dialog.open(MyComp, { header: '标题' });
  }
}
```

</v-click>

<v-click>

> 💡 **v17+ 零 FOUC**：CSS 变量在编译期生成，SSR HTML 已含 `<link>` —— 不需要像 v16 SCSS 时代那样 collect 样式。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeNG v17+ 与 Angular SSR（@angular/ssr）兼容良好。

SSR 启用：
- ng add @angular/ssr 一键配置
- 自动加 server.ts / main.server.ts / express engine
- 服务端预渲染 HTML，提升首屏性能

PrimeNG SSR 兼容性：
- 静态组件（Button / Card / Form / Table / Panel）完全 SSR 友好
- 浮层组件（Dialog / Drawer / Tooltip / Toast）仅浏览器端
- v17+ 全面支持 SSR + Hydration（v16 前有 FOUC 问题）

为什么 v17 SSR 体验好？
- v17 重构后全 CSS 变量，CSS 在 Vite 编译期生成
- SSR 渲染 HTML 时 CSS 已经在 <link> 标签中
- 完全消除了 FOUC（v16 前的 SCSS 编译期问题不复存在）

provideClientHydration：
- Angular v17+ 支持客户端水合
- 服务端渲染的 DOM 直接复用，不重建
- withEventReplay() 在水合期间回放事件

注意事项：

1. PLATFORM_ID 检查：
- 浮层组件相关代码用 isPlatformBrowser(PLATFORM_ID) 守护
- 防止服务端调用 dialog / drawer 报错
- 与 NG-ZORRO 一致的最佳实践

2. 国际化注入：
- 服务端读取 Accept-Language header
- 选对应 translation 预注入
- 避免服务端 / 客户端 locale 不一致引起的水合错误

3. 时间相关：
- 服务端用 UTC 时区渲染
- 客户端切换为用户本地时区
- 用 date-fns-tz / dayjs.tz 处理

4. 浏览器 API：
- window / document / localStorage 都不可直接访问
- 用 DOCUMENT injection token / isPlatformBrowser 守护

5. provideAnimationsAsync() 替代 provideAnimations()：
- async 版本不依赖 Zone.js 立即加载
- SSR + Zoneless 必选

实战经验：
- 中后台项目通常不需要 SSR（登录后页面）
- 营销页 / 文档站 / SEO 重要的页面才上 SSR
- SSR + PrimeNG 组合用 Card / Form / Layout 等静态组件
- 浮层只在浏览器端用，配合事件触发

性能：
- 首屏：SSR HTML 直出
- 水合：增量水合（v17+），按需激活
- 互动：水合完成后用户操作正常
- 缓存：Express / Nginx 可缓存预渲染 HTML

vs PrimeVue Nuxt module：
- PrimeVue 有官方 @primevue/nuxt-module
- PrimeNG 没有专门的 ng add @angular/ssr 集成，但兼容性良好
- 直接 ng add @angular/ssr + providePrimeNG 即可

vs NG-ZORRO SSR：
- NG-ZORRO 也完整支持 SSR
- 两者 SSR 能力相当，没有明显短板
-->

---
transition: fade-out
---

# Standalone Components 默认

v17+ Standalone-first，告别 NgModule

<v-click>

```ts
// 现代 Angular + PrimeNG 风格（v17+，无 NgModule）
@Component({
  selector: 'app-products',
  // standalone: true 在 v17+ 是默认值，可省略
  imports: [ButtonModule, TableModule, ReactiveFormsModule],
  template: `
    <p-table [value]="products()">
      <ng-template pTemplate="body" let-row>
        <tr><td>{{ row.name }}</td></tr>
      </ng-template>
    </p-table>
    <p-button label="刷新" (onClick)="reload()" />
  `,
})
export class ProductsComponent {
  products = signal<any[]>([]);
  reload() { /* ... */ }
}
```

</v-click>

<v-click>

> 💡 **现代 Angular 实践**：functional providers + standalone Component + signal + control flow（@if / @for）。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeNG 全面支持 Standalone Components，并且推荐这种现代风格。

Standalone Components 演进：
- Angular v14：引入 Standalone（实验性）
- Angular v15：Standalone 稳定
- Angular v17：Standalone 默认（standalone: true 可省）
- Angular v19+：NgModule 进入维护模式

PrimeNG 支持：
- v15-v16：开始支持 Standalone
- v17：Standalone-first，functional providers 全面替代 NgModule.forRoot
- v20：所有组件 Module + Standalone 都可用

两种风格对比：

老 NgModule 风格（不推荐）：
- @NgModule({ declarations / imports / exports })
- @NgModule({ imports: [BrowserAnimationsModule, PrimengModule.forRoot()] })
- 整个 module 一起编译
- 树摇能力一般

新 Standalone 风格（推荐）：
- @Component({ imports: [ButtonModule, ...] })
- functional providers（providePrimeNG / provideAnimationsAsync / provideRouter）
- 组件级依赖管理
- Tree-shaking 友好
- 编译速度快
- 测试更简单（不需要 TestBed Module 配置）

为什么 Standalone 是未来？
- 更接近 Vue / React 心智（组件即模块）
- 更好的代码内聚
- 更快的编译速度
- 更优的 Tree-shaking
- 路由懒加载更直接（loadComponent）

迁移路径：
- ng generate @angular/core:standalone 自动 codemod
- 增量迁移：先 Standalone 化叶子组件，再迁移容器
- 老 NgModule 与新 Standalone 可共存

PrimeNG Module vs Standalone：
- ButtonModule / TableModule 等仍可在 Standalone 组件的 imports 中用
- v17+ 也支持直接 import 单组件（如 import { Button } from 'primeng/button'）
- 但 Module 形式更常见，符合 NG-ZORRO 风格

functional providers（v17+）：
- providePrimeNG / provideAnimationsAsync
- 替代老的 BrowserAnimationsModule + NoopAnimationsModule
- 替代老的 NgModule.forRoot(config) 模式
- 与 provideRouter / provideHttpClient 风格一致

实战经验：
- 新项目：全 Standalone
- 老项目：逐步迁移 Standalone（叶子组件优先）
- PrimeNG 模块按需 imports（不要一次引入大模块）
- 路由用 loadComponent 懒加载

control flow（v17+ @if / @for / @switch）：
- 替代老的 *ngIf / *ngFor 结构指令
- 性能更好（编译期优化）
- 语法更直观
- PrimeNG 文档 demo 全面切换 @if / @for
- 与 PrimeNG 模板系统完美配合
-->

---
transition: fade-out
---

# v17→v20 主题 3 次重构

CSS 变量 + Design Token + @primeuix/themes

<v-click>

| 版本 | 主题方案                                          | 关键变化                               |
| ---- | ------------------------------------------------- | -------------------------------------- |
| v16 前 | **SCSS 编译期** + theme.css 文件                | 一个 preset = 一个 CSS 文件，运行时不变 |
| **v17** | **CSS 变量 + design token** + @primeuix/themes | 4 preset / 三层 token / 运行时切换     |
| v18-20 | 继续优化 + Zoneless / Signal-based 集成         | 全 Standalone / Signal 化              |

</v-click>

<v-click>

**v17 引入的 token 三层架构（重大）**

- Primitive token：色板（无语义）
- Semantic token：语义映射（{primary.500} → {emerald.500}）
- Component token：组件级覆盖

</v-click>

<v-click>

> 💡 **跨框架红利**：v17+ 主题包 `@primeuix/themes` 与 PrimeVue 4 完全共享 —— 同一份 definePreset 文件可以在 Angular + Vue 项目复用。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeNG 主题系统在 v17 经历了「框架级重构」——

v16 前的 SCSS 时代：
- 每个主题是一个 .css 文件（primeng/resources/themes/lara-light-blue/theme.css）
- 主题切换 = 换 link href
- 主色定制需要重新 SCSS 编译
- 没有 design token 概念
- @primefaces/scss 包提供 SCSS 变量
- 与 PrimeFaces / PrimeReact / PrimeVue 各自独立

v17 重构（2023）：
- 完全脱离 SCSS，全部用 CSS 变量
- 引入 @primeuix/themes 包（独立于 primeng）
- 设计 token 三层架构（Primitive / Semantic / Component）
- 4 preset（Aura / Material / Lara / Nora）替代旧的 20+ theme.css 文件
- definePreset / updatePreset / usePreset / updatePrimaryPalette API
- 运行时切换主题（不需要编译）
- 全面 CSS 变量化，与 Tailwind 友好

v18-20 持续优化：
- v18：Zoneless 兼容
- v19：Signal-based Forms 支持
- v20：与 Angular 20 同步发布，性能优化

[click] 三层 token 架构是 v17 重构的核心 ——

token 设计哲学对标行业最佳实践：
- Material 3 design tokens（--mat-sys-*）
- Tailwind v4（--color-*）
- shadcn 设计 token
- Apple Human Interface Guidelines tokens

PrimeNG 的三层架构：
- Primitive：原始色板（emerald.500 / blue.700）
- Semantic：语义映射（primary.500 → {emerald.500}）
- Component：组件级（button.primary.background）

[click] 跨框架共享 @primeuix/themes：
- 同一个包同时被 PrimeNG / PrimeVue 4 引用
- definePreset 文件可以在两个框架直接复用
- 设计师维护一份 token 集合
- 两个框架前端项目共享色彩 / 间距 / 圆角 / 阴影

这是 PrimeTek 跨框架战略的真正优势：
- 一份设计 = 多份代码（每个框架一份 .ng / .vue / .tsx）
- 主题系统统一（@primeuix/themes）
- 升级一致（v17 同时升级 PrimeNG + PrimeVue）

实际项目中：
- 团队设计师只维护一份 Figma 设计稿 + tokens
- 前端按框架 import token 包
- 主题变化在一处同步

升级建议：
- v16 项目：评估收益，主题深度定制的旧项目升级成本最高
- v16 → v17 是「不兼容升级」—— 主题完全重写
- 新项目：直接 v20，不要碰 v16
-->

---
transition: fade-out
---

# 常见踩坑（一）：服务 + 模板

MessageService / ConfirmationService 必须配合模板

<v-click>

**坑 1：toast.add 无效果** —— 模板里忘了放 `<p-toast />`

```html
<!-- app.component.html -->
<p-toast />        <!-- ✅ App 根部一次放好 -->
<p-confirmdialog />
<router-outlet />
```

</v-click>

<v-click>

**坑 2：组件 providers 重复声明 Service**

```ts
@Component({
  providers: [MessageService],   // ❌ 错！创建新实例，与全局 Toast 不同步
  /* ... */
})
// ✅ 只在 app.config.ts 全局 providers 声明一次
```

</v-click>

<v-click>

**坑 3：v16 组件名继续用** —— v17 已改名 Calendar → DatePicker / Dropdown → Select / InputSwitch → ToggleSwitch / Sidebar → Drawer / OverlayPanel → Popover / TabView → Tabs / TabPanel → Tab。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 「MessageService.add 调用但不显示」是 PrimeNG 新手头号踩坑 ——

PrimeNG 的服务模式与 NG-ZORRO 完全不同：
- NG-ZORRO：NzMessageService 直接弹消息，不需要模板组件
- PrimeNG：MessageService + <p-toast /> + inject() 三件套

工作原理：
- MessageService 内部用 RxJS Subject 推消息
- <p-toast /> 组件订阅 Subject，渲染消息
- 没有 <p-toast /> = 没有渲染者 = 消息发出但不显示

最佳实践：
- 在 app.component.html 根部放一次 <p-toast />、<p-confirmdialog />、<p-dynamicdialog />
- 全应用通用，零开销（没消息时不渲染任何 DOM）

[click] 「组件 providers 重复声明 Service」是另一个头号坑：

PrimeNG 服务用 RxJS Subject 推消息，
如果组件 providers 重复声明 MessageService，会创建新的 Subject 实例 ——
这个新实例与根部 <p-toast /> 订阅的实例不是同一个 → 消息发不出。

最佳实践：
- MessageService / ConfirmationService / DialogService 只在 app.config.ts 全局声明
- 组件不需要再次 providers
- inject(MessageService) 自动拿到全局单例

例外：
- 如果你需要「多个独立 Toast 实例」（不同分组 / 区域），可以局部 providers
- 但必须每个 Toast 配套自己的 <p-toast key="xxx" /> 实例
- 这种情况极少见，新手不建议这样做

[click] v16 组件名继续用是「升级 v17 的最大踩坑」——

v16 项目升 v17 时，IDE 不会报错（因为 v16 组件名作为标签也是合法 HTML），
但运行时无法 resolve，组件不渲染或报警告。

主要改名：
- Calendar → DatePicker（更清晰）
- Dropdown → Select（与 HTML <select> 对齐）
- InputSwitch → ToggleSwitch（更精确）
- Sidebar → Drawer（与 Material / Ant Design 等对齐）
- OverlayPanel → Popover（与 Tailwind / shadcn / Bootstrap 对齐）
- TabView → Tabs / TabPanel → Tab
- 其他：TriStateCheckbox 移除（用 Checkbox + indeterminate prop 替代）

import 也要改：
```ts
// v16
import { CalendarModule } from 'primeng/calendar';

// v17+
import { DatePickerModule } from 'primeng/datepicker';
```

建议升级时全局搜索 / 替换：
- 搜 `Calendar` → 检查是否 PrimeNG 组件 → 替换 DatePicker
- 搜 `Dropdown` → 同上 → 替换 Select
- 以此类推

PrimeNG 官方提供 ng-update 部分 codemod，但不完整，仍需手动审查。
-->

---
transition: fade-out
---

# 常见踩坑（二）：主题 + pt

CSS 优先级 / pt section 不存在 / 全局 vs 局部

<v-click>

**坑 4：Tailwind class 不生效（specificity 问题）** —— `class="bg-red-500"` 仍是绿色

```html
<p-button class="!bg-red-500" label="点我" />            <!-- ✅ ! 前缀强制 -->
<p-button [pt]="{ root: 'bg-red-500' }" label="点我" /> <!-- ✅ pt 直接覆盖 -->
```

</v-click>

<v-click>

**坑 5：pt section 名不存在** —— Panel 没有 'body'，只有 root / header / content / footer。查文档 PT Section 表找正确的 section 名。

</v-click>

<v-click>

**坑 6：Zoneless 模式视图不更新** —— 业务用 setTimeout / Promise 不触发检测，改 signal / Observable / `cdr.markForCheck()`。

</v-click>

<v-click>

**坑 7：Table 数据不刷新** —— OnPush 模式需新数组引用，直接 push 无效，用 `[...arr, item]` 或 `signal.set(newArr)`。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] CSS specificity 问题是「PrimeNG + Tailwind 共存」的高频坑 ——

PrimeNG Styled 模式下，组件样式 specificity 较高，
Tailwind utility 只有 0,0,1,0，所以直接 class 经常被覆盖。

三种解决方案：

方案 1：Tailwind 加 ! 前缀（important）
- class="!bg-red-500" 强制覆盖
- 简单但「!」满天飞影响可读性

方案 2：用 pt 直接覆盖
- [pt]="{ root: 'bg-red-500' }" 加到 root section
- pt 中的 class 与 PrimeNG 自身 class 合并
- 推荐用于「局部覆盖样式」

方案 3：开启 cssLayer
- PrimeNG 样式包在 @layer primeng 中
- 配合 Tailwind layer 顺序控制
- 最佳长期方案（前页详细讲过）

[click] pt section 不存在是「不查文档导致」的坑：

每个 PrimeNG 组件的 pt section 都不同，
要查文档「PT Section」表才能知道正确的 section 名。

比如：
- p-panel：root / header / title / icons / toggler / content / footer
- p-table：root / header / footer / body / row / cell / column / paginator
- p-button：root / label / icon / loadingIcon

写错 section 名不报错（pt 是宽松匹配），但 class 不会应用 ——
表现就是「pt 写了但没效果」。

解决方法：
- 浏览器 devtools 检查实际 DOM 结构
- 对照 PrimeNG 文档的 PT Section 表
- 找到对应 DOM 节点的 section 名

[click] Zoneless 模式视图不更新：

PrimeNG v18+ 支持 Zoneless，但业务代码必须适配：
- 不能依赖 setTimeout / Promise 自动触发检测
- 改用 signal / Observable + AsyncPipe / cdr.markForCheck()
- 否则数据变了但 UI 不刷新

修复模式：
1. 改用 signal：state.set(newValue) 自动触发检测
2. 改用 Observable + AsyncPipe：模板里 {{ data$ | async }}
3. 实在不行：inject(ChangeDetectorRef).markForCheck() 手动触发

[click] Table 数据不刷新（OnPush + 数组引用）：

所有 PrimeNG 组件默认 OnPush 模式，
Table 的 [value] 输入需要新数组引用才能触发 ChangeDetection：

错误：
```ts
this.products.push(newItem);   // ❌ 引用没变，OnPush 不检测
```

正确：
```ts
this.products = [...this.products, newItem];   // ✅ 新数组引用
// 或
this.products.set([...this.products(), newItem]);   // ✅ signal 模式
```

其他常见踩坑：

- p-dropdown / p-select 选项空：检查 optionLabel 是否对得上数据字段
- p-datepicker 时区不对：用 dayjs.utc / dayjs.tz 显式控制
- 移动端 Tooltip 不显示：原生 hover 不触发，改 showDelay / position
- DialogService 打开的组件 inject 失败：必须 providedIn root，或 DialogService.open 自动 child injector
- SSR 报 window is not defined：用 isPlatformBrowser(PLATFORM_ID) 守护

完整踩坑参考 PrimeNG GitHub Issues + Stack Overflow（英文资源极丰富）。
-->

---
transition: fade-out
---

# 最佳实践清单

来自国外大型 PrimeNG 项目沉淀

<v-click>

**项目初始化** —— `app.config.ts` 一次注册 providePrimeNG + provideAnimationsAsync + 三大 Service；`app.component.html` 根部放 p-toast / p-confirmdialog / p-dynamicdialog；开启 cssLayer 配合 Tailwind / SCSS。

</v-click>

<v-click>

**主题与样式** —— definePreset 在 Aura / Material / Lara / Nora 基础上微调；darkModeSelector '.my-app-dark' 配合 signal toggle；tailwindcss-primeui 让 bg-primary / text-surface 与主题联动；全局 pt 配置项目级样式预设。

</v-click>

<v-click>

**Form + Table** —— Reactive Forms + p-message 错误显示；Table 大数据集启用 virtualScroll 或 lazy + paginator；行编辑用 editMode + p-cellEditor；FileUpload 用 customUpload + uploadHandler 接入云存储直传。

</v-click>

<v-click>

**性能与现代化** —— Standalone Components 默认 + functional providers；Zoneless + signal-based 状态管理；@if / @for 控制流替代 *ngIf / *ngFor；OnPush + trackBy 优化大列表。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 项目初始化阶段的关键决定：

服务一次性 providers 完整 ——
省去以后「为什么 MessageService 没效果」「为什么 ConfirmationService 报错」的反复排查时间。
即使暂时用不到 ConfirmationService / DialogService，提前 providers 也没有额外开销。

app.component.html 根部放上 <p-toast /> / <p-confirmdialog /> / <p-dynamicdialog /> ——
这三个组件「占位即可」，没消息时不渲染任何 DOM，零开销。

按需引入 Module（imports: [ButtonModule, ...]）—— 不要一次引入整个 PrimePrimengModule（v16 风格已废弃）

cssLayer 开启是「与 Tailwind / SCSS 长期共存」的根基 ——
省去满屏 ! 前缀的痛苦。

[click] 主题与样式：

definePreset 是「在内置 preset 基础上微调」的最佳工作流 ——
不要从零写一个 preset（工作量巨大），从 Aura 出发改 primary + surface 几个 token 即可。

darkModeSelector + signal toggle 是「自动跟随系统 + localStorage 持久化」的标准组合。

tailwindcss-primeui 插件让「Tailwind utility 与 PrimeNG 主题」联动 ——
切换主题时，bg-primary / text-surface 等 utility 自动变化。

全局 pt 配置：把「所有项目都用到的样式」提取到 providePrimeNG，
避免每个组件重写。例如「所有 Panel header 加阴影」「所有 Button 加圆角」等。

[click] Form + Table：

Reactive Forms 是 Angular 项目首选（不要混 Template Forms）。
p-message 配合 form.controls.x.invalid 显示错误，比内置 nzErrorTip 更灵活。

Table 性能要点：
- < 1000 行：默认即可
- 1000 - 10000 行：开启 virtualScroll + virtualScrollItemSize
- 10000+ 行：lazy + paginator（前后端分页）

Table 行编辑（editMode + p-cellEditor）是企业后台高频功能，
PrimeNG 提供完整 API。

FileUpload 接入云存储（七牛 / 阿里 OSS / AWS S3）用 customUpload + uploadHandler：
```ts
@Output() uploadHandler = (event) => {
  for (const file of event.files) {
    await uploadToS3(file, getS3Token());
  }
};
```

跳过 PrimeNG 默认的 XHR，直接走云存储 SDK，性能 + 灵活性双赢。

[click] 性能与现代化：

Standalone Components 默认是 v17+ 的标准实践 ——
不再写 NgModule.forRoot，全部 functional providers。

Zoneless + signal 是 Angular 现代化的方向 ——
- bundle 减小 50-80KB（去掉 zone.js）
- 启动速度提升 5-15%
- 长列表 changeDetection 时间减少 30-50%
- 但需要业务全面适配 signal

@if / @for 控制流（v17+）：
- 替代老的 *ngIf / *ngFor 结构指令
- 性能更好（编译期优化）
- 语法更直观

OnPush + trackBy：
- 所有 PrimeNG 组件默认 OnPush，与业务 OnPush 完美配合
- 大列表必须 trackBy（@for track itemId）
- 防止整个列表重新渲染
-->

---
transition: fade-out
---

# 评价

组件最全 / 主题最现代 / 跨框架共享，但中文生态弱

<v-clicks>

**优点**

- 80+ 组件覆盖全场景（PickList / OrderList / Editor / Galleria 等冷门必备）
- 4 个内置主题预设 + definePreset 微调；设计 token 三层架构现代化
- Styled / Unstyled 双模式 + pt API 直达 DOM
- @primeuix/themes 与 PrimeVue 4 共享，跨框架团队红利
- tailwindcss-primeui + cssLayer + Standalone + Zoneless 全套现代化
- WCAG 2.1 AA 无障碍合规，国际化项目友好

**缺点**

- 中文生态弱于 NG-ZORRO（文档 / 教程 / 社区资源差数量级）
- v16 → v17 升级成本高（主题完全重写）；服务模式新手易踩坑
- 国内大厂采用率低；PrimeBlocks 商业模板付费
- 无官方 Volt-Angular（PrimeVue 已有 Volt UI）

</v-clicks>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PrimeNG 的优点非常集中 —— 「Angular 时代组件最全 / 主题最现代 / 跨框架共享」——

80+ 组件是 Angular UI 库的天花板 —— 国外项目「PickList / OrderList / Editor / Galleria 这些 PrimeNG 都有」是常见的赞美。

4 个内置主题预设让「不写 SCSS 不写主题」也能切换设计语言 ——
其他 Angular UI 库都是「一套默认 + 暗色」结构，没有 PrimeNG 这么灵活。

Styled / Unstyled 双模式是 PrimeNG 与众不同的核心 ——
- 中小项目 / 快速搭建 → Styled 模式开箱即用
- 严格设计系统 / Tailwind 重度 → Unstyled 模式完全自定义
- 同一个组件库满足两种工作流，避免「需要换组件库」

pt API 让组件库 prop 不够用这个痛点彻底消失 ——
直达每个 DOM section，class / style / 事件全套自定义。

设计 token 三层架构对标 shadcn / Tailwind v4 / Material 3 ——
Angular UI 库里「设计最现代」的。

跨框架共享 @primeuix/themes ——
PrimeNG + PrimeVue 团队享受「一份设计、两份代码」的红利。
设计师维护一套 token，前端两个框架都能用。

Standalone-first + Zoneless 兼容 ——
完全拥抱 Angular 现代实践，没有「老 NgModule 包袱」。

WCAG 2.1 AA 合规是「国际化项目」的硬要求 ——
PrimeNG 每个组件文档都有无障碍章节，企业合规友好。

[click] 缺点也很明确：

中文生态是最大短板 ——
- 中文文档：官方有但翻译质量参差
- 中文教程：博客 / B 站资源极少（NG-ZORRO 几十倍量）
- 中文社区：搜「PrimeNG XXX」找不到，得用英文搜
- 中文 Stack Overflow：英文资源压倒性多

v16 → v17 升级成本高 ——
主题完全重写让旧项目升级心累，
很多团队选择「v16 继续维护」而不升级。

PrimeBlocks（官方商业模板）需要付费 ——
免费的 PrimeNG 核心组件没问题，但「模板 + Figma Kit」要收费。
社区免费替代品（如 sakai-ng）数量远少于 ng-alain。

服务模式（MessageService / ConfirmationService / DialogService）对新手不友好 ——
忘记 providers 服务 / 忘记模板放组件 / 忘记 inject 触发 ——
这套「服务 + 模板 + inject」三件套需要适应。

国内大厂采用率低 ——
阿里 / 字节 / 美团 / 蚂蚁等公司 Angular 项目基本是 NG-ZORRO / 自研，
PrimeNG 在国内大厂极少见。

CSS specificity 与 Tailwind 共存需要 cssLayer 配置 ——
不配 cssLayer 直接用 Tailwind class 经常被覆盖。

无官方 Volt-Angular ——
PrimeVue 在 2025 年配套发布了 Volt UI（Tailwind v4 衍生库）
但 PrimeNG 当前没有对应版本（Angular 生态有 spartan-ui / hlm-ui 类似产品）。

[click] 选型逻辑总结：

追求组件全 / 主题多 / 定制深 / 国际化项目 → 选 PrimeNG
追求中文生态 / 中后台模板 → 选 NG-ZORRO
追求 Material Design / 谷歌生态 → 选 Angular Material
追求跨框架统一（PrimeReact / PrimeVue 已用） → 选 PrimeNG（最自然）

没有银弹，按场景选。
-->

---
transition: fade-out
---

# 学习路径

从入门到熟练应用的 4 个阶段

<v-click>

**第 1 周：核心组件熟练** —— 通读 Form / Data / Panel / Overlay 四大分组；跟着 StackBlitz 改例子；实现一个 CRUD 页面（Table + Form + Dialog + Toast 四件套）。

</v-click>

<v-click>

**第 2 周：服务 + inject 三件套** —— providers 注册 MessageService / ConfirmationService / DialogService；熟练 inject + add / confirm / open；DialogService 动态打开组件。

</v-click>

<v-click>

**第 3-4 周：主题 + 企业级整合** —— definePreset 在 Aura 基础上定制品牌色；darkModeSelector + signal toggle；tailwindcss-primeui + cssLayer 解决样式优先级。

</v-click>

<v-click>

**长期：pt + Unstyled + 现代化** —— 项目级 pt 全局配置；Unstyled + Tailwind 重写关键组件；Zoneless + signal 现代化迁移。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 第一周打基础 ——

PrimeNG 官方文档结构清晰：
- Get Started：introduction + installation + theming
- Forms：所有 Form 组件
- Data：Table + Tree + Timeline 等
- Panel：Card + Accordion + Tabs 等
- Overlay：Dialog + Drawer + Popover + Toast 等
- Menu：Menu + Menubar 等
- Messages：Toast + Message
- Media：Carousel + Galleria
- Misc：其他

每个组件都有 StackBlitz 在线编辑 demo ——
点 Edit on StackBlitz 直接进 IDE 改代码看效果，是最快学习方式。

完成一个 CRUD 页面就算入门 ——
- p-table 展示列表（含分页 / 排序）
- 点击行进入 p-dialog 编辑（用 Form + 校验）
- MessageService 提示成功 / 失败
- ConfirmationService 删除确认

[click] 第二周进阶 ——

服务 + inject 是 PrimeNG 与 NG-ZORRO / Material 最大的差异 ——
必须吃透「服务 + 模板 + inject」三件套。

能熟练写一个：
- app.config.ts providers 注册三个服务
- app.component.html 根部放三个 Provider 组件
- 任意业务组件中 inject 三个服务调用

就已经超过 80% 的 PrimeNG 初学者。

DialogService 动态打开组件是「企业级表单弹窗」的最佳实践 ——
学完后写表单弹窗不再用静态 p-dialog 模板，而是 DialogService + Component 解耦。

[click] 第三到四周企业级整合 ——

definePreset 是 PrimeNG 主题定制的核心 ——
能完整跑通「Aura → 改 primary → 改 surface → 保存为项目 preset → 替换 Aura」工作流的开发者，
已经超过 90% 的同行。

darkModeSelector + signal toggle + tailwindcss-primeui 是「现代项目三件套」——
配齐后，「主题切换 + 暗色 + Tailwind 联动」完全打通。

cssLayer 解决 Tailwind specificity 问题是「项目长期可维护」的根基 ——
不配 cssLayer 的项目最后会变成「! 前缀地狱」。

单独的 PrimeNG 只是「组件库」，要变成「企业后台」需要拼接：
- 路由系统：Angular Router
- 状态管理：NgRx / Akita / signal 原生
- 构建工具：Angular CLI / Nx
- 原子 CSS：Tailwind v4（搭配 tailwindcss-primeui）
- HTTP 客户端：HttpClient
- 校验：Reactive Forms + Validators
- 图表：Chart.js（通过 p-chart 组件）

把这些拼通就是一个完整的「企业级 PrimeNG 前端项目」。

[click] 长期投入 pt + Unstyled + 现代化 ——

项目级 pt 全局配置：
把项目的视觉规范（圆角 / 阴影 / 间距 / 颜色）写到 providePrimeNG 的 pt 配置中，
所有组件自动应用。这是「项目级 design system」的起点。

Unstyled 模式 + Tailwind 重写关键组件：
当 Styled 默认样式无法满足设计时，开 Unstyled 用 Tailwind 完全重写。

Zoneless + signal 现代化迁移：
- v18+ 支持 Zoneless
- 业务全面适配 signal（不再依赖 Zone 自动检测）
- 性能 + bundle 双重提升
- 这是 Angular 未来 5 年的方向

跟进 PrimeTek 是否推出 Volt-Angular ——
PrimeVue 已有 Volt UI（Tailwind v4 衍生库），
PrimeNG 对应版本（如果有）可能在 v22+ 出现。
-->

---
transition: fade-out
---

# 延伸学习资源

官方 + 社区精选

<v-click>

**官方资源** —— [官方文档](https://primeng.org/) / [GitHub 10K+ star](https://github.com/primefaces/primeng) / [StackBlitz 在线编辑](https://primeng.org/) / [Theme Designer 可视化](https://designer.primeng.org/)

</v-click>

<v-click>

**生态项目**

- [tailwindcss-primeui](https://www.npmjs.com/package/tailwindcss-primeui) —— Tailwind 集成
- [@primeuix/themes](https://www.npmjs.com/package/@primeuix/themes) —— 主题包（与 PrimeVue 共享）
- [PrimeBlocks](https://blocks.primeng.org/) 付费 / [sakai-ng](https://github.com/primefaces/sakai-ng) 免费后台模板
- [Prime Locale](https://github.com/primefaces/primelocale) —— 70+ 语言 translation

</v-click>

<v-click>

**配套技术栈** —— Angular Router + signal/NgRx + Angular CLI/Nx + Tailwind v4 黄金组合；RxJS + HttpClient + Reactive Forms；Chart.js（通过 p-chart）；@primeuix/themes + tailwindcss-primeui 主题双引擎。

</v-click>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 官方资源是第一手信息 ——

官方文档 primeng.org 英文为主，中文翻译有限。
每个组件页面都有「Examples」「API」「Theming」「Accessibility」四大块，
建议学习时按顺序看（先 Examples 后 API）。

GitHub 仓库 issues / discussions 区是「问题解答的金矿」——
特别是英文社区资源比中文多 10 倍以上。

StackBlitz 在线编辑是 PrimeNG 文档的杀手锏 ——
每个组件都嵌入了 StackBlitz IDE，
点 Edit on StackBlitz 直接进编辑器改代码看效果。
比 CodeSandbox 加载更快，集成 PrimeNG 模板。

Theme Designer 是 PrimeNG 4.x 推出的可视化主题编辑器 ——
不写代码就能拖拉拽生成 definePreset：
- 选择基础 preset（Aura / Material / Lara / Nora）
- 调整 primary 色板
- 调整 surface 色板
- 调整圆角 / 间距 / 字体
- 一键 export 为 TypeScript 文件，放到项目里直接用

设计师 + 开发者协同利器，与 PrimeVue Theme Designer 是同一个工具（跨框架）。

[click] 生态项目：

@primeuix/themes 是 PrimeTek 跨框架共享的主题包 ——
- PrimeNG / PrimeVue 4 都依赖这个包
- 同一份 definePreset 可以在两个框架直接用
- 这是 Prime 系列的「跨框架红利」

tailwindcss-primeui 是官方 Tailwind 插件，
让 bg-primary / text-surface 等 utility 与 PrimeNG 主题联动。
现代 PrimeNG + Tailwind 项目必装。

PrimeBlocks 是「商业 UI 块库」——
预制了几百个常用 UI 组合（登录页 / 表单 / 仪表板 / 营销页等）。
付费才能用全部，但有限制版免费试用。

sakai-ng 是 PrimeTek 官方维护的「免费开源 Angular 后台模板」——
- Angular + PrimeNG + Tailwind + Angular CLI
- 包含布局 / 路由 / 暗色切换 / 多语言 / 图表 demo
- 是学习「PrimeNG 企业级整合」的最佳样本
- 与 PrimeVue 配套的 sakai-vue 是同一个设计

Prime Locale 提供 70+ 语言 translation 模板 ——
直接复制对应语言的 .ts 文件到自己项目即可。

[click] 配套技术栈：

「Angular Router + signal/NgRx + Angular CLI + Tailwind v4」是 2025-2026 年 Angular 现代项目的事实标准。

RxJS 与 PrimeNG 完美协作 ——
- HttpClient 拿数据
- 配合 p-table lazy load
- 错误处理：catchError + retry

Reactive Forms 配合 PrimeNG 表单组件形成「双向绑定 + 校验」标准。

Chart.js 通过 p-chart 组件集成 ——
- 不需要额外 npm 包（PrimeNG 内置 Chart.js peer dependency）
- 但需要单独 npm install chart.js
- 复杂图表场景考虑 ECharts（更专业）

@primeuix/themes + tailwindcss-primeui = 主题双引擎：
- @primeuix/themes 管 PrimeNG 组件本身的主题
- tailwindcss-primeui 让 Tailwind utility 与上面联动
- 两者协同，主题切换一站式打通
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 🎨

PrimeNG — Most Complete UI Component Library for Angular

<div class="mt-6 text-lg">

**核心心智**

- 4 个内置主题预设（Aura / Material / Lara / Nora）+ definePreset 微调
- 设计 token 三层架构（Primitive / Semantic / Component）现代化
- Styled / Unstyled 双模式 + pt（PassThrough）API 直达 DOM
- 服务 + 模板 + inject 三件套（Message / Confirmation / Dialog）
- Standalone + Zoneless + tailwindcss-primeui + cssLayer 现代化技术栈

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://primeng.org/" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/primefaces/primeng" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://designer.primeng.org/" target="_blank" class="slidev-icon-btn">
    <carbon:color-palette /> Theme Designer
  </a>
</div>

<style>
h1 {
  background-color: #10B981;
  background-image: linear-gradient(45deg, #10B981 10%, #EF4444 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：PrimeNG = PrimeTek 出品 Angular UI 库 + 80+ 组件 + 4 主题预设 + Styled/Unstyled 双模式 + Standalone-first。

核心心智五条：
1. PrimeTek 跨框架战略：与 PrimeVue / PrimeReact 共享设计语言 + @primeuix/themes
2. 4 个主题预设 + definePreset：不写 SCSS 就能切换 4 套设计语言
3. 设计 token 三层架构（Primitive / Semantic / Component）：现代化主题
4. Styled / Unstyled 双模式 + pt API：定制深度无人能及
5. Standalone + Zoneless + signal：完全拥抱 Angular 现代实践

适合什么团队？
- Angular + 国际化项目 / 国外团队
- 跨框架团队（已用 PrimeReact / PrimeVue）
- 组件需求复杂（PickList / OrderList / Editor / Galleria）
- 多主题切换需求（节日 / 多租户）
- Tailwind 用户

进阶建议：
- 第一步：providePrimeNG + 5 个基础组件
- 第二步：MessageService / ConfirmationService / DialogService 三件套
- 第三步：Reactive Forms + Table 完整方案
- 第四步：主题定制（definePreset + tailwindcss-primeui + cssLayer）
- 第五步：Standalone + Zoneless + signal 现代化
- 第六步：sakai-ng 企业级整合参考

PrimeTek 跨框架红利 + 4 主题预设 + 设计 token 现代化 ——
PrimeNG 在 2026 年仍是「Angular + 国际化项目 / 跨框架团队」的事实标准选择。

感谢观看！🎨
-->
