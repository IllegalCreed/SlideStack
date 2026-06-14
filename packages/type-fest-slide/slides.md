---
theme: seriph
background: https://cover.sli.dev
title: type-fest — 实用 TypeScript 类型集合
info: |
  Presentation type-fest — A collection of essential TypeScript types.

  纯类型、零运行时。版本基线 type-fest 4.x（TS ≥5.1 + strict）。
  Learn more at [https://github.com/sindresorhus/type-fest](https://github.com/sindresorhus/type-fest)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🧩</span>
</div>

<br/>

## type-fest — 实用 TypeScript 类型集合

A collection of essential TypeScript types：**纯类型、零运行时**，只 `import type`。补齐内置工具类型空白——深层变换、标称类型、字符串/JSON 类型变换

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/sindresorhus/type-fest" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 type-fest,Sindre Sorhus 维护的一组实用 TypeScript 类型。

一句话定位:a collection of essential TypeScript types。它最关键的特征是纯类型、零运行时——所有导出都是 type 声明,编译后不产生任何 JavaScript,所以只能也应当用 import type 引入。

它的使命是补齐 TS 内置工具类型,比如 Partial、Pick、Omit、Readonly 覆盖不到的常见需求。

今天的主线:为什么需要 → 纯类型心智 → 深浅层 → Simplify → LiteralUnion → 对象键约束 → 标称类型 Tagged → 字符串族 → JSON → 异步 → 取舍 → 总结。版本基线是 type-fest 4.x,要求 TS 5.1 以上并开启 strict。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么需要它

<v-clicks>

- 内置 `Partial`/`Readonly` 只作用第一层，嵌套搞不定
- 想给「账号」「余额」做区分，底层都是 number 易误传
- `'a' | 'b' | string` 被坍缩成 string，丢自动补全
- 复杂类型悬浮提示一长串交叉，读不懂

</v-clicks>

<div v-click class="mt-6">

type-fest 的回应：

- 深层 `PartialDeep` / `ReadonlyDeep` → **递归**
- `Tagged` 标称类型 → **类型壁垒**
- `LiteralUnion` → **保住补全**
- `Simplify` → **摊平可读**

</div>

<!--
为什么要专门引一个类型库?四个老痛点。

第一,内置的 Partial、Readonly 都是浅层,只作用对象第一层,嵌套对象内部搞不定。第二,业务里想给账号和余额做区分,但它们底层都是 number,普通类型挡不住互相误传。第三,写 'a' 竖线 'b' 竖线 string 这种联合,会被 TS 坍缩成纯 string,IDE 就丢了对字面量的自动补全。第四,复杂类型在编辑器里悬浮显示成一长串交叉,根本读不懂。

type-fest 针对性地回应:深层的 PartialDeep、ReadonlyDeep 做递归变换;Tagged 做标称类型建立类型壁垒;LiteralUnion 保住字面量补全;Simplify 把交叉摊平、提示可读。这四点就是它最常用的价值,也是今天的主线。
-->

---

# 核心心智：纯类型、零运行时

```ts
// ✅ 导出全是 type，必须用 import type
import type { PartialDeep, Tagged } from 'type-fest';

// ❌ 没有运行时值导出，require 拿不到东西
// const tf = require('type-fest');
```

<v-clicks>

- 编译后**不产生任何 JS** → 运行时 / 包体积**零影响**
- 应用、不暴露它的库 → 放 `devDependencies` 即可
- 发布的库若在公共 `.d.ts` 暴露其类型 → 放 `dependencies`
- ⚠️ **不做运行时校验**——那是 zod / valibot 的事

</v-clicks>

<!--
第一个也是最重要的心智:纯类型、零运行时。

因为 type-fest 导出的全是 type,正确写法是 import type。它没有任何运行时值导出,用 require 是拿不到东西的。

零运行时带来三个推论。第一,编译后不产生任何 JavaScript,所以对运行时性能和最终打包体积是零影响。第二,对应用、或者不对外暴露它的库,放 devDependencies 就够了,因为只在构建期需要。第三,如果你发布的是一个库,而且公共的 .d.ts 里直接 re-export 或引用了 type-fest 的类型,那要放 dependencies,否则下游解析你的类型时会缺包。

最后一条要划重点:它不做运行时校验。校验用户提交的邮箱格式、数值范围,那是 zod、valibot 的范畴,type-fest 帮不上。
-->

---

# 深浅层：内置浅层 vs 深层

| 内置（浅层） | type-fest（深层） | 作用 |
|---|---|---|
| `Partial<T>` | `PartialDeep<T>` | 递归把每层键变可选 |
| `Required<T>` | `RequiredDeep<T>` | 递归把每层键变必填 |
| `Readonly<T>` | `ReadonlyDeep<T>` | 递归把对象/数组/Map/Set 只读 |

```ts
const data: ReadonlyDeep<{ foo: string[] }> = { foo: ['bar'] };
// data.foo.push('baz'); // ❌ readonly string[] 没有 push
```

<!--
对象类型最重要的一条主线:内置浅层,type-fest 深层。

TS 内置的 Partial、Required、Readonly 都只作用第一层。type-fest 提供对应的深层版本:PartialDeep 递归把所有层级的键变可选,RequiredDeep 递归变必填,ReadonlyDeep 递归把对象、数组、Map、Set 全变只读。

看代码,ReadonlyDeep 包住一个含数组的对象后,连深层数组的 push 在类型上都会报错,因为它已经是 readonly string 数组。这适合把导入的 JSON、或一份 API 响应,作为完全不可变对外暴露。

记忆口诀就一句:内置浅层,type-fest 深层。PartialDeep 还有个细节,默认不递归进数组元素,需要时传 recurseIntoArrays true。
-->

---

# Simplify：摊平交叉、提示可读

```ts
import type { Simplify } from 'type-fest';

type PositionProps = { top: number; left: number };
type SizeProps = { width: number; height: number };

// 悬浮显示成合并好的 { top; left; width; height }
// 而不是 PositionProps & SizeProps 一长串
type Props = Simplify<PositionProps & SizeProps>;
```

<v-clicks>

- 用途一：摊平交叉类型，**改善编辑器悬浮提示**
- 用途二：把 `interface` 密封成 `type`（满足索引签名约束）

</v-clicks>

<!--
Simplify 是个看起来什么都没做、实则很有用的类型。它的定义就是把对象的每个键映射一遍再交叉一个空对象。

第一大用途:摊平交叉类型,改善悬浮提示。看代码,把 PositionProps 交叉 SizeProps 用 Simplify 包住后,在编辑器里悬浮 Props,会看到一个把 top、left、width、height 全部合并好的单一对象,而不是 PositionProps and SizeProps 这样的交叉表达式,可读性大增。

第二大用途等下专门讲:把 interface 密封成 type。因为 TS 里 interface 可以被声明合并再次打开,编译器不敢断定它满足带索引签名的约束;而 type 是密封的。Simplify 把 interface 等价转成 type,就能通过那些需要 Record string unknown 的赋值。

深层版叫 SimplifyDeep,递归摊平嵌套对象。
-->

---

# LiteralUnion：保住自动补全

```ts
import type { LiteralUnion } from 'type-fest';

// ❌ 被坍缩成 string，丢了 'dog' / 'cat' 补全
type Pet = 'dog' | 'cat' | string;

// ✅ 仍允许任意 string，且保留字面量补全
type Pet2 = LiteralUnion<'dog' | 'cat', string>;
```

<v-clicks>

- 痛点：字面量 + `string` 联合会被 TS 坍缩成 `string`
- 实现：`L | (Base & Record<never, never>)` 阻止坍缩
- 场景：「有推荐值，但也允许自定义字符串」的 API

</v-clicks>

<!--
LiteralUnion 解决一个很烦的痛点。

当你写 'dog' 竖线 'cat' 竖线 string 时,TS 会把整个类型坍缩成 string,于是 IDE 就丢失了对 dog、cat 的自动补全。这在有一组推荐值的 API 里特别难受。

LiteralUnion 用一个小技巧修复它:实现是字面量,竖线,Base 类型交叉一个 Record never never。这个交叉项既不改变它仍是 string 的事实,又阻止了 TS 把字面量坍缩掉。

效果:用 LiteralUnion 'dog' 'cat' string 之后,输入时仍会提示 dog 和 cat,同时也允许任意其它字符串。

典型场景就是那种「有一组推荐值,但也允许用户自定义」的字符串参数。这也是它源码注释里链到 TS issue 29729、呼吁官方内置的原因。
-->

---

# 对象键约束：至少一个 / 恰好一个

```ts
import type { RequireAtLeastOne, RequireExactlyOne } from 'type-fest';

type Responder = { text?: () => string; json?: () => string; secure?: boolean };

type R1 = RequireAtLeastOne<Responder, 'text' | 'json'>; // 至少一个，可都给
type R2 = RequireExactlyOne<Responder, 'text' | 'json'>; // 恰好一个，互斥
```

| 类型 | 0 个 | 1 个 | 多个 |
|---|---|---|---|
| `RequireAtLeastOne` | ❌ | ✅ | ✅ |
| `RequireExactlyOne` | ❌ | ✅ | ❌ |

<!--
对象键约束,处理「这几个键里至少给一个」或「只能给一个」这类业务规则。

看代码,一个 Responder 有 text、json、secure 三个可选键。RequireAtLeastOne 配 text 竖线 json,表示这两个里至少给一个,可以两个都给,但不能都不给。RequireExactlyOne 则是恰好一个、互斥——给了 json 就不能再给 text。

下面的表格对比很清楚:两者都不允许零个;AtLeastOne 允许多个共存,ExactlyOne 不允许多个。

另外还有 RequireOneOrNone 恰好一个或一个不给、RequireAllOrNone 要么全给要么全不给。

一个局限要提醒:RequireExactlyOne 受限于 TS 无法在编译期穷举运行时所有键,所以它对自己不知道的额外键无能为力,只能约束你显式列出的那组。
-->

---

# 标称类型 Tagged（一）：建立壁垒

```ts
import type { Tagged } from 'type-fest';

type AccountNumber = Tagged<number, 'AccountNumber'>;
type AccountBalance = Tagged<number, 'AccountBalance'>;

function getBalance(acc: AccountNumber): AccountBalance {
  return 4 as AccountBalance;
}
getBalance(2 as AccountNumber); // ✅
// getBalance(2);               // ❌ 裸 number 不能直接当 AccountNumber
```

<v-clicks>

- 底层都是 number，但贴不同标签 → **互不可赋值**
- 防止把「余额」误传进收「账号」的函数

</v-clicks>

<!--
标称类型是 type-fest 很有代表性的能力。

看代码,账号和余额底层都是 number,但用 Tagged 给它们贴了不同的标签,于是在类型系统里它们成为互不可赋值的不同类型。

这样即使运行时值同为 number,也不会把余额误传进只接受账号的函数,编译器会拦下。把一个 number 字面量断言成 AccountNumber 是允许的,但直接把裸 number 传给收 AccountNumber 的函数会报错。

这就是标称类型,也叫 branding 或 tagging 的价值:为那些底层类型碰巧相同、但语义上绝不能混用的概念,建立类型壁垒。下一页讲两个容易误解的点。
-->

---

# 标称类型 Tagged（二）：底层未隐藏

```ts
const acc = (2 as AccountNumber);
const x = acc + 2;   // ✅ tagged 值仍可当普通 number 用

// 多标签 + 每标签元数据
type Url = Tagged<string, 'URL'>;
type CacheKey = Tagged<Url, 'CacheKey'>; // 叠加第二个标签
```

<v-clicks>

- 单向：`tagged → number` 自由；`number → tagged` 需断言
- `Tagged` 比 `Opaque` 多：**多标签 + 元数据**
- ⚠️ `Opaque` / `UnwrapOpaque` 已废弃 → 用 `Tagged` / `UnwrapTagged`

</v-clicks>

<!--
关于 Tagged 两个容易误解的点。

第一,底层类型没有被隐藏。一个 Tagged number 的值,仍然是 number 的子类型,所以能直接参与加法、比较等运算,也能传给只接受 number 的函数。受限的是反方向:裸 number 不能隐式当成 tagged,需要显式断言。这是单向可赋值。这一点和某些语言里完全不透明的 opaque 不同,底层并没被藏起来。

第二,Tagged 比已废弃的 Opaque 强在哪。Opaque 只支持单个 token。Tagged 支持对同一类型多次应用来叠加多个标签,比如把 Url 再叠一个 CacheKey 标签;而且每个标签还能附带元数据类型,用 GetTagMetadata 取出。

最后划重点:Opaque 和 UnwrapOpaque 已经被标记 deprecated,新代码一律改用 Tagged 和 UnwrapTagged。Opaque 还有个坑:不传 token 时不同名类型无法区分,等于白做。
-->

---

# 字符串族（一）：大小写 / 切分 / 替换

```ts
import type { CamelCase, SnakeCase, Split, Replace } from 'type-fest';

type A = CamelCase<'foo-bar'>; //=> 'fooBar'
type B = SnakeCase<'fooBar'>;  //=> 'foo_bar'
type C = Split<'a,b,c', ','>;  //=> ['a', 'b', 'c']
type D = Replace<'10:42:00', ':', '-', { all: true }>; //=> '10-42-00'
```

<v-clicks>

- 全在**类型层面**变换，保留**精确字面量**（不退化成 string）
- 还有 `KebabCase` / `PascalCase` / `Join` / `Trim` 等

</v-clicks>

<!--
字符串族,type-fest 能在类型层面对字符串字面量做各种变换。

看代码。CamelCase 把 foo 横杠 bar 转成 fooBar 驼峰。SnakeCase 把 fooBar 转成 foo 下划线 bar。Split 按分隔符把字符串切成元组,这里把逗号分隔的字符串切成 a、b、c 三个元素的元组。Replace 带 all true 时把所有匹配替换掉,把时间里的冒号全换成横杠。

关键特点:这些变换全在类型层面完成,而且保留精确的字面量类型,不会退化成泛泛的 string。比如 Split 的结果是带每段字面量的元组,可以用来给 split 方法标注精确返回类型。

此外还有 KebabCase、PascalCase、ScreamingSnakeCase、Join、Trim 等一整套。下一页看怎么把它升级到整个对象的键。
-->

---

# 字符串族（二）：对象键批量转换

```ts
import type { CamelCasedPropertiesDeep } from 'type-fest';

interface ApiUser {
  user_id: number;
  full_name: string;
  address: { zip_code: string };
}

type FrontUser = CamelCasedPropertiesDeep<ApiUser>;
//=> { userId: number; fullName: string; address: { zipCode: string } }
```

<v-clicks>

- 后端 `snake_case` 嵌套响应 → 前端 `camelCase`（递归）
- 只转第一层用 `CamelCasedProperties`（不带 Deep）

</v-clicks>

<!--
把单字符串变换升级到整个对象的键,这是前后端命名风格转换里最实用的能力。

看代码,后端返回的 ApiUser 是 snake_case,还带嵌套的 address 对象。用 CamelCasedPropertiesDeep 包一下,就在类型层面递归地把所有键,包括嵌套对象里的键,都转成 camelCase:user_id 变 userId,full_name 变 fullName,连 address 里的 zip_code 也变成 zipCode。

如果只想转第一层键,用不带 Deep 的 CamelCasedProperties。蛇形那边对应的是 SnakeCasedProperties 和 SnakeCasedPropertiesDeep。

这样前端拿到接口数据时,类型层面就是规整的驼峰,不用手写一份转换后的接口。
-->

---

# JSON 类型族

```ts
import type { JsonValue, Jsonify } from 'type-fest';

// JsonValue = (string | number | boolean | null) | JsonObject | JsonArray
// 刻意不含 undefined / function / symbol / Date

interface Post { id: number; createdAt: Date; render: () => string }
type Wire = Jsonify<Post>;
//=> { id: number; createdAt: string }  Date 变 string，函数被剔除
```

<v-clicks>

- `JsonValue`：精确刻画「合法 JSON 值」
- `Jsonify<T>`：转成 `JSON.parse(JSON.stringify(x))` 后的精确类型

</v-clicks>

<!--
JSON 类型族。

先看 JsonValue,它精确刻画合法的 JSON 值:要么是基本类型,字符串、数字、布尔、null,要么是 JSON 对象,要么是 JSON 数组。注意它刻意不包含 undefined、函数、symbol、Date,因为这些不是合法 JSON。

再看 Jsonify,它把一个类型转换成经过 JSON 序列化再解析回来之后的精确类型。看代码,一个 Post 含 number、Date 和一个方法。Jsonify 之后,Date 变成了 string,因为 Date 的 toJSON 返回字符串;那个 render 方法被直接剔除,因为函数不可序列化。它还会把 interface 转成可结构比较的 type。

用途很实在:描述「数据序列化后通过网络传输、再 parse 回来」的精确响应类型,避免你以为还能拿到 Date 对象或调用方法,实际上早就丢了。
-->

---

# 异步 & 取值

```ts
import type { Promisable, AsyncReturnType, ValueOf } from 'type-fest';

// 回调可同步返回值或返回其 Promise
type CB = () => Promisable<string>;  // string | PromiseLike<string>

async function fetchUser() { return { id: 1, name: 'Ada' }; }
type User = AsyncReturnType<typeof fetchUser>; //=> { id: number; name: string }

type V = ValueOf<{ foo: 1; bar: 2 }>; //=> 1 | 2
```

<v-clicks>

- `Promisable<T>`：值或其 Promise；`AsyncReturnType`：解包返回的 Promise
- `ValueOf`：值的联合（`keyof` 的值版）；`Entries`：`[k,v][]`

</v-clicks>

<!--
再快速过两组高频类型:异步和取值。

异步这边。Promisable T 等于 T 竖线 PromiseLike T,用来表达一个回调可以同步返回值、也可以返回该值的 Promise,调用方统一 await 即可。AsyncReturnType 取一个异步函数解析后的返回类型,相当于把它返回的 Promise 解包,等价于 Awaited 套 ReturnType,方便从已有异步函数推导结果类型。

取值这边。ValueOf 取对象所有值的联合,是 keyof 的值版对应物——keyof 取键的联合,ValueOf 取值的联合。还有 Entries,返回 key value 对组成的数组类型,配合 Object.entries 断言,就能在遍历时让 key 和 value 都带上精确类型,而内置的 Object.entries 只给宽泛的 string any 数组。

这些都是日常类型编程里出现频率很高的小工具。
-->

---

# 何时用 type-fest

<v-clicks>

- ✅ 内置搞不定：深层 / 标称 / 字符串 / JSON / 键约束
- ✅ 手写易错难维护（递归、分布式条件、索引签名）
- ❌ 内置 `Partial`/`Pick` 能搞定的简单变换 → 别引依赖
- ❌ 运行时校验用户输入 → 用 zod / valibot

</v-clicks>

<div v-click class="mt-4 text-sm">

> 同类库 `ts-toolbelt` / `utility-types` 定位相近、有重叠 → **择一为主**。

</div>

<!--
何时该用 type-fest,何时不该用,这页讲清楚边界。

该用的情况:当你需要的变换超出内置工具能力,比如深层变换、标称类型、字符串大小写、JSON 序列化形态、至少或恰好一个键这类约束;并且这些类型自己手写既容易出错,递归、分布式条件、索引签名的边界极多,又难维护。这时 type-fest 提供的是经过充分测试、社区验证的实现,省心可靠。

不该用的情况:内置的 Partial、Pick、Omit 能轻松搞定的简单变换,没必要为此引一个依赖,避免过度工程。还有,运行时校验用户输入,比如邮箱格式、数值范围,那是 zod、valibot 的事,type-fest 纯类型帮不上。

最后,同类库 ts-toolbelt、utility-types 定位相近、功能有重叠,选型按 API 覆盖、维护活跃度、文档质量综合判断,通常择一为主,避免概念重复。
-->

---
layout: intro
---

# 总结

type-fest = **纯类型、零运行时的 essential 类型集合**

- 心智：只 `import type`，编译后零 JS，**不做运行时校验**
- 深浅层：`PartialDeep` / `ReadonlyDeep`（内置浅层 vs 深层）
- 体验：`Simplify` 摊平提示 / `LiteralUnion` 保住补全
- 标称：`Tagged` 建类型壁垒（`Opaque` 已废弃）
- 变换：字符串大小写 / `Split` / `Jsonify` / `Promisable`
- 取舍：内置够用就别引；运行时校验交给 zod

<!--
总结一下今天的 type-fest。

一句话:它是一组纯类型、零运行时的 essential TypeScript 类型集合,补齐内置工具类型的空白。

技术要点收成六条。

第一,核心心智:只用 import type,编译后零 JS,对运行时和包体积零影响;它不做运行时校验。

第二,深浅层:PartialDeep、ReadonlyDeep 是内置浅层版的深层递归对应,这是对象类型最重要的一条主线。

第三,开发体验:Simplify 摊平交叉、让悬浮提示可读,还能把 interface 密封成 type;LiteralUnion 在字面量加 string 的场景保住自动补全。

第四,标称类型:Tagged 给底层相同的类型贴不同标签、建立类型壁垒,记住 Opaque 已废弃、改用 Tagged。

第五,各类变换:字符串大小写、Split 切分、Jsonify 序列化形态、Promisable 异步,按需取用。

第六,取舍:内置够用就别引依赖,运行时校验交给 zod。

把这些串起来,type-fest 就是你在类型层面精雕细琢的那套工具箱。谢谢大家。
-->
