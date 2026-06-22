---
theme: seriph
background: https://cover.sli.dev
title: 属性测试
info: |
  属性测试全指南：fast-check 4.8 + @fast-check/vitest

  Learn more at [https://fast-check.dev/](https://fast-check.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:chart-relationship class="text-8xl" />
</div>

<br/>

## 属性测试

不写具体用例，声明对所有输入都成立的不变量 · fast-check 4.8

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
属性测试（Property-based Testing）不再手写一个个具体用例，而是声明"对所有输入都成立的不变量"，让框架自动生成成百上千组输入去证伪。
今天用 JS/TS 生态的事实标准 fast-check 4.8 讲清楚它的范式、核心 API 和工程落地。
-->

---
transition: fade-out
---

# 属性测试是什么？

声明不变量，框架自动生成输入去证伪

<v-click>

- **思路**：不写具体的输入→输出，而是声明一条**对所有合法输入都成立的规律**
- **执行**：框架默认生成成百上千组随机输入，逐一尝试**证伪**这条规律
- **失败**：找到反例后**自动收缩（shrinking）**成最小可复现的那一个再报告

</v-click>

<v-click>

**形式化表述（fast-check 官方）**

> for any (x, y, ...) such that precondition holds, predicate(x, y, ...) is true
>
> 对任意满足前置条件的输入，谓词都为真

</v-click>

<v-click>

> 渊源：受 **QuickCheck（Haskell）** 与 **Hypothesis（Python）** 启发，fast-check 是 JS/TS 生态的事实标准实现

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 核心转变：从"我能想到的几个例子"变成"一条普适规律 + 机器搜索"。

[click] 这是属性测试的数学骨架——全称量词 + 前置条件 + 谓词。记住这句话，后面所有 API 都是它的实现。

[click] 它不是新发明：1999 年 Haskell 的 QuickCheck 是鼻祖，Python 的 Hypothesis 是另一支。fast-check 用 TypeScript 写成，是 JS 生态的事实标准。
-->

---
transition: fade-out
---

# 举例式 vs 属性式

两种测试的本质区别

<v-click>

```ts
// 举例式（example-based）：手写具体输入 + 期望输出
expect(add(1, 2)).toBe(3)
expect(add(0, 0)).toBe(0)
// 只覆盖你"想得到"的用例
```

</v-click>

<v-click>

```ts
// 属性式（property-based）：声明不变量，框架灌入大量输入
fc.assert(
  fc.property(fc.integer(), fc.integer(), (a, b) => add(a, b) === add(b, a)),
) // 交换律对所有整数都成立 → 跑 100 组随机输入
```

</v-click>

<v-click>

> 三大正面影响：①随时间测**更多**输入 ②测**更多样**的输入 ③**不必自己想反例**

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 举例式：A property is to property-based tests, what an example is to example-based tests。举例式手写每个 case，覆盖范围 = 你的想象力。

[click] 属性式：一条 add(a,b)===add(b,a) 就让框架去试 100 组随机整数，自动探索你想不到的边界。

[click] 官方总结的三个收益——更多、更杂、不用自己绞尽脑汁想 corner case。这正是它补足举例式的地方。
-->

---
transition: fade-out
---

# 什么是不变量 / property

独立于实现的规律，才是好属性

<v-click>

| 模式 | 不变量表述 | 例 |
| --- | --- | --- |
| 往返 round-trip | `decode(encode(x)) === x` | JSON、base64、URL 编码 |
| 排序 sort | 长度不变 + 升序 + 是原数组排列 | `sorted.length === arr.length` |
| 幂等 idempotent | `f(f(x)) === f(x)` | 去重、归一化 |
| 交换律 commutative | `f(a,b) === f(b,a)` | 加法、集合并 |
| 对拍 test oracle | `fast(x) === naive(x)` | 优化实现 vs 暴力实现 |

</v-click>

<v-click>

> `reverse(reverse(x)) === x` 是往返的标准范例；**对拍朴素实现**是最实用的落地姿势

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 不变量（invariant）= property = 对所有输入成立的规律。这张表是属性测试的"招式库"：往返、排序、幂等、交换律、对拍。遇到一个函数，先问它满足哪条。

[click] reverse 两次回原数组是往返的经典示范。而对拍——拿优化实现去比对一个慢但显然正确的朴素实现——是工程里命中率最高的姿势。
-->

---
transition: fade-out
---

# 属性测试 vs 模糊测试（fuzzing）

oracle + shrinking 是分水岭

<v-click>

| 维度 | 属性测试 | 经典 fuzzing |
| --- | --- | --- |
| 判定 | 针对明确的 **property/oracle** 判真假 | 通常只问"会不会崩/抛异常" |
| 反例 | **自动 shrinking 出最小**可复现反例 | 报告**第一个**触发的原始大输入 |
| 输入 | 同样自动生成大量、挖边界 | 同样自动生成大量、挖边界 |

</v-click>

<v-click>

- **共性**：都自动生成海量输入、都擅长挖 race condition / 原型污染等深坑
- **关键区别**：属性测试有 **oracle** + **shrinking**，fuzzing 常无 oracle、给一坨大输入

</v-click>

<v-click>

> fast-check 也能当"带 shrinking 的 fuzzer"：`{ numRuns: 1_000_000, endOnFailure: true }`

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 很多人把属性测试和 fuzzing 混为一谈。区别在两点：fuzzing 通常只看崩不崩（无 oracle），失败给你第一个触发的原始输入——往往又大又乱。属性测试针对一个明确的规律判真假，失败后自动收缩成最小反例。

[click] 共性是都生成海量输入、都能挖深坑（fast-check 官方宣称能挖 race condition、prototype poisoning 甚至 zero-day）。

[click] 而且 fast-check 把开关一拨就能当 fuzzer：跑一百万次、关掉收缩第一个失败就停。两者并非对立。
-->

---
transition: fade-out
---

# fc.assert(fc.property(...)) 结构

入口三件套：runner + property + predicate

<v-click>

```ts
import fc from "fast-check" // core 4.8.0
// 同步：谓词返回 boolean 或用 expect 抛错
fc.assert(
  fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) =>
    (a + b + c).includes(b),
  ),
)
```

</v-click>

<v-click>

```ts
// 异步：返回 Promise → 必须 asyncProperty + await（忘 await = 假绿）
await fc.assert(
  fc.asyncProperty(fc.nat(), async (n) => (await loadById(n)) !== undefined),
)
```

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三件套：fc.assert 是执行器，fc.property 把 arbitrary 和谓词组装成属性，谓词返回 boolean 或用 expect 抛错。这里测的是"任意三段字符串拼起来一定包含中间那段"。

[click] 异步版本：谓词返回 Promise 就必须换成 asyncProperty，而且 fc.assert 此刻返回 Promise，外面必须 await。

[click] 忘记 await 是高频翻车点——测试会立刻判绿，但属性其实没跑完。记住：异步 = asyncProperty + await。
-->

---
transition: fade-out
---

# Arbitraries 一览

生成器，官方内置 70+ 个

<v-click>

| 类别 | Arbitrary |
| --- | --- |
| 数值/布尔 | `integer({min,max})` · `nat()` · `float()` · `double()` · `bigInt()` · `boolean()` |
| 字符串 | `string({minLength,maxLength,unit})` |
| 常量/选择 | `constant(v)` · `constantFrom(a,b)` · `option(arb)` · `oneof(a,b)` |
| 容器 | `array(arb)` · `tuple(a,b)` · `uniqueArray(arb)` · `record({...})` |
| 集合 | `dictionary(k,v)` · `map(k,v)` · `set(...)` · `date()` · `json()` |

</v-click>

<v-click>

- `nat()` **含 0**、默认上界 **2147483647**（2³¹−1）
- `constantFrom(a,b,c)` 的**第一个参数 = shrinking 默认目标**

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] arbitrary 就是"输入生成器"。官方内置 70 多个，按数值、布尔、字符串、常量选择、容器、集合分类。组合这些就能描述几乎任意输入空间。

[click] 两个高频考点：nat 是非负整数，含 0，默认能取到 21 亿（2 的 31 次方减 1）。constantFrom 从给定值里随机选，但收缩时会往第一个参数靠——所以把"最简单的值"放第一位。
-->

---
transition: fade-out
---

# 两个易踩的 arbitrary 坑

double 的 NaN / 字符串 v4 迁移

<v-click>

**坑一：`fc.double()` 默认会产出 `NaN` 和 `±Infinity`**

```ts
fc.double()                                          // ⚠️ 可能给你 NaN / ±Inf
fc.double({ noNaN: true, noDefaultInfinity: true })  // ✅ 纯有限值
```

</v-click>

<v-click>

**坑二：v4 把字符串 arbitrary 统一收编进 `string({ unit })`**

```ts
// ❌ v4 旧 API：fullUnicodeString / asciiString / hexaString …
// ✅ v4 统一写法
fc.string({ unit: "binary", minLength: 1 })
// unit: 'grapheme-ascii'(默认) | 'grapheme' | 'binary' | 'binary-ascii' …
```

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] double 默认把 NaN 和正负无穷也算进取值空间——这非常符合"探索边界"的初衷，但常常意外打挂你的断言。要纯有限值必须显式 noNaN + noDefaultInfinity。

[click] v4 的破坏性变更：以前一堆 fullUnicodeString、asciiString、hexaString，现在全部合并进 string 的 unit 参数。看到旧代码引用这些就知道是 v3 写法，迁移时换成 unit。
-->

---
transition: fade-out
---

# 组合子：map / filter / chain

对 arbitrary 做变换

<v-click>

```ts
arb.map(fn)      // 把生成值映射成另一种 —— 构造合法输入"首选"
arb.filter(pred) // 只保留满足条件的值 —— 慎用，过滤太狠会大量丢弃
arb.chain(fn)    // 用上一个值动态决定下一个 arbitrary —— 依赖生成
```

</v-click>

<v-click>

```ts
// .chain 依赖生成：先生成长度，再生成定长数组
fc.nat({ max: 10 }).chain((len) =>
  fc.array(fc.integer(), { minLength: len, maxLength: len }),
)
```

</v-click>

<v-click>

```ts
fc.assert(
  fc.property(fc.integer(), fc.integer(), (a, b) => {
    fc.pre(b !== 0) // 谓词内前置条件：不满足则丢弃本次 run
    return Number.isInteger(Math.trunc(a / b))
  }),
)
```

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三个组合子：map 把生成值变形——构造合法输入首选它，因为不丢样本。filter 只保留满足条件的，但过滤太狠会大量丢弃、拖慢甚至报错。chain 用前一个值决定下一个 arbitrary。

[click] chain 的典型用途是依赖生成：先随机一个长度，再生成恰好那么长的数组。普通 map 做不到，因为后者的 arbitrary 依赖前者的值。

[click] fc.pre 写在谓词体内做前置条件——这里要求 b 非零才测除法。它对应形式化定义里的 precondition。丢弃太多会触发"过滤失败"告警。
-->

---
transition: fade-out
---

# ⭐ shrinking 自动收缩最小反例

属性测试相对 fuzzing 的核心卖点

<v-click>

谓词失败时，fast-check **不止报第一个失败输入**，而是系统性地把反例简化成"最小可复现"——更小的数、更短的数组、更简单的字符串——再报告。

</v-click>

<v-click>

```txt
Error: Property failed after 1 tests
{ seed: -1819918769, path: "0:...:3", endOnFailure: true }
Counterexample: [[2,1000000000]]
Shrunk 66 time(s)
Got error: AssertionError: expected 1000000000 to be less than or equal to 2
```

</v-click>

<v-click>

> 报告三件套：**`Counterexample`**（最小反例）+ **`Shrunk N time(s)`**（收缩步数）+ **`seed` / `path`**

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是属性测试最闪光的能力。随机生成往往撞出一个又大又乱的失败输入，但 fast-check 会自动往"更简单"的方向反复试，直到找到能触发同样错误的最小输入。

[click] 看这份真实报告：原始失败输入可能很复杂，收缩了 66 步后给你 [[2, 1000000000]] 这样干净的最小反例，调试一眼就懂。

[click] 记牢报告三件套字段名：Counterexample 是最小反例，Shrunk N time(s) 是收缩了几步，seed 和 path 用来复现——下一页讲。
-->

---
transition: fade-out
---

# seed / path 复现 + numRuns

flaky 复现的标准姿势

<v-click>

```ts
// 失败报告直接给出可粘贴的复现配置，原样填回 fc.assert 第二参
fc.assert(
  fc.property(fc.array(fc.integer()), (data) => { /* ... */ }),
  { seed: -1819918769, path: "0:...:3" }, // 精确重放到那个反例
)
```

- `seed`：随机种子，决定整轮生成序列
- `path`：生成树 + 收缩树里的定位路径，直达那个（已收缩的）反例

</v-click>

<v-click>

| 参数 | 默认 | 作用 |
| --- | --- | --- |
| `numRuns` | **100** | 每个属性跑多少组输入（CI 时间 vs 覆盖度主旋钮） |
| `endOnFailure` | `false` | 设 `true` **跳过 shrinking**，第一个失败即停 |
| `examples` | `[]` | 把回归/复现用例钉进属性，先跑它们 |

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] CI 偶发失败怎么复现？不用改谓词、不用设 numRuns=1。报告里给的 seed 和 path 原样填回 fc.assert 第二个参数，就能精确重放到那个（已收缩的）反例。seed 定整轮序列，path 在树里定位。

[click] run 参数：numRuns 默认 100，是 CI 时间与覆盖度的主旋钮——关键属性可调高到百万级当 fuzzer。endOnFailure 设 true 会跳过收缩、第一个失败就停（想要最小反例千万别开）。examples 把固定回归用例钉进去优先跑。
-->

---
transition: fade-out
---

# fast-check 是 runner-agnostic

裸用 fc.assert 即可，适配包只是语法糖

<v-click>

> 官方原文：fast-check can be used within **any test runner** without any specific integration needed. It works well with **Jest, Mocha, Vitest**, and others.

</v-click>

<v-click>

```ts
// 在 Jest / Vitest / Mocha / AVA / Bun / node:test 里都能直接这么写
import fc from "fast-check"

it("加法满足交换律", () => {
  fc.assert(fc.property(fc.integer(), fc.integer(), (a, b) => a + b === b + a))
})
```

</v-click>

<v-click>

- core 的 `fc.assert(fc.property(...))` **无需任何适配**就能跑在主流 runner 里
- 适配包（`@fast-check/vitest`、`@fast-check/jest`）只是**锦上添花的语法糖**

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 一个高频考点：fast-check 是 runner-agnostic 的。官方明说它在任何 test runner 里都能用，无需专门集成，Jest、Mocha、Vitest 都开箱即用。

[click] 实际写法就是在 it 里直接调 fc.assert——core 不绑定任何框架。

[click] 那适配包是干嘛的？纯属语法糖 + 报告/seed 打通。下一页看它能省多少样板。
-->

---
transition: fade-out
---

# @fast-check/vitest 的 test.prop

把 it(() => fc.assert(...)) 封装成一行

<v-click>

```ts
import { test, fc } from "@fast-check/vitest" // 0.4.1

// 数组形式：谓词参数按位置解构
test.prop([fc.string(), fc.string(), fc.string()])("detect substring", (a, b, c) => {
  return (a + b + c).includes(b)
})
```

</v-click>

<v-click>

```ts
// 命名记录形式：谓词收一个对象、按 key 解构（更可读）
test.prop({ a: fc.string(), b: fc.string() })("detect substring", ({ a, b }) => {
  return (a + b).includes(b)
})
```

</v-click>

<v-click>

- 支持 vitest 修饰链：`.skip` / `.only` / `.concurrent`；0.4.1 起支持 `test.each`
- `@fast-check/jest`（2.2.0）API 完全对称，独门好处 = **自动同步 Jest/fast-check 超时**

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] test.prop 数组形式：传一个 arbitrary 数组，谓词参数按位置一一对应解构。等价于内部帮你写 it(name, () => fc.assert(fc.property(...)))。

[click] 命名形式：传对象，谓词收一个对象按 key 解构，参数多时更可读。两种签名别记混——数组对应位置参，对象对应按 key。

[click] 它继承 vitest 的修饰链，skip、only、concurrent 都能用，0.4.1 还支持 test.each。Jest 版 API 一模一样，额外好处是自动对齐两边的 timeout，不用手动同步。
-->

---
transition: fade-out
---

# model-based testing

对有状态系统生成命令序列，model vs real 对拍

<v-click>

```ts
const allCommands = [
  fc.integer().map((v) => new PushCommand(v)), // 带参命令用 .map 注入
  fc.constant(new PopCommand()),               // 无参命令用 constant
  fc.constant(new SizeCommand()),
]
fc.assert(
  fc.property(fc.commands(allCommands), (cmds) => {
    const s = () => ({ model: { num: 0 }, real: new List() })
    fc.modelRun(s, cmds) // 顺序执行，run 内 expect 校验 real 与 model 一致
  }),
)
```

</v-click>

<v-click>

- 每个命令实现 `ICommand`：`check(model)` 前置条件 / `run(model, real)` 推进并校验 / `toString()` 序列化
- **shrinking 同样作用于命令序列** → 失败时收缩出"最短能复现 bug 的命令序列"

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 对有状态系统——栈、播放器、缓存、Pinia store——单纯生成输入不够，要生成"操作序列"。fc.commands 生成命令序列，fc.modelRun 顺序执行，同时推进一个简化 model 和真实 real，在 run 里用 expect 比对两者。带参命令用 map 注入参数，无参命令用 constant。

[click] 每个命令实现三方法：check 判断当前 model 是否允许这条命令（前置条件），run 同时操作 model 和 real 并校验一致，toString 让错误报告能打印出命令序列。杀手锏是——收缩也作用在序列上，失败时给你最短的能复现 bug 的命令序列。
-->

---
transition: fade-out
---

# 与 Zod 结合

测"校验器本身"：不误杀 + 不漏放

<v-click>

```ts
import { ZodFastCheck } from "zod-fast-check" // 社区库，版本独立于 core

// 由 Zod schema 生成"合法输入"的 arbitrary
const arb = ZodFastCheck().inputOf(MySchema)
fc.assert(
  fc.property(arb, (data) => {
    MySchema.parse(data) // 不抛 = 合法输入被正确接受（校验器不误杀）
  }),
)
```

</v-click>

<v-click>

- **生成合法输入** → 证明校验器"不误杀"；**生成非法输入** → 证明"不漏放"
- `@traversable/zod-test`：`seedToValidData()` / `seedToInvalidData()` 同时造合法与非法数据
- ⚠️ 这些是**社区库**，与 fast-check core、Zod 版本的兼容性需单独核实

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 项目里大量用 Zod 做校验，正好可以反过来测校验器本身。zod-fast-check 的 inputOf 把一个 Zod schema 转成"合法输入"的 arbitrary，灌进去 parse 不抛错就证明校验器不会误杀合法数据。

[click] 反过来生成非法数据，证明校验器不会漏放该拒的数据。@traversable/zod-test 一步到位同时造合法和非法。注意这俩都是社区库，版本独立于 fast-check core，和你的 Zod 版本兼容性要单独核实——尤其 Zod 4 之后。
-->

---
transition: fade-out
---

# 最佳实践

选真不变量 · 别重写实现 · map 优于 filter

<v-click>

**① 头号反模式：别在谓词里重写被测实现**

```ts
// ❌ 把被测函数逻辑照抄进谓词 = 自己跟自己对拍，毫无价值
fc.property(fc.integer(), (n) => double(n) === n * 2 /* 这就是 double 的实现 */)
// ✅ 选独立于实现的规律：往返、长度守恒、对拍朴素实现
fc.property(fc.integer(), (n) => double(n) % 2 === 0 && double(n) >= n)
```

</v-click>

<v-click>

**② 合法输入用 `.map` 构造，别 `.filter` 硬筛** —— filter 过度 → 丢弃过多 → 慢/告警

**③ `.noShrink()` 是反模式** —— 破坏最小反例，调试反而更难

**④ 与举例式互补**，非替代：属性测"规律层"，举例测"边界值/已知 bug 回归"

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 最重要的反模式：在谓词里把被测函数的实现逻辑照抄一遍。double(n)===n*2 看着对，但 n*2 就是 double 的实现，等于自己跟自己对拍，永远不会发现 bug。要选独立于实现的规律——结果是偶数、结果不小于输入。

[click] 另外三条：合法输入优先用 map 构造而不是 filter 硬筛，filter 过度会丢弃过多、拖慢甚至报"too many pre-condition failures"。noShrink 是反模式，会让你拿不到最小反例。最后，属性测试和举例式是互补不是替代——规律层交给属性，边界值和已知 bug 回归交给举例。
-->

---
transition: fade-out
---

# fast-check vs Faker.js

目的不同，不可互换

<v-click>

| 维度 | **fast-check** | **Faker.js** |
| --- | --- | --- |
| 目的 | 系统性探索任意/边界输入以**证伪不变量** | 造"看起来真实"的假数据 |
| 生成倾向 | 边界/极端/对抗（空串、0、NaN、超长） | 逼真、好看的样例 |
| 失败后 | **自动 shrinking 出最小反例** + seed 复现 | 无收缩、无反例概念 |
| 典型用途 | 单元/属性测试、找 bug | 填 demo / seed 数据库 / mock 列表 |

</v-click>

<v-click>

> 要"测正确性 / 挖边界"用 **fast-check**；要"填一份像样的展示数据"用 **Faker**

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 容易混的另一对：fast-check 和 Faker。fast-check 的目的是探索任意和边界输入去证伪不变量，所以它故意生成空串、0、NaN、超长这类对抗性数据，失败还能收缩+复现。Faker 的目的是造逼真好看的假数据——姓名、邮箱、地址，没有收缩、没有反例概念。

[click] 一句话区分：要测正确性、挖边界，用 fast-check；要填一份像样的展示数据或 seed 数据库，用 Faker。目的不同，不可互换。
-->

---
layout: intro
transition: fade-out
---

# 总结速查

范式 · 核心 API · 工程落地

- **范式**：声明对所有输入成立的**不变量**，框架生成海量输入证伪（受 QuickCheck / Hypothesis 启发）
- **结构**：`fc.assert(fc.property(...arbs, predicate))`；异步用 **`asyncProperty` + `await`**
- **⭐ shrinking**：失败自动收缩到**最小反例**（vs fuzzing 的核心区别）；复现靠 **`{ seed, path }`**
- **参数**：`numRuns` 默认 **100**；`endOnFailure: true` 跳过收缩
- **集成**：**runner-agnostic** 裸用 `fc.assert`；适配包 `test.prop` 是语法糖（vitest 0.4.1 / jest 2.2.0）
- **反模式**：别在谓词重写实现；合法输入用 **`.map`** 不用 `.filter`；`.noShrink()` 慎用
- **边界**：fast-check（探索/找 bug+shrink）≠ Faker（逼真假数据）

<div class="abs-br m-6 text-xl">
  <a href="https://fast-check.dev/" target="_blank" class="slidev-icon-btn">
    <carbon:function-math />
  </a>
  <a href="https://github.com/dubzzz/fast-check" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
七条核心记忆点：
1. 属性测试 = 声明不变量 + 机器生成输入证伪，源自 QuickCheck / Hypothesis
2. fc.assert(fc.property(...))，异步必须 asyncProperty + await
3. shrinking 自动收缩最小反例，是相对 fuzzing 的核心卖点；seed+path 复现
4. numRuns 默认 100，endOnFailure 跳过收缩
5. runner-agnostic 裸用 fc.assert，test.prop 只是语法糖
6. 别重写实现、map 优于 filter、noShrink 慎用
7. fast-check 找 bug ≠ Faker 造假数据
-->

---
layout: end
---
