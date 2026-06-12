---
theme: seriph
background: https://cover.sli.dev
title: Welcome to ES Module
info: |
  Presentation ES Module — the standard JavaScript module system.

  Learn more at [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📦</span>
</div>

<br/>

## ES Module — JavaScript 官方模块系统

ES2015 写进语言标准的 import/export：静态结构 + live bindings，浏览器与 Node 原生支持。2026 年 require(esm) 转正（Node 25.4），ESM-only 成为发库主流

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://nodejs.org/api/esm.html" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
今天聊 ES Module。它是 ES2015 写进 ECMAScript 语言标准的官方模块系统，import/export 语法，浏览器和 Node 都原生支持。

两个技术关键词贯穿全场：静态结构——依赖关系不执行代码就能确定；live bindings——导入是导出变量的实时只读视图。

2026 年的大背景：require(esm) 在 Node 25.4 正式转正、22.12 和 20.19 起默认启用，ESM-only 发包已经能直接服务 CommonJS 用户。npm top1000 大约 42% 已经 ESM-only，新包约八成 ESM-first。

注意分工：CommonJS 的 require 解析、缓存那一半是另一场的内容，今天只在互操作时擦边。顺序：语法 → 静态结构 → live bindings → 提升循环 → TLA → import.meta → 浏览器侧 → Node 侧 → 互操作 → 发布侧。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么需要 ESM？

标准化之前，JS 没有语言级模块：

<v-clicks>

- 全局变量满天飞，脚本顺序靠手排
- 社区各造轮子：CommonJS / AMD…
- 浏览器与 Node 模块写法割裂

</v-clicks>

<div v-click class="mt-6">

ESM 一次性解决：

- **语言标准**，跨环境同一套语法
- **静态结构**，依赖编译期可知
- **模块作用域**，全局污染归零

</div>

<!--
为什么需要 ESM？ES2015 之前 JavaScript 没有语言级的模块：全局变量互相覆盖，脚本加载顺序全靠手工排；社区只好各造轮子，Node 用 CommonJS，浏览器用 AMD，两边写法完全割裂。

ESM 把模块写进语言标准，一次解决三件事：第一，它是标准，浏览器、Node、Deno、Bun 同一套语法；第二，静态结构，依赖关系在编译期就能确定，这是后面 tree-shaking 一系列红利的根；第三，每个模块有独立作用域，顶层声明不再挂到全局对象，全局污染从根上消失。

CommonJS 的历史地位和细节是另一场的主题，这里不展开。
-->

---
layout: two-cols-header
---

# 语法全家桶

::left::

**导出**

```js
export const name = "sq";     // 命名
export { draw as render };    // 重命名
export default function () {} // 默认,可匿名
export { Sq } from "./sq.js"; // 重导出
export * from "./shapes.js";  // 聚合(无 default)
```

::right::

**导入**

```js
import def from "./m.js";        // default
import { a, b as c } from "./m.js";
import def2, { d } from "./m.js"; // 混合
import * as ns from "./m.js";    // 命名空间
import "./side-effect.js";       // 仅副作用
```

<div class="mt-2 text-sm">

> 命名导出**任意多**、default **至多一个**；`export * ` **不转发 default**

</div>

<!--
语法全家桶一页过。左边导出：命名导出可以任意多个；as 重命名；export default 至多一个、后面可以跟匿名函数或任意表达式；export ... from 是重导出，转发别人的导出但不进当前作用域，是 barrel 聚合文件的基石；export star 转发全部命名导出，注意它明确不带 default。

右边导入：default 导入名字随便取；命名导入加 as 重命名；混合写法；import star as ns 拿到命名空间对象，所有导出是它的属性、default 挂在 ns.default 上，而且这个对象是只读的；最后一种只执行副作用不引绑定。

两个易错点划重点：写第二个 export default 直接语法错误；export star 不转发 default，要转发得显式写 export default as。
-->

---

# 静态结构：约束即红利

<v-clicks>

- import/export **只能在模块顶层**——if / 函数体内非法
- 说明符必须**字符串字面量**——变量、拼接非法
- 不执行代码即可求出**完整依赖图**

</v-clicks>

<div v-click class="mt-4">

```js
if (dev) import x from "./a.js"; // ✗ 语法错误
const m = await import(`./locales/${lang}.js`); // ✓ 动态 import()
```

红利：**tree-shaking**、导入名拼错加载期即报错、IDE 精确分析

</div>

<!--
ESM 的第一性原理：静态结构。两条看起来很不方便的约束——静态 import 只能写在模块顶层，if 里、函数里都不行；模块说明符必须是字符串字面量，不能是变量。

换来的是什么？打包器和引擎不执行任何代码，就能求出完整依赖图：谁导出了什么、谁用了什么，全部编译期可知。这直接带来 tree-shaking——没人用的导出可以安全删掉；导入名拼错在加载期就报错而不是运行时 undefined；IDE 的精确跳转和重构也建立在这上面。

需要运行时决定加载什么怎么办？动态 import() 函数。说明符可以是变量，返回 Promise，resolve 出模块命名空间对象。它在普通 script 甚至 CommonJS 里都能用，是按需加载的标准姿势。
-->

---

# live bindings：与 CJS 的本质分野

```js
// counter.js
export let count = 0;
export function inc() { count++; }

// main.js
import { count, inc } from "./counter.js";
inc();
console.log(count); // 1 ← 实时看到更新
count = 5;          // ✗ TypeError：导入绑定只读
```

<div v-click class="mt-3">

> ESM 导入 = 导出变量的**实时只读视图**；CJS = require 时**值拷贝**（解构后脱钩）

</div>

<!--
ESM 和 CommonJS 语义差异的核心考点：live bindings。

看例子：counter 模块导出 let count 和修改它的 inc 函数。main 导入后调一次 inc，再读 count——读到 1。导入方拿到的不是导入那一刻的值，而是指向导出变量的实时视图，导出方一更新，所有导入方立即可见。

但这个视图是只读的：在导入方给 count 赋值，直接抛 TypeError。单一写入方是 live binding 语义能成立的前提，想改状态必须走导出模块提供的函数。

对比 CommonJS：require 拿到的是值拷贝，解构出来的原始值从那一刻起和源模块脱钩，导出方后续怎么改都看不见。一个是绑定，一个是快照，这是两套模块系统最深的分野。
-->

---

# 提升、TDZ 与循环依赖

```js
sayHi(); // ✓ 合法：绑定已建立 + 函数声明提升
import { sayHi } from "./a.js"; // import 写底部也行
```

<v-clicks>

- 模块三阶段：**解析 → 实例化 → 求值**，绑定先于代码执行建立
- 循环依赖里**函数互调通常没事**（提升 + live binding）
- 初始化前读 `let/const` 导出 → **TDZ ReferenceError**，错误早而明确
- CJS 循环则拿**不完整快照**，静默 undefined 延迟爆雷

</v-clicks>

<!--
import 声明会被提升。模块加载分三个阶段：解析、实例化、求值——所有 import/export 绑定在实例化阶段就建立好了，求值时依赖还先于依赖方执行。所以 import 写在文件底部，顶部代码照样能调用导入的函数。

这套机制决定了 ESM 处理循环依赖的方式：两个模块互相 import，函数互调通常没事——函数声明整体提升，真正调用时绑定早已初始化。但如果在对方初始化完成前就去读它的 let 或 const 导出，立刻抛 TDZ ReferenceError，临时死区错误。

注意这其实是优点：错误暴露得早而且指向明确。对比 CommonJS 的循环依赖——在循环点拿到执行一半的 exports 快照，缺的属性是 undefined，往往运行很久才在很远的地方爆雷，排查困难。细节在 CommonJS 那一场展开。
-->

---

# Top-level await（ES2022）

```js
// config.js —— 模块顶层直接 await
const resp = await fetch("/api/config");
export default await resp.json();

// main.js —— 导入方会等 config 完成才执行
import config from "./config.js";
```

<v-clicks>

- **模块专属**：普通脚本 / CJS 里是语法错误（Node 14.8 免 flag）
- 真实等待语义：**整条依赖链被异步化**
- 代价：含 TLA 的模块**不能被 require(esm)**；Node 永不 resolve → 退出码 13

</v-clicks>

<!--
Top-level await，ES2022 入标准，模块专属能力：模块顶层直接写 await，不用包 async 函数。普通脚本和 CommonJS 里写顶层 await 是语法错误。Node 14.8 起免 flag 可用。

语义上要特别注意：它不是语法糖，是真实的等待——导入这个模块的一方会等它的顶层 Promise 完成才开始执行，整条依赖链被异步化。例子里 main 导入 config，main 的代码会等 fetch 完成。

两个代价要记住：第一，含有 top-level await 的模块没法被 require(esm) 同步加载，后面讲 require(esm) 时会再碰到，这对发库的人是个真实的设计约束；第二，Node 里顶层 await 永远不 resolve 的话，进程以退出码 13 结束，CI 里看到 13 要往这想。
-->

---

# import.meta 全家桶

| 属性 | 用途 | 版本 |
|---|---|---|
| `url` | 模块的 file: URL | 起步即有 |
| `dirname` / `filename` | 替代 `__dirname/__filename` | **20.11+**/21.2+ |
| `resolve(spec)` | 同步解析 → URL 字符串，**不加载** | 20.6/18.19 稳定 |
| `main` | 是否入口（替代 require.main） | 24.2+ |

```js
const data = readFileSync(new URL("./data.json", import.meta.url));
```

<!--
ESM 作用域里没有 __dirname、__filename、require，替代品全在 import.meta 上。

import.meta.url 是当前模块的 file 协议 URL，ESM 起步就有，配 new URL 相对定位资源是标准姿势，比如读取和模块同目录的 data.json。

import.meta.dirname 和 filename 直接替代 __dirname 和 __filename，Node 21.2 引入、回移植到 20.11，后续转正稳定。再老的版本用 fileURLToPath 加 path.dirname 兜底。

import.meta.resolve 是 require.resolve 的 ESM 对应物：以当前模块为基准同步解析说明符，返回绝对 URL 字符串，注意只解析不加载。20.6 和 18.19 起稳定且同步。

import.meta.main 判断自己是不是入口模块，替代 CJS 的 require.main 等于 module 惯用法，24.2 起提供。
-->

---

# 浏览器：script type="module"

<v-clicks>

- **默认 defer**：并行下载、文档解析完按序执行——写 defer 是冗余
- **自动严格模式** + 模块作用域：顶层声明不挂 window
- 同一 URL **只执行一次**（按解析后 URL 缓存）
- **CORS / 同源约束**：`file://` 直开被拦 → 起本地服务器
- MIME 看 `text/javascript`，不看扩展名
- 老浏览器回退：`<script nomodule>` 双发

</v-clicks>

<!--
浏览器侧，script type module 和普通 script 的行为差异。

第一条最常考：模块脚本默认就是 defer——并行下载不阻塞 HTML 解析，文档解析完按出现顺序执行，手写 defer 属性是冗余。想下载完立即执行可以显式加 async。

第二，自动严格模式，关不掉；模块作用域让顶层声明不挂 window，跨脚本共享必须显式导出导入。第三，同一 URL 的模块全页面只执行一次，天然单例。

第四，新手必踩：模块加载受 CORS 和同源策略约束，双击 HTML 用 file 协议直接打开会被拦，必须起本地服务器。跨域 CDN 的模块需要正确的 CORS 响应头。第五，浏览器认 MIME 类型 text/javascript，不看扩展名。

最后，老浏览器回退用 nomodule 双发：新浏览器忽略 nomodule 脚本，老浏览器只执行它，互不重复。
-->

---

# import maps：浏览器解析裸说明符

```html
<script type="importmap">
{
  "imports": { "vue": "https://cdn.../vue.esm-browser.js" },
  "scopes": { "/legacy/": { "vue": "https://cdn.../vue@2.js" } }
}
</script>
```

<v-clicks>

- 浏览器原生不认 `import "vue"` → import map 把裸名映射到 URL
- **scopes**：按引用方路径分区映射，同页共存两个版本
- 支持度：Chrome/Edge 89+、FF 108+、Safari 16.4+ ≈ **94.5%**
- 老浏览器回退：**es-module-shims**；必须在**首个模块解析前**就位

</v-clicks>

<!--
浏览器原生不认识裸说明符——import vue 直接报错，因为浏览器只认 URL。import maps 补上这块：一段 type 等于 importmap 的 script，JSON 的 imports 字段把裸名映射到实际 URL。从此浏览器里也能像 Node 一样写包名导入，免打包直跑成为现实。

scopes 是进阶玩法：按引用方的路径前缀分区映射，比如 legacy 目录下的模块拿到 Vue 2、其他地方拿到 Vue 3，同页共存两个版本，渐进迁移利器。

支持度 2026 年已经不是问题：Chrome 和 Edge 89 起、Firefox 108 起、Safari 16.4 起，2023 年 3 月三引擎齐全，caniuse 全球约 94.5%。更老的浏览器用 es-module-shims 这个生产级 polyfill 兜底。

一条使用纪律：import map 必须在首个模块解析之前就位，稳妥做法是单份置于 head 顶部。特性检测用 HTMLScriptElement.supports importmap。
-->

---

# modulepreload 与 import attributes

**modulepreload**：下载 + **解析编译入模块图**（preload 只缓存字节）

```html
<link rel="modulepreload" href="app.js" />
```

**import attributes**（ES2025）：JSON 模块强制带 type

```js
import pkg from "./package.json" with { type: "json" };
```

<div v-click class="mt-3">

> 演进：`assert`（旧）→ `with`；Node **22.0 移除 assert**、22.12/23.1 稳定

</div>

<!--
两个浏览器侧与标准侧的补充特性。

modulepreload 是模块版预加载：除了提前下载，浏览器还会提前解析、编译，把模块放进模块图，后续 import 命中即用；请求还按模块的 CORS 凭据模式发出，避免普通 preload 因凭据模式不匹配下载两遍的坑。给关键依赖链的每个模块都写一条效果最好。

import attributes，with 大括号 type json 这个语法，ES2025 正式入标准。导入 JSON 模块必须带它——Node 对 JSON 强制要求，内容挂在 default 导出上。

注意演进史，面试高频：早期提案用 assert 关键字，TC39 后来改成 with；Node 16.14 实验支持 assert，18.20、20.10、21 切到 with，22.0 直接移除 assert，22.12 和 23.1 起 attributes 去掉实验标记。一句话：assert 已死，with 转正，新代码只写 with。
-->

---

# Node ESM：规则比你想的严

| 规则 | 内容 |
|---|---|
| 启用 | `"type": "module"`（管 .js）或 `.mjs`（无条件） |
| **扩展名** | `./util` ✗ → `./util.js` ✓，**不补全** |
| 目录索引 | `./dir` ✗ → `./dir/index.js` ✓，**不找 index** |
| 作用域 | 无 `require` / `__dirname` / `module` |
| 历史 | v8.5 实验 → **12.22/14.17/15.3 稳定** |

<!--
Node 侧的 ESM 规则，比打包器环境严格得多。

启用方式两条主路：最近的 package.json 写 type module，包内 .js 全按 ESM 解析；或者直接 .mjs 扩展名，无条件 ESM。反向是 type commonjs 和 .cjs。

最大的坑：相对导入必须写全扩展名。import ./util 不带 .js 直接 ERR_MODULE_NOT_FOUND——Node ESM 不做扩展名补全，也不找目录的 index 文件，./dir 必须写成 ./dir/index.js。这是有意和浏览器行为对齐。平时 Vite、webpack 帮你补全惯了，纯 Node 一跑就炸，是头号报错来源。

ESM 作用域里没有 require、__dirname、__filename、module 这些 CJS 包装参数，替代品就是上一页的 import.meta 全家。

历史线了解一下：8.5 实验起步挂 experimental-modules flag，12.22、14.17、15.3 正式稳定，跨了快四年。
-->

---

# 从 ESM 消费 CJS

```js
import pkg from "cjs-pkg";     // default = module.exports
import { readFile } from "node:fs"; // 命名导入也行？
import * as ns from "cjs-pkg"; // namespace 容器
```

<v-clicks>

- 官方规则：**default 就是 module.exports 整体**
- 命名导入靠 **cjs-module-lexer** 静态分析源码「猜」导出
- 限制：**动态生成的导出猜不到** → 回退 default 再解构
- 要同步 require？`createRequire(import.meta.url)` 逃生舱

</v-clicks>

<!--
互操作第一方向：ESM 导入 CommonJS，Node 完整支持。

官方规则一句话：default 导出等于 module.exports 整体。import pkg 拿到的就是那个 exports 对象。

更妙的是命名导入往往也能用——import 大括号 readFile from node:fs 这种。背后功臣是 Node 内置的 cjs-module-lexer：加载 CJS 时对源码做静态词法分析，识别 exports.foo 等于、module.exports 等于对象字面量这些常见赋值模式，把猜出来的名字提升为命名导出。

但它是纯静态启发式：运行时动态挂的导出——循环里赋值、条件赋值、Object.assign 构造的——统统识别不到，命名导入直接失败。这时回退方案永远可靠：import default 再解构。v23 起 namespace 上还多了个字符串键 module.exports，精确指向完整导出。

在 ESM 里确实需要同步 require 的场景，官方逃生舱是 module 模块的 createRequire，传 import.meta.url 现造一个。
-->

---

# require(esm)：改变格局的版本线

| 节点 | 版本 |
|---|---|
| 引入（flag） | 22.0 / 20.17 |
| **默认启用** | 23.0 / **22.12 / 20.19** |
| **正式稳定** | **25.4** |

<v-clicks>

- 约束：模块图**全同步**——含 TLA 抛 `ERR_REQUIRE_ASYNC_MODULE`
- 返回 namespace（有 default 时带 `__esModule: true`）
- 定制返回本体：`export { Point as "module.exports" }`

</v-clicks>

<!--
反方向：CommonJS 里 require 一个 ES Module——这件事十年里从不可能变成了日常。

版本线背下来：22.0 和 20.17 经 experimental-require-module flag 引入；23.0、22.12、20.19 起默认启用；23.5 起不再打实验警告；25.4 正式转稳定。关键推论：Node 18 在 2025 年 4 月 EOL 之后，所有在维的 LTS 都默认支持 require(esm)。

约束只有一条但很硬：被 require 的 ESM 模块图必须完全同步——自身和所有依赖都不能有 top-level await，否则抛 ERR_REQUIRE_ASYNC_MODULE，因为 require 必须同步返回。含 TLA 的模块只剩动态 import() 一条路。

返回值是模块命名空间对象，有 default 导出时附带 __esModule true 标记，兼容转译器产物的消费习惯。想让 require 方直接拿到导出本体而不是 namespace，用字符串导出名协议：export Point as 引号 module.exports 引号，require 直接得到 Point 类本身。
-->

---

# 发布侧：exports 字段

```jsonc
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",  // ① 必须最前
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "default": "./dist/index.js"   // ② 必须殿后
    },
    "./internal/*": null             // null 封禁私有
  }
}
```

> **键顺序即匹配顺序**；exports 一旦定义即**封装**且**优先于 main**

<!--
发布侧主战场：package.json 的 exports 字段。

它和老的 main 字段有本质差别：main 只定义一个入口，包里所有文件裸奔可达；exports 一旦定义就是黑盒封装——只有显式列出的子路径对外可达，其他文件一律 ERR_PACKAGE_PATH_NOT_EXPORTED。而且在支持它的环境里 exports 优先级高于 main，main 只是喂老工具的兼容字段。

条件导出按对象键的书写顺序匹配，先到先得，所以顺序是铁律：types 必须放最前，否则 TypeScript 可能先命中 import 或 require，拿不到类型；default 无条件命中，必须殿后，放前面会吞掉后面所有条件。「types 最前、default 殿后」当口诀背。

子路径通配 star 是字符串替换不是 glob，可以跨目录层级；null 目标显式封禁私有目录，配合通配实现批量开放加精确挖洞。target 路径必须 ./ 开头、禁止 .. 逃逸。手写 exports 和产物不一致是发布事故第一来源，能让构建工具自动生成就别手写。
-->

---

# dual hazard 与 ESM-only 趋势

**dual package hazard**：CJS/ESM 双产物被加载成**两个实例** → 单例失效、`instanceof` 跨界失败

<v-clicks>

- 缓解：isolate state / 一种格式薄包装另一种
- 釜底抽薪：**ESM-only**——require(esm) 已让 CJS 用户直接消费
- 2026 数据：top1000 **~42% ESM-only**、新包 **~80% ESM-first**
- 质检进 CI：**publint**（包结构）+ **attw**（类型解析）

</v-clicks>

<!--
双格式发布的固有税：dual package hazard。应用依赖树里一半代码 require 到 CJS 产物、一半 import 到 ESM 产物，同一个包在内存里两份实例——两套模块状态、两套 class 标识，单例失效、instanceof 跨界失败、配置设置了又丢。Node 官方两条缓解：隔离状态，或者让一种格式只做另一种的薄包装。

但 2026 年更彻底的答案是别发两份：require(esm) 在所有在维 LTS 默认可用之后，ESM-only 的包只要不含 top-level await，CJS 用户直接 require 就能用——dual 发布为了 CJS 用户这个核心理由消失了。

生态数据同向：npm top1000 大约 42% 已经 ESM-only，新发布的包约八成 ESM-first，Vite 这类基础设施带头 ESM-only。还需要 dual 的场景收窄为必须支持 Node 20.19 以前的老运行时。

不管发哪种，质检进 CI：publint 查包结构——exports 指的文件存在吗、声明格式和实际一致吗；attw 查类型——模拟 TS 各解析模式验证类型可达、专抓 CJS 类型冒充 ESM。两道闸互补。
-->

---
layout: intro
---

# 总结

ESM = **静态结构 + live bindings 的语言标准模块系统**

- 语法：named/default/namespace/重导出；顶层 + 字面量换来 tree-shaking
- 语义：live binding 实时只读；提升 + TDZ 让循环依赖错误早而明确
- 浏览器：默认 defer / CORS；import maps ~94.5% + es-module-shims
- Node：扩展名必须写全；import.meta 替代 __dirname；JSON 用 with
- 2026 发布侧：exports 封装、types 最前 default 殿后；require(esm) 转正（25.4）→ **新库默认 ESM-only**

<!--
总结五句话带走。

语法层：命名、默认、命名空间、重导出全家桶，静态 import 顶层加字面量两条约束，换来 tree-shaking 和整套静态分析红利。

语义层：导入是实时只读绑定，区别于 CommonJS 值拷贝；import 提升加 TDZ 让循环依赖里函数互调可行、过早取值报错早而明确。

浏览器侧：type module 默认 defer、受 CORS 约束；import maps 三引擎全支持约 94.5%，老浏览器 es-module-shims 兜底。

Node 侧：相对导入必须写全扩展名；没有 __dirname，用 import.meta.dirname；JSON 导入强制 with type json。

发布侧 2026：exports 字段做封装，types 最前 default 殿后；require(esm) 25.4 转正、在维 LTS 全默认支持——新库默认 ESM-only，publint 加 attw 进 CI 把关。

模块这件事的另一半——require 的解析、缓存、循环依赖细节——在 CommonJS 那一场见。谢谢大家。
-->
