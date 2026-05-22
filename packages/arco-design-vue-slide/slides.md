---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Arco Design Vue
info: |
  Presentation Arco Design Vue for Vue 3 developers.

  Learn more at [https://arco.design/vue](https://arco.design/vue)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎨</span>
</div>

<br/>

## Arco Design Vue — 字节跳动企业级 Vue 3 组件库

60+ 组件 / 100% TypeScript / Less + CSS Variables 双轨主题 —— 字节跳动 GIP/ECom/Lark 团队联合打造，Arco Design 设计系统官方 Vue 3 实现（当前主线 v2.58.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Arco Design Vue —— 字节跳动出品的企业级 Vue 3 UI 组件库，
由字节跳动内部 GIP（增长智能业务线）+ ECom（电商业务线）+ Lark（飞书）等
多业务线前端团队联合打造，2021 年 5 月在 GitHub 开源。

它是字节内部 Arco Design 设计系统的官方 Vue 3 实现 ——
最新稳定版 v2.58.x（2026 年 4 月发布），要求 Vue 3.x + Node 18+。

核心卖点：
- 字节跳动官方背书，飞书 / 抖音电商 / TikTok 商家后台等内部产品都在用，企业级稳定性最有保障
- 唯一同时拥有 React + Vue 双官方实现的国内设计系统，跨技术栈复用设计零摩擦
- 60+ 组件覆盖 General / Layout / Navigation / Data Entry / Data Display / Feedback / Other 全类目
- 100% TypeScript 编写，所有组件、API、locale、theme 都有完整 .d.ts
- Less + CSS Variables 双轨主题系统，编译期深度定制 + 运行期灵活切换
- 内置 Design Lab 在线主题平台，设计师拖拽生成主题包 —— 国内 Vue UI 库独家
- Modal.confirm / Message.success 全局静态 API，无需 Provider 嵌套

国内 Vue UI 库市场份额第三 —— Element Plus > Ant Design Vue ≈ Arco Design Vue > Naive UI。
是「有大厂背书 + 国内企业级 + Pro 模板完整」的 Vue 3 UI 库选择。
-->

---
transition: fade-out
---

# 什么是 Arco Design Vue？

为 Vue 3 应用提供「字节企业级设计 + 双栈一致 + 类型安全」的组件库

<v-click>

- **字节跳动官方出品**：GIP / ECom / Lark 等业务线前端团队联合维护，飞书 / 抖音电商内部验证
- **60+ 组件**：General / Layout / Navigation / Data Entry / Data Display / Feedback / Other 七大分组
- **100% TypeScript**：源码 66.1% TS + 18.4% Vue + 14.0% Less，全链路类型推导
- **双轨主题系统**：CSS Variables 运行期切换 + Less 变量编译期深度定制
- **Design Lab 在线主题平台**：WYSIWYG 拖拽生成主题包，国内 Vue UI 库独家
- **全局静态 API**：Modal.confirm / Message.success / Notification.info 无需 Provider 嵌套
- **13+ 语言包**：字节出海项目（TikTok Shop / Lark）的实战沉淀
- **700+ 自研 Arco Icons**：内置图标包，无需额外安装第三方图标库

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Arco Design Vue 快速开始_](https://arco.design/vue/docs/start)

</div>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Arco Design Vue 的核心定位很清晰：「字节跳动企业级 Vue 3 组件库」——

它不是社区个人项目，也不是某个 React 库的非官方移植 ——
它是字节跳动内部多业务线前端团队联合维护的官方产物，
是 Arco Design 设计系统的官方 Vue 3 实现。

逐条说明：

- 字节官方背书：飞书、抖音电商、番茄小说后台、TikTok 商家后台等都在用 ——
  这意味着它经过了字节内部生产环境的大规模验证，企业级稳定性最有保障。

- 60+ 组件分七大类：General（通用）、Layout（布局）、Navigation（导航）、
  Data Entry（数据输入）、Data Display（数据展示）、Feedback（反馈）、Other（其他）。
  企业中后台 CRUD 场景 95%+ 开箱即用。

- 100% TypeScript 不是营销词 —— 源码构成是 66.1% TypeScript + 18.4% Vue + 14.0% Less，
  所有组件、API、locale、theme 都有完整的 .d.ts，无需额外装 @types 包。

- 双轨主题：CSS Variables 适合运行期切换（暗色 / 多主题），
  Less 变量适合编译期深度定制（整站换色）—— 两套方案灵活组合。

- Design Lab 是 Arco 的杀手锏 —— 在线 GUI 拖拽调色、实时预览、一键导出 npm 主题包，
  设计师不写代码就能产出企业级品牌主题。Element Plus / Naive UI 都没有 GUI。

- 全局静态 API：Modal.confirm、Message.success 直接调用，不需要像 Naive UI
  那样必须包 Provider，迁移自 Element Plus 的开发者学习曲线极低。

下面会按「定位 → 字节背景 → 设计理念 → 安装 → 第一个组件 → 组件分组 →
AForm → ATable → 反馈 → ConfigProvider → 主题 → 国际化 → 图标 →
TypeScript → 容器组件 → SSR → 路由集成 → 生态 → 踩坑 → 评价 → 学习路径」展开。
-->

---
transition: fade-out
---

# Arco Design Vue 的定位与生态

在 Vue 3 UI 库格局中处于什么位置？

<v-click>

| 维度       | Arco Design Vue   | Element Plus     | Ant Design Vue   | Naive UI         |
| ---------- | ----------------- | ---------------- | ---------------- | ---------------- |
| 阵营       | **字节跳动官方**  | 饿了么 + 社区    | Antd 社区维护    | 图森未来 + 社区  |
| 设计语言   | **Arco 企业级**   | 企业管理后台     | Ant Design       | Discord 现代极简 |
| React 版本 | **官方双栈一致**  | —                | React Antd 更权威 | —                |
| 主题系统   | **Less + CSS Vars** | CSS Vars + SCSS | Less Variables   | TS 对象 + CSS-in-JS |
| 主题工具   | **Design Lab GUI** | —               | —                | —                |
| API 风格   | **Modal.confirm** | ElMessage 静态   | Modal.confirm    | useMessage 组合式 |
| Pro 模板   | **官方 Pro 模板** | 社区维护         | —                | 社区维护         |

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比四大 Vue 3 UI 库，Arco Design Vue 的护城河是「大厂背书 + 双栈设计统一 + Design Lab + Pro 模板」：

阵营差异是本质 ——
- Arco：字节跳动官方，多业务线前端团队联合维护
- Element Plus：饿了么开源 + 社区维护，国内市场份额断层第一
- Ant Design Vue：注意，它是 Ant Design 设计语言的「社区维护 Vue 实现」，并非 Ant 官方
- Naive UI：图森未来（TUSEN AI）开源，07akioni 主导

React 版本这一行是 Arco 独有的优势 ——
Arco Design 同时有官方 React 版（arco-design/arco-design）和官方 Vue 版，
两者共享同一套设计 token、视觉规范、组件交互。
这意味着一个公司里 React 团队和 Vue 团队可以共用设计师、共用设计稿，
跨技术栈协作零摩擦 —— 这是国内设计系统里唯一做到的。

主题系统对比：
- Arco：Less 变量（编译期）+ CSS Variables（运行期）双轨
- Element Plus：CSS Variables 为主 + SCSS
- Ant Design Vue：Less 变量
- Naive UI：纯 TypeScript 对象 + CSS-in-JS

主题工具：只有 Arco 有 Design Lab 这种在线 GUI 拖拽工具。

API 风格：
- Arco / Element Plus / Ant Design Vue 都是全局静态方法（Modal.confirm 直接调）
- Naive UI 是组合式 API（useMessage），必须包 Provider

Pro 模板：
- Arco 有官方维护的 arco-design-pro-vue（1.8k Star）
- Element Plus 的 element-plus-admin 是社区维护
- Naive UI 的 naive-ui-admin 是社区维护

选型逻辑：
- 追求招聘市场 / 生态成熟度 / 中文教程多 → Element Plus
- 字节同款 / 跨 React+Vue 双栈设计 / 想用官方 Pro 模板 → Arco Design Vue
- 设计驱动的 C 端轻量产品 → Naive UI
- 海外项目 / 严格 Material Design → Vuetify
-->

---
transition: fade-out
---

# 字节跳动与 Arco Design 设计系统

为什么字节做了一个 React + Vue 双官方实现的设计系统？

<v-click>

| 时间    | 关键事件                                                       |
| ------- | -------------------------------------------------------------- |
| ~2019   | 字节内部沉淀 Arco Design 设计系统，先有 React 实现             |
| 2021.05 | Arco Design Vue 在 GitHub 开源，官方 Vue 3 实现落地           |
| 2022    | v2.11+ 支持 ArcoResolver 按需引入，生态工具链完善             |
| 2023    | Design Lab 在线主题平台 + arco-design-pro-vue Pro 模板成熟    |
| 2024    | v2.44.3 添加 exports 配置，Nuxt 3 即装即用                    |
| 2025-26 | 当前主线 v2.58.x（4 月发布），字节内部 daily updates 持续迭代 |

</v-click>

<v-click>

> 💡 **冷知识**：Arco Design 是字节内部多业务线（GIP / ECom / Lark）联合沉淀的设计系统，React 版（6.6k Star）与 Vue 版（3.1k Star）共享同一套设计 token，是国内唯一双官方实现的设计系统。

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Arco Design 的故事要从字节内部说起 ——

字节跳动是个超大型公司，内部有海量的中后台系统：
飞书的各种管理后台、抖音电商的商家后台、TikTok Shop 的运营平台、
番茄小说的内容后台 …… 这些系统由不同业务线开发。

如果每个业务线各做各的 UI，设计语言不统一、组件重复造轮子 ——
所以字节沉淀出了 Arco Design 设计系统，由 GIP（增长智能业务线）、
ECom（电商业务线）、Lark（飞书）等多个业务线前端团队联合维护。

时间线里几个关键节点：
- 字节内部先有 React 实现（因为字节大量业务用 React）
- 2021 年 5 月，官方 Vue 3 实现 arco-design-vue 开源 ——
  这一步很关键，让 Vue 技术栈的团队也能用同一套设计系统
- 2022 年 v2.11+ 支持 ArcoResolver 按需引入插件，工程化能力补齐
- 2023 年 Design Lab 主题平台 + arco-design-pro-vue Pro 模板成熟
- 2024 年 v2.44.3 添加 package.json 的 exports 配置，兼容 Nuxt 3 的严格模块解析
- 2026 年当前主线 v2.58.x，字节内部 daily updates，社区 PR 持续合并

[click] 这个冷知识值得记住 ——

Arco Design 是国内唯一「同时拥有 React + Vue 双官方实现」的设计系统：
- React 版：arco-design/arco-design，6.6k Star
- Vue 版：arco-design/arco-design-vue，3.1k Star
- 两者共享同一套设计 token、视觉规范、组件交互逻辑

对比一下：
- Element Plus 只有 Vue 实现，没有官方 React 版
- Ant Design 只有 React 官方实现，Ant Design Vue 是社区移植

所以如果你的公司同时有 React 和 Vue 项目，又希望设计完全一致 ——
Arco Design 是目前唯一的官方答案。这就是它最独特的生态价值。
-->

---
transition: fade-out
---

# Arco Design Vue 的核心理念

四条原则贯穿整个组件库的设计

<v-click>

**1. 大厂背书（Enterprise Proven）**

字节内部多业务线生产环境验证 —— 飞书 / 抖音电商 / TikTok 商家后台都在用，企业级稳定性有保障。

</v-click>

<v-click>

**2. 双栈一致（Cross-Stack Consistent）**

与 Arco Design React 共享同一套设计 token + 视觉规范 —— 跨 React / Vue 团队设计协作零摩擦。

</v-click>

<v-click>

**3. 主题双轨（Dual-Track Theming）**

Less 变量编译期深度定制 + CSS Variables 运行期灵活切换 —— 再配 Design Lab 在线 GUI 生成主题。

</v-click>

<v-click>

**4. 易用优先（Migration Friendly）**

全局静态 API（Modal.confirm / Message.success）无需 Provider 嵌套 —— Element Plus 用户迁移曲线极低。

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 第一条原则：大厂背书。

这是 Arco 与 Element Plus、Naive UI 最大的差异化 ——
Element Plus 出自饿了么 + 社区，Naive UI 出自图森未来（自动驾驶公司），
而 Arco 是字节跳动这个超大型互联网公司内部多业务线联合维护的产物。

字节内部有海量产品在用 Arco —— 飞书、抖音电商、番茄小说、TikTok Shop ……
这意味着 Arco 的组件经过了「字节级别流量和场景」的真实考验，
企业选型时不用担心「这个库会不会突然没人维护」。

[click] 第二条原则：双栈一致。

很多公司的现实是：老项目 React、新项目 Vue，或者不同团队技术栈不同。
如果 UI 库设计语言不一致，设计师就要维护两套设计规范，产品看起来也不统一。

Arco Design 的解法是 React + Vue 双官方实现，共享同一套设计 token。
一个设计师画一张稿，React 团队和 Vue 团队都能 1:1 还原 ——
这种「跨技术栈设计协作零摩擦」是 Arco 独有的能力。

[click] 第三条原则：主题双轨。

Arco 不强迫你用某一种主题方案，而是给你两条轨道：
- Less 变量（编译期）：修改 @arcoblue-6 等核心变量，整站彻底换色
- CSS Variables（运行期）：修改 --color-primary-6，可以实时切换、与暗色天然兼容

再加上 Design Lab —— 设计师在浏览器里拖拽调色、实时预览、一键导出 npm 主题包。
编译期、运行期、可视化 GUI，三种方式覆盖所有主题定制场景。

[click] 第四条原则：易用优先。

Arco 的反馈三件套（Modal / Message / Notification）都是全局静态方法 ——
import 进来直接 Modal.confirm() / Message.success() 就能用，不需要包任何 Provider。

这一点与 Element Plus 的 ElMessage / ElMessageBox 风格几乎一致。
对于从 Element Plus 迁移过来的团队，学习曲线极低 ——
不需要理解 Naive UI 那套「Provider + Composable」的架构。
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
pnpm add @arco-design/web-vue
# 按需引入插件（推荐生产）
pnpm add -D unplugin-vue-components \
  unplugin-auto-import
```

| Vue 版本 | Arco Design Vue 版本 |
| -------- | -------------------- |
| Vue 3.x  | **Arco 2.x（推荐）** |
| Vue 2.x  | **不支持**           |

要求 Node 18+，推荐 TypeScript 5+。

</v-click>

::right::

<v-click>

**全量引入（main.ts）**

```ts
import { createApp } from "vue";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import App from "./App.vue";

// CSS 必须 import，否则组件无样式
import "@arco-design/web-vue/dist/arco.css";

const app = createApp(App);
app.use(ArcoVue);      // 60+ 组件
app.use(ArcoVueIcon);  // 700+ 图标
app.mount("#app");
```

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Arco Design Vue 安装很简单 —— 主包一行命令搞定。

主包 @arco-design/web-vue 已经包含了 700+ Arco Icons，
不需要像 Naive UI 那样再装 @vicons/*，也不像 Element Plus 要单独装图标包。

按需引入插件（unplugin-vue-components + unplugin-auto-import）是生产环境推荐 ——
后面会专门讲。

版本要求要注意：
- Arco Design Vue 2.x 对应 Vue 3.x，推荐 Vue 3.4+
- Arco Design Vue 从未支持 Vue 2 —— Vue 2 项目请选 Element UI / iView / Vuetify 2
- 运行环境要求 Node 18+，推荐 TypeScript 5+
- 浏览器支持现代浏览器最新两个版本，不支持 IE

国内用户可以设置 npm 镜像加速：
npm config set registry https://registry.npmmirror.com
pnpm 用户同样需要设置，因为 pnpm 默认也走 npm registry。

[click] 全量引入是最简单的接入方式 —— 适合原型验证、Demo、内部工具。

注意三个关键点：

1. 两个独立的 plugin：
   - ArcoVue：注册全部 60+ 组件
   - ArcoVueIcon：注册全部 700+ 图标（可选但推荐）
   它们是分开的，要分别 app.use()。

2. CSS 必须 import！
   import '@arco-design/web-vue/dist/arco.css'
   忘了这一步，组件会渲染出来但完全没样式 —— 白屏 / 无边框按钮。
   这是新手最常见的坑之一。

3. 全量引入会把整个组件库打进 bundle —— 适合不在意体积的场景。
   生产项目应该用按需引入（下一页和下下页讲）。

全量引入后，模板里所有 a- 前缀的组件和 icon- 前缀的图标都能直接用。
-->

---
transition: fade-out
---

# 全量引入 vs 按需引入

生产项目用 ArcoResolver 自动按需，bundle 小 60%+

<v-click>

```ts
// vite.config.ts
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  plugins: [
    vue(),
    // 扫描代码自动 import Message / Modal + 图标
    AutoImport({ resolvers: [ArcoResolver({ resolveIcons: true })] }),
    // 扫描模板自动 import <a-button> 等组件
    Components({ resolvers: [ArcoResolver({ sideEffect: true })] }),
  ],
});
```

</v-click>

<v-click>

> 💡 **sideEffect: true 必须打开** —— 否则插件只 import 组件 JS、不 import 对应 CSS，按钮会没样式。ArcoResolver 要求 Arco Design Vue >= v2.11.0。

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 按需引入是所有生产项目的推荐做法 —— Tree Shaking + 自动 import，
生产 bundle 比全量引入小 60%+。

核心是两个 unplugin 插件，各司其职：

- unplugin-vue-components：扫描模板里用到的 <a-button>，
  构建时自动转换成 import { Button as AButton } from '@arco-design/web-vue'

- unplugin-auto-import：扫描代码里用到的 Message / Modal / Notification，
  构建时自动注入 import { Message } from '@arco-design/web-vue'

两个插件都通过 ArcoResolver 这个 resolver 来识别 Arco 的组件和 API。

注意 AutoImport 里的 resolveIcons: true ——
打开后，模板里写 <icon-plus /> 会自动 import IconPlus from '@arco-design/web-vue/es/icon'。
图标也走按需引入，不需要全量注册 700+ 图标。

[click] sideEffect: true 是按需引入最容易踩的坑 ——

Components 插件的 ArcoResolver 里必须设置 sideEffect: true。

为什么？因为 Arco 的每个组件都有独立的 CSS 文件。
如果不开 sideEffect，插件只会 import 组件的 JS 逻辑，不会 import 对应的 CSS ——
结果就是组件能渲染、但完全没样式（白色无边框按钮）。

sideEffect: true 告诉插件「import 组件时连带 import 它的 CSS」。

另一个版本要求：ArcoResolver 要求 Arco Design Vue >= v2.11.0 ——
更早的版本不支持按需引入插件，会报版本错误。
解决办法就是升级到 latest。

两个插件还会自动生成 components.d.ts 和 auto-imports.d.ts ——
这两个文件让 Volar 知道 <a-button> 和 Message 的类型，
建议提交到仓库，避免 CI 首次构建报 TS 错误。
-->

---
transition: fade-out
---

# 第一个组件：AButton

熟悉的味道，原生 TypeScript 加持

<v-click>

```vue
<template>
  <a-space>
    <a-button type="primary" :loading="loading">提交</a-button>
    <a-button type="outline">描边</a-button>
    <a-button status="danger">删除</a-button>
  </a-space>
</template>
```

</v-click>

<v-click>

| Prop          | 取值                                                      |
| ------------- | --------------------------------------------------------- |
| `type`        | default / primary / outline / dashed / text               |
| `status`      | normal / success / warning / danger                       |
| `size`        | mini / small / medium / large                             |
| `long` `loading` `disabled` `html-type` | 状态 + 块级 + 提交类型               |

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] AButton 是 Arco Design Vue 最简单的组件 —— 几个 prop 覆盖 90% 场景。

注意 Arco 的一个设计特点：把「形态」和「语义」拆成了两个独立维度。

- type 控制「视觉形态」：default（默认）/ primary（主按钮，实心）/
  outline（描边）/ dashed（虚线边框，常用于「添加项」）/ text（纯文字链接）
- status 控制「语义状态」：normal / success / warning / danger

这种拆分意味着你可以自由组合 —— 比如 type="outline" + status="danger"
就是「红色描边按钮」，type="text" + status="success" 是「绿色文字按钮」。

对比 Element Plus 把形态和语义混在 type 里（primary / success / danger / plain），
Arco 这种「两个维度正交」的设计更清晰、组合空间更大。

shape 控制形状：square（方角，默认）/ round（圆角）/ circle（圆形，常用于纯图标按钮）。

[click] 看这张 prop 表，几个高频组合记住就够了：

- type="primary"：主操作（提交、保存），实心主色
- type="outline"：次操作，描边
- type="dashed"：虚线，通常用于「新增一项」「上传区」
- type="text"：纯文字，像链接
- status="danger"：危险动作（删除、解绑），配合任意 type

其他常用 prop：
- size：mini / small / medium / large 四档 —— 注意 medium 是默认，
  整个 Arco 的尺寸体系都是这四档，可以通过 ConfigProvider 全局统一
- long：块级按钮，撑满父容器宽度，常用于表单提交、登录按钮
- loading：加载中，自动禁用 + 显示小圈
- disabled：禁用
- html-type：button / submit / reset —— 在 <a-form> 里配合 @submit 时用 submit

这套 type / status / size 体系在 Tag、Alert、Link 等组件里也共享，认知成本低。

上面用 <a-space> 包裹多个按钮 —— a-space 是 Arco 的间距组件，
替代手写 margin，自动给子元素之间加间隔。
-->

---
transition: fade-out
---

# 60+ 组件七大分组速览

熟悉分组即可快速定位需要的组件

<v-click>

| 分组              | 数量 | 代表组件                                          |
| ----------------- | ---- | ------------------------------------------------- |
| **General**       | 4    | Button / Icon / Typography / Link                 |
| **Layout**        | 4    | Grid / Layout / Space / Divider                   |
| **Navigation**    | 8    | Menu / Tabs / Breadcrumb / Pagination / Steps     |
| **Data Entry**    | 17   | Form / Input / Select / DatePicker / Upload / Transfer |
| **Data Display**  | 17   | Table / Tree / Card / List / Descriptions / Tag   |
| **Feedback**      | 11   | Modal / Drawer / Message / Notification / Alert   |
| **Other**         | 4    | ConfigProvider / Affix / Trigger / ResizeObserver |

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 60+ 组件听起来多，但 Arco 把它们清晰地分成七大类，按分组记忆很容易上手 ——

General（通用，4 个）：
最基础的原子组件 —— Button（按钮）、Icon（图标）、Typography（排版）、Link（链接）。
每个页面都会用到。

Layout（布局，4 个）：
页面骨架 —— Grid（24 栅格 + v2.15+ 的新版 Grid）、Layout（后台典型布局：
Header / Sider / Content / Footer）、Space（间距控制）、Divider（分割线）。

Navigation（导航，8 个）：
导航类组件 —— Menu（菜单，企业后台核心）、Tabs（标签页）、
Breadcrumb（面包屑）、Dropdown（下拉菜单）、Pagination（分页）、
Steps（步骤条）、Anchor（锚点）、BackTop（回到顶部）。

Data Entry（数据输入，17 个）：
所有表单输入控件都在这 —— Form、Input、InputNumber、Select、
TreeSelect、Cascader、Checkbox、Radio、Switch、Slider、Rate、
DatePicker、TimePicker、ColorPicker、Upload、Transfer、Mention 等。

Data Display（数据展示，17 个）：
只读 / 展示型组件 —— Table（表格，功能最强）、Tree（树）、Card、List、
Carousel、Collapse、Calendar、Avatar、Badge、Descriptions、Empty、
Image、Statistic、Tag、Timeline、Tooltip、Popover 等。

Feedback（反馈，11 个）：
用户反馈 —— Alert、Modal、Drawer、Message、Notification、Spin、
Progress、Result、Skeleton、Notice、Trigger。

Other（其他，4 个）：
ConfigProvider（全局配置，必用）、Affix（固钉）、
Trigger（弹出触发器底层组件）、ResizeObserver（尺寸观察）。

设计上有个规律：高频组件 API 极简（Button 几个 prop），
低频组件 API 完整（Table 几十个 prop / slot）。
这种「按使用频次分配复杂度」是优秀组件库的共性。

企业中后台的核心就是 Form + Table + Modal —— 下面会重点深入这几个。
-->

---
transition: fade-out
---

# AForm 深度（一）：基础结构

model + rules + field 三要素

<v-click>

```vue
<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance } from "@arco-design/web-vue/es/form";

const formRef = ref<FormInstance | null>(null);
const form = reactive({ name: "", email: "" });

const rules = {
  name: [{ required: true, message: "请输入姓名" }, { minLength: 2, maxLength: 20, message: "2-20 字符" }],
  email: [{ required: true, type: "email", message: "请输入合法邮箱" }],
};
</script>
<template>
  <a-form ref="formRef" :model="form" :rules="rules" @submit="handleSubmit">
    <a-form-item field="name" label="姓名">
      <a-input v-model="form.name" allow-clear />
    </a-form-item>
    <a-form-item field="email" label="邮箱">
      <a-input v-model="form.email" allow-clear />
    </a-form-item>
  </a-form>
</template>
```

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] AForm 是 Arco Design Vue 最常用的组件之一 ——
企业后台 80% 的页面都是「表单 + 表格」组合。

三要素，注意 Arco 的命名约定：

- model：表单数据对象（用 reactive 创建），绑在 <a-form :model="form">
- rules：校验规则对象，可以在 <a-form :rules> 上统一定义，
  也可以在 <a-form-item :rules> 上单独定义
- field：每个 <a-form-item> 的字段名（对应 model 里的 key）——
  注意 Arco 用的是 field，不是 Element Plus 的 prop、也不是 Naive UI 的 path

几个 Arco 特色：

1. v-model 直接绑值 —— Arco 的输入组件用标准 v-model（绑 model-value），
   不需要像 Naive UI 那样写 v-model:value。

2. @submit 事件 —— <a-form> 有个 submit 事件，
   配合 <a-button html-type="submit"> 触发，
   事件 payload 是 { values, errors }，errors 不为 null 说明校验失败。

3. allow-clear —— Arco 输入框的「一键清空」prop，体验细节。

4. FormInstance 类型从 @arco-design/web-vue/es/form 导入，
   标注 formRef 后就能调用 validate / resetFields 等方法。

校验规则底层用的是 async-validator（Element Plus 也用同一个库），
但 Arco 在它基础上扩展了更多内置校验类型 —— 下一页详细讲。
-->

---
transition: fade-out
---

# AForm 深度（二）：13+ 校验类型 + 提交

FieldRule 内置类型比 Element Plus / Naive UI 更丰富

<v-click>

**13+ 内置校验类型**

```ts
const rules = {
  age: [{ type: "number", min: 0, max: 120 }],
  email: [{ type: "email", required: true }],
  ip: [{ type: "ip" }],
  website: [{ type: "url" }],
  tags: [{ type: "array", minLength: 1, maxLength: 5 }],
  username: [{ validator: (value, cb: (e?: string) => void) =>
    new Promise<void>((r) => setTimeout(() => {
      if (value === "admin") cb("用户名已占用"); r();
    }, 800)) }],
};
```

</v-click>

<v-click>

**提交 + 重置**

```ts
const submit = async () => {
  if (await formRef.value?.validate()) return Message.error("请检查表单");
  Message.success("提交成功");
};
const reset = () => formRef.value?.resetFields();
```

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Arco 的 FieldRule 内置校验类型比 Element Plus / Naive UI 都丰富 ——
很多场景不需要写自定义 validator。

type 支持的类型：
string / number / boolean / array / object / email / url / ip
—— 注意 ip 和 url 这两个是 Arco 特有的，Element Plus 内置没有。

针对不同 type 还有专用约束字段：
- 字符串 / 数组：length（精确长度）、minLength、maxLength、match（正则）
- 字符串：uppercase / lowercase（是否全大写 / 全小写）
- 数字：min、max、equal（等于）、positive / negative（正数 / 负数）
- 布尔：true / false（必须是 true 或 false，比如「必须勾选协议」）
- 数组：includes（必须包含某些元素）、deepEqual
- 对象：empty（是否为空）、hasKeys（必须包含的 key）

异步校验用 validator 函数 —— 签名是 (value, callback) => void | Promise。
代码里这个例子：返回一个 Promise，在 setTimeout 里模拟接口调用，
如果用户名是 admin 就 cb('用户名已占用') 报错，否则 resolve 通过。

callback 风格：cb(错误信息) 表示校验失败，cb() 或不调用表示通过。
Promise 风格：return new Promise，在里面调 cb 报错。
两种风格都支持。

[click] 提交和重置：

validate() 返回 Promise，resolve 的值就是 errors ——
- errors 为 undefined / null：校验通过
- errors 为对象：校验失败，对象里是各字段的错误信息

所以提交逻辑是：await validate()，拿到 errors，
有 errors 就提示错误，没有就继续提交。

也可以用 callback 风格：formRef.value?.validate((errors) => { ... })。

resetFields() 是「彻底重置」—— 既清空字段值、又清除校验状态（红框）。
注意这和 Naive UI 不同 —— Naive UI 的 restoreValidation 只清红框不清值，
Arco 的 resetFields 是两件事一起做。

如果只想清校验状态、保留用户输入，用 clearValidate()。

还有个实用 prop：<a-form :scroll-to-first-error="true">——
长表单提交失败后自动滚动到第一个错误字段。

校验触发时机用 validate-trigger 控制 ——
可选 change / input / blur / focus，也可以传数组组合。默认是 change。
-->

---
transition: fade-out
---

# ATable 深度（一）：columns 数组定义

声明式列结构 —— 用 JS 对象数组，不是模板写法

<v-click>

```vue
<script setup lang="ts">
import { reactive } from "vue";
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";

const columns: TableColumnData[] = [
  { title: "姓名", dataIndex: "name", width: 140, fixed: "left" },
  { title: "邮箱", dataIndex: "email" },
  { title: "薪资", dataIndex: "salary", align: "right",
    sortable: { sortDirections: ["ascend", "descend"] } },
  { title: "状态", dataIndex: "status", slotName: "status" },
  { title: "操作", slotName: "actions", width: 160 },
];

const data = reactive([{ key: "1", name: "Jane", email: "jane@x.com", salary: 23000, status: "active" }]);
</script>
<template>
  <a-table :columns="columns" :data="data" :pagination="{ pageSize: 10 }">
    <template #status="{ record }">
      <a-tag :color="record.status === 'active' ? 'green' : 'red'">{{ record.status }}</a-tag>
    </template>
  </a-table>
</template>
```

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] ATable 是 Arco Design Vue 最强大的组件 ——
它的列定义方式与 Element Plus 完全不同。

Element Plus 是 <el-table-column> 子组件模板式声明。
Arco 用 JS 对象数组 —— columns: TableColumnData[]，和 Naive UI 一致。

为什么用 JS 对象数组？
- TypeScript 友好 —— TableColumnData 类型让每个列定义都有完整提示
- 动态列友好 —— 可以根据条件 filter / map / push 动态生成列
- 配置即代码 —— 列定义可以存到 store / localStorage（用户自定义列）

核心字段：
- title：表头文字
- dataIndex：关联 data 里的字段名，表格用 data[i][dataIndex] 取值
- width：列宽
- align：对齐方式 left / center / right（数字列常用 right）
- fixed：'left' / 'right' —— 列固定，横向滚动时不动
- ellipsis：文字超长省略
- sortable：排序配置（下一页讲）
- filterable：筛选配置
- slotName：用具名插槽渲染单元格 —— 这是 Arco 的关键设计

重点说 slotName ——
当一列需要自定义渲染（比如状态用 Tag、操作放按钮），
你在 column 里写 slotName: 'status'，
然后在 <a-table> 标签内写 <template #status="{ record }"> 来渲染。
record 就是当前行数据。

代码里「状态」列的 slotName 是 'status'，
对应下面 <template #status>，根据 record.status 渲染不同颜色的 Tag。

也可以用 render 函数（适合复杂逻辑）——
column 里写 render: ({ record }) => h(Tag, ...)，用 h 函数返回 VNode。
slot 写法更直观，render 写法更灵活，看场景选。

pagination 是对象配置 —— 传对象表示显示分页，
注意要关掉分页是传 :pagination="false"。
-->

---
transition: fade-out
---

# ATable 深度（二）：虚拟列表 + 服务端

10 万行流畅滚动 / 服务端排序筛选 / 树形数据

<v-click>

**虚拟列表（大数据场景）**

```vue
<a-table :columns="columns" :data="bigData"
  :virtual-list-props="{ height: 400 }"
  :pagination="false" :scroll="{ x: 1000 }" />
```

</v-click>

<v-click>

**服务端排序 / 筛选 / 分页**

```ts
const handleChange = (data, extra: { type: "pagination" | "sorter" | "filter" }) => {
  fetchData({
    page: extra.page?.current, sortField: extra.sorter?.field,
    sortDir: extra.sorter?.direction, filters: extra.filters,
  });
};
// <a-table @change="handleChange" /> —— sortable.sorter: true 关闭内部排序
```

</v-click>

<v-click>

**树形数据**：`<a-table :children-key="'children'" :indent-size="40" />` —— data 里嵌套 children

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 虚拟列表是 ATable 处理大数据的杀手锏 ——

普通表格渲染 10 万行会卡死浏览器（DOM 节点太多）。
虚拟列表只渲染当前可视区域 + 上下缓冲区的行（通常二三十行），
滚动时复用 DOM、更新内容 —— 10 万行也能丝滑滚动。

开启方式：传 virtual-list-props，里面设置 height（容器高度）。

但有几个重要约束：
1. 必须 :pagination="false" —— 虚拟列表 = 不分页，两者互斥
2. 建议配合固定列 fixed 和横向 scroll.x —— 防止水平滚动性能下降
3. 虚拟列表内部用 transform: translate3d 定位，
   所以不能和「展开行」「树形数据」「行合并」共用 —— 这是踩坑章节会再强调的

[click] 服务端排序 / 筛选 / 分页 ——

大数据场景下，排序和筛选不应该在前端做（数据根本不全），要走服务端。

关键是 @change 事件 —— 不管是分页、排序、还是筛选触发，
都会调 handleChange，回调里第二个参数 extra 有个 type 字段，
告诉你这次变化是 'pagination' / 'sorter' / 'filter' 哪一种。

你在 handleChange 里根据 extra 拿到分页页码、排序字段、排序方向、筛选条件，
拼成请求参数发给后端，后端返回对应的数据。

要让排序走服务端，column 的 sortable.sorter 要设成 true ——
sorter: true 表示「关闭表格内部排序，只触发 change 事件」。
如果 sorter 是个比较函数，那就是前端本地排序。

[click] 树形数据 ——

ATable 支持树形展示 —— data 数组里的每一项可以有 children 字段嵌套子行。

开启方式：
- children-key 指定子节点字段名（默认就是 'children'）
- indent-size 控制每层缩进的像素

注意：树形数据和虚拟列表不能共用（同样是 transform 冲突）。
如果是「树形 + 超大数据」，官方建议用 <a-tree> 组件替代 <a-table>。

ATable 单组件就覆盖了 Element Plus 的 ElTable + ElTableV2 两个组件、
以及 Naive UI DataTable 的全部能力 —— 虚拟列表 / 树形 / 列拖拽 /
行列固定 / 行选择 / 展开行 / 服务端排序筛选 / 单元格合并 / 列分组。
-->

---
transition: fade-out
---

# 反馈三件套：全局静态 API

Modal / Message / Notification —— 无需 Provider 嵌套

<v-click>

**Message（顶部消息条）+ Notification（角落通知）**

```ts
import { Message, Notification } from "@arco-design/web-vue";

Message.success("保存成功");
Message.loading({ content: "处理中...", duration: 0 });  // 不自动关闭
Notification.info({ title: "系统消息", content: "您有 3 条新待办" });
```

</v-click>

<v-click>

**Modal.confirm（确认对话框，Promise 风格）**

```ts
import { Modal } from "@arco-design/web-vue";

Modal.confirm({
  title: "确认删除", content: "删除后不可恢复，确定继续？",
  okText: "删除", cancelText: "取消",
  okButtonProps: { status: "danger" },
  onOk: async () => { await api.delete(id); Message.success("已删除"); },
  // onOk 返回 false 可阻止关闭
});
```

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Arco 的反馈三件套全部是「全局静态方法」——
import 进来直接调用，无需任何 Provider 嵌套。

这是 Arco 与 Naive UI 最大的差异 ——
Naive UI 必须包 <n-message-provider>，用 useMessage() 组合式 API。
Arco 像 Element Plus 一样，直接 Message.success() 就行。
对于从 Element Plus 迁移的团队，几乎零学习成本。

Message —— 顶部消息条，瞬时反馈：
- success / error / warning / info / loading 五种
- 默认 3 秒自动消失
- loading 类型配 duration: 0 表示不自动关闭，需要手动调返回值的 close()
- 适合「保存成功 / 删除完成 / 网络异常」这种瞬时通知

Notification —— 角落通知卡片，信息更丰富：
- info / success / warning / error 四种
- 带 title + content，默认 4.5 秒
- position 控制位置：topLeft / topRight / bottomLeft / bottomRight
- 适合「系统消息 / 待办提醒」这种非紧急但需要注意的通知

[click] Modal —— 模态对话框，最重的反馈：

Modal 有两种用法：
1. 声明式：<a-modal v-model:visible="visible">，配合 @ok / @cancel
2. 静态方法：Modal.confirm / info / success / warning / error / open

静态方法 Modal.confirm 的配置：
- title / content：标题和内容
- okText / cancelText：按钮文字
- okButtonProps：给 OK 按钮传 props ——
  代码里传了 status: 'danger'，让「删除」按钮变红色
- onOk / onCancel：点击回调
- onOk 可以是 async 函数 —— 异步操作期间 OK 按钮自动 loading
- onOk 返回 false 可以「阻止弹窗关闭」—— 比如校验没过就别关

危险操作必用 Modal.confirm！
删除、批量操作、不可逆变更 —— 没有二次确认等于挖坑等用户踩。

Modal.confirm 默认隐藏 Cancel 按钮的只有 info / success / warning / error，
confirm 本身是带 Cancel 的。
Modal.destroyAll() 可以一次关闭所有命令式弹窗。
-->

---
transition: fade-out
---

# ConfigProvider 全局配置

locale / size / prefix-cls 一处注入，类似 React Context

<v-click>

```vue
<template>
  <a-config-provider :locale="zhCN" :size="size"><router-view /></a-config-provider>
</template>

<script setup lang="ts">
import { ref } from "vue";
import zhCN from "@arco-design/web-vue/es/locale/lang/zh-cn";
const size = ref<"mini" | "small" | "medium" | "large">("medium");
</script>
```

</v-click>

<v-click>

| Prop               | 说明                                     | 默认值     |
| ------------------ | ---------------------------------------- | ---------- |
| `locale`           | 语言包（组件内置文案）                   | en-US      |
| `size`             | 全局组件尺寸 mini / small / medium / large | medium     |
| `prefix-cls`       | CSS class 前缀（隔离多个 Arco 实例）     | `arco`     |

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] ConfigProvider 是 Arco 的全局配置中心 ——
类似 React 的 Context，一处注入、整个 App 子树生效。

注意一个重要区别：
Arco 的 ConfigProvider 不是「必须包根」的硬性要求 ——
因为反馈三件套是全局静态 API，不依赖 Provider。
但实际项目里强烈建议包根，因为你需要 locale（中文）和 size（全局尺寸）。

最典型用法就是包在 App.vue 最外层，里面套 <router-view />。

locale 传中文语言包 —— 从 @arco-design/web-vue/es/locale/lang/zh-cn 导入。
Arco 默认是英文的，国内项目必须切中文。

size 控制全局组件尺寸 —— mini / small / medium / large，
设置后所有 Arco 组件（按钮、输入框、表格等）统一用这个尺寸。
比如做「紧凑型后台」可以全局设 small。

[click] ConfigProvider 的完整 prop：

- locale：语言包，控制组件内置文案（分页的「条/页」、表格的「确定/重置」、
  空状态的「暂无数据」等）。默认 en-US，国内项目传 zhCN。

- size：全局组件尺寸，默认 medium。

- prefix-cls：CSS class 前缀，默认 'arco'（生成的 class 都是 arco-btn 之类）。
  这个一般不用改 —— 除非一个页面里同时跑两个不同版本的 Arco（微前端场景），
  才需要改前缀来隔离样式冲突。

- update-at-scroll：默认 false。
  开启后，页面滚动时会实时更新 Tooltip / Popover 的浮层位置 ——
  适合「浮层挂在滚动容器内」的场景，但有一定性能开销。

对比 Naive UI 需要嵌套四五个 Provider，Arco 一个 ConfigProvider 就够了 ——
因为反馈类功能用全局静态 API 解决了，不需要 Provider 来分发实例。
这也是 Arco「易用优先」理念的体现。
-->

---
transition: fade-out
---

# 主题深度（一）：双轨制

CSS Variables 运行期 + Less 变量编译期

<v-click>

**方案一：CSS Variables（运行期，灵活）**

```css
:root {
  --color-primary-6: #165dff;   /* 主色，色阶 1-10 */
  --color-text-1: #1d2129;
}
body[arco-theme='dark'] {
  --color-primary-6: #3c7eff;   /* 暗色覆盖 */
}
```

</v-click>

<v-click>

**方案二：Less 变量（编译期，彻底）**

```ts
// vite.config.ts
css: {
  preprocessorOptions: {
    less: {
      modifyVars: { "arcoblue-6": "#f85959" },  // 主色改红
      javascriptEnabled: true,                  // 必须 true
    },
  },
}
```

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Arco Design Vue 的主题系统是「双轨制」——
CSS Variables 和 Less 变量两条轨道，各有适用场景。

方案一：CSS Variables（运行期）。

Arco 暴露了大量 CSS Variables，可以在任何地方覆盖。

命名规则：--color-{type}-{n}
- type：primary / success / warning / danger / text / bg / border / fill / neutral
- n：1-10 的色阶（1 最浅、10 最深）
- 例如 --color-primary-6 是主色，--color-primary-1 是主色最浅的 tint

CSS Variables 的优势是「运行期」——
可以在浏览器 DevTools 里实时改，与暗色模式天然兼容。
代码里 body[arco-theme='dark'] 这个选择器就是暗色模式下的变量覆盖 ——
切换暗色时这套变量自动生效。

日常推荐用 CSS Variables —— 灵活、可运行时切换、和暗色 / 多主题配合好。

[click] 方案二：Less 变量（编译期）。

Less 变量是「编译期」修改 —— 在 vite.config.ts 的
css.preprocessorOptions.less.modifyVars 里改。

注意 Less 变量的命名和 CSS Variables 不一样 ——
主色的 Less 变量是 @arcoblue-6（不是 primary）。
状态色是 green-6 / orange-6 / red-6 等。

代码里把 arcoblue-6 改成 #f85959，
所有用了 @arcoblue-6 的组件全部变成红色 —— 整站彻底换色。

关键：javascriptEnabled 必须设成 true ——
因为 Arco 的 Less 变量内部用了 JS 表达式来计算色阶，
不开这个选项 Less 编译会直接报错。这是踩坑章节会再强调的点。

什么时候用 Less 变量？
品牌色全站统一覆盖、需要比 CSS Variables 更彻底的定制时用。
CSS Variables 只能覆盖暴露出来的那些变量，
Less 变量能改到色阶生成的源头，覆盖更全面。

完整 Less 变量列表有数百个，在官方仓库的 tokens.less 文件里。
-->

---
transition: fade-out
---

# 主题深度（二）：Design Lab + 暗色模式

在线 GUI 拖拽生成主题 / 一行切换暗色

<v-click>

**Design Lab —— 国内 Vue UI 库独家的在线主题平台**

访问 [arco.design/themes](https://arco.design/themes) → 拖拽调色 → 实时预览 → 导出 npm 主题包

```ts
// main.ts —— 用导出的主题包替换默认 CSS
import "@arco-themes/web-mytheme/css/arco.css";
```

</v-click>

<v-click>

**暗色模式 —— 一个 body 属性搞定**

```ts
// 切换到暗色
document.body.setAttribute("arco-theme", "dark");
// 切换回亮色
document.body.removeAttribute("arco-theme");
```

</v-click>

<v-click>

> 💡 配合 VueUse 持久化：`useDark({ selector: 'body', attribute: 'arco-theme', valueDark: 'dark', valueLight: '' })` —— 一行实现「跟随系统 + localStorage」。

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Design Lab 是 Arco 的杀手锏 —— 国内 Vue UI 库里独家的在线主题平台。

它解决一个真实痛点：设计师想定制品牌主题，但不会写 Less / CSS 代码。

Design Lab 的工作流：
1. 访问 arco.design/themes
2. 在浏览器里拖拽调整 —— 改主色、改色阶、改圆角、改间距
3. 实时预览 —— 所有组件的效果立刻看到
4. 点「下载主题」—— 生成一个 npm package，比如 @arco-themes/web-mytheme
5. 项目里 pnpm add 这个包，然后在 main.ts 里 import 它的 css/arco.css，
   替换掉默认的 arco.css

整个过程设计师一个下午就能产出企业级品牌主题，不需要前端介入。

对比一下：
- Element Plus 靠改 SCSS 变量，需要写代码
- Naive UI 靠改 TypeScript 主题对象，需要写代码
- 只有 Arco 提供了可视化 GUI

[click] 暗色模式 —— Arco 做得极简。

只需要给 <body> 加一个 arco-theme="dark" 属性 ——
所有组件自动切换到暗色，不需要额外 import 任何暗色 CSS。

切回亮色就 removeAttribute 把这个属性删掉。

对比：
- Naive UI 需要 import darkTheme 主题对象，传给 NConfigProvider
- Element Plus 需要 <html class="dark"> + 引入暗色 CSS 文件
- Arco 就一个 body 属性 —— 是三者里最简单的

[click] 配合 VueUse 做持久化 ——

手动管理「暗色状态 + localStorage + 跟随系统」很繁琐。
VueUse 的 useDark 一行搞定。

关键是 useDark 的配置正好对应 Arco 的 body 属性方案：
- selector: 'body' —— 操作 body 元素
- attribute: 'arco-theme' —— 操作这个属性
- valueDark: 'dark' —— 暗色时属性值
- valueLight: '' —— 亮色时属性值（空，相当于移除）

这样 useDark 返回的 isDark ref 一变，
body 的 arco-theme 属性自动更新，
同时自动同步 localStorage、自动跟随系统 prefers-color-scheme。

多主题切换也可以做 —— 用 JS 动态 setProperty 改 --color-primary-6 这些
CSS Variables，就能在「默认蓝 / 红色 / 绿色」之间实时切换。
-->

---
transition: fade-out
---

# 国际化：13+ 语言包

字节出海项目的实战沉淀，覆盖比 Element Plus 更广

<v-click>

```vue
<template>
  <a-config-provider :locale="locale">
    <a-radio-group v-model="lang" type="button">
      <a-radio value="zh-CN">中文</a-radio>
      <a-radio value="en-US">English</a-radio>
    </a-radio-group>
    <a-pagination :total="50" show-total show-jumper />
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import zhCN from "@arco-design/web-vue/es/locale/lang/zh-cn";
import enUS from "@arco-design/web-vue/es/locale/lang/en-us";

const lang = ref<"zh-CN" | "en-US">("zh-CN");
const map: Record<string, any> = { "zh-CN": zhCN, "en-US": enUS };
const locale = computed(() => map[lang.value] || zhCN);
</script>
```

</v-click>

<v-click>

> 💡 内置 13+ 语言：zh-CN / en-US / ja-JP / ko-KR / es-ES / fr-FR / de-DE / it-IT / id-ID / pt-PT / th-TH / vi-VN / nl-NL。与 Naive UI 不同，Arco 只有一个 locale 包，不分组件 locale 和日期 locale。

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Arco 的国际化方案很简洁 —— ConfigProvider 接一个 locale prop 就够了。

语言包从 @arco-design/web-vue/es/locale/lang/ 目录下导入，
比如 zh-cn、en-us、ja-jp 等。

动态切换语言的标准模式（代码里的例子）：
- 用一个 ref（lang）记录当前语言
- 用一个 map 把语言 key 映射到对应的 locale 对象
- 用 computed 根据 lang 返回对应的 locale
- ConfigProvider 绑这个 computed —— lang 一变，整个 App 的组件文案就切换

代码里还放了 <a-pagination> 做演示 ——
切换语言时，分页器的「条/页」「前往」「共 N 条」这些文案会跟着变。

[click] 13+ 语言包是 Arco 的一个亮点 ——

内置语言：简体中文、英文、日文、韩文、西班牙文、法文、德文、
意大利文、印尼文、葡萄牙文、泰文、越南文、荷兰文。

注意里面有印尼文、泰文、越南文 —— 这些是东南亚语言。
为什么 Arco 覆盖这么全？因为字节有大量出海业务 ——
TikTok Shop、Lark（飞书国际版）等在东南亚、欧洲都有业务，
这些语言包是字节出海项目实战沉淀下来的。国际化覆盖比 Element Plus 内置更广。

[click] 一个和 Naive UI 的重要区别 ——

Naive UI 把国际化拆成两个 prop：
- locale：组件内置文案
- dateLocale：日期组件的月份 / 星期名

Arco 只有一个 locale 包，不分组件 locale 和日期 locale —— 简单直接。

如果业务还需要国际化业务文案（不只是组件文案），
标准做法是 Arco locale 管组件文案、vue-i18n 管业务文案，
两者共享同一个语言 state，切换时一起更新。

注意一个常见坑：如果 AForm 校验提示显示英文（Please enter ...），
通常就是没配 zhCN locale，或者 <a-form> 用在了 <a-config-provider> 外面。
-->

---
transition: fade-out
---

# 图标：700+ 自研 Arco Icons

内置图标包，无需额外安装第三方图标库

<v-click>

**三种用法**

```vue
<script setup lang="ts">
import { IconPlus } from "@arco-design/web-vue/es/icon";
</script>
<template>
  <icon-plus />
  <icon-star :size="24" :spin="true" />
  <a-button><template #icon><IconPlus /></template>新增</a-button>
</template>
```

</v-click>

<v-click>

| 类别       | 常用图标                                                  |
| ---------- | --------------------------------------------------------- |
| 基础操作   | IconPlus / IconEdit / IconDelete / IconRefresh / IconSearch |
| 导航菜单   | IconHome / IconMenu / IconMenuFold / IconApps / IconList  |
| 状态反馈   | IconCheckCircleFill / IconCloseCircleFill / IconLoading   |

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Arco Design Vue 内置 700+ 自研的 Arco Icons ——

这是和 Naive UI、Element Plus 的一个差异：
- Naive UI 不带图标，要自己装 @vicons/*
- Element Plus 的图标在单独的 @element-plus/icons-vue 包里
- Arco 的图标就在主包 @arco-design/web-vue 里，无需额外安装

而且 Arco Icons 是字节自研的，和 Arco Design 设计系统视觉一致 ——
不会出现「按钮是 Arco 风格、图标是另一套风格」的违和感。

三种用法：

1. 全量注册：main.ts 里 app.use(ArcoVueIcon)，
   之后模板里直接写 <icon-plus /> 这种 kebab-case 标签。

2. 按需引入：配好 ArcoResolver({ resolveIcons: true }) 后，
   模板里写 <icon-plus />，插件自动 import IconPlus。

3. 手动 import：从 @arco-design/web-vue/es/icon 导入 IconPlus，
   模板里用 PascalCase 的 <IconPlus />。

图标本身的 props：
- size：尺寸
- spin：是否旋转（loading 图标常用）
- rotate：旋转角度
- color：颜色

图标常和按钮配合 —— <a-button> 的 #icon 插槽放图标，
就是「带图标的按钮」。

[click] 700+ 图标分类速查 ——

实际项目高频用到的就这几类：

- 基础操作：IconPlus（新增）、IconEdit（编辑）、IconDelete（删除）、
  IconRefresh（刷新）、IconSearch（搜索）—— CRUD 页面必备
- 导航菜单：IconHome、IconMenu、IconMenuFold（菜单折叠）、
  IconApps、IconList —— 后台侧边栏用
- 状态反馈：IconCheckCircleFill（成功）、IconCloseCircleFill（失败）、
  IconLoading（加载）—— 注意带 Fill 后缀的是实心图标
- 用户权限：IconUser、IconUserGroup、IconLock、IconShield ——
  用户管理、权限模块用

完整 700+ 图标列表在官网 arco.design/vue/component/icon，
那里可以搜索、预览、复制图标名。
-->

---
transition: fade-out
---

# TypeScript 实战

完整类型推导，所有核心类型都有 .d.ts

<v-click>

**表单 + 表格类型**

```ts
import type { FormInstance, FieldRule } from "@arco-design/web-vue/es/form";
import type { TableColumnData, TableData }
  from "@arco-design/web-vue/es/table/interface";

const formRef = ref<FormInstance | null>(null);
const rules: Record<string, FieldRule[]> = {
  username: [{ required: true, minLength: 3, maxLength: 20 }],
};

interface User extends TableData { key: string; name: string; email: string; }
const columns: TableColumnData[] = [{ title: "姓名", dataIndex: "name" }];
const data: User[] = [];
```

</v-click>

<v-click>

**调用实例方法**

```ts
onMounted(async () => {
  const errors = await formRef.value?.validate();
  formRef.value?.scrollToField("email");  // IDE 自动补全所有方法
});
```

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Arco Design Vue 是 100% TypeScript 编写的 ——
源码构成 66.1% TypeScript + 18.4% Vue + 14.0% Less。

这意味着所有组件、API、locale、theme 都自带完整的 .d.ts，
不需要额外装 @types/arco-design-vue 之类的类型包。

核心类型，注意它们的导入路径：

表单类型从 @arco-design/web-vue/es/form 导入：
- FormInstance：表单实例类型，标注 formRef 用
- FieldRule：单条校验规则的类型 —— rules 对象可以标成
  Record<string, FieldRule[]>，每条规则都有类型检查

表格类型从 @arco-design/web-vue/es/table/interface 导入：
- TableColumnData：列定义类型
- TableData：行数据基础类型 —— 你的业务行接口可以 extends TableData
- TableRowSelection：行选择配置类型

代码里 interface User extends TableData ——
让你的 User 类型继承 ATable 要求的基础结构（比如 key 字段），
然后 data: User[] 就既满足 ATable 要求、又有完整业务字段类型。

还有其他核心类型：
- MenuOption：菜单项类型，从 es/menu/interface 导入
- MessageReturn / NotificationReturn / ModalReturn：
  反馈三件套的返回值类型（都有 close 方法）

[click] 标注 FormInstance 后，调实例方法时 IDE 会自动补全 ——

FormInstance 上有这些方法：
- validate：全部校验，返回 Promise
- validateField：单字段校验
- resetFields：重置（清值 + 清校验状态）
- clearValidate：仅清校验状态
- setFields：手动设字段值 / 状态 —— 异步校验失败回写错误时用
- scrollToField：滚动到指定字段

代码里 await formRef.value?.validate() ——
用 .value? 安全访问（template ref 初始是 null），
然后 IDE 知道返回的是 errors，知道 scrollToField 接受一个字段名字符串。

「类型即文档」—— 敲一个点，所有可用方法和参数都列出来，
不用反复查官方文档。这是 Arco 100% TypeScript 带来的开发体验。
-->

---
transition: fade-out
---

# Modal / Drawer 容器组件

声明式弹层 —— v-model:visible 双向绑定

<v-click>

**AModal（声明式，承载表单）**

```vue
<a-modal v-model:visible="visible" title="编辑用户"
  :ok-loading="loading" @ok="handleOk" @cancel="visible = false">
  <a-form :model="form">
    <a-form-item field="name" label="姓名"><a-input v-model="form.name" /></a-form-item>
  </a-form>
</a-modal>
```

</v-click>

<v-click>

**ADrawer（抽屉，四个方向）**

```vue
<a-drawer v-model:visible="visible" title="筛选条件"
  placement="right" :width="400" unmount-on-close>
  <a-form :model="filters" layout="vertical">...</a-form>
</a-drawer>
```

</v-click>

<v-click>

> 💡 `placement` 支持 right / left / top / bottom。建议加 `unmount-on-close` —— 关闭时销毁 DOM，避免表单状态残留。

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 上一页讲了 Modal 的静态方法用法，这页讲它的声明式用法 ——
以及它的兄弟组件 Drawer。

AModal 声明式用法：
- v-model:visible 双向绑定显示状态（注意是 visible，不是 Naive UI 的 show）
- title 设标题
- ok-loading 控制 OK 按钮的 loading 状态
- @ok / @cancel 监听点击事件

声明式 Modal 最典型的场景是「承载表单」——
弹窗里放一个 <a-form>，做新增 / 编辑。

代码里 handleOk 通常是这样的逻辑：
设 loading = true → 调接口 → 接口完成 → loading = false →
visible = false 关弹窗 → Message.success 提示。

什么时候用声明式、什么时候用静态方法？
- 静态方法 Modal.confirm：简单确认（删除确认、信息提示），内容简单
- 声明式 <a-modal>：复杂内容（表单、富交互），需要 v-model 控制

[click] ADrawer 是抽屉 —— 从屏幕边缘滑出的容器。

用法和 Modal 类似 —— v-model:visible 控制显示。

placement 控制从哪个方向滑出：right（默认）/ left / top / bottom。
- 右侧抽屉：最常见，放详情、编辑表单、筛选条件
- 左侧抽屉：常放导航菜单
- 上 / 下抽屉：放筛选面板、批量操作区

宽度用 width（左右抽屉）、高度用 height（上下抽屉）。

代码里 layout="vertical" 是表单的垂直布局 ——
抽屉通常比较窄，label 放在输入框上方更合适。

[click] unmount-on-close 是个重要的体验细节 ——

默认情况下，Drawer / Modal 关闭后 DOM 还在（只是隐藏）。
这意味着里面的表单状态会残留 —— 下次打开还是上次填的内容。

加上 unmount-on-close，关闭时直接销毁内部 DOM ——
下次打开是全新的、干净的表单。

对于「每次打开都应该是空白表单」的新增场景，
unmount-on-close 几乎是必加的。

Drawer 其他常用 prop：
- mask-closable：点遮罩是否关闭，默认 true
- close-on-esc：ESC 是否关闭，默认 true
- footer：是否显示底部按钮区，传 false 可隐藏
-->

---
transition: fade-out
---

# SSR + Nuxt 3 集成

v2.44.3+ 添加 exports 配置，Nuxt 3 即装即用

<v-click>

**nuxt.config.ts**

```ts
export default defineNuxtConfig({
  css: ["@arco-design/web-vue/dist/arco.css"],
  build: { transpile: ["@arco-design/web-vue"] },
});
```

</v-click>

<v-click>

**Nuxt plugin —— 注入 Vue 上下文（client only）**

```ts
// plugins/arco.client.ts —— .client 后缀确保只在浏览器执行
import { Modal, Message, Notification } from "@arco-design/web-vue";

export default defineNuxtPlugin((nuxtApp) => {
  Modal._context = nuxtApp.vueApp._context;
  Message._context = nuxtApp.vueApp._context;
  Notification._context = nuxtApp.vueApp._context;
});
```

</v-click>

<v-click>

> 💡 关键原则：Modal / Message / Notification 静态方法只在 client 调用（包在 `onMounted` 里），SSR 阶段无 DOM 会报错。

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Arco Design Vue 的 SSR / Nuxt 3 支持 ——

早期版本曾有 SSR 兼容问题，但从 v2.44.3 开始，
Arco 在 package.json 里添加了标准的 exports 配置 ——
现在 Nuxt 3 + Arco Design Vue 即装即用。

nuxt.config.ts 只要两行配置：
- css：把 arco.css 加进全局样式
- build.transpile：把 @arco-design/web-vue 加进 transpile 列表 ——
  这是因为 Arco 是 ESM 包，Nuxt 的 SSR 构建需要明确 transpile 它

如果要按需引入，在 nuxt.config.ts 的 vite.plugins 里
配 AutoImport + Components + ArcoResolver，和 Vite 项目一样。

[click] Nuxt plugin 注入 Vue 上下文 ——

这一步是为了让 Modal.confirm 等静态方法内部能用到
vue-i18n、vue-router 等通过 provide 注入的功能。

把 Modal._context、Message._context、Notification._context
设成 nuxtApp.vueApp._context —— 把 Vue App 的上下文注入给静态 API。

关键是文件名后缀 .client.ts ——
Nuxt 约定 .client 后缀的 plugin 只在浏览器端执行。
这很重要，因为 Modal 这类命令式 API 依赖 DOM，
如果在 server 端执行会直接报错。

不注入 _context 也能用 Modal —— 但弹窗内部如果用到 $t() / <router-link>
会失效。这是踩坑章节会再讲的点。

[click] SSR 最核心的原则 —— 静态方法只在 client 调用。

Modal / Message / Notification 这些命令式 API 需要操作 DOM ——
SSR 阶段（在 Node 服务器上）根本没有 document、没有 DOM。

如果在 setup 顶层直接调 Message.success('...')，
SSR 渲染时就会报错。

正确做法：包在 onMounted 里 —— onMounted 只在客户端执行。
同样的，读 document.body.getAttribute('arco-theme') 这种暗色判断，
也要包在 onMounted 里，否则 SSR 报错。

如果不遵守这个原则，最典型的症状就是
控制台报 Hydration node mismatch —— 服务端和客户端渲染结果对不上。

对比 Naive UI：Naive UI 因为 CSS-in-JS，SSR 还要额外处理样式 collect。
Arco 是预编译 CSS，SSR 反而比 Naive UI 简单 —— 只要注意命令式 API 的时机。
-->

---
transition: fade-out
---

# 与 Vue Router + Pinia 集成

a-layout + a-menu 模板写法搭后台骨架

<v-click>

```vue
<template>
  <a-config-provider :locale="zhCN">
    <a-layout style="height: 100vh">
      <a-layout-sider :width="220" theme="dark" collapsible breakpoint="lg">
        <a-menu theme="dark" :default-selected-keys="[activeMenu]"
          @menu-item-click="(key) => router.push(key)">
          <a-menu-item key="/">
            <template #icon><icon-home /></template>仪表盘
          </a-menu-item>
          <a-sub-menu key="/system">
            <template #icon><icon-settings /></template>
            <template #title>系统管理</template>
            <a-menu-item key="/system/users">用户管理</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-content style="padding: 24px"><router-view /></a-layout-content>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>
```

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Arco Design Vue 和 Vue Router + Pinia 一起用是零冲突的 ——
main.ts 里 app.use(router) + app.use(pinia) 就行。

这一页重点看后台骨架的模板写法 ——
a-layout 系列 + a-menu 是搭企业后台的核心。

a-layout 布局结构：
- <a-layout> 是容器，可以嵌套
- <a-layout-sider> 侧边栏 —— width 设宽度、theme 设主题（light/dark）、
  collapsible 可折叠、breakpoint 响应式断点（lg 表示窗口小于 lg 自动折叠）
- <a-layout-header> 顶栏
- <a-layout-content> 主内容区 —— 里面放 <router-view />
- <a-layout-footer> 底栏

代码里的结构是经典的「左侧栏 + 右侧内容」：
最外 a-layout 横向排，左边 a-layout-sider，右边再套一个 a-layout 放 content。

重点说 a-menu —— 这是 Arco 和 Naive UI 的一个明显差异：

Arco 的 a-menu 用「模板写法」——
<a-menu-item> 和 <a-sub-menu> 是真实的子组件标签。
这和 Element Plus 的 el-menu 体验几乎一样。

而 Naive UI 的 menu 用「JS 数组 + render 函数」配置。

模板写法的好处是直观 —— 菜单结构在模板里一目了然，
新人（尤其是从 Element Plus 来的）几乎零学习成本。

a-menu 的路由联动模式：
- <a-menu-item :key="路由路径"> —— key 直接用路由 path，方便联动
- @menu-item-click 事件 —— 注意是 menu-item-click，不是 select。
  回调拿到 key（也就是路由路径），直接 router.push(key) 跳转
- :default-selected-keys 设当前选中项 —— 用 computed 算 route.path
- <a-sub-menu> 的 #title 插槽放子菜单标题，#icon 插槽放图标

router-link 也可以直接放在 a-menu-item 里，不需要 v-slot 包装。

整个 App 只需要一个 <a-config-provider> 包根 —— 不需要其他 Provider。
配合 Pinia 管全局状态、Vue Router 管路由，就是一个完整的后台骨架。
-->

---
transition: fade-out
---

# 生态与配套库

围绕 Arco Design Vue 的官方工具链

<v-click>

| 库                          | 作用                                              |
| --------------------------- | ------------------------------------------------- |
| **arco-design-pro-vue**     | 官方企业级中后台模板（1.8k Star）                 |
| **arco-plugins**            | Vite / Webpack / Babel 按需引入插件               |
| **arco-design（React 版）** | 共享同一设计系统的官方 React 实现（6.6k Star）    |
| **@arco-themes/web-***      | Design Lab 导出的主题包                           |
| **@arco-design/color**      | Arco 调色板工具（10 色阶生成）                    |
| **unplugin-vue-components** | 配合 ArcoResolver 自动按需引入                    |

</v-click>

<v-click>

> 💡 **arco-design-pro-vue** 官方维护：TypeScript + Vue 3 + Vite + Pinia + Mock + 多主题 + 多语言 + 完整权限模型 —— 比从零搭建省 1-2 周。

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Arco Design Vue 的生态围绕官方仓库展开，主要这几个 ——

arco-design-pro-vue —— 这是重点。
它是 Arco 官方维护的企业级中后台模板，GitHub 1.8k Star。
注意「官方维护」这四个字 ——
对比 Element Plus 的 element-plus-admin、Naive UI 的 naive-ui-admin
都是社区维护的，只有 Arco 的 Pro 模板是官方维护。
官方维护意味着会持续跟进 Arco 版本、质量有保障。

arco-plugins —— 官方的按需引入插件集，覆盖 Vite / Webpack / Babel。
不过现在更推荐用 unplugin-vue-components + ArcoResolver 这套通用方案。

arco-design（React 版）—— 前面反复提到的，
共享同一设计系统的官方 React 实现，6.6k Star。
如果公司同时有 React 项目，这就是配套。

@arco-themes/web-* —— Design Lab 导出的主题包就是这个命名空间。

@arco-design/color —— Arco 的调色板工具，
输入一个主色能生成 10 个色阶，做自定义主题时有用。

unplugin-vue-components —— 配合 ArcoResolver 实现自动按需引入，
前面安装章节讲过。

[click] arco-design-pro-vue 值得详细说 ——

它内置的功能：
- TypeScript + Vue 3 + Vite + Pinia 现代技术栈
- 多主题 + 暗色 + 国际化（中英）
- 完整权限模型 —— 路由权限 + 按钮权限
- Mock 数据 + Axios 封装
- 多页签 + 动态面包屑
- 业务模板 —— Dashboard / List / Form / Profile / Result / Exception

目录结构是标准的企业后台组织：
api / components / layout / locale / router / store / views。

获取方式：pnpm create arco-design-pro，
或者直接 git clone arco-design-pro-vue 仓库。

如果你要做企业中后台，基于这个模板开发 ——
权限、布局、Mock、国际化这些基础设施都现成的，
比从零搭建省 1-2 周时间。这是 Arco 生态相对完整的体现。
-->

---
transition: fade-out
---

# 常见踩坑

8 个高频问题，记住少走弯路

<v-clicks>

- **CSS 没 import** → 组件白屏无样式：全量引入 import arco.css；按需引入 `ArcoResolver({ sideEffect: true })`
- **icon 路径变化** → v2.44.3 为兼容 Nuxt 3 调整 exports，老教程路径可能不准，统一用 `@arco-design/web-vue/es/icon`
- **Modal 上下文丢失** → 弹窗内 `$t()` / `<router-link>` 报错：main.ts 里设 `Modal._context = app._context`
- **SSR hydration mismatch** → 命令式 API 在 server 执行：包进 `onMounted`，暗色判断也包进去
- **Less 主题编译失败** → 缺 `javascriptEnabled: true`：Arco 的 Less 变量内部用了 JS 表达式
- **虚拟列表与展开行 / 树形冲突** → 虚拟列表用 transform 定位，不兼容这些特性，需二选一
- **校验提示英文** → 没配 zhCN locale 或 `<a-form>` 在 `<a-config-provider>` 外
- **ArcoResolver 版本错误** → 按需引入要求 Arco Design Vue >= v2.11.0，升级到 latest

</v-clicks>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 坑 1：CSS 没 import。
这是新手头号坑 —— 组件渲染出来了，但白屏 / 无边框 / 无颜色。
原因就是没 import CSS。
全量引入修复：import '@arco-design/web-vue/dist/arco.css'。
按需引入修复：ArcoResolver 里设 sideEffect: true ——
否则插件只 import 组件 JS、不 import 对应 CSS。

[click] 坑 2：icon 包路径变化。
v2.44.3 为了兼容 Nuxt 3，给 package.json 加了 exports 配置。
老路径 @arco-design/web-vue/es/icon 仍然能用，
但部分构建工具会变严格 —— 老教程里的 icon 路径可能不准。
统一用官方推荐的 @arco-design/web-vue/es/icon，
并确保 lock 文件没锁住老版本。

[click] 坑 3：Modal 上下文丢失。
Modal.confirm 弹窗内如果用到 $t()（vue-i18n）或 <router-link>（vue-router），
可能报错 —— 因为静态 API 默认没拿到 Vue 上下文。
修复：main.ts 里把 app._context 赋给 Modal._context、
Message._context、Notification._context。

[click] 坑 4：SSR hydration mismatch。
Nuxt 3 项目报 Hydration node mismatch。
原因：Modal 等命令式 API 在 server 端执行报错，
或者暗色判断 document.body.getAttribute(...) 在 SSR 阶段没有 document。
修复：所有命令式 API 调用、所有读 document 的代码，都包进 onMounted ——
onMounted 只在客户端执行。

[click] 坑 5：Less 主题编译失败。
定制 Less 变量后构建报错（Cannot read property of undefined 之类）。
原因：缺少 javascriptEnabled: true。
Arco 的 Less 变量内部用了 JS 表达式来计算色阶，
不开这个选项 Less 引擎不认识那些表达式。
修复：vite.config.ts 的 less 配置里加 javascriptEnabled: true。

[click] 坑 6：虚拟列表与展开行 / 树形冲突。
开了 virtual-list-props 后，:expandable 展开行或 children-key 树形不生效。
原因：虚拟列表内部用 transform: translate3d 定位行，
和展开 / 树形 / 行合并这些特性互斥。
修复：数据量小就关虚拟列表；数据量大又要展开，
就改成点击行打开 Drawer / Modal 显示详情；
树形 + 大数据用 <a-tree> 替代 <a-table>。

[click] 坑 7：校验提示英文。
AForm 校验失败提示是英文 Please enter...。
原因：没配中文 locale，或者 <a-form> 用在了 <a-config-provider> 外面。
修复：确保 <a-config-provider :locale="zhCN"> 包住了 <a-form>。

[click] 坑 8：ArcoResolver 版本错误。
按需引入插件报 version >= 2.11.0 required。
原因：ArcoResolver 要求 Arco Design Vue v2.11.0 以上，更早版本不支持。
修复：pnpm add @arco-design/web-vue@latest 升级。

这 8 个坑覆盖了 Arco 新手 90% 的问题 —— 记住能少走很多弯路。
-->

---
transition: fade-out
---

# 评价

字节大厂背书 / 双栈一致 / Pro 模板完整，但中文生态弱于 Element Plus

<v-clicks>

**优点**

- 字节跳动官方背书，飞书 / 抖音电商内部生产验证，企业级稳定性最有保障
- 唯一 React + Vue 双官方实现的国内设计系统，跨栈团队设计协作零摩擦
- Design Lab 在线主题平台 + arco-design-pro-vue 官方 Pro 模板，国内独家
- 全局静态 API 无需 Provider，Element Plus 用户迁移曲线极低
- 60+ 组件 + 13+ 语言包 + 700+ 自研图标，企业中后台 95%+ 开箱即用

**缺点**

- 国内市场份额第三，招聘 / 培训 / 中文教程数量远少于 Element Plus
- 设计语言企业气重，偏严肃高密度，不适合 C 端轻量产品
- 主题深度定制依赖 Less 编译，比 Naive UI 纯 TS 对象多一层
- icon 路径在 v2.44.3 前后有差异，老教程可能不准

</v-clicks>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Arco Design Vue 的优点很集中 —— 「大厂背书 + 双栈一致 + 企业级完整度」——

字节跳动官方背书是最硬的优势 ——
Element Plus 出自饿了么 + 社区，Naive UI 出自图森未来，
而 Arco 是字节这个超大型互联网公司多业务线联合维护的。
飞书、抖音电商等内部产品的真实流量验证过它，企业选型几乎没有维护风险。

双栈一致是 Arco 独有的能力 ——
React + Vue 双官方实现共享同一设计系统，
跨技术栈团队可以共用设计师、共用设计稿。

Design Lab + arco-design-pro-vue 是国内独家组合 ——
Design Lab 让设计师可视化产出主题，
官方 Pro 模板让企业后台开发省 1-2 周。

全局静态 API 让迁移成本极低 —— 从 Element Plus 来几乎无缝。

60+ 组件 + 13+ 语言 + 700+ 自研图标，企业中后台 CRUD 场景 95%+ 开箱即用。

[click] 缺点也要客观说 ——

国内市场份额是最大短板 ——
粗略估算 Element Plus 70%+、Ant Design Vue 15%+、Arco 8%+、Naive UI 5%+。
这意味着招聘市场上「会 Arco」的人少、
掘金 / B 站 / 知乎的 Arco 教程数量远少于 Element Plus、
遇到偏门问题更依赖 GitHub Issue 和英文文档。新人接受度还在爬坡。

设计语言企业气重 ——
Arco Design 是字节内部企业级设计语言（飞书 / 字节后台风），
偏严肃、信息密度高 —— 适合中后台，但不适合 C 端产品或设计驱动的轻量场景。
那种场景 Naive UI 的现代极简风更合适。

主题深度定制依赖 Less ——
虽然 CSS Variables 能覆盖一部分，但彻底定制还是要 Less + less-loader，
比 Naive UI 的纯 TypeScript 对象、Element Plus 的 CSS Variables 多一层编译。

icon 路径 v2.44.3 前后有差异 —— 老教程的 import 路径可能不准，要核对版本。

选型逻辑总结：
- 稳定 / 招聘市场 / 中文教程多 → Element Plus
- 字节同款 / 跨 React+Vue 双栈 / 想用官方 Pro 模板 / 企业中后台 → Arco Design Vue
- 设计驱动的 C 端轻量产品 / 尤雨溪推荐 → Naive UI
- 海外项目 / 严格 Material Design → Vuetify
-->

---
transition: fade-out
---

# 学习路径

从入门到熟练应用的 4 个阶段

<v-click>

**第 1 周：核心组件熟练**

- 通读 General + Data Entry + Data Display 三大分组
- 跑通 AButton / AInput / AForm 第一个完整示例
- 实现 CRUD 页面（ATable + AForm + AModal 三件套）

</v-click>

<v-click>

**第 2 周：反馈 + 全局配置**

- 熟练 Modal / Message / Notification 静态 API + 声明式用法
- 用 ConfigProvider 配 locale / size，跑通中文 + 暗色

</v-click>

<v-click>

**第 3-4 周：主题 + 企业级整合**

- 跑通 CSS Variables + Less 双轨主题，体验 Design Lab
- 接入 Vue Router + Pinia + Vite，搭后台骨架

</v-click>

<v-click>

**长期**：基于 arco-design-pro-vue 模板开发真实企业中后台项目

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 第一周打基础 ——

Arco 官方文档结构清晰，General → Data Entry → Data Display
三个分组覆盖 80% 的日常组件。

官方所有 demo 都能在线预览、可改可跑，是最快的学习方式。

第一个里程碑：跑通入门示例 ——
AButton + AInput + AForm 组合，体会 v-model、field、rules、@submit。

第二个里程碑：完成一个 CRUD 页面 ——
ATable 展示数据 + AForm 编辑 + AModal 承载表单 + Message 反馈。
做出这个就算入门了。

[click] 第二周进阶 ——

反馈三件套是 Arco 的高频功能：
- Modal：confirm 静态确认 + 声明式弹窗承载表单
- Message：顶部瞬时消息
- Notification：角落通知卡片

要分清「静态方法」和「声明式」两种用法的适用场景。

同时把 ConfigProvider 用起来 —— 配 locale 切中文、配 size 统一尺寸，
再跑通暗色模式（body 加 arco-theme="dark"）。

[click] 第三到四周企业级整合 ——

主题系统是分水岭：
- CSS Variables 运行期切换
- Less 变量编译期定制
- Design Lab 在线 GUI 生成主题包
能把这三种方式都跑通，就超过 90% 的同行了。

然后把 Arco 和工程化拼起来 ——
单独的 Arco 只是组件库，要变成企业后台需要：
Vue Router（路由）+ Pinia（状态）+ Vite（构建）+
a-layout / a-menu（布局骨架）。
把这些拼通就是一个完整的企业级 Arco 前端项目。

[click] 长期投入 ——

直接基于 arco-design-pro-vue 官方模板开发真实项目 ——
权限模型、布局、Mock、国际化、多页签这些基础设施都现成的。

在真实项目里踩坑、积累经验，比单纯看文档成长快得多。
遇到问题多翻 GitHub Issue —— Arco 仓库的 Issue 响应快，
很多问题已经有现成答案。
-->

---
transition: fade-out
---

# 延伸学习资源

官方 + 生态精选

<v-click>

**官方资源**

- 📖 [Arco Design Vue 官网](https://arco.design/vue) —— 中英双语，组件 demo 可在线预览
- 🎨 [Arco Design 设计系统](https://arco.design/) —— 设计语言 + token 规范
- 💻 [GitHub 主仓库](https://github.com/arco-design/arco-design-vue) —— 3.1k Star，Issue 响应快

</v-click>

<v-click>

**生态项目**

- [arco-design-pro-vue](https://github.com/arco-design/arco-design-pro-vue) —— 官方企业级 Pro 模板
- [Design Lab](https://arco.design/themes) —— 在线主题平台，拖拽生成主题包
- [arco-design（React 版）](https://github.com/arco-design/arco-design) —— 共享设计系统的 React 实现

</v-click>

<v-click>

**配套技术栈**

- Vue Router + Pinia + Vite = 黄金组合
- VueUse + Axios + ECharts = 实用三件套

</v-click>

<style>
h1 {
  background-color: #165DFF;
  background-image: linear-gradient(45deg, #165DFF 10%, #4080FF 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 官方资源是第一手信息 ——

Arco Design Vue 官网 arco.design/vue 是核心资源 ——
中英双语，每个组件都有可在线预览的 demo、清晰的 API 表格。
质量与 Element Plus 官方文档持平。

Arco Design 设计系统主站 arco.design ——
讲设计语言、设计原则、token 规范，
对接设计师协作时很有用。

GitHub 主仓库 arco-design-vue，3.1k Star。
Issue 区是问题解答的金矿 —— 字节官方维护，Issue 响应快，
你遇到的问题大概率已经有人提过。

[click] 生态项目 ——

arco-design-pro-vue —— 官方企业级 Pro 模板，
做真实中后台项目直接基于它开发。

Design Lab（arco.design/themes）—— 在线主题平台，
设计师拖拽生成主题包的地方，Arco 独家工具。

arco-design（React 版）—— 如果团队同时有 React 项目，
这是共享同一设计系统的官方 React 实现。

还有更新日志 arco.design/vue/docs/changelog ——
升级版本前一定要看，了解 break change。

[click] 配套技术栈 ——

「Vue Router + Pinia + Vite」是 2024-2026 年 Vue 3 现代项目的事实标准。
Arco 和它们零冲突。

实用三件套：
- VueUse 提供 200+ 实用 composable，
  和 Arco 配合好 —— 特别是 useDark 做暗色持久化
- Axios 做 HTTP 请求
- ECharts 做图表，配合 Arco 的 Card / Table 做数据看板极佳

把 Arco + 这套技术栈拼起来，就是一个完整的现代企业级 Vue 3 项目。

如果要更省事，直接用 arco-design-pro-vue 模板 —— 这些都已经集成好了。
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 🎨

Arco Design Vue — 字节跳动企业级 Vue 3 组件库

<div class="mt-8 text-lg">

**核心心智**

- 字节官方出品，60+ 组件 + 100% TypeScript，企业中后台 95%+ 开箱即用
- 全局静态 API（Modal / Message / Notification）无需 Provider，迁移曲线低
- 双轨主题：CSS Variables 运行期 + Less 变量编译期 + Design Lab 在线 GUI
- 暗色一行搞定：body 加 arco-theme="dark"
- 唯一 React + Vue 双官方实现，配套官方 Pro 模板 arco-design-pro-vue

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://arco.design/vue" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/arco-design/arco-design-vue" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://arco.design/themes" target="_blank" class="slidev-icon-btn">
    <carbon:color-palette /> Design Lab
  </a>
</div>
