---
theme: seriph
background: https://cover.sli.dev
title: JavaScript 函数与作用域
info: |
  JavaScript 函数与作用域 —— 函数形态、箭头与 this、作用域链与闭包、call/apply/bind、高阶函数
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:javascript class="text-8xl" />
</div>

<br/>

## JavaScript 函数与作用域

把函数当数据，把 `this` 与闭包彻底搞懂（基于现代 JavaScript · ES2025）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
函数是 JavaScript 的核心。理解形态、this、闭包这三条主线，就抓住了函数式风格的全部根基。
-->

---
transition: fade-out
---

# 这一章讲什么

函数是 JavaScript 的「一等公民」——可赋值、可传递、可返回

<v-click>

- **形态**：声明 / 表达式 / 箭头 / IIFE，加上参数三机制
- **箭头 vs 普通**：`this`、`arguments`、`new` 三处关键差异
- **作用域与闭包**：变量如何被「记住」、循环坑、模块模式
- **`this` 四规则**：默认 / 隐式 / 显式 / `new`，以及丢失
- **改写 `this`**：`call` / `apply` / `bind` 与函数借用
- **高阶函数**：柯里化、偏函数、`compose` / `pipe`

</v-click>

---

# 三条主线，常同时起作用

<v-click>

- **函数形态** 决定语法与提升
- **作用域 / 闭包** 决定变量怎么被记住
- **`this`** 决定运行时上下文

</v-click>

<v-click>

```js
function makeCounter() {
  let count = 0;           // 闭包：私有变量
  return () => ++count;    // 箭头：从外层借 this
}
const counter = makeCounter();
counter(); // 1
counter(); // 2 —— 同一闭包，count 持续累加
```

「箭头函数 + 闭包 + 回调」是现代 JS 最常见的组合。

</v-click>

---
layout: section
---

# 函数的多种形态

声明 · 表达式 · 箭头 · IIFE

---

# 声明 vs 表达式：差在「提升」

```js
console.log(a(), b()); // a() 正常；b 抛 ReferenceError

function a() { return "声明：整体提升，可先调用"; }

const b = function () { return "表达式：不提升"; };
```

<v-click>

- **声明**：整个函数被搬到作用域顶部，能「先调用、后定义」
- **表达式**：赋值语句，受 `let` / `const` **暂时性死区**约束，调用前报错

</v-click>

<v-click>

声明适合顶层工具函数；表达式适合**按条件赋值**（声明做不到），或写成命名表达式 `function fac(){…}` 便于自引用与调试。

</v-click>

---

# 箭头函数：精简语法

写法随参数与函数体而变：

```js
const add = (a, b) => a + b; // 单表达式：隐式返回
const square = (x) => x * x; // 单参数可省括号
const greet = () => "Hello"; // 无参：空括号必写
const sum = (a, b) => {
  const s = a + b;
  return s; // 多语句：花括号 + 显式 return
};
```

---

# 箭头返回对象要加括号

::: warning 箭头函数体里的 `{` 会被当成「函数体起始」
直接写对象会语法出错，返回对象字面量必须用圆括号包住：

```js
const makeUser = (name) => ({ name, role: "user" }); // 正确
// const bad = (name) => { name };  // 错：返回 undefined
```
:::

<v-click>

箭头函数的关键语义差异（无 `this` / `arguments`、不能 `new`）后面单独成章。

</v-click>

---

# IIFE：开辟私有作用域

把函数包成表达式，紧跟 `()` 立即执行一次：

```js
const config = (function () {
  const raw = readEnv();   // 私有，外部访问不到
  return Object.freeze({ port: raw.PORT ?? 3000 });
})();
```

<v-click>

::: tip 现代用得越来越少
`var` 时代它是隔离变量的主力；如今 `let` / `const` 块级作用域 + ES 模块已覆盖绝大多数场景。但读老代码、读打包产物仍需理解它。
:::

</v-click>

---

# 参数：默认参数

形参可带默认值，仅在实参为 `undefined`（含不传）时生效：

```js
function multiply(a, b = 1) {
  return a * b;
}
multiply(5);            // 5  （b 取默认 1）
multiply(5, undefined); // 5  （显式 undefined 也触发）
multiply(5, null);      // 0  （null 不触发，0 * null）
```

<v-click>

默认值在调用时求值，且可引用**前面已声明**的参数：`(start, end = start + 10)`。

</v-click>

---

# 参数：剩余 vs arguments

剩余参数 `...args` 把多余实参收成**真正的数组**，必须是最后一个形参：

```js
const multiplyAll = (factor, ...nums) => nums.map((n) => factor * n);
multiplyAll(2, 1, 2, 3); // [2, 4, 6] —— nums 是真数组，可 map
```

<v-click>

老的 `arguments` 是「类数组」——有 `length`、可索引，但**没有** `map` / `forEach`：

| 维度 | 剩余参数 `...args` | `arguments` |
| --- | --- | --- |
| 类型 | 真数组 | 类数组 |
| 反映默认参数 | 是 | 否 |
| 箭头函数里 | 可用 | **不存在** |

现代代码一律用剩余参数取代 `arguments`。

</v-click>

---

# 形态选择速查

| 需求 | 推荐形态 |
| --- | --- |
| 顶层工具函数、需定义前调用 | 函数声明 |
| 按条件 / 运行时决定函数体 | 函数表达式 |
| 回调、不需要自己的 `this` | 箭头函数 |
| 收集不定数量参数 | 剩余参数 `...args` |
| 一次性初始化 + 私有作用域 | IIFE（或块 / 模块） |

<v-click>

⚠️ `new Function("a", "b", "return a+b")` 从字符串造函数——作用域只到全局、有安全与性能问题，日常不用。

</v-click>

---
layout: section
---

# 箭头函数 vs 普通函数

四处关键差异，决定「该用哪个」

---

# 差异一：this 的来源

这是两者**最本质**的区别：

<v-click>

- **普通函数**：`this` 取决于「怎么被调用」（调用时决定）
- **箭头函数**：没有自己的 `this`，从**定义处外层**继承

</v-click>

<v-click>

```js
function Timer() {
  this.seconds = 0;
  setInterval(() => {
    this.seconds++; // 箭头从外层 Timer 继承 this ✅
  }, 1000);
}
```

它正是为取代老式 `const self = this` 样板而生——这是箭头被发明的核心动机之一。

</v-click>

---

# 反例：别拿箭头当对象方法

正因为从「定义处外层」取 `this`，箭头当对象方法会出错：

```js
const counter = {
  count: 0,
  inc: () => {
    this.count++;  // ❌ this 是外层（模块/全局）→ NaN
  },
  dec() {
    this.count--;  // ✅ 普通方法：this 隐式绑定 counter
  },
};
```

<v-click>

对象方法请用普通函数 / 方法简写，让隐式绑定生效。

</v-click>

---

# 差异二：没有 arguments

箭头函数里的 `arguments` 是**外层函数**的，不是自己的：

```js
function outer() {
  const inner = () => arguments[0]; // outer 的 arguments
  return inner();
}
outer("A", "B"); // "A"
```

<v-click>

要收集箭头函数自己的全部实参，用剩余参数：

```js
const sum = (...nums) => nums.reduce((a, b) => a + b, 0);
sum(1, 2, 3); // 6
```

</v-click>

---

# 差异三 & 四：new 与 call

**不能 `new`、没有 `prototype`**：

```js
const Person = (name) => { this.name = name; };
// new Person("Ann"); // TypeError: not a constructor
console.log((() => {}).prototype); // undefined
```

<v-click>

**`call` / `apply` / `bind` 改不动 `this`**（已在定义时锁死）：

```js
const arrow = () => this;
arrow.call({ name: "X" }); // 仍是外层 this，obj 被忽略
```

构造函数、原型方法都必须用普通函数。

</v-click>

---

# 小结对照表

| 特性 | 箭头函数 | 普通函数 |
| --- | --- | --- |
| 自己的 `this` | ❌ 继承外层 | ✅ 调用时决定 |
| `arguments` | ❌ | ✅ |
| 能否 `new` | ❌ | ✅ |
| `prototype` | ❌ | ✅ |
| `call`/`bind` 改 `this` | ❌ 无效 | ✅ 有效 |

<v-click>

适合箭头：回调、数组迭代、定时器 / 事件里访问实例。不适合：对象方法、构造器、需要 `arguments`。

</v-click>

---
layout: section
---

# 作用域链与闭包

变量如何被「记住」并跨越生命周期

---

# 词法作用域 + 作用域链

「词法」= 按源码**书写位置**，可见性在写代码时就定了：

```js
function A(x) {
  function B(y) {
    function C(z) {
      console.log(x + y + z); // x←A、y←B、z←自己
    }
    C(3);
  }
  B(2);
}
A(1); // 6 —— 查找链路 C → B → A → 全局
```

<v-click>

核心规则：**内能看外、外不能看内**；同名变量**内层优先**，到顶仍无则 `ReferenceError`。

</v-click>

---

# 闭包的实现根基

理解闭包「怎么记住变量」需要两个底层概念：

<v-click>

- **词法环境**：内部对象 = 环境记录（存本层变量）+ 对外层环境的引用
- **`[[Environment]]`**：每个函数的隐藏属性，记住它**被创建时**所处的环境

</v-click>

<v-click>

函数「随身携带」创建时的环境引用——即便外层早已执行完，只要内层还活着，外层变量就不会消失。**JS 里所有函数天生都是闭包**。

</v-click>

---

# 闭包：函数 + 它的词法环境

```js
function makeCounter() {
  let count = 0;            // 私有变量，外部不可见
  return function () {
    return count++;         // 读改同一个 count
  };
}
const counter = makeCounter(); // 外层已执行完
counter(); // 0
counter(); // 1 —— count 被「闭住」、持续存活
```

<v-click>

`count` 只能通过返回的函数间接操作——这是闭包做「数据封装」的基础。

</v-click>

---

# 每次调用生成独立闭包

每调用一次外层函数，就新建一份词法环境，多个闭包**互不干扰**：

```js
const c1 = makeCounter();
const c2 = makeCounter();
c1(); // 0
c1(); // 1
c2(); // 0 —— 与 c1 完全独立
```

<v-click>

这就是「函数工厂」的基础——`makeAdder(5)` 与 `makeAdder(10)` 各记各的参数。

</v-click>

---

# 循环里的闭包陷阱

`var` 时整个循环只有**一个**绑定，所有回调闭住同一个变量：

```js
// ❌ var：三个回调共享同一个 i，等执行时循环已结束
for (var i = 0; i < 3; i++) {
  buttons[i].onclick = () => console.log(i); // 全部输出 3
}
```

<v-click>

`let` / `const` 是块级作用域，循环**每轮创建一个新绑定**：

```js
for (let i = 0; i < 3; i++) {
  buttons[i].onclick = () => console.log(i); // 0、1、2 ✅
}
```

现代首选 `let`；工厂、IIFE 等老写法主要用于读懂老代码。

</v-click>

---

# 模块模式：闭包实现私有

把变量藏进闭包、只暴露方法，得到「带私有状态」的模块：

```js
const counter = (function () {
  let count = 0;          // 外部无法直接访问
  return {
    increment() { count++; },
    value() { return count; },
  };
})();
counter.increment();
counter.value(); // 1
```

<v-click>

返回的方法共享同一份词法环境，外界只能通过它们间接读写。

</v-click>

---

# 性能与垃圾回收

闭包引用的外层环境只要可达就**不回收**——是特性，但用不好会浪费内存：

<v-click>

- **别在构造函数里给实例方法**：每 `new` 都重建方法 + 闭包；共享方法挂 `prototype` 只定义一次
- **不用时解除引用**：长期持有的闭包让外层变量一直存活，及时置空让 GC 回收

</v-click>

<v-click>

::: warning V8 调试器的「优化」坑
调试时会优化掉「未被引用」的外层变量，断点处可能看不到——不代表闭包没捕获它。
:::

</v-click>

---
layout: section
---

# this 的四条规则

调用时决定，不在定义时

---

# 核心心法：调用时决定

`this` 不绑定到「定义它的对象」，而在**每次调用现场**计算：

```js
function whoAmI() { return this; }
const obj = { name: "X", whoAmI };

whoAmI();         // 默认绑定
obj.whoAmI();     // 隐式绑定 → obj
whoAmI.call("A"); // 显式绑定 → "A"
new whoAmI();     // new 绑定 → 新对象
```

<v-click>

同一个 `whoAmI`，四种调用方式给出四种 `this`。下面逐条拆解。

</v-click>

---

# 规则一 & 二：默认 / 隐式

**默认绑定**——「光秃秃」独立调用：

```js
"use strict";
function show() { return this; }
show(); // undefined（严格模式）；非严格 → 全局对象
```

<v-click>

**隐式绑定**——`对象.方法()`，`this` 是**点号前的对象**：

```js
const user = { name: "John", sayHi() { return this.name; } };
user.sayHi(); // "John" —— 只看调用现场最后一个点
```

</v-click>

---

# 规则三 & 四：显式 / new

**显式绑定**——`call` / `apply` / `bind` 手动指定 `this`：

```js
function greet() { return `Hi, ${this.name}`; }
greet.call({ name: "Ann" }); // "Hi, Ann"
```

<v-click>

**`new` 绑定**——新建空对象作 `this`，没显式返回对象则自动返回它：

```js
function Person(name) { this.name = name; }
new Person("Ann").name; // "Ann"
```

</v-click>

---

# 优先级总表

从高到低：

| 优先级 | 规则 | 形式 | `this` 指向 |
| --- | --- | --- | --- |
| 1 | `new` 绑定 | `new F()` | 新创建的对象 |
| 2 | 显式绑定 | `f.call(o)` / `f.bind(o)` | 手动指定的 `o` |
| 3 | 隐式绑定 | `obj.f()` | 点号前的 `obj` |
| 4 | 默认绑定 | `f()` | 严格 `undefined` / 非严格全局 |

<v-click>

> 箭头函数不在表内——`this` 取自定义处外层，`call`/`bind`/`new` 都改不动。

</v-click>

---

# 最常见的坑：this 丢失

把方法**取出单独调用**或**当回调传出去**，隐式绑定失效、退回默认（严格模式报错 / 非严格 `"Hi, undefined"`）：

```js
const user = { name: "Ann", greet() { return `Hi, ${this.name}`; } };
const fn = user.greet;
fn();                        // this 丢失
setTimeout(user.greet, 100); // 回调被独立调用，this 不是 user
```

<v-click>

三种修复：

```js
setTimeout(user.greet.bind(user), 100); // 1. bind 永久绑定
setTimeout(() => user.greet(), 100);    // 2. 箭头包一层
[1].forEach(function () {}, user);       // 3. 传 thisArg
```

类方法当回调：构造函数里 `this.h = this.h.bind(this)`，或类字段 `h = () => {}`。

</v-click>

---
layout: section
---

# call / apply / bind

显式绑定的三种姿势

---

# 三者总览

都用来**手动把 `this` 指给某个对象**，区别在「立即还是延后」「参数怎么传」：

```js
function introduce(greeting, mark) {
  return `${greeting}，我是 ${this.name}${mark}`;
}
const user = { name: "小明" };

introduce.call(user, "你好", "！");    // 立即，逗号分隔
introduce.apply(user, ["你好", "！"]); // 立即，参数装数组
const bound = introduce.bind(user);    // 返回新函数
```

<v-click>

记忆：**c**all = **c**omma、**a**pply = **a**rray、**b**ind = **b**ound later。

</v-click>

---

# call 与 apply：立即调用

两者都立即调用、首参都是 `thisArg`，唯一区别是**参数装不装数组**：

```js
greet.call({ name: "Bob" }, "x", "y");   // 参数逗号分隔
greet.apply({ name: "Bob" }, ["x", "y"]); // 参数装数组
```

<v-click>

`apply` 在参数本就在数组里时顺手，如借 `Math.max` 求数组最大值：

```js
Math.max.apply(null, [5, 6, 2, 3, 7]); // 7
Math.max(...[5, 6, 2, 3, 7]);          // 7 —— 现代用展开更直观
```

</v-click>

---

# bind：返回永久绑定的新函数

`bind` **不立即调用**，返回一个 `this` 被永久固定的新函数：

```js
const boundGreet = user.greet.bind(user);
boundGreet(); // "Hi, Ann"
setTimeout(boundGreet, 1000); // 1 秒后仍是 "Hi, Ann"
```

<v-click>

::: warning bind 一次即定，不可再改
再 `call` / `apply` / `bind` 都改不了它的 `this`（只能继续传参）。唯一能盖过的是 `new`。
:::

</v-click>

---

# 函数借用

`call` / `apply` 让一个对象「借用」另一个对象的方法，无需继承：

```js
const dog = { name: "旺财", speak() { return `${this.name} 汪汪`; } };
const cat = { name: "咪咪" };
dog.speak.call(cat); // "咪咪 汪汪" —— cat 借用 dog 的 speak
```

<v-click>

经典场景：让**类数组**借用真正的 `Array` 方法。现代写法更易读：

```js
Array.from(arguments);  // 或 [...arguments]
// 优于 Array.prototype.slice.call(arguments)
```

</v-click>

---

# 偏函数：bind 预填参数

`bind` 除固定 `this`，还能**预填前几个参数**，得到「参数更少」的新函数：

```js
function multiply(a, b) { return a * b; }

const double = multiply.bind(null, 2); // 固定 a = 2
double(5); // 10  —— 等价 multiply(2, 5)
double(8); // 16
```

<v-click>

预填的参数排在最前，调用时新传的依次接在后面——这就是偏函数。

</v-click>

---

# 三者对比速查

| 方法 | 立即调用 | 参数形式 | 返回 |
| --- | --- | --- | --- |
| `call` | 是 | 逗号分隔 | 函数执行结果 |
| `apply` | 是 | 数组 | 函数执行结果 |
| `bind` | 否 | 逗号（可预填） | `this` 永久绑定的新函数 |

<v-click>

`call` / `apply` 是「现在就调用、顺便指定 `this`」；`bind` 是「先做一个固定好 `this` 的函数，以后再调」。

</v-click>

---
layout: section
---

# 高阶函数

把函数当数据来加工

---

# 什么是高阶函数

**接收函数作参数** 或 **返回一个函数** 的函数，就叫高阶函数：

```js
// ① 接收函数作参数
function repeat(n, action) {
  for (let i = 0; i < n; i++) action(i);
}
// ② 返回函数
const multiplier = (factor) => (n) => n * factor; // 闭包记住 factor
multiplier(3)(5); // 15
```

<v-click>

最常用的 HOF 是数组内置方法——`map` / `filter` / `reduce` 都接收回调。

</v-click>

---

# 柯里化

把 `f(a, b, c)` 改造成 `f(a)(b)(c)`，每次只收一个参数：

```js
const addC = (a) => (b) => (c) => a + b + c;
addC(1)(2)(3); // 6
```

<v-click>

价值在「**先固定一部分、稍后复用**」：

```js
const add10 = addC(10);     // 固定 a = 10
const add10and5 = add10(5); // 再固定 b = 5
add10and5(1); // 16
```

</v-click>

---

# 偏函数 & 与柯里化对比

**偏函数**预先固定**部分**参数，得到参数更少的新函数：

```js
function partial(fn, ...fixed) {
  return (...rest) => fn(...fixed, ...rest); // 闭包记住 fixed
}
const sayHi = partial((g, n) => `${g}, ${n}!`, "Hi");
sayHi("Ann"); // "Hi, Ann!"
```

<v-click>

| 维度 | 柯里化 | 偏函数 |
| --- | --- | --- |
| 每次收参数 | 一个 | 任意个 |
| 调用形式 | `f(a)(b)(c)` 链式 | `g(剩余)` 一次补齐 |
| 目的 | 多参拆单参链 | 预填部分、降元数 |

</v-click>

---

# 函数组合：compose 与 pipe

把多个「单输入单输出」小函数拼成流水线，两种方向：

```js
const compose = (...fns) => (x) =>
  fns.reduceRight((acc, fn) => fn(acc), x); // 右→左

const pipe = (...fns) => (x) =>
  fns.reduce((acc, fn) => fn(acc), x);      // 左→右
```

<v-click>

- `compose(f, g, h)(x)` = `f(g(h(x)))`
- `pipe(f, g, h)(x)` = `h(g(f(x)))`——更贴近阅读顺序

</v-click>

---

# 组合让数据处理声明式

把「做什么」拆成命名清晰的小步骤，再拼起来：

```js
const clean = pipe(
  (s) => s.trim(),
  (s) => s.toLowerCase(),
  (s) => s.replace(/\s+/g, "-")
);
clean("  Hello World  "); // "hello-world"
```

<v-click>

柯里化、偏函数、组合返回的函数，无一例外靠**闭包**记住已固定的参数——它们只是闭包的不同应用姿势。

</v-click>

---

# 别为了函数式而函数式

::: warning 优先保证直观
高阶函数提升复用与可读性，但层层 `compose` / 深度柯里化也会让调用栈变深、调试变难、新人难读。
:::

<v-click>

简单逻辑直接写循环 / 内置数组方法，比强行组合更清晰——在团队代码里，**直观** 优先。

</v-click>

---

# 全章最佳实践小结

<v-click>

- 形态：声明能提升、表达式按条件、箭头做回调、剩余参数收实参
- 箭头不参与 `this` 四规则——别当对象方法 / 构造器
- 闭包记住外层变量；循环坑用 `let` 解，私有状态用模块模式
- `this` 看「谁在调用」；方法当回调先 `bind` 防丢失
- `call`（逗号）/ `apply`（数组）立即调用，`bind` 返回新函数
- HOF 把函数当数据：柯里化、偏函数、`compose` / `pipe` 全靠闭包

</v-click>

---
layout: center
class: text-center
---

# 谢谢

把函数形态、`this`、闭包这三条主线吃透，JavaScript 的函数式风格就尽在掌握

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
