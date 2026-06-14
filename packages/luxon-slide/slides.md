---
theme: seriph
background: https://cover.sli.dev
title: Luxon
info: |
  Presentation Luxon — the immutable, Intl-powered datetime library.

  Learn more at [https://moment.github.io/luxon/](https://moment.github.io/luxon/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🕰️</span>
</div>

<br/>

## Luxon

不可变、基于原生 Intl 的现代 JS 日期时间库。Moment 团队的精神继任者：DateTime / Duration / Interval 三大类型，时区与本地化复用宿主 Intl，不打包数据

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/moment/luxon" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Luxon。它由 Moment 的维护者 Isaac Cambron 从零重写，后来被 Moment 团队接纳为官方 labs project，是 Moment 的现代继任者。

一句话定位：一个处理 JS 日期时间的库，主打不可变类型、明确的 API,并且时区和本地化都复用宿主环境的原生 Intl,不在库里打包时区数据库和 locale 数据。

主线:为什么用它 → 创建与取值 → 不可变 → 解析 → 格式化 → 时区 → 日历数学 → diff → Duration → Interval → 有效性 → 选型 → 总结。版本基线 Luxon 3.x。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 Luxon

<v-clicks>

- Moment 对象可变，add 会原地改原对象
- moment-timezone 把时区数据库打包进库
- 原生 Date API 难用、月份还 0-based
- 想要不可变 + 一流时区 + 真国际化

</v-clicks>

<div v-click class="mt-6">

Luxon 的回应：

- 所有类型**不可变** → 安全传递
- 时区基于**原生 Intl** → 不打包数据
- **DateTime / Duration / Interval** 富类型
- 机器看 ISO、人类看本地化串

</div>

<!--
为什么要换一个日期库？几个老痛点。第一,Moment 对象是可变的,add 这类方法会原地修改原对象,是最容易踩的隐蔽坑。第二,moment-timezone 把整个时区数据库打包进库,体积大。第三,原生 Date API 难用,月份还是 0-based。

Luxon 针对性地回应:所有类型不可变,日期对象可以安全传来传去;时区基于原生 Intl,不打包数据,体积可控;提供 DateTime、Duration、Interval 三种富类型;并且明确区分机器可读和人类可读两种输出。这就是今天的主线。
-->

---

# 创建 DateTime 与取值

```ts
import { DateTime } from "luxon";

DateTime.now();                      // 当前时刻（本地时区）
DateTime.local(2024, 5, 15, 8, 30);  // 月份 1-based（5=五月）
DateTime.utc(2024, 5, 15);           // UTC 时区
DateTime.fromISO("2024-05-15T08:30");// 解析 ISO

const dt = DateTime.now();
dt.year;     // 2024 —— getter 属性，不是 dt.year()
dt.month;    // 5（1-based）
dt.weekday;  // 1~7（周一=1）
```

<!--
创建用工厂方法,不要 new。now 是当前时刻,等价于无参的 local,只是更清楚。local 在本地时区构造,注意月份是 1-based,5 就是五月,这点和原生 Date 的 0-based 不同。utc 在 UTC 时区构造。fromISO 解析 ISO 字符串。

取值是和 Moment 最直观的差异:Luxon 用 getter 属性,所以是 dt.year,不是 dt.year() 加括号。month 是 1-based,weekday 是 ISO 星期,周一是 1、周日是 7。
-->

---

# 不可变：第一原则

```ts
const d1 = DateTime.now();
const d2 = d1.plus({ hours: 1 });

d1 === d2;                  // false —— plus 返回新实例
d1.set({ hour: 3 }).hour;   // 3，而 d1 本身不变
```

<v-clicks>

- `plus` / `minus` / `set` / `setZone` 都**返回新对象**
- 原对象永不被改 → 可安全放进缓存、状态、传参
- 对位 Moment：Moment 的 `add()` 会**原地修改**

</v-clicks>

<!--
不可变是贯穿全库的第一原则。文档原话:Luxon 对象是不可变的,你不能原地改它,只能创建被修改过的副本。

看代码:d1 加一小时得到 d2,两者是不同对象,d1 === d2 是 false,而且 d1 完全没变。set 设置字段也一样,返回新对象,原 d1 不动。

这条规则适用于所有修改方法:plus、minus、set、setZone、startOf 等等,一律返回新实例。好处是日期对象可以安全地传来传去、放进缓存或状态,不必担心被别处偷偷改掉。对位 Moment,它的 add 会原地修改原对象,这是 Moment 最容易踩的坑。
-->

---

# 解析：按格式各就各位

```ts
DateTime.fromISO("2024-05-15T09:24:15");   // ISO 8601（宽松）
DateTime.fromSQL("2024-05-15 09:24:15");   // SQL
DateTime.fromMillis(1542674993410);        // Unix 毫秒
DateTime.fromJSDate(new Date());           // 原生 Date

// 人类输入的自定义格式：严格按 token
DateTime.fromFormat("May 25 1982", "LLLL dd yyyy");
DateTime.fromFormat("mai 25 1982", "LLLL dd yyyy", { locale: "fr" });
```

<div v-click class="mt-2 text-sm">

> Luxon 没有「万能 parse」，按格式分方法；解析**很严格**，给程序读的数据请用 ISO。

</div>

<!--
Luxon 不提供万能 parse,而是按格式分方法。fromISO 解析 ISO 8601,比较宽松。fromSQL 解析数据库格式。fromMillis、fromSeconds 由 Unix 时间戳构造。fromJSDate 把原生 Date 转成 DateTime,还能用 zone 选项设结果时区。

人类输入的自定义格式用 fromFormat,它严格按 token 匹配,还能传 locale 做本地化解析,比如解析法语月名。

要点:Luxon 的 parser 很严格,这和 Moment 的宽松不同。给程序读的数据,请统一用 ISO,别依赖宽松解析。
-->

---

# 格式化：机器看 ISO，人类看本地化

```ts
// 机器可读：接口 / 存储 / 传输
dt.toISO();      // '2024-05-15T11:32:00.000-04:00'
dt.toISODate();  // '2024-05-15'

// 人类可读：本地化
dt.toLocaleString(DateTime.DATE_FULL);            // 'May 15, 2024'
dt.setLocale("zh").toLocaleString(DateTime.DATE_FULL); // '2024年5月15日'
```

<v-clicks>

- 铁律：机器读 → **ISO**；人类读 → **toLocaleString**
- `toFormat` 仅留给特殊自定义格式

</v-clicks>

<!--
格式化有条铁律:如果字符串给计算机读,优先 ISO 8601;如果给人读,优先 toLocaleString。

机器可读用 toISO,产出完整的 ISO 串,含日期、时间、毫秒和偏移;只要日期用 toISODate。这些适合接口、存储、跨网络传输。

人类可读用 toLocaleString,它基于原生 Intl 自动本地化,配合预设常量比如 DATE_FULL,再用 setLocale 一行切语言,中文就能输出 2024 年 5 月 15 日。

toFormat 是自定义 token 格式,只在确实需要特定格式时才用,下一页细说它的坑。
-->

---

# toFormat 的两个坑

```ts
dt.toFormat("yyyy-MM-dd");  // '2024-05-15'，年 yyyy、日 dd 都是小写
```

<v-clicks>

- **token 与 Moment 不通用**：Luxon `yyyy`/`dd`，Moment `YYYY`/`DD`
- `toFormat` / `fromFormat` **默认回退 en-US**，要非英文须 `setLocale`
- 转义字面量用**单引号**：`"HH 'hours'"`

</v-clicks>

<div v-click class="mt-3 text-sm">

> `toLocaleString` 跟随系统 locale；`toFormat` 默认英文，两者不同。

</div>

<!--
toFormat 有两个常踩的坑。

第一,token 体系和 Moment 不通用。Luxon 年份是小写 yyyy、日是小写 dd;Moment 是大写 YYYY、大写 DD。文档明说同一个格式串不能在两库间通用,迁移时要逐个核对,不能照搬。

第二,toFormat 和 fromFormat 默认回退到 en-US,因为它们常用于对 locale 不敏感的接口场景。要输出非英文,必须显式 setLocale 或传 locale 选项。这和跟随系统 locale 的 toLocaleString 不一样。

另外,在 toFormat 里转义字面文本用单引号包裹,比如 HH 单引号 hours 单引号;要输出一个字面单引号就写两遍。
-->

---

# 时区：同一时刻 vs 同一钟点

```ts
const local = DateTime.local(2024, 5, 15, 12); // 'America/New_York'

const tokyo = local.setZone("Asia/Tokyo");     // 换展示时区
local.toMillis() === tokyo.toMillis();          // true（同一时刻）

local.setZone("Asia/Tokyo", { keepLocalTime: true });
// 钟点还是 12 点，但时间戳改变了
```

<v-clicks>

- 默认 `setZone`：保持**绝对时刻**，换展示时区
- `keepLocalTime`：保持**当地钟点**，时间戳改变
- 全局默认：`Settings.defaultZone = "Asia/Tokyo"`

</v-clicks>

<!--
时区是 Luxon 的强项,基于原生 Intl,能直接用任意 IANA 时区。

setZone 默认保持绝对时刻,只换展示时区。看代码,本地 12 点换到东京时区,东京显示成次日凌晨 1 点,但底层时间戳不变,toMillis 相等。

加 keepLocalTime true 则相反:保持当地钟点不变,12 点还是 12 点,但变成东京的 12 点,底层时间戳因此改变,toMillis 不再相等。

要全局改默认时区,设 Settings.defaultZone 等于 Asia Tokyo,恢复用 system,UTC 用字符串 utc。
-->

---

# 时区基于 Intl：不打包数据

<v-clicks>

- 时区能力**全部来自宿主 Intl**（底层 ICU），库不打包 tz 数据
- 能用哪些时区 → 取决于运行环境
- 不支持的时区 → 无效 DateTime（`'unsupported zone'`）

</v-clicks>

<div v-click class="mt-4">

⚠️ 环境前提：

- **Node 13+** 内置完整 ICU；更老需 `full-icu`
- **React Native <0.70 (Android)** 默认无 Intl，需切 `jsc-intl`

</div>

<!--
这是 Luxon 最该记牢的边界:时区能力全部来自宿主的 Intl,底层是 ICU,库本身不打包任何时区数据。这和 moment-timezone 把数据库打包进去的做法完全不同。

带来的影响:能用哪些时区取决于运行环境的 Intl 支持;如果指定了环境不支持的时区,会得到无效 DateTime,invalidReason 是 unsupported zone。

环境前提:Node 13 以上内置完整 ICU,无需动作;更老版本需要 full-icu 包。浏览器现代版本普遍 OK。React Native 0.70 以下的 Android 默认不带 Intl,要在 build.gradle 里把 jsc 切到 android-jsc-intl。排查口诀:非英文或时区出不来,先怀疑环境 ICU,而不是 Luxon 缺数据,因为 Luxon 根本不带数据。
-->

---

# 日历数学 vs 时间数学

```ts
const start = DateTime.local(2017, 3, 11, 10); // DST 切换前

start.plus({ days: 1 }).hour;   // 10 —— 加「天」保钟点
start.plus({ hours: 24 }).hour; // 11 —— 加「小时」保时长
```

<v-clicks>

- **日历单位**（年/月/周/天）：长度可变 → 保当地钟点
- **时间单位**（时/分/秒）：长度固定 → 精确加毫秒
- 跨夏令时，二者结果不同（那天只有 23 小时）

</v-clicks>

<!--
Luxon 把单位分两类,这是最重要的概念。

看代码:美东夏令时切换前一天的 10 点,加 1 天,钟点仍是 10,因为这天只有 23 小时,日历运算保钟点;加 24 小时,钟点变成 11,因为时间运算精确加毫秒,跨过 DST 多出来的那一小时。

日历单位是年、季度、月、周、天,长度可变,因为闰年、月份长度、夏令时,走日历运算,保持当地钟点。时间单位是时、分、秒、毫秒,长度固定,走时间运算,精确加时长。

记牢:加天保钟点,加小时保时长。跨夏令时那一周,7 天和 168 小时结果会差一小时。
-->

---

# diff：差值是一个 Duration

```ts
const end = DateTime.fromISO("2017-03-13");
const start = DateTime.fromISO("2017-02-13");

end.diff(start, "months").toObject();  // { months: 1 }
end.diff(start).toObject();            // { milliseconds: ... } 默认毫秒
end.diff(start, ["months", "days"]);   // 多单位
```

<div v-click class="mt-3 text-sm">

> `diff` 返回 **Duration**（不是数字！）；取标量再 `.months` 或 `.as("months")`。多单位运算从高阶到低阶。

</div>

<!--
diff 计算两个 DateTime 的差值,关键:它返回一个 Duration 对象,不是数字。

传单位 months,得到 months 等于 1 的 Duration;不传单位默认毫秒;传单位数组得到多单位结果。要拿到标量数字,再点 months,或者用 as months。diffNow 是和当前时刻的差值。

顺带提一句,plus 一次传多个单位时,运算是从高阶到低阶:先加月再加天。所以一次 plus 多单位,和拆成两次 plus 单单位,结果可能不同,因为顺序变了。
-->

---

# Duration：as 取数字，shiftTo 重分配

```ts
import { Duration } from "luxon";

const dur = Duration.fromObject({ hours: 2, minutes: 7 });

dur.as("seconds");   // 7620 —— 数字标量
dur.toISO();         // 'PT2H7M'

Duration.fromObject({ minutes: 90 })
  .shiftTo("hours", "minutes").toObject(); // { hours: 1, minutes: 30 }
```

<v-clicks>

- `as(unit)` → **数字**；`shiftTo(...units)` → **新 Duration**
- 默认 casual 换算（1 月≈30 天）；长期精度传 `conversionAccuracy: 'longterm'`

</v-clicks>

<!--
Duration 是抽象时长,没有锚点。

as 把整个时长换算成单一单位的数字,2 小时 7 分等于 7620 秒。toISO 输出 ISO 时长格式 PT2H7M。

shiftTo 把时长重新分配到给定单位,返回的还是 Duration,90 分钟分配到时和分,得到 1 小时 30 分。记牢区别:as 返回数字,shiftTo、normalize、rescale 返回新的 Duration。

还有个精度问题:Duration 默认用 casual 换算,1 年约 365 天、1 月约 30 天,直观但不精确。需要长期精度,创建时传 conversionAccuracy 等于 longterm,用 400 年公历循环换算,代价是出现小数。
-->

---

# Interval：带锚点的区间

```ts
import { Interval, DateTime } from "luxon";

const i = Interval.fromDateTimes(
  DateTime.fromISO("2024-05-15T09:00"),
  DateTime.fromISO("2024-05-15T12:00")
);

i.contains(DateTime.fromISO("2024-05-15T10:00")); // true
i.length("hours");          // 3（每次查询重算）
i.splitBy({ hours: 1 });    // 切成 3 个 Interval
```

<div v-click class="mt-2 text-sm">

> Interval 锚定起止点，`length` 每次重算 → 避免 Duration 跨单位换算的近似误差。还有 `overlaps` / `intersection` / `union` / `divideEqually`。

</div>

<!--
Interval 是带起止锚点的区间,和无锚点的 Duration 不同。

创建用 fromDateTimes 传起止两个时间点。contains 判断某个时间点是否在区间内。length 传单位返回区间长度,关键是它每次查询都基于起止点重新计算。splitBy 按时长把区间切成多段,返回 Interval 数组,9 点到 12 点按小时切得到 3 个。

Interval 的核心价值:length 每次重算,避免了 Duration 跨单位换算的近似误差。比如 diff 出月数再换算成天是 casual 近似,而 Interval 的 length days 是真实天数。此外还有 overlaps 重叠、intersection 交集、union 并集、divideEqually 等分、splitAt 按点切等丰富的区间运算。
-->

---

# 有效性：默认软失败

```ts
const bad = DateTime.fromISO("not-a-date");
bad.isValid;        // false
bad.invalidReason;  // 'unparsable'
bad.year;           // NaN
bad.toISO();        // null
```

<v-clicks>

- 坏数据**不抛错**，产出「无效 DateTime」+ 退化值
- 来源：越界 / 不支持时区 / 自相矛盾
- 想 fail-fast：`Settings.throwOnInvalid = true`

</v-clicks>

<!--
Luxon 遇到坏数据默认不抛异常,而是产出一个无效 DateTime。

看代码:解析不了的串,isValid 是 false,invalidReason 给短码 unparsable,year 返回 NaN,toISO 返回 null,toString 返回 Invalid DateTime,toObject 返回空对象。这套退化值是不抛错策略的一部分。

无效的来源主要三类:值越界,比如 2 月 40 日;不支持的时区;还有自相矛盾,比如指定的 weekday 和日期对不上。无效性还会沿运算传播,无效 DateTime 的 diff 得到无效 Duration。

如果希望问题尽早暴露,设 Settings.throwOnInvalid 等于 true,无效操作就直接抛错。代价是软失败变硬失败,所有可能产无效值的路径都要兜异常。
-->

---

# 相对时间：唯一的部分支持

```ts
DateTime.now().minus({ days: 2 }).toRelative();        // '2 days ago'
DateTime.now().minus({ days: 1 }).toRelativeCalendar(); // 'yesterday'
```

<v-clicks>

- 依赖 `Intl.RelativeTimeFormat`，缺失时**回退英文**
- 老旧环境（Edge 18 / Safari 13 / RN 旧版）受影响
- 探测：`Info.features() // { relative: false }`
- 注意：**无** Moment `Duration#humanize` 等价物

</v-clicks>

<!--
相对时间是 Luxon 唯一部分支持的特性。

toRelative 输出相对当前的人类可读差值,比如 2 days ago、in 1 month;toRelativeCalendar 用日历词,比如 yesterday、tomorrow。

它们依赖 Intl.RelativeTimeFormat。官方明说,如果环境缺这个能力,会回退到英文,其余功能正常,只有非英文的相对时间退回英文。受影响的是老旧环境,比如 Edge 18、Safari 13、React Native 旧版。可以用 Info.features 探测,relative 是 false 就表示缺这个能力。

还要注意:Luxon 没有 Moment 那个 Duration humanize 的等价物,也就是把时长本身人性化成 a few seconds 那种。toRelative 是相对某个时刻,语义不一样。
-->

---

# 选型：四个库怎么挑

| 维度 | Luxon | Day.js | date-fns |
|---|---|---|---|
| 范式 | OO + 不可变 | 链式 | 纯函数 |
| 体积 | 中等 | 极小 | 按需最优 |
| 时区 | 原生 Intl | 插件 | date-fns-tz |
| Interval | 原生 | 弱 | 函数式 |

<div v-click class="mt-3 text-sm">

> 要**一流时区 + 不可变 + 富类型** → Luxon；**极致包体** → Day.js；**函数式 + tree-shaking** → date-fns。Moment 已维护模式，新项目不建议。

</div>

<!--
最后看选型,把四个库放一起。

Luxon 是面向对象加不可变,体积中等,时区基于原生 Intl,原生有 Interval。Day.js 是链式,体积极小,大约 2KB 核心加插件,时区靠插件。date-fns 是纯函数式,操作原生 Date,按函数引入最易 tree-shaking,时区用配套的 date-fns-tz。

建议:需要一流时区、不可变、富类型,不在意体积,选 Luxon;极致包体优先、API 像 Moment,选 Day.js;喜欢纯函数式、极致 tree-shaking,选 date-fns。Moment 已经进入维护模式,可变加体积大,新项目不建议再选。
-->

---
layout: intro
---

# 总结

Luxon = **不可变 + Intl 驱动的现代日期库**

- 不可变：`plus`/`set` 返回新实例，原对象不变
- 时区：基于原生 Intl，**不打包 tz/locale 数据**
- 输出：机器看 `toISO`、人类看 `toLocaleString`
- 富类型：`Duration`（as/shiftTo）+ `Interval`（按需重算）
- 数学：日历数学 vs 时间数学，跨 DST 有别
- 边界：token 与 Moment 不通用、相对时间依赖 Intl

<!--
总结一下。

Luxon 本质是不可变加 Intl 驱动的现代日期时间库,Moment 的精神继任者。

技术要点:不可变,plus、set 都返回新实例,原对象不变;时区基于原生 Intl,不打包时区和 locale 数据,能力随环境而变;输出分两路,机器交换用 toISO,人类显示用 toLocaleString,toFormat 只留给特殊自定义格式;富类型,Duration 用 as 取数字、shiftTo 重分配,Interval 锚定起止点、长度按需重算;数学上区分日历数学和时间数学,跨夏令时结果不同。

最后两条边界要记牢:toFormat 的 token 和 Moment 不通用,yyyy 不等于 YYYY;相对时间依赖 Intl.RelativeTimeFormat,缺失时回退英文。谢谢大家。
-->
