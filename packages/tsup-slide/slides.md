---
theme: seriph
background: https://cover.sli.dev
title: Welcome to tsup
info: |
  Presentation tsup — bundle your TypeScript library with no config.

  Learn more at [https://tsup.egoist.dev](https://tsup.egoist.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📦</span>
</div>

<br/>

## tsup — 零配置 TS 库打包器

esbuild 驱动，一条命令把 TypeScript 库打成 esm/cjs 产物 + d.ts。2026 年 latest 停在 8.5.1，官宣维护放缓、点名 tsdown 接班，但周下载仍约 600 万

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/egoist/tsup" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 tsup —— 官方一句话定位：Bundle your TypeScript library with no config, powered by esbuild。零配置的 TypeScript 库打包器，面向 npm 库作者，一条命令产出多格式 JS 加声明文件。

2026 年它的处境很有代表性：npm latest 停在 8.5.1，2025 年 11 月发布；README 官宣 not actively maintained anymore，点名 tsdown 接班。但周下载仍约 600 万，依旧是 esbuild 系库打包的事实标准——存量为王。

顺序：为什么需要 → 是什么不是什么 → 第一次构建 → format 与扩展名 → 配置 → 依赖外部化 → dts 两页 → exports 发布 → 互操作 → watch 工作流 → 混合引擎 → 踩坑 → tsdown → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么需要 tsup？

发一个 npm 库，要交付的不只是 JS：

<v-clicks>

- **esm + cjs 双格式**，两边使用方都要照顾
- **`.d.ts` 声明文件**，且要与格式匹配
- 扩展名 / exports 规则一大堆
- `tsc` 只转译不打包；应用打包器太重

</v-clicks>

<div v-click class="mt-6">

tsup 一条命令解决：

```bash
tsup src/index.ts --format esm,cjs --dts
```

</div>

<!--
为什么需要 tsup？发布一个 npm 库，要交付的远不只一份 JS：esm 和 cjs 双格式要同时照顾两类使用方；声明文件 d.ts 不能少，而且要和格式匹配；还有 .js .mjs .cjs 扩展名规则、package.json exports 写法这一堆工程细节。

工具侧呢，tsc 只做逐文件转译、不打包；webpack、Vite 这类应用打包器面向 HTML 和 dev server，拿来打库配置很重。

tsup 把这件事压缩成一条命令：tsup src/index.ts --format esm,cjs --dts，双格式产物加各自的声明文件一次产出，这就是它的存在理由。
-->

---

# 是什么 / 不是什么

<v-clicks>

- **是**：面向 npm 发布的**库打包器**，esbuild 驱动、零配置起步
- **不是**应用打包器：没有 dev server / HMR / HTML 处理
- **不做类型检查**：esbuild 快的原因之一；把关靠 `--dts`（跑真 TS）或 `tsc --noEmit`
- 能打包：`.js/.json/.mjs` + `.ts/.tsx`；CSS 实验性；资源需 `--loader`
- 本质：**多引擎指挥家**——esbuild + Rollup + SWC + TS 按需调度

</v-clicks>

<!--
先把边界划清。tsup 是面向 npm 发布的库打包器，esbuild 驱动，零配置起步。

它不是应用打包器：没有 dev server、没有 HMR、不处理 HTML，写应用请用 Vite。它也不做类型检查——esbuild 快的原因之一就是跳过类型检查，日常靠 IDE，构建期要把关就开 --dts 跑真 TypeScript 编译器，或者另跑 tsc --noEmit。

能打包的范围：Node 原生的 .js .json .mjs 加 TypeScript 的 .ts .tsx；CSS 是实验性支持；图片这类资源要用 --loader 显式指定处理方式。

最后一条最重要：tsup 本质是多引擎指挥家，esbuild 之外还按需调度 Rollup、SWC 和 TS 编译器，后面会展开。
-->

---
layout: two-cols-header
---

# 安装与第一次构建

::left::

**安装**

```bash
npm i -D tsup typescript
```

**构建（入口必须显式传）**

```bash
npx tsup src/index.ts
# ✓ dist/index.js（默认 cjs）
```

::right::

**零配置默认值**

- 输出 `dist/`，格式默认 **cjs**
- target：tsconfig → 兜底 `node14`
- clean 默认**关**，旧产物不清
- ⚠️ **无入口推断**：不传入口报
  `No input files`

<!--
安装很简单：tsup 加 typescript，typescript 是 peer 依赖，生成声明文件时要用。

构建注意：入口必须显式传。npx tsup src/index.ts，产物落在 dist/index.js，默认格式是 cjs。

右边是零配置的默认面貌：输出目录 dist，格式默认 cjs——这个默认值 2026 年看有点旧了；target 优先读 tsconfig 的 compilerOptions.target，都没有就兜底 node14；clean 默认关闭，旧产物不会清理，发布构建建议显式开 --clean。

最容易撞的坑：tsup 没有入口推断，什么都不传直接报 No input files, try tsup your-file instead。tsdown 会自动找 src/index.ts，tsup 不会。
-->

---

# format 与扩展名：两套规则

| format | 无 `type` 字段 | `"type": "module"` |
|---|---|---|
| cjs | **index.js** | index.cjs |
| esm | index.mjs | **index.js** |
| iife | index.global.js | index.global.js |

<div v-click class="mt-4">

> 谁占裸 `.js` 由 package.json 的 `type` 决定，另一方用 `.mjs`/`.cjs` 显式标记。**不支持 umd**（esbuild 限制）；iife 可配 `--global-name`。

</div>

<!--
format 支持三种：esm、cjs、iife，逗号组合一次产出。注意不支持 umd，根因是 esbuild 本身不支持 UMD 输出。

扩展名是两套规则，必须背下来。没有 type module 时：cjs 占裸 .js，esm 用 .mjs。设了 type module 后规则翻转：esm 占裸 .js，cjs 改用 .cjs——因为这时 Node 把 .js 按 ESM 解析，CJS 产物必须显式标记，否则加载就报错。iife 两种情况下都是 .global.js，全局变量名用 --global-name 指定。

记忆口诀：谁占裸 .js 看 type 字段，另一方永远显式标记。这套规则直接决定后面 package.json exports 怎么写。
-->

---

# 配置文件与条件配置

```ts
// tsup.config.ts —— 函数式：入参就是 CLI 标志
import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  minify: !options.watch, // watch 不压缩，正式构建才压
}));
```

<div v-click class="mt-3 text-sm">

> 载体五选一：`.ts/.js/.cjs/.json` 或 package.json `tsup` 字段；`--no-config` 禁用。

</div>

<!--
配置文件支持五种载体：tsup.config 的 ts、js、cjs、json，以及 package.json 的 tsup 字段。TS 配置原生支持，内部用 bundle-require 加载，配 defineConfig 拿类型提示。

这页代码展示的是官方处理 dev 和 prod 差异的推荐方式：defineConfig 传函数。入参 options 就是 CLI 标志的解析结果——跑 tsup --watch 时 options.watch 为 true，minify 就关掉；正式构建时才压缩。不需要写两份配置文件，也不需要自己注入环境变量。

另外大多数配置项可以被 CLI 参数覆盖，--config 指定自定义路径，--no-config 完全禁用。
-->

---

# 依赖外部化：库语义的默认值

| 依赖类型 | 默认行为 |
|---|---|
| dependencies / peerDependencies | **始终外部化**（无开关可关） |
| devDependencies | 被 import 就**打入产物** |
| 幻影依赖 | 被 import 就打入 |

<div v-click class="mt-4">

- `external` 追加外部化｜`noExternal` 强制打入（monorepo 本地包）
- Node 应用用 **`tsup-node`**：自动跳过打包全部 node_modules 包

</div>

<!--
依赖处理是库打包的灵魂默认值。官方原文：dependencies 和 peerDependencies are always excluded——始终外部化，没有开关可以关。逻辑很正：运行时依赖交给使用方安装，避免重复打包。

但注意 devDependencies 没有豁免：dev 依赖被 import 了就会打进产物，幻影依赖同理。这经常是产物体积异常的原因。

精细控制两个方向：external 追加外部化；noExternal 反向强制打入，典型场景是 monorepo 内部包要内联进产物。

构建 Node 应用还有个专门命令 tsup-node：自动跳过打包所有 node_modules 包，比默认更彻底——因为给 Node 应用打包依赖通常没必要，输出 ESM 时甚至会把依赖内部的动态 require 搞坏。
-->

---

# dts：声明文件的真相

```bash
tsup src/index.ts --format esm,cjs --dts
# ✓ index.js + index.mjs + index.d.ts + index.d.mts
```

<v-clicks>

- 实现：**真 TS 编译器**供类型 + **rollup-plugin-dts** 打包声明
- esbuild 在 dts 链路**完全不出场**——它生成不了声明
- **每格式各一份**：Node16/NodeNext 下 import/require 分支类型才准确
- 慢是机制性的：与 esbuild 的 JS 链路差一个量级
- 福利：--dts 跑真 TS，**附带获得类型检查**

</v-clicks>

<!--
--dts 生成声明文件，但要懂它的实现：真 TypeScript 编译器提供类型信息，rollup-plugin-dts 在 Rollup 管线里把声明打包成单文件。所以 rollup 是 tsup 的直接依赖，typescript 是 peer 依赖。esbuild 在这条链路完全不出场——它没有生成声明的能力。

多格式时每种格式各生成一份声明，这不是冗余：官方原文说 required for consumers to get accurate type checking——Node16、NodeNext 解析下，import 和 require 分支解析到的声明必须与产物模块语义匹配，d.mts 配 mjs，删掉一份就会被 attw 检出 Masquerading 类错配。

dts 慢是机制性的：真 TS 全量分析加 Rollup 打包，和 esbuild 的 JS 链路差一个量级，大项目还吃内存。顺带的福利是：开了 --dts 等于跑了真 TS 编译器，附带获得类型检查。
-->

---

# dts 边界与逃生门

| 需求 | 方案 |
|---|---|
| 内联 node_modules 外部类型 | `--dts-resolve`（实验性） |
| 只产声明不产 JS | `--dts-only` |
| api-extractor 实现 | `--experimental-dts`（8.0+，自装） |
| declaration map | **生成不了** → `tsc --emitDeclarationOnly` |

<div v-click class="mt-3 text-sm">

> `--dts` 构建**不支持 source map**；tsc 补产 `.d.ts.map` 可挂 `onSuccess`，且不该发布进 npm。

</div>

<!--
dts 有几条边界要知道。第一，--dts 不解析 node_modules 里的外部类型，想把纯类型 devDependency 内联进声明，用实验性的 --dts-resolve，内联后使用方不装那个包也有完整类型。第二，--dts-only 只产声明不产 JS。第三，8.0 之后还有 --experimental-dts，基于微软的 api-extractor，peer 依赖要自装。

最大的坑是 declaration map：tsup 生成不了 .d.ts.map，官方直接链接 issue 564 承认。要 monorepo 里点击类型跳转源码的体验，构建后另跑 tsc --emitDeclarationOnly --declaration，官方点名可以挂在 onSuccess 里串成流水线。注意 declaration map 不该发布进 npm 包。

另外 --dts 构建连 source map 都不支持，这两个 map 别混为一谈。
-->

---

# 双格式发布：package.json exports

```jsonc
{
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": { "types": "./dist/index.d.mts", "default": "./dist/index.mjs" },
      "require": { "types": "./dist/index.d.ts", "default": "./dist/index.js" }
    }
  }
}
```

<div v-click class="mt-2 text-sm">

> types **分支内对应**（`.d.mts` ↔ `.mjs`）；`type: module` 时全部翻转；发布前跑 publint / attw。

</div>

<!--
双格式库发布的最后一公里是 package.json。这是无 type module 时的标准写法：main 指 cjs 的 index.js，module 给打包器指 mjs，顶层 types 兜底旧解析。

关键在 exports：import 分支的 types 指 d.mts、default 指 mjs；require 分支的 types 指 d.ts、default 指 js。types 必须放分支内、与产物一一对应——import 分支配错成 d.ts 就是 attw 检出的头号错配。

设了 type module 就全部翻转：esm 占 .js 加 d.ts，cjs 变 .cjs 加 d.cts。

提醒一句：tsup 不会帮你生成 exports，也没内置 publint、attw 校验——这两步要自己挂进发布流程，而接班人 tsdown 已经把它们做成内置了。
-->

---

# 互操作：cjsInterop 与 shims

<v-clicks>

- 默认坑：`export default x` 编译成 `module.exports.default = x`
  —— CJS 使用方要写 `require("lib").default`
- **`cjsInterop`**：只有 default 导出（无具名）时转 `module.exports = x`
  —— `require()` 直接拿本体
- **`shims`**：cjs 产物垫 `import.meta.url`，esm 产物垫 `__dirname`
- 记忆：每种格式垫的是「自己缺的另一边变量」

</v-clicks>

<!--
双格式还有两个互操作开关。

先说 cjsInterop 治什么病：esbuild 默认把 export default x 编译成 module.exports.default = x，CJS 使用方必须 require 完再取 .default，很别扭。开 cjsInterop 后，仅当模块只有默认导出、没有任何具名导出时，产物转成 module.exports = x，require 直接拿到本体。有具名导出就不改写，否则具名导出没地方放。

再说 shims：一份源码产双格式时，cjs 产物里的 import.meta.url 会被垫成基于 __filename 的等价表达式；esm 产物里的 __dirname 被垫成 fileURLToPath(import.meta.url) 那套。方向别记反：每种格式垫的是自己缺失的另一边变量，import.meta.url 本来就是 ESM 原生能力，不用垫。
-->

---

# watch 与 onSuccess 工作流

```bash
tsup src/index.ts --watch --onSuccess "node dist/index.js"
```

<v-clicks>

- watch 默认忽略 `dist` / `node_modules` / `.git`（防产物自触发循环）
- `onSuccess`：每次**构建成功后**执行；CLI 只接受字符串命令
- 配置文件里可写**函数**，返回值是**清理函数**——下次重建前执行
  （典型：`server.close()` 后再重启）

</v-clicks>

<!--
开发工作流靠 watch 加 onSuccess。一条命令：tsup --watch --onSuccess "node dist/index.js"，每次重建成功自动跑产物，重建即重启。

watch 默认忽略三个目录：dist、node_modules、.git。忽略 dist 很关键——否则自己的产物写入又触发重建，陷入死循环。要忽略更多目录用 --ignore-watch，可以重复传。

onSuccess 进阶玩法在配置文件里：写成异步函数，函数的返回值是清理函数，下一次重建前先执行。典型场景是起常驻服务——onSuccess 里 startServer，返回 server.close，每轮重建前优雅关掉旧进程。CLI 形式只能传字符串命令，函数形式必须写在配置文件。

还能把 tsc --emitDeclarationOnly 挂进 onSuccess，补上 declaration map。
-->

---

# 混合引擎全景

| 引擎 | 职责 | 上场时机 |
|---|---|---|
| **esbuild**（Go） | TS/JS 转译 + 打包 | 始终 |
| **SWC**（Rust） | legacy 装饰器元数据 | `emitDecoratorMetadata` |
| **Rollup** | 摇树兜底 + dts 打包 | `--treeshake` / `--dts` |
| **TypeScript** | 类型信息 | `--dts` |

<div v-click class="mt-3 text-sm">

> JS 快在 esbuild、dts 慢在 TS + Rollup；esbuild 给不了的，tsup 拿别的引擎补。

</div>

<!--
把 tsup 的本质摊开：它是调度四个引擎的指挥家。

esbuild 管 TS、JS 的转译打包，始终在场，多格式时每种各跑一遍，这是速度的来源。SWC 在 tsconfig 开了 emitDecoratorMetadata 时介入——esbuild 不做类型分析、发不出装饰器元数据，所以 NestJS 这类项目会自动切 SWC 转译装饰器，@swc/core 是要自装的 peer 依赖。Rollup 出场两次：--treeshake 用它做比 esbuild 更彻底的摇树，官方都承认 esbuild 摇树 sometimes not working very well；--dts 用 rollup-plugin-dts 打包声明。TypeScript 编译器为 dts 提供类型信息。

理解这张分工图，就能解释速度构成和每个 flag 的能力边界——esbuild 给不了的，tsup 拿别的引擎补，这就是它和纯 esbuild 封装的区别。
-->

---

# 常见坑 & Tips

<v-clicks>

- 不传入口报 `No input files` —— **无入口推断**，必须显式传
- `--env.X` 只替换**全局** `process.env.X` —— 别 `import process from "node:process"`
- 装饰器场景报 `No matching export` —— 改 **`import type`**（SWC 先剥了纯类型导出）
- terser / `@swc/core` / api-extractor —— 都是**自装**的可选依赖
- esbuild 摇树不彻底 —— `--treeshake` 换 **Rollup** 兜底
- devDependencies **会被打进产物**（被 import 时）—— 豁免名单只有 deps/peerDeps

</v-clicks>

<!--
高频坑汇总六条。

第一，无入口推断，不传入口直接报错，这是 tsup 和 tsdown 的第一差异。第二，--env 注入是编译期 define 替换，只认全局形式的 process.env.X 和 import.meta.env.X，从 node:process import 进来的 process 是模块绑定，替换静默失效，官方原文专门告诫过。

第三，开装饰器元数据后报 No matching export：SWC 先转装饰器时剥掉了纯类型导出，esbuild 就找不到了，修复是显式 import type，这是官方 Troubleshooting 唯一收录的问题。

第四，terser、@swc/core、api-extractor 全是可选依赖，用到哪个装哪个。第五，esbuild 摇树有时不彻底，--treeshake 借 Rollup 再摇一遍，选项类型和 Rollup 一致。第六，devDependencies 没有外部化豁免，被 import 就进产物，体积异常先查这个。
-->

---

# 2026：tsup 与 tsdown

README 官宣：「**not actively maintained anymore… consider using tsdown**」

| 维度 | tsup | tsdown |
|---|---|---|
| 引擎 | esbuild（Go） | Rolldown（Rust） |
| 默认 format / clean | cjs / false | **esm / true** |
| dts | TS + rollup-plugin-dts | oxc 极速 / tsc 回退 |
| exports 生成 / 发布校验 | 无 | **内置** |

<div v-click class="mt-2 text-sm">

> 迁移：`npx tsdown-migrate --dry-run`；存量留守也合理（周下载 ~600 万）。

</div>

<!--
2026 年的选型现实。README 官方原话：This project is not actively maintained anymore, please consider using tsdown instead。latest 停在 8.5.1。tsdown 是 VoidZero 主导、基于 Rolldown 的独立项目，不是 tsup 改名。

对比四个维度：引擎从 esbuild 换成 Rust 的 Rolldown；默认值翻转——format 从 cjs 变 esm、clean 从关变开，迁移后不传 format 产物会变，要心里有数；dts 上 tsdown 走 oxc 极速路径或 tsc 回退，比 tsup 的 rollup-plugin-dts 链路快；tsdown 还内置了 exports 自动生成和 publint、attw 发布校验，这些 tsup 都要自己挂。

迁移有自动工具：npx tsdown-migrate，先 --dry-run 预览，支持 monorepo 通配符。但存量留守也完全合理——周下载约 600 万，社区答案最全，稳定库没必要折腾。新库建议直接 tsdown 起步。
-->

---
layout: intro
---

# 总结

tsup = **esbuild 驱动的零配置库打包器，不做类型检查**

- 三件套一条命令：`--format esm,cjs --dts`；deps/peerDeps 始终外部化
- 扩展名两套规则随 `type` 翻转；exports 的 types 要分支内对应
- 本质是多引擎指挥家：esbuild + SWC + Rollup + TS 各司其职
- 2026：8.5.1 官宣维护放缓；新库选 tsdown，存量可 `tsdown-migrate` 迁移

<!--
总结一下。

tsup 是 esbuild 驱动的零配置库打包器，核心边界：只管库打包，不做类型检查，类型把关交给 --dts 或 tsc --noEmit。

技术上记四件事：库发布三件套一条命令搞定，deps 和 peerDeps 始终外部化但 devDeps 没豁免；扩展名两套规则随 package.json 的 type 字段翻转，exports 的 types 必须分支内对应；它本质是多引擎指挥家，esbuild 管 JS、SWC 管装饰器、Rollup 管摇树和 dts 打包、TS 供类型，速度构成和能力边界都从这张分工图来。

2026 年的现状：8.5.1 之后官宣维护放缓，官方点名 tsdown 接班。新库建议直接 tsdown，存量项目用 tsdown-migrate 平滑迁移，或者继续留守——600 万周下载的事实标准，短期内不会消失。谢谢大家。
-->
