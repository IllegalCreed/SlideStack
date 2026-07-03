---
theme: seriph
background: https://cover.sli.dev
title: uni-app 深入浅出
info: |
  用 Vue 语法一套代码跨端到小程序 / H5 / App / 鸿蒙。

  基于 uni-app 5.x（uni-app 与 uni-app x 统一版本号）· 了解更多 [uniapp.dcloud.net.cn](https://uniapp.dcloud.net.cn/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# uni-app

用 **Vue 语法**一套代码跨端到小程序 / H5 / App / 鸿蒙（基于 5.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/dcloudio/uni-app" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好，今天聊 uni-app —— 国内 Vue 系跨端的事实龙头：用最熟悉的 Vue 语法写一套代码，编译到各家小程序、H5、App 乃至鸿蒙。
-->

---
transition: fade-out
---

# 什么是 uni-app · 编译目标

一句话：用 **Vue.js 语法**写，一份源码编译到全端

<div grid="~ cols-2 gap-4">

<div>

**定位**

- DCloud（数字天堂）出品的跨端框架
- 组件走小程序系（`<view>` / `<text>`），API 用 `uni.*`（非 DOM、非 `wx.*`）
- 两种形态：传统版（JS + WebView / Weex）｜ uni-app x（UTS + uvue）
- **41.6k★**；多数人走 HBuilderX 不经 npm，量级被低估

</div>

<div>

**编译目标（一份源码 → 多端）**

- 小程序：微信 / 支付宝 / 百度 / 抖音 / QQ / 快手 / 京东 / 小红书…
- Web：H5
- App：iOS / Android / **鸿蒙 Next**
- 架构上**逻辑层与渲染层分离**，减少 JS 与渲染争资源

</div>

</div>

<!--
关键心智：它不是写网页，而是写「小程序规范」的组件与 uni.* API，编译器再把这一份代码分发到各端。
-->

---
transition: fade-out
---

# 四大工程文件

记住这几个文件，就摸清了 uni-app 项目骨架

| 文件 | 职责 |
| --- | --- |
| `pages.json` | 页面路由 + 导航栏 / TabBar / 分包 / 窗口样式（**非** Vue Router） |
| `manifest.json` | 应用级配置：appid、版本号、各端差异、`vueVersion` |
| `App.vue` | 应用入口 + 全局样式 + **应用生命周期** `onLaunch/onShow/onHide` |
| `main.js` | 程序入口，创建 Vue 实例（uni-app x 为 `main.uts`） |
| `uni.scss` | 全局 SCSS 变量（内置 `$uni-` 变量），各页自动可用 |

<div v-click class="mt-3 text-sm">

另有：`static/`（不参与编译）· `components/`（easycom）· `uni_modules/`（插件）。CLI 项目源码在 `src/`，HBuilderX 项目以根目录为根。

</div>

<!--
四大文件里最特别的是 pages.json —— 路由不是靠 Vue Router，而是集中在这里声明。
-->

---
transition: fade-out
---

# pages.json：路由 + 导航 + 分包

```json
{
  "pages": [{ "path": "pages/index/index", "style": { "navigationBarTitleText": "首页" } }],
  "globalStyle": { "navigationBarBackgroundColor": "#F8F8F8" },
  "tabBar": {
    "list": [{ "pagePath": "pages/index/index", "text": "首页" }]
  },
  "subPackages": [{ "root": "pkgA", "pages": [{ "path": "list/list" }] }]
}
```

<v-clicks>

- `pages` 首项即首页；`globalStyle` 全局默认，页面 `style` 就近覆盖
- `tabBar` 原生底部导航（2–5 项）；`subPackages` 小程序分包 + `preloadRule` 预载
- `condition` 开发期直达调试深链；`easycom` 配自动引入规则

</v-clicks>

<!--
pages.json 是「路由 + 导航 + TabBar + 分包」的一站式配置，写小程序的同学会很熟悉。
-->

---
transition: fade-out
---

# manifest.json：应用级配置

```json
{
  "name": "我的应用",
  "appid": "__UNI__XXXXXX",
  "versionName": "1.0.0",
  "versionCode": 100,
  "vueVersion": "3",
  "app-plus": { "splashscreen": {}, "modules": {} },
  "h5": { "router": { "mode": "history" } },
  "mp-weixin": { "appid": "wx..." }
}
```

<v-clicks>

- `versionName`（展示版本）/ `versionCode`（数字，用于升级判断）
- `app-plus` 管 App 闪屏、模块权限、第三方 SDK；各端块做差异化配置
- `vueVersion` 切 Vue2 / Vue3；请求默认超时 60s

</v-clicks>

<!--
manifest 是「应用」维度的配置，和 pages.json 的「页面」维度互补；各端块（app-plus / h5 / mp-weixin）承载差异化。
-->

---
transition: fade-out
---

# uni.* 统一 API

把小程序 `wx.*` 收敛成一份跨端 `uni.*`

```js
uni.request({
  url: 'https://example.com/api',
  method: 'GET',
  success: (res) => { console.log(res.data) }
})

// 不传 success 回调则返回 Promise（Vue3）
const res = await uni.request({ url: 'https://example.com/api' })
```

<v-clicks>

- 网络：`uni.request` / `uploadFile` / `downloadFile` / `connectSocket`
- 路由：`navigateTo`(压栈) / `redirectTo`(替换) / `reLaunch` / `switchTab` / `navigateBack`
- 界面：`showToast` / `showModal` / `showLoading`；存储：`setStorage(Sync)`
- 设备 / 媒体：`getSystemInfo` / `chooseImage` / `getLocation` / `makePhoneCall`
- 命名兼容小程序；异步 API 不传回调即返回 Promise

</v-clicks>

<!--
API 的设计哲学：在 ECMAScript 上扩展一个 uni 对象，命名对齐小程序，一份代码跨端可用。
-->

---
transition: fade-out
---

# 内置组件 · easycom

<div grid="~ cols-2 gap-4">

<div>

**内置组件（对齐小程序）**

- 容器：`<view>` / `<scroll-view>` / `<swiper>`
- 内容：`<text>` / `<rich-text>` / `<icon>`
- 表单：`<button>` / `<input>` / `<picker>` / `<switch>`
- 媒体 / 特殊：`<image>` / `<video>` / `<map>` / `<canvas>` / `<web-view>`

</div>

<div>

**easycom 自动引入**

- 约定 `components/组件名/组件名.vue`
- 模板直接用，**免 import / 注册**
- 打包按需摇树，无冗余
- `easycom.custom` 用正则映射第三方库（`uni-ui` / `uni_modules`）

</div>

</div>

<!--
组件不用 div/span，改用小程序标签系；easycom 让符合目录约定的组件免注册直接用，非常省心。
-->

---
transition: fade-out
---

# 条件编译 #ifdef（核心机制）

同一份代码按平台裁剪：`#ifdef`（仅该平台）/ `#ifndef`（除该平台）/ `#endif`，支持 `|| && !`

<div grid="~ cols-2 gap-4">

<div>

```js
// #ifdef APP-PLUS
console.log('仅 App 保留')
// #endif

// #ifdef MP-WEIXIN || MP-ALIPAY
uni.showModal({ title: '仅微信 / 支付宝' })
// #endif
```

</div>

<div>

| 文件 | 注释语法 |
| --- | --- |
| JS / UTS / TS | `//` |
| CSS / SCSS / Less | `/* */` |
| Vue / uvue 模板 | `<!-- -->` |
| pages.json / manifest.json | `//` |

</div>

</div>

<!--
条件编译是 uni-app 跨端差异化的核心：类 C 预处理指令，按文件类型选对注释符号是第一要点，否则不生效。
-->

---
transition: fade-out
---

# 平台常量 · 高频坑

| 常量 | 平台 |
| --- | --- |
| `H5` / `WEB` | 浏览器 / Web |
| `APP` / `APP-PLUS` / `APP-HARMONY` | App（`PLUS` 历史命名 / 鸿蒙） |
| `APP-ANDROID` / `APP-IOS` | 安卓 / iOS（**仅 uni-app x**） |
| `MP` / `MP-WEIXIN` … | 所有 / 微信 / 支付宝 / 抖音…小程序 |

<v-clicks>

- **传统版不能按 iOS/Android 条件编译**：需 `uni.getSystemInfo()` 运行时判断；**仅 uni-app x** 支持 `APP-ANDROID` / `APP-IOS`
- **CSS 条件编译必须 `/* */`**，即使写 SCSS / Less 也不能用 `//`
- JSON 内条件编译勿留重复 key / 尾逗号；`MP` 覆盖全部小程序

</v-clicks>

<!--
这一页三个坑最容易写错：iOS/安卓分编译只有 uni-app x 能做；CSS 条件编译哪怕用预处理器也必须是斜杠星号。
-->

---
transition: fade-out
---

# Vue2 / Vue3 · 三类生命周期

全端支持 Vue2 与 Vue3，但**页面/应用生命周期不是 Vue 的**

```js
import { onMounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
export default {
  setup() {
    onMounted(() => {})     // 组件周期 ← vue
    onLoad((options) => {}) // 页面周期 ← @dcloudio/uni-app
    onShow(() => {})        // 页面显示
  }
}
```

<v-clicks>

- 组件周期从 `vue` 引；**页面周期**（`onLoad` / `onReady` / `onReachBottom`）从 `@dcloudio/uni-app` 引
- **应用周期** `onLaunch` / `onShow` / `onHide` 写在 `App.vue`
- Vue3 响应式用 `Proxy`；暂不支持 `Teleport` / `Suspense`
- 新项目推 **Vue3 + Vite**（Node 18+/20+）；Vue2 仍可用（webpack 编译器）

</v-clicks>

<!--
最高频的坑：onLoad/onShow 这些页面生命周期要从 @dcloudio/uni-app 引入，而不是从 vue 里，别记混了。
-->

---
transition: fade-out
---

# HBuilderX vs CLI

<div grid="~ cols-2 gap-4">

<div>

**HBuilderX**（官方 IDE）

- 开箱即用，**免装 Node**（编译器内置）
- 图形化运行：浏览器 / 手机 / 各小程序模拟器
- 产物落 `unpackage/`
- 很多用户走此路 → npm 量级被低估

</div>

<div>

**CLI**（Vue3 + Vite）

- `npx degit dcloudio/uni-preset-vue#vite my-app`
- 源码 `src/` → 产物 `dist/`
- `npm run dev:h5` / `dev:mp-weixin` / `dev:app`
- 工程化 / 团队 / CI 首选

</div>

</div>

<!--
两条路都能开发同一套代码：想开箱即用选 HBuilderX，想接 CI/工程化选 CLI，产物目录不同而已。
-->

---
transition: fade-out
---

# uni-app x：UTS + uvue

换语言（**UTS**）+ 换渲染（**uvue** 原生），编译成各端原生代码

```ts
let str: string = 'hello'
const num: number = 42
// 强类型、可空类型 string | null、可选链 ?.
function pass(score: number): boolean {
  return score >= 60
}
```

<v-clicks>

- **UTS**（uni TypeScript）：语法对齐 TS，编译 Android→**Kotlin**、iOS→**Swift**、鸿蒙→**ArkTS**、Web/小程序→**JS**
- **uvue** 原生渲染替代 HTML/CSS + WebView；渲染模式 **VDOM → Vapor 逐步替换**（进行时）
- 平台：**安卓 / iOS / Web / 鸿蒙 / 微信小程序已 GA**，其余小程序端逐步推进
- 与传统版**并存**、共享 UTS 插件生态、**共用统一版本号 5.x**
- 对比：nvue 是传统版原生渲染（Weex 系）；追求极致原生性能的新项目走 uni-app x

</v-clicks>

<!--
uni-app x 不是换皮：把 JS 换成 UTS 编译到原生语言，把 WebView 换成 uvue 原生渲染，目标是逼近甚至超越原生性能。
-->

---
transition: fade-out
---

# uniCloud · 选型

<div grid="~ cols-2 gap-4">

<div>

**uniCloud**（Serverless 云开发）

- DCloud × 阿里云 / 腾讯云 / 支付宝云，前后端都用 JS
- **云函数 / 云对象**：服务端 JS，免运维
- **云数据库**：MongoDB 系 + DB Schema（结构/权限/校验）
- **clientDB + JQL**：前端直查库，多数场景免写服务端

</div>

<div>

**选型 / 生态**

- 要 **Vue 系一套代码全端**（尤其小程序全家桶）→ uni-app
- 要**极致原生性能** → uni-app x（UTS + uvue）
- 生态：DCloud 插件市场、`uni-ui`、`wot-design-uni`、`uni-id`

</div>

</div>

<div class="mt-4 text-sm opacity-75">

[官方文档](https://uniapp.dcloud.net.cn/) · [uni-app x](https://doc.dcloud.net.cn/uni-app-x/) · [uniCloud](https://doc.dcloud.net.cn/uniCloud/)

</div>

<!--
一句话选型：要 Vue 系一套代码打全端就用 uni-app；要极致原生性能就上 uni-app x；后端不想运维，uniCloud 让你前后端都写 JS。谢谢大家！
-->
