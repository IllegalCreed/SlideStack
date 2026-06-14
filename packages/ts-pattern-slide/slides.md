---
theme: seriph
background: https://cover.sli.dev
title: ts-pattern
info: |
  Presentation ts-pattern — the exhaustive Pattern Matching library for TypeScript.

  Learn more at [https://github.com/gvergnaud/ts-pattern](https://github.com/gvergnaud/ts-pattern)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎯</span>
</div>

<br/>

## ts-pattern

TypeScript 的类型安全模式匹配库：一条 `match().with().exhaustive()` 替代深层 if/else 与 switch，分支自动收窄类型，编译期检查是否漏分支

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/gvergnaud/ts-pattern" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 ts-pattern：TypeScript 的类型安全模式匹配库，作者 Gabriel Vergnaud，官方定位是「The exhaustive Pattern Matching library for TypeScript」。版本基线 5 点 x。

它把函数式语言里的模式匹配带进 TypeScript：用一条 match value 点 with pattern handler 点 exhaustive 的表达式，替代层层嵌套的 if else 和 switch。核心卖点不是运行性能，而是类型安全——每个分支命中后 handler 拿到的值会被精确收窄，末尾的 exhaustive 还能在编译期检查你有没有漏掉联合类型的某个分支。

主线：为什么用 → 基本结构 → 各种模式 → 兜底方式 → 穷尽性 → select 提取 → 判别联合 → isMatching → infer → 与 Zod 协作 → 性能边界 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用模式匹配

<v-clicks>

- switch 只能对单值做相等比较，匹配不了结构
- 嵌套 if/else 处理对象/数组时又长又难读
- switch 漏 case 编译不报错，藏成运行时 bug
- 收窄类型常要手动 as 断言，容易写错

</v-clicks>

<div v-click class="mt-6">

ts-pattern 的回应：

- 结构化模式 → **能匹配对象/数组/范围**
- 自动收窄 → **分支内类型精确，免 as**
- `.exhaustive()` → **漏分支编译报错**

</div>

<!--
为什么要专门引入模式匹配？几个老痛点。

第一，原生 switch 只能对单个值做相等比较，匹配不了对象或数组的内部结构。第二，用嵌套 if else 去判断对象、数组时，代码又长又难读。第三，switch 漏掉某个 case 时编译器不报错，等于把 bug 藏到运行时。第四，想在分支里拿到收窄后的精确类型，常常得手动写 as 断言，容易写错。

ts-pattern 针对性地回应：用结构化模式，能直接匹配对象、数组、范围；命中分支后自动收窄类型，不用 as；末尾的 exhaustive 在漏分支时直接编译报错。这三点就是它的价值主线。
-->

---

# 基本结构：三段式

```ts
import { match } from 'ts-pattern';

type Status = 'loading' | 'success' | 'error';

const msg = (s: Status) =>
  match(s)                            // ① 传入待匹配的值
    .with('loading', () => '加载中')  // ② 模式 → 处理函数
    .with('success', () => '完成')
    .with('error', () => '失败')
    .exhaustive();                     // ③ 收尾并执行
```

<div v-click class="mt-2 text-sm">

> match 是**表达式**：命中分支 handler 的返回值，就是整条表达式的返回值。

</div>

<!--
基本结构是固定的三段式。

第一段，match 括号 value，传入要匹配的值，开启匹配链。第二段，一个或多个 with，每个 with 第一个参数是模式，第二个参数是命中后执行的处理函数。第三段，末尾用 exhaustive 或 otherwise 收尾并真正执行。

最关键的一句认知：match 是表达式，不是语句。被命中的那个分支的 handler 返回值，就是整条 match 表达式的返回值，所以可以直接 const msg 等于 match 点点点，把结果赋给变量。这一点和 switch 很不一样。
-->

---

# 字面量与对象模式

```ts
type Result =
  | { status: 'success'; data: string }
  | { status: 'error'; error: Error };

match(res)
  // 对象模式：逐属性递归匹配，输入可有额外属性
  .with({ status: 'success' }, (r) => r.data)      // r 收窄到 success
  .with({ status: 'error' }, (r) => r.error.message) // r 收窄到 error
  .exhaustive();
```

<v-clicks>

- 字面量（`'success'`、`42`、`true`）按值匹配
- 对象模式是**结构性**的：只校验列出的键
- 命中后参数被收窄，访问错字段编译报错

</v-clicks>

<!--
最常用的两类模式：字面量和对象。

字面量模式就是直接写一个值，比如字符串 success、数字 42、布尔 true，按值相等匹配。

对象模式是结构性的：用一个对象当模式，ts-pattern 会逐个属性递归匹配，输入只要包含模式里列出的键、且这些键的值满足子模式就算命中，输入可以带额外属性。

重点是类型收窄：命中 status success 这个分支后，参数 r 被收窄到 success 成员，能安全访问 data；如果你在这个分支里访问 r 点 error，会直接编译报错，因为这个成员上没有 error 字段。这就是 ts-pattern 相对 switch 的安全优势。
-->

---

# 通配模式：P 命名空间

```ts
import { match, P } from 'ts-pattern';

match(input)
  .with(P.string, (s) => `字符串 ${s.length}`)  // s: string
  .with(P.number, (n) => `数字 ${n}`)           // n: number
  .with(P.boolean, () => '布尔')
  .with(P.nullish, () => '空值')                 // null | undefined
  .otherwise(() => '其它');
```

<v-clicks>

- `P` 是模式命名空间，模式几乎都从 `P.` 起手
- `P._` 匹配任意值，`P.any` 是它的**别名**
- `P.nonNullable`：除 null/undefined 外的任意值

</v-clicks>

<!--
P 是模式命名空间，写匹配条件时几乎都从 P 点开始。

基础类型通配：P 点 string 匹配任意字符串，P 点 number 匹配任意数字，还有 P 点 boolean、P 点 bigint、P 点 symbol。匹配的同时会把 handler 参数收窄为对应类型。P 点 nullish 匹配 null 或 undefined。

特别强调一个高频混淆点：通配符是 P 点下划线，匹配任意值；P 点 any 是 P 点下划线的别名，两者完全等价、行为一致，别误以为是两种不同的东西。另外 P 点 nonNullable 匹配除 null 和 undefined 外的任意值。
-->

---

# 三种收尾：exhaustive / otherwise / run

| 收尾 | 穷尽检查 | 用途 |
|---|---|---|
| `.exhaustive()` | ✅ 漏分支编译报错 | 默认首选，拿编译期安全 |
| `.otherwise(fn)` | ⚠️ 用通配兜底放宽 | 输入是开放类型时兜底 |
| `.run()` | ❌ 不检查（不安全） | 明确不需要穷尽时 |

```ts
// otherwise 等价于 .with(P._, fn).exhaustive()
match(n).with(1, () => 'one').otherwise(() => 'other');
```

<!--
匹配的收尾有三种方式，差别在「是否做穷尽检查」。

第一，exhaustive，带编译期穷尽检查，漏掉联合类型的某个分支就编译报错。这是默认首选，用它换编译期安全。

第二，otherwise，传一个兜底处理函数，当前面所有 with 都没命中时执行它。它等价于 with P 点下划线 fn 再 exhaustive，因为有了通配兜底，编译器认为所有情况都覆盖了，所以放宽了穷尽要求。输入是 number、string 这种开放类型、没法穷尽时用它。

第三，run，执行但不做穷尽检查，是不安全的，即使漏分支也能编译通过，运行时碰到未覆盖的值才出问题。只在你明确不需要穷尽保证时才用。
-->

---

# 多模式与 P.union

```ts
// 多模式：在 handler 前并列多个模式，命中任一即执行
match(tag)
  .with('h1', 'h2', 'h3', () => '标题')
  .with('p', () => '段落')
  .exhaustive();

// P.union：逻辑或，可嵌进对象
match(input)
  .with({ type: P.union('user', 'org') }, (x) => x.name)
  .otherwise(() => '');
```

<div v-click class="mt-2 text-sm">

> ⚠️ `.with(['a','b'], fn)` 不是三选一，而是「匹配一个二元组」，语义完全不同。

</div>

<!--
要让多个值走同一处理逻辑，有两种写法。

第一种是多模式：在 handler 之前并列多个模式，比如 with h1 h2 h3 再跟处理函数，命中其中任意一个就执行。

第二种是 P 点 union，联合模式，逻辑或语义，命中其中任一子模式即匹配，子模式可以是字面量也可以是其它 P 点模式，而且能嵌进对象，比如 type 字段是 user 或 org。

底下这条警告很重要：with 中括号 a 逗号 b 这种写法，不是三选一，而是会被解读为「匹配一个含 a、b 两个元素的二元组」，语义完全不同。三选一要么用多模式的并列写法，要么用 P 点 union。
-->

---

# 数组与集合模式

```ts
match(input)
  .with(P.array(P.number), (ns) => `数字数组 ${ns.length}`)
  .with(P.array({ id: P.number }), (rows) => `${rows.length} 行`)
  .with(P.record(P.string, P.number), () => '分数字典')
  .with(P.set(P.string), () => '字符串集合')
  .otherwise(() => '其它');
```

<v-clicks>

- `P.array(sub)`：每个元素都满足子模式（含空数组）
- `P.record(k, v)`：键值类型统一的**动态键字典**
- 还有 `P.set` / `P.map` 对应 Set / Map

</v-clicks>

<!--
集合类的模式。

P 点 array 子模式，匹配每个元素都满足子模式的数组，不限长度，包括空数组；子模式也可以是对象，比如 P 点 array 大括号 id 是 number，匹配对象数组、每个对象都有数字 id。省略子模式时对元素不设约束。

P 点 record 键模式 值模式，匹配键值类型统一的字典对象，面向动态键的场景，比如所有键是字符串、所有值是数字的分数表。它和固定字段的对象模式是两个维度。

此外还有 P 点 set 匹配 Set、P 点 map 匹配 Map，用法类似。
-->

---

# 守卫：P.when

```ts
match(input)
  .with({ score: P.when((n) => n >= 90) }, () => '🏆')
  .with({ score: P.when((n) => n < 60) }, () => '😞')
  .otherwise(() => '🙂');

// 写成类型守卫，命中分支里进一步收窄
.with({ score: P.when((n): n is 100 => n === 100) }, () => '满分')
```

<v-clicks>

- 结构/字面量表达不了的条件，用谓词函数
- 谓词返回 `true` 才命中
- 类型守卫（`n is T`）还能收窄类型

</v-clicks>

<!--
有些条件没法用结构或字面量直接表达，比如分数大于等于 90、长度是偶数，这时用 P 点 when。

P 点 when 接收一个谓词函数，返回 true 才算命中，把任意运行时布尔判断接入模式系统。比如 score 字段配 P 点 when n 大于等于 90。

进阶用法：把谓词写成类型守卫，也就是返回类型写成 n is 某类型，命中分支里就会把值进一步收窄。比如 P 点 when n is 100 箭头 n 等于 100，命中后参数就被收窄成字面量类型 100，而不是宽泛的 number。

再提一句区分：P 点 when 是嵌在模式内部的模式；而点 when 是 match 链上的方法，对整个输入加谓词，是两个不同层级的东西。
-->

---

# 数据提取：P.select（匿名）

```ts
type Input = { type: 'post'; user: { name: string } };

const author = (input: Input) =>
  match(input)
    // 匿名 select：选中值作为 handler 第一个参数
    .with(
      { type: 'post', user: { name: P.select() } },
      (name) => name        // name: string
    )
    .otherwise(() => 'anonymous');
```

<div v-click class="mt-2 text-sm">

> 免去手动逐层解构，直接从深层结构里挑出要用的值。

</div>

<!--
P 点 select 用来从深层结构里提取一段值，免去手动解构。

先看匿名 select，也就是不传名字。它会把被选中的值作为 handler 的第一个参数注入。比如模式写 type post、user 大括号 name 是 P 点 select 括号，命中后 handler 的第一个参数 name 就是被提取出来的那个 name 字符串，类型也自动推导。匹配到的完整输入会作为第二个参数。

好处很直接：当你只关心深层结构里的某一个值时，不用一层层解构 input 点 user 点 name，select 直接帮你挑出来注入进去。
-->

---

# 数据提取：P.select（命名）

```ts
match(input)
  .with(
    {
      type: 'post',
      user: { name: P.select('name') },
      content: P.select('body'),
    },
    // 多个命名 select 汇成一个对象传入
    ({ name, body }) => `${name} 写道：${body}`
  )
  .otherwise(() => '');
```

<v-clicks>

- 命名 select 适合一个分支里提取**多处**值
- 全部汇成 `{ name, body }` 对象作为第一个参数
- `P.select('age', P.number.gt(18))`：先约束再提取

</v-clicks>

<!--
当一个分支里要提取多处值时，用命名 select。

给每个 P 点 select 传一个名字，比如 name、body。命中后，所有命名选择会被汇集进一个对象，按各自名字作为键，作为 handler 的第一个参数传入。handler 里通过解构大括号 name 逗号 body 一次性拿到，类型也分别精确推导。

注意和匿名 select 的差别：匿名 select 是把单个值作为第一个位置参数；命名 select 是把多个值汇成对象。

还有一种带子模式的命名 select，比如 P 点 select age 逗号 P 点 number 点 gt 18，它会先用子模式约束取值条件、大于 18，命中后再以 age 为名提取，把「条件」和「提取」合二为一。
-->

---

# 可选属性与组合模式

```ts
// P.optional：只在对象属性位置有意义
match(input)
  .with({ key: P.optional(P.string) }, (a) => a.key) // string | undefined

// P.not 否定 / P.intersection 交集
match(v)
  .with(P.not(P.boolean), (n) => n)
  .with(P.intersection(P.instanceOf(A), { foo: 'bar' }), (x) => x.foo)
  .otherwise(() => null);
```

<v-clicks>

- `P.optional`：键可缺失（≠ `P.nullish` 值为空）
- `P.not(sub)`：匹配不满足子模式的值
- `P.intersection`：同时满足所有子模式（逻辑与）

</v-clicks>

<!--
几个组合与修饰模式。

P 点 optional 只在对象属性位置有意义，标记某个键可选——键可以缺失，若存在则值要满足子模式。比如 key 是 P 点 optional P 点 string，handler 里 a 点 key 的类型是 string 或 undefined。注意它和 P 点 nullish 不同：optional 关注键是否存在，nullish 关注值是否为 null 或 undefined。

P 点 not 是否定，匹配不满足子模式的值，比如 P 点 not P 点 boolean 匹配所有非布尔值。

P 点 intersection 是交集、逻辑与，必须同时满足所有子模式，命中后类型取交集，常用于「既是某类实例、又有某结构约束」。还有 P 点 instanceOf 匹配某类的实例，等价于 instanceof，常用来区分 Error 子类。
-->

---

# 链式断言：少写 P.when

```ts
match(input)
  .with(P.string.startsWith('http'), () => 'URL')
  .with(P.string.regex(/^\d+$/), () => '纯数字串')
  .with(P.number.between(1, 5), () => '1~5 评分')
  .with(P.number.int().positive(), () => '正整数')
  .otherwise(() => '其它');
```

<v-clicks>

- 字符串：`startsWith`/`endsWith`/`includes`/`regex`/`minLength`/`length`/`maxLength`
- 数字：`between`/`gt`/`gte`/`lt`/`lte`/`int`/`positive`/`negative`/`finite`
- 数值断言只约束**运行时**，类型层面仍是 `number`

</v-clicks>

<!--
P 点 string 和 P 点 number 不只是「任意字符串、任意数字」的通配，它们还挂着一组链式断言，让常见约束无需手写 P 点 when。

字符串的断言：startsWith 以某串开头、endsWith 结尾、includes 包含、regex 匹配正则、minLength 长度至少、length 长度恰好等于、maxLength 长度至多。

数字的断言，bigint 同款：between 区间、gt gte 大于和大于等于、lt lte 小于和小于等于、int 整数、positive negative 正负、finite 非无穷。

一个细节：数值断言比如 int、positive，只影响运行时是否命中；TypeScript 没有「正整数」这种类型，所以 infer 出来通常仍是 number。
-->

---

# 穷尽性：编译期如何保证

```ts
type Permission = 'editor' | 'viewer';
type Plan = 'basic' | 'pro';

match([org, user])
  .with(['basic', 'viewer'], () => {})
  .with(['basic', 'editor'], () => {})
  .with(['pro', 'viewer'], () => {})
  // 编译报错 NonExhaustiveError<['pro', 'editor']>
  .exhaustive();
```

<div v-click class="mt-2 text-sm">

> 随每个 `.with` 命中，输入类型被「扣掉」已覆盖部分；剩余非 `never` 就报错。

</div>

<!--
来看穷尽性的核心机制。

exhaustive 的原理是：随着每个 with 命中，输入类型被「扣掉」已经覆盖的那部分；到链尾时，如果剩余类型不是 never，也就是还有可能值没覆盖，TypeScript 就报错，错误类型形如 NonExhaustiveError 尖括号未覆盖的情况。

看这个例子，org 和 user 组合起来有四种可能，代码只处理了三种，漏了 pro editor，于是 exhaustive 这行编译报错，明确告诉你 pro editor 这个组合没处理。

有个推论：如果一个 with 都不写、输入又不是 never，exhaustive 同样报错，因为所有可能都没被覆盖。这就是它「强制你写全分支」的本质。
-->

---

# 穷尽性的真正价值

<v-clicks>

- 给判别联合**新增一个成员**……
- 所有漏处理它的 `match` **立刻编译报错**
- 把「漏 case」从隐蔽的运行时 bug → 显式的编译错误

</v-clicks>

<div v-click class="mt-4">

```ts
// 运行时遇越界值，可优雅兜底而非抛错
match(value)
  .with('a', () => 'A')
  .exhaustive((unexpected) => {        // 仍保留编译期穷尽检查
    console.warn(unexpected);
    return 'fallback';
  });
```

</div>

<!--
穷尽性最真正的价值，在维护阶段才体现出来。

设想你给一个判别联合新增了一个成员，比如状态机多了一种 status。这时候，项目里所有原本「看似覆盖完整」却没处理这个新成员的 match，会立刻编译报错，逼你回到每一处补上新分支。这就把「漏处理新情况」从隐蔽的运行时 bug，变成了显式的、编译期就拦住的错误。这是 switch 给不了的。

另外，exhaustive 还能传一个可选 handler。类型完整时运行期不会有漏网值，但运行时数据可能越界，比如来自外部的非法值。传入 handler 后，遇到未覆盖值就调用它、不抛 NonExhaustiveError，既能优雅兜底，又保留了编译期的穷尽检查。
-->

---

# 判别联合 / reducer 迁移

```ts
type Action =
  | { type: 'add'; amount: number }
  | { type: 'reset' };

const reducer = (state: number, action: Action): number =>
  match(action)
    .with({ type: 'add' }, (a) => state + a.amount) // a.amount 精确可用
    .with({ type: 'reset' }, () => 0)
    .exhaustive(); // 新增 action 漏处理 → 编译报错
```

<v-clicks>

- 每个分支按判别字段自动收窄出精确 payload
- 漏处理新 action 类型编译报错，告别手动 as

</v-clicks>

<!--
判别联合是 ts-pattern 的主场，最典型的就是 Redux 风格的 reducer 迁移。

传统写法是 switch action 点 type，痛点有两个：新增 action 类型容易漏 case；而且 switch 里访问 action 点 payload 往往拿不到精确类型，要手动断言。

改用 match 之后，看这个例子：with type add 这个分支里，a 点 amount 自动收窄、精确可用，不用 as；with type reset 返回 0；末尾 exhaustive。一旦你给 Action 联合新增一种类型却忘了处理，这里就编译报错。

这就是把 switch reducer 的「漏 case 加手动断言」，转成了「编译期保证加自动收窄」。
-->

---

# isMatching：模式当类型守卫

```ts
import { isMatching, P } from 'ts-pattern';

// 柯里化：生成可复用守卫
const isBlogPost = isMatching({ type: 'blogpost', title: P.string });

if (isBlogPost(value)) {
  value.title; // value 已收窄
}

// 两参用法，直接判断
items.filter((it) => isMatching({ type: 'post' }, it));
```

<div v-click class="mt-2 text-sm">

> `match` 选分支取值；`isMatching` 返回布尔、用于 `if`/`filter` 收窄类型。

</div>

<!--
除了 match，库还导出一个 isMatching，定位不同。

match 是分支选择并返回结果；isMatching 是一个类型守卫，判断某个值是否匹配给定模式，返回布尔，并在 true 分支里收窄类型。

两种用法。柯里化：isMatching 传一个模式，得到一个可复用的守卫函数，比如 isBlogPost，然后 if isBlogPost value 成立时 value 被收窄。两参用法：isMatching 模式 逗号 value，直接判断，常用在 filter 回调里。

一句话区分：match 选分支取值，isMatching 返回布尔做守卫，用于 if 和 filter 里做类型收窄。
-->

---

# P.infer：模式即类型来源

```ts
const postPattern = {
  title: P.string,
  stars: P.number.between(1, 5).optional(),  // 可选
  author: { firstName: P.string, followerCount: P.number },
} as const;

type Post = P.infer<typeof postPattern>;
// { title: string; stars?: number;
//   author: { firstName: string; followerCount: number } }
```

<v-clicks>

- 由**模式**反推「可被它匹配的值」的类型
- `.optional()` → 可选属性；范围断言不细化类型
- 模式与类型一处维护，不再两头改

</v-clicks>

<!--
P 点 infer 是一个类型工具，方向是「由模式反推类型」。

用 as const 写好一个模式对象后，type Post 等于 P 点 infer typeof postPattern，就能得到这个模式对应的数据类型。看右边注释推出来的结果：title 是 string；stars 因为用了点 optional，推成可选属性，也就是带问号的 number；author 是嵌套对象。

两个细节：点 optional 是 P 点 optional 的链式写法，会把字段标记为可选；而 between 这种范围断言只约束运行时，类型层面仍是 number，不会细化成 1 到 5。

好处是「模式即类型的单一来源」：模式和类型声明一处维护，不用两头改，避免漂移。
-->

---

# returnType 与输出推导

```ts
// 默认：输出 = 各分支 handler 返回类型的联合
const x = match<number>(n)
  .with(0, () => 'zero')   // string
  .with(P.number, () => 1) // number
  .exhaustive();           // x: string | number

// returnType：显式锁定输出，约束每个 handler
const y = match<number>(n)
  .returnType<string>()
  .with(0, () => 'zero')
  .with(P.number, () => '其它') // 返回 number 会报错
  .exhaustive();
```

<!--
整条 match 表达式的输出类型，默认是所有保留分支 handler 返回类型的统一、联合。看上面的例子，一个分支返回 string、一个返回 number，没约束时 x 被推成 string 或 number 的联合。

如果你想强约束输出形态、或者自动推导不够精确，用点 returnType 尖括号 T，放在 with 之前，它会显式锁定整条表达式的返回类型，要求每个 handler 都返回兼容 T 的值，否则报错。看下面，returnType string 之后，某个分支如果返回 number 就会编译报错。

补充一个对称的入口：match 尖括号 Input 括号 value，是显式指定输入类型，当字面量被 TS 推得过窄时，用它让 with 和 exhaustive 基于目标联合工作。
-->

---

# 与 Zod 协作：各司其职

```ts
const Event = z.discriminatedUnion('type', [
  z.object({ type: z.literal('click'), x: z.number() }),
  z.object({ type: z.literal('key'), code: z.string() }),
]);

function handle(raw: unknown) {
  const event = Event.parse(raw);   // Zod：运行时校验入口
  return match(event)               // ts-pattern：穷尽分发
    .with({ type: 'click' }, (e) => `点击 ${e.x}`)
    .with({ type: 'key' }, (e) => `按键 ${e.code}`)
    .exhaustive();
}
```

<!--
ts-pattern 处理的是「已知类型的值」，不做运行时 schema 校验。它和 Zod 是互补关系，不是二选一。

典型分工是：Zod 把关入口，ts-pattern 驱动逻辑。看这个例子，先用 Zod 定义一个判别联合 Event，然后在 handle 里 Event 点 parse raw，对未知输入做运行时校验，得到一个可信的、已知类型的判别联合；接着把它交给 match 做穷尽分发，每个分支自动收窄。

记住这条边界：Zod 负责运行时校验未知数据、把关入口；ts-pattern 负责对已知类型的值做分支选择和收窄、驱动控制流。两者配合，入口和逻辑都安全。
-->

---

# 性能与边界

| 维度 | 要点 |
|---|---|
| 编译时间 | 穷尽检查可选，会带来**略长编译时间**（超大联合更明显） |
| 运行时 | 约 ~2kB、`sideEffects:false`，无需 babel 宏/插件 |
| 顺序 | 自上而下短路，`P._` 兜底**必须放最后** |
| 适用 | 复杂结构 + 需穷尽；简单单值 switch 仍合适 |
| 校验 | 不验证未知输入，那是 Zod 的活 |

<!--
最后讲性能和边界，避免误用。

编译时间：官方明确说穷尽检查是可选的，会因为更多类型检查工作带来略长的编译时间，超大联合、超深嵌套场景尤其明显。注意，影响的是编译期，不是运行时。极端场景编译显著变慢时，可以在那一处权衡改用 otherwise。

运行时：它是个轻量库，约 2kB，标了 sideEffects false 利于 tree shaking，运行时只做结构和条件比较，不需要任何 babel 宏或编译插件，标准 TS 工程直接用。

顺序：匹配是自上而下短路的，第一个命中的胜出，所以 P 点下划线兜底必须放最后，否则会截胡后面的具体分支。

适用边界：它的价值在「复杂结构加需要穷尽保证」；简单的单值判断，原生 switch 仍然合适，不必强行替换。它也不验证未知输入，那是 Zod 的活。
-->

---
layout: intro
---

# 总结

ts-pattern = **类型安全的模式匹配，把运行时分支升级为编译期可验证**

- 结构：`match().with().exhaustive()`，是表达式、有返回值
- 模式：字面量 / 对象 / `P.array` / `P.union` / `P.when` / `P.select`
- 收尾：`exhaustive`（穷尽）/ `otherwise`（兜底）/ `run`（不安全）
- 收窄：分支内类型精确，访问错字段编译报错
- 穷尽：新增联合成员漏处理即编译报错
- 边界：处理已知类型的值，校验交给 Zod；`P._`≈`P.any`

<!--
总结一下。

ts-pattern 是类型安全的模式匹配库，本质是把易错的运行时分支，升级成编译期可验证的逻辑。

结构上，match 点 with 点 exhaustive 三段式，它是表达式、有返回值。

模式语言很丰富：字面量、对象，加上 P 点 array、P 点 union、P 点 when、P 点 select、P 点 optional、P 点 instanceOf 等等，还有字符串数字的链式断言。

收尾三选一：exhaustive 做穷尽检查、是首选，otherwise 用通配兜底、放宽穷尽，run 不检查、不安全。

两大核心收益：分支内自动收窄类型，访问错字段编译报错；以及穷尽检查，新增联合成员漏处理就编译报错。

最后记牢边界：它处理已知类型的值，运行时校验未知输入交给 Zod；还有 P 点下划线和 P 点 any 是别名、不是两个东西。谢谢大家。
-->
