---
theme: seriph
background: https://cover.sli.dev
title: JavaScript 类与面向对象
info: |
  JavaScript 类与面向对象 —— class 语法、继承 super、static、私有 #、访问器、装饰器现状
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:javascript class="text-8xl" />
</div>

<br/>

## JavaScript 类与面向对象

原型机制之上的语法糖，与真正的硬私有封装（基于 ES2025）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
class 看起来像别的语言的类，骨子里仍是 JavaScript 的原型继承——但它补上了硬私有、静态块这些真正的新能力。
-->

---
transition: fade-out
---

# 这一章讲什么

`class` 是原型的语法糖，却补齐了真正的封装能力

<v-click>

- **基础**：`class` 语法、`constructor`、原型方法、类字段
- **复用**：`extends`、`super`、继承内置类
- **类级**：`static` 成员、静态初始化块
- **封装**：私有 `#`、品牌检查、访问器、`instanceof`
- **未来**：装饰器 Stage 3 现状

</v-click>

<v-click>

> 一句话定调：`typeof MyClass === "function"`——类是函数，方法在原型，字段在实例。

</v-click>

---

# 类是一种函数

声明类 = 造一个以 `constructor` 为函数体、方法塞进 `prototype` 的函数

```js
class User {
  constructor(name) { this.name = name; }
  sayHi() {}
}

console.log(typeof User); // "function"
console.log(User === User.prototype.constructor); // true
```

<v-click>

它没引入新对象模型，是**原型继承之上的语法糖**；但比普通构造函数多了硬约束：必须 `new`、类体永远严格模式、方法默认不可枚举、声明不提升（TDZ）。

</v-click>

---

# 方法在原型，字段在实例

理解内存模型与 `this` 的分水岭

```js
class Point {
  x = 0; // 字段：每个实例各一份
  dist() { return Math.hypot(this.x); } // 方法：原型上共享一份
}

const a = new Point(), b = new Point();
console.log(a.dist === b.dist); // true —— 同一原型方法
console.log(a.hasOwnProperty("x")); // true —— 字段在实例
```

---

# `this` 看「怎么调用」，不看「在哪定义」

类方法**不会自动绑定**——单独取出当回调，`this` 就丢了

```js
class Button {
  text = "提交";
  click() { console.log(this.text); }
}

const btn = new Button();
btn.click(); // "提交"
const handler = btn.click;
handler(); // TypeError：严格模式下 this 是 undefined
```

---

# 两种修法：bind 或箭头字段

把 `this` 绑回实例

<v-click>

- **`.bind(btn)`**：显式绑定，方法仍在原型上
- **箭头函数字段**：字段在实例上初始化，捕获定义时的 `this`

</v-click>

<v-click>

```js
class Button {
  text = "提交";
  click = () => console.log(this.text);
}
const handler = new Button().click;
handler(); // "提交" ✅
```

> 代价：箭头字段**每实例一份**，是「用内存换绑定确定性」的权衡。

</v-click>

---
layout: section
---

# 类语法：构造与成员

类体里第一类成员，逐块拆透

---

# 声明 vs 表达式

区别主要在「名字」和「提升」上

```js
class Rectangle {} // 声明式：不提升、有 TDZ
const R2 = class {}; // 表达式（匿名）

// 表达式（具名）—— 名字 Inner 只在类体内可见
const R3 = class Inner {
  whoami() { return Inner.name; }
};
new R3().whoami(); // "Inner"，类外引用 Inner 报 ReferenceError
```

---

# `constructor`：实例的初始化器

`new C()` 时执行，`this` 指向新实例

<v-click>

- **至多一个**：写两个是 `SyntaxError`
- **可省略**：引擎补隐式构造函数
- **支持剩余参数**：`constructor(...values) {}`

</v-click>

<v-click>

```js
class Weird {
  constructor() { return { b: 2 }; } // 返回对象 → 顶替实例
}
console.log(new Weird().b); // 2（返回原始值则被忽略）
```

</v-click>

---

# 实例方法：挂原型，共享一份

类体里的方法都装进 `C.prototype`

```js
class Color {
  constructor(r, g, b) { this.values = [r, g, b]; }
  getRed() { return this.values[0]; }
}

const c = new Color(255, 0, 0);
console.log(Color.prototype.hasOwnProperty("getRed")); // true
console.log(c.hasOwnProperty("getRed")); // false
```

---

# 方法的几种变体

方法名位置可放生成器、异步、计算属性名

```js
class Stream {
  *[Symbol.iterator]() { yield 1; yield 2; } // 生成器
  async load(url) { return (await fetch(url)).json(); } // 异步
  ["get" + "Size"]() { return 42; } // 计算属性名
}
console.log([...new Stream()]); // [1, 2]
```

---

# 类字段：挂在每个实例上

ES2022，直接写在类体里，**不带** `let`/`const`

```js
class Profile {
  name = "匿名"; // 有默认值
  age; // 无默认值 → undefined
  createdAt = Date.now(); // 每实例求值一次
}
const p = new Profile();
console.log(p.name, p.age); // "匿名" undefined
```

<v-click>

> 等价于在构造函数最前面写 `this.xxx = ...`；子类里在 `super()` 之后初始化。

</v-click>

---

# 该用字段还是方法？

判断标准：这份东西是否该被**所有实例共享**

| 想要的东西 | 写法 | 存储位置 |
| --- | --- | --- |
| 所有实例共享的行为 | 实例方法 `m() {}` | 原型，一份 |
| 每个实例独立的数据 | 类字段 `x = ...` | 实例，各一份 |
| 独立且绑死 `this` 的回调 | 箭头字段 `m = () => {}` | 实例，各一份 |

<v-click>

> 把共享逻辑写成字段里的函数，会让每实例新建一份，浪费内存。

</v-click>

---
layout: section
---

# 继承与 super

面向对象的核心：类之间的复用

---

# `extends`：建立继承关系

子类原型链接到父类，自动获得父类方法

```js
class Animal {
  constructor(name) { this.name = name; }
}
class Dog extends Animal {}

const d = new Dog("旺财");
console.log(d.name); // "旺财"（继承父类构造）
console.log(d instanceof Dog); // true
console.log(d instanceof Animal); // true —— 也是父类实例
```

<v-click>

> 单继承；`extends` 后可接任意构造函数，甚至 `null`。

</v-click>

---

# `super()`：必须先于 `this`

子类有自己的 `constructor` 就**必须**调 `super()`

```js
class Dog extends Animal {
  constructor(name, breed) {
    super(name); // ① 必须先调，初始化 this
    this.breed = breed; // ② 之后才能用 this
  }
}
// 不写 constructor → 引擎补 constructor(...args){ super(...args); }
```

<v-click>

> 在 `super()` 之前碰 `this` 抛 `ReferenceError: Must call super constructor before accessing 'this'`。

</v-click>

<v-click>

> ⚠️ 时序坑：子类**实例字段**在 `super()` 返回**之后**才赋值——父类构造期间它们尚未初始化。

</v-click>

---

# `super.method()`：改写父类行为

典型用法「先调父类，再加料」

```js
class Dog extends Animal {
  speak() {
    super.speak(); // 先跑父类的
    console.log(`${this.name} 汪汪叫`); // 再加自己的
  }
}
```

<v-click>

`super` 也能在**静态方法**里调父类静态方法：

```js
static create() { return super.create() + "+derived"; }
```

</v-click>

---

# 继承内置类（一）：Array

子类实例保留内置类型的特有行为

```js
class Stack extends Array {
  peek() { return this[this.length - 1]; }
}

const s = new Stack();
s.push(1, 2, 3); // 复用 Array.prototype.push
console.log(s.peek()); // 3
console.log(s instanceof Array); // true
```

---

# 继承内置类（二）：自定义错误

继承 `Error` 是工程里很常见的写法

```js
class ValidationError extends Error {
  constructor(message, field) {
    super(message); // 让 message 正常工作
    this.name = "ValidationError"; // 覆盖默认 name
    this.field = field;
  }
}
const e = new ValidationError("邮箱格式不对", "email");
console.log(e instanceof Error); // true
```

<v-click>

> ⚠️ 子类**访问不到**父类的 `#field`——私有性按「类」隔离，不沿继承链共享。

</v-click>

---
layout: section
---

# 静态成员

挂在「类自身」、随类一起存在的成员

---

# 静态方法：属于「类」而非「实例」

`static` 修饰，用类名调用，与具体实例无关

```js
class Color {
  static fromHex(hex) {
    const n = parseInt(hex.slice(1), 16);
    return new Color((n >> 16) & 255, (n >> 8) & 255, n & 255);
  }
}

const c = Color.fromHex("#ff8800"); // 工厂方法
console.log(new Color(0, 0, 0).fromHex); // undefined —— 实例上没有
```

<v-click>

> 标准库大量如此：`Array.from`、`Object.keys`、`Promise.all`、`Math.max`。

</v-click>

---

# 静态字段与静态访问器

类级别的共享数据：计数器、配置表、单例缓存

```js
class Widget {
  static count = 0; // 类级计数器
  constructor() { Widget.count++; } // 所有实例累加同一个
  static get total() { return Widget.count; } // 静态访问器
}
new Widget(); new Widget();
console.log(Widget.total); // 2
```

---

# 私有静态成员

`static #x` / `static #m()`：类级别且对外不可见

```js
class IdGenerator {
  static #seed = 1000; // 私有静态字段
  static #next() { return ++IdGenerator.#seed; } // 私有静态方法
  static issue() { return `ID-${IdGenerator.#next()}`; }
}
console.log(IdGenerator.issue()); // "ID-1001"
console.log(IdGenerator.issue()); // "ID-1002"
```

---

# 静态初始化块

ES2022——当初始化需要语句、循环、`try/catch` 或读私有静态

```js
class Config {
  static #raw = '{"port": 8080}';
  static port;
  static {
    const parsed = JSON.parse(this.#raw); // this 指向 Config
    this.port = parsed.port;
  }
}
console.log(Config.port); // 8080
```

---

# 静态块的要点与时机

它相对外部代码的独有能力

<v-click>

- **`this` 指向类构造函数自身**——可 `this.x = ...`，能读 `this.#privateStatic`
- **可访问私有静态成员**，这是外部代码做不到的
- **可用 `super.prop`** 读取父类静态属性
- **可写多个块**，与静态字段按声明顺序交错执行

</v-click>

<v-click>

> 执行时机：在**类定义被求值那一刻**按出现顺序跑、仅一次——后面的块能读到前面已设的字段。

</v-click>

---

# 静态成员会被子类继承

并能在子类静态方法里用 `super` 调父类静态

```js
class Repository {
  static tableName = "base";
  static describe() { return `表：${this.tableName}`; }
}
class UserRepository extends Repository {
  static tableName = "users"; // 覆盖静态字段
  static describe() { return super.describe() + "（用户）"; }
}
console.log(UserRepository.describe()); // "表：users（用户）"
```

---
layout: section
---

# 私有字段 #

实例级别最强的封装手段——真正的硬私有

---

# `#field`：真正的私有

ES2022 之前只能靠 `_name` 约定「假装私有」

```js
class BankAccount {
  #balance = 0; // 私有字段，必须先声明
  deposit(amount) { this.#balance += amount; }
  get balance() { return this.#balance; } // 只读对外暴露
}
const acc = new BankAccount();
// acc.#balance; // SyntaxError：类外访问是语法错误
```

<v-click>

> **硬私有**：JavaScript 不提供任何从类外读取的途径。注意 `_x` 只是命名约定、谁都能改；每个 `#x` 都**必须在类体声明**，不能凭空 `this.#x = 1`。

</v-click>

---

# 同类实例之间可以互访

私有性按「类」而非「实例」隔离

```js
class Money {
  #cents;
  constructor(cents) { this.#cents = cents; }
  add(other) {
    return new Money(this.#cents + other.#cents); // 读对方私有字段
  }
}
const a = new Money(150), b = new Money(250);
console.log(a.add(b)); // Money { #cents: 400 }
```

---

# 私有方法与私有访问器

`#` 前缀的方法/访问器只能在类体内调用

```js
class Counter {
  #count = 0;
  get #value() { return this.#count; } // 私有访问器
  #render() { return `当前：${this.#value}`; } // 私有方法
  tick() {
    this.#count++;
    return this.#render(); // 公有方法编排私有逻辑
  }
}
console.log(new Counter().tick()); // "当前：1"
```

---

# `#x in obj`：安全的品牌检查

直接对不确定的对象访问 `obj.#x` 会**抛错**——用品牌检查代替

```js
class Color {
  #values;
  redDifference(other) {
    if (!(#values in other)) {
      throw new TypeError("需要一个 Color 实例");
    }
    return this.#values[0] - other.#values[0];
  }
}
console.log(#values in {}); // false —— 不抛错、返回布尔
```

<v-click>

> 它比 `instanceof` 可靠：`instanceof` 可被篡改，而「拥有某私有字段」是「真由本类构造」的硬证据、无法伪造。

</v-click>

<v-click>

> 几条硬限制（均为早期语法错误）：`#x` 不可重名、不可 `delete`、不可动态访问 `obj[#x]`、不继承。

</v-click>

---
layout: section
---

# 访问器与 instanceof

受控地暴露内部状态，与类型判定

---

# `get` / `set`：像属性一样的方法

读写背后跑你的逻辑，调用方写起来像普通属性

```js
class Temperature {
  #celsius = 0;
  get celsius() { return this.#celsius; } // 读
  set celsius(v) {
    if (typeof v !== "number") throw new TypeError("必须是数字");
    this.#celsius = v; // 写：可校验
  }
  get fahrenheit() { return this.#celsius * 1.8 + 32; } // 只读计算属性
}
```

<v-click>

> 只写 `get` 不写 `set` = 只读属性；类体永远严格模式，对只读属性赋值会**抛 `TypeError`**、而非静默失败。

</v-click>

---

# `instanceof`：原型链上的判定

检查 `C.prototype` 是否出现在 `obj` 的原型链上

```js
class Animal {}
class Dog extends Animal {}

const d = new Dog();
console.log(d instanceof Dog); // true
console.log(d instanceof Animal); // true —— 祖先类也为 true
console.log(d instanceof Object); // true
```

---

# `Symbol.hasInstance`：定制 instanceof

在类上定义静态方法，改用它判定——「鸭子类型」式检查

```js
class ArrayLike {
  static [Symbol.hasInstance](value) {
    return value != null && typeof value.length === "number";
  }
}
console.log([] instanceof ArrayLike); // true
console.log("abc" instanceof ArrayLike); // true
console.log(42 instanceof ArrayLike); // false
```

<v-click>

> 正因可被改写，`instanceof` **可被伪造**——强身份证明请用品牌检查。

</v-click>

---

# `new.target`：是谁在 new

构造函数里的元属性，指向**实际被 `new` 的那个类**

```js
class Base {
  constructor() { console.log(new.target.name); }
}
class Sub extends Base {}

new Base(); // "Base"
new Sub(); // "Sub" —— 指向实际被 new 的子类
```

<v-click>

> 普通函数调用（没有 `new`）时 `new.target` 为 `undefined`。

</v-click>

---

# 用 `new.target` 做「抽象类」

JavaScript 没有 `abstract`，用它拦住「直接实例化基类」

```js
class Shape {
  constructor() {
    if (new.target === Shape) throw new TypeError("Shape 是抽象类");
  }
}
class Square extends Shape {
  constructor(side) { super(); this.side = side; }
}
// new Shape(); // TypeError；new Square(3) 可以
```

---
layout: section
---

# 装饰器现状

面向未来的一块拼图——但尚未原生落地

---

# 装饰器是什么：Stage 3，非原生

`@name` 声明式语法，把横切逻辑（日志、校验、注入）抽出来

```js
// 目标用法 —— 但浏览器/Node 不能直接运行这段语法
@defineElement("my-counter")
class Counter extends HTMLElement {
  @reactive accessor count = 0;
  @logged increment() { this.count++; }
}
```

<v-click>

- 仍是 **TC39 提案**、未进 ECMAScript 正式版；处于 **Stage 3 收敛阶段**
- **V8 / SpiderMonkey / JavaScriptCore 均未原生实现**——直接喂浏览器/Node 会**语法报错**

</v-click>

---

# 现在怎么用：靠工具链转写

源码写 `@deco`，构建期降级成普通 JS，运行的是产物而非语法本身

<v-click>

- **TypeScript**：5.0+ **默认**按 Stage 3 编译，**不再需要** `experimentalDecorators`
- **Babel**：`@babel/plugin-proposal-decorators` 指定 `version: "2023-05"`（或更新）

</v-click>

<v-click>

> 那个 `experimentalDecorators` 开关对应的是另一套「旧装饰器」（下页详述）。

</v-click>

---

# 标准装饰器的统一签名

核心设计：所有装饰器都是同一种函数 `deco(value, context)`

```js
function deco(value, context) {
  // value：被装饰的东西（方法/访问器为函数；字段为 undefined）
  // context.kind: "class"|"method"|"getter"|"setter"|"field"|"accessor"
  // context.name / static / private / access / addInitializer
}
```

<v-click>

> `context` 描述目标：种类、名字、是否静态/私有、读写句柄、初始化回调。

</v-click>

---

# 字段装饰器示例

字段装饰器返回的函数可改写初始值

```js
function logged(value, { kind, name }) {
  if (kind === "field") {
    return (initialValue) => {
      console.log(`初始化 ${name}，值为 ${initialValue}`);
      return initialValue; // 可改写初始值
    };
  }
}
class C { @logged x = 1; }
new C(); // 初始化 x，值为 1
```

<v-click>

> 提案还引入新关键字 `accessor name = ...`：由私有字段背书的「自动 get/set 对」，装饰器可改写其读写——「响应式框架把属性变可观察」的语法基础。

</v-click>

---

# 与 TypeScript「旧装饰器」不兼容

Angular / 旧 NestJS 里见到的是**另一套规范**

| 维度 | 旧（TS 实验性） | 标准（Stage 3） |
| --- | --- | --- |
| 开关 | `experimentalDecorators` | 现代 TS 默认、**不开** |
| 函数签名 | `(target, key, descriptor)` | `(value, context)` |
| getter/setter | 合并成一个描述符 | 各自**独立**装饰 |
| 注入新成员 | 可注入任意新元素 | 只能包裹/替换自身 |

<v-click>

> 两套语义**不能混用**；无论哪套，最终交付的都是**转写后的普通 JS**。

</v-click>

---

# 各特性 ES 版本与 Baseline

| 特性 | 标准 | 状态 |
| --- | --- | --- |
| `class`/`extends`/`super`/`static`/`get·set` | ES2015 | ✅ 广泛可用 |
| 公有 / 私有字段（`x` / `#x`） | ES2022 | ✅ 2023 起广泛 |
| 私有方法/访问器、私有静态、`#x in obj` | ES2022 | ✅ 2023 起广泛 |
| 静态初始化块 `static {}` | ES2022 | ✅ 2023 起广泛 |
| 装饰器 `@deco` / `accessor` | TC39 提案 | 🟠 非原生，须转写 |

---

# 常见坑速查

带着这些走出本章

| 现象 | 对策 |
| --- | --- |
| 方法当回调 `this` 为 `undefined` | `.bind` 或箭头函数字段 |
| 报「before initialization」 | 类定义放在使用之前 |
| 子类报「must call super」 | 先 `super(...)` 再用 `this` |
| 以为 `_x` 是私有 | 真私有用 `#x` |
| 静态成员在实例上读到 `undefined` | 用 `类名.成员` 访问 |

---
layout: center
class: text-center
---

# 谢谢

`class` 是函数、方法在原型、字段在实例、`this` 看调用点——握住这四条，类系统就不再神秘

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
