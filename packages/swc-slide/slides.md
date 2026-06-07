---
theme: seriph
background: https://cover.sli.dev
title: Welcome to SWC
info: |
  Presentation SWC — the Speedy Web Compiler.

  Learn more at [https://swc.rs](https://swc.rs)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">⚡</span>
</div>

<br/>

## SWC — Rust 写的极速编译器

转译 + 压缩，但不做类型检查。官方称单线程比 Babel 快约 20×、四核约 70×。Next.js、Parcel、Deno、Rspack 都建立在它之上

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/swc-project/swc" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 SWC —— Speedy Web Compiler，用 Rust 写的极速编译平台。

一句话定位：它对 JS/TS/JSX 做转译和压缩，核心卖点是快，官方称单线程比 Babel 快约 20 倍，四核约 70 倍。但要记住，它和 Babel、esbuild 一样不做类型检查。

落地面很广：Next.js 内置编译器、Parcel、Deno、@swc/jest、Rspack 和 Rsbuild 的 swc-loader 都建立在 SWC 之上。

顺序：为什么需要它 → 三件事 → 不做类型检查 → 安装 → .swcrc 核心 → parser → target → module → 装饰器 → env 与 polyfill → 集成 → Wasm 插件 → 踩坑 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么需要 SWC？

Babel 是 JS 写的、单线程，大项目转译慢：

<v-clicks>

- 浏览器和旧环境不认 `.ts` / JSX
- Babel 转译是性能瓶颈
- 需要更快的「剥类型 + 降级」

</v-clicks>

<div v-click class="mt-6">

SWC 用 Rust 重写这条链路：

- 原生并行，**快约 20–70×**
- 一份 `.swcrc` 省配置
- Babel 的 drop-in 替代

</div>

<!--
为什么需要 SWC？Babel 是 JavaScript 写的、单线程，大项目转译是明显的性能瓶颈；而直接写 .ts 和 JSX，浏览器和旧环境都不认。

SWC 用 Rust 重写了这条「剥类型加降级语法」的链路：原生并行充分利用多核，官方称快约 20 到 70 倍；一份 .swcrc 就能覆盖语法、目标、模块、压缩；而且它是 Babel 的 drop-in 替代，迁移成本低。它解决的是 emit 太慢，不是类型安全。
-->

---

# SWC 干三件事

| 职责 | 做什么 |
|---|---|
| **转译** | 抹 TS 类型 + 按 target 降级语法 + 按 module 转换 → `.js` |
| **压缩** | 内置 Terser 兼容的 minify（compress / mangle） |
| **打包** | spack / bundle —— 实验性，成熟度不足 |

<div v-click class="mt-4">

> 记忆点：SWC 强在「转译 + 压缩」内核，弱在「打包」。打包仍交 Webpack / Rspack / Rollup / Vite。

</div>

<!--
SWC 干三件事：一是转译，抹掉 TS 类型标注、按 target 降级语法、按 module 转换模块格式，产出 JS；二是压缩，内置一套 Terser 兼容的 minify，包括 compress 去死代码和 mangle 混淆变量名；三是打包，早期叫 spack，但成熟度长期不足。

记住这个要点：SWC 强在转译加压缩这个内核，弱在打包。生产打包仍然交给 Webpack、Rspack、Rollup、Vite。SWC 的价值恰恰是当这些打包器的转译内核。
-->

---

# 关键认知：SWC 不做类型检查

<v-clicks>

- 官方明确：**只转译，不做类型检查**
- 「works on file-by-file」——逐文件，看不到完整类型系统
- 语法对就放行，类型错了照样产出
- 依赖跨文件类型的转换不工作

</v-clicks>

<div v-click class="mt-4">

> 所以标准组合是：**SWC 极速 emit + `tsc --noEmit` 把关类型**。SWC 测试全绿 ≠ 类型正确。

</div>

<!--
最关键的认知：SWC 不做类型检查。官方原话是 SWC only transpiles the code and doesn't perform type checking，还说 SWC works on file-by-file，逐文件处理，看不到完整类型系统，任何依赖理解完整类型系统的转换都不工作。

意味着语法对它就放行，类型错了照样产出。所以现代工程的标准组合是：SWC 负责极速 emit，tsc --noEmit 负责把关类型。一定记住，SWC 测试全绿不等于类型正确，CI 里必须另跑 tsc。
-->

---
layout: two-cols-header
---

# 安装与第一次编译

::left::

**安装**

```bash
npm i -D @swc/core @swc/cli
```

**编译命令**

```bash
npx swc src -d dist     # 转译目录
npx swc src -d dist -w  # 监听
```

::right::

**最小 .swcrc**

```json
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": true
    },
    "target": "es2022"
  },
  "module": { "type": "es6" }
}
```

<!--
安装很简单：npm i -D @swc/core @swc/cli，前者是 Rust 编译的核心，后者提供 swc 命令。

命令方面，npx swc src -d dist 把 src 转译到 dist；加 -w 进入监听增量。

右边是最小配置：jsc.parser 告诉 SWC 按 TypeScript 解析、tsx 支持 JSX；target 是降级目标，这里设 es2022；module.type 设 es6 输出原生 ESM。注意 target 默认是 es5，建议显式设。
-->

---

# .swcrc 核心结构

| 字段 | 作用 |
|---|---|
| `jsc.parser` | 按 JS 还是 TS 解析（syntax / jsx / tsx） |
| `jsc.target` | 语法降级目标（**默认 es5**） |
| `jsc.transform` | react / 装饰器 / optimizer |
| `jsc.externalHelpers` | 助手外置到 `@swc/helpers` |
| `module.type` | 输出模块格式（es6 默认 / commonjs） |
| `minify` | 顶层布尔，开总压缩 |
| `env` | 按 browserslist 降级（与 target 互斥） |

<!--
.swcrc 的核心结构分这几块：jsc.parser 告诉 SWC 按 JS 还是 TS 解析；jsc.target 是语法降级目标，默认 es5；jsc.transform 管 react、装饰器、optimizer；jsc.externalHelpers 把助手函数外置到 @swc/helpers；module.type 决定输出模块格式，默认 es6；minify 是顶层布尔开总压缩；env 按 browserslist 反推降级，注意它和 target 互斥。
-->

---

# jsc.parser：先说清这是什么语法

```json
{ "jsc": { "parser": {
  "syntax": "typescript", "tsx": true, "decorators": true
} } }
```

<v-clicks>

- `syntax`：`"ecmascript"`（默认）或 `"typescript"`
- TS 文件解析 JSX 用 **`tsx`**，JS 文件用 **`jsx`**
- `decorators`：解析装饰器语法

</v-clicks>

<div v-click class="mt-4">

> ⚠️ `jsx` 和 `tsx` 不通用：TS 想支持 JSX 必须写 `tsx`，写错 parser 直接解析失败。

</div>

<!--
jsc.parser 要先说清这是什么语法。syntax 二选一：ecmascript 是默认，typescript 用于 TS。

一个常见坑：TS 文件解析 JSX 用 tsx 字段，普通 JS 用 jsx 字段，两者不通用。如果 TS 文件想支持 JSX 却写成 jsx，会直接解析失败。decorators 控制是否解析装饰器语法。
-->

---

# target：只降语法，不补 API

```json
{ "jsc": { "target": "es2022" } }
```

<v-clicks>

- 把 `async/await`、可选链等**语法**降级
- **默认是 es5**，不写会一路降到 ES5
- **不注入** Promise / includes 等运行时 API

</v-clicks>

<div v-click class="mt-4">

> 和 tsc 一样：target 只降语法。要补 polyfill 得用 `env` 配 coreJs，或在打包器侧引入 core-js。

</div>

<!--
target 决定把新语法降级到哪代 ES。它把 async/await、可选链这些语法降级。

两个要点：第一，默认是 es5，不显式写会一路降到 ES5，多打很多不必要的降级代码，建议按运行环境设 es2020 或 es2022。第二，和 tsc 一样，target 只降语法，不会注入 Promise、includes 这些运行时 API 的 polyfill。要补 polyfill 得用 env 配 coreJs，或在打包器侧引入 core-js。
-->

---

# module.type：输出哪种模块格式

| 值 | 产物 | 适用 |
|---|---|---|
| `es6` | 原生 ESM（默认） | 交给打包器 |
| `commonjs` | require / exports | 传统 Node |
| `umd` / `amd` / `systemjs` | 对应格式 | 旧加载器 |

<div v-click class="mt-4">

> `importInterop`（swc / node / none）控制 CJS/ESM 互操作 helper —— 配错会影响默认导入能否工作。

</div>

<!--
module.type 决定 import/export 编译成什么模块系统。es6 是默认，保留原生 ESM，适合交给打包器；commonjs 输出 require 和 exports，给传统 Node；还有 umd、amd、systemjs 给旧加载器。

一个需要注意的子项是 importInterop，取值 swc、node、none，控制 CJS 和 ESM 互操作的 helper 行为，配错会影响 CommonJS 包的默认导入能不能正常工作。
-->

---

# 装饰器：三个开关要联动

NestJS / TypeORM 等依赖元数据，常一起配：

```json
{ "jsc": {
  "parser": { "syntax": "typescript", "decorators": true },
  "transform": { "legacyDecorator": true, "decoratorMetadata": true }
} }
```

<v-clicks>

- `parser.decorators` —— 先认识语法
- `transform.legacyDecorator` —— 按旧版语义转换
- `transform.decoratorMetadata` —— 对应 emitDecoratorMetadata

</v-clicks>

<!--
装饰器涉及解析和转换两步，三个开关要联动。

parser.decorators 让 parser 先认识装饰器语法；transform.legacyDecorator 按旧版也就是 TypeScript experimentalDecorators 语义转换；transform.decoratorMetadata 对应 TS 的 emitDecoratorMetadata，需要反射元数据时加。

用 NestJS、TypeORM 这类依赖依赖注入的框架，三个必须同时打开，漏一个装饰器就不会被正确处理。
-->

---

# env：SWC 版 preset-env + polyfill

```json
{ "env": {
  "targets": "defaults", "mode": "usage", "coreJs": "3"
} }
```

<v-clicks>

- `mode: "usage"` —— 按实际用到的 API 按需注入
- `mode: "entry"` —— 在入口 import core-js 处展开
- 不写 `mode` 则不注入 polyfill

</v-clicks>

<div v-click class="mt-3 text-sm">

> ⚠️ `env` 与 `jsc.target` 互斥：官方称 env「does not work with jsc.target」，二选一。

</div>

<!--
env 是 SWC 版的 preset-env，按 browserslist 反推该降级什么，还能注入 polyfill。

mode 有两种：usage 按文件实际用到的 API 按需注入；entry 在入口的 import core-js 处按 targets 展开。注意不写 mode 就不注入 polyfill。coreJs 指定 core-js 版本。

划重点：env 和 jsc.target 互斥，官方明确说 env 这套 does not work with jsc.target，二者只能选一个。要按 browserslist 就用 env，要钉死某个 ES 版本就用 target。
-->

---
layout: two-cols-header
---

# 集成：Webpack 与 Jest

::left::

**swc-loader 替代 babel-loader**

```js
{
  test: /\.[jt]sx?$/,
  exclude: /node_modules/,
  use: { loader: "swc-loader" }
}
```

::right::

**@swc/jest 替代 ts-jest**

```js
{
  transform: {
    "^.+\\.(t|j)sx?$":
      ["@swc/jest"]
  }
}
```

<div class="text-sm mt-2">

> 都只是把转译换成 SWC，**类型检查仍要单独跑 `tsc --noEmit`**。

</div>

<!--
集成方面，Webpack 用 swc-loader 替代 babel-loader，配置项和 .swcrc 的 jsc 一致；Jest 用 @swc/jest 替代 ts-jest 或 babel-jest，在 transform 里指定即可。

但要再强调一遍：这两个都只是把转译环节换成 SWC，类型检查仍然要单独跑 tsc --noEmit。测试通过不代表类型正确。
-->

---

# Wasm 插件：扩展点与版本耦合

```json
{ "jsc": { "experimental": { "plugins": [
  ["@swc/plugin-styled-components", { "displayName": true }]
] } } }
```

<v-clicks>

- 用 Rust 写 `VisitMut` 访问器，编译成 `.wasm`
- **官方：Wasm 插件不向后兼容**
- 插件 `swc_core` 必须匹配宿主 `@swc/core` 的 ABI
- 选版本用 **plugins.swc.rs**

</v-clicks>

<!--
SWC 的扩展点是 Wasm 插件：用 Rust 写一个 VisitMut 访问器遍历改写 AST，编译成 wasm，在 .swcrc 里以 name 加 config 的元组挂载。

最大的坑是版本耦合。官方明示 Currently the Wasm plugins are not backwards compatible。插件依赖的 swc_core crate 必须严格匹配宿主 @swc/core 的 ABI，宿主升一个小版本旧插件就可能加载失败。所以选版本不要靠手记，用官方 webapp plugins.swc.rs，输入宿主版本它给出兼容组合。
-->

---

# 常见坑 & Tips

<v-clicks>

- **SWC 不做类型检查** → 必配 `tsc --noEmit`
- `env` 与 `jsc.target` **互斥**，二选一
- 装饰器需 parser + legacyDecorator + metadata **三开关**
- Wasm 插件**无向后兼容**，升级前查 plugins.swc.rs
- `externalHelpers: true` 记得装 `@swc/helpers`
- 打包仍交打包器，spack 成熟度不足

</v-clicks>

<!--
高频坑汇总：第一，SWC 不做类型检查，必须另配 tsc --noEmit；第二，env 和 jsc.target 互斥，二选一；第三，装饰器需要 parser.decorators、legacyDecorator、decoratorMetadata 三个开关联动；第四，Wasm 插件无向后兼容，升级 @swc/core 或 Next.js 前先查 plugins.swc.rs；第五，开 externalHelpers 记得装 @swc/helpers，否则运行时报找不到模块；第六，打包仍交打包器，spack 成熟度不足。
-->

---
layout: intro
---

# 总结

SWC = **Rust 写的极速转译 + 压缩内核**

- 快约 20–70×，Babel 的 drop-in 替代
- 不做类型检查 → 配 `tsc --noEmit` 把关
- 被 Next.js / Parcel / Deno / Rspack 深度内置
- 扩展靠 Wasm 插件，但版本 ABI 强耦合

<!--
总结一下。SWC 是用 Rust 写的极速转译加压缩内核：官方称快约 20 到 70 倍，是 Babel 的 drop-in 替代。

但它不做类型检查，必须配 tsc --noEmit 把关类型。它被 Next.js、Parcel、Deno、Rspack 深度内置，落地面很广。扩展靠 Wasm 插件，但插件和宿主的 ABI 强耦合、无向后兼容，这是相对 Babel 插件生态最痛的地方。

把它当 Babel 替代用，把打包和类型检查交给专门工具，是最稳的工程姿势。
-->
