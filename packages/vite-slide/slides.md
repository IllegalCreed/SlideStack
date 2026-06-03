---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Vite
info: |
  Presentation Vite — the next generation frontend build tool.

  Learn more at [https://vite.dev](https://vite.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">⚡</span>
</div>

<br/>

## Vite — 下一代前端构建工具

开发态用浏览器原生 ESM 按需供给源码、秒级启动；生产态用 Rolldown 打包优化。Vite 8 用单一 Rust 工具链统一了开发与构建（Evan You 创建 / 社区维护，当前 v8.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/vitejs/vite" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Vite —— Evan You 创建、社区团队维护的现代前端构建工具，读音 /vit/，法语「快」。

一句话定位：它由两部分组成 —— 一个基于浏览器原生 ESM 的开发服务器（秒级启动 + 极快 HMR），
和一条用 Rolldown 打包的构建命令。Vite 8 是一次架构跃迁，用单一 Rust 工具链统一了 dev 与 build。

如今几乎所有现代框架的官方脚手架、主流元框架（Nuxt/SvelteKit/Astro）都构建在 Vite 之上，它是事实标准。

顺序：为什么需要它 → 核心原理 → 创建项目 → Vite 8 里程碑 → 内置特性 → 配置 → 预构建 →
生产构建 → 环境变量 → 插件 → 高级能力 → 踩坑 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么需要 Vite？

传统打包式 dev server 的痛点：

<v-clicks>

- **启动慢**：必须先打包整个应用才能服务，应用越大等越久
- **热更新慢**：改一个文件常要重建一大片
- **构建慢**：JS 写的打包器在大型项目上吃力

</v-clicks>

<div v-click class="mt-6">

Vite 的答案：

- 开发态 **原生 ESM 按需** —— 启动与项目大小**解耦**
- HMR 只更新**变动模块**，毫秒级
- 构建用 **Rolldown（Rust）**，最快提速 10–30×

</div>

<!--
Vite 诞生于对「打包式 dev server 慢」的不满。传统工具必须先把整个应用打包才能启动 dev server，
应用越大启动越久、热更新越钝。Vite 换了思路：开发期不整体打包，用浏览器原生 ESM 按需供给，
所以冷启动几乎与项目大小无关；HMR 也只更新变动的那个模块。生产构建则用 Rust 写的 Rolldown，远快于 JS 打包器。
-->

---

# 核心原理：依赖 vs 源码

Vite 把模块分两类，区别对待：

| | 依赖 | 源码 |
|---|---|---|
| 特点 | 很少变、数量大 | 频繁改、单文件小 |
| 做法 | **预构建一次**，强缓存 | 原生 ESM **按需**转换 |
| 收益 | 避免成百上千请求 | 启动不打包，秒级 |

<div v-click class="mt-4">

> 生产为什么还要打包？未打包的嵌套 import 在生产会带来大量网络往返，仍低效 —— 所以 build 仍做打包 + tree-shaking + 代码分割。

</div>

<!--
这是 Vite 速度的核心洞察。依赖（如 lodash-es 有 600+ 内部模块）很少变动，预构建一次合并成少量文件、强缓存；
源码频繁改动，就用原生 ESM 按需转换，浏览器请求哪个才编译哪个。

注意一个常见误解：「既然能用原生 ESM，生产为什么还打包？」——因为生产环境嵌套 import 的网络往返开销很大，
所以生产仍需打包优化。原生 ESM 只适用于开发。
-->

---
layout: two-cols-header
---

# 安装与创建项目

::left::

**脚手架创建**

```bash
# npm（注意 -- 分隔）
npm create vite@latest my-app \
  -- --template vue-ts

# pnpm / yarn / bun 无需 --
pnpm create vite my-app \
  --template react-ts
```

::right::

**8 类官方模板**（各含 `-ts`）

```text
vanilla  vue   react  preact
lit      svelte solid  qwik
```

**手动接入**

```bash
pnpm add -D vite
npx vite   # 默认 5173 端口
```

<!--
创建项目首选官方脚手架 create-vite。最大的坑在 npm：npm 7+ 必须用 -- 把 --template 透传给脚手架，
否则参数会被 npm 吞掉；pnpm/yarn/bun 不需要这个 --。

官方内置 8 个框架族，每个都有纯 JS 和 -ts 变体。也可以手动 pnpm add -D vite，
以根目录 index.html 作为入口，npx vite 启动，默认端口 5173（不是 3000）。
-->

---

# Vite 8 里程碑：Rolldown 统一

Vite 8（2026 稳定）用 **Rolldown + Oxc** 统一了工具链：

| 维度 | Vite ≤7 | **Vite 8** |
|---|---|---|
| 开发转译 | esbuild | **Oxc** |
| 生产打包 | Rollup | **Rolldown** |
| 依赖预构建 | esbuild | **Rolldown** |
| JS 压缩 | esbuild | **oxc** |
| CSS 压缩 | esbuild | **Lightning CSS** |
| 构建配置 | `rollupOptions` | **`rolldownOptions`** |

<div v-click class="mt-3 text-sm">

Vite 6/7 也可用包别名 `npm:rolldown-vite` 提前 opt-in（注意 pin 版本）。

</div>

<!--
Vite 8 最大的变化是打包内核统一。过去 dev 用 esbuild、prod 用 Rollup 两套工具，行为难免有差异；
Vite 8 用 Rust 写的 Rolldown 一套贯穿 dev、build、预构建，并用 Oxc 接管转译与压缩、Lightning CSS 压缩 CSS。
配置项也随之改名 rollupOptions → rolldownOptions（旧名废弃保留）。这是当前最高频的版本考点。
-->

---

# 开箱即用的内置特性

无需任何插件即可使用 —— **先查 Features，再找插件**：

<v-clicks>

- **TypeScript / JSX**：内置转译（Oxc）；但**只转译不类型检查**，需另跑 `tsc --noEmit`
- **CSS**：导入即注入 + HMR、CSS Modules、Sass/Less/Stylus 预处理器
- **静态资源**：`?url` / `?raw`、JSON 命名导入、`public/` 目录
- **批量导入**：`import.meta.glob('./dir/*.js')`
- **Worker / Wasm**：`?worker`、`?init` 约定

</v-clicks>

<!--
Vite 的一个理念：很多你以为要装插件的能力其实已内置。TypeScript、JSX、CSS（含 Modules 与预处理器）、
静态资源、import.meta.glob 批量导入、Web Worker、WebAssembly 全部开箱即用。

唯一要记住的 TS 心智：Vite 只转译不做类型检查，类型错误不会让 build 失败，要自己跑 tsc --noEmit。
框架相关的能力（Vue SFC、React Fast Refresh）才需要对应官方插件。
-->

---

# 配置文件 vite.config.ts

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ command, mode }) => ({
  plugins: [vue()],
  resolve: { alias: { "@": "/src" } },
  server: { port: 5173, proxy: { "/api": "http://localhost:3000" } },
  build: {
    target: "baseline-widely-available", // Vite 8 默认
    rolldownOptions: {}, // ≤7 是 rollupOptions
  },
}));
```

<div v-click class="mt-2 text-sm">

导出**函数**可拿到 `command`（serve/build）、`mode` 做条件配置。

</div>

<!--
配置文件是 vite.config.ts，用 defineConfig 包裹拿到类型提示。它可以导出一个对象，
也可以导出函数 —— 函数能拿到 command（dev/preview 是 serve、生产是 build）和 mode 做条件配置。
常用块：plugins、resolve.alias、server.proxy、build。注意 Vite 8 用 rolldownOptions。
一个易忘点：.env 不会自动进 vite.config 的 process.env，配置里读 env 要手动 loadEnv。
-->

---
layout: two-cols-header
---

# 依赖预构建

::left::

**为什么要预构建？**

- CommonJS/UMD → ESM（浏览器原生不认裸模块）
- 合并内部模块减请求（`lodash-es` 600+ 模块）

缓存在 `node_modules/.vite`。

::right::

**缓存何时失效？**

- lockfile 变化
- `patches` 改动
- `vite.config` 相关字段
- `NODE_ENV` 变化

```bash
vite --force   # 强制重建
```

<!--
首次启动 dev server，Vite 会预构建依赖，两大动因：一是把 CommonJS/UMD 转成 ESM，
二是把内部模块多的依赖合并成单文件减少请求。产物缓存在 node_modules/.vite，强缓存。

缓存失效只看四样：lockfile、patches、config 相关字段、NODE_ENV。
一个常见坑：pnpm link 进来的本地包改了源码不会触发重建，必须 vite --force。
-->

---

# 生产构建

```bash
vite build      # → dist/，默认 minify=oxc
vite preview    # 本地预览，默认 4173 端口（非生产服务器）
```

<v-clicks>

- **`build.target`**：默认 `baseline-widely-available`；只做语法转换**不 polyfill**，老浏览器用 `@vitejs/plugin-legacy`
- **压缩**：Vite 8 默认 `oxc`，比 terser 快 30–90×
- **库模式** `build.lib`：单入口默认 `['es','umd']`，外部化依赖用 `external` + `globals`

</v-clicks>

<!--
vite build 产出可托管的静态资源，默认用 oxc 压缩。vite preview 在 4173 本地预览，注意它不是生产服务器。

build.target 默认 baseline-widely-available，对应约 2.5 年前的浏览器；Vite 只做语法转换不提供 polyfill，
要支持老浏览器得上 plugin-legacy。库作者用 build.lib 一条配置产出多格式 npm 库，外部化 peer 依赖。
-->

---

# 环境变量与 mode

```ts
import.meta.env.MODE      // 当前模式
import.meta.env.PROD      // 是否生产
import.meta.env.VITE_API  // 仅 VITE_ 前缀暴露给客户端
```

<div class="grid grid-cols-2 gap-4 mt-2">
<div>

**.env 加载顺序**（后覆盖前）

```text
.env
.env.local
.env.[mode]
.env.[mode].local
```

</div>
<div>

**mode ≠ NODE_ENV**

- mode 决定加载哪个 `.env.[mode]`
- NODE_ENV 决定 `PROD`/`DEV`

</div>
</div>

<!--
客户端环境变量走 import.meta.env，内置 MODE/BASE_URL/PROD/DEV/SSR 五个常量。
关键安全规则：只有 VITE_ 前缀的变量暴露给客户端，且会硬编码进产物，绝不能放密钥。

.env 有四个文件、后者覆盖前者，*.local 要进 gitignore。最易混淆的是 mode 和 NODE_ENV 是两个独立概念：
mode 决定加载哪些 .env 文件，NODE_ENV 决定 PROD/DEV 的值。
-->

---

# 插件系统

```ts
export default defineConfig({
  plugins: [
    vue(),
    { ...image(), enforce: "pre" },   // 核心插件之前
    { ...analyze(), apply: "build" }, // 仅构建期
    isDev && devPlugin(),             // falsy 自动忽略
  ],
});
```

<v-clicks>

- 建立在 **Rollup/Rolldown 插件接口**上，多数 Rollup 插件可直接用
- 通用钩子 `resolveId` / `load` / `transform`；Vite 专属 `config` / `configureServer` / `transformIndexHtml` / `handleHotUpdate`

</v-clicks>

<!--
Vite 插件建立在 Rollup/Rolldown 接口之上，所以很多 Rollup 插件能直接用。plugins 数组里：
enforce 控制相对核心插件的顺序，apply 限定 build/serve 阶段，falsy 值自动忽略（方便条件启停）。

钩子分两类：通用的 resolveId/load/transform，以及 Vite 专属的 config、configureServer、
transformIndexHtml、handleHotUpdate。虚拟模块用 \0 前缀约定。
-->

---

# 高级能力一览

<v-clicks>

- **SSR**：内置中间件模式，开发期 `ssrLoadModule` 转 ESM 给 Node；生产两次构建（client + server）+ `ssrManifest`
- **后端集成**：传统后端渲染 HTML、Vite 服务资源；生产据 `manifest.json` 注入
- **Environment API**（Vite 6+，RC）：把 client / ssr / edge 等环境形式化，为框架作者提供统一多环境构建
- **Rolldown 内核**：原生处理 CJS、`enableNativePlugin`、`withFilter` 适配

</v-clicks>

<div v-click class="mt-4 text-sm opacity-75">

这些是框架作者与复杂工程才用到的深水区，日常应用多数用不到。

</div>

<!--
Vite 还有面向框架作者的深水区：内置 SSR（中间件模式 + 两次构建 + ssrManifest）、
后端集成（配合 Rails/Laravel）、Vite 6 引入的 Environment API（把多运行时环境形式化，RC 状态）、
以及 Rolldown 内核带来的原生 CJS 处理与原生插件。日常应用开发多数用不到这些，了解即可。
-->

---

# 常见坑 & Tips

<v-clicks>

- **桶文件（barrel）拖慢 dev**：`import {x} from './utils'` 会拉整个目录 → 直接指向具体文件
- **HMR 失效/整页重载**：检查 import **大小写**、打破循环依赖
- **构建产物别 `file://` 打开**：CORS 报错，用 `vite preview`
- **`Failed to fetch dynamic import`**：多因部署后旧 chunk 没了 → HTML 配 `no-cache`
- **类型检查要自己跑**：`tsc --noEmit`（Vite 不检查）

</v-clicks>

<!--
几个高频坑：一，桶文件（barrel file）是 dev 变慢的隐形元凶，从 index.js 统一导出会拉取整个目录，
应直接 import 具体文件。二，HMR 失效常因 import 大小写不一致或循环依赖。三，构建产物不能 file:// 双击打开，会 CORS。
四，部署后偶发 Failed to fetch dynamic import，多因旧 chunk 没了，要给 HTML 配 no-cache。
五，记得 Vite 不做类型检查，要自己跑 tsc --noEmit。
-->

---
layout: intro
---

# 总结

Vite = **原生 ESM dev server** + **Rolldown build**

- 秒级启动、毫秒级 HMR，体验与项目大小解耦
- Vite 8 用 Rust 工具链统一 dev / build
- 开箱即用 TS / CSS / JSX / 静态资源
- 现代前端构建的**事实标准**

<div class="mt-6 text-sm">

📖 [vite.dev](https://vite.dev) ·
<carbon:logo-github /> [vitejs/vite](https://github.com/vitejs/vite)

</div>

<!--
总结一句：Vite 是「原生 ESM 开发服务器 + Rolldown 构建」的组合，带来秒级启动和毫秒级 HMR，
体验与项目大小解耦；Vite 8 用 Rust 工具链统一了开发与构建；TS/CSS/JSX/静态资源开箱即用。
它已经是现代前端构建的事实标准。想深入就去 vite.dev 官方文档。谢谢！
-->

---
layout: end
---

# 谢谢观看

<div class="text-xl opacity-80">⚡ Build faster with Vite</div>
