---
theme: seriph
background: https://cover.sli.dev
title: es-toolkit — Modern Lodash Alternative
info: |
  Presentation es-toolkit — a modern JavaScript utility library, a high-performance alternative to Lodash.

  Learn more at [https://es-toolkit.dev](https://es-toolkit.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🧰</span>
</div>

<br/>

## es-toolkit

Lodash 的现代替代：体积最多小约 97%、运行时快约 2~3 倍、TS-first、零依赖。主包是现代核心集，`es-toolkit/compat` 提供 lodash 1:1 兼容

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/toss/es-toolkit" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 es-toolkit，2024 年崛起的现代 JavaScript 工具函数库，由韩国金融科技公司 Toss 开源，定位是 Lodash 的高性能、更小体积替代。

三个核心数字：相比 lodash 体积最多小约 97%、运行时快约 2 到 3 倍，而且 TS-first、内置类型、零依赖。它已经被 Storybook、MUI、Recharts 这些成熟项目用于生产。

最关键的一条心智，会贯穿全场：主包 es-toolkit 是现代核心函数集，es-toolkit/compat 是 lodash 的 1 比 1 兼容层。把这条记牢，后面就顺了。

主线：为什么需要 → 体积性能数字 → 安装导入 → 主包 vs compat → 常用函数 → 可变性 → 现代异步 → AbortSignal → 迁移 → 选型 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么需要它

<v-clicks>

- lodash 体积大：单函数引入也偏重
- 链式、隐式转换等历史包袱
- 不内置类型，要装 `@types/lodash`
- 老实现，未用上现代 JS 原生能力

</v-clicks>

<div v-click class="mt-6">

es-toolkit 的回应：

- 现代原生实现 → **更小更快**
- TS 编写、内置类型 → **类型守卫**
- 主包精简 + `compat` 兼容 → **平滑迁移**

</div>

<!--
为什么要换工具库？lodash 的几个老问题。

第一，体积偏大，即便用 lodash-es 按需引入，单个函数也背着不少共享内部代码。第二，链式调用、隐式类型转换这些历史包袱，不利摇树也容易踩坑。第三，不内置类型，要额外装 @types/lodash，类型由社区维护。第四，它是多年前的实现，没用上现代 JS 的原生能力。

es-toolkit 针对性回应：用现代原生 API 重写，做到更小更快；用 TypeScript 编写、内置类型，很多判断函数还是类型守卫；主包保持精简，同时用 compat 兼容层让现有 lodash 项目平滑迁移。这就是它的设计取舍。
-->

---

# 两个核心数字

```bash
npm install es-toolkit   # 零依赖，自带 TS 类型，无需 @types
```

<v-clicks>

- **体积**：相比 lodash 最多小约 **97%**
- **性能**：运行时快约 **2~3 倍**（平均约 2×）
- 单函数极小：`difference` 90B、`sample` 94B、`pick` 132B
- 现代原生实现 + `sideEffects:false` → 摇树彻底

</v-clicks>

<!--
es-toolkit 的卖点就是两个数字。

体积，相比 lodash 最多小约 97%。性能，运行时快约 2 到 3 倍，官方总括平均约 2 倍。

体积小到什么程度？官方用 esbuild 测打包字节，difference 只有 90 字节、sample 94 字节、pick 132 字节，很多函数不到 100 字节。

为什么能这么小？根本原因是用现代原生 JS API 重写实现，抛弃了 lodash 为兼容老旧环境背负的大量内部工具和防御代码。再加上 package.json 标了 sideEffects false，打包器能把没用到的函数彻底摇掉。注意 install 这条：零依赖、自带类型，不需要也没有 @types/es-toolkit。
-->

---

# 体积对比（官方数字）

| 函数 | es-toolkit | lodash-es | 缩减 |
|---|---:|---:|---:|
| `sample` | 94 B | 4,817 B | -98.0% |
| `difference` | 90 B | 7,958 B | -98.9% |
| `pick` | 132 B | 9,520 B | -98.6% |
| `zip` | 221 B | 3,961 B | -94.4% |
| `debounce` | 531 B | 2,873 B | -81.5% |

<div class="mt-2 text-sm">

> esbuild 测打包字节；对比 **lodash-es**（ESM 版）才同口径——只有 ESM 能摇树。

</div>

<!--
体积对比看官方一手数据。

sample：es-toolkit 94 字节，lodash-es 4817 字节，缩减 98%。difference：90 对 7958，缩减将近 99%。pick：132 对 9520。zip、debounce 也都大幅缩减。

注意对比对象是 lodash-es，也就是 lodash 的 ESM 版本，不是 CommonJS 的 lodash。为什么？因为只有 ESM 才能被打包器摇树，拿摇树友好的 lodash-es 来比单函数引入体积，才是同口径，而且对 lodash 最有利。即便这样，es-toolkit 仍然小得多。测量工具是 esbuild。
-->

---

# 性能对比（官方数字）

| 函数 | 提速 | | 函数 | 提速 |
|---|---:|---|---|---:|
| `omit` | **11.8×** | | `intersection` | 2.15× |
| `pick` | 3.43× | | `unionBy` | 1.69× |
| `differenceWith` | 2.17× | | `union` | 1.06× |
| `difference` | 2.02× | | `groupBy` | 0.96× |

<div v-click class="mt-3 text-sm">

> 「平均约 2×」是**总体概括**，逐函数差异极大——性能敏感处看具体函数。

</div>

<!--
性能对比，在 M1 Max 上测，数值是单位时间执行次数，越高越快，这里直接给提速倍数。

提速最夸张的是 omit，约 11.8 倍，它用更直接的逻辑替代了 lodash 的通用路径。pick 约 3.43 倍，difference 系列约 2 倍，intersection 约 2 倍。

但要注意右下角：union 只有 1.06 倍，groupBy 甚至 0.96 倍，接近持平甚至略低。所以官方说的「平均约 2 倍」是个总体概括，不代表每个函数都恰好快 2 倍。实务上如果你有性能热点，应该针对那个具体函数看基准，而不是套用「一律 2 倍」。
-->

---
layout: two-cols-header
---

# 安装与导入

::left::

**安装**

```bash
npm install es-toolkit
# Deno（JSR）
deno add jsr:@es-toolkit/es-toolkit
```

::right::

**导入（推荐具名）**

```ts
import { sum, chunk } from 'es-toolkit'
// 分类子路径
import { debounce } from 'es-toolkit/function'
```

<div class="mt-2 text-sm">

> 自带类型、零依赖、ESM + CommonJS 双格式；子路径：array / object / function / math / string / predicate / promise / util。

</div>

<!--
安装与导入。

Node 用 npm install es-toolkit，pnpm、yarn、bun 同理。Deno 走 JSR，deno add jsr 冒号 @es-toolkit/es-toolkit，导入时用带 scope 的名字。

导入推荐具名导入，比如 import 大括号 sum、chunk from es-toolkit，配合摇树只把用到的函数打进产物。也能从分类子路径导入，比如 from es-toolkit 斜杠 function，利于代码组织。

三个要点：自带 TypeScript 类型不用装 @types；零运行时依赖；同时提供 ESM 和 CommonJS 双格式，能跑在 Node 18 以上、Deno、Bun、浏览器。子路径有 array、object、function、math、string、predicate、promise、util 等。
-->

---

# 主包 vs compat（最重要）

| 维度 | `es-toolkit` 主包 | `es-toolkit/compat` |
|---|---|---|
| 定位 | 现代核心集 | Lodash 1:1 兼容 |
| API | 类型安全、简洁 | 隐式转换、深路径、链式 |
| 体积/速度 | 最小、最快 | 略大、略慢（仍优于 lodash） |
| 适用 | **新项目** | **迁移既有 lodash** |

<div v-click class="mt-3 text-sm">

> 官方：项目没有 lodash 历史就**直接用主包**；compat 只为迁移而生。

</div>

<!--
这一页是全场最重要的认知：主包和兼容层的分工。

主包 es-toolkit，定位是现代核心函数集，API 类型安全、签名简洁，体积最小、速度最快，适合新项目。

兼容层 es-toolkit 斜杠 compat，定位是和 lodash 1 比 1 兼容，保留了 lodash 的隐式类型转换、深路径取值、链式调用这些行为，体积略大、略慢，但仍然比 lodash 本身更小更快，专门用于迁移已有的 lodash 代码。

官方原话：如果你的项目没有在用 lodash，就直接用 es-toolkit。compat 只为迁移而生，不是给新项目的。
-->

---

# 常用函数：数组与对象

```ts
import { chunk, uniq, groupBy, difference, pick, mapValues } from 'es-toolkit'

chunk([1, 2, 3, 4, 5], 2)        // [[1, 2], [3, 4], [5]]
uniq([1, 2, 2, 3])               // [1, 2, 3]
difference([2, 1], [2, 3])       // [1]（在 A 不在 B）
groupBy(users, u => u.role)      // { admin: [...], user: [...] }
pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])   // { a: 1, c: 3 }
mapValues({ a: 1, b: 2 }, v => v * 10)   // { a: 10, b: 20 }
```

<div v-click class="mt-2 text-sm">

> 主包 `pick`/`omit` 只收**键数组**，点号深路径在 compat。

</div>

<!--
看一组最常用的数组和对象函数。

chunk 按 size 切成二维数组，5 个元素按 2 切成两组加一个余项。uniq 去重并保留顺序。difference 取差集，在 A 不在 B，所以 [2,1] 减 [2,3] 得到 [1]。groupBy 按分类函数把元素聚成对象，每个键对应一个数组。

对象这边，pick 挑选指定的键返回新对象，omit 是反操作剔除。mapValues 对每个值做映射，键不变。

一个易踩的点写在底下：主包的 pick 和 omit 只接收键数组，不支持点号深路径，比如 a 点 b 点 c。深路径是 compat 兼容层才有的 lodash 能力。
-->

---

# 可变 vs 不可变：要分辨

<v-clicks>

- 部分函数会**原地修改入参**：`merge`、`pull`、`remove`、`fill`
- 不可变场景（React/Redux）会因此出错

</v-clicks>

<div v-click>

```ts
import { merge, toMerged } from 'es-toolkit'

merge(state, patch)            // ❌ 原地改了 state
const next = toMerged(state, patch)  // ✅ 返回新对象，state 不变
```

</div>

<!--
一个工程上必须分辨的点：可变还是不可变。

es-toolkit 有一部分函数会原地修改入参，典型是 merge 深合并、pull 和 remove 删元素、fill 填充。这些函数在 React、Redux 这类强调不可变更新的场景里直接用会出错，因为你悄悄改了原对象。

看代码：merge state 逗号 patch，会原地改掉 state，这在 Redux 里是错的。正确做法是用 toMerged，它不碰入参、返回一个全新的合并结果，state 保持不变。

记住这组对应关系：要不可变，merge 换 toMerged，删元素的 pull、remove 换成返回新数组的 difference、without，或者先 cloneDeep 再改。这个陷阱和 lodash 同源，迁移时尤其要注意。
-->

---

# 现代异步原语（lodash 没有）

```ts
import { timeout, Semaphore } from 'es-toolkit/promise'
import { attempt } from 'es-toolkit/util'

// 超时：ms 后抛 TimeoutError
await Promise.race([fetch(url), timeout(5000)])

// 信号量：限制并发数（最多 3 个）
const sem = new Semaphore(3)

// attempt：以 [error, value] 元组安全执行，免 try/catch
const [err, value] = attempt(() => JSON.parse(input))
```

<!--
es-toolkit 还提供了一批 lodash 没有的、面向现代异步编程的工具。

第一，timeout。它返回一个在指定毫秒后抛出 TimeoutError 的 Promise，常配合 Promise.race 给异步操作设时限，比如给 fetch 设 5 秒上限。还有 withTimeout 直接包裹一个 Promise。

第二，并发原语 Semaphore 信号量，限制同时进行的异步任务数量，比如 new Semaphore 3 表示最多 3 个并发，其余排队，常用来限制并发请求。Mutex 互斥锁是容量 1 的特例。

第三，attempt，以 error、value 元组的形式安全执行函数，把错误处理从 try catch 包裹变成解构返回值，代码更线性。异步版是 attemptAsync。这些都是 lodash 时代没有的现代能力。
-->

---

# AbortSignal 集成

```ts
import { debounce } from 'es-toolkit'

const controller = new AbortController()
const onInput = debounce(q => search(q), 300, {
  edges: ['leading'],        // 主包用 edges 控制开头/结尾
  signal: controller.signal, // 支持 AbortSignal
})

controller.abort()           // 一键取消 pending；另有 cancel()/flush()
```

<div v-click class="mt-2 text-sm">

> compat 为对齐 lodash 用 `{ leading, trailing, maxWait }`，二者可换算。

</div>

<!--
主包的 debounce 和 throttle 还有一个现代化能力：AbortSignal 集成，lodash 没有。

看代码：debounce 第三个参数里，主包用 edges 选项控制在时间窗的开头还是结尾执行，比如 edges 数组里放 leading 就是只在开头执行。同时可以传 signal，也就是 AbortController 的 signal。

当你调用 controller.abort 时，pending 的执行会被取消。这在组件卸载、路由切换时特别有用，一行 abort 就清干净。返回的函数本身也带 cancel 和 flush 方法。

对照一下 compat：兼容层为了对齐 lodash，用的是 leading、trailing、maxWait 这套选项。两者语义可以换算，但 API 名字不同，迁移时注意。
-->

---

# 从 lodash 迁移：三步法

```ts
// ① 改路径：行为 1:1，几乎零风险
import { chunk, debounce, get } from 'es-toolkit/compat'

// ② 逐模块清理 lodash 式写法

// ③ 不依赖怪癖的调用切到主包
import { chunk, debounce } from 'es-toolkit'
```

<v-clicks>

- compat 自 **v1.39.3** 起 100% 兼容，过 lodash 测试套件
- 先 compat 保功能，再渐进切主包 → 最稳

</v-clicks>

<!--
怎么从 lodash 迁过来？官方推荐三步法，渐进式，不要一次性改写。

第一步，把所有 import 路径从 lodash 或 lodash-es 整体改成 es-toolkit 斜杠 compat。因为 compat 和 lodash 行为 1 比 1，这一步几乎零风险，改完功能不变，先吃到体积和性能红利。注意 get 这种深路径取值函数也在 compat 里。

第二步，随时间逐模块清理调用点，去掉对 lodash 怪癖的依赖，比如隐式类型转换。

第三步，把不依赖怪癖的调用切到主包 es-toolkit，拿到最优体积和性能。

底下两点：compat 自 v1.39.3 起做到 100% 兼容，能通过 lodash 自己的测试套件。所以先 compat 保功能、再渐进切主包，是大项目最稳的路径。为什么不直接全切主包？因为主包签名更严格，一次性切风险高。
-->

---

# compat 的边界：哪些不支持

<v-clicks>

- **隐式类型转换**（如空字符串当 0）
- **修改原型**、特化数组实现
- **realm 管理**：`runInContext`、`noConflict`
- **隐式链式**（提供了显式 `_(x).f().value()`）
- 个别函数：`sortedUniq`、`sortedUniqBy`、`mixin`

</v-clicks>

<div v-click class="mt-3 text-sm">

> 切主包前逐点核对：`get`→可选链、深路径→解构、链式→函数组合。

</div>

<!--
即便是 compat 兼容层，也有一批 lodash 历史包袱明确不支持，要知道边界。

第一，隐式类型转换，比如 lodash 某些函数会把空字符串当成 0，compat 不做。第二，修改 JS 原型的行为、特化的数组实现。第三，JavaScript realm 管理，也就是 runInContext、noConflict 这类。第四，隐式的链式调用，不过 compat 提供了显式的兼容写法，下划线括号 x 点 f 点 value。还有个别函数直接不支持，比如 sortedUniq、sortedUniqBy、mixin。

实务含义在底下：从 compat 切到主包前，逐点核对是否依赖了被舍弃的行为。get 改成原生可选链，深路径 pick 改成嵌套解构，链式改成函数组合或原生数组方法。核对通过就能切，切完那处就吃到主包的最小体积和最快性能。
-->

---

# 选型决策

<v-clicks>

- 新项目 / 无 lodash 包袱 → **主包 `es-toolkit`**
- 迁移既有 lodash → 先 **`es-toolkit/compat`** 再渐进切主包
- 需要深路径 `get/set`、链式、隐式转换 → **`compat`**
- 追求最小体积 / 最快性能 / 最好类型 → **主包**

</v-clicks>

<div v-click class="mt-4 text-sm">

> 一句话：能用主包就用主包，compat 是迁移的桥而非终点。

</div>

<!--
把选型决策收成几条。

新项目，或者没有 lodash 历史包袱的项目，直接用主包 es-toolkit。

要迁移既有的 lodash 代码，先整体换成 es-toolkit 斜杠 compat 保证行为不变，再逐步切主包。

如果代码确实依赖 lodash 的深路径 get、set，或者链式、隐式类型转换，那就用 compat。

如果你追求最小体积、最快性能、最好的类型安全，用主包。

一句话总结：能用主包就用主包，compat 是迁移过程中的桥，不是终点。迁移的目标是最终尽量都落到主包上。
-->

---
layout: intro
---

# 总结

es-toolkit = **lodash 的现代替代，更小更快、TS-first**

- 数字：体积最多小约 97%、运行时快约 2~3 倍、零依赖
- 主包 vs compat：现代核心集 vs lodash 1:1 兼容
- 现代设计：原生实现 + 摇树 + 类型守卫 + AbortSignal
- 异步扩展：`Mutex`/`Semaphore`/`timeout`/`attempt`
- 迁移：`lodash` → `compat`（零风险）→ 主包（最优）
- 边界：主包不是 lodash 全集；可变函数（`merge`）要分辨

<!--
总结一下今天的内容。

es-toolkit 的本质是 lodash 的现代替代，更小、更快、TS-first。

技术要点：核心数字是体积最多小约 97%、运行时快约 2 到 3 倍、零依赖。最重要的认知是主包和 compat 的分工，主包是现代核心集，compat 是 lodash 1 比 1 兼容。现代设计体现在原生实现、摇树友好、判断函数是类型守卫、debounce 支持 AbortSignal。它还扩展了 lodash 没有的异步原语，Mutex、Semaphore、timeout、attempt。

迁移路径是三步：lodash 先换 compat 零风险，再渐进切主包拿最优。

最后两条边界要记牢：主包不是 lodash 的全集，需要链式、深路径 get 这些得用 compat；还有 merge、pull 这类会原地改入参的函数，不可变场景要换成 toMerged。谢谢大家。
-->
