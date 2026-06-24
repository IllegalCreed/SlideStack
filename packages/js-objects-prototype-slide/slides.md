---
theme: seriph
background: https://cover.sli.dev
title: JavaScript 对象与原型继承
info: |
  JavaScript 对象模型 —— 字面量、属性描述符、引用与拷贝、原型链、寄生组合继承、Object 工具箱
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:javascript class="text-8xl" />
</div>

<br/>

## JavaScript 对象与原型继承

没有「类」，只有对象——一切都靠 `[[Prototype]]` 串起来（基于 ES2025）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
其他语言里「类是蓝图、对象是产品」；JavaScript 里只有对象，一个对象通过 [[Prototype]] 指向另一个对象来借用属性和方法。理解这一点，后面所有看似奇怪的行为都顺理成章。
-->

---
transition: fade-out
---

# 这一章讲什么

JavaScript 的对象模型，六块拼图

<v-click>

- **对象基础**：字面量、属性访问、`in`、`delete`、计算属性名
- **属性描述符**：三个开关、getter/setter、`freeze` / `seal`
- **引用与拷贝**：值 vs 引用、浅深拷贝、`structuredClone`、循环引用
- **原型链**：`[[Prototype]]`、`Object.create`、`__proto__` vs prototype、属性遮蔽
- **原型继承**：寄生组合、`class` / `extends` / `super`
- **Object 工具箱**：`keys` / `values` / `entries` / `assign` / `hasOwn`

</v-click>

<v-click>

> 主线：JavaScript 没有真正的「类」，`class` 只是原型机制的语法糖。

</v-click>

---
layout: section
---

# 一、对象基础

字面量、属性访问、`in`、`delete`、计算属性名

---

# 对象字面量与键的本质

```js
const car = {
  make: "Ford", // 标识符键
  "model name": "Mustang", // 含空格，必须加引号
  2: "two", // 数字字面量键
  engine: { cylinders: 4 }, // 值可嵌套
};
```

<v-click>

底层规则只有一条：**键只能是字符串或 Symbol**，其余类型都转成字符串——`2` 这个键实际是 `"2"`。每写一次字面量就新建一个不同的对象。

</v-click>

---

# 点号 vs 方括号

```js
car.make = "Ford"; // 点号：键是合法标识符
const key = "make";
console.log(car[key]); // "Ford"（动态键只能用方括号）
```

<v-click>

点号**不能**用于：含空格 / 连字符的键、数字开头的键、「键存在变量里」的情形——这些一律用方括号。

</v-click>

<v-click>

```js
const str = "myString";
const o = { [str]: 1 };
console.log(o.str); // undefined —— o.str 找的是字面键 "str"
console.log(o[str]); // 1 —— 用变量 str 的值当键
```

</v-click>

---

# 不存在的属性 → `undefined`，用 `in` 检测

访问不存在的属性返回 `undefined`，不是报错、也不是 `null`：

```js
console.log(car.color); // undefined
```

<v-click>

键存在但值恰好是 `undefined` 时无法区分——这正是 `in` 的用武之地（含原型链）：

```js
const o = { a: 5 };
console.log("a" in o); // true
console.log("toString" in o); // true —— 继承自 Object.prototype
```

只想知道是不是自有属性 → 用 `Object.hasOwn(o, "a")`。

</v-click>

---

# `delete`：删除自有属性

```js
const o = { a: 5, b: 12 };
delete o.a;
console.log("a" in o); // false（真正移除键，非设为 undefined）
```

<v-click>

只能删**自有属性**，删不掉从原型链继承来的。

</v-click>

<v-click>

::: warning 对象注入风险
用**外部不可信输入**拼方括号键名（`obj[userInput] = v`）很危险——`userInput` 若为 `__proto__` / `constructor` 可污染原型。防御：校验键名白名单，或改用 `Map`。
:::

</v-click>

---

# 计算属性名 · 简写 · 方法

```js
const prefix = "user";
const x = 1, y = 2;
const o = {
  [prefix]: "Ada", // 计算属性名：键为 "user"
  [`${prefix}-42`]: true, // 配模板字符串：键为 "user-42"
  x, y, // 简写：≡ x: x, y: y
  greet() {}, // 方法简写：≡ greet: function () {}
};
```

<v-click>

计算属性名用方括号包表达式（求值后转字符串作键）；值来自同名变量用简写；定义方法省去 `: function`。

</v-click>

---

# `this`：指向「点号前的对象」

`this` 由**调用方式**决定，而非定义位置：

```js
function sayHi() { console.log(`Hi, I'm ${this.name}`); }
const a = { name: "Ada" };
const b = { name: "Bob" };
a.sayHi = sayHi;
b.sayHi = sayHi;
a.sayHi(); // Hi, I'm Ada
b.sayHi(); // Hi, I'm Bob
```

<v-click>

把 `this` 理解成「隐藏参数」——谁在它前面点它，它就是谁。

</v-click>

---
layout: section
---

# 二、属性描述符

三个开关、getter/setter、freeze / seal

---

# 属性 = 值 + 三个开关

你写 `o.a = 1` 时，引擎还给这个属性配了三个标志：

<v-click>

- **`writable`**：值能否被重新赋值
- **`enumerable`**：能否出现在 `for...in` / `Object.keys`
- **`configurable`**：能否被删除、标志能否再改

</v-click>

<v-click>

```js
const user = { name: "John" };
console.log(Object.getOwnPropertyDescriptor(user, "name"));
// { value: "John", writable: true, enumerable: true, configurable: true }
```

普通赋值建的属性，三标志默认**全 `true`**——这就是平时感觉不到它们的原因。

</v-click>

---

# 两套不同的默认值

::: warning defineProperty 最常见的「坑」
- **普通赋值**（`o.a = 1`）建的属性，三标志默认 `true`
- **`Object.defineProperty`** 建新属性时，没写的标志默认 `false`
:::

```js
const o = {};
Object.defineProperty(o, "name", { value: "John" }); // 三标志全 false
console.log(Object.keys(o)); // []（enumerable 默认 false，枚举不到）
```

<v-click>

`writable: false` 改值在严格模式报 `TypeError`、非严格静默失败；`enumerable: false` 让属性枚举时「隐身」——内置 `toString` / `hasOwnProperty` 正是靠它不出现在 `for...in`。

</v-click>

---

# `configurable: false` —— 单向锁死

一条**不可逆的单行道**：一旦设上，不能删、不能再改标志。

```js
const user = { name: "John" };
Object.defineProperty(user, "name", { configurable: false });

user.name = "Pete"; // 仍可改（writable 还是 true）
delete user.name; // TypeError（configurable: false）
Object.defineProperty(user, "name", { enumerable: false }); // TypeError
```

<v-click>

例外：若 `writable` 仍 `true`，**值还能改**；唯一允许的标志变更是 `writable: true → false`（收紧方向）。

</v-click>

---

# 访问器描述符：读写跑函数

描述符分两类、**互斥**：数据描述符（`value` + `writable`）vs 访问器描述符（`get` / `set`）。

```js
const obj = {
  a: 7,
  get b() { return this.a + 1; }, // 读 obj.b 时跑
  set c(x) { this.a = x / 2; }, // 写 obj.c 时跑
};
console.log(obj.b); // 8（getter）
obj.c = 50; // setter：this.a = 25
```

<v-click>

getter 不接收参数，setter 恰好一个参数；典型用途：计算属性、写入校验、只读视图。

</v-click>

---

# 对象级收紧：三层递进

| 方法 | 效果 | 检测 |
| --- | --- | --- |
| `preventExtensions` | 禁止**新增**属性 | `isExtensible` → `false` |
| `seal` | 再**禁删** + 全 `configurable:false` | `isSealed` |
| `freeze` | 再**禁改值**（`writable:false`） | `isFrozen` |

<v-click>

包含关系 `preventExtensions` ⊂ `seal` ⊂ `freeze`，且都是**浅**的——`Object.freeze(o)` 后 `o.a` 改不动、`o.c` 加不进，但 `o.nested.b` 照样能改（嵌套对象没被冻结）。深冻结需自己递归。

</v-click>

---
layout: section
---

# 三、引用与拷贝

值 vs 引用、浅深拷贝、structuredClone、循环引用

---

# 原始值按值，对象按引用

```js
let a = 1, b = a;
b = 2; // 原始值各存各的副本
console.log(a); // 1

const obj = { count: 1 };
const ref = obj; // 对象共享同一个引用
ref.count = 2;
console.log(obj.count); // 2
```

原始值变量直接持有**值**；对象变量持有**指向对象的引用**。传参同理——传进去的是引用，函数内改属性会反映到外部。

<v-click>

正因如此，`===` 比的是「是不是同一个引用」，不是内容：

```js
console.log({ x: 1 } === { x: 1 }); // false —— 两个不同对象
const o = { x: 1 };
console.log(o === o); // true —— 同一个引用
```

</v-click>

---

# 浅拷贝：只复制一层

```js
const original = { a: 1, nested: { b: 2 } };
const copy = { ...original }; // 或 Object.assign({}, original)

copy.a = 99;
console.log(original.a); // 1（第一层是新的）

copy.nested.b = 999;
console.log(original.nested.b); // 999 —— 坑！嵌套仍共享引用
```

<v-click>

「浅」= 只有第一层被复制，**嵌套对象 / 数组仍与原对象共享同一引用**。

</v-click>

---

# 深拷贝：`structuredClone`

```js
const original = { a: 1, nested: { b: 2 }, map: new Map() };
const deep = structuredClone(original);

deep.nested.b = 999;
console.log(original.nested.b); // 2（完全独立，嵌套层也是新的）
```

<v-click>

原生（2022 起广泛可用），递归复制整棵对象树。可拷：对象 / 数组 / `Map` / `Set` / `Date` / `RegExp` / `ArrayBuffer` / TypedArray / `Blob` 等，能力远超 `JSON` 方案。

</v-click>

---

# structuredClone 的限制

遇到下列内容会抛 `DataCloneError`：

<v-click>

- **函数 / 方法**——最常见的拦路虎，对象里有方法就抛错（`structuredClone({ fn(){} })`）
- **DOM 节点**
- **getter / setter 与属性描述符**——只拷「值」，标志全丢
- **原型链**——类实例会「降级」成普通对象

</v-click>

<v-click>

但**循环引用**它能正确处理（`JSON.stringify` 遇环直接抛 `TypeError`）：

```js
const o = { name: "MDN" };
o.itself = o; // 循环引用
const clone = structuredClone(o);
console.log(clone.itself === clone); // true（环被正确重建，指向克隆自身）
```

</v-click>

---

# 各种拷贝方式对比

| 方式 | 深度 | 函数 | `Date`/`Map` | 循环 | 描述符 |
| --- | :-: | :-: | :-: | :-: | :-: |
| `{ ...o }` | 一层 | 复制引用 | 复制引用 | 一层 OK | 丢 |
| `JSON` 往返 | 深 | **丢** | **变字符串** | **抛错** | 丢 |
| `structuredClone` | 深 | **抛错** | 正确深拷 | **保留** | 丢 |
| `getOwnPropertyDescriptors` | 一层 | 引用 | 引用 | 一层 OK | **保留** |

<v-click>

法则：扁平用 `{...o}`；有嵌套 / 环且**无函数**用 `structuredClone`；含函数得手写或用库。

</v-click>

---

# `const` 不等于「内容不可变」

```js
const o = { a: 1 };
o.a = 2; // ✅ 合法：改内容
o.b = 3; // ✅ 合法：加属性
// o = {};      // ❌ TypeError：重新赋值才被 const 禁止
console.log(o); // { a: 2, b: 3 }
```

<v-click>

`const` 只锁「变量不能重新赋值」，**不锁对象内容**；要锁内容用 `Object.freeze`（且是浅的）。

</v-click>

---
layout: section
---

# 四、原型链

`[[Prototype]]`、Object.create、`__proto__` vs prototype、属性遮蔽

---

# `[[Prototype]]`：对象指向对象

每个对象藏着内部槽 `[[Prototype]]`，指向**另一个对象**（或 `null`）。读属性自身没有就沿它上溯。

```js
const o = {
  a: 1,
  b: 2,
  __proto__: { b: 3, c: 4 }, // 字面量里 __proto__ 是标准语法
};
console.log(o.a); // 1 —— 自有
console.log(o.b); // 2 —— 自有遮蔽原型的 b
console.log(o.c); // 4 —— 沿原型链找到
console.log(o.d); // undefined —— 整条链都没有
```

<v-click>

链可画成：`o ──▶ { b: 3, c: 4 } ──▶ Object.prototype ──▶ null`。尽头通常是 `Object.prototype`（`toString` 等住这里），它的原型是 `null`。

</v-click>

---

# 读上溯，写只动自身；this 指调用者

```js
const animal = { sleep() { this.isSleeping = true; } }; // this 是调用者
const rabbit = { __proto__: animal };

rabbit.sleep(); // 调用继承来的方法（读上溯找到）
console.log(rabbit.isSleeping); // true —— 写在了 rabbit 自身上
console.log(animal.isSleeping); // undefined —— 原型 animal 没被碰
```

<v-click>

- **读**属性沿原型链上溯；**写 / 删**只作用于对象自身（新建属性遮住原型的，唯一例外是原型上的 setter）
- 方法里 `this` 永远指向**点号前的调用者**，而非定义它的原型——方法放原型、状态放各实例

</v-click>

---

# 标准存取：getPrototypeOf / setPrototypeOf

```js
const a = { a: 1 }, b = { b: 2 };
Object.setPrototypeOf(b, a); // 把 b 的原型设为 a
console.log(Object.getPrototypeOf(b) === a, b.a); // true 1（能从 a 继承了）
```

读写原型的标准 API 是这两个，取代历史遗留的 `__proto__` 访问器形式（`setPrototypeOf` 慎在热路径用）。

<v-click>

某些字面量创建时就自动接好原型——这正是「数组为何能直接 `.push`」：

```js
console.log(Object.getPrototypeOf([]) === Array.prototype); // true
```

`push` 住在 `Array.prototype` 上**全局共享一份**，也解释了「改了 `Array.prototype` 全世界数组都变」。

</v-click>

---

# `__proto__` vs `prototype`：别混

| | `__proto__` | `prototype` |
| --- | --- | --- |
| 出现在 | **任意对象**上 | **只有函数**上 |
| 是什么 | `[[Prototype]]` 的访问器 | 普通属性，指向一个对象 |
| 作用 | 「我继承自谁」 | 「`new` 出的实例的原型」 |
| 现代替代 | `getPrototypeOf` | 类用 `extends` |

<v-click>

口诀：`prototype` 是函数身上的「给后代用的模板」，`__proto__` 是对象身上的「我继承自谁」。

</v-click>

<v-click>

注意：字面量里的 `__proto__: x` 是**标准语法**；而 `obj.__proto__` 读写访问器是历史遗留，建议改用 `getPrototypeOf` / `setPrototypeOf`。

</v-click>

---

# new 做的事：接上 prototype

```js
function Box(v) { this.value = v; }
Box.prototype.getValue = function () { return this.value; };

const b = new Box(42);
console.log(Object.getPrototypeOf(b) === Box.prototype); // true
console.log(b.getValue()); // 42 —— 沿原型链找到
// b ──▶ Box.prototype ──▶ Object.prototype ──▶ null
```

<v-click>

`new X()` 本质就是把新对象的 `[[Prototype]]` 接到 `X.prototype` 上。

</v-click>

---

# `Object.create`：显式指定原型

```js
const animal = {
  type: "Invertebrates",
  displayType() { console.log(this.type); },
};
const fish = Object.create(animal); // fish 的原型是 animal
fish.type = "Fishes"; // 自有属性遮蔽原型的 type
fish.displayType(); // "Fishes"
```

<v-click>

`Object.create(proto)` 新建对象并把 `[[Prototype]]` 设为 `proto`，不需要构造函数。也是「创建时定原型」的推荐方式（比运行时 `setPrototypeOf` 快，后者触发去优化）。

</v-click>

<v-click>

特例 `Object.create(null)` 造出**没有原型**的纯字典：没有 `toString` / `hasOwnProperty`，也不怕「键恰好叫 `__proto__` / `constructor`」造成的原型污染。

</v-click>

---

# 属性遮蔽：自有遮住继承

```js
const parent = { value: 2 };
const child = { __proto__: parent };
child.value = 4; // 在 child 上新建自有属性（写不上溯）
console.log(child.value, parent.value); // 4 2 —— 自有遮蔽继承，parent 没变
console.log(Object.hasOwn(child, "value")); // true —— 自有
console.log("value" in parent); // true —— 原型那份还在
```

<v-click>

区分自有 / 继承：`Object.hasOwn` 只看自有，`in` 含整条原型链。

</v-click>

---
layout: section
---

# 五、基于原型的继承

构造函数、寄生组合继承、class / extends / super

---

# 构造函数 + prototype：共享方法

```js
function Box(value) {
  this.value = value; // 每个实例各有一份
}
Box.prototype.getValue = function () {
  return this.value; // 所有实例共享同一个函数
};
const a = new Box(1), b = new Box(2);
console.log(a.getValue === b.getValue); // true —— 真的是同一个函数
```

<v-click>

状态写构造函数体（`this.xxx`），方法挂 `prototype`——一千个实例共用一个方法，省内存。

</v-click>

<v-click>

每个 `prototype` 自带 `constructor` 指回函数（`Box.prototype.constructor === Box`）；改原型会立刻反映到**所有**实例，含已创建的（原型是动态共享的）。

</v-click>

---

# 继承的难点：两件矛盾的事

要让 `Child` 继承 `Parent`，得同时满足：

<v-click>

1. 实例要能调 `Parent.prototype` 上的**方法** → 接原型链
2. 实例要带上 `Parent` 构造里初始化的**实例属性** → 跑父构造逻辑

</v-click>

<v-click>

```js
function Child() {} // ❌ 只接方法链，不初始化属性
Object.setPrototypeOf(Child.prototype, Parent.prototype);
console.log(new Child().hello()); // "Hi, undefined" —— name 没初始化！
```

历史上社区试过几种方案，各有缺陷，最终收敛到**寄生组合继承**。

</v-click>

---

# 寄生组合继承：最终范式

**分工**——`setPrototypeOf` 接方法链，`Parent.call(this)` 跑属性初始化：

```js
function Child(name, age) {
  Parent.call(this, name); // ① 借 Parent 初始化实例属性
  this.age = age; // 子自己的属性
}
Object.setPrototypeOf(Child.prototype, Parent.prototype); // ② 接方法链

const c = new Child("Ada", 27);
console.log(c.hello()); // "Hi, Ada" —— 方法继承到、属性也初始化了
```

<v-click>

**组合** = `call` 初始化属性 + 原型链继承方法；**寄生** = 中间层无副作用地链接。

</v-click>

---

# 接原型用 setPrototypeOf，别用赋值

::: warning 别整体替换 prototype
```js
// 不推荐：整体替换
Child.prototype = Object.create(Parent.prototype);
```
:::

<v-click>

整体替换会：

- 断掉「替换前已创建的实例」的原型链
- 丢失原 `prototype` 上的 `constructor` 引用（需手动补回）

`setPrototypeOf` 只调整链接、保留原对象，更安全。

</v-click>

---

# class：把这套包成语法糖

```js
class Rectangle {
  constructor(h, w) { this.height = h; this.width = w; }
  getArea() { return this.height * this.width; }
}
// 等价的原型写法
function Rectangle(h, w) { this.height = h; this.width = w; }
Rectangle.prototype.getArea = function () {
  return this.height * this.width;
};
```

<v-click>

ES2015 的 `class` 不是新模型，而是把「构造函数 + 原型链」包装得更顺手。

</v-click>

---

# extends / super：继承的语法糖

```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound`; }
}
class Dog extends Animal { // extends ≈ 接原型链
  speak() { return `${super.speak()}, woof!`; } // super ≈ 调父原型
}
console.log(new Dog("Rex").speak()); // "Rex makes a sound, woof!"
```

<v-click>

`extends` 接原型链，`super(...)` ≈ `Parent.call(this)`，`super.m()` 沿父原型调方法；还多给私有字段 `#x` 等纯原型给不了的能力。现代项目**优先用 `class`**。

</v-click>

---

# 绝不要污染内置原型

```js
// ❌ 不要这样：给内置原型加属性
Array.prototype.myMethod = function () { /* ... */ };
```

<v-click>

风险：与未来标准方法重名冲突、污染全局（所有数组被影响，`for...in` 还枚举到它）、代码脆弱。

</v-click>

<v-click>

```js
// ✅ 唯一例外：polyfill 补齐缺失的标准方法
if (!Array.prototype.at) {
  Array.prototype.at = function (n) { /* 按标准实现 */ };
}
```

</v-click>

---

# 单继承与 mixin

一个对象只有**一个**原型，所以 JavaScript 是单继承，没有多继承。

```js
const serializable = {
  serialize() { return JSON.stringify(this); },
};
class User {}
Object.assign(User.prototype, serializable); // 把方法混入原型
console.log(new User().serialize !== undefined); // true
```

<v-click>

需要「从多个来源借能力」时用 **mixin**（`Object.assign` 拷进目标）模拟混入。

</v-click>

---
layout: section
---

# 六、Object 静态方法

keys / values / entries / assign / fromEntries / hasOwn

---

# keys / values / entries：拆成数组

```js
const user = { name: "Ada", age: 27 };
console.log(Object.keys(user)); // ["name", "age"]
console.log(Object.values(user)); // ["Ada", 27]
console.log(Object.entries(user)); // [["name", "Ada"], ["age", 27]]

for (const [k, v] of Object.entries(user)) console.log(`${k} = ${v}`);
```

<v-click>

只取**自有、可枚举、字符串键**，跳过继承 / 不可枚举 / Symbol。顺序：整数键升序 → 其余按插入序 → Symbol 最后（别依赖「先写先出」）。

</v-click>

---

# assign 与展开：浅合并

```js
const target = { a: 1 };
const result = Object.assign(target, { b: 2 }, { c: 3 });
console.log(result === target); // true —— 改的是 target 本身并返回

const merged = Object.assign({}, defaults, overrides); // 不污染源
```

<v-click>

与展开 `{ ...o }` 的区别：`assign` 写进**已有** target；展开**总建新对象**。两者都是浅合并、都会跑 getter / setter。

</v-click>

---

# fromEntries：键值对装回对象

`Object.entries` 的**逆操作**——吃 `[键, 值]` 可迭代物（数组或 `Map`），吐出对象：

```js
Object.fromEntries([["a", 1], ["b", 2]]); // { a: 1, b: 2 }

// 「转换对象」经典套路：拆 → map/filter → 装回
const prices = { apple: 1, banana: 2 };
const doubled = Object.fromEntries(
  Object.entries(prices).map(([k, v]) => [k, v * 2]),
);
console.log(doubled); // { apple: 2, banana: 4 }
```

---

# hasOwn：检测自有属性的现代写法

```js
const obj = { a: 1 };
console.log(Object.hasOwn(obj, "a")); // true
console.log(Object.hasOwn(obj, "toString")); // false —— 继承的不算
console.log("toString" in obj); // true —— 对比：in 含原型链
```

<v-click>

`Object.hasOwn`（ES2022）取代 `obj.hasOwnProperty`：后者在 `Object.create(null)` 对象上不存在（抛 `TypeError`），且可能被同名属性遮蔽；`Object.hasOwn` 从 `Object` 上调，绕开两坑。

</v-click>

---

# 遍历选型：到底用哪个

| 需求 | 用什么 | 含继承 | 含 Symbol |
| --- | --- | :-: | :-: |
| 自有可枚举键 | `Object.keys` 系 | ✗ | ✗ |
| 含继承的可枚举键 | `for...in`（配过滤） | ✓ | ✗ |
| 自有全部字符串键 | `getOwnPropertyNames` | ✗ | ✗ |
| 自有 Symbol 键 | `getOwnPropertySymbols` | ✗ | ✓ |
| 单键自有性 | `Object.hasOwn` | ✗ | ✓ |
| 单键存在性 | `key in o` | ✓ | ✓ |

<v-click>

`for...in` 会枚举**继承属性**，最易出错——典型修法是循环里 `if (!Object.hasOwn(obj, key)) continue;` 过滤。

</v-click>

---

# 最佳实践小结

<v-click>

- 对象只有字符串 / Symbol 键；读 / `in` 触及原型链，写 / `delete` 只动自身
- 属性 = 值 + 三标志；`freeze` ⊂ `seal` 收紧，但都是**浅**的
- 对象按引用，`===` 比引用；深拷贝用 `structuredClone`（含函数会抛错）
- `__proto__`（对象「继承自谁」）≠ 函数 `prototype`（「实例的模板」）
- 类式继承首选 `class`；底层是寄生组合继承；别污染内置原型
- 遍历选 `Object.keys` 系（只看自有可枚举），`for...in` 含继承需过滤

</v-click>

---
layout: center
class: text-center
---

# 谢谢

理解了「只有对象、靠 `[[Prototype]]` 串起来」，JavaScript 的对象模型就再无玄机

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
