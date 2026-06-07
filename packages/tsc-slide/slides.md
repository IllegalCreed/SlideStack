---
theme: seriph
background: https://cover.sli.dev
title: Welcome to tsc
info: |
  Presentation tsc — the TypeScript compiler.

  Learn more at [https://www.typescriptlang.org](https://www.typescriptlang.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🧩</span>
</div>

<br/>

## tsc — TypeScript 官方编译器

类型检查 + 产出 JS 的双职责工具，是整个生态唯一做完整类型检查的工具。2026 年正从 JavaScript 实现（6.0）走向 Go 原生重写（7.0「tsgo」，约 10×）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/microsoft/TypeScript" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 tsc —— TypeScript 的官方编译器。

一句话定位：它对带类型标注的 .ts 做两件事，类型检查和产出 JS。最关键的是，整个 TS 生态里只有 tsc 做完整的跨文件类型检查，其它工具都只是逐文件剥类型。

2026 年它正处历史转折点：6.0 是最后一个 JavaScript 实现版本，7.0 用 Go 原生重写，代号 tsgo，提速约 10 倍。

顺序：为什么需要它 → 双职责 → 安装 → tsconfig 核心 → target → strict → 与转译器之别 → 单文件约束 → 声明与分工 → 工程引用 → 6.0 变化 → 7.0 tsgo → 踩坑 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么需要 tsc？

`.ts` 浏览器和 Node 都不认：

<v-clicks>

- 运行时不理解类型标注
- 旧环境不支持新语法
- 库要有 `.d.ts` 才有类型提示

</v-clicks>

<div v-click class="mt-6">

一份 `tsconfig.json` 搞定三件事：

- 类型**校验后抹去**
- 新语法**降级**
- 为库**产出 .d.ts**

</div>

<!--
直接写 .ts，浏览器和 Node 都不认：运行时不理解类型标注，旧环境不支持新语法，库还需要 .d.ts 才能给使用方类型提示。

tsc 把这三件事统一在一份 tsconfig.json 下完成：把类型校验后抹去、把新语法降级、为库产出声明文件。而且它的类型语义就是 TypeScript 语言本身的定义。
-->

---

# tsc 干两件事

| 职责 | 做什么 |
|---|---|
| **类型检查** | 找出类型错误：传错参数、可能为 null、访问不存在的属性 |
| **emit** | 抹类型 + 按 target 降级 + 按 module 转换 → `.js` |

<div v-click class="mt-4">

> 关键认知：**只有 tsc 做类型检查**。Babel / SWC / esbuild 都只「逐文件剥类型」，语法对就放行，类型错了照样产出。

</div>

<!--
tsc 干两件事：一是类型检查，依据标注和推断找出类型错误；二是 emit，把类型抹掉、按 target 降级语法、按 module 转换模块格式，产出 JS，可选地产出声明和 source map。

最关键的认知：只有 tsc 做类型检查。Babel、SWC、esbuild 都只是逐文件剥掉类型再转译，语法对就放行，类型错了它们照样产出。
-->

---
layout: two-cols-header
---

# 安装与第一次编译

::left::

**安装 + 初始化**

```bash
npm i -D typescript
npx tsc --init
```

**常用命令**

```bash
npx tsc        # 检查 + 产出
tsc --noEmit   # 只检查
tsc -w         # 监听
```

::right::

**最小 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "nodenext",
    "outDir": "./dist",
    "strict": true,
    "declaration": true
  },
  "include": ["src"]
}
```

<!--
安装很简单：npm i -D typescript 提供 tsc 命令，tsc --init 生成带注释的 tsconfig。

常用命令：tsc 读 tsconfig 做检查加产出；tsc --noEmit 只检查不产出，常用于把 emit 交给别的工具时；tsc -w 监听。

右边是最小配置：target 决定降级目标，module 决定模块格式，outDir 产物目录，strict 开严格检查，declaration 顺带产出声明。
-->

---

# tsconfig 核心选项

| 选项 | 作用 |
|---|---|
| `target` | 降级到哪代 ES（6.0 起最低 es2015） |
| `module` | 输出模块格式（nodenext / esnext / commonjs） |
| `moduleResolution` | 如何解析 import（bundler / nodenext） |
| `strict` | 一组严格检查（**6.0 默认 true**） |
| `outDir` / `rootDir` | 产物目录 / 源码根 |
| `declaration` | 产出 `.d.ts` |
| `noEmit` | 只检查不产出 |

<!--
tsconfig 最常用的几组选项：target 降级目标，6.0 起最低 es2015；module 输出哪种模块格式；moduleResolution 怎么解析 import 路径，交打包器用 bundler；strict 一次开启全套严格检查，6.0 起默认 true；outDir 和 rootDir 决定产物目录和源码根；declaration 产出声明；noEmit 只检查不产出。
-->

---

# target：只降语法，不补 API

```json
{ "compilerOptions": { "target": "es2015" } }
```

<v-clicks>

- 把 `async/await`、可选链等**语法**降级
- **不注入** `Promise` / `includes` / `fromEntries` 等运行时 API
- 缺的内置 API 要靠 core-js 等 polyfill 补

</v-clicks>

<div v-click class="mt-4">

> tsc 不打包、不注入 polyfill —— 那是打包器 + core-js 的活。

</div>

<!--
一个高频误区：target 只做语法降级，比如把 async/await、可选链降掉，但它不会注入运行时 API 的 polyfill。

Promise、数组的 includes、Object.fromEntries 这些是内置 API，旧环境缺了得靠 core-js 这类 polyfill 补，tsc 不管。tsc 既不打包也不注入 polyfill，那是打包器加 core-js 的职责。
-->

---

# strict：一组严格检查（6.0 默认）

`strict: true` 一次开启 8 项：

<v-clicks>

- `strictNullChecks` —— null / undefined 误用
- `noImplicitAny` —— 隐式 any
- `strictFunctionTypes` —— 函数参数型变
- `strictPropertyInitialization` —— 类字段未初始化

</v-clicks>

<div v-click class="mt-3 text-sm">

> ⚠️ TS 6.0 把 strict 设为默认：没显式设过的旧项目升级即报错，多为 strictNullChecks。

</div>

<!--
strict 是个全家桶开关，一次开启 8 项严格检查，常见的有：strictNullChecks 拦截 null/undefined 误用，noImplicitAny 拦隐式 any，strictFunctionTypes 管函数参数型变，strictPropertyInitialization 管类字段未初始化。

TS 6.0 最大的行为变化之一就是把 strict 设成默认值。没显式设过 strict 的旧项目升级 6.0 后，等于一次性继承了全套严格检查，最常见的就是 strictNullChecks 带来的「对象可能为 null」报错。
-->

---

# tsc vs 只剥类型的转译器

| 工具 | 语言 | 类型检查 | emit |
|---|---|---|---|
| **tsc** | TS | ✅ 唯一 | ✅（慢） |
| SWC | Rust | ❌ | ✅ 极快 |
| esbuild | Go | ❌ | ✅ 极快 |
| Babel | JS | ❌ | ✅ 慢 |

<div v-click class="mt-4">

> 现代工程：**emit 交快工具，类型检查交 `tsc --noEmit`**，两者并行跑。

</div>

<!--
把这几个工具放一起对比：只有 tsc 做类型检查，但它又检查又 emit，比较慢。SWC 是 Rust、esbuild 是 Go，都极快但不做类型检查；Babel 是 JS，慢且不检查。

所以现代工程的标准做法是分工：emit 交给 SWC 或 esbuild 这类快工具，类型检查交给 tsc --noEmit，两者并行跑，CI 里都跑一遍。
-->

---

# 为单文件转译器让路

emit 交给 SWC / esbuild 时，开两个开关：

<v-clicks>

- **`isolatedModules`**：强制每文件可独立转译，提前拦下 `const enum`、重导出类型等坑
- **`verbatimModuleSyntax`**：照字面保留 import / export

</v-clicks>

```ts
import { type Foo, bar } from "./mod"; // Foo 删，bar 留
```

<!--
当 emit 交给逐文件转译的 SWC、esbuild 时，建议在 tsc 侧开两个开关。

isolatedModules 强制每个文件都能被单独转译，提前帮你拦下那些单文件工具会出错的写法，比如 const enum 跨文件内联、重导出类型必须写 export type。

verbatimModuleSyntax 让 import/export 照字面保留：标了 import type 的一定删，没标的一定留，消除「这个 import 会不会进产物」的歧义。
-->

---

# 声明文件与构建分工

库构建的现代分工：

<v-clicks>

- **快工具**（SWC / esbuild / tsup）负责产 `.js`
- **tsc** `--emitDeclarationOnly` 负责产 `.d.ts`
- `isolatedDeclarations`：让快工具也能并行产 `.d.ts`

</v-clicks>

<div v-click class="mt-4">

> 各取所长：速度归 Rust / Go 工具，类型权威归 tsc。

</div>

<!--
现代库构建是分工协作：用 SWC、esbuild、tsup 这类快工具极速产出 .js，用 tsc 的 emitDeclarationOnly 单独产出权威的 .d.ts 声明。

更进一步，5.5 引入的 isolatedDeclarations 约束，要求每个导出都有显式返回类型，这样连 SWC、oxc、tsgo 这些第三方工具也能并行、快速地产出声明，不必再回头调用慢速 tsc。各取所长：速度归 Rust/Go 工具，类型权威归 tsc。
-->

---
layout: two-cols-header
---

# Project References + 增量

::left::

**分块 + 按依赖增量构建**

```json
{
  "compilerOptions": {
    "composite": true
  },
  "references": [
    { "path": "../shared" }
  ]
}
```

::right::

**构建命令**

```bash
tsc -b          # 拓扑增量
tsc -b --watch  # 监听
tsc -b --force  # 强制全量
```

<div class="text-sm mt-2">

> `composite` 隐式开 `declaration` + `incremental`，状态存 `.tsbuildinfo`。

</div>

<!--
大型 monorepo 用 Project References 分块构建：每个子工程设 composite，主工程用 references 串联，再用 tsc -b 按依赖拓扑顺序增量构建。

composite 会隐式开启 declaration 和 incremental，并要求所有源文件都在 include 里。增量状态存在 .tsbuildinfo，把它纳入 CI 缓存能显著提速。tsc -b --force 可强制全量重建。
-->

---

# TypeScript 6.0：最后的 JS 实现版

<v-clicks>

- **`strict` 默认 `true`** —— 最易「升级即报错」
- **`target: es5` 弃用** —— 最低 es2015
- **移除 `amd` / `umd` / `systemjs` / `none`**
- **ES2025 类型**：Temporal、`Map.getOrInsert`、`RegExp.escape`
- 逃生舱 `ignoreDeprecations: "6.0"`（7.0 移除）

</v-clicks>

<!--
TS 6.0 是 JS 实现的收官版，专门为切到 Go 原生版清场，几个关键变化：

strict 默认 true，最容易升级即报错；target es5 弃用，最低提到 es2015；移除了 amd、umd、systemjs、none 这些遗留模块格式；新增 ES2025 的 Temporal、Map.getOrInsert、RegExp.escape 等类型支持。

还有个逃生舱 ignoreDeprecations 6.0，能临时压制弃用项报错，但只是缓冲，7.0 会彻底移除。
-->

---
layout: two-cols-header
---

# TS 7.0「tsgo」：Go 原生重写

::left::

**为什么**

tsc 是纯 JS、单线程，大项目慢。微软用 **Go** 重写（Project Corsa）。

```bash
npm i -D @typescript/native-preview
npx tsgo --noEmit
```

::right::

**官方实测约 10×**

| 项目 | JS 版 | 原生 |
|---|---|---|
| VS Code | 77.8s | 7.5s |
| 编辑器加载 | 9.6s | 1.2s |

<div class="text-sm mt-2">

> 是 **Go**，不是 Rust。语义对齐（约 99.6%）。

</div>

<!--
重头戏：TS 7.0 用 Go 原生重写，代号 Project Corsa，原生命令叫 tsgo。

动因就是 tsc 太慢：纯 JS、单线程，大项目类型检查和编辑器加载都吃力。官方实测约 10 倍提速，VS Code 一百五十万行从 77.8 秒降到 7.5 秒，编辑器加载从 9.6 秒降到 1.2 秒。

划重点：是 Go，不是 Rust，这是高频误传。现在用 @typescript/native-preview 预览，命令 tsgo，可与现有 typescript 并存。语义对齐，通过约 99.6% 的兼容性测试。
-->

---

# 常见坑 & Tips

<v-clicks>

- 命令行**指定文件会整体忽略 tsconfig**
- `paths` 只在类型层，**产物路径不重写** → 运行时报错
- `target` 只降语法，**不补 polyfill**
- 默认 `noEmitOnError: false` —— 报错也照样产出
- TS 7.0 是 **Go** 重写（不是 Rust）

</v-clicks>

<!--
高频坑汇总：命令行一旦指定输入文件，整份 tsconfig 都被忽略；paths 别名只在类型层生效，产物路径不会被重写，只配 tsconfig 不配打包器运行时会报找不到模块；target 只降语法不补 polyfill；默认 noEmitOnError 是 false，类型报错也照样产出 JS；最后，TS 7.0 是 Go 重写不是 Rust。
-->

---
layout: intro
---

# 总结

tsc = **类型检查的唯一权威 + TS 语义参考实现**

- 双职责：类型检查 + emit；只有它做完整类型检查
- 现代分工：emit 交快工具，`tsc --noEmit` 把关类型
- 2026：6.0 收官 JS 实现，7.0「tsgo」Go 重写约 10×
