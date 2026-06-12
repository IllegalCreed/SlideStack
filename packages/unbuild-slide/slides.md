---
theme: seriph
background: https://cover.sli.dev
title: Welcome to unbuild
info: |
  Presentation unbuild — a unified JavaScript build system.

  Learn more at [https://github.com/unjs/unbuild](https://github.com/unjs/unbuild)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📦</span>
</div>

<br/>

## unbuild — 统一 JavaScript 构建系统

UnJS 出品的 npm 库构建器：基于 Rollup 产出 ESM/CJS + 类型声明，配置可从 package.json 自动推断，独有 stub mode。2026-06 latest 3.6.1

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/unjs/unbuild" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 unbuild。官方一句话定位：A unified JavaScript build system，统一 JavaScript 构建系统。它是 UnJS 生态出品的库构建工具，面向的是「要发布到 npm 的包」这个场景：基于 Rollup 把 TS/JS 源码构建成 ESM、CJS 双格式产物加类型声明。

它有三张牌：第一，配置能从 package.json 自动推断，常常零配置；第二，rollup 和 mkdist 双模式，bundle 和 bundleless 都能做；第三，独一份的 stub mode，开发期改源码免重建。

2026 年 6 月的现状：latest 是 3.6.1，周下载约 21 万，是 Nuxt、Nitro 体系和一众 UnJS 包的标准构建器。

今天的顺序：定位 → 架构 → 快速上手 → 零配置原理 → 配置文件 → 双模式 → stub mode → 声明与双格式 → Secure builds → hooks → 选型 → 生态与未来 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 库构建 ≠ 应用打包

unbuild 面向**发 npm 包**这件事：

<v-clicks>

- 产出 **ESM/CJS 双格式** + `.d.ts`
- 依赖**外部化**而不是打进去
- 校验 package.json 与产物一致

</v-clicks>

<div v-click class="mt-6">

它**不是** Vite/webpack：

- 没有 dev server、没有 HMR
- 不输出 UMD/IIFE
- 也不做类型检查（另跑 `tsc --noEmit`）

</div>

<!--
先把定位钉死：库构建和应用打包是两件事。

应用打包关心 dev server、HMR、代码分割、资源处理，最后产物给浏览器跑。库构建关心的是发到 npm 上的包：要 ESM、CJS 双格式加类型声明；运行时依赖要外部化，让使用方自己安装，而不是打进产物里；还要保证 package.json 里声明的入口和实际产物对得上。

unbuild 就是后者。它没有 dev server、没有 HMR，不输出 UMD、IIFE 这种浏览器直引格式，也不做类型检查——类型把关要另跑 tsc --noEmit。选错场景会处处别扭，拿它打应用就是用错了工具。
-->

---

# 架构：Rollup 底座 + 四种 builder

打包核心是 **Rollup**（^4.50），esbuild 只做转译/压缩，rollup-plugin-dts 打包声明

| builder | 干什么 |
|---|---|
| **rollup**（默认） | bundle：TS/JS → ESM/CJS + d.ts |
| **mkdist** | bundleless：逐文件转译、保留目录结构 |
| **copy** | 原样复制资源目录 |
| **untyped** | 配置对象 → 类型 + 文档 |

<div v-click class="mt-3">

> 一个 entries 数组可**混用**四种 builder；默认串行，`--parallel` 并行

</div>

<!--
架构上分两层。底座是 Rollup，注意不是 esbuild 也不是 Rolldown：unbuild 3.6 依赖 rollup 4.50，esbuild 在这里只承担语法转译和压缩，类型声明的打包交给 rollup-plugin-dts。

上层是四种 builder。rollup 是默认的，做经典 bundle；mkdist 做 bundleless，逐文件转译、保留源码目录结构，组件库的最爱；copy 负责原样复制资源目录；untyped 比较特别，能从配置对象生成类型和 Markdown 文档，是 unjs/untyped 的集成。

关键设计：这四种 builder 可以在同一个 entries 数组里混用——核心入口打 bundle、组件目录走 mkdist、资源目录 copy，一次构建全搞定。默认按 untyped、mkdist、rollup、copy 串行执行，加 --parallel 可以并行。
-->

---
layout: two-cols-header
---

# 快速上手

::left::

**安装 + 构建**

```bash
npm i -D unbuild
npx unbuild
```

**输出日志**

```text
ℹ Automatically detected entries:
  src/index.ts [esm] [cjs] [dts]
✔ Build succeeded for my-lib
  dist/index.mjs (110 B, exports: log)
```

::right::

**package.json 即配置**

```json
{
  "type": "module",
  "scripts": { "build": "unbuild" },
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "types": "./dist/index.d.ts"
}
```

<!--
快速上手有多快？装一个 dev 依赖，然后 npx unbuild，没了——注意我们没有写任何配置文件。

秘密在右边：package.json 本身就是配置。你在 exports 里声明了 import 指向 dist/index.mjs、require 指向 dist/index.cjs，又写了 types 字段，unbuild 就知道：入口是 src/index.ts，要出 ESM、要出 CJS、要出声明。

左下是真实的构建日志：它会打印 Automatically detected entries，告诉你自动推断出了哪些入口和格式；构建完成还会列出每个产物的体积和导出名，发包前扫一眼就能核对。
-->

---

# 零配置原理：反向推断

<v-clicks>

1. **收集输出**：读 `exports` / `main` / `module` / `types` / `bin` 字段
2. **反向映射**：`./dist/index.mjs` → 匹配回 `src/index.ts` 作为入口
3. **顺带定格式**：见到 CJS 输出 → 开 `emitCJS`；见到 `types` → 开 `declaration`

</v-clicks>

<div v-click class="mt-4">

> 哲学：**包怎么声明，就怎么构建**——package.json 是唯一事实源，杜绝「改了 exports 忘了改构建配置」的漂移

</div>

<!--
零配置不是魔法，是一套确定性的反向推断，官方叫 Automated config。

第一步收集输出：把 package.json 里 exports、main、module、types、bin 这五类字段指向的文件全部收集起来，exports 还会递归提取所有条件导出。第二步反向映射：扫描 src 目录，把 dist/index.mjs 这样的输出路径匹配回 src/index.ts，作为构建入口。第三步顺带定格式：发现有 .cjs 或 require 输出，就自动打开 emitCJS；发现 types 字段，就把 declaration 设成 compatible。

这背后的哲学很值得品：包怎么声明，就怎么构建。package.json 是唯一事实源，从根上杜绝了「构建配置和发布字段两边漂移」这个库发布的经典事故源。细节补一条：type module 的包里 .js 按 ESM 理解，不会误开 emitCJS。
-->

---

# build.config.ts：要控制时再写

```ts
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/index"],
  declaration: "compatible",
  rollup: { emitCJS: true },
});
```

<v-clicks>

- 后缀族 `build.config.{js,ts,mts,json…}` 全支持（**jiti** 加载，TS 开箱即用）
- 传**数组** = 多份独立构建（常规版 + minified 版）
- Rollup 细节都收在 `rollup` 字段，**不读 rollup.config.js**

</v-clicks>

<!--
需要更多控制时，在项目根建 build.config.ts，用 defineBuildConfig 包一层拿到完整类型提示。这个例子：显式入口 src/index，声明用 compatible 模式，另外追加 CJS 输出。

三个要点。第一，配置文件由 jiti 加载，所以 TS 配置开箱即用，js、ts、mts、json 整个后缀族都支持，也可以写在 package.json 的 unbuild 字段里。第二，defineBuildConfig 可以传数组，每个成员是一份独立构建，官方示例就是常规版加一个 minified 压缩版，各自输出到不同目录。第三，所有 Rollup 细节都收在 rollup 字段下面，比如 esbuild 选项、output 覆盖、dts 选项——它不会去读 rollup.config.js。

注意 CJS 的开关写法是 rollup.emitCJS: true，没有 tsup 那种顶层 format 数组。
-->

---

# rollup 模式 vs mkdist 模式

| 维度 | rollup（默认） | mkdist |
|---|---|---|
| 产物 | bundle 合并 + tree-shaking | **逐文件转译** |
| 结构 | 入口对应单产物 | **保留源码目录** |
| 特色 | dts bundle、依赖内联 | Vue SFC、postcss、逐文件 d.ts |
| 场景 | 工具库、SDK | **组件库** |

<div v-click class="mt-3">

> bundle 的代价：丢文件结构、丢现代语法、CSS 变全局——组件库要的是 `dist/Button.vue.mjs` 能单独 import

</div>

<!--
unbuild 的第二张牌：两种构建模式。

rollup 模式是经典 bundle：模块图合并、tree-shaking，一个入口出一份产物，适合工具库和 SDK。mkdist 模式是 bundleless：逐文件转译，file-to-file，输出完整保留源码的目录结构，还附带 Vue 单文件组件支持、内置 postcss、为每个文件单独生成 d.ts。

为什么组件库要 bundleless？mkdist 官方点名了 bundle 的代价：丢失原始文件结构、转译过程丢失现代语法、CSS 被抽成全局、依赖永远从大 bundle 引入。组件库恰恰希望使用方能按文件路径精确引入单个组件，dist/Button.vue.mjs 可以单独 import，这正是保留目录结构的价值。
-->

---

# mkdist 实战：一个斜杠切换模式

```ts
export default defineBuildConfig({
  declaration: true,
  entries: [
    "./src/index",            // rollup：bundle
    "./src/components/",      // 以 / 结尾 → 自动 mkdist
  ],
  rollup: { emitCJS: true },
});
```

<v-clicks>

- 自动规则：`input.endsWith('/') ? 'mkdist' : 'rollup'`
- 对象形态可加 `builder` / `outDir` / `format` / `ext`
- `.vue` 保留模板样式、只转译 `<script lang="ts">`

</v-clicks>

<!--
切换模式有多简单？一个斜杠。源码里的规则就一行：input 以斜杠结尾就用 mkdist，否则用 rollup。

所以这个配置里，src/index 走 rollup 打 bundle，src/components/ 因为以斜杠结尾，自动走 mkdist 逐文件转译——两种模式在同一个 entries 数组里共存，互不干扰。

需要更精细的控制就用对象形态，显式写 builder: 'mkdist'，再配 outDir、format、ext 这些选项。处理 Vue 单文件组件时，mkdist 会保留模板和样式部分，只把 script lang=ts 转译掉，并生成对应的声明文件——这是 Vue 组件库选 unbuild 的核心理由之一。
-->

---

# stub mode：独一份的卖点

monorepo 里包 A 被包 B 引用，传统两难：

<v-clicks>

- 每改一行 → **重建一次**，或
- 每个包挂一个 **watch 常驻进程**

</v-clicks>

<div v-click class="mt-4">

```bash
npx unbuild --stub   # 只需执行这一次
```

之后改 `src` **免重建、免 watch**，引用方永远拿到最新代码 —— README 称之为 *passive watcher*

</div>

<!--
重头戏来了：stub mode，unbuild 独一份的卖点，tsup、tsdown 都没有。

先看它解决什么。monorepo 里包 A 被包 B link 引用，传统做法两难：要么每改一行 A 就手动重建一次，要么给每个包挂一个 watch 常驻进程——Nuxt 那种几十个包互相引用的仓库，就是几十个 watcher。

unbuild 给出第三条路：npx unbuild --stub，只需要执行这一次，把 dist「桩化」。之后修改 src 源码，不需要重建、不需要任何 watch 进程，引用方拿到的永远是最新代码。README 给它起的名字很形象：passive watcher，被动监听器——没有进程在跑，但效果如同一直在 watch。

那它是怎么做到的？下一页拆原理。
-->

---

# stub 原理：dist 里根本没有产物

stub 后的 `dist/index.mjs`：

```js
import { createJiti } from ".../node_modules/jiti/lib/jiti.mjs";
const jiti = createJiti(import.meta.url, { interopDefault: true });
const _module = await jiti.import("/abs/path/src/index.ts");
export const log = _module.log;
export default _module?.default ?? _module;
```

<v-clicks>

- **执行**：jiti 运行时现场转译 `src` 源码 → 改动即时生效
- **具名导出**：mlly 静态分析导出名，逐个 re-export
- **mkdist 入口**：不写加载器，直接 **symlink** 到源目录

</v-clicks>

<!--
stub 之后 dist/index.mjs 里是什么？不是构建产物，而是这么一段 jiti 加载器。

三个机制。第一，执行靠 jiti：import 这个桩文件时，jiti 在运行时现场转译并执行 src 下的源文件，再把导出转发出去——dist 里根本没有「产物」，所以源码怎么改都即时生效。

第二，具名导出靠 mlly：ESM 的具名导出必须静态声明，没法运行时伪造。stub 用 mlly 的 resolveModuleExportNames 静态分析源码的全部导出名，逐个生成 export const x 等于 _module.x。推论是：新增或删除导出后要重新跑一次 --stub，因为导出列表是烤进桩文件的。

第三，mkdist 目录型入口更省事：删掉输出目录，直接创建指向源目录的软链接，dist 路径「变成」src 路径。

类型也不丢：声明桩就是一行 export * from 源文件路径，TS 直接解析到源码类型。最后强调：stub 产物带本机绝对路径、依赖 jiti，绝不可发布——package.json 里配 prepack: unbuild 兜底。
-->

---

# 双格式与 declaration

**JS 产物**：ESM（`.mjs`）恒出；CJS（`.cjs`）由 `rollup.emitCJS` 追加

| declaration | 产物 |
|---|---|
| `'compatible'` ≡ `true` | `.d.ts` + `.d.mts` + `.d.cts` 三份 |
| `'node16'` | 仅 `.d.mts` + `.d.cts` |
| 不写 | 自动探测：有 `types` 字段 → compatible |

<div v-click class="mt-3">

> exports 里 `import`/`require` 条件分别指向 `.d.mts`/`.d.cts`，老用户读裸 `types` 兜底

</div>

<!--
产物格式两句话说清。JS 侧：ESM 是固定输出，文件名锁死 [name].mjs；CJS 是可选项，rollup.emitCJS 开启后追加 [name].cjs——后缀固定，从根上避开 package.json type 字段的歧义。

类型声明侧 declaration 有三种取值。compatible 是推荐值，true 就是它的别名：一份源文件出三份声明，d.ts、d.mts、d.cts，老式 node 解析和 Node16 双轨全兼容。node16 只出 d.mts 和 d.cts 两份，适合消费方都用现代 moduleResolution 的场景，但注意没有裸 d.ts，老用户读 types 字段会找不到类型。完全不写则自动探测：package.json 有 types 字段就按 compatible 来，否则不生成。

最后一个常见翻车点：声明产了三份，但 exports 里的 import、require 条件没有分别指向 d.mts 和 d.cts，Node16 解析下照样翻车——条件导出要把 types 配齐。
-->

---

# Secure builds：构建后还要验货

构建成功 ≠ 万事大吉，unbuild 收尾校验三件事：

<v-clicks>

- **implicit**：import 了**未声明**的包 → 被内联 + 警告
- **unused**：声明在 dependencies 却**没被用**
- **missing**：package.json 指向**不存在的产物**

</v-clicks>

<div v-click class="mt-4">

> `failOnWarn` 默认 **true**：有警告直接**退出码 1**。CI 红了先修 package.json，别急着关闸

</div>

<!--
unbuild 还有个容易被忽视但很值钱的特性：Secure builds，构建后验货。

它校验三类问题。第一类 implicit，隐式依赖：源码 import 了一个只在 devDependencies 或者根本没声明的包，默认会被内联进产物，同时发出 Implicitly bundling 警告，收尾汇总成 Potential implicit dependencies found。第二类 unused：声明在 dependencies 里却没被任何源码引用。第三类 missing：package.json 的入口字段指向了不存在的产物文件。

关键是 failOnWarn 默认 true：只要有警告，进程直接退出码 1。所以你会见到日志写着 Build succeeded、产物也齐全，CI 却红了——这不是构建挂了，是验货没过。正确姿势是修 package.json：该声明的声明、该删的删；要内联就用 rollup.inlineDependencies 显式表态。failOnWarn: false 能关闸，但那是掩盖问题，只应作为有意识的例外。

顺带说下默认 external 规则：Node 内置模块加 dependencies、peerDependencies 自动外部化，devDependencies 不在名单里。
-->

---

# hooks：连自动推断都是一个 preset

| 钩子 | 时机 |
|---|---|
| `build:prepare` | entries 归一化之前 |
| `build:before` | 所有 builder 开始前 |
| `build:done` | 全部完成后（后处理挂这） |

```ts
export default defineBuildConfig({
  hooks: {
    "build:done"(ctx) { /* 往 dist 追加文件 */ },
    "rollup:options"(ctx, options) { /* 改 Rollup 配置 */ },
  },
});
```

<!--
扩展机制：unbuild 基于 unjs/hookable 提供完整的 hooks 体系，tsdown 的 hooks 设计明言受它启发。

顶层生命周期三个钩子：build:prepare 在上下文就绪、entries 归一化之前，适合动态改配置；build:before 在所有 builder 开始之前；build:done 在全部构建完成后，往 dist 追加文件、做产物校验都挂这里。再往下还有按 builder 分族的细粒度钩子，最常用的是 rollup:options，在最后时刻修改即将传给 Rollup 的配置，比如塞一个自定义插件。

最值得品的是这个设计细节：前面讲的 entries 自动推断，在源码层面就是一个内置的 autoPreset 加一个 build:prepare 钩子——unbuild 连自家核心行为都走公开的 preset 加 hooks 扩展机制。这意味着你能用同样的机制做团队级的可复用配置。
-->

---

# 选型：vs tsup / tsdown

| 维度 | unbuild | tsup | tsdown |
|---|---|---|---|
| 引擎 | Rollup（JS） | esbuild（Go） | Rolldown（Rust） |
| 配置哲学 | **读** package.json | 显式配置 | **写** package.json |
| 开发直连 | **stub mode** | watch | watch / devExports |
| bundleless | **mkdist**（Vue SFC） | bundle: false | unbundle |
| 发布校验 | 依赖校验内置 | 无 | publint + attw |

<!--
三个库构建器放一起看。

引擎：unbuild 是 JS 写的 Rollup 方案，tsup 基于 Go 的 esbuild，tsdown 基于 Rust 的 Rolldown——论纯构建速度 tsdown 领先，unbuild 不是 Rust 档。

配置哲学是最有意思的对照：unbuild 读 package.json 反推构建，「包定义构建」；tsdown 反过来，exports: true 从构建结果写 package.json，「构建定义包」。两条路都消灭漂移，方向相反。

开发直连：unbuild 独有 stub mode，桩化一次免重建；tsup 和 tsdown 都靠 watch 重建，tsdown 还有 devExports 方案，而且它有意不支持 stub——理由是导出变化要手动重新 stub、stub 会绕过插件管线。

选型建议：UnJS/Nuxt 生态、重 stub 工作流、Vue 组件库 bundleless，选 unbuild；追求极速、要 publint、attw、workspace 内置，选 tsdown；tsup 存量项目可以不动，新项目不建议入场，生态共识的接班人是 tsdown。
-->

---

# 生态角色与未来

<v-clicks>

- **UnJS 包标准构建器**：ofetch / defu / h3 的 build 脚本就是一条 `unbuild`
- **Nuxt 模块官方构建**：`@nuxt/module-builder` 1.x 把它列为**运行时依赖**，`dev:prepare` 本质就是 stub 一次
- **规模**：周下载约 21 万（2026-06），UnJS/Nuxt 系事实标准
- **未来**：官方正实验 **obuild**（Rolldown 底座）作为下一代，仍 0.4.x beta
- 「实验后继者存在」≠「unbuild 已废弃」——3.6.x 仍是现役标准

</v-clicks>

<!--
最后看生态位和未来。

unbuild 是 UnJS 生态的标准构建器：ofetch、defu、h3 这些包，build 脚本就是一条 unbuild 命令；Nitro 和 Nuxt 内核的大量包同样如此。Nuxt 模块的官方构建器 @nuxt/module-builder 1.x 更是直接把 unbuild 列为运行时依赖，Nuxt 模块模板里的 dev:prepare 脚本，本质就是 stub 一次，让 playground 随改随跑——stub mode 就是从这个生态的痛点里长出来的。

规模上周下载约 21 万，不及 tsup 的量级，但在 UnJS、Nuxt 体系内是事实标准。

未来动向：README 顶部有官方注记，正在实验基于 Rolldown 的 obuild 作为下一代后继者，主打更快。但注意分寸：obuild 还在 0.4.x beta，实验后继者的存在不等于 unbuild 已废弃，3.6.x 仍是现役标准，现在选用不必有历史包袱。
-->

---
layout: intro
---

# 总结

unbuild = **面向 npm 库的统一构建系统**（Rollup 底座）

- 零配置：entries / 格式 / 声明全部从 package.json 反向推断
- 双模式：rollup bundle + mkdist bundleless（组件库友好）
- **stub mode 独一份**：桩化一次，改源码免重建免 watch
- Secure builds：依赖校验 + `failOnWarn` 把住发布质量
- 2026：3.6.1 现役，UnJS/Nuxt 标准；obuild（Rolldown）实验中

<!--
总结。

unbuild 是 UnJS 出品、面向 npm 库的统一构建系统，底座是 Rollup，esbuild 转译、rollup-plugin-dts 打声明。

四个记忆点：第一，零配置——entries、双格式、声明生成都能从 package.json 反向推断，包怎么声明就怎么构建。第二，双模式——rollup 打 bundle，mkdist 做 bundleless 逐文件转译，一个斜杠切换，组件库友好。第三，也是独一份的卖点：stub mode，桩化一次，开发期改源码免重建、免 watch 进程，monorepo 神器。第四，Secure builds 加默认开启的 failOnWarn，把依赖声明问题拦在 CI。

2026 年的坐标：3.6.1 现役，UnJS、Nuxt 生态的标准构建器；下一代 obuild 基于 Rolldown 还在实验。如果你在写要发 npm 的库，尤其在 Vue、Nuxt 生态里，unbuild 值得是你的默认选项。谢谢大家。
-->
