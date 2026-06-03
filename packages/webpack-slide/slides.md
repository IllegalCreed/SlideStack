---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Webpack
info: |
  Presentation Webpack — the static module bundler.

  Learn more at [https://webpack.js.org](https://webpack.js.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📦</span>
</div>

<br/>

## Webpack — 可配置到极致的模块打包基石

从入口出发自动构建依赖图，把 JS / CSS / 图片 / 字体打包成浏览器可加载的 bundle。生态最深、可配置性最强，Module Federation 是微前端事实标准（当前 Webpack 5.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/webpack/webpack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Webpack —— 2012 年诞生、至今统治存量市场的静态模块打包器。

一句话定位：从一个或多个入口出发，递归解析 import/require 自动构建依赖图，
把所有模块打包成浏览器可加载的 bundle。它最大的特点是生态深、可配置性强，
Module Federation 更是微前端的事实标准。当前是 Webpack 5。

顺序：为什么需要它 → 核心概念六件套 → 安装构建 → Loaders → Asset Modules →
Plugins → Mode → 代码分割 → tree-shaking → 长效缓存 → Module Federation → 4→5 迁移 → 踩坑 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么需要 Webpack？

模块化前，浏览器跑 JS 只有两条烂路：

<v-clicks>

- 每个功能一个 `<script>` —— 请求爆炸、全局污染
- 全塞一个大 `.js` —— 作用域冲突、体积失控

</v-clicks>

<div v-click class="mt-6">

社区用 CommonJS / AMD 缓解，但都要**手工声明依赖**。

Webpack 的突破：

- 根据 `import` / `export` **自动推断依赖图**
- 统一模块格式 + 资源处理 + 代码分割 + tree-shaking + HMR

</div>

<!--
在模块化方案出现前，浏览器跑 JS 要么每个功能一个 script 标签（请求爆炸、全局变量互相污染），
要么全塞进一个大文件（作用域冲突、体积失控）。

社区先后用 IIFE、CommonJS、AMD、Browserify 缓解，但都要手工声明依赖、无法 tree-shaking。
Webpack 的突破在于根据 import/export 自动推断依赖图，并在此基础上提供统一模块、资源处理、
代码分割、tree-shaking 和 HMR。
-->

---

# 核心概念六件套

| 概念 | 作用 | 默认 |
|---|---|---|
| **Entry** | 依赖图起点 | `./src/index.js` |
| **Output** | 产物位置命名 | `./dist/main.js` |
| **Loaders** | 转换非 JS/JSON 文件 | 需自配 |
| **Plugins** | 接入编译生命周期做优化 | 需自配 |
| **Mode** | 启用环境内置优化 | `production` |
| **兼容** | 支持所有 ES5 浏览器 | 不支持 IE8 |

<div v-click class="mt-3">

> Webpack 只懂 JS 和 JSON，其它类型（CSS / 图片 / TS）都要 loader 转换成模块。

</div>

<!--
理解 Webpack 就抓六件套：Entry 是依赖图起点，Output 决定产物，Loaders 转换非 JS 文件，
Plugins 在编译生命周期各节点做优化和产物管理，Mode 启用对应环境的内置优化，最后是浏览器兼容。

一个关键认知：Webpack 默认只理解 JS 和 JSON，CSS、图片、TypeScript 这些都要靠 loader 转换成有效模块。
-->

---
layout: two-cols-header
---

# 安装与第一个构建

::left::

**安装（两个独立包）**

```bash
npm install -D webpack webpack-cli
```

**零配置默认值**

```text
入口 ./src/index.js
  → 输出 ./dist/main.js
默认 mode = production
```

::right::

**最小 webpack.config.js**

```js
const path = require("path");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(
      __dirname, "dist"),
    clean: true, // Webpack5 内置
  },
};
```

<!--
安装要装 webpack 和 webpack-cli 两个独立的包，缺 cli 没法用命令行。

Webpack 5 支持零配置：默认从 src/index.js 打包到 dist/main.js。注意默认 mode 是 production，
不显式设 development 会得到压缩产物，调试看不清。

要自定义就写 webpack.config.js，注意 output.path 必须是绝对路径，clean:true 是 Webpack 5 内置的清空 dist。
-->

---

# Loaders：转换非 JS 文件

```js
module: {
  rules: [
    { test: /\.m?js$/, exclude: /node_modules/, use: "babel-loader" },
    { test: /\.css$/i, use: ["style-loader", "css-loader"] },
    { test: /\.s[ac]ss$/i,
      use: ["style-loader", "css-loader", "sass-loader"] },
  ],
}
```

<v-clicks>

- **链从右到左执行**：`sass → css → style`（写反会失败）
- `babel-loader` 必须 `exclude: /node_modules/`（提速）
- `css-loader` 只解析不注入，`style-loader` 才注入 DOM

</v-clicks>

<!--
Loaders 在 module.rules 里配置，把非 JS 文件转换成模块。最容易踩的坑是 loader 链从右到左、
从下到上执行：['style-loader','css-loader','sass-loader'] 实际是 sass 先编译、再 css、最后 style 注入。

babel-loader 一定要 exclude node_modules，否则去转译第三方库会极慢。css-loader 只解析 @import/url 不注入页面，
要 style-loader 才把样式注入 DOM。
-->

---

# Asset Modules（Webpack 5）

内置，**取代** file/url/raw-loader，无需额外装：

| type | 取代 | 导入返回 |
|---|---|---|
| `asset/resource` | file-loader | URL |
| `asset/inline` | url-loader | data URI |
| `asset/source` | raw-loader | 字符串 |
| `asset` | url-loader | 按 8KB 自动选 |

```js
{ test: /\.(png|svg)$/i, type: "asset/resource" }
```

<div v-click class="text-sm mt-2">

> `asset` 自动阈值默认 8192 字节（`parser.dataUrlCondition.maxSize`）。

</div>

<!--
Webpack 5 内置 Asset Modules，取代了过去要单独装的 file-loader、url-loader、raw-loader。
四种 type：asset/resource 发射文件返回 URL，asset/inline 返回 data URI，asset/source 返回源码字符串，
asset 按 8KB 阈值自动二选一。新项目别再装那三个旧 loader，混用会重复处理。
-->

---

# Plugins

```js
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

plugins: [
  new HtmlWebpackPlugin({ title: "My App" }),
  new webpack.DefinePlugin({
    "process.env.API": JSON.stringify("https://api.x.com"),
  }),
]
```

<v-clicks>

- **Loader vs Plugin**：loader 转换单文件；plugin 访问整个 compilation
- `DefinePlugin` 值**必须 `JSON.stringify`**（否则被当变量名报错）
- `MiniCssExtractPlugin` 抽 CSS（生产），与 `style-loader` 不可同用

</v-clicks>

<!--
Plugin 是带 apply(compiler) 的对象，通过 tapable 钩子接入整个编译生命周期，做 loader 做不到的事。
和 loader 的区别：loader 转换单个文件，plugin 访问整个 compilation。

最常用的 HtmlWebpackPlugin 生成 HTML 自动注入 bundle。DefinePlugin 注入编译期常量，
最经典的坑是值忘了 JSON.stringify，会被当成变量名导致运行报错。
-->

---

# Mode：三种模式

```js
module.exports = { mode: "production" }; // 默认
```

| mode | 内置行为 |
|---|---|
| `production` | 压缩、`deterministic` ids、tree-shaking、scope hoisting |
| `development` | `named` ids、`eval` devtool、内存缓存、不压缩 |
| `none` | 关闭所有默认优化 |

<div v-click class="mt-3">

> ⚠️ `mode` 不会设置 **配置文件自身** 的 `process.env.NODE_ENV`，只设置你 `/src` 源码里的。

</div>

<!--
mode 默认 production，会自动启用对应环境的内置优化：production 自动压缩、deterministic 模块 id、
tree-shaking、scope hoisting；development 用可读 id、eval source map、内存缓存、不压缩；none 全关。

一个高频混淆点：mode 只在构建过程内部通过 DefinePlugin 设置你源码里的 process.env.NODE_ENV，
但 webpack.config.js 文件自身访问的 process.env.NODE_ENV 不会被 mode 设置。
-->

---

# 代码分割

```js
optimization: {
  splitChunks: { chunks: "all" }, // 默认 async 只拆动态 import
  runtimeChunk: "single",
}
```

**动态 import + magic comments**

```js
import(/* webpackChunkName: "chart" */ "./chart.js")
  .then((m) => m.default());
```

<v-clicks>

- `webpackPrefetch`：空闲时加载（两次往返）
- `webpackPreload`：与父 chunk 并行（一次往返）

</v-clicks>

<!--
代码分割三种方式：多入口、SplitChunks 自动抽公共依赖、动态 import。SplitChunks 的 chunks 默认是 async
只拆动态 import，要提取 vendor 必须设 all。多入口共享要配 runtimeChunk single。

动态 import 返回 Promise 生成独立 chunk，配合 magic comments：webpackChunkName 命名，
webpackPrefetch 空闲预取（两次往返），webpackPreload 与父 chunk 并行（一次往返）。注意必须用块注释。
-->

---

# Tree Shaking & sideEffects

依赖 ES 模块静态结构（CommonJS 无法 shake）：

```jsonc
// package.json
{ "sideEffects": false }
```

<div v-click>

> ⚠️ **经典坑**：组件库设 `sideEffects: false` 后，`import './x.css'` 被当死代码删掉，组件丢样式！正确：

```jsonc
{ "sideEffects": ["**/*.css", "**/*.scss"] }
```

</div>

<div v-click class="text-sm mt-2">

`usedExports` 只**标记**未用导出，真正删除靠 production 的压缩。

</div>

<!--
Tree shaking 依赖 ES 模块的静态 import/export，CommonJS 无法 shake，所以 babel 要设 modules:false 保留 ESM。

package.json 的 sideEffects:false 声明无副作用可剪枝，但有个经典坑：组件库这么设之后，
import './Button.css' 这种有副作用的导入会被当死代码删掉，组件就没样式了。正确做法是把 CSS 列进 sideEffects 数组。

还要记住 usedExports 只标记不删除，真正移除靠 production 模式的压缩。
-->

---

# 长效缓存三件套

```js
output: { filename: "[name].[contenthash].js" }, // ①
optimization: {
  runtimeChunk: "single",      // ②
  moduleIds: "deterministic",  // ③ 生产已默认
}
```

<v-clicks>

- `[contenthash]` 内容变才变；`[hash]` 任意文件变都变（别用）
- `runtimeChunk: single` 把 manifest 抽离，防 hash 漂移
- `moduleIds: deterministic` 让模块 id 稳定（Webpack5 生产默认）

</v-clicks>

<!--
长效缓存三件套：output 用 contenthash，内容不变 hash 不变；runtimeChunk single 把每次都变的
runtime/manifest 抽到单独文件，否则它会污染主包 hash；moduleIds deterministic 让新增删除 import 时
模块 id 不漂移，这个 Webpack 5 生产已经默认。配合 splitChunks 分离少变的 vendor，缓存命中率拉满。
-->

---

# Module Federation

Webpack 5 独有，多个**独立构建**运行时组成单一应用（微前端）：

```js
new ModuleFederationPlugin({
  name: "app1",
  exposes: { "./Button": "./src/Button" }, // key 须带 './'
  remotes: { app2: "app2@http://localhost:3002/remoteEntry.js" },
  shared: { react: { singleton: true } },
});
```

<div v-click class="text-sm mt-2">

> 常见坑：`Shared module not available for eager consumption` → 建异步边界 `import('./bootstrap')`。

</div>

<!--
Module Federation 是 Webpack 5 独有的能力，让多个独立构建在运行时组成单一应用，是微前端的事实标准。
每个构建既暴露模块（exposes，key 必须带 ./）又消费远程模块（remotes）。shared 声明共享依赖，
React 这类要 singleton:true 保证单例。

最常见的坑是 eager consumption 报错，解法是建异步边界：入口只写 import('./bootstrap')，逻辑放 bootstrap。
-->

---

# Webpack 4 → 5 迁移要点

| 项 | Webpack 4 | Webpack 5 |
|---|---|---|
| 资源 | file/url/raw-loader | **Asset Modules** |
| 清空输出 | clean-webpack-plugin | **`output.clean`** |
| 缓存 | cache-loader | **`cache.filesystem`** |
| Node polyfill | 自动 | **移除**（需 `resolve.fallback`） |
| dev-server | `contentBase` | **`static`** |

<div v-click class="text-sm mt-2">

> 升级最常见报错：`Can't resolve 'crypto'` —— Node 核心 polyfill 被移除。

</div>

<!--
Webpack 4 升 5 的核心变化：Asset Modules 取代旧 loader，output.clean 取代 clean-webpack-plugin，
内置 filesystem 缓存取代 cache-loader，devServer 的 contentBase 改 static。

升级最常见的报错是 Can't resolve crypto/stream/buffer，因为 Webpack 5 移除了 Node 核心模块的自动 polyfill，
需要配 resolve.fallback 指向 polyfill 包或设 false。
-->

---

# 常见坑 & Tips

<v-clicks>

- **loader 链顺序**：右到左，写反就失败
- **`mode` 默认 production**：忘设 development 得到压缩产物
- **`DefinePlugin`** 值忘 `JSON.stringify` → 当变量名报错
- **`sideEffects: false`** 误删 CSS → 列进数组
- **`output.hashFunction` 仍默认 `md4`**（非 xxhash64）
- **持久化缓存**忘配 `buildDependencies.config` → 改配置不失效

</v-clicks>

<!--
高频坑汇总：loader 链右到左别写反；mode 默认 production 忘设 development 会得到压缩产物；
DefinePlugin 值忘 JSON.stringify 会被当变量名；sideEffects:false 误删 CSS 要把 CSS 列进数组；
output.hashFunction 在 v5 仍默认 md4 不是 xxhash64（社区资料常误传）；
开持久化缓存要配 buildDependencies.config，否则改了配置缓存不失效。
-->

---
layout: intro
---

# 总结

Webpack = **依赖图 + 无限可配置 + 最深生态**

- 六件套：Entry / Output / Loaders / Plugins / Mode / 兼容
- Webpack 5：Asset Modules、持久化缓存、Module Federation
- 代码分割与长效缓存方案最成熟
- 存量统治 + 微前端护城河

<div class="mt-6 text-sm">

📖 [webpack.js.org](https://webpack.js.org) ·
<carbon:logo-github /> [webpack/webpack](https://github.com/webpack/webpack)

</div>

<!--
总结：Webpack 的内核是依赖图加上无限可配置和最深的生态。抓住六件套就能上手，
Webpack 5 带来了 Asset Modules、持久化缓存和 Module Federation。它的代码分割和长效缓存方案最成熟，
凭借存量统治力和微前端护城河仍是基石级工具。想深入就去 webpack.js.org。谢谢！
-->

---
layout: end
---

# 谢谢观看

<div class="text-xl opacity-80">📦 Bundle everything with Webpack</div>
