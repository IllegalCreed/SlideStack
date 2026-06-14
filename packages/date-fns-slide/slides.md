---
theme: seriph
background: https://cover.sli.dev
title: date-fns
info: |
  Presentation about date-fns — the functional, immutable, tree-shakable JavaScript date library.

  Learn more at [https://date-fns.org](https://date-fns.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📅</span>
</div>

<br/>

## date-fns

函数式、纯函数、不可变、可 tree-shaking 的现代 JS 日期库：200+ 个独立函数，直接操作原生 Date

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/date-fns/date-fns" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 date-fns，一个现代 JavaScript 日期工具库。它的定位和 Moment 完全不同：不是一个有状态、可链式的大对象，而是 200 多个互相独立的纯函数，直接操作原生 Date。

四个关键词记牢：函数式、纯函数、不可变、可 tree-shaking。版本基线是 v4，v4 起内置了一等时区支持。

主线：为什么用它 → 纯函数与不可变 → 格式化与 token 坑 → 解析 → 增减差值比较 → 区间与时长 → tree-shaking → v3/v4 演进 → 时区 → 选型对比 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 date-fns

<v-clicks>

- Moment 是单体可变对象，难以 tree-shaking
- 包体随功能增长，移动端敏感
- 可变对象易被「别处偷偷改掉」
- 想直接用原生 Date，不要包装类

</v-clicks>

<div v-click class="mt-6">

date-fns 的回应：

- 独立小函数 + ESM → **按需打包**
- 纯函数返回新值 → **不可变**
- 直接操作原生 `Date` → **零摩擦**
- 200+ 函数 → **覆盖面广**

</div>

<!--
为什么要选 date-fns？几个痛点。Moment 是一个大而全的单体对象，设计上难以 tree-shaking，整库打进产物，移动端体积敏感。它还是可变的，一个 moment 实例被多处引用时，别处一改你这边就变，是隐蔽 bug 的来源。

date-fns 针对性回应：200 多个独立具名导出的小函数加 ESM，用几个就只打几个；每个函数是纯函数、返回新值，绝不改入参；直接操作原生 Date，不引入包装类，和原生 API、第三方库都零摩擦。这就是今天的主线。
-->

---

# 纯函数 / 不可变

```ts
import { addDays, setHours } from "date-fns"

const d = new Date(2024, 0, 1, 9, 0)   // 月份 0-based！
const d2 = addDays(d, 5)               // 新 Date：2024-01-06
const d3 = setHours(d, 14)             // 又一个新 Date
// d 始终是 2024-01-01 09:00，从未被改动
```

<v-clicks>

- 每个函数「输入旧值 → 返回新值」，无副作用
- 对比 Moment：`moment().add(1,'day')` **原地改**实例
- ⚠️ `date.setHours(14)` 是原生方法（原地改）≠ date-fns 的 `setHours(date,14)`

</v-clicks>

<!--
先讲最核心的心智：纯函数和不可变。看代码，addDays、setHours 都返回一个全新的 Date，原来的 d 从头到尾没被改动。这就是不可变：同样的输入永远得到同样的输出，没有副作用。

对比 Moment，moment().add(1, 'day') 会原地修改那个实例，多处引用就互相干扰。date-fns 没有这个问题，它根本不持有可变状态，和 React、Vue 的不可变数据流天然契合。

一个高频坑：原生 Date 上的 date.setHours(14) 是会原地修改的方法，返回时间戳；而 date-fns 的 setHours(date, 14) 是纯函数，返回新 Date。同名但语义相反，别混。还有，new Date 第二个参数月份是 0-based，1 是二月。
-->

---

# 格式化：format

```ts
import { format } from "date-fns"
format(new Date(2024, 1, 11, 14, 30), "yyyy-MM-dd HH:mm")
//=> '2024-02-11 14:30'
```

| 含义 | token |
|---|---|
| 四位日历年 | `yyyy` |
| 两位月 / 月内日 | `MM` / `dd` |
| 时(24) / 分 | `HH` / `mm` |
| 月名 / 星期（按 locale） | `MMMM` / `EEEE` |

<!--
格式化用 format，第一个参数是 Date，第二个是模板字符串。token 遵循 Unicode 技术标准 35。

表格里是最常用的：四位年小写 yyyy，月 MM，月内日 dd，24 小时制 HH，分 mm。月名和星期是 MMMM、EEEE，会按 locale 本地化。

注意 new Date(2024, 1, 11) 因为月份 0-based，是二月 11 号。下一页讲一个从 Moment 迁移过来必踩的坑。
-->

---

# token 坑：别照搬 Moment

<div class="grid grid-cols-2 gap-4">

<div>

**❌ Moment 习惯**

```ts
format(d, "YYYY-MM-DD")
// YYYY = 周编号年
// DD   = 一年第几天
// 默认还会告警/抛错
```

</div>

<div>

**✅ date-fns 正确**

```ts
format(d, "yyyy-MM-dd")
//=> '2024-02-11'
```

</div>

</div>

<v-clicks>

- 小写 `yyyy` = 日历年；大写 `YYYY` = **周编号年**
- 小写 `dd` = 月内日；大写 `DD` = **年内日**
- `YYYY`/`DD` 是「受保护 token」，要用须开 `useAdditional*` 选项

</v-clicks>

<!--
这是从 Moment 迁移最容易踩的坑。Moment 用户习惯写大写的 YYYY-MM-DD，照搬到 date-fns 上，YYYY 其实是「本地周编号年」，DD 是「一年中的第几天」，多数时候看着正常，年末跨周时就出错。

date-fns 正确写法是全小写 yyyy-MM-dd。为什么这样设计？因为周编号年和年内日是 ISO 8601 真实存在的概念，只是和日历年、月内日太容易混。date-fns 默认把 YYYY 和 DD 列为「受保护 token」，不开 useAdditionalWeekYearTokens 或 useAdditionalDayOfYearTokens 就直接告警或抛错，逼你确认意图。

还有，格式串里的字面量文字用单引号转义，不是 Moment 的方括号。
-->

---

# 解析：parseISO 与 parse

```ts
import { parseISO, parse } from "date-fns"

// ISO 8601 字符串 → parseISO（比 new Date 更可控）
parseISO("2024-02-11T11:30:30")

// 自定义格式 → parse(字符串, 格式串, 参考日期)
parse("11.02.2024", "dd.MM.yyyy", new Date())
//=> 2024-02-11
```

<v-clicks>

- `parse` 的第三参数 `referenceDate` **必须传**：填补缺失字段
- 不确定传什么 → 传 `new Date()`
- v3 起：大多数函数也**直接接受字符串**日期

</v-clicks>

<!--
解析分两种。拿到 ISO 8601 字符串，用 parseISO，它专门处理 ISO 格式，对「仅日期」字符串的时区处理比 new Date 更可控。

要按自定义格式解析，用 parse，三个参数：字符串、格式串、参考日期。重点是第三个参数 referenceDate 必须传，它为被解析串里缺失的字段提供默认值，比如只给了「1月1日」没给年份，年份就从 referenceDate 取。不确定传什么就传 new Date()，在当前日期上下文解析。

补充：v3 起，大多数接受日期参数的函数也直接接受字符串，会自动规范化，从 API 拿到的 ISO 字符串可以少一步手动解析。
-->

---

# 增减 / 差值 / 比较

```ts
import { addDays, subDays, differenceInDays,
         isBefore, isSameDay } from "date-fns"

addDays(d, 7)            // 加 7 天（新 Date）
subDays(d, 3)            // 减 3 天
differenceInDays(a, b)   // 相差整天数（数字）
isBefore(a, b)           // a 早于 b？
isSameDay(a, b)          // 同一天（忽略时分秒）
```

<v-clicks>

- 增减：`addX` / `subX`（Days/Months/Years/Hours…），返回新 Date
- 差值：`differenceInX` 返回数字；`differenceInCalendarDays` 数日历日界限
- 比较：`isBefore`/`isAfter`/`isEqual`/`compareAsc`；`isSameDay` ≠ `isEqual`

</v-clicks>

<!--
三组高频函数。

增减用 addX、subX，比如 addDays、addMonths、subDays、addHours，全部返回新 Date。subDays(d,3) 等价 addDays(d,-3)，但语义更直接。

差值用 differenceInX，返回数字。这里有个细节：differenceInDays 数的是完整 24 小时段，differenceInCalendarDays 数的是跨了几个日历日界限、忽略时分秒，两者在跨午夜但不足 24 小时时结果不同。

比较用 isBefore、isAfter、isEqual，排序用 compareAsc。注意 isSameDay 只看是不是同一天、忽略时分秒，而 isEqual 要求时间值精确相等到毫秒，别搞混。
-->

---

# 区间 Interval 与时长 Duration

```ts
import { isWithinInterval, eachDayOfInterval,
         intervalToDuration, formatDuration } from "date-fns"

const itv = { start: new Date(2024,0,1), end: new Date(2024,0,7) }
isWithinInterval(new Date(2024,0,3), itv)   // true（默认含端点）
eachDayOfInterval(itv)                       // [1/1 … 1/7] 的 Date 数组

formatDuration(intervalToDuration(itv))      // '6 days'
```

<v-clicks>

- 区间就是普通对象 `{ start, end }`
- v3 起：`start` 晚于 `end` 不抛错，按负向区间处理（返反向数组）
- `intervalToDuration` v3 起**跳过 0 值字段**，更紧凑

</v-clicks>

<!--
date-fns 用普通对象 start、end 表示区间，配一组函数。isWithinInterval 判断日期是否在区间内，默认包含端点。eachDayOfInterval 生成区间内每一天的 Date 数组，做日历、按天聚合很常用，同族还有 eachWeekOfInterval、eachMonthOfInterval 等。

时长方面，intervalToDuration 把区间转成 years、months、days 这种结构化对象，formatDuration 再渲染成「6 days」这样的可读文本。

两个 v3 行为变化：接受 Interval 的函数在 start 晚于 end 时不再抛错，而是按负向区间处理，eachXOfInterval 返回反向数组；intervalToDuration 会跳过值为 0 的字段，对象更紧凑。想显式校验区间合法性，用 v3 新增的 interval 函数。
-->

---

# tree-shaking：核心卖点

```ts
// ✅ 具名导入：只打 format + addDays
import { format, addDays } from "date-fns"

// ❌ 命名空间导入：可能整库打进
import * as dateFns from "date-fns"
```

<v-clicks>

- 库侧：ESM + 独立具名导出（v3 dual-package，`.mjs`）
- 使用侧：摇树打包器（Vite/Rollup/webpack）+ **具名导入**
- 构建期死代码消除，**不是**运行时按需加载
- locale 也按需导入：`import { zhCN } from "date-fns/locale"`

</v-clicks>

<!--
tree-shaking 是 date-fns 相对 Moment 的核心卖点。

用具名导入，打包器只保留你真正 import 的函数，用 format 和 addDays 就只打这两个的代码。反例是命名空间导入 import star，打包器难以判定用到哪些导出，常把整库打进来。

生效要两端配合：库侧提供 ESM 和独立具名导出，v3 起是 dual-package、ESM 用 .mjs；使用侧用支持静态分析的打包器加具名导入。强调一点：tree-shaking 是构建期的死代码消除，不是运行时按需加载。

locale 同理，要按需具名导入 import zhCN from date-fns/locale，再通过 locale 选项传入，不会把 80 多种语言全打进产物。
-->

---

# 演进：v3 大重构（2023-12）

<v-clicks>

- **ESM/CJS 双包**：显式 exports，ESM 文件用 `.mjs`
- **扁平结构** + **具名导出取代默认导出**
- `require('date-fns/x')` → 解构 `const { x } = require(...)`
- `constants` 移出顶层 → `date-fns/constants`
- 不再校验参数个数（交给 TS）；函数**接受字符串**日期
- 弃 IE、弃 Flow；`differenceInX` 加 `roundingMethod`（默认 `Math.trunc`）

</v-clicks>

<!--
讲版本演进。v3 在 2023 年底发布，是一次彻底的现代化重构，破坏性变更不少。

第一，成为 ESM 和 CommonJS 双包，导出在 package.json 显式声明，ESM 文件改用 .mjs 扩展名。第二，目录扁平化，函数直接是 date-fns 斜杠 add.mjs。第三，所有内容改为具名导出，取代默认导出，原来 require('date-fns/addDays') 拿默认导出的写法，要改成解构。第四，常量移出顶层，改从 date-fns/constants 导入，这是为了改善 Next.js 等的 modularizeImports 兼容。

还有：函数不再检查参数个数，交给 TypeScript，函数体更精简；接受日期参数的函数现在也接受字符串。放弃 IE 和 Flow，拥抱现代 JS。differenceInX 新增 roundingMethod 选项，默认向零截断 Math.trunc。
-->

---

# 演进：v4 时区支持（2024-09）

```ts
import { addDays, startOfDay } from "date-fns"
import { tz } from "@date-fns/tz"

startOfDay(addDays(Date.now(), 5, { in: tz("Asia/Singapore") }))
//=> "2024-09-16T00:00:00.000+08:00"
```

<v-clicks>

- 十年来首次内置**一等时区支持**
- 经配套包 `@date-fns/tz`：`TZDate` 类 + `tz()` 辅助
- 所有相关函数加 context `in` 选项指定计算时区
- 破坏性变更很少，**主要是类型层面**

</v-clicks>

<!--
v4 在 2024 年 9 月发布，头条特性是：发布十年后，date-fns 终于有了一等公民级的时区支持。

机制是通过配套包 @date-fns/tz，它提供 TZDate 类和 tz 辅助函数，并给所有相关函数加了一个 context in 选项，用来指定计算所用的时区。看代码，给 addDays 传 in: tz('Asia/Singapore')，就会在新加坡时区上加 5 天，startOfDay 继承这个时区返回当天起点。

作者特别强调，v4 的破坏性变更很少，几乎都是类型层面的，而且 v2 到 v3 隔了四年，v3 到 v4 不到一年，今后会保持这个节奏、尽量少破坏。紧跟着的 v4.1 又给 format、formatISO、formatRelative 这些格式化函数补全了时区支持。
-->

---

# 时区实战：同一天判断

```ts
import { isSameDay } from "date-fns"
import { tz } from "@date-fns/tz"

const sg = new Date("2024-03-13T22:00:00+08:00")
const la = new Date("2024-03-13T06:00:00-07:00")  // 同一 UTC 时刻

isSameDay(sg, la, { in: tz("Asia/Singapore") })   //=> true
isSameDay(sg, la, { in: tz("America/New_York") })  //=> false
```

<v-clicks>

- 同一 UTC 时刻，在不同时区**可能不是同一天**
- `in` 选项把「同一天」「当天起点」**明确绑定到时区**
- `@date-fns/tz` ≠ 旧第三方 `date-fns-tz`（不同包，按需择一）

</v-clicks>

<!--
时区最典型的用例是跨时区「同一天」判断。看代码，sg 和 la 是同一个 UTC 时刻，但「是不是同一天」取决于在哪个时区看。在新加坡时区看是同一天，返回 true；在纽约时区看就跨日了，返回 false。

这正是 in 选项的价值：把「同一天」「当天起点」这类概念明确绑定到一个具体时区，而不是默默依赖系统默认时区。

澄清一个易混点：v4 官方的 @date-fns/tz，和社区早期的第三方包 date-fns-tz，是两个不同的包。date-fns-tz 提供 formatInTimeZone、toZonedTime 这些 API，@date-fns/tz 提供 TZDate 和 tz 配合 in 选项。它们不是改名也不是别名，按需选一个。另外纯 UTC 计算可以用 @date-fns/utc 的 UTCDate。
-->

---

# 选型：date-fns vs 三家

| 维度 | date-fns | Day.js | Luxon |
|---|---|---|---|
| API | 纯函数 | 链式·不可变 | 链式·不可变 |
| 操作对象 | 原生 Date | Dayjs | DateTime |
| tree-shaking | **极佳** | 较好 | 一般 |
| 体积 | 随用量 | **最小** | 中等 |
| 时区 | @date-fns/tz | 插件 | **内置** |

<v-clicks>

- 最小包体 + 链式顺手 → **Day.js**
- 重时区 / 富类型 + 接受 OO → **Luxon**
- 函数式 + 极致摇树 + 用原生 Date → **date-fns**

</v-clicks>

<!--
横向对比三家。Moment 已进入维护模式，不再是新项目首选，这里主要比 date-fns、Day.js、Luxon。

API 形态上，date-fns 是纯函数、函数组合，另两家都是链式的不可变对象。操作对象，date-fns 直接用原生 Date，Day.js 是 Dayjs 实例，Luxon 是 DateTime。tree-shaking date-fns 最好。体积 Day.js 核心最小，大约 2KB。时区 Luxon 内置、基于 Intl，date-fns 要装 @date-fns/tz，Day.js 用插件。

选型建议：追求最小包体加链式顺手选 Day.js；重时区、要 Duration 和 Interval 富类型、能接受面向对象选 Luxon；想要函数式、极致 tree-shaking、直接操作原生 Date 选 date-fns。
-->

---
layout: intro
---

# 总结

date-fns = **函数式、不可变、可摇树**的原生 Date 工具集

- 心智：纯函数返回新值，不改入参，不污染原型
- 格式化：token 遵循 Unicode（`yyyy`/`dd`，**别用 `YYYY`/`DD`**）
- 能力：format/parse · addX/subX · differenceInX · 区间/时长
- 摇树：ESM + 具名导入，用多少打多少
- v4：`@date-fns/tz` + `in` 选项带来一等时区支持
- 选型：要函数式 + 小包体就选它；重内置时区可考虑 Luxon

<!--
总结一下。

date-fns 本质是一套函数式、不可变、可 tree-shaking 的工具集，直接操作原生 Date。

心智上记牢纯函数返回新值、不改入参、不污染原型。格式化的 token 遵循 Unicode 标准，年用小写 yyyy、日用小写 dd，千万别照搬 Moment 的大写 YYYY、DD。能力覆盖 format 和 parse、addX 和 subX、differenceInX、区间和时长一整套。tree-shaking 靠 ESM 加具名导入，用多少打多少。v4 通过 @date-fns/tz 和 in 选项带来了一等时区支持。

选型上，想要函数式加小包体就选 date-fns；如果特别看重开箱即用的内置时区和富类型，可以考虑 Luxon。谢谢大家。
-->
