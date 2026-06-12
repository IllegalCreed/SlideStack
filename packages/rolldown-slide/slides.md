---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Rolldown
info: |
  Presentation Rolldown — the Rust bundler powering Vite 8+.

  Learn more at [https://rolldown.rs](https://rolldown.rs)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🦀</span>
</div>

<br/>

## Rolldown — 驱动 Vite 8+ 的 Rust 打包器

Rollup 兼容 API + esbuild 级内置功能，比 Rollup 快 10~30 倍。2026-03 起是 Vite 8 默认打包器，2026-05-07 发布 1.0 stable

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/rolldown/rolldown" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Rolldown —— 用 Rust 编写的 JavaScript 打包器，官方口号 Blazing Fast Rust-based bundler for JavaScript。

它的设计公式是：Rollup 兼容的 API 和插件接口，加上 esbuild 级别的内置功能，再加 Rust 的原生速度。首要使命：当 Vite 的统一底层打包器。

2026 年是它的转折年：1 月进 1.0 RC，3 月 12 日 Vite 8 stable 把它设为默认打包器，5 月 7 日 1.0 stable 发布。现在每个升级到 Vite 8 的项目，底层都在跑 Rolldown。

顺序：为什么需要 → 时间线 → Oxc 底座 → 性能 → 上手 → 配置 → platform → 内置功能 → define/inject → 分包 → 插件兼容 → hook filter → 与 Rollup 差异 → Vite 8 → tsdown → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么需要 Rolldown？

Vite 7 及以前是「双引擎」：

<v-clicks>

- dev 用 **esbuild**：预构建 + 转换
- build 用 **Rollup**：生产打包
- 两套语义 → **dev 正常、build 才炸**
- Rollup 纯 JS 实现 → 大项目**构建慢**
- 同一特性要**维护两遍**

</v-clicks>

<div v-click class="mt-4">

> Rolldown：**单一 Rust 引擎统一两端**

</div>

<!--
为什么需要 Rolldown？根源在 Vite 7 及以前的双引擎架构。

开发模式用 esbuild 做依赖预构建和 TS/JSX 转换，生产构建用 Rollup 打包。两套引擎、两套语义：解析行为、CJS 互操作、输出细节都有差异，于是出现经典问题——dev 一切正常，一跑 build 才炸。

第二个痛点是性能：Rollup 是纯 JavaScript 实现，大项目的生产构建成为整条链路的瓶颈。第三，同一个特性要在两个引擎里各维护一遍。

Rolldown 的答案：用一个 Rust 引擎统一开发与生产，一致性和速度一起解决。
-->

---

# 定位与 2026 时间线

| 时间 | 事件 |
|---|---|
| 2024-04 | 首个公开版本 0.10.1 |
| 2026-01 | **1.0 RC**（API 冻结） |
| 2026-03-12 | **Vite 8 stable**：Rolldown 成默认打包器 |
| 2026-05-07 | **Rolldown 1.0 stable** + 语义化版本承诺 |
| 2026-06 | latest 已至 **1.1.x** |

<div v-click class="mt-3">

> 由 **VoidZero**（尤雨溪创立）与约 200 名社区贡献者维护

</div>

<!--
快速过一遍时间线。2024 年 4 月首个公开版本 0.10.1；2024 年底进 beta；2026 年 1 月进入 1.0 RC，API 冻结。

注意一个顺序细节：2026 年 3 月 12 日 Vite 8 stable 先发布，把还在 RC 期的 Rolldown 转正为默认打包器；5 月 7 日 Rolldown 1.0 stable 才正式发布，并承诺语义化版本。到现在 2026 年 6 月，已经迭代到 1.1.x。

项目由 VoidZero 主导——尤雨溪创立的开源工具链公司，加上约两百名社区贡献者。VoidZero 同时养着 Vite、Vitest、Oxc，Rolldown 是这盘棋的打包层。
-->

---

# Oxc 体系：Rolldown 的零件库

| 环节 | Oxc 组件 | 角色 |
|---|---|---|
| 解析 | oxc parser | 源码 → AST |
| 转换 | oxc transformer | TS / JSX / target 降级 / define |
| 模块解析 | oxc-resolver | 裸导入 / alias / tsconfig paths |
| 压缩 | oxc minifier | `output.minify` |

<div v-click class="mt-3">

> 整条管线 Rust 原生协作、避免重复 parse —— 这是「内置功能多还快」的结构性原因

</div>

<!--
Rolldown 不是孤立项目，它站在 Oxc 上。Oxc 是 VoidZero 体系的 Rust 编译器工具集。

对应关系：解析用 oxc parser；TS 剥类型、JSX 转换、语法降级、define 替换用 oxc transformer；裸导入、别名、tsconfig paths 解析用 oxc-resolver；压缩用 oxc minifier。

关键在于整条管线是 Rust 原生协作，不需要在工具间反复 parse、序列化。这就是 Rolldown 内置功能比 Rollup 多一个量级、速度还快的结构性原因。Vite 8 同样把 Oxc 当编译层。
-->

---

# 性能特征

**合成基准**（官网，约 1.9 万模块）

- Rolldown **1.61s** ≈ esbuild 1.70s
- 比 Rollup 快 **10~30 倍**

<div v-click>

**真实端到端案例**（Vite 8 / 1.0 公告）

| 项目 | 收益 |
|---|---|
| Linear | 构建 **46s → 6s** |
| Ramp / Beehiiv | **-57% / -64%** |
| Mercedes-Benz.io | **-38%** |

</div>

<!--
性能分两层看。合成基准：官网约 1.9 万模块的场景，Rolldown 1.61 秒，esbuild 1.70 秒——同一量级甚至略胜；对 Rollup 则是 10 到 30 倍的领先。

真实世界更有说服力：Vite 8 公告引用的迁移案例，Linear 的生产构建从约 46 秒降到 6 秒；Ramp 缩短 57%，Beehiiv 64%，奔驰的前端团队 38%。

注意真实数字比基准保守是正常的——完整构建还有插件、压缩、IO 这些省不掉的环节。Framer、PLAID 等公司已在生产环境使用。
-->

---
layout: two-cols-header
---

# 安装与第一次打包

::left::

**安装（单包，无需 Rust 环境）**

```bash
npm i -D rolldown
```

**直接打包 TS，零插件**

```bash
npx rolldown src/main.ts \
  --file bundle.js
npx rolldown src/main.ts \
  -d dist --format cjs --minify
```

::right::

**Rollup 对比：插件全家桶**

- TS → plugin-typescript
- 解析 → plugin-node-resolve
- CJS → plugin-commonjs
- 压缩 → terser 插件

<div v-click class="mt-2">

> Rolldown：**以上全部内置**

</div>

<!--
上手很简单：npm i -D rolldown，单包内含 CLI 和 JS API，发的是预编译二进制——Linux、macOS、Windows 全覆盖，不支持的平台还有 Wasm 兜底，完全不需要本地 Rust 环境。

直接对着 TS 入口打包就行：--file 出单文件，-d 出目录，--format 选格式，--minify 压缩。注意这里一个插件都没装。

右边是 Rollup 时代的对比：处理 TS 要 plugin-typescript，解析 node_modules 要 node-resolve，CJS 互操作要 commonjs 插件，压缩还要 terser。Rolldown 把这些高频脏活全部内置——这是迁移者体感最强的差异。
-->

---
layout: two-cols-header
---

# 配置文件与 JS API

::left::

**rolldown.config.js**

```js
import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/main.ts",
  output: {
    dir: "dist",
    format: "esm",
    minify: true,
  },
});
```

::right::

**JS API（Rollup 同构）**

```js
import { rolldown } from "rolldown";

const bundle = await rolldown({
  input: "src/main.ts",
});
await bundle.write({ dir: "dist" });
```

<div v-click class="mt-2 text-sm">

> 支持 `.ts` 配置、导出数组跑多份构建；另有 `build()` / `watch()`

</div>

<!--
配置体验对 Rollup 用户零学习成本。推荐 rolldown.config.js，defineConfig 给类型提示，配置文件本身支持 ts、mjs 等格式，导出数组就能一次跑多份构建，比如同时出 esm 和 cjs。

右边是 JS API：rolldown 函数接输入选项返回 bundle，再 write 或 generate 输出——和 Rollup 的两步式完全同构。还有一步到位的 build 函数，以及事件模型兼容 Rollup 的 watch。

这种 API 级对齐是刻意设计：让存量 Rollup 工具链和肌肉记忆都能平移过来。
-->

---

# platform 与输出格式

<v-clicks>

- `platform`: **browser | node | neutral**
- 默认规则：cjs 输出 → `node`，其余 → `browser`
- `format`: **esm | cjs | iife | umd**
- 默认格式**恒为 esm**——esbuild 是 node 平台默认 cjs
- ⚠️ browser 平台**不会** polyfill Node 内置模块
- 需要时用 `rolldown-plugin-node-polyfills`

</v-clicks>

<!--
两个全局性选项。platform 三个取值：browser、node、neutral，影响模块解析条件和 process.env.NODE_ENV 的处理。默认规则：输出格式是 cjs 时默认 node，其余默认 browser。

format 支持 esm、cjs、iife、umd。重点：默认格式恒为 esm，不随 platform 变——官方专门强调这是和 esbuild 的差异，esbuild 在 node 平台默认输出 cjs。

还有个易错点：platform 设成 browser 不会自动 polyfill fs、path 这些 Node 内置模块，需要时装社区的 rolldown-plugin-node-polyfills。
-->

---

# 内置功能全景

| 能力 | Rollup 做法 | Rolldown |
|---|---|---|
| TS / JSX | 插件 | **内置**（`transform.jsx`） |
| 模块解析 | node-resolve | **内置**（oxc-resolver + paths） |
| CJS 互操作 | commonjs 插件 | **内置**（esbuild 语义） |
| 压缩 | terser 插件 | **内置**（`output.minify`） |
| 语法降级 | babel 插件 | **内置**（`target`，最低 ES2015） |

<div v-click class="mt-2 text-sm">

> ⚠️ 边界：TS 只**剥类型不查类型**（配 `tsc --noEmit`）；target 只降语法**不注入 polyfill**

</div>

<!--
内置功能全景对比。TS 和 JSX 转换内置，jsx 选项支持 react 经典运行时、react-jsx 自动运行时、preserve 原样保留；模块解析内置，oxc-resolver 驱动，默认对齐 Node 和 TypeScript 行为，含 tsconfig paths；混合 ESM/CJS 模块图开箱即用，互操作语义对齐 esbuild；压缩内置 Oxc minifier；语法降级用 transform.target，最低降到 ES2015。

两个必须记住的边界：第一，TS 是剥类型不是查类型，类型把关还得 tsc --noEmit；第二，target 只降语法不注入 polyfill，旧环境缺的运行时 API 要自己补。
-->

---
layout: two-cols-header
---

# define 与 inject

::left::

**define：构建期常量替换**

```js
transform: {
  define: {
    "process.env.NODE_ENV":
      "'production'",
    __VERSION__:
      JSON.stringify(pkg.version),
  },
}
```

::right::

**inject：全局变量 shim**

```js
transform: {
  inject: {
    Promise:
      ["es6-promise", "Promise"],
    $: "jquery",
  },
}
```

<div v-click class="mt-2 text-sm">

> ⚠️ define 的值是**表达式串**：字符串要双层引号，漏写会变成裸标识符直接报错

</div>

<!--
两个 esbuild 系的内置转换。define 把全局标识符或属性访问器替换成常量表达式，最经典的就是 process.env.NODE_ENV。划重点：值是表达式字符串，所以字符串字面量必须双层引号，或者直接 JSON.stringify。漏写内层引号，production 会被当成裸标识符注入，运行时直接报未定义。

inject 是按需注入 import 来 shim 全局变量：模块里用到了 Promise 这个名字，就自动插入对应导入。API 对齐 rollup/plugin-inject，支持具名、默认、命名空间导入和属性访问 shim。

还有个好用的小特性 dropLabels：把 DEBUG 标签的语句在构建期整段删掉。
-->

---

# 手动分包：codeSplitting

```js
output: {
  codeSplitting: {
    groups: [
      { test: /node_modules\/(react|react-dom)/,
        name: "react-vendor" },
      { test: /node_modules/, name: "libs" },
    ],
  },
}
```

<v-clicks>

- webpack `splitChunks` 式声明分组，**esbuild / Rollup 都没有**
- `manualChunks` **已废弃** → 迁移到 groups
- 经典收益：依赖独立成 chunk，业务变更不击穿缓存

</v-clicks>

<!--
代码分割。自动分包——多入口共享模块、动态 import 拆 chunk——默认就有。亮点是手动分包 output.codeSplitting：用 groups 声明式分组，test 匹配模块 ID，name 定 chunk 名，按序匹配。

这是官方列为创建动机之一的特性：webpack 的 splitChunks 大家用了很多年，但 esbuild 和 Rollup 都没有等价物。Rollup 的 manualChunks 表达力弱，在 Rolldown 里已标记废弃，迁移方向就是 codeSplitting。预览期它曾叫 advancedChunks，正式名是 codeSplitting。

经典用法：react 全家桶单独成 chunk、其余依赖进 libs——业务代码频繁变更时，依赖 chunk 的缓存稳定不动。
-->

---

# 插件兼容：复用 Rollup 生态

<v-clicks>

- 插件接口与 Rollup「**几乎完全兼容**」
- 钩子名 / this 上下文 / 返回值约定一致
- 大多数 **Rollup / Vite / unplugin 插件直接用**
- 不支持的钩子仅少数：`shouldTransformCachedModule`、`resolveImportMeta`、`resolveFileUrl`、`renderDynamicImport`
- 虚拟模块沿用 **`\0` 前缀**约定

</v-clicks>

<!--
插件生态是 Rolldown 最大的护城河策略。插件接口和 Rollup 几乎完全兼容：钩子名称、this 上下文方法、返回值约定都一致，所以大多数 Rollup 插件、Vite 插件、unplugin 系插件直接放进 plugins 数组就能跑——这正是 Vite 8 能平滑切换的底气。

不支持的钩子只有少数几个：shouldTransformCachedModule 绑定 Rollup 的缓存模型，还有 resolveImportMeta、resolveFileUrl、renderDynamicImport。撞上会有警告，不会静默失效。

写插件的约定也延续：虚拟模块的 resolved ID 加 \0 空字节前缀，防止其他插件和内置解析把它当真实文件处理。
-->

---

# hook filter：JS 插件的性能生命线

```js
const myCssPlugin = {
  name: "my-css",
  transform: {
    filter: { id: /\.css$/ }, // Rust 侧预筛
    handler(code, id) { /* 只有 .css 进来 */ },
  },
};
```

<v-clicks>

- 每次 JS 钩子调用 = **跨 Rust↔JS 边界 + 传输模块内容**
- filter 让 Rust 直接跳过不匹配模块，**不发起调用**
- 高频通用件用 **builtin 插件**（`builtin:replace` 等，纯 Rust）

</v-clicks>

<!--
Rolldown 的性能死角不在 Rust 核心，而在 Rust 和 JS 的边界。每调一次 JS 钩子，都要跨语言调度、把模块内容传过去；万级模块乘以多插件多钩子，这笔账足以吃掉引擎红利。

解法一：hook filter。把匹配条件——id 正则、code 包含——声明给 Rust 侧，不匹配的模块根本不发起 JS 调用。写 Rolldown 插件的第一反应就该是配 filter。第三方插件没配的，Vite 还提供 withFilter 包装器外挂补救。

解法二：高频通用逻辑用官方 builtin 插件，比如 builtin:replace、builtin:bundle-analyzer，纯 Rust 实现全程不出边界。注意 builtin:replace 和 rollup 版的差异：只接受静态值、没有 include/exclude。
-->

---

# Notable Differences from Rollup

| 差异点 | Rolldown | Rollup |
|---|---|---|
| `outputOptions` 时机 | build 钩子**之前** | 之后 |
| 多 output 的 build 钩子 | **每输出各跑一遍** | 共跑一次 |
| `closeBundle` | 需 generate/write **至少一次** | 无条件触发 |
| watch 的 `options` | **仅初始化一次** | 每次重建 |
| `writeBundle` | **默认顺序**执行 | 默认并行 |

<!--
兼容的另一面，是官方明确列出的刻意差异，深度插件作者必须逐条核对。

第一，outputOptions 钩子在 Rolldown 里于 build 钩子之前调用，Rollup 是之后——时序假设型插件会翻车。第二，配置里有多个 output 时，Rolldown 对每个输出各跑一遍 build 钩子，Rollup 只跑一次 build 再分别 generate——钩子里的副作用必须幂等。

第三，closeBundle 只有在调用过 generate 或 write 之后才触发，只建不出的分析流程里清理逻辑要兜底。第四，watch 模式 options 钩子只在初始化时调一次，按次刷新的逻辑要搬到 buildStart。第五，writeBundle 默认顺序执行，Rollup 默认并行——部署上传类插件在 Rolldown 下天然有序。
-->

---

# Vite 8 集成与 Full Bundle Mode

<v-clicks>

- 过渡期：`rolldown-vite` 临时包（npm alias 替换 `vite`）
- **2026-03-12 Vite 8 stable**：Rolldown 转正，绝大多数插件零改动
- `@vitejs/plugin-react` v6：**Oxc 跑 React Refresh，移除 Babel**
- 未来：**Full Bundle Mode**——dev 也产打包产物
- 预期：启动 **~3×**、整页重载 **~40%**、请求 **~10× 减少**
- 彻底消除 dev / prod「是否打包」这一最大差异

</v-clicks>

<!--
Vite 集成三部曲。第一步，2025 年的过渡包 rolldown-vite：在 package.json 用 npm alias 把 vite 指到 rolldown-vite 提前体验，插件用 this.meta.rolldownVersion 探测环境。

第二步，2026 年 3 月 12 日 Vite 8 stable，Rolldown 转正为唯一打包器，开发预构建和生产打包同一引擎，绝大多数插件零改动。配套的去 Babel 化：plugin-react v6 改用 Oxc 跑 React Refresh，React 项目 dev 链路最慢的一环被 Rust 化。

第三步是未来：Full Bundle Mode。现在 dev 是不打包的按需 ESM，大应用首屏几千个模块请求形成瀑布。让 dev 也产打包产物，官方预期启动快 3 倍、整页重载快 40%、网络请求少 10 倍——还顺手消除了 dev 和 prod 最后的最大差异。注意它目前是实验性 opt-in 方向。
-->

---

# 库打包：交给 tsdown

```ts
// tsdown.config.ts
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
});
```

<v-clicks>

- rolldown 官方出品，「**powered by Rolldown**」，tsup 接班人
- 库场景四件套：**dts 生成、依赖自动 external、exports 生成、unbundle**
- 2026-06 仍 **0.22.x**（未 1.0），但已是官方推荐

</v-clicks>

<!--
打库不必裸用 Rolldown，官方路径是上层工具 tsdown——rolldown 组织出品，口号 The elegant bundler for libraries powered by Rolldown，定位 tsup 的现代接班人，提供 tsup 迁移指南。

它在 Rolldown 之上补齐库场景四件套：dts 类型声明生成；package.json 里的 dependencies 和 peerDependencies 自动标记 external；exports 字段生成；以及保留模块结构的 unbundle 模式。

版本现状：2026 年 6 月还在 0.22.x，没到 1.0，但已经是 Vite 生态打库的官方推荐。一句话分工：应用打包 Rolldown（通常经由 Vite 8），库打包 tsdown。
-->

---
layout: intro
---

# 总结

Rolldown = **Rollup 兼容 API + esbuild 内置功能 + Rust 速度**

- 使命：统一 Vite 双引擎；2026-03 Vite 8 默认、2026-05 发 1.0
- 底座 Oxc：parse / transform / resolve / minify 一条 Rust 管线
- 内置 TS/JSX/CJS/define/inject/minify；codeSplitting 手动分包
- 插件几乎全兼容，性能靠 **hook filter + builtin**；差异清单要核对
- 库打包用 tsdown；未来看 Full Bundle Mode

<!--
总结。Rolldown 一句话：Rollup 兼容的 API，esbuild 级的内置功能，Rust 的速度。

它的使命是统一 Vite 双引擎——2026 年 3 月 Vite 8 把它转正为默认打包器，5 月 1.0 stable 发布并承诺语义化版本。底座是 Oxc：解析、转换、模块解析、压缩一条 Rust 管线。

工程上记住：TS、JSX、CJS 互操作、define、inject、minify 全内置；手动分包用 codeSplitting；Rollup 插件几乎全兼容，但 JS 插件要配 hook filter、高频件用 builtin；钩子行为差异清单迁移时逐条核对。

库打包交给 tsdown，未来方向看 Full Bundle Mode——dev 也打包，把开发体验和一致性一起拿下。谢谢大家。
-->
