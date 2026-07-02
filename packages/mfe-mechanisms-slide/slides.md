---
theme: seriph
background: https://cover.sli.dev
title: 微前端核心机制
info: |
  微前端核心机制 —— JS 沙箱谱系、CSS 隔离四路线、HTML entry 与资源加载、应用间通信五模式、依赖共享三路线、预加载与性能代价
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:apps class="text-8xl" />
</div>

<br/>

## 微前端核心机制

框架无关的四大机制通论：JS 沙箱 · CSS 隔离 · 通信 · 依赖共享，外加一层加载与性能

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
把 qiankun、wujie、micro-app、Module Federation 摆到一起看，它们回答的是同一组问题：JS 怎么互不污染、样式怎么互不覆盖、拆开的应用怎么协作、公共依赖怎么不重复下载、拆分的性能账怎么算。本叶做框架无关的四大机制通论。
-->

---
transition: fade-out
---

# 这一叶讲什么

一条主线：**浏览器没有为「多应用同页」准备边界，四大机制就是补出这些边界**

<v-click>

- **JS 沙箱**：防全局变量污染、事件残留、定时器泄漏——快照 / Proxy / with+Proxy / iframe 四代
- **CSS 隔离**：防样式互踩——Shadow DOM / 属性改写 / 样式表劫持 / 命名约定四路线
- **应用间通信**：props / CustomEvent / 发布订阅 / URL / utility module，跨域 iframe 用 postMessage
- **依赖共享**：import maps / Module Federation shared / 不共享三路线
- **加载与性能**：HTML entry 拿到子应用、prefetch 提前拿、拆分的四笔代价

</v-click>

<v-click>

> **机制先于框架**：选框架本质是在四大机制上各选一条路线——本叶讲机制，框架只作路线代表出场。

</v-click>

<!--
五个主题：隔离两件套（沙箱 + CSS）、协作两件套（通信 + 依赖共享）、外加一层加载与性能。读懂这一叶，后面每个框架叶就只剩「它选了哪条路线」。
-->

---

# 浏览器没有为「多应用同页」准备边界

单页模型天生是「一家人过日子」，多团队同页则处处是公共资源

<v-click>

| 浏览器的假设 | 多应用同页的现实 | 谁来补 |
| --- | --- | --- |
| `window` 全局唯一，谁都能读写 | A 的 `window.config` 被 B 覆盖；卸载后定时器还在跑 | JS 沙箱 |
| CSS 选择器全局生效 | 两个应用都写 `.title`，谁后加载谁说了算 | CSS 隔离 |
| 模块间直接 import | 拆成独立部署后，跨应用传数据没有天然通道 | 通信 |
| 依赖打进自己的 bundle | 五个子应用 = 用户下载五份 React | 依赖共享 |
| 资源在 HTML 里声明、顺序加载 | 子应用 HTML/JS/CSS 要被主应用**运行时**拉取执行 | 加载与预加载 |

</v-click>

<v-click>

> 前两行是**隔离**（互不伤害），中间两行是**协作**（如何配合），最后一行是**加载与性能**（共同的运行时成本）。

</v-click>

<!--
这五行就是本叶的目录。浏览器的单页面模型对「多应用同页」毫无准备，四大机制 + 加载性能逐一补上这些缺失的边界。
-->

---

# 一次子应用挂载，五机制接力

以「用户从主应用点进子应用」为例，串回一条真实时间线

<v-click>

1. **加载**：按路由 fetch 子应用 HTML（HTML entry）或 remoteEntry（MF），解析出脚本/样式清单
2. **JS 沙箱**：构建执行环境（fakeWindow / with 包裹 / iframe），脚本求值，生命周期被接住
3. **CSS 隔离**：样式改写加前缀、或装进 Shadow DOM、或被劫持记账以便卸载清场
4. **通信**：`mount(props)` 把数据与回调递进去（下行就位），挂载后注册事件/订阅（上行就位）
5. **依赖共享**：代码里的 `import "react"` 被解析——走 import map、MF share scope、或自带副本

</v-click>

<v-click>

> 卸载反向执行：卸载 → 沙箱恢复/丢弃 → 样式摘除 → 订阅解绑。**任何一步偷工都对应一类线上事故**——沙箱不清是全局污染、样式不摘是残留污染、订阅不解绑是内存泄漏。

</v-click>

<!--
五机制不是并列的清单，而是一条接力链。这条时间线是理解后面每一章的骨架：加载→沙箱→样式→通信→共享，卸载时反向。
-->

---

# 先纠正这些说法

微前端机制里最常见的几处「想当然」，每条都对应后面某章的关键结论

<v-click>

| 常见说法 | 校准 |
| --- | --- |
| 开了 JS 沙箱就万事大吉 | 沙箱是**软隔离**，防意外不防恶意；样式是另一条战线 |
| Shadow DOM 是完美样式隔离 | 继承属性与 CSS 变量照常穿透；挂 `body` 的弹窗样式全丢 |
| postMessage 加个监听就能用 | 不校验 `event.origin` = 给 XSS 开门；`targetOrigin` 绝不写 `*` |
| import maps 还要等浏览器支持 | **Baseline Widely available（2023-03 起）**；SystemJS 已退居历史层 |
| MF shared 配了就能去重 | 共享是**双端协议**：一端没声明就没共享；子路径要尾斜杠前缀匹配 |
| 微前端一定比单体慢 | Fowler：独立编译天然按页 code-split，单页可能反而更快 |
| qiankun 不支持 Vite 是没适配 | **结构性不支持**：HTML entry 的 eval 执行模型装不下 ESM |

</v-click>

<!--
七处高频误解，带着这些「反常识」往下看，会更有针对性。沙箱是软隔离、Shadow DOM 有穿透、postMessage 要校验、import maps 已成熟、MF shared 是双端协议、性能靠实测、qiankun 的 Vite 之痛是结构性的。
-->

---
layout: section
---

# JS 沙箱谱系

隔离的第一半：子应用的 JS 在哪个 window 上跑

---

# 为什么需要 JS 沙箱

`window` 成了没有门禁的公共黑板，三类典型事故

<v-click>

```js
// 事故一：全局变量互踩 —— A 写的配置被 B 覆盖
window.__APP_CONFIG__ = { theme: "dark" };  // 子应用 A
window.__APP_CONFIG__ = { theme: "light" }; // B 加载后，A 的行为悄悄变了

// 事故二：事件监听残留 —— A 卸载了，监听器还在替它上班
window.addEventListener("resize", recalcLayoutOfAppA); // DOM 已移除仍触发报错

// 事故三：定时器泄漏 —— 轮询跟着页面活到天荒地老
setInterval(() => fetchDashboardData(), 5000); // 卸载时无人 clearInterval
```

</v-click>

<v-click>

> 根因是**卸载 DOM ≠ 清理副作用**。沙箱给每个子应用一个「看起来是全局、实际被记账」的执行环境：**事后恢复**（快照）、**写时隔离**（Proxy/with）、或**物理分家**（iframe）。

</v-click>

<!--
框架组件生命周期只管自己创建的东西；子应用往 window、document、定时器队列写的一切都在框架视野之外。沙箱三条技术路线对应三种「记账」方式。这里防的是意外冲突不是恶意代码。
-->

---

# 快照沙箱：diff window 的事后恢复

第一代最朴素——换应用时把 `window` 恢复原样

<v-click>

```js
class SnapshotSandbox {
  windowSnapshot = {}; // 激活时的 window 快照
  modifyPropsMap = {}; // 本应用对 window 的改动记录

  active() {                              // 激活：拍快照 + 回放上次改动
    for (const p in window) this.windowSnapshot[p] = window[p]; // 全量遍历
    Object.keys(this.modifyPropsMap).forEach((p) => (window[p] = this.modifyPropsMap[p]));
  }
  inactive() {                            // 失活：diff 出改动、把 window 还原
    for (const p in window)
      if (window[p] !== this.windowSnapshot[p]) {
        this.modifyPropsMap[p] = window[p]; // 记下「我改了什么」
        window[p] = this.windowSnapshot[p]; // 还世界一个干净 window
      }
  }
}
```

</v-click>

<v-click>

> 两个结构性缺陷：**只能单实例**（共用真 window，双活时 diff 无法归因）；**切换成本随 window 膨胀**（每次全量 `for...in`）。qiankun 在无 Proxy 的 IE 降级到此并强制 `singular: true`。

</v-click>

<!--
运行期大家写的是同一个真 window，A、B 同时活跃时失活 diff 分不清谁改了谁，恢复快照会抹掉还活着的应用状态——所以快照沙箱同一时刻只能有一个子应用。它的历史价值是不依赖任何 ES6+ 能力。
-->

---

# Proxy 沙箱：fakeWindow 的写时隔离

思路从事后恢复升级为写时隔离——qiankun `proxySandbox` 是代表

<v-click>

```js
class ProxySandbox {
  constructor() {
    const fakeWindow = {}; // 本应用的「私有 window」
    this.proxy = new Proxy(fakeWindow, {
      set: (t, p, v) => { if (this.running) t[p] = v; return true; }, // 写落假对象
      get: (t, p) => (p in t ? t[p] : window[p]), // 读：先假后真
      has: (t, p) => p in t || p in window,
    });
  }
  active() { this.running = true; }
  inactive() { this.running = false; } // 无需恢复：改动本来就没碰真 window
}
```

</v-click>

<v-click>

- **多实例**：每个应用一个 fakeWindow，写操作互不可见（`start({ singular: false })` 靠它）
- **零恢复成本**：卸载即丢弃 fakeWindow，不存在遍历与 diff
- 中间形态 **legacySandbox**：也用 Proxy 但仍写真 window、只记差异——「Proxy 实现的快照沙箱」

</v-click>

<!--
对照快照沙箱，多实例与零恢复成本同时解决。qiankun FAQ 原文：使用 Proxy 去代理父页面的 window 来实现沙箱。legacySandbox 省掉了快照的全量遍历，却保留单实例限制。
-->

---

# Proxy 沙箱的代价与逃逸面

写时隔离不是免费，也不是密不透风

<v-click>

- **透传细节繁琐**：`window.location`/`document`/`addEventListener` 读到的原生对象直接返回会有 `this` 指向问题（Illegal invocation），实现里要逐一 `bind`
- **副作用仍需专项收集**：Proxy 只管属性读写，`addEventListener`/`setInterval` 是**方法调用**——框架要额外劫持、记账、卸载统一清理
- **逃逸面**：`window.top`/`window.parent` 指向真实窗口、原生构造函数、闭包缓存的引用都不经过代理

</v-click>

<v-click>

> **所有非 iframe 沙箱都是尽力而为的软隔离**——防的是意外冲突，不是恶意代码。qiankun FAQ 也因此建议用 `addEventListener` 而非 `window.onXxx` 直接赋值（后者受代理限制可能不生效）。

</v-click>

<!--
自研沙箱最容易踩的坑就是 this 绑定与副作用收集。软隔离的边界要心里有数：故意逃逸永远拦不住，微前端沙箱不是安全沙箱。
-->

---

# with + Proxy：把作用域链第一站换掉

Proxy 拦不住不带 `window.` 前缀的全局访问——micro-app 默认沙箱补上

<v-click>

```js
// 框架把子应用代码包装成这样再执行（机制骨架）
const wrapped = new Function("proxyWindow", `
  with (proxyWindow) {   // 作用域链第一站被换成代理对象
    ${appCode}           // name、location、document…… 全部先问 proxyWindow
  }
`);
wrapped(sandbox.proxy);
```

</v-click>

<v-click>

- **彻底**：一切自由变量查找先经过 Proxy 的 `has`——纯 Proxy 做不到
- **性能税**：`with` 块内每次查找都跑一遍 `has`/`get`，且 `with` 让作用域静态分析失效、无法被引擎优化
- **语义副作用**：顶层 `var`/`function` 不再泄漏为全局 → 老库报 `xxx is not defined`
- **严格模式互斥**：`with` 在严格模式是语法错误，与 ESM（天然严格）互斥

</v-click>

<!--
wujie 文档把「规避 with(proxyWindow){code} 的性能损耗」列为选 iframe 路线的直接理由。三种解法（library.type window、改写 window.xxx=、插件替换）本质都是把隐式全局改成显式全局。
-->

---

# iframe 沙箱：物理隔离路线

前三代都在同一个 JS 环境里模拟边界，第四代交给浏览器原生隔离

<v-click>

- **wujie 的拆法**：子应用 JS 跑在**与主应用同域的 iframe**——`window`/`history`/`location` 原生独立、无查找税；**DOM 不在 iframe 渲染**，而是进主文档的 WebComponent 容器，框架代理 iframe 内 `document` 查询接口指向容器（弹窗也无需特殊改造）
- **micro-app 可选 iframe 模式**：iframe `src` 必须指向主应用域名（为同域通信），初始化时**有几率把主应用静态资源加载一遍**——解法：`iframeSrc` 指向空 HTML，或主应用 `head` 最前插 `if (window.parent !== window) window.stop()`

</v-click>

<v-click>

> 固有成本：每个子应用一个 iframe 实例（内存/初始化）；JS 与 DOM 分属两环境，跨环境对象判定（`event.target` 归属、`instanceof`）靠框架代理层兜底——这正是 wujie「用时无感」背后的代理工程。

</v-click>

<!--
路由同步靠劫持 iframe 的 history.pushState/replaceState 把子应用 URL 写进主应用 query。同域坑残留：network 面板仍会出现 canceled 请求，已发出的 JS 请求撤不回来。
-->

---

# 四代路线对比

隔离越来越彻底、恢复成本越来越低

| 维度 | 快照 | Proxy | with + Proxy | iframe |
| --- | --- | --- | --- | --- |
| 隔离原理 | 事后 diff 恢复 | 写时隔离 fakeWindow | 作用域链 + 写时隔离 | 浏览器原生物理隔离 |
| 多实例 | ✗ 共用真 window | ✓ | ✓ | ✓ 一 iframe 一世界 |
| 隔离强度 | 弱（切换才清理） | 中（隐式全局漏拦） | 较强（自由变量也拦） | 强（history/location 独立） |
| 性能 | 切换全量遍历 ×2 | 过一层 Proxy 陷阱 | 每次查找过 has/get | 无查找税；换 iframe 成本 |
| 兼容性 | 最好（无 ES6） | 需 Proxy | 需 Proxy + 非严格 | 需 WebComponent |
| 代表 | qiankun 降级态 | qiankun proxySandbox | micro-app 默认 | wujie；micro-app 可选 |

<v-click>

> 选型直觉：**单应用切换 + 老浏览器**→快照；**多应用并存**→Proxy；**要拦隐式全局、接受性能税**→with + Proxy；**隔离优先 / Vite・ESM 子应用**→iframe。

</v-click>

<!--
三条推理链：共用真 window ⇒ 必然单实例；with 改作用域链 ⇒ 必然有查找税与严格模式冲突；iframe src 指向主域 ⇒ 必然有误加载窗口期。
-->

---

# 前瞻：ShadowRealm（TC39 Stage 2.7）

把沙箱做成语言标准：独立 globalThis + 全套内建副本

<v-click>

```js
const realm = new ShadowRealm();
realm.evaluate(`globalThis.leaked = 1`); // 污染只发生在 realm 自己的 globalThis
const doSum = await realm.importValue("./calc.js", "doSum"); // 跨界导入一个函数
doSum(1, 2); // 3 —— 函数被自动包装（wrapped function）后可调用
```

</v-click>

<v-click>

- **callable boundary**：跨 realm 边界只允许**原始值与函数**，普通对象一律过不去——「把 `window.appState` 对象直接递给子应用」根本不成立，通信必须走显式函数协议
- 同步执行、无 DOM、共享引擎——比 iframe 轻、比 Worker 即时

</v-click>

<v-click>

> 现状写准：**Stage 2.7，无生产可用的浏览器原生实现**。正确姿势是「关注，不排期」——它只解决 JS 全局隔离，DOM/CSS 仍靠本叶其他机制。

</v-click>

<!--
champions 包括 Agoric/Salesforce 等一线沙箱实践者，规范与宿主集成仍在推进。它解决的是 JS 全局隔离这一半，不碰 DOM 与样式。
-->

---
layout: section
---

# CSS 隔离

隔离的另一半：子应用的样式作用在哪棵树上

---

# 问题面：全局作用域 + 后来者覆盖

CSS 没有模块系统，同名选择器按 specificity + 源顺序决胜

<v-click>

```css
/* 子应用 A */
.title { color: #333; font-size: 20px; }

/* 子应用 B —— 后加载，A 页面上所有 .title 一并变红 */
.title { color: red; font-size: 16px; }
```

</v-click>

<v-click>

- **子应用互踩**：通用类名（`.header`/`.active`/`.modal`）撞车
- **子应用污染主应用**：reset/normalize 或 `body { overflow: hidden }` 改掉整个页面
- **卸载残留**：动态插入的 `<style>`/`<link>` 没人摘，应用卸载了样式还阴魂不散

</v-click>

<v-click>

> CSS 隔离与 JS 沙箱是**两件事**——沙箱再强，一个 `<style>` 插进 head 照样全局生效。四条路线按「隔离由谁执行」分类：浏览器原生 / 框架运行时 / 构建期纪律。

</v-click>

<!--
微前端把 CSS「全局作用域 + 后来者覆盖」的老问题放大成三种事故形态。样式的战场要单独打。
-->

---

# Shadow DOM：原生双向隔离及其穿透边界

唯一浏览器原生的双向隔离——页面样式进不来、树内样式出不去

<v-click>

| 穿透物 | 行为 | 对微前端的意义 |
| --- | --- | --- |
| **继承属性** | `color`/`font-family`/`line-height` 沿 DOM 树继承进 shadow tree | 主应用字体/行高会渗入——可当主题通道 |
| **CSS 自定义属性** | `--brand-color` 穿透，树内 `var()` 可取值 | **官方推荐的主题下发通道** |
| **`dir`/`lang`** | shadow tree 与 `<slot>` 从宿主继承 | 国际化状态天然下传 |

</v-click>

<v-click>

> **`mode: "closed"` 不是安全机制**——只让 `element.shadowRoot` 返回 `null`，MDN 原话「浏览器扩展等仍能绕过」，表达的是「请勿访问」的意图。qiankun `strictStyleIsolation`、wujie/micro-app 容器都借这条边界。

</v-click>

<!--
「隔离」不等于「绝缘」：三类东西会穿过边界，恰恰是微前端最常撞上的。继承属性与 CSS 变量穿透是特性不是 bug，主题就该走这条道。
-->

---

# 为什么 Shadow DOM 救不了弹窗

组件库弹窗为躲 overflow/z-index，默认 appendChild 到 document.body

<v-click>

1. 子应用与其样式被关进 shadow tree
2. 弹窗节点被挂到 `body`——**物理上离开了 shadow tree**
3. 树内样式出不去（双向隔离如实执行），弹窗**一丝样式都拿不到**，裸奔
4. 同时脱离隔离保护，反过来可能被主应用样式误伤

</v-click>

<v-click>

```js
// adoptedStyleSheets：一份样式表对象挂到多棵 shadow tree —— 解析一次、处处生效
const sheet = new CSSStyleSheet();
sheet.replaceSync(`h1 { color: var(--brand-color, #333); }`);
containerA.shadowRoot.adoptedStyleSheets = [sheet];
containerB.shadowRoot.adoptedStyleSheets = [sheet];
```

</v-click>

<v-click>

> 弹窗裸奔不是 bug，是双向隔离的逻辑必然。评估此路线前，先数一数你的组件库有多少「挂 body」的组件。

</v-click>

<!--
adoptedStyleSheets 是「几十个微前端实例共享一套设计系统」的性能正解：浏览器只解析一次、replaceSync 修改全树生效。弹窗补救都不优雅：改挂载点、单独注样式、或放弃 Shadow DOM。
-->

---

# 属性前缀改写：运行时 scoped

不建边界，而是改写选择器——qiankun `experimentalStyleIsolation` 是代表

<v-click>

```css
/* 子应用源码 */
.app-main { font-size: 14px; }

/* 运行时被改写为（qiankun 官方示例格式） */
div[data-qiankun-react16] .app-main { font-size: 14px; }
```

</v-click>

<v-click>

- 效果：**单向隔离**——子应用样式出不去，主应用/其他应用样式照常能进来
- 关键限制：**`@keyframes`、`@font-face`、`@import`、`@page` 不被支持**——改写对象是元素选择器，而这几个 at-rule 定义的是**全局命名空间里的名字**，无处安放属性限定
- 后果可推理：两个子应用都定义 `@keyframes fade-in`，**动画重名照样互踩**，仍要靠命名约定兜底

</v-click>

<!--
弹窗问题依旧：挂 body 的节点不在容器内，改写后的选择器反而选不中它。「experimental」前缀所示的实验状态，它适合作增量防线而非唯一防线。
-->

---

# 动态样式表劫持:「子应用之间」的自动清场

管的是时间维度：运行期动态插入的样式，卸载时没人收拾

<v-click>

- **挂载期**：劫持 `appendChild`/`insertBefore`，子应用插入的每个样式节点登记归属
- **卸载时**：按账本统一移除——样式随应用走，不留残余
- **再挂载**：从缓存账本重建，省一次网络与解析

</v-click>

<v-click>

qiankun 开沙箱时「**自动隔离微应用之间的样式**」即此机制。注意量词——**之间**：它保证 A 卸载不污染 B，但**主应用样式不归它管**。官方补法是主应用样式自治，最典型是组件库改前缀：

```js
// 主应用 webpack：把 antd 的 CSS 前缀从 ant- 改成自己的
{ loader: "less-loader", options: { modifyVars: { "@ant-prefix": "myMain" } } }
// 配合运行时：ConfigProvider prefixCls="myMain" 让类名也换前缀
```

</v-click>

<!--
一句话总结：自动化的那半（子应用之间）交给劫持，自动化不了的那半（主应用）交给约定。webpack style-loader、CSS-in-JS 运行时都会动态插 style。
-->

---

# 命名约定：零运行时的老实人方案

不指望任何运行时，让类名自己不撞车

<v-click>

| 手段 | 机制 | 约束力 |
| --- | --- | --- |
| **团队前缀** | `.checkout-*`/`.search-*`，每团队一个命名空间 | 纪律（lint 辅助） |
| **BEM** | `block__element--modifier` 结构化命名 | 纪律 + 评审 |
| **CSS Modules** | 构建期把类名编译成哈希，冲突物理不可能 | 工具链强制 |
| **CSS-in-JS** | 运行时/编译期生成唯一类名 | 工具链强制 |

</v-click>

<v-click>

> Fowler 演示应用全走 styled-components——「因此可以保证样式不会泄漏出去」。优点绝对：**零运行时成本、无兼容性问题、对弹窗一视同仁**（弹窗类名也带前缀）。弱点也明显：它是**预防机制**不是执行机制——管不住第三方全局样式，也防不了不守规矩的队友。

</v-click>

<!--
四手段按约束力从纪律到工具链强制排列。这是无论选什么框架都该有的底线，尤其动画名、字体名也要带前缀。
-->

---

# CSS 隔离四路线取舍

落地照三层叠：命名约定打底 → 框架运行时兜底 → 主应用自治

| 维度 | Shadow DOM | 属性前缀改写 | 样式表劫持 | 命名约定 |
| --- | --- | --- | --- | --- |
| 隔离方向 | 双向 | 单向（防泄漏） | 时间（防残留） | 预防（防撞名） |
| 执行者 | 浏览器原生 | 运行时改写 | 运行时记账 | 构建/纪律 |
| 运行时成本 | 低（原生） | 每条规则改写 | 劫持 + 账本 | **零** |
| 弹窗挂 body | 死穴：样式全丢 | 失效：选不中 | 不管辖 | 天然覆盖 |
| at-rule 动画/字体 | 树内自洽 | **不支持改写** | 随节点走 | 需前缀约定 |
| 主应用样式 | 进不来 | 能进来（不设防） | 不管辖需自治 | 靠主应用守约 |

<v-click>

> 判断一个方案行不行，拿三个问题去戳：**弹窗挂哪儿、动画名会不会撞、主应用样式谁来管**。没有一条路线全能，单押任何一层都会在某个盲区翻车。

</v-click>

<!--
三层各堵一个方向的漏：命名约定（工具链强制）→ 框架运行时（劫持保证卸载干净 + 前缀或 Shadow DOM 二选一）→ 主应用自治（antd 改 prefix）。
-->

---
layout: section
---

# HTML entry 与资源加载

主应用怎么「拿到」子应用——机制层最工程化的一环

---

# 两种 entry 契约：全局函数 vs 资源清单

主应用怎么知道「子应用长什么样、怎么启动」

<v-click>

```js
// JS entry：约定子应用暴露全局渲染函数（Fowler 演示形态）
window.renderBrowse = (containerId, history) => { /* 渲染进指定容器 */ };
window.unmountBrowse = (containerId) => { /* 对应清理 */ };
window.renderBrowse("browse-container", history); // 容器按约定调用
```

</v-click>

<v-click>

- **JS entry** 的三笔隐性账：CSS/资源要么打进 JS 要么另立约定；产物 hash 文件名还需 manifest 层；「独立运行」与「被集成」是两套入口，容易漂移
- **HTML entry**：直接把子应用 **HTML 地址**当入口——HTML 本就是资源清单（`<script>`/`<link>` 列出一切、天然带 hash 后最新文件名）；最大收益是**同构**：独立跑的和被集成的是同一份 HTML

</v-click>

<v-click>

> Fowler：「**这个全局函数的签名，就是容器与微前端之间的关键契约**」。HTML entry 的代价是主应用要内置一个「迷你浏览器」——这正是 import-html-entry 的角色。

</v-click>

<!--
JS entry 简单直接但工程账多；HTML entry 用「主应用扮演迷你浏览器」换来集成测试与独立调试不再是两个世界。
-->

---

# import-html-entry 工作流

qiankun 底层依赖（kuitos 维护），把「HTML 当清单」做成三个 API

<v-click>

```js
const {
  template,               // 处理后的 HTML 模板（外链 script 已摘除）
  assetPublicPath,        // 从 entry 地址推导的资源基准路径
  getExternalScripts,     // () => Promise<脚本内容数组>
  getExternalStyleSheets, // () => Promise<样式内容数组>
  execScripts,            // (sandbox?, strictGlobal?) => Promise<入口导出>
} = await importHTML("//sub-app.example.com/index.html");

container.innerHTML = template;                        // ① 模板进容器
const exports = await execScripts(sandboxProxy, true); // ② 沙箱上下文执行
exports.mount(props);                                  // ③ 拿到生命周期，进入编排
```

</v-click>

<v-click>

> **`execScripts(proxy, strictGlobal)` 是灵魂 API**：在给定 proxy（沙箱对象）上下文里执行全部脚本，返回**入口脚本在 window/proxy 上设置的最后一个属性**——生命周期导出就是这么被拿到的。`importEntry` 还接受 `{ scripts, styles, html }` 对象形式。

</v-click>

<!--
proxy 参数即沙箱插槽：把 JS 沙箱的代理对象递进来，子应用的全局访问就落进沙箱——HTML entry 与沙箱机制在这一个参数上会师。HTML 里多个 script 时默认最后一个是入口，也可显式加 entry 属性。
-->

---

# 执行细节与 UMD 约束

脚本被 fetch 成文本再**在函数作用域求值**（非 `<script>` 插入），三条推论

<v-click>

- **推论一 · 必须 CORS**：脚本样式全走 `fetch`，同源策略立刻生效——qiankun FAQ 原文「必须要求这些静态资源支持跨域」
- **推论二 · 必须 UMD**：框架从 proxy 上找「入口脚本设置的最后一个属性」当导出

</v-click>

<v-click>

```js
// 子应用 webpack（qiankun FAQ 原方案）
output: {
  library: `${packageName}-[name]`, // 全局变量名 —— 与主应用注册 name 对齐
  libraryTarget: "umd",             // UMD：导出挂到全局
}
```

</v-click>

<v-click>

> **推论三 · 固定病名**：`Application died in status LOADING_SOURCE_CODE` = 从 entry 识别不到生命周期导出。排查：生命周期真导出了吗 → `output.library` 让导出落上 window 了吗 → entry 是不是最后执行（加 `entry` 属性标记）→ 响应是否 200。

</v-click>

<!--
理解「脚本怎么被执行」，后面的约束就全是推论。eval 型执行 + proxy 当全局，是 CORS/UMD/病名三条推论的共同源头。
-->

---

# publicPath 运行时注入

子应用打包时不知道自己将来挂在谁的域名下

<v-click>

```js
// public-path.js —— 必须是子应用 entry 里第一个执行的模块
if (window.__POWERED_BY_QIANKUN__) {
  // 运行时改写 webpack publicPath：之后所有动态 chunk/资源都以注入值为基准
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

</v-click>

<v-click>

- 主应用侧：import-html-entry 从 entry 地址推导 `assetPublicPath`，框架注入子应用全局
- 子应用侧：entry 最顶部用 webpack 运行时 publicPath 接住它
- **CSS 内 `url()`（字体/背景图）不走 webpack 运行时 publicPath**——编译期写死，修不了只能绕：上 CDN、小文件 base64、file-loader 写死完整路径（FAQ 三方案）

</v-click>

<!--
runtime publicPath 主要解决动态载入的脚本、样式、图片地址不正确的问题。CSS url() 是编译期写死在 CSS 里的，不经过 webpack 运行时，只能绕。
-->

---

# ESM 时代的根本冲突

整套机制的地基是「classic script + 全局导出」，Vite 产物是原生 ESM

<v-click>

| classic script 假设 | ESM 的现实 |
| --- | --- |
| 脚本文本可在函数作用域 eval 求值 | `import`/`export` 在 eval 语境直接 **SyntaxError** |
| 顶层变量可经 `library` 挂全局、从 proxy 取 | 模块作用域封闭，**顶层变量本就不进 window** |
| 无 `import.meta`、依赖可整包打进产物 | `import.meta`、裸说明符解析绑定在**真实模块图**上 |
| `with(proxy)` 可介入作用域链 | ESM **强制严格模式**，`with` 是语法错误——沙箱手段被没收 |

</v-click>

<v-click>

> 「qiankun 2.x 不支持 vite/ESM 入口」的**根因**：不是没适配，是执行模型**结构性地**装不下 ESM。出路三条：插件把 ESM 包回全局（vite-plugin-qiankun 型）、换 iframe 沙箱（原生执行 `type="module"`）、换 MF / import maps（本就活在模块世界）。

</v-click>

<!--
四条冲突逐条对应 HTML entry 的四个地基假设。症状通常还是那个 LOADING_SOURCE_CODE 报错。这条裂缝解释了 qiankun 的 Vite 之痛，也解释了 wujie/micro-app iframe 模式与 MF 各自的兴起路径。
-->

---
layout: section
---

# 应用间通信

协作两件套之一：拆开的应用如何开口说话

---

# 第一原则：少通信

通信机制选型之前，先过一道架构闸门

<v-click>

- single-spa 官方立场罕见强硬：跨微前端共享 UI 状态的需求**本身就该被怀疑**——「如果两个微前端间需要频繁通信，说明它们耦合过度，应考虑合并」
- Fowler 同调：好的微前端架构里应用之间**间接通信、互不知晓**

</v-click>

<v-click>

> 因果链：通信通道一旦建立，两端就有了**共同的协议要维护**——协议变更要两边同步发版，「独立部署」名存实亡。

</v-click>

<v-click>

> 五种模式的排序原则：**能靠路由解决的不建通道，能单向的不双向，能显式契约的不全局广播**。

</v-click>

<!--
这不是洁癖，而是因果链。通信是架构债，先问要不要通，再问怎么通。
-->

---

# 五模式：先记方向再记名字

按耦合从低到高排布

| 模式 | 方向 | 一句话 | 代表形态 |
| --- | --- | --- | --- |
| props 下行 | 主→子 | 挂载时递数据与回调 | mount props / CE 属性 |
| CustomEvent 上行 | 子→主 | 子应用冒泡广播事实 | `dispatchEvent` + 前缀 |
| 发布订阅/全局态 | 多↔多 | 内置广播台，少量全局态 | `initGlobalState` / EventBus |
| URL 即通信 | 多↔多 | 页面级状态写进地址栏 | 路由参数即状态 |
| utility module | 调用方→模块 | 共享逻辑做成模块直接 import | single-spa 首选 |

<v-click>

> single-spa **明确反对全局 Redux/Mobx**：依赖全局 state 形状或他人 dispatch 的 action，就**无法真正独立部署**——各应用自持状态，共享走导出 API。

</v-click>

<!--
五模式各守一个方向。判读顺序：先试 URL，再看方向（单向下发 props、单向上报 CustomEvent），共享逻辑抽 utility module，全局态才动用发布订阅，跨域 iframe 别无选择用 postMessage。
-->

---

# props 下行 + CustomEvent 上行

最朴素也最健康的两个方向

<v-click>

```js
// 子应用：从容器节点冒泡上去，detail 携带数据
container.dispatchEvent(
  new CustomEvent("team-checkout:cart-add", {
    detail: { sku: "A-1024", count: 1 },
    bubbles: true, // 冒泡到主应用监听层
  }),
);
// 主应用：在容器外层统一收
document.addEventListener("team-checkout:cart-add", (e) => updateCartBadge(e.detail));
```

</v-click>

<v-click>

- **props 下行**（父知子）：登录态/主题/语言下发；生命周期框架落在 mount props，CustomElement 容器型（micro-app）走 `attributeChangedCallback`
- **CustomEvent 上行**：Fowler 认可的「间接通信、耦合最低」；要点一条——**事件名带团队/应用前缀**，它是页面级全局命名空间，不带前缀迟早撞车

</v-click>

<!--
props 只有下行方向，契约限制在挂载点一处。CustomEvent 只适合广播事实、发后不管，不适合请求-响应，先发的事件不会补发给后来的监听者。
-->

---

# 发布订阅 / 全局状态：框架内置广播台

把「事件 + 数据快照」封装成状态中心——qiankun `initGlobalState` 是典型

<v-click>

```js
// 主应用：初始化全局状态，拿到 actions
const actions = initGlobalState({ user: { name: "alice" }, theme: "dark" });
// 任一应用：监听（fireImmediately: true 注册即回放当前值，缓解「先发后订」）
actions.onGlobalStateChange((state, prev) => applyTheme(state.theme), true);
// 任一应用：修改 —— 只能改第一层属性
actions.setGlobalState({ theme: "light" });
// 子应用卸载时：必须移除，否则是跨应用内存泄漏
actions.offGlobalStateChange();
```

</v-click>

<v-click>

> 甜区是「少量、低频、全局关心」的状态（登录态/主题/语言）。风险背下来：**广播没有 schema**（规模一大就是事件满天飞）、时序问题（先 set 后订阅靠 `fireImmediately` 回放）、卸载不解绑的监听泄漏。wujie 的对应物是**去中心化 EventBus**。

</v-click>

<!--
initGlobalState 型方案只共享数据、不共享 store 形状与 reducer 逻辑，耦合半径比全局 Redux 小得多，但仍要克制使用。
-->

---

# URL 即通信 + utility module

一个把状态写进地址栏，一个把共享逻辑做成模块

<v-click>

- **URL 即通信**（Fowler 力荐）六优点：开放标准、页面任何代码全局可见、**容量有限倒逼只传小数据**、面向用户**倒逼忠实建模领域**、声明式而非命令式、强制间接通信互不依赖

```text
https://shop.example.com/order/1024?tab=logistics
        └── 主应用路由：订单域   └── 子应用内状态：当前页签
```

</v-click>

<v-click>

- **utility module**（single-spa 首选）：共享逻辑做成独立部署的 in-browser module，其他应用像 npm 包一样 `import`——**唯一有真实 API 边界的模式**（类型可查、可版本化、可单测）

```js
import { getLoggedInUser } from "@org/api"; // 多应用共享同一份缓存，避免重复请求
```

</v-click>

<!--
URL 只适合小而可公开的状态——放不下大对象，也不该放敏感数据。utility module 正确姿势是各应用自持状态，跨应用共享的只有导出的函数与数据缓存。
-->

---

# postMessage：跨域 iframe 的唯一正门（上）

前五种模式都活在同一个 JS 上下文；跨域 iframe 只有 postMessage

<v-click>

- **结构化克隆**能力比 JSON 大一圈：`Object`/`Array`/`Map`/`Set`/`Date`/`RegExp`/`ArrayBuffer`/`Blob`/`File` 都能过
- 三样过不去：**函数**（传能力就传 MessagePort）、**DOM 节点**、`Symbol`；类实例能过但**原型链丢失**、`instanceof` 全失效 → 协议按**纯数据 + 类型字段**设计

</v-click>

<v-click>

```js
// 发送端：第二个参数写死预期接收方的精确 origin
iframe.contentWindow.postMessage(
  { type: "auth:token", payload: token },
  "https://sub.example.com", // 若窗口已被导航到别的源，消息直接不投递
);
```

</v-click>

<v-click>

> MDN 近原话：**发数据永远指定精确 targetOrigin，不要用 `*`**——「恶意站点可在你不知情时改掉窗口 location，从而截获数据」。省略时默认 `"/"`（仅同源）。

</v-click>

<!--
targetOrigin 不是可选项。「*」唯一合理场景是接收方为 data: 这类 opaque origin——而那本身就该触发你重新审视方案。
-->

---

# postMessage：跨域 iframe 的唯一正门（下）

接收端安全底线：origin 白名单 → 语法校验 → 才处理

<v-click>

```js
const TRUSTED_ORIGINS = new Set(["https://main.example.com"]);
window.addEventListener("message", (event) => {
  if (!TRUSTED_ORIGINS.has(event.origin)) return; // ① 身份：不在白名单直接丢弃
  const { type, payload } = event.data ?? {};
  if (typeof type !== "string") return;            // ② 语法：schema 不对也丢弃
  handlers[type]?.(payload);                       // ③ 按类型分发，绝不 eval 内容
});
```

</v-click>

<v-click>

- MDN：「不校验 `origin`（及 `source`）就是给跨站脚本攻击开门」；**不期望收消息就别挂 `message` 监听**
- `event.origin` 是**发送时刻**的 origin；回信用 `event.source.postMessage(reply, event.origin)`
- **MessageChannel**：把 `port2` 经 postMessage 转移给对方，后续走专用双向管道（握手一次校验、之后点对点）；transfer 对象**转移后原端不可用**

</v-click>

<!--
与沙箱勾稽：wujie 恰恰不靠 postMessage——它的子应用 iframe 与主应用同域，window.parent 直通、函数直接调用。postMessage 的主场是真正跨域 iframe 集成。
-->

---

# 通信选型判据

判读顺序：先 URL，再看方向，共享逻辑抽模块，全局态才广播，跨域才 postMessage

| 模式 | 方向 | 跨域 iframe | 甜区 | 典型坏法 |
| --- | --- | --- | --- | --- |
| props 下行 | 主→子 | ✗ | 登录态/主题下发 | 万能 props 袋 |
| CustomEvent 上行 | 子→主 | ✗ | 广播领域事实 | 无前缀撞名 |
| 发布订阅/全局态 | 多↔多 | ✗ | 少量全局态 | 卸载不解绑 |
| URL 即通信 | 多↔多 | ✓ | 页面级状态、深链接 | 敏感数据进 URL |
| utility module | 调用方→模块 | ✗ | 共享逻辑/请求缓存 | 演化成全局 store |
| postMessage | 双向 | **✓ 唯一正门** | 跨域 iframe 集成 | 不校验 origin |

<!--
通信方案永远是沙箱路线的下游——先定隔离模型，再选通信通道。wujie 的同域 iframe 设计是最好的例证：同上下文用五模式，跨域 iframe 才必须 postMessage。
-->

---
layout: section
---

# 依赖共享三路线

别让五个子应用各背一份 React

---

# 问题面：n 份 React 与共享的对价

依赖共享不是「要不要去重」的技术题，是**拿部署独立性换字节**的架构交易

<v-click>

- Fowler 把账算得直白：「每个微前端都带一份自己的 React，就是在强迫用户下载 n 次 React」
- 同一段就标了另一头的价：为去重抽出公共依赖，「就**重新引入了构建时耦合**」——升级 React 变成全体子应用的**协同升级战役**

</v-click>

<v-click>

| 路线 | 版本协商时机 | 裁决者 |
| --- | --- | --- |
| externals + import maps | 部署时 | import map 维护者（集中裁定） |
| Module Federation shared | **运行时** | share scope 里的 semver 协商（现场裁定） |
| 不共享 | 无 | 各应用自己（不交易） |

</v-click>

<v-click>

> 「不共享」是严肃选项而非摆烂——Fowler 指出独立编译天然自带按页 code-split，性能账未必输。

</v-click>

<!--
三条路线本质是三种成交方式，分界线是「版本协商发生在什么时候」。共享名单永远从「不共享」起步，每加一项就多一分构建耦合。
-->

---

# import maps：集中裁定路线

single-spa 官方立场——构建侧 externals 剔除大库，运行时浏览器原生解析

<v-click>

```html
<!-- 必须出现在任何模块加载之前；type="importmap" 的 script 不能用 src 外链 -->
<script type="importmap">
{
  "imports": {
    "react": "https://cdn.example.com/react@18.3.1/index.js",
    "lodash/": "https://cdn.example.com/lodash@4.17.21/"
  },
  "scopes": {
    "/legacy-app/": { "react": "https://cdn.example.com/react@17.0.2/index.js" }
  },
  "integrity": { "https://cdn.example.com/react@18.3.1/index.js": "sha384-…" }
}
</script>
```

</v-click>

<v-click>

> **Baseline Widely available（2023-03 起）**——新项目直接原生 ESM + 原生 import map；**SystemJS 只是未原生化年代的 polyfill**，已退居历史兼容层。

</v-click>

<!--
这张 JSON 是全页面依赖的权威裁定书。构建侧配对动作只有一行：externals: ['react', 'react-dom']，产物里保留裸说明符。
-->

---

# import maps 三键各管一件事

MDN 一手语义，`scopes` 是同页多版本共存的原生方案

<v-click>

- **`imports`**：裸说明符 → URL 的全局映射。键以 `/` 结尾即**前缀匹配**（`"lodash/"` 覆盖全部子路径），多键可匹配时**最具体的键优先**
- **`scopes`**：**按引用者路径**给不同映射——`/legacy-app/` 下的模块拿 React 17、其余拿 18。**同页多版本共存**的原生工具，最具体 scope 优先、逐级回退到 `imports`
- **`integrity`**：给模块 URL 挂 SRI 哈希，锁死 CDN 内容

</v-click>

<v-click>

> 工程约束：import map **必须在首个模块加载前声明**；`type="importmap"` **禁止 `src`/`async`/`defer`**（只能内联或 SSR 进 HTML）；多张 map 合并但**已解析的说明符先者优先**。single-spa 立场：**大库共享、小库各自带**（React/Vue 级别共享，react-router「小到可以重复」）。

</v-click>

<!--
共享越多，升级越要全体同步——共享名单越长，被锁死的自由越多。import map 本身成了一等部署产物：改一行 JSON 就是一次发布。
-->

---

# Module Federation shared：运行时协商路线

每个应用照常打包，运行时按 semver 现场协商「用谁的副本」

<v-click>

**双端声明**——共享是「注册 + 消费」双向协议（同一 shareKey）：

| 生产者声明 | 消费者声明 | 结局 |
| --- | --- | --- |
| ✓ | ✓ | 共享成立：scope 协商出一个副本，双方共用 |
| ✓ | ✗ | 消费者用**自己的副本**——共享静默失效，页面双份依赖 |
| ✗ | ✓ | scope 无人提供 → 回退自己的 fallback 副本 |
| ✗ | ✓ 且 `import: false` | 无 fallback 可回——**运行时报错** |

</v-click>

<v-click>

> 第二行最阴险：没有报错、没有警告，只是 bundle 里多出一份 React——共享失效要靠**产物体积与 MF DevTools** 排查，而不是控制台。

</v-click>

<!--
构建器只对声明了 shared 的依赖，才会把 import 'react' 改写成「先查 scope」的运行时查找。一端不声明，共享就不成立。
-->

---

# singleton、requiredVersion 与加载策略

关键键的语义与坑，全从「运行时 scope 协商」模型推得出来

<v-click>

- **`singleton`**（默认 `false`）：scope 内只留一个版本——**版本不一致时加载较高版本，低版本方收控制台警告**；React/Vue 这类全局内部状态库必须开
- 反直觉后果：**你实际运行的版本由页面里最高版本参与者决定**，lockfile 说了不算——治理靠让各方版本范围收敛，而非指望 lockfile
- **`requiredVersion`**（默认取自 package.json）：不满足**警告**后照用；**`strictVersion`** 升级为**拒绝**（有 fallback 用 fallback，`import: false` 则**运行时抛错**）
- **`shareStrategy`**：`version-first`（默认，初始化拉全部 remote 保最高版本，**远端挂了启动就炸**）vs `loaded-first`（按需、容错好）

</v-click>

<!--
三档治理光谱：不设 requiredVersion（全凭 semver）→ requiredVersion（不合警告）→ strictVersion（不合拒绝）。eager: true 把共享打进入口同步可用，代价是入口膨胀且提供的模块总会被下载。
-->

---

# 子路径坑 + 混用禁忌

现代库大量走子路径导出，而 `shared` 的键默认**精确匹配**

<v-click>

```ts
// ❌ 只拦 import 'react-dom' —— react-dom/client 打进本地副本
//    页面出现第二份 React DOM，singleton 破裂，hydration 报错
shared: { 'react-dom': { singleton: true } }

// ✅ 尾斜杠 = 前缀匹配，拦下该命名空间全部子路径（MF 文档原方案）
shared: {
  'react-dom': { singleton: true },
  'react-dom/': { singleton: true }, // 覆盖 react-dom/client、react-dom/server…
}
```

</v-click>

<v-click>

> **混用禁忌**（single-spa 原文立场）：同一依赖**不要**同时走 import maps 与 MF shared——两套解析各自为政，双份加载、版本漂移。原则一句话：**一个页面里，一个依赖只能有一个权威解析源**。工程混用（single-spa 编排 + MF 共享）是成熟模式，但依赖名单必须二选一划界。

</v-click>

<!--
MF 文档把漏尾斜杠列为 Common mistake：import { createRoot } from 'react-dom/client' 会加载第二份 React DOM，破坏单例引发 hydration 错误。
-->

---

# 依赖共享三路线对比

协商时机决定一切：部署时 / 运行时 / 无

| 维度 | externals + import maps | MF shared | 不共享 |
| --- | --- | --- | --- |
| 协商时机 | 部署时（改 map 发布） | 运行时 semver 协商 | 无 |
| 裁决者 | map 维护者（集中） | 最高版本参与者 | 各应用 |
| 多版本共存 | `scopes` 按路径指派 | 非 singleton 各用各的 | 天然 |
| 失败模式 | map 指错→全页同错 | 版本漂移（难排查） | 重复下载 |
| 构建工具 | 产 ESM + externals | 需 MF 支持（webpack/Rspack） | 无 |
| 标准化 | **Baseline 2023-03** | MF 运行时私有协议 | — |
| 立场代表 | single-spa 官方 | Module Federation 本命 | Fowler 提醒 |

<!--
两条路线不要在同一依赖上混用。共享名单本身则永远从「不共享」起步，每加一个共享项就多一分构建耦合。
-->

---
layout: section
---

# 预加载与性能代价

四大机制叠加起来的性能账，上线前必须算清

---

# 为什么预加载是微前端的刚需

单体切页面以毫秒计；微前端切应用是一整条冷启动链

<v-click>

```text
用户点击 → 下载子应用 HTML → 解析出 JS/CSS 清单 → 逐个下载
        → 沙箱初始化 → 脚本执行 → bootstrap → mount → 可交互
```

</v-click>

<v-click>

- 预加载的本质：**把这条链的前半段搬到点击之前**——用主应用空闲期的带宽，换子应用切换时的体感
- 但「搬多少、什么时候搬」是权衡：搬太少没效果，搬太多挤占主应用首屏、白白消耗流量与内存
- 各框架的预加载 API 本质都在**回答同一个调度问题**，只是激进程度不同

</v-click>

<!--
每一环都在用户的等待里。预加载不是「越多越好」，而是一门「用不可见的空闲期兑换可见的切换体感」的调度艺术。
-->

---

# qiankun prefetch：四形态的资源预拉

`start({ prefetch })` 的一个配置项，四种调度策略

| 取值 | 触发时机 | 预拉范围 | 适用 |
| --- | --- | --- | --- |
| `true`（默认） | **首个子应用 mount 后** | 其他所有已注册应用 | 通用：先保首跳再填后路 |
| `'all'` | 主应用 `start()` 时 | 全部已注册应用 | 应用少、内网带宽富裕 |
| `string[]` | 首个 mount 后 | 数组指定的应用 | 明确知道用户下一步去哪 |
| `function` | 自定义 | 返回 `{ criticalAppNames, minorAppsName }` | 精细分级：关键先拉、次要缓拉 |

<v-click>

> `true` 与 `'all'` 的差异是**跟主应用抢不抢首屏**。关键认知：**预加载 ≠ 预执行**——prefetch 只把资源拉进 HTTP 缓存，JS 的 parse/execute、沙箱构建仍在点击之后；对重型子应用，首跳依然可感。

</v-click>

<!--
预拉执行在浏览器空闲期（requestIdleCallback 型调度）。function 形态的两级名单暴露了正确心智——应用是有优先级的，而不是一视同仁。
-->

---

# wujie 分级：预加载、预执行与保活

把「提前做多少」拆成一条完整滑竿，三档能量逐级升高

<v-click>

1. **预加载 `preloadApp`**：提前创建 iframe 实例 + 缓存静态资源——比纯资源预拉多做了「沙箱实例化」；结合 `requestIdleCallback` 只吃空闲时间
2. **预执行 `exec`**：预加载基础上**直接执行子应用代码**——组件树在点击前已渲染在内存容器里，官方称「类 SSR 的打开体验」，最激进的一档
3. **保活 keep-alive**：针对**回访**——切走不销毁 iframe 与容器，状态（表单/滚动/组件树）原样保留，再进无需重新渲染

</v-click>

<v-click>

> 预执行优化**首访**、保活优化**回访**——别拿保活当首访优化用。账单：预执行抢主线程与内存（多了主应用自己先卡）；保活是纯粹**内存换时间**，每个保活应用是常驻 iframe，**不设上限等于自造内存泄漏**。

</v-click>

<!--
这条滑竿的另一头是账单。预执行把执行成本提前到主应用运行期，保活把内存常驻。三档怎么发牌看访问概率、应用体积、状态保持需求。
-->

---

# MF 隐性加载 + 性能代价四连

MF 没有「子应用切换」，但共享协商引入了自己的加载时机

<v-click>

- **`version-first`（默认）**：为保证「最高版本获胜」裁决准确，初始化即**拉全部 remote 入口**登记版本——隐性全量预加载；任一 remote 离线，启动期 `beforeLoadShare` 失败就是白屏
- **`loaded-first`**：按需加载、优先复用已加载副本——启动轻、离线只影响真正被访问的模块

</v-click>

<v-click>

性能代价四连（微前端相对单体的结构性开销）：

| 代价 | 内容 |
| --- | --- |
| **重复运行时** | Fowler：每份 React 都按字节计费，随子应用数线性增长 |
| **构建耦合回潮** | 抽公共依赖去重 → 协同升级战役（按组织成本计费） |
| **请求瀑布** | 逐级发现依赖，每级一轮 RTT（MF 2.0 公告点名的固有问题） |
| **沙箱运行时税** | with/Proxy 查找、样式改写、iframe 内存 |

</v-click>

<!--
mf-manifest.json 把预加载往平台层推：部署平台读 manifest 即可分析依赖、做精确预加载与灰度。四笔账里 1、2 是跷跷板，依赖共享整页在讲怎么落座。
-->

---

# 请求瀑布与四条缓解思路

运行时集成把「构建期就能确定的依赖」推迟到运行时逐级发现

<v-click>

```text
HTML entry 链：fetch HTML ─► 解析清单 ─► fetch JS/CSS ─► 执行 ─► mount
MF 链：       fetch manifest ─► fetch remoteEntry ─► 共享协商 ─► fetch 业务 chunk
```

</v-click>

<v-click>

- **清单前移**：mf-manifest / import map 把资源关系写成静态清单，加载器一次读全、并行去拉
- **层内并行**：解析出清单后全部样式脚本并行拉（`getExternalScripts`/`getExternalStyleSheets` 按清单批量取）
- **时间搬运**：预加载把瀑布挪到用户看不见的空闲期
- **架构级**：SSR + Data Prefetch（MF 2.0 规划），把瀑布挪到服务端内网

</v-click>

<v-click>

> 缓解思路都围绕同一句话——**让第一跳就知道整条链**。

</v-click>

<!--
每级都要等上一级返回才知道下一步拉什么，弱网下逐级放大。这不是某框架的实现瑕疵，是运行时集成的固有形态：MF 2.0 公告点名「请求瀑布问题」。
-->

---

# Fowler 实测原则与特有观测项

「微前端 = 性能灾难」的解毒剂

<v-click>

- 独立编译的反向红利：**「等效于实现了自己的 code splitting——任何单页只下载该页的源码与依赖」**，因此**单页可能反而比单体更快**
- 方法论抄在墙上：**「想确知性能影响，没有什么能替代真实环境的测量，最好在生产环境」**

</v-click>

<v-click>

| 观测项 | 恶化信号 |
| --- | --- |
| 首跳时间 | `prefetch: 'all'` 抢首屏、eager 共享撑大入口 |
| 应用切换时间 | 预拉名单与真实动线不符（拉了不去、去了没拉） |
| 依赖副本数 | bundle 里出现第二份 React（共享静默失效） |
| 启动期请求串行深度 | remote 增长后启动线性变慢（`version-first`） |
| 内存水位 | 保活不设上限、切换后内存不回落 |

</v-click>

<!--
单体 bundle 塞着所有页面代码，微前端天然按页切割——两边的账不能只算一头。通用性能手段归前端优化章，这里只强调微前端特有账目要单列观测。
-->

---

# 机制 × 框架映射

选框架，本质是在四大机制上各选一条路线（纵向空格是定位不是缺陷）

| 机制 | single-spa | qiankun | wujie | micro-app | MF |
| --- | --- | --- | --- | --- | --- |
| **JS 沙箱** | 不提供 | 快照/Proxy | **iframe** | **with+Proxy** | 不提供 |
| **CSS 隔离** | 不提供 | ShadowDOM/改写 | WC 容器 | 元素+样式 | 不提供 |
| **加载** | 编排+importmap | **HTML entry** | entry→容器 | entry(CE) | remoteEntry |
| **通信** | **utility module** | props+全局态 | parent/EventBus | `setData`+事件 | 直接 import |
| **依赖共享** | **externals+im** | 无内置 | 无内置 | 无内置 | **shared 协商** |

<!--
读表两姿势：纵向空格是定位不是缺陷（single-spa 只做生命周期编排、MF 只做模块共享，隔离要么不需要要么自己补）；横向代表只到机制层，完整 API 见各框架叶。ESM/Vite 子应用：single-spa/wujie/MF 天然支持、qiankun 2.x 结构性不支持、micro-app 走 iframe 模式支持（详见 ESM 那一页）。
-->

---
layout: center
class: text-center
---

# 小结

四大机制 + 一层加载性能，框架无关的通论

<v-click>

- **JS 沙箱**：快照（单实例）→ Proxy（多实例）→ with+Proxy（拦自由变量）→ iframe（物理隔离）；ShadowRealm 停在 Stage 2.7
- **CSS 隔离**：Shadow DOM（弹窗逃逸）/ 属性改写（at-rule 盲区）/ 样式表劫持（只管之间）/ 命名约定（零运行时）
- **通信**：URL → props/CustomEvent → 发布订阅 → utility module；跨域 iframe 唯一正门 postMessage
- **依赖共享**：import maps（集中、Baseline）vs MF shared（运行时、最高版本获胜）vs 不共享；勿混用
- **加载与性能**：HTML entry 拿子应用、prefetch/预执行/保活提前拿；代价四连要单列观测

</v-click>

<v-click>

> 选框架 = 在四大机制上各选一条路线。读懂机制，后面每个框架叶只剩「它选了哪条路、补了哪些细节」。

</v-click>

<!--
五个主题收束。隔离两件套 + 协作两件套 + 加载性能，每条机制都讲了问题面、主流路线、以及每条路线为什么这样设计、坏起来什么样。
-->

---
layout: center
class: text-center
---

# 谢谢

微前端核心机制 · 隔离两件套 + 协作两件套 + 加载性能

<div class="mt-8 text-gray-400">
框架无关的四大机制通论 · 面向前端工程师
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/architecture/micro-frontend/mfe-mechanisms/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
全叶覆盖 JS 沙箱谱系、CSS 隔离、HTML entry 与资源加载、应用间通信、依赖共享三路线、预加载与性能代价。配套笔记见文档图标链接。感谢观看。
-->
