---
theme: seriph
background: https://cover.sli.dev
title: micro-app 微前端框架
info: |
  micro-app —— 京东开源的类 WebComponent 微前端框架：CustomElement 定义 micro-app 标签、with/iframe 双沙箱、元素与样式隔离、数据通信、1.0 RC 现状与选型
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:apps class="text-8xl" />
</div>

<br/>

## micro-app 微前端框架

京东开源、类 WebComponent 容器——用 `customElements.define` 把微前端封装成 `<micro-app>` 标签，接入成本全场最低

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
micro-app 是京东开源（jd-opensource，前身 micro-zoe）的微前端框架，官方定位「简约、高效、功能强大」。最鲜明的路线是借鉴 WebComponent 的 CustomElement 思想，把整套微前端能力包装成一个自定义标签，主应用只写一行标签即可接入，因此把自己标榜为接入成本全场最低的方案。
-->

---
transition: fade-out
---

# 这一章讲什么

一条主线：**micro-app 怎么用一个 `<micro-app>` 标签，把微前端接入成本压到全场最低**

<v-click>

- **CustomElement 容器**：`customElements.define` 定义 `<micro-app>`、标签属性、组件化接入、五个生命周期事件
- **with 沙箱（默认）**：`Proxy` + `with` 造软隔离、注入环境变量、顶层变量不挂 window 的坑
- **iframe 沙箱模式**：1.0 起可选强隔离、与 with 取舍、同域初始化坑
- **元素与样式隔离**：元素隔离、scopedcss 前缀改写、`shadowDOM` 可选、主应用样式下渗
- **数据通信**：`data`/`setData` 下行、`dispatch` 上行、全局数据、EventCenter
- **1.0 RC 与现状**：长期 RC 时间线、虚拟路由、Vite 友好、与 wujie 对比、选型

</v-click>

<v-click>

> 一句话定位：**京东开源、`<micro-app>` CustomElement 容器、默认 with 沙箱 + 可选 iframe 沙箱、接入成本最低**。

</v-click>

<!--
六个主题顺序推进：先建立「micro-app 是个真标签容器」的心智，再讲默认 with 沙箱与可选 iframe 沙箱两条隔离路线，然后是元素与样式隔离、数据通信，最后收口 1.0 RC 现状与选型定位。
-->

---
layout: section
---

# CustomElement 容器

`<micro-app>` 是一个真标签，是子应用的容器元素

---

# micro-app 是什么：一个标签接入微前端

京东开源、类 WebComponent 容器，接入成本压到一行标签

<v-click>

- **京东开源**（`jd-opensource`，前身 micro-zoe），官方定位「简约、高效、功能强大的微前端框架」
- 借 **CustomElement** 思想，把微前端封装成 `<micro-app>` 自定义标签——从「组件化」使用子应用

</v-click>

<v-click>

| 传统方案的痛点 | micro-app 怎么破 |
| --- | --- |
| single-spa/qiankun 要**注册 + 路由适配** | 直接写 `<micro-app>` 标签，**无需注册** |
| 子应用要导出 `bootstrap/mount/unmount` | 子应用**基本零生命周期改造**（CORS + public-path） |
| iframe 隔离强但**路由丢失、弹窗被框死** | `<micro-app>` + **虚拟路由** + 数据通信规避 |
| qiankun 2.x **接不了 Vite/ESM** | **原生友好 Vite/ESM** |

</v-click>

<v-click>

> 一句话：micro-app 把「嵌一个子应用」的成本压到**一行 HTML 标签**——这是它对比同类框架最直接的卖点。

</v-click>

<!--
微前端的通用价值不是 micro-app 独有，它的独到之处是把「接入」这件事做到极致的轻：用一个标签解决「加载子应用」，让心智负担接近「用一个 iframe，但没有 iframe 的那些毛病」。
-->

---

# 最小接入：主应用一行标签

两步——启动一次 + 写一行标签

<v-click>

```js
// 第一步 · 主应用入口：安装 npm i @micro-zoe/micro-app --save
import microApp from "@micro-zoe/micro-app";

// 启动 micro-app，全局注册 <micro-app> 自定义标签；可传全局配置
microApp.start();
```

</v-click>

<v-click>

```html
<!-- 第二步 · 任意位置写一行标签 -->
<!-- name：子应用唯一标识（须字母开头）；url：子应用 index.html 地址 -->
<micro-app name="my-app" url="http://localhost:3000/"></micro-app>
```

</v-click>

<v-click>

> 子应用会被拉取、在 `<micro-app>` 元素内渲染、随元素卸载而卸载——官方语「只需一行代码，实现微前端」。

</v-click>

<!--
主应用只需 start() 一次完成 micro-app 标签的注册；随后在任何需要子应用的位置写一行标签即可。因为它是真自定义元素，天然能写进任何框架的模板当组件用。
-->

---

# CustomElement 容器心智

理解 micro-app 的钥匙：`<micro-app>` 是子应用的「容器元素」

<v-click>

```text
主应用 DOM 树
└─ <micro-app name="my-app" url="...">   ← customElements.define 定义的自定义元素
     └─ 子应用真实 DOM 树               ← 直接渲染在元素内部（默认非 Shadow DOM）
          · 元素隔离：子应用 querySelector 只能查到自己这棵树
          · 样式隔离：CSS 被改写为 micro-app[name=x] 前缀
          · JS 沙箱：脚本跑在 with(proxyWindow){…} 里，全局互不污染
```

</v-click>

<v-click>

- **它是标签，不是配置**：由 `window.customElements.define('micro-app', …)` 注册——这就是「**类 WebComponent**」的字面含义
- **默认不是 Shadow DOM**：只借「自定义标签」这一层，隔离由**元素 + scopedcss + JS 沙箱**三件事分工，`shadowDOM` 只是可选增强
- **生命周期是 DOM 事件**：挂在元素上，用 `addEventListener` 或框架 `@事件` 监听，**不需要子应用导出任何函数**

</v-click>

<!--
注册自定义元素不等于使用 Shadow DOM。micro-app 默认把子应用 DOM 直接渲染在元素内部（Light DOM），因此样式/元素隔离要另做，而不是白嫖 Shadow DOM 的天然隔离——这是它和 wujie 最大的实现差异。
-->

---

# 核心 `<micro-app>` 标签属性

标签属性开启能力，写在标签上或传 `microApp.start()`；完整表见笔记「参考」

<v-click>

| 属性 | 作用 | 默认 |
| --- | --- | --- |
| `name` | 子应用**唯一标识**，须字母开头 | **必填** |
| `url` | 子应用地址，指向其 `index.html` | **必填** |
| `baseroute` | 基础路由，注入为 `__MICRO_APP_BASE_ROUTE__` | `''` |
| `iframe` | 开启 **iframe 沙箱**（默认 with 沙箱） | `false` |
| `keep-alive` | 保活：卸载不销毁、推入后台 | `false` |
| `router-mode` | 虚拟路由模式（`search`/`native`/`pure`…） | `search` |
| `disable-scopecss` / `shadowDOM` | 关样式隔离 / 真 Shadow DOM（见第四章） | `false` |

</v-click>

<!--
name 与 url 必填，其余按需。iframe 切沙箱模式、keep-alive 保活、router-mode 选虚拟路由策略、disable-scopecss/shadowDOM 调样式隔离——每个属性对应后面章节的一块能力。
-->

---

# 组件化接入：当普通组件用

`<micro-app>` 是真标签，能无缝写进任何框架模板

<v-click>

```vue
<template>
  <!-- <micro-app> 是真标签：:url 绑定、data 传数据、@事件 听生命周期 -->
  <micro-app name="app1" :url="url" :data="dataForChild" @mounted="onMounted" />
</template>

<script setup lang="ts">
import { ref } from "vue";
const url = "http://localhost:3000/";
const dataForChild = ref({ userId: 1 }); // 下行数据（见「数据通信」）
/** 子应用渲染完成回调 */
function onMounted() {
  console.log("子应用已挂载");
}
</script>
```

</v-click>

<v-click>

- React 里写 `<micro-app name="app1" url={url} data={obj} />` 同理（`data` 只接受对象）
- 子应用出现的时机 = `<micro-app>` 元素出现在 DOM 上的时机——「组件化」的直接体现

</v-click>

<!--
对比 single-spa/qiankun 需要在 JS 里 registerMicroApps 并做路由适配，micro-app 把「放哪、何时显示」交给模板与框架的条件渲染/路由，子应用像业务组件一样用。
-->

---

# 生命周期事件：五个 DOM 事件

不是让子应用导出函数，而是在元素上派发 DOM 事件

<v-click>

| 事件 | 触发时机 | 典型用途 |
| --- | --- | --- |
| `created` | 元素初始化后、**加载资源前** | 打点、显示 loading |
| `beforemount` | 资源加载完成、**渲染前** | 注入初始数据、埋点 |
| `mounted` | 子应用**渲染结束** | 隐藏 loading、通知就绪 |
| `unmount` | 子应用**卸载时** | 清理主应用侧副作用 |
| `error` | 加载/渲染出错（**仅渲染终止型**） | 兜底 UI、上报 |

</v-click>

<v-click>

> **keep-alive 场景**额外派发 `beforeshow`/`aftershow`/`afterhidden`；子应用侧统一从 `appstate-change` 事件取状态（`e.detail.appState`）。

</v-click>

<!--
五个标准事件覆盖了子应用从初始化到卸载的全程。因为它们是 DOM 事件，主应用无需子应用导出函数即可掌控全程——这正是「接入成本最低」的机制来源之一。
-->

---

# 两种监听方式，按需选

细粒度用元素事件，统一管理用全局 lifeCycles

<v-click>

```js
// 方式一：直接在元素上 addEventListener（细粒度、单应用）
const el = document.querySelector("micro-app[name=app1]");
el.addEventListener("mounted", () => console.log("app1 已挂载"));
el.addEventListener("error", () => console.log("app1 出错"));
```

</v-click>

<v-click>

```js
// 方式二：全局 lifeCycles，统一监听所有子应用（回调收 e 与 appName）
import microApp from "@micro-zoe/micro-app";
microApp.start({
  lifeCycles: {
    mounted(e, appName) { console.log(`${appName} 挂载完成`); },
    unmount(e, appName) {},
    error(e, appName) {},
  },
});
```

</v-click>

<!--
两种监听方式：元素级 addEventListener 适合单应用细粒度控制；全局 lifeCycles 一处统一监听所有子应用，回调收到事件对象和应用名。子应用保活状态则从 window 的 appstate-change 事件取。
-->

---

# 「接入成本最低」到底省在哪

把 micro-app 和 qiankun 的接入责任并排列出来

<v-click>

| 责任项 | qiankun | **micro-app** |
| --- | --- | --- |
| 主应用注册子应用 | `registerMicroApps([...])` + `start()` | **一行 `<micro-app>` 标签** |
| 子应用导出生命周期 | **必须** `bootstrap/mount/unmount` | **默认不需要**（UMD 多实例才需） |
| 子应用打包格式 | 改成 **UMD** | 一般无需改打包格式 |
| 何时渲染子应用 | 路由匹配 + `activeRule` | **元素在不在 DOM 上** |
| 生命周期怎么接 | 子应用导出的函数 | **元素上的 DOM 事件** |

</v-click>

<v-click>

> 省下的正是「双端契约」——micro-app 把它收敛成「**写标签 + 监听事件**」，子应用侧只剩 CORS 与 public-path 两件小事。

</v-click>

<!--
qiankun 要求主应用注册、子应用导出、约定 UMD；micro-app 把这套契约收敛成写标签加监听事件，这是官方敢说「只需一行代码」的底气，也是它在快速试点、渐进接入场景里最讨喜的原因。代价是默认 with 软沙箱隔离强度不及 iframe。
-->

---
layout: section
---

# with 沙箱（默认）

`Proxy` + `with` 造一个相对独立的运行空间

---

# 默认沙箱就是 with 沙箱

把子应用脚本包进 `with(proxyWindow){…}`

<v-click>

- micro-app **默认沙箱 = with 沙箱**：用 **`Proxy`** 拦截对 `window`/`document` 的读写，造「相对独立的运行空间」
- 与 **qiankun** 的 proxySandbox 同宗，但 micro-app **叠了 `with`** 改写作用域链——所以叫 **with 沙箱**

</v-click>

<v-click>

两层机制配合：

- **`with(proxyWindow)`**：让子应用源码里**裸写的全局名**（`document`、`location`、自定义全局）先落到 `proxyWindow`——「改作用域链」
- **`Proxy` 拦截**：`get`/`set` 决定「**读回退真 window、写只落假 window**」，实现**写时隔离**

</v-click>

<v-click>

> 于是子应用「以为」自己在操作 `window`，实际操作的是一个专属代理，全局互不干扰、卸载即回收。

</v-click>

<!--
沙箱的四代通论（快照 / Proxy / with+Proxy / iframe / ShadowRealm）在核心机制页讲透，本页只讲 micro-app 的 with 沙箱怎么落地。with + Proxy 这一代正是 micro-app 默认走的路。
-->

---

# with 沙箱：Proxy + with 落地

高度简化的实现示意

<v-click>

```js
const rawWindow = window; // 真实主应用 window
const microAppWindow = {}; // 子应用专属的「假 window」载体

// Proxy 拦截：写落假 window，读优先假 window、回退真 window
const proxyWindow = new Proxy(microAppWindow, {
  get: (target, key) => (key in target ? target[key] : rawWindow[key]),
  set: (target, key, value) => ((target[key] = value), true), // 不污染主应用
});

// 子应用代码被这样包裹：with 让「裸全局名」都走 proxyWindow
with (proxyWindow) {
  /* …子应用源码：document、location、自定义全局都走代理… */
}
```

</v-click>

<v-click>

> **软隔离本质**：with 沙箱「防意外、不防恶意」，性能好、兼容广、无 iframe 开销；要更强隔离用 iframe 沙箱。

</v-click>

<!--
写落到子应用的假 window、不污染主应用的真 window；未覆盖的读回退真 window。with 把裸全局名的查找收敛到代理上。这就是「读回退、写隔离」的软隔离。
-->

---

# 注入的环境变量

micro-app 在沙箱里给子应用挂一批约定全局变量

<v-click>

| 注入变量 | 含义 | 典型用法 |
| --- | --- | --- |
| `__MICRO_APP_ENVIRONMENT__` | 是否运行在 micro-app 环境 | 判断「独立/被嵌入」切换渲染 |
| `__MICRO_APP_NAME__` | 当前子应用的 `name` | 日志、多实例区分 |
| `__MICRO_APP_PUBLIC_PATH__` | 注入的 publicPath | 配 `__webpack_public_path__` |
| `__MICRO_APP_BASE_ROUTE__` | 基础路由（对应 `baseroute`） | 设路由 `base` |
| `__MICRO_APP_BASE_APPLICATION__` | 是否为主应用 | 主/子共用代码时分支 |

</v-click>

<v-click>

```js
// 子应用 src/public-path.js —— 用注入变量自省 + 配 publicPath
if (window.__MICRO_APP_ENVIRONMENT__) {
  __webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__;
}
```

</v-click>

<!--
这批约定全局变量供子应用自省与配置：判断是否被嵌入、拿应用名、配 webpack 运行时 publicPath、设路由 base、区分主子应用。子应用改造清单里「配 public-path」这件事就是用 __MICRO_APP_PUBLIC_PATH__。
-->

---

# 经典坑：顶层变量不挂 window

with 沙箱最容易踩的坑，务必知道

<v-click>

```js
// 子应用顶层这样写：
var globalCfg = { a: 1 };
function init() {}

// 在 with 沙箱里，它们不会挂到 window！
console.log(window.globalCfg); // undefined（不是 { a: 1 }）
console.log(window.init); // undefined
```

</v-click>

<v-click>

**原因**：子应用代码被包进 `with(proxyWindow){ (function(){…})() }`，顶层声明落在**函数作用域**，没真正挂到 window。凡是「声明全局再用 `window.全局` 读」的库都会失效。

</v-click>

<v-click>

**三种解法**（任选其一，官方均给出）：

- **A**：webpack 把 `output.library.type` 设为 `"window"`
- **B**：源码里手动 `window.globalCfg = { a: 1 }`
- **C**：用 micro-app 的 `plugins` 在加载时**运行时改写**代码

</v-click>

<!--
正常浏览器里顶层 var/function 会成为 window 的属性；但被 with 包裹后落进函数作用域。老 UMD/JSONP 库、CDN 全局库都可能因此失效。三种解法分别对应改打包、改源码、改不动源码时用插件运行时改写。
-->

---

# 逃逸口：rawWindow / rawDocument

有意的隔离缺口——「我知道我在突破沙箱」

<v-click>

```js
// 子应用：拿未被代理的真实主应用对象
window.rawWindow; // 真实 window（未经 Proxy）
window.rawDocument; // 真实 document

// 例：在真实 document 上做一次性操作（谨慎，会突破隔离）
window.rawDocument.title = "被子应用改了主文档标题";
```

</v-click>

<v-click>

- 用途：子应用**确实需要**操作主应用真实 `window`/`document`（挂真正全局的监听、读主应用注入的全局）时
- **关沙箱**：`disable-sandbox` 属性可关沙箱（**官方不推荐**，会丢隔离）

</v-click>

<v-click>

> `rawWindow`/`rawDocument` 是有意的逃逸口——日常应避免，仅在明确需要跨界时使用。

</v-click>

<!--
有时子应用确实需要操作真实对象，micro-app 提供 rawWindow/rawDocument 逃逸口。用它意味着有意突破隔离，谨慎使用。disable-sandbox 能整体关沙箱但不推荐。
-->

---

# 与 qiankun proxySandbox 的异同

两者是「近亲」，关键差别在 `with`

<v-click>

| 维度 | qiankun proxySandbox | **micro-app with 沙箱** |
| --- | --- | --- |
| **核心机制** | `Proxy` 拦截 fakeWindow | **`with` 改作用域链 + `Proxy` 拦截** |
| **作用域改写** | 无 `with` | **有 `with(proxyWindow)`** |
| **隔离性质** | 软隔离（防意外不防恶意） | **软隔离**（同性质） |
| **多实例** | `Proxy` 天然多实例 | 每个 `<micro-app>` 一套代理 |
| **典型坑** | `window.onXxx` 事件属性等 | **顶层 `var`/`function` 不挂 window** |

</v-click>

<v-click>

> 一句话：**都是「用 `Proxy` 造假 window 的软隔离」，micro-app 额外用 `with` 收敛裸全局名的查找**，代价就是「顶层声明不挂 window」的坑。

</v-click>

<!--
两者同宗但 micro-app 叠了 with。要连 document/location 都物理独立、或 with 沙箱兼容出问题，就该上 iframe 沙箱模式——这是下一章。
-->

---
layout: section
---

# iframe 沙箱模式

1.0 起可选的强隔离——加一个 `iframe` 属性即切换

---

# 1.0 起可选：一个 iframe 属性

默认仍是 with 沙箱，加 `iframe` 属性切到强隔离

<v-click>

```html
<!-- 单个子应用：开 iframe 沙箱 -->
<micro-app name="app1" url="http://localhost:3000/" iframe></micro-app>
```

```js
// 或全局默认：所有子应用都用 iframe 沙箱
microApp.start({ iframe: true });
```

</v-click>

<v-click>

- **原理**：把子应用 JS 注入一个**同域 iframe** 跑，拿 iframe 原生的 `window`/`document`/`history`/`location`——**物理隔离**
- **注意**：即便开了 iframe，子应用 **DOM 仍渲染在 `<micro-app>` 元素里**（不进 iframe）——iframe 只当「JS 运行时」

</v-click>

<v-click>

> 这和 with 沙箱那种「`Proxy` 造假 window」的软件模拟是两回事——iframe 是真物理隔离。

</v-click>

<!--
micro-app 默认 with 沙箱，从 1.0 起把 iframe 沙箱作为平行的可选模式提供，切换只需一个属性。子应用 JS 跑在同域不可见 iframe 里拿原生上下文，但 DOM 仍在 micro-app 元素内——这与 wujie 的「JS 在 iframe、DOM 在 WebComponent」分工相通。
-->

---

# 与 with 沙箱的取舍

本质是「兼容/性能」与「隔离强度」的权衡

<v-click>

| 维度 | with 沙箱（默认） | **iframe 沙箱**（可选） |
| --- | --- | --- |
| **隔离性质** | 软隔离（`Proxy`+`with` 模拟） | **物理隔离**（iframe 原生上下文） |
| **`window`** | 代理假 window（读回退真 window） | **iframe 原生 window** |
| **`document`/`location`/`history`** | 部分代理/共享 | **各自独立、原生** |
| **顶层变量挂 window** | 不挂（经典坑） | **接近原生行为** |
| **性能** | 好（无 iframe 开销） | 有 **iframe 创建/常驻开销** |
| **兼容性** | 广（除 IE） | **同域约束** + 部分 API 差异 |

</v-click>

<v-click>

> 结论：**with 是默认、够用、轻量的选择**；只有软隔离摆不平时，才用 iframe 换更强隔离，代价是内存开销与同域约束。

</v-click>

<!--
选 with 还是 iframe，是隔离强度与兼容性能的权衡。with 够用轻量，iframe 隔离更强但有开销和同域约束。默认留在 with，命中强隔离/兼容问题再切。
-->

---

# 同域初始化坑与 window.stop()

iframe 沙箱最著名的落地坑

<v-click>

初始化时，同域 iframe 可能**误加载主应用资源**，导致主应用脚本在子应用 iframe 里重复执行、报错。两解：

</v-click>

<v-click>

```js
// 解法 A：把 iframe 指向一个空白同域页面，避免误载主应用资源
microApp.start({
  iframe: true,
  iframeSrc: location.origin + "/empty.html",
});
```

```html
<!-- 解法 B：主应用 <head> 最前面——非顶层窗口（在 iframe 里）就停止加载 -->
<script>
  if (window.parent !== window) window.stop();
</script>
```

</v-click>

<v-click>

> **同域是硬约束**：iframe 必须与主应用**同源**，micro-app 才能桥接与通信，跨域会被同源策略（SOP）拦死。

</v-click>

<!--
这两个坑和「同域 iframe」这个物理事实绑定。理解了「iframe 沙箱就是个真同域 iframe」，它们就都好解释了：解法 A 用 iframeSrc 指向空页，解法 B 在主应用头部拦截非顶层窗口继续加载。
-->

---

# 何时选 iframe 模式

默认留在 with 沙箱，命中任一条再考虑切

<v-click>

- **顽固的全局污染/顶层变量问题**：with 的「顶层 `var`/`function` 不挂 window」坑在某些三方库上绕不过去
- **强隔离诉求**：子应用来源不完全可信、或需要**独立的 `history`/`location`**
- **with 沙箱跑不通**：个别子应用在 with 沙箱下有兼容性问题（官方原话「with 沙箱不工作时」用 iframe 兜底）
- **对齐 wujie 式隔离**：团队就是想要 iframe 物理隔离路线，但又想保留标签化接入与生态

</v-click>

<v-click>

> 反过来，**大多数场景（内部可信子应用、追求性能与最低成本）应留在默认 with 沙箱**——iframe 的内存开销与同域约束是实打实的成本。

</v-click>

<!--
一张决策清单：顽固全局污染、强隔离诉求、with 跑不通、对齐 wujie。四条命中任一再切 iframe，否则留在 with。
-->

---

# 切沙箱只换「JS 隔离」，其余不变

`iframe` 属性只切「JS 沙箱实现」，上层近乎透明

<v-click>

| 能力 | with 沙箱 | iframe 沙箱 | 说明 |
| --- | --- | --- | --- |
| **DOM 渲染位置** | `<micro-app>` 元素内 | **同样在元素内** | iframe 只当 JS 运行时 |
| **样式隔离** | scopedcss 前缀改写 | 同左 | 与沙箱选择无关 |
| **元素隔离** | DOM 作用域代理 | 同左 | `removeDomScope` 一致 |
| **数据通信** | `window.microApp` API | **同一套 API** | `getData`/`dispatch`/全局 |
| **虚拟路由** | `microApp.router` | 同左 | `router-mode` 不受影响 |

</v-click>

<v-click>

> 「选 with 还是 iframe」是**局部决策**——先用 with 快速跑通、遇隔离问题再局部切 iframe，是低成本的渐进路径。

</v-click>

<!--
切沙箱不需要重写通信、路由或样式代码，只是把「子应用 JS 跑在代理 window 还是 iframe 原生 window」这一层换掉。这是 micro-app「双沙箱可选」相对 wujie「iframe only」的灵活之处。
-->

---
layout: section
---

# 元素与样式隔离

默认不用 Shadow DOM，隔离要自己实现两件事

---

# 元素隔离：DOM 查询圈进边界

代理子应用的 DOM 查询，限定在 `<micro-app>` 子树内

<v-click>

```js
// 子应用里执行（micro-app 已代理了 document 查询方法）
document.querySelector("#root"); // 只在 <micro-app> 边界内找，找不到主应用的 #root
document.getElementById("app"); // 同理，作用域被限定在自己这棵树
```

</v-click>

<v-click>

一处**关键不对称**要记牢：

- **子应用 → 主应用：不可见**——查询被圈在自己边界内，碰不到主应用元素
- **主应用 → 子应用：可见**——主应用「统筹全局」，可正常查到、操作子应用内部元素
- **逃逸口**：`removeDomScope(true)` 解绑作用域 / `removeDomScope(false)` 恢复；子应用用 `window.microApp.removeDomScope()`

</v-click>

<v-click>

> 效果像 ShadowDOM，但实现是「**代理查询**」而非真影子树——与真 Shadow DOM 的双向封闭不同。

</v-click>

<!--
官方定义：元素不会逃离 micro-app 元素边界，子应用只能对自身元素增删改查。主可访子、子不可访主是关键不对称。removeDomScope 是逃逸口，比如子应用要往 document.body 挂全局弹层时临时解绑。
-->

---

# 样式隔离：scopedcss 前缀改写

默认开启，把子应用选择器加上容器属性前缀

<v-click>

```css
/* 子应用原始 CSS */
.test {
  color: red;
}

/* micro-app 改写后（xxx 为子应用 name） */
micro-app[name="xxx"] .test {
  color: red;
}
```

</v-click>

<v-click>

- 于是子应用的 `.test` 只命中 `<micro-app name="xxx">` 内部元素，不污染主应用或别的子应用
- 与 **qiankun** 的 `experimentalStyleIsolation`（`div[data-qiankun]` 前缀）**思路一致**，只是前缀选择器不同

</v-click>

<!--
这是「运行时给选择器加作用域前缀」路线在 micro-app 里的落地。子应用每条 CSS 选择器都被改写加上 micro-app[name=xxx] 前缀，圈进本容器。
-->

---

# 关样式隔离：四级粒度

从粗到细，按需放行（注释须以 `/*!` 开头）

<v-click>

| 粒度 | 方式 |
| --- | --- |
| **全局** | `microApp.start({ disableScopecss: true })` |
| **单应用** | `<micro-app disable-scopecss>` 属性 |
| **文件/区间** | `/*! scopecss-disable */ … /*! scopecss-enable */` |
| **选择器级** | `/*! scopecss-disable .a, .b */` |
| **行级** | `/*! scopecss-disable-next-line */` |

</v-click>

<v-click>

> **务必注意**：控制注释必须以 **`/*!`** 开头（带感叹号）——构建压缩（cssnano `discardComments`）默认删普通注释，只保留 `/*!` 这类「重要注释」，否则隔离开关在生产构建里就没了。

</v-click>

<!--
四级关闭对应四种粒度：全局配置、单应用属性、文件区间注释、选择器/行级注释。关键是注释要带感叹号，否则被压缩器删掉，隔离开关在生产就失效了。
-->

---

# shadowDOM：可选的更强样式隔离

scopedcss 不够时才开，非默认

<v-click>

```html
<!-- 可选：用 Shadow DOM 承载子应用，样式随影子树天然隔离 -->
<micro-app name="xx" url="xx" shadowDOM></micro-app>
```

</v-click>

<v-click>

- 开了 `shadowDOM`，子应用渲染进真正的 `shadowRoot`，样式获得 Shadow DOM 级封闭
- **代价不小**：部分第三方 UI 库/弹窗依赖挂 `document.body`，进 Shadow DOM 会**逃逸受限、定位错乱**；依赖全局选择器的样式方案也会失效

</v-click>

<v-click>

> **默认的 scopedcss 是更普适的折中**，`shadowDOM` 是「明确需要强封闭且能接受其副作用」时才开。

</v-click>

<!--
想要比 scopedcss 更彻底的样式封闭可开 shadowDOM，但第三方弹窗逃逸、全局选择器失效是实打实的代价，所以它不是默认。
-->

---

# 和主应用样式冲突怎么办

最需认清的边界：主应用样式仍会下渗子应用

<v-click>

官方原话：**「主应用的样式依然会对子应用产生影响」**。原因：scopedcss 只改写**子应用样式**（加前缀圈住），**管不到主应用**——主应用的全局样式（`*`、标签选择器、`body`/`a`/`h1`）照常下渗到子应用元素上。

</v-click>

<v-click>

实用对策：

- **主应用侧收敛全局样式**：少写裸标签选择器和 `*` 通配，全局样式加类名/命名空间约束
- **子应用侧用 CSS Modules / 命名约定**：类名模块化或加前缀，降低撞车概率
- **确需强封闭**：对样式冲突特别敏感的子应用，再考虑 `shadowDOM`（接受其弹窗逃逸代价）

</v-click>

<v-click>

> micro-app 的默认样式隔离是**「圈住子应用、但挡不住主应用下渗」的单向隔离**——与真 Shadow DOM 的双向封闭有本质区别。

</v-click>

<!--
scopedcss 只圈住子应用样式，主应用全局样式仍会下渗。工程上靠主应用样式收敛加子应用模块化来补，敏感场景再用 shadowDOM。这是单向隔离，和真 Shadow DOM 的双向封闭本质不同。
-->

---
layout: section
---

# 数据通信

基于「数据绑定 + 发布订阅」的 CustomEvent 模型

---

# 通信三层概览

父子定向、全局广播、独立事件中心

<v-click>

| 方向 | 主应用侧 | 子应用侧 |
| --- | --- | --- |
| **父 → 子（下行）** | `:data` 属性 / `setData` / `forceSetData` | `getData()` / `addDataListener(fn)` |
| **子 → 父（上行）** | `datachange` 事件 / `addDataListener(name, fn)` | `dispatch(data, cb)` / `forceDispatch` |
| **全局广播** | `setGlobalData` / `getGlobalData` | `setGlobalData` / `addGlobalDataListener` |
| **独立事件中心** | `new EventCenterForMicroApp(name)` | `window.eventCenterForAppxx.*` |
| **清理** | `clearData(name)` / `removeDataListener` | `clearData()` / `clearDataListener` |

</v-click>

<v-click>

> **分工**：传值用**通信 API**，导航用 **`microApp.router`**——两者别混用（下一章讲虚拟路由）。

</v-click>

<!--
micro-app 通信是 CustomEvent 之上的三层：父子定向、全局广播、关沙箱/UMD 的独立事件中心。这几种正是通信模式通论（props 下行、事件上行、全局状态、去中心化总线）的具体实现。
-->

---

# 父 → 子：data 下行 + setData

声明式绑定属性，或命令式主动下发

<v-click>

```vue
<!-- 声明式：data 绑定一个对象，变化即下行（data 只接受对象） -->
<template>
  <micro-app name="app1" url="http://localhost:3000/" :data="dataForChild" />
</template>
```

</v-click>

<v-click>

```js
// 命令式：microApp.setData 主动下发（不依赖模板绑定）
microApp.setData("app1", { type: "update", page: 2 }, () => {
  console.log("子应用已收到"); // 回调在子应用接收后触发
});

// 新数据与上次相同、默认不触发监听，需要强制时用 forceSetData
microApp.forceSetData("app1", { type: "update", page: 2 });
```

</v-click>

<!--
下行两种方式：声明式在标签上绑 data 属性、变化自动下发；命令式用 setData 主动下发。相同数据默认不重复触发，forceSetData 强制。data 只接受对象。
-->

---

# 子应用接收：getData + addDataListener

通过注入的全局对象 `window.microApp` 收数据

<v-click>

```js
// 子应用：一次性获取当前数据
const data = window.microApp.getData(); // 返回主应用下发的对象

// 子应用：订阅数据变化（autoTrigger=true 会立即用当前值触发一次）
function dataListener(newData) {
  console.log("收到主应用数据：", newData);
}
window.microApp.addDataListener(dataListener, true);

// 卸载/不再需要时解绑，防泄漏
window.microApp.removeDataListener(dataListener);
window.microApp.clearDataListener(); // 清空本应用所有监听
```

</v-click>

<v-click>

> `addDataListener(fn, autoTrigger)`：`autoTrigger=true` 会用当前值立即触发一次，适合「订阅并拿初值」。

</v-click>

<!--
子应用用注入的 window.microApp 收数据：getData 拿当前值、addDataListener 订阅变化。记得在卸载时 removeDataListener / clearDataListener 防泄漏。
-->

---

# 子 → 父：dispatch 上行

子应用把数据派发回主应用

<v-click>

```js
// 子应用：向主应用上报数据
window.microApp.dispatch({ type: "loaded", detail: { ok: true } }, () => {
  console.log("主应用已接收"); // 回调
});
window.microApp.forceDispatch({ type: "loaded" }); // 相同数据强制触发
```

</v-click>

<v-click>

```js
// 主应用方式一：在元素上监听 datachange（e.detail.data 为子应用派发的数据）
const el = document.querySelector("micro-app[name=app1]");
el.addEventListener("datachange", (e) => console.log("子应用上报：", e.detail.data));

// 主应用方式二：命令式订阅指定子应用
microApp.addDataListener("app1", (data) => console.log("app1 上报：", data), true);
microApp.getData("app1"); // 主动读取 app1 当前数据
```

</v-click>

<!--
上行用 dispatch。主应用侧接收有两种方式：监听元素的 datachange 事件，或命令式 addDataListener 订阅指定子应用。forceDispatch 用于相同数据强制触发。
-->

---

# 全局数据：跨所有应用广播

一处写入，主应用 + 全部子应用都能读到与订阅

<v-click>

```js
// 任意一端写入全局数据（子应用侧走 window.microApp，API 对齐）
microApp.setGlobalData({ theme: "dark", lang: "zh" });
microApp.forceSetGlobalData({ theme: "dark" }); // 相同值强制触发

// 读取 / 订阅 / 清空
microApp.getGlobalData();
microApp.addGlobalDataListener((data) => console.log("全局数据变了：", data), true);
microApp.clearGlobalData();
```

</v-click>

<v-click>

> **定向 vs 全局**：定向 `data`/`dispatch` 耦合小、语义清；全局数据方便但用多了变「**隐形全局状态**」——建议只放登录态、主题、语言这类真正全局的少量状态。

</v-click>

<!--
全局数据适合登录态、主题、语言这类全局共享，一处写入所有应用可读可订阅。但用多了会埋耦合，建议只放真正全局的少量状态。子应用侧走 window.microApp 的同名 API。
-->

---

# EventCenter 与虚拟路由分工

独立事件中心 + 「传值归通信、导航归路由」

<v-click>

```js
// 关沙箱 / UMD 多实例：注入的 window.microApp 无法为每个实例隔离
// → 用独立事件中心手动为每个应用建通信通道
import { EventCenterForMicroApp } from "@micro-zoe/micro-app";
window.eventCenterForApp1 = new EventCenterForMicroApp("app1");
// 子应用改用它通信：getData() / dispatch() / addDataListener()
```

</v-click>

<v-click>

**与虚拟路由的关系**（两者别混用）：

- **要给子应用传数据** → 用 `data`/`setData`/`dispatch`/全局数据（本章）
- **要让子应用跳页/控制路由** → 用 `microApp.router.push({ name, path })` / `replace` / `back`

</v-click>

<v-click>

> 反例是「把目标路由塞进 `data` 让子应用自己 `router.push`」——能用但绕。**路由归 `microApp.router`、数据归通信 API**。

</v-click>

<!--
开沙箱（默认）用 window.microApp 就够；只有关沙箱/UMD 多实例才需要 EventCenterForMicroApp 手动隔离通道。通信管传值、虚拟路由管导航，清晰分工避免「数据流里混路由」的耦合。
-->

---
layout: section
---

# 1.0 RC 与现状

长期 RC、京东背书、虚拟路由、Vite 友好、选型定位

---

# 1.0 长期 RC 的时间线

「RC」不等于「不稳定/别用」，而是「稳定在用、版本号没跳」

<v-click>

| 版本 | 日期 | 备注 |
| --- | --- | --- |
| `1.0.0-rc.28` | 2025-12-11 | 持续迭代 |
| `1.0.0-rc.29` | 2026-01-30 | 持续迭代 |
| `1.0.0-rc.30` | 2026-04-20 | 持续迭代 |
| `1.0.0-rc.31` | 2026-06-09 | 持续迭代 |
| **`1.0.0-rc.32`** | **2026-06-25** | **当前最新**（iframe 沙箱增强、Tailwind 4 兼容） |

</v-click>

<v-click>

> 2021-06 建库至今仍是 `1.0.0-rc.x`，**大致月度、有时一月两版**——选型时把它当成一个**活跃维护中的成熟框架**看即可，只是要接受「依赖一个 `rc` 版本号」。

</v-click>

<!--
micro-app 长期停在 1.0.0-rc，2021 年建库至今未发正式 1.0。RC 在这里更像「实际稳定、被大规模用着、只是版本号迟迟不跳到正式」的状态。
-->

---

# 京东生态背书与活跃度

大厂内部大规模生产验证，全框架接入指南

<v-click>

- **规模**：约 **6.2k star**、600+ fork，2021 年至今持续提交与发版
- **背书**：京东（`jd-opensource`，前身 micro-zoe）多条业务线在用——「大厂内部大规模生产验证」是它区别于个人项目的可靠性来源
- **生态**：配套 devtools 调试工具、插件系统、`prefetch` 预加载、UMD/`keep-alive` 等能力

</v-click>

<v-click>

官方还提供**逐框架接入指南**，主/子应用两侧都覆盖：

- **Vue（2/3） / React / Angular**：主子接入、`public-path`、路由 `base`、生命周期
- **Next.js / Nuxt.js**：SSR 场景（配 `ssr` 属性）
- **Vite**：子应用**零沙箱插件**接入（对比 qiankun 需社区插件）

</v-click>

<!--
长期 RC + 大厂在用 + 持续发版 + 全框架指南放一起，画像就清楚了：一个务实、稳定、只是不执着于版本号仪式的框架。RC 不代表不成熟。
-->

---

# 亮点能力：虚拟路由系统

拦截浏览器路由，给子应用一套隔离的 location/history

<v-click>

| `router-mode` | 行为 |
| --- | --- |
| `search`（默认） | 子应用路由**投影到主应用 URL 的 query** 上 |
| `native` | 去掉路由隔离，子/主应用**共享浏览器路由** |
| `native-scope` | 类 `native`，但子应用域名**指向子应用自己** |
| `pure` | 子应用**完全脱离浏览器路由**——不改 URL、不进历史栈 |
| `state` | 用 `history.state` 记录路由、**不改地址栏** |

</v-click>

<v-click>

> 配套 `microApp.router` 提供 `push`/`replace`/`go`/`back`、`setDefaultPage`、守卫 `beforeEach`/`afterEach`——主应用统一管路由、子应用各自隔离，成为开箱能力。

</v-click>

<!--
虚拟路由是 micro-app 相对同类的突出能力：拦截浏览器路由事件、为子应用定制 location/history。5 种 router-mode 覆盖从「投影到 query」到「完全脱离浏览器路由」的不同策略，配 microApp.router 命令式编排与守卫。
-->

---

# ESM / Vite 友好与资源处理

新项目、Vite 主力团队把它排在 qiankun 前面的直接理由

<v-click>

- **原生亲和 Vite/ESM**：不像 **qiankun** 2.x 卡在 `import-html-entry` 接不了 `type=module`——这与 **wujie** 一样，是「子应用用 Vite」场景相对 qiankun 的关键优势

</v-click>

<v-click>

配套两个降低接入摩擦的细节：

- **资源地址补全**：子应用被 `fetch` 到主应用上下文后，相对资源路径（图片、字体、异步 chunk）会失效；micro-app 默认**自动补全为绝对地址**，`disable-patch-request` 可关
- **`globalAssets` 共享资源**：主应用预声明多子应用共用的 JS/CSS，避免重复加载同一份依赖

</v-click>

<v-click>

> micro-app 不只是「能跑 Vite 子应用」，还在**资源加载这层替你把相对路径、公共依赖的坑填了**，进一步压低接入成本。

</v-click>

<!--
qiankun 2.x 接不了 type=module 是最大痛点，micro-app 原生友好 Vite/ESM。再加上资源地址自动补全和 globalAssets 共享资源，构成「子应用资源零改动或极少改动」的基础。
-->

---

# 选型定位与 wujie 对比

用最低接入成本拿组件化微前端，隔离强度按需在 with/iframe 之间选

<v-click>

| 维度 | **micro-app** | **wujie** |
| --- | --- | --- |
| **出品** | 京东 | 腾讯 |
| **容器** | `<micro-app>`（默认非 Shadow DOM） | `<wujie>`（`shadowRoot`） |
| **默认沙箱** | **with 软沙箱**（轻、成本低） | **iframe 物理隔离**（最强） |
| **接入成本** | **最低（一行标签）** | 低（组件化） |
| **版本** | **1.0 长期 RC** | **2026-06 v2.0 复活** |

</v-click>

<v-click>

> 场景匹配、非替代：**最低成本/快速试点** → micro-app；**最强隔离** → wujie；**存量 webpack** → qiankun。

</v-click>

<!--
micro-app 和最接近的对手 wujie 并排看：同属组件化 + Vite 友好阵营，micro-app 默认 with 软沙箱拿最低成本、必要时切 iframe；wujie 默认 iframe 物理隔离拿最强隔离。micro-app 的位置是「接入最轻的那一个」。
-->

---

# 局限与风险

务实地列清短板，避免选型踩坑

<v-click>

- **1.0 未转正**：长期 `rc` 版本号是个心理/合规门槛（有的团队规范不允许依赖 `rc`）——虽然实际稳定，但要能接受
- **默认软隔离**：with 沙箱「防意外不防恶意」，隔离强度不及 iframe/wujie；强隔离要显式开 iframe 沙箱
- **主应用样式下渗**：scopedcss 只圈住子应用样式，**主应用全局样式仍会影响子应用**，需主应用样式收敛配合
- **with 沙箱的坑**：顶层 `var`/`function` 不挂 window，个别三方库要额外处理
- **依赖 Proxy**：`Proxy` 不可 polyfill，必须运行环境原生支持（除 IE 外的现代浏览器都满足）

</v-click>

<!--
五条短板：1.0 未转正的心理/合规门槛、默认软隔离、主应用样式下渗、with 沙箱顶层变量坑、依赖 Proxy。选型时要能接受这些，尤其是「依赖 rc 版本号」和「默认软隔离」。
-->

---

# 近期迭代看维护活跃度

「长期 RC」容易误判为「停更」，但改动跟着真实业务走

<v-click>

| 方向 | 近期迭代内容 |
| --- | --- |
| **iframe 沙箱增强** | Document 禁用、window 事件逃逸修复 |
| **运行环境扩展** | **Worker 代理**、**`file://` 协议**支持（Electron 离线） |
| **样式生态跟进** | CSS `:root` 变量处理、**Tailwind CSS 4 兼容** |
| **兼容性修复** | TypedArray 支持、Firefox `caretRangeFromPoint` 支持 |

</v-click>

<v-click>

> 这些改动的共同点是**「跟着真实业务踩的坑走」**——Electron 离线、Worker、Tailwind 4、Firefox 光标 API。一个「跟得上 Tailwind 4、修得动 Firefox 边角 API」的 RC，工程上完全可以当稳定框架用。

</v-click>

<!--
近期 rc 的实际改动说明 micro-app 仍在持续跟进现代前端生态与真实业务：iframe 沙箱增强、Worker/Electron 支持、Tailwind 4 兼容、Firefox 边角 API。这比版本号更能说明健康度。
-->

---
layout: center
class: text-center
---

# 小结

一个 `<micro-app>` 标签背后，是一套「最低接入成本」的微前端设计

<v-click>

- **CustomElement 容器**：`customElements.define` 定义 `<micro-app>`，五个 DOM 生命周期事件，无需子应用导出函数
- **with 沙箱（默认）**：`Proxy` + `with` 软隔离，注入 `__MICRO_APP_*__`，坑是顶层变量不挂 window
- **iframe 沙箱（可选）**：加 `iframe` 属性换物理隔离，只切 JS 隔离层、其余透明
- **元素与样式隔离**：元素隔离主可访子、scopedcss 前缀改写，主应用样式仍下渗
- **数据通信**：`data`/`setData` 下行、`dispatch` 上行、全局数据、EventCenter；传值归通信、导航归路由
- **1.0 RC 现状**：京东背书、虚拟路由、Vite 友好，接入成本最低——甜区是快速试点/渐进接入

</v-click>

<!--
六个主题收束：CustomElement 容器、with 默认沙箱、iframe 可选沙箱、元素与样式隔离、数据通信、1.0 RC 现状与选型。一条主线贯穿——用一个标签把接入成本压到全场最低。
-->

---
layout: center
class: text-center
---

# 谢谢

micro-app · 京东开源、类 WebComponent 容器 · 一行标签接入微前端

<div class="mt-8 text-gray-400">
基于 micro-app 1.0（RC，rc.32／2026-06） · 面向前端工程师
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/architecture/micro-frontend/micro-app/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
全章覆盖 CustomElement 容器、with/iframe 双沙箱、元素与样式隔离、数据通信、1.0 RC 现状与选型。配套笔记见文档图标链接。感谢观看。
-->
