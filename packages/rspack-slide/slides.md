---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Rspack
info: |
  Presentation Rspack — the fast Rust-based web bundler.

  Learn more at [https://rspack.rs](https://rspack.rs)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🦀</span>
</div>

<br/>

## Rspack — 基于 Rust 的高性能打包器

以现代化的 webpack API 无缝替换 webpack：loader/插件高度兼容，内置 SWC 与原生 CSS。2026-04 已发布 2.0（纯 ESM、Node 20.19+）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/web-infra-dev/rspack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Rspack。官方一句话定位：a fast Rust-based bundler for the web —— 用 Rust 写的高性能 Web 打包器，以「现代化的 webpack API」实现对 webpack 的无缝替换。

两个关键词：第一，快，Rust + 并行 + 增量编译；第二，兼容，webpack 的配置、loader、插件大体都能直接用。它还内置了 SWC 转译器和原生 CSS 支持，把最重的几条路径都搬进了 Rust。

时效信息：2026 年 4 月 Rspack 2.0 发布，核心包改纯 ESM，要求 Node 20.19 或 22.12 以上，这是今天内容的版本基线。

顺序：为什么有它 → 性能从哪来 → 对比 → 上手 → SWC → CSS → 迁移 → 兼容性 → 压缩器 → devServer → 性能三件套 → MF → 2.0 → 生态 → 踩坑 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么有 Rspack？

字节跳动的真实痛点：

<v-clicks>

- 大型应用**生产构建 10~30 分钟**
- dev **冷启动数分钟**
- webpack 配置生态又**舍不得丢**

</v-clicks>

<div v-click class="mt-6">

立项四诉求：

- dev 启动快、CI 构建快
- 保留 webpack 式灵活配置
- 生产优化能力（splitChunks 等）

</div>

<!--
为什么要做 Rspack？这是字节跳动的真实痛点：内部维护大量大型单体应用，生产构建动辄 10 到 30 分钟，开发冷启动也要几分钟。但多年沉淀的 webpack 配置和插件生态又舍不得丢，全量重写迁移成本太高。

于是立项时定了四条诉求：第一，dev 启动要快；第二，CI/CD 里的生产构建要快；第三，保留 webpack 风格的灵活配置，把迁移成本压到最低；第四，要有生产级的优化能力，比如重新设计代码分割。

这四条决定了 Rspack 的形态：不发明新范式，而是用 Rust 把 webpack 这一套重写一遍。
-->

---

# 性能从哪来：四根支柱

<v-clicks>

- **Rust 语言**：无 GC 停顿、内存安全
- **高度并行**：解析/转译/生成吃满多核
- **增量编译**：HMR 只重算受影响子图（1.4 起默认开）
- **内置关键能力**：SWC、CSS、压缩都在 Rust 侧

</v-clicks>

<div v-click class="mt-5">

> 注意：它**不是** Vite 式「开发期免打包」——dev 也打包，靠把打包本身做快。官方基准 HMR ~118ms。

</div>

<!--
Rspack 的速度来自四根支柱。

第一，Rust 语言本身：没有 GC 停顿，内存安全，性能可预测。第二，高度并行化的架构：模块解析、转译、代码生成充分利用多核 CPU，这是 JS 单线程的 webpack 最难补的短板。第三，针对 HMR 设计的增量编译：热更新只重算受影响的部分，1.4 版本起已经默认开启。第四，内置关键能力：SWC 转译、CSS 处理、压缩器都用 Rust 实现在进程内完成，避免 JS 第三方包一层层的通信开销。

特别注意：它不是 Vite 那种开发期免打包的思路，dev 阶段照样打包，只是把打包本身做得足够快。官方基准里 HMR 大约 118 毫秒。
-->

---

# vs webpack / Vite

| 维度 | webpack | **Rspack** | Vite |
|---|---|---|---|
| 语言 | JS | **Rust** | JS + esbuild |
| dev 策略 | 打包 | **打包（够快）** | 原生 ESM 免打包 |
| 配置模型 | webpack | **同 webpack 5** | 自有体系 |
| 生态复用 | — | **loader/插件直接用** | Rollup 插件 |

<div v-click class="mt-4 text-sm">

> dev/prod 同一条管线 → 行为一致；对 webpack 项目是**迁移成本最低**的提速路径。

</div>

<!--
横向对比看定位。

对 webpack：Rspack 是 drop-in 替代，配置模型就是 webpack 5 的，loader 和插件大部分直接复用，是存量 webpack 项目迁移成本最低的提速路径。

对 Vite：技术路线不同。Vite 靠开发期不打包起速，生产再用 Rollup 或 Rolldown 打包，所以存在 dev 和 prod 行为差异的隐患；Rspack 开发生产走同一条打包管线，行为一致，代价是 dev 也要打包——但 Rust 把这个代价抹平了。

选型口诀：webpack 存量项目要提速，选 Rspack；全新项目两条路线都可以，看团队对生态和行为一致性的取舍。
-->

---
layout: two-cols-header
---

# 快速上手

::left::

**安装**

```bash
npm add @rspack/core @rspack/cli -D
# dev server 2.0 起需单独装
npm add @rspack/dev-server -D
```

**命令**

```bash
rspack dev / build / preview
```

::right::

**最小 rspack.config.mjs**

```js
import { defineConfig } from '@rspack/core';

export default defineConfig({
  entry: { main: './src/index.js' },
  output: { filename: '[name].js' },
});
```

<!--
快速上手。手动接入装两个包：@rspack/core 是核心，@rspack/cli 提供 rspack 命令。注意 2.0 起 CLI 改成零依赖，不再捆绑开发服务器，要跑 rspack dev 得单独装 @rspack/dev-server。

三个命令：dev 起开发服务器，build 生产构建，preview 预览产物。

右边是最小配置：默认读取项目根的 rspack.config.js，也支持 mjs、ts。entry、output 这些字段和 webpack 完全同构。

从零创建项目还可以用 npm create rspack@latest；官方同时推荐多数应用直接用上层的 Rsbuild 脚手架，开箱体验更好，这个后面生态部分展开。
-->

---

# builtin:swc-loader：告别 babel-loader

```js
{
  test: /\.(?:js|mjs|jsx|ts|tsx)$/,
  exclude: [/node_modules/],
  loader: 'builtin:swc-loader',
  options: { detectSyntax: 'auto' },  // 2.0：按扩展名自动推断
  type: 'javascript/auto',
}
```

<v-clicks>

- `builtin:` 前缀 = 内置 Rust loader，**无需安装**
- SWC：单线程比 Babel 快 ~20×，四核 ~70×
- ⚠️ 只转译**不做类型检查** → 另跑 `tsc --noEmit`

</v-clicks>

<!--
转译这条最重的路径，Rspack 用内置 SWC 解决。builtin 冒号前缀表示内置 loader，由 core 自带不用安装，直接在 Rust 侧执行，没有跨语言开销。

这条规则一口气吃下 js、jsx、ts、tsx：2.0 推荐 detectSyntax auto，按文件扩展名自动推断语法，不用再手写 parser 配置。

性能量级：官方引用 SWC 的数据，单线程比 Babel 快 20 倍，四核下 70 倍。所以迁移指南的第一条 loader 建议就是 babel-loader 换 builtin:swc-loader。

两个边界要记住：第一，SWC 只剥类型不做类型检查，类型把关要另跑 tsc --noEmit 或者 ts-checker-rspack-plugin；第二，需要特定 Babel 插件的自定义转换时，babel-loader 仍然兼容可用，只是慢。
-->

---

# 原生 CSS：不需要 css-loader

| type | 行为 |
|---|---|
| `css` | 普通 CSS |
| `css/module` | 一律 CSS Modules |
| **`css/auto`** | `*.module.css` 自动走 Modules |

```js
{ test: /\.css$/, type: 'css/auto' },
{ test: /\.scss$/, use: ['sass-loader'], type: 'css/auto' },
```

<div v-click class="mt-2 text-sm">

> ⚠️ 原生 type 与 `CssExtractRspackPlugin`/style-loader **互斥**——插件管线要 `type: 'javascript/auto'`。

</div>

<!--
CSS 是第二条内置路径。Rspack 原生支持 CSS，rule 上声明 type 就行：css 是普通处理；css/module 一律按 CSS Modules；最常用的 css/auto 按文件名分流，点 module 点 css 的自动走 Modules，其他按普通 CSS，产物默认输出独立 CSS 文件。

预处理器也简单：sass-loader 把 Sass 编译成 CSS，交给原生管线收尾，不需要 css-loader 和 style-loader，链路比 webpack 三件套短得多。

一个高频坑：原生 CSS type 和 CssExtractRspackPlugin、style-loader 这条插件管线是互斥的，不能叠加。要用插件管线——比如从 webpack 迁移、依赖 css-loader 的特殊选项——那条 rule 的 type 必须设成 javascript/auto。
-->

---

# 迁移 webpack：五步

<v-clicks>

1. **换包**：webpack→`@rspack/core`，dev-server→`@rspack/dev-server`
2. **改入口**：`webpack.config.js` → `rspack.config.js`
3. **换 loader**：babel-loader→`builtin:swc-loader`；file/url/raw→asset modules
4. **换插件**：Define/Copy/CssExtract 用 `rspack.*` 内置版
5. **对齐压缩器**：SWC 压 JS + Lightning CSS 压 CSS

</v-clicks>

<!--
迁移 webpack 项目的标准五步。

第一步换包：webpack 换 @rspack/core，webpack-cli 换 @rspack/cli，webpack-dev-server 换 @rspack/dev-server，webpack-chain 和 webpack-merge 也有对应的 rspack-chain、rspack-merge。

第二步改配置入口：文件名改成 rspack.config.js，默认就会读取；scripts 里改成 rspack dev、rspack build。

第三步换 loader：babel-loader 或 swc-loader 换 builtin:swc-loader；webpack 4 时代的 file-loader、url-loader、raw-loader 换成资源模块 asset/resource、asset/inline、asset/source。

第四步换插件：DefinePlugin、CopyRspackPlugin、CssExtractRspackPlugin 这些内置版直接从 @rspack/core 导入，选项基本不变。

第五步对齐压缩器，下下页专门讲这里的陷阱。整体体验：多数 webpack 5 项目按这五步能在很短时间内跑起来。
-->

---

# 插件兼容性：85% 可用或有替代

| webpack 插件 | Rspack 方案 |
|---|---|
| html-webpack-plugin | 完全兼容（更快：`HtmlRspackPlugin`） |
| copy-webpack-plugin | 内置 `CopyRspackPlugin` |
| fork-ts-checker | 社区 `ts-checker-rspack-plugin` |
| tsconfig-paths | 内置 `resolve.tsConfig` |
| @ngtools/webpack 等 8 个 | **不兼容** |

<!--
插件兼容性的官方口径：下载量前 50 的 webpack 插件，85% 以上可以直接用或有替代方案。官方维护一份分级清单：完全兼容的 28 个，比如 html-webpack-plugin、webpack-bundle-analyzer、compression、sentry；内置替代的 5 个，比如 copy、mini-css-extract、terser、css-minimizer；另有 10 个提供替代方案、3 个部分兼容、8 个不兼容。

几个典型映射：fork-ts-checker-webpack-plugin 换社区的 ts-checker-rspack-plugin；tsconfig-paths-webpack-plugin 直接换内置配置 resolve.tsConfig。

不兼容的根因通常是插件深度触碰了 webpack 的内部实现。处理顺序：先查官方兼容清单找替代，再看有没有内置能力顶上，最后才是提 issue 或自己适配。

loader 这边更乐观：官方说与社区几乎所有 loader 兼容，因为 loader context 协议被完整实现了。
-->

---

# 压缩器与 minimizer 陷阱

```js
optimization: {
  minimizer: [
    new rspack.SwcJsMinimizerRspackPlugin(),
    new rspack.LightningCssMinimizerRspackPlugin(),
  ],
},
```

<v-clicks>

- 默认：**SWC 压 JS、Lightning CSS 压 CSS**（生产自动开）
- ⚠️ 显式配 minimizer → **默认压缩器整体失效**
- 只配 JS 压缩器 = CSS 从此不压缩 → **两类一起配**

</v-clicks>

<!--
压缩器。Rspack 生产模式默认用两个内置压缩器：SwcJsMinimizer 压 JS，对位 terser-webpack-plugin；LightningCssMinimizer 压 CSS，对位 css-minimizer-webpack-plugin。都是 Rust 实现，性能远超 JS 版本，默认开箱即用。

但这里有个官方迁移指南特别提示的陷阱：一旦你显式配置了 optimization.minimizer——比如想给 JS 压缩传几个参数——默认压缩器就整体失效了。最常见的翻车：只配了 JS 压缩器，结果 CSS 从此没人压缩，产物悄悄变大。

所以记住这条规则：自定义 minimizer 时，JS 和 CSS 两个压缩器必须一起写上。
-->

---

# devServer 与 HMR

```js
devServer: {
  port: 3000,
  proxy: [{ context: ['/api'], target: 'http://localhost:8080' }],
},
```

<v-clicks>

- 基于 webpack-dev-server 演化，**配置兼容**
- HMR **默认开启**（`hot: false` 关闭）
- React 热更新：`@rspack/plugin-react-refresh` + SWC `refresh`
- ⚠️ `cssFilename` 别带 `[hash]`，否则 CSS HMR 异常

</v-clicks>

<!--
开发服务器。rspack dev 由 @rspack/dev-server 驱动，它从 webpack-dev-server 演化而来，port、proxy、static、historyApiFallback 这些配置直接兼容，迁移基本零成本。代理用数组形式，context 匹配路径，target 指向后端。

HMR 在开发模式默认开启，不用配；要关可以 hot: false。React 项目想要组件级热更新、保住组件状态，再加 @rspack/plugin-react-refresh 插件，配合 swc-loader 里 react.refresh 选项，替代原来 Babel 的 react-refresh 方案。

一个细节坑：CSS HMR 场景下 output.cssFilename 不要用 hash 或 contenthash 占位符，否则热更新可能异常。
-->

---

# 性能三件套（2.0 顶层配置）

| 特性 | 配置 | 作用 |
|---|---|---|
| 增量构建 | `incremental` | **1.4 起默认开**，提速 rebuild/HMR |
| 持久缓存 | `cache: { type: 'persistent' }` | 跨进程磁盘缓存，3.1s→**1.4s** |
| 懒编译 | `lazyCompilation: true` | dev 下 import() **按需才编译** |

<div v-click class="mt-3 text-sm">

> 分工：incremental 管进程内二次构建，cache 管冷启动，lazy 管「先别编译用不到的」。

</div>

<!--
三个性能特性，2.0 里都已经是顶层稳定配置。

第一，增量构建 incremental：rebuild 和 HMR 只重算受影响的子图，1.1 引入实验，1.4 起默认全面开启，2.0 转正到顶层；出问题可以设 safe 回退。

第二，持久化缓存：cache type persistent，把构建状态缓存到磁盘，下次冷启动直接命中。官方基准：生产构建从无缓存的 3.1 秒降到 1.4 秒，SWC 压缩器缓存命中再提速 50%，内存占用还降了 20% 以上。1.2 引入实验，2.0 转正。注意 cache: true 只是内存缓存语义，持久化必须显式 type persistent。

第三，懒编译 lazyCompilation：开发模式下入口和动态 import 的模块等真正被访问才编译，大应用冷启动利器，1.5 起就是顶层稳定配置。

三者分工记清楚：incremental 管进程内的二次构建，持久缓存管跨进程的冷启动，懒编译管「用不到的先不编」。
-->

---

# Module Federation：三档支持

| 档位 | 来源 | 适用 |
|---|---|---|
| v1.0 | `ModuleFederationPluginV1` | 对齐 webpack MF，迁移期 |
| **v1.5** | 内置 `ModuleFederationPlugin` | 多数项目推荐 |
| v2.0 | `@module-federation/enhanced` | TS 类型提示/DevTools/预加载 |

<div v-click class="mt-3 text-sm">

> 2.0 新增：**shared 依赖 tree-shaking**；runtime-tools 改可选 peerDependency。

</div>

<!--
微前端场景，Rspack 对 Module Federation 提供三档支持。

v1.0 是兼容档：ModuleFederationPluginV1 与 webpack 的 container 插件对齐，专门服务 webpack 迁移，不再迭代。v1.5 是内置推荐档：rspack.container.ModuleFederationPlugin，包含 v1.0 全部能力加运行时插件扩展，多数项目用它。v2.0 是增强档：装独立包 @module-federation/enhanced，提供动态 TS 类型提示、Chrome DevTools、预加载这些企业级能力，面向大规模微前端。

配置概念 name、exposes、remotes、shared 与 webpack MF 完全一致。

Rspack 2.0 还带来两个 MF 相关变化：shared 共享依赖支持 tree-shaking，可以裁剪到实际使用面；runtime-tools 从核心依赖改成可选 peerDependency，不用 MF 的项目不用装。
-->

---

# Rspack 2.0（2026-04）

<v-clicks>

- 核心包**纯 ESM**：Node 20+ `require(esm)` 兜底，CJS 工程通常零改动
- 环境门槛：**Node 20.19+ / 22.12+**（弃 18）
- 依赖瘦身：dev-server 依赖 192→**1**，体积 15MB→**1.4MB**
- 性能：vs 1.7 再快 ~10%；缓存命中构建 **1.4s**
- 生态：npm 周下载 10 万（1.0）→ **约 500 万**

</v-clicks>

<!--
2026 年 4 月 22 日 Rspack 2.0 发布，几件大事。

第一，核心包改纯 ESM 发布：core、cli、dev-server、plugin-react-refresh 不再发 CJS 构建。但 Node 20 以上原生支持 require esm，所以 CJS 工程通常零改动；注意这只是包的发布格式，不影响把你的产物构建成 CJS。

第二，环境门槛抬高：Node 20.19 或 22.12 以上，Node 18 不再支持。

第三，依赖大瘦身：dev-server 的依赖从 192 个砍到 1 个，安装体积从 15MB 降到 1.4MB，降了 90%；CLI 零依赖。

第四，性能继续抬升：比 1.7 再快约 10%，对比 1.0 累计快了将近一倍；开持久缓存后示例项目生产构建 1.4 秒。

生态数据：npm 周下载从 1.0 时期的 10 万涨到 500 万。Rsbuild 2.0 同步发布。
-->

---

# 升级 2.0 的注意点

<v-clicks>

- **experiments 搬家**：cache/incremental/lazyCompilation **顶层化**；css/topLevelAwait 移除（已稳定）
- **devtool 默认变**：dev→`cheap-module-source-map`；生产 CLI→**`false`**（不产 .map）
- **swc-loader**：**不再读 `.swcrc`**，配置写进 loader options
- 全局名：`webpackChunk*`→`rspackChunk*`
- `exportsPresence`：warn→**error**（坏导入直接构建失败）

</v-clicks>

<!--
升级 2.0 的实操注意点，按影响频率排。

第一，experiments 大搬家：cache、incremental、lazyCompilation 提升为顶层配置；experiments.css 移除，原生 CSS 完全由 rules 的 type 控制；topLevelAwait、parallelLoader 这些已稳定默认开，选项删掉；outputModule 移到 output.module。

第二，devtool 默认值变了：开发从 eval 改成 cheap-module-source-map，堆栈定位方式会变；生产经 CLI 构建从 source-map 改成 false，默认不再产 map 文件——升级后发现没有 .map，是设计变更不是 bug，显式配置就能找回。

第三，builtin:swc-loader 不再读取 .swcrc 文件，SWC 配置必须写进 loader options；rspackExperiments.import 更名 transformImport。

第四，chunk 加载全局变量默认从 webpackChunk 改成 rspackChunk，和 webpack 应用同页共存反而不冲突了，但依赖旧名的约定要核对。第五，exportsPresence 从 warn 升到 error，import 不存在的导出直接构建失败，更严格。
-->

---

# Rstack 生态：和 Rsbuild 怎么分工

| 工具 | 定位 | 何时用 |
|---|---|---|
| **Rspack** | 底层打包器（对位 webpack） | webpack 迁移 / 要底层控制 |
| **Rsbuild** | 一体化构建（对位 Vite） | 新应用、开箱体验 |
| Rsdoctor | 构建分析 | 性能瓶颈定位 |
| Rslib / Rspress / Rstest | 库 / 文档 / 测试 | 对应场景 |

<!--
Rstack 生态的分工，重点是 Rspack 和 Rsbuild 的边界。

Rspack 是底层打包器，对位 webpack：暴露完整配置自由度，rules、插件、产物细节全都自己控制。适合两类人：从 webpack 迁移的存量项目，以及需要底层完全控制的场景。

Rsbuild 是构建在 Rspack 之上的一体化构建工具，对位 Vite 和 CRA 这一层：封装好默认值和插件体系，开箱即用。官方推荐多数新应用从 Rsbuild 上手。类比记忆：Rspack 是引擎，Rsbuild 是带最佳实践的整车。

周边还有：Rsdoctor 构建分析器，看 loader 耗时、重复依赖，2.0 移除 stats.profile 后官方指定的分析入口；Rslib 做库构建；Rspress 做文档站；Rstest 做测试。Rsbuild 2.0 与 Rspack 2.0 已同步发布。
-->

---

# 常见坑 & Tips

<v-clicks>

- 只配 JS minimizer → **CSS 没人压**：两类压缩器一起配
- 原生 CSS type 与 CssExtract **互斥** → 插件管线用 `javascript/auto`
- SWC **不查类型** → `tsc --noEmit` / ts-checker-rspack-plugin
- `env.targets` 与 `jsc.target` **互斥**；都不配则从顶层 target 派生
- polyfill 场景 **exclude core-js**，否则失效
- 2.0 生产没 .map 是默认值变更，不是 bug

</v-clicks>

<!--
高频坑汇总，六条。

第一，显式配 minimizer 后默认压缩器整体失效，只配 JS 压缩器 CSS 就没人压了，两类一起配。第二，原生 CSS type 和 CssExtractRspackPlugin、style-loader 管线互斥，走插件管线那条 rule 要用 javascript/auto。第三，builtin:swc-loader 只转译不查类型，类型把关另跑 tsc --noEmit 或 ts-checker 插件。第四，swc 的 env.targets 和 jsc.target 不能同时配；2.0 起都不配会自动从顶层 target 派生，别再重复声明。第五，用 SWC 的 usage 模式注入 polyfill 时，必须把 core-js 排除出转译，不然 polyfill 自身被编译会失效。第六，升 2.0 后生产没有 source map，是 devtool 默认值改成 false 了，显式配置即可。

再补一条微前端的：2.0 全局变量名从 webpackChunk 改 rspackChunk，跨应用共存的约定记得核对。
-->

---
layout: intro
---

# 总结

Rspack = **用 Rust 重写的 webpack：兼容它，并快一个量级**

- 兼容面：webpack 5 配置 + loader 几乎全兼容 + 插件 85%
- 内置面：SWC 转译、原生 CSS、SWC/Lightning 压缩
- 性能面：并行 + 增量（默认开）+ 持久缓存 + 懒编译
- 2026：**2.0**（纯 ESM、Node 20.19+）；底层选 Rspack，开箱选 Rsbuild

<!--
总结。

一句话：Rspack 就是用 Rust 重写的 webpack——兼容它，并快一个量级。

三个面：兼容面，webpack 5 的配置模型直接搬，loader 几乎全兼容，Top 50 插件 85% 可用或有替代；内置面，SWC 转译告别 babel-loader，原生 CSS 告别 css-loader，SWC 和 Lightning CSS 压缩器默认开；性能面，并行架构加默认开启的增量编译，再配持久化缓存和懒编译两个开关。

2026 年的现状：2.0 是当前主版本，纯 ESM、Node 20.19 起步，experiments 大批转正。选型口诀：webpack 存量项目迁移、要底层控制，用 Rspack；新项目要开箱体验，用它楼上的 Rsbuild。

谢谢大家。
-->
