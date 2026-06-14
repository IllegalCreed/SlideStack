---
theme: seriph
background: https://cover.sli.dev
title: Lodash-es
info: |
  Presentation Lodash-es — Lodash 的 ESM 形态，可摇树的按需引入工具库。

  Learn more at [https://lodash.com/docs](https://lodash.com/docs)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🛠️</span>
</div>

<br/>

## Lodash-es

Lodash 的 ESM 形态：可摇树（tree-shakable）的按需引入。每个方法是独立 ES module，配合 `sideEffects:false`，用多少打多少。与 lodash 同源同版本（4.18.1）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/lodash/lodash" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天讲 Lodash 的 ESM 形态：lodash-es。它和普通 lodash 同源同版本，当前都是 4.18.1，区别只在模块格式。

lodash-es 的最大价值是可摇树：每个方法是独立的 ES module 文件，package.json 里标了 sideEffects 为 false，于是现代打包器能做 tree-shaking，你 import 哪个方法，产物里就只有那个方法。

主线：为什么用它 → 按需引入与摇树 → 常用方法族 → 变异陷阱 → 防抖节流 → memoize 坑 → flow 与 chain 取舍 → 不可变 → 与原生和 es-toolkit 的取舍 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 lodash-es

<v-clicks>

- 整体导入 `lodash` 是 CJS，无法 tree-shaking
- 复杂工具自己写易出 bug（深合并、深拷贝、防抖）
- 前端 bundle 体积敏感
- 想要可组合的纯函数工具

</v-clicks>

<div v-click class="mt-6">

lodash-es 的回应：

- ESM + `sideEffects:false` → **可摇树**
- 千锤百炼的工具 → **稳**
- 具名导入 → **用多少打多少**
- `flow` 组合 → **可复用**

</div>

<!--
为什么要用 lodash-es 而不是普通 lodash？四个动机。

第一，整体导入普通 lodash 是 CommonJS，主入口不可摇树，会把全部三百个方法打进产物。第二，深合并、深拷贝、防抖节流这类复杂工具自己实现极易出 bug，交给成熟库更稳。第三，前端 bundle 对体积敏感，希望按需引入。第四，希望工具是可组合的纯函数。

lodash-es 的回应：它是 ESM，标了 sideEffects false，可摇树；提供千锤百炼的工具；配合具名导入做到用多少打多少；还能用 flow 组合成可复用的纯函数管道。这四点是今天的主线。
-->

---

# lodash-es 是什么

<v-clicks>

- 官方用 `lodash-cli` 以 `modularize exports="es"` 构建
- `package.json`: `type:module` + `sideEffects:false`
- 每个方法一个独立 `.js`（`node_modules` 下 600+ 文件）
- 与 `lodash` 同 API、同版本（4.18.1），只差模块格式

</v-clicks>

```js
// 入口 lodash.js：逐方法具名再导出
export { default as debounce } from "./debounce.js";
export { default as cloneDeep } from "./cloneDeep.js";
// …数百个
```

<!--
lodash-es 到底是什么？它是 Lodash 官方用 lodash-cli，以 modularize exports 等于 es 的方式构建出来的 ES modules 版本。

它的 package.json 里 type 是 module，并且关键地标了 sideEffects 为 false。每个方法都是一个独立的 js 文件，本地 node_modules 下实测有六百多个文件。入口 lodash.js 把它们逐个具名再导出。

它和普通 lodash 是同一套 API、同一个版本号，当前都是 4.18.1，唯一区别就是模块格式：一个 CJS、一个 ESM。所以两者可以互相平替。
-->

---

# 按需引入：怎么写才摇得动

```js
// ✅ 推荐：具名导入
import { debounce, cloneDeep } from "lodash-es";

// ✅ 子路径直达（更显式）
import cloneDeep from "lodash-es/cloneDeep.js";

// ❌ 整体导入 CJS lodash：全部方法进 bundle
import _ from "lodash";

// ❌ per-method 包：重复内联依赖，v5 将移除
// import debounce from "lodash.debounce"
```

<div v-click class="mt-2 text-sm">

> 摇树三要素：**ESM 格式 + sideEffects:false + 具名导入**，缺一不可。

</div>

<!--
按需引入怎么写才摇得动？

推荐具名导入：import 花括号 debounce、cloneDeep from lodash-es，打包器只保留你用到的方法。也可以走子路径直达，import cloneDeep from lodash-es 斜杠 cloneDeep.js，更显式。

要避免两种写法。第一种是整体导入 CJS 版 lodash，import 下划线 from lodash，这会把全部方法打进 bundle。第二种是 per-method 包，比如 lodash.debounce，这类独立小包会重复内联内部依赖，反而增大体积，官方已经 discouraged，而且 v5 会移除。

记住摇树三要素：ESM 格式、sideEffects false、具名导入，缺一不可。
-->

---

# per-method 包为什么更大

<v-clicks>

- `lodash.throttle` 内部依赖 `debounce`
- 它会**自带一份私有的 debounce 副本**
- 多个 per-method 包一起用 → **重复实现堆叠**
- 官方结论：discouraged，v5 移除

</v-clicks>

<div v-click class="mt-4">

正解：用 `lodash-es` 具名导入或 `lodash/throttle` 子路径，让打包器**去重共享依赖**。

</div>

<!--
per-method 包为什么反而更大？这是个反直觉的点。

举例：lodash.throttle 内部依赖 debounce 的实现，于是它会自带一份私有的 debounce 副本。如果你同时还用了主包或者 lodash.debounce，就出现了重复实现。多个 per-method 包一起用，重复就堆叠起来，整体体积变大。

所以官方明确这是 discouraged，v5 会移除。正解是用 lodash-es 具名导入，或者从主包走子路径 lodash 斜杠 throttle，让打包器去重共享的内部依赖。
-->

---
layout: two-cols-header
---

# 常用方法族（一）

::left::

**集合 / 数组**

```js
groupBy([6.1, 4.2, 6.3], Math.floor);
// { '4':[4.2], '6':[6.1,6.3] }

keyBy([{ id: "a" }], "id");
// { a: {id:'a'} }

chunk(["a", "b", "c", "d"], 2);
// [['a','b'],['c','d']]
```

::right::

**对象**

```js
get(obj, "a[0].b", "默认");
// 中途为空 → 返回默认

pick(o, ["a"]); // 白名单
omit(o, ["a"]); // 黑名单
```

<div class="mt-2 text-sm">

> `groupBy` 值是数组；`keyBy` 值是单值（留最后一个）。

</div>

<!--
常用方法族第一部分。

集合和数组：groupBy 按 iteratee 分组，每个 key 对应一个数组，比如按 Math.floor 分组得到 4 和 6 两组。keyBy 类似，但每个 key 只保留最后一个元素，是单值不是数组。chunk 把数组切成指定长度的小块。

对象：get 按路径安全取值，路径支持字符串 a 中括号 0 点 b 这种写法，中途为空就返回默认值，不抛错。pick 是白名单只留指定属性，omit 是黑名单去掉指定属性，两者都返回新对象。

记住一个对比：groupBy 的值是数组，keyBy 的值是单值，同 key 后者覆盖前者。
-->

---
layout: two-cols-header
---

# 常用方法族（二）

::left::

**lang：拷贝 / 比较**

```js
cloneDeep(obj);
// 深拷贝，保留函数、处理循环引用

isEqual({ a: [1] }, { a: [1] });
// true（深比较 SameValueZero）

isEqual(NaN, NaN); // true
```

::right::

**函数**

```js
debounce(fn, 300); // 防抖
throttle(fn, 300); // 节流
memoize(calc); // 缓存
once(setup); // 只执行一次
```

<div class="mt-2 text-sm">

> `isEqual` 用 SameValueZero，`NaN` 视为相等。

</div>

<!--
常用方法族第二部分。

lang 分类管类型、拷贝、比较。cloneDeep 是深拷贝，能保留函数、正确处理循环引用。isEqual 是深比较，对结构相同的嵌套对象返回 true，用的是 SameValueZero 语义，所以 isEqual NaN 和 NaN 是 true，这和三等号不同。

函数分类：debounce 防抖，throttle 节流，memoize 缓存计算结果，once 让函数只执行一次。

这几个复杂工具正是 lodash-es 的价值所在，原生没有、自己写又容易错。
-->

---

# 变异陷阱：会改你的入参

| 会变异入参 ⚠️ | 返回新值 ✅ |
|---|---|
| `merge` / `mergeWith` | `cloneDeep` / `clone` |
| `assign` | `pick` / `omit` |
| `defaults` / `defaultsDeep` | `mapValues` |
| `set` / `unset` | `get` / `has` |
| `pull` / `remove` | `filter` / `map` |

```js
const a = { x: { p: 1 } };
merge(a, { x: { q: 2 } }); // a 被改成 { x:{p:1,q:2} }！
```

<!--
这是 lodash 最该先分清的一类陷阱：一部分方法会直接修改你传入的对象。

左边这些是会变异入参的：merge、mergeWith、assign、defaults、defaultsDeep、set、unset、pull、remove。右边这些返回新值不改原值：cloneDeep、clone、pick、omit、mapValues、get、has、filter、map。

看下面例子：a 是 x 包 p 等于 1，调用 merge a 逗号 x 包 q 等于 2 之后，a 本身就被改成了 x 里同时有 p 和 q。merge 变异了第一个参数。

所以在需要不可变更新的地方，比如 Redux 或 React 状态，不能直接用 merge 和 set，这一点后面会专门讲。
-->

---

# 深合并 merge：数组的坑

```js
merge({ a: [1, 2, 3] }, { a: [4] });
// → { a: [4, 2, 3] }  （按索引合并！）
```

<v-clicks>

- 不是 `[4]`，也不是拼接成 `[1,2,3,4]`
- merge 对数组**按索引递归合并**
- 想「源数组整体替换」→ 用 `mergeWith` + customizer

</v-clicks>

<div v-click class="mt-2 text-sm">

```js
mergeWith(dest, src, (o, s) => (Array.isArray(s) ? s : undefined));
```

</div>

<!--
深合并 merge 处理数组的行为常令人意外。

merge a 等于 1 2 3 逗号 a 等于 4，结果是 a 等于 4 2 3。注意它既不是 4，也不是拼接成 1 2 3 4，而是按索引递归合并：源的第 0 项 4 覆盖了目标的第 0 项 1，其余位置保留。这是本地实测的结果。

如果你想要的是源数组整体替换目标数组，得用 mergeWith 传一个 customizer：当检测到值是数组时直接返回源数组，否则返回 undefined 交还默认逻辑。

这个坑在合并配置对象、合并默认值时很常见，要心里有数。
-->

---

# 防抖 debounce：选项与控制

```js
// 默认：静默 300ms 后在尾部触发一次
debounce(fn, 300);

// 立即响应 + 冷却：首次执行，窗口内忽略，尾部不补
debounce(fn, 1000, { leading: true, trailing: false });

// 加上限：持续调用最多等 2000ms 也执行一次
debounce(fn, 500, { maxWait: 2000 });

const d = debounce(fn, 300);
d.cancel(); // 取消挂起调用
d.flush(); // 立即执行挂起调用
```

<!--
防抖 debounce 的选项和控制方法。

默认行为：leading false、trailing true，连续调用不断重置计时，静默满 300 毫秒后在尾部触发一次。

leading true、trailing false 组合：首次立刻执行，窗口内后续调用忽略，尾部不再补发，这是按钮防连点的典型效果。

maxWait 给防抖加上限：正常防抖 500 毫秒，但持续输入时最多等 2000 毫秒也一定执行一次，避免一直输入导致永远不触发。事实上 lodash 内部的 throttle 就是用带 maxWait 的 debounce 实现的。

返回的函数还带两个方法：cancel 取消并丢弃挂起的调用，flush 立即执行挂起的调用。组件卸载时常用 cancel，提交前常用 flush。
-->

---

# 节流 throttle vs 防抖 debounce

| 维度 | debounce 防抖 | throttle 节流 |
|---|---|---|
| 语义 | 静默后触发 | 每周期最多一次 |
| 默认 | 尾部触发一次 | 首尾都触发 |
| 场景 | 搜索框、resize | 滚动、拖拽 |
| 控制 | cancel / flush | cancel / flush |

```js
window.addEventListener("scroll", throttle(updatePosition, 100));
```

<!--
节流和防抖的对比。

语义上：防抖是「静默后才触发」，连续调用会不断推迟，直到停下来；节流是「每个周期最多触发一次」，无论调用多频繁。

默认行为：防抖默认在尾部触发一次；节流默认首尾都触发。

适用场景：防抖适合搜索框输入、窗口 resize 这种「等用户停下来再处理」的；节流适合滚动、拖拽这种「持续过程中要定期响应」的。

两者返回的函数都带 cancel 和 flush。下面例子：滚动时用 throttle 把更新位置限制到每 100 毫秒最多一次。
-->

---

# memoize 的缓存坑

```js
const add = memoize((a, b) => a + b);
add(1, 2); // 3，以 key=1 缓存
add(1, 5); // ⚠️ 命中旧缓存 → 返回 3（不是 6）
```

<v-clicks>

- 默认**只用第一个参数**当 key（缓存是 MapCache）
- 多参数会因首参相同而**误命中**
- 解法：传 resolver 自定义 key
- 注意：缓存**永不自动淘汰**，会无限增长

</v-clicks>

<div v-click class="text-sm">

```js
memoize((a, b) => a + b, (a, b) => `${a},${b}`);
```

</div>

<!--
memoize 有个著名的缓存坑。

add 等于 memoize 一个两参加法函数。add 1 逗号 2 得到 3，并以 key 等于 1 缓存。接着 add 1 逗号 5，因为 memoize 默认只用第一个参数 1 当 key，直接命中了旧缓存，返回 3，而不是 6。这是本地实测的结果。

根因是 memoize 默认只用第一个参数当 key，缓存类型是 MapCache。多参数函数就会因为首参相同而误命中。

解法是传第二个参数 resolver，自定义 key，比如把所有参数拼起来。

还要注意：memoize 的缓存永不自动失效、永不淘汰，会随调用持续增长。要容量上限就得自定义 Cache 类。
-->

---

# flow vs chain：ESM 下的取舍

```js
flow([add1, mul2])(5); // 左→右：(5+1)*2 = 12
flowRight([add1, mul2])(5); // 右→左：(5*2)+1 = 11
```

<v-clicks>

- `chain` 在 lodash-es **仍可用**（实测正常），但不利摇树
- `chain` 会挂大量 wrapper 原型方法 → 难 tree-shaking
- `flow` 用具名导入组合 → **摇树友好 + 可复用**

</v-clicks>

<div v-click class="mt-2 text-sm">

> 体积敏感选 `flow`；只有超大数据靠 `chain` 惰性求值时才用它。

</div>

<!--
flow 和 chain 在 ESM 下的取舍。

先看 flow 的求值方向：flow 是从左到右，flow add1、mul2 作用于 5，先加一再乘二，得 12。flowRight 是从右到左，也就是 compose，先乘二再加一，得 11。这是实测结果。

关键取舍：chain 在 lodash-es 里仍然可用，本地实测链式调用正常返回结果，它并没有被废弃。但是 chain 会把大量方法挂到 wrapper 原型上，打包器很难判断你用了哪些，往往把一大批都打进产物，严重不利于 tree-shaking。

而 flow 用具名导入的单函数组合，摇树友好，还能产出可复用的纯函数管道。

所以结论是：体积敏感就用 flow；只有处理超大数据、要靠 chain 的惰性求值和短路优化时，才值得用 chain。
-->

---

# 不可变更新：别直接 set / merge

```js
// ❌ 直接 set 会变异 state（破坏不可变）
set(state, "user.name", "Tom");

// ① lodash/fp 的不可变版本：返回新对象
import fp from "lodash/fp";
const next = fp.set("user.name", "Tom", state);

// ② cloneDeep 后再改
const next2 = set(cloneDeep(state), "user.name", "Tom");

// ③ 工程主流：immer
import { produce } from "immer";
const next3 = produce(state, (d) => { d.user.name = "Tom"; });
```

<!--
不可变更新是 lodash 使用里的一个重点坑。

Redux 的 reducer、React 的状态更新都要求返回新对象、不改原值。但常规的 set 会直接变异 state，第一行就是错误示范。

三种正确做法。第一，用 lodash 斜杠 fp 的不可变版本：fp.set 返回新对象，不改原 state，注意 fp 是 data-last，数据放最后。第二，先 cloneDeep 整个 state，再在副本上 set，代价是整树拷贝。第三，工程上更主流的是用 immer 的 produce，写起来像直接改，实际上返回的是新对象。

记住核心：认清常规 set 和 merge 的变异语义，不可变场景换上面三种之一。
-->

---

# lodash/fp：不可变 + 柯里化 + data-last

```js
import fp from "lodash/fp";

// data-last：数据放最后，便于组合
fp.map("name")(users);

// 默认 cap iteratee 参数，避开经典坑
map(["6", "8", "10"], parseInt); // [6, NaN, 2] ⚠️
fp.map(parseInt)(["6", "8", "10"]); // [6, 8, 10] ✅
```

<div v-click class="mt-2 text-sm">

> fp 三特性：immutable（不改入参）、auto-curried（自动柯里化）、iteratee-first / data-last。

</div>

<!--
lodash 斜杠 fp 是 Lodash 的函数式变体。

它把方法包装成三个特性：immutable 不改入参、auto-curried 自动柯里化、iteratee-first data-last 也就是迭代器在前数据在后。比如 fp.map 先收 iteratee name，再喂数据 users，数据放最后，特别适合 flow 组合。

fp 还默认 cap iteratee 参数，通常只传一个，可以避开一个经典坑：常规 map 数组 parseInt，结果是 6、NaN、2，因为 iteratee 收到了 value、index、collection 三个参数，parseInt 把 index 当成了进制。而 fp.map parseInt 因为默认只传一个参数，结果是正确的 6、8、10。

注意 lodash-es 对应的是常规 lodash 的 ESM；fp 风格是另一套入口。
-->

---

# 与原生方法的取舍

| 需求 | 用原生 | 用 Lodash |
|---|---|---|
| map/filter/find | ✅ Array.prototype | |
| 扁平化 / 去重原始值 | ✅ flat() / [...new Set()] | |
| 静态路径取值 | ✅ ?. + ?? | |
| 深合并 | | ✅ merge |
| 深比较 | | ✅ isEqual |
| 防抖 / 节流 | | ✅ debounce / throttle |
| 动态路径取值 | | ✅ get / set |

<!--
和原生方法的取舍，这是 2026 年用 lodash 最该想清楚的问题。

很多方法原生已经能平替，应该用原生：map、filter、find 用 Array.prototype；扁平化用 flat；去重原始值用扩展运算符加 Set；静态路径取值用可选链加空值合并。这些场景不该为了 lodash 整包依赖。

但有些是原生没有、或者自己写容易错的，应该用 lodash：深合并 merge、深比较 isEqual、防抖节流 debounce 和 throttle、动态路径取值设值 get 和 set。

一句话原则：简单且原生已覆盖的用原生；复杂、容错要求高、原生没有的，交给 lodash-es。
-->

---

# cloneDeep vs structuredClone

```js
const obj = { fn: () => 42, when: new Date() };

cloneDeep(obj); // ✅ 保留函数、Date，不报错
structuredClone(obj); // ❌ 抛 DataCloneError（无法克隆函数）
```

<v-clicks>

- 含**函数 / 类方法** → 用 `cloneDeep`
- 纯数据、想零依赖 → 原生 `structuredClone`
- 两者都支持循环引用；都强于 `JSON.parse(JSON.stringify)`

</v-clicks>

<!--
深拷贝的两个选择：cloneDeep 和原生 structuredClone。

obj 里有一个函数 fn 和一个 Date。cloneDeep 能正确处理，按引用保留函数、保留 Date，不报错，这是本地实测的。而 structuredClone 遇到函数会直接抛 DataCloneError，因为结构化克隆算法无法克隆函数。

所以取舍是：如果对象含函数或类实例方法，用 cloneDeep；如果是纯数据又想零依赖，用原生 structuredClone。

两者都支持循环引用，也都比 JSON.parse 套 JSON.stringify 强得多：后者会丢函数、丢 undefined，Date 变字符串，遇循环引用还直接抛错。
-->

---

# es-toolkit：现代替代

<v-clicks>

- 主打：**更小、更快、原生 TypeScript 类型**
- 大量函数对位 lodash，提供 `es-toolkit/compat` 兼容层
- lodash-es 需额外装 `@types/lodash-es`；es-toolkit 自带类型

</v-clicks>

<div v-click class="mt-4">

迁移风险：**并非 100% 等价**——部分方法缺失或边界不同，需逐一核对 + 补测试。

</div>

<!--
说说现代替代：es-toolkit。

它主打更小的体积、更快的性能、原生的 TypeScript 类型。大量函数对位 lodash，还提供 es-toolkit 斜杠 compat 兼容层，逼近 lodash 的 API。一个实际差别是：lodash-es 不内置类型，需要额外装 @types/lodash-es；而 es-toolkit 自带原生类型。

但迁移有风险：它并非和 lodash 百分百等价，部分方法缺失，或者对 null、对超量参数的容错、某些冷门方法的边界略有不同。所以迁移需要逐一核对，并补上测试，尤其是依赖 lodash 特定边界行为的代码。

务实策略：新项目可以优先评估 es-toolkit；存量 lodash-es 项目用 compat 平滑过渡，关键路径加测试守护。
-->

---
layout: intro
---

# 总结

Lodash-es = **可摇树的 Lodash ESM 形态**

- 引入：具名 `import { x } from 'lodash-es'`，三要素摇树
- 价值：深合并 / 深拷贝 / 深比较 / 防抖节流 / 动态路径
- 陷阱：merge/set 变异入参、memoize 默认单参 key
- 组合：用 `flow` 替代 `chain`（摇树友好）
- 取舍：简单操作用原生；复杂工具留给 lodash-es / es-toolkit

<!--
总结一下。

Lodash-es 本质是可摇树的 Lodash ESM 形态，和普通 lodash 同源同版本，区别只在模块格式。

引入用具名 import，摇树靠 ESM 格式、sideEffects false、具名导入三要素。

它的核心价值在那些复杂且容错要求高的工具：深合并、深拷贝、深比较、防抖节流、动态路径取值设值。

要警惕的陷阱：merge 和 set 会变异入参，不可变场景要换 fp 或 immer；memoize 默认只用第一个参数当 key，多参数要传 resolver。

组合优先用 flow 替代 chain，因为 chain 不利 tree-shaking。

最后的取舍：map、filter、flat 这种简单操作用原生就好；深合并、深拷贝、防抖这种复杂工具，交给 lodash-es 或更现代的 es-toolkit。谢谢大家。
-->
