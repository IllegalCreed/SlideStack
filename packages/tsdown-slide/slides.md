---
theme: seriph
background: https://cover.sli.dev
title: Welcome to tsdown
info: |
  Presentation tsdown — The Elegant Bundler for Libraries.

  Learn more at [https://tsdown.dev](https://tsdown.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📦</span>
</div>

<br/>

## tsdown — The Elegant Bundler for Libraries

Rolldown 官方的库打包器、tsup 的精神继任者：为 TS/JS 库提供构建 + dts + exports + 发布校验的开箱工作流。2026-06 最新 0.22.x，未到 1.0

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/rolldown/tsdown" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 tsdown——官网一句话定位：The Elegant Bundler for Libraries，优雅的库打包器。它有两个关键身份：Rolldown 的官方项目，以及 tsup 的精神继任者。

它给 TypeScript/JavaScript 库作者提供从构建、声明文件、exports 生成到发布校验的整条开箱工作流。2026 年 6 月的现状：最新版本 0.22.x（写作时 0.22.2），还没到 1.0，但已经是 Rolldown 生态钦定的库打包标准件。

今天的顺序：定位 → 为什么接班 tsup → 快速上手 → 默认值 → 配置文件 → format/platform/target → dts → 依赖策略 → 从 tsup 迁移 → 插件生态 → exports 自动生成 → 发布质检 → hooks → 横向对比 → 版本与生态 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为库而生，不是为应用

写**库**（npm 包 / 组件库 / SDK）才用它：

<v-clicks>

- **Rolldown 官方项目**：引擎是 Rust 实现的通用打包器 Rolldown
- tsdown = 引擎之上的**库场景开箱方案**
- 合理默认值 + 自动 dts + exports 生成 + 发布校验
- 官方明确：将作为 Rolldown-Vite **Library Mode** 的基础

</v-clicks>

<div v-click class="mt-6">

> 写应用 → Vite / Rolldown 本体；写库 → tsdown

</div>

<!--
第一件事先分清定位：tsdown 是给库用的，不是给应用用的。

它和 Rolldown 的关系要讲清楚：Rolldown 是 Rust 实现的通用打包器，直接拿它打库，你要自己配依赖外部化、声明文件、多格式输出、package.json 元数据。tsdown 作为 Rolldown 的官方项目，在引擎之上叠加了库场景的完整开箱方案——合理默认值、自动 dts、exports 生成、发布校验，官方称之为 a complete out-of-the-box solution for library authors。

官方还明确了一个重要信息：tsdown 将作为 Rolldown-Vite Library Mode 的基础。

一句话总结：写 npm 包、组件库、SDK，默认就该考虑 tsdown；写应用，用 Vite 或 Rolldown 本体。
-->

---

# 为什么能接班 tsup

```text
tsup（esbuild） ──▶ tsdown（Rolldown + Oxc）
```

<v-clicks>

- 官方 FAQ：「the **spiritual successor** to tsup, powered by **Rolldown** instead of esbuild」
- **兼容 tsup 主要选项与特性** → 迁移近零成本
- Rust 引擎打包更快，dts 走 Oxc 系极速路径
- 补全发布工作流：自动 `exports`、publint/attw、workspace、CSS 支持
- 插件生态更广：Rolldown / Rollup / unplugin / 部分 Vite 插件

</v-clicks>

<!--
为什么说它接班 tsup？官方 FAQ 原话：tsdown 是 the spiritual successor to tsup, powered by Rolldown instead of esbuild——tsup 的精神继任者，底层引擎从 esbuild 换成了 Rolldown。注意不是 tsup 改名，也不是 tsup 插件，是 Rolldown 团队的独立新项目。

它兼容 tsup 的主要选项与特性，迁移近零成本，后面会讲官方的一键迁移工具。

引擎升级带来速度：Rust 的 Rolldown 打包，加上 Oxc 系的极速 dts 生成。更重要的是它补全了 tsup 没有的发布工作流：自动生成 package.json exports、publint 和 attw 发布校验、内置 workspace 构建、CSS 支持。

插件生态也更广：Rolldown、Rollup、unplugin 插件，还有部分 Vite 插件都能用。
-->

---
layout: two-cols-header
---

# 快速上手：零配置构建

::left::

**安装与构建**

```bash
npm i -D tsdown
npx tsdown
# ✓ dist/index.mjs
```

约定入口 `src/index.ts`，存在即构建

::right::

**日常 scripts**

```json
{
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch"
  }
}
```

> 运行 tsdown 需 **Node.js 22.18+**（产物可面向更低版本）

<!--
上手非常简单：npm i -D tsdown 装成开发依赖——注意是 devDependencies，构建工具不进运行时依赖，也不需要全局安装。然后 npx tsdown 直接构建，零配置。

约定入口是 src/index.ts，存在就用；默认输出 dist/index.mjs——默认 ESM、默认 dist 目录，Node 平台固定 .mjs 扩展名。

日常把 build 和 dev 写进 scripts。--watch 或简写 -w 是内置监听模式，文件一变自动重建，还能指定监听路径、用 --ignore-watch 忽略目录，配置里写 watch.include/exclude 精细控制。不需要 nodemon 包一层。

一个环境要求要注意：运行 tsdown 本身需要 Node 22.18 以上，但产物可以面向更低版本的 Node。
-->

---

# 必须记住的默认值（vs tsup）

| 选项     | tsdown                              | tsup    |
| -------- | ----------------------------------- | ------- |
| `format` | **`esm`**                           | `cjs`   |
| `clean`  | **开**（构建前清空 outDir）         | 关      |
| `dts`    | 有 `types`/`typings` 字段**自动开** | 关      |
| `target` | 自动读 `engines.node`               | 无      |
| `entry`  | `src/index.ts`（存在时）            | 需指定  |

<div v-click class="mt-3">

> 另：outDir 默认 `dist/`、platform 默认 `node`、**tree-shaking 默认开**（`--no-treeshake` 关）

</div>

<!--
tsdown 的「优雅」一半来自默认值，从 tsup 迁过来的人尤其要背这张表。

format 默认 esm，tsup 是 cjs——拥抱 ESM 优先。clean 默认开，每次构建前清空 outDir，tsup 默认关，迁移后残留文件会被清掉，别意外。dts 在 package.json 有 types 或 typings 字段时自动开启，tsup 永远要手开 dts: true——实际发包必写 types 字段，所以通常根本不用配。target 自动读取 engines.node 推导目标。entry 约定 src/index.ts。

另外几个：outDir 默认 dist，platform 默认 node，tree-shaking 默认开启、未用到的导出会被剔除，要保留全部代码用 --no-treeshake 或 treeshake: false 关掉。
-->

---

# 配置文件与 entry

```ts
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
});
```

<v-clicks>

- 支持 `.ts/.mts/.cts/.js/.mjs/.cjs/.json`，或写 package.json 的 `tsdown` 字段
- `--config` 指定路径、`--no-config` 禁用；**返回数组**可定义多份构建
- `entry` 四种写法：字符串 / 数组 / 对象命名入口 / glob（`src/**/*.ts`）

</v-clicks>

<!--
复杂项目用配置文件。tsdown.config.ts 配 defineConfig 拿完整类型提示；扩展名 ts、mts、cts、js、mjs、cjs、json 都支持，也可以直接写在 package.json 的 tsdown 字段里。

CLI 上 --config 指定路径，--no-config 完全禁用配置文件。配置返回数组可以一次定义多份构建。

entry 很灵活，四种写法：字符串、数组、对象命名入口比如 main 指向 src/index.ts、glob 模式比如 src 下所有 ts 再排除测试文件。CLI 也可以直接传文件：tsdown src/a.ts src/b.ts。

还有个实验性的 --from-vite，复用 vite.config 的 resolve、plugins 等部分选项，库和站点共配置时可以试，注意只支持子集。
-->

---

# format / platform / target

<v-clicks>

- `format: ['esm','cjs']` → 一次构建产出 `index.mjs` + `index.cjs`
- Node 平台**固定扩展名**消除 `type` 字段歧义；自定义用 `outExtensions`（复数）
- `platform` 默认 **node**（可选 browser / neutral）；**CJS 格式下恒为 node**
- `target` 自动读 `engines.node`——**只转语法，不注入 polyfill**
- IIFE / UMD 产物默认带格式名：`index.iife.js` / `index.umd.js`

</v-clicks>

<!--
输出相关的三个选项。

format 传数组，一次构建同时产出多格式，不用跑两遍命令。Node 平台默认固定扩展名：ESM 产 .mjs、CJS 产 .cjs，从扩展名层面消除 package.json type 字段的歧义；要自定义扩展名用 outExtensions——注意是复数，tsup 里是单数 outExtension。

platform 默认 node，面向 Node 及兼容运行时，内置模块直接外部化；可选 browser 和 neutral。一条硬规则：CJS 格式下 platform 恒为 node，不可更改。

target 控制语法降级，默认自动读 engines.node。关键边界：只转语法，不注入运行时 polyfill——目标环境缺 Promise 这类 API 它不会帮你补，这点和 Babel preset-env 不同。

顺带提 shims 的精确语义：CJS 产物里的 import.meta.url 始终自动垫片；ESM 里要用 __dirname、__filename 得显式开 shims: true；Node 平台 ESM 的 require 则无论开关都会自动注入。
-->

---

# dts：oxc 极速路径 vs tsc 回退

| 条件                                | 引擎              | 特点               |
| ----------------------------------- | ----------------- | ------------------ |
| tsconfig 开 `isolatedDeclarations`  | **oxc-transform** | 「extremely fast」 |
| 未开启                              | TypeScript 编译器 | 可靠但相对慢       |

<v-clicks>

- 原理：导出带**显式类型** → 声明**逐文件独立生成**，无需 tsc 全局推导
- 双格式：ESM 的 js 与 d.ts **同构建**产出；**CJS 声明走独立构建**保证 require 兼容
- 复杂第三方类型出问题 → `dts: { resolver: 'tsc' }` 提高兼容性

</v-clicks>

<!--
dts 生成是 tsdown 的招牌能力，内部用 rolldown-plugin-dts，存在两条路径。

tsconfig 开了 isolatedDeclarations，就用 Rust 的 oxc-transform 直接产声明，官方称 extremely fast，这是推荐路径；没开就回退到 TypeScript 编译器，可靠但相对慢。

为什么 isolatedDeclarations 能快这么多？它强制每个文件的导出都带显式类型标注，声明文件因此可以逐文件独立生成，不再需要跨文件的全局类型推导——这才轮得到 Rust 工具上场，跳过了 tsc 整个项目级推导管线。代价是写代码要补全导出类型，编辑器会提示。

双格式时的行为要注意：ESM 的 js 和 d.ts 在同一构建中产出；CJS 的声明文件由一个独立构建过程专门生成，保证 CommonJS 解析模式下类型兼容——构建日志里能看到这个额外任务。

declaration map 用 tsconfig 的 declarationMap 或 dts.sourcemap 开；第三方复杂类型打包出问题，可以指定 resolver: 'tsc' 提高兼容性。
-->

---

# 依赖处理：发布友好的默认策略

<v-clicks>

- `dependencies` / `peerDependencies` / `optionalDependencies` → **默认外部化**
- `devDependencies` 与幻影依赖 → **被 import 才打进产物**
- 精细控制走 `deps`：

</v-clicks>

<div v-click>

```ts
export default defineConfig({
  deps: {
    neverBundle: ["vue"],     // 强制外置
    alwaysBundle: ["lodash"], // 强制打入
  },
});
```

</div>

<!--
依赖处理是按 package.json 里的角色自动决策的，对库发布场景非常友好。

dependencies、peerDependencies、optionalDependencies 默认外部化——不进 bundle，留给使用方安装。devDependencies 和幻影依赖（装了但没在 package.json 声明的）只要被源码 import 就会打进产物，因为它们不随包发布，不打进去用户就拿不到。

要精细控制走 deps 配置：neverBundle 强制外置、alwaysBundle 强制打入、onlyBundle 是白名单模式（打包白名单之外的会报错）、skipNodeModulesBundle 把 node_modules 全部外置。

旧的 external、noExternal 选项已经分别映射成 deps.neverBundle 和 deps.alwaysBundle，暂时可用但会有废弃警告。
-->

---

# 从 tsup 迁移：一条命令

```bash
npx tsdown-migrate --dry-run   # 先预览
npx tsdown-migrate             # 改配置 / 改 import / 装依赖
npx tsdown-migrate packages/*  # monorepo 批量
```

<v-clicks>

- 工具会改文件 → **迁移前先提交存档**
- 核对默认值翻转：`format` cjs→**esm**、`clean` 关→**开**
- 重命名：`cjsInterop`→`cjsDefault`、`esbuildPlugins`→`plugins`、`outExtension`→`outExtensions`
- 已废弃映射：`entryPoints`→`entry`、`bundle:false`→`unbundle:true`、`external`→`deps.neverBundle`

</v-clicks>

<!--
迁移有官方 CLI：npx tsdown-migrate，自动改写配置、改 import、重命名选项，迁移后还会自动装依赖。--dry-run 先预览不落盘，monorepo 传目录或 glob 批量迁移。注意工具会修改文件，官方提醒迁移前先保存或提交当前改动。

迁移后人工核对三类点。第一，默认值翻转：不写 format 时产物从 cjs 变 esm；clean 从关变开，残留文件会被清掉。第二，选项重命名：cjsInterop 改 cjsDefault、esbuildPlugins 改 plugins、outExtension 改复数 outExtensions，这三组是官方迁移指南明确要求更新的。第三，一批暂时可用但已废弃的映射：entryPoints 对 entry、bundle: false 对 unbundle: true、external 对 deps.neverBundle、publicDir 对 copy。

顺带说 cjsDefault，它默认开启：模块只有单一 default 导出且目标是 CJS 时，JS 产物转成 module.exports =，声明转成 export =，require 直接拿到导出本体，不用再 .default 一层。

unbundle: true 替代 tsup 的 bundle: false：产物镜像源码目录结构，每个模块一个输出文件，常配 glob 入口使用。
-->

---

# 插件生态与不支持项

```ts
// Before: import macros from "unplugin-macros/esbuild"
import macros from "unplugin-macros/rolldown"; // 改子路径即可

export default defineConfig({ plugins: [macros()] });
```

<v-clicks>

- 支持 **Rolldown / Rollup / unplugin** 插件与部分 Vite 插件
- **esbuild 插件不可用**（无兼容层），必须替换实现
- `splitting: false` 不支持——代码分割**恒开**，关不掉
- `metafile` → 改用 `devtools: true`；无 `swc` / `experimentalDts`

</v-clicks>

<!--
插件是迁移里少数要动真格的点。

tsdown 支持 Rolldown、Rollup、unplugin 插件和部分 Vite 插件，这是它相对 tsup 的生态优势。但不支持 esbuild 插件——没有兼容层，esbuild 插件协议和 Rolldown 不互通，必须换成兼容实现。unplugin 系插件最省事，把导入子路径从 /esbuild 改成 /rolldown 就行。

还有几个 tsup 选项在 tsdown 里没有对应。splitting: false 不被支持，tsdown 的代码分割始终开启，关不掉。metafile 没有了，产物分析改用 devtools: true，走 Vite DevTools 集成。swc 集成没有，内部已经用 oxc；experimentalDts 直接用标准 dts；legacyOutput 也没有。

IIFE 命名也变了：tsup 的 [name].global.js 在 tsdown 是 [name].iife.js，要保持旧文件名用 outputOptions.entryFileNames 自定义。
-->

---

# exports 自动生成：告别手写 package.json

```ts
export default defineConfig({
  format: ["esm", "cjs"],
  dts: true,
  exports: true, // 构建后自动回写 package.json
});
```

<v-clicks>

- 分析入口与产物 → 自动维护 `exports`（`types` / `import` / `require` 条件导出）
- `legacy: true` 连带生成顶层 `main`/`module`/`types`；`all` 导出全部；`customExports` 微调
- 手写 exports 与产物不一致是发布头号事故源——**这是 tsup 没有的能力**

</v-clicks>

<!--
exports: true 是 tsup 没有的能力，也是 tsdown 发布工作流的核心一环。

开启后，tsdown 在构建后分析入口与产物，自动生成并回写 package.json 的 exports 字段——双格式时自动带上 types、import、require 条件导出，多入口各自映射。它是真实更新 package.json 文件，不是只校验打警告。

默认只写 exports 字段；exports.legacy: true 时连同顶层 main、module、types 一起生成，兼容旧工具；exports.all 导出所有相关产物文件而不只是入口；customExports 传对象或函数做最终微调。CSS 不分割时，产物 style.css 也会自动进 exports。

为什么重要？手写 exports 和产物不一致，是库发布的头号事故源——格式漏映射、路径写错、types 指错位置。exports: true 把 exports 变成构建产物的一部分，从根上消灭这类事故。
-->

---

# 发布质检：publint + attw + --unused

```ts
export default defineConfig({
  publint: true,               // 包规范校验
  attw: { profile: "node16" }, // 类型解析校验
});
```

<v-clicks>

- 二者是**可选依赖**，用才装：`npm i -D publint @arethetypeswrong/core`
- 支持 **`'ci-only'`**：本地构建跳过、CI 里强制——质检不拖慢迭代
- `tsdown --unused`：检查声明了却没用到的依赖
- attw profile：`strict`（默认）/ `node16` / `esm-only`

</v-clicks>

<!--
发布前的质量门禁，tsdown 内置了两个校验集成。

publint 校验 package.json 与产物的一致性和规范性，可以配 level: 'error' 提级。attw 是 Are The Types Wrong，校验类型在不同模块解析策略下是否正确，profile 有 strict（默认）、node16、esm-only，还能 ignoreRules 忽略特定规则。配合前面 CJS 声明独立构建的设计，能把「CJS 下类型解析错误」这类事故拦在本地。

注意两者都是可选依赖——不内置在 tsdown 依赖里，要用就自己装 publint 和 @arethetypeswrong/core，然后配置 publint: true、attw: true，或者 CLI 加 --publint --attw。

很贴心的 'ci-only' 模式：本地构建跳过校验、CI 里强制执行，质检不拖慢日常迭代。另有 tsdown --unused 检查 package.json 里声明了却没用到的依赖。

CI 的标准套路：tsdown && tsc --noEmit——tsdown 管产物，tsc 管类型把关，因为 tsdown 和 tsup 一样不做类型检查。
-->

---

# hooks：受 unbuild 启发的生命周期

```ts
export default defineConfig({
  hooks: {
    "build:prepare": (ctx) => {}, // 每次构建开始前
    "build:before": (ctx) => {},  // 每个 Rolldown 构建前
    "build:done": (ctx) => {},    // 构建完成后
  },
});
```

<v-clicks>

- 基于 **hookable**；也可函数式：`hooks(h) { h.hook("build:done", fn) }`
- 多格式时 `build:before` **按格式各触发一次**
- 构建级生命周期，**不同于** Rollup 插件钩子（buildStart / transform…）

</v-clicks>

<!--
hooks 体系受 unbuild 启发，基于 hookable 库实现，一共三个钩子：build:prepare 在每次构建开始前触发，build:before 在每个 Rolldown 构建前触发，build:done 在构建完成后触发。

注意 build:before 的触发粒度：双格式构建时，每种格式各触发一次。

注册方式有两种：配置里直接写 hooks 对象，键是钩子名、值是回调，回调能拿到构建上下文；或者函数式写法，hooks 函数接收 hookable 实例，调 hook 方法注册。

要和 Rollup 插件钩子区分开：buildStart、transform、generateBundle 那套是插件体系的钩子；tsdown hooks 是构建级生命周期，名字都带 build: 前缀，作用在整个构建流程层面。钩子在本地构建时触发，npm 发布不在 tsdown 流程里。
-->

---

# 对比 tsup / unbuild

| 维度                  | tsdown                        | tsup           |
| --------------------- | ----------------------------- | -------------- |
| 引擎                  | Rolldown（Rust）              | esbuild（Go）  |
| 默认 format / clean   | esm / 开                      | cjs / 关       |
| exports 回写 + 质检   | ✅ 内置                       | ❌             |
| monorepo              | ✅ `--workspace` + `--filter` | 需 turbo/lerna |

<div v-click class="mt-3 text-sm">

> 对 unbuild：hooks 借鉴自它，但 **stub mode 有意不做**（stub 易陈旧、与插件不兼容）→ 替代：`--watch` 或 `exports.devExports`（生产映射进 publishConfig，**npm 不支持**）

</div>

<!--
横向对比收个尾。

对 tsup：引擎 Rolldown 对 esbuild；默认值 esm 加 clean 开，对 cjs 加 clean 关；exports 自动回写和 publint/attw 质检 tsdown 内置、tsup 没有；monorepo 方面 tsdown 内置 workspace 模式，tsdown --workspace 构建工作区全部包，--filter 筛选子集，各包仍用自己的配置文件——tsup 时代这事要靠 turbo、lerna 外部编排。

对 unbuild：hooks 体系借鉴自它，但 unbuild 标志性的 stub mode——产物是转发源码的占位文件——tsdown 官方明确 deliberately not supported，有意不做。理由两条：stub 文件在导出列表变化时要手动重新生成，容易陈旧失真；而且 stub 转发与插件体系不兼容，经插件转换的行为在 stub 路径上不生效。

官方给的替代方案：watch 模式自动重建，或者 exports.devExports——开发期 package.json 的 exports 直指源码，生产映射移进 publishConfig，由 yarn/pnpm 发布时覆盖。注意这机制 npm 不支持，npm 的 publishConfig 不替换 exports。
-->

---

# 版本状态与生态（2026-06）

<v-clicks>

- 最新 **0.22.2**，未到 1.0——0.x 阶段 **minor 也可能破坏**，锁版本、升级前读 Releases
- Rolldown **1.0 stable**（2026-05）；Vite 8 已默认 Rolldown（2026-03）
- tsdown 将作为 Rolldown-Vite **Library Mode** 的基础
- VoidZero 背书、Rolldown 生态多包采用——事实上的 tsup 接班人
- 注意：minify 基于 Oxc minifier（偏早期）；运行需 Node 22.18+

</v-clicks>

<!--
版本与生态现状，2026 年 6 月这个时间点。

tsdown 最新是 0.22.2，还没到 1.0。semver 约定下 0.x 阶段的 minor 更新也可能携带破坏性变更，所以工程实践是锁定版本、升级前读 GitHub Releases 的变更说明，再配 CI 验证产物。0.x 不代表玩具——大量真实项目在用——但代表 API 仍可能调整。

生态背景：Rolldown 2026 年 5 月发布 1.0 stable；Vite 8 从 2026 年 3 月起默认 Rolldown；tsdown 官方定位为 Rolldown-Vite Library Mode 的基础。VoidZero 背书、Rolldown 生态多包采用，事实上已经接棒 tsup，成为新一代库打包的默认选项。tsup 到 tsdown 的迁移近零成本，也加速了这个过程。

两个提醒：minify 基于 Oxc minifier，官方标注还偏早期，生产使用要充分验证；运行 tsdown 本身需要 Node 22.18 以上。
-->

---
layout: intro
---

# 总结

tsdown = **Rolldown 官方库打包器：构建 + dts + exports + 校验一条龙**

- 默认 esm / dist / clean 开；`src/index.ts` 约定入口；`types` 字段自动开 dts
- `isolatedDeclarations` → oxc 极速 dts；否则回退 tsc
- tsup 迁移近零成本：`tsdown-migrate` 一条命令；esbuild 插件换 Rolldown/unplugin
- 2026-06：0.22.x 未到 1.0，锁版本用；Vite Library Mode 的未来基础

<!--
总结一下。

tsdown 是 Rolldown 官方的库打包器，把构建、声明文件、exports 生成、发布校验串成一条龙，是写库的开箱默认选项。

技术要点：默认值 esm、dist、clean 开，src/index.ts 约定入口，package.json 有 types 字段时 dts 自动开启。dts 两条路径：tsconfig 开 isolatedDeclarations 走 oxc-transform 极速生成，否则回退 TypeScript 编译器。

从 tsup 过来近零成本：tsdown-migrate 一条命令自动迁移，重点核对默认值翻转和选项重命名，esbuild 插件换成 Rolldown/unplugin 实现。

2026 年 6 月的状态：0.22.x 还没到 1.0，锁版本、升级看 release notes；它背后是 Rolldown 1.0 stable 和 Vite 8 默认 Rolldown 的大势，并将作为 Vite Library Mode 的基础。写库，默认就该考虑它。谢谢大家。
-->
