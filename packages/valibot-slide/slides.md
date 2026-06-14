---
theme: seriph
background: https://cover.sli.dev
title: Valibot
info: |
  Presentation Valibot — the modular and type-safe schema library.

  Learn more at [https://valibot.dev](https://valibot.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-7xl">🤖</span>
</div>

<br/>

## Valibot

模块化、类型安全的 schema 校验库。极小体积起步 < 700 字节，官方对比比标准 Zod 小约 90%。一份 schema 既是运行时校验，又是 TS 类型来源

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/fabian-hiller/valibot" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Valibot，一个模块化、类型安全的 schema 校验库。它的定位很清楚：在运行时校验结构化数据，同时由 schema 推导出 TypeScript 类型，一份 schema 两用。

它最大的卖点是体积：bundle 起步不到 700 字节，官方对比里比标准 Zod 小约 90%。靠的是模块化的函数式设计加 tree-shaking，而不是什么压缩魔法。

主线：为什么要它 → 心智模型 → pipe 与 action → 解析与类型 → schema 全景 → 进阶件 → 异步 → 体积真相 → 从 Zod 迁移 → 总结。贯穿全篇的一句话：Valibot 用函数式管道，替代 Zod 的方法链。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用它

<v-clicks>

- 手写 interface + 另写校验，两份要同步
- 客户端校验库太大，拖慢首屏
- 校验规则与类型容易漂移
- 想要细粒度的输入/输出类型

</v-clicks>

<div v-click class="mt-6">

Valibot 的回应：

- 一份 schema → **校验 + 类型**，天然同步
- 模块化 + 摇树 → **极小体积**
- `InferInput` / `InferOutput` → **输入输出分离**

</div>

<!--
为什么要专门挑一个校验库？几个老痛点。

第一，传统做法是手写 TS interface，再单独写一套运行时校验，两份要手动保持一致，很容易漂移。第二，前端用的校验库如果太大，会拖慢首屏下载和启动。第三，规则和类型对不上时，bug 很隐蔽。第四，有时候我们需要区分「校验前的输入类型」和「校验后的输出类型」。

Valibot 的回应是：一份 schema 同时产出运行时校验和静态类型，二者天然同步；模块化加 tree-shaking 做到极小体积；还用 InferInput 和 InferOutput 把输入输出类型分开。这就是今天的主线。
-->

---

# 一句话定位

```ts
import * as v from 'valibot';

const EmailSchema = v.pipe(v.string(), v.email());
v.parse(EmailSchema, 'jane@example.com');
```

<v-clicks>

- 官方：**modular and type-safe schema library**
- 体积起步 **< 700 字节**，比标准 Zod 小约 **90%**
- 推荐导入：`import * as v from 'valibot'`
- 通配符与具名导入 **摇树效果一致**

</v-clicks>

<!--
先看一眼代码长什么样。通配符导入 v，定义一个邮箱 schema：pipe 把 string 这个 schema 和 email 这个 action 串起来，然后用 v.parse 校验数据。

官方定位就是「模块化、类型安全的 schema 校验库」。体积起步不到 700 字节，前面说的比标准 Zod 小约 90%。

导入推荐通配符写法 import star as v，用 v 点什么来调用。一个常见误区要澄清：官方明确说，通配符导入和具名导入的 tree-shaking 效果是一样的，不用为了体积刻意改成具名导入。本篇统一用 v 前缀。
-->

---

# 心智模型：三类构件

<v-clicks>

- **schema**：定义数据类型，pipeline 起点
  `string` `number` `object` `array` `union`
- **action**：校验 / 转换 / 元数据，**只能进 pipe**
  `email` `minLength` `trim` `transform` `brand`
- **method**：以 schema 为首参，使用或改造它
  `parse` `safeParse` `pick` `partial` `fallback`

</v-clicks>

<div v-click class="mt-4 text-sm">

> 抓住这三类，就抓住了整个 API。

</div>

<!--
理解 Valibot，关键是它把一切拆成三类函数。

第一类 schema，定义数据是什么类型，是一条 pipeline 的起点，比如 string、number、object、array、union。

第二类 action，做额外的校验、转换或加元数据，注意它只能放进 pipe 里用，比如 email、minLength、trim、transform、brand。

第三类 method，以 schema 作为第一个参数，来使用或改造这个 schema，比如 parse、safeParse、pick、partial、fallback。

记住这三类角色，剩下的 API 都是往里填函数名而已。
-->

---
layout: two-cols-header
---

# 核心差异：管道，不是链

::left::

**Zod：方法链**

```ts
z.string()
 .email()
 .min(5);
```

::right::

**Valibot：pipe 管道**

```ts
v.pipe(
  v.string(),
  v.email(),
  v.minLength(5),
);
```

<div class="mt-4 text-sm">

> pipe 第一个参数必须是 **schema**，之后跟 action，数据从左到右流过。

</div>

<!--
这是 Valibot 和 Zod 最核心的写法差异，一定要先建立。

Zod 是方法链：在 string 这个对象上，链式调用 email、min。读起来很顺。

Valibot 是管道：用 v.pipe 把 string 这个 schema，和 email、minLength 这些 action 串起来。

规则是：pipe 的第一个参数必须是 schema，不能是 action；后面跟若干 action，数据从左到右依次流过每个环节。为什么要这么设计？下一页讲，跟体积直接相关。
-->

---

# pipe：校验 vs 转换

```ts
// 校验：不改值，不过就报 issue
v.pipe(v.string(), v.trim(), v.email());

// 转换：改值（可改类型），传给下一步
v.pipe(v.string(), v.toNumber());   // string → number

// 数值范围：用 minValue/maxValue，不是 minLength
v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100));
```

<v-clicks>

- 校验 action：`email` `url` `regex` `minLength` `minValue`
- 转换 action：`trim` `toNumber` `toDate` `toUpperCase`
- 转换常放校验前（先 `trim` 再 `email`）

</v-clicks>

<!--
pipe 里的 action 分两种，这是基础。

校验 action，只检查不改值，不通过就产生一个 issue，比如 email、url、regex、minLength、minValue。

转换 action，会改变值，甚至改变类型，再把新值传给下一步，比如 trim、toNumber、toDate、toUpperCase。第二个例子，string 经过 toNumber 之后，输出类型就变成 number 了。

两个提醒。一，数值范围要用 minValue、maxValue 比大小，不要用 minLength，那是比长度的。二，转换通常放在校验前面，比如先 trim 去掉空白，再 email 校验，否则残留空白可能导致误判。

自定义校验用 check 传布尔函数，自定义转换用 transform 返回新值。
-->

---

# 解析数据：parse vs safeParse

```ts
// A. parse —— 失败抛 ValiError
try {
  const x = v.parse(Schema, data);
} catch (e) { /* v.isValiError(e) */ }

// B. safeParse —— 返回结果对象
const r = v.safeParse(Schema, data);
if (r.success) r.output;   // 校验后的值
else           r.issues;   // 问题数组
```

<div v-click class="mt-3 text-sm">

> 字段记牢：值在 **output**（不是 data），问题在 **issues**，判断用 **success**。

</div>

<!--
拿到 schema 怎么校验数据？两个方法。

第一个 parse，校验成功返回带类型的值，失败抛出 ValiError，所以要 try catch，可以用 isValiError 判断错误是不是来自 Valibot。

第二个 safeParse，不抛异常，返回一个结果对象。判断 success：为 true 时用 output 取校验后的值，为 false 时用 issues 取问题数组。

字段一定要记牢：校验后的值在 output，不是 data 也不是 value；问题在 issues；判断用 success。这是从 Zod 过来最容易写错的地方。
-->

---

# 类型推导：Infer 双生

```ts
const S = v.optional(v.string(), 'hi');

type In  = v.InferInput<typeof S>;   // string | undefined
type Out = v.InferOutput<typeof S>;  // string
```

<v-clicks>

- `InferOutput`：校验后类型，**最常用**（≈ Zod `z.infer`）
- `InferInput`：校验前类型，少数场景用
- 二者不同：有 `transform` / 默认值 / `brand` / `readonly` 时
- 纯校验（`pipe(string, email)`）→ 输入输出一致

</v-clicks>

<!--
类型推导是 Valibot 的强项，提供两个工具类型。

例子里，optional string 带了默认值 hi。InferInput 是校验前的输入类型，string 或 undefined；InferOutput 是校验后的输出类型，因为默认值补齐了，就是 string。

日常最常用的是 InferOutput，对应 Zod 的 z.infer。InferInput 用在少数场景，比如表单原始值的类型。

什么时候输入输出会不一样？有 transform 转换、有默认值的 optional、有 brand 打品牌、有 readonly 的时候。如果只是纯校验，比如 pipe string email，email 不改值，那输入输出类型就是一致的。
-->

---

# schema 全景（一）

```ts
// 基础
v.string(); v.number(); v.boolean(); v.date();

// 复合
v.object({ name: v.string(), age: v.number() });
v.array(v.string());
v.record(v.string(), v.number());
v.tuple([v.string(), v.number()]);
```

<div v-click class="mt-3 text-sm">

> 每个类型都是**小写函数**，不用 `new`。object 接「键 → schema」映射。

</div>

<!--
schema 全景，分两页。先看基础和复合。

基础类型：string、number、boolean、date，还有 bigint、symbol、null、undefined、any、unknown 等。

复合类型：object 接一个「键到 schema」的映射，定义对象结构；array 接一个元素 schema；record 是键值记录；tuple 是定长元组；还有 map、set。

记住两点：每个类型都是小写函数，不用 new 实例化，这是函数式风格；object 的值必须是 schema 函数调用，不能写字符串。
-->

---

# schema 全景（二）

```ts
v.literal('admin');                 // 字面量
v.picklist(['light', 'dark']);      // 字面量列表 ≈ z.enum
v.enum(Direction);                  // TS 原生 enum（导出名 enum_）
v.union([v.string(), v.number()]);  // 联合
v.optional(v.string());             // 可选(undefined)
v.nullable(v.string());             // 可空(null)
v.nullish(v.string());              // 两者都接受
```

<div v-click class="mt-3 text-sm">

> `picklist` 是字面量列表，`enum` 是原生枚举，别混。

</div>

<!--
schema 全景第二页，特殊类型。

literal 校验单个字面量值。picklist 校验字面量列表，比如只能是 light 或 dark，它对应 Zod 的 z.enum，这是最常用的。注意区分 v.enum，它校验的是 TypeScript 原生 enum 对象，因为 enum 是保留字，源码导出名其实是 enum 下划线，后面会讲。

union 是通用联合，传 schema 数组。

可选可空三件套：optional 只接受 undefined，nullable 只接受 null，nullish 两者都接受，分工要分清。它们都能传第二个参数当默认值。
-->

---

# 对象额外键 & 派生

```ts
v.object({ id: v.number() });        // 默认：剔除多余键
v.strictObject({ id: v.number() });  // 多余键 → 报错
v.looseObject({ id: v.number() });   // 保留多余键

const U = v.object({ id: v.number(), name: v.string() });
v.pick(U, ['id']);   v.omit(U, ['id']);
v.partial(U);        v.required(U);
```

<div v-click class="mt-3 text-sm">

> 用**独立函数**表达策略，而非 Zod 的 `.strict()` / `.passthrough()`。

</div>

<!--
两组实用功能。

第一组，对象怎么处理没声明的多余键。Valibot 用不同函数：默认的 object 会剔除多余键；strictObject 有多余键就报错；looseObject 保留多余键；还有 objectWithRest 给多余键指定 schema。注意这里又是和 Zod 的差异：Zod 用 strict、passthrough 方法链，Valibot 用独立函数。

第二组，从一份对象 schema 派生新 schema，对位 TS 工具类型：pick 取子集，omit 去键，partial 全部可选，required 全部必填，还有 keyof 取键名。这样可以从一份基础 schema 派生出创建、更新等多种形态。
-->

---

# 进阶：递归 & 判别联合

```ts
// 递归：lazy 延迟求值打破循环
const Node = v.object({
  name: v.string(),
  children: v.array(v.lazy(() => Node)),
});

// 判别联合：variant 按字段分流（≈ discriminatedUnion）
const Shape = v.variant('type', [
  v.object({ type: v.literal('circle'), r: v.number() }),
  v.object({ type: v.literal('rect'), w: v.number() }),
]);
```

<!--
两个进阶 schema。

递归结构，比如树或嵌套评论，会遇到定义自己时要引用自己的循环。用 lazy，它接收一个返回 schema 的函数，到校验时才求值，这样就能引用还没定义完的自己。

判别联合，对象联合里有个判别字段，比如 type。用 variant，第一个参数是判别字段名，它会直接看 type 选中对应分支，比 union 挨个尝试更高效、报错也更准，对应 Zod 的 discriminatedUnion。普通 union 是无判别键、逐个试的通用联合。
-->

---

# 进阶：跨字段校验

```ts
const Register = v.pipe(
  v.object({
    password: v.pipe(v.string(), v.minLength(8)),
    confirm: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['confirm']],
      (i) => i.password === i.confirm,
      '两次密码不一致',
    ),
    ['confirm'],   // issue 指到 confirm
  ),
);
```

<!--
跨字段校验，最典型的就是确认密码等于密码。

关键有两点。第一，跨字段的 action 要放在对象 schema 之后的 pipe 里，因为单个字段自己的 pipe 看不到兄弟字段的值。第二，用 partialCheck 拿到相关字段做布尔判断，再用 forward 把产生的 issue 转发到指定字段路径，这里是 confirm。

这样表单就能在 confirm 这个字段下面显示「两次密码不一致」，而不是显示在一个笼统的根位置。这是做表单校验绕不开的组合。
-->

---

# 异步校验

```ts
const Profile = v.objectAsync({
  username: v.pipeAsync(
    v.string(),
    v.checkAsync(isUsernameAvailable, '用户名已占用'),
  ),
  avatar: v.pipe(v.string(), v.url()),   // 同步照常
});

await v.safeParseAsync(Profile, data);
```

<v-clicks>

- 约定：同名 + **Async** 后缀
- 异步只能嵌在异步里；同步可嵌在异步里
- **能同步就同步**，只把必须异步的上提

</v-clicks>

<!--
要查数据库、调远程接口的校验，得用异步版本。

命名约定很简单：同名加 Async 后缀，比如 objectAsync、pipeAsync、checkAsync、safeParseAsync。例子里 username 要查用户名是否可用，是异步的，所以它外层的 object 和 pipe 都得换成 Async 版本；而 avatar 只是校验 url，同步的，照常写。

两条铁律。第一，异步函数只能嵌套在异步函数里；反过来，同步函数可以嵌在异步里。所以一旦某层异步，外层容器和解析方法都要跟着换成 Async。第二，官方建议能同步就同步，只把必须异步的那部分上提为 Async，控制复杂度和体积。
-->

---

# 体积真相：tree-shaking

```ts
// 只 import 用到的，没用到的被摇掉
import { string, email, pipe } from 'valibot';
```

<v-clicks>

- 能力是**独立函数** → 没用到就删
- `package.json` 标 `sideEffects: false`
- Zod 方法挂对象上 → 未调用的**难被摇掉**
- 例：Valibot ≈ 1.37 kB vs 标准 Zod ≈ 17.7 kB

</v-clicks>

<!--
回到体积，讲清楚为什么小。根因是架构对打包器友好，不是压缩魔法。

第一，Valibot 把每个能力做成单独导出的函数，你没 import 的就被 tree-shake 删掉。第二，它的 package.json 标了 sideEffects false，告诉打包器可以安全摇树。

对比 Zod：Zod 把功能做成对象、类上的方法。官方原话是，这些带额外功能的方法，当前打包器在它们没被调用时很难删除，所以即便你没用 email，它也可能被打进产物。

官方给的数字，一个 string 加 email 的例子量级：Valibot 大约 1.37 kB，标准 Zod 大约 17.7 kB，小约 90%；对 Zod Mini 也小约 73%。
-->

---

# 性能：有意的取舍

<v-clicks>

- 运行时速度处于 **中游**
- 约为 Zod v3 的 **2 倍**
- 但**慢于** Typia / TypeBox（编译器/Function 构造器）
- 它优先：**小体积 + 快启动**

</v-clicks>

<div v-click class="mt-6 text-sm">

> 前端校验数据量小，省下的下载体积，远比微秒级校验差异实在。

</div>

<!--
体积小，那运行时速度呢？官方很坦诚。

Valibot 的运行时校验速度处于中游：大约是 Zod v3 的两倍快，但明显慢于 Typia 和 TypeBox。为什么？因为后者用编译器生成优化代码，或者用 Function 构造器，Valibot 这两样都不用。

它优先追求的是极小 bundle 和极快启动，而不是纯运行时校验速度。这是有意的架构取舍。

怎么判断该不该用？前端、边缘场景里，校验的数据量通常很小，就是用户提交的一个表单，每次校验那点微秒级差异，远不如让每个用户少下载十几 KB 来得实在。所以 Valibot 特别适合客户端和包体敏感的场景；如果是服务端高吞吐、追求极致校验速度，Typia、TypeBox 可能更合适。
-->

---

# safeParse 的三态

```ts
// ① 完全通过
{ typed: true,  success: true,  output, issues: undefined }
// ② 类型对，但 action 没过（output 仍有值！）
{ typed: true,  success: false, output, issues: [...] }
// ③ 连类型都不对
{ typed: false, success: false, output: unknown, issues }
```

<div v-click class="mt-3 text-sm">

> `typed` = 类型是否匹配；`success` = 是否全部通过。日常用 `success` 即可。

</div>

<!--
一个进阶细节，体现 Valibot 的严谨。safeParse 的返回其实是三态联合，除了 success 还有一个 typed 字段。

第一态，完全通过：typed true、success true、有 output、issues 是 undefined。

第二态，类型对但 pipe 里某个 action 没过，比如输入确实是字符串，但没通过 minLength 8。这时 typed 是 true、success 是 false，而且注意，output 仍然有值。

第三态，连类型都不对：typed false、success false、output 是 unknown。

所以 typed 表示数据的类型是否匹配 schema，success 表示是否全部通过、包括 pipe 里的校验。日常判断用 success 就够了，typed 用在你想区分「类型已对、只是业务规则没过」这种细分场景。
-->

---

# 从 Zod 迁移

| Zod | Valibot |
|---|---|
| `z.string().email()` | `v.pipe(v.string(), v.email())` |
| `z.infer` | `v.InferOutput` |
| `.optional()` | `v.optional()` |
| `z.enum([...])` | `v.picklist([...])` |
| `.strict()` | `v.strictObject()` |
| `z.discriminatedUnion` | `v.variant` |

<div v-click class="mt-2 text-sm">

> 一键迁移：`npx @valibot/zod-to-valibot`

</div>

<!--
从 Zod 迁移，核心映射记几条。

方法链 string email 变成 pipe string email。z.infer 变成 InferOutput。点 optional 变成 optional 包裹。z.enum 字面量列表变成 picklist。点 strict 变成 strictObject。discriminatedUnion 变成 variant。

还有几个常见的：z.or 变 union，z.and 变 intersect，refine 变 check 或 forward，catch 变 fallback，nativeEnum 变 enum。

整体操作：把 import z from zod 改成 import star as v from valibot，把 z 点换成 v 点，方法链改写成 pipe。官方还提供 codemod，npx @valibot/zod-to-valibot，能自动转写大部分写法，边缘用法再人工核对。
-->

---

# 命名约定：保留字

```text
源码导出：enum_ as enum, null_ as null,
          undefined_ as undefined, void_, function_
```

```ts
import * as v from 'valibot';
v.enum(MyEnum);   // ✅ 属性访问不受保留字限制
v.null();         // ✅

import { enum_ } from 'valibot';  // ✅ 具名要用下划线版
import { enum }  from 'valibot';  // ❌ enum 是保留字
```

<!--
一个容易踩的命名约定。

enum、null、undefined、void、function 这几个是 JavaScript 保留字，不能直接当具名导入的标识符。所以 Valibot 源码把它们导出成下划线版，再做别名：enum 下划线 as enum，null 下划线 as null，等等。

结果就是：用通配符导入时，写 v.enum、v.null 没问题，因为属性访问不受保留字限制。但如果你用具名导入，必须写下划线版，import enum 下划线；直接 import enum 会语法报错。

这个坑在从 Zod 迁移、或者改成具名导入时最容易遇到，记一下。
-->

---

# 常见陷阱：optional 缺省

```ts
// 键缺失且无默认值 → 该字段 pipe 不执行
v.object({
  active: v.pipe(v.optional(v.string()), v.transform(toBool)),
}); // 缺 active → transform 跳过，类型 { active?: boolean }

// 给默认值 → pipe 会执行，键变必有
v.object({
  active: v.pipe(v.optional(v.string(), 'false'), v.transform(toBool)),
}); // 类型 { active: boolean }
```

<!--
再讲一个高频陷阱，跟 optional 有关。

官方明确说：在对象 schema 里，如果一个 optional 键缺失，而且没给默认值，那么这个字段的 pipe，包括里面的 transform，是不会执行的。上面这个例子，如果对象里没有 active 这个键，transform 就被跳过，输出类型是 active 可选的 boolean。

要让缺失的键也跑 pipe，就得给 optional 提供默认值，比如第二个例子给了 false。这时 transform 会执行，而且这个键在输出类型里变成必有的 boolean。

这个行为很反直觉，调试表单默认值的时候经常卡在这里，记住「缺省不给默认值就不跑 pipe」。
-->

---
layout: intro
---

# 总结

Valibot = **极小体积的函数式 schema 校验库**

- 心智：schema + action + **pipe**，不是方法链
- 解析：`parse`（抛错）/ `safeParse`（output / issues / success）
- 类型：`InferOutput` 常用，`InferInput` 输入侧
- 体积：模块化 + `sideEffects:false`，比 Zod 小约 90%
- 取舍：小体积快启动优先，运行时中游
- 边界：**校验库 ≠ 运行时/打包器**，import 即用

<!--
总结一下。

Valibot 是一个极小体积的函数式 schema 校验库。

心智模型：schema 定义类型、action 做校验和转换、用 pipe 组合，而不是 Zod 那种方法链。解析两个方法：parse 失败抛错，safeParse 返回结果对象，记住 output、issues、success 三个字段。类型推导：InferOutput 最常用，InferInput 用在输入侧。

体积是它的招牌：模块化加 sideEffects false，配合 tree-shaking，官方对比比标准 Zod 小约 90%。这是有意的取舍：优先小体积和快启动，运行时速度只是中游，前端场景非常划算。

最后强调边界：Valibot 是被调用的校验库，不是运行时、也不是打包器，在任何 JS 环境 import 即用。从 Zod 过来，认准 1.x，把链改成 pipe，必要时用官方 codemod。谢谢大家。
-->
