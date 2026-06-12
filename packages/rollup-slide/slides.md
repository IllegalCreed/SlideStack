---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Rollup
info: |
  Presentation Rollup — the JavaScript module bundler.

  Learn more at [https://rollupjs.org](https://rollupjs.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📦</span>
</div>

<br/>

## Rollup — JavaScript 模块打包器

ESM 优先、tree-shaking 鼻祖、库打包事实标准。2026：本体 4.x 维护中，Rolldown（Rust、兼容 API）已 1.x 并成为 Vite 8 内核

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/rollup/rollup" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Rollup。官方一句话定位：The JavaScript module bundler——把小块代码编译合并成更大更复杂产物的模块打包器，产物可以是库，也可以是应用。

它有三个标签：ESM 优先设计的代表、tree-shaking 的鼻祖、库打包的事实标准。

2026 年它处在传承节点：本体 4.x 还在持续维护，最新 4.61.x；同时 VoidZero 主导的 Rolldown 用 Rust 全量重写、保持 Rollup 兼容 API，已经发布 1.x 并成为 Vite 8 的统一打包内核。

顺序：定位 → ESM 优先 → tree-shaking → 上手 → 配置 → 第三方依赖 → external → 输出格式 → 副作用边界 → 代码分割 → 库策略 → 插件钩子 → 写插件 → JS API → Rollup 4 与坑 → 生态格局 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# Rollup 是什么？

官方定义：**module bundler for JavaScript**

<v-clicks>

- 把模块按依赖图**合并**成库或应用产物
- 内建 **tree-shaking**，只保留用到的代码
- **scope hoisting**：产物扁平、几乎无运行时
- 一份配置输出 **es / cjs / umd / iife** 多格式

</v-clicks>

<div v-click class="mt-6">

> 边界：不降级语法（Babel 的事）、不查类型（tsc 的事）、无 dev server / HMR

</div>

<!--
Rollup 是什么？官方定义：a module bundler for JavaScript，把小块代码编译成更大更复杂的产物，比如一个库或一个应用。

它做四件事：按依赖图合并模块；内建 tree-shaking 只保留真正用到的代码；scope hoisting 把所有模块提升进同一作用域，产物扁平干净、几乎没有运行时包装代码；一份配置可以同时输出 es、cjs、umd、iife 等多种格式。

同样重要的是边界：它不做语法降级，那是 Babel、SWC 的事；不做类型检查，那是 tsc 的事；核心也不内置 dev server 和 HMR——应用开发体验由 Vite 这类上层工具补齐。
-->

---

# ESM 优先的设计

<v-clicks>

- 官方 FAQ：ESM 是 **official standard and the clear path forward**，CJS 是 **idiosyncratic legacy format**
- `import/export` 是**静态结构** → 构建期可全量分析
- 所有模块视作「**一棵共享绑定的大 AST**」整体优化
- 完整支持 **live bindings** 等规范语义
- CommonJS 输入**不被原生支持** → 需 `@rollup/plugin-commonjs`

</v-clicks>

<!--
Rollup 的根基是 ESM 优先。官方 FAQ 说得很直接：ES 模块是官方标准和明确的未来方向，CommonJS 是一种特立独行的遗留格式。

技术上为什么 ESM 重要？import/export 是静态结构，不能写在 if 里、说明符必须是字符串字面量，所以构建期就能确定完整依赖关系和每个绑定的使用情况。Rollup 因此能把所有模块当作一棵共享绑定的大 AST 做整体分析和优化——这是 tree-shaking 和 scope hoisting 的根基。它还完整支持 live bindings 这些 ESM 规范语义。

代价是 CommonJS 输入不被原生支持，npm 上的老依赖要靠 commonjs 插件先转成 ESM，后面会讲。
-->

---

# tree-shaking：live code inclusion

<v-clicks>

- 官方又称 **live code inclusion**：不是「删死代码」，而是「**只收集活代码**」
- 类似标记-清除 GC：先**标记**被用到的语句，再**摇掉**其余
- 静态分析 import 的代码，「**排除实际未使用的部分**」
- 发生在**构建期**——与运行时监控、压缩改名无关

</v-clicks>

```js
import { used } from "./foo.js"; // foo 里未用的导出不进产物
```

<!--
tree-shaking 这个词就是 Rollup 带火的。官方 FAQ 给了一个更准确的名字：live code inclusion——它不是事后删死代码，而是从一开始就只把活代码收集进产物。

工作方式类似垃圾回收的标记-清除：先从入口出发标记所有真正被用到的语句，再把语法树上没被标记的部分摇掉。官网首页的说法是：静态分析你导入的代码，排除任何实际没有被使用的东西。

注意两个区分：它发生在构建期、靠静态分析，跟运行时监控无关；它也不是压缩——变量改名、删注释是 terser 这类 minifier 的事。这页代码里，foo 模块没被 import 的导出就不会出现在产物里。
-->

---
layout: two-cols-header
---

# 安装与第一次打包

::left::

**安装（本地 + npm scripts）**

```bash
npm i -D rollup
```

**官网三条快速命令**

```bash
rollup main.js -o b.js -f iife  # 浏览器
rollup main.js -o b.js -f cjs   # Node
rollup main.js -o b.js -f umd \
  --name "myBundle"             # 通吃
```

::right::

**产物特征**

<v-clicks>

- 未用导出**没进产物**（tree-shaking）
- **没有模块包装函数**（scope hoisting）
- 团队协作：本地安装锁版本，scripts 里直接写 `rollup`

</v-clicks>

<!--
上手非常简单。官方教程推荐本地安装到 devDependencies，保证所有协作者和 CI 用同一个版本；npm scripts 执行时自动把 node_modules/.bin 加进 PATH，脚本里直接写 rollup 就行，不需要 npx 前缀。

官网给了三条快速命令，按目标环境选格式：给浏览器 script 标签用 iife 自执行格式；给 Node 用 cjs；两者通吃用 umd，注意 umd 必须用 name 参数指定全局变量名。

打开产物你会看到两个特征：被 tree-shaking 摇掉的导出根本不在文件里；整个文件也没有任何模块包装函数——所有模块被平铺进同一个作用域，这就是 scope hoisting，库产物因此干净可读。
-->

---

# 配置文件：必须 -c 显式加载

```js
// rollup.config.mjs —— 默认按 ESM 解析
export default {
  input: "src/main.js",
  output: { file: "dist/bundle.js", format: "esm" },
};
```

<v-clicks>

- **不传 `-c` 不读取**；`rollup -c -o b2.js` 命令行可覆盖同名项
- CommonJS 写法需 **`.cjs`** 扩展名（或 `--bundleConfigAsCjs`）
- 可导出**数组**（多份构建）/**函数**（接收命令行参数）
- TS 配置：`--configPlugin typescript`；`defineConfig` 仅提供类型提示

</v-clicks>

<!--
CLI 参数复杂之后改用配置文件。第一个要点也是新手第一坑：Rollup 不会自动加载配置文件，必须显式传 -c 或 --config；传了 -c 之后命令行参数还能覆盖配置里的同名项，比如临时换一个输出路径。

第二个要点：配置文件默认按 ES 模块解析，用 export default 导出。要用 require、module.exports 这种 CommonJS 写法，要么改 .cjs 扩展名，要么传 --bundleConfigAsCjs 让 Rollup 把配置转译成 CJS 执行——顺便还能用回 __dirname。

配置不止能导出对象：导出数组就是多份独立构建；导出函数能接收命令行参数做条件配置。想用 TypeScript 写配置，加 --configPlugin typescript 让插件先转译配置文件本身。defineConfig 只是类型提示辅助，不是必需的。
-->

---

# 打包第三方依赖

警告：**Treating 'lodash-es' as external dependency**

```js
import resolve from "@rollup/plugin-node-resolve"; // 定位
import commonjs from "@rollup/plugin-commonjs";    // CJS→ESM

export default {
  input: "src/main.js",
  output: { dir: "dist", format: "esm" },
  plugins: [resolve(), commonjs()],
};
```

<div v-click class="mt-3 text-sm">

> 哲学：Rollup 是「原生模块加载器的 polyfill」，浏览器不用 Node 解析算法 → 核心精简，能力给插件

</div>

<!--
直接 import 一个 npm 包名，会得到这个经典警告：Treating xxx as external dependency。原因：Rollup 默认只解析相对路径，裸导入指向 node_modules，它默认不知道怎么定位，于是当作外部依赖保留。

要打进产物，标准组合是两个官方插件：node-resolve 实现 Node 的模块定位算法，负责找到文件；commonjs 把 CJS 格式的依赖转成 ESM，负责转换格式。一个管找、一个管转，几乎总是成对出现。再加 plugin-json 就能 import JSON 文件。

为什么这么基础的能力不内置？官方 FAQ 的解释很有代表性：Rollup 本质上是原生模块加载器的 polyfill，浏览器并不使用 Node 的解析算法；核心保持精简降低维护负担，能力交给插件。这种「核心小、插件强」的哲学贯穿整个设计。
-->

---

# external / globals / name

```js
export default {
  input: "src/index.js",
  external: ["vue"], // 不打包，运行时由使用方提供
  output: {
    format: "umd",
    name: "MyLib",            // umd/iife 有导出时必填
    globals: { vue: "Vue" },  // external → 全局变量映射
  },
};
```

<v-clicks>

- 库打包惯例：**peerDependencies 全部 external**
- es/cjs 保留 import/require，**不需要** globals

</v-clicks>

<!--
external 是库打包的核心选项：声明哪些模块不打进产物，导入语句保留，运行时由使用方环境提供。组件库把 vue、react 这些 peerDependencies 全部 external 掉，避免重复打包和版本冲突。它支持字符串、正则、函数三种形式。

umd 和 iife 有两个配套必选项。第一是 name：这两种格式跑在没有模块加载器的环境，库的导出只能挂在全局变量上，name 就是这个全局变量名，还支持 a.b.c 命名空间写法。

第二是 globals：external 掉的依赖在无加载器环境下拿不到 import，只能从全局变量上取，globals 就是「模块 id 到全局变量名」的映射表，比如 vue 对应大写的 Vue。注意 es 和 cjs 格式保留标准的 import、require 语句，由模块系统解析，不需要配 globals。
-->

---

# 输出格式怎么选

| format | 适用场景 |
|---|---|
| `es` | 现代浏览器、其他打包器（库 `module` 入口） |
| `cjs` | Node.js（库 `main` 入口） |
| `iife` | `<script>` 直接引入的自执行产物 |
| `umd` | amd+cjs+iife 三合一，浏览器 Node 通吃 |
| `amd` / `system` | RequireJS / SystemJS 加载器 |

<div v-click class="mt-3 text-sm">

> 库发布：`main` → cjs/umd 保兼容，`module` → esm 供 tree-shake；现代项目再加 `exports` 条件导出

</div>

<!--
六种输出格式按消费场景选。es 给现代浏览器的 module script 和其他打包工具，是库的 module 入口指向的格式；cjs 给 Node，对应库的 main 入口；iife 是自执行函数，给 script 标签直接引入；umd 把 amd、cjs、iife 包成一个，浏览器和 Node 通吃，代价是包装代码多一点；amd 和 system 分别给 RequireJS 和 SystemJS 这类加载器。

库发布的经典策略来自官网 Introduction：main 字段指向 CJS 或 UMD 产物保证最大兼容；module 字段指向 ESM 产物，让 webpack、Vite 这些认识 module 字段的工具直接拿 ES 模块版做 tree-shaking。注意 module 是打包器社区约定，Node 本身不认它；现代项目会再叠加 exports 字段做条件导出。
-->

---

# tree-shaking 边界：副作用

<v-clicks>

- `moduleSideEffects` 默认 `true`：被导入的模块**保留顶层副作用**
- 设 `false` → 纯副作用导入（polyfill / CSS）**会被整体摇掉** ⚠️
- `/*@__PURE__*/`：声明调用无副作用，结果未用**连调用一起删**
- 包级 `sideEffects` 字段：由 **node-resolve 插件**读取生效
- 预设：`smallest`（激进）/ `recommended`（默认）/ `safest`（保守）

</v-clicks>

<!--
tree-shaking 真正的难点是副作用判定：一段代码没人用它的返回值，删掉安全吗？Rollup 给了三层控制。

模块级：treeshake.moduleSideEffects 默认 true，假定被导入的模块有副作用，所以 import './polyfill.js' 这种纯副作用导入会被保留。设为 false 就是全局假定无副作用——polyfill、CSS 导入会被整体摇掉，这是该选项最经典的事故现场。

调用级：PURE 注释标记紧随其后的调用无副作用，结果没被用时整个调用一起删，这是库作者帮下游打包器瘦身的标准手段。

包级：package.json 的 sideEffects 字段，注意在 Rollup 体系里它由 node-resolve 插件读取转化，不是核心直接解析。最后还有三个预设：smallest 体积优先最激进、recommended 默认平衡、safest 最保守，预设之上还能单独覆盖细项。
-->

---

# 代码分割：自动 + 手动

```js
// ① 动态 import → 自动拆出按需 chunk
import("./editor.js").then((m) => m.open());
```

```js
// ② 手动干预：第三方统一进 vendor
manualChunks(id) {
  if (id.includes("node_modules")) return "vendor";
}
```

<v-clicks>

- 多入口的**共享依赖自动提取**成共享 chunk，「无需自定义加载器」
- 多 chunk **必须 `output.dir`**；`iife`/`umd` 不支持分割

</v-clicks>

<!--
Rollup 的代码分割有两个自动触发条件，官网强调无需任何自定义加载器代码。第一，动态 import：被导入的模块自动拆成独立 chunk 按需加载；想压回单文件用 inlineDynamicImports。第二，多入口：共享依赖自动提取成共享 chunk，两个入口引用同一份 chunk-hash.js，避免重复打包。

手动干预用 manualChunks。函数形式最灵活：按模块 id 判断，id 里含 node_modules 就返回 vendor，把第三方统一拆出去；返回 undefined 表示不干预，交回默认策略。

两个硬约束要记住：一旦产生多个 chunk，必须用 output.dir 而不是 output.file，配错直接报错；iife 和 umd 是自包含单文件格式，不支持多 chunk，代码分割要选 es、system、cjs 或 amd。
-->

---

# 库输出策略

<v-clicks>

- `preserveModules: true`：**逐模块输出**不合并，保留文件结构
- 注意：**tree-shaking 依然生效**，不是原样拷贝源码
- `output.exports`：default 与具名导出混用 → 警告，显式 **`named`**
- plugin-babel `babelHelpers`：应用 **bundled** / 库 **runtime**（external 化 `@babel/runtime`）

</v-clicks>

<div v-click class="mt-4 text-sm">

> ES 模块语法页原话：同一模块**混用 default 与具名导出是坏实践**——库首选纯具名导出

</div>

<!--
库场景有几个专属策略。preserveModules 让 Rollup 不把模块合并成单 bundle，而是逐模块输出文件、保留原始目录结构——使用方可以按文件深度导入，下游打包器也能做更细的二次 tree-shaking。常见误解要纠正：它不是关闭 tree-shaking，未被引用的代码照样被删，改变的只是输出粒度。

output.exports 管 CJS 互操作：入口同时有 default 和具名导出时，auto 模式会警告，因为 CJS 下两者语义有歧义；要么显式 exports: named 让默认导出挂在 .default 上，要么重构成纯具名导出。官方 ES 模块语法页直说：混用 default 和具名导出是坏实践。

用 plugin-babel 接 Babel 时，babelHelpers 选项应用选 bundled 把辅助函数打进产物；库选 runtime 引用 @babel/runtime 去重，并把它声明为 external。
-->

---

# 插件钩子体系：两阶段

| 阶段 | 核心钩子（按序） | 频次 |
|---|---|---|
| **Build** | options → buildStart → **resolveId → load → transform** → buildEnd | 整次构建一轮 |
| **Output** | renderStart → renderChunk → generateBundle → writeBundle | **每份输出一轮** |

<v-clicks>

- **first**：先答先得，返回非空即短路（resolveId / load）
- **sequential**：串行级联（transform）；**parallel**：并发（buildStart）
- `output.plugins` 只能用 Output 钩子 → terser 按输出压缩

</v-clicks>

<!--
插件就是一个带 name 和若干钩子的对象。钩子分两大阶段：Build 钩子在 rollup.rollup 构建模块图时运行——resolveId 把导入说明符解析成模块 id，load 提供模块内容，transform 转换代码，这三个是主干工序；整次构建只跑一轮。Output 钩子在 generate 或 write 时运行，renderChunk 改 chunk 代码、generateBundle 在写盘前访问完整产物；关键是每份输出配置各跑一轮——一份构建配三份 output，这些钩子各执行三次。

执行方式分三类：first 类型先答先得，谁先返回非空值谁赢、后续插件跳过，resolveId 和 load 属于这类——排查「我的钩子怎么没被调用」时先想想是不是被前面的插件短路了；sequential 串行级联，transform 链式转换；parallel 并发执行。

output.plugins 只允许用 Output 阶段钩子，这正是 terser 按输出压缩的机制。
-->

---

# 写一个插件：虚拟模块

```js
export default function virtualEnv() {
  const VID = "\0virtual:env"; // \0：虚拟模块约定
  return {
    name: "virtual-env",
    resolveId(s) {
      if (s === "virtual:env") return VID;
    },
    load(id) {
      if (id === VID) return "export const mode = 'prod';";
    },
  };
}
```

<!--
最经典的插件模式：虚拟模块——磁盘上不存在、由插件凭空提供的模块，常用来注入构建期信息。

结构很简单：插件是工厂函数返回的对象。resolveId 认领公开名 virtual:env，把它映射成内部 id；返回 null 则表示礼让，交给其他插件或默认解析——这就是 first 类型钩子的协作方式。load 对内部 id 返回模块源码字符串，业务代码里就能直接 import "virtual:env"。

注意内部 id 的 \0 前缀，这是官方插件约定：告诉其他插件「这是虚拟 id，别当真实文件路径处理」——比如 node-resolve 看到 \0 就不会去 node_modules 找这个文件。

插件上下文还有一批工具：this.resolve 走完整解析管线、this.emitFile 产出额外 chunk 或资源、this.parse 用内置 SWC 解析器产 AST、this.warn 和 this.error 报告问题。
-->

---

# JavaScript API

```js
const bundle = await rollup(inputOptions); // 建图+tree-shake，不产出
await bundle.generate(esmOut); // 内存产出（可多次、可换配置）
await bundle.write(cjsOut);    // 写盘
await bundle.close();          // 必须：插件清理外部资源
```

```js
watcher.on("event", (e) => {
  if (e.result) e.result.close(); // 带 result 的事件必须 close
});
```

<v-clicks>

- watch 事件码：START / BUNDLE_START / **BUNDLE_END** / END / **ERROR**
- 配套：`loadConfigFile` 复用 CLI 配置逻辑；`@rollup/browser` 纯内存构建

</v-clicks>

<!--
编程式集成走 JavaScript API，生命周期分得很清楚：rollup() 构建模块图并完成 tree-shaking，但不产出任何输出；generate 在内存里生成产物适合分析，write 写到磁盘，两者都可以用不同的输出配置多次调用——一次构建多格式输出就是这么来的；最后必须 await bundle.close()，官方强调这是让插件清理外部进程或服务的机会，出错时也要在 finally 里关。

watch API 的资源纪律是高频坑：watcher 的事件码有 START、BUNDLE_START、BUNDLE_END、END、ERROR；其中 BUNDLE_END 和 ERROR 可能携带 result，也就是 bundle 对象——官方要求无论你用不用它生成输出，都必须调用 result.close()，否则 watch 模式每轮重建泄漏一份插件资源。停止监听用 watcher.close()。

两个配套工具：loadConfigFile 编程式加载配置并复用 CLI 的覆盖逻辑；@rollup/browser 在浏览器跑 Rollup，没有文件系统，所有模块都要靠插件提供——在线 playground 就是这么实现的。
-->

---

# Rollup 4 内部 & 常见坑

<v-clicks>

- 解析器换成**基于 SWC 的 Rust 原生实现**：按平台发原生二进制，`@rollup/wasm-node` 回退；acorn 选项移除
- hash 改 **url-safe base64**（≤21 字符），`[hash:8]` 可指定长度
- `eval` 在共享作用域下阻碍压缩改名、可窥探他模块 → **间接 eval / new Function**
- 顶层 `this` 被改写为 `undefined`：**ESM 规范行为**，非 bug
- **Circular dependency** 警告：初始化顺序可能不符预期，重构破环
- polyfill 顺序：external 执行时机不受控 → 放**每个入口第一句**或独立 entry

</v-clicks>

<!--
Rollup 4 的两个内部变化值得知道。解析器从用了多年的 acorn 换成基于 SWC 的 Rust 原生实现，按平台以 optionalDependencies 分发原生二进制，不支持的平台有 wasm-node 回退，acorn 注入选项随之移除；注意边界——原生化的是解析环节，打包主逻辑仍是 JavaScript。产物 hash 也从 base16 改成 URL 安全的 base64，最长 21 个字符。

再过四个高频坑。eval：scope hoisting 把所有模块放进共享作用域，直接 eval 既让 minifier 不敢改名、又能窥探其他模块的变量，官方建议改间接 eval 或 new Function，让代码在全局作用域求值。this 改写警告：ESM 顶层 this 规范上就是 undefined，常由老 UMD 代码触发，不是 bug。循环依赖：无循环时 Rollup 保证被依赖者先执行，有循环就发警告、初始化顺序可能出问题，根治靠抽公共依赖。polyfill：external 依赖的执行时机 Rollup 控制不了，所以要么放每个静态入口第一句，要么独立成 entry 由宿主保证先加载。
-->

---

# 2026 格局：Rollup 与 Rolldown

<v-clicks>

- **Rolldown**：VoidZero 主导、**Rust 编写**，保持 **Rollup 兼容 API / 插件接口**
- 已发 **1.x**，官网自述「unified bundler powering **Vite 8+**」
- 统一了 Vite 此前「开发 esbuild + 生产 Rollup」双引擎
- **Rollup 4.x 仍持续维护**（4.61.x、Node ≥ 18），无废弃声明
- 插件 API 兼容 → 两者间**迁移成本最低**

</v-clicks>

<!--
最后看 2026 年的生态格局。Rolldown 是 VoidZero 主导的 Rust 打包器，核心卖点是保持 Rollup 兼容的 API 和插件接口——已经发布 1.x，官网自我定位是 powering Vite 8+ 的统一打包器。所谓统一，是指它终结了 Vite 此前开发用 esbuild、生产用 Rollup 的双引擎架构，开发生产同一个内核，配套的还有 Oxc 解析转换体系。

另一边，Rollup 本体 4.x 仍在持续发版，最新 4.61.x，官方文档没有任何废弃声明；海量库的构建链还跑在它上面。

怎么选很清晰：新项目跟着 Vite 8 走，天然就是 Rolldown；存量库构建链、依赖成熟插件细节的场景，Rollup 依旧稳妥。因为插件 API 兼容，两者之间的迁移成本是所有打包器里最低的——这正是 Rolldown 能平滑承接生态的原因。
-->

---
layout: intro
---

# 总结

Rollup = **ESM 优先 + tree-shaking 鼻祖 + 库打包事实标准**

- 产物干净无运行时（scope hoisting），一份配置多格式输出
- 核心三件套：input / output(format·name·globals) / external
- 副作用三层控制：moduleSideEffects、PURE 注解、sideEffects 字段
- 钩子两阶段：Build 一轮、Output 每份输出一轮；first/sequential/parallel
- 2026：4.x 维护中；Rolldown（兼容 API）接棒，成为 Vite 8 内核

<!--
总结一下。

Rollup 的身份：ESM 优先设计的代表、tree-shaking 的鼻祖、库打包的事实标准。scope hoisting 让产物干净到几乎没有运行时代码，一份配置输出多种格式。

配置上抓核心三件套：input 入口、output 的 format、name、globals，以及 external 打包边界。tree-shaking 的副作用控制分三层：模块级的 moduleSideEffects、调用级的 PURE 注解、包级的 sideEffects 字段。插件体系记两阶段三类型：Build 钩子整次构建一轮、Output 钩子每份输出一轮；first 短路、sequential 串行、parallel 并发。

2026 年的判断：Rollup 4.x 仍在维护、存量庞大；Rolldown 以兼容 API 接棒，成为 Vite 8 的统一内核。它把 ESM 优先、tree-shaking、简洁插件 API 变成了整个行业的共识——这是比工具本身更长久的遗产。谢谢大家。
-->
