---
theme: seriph
background: https://cover.sli.dev
title: Zod — TypeScript-first Schema 校验
info: |
  Presentation Zod — TypeScript 优先的 schema 声明与校验库。

  版本基线 Zod 4。Learn more at [https://zod.dev](https://zod.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🛡️</span>
</div>

<br/>

## Zod — TypeScript-first Schema 校验

声明一次 schema，同时拿到**运行时校验**与**静态类型**。零依赖、链式 API、环境无关。版本基线 **Zod 4**

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/colinhacks/zod" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Zod。它由 Colin McDonnell 发起,官方一句话定位是 TypeScript-first schema validation with static type inference——以 TypeScript 为先的 schema 校验,带静态类型推导。

一句话抓住它:你声明一次 schema,就同时得到两样东西——运行时的数据校验,和编译期的 TS 类型。不用再手写一份 interface、另写一份校验逻辑。

它纯 TS 实现、零运行时依赖,前端、Node、Deno、Bun 都能 import 即用,和你的运行时无关。

主线:为什么用 → 核心范式 → 定义 schema 与 z.infer → parse vs safeParse → 构件全景 → 校验 vs 转换 → refine/transform/pipe → 判别联合与递归 → 错误处理 → v3 到 v4 差异 → 生态 → 总结。版本基线是 Zod 4,当前最新 4.4.x。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用它校验

<v-clicks>

- 手写 `interface` + 另写校验 → **两份维护、易不一致**
- 外部数据（API/表单/env）运行时**不可信**
- TS 类型编译后**被擦除**，运行时无保护
- 校验报错想**结构化**对接表单与日志

</v-clicks>

<div v-click class="mt-6">

Zod 的回应：

- `z.infer` 从 schema 推类型 → **类型与校验同源**
- 运行时 `parse`/`safeParse` → **边界处守住数据**
- `ZodError.issues` 结构化 → **好对接 UI/日志**

</div>

<!--
为什么要专门引入一个校验库?几个老痛点。

第一,传统做法是手写一个 TypeScript interface,再单独写一套运行时校验代码,两份东西要同步维护,改了一个忘了另一个就会不一致。第二,所有外部数据——API 响应、用户表单、环境变量——在运行时都是不可信的,类型系统管不到。第三,TS 类型在编译后会被完全擦除,运行时没有任何类型保护。第四,校验失败时,我们希望拿到结构化的错误,方便挂到表单字段或写进日志。

Zod 的回应非常对症:用 z.infer 从 schema 直接反推类型,做到类型与校验同一来源;用 parse 或 safeParse 在程序边界处校验,守住进来的数据;ZodError 的 issues 是结构化数组,带 code、path、message,方便对接 UI 和日志。这就是今天的主线。
-->

---

# 核心范式：声明一次，两份产出

```ts
import * as z from "zod";

// 一份 schema
const User = z.object({
  name: z.string(),
  age: z.number(),
});

// 产出 1：编译期类型（z.infer 反推）
type User = z.infer<typeof User>;   // { name: string; age: number }

// 产出 2：运行时校验
User.parse({ name: "Ann", age: 20 });
```

<div v-click class="mt-3 text-sm">

> schema 是**类型的唯一来源**：改 schema，类型与校验同时跟着变。

</div>

<!--
这是整个 Zod 最该先建立的认知:一份 schema,两份产出。

中间这个 z.object 就是一份 schema 声明。从它出发,向上用 z.infer 反推,得到一个编译期的 TS 类型 User,内容是 name 是 string、age 是 number;向下用 .parse,在运行时校验传进来的数据合不合规。

关键结论在底下:schema 是类型的唯一来源 single source of truth。你只改 schema 这一处,推导出来的类型和运行时的校验规则会同时跟着变,从根上杜绝了 interface 和校验逻辑对不上的问题。后面所有内容,都是围绕怎么写好这份 schema 展开的。
-->

---
layout: two-cols-header
---

# 安装与导入

::left::

**安装（Node 18+）**

```bash
npm install zod
pnpm add zod
bun add zod
```

::right::

**导入（推荐通配符）**

```ts
import * as z from "zod";

const Name = z.string();
```

<div class="mt-4 text-sm">

- 自带 TS 类型、**零运行时依赖**，ESM + CJS 双产物
- 建议 `tsconfig` 开 `strict`，推导才准
- 特殊入口：`zod/mini`（极小变体）

</div>

<!--
安装与导入,很轻。

左边:Node 18 及以上,npm install zod,pnpm、yarn、bun 同理。Zod 自带 TypeScript 类型声明、零运行时依赖,同时提供 ESM 和 CommonJS 两种产物。

右边:官方推荐通配符导入,import 星号 as z,然后统一用 z 前缀调用,比如 z.string。也能具名导入,但通配符更常见、更清晰。

两个提醒:第一,务必在 tsconfig 里开 strict 模式,否则类型推导可能不准。第二,Zod 4 还提供一个特殊入口 zod/mini,是函数式、可摇树的极小变体,后面会单独讲,日常应用用 zod 就够了。
-->

---

# 第一段代码

```ts
import * as z from "zod";

// 1. 定义 schema
const LoginSchema = z.object({
  email: z.email("邮箱格式不正确"),       // v4：顶层 z.email()
  password: z.string().min(8, "密码至少 8 位"),
});

// 2. 由 schema 推导类型
type LoginData = z.infer<typeof LoginSchema>;
// { email: string; password: string }

// 3. 校验数据（失败抛 ZodError）
LoginSchema.parse({ email: "a@b.com", password: "secret123" });
```

<!--
把范式落成第一段真实代码,一个登录表单的校验。

第一步,定义 schema:z.object 描述一个对象,email 字段用 z.email 校验邮箱格式,password 用 z.string().min(8) 要求至少 8 位。注意每个校验方法的第二个参数,是这一条失败时的自定义错误消息。

第二步,z.infer 推导出 LoginData 类型,就是 email 和 password 都是 string。

第三步,LoginSchema.parse 校验数据,通过就返回带类型的值,失败就抛 ZodError。

这里有三件事要记牢:第一,每个基础类型是小写工厂函数,z.string,不是 new String;第二,校验直接链在 schema 上,点 min 点 max;第三,Zod 4 里邮箱这类格式用顶层函数 z.email,而不是 v3 的 z.string().email(),后者已经弃用了。这个差异后面还会专门讲。
-->

---

# parse vs safeParse

```ts
// A：parse —— 失败抛 ZodError，需 try/catch
try {
  const user = LoginSchema.parse(data);
} catch (err) {
  if (err instanceof z.ZodError) console.log(err.issues);
}

// B：safeParse —— 返回判别联合，不抛异常
const r = LoginSchema.safeParse(data);
if (r.success) console.log(r.data);   // 校验后的值（带类型）
else console.log(r.error);            // ZodError
```

<div v-click class="mt-2 text-sm">

> 字段记牢：成功值在 **`data`**，错误在 **`error`**，判断用 **`success`**。含 async 校验时改用 `parseAsync` / `safeParseAsync`。

</div>

<!--
拿到 schema 怎么用?两种校验入口,这是日常最高频的选择。

方式 A,parse:校验失败直接抛 ZodError,所以要包 try-catch。抓到后判断 err 是不是 ZodError 实例,再读 err.issues 拿所有问题。适合你本来就有异常处理流程的场景。

方式 B,safeParse:不抛异常,而是返回一个判别联合对象。成功时 success 为 true、值在 data 里;失败时 success 为 false、错误在 error 里。它用返回值的分支代替了异常控制流,更适合不想写 try-catch 的场景,比如表单提交。

底下三个字段一定记牢:成功值在 data、错误在 error、用 success 判断。最后补一句:如果你的 schema 里用到了 async 的 refine 或 transform,比如查库验证唯一性,同步的 parse 会报错,必须改用 parseAsync 或 safeParseAsync。
-->

---

# schema 全景：构件

```ts
// 原语
z.string(); z.number(); z.boolean(); z.bigint(); z.date();
z.null(); z.undefined(); z.any(); z.unknown(); z.never();

// 复合
z.object({ name: z.string() });   // 对象
z.array(z.string());              // 数组
z.tuple([z.string(), z.number()]); // 定长元组
z.union([z.string(), z.number()]); // 联合
z.record(z.string(), z.number()); // ⚠️ v4 必须两参
z.map(z.string(), z.number()); z.set(z.number()); // Map / Set

// 字面量 / 枚举
z.literal("admin");
z.enum(["light", "dark"]);        // ⚠️ v4 重载也吃 TS 原生 enum
```

<!--
Zod 的一切都从 schema 工厂函数开始,这页快速过一遍构件全景,做到心里有数。

原语:string、number、boolean、bigint、date,以及 null、undefined、any、unknown、never,基本覆盖 JS 的原始类型。

复合:z.object 描述对象,z.array 数组,z.tuple 定长异构元组,z.union 联合类型,z.record 描述键值对——注意这里有个 v4 的坑,record 现在必须传两个参数,键 schema 和值 schema,v3 只传一个值的写法已经移除。还有 z.map 和 z.set 对应 ES 的 Map 和 Set。

字面量和枚举:z.literal 是单个字面量,z.enum 是一组字符串字面量。这里又是一个 v4 变化:z.enum 被重载了,既能吃字符串数组,也能直接吃 TS 原生的 enum,所以以前的 z.nativeEnum 被弃用,现在统一用 z.enum。

这些构件都返回不可变 schema,可以继续往上链方法,加约束。
-->

---

# 对象：额外键策略

| 工厂 | 对未声明的多余键 |
|---|---|
| `z.object({...})` | 默认 **剥离 strip**：通过但输出不含多余键 |
| `z.strictObject({...})` | 有多余键就 **报错**（⚠️ 取代 `.strict()`） |
| `z.looseObject({...})` | **保留** 多余键（⚠️ 取代 `.passthrough()`） |
| `.catchall(s)` | 给所有未声明键的值指定 schema |

```ts
z.object({ name: z.string() }).parse({ name: "a", extra: 1 });
// => { name: "a" }（extra 被剥离）

z.strictObject({ name: z.string() }).parse({ name: "a", extra: 1 });
// => 抛 ZodError（unrecognized_keys）
```

<!--
对象校验里一个高频问题:数据里有 schema 没声明的多余键,怎么办?Zod 4 用不同的工厂函数来表达三种策略,而不是 v3 那种 .strict、.passthrough 的方法链。

第一行,默认的 z.object:多余键会被剥离 strip,校验通过,但输出对象里不含那些多余键。这是最常用、最安全的默认。

第二行,z.strictObject:只要有多余键就直接报错,错误码是 unrecognized_keys。适合严格契约,比如不允许客户端传多余字段。它取代了 v3 的 .strict 方法。

第三行,z.looseObject:原样保留多余键。取代了 v3 的 .passthrough。

最后 .catchall,是另一个维度:给所有未声明键的值统一指定一个 schema,比如已知字段之外的任意键,值都必须是 string。

下面代码就是前两种的对比:默认剥离 extra,strictObject 直接抛错。记住这是 v4 的重要行为变化,从老代码迁移时这几个方法名都得换。
-->

---

# 可选 / 可空 / 默认值

```ts
z.string().optional();   // 额外接受 undefined
z.string().nullable();   // 额外接受 null
z.string().nullish();    // null 和 undefined 都接受

z.string().default("tuna");      // 缺省(undefined)时填充
z.number().default(Math.random); // 传函数：每次解析重新求值
z.number().catch(42);            // 校验失败时回退
```

<div v-click class="mt-2 text-sm">

> ⚠️ **v4 默认值短路**：`.default(v)` 在输入 `undefined` 时**直接返回 v、不走解析**，故 `v` 须匹配**输出类型**。要让默认值先过解析（v3 旧行为）改用 `.prefault()`。`.default()` 只管 `undefined`，`.catch()` 才管「值非法兜底」。

</div>

<!--
可选、可空、默认值,这三组容易混,要分清。

前三行管缺省:optional 只额外接受 undefined,推导成可选属性;nullable 只额外接受 null;nullish 是两者都接受。分工很清楚——optional 管 undefined、nullable 管 null、nullish 全管。

后三行管填充和兜底:default 在输入是 undefined 时填一个默认值;default 还能传函数,比如 Math.random,这样每次解析都重新求值;catch 是另一回事——在校验失败时回退到一个值。

底下这个 v4 的坑必须强调:default 在 v4 里是短路的。输入是 undefined 时,它直接返回你给的默认值,不再走后续解析,所以这个默认值必须能赋给 schema 的输出类型。如果你想要 v3 那种默认值先经过解析的旧行为,得改用新的 .prefault。再记一句分工:default 只对 undefined 生效,值非法时的兜底要用 catch,两个别混。
-->

---

# 校验 vs 转换

<div class="grid grid-cols-2 gap-4 text-sm">

<div>

**校验**（只判断，不改值）

- `.min()` `.max()` `.regex()`
- 顶层 `z.email()` `z.url()`
- 自定义 `.refine()`

</div>

<div>

**转换**（改值，改输出类型）

- `.trim()` `.toLowerCase()`
- `z.coerce.*`
- 自定义 `.transform()`

</div>

</div>

```ts
const Email = z.email().trim();                  // email 校验 + trim 转换
const Num = z.string().transform((s) => Number(s)); // string → number
z.coerce.number().parse("42");   // => 42（先 Number("42")，⚠️ v4 输入 unknown）
```

<!--
Zod 的链式方法分两大类,分清这点是写好 schema 的关键。

左边是校验:只判断值合不合法,不改变值本身。比如 min、max、regex 限制长度和格式,顶层的 z.email、z.url 校验格式,以及自定义的 refine。

右边是转换:会改变值,甚至改变类型,从而改变 schema 的输出类型。比如 trim 去空白、toLowerCase 转小写,z.coerce 系列强制转换,以及自定义的 transform。

下面三行代码:第一行,z.email().trim(),email 是校验、trim 是转换,组合用;第二行,transform 把字符串转成数字,输入是 string、输出变成 number;第三行,z.coerce.number 强制转换,收到字符串 42 会先 Number 一下再校验,结果是数字 42。这里又一个 v4 细节:所有 coerce 的输入类型现在是 unknown,而 v3 是具体类型。coerce 特别适合处理来自 URL query、表单、环境变量这些天生是字符串的输入。
-->

---

# 类型推导：infer / input / output

```ts
const Schema = z.string().transform((s) => s.length);

type In = z.input<typeof Schema>;   // string（校验前）
type Out = z.output<typeof Schema>; // number（校验后）
type T = z.infer<typeof Schema>;    // number（= output）
```

<v-clicks>

- **`z.infer`**：日常最常用，等于 `z.output`，「校验后的业务类型」
- **`z.input`**：校验前的输入类型（如表单原始值）
- 二者**何时不同**：有 `transform` / `coerce` / `default` 时；纯校验则输入输出一致

</v-clicks>

<!--
类型推导有三个工具,平时用一个就够,但要知道另外两个存在和区别。

看代码:一个 schema,先 string 校验,再 transform 成它的长度。这时输入和输出的类型就分开了——z.input 是校验前的类型,这里是 string;z.output 是校验后的类型,这里是 number;z.infer 等于 z.output,也是 number。

总结这三个:z.infer 是日常最常用的,等于 output,代表校验后的业务类型,绝大多数情况用它就对。z.input 是校验前的输入类型,少数场景用,比如你要拿表单的原始值类型。

关键是它俩什么时候不一样:只有当 schema 里有 transform、有 coerce、或者带默认值的 default 时,输入和输出类型才会不同。如果是纯校验,比如 z.email().min(5),输入输出完全一致,这时用哪个都一样。理解这点能避免在带转换的 schema 上取错类型。
-->

---

# refine：自定义与跨字段校验

```ts
const Register = z.object({
  password: z.string().min(8),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  error: "两次密码不一致",
  path: ["confirm"],   // 把错误挂到 confirm 字段
});
```

<v-clicks>

- `.refine(fn, params)`：`fn` 返回布尔，`false` 即失败
- **跨字段逻辑放「对象级」refine** —— 才能拿到整份 `data`
- `path` 把错误定位到具体字段，表单才能就近显示
- 支持 async（须用 `parseAsync`）

</v-clicks>

<!--
内置校验不够用时,用 refine 写自定义逻辑。最经典的场景就是跨字段校验——两次密码是否一致。

看代码:Register 对象有 password 和 confirm 两个字段。注意 refine 是挂在整个 z.object 后面的,这叫对象级 refine。为什么必须挂在对象级?因为只有这样,refine 的回调才能拿到整份 data,才能比较 password 和 confirm 两个字段;如果挂在单个字段上,就只能看到那一个字段的值。

回调返回布尔,这里返回 password 等于 confirm,false 就算失败。第二个参数里,error 是错误消息,path 是关键:它把这条错误挂到 confirm 字段上,这样前端表单就能在 confirm 输入框下方就近显示这条错误,而不是一个笼统的全局错误。

refine 还支持 async 回调,比如查库验证邮箱没被注册,但记得这时校验要改用 parseAsync。一句话:refine 负责回答行不行。
-->

---

# superRefine：多 issue 与自定义 code

```ts
const Tags = z.array(z.string()).superRefine((val, ctx) => {
  if (val.length > 3) {
    ctx.addIssue({ code: "too_big", maximum: 3,
                   inclusive: true, message: "最多 3 个" });
  }
  if (val.length !== new Set(val).size) {
    ctx.addIssue({ code: "custom", message: "不允许重复" });
  }
});
```

<div v-click class="mt-2 text-sm">

> 单个 `refine` 只能产生**一个** issue。要**一次报告多处**问题、或用**不同 error code**，用 `.superRefine((val, ctx) => ...)`（v4 也可写 `.check()`），通过 `ctx.addIssue` 按需添加。

</div>

<!--
refine 有个限制:一次只能产生一个 issue,而且 code 固定。如果你想一次报告多个问题,或者想用不同的错误码,就要升级到 superRefine。

看这个标签数组的例子:superRefine 的回调收两个参数,值 val 和上下文 ctx。里面可以写多个独立判断,每个判断不满足就调一次 ctx.addIssue 手动添加一条 issue。

第一个判断:标签超过 3 个,加一条 code 为 too_big 的 issue,带上 maximum、inclusive、message。第二个判断:用 Set 去重后长度变了说明有重复,加一条 code 为 custom 的 issue。这两条可以同时报出来,用户一次就能看到所有问题。

底下总结:单个 refine 只能一个 issue;要一次报多处、或要自定义 code,用 superRefine,通过 ctx.addIssue 按需添加。Zod 4 里也可以写成 .check,语义一样。一句话:superRefine 是 refine 的加强版,适合复杂、多条件的校验。
-->

---

# transform 与 pipe：构建流水

```ts
// transform：校验后改值；报错不要 throw，而是 push issue + z.NEVER
const Parsed = z.string().transform((val, ctx) => {
  const n = Number.parseInt(val);
  if (Number.isNaN(n)) {
    ctx.issues.push({ code: "custom", message: "不是数字", input: val });
    return z.NEVER;
  }
  return n;
});

// pipe：前一段输出 → 后一段输入（校验 → 转换 → 再校验）
const NonNeg = z.string().pipe(z.coerce.number()).pipe(z.number().nonnegative());
```

<div v-click class="mt-2 text-sm">

> `z.preprocess(fn, schema)` 与 transform 相反，在**校验前**预处理原始输入。

</div>

<!--
refine 回答行不行,transform 回答变成什么。这页讲转换和串联。

上半段,transform:在校验之后改变数据。这个例子把字符串转成整数。关键细节:如果在转换过程中发现问题要报错,不要用 throw,而是往 ctx.issues 里 push 一条 issue,然后 return z.NEVER。z.NEVER 表示这里产不出有效值。为什么不 throw?因为 throw 会打断整个流程、丢失结构化错误,而 push issue 加 NEVER 能把这个错误融进 Zod 统一的错误体系。

下半段,pipe:把多个 schema 串成流水线,前一段的输出作为后一段的输入。这个例子表达了校验到转换再校验的完整链路:先 string 校验,再 coerce.number 转成数字,最后 number().nonnegative 断言非负。每一段职责单一,组合起来很清晰。

底下补一个对应物:z.preprocess 和 transform 方向相反,它在校验之前预处理原始输入,比如先 trim、或者把 null 兜成默认值,再交给后面的 schema 校验。一前一后,配合使用。
-->

---

# 判别联合与递归 schema

```ts
// 判别联合：按共同字面量字段一步选分支（更快、报错更准）
const Result = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.string() }),
  z.object({ status: z.literal("error"), message: z.string() }),
]);

// 递归：v4 用对象字面量里的 getter 引用自身（延迟求值）
const Category = z.object({
  name: z.string(),
  get subcategories() { return z.array(Category); },
});
```

<!--
两个进阶但很常用的构件,放一起讲。

上半段,判别联合 discriminatedUnion。普通的 z.union 是逐个尝试每个成员,直到匹配上,成员多了既慢、报错也笼统。但如果各个分支有一个共同的判别字段,而且是字面量,比如这里的 status,就能用 discriminatedUnion。它第一个参数是判别字段名 status,然后根据数据里 status 的值——是 success 还是 error——一步选中对应分支。好处是更快,而且错误信息更精准,直接告诉你哪个分支不匹配。这就是后端返回结果、Redux action 这类场景的标准建模方式。

下半段,递归 schema。比如分类树,每个分类下还有子分类。Zod 4 推荐用对象字面量里的 getter 来引用自身:subcategories 写成一个 get 访问器,返回 z.array(Category)。getter 是延迟求值的,巧妙规避了 Category 还没定义完就引用自己的初始化问题。这比 v3 那种 z.lazy 加显式类型标注简洁很多。互相递归的两个 schema 也是同样的 getter 写法。
-->

---

# 错误处理三件套（v4）

```ts
const r = Register.safeParse(input);
if (!r.success) {
  z.treeifyError(r.error);   // 与 schema 同构的嵌套树（取代 error.format()）
  z.flattenError(r.error);   // { formErrors, fieldErrors }（取代 error.flatten()）
  z.prettifyError(r.error);  // 人类可读多行字符串（适合日志）
}

// flattenError 输出示例
{ formErrors: [], fieldErrors: { confirm: ["两次密码不一致"] } }
```

<div v-click class="mt-2 text-sm">

> 底料是 `error.issues`（数组，每项 `code`/`path`/`message`，⚠️ v3 的 `error.errors` 已移除）。v4 改用**顶层函数**格式化。

</div>

<!--
校验失败拿到 ZodError 后,怎么把它变成能用的东西?Zod 4 提供三个顶层格式化函数,这是又一个重要的 v4 变化——v3 是在 error 实例上调方法,v4 全改成了顶层函数。

看 safeParse 失败分支里的三个:

treeifyError,生成一棵和 schema 结构同构的嵌套错误树,适合嵌套对象表单按结构取错误。它取代了 v3 的 error.format。

flattenError,返回一个扁平结构,formErrors 是表单级错误、fieldErrors 是字段级错误的映射。底下就是它的输出示例:confirm 字段对应一条两次密码不一致。这个最适合单层表单,直接把 fieldErrors 挂到各输入框。它取代了 v3 的 error.flatten。

prettifyError,生成人类可读的多行字符串,适合打日志、命令行输出。

底下提醒:这三个函数的底料都是 error.issues,一个数组,每项有 code、path、message。注意 v3 的 error.errors 这个别名在 v4 已经移除了,现在统一叫 issues。
-->

---

# v3 → v4 关键差异（一）

| 主题 | Zod 3 | Zod 4 |
|---|---|---|
| 错误定制 | `message` / `invalid_type_error` / `errorMap` | 统一为单个 `error` |
| 字符串格式 | `z.string().email()` `.url()` | 顶层 `z.email()` `z.url()` |
| IP / CIDR | `z.string().ip()` `.cidr()` | `z.ipv4()` `z.cidrv4()`（旧已移除） |
| 枚举 | `z.nativeEnum(E)` | `z.enum(E)`（重载支持 TS enum） |
| 错误格式化 | `error.format()` / `.flatten()` | `z.treeifyError()` / `z.flattenError()` |
| 错误明细 | `error.errors` | `error.issues`（`errors` 已移除） |

<!--
专门用两页系统过一遍 v3 到 v4 的关键差异,因为网上大量老教程还是 v3 写法,混用最容易踩坑。这是第一页,六个点。

第一,错误定制:v3 散在 message、invalid_type_error、required_error、errorMap 好几个地方,v4 统一收成一个 error 键,可以是字符串,也可以是接收 issue 的函数。

第二,字符串格式:v3 是链式 z.string().email(),v4 提升成顶层 z.email、z.url,这是前面反复强调的。

第三,IP 和 CIDR:v3 的 .ip、.cidr 在 v4 已经移除,拆成了 z.ipv4、z.ipv6、z.cidrv4、z.cidrv6,更精确。

第四,枚举:z.nativeEnum 弃用,z.enum 重载后既吃数组也吃 TS enum。

第五,错误格式化:实例方法 format、flatten 改成顶层函数 treeifyError、flattenError。

第六,错误明细字段:error.errors 移除,统一用 error.issues。

这六个里,invalid_type_error、.ip、error.errors 是直接移除的,必须立刻改。
-->

---

# v3 → v4 关键差异（二）

| 主题 | Zod 3 | Zod 4 |
|---|---|---|
| 默认值 | `.default()` 解析默认值 | 短路填充；旧行为用 `.prefault()` |
| 记录 | `z.record(value)`（单参） | `z.record(key, value)`（必须两参） |
| 对象合并 | `A.merge(B)` | `A.extend(B.shape)` |
| 严格 / 透传 | `.strict()` / `.passthrough()` | `z.strictObject()` / `z.looseObject()` |
| 全局错误 | `z.setErrorMap(map)` | `z.config({ customError })` |
| JSON Schema | 第三方 `zod-to-json-schema` | 内置 `z.toJSONSchema()` |

<div v-click class="mt-2 text-sm">

> 多数旧 API 在 v4 仍**兼容但弃用**（编辑器有删除线），可渐进迁移；少数已直接移除需立即改。

</div>

<!--
v3 到 v4 差异第二页,再六个点。

第一,默认值:v3 的 default 会解析默认值,v4 改成短路填充——前面讲过,值要匹配输出类型,想要旧行为用 prefault。

第二,记录类型:z.record 从单参变成必须两参,键 schema 加值 schema。

第三,对象合并:A.merge(B) 弃用,改用 A.extend,传 B 的 shape。

第四,严格和透传:.strict、.passthrough 这两个方法,换成 z.strictObject、z.looseObject 两个工厂函数。

第五,全局错误:z.setErrorMap 换成 z.config 传 customError。

第六,JSON Schema:v3 要装第三方的 zod-to-json-schema,v4 内置了 z.toJSONSchema,一行搞定,还能选 target 比如 draft-2020-12 或 openapi-3.0。

底下一个让人安心的结论:这些变化里,大多数旧 API 在 v4 其实还兼容、只是标了弃用,编辑器里有删除线提示,可以渐进迁移,不用一次性全改;只有少数是真移除了,那几个要立刻改。迁移压力没有想象中大。
-->

---
layout: two-cols-header
---

# 生态接入

::left::

**React Hook Form**

```ts
import { zodResolver }
  from "@hookform/resolvers/zod";

const form = useForm({
  resolver: zodResolver(Register),
});
```

**tRPC**

```ts
t.procedure
  .input(z.object({ name: z.string() }))
  .mutation(({ input }) => { /* 已校验 */ });
```

::right::

**环境变量校验**

```ts
const env = z.object({
  NODE_ENV: z.enum(
    ["development", "production"]),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url(),
}).parse(process.env);  // 缺失即 fail fast
```

<!--
Zod 真正的价值,在于它已经长进了整个 TS 生态。三个最有代表性的接入点。

左上,React Hook Form:通过官方的 zodResolver,一行就把 Zod schema 接进表单,校验失败的错误会自动映射到对应字段,前端表单校验几乎零样板。

左下,tRPC:用 .input 传入一个 Zod schema 校验过程的入参。它的妙处是一箭双雕——既在运行时校验了入参,又让 input 在 handler 里自带了精确类型,实现了客户端到服务端的端到端类型安全,这正是 tRPC 的招牌能力。

右边,环境变量校验,这是被低估但极实用的一招:在应用启动时,用一个 z.object 把 process.env 收敛成可信、带类型的配置对象。NODE_ENV 限定枚举,PORT 用 coerce.number 把字符串转成数字并给默认值,DATABASE_URL 校验是合法 URL。任何缺失或非法,启动时就 fail fast 直接报错,而不是等到运行时某个角落才崩。T3 Env 就是把这套封装成了库。
-->

---

# Zod Mini 与 Standard Schema

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

**Zod Mini**（`zod/mini`）

```ts
import * as z from "zod/mini";

// Classic: z.string().min(5).optional()
z.optional(
  z.string().check(z.minLength(5)),
);
```

- 与 Classic 共享内核，**函数式 API**
- 更优 tree-shaking、更小 bundle
- 取舍：体积敏感选 Mini，DX 选 Classic

</div>

<div>

**Standard Schema**

- v4 实现该规范，schema 暴露 `~standard`
- TanStack Form 等工具**直接消费**，无需逐库适配
- 库作者可面向接口编程，同时兼容 Zod / Valibot / ArkType

</div>

</div>

<!--
最后两个进阶话题,了解即可。

左边,Zod Mini。前面提过,Classic 版本把方法都挂在类上,链式很好用,但当前的打包器难以把没用到的方法摇掉,bundle 偏大。Mini 是和 Classic 共享同一个内核、但改用函数式 API 的极小变体。看代码对比:Classic 写 z.string().min(5).optional(),Mini 要写成 z.optional 包着 z.string().check(z.minLength(5))。每个能力都是独立函数,只有你实际 import 的才会打进包里,tree-shaking 更彻底、体积更小。取舍很简单:对 bundle 体积极敏感的场景,比如边缘函数、嵌入式前端,选 Mini;追求开发体验、好读好写,选 Classic。Mini 同样支持 z.infer,校验语义完全一致。

右边,Standard Schema。这是一个跨校验库的通用规范。Zod 4 实现了它,schema 上会暴露一个 ~standard 属性。意义在于:像 TanStack Form 这样的工具,只要面向 Standard Schema 编程,就能直接消费 Zod schema,不用为 Zod 单独写适配器。反过来,库作者如果只是要接受用户传入的 schema 做校验,也面向这个接口编程,就能同时兼容 Zod、Valibot、ArkType 三家,不绑死任何一个。这是校验库生态走向互通的重要一步。
-->

---
layout: intro
---

# 总结

Zod = **声明一次 schema，类型与校验同源**

- 范式：`z.infer` 推类型 + `parse`/`safeParse` 跑校验
- 取值：成功在 `data`、错误在 `error`、判断用 `success`
- 组合：`refine` 判行不行 / `transform` 变成什么 / `pipe` 串流水
- 错误：`treeifyError` / `flattenError` / `prettifyError`（v4 顶层）
- v4 要点：顶层 `z.email()`、`error` 统一、`default` 短路、`record` 两参
- 生态：tRPC / React Hook Form / env 校验 + Standard Schema 互通

<!--
总结一下今天的 Zod。

一句话:声明一次 schema,类型与校验同一来源,这是它最核心的价值。

技术要点收成六条。

第一,核心范式:用 z.infer 从 schema 推导 TS 类型,用 parse 或 safeParse 在运行时跑校验,一份 schema 两份产出。

第二,取值口诀:safeParse 的成功值在 data、错误在 error、用 success 判断。

第三,组合三件套:refine 回答行不行、transform 回答变成什么、pipe 把多段串成流水线。

第四,错误处理:v4 用三个顶层函数,treeifyError 出树、flattenError 出扁平字段错误、prettifyError 出可读字符串。

第五,v4 最该记的几个变化:字符串格式提到顶层 z.email,错误定制统一到 error 键,default 改成短路填充,record 必须传两参。从 v3 迁移盯紧这几个。

第六,生态:tRPC、React Hook Form、环境变量校验都深度集成,而且 v4 实现了 Standard Schema,和 Valibot、ArkType 等走向互通。

把这些串起来,Zod 就是你在程序边界守护数据、又同时拿到类型的那把伞。谢谢大家。
-->
