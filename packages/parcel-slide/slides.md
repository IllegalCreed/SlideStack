---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Parcel
info: |
  Presentation Parcel — the zero configuration build tool for the web.

  Learn more at [https://parceljs.org](https://parceljs.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📦</span>
</div>

<br/>

## Parcel — 面向 Web 的零配置构建工具

从一个 HTML 文件起步，加 script、加点 CSS，TypeScript / JSX / Sass / 图片全部开箱即用，遇到未内置的还会自动安装插件。Rust 编译器（SWC + Lightning CSS），生产默认全套优化（当前 v2.16）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/parcel-bundler/parcel" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Parcel —— 口号就是「面向 Web 的零配置构建工具」。它最大的卖点是真零配置：
从一个 HTML 文件起步，TypeScript、JSX、Sass、图片全部开箱即用，遇到未内置的语言还会自动安装插件。
编译器用 Rust 写，JS 是 SWC、CSS 是 Lightning CSS，生产默认开全套优化。当前 v2.16。

顺序：零配置哲学 → HTML 入口 → 安装 → 三命令 → 默认不转译 → 底层工具 → 生产优化 →
tree-shaking → 代码分割 → Targets 库模式 → .parcelrc → 迁移踩坑 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 零配置哲学

<v-clicks>

- 口号：**The zero configuration build tool for the web**
- 从一个 HTML 起步，加 `<script>`、加点 CSS
- TS / JSX / Sass / 图片 / SVG **开箱即用**
- 遇到未内置语言 → **autoinstall 自动装插件**（Yarn → Pnpm → Npm）

</v-clicks>

<div v-click class="mt-6 text-sm">

> 「零配置」不等于「不可配置」：`.parcelrc` + `package.json`（source / targets / browserslist）就是它的配置面。

</div>

<!--
Parcel 的核心是零配置：从一个 HTML 文件起步，加 script 和 CSS，TypeScript、JSX、Sass、图片、SVG 全部开箱即用。
遇到没内置的语言会自动安装所需插件，包管理器检测顺序是 Yarn、Pnpm、Npm。
但零配置不等于不可配置，需要时 .parcelrc 加上 package.json 的 source/targets/browserslist 就是它的配置面。
-->

---

# HTML 入口与安装

Parcel **以 HTML 为入口**，从 `<script>` / `<link>` 发现依赖：

```html
<!-- src/index.html -->
<script type="module" src="app.ts"></script>
```

```jsonc
// package.json
{
  "source": "src/index.html",
  "scripts": { "start": "parcel", "build": "parcel build" }
}
```

<v-clicks>

- 安装：`npm install --save-dev parcel`
- JS 引用必须 `<script type="module">`（不是经典 script）
- Web app **不要留 `main` 字段**（会被当库 target）

</v-clicks>

<!--
Parcel 和别的工具不同，入口是 HTML 文件，从 script 和 link 标签出发发现整张依赖图。
package.json 用 source 字段声明入口。注意引用 JS 必须用 script type=module，不能是经典 script。
还有个坑：Web 应用不要保留 main 字段，否则会被当成库 target 影响输出。
-->

---

# 三命令与开发服务器

| 命令 | 作用 |
|---|---|
| `parcel` / `parcel serve` | 开发服务器（HTTP + HMR），默认 **1234** |
| `parcel watch` | **只起 HMR，无 HTTP server**（库/后端用） |
| `parcel build` | 单次生产构建后退出 |

<v-clicks>

- HMR 默认开：CSS 自动应用、React Fast Refresh、Vue HMR
- 一切结果进 **`.parcel-cache`** 缓存（v1 是 `.cache`）
- 端口占用自动回退；`--lazy` 懒构建（serve-only）

</v-clicks>

<!--
三个命令要分清：parcel 或 parcel serve 启动开发服务器，带 HTTP 和 HMR，默认 1234 端口；
parcel watch 只起 HMR server 没有 HTTP server，适合库或后端；parcel build 是单次生产构建。
HMR 默认开启，CSS 变更自动应用，React 用 Fast Refresh。所有结果都缓存到 .parcel-cache，注意 v1 是 .cache。
-->

---

# 默认不转译（最重要的认知）

Parcel 2 **默认不做任何语法降级** —— 源码什么语法，输出就什么语法。

要兼容旧浏览器，**必须**配 `browserslist`：

```jsonc
// package.json
{ "browserslist": "> 0.5%, last 2 versions, not dead" }
```

<div v-click class="mt-4">

> ⚠️ Parcel 1 默认带 Babel 转译，**v2 默认完全不转译** —— 不配 `browserslist` 直接迁移，旧浏览器可能报错。

</div>

<!--
这是 Parcel 2 最容易踩的认知坑：它默认不做任何语法降级转译，源码用什么现代语法输出就是什么。
要兼容旧浏览器，必须在 package.json 配 browserslist，Parcel 才会用 SWC 降级 JS、用 Lightning CSS 降级 CSS。
从 Parcel 1 迁移尤其注意，v1 默认带 Babel 转译，v2 默认完全不转译，不配 browserslist 旧浏览器会报错。
-->

---

# 底层工具链（易混考点）

| 资源 | 底层引擎 | 配置文件名 |
|---|---|---|
| JS 转译/压缩 | **SWC** | `.terserrc` |
| CSS | **Lightning CSS** | — |
| SVG 压缩 | **oxvg** | `svgo.config.json` |
| HTML 压缩 | 内置 minifier | `.htmlnanorc` |

<div v-click class="mt-3 text-sm">

> 配置文件名与实际引擎是**分离**的：SVG 引擎是 oxvg 但配置仍叫 `svgo.config.json` —— 高频混淆点。

</div>

<!--
Parcel 的底层工具链是高频考点：JS 转译和压缩用 SWC，不是 Babel 或 Terser；CSS 用 Lightning CSS，不是 PostCSS；
SVG 压缩用 oxvg；HTML 用内置 minifier。注意一个坑：配置文件名和实际引擎是分离的，
比如 SVG 引擎换成了 oxvg 但配置文件仍然叫 svgo.config.json，很容易混。
-->

---

# 生产构建与优化

```bash
parcel build src/index.html   # 默认全套优化 → dist/
```

`parcel build` 自动设 `NODE_ENV=production` 并剥离死分支。默认开启：

<v-clicks>

- **压缩**（SWC / Lightning CSS / oxvg / 内置 HTML）
- **Tree shaking**（ESM + CommonJS）
- **Scope hoisting**（**默认仅生产**开启）
- **Content hashing**（在 Optimizing 阶段计算）

</v-clicks>

<div v-click class="text-sm mt-2">

> dev 模式不做压缩/scope hoisting，别拿 dev 产物估生产。

</div>

<!--
parcel build 是生产构建，自动把 NODE_ENV 设成 production 并剥离死分支。默认开启全套优化：
四个压缩器、tree shaking、scope hoisting、content hashing，全部零配置。
注意 scope hoisting 和压缩只在生产开启，dev 模式不做，所以别拿 dev 产物体积评估生产。
内容哈希是在 Optimizing 阶段计算的，虽然文件名先由 Namer 生成。
-->

---

# Tree Shaking & sideEffects

静态分析移除未用代码（ESM + CJS + 动态 import）：

```jsonc
// package.json —— 默认所有模块都当作有副作用
{ "sideEffects": false }            // 全部无副作用
{ "sideEffects": ["**/*.css"] }     // 仅列出的有副作用
```

<div v-click class="mt-2">

> ⚠️ 经典坑：`sideEffects: false` 后有副作用的 CSS 可能被误删丢样式；诊断 bailout 用 `--log-level verbose`。

</div>

<!--
Parcel 在生产做 tree shaking，静态分析移除未用代码，ESM、CommonJS、动态 import 都支持。
默认所有模块都被当作有副作用保留，要跨包剪枝得显式声明 sideEffects: false。
但有个经典坑：声明 false 后有副作用的 CSS 可能被误删导致组件丢样式，要把 CSS 列进 sideEffects 数组。
诊断哪里没摇掉用 --log-level verbose。
-->

---

# 代码分割 & Targets

**代码分割**：动态 `import()` 自动分包，多入口共享模块自动拆 shared bundle。

> ⚠️ 动态 import 仅是 hint：同步+异步混用会被 internalize 到同一 bundle。

**库模式**（字段自动识别为 target）：

| 字段 | 输出 |
|---|---|
| `main` | CJS（`.mjs`/`type:module` 则 ESM） |
| `module` | 始终 ESM |
| `types` | `.d.ts` |

<div v-click class="text-sm mt-1">

> 库 target 不打包 node_modules、强制开 scope hoisting。

</div>

<!--
代码分割由动态 import 控制，自动分包，多入口共享模块自动拆 shared bundle。注意动态 import 只是提示，
不保证生成独立 bundle，同一模块既同步又异步引用会被 internalize 合到同一 bundle。

库模式很方便：main、module、browser、types 这几个字段会被自动识别为构建目标，
main 默认 CommonJS、module 始终 ESM、types 输出声明文件。库 target 不打包 node_modules，强制开 scope hoisting。
-->

---

# `.parcelrc` 插件体系

```jsonc
{
  "extends": "@parcel/config-default",
  "compressors": {
    "*.{js,css,html}": ["...", "@parcel/compressor-gzip"]
  }
}
```

<v-clicks>

- 角色：Resolver / Transformer / Bundler / Namer / Packager / Optimizer / Compressor / Reporter…
- **`"..."`** 把默认管线嵌入（扩展而非覆盖）；漏写会整体替换默认
- glob map 按声明顺序定优先级，具体 glob 放前面

</v-clicks>

<!--
需要扩展时用 .parcelrc，JSON5 格式，extends 继承默认配置。插件分很多类角色：
Resolver、Transformer、Bundler、Namer、Packager、Optimizer、Compressor、Reporter 等。
关键是那个三点 token，它把默认管线嵌进来实现扩展，漏写会整体替换默认导致构建崩溃。
glob map 按声明顺序定优先级，具体的 glob 要放在宽泛的前面。gzip 也不是默认，要装压缩器插件加 .parcelrc。
-->

---

# 常见坑 & Tips

<v-clicks>

- **默认不转译**：忘配 `browserslist` → 旧浏览器报错
- **不做 TS 类型检查**：需 `tsc --noEmit`；隐式 `isolatedModules`（`const enum` 不可用）
- **底层引擎 ≠ 配置文件名**：SVG=oxvg 但配置叫 `svgo.config.json`
- **CSS 自定义属性的 `url()`** 必须绝对路径
- **Web app 别留 `main` 字段**（会被当库）
- **v1→v2**：`parcel-bundler`→`parcel`、`.cache`→`.parcel-cache`

</v-clicks>

<!--
踩坑汇总：默认不转译忘配 browserslist 会让旧浏览器报错；不做 TS 类型检查要自己跑 tsc，且隐式 isolatedModules 让 const enum 不可用；
底层引擎和配置文件名分离；CSS 自定义属性里的 url 必须绝对路径；Web 应用别留 main 字段；
从 v1 迁移注意包名和缓存目录都变了。
-->

---
layout: intro
---

# 总结

Parcel = **零配置 + HTML 入口 + Rust 工具链**

- 真零配置开箱即用 + autoinstall 自动装插件
- 底层 SWC + Lightning CSS，缓存默认开
- 生产默认全套优化（minify / tree shaking / scope hoist / content hash）
- ⚠️ 默认不转译需 `browserslist`、不做类型检查需 `tsc`

<div class="mt-6 text-sm">

📖 [parceljs.org](https://parceljs.org) ·
<carbon:logo-github /> [parcel-bundler/parcel](https://github.com/parcel-bundler/parcel)

</div>

<!--
总结：Parcel 是零配置加 HTML 入口加 Rust 工具链的组合。真零配置开箱即用，自动安装插件，
底层 SWC 加 Lightning CSS，缓存默认开，生产默认全套优化。要记住两个默认：默认不转译需要 browserslist，
默认不做类型检查需要 tsc。特别适合中小项目和教学场景。谢谢！
-->

---
layout: end
---

# 谢谢观看

<div class="text-xl opacity-80">📦 Zero config, just build</div>
