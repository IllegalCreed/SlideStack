---
theme: seriph
background: https://cover.sli.dev
title: decimal.js — 任意精度十进制运算
info: |
  Presentation decimal.js — an arbitrary-precision Decimal type for JavaScript.

  Learn more at [https://mikemcl.github.io/decimal.js/](https://mikemcl.github.io/decimal.js/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🔢</span>
</div>

<br/>

## decimal.js — 任意精度十进制运算

解决浮点误差（`0.1 + 0.2 !== 0.3`）：任意精度的 Decimal 类型，规避金额 / 计费场景的累积错账。同作者三库之一，功能最全

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/MikeMcl/decimal.js" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 decimal.js,为 JavaScript 提供任意精度十进制数类型的库。它要解决的核心痛点只有一个:浮点误差。

原生 number 是 IEEE 754 双精度,0.1 加 0.2 不等于 0.3。在金额、计费、汇率这类场景,误差会逐步累积成肉眼可见的错账。decimal.js 用十进制表示数值,从根上消除这个问题。

它由 Michael Mclaughlin 编写,和 big.js、bignumber.js 同出一人。三库里 decimal.js 功能最全、体积也最大。

主线:为什么需要 → 构造与不可变 → 四则与比较 → precision 有效数字 → 舍入模式 → 输出格式化 → NaN/Infinity → 金额实战 → 三库对比 → clone 多策略 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么需要它

<v-clicks>

- `0.1 + 0.2 === 0.3` → **false**
- `0.1 + 0.2` → `0.30000000000000004`
- `(0.1).toFixed(20)` → `'0.100...00555'`
- 金额累积 → 肉眼可见的错账

</v-clicks>

<div v-click class="mt-6">

decimal.js 的回应:

- **任意精度十进制** → 无二进制尾巴
- **不可变 + 链式** → 纯函数式
- **完善舍入** → 9 种模式
- **NaN / Infinity** → 不抛错

</div>

<!--
为什么要专门引一个数值库?根源是 IEEE 754 双精度浮点。

0.1、0.2、0.3 这些十进制小数,在二进制下是无限循环的,只能近似存储。于是 0.1 加 0.2 得到 0.30000000000000004,严格等于判断就是 false。连原生 toFixed 也会暴露误差,0.1 保留 20 位会冒出 555 的尾巴。

在金额场景,这种误差一步步累积,最后就是错账。

decimal.js 的回应:用十进制表示,没有二进制尾巴;实例不可变,运算返回新值、支持链式;提供 9 种舍入模式;并且支持 NaN 和 Infinity,除以零返回 Infinity 而不是抛错。这四点是今天的主线。
-->

---

# 构造一个 Decimal

```js
import Decimal from 'decimal.js'

new Decimal(123.45)        // 由 number
new Decimal('123.45')      // 由字符串（推荐）
new Decimal('1.2e3')       // 指数记法 → 1200
new Decimal('0xff')        // 十六进制 → 255

new Decimal(0.1).plus(0.2).toString()   // '0.3'
new Decimal(0.1).plus(0.2).equals(0.3)  // true
```

<div v-click class="mt-3 text-sm">

> **优先用字符串**:从源头杜绝浮点误差。传 number 时字面量本身已有误差,高位数场景可能出意外。

</div>

<!--
构造函数接受 number、字符串、以及另一个 Decimal 实例。字符串还支持指数记法和进制前缀:0x 十六进制、0o 八进制、0b 二进制,所以 '0xff' 会被解析成 255。

注意一个最佳实践:优先用字符串构造。因为传 number 时,这个字面量本身已经是有误差的浮点数。对常见短小数,decimal.js 会按它的显示值解析,结果通常没问题;但对超过 15 到 17 位有效数字的值,可能出意外。用字符串能 100% 杜绝源头误差。

底下两行是核心价值:new Decimal(0.1).plus(0.2) 得到的就是 '0.3',和 0.3 严格相等返回 true。这正是引入这个库的理由。
-->

---

# 不可变 + 链式调用

```js
const a = new Decimal('1.5')
const b = a.plus(1)
a.toString()   // '1.5'（原值不变！）
b.toString()   // '2.5'

// 每步返回新实例 → 天然链式
new Decimal(2)
  .times('999.999999999999999')
  .dividedBy(4)
  .ceil()
  .toString()
```

<div v-click class="mt-2 text-sm">

> ⚠️ 别用 `+` / `===`:Decimal 是对象,运算符会退回浮点、比较引用。加减乘除用方法,判等用 `equals`。

</div>

<!--
decimal.js 的实例是不可变的。所有运算方法都返回一个新的 Decimal,绝不修改原对象。

看例子:a 是 1.5,调用 a.plus(1) 之后,a 还是 1.5,新值 2.5 在返回的 b 里。要拿到结果必须接收返回值。

不可变带来的直接好处是链式调用:因为每一步都返回新实例,可以在返回值上继续调下一个方法,像底下这样把 times、dividedBy、ceil 串起来,每一步都是纯函数式变换,互不干扰。

一个最常见的坑:千万别对 Decimal 用加号或三等号。它是对象,加号会经 valueOf 退回浮点,三等号比较的是引用而不是数值。加减乘除一律用 plus、minus、times、dividedBy,判等用 equals 或 comparedTo。
-->

---
layout: two-cols-header
---

# 四则与比较

::left::

**四则运算**

```js
a.plus(b)       // 加 (add)
a.minus(b)      // 减 (sub)
a.times(b)      // 乘 (mul)
a.dividedBy(b)  // 除 (div)
a.mod(b)        // 取余
a.pow(10)       // 幂
```

::right::

**比较**

```js
a.equals(b)      // 布尔 (eq)
a.comparedTo(b)  // -1/0/1/NaN
a.greaterThan(b) // (gt)
a.isZero()       // 判定
a.isNaN()
a.isInteger()
```

<div class="mt-2 text-sm">

> `dividedBy` 是**真除法**:`7 / 2 = 3.5`(不是整除)。整除用 `dividedToIntegerBy`。

</div>

<!--
四则运算在左边:plus 加、minus 减、times 乘、dividedBy 除,各有简短别名 add、sub、mul、div。另外 mod 取余、pow 求幂。

比较在右边:equals 判等返回布尔,comparedTo 返回 -1、0、1 或 NaN,greaterThan、lessThan 等返回布尔。还有一组判定方法:isZero、isNaN、isInteger、isNegative 等。

特别提醒:dividedBy 是真正的除法,7 除以 2 得 3.5,不是整数除法。如果要整除,用 dividedToIntegerBy,或者 div 之后再 floor。这是从其它整数大数库迁移过来时容易误会的点。
-->

---

# precision:有效数字,不是小数位

```js
Decimal.precision   // 默认 20（有效数字位数）

Decimal.set({ precision: 5 })
new Decimal(1).dividedBy(3).toString()     // '0.33333'
new Decimal(1000).dividedBy(3).toString()  // '333.33'
//                                            ↑ 5 位有效数字，仅 2 位小数！
```

<v-clicks>

- `precision` = **有效数字**总位数(官方:非小数位)
- decimal.js 把**所有计算**都舍入到该精度
- 小数位是 `toFixed(dp)` / `toDP(dp)` 的概念

</v-clicks>

<!--
这是 decimal.js 最容易被误解的设定,也是今天最该记住的一点。

precision 默认 20,它指的是有效数字位数,不是小数位数。而且 decimal.js 会把所有计算都舍入到这个精度。

看例子就懂了:把 precision 设成 5,1 除以 3 得 0.33333,五个 3,这符合直觉。但 1000 除以 3 呢?得到 333.33——整数部分 333 已经占掉 3 位有效数字,小数部分只能再放 2 位。如果你以为 precision 是小数位,会预期 333.33333,那就错了。

记住三句话:precision 是有效数字总位数;它约束所有运算;真正的小数位是 toFixed 和 toDecimalPlaces 的参数概念,两者不要混。
-->

---

# 舍入模式:9 种 ROUND_*

| 常量 | 值 | 行为 |
|---|---|---|
| `ROUND_UP` | 0 | 远离零 |
| `ROUND_DOWN` | 1 | 趋向零（截断） |
| `ROUND_CEIL` / `ROUND_FLOOR` | 2 / 3 | 趋向 +∞ / -∞ |
| `ROUND_HALF_UP` | 4 | 四舍五入（**默认**） |
| `ROUND_HALF_EVEN` | 6 | 平局取偶（**银行家**） |

```js
new Decimal('2.5').toDP(0, Decimal.ROUND_HALF_EVEN)  // 2
new Decimal('3.5').toDP(0, Decimal.ROUND_HALF_EVEN)  // 4
```

<!--
舍入模式是构造函数上的常量,一共 9 种,这里列了关键几个。

ROUND_UP 是 0,远离零,任何非零余数都进位;ROUND_DOWN 是 1,趋向零,直接截断;ROUND_CEIL 和 FLOOR 是 2 和 3,趋向正无穷和负无穷。

最重要的两个:ROUND_HALF_UP 值 4,就是普通四舍五入、平局远离零,这是默认舍入模式。ROUND_HALF_EVEN 值 6,平局取偶,也就是银行家舍入。

为什么金融偏好银行家舍入?普通四舍五入逢五就进,长期会系统性偏高;取偶能抵消这个偏差。看代码:2.5 取偶得 2,因为 2 是偶数;3.5 取偶得 4。而普通四舍五入这两个都会进到 3 和 4。

舍入模式可以全局 set,也可以作为 toFixed、toDP 等方法的最后一个参数临时指定,后者优先。
-->

---

# 输出与格式化

```js
const m = new Decimal('12345.6789')
m.toFixed(2)              // '12345.68'  定点字符串，补尾随零
m.toString()             // '12345.6789' 去尾随零
m.toNumber()             // 12345.6789  回原生 number
m.toDP(2).toString()     // '12345.68'  按小数位 → Decimal
m.toSD(3).toString()     // '12300'     按有效数字 → Decimal

new Decimal('1.20').toString()  // '1.2'   去尾随零
new Decimal('1.20').toFixed(2)  // '1.20'  补尾随零
```

<div v-click class="mt-2 text-sm">

> 金额展示用 `toFixed(2)`:`toString` 会去尾随零(`1.2` 而非 `1.20`)。

</div>

<!--
输出端有几个常用方法,按返回类型和位数语义区分。

toFixed(2) 返回定点字符串,按舍入模式处理,会补尾随零,而且总是普通记数法。toString 返回字符串,去尾随零。toNumber 回到原生 number,只在最终需要数字时用。

toDP 按小数位舍入、返回 Decimal,可以继续运算;toSD 按有效数字舍入、也返回 Decimal,比如 12345.6789 保留 3 位有效数字得 12300,维持了数量级。

底下两行是金额场景的关键坑:new Decimal('1.20') 的 toString 是 '1.2',因为内部去掉了尾随零;要展示固定两位小数,必须用 toFixed(2),得到 '1.20'。所以金额展示一律用 toFixed,不要用 toString。
-->

---

# NaN / Infinity:支持,不抛错

```js
new Decimal(1).dividedBy(0).toString()   // 'Infinity'
new Decimal(0).dividedBy(0).isNaN()      // true
new Decimal(NaN).isNaN()                 // true
new Decimal(Infinity).isFinite()         // false
```

<v-clicks>

- decimal.js **支持** NaN / Infinity(与 JS 数值语义一致)
- 用 `isNaN()` / `isFinite()` 判定,**别**用全局 `isNaN`
- 对比:**big.js 不支持**,除以零会**抛错**

</v-clicks>

<!--
decimal.js 支持 NaN 和 Infinity,语义和 JavaScript 一致,而且不抛异常。

1 除以 0 返回值为 Infinity 的 Decimal,toString 是 'Infinity';0 除以 0 是 NaN;new Decimal(NaN) 的 isNaN 返回 true;Infinity 的 isFinite 返回 false。

检测要用实例方法 isNaN、isFinite,不要用全局的 isNaN 函数,因为 Decimal 是对象,全局函数会先做转换、不可靠。

这里埋一个对比伏笔:big.js 不支持 NaN 和 Infinity,除以零会直接抛错。这是三库选型的重要差异点,等会儿专门讲。如果你需要让非法运算静默成 NaN/Infinity,选 decimal.js;如果你希望非法运算尽早暴露成异常,big.js 的严格反而是优点。
-->

---

# 金额实战:全程 Decimal

```js
const price = new Decimal('19.99')      // 单价
const qty = new Decimal(3)              // 数量
const discount = new Decimal('0.85')    // 折扣
const taxRate = new Decimal('0.06')     // 税率

const discounted = price.times(qty).times(discount)  // 50.9745
const total = discounted.plus(discounted.times(taxRate))

total.toFixed(2)   // '54.03'（最后一步才格式化）
```

<div v-click class="mt-2 text-sm">

> 黄金法则:**字符串构造 → 全程 Decimal → 末端 toFixed**。中途 `toNumber` 即前功尽弃。

</div>

<!--
把前面的点串成一个金额实战。

单价 19.99、数量 3、折扣 0.85、税率 0.06,全部用字符串构造。先算折后价:price 乘 qty 乘 discount,得 50.9745。再算含税总价:折后价加上折后价乘税率。最后 toFixed(2) 格式化成 '54.03'。

关键是黄金法则:字符串构造避免源头误差,全程用 Decimal 方法保持精度,只在最后一步用 toFixed 输出展示字符串。

最常见的反模式是中途 toNumber:只要任何一步把结果转回 number,就立刻退回 IEEE 754 浮点,前面所有努力作废。同样,中途用加号、乘号运算符也是退回浮点。记住:中途全是 Decimal,末端才转换。
-->

---

# 同作者三库:big.js / bignumber.js / decimal.js

| 维度 | big.js | bignumber.js | decimal.js |
|---|---|---|---|
| 体积 / API | 最小 | 居中 | 最全 |
| 精度语义 | 小数位 DP | 小数位 | **有效数字** |
| NaN / Infinity | 抛错 | 支持 | 支持 |
| 多进制 I/O | 不支持 | **支持** | 部分 |
| 三角 / 对数 / exp | 无 | 无 | **有** |
| 非整数幂 | 不支持 | 不支持 | 支持 |

<div v-click class="mt-2 text-sm">

> 官方:decimal.js「以有效数字而非小数位指定精度」「含三角函数、支持非整数幂,故最大」。

</div>

<!--
三库都出自 Michael Mclaughlin,实例都不可变,API 风格高度相似,但定位不同。

big.js 最小最精简,只有四则、比较、toFixed 这些;精度按小数位 DP 控制,而且只约束除法这类会产生无限小数的运算;不支持 NaN/Infinity,除零抛错;不支持多进制;没有三角和对数。

bignumber.js 居中,精度也按小数位,支持 NaN/Infinity,而且对多进制 I/O 支持最完整,可以任意 2 到 36 进制输入输出。

decimal.js 最全:精度按有效数字、约束所有运算;支持 NaN/Infinity;有三角、反三角、双曲、对数、exp,还支持非整数幂——这些是另两个都没有的,也正是它体积最大的原因。

官方 README 原话:decimal.js 以有效数字而非小数位指定精度,包含三角函数、支持非整数幂,所以比另两个都大。
-->

---

# 选型决策表

<v-clicks>

- 仅四则 + 两位小数金额、在意体积 → **big.js**
- 需要任意进制(2~36)I/O → **bignumber.js**
- 需要三角 / 对数 / exp / 非整数幂 → **decimal.js**
- 需要 NaN / Infinity 静默处理 → decimal.js / bignumber.js
- 想让非法运算尽早抛错 → **big.js**(严格是优点)

</v-clicks>

<div v-click class="mt-4 text-sm">

> 用 decimal.js 但不需要三角函数?试试官方 **decimal.js-light**(精简版,更小)。

</div>

<!--
把对比落成一张选型决策表。

如果你只做四则加两位小数金额、又在意打包体积,选 big.js,最精简够用,decimal.js 的全套数学是浪费。

如果需要任意进制的输入输出,选 bignumber.js,它对这块支持最完整。

如果需要三角、对数、exp 或者非整数幂,只能选 decimal.js,这是唯一提供这些函数的。

如果需要 NaN/Infinity 被静默处理,decimal.js 和 bignumber.js 都行;反过来,如果你希望非法运算尽早暴露成异常,big.js 除零就抛错,这种严格反而是优点。

最后补一句:如果你用 decimal.js 只是为了精度、用不到三角函数,可以试官方的 decimal.js-light,去掉三角函数的精简版,体积更小、API 基本一致。
-->

---

# Decimal.clone:多精度策略隔离

```js
// 金额:20 位 + 银行家舍入
const Money = Decimal.clone({
  precision: 20, rounding: Decimal.ROUND_HALF_EVEN,
})
// 科学计算:50 位
const Sci = Decimal.clone({ precision: 50 })

new Money('10').dividedBy(3).toFixed(2)
new Sci('1').dividedBy(7).toString()   // 50 位精度

Decimal.precision   // 全局仍是 20，未被污染
```

<div v-click class="mt-2 text-sm">

> 比「`set` 改完再改回」安全:后者在异常 / 嵌套 / 并发下易**泄漏状态**。

</div>

<!--
当一个项目里有多套精度策略时,不要反复改全局,用 Decimal.clone 派生配置独立的构造函数。

看例子:Money 用 clone 设成 20 位有效数字加银行家舍入,专门管金额;Sci 用 clone 设成 50 位,专门做科学计算。两个构造函数各管各的 precision 和 rounding,互不影响。用 Money 算的走金额规则,用 Sci 算的走 50 位精度。关键是全局的 Decimal.precision 仍然是 20,完全没被污染。

为什么不直接 Decimal.set 改完算完再改回去?因为手动改全局状态再恢复,在异常、嵌套调用、并发场景下很容易泄漏状态——比如算到一半抛异常,没恢复回去,后面的计算就用错精度了。clone 把配置隔离开,从根上避免这个问题,这是多精度策略的标准做法。
-->

---

# 链式精度累积:排错

```js
// ❌ 默认 precision=20，长链计算末位逐步累积舍入
// ✅ 用 clone 提高中间精度，末端再收敛
const Calc = Decimal.clone({ precision: 50 })

let principal = new Calc('100000')
const rate = new Calc('1.000123')
for (let i = 0; i < 365; i++) principal = principal.times(rate)

principal.toDecimalPlaces(2).toString()
```

<v-clicks>

- 现象:长链运算后第 20 位附近有出入
- 根因:`precision=20`,每步都舍入、逐步累积
- 正解:**调高 precision**(别退回原生 number)

</v-clicks>

<!--
最后讲一个进阶排错。

现象:一长串利息或汇率计算之后,结果在第 20 位附近和无限精度略有出入。

根因:默认 precision 是 20,decimal.js 把每一步运算、尤其是除法和 pow,都舍入到 20 位有效数字。在长链里,这种舍入会一步步累积,末位就有了偏差。

正解:在足够高的精度下计算,最后再收敛到展示精度。看代码,用 clone 派生一个 50 位精度的 Calc,循环 365 次做复利,最后 toDecimalPlaces(2) 收敛到两位小数。

要强调的反向操作:千万不要靠 toNumber 或者改回原生 number 来"解决"——那只会让精度更差。精度问题的正解永远是提高 precision,而不是退回浮点。
-->

---
layout: intro
---

# 总结

decimal.js = **任意精度十进制,功能最全**

- 解决浮点误差:`0.1+0.2` 精确得 `0.3`
- `precision` 是**有效数字**(默认 20),非小数位
- 不可变 + 链式;别用 `+` / `===`,用方法
- 9 种舍入;金融用 `ROUND_HALF_EVEN`(银行家)
- 金额:字符串构造 → 全程 Decimal → 末端 `toFixed`
- 三库:big.js 最简 / bignumber.js 多进制 / decimal.js 最全
- 多策略用 `Decimal.clone`,精度不够调 `precision`

<!--
总结一下。

decimal.js 的本质,是为 JavaScript 提供任意精度的十进制类型,三库里功能最全。

核心要点:它解决浮点误差,0.1 加 0.2 精确得 0.3;最该记住的是 precision 是有效数字位数、默认 20,不是小数位;实例不可变、支持链式,别用加号和三等号,加减乘除和判等都用方法;有 9 种舍入模式,金融场景用 ROUND_HALF_EVEN 银行家舍入。

金额的黄金法则:字符串构造、全程 Decimal、末端 toFixed,中途绝不 toNumber。

选型上,big.js 最精简适合基础金额,bignumber.js 适合多进制,decimal.js 适合需要三角对数和非整数幂的场景。

工程上,多套精度策略用 Decimal.clone 隔离,链式精度不够就调高 precision,而不是退回原生。谢谢大家。
-->
