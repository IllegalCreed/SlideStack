---
theme: seriph
background: https://cover.sli.dev
title: TypeScript 语言核心
info: |
  Presentation TypeScript —— JavaScript 的超集，用静态类型把大规模工程的可维护性提升一个量级。

  Learn more at [https://www.typescriptlang.org](https://www.typescriptlang.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl font-mono font-bold">TS</span>
</div>

<br/>

## TypeScript —— JavaScript 的静态类型超集

编译期抓 bug、类型即文档，结构化类型 + 推断 + 窄化撑起现代前端与 Node 工程

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://www.typescriptlang.org/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
今天聊 TypeScript —— JavaScript 的超集，在 JS 之上叠加一套可选的、编译期的静态类型系统。

它由微软开发、Anders Hejlsberg 主导。核心价值一句话：TS = JavaScript + 静态类型 + 编译期检查。

今天顺序：定位与三个心智 → 基础注解 → 结构化类型 → 联合交叉字面量 → interface vs type → 特殊类型 → 推断与窄化 → 类型谓词与可辨识联合 → 泛型与工具类型 → 类型体操（keyof/条件/映射/模板字面量）→ as const/satisfies → tsconfig → 枚举与装饰器 → 6.0/7.0 → 总结。

当前稳定版是 TypeScript 6.0，npm latest 是 6.0.3，它是迈向 7.0 原生 Go 重写编译器的过渡版本。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# TypeScript 是什么

一句话：**JS 超集 + 静态类型 + 编译期检查**

<v-clicks>

- **超集**：任何合法 JS 都是合法 TS，`.js` 可逐步迁移
- **静态检查**：运行前就抓出「类型对不上」的 bug
- **类型擦除**：编译后类型全删，产物是普通 JS
- **不改语义**：只加约束，不引入运行时开销

</v-clicks>

<div v-click class="mt-4 text-sm">

> 当前稳定版 **TypeScript 6.0**（`latest` 6.0.3），迈向 7.0（Go 原生重写、并行类型检查）的过渡版。

</div>

<!--
TypeScript 不是新语言，是 JavaScript 的超集。这意味着任何合法的 JS 都是合法的 TS，把 js 文件改名 ts 通常直接能编译。

它解决的痛点是 JS 动态类型——很多错误只有运行时才暴露。TS 让类型检查器在代码运行前就指出这些问题。

最重要的一点是类型擦除：类型注解、interface、type 编译后全部删除，产物是干净的 JS，不引入任何运行时开销，也不改变 JS 语义。

当前稳定版是 6.0，是过渡到 7.0 的版本。7.0 用 Go 原生重写编译器，带来并行类型检查和数量级提速。
-->

---

# 三个必须建立的心智

<v-clicks>

- **心智一 · 超集**：TS 在 JS 上只做「加法」——加类型注解，不改语法语义
- **心智二 · 类型擦除**：类型是**编译期**概念，运行后**拿不到**类型 → 运行时校验要用 Zod
- **心智三 · 能推断就别注解**：TS 从初始值自动推断，注解只用在参数、公共 API、要固定类型处

</v-clicks>

```ts
interface User { id: number; name: string }
const u: User = { id: 1, name: "Ada" };
// 编译后 ↓ 类型全部消失
// const u = { id: 1, name: "Ada" };
```

<!--
三个心智。

第一，超集，TS 在 JS 上只做加法，加类型注解，不改语义。

第二，也是最容易忽略的——类型擦除。类型是编译期概念，编译后 interface、类型注解全删除，运行时根本拿不到类型信息。所以你无法在运行时问一个值是不是 User。校验接口响应、表单这类外部数据，必须用 typeof、instanceof 或者 Zod、Valibot 这类运行时校验库。类型只保编译期，不保运行时。

第三，能推断就别注解。TS 推断很强，绝大多数局部变量不用写类型。显式注解主要用在函数参数、公共 API 边界、想固定类型这三处。过度注解反而啰嗦。
-->

---

# 基础类型注解

```ts
// 原始类型一律小写；数组两种等价写法
let s: string = "hi";
let n: number = 42;
let a1: number[] = [1, 2, 3];
let a2: Array<number> = [1, 2, 3];

// 元组：定长、逐位置定类型
let pair: [string, number] = ["age", 18];

// 对象：可选 ?、只读 readonly、可选链
function print(o: { first: string; last?: string }) {
  console.log(o.first, o.last?.toUpperCase());
}
```

<div v-click class="mt-2 text-sm">

> 注解写在标识符**之后**：`x: 类型`；函数返回类型在参数列表右括号后。原始类型用小写 `string`，别用包装对象 `String`。

</div>

<!--
基础注解速览。

原始类型一律用小写：string、number、boolean、bigint、symbol。大写的 String 是包装对象类型，别用。

数组有两种等价写法：number 方括号，或者 Array 尖括号 number。

元组是定长、逐位置定类型的数组，比如 pair 第一位 string、第二位 number，React 的 useState 返回值就是元组。

对象类型里，问号表示可选属性，readonly 表示只读，访问可选属性用可选链问号点避免访问 undefined。

语法要点：类型注解写在标识符之后用冒号，这是后置风格，不是 Java 的前置类型。
-->

---

# 结构化类型：TS 的地基

兼容性看**形状**，不看名称（duck typing）

```ts
interface Point { x: number; y: number }
class Vec2 { x = 0; y = 0; z = 0 }
const p: Point = new Vec2(); // ✅ 有 x、y 就兼容，无需 implements
```

<v-clicks>

- 对比 Java/C# 的**名义类型**（靠类名/`implements`），TS 更贴合 JS 匿名对象习惯
- **多余属性检查**：新鲜的对象**字面量**多出未声明属性会报错（专抓拼写）

</v-clicks>

```ts
interface Options { width: number }
const a: Options = { width: 10, widht: 20 }; // ❌ widht 拼错被拦
```

<!--
结构化类型是 TS 类型系统的地基。判断类型 A 能否赋给 B，只看 A 是否具备 B 要求的全部成员，跟叫什么名字、有没有显式声明实现关系无关。

看例子，Vec2 没有任何 implements Point 的声明，但它有 x 和 y，多一个 z 无妨，结构上就兼容 Point。

这和 Java、C# 的名义类型相反，名义类型必须显式 implements 同名类型才兼容。TS 选结构化，是因为 JS 大量使用匿名对象和鸭子类型。

有个重要例外叫多余属性检查，也叫 freshness：把全新的对象字面量直接赋给带类型的目标时，多出未声明的属性会报错，专门抓拼写错误，比如把 width 拼成 widht。但如果先把字面量赋给变量再传，就绕过了这个检查。
-->

---

# 联合、交叉、字面量、元组

```ts
type Align = "left" | "right" | "center"; // 字面量联合
type A = { id: number } & { name: string }; // 交叉：合并对象
function len(x: string | string[]) { return x.length; } // 联合
```

<v-clicks>

- **联合 `A | B`**：值是其一，用前需**收窄**
- **交叉 `A & B`**：同时满足，常用于合并对象；`string & number` = `never`
- **字面量类型**：把取值精确到具体值，比 `string` 精确、比 `enum` 轻量
- **元组 `[string, number]`**：定长有序，可选 `?`、剩余 `...`

</v-clicks>

<!--
四种常用的组合类型。

联合类型 A 竖线 B，值是 A 或 B 之一，使用前通常要收窄到具体分支。像 Align 这样的字符串字面量联合非常常用，把取值精确约束到三个字符串。

交叉类型 A 与 B，值同时是 A 和 B，最常见用途是合并多个对象类型。注意原始类型的交叉，比如 string 与 number，没有值能同时满足，结果是 never，所以交叉主要对对象类型有意义。

字面量类型把取值精确到具体值，比宽泛的 string 精确，比 enum 轻量，还能自动补全。

元组是定长、逐位置定类型的数组，支持可选元素、具名、剩余元素。
-->

---

# interface vs type

<div class="text-sm">

| 维度 | `interface` | `type` |
| --- | --- | --- |
| 对象形状 | ✅ | ✅ |
| 声明合并（同名自动合并） | ✅ | ❌ 报错 |
| 扩展 | `extends` | 交叉 `&` |
| 联合 / 元组 / 原始别名 | ❌ | ✅ |
| 条件 / 映射 / 模板类型 | ❌ | ✅ |

</div>

<div v-click class="mt-3 text-sm">

> **经验**：对象公开形状、需 `extends`/声明合并 → `interface`；联合/元组/条件/映射类型 → `type`。团队统一即可。

</div>

<!--
interface 和 type 都能描述对象形状，很多时候可互换，但各有专长。

interface 的独门能力是声明合并：多次声明同名 interface 会自动合并成员，也因此能再打开已有 interface 追加属性，比如给全局 Window 扩展字段。type 别名同名再声明会直接报错。

反过来，type 能给联合、交叉、元组、原始类型、条件类型、映射类型起名，这些 interface 都做不到。

经验法则：描述对象或类的公开形状、需要被 extends 或声明合并时用 interface；需要联合、元组、条件、映射类型时用 type。别教条，团队保持一致即可。
-->

---

# any / unknown / never / void

<div class="text-sm">

| 类型 | 含义 | 用途 |
| --- | --- | --- |
| `any` | 关闭检查的逃生舱 | 尽量避免 |
| `unknown` | 类型安全的**顶层**类型 | 外部数据，用前先收窄 |
| `never` | **底类型**（空集） | 抛错/死循环返回、穷尽检查 |
| `void` | 函数**无返回值** | 回调、无返回函数 |

</div>

```ts
function fail(m: string): never { throw new Error(m); }
let y: unknown = getData();
if (typeof y === "string") y.trim(); // unknown 必须先收窄
```

<!--
四个容易混的特殊类型。

any 是关闭检查的逃生舱，任意操作都不报错，等于退回无类型的 JS，能不用就不用，开 noImplicitAny 拦隐式 any。

unknown 是类型安全的顶层类型，一切的父类型，任何值都能赋给它，但使用前必须先收窄或断言，否则报错。接收不确定的外部数据优先用 unknown，逼自己先校验。

never 是底类型，空集，表示不可能的值，比如永远抛错或死循环的函数返回类型是 never，被穷尽收窄后剩下的空集也是 never，常用于穷尽检查。

void 表示函数无返回值，返回 undefined。注意 void 和 never 不同：void 是正常返回但没值，never 是根本返回不了。
-->

---

# 类型推断与上下文类型

```ts
let n = 42;              // number
const s = "hi";          // "hi"（const 保留字面量）
const nums = [1, 2, 3];  // number[]

// 上下文类型：回调参数从上下文反推
["Ada"].forEach((name) => name.toUpperCase()); // name: string
window.addEventListener("click", (e) => {});    // e: MouseEvent
```

<div v-click class="mt-2 text-sm">

> 变量从初值推断、函数返回从 `return` 推断、回调参数从**上下文类型**反推——这是「能推断就别注解」的底气。`let` 拓宽为 `string`，`const` 保留字面量。

</div>

<!--
TS 推断很强，多数场景无需手写类型。变量从初始值推断，函数返回从 return 推断。

有个容易忽略的机制叫上下文类型：当函数出现在已知类型的位置，比如作为回调传入 forEach 或 addEventListener，它的参数类型能从上下文反向推断，name 自动是 string，e 自动是 MouseEvent，都不用注解。

这就是能推断就别注解的底气，过度注解回调参数反而多余。

还有个细节：let 声明的字面量会被拓宽，比如 let s 等于 hello 推断为 string；const 保留字面量类型，推断为 hello。
-->

---

# 窄化：控制流分析

联合类型用前要**收窄**，TS 靠控制流分析在分支内缩小类型

```ts
function pad(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input; // padding: number
  }
  return padding + input;               // padding: string
}
```

<v-clicks>

- **`typeof`** 守卫：`'string'`/`'number'`/`'object'`… ⚠️ **`typeof null === 'object'`**
- **真值**：`if (x)` 排除 `0`/`''`/`null`/`undefined`（空串也排）
- **相等**：`x != null` 一次排除 `null` + `undefined`

</v-clicks>

<!--
联合类型使用前要收窄。窄化指 TS 根据判断语句，在特定分支内把变量类型缩小到更精确的类型。驱动它的是控制流分析，TS 跟踪代码执行路径，推断每个位置变量的当前类型。

看 pad 函数，typeof 判断 number 的分支里 padding 就是 number，else 分支里已经排除了 number，所以是 string。

几种基础守卫：typeof 守卫，注意一个历史坑，typeof null 返回 object 而不是 null，所以 typeof 等于 object 的分支里值可能是 null。

真值窄化，if x 会排除所有假值，包括 0、空串、null、undefined，注意空串也被排除。

相等窄化，x 不等于 null 用宽松不等号，能一次排除 null 和 undefined，但保留空串。
-->

---

# 更多守卫：in / instanceof

```ts
type Fish = { swim(): void };
type Bird = { fly(): void };

function move(a: Fish | Bird) {
  if ("swim" in a) return a.swim(); // in：按属性存在收窄
  return a.fly();
}

function h(x: Date | string) {
  if (x instanceof Date) return x.toISOString(); // 按原型链收窄
  return x.toUpperCase();
}
```

<div v-click class="mt-2 text-sm">

> **`in`** 按属性是否存在收窄；**`instanceof`** 按原型链收窄（对 class / 内置构造函数有效）。

</div>

<!--
除了 typeof、真值、相等，还有两个守卫。

in 操作符守卫：按属性是否存在收窄。比如判断 swim 在不在 a 里，在就收窄为 Fish，否则是 Bird。适合区分没有公共判别属性、但结构不同的类型。

instanceof 守卫：按原型链收窄，对 class 和内置构造函数有效。比如判断 x instanceof Date，成立就收窄为 Date，可以调 toISOString。

这两个加上前面的 typeof、真值、相等，覆盖了绝大多数内联收窄场景。
-->

---

# 类型谓词与断言函数

```ts
// 类型谓词：返回 true 时把实参收窄
function isFish(p: Fish | Bird): p is Fish {
  return (p as Fish).swim !== undefined;
}
if (isFish(pet)) pet.swim(); else pet.fly();

// 断言函数：通过后「此后」都收窄
function assertStr(v: unknown): asserts v is string {
  if (typeof v !== "string") throw new Error("not string");
}
```

<div v-click class="mt-2 text-sm">

> ⚠️ 谓词的**正确性由你保证**——`p is Fish` 是承诺，函数体写错了 TS 也会信。

</div>

<!--
当判断逻辑复杂或需要复用时，把它封装成守卫函数。

类型谓词，写法是参数 is 类型。当函数返回 true 时，TS 把传入的实参收窄。比如 isFish 返回 p is Fish，调用 if isFish pet 成立分支里 pet 就是 Fish。这让你把复杂判断封进一个可复用的守卫，比反复内联 typeof、in 更清晰。

断言函数是另一种形态，写法是 asserts 参数 is 类型。它通过则此后所有代码都收窄，不通过则抛错。比如 assertStr 通过后 v 就是 string。

一个重要警告：谓词的正确性由你负责。p is Fish 是一个承诺，TS 会信任你的返回值，如果函数体逻辑写错，明明是 Bird 却返回 true，TS 不会拦，收窄结果就是错的。
-->

---

# 可辨识联合 + never 穷尽

建模「多形态之一」的**最佳实践**

```ts
type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; side: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.r ** 2;
    case "square": return s.side ** 2;
    default:
      const _c: never = s; // 新增成员漏处理 → 编译报错
      return _c;
  }
}
```

<!--
可辨识联合是 TS 建模一个值有多种形态的最佳实践。

做法是给联合的每个成员加一个同名、字面量类型的判别属性，约定俗成叫 kind、type 或 tag。看这里，每个成员都有 kind，值分别是 circle 和 square。对 kind 做 switch，TS 就能把类型精确收窄到对应成员，circle 分支里 s 有 r，square 分支里 s 有 side。

再配合 never 做穷尽检查。在 default 分支把已被穷尽的值赋给一个 never 变量。如果所有成员都处理了，剩余类型正好是 never，赋值合法。一旦以后往 Shape 新增成员却忘了加 case，剩余类型不再是 never，这行赋值就编译报错，逼你补全分支。

这把漏处理某种情况从运行时崩溃提前到编译期，是 TS 最有价值的工程范式之一。
-->

---

# 泛型与约束

```ts
function identity<T>(x: T): T { return x; }
identity("hi"); // 推断 T = string，无需显式

// 约束：extends 限定必备成员
function longest<T extends { length: number }>(a: T, b: T) {
  return a.length >= b.length ? a : b;
}
// 用一个参数约束另一个：类型安全按键取值
function get<T, K extends keyof T>(o: T, k: K): T[K] { return o[k]; }
```

<div v-click class="mt-2 text-sm">

> 泛型**保留**类型关系（`any` 会丢）；约束只加「体内真正需要」的成员；能推断就别显式传。

</div>

<!--
泛型让函数在保持类型关系的前提下适配多种类型。

经典的 identity，类型参数 T 捕获入参类型再返回。调用 identity hi，T 从实参推断为 string，无需显式写尖括号 string。对比 any，any 会丢掉类型信息，泛型把入参类型等于出参类型这层关系保留下来。

裸类型参数不能假设有任何成员，要访问成员得用 extends 约束。比如 longest 约束 T 必须有 length，体内才能安全访问。

最常见的进阶用法是用一个类型参数约束另一个：get 函数，K extends keyof T，实现类型安全的按键取值，返回类型精确到 T 中 K 对应的类型，传错键名会报错。

设计建议：能推断就别显式；只约束体内真正需要的成员；泛型优于 any。
-->

---

# 工具类型全家桶

<div class="text-sm">

| 工具 | 作用 | 工具 | 作用 |
| --- | --- | --- | --- |
| `Partial<T>` | 全可选 | `Pick<T,K>` | 保留键 |
| `Required<T>` | 全必填 | `Omit<T,K>` | 排除键 |
| `Readonly<T>` | 全只读 | `Record<K,V>` | 键值映射 |
| `Exclude<U,M>` | 联合剔除 | `Extract<U,M>` | 联合提取 |
| `NonNullable<T>` | 去空值 | `Awaited<T>` | 解包 Promise |
| `ReturnType<T>` | 返回类型 | `Parameters<T>` | 参数元组 |

</div>

<div v-click class="mt-3 text-sm">

> 全部由 `keyof` / 映射类型 / 条件类型 / `infer` 实现（源码在 `lib.es5.d.ts`）——读懂它们即入门类型编程。

</div>

<!--
TS 内置一批工具类型，覆盖日常绝大多数类型变形需求。

属性修饰：Partial 全可选，常用于部分更新入参；Required 全必填；Readonly 全只读。

对象裁剪：Pick 按键白名单保留；Omit 按键黑名单排除；Record 构造键值映射对象。

联合裁剪：Exclude 从联合剔除可赋给 M 的成员；Extract 提取；NonNullable 去掉 null 和 undefined。

函数相关：ReturnType 抽返回类型；Parameters 抽参数元组。异步：Awaited 递归解包 Promise。

关键认知：这些工具类型全部由 keyof、映射类型、条件类型、infer 实现，源码就在 lib.es5.d.ts。读懂 Partial、Exclude、ReturnType 的实现，就掌握了类型编程的核心机制，这正是下面几页要拆的。
-->

---

# keyof / typeof / 索引访问

```ts
interface User { id: number; name: string }

type Keys = keyof User;       // "id" | "name"（键联合）
type NameT = User["name"];    // string（索引访问）
type Vals = User[keyof User]; // number | string（所有值）

// 类型位置的 typeof：从值反推类型
const cfg = { host: "x", port: 5432 };
type Cfg = typeof cfg;        // { host: string; port: number }
```

<div v-click class="mt-2 text-sm">

> 经典组合：`typeof Obj[keyof typeof Obj]` 从 `as const` 对象造出值的字面量联合。

</div>

<!--
三个基础的类型运算符，是类型体操的字母表。

keyof T 取 T 所有键组成的字面量联合，比如 keyof User 是 id 竖线 name。

索引访问 T 方括号 K，按键取出属性的类型，User 方括号 name 是 string。配合 keyof，User 方括号 keyof User 取到所有值类型的联合。

类型位置的 typeof，注意是在类型上下文里用，它取一个值或变量的静态类型，用于反推复用。比如从 cfg 对象反推出它的类型 Cfg。它和运行时的 typeof 名字相同但语境不同，一个在类型位置返回类型，一个在值位置返回字符串。

一个经典组合：typeof 对象 方括号 keyof typeof 对象，能从 as const 对象造出值的字面量联合，是替代 enum 的常用手法。
-->

---

# 条件类型与 infer

```ts
// 类型级三元：可赋值给 U 取 X 否则 Y
type IsStr<T> = T extends string ? true : false;

// infer：在 extends 里「捕获」内部类型
type Elem<T> = T extends Array<infer E> ? E : T;
type E1 = Elem<number[]>;              // number
type R<T> = T extends (...a: any) => infer V ? V : never; // ReturnType 原理
```

<v-clicks>

- **分布式**：裸类型参数对联合**逐个分布**（`ToArray<A|B>` = `A[]|B[]`）
- 用 `[T] extends [U]` **关闭分布**（把联合当整体）

</v-clicks>

<!--
条件类型是类型级的三元判断，T extends U 问号 X 冒号 Y，若 T 可赋值给 U 取 X 否则取 Y。比如 IsStr 判断是不是 string。

infer 是精华，只能出现在 extends 子句里，用于声明并捕获一个待推断的类型变量。比如 Elem，如果 T 是数组，就把元素类型捕获为 E 返回。这是从复合类型里解构内部类型的关键机制，ReturnType、Parameters、Awaited 都靠它，最后一行就是 ReturnType 的原理，用 infer V 捕获函数返回类型。

还有一个必须掌握的行为叫分布式条件类型：当条件类型作用于裸类型参数且该参数是联合时，会对每个成员分别计算再合并。比如 ToArray 作用于 A 联合 B 会分布成 A 数组联合 B 数组。

不想分布时，把两侧都用元组包裹，中括号 T extends 中括号 U，联合就被当整体处理。这是写工具类型时的常见坑。
-->

---

# 映射类型与模板字面量

```ts
// 映射类型：遍历键造类型 + 修饰符增删
type Mutable<T> = { -readonly [K in keyof T]: T[K] }; // 去只读
type Concrete<T> = { [K in keyof T]-?: T[K] };        // 去可选

// 键重映射 as + 模板字面量类型
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
};
type Route = `/${"en" | "zh"}/home`; // "/en/home" | "/zh/home"
```

<div v-click class="mt-2 text-sm">

> 映射修饰符 `+/-readonly`、`+/-?`；键重映射 `as`（4.1）改键名、映射到 `never` 过滤键；模板字面量在类型层拼字符串。

</div>

<!--
映射类型和模板字面量类型，是类型体操的重头戏。

映射类型，花括号 K in keyof T，遍历 T 的键造出新类型，是 Partial、Readonly 的实现基础。配合修饰符增删：减号 readonly 去掉只读，得到 Mutable；K 后面减号问号去掉可选，得到 Concrete，也就是 Required 的原理。加号是默认，减号是移除。

键重映射用 as 子句，4.1 引入，能改写键名。配合模板字面量类型和内置 Capitalize，Getters 把每个属性 name 改写成 getName 的 getter 类型。把某个键映射到 never 还能过滤掉它。

模板字面量类型把字符串拼接带到类型层，语法和 JS 模板字符串一致但作用在类型上。比如 Route，联合会自动组合，得到 斜杠 en 斜杠 home 联合 斜杠 zh 斜杠 home。

这些机制组合起来就能写出 DeepReadonly 这类递归类型，但要克制，别写成无人能维护的类型天书。
-->

---

# as const 与 satisfies

```ts
// as const：收窄为最窄只读字面量类型
const routes = ["home", "about"] as const; // readonly ["home","about"]
type Route = typeof routes[number];        // "home" | "about"

// satisfies（4.9）：校验 + 保留精确推断
type Palette = Record<string, [number, number, number] | string>;
const p = { red: [255, 0, 0], black: "#000" } satisfies Palette;
p.red[0];              // ✅ TS 知道 red 是元组
p.black.toUpperCase(); // ✅ TS 知道 black 是 string
```

<div v-click class="mt-2 text-sm">

> `as` 会拓宽/覆盖类型（不安全）；直接注解会拓宽值；**`satisfies` 既约束又不丢精度**。

</div>

<!--
两个现代且高频的特性。

as const 是 const 断言，把值收窄为最窄的只读字面量类型：属性变 readonly、字面量不再拓宽、数组变只读元组。它是类型层面的收窄，不等同于运行时 Object.freeze。经典用法是从数组或对象造字面量联合，比如 routes as const 再取 typeof routes 方括号 number 得到 home 联合 about。

satisfies 是 4.9 引入的，解决既想校验类型又想保留精确推断的两难。对比：直接注解变量类型会把值拓宽成声明类型，丢失精度；as 断言会覆盖类型、不安全、拼错也不报。satisfies 既校验表达式满足 Palette，又保留每个属性的精确类型，所以 p.red 知道是元组、p.black 知道是 string，两全其美。

一句话：想约束结构又不牺牲精度，用 satisfies，别用 as。
-->

---

# tsconfig 关键项

<div class="text-sm">

| 选项 | 推荐 | 说明 |
| --- | --- | --- |
| `strict` | `true` | 严格家族总闸，新项目必开 |
| `target` / `lib` | `es2022` | 产物语法 / 内置 API |
| `module` | `esnext` / `nodenext` | 产物模块格式 |
| `moduleResolution` | `bundler` | 打包器项目首选 |
| `paths` | `@/*` | 别名，运行时需配套 |

</div>

<v-clicks>

- **strict 家族** = `noImplicitAny` + `strictNullChecks` + `strictFunctionTypes` + …
- 打包器（Vite/webpack）→ `module: esnext` + `moduleResolution: bundler`

</v-clicks>

<!--
tsconfig 抓住几组核心即可。

strict 是最重要的开关，是一组严格检查的总闸，一次开启 noImplicitAny、strictNullChecks、strictFunctionTypes、strictPropertyInitialization 等一整组。其中 strictNullChecks 最有价值，让 null 和 undefined 必须显式写进类型。新项目一律全开。

target 控制产物语法级别，lib 控制可用的内置 API 类型，module 控制产物模块格式，moduleResolution 控制模块解析策略。

组合上最常见两类：用打包器比如 Vite、webpack，就 module esnext 加 moduleResolution bundler，允许无扩展名导入；Node 直接跑就用 nodenext 或 node20。

paths 是路径别名，注意它只影响 TS 的类型解析，运行时要让别名生效需要打包器或 tsconfig-paths 配套，否则编译过、运行报找不到模块。
-->

---

# 枚举与装饰器的取舍

<v-clicks>

- **`enum`**：生成运行时对象，数字枚举有反向映射；字符串枚举调试友好
- ⚠️ **`const enum`**：编译内联、无运行时对象，但与 `isolatedModules`（Babel/esbuild）**冲突**、跨包版本坑 → 慎用/禁用
- ✅ **优先 `as const` 对象 + 索引联合**：贴近标准 JS、无坑
- **装饰器**：旧版需 `experimentalDecorators`（Angular/Nest/TypeORM）；**标准装饰器自 5.0 起免标志**，语义不同

</v-clicks>

```ts
const Dir = { Up: "UP", Down: "DOWN" } as const;
type Dir = typeof Dir[keyof typeof Dir]; // "UP" | "DOWN"
```

<!--
两个需要权衡的特性。

先说枚举。普通 enum 会生成运行时对象，数字枚举还带反向映射，E 方括号 0 等于 A；字符串枚举调试更友好。

const enum 会在编译时内联成字面量、不留运行时对象，性能好但坑很大：它与 isolatedModules，也就是 Babel、esbuild、SWC 这类单文件转译器不兼容，因为单文件转译看不到枚举定义无法内联；跨包发布时下游可能内联旧版本的值，导致和运行时不一致的诡异 bug。所以很多团队用 lint 禁用它。

官方和社区更推荐 as const 对象加索引联合，贴近标准 JS、无额外运行时坑，像底下这样就能造出 UP 联合 DOWN。

再说装饰器，有两套并存。旧版实验性装饰器需要开 experimentalDecorators，Angular、NestJS、TypeORM 大量依赖。标准装饰器对应 TC39 Stage 3 提案，从 5.0 起无需任何标志，是未来方向，但两套语义并不完全相同。
-->

---

# TypeScript 6.0 / 7.0

**6.0（当前稳定，`latest` 6.0.3）= 过渡版**，升级默认值 + 弃用旧选项

<div class="text-sm">

| 选项 | 旧默认 | 6.0 新默认 |
| --- | --- | --- |
| `strict` | `false` | `true` |
| `module` | `commonjs` | `esnext` |
| `target` | `es5` | 当年 ES（`es2025`） |
| `types` | 所有 `@types` | `[]` |

</div>

<v-clicks>

- **弃用**：`es5`、`amd/umd/system`、`moduleResolution node10`/`classic`、`outFile`、`baseUrl`（7.0 移除）
- **7.0**：Go 原生重写、**并行类型检查**、数量级提速（tsgo / Corsa）

</v-clicks>

<!--
最后看版本。TypeScript 6.0 是当前稳定版，npm latest 是 6.0.3，定位为迈向 7.0 的过渡版本，主要做两件事。

第一，升级一批默认值到现代做法：strict 默认变 true、module 默认 esnext、target 默认为当年的 ES 版本现在是 es2025、types 默认变空数组。注意 types 变空数组后，用到 Node 或 Jest 全局要显式写 types node、jest。

第二，弃用一批旧选项，包括 target es5、module amd umd system、moduleResolution node10 和 classic、outFile、baseUrl，还有 esModuleInterop 等不再允许设 false。这些将在 7.0 彻底移除，升级期可用 ignoreDeprecations 6.0 缓冲。

而 7.0 是用 Go 原生重写的编译器，社区叫 tsgo 或 Project Corsa，带来并行类型检查和数量级的性能提升，专门解决类型检查慢这个 TS 最大痛点。6.0 把该弃用的弃用掉，就是为 7.0 的干净启程铺路。
-->

---
layout: intro
---

# 总结

TypeScript = **JS 超集 + 静态类型 + 编译期检查**

- **三支柱**：结构化类型（看形状）+ 类型推断 + 控制流窄化
- **类型擦除**：只保编译期，运行时校验用 Zod；类型 ≠ 运行时保证
- **建模力**：联合/泛型/`keyof`/条件/映射/模板字面量 → 可辨识联合 + `never` 穷尽是范式
- **现代实践**：`strict` 全开、`as const`/`satisfies`、`as const` 对象替代 `const enum`
- **版本**：稳定 **6.0**（过渡版），**7.0** Go 原生重写、并行类型检查

<!--
总结一下。TypeScript 是 JavaScript 的超集，核心是静态类型加编译期检查。

它靠三根支柱撑起大规模工程的可维护性：结构化类型按形状判断兼容、强大的类型推断、以及控制流窄化让联合类型安全可用。

最重要的心智是类型擦除：类型只保编译期，运行后全删，运行时校验外部数据要用 Zod、Valibot，类型不等于运行时保证。

它的建模力来自联合、泛型、keyof、条件类型、映射类型、模板字面量的组合，其中可辨识联合加 never 穷尽检查是范式级的最佳实践。

现代实践：strict 全开，用 as const 和 satisfies 保留精确类型，用 as const 对象替代有坑的 const enum。

版本上，当前稳定是 6.0 过渡版，升级了默认值、弃用了旧选项；7.0 是 Go 原生重写、并行类型检查的高性能版本。

TypeScript 用一套编译期类型系统，让 JavaScript 工程从此有了护栏。谢谢大家。
-->
