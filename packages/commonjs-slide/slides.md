---
theme: seriph
background: https://cover.sli.dev
title: Welcome to CommonJS
info: |
  Presentation CommonJS — Node.js 的默认模块系统.

  Learn more at [https://nodejs.org/api/modules.html](https://nodejs.org/api/modules.html)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📦</span>
</div>

<br/>

## CommonJS — Node.js 的默认模块系统

2009 年社区规范，require / module.exports 同步加载。2026 年增量退潮、存量庞大，require(esm) 转正让 CJS 与 ESM 真正打通

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/nodejs/node" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 CommonJS。它是 2009 年起源于服务端 JS 社区的模块规范，最初叫 ServerJS，Node.js 实现了它的变体，并且至今仍是 Node 的默认模块系统：一个 .js 文件不做任何声明，就按 CJS 解析执行。

2026 年它的处境一句话：增量在退潮——npm top 1000 包里纯 CJS 只剩两成左右；但存量庞大——默认地位还在，海量遗产项目和打包产物还在用。更重要的转折是 require(esm) 在 Node 22.12 默认开启、25.4 转正稳定，CJS 项目从此能直接消费 ESM 依赖。

顺序：前史 → 第一个模块 → 包装函数 → exports 别名坑 → 解析算法 → node_modules 查找 → 缓存 → 循环依赖 → 模块判定 → require(esm) 三连 → 2026 处境 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 模块化前史

浏览器靠 script 顺序共享全局，互相覆盖：

<v-clicks>

- **IIFE**：函数作用域隔离变量，但无依赖声明与加载机制
- **CommonJS（2009）**：服务端完整方案，require 同步加载
- **AMD**：define 异步声明依赖，适配浏览器网络环境
- **UMD**：AMD + CJS + 全局变量三合一兼容包装

</v-clicks>

<div v-click class="mt-6">

> Node 选择 CJS 变体；语言标准答案是 ESM（另一叶的故事）

</div>

<!--
先一笔带过前史。早期浏览器 JS 靠 script 标签顺序共享全局变量，谁覆盖谁全凭运气。

第一步演化是 IIFE，立即执行函数，用函数作用域把变量包起来，解决全局污染。但它只是语言技巧，没有依赖声明、没有加载机制，加载顺序还是人肉维护。

2009 年服务端社区给出完整方案 CommonJS：require 同步加载、module.exports 导出。Node 采用了它的变体。但同步加载不适合浏览器的网络环境，于是有了 AMD，用 define 异步声明依赖，代表实现 RequireJS；UMD 则是一段环境检测包装，让同一份代码既能当 AMD、又能当 CJS、还能退化成全局变量。

最终语言层的官方答案是 2015 年进标准的 ES Module，那是另一叶的内容，今天聚焦 CJS。
-->

---
layout: two-cols-header
---

# 第一个模块

::left::

**导出：circle.js**

```js
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

// 整体替换导出一个类/函数：
module.exports = class Square {
  /* ... */
};
```

::right::

**导入：main.js**

```js
const circle = require("./circle.js");

console.log(circle.area(4));
```

<div class="mt-4 text-sm">

- `require` **同步**返回对方的 `module.exports`
- 原生支持 `require('./config.json')`

</div>

<!--
CJS 的基本配对。导出方两种姿势：往 exports 上追加属性，比如 exports.area；或者整体替换 module.exports，比如直接导出一个类，这样对方 require 拿到的就是类本身。

导入方一行：require 同步加载，立刻返回对方的 module.exports，即取即用，没有任何异步仪式感。

两个顺手的便利：require 原生支持 JSON 文件，直接拿到解析后的对象，不用手写 readFile 加 JSON.parse；还有 __dirname、__filename 这些路径变量随手可用，下一页讲它们从哪来。
-->

---

# 模块包装函数

Node 执行模块前，把代码包进函数：

```js
(function (exports, require, module, __filename, __dirname) {
  // 你的模块代码实际活在这里
});
```

<v-clicks>

- 顶层 `var`/`let`/`const` 是**函数局部变量** → 不污染 global
- 五个「模块级全局」其实是**参数**，各模块互不相同
- 注意：隔离靠函数作用域，CJS 默认**非严格模式**（ESM 相反）

</v-clicks>

<!--
CJS 一切机制的起点：模块包装函数。Node 执行每个 CJS 模块前，把源码包进这个五参数函数再求值，参数顺序是 exports、require、module、__filename、__dirname，面试常考。

这层包装解释了两件理所当然的事。第一，模块顶层变量为什么不污染全局——因为它们都是这个包装函数的局部变量，函数作用域天然封闭。第二，exports、require 这五个看似全局的标识符从哪来——它们只是参数，所以每个模块拿到的都是自己的那一套。

一个容易答错的细节：隔离靠的是函数作用域，不是严格模式。CJS 模块默认运行在非严格模式下，这点和默认严格的 ESM 正好相反。
-->

---

# exports 只是别名（必考）

```js
exports.a = 1;        // ✅ 等价 module.exports.a = 1
exports = { a: 2 };   // ❌ 局部变量改指向，导不出去
module.exports = fn;  // ✅ 整体替换的唯一通道
```

<v-clicks>

- `require` 返回的**永远是 `module.exports`**
- `exports` 初始与它同指，**重新赋值即失联**
- 赋值必须**同步完成**——回调里赋 `module.exports` 已经晚了

</v-clicks>

<!--
CJS 最经典的坑。包装函数调用时，exports 参数传入的就是 module.exports 的初始值，一个空对象，所以两个名字起初指向同一对象。

往 exports 上追加属性没问题，等价于改 module.exports。但一旦写 exports 等于某个新对象，只是让这个局部变量改了指向，module.exports 纹丝不动——而 require 返回的永远是 module.exports，所以什么都没导出去。题目里给一行 exports 等于花括号 hello true，问 require 拿到什么？答案是空对象。

两条纪律：整体替换一律写 module.exports 等于；并且赋值必须同步完成，官方明确说不能放在回调里，setTimeout 里再赋值，require 方早就拿走旧对象了。
-->

---

# require 解析：四类说明符

| 形态 | 策略 |
|---|---|
| `node:fs` / `fs` | 核心模块，直接返回 |
| `/` 开头 | 绝对路径 |
| `./` `../` 开头 | **相对当前模块文件**（非 cwd） |
| 裸名 `lodash` | node_modules 逐级向上 |

<div v-click class="mt-3 text-sm">

> 扩展名补全只试 **`.js` → `.json` → `.node`**，命中即停；**`.cjs` 不补全必须写全名**。目录则走 `main` → `index.js/.json/.node`

</div>

<!--
require 的解析按说明符形态分四个分支。核心模块比如 fs、path 优先级最高直接返回；斜杠开头按绝对路径；点斜杠、点点斜杠是相对路径——注意相对的是当前模块文件所在目录，跟 process.cwd 进程工作目录无关，这是高频误解；裸名比如 lodash 走 node_modules 逐级向上查找，下一页展开。

文件加载时的扩展名自动补全只尝试三个：先 .js、再 .json、最后 .node，按序命中第一个就停。注意 .cjs 不在补全列表里，require 点斜杠 mod 找不到 mod.cjs，必须写全名。

如果目标是目录，先读目录里 package.json 的 main 字段，main 缺失或失效就回退 index.js、index.json、index.node。这些宽容是 CJS 独有的，ESM 的 import 不补扩展名也不解析目录。
-->

---

# node_modules：逐级向上

`/home/ry/projects/foo.js` 中 `require('bar')`：

```text
/home/ry/projects/node_modules/bar
/home/ry/node_modules/bar
/home/node_modules/bar
/node_modules/bar
```

<v-clicks>

- 从**当前文件所在目录**逐级向上拼 node_modules，直到根
- 打印 **`module.paths`** 可直接看查找链
- `require.resolve(id)`：只解析不执行；`.paths()` 核心模块返回 null
- 遗留 GLOBAL_FOLDERS 兜底（`$HOME/.node_modules`），勿依赖

</v-clicks>

<!--
裸名说明符的查找链：从当前文件所在目录开始，每一层目录拼上 node_modules 试一次，逐级向上直到文件系统根。例子里 projects 下的 foo.js require bar，依次查 projects、ry、home、最后根目录下的 node_modules。已经叫 node_modules 的路径段会被跳过，不会出现 node_modules 套 node_modules。

想亲眼看这条链，打印 module.paths 数组就行。这条逐级向上的规则正是 npm 嵌套依赖和 monorepo 依赖提升能工作的基础：子包找不到就用父层的。

配套工具 require.resolve：只跑解析算法返回绝对路径，不加载不执行，找不到照样抛 MODULE_NOT_FOUND；require.resolve.paths 返回查找目录数组，对核心模块返回 null。最后还有历史遗留的全局目录兜底，比如 HOME 下的 .node_modules，官方强烈不建议依赖。
-->

---

# 模块缓存 require.cache

```js
require("./logger"); // 顶层 console.log('init') 打印
require("./logger"); // 命中缓存，不再执行

require.cache.fs = { exports: fakeFs };
require("fs");       // → fakeFs（命中缓存键）
require("node:fs");  // → 真模块：node: 前缀绕过缓存
```

<v-clicks>

- 键 = **解析后的绝对文件名**；副作用只跑一次、处处同实例
- 大小写不敏感盘上 `./foo` vs `./FOO` → **两个键、执行两次**
- 删缓存 ≠ 热重载：旧引用不更新、子依赖未清、addon 报错

</v-clicks>

<!--
模块首次加载后，整个 module 对象以解析后的绝对文件名为键进 require.cache；后续 require 命中缓存直接返回 exports，模块代码不再执行。所以顶层副作用只跑一次，依赖图处处拿到同一实例，这是单例语义的基础。

官方有个有趣示例：往 require.cache 写一个键为 fs 的假对象，require fs 会命中它返回假模块；但 require node 冒号 fs 返回真模块——node 前缀加载内置模块时绕过 require.cache，劫持不到。安全敏感代码统一用 node 前缀，可以防缓存投毒。

两个坑：缓存键是字符串，不做大小写归一化，macOS 这类大小写不敏感的盘上，点斜杠 foo 和大写 FOO 是两个键，同一文件执行两次、两份实例。另一个，delete 缓存条目确实能让下次 require 重新加载，但旧引用不会更新、子依赖缓存没清、native addon 重载直接报错——它不是真热重载。
-->

---

# 循环依赖：未完成副本

a.js ⇄ b.js 互相 require，main.js 加载 a：

```text
main starting
a starting
b starting
in b, a.done = false   ← b 拿到 a 的未完成副本
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
```

<div v-click class="mt-3 text-sm">

> 不报错不死锁：B 拿到 A **require(B) 之前已写入的导出**。对策：抽第三模块消环 / 函数体内延迟取用

</div>

<!--
循环依赖是 CJS 的名场面。官方例子：a.js 先把 exports.done 设为 false，然后 require b；b.js 同样先设 false，再反过来 require a，并打印 a.done。

CJS 的策略是不报错也不死锁：b 去 require 还在执行中的 a 时，拿到的是 a 的未完成副本——只包含 a 在调用 require b 之前已经写入的导出。所以 in b 那行打印 a.done 等于 false，因为 a 后面那句 done 等于 true 还没执行到。等控制权回到 a，b 已经执行完，所以 in a 打印 b.done 等于 true。

实际工程里最典型的坑形态：在模块顶层解构 require 的结果，循环中解构到 undefined，错误却在很久之后调用时才爆发。对策按优先级：重构把共享部分抽成第三个模块消环；或者把 require 挪进函数体内延迟取用，等双方都加载完。
-->

---

# 谁说了算：.cjs / type 字段

| 文件 | 判定 |
|---|---|
| `*.cjs` | **恒 CJS**（无视 type） |
| `*.mjs` | 恒 ESM |
| `*.js` + type `commonjs`/缺省 | **CJS（默认地位）** |
| `*.js` + type `module` | ESM |
| `*.js` 无 type + 纯 ESM 语法 | 语法检测按 ESM |

<div v-click class="mt-3 text-sm">

> 扩展名 > type 字段；语法检测 v22.7.0/v20.19.0 起默认开。最佳实践：**显式写 type**

</div>

<!--
模块判定规则一张表。优先级最高的是扩展名显式标记：.cjs 恒为 CJS，哪怕包里写了 type module 也压不过它；.mjs 恒为 ESM。.js 才是随 type 字段浮动的：type 是 commonjs 或者干脆没写，按 CJS——这就是 CJS 在 Node 的默认地位；type 是 module 按 ESM。

唯一的让步是语法检测：type 缺省的模糊 .js 文件，如果只含 ESM 语法，比如顶层 import、export、顶层 await，Node 22.7 和 20.19 起会自动按 ESM 运行，不再抛 Cannot use import statement outside a module。注意纯 CJS 语法的文件不受影响，默认地位还在。

工程最佳实践：别依赖检测，package.json 里显式写 type，哪怕写 commonjs，省检测开销、绝歧义；包内个别文件用 .cjs、.mjs 钉死归属。
-->

---

# require(esm)：转正时间线

| 版本 | 状态 |
|---|---|
| v22.0.0 | 引入，`--experimental-require-module` 旗标 |
| **v22.12.0** | **LTS 默认开启**（解锁标志；v20.19.0 回携） |
| v23.5.0 | 默认不再打实验警告 |
| **v25.4.0** | **标记 Stable** |

<div v-click class="mt-4 text-sm">

> 理论依据（Joyee Cheung）：**ES 规范保证无顶层 await 的模块图可完全同步求值**——「ESM 必然异步」是误解

</div>

<!--
重头戏 require esm：在 CJS 里同步 require 一个 ESM 文件。曾经这么干直接抛 ERR_REQUIRE_ESM，CJS 项目被 ESM-only 依赖逼得要么转译、要么锁版本、要么整体迁移。

时间线四步：22.0 引入，藏在 experimental-require-module 旗标后面；22.12 在 LTS 默认开启——这是用户真正开箱可用的标志性版本，同期 20.19 也拿到回携；23.5 起默认不再打实验警告；25.4 正式标记 Stable，互操作转正。

为什么同步的 require 能加载号称异步的 ESM？核心实现者 Joyee Cheung 阐明的理论依据：ES 规范本身保证，不含顶层 await 的模块图可以完全同步求值。ESM 必然异步是早期叙事固化的误解，异步只存在于源码获取和顶层 await 两处。
-->

---

# require(esm)：返回值映射

```js
// point.mjs: export default class Point {}
const ns = require("./point.mjs");
// → [Module: null prototype]
//   { default: [class Point], __esModule: true }
```

<v-clicks>

- 返回**模块命名空间**：default 在 `.default` 上
- 有 default 时自动附 `__esModule: true`（兼容转译代码）
- ESM 侧 `export { Point as "module.exports" }` → require **直接返回本体**；代价：其余命名导出从 require 结果丢失

</v-clicks>

<!--
require esm 拿到什么？模块命名空间对象。注意默认导出不会直接给你类本身，而是挂在 .default 属性上；并且存在 default 导出时，Node 自动附加 __esModule 为 true 的标记，让 Babel、TypeScript 转译出来的消费代码能正确识别。

如果 ESM 作者想让 CJS 用户体验跟传统 module.exports 一致，可以用 ES2022 的字符串导出名写 export Point as 引号 module.exports 引号——这样 require 直接返回 Point 本体，不再是命名空间。代价是其余命名导出从 require 结果上丢失，官方建议把它们挂到这个值上，比如作为类的静态属性；import 方式消费不受影响。

这一页是 CJS 和 ESM 互操作的核心映射，记住三个词：命名空间、.default、__esModule。
-->

---

# 硬限制：TLA 与过渡方案

```js
require("./tla.mjs");
// ❌ ERR_REQUIRE_ASYNC_MODULE（依赖图含顶层 await）

// CJS 里的过渡/兜底：动态 import()
const { default: chalk } = await import("chalk");
```

<v-clicks>

- require 必须同步 → **整图**含 TLA 即抛错；旧错 ERR_REQUIRE_ESM 已弃用
- 管控：`process.features.require_module` / `--trace-require-module` / `--no-require-module`
- import() 代价：**async 传染**；但加载 TLA 模块与旧 Node 仍靠它

</v-clicks>

<!--
require esm 唯一的硬限制：顶层 await。require 必须保持同步，目标模块或它依赖图中任何一环含 TLA，就抛 ERR_REQUIRE_ASYNC_MODULE。注意是整图检查，入口干净、深层依赖有 TLA 也一样抛。顺带说，老朋友 ERR_REQUIRE_ESM 已经弃用退场了。定位 TLA 来源可以用 experimental-print-required-tla 旗标。

工程管控三件套：代码里用 process.features.require_module 做特性检测；trace-require-module 旗标打印每一处 require esm 的使用位置，适合审计；no-require-module 一键禁用回到旧行为。

下面的动态 import 是 require esm 之前的官方过渡方案，在 CJS 里完全合法，返回 Promise。2026 年它还有两个不可替代的场景：加载含 TLA 的 ESM，以及跑在 Node 22.12 以下的存量环境。代价是 async 传染，调用链被迫异步化——require esm 的价值正是消灭这种侵入式改造。
-->

---

# 2026 处境：增量退潮，存量庞大

<v-clicks>

- **增量**：npm top 1000 中 CJS-only 已降至 **约 20%**
- **存量**：2024-09 top 5000 调查：**3000+ CJS**、466 dual、559 ESM-only（仅 **6 个**用 TLA）
- 默认地位仍在：无 type 的 `.js` 依旧按 CJS，Node 从未废弃
- 遗产维护长期存在；打包产物的 `require` 入口仍被广泛消费
- 反直觉效应：require(esm) 越顺滑 → 新库越敢 **ESM-only**

</v-clicks>

<!--
2026 年怎么看 CJS？两组数据放一起读。增量侧：npm top 1000 包里纯 CJS 已经降到两成左右，头部新生态明确转向 ESM 或双发布。存量侧：2024 年 9 月对高影响力 top 5000 包的调查，3000 多个还是 CJS，466 个双发布，559 个 ESM-only——其中只有 6 个用顶层 await，意味着绝大多数 ESM 依赖都能被直接 require。

三个事实决定 CJS 远未退场：默认地位还在，无声明的 .js 仍按 CJS 解析，Node 从未宣布废弃；十几年遗产项目的维护需求长期存在；写 CJS 和发 CJS 是两回事，双格式发布的 require 入口、面向旧宿主的 CJS 产物活得更久。

最后一个反直觉效应，来自 Joyee 的论证：require esm 越顺滑，库作者越没有维持双格式的负担，新库反而越敢直接 ESM-only——互操作的完善在加速而不是阻碍 ESM 迁移。

维护策略一句话：遗产项目优先升 Node 22.12 直接 require；卡旧版本用动态 import 改造调用点；再不行打包器预编译兜底。
-->

---
layout: intro
---

# 总结

CommonJS = **Node 的默认模块系统：同步 require + 包装函数 + 缓存**

- `exports` 只是别名，整体替换认 `module.exports`（同步赋值）
- 解析：四类说明符；补全 `.js→.json→.node`；node_modules 逐级向上
- 缓存键 = 解析路径；循环依赖给「未完成副本」
- require(esm)：22.12 LTS 解锁、25.4 Stable；TLA 抛 ERR_REQUIRE_ASYNC_MODULE
- 2026：top 1000 仅 ~20% CJS-only，但默认地位与存量让它长期在场

<!--
总结。CommonJS 是 Node 的默认模块系统，核心三件套：同步 require、模块包装函数、require.cache 缓存。

机制层记四点：exports 只是 module.exports 的别名，整体替换只认 module.exports 且必须同步赋值；解析按四类说明符分支，扩展名补全只试 js、json、node 三个，裸名走 node_modules 逐级向上；缓存键是解析后的绝对路径，由此衍生大小写双载、多实例这些坑；循环依赖不报错，给未完成副本。

互操作层记一条线：require esm 从 22.0 实验旗标，到 22.12 LTS 默认解锁，再到 25.4 标记 Stable；唯一硬限制是顶层 await，抛 ERR_REQUIRE_ASYNC_MODULE，那种场景用动态 import。

2026 年的定位：增量退潮、存量庞大。top 1000 里纯 CJS 只剩两成，但默认地位、遗产维护和打包产物让它长期在场。新项目直接 ESM 起步，CJS 知识用来读懂依赖、排障和维护产物。谢谢大家。
-->
