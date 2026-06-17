---
theme: seriph
background: https://cover.sli.dev
title: StackBlitz
info: |
  StackBlitz —— 浏览器里的即时全栈开发环境（基于 WebContainers）。

  Learn more at [https://stackblitz.com/](https://stackblitz.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# StackBlitz

浏览器里的即时全栈开发环境 · 基于 WebContainers

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 {
  background-color: #1389FD;
  background-image: linear-gradient(45deg, #41B9FF 10%, #0D5FCC 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
大家好，今天聊 StackBlitz —— 一个把完整开发环境搬进浏览器标签页的工具。
它最特别的地方在于背后的 WebContainers：Node、终端、npm 全在浏览器里跑，毫秒启动还能离线。
-->

---
transition: fade-out
---

# 什么是 StackBlitz？

由 WebContainers 驱动的即时全栈网页 IDE / playground

<v-clicks>

- **浏览器内**跑完整 Node + 终端 + npm，**毫秒启动、可离线**
- 支持 Vite / Next / Nuxt / SvelteKit 等主流框架
- 最广为人知：嵌入文档 / README 的**可运行代码 demo**

</v-clicks>

<br>

<div v-click>

```bash
# 框架自有短链，打开即写即运行
vite.new   astro.new   nextjs.new   nuxt.new   node.new
```

</div>

<div v-click text-xs>

_Read more about_ [_What is StackBlitz?_](https://developer.stackblitz.com/)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #41B9FF 10%, #0D5FCC 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
StackBlitz 本质是一个在浏览器里就能用的全栈 IDE。

[click] 它在浏览器内跑完整 Node 环境，毫秒启动，甚至断网也能用。
[click] Vite、Next、Nuxt、SvelteKit 这些框架都支持。
[click] 它最常见的用途，是把可运行的代码示例嵌进文档和 README。
[click] 各框架还提供了 vite.new 这类自有短链，点开就是一个可运行项目。
-->

---
transition: fade-out
---

# WebContainers：核心引擎

基于 WebAssembly 的浏览器内"微型操作系统"

<v-clicks>

- Node.js **原生跑在浏览器标签页内**，不是远程容器 / Docker
- 计算在**客户端**：延迟比 localhost 还低、断网可用、不按分钟计费
- 安全沙箱在标签页内；包安装 ≥5×、构建快约 20%

</v-clicks>

<br>

<div v-click>

| 维度 | WebContainers | 传统云容器 / 远程 microVM |
| --- | --- | --- |
| 运行位置 | 浏览器内（WASM） | 远端服务器 |
| 启动 | 毫秒级 | 秒 / 分钟级冷启动 |
| 离线 | 支持 | 依赖网络 |

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #41B9FF 10%, #0D5FCC 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
StackBlitz 的魔法来自 WebContainers。

[click] 它是基于 WebAssembly 的微型操作系统，让 Node 原生跑在浏览器标签页里，而不是连一台远程服务器。
[click] 因为计算在本地，延迟比 localhost 还低，能离线，也不用按分钟付云主机的钱。
[click] 安全性也好，代码都关在标签页沙箱里；性能上包安装至少快 5 倍。
[click] 这张表对比了它和传统云容器的根本差异。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 两套引擎 · 怎么打开

WebContainers（默认）与 EngineBlock（旧版）

::left::

<div v-click>

### 两套运行引擎

- **WebContainers**：完整 Node + npm/pnpm/yarn，几乎所有前后端框架
- **EngineBlock**（旧）：Turbo v1，仅主流前端框架，**不跑完整 Node**

</div>

::right::

<div v-click>

### 打开方式

- `stackblitz.com/edit/<id>`：打开项目
- `stackblitz.com/fork/<id>`：fork 一份副本
- `vite.new` / `astro.new`：框架**自有域名**短链

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #41B9FF 10%, #0D5FCC 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
用之前要知道 StackBlitz 有两套引擎。

[click] 当前默认是 WebContainers，完整 Node，三大包管理器都行，几乎所有框架都支持；旧的 EngineBlock 只能跑主流前端框架，不支持完整 Node 应用。
[click] 打开项目有几种方式：edit 打开、fork 复制，还有各框架自有域名的 .new 短链——注意它们是框架自己的域名，不是 stackblitz.com 的路径。
-->

---
transition: fade-out
---

# 关键限制（必知）

强大但有边界，这些是高频踩坑点

<v-clicks>

- 只能执行 **JS / WASM**；原生 addon 不可用（`--no-addons`）
- 文件系统**内存态、易失**；刷新即丢，未 fork 不持久
- **单实例**：`boot()` 只能调一次，重复会报 `Proxy has been released`
- 网络靠虚拟 TCP → ServiceWorker；npm 装包受 CORS，**缺 `package-lock.json` 易失败**

</v-clicks>

<div v-click text-xs>

_Read more about_ [_troubleshooting_](https://webcontainers.io/guides/troubleshooting)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #41B9FF 10%, #0D5FCC 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
强大之外，它有几条硬边界，几乎每个新手都会撞。

[click] 只能跑 JavaScript 和 WebAssembly，原生 addon 不行。
[click] 文件系统是内存里的，易失，刷新就没；不 fork 也不会持久保存。
[click] 同一时刻只能有一个实例，boot 只能调一次，HMR 误触会报 Proxy has been released。
[click] 网络是虚拟 TCP 映射到 ServiceWorker，npm 装包受 CORS 限制，缺 lockfile 很容易失败。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# 跨域隔离：必配两个响应头

WebContainer 需要 SharedArrayBuffer → 页面必须 cross-origin isolated

::left::

<div v-click>

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy:  same-origin
```

- 不配会报 `self.crossOriginIsolated` 错误
- 线上需 HTTPS（localhost 豁免）

</div>

::right::

<div v-click>

```js
// vite.config.js
export default {
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
}
```

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_configuring headers_](https://webcontainers.io/guides/configuring-headers)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #41B9FF 10%, #0D5FCC 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
想自己嵌入 WebContainer，有一道必过的坎：跨域隔离。

[click] 承载页必须设这两个响应头，因为 WebContainer 依赖 SharedArrayBuffer，而它要求页面跨域隔离；不配就会报 crossOriginIsolated 相关错误，线上还得是 HTTPS。
[click] 以 Vite 为例，在 vite.config 的 server.headers 里加上这两个头即可；Vercel、Netlify、Next 等都有对应写法。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# 嵌入：@stackblitz/sdk

把可运行项目塞进任意网页（约 3kB）

::left::

<div v-click>

```js
import sdk from '@stackblitz/sdk';

const vm = await sdk.embedProject(
  'embed',
  {
    title: 'Demo', template: 'node',
    files: {
      'index.js': "console.log('hi')",
      'package.json': '{ "name": "demo" }',
    },
  },
  { view: 'preview', height: 500 },
);
```

</div>

::right::

<div v-click>

- `embed*` 返回 **VM**；`open*` 跳标签页不返回
- VM 多数方法返回 `Promise<null>`
- URL 参数大小写**混用**：`hidedevtools` 小写、`hideNavigation` 驼峰
- `view` 只有 `default / editor / preview`，**没有 `both`**

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_JavaScript SDK_](https://developer.stackblitz.com/platform/api/javascript-sdk)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #41B9FF 10%, #0D5FCC 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
要把可运行项目嵌进自己的网页，用官方 @stackblitz/sdk，体积约 3kB。

[click] 左边是标准写法：embedProject 把目标元素替换成 iframe，传项目和选项。注意 node 模板的依赖要写进 package.json 文件，不能放 dependencies 字段。
[click] 几个易错点：embed 系列返回 VM，open 系列只是跳转不返回；VM 大多数方法 resolve 的是 null；URL 参数大小写是混的；还有 view 没有 both 这个值，分屏就是 default。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# GitHub 集成

任意仓库前缀 `stackblitz.com/github/` 即开

::left::

<div v-click>

### 打开与同步

- `stackblitz.com/github/{owner}/{repo}`
- `.../tree/{branch|tag|commit}/{folder}` 定位
- push 到 GitHub 后项目**自动同步**（GitHub 为权威源）

</div>

::right::

<div v-click>

### 限制

- 仅能导入含 `package.json` 的项目
- 不支持后端语言（PHP / Python / Java）
- 私有仓库需**付费套餐**

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #41B9FF 10%, #0D5FCC 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
GitHub 集成非常顺手。

[click] 任意仓库 URL 前面加 stackblitz.com/github/ 就能打开，可以用 tree 定位分支、tag、commit 或子目录；导入后还和 GitHub 保持连接，你往 GitHub 一推，项目就自动同步，GitHub 始终是权威源。
[click] 限制也要知道：只能导入含 package.json 的项目，不支持后端语言，私有仓库需要付费套餐。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 套餐 · 与 bolt.new 的关系

选型与计费的关键事实

::left::

<div v-click>

### 套餐（以官方 pricing 为准）

- **免费版**：仅**公开**项目，单文件上传 1MB
- **付费套餐**：解锁**私有**项目 / 仓库 / npm
- **Enterprise**：WebContainer API 商用、自托管、SSO

</div>

::right::

<div v-click>

### bolt.new ≠ 编辑器本体

- bolt.new 是 **AI 应用生成器**（prompt → app）
- 同样建在 WebContainers 上，**未取代**编辑器
- 计费独立（token 体系）

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #41B9FF 10%, #0D5FCC 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
最后是选型和计费。

[click] 套餐结构以官方 pricing 页为准：免费版只能建公开项目、单文件上传上限 1MB；想要私有项目、私有仓库就得上付费套餐；WebContainer API 的商用、自托管和 SSO 属于 Enterprise。
[click] 还要澄清一点：bolt.new 是 StackBlitz 的 AI 应用生成器，用自然语言生成应用，它同样建在 WebContainers 上，但没有取代编辑器本体，而且是独立的 token 计费。
-->

---
layout: intro
transition: fade-out
---

# 结尾

浏览器即开发环境，让"可运行"触手可及

- WebContainers：浏览器内跑完整 Node，毫秒启动、可离线
- 嵌入 SDK：把可运行 demo 放进文档与 README
- GitHub 即开即用，自动同步

<div class="abs-br m-6 text-xl">
  <a href="https://stackblitz.com/" target="_blank" class="slidev-icon-btn">
    <carbon:launch />
  </a>
  <a href="https://github.com/stackblitz/webcontainer-core" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/frontend-develop-tools/online-editor/stackblitz/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #41B9FF 10%, #0D5FCC 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这就是 StackBlitz 的全景。

WebContainers 让浏览器变成完整开发环境，毫秒启动、可离线；嵌入 SDK 让文档里的示例真正能跑；GitHub 即开即用、自动同步。

官网、GitHub 和笔记链接都在右下角，去探索吧！
-->

---
layout: end
---
