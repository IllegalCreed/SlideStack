---
theme: seriph
background: https://cover.sli.dev
title: Day.js
info: |
  Presentation Day.js — the 2KB immutable date-time library.

  Learn more at [https://day.js.org](https://day.js.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-7xl">🕐</span>
</div>

<br/>

## Day.js

2KB 不可变日期库 · Moment 风格 API · 按需插件

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/iamkun/dayjs" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Day.js：一个 2KB、不可变、与 Moment.js API 基本兼容的轻量日期时间库。它由 iamkun 维护，官方定位是 Moment 的替代品，主打更小、更安全。

主线：为什么用它 → 安装与解析 → 格式化 → 增减取整 → 取值设值 → 查询差值 → 不可变原理 → 插件机制 → UTC 与时区 → 本地化 → Moment 迁移 → 核心 vs 插件 → 体积优化 → 总结。

贯穿全场的一条主线是：核心极小，能力靠插件按需挂载。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 Day.js

<v-clicks>

- Moment.js 体积大，拖慢下载与解析
- Moment 对象**可变**，就地修改埋隐蔽 bug
- 老项目要从 Moment 平滑迁移
- 想要「极小核心 + 按需扩展」

</v-clicks>

<div v-click class="mt-6">

Day.js 的回应：

- 核心仅 **~2KB** → 轻
- 操作返回**新实例** → 不可变、安全
- **Moment 兼容 API** → 迁移成本低
- **插件机制** → 用到才加载

</div>

<!--
为什么专门换一个日期库？四个痛点。第一，Moment 体积大，下载和解析都慢。第二，Moment 对象是可变的，add 会就地改原对象，容易埋下别处偷偷改了我的日期这类隐蔽 bug。第三，很多老项目想从 Moment 平滑迁移，又不想重写。第四，希望核心极小、能力按需扩展。

Day.js 针对性回应：核心只有约 2KB，很轻；所有修改型操作返回新实例，不可变因而安全；API 与 Moment 高度兼容，迁移成本低；能力拆成插件，用到才加载。这四点就是今天的主线。
-->

---

# 安装与解析

```js
npm install dayjs
import dayjs from 'dayjs'   // 默认导出；CJS: require('dayjs')
```

<v-clicks>

```js
dayjs()                    // 现在（本地时区）
dayjs('2024-01-15T10:30')  // ISO 8601 字符串（核心可靠）
dayjs(new Date())          // 原生 Date
dayjs(1705276800000)       // Unix 毫秒时间戳
dayjs.unix(1705276800)     // Unix 秒时间戳（× 1000）
```

</v-clicks>

<div v-click class="mt-2 text-sm">

> ⚠️ 秒戳必须用 `dayjs.unix(秒)`；直接传数字按**毫秒**解析，差 1000 倍。

</div>

<!--
安装就是 npm install dayjs，导入用默认导出 import dayjs from dayjs，CommonJS 用 require。

解析支持多种输入：无参 dayjs 取现在；传 ISO 8601 字符串，这是核心可靠支持的格式；传原生 Date 对象；传数字按 Unix 毫秒时间戳解析，等价于 new Date(ms)；秒级时间戳要用 dayjs.unix，它内部会乘以 1000。

这里有个高频坑：手上是秒级时间戳，必须用 dayjs.unix，如果直接 dayjs 传数字会被当成毫秒，时间差 1000 倍，落到 1970 年附近。非 ISO 格式字符串核心不可靠，后面讲 customParseFormat 插件。
-->

---

# 格式化：format

```js
dayjs().format()                         // ISO 8601: 2024-01-15T10:30:00+08:00
dayjs('2024-01-15').format('YYYY-MM-DD') // '2024-01-15'
dayjs().format('YYYY年MM月DD日 HH:mm:ss')
dayjs().format('[Year] YYYY')            // 方括号转义 → 'Year 2024'
```

| token | 含义 | token | 含义 |
|---|---|---|---|
| `YYYY`/`YY` | 四位/两位年 | `HH`/`H` | 24 时制 |
| `MM`/`M` | 月（零基显示为 1-12） | `hh`/`h` | 12 时制（配 A/a） |
| `DD`/`D` | 日 | `mm`/`ss` | 分/秒 |

<!--
格式化用 format。不传模板时默认输出 ISO 8601 字符串，带本地时区偏移。传模板就按 token 替换，比如 YYYY-MM-DD。token 体系和 Moment 完全一致。

想在模板里夹字面文本，用方括号转义，方括号内原样输出。

下面这张表是最常用的 token：YYYY 四位年、YY 两位年；MM 补零月、M 不补零月；DD 补零日；HH 是 24 小时制，hh 是 12 小时制需要配 A 或 a 区分上下午；mm 分、ss 秒。注意 HH 和 hh 别搞混，这是格式化最常见的错误来源。

本地化长日期 L、LL、LLL 需要 localizedFormat 插件，进阶 token Q、Do、X、x 需要 advancedFormat 插件。
-->

---

# 增减与取整（不可变）

```js
const d = dayjs('2024-01-15')
d.add(1, 'day')        // 新实例 2024-01-16；d 不变
d.subtract(2, 'month') // 新实例 2023-11-15
d.startOf('month')     // 当月 1 号 00:00:00.000
d.endOf('day')         // 当天 23:59:59.999
```

<v-clicks>

```js
// 链式：每步返回新实例，安全
dayjs('2019-01-25').add(1, 'day').subtract(1, 'year')
  .year(2009).format('YYYY-MM-DD')  // '2009-01-26'
```

- 单位：`year/y month/M week/w day/d hour/h minute/m second/s`

</v-clicks>

<!--
增减和取整。add 加、subtract 减，startOf 取单位起点比如当月 1 号零点，endOf 取单位终点比如当天的最后一刻 23 点 59 分 59 秒 999 毫秒。

关键是：这些都是不可变操作，返回新实例，原对象 d 不变。

正因为每步返回新实例，链式调用才安全。这个例子加一天、减一年、把年设成 2009、再格式化，结果是 2009-01-26，中间每一步都是独立的新对象。

支持的单位有 year、month、week、day、hour、minute、second、millisecond，都有简写。
-->

---

# 取值 / 设值

```js
dayjs('2024-01-15').year()   // 2024
dayjs('2024-01-15').month()  // 0  ← 月份从 0 开始！
dayjs('2024-01-15').date()   // 15 ← 月中第几天
dayjs('2024-01-15').day()    // 1  ← 星期几（0=周日）
dayjs().hour(9).minute(30)   // 设值，返回新实例
dayjs().set('hour', 9)       // 通用设值器 = .hour(9)
```

<div v-click class="mt-4">

::: warning 两个高频坑
① `month()` **零基**：一月返回 0。
② `day()` 是**星期几**（0=周日），别和 `date()`（月中第几天）混淆。
:::

</div>

<!--
取值和设值。year 取年，month 取月——注意月份从 0 开始，一月返回 0，这和原生 Date 一致；date 取月中第几天 1 到 31；day 取星期几，0 是周日、6 是周六。

设值有两种：专用设值器如 hour 9、minute 30，和通用设值器 set 传单位和值，两者等价，且都返回新实例。

这里有两个高频坑必须记牢：第一，month 是零基的，一月是 0 不是 1；第二，day 是星期几不是月中第几天，而且 0 表示周日。把 day 和 date 搞混是新手最常犯的错误。
-->

---

# 查询与差值

```js
const a = dayjs('2024-01-15'), b = dayjs('2024-06-01')
a.isBefore(b)        // true（核心内置）
a.isAfter(b)         // false
a.isSame(b, 'year')  // true ← 第二参指定比较粒度
a.isValid()          // 解析失败返回 false
```

<v-clicks>

```js
b.diff(a)                // 默认毫秒差
b.diff(a, 'day')         // 相差天数（整数截断）
b.diff(a, 'month', true) // 第三参 true → 浮点月数
```

> `isBefore/isAfter/isSame` 是核心；`isBetween` 等需插件。

</v-clicks>

<!--
查询和差值。isBefore、isAfter、isSame 是核心内置的比较方法，返回布尔。isSame 可以传第二个参数指定比较粒度，比如传 year，只要同年就视为相同。isValid 用来校验解析结果，处理外部输入时务必先校验。

diff 算差值，不传单位默认返回毫秒差；传单位比如 day 返回相差天数，是整数截断；想要带小数的精确值，传第三个参数 true，比如 diff month true 返回浮点月数。

注意：只有 isBefore、isAfter、isSame、isValid 是核心；isBetween、isSameOrBefore、isToday 这些都需要插件，下一节讲。
-->

---
layout: two-cols-header
---

# 不可变：Day.js 的地基

::left::

**Moment（可变）**

```js
const m = moment()
m.add(1, 'day')  // 就地改 m
use(m)           // m 已是明天
```

::right::

**Day.js（不可变）**

```js
const d = dayjs()
d.add(1, 'day')  // 返回新实例
use(d)           // d 没变！
// 须重新赋值：
let x = dayjs()
x = x.add(1, 'day')
```

<div class="mt-2 text-sm">

> 官方：所有改变对象的操作都**返回新实例**。链式因此安全。

</div>

<!--
不可变是 Day.js 的地基，也是它和 Moment 最重要的区别。

左边 Moment 是可变的：add 会就地修改 m 本身，调用后 m 已经变成明天。很多老代码依赖这种副作用。

右边 Day.js 是不可变的：add 返回一个新实例，原来的 d 完全没变。所以从 Moment 迁移时，照搬 d.add(1, day) 期望 d 被改会失效，必须改成重新赋值 x 等于 x.add。

官方原文：所有会改变对象的操作都返回新实例。好处是链式调用安全、每步独立，杜绝函数内部偷偷改日期的隐蔽 bug。
-->

---

# 插件机制：核心精简，按需挂载

```js
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)     // 挂载后才有方法
dayjs('1999-01-01').fromNow()  // 'x years ago'
```

<v-clicks>

- 核心**不含任何插件**，能力靠 `dayjs.extend(plugin)`
- ⚠️ 只 `import` 不 `extend`**不生效**
- 没用到的插件**不进产物** → 体积接近 ~2KB
- 方法名是 `extend`，不是 `use`

</v-clicks>

<!--
插件机制是 Day.js 控制体积的核心。核心只带核心代码，不含任何插件。要用额外能力，先 import 插件，再 dayjs.extend 挂载，之后才有对应方法。

这里有个最常见的坑：只 import 不 extend 是不生效的。import 只引入模块，必须再 extend 才把方法挂到原型或工厂上。忘了 extend 就会遇到方法不是函数的报错。

好处是：没用到的插件不会被打进产物，配合 Tree Shaking，最终体积接近核心的 2KB。注意方法名是 extend 不是 use，use 是 Vue 的 API。
-->

---

# UTC 与时区（都是插件）

```js
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)        // timezone 依赖 utc
dayjs.extend(timezone)

dayjs.utc()                              // UTC 模式
dayjs().tz('America/New_York')           // 换算到纽约
dayjs.tz('2024-01-15 10:00', 'Asia/Shanghai') // 按该时区解析
dayjs.tz.guess()                         // 推测当前时区
```

<div v-click class="mt-2 text-sm">

> Timezone **不打包时区数据**，靠宿主 `Intl.DateTimeFormat`；缺完整 ICU 的环境可能失灵。

</div>

<!--
UTC 和时区能力都不是核心，是插件，而且 Timezone 依赖 UTC，两个都要 extend，顺序上先 utc 再 timezone。

UTC 插件提供 dayjs.utc 进入 UTC 模式、点 utc 转 UTC 显示、点 local 转回本地。Timezone 插件处理 IANA 时区：点 tz 把已有时刻换算到目标时区，dayjs.tz 按指定时区解析字符串，tz.guess 推测当前环境时区。

最关键的一点：Timezone 不打包时区数据库，底层用宿主的 Intl.DateTimeFormat 来算。所以在缺完整 ICU 的老 Node、受限 WebView 里时区可能失灵。这和 Luxon 是同一思路。
-->

---

# tz 解析 vs 换算

```js
// A：按目标时区「解释」字符串
dayjs.tz('2024-01-15 10:00', 'Asia/Shanghai')
//   → 这串就是上海时间

// B：先按本地/默认时区解析，再换算显示
dayjs('2024-01-15 10:00').tz('Asia/Shanghai')
//   → 绝对时刻可能与 A 不同！
```

<v-clicks>

- `dayjs.tz(str, zone)`：**解析时区**
- `dayjs(str).tz(zone)`：**换算显示**
- 保持墙上时间改时区：`.tz(zone, true)`（keepLocalTime）

</v-clicks>

<!--
这一页专门辨析时区里最容易踩的坑：dayjs.tz 和点 tz 不是一回事。

A 写法 dayjs.tz 传字符串和时区，是把这串时间按目标时区解释，意思是这串本来就是上海时间。

B 写法先 dayjs 解析字符串，这时按本地或默认时区解析，再点 tz 换算显示为上海时区。两者代表的绝对时刻可能不同。

总结：dayjs.tz 是解析时区，点 tz 是换算显示。如果想保持墙上时间不变地改时区，用点 tz 第二个参数传 true，也就是 keepLocalTime。这个区别在跨时区业务里极其重要。
-->

---

# 本地化：locale

```js
import 'dayjs/locale/zh-cn'  // 先导入语言文件！

dayjs.locale('zh-cn')        // 全局切换
dayjs().locale('zh-cn')      // 仅此实例（不动全局）
  .format('YYYY年MM月DD日 dddd')
```

<v-clicks>

- 默认**只内置英文** `en`，其它语言须先 `import`
- 只 `locale()` 不 `import`**无效**
- Day.js **不会**自动探测浏览器语言
- 内置 140+ locale，按需引一个即可

</v-clicks>

<!--
本地化用 locale。Day.js 默认只内置英文，其它语言必须先 import 对应的 locale 文件，比如 import dayjs/locale/zh-cn。

切换有两种：dayjs.locale 全局切换，影响之后所有实例；在实例上点 locale 只影响这一个实例，不动全局，这是不可变带来的好处，局部覆盖不污染全局。

两个要点：第一，只调 locale 不 import 是无效的，因为没有语言数据；第二，Day.js 不会自动探测浏览器语言，需要你显式设置。内置 140 多个 locale，按需引一个就行，别全引。
-->

---

# 从 Moment 迁移

| 维度 | Moment | Day.js |
|---|---|---|
| 可变性 | 可变（就地改） | **不可变**（返回新实例） |
| 体积 | 大 | ~2KB + 按需插件 |
| API/token | `YYYY-MM-DD` | **基本一致** |
| 月份 | 零基 | 零基（一致） |
| 时区 | moment-timezone | Timezone 插件（靠 Intl） |

<div v-click class="mt-3 text-sm">

> 头号陷阱：`d.add(1,'day')` 在 Day.js 不改 `d`，必须 `d = d.add(...)`。

</div>

<!--
从 Moment 迁移，这张表是重点。可变性：Moment 可变、Day.js 不可变，这是最大区别。体积：Moment 大，Day.js 核心 2KB 加按需插件。API 和 token：基本一致，方法名和格式串大多能照搬。月份：两者都是零基，这点一致。时区：Moment 用 moment-timezone 打包数据，Day.js 用 Timezone 插件靠 Intl。

头号陷阱再强调一遍：Moment 的 d.add(1, day) 会就地改 d，Day.js 不会，必须写成 d 等于 d.add。依赖就地修改副作用的老代码，迁移时一定要逐一改成重新赋值，否则会得到错误结果。
-->

---
layout: two-cols-header
---

# 核心 vs 插件

::left::

**核心（开箱即用）**

```text
format add subtract diff
startOf endOf set get
isBefore isAfter isSame
valueOf unix toDate
toISOString isValid clone
```

::right::

**插件（需 extend）**

```text
fromNow      relativeTime
utc / tz     utc/timezone
isBetween    isBetween
isLeapYear   isLeapYear
quarter week quarterOfYear...
duration     duration
非 ISO 解析  customParseFormat
```

<!--
核心和插件的归类，这张对照表务必记牢，能避开绝大多数报错。

左边是核心，开箱即用：format 格式化、add subtract 增减、diff 差值、startOf endOf 取整、set get 取设值、isBefore isAfter isSame 比较、valueOf unix toDate 转换、toISOString、isValid 校验、clone 克隆。

右边是插件，必须 extend：fromNow 来自 relativeTime；utc 和 tz 来自 utc 和 timezone；isBetween；isLeapYear 闰年；quarter 季度、week 周；duration 时长；以及非 ISO 字符串解析来自 customParseFormat。

判断方法很简单：遇到不是函数的报错，八成是某个插件忘了 extend。
-->

---

# 体积优化清单

<v-clicks>

- 只 `import` **用到的插件** → 未引用不进产物
- 只 `import` **需要的 locale** → 别把 140+ 全引
- **入口集中 extend** → 一处挂载，依赖按序
- 善用 **Tree Shaking** → 打包器自动剔除
- 仅格式化就别引 relativeTime / timezone

</v-clicks>

<div v-click class="mt-4 text-sm">

```js
// 依赖顺序：被依赖者先 extend
dayjs.extend(utc); dayjs.extend(timezone)
```

</div>

<!--
体积优化清单。第一，只 import 用到的插件，没引用的不会进产物。第二，只 import 需要的 locale，140 多个别全引，否则体积暴涨。第三，在应用入口集中 extend，一处挂载，而且有依赖关系的插件要按顺序，被依赖者先 extend。第四，善用 Tree Shaking，现代打包器会自动剔除未引用代码。第五，如果只用到格式化，就别引 relativeTime、timezone 这些重插件。

底下这行展示依赖顺序：timezone 依赖 utc，所以先 extend utc 再 extend timezone。extend 是幂等的，重复调用安全，但依赖顺序不能错。
-->

---
layout: intro
---

# 总结

Day.js = **2KB 不可变 · Moment 兼容 · 按需插件**

- 轻：核心 ~2KB，按需引入 + Tree Shaking
- 不可变：操作返回新实例，链式安全
- API：Moment 风格，迁移成本低
- 插件：UTC / 时区 / 相对时间 / 解析…用到才 extend
- 时区：靠宿主 Intl，不打包数据
- 边界：**核心 ≠ 全部**，能力多在插件里

<!--
总结一下。Day.js 的本质是 2KB、不可变、Moment 兼容、按需插件的轻量日期库。

技术要点：轻，核心约 2KB，靠按需引入加 Tree Shaking；不可变，所有操作返回新实例，链式安全；API 是 Moment 风格，从 Moment 迁移成本低；能力靠插件，UTC、时区、相对时间、自定义解析等用到才 extend；时区靠宿主的 Intl 而不打包数据。

最后强调今天贯穿的边界：核心不等于全部。Day.js 把绝大多数能力放进了可选插件，记住核心 vs 插件那张表，遇到不是函数的报错先想想是不是忘了 extend。把这条记牢，就能用好这个 2KB 的小而美。谢谢大家。
-->
