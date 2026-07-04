---
theme: seriph
background: https://cover.sli.dev
title: qiankun 微前端框架
info: |
  qiankun = single-spa + HTML entry + JS 沙箱 + 样式隔离 —— 核心 API、三沙箱自动选择、样式隔离两开关、HTML entry 接入约束、Vite/ESM 之痛、3.0 演进与选型
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:assembly-cluster class="text-8xl" />
</div>

<br/>

## qiankun 微前端框架

蚂蚁开源、国内存量最大 —— single-spa + HTML entry + JS 沙箱 + 样式隔离 的开箱方案

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
qiankun（乾坤）是蚂蚁集团开源的微前端框架，国内存量最大、最常被面试问到。定位一句话：single-spa 之上补齐 HTML entry、JS 沙箱、样式隔离三样留白，主打「接入像 iframe 一样简单」。
-->

---
transition: fade-out
---

# 这一章讲什么

一条主线：**qiankun 在 single-spa 之上补齐了什么，又付出了什么代价**

<v-click>

- **核心 API**：`registerMicroApps` / `start` / `loadMicroApp`、`singular` 单实例 vs 多实例
- **沙箱实现**：三沙箱自动选择、Proxy 代理 window、拦得住什么拦不住什么
- **样式隔离**：`strictStyleIsolation` 弹窗逃逸、`experimentalStyleIsolation` at-rule 限制、@scope
- **HTML entry 与接入约束**：UMD 打包、publicPath 修正、CORS、报错排查
- **Vite 与 ESM 之痛**：fetch+eval 根因、`vite-plugin-qiankun` 局限、换路线信号
- **演进与现状**：prefetch、通信、2.10.16 稳定线、3.0 三年难产与选型

</v-click>

<v-click>

> **qiankun = single-spa + HTML entry + JS 沙箱 + 样式隔离** —— 一条等式贯穿全章。

</v-click>

<!--
六个主题顺序推进：先吃透核心 API，再看沙箱与样式隔离两个难点，然后是 HTML entry 接入约束，接着 Vite/ESM 之痛，最后演进与选型。
-->

---

# qiankun 是什么

一句话定位：**基于 single-spa 的开箱微前端框架**

<v-click>

- **蚂蚁集团开源**，国内**存量最大、面试必考**的微前端框架，中文资料最全
- 等式定位：**qiankun = single-spa + HTML entry + JS 沙箱 + 样式隔离**
- single-spa 只做「按路由把子应用 mount/unmount」的编排，**故意不管**隔离与资源加载
- qiankun 在它之上补齐三样留白，包成「主应用两行 + 子应用三件事」

</v-click>

<v-click>

设计哲学两条：

| 哲学 | 含义 |
| --- | --- |
| **简单** | 「接入像用 iframe 一样简单」，核心 API 极少 |
| **解耦** | HTML entry / 沙箱 / 通信 都松耦合，可各自替换 |

</v-click>

<!--
qiankun 真正的卖点不是它发明了什么新机制，而是把微前端的隔离与加载做成了开箱即用。它的底座是 single-spa，价值全在 single-spa 的留白处。
-->

---

# 补齐 single-spa 的三件事

qiankun 的全部意义，是把 single-spa 的三处留白包成两行 API

<v-click>

| 能力 | single-spa | qiankun 怎么补 |
| --- | --- | --- |
| 路由编排 / 生命周期 | ✅ 本命 | ✅ 复用 single-spa |
| 子应用如何提供 | 只吃 JS 模块（手写 import maps） | **HTML entry**：`entry` 填 HTML 地址 |
| JS 全局污染 | ❌ 不做 | **JS 沙箱**：Proxy 代理 `window` |
| 样式互踩 | ❌ 不做 | **样式隔离**：Shadow DOM / 属性改写 |
| 上手成本 | 高（自理隔离 + import maps） | 低（`registerMicroApps` 开箱） |

</v-click>

<v-click>

> qiankun 和 single-spa **不是竞品，是分层**：`registerMicroApps` 底层就是 single-spa 的 `registerApplication`。懂 single-spa 生命周期，就懂了 qiankun 路由那一半。

</v-click>

<!--
一句话记牢：qiankun = single-spa + HTML entry + JS 沙箱 + 样式隔离。学 qiankun 前理解 single-spa 的生命周期与路由编排是地基。
-->

---

# 最小接入·主应用两步

主应用只做两件事：**注册**子应用清单、**启动**

<v-click>

```js
// 主应用入口（main.js）：注册 + 启动
import { registerMicroApps, start } from "qiankun";

registerMicroApps([
  {
    name: "react-app", // 子应用唯一名
    entry: "//localhost:7100", // HTML entry：子应用 HTML 地址
    container: "#subapp", // 挂载到主应用哪个 DOM 节点
    activeRule: "/react", // 路由命中 /react 时激活此子应用
  },
]);

start(); // 启动：此后路由变化就自动加载/卸载子应用
```

</v-click>

<v-click>

> `activeRule` 命中当前 URL → qiankun `fetch` entry、解析脚本样式、沙箱执行、渲染进 `container`；路由离开自动 `unmount`。

</v-click>

<!--
registerMicroApps 只是登记，start 才拉闸。activeRule 命中就自动加载挂载，离开就自动卸载——这是路由型接入的全部。
-->

---

# 子应用改造·三件事

子应用要被接管，必须做三件事

<v-click>

| 步骤 | 做什么 | 目的 |
| --- | --- | --- |
| ① 导出生命周期 | `bootstrap` / `mount` / `unmount`（返回 Promise） | qiankun 取生命周期的契约 |
| ② 打成 UMD | `libraryTarget: 'umd'` + 唯一 `library` | 否则取不到生命周期导出 |
| ③ 修 publicPath | `__INJECTED_PUBLIC_PATH_BY_QIANKUN__` | 嵌入后动态 chunk 不 404 |

</v-click>

<v-click>

```js
// 子应用入口：导出三个生命周期（框架无关契约）
export async function bootstrap() {} // 首次初始化一次
export async function mount(props) {
  // 每次进入：渲染进 props.container
  render(props);
}
export async function unmount(props) {} // 每次离开：销毁、清副作用
```

</v-click>

<!--
三件事里，导出生命周期是契约、UMD 是打包格式约束、publicPath 是资源基准修正。子应用靠 window.__POWERED_BY_QIANKUN__ 判断自己是独立跑还是被嵌入。UMD 与 publicPath 的细节在第四章。
-->

---

# 一次路由切换里发生了什么

qiankun 复用 single-spa 的 reroute，但多了「加载 + 隔离」两步

<v-click>

```text
URL 变化 → 对每个子应用求值 activeRule
        → 命中却没挂载：fetch entry → 解析 HTML 取脚本/样式
                       → JS 沙箱里执行脚本、拿到生命周期
                       → 样式隔离处理 → bootstrap（首次）→ mount 进 container
        → 离开却还挂着：unmount + 清理沙箱记账的副作用与样式
        → 其余不动
```

</v-click>

<v-click>

> 对比 single-spa 的裸链路「load → bootstrap → mount」，qiankun 多做的正是它的价值：**HTML entry 解析 + 沙箱执行 + 样式隔离清理**。

</v-click>

<!--
你只给了个 HTML 地址，qiankun 把 fetch、解析、沙箱执行、样式隔离、挂载卸载全包了。这三步多做的，就是 single-spa 留白处的价值。
-->

---
layout: section
---

# 核心 API

主应用两条主线：路由型自动加载 vs 手动型多实例

---

# 两条主线：路由型 vs 手动型

按「谁决定加载时机」分岔

<v-click>

| 维度 | 路由型 | 手动型 |
| --- | --- | --- |
| 入口 | `registerMicroApps` + `start` | `loadMicroApp` |
| 加载时机 | `activeRule` 命中自动加载 | 你调 API 手动加载 |
| 实例数 | 默认单实例（`singular: true`） | 天生多实例 |
| 生命周期 | qiankun 托管（离开自动卸载） | 自己管（忘 `unmount` 就泄漏） |
| 适用 | 一个主区域按路由切子应用 | 仪表盘同屏嵌多个微应用 |

</v-click>

<v-click>

> 声明式 vs 命令式：**路由型省心但受 `singular` 约束，手动型灵活但要自己收尾**。

</v-click>

<!--
两条主线是理解 qiankun API 的骨架。registerMicroApps 声明式按路由自动加载，loadMicroApp 命令式你说了算。下面逐个拆。
-->

---

# registerMicroApps：路由型注册

登记子应用清单 + 全局生命周期钩子

<v-click>

```js
import { registerMicroApps } from "qiankun";

registerMicroApps(
  [{
    name: "react-app", // 必填：子应用唯一名
    entry: "//localhost:7100", // 必填：HTML 地址或 { scripts, styles }
    container: "#subapp", // 必填：挂载容器
    activeRule: "/react", // 必填：激活规则
    loader: (loading) => {}, // 可选：loading 状态回调
    props: { authToken: "xxx" }, // 可选：透传给子应用的数据
  }],
  { beforeLoad, beforeMount, afterMount, beforeUnmount, afterUnmount } // 全局钩子
);
```

</v-click>

<v-click>

> `activeRule` 三种写法：前缀串 `/react`、函数 `(location) => boolean`（配合 hash 路由）、数组（命中其一即激活）。

</v-click>

<!--
registerMicroApps 底层就是 single-spa 的 registerApplication，只是把加载函数换成 HTML entry + 沙箱执行。第二参 lifeCycles 对所有子应用统一生效。
-->

---

# 全局 lifeCycles：五个钩子

`registerMicroApps` 第二参，对**所有**子应用统一生效

<v-click>

| 钩子 | 触发时机 |
| --- | --- |
| `beforeLoad` | 子应用**加载前** |
| `beforeMount` | 挂载前 |
| `afterMount` | 挂载后 |
| `beforeUnmount` | 卸载前 |
| `afterUnmount` | 卸载后 |

</v-click>

<v-click>

- 每个钩子可传**单函数或函数数组**（数组按序执行）
- 与 app 内钩子不同：全局钩子对所有子应用生效，适合统一**埋点 / loading / 鉴权拦截**

</v-click>

<!--
全局 lifeCycles 是做统一横切逻辑的地方：所有子应用共用一套加载埋点、loading 控制、登录校验。app 内的 loader/props 才是单应用粒度。
-->

---

# start：全局启动配置

三个开关 `prefetch` / `sandbox` / `singular` 决定全局行为

<v-click>

| 配置项 | 默认 | 说明 |
| --- | --- | --- |
| `prefetch` | `true` | 预取子应用资源（四形态见第六章） |
| `sandbox` | `true` | JS 沙箱 + 默认样式隔离；对象形态选方案 |
| `singular` | `true` | 单实例：同一时刻只挂一个子应用 |
| `fetch` | `window.fetch` | 自定义 HTTP，跨域带 cookie 靠它加凭证 |
| `getPublicPath` / `getTemplate` 等 | — | publicPath 推断 / 模板改写 / 资源放行 |

</v-click>

<v-click>

```js
start({ prefetch: true, sandbox: true, singular: true });
```

</v-click>

<!--
start 拉闸，之前 registerMicroApps 只是登记。三个开关是重点：prefetch 管预取、sandbox 管隔离、singular 管单/多实例。fetch 用来给跨域 entry 带 cookie。
-->

---

# loadMicroApp：手动加载（多实例）

命令式：什么时候加载、加载到哪、什么时候卸载全由你

<v-click>

```js
import { loadMicroApp } from "qiankun";

const microApp = loadMicroApp({
  name: "chart-widget",
  entry: "//localhost:7200",
  container: "#widget-a",
  props: { data: [1, 2, 3] },
});

await microApp.mountPromise; // 可 await 各阶段 Promise
microApp.update({ data: [4, 5, 6] }); // 推新 props（需导出 update）
microApp.unmount(); // 用完必须手动卸载，否则泄漏
```

</v-click>

<v-click>

> 返回 `MicroApp` 句柄：`mount` / `unmount` / `update` / `getStatus()` + `loadPromise` / `bootstrapPromise` / `mountPromise` / `unmountPromise`。

</v-click>

<!--
loadMicroApp 不绑路由、返回实例句柄，天生支持多实例——同一子应用可 loadMicroApp 多次得多个独立实例。代价是生命周期自管，忘了 unmount 就内存泄漏。
-->

---

# singular：单实例 vs 多实例

qiankun 最容易混的语义，务必分清两条线

<v-click>

- **路由型默认 `singular: true`** → 同一时刻**只挂一个**子应用：切新的前先卸旧的（走单实例 `legacyProxySandbox`）
- **要同屏并存多个** → 显式 `start({ singular: false })`：走多实例 `proxySandbox`，每子应用一个独立 `fakeWindow`
- **`loadMicroApp` 天生多实例** → 不受 `singular` 约束，同一子应用可加载多次

</v-click>

<v-click>

```js
// 多实例：同一子应用加载两次，两个独立实例并存
const appA = loadMicroApp({ name: "chart", entry: "//host", container: "#a" });
const appB = loadMicroApp({ name: "chart", entry: "//host", container: "#b" });
// appA、appB 各自一个沙箱，互不干扰；用完各自 unmount
```

</v-click>

<!--
记牢这条因果：没开 singular: false 就别指望两个子应用同时正常并存。沙箱如何随 singular 自动切换是下一章的内容。
-->

---

# 辅助 API：默认应用、首挂、错误兜底

启动与首屏时机的三个小工具

<v-click>

```js
import {
  setDefaultMountApp,
  runAfterFirstMounted,
  addGlobalUncaughtErrorHandler,
} from "qiankun";

// 首次进站默认挂载哪个子应用（根路径重定向到首页）
setDefaultMountApp("/home");

// 第一个子应用挂载完成后执行一次：常用来收 loading、上报首屏
runAfterFirstMounted(() => hideGlobalLoading());

// 全局未捕获错误兜底：子应用加载失败 / 生命周期抛错
addGlobalUncaughtErrorHandler((event) => console.error("qiankun error", event));
```

</v-click>

<!--
这三个是启动/首挂/兜底的辅助 API。setDefaultMountApp 做进站默认路由，runAfterFirstMounted 收全局 loading，addGlobalUncaughtErrorHandler 统一兜底加载与运行错误。通信 initGlobalState 与手动预取 prefetchApps 放在第六章细讲。
-->

---
layout: section
---

# 沙箱实现

三沙箱自动选择、Proxy 代理 window、拦得住什么拦不住什么

---

# qiankun 的三个沙箱

对应通论的前两代：快照 + Proxy

<v-click>

| 沙箱 | 隔离方式 | 实例数 | 用在何时 |
| --- | --- | --- | --- |
| **`snapshotSandbox`** | 激活拍 window 快照，失活 diff 恢复 | 单实例 | 不支持 `Proxy` 的旧环境（IE）降级 |
| **`legacyProxySandbox`** | Proxy 记差异，写仍落真 window、卸载恢复 | 单实例 | 支持 Proxy 且 `singular: true`（默认） |
| **`proxySandbox`** | 每应用一个 `fakeWindow`，写落假读先假后真 | **多实例** | 支持 Proxy 且 `singular: false` |

</v-click>

<v-click>

> 分工：`snapshotSandbox` 兜底老浏览器、`legacyProxySandbox` 单实例主力、`proxySandbox` 多实例主力（真正每应用一 fakeWindow）。

</v-click>

<!--
qiankun 2.x 内置这三个沙箱。你不用手选——它按「浏览器能力 + singular」自动决定。三者的原理细节属于核心机制通论，这里重点是分工。
-->

---

# 自动选择逻辑

按「浏览器能力 + singular 配置」自动决定，无需手选

<v-click>

```text
window.Proxy 不支持（老 IE）？
  └─ 是 → snapshotSandbox（并强制 singular: true，快照只能单实例）
  └─ 否 → singular 为 true（路由型默认）？
            ├─ 是 → legacyProxySandbox（单实例 Proxy）
            └─ 否 → proxySandbox（多实例 Proxy，每应用一 fakeWindow）
```

</v-click>

<v-click>

- **老浏览器无 Proxy** → 快照沙箱 + 强制单实例
- **默认路由型** → `singular: true` → `legacyProxySandbox`
- **要同屏多子应用** → 必须 `start({ singular: false })` → `proxySandbox`

</v-click>

<!--
这张决策树是「快照只能单实例」在 qiankun 里的落地。想清楚因果：没开 singular: false 就别指望两个子应用同时正常并存。
-->

---

# window 代理内核与高频坑

FAQ 原文：**「用 `Proxy` 去代理父页面的 `window`」**

<v-click>

- 子应用访问 `window.Vue`，实际访问的是**被 qiankun 代理过的 window**
- Proxy 先查代理对象：**读先假后真、写落假对象**（`proxySandbox`）或写真 window 并记差异（`legacyProxySandbox`）

</v-click>

<v-click>

```js
// ❌ 坑：直接赋值 window.onXxx —— 被代理拦不住这种赋值语义，不生效
window.onresize = () => recalcLayout();

// ✅ 正解：用 addEventListener —— qiankun 劫持并记账，卸载时自动清理
window.addEventListener("resize", () => recalcLayout());
```

</v-click>

<!--
这是 FAQ 明列的高频坑：直接给 window 加 onXxx 事件处理器无效，改用 addEventListener 即可。深层是 onXxx 属性赋值（落假对象、真 window 没挂上）与 addEventListener 方法调用（被框架专门劫持记账）在代理层的处理不同。
-->

---

# 拦得住什么：接管 + 卸载清理

qiankun 明确劫持并接管这批 API

<v-click>

| 类别 | qiankun 怎么处理 |
| --- | --- |
| **全局变量读写** | Proxy 代理 window：`proxySandbox` 写落 fakeWindow 卸载丢弃；`legacy` 写真 window 卸载恢复 |
| **window 事件** | 劫持 `addEventListener` / `removeEventListener`，记账，**卸载统一移除** |
| **定时器** | 劫持 `setTimeout` / `setInterval`，记账，**卸载统一 clear** |
| **动态样式/脚本** | 劫持 `appendChild` / `insertBefore`，记账运行期插入的 `<style>` / `<script>`，**卸载移除** |

</v-click>

<v-click>

> 一句话：全局变量、事件监听、定时器、动态插入的样式脚本——qiankun 都**记账**，子应用卸载时**统一清场**。

</v-click>

<!--
这四类是 qiankun 重点接管的：劫持后记账归属，子应用卸载时统一清理。残留监听不再对空容器报错，轮询不再活到天荒地老。
-->

---

# 拦不住什么 + sandbox 开关

软隔离的逃逸面：防意外不防恶意

<v-click>

- **`window.top` / `window.parent`**：指向真实顶层窗口，不经代理
- **原生构造函数与原型**：`Object` / `Array` / `Element.prototype` 共享，改原型全局生效
- **闭包缓存的引用**：库加载时把原生对象存进闭包，之后不走 window 访问
- **未被专门处理的 API**：边角 API 可能透传

</v-click>

<v-click>

```js
start({ sandbox: true }); // 默认：JS 沙箱 + 默认样式隔离
start({ sandbox: false }); // 完全关闭：子应用裸跑真 window
start({ sandbox: { strictStyleIsolation: true } }); // + Shadow DOM
start({ sandbox: { experimentalStyleIsolation: true } }); // + 运行时属性改写
```

</v-click>

<!--
四类逃逸面要心里有数：qiankun 是尽力而为的软隔离，防自家子应用间的意外冲突，不防恶意代码，物理隔离是 iframe（wujie）的领域。sandbox 开关：true 默认开，false 完全关，对象形态里的两个 StyleIsolation 管的是样式，与 JS 沙箱是两件事。
-->

---
layout: section
---

# 样式隔离

一个默认 + 两个开关 + 主应用自治

---

# 默认行为：微应用「之间」自动清场

只要开沙箱（`sandbox: true`，默认），就已在做样式隔离

<v-click>

- 默认走**动态样式表劫持**：劫持子应用运行期插入的 `<style>` / `<link>`，记账归属，**卸载时移除**
- FAQ 原话：「自动隔离微应用**之间**的样式」——注意那个量词「之间」

</v-click>

<v-click>

| 边界 | 说明 |
| --- | --- |
| **管得着** | 子应用 A 卸载后不污染子应用 B；A 的样式随 A 走 |
| **管不着** | **主应用 ↔ 子应用**的冲突——主应用样式不经沙箱、无从记账 |

</v-click>

<v-click>

> 下面两个开关，是在这个默认行为之上**加强**「子应用不泄漏」的力度。

</v-click>

<!--
常见误解是「要额外配置才有样式隔离」。其实开了沙箱就默认做动态样式表劫持，管的是微应用之间。主应用的冲突要靠第六节的主应用自治。
-->

---

# strictStyleIsolation：Shadow DOM 与弹窗死穴

`sandbox: { strictStyleIsolation: true }` → Shadow DOM 包裹子应用容器

<v-click>

```js
// 严格样式隔离：浏览器唯一的原生双向隔离（样式进不来出不去）
start({ sandbox: { strictStyleIsolation: true } });
```

**死穴——弹窗逃逸**：

1. 子应用与其样式被关进 shadow tree
2. antd/element 的 Dialog/Select/Tooltip 默认 `appendChild` 到 `document.body`
3. 弹窗节点**物理离开 shadow tree** → 树内样式出不去 → 弹窗**样式全丢裸奔**

</v-click>

<v-click>

> 只要子应用用了「弹窗挂 body」的组件库，`strictStyleIsolation` 就基本不可用；继承属性与 CSS 变量仍会穿透。

</v-click>

<!--
Shadow DOM 是浏览器唯一原生的双向隔离，但弹窗逃逸是它在真实业务里几乎必踩的死穴——这不是 bug，是双向隔离的逻辑必然。评估前先数子应用有多少「挂 body」的组件。
-->

---

# experimentalStyleIsolation：属性改写与 at-rule 限制

不建边界，而是**运行时改写选择器**（等效 Vue scoped 运行时版）

<v-click>

```css
/* 子应用源码 */
.app-main { font-size: 14px; }

/* 运行时被改写为：只在带该 data 属性的容器内生效 */
div[data-qiankun-react16] .app-main { font-size: 14px; }
```

</v-click>

<v-click>

- **单向隔离**：防子应用泄漏出去，但主应用样式仍能进来
- **硬限制**：`@keyframes`、`@font-face`、`@import`、`@page` **不被改写**——它们定义的是**全局命名空间的名字**，无处安放属性限定
- 后果：动画名/字体名**重名照样互踩**，仍要靠命名约定加前缀兜底

</v-click>

<!--
属性改写的操作对象是元素选择器，而这几个 at-rule 定义的是全局命名空间里的名字，语法上无处安放属性限定。所以用了 experimentalStyleIsolation，动画名字体名仍要靠命名约定兜底。它是实验状态，适合作增量防线而非唯一防线。
-->

---

# 两开关对比

Shadow DOM vs 属性改写，各堵一个方向

<v-click>

| 维度 | `strictStyleIsolation` | `experimentalStyleIsolation` |
| --- | --- | --- |
| 机制 | Shadow DOM 包裹容器 | 运行时属性改写 |
| 隔离方向 | 双向（进不来出不去） | 单向（防泄漏，不防入侵） |
| 弹窗（挂 body） | **死穴：样式全丢裸奔** | 失效：改写后选择器选不中 |
| `@keyframes`/`@font-face` | 树内自洽（重名仍需前缀） | **不支持改写 → 重名互踩** |
| 主应用样式 | 进不来（连主题走变量） | 能进来 |
| 稳定度 / 适用 | 稳定但组件库弹窗致其难用 | 实验性，多数场景折中主力 |

</v-click>

<v-click>

> 实践里 `experimentalStyleIsolation` 是更常被采用的折中（`strict` 被弹窗劝退）——两者都不完美，这正是 3.0 要重做样式隔离的原因。

</v-click>

<!--
两开关都救不了弹窗：Shadow DOM 让弹窗丢样式，属性改写让改写后的选择器选不中挂 body 的弹窗。experimentalStyleIsolation 是折中主力，但不完美。
-->

---

# 主应用样式自治：antd prefixCls

两个开关只管「子应用不泄漏」，**主应用样式谁来管？**

<v-click>

主应用样式**不经沙箱**、qiankun 隔离不到——只能**自己自治**，给组件库改前缀：

```js
// 主应用 webpack：把 antd 的 CSS 前缀从 ant- 改成自己的（less 变量）
{
  loader: "less-loader",
  options: {
    modifyVars: { "@ant-prefix": "yourPrefix" }, // .ant-btn → .yourPrefix-btn
    javascriptEnabled: true,
  },
}
```

```jsx
// 配合运行时：让 antd 组件生成的类名也换前缀
<ConfigProvider prefixCls="yourPrefix"><App /></ConfigProvider>
```

</v-click>

<!--
主应用的 .yourPrefix-* 与子应用的 .ant-* 天然不撞车。一句话概括 qiankun 样式隔离全景：子应用之间交给沙箱默认劫持 + 两开关，主应用交给它自己改前缀自治。
-->

---

# 2026 新方向：@scope 运行时方案

Shadow DOM 因弹窗被大量弃用，3.0 明确转向

<v-click>

- **弃 Shadow DOM**，以 `experimentalStyleIsolation` / 原生 CSS **`@scope`** 为标准的运行时方案（与 scoped-css 项目合作）
- `@scope (.container) { ... }` 把样式作用域限定在 DOM 子树内，比字符串改写更接近浏览器原生能力

</v-click>

<v-click>

> **现状要写准**：这是 **3.0 的规划方向**；2.x 生产线仍是「两开关 + 默认劫持」。3.0 长期 rc、未 stable——对 2.x 用户是「关注，不排期」。

</v-click>

<v-click>

> 落地组合拳：**命名约定打底**（CSS Modules / 团队前缀）**+ qiankun 运行时兜底 + 主应用改前缀**，三层各堵一个方向。

</v-click>

<!--
@scope 是原生 CSS at-rule，比运行时字符串改写更接近浏览器能力。但这属于 3.0 规划，2.x 仍靠三层组合拳落地。做选型别押未发布版本的排期。
-->

---
layout: section
---

# HTML entry 与接入约束

子应用像 iframe 一样被引入，代价是一串接入约束

---

# HTML entry：像 iframe 一样被引入

`entry` 只填子应用的 **HTML 地址**，不用手写 import maps

<v-click>

```js
registerMicroApps([{
  name: "vue-app",
  entry: "//localhost:7101/", // HTML entry：末尾 / 不能省
  container: "#subapp",
  activeRule: "/vue",
}]);
```

qiankun 拿到地址后：`fetch` HTML → import-html-entry 解析 `<script>` / `<link>` → 沙箱执行 → 取生命周期 → 样式隔离 → 挂载。也可给**显式清单**跳过 HTML 解析：

```js
entry: { scripts: ["//host/main.js"], styles: ["//host/main.css"] }
```

</v-click>

<v-click>

> **entry script 标记**：一个 HTML 多个 `<script>`，qiankun 以标了 `entry` 属性的、或最后一个 `<script>` 为入口，取其 UMD 导出的生命周期。

</v-click>

<!--
HTML entry 是 qiankun 相比 single-spa 最省事的一点。子应用像 iframe 一样被引入，但不是真 iframe——共享 DOM、可被沙箱记账。
-->

---

# UMD 打包：取生命周期的硬约束

qiankun 从子应用**入口脚本的导出对象**上取生命周期

<v-click>

```js
// 子应用 webpack（webpack 5）：output 段
const packageName = require("./package.json").name;
module.exports = {
  output: {
    library: `${packageName}-[name]`, // 库名：约定唯一，定位导出
    libraryTarget: "umd", // 硬约束：必须 UMD（不能 CommonJS/AMD）
    chunkLoadingGlobal: `webpackJsonp_${packageName}`, // webpack4 用 jsonpFunction
    globalObject: "window", // UMD 挂到 window
  },
};
```

</v-click>

<v-click>

- **两个「唯一」**：`library`（多子应用不撞）、`chunkLoadingGlobal`（否则异步 chunk 加载互相覆盖）
- 打成 CommonJS/AMD → 报 **“You need to export the functional lifecycles”**

</v-click>

<!--
两个「唯一」要盯紧：library 唯一避免 UMD 挂 window 键冲突；chunkLoadingGlobal 唯一避免多子应用异步 chunk 用默认名互相覆盖。package.json 的 name 也必须唯一。
-->

---

# publicPath 修正

嵌入后动态 chunk 基准地址变了，qiankun 挂载前注入变量修正

<v-click>

```js
// public-path.js：import 到子应用入口最顶部（早于任何其他 import）
if (window.__POWERED_BY_QIANKUN__) {
  // 被嵌入：用注入的动态 publicPath 修正资源基准
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

```js
import "./public-path"; // 子应用入口第一行：必须最先执行
```

</v-click>

<v-click>

- `__webpack_public_path__`：webpack 运行时改 publicPath 的魔法变量
- `window.__POWERED_BY_QIANKUN__`：独立/嵌入判别标记——据此决定修不修 publicPath、路由 `base`、是否自渲染

</v-click>

<!--
子应用独立运行时动态 chunk 从自己域名取，嵌入后相对 publicPath 会指错到主应用域名下导致 404。另一种省事做法是构建时写死绝对 publicPath，适合部署地址固定的场景。
-->

---

# CORS：跨域 entry 的硬要求

qiankun 用 `fetch` 拉 HTML 与静态资源 → 跨域资源必须开 CORS

<v-click>

- **子应用侧**：静态资源服务器返回 `Access-Control-Allow-Origin`（devServer 加 `headers`）
- **带 cookie 的 entry**：默认 `fetch` 不带凭证，需自定义 `fetch` 加凭证

```js
// 主应用：给需要 cookie 的 entry 定制 fetch
start({
  fetch(url, ...args) {
    if (url === "http://app.example.com/entry.html") {
      return window.fetch(url, { ...args, mode: "cors", credentials: "include" });
    }
    return window.fetch(url, ...args);
  },
});
```

</v-click>

<v-click>

> 生产规避 CORS 的常见手段：**nginx 反向代理**把子应用代理到主应用同源路径，`entry` 填相对路径。

</v-click>

<!--
CORS 是 qiankun 区别于 iframe 的关键——能拿到内容才能沙箱执行，但也带来跨域必须开 CORS 的硬要求。带 cookie 靠自定义 fetch，生产靠 nginx 同源代理。
-->

---

# 常见接入报错排查

八成落在 UMD / CORS / publicPath 三处

<v-click>

| 报错 / 现象 | 多半原因 | 处理 |
| --- | --- | --- |
| `export ... lifecycles` | 没打 UMD / 没具名导出 | 改 UMD + 具名导出 |
| `died in LOADING_SOURCE_CODE` | entry 404 / CORS / 格式错 | 查 fetch、CORS 头、末尾 `/` |
| 静态资源 404 / 白屏 | publicPath 没修 | 加 `public-path.js` 且最先 import |
| 多子应用随机失败 | `library`/`chunk` 名未唯一 | 用包名派生唯一名 |
| 路由自激活死循环 | `activeRule` 等于真实路径 | 与真实访问路径错开 |
| 弹窗无样式 | 开了 `strictStyleIsolation` | 换 `experimental` 或改挂载点 |

</v-click>

<!--
这张排查表覆盖六类高频报错。记住三大高发区：UMD 打包格式、CORS 跨域、publicPath 修正。activeRule 不能等于子应用真实访问路径，否则自激活死循环。
-->

---
layout: section
---

# Vite 与 ESM 之痛

qiankun 最大的痛点：架构级不兼容 Vite

---

# 痛点定性：Vite 子应用接不进 2.x

国内最常被吐槽的一句：「**接不了 Vite**」

<v-click>

- **不是配置没调对，而是架构层面不兼容**：qiankun 2.x **不支持 ESM 入口**，而 Vite 产物以 ESM 为中心
- 表现：把 Vite 子应用的 `entry` 填给 qiankun——轻则生命周期取不到（`export lifecycles` 报错），重则脚本根本执行不了

</v-click>

<v-click>

> 要理解为什么，得看 qiankun 2.x 是**怎么执行子应用脚本**的——根子在 import-html-entry 的加载模型。

</v-click>

<!--
Vite 之痛是 qiankun 在国内最大的争议点。这不是能靠改配置解决的问题，是加载模型与 ESM 世界观的架构级冲突。下一页拆根因。
-->

---

# 根因：import-html-entry 的「fetch + eval」

qiankun 2.x 加载子应用脚本的模型

<v-click>

```text
1. fetch 回子应用 HTML
2. 用正则解析出 <script> 标签
3. 把脚本内容 fetch 回来 → 得到一段 JS 字符串
4. 用 eval / new Function 同步执行（外包沙箱的 with(proxyWindow){}）
```

</v-click>

<v-click>

对 UMD/IIFE 天然合适，但 ESM 三点对不上：

| ESM 特性 | 与 fetch+eval 的冲突 |
| --- | --- |
| **专属语法** `import`/`export` | 只能在模块上下文解析，`eval` 当普通脚本执行直接语法错 |
| **异步、浏览器原生加载** | import-html-entry 要的是「fetch 回字符串同步 eval」 |
| **强制严格模式** | 与沙箱 `with(proxyWindow)` 互斥（`with` 在严格模式是语法错） |

</v-click>

<!--
这套 fetch+eval 模型对 IIFE/UMD 就是「一段能被 eval 的自执行字符串」，天然合适。但 ESM 有专属语法、异步原生加载、强制严格模式——三点都和 eval 模型对不上，尤其严格模式和 with 沙箱互斥。
-->

---

# 社区方案：vite-plugin-qiankun 原理

第三方（非官方）：把 Vite 子应用「伪装」成 qiankun 认得的样子

<v-click>

- **注入判别标记**：模拟 `__POWERED_BY_QIANKUN__` 等 qiankun 注入的全局变量
- **改写生命周期导出**：把 `bootstrap` / `mount` / `unmount` 挂到 `window`（而非 UMD 导出）
- **开发态特殊处理**：Vite dev 用原生 `type=module`，让 qiankun **绕过沙箱执行**

</v-click>

<v-click>

```ts
// 子应用 vite.config.ts：挂插件，名字对齐主应用注册的 name
import qiankun from "vite-plugin-qiankun";
export default defineConfig({
  base: "//localhost:7101/",
  plugins: [vue(), qiankun("vue-app", { useDevMode: true })], // 开发态走原生 ESM 直载
});
```

</v-click>

<!--
vite-plugin-qiankun 的思路是伪装：注入 qiankun 全局标记、生命周期挂 window、开发态绕沙箱直接用浏览器原生 ESM。入口不再是标准的 export，而是插件的 renderWithQiankun 包裹——这套插件约定就是它的侵入所在。
-->

---

# vite-plugin-qiankun 的局限

「跑起来」不等于「隔离住」

<v-click>

| 局限 | 说明 |
| --- | --- |
| **沙箱基本失效** | Vite 子应用走原生 ESM、绕过 with/eval 沙箱，JS 全局隔离几乎裸奔、样式隔离大打折扣 |
| **需按插件约定改入口** | 入口要按 `renderWithQiankun` 等 API 改写，有侵入 |
| **生产 build 额外配置** | dev（原生 ESM）与 build（Rollup 产物）行为不一致，生产常有坑 |
| **非官方、更新滞后** | 跟随 qiankun 版本，官方一动可能失配，出问题得自己啃 |

</v-click>

<v-click>

> 更像「**存量项目非塞 Vite 不可时的权宜之计**」，不是「Vite + 微前端」的推荐姿势。若隔离对你重要，「沙箱失效」是硬伤。

</v-click>

<!--
局限的核心是沙箱失效——跑起来不等于隔离住。它是权宜之计，不是推荐姿势。隔离重要就别用它。
-->

---

# 何时换路线

先看**子应用构建工具**与对隔离的要求

<v-click>

| 你的情况 | 建议 |
| --- | --- |
| 子应用全是 **webpack**，要开箱即用 | **qiankun**（正对口，别折腾） |
| **Vite 主力**，且要**真沙箱** | 换 **wujie**（iframe 沙箱）/ **micro-app**（支持 module） |
| 个别 Vite、隔离要求不高、存量已是 qiankun | 可用 `vite-plugin-qiankun` 兜，接受沙箱失效 |
| 要原生 ESM + 极致控制、肯自建 | **single-spa + import maps** |

</v-click>

<v-click>

> **3.0 的解法**：新 loader（`@qiankunjs/loader`）用 **DOMParser 替代正则 + streaming**，原生吃 `type=module` / ESM / Vite——但至今仍 rc、未 stable，**别赌排期**。

</v-click>

<!--
核心判据：qiankun 2.x 与 Vite 是架构级不兼容，硬接的代价是丢隔离。wujie 的 iframe 沙箱天生把 ESM 交浏览器原生执行、隔离更强，是「Vite + 微前端 + 要隔离」的顺路选择。3.0 新 loader 规划原生吃 ESM，但别赌排期。
-->

---
layout: section
---

# 演进与现状

prefetch、通信、2.10.16 稳定线、3.0 三年难产与选型

---

# prefetch：四种预取形态

浏览器空闲时提前下载未挂载子应用的资源，秒开

<v-click>

| 取值 | 行为 | 适用 |
| --- | --- | --- |
| **`true`**（默认） | 首个子应用挂载后，空闲时预取其余 | 通用默认 |
| **`'all'`** | `start` 后立即预取全部 | 子应用少、常配 `loadMicroApp` |
| **`string[]`** | 只预取指定 name | 明确知道哪几个高频 |
| **函数** | `(apps) => ({ criticalAppNames, minorAppsName })` | 复杂场景按业务分级 |

</v-click>

<v-click>

```js
start({ prefetch: "all" }); // 立即全预取
start({ prefetch: ["react-app", "vue-app"] }); // 指定预取
prefetchApps([{ name: "chart", entry: "//host" }]); // 脱离 start 手动预取
```

</v-click>

<!--
prefetch 是性能优化：空闲时提前下资源，真要挂载时秒开。四形态覆盖从通用默认到自定义分级。也可用 prefetchApps 脱离 start 手动触发。
-->

---

# 通信：initGlobalState 全局状态

qiankun 内置的应用间通信 = 全局状态方案

<v-click>

```js
// 主应用：初始化全局状态
const actions = initGlobalState({ user: null, theme: "light" });
actions.onGlobalStateChange((state, prev) => console.log(state, prev)); // 订阅
actions.setGlobalState({ user: { id: 1 } }); // 更新（仅一级属性）

// 子应用：从 props 拿到同一组 actions（qiankun 在 mount 时注入）
export async function mount(props) {
  props.onGlobalStateChange((state) => updateUI(state));
  props.setGlobalState({ theme: "dark" }); // 子应用也能改
}
```

</v-click>

<v-click>

- 三方法：`onGlobalStateChange` 订阅 · `setGlobalState` 更新（**仅一级属性**）· `offGlobalStateChange` 取消
- **3.0 计划移除 globalState**（耦合过重）——很多团队本就用 Redux/Pinia + props 或事件总线替代

</v-click>

<!--
initGlobalState 建一个所有应用共享的状态对象，主子应用都能读写。注意只支持一级属性变更，深层嵌套改动不触发通知。3.0 拟移除，实践中常被更成熟的方案替代。
-->

---

# 2.10.16 稳定线与 3.0 三年难产

功能面停在 2.10.16，3.0 二十余个 rc 仍无 stable

<v-click>

| 时间 | 节点 | 状态 |
| --- | --- | --- |
| 2023-11-15 | **2.10.16** | **`latest` 稳定版，事实停更线**（此后仅极小维护） |
| 2021-04 | 3.0 roadmap 发起（#1378） | 规划 |
| 2022-06 | 社区吐槽「一年多只做了个新 logo」 | 停滞 |
| 2024-09 | **3.0.0-rc.0** | 首个 rc（`@qiankunjs/*` 新架构） |
| 2026-02 | **3.0.0-rc.21** | **仍 rc、无 stable**；加 legacy 兼容层 |
| 2026 | @scope 样式隔离 · `create-qiankun` | 复苏迹象 |

</v-click>

<v-click>

> 结论：**生产用 2.10.16**——功能面就是两开关样式隔离、三沙箱、import-html-entry、globalState 那套；3.0 别等。

</v-click>

<!--
2.10.16 是长期稳定线，2.x 之后基本只做极小维护、无新特性。3.0 三年多、二十余个 rc 没有正式版，是微前端圈著名的跳票案例。2026 有 @scope 与 create-qiankun 的复苏迹象但离 stable 尚远。
-->

---

# 3.0 重构要点

三年难产，但方向清晰且有价值

<v-click>

- **模块化拆分**：`@qiankunjs/*` 独立包（`loader` / `sandbox`）**可插拔**，沙箱去 `eval`（TC39 Realms 思路）
- **新 loader 原生吃 ESM**：DOMParser 替代正则 + streaming，支持 `type=module` 与 **Vite / Module Federation**
- **样式隔离转向**：弃 Shadow DOM，转 `experimentalStyleIsolation` / 原生 CSS **`@scope`**
- **安全**：支持 **CSP**（Content Security Policy）
- **兼容层**：rc.21 加 **legacy API**，让 2.x 平滑迁移

</v-click>

<v-click>

> 重构方向正对 2.x 三大硬伤：**Vite 之痛**（新 loader）、**样式隔离不完美**（@scope）、**沙箱依赖 eval**（Realms）。

</v-click>

<!--
3.0 的重构方向是有价值的：可插拔模块、新 loader 原生吃 ESM、样式隔离转 @scope、支持 CSP、legacy 兼容层。它精准对应 2.x 的三大硬伤，但至今未 stable。
-->

---

# 选型定位

qiankun 在 2026 微前端全景里的位置

<v-click>

| 维度 | 结论 |
| --- | --- |
| **地位** | 国内**存量最大、面试必考**；蚂蚁出品、中文资料最全 |
| **甜区** | **存量 webpack** + 要**开箱即用**的沙箱/样式/HTML entry |
| **硬伤** | Vite/ESM 之痛、样式隔离不完美、3.0 长期难产 |
| **Vite 主力** | 优先 **wujie**（iframe 沙箱）/ **micro-app**（低侵入） |
| **极致控制** | **single-spa** + import maps |

</v-click>

<v-click>

> 一句话选型：**qiankun 是「存量 webpack + 要开箱」的稳妥解，不是「新项目 + Vite」的顺路解**——后者先看 wujie/micro-app。

</v-click>

<!--
把 qiankun 放进选型全景：它是存量 webpack 要开箱的稳妥解，甜区明确、硬伤也明确。新项目 Vite 主力应先看 wujie/micro-app，要极致控制看 single-spa。
-->

---
layout: center
class: text-center
---

# 小结

qiankun = single-spa + HTML entry + JS 沙箱 + 样式隔离

<v-click>

- **核心 API**：路由型 `registerMicroApps + start`（默认单实例）、手动型 `loadMicroApp`（多实例自管）
- **沙箱**：三沙箱按「Proxy + singular」自动选；Proxy 代理 window，`onXxx` 赋值失效改 `addEventListener`
- **样式隔离**：一默认（劫持）+ 两开关（Shadow DOM 弹窗逃逸 / 属性改写不支持 @keyframes）+ 主应用改前缀
- **接入约束**：UMD 打包 + publicPath 修正 + CORS + entry 末尾 `/`
- **Vite 之痛**：fetch+eval 不认 ESM，`vite-plugin-qiankun` 丢沙箱，要隔离换 wujie/micro-app
- **现状**：2.10.16 事实稳定线、3.0 三年 rc 未 stable、选型甜区「存量 webpack + 要开箱」

</v-click>

<!--
六条收束全章：核心 API 两条主线、三沙箱、样式隔离一默认两开关、接入四约束、Vite 之痛、版本现状与选型。qiankun 的价值全在 single-spa 的留白处，代价是 Vite 之痛与样式隔离不完美。
-->

---
layout: center
class: text-center
---

# 谢谢

qiankun · single-spa + HTML entry + JS 沙箱 + 样式隔离

<div class="mt-8 text-gray-400">
基于 qiankun 2.10（3.0 rc 追踪） · 面向前端工程师
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/architecture/micro-frontend/qiankun/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
全章覆盖核心 API、沙箱实现、样式隔离、HTML entry 接入约束、Vite/ESM 之痛、演进与现状。配套笔记见文档图标链接。感谢观看。
-->
