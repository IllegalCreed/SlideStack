---
theme: seriph
background: https://cover.sli.dev
title: JavaScript 生成器与元编程
info: |
  JavaScript 生成器与元编程 —— function*/yield、异步生成器、自定义迭代器、Proxy/Reflect、well-known symbols、资源管理
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:javascript class="text-8xl" />
</div>

<br/>

## JavaScript 生成器与元编程

让函数能暂停、让对象按你的规则运转（基于现代 JavaScript · ES2025/2026）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
本叶讲两件相关但不同的事：让函数能暂停（生成器）、让对象按你的规则运转（元编程），它们经由 Symbol.iterator 协议汇到一处。
-->

---
transition: fade-out
---

# 这一章讲什么

两件相关但不同的事，经由 `Symbol.iterator` 汇到一处

<v-click>

- **生成器**：`function*` 把「顺序代码」变成「按需吐值的状态机」
- **自定义迭代器**：生成器是给对象接入 `for...of` 的捷径
- **异步生成器**：`for await...of` 消费「逐批异步到达」的数据
- **Proxy / Reflect**：拦截对象的读写删调用等底层操作
- **symbols / using**：挂接语言协议、补上确定性资源释放

</v-click>

<v-click>

> 三句话：生成器 = 可暂停的函数；Proxy/Reflect = 改写底层操作；symbols/using = 挂接语言协议。

</v-click>

---
layout: section
---

# 生成器

能暂停、能恢复的函数

---

# `function*`：调用即得状态机

**调用它并不运行函数体**，而是返回一个**生成器对象**；`next()` 驱动它跑到下一个 `yield`

```js
function* gen() {
  console.log("开始");
  yield 1;
  return 3;
}
const g = gen(); // 什么都没打印——函数体还没跑
g.next(); // 打印「开始」→ { value: 1, done: false }
g.next(); // 打印 return → { value: 3, done: true }
g.next(); // { value: undefined, done: true }（之后恒为 done）
```

<v-click>

每个 `yield` 是**暂停点**：吐值后**冻结现场**（局部变量、执行位置全保留），下次 `next()` 从原地解冻——普通函数「一次跑完」，生成器能「跑一段、停、再跑一段」。

</v-click>

---

# `return` 的值去哪了

```js
function* g() {
  yield 1;
  return 99; // done 变 true，value 为 99
}
```

<v-click>

- `return x` → 让 `done` 变 `true` 且 `value` 为 `x`
- 但 `for...of` / 扩展 `...` 在 `done: true` 时就停止、**不收集**那帧的 `value`

</v-click>

<v-click>

::: tip 经验法则
想被遍历到的值用 `yield`；`return` 只用来**提前收尾**。
:::

</v-click>

---

# 生成器既是迭代器，也是可迭代对象

自带 `next()`（迭代器），且 `[Symbol.iterator]()` 返回**它自己**（可迭代对象）

```js
function* abc() {
  yield "a";
  yield "b";
}
const g = abc();
for (const ch of g) console.log(ch); // a b
for (const ch of g) console.log(ch); // （空——g 已耗尽，只能消费一次）
[...abc()]; // ["a", "b"]（重新调用才有新生成器）
```

<v-click>

`for...of`、扩展、解构都能直接作用于它；但 `[Symbol.iterator]()` 返回自身、走到 `done` 即止，**同一对象不能重复遍历**——要复用就每次重新调 `abc()`（见自定义迭代器）。

</v-click>

---

# `yield*`：委托给另一个可迭代对象

把另一个生成器 / 可迭代对象的产出逐个「透传」出去，是**组合生成器**的标准手段

```js
function* range(a, b) {
  for (let i = a; i <= b; i++) yield i;
}
function* flatten() {
  yield* range(48, 57); // 委托生成器 → 48..57
  yield* "ab"; // 委托字符串 → "a", "b"
  yield 3;
}
[...flatten()]; // [48, ..., 57, "a", "b", 3]
```

<v-click>

右侧只要可迭代即可（数组、字符串、`Set`、`Map`、生成器）；注意与 `yield [一个数组]` 不同——后者吐出整个数组，`yield*` 吐出里面每个元素。

</v-click>

---

# 惰性求值与无限序列

**按需计算**：值只在被 `next()` 索取时才生成，所以 `while (true)` 不卡死

```js
function* naturals() {
  let n = 1;
  while (true) yield n++; // 无限，但只在被索取时推进一步
}
naturals()
  .map((n) => n * n) // 惰性：平方
  .take(5) // 取够 5 个就停止向上游索取
  .toArray(); // [1, 4, 9, 16, 25]
```

<v-click>

「无限序列」由此可写可控；`take` / `map` / `filter`（Iterator Helpers，**ES2025** · Baseline 新近）让它被安全「截断使用」，旧环境需 polyfill。

</v-click>

---

# `yield` 是双向的：把值传回

`gen.next(v)` 传入的 `v`，会成为**当前那个 `yield` 表达式的求值结果**

```js
function* dialog() {
  const name = yield "你叫什么？"; // 第 2 次 next 的入参落这
  return `你好 ${name}`;
}
const g = dialog();
g.next().value; // "你叫什么？"（首个 next 只是启动）
g.next("Ada").value; // "你好 Ada"（"Ada" → name）
```

<v-click>

::: warning 首个 `next()` 的参数被丢弃
第一次 `next()` 只负责「启动到第一个 `yield`」，此时还没有 `yield` 表达式在等待赋值——要往里传值，**从第二次 `next()` 开始**。
:::

</v-click>

---

# 外部控制：`return()` 与 `throw()`

```js
function* guarded() {
  try {
    yield 1;
  } catch (e) {
    console.log("内部捕获:", e.message);
    yield 2; // 捕获后还能继续产出
  } finally {
    console.log("清理"); // return() / 结束 / throw 都经过
  }
}
```

<v-click>

- `gen.return(v)`：立即结束（仿佛在暂停点 `return v`），触发沿途 `try...finally`——`for...of` 中途 `break` 时引擎正是替你调它
- `gen.throw(err)`：在当前 `yield` 暂停点抛错，可被内部 `try...catch` 接住并继续；未接住则冒泡、生成器进入 `done`

</v-click>

---
layout: section
---

# 异步生成器

把「逐批异步到达」写成顺序代码

---

# 当每个值都需要等待

`async function*`：函数体里 `yield` 与 `await` 可自由混用

```js
async function* fetchUsers() {
  let page = 1;
  while (true) {
    const res = await fetch(`/api/users?page=${page}`);
    const { users, hasNext } = await res.json();
    yield* users; // 逐个产出这一页的 user
    if (!hasNext) return;
    page++;
  }
}
```

适合分页 API、读流、数据库游标这类「等一会儿、来一批」的过程。

<v-click>

产出的是**异步迭代器**：`next()` 返回的是 **Promise**，解析后才是 `{ value, done }`（同步生成器返回裸对象）；底层落到 `[Symbol.asyncIterator]()` 协议，与同步那套平行。

</v-click>

---

# `for await...of`：逐个等待的循环

```js
async function main() {
  for await (const user of fetchUsers()) {
    console.log(user.name); // 一个个到达、一个个处理
  }
}
```

<v-click>

- 每轮循环自动 `await` 一次 `next()` 的 Promise，拿到值再进循环体
- 绝不一次性把所有页拉进内存
- 只能用在 `async` 函数 / 模块顶层（**ES2018**）

</v-click>

---

# 同步 vs 异步循环

| | `for...of` | `for await...of` |
| --- | --- | --- |
| 消费同步可迭代 | ✅ | ✅（并 `await` 每个元素） |
| 消费异步可迭代 | ❌ | ✅ |
| 自动解包 Promise | ❌ | ✅ |
| 可用位置 | 任何地方 | 仅 `async` / 模块顶层 |

<v-click>

`for await...of` 也吃「装着 Promise 的数组」——逐个**串行**等待解包；想并发仍该用 `Promise.all`。

</v-click>

---

# 包装流：`ReadableStream`

```js
async function* streamChunks(stream) {
  const reader = stream.getReader();
  try {
    let r;
    while (!(r = await reader.read()).done) yield r.value; // 逐块产出
  } finally {
    reader.releaseLock(); // break / 抛错时也执行
  }
}
```

这正是把「流式数据」封装成异步可迭代对象的典型。

---

# 整体收集：`Array.fromAsync`（ES2024）

把有限的异步可迭代对象**一次性物化成数组**

```js
async function* threeAsync() {
  yield await Promise.resolve("a");
  yield await Promise.resolve("b");
}

const all = await Array.fromAsync(threeAsync()); // ["a", "b"]
```

<v-click>

⚠️ 它会**等待全部产出完成**——**不要**对无限异步生成器使用（会永不解析）；流式处理仍用 `for await...of`。

</v-click>

---

# 清理陷阱：同步 yield 出 rejected Promise

```js
// ❌ 用 for await...of 消费「yield 出会 reject 的 Promise」的同步生成器
// 错误中断循环，但生成器里的 finally 不会执行

// ✅ 稳妥写法：同步 for...of + 循环体内显式 await
for (const p of syncGenYieldingPromises()) {
  console.log(await p); // 错误在循环体内抛出 → finally 正常执行
}
```

<v-click>

原因：`for await...of` 是在循环外 `await` 那个 Promise，并未驱动同步生成器走到 `return()`。

</v-click>

---
layout: section
---

# 自定义迭代器

生成器是给对象接入 `for...of` 的捷径

---

# 两个协议，一层关系

`for...of` / 扩展 / 解构面向一对配套契约，不是「为数组特制」

<v-click>

- **可迭代协议**：对象有 `[Symbol.iterator]()` 方法、返回一个**迭代器**
- **迭代器协议**：对象有 `next()`、每次返回 `{ value, done }`（`done: true` 表结束）

</v-click>

<v-click>

```js
const it = [10, 20][Symbol.iterator]();
it.next(); // { value: 10, done: false }
it.next(); // { value: 20, done: false }
```

`for...of` 在背后做的，正是「拿迭代器，反复 `next()` 直到 `done`」。

</v-click>

---

# 手写迭代器：能用，但啰嗦

不借助生成器，让 `range` 可迭代要自己维护游标和 `{ value, done }`

```js
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let cur = this.from;
    const last = this.to; // 手拼游标
    return { next: () => (cur <= last ? { value: cur++, done: false } : { done: true }) };
  },
};
```

样板代码淹没了真正的逻辑「从 from 数到 to」——下一页用生成器消掉它。

---

# 生成器：把样板代码消掉

生成器对象**本身就是迭代器**，把 `[Symbol.iterator]` 写成生成器方法

```js
const range = {
  from: 1,
  to: 5,
  *[Symbol.iterator]() {
    for (let v = this.from; v <= this.to; v++) yield v;
  },
};
[...range]; // [1, 2, 3, 4, 5]
const [a, b] = range; // a=1, b=2
for (const n of range) console.log(n); // 又能跑一遍 ✅
```

<v-click>

逻辑只剩「`for` + `yield`」一行。而它**能重复遍历**——`range` 是可迭代对象，每次 `for...of` 都重新调 `[Symbol.iterator]()`、得到**全新生成器**；可复用容器就该把生成器藏进方法里、每次新建。

</v-click>

---

# 让类自带迭代能力

```js
class Stack {
  #items = [];
  push(x) {
    return this.#items.push(x), this; // 支持链式
  }
  *[Symbol.iterator]() {
    // 从栈顶到栈底遍历
    for (let i = this.#items.length - 1; i >= 0; i--) yield this.#items[i];
  }
}
```

给类写 `*[Symbol.iterator]()`，实例就能直接 `for...of` / 扩展：`[...new Stack().push(1).push(2).push(3)]` → `[3, 2, 1]`。

---

# 与数组同源：三个「为什么」

<v-click>

- **数组 / 字符串 / `Map` / `Set` 都能 `for...of`**：原型上都实现了 `Symbol.iterator`
- **类数组（只有 `length` 和索引）不能 `for...of`**：没有 `Symbol.iterator`
- **自定义对象加上它就「像数组一样好用」**：扩展、解构、`for...of` 全基于这一个方法

</v-click>

<v-click>

```js
const arrayLike = { 0: "a", 1: "b", length: 2 };
Array.from(arrayLike); // ["a", "b"]——Array.from 认 length，无需 Symbol.iterator
```

</v-click>

---
layout: section
---

# Proxy 与 Reflect

拦截对象的一切底层操作

---

# Proxy：给对象装一层「拦截器」

`new Proxy(target, handler)`，`handler` 里的**陷阱**拦截底层操作

```js
const proxy = new Proxy(
  { msg: "hello" },
  {
    get(obj, key) {
      console.log(`读取 ${String(key)}`);
      return key in obj ? obj[key] : `<无 ${String(key)}>`;
    },
  },
);
proxy.msg; // 「读取 msg」→ "hello"；proxy.nope → "<无 nope>"
```

**没写的陷阱会原样透传给 `target`**——只需为想改变的操作写陷阱。

---

# 13 个陷阱：按操作分类

每个陷阱对应一个「基础内部方法」，拦截一类语言操作（共 13 个）

| 类别 | 陷阱 | 触发 |
| --- | --- | --- |
| 属性读写 | `get` / `set` | `obj.k` / `obj.k = v` |
| 存在与删除 | `has` / `deleteProperty` | `k in obj` / `delete obj.k` |
| 枚举与描述符 | `ownKeys` / `getOwnPropertyDescriptor` / `defineProperty` | `Object.keys` / `defineProperty` |
| 原型 | `getPrototypeOf` / `setPrototypeOf` | `instanceof` / `setPrototypeOf` |
| 可扩展性 | `isExtensible` / `preventExtensions` | `Object.freeze` 等 |
| 函数 | `apply` / `construct` | `proxy(...)` / `new proxy(...)` |

返回值：多数返回 **boolean**；`get` 任意值，`ownKeys` 键数组，`apply` / `construct` 返回调用结果。

<style scoped>
/* 紧凑表格：缩小字号与单元格内边距，避免长方法名换行致行高溢出 */
table { font-size: 0.82em; }
th, td { padding-top: 0.35rem; padding-bottom: 0.35rem; }
</style>

---

# Reflect：陷阱的「默认实现」

与 13 个陷阱**同名同参、一一对应**的静态方法命名空间——陷阱里写 `Reflect.xxx(...)` 即「执行原本该发生的操作」

```js
const proxy = new Proxy(target, {
  get(t, key, receiver) {
    console.log(`读 ${String(key)}`);
    return Reflect.get(t, key, receiver); // ← 执行默认读取，并返回其结果
  },
});
```

<v-click>

比手写好在：① `Reflect.set` / `deleteProperty` / `defineProperty` 返回 **boolean**，正好做陷阱返回值；② **不抛错**（失败返回 `false`），更可预测；③ 能正确传 **`receiver`**（手写赋值做不到）。`Reflect` 不能 `new`、不能当函数调，只是方法命名空间。

</v-click>

---

# `receiver`：getter/setter 里 `this` 的归属

```js
const target = {
  _value: 10,
  get value() {
    return this._value; // 这里的 this 该是谁？
  },
};
const proxy = new Proxy(target, {
  get: (t, key, receiver) => Reflect.get(t, key, receiver),
});
proxy.value; // 10；传 receiver → getter 内 this 是 proxy（不是 t）
```

<v-click>

不传 `receiver`，getter 以裸 `target` 为 `this`、**绕过代理**——这是响应式的命门：唯有 `this` 是代理，getter 里 `this.xxx` 的进一步读取才会再次触发 `get`、被完整追踪。

</v-click>

---

# 不变量：陷阱不能「睁眼说瞎话」

引擎强制一组**不变量**——陷阱返回必须与 `target` 真实约束自洽，违反抛 `TypeError`

```js
const frozen = Object.freeze({ x: 1 }); // x 不可写不可配置
const p = new Proxy(frozen, {
  get() {
    return 999; // 想谎报 x 的值
  },
});
// p.x // ❌ TypeError：不可配置不可写属性必须返回真实值
```

「代理不能对外谎报对象的不可变事实」——撞了不变量就抛错。

---

# 应用①②：默认值 + 数据校验

`get` 兜底缺失属性、`set` 拦下非法赋值——两个最常见的陷阱

```js
const obj = new Proxy(
  { port: 8080 },
  {
    get: (t, k, recv) => (k in t ? Reflect.get(t, k, recv) : "未配置"),
    set(t, k, v, recv) {
      if (k === "age" && !Number.isInteger(v)) throw new TypeError("age 须为整数");
      return Reflect.set(t, k, v, recv);
    },
  },
);
```

`obj.port` → 8080；`obj.host` → `"未配置"`；`obj.age = "老"` → `TypeError`。

---

# 应用③：最小响应式（Vue 3 内核）

`get` 时 `track` **收集依赖**、`set` 时 `trigger` **触发更新**

```js
const reactive = (obj) =>
  new Proxy(obj, {
    get(t, key, recv) {
      track(t, key); // 读 → 记下谁依赖此 key
      return Reflect.get(t, key, recv);
    },
    set: (t, key, val, recv) =>
      (trigger(t, key), Reflect.set(t, key, val, recv)), // 写 → 通知
  });
```

「数据一变，视图自动更新」的全部魔法：`get` 收集、`set` 触发。

---

# track / trigger 骨架

```js
let activeEffect = null; // 当前运行、需被追踪的副作用
const depsMap = new WeakMap(); // target → (key → effect 集合)

function track(target, key) {
  if (!activeEffect) return;
  const deps = depsMap.get(target) ?? depsMap.set(target, new Map()).get(target);
  (deps.get(key) ?? deps.set(key, new Set()).get(key)).add(activeEffect);
}
const trigger = (target, key) =>
  depsMap.get(target)?.get(key)?.forEach((effect) => effect());
```

理解了它，Vue 3 响应式不再是黑箱。

---

# 可撤销代理：`Proxy.revocable`

「用完就彻底断开」的代理（如交给第三方的临时句柄）

```js
const { proxy, revoke } = Proxy.revocable({ secret: 42 }, {});

proxy.secret; // 42
revoke(); // 撤销
// proxy.secret // ❌ TypeError: ...proxy that has been revoked
```

<v-click>

`revoke()` 之后，对代理的**任何操作**都抛 `TypeError`。

</v-click>

---
layout: section
---

# 语言钩子与资源管理

挂接协议、确定性释放

---

# well-known symbols：语言留好的钩子

`Symbol` 上的一批静态属性，作为内置行为的扩展点

| symbol | 定制的内置操作 |
| --- | --- |
| `Symbol.iterator` / `asyncIterator` | `for...of` / `for await...of` |
| `Symbol.toPrimitive` | 对象 → 原始值 |
| `Symbol.toStringTag` | `[object Xxx]` 标签 |
| `Symbol.hasInstance` | `instanceof` 判定 |
| `Symbol.species` | 派生对象的构造器 |
| `Symbol.dispose` / `asyncDispose` | `using` 释放钩子（ES2026） |

键是 symbol → 这些定制对普通属性枚举**不可见**，不与业务字段冲突。

---

# `Symbol.toPrimitive`：定制类型转换

引擎按 `hint`（`"number"` / `"string"` / `"default"`）调用它

```js
const money = {
  amount: 42,
  [Symbol.toPrimitive](hint) {
    if (hint === "number") return this.amount; // +money、money * 2
    if (hint === "string") return `¥${this.amount}`; // `${money}`
    return `Money(${this.amount})`; // default：== 比较、拼接
  },
};
+money; // 42
`${money}`; // "¥42"
```

---

# `toStringTag` 与 `hasInstance`

```js
class Temperature {
  get [Symbol.toStringTag]() {
    return "Temperature"; // 定制 toString 标签
  }
}
Object.prototype.toString.call(new Temperature()); // "[object Temperature]"

// 定制 instanceof（无需真的在原型链上）
const Even = { [Symbol.hasInstance]: (n) => Number.isInteger(n) && n % 2 === 0 };
4 instanceof Even; // true；5 instanceof Even → false
```

---

# `Symbol()` vs `Symbol.for()`

```js
Symbol("id") === Symbol("id"); // false（各自唯一）
Symbol.for("id") === Symbol.for("id"); // true（全局注册表同一个）
Symbol.keyFor(Symbol.for("id")); // "id"（反查 key）
Symbol.keyFor(Symbol("id")); // undefined（非注册 symbol）
```

<v-click>

- `Symbol(desc)`：每次全新且不可再得 → 适合做私有键、避免冲突
- `Symbol.for(key)`：走**全局注册表**，同 key 同值 → 适合跨模块 / 跨 realm 共享协议键

</v-click>

---

# 资源管理：`using`（ES2026）

JS 长期缺「确定性释放资源」的语法，过去只能手写 `try...finally`

```js
class FileHandle {
  constructor(name) { this.name = name; }
  [Symbol.dispose]() {
    console.log(`关闭 ${this.name}`); // 块尾自动调用
  }
}
function readConfig() {
  using f = new FileHandle("config.json");
  return "data"; // ← 离开函数体时自动「关闭」，即便中途 return / 抛错
}
```

对标 C# `using`、Java try-with-resources、Python `with`。

<v-click>

多个 `using` 按**后声明先释放**（栈式）清理，符合「依赖反序拆除」的直觉。

</v-click>

---

# 释放期的错误：`SuppressedError`

块内已抛错、释放时又抛错，两者**聚合进一个 `SuppressedError`**，信息都不丢

```js
try {
  using r = makeResource(); // 假设 dispose 时也会抛错
  throw new Error("业务错误");
} catch (e) {
  e; // SuppressedError
  e.error; // 释放阶段的新错误
  e.suppressed; // 原始的「业务错误」
}
```

让「先发生的错」与「清理时的错」两条线索都能被排查。

---

# `await using`：异步释放

释放本身是异步的（关连接、刷缓冲）时使用

```js
class DbConnection {
  async [Symbol.asyncDispose]() {
    await this.close(); // 块尾会被 await
  }
}

async function query() {
  await using conn = await openConnection();
  return conn.run("SELECT 1");
} // ← 离开时自动 await conn[Symbol.asyncDispose]()
```

块尾调 `[Symbol.asyncDispose]()` 并 `await` 之（只有 `dispose` 则回退到它）。

---

# 手动版：`DisposableStack`

需**编程式**聚合一组资源（数量动态、需转移所有权）时；异步版 `AsyncDisposableStack`

```js
const stack = new DisposableStack();
stack.use(new FileHandle("x")); // 登记带 [Symbol.dispose] 的资源
stack.defer(() => console.log("收尾")); // 登记纯收尾回调
stack.dispose(); // 后进先出：收尾 → 关闭 x
```

| 方法 | 作用 |
| --- | --- |
| `use(res)` | 登记带 `[Symbol.dispose]` 的资源并返回它 |
| `adopt(value, onDispose)` | 为无 dispose 方法的值附加释放函数 |
| `defer(onDispose)` | 登记纯收尾回调（无关联资源） |
| `move()` | 把资源转移到新栈、原栈清空（防重复释放） |

---

# 资源管理：尚未 Baseline

::: warning 现状（2026-06 核）
显式资源管理已达 **Stage 4、并入 ES2026**，但**还不是 Baseline**。
:::

<v-click>

- **已支持**：V8（Chrome / Edge 134+）、Node.js 24+、TypeScript 5.2+
- **跟进中**：Safari、Firefox 尚未稳定发布
- **降级**：旧环境用 `core-js` polyfill，或退回手写 `try...finally`
- **特性检测**：`typeof Symbol.dispose !== "undefined"`

</v-click>

---

# `WeakRef`：弱引用（ES2021）

持有对一个对象的**弱引用**，不阻止它被回收

```js
let big = { data: new Array(1_000_000) };
const ref = new WeakRef(big);

ref.deref(); // → 那个对象（只要还活着）
big = null; // 去掉唯一强引用
// 某次 GC 之后：
ref.deref(); // 可能是 undefined（已被回收）——何时发生不可预测
```

`ref.deref()` 返回对象，已被回收则返回 `undefined`。

---

# `FinalizationRegistry`：GC 回调

注册对象，待其被回收后**尽力**调用清理回调

```js
const registry = new FinalizationRegistry((held) => {
  console.log(`对象已被回收，关联值：${held}`); // 何时/是否调用都无保证
});
let cache = { id: "sess-1" };
registry.register(cache, "sess-1", cache); // 第三参是注销令牌
cache = null; // 之后某个时刻，回调「可能」触发
```

<v-click>

::: danger GC 非确定，绝不可依赖
回调可能延迟很久、可能到程序退出都不触发、引擎行为各异。✅ 仅用于内存调试 / 缓存**辅助**失效等「漏掉也无大碍」处；❌ 关文件 / 释放锁 / 提交事务等**必须发生**的清理请用 `using` 或 `try...finally`。
:::

</v-click>

---

# Baseline / 版本一览

| 特性 | 版本 | 状态（2026-06 核） |
| --- | --- | --- |
| 生成器 / 迭代协议 / `yield*` | ES2015 | ✅ Baseline 广泛可用 |
| `Proxy` / `Reflect` / well-known symbols | ES2015 | ✅ Baseline 广泛可用 |
| 异步生成器 / `for await...of` | ES2018 | ✅ Baseline 广泛可用 |
| `WeakRef` / `FinalizationRegistry` | ES2021 | ✅ 广泛可用（尽力而为） |
| `Array.fromAsync` / Iterator Helpers | ES2024/25 | 🟡 Baseline 新近可用 |
| `using` / `Symbol.dispose` / `DisposableStack` | ES2026 | 🟠 **非 Baseline** |

---

# 最佳实践小结

<v-click>

- **生成器**：想被遍历用 `yield`、`return` 只收尾；可复用容器把生成器藏进 `[Symbol.iterator]()` 每次新建
- **异步流**：`for await...of` 流式处理；`Array.fromAsync` 只物化有限序列
- **Proxy**：陷阱里用 `Reflect.*` 转发，`get`/`set` 务必透传 `receiver`
- **symbols**：跨模块共享协议键用 `Symbol.for`；私有键用 `Symbol()`
- **资源**：`using`（确定性）做关键清理；`WeakRef`/`FinalizationRegistry` 只做辅助、**勿依赖回收时机**

</v-click>

---
layout: center
class: text-center
---

# 谢谢

生成器让函数能暂停，Proxy/Reflect 让对象按你的规则运转，symbols/using 把它们挂进语言——这就是元编程的全部魔法

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
