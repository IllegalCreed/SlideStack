---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Babel
info: |
  Presentation Babel — the JavaScript compiler.

  Learn more at [https://babeljs.io](https://babeljs.io)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🐠</span>
</div>

<br/>

## Babel — JavaScript 编译器

把 ES2015+ 与 TS / JSX 转换成向后兼容 JS 的工具链，做语法转换 + polyfill 注入，但不做类型检查。2026 年 latest 仍是 7.29.x，Babel 8 还在 RC

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/babel/babel" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Babel —— 官方一句话定位：Babel is a JavaScript compiler，一套主要把 ES2015+ 代码转成当前与较旧环境都能跑的、向后兼容 JS 的工具链。

它做两件事：语法转换，加可选的 polyfill 注入。最关键的边界：Babel 不做类型检查，这点和 tsc 正好互补。

2026 年它处在生态分水岭：latest 还是 7.29.x，Babel 8 仍是 RC 没正式发布；新栈像 Vite、Rolldown、Oxc 在绕开它，但靠最大的插件生态和 TC39 提案试验场地位，依旧绕不开。

顺序：为什么需要 → 三阶段 → 安装 → 配置文件 → preset/plugin → 顺序规则 → preset-env → polyfill → TS/React → transform-runtime → 写插件 → 为什么慢 → Babel 8 → 踩坑 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么需要 Babel？

现代 JS 写出来，旧环境跑不了：

<v-clicks>

- 旧浏览器 / 环境不认新语法
- 新语法降级后仍缺运行时 API
- TS / JSX 不能直接运行

</v-clicks>

<div v-click class="mt-6">

Babel 一条管线解决：

- 新语法**降级**成兼容 JS
- 配 core-js **注入 polyfill**
- 剥 TS 类型、转 JSX

</div>

<!--
为什么需要 Babel？现代 JS 直接写出来，旧环境往往跑不了：旧浏览器不认箭头函数、可选链这些新语法；就算语法降级了，Promise、includes 这类运行时 API 还是缺；TS 和 JSX 更是不能直接运行。

Babel 用一条管线解决这些：把新语法降级成兼容版本，配合 core-js 注入 polyfill 补运行时 API，再把 TS 类型剥掉、把 JSX 转成普通函数调用。
-->

---

# 编译三阶段

```text
源码 ─parse─▶ AST ─transform─▶ 新 AST ─generate─▶ 代码
```

| 阶段 | 负责包 | 做什么 |
|---|---|---|
| **parse** | `@babel/parser` | 源码 → Babel AST |
| **transform** | `@babel/traverse` | visitor 改写 AST |
| **generate** | `@babel/generator` | AST → 代码 + map |

<div v-click class="mt-3">

> `@babel/core` 编排全流程，`@babel/types` 构建/校验节点。**插件 = 一组 visitor**。

</div>

<!--
Babel 不是字符串替换，而是一条 AST 改写管线，分三个阶段。

parse 阶段，@babel/parser，它 fork 自 acorn，把源码解析成 Babel AST。transform 阶段，@babel/traverse 用 visitor 遍历改写 AST，所有插件和预设都在这一步生效。generate 阶段，@babel/generator 把改写后的 AST 重新输出成代码和 source map。

@babel/core 负责编排整个流程，@babel/types 用来构建和校验节点。记住一句话：插件本质就是一组 visitor，这是理解 Babel 可扩展性和性能的钥匙。
-->

---
layout: two-cols-header
---

# 安装与第一次编译

::left::

**安装**

```bash
npm i -D @babel/core \
  @babel/cli @babel/preset-env
```

**编译**

```bash
npx babel src -d dist
node dist/index.js
```

::right::

**最小 babel.config.json**

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.25%, not dead"
    }]
  ]
}
```

<!--
安装很简单：@babel/core 是核心，@babel/cli 提供 babel 命令，@babel/preset-env 是最常用的预设。

编译用 npx babel src -d dist，读配置后把 src 编译到 dist。

右边是最小配置：一个 preset-env 加一个 targets，就能把现代语法降级到目标浏览器。注意它只降语法，不补运行时 API。
-->

---

# 两种配置文件：作用域不同

| 维度 | `babel.config.json` | `.babelrc.json` |
|---|---|---|
| 定位 | **项目级** | **文件相对** |
| 解析起点 | 项目 root | 文件所在目录向上 |
| 何时停 | 整个项目 | 遇 `package.json` 即停 |
| 管 `node_modules` | **能** | **不能** |

<div v-click class="mt-4">

> 经典坑：想编译 `node_modules` 里的依赖却写进 `.babelrc` → **不生效**。跨包 / 编依赖一律用 `babel.config.json`。

</div>

<!--
Babel 有两类配置文件，差别不在写法，而在解析作用域。

babel.config.json 是项目级，从项目 root 解析，作用于整个项目包括 node_modules。.babelrc.json 是文件相对，从被编译文件所在目录向上找，遇到含 package.json 的目录就停，管不到 node_modules。

最经典的坑：想让 Babel 编译 node_modules 里某个发布成 ES2015+ 的依赖，却把配置写进 .babelrc，结果不生效。记住：跨包、编依赖、monorepo，一律用 babel.config.json。
-->

---

# preset 与 plugin

<v-clicks>

- **plugin**：单一职责的转换单元
- **preset**：一组 plugin 打包的「套餐」
- `@babel/preset-env` 就是一大批语法插件的套餐

</v-clicks>

<div v-click class="mt-4">

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

</div>

<!--
两个核心概念：plugin 是单一职责的转换单元，比如把可选链转掉的一个插件；preset 是一组 plugin 打包成的套餐。最常用的 preset-env 内部就含一大批语法转换插件。

实际项目里两者经常一起用：presets 里放 preset-env、preset-react，plugins 里放 transform-runtime 这类单点插件。下一页讲它们的执行顺序，很反直觉。
-->

---

# 顺序规则（反直觉，必考）

<v-clicks>

- **Plugins run before Presets** — plugin 先于 preset
- **Plugin ordering is first to last** — plugin 正序
- **Preset ordering is reversed** — preset 逆序

</v-clicks>

<div v-click class="mt-4">

```json
{ "presets": ["@babel/preset-env", "@babel/preset-react"] }
// 实际：preset-react 先跑，preset-env 后跑
```

</div>

<!--
Babel 最反直觉、也最常考的点：顺序规则。官方三句话。

第一，Plugins run before Presets，plugin 整体先于 preset 执行。第二，Plugin ordering is first to last，plugin 数组按正序，从前到后。第三，Preset ordering is reversed，preset 数组按逆序，从后到前。

所以 presets 写 env、react 时，实际是 react 先跑、env 后跑。为什么逆序？因为人们习惯把更基础、更靠近输出的 preset 放后面，逆序执行能让它先把 JSX 这类方言转成普通 JS,再交前面的 preset 继续处理。
-->

---

# preset-env：智能降级

```json
{
  "presets": [
    ["@babel/preset-env", { "targets": "defaults" }]
  ]
}
```

<v-clicks>

- 声明 **targets** / browserslist，它自动算要转什么
- 与 PostCSS / Autoprefixer **共用一份目标**
- ⚠️ 不配 targets → **全量降级**，产物臃肿

</v-clicks>

<!--
preset-env 是智能预设：你只声明目标环境 targets，它自己算要降级哪些语法、要不要注入 polyfill，不用手工挑插件。

targets 可以写浏览器 query，也可以放进项目根的 .browserslistrc，这样能和 PostCSS、Autoprefixer 共用一份目标，避免多处不一致。

划重点：生产项目一定要显式声明 targets。不写的话 7.x 默认相当于把所有特性都转掉，产物会非常臃肿。
-->

---

# polyfill 三策略

| `useBuiltIns` | 行为 | 谁用 |
|---|---|---|
| `"usage"` | 按用到的 API 注入 | **应用** |
| `"entry"` | 按 targets 全量注入 | 应用 |
| `false` | 不处理（默认） | — |

<div v-click class="mt-3 text-sm">

> ⚠️ `corejs` 要带次版本（`"3.36"`）；只写 `"3"` 会被当 3.0 漏新特性。库别用 usage 污染全局 → 用 transform-runtime。

</div>

<!--
preset-env 只转语法,运行时 API 要靠 polyfill,用 useBuiltIns 加 corejs 控制。

usage 按代码实际用到的 API 自动注入,最省体积,是应用首选。entry 按 targets 全量注入,需在入口手写 import core-js/stable。false 是默认,不处理 polyfill。

两个坑:第一,corejs 要写带次版本号比如 3.36,只写 3 会被当成 3.0,漏掉后续新增的 polyfill。第二,库不要用 usage 往全局塞 polyfill 污染使用方,库应该用 transform-runtime 做沙箱化注入。还有,@babel/polyfill 从 7.4 起已废弃,改用 core-js/stable。
-->

---
layout: two-cols-header
---

# TypeScript 与 React

::left::

**preset-typescript：只剥类型**

```json
{ "presets": [
  "@babel/preset-typescript"
] }
```

> 不检查！类型错也照样产出，需另跑 `tsc --noEmit`。

::right::

**preset-react：automatic**

```json
{ "presets": [
  ["@babel/preset-react",
   { "runtime": "automatic" }]
] }
```

> 无需手动 `import React`（React 17+）。

<!--
处理 TS 和 React。

preset-typescript 让 Babel 直接吃 ts、tsx,但官方明确它不做类型检查,只是逐文件剥掉类型。语法对的代码,哪怕类型错了也会被转换,而且常常转得不符合预期。所以类型安全必须另跑 tsc --noEmit,典型分工是 Babel 快速产 JS 加 tsc 把关类型并行跑。

preset-react 转 JSX,React 17 以上用 runtime automatic,自动从 react/jsx-runtime 引入工厂函数,写 JSX 不再需要手动 import React。注意 Babel 8 会把这个默认值从 classic 改成 automatic。
-->

---

# 库作者：transform-runtime

```json
{
  "plugins": [
    ["@babel/plugin-transform-runtime", { "corejs": 3 }]
  ]
}
```

<v-clicks>

- **helpers 去重** → 抽成对 `@babel/runtime` 的引用
- **沙箱化 polyfill** → 不往全局原型挂方法
- 库的正确姿势：不污染使用方环境

</v-clicks>

<!--
库作者要特别注意 polyfill 方式。应用可以用 useBuiltIns usage 往全局塞 polyfill,但库这么做会污染使用方的全局环境。

库应该用 @babel/plugin-transform-runtime 加 @babel/runtime。它做两件事:第一,helpers 去重,把 Babel 注入的内联 helper 抽成对 @babel/runtime 的引用,避免每个文件重复一份。第二,用 corejs 选项做沙箱化 polyfill,以局部别名引用 core-js,不往全局原型挂方法,不污染宿主。

一句话:应用用 usage,库用 transform-runtime。
-->

---

# 写一个插件：visitor

```js
export default function () {
  return {
    name: "rename-foo",
    visitor: {
      Identifier(path) {
        if (path.node.name === "foo") path.node.name = "bar";
      },
    },
  };
}
```

<div v-click class="mt-3 text-sm">

> `path` 提供上下文与改写：`path.node` / `path.scope` / `replaceWith()`。配 `@babel/types` 构建合法节点。

</div>

<!--
插件本质是一组作用于 AST 节点类型的 visitor。这个例子:返回一个带 visitor 的对象,visitor 的键是节点类型 Identifier,值是进入该节点的回调,把所有叫 foo 的标识符改名为 bar。

path 是节点的包装器,提供上下文和改写能力:path.node 是当前节点,path.scope 是作用域和绑定,还有 replaceWith、remove、insertBefore 这些方法。改写时不要手搓对象,用 @babel/types 来构建和校验节点,保证结构合法。

理解 path 加 visitor,就等于理解了 Babel 的可扩展性,也是 codemod 的底座。
-->

---

# 为什么比 SWC / Oxc 慢

| 工具 | 语言 | 相对速度 |
|---|---|---|
| **Babel** | JS | 1×（基线） |
| SWC | Rust | ~18× / 多核 60×+ |
| Oxc | Rust | 20~50× |

<div v-click class="mt-4">

> 根因：**纯 JS 实现 + 通用 visitor 管线**（节点反复进出、GC 开销）。换来的是**最大插件生态 + TC39 提案试验场**。

</div>

<!--
Babel 为什么慢?根因是实现语言加管线设计,不是配置问题。

Babel 是纯 JavaScript 实现,受 JS 单线程和 GC 影响;SWC 和 Oxc 都用 Rust,能多核并行、无 GC 开销。再加上 Babel 的通用 visitor 管线,每个插件各自遍历改写 AST,节点反复进出 visitor,灵活但开销大。

量级上,SWC 官方称单线程约 18 倍、多核 60 倍以上于 Babel,Oxc 宣称 20 到 50 倍。

但 Babel 慢换来的是最大的插件和 codemod 生态,以及 TC39 提案试验场地位。要极致速度用 SWC、Oxc;要丰富插件、codemod、跑提案语法,Babel 仍不可替代。
-->

---

# Babel 8：仍在 RC

<v-clicks>

- **ESM-only**：原生 ESM，不再发 CJS
- Node 最低 `^22.18.0 || >=24.11.0`
- `loose` / `spec` 移除 → 顶层 `assumptions`
- preset-react 默认 → `automatic`
- preset-env 默认 targets → `"defaults"`
- `corejs` 选项移除 → `babel-plugin-polyfill-corejs3`

</v-clicks>

<!--
Babel 8 截至 2026 年 6 月仍是 RC、没正式发布,latest 还是 7.29.x。主要破坏性变更:

ESM-only,发原生 ESM 不再发 CJS;抬高 Node 最低版本到 22.18 或 24.11 以上;loose 和 spec 各插件选项移除,改用顶层 assumptions;preset-react 的 runtime 默认从 classic 改成 automatic;preset-env 默认 targets 从约等于全量降级改成 defaults;polyfill 的 corejs 选项移除,改用 babel-plugin-polyfill-corejs3;proposal 插件统一改名 transform;bugfixes 恒开并移除选项。

迁移哲学很友好:大多数变更在 Babel 7 里已经能通过选项提前做掉,所以提前做好,等 8 正式发布只需小幅调整。
-->

---

# 常见坑 & Tips

<v-clicks>

- `.babelrc` **管不到 `node_modules`** → 用 `babel.config`
- preset **逆序**、plugin **正序**、plugin **先于** preset
- preset-env 不配 targets → 全量降级臃肿
- preset-typescript **不查类型** → 配 `tsc --noEmit`
- `corejs: "3"` 被当 3.0 → 写 `"3.36"`
- 库用 usage 污染全局 → 用 transform-runtime

</v-clicks>

<!--
高频坑汇总。

第一,.babelrc 管不到 node_modules,要编依赖、跨包用 babel.config。第二,顺序规则:preset 逆序、plugin 正序、plugin 先于 preset。第三,preset-env 不配 targets 会全量降级,产物臃肿。第四,preset-typescript 不做类型检查,要另配 tsc --noEmit。第五,corejs 写 3 会被当 3.0 漏新特性,写带次版本的 3.36。第六,库用 useBuiltIns usage 会污染使用方全局,改用 transform-runtime。
-->

---
layout: intro
---

# 总结

Babel = **语法转换 + polyfill 的工具链，不做类型检查**

- 三阶段 parse → transform → generate；preset = plugin 套餐
- preset-env 按 targets 智能降级；应用用 usage、库用 transform-runtime
- 护城河：最大插件 / codemod 生态 + TC39 提案试验场
- 2026：latest 7.29.x，Babel 8 仍 RC；新栈（Vite/Rolldown/Oxc）正绕开它

<!--
总结一下。

Babel 是语法转换加 polyfill 注入的工具链,核心边界是不做类型检查,这点和 tsc 互补。

技术上:编译分 parse、transform、generate 三阶段,preset 是 plugin 的套餐;preset-env 按 targets 智能降级,polyfill 应用用 usage、库用 transform-runtime。

它的护城河是最大的插件和 codemod 生态,加上 TC39 提案试验场地位。

2026 年的现状:latest 还是 7.29.x,Babel 8 仍在 RC;同时新栈像 Vite、Rolldown、Oxc 正在绕开它。Babel 不再是唯一选择,但依然是工具链里绕不开的一环。谢谢大家。
-->
