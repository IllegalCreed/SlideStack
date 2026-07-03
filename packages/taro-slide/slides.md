---
theme: seriph
background: https://cover.sli.dev
title: Taro 深入浅出
info: |
  京东开源的多端统一开发框架，一套代码编译到小程序 / H5 / RN / 纯血鸿蒙。

  基于 Taro 4.x · 了解更多 [docs.taro.zone](https://docs.taro.zone/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Taro

京东开源的**多端统一**框架，一套代码跑遍小程序 / H5 / RN / 鸿蒙（基于 4.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/NervJS/taro" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好，今天聊 Taro —— 京东开源的跨端框架，写一套代码就能编译到微信小程序、H5、React Native 乃至纯血鸿蒙。它在国内小程序跨端领域和 uni-app 并称双雄。
-->

---
transition: fade-out
---

# 什么是 Taro

一句话：写一套代码，**编译到多个终端**

<v-clicks>

- 京东**凹凸实验室（NervJS）**开源，定位「开放式跨端跨框架解决方案」
- 一套代码编译到**小程序全家桶**：微信 / 支付宝 / 抖音 / 百度 / QQ / 京东…10+ 家
- 还能编译到 **H5**、**React Native**（3.2+）、**纯血鸿蒙**（4.1+）
- 遵循**微信小程序规范**做统一：组件名、API、路由、配置都对齐微信 DSL
- GitHub 约 **37k+** star，与 uni-app 并称国内跨端小程序框架「双雄」

</v-clicks>

<!--
Taro 的核心承诺就是多端统一：一份代码产出十几个端。它的统一基准选了微信小程序规范，其它端做适配层，所以你会看到组件名、API 名都很像微信小程序。
-->

---
transition: fade-out
---

# 主打 React，也支持 Vue3

与 uni-app 的核心分野：框架取向不同

<div grid="~ cols-2 gap-4">

<div>

**Taro = React 系为主**

- 首选 **React**（JSX + Hooks）
- 也支持 **Vue3 / Vue2 / Preact / Nerv / Svelte**
- 主线与生态最全的是 **React 与 Vue3**

</div>

<div>

**uni-app = Vue 系为主**

- 以 **Vue** 单文件组件为核心
- 两者是国内跨端小程序「双雄」
- 选型看团队栈：React 团队优先 Taro

</div>

</div>

<!--
这是最常被问的对比。记住一句话：Taro 是 React 系为主、兼容 Vue；uni-app 是 Vue 系为主。所以团队技术栈是判断的第一依据。Svelte、Nerv 属边缘支持，别当主线。
-->

---
transition: fade-out
---

# 内置组件：PascalCase

`@tarojs/components`，对齐小程序原生组件语义

```tsx
import { View, Swiper, SwiperItem } from '@tarojs/components'

const Banner = () => (
  <Swiper autoplay onClick={onTap}>
    <SwiperItem><View>Slide 1</View></SwiperItem>
  </Swiper>
)
```

<v-clicks>

- **首字母大写**：`View / Text / Image / Button / ScrollView / Swiper`
- React **必须显式 import**；Vue 模板里直接写小写 `<view>`
- 事件用 **`on` 前缀 + 驼峰**（`onClick`），取代原生 `bind`
- 防滚动穿透：`<View catchMove />`

</v-clicks>

<!--
组件是首字母大写的 PascalCase，语义对齐小程序原生组件。React 里必须 import，Vue 模板里可以直接写小写标签。事件从小程序的 bind 前缀改成了前端习惯的 on 前缀。
-->

---
transition: fade-out
---

# Taro.* API

`import Taro from '@tarojs/taro'`，统一各端能力

```ts
import Taro from '@tarojs/taro'

// 异步 API 默认已 promisify，可直接 await
const res = await Taro.request({ url })
Taro.navigateTo({ url: '/pages/detail/index' })
Taro.showToast({ title: '成功' })
```

<v-clicks>

- 覆盖网络 / 路由 / 存储 / UI / 设备 / 媒体 / 支付 / 云开发
- **默认 promisify**：异步 API 可直接 `.then()` / `await`
- **统一策略**：各端差异 API 收敛到微信规范
- `Taro.canIUse` 查某能力在各端的支持度

</v-clicks>

<!--
所有能力都挂在 Taro 命名空间下，而且默认帮你把小程序的回调式异步 API 做了 promisify，可以直接 await。统一策略就是把各端差异 API 收敛到微信规范。
-->

---
transition: fade-out
---

# 页面 Hooks

框架 Hooks 从 `react` 导入；**页面生命周期从 `@tarojs/taro` 导入**

| Hook | 对应生命周期 | 说明 |
| --- | --- | --- |
| `useRouter` | — | 取当前路由 path / params |
| `useLoad` | onLoad | 页面加载，可拿路由参数 |
| `useReady` | onReady | 渲染完成，才能查渲染层节点 |
| `useDidShow / useDidHide` | 显示 / 隐藏 | 前台 / 后台切换 |
| `usePullDownRefresh / useReachBottom` | 下拉 / 触底 | 刷新与加载更多 |

<div v-click class="mt-3 text-sm">

App 级：`useLaunch / useError / usePageNotFound`；`useEffect` 拿不到节点 → 改用 `useReady`

</div>

<!--
这里要分清来源：useState、useEffect 这类框架 Hook 从 react 导入；页面生命周期 Hook 从 @tarojs/taro 导入。一个高频坑：useEffect 里拿不到渲染层节点，要用 useReady 加 createSelectorQuery。
-->

---
transition: fade-out
---

# 架构演进：编译时 → 运行时

核心叙事：从**重编译时**到**重运行时**的一次彻底重写

| 版本 | 架构 | 特征 |
| --- | --- | --- |
| **1.x**（2018） | 重编译时 | 私有 DSL，JSX 静态编译成 wxml，语法限制多 |
| **2.x**（2019） | 编译时为主 | 改善 Vue、扩更多端，仍有 DSL 限制 |
| **3.x**（2020） | **重运行时** | 跑真正的 React/Vue 运行时，限制大幅解除 |
| **4.x**（2024） | 运行时 + Vite | 新增 Vite、CompileMode、鸿蒙 |

<div v-click class="mt-3 text-sm">

权衡：编译时**产物小、启动快但能力被阉割**；运行时**生态全但有开销**（靠 setData 优化补偿）

</div>

<!--
这是最高频的架构考点。1、2 代是重编译时，把 JSX 静态编译成小程序模板，代价是私有 DSL、语法限制多。Taro 3 是彻底重写为重运行时，直接跑真正的 React/Vue，限制才被解除。
-->

---
transition: fade-out
---

# Taro 3 运行时原理

让 Web 框架「以为自己在浏览器里」

<v-clicks>

- **`@tarojs/runtime`**：核心适配层，实现精简版 DOM / BOM + 事件系统
- **`@tarojs/react`**：用 `react-reconciler` 自建 renderer（不用笨重的 ReactDOM）
- **渲染链路**：逻辑层跑出 Taro DOM 树 → 序列化 → `setData` 推给渲染层
- **模板递归**：每个节点渲成一个 `<template>`，递归引用拼出 UI
- **事件**：渲染层 `bind` 绑定 → 冒泡回逻辑层 → 分发到 `onXxx`

</v-clicks>

<!--
原理一句话：runtime 层伪造一套 DOM/BOM，让 React 以为自己在浏览器里跑。渲染时把 Taro DOM 树序列化，通过 setData 推到渲染层，再用小程序模板可互相引用的特性递归拼出界面。
-->

---
transition: fade-out
---

# Taro 4.x：Vite + CompileMode

运行时架构之上的三大增量（最新稳定 v4.1.8）

<v-clicks>

- **Vite 编译内核**：自 4.0 起支持，与 webpack4 / webpack5 并列可选
- **CompileMode（编译模式）**：把部分运行时逻辑编译期静态化，优化小程序性能
- **纯血鸿蒙**：先 ArkTS 后 C-API，见下页三路线
- **React 18**：自 **v3.5** 起默认（legacy 模式，concurrent 需显式开）
- Node **>= 16.20**；4.0 首个正式版为 v4.0.3（约 2024 年中）

</v-clicks>

<!--
Taro 4 不是又一次重写，而是在运行时架构上做增量：加了 Vite 内核、加了 CompileMode 混合编译提性能、加了纯血鸿蒙。注意 React 18 默认是从 3.5 就开始的，不是 4 才有。
-->

---
transition: fade-out
---

# 工程配置 · CLI

`config/index.ts` 定义编译；`app.config.ts` = 可执行的 app.json

<div grid="~ cols-2 gap-4">

<div>

- `framework`：`react / vue3 / preact...`
- `compiler`：`webpack5 / vite`
- `designWidth` 默认 **750**，配 **rpx** 单位
- `app.config.ts` 的 `pages` 数组决定路由

</div>

<div>

```bash
# CLI 版本须与项目依赖一致
taro init myApp

# 按端编译：weapp / h5 / rn ...
taro build --type weapp
taro build --type h5 --watch
```

</div>

</div>

<!--
编译配置集中在 config/index.ts，framework 选框架、compiler 选内核。app.config.ts 相当于小程序的 app.json，但它是可执行的 TS，pages 数组决定路由。CLI 记住 taro build --type，切端就是切这个参数，dev 就是加 --watch。
-->

---
transition: fade-out
---

# 纯血鸿蒙：三条路线

演进顺序，**互不相同、切勿混淆**

| 路线 | 起始 | 命令 | 本质 |
| --- | --- | --- | --- |
| **harmony-hybrid** | 3.6.24+ | `build:harmony-hybrid` | H5 套壳（WebView），过渡 |
| **ArkTS** | 4.0 | `--type harmony` | React → ArkUI 递归渲染 |
| **C-API** | **4.1.0+** | `--type harmony_cpp` | 渲染下沉 C++，直调 ArkUI C-API |

<div v-click class="mt-3 text-sm">

**C-API = 纯血鸿蒙主推**，2025-05 开源，**仅支持 Vite**；京东 APP 鸿蒙版即用 Taro 开发

</div>

<!--
这三条路线是面试重灾区，千万别混。hybrid 是 H5 套壳的过渡方案；harmony 走 ArkTS，把 React 翻译成 ArkUI 组件递归渲染；harmony_cpp 是 C-API 方案，渲染下沉到 C++，是纯血鸿蒙主推，而且只支持 Vite。京东 APP 鸿蒙版就是拿它做的。
-->

---
transition: fade-out
---

# 生态 · 最佳实践

<div grid="~ cols-2 gap-4">

<div>

**生态**

- UI：**NutUI**（Vue3）、**Taro UI**（React）、Taroify
- 状态：Redux、**Pinia**、Mobx
- 物料市场：taro-ext.jd.com

</div>

<div>

**写法约束（坑）**

- 函数型 props 必须 **`on` 前缀**
- 模板数据用 **`null` 而非 `undefined`**
- 查节点用 `useReady`，非 `useEffect`
- **不支持 `React.lazy`**（无动态 import）

</div>

</div>

<!--
生态上 UI 库分 React 系和 Vue 系，状态管理主流都支持。右边这几条是最常踩的坑：函数 props 必须 on 前缀才会被识别为事件，模板里用 null 不用 undefined，小程序没有动态 import 所以 React.lazy 不可用。
-->

---
layout: center
class: text-center
---

# 选型总结

**要多端统一、团队是 React 系** → Taro

京东开源 · 主打 React 兼 Vue3 · 运行时架构 · 纯血鸿蒙 C-API

<div class="mt-8 text-sm opacity-75">

[官方文档](https://docs.taro.zone/) · [GitHub](https://github.com/NervJS/taro) · [物料市场](https://taro-ext.jd.com/)

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/NervJS/taro" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
一句话选型：要多端统一、团队又是 React 系，Taro 是首选。它的三个记忆锚点是运行时架构、主打 React 兼 Vue3、以及纯血鸿蒙 C-API。谢谢大家！
-->
