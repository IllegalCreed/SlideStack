---
theme: seriph
background: https://cover.sli.dev
title: JavaScript 数组与可迭代协议
info: |
  从数组容器到迭代协议 —— 增删改查、变更 vs 不变更、ES2023 不可变孪生、解构扩展、Iterator Helpers
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:javascript class="text-8xl" />
</div>

<br/>

## JavaScript 数组与可迭代协议

从「会用数组」升级到「理解 JS 的迭代体系」（基于 ES2025 · 核于 2026-06）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
数组是「以整数为键、带 length 的特殊对象」，而它真正的抽象是可迭代协议。
-->

---
transition: fade-out
---

# 这一章讲什么

数组只是「可迭代对象」里最常见的一种

<v-click>

- **容器**：增删改查、稀疏数组、`at()`、`slice` vs `splice`
- **分水岭**：变更 vs 不变更 + ES2023 不可变孪生
- **变换**：`map` / `filter` / `reduce` / `find`
- **语法糖**：解构赋值、扩展与剩余 `...`
- **抽象**：可迭代协议、Iterator Helpers（ES2025）

</v-click>

<v-click>

> 最关键的一条线：一个方法**改不改原数组**——这决定了 React/Vue 里视图刷不刷新。

</v-click>

---
layout: section
---

# 一 · 数组基础

增删改查与遍历

---

# 创建数组：字面量优先

```js
const a = [1, 2, 3]; // ① 字面量（首选）
const b = Array.of(7); // ② [7]，把参数逐个当元素
const c = Array.from("abc"); // ③ ["a","b","c"]，从可迭代/类数组造
```

<v-click>

优先级：字面量 `[]` > `Array.of(...)` > `Array.from(...)`，少用 `new Array(n)`。

</v-click>

<v-click>

::: warning `Array(n)` 单数字参数的坑
`Array(3)` 不是 `[3]`，而是**长度为 3 的空槽数组** `[<3 empty items>]`；想造单元素数组用 `Array.of(3)` 或直接 `[3]`。
:::

</v-click>

---

# `length` 不只是只读计数

`length` 始终等于「最大整数索引 + 1」，而且**可写**：

```js
const arr = ["a", "b", "c", "d"];

arr.length = 2; // ["a", "b"]（截断，丢弃 c、d）
arr.length = 4; // ["a", "b", <2 empty items>]（补空槽）
arr.length = 0; // []（清空数组的一种写法）
```

<v-click>

写小 → **截断**；写大 → 用**空槽**补齐。这是少数「赋值会改变结构」的属性。

</v-click>

---

# 读写元素与 `at()`

```js
const arr = ["甲", "乙", "丙"];

arr[0]; // "甲"
arr[10]; // undefined（越界不报错）
arr.at(-1); // "丙"（at 支持负索引，从末尾数）
```

<v-click>

- 越界访问返回 `undefined`，**不抛错**
- 给越界索引赋值（`arr[5] = x`）会造**空槽**、撑大 `length`
- `at(-1)` 比 `arr[arr.length - 1]` 更简洁取末位（ES2022）

</v-click>

---

# 增删：尾部快、头部慢

```js
const stack = [1, 2];
stack.push(3, 4); // 尾部加，返回新长度 → [1, 2, 3, 4]
stack.pop(); // 尾部删，返回被删的 4 → [1, 2, 3]

const queue = [2, 3];
queue.unshift(1); // 头部加 → [1, 2, 3]
queue.shift(); // 头部删，返回 1 → [2, 3]
```

<v-click>

::: tip 头部操作为什么慢
`unshift` / `shift` 要把后面**所有元素**整体挪位（索引全 +1 或 -1），是 O(n)；大数组频繁头插头删远慢于尾部。
:::

</v-click>

---

# `splice`：任意位置的瑞士军刀

`splice(start, deleteCount, ...items)`：**就地改**，返回**被删元素数组**。

```js
const arr = ["a", "b", "c", "d", "e"];

arr.splice(1, 2); // 删：返回 ["b","c"]，arr=["a","d","e"]
arr.splice(1, 0, "X"); // 插：删 0 个、插 X
arr.splice(0, 1, "首"); // 替：删 1 个、补 1 个
```

<v-click>

口诀：第一参「从哪开始」、第二参「删几个」、其余「要插什么」；负 `start` 从末尾算。

</v-click>

---

# `slice` vs `splice`：一字之差，行为相反

`slice(start, end)` 返回**新数组**（含 `start`、不含 `end`），**不改原数组**：

```js
const arr = [1, 2, 3, 4, 5];

arr.slice(1, 3); // [2, 3]（原数组不变）
arr.slice(-2); // [4, 5]（负索引）
arr.slice(); // [1,2,3,4,5]（不传参 = 浅拷贝整个数组）
```

<v-click>

| 方法 | 改原数组 | 返回 |
| --- | --- | --- |
| `splice` | ✅ 是 | 被删除的元素数组 |
| `slice` | ❌ 否 | 截取出的新数组 |

</v-click>

---

# 查找：`indexOf` vs `includes`

```js
const arr = [1, 2, 3, NaN];

arr.indexOf(2); // 1（首次出现的索引，找不到返回 -1）
arr.includes(3); // true（只问「有没有」，返回布尔）

arr.indexOf(NaN); // -1 ❌（indexOf 用 ===，NaN !== NaN）
arr.includes(NaN); // true ✅（SameValueZero，能识别 NaN）
```

<v-click>

判断「在不在」用 `includes`（更语义化，且能正确处理 `NaN`）；要拿位置才用 `indexOf`。

</v-click>

---

# 稀疏数组与空槽

「空槽」（empty slot）和值为 `undefined` 的格子**不是一回事**：

```js
const sparse = [1, , 3]; // 索引 1 是空槽
sparse.forEach((v) => log(v)); // 只打印 1、3（跳过空槽）
sparse.map((v) => v * 2); // [2, <empty>, 6]（保留空槽）
for (const v of sparse) log(v); // 1、undefined、3（当 undefined）
```

<v-click>

| 行为 | `map`/`filter`/`forEach`/`reduce` | `for...of`/扩展/`find` |
| --- | --- | --- |
| 对待空槽 | **跳过** | 当作 `undefined` |

</v-click>

---

# 遍历：三种主流写法

```js
const arr = ["红", "绿", "蓝"];

for (const c of arr) log(c); // ① for...of：只要值，最常用
for (const [i, c] of arr.entries()) log(i, c); // ② 索引 + 值
arr.forEach((c, i) => log(i, c)); // ③ 回调式，无法 break
```

<v-click>

::: warning 永远不要用 `for...in` 遍历数组
`for...in` 遍历的是**可枚举属性键**（字符串形式），会连原型属性一起枚举、顺序不保证。它为普通对象设计，用在数组上是常见 bug 源。
:::

</v-click>

---
layout: section
---

# 二 · 变更 vs 不变更

整个数组体系最重要的一条线

---

# 九个变更方法（改原数组）

记住这九个会改原数组的，剩下的基本都返回新值：

| 变更方法 | 作用 | 返回值 |
| --- | --- | --- |
| `push` / `pop` | 尾部增 / 删 | 新长度 / 被删元素 |
| `unshift` / `shift` | 头部增 / 删 | 新长度 / 被删元素 |
| `splice` | 任意位置增删改 | 被删元素数组 |
| `sort` / `reverse` | 就地排序 / 反转 | **同一个数组引用** |
| `fill` / `copyWithin` | 区间填充 / 内部复制 | **同一个数组引用** |

---

# 最隐蔽的坑：`sort` 返回原数组本身

```js
const a = [3, 1, 2];
const b = a.sort(); // 看起来像「拿到排序结果」
b.push(99); // 但 b 就是 a！

console.log(a); // [1, 2, 3, 99] —— a 也被改了
console.log(a === b); // true
```

<v-click>

误以为 `b` 是副本，结果改 `b` 把 `a` 一起改了——这是「状态被意外篡改」的经典来源。`sort` / `reverse` / `fill` 都返回**同一个引用**，不是副本。

</v-click>

---

# `sort` 的两个必知细节

```js
// ① 默认按「字符串」排序，数字会排错
[2, 10, 1].sort(); // [1, 10, 2] ❌（逐字符比，"10" < "2"）
[2, 10, 1].sort((a, b) => a - b); // [1, 2, 10] ✅ 升序
[2, 10, 1].sort((a, b) => b - a); // [10, 2, 1] 降序
```

<v-click>

比较器返回值：**负数** → `a` 排前；**正数** → `a` 排后；**0** → 保持相对顺序。

</v-click>

<v-click>

② 排序是**稳定的**（ES2019 起规范保证）：相等元素保持原有先后。

</v-click>

---

# ES2023：每个变更方法的「不可变孪生」

过去想「排序但不动原数组」只能 `[...arr].sort()`；ES2023 一次性补齐：

| 变更方法（改原） | ES2023 不变更孪生（返回新数组） |
| --- | --- |
| `sort()` | **`toSorted()`** |
| `reverse()` | **`toReversed()`** |
| `splice()` | **`toSpliced()`** |
| `arr[i] = v` | **`with(i, v)`** |

<v-click>

均已 **Baseline 广泛可用**，是「想要新数组」时的首选。

</v-click>

---

# toSorted / toReversed / toSpliced 实战

```js
const arr = [3, 1, 2];

const sorted = arr.toSorted((a, b) => a - b); // [1, 2, 3]
const reversed = arr.toReversed(); // [2, 1, 3]
const spliced = arr.toSpliced(1, 1, 99); // [3, 99, 2]

console.log(arr); // [3, 1, 2] —— 原数组纹丝不动 ✅
```

<v-click>

三个方法签名与变更版完全一致，只是**返回新数组、原数组不动**。

</v-click>

---

# `with(index, value)`：不可变的单点替换

`arr[i] = v` 会改原数组；`with` 返回「第 `i` 项被替换」的新数组：

```js
const arr = ["a", "b", "c"];

const next = arr.with(1, "改"); // ["a", "改", "c"]
console.log(arr); // ["a", "b", "c"]（原数组不变）✅
arr.with(-1, "尾"); // 也支持负索引
```

<v-click>

这正是 React 里「更新数组中某一项」的理想写法：

```js
setItems((items) => items.with(i, { ...items[i], done: true }));
```

</v-click>

---

# ES2023：从末尾查找 findLast / findLastIndex

`find` / `findIndex` 从头找；ES2023 的 `findLast` / `findLastIndex` 从**末尾往前**：

```js
const nums = [1, 2, 3, 4, 5, 6];

nums.find((n) => n % 2 === 0); // 2（第一个偶数）
nums.findLast((n) => n % 2 === 0); // 6（最后一个偶数）✅
nums.findLastIndex((n) => n > 3); // 5（最后一个 >3 的索引）✅
```

<v-click>

免去「先 `reverse` 再 `find`」的别扭，同样**不改原数组**。

</v-click>

---

# 为什么这在框架里至关重要

React / Vue 靠**引用是否变化**侦测状态变化。对 state 数组用变更方法，引用没变 → 框架认为「什么都没发生」：

```js
// ❌ 错：sort 就地改，引用不变，不重渲染
state.list.sort((a, b) => a - b);
setList(state.list);

// ✅ 对：toSorted 产生新数组，引用变了，触发更新
setList(state.list.toSorted((a, b) => a - b));
```

<v-click>

::: tip 心智模型
把数组状态当成**不可变**的：不要改它，而要**基于它生成一个新的**——`toSorted` / `with` / `map` / `filter` / 扩展 `...` 都是趁手工具。
:::

</v-click>

---
layout: section
---

# 三 · 高阶遍历方法

map / filter / reduce 三大支柱

---

# 共同形态：回调签名 (el, i, arr)

它们都接收一个**回调函数**，对每个元素调用它：

```js
arr.map((element, index, array) => {
  // element：当前元素
  // index：当前下标
  // array：被遍历的数组本身（少用）
});
```

<v-click>

绝大多数时候只用 `element`，偶尔用 `index`。这组方法**都不改原数组**。

</v-click>

---

# `map`：一对一变形

`map` 把每个元素的**返回值**收集成一个**等长**新数组：

```js
const nums = [1, 2, 3];
nums.map((n) => n * n); // [1, 4, 9]
nums.map((n, i) => `${i}:${n}`); // ["0:1", "1:2", "2:3"]
```

<v-click>

::: warning 最常见错误：忘了 return
箭头函数加花括号 `{}` 就需显式 `return`，否则全映射成 `undefined`：

```js
[1, 2].map((n) => { n * 2; }); // [undefined, undefined] ❌
[1, 2].map((n) => n * 2); // [2, 4] ✅（无花括号，隐式返回）
```

:::

</v-click>

---

# `filter`：按条件筛选

回调返回**真值**则保留该元素，得到**子集**新数组：

```js
const nums = [1, 2, 3, 4, 5, 6];

nums.filter((n) => n % 2 === 0); // [2, 4, 6]
nums.filter((n) => n > 10); // []（无匹配返回空数组）
```

<v-click>

配合 `Boolean` 一键剔除假值：

```js
[0, 1, "", "a", null, 2].filter(Boolean); // [1, "a", 2]
```

</v-click>

---

# `reduce`：折叠成一个值

回调 `(accumulator, current) => 新acc`，第二参是**初始值**：

```js
const nums = [1, 2, 3, 4];

nums.reduce((acc, n) => acc + n, 0); // 10（求和）
nums.reduce((acc, n) => Math.max(acc, n), -Infinity); // 4
```

<v-click>

数组 → 对象（按字段建索引）时，**务必在回调里返回累加器**：

```js
list.reduce((acc, item) => { acc[item.id] = item; return acc; }, {});
```

</v-click>

---

# reduce 的致命坑：空数组无初值抛错

```js
[].reduce((a, b) => a + b); // ❌ TypeError: Reduce of empty
                            //    array with no initial value
[].reduce((a, b) => a + b, 0); // ✅ 返回 0
```

<v-click>

省略初始值时，`reduce` 拿**第一个元素**当初值、从第二个开始迭代；数组为空就无初值可用 → 报错。

</v-click>

<v-click>

::: tip 养成总传初始值的习惯
既避免空数组崩溃，也让累加器类型明确。`reduceRight` 与 `reduce` 一致，只是从右往左。
:::

</v-click>

---

# find / some / every：定位与判断

```js
const nums = [1, 2, 3, 4];

nums.find((n) => n > 2); // 3（首个匹配的元素，找不到 undefined）
nums.findIndex((n) => n > 2); // 2（首个匹配的索引，找不到 -1）
nums.some((n) => n > 3); // true（存在一个就短路）
nums.every((n) => n > 0); // true（全满足，遇 false 就短路）
```

<v-click>

`find` 找到第一个就停、返回**单个元素**；`filter` 跑完全程、返回**数组**。`some`/`every` 都**短路**。

</v-click>

---

# flat / flatMap：拍平与「一变多」

```js
// flat：把嵌套数组拍平，默认拍一层
[1, [2, 3], [4, [5]]].flat(); // [1, 2, 3, 4, [5]]
[1, [2, [3]]].flat(Infinity); // [1, 2, 3]（全部拍平）

// flatMap = map 后 flat(1)，适合「一个元素产出多个」
["hello world", "foo"].flatMap((s) => s.split(" "));
// ["hello", "world", "foo"]
```

<v-click>

`flatMap` 回调返回 `[]` 即丢弃，可同时实现「映射 + 过滤」。

</v-click>

---

# 链式管道：声明式数据流水线

这些方法多返回新数组，能**链式**串成清晰的「数据流水线」，替代命令式 `for`：

```js
const total = orders
  .filter((o) => o.paid) // 先筛：已付款
  .map((o) => o.amount) // 再取金额
  .reduce((sum, x) => sum + x, 0); // 再求和
```

<v-click>

::: tip 可读性 vs 性能
每一环都生成中间数组。日常数据量下开销可忽略，**优先选可读性**；只有超大数组/热点才合并步骤，或用后面的 **Iterator Helpers** 做惰性无中间数组的链式处理。
:::

</v-click>

---
layout: section
---

# 四 · 解构赋值

把「取值」写成一行

---

# 数组解构：按位置取值

```js
const [a, b, c] = [1, 2, 3]; // a=1 b=2 c=3
const [first, , third] = ["甲", "乙", "丙"]; // 空逗号跳过 → "甲" "丙"

let x = 1, y = 2;
[x, y] = [y, x]; // 交换变量，不需临时变量 → x=2 y=1
```

<v-click>

数组解构**按位置**匹配，用「空逗号」占位跳过不需要的元素。

</v-click>

---

# 默认值：仅对 undefined 生效

当对应位置是 `undefined`（缺失或显式 `undefined`）时默认值生效；`null` **不**触发：

```js
const [a = 10, b = 20] = [1]; // a=1, b=20（b 缺失，用默认）
const [c = 5] = [undefined]; // c=5（undefined 触发默认）
const [d = 5] = [null]; // d=null（null 是有效值，不触发）
```

<v-click>

记牢这条边界：**只有 `undefined` 触发默认值**，`null` / `0` / `""` 都是「有效值」。

</v-click>

---

# 对象解构：按属性名取值

数组按位置，对象则**按属性名**匹配，顺序无关：

```js
const user = { name: "张三", age: 18, city: "北京" };

const { name, age } = user; // "张三" 18（city 忽略即可）
const { p: foo, q: bar } = { p: 42, q: true }; // 重命名：foo=42 bar=true
const { x: v = 99 } = {}; // 重命名 + 默认：v=99
```

<v-click>

重命名语法 `属性名: 新变量名`——此时 `p`、`q` 不再是变量，`foo`、`bar` 才是。

</v-click>

---

# 剩余 `...`：兜住其余

数组剩余收成**新数组**，对象剩余收成**新对象**，**必须放最后**：

```js
const [head, ...tail] = [1, 2, 3, 4]; // head=1, tail=[2,3,4]

// 对象剩余常用于「去掉某个字段」
const { password, ...safe } = { id: 1, name: "A", password: "x" };
console.log(safe); // { id: 1, name: "A" }（剥离了 password）
```

<v-click>

剩余元素后不能再有元素、也不能带尾逗号（`const [a, ...rest, b]` 是 SyntaxError）。

</v-click>

---

# 嵌套解构：按结构形状层层解

```js
const data = { id: 42, user: { name: "Jane", roles: ["admin"] } };

const {
  user: { name: userName, roles: [firstRole] },
} = data;
console.log(userName, firstRole); // "Jane" "admin"
```

<v-click>

::: tip 嵌套解构只「取」不「建」
`const { user: { name } } = data` 解构出的是 `name`，**`user` 并不会成为变量**——它只是「路径」。两者都要得写 `const { user, user: { name } } = data`。
:::

</v-click>

---

# 函数参数解构 + 整体默认

「接收一个配置对象」的函数，解构最高频的实战场景：

```js
function drawChart({ size = "big", radius = 25 } = {}) {
  return { size, radius };
}
drawChart(); // 全用默认值（靠末尾的 = {}）
drawChart({ radius: 30 }); // 只覆盖 radius
```

<v-click>

::: warning 参数解构一定要补 `= {}`
漏了整体默认 `= {}`，调用 `f()` 不传参时会对 `undefined` 解构而**抛错**。给参数一个 `= {}` 兜底即可。
:::

</v-click>

---

# 两个进阶点

```js
// ① 计算属性名：用变量当解构的键
const key = "name";
const { [key]: value } = { name: "张三" }; // value = "张三"

// ② 给「已声明变量」解构对象：整句加括号
let a, b;
;({ a, b } = { a: 1, b: 2 }); // 否则开头的 { 被当代码块
```

<v-click>

数组参数解构常用于返回「元组」的 API，如 React 的 `const [count, setCount] = useState(0)`。

</v-click>

---
layout: section
---

# 五 · 扩展与剩余 `...`

一个符号，两种角色

---

# 位置决定语义

`...` 长得一样，含义却由**位置**决定：

<v-click>

- **扩展（spread）**：在数组字面量 / 函数调用 / 对象字面量里，把集合「**摊开**」成多个独立项
- **剩余（rest）**：在解构模式 / 函数参数里，把多个项「**收拢**」成一个数组或对象

</v-click>

<v-click>

口诀：**摊开**用在「构造 / 调用」处，**收拢**用在「接收 / 解构」处。

</v-click>

---

# 扩展数组与传参

```js
const a = [1, 2], b = [3, 4];

const copy = [...a]; // [1, 2]（浅拷贝，copy !== a）
const merged = [...a, ...b]; // [1, 2, 3, 4]（合并）
const inserted = [0, ...a, 9]; // [0, 1, 2, 9]（任意位置插入）

Math.max(...[5, 1, 8]); // 8（把数组拆成实参，取代 apply）
```

<v-click>

`[...arr]` 和 `arr.slice()`、`Array.from(arr)` 等价（都是浅拷贝）。`[..."abc"]` 也能拆字符串。

</v-click>

---

# 扩展对象（ES2018）

```js
const base = { a: 1, b: 2 };

const clone = { ...base }; // { a: 1, b: 2 }（浅拷贝）
const extended = { ...base, c: 3 }; // 添加字段
const merged = { ...base, b: 99 }; // 同名键「后者覆盖前者」→ b: 99
```

<v-click>

::: tip 不可变更新字段：`{ ...obj, 字段: 新值 }`
React 里更新对象状态的标准写法——复制旧对象、覆盖个别字段、得到全新引用：

```js
setUser((user) => ({ ...user, name: "新名字" }));
```

:::

</v-click>

---

# 剩余参数：收集成真数组

函数形参里的 `...` 把「不定数量实参」收成一个**真正的数组**：

```js
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0); // nums 是真数组
}
sum(1, 2, 3, 4); // 10
```

<v-click>

::: warning 剩余参数 vs `arguments`
老式 `arguments` 是**类数组**（有 `length` 但没 `map`/`reduce`），还在箭头函数里不可用。剩余参数 `...args` 是**真数组**、语义清晰——新代码一律用它。
:::

</v-click>

---

# `...` 是浅拷贝（最易踩的坑）

`...` 只复制**最外层一层**。嵌套对象/数组仍是**同一个引用**：

```js
const original = { name: "A", tags: ["x", "y"] };
const copy = { ...original };

copy.name = "B"; // ✅ 安全：浅层独立
copy.tags.push("z"); // ⚠️ 危险：tags 是共享引用！
console.log(original.tags); // ["x", "y", "z"] —— 原对象也被改了
```

<v-click>

需要「深拷贝」用 `structuredClone(obj)`（现代浏览器与 Node 内置），别指望 `...` 帮你深复制。

</v-click>

---

# 一个实用细节：`[...str]` 正确拆 emoji

字符串迭代器按 **Unicode 码点**走，能完整保留代理对：

```js
[..."a🙂b"]; // ["a", "🙂", "b"] ✅
"a🙂b".split(""); // ["a", "\ud83d", "\ude42", "b"] ❌
```

<v-click>

`split("")` 按 UTF-16 码元切分，会把一个表情拆成两半。这同样源于「字符串实现了**可迭代协议**」——下一章正式讲它。

</v-click>

---
layout: section
---

# 六 · 可迭代协议

数组之上的真正抽象

---

# 为什么这套语法对字符串/Map/Set 都管用

`for...of`、扩展 `...`、数组解构并非「为数组特制」，而是面向一个更通用的契约——**可迭代协议**。

<v-click>

两个配套的协议：

- **可迭代协议（iterable）**：对象有 `[Symbol.iterator]()` 方法、返回一个迭代器
- **迭代器协议（iterator）**：对象有 `next()` 方法、每次返回 `{ value, done }`，`done: true` 表示结束

</v-click>

<v-click>

内置可迭代：数组、字符串、`Map`、`Set`、`arguments`、`NodeList`。

</v-click>

---

# 迭代器协议：next() → { value, done }

```js
const arr = [10, 20];
const it = arr[Symbol.iterator](); // 拿到数组的迭代器

it.next(); // { value: 10, done: false }
it.next(); // { value: 20, done: false }
it.next(); // { value: undefined, done: true }（结束）
```

<v-click>

`for...of` 在背后做的，正是「调用 `[Symbol.iterator]()` 拿迭代器，反复 `next()` 直到 `done`」。

</v-click>

---

# 手写一个可迭代对象

任意对象只要实现 `[Symbol.iterator]`，就能接入语言级语法：

```js
const range = {
  from: 1, to: 3,
  [Symbol.iterator]() {
    let cur = this.from;
    // next 返回 { value, done }：越界即 done: true
    const next = () =>
      cur <= this.to ? { value: cur++, done: false } : { done: true };
    return { next };
  },
};
```

```js
[...range]; // [1, 2, 3]（for...of / 数组解构同样可用）
```

---

# 类数组 ≠ 可迭代

「类数组」有数字索引和 `length`，但**没有** `Symbol.iterator`，不能 `for...of` / `...`：

```js
const arrayLike = { 0: "a", 1: "b", length: 2 };

// [...arrayLike]        // ❌ TypeError: not iterable
Array.from(arrayLike); // ["a", "b"] ✅（认 length，不强求可迭代）
```

<v-click>

典型代表是旧式 `arguments`、某些 DOM 集合。要遍历它们得先转换。

</v-click>

---

# Array.from vs 扩展 `...`

两者都能转真数组，但适用面不同：

```js
const set = new Set([1, 2, 2, 3]);

[...set]; // [1, 2, 3]（扩展：要求「可迭代」）
Array.from(set, (x) => x * 10); // [10, 20, 30]（独有第二参 mapFn）
Array.from({ length: 3 }, (_, i) => i); // [0, 1, 2]（凭空造序列）
```

<v-click>

| 能力 | `[...x]` | `Array.from(x)` |
| --- | --- | --- |
| 可迭代对象 | ✅ | ✅ |
| 类数组（仅 `length`） | ❌ | ✅ |
| 转换时映射 | ❌ | ✅（第二参 `mapFn`） |

</v-click>

---

# 生成器：写迭代器的捷径

`function*` + `yield` 让你用「顺序代码」描述「逐个产出值」，返回的生成器**本身就是迭代器**：

```js
function* range(from, to) {
  for (let i = from; i <= to; i++) yield i; // yield 产出一个值并暂停
}
[...range(1, 4)]; // [1, 2, 3, 4]
```

<v-click>

生成器能 `yield` 出**无限序列**，因为它惰性求值、要一个才算一个：

```js
function* naturals() {
  let n = 1;
  while (true) yield n++; // 无限但不卡死——只在 next 时推进
}
```

</v-click>

---
layout: section
---

# 七 · Iterator Helpers

ES2025：惰性、无中间数组

---

# 过去的痛点：先摊成数组才能链式

要对迭代器做 `map` / `filter`，过去得先 `[...it]` 摊成数组——这会**立即跑完**整个迭代器、生成中间数组，对无限序列直接死循环。

<v-click>

**ES2025** 给迭代器原型加上一组与数组同名的方法（**Iterator Helpers**，Baseline 新近可用），它们**惰性**工作、不产生中间数组。

</v-click>

---

# Iterator Helpers 方法一览

| 迭代器方法 | 作用 |
| --- | --- |
| `map(fn)` / `filter(fn)` | 惰性变形 / 筛选 |
| `take(n)` / `drop(n)` | 取前 `n` 个 / 跳过前 `n` 个 |
| `flatMap(fn)` | 映射后摊平一层 |
| `reduce(fn, init)` | 折叠成单值（**会跑完**） |
| `toArray()` | 物化成真数组 |
| `some` / `every` / `find` / `forEach` | 与数组同名的终结操作 |

---

# 链式调用：全程不生成中间数组

```js
const set = new Set([1, 2, 3, 4, 5, 6]);

const result = set
  .values() // 拿到迭代器
  .filter((n) => n % 2 === 0) // 惰性筛偶数
  .map((n) => n * 10) // 惰性 ×10
  .toArray(); // 到此才真正迭代一遍 → [20, 40, 60]
```

<v-click>

与数组方法形态相同，但**惰性**：只有终结操作（`toArray`/`reduce`/…）才触发实际迭代。

</v-click>

---

# 惰性的杀手锏：驯服无限序列

惰性意味着「只算到够用为止」，于是无限生成器 + `take` 成了可能：

```js
function* naturals() {
  let n = 1;
  while (true) yield n++;
}

naturals()
  .map((n) => n * n)
  .take(5) // 集满 5 个就停止向上游索取
  .toArray(); // [1, 4, 9, 16, 25] —— 不会死循环
```

---

# Iterator.from：给任意可迭代装上 helper

如果手头是普通可迭代对象（没继承 `Iterator` 原型），用 `Iterator.from(x)` 包一层：

```js
Iterator.from([1, 2, 3, 4])
  .filter((n) => n > 2)
  .toArray(); // [3, 4]
```

<v-click>

::: warning Iterator Helpers 的兼容性
ES2025 新近落地，旧浏览器 / 运行时需特性检测或 polyfill；降级方案是退回「先 `[...iter]` 成数组再用数组方法」（代价：失去惰性、对无限序列不可用）。
:::

</v-click>

---

# Array.fromAsync：异步可迭代的归宿（ES2024）

`Array.from` 只认同步源。数据来自**异步可迭代对象**时，用 ES2024 的 `Array.fromAsync`，逐个 `await` 并返回 **Promise**：

```js
async function* fetchPages() {
  yield await Promise.resolve(["a", "b"]);
  yield await Promise.resolve(["c"]);
}

await Array.fromAsync(fetchPages()); // [["a","b"], ["c"]]
await Array.fromAsync([Promise.resolve(1)]); // [1]（也等待元素 Promise）
```

---

# Baseline 状态一览（2026-06 核）

| 特性 | 版本 | 状态 |
| --- | --- | --- |
| `map`/`filter`/`reduce`/`flat`/`flatMap` | ES5～2019 | ✅ 广泛可用 |
| 解构 / 扩展 / 生成器 / `Array.from` | ES2015 | ✅ 广泛可用 |
| `at()` | ES2022 | ✅ 广泛可用 |
| `toSorted`/`toReversed`/`with`/`findLast` | ES2023 | ✅ 广泛可用 |
| `Array.fromAsync` | ES2024 | 🟡 新近可用 |
| Iterator Helpers / `Iterator.from` | ES2025 | 🟡 新近可用 |

---

# 全章小结

<v-click>

- **容器**：尾快头慢、`splice` 万能；`slice`（拷贝）vs `splice`（就地）一字之差相反
- **分水岭**：九个变更方法改原数组；ES2023 `toSorted`/`with`/`findLast` 让不可变成一等公民
- **变换**：`map`/`filter`/`reduce` 三支柱，`reduce` 空数组**必传初值**
- **语法糖**：解构按位/按名、默认值仅对 `undefined`；`...` 摊开 vs 收拢，**浅拷贝**
- **抽象**：`Symbol.iterator` 是底层契约；Iterator Helpers（ES2025）惰性驯服无限序列

</v-click>

---
layout: center
class: text-center
---

# 谢谢

理解了可迭代协议，就从「会用数组」升级到了「理解 JS 的迭代体系」

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
