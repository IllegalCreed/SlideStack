---
theme: seriph
background: https://cover.sli.dev
title: Welcome to esbuild
info: |
  Presentation esbuild — an extremely fast bundler for the web.

  Learn more at [https://esbuild.github.io](https://esbuild.github.io)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">⚡</span>
</div>

<br/>

## esbuild — 极速 Web 打包器

Go 编写、无需缓存也比 webpack 快约百倍的打包器兼压缩器。内置 JS/CSS/TS/JSX，但不做类型检查、不降级 ES5、不做 HMR。2026 年版本仍是 0.2x，已是基础设施级工具

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/evanw/esbuild" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 esbuild。官网一句话定位：An extremely fast bundler for the web，极快的 Web 打包器，同时也是压缩器。

它用 Go 编写、编译成原生代码，口号是「无需缓存的极致速度」。内置 JavaScript、CSS、TypeScript、JSX 四类内容支持。但边界也很清晰：不做类型检查、不降级 ES5、不做 HMR。

2026 年的现状：版本仍然是 0.2x（最新 0.28.1），处于维护态，但它是基础设施级的存在——Vite 用它做依赖预打包和转译，tsup、Amazon CDK、Phoenix 都拿它当底层引擎。

顺序：为什么快 → 安装上手 → 两个 API → format/platform → loader → TS 边界 → tree shaking → 优化选项 → watch/serve → 插件 → 不做的事 → 生态位 → 踩坑 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么需要 esbuild？

官网基准：打包 10 份 three.js（含 minify + sourcemap，无缓存）

<v-clicks>

- **esbuild：0.39s**
- Parcel 2：14.91s
- Rollup 4 + terser：34.10s
- webpack 5：41.21s

</v-clicks>

<div v-click class="mt-6">

> 差距约 **100 倍**——它证明了：构建慢不是必然，是工具实现的问题

</div>

<!--
为什么需要 esbuild？因为它重新定义了「构建该有多快」。

官网首页的基准测试：打包 10 份 three.js 副本的生产构建，开着 minify 和 sourcemap、不用任何缓存。esbuild 0.39 秒；Parcel 2 要 14.91 秒；Rollup 4 加 terser 34.1 秒；webpack 5 要 41.21 秒。

差距约一百倍。这个数字的意义不只是快，而是证明了构建慢不是必然——是传统 JS 工具实现方式的问题。esbuild 由此开启了整个「JS 工具原生化」的浪潮，后来的 SWC、Rolldown、Rspack、Oxc 都沿着这条路走。
-->

---

# 为什么这么快？官方 FAQ 四大支柱

<v-clicks>

- **Go + 原生代码**：JS 工具每次启动都被 VM 重新解释优化，esbuild 是编译好的原生码
- **极致并行**：parse / link / codegen 全阶段吃满所有 CPU 核
- **一切自研**：零三方依赖，自写 JS/TS 解析器，绕开官方编译器的性能陷阱
- **内存高效**：AST 全程只过约 **3 遍**，数据尽量留在 CPU 缓存

</v-clicks>

<div v-click class="mt-4">

> 速度来自**架构**而非缓存——所以才敢承诺「无缓存极速」

</div>

<!--
官方 FAQ「Why is esbuild fast」给了四点。

第一，语言。Go 编译成原生代码；而 JS 写的打包器，每次运行 VM 都是第一次见到这些代码，要边解释边收集优化提示，起跑线就输了。

第二，并行。解析、链接、代码生成三个阶段都设计成充分并行，吃满所有核。Go 线程共享内存，比 JS worker 之间序列化传数据高效得多。

第三，一切自研。不用任何第三方库，连 TypeScript 解析器都是自己写的，绕开了官方 TS 编译器里 megamorphic 对象形状这类性能陷阱。

第四，内存效率。AST 从头到尾只过大约三遍：解析一遍、绑定转换一遍、生成一遍，数据尽量留在 CPU 缓存里。对比之下 Babel 的每个插件都要各自遍历 AST。

结论：速度来自架构而非缓存。这也解释了它为什么拒绝把 AST 暴露给插件——节点反复进出 JS 层，性能模型就塌了。
-->

---
layout: two-cols-header
---

# 安装与第一次打包

::left::

**安装（注意 --save-exact）**

```bash
npm i --save-exact -D esbuild
npx esbuild --version  # 0.28.1
```

按平台拉取**原生二进制**
（@esbuild/darwin-arm64 等）

::right::

**第一次打包（React 示例）**

```bash
npx esbuild app.jsx \
  --bundle --outfile=out.js
```

- `--bundle` **默认关闭**，必须显式开
- `.jsx` 后缀自动启用 JSX 解析

<!--
安装：npm install --save-exact --save-dev esbuild。为什么要 save-exact？后面版本语义那页会讲：esbuild 的 minor 版本就是破坏性变更，必须锁精确版本。

npm 包的本质是原生二进制的分发壳：安装时按当前平台拉对应的可选依赖，比如 darwin-arm64、linux-x64，里面是 Go 编译出的可执行文件。所以 node_modules 不能跨系统拷贝。另有 esbuild-wasm 包，能跑在浏览器里，但官方注明慢约 10 倍。

第一次打包用官网的 React 例子：esbuild app.jsx --bundle --outfile=out.js。两个要点：第一，bundle 默认是关的，不开就只转换入口文件本身、import 原样保留，行为接近 Babel 的单文件转译；第二，.jsx 扩展名自动启用 JSX 解析，.js 文件想写 JSX 要手动配 loader。
-->

---

# 两个 API：build 与 transform

```js
// build：打包 + 文件系统 + 插件
await esbuild.build({ entryPoints: ['app.ts'], bundle: true, outfile: 'out.js' })

// transform：内存字符串单文件转换
const { code } = await esbuild.transform('let x: number = 1', { loader: 'ts' })
```

<v-clicks>

- transform 是 **build 的受限特例**：隔离环境、无文件系统、**不能打包、不能用插件**
- Vite 转 TS/JSX 用的就是 transform
- 同步版 buildSync/transformSync：仅 Node、阻塞线程、**不能用插件**

</v-clicks>

<!--
esbuild 提供两个 API 入口。

build 是主力：接收入口文件，解析依赖图、打包、写文件系统，插件也只在这里可用。

transform 官方定义是「build 的受限特例」：在隔离环境里转换一段内存中的代码字符串，不碰文件系统、不能打包、不能用插件。典型用途是单文件转译——Vite 在 dev 阶段把 TS、JSX 转成 JS，用的就是 transform。

另外有同步版本 buildSync 和 transformSync：只能在 Node 用、会阻塞线程，而且不能用插件——因为插件回调本质是异步的。官方推荐异步版，同步版只留给 require.extensions 这类必须同步的场景。
-->

---

# format × platform

| format | 形态 | 默认场景 |
|---|---|---|
| `iife` | 立即执行函数，防全局污染 | platform=**browser** |
| `cjs` | CommonJS | platform=**node** |
| `esm` | 保留 import/export | platform=**neutral** |

<div v-click class="mt-4">

- platform=node：Node 内置模块自动 external、启用 node 导出条件
- **splitting 与顶层 await 仅 esm 格式支持**

</div>

<!--
输出形态由 format 和 platform 两个旋钮决定。

format 三种：iife 把代码包进立即执行函数，适合 script 标签直接引入、避免污染全局，是 browser 平台的默认；cjs 是 CommonJS，node 平台默认；esm 保留 import/export，neutral 平台默认。

platform 不只决定默认 format，还联动一组行为：node 平台会把 fs、path 这些内置模块自动标记 external，解析 package.json exports 时用 node 条件；browser 平台还会自动 define process.env.NODE_ENV——全 minify 时替换成 production，否则 development，这是为了能直接打包 React 这类库。

划重点：代码拆分 splitting 和顶层 await 都只在 esm 格式下支持。cjs 不支持顶层 await 是因为 require 是同步的，表达不了异步的模块求值。
-->

---

# 内容类型与 loader

| loader | 行为 |
|---|---|
| `js/jsx/ts/tsx` | 转译；**.js 默认不解析 JSX** |
| `css` / `local-css` | 一等公民；`.module.css` 即 CSS Modules |
| `json` / `text` | 对象（可摇树）/ UTF-8 字符串 |
| `dataurl` / `base64` / `binary` | 内联进 bundle |
| `file` / `copy` | 拷贝到输出目录（外链） |

<div v-click class="mt-3 text-sm">

> CSS 产出独立 `.css` 文件（**不是**运行时 style 注入）；按 target 自动加前缀、降级嵌套

</div>

<!--
esbuild 按扩展名把文件交给 loader，内置一整套。

代码类：js、jsx、ts、tsx。注意 .js 文件默认不解析 JSX，要显式配 --loader:.js=jsx。

CSS 是一等公民：可以作为独立入口；JS 里 import CSS 时，esbuild 把整个模块图的 CSS 收集成与 JS 并列的同名 .css 文件——注意不是 webpack style-loader 那种转成 JS 字符串运行时注入。.module.css 默认走 local-css，也就是原生 CSS Modules，类名本地化防冲突。还会按 target 自动加厂商前缀、降级嵌套这类现代语法。

资源类记三组：dataurl、base64、binary 是内联进 bundle；file 是拷贝到输出目录、import 得到文件名字符串；copy 是拷贝并保留导入关系。json 解析成对象且具名导出可以摇树，text 按 UTF-8 字符串读。
-->

---

# TypeScript：剥类型，不检查

```bash
esbuild app.ts --outfile=out.js   # 秒出 JS，类型对错不知道
tsc --noEmit                      # 类型把关并行跑
```

<v-clicks>

- 官方原文：esbuild **does not** do any type checking
- 逐文件独立编译 → 代码需满足 **isolatedModules** 约束
- 不支持 **emitDecoratorMetadata**（NestJS/Angular DI 注意）
- **不生成 .d.ts** → 库作者配 `tsc --emitDeclarationOnly`

</v-clicks>

<!--
TypeScript 是 esbuild 最常被误解的边界。

官方原文很直白：esbuild does not do any type checking，你仍然需要跑 tsc --noEmit。esbuild 对 TS 只做一件事：逐文件剥掉类型注解再转译，语法对就放行，类型错了照样产出。所以标准工程姿势是 esbuild 出产物、tsc --noEmit 并行把关。

逐文件独立编译还带来几个硬限制：代码要满足 isolatedModules 约束，比如 re-export 类型必须用 export type；不支持 emitDecoratorMetadata，因为它需要跨文件的类型信息——用 NestJS、Angular 依赖注入的要注意；也不生成 .d.ts 声明文件，库作者要另跑 tsc --emitDeclarationOnly。

还有个小坑：.tsx 文件里泛型箭头函数 <T>() 会被当 JSX 解析失败，写成 <T,> 或 <T extends unknown> 消歧。
-->

---

# Tree shaking

```json
// package.json（库侧声明）
{ "sideEffects": false }
```

<v-clicks>

- 默认**仅在 bundle 或 format=iife 时启用**，其余默认关
- `--tree-shaking=true` 可强制开启
- 参考两类标注：`sideEffects` 字段 + `/* @__PURE__ */` 注释
- 三方包标注错了 → `--ignore-annotations` 兜底
- ESM 静态结构最利于摇树，CJS 常被整体保留

</v-clicks>

<!--
Tree shaking，声明级的死代码消除。

默认规则容易想当然：只在开启 bundle、或者输出格式是 iife 时默认启用，其他情况默认关——因为非打包输出可能被外部代码引用，删了不安全。0.13 之后可以用 --tree-shaking=true 强制开启、false 强制关闭。

esbuild 参考两类社区副作用标注：一是 package.json 的 sideEffects 字段，声明 false 表示未被使用的文件可以整体移除，这是 webpack 发起的约定；二是代码里的 PURE 注释，标注某个调用无副作用、返回值没人用就能删。如果第三方包标注错了导致产物缺代码，用 --ignore-annotations 兜底。

最后一点工程认知：ESM 的静态 import/export 最利于摇树；CommonJS 的动态语义常导致整体保留。所以库发 ESM 是体积友好的前提。
-->

---
layout: two-cols-header
---

# minify 与 target

::left::

**minify 三件事**

- 删空白
- 缩短标识符
- 改写更短语法

可分别用 `--minify-whitespace` 等单开；`--keep-names` 保留函数名

::right::

**target 与 ES5 边界**

- 取值：`es2020` / `chrome58,node18`
- 转不动 → **直接报错**，不静默
- ⚠️ **不支持降级到 ES5**
- ⚠️ 不注入 polyfill（≠ preset-env）

<!--
压缩与降级两组选项。

minify 做三件事：删空白、缩短标识符、把语法改写成更短的等价形式。三者可以用 minify-whitespace、minify-identifiers、minify-syntax 分别控制。压缩会破坏函数名时用 keep-names 保留。注意 minify 不会删 console——console 调用有副作用，删它要用专门的 drop 选项。

target 声明语法下限：可以写 es2020 这类版本，也可以写 chrome58、node18 这类引擎版本，逗号组合取交集。关键行为：遇到无法转换到目标的语法，esbuild 直接报错，绝不静默输出跑不起来的代码。

两条硬边界：第一，不支持把 ES6+ 降到 ES5，target=es5 只是保证不往 ES5 代码里引入新语法；第二，不注入 polyfill，target 只管语法不管运行时 API——这是它和 Babel preset-env 的本质差异。要 ES5 或 polyfill，外接 Babel/SWC。
-->

---

# define / external / drop

```bash
esbuild app.ts --bundle \
  --define:process.env.NODE_ENV='"production"' \
  --external:fsevents \
  --drop:console --drop:debugger
```

<v-clicks>

- **define**：标识符 → 常量表达式；字符串值必须带 **JSON 引号**
- **external**：排除打包、保留导入；Node 全外置用 `--packages=external`
- **drop**：移除 console/debugger（minify 不会删它们）

</v-clicks>

<!--
三个高频构建期改写选项。

define 把标识符替换成常量表达式，最常用于 NODE_ENV。经典坑：字符串值必须是 JSON 字符串——写 --define:K=production 不带引号，production 会被当成另一个标识符替换进去，运行时 ReferenceError。所以要单引号包着双引号。配合 minify，if (process.env.NODE_ENV !== 'production') 这类分支会被常量折叠后整段删除。

external 把匹配的依赖排除出 bundle、保留原始导入语句，运行时再加载。原生模块如 fsevents 是典型场景，支持通配符。给 Node 打包想把所有依赖都外置，一条 --packages=external 搞定。

drop 移除 console 和 debugger。注意不能用 define:console=undefined 替代——那会让 console.log() 变成在 undefined 上调方法，直接 TypeError；minify 也不删 console，因为调用有副作用。drop 才是正解。
-->

---

# watch + serve + live reload

```bash
esbuild app.jsx --bundle --outdir=www/js --watch --servedir=www
```

```js
// 页面里一行接入 live reload（SSE，不是 HMR）
new EventSource('/esbuild').addEventListener('change', () => location.reload())
```

<v-clicks>

- watch：**可移植轮询**（随机子集扫描，约 2s 全量覆盖一轮）
- serve：**按请求构建**——浏览器永远拿到最新产物，内存不落盘
- change 事件带 added/removed/updated → CSS 可免刷新热替换

</v-clicks>

<!--
开发体验三件套。

watch 监听文件自动重建。实现很特别：刻意不用各系统原生文件事件，而是为可移植性采用轮询——但每轮只扫随机子集来省 CPU，大项目约 2 秒全量覆盖一轮，最近变更过的路径每轮必查，所以连续编辑几乎即时感知。

serve 启动开发服务器，设计最巧的是按请求构建：每个请求到来时如果没有构建在进行就先重建再响应，浏览器永远拿到最新产物，从根上避免缓存失效问题。产物存内存不落盘。

live reload：serve 暴露 /esbuild 事件源，页面里订阅 change 事件、收到就整页刷新，一行代码接入。事件还带 added、removed、updated 文件列表，官方文档演示了据此做 CSS 免刷新热替换。但注意这不是 HMR——JS 状态不保留，HMR 在官方明确不做的清单里。
-->

---

# context API（v0.17+）

```js
const ctx = await esbuild.context({
  entryPoints: ['src/app.tsx'],
  bundle: true,
  outdir: 'dist',
})
await ctx.watch()                              // 自动重建
const { port } = await ctx.serve({ servedir: 'www' })
await ctx.rebuild()                            // 手动增量
await ctx.dispose()                            // 释放资源
```

<div v-click class="mt-3 text-sm">

> 0.17 把旧的 `incremental` / `build({watch})` / `serve()` 统一收敛为 context；三种增量姿势可叠加

</div>

<!--
JS API 里这套开发能力在 0.17 版本做了一次大重构，统一收敛为 context API。

esbuild.context 接收和 build 一样的选项，返回一个上下文对象，上面有四个方法：rebuild 手动触发增量构建，复用上次构建的工作；watch 开启文件监听自动重建；serve 启动开发服务器；dispose 等进行中的构建结束、停掉 watch 和 serve、释放资源。

watch 和 serve 可以叠加使用。旧写法 esbuild.build 传 watch: true、或者独立的 serve() 函数，在 0.17 之后都已移除——看到老教程要注意。

如果不喜欢内置的轮询 watch，标准替代姿势就是自己用 chokidar 之类的库监听，回调里调 ctx.rebuild()。配合插件的 onEnd 钩子还能拿到每次重建完成的通知，上层工具基本都是这么编排的。
-->

---

# 插件机制：onResolve + onLoad

```js
const envPlugin = {
  name: 'env',
  setup(build) {
    build.onResolve({ filter: /^env$/ }, () => (
      { path: 'env', namespace: 'env-ns' }))
    build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => (
      { contents: JSON.stringify(process.env), loader: 'json' }))
  },
}
```

<v-clicks>

- 插件 = `{name, setup(build)}`；**filter 是 Go 正则**，先于 JS 回调筛选
- 自定义 **namespace** = 虚拟模块（不走文件系统）
- 生命周期：onStart / onEnd / onDispose

</v-clicks>

<!--
插件机制。esbuild 插件作用在「模块的解析与加载」边界上，不碰 AST。

这是官网的虚拟模块示例：import 'env' 时返回构建期的环境变量。两步：onResolve 拦截匹配的导入路径，返回自定义 namespace，等于告诉 esbuild 这个模块不在磁盘上、别按文件路径找；onLoad 按 namespace 匹配，返回模块内容和解释方式，这里用 json loader。

性能关键设计：filter 是 Go 正则，在 Go 侧先行筛选，不必每个路径都回调到 JS——所以官方反复强调 filter 要尽量收窄，写 /.*/ 全量回调会吃掉性能红利。

还有三个生命周期钩子：onStart 每次构建开始、onEnd 构建结束且能读改构建结果、onDispose 清理。onEnd 配 watch 模式就是免费的「重建完成通知」。
-->

---

# 边界清单：esbuild 不做的事

| 不做 | 替代 |
|---|---|
| TS 类型检查 / .d.ts | tsc --noEmit / tsup |
| ES6+ → ES5、polyfill | Babel / SWC + core-js |
| HMR / 模块联邦 | Vite / webpack / Rspack |
| Vue/Svelte 等语言 | 社区插件 / 框架工具链 |
| 插件操作 AST | onLoad 里自接 Babel |

<!--
这页是 esbuild 的「不做」清单，全部来自官方 FAQ，注意是「有意不做」而不是「还没做」。

类型检查和 .d.ts 生成，交给 tsc；ES5 降级和 polyfill，交给 Babel 或 SWC；HMR，官方明确列入不做清单，live reload 只是整页刷新，要状态保留的热替换用 Vite；模块联邦不做；Vue、Svelte、Elm、Angular 这些其他语言不内置；插件不能操作 AST——AST 留在 Go 内部，这是性能优先的有意设计，要做表达式级改写就在 onLoad 里自己接 Babel。

HTML 内容类型目前「在考虑中」。作者的原话很坦诚：我不指望这些扩展点覆盖所有场景，需求非常定制就该用别的工具。

这种范围克制是 esbuild 的设计哲学：做稳定的基础设施层，不做 all-in-one 框架。评估选型时，把这页和你的需求对一遍，比看十篇评测都有用。
-->

---

# 生态位：被谁用、被谁追

<v-clicks>

- **Vite（7 及之前）**：dev 依赖预打包 + TS/JSX transform + 默认 minify 都是 esbuild；生产 bundle 用 Rollup
- **tsup**：基于 esbuild 的库打包事实标准
- **Amazon CDK / Phoenix**：函数与资产打包引擎
- **Rust 追赶者**：Rolldown（Vite 方向）/ Rspack（webpack 兼容）/ Oxc
- 版本语义：**patch 兼容、minor 破坏** → 安装带 `--save-exact`

</v-clicks>

<!--
esbuild 在 2026 年生态里的位置。

Vite 是最大的使用方：dev 阶段的依赖预打包 optimizeDeps、TS 和 JSX 的单文件转译、默认的 JS/CSS 压缩器，全是 esbuild；生产 bundle 用 Rollup。这种双引擎架构带来的 dev/prod 行为差异，正是 Rolldown 要统一解决的问题——Rolldown 化的 Vite 正在推进。tsup 是基于 esbuild 的库打包事实标准；Amazon CDK、Phoenix 框架拿它打包函数和资产。

Rust 系追赶者：Rolldown 对齐 Rollup API、Rspack 兼容 webpack、Oxc 做解析转换基建。它们的竞争逻辑都是「esbuild 证明了原生化的收益，我们再补上它刻意不做的部分」。

最后版本语义，反直觉但重要：esbuild 仍是 0.x，官方约定 patch 向后兼容、minor 承载破坏性变更——0.27 升 0.28 必须读 changelog。这就是官方安装命令带 --save-exact 的原因。FAQ 自评 late-stage beta，维护态，剩余路线图就是拆分改进和 HTML 支持两件事。
-->

---

# 常见坑 & Tips

<v-clicks>

- `^0.27.0` 把破坏性 minor 拉进来 → **锁精确版本**
- CI 没跑 `tsc --noEmit` → 类型错误带上生产
- `--define` 字符串忘 JSON 引号 → 运行时 ReferenceError
- 顶层 await 配 cjs/iife → 仅 **esm** 支持
- 指望 `--target=es5` 降级 → 直接报错，外接 Babel
- 插件 filter 写 `/.*/` → Go↔JS 往返吃掉性能

</v-clicks>

<!--
高频坑汇总。

第一，版本：caret range 会把破坏性 minor 自动升进来，esbuild 必须锁精确版本。第二，类型：esbuild 不查类型，CI 里不并行跑 tsc --noEmit，类型错误就直接带上生产。第三，define 的字符串值必须是 JSON 字符串，忘了内层双引号就被当标识符替换，运行时 ReferenceError。

第四，顶层 await 只在 esm 输出格式下支持，cjs 和 iife 直接报错，因为 require 是同步的。第五，不要指望 target=es5 做降级，esbuild 不支持 ES6+ 转 ES5，遇到就报错，旧浏览器兼容要外接 Babel 或 SWC。第六，写插件时 filter 是性能开关，写成全量匹配，每个路径都要从 Go 回调到 JS，性能红利就没了。

再补一个认知：esbuild 没有配置文件，这也是有意设计——一切显式传参，要复用就封装构建脚本。
-->

---
layout: intro
---

# 总结

esbuild = **极速打包器 + 压缩器，范围刻意克制**

- 快的根基：Go 原生 + 全并行 + 自研一切 + AST 只过三遍
- 会做：bundle / TS / JSX / CSS / 摇树 / 拆分(esm) / watch / serve / 插件
- 不做：类型检查、ES5、polyfill、HMR、AST 插件——各有明确替代
- 2026：0.28.x 维护态，Vite/tsup/CDK 的底层引擎；Rust 系在追，地位仍稳

<!--
总结。

esbuild 是极速的打包器兼压缩器，快的根基是四件事：Go 原生代码、全阶段并行、一切自研、AST 只过三遍——速度来自架构而非缓存。

它会做的：打包、TS/JSX 转译、一等公民的 CSS、tree shaking、esm 代码拆分、watch、serve、克制的插件机制。它明确不做的：类型检查、ES5 降级、polyfill、HMR、AST 插件——每一项都有清晰的替代工具，组合使用就是现代工具链的标准形态。

2026 年的现状：版本 0.28.x，注意 minor 即破坏、要锁版本；项目处于维护态，但作为 Vite、tsup、CDK 们的底层引擎，它是基础设施级的存在。Rust 系的 Rolldown、Rspack 在崛起，但 esbuild 证明并定义的「原生化极速构建」这件事，短期内仍绕不开它。谢谢大家。
-->
