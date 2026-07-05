---
theme: seriph
background: https://cover.sli.dev
title: JSON 数据交换格式
info: |
  Presentation JSON —— 互联网最通用的轻量级数据交换格式。

  Learn more at [https://www.json.org](https://www.json.org/json-en.html)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl font-mono">{ }</span>
</div>

<br/>

## JSON —— 互联网最通用的数据交换格式

语言无关、心智极简的文本格式，六种值撑起整个 API/配置世界

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://www.json.org/json-en.html" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
今天聊 JSON —— JavaScript Object Notation，互联网上最通用的轻量级数据交换格式。

它语法源自 JS 对象字面量，但与语言无关，几乎所有主流语言都能读写。由 Douglas Crockford 提出，规范固化在 RFC 8259 与 ECMA-404 两份文档里。

今天顺序：定位与规范 → 六种值 → 字符串转义 → 数字规则 → 结构规则 → 与 JS 字面量区别 → stringify/parse 与一整套坑 → 变体（JSON5/JSONC/NDJSON）→ JSON Schema → 选型对比 → 工程场景 → 易错点 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# JSON 是什么

一个 JSON 文本 = **一个序列化的值**，语言无关：

<v-clicks>

- 语法源自 JS 对象字面量，但 Python/Java/Go/Rust 都能原生读写
- 由 **RFC 8259**（IETF）+ **ECMA-404**（Ecma）共同定义，互相一致
- 只描述数据、不带行为，语法多年稳定
- MIME 类型 `application/json`，扩展名 `.json`

</v-clicks>

<div v-click class="mt-4 text-sm">

> 心智极简是它成为跨系统通用语的根本——「刻意的克制」换来最大公约数。

</div>

<!--
JSON 全称 JavaScript Object Notation，名字里的 JavaScript 只是历史渊源，它本身语言无关。

核心心智：一个 JSON 文本就是一个序列化的值。规范由两份文档共同定义——RFC 8259 由 IETF 维护，管交换语义、UTF-8 编码、互操作性和媒体类型；ECMA-404 由 Ecma 维护，管语法本身。两者互为规范性引用、承诺一致，不存在方言冲突。

它只描述数据结构，不像脚本那样带逻辑。正是这种克制，让它成为异构系统间传数据的最大公约数。MIME 类型是 application/json，不带 charset，因为默认且只用 UTF-8。
-->

---

# 语法骨架：六种值

```json
{
  "string": "双引号字符串",
  "number": 3.14,
  "boolean": true,
  "nothing": null,
  "array": [1, 2, "异构允许"],
  "nested": { "对象可嵌套": true }
}
```

<div v-click class="mt-2 text-sm">

> 六种值 = 四种基本类型（字符串/数值/布尔/`null`）+ 两种结构类型（对象/数组）。**没有** `undefined`、日期、函数、`NaN`/`Infinity`。顶层可以是任意值（含单个字符串/数值）。

</div>

<!--
JSON 的值只有六种：字符串、数值 number、布尔 true/false、null 这四种基本类型，加上对象和数组两种结构类型。

对象是无序键值对，键必须是双引号字符串，冒号分隔键值，逗号分隔多对。数组是有序值序列，元素类型可以不同。

要特别记住 JSON 没有什么：没有 undefined、没有日期类型、没有函数、没有 NaN 和 Infinity。日期通常用 ISO 字符串承载。

还有一点：按 RFC 8259，顶层可以是任意合法值，不只是对象或数组，单个字符串 "hello" 或数字 42 也是合法的完整 JSON 文档。早期 RFC 4627 曾限制顶层必须是对象或数组，已放宽。
-->

---

# 字符串与转义

```json
{ "escapes": "换行 \n 制表 \t 引号 \" 反斜杠 \\", "emoji": "😀" }
```

<v-clicks>

- 合法转义仅：`\"` `\\` `\/` `\b` `\f` `\n` `\r` `\t` 与 `\uXXXX`
- 控制字符 U+0000–U+001F **必须**转义 → JSON 没有「多行字符串」
- `\uXXXX` 只编码一个 16 位码元；BMP 外字符（如 😀）用**代理对** `😀`
- 因为用 UTF-8，也可直接把字符原样写入，不必转义

</v-clicks>

<!--
字符串是双引号包裹的 Unicode 序列，用反斜杠转义。合法转义就这么几种：双引号、反斜杠、斜杠（可选）、退格、换页、换行、回车、制表，以及 \u 加四位十六进制。

关键点一：控制字符，包括真实的换行和制表符，必须转义，不能裸出现。所以 JSON 字符串里想换行只能写 \n，没有多行字符串这个概念。

关键点二：\uXXXX 只能编码一个 16 位码元。对基本多文种平面之外的字符，比如大部分 emoji，码点超过 U+FFFF，要用两个 \u 组成的 UTF-16 代理对，比如笑脸 U+1F600 写成 😀。

不过因为 JSON 交换用 UTF-8，你完全可以直接把 emoji 原样写进字符串，更易读，\u 转义主要是为了纯 ASCII 通道下不丢字符。
-->

---

# 数字：最容易踩的规则

| 写法 | 合法? | 原因 |
| --- | --- | --- |
| `0` `-1` `3.14` `6.022e23` | ✅ | 标准十进制/指数 |
| `007` | ❌ | 前导零不允许 |
| `.5` / `5.` | ❌ | 整数部分/小数部分不可省 |
| `0xFF` / `+1` | ❌ | 无十六进制、无显式正号 |
| `NaN` / `Infinity` | ❌ | 无法用数字语法表示 |

<div v-click class="mt-3 text-sm">

> ⚠️ **精度**：JS number 是 IEEE 754 双精度，安全整数区间 **±(2^53−1)**。超出的裸大整数 `JSON.parse` 后**静默丢精度** → 大整数用字符串承载。

</div>

<!--
JSON 数字很像 C 或 Java 的数字，但不用八进制和十六进制。

合法的是标准十进制，可带负号、小数、指数。非法写法是高频坑：007 因前导零非法；点五这种省略整数部分的非法，必须写零点五；0xFF 十六进制非法；显式正号 +1 非法；NaN 和 Infinity 无法用数字语法表示，明确禁止。

最重要的是精度。RFC 8259 明确，互操作性只保证 IEEE 754 双精度范围，安全整数区间是正负 2 的 53 次方减一。超过这个范围的裸整数，JSON.parse 之后会静默变成最接近的可表示值，精度丢失且不报错。所以订单号、雪花 ID 这类大整数，一定要用字符串承载传输，前端按字符串或 BigInt 处理。
-->

---

# 结构规则：克制的设计

<v-clicks>

- **无注释**：`//` `/* */` 都非法 → 要注释用 JSONC/JSON5
- **无尾逗号**：最后一个元素后不能跟逗号（与现代 JS 不同）
- **键必双引号字符串**，字符串必双引号（不接受单引号）
- **重复键** `SHOULD` 唯一但不强制；多数实现**保留最后一个**
- **编码**：跨系统 **MUST 用 UTF-8**；**MUST NOT** 加 BOM（U+FEFF）

</v-clicks>

<div v-click class="mt-3 text-sm">

> 这些克制让 JSON 成为无歧义的机器交换格式——代价是当配置文件不够顺手，催生了变体。

</div>

<!--
JSON 的结构规则处处体现克制。不支持任何注释，单行多行都非法，这是它作为机器交换格式的刻意设计。不允许尾逗号，这和现代 JS 允许尾逗号不同。键必须是双引号字符串，字符串值也必须双引号，单引号一律非法。

重复键方面，规范说键应当唯一，用的是 SHOULD 不是 MUST，不强制。出现重复时行为未定义，实践中多数实现保留最后一个，比如 JSON.parse 解析 a 出现两次会保留后一个值。生产中要避免依赖重复键，还可能被利用制造解析歧义。

编码上，RFC 8259 规定跨系统交换必须用 UTF-8，且禁止在开头添加 BOM 字节序标记，接收方可以选择忽略已有的 BOM。带 BOM 的 JSON 常导致严格解析器报错，是个隐蔽坑。
-->

---

# JSON ≠ JavaScript 对象字面量

```js
// ✅ 合法 JS 字面量，❌ 不是合法 JSON
const obj = { name: "Ada", 'city': 'London', score: .5, greet() {}, };
// ✅ 对应合法 JSON
{ "name": "Ada", "city": "London", "score": 0.5 }
```

| 维度 | JSON | JS 对象字面量 |
| --- | --- | --- |
| 键 / 字符串 | 只能双引号 | 无引号 / 单 / 双 / 反引号 |
| 尾逗号 / 注释 | ❌ | ✅ |
| 函数 / `undefined` / `NaN` | ❌ | ✅ |
| `.5` / `0xFF` / 前导零 | ❌ | ✅ |

<!--
这是最高频的混淆点。JSON 看起来像 JS 对象字面量，其实是它的受限子集。

上面这个 obj 是完全合法的 JS 字面量，但每一处都让它不是合法 JSON：name 键没加引号、city 用单引号、score 用了省略整数部分的点五、greet 是方法、结尾还有尾逗号。对应的合法 JSON 必须把键和字符串都改双引号、点五写成零点五、去掉函数和尾逗号。

表格总结四条核心差异：JSON 键和字符串只能双引号，JS 各种引号都行；JSON 无尾逗号无注释，JS 都支持；JSON 不接受函数、undefined、NaN，JS 都可以；JSON 数字不接受省略整数部分、十六进制、前导零。记住 JSON 是 JS 字面量的严格子集这句话就够了。
-->

---

# JSON.stringify：值 → 文本

```js
JSON.stringify(value, replacer?, space?)

JSON.stringify({ a: 1, b: 2 }, null, 2);       // 美化：每层缩进 2 空格
JSON.stringify(obj, ["id", "name"]);            // 数组 = 键白名单
JSON.stringify(obj, (k, v) =>                   // 函数 = 转换/脱敏
  k === "password" ? undefined : v);
```

<v-clicks>

- `space`：数字（≤10 空格）或缩进字符串
- `replacer` 数组 = 只保留列出的键；函数返回 `undefined` = 省略该属性
- `toJSON()` 钩子：值有此方法则先调用它（`Date` → ISO 字符串）

</v-clicks>

<!--
stringify 把 JS 值序列化成 JSON 文本，有三个参数。

第三参 space 控制美化缩进，传数字 N 就每层缩进 N 个空格，最多 10，也可以传字符串比如制表符。

第二参 replacer 有两种形态：传字符串数组是键白名单，只序列化列出的属性，其余忽略；传函数是对每个键值对做转换，返回 undefined 表示省略该属性，常用于脱敏，比如遇到 password 键就返回 undefined。注意函数首次调用时 key 是空字符串、value 是被包裹的整个对象。

还有一个 toJSON 钩子：如果被序列化的值有 toJSON 方法，stringify 会先调用它再序列化返回值。这就是 Date 变成 ISO 字符串的原因，自定义对象也能用它控制序列化形式。
-->

---

# stringify 坑①：值丢失的三张脸

`undefined` / 函数 / Symbol 的结果**取决于位置**：

```js
JSON.stringify({ a: undefined, b: () => {}, d: 1 }); // '{"d":1}'
JSON.stringify([1, undefined, () => {}, 4]);         // '[1,null,null,4]'
JSON.stringify(undefined);                            // undefined（值，非字符串）
```

| 位置 | 结果 |
| --- | --- |
| 对象属性值 | **忽略整个属性** |
| 数组元素 | 转成 **`null`** |
| 顶层值 | 返回**值 `undefined`** |

<!--
这是面试和实战的高频雷区。undefined、函数、Symbol 都不是 JSON 合法值，它们的处理取决于所处位置。

在对象属性里，整个属性被忽略，键值都不输出，所以第一个例子只剩 d。在数组元素里，转成 null 以保持索引和长度不变，所以第二个例子是 1、null、null、4。作为顶层值，stringify 返回的是值 undefined 本身，注意不是字符串 undefined。

这里有个连锁坑：如果你写 const s = JSON.stringify(可能是undefined的值)，s 可能是 undefined，直接拿去 writeFile 或 res.send 会写入字面的 undefined 甚至报错，序列化结果应该先判空。

记住这张表：对象里忽略、数组里转 null、顶层返回 undefined。
-->

---

# stringify 坑②：抛错与静默丢失

```js
JSON.stringify({ a: NaN, b: Infinity });   // '{"a":null,"b":null}' 静默
JSON.stringify({ big: 10n });              // TypeError：不支持 BigInt
const a = {}; a.self = a;
JSON.stringify(a);                          // TypeError：循环引用
JSON.stringify(new Date());                 // ISO 字符串（经 toJSON）
```

<v-clicks>

- `NaN`/`Infinity` → **静默转 `null`**（往返会丢）
- `BigInt` → 抛 `TypeError`，需先 `.toString()` 或用 replacer
- 循环引用 → 抛 `TypeError`，需去环 / `flatted`

</v-clicks>

<!--
继续 stringify 的坑，这一页是抛错和静默丢失两类。

NaN、Infinity、负 Infinity 不是合法 JSON 数值，会被静默转成 null，往返序列化会悄悄丢失这些值，排查数据怎么变成 null 时要想到这层。

BigInt 更直接，stringify 遇到 BigInt 抛 TypeError，提示不知道怎么序列化 BigInt。必须自己处理，转字符串或者用 replacer。

循环引用也抛 TypeError，提示 Converting circular structure to JSON，因为 JSON 是树结构无法表达环。解法是用 WeakSet 记录已访问引用去环，或者用支持循环的库比如 flatted。

Date 则是经 toJSON 变成 ISO 字符串，这个不抛错，但要注意它往返之后不会自动变回 Date。
-->

---

# JSON.parse 与大整数精度

```js
JSON.parse(text, reviver?)

JSON.parse('{"t":"2026-07-05T00:00:00Z"}', (k, v) =>
  k === "t" ? new Date(v) : v);              // reviver 手动还原 Date

JSON.parse('{"id": 9007199254740993}').id;   // 9007199254740992 已失真
```

<v-clicks>

- `reviver(key, value)` 自底向上转换；返回 `undefined` = **删除该属性**
- 严格解析：单引号 / 尾逗号 / 注释 → `SyntaxError`
- ⚠️ 大整数进 reviver 时**已是 number**，精度救不回 → `json-bigint` / `lossless-json` / reviver 的 `context.source`

</v-clicks>

<!--
parse 把 JSON 文本解析成 JS 值，第二参 reviver 是唯一的定制钩子，对每个键值对自底向上调用，返回值替换原值，返回 undefined 则删除该属性。它既能转换也能过滤，比如把日期字符串手动 new Date 还原，因为 JSON 没有日期类型，parse 默认只当普通字符串。

parse 是严格解析器，单引号、尾逗号、注释、无引号键都会抛 SyntaxError。永远不要用 eval 解析不可信数据，那等于开后门。

最关键的坑是大整数精度。注意 reviver 拿到的 value 已经是被解析成 number 之后的值，精度此时早就丢了，reviver 救不回来。正确方向是在文本层面接管数值：用 json-bigint 或 lossless-json 这类库，或者用较新引擎给 reviver 提供的 context.source 拿到原始文本片段。核心是必须在它变成 number 之前处理。
-->

---

# 变体家族：为什么需要

标准 JSON 做机器交换很好，做人写配置/流式就别扭：

| 变体 | 相对 JSON 增加 | 典型用途 |
| --- | --- | --- |
| **JSON5** | 注释、尾逗号、单引号、无引号键、十六进制 | 人写配置（Babel） |
| **JSONC** | 仅注释 + 尾逗号 | tsconfig、VS Code |
| **NDJSON** | 每行一个独立 JSON 值 | 日志、流式、大数据集 |

<div v-click class="mt-3 text-sm">

> ⚠️ 变体都**不能**直接喂标准 `JSON.parse`：JSON5 用 `JSON5.parse`，JSONC 用容注释解析器，NDJSON **按行**逐条解析。

</div>

<!--
标准 JSON 的克制对机器交换是优点，但两类场景就难受：一是人写配置想加注释、想宽松点，二是流式和超大数据集，一个几 GB 的大数组必须整体读入内存才能解析。于是生态长出了三个主要变体。

JSON5 是人写超集，加了注释、尾逗号、单引号、无引号键、十六进制等，适合需要大量注释的配置。JSONC 是 JSON with Comments，只加注释和尾逗号，比 JSON5 保守，是 tsconfig 和 VS Code 的格式。NDJSON 把结构反过来，每行一个独立 JSON 值，适合日志和流式。

一个共同注意点：这些变体都不能直接喂给标准 JSON.parse。JSON5 要用 JSON5.parse，JSONC 要用能容注释的解析器，NDJSON 必须按行逐条解析，整个文件不是合法 JSON。
-->

---

# JSON5：给人写的 JSON

```json5
{
  // 单行注释，也支持 /* 多行 */
  unquoted: 'ES5 标识符键，单引号字符串',
  trailingComma: [1, 2, 3,],
  hex: 0xdecaf,
  leadingPoint: .8675,
  notANumber: NaN,
}
```

<v-clicks>

- 面向**人写手改**，向 ES5 语法靠拢；扩展名 `.json5`
- `json5` npm 包：`JSON5.parse` / `JSON5.stringify`
- ⚠️ 仍**不支持**函数、循环引用——只放宽语法，不改数据模型

</v-clicks>

<!--
JSON5 是面向人类手写的 JSON 超集，语法向 ES5 靠拢。看这个例子：可以写单行和多行注释；对象键可以不加引号用 ES5 标识符，字符串可以用单引号；数组尾逗号 OK；数字支持十六进制 0xdecaf、前导小数点点八六七五、以及 Infinity 和 NaN。

它自带一个 JSON5 对象，来自 json5 npm 包，API 对齐原生，JSON5.parse 和 JSON5.stringify。扩展名是点 json5。

要强调它只放宽语法，不改数据模型：仍然不支持函数值和循环引用。典型用途是 Babel 配置这类需要大量注释的复杂配置文件。
-->

---

# JSONC：只多了注释的 JSON

```jsonc
{
  // tsconfig.json 官方按 JSONC 解析
  "compilerOptions": {
    "target": "ES2022",   // 可写注释
    "strict": true,       // 尾逗号也 OK
  }
}
```

<v-clicks>

- 微软 VS Code 生态**约定**（非正式规范）
- **只**额外允许：注释（`//` `/* */`）+ 尾逗号，比 JSON5 保守
- 用户：`tsconfig.json`、VS Code `settings.json`、`.vscode/*.json`

</v-clicks>

<div v-click class="mt-2 text-sm">

> 在 TS/VS Code 生态跟随约定用 JSONC；要更宽松（单引号/十六进制）才上 JSON5。

</div>

<!--
JSONC 是 JSON with Comments，微软在 VS Code 生态推广的约定，注意它是约定而非正式规范。

它在标准 JSON 上只额外允许两样：注释，包括单行和多行；以及尾逗号。就这两样，比 JSON5 保守得多，不放开单引号、无引号键、十六进制这些。

典型使用者是 tsconfig.json 和 jsconfig.json，官方就按 JSONC 解析，还有 VS Code 的 settings.json、keybindings.json、点 vscode 目录下的配置。

选型上：在 TypeScript 和 VS Code 生态里跟随约定用 JSONC；只有需要更宽松的手写体验，比如单引号、十六进制、多行字符串，才上 JSON5。两者都不是对外数据交换格式。
-->

---

# NDJSON / JSON Lines：按行流式

```jsonl
{"ts":"10:00:00","level":"info","msg":"started"}
{"ts":"10:00:01","level":"warn","msg":"slow query"}
{"ts":"10:00:02","level":"error","msg":"timeout"}
```

<v-clicks>

- **每行一个独立的合法 JSON 值**，`\n` 分隔，UTF-8、无 BOM
- 扩展名 `.jsonl`，MIME `application/jsonl`（待定）
- 逐行读、逐行解析，不必整体入内存 → 流式/可追加/契合 Unix 管道
- 用户：ES `_bulk`、大模型数据集、结构化日志

</v-clicks>

<div v-click class="mt-2 text-sm">

> ⚠️ 整个 `.jsonl` 文件**不是**合法 JSON，必须按行逐条 `JSON.parse`。

</div>

<!--
NDJSON，Newline-Delimited JSON，也叫 JSON Lines，把结构反过来：不是一个大数组，而是每行一个独立完整的 JSON 值，通常是对象。

规范三条：UTF-8 编码不加 BOM；每行是一个合法 JSON 值，空行非法；行用换行分隔，末尾换行推荐但可选。扩展名点 jsonl，MIME 是 application/jsonl，还在标准化中。

为什么好用：可以逐行读、逐行 parse，不必把整个文件读进内存，这是处理 GB 级数据集的关键；日志可以直接追加一行不用重写整个数组；天然契合 grep、jq、head 这些 Unix 管道工具。

典型用户是 Elasticsearch 的 bulk API、大模型训练微调数据集、结构化日志。

一个坑：整个 jsonl 文件作为整体不是合法 JSON，别用 JSON.parse 解析整个文件，必须按行逐条解析。
-->

---

# JSON Schema：给 JSON 做校验

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "name": { "type": "string", "minLength": 1 },
    "age": { "type": "integer", "minimum": 0 }
  },
  "required": ["name"]
}
```

<div v-click class="mt-2 text-sm">

> JSON 本身不描述结构，Schema 用一份 JSON 描述另一份 JSON 的约束。draft 演进：draft-04 → 06 → 07 → 2019-09 → **2020-12（当前）**；老项目仍多见 **draft-07**。

</div>

<!--
JSON 本身只描述数据、不描述结构。跨团队协作时字段是否必填、类型、取值范围全靠口头约定，极易出错。JSON Schema 就是用一份 JSON 文档，把这些约束写成机器可校验的规则。

看这个例子：$schema 声明用的是 2020-12 方言；type object 表示是对象；properties 里 name 必须是非空字符串、age 必须是非负整数；required 声明 name 必填。

它能校验数据、生成表单、驱动文档，OpenAPI 的 schema 部分就基于 JSON Schema。

版本演进顺序是 draft-04、06、07，然后 2019-09、2020-12。当前主推 2020-12，官网明确说 current version is 2020-12。但老项目仍然大量用 draft-07，它稳定、工具支持最广。用 $schema 声明方言避免校验器按错版本解释。
-->

---

# Schema 关键字与 Ajv

```js
// ⚠️ 默认 new Ajv() 是 draft-07，不识别 prefixItems
import Ajv2020 from "ajv/dist/2020";       // 2020-12 专用入口
const validate = new Ajv2020().compile(schema);
validate(data); // → boolean，失败看 validate.errors
```

<v-clicks>

- 类型 `type`/`enum`/`const`；对象 `properties`/`required`/`additionalProperties`
- 数组 `items`、**`prefixItems`（2020-12 元组，取代旧的 `items` 传数组）**
- 复用 `$defs`（2019-09 起取代 `definitions`）+ `$ref`
- Ajv 默认 draft-07；**2020-12 必须用 `ajv/dist/2020`**

</v-clicks>

<!--
Schema 关键字按分组记：类型有 type、enum、const；数值有 minimum、maximum、multipleOf；字符串有 minLength、maxLength、pattern、format；对象有 properties、required、additionalProperties；数组有 items、minItems、uniqueItems；组合有 allOf、anyOf、oneOf、not 和 if-then-else。

2020-12 最容易踩的破坏性变化是元组校验。draft-07 里元组是给 items 传数组，2020-12 改用 prefixItems 按位置逐个校验，此时 items 变成管剩余元素。迁移旧 schema 要改写这里。

复用方面，2019-09 起 $defs 取代了旧的 definitions 作为可复用子 schema 的标准容器，配合 $ref 引用。

用 Ajv 校验有个大坑：默认 new Ajv 针对 draft-07，不识别 prefixItems、$dynamicRef 这些新关键字。校验 2020-12 必须用专用入口 ajv 斜杠 dist 斜杠 2020 的 Ajv2020。format 断言还要额外装 ajv-formats。
-->

---

# 选型：JSON vs YAML vs TOML

| 维度 | JSON | YAML | TOML |
| --- | --- | --- | --- |
| 定位 | **数据交换** | 人写配置 | 扁平配置 |
| 注释 | ❌ | ✅ `#` | ✅ `#` |
| 与 JSON | — | **1.2 是 JSON 超集** | 独立 |
| 典型坑 | 大整数精度 | 缩进敏感、Norway 问题 | 深嵌套冗长 |
| 代表 | `package.json`、API | K8s、GH Actions | `Cargo.toml` |

<div v-click class="mt-3 text-sm">

> 对外传数据用 **JSON**；给人写配置优先 **YAML/TOML** 或 **JSONC/JSON5**；要校验叠 **JSON Schema**。

</div>

<!--
JSON、YAML、TOML 常被比较，但设计目标不同。JSON 面向机器间数据交换，语法严格无注释。YAML 面向人写配置，可读性优先。TOML 面向扁平配置，语义明确。

JSON 和 YAML 的关系很重要：YAML 1.2 在设计上是 JSON 的超集，几乎所有合法 JSON 都是合法 YAML。YAML 换来可读性的代价是缩进敏感、有 Norway 问题——country 冒号 no 里的 no 被隐式解析成布尔 false，version 1.10 可能变成 1.1，这类聪明的隐式类型是经典坑。YAML 常用于 CI 流水线、K8s 清单、GitHub Actions。

TOML 主打明显、最小、无歧义，用中括号 table 分节，是 Rust 的 Cargo.toml、Python 的 pyproject.toml 的标准格式，短板是深层嵌套变啰嗦。

选型一句话：对外传数据用 JSON；给人写配置优先 YAML 或 TOML，或者 JSONC、JSON5 补 JSON 的注释短板；要结构校验就叠 JSON Schema。
-->

---

# 真实工程场景

<v-clicks>

- **API 交换**：REST/GraphQL 请求响应体，`Content-Type: application/json`
- **配置文件**：`package.json`（纯 JSON）、`tsconfig.json`（JSONC）
- **前端存储**：localStorage 只能存字符串 → `stringify` 存 / `parse` 取
- **JWT**：Header 与 Payload 都是 JSON（Base64URL 编码）
- **日志/大数据**：NDJSON 结构化日志、大模型数据集、ES `_bulk`
- **契约**：OpenAPI schema 基于 JSON Schema，Ajv 守 API 边界

</v-clicks>

<!--
过一遍真实工程场景。

API 交换是最主要的：REST 和 GraphQL 的请求响应体几乎清一色 JSON，Content-Type 是 application/json，fetch 的 res.json 内部就是 JSON.parse。

配置文件：package.json 是纯 JSON 的项目清单，tsconfig.json、VS Code settings.json 是可注释的 JSONC，还有各种工具的 rc 配置。

前端存储：localStorage 和 sessionStorage 只能存字符串，所以 stringify 存、parse 取。

JWT：Header 和 Payload 都是 JSON，Base64URL 编码后拼接。

日志和大数据用 NDJSON：结构化日志、大模型数据集、Elasticsearch 的 bulk API。

契约方面：OpenAPI、Swagger 的接口契约，schema 部分基于 JSON Schema，可以用 Ajv 在 API 边界校验运行时数据，守住类型契约。JSON Schema 校验运行时、TypeScript 类型管编译期，两者互补。
-->

---

# 易错点 Top 8

<v-clicks>

- 键/字符串用单引号、写尾逗号、加注释 → `SyntaxError`
- 大整数（>2^53−1）裸传 → `parse` 静默丢精度，用字符串承载
- `stringify` 里 `undefined`/函数：对象忽略、数组转 `null`、顶层返回 `undefined`
- `NaN`/`Infinity` 静默转 `null`；`BigInt` 直接抛 `TypeError`
- 循环引用 → `TypeError`；`Date` 往返退化成字符串
- 带 BOM 的 JSON 让严格解析器报错
- 变体不能喂标准 `JSON.parse`；NDJSON 要按行解析
- Ajv 默认 draft-07，校验 2020-12 要用 `ajv/dist/2020`

</v-clicks>

<!--
把最高频的坑集中过一遍。

第一，语法层面单引号、尾逗号、注释都会让 JSON.parse 抛 SyntaxError。第二，大整数超过 2 的 53 次方减一裸传会在 parse 阶段静默丢精度，必须用字符串承载。第三，stringify 里 undefined 和函数的行为取决于位置：对象属性忽略、数组元素转 null、顶层返回值 undefined。

第四，NaN 和 Infinity 静默转 null，BigInt 直接抛 TypeError。第五，循环引用抛 TypeError，Date 往返之后退化成字符串不会自动还原。第六，带 BOM 的 JSON 会让严格解析器报错。

第七，JSON5、JSONC、NDJSON 这些变体不能直接喂标准 JSON.parse，NDJSON 尤其要按行逐条解析。第八，用 Ajv 校验 JSON Schema，默认入口是 draft-07，校验 2020-12 必须用 ajv dist 2020 的专用入口。
-->

---
layout: intro
---

# 总结

JSON = **语言无关、心智极简的数据交换格式**

- 六种值：对象/数组/字符串/数值/布尔/`null`；键必双引号、无注释无尾逗号
- 规范：RFC 8259 + ECMA-404，语法极稳定；编码强制 UTF-8
- API：`parse`/`stringify` 两把钥匙，坑在 `undefined`/循环/大整数/`BigInt`/`Date`
- 变体：JSON5（人写）/ JSONC（tsconfig）/ NDJSON（流式）
- 校验：JSON Schema 2020-12（Ajv），是 API 契约的基石

<!--
总结一下。JSON 是一种语言无关、心智极简的数据交换格式。

核心心智：六种值——对象、数组、字符串、数值、布尔、null，键必须双引号，无注释无尾逗号。规范由 RFC 8259 和 ECMA-404 共同定义，语法极其稳定，编码强制 UTF-8 且禁止 BOM。

在 JS 里 parse 和 stringify 是两把钥匙，覆盖日常需求，但坑集中在 undefined 和函数的丢失、循环引用抛错、大整数精度、BigInt 抛错、Date 往返退化这几处。

当 JSON 不够用时，生态有变体补位：JSON5 给人手写、JSONC 是 tsconfig 和 VS Code 的格式、NDJSON 做流式和大数据。要给 JSON 加结构校验就用 JSON Schema，当前 draft 2020-12，配合 Ajv，它是 API 契约的基石。

JSON 用极简的六种值，撑起了整个互联网的 API 和配置世界。谢谢大家。
-->
