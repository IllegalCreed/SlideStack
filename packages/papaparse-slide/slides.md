---
theme: seriph
background: https://cover.sli.dev
title: PapaParse
info: |
  Presentation PapaParse — the powerful, in-browser CSV parser.

  Learn more at [https://www.papaparse.com/docs](https://www.papaparse.com/docs)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📊</span>
</div>

<br/>

## PapaParse

浏览器中最快、最可靠的 CSV 解析器。核心就两个方法：`Papa.parse`（CSV→JS）与 `Papa.unparse`（JS→CSV）。引号、转义、跨行字段全部正确处理，自带流式与 Web Worker

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/mholt/PapaParse" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 PapaParse,浏览器里最快、最可靠的 CSV 解析器。

它的核心非常小,就两个方法:Papa.parse 把 CSV 解析成 JS 数据,Papa.unparse 把 JS 数据反解析回 CSV。它的真正价值在于「正确」——CSV 不是按逗号切那么简单,引号字段内可以含逗号、换行,引号还要双写转义,PapaParse 用一套完整状态机正确处理这些边界,再叠加自动分隔符探测、流式解析、Web Worker,让大文件在浏览器里也不卡 UI、不爆内存。

主线:为什么不能手撕 → 两个核心方法 → header 与类型 → 同步还是异步 → 流式 step/chunk → Web Worker → 远程下载 → 错误处理 → unparse 与安全 → 边界 → Node → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么不能手撕 CSV

<v-clicks>

- 引号字段内含逗号：`"Hello, World"` 是一列
- 引号字段内含换行：多行地址、备注
- 引号双写转义：`""` 表示一个字面引号

</v-clicks>

<div v-click class="mt-6">

```ts
'"Hello, World",foo'.split(",");
// ❌ ['"Hello', ' World"', 'foo']  切成三列

Papa.parse('"Hello, World",foo').data[0];
// ✅ ["Hello, World", "foo"]       两列
```

</div>

<!--
为什么要用 PapaParse,而不是自己 split 逗号?因为 CSV 是有正式规则的格式,有三条边界让简单 split 必然出错。

第一,引号包裹的字段内部可以含逗号,比如引号里的 Hello 逗号 World,整体是一列。第二,引号字段内部可以含换行,比如多行的地址、备注,是一个字段跨多行。第三,引号本身用双写转义,两个连续双引号表示一个字面引号。

看代码:对带引号逗号的字符串 split 逗号,会被错误切成三列;而 Papa.parse 正确识别为两列。结论很简单——永远用解析器,别手撕。PapaParse 内部是状态机,这些边界都处理得对。
-->

---

# 两个核心方法

```ts
import Papa from "papaparse";

// CSV → JS
const r = Papa.parse(csvString);
// { data, errors, meta }

// JS → CSV
const csv = Papa.unparse([
  { name: "Ada", age: 30 },
  { name: "Bob", age: 25 },
]);
// "name,age\r\nAda,30\r\nBob,25"
```

<div v-click class="mt-2 text-sm">

> `parse` 的 input 可为:字符串 / File / URL(download) / Node 流。`unparse` 接受:数组的数组 / 对象数组 / `{fields, data}`。

</div>

<!--
PapaParse 的 API 极简,核心就两个方法。

Papa.parse 把 CSV 解析成 JS 数据,返回一个对象,含三个字段:data 是行数据、errors 是错误数组、meta 是元信息。Papa.unparse 反方向,把 JS 数据反解析回 CSV 字符串,这里把对象数组转成 CSV,默认带表头、默认 CRLF 换行。

输入形态要记住:parse 的第一个参数可以是字符串、浏览器的 File 对象、URL 配 download、或 Node 的可读流;unparse 接受数组的数组、对象数组、或 fields 加 data 的对象。两个方法、几种形态,就覆盖了绝大多数 CSV 读写需求。
-->

---

# ParseResult：三件套

```ts
const r = Papa.parse(csv, { header: true });
```

<v-clicks>

- **`data`**：行数据。`header:false` → 数组的数组；`header:true` → 对象数组
- **`errors`**：错误数组（容错收集，**不抛异常中断**）
- **`meta`**：`delimiter` / `linebreak` / `aborted` / `truncated` / `cursor` / `fields`

</v-clicks>

<div v-click class="mt-4 text-sm">

> 「有 errors」≠「失败」。应主动检查 `r.errors.length` 来处理脏数据。

</div>

<!--
解析返回的 ParseResult 是三件套。

data 是行数据,形态取决于 header:不开 header,每行是数组,整个 data 是数组的数组;开了 header,每行是对象,data 是对象数组。errors 是错误数组,这里有个关键设计:PapaParse 是容错的,遇到问题把错误收进 errors,而不是抛异常中断。meta 是元信息,包含实际用的分隔符、换行符、是否被中止、是否被截断、读到的字符位置,以及开 header 时的字段列表。

最该记住的一句:有 errors 不等于失败。因为它容错,所以你必须主动检查 errors 的长度来决定怎么处理脏数据,不能假设没抛异常就万事大吉。
-->

---

# header 与类型转换

```ts
// 首行作字段名 → 每行变对象
Papa.parse(csv, { header: true });
// [{ name: "Ada", age: "30" }]   age 仍是字符串

// 自动转类型
Papa.parse(csv, { header: true, dynamicTyping: true });
// [{ name: "Ada", age: 30 }]     age 变 number
```

<div v-click class="mt-3 text-sm">

⚠️ `dynamicTyping`：**不转日期**；超 ±2^53 不转；`007` 会变 `7`（前导零丢失）

</div>

<!--
两个最常用的解析选项。

header true,让首行作字段名,每行解析成对象。但注意,默认即使开了 header,值仍然是字符串,age 是字符串的 30。

要把数字、布尔转成真正的类型,加 dynamicTyping true,这时 age 就是数字 30 了。

但 dynamicTyping 有三个坑,要记牢:第一,它不转日期,日期还是字符串,要 Date 得自己转;第二,超出正负 2 的 53 次方的数,为了保精度不转;第三,也是最容易踩的,像 007 这种前导零有意义的标识符,比如订单号、邮编,会被转成数字 7,前导零丢了,数据就坏了。所以这类列要排除,后面讲怎么按列控制。
-->

---

# 同步还是异步？一条规则

```ts
// ✅ 同步：字符串 + 非流式 → 用返回值
const r = Papa.parse(csvString, { header: true });

// ⏳ 异步：File / URL / worker / step → 走回调
Papa.parse(file, { complete: (res) => use(res.data) });
```

<v-clicks>

- 字符串 + 非流式（无 step/worker）= **同步返回值**
- File / download / worker / 流式 = **异步回调**
- `Papa.parse` **不返回 Promise**

</v-clicks>

<!--
PapaParse 一个容易困惑的点:什么时候同步、什么时候异步?其实一条规则就够。

如果你传的是字符串,而且没开 step 或 worker 这类流式,那它同步返回结果对象,直接用返回值。一旦输入变成 File 对象、URL 下载、开了 worker、或者用 step 流式,结果就异步提供给回调,比如 complete,这时 parse 不返回有意义的值。

简记就是:字符串加非流式等于同步返回值,其余都走异步回调。还有一点要强调,Papa.parse 不返回 Promise,它要么同步返回值,要么走回调,别用 await 它。
-->

---

# 流式 step：大文件不爆内存

```ts
let count = 0;
Papa.parse(hugeFile, {
  header: true,
  step: (results, parser) => {
    handleRow(results.data); // 当前「这一行」，不是全部
    if (++count >= 1e5) parser.abort(); // 满足条件提前停
  },
  complete: () => console.log(count, "行"),
});
```

<div v-click class="mt-2 text-sm">

> 非流式内存 ≈ 整个数据集（O(n)，可能 OOM）；`step` 内存 ≈ 单行（O(1)）。

</div>

<!--
处理几百兆、几百万行的大文件,如果一次性堆进 data,内存峰值约等于整个数据集,随行数线性增长,浏览器可能直接崩。解法是流式。

用 step 回调,每解析出一行就调用一次,你在回调里即时处理,处理完就能丢。注意 step 模式下,results.data 是当前这一行,不是累积的全部,header false 时是数组,header true 时是对象。第二个参数 parser 提供控制:abort 立即停止,这里满足条件就提前 abort,省时省内存。

底下这句是核心:非流式内存约等于整个数据集,是 O(n),大文件会 OOM;step 流式内存约等于单行,是 O(1)。这就是大文件必须用 step 的根本原因。
-->

---

# 流式 chunk 与 abort/pause

```ts
Papa.parse(url, {
  download: true,
  chunk: (results, parser) => bulkInsert(results.data), // 一块一批
  complete: () => console.log("done"),
});
```

<v-clicks>

- `step` 逐行；`chunk` 逐块（批量处理更高效）
- `parser.abort()` 立即停止（不可恢复）
- `parser.pause()` / `resume()` 暂停恢复（**非 Worker 时**）

</v-clicks>

<!--
除了逐行的 step,还有逐块的 chunk。chunk 每解析完一块数据回调一次,适合批量处理,比如一次往数据库插一批,比逐行插效率高得多。这里配 download 拉远程,边下边处理。

parser 提供三个控制方法。abort 立即停止整个解析,不可恢复,会触发 complete 且 meta.aborted 为真。pause 暂停、resume 恢复,这一对是可恢复的,适合解析时要等待异步操作的场景。

但有个重要限制:pause 和 resume 只在非 Worker 模式下可用。下一页讲 Worker 时会解释为什么。
-->

---

# Web Worker：不卡 UI

```ts
if (Papa.WORKERS_SUPPORTED) {
  Papa.parse(largeFile, {
    worker: true,
    header: true,
    step: (results) => updateUI(results.data),
    complete: () => console.log("done"),
  });
}
```

<div v-click class="mt-3 text-sm">

价值：解析放后台线程，页面不卡 ｜ 代价：通信开销可能略慢 ｜ 限制：**无 pause/resume**

</div>

<!--
解析大文件会占满主线程,页面卡顿、滚动卡死。worker true 把解析放到独立的 Web Worker 线程,主线程空出来,页面滚动、动画照常。可以先用 Papa.WORKERS_SUPPORTED 检测环境是否支持。

这里要把取舍讲清楚。价值是不阻塞主线程、不卡 UI,这是它唯一也是最大的卖点。代价是跨线程要用 postMessage 通信,有开销,所以单个解析任务可能比主线程还略慢一点——它不是用来提速的,是用来不卡 UI 的。

限制就是上一页说的:Worker 模式下 pause 和 resume 不可用。因为解析跑在独立线程、和主线程异步通信,没法像同线程那样精确暂停、从断点恢复中间状态。abort 还能用。需要暂停恢复的场景,就别开 worker。
-->

---

# 远程下载：download

```ts
Papa.parse("https://example.com/data.csv", {
  download: true,
  header: true,
  complete: (res) => console.log(res.data),
});

// 带鉴权头 / POST
Papa.parse(url, {
  download: true,
  downloadRequestHeaders: { Authorization: "Bearer xxx" },
  downloadRequestBody: JSON.stringify({ filter: "active" }), // 设了即 POST
});
```

<!--
拉取远程 CSV。当第一个参数是 URL 字符串时,必须加 download true,PapaParse 才会把它当下载地址,发起 XMLHttpRequest 拉取并解析,结果异步走回调。

还能定制请求。downloadRequestHeaders 加自定义请求头,比如带 Authorization 做鉴权。downloadRequestBody 设了请求体,就会自动改用 POST 而不是 GET。另外还有 withCredentials 控制跨域带 cookie。

提醒一点:download 是浏览器端拉 URL,不会读本地文件路径。Node 端读本地文件要用 fs 的可读流,后面会讲。远程大文件同样可以配 chunk 边下边处理。
-->

---

# unparse 与安全

```ts
// 默认带表头、CRLF；含逗号/引号/换行的字段自动加引号转义
Papa.unparse(records);

// 指定列与顺序
Papa.unparse(records, { columns: ["id", "name", "email"] });

// 防 CSV 公式注入（导出用户数据必开）
Papa.unparse(userData, { escapeFormulae: true });
// =SUM(A1) → '=SUM(A1)  前面加 ' 变纯文本
```

<!--
反解析 unparse 也有几个要点。

默认行为:header true 带表头、换行 CRLF。注意 quotes 默认 false 是「非必要不加引号」,但含逗号、引号、换行的字段仍会自动加引号并转义,保证能被正确解析回来,不会破坏 CSV 结构。

columns 选项,对对象数组反解析时,显式指定输出哪些列、什么顺序,缺键的列输出空、保证表头一致。

最后是安全,很重要。导出的 CSV 被 Excel 或 Google Sheets 打开时,以等号、加号、减号、at 符开头的单元格会被当公式执行,攻击者可注入恶意公式,这叫 CSV 注入或公式注入。任何把用户可控数据导出成 CSV 的场景,务必开 escapeFormulae true,它会在这类单元格前加单引号,变成纯文本,挡住攻击。
-->

---

# 自动探测、TSV 与重复列

```ts
// delimiter 留空 → 自动探测（逗号/制表符/竖线/分号）
Papa.parse(tsvText);                      // 多数 TSV 能识别
Papa.parse(tsvText, { delimiter: "\t" }); // 最稳妥

// 重复列名 → 自动重命名，映射记入 meta.renamedHeaders
// 多余字段 → 进 __parsed_extra，并报 TooManyFields
```

<div v-click class="mt-3 text-sm">

> `result.meta.delimiter` 可确认实际用了哪个分隔符——调试利器。

</div>

<!--
几个实用边界。

分隔符:delimiter 留空时自动探测,制表符、竖线、分号都在默认候选列表里,所以 TSV 不用配也能读;要无歧义就显式写 delimiter 制表符,最稳妥。千万别先把制表符替换成逗号再解析,那会破坏字段内本就含逗号的数据。

表头边界:如果 CSV 出现两个同名列,PapaParse 会自动重命名,避免后者覆盖前者,改名映射记在 meta.renamedHeaders。如果某行字段数多于表头,多出的值进这一行对象的 __parsed_extra 数组,同时报一条 TooManyFields 错误,而不是丢弃。

调试技巧:解析后看 meta.delimiter,能确认它实际用了哪个分隔符,排查「分隔符猜错了」非常有用。
-->

---

# dynamicTyping 按列控制

```ts
// 对象形式：按列名/索引精确指定
Papa.parse(csv, {
  header: true,
  dynamicTyping: {
    amount: true,    // 转数字
    zipcode: false,  // 保字符串（前导零不丢）
    orderId: false,
  },
});

// 函数形式：动态决定
Papa.parse(csv, { header: true, dynamicTyping: (col) => col !== "zipcode" });
```

<!--
回到 dynamicTyping 的前导零坑,怎么解决?它其实不只接受 true 和 false,还能传对象或函数,做按列精细控制。

对象形式:按列名或列索引精确指定哪些列转、哪些不转。比如金额 amount 转数字,邮编 zipcode 保持字符串、前导零就不丢了,订单号 orderId 也保字符串。

函数形式:传一个函数,接收列名或索引,返回布尔,动态决定每列是否转型。这里让除了 zipcode 之外的列都转。

这就是处理「金额数量要转数字、邮编订单号要保字符串」这种混合列的标准手段。只要数据里有前导零标识符,就别无脑开 dynamicTyping true,用对象或函数把它们排除。
-->

---

# 边界：PapaParse 不读 Excel

<v-clicks>

- `.xlsx` 是 **ZIP + XML 二进制**（OOXML），不是纯文本 CSV
- 直接喂给 PapaParse → 乱码

</v-clicks>

<div v-click class="mt-4">

正确路线：

- 让用户在 Excel 里**另存为 CSV** 再上传
- 或用 **SheetJS(xlsx)** 读 `.xlsx`，必要时转 CSV 再交给 PapaParse

</div>

<!--
一个常见误用,必须讲清楚边界。

有人想直接用 PapaParse 解析用户上传的 xlsx Excel 文件。这行不通。xlsx 是 ZIP 压缩的 XML,是 OOXML 二进制格式,不是纯文本 CSV。把 xlsx 直接喂给 PapaParse,只会得到乱码或错误,也没有什么 excel true 选项能救。

正确路线有两条:第一,让用户在 Excel 里另存为 CSV,再上传,最简单。第二,用 SheetJS 这个专门的库读 xlsx,必要时再用它转成 CSV 交给 PapaParse,如果你想统一走 CSV 管线。

记牢这条边界:PapaParse 只做 CSV 和分隔符文本,它不是万能数据层。该用 SheetJS 的时候就用 SheetJS。
-->

---

# Node.js：流式 pipe

```ts
import Papa from "papaparse";
import fs from "node:fs";

// NODE_STREAM_INPUT 返回 Duplex 流，可 .pipe()
const parseStream = Papa.parse(Papa.NODE_STREAM_INPUT, { header: true });
fs.createReadStream("data.csv")
  .pipe(parseStream)
  .on("data", (row) => console.log(row))
  .on("end", () => console.log("done"));

// 或直接把可读流当 input
Papa.parse(fs.createReadStream("big.csv"), { step: (r) => use(r.data) });
```

<!--
PapaParse 是同构的,Node 端也能用,虽然没有 File 和 Web Worker,但支持流。

两种用法。第一种,把 Papa.NODE_STREAM_INPUT 这个哨兵值作为第一个参数传进去,它会返回一个 Duplex 流,既可读又可写,于是你能用 fs 的可读流 pipe 接进来,再 on data 消费每一行、on end 收尾。这种最适合接进 Node 的流式管线。

第二种更直接,把 fs.createReadStream 创建的可读流直接当 input 传给 parse,配 step 或 complete 回调。

再强调一次那个误区:download true 是浏览器端拉 URL,不读本地文件路径。Node 读本地文件,就用这两种基于 fs 可读流的方式。
-->

---

# 大文件「三件套」

```ts
let n = 0;
Papa.parse(hugeFile, {
  header: true,
  worker: true,                       // 不卡 UI
  step: (results) => {
    handleRow(results.data);          // 不爆内存
    if (++n % 1000 === 0) update(n);  // 实时进度
  },
  complete: () => done(n),
});
```

<div v-click class="mt-2 text-sm">

不爆内存 → `step`/`chunk` ｜ 不卡 UI → `worker` ｜ 进度 → 回调里累加 / `meta.cursor`

</div>

<!--
把前面的招式合起来,做一个超大 CSV 上传功能,要同时满足三个目标:不卡 UI、不爆内存、实时进度条。三个手段叠加正好对应。

不爆内存,靠 step 或 chunk 流式,每行处理完即丢,不保留全部。不卡 UI,靠 worker true,解析放后台线程。实时进度,在 step 回调里累加已处理行数,每隔一定数量更新一次进度条,也可以借 meta.cursor 估算百分比。

代码里三者齐全:worker 开着、step 流式处理每行、每一千行更新一次进度、最后 complete 收尾。注意 worker 下没有 pause resume,但 abort 还能用,需要中止时仍可调。这套组合就是浏览器里啃大 CSV 的标准最佳实践。
-->

---
layout: intro
---

# 总结

PapaParse = **浏览器里最快、最可靠的 CSV 解析器**

- 核心两方法：`parse`（CSV→JS）/ `unparse`（JS→CSV）
- 正确：引号内逗号/换行、双写转义全处理，别手撕
- `header` 变对象；`dynamicTyping` 转类型（防前导零坑）
- 同步：字符串+非流式；其余走异步回调
- 大文件：`step`/`chunk` 省内存 + `worker` 不卡 UI
- 安全：`escapeFormulae` 防 CSV 公式注入
- 边界：**只做 CSV**，xlsx 找 SheetJS

<!--
总结一下。

PapaParse 是浏览器里最快、最可靠的 CSV 解析器。核心就两个方法:parse 把 CSV 转 JS、unparse 把 JS 转 CSV。

它的价值是正确:引号字段内的逗号、换行、双写引号转义全都处理对,所以永远别自己 split 手撕。常用选项:header 让每行变对象,dynamicTyping 自动转类型,但要小心前导零标识符被转坏,用对象或函数按列排除。

同步异步记一条:字符串加非流式同步返回,其余走异步回调,它不返回 Promise。大文件靠 step 或 chunk 流式把内存降到常数级,再加 worker 不卡 UI,配进度回调就是三件套最佳实践。安全上导出用户数据务必开 escapeFormulae 防公式注入。

最后是边界:它只做 CSV,读 Excel 的 xlsx 要用 SheetJS。把这些记牢,CSV 读写就稳了。谢谢大家。
-->
