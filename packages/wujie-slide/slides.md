---
theme: seriph
background: https://cover.sli.dev
title: wujie 无界
info: |
  wujie（无界）= iframe JS 沙箱 + WebComponent 容器 —— 隔离最强、Vite 原生友好；iframe 沙箱、WC 渲染、路由同步、保活预加载、通信、v2.0 复活
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:container-software class="text-8xl" />
</div>

<br/>

## wujie 无界

腾讯开源 · iframe 跑子应用 JS + WebComponent 渲染 DOM —— 隔离最强、Vite 原生友好

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
wujie（无界）是腾讯开源的微前端框架，走一条和 qiankun / single-spa 都不同的独特路线。一句话定位：iframe 跑子应用 JS 拿原生 window/history/location 物理隔离，WebComponent 承载子应用 DOM 渲染。这套分工让它拿到微前端里最强的隔离性，同时原生亲和 Vite/ESM。
-->

---
transition: fade-out
---

# 这一章讲什么

一条主线：**wujie 怎么用「iframe 跑 JS + WebComponent 渲 DOM」拿到最强隔离与 Vite 亲和**

<v-click>

- **iframe JS 沙箱**：子应用 JS 跑同域 iframe，拿原生 `window`/`history`/`location` 物理隔离
- **WebComponent 容器**：子应用 DOM 渲进 `<wujie>` 的 `shadowRoot`，弹窗覆盖全屏、样式随 Shadow DOM 隔离
- **路由同步**：劫持 iframe `history`，把子应用路由投影到主应用 URL query
- **保活与预加载**：保活/单例/重建三模式 + `preloadApp` 预执行 + `fiber` 分片，秒开秒切
- **通信**：`props` / `window` 直通 / 去中心化 EventBus 三条通道
- **v2.0 与现状**：2026-06 全新空白同域 iframe 沙箱、连发 4 版复活、选型定位

</v-click>

<v-click>

> **JS 在 iframe、DOM 在 WebComponent** —— 一句话心智贯穿全章。

</v-click>

<!--
六个主题顺序推进：先建「双容器」心智，再逐一吃透 iframe 沙箱、WC 渲染、路由同步、保活预加载、通信，最后收在 v2.0 复活与选型。沙箱/CSS 隔离/通信的通论在「微前端核心机制」叶，本章只讲 wujie 的具体实现与 API。
-->

---

# wujie 是什么：一句话定位

腾讯开源的微前端框架，走一条和 qiankun/single-spa 都不同的独特路线

<v-click>

- **定位**：wujie = **iframe**（跑子应用 JS，拿原生 `window`/`history`/`location` 做物理隔离）+ **WebComponent**（承载子应用 DOM 渲染）
- **不用 Proxy 代理 window、不用 with 改作用域链** —— 省掉这类软沙箱的性能损耗
- **组件化接入，无需注册**：不必像 single-spa/qiankun 先 `registerMicroApps`，直接 `startApp` 或 `<WujieVue>` 把子应用当组件用，支持同屏多子应用
- **隔离最强 + Vite 原生友好**：iframe 是浏览器级物理隔离；ESM 交 iframe 里浏览器原生执行，Vite 子应用零改造接入

</v-click>

<v-click>

> 沙箱、CSS 隔离、通信的**通论**在「微前端核心机制」讲透，本章只讲 wujie 的**具体实现与 API**。

</v-click>

<!--
微前端的通用价值（技术栈无关、独立开发部署、运行时隔离）不是 wujie 独有；wujie 的独到之处是「用 iframe 拿隔离、用 WebComponent 拿渲染」。它回避了裸 iframe 的路由丢失、DOM 框死、通信繁琐、白屏重建四大老毛病。
-->

---

# 双容器心智：JS 在 iframe、DOM 在 WebComponent

理解 wujie 的钥匙，务必先建立这张图

```text
主应用页面
├─ <iframe>（同域、不可见）        ← 子应用的 JS 在这里跑
│    └─ 原生 window / history / location（物理隔离，不经 Proxy）
│
└─ #sub-container
     └─ <wujie>（WebComponent）      ← 子应用的 DOM 渲染在这里
          └─ shadowRoot             ← 样式随 Shadow DOM 天然隔离
               └─ 子应用真实 DOM 树

   ⇅ document 代理桥接：iframe 里的 querySelector / getElementById
     被代理到 <wujie> 的 shadowRoot，让「iframe 的 JS」操作「WC 的 DOM」
```

<!--
这是 wujie 与所有 Proxy 沙箱框架最本质的区别。iframe 负责隔离：子应用所有 JS 在同域 iframe 的 window 上执行，全局/定时器/history/location 全是 iframe 原生的。WebComponent 负责渲染：DOM 渲进 <wujie> 的 shadowRoot，弹窗能覆盖全屏。桥接靠 document 代理把两者缝合。
-->

---

# 破解裸 iframe 的四大老毛病

wujie 用 iframe 拿隔离、用 WebComponent 拿渲染，同时回避裸 iframe 的老毛病

<v-click>

| 裸 iframe 的老毛病 | wujie 怎么破 |
| --- | --- |
| 刷新/分享 URL 后**子应用路由丢失** | 劫持 iframe `history` 把子应用路由**同步到主应用 URL query** |
| iframe 的 **DOM 被框死在框内**，弹窗无法覆盖全屏 | DOM 渲进主应用容器里的 `<wujie>` WebComponent，**不受 iframe 边界约束** |
| iframe 跨文档**通信繁琐** | 同域 iframe + 去中心化 EventBus + `window.parent` 直通 |
| 每次进入**白屏重建、慢** | **保活**（状态不销毁）+ **预加载/预执行**（空闲期提前拉资源渲染），秒开秒切 |

</v-click>

<v-click>

> 官方对比 single-spa/qiankun 总结的四条收益：**可同屏激活多子应用、组件化无需路由适配、天然保活、执行性能不受 Proxy 代理拖累**。

</v-click>

<!--
四行分别对应本章的路由同步、WC 渲染、通信、保活预加载四个章节。wujie 相对裸 iframe 的收益，正是把这四个老毛病逐一根治。
-->

---

# 最小接入：主应用一个 startApp

wujie **不需要注册** —— 直接 `startApp` 就能把子应用挂到某个 DOM 节点

<v-click>

```js
// 主应用：命令式接入，一个 startApp 搞定
import { startApp } from "wujie";

startApp({
  name: "app-vue", // 子应用唯一标识（同 name 共享同一实例）
  url: "//localhost:7100/", // 子应用地址（末尾 / 建议保留）
  el: "#sub-container", // 渲染容器：子应用 DOM 进这个节点里的 <wujie> WebComponent
  sync: true, // 开启路由同步：子应用路由写回主应用 URL query
  // alive: true,             // 可选：保活模式，切走不销毁、切回秒恢复
  // props: { token: "abc" }, // 可选：注入给子应用的数据/方法
});
```

</v-click>

<!--
startApp 是命令式接入的核心 API，name/url/el 三个必填。sync 开路由同步、alive 开保活、props 注入数据，都是可选项。命令式 startApp 与组件式 WujieVue 底层是同一套内核，配置项一一对应。
-->

---

# 组件式接入：把子应用当组件用

Vue 用 `<WujieVue>` 更顺手（Vue 3 装 `wujie-vue3`，Vue 2 装 `wujie-vue2`）

<v-click>

```vue
<template>
  <!-- width/height 建议给满，避免子应用渲染尺寸异常 -->
  <WujieVue
    width="100%" height="100%"
    name="app-vue" :url="url"
    :sync="true" :props="{ token: 'abc' }"
    @routeChange="onRouteChange"
  />
  <!-- @event 可直接监听子应用 bus.$emit 发出的事件 -->
</template>

<script setup lang="ts">
import WujieVue from "wujie-vue3";
// WujieVue 上还挂了 bus / setupApp / preloadApp / destroyApp / refreshApp
const { bus } = WujieVue;
const url = "//localhost:7100/";
</script>
```

</v-click>

<!--
WujieVue 内部渲染出的正是那个 <wujie> 自定义元素，子应用 DOM 挂在它的 shadowRoot 里。@routeChange 这类事件监听，直接对接子应用 bus.$emit 发出的事件（语法糖，后面通信章会讲）。this.$refs.wujie.refresh() 可刷新。
-->

---

# 子应用改造清单：按模式而定

wujie 的一大卖点是**低侵入**，改造多少取决于用哪种运行模式

<v-click>

| 模式 | 配置 | 子应用是否要改造 |
| --- | --- | --- |
| **重建**（默认） | 不配 `alive`、不写生命周期 | **零改造**（每次切换销毁 iframe+WC 重建） |
| **保活** | `alive: true` | **零改造**（渲染一次、切换不销毁，状态全留） |
| **单例** | `alive: false` + 写生命周期 | 需导出 `window.__WUJIE_MOUNT` / `window.__WUJIE_UNMOUNT` |

</v-click>

<v-click>

两条硬约束对所有模式都成立：

- **开 CORS**：wujie 从主应用上下文 `fetch` 子应用 HTML 与静态资源，须放开 `Access-Control-Allow-Origin`（带 cookie 时指定具体源、不能 `*`）
- **判别环境**：子应用用 `window.__POWERED_BY_WUJIE__` 区分「独立跑」还是「被 wujie 嵌入」

</v-click>

<!--
重建和保活模式子应用零改造，只有单例模式才需实现 __WUJIE_MOUNT / __WUJIE_UNMOUNT 生命周期（对齐类似 qiankun 的契约）。CORS 和环境判别是所有模式都逃不掉的两条硬约束。
-->

---

# 与 qiankun 的路线差异

一句话：**qiankun 靠软件模拟隔离，wujie 靠浏览器物理隔离**

<v-click>

| 维度 | qiankun | wujie |
| --- | --- | --- |
| **JS 沙箱** | Proxy 代理 `window`（软隔离） | **iframe 原生 window**（物理隔离，最强） |
| **DOM 渲染** | 进主应用容器 / Shadow DOM | **`<wujie>` WebComponent + `shadowRoot`** |
| **子应用接入** | 注册 + 导出 `bootstrap/mount/unmount` + UMD | **`startApp`/组件**，重建/保活零改造 |
| **Vite/ESM** | 2.x 不认 `type=module`，需社区插件 | **原生友好**（ESM 交 iframe 浏览器执行） |
| **保活** | 无 | **原生 `alive: true` 保活** |
| **多实例同屏** | 需 `singular: false` | **天然支持** |
| **代价** | 隔离弱、ESM 难 | **每应用一 iframe，内存/启动开销** |

</v-click>

<!--
选型不是「谁更好」，是「谁更配你的场景」：存量 webpack + 要开箱即用 → qiankun；复杂子应用 + 要最强隔离 + Vite 主力 → wujie。二者对比点到为止，qiankun 的沙箱/样式细节见 qiankun 叶。
-->

---
layout: section
---

# iframe JS 沙箱

wujie 的隔离地基：把子应用 JS 注入同域 iframe 里跑

---

# wujie 的 JS 沙箱就是一个 iframe

把子应用的 JS 注入一个**同域 iframe** 里跑，借浏览器给 iframe 的真隔离

<v-click>

```text
主应用 window                      子应用 iframe（同域、display:none）
├─ Vue / React（主应用自己的）      ├─ window（原生！子应用的全局都挂这）
├─ window.token = "main"           ├─ window.token = "sub"（互不影响）
├─ history（主应用路由栈）          ├─ history（子应用自己的路由栈）
└─ location                        └─ location（子应用自己的地址）
```

</v-click>

<v-click>

> iframe 是浏览器原生就提供的、独立的浏览上下文，自带一套完全独立的 `window`/`document`/`history`/`location` —— wujie **不模拟**，直接借用浏览器给的**真隔离**。

</v-click>

<!--
对比 qiankun 的 Proxy 沙箱那是「造假 fakeWindow、Proxy 拦截读写、卸载 diff 恢复」的软件模拟；wujie 这里不模拟，直接用 iframe 的物理隔离。承载 JS 的 iframe 是 display:none 的，不参与渲染，纯当 JS 运行时。
-->

---

# iframe 拿原生 window，还免了 Proxy 税

物理隔离 + 执行性能不被代理上下文拖累

<v-click>

- **全局变量**：子应用 `window.xxx = 1` 落 iframe 原生 window，主应用看不见，也**无需卸载时手动清**（iframe 销毁全局跟着没）
- **定时器/事件**：`setInterval`/`addEventListener` 注册在 iframe window，iframe 销毁即消亡，**不像 Proxy 沙箱要逐个记账清理**
- **`history`/`location`**：iframe 自带独立栈，子应用正常 `pushState`、读 `location` —— 这是[路由同步]能劫持 iframe `history` 的前提

</v-click>

<v-click>

> **免 Proxy/with 的性能账**：qiankun 每次访问 `window.X` 都要穿过 `Proxy` 陷阱或 `with` 作用域改写；wujie 跑在 iframe **原生 window** 上，`window.X` 就是普通原生访问，**无代理税**。代价则挪到 iframe 的启动与内存开销。

</v-click>

<!--
这是一笔「用内存换执行性能与隔离强度」的账。高频访问全局的大型子应用在这点上更省 CPU；代价是每个子应用常驻一个 iframe 的内存与创建开销。
-->

---

# v2.0：全新空白同域 iframe 沙箱

2026-06 的 v2.0 重构了沙箱内核，三个关键词

<v-click>

- **空白（blank）**：iframe 的 `src` 指向一个**空白的同域地址**（而非把子应用页面塞进 iframe），子应用 JS 注入这张「白纸 window」执行，没有多余页面副作用
- **同域（same-origin）**：iframe 与主应用**同源** —— 只有同源，主应用才能 `iframe.contentWindow` 读子应用全局、子应用才能 `window.parent` 访问主应用、wujie 才能代理 iframe `document`（跨域会被 SOP 全部拦死）
- **支持浏览器前进后退**：子应用在 iframe 里的路由操作能正确进入浏览器历史栈，点前进/后退能正确驱动子应用路由（v1 老痛点）

</v-click>

<v-click>

> **同域约束的坑**：子应用直接 `window.location.href = ...` 可能把整个 iframe 替换掉，须改用 `window.$wujie.location` 做 location 操作，Vite 子应用尤其注意。

</v-click>

<!--
「空白同域 iframe 沙箱」是 v2.0 复活的核心动作，正面解决了 v1 时代 iframe 路由与浏览器历史割裂的老问题。同域是 wujie 通信与 WC 桥接的地基，也带来 location 操作的实战坑。
-->

---

# 降级策略：degrade

不是所有环境都支持 WebComponent 与 `Proxy`，`degrade` 做兜底

<v-click>

```js
// 主应用：对老浏览器强制降级渲染
startApp({
  name: "app-legacy",
  url: "//localhost:7100/",
  el: "#sub-container",
  degrade: true, // 降级：不用 WebComponent，直接把子应用渲染进 iframe
  degradeAttrs: { style: "width:100%;height:100%;" }, // 降级 iframe 自定义属性
});
```

</v-click>

<v-click>

- **默认（`degrade: false`）**：JS 在 iframe、DOM 在 WebComponent（标准双容器）
- **降级（`degrade: true`）**：退回「iframe 直接渲染」，JS 和 DOM 都在 iframe 里 —— 回到裸 iframe 老约束，**弹窗无法覆盖全屏**
- wujie 检测到浏览器不支持 WebComponent 时也会**自动降级**；`degrade: true` 是手动强制

</v-click>

<!--
降级是「保可用性、牺牲体验」的兜底，主力场景仍是默认双容器模式。老浏览器自动降级，或用 degrade: true 手动强制。
-->

---

# 与 qiankun Proxy 沙箱的对比

隔离这件事上的取舍，并排看就清楚了

<v-click>

| 维度 | qiankun（Proxy 沙箱） | wujie（iframe 沙箱） |
| --- | --- | --- |
| **隔离性质** | 软隔离：`Proxy` 模拟 fakeWindow | **物理隔离：iframe 原生 window** |
| **全局清理** | 框架记账 + 卸载 diff 恢复 | **iframe 销毁自动清，无需记账** |
| **执行性能** | 每次全局访问过 Proxy 陷阱 / with | **原生访问，无代理税** |
| **防恶意** | 防意外不防恶意（软隔离） | **接近物理隔离**（同域仍可 `window.parent`） |
| **ESM/Vite** | 2.x eval 模型接不了 `type=module` | **iframe 内浏览器原生执行 ESM** |
| **代价** | 省内存、单页多应用轻 | **每应用一 iframe，内存/启动开销** |

</v-click>

<v-click>

> 一句话定性：**qiankun 用软件尽力模拟隔离、省资源；wujie 借 iframe 拿物理隔离、付内存**。

</v-click>

<!--
真要连 history/location 都物理独立、要跑 Vite 子应用，iframe 路线就是答案。qiankun Proxy 沙箱的三沙箱、window.onXxx 坑见 qiankun 叶。
-->

---

# iframe 沙箱的两个实战坑

都源于「这是个真 iframe」，理解了这点就都好解释

<v-click>

- **① iframe 不可见，只当 JS 运行时**：承载子应用 JS 的 iframe 是 `display: none` 的，不参与渲染 —— 界面在 `<wujie>` 的 `shadowRoot` 里，别指望在 iframe 内看到子应用界面
- **② 主应用资源误注入子应用 iframe**：iframe 与主应用同域，主应用脚本可能被误加载进子应用 iframe，导致重复执行

</v-click>

<v-click>

```html
<!-- 解法：主应用 <head> 最前面插一段——非顶层窗口就停止加载 -->
<script>
  // window.parent !== window 说明当前在 iframe 里（子应用沙箱），立即停止
  if (window.parent !== window) {
    window.stop();
  }
</script>
```

</v-click>

<v-click>

> 另一解法：给 iframe 的 `attrs.src` 指向一个「返回空内容」的同域端点，避免加载多余内容。

</v-click>

<!--
这两个坑与「同域 iframe」这个物理事实绑定。解法 A 用空端点、解法 B 用 window.stop 拦截非顶层窗口加载。更多 iframe 排障见官方常见问题。
-->

---
layout: section
---

# WebComponent 容器渲染

DOM 在 `<wujie>` 的 shadowRoot：弹窗覆盖全屏、样式天然隔离

---

# `<wujie>` 与 shadowRoot

DOM 不放进 iframe（否则弹窗被框死），而是渲进 `<wujie>` 的 `shadowRoot`

<v-click>

```text
#sub-container（你给的 el）
└─ <wujie>                      ← 自定义元素（WebComponent）
     └─ #shadow-root (open)     ← Shadow DOM 边界：样式的天然隔离墙
          ├─ <div id="app">     ← 子应用真实 DOM 树从这里开始
          │    └─ ……子应用的组件树
          └─ <style>……</style> ← 子应用样式被限制在这层 shadow 里
```

</v-click>

<v-click>

> `shadowRoot` 是浏览器原生的封装边界：shadow 内样式不泄漏出去、外面样式（除继承属性/CSS 变量）也进不来 —— wujie 的 CSS 隔离**不是运行时改写选择器，而是借 Shadow DOM 原生能力**。DOM 活在主应用文档流，弹窗能覆盖全屏、`z-index` 同一套层叠上下文。

</v-click>

<!--
裸 iframe 里子应用弹窗永远超不出 iframe 边框。wujie 把 JS 和 DOM 拆开：JS 留 iframe 拿隔离，DOM 拎进主应用页面的 <wujie> 元素，于是弹窗能覆盖全屏、布局随主应用容器伸缩。属通论里的「Shadow DOM 派」。
-->

---

# iframe 与 WebComponent 的分工

wujie 架构的核心，一张表说清谁管什么

<v-click>

| 关注点 | 归谁 | 说明 |
| --- | --- | --- |
| 子应用 **JS 执行** | **iframe** | 全局变量、闭包、定时器、事件都在 iframe 原生 window |
| `window`/`history`/`location` | **iframe** | 原生独立，路由同步靠劫持 iframe `history` |
| 子应用 **DOM 树** | **WebComponent** | 渲进 `<wujie>` 的 `shadowRoot`，活在主应用文档流 |
| **样式隔离** | **WebComponent** | 随 Shadow DOM 天然隔离 |
| **JS ↔ DOM 桥接** | **`document` 代理** | 把 iframe 的 `document` 查询指向 `<wujie>` |

</v-click>

<v-click>

> 关键在最后一行：JS 在 iframe、DOM 在 WC，本是**两个不同文档** —— 子应用调 `document.getElementById('app')` 若直接查 iframe 的 document 是查不到 DOM 的，`document` 代理把这道缝补上。

</v-click>

<!--
JS 和 DOM 分处两个文档，靠 document 代理缝合。下一页展开这个代理具体怎么工作。
-->

---

# document 代理桥接

wujie 劫持 iframe `document` 的查询 API，重定向到 `<wujie>` 的 `shadowRoot`

<v-click>

```text
子应用代码（在 iframe 里执行）        wujie 代理后实际作用于
────────────────────────────       ────────────────────────
document.querySelector('.btn')  →   <wujie>.shadowRoot.querySelector('.btn')
document.getElementById('app')  →   <wujie>.shadowRoot.getElementById('app')
document.getElementsByClassName →   查 shadowRoot
document.getElementsByTagName   →   查 shadowRoot
document.body / document.head   →   指向 shadowRoot 里的 body/head 代理
document.createElement(...)     →   正常创建，挂载时进 shadowRoot
```

</v-click>

<v-click>

> 从子应用视角看，它「以为」在正常页面里操作 `document` —— `querySelector` 查到自己的节点、`body` 就是自己的 body。这些操作被透明导向 WebComponent 容器，**子应用几乎无需为桥接改代码**（wujie「低侵入」的技术底座）。

</v-click>

<!--
这套代理只在默认双容器模式生效；若 degrade:true 降级为 iframe 直接渲染，DOM 回到 iframe 内，就不需要也没有这套 document 代理了。
-->

---

# 样式隔离与两个逃逸修正

样式随 Shadow DOM 天然隔离，但两类东西在 shadow 里会「失灵」

<v-click>

- **① `@font-face` 字体**：CSS 字体声明在 shadow tree 内不生效（规范限制），wujie **自动把 `@font-face` 搬到 shadow 边界外** —— 副作用：主/子应用**同名字体族会互相覆盖**，起名要避重
- **② 相对 `url()` 路径**：`background: url(./a.png)` 默认相对主应用域名解析而 404，wujie **自动转成绝对地址**

</v-click>

<v-click>

```js
// 但动态插入的 HTML（v-html/innerHTML、运行时 append 的 <style>）不走自动转换
// 需在子应用入口补一行，让动态资源也用正确的 publicPath
window.__webpack_public_path__ = window.__WUJIE_PUBLIC_PATH__;
```

</v-click>

<v-click>

> 子应用运行时 append 的 `<style>`/`<link>`，因 `document.head`/`body` 被代理指向 `<wujie>`，会正确落进 `shadowRoot`、随子应用销毁而移除 —— 无需像 Proxy 沙箱那样逐条记账改写选择器。

</v-click>

<!--
两类逃逸：@font-face 搬出 shadow（防重名）、相对 url() 自动转绝对（动态插入需配 publicPath）。动态样式落进 shadowRoot 随销毁移除，是「样式隔离靠 WebComponent」的自洽体现。
-->

---

# 事件系统修正

DOM 在 Shadow DOM 里，事件跨 shadow 边界冒泡时浏览器做**事件重定向**

<v-click>

```js
// ❌ 坑：异步事件处理里 e.target 已被重定向成 <wujie> 宿主元素
element.addEventListener("click", (e) => {
  setTimeout(() => {
    console.log(e.target); // 可能是 wujie-app，而非真实点击的节点
  });
});

// ✅ 正解：用 composedPath 取穿透 shadow 的真实目标
const realTarget =
  e.target.shadowRoot && e.composed ? e.composedPath()[0] || e.target : e.target;
```

</v-click>

<v-click>

> **弹窗定位坑**：基于 Popper.js 2.0 的下拉/气泡在 Shadow DOM 里可能定位错乱，官方修正是给子应用 `body` 设 `position: relative`。这些都是「DOM 活在 Shadow DOM 里」的边角成本 —— 换来原生、强隔离的样式边界。

</v-click>

<!--
事件重定向把 target 改写成宿主元素以免暴露 shadow 内部结构，坑到依赖 e.target 的异步代码，用 composedPath 取真实目标。Popper 弹窗定位错乱设 position:relative 修正。
-->

---
layout: section
---

# 路由同步

劫持 iframe `history`，把子应用路由投影到主应用 URL query

---

# 裸 iframe 的路由之痛

子应用路由跳转在 iframe 内部的 `history` 栈上，主应用地址栏完全不变

<v-click>

1. **刷新即回首页**：用户在子应用点到第 5 页，按 F5 刷新，主应用 URL 没记录子应用在哪，重新加载回默认路由
2. **URL 分享无效**：把地址栏 URL 发给同事，对方打开只看到子应用首页，不是你当前看的那一页
3. **浏览器前进后退错乱**：iframe 的历史与主页面历史各行其是

</v-click>

<v-click>

> wujie 的路由同步就是来根治这三点 —— 核心是**把子应用 iframe 里的路由状态，投影到主应用可见的 URL 上**。

</v-click>

<!--
三个后果都源于「iframe 路由不体现在主应用 URL」。因为 wujie 的沙箱是 iframe、子应用用 iframe 原生 history，wujie 只需劫持它就能拿到路由并同步。
-->

---

# 机制：劫持 iframe history

劫持 iframe 的 `history.pushState`/`replaceState`，同步到主应用 URL

<v-click>

```text
子应用在 iframe 里跳路由
  router.push('/detail/5?tab=info')
        │
        ▼  iframe.history.pushState 被 wujie 劫持
  wujie 取出 path+query+hash = "/detail/5?tab=info"
        │  encodeURIComponent 编码
        ▼
  写回主应用 URL：
  https://main.app/dashboard?app-vue=%2Fdetail%2F5%3Ftab%3Dinfo
                              └── key 是子应用的 name ──┘
```

</v-click>

<v-click>

> 主应用地址栏就「记住」了子应用当前在哪。**刷新/分享这个 URL**，wujie 初次实例化时从 query 把 `app-vue=...` 解码读回，让子应用直接恢复到 `/detail/5?tab=info`。

</v-click>

<!--
无论 history 模式还是 hash 模式，子应用路由操作的都是 iframe 原生 history。wujie 劫持 pushState/replaceState，把 path+query+hash 编码后挂主应用 query，key = 子应用 name。
-->

---

# 开启同步：sync

同步默认关闭，用 `sync: true` 开启；多子应用可同时同步

<v-click>

```js
// 命令式
startApp({
  name: "app-vue",
  url: "//localhost:7100/",
  el: "#sub-container",
  sync: true, // 开启路由同步：子应用路由 ↔ 主应用 URL query
});
```

```vue
<!-- 组件式 -->
<WujieVue name="app-vue" :url="url" :sync="true" />
```

</v-click>

<v-click>

> **多个子应用可同时同步** —— 各自用自己的 `name` 作 key 挂主应用 query，互不干扰：`https://main.app/?app-vue=%2Fa&app-react=%2Fb`。浏览器前进后退（v2.0 支持）会正确驱动对应子应用路由。

</v-click>

<!--
sync 默认 false。命令式和组件式两种写法。多子应用各用自己的 name 作 key，URL 上可挂多个 ?a=...&b=...，互不干扰。
-->

---

# 单向同步：最容易踩的语义坑

路由同步**最关键、最反直觉**的一条，务必记牢

<v-click>

> 官方原文：只有无界实例在**初次实例化**时才会从 url 读回路由信息，一旦实例化完成，后续只会**单向**地将子应用路由同步到主应用 url 上。

</v-click>

<v-click>

- **初次实例化**：从主应用 URL query 读回子应用路由（用于刷新/分享恢复）—— 这是**唯一一次** URL → 子应用方向
- **实例化之后**：只有**子应用路由 → 主应用 URL** 一个方向。你用 JS 改地址栏的 `?app-vue=...`，**不会**反向驱动子应用跳路由

</v-click>

<v-click>

> 所以「主应用想控制子应用跳路由」**不能靠改 URL query**，要走通信（`props` 传目标路由 / EventBus 广播指令）。尤其**保活模式**下改 `url` 也不触发跳转。

</v-click>

<!--
这是路由同步最反直觉的语义。主控子跳转必须走通信通道，不能靠改 URL。保活模式下改 startApp 的 url 参数同样不触发子应用路由跳转。
-->

---

# prefix：给 URL 瘦身

子应用路由前缀往往很长，`prefix` 让你用短标识替换长前缀

<v-click>

```js
startApp({
  name: "app-vue", url: "//localhost:7100/", el: "#sub-container", sync: true,
  // prefix：把长前缀映射成短 key（配置时去掉域名部分）
  prefix: { prod: "/example/prod", test: "/example/test" },
});
```

</v-click>

<v-click>

| 子应用真实路由 | 主应用 URL 里显示 |
| --- | --- |
| `/example/prod/hello` | `{prod}/hello` |
| `/example/test/name` | `{test}/name` |
| `/example/prod/debug?id=5` | `{prod}/debug?id=5` |

</v-click>

<v-click>

> 同步时 wujie **匹配最长可用前缀**做替换，读回时反向展开成完整路由。`prefix` 纯粹是「URL 显示瘦身」，**不改变子应用实际路由**。

</v-click>

<!--
prefix 把冗长的子应用路由前缀替换成短标识，缩短主应用 URL。匹配最长前缀，读回时反向展开。不影响子应用真实路由，纯显示层瘦身。
-->

---
layout: section
---

# 保活与预加载

三模式 + preloadApp 预执行 + fiber 分片 —— 秒开秒切的代价是内存

---

# 三种运行模式总览

取决于两个开关：`alive` 是否 `true`、子应用是否写生命周期

<v-click>

| 模式 | 配置 | 切走时 | 切回时 | 状态 | 改造 |
| --- | --- | --- | --- | --- | --- |
| **保活 keep-alive** | `alive: true` | WC+iframe **都留内存** | 缓存 WC **挂回** | **全留** | 零改造 |
| **单例 singleton** | `alive:false` + 生命周期 | `__WUJIE_UNMOUNT` 销毁实例 | `__WUJIE_MOUNT` 重建 | 不留 | 写生命周期 |
| **重建 rebuild**（默认） | 都不配 | 销毁 **WC+iframe** | 全量重建 | 不留 | 零改造 |

</v-click>

<v-click>

> 一句话选择：**要状态不丢、切换最快** → 保活；**要每次全新实例、复用 iframe/沙箱** → 单例；**最省内存、每次全新** → 重建（默认）。

</v-click>

<!--
三档模式由 alive 和是否写生命周期两个开关决定。保活状态全留、切换秒切；单例每次全新实例；重建默认最省内存但每次全量重建。
-->

---

# 保活模式：切换秒切、状态不丢

wujie 的招牌能力：`alive: true` 后子应用**渲染一次就常驻**

<v-click>

```js
// 保活模式：子应用状态（表单、滚动位置、路由）切走切回都不丢
startApp({
  name: "app-form",
  url: "//localhost:7100/",
  el: "#sub-container",
  alive: true, // 保活：渲染一次，切换不销毁
});
```

</v-click>

<v-click>

- **状态全留**：内部数据、组件状态、**子应用路由**都不随切换丢失 —— 填了一半的表单、滚到一半的列表，切走再回来原样还在
- **切换秒切**：切回不是重新加载，而是把内存里现成的 WC 挂回 DOM，几乎无感
- **改 `url` 不跳路由**：保活下改 `url` 不触发跳转，控制子应用跳转得走通信
- **后台仍活着**：不在前台也**仍响应 `bus` 事件**（JS 一直在 iframe 里跑），既是能力也是内存/CPU 成本

</v-click>

<!--
切走时 wujie 不销毁 WC 和 iframe，只把 WC 从 DOM 摘下留内存；切回把缓存的 WC 挂回。状态全留、切换秒切是招牌，代价是常驻内存、后台仍跑 JS。
-->

---

# 单例与重建

同 name 共享实例 vs 每次全量重建

<v-click>

```js
// 单例模式：alive:false 且子应用实现生命周期
window.__WUJIE_MOUNT = () => render(); // 进入：建实例并挂载
window.__WUJIE_UNMOUNT = () => instance.unmount(); // 离开：销毁实例
```

</v-click>

<v-click>

- **单例**：切走 `__WUJIE_UNMOUNT` 销毁实例、切回 `__WUJIE_MOUNT` 建全新实例；**改 `url` 会触发真实路由跳转**；多菜单同 `name` **共享同一 iframe 沙箱**、导航到不同路由 —— 适合「同一子应用、多个入口」
- **重建（默认）**：每次切换 WC（DOM）+ iframe（JS）**双双销毁**，下次进入全量重建 —— 最省内存、隔离最干净，但每次进入有加载渲染开销

</v-click>

<v-click>

> 需要手动全量重建刷新时，用 `refreshApp()`（**v2.1.0 新增**）。

</v-click>

<!--
单例改 url 会跳路由（不像保活）；多菜单同 name 共享实例。重建模式最省内存，非 webpack 老项目切换可能白屏，官方建议这类项目用保活。refreshApp 是 v2.1.0 新增的编程式全量刷新。
-->

---

# preloadApp：预加载与预执行

保活解决「切回快」，预加载/预执行解决「第一次进也快」

<v-click>

```js
// 主应用启动后：空闲期预加载子应用
import { preloadApp } from "wujie";

preloadApp({
  name: "app-vue",
  url: "//localhost:7100/",
  exec: true, // 预执行：不止下载资源，还提前把子应用渲染出来
  // 不配 exec 则只「预加载」：空闲期把 HTML/JS/CSS 拉进缓存
});
```

</v-click>

<v-click>

- **预加载（不配 `exec`）**：浏览器**空闲期**用 `requestIdleCallback` 把子应用**静态资源（HTML/JS/CSS）下载进内存缓存**，用户真进入时资源已就绪，省下载时间
- **预执行（`exec: true`）**：更进一步**提前把子应用渲染出来**（执行 JS、建 DOM），用户进入几乎是「现成的」直接展示，最逼近秒开

</v-click>

<!--
preloadApp 在用户还没进入前就提前准备。两个层次：预加载只拉资源进缓存；预执行还提前渲染。配合空闲期 requestIdleCallback，不抢主线程。
-->

---

# fiber：别让预执行卡住主线程

预执行要跑 JS、建 DOM，借鉴 React Fiber 把执行**切成小片**插空跑

<v-click>

```js
startApp({
  name: "app-vue",
  url: "//localhost:7100/",
  el: "#sub-container",
  fiber: true, // 默认 true：分片执行 JS，不阻塞主线程
});
```

</v-click>

<v-click>

- **`fiber: true`（默认）**：分片执行，适合预执行、后台预加载等「不希望卡住主应用」的场景
- **`fiber: false`**：一次性执行 —— 官方建议**在主应用初始化时就要加载的子应用**设 `false`（此时主应用本就在忙初始化，分片反而拖慢子应用就绪）

</v-click>

<!--
预执行可能长时间占用主线程导致卡顿，fiber 把子应用 JS 切成小片插空执行。默认 true；主应用初始化即加载的子应用建议 false。
-->

---

# 秒开的代价：内存账

「预加载 + 预执行 + 保活」本质是**用内存换时间** —— 要心里有本账

<v-click>

| 手段 | 换来 | 代价 |
| --- | --- | --- |
| 预加载 | 省下载时间 | 内存里多份资源缓存 |
| 预执行（`exec`） | 省首次渲染时间 | 提前常驻一个 iframe + WebComponent |
| 保活（`alive`） | 切换秒切、状态不丢 | 子应用**永久常驻**内存、后台仍跑 JS |

</v-click>

<v-click>

> 因隔离靠 iframe，每个被预执行/保活的子应用都常驻一个 iframe。**高频往返、状态重**的子应用开保活/预执行；**低频、一次性**的走默认重建。资源更新后用 `clearAssetsCache()` 清缓存强制重取（可传 `host` 精确清）。

</v-click>

<!--
同屏保活的子应用越多内存越高，不能无脑全开。按子应用冷热取舍。缓存按 host 管理，clearAssetsCache 可全清或清指定子应用。
-->

---
layout: section
---

# 通信

props 父传子 · window 直通 · 去中心化 EventBus，三者都建在「iframe 同域」上

---

# 三种通信方式总览

先看全景，三种通信各有其位

<v-click>

| 方式 | 方向 | 机制 | 适用 |
| --- | --- | --- | --- |
| **`props`** | 父 → 子 | 主应用注入、子应用 `$wujie.props` 读 | 传初始数据 / 回调方法，最简单 |
| **`window` 直通** | 双向 | 同域 iframe，`window.parent` / `contentWindow` 直接访问 | 同域直读写对方全局，轻量 |
| **EventBus `bus`** | 任意 | 去中心化事件总线，发布订阅 | 多应用、多向、解耦广播 |

</v-click>

<v-click>

> 这三种落地都建立在一个物理前提上：**wujie 的 iframe 与主应用同域** —— 所以 `window.parent`、`contentWindow`、共享 `bus` 实例才可能直接工作，跨域会被同源策略拦死。

</v-click>

<!--
三种通信：props 最简单的父传子、window 直通同域特权、EventBus 去中心化广播。都建在 iframe 同域这个物理前提上。
-->

---

# props：父传子首选

主应用把数据和方法通过 `props` 注入，子应用从 `window.$wujie.props` 取

<v-click>

```js
// 主应用（命令式）：注入数据与方法
startApp({
  name: "app-vue",
  url: "//localhost:7100/",
  el: "#sub-container",
  props: {
    userInfo: { name: "Ada", role: "admin" }, // 传数据
    onLogout: () => store.logout(), // 传方法（子应用可回调主应用）
  },
});

// 子应用：读取主应用注入的 props
const props = window.$wujie?.props; // { userInfo, onLogout }
props.onLogout(); // 回调主应用的方法
```

</v-click>

<v-click>

> `props` 里既能传数据、也能传函数 —— 传函数就实现了「子应用回调主应用」的反向通道。适合初始配置、用户信息、主应用能力下发这类父传子场景。

</v-click>

<!--
props 是最简单最常用的父传子通道。组件式用 <WujieVue :props> 注入。传函数即反向回调通道。
-->

---

# window 直通：同域的特权

iframe 与主应用**同源**，两边可直接访问对方的 `window`

<v-click>

```js
// 主应用访问子应用的全局：通过 iframe 的 contentWindow
// 每个子应用的 iframe 的 name 就是它的 name
const subWin = document.querySelector("iframe[name=app-vue]").contentWindow;
subWin.someSubGlobal; // 直接读子应用挂在其 window 上的全局

// 子应用访问主应用的全局：通过 window.parent
window.parent.someMainGlobal; // 直接读主应用全局
```

</v-click>

<v-click>

> 这条通道**直接、轻量、无需约定协议**，但**耦合最紧**（两边硬编码对方全局名）。适合简单临时直连；复杂、多应用、要解耦的场景优先 EventBus。

</v-click>

<v-click>

> 注意：子应用里 `window` 是**被代理的沙箱 window**，`window.parent` 才是主应用真实 window；要拿子应用**未被代理的真实 window** 用 `window.__WUJIE_RAW_WINDOW__`。

</v-click>

<!--
同域 iframe 特权：window.parent / contentWindow 直接互访。跨域会被 SOP 拦死。直接但耦合紧。子应用真实 window 用 __WUJIE_RAW_WINDOW__。
-->

---

# EventBus：去中心化广播

内置去中心化事件总线 `bus`，API 仿 Vue、支持链式，任意方向广播

<v-click>

```js
// 主应用：引入 bus（从 wujie 或 WujieVue/WujieReact 上取）
import { bus } from "wujie";

bus.$on("sub-event", (arg1, arg2) => { // 监听子应用发来的事件
  console.log("收到子应用消息", arg1, arg2);
});
bus.$emit("main-event", { theme: "dark" }); // 向子应用广播
bus.$off("sub-event", handler); // 卸载时移除监听，防重复订阅

// 子应用：用 window.$wujie.bus，同一套 API
window.$wujie?.bus.$on("main-event", (payload) => console.log(payload.theme));
window.$wujie?.bus.$emit("sub-event", "hello", 42);
```

</v-click>

<v-click>

> **WujieVue 语法糖**：子应用 `bus.$emit("routeChange", ...)` 发的事件，主应用可直接在组件上 `@routeChange="handler"` 监听，省去手动 `bus.$on`。

</v-click>

<!--
bus 不分父子，任意应用都能 emit 发、on 收，天然支持子应用之间、多应用广播。主应用 import { bus }，子应用 window.$wujie.bus，同一套 API。WujieVue 里可用 @event 直接监听。
-->

---

# bus 方法全表与防泄漏

`bus` 是全局单例、跨子应用生命周期存在

<v-click>

| 方法 | 签名 | 作用 |
| --- | --- | --- |
| `$emit` | `(event, ...args) => bus` | 广播事件（链式） |
| `$on` | `(event, fn) => bus` | 监听事件 |
| `$off` | `(event, fn) => bus` | 移除某监听 |
| `$once` | `(event, fn) => void` | 一次性监听，触发后自动移除 |
| `$onAll` / `$offAll` | `(fn) => bus` | 监听/移除**所有**事件（回调首参是事件名） |
| `$clear` | `()` | 清空所有订阅 |

</v-click>

<v-click>

> **务必手动 `$off`**：子应用销毁时 wujie 会自动清订阅，但**保活模式**下子应用长期存活，每次 `activated` 都 `$on` 而不 `$off` 会累积重复订阅 —— 稳妥做法是在卸载钩子里手动 `$off`。

</v-click>

<!--
bus 七个方法，$onAll 监听所有事件回调首参是事件名。防泄漏关键：保活子应用不销毁，反复 $on 容易累积重复订阅，卸载钩子里手动 $off。
-->

---
layout: section
---

# v2.0 与现状

2026-06 复活、连发 4 版 —— iframe 路线在「隔离 + Vite」两维度独一档

---

# 连发 4 版：2026-06 复活时间线

v1 沉寂多年后，2026-06 v2.0「全新空白同域 iframe 沙箱」复活、月内连发 4 版

<v-click>

| 时间 | 版本 | 关键内容 |
| --- | --- | --- |
| 2021~2023 | **v1.0.0 → v1.0.29** | v1 线，iframe+WC 路线成型，此后长期沉寂 |
| 2026-06 初 | **v2.0.0** | **全新空白同域 iframe 沙箱**，支持浏览器前进后退 |
| 2026-06-03/04 | **v2.0.1 / v2.0.2** | v2.0 沙箱问题持续修复迭代 |
| 2026-06-15 | **v2.1.0** | 修 `destroy` 竞态**内存泄漏**、新增 **`refreshApp`**、内联事件子应用作用域执行、修异步 CSS 重复 |

</v-click>

<v-click>

> v2.1.0 四条变更都在**补 iframe 路线最敏感的短板**（内存泄漏、样式重复、作用域归属）—— 认真维护而非刷版本号的信号。

</v-click>

<!--
v1 迭代到 v1.0.29 后长期沉寂，一度被认为停更。2026-06 v2.0 复活并月内连发 4 版，是「复活」而非「昙花」的信号。v2.1.0 修了 destroy 竞态内存泄漏、新增 refreshApp。
-->

---

# 选型定位：wujie 的三个「最」

放进 2026 微前端选型全景，wujie 的定位非常清晰

<v-click>

- **隔离最强**：iframe 物理隔离，子应用有独立原生 `window`/`history`/`location`，不像 Proxy 软沙箱「防意外不防恶意」
- **Vite/ESM 最友好**：ESM 交 iframe 里浏览器原生执行，**零改造接 Vite 子应用** —— 这正是 qiankun 2.x 的最大痛点
- **保活预加载秒开最顺**：原生 `alive` 保活 + `preloadApp` 预加载/预执行，切换秒切、首进秒开

</v-click>

<v-click>

> **甜区**：子应用复杂（大型 SPA、强样式/强全局副作用，需强隔离兜底）+ 技术栈是 Vite + 追求切换/首屏体验。反过来，**轻量子应用、极致省内存、单页嵌很多小应用**，iframe 内存开销就不划算。

</v-click>

<!--
三个「最」：隔离最强、Vite 最友好、保活预加载秒开最顺。甜区是复杂子应用 + Vite + 强隔离。轻量多应用场景 iframe 开销不划算，此时软沙箱更轻。
-->

---

# 与 micro-app 的对比

两个「Vite 友好、组件化用法」的热门方案，路线**同中有异**

<v-click>

| 维度 | wujie | micro-app |
| --- | --- | --- |
| **用法** | 组件 `<WujieVue>` / `<wujie>` 自定义元素 | 自定义元素 `<micro-app name url>` |
| **默认 JS 沙箱** | **iframe 物理沙箱**（最强、最重） | **with/Proxy 软沙箱**（更轻，也有 iframe 模式） |
| **隔离强度** | 最强（物理） | 较强（软沙箱为主） |
| **内存开销** | 每应用一 iframe，较高 | 软沙箱模式较低 |
| **保活** | 原生 `alive` | 支持 `keep-alive` |

</v-click>

<v-click>

> 都主打「组件化 + Vite 友好」，但 **wujie 默认把隔离拉满**（iframe、代价内存），**micro-app 默认更轻**（软沙箱、隔离弱一档）。

</v-click>

<!--
wujie 和京东 micro-app 常被放一起比。都组件化 Vite 友好，但 wujie 默认 iframe 物理沙箱最强最重，micro-app 默认 with/Proxy 软沙箱更轻。micro-app 具体实现属它自己的叶。
-->

---

# 局限：iframe 路线的代价

强隔离不是白来的，选型时要正视这些**结构性代价**

<v-click>

- **内存与启动开销**：每个子应用（尤其保活/预执行的）常驻一个 iframe + WebComponent + JS 运行时，同屏多子应用内存占用高
- **同域约束**：子应用直接操作 `location` 可能替换掉 iframe 导致「跨域 frame 访问被拦」，须改用 `window.$wujie.location`，Vite 子应用尤其注意
- **弹窗与 Shadow DOM**：Popper 弹窗定位、`@font-face` 字体需按常见问题处理
- **第三方全局变量**：脚本在 iframe 闭包里执行，库的全局声明可能不挂 window，需 `window.xxx = ...` 显式挂载
- **降级体验**：老浏览器 `degrade` 回退 iframe 直接渲染，弹窗无法覆盖全屏

</v-click>

<!--
五条结构性代价都源于 iframe 路线：内存/启动开销、同域约束、弹窗 Shadow DOM 逃逸、第三方全局变量需显式挂 window、降级体验。选型时明码标价。
-->

---

# 选型决策：何时用 wujie、何时别用

wujie 不是万能钥匙，是「用内存换隔离与体验」的**特化选择**

<v-click>

| 你的情况 | 倾向 | 原因 |
| --- | --- | --- |
| 子应用是 **Vite/ESM** 技术栈 | **✅ wujie** | ESM 交 iframe 浏览器原生执行，零改造 |
| 子应用**复杂、强全局副作用**，要强隔离兜底 | **✅ wujie** | iframe 物理隔离最强 |
| 高频往返、**要状态不丢 / 秒切** | **✅ wujie** | 原生 `alive` 保活 + 预加载秒开 |
| 单页要嵌**很多个轻量小应用** | **⚠️ 慎选** | 每应用一 iframe，内存开销叠加 |
| 存量 **webpack**、要开箱即用 | ➡️ qiankun | 生态成熟、软沙箱省内存 |
| 要**更轻的软沙箱** + 组件化 | ➡️ micro-app | with/Proxy 软沙箱，内存更省 |

</v-click>

<v-click>

> 实践准则：**先问技术栈**（Vite → wujie 天然友好）、**再问隔离需求**（越复杂越偏 wujie）、**最后算内存账**（并存越多越轻，iframe 开销越不划算）。

</v-click>

<!--
一张可直接对照的决策表。先问技术栈、再问隔离需求、最后算内存账。选型全景（六框架横向对比）见微前端基础·2026 选型全景。
-->

---
layout: center
class: text-center
---

# 小结

wujie = iframe 跑 JS + WebComponent 渲 DOM 的双容器路线

<v-click>

- **双容器**：JS 在同域 iframe（原生 window/history/location、物理隔离），DOM 在 `<wujie>` shadowRoot（弹窗全屏、样式隔离），`document` 代理桥接
- **iframe 沙箱**：物理隔离、免 Proxy/with 税、ESM 原生执行；v2.0 全新空白同域沙箱支持前进后退
- **路由同步**：劫持 iframe `history` 投影到主应用 query；**单向同步**（仅初次实例化读回）
- **保活预加载**：保活/单例/重建三模式 + `preloadApp` 预执行 + `fiber` 分片，秒开秒切换内存
- **通信**：`props` 父传子 / `window` 直通 / 去中心化 `bus` 广播
- **现状**：2026-06 v2.0 复活连发 4 版，甜区「复杂子应用 + 强隔离 + Vite」

</v-click>

<v-click>

> 隔离最强 + Vite 原生友好 + 保活预加载秒开 —— 代价是每应用一 iframe 的内存开销。

</v-click>

<!--
六点收束全章：双容器心智、iframe 沙箱、路由同步、保活预加载、通信、v2.0 现状。wujie 代表一条与 Proxy 软沙箱正交的技术路线，用内存换隔离与体验。
-->

---
layout: center
class: text-center
---

# 谢谢

wujie 无界 · iframe JS 沙箱 + WebComponent 容器 · 隔离最强、Vite 原生友好

<div class="mt-8 text-gray-400">
基于 wujie v2（2026-06 复活） · 面向前端工程师
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/architecture/micro-frontend/wujie/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
全章覆盖双容器心智、iframe JS 沙箱、WebComponent 渲染、路由同步、保活预加载、通信、v2.0 复活与选型。配套笔记见文档图标链接。感谢观看。
-->
