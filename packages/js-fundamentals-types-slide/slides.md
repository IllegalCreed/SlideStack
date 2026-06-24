---
theme: seriph
background: https://cover.sli.dev
title: JavaScript 语言基础与类型系统
info: |
  JavaScript 语言基础 —— 变量声明、原始类型、类型转换、运算符、控制流、严格模式
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:javascript class="text-8xl" />
</div>

<br/>

## JavaScript 语言基础与类型系统

弱类型的「默认安全」写法：const、原始类型、相等、运算符（基于 ES2025）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
弱类型不等于随意。现代 JavaScript 有一套「默认安全」的写法：const 优先、=== 优先、显式转换优先。这一章就把这套默认讲透。
-->

---
transition: fade-out
---

# 这一章讲什么

JavaScript 的值、声明、转换与运算——「默认安全」的那套写法

<v-click>

- **声明**：`const` / `let` / `var`、提升、TDZ、循环闭包坑
- **类型**：7 原始类型 + 对象、包装对象、`typeof null`
- **转换与相等**：truthy/falsy、`==` vs `===`、`Object.is`、`NaN`
- **运算符**：`**` / `?.` / `??` / 位运算 / 短路
- **控制流**：`for...of` vs `for...in`、strict mode、ASI

</v-click>

<v-click>

> 主线：`const` 优先、`===` 优先、显式转换优先——其余写法不是不能用，而是**没明确理由时不该用**。

</v-click>

---
layout: section
---

# 变量声明

`const` / `let` / `var`，以及提升与 TDZ

---

# 三种声明一览

| 特性 | `var` | `let` | `const` |
| --- | --- | --- | --- |
| 作用域 | 函数 / 全局 | 块 `{}` | 块 `{}` |
| 提升后初值 | `undefined` | TDZ | TDZ |
| 可重复声明 | ✅ | ❌ | ❌ |
| 可重新赋值 | ✅ | ✅ | ❌ |
| 必须初始化 | ❌ | ❌ | ✅ |

<v-click>

默认 `const`，需重新赋值才 `let`，**新代码不用 `var`**。

</v-click>

---

# const：默认选择

```js
const PI = 3.14159;
PI = 3; // ❌ TypeError: Assignment to constant variable
const x; // ❌ SyntaxError: Missing initializer
```

<v-click>

`const` 锁的是**「名字到值的绑定」**，不是值本身——对象 / 数组内容照样能改：

```js
const user = { name: "Ada" };
user.name = "Grace"; // ✅ 改内容
user = {}; // ❌ TypeError：这才是重新赋值绑定
```

</v-click>

---

# var 的两个坑

`var` 是函数作用域，无视 `if` / `for` 这些块：

```js
function f() {
  if (true) {
    var x = 10; // 看似在 if 块里
  }
  console.log(x); // 10 —— var 泄漏到整个函数
}
```

<v-click>

而且**可重复声明**会悄悄覆盖：`var n = 1; var n = 2;` 不报错。大型文件里极易误伤——所以现代代码统一 `let` / `const`。

</v-click>

---

# 提升：var 给 undefined

「提升」指声明在编译阶段被「提到」作用域顶部。三种声明都提升，但行为不同。

```js
console.log(x); // undefined —— 不报错
var x = 3;
console.log(x); // 3
```

<v-click>

这种「能访问但是 `undefined`」最坑：让人误以为变量没问题，实则是逻辑漏洞——下面看 `let` / `const` 如何改进。

</v-click>

---

# TDZ：let / const 的暂时性死区

`let` / `const` 也提升，但提升后**不初始化**——声明前访问直接抛错：

```js
console.log(y); // ❌ ReferenceError: Cannot access 'y' before initialization
let y = 3;
```

<v-click>

从块开始到声明语句之间就是**暂时性死区（TDZ）**。注意它和「变量不存在」不同：

```js
typeof undeclared; // "undefined"（不存在，安全）
typeof inTDZ; // ❌ ReferenceError（在 TDZ 里）
let inTDZ = 1;
```

</v-click>

---

# 经典坑：循环里的 var vs let

面试与实战都高频。`var` 时整个循环**共享同一个变量**：

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));
}
// 输出：3 3 3 —— i 是同一个，循环结束已是 3
```

<v-click>

`let` 在每轮迭代**新建独立绑定**，闭包各自捕获那一轮的值：

```js
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j));
}
// 输出：0 1 2
```

</v-click>

---

# 别隐式创建全局变量

不带关键字直接赋值，**非严格模式**会创建全局变量——事故源头：

```js
function bad() {
  leaked = 10; // 非严格：创建全局 leaked！严格：ReferenceError
}
```

<v-click>

::: tip 一条规则覆盖
养成「任何变量都先 `const` / `let` 声明」的习惯即可彻底避免。命名以字母 / `_` / `$` 开头，区分大小写，不能用保留字。
:::

</v-click>

---
layout: section
---

# 原始类型与包装对象

7 种原始类型 + 对象，以及 `typeof null` 之谜

---

# 8 种数据类型

| 类型 | 示例 | 说明 |
| --- | --- | --- |
| `string` | `"hi"` | 文本，不可变 |
| `number` | `42` / `NaN` | IEEE 754 双精度浮点 |
| `bigint` | `123n` | 任意精度整数（ES2020） |
| `boolean` | `true` | 逻辑真假 |
| `undefined` | `undefined` | 未赋值 |
| `symbol` | `Symbol("id")` | 唯一标识（ES2015） |
| `null` / `object` | `null` / `{}` | 空 / 唯一的非原始类型 |

---

# 原始值 vs 对象

- **原始值**（7 种）：**不可变**、按**值**比较
- **对象**（其余一切）：**可变**、按**引用**比较

```js
let a = "hi", b = "hi";
console.log(a === b); // true（值相同即相等）

let o1 = { x: 1 }, o2 = { x: 1 };
console.log(o1 === o2); // false（两个不同对象）
```

<v-click>

「不可变」指值本身改不了——字符串方法都返回**新串**，从不改原值。

</v-click>

---

# number：整数小数共用一种

JavaScript **只有一种**数字类型：IEEE 754 双精度 64 位浮点。

```js
const hex = 0xff; // 255（十六进制）
const bin = 0b1010; // 10（二进制）
const million = 1_000_000; // 数字分隔符（ES2021，仅可读性）
```

<v-click>

三个特殊值要记牢：

```js
1 / 0; // Infinity
0 / 0; // NaN（Not a Number）
Number("abc"); // NaN（转换失败）
```

</v-click>

---

# 浮点精度与安全整数

浮点数无法精确表示所有小数：

```js
0.1 + 0.2; // 0.30000000000000004
0.1 + 0.2 === 0.3; // false
```

<v-click>

比较小数用容差（`Math.abs(a - b) < Number.EPSILON`）或整数化（金额用「分」）。整数超过 `Number.MAX_SAFE_INTEGER`（2^53 − 1）后失精：

```js
9007199254740991 + 2; // ...992 ❌（应为 ...993）
```

</v-click>

---

# bigint：任意精度整数

整数字面量加 `n` 后缀，可表示超过安全整数范围的大数：

```js
const big = 9007199254740993n;
big + 1n; // 9007199254740994n（精确）
```

<v-click>

关键限制：`bigint` 与 `number` **不能混算**，但**可以比较**：

```js
1n + 1; // ❌ TypeError: Cannot mix BigInt and other types
2n > 1; // true（比较允许）
2n === 2; // false（=== 看类型）
2n == 2; // true（== 做数学比较）
```

</v-click>

---

# null vs undefined

`undefined` 是系统默认「未赋值」，`null` 是开发者主动「置空」。

| | `undefined` | `null` |
| --- | --- | --- |
| 含义 | 未赋值 | 主动置空 |
| `typeof` | `"undefined"` | `"object"`（Bug） |
| `==` 互比 | `null == undefined` → `true` | 同左 |
| `===` 互比 | `null === undefined` → `false` | 同左 |

---

# typeof null === "object"

必须背下来的怪癖：源于 JavaScript 第一版实现，因兼容性**永远无法修复**。

```js
typeof null; // "object" ← 不是 "null"，别被骗
const v = null;
v === null; // true ← 判断 null 的正确做法
```

<v-click>

`typeof` 其余速记：函数 → `"function"`，数组 → `"object"`（判断数组用 `Array.isArray()`），其余原始类型如实返回。

</v-click>

---

# 包装对象与自动装箱

原始值没属性，却能 `"abc".toUpperCase()`——引擎**临时装箱**成包装对象，用完即弃：

```js
"hello".length; // 5（内部约等于 new String("hello").length）
(255).toString(16); // "ff"
```

<v-click>

::: warning 不要手动 new 包装对象
`new String("x")` 得到的是**对象**而非原始值，破坏 `typeof` 与 `===`：

```js
typeof new String("x"); // "object"（不是 "string"）
```

需要转换用**不带 `new`** 的 `String(x)` / `Number(x)` / `Boolean(x)`。
:::

</v-click>

---
layout: section
---

# 类型转换与相等比较

最容易出 Bug 的环节：truthy/falsy、`==` vs `===`

---

# 三种显式转换

弱类型里，**显式转换永远优于隐式**。三个全局函数（不带 `new`）是首选：

```js
Number("42"); // 42
String(true); // "true"
Boolean(1); // true
```

<v-click>

简写等价：`+x` 等价 `Number(x)`；`"" + x` 等价 `String(x)`；`!!x` 等价 `Boolean(x)`。

</v-click>

---

# Number() 的边界值要记牢

```js
Number(""); // 0 ← 空串是 0，不是 NaN！
Number("  "); // 0 ← 纯空白也是 0
Number("12px"); // NaN ← 含非数字字符即失败
Number(null); // 0 ← 注意
Number(undefined); // NaN ← 与 null 不同
```

<v-click>

`parseInt` / `parseFloat` 容忍前缀，从头解析到第一个非法字符为止——**一定带 radix**：

```js
parseInt("12px", 10); // 12（Number 会得 NaN）
```

</v-click>

---

# truthy / falsy：只有 8 个 falsy

布尔上下文里只有这 8 个值为假，**其余一切皆 truthy**：

| falsy | falsy |
| --- | --- |
| `false` | `null` |
| `0` | `undefined` |
| `-0` | `NaN` |
| `0n` | `""` |

<v-click>

最常踩：`"0"` / `[]` / `{}` **都是 truthy**！判断数组空不空用 `arr.length === 0`。

</v-click>

---

# 加号 + 的双重身份

`+` 是唯一会「转字符串」的算术运算符：**任一侧是字符串就拼接**，否则转数字相加：

```js
1 + 2; // 3（都是数字）
"1" + 2; // "12"（有字符串 → 拼接）
1 + 2 + "3"; // "33"（从左到右：1+2=3，再 3+"3"）
```

<v-click>

其余算术（`-` `*` `/` `%` `**`）**一律转数字**，不碰拼接：

```js
"37" - 7; // 30
"6" / "2"; // 3
"abc" - 1; // NaN
```

</v-click>

---

# 四套相等算法

JavaScript 有四种判断「相等」的方式，行为各异：

| x / y | `==` | `===` | `Object.is` |
| --- | --- | --- | --- |
| `NaN` / `NaN` | ❌ | ❌ | ✅ |
| `+0` / `-0` | ✅ | ✅ | ❌ |
| `null` / `undefined` | ✅ | ❌ | ❌ |
| `"0"` / `0` | ✅ | ❌ | ❌ |

<v-click>

默认用 `===`：不转换、可预测、也更快。

</v-click>

---

# === 默认，== 是陷阱

`===` 不做类型转换，类型不同直接 `false`：

```js
1 === "1"; // false
NaN === NaN; // false ← 唯一让 x !== x 成立
+0 === -0; // true ← === 不区分正负零
```

<v-click>

`==` 先隐式转换，是无数「反直觉为真」的源头：

```js
"" == 0; // true（"" → 0）
"0" == 0; // true
false == ""; // true（都 → 0）
```

</v-click>

---

# `[] == ![]` 为什么是 true

`==` 最著名的「鬼畜」案例，逐步拆解：

<v-click>

1. `![]` 先算——`[]` 是 truthy，取反得 `false`
2. 变成 `[] == false`
3. 布尔 `false` 转数字 `0` → `[] == 0`
4. `[]` 转原始值：`[].toString()` 得 `""`，`Number("")` 得 `0` → `0 == 0`
5. 结果 `true`

</v-click>

<v-click>

记不住没关系——**结论就是「别用 `==`」**，用 `===` 这类问题根本不存在。

</v-click>

---

# == 唯一值得用的场景

```js
x == null; // 等价 x === null || x === undefined
```

<v-click>

`x == null` 可同时判断 `null` 和 `undefined`，这是 `==` 唯一推荐用法，其余一律 `===`。

</v-click>

<v-click>

::: tip Object.is 极少用
与 `===` 几乎一样，只在两处不同：`Object.is(NaN, NaN)` → `true`、`Object.is(+0, -0)` → `false`。仅元编程时需要。
:::

</v-click>

---

# 检测 NaN：用 Number.isNaN

`NaN` 是唯一「不等于自身」的值，所以**不能** `=== NaN` 检测：

```js
Number.isNaN(NaN); // true ← 推荐：只对真正的 NaN 返回 true
Number.isNaN("abc"); // false
```

<v-click>

::: warning 别用全局 isNaN
全局 `isNaN()` 会**先做类型转换**，把一切「转不成数字」的值都判为 `NaN`，极易误报：

```js
isNaN("abc"); // true ← 先 Number("abc")=NaN，误判！
```

永远用 `Number.isNaN()`（ES2015）。
:::

</v-click>

---
layout: section
---

# 运算符全谱

`**` / `?.` / `??` / 位运算 / 短路求值

---

# 指数运算符 **（ES2016）

`a ** b` 即 a 的 b 次方，**右结合**：

```js
2 ** 10; // 1024
2 ** -1; // 0.5
2 ** 3 ** 2; // 512（右结合：先 3**2=9，再 2**9）
```

<v-click>

负数底数需加括号：`(-2) ** 2 === 4`；而 `-2 ** 2` 是**语法错误**。

</v-click>

---

# 逻辑赋值（ES2021）

`&&=` / `||=` / `??=` 把逻辑运算与赋值合并，且**带短路**——仅在需要时才赋值：

```js
let a = 0;
a ||= 5; // a 为 falsy → 赋值，a = 5
a &&= 9; // a 为 truthy → 赋值，a = 9

let c = 0;
c ??= 10; // c 是 0（非 nullish）→ 不赋值，c 仍是 0
```

<v-click>

`x ??= y` 等价 `x ?? (x = y)`——常用于「只在没设置过时给默认」。

</v-click>

---

# 逻辑运算符：返回操作数 + 短路

关键认知：`&&` / `||` **返回操作数本身，不一定是布尔**，并且**短路求值**。

```js
"Cat" && "Dog"; // "Dog"（前者真 → 返回后者）
0 && "Dog"; // 0（前者假 → 短路，"Dog" 不执行）
null && fn(); // null（fn 不会被调用——短路防副作用）
```

<v-click>

```js
"" || "默认名"; // "默认名"（前者假 → 返回后者）
0 || 100; // 100 ← 但若 0 是合法值，这就错了！该用 ??
```

</v-click>

---

# ?? 空值合并（ES2020）

`a ?? b`：**仅当 `a` 是 `null` / `undefined`** 时返回 `b`。

```js
0 ?? "默认"; // 0 ←（|| 会得 "默认"，?? 保留 0）
"" ?? "默认"; // ""（保留空串）
null ?? "默认"; // "默认"
```

<v-click>

这是它与 `||` 的本质区别——`||` 对**一切 falsy** 兜底，`??` 只认「空」：

```js
const port = config.port ?? 3000; // 0 是合法端口时用 ??
```

</v-click>

---

# ?. 可选链（ES2020）

`a?.b`：若 `a` 是 `null` / `undefined` 则**短路**返回 `undefined`，不抛 `TypeError`：

```js
const user = { profile: { name: "Ada" } };
user?.address?.city; // undefined（address 不存在，短路，不报错）
user.save?.(); // undefined（方法不存在则不调用）
```

<v-click>

::: tip 常配空值合并
`a?.b ?? 默认值` 是高频组合：先安全取值，取不到再兜底。

```js
const city = user?.address?.city ?? "未知";
```
:::

</v-click>

---

# ?? 不能与 || / && 裸混用

为避免歧义，`??` 与 `||` 或 `&&` 不加括号写在一起是**语法错误**：

```js
a || b ?? c; // ❌ SyntaxError
(a || b) ?? c; // ✅ 必须显式加括号
```

<v-click>

::: warning 拿不准就加括号
优先级大致：`**` > `* / %` > `+ -` > 比较 > `&&` > `||` / `??` > `? :` > `=`。不确定时**加括号**——可读性永远比省字符重要。
:::

</v-click>

---

# 位运算符

操作数先转成 **32 位有符号整数**，逐位运算：

```js
15 & 9; // 9   按位与
15 | 9; // 15  按位或
15 ^ 9; // 6   按位异或
~15; // -16    按位非，~x === -x - 1
9 << 2; // 36  左移（×2^2）
19 >>> 2; // 4 无符号右移（高位补 0）
```

<v-click>

要点：`>>>`（无符号右移）**对 BigInt 无定义**（BigInt 无固定位宽）。

</v-click>

---
layout: section
---

# 控制流与循环

`for...of` vs `for...in`，以及 switch 穿透

---

# switch：严格相等 + 防穿透

`switch` 用 **`===`** 匹配 `case`，因此 `case "1"` 不会匹配数字 `1`：

```js
switch (fruit) {
  case "apple":
    console.log("苹果");
    break; // ← 必须 break，否则穿透到下一个 case
  default:
    console.log("未知");
}
```

<v-click>

漏写 `break` 会「掉落」到下一个 `case`——多数是 Bug，但能**有意利用**做多值合并。

</v-click>

---

# 三种基础循环

| 循环 | 时机 | 特点 |
| --- | --- | --- |
| `for` | 次数已知 | 初始化 / 条件 / 迭代三段 |
| `while` | 先判断 | 条件不满足一次都不跑 |
| `do...while` | 先执行 | **至少跑一次** |

<v-click>

`for` 计数器**务必用 `let`**（见前面的闭包陷阱）；`for (;;)` 是无限循环。

</v-click>

---

# for...of —— 遍历「值」

遍历**可迭代对象**（数组 / 字符串 / Set / Map）的**元素值**，**遍历数组首选**：

```js
for (const item of ["a", "b", "c"]) {
  console.log(item); // "a" "b" "c"（拿到的是值）
}
```

<v-click>

需要索引时配 `entries()`：

```js
for (const [i, val] of ["a", "b"].entries()) {
  console.log(i, val); // 0 "a" / 1 "b"
}
```

</v-click>

---

# for...in —— 遍历「键名」

遍历对象的**可枚举属性名**，**含原型链继承的属性**。为**对象**设计：

```js
for (const key in { x: 1, y: 2 }) {
  console.log(key); // "x" "y"（拿到的是键名）
}
```

<v-click>

::: warning 别用 for...in 遍历数组
拿到的是**字符串下标**、**不保证顺序**、还会**遍历到继承 / 自定义属性**：

```js
const arr = ["a", "b"];
arr.extra = "X";
for (const i in arr) console.log(i); // "0" "1" "extra" ← 多出来了！
```
:::

</v-click>

---

# 三者速记 + 标签

| 写法 | 拿到什么 | 用途 |
| --- | --- | --- |
| `for...of` | **值** | 数组 / 字符串 / Set |
| `for...in` | **键名（含继承）** | 对象（勿用于数组） |
| `Object.entries` + `for...of` | **[键, 值]** | 安全遍历对象自有属性 |

<v-click>

嵌套循环跳多层用**标签**：`outer:` + `break outer` / `continue outer`，但别滥用。

</v-click>

---
layout: section
---

# 严格模式与历史怪癖

`"use strict"`、`this`、ASI 自动分号插入

---

# 如何开启严格模式

放在**脚本顶部**或**函数体首行**：

```js
"use strict"; // 整个脚本严格
mistyped = 17; // ❌ ReferenceError: mistyped is not defined
```

<v-click>

::: tip module / class 默认严格
**ES module**（`.mjs` / 打包产物）和 **`class` 体**内部默认严格，无需手写——这正是「现代 JavaScript 天然更安全」的原因。
:::

</v-click>

---

# 严格模式收紧了什么

把一批「悄悄失败」变成「立即报错」：

<v-click>

- 给未声明变量赋值 → `ReferenceError`
- 给只读 / 冻结对象属性赋值 → `TypeError`（非严格静默失败）
- 删除不可删除属性、重复形参名 → 报错
- 旧式八进制 `0644` 被禁（写 `0o644`）；`with` 被禁

</v-click>

<v-click>

```js
const frozen = Object.freeze({ a: 1 });
frozen.a = 9; // ❌ TypeError（非严格：静默失败）
```

</v-click>

---

# this 在普通调用里是 undefined

非严格下普通调用的 `this` 指向全局对象（`window`）；严格下是 `undefined`——避免污染全局：

```js
"use strict";
function fn() {
  return this;
}
fn(); // undefined（非严格：window / globalThis）
fn.call(42); // 42（显式 this 不再被包装成对象）
```

<v-click>

`eval` 也获得独立作用域，不再向外泄漏变量；`arguments` 不再与具名参数联动。

</v-click>

---

# 历史怪癖：两个必背

即便在严格模式，这些**语言层面的包袱**依旧存在：

```js
typeof null; // "object" ← 不是 "null"，判断用 === null
NaN === NaN; // false ← 检测用 Number.isNaN
```

<v-click>

这两个是 JavaScript 自第一版遗留、因兼容性**永不修复**的坑——背下来即可。

</v-click>

---

# ASI：自动分号插入

引擎在解析出错时「自动补分号」，少数情况会**改变语义**。最坑是 `return` 后换行：

```js
function bad() {
  return; // ← ASI 在此补了分号！
  { ok: 1 }; // 永远不会被返回
}
bad(); // undefined
```

<v-click>

`return` 的左花括号必须**紧跟同一行**。下一行以 `(` / `[` / `` ` `` 开头也会与上行连成一句。

</v-click>

---

# ASI 的实用结论

两种风格都能写对，但要二选一并贯彻：

<v-click>

1. **全程写分号**（Prettier 默认）——彻底规避 ASI 歧义
2. **无分号风格**——必须给 `(` / `[` / `` ` `` 开头的行前置分号，且 `return` 不能换行

</v-click>

<v-click>

::: tip 交给工具
无论哪种，都交给 **Prettier / ESLint** 自动处理，别靠手动记忆。
:::

</v-click>

---

# 最佳实践小结

<v-click>

- 声明：默认 `const`、需改才 `let`、**不用 `var`**（块作用域 + TDZ 更可预测）
- 类型：7 原始 + 对象；`typeof null === "object"`、`NaN !== NaN` 是永恒的坑
- 相等：默认 `===`；`==` 只在 `x == null` 时偶用；检测 `NaN` 用 `Number.isNaN`
- 转换：显式 `Number` / `String` / `Boolean`；falsy 只有 8 个（`"0"` / `[]` / `{}` 是真）
- 运算符：`??` / `?.` 简洁安全，`??` 不与 `||` 裸混；遍历数组 `for...of`、对象 `for...in`
- module / class 默认严格——把「悄悄失败」变「立即报错」

</v-click>

---
layout: center
class: text-center
---

# 谢谢

`const` 优先、`===` 优先、显式转换优先——把这套「默认安全」刻进肌肉记忆，弱类型也能写得稳

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
