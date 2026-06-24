---
theme: seriph
background: https://cover.sli.dev
title: JavaScript 内建对象与数据结构
info: |
  JavaScript 标准内建对象与数据结构 —— 数值/字符串/正则/集合/JSON/Symbol/时间的能力与坑
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:javascript class="text-8xl" />
</div>

<br/>

## JavaScript 内建对象与数据结构

不导入任何包就能用，却处处是「不报错的坑」（基于 ES2025）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
这一叶讲的全是标准库——数值、字符串、正则、集合、JSON、Symbol、时间。它们最大的特点是：用错了大多不报错，错了你也未必察觉。
-->

---
transition: fade-out
---

# 这一章讲什么

JavaScript 标准内建对象，藏着一串「**不报错的坑**」

<v-click>

- **数值**：`0.1 + 0.2` 不等于 `0.3`、大整数丢精度
- **文本**：`length` 数 emoji 数出 2、正则 `lastIndex` 时灵时不灵
- **集合**：`Map` / `Set` 何时比对象、数组更称职
- **序列化**：`JSON.stringify` 悄悄丢值、`BigInt` 直接抛错
- **时间**：`Date` 月份从 0 开始、`Temporal` 已落地

</v-click>

<v-click>

> 这些都是「不导入任何包就能用」的标准库，错误大多是**隐性**的。

</v-click>

---

# 内建对象速览

| 内建 | 主要职责 | 一句话提醒 |
| --- | --- | --- |
| `Number` / `Math` | 数值与运算 | 浮点有精度坑，`Math` 不能 `new` |
| `BigInt` | 任意精度整数 | 加 `n`，不能与 `number` 混算 |
| `String` / `RegExp` | 文本与匹配 | `length` 数码元，`g` 带 `lastIndex` |
| `Map` / `Set` | 键值 / 去重 | 任意键、有序、可直接迭代 |
| `JSON` / `Symbol` | 序列化 / 唯一键 | 丢值、抛错；Symbol 半隐藏 |
| `Date` / `Temporal` | 日期时间 | `Date` 坑多，`Temporal` 是未来 |

---
layout: section
---

# 数值、Math 与 BigInt

JS 只有一种数字，却藏着两个坑

---

# 只有一种数字：IEEE 754

没有 `int` / `float` / `double` 之分，所有数字都是 **IEEE 754 双精度 64 位浮点**：

```js
typeof 42 === "number"; // true（整数小数同一种类型）
Number.MAX_SAFE_INTEGER; // 9007199254740991（2^53 - 1，安全整数上界）
Number.MAX_VALUE; // 1.7976931348623157e+308（约 ±1.8×10³⁰⁸）
9007199254740993 === 9007199254740992; // true（超出安全整数，无法区分！）
```

<v-click>

53 位有效精度带来两个必须刻进肌肉记忆的事实：**小数有误差**、**大整数丢精度**（最后一行：两个不同整数竟相等）。

</v-click>

---

# 浮点精度：`0.1 + 0.2` 的真相

```js
0.1 + 0.2; // 0.30000000000000004
0.1 + 0.2 === 0.3; // false（千万别这样比小数）
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON; // true（正解）
```

<v-click>

不是 Bug，是二进制浮点固有限制——`0.1` 在二进制里是无限循环小数，存进 64 位被截断。`Number.EPSILON` ≈ `2.22e-16`，是比小数的标准阈值。

</v-click>

<v-click>

::: warning 金额运算永远不要用浮点
价格、税、利率绝不能直接浮点累加。做法：**以「分」为单位用整数**（`19.99` 元存 `1999` 分），或用 `BigInt` / 十进制库。
:::

</v-click>

---

# 数字字面量与特殊值

```js
const hex = 0xff; // 十六进制 → 255（还有 0o 八进制、0b 二进制）
const million = 1e6; // 指数 → 1000000
const big = 1_000_000_000; // 数字分隔符（ES2021），只为可读
NaN === NaN; // false（唯一不等于自己的值）
1 / 0; // Infinity（除以 0 或超出最大值都溢出成它）
```

<v-click>

`NaN` 表示「无效运算结果」（`0/0`、`Number("abc")`），判定必须用 `Number.isNaN(x)`。

</v-click>

---

# 判定与解析：静态方法优先

ES2015 的 `Number` 静态法**不做隐式转换**，比全局 `isNaN` 更可靠：

```js
Number.isInteger(42.5); // false
Number.isSafeInteger(2 ** 53); // false（恰好越界）
isNaN("abc"); // true（"abc" 先被转成 NaN）
Number.isNaN("abc"); // false（不转换，"abc" 本身不是 NaN）
```

<v-click>

解析与格式化（注意 `toFixed` 返回**字符串**）：

```js
Number("42px"); // NaN（严格） vs parseInt("42px", 10); // 42（容忍后缀，基数必传）
(1234.5678).toFixed(2); // "1234.57"（定点四舍五入，返回字符串！）
(255).toString(16); // "ff"（2–36 进制；千分位 / 货币用 Intl.NumberFormat）
```

</v-click>

---

# `Math` 工具箱

`Math` 是**静态对象**（不能 `new Math()`），取整区别全在负数与方向：

```js
Math.round(2.5); // 3（.5 向正无穷，故 Math.round(-2.5) 是 -2 不是 -3）
Math.floor(-2.1); // -3（往负无穷） / Math.ceil(-2.9); // -2（往正无穷）
Math.trunc(-2.9); // -2（直接砍掉小数）
Math.hypot(3, 4); // 5（求斜边 / 向量长度） / Math.sign(-3); // -1
```

<v-click>

「`min` 到 `max` 含两端的随机整数」记牢公式：

```js
const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
```

</v-click>

---

# `BigInt`：突破安全整数

超过 `MAX_SAFE_INTEGER` 时，`BigInt`（ES2020）提供**任意精度整数**：

```js
const a = 9007199254740993n; // 字面量：末尾加 n（或 BigInt("...") 传字符串）
9007199254740993n === 9007199254740992n; // false（BigInt 精确）
1n + 1; // ❌ TypeError：不能与 number 混算（Number(1n) + 1 才行）
5n / 2n; // 2n（除法直接截断，不是 2.5n；且没有 Math 支持）
1n == 1; // true（宽松转换） vs 1n === 1; // false（类型不同）
```

<v-click>

四条铁律：**不混算、无 Math、除法截断、`===` 看类型**。适合大整数 ID / 密码学，不适合金额。

</v-click>

---
layout: section
---

# 字符串与模板字面量

不可变的原始值，`length` 却会骗你

---

# 三种字面量与不可变

反引号模板字面量解锁**插值**与**多行**；字符串是**不可变**的原始值：

```js
const msg = `${"Ada"} 今年 ${36} 岁，明年 ${36 + 1} 岁`; // ${} 放任意表达式
const html = `
  <li>多行原样保留，不用 \\n 拼接</li>`;
"hello".toUpperCase(); // "HELLO"（返回新串，原串纹丝不动）
"hello"[0] = "H"; // 无任何效果（静默失败）——想"改"必须重新赋值
```

<v-click>

单双引号完全等价；反引号几乎取代老式 `"..." + x` 拼接——更易读、不易漏空格。

</v-click>

---

# `length` 的真相：UTF-16 码元

`length` 数的是 **UTF-16 码元**，不是肉眼字符——按下标遍历会**把 emoji 拆成无效半码元**：

```js
"😀".length; // 2（一个 emoji，却数出 2！）
"👨‍👩‍👧".length; // 8（带零宽连接符的组合 emoji 更夸张）
```

<v-click>

`for...of` 和展开运算符都遵循**码点（code point）**，不会拆开 emoji：

```js
const s = "a😀b";
s.length; // 4（错误的"字符数"）
[...s]; // ["a", "😀", "b"]（展开按码点，长度 3）
"😀".codePointAt(0); // 128512（完整码点，charCodeAt 只取半个）
```

</v-click>

---

# 查找、截取、增补与规范化

```js
"hello world".includes("world"); // true（返回布尔，最常用）
"hello".slice(-3); // "llo"（支持负数） / "hello".at(-1); // "o"（负索引）
"5".padStart(3, "0"); // "005"（补零、对齐）
"a-b-c".replaceAll("-", "_"); // 换全部（replace 只换第一个；传正则须带 g）
```

<v-click>

::: warning Unicode 规范化：看着一样却 `===` 不相等
`é` 可以是单码点（NFC）或「e + 组合重音」（NFD），字节不同故 `===` 为 `false`。比较用户输入 / 文件名前先 `a.normalize() === b.normalize()`（默认 NFC）。
:::

</v-click>

---

# 标签模板与 `String.raw`

模板字面量前跟函数名，函数接管拼装过程，签名 `(strings, ...values)`：

```js
function highlight(strings, ...values) {
  return strings.reduce((acc, str, i) =>
    acc + str + (values[i] != null ? `【${values[i]}】` : ""), "");
}
highlight`用户 ${"Ada"} 在线`; // "用户 【Ada】 在线"
String.raw`C:\new\test`; // "C:\new\test"（内建标签：\n \t 不转义）
```

<v-click>

用途：HTML 转义防 XSS、i18n、SQL/Shell 安全拼接、CSS-in-JS。

</v-click>

---
layout: section
---

# 正则表达式

八个标志、捕获组，与 `lastIndex` 陷阱

---

# 两种创建方式

```js
const re1 = /ab+c/gi; // 字面量：解析期编译、性能好、适合常量
const word = "ab+c";
const re2 = new RegExp(word, "gi"); // 构造器：运行期、适合动态拼接
new RegExp("\\d+"); // 构造器里反斜杠要双重转义 = /\d+/
```

<v-click>

经验：写死用字面量；模式需拼接（如用户输入）才用构造器，并用 `RegExp.escape()` 防注入。

</v-click>

---

# 八个标志位

| 标志 | 作用 |
| --- | --- |
| `g` | 全局匹配，不止找第一个 |
| `i` | 忽略大小写 |
| `m` | `^` `$` 匹配每行首尾（而非整串） |
| `s` | 让 `.` 也能匹配换行符 |
| `u` | 按 Unicode 码点，启用 `\p{...}` |
| `y` | 粘性：只从 `lastIndex` 开始匹配 |
| `d` / `v` | 带索引 / `u` 升级版（ES2024） |

<v-click>

标志可组合 `/foo/gimsu`，且**创建后不能增删**。

</v-click>

---

# 字符类、锚点与量词

```js
/\d/; // 数字（\w 词字符、\s 空白，大写取反）
/\bword\b/; // 完整单词（两侧词边界；^ 行首、$ 行尾）
"<a><b>".match(/<.+>/)[0]; // "<a><b>"（贪婪：吃到最后一个 >）
"<a><b>".match(/<.+?>/)[0]; // "<a>"（懒惰 +?：到第一个 > 就停）
```

<v-click>

量词 `*`（≥0）/ `+`（≥1）/ `?`（0或1）/ `{n}` / `{n,m}`，默认**贪婪**，加后缀 `?` 变**懒惰**——抓 HTML 标签的关键区别。

</v-click>

---

# 分组与命名捕获组

```js
const m = "2026-06-25".match(/(\d{4})-(\d{2})-(\d{2})/);
m[1]; // "2026"（第 1 组）
"abab".match(/(?:ab)+/)[0]; // "abab"（非捕获 (?:...) 省内存）
const d = "2026-06-25".match(/(?<y>\d{4})-(?<mo>\d{2})/);
d.groups.y; // "2026"（命名组，ES2018，可读性大增）
```

<v-click>

反向引用：`/(\w)\1/.test("aa")` → `true`（同字符出现两次）；命名版用 `\k<name>`。

</v-click>

---

# 断言：前瞻与后顾

断言检查「某位置前后是否符合模式」，但**不消耗字符**：

```js
/\d+(?=元)/.exec("100元")[0]; // "100"（正前瞻，"元"不在结果里）
/\d+(?!元)/; // 负前瞻：数字后面不是"元"
/(?<=\$)\d+/.exec("$100")[0]; // "100"（正后顾，"$"不在结果里）
/(?<!\$)\d+/; // 负后顾：前面不是"$"的数字
```

<v-click>

常用于「提取被符号包裹的内容，但不要那个符号」——取金额数字而不要货币符号。

</v-click>

---

# 方法：`match` vs `matchAll`

`RegExp` 与 `String` 两套方法各有分工，最易踩的是 `match` 带 `g` 时**丢掉捕获组**：

```js
/\d+/.test("abc123"); // true（RegExp.test：只问匹配与否，最快）
/(\d)(\d)/.exec("a12"); // ["12","1","2", index:1]（带捕获组与位置）
"2026-06, 2025-12".match(/(\d{4})-(\d{2})/g); // ["2026-06","2025-12"]（丢了组！）
for (const m of "2026-06".matchAll(/(?<y>\d{4})/g))
  m.groups.y; // "2026"（matchAll：每个匹配都是完整 exec 结果，带组）
```

<v-click>

取「所有匹配＋捕获组」的现代正解就是 `matchAll`（ES2020，需带 `g`）；`replace` / `search` / `split` 也都收正则。

</v-click>

---

# `lastIndex` 陷阱

带 `g` / `y` 的正则有**可变状态** `lastIndex`，每次 `exec` / `test` 都推进它：

```js
const re = /\d/g;
re.test("1"); // true（lastIndex 推到 1）
re.test("1"); // false（从下标 1 开始找，已到末尾！）
```

<v-click>

::: warning 复用全局正则会「时灵时不灵」
对策：每次新建正则，或循环改用 `matchAll`，而非手动复用 `exec` / `test`。
:::

</v-click>

---

# Unicode 属性转义

加 `u` 标志后按码点工作，解锁 `\p{...}`（ES2018）：

```js
/\p{Letter}/u.test("中"); // true（按 Unicode 类别匹配"字母"）
/\p{Emoji}/u.test("😀"); // true
/^.$/.test("😀"); // false（不加 u，被当 2 个码元）
/^.$/u.test("😀"); // true（u 模式按码点）
```

<v-click>

`v` 标志（ES2024）是 `u` 超集，支持字符类集合运算（交 `&&` / 差 `--`），锦上添花。

</v-click>

---
layout: section
---

# Map / Set 与弱引用

比对象更称职的集合，与不阻 GC 的弱引用

---

# `Map`：键可为任意值

普通对象做字典有先天不足；`Map` 为「键值集合」量身打造：

```js
const m = new Map();
m.set("name", "Ada"); // 字符串键
m.set({ id: 1 }, "用对象当键"); // 对象键（普通对象做不到）
m.set(NaN, "甚至 NaN 也行");
m.size; // 3（直接有 size，不用手数）
```

<v-click>

直接可迭代（`for...of`）、保证插入顺序、无原型键污染。

</v-click>

---

# `Map` vs 对象怎么选

| 维度 | `Map` | 普通对象 |
| --- | --- | --- |
| 键类型 | 任意值（对象、`NaN`…） | 仅字符串 / `Symbol` |
| 大小 | `.size` 直接拿 | `Object.keys(o).length` |
| 顺序 | 保证插入顺序 | 整数键会被重排 |
| 原型污染 | 无 | 有（`toString` 等风险） |
| JSON / 字面量 | 不能直接序列化 | 原生支持 |

<v-click>

键非字符串 / 频繁增删 / 要 size 或保序 → `Map`；结构固定、要 JSON → 对象。

</v-click>

---

# `Set`：唯一值集合与相等语义

`Set` 自动去重、O(1) 判存在；键/值用 **SameValueZero**（与 `===` 几乎一样，但两处不同）：

```js
[...new Set([1, 2, 2, 3])]; // [1, 2, 3]（一行去重，最常见用途）
new Set([NaN, NaN]).size; // 1（NaN 等于自身，能去重，=== 做不到）
new Set([0, -0]).size; // 1（+0 与 -0 视为相等）
new Set([{ x: 1 }, { x: 1 }]).size; // 2（对象按引用，不同引用算不同）
```

<v-click>

删值用 `delete(value)` 而非 `splice`，查存在比数组 `includes` 快。

</v-click>

---

# `Set` 集合运算（2024 起可用）

一整套数学集合运算，让交并差不再手写循环：

```js
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
a.union(b); // Set {1, 2, 3, 4}（并集）
a.intersection(b); // Set {2, 3}（交集）
a.difference(b); // Set {1}（差集：a 有 b 没有）
a.isSubsetOf(b); // false（子集判定）
```

<v-click>

属较新特性，面向老环境先做 `typeof a.union === "function"` 检测。

</v-click>

---

# 弱引用：`WeakMap`

普通 `Map` 对键是**强引用**，易内存泄漏；`WeakMap` 是**弱引用**，键无人引用即被 GC：

```js
const wm = new WeakMap();
let obj = { id: 1 };
wm.set(obj, "关联数据"); // 键必须是对象
obj = null; // 解除引用后，那一项会在某次 GC 自动清除
```

<v-click>

限制都源于「键随时可能消失」：键必须是对象、**不可枚举**、无 `size` / `clear`，只有 `set` / `get` / `has` / `delete`。

</v-click>

---

# `WeakMap` 用途与 `WeakSet`

给对象挂**私有数据 / 元数据 / 缓存**而不污染对象、不漏内存：

```js
const nodeState = new WeakMap();
nodeState.set(node, { visitedAt: Date.now() }); // 节点移除后自动清理

const ws = new WeakSet();
ws.add(el); // WeakSet：标记一批对象（哪些已处理）而不阻止回收
```

<v-click>

::: tip 类私有数据优先用 `#` 字段
现代 JS 已有真私有字段（`#field`）；WeakMap 更适合「给无法改造的对象挂外部数据」。`WeakRef` / `FinalizationRegistry` 回调不保证执行，MDN 建议非必要不用。
:::

</v-click>

---

# 分组：`Object.groupBy` / `Map.groupBy`

把数组按规则分桶，ES2024 给了两个内建静态方法：

```js
const items = [
  { type: "水果", name: "苹果" },
  { type: "蔬菜", name: "白菜" },
];
Object.groupBy(items, (it) => it.type); // 返回普通对象（键转字符串）
Map.groupBy(items, (it) => it.type); // 返回 Map（键可为任意值）
```

<v-click>

需用对象当分组键时用 `Map.groupBy`，否则 `Object.groupBy` 更顺手。

</v-click>

---
layout: section
---

# JSON 与 Symbol

序列化的「悄悄丢值」，与唯一的协议钩子

---

# `JSON.stringify`：对象 → 字符串

```js
const user = { name: "Ada", roles: ["admin"] };
JSON.stringify(user); // '{"name":"Ada","roles":["admin"]}'
JSON.stringify(user, null, 2); // 第三参 space：美化缩进
JSON.stringify(data, ["name", "age"]); // 第二参数组：只保留白名单键
JSON.stringify(data, (k, v) => (k === "pwd" ? undefined : v)); // 函数：剔除
```

<v-click>

第二参 `replacer` 可过滤 / 改写：数组是白名单，函数返回 `undefined` 则剔除该键。

</v-click>

---

# 「悄悄丢值」的规则（必背）

`stringify` 对几类值的处理常让人意外，**不报错只默默变形**：

```js
JSON.stringify({ a: undefined, b: () => 1, c: Symbol() });
// "{}"（对象中：undefined / 函数 / Symbol 全被丢弃）
JSON.stringify([undefined, () => 1]); // "[null,null]"（数组中变 null）
JSON.stringify({ d: NaN, e: Infinity }); // '{"d":null,"e":null}'
JSON.stringify({ n: 1n }); // ❌ TypeError：BigInt 直接抛错
```

<v-click>

要显式空值就传 `null`；序列化 `BigInt` 需自定义 `toJSON` 或先 `.toString()`。

</v-click>

---

# `toJSON` 钩子与 `JSON.parse`

对象定义 `toJSON()` 即可自定义序列化结果（`Date` 靠它输出 ISO 串）：

```js
JSON.stringify({ at: new Date() }); // Date → toISOString() 字符串
JSON.parse('{"name":"Ada"}'); // 字符串 → 对象
JSON.parse(text, (key, val) =>
  key === "born" ? new Date(val) : val); // reviver：字符串 → Date
```

<v-click>

`parse` 的第二参 `reviver` 逐键转换，经典用途是把日期串还原成 `Date`（JSON 没有日期类型）。

</v-click>

---

# JSON 不是 JavaScript

JSON 语法**比 JS 字面量严格得多**（键必双引号、不许尾逗号、不许注释、无 `undefined`）：

| ✅ 合法 JSON | ❌ 非法（JS 里却合法） |
| --- | --- |
| `{"a": 1}` | `{a: 1}`（键必须双引号） |
| `{"a": 1}` | `{"a": 1,}`（不允许尾逗号） |
| `"text"` | `'text'`（字符串必须双引号） |

<v-click>

::: tip 别用 `JSON.parse(JSON.stringify())` 深拷贝
它丢函数 / `undefined` / `Symbol`，`Date` 变串、`NaN` 变 `null`、遇循环引用抛错。现代深拷贝用 `structuredClone(x)`（支持 `Date`/`Map`/`Set`/循环引用，仍不拷函数）。
:::

</v-click>

---

# `Symbol`：唯一且半隐藏的键

第 7 种原始类型，每次调用都**全局唯一**（描述相同也不相等），且键**半隐藏**：

```js
Symbol("id") === Symbol("id"); // false（描述只是标签，只读 .description）
new Symbol(); // ❌ TypeError：Symbol 不能 new
const obj = { visible: 1, [Symbol("secret")]: 2 }; // 做绝不冲突的对象键
Object.keys(obj); // ["visible"]（常规枚举看不到，须 getOwnPropertySymbols）
Symbol.for("app.id") === Symbol.for("app.id"); // true（全局注册表，跨模块共享）
```

<v-click>

`Symbol()` 造的是局部符号；`Symbol.for(key)` 在全局注册表按 key 共享同一个，适合做「内部 / 元数据」键。

</v-click>

---

# well-known symbols：语言协议钩子

`Symbol` 上挂着一批预定义符号，是 JS 内部操作的「协议接口」：

| well-known symbol | 作用 |
| --- | --- |
| `Symbol.iterator` | 实现即「可迭代」，支持 `for...of` / 展开 |
| `Symbol.hasInstance` | 定制 `instanceof` 判定 |
| `Symbol.toPrimitive` | 定制对象转原始值 |
| `Symbol.toStringTag` | 定制 `[object Xxx]` 标签 |

<v-click>

把它作为方法键实现到对象上，就能定制语言级行为：

```js
const range = { from: 1, to: 3, [Symbol.iterator]() { /* 返回迭代器 */ } };
[...range]; // [1, 2, 3]（展开触发了 Symbol.iterator）
```

</v-click>

---
layout: section
---

# Date 与 Temporal

用了 30 年的坑，与终于到来的解药

---

# `Date`：构造与读取

照搬早期 Java 设计，缺陷众多，先看怎么用：

```js
new Date(2026, 5, 25); // 2026 年 6 月 25 日（月份 5 = 6 月！）
new Date("2026-06-25"); // 纯日期串按 UTC 解释（见后续警告）
const d = new Date(2026, 5, 25, 14, 30);
d.getMonth(); // 5（0–11，要 +1 才是人类月份！）
d.getDate(); // 25（几号） vs d.getDay() // 4（星期几，0=周日）
```

<v-click>

`Date.now()` / `date.getTime()` 返回自 1970-01-01 UTC 的毫秒数。

</v-click>

---

# `Date` 七大坑

| # | 坑 |
| --- | --- |
| 1 | **月份从 0 开始**（Bug 头号来源） |
| 2 | `getDate` 几号 vs `getDay` 星期几，易混 |
| 3 | **可变**：setter 原地改，传参被偷改 |
| 4 | 只到毫秒；时区只有本地 / UTC |
| 5 | 解析不一致 + 无内建格式化 |

<v-click>

::: warning 可变 + 解析双陷阱
`new Date(2026,0,31).setMonth(1)` → 3 月（溢出）；`new Date("2026-06-25")` 当 **UTC 午夜**（东八区差一天），带时间 `T00:00` 却按**本地**。要稳定就用数字构造。
:::

</v-click>

---

# `Temporal`：已经落地了

从零设计的现代日期时间 API，专治 `Date` 所有问题。

<v-click>

- **标准进度**：TC39 **Stage 4**、列入 **ES2026**
- **浏览器**：已发 **Chrome/Edge 144+、Firefox 139+**，**Safari 暂未**
- **Baseline 状态**：因 Safari 缺席，**目前不是 Baseline**（约 65% 覆盖）

</v-click>

<v-click>

> 不再是「纸面提案」，值得现在就学；但面向公网生产**需配 polyfill 降级**。

</v-click>

---

# `Temporal` 解决了什么

| `Date` 的问题 | `Temporal` 的做法 |
| --- | --- |
| 可变，setter 有副作用 | **不可变**，方法都返回新对象 |
| 只到毫秒 | **纳秒精度** |
| 月份从 0 开始 | **月份从 1 开始**，符合直觉 |
| 时区只有本地 / UTC | **显式时区**（任意 IANA 时区） |
| 只支持公历 | **多日历系统** |
| 一个对象身兼数职 | **按用途拆成多个类型** |

---

# `Temporal` 核心类型与用法

```js
import { Temporal } from "@js-temporal/polyfill"; // 原生环境可直接用全局

const date = Temporal.PlainDate.from("2026-06-25");
date.month; // 6（终于不是 5 了！）
const next = date.add({ months: 1, days: 3 }); // 不可变：返回新对象
date.toString(); // "2026-06-25"（原对象纹丝不动）
```

<v-click>

类型按用途拆分：`Instant`（纳秒精确点）/ `ZonedDateTime`（带时区）/ `PlainDate` / `PlainTime` / `Duration`。**能控制运行环境就放心用，公网生产配 polyfill 或暂用 date-fns / Day.js**。

</v-click>

---

# `Intl`：国际化格式化

`Date` 无内建格式化，但 `Intl` 按用户**地区**自动产出本地化文本：

```js
new Intl.DateTimeFormat("zh-CN", { dateStyle: "long" }).format(new Date());
// "2026年6月25日"
new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(1999.5);
// "¥1,999.50"
new Intl.RelativeTimeFormat("zh-CN", { numeric: "auto" }).format(-3, "day");
// "3天前"
```

<v-click>

还有 `Collator`（排序）、`PluralRules`（复数）等，与 `Temporal` 深度协作；格式化一律交给它，别手拼「年月日」。

</v-click>

---

# 最佳实践小结

<v-click>

- **数值**：小数别用 `===` 比（用 `Number.EPSILON`），大整数用 `BigInt`，判定用 `Number.isXxx`
- **字符串**：`length` 数码元——emoji 用 `for...of` / 展开按码点，比较前 `normalize()`
- **正则**：取所有匹配＋捕获组用 `matchAll`；当心全局正则 `lastIndex` 副作用
- **集合**：任意键 / 保序用 `Map`，去重用 `Set`；挂私有数据用 `WeakMap`
- **JSON**：丢 `undefined`/函数/`Symbol`、`BigInt` 抛错；深拷贝用 `structuredClone`
- **时间**：`Date` 月份从 0、可变；`Temporal` 是未来，生产配 polyfill

</v-click>

---
layout: center
class: text-center
---

# 谢谢

这些标准库的坑大多**不报错**——记牢它们，就避开了九成隐性 Bug

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
