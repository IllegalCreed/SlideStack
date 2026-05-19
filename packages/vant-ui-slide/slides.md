---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Vant UI
info: |
  Presentation Vant UI 4 for Vue 3 mobile developers.

  Learn more at [https://vant-ui.github.io/vant/](https://vant-ui.github.io/vant/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📱</span>
</div>

<br/>

## Vant — Vue Mobile UI Library by Youzan

80+ 移动端组件，由有赞前端团队出品，国内 Vue 移动端开发的事实标准（当前主线 v4.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Vant —— Vue 移动端 UI 组件库的事实标准，由有赞（Youzan）前端团队出品。

诞生于 2017 年，伴随有赞商城业务自研，2018 年开源，
经历 v1.x / v2.x（Vue 2）→ v3.x → v4.x（Vue 3 + TypeScript 重写）三大阶段，
当前主线 v4.x 完全适配 Vue 3 + TypeScript + Composition API。

核心卖点：80+ 高质量移动端组件、原生 TypeScript、Tree Shaking、
自定义主题（CSS Variables + Less Variables）、暗色模式、SSR 支持、30+ 语言 i18n、
零三方依赖、组件平均 ~1KB（min+gzip），以及国内最完整的移动端中文社区。
-->

---
transition: fade-out
---

# 什么是 Vant？

为 Vue 移动端应用提供企业级 UI 组件库的国内首选

<v-click>

- **80+ 组件**：基础 / 表单 / 反馈 / 展示 / 导航 / 业务等多大分组
- **轻量化**：组件平均 ~1KB（min+gzip），零第三方依赖
- **TypeScript 优先**：全量类型声明，Volar 智能提示开箱即用
- **自定义主题**：CSS Variables 运行时 + Less Variables 编译期双层方案
- **暗色模式**：内置 ConfigProvider theme="dark" 一键切换
- **国际化**：30+ 语言 locale + Locale.use 切换
- **SSR 友好**：官方 Nuxt 集成 + 完整 SSR 测试覆盖
- **生态成熟**：vant-weapp / react-vant / vant-demo 多端同源

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Vant Design_](https://vant-ui.github.io/vant/#/zh-CN/home)

</div>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vant 的核心定位「Vue 移动端 UI 的国内首选」非常清晰：

- 80+ 组件覆盖移动端绝大多数场景：基础布局、表单输入、Picker 选择器、反馈通知、导航菜单……
- 轻量是 Vant 引以为豪的卖点 —— 单个组件 min+gzip 约 1KB，零三方依赖（不像 Element Plus 依赖 lodash / dayjs）
- TypeScript 原生支持，每个组件都有完整 Props / Emits / Slots 类型
- 主题系统双层：CSS Variables 运行时换肤 + Less Variables 编译期定制
- 暗色模式内置 —— ConfigProvider theme="dark" 一行启用
- i18n 30+ 语言 locale，Locale.use 动态切换
- SSR 官方支持，配合 Nuxt 3 模块开箱即用
- 多端生态：Vant Weapp（微信小程序）/ React Vant（React 移植）/ Vant CLI（组件库构建工具）

下面按「定位 → 安装 → 第一个组件 → 核心场景（表单/Picker/反馈/导航）→ 主题 → 暗色 → i18n → 适配 → 桌面端 → 对比 → 踩坑」顺序讲透。
-->

---
transition: fade-out
---

# Vant 的定位与生态

为什么国内 Vue 移动端几乎人手一份？

<v-click>

| 维度          | Vant 4           | NutUI 4          | Mint UI         | Vuetify (mobile) | Quasar           |
| ------------- | ---------------- | ---------------- | --------------- | ---------------- | ---------------- |
| 框架绑定      | **Vue 3**        | Vue 3            | Vue 2           | Vue 3            | Vue 3            |
| 目标场景      | **移动端**       | 移动端           | 移动端          | 全端 Material    | 全端跨平台       |
| 组件数量      | **80+**          | 90+              | 30+             | 80+              | 70+              |
| 包体积        | **极小（1KB/组件）**| 小            | 小              | 偏大             | 中               |
| TypeScript    | **原生**         | 原生             | 弱              | 原生             | 原生             |
| 主题方案      | CSS Vars + Less  | SCSS Vars        | LESS Vars       | SCSS Theme       | SCSS + Quasar UI |
| 暗色模式      | **内置**         | 内置             | 无              | 内置             | 内置             |
| 国际化        | 30+ 语言         | 中文为主         | 中文为主        | 50+ 语言         | 50+ 语言         |
| 主导团队      | **有赞**         | **京东**         | 饿了么          | Vuetify 团队     | Quasar 团队      |
| 中国生态      | **极强**         | 强               | 弱（已停滞）    | 一般             | 一般             |
| 大版本风险    | 低（v4 长期）    | 低               | 已停止维护      | 中               | 低               |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Mobile UI Comparisons_](https://vant-ui.github.io/vant/#/zh-CN/home)

</div>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比国内主流移动端 UI 库，Vant 的护城河是「轻量 + 生态 + 稳定」：

- 包体积极致优化 —— 单组件平均 1KB（min+gzip），零三方依赖，整体 bundle 极小
- 80+ 组件刚好覆盖移动 H5 / 小程序 webview / Hybrid 场景的 95% 需求
- 组件设计专为移动端优化 —— 触摸交互、手势支持、屏幕适配等都是默认行为
- 中文生态最强 —— 文档、issue、社区博客几乎清一色都有
- v4 自 2022 年发布至今稳定迭代，企业选型最看重的「稳定性」

对比 NutUI（京东）：组件更多、设计更现代，但社区资源稍逊
对比 Mint UI：饿了么 Vue 2 时代产物，已停止维护，新项目不要用
对比 Vuetify mobile：Material Design 偏 PWA 风格，原生移动感稍弱
对比 Quasar：跨平台框架，包含构建工具链，更重但适合 hybrid

选型逻辑：国内移动 H5 默认 Vant，跨端 PWA / Hybrid 再看 Quasar / Ionic。
-->

---
transition: fade-out
---

# Vant 演进史

为什么 v4 完全为 Vue 3 重写？

<v-click>

| 版本             | 时间    | 关键事件                                                       |
| ---------------- | ------- | -------------------------------------------------------------- |
| Vant 1.x         | 2017    | 有赞内部 zanui-vue 重命名开源，配 Vue 2                        |
| Vant 2.x         | 2019    | 配 Vue 2，国内移动端事实标准，GitHub 20K+ star                 |
| **Vant 3.x**     | 2020.12 | 基于 Vue 3 + TypeScript 重写，Composition API 实现             |
| **Vant 4.x**     | 2022.12 | 默认 ES Modules、Less → CSS Vars 全量、Tree Shaking 完善       |
| Vant 4.5+        | 2023+   | 持续迭代，类型推导加强、SSR 优化、Nuxt 模块完善                |

</v-click>

<v-click>

文档主线长期标记为「v4」，npm 包 `vant` 默认对应 v4.x —— v3 已不再迭代，旧项目继续用 v2.x。

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vant 的版本演进非常清晰 ——

Vant 1.x / 2.x 基于 Vue 2，2017 年开源至今十年长期维护。
2020 年 Vue 3 发布后，团队意识到 Composition API + TypeScript 需要重写才能充分发挥，
于是 Vant 3 立项 —— 从零用 TypeScript + setup 写法重新实现 60+ 组件。

2022 年 Vant 4 发布，做了几件大事：
- 默认 ES Modules（去掉 CommonJS）
- 样式系统从 Less Variables 迁移到 CSS Variables（运行时主题切换）
- Tree Shaking 完善，单组件 bundle 进一步缩小
- TypeScript 类型推导加强（特别是 Picker / Form 等复杂组件）

为什么不直接升级 v2？因为：
- Vue 3 Composition API 让组件内部组织方式完全变了
- TypeScript 优先需要重新设计所有类型
- Tree-shaking 友好需要重写为独立 ES Module
- 强行升级会带来无数 break change

[click] Vant 4 自 2022 年发布至今没有大版本变动 ——
这种稳定性是企业选型最看重的。
v2.x 继续维护安全补丁，旧 Vue 2 项目可以放心继续用。
-->

---
transition: fade-out
---

# Vant 的核心理念

四条设计原则贯穿全部组件 API

<v-click>

**1. Mobile First（移动优先）**

每个组件都为触屏 + 单手操作设计 —— 按钮足够大、滑动顺滑、表单字段一屏可填，从不强行套用桌面端 UX。

</v-click>

<v-click>

**2. Lightweight（轻量化）**

单组件 ~1KB、零第三方依赖、按需引入 —— 不为「一个 Toast」拖进 100KB lodash。

</v-click>

<v-click>

**3. Touchable（触摸友好）**

手势识别、滑动回弹、长按、双指缩放 —— 移动端独有交互全部原生支持，无需第三方手势库。

</v-click>

<v-click>

**4. Customizable（可定制）**

CSS Variables + Less Variables 双层主题、ConfigProvider 全局配置、slot 任意改造 —— 适配各种品牌设计语言。

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Mobile First 是 Vant 的灵魂 ——
从颗粒到细节都为「单手 + 拇指」操作设计：
按钮高度默认 44px（iOS 触摸建议值），Cell 单行高度 44px，
Picker 滚轮 Item 高度 44px，Tabbar 高度 50px，
所有交互区域都满足 iOS / Material Design 的「可触摸最小尺寸」。

这一点 Element Plus 等桌面 UI 无法满足 —— 桌面端 Button 32-36px 在移动端太小，
用户经常误触。Vant 把这些规范固化到组件默认值里，开箱即可用。

[click] 轻量化是 Vant 的技术追求 ——
零第三方依赖，意味着不依赖 lodash / dayjs / async-validator 等大库，
单组件 bundle 极小。
对比 Element Plus（依赖 lodash + dayjs + async-validator）按需引入后约 50-150 KB，
Vant 按需引入后通常 20-60 KB，移动端弱网环境差距巨大。

[click] 触摸友好体现在「移动端独有交互」全部内置 ——
PullRefresh（下拉刷新）、SwipeCell（滑动删除）、Picker（滚轮选择）、
ImagePreview（双指缩放）、Touch（手势识别）等组件都基于原生 touchstart / touchmove 实现，
不依赖 hammer.js / interact.js 等第三方手势库。

[click] 可定制覆盖了三个层级：
- CSS Variables（运行时）：暗色 / 多租户场景
- Less Variables（编译期）：固定品牌色
- ConfigProvider（全局配置）：i18n / 主题 / 命名空间

加上每个组件丰富的 slot，几乎能实现任何 UI 设计稿。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与初始化

5 分钟接入任意 Vue 3 移动项目

::left::

<v-click>

**安装**

```bash
pnpm add vant
# 或
npm install vant
```

| 版本   | Vue 兼容  | 状态                 |
| ------ | --------- | -------------------- |
| v4.x   | Vue 3.2+  | **当前主线**         |
| v3.x   | Vue 3.0+  | 旧版（不再迭代）     |
| v2.x   | Vue 2     | 仅维护安全补丁       |

</v-click>

::right::

<v-click>

**全量引入（入口配置）**

```ts
import { createApp } from "vue";
import Vant from "vant";
import "vant/lib/index.css";
import App from "./App.vue";

const app = createApp(App);
app.use(Vant);
app.mount("#app");
```

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vant 安装一行命令，没有可选 peer dependency。
v4.x 是 Vue 3 项目当前主线。Vue 2 项目继续用 v2.x（同包名 vant 但 npm install vant@2）。

注意：v3 已不再迭代，新项目直接用 v4。
v2 与 v4 是不同代码库（v2 在 vant-weapp 仓库下维护），不能并存。

[click] 全量引入是最简单的方式 —— 一次 use 注册全部组件，
适合「PoC / 小型项目 / Demo 验证」的场景。

代价：全部 80+ 组件都进 bundle，gzipped 后约 ~80 KB。
中大型项目建议按需引入（下一页），按实际使用约 ~20-60 KB。

Vue 移动 H5 项目里全量引入也勉强可接受 ——
因为 Vant 本身极轻，全量也只比按需大 ~30 KB 左右。
-->

---
transition: fade-out
---

# 按需引入：VantResolver 自动注册

中大型项目推荐配置，零样式手写 import

<v-click>

**1. 安装 unplugin 依赖**

```bash
pnpm add -D unplugin-vue-components @vant/auto-import-resolver
```

</v-click>

<v-click>

**2. 配置 vite.config.ts**

```ts
import { defineConfig } from "vite";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "@vant/auto-import-resolver";

export default defineConfig({
  plugins: [
    Components({ resolvers: [VantResolver()] }),
  ],
});
```

</v-click>

<v-click>

> 💡 **效果**：模板里直接写 `<van-button>`，组件 + 样式自动 import；脚本里调函数式 API（showToast / showDialog）需要手动 import。

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 按需引入的核心是一个 unplugin + VantResolver：
- `unplugin-vue-components` 扫描模板，自动 import 用到的组件
- `@vant/auto-import-resolver` 告诉 unplugin「遇到 `<van-xxx>` 就去 vant 包里找对应组件 + 样式」

[click] vite.config.ts 配 VantResolver 是关键 ——
它解决了「组件 + 样式必须配对引入」的问题：
传统手写要 `import { Button } from 'vant'` + `import 'vant/es/button/style'` 两行，
VantResolver 直接帮你自动处理。

[click] 实际开发体验：
模板里写 `<van-button>按钮</van-button>` —— 不用手动 import + 样式
模板里写 `<van-cell-group><van-cell title="..." /></van-cell-group>` —— 多个组件全自动

但函数式 API（showToast / showDialog / showNotify / showLoadingToast）需要手动 import：
`import { showToast } from 'vant'`
这是 Vant 4 的设计选择 —— 函数式 API 不依赖模板编译，无法被 unplugin-vue-components 扫描。

bundle 大小从全量 ~80 KB 降到按需 ~20-60 KB。
-->

---
transition: fade-out
---

# 第一个组件：Button

熟悉的味道，移动端原生触摸体验

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
  <van-button type="primary" :loading="loading" @click="handleSubmit">
    提交订单
  </van-button>
  <van-button type="success">成功</van-button>
  <van-button type="warning" plain>警告</van-button>
  <van-button type="danger" round>危险</van-button>
  <van-button icon="plus" type="primary" />
</template>
```

</v-click>

<v-click>

| Prop      | 取值                                   | 说明           |
| --------- | -------------------------------------- | -------------- |
| `type`    | primary / success / warning / danger / default | 颜色语义 |
| `size`    | large / normal / small / mini          | 四档尺寸       |
| `plain` `round` `square` | boolean              | 形态变体       |
| `loading` `disabled`     | boolean              | 状态           |
| `icon`    | 内置图标名 / 图片 URL                  | 前置图标       |

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] van-button 是 Vant 最简单也最常用的组件 ——
type / size / plain / loading 几条属性就覆盖了 90% 场景。

注意 loading 是 boolean prop，可直接绑响应式 ref ——
提交期间按钮自动禁用 + 显示 loading spinner，无需手动控制 disabled。

icon 是一个字符串，可以是 Vant 内置图标名（"plus"、"close"、"arrow"）
或者直接传图片 URL（"https://xxx/icon.png"）。
内置图标共 350+，足够覆盖移动端场景。

[click] type 的五个语义值对应组件库的颜色系统：
- primary：主操作（蓝色，#1989FA）
- success：积极反馈（绿色，#07c160 微信支付绿）
- warning：提示（橙色，#ff976a）
- danger：危险操作（红色，#ee0a24 有赞红）
- default：中性（灰色）

这套 type 在 Toast / Notify / Tag 等组件共享，认知成本极低。

size 四档（large / normal / small / mini）满足列表 / 表单 / 操作栏不同场景。
plain（朴素）/ round（圆角）/ square（方角）三种形态变体覆盖移动端 UI 需求。
-->

---
transition: fade-out
---

# 80+ 组件分组速览

按使用场景组织，记住分组即可快速定位

<v-click>

| 分组           | 代表组件                                                     |
| -------------- | ------------------------------------------------------------ |
| **基础**       | Button / Cell / Icon / Image / Layout / Popup / Style / Toast |
| **表单**       | Form / Field / Checkbox / Radio / Switch / Slider / Stepper / Uploader |
| **反馈**       | ActionSheet / Dialog / Notify / Loading / Overlay / PullRefresh / SwipeCell |
| **展示**       | Badge / Card / Collapse / CountDown / Divider / ImagePreview / Lazyload / List / Tag |
| **导航**       | Grid / IndexBar / NavBar / Pagination / Sidebar / Tab / Tabbar / TreeSelect |
| **业务**       | AddressEdit / AddressList / Area / Card / ContactCard / Coupon / Sku |
| **Picker 系列**| Picker / DatePicker / TimePicker / Calendar / Cascader / Search |

</v-click>

<v-click text-xs class="mt-4">

> 💡 **设计原则**：基础组件（Button / Cell）API 极简，业务组件（AddressEdit / Sku）开箱即用电商场景。

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 80+ 组件听起来多，但按分组记忆很容易上手 ——

基础组件：原子布局元素，几乎每个页面都用（Button / Cell / Icon）
表单组件：Form + Field 是核心，Picker / Stepper / Uploader 适配移动端输入
反馈组件：移动端反馈三剑客（Toast / Dialog / Notify）+ 弹层（Popup / ActionSheet / Overlay）
展示组件：列表（List + PullRefresh）、卡片、徽标、图片预览等
导航组件：Tab / Tabbar / NavBar 三件套构成移动 H5 骨架
业务组件：电商场景预制（AddressEdit 地址编辑 / Sku 规格选择 / Coupon 优惠券）—— 有赞业务沉淀

Picker 系列：移动端独有的滚轮选择交互，6 个组件覆盖时间 / 日期 / 地区 / 联级 / 搜索建议

[click] 设计原则上有个有趣对比：
基础组件 API 极简（Button 5 个核心 prop 就够用），
业务组件功能完整开箱即用（AddressEdit 直接出地址输入页面 UI）。

这种「按业务沉淀深度分层」是 Vant 与其他 UI 库的最大区别 ——
其它库可能要你拼装 5-6 个基础组件做地址编辑，
Vant 一个 `<van-address-edit>` 解决。

业务组件来源于有赞商城的真实场景沉淀，从电商业务里抽象出来的最佳实践。
-->

---
transition: fade-out
---

# Form 深度（一）：基础结构

van-form + van-field + rules

<v-click>

```vue
<script setup lang="ts">
import { ref } from "vue";
import { showToast } from "vant";

const username = ref("");
const password = ref("");

async function onSubmit(values: Record<string, any>) {
  showToast(`提交成功，用户名 ${values.username}`);
}

async function onFailed(errorInfo: any) {
  showToast({ message: "请填写完整信息", type: "fail" });
  console.warn("校验失败", errorInfo);
}
</script>

<template>
  <van-form @submit="onSubmit" @failed="onFailed">
    <van-cell-group inset>
      <van-field
        v-model="username"
        name="username"
        label="用户名"
        placeholder="请输入用户名"
        :rules="[{ required: true, message: '用户名必填' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="请输入密码"
        :rules="[{ required: true, message: '密码必填' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button block type="primary" native-type="submit">登录</van-button>
    </div>
  </van-form>
</template>
```

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] van-form 是 Vant 移动端表单的核心 —— 比 Element Plus 的 ElForm 设计更轻量。

三个关键概念：
- van-form：表单容器，监听 submit / failed 事件
- van-field：表单项（自带 label + 输入框 + 错误提示）
- rules：校验规则（在 field 上声明）

注意：Vant 的 form 没有 model 概念 ——
每个 field 用 v-model 独立绑值，submit 时自动收集为 values 对象（按 name 字段命名）。

这是「为移动端简化」的设计 ——
Element Plus 用 :model 集中管理，Vant 让 field 自治。
小表单更轻量，大表单可以包一个 reactive 对象统一管理。

van-cell-group inset 让表单区块带圆角 + 边距 —— 这是 iOS 风格的「分组列表」效果。
native-type="submit" 让 button 触发 form 的 submit 事件。

@submit 触发时间：校验全部通过后
@failed 触发时间：任何 field 校验失败时
-->

---
transition: fade-out
---

# Form 深度（二）：高级校验

异步校验 + 自定义校验函数

<v-click>

**自定义同步校验**

```ts
const usernameRules = [
  { required: true, message: "用户名必填" },
  { pattern: /^\w{3,16}$/, message: "用户名须 3-16 位字母数字" },
  {
    validator: (value: string) => !value.includes(" "),
    message: "用户名不能包含空格",
  },
];
```

</v-click>

<v-click>

**异步校验（Promise）**

```ts
const usernameAsyncRules = [
  {
    required: true,
    message: "用户名必填",
  },
  {
    validator: async (value: string) => {
      const exists = await api.checkUserName(value);
      return !exists;
    },
    message: "用户名已被占用",
  },
];
```

</v-click>

<v-click>

**手动 validate（不依赖 submit）**

```ts
import type { FormInstance } from "vant";

const formRef = ref<FormInstance>();

async function manualValidate() {
  try {
    await formRef.value?.validate();
    showToast("校验通过");
  } catch (errors) {
    console.warn(errors);
  }
}
```

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 同步校验规则三种写法：
- required: true —— 必填
- pattern: /正则/ —— 模式匹配
- validator: (value) => boolean —— 自定义函数返回布尔值

每条规则可独立配 message，校验失败时显示该提示文字。
多条规则顺序执行，遇到失败立即返回（不会继续校验后续规则）。

[click] 异步校验非常实用 —— 检查用户名占用、手机号注册等场景。
validator 函数返回 Promise，resolve 一个 boolean：
- true：校验通过
- false：校验失败（显示 message）

Vant 的异步校验比 Element Plus 的 callback 风格更现代 ——
不需要 (rule, value, callback) 三参数，直接 async (value) => boolean。

[click] 手动 validate 适合「不通过 submit 提交」的场景 ——
比如分步表单（Step 1 校验完跳 Step 2）、保存草稿（不强制完整）等。

FormInstance 类型从 vant 包导出，配合 ref<FormInstance>() 拿到表单实例。
validate() 返回 Promise，resolve 表示通过，reject 一个 errors 对象表示失败。

trigger 三种：onChange（改值时）/ onBlur（失焦时）/ onSubmit（提交时，默认）。
移动端推荐 onBlur + onSubmit 组合，避免输入过程频繁红框。
-->

---
transition: fade-out
---

# Picker 系列：移动端独有交互

滚轮选择是移动端 UX 的灵魂

<v-click>

**单列选择 Picker**

```vue
<script setup lang="ts">
import { ref } from "vue";

const columns = [
  { text: "杭州", value: "Hangzhou" },
  { text: "宁波", value: "Ningbo" },
  { text: "温州", value: "Wenzhou" },
];
const selected = ref("Hangzhou");

function onConfirm({ selectedValues }: any) {
  selected.value = selectedValues[0];
}
</script>

<template>
  <van-picker
    :columns="columns"
    :model-value="[selected]"
    @confirm="onConfirm"
  />
</template>
```

</v-click>

<v-click>

**日期选择 DatePicker**

```vue
<van-date-picker
  v-model="currentDate"
  title="选择日期"
  :min-date="new Date(2020, 0, 1)"
  :max-date="new Date(2030, 11, 31)"
  @confirm="onDateConfirm"
/>
```

</v-click>

<v-click>

**时间选择 TimePicker**

```vue
<van-time-picker
  v-model="currentTime"
  title="选择时间"
  :columns-type="['hour', 'minute']"
  @confirm="onTimeConfirm"
/>
```

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Picker 是 Vant 的招牌组件之一 —— 移动端独有的「滚轮选择」交互，
桌面端 select 在移动端体验差（下拉列表占满屏幕），滚轮反而符合移动单手操作直觉。

columns 接收数组，每项是 { text, value } 对象：
- text：显示文字
- value：实际值

model-value 是当前选中值的数组（多列时数组多个值）。
confirm 事件回调收到 { selectedValues, selectedOptions } —— 推荐 selectedValues 拿值。

[click] DatePicker 是 Picker 的预制版本 —— 三列滚轮（年 / 月 / 日）。
min-date / max-date 限制选择范围，超出范围灰显不可选。

也支持 columns-type 自定义列：
['year']：只选年
['year', 'month']：年月
['year', 'month', 'day']：年月日（默认）

[click] TimePicker 同理 —— 默认两列（时 / 分），也可配 columns-type 加入秒。

Vant 还有：
- Cascader（联级选择，多层下拉）
- Area（省市区联动选择，预置 3000+ 中国行政区数据）
- Search（搜索框 + 历史 + 联想）

这套 Picker 全家桶覆盖了移动端 90% 的「选择类」交互需求。
-->

---
transition: fade-out
---

# List + PullRefresh：无限滚动 + 下拉刷新

移动端列表的事实标准组合

<v-click>

```vue
<script setup lang="ts">
import { ref } from "vue";

const list = ref<number[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

async function onLoad() {
  const newItems = await api.fetchList({ offset: list.value.length, limit: 10 });
  list.value.push(...newItems);
  loading.value = false;
  if (newItems.length < 10) finished.value = true;
}

async function onRefresh() {
  list.value = [];
  finished.value = false;
  await onLoad();
  refreshing.value = false;
}
</script>

<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item" :title="`商品 ${item}`" />
    </van-list>
  </van-pull-refresh>
</template>
```

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] List + PullRefresh 是移动端最经典的组合：
- van-pull-refresh：下拉触发刷新（顶部「松开刷新」提示 + 回弹动画）
- van-list：滚动到底部触发加载更多（自动监听滚动）

四个核心状态：
- loading：当前是否正在加载（true 时不重复触发 onLoad）
- finished：是否已加载全部（true 后停止触发 onLoad）
- refreshing：是否正在下拉刷新
- 数据数组（list）：实际渲染的数据

onLoad 触发条件：列表底部进入可视区 + loading=false + finished=false。
框架自动管理 loading 状态 —— 调 setTimeout(load, 0) 异步加载，结束后设 loading=false。

刷新逻辑：清空 list + 重置 finished + 调 onLoad —— 注意要重置 finished，
否则上次 finished=true 后 onLoad 不再触发。

这套模式覆盖了移动端 80% 的列表场景：商品列表、消息列表、订单列表、动态流……
状态管理简单到「会 useState 就会用」。

对比 IntersectionObserver 手写 + RAF 节流的传统实现，Vant 把这些封装成 4 个 ref + 2 个事件回调，
开发者只关注业务逻辑（怎么请求、怎么处理结果）。
-->

---
transition: fade-out
---

# 反馈组件三件套

Toast / Dialog / Notify 函数式调用

<v-click>

**Toast（轻提示，居中短暂显示）**

```ts
import { showToast, showSuccessToast, showFailToast, showLoadingToast } from "vant";

showToast("保存成功");
showSuccessToast("操作成功");
showFailToast("网络异常");
showLoadingToast({ message: "加载中...", forbidClick: true });
```

</v-click>

<v-click>

**Dialog（模态对话框）**

```ts
import { showDialog, showConfirmDialog } from "vant";

await showDialog({ title: "提示", message: "确认要删除吗？" });

try {
  await showConfirmDialog({
    title: "危险操作",
    message: "删除后不可恢复",
    confirmButtonText: "删除",
    confirmButtonColor: "#ee0a24",
  });
  await api.delete(id);
  showSuccessToast("已删除");
} catch {
  // 用户取消
}
```

</v-click>

<v-click>

**Notify（顶部通知条）**

```ts
import { showNotify } from "vant";

showNotify({ type: "primary", message: "您有 3 条新待办" });
showNotify({ type: "success", message: "提交成功", duration: 2000 });
```

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Toast 是「最轻量」的反馈 —— 屏幕居中、2 秒自动消失、不阻断操作。
适合移动端「保存成功 / 复制成功 / 网络异常」这种瞬时反馈。

Vant 4 把 Toast 拆成 4 个具名函数（v3 是 Toast.success 风格）：
- showToast：基础调用
- showSuccessToast：带 ✓ 图标
- showFailToast：带 ✗ 图标
- showLoadingToast：带 loading spinner（常用于异步操作）

forbidClick: true 让 toast 期间禁止点击，配合 showLoadingToast 防止用户重复提交。

[click] Dialog 是「最重」的反馈 —— 模态遮罩 + 必须点确认 / 取消才能关闭。
两个版本：
- showDialog：单按钮（确认）
- showConfirmDialog：双按钮（确认 + 取消）

都返回 Promise，confirm resolve、cancel reject —— 用 try/catch 处理。
confirmButtonColor 直接传 hex 值定制按钮颜色（危险操作常用红色）。

危险操作必用！删除、批量操作、不可逆变更 —— 没有确认等于挖坑。

[click] Notify 是「中等」反馈 —— 顶部横条、3 秒自动消失。
type 四种：primary（蓝）/ success（绿）/ warning（橙）/ danger（红）。
比 Toast 更醒目，比 Dialog 更轻量，适合「非紧急但需要用户注意」的提示。

设计原则：紧急度从低到高 → Toast → Notify → Dialog，按场景选。

Vant 4 全部 API 改成 show* 前缀的函数式调用（v3 是 Class.method 风格），
更符合 Composition API 心智，也更容易 tree-shake。
-->

---
transition: fade-out
---

# 导航三件套

NavBar / Tab / Tabbar 构建移动 H5 骨架

<v-click>

**NavBar（顶部导航栏）**

```vue
<van-nav-bar
  title="商品详情"
  left-text="返回"
  left-arrow
  @click-left="$router.back()"
>
  <template #right>
    <van-icon name="share" size="18" />
  </template>
</van-nav-bar>
```

</v-click>

<v-click>

**Tab（横向选项卡）**

```vue
<van-tabs v-model:active="active" sticky>
  <van-tab title="全部"><div>所有订单</div></van-tab>
  <van-tab title="待付款"><div>未付款订单</div></van-tab>
  <van-tab title="已发货"><div>配送中订单</div></van-tab>
  <van-tab title="已完成"><div>历史订单</div></van-tab>
</van-tabs>
```

</v-click>

<v-click>

**Tabbar（底部导航栏，多页应用核心）**

```vue
<van-tabbar v-model="active" route>
  <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
  <van-tabbar-item to="/cart" icon="cart-o" :badge="cartCount">购物车</van-tabbar-item>
  <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
</van-tabbar>
```

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NavBar 是顶部导航栏 —— title 标题、left-arrow 左侧返回箭头、right slot 右侧操作。
配合 @click-left 监听返回点击，通常调 router.back()。

iOS 风格惯例：左侧返回 + 中间标题 + 右侧操作（分享 / 更多 / 帮助）。
sticky 不是 NavBar 的属性，移动端 NavBar 通常配合 fixed: true 固定在顶部。

[click] Tab 是横向选项卡 ——
- v-model:active 绑定当前选中的 tab 索引（或 name）
- sticky 让 tab 滚动时吸顶（移动端列表分类常用）
- 每个 van-tab 一个 title 属性 + 默认 slot 放内容

支持 swipeable 滑动切换（手指左右滑动）、ellipsis 文字溢出省略号。

[click] Tabbar 是底部导航栏 —— 移动 H5 多页应用的核心。

route 模式：tabbar-item 上加 to="/path"，点击直接路由跳转（配合 vue-router）。
非 route 模式：v-model 控制 active，自己监听 change 切换。

badge 在右上角显示数字徽标（购物车数量、未读消息数）。
icon 支持 200+ 内置图标名（home-o、cart-o、user-o 都是描边版本，常用于未选中状态）。

这三个组件搭配出 90% 移动 H5 的页面骨架：
顶部 NavBar + 中间 Tab（可选） + 底部 Tabbar，
中间区域加 PullRefresh + List 就是最经典的「列表型」H5 页面。
-->

---
transition: fade-out
---

# 主题定制（一）：CSS 变量

运行时动态切换，无需重新编译

<v-click>

**全局覆盖**

```css
:root {
  --van-primary-color: #ff6b35;
  --van-success-color: #28a745;
  --van-border-radius-md: 6px;
  --van-button-default-height: 44px;
}
```

</v-click>

<v-click>

**JS 动态修改（运行时切换）**

```ts
function applyTheme(primary: string) {
  document.documentElement.style.setProperty("--van-primary-color", primary);
}

applyTheme("#ff6b35");   // 立即生效，无需刷新
```

</v-click>

<v-click>

**ConfigProvider 局部主题**

```vue
<van-config-provider :theme-vars="themeVars">
  <van-button type="primary">局部橙色</van-button>
</van-config-provider>

<script setup>
const themeVars = {
  primaryColor: "#ff6b35",
  borderRadiusMd: "6px",
};
</script>
```

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] CSS 变量是 Vant 4 的「第一层」主题机制 ——
v4 把所有内置变量从 Less 迁移到 CSS Variables（v3 还是 Less），
意味着主题切换不需要任何编译过程。

所有组件内部都通过 var(--van-xxx) 读取颜色 / 间距 / 字体等设计 token，
覆盖这些变量就能立刻生效。

变量命名规则：`--van-{category}-{name}-{variant}`
- --van-primary-color：主色
- --van-success-color：成功色
- --van-button-default-height：按钮默认高度
- --van-border-radius-md：中等圆角

完整变量列表见 vant/lib/index.css 或文档 https://vant-ui.github.io/vant/#/zh-CN/config-provider

[click] JS 动态修改是「多主题切换」的核心 ——
读用户偏好 → 调 setProperty → 全站立即切换。
不需要刷新、不需要重载样式表、不需要任何额外打包。

也可以多主题 class 切换：在 :root.theme-orange { --van-primary-color: #ff6b35 } 写多套，
切换时改 documentElement.className 即可。

[click] ConfigProvider 是「局部主题」的优雅方案 ——
:theme-vars 接 JS 对象（camelCase 命名，框架自动转 CSS vars 命名）。
作用域仅 ConfigProvider 内部，外部不受影响。

适合：
- 同一页面内某个区块用不同品牌色（多租户场景）
- 弹层 / 抽屉用独立主题
- 配合 :theme="dark" 实现暗色

注意：themeVars 的 key 是 camelCase（primaryColor），
对应的 CSS 变量是 kebab-case（--van-primary-color）。
-->

---
transition: fade-out
---

# 主题定制（二）：Less 变量

编译期定制，配合按需引入

<v-click>

**1. 创建主题入口 `styles/vant-theme.less`**

```less
// 覆盖 Vant 默认 Less 变量
@blue: #ff6b35;
@green: #28a745;
@border-radius-md: 6px;
@button-default-height: 44px;
```

</v-click>

<v-click>

**2. 在 vite.config.ts 注入到所有 Less**

```ts
import { defineConfig } from "vite";

export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import "${path.resolve(__dirname, "src/styles/vant-theme.less")}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
});
```

</v-click>

<v-click>

> 💡 **要点**：Vant 4 默认 CSS Vars 主题，Less Vars 主要用于「编译期固化品牌色」场景；通常 CSS Vars 已够用。

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Less 变量是 Vant 的「第二层」主题机制 ——
适合「一套主题一次编译」的场景：公司品牌色长期稳定，不需要运行时切换。

主题入口文件用 Less `@变量名: 值` 语法覆盖默认值。
Vant 内置的 Less 变量见 vant/lib/styles/var.less 文件。

注意 Vant 用 `@blue` / `@green` / `@red` 等颜色变量（不是 @primary-color），
因为 Vant 设计语言里这些颜色直接对应 type="primary" / "success" / "danger"。

[click] vite.config.ts 配置 modifyVars 是 Vant + Less 的传统组合：
- modifyVars.hack 是个 hack 技巧 —— Less 不支持 modifyVars 引入文件，
  所以用 hack 字段把 @import 语句包装成「定义变量 + 引入文件」的组合
- javascriptEnabled: true 让 Less 支持 JS 表达式（Vant 内部用到）

按需引入时还需要 VantResolver 配 importStyle: 'less'：
```ts
Components({ resolvers: [VantResolver({ importStyle: 'less' })] })
```
否则 resolver 默认引入 css（绕过 Less 编译），覆盖不生效。

[click] 选型逻辑：
- 一套主题长期使用 → Less Vars（编译期 token 最优、bundle 最小）
- 暗色 / 多租户 / 用户自定义 → CSS Vars（运行时切换）
- 混用最佳实践：Less Vars 定义基线 token，CSS Vars 覆盖暗色 / 用户偏好

Vant 4 推荐优先用 CSS Vars —— 90% 场景够用，Less Vars 是历史包袱兼容方案。
-->

---
transition: fade-out
---

# 暗色模式：ConfigProvider theme="dark"

一行代码切换全站暗色

<v-click>

**全局暗色（ConfigProvider 包裹）**

```vue
<script setup lang="ts">
import { useDark } from "@vueuse/core";

const isDark = useDark();
</script>

<template>
  <van-config-provider :theme="isDark ? 'dark' : 'light'">
    <router-view />
  </van-config-provider>
</template>
```

</v-click>

<v-click>

**切换按钮（VueUse 协同）**

```vue
<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();              // 自动同步 html.dark + localStorage
const toggleDark = useToggle(isDark);
</script>

<template>
  <van-switch
    :model-value="isDark"
    @update:model-value="toggleDark"
    active-color="#1989fa"
  />
</template>
```

</v-click>

<v-click>

**自定义暗色变量（可选）**

```css
.van-theme-dark {
  --van-background: #1a1a1a;
  --van-background-2: #2a2a2a;
  --van-text-color: #e0e0e0;
}
```

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vant 4 内置一套完整的暗色 CSS 变量 ——
ConfigProvider 的 theme 属性切到 "dark"，所有子组件自动切换为暗色配色。

不需要单独 import 暗色样式（不像 Element Plus 要 import 'element-plus/theme-chalk/dark/css-vars.css'），
v4 默认 bundle 里就包含了 dark theme，省一次 import。

ConfigProvider 通常放在根组件（App.vue 或 layout）包裹 router-view，
切换 theme 时整个应用立即重新着色。

[click] VueUse 的 useDark 是事实标准的暗色切换工具 ——
- 自动读 prefers-color-scheme: dark 跟随系统
- 自动写 localStorage 持久化用户选择
- 自动同步 html.dark class

配合 van-switch 一个开关就能让用户切换。
注意 van-switch 需要 :model-value + @update:model-value 手动绑定（VueUse 的 isDark 是 WritableComputedRef，不是普通 ref）。

[click] 默认 dark 配色已经够用，但企业可能要调成自己品牌的暗色 ——
在 `.van-theme-dark` 选择器下覆盖几个核心变量即可：
- --van-background：主背景色
- --van-background-2：次级背景（卡片、cell 等）
- --van-text-color：主文字色
- --van-text-color-2：次级文字色

完整 dark 变量列表见 vant/lib/styles/css-variables.less 或文档。

也支持「跟随系统」模式 —— ConfigProvider 的 :theme="undefined"（不传）默认走 css prefers-color-scheme 媒体查询。
-->

---
transition: fade-out
---

# 国际化：Locale.use 切换语言

30+ 内置语言，一行 use 启用

<v-click>

**全局配置（main.ts 启动时）**

```ts
import { Locale } from "vant";
import enUS from "vant/es/locale/lang/en-US";
import zhCN from "vant/es/locale/lang/zh-CN";

Locale.use("en-US", enUS);   // 默认是 zh-CN，可切到其它
```

</v-click>

<v-click>

**动态切换语言**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Locale } from "vant";
import enUS from "vant/es/locale/lang/en-US";
import zhCN from "vant/es/locale/lang/zh-CN";

const lang = ref<"zh" | "en">("zh");

function switchLang() {
  lang.value = lang.value === "zh" ? "en" : "zh";
  if (lang.value === "zh") Locale.use("zh-CN", zhCN);
  else Locale.use("en-US", enUS);
}
</script>

<template>
  <van-button @click="switchLang">
    切换语言 / Switch
  </van-button>
  <van-date-picker v-model="date" title="选日期" />
</template>
```

</v-click>

<v-click>

> 💡 Vant 提供 30+ 语言，与 vue-i18n 协同时把语言切换状态共享给 Locale.use 即可。

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vant 4 默认是 zh-CN（简体中文）—— 国内项目无需配置即可使用。
其它 29+ 语言（en-US、ja-JP、ko-KR、fr-FR、de-DE、ar-SA ……）需要 Locale.use 切换。

注意：Vant 的 i18n 用 `Locale.use(lang, messages)` 形式调用 ——
是一个静态方法（不是 reactive），切换后所有已渲染的组件需要重新渲染才生效。

实际项目中通常在 main.ts 启动时调一次 Locale.use，确定默认语言。

[click] 动态切换语言需要触发组件重渲染 ——
最简单方式：通过 ConfigProvider 包裹整个应用，切换语言时改 :key 强制重渲染：

```vue
<van-config-provider :key="lang">
  <router-view />
</van-config-provider>
```

或者用 useRouter 路由刷新触发重渲染。

[click] 与 vue-i18n 协同的标准模式：
- vue-i18n 管业务文案
- Vant Locale 管组件内置文案（确认 / 取消 / 加载中等）
- 两者共享同一个 locale state（写在 Pinia 或 useStorage），切换时同步更新

DatePicker 还需要 dayjs locale —— Vant 内部用 dayjs 处理日期，需要单独 dayjs.locale('zh-cn')。

i18n 覆盖范围：Vant 内置文案约 200+ 条（按钮文字、占位符、错误提示等），
30+ 语言全量覆盖，社区贡献维护。
-->

---
transition: fade-out
---

# 移动端适配（一）：Rem 方案

基于根字号 + flexible 库

<v-click>

**1. 安装 amfe-flexible**

```bash
pnpm add amfe-flexible
```

```ts
// main.ts
import "amfe-flexible";   // 自动设置 html 根字号
```

</v-click>

<v-click>

**2. 配置 postcss-pxtorem**

```bash
pnpm add -D postcss-pxtorem
```

```js
// postcss.config.js
export default {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 37.5,         // Vant 默认根字号
      propList: ["*"],
      selectorBlackList: [".van-"],  // 排除 Vant 自己的样式
    },
  },
};
```

</v-click>

<v-click>

> 💡 **Vant 设计稿基准**：375px 宽度。所以 rootValue=37.5（1rem = 37.5px）。如果是 750px 稿，rootValue=75。

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Rem 方案是移动端最经典的适配方案 ——
原理：根据屏幕宽度动态设置 html 根字号，CSS 用 rem 单位，自动按屏幕缩放。

amfe-flexible 是阿里出品的根字号设置库 ——
启动时根据 window.innerWidth 计算 html.style.fontSize，
小屏字号小，大屏字号大，元素按比例缩放。

实际做法：iPhone 5 (320px) 根字号 = 32px、iPhone 8 (375px) = 37.5px、iPhone Plus (414px) = 41.4px。

[click] postcss-pxtorem 让你写 px，编译时自动转 rem —— 设计稿 px 直接写，构建工具帮你换算。

rootValue: 37.5 对应 Vant 默认的 375px 设计稿基准。
如果 UI 给的是 750px 稿（设计师 2x 出图），rootValue 设为 75。

propList: ["*"] 转换所有 CSS 属性的 px。
selectorBlackList: [".van-"] 排除 Vant 自身的样式 —— 因为 Vant 内部已经处理过单位，不需要再转。

[click] Vant 4 文档明确说设计稿基准 375px ——
组件内部都按 375px 设计，配合 37.5 rootValue 在所有移动设备上完美缩放。

替代方案：postcss-px-to-viewport（下一页）—— 转 vw 单位，不依赖 JS 计算根字号。
现代项目越来越多用 viewport 方案，rem 方案被认为有点 outdated 但依然稳定可用。
-->

---
transition: fade-out
---

# 移动端适配（二）：Viewport 方案

postcss-px-to-viewport，更现代

<v-click>

**1. 安装**

```bash
pnpm add -D postcss-px-to-viewport
```

</v-click>

<v-click>

**2. 配置 postcss.config.js**

```js
export default {
  plugins: {
    "postcss-px-to-viewport": {
      viewportWidth: 375,         // Vant 设计稿基准
      unitPrecision: 5,
      propList: ["*"],
      viewportUnit: "vw",
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
      exclude: [/node_modules\/(?!vant)/],   // 转换 Vant 自己的样式
    },
  },
};
```

</v-click>

<v-click>

**HTML meta viewport（必须）**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Viewport 方案是 rem 方案的现代替代品 ——
原理：CSS 单位用 vw（视口宽度的 1%），浏览器原生支持，无需 JS 计算根字号。

viewportWidth: 375 表示「设计稿宽度 375px = 100vw」。
比如设计稿元素宽 75px → 75/375 = 20vw → 在任何屏幕上都占 20% 宽度。

[click] 关键配置：
- viewportWidth: 375 —— Vant 设计稿基准
- viewportUnit: "vw" —— 目标单位
- unitPrecision: 5 —— 小数位精度
- exclude: [/node_modules\/(?!vant)/] —— 转换 Vant 自身样式（关键！）

注意 exclude 的正则：`(?!vant)` 是「负前瞻」，意思是「node_modules 下除了 vant 之外的都排除」——
确保 Vant 的 px 也被转换，不需要单独 selectorBlackList。

[click] HTML meta viewport 是必须的 —— 否则浏览器不会按设备实际宽度渲染：
- width=device-width：宽度为设备实际宽度
- initial-scale=1.0：初始缩放比 1
- maximum-scale=1.0：最大缩放比 1（禁用双指放大）
- user-scalable=no：禁用用户缩放

Vant 官方 demo 用这套 viewport 方案 —— Vite + postcss-px-to-viewport 是 2024-2025 年首选。

对比：rem 方案需要 amfe-flexible（额外 1KB JS），viewport 方案纯 CSS。
小屏适配：rem 更精细（按比例缩放），viewport 更直接（按视口宽度）。
两者都能用，但新项目推荐 viewport。
-->

---
transition: fade-out
---

# 桌面端使用：max-width 容器

电脑访问移动 H5 时的最佳实践

<v-click>

**移动端样式 + 桌面端居中容器**

```vue
<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";

const isDesktop = useMediaQuery("(min-width: 768px)");
</script>

<template>
  <div :class="{ 'desktop-container': isDesktop }">
    <van-nav-bar title="商品详情" left-arrow />
    <router-view />
    <van-tabbar v-model="active" route>...</van-tabbar>
  </div>
</template>

<style>
.desktop-container {
  max-width: 480px;
  margin: 0 auto;
  border-left: 1px solid var(--van-border-color);
  border-right: 1px solid var(--van-border-color);
  min-height: 100vh;
}
</style>
```

</v-click>

<v-click>

**鼠标交互兼容**

```ts
// Vant 默认监听 touch 事件，桌面端鼠标不触发
// 解决：开启 useDesktopMode（部分组件支持）
import { showToast } from "vant";

// 或在文档里配 enableMouseEvent: true
```

</v-click>

<v-click>

> 💡 **真实场景**：很多移动 H5 也会被桌面浏览器访问（运营预览、PC 微信扫码），适配桌面是加分项。

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 移动 H5 在桌面端访问的体验问题：
- 屏幕太宽，内容拉得很长很丑（375px 设计在 1920px 屏幕上被拉成 ~5x）
- Tabbar / NavBar 横铺到屏幕两端，违反「单手操作」设计意图
- 鼠标交互与触摸交互不同（hover 状态、右键菜单等）

解决方案：在桌面端给应用包一个 max-width 容器，模拟「手机框」的效果 ——
内容居中 + 两侧边框 + 固定宽度 480px（约一个 iPhone Plus 宽度）。

useMediaQuery 监听 `min-width: 768px` 判断是否桌面端，
切换容器 class 实现「移动端全屏，桌面端居中」的双模式。

[click] 鼠标交互兼容是 Vant 的痛点 ——
Vant 默认只监听 touch 事件（touchstart / touchmove / touchend），
桌面端鼠标点击不触发 swipe / pull-refresh 等手势组件。

部分组件支持 enableMouseEvent prop 同时监听 mouse 事件：
- Swipe（轮播）：默认 false，开启后桌面端可以鼠标拖拽切换
- PullRefresh：默认 false，开启后桌面端可以鼠标拖拽刷新

但不是所有组件都支持 —— 像 Picker / Calendar 这种重交互的，桌面端体验仍然不如原生 select / date input。

[click] 这是 Vant 的「定位决策」—— 优先优化移动端体验，桌面端兼容但不是重点。

如果项目主要面向桌面端（比如管理后台），建议直接用 Element Plus / Naive UI 等桌面优化的库。
如果项目主要移动端 + 偶尔桌面访问（电商 H5 / 营销页），Vant + max-width 容器够用。

替代方案：使用 nutui-react / @taroify/core 等专为「移动端 + 桌面兼容」设计的库。
-->

---
transition: fade-out
---

# SSR 与 Nuxt 集成

官方支持 + 一键自动引入

<v-click>

**手动配 SSR（Vue 3 + 自定义 SSR）**

```ts
// entry-server.ts
import { createSSRApp } from "vue";
import App from "./App.vue";

export function createApp() {
  const app = createSSRApp(App);
  // Vant 4 大部分组件 SSR-safe，无需特殊 provide
  return { app };
}
```

</v-click>

<v-click>

**Nuxt 项目：用 @vant/nuxt 模块（推荐）**

```bash
pnpm add @vant/nuxt
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@vant/nuxt"],
  vant: {
    lazyload: true,        // 自动启用 Lazyload 指令
    importStyle: "css",    // 或 'less'
  },
});
```

</v-click>

<v-click>

> 💡 Vant 4 大部分组件原生 SSR-safe，弹层类组件（Popup / Toast / Dialog）走 Teleport，需要 `<ClientOnly>` 包裹。

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vant 4 对 SSR 有完整的支持 ——
组件内部避开了 window / document 直接访问（用 onMounted 包装），
绝大多数组件可以直接在 SSR 环境渲染。

不像 Element Plus 需要 provide(ID_INJECTION_KEY) 等 SSR 注入，Vant 默认即可工作。

注意：Teleport 类组件需要单独处理 ——
- Popup / Dialog / ActionSheet：teleport 到 body，SSR 时 body 还没有 mount
- Toast / Notify：函数式调用，SSR 不该触发
- ImagePreview：同 Toast

解决：用 `<ClientOnly>` 包裹弹层组件，或者只在事件回调（用户操作后）触发。

[click] Nuxt 项目用官方模块（@vant/nuxt）一键搞定 ——
- 自动注册所有 Vant 组件（无需手动 import）
- 自动加载样式（按需）
- 自动启用 Lazyload 指令
- SSR-safe（内部已处理 Teleport 等问题）

lazyload: true 启用图片懒加载（v-lazy 指令），列表型 H5 标配。
importStyle: 'less' 支持 Less 主题定制（默认 'css'，bundle 略小但不能定制 Less Vars）。

[click] SSR 是 Vant 「现代化」的关键 ——
2022 年发布的 v4 把 SSR 列为一等公民，配合 Nuxt 3 / Vite SSR / Astro 都能跑。

实测下来，Vant 4 + Nuxt 3 是「移动 H5 SSR 项目」的最优组合 ——
首屏渲染快、SEO 友好、客户端水合无错误。

如果项目对 SEO 要求高（电商 / 营销页），强烈推荐 Nuxt 3 + Vant 4 + @vant/nuxt 模块组合。
-->

---
transition: fade-out
---

# TypeScript 实战：组件 ref 类型

获取实例调方法 / 解构 props

<v-click>

**获取组件实例（调 validate / scrollTo）**

```ts
import type {
  FormInstance,
  FieldInstance,
  ListInstance,
  PullRefreshInstance,
} from "vant";

const formRef = ref<FormInstance>();
const fieldRef = ref<FieldInstance>();
const listRef = ref<ListInstance>();

onMounted(() => {
  fieldRef.value?.focus();                    // input 自动聚焦
  listRef.value?.check();                     // 强制重新检查滚动加载
});

async function submit() {
  await formRef.value?.validate();
}
```

</v-click>

<v-click>

**类型化函数式 API**

```ts
import { showToast, type ToastOptions } from "vant";

const opts: ToastOptions = {
  message: "保存成功",
  type: "success",
  duration: 2000,
  forbidClick: true,
};

showToast(opts);
```

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vant 4 为每个组件导出对应的 Instance 类型 ——
FormInstance、FieldInstance、ListInstance、PickerInstance、SwipeInstance ……

用法：`ref<FormInstance>()` —— 标注 ref 的类型，IDE 立刻知道实例上有哪些方法 / 属性。
然后通过 .value? 安全访问（template ref 初始 undefined）。

常用实例方法：
- FormInstance：validate / resetValidation / submit / getValues / scrollToField
- FieldInstance：focus / blur
- ListInstance：check（重新检查是否需要加载）
- PullRefreshInstance：（无方法，状态由 v-model 控制）
- PickerInstance：confirm / getSelectedOptions
- SwipeInstance：prev / next / swipeTo

[click] Vant 函数式 API（showToast / showDialog / showNotify）也有完整类型 ——
每个对应一个 Options 类型（ToastOptions / DialogOptions / NotifyOptions）。

用法：先定义符合 Options 类型的对象，再传给函数 —— IDE 智能提示 + 类型检查双重保护。

这种「函数式 + 选项对象」的模式比 Element Plus 的「链式调用」更现代，
也更适合 TypeScript 类型推导。

[click] 模块扩展（module augmentation）适合「往 Vant 类型上加自己的字段」——

```ts
declare module "vant" {
  interface FieldRule {
    customMeta?: string;
  }
}
```

IDE 就能识别扩展类型。
这是 TS 项目的「优雅扩展点」—— 不污染源码、不依赖 monkey patch、纯类型层面的协议。

Vant 4 的 TS 类型覆盖率几乎 100%，是 Vue 3 移动端组件库里最完整的。
-->

---
transition: fade-out
---

# 生态与配套库

围绕 Vant 的官方 / 社区工具链

<v-click>

| 库                          | 作用                                     |
| --------------------------- | ---------------------------------------- |
| **@vant/auto-import-resolver** | unplugin-vue-components 的 Vant Resolver |
| **@vant/nuxt**              | Nuxt 3 官方集成模块                      |
| **@vant/use**               | Vant 抽取的 Vue 组合式工具函数库          |
| **@vant/area-data**         | 中国行政区数据（省市区，配合 Area 组件）   |
| **@vant/cli**               | 组件库构建工具（用于二次开发）           |
| **vant-weapp**              | 微信小程序版（同 API）                   |
| **react-vant**              | React 移植版（社区，非官方）             |
| **vant-touch-emulator**     | 桌面浏览器触摸事件模拟器（调试用）       |
| **vant-demo**               | 官方示例仓库（Rsbuild / Vite / Nuxt3）   |

</v-click>

<v-click text-xs class="mt-4">

> 💡 移动 H5 技术栈：Vue 3 + Vant + Vue Router + Pinia + Vite + postcss-px-to-viewport 是「黄金组合」。

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vant 的生态分三层 ——

官方核心：
- @vant/auto-import-resolver：按需引入必备
- @vant/nuxt：Nuxt 一键集成（SSR / 按需 / 主题一站式）
- @vant/use：从 Vant 抽取的组合式工具（useClickAway / useEventListener 等，5KB）
- @vant/area-data：中国行政区数据（省市区四级，3000+ 条），配合 Area 组件做地址选择
- @vant/cli：组件库构建工具，主要用于二次开发自己的组件库

跨端生态：
- vant-weapp：微信小程序原生版本（同 API，由有赞维护）
- react-vant：React 版本（社区移植，非官方）
- vant-touch-emulator：桌面浏览器调试用，让 mouse 事件触发 touch 事件

示例 / 模板：
- vant-demo：官方多框架示例（Rsbuild / Vite / Nuxt3 / Vue3-ts 等）
- vant-demo 还包含 rem 适配 / viewport 适配的完整示例

[click] 移动 H5 技术栈标配：
Vue 3 + Vant 4 + Vue Router 4 + Pinia + Vite + TypeScript + postcss-px-to-viewport + dayjs

这套组合在国内移动 H5 领域几乎是「不假思索的默认选择」，
团队上手成本极低，社区资源海量，遇到任何问题搜索即可。

适合场景：电商 H5、营销页、移动管理后台（mobile admin）、Hybrid App 内嵌页、PWA 等。
不适合场景：纯桌面端中后台（用 Element Plus）、跨平台原生 App（用 Quasar / Ionic + Capacitor）。
-->

---
transition: fade-out
---

# 常见踩坑（一）：按需引入相关

主题不生效 / 函数式 API 没自动 import

<v-click>

**坑 1：Less 主题变量不生效**

按需引入时 VantResolver 默认走 css，绕过 Less 编译，主题覆盖无效。

```ts
Components({
  resolvers: [VantResolver({ importStyle: "less" })],   // 必须指定 less
});
```

</v-click>

<v-click>

**坑 2：showToast / showDialog 没有自动 import**

`unplugin-vue-components` 只扫描模板 `<van-xxx>`，不会处理脚本里的函数式 API。

```ts
// vite.config.ts
import AutoImport from "unplugin-auto-import/vite";

AutoImport({
  imports: [
    "vue",
    "vue-router",
    {
      vant: ["showToast", "showDialog", "showNotify", "showLoadingToast", "showConfirmDialog"],
    },
  ],
});
```

</v-click>

<v-click>

**坑 3：单独引入 Toast 样式丢失**

手动 import showToast 时样式不会自动加载。

```ts
// 必须配套 import 样式
import { showToast } from "vant";
import "vant/es/toast/style";
```

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 主题不生效是按需引入最高频的坑 ——

按需引入时 VantResolver 默认从 `vant/es/components/xxx/style/index` 引入 css，
直接绕过 Less 编译链路，你的 modifyVars 覆盖永远不生效。

解决：`importStyle: 'less'` —— 让 resolver 改从 `style/less.mjs` 走 Less 路径，
你的 vant-theme.less 注入的覆盖才能起作用。

这个坑 Vant 官方文档藏得比较深，新手一头雾水 ——「为什么我改了 @blue 没反应？」
答案 99% 是 importStyle 没配。

注意：Vant 4 推荐用 CSS Variables 主题（运行时即可），Less Vars 是历史包袱方案。
新项目优先 CSS Variables，避免这个坑。

[click] showToast / showDialog 等函数式 API 不能自动 import 是「unplugin-vue-components」的设计局限 ——
它只管模板里的 `<van-xxx>` 组件，对脚本里的函数式 API 无能为力。

解决：再装一个 `unplugin-auto-import`，配自定义 imports 把函数式 API 加进去，
脚本里直接调 showToast('xxx') 就能自动 import 了。

或者全局挂载到 Vue 实例：
```ts
import { showToast } from "vant";
app.config.globalProperties.$toast = showToast;
```
模板里直接 `$toast(...)` 即可。

[click] 单独引入 Toast 时样式丢失 ——
这是 Vant 4 按需引入的设计：函数式 API 不被 unplugin-vue-components 处理，需要手动配套引入样式。

每个 Toast / Dialog / Notify / ImagePreview 都有对应的 style 入口：
- vant/es/toast/style
- vant/es/dialog/style
- vant/es/notify/style
- vant/es/image-preview/style

通常项目里把这些样式集中 import 到一个 setup 文件，省得每次用都 import。
-->

---
transition: fade-out
---

# 常见踩坑（二）：使用层面

Picker 数据格式 / Tabbar 路由模式 / List 重复触发

<v-click>

**坑 4：Picker columns 结构不对**

v3 用 `[[]]` 嵌套数组，v4 改成 `[{}]` 对象数组。

```ts
// ❌ v3 风格
const columns = [["杭州", "宁波", "温州"]];

// ✅ v4 风格
const columns = [
  { text: "杭州", value: "Hangzhou" },
  { text: "宁波", value: "Ningbo" },
];
```

</v-click>

<v-click>

**坑 5：Tabbar route 模式不生效**

加 route 属性但没用 to 跳路由，仍按 active 索引切换。

```vue
<!-- ❌ active 模式 -->
<van-tabbar v-model="active">
  <van-tabbar-item icon="home-o">首页</van-tabbar-item>
</van-tabbar>

<!-- ✅ route 模式 -->
<van-tabbar v-model="active" route>
  <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
</van-tabbar>
```

</v-click>

<v-click>

**坑 6：List 加载完没设 finished 导致重复触发**

```ts
async function onLoad() {
  const items = await api.fetchList();
  list.value.push(...items);
  loading.value = false;
  if (items.length === 0) finished.value = true;  // 关键
}
```

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Picker columns 结构变化是 v3 → v4 升级最大的 break change ——

v3：columns 是 `string[][]` 形式，每一列是字符串数组：
```ts
columns = [['杭州', '宁波'], ['西湖区', '余杭区']]
```

v4：columns 是 `Option[][]`（多列）或 `Option[]`（单列），每项必须是 `{ text, value, children? }` 对象：
```ts
columns = [
  { text: '杭州', value: 'Hangzhou', children: [...] },
  { text: '宁波', value: 'Ningbo' },
]
```

升级时需要把所有 picker 数据全部转格式，是 v3 → v4 最痛的迁移点。

但好处明显 —— text / value 分离让「显示」和「实际值」解耦，
不再需要传 valueKey / textKey 等映射参数。

[click] Tabbar 的两种模式：

active 模式：v-model 绑数字索引，自己监听 change 切换路由 / 渲染。
route 模式：每个 item 加 to，点击直接跳路由（route 属性是开关）。

注意：route 模式下不需要 v-model（active 由当前路由决定），
强行 v-model 会出现「点击切换但 active 状态错乱」的奇怪现象。

route 模式适合「Tabbar 各页面独立路由」的多页 H5 项目。
active 模式适合「Tabbar 切换同一页面内的不同视图」的单页应用。

[click] List 重复触发是新手最经典的坑 ——

机制：onLoad 触发后，组件会自动设 loading=true，
你 push 完数据后必须设 loading=false，否则不会触发下次。

但只设 loading=false 还不够 —— 数据为空（已加载完）时必须设 finished=true，
否则用户继续滚动会无限触发 onLoad（每次都拿空数组）。

修复模板：
1. push 数据
2. loading = false
3. 如果数据为空（或不够 pageSize），finished = true

或者根据后端返回的 total 字段判断：if (list.length >= total) finished = true。
-->

---
transition: fade-out
---

# 最佳实践清单

来自数百移动 H5 项目的沉淀

<v-click>

**项目初始化**

- 必用按需引入 + VantResolver，bundle 减半
- 函数式 API 配 unplugin-auto-import 集中注入
- viewport 方案优于 rem，新项目首选 postcss-px-to-viewport
- tsconfig 加 Vant 类型导入，让 Volar 识别全局组件

</v-click>

<v-click>

**表单 + 列表**

- Form 用 van-cell-group inset 包裹，iOS 风格分组
- Field 校验 trigger 用 onBlur，避免输入过程频繁红框
- List + PullRefresh 组合时记得在 refresh 后重置 finished
- 大列表配合 v-lazy 指令 + 虚拟滚动（自行实现 / 第三方）

</v-click>

<v-click>

**主题与暗色**

- 优先 CSS Variables（v4 推荐），Less Vars 仅用于编译期固化
- ConfigProvider 全局配 theme="dark" 切换暗色
- VueUse useDark 一行实现暗色切换，不用造轮子
- 桌面端访问加 max-width 容器，提升 PC 端体验

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 项目初始化阶段的几个关键决定：

按需引入 + VantResolver 几乎是「必选」—— 不然 bundle 大、import 多、维护成本高。
函数式 API（showToast / showDialog）需要 unplugin-auto-import 处理，否则脚本里到处 import。
viewport 方案是 2024 - 2025 年的现代选择 —— 纯 CSS、无需 JS、性能更好。
TypeScript 类型必须配，否则 IDE 全是红线警告。

[click] 表单 + 列表是移动 H5 70% 的工作量 ——

van-cell-group inset 让分组带圆角 + 边距，更符合 iOS Setting 风格。
Field 的 trigger 默认是 onChange，输入过程中频繁校验导致体验差，改成 onBlur 更友好。
List + PullRefresh 组合时记得：refresh = 清空 list + 重置 finished + 调 onLoad。

大列表（千行以上）性能优化方案：
- v-lazy 指令：图片懒加载（Vant 内置）
- 虚拟滚动：vue-virtual-scroller 或自己实现 IntersectionObserver

[click] 主题层面的分工：
- CSS Variables：编译期 + 运行时，新项目首选
- Less Vars：编译期 token 固化，老项目兼容
- ConfigProvider：全局配置中心

VueUse 的 useDark 是事实标准，自带 localStorage + 系统跟随，省心。

桌面端访问加 max-width 容器是「细节体验」加分项 ——
让运营 / 测试 / 客户在 PC 浏览器预览时也有合理体验，不至于内容被拉得很长很丑。
-->

---
transition: fade-out
---

# 评价

成熟稳定 / 移动端最强 / 国内首选，但桌面适配弱

<v-clicks>

**优点**

- 80+ 组件覆盖移动端几乎所有场景，开箱即用
- 单组件 ~1KB，零三方依赖，移动端弱网环境优势巨大
- 中文社区资源极其丰富，文档 / issue / 教程 / 模板海量
- 主题系统双层（CSS Vars + Less Vars）满足运行时 + 编译期双需求
- TypeScript 原生支持，Volar 体验一流
- v4 自 2022 年发布至今稳定，企业选型放心
- Nuxt / SSR 官方支持，全栈场景可用
- 业务组件（AddressEdit / Sku / Coupon）开箱即用电商场景

**缺点**

- 桌面端体验较弱，max-width 容器是凑合不是优化
- 鼠标交互在部分组件支持不全（Swipe / PullRefresh 需配 enableMouseEvent）
- 设计语言偏中国电商风（橙红色调），海外项目可能水土不服
- 业务组件耦合有赞商城逻辑，深度定制时不如基础组件灵活
- i18n 仅 30+ 语言，少于 Element Plus 的 66+

</v-clicks>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vant 的优点很集中 —— 「移动端开发首选」这一句就总结了 ——

80+ 组件覆盖度可能是 Vue 3 移动生态最完整的，新需求几乎不需要找额外组件库。
单组件 ~1KB 是真的香 —— 移动端弱网环境下，每 50KB 都影响首屏速度。
中文生态强到「随便搜一个问题都有解答」，团队上手成本极低。
主题系统的双层设计在移动端组件库中也是少见的精巧。
TypeScript 支持原生而非「后期补丁」，Volar 跳转 / 补全无缝衔接。

业务组件是有赞独有的优势 —— AddressEdit（地址编辑表单 + 区域选择 + 标签设置）、
Sku（商品规格选择 + 价格库存 + 数量步进）、Coupon（优惠券列表 + 选择 + 兑换），
这些组件直接复用了有赞商城多年沉淀，C 端电商场景节省大量工时。

[click] 缺点也很明确：

桌面端体验偏弱 —— max-width 容器只是「凑合可用」，
鼠标 hover / 右键 / 键盘快捷键等桌面交互在 Vant 里基本没有。
要做 PC + 移动双端项目，Vant 不是最佳选择。

设计语言偏「电商风」—— 橙红色调（#ee0a24 红 + #ff976a 橙）是有赞 / 淘宝系审美，
海外项目（特别是 B 端工具类）可能觉得过时或不专业。
配合自定义主题可以缓解，但「DNA 里的电商感」难完全消除。

业务组件耦合有赞商城逻辑 ——
AddressEdit 内置「保存到地址簿」「设为默认」等概念，
不适合非电商场景（比如政务 / 教育）的「地址输入」需求。

i18n 30+ 语言 vs Element Plus 66+ 语言 —— Vant 主要服务国内项目，
海外语言覆盖不够全（特别是 RTL 阿拉伯语支持有限）。

选型逻辑：国内移动 H5 / 电商 / 营销页首选 Vant，桌面端 / 海外 / B 端工具另选。
-->

---
transition: fade-out
---

# 学习路径

从入门到企业级实战的 4 个阶段

<v-click>

**第 1 周：核心组件熟练**

- 通读官方文档 基础 + 表单 + 反馈 三大分组
- 跟着官方 Playground 改例子（最快入门方式）
- 写一个 CRUD 页面（List + Form + Dialog 三件套）

</v-click>

<v-click>

**第 2 周：移动适配 + 交互精进**

- 跑通 viewport 适配 + 不同屏幕预览
- 实现下拉刷新 + 上拉加载 + 触摸滑动
- 实现暗色模式 + 国际化切换

</v-click>

<v-click>

**第 3-4 周：企业级整合**

- 接入 Vue Router + Pinia + Vite + dayjs
- 实现登录 / 首页 / 列表 / 详情 / 个人中心五件套
- 接 ECharts mobile / vchart 等移动端图表

</v-click>

<v-click>

**长期：源码 + 跨端**

- 阅读 List / PullRefresh / Picker 等核心组件源码
- 探索 Vant Weapp（小程序版）/ React Vant 跨端方案

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 第一周打基础 ——
官方文档结构清晰，基础 → 表单 → 反馈 三个分组覆盖 80% 日常组件。
Playground 是最快的学习方式 —— 改例子比看例子快 10 倍。
完成一个 CRUD 页面就算入门了 —— List 展示数据、Form 编辑、Dialog 承载、Toast 反馈。

[click] 第二周进阶 ——
移动适配（viewport / rem）是必修课，没踩过坑的开发者写不出生产级 H5。
PullRefresh / List / Touch 等手势组件是移动端独有交互，桌面端开发者需要单独学。
暗色 + i18n 是企业项目的标配，必须熟练。

[click] 第三到四周企业级整合 ——
单独的 Vant 只是「组件库」，要变成「移动 H5 应用」需要拼接：
- 路由系统：Vue Router 4（移动端通常配 keep-alive 缓存列表页）
- 状态管理：Pinia
- 构建工具：Vite + postcss-px-to-viewport
- 日期：dayjs（Vant 内置依赖）
- 图表：ECharts mobile 或 @visactor/vchart

把这些拼通就是一个完整的「移动 H5 项目」。

[click] 长期投入推荐看源码 ——
Vant 的 List / PullRefresh / Picker 源码是「移动端组件设计的优秀教材」，
读完会对「touch 事件 / 手势识别 / 回弹动画」这些移动端独有难点有更深理解。

跨端探索：
- Vant Weapp：微信小程序原生组件库，同 API 但语法是小程序 wxml/wxss
- React Vant：社区移植，React 版本（适合 React 团队接 Vant 设计稿）
- Taro + Taroify：跨平台编译方案（一套代码出 H5 + 小程序）
-->

---
transition: fade-out
---

# 延伸学习资源

官方 + 社区精选

<v-click>

**官方资源**

- [官方文档](https://vant-ui.github.io/vant/) —— 中英双语，质量第一档
- [Playground](https://vant-ui.github.io/vant-playground/) —— 在线编辑测试
- [GitHub](https://github.com/youzan/vant) —— 23K+ star
- [vant-demo](https://github.com/youzan/vant-demo) —— 多框架示例仓库

</v-click>

<v-click>

**移动 H5 模板**

- [vue-vant-mobile](https://github.com/easy-temps/vue-vant-mobile) —— 现代化移动模板
- [vue3-h5-template](https://github.com/yulimchen/vue3-h5-template) —— 简洁实用
- [vant-demo Vite + TS](https://github.com/youzan/vant-demo/tree/main/vant/vue3-ts) —— 官方推荐起点

</v-click>

<v-click>

**配套技术栈**

- Vue Router 4 + Pinia + Vite + postcss-px-to-viewport = 黄金组合
- VueUse + dayjs + ECharts mobile = 实用三件套
- @vant/nuxt + Nuxt 3 = SSR 移动 H5 终极方案

</v-click>

<style>
h1 {
  background-color: #1989fa;
  background-image: linear-gradient(45deg, #1989fa 10%, #ee0a24 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 官方资源是第一手信息 ——

官方文档中英文齐全，组件示例可以直接复制使用。
Playground 是「踩坑前先试试」的最佳工具，每个组件都能在线编辑代码 + 立即看到效果。
GitHub 仓库的 issue 区是「问题解答的金矿」—— 你的问题 90% 已经有人提过。
vant-demo 仓库包含 Vite / Nuxt3 / Rsbuild 等多种框架 + rem / viewport 适配的完整示例。

[click] 移动 H5 模板选型建议：

vue-vant-mobile：现代化模板，Vue 3 + Vant 4 + TS + Pinia + viewport 适配齐全
vue3-h5-template：简洁实用，适合从零搭建中小项目
vant-demo Vue3-ts：官方推荐起点，代码量适中、配置完整

新项目推荐从 vue3-h5-template 或 vant-demo 起步 ——
代码量适中、配置完整、上手友好。

[click] 配套技术栈：

「Vue Router 4 + Pinia + Vite + postcss-px-to-viewport」是 2024 - 2025 年移动 H5 的事实标准。
VueUse 提供 200+ 实用 composable，与 Vant 完美协作（useDark / useMediaQuery 等）。
dayjs 是 Vant 内置的日期库，业务代码也直接用它最自然。
ECharts mobile 是图表事实标准，配合 Vant Card / Cell 做数据展示极佳。

@vant/nuxt + Nuxt 3 是「SSR 移动 H5」终极方案 —— 首屏快、SEO 好、客户端水合无错。
适合电商 / 营销页 / 内容型 H5 等对 SEO 有要求的场景。
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 📱

Vant — Vue 3 移动端 UI 的事实标准

<div class="mt-8 text-lg">

**核心心智**

- 按需引入 + VantResolver 是现代项目标配
- 函数式 API 用 show* 前缀，需要额外配 AutoImport
- viewport 方案优于 rem，新项目首选 postcss-px-to-viewport
- CSS Variables 主题（运行时） + ConfigProvider theme 切暗色
- 业务组件（AddressEdit / Sku）开箱即用电商场景

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://vant-ui.github.io/vant/" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/youzan/vant" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://vant-ui.github.io/vant-playground/" target="_blank" class="slidev-icon-btn">
    <carbon:play /> Playground
  </a>
</div>
