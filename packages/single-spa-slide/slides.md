---
theme: seriph
background: https://cover.sli.dev
title: single-spa 微前端编排层
info: |
  single-spa —— 浏览器里的微服务、只编排不隔离：三种模块类型、生命周期协议与状态机、root config 与注册、import maps 工作流、框架适配器、v6 现状与 qiankun 底座定位
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:microservices-1 class="text-8xl" />
</div>

<br/>

## single-spa

微前端的生命周期编排层鼻祖：只按路由把子应用装上/卸下，**只编排、不隔离**

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
single-spa 是「浏览器里的微服务」调度器：一个 gzip 后约 5kb 的 npm 包，只做一件极窄的事——按当前 URL 判定哪些子应用该活、哪些该走，然后调用它们导出的 bootstrap/mount/unmount。它不提供 JS 沙箱、不提供样式隔离，那些是 qiankun 在它之上补出来的。
-->

---
transition: fade-out
---

# 这一章讲什么

一条主线：**single-spa 只做「按路由编排子应用生命周期」这一件事**

<v-click>

- **三种模块类型**：application（按路由）/ parcel（手动挂）/ utility module（直接 import）
- **生命周期协议**：bootstrap/mount/unmount + 11 态状态机 + 超时与错误隔离
- **root config 与注册**：registerApplication + activity function + start()，「最薄」哲学
- **import maps 工作流**：原生 ESM + import maps、SystemJS 历史层、overrides/deployer
- **框架适配器**：single-spa-vue/react/angular 把组件包成生命周期
- **现状与定位**：v6 稳定 / v7 卡 beta、qiankun 底座、2026 选型判据

</v-click>

<v-click>

> **qiankun ≈ single-spa + 沙箱 + 样式隔离 + HTML entry** —— 读懂它就读懂国内主流微前端方案的底座。

</v-click>

<!--
六个主题顺序推进：先分清三种模块类型，再看生命周期协议与状态机，然后是 root config 注册、import maps 加载工作流、框架适配器，最后收束到版本现状与选型定位。
-->

---
layout: section
---

# 从问题到心智

single-spa 解决什么、最小心智怎么搭

---

# single-spa 是什么：浏览器里的微服务

官方定义：**A microfrontend is a microservice that exists within a browser**

<v-click>

- 定位：微前端的**生命周期编排与路由分发层**——一个 gzip 后约 **5kb** 的 npm 包，只负责编排子应用的挂载与卸载
- 诞生于 Canopy 的存量系统现代化：要在**同一个页面、不刷新**地同时跑 React / Angular / Vue，还要各团队独立部署

</v-click>

<v-click>

| 收益 | 解决的痛点 | single-spa 怎么做 |
| --- | --- | --- |
| **多框架同页共存** | 老 AngularJS + 新 React 想同页不刷新切换 | 子应用是框架无关的生命周期模块 |
| **独立部署** | 一个大仓库一次发布全量、团队互卡 | 各子应用独立仓库 + `package.json` + CI/CD |
| **按路由懒加载** | 首屏要下全站 JS | activity function 命中才 load + mount |

</v-click>

<!--
后端微服务把大服务拆成独立进程、独立部署、用网络协作；微前端把大前端拆成独立仓库、独立构建、同页协作。single-spa 就是这堆「浏览器里的微服务」的调度器。官方也把丑话说前面：这是一套与常规前端不同的进阶架构，心智负担更高。
-->

---

# 最小 root config：三段心智

**import map 说「代码在哪」，root config 说「谁在什么路由下活」，子应用说「怎么装卸」**

<v-click>

```html
<!-- ① index.html：import map 声明「子应用代码在哪」 -->
<script type="systemjs-importmap">
{ "imports": { "@org/app-vue": "//localhost:8080/org-app-vue.js" } }
</script>
```

</v-click>

<v-click>

```js
// ② root-config.js：全站唯一「启动壳」，只做注册 + start
import { registerApplication, start } from "single-spa";
registerApplication({
  name: "@org/app-vue", // 约定与 import map 键一致
  app: () => System.import("@org/app-vue"), // 加载函数：返回带生命周期的模块
  activeWhen: (loc) => loc.pathname.startsWith("/vue"), // 何时激活
});
start(); // 必须调用：在此之前子应用只 load，不 bootstrap/mount
```

</v-click>

<!--
root config 是整棵树的根，但它薄到几乎没有逻辑——官方原话：Your root config exists only to start up the single-spa applications。一张 import map 加一段十几行的 JS，就是最小可用形态。第三段是子应用导出的生命周期，见下页。
-->

---

# 子应用契约 + 一次路由切换

子应用无论用什么框架，都要**导出三个返回 Promise 的生命周期**

<v-click>

```js
// 子应用入口：框架无关的唯一契约（实务由适配器代劳）
export function bootstrap(props) { return Promise.resolve(); } // 首次加载后跑一次
export function mount(props)     { return Promise.resolve(); } // 激活：渲染进 DOM
export function unmount(props)   { return Promise.resolve(); } // 停用：从 DOM 移除并清理
```

</v-click>

<v-click>

```text
URL 变化 → 对每个已注册应用跑 activity function（这个循环叫 reroute）
        → 该活却没加载的：load 源码 → bootstrap → mount
        → 该走却还活着的：unmount
        → 其余保持不动
```

</v-click>

<v-click>

> 从 `/react` 走到 `/vue`：先 `unmount` React，再 `load + bootstrap + mount` Vue——**这条链路里没有任何一步在做沙箱或样式隔离**。

</v-click>

<!--
返回 Promise 是硬要求，single-spa 靠它知道「这一步做完了没」。运行时循环叫 reroute：每当 URL 变化（hashchange/popstate、被劫持的 pushState/replaceState），就重新算一遍谁该 mount、谁该 unmount。这正是 single-spa 与 qiankun 的分水岭。
-->

---

# single-spa 与 qiankun：不是竞品，是分层

初学最容易混：single-spa 是编排层，qiankun 是在它之上的封装

<v-click>

| 能力 | single-spa | qiankun |
| --- | --- | --- |
| 生命周期编排 / 路由分发 | ✅ 本命 | ✅ 复用 single-spa |
| JS 沙箱（防全局污染） | ❌ 不做 | ✅ Proxy / 快照沙箱 |
| 样式隔离（防样式互踩） | ❌ 不做 | ✅ Shadow DOM / 属性改写 |
| HTML entry（子应用给 HTML） | ❌ 只吃 JS 模块 | ✅ import-html-entry |
| 上手成本 | 高（自搭 import maps、自理隔离） | 低（`registerMicroApps` 开箱即用） |

</v-click>

<v-click>

> **qiankun = single-spa + 沙箱 + 样式隔离 + HTML entry** —— 「single-spa 不管沙箱」不是缺陷，是它把这些留给了上层。

</v-click>

<!--
single-spa 和 qiankun 不是竞品，是分层。single-spa 只保证「按路由把导出生命周期的模块装上/卸下」，其余留白。你要么自己补，要么直接用已经补好的 qiankun。
-->

---
layout: section
---

# 三种模块类型

application / parcel / utility module

---

# 三类型总览：一套架构常三者并用

**application 靠路由、parcel 靠手动、utility 靠 import**

<v-click>

| 维度 | application | parcel | utility module |
| --- | --- | --- | --- |
| API 风格 | 声明式 `registerApplication` | 命令式 `mountRootParcel` | 普通 ES 模块 `export` |
| 激活方式 | 按路由（activity function） | 手动调用 mount | 被 `import` 时 |
| 生命周期 | single-spa 自动托管 | 你手动管理 | 无 |
| 是否渲染 UI | 是（必须） | 是（必须） | 通常否 |
| 框架无关 | 是 | 是（核心卖点） | 是（纯逻辑） |
| 主要用途 | 微前端主组织单位 | 跨框架共享一块 UI | 共享逻辑 |

</v-click>

<v-click>

> 三者不是非此即彼——真实架构通常**三种都有**：几个 application 撑骨架 + styleguide 导出 parcel + 若干 utility module 承载鉴权/请求。

</v-click>

<!--
single-spa 生态里流动的东西不止「子应用」一种。官方把它们归为三类，用途、消费方式、谁管生命周期各不相同。身份由「怎么被消费」决定，而非互斥标签——一个 application 也能兼职 utility module。
-->

---

# application：声明式、按路由、single-spa 托管

微前端的**主组织单位**，你 90% 时间在写的东西

<v-click>

```js
import { registerApplication } from "single-spa";

// 声明式：只描述「是什么、何时活」，不描述「何时挂载」——那是 single-spa 的事
registerApplication({
  name: "@org/orders", // 应用名
  app: () => System.import("@org/orders"), // 加载函数：返回带生命周期的模块
  activeWhen: "/orders", // 路由前缀命中即激活（内部转成 activity function）
});
```

</v-click>

<v-click>

- 被注册的 application **必须导出**生命周期（bootstrap/mount/unmount）；load/bootstrap/mount/unmount 的**时机全由 single-spa 决定**，你不手动触碰
- 它**还能导出**别的方法/组件作为公共接口——一个 application 也可以「兼职」utility module
- **何时用**：只要一块 UI 能**跟某段路由绑定**，它就该是 application——这是默认选择

</v-click>

<!--
application 是声明式的：你在 root config 里用 registerApplication 告诉 single-spa「叫什么、怎么加载、什么路由下活」，剩下的时机全由 single-spa 决定。其余两种模块都是它满足不了时的补充。
-->

---

# parcel：命令式、手动挂载、跨框架 UI 复用

官方定位「**escape hatch 逃生舱**」「我们自己的 Web Components」

<v-click>

```js
import { mountRootParcel } from "single-spa";
import userModalParcel from "@org/styleguide/user-modal"; // 带生命周期的 parcel 配置

// 命令式：你决定何时挂、挂到哪、传什么
const parcel = mountRootParcel(userModalParcel, {
  domElement: document.getElementById("modal-host"), // 挂载容器（parcel 特有 prop）
  user: currentUser, // 任意业务 props 透传
});
await parcel.mountPromise; // 挂载完成
await parcel.unmount(); // 用完必须手动卸载（application 由 single-spa 自动卸）
```

</v-click>

<v-click>

- 经典场景：Vue 写的「新建用户」弹窗被 React 应用直接复用——挂一个**框架无关的 parcel**
- parcel 配置是 `{ bootstrap, mount, unmount, update? }`，比 application 多一个**可选 `update`**；实务用适配器生成，**父组件卸载忘手动 unmount → 泄漏**

</v-click>

<!--
parcel 与 application 最大不同是命令式 + 手动生命周期：single-spa 不会自动帮你挂，你调 mountRootParcel 它立即挂载，父组件卸载时你必须手动 unmount。若复用只发生在同框架内，普通组件 import 就够，不必上 parcel。
-->

---

# utility module：纯逻辑、直接 import、无路由

三者里最朴素的：**一个有自己仓库/CI 的浏览器内 JS 模块**

<v-click>

```js
// @org/api：一个 utility module —— 纯逻辑，无生命周期，无路由
let loggedInUserPromise = fetch("/api/me").then((r) => r.json());

/** 统一封装带鉴权的请求，所有子应用共用一份实现 */
export function authenticatedFetch(url, init) {
  return fetch(url, init).then((r) => r.json());
}
```

```js
// 任意子应用里：像用普通包一样直接 import（构建时标 externals，运行时 import map 指 URL）
import { authenticatedFetch } from "@org/api";
```

</v-click>

<v-click>

- 官方常见例子：**Notification / Styleguide / Error tracking / Authorization / Data fetching**——价值是**消除重复**
- 也是官方**首选的跨应用通信方式**：与其搭全局事件总线/Redux，不如做成 utility module 让需要的应用 `import`——显式依赖、可追溯

</v-click>

<!--
utility module 不被 registerApplication、也不被 mountRootParcel，只被别的微前端直接 import，用起来和普通 npm 包无异。官方立场：跨应用通信首选 utility module 直接 import，而非全局事件总线。
-->

---

# 怎么选：一张决策路径

<v-click>

```text
要共享的是「一整块能绑路由的界面」吗？
  ├─ 是 → application（默认选择，registerApplication）
  └─ 否 → 要共享的是「一块 UI」吗？
          ├─ 是，且要跨框架复用 → parcel（mountRootParcel，记得手动 unmount）
          ├─ 是，但只在同框架内复用 → 普通组件 import（不必上 single-spa）
          └─ 否（只共享逻辑，不渲染） → utility module（直接 import）
```

</v-click>

<v-click>

三条口诀收尾：

- **application 靠路由、parcel 靠手动、utility 靠 import**
- 渲染 UI 的是 **application/parcel**，不渲染的是 **utility**
- 生命周期 single-spa 托管的是 **application**，手动托管的是 **parcel**，压根没有的是 **utility**

</v-click>

<!--
默认选 application；跨框架复用一块 UI 才上 parcel；只共享逻辑不渲染用 utility module；同框架内复用普通 import 就够。三条口诀是三种模块类型的心智锚点。
-->

---
layout: section
---

# 生命周期协议

四个钩子、一台 11 态状态机

---

# 契约：四个钩子，都返回 Promise

single-spa **不关心框架**，只认「子应用导出返回 Promise 的生命周期」

<v-click>

```js
// 子应用入口的生命周期契约（框架无关；实务由适配器生成）
export function bootstrap(props) { return Promise.resolve(); } // 一次性初始化
export function mount(props)     { return Promise.resolve(); } // 渲染进 DOM
export function unmount(props)   { return Promise.resolve(); } // 从 DOM 移除、清副作用
// parcel 还多一个可选 update(newProps)：不重挂地更新 props
```

</v-click>

<v-click>

```js
// 每个钩子也可以是「函数数组」：single-spa 按序 reduce 成一条 Promise 链
export const mount = [
  (props) => registerRoutes(props), // 步骤 1
  (props) => initStore(props),      // 步骤 2
  (props) => renderRoot(props),     // 步骤 3
];
```

</v-click>

<v-click>

> **返回 Promise 是硬要求**——任何钩子的 Promise reject 或超时不结算，应用都会被判「坏掉」。

</v-click>

<!--
这组返回 Promise 的函数就是编排器和子应用之间的全部契约。数组钩子在 mount 里很实用：把注册路由、初始化状态、渲染根组件拆成三步，可读性更好。
-->

---

# 每个钩子该做什么

<v-click>

| 钩子 | 触发时机 | 该做的事 | 常见错误 |
| --- | --- | --- | --- |
| **`bootstrap`** | 首次 load 后、首次 mount 前，只一次 | 一次性初始化：建单例、注入全局配置 | 把「每次挂载都要做的」放进来 |
| **`mount`** | 应用被激活（activity 变真） | 渲染进 DOM、挂事件/定时器/订阅 | 忘了记下要清理的副作用 |
| **`unmount`** | 应用被停用（activity 变假） | 从 DOM 卸载、逐一清理 mount 挂的东西 | 只 remove DOM 不摘监听器 → 泄漏 |
| **`update`**（仅 parcel） | 父应用调 `parcel.update()` | 不重挂地把新 props 应用上去 | 用在 application 上（无此钩子） |

</v-click>

<v-click>

> 一条铁律：**`mount` 与 `unmount` 必须镜像对称**——mount 里 `addEventListener`/`setInterval`/`subscribe` 的每一笔，unmount 里都要有对应的清理。single-spa 只调用你的 `unmount`，**清理是你的责任**（它本身不提供沙箱）。

</v-click>

<!--
mount 与 unmount 必须镜像对称是核心心智。single-spa 只调用 unmount，不知道你 mount 里挂了什么，清理全靠你。沙箱能兜一部分全局副作用，但 single-spa 本身不提供沙箱。
-->

---

# 状态机：一个应用的一生

single-spa 为每个注册应用维护一台状态机（共 11 态）——排错时看 `getAppStatus(name)`

<v-click>

| 状态 | 含义 |
| --- | --- |
| `NOT_LOADED` | 已注册，未加载源码 |
| `LOADING_SOURCE_CODE` | 正在下载 / 执行源码 |
| `NOT_BOOTSTRAPPED` · `BOOTSTRAPPING` | 源码就绪 · bootstrap 执行中 |
| `NOT_MOUNTED` · `MOUNTING` | 未挂载（或刚卸载）· mount 执行中 |
| `MOUNTED` | **正活在 DOM 上** |
| `UNMOUNTING` · `UNLOADING` · `UPDATING` | 卸载 · unload 中 · parcel update 中 |

</v-click>

<v-click>

> 外加两个「坏掉」的终点态 `LOAD_ERROR` / `SKIP_BECAUSE_BROKEN`（见下页）；查询 API：`getMountedApps()`、`getAppNames()`。

</v-click>

<!--
理解这台状态机，线上排错时看一眼 getAppStatus 就知道卡在哪。11 个状态里主干是 NOT_LOADED 到 MOUNTED 一条时间线，另有 UPDATING（parcel）、UNLOADING（unloadApplication）与两个坏掉的终点态。
-->

---

# 主干时间线 + 两个「坏掉」的终点

<v-click>

```text
注册        加载                引导            挂载        （活着）
NOT_LOADED → LOADING_SOURCE_CODE → NOT_BOOTSTRAPPED → BOOTSTRAPPING
          → NOT_MOUNTED → MOUNTING → MOUNTED
          ← NOT_MOUNTED ← UNMOUNTING ←（停用时反向卸载）
```

</v-click>

<v-click>

| 终点态 | 触发 | 能否恢复 |
| --- | --- | --- |
| **`LOAD_ERROR`** | 加载失败（如网络抖动） | **可恢复**：下次路由变化会重试 |
| **`SKIP_BECAUSE_BROKEN`** | 生命周期抛错 / 超时死亡 | **不可恢复**：永久隔离、不再尝试 |

</v-click>

<v-click>

> `SKIP_BECAUSE_BROKEN` 是故障隔离：某应用「坏了」就永久隔离它，**避免一个坏应用反复拖垮整页**。

</v-click>

<!--
两个坏掉的分支要分清：LOAD_ERROR 可恢复，下次路由切换 single-spa 再试一次；SKIP_BECAUSE_BROKEN 不可恢复，某生命周期抛错或超时死亡，此后永久隔离。
-->

---

# 超时配置：别让慢应用拖死整页

某应用 `mount` 迟迟不结算（既不 resolve 也不 reject），会卡住整条 reroute

<v-click>

```js
import {
  setBootstrapMaxTime, setMountMaxTime,
  setUnmountMaxTime, setUnloadMaxTime,
} from "single-spa";

// 参数：(最大毫秒数, dieOnTimeout 超时是否判死, 打印 warning 的毫秒阈值)
setBootstrapMaxTime(4000, false, 1000); // 4s 没 bootstrap 完只告警，不判死
setMountMaxTime(3000, true, 1000);      // 3s 没 mount 完 → 判 SKIP_BECAUSE_BROKEN
setUnmountMaxTime(3000, true, 1000);
setUnloadMaxTime(3000, false, 1000);
```

</v-click>

<v-click>

- 关键是第二个参数 **`dieOnTimeout`**：`false` 只在控制台打警告、仍等它继续跑；`true` 超时即打入 `SKIP_BECAUSE_BROKEN`——用「牺牲一个慢应用」保住整页
- `warningMillis`：提前告警的软阈值，在应用「还没死但已经很慢」时就发现问题

</v-click>

<!--
四个全局超时设置分别对应 bootstrap/mount/unmount/unload 四个阶段。dieOnTimeout 为 true 时超时判死，用牺牲一个慢应用保住整页可用。
-->

---

# 错误处理与 unload

生命周期 / activity function 抛错 → 调用你注册的全局错误处理器

<v-click>

```js
import { addErrorHandler, unloadApplication } from "single-spa";

addErrorHandler((err) => {
  // err.appOrParcelName：出错的应用/包裹名；err.message / err.stack 照常
  console.error(`[single-spa] ${err.appOrParcelName} 生命周期出错`, err);
  reportToSentry(err); // 上报错误追踪服务（一个 utility module）
});

// 强制让应用从头再来（热更新/状态脏了）：打回 NOT_LOADED，下次重新 bootstrap
await unloadApplication("@org/orders"); // 默认 waitForUnmount:false，先 unmount 再 unload
```

</v-click>

<v-click>

- 生命周期抛错 → 应用进 **`SKIP_BECAUSE_BROKEN`** 被永久隔离，**其余应用不受影响**——一个子应用崩了不该让整页崩
- `unloadApplication(name, { waitForUnmount })`：`true` 则等它自然卸载再重置；相邻的 `unregisterApplication` 更彻底（卸载 + unload + 注销）

</v-click>

<!--
错误处理器里通常做两件事：上报，以及可选地给用户「该模块暂不可用」的降级提示。unloadApplication 把应用打回 NOT_LOADED，下次激活会重新 load + bootstrap，用于热更新或强制重置。
-->

---
layout: section
---

# root config 与注册

registerApplication · activity function · start()

---

# root config：最薄的启动壳

官方定位：**exists only to start up（只为启动子应用而存在）**

<v-click>

```js
import { registerApplication, start } from "single-spa";
registerApplication({
  name: "@org/navbar",
  app: () => System.import("@org/navbar"),
  activeWhen: () => true, // 导航栏：所有路由常驻
});
registerApplication({
  name: "@org/orders",
  app: () => System.import("@org/orders"),
  activeWhen: "/orders", // 只在 /orders 下激活
});
start(); // 启动：在此之前应用只 load，不 bootstrap/mount
```

</v-click>

<v-click>

> **root config 里不放业务逻辑**——它越薄，越不会变成「所有团队都要改的那个文件」，「独立部署」的承诺才立得住。

</v-click>

<!--
root config 由一张共享 HTML 外壳（含 import map）和一段 JS 组成，JS 的全部职责就是注册应用并启动。这句「exists only to start up」是一条设计纪律：不渲染内容、不管数据、不处理鉴权细节——那些都在子应用里。
-->

---

# registerApplication：两种签名、四个参数

注册子应用的唯一入口，两种写法语义等价

<v-click>

```js
// 写法 A：位置参数 (name, app, activeWhen, customProps)
registerApplication("@org/app2", () => import("./app2.js"),
  (loc) => loc.pathname.startsWith("/app2"), { some: "value" });
// 写法 B：配置对象（推荐——参数有名字，更可读）
registerApplication({
  name: "@org/app1", app: () => import("./app1.js"),
  activeWhen: "/app1", customProps: { some: "value" },
});
```

</v-click>

<v-click>

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| **`name`** | string | 唯一名，与 import map 键一致 |
| **`app`** | 函数 / 对象 | 加载函数 `() => import(...)` 或已解析对象 |
| **`activeWhen`** | 串 / 函数 / 数组 | 何时激活（见下页） |
| **`customProps`** | 对象 / 函数 | 透传给生命周期的数据 |

</v-click>

<!--
app 传加载函数是常态（才能懒加载）；传已解析对象则用于「代码已在手边、不需额外加载」的场景，即 `{ bootstrap, mount, unmount }`。推荐配置对象写法，参数有名字更可读。
-->

---

# activeWhen：四种写法，都归约成 activity function

本质是**纯函数** `location => 真值`，返回真时应用该活

<v-click>

```js
// 四种写法，最终都归约成一个 activity function
activeWhen: "/app1",                     // 1) 路径前缀：匹配 /app1 与 /app1/**
activeWhen: "/users/:userId/profile",    // 2) 含参路径：:userId 是动态段
activeWhen: (loc) => loc.pathname.startsWith("/app2"), // 3) 自定义函数
activeWhen: ["/pathname/#/hash", "/app1"], // 4) 数组：命中其一即激活
```

</v-click>

<v-click>

- 重新求值时机：`hashchange`/`popstate`、被劫持的 `pushState`/`replaceState`、`triggerAppChange()`、`checkActivityFunctions()`
- 两条纪律：**必须是纯函数**（同样 location 永远同样结果，别改状态/发请求）、**尽量便宜**（每次路由变化都跑一遍）

</v-click>

<!--
字符串前缀 pathToActiveWhen 转出来的函数已经够用，只有前缀表达不了的判定（如按 query 参数激活）才手写函数。
-->

---

# start()：不调用就不挂载

`registerApplication` 只是登记，`start()` 才是挂载开关

<v-click>

```js
import { start } from "single-spa";

// 常见模式：先发首屏必须的初始化请求，回来再 start()
fetchInitialConfig().then(() => {
  start(); // 此刻才允许挂载——避免应用在配置就绪前就渲染半成品
});

start({ urlRerouteOnly: true }); // v6 默认 true：只在 URL 真正变化时 reroute
```

</v-click>

<v-click>

- `start()` 之前：single-spa 会**下载**（load）子应用代码，但**不会** bootstrap/mount/unmount 任何东西
- 价值：代码**并行下载**（不等 start），**挂载时机由你控制**——放在读配置/校验登录态之后
- `urlRerouteOnly`：`pushState`/`replaceState` 到当前同一 URL 不触发 reroute，减少无谓重算

</v-click>

<!--
先注册后 start 的设计把「代码下载」与「挂载时机」解耦：应用代码可并行下载，但挂载时机由你控制，避免子应用在数据就绪前抢先渲染半成品。
-->

---

# customProps 与多应用容器约定

root config 向子应用生命周期**单向传数据**的通道

<v-click>

```js
// 静态对象：所有激活都传同一份
customProps: { authToken: getToken(), theme: "dark" },

// 函数：按 name / location 动态生成（如给不同应用发不同 scope 的 token）
customProps: (name, location) => ({
  authToken: getTokenForApp(name),
  fromPath: location.pathname,
}),
```

</v-click>

<v-click>

```html
<!-- 多应用同页：single-spa 按 single-spa-application:应用名 找容器 -->
<div id="single-spa-application:@org/navbar"></div>
<div id="single-spa-application:@org/orders"></div>
```

</v-click>

<v-click>

> `customProps` 适合**启动期确定、单向下发**的数据（token/主题/语言）；频繁双向通信走 utility module 或事件。更结构化的多区域布局用 `single-spa-layout`。

</v-click>

<!--
customProps 挂载时被并进 props，子应用在 mount(props) 里拿到。想要顶栏+侧栏+主区各挂不同应用的结构化布局，官方提供 single-spa-layout 用声明式模板描述，比手写一堆容器 div 更好维护。
-->

---
layout: section
---

# import maps 工作流

原生 ESM + import maps、SystemJS 历史层、overrides / deployer

---

# import map 解决什么：运行时把裸说明符指到 URL

`import "@org/api"` 里的 `@org/api` 是**裸说明符**，浏览器原生不知对应哪个 URL

<v-click>

```html
<!-- import map：告诉浏览器每个裸说明符对应哪个 URL -->
<script type="importmap">
{
  "imports": {
    "@org/orders": "//cdn.example.com/orders/a1b2c3/org-orders.js",
    "react": "//cdn.example.com/react@18/index.js"
  }
}
</script>
```

</v-click>

<v-click>

- **改一个 URL = 换一份代码**——不用重构整站、不改任何子应用源码：这是「独立部署」落地的关键机制
- 分层原则（官方）：**每个子应用是浏览器内模块、每个大的共享依赖也是浏览器内模块、其余一切是构建时模块**——React/Vue 运行时共享，lodash 里你只用的两个函数照常打进 bundle

</v-click>

<!--
传统做法是构建工具打包时把裸说明符解析掉；single-spa 把解析推迟到运行时，交给 import map。每个子应用是一个浏览器内模块，import map 是它们之间的「电话簿」。
-->

---

# 原生 ESM vs SystemJS：一张对比表

<v-click>

| 维度 | 原生 ESM + import maps | SystemJS（历史 polyfill） |
| --- | --- | --- |
| script 类型 | `<script type="importmap">` | `<script type="systemjs-importmap">` |
| 加载入口 | 原生 `import` | `System.import(...)` |
| 构建产物格式 | 标准 ESM | `System.register`（webpack/rollup 改 format） |
| 浏览器支持 | Baseline 广泛可用（2023-03） | 老浏览器兼容层 |
| 吃标准 ESM 包 | ✓ | ✗（需 esm-bundle / JSPM CDN） |
| 定位 | **现代首选** | **历史 / 兼容，退居 polyfill** |

</v-click>

<v-click>

> 两者的 import map **JSON 结构基本一致**，迁移主要是换 `<script>` 的 `type` 和构建产物格式。

</v-click>

<!--
import maps 已 Baseline Widely available（2023-03 起），现代 single-spa 可直接用原生 ESM：子应用产物是标准 ES 模块，用 script type=importmap 声明电话簿、type=module 启动，全程无需加载器。原生路线没有运行时加载器开销、无需改构建格式，天然兼容 Vite/ESM 子应用。
-->

---

# SystemJS：历史 polyfill，为何是「类 polyfill」

官方原话：受 JS 语言限制，**「裸说明符 → URL 的解析无法被真正 polyfill」**

<v-click>

```html
<!-- SystemJS 路线：用 systemjs-importmap，且用 System.import 而非原生 import -->
<script type="systemjs-importmap">
{ "imports": { "@org/orders": "//cdn.example.com/orders/a1b2c3/org-orders.js" } }
</script>
<script src="//cdn.example.com/systemjs/system.min.js"></script>
<script>System.import("@org/root-config");</script>
```

</v-click>

<v-click>

```js
// 代价：构建产物必须改成 system 格式（不是标准 ESM）
module.exports = { output: { libraryTarget: "system" } }; // webpack
export default { output: { format: "system" } };          // rollup
```

</v-click>

<v-click>

> SystemJS **吃不下标准 ESM 包**——`react` 官方产物是 ESM，需取 `System.register` 版：**esm-bundle** / **JSPM CDN** / **generator.jspm.io** / self-hosted。

</v-click>

<!--
它的办法是让代码编译成 System.register 模块格式，再由 SystemJS 运行时解析。结论：新项目上原生 ESM + import maps；SystemJS 是历史包袱/兼容层，只在要支持老浏览器或用 scopes 等高级能力时保留。
-->

---

# externals + import map：共享依赖只下一份

「五个子应用 = 用户下载五份 React」是微前端最常见的性能坑

<v-click>

```js
// 构建时：把共享依赖标为 externals，不打进自己的 bundle
module.exports = { externals: [/^@org\/.+/, "react", "react-dom"] }; // webpack
export default { external: ["@org/api", "react", "react-dom"] };     // rollup
```

```json
// 运行时：import map 把这些外部依赖指到唯一 URL —— 全站共下一份
{ "imports": { "react": "//cdn.example.com/react@18/index.js" } }
```

</v-click>

<v-click>

- `externals` 让构建工具**不把大库打进 bundle**，import map 保证运行时所有 `import "react"` 都指向**同一 URL**——浏览器只下载、只缓存一份
- 共享依赖通常单独放 `shared-dependencies` 仓库维护那张公共 import map 片段，升级 React = 提一个 PR、改一个 URL

</v-click>

<!--
externals + import map 是构建时与运行时的组合拳。这条路线与 Module Federation 的 shared 是「集中裁定 vs 运行时协商」的两种哲学。
-->

---

# overrides + deployer：本地开发与并发部署

两个官方工具，解决微前端最烦的两件事

<v-click>

**import-map-overrides**：本地只起当前这一个子应用

```json
// 浏览器里临时覆盖某个键：navbar 指向本地，其余全用线上部署版
{ "imports": {
  "@org/navbar": "https://localhost:8080/org-navbar.js",
  "@org/orders": "https://cdn.example.com/orders/a1b2c3/org-orders.js"
} }
```

</v-click>

<v-click>

**import-map-deployer**：并发安全地改线上 import map（CI 用 PATCH 只改自己那个键）

```bash
curl -X PATCH https://import-map.example.com/import-map.json \
  -d '{"imports": {"@org/orders": "https://cdn.example.com/orders/x9y8z7/org-orders.js"}}'
```

</v-click>

<v-click>

> **发布一个子应用 = 改 import map 的一个键**——不重构整站、不惊动其他应用，真正的独立部署。

</v-click>

<!--
overrides 的价值：本地环境与完整集成的线上环境之间没有差异，覆盖存 localStorage 只影响你自己。deployer 解决并发：多团队同时部署同一份 import map 会互相覆盖，deployer 保证只改自己那个键。部署两步：新 bundle 传 CDN；deployer 把键指向新 URL。
-->

---
layout: section
---

# 框架适配器

把框架组件包成 bootstrap / mount / unmount

---

# 适配器做什么：把组件包成生命周期

single-spa 只认「导出 bootstrap/mount/unmount」，适配器封装掉这套样板

<v-click>

```text
框架组件 + 适配器  →  { bootstrap, mount, unmount }  →  export 给 single-spa
```

</v-click>

<v-click>

- 三大主力 **single-spa-vue** / **single-spa-react** / **single-spa-angular**，都返回 `{ bootstrap, mount, unmount }`，直接 `export` 即可被 `registerApplication` 消费
- 「用 single-spa 接入一个框架」的工作量，几乎等于「调一次适配器、把返回值 export 出去」
- 统一支持 `loadRootComponent`（异步给根组件）、`domElementGetter`（自定义挂载容器）等通用选项

</v-click>

<v-click>

> 你几乎**不用手写生命周期**——没人愿意手写「渲染根组件、卸载时销毁实例、还要处理 props」这套样板。

</v-click>

<!--
适配器把「用什么框架、渲染哪个根组件、挂到哪」这套样板封装掉，吐出一组现成的生命周期函数，你直接 export。下面三节是三大主力适配器的关键参数。
-->

---

# single-spa-vue

`singleSpaVue(opts)` 返回生命周期——Vue 3 传 `createApp`，Vue 2 传 `Vue`

<v-click>

```js
import { createApp, h } from "vue";
import singleSpaVue from "single-spa-vue";
import App from "./App.vue";

const vueLifecycles = singleSpaVue({
  createApp, // 必填：Vue 3 的 createApp（Vue 2 改传 Vue 构造器）
  appOptions: { render() { return h(App); } }, // 必填：传给 createApp 的配置
  handleInstance: (app, props) => { app.use(router); }, // 可选：拿实例做额外装配
});

// 直接把生命周期 export 出去，供 registerApplication 消费
export const { bootstrap, mount, unmount } = vueLifecycles;
```

</v-click>

<v-click>

> single-spa 传进来的 props（`name`/`mountParcel`/`singleSpa`）会挂在组件的 `this` 上；`appOptions` 还能写成**异步函数**接收 props 动态生成配置。

</v-click>

<!--
Vue 3 与 Vue 2 的核心差异是 Vue 3 传 createApp 函数，Vue 2 传 Vue 构造器。loadRootComponent 可替代 appOptions.render 用异步方式给根组件。
-->

---

# single-spa-react

React 18 起 `createRoot` 取代 `render`，适配器参数随之分叉

<v-click>

```js
import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import RootComponent from "./root.component";

export const { bootstrap, mount, unmount } = singleSpaReact({
  React,          // 必填：React 主对象
  ReactDOMClient, // 必填（React 18+）：提供 createRoot，renderType 默认 createRoot
  rootComponent: RootComponent, // 必填：要渲染的顶层组件
});
```

</v-click>

<v-click>

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `React` / `rootComponent` | ✅ | 主对象 / 顶层组件（或 `loadRootComponent` 异步给） |
| `ReactDOMClient` / `ReactDOM` | 分版本 | 18+ 传前者（`createRoot`），≤17 传后者（`render`） |
| `errorBoundary` / `domElementGetter` | 可选 | 故障降级 UI / 自定义挂载容器 |

</v-click>

<!--
React 18 迁移点：从传 ReactDOM 改为传 ReactDOMClient，适配器据此自动把 renderType 切到 createRoot——升级 React 18 时最容易漏改的一处。errorBoundary 形如 (err, info, props) => UI。
-->

---

# single-spa-angular

Angular 有 NgModule/Zone/Router 重机制，官方强烈建议**脚手架生成**而非手搓

<v-click>

```js
// main.single-spa.ts —— 由 ng add single-spa-angular 生成，此处示意关键参数
import { singleSpaAngular } from "single-spa-angular";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { NgZone } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { AppModule } from "./app/app.module";

export const { bootstrap, mount, unmount } = singleSpaAngular({
  bootstrapFunction: (props) => platformBrowserDynamic().bootstrapModule(AppModule),
  template: "<app-root />", // 必填：注入 DOM 的模板
  Router, NavigationStart, NgZone, // router 事件类 + Zone（无 Zone 传 "noop"）
});
```

</v-click>

<v-click>

> 落地一条命令：**`ng add single-spa-angular`**（schematic）——生成 `main.single-spa.ts`、`single-spa-props.ts`、`asset-url.ts` 等文件，把接入样板一次性铺好。

</v-click>

<!--
Angular 因为有一套重机制，适配器参数更多。schematic 会把接入样板一次性铺好，不用手搓入口文件。
-->

---

# 其余适配器与配套工具链

single-spa 生态几乎覆盖所有主流框架

<v-click>

- 其余适配器：**svelte / preact / ember / angularjs / alpinejs / riot / inferno / dojo** 等，以及 **single-spa-html**、**single-spa-web-components**

</v-click>

<v-click>

| 工具 | 作用 |
| --- | --- |
| **create-single-spa** | 官方脚手架：生成 root config / app / utility 模板 |
| **single-spa-layout** | 声明式描述「哪个应用挂哪个 DOM 区域」 |
| **import-map-overrides** / **import-map-deployer** | 本地覆盖 / 并发安全更新线上 import map |
| **systemjs-webpack-interop** | SystemJS 路线下动态设置 `publicPath` |

</v-click>

<v-click>

> Angular 生态另有 **Native Federation**（@angular-architects）——用原生 ESM + import maps 走 MF 心智，与 single-spa-angular 是**两条独立路线**。

</v-click>

<!--
配套工具链把脚手架、布局、import maps 工具都覆盖了。Native Federation 侧重模块与依赖的联邦共享，single-spa 侧重生命周期编排与路由分发，两者可组合但不是一回事。
-->

---
layout: section
---

# 现状与定位

v6 稳定 / v7 卡 beta · qiankun 底座 · 2026 选型

---

# 版本现状：v6 稳定、v7 长期 beta

截至 2026-07 核对 npm 与 GitHub Releases

<v-click>

| 版本 | 发布时间 | 标签 | 状态 |
| --- | --- | --- | --- |
| `6.0.0` | 2023-12-03 | — | v6 首发 |
| **`6.0.3`** | **2024-09-29** | **`latest`** | **当前稳定版**（生产推荐） |
| `7.0.0-beta.0` | 2024-09-30 | `beta` | v7 beta 起点 |
| **`7.0.0-beta.13`** | **2025-09-22** | **`beta`** | **最新 beta，此后无更新** |

</v-click>

<v-click>

- 稳定线停在 v6.0.3、一整年只出三个补丁——「**成熟且少变**」的典型形态
- v7 从 2024-09 进 beta，历经 13 个 beta 到 2025-09，**之后再无发布**——没有正式 v7、势头停滞

</v-click>

<v-click>

```bash
npm view single-spa dist-tags   # 看 latest / beta 当前指向
npm view single-spa time --json # 看每个版本真实发布时间，判断是否停更
```

</v-click>

<!--
两个事实：稳定线停在 v6.0.3 且一年只出三个补丁；v7 从 2024-09 进 beta 历经 13 个 beta 到 2025-09 后再无发布。选型前建议亲跑一遍复现命令，别只信二手结论。
-->

---

# 怎么读「长期 beta 且停更」

听起来像项目要黄，但对定位极窄的库要换个角度读

<v-click>

- **核心已够用**：single-spa 只做生命周期编排 + reroute，这套 API 从 v5 到 v6 基本稳定，v7 更像**渐进打磨、不是重写**
- **无紧迫升级压力**：它不碰沙箱/样式/加载这些「快速演进」的领域（那些在 qiankun/wujie/MF 层），核心可以长期不动
- **生产结论**：2026 年上 single-spa，**用 v6.0.3（`latest`）**是正确选择，不必等 v7、也不必用 beta

</v-click>

<v-click>

> 需警惕**生态活跃度**：编排层稳定不等于周边（适配器、deployer）都持续维护；`single-spa-vue`/`react`/`angular` 各自版本要**分别核对**（不同仓、不同节奏）。

</v-click>

<v-click>

> 一句定性：**single-spa 不是过时，而是「稳定到不需要频繁更新」**。

</v-click>

<!--
长期 beta 且停更，恰恰反映「没有非升不可的理由」。但编排层稳定不等于适配器等周边都活跃，选型时应实际核对所依赖适配器的版本与 issue 活跃度。
-->

---

# 作为 qiankun 底座的意义

qiankun 直接依赖 single-spa，复用其编排 + 路由，再补三样留白

<v-click>

```text
┌─────────────────────── qiankun ────────────────────────┐
│  HTML entry（import-html-entry：吃子应用 HTML、解析清单）  │
│  JS 沙箱（Proxy / 快照：防全局污染）                       │
│  CSS 隔离（Shadow DOM / 属性改写：防样式互踩）              │
│  ┌──────────────── single-spa（底座）────────────────┐   │
│  │  生命周期编排（bootstrap/mount/unmount）            │   │
│  │  reroute 路由分发（activity function 判定谁激活）    │   │
│  └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

</v-click>

<v-click>

> **qiankun ≈ single-spa + import-html-entry + 沙箱 + 样式隔离** —— 读懂 single-spa 就等于读懂了 qiankun 的一半：它的路由/生命周期问题，根子往往在 single-spa 的机制里。

</v-click>

<!--
qiankun 并没有重新发明路由编排，它直接依赖 single-spa，复用生命周期协议与 reroute 路由分发，然后补上 single-spa 刻意留白的三样能力：HTML entry、JS 沙箱、CSS 隔离。
-->

---

# 直接用 single-spa vs 用 qiankun

「只编排、不隔离」是定位，也是直接用它的**代价清单**

<v-click>

| single-spa 不做的事 | 直接用的后果 | qiankun 怎么补 |
| --- | --- | --- |
| JS 沙箱 | 全局变量/事件/定时器互相污染 | Proxy / 快照沙箱自动隔离 |
| 样式隔离 | 两个子应用样式互相覆盖 | Shadow DOM / 属性改写 |
| HTML entry | 子应用必须改造成 JS 生命周期模块 | import-html-entry 直接吃 HTML |
| 加载器脚手架 | 自搭 import maps + overrides + deployer | `registerMicroApps` 开箱即用 |

</v-click>

<v-click>

- **直接用 single-spa**：已全面 ESM + import maps；子应用**同栈、团队自律**不需强隔离；要**极致控制**加载/路由/共享；做平台化、**自建底座**
- **用 qiankun**（或 wujie/micro-app）：要**开箱即用**的沙箱 + 样式隔离；子应用只愿给 **HTML 地址**；团队大要**降低互相踩坑**。国内业务团队多落此档

</v-click>

<!--
single-spa 只保证「按路由把导出生命周期的模块装上/卸下」，以下这些一概不管，直接用就得自己扛。据此形成选型判据。
-->

---

# 2026 选型位置 + 与 Module Federation

single-spa 的坐标是「**编排层标杆 / 底座**」，不是拿来即用的业务框架

<v-click>

- 直接选它的多是**有平台化诉求、愿自建能力**的团队；多数业务团队用**封装**：国内 **qiankun**（single-spa 底座），更强隔离转 **wujie**（iframe 沙箱）/ **micro-app**（低侵入）
- 只需**模块与依赖共享**、不需页面级隔离，则是 **Module Federation** 的领域

</v-click>

<v-click>

官方立场：**MF 是性能技术，与 single-spa 互补、可以一起用**——不在同一层、不冲突

| 关注点 | single-spa | Module Federation |
| --- | --- | --- |
| 主职责 | 生命周期编排 + 路由分发 | 模块与依赖的运行时共享 |
| 抽象单位 | application / parcel（可挂载 UI） | expose 的模块（细到组件/函数） |
| 依赖共享 | externals + import maps（集中裁定） | `shared`（运行时 semver 协商） |

</v-click>

<!--
一种真实组合：用 single-spa 做「哪个子应用在哪个路由激活」的编排骨架，用 MF 做「子应用之间的模块/依赖共享」，各司其职。single-spa 官方甚至把 MF 与自家 import maps 并列为可选的依赖共享手段。
-->

---
layout: center
class: text-center
---

# 小结

single-spa 把微前端窄化成一件事：**按路由编排子应用的生命周期**

<v-click>

- **三种模块类型**：application 靠路由 · parcel 靠手动 · utility module 靠 import
- **生命周期协议**：bootstrap/mount/unmount + 11 态状态机，`LOAD_ERROR` 可重试、`SKIP_BECAUSE_BROKEN` 永久隔离
- **root config**：`registerApplication` + activity function + `start()`，「最薄」哲学
- **import maps**：原生 ESM 现代首选、SystemJS 历史 polyfill；externals 共享依赖只下一份
- **框架适配器**：single-spa-vue/react/angular 把组件包成生命周期
- **现状与定位**：v6.0.3 稳定 / v7 卡 beta；**qiankun ≈ single-spa + 沙箱 + 样式隔离 + HTML entry**

</v-click>

<v-click>

> 它自身只有 5kb、只认「导出 bootstrap/mount/unmount」这一条契约，其余一律留给上层封装或你自己。

</v-click>

<!--
六个主题收束：三种模块类型、生命周期协议与状态机、root config 注册、import maps 加载工作流、框架适配器、版本现状与选型定位。理解 single-spa 就理解了 qiankun 的底座。
-->

---
layout: center
class: text-center
---

# 谢谢

single-spa · 浏览器里的微服务，只编排不隔离

<div class="mt-8 text-gray-400">
基于 single-spa v6 · 面向前端工程师
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/architecture/micro-frontend/single-spa/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
全叶覆盖三种模块类型、生命周期协议、root config、import maps 工作流、框架适配器、现状与定位。配套笔记见文档图标链接。感谢观看。
-->
