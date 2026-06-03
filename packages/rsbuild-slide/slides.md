---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Rsbuild
info: |
  Presentation Rsbuild — the Rspack-powered build tool.

  Learn more at [https://rsbuild.rs](https://rsbuild.rs)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🦀</span>
</div>

<br/>

## Rsbuild — 基于 Rspack 的现代 Web 构建工具

字节 Rstack 出品。底层是 Rust 写的 Rspack，Rsbuild 在其上提供开箱即用零配置 + 语义化配置 API。定位 CRA / Vue CLI / Vite 的替代，比 webpack 快 5–10×（当前 v2.0）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/web-infra-dev/rsbuild" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Rsbuild —— 字节 Rstack 工具链出品，官方定义是基于 Rspack 的现代 Web 构建工具。
底层真正打包的是 Rust 写的 Rspack，Rsbuild 在其上提供开箱即用零配置加语义化配置 API。
定位是 CRA、Vue CLI、Vite 的替代方案，把 bundler 从 webpack 换成 Rspack，构建快 5 到 10 倍。当前 v2.0。

顺序：先澄清 Rsbuild/Rspack/Rstack 三者 → 是什么 → 分层 → 上手 → 四命令 → 零配置 → 配置分层 → vs Vite → 插件 → Environments → 2.0 变更迁移 → 总结。
-->

---

# 先澄清：Rsbuild ≠ Rspack ≠ Rstack

<div class="grid grid-cols-3 gap-3 mt-4 text-sm">
<div>

**Rspack** 📦

- 底层 Rust **bundler**
- webpack 兼容内核
- 暴露 module.rules/plugins

</div>
<div>

**Rsbuild** 🛠️

- Rspack 之上的**集成层**
- 语义化分层配置
- 真正打包靠 Rspack

</div>
<div>

**Rstack** 🌐

- 整个**工具链总称**
- 含 7 个工具
- Rsbuild 只是其一

</div>
</div>

<div v-click class="mt-6">

> 「Rsbuild 的底层 bundler 是谁？」→ **Rspack**。这层关系恰如 **Vite ︰ Rolldown**。

</div>

<!--
先把三个容易混的概念说清楚：Rspack 是底层 Rust 写的 bundler，webpack 兼容内核；
Rsbuild 是 Rspack 之上的集成层，提供语义化分层配置，真正打包靠 Rspack；
Rstack 是整个工具链的总称，包含 7 个工具，Rsbuild 只是其中之一。
记住一个考点：Rsbuild 的底层 bundler 是 Rspack，这层关系就像 Vite 和 Rolldown。
-->

---

# Rstack 七件套

| 工具 | 职责 |
|---|---|
| **Rspack** | bundler 打包器（Rust） |
| **Rsbuild** | build tool 构建工具 |
| Rslib | 库开发工具 |
| Rspress | 静态站点生成器 |
| Rsdoctor | 构建分析器 |
| Rstest | 测试框架 |
| Rslint | linter |

<div v-click class="mt-3 text-sm">

> 底层技术栈全是 Rust：**Rspack 打包 + SWC 转译/压缩 + Lightning CSS 降级**。

</div>

<!--
Rstack 生态共七个工具：Rspack 打包器、Rsbuild 构建工具、Rslib 库开发、Rspress 静态站点、
Rsdoctor 构建分析、Rstest 测试、Rslint 检查。它们底层技术栈全是 Rust：
Rspack 负责打包，SWC 做 JS/TS 转译和压缩，Lightning CSS 做 CSS 降级和加前缀。
-->

---

# 快速上手

```bash
# 脚手架（7 模板：vanilla/react/vue/lit/preact/svelte/solid）
npm create rsbuild@latest
# 已有项目
npm add @rsbuild/core -D
```

```ts
// rsbuild.config.ts
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
export default defineConfig({ plugins: [pluginReact()] });
```

<v-clicks>

- 环境要求：**Node 20.19+ / 22.12+**（v1 是 18.12+）
- 默认入口自动探测 `src/index.*`，默认 dev server **3000**
- 框架支持**全走插件**，核心包不内置

</v-clicks>

<!--
上手很简单：用 create-rsbuild 脚手架，有七种模板。已有项目就装 @rsbuild/core。
配置文件 rsbuild.config.ts 用 defineConfig 包裹。注意环境要求 Node 20.19 以上，比 v1 抬高了。
默认入口自动探测 src/index 系列文件，默认 dev server 端口 3000。
一个要点：框架支持全部走插件，核心包不内置 React/Vue 能力，要手动装对应插件。
-->

---

# 四个 CLI 命令

| 命令 | 作用 |
|---|---|
| `rsbuild` / `rsbuild dev` | 开发服务器（默认 3000，自带 HMR） |
| `rsbuild build` | 生产构建到 dist（`-w` 监听） |
| `rsbuild preview` | 预览生产产物（**需先 build**） |
| `rsbuild inspect` | 导出最终配置到 `.rsbuild/*.mjs` |

<div v-click class="mt-3 text-sm">

> ⚠️ `--watch` 是 `build` 的 flag，不是 `dev`（dev 本身就是热更新服务器）。

</div>

<!--
四个命令：rsbuild 或 rsbuild dev 启动开发服务器，默认 3000 带 HMR；rsbuild build 生产构建，加 -w 监听重建；
rsbuild preview 预览生产产物但要先 build；rsbuild inspect 导出最终的 Rsbuild 和 Rspack 配置用于调试。
注意 --watch 是 build 的 flag 不是 dev，因为 dev 本身就是热更新服务器。
-->

---

# 零配置默认行为

<v-clicks>

- **JS/TS**：Rspack 打包、**SWC** 转译+压缩；TS 只剥类型**不做类型检查**
- **CSS**：**Lightning CSS** 自动加前缀+降级；`*.module.*` 自动 CSS Modules
- **静态资源**：图片/字体默认可 import，**< 4KiB** 自动内联
- **开发**：默认 HMR，dev server `localhost:3000`
- **生产**：默认 minify、自动代码分割、打印 bundle 体积

</v-clicks>

<div v-click class="text-sm mt-2">

> 底层默认是 SWC + Lightning CSS（不是 Babel/Terser/autoprefixer）。

</div>

<!--
零配置开箱即用：JS/TS 用 Rspack 打包、SWC 转译和压缩，TS 只剥类型不做类型检查；
CSS 用 Lightning CSS 自动加前缀降级，star.module 自动识别为 CSS Modules；
图片字体默认可 import，小于 4KiB 自动 base64 内联；开发默认 HMR；生产默认压缩和代码分割。
强调一下底层默认是 SWC 加 Lightning CSS，不是 Babel、Terser 或 autoprefixer。
-->

---

# 配置分层（两个易混点）

```ts
export default defineConfig({
  plugins: [pluginReact()],        // ← 顶层 plugins 收【Rsbuild 插件】
  server: { port: 3000 },          // dev + preview 都生效
  dev: { hmr: true },              // 仅开发态生效
  tools: {
    rspack: { plugins: [new SomeWebpackPlugin()] }, // ← Rspack/webpack 原生插件
  },
});
```

<v-clicks>

- **`server` 段** dev+preview 都生效 vs **`dev` 段**仅开发态
- 顶层 `plugins` 收 Rsbuild 插件，**`tools.rspack.plugins`** 收原生插件

</v-clicks>

<!--
配置分层有两个高频混淆点。第一：server 段在 dev 和 preview 都生效，放 port、host、proxy；
dev 段只在开发态生效，放 hmr、liveReload。第二：顶层 plugins 收 Rsbuild 插件比如 pluginReact，
而 webpack 或 Rspack 的原生插件要写在 tools.rspack.plugins，别放错。
tools.rspack 就是接入 Rspack 原生能力的逃生舱。
-->

---

# vs Vite：三大差异

<v-clicks>

- **生产一致性**：Rsbuild dev/prod **都用 Rspack 打包**；Vite dev 用原生 ESM（unbundled），可能 dev/prod 不一致
- **兼容 webpack 插件生态**（经 `tools.rspack`）
- **Module Federation 一等支持**

</v-clicks>

<div v-click class="mt-4 text-sm">

> ⚠️ 但**别说全面碾压 Vite**：官方基准里 Vite 在生产 build 和 HMR 上数字反而略优；Rsbuild 强在 dev 构建快 + 产物一致性。

</div>

<!--
和 Vite 比有三大差异：第一生产一致性，Rsbuild 开发和生产都用 Rspack 打包，而 Vite 开发态用原生 ESM 不打包，
可能引入 dev/prod 不一致；第二兼容 webpack 插件生态；第三 Module Federation 一等支持。
但要客观：别说全面碾压 Vite，官方基准里 Vite 在生产 build 和 HMR 上数字反而略优，
Rsbuild 的强项是开发构建快加产物一致性。
-->

---

# 框架 / CSS 插件

| 框架 | 插件 | 备注 |
|---|---|---|
| React | `plugin-react` | Fast Refresh 需具名函数 |
| Vue 3 | `plugin-vue` | JSX 需额外 `plugin-vue-jsx` |
| Solid | `plugin-solid` | **必须搭 `plugin-babel`** |

<v-clicks>

- CSS Modules 默认识别 `*.module.*`；Sass/Less 官方插件、Stylus 社区插件
- SVGR：`?react` 后缀转 React 组件
- public 目录用绝对路径引用、不要 import

</v-clicks>

<!--
框架插件几个坑：React 的 Fast Refresh 要求组件是具名函数，否则更新丢 state；
Vue 3 的 SFC 在主插件里，但 JSX 要额外装 plugin-vue-jsx；
Solid 不走 SWC 而走 Babel，必须同时装 plugin-babel。
CSS Modules 默认识别 star.module 文件，Sass/Less 是官方插件，Stylus 是社区插件。
SVGR 用 ?react 后缀把 SVG 转成 React 组件。public 目录的文件用绝对路径引用，不要 import。
-->

---

# Environments 多环境

单次执行为多个运行目标**并行构建**（底层 Rspack MultiCompiler）：

```ts
export default defineConfig({
  environments: {
    web: { output: { target: "web" } },
    node: { output: { target: "node",
      distPath: { root: "dist/server" } } },
  },
});
```

<div v-click class="text-sm mt-2">

> ⚠️ 各环境**必须设不同 `distPath.root`** 防冲突；默认并行，需顺序（SSR）用 `tools.rspack` 的 name+dependencies。

</div>

<!--
Environments 是 Rsbuild 的多环境构建能力，在单次执行里为 web、node、worker 等多个运行目标并行构建，
底层用 Rspack 的 MultiCompiler，常用于 SSR、RSC、多端。注意各环境必须设不同的 distPath.root 防止文件名冲突；
默认是并行构建，需要顺序比如 SSR 的话要用 tools.rspack 的 name 加 dependencies 显式声明依赖。
-->

---

# 2.0 变更 & 迁移

**Rsbuild 2.0 破坏性变更**：

<v-clicks>

- `@rsbuild/core` 纯 ESM；Node 门槛 → **20.19+**
- `server.host` 默认 `0.0.0.0` → **`localhost`**（局域网访问需显式配）
- `performance.chunkSplit` 废弃 → **`splitChunks`**

</v-clicks>

<div v-click class="mt-2 text-sm">

> **迁移难度**：webpack → Rsbuild 最易（模型对齐）；**Vite → Rsbuild 最难**（入口/env/worker 都要改，`build.lib` 改用 Rslib）。

</div>

<!--
Rsbuild 2.0 的破坏性变更：@rsbuild/core 变成纯 ESM，Node 门槛升到 20.19；
server.host 默认从 0.0.0.0 改成 localhost，所以局域网或容器访问会失败要显式配；
performance.chunkSplit 废弃改用 splitChunks。
迁移难度方面：从 webpack 迁最容易因为配置模型刻意对齐，从 Vite 迁最难，入口、env 前缀、worker query 都要改，库构建的 build.lib 要换成 Rslib。
-->

---

# 常见坑 & Tips

<v-clicks>

- **Rsbuild ≠ Rspack**：底层 bundler 是 Rspack；原生插件放 `tools.rspack.plugins`
- **不做类型检查**：需 `plugin-type-check` 或 `tsc`
- **`server.host` 2.0 默认 localhost**：局域网访问需 `0.0.0.0`
- **`define` 字符串值**要 `JSON.stringify`
- **资源内联阈值 4KiB**（不是 8KB）
- **`dev` 段 vs `server` 段**生效范围不同

</v-clicks>

<!--
踩坑汇总：Rsbuild 不是 Rspack，底层 bundler 是 Rspack，原生插件放 tools.rspack.plugins；
不做类型检查要用 plugin-type-check 或 tsc；server.host 2.0 默认 localhost 局域网访问要改 0.0.0.0；
source.define 字符串值要 JSON.stringify；资源内联阈值是 4KiB 不是常见的 8KB；
dev 段和 server 段生效范围不同，别配错。
-->

---
layout: intro
---

# 总结

Rsbuild = **Rspack 之上的零配置构建工具**

- 集成层（语义化配置）+ 底层 Rspack 打包（对标 Vite︰Rolldown）
- SWC + Lightning CSS，比 webpack 快 5–10×
- 生产一致性 + 兼容 webpack 插件 + MF 一等支持
- ⚠️ 强绑 Rspack、不做类型检查、并非每项都最快

<div class="mt-6 text-sm">

📖 [rsbuild.rs](https://rsbuild.rs) ·
<carbon:logo-github /> [web-infra-dev/rsbuild](https://github.com/web-infra-dev/rsbuild)

</div>

<!--
总结：Rsbuild 是 Rspack 之上的零配置构建工具，它是集成层提供语义化配置，底层 Rspack 打包，
这层关系就像 Vite 和 Rolldown。底层 SWC 加 Lightning CSS，比 webpack 快 5 到 10 倍。
核心优势是生产一致性、兼容 webpack 插件、Module Federation 一等支持。
要记住它强绑 Rspack、不做类型检查、也不是每项都比 Vite 快。谢谢！
-->

---
layout: end
---

# 谢谢观看

<div class="text-xl opacity-80">🦀 Powered by Rspack, built for the web</div>
