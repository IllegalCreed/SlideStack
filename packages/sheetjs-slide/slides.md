---
theme: seriph
background: https://cover.sli.dev
title: SheetJS — 读写电子表格
info: |
  Presentation SheetJS (xlsx) — 用统一 JS API 读写多种电子表格格式。

  Learn more at [https://docs.sheetjs.com/](https://docs.sheetjs.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📊</span>
</div>

<br/>

## SheetJS — 读写电子表格

npm 包名 `xlsx`：一套统一 JS API 读写 xlsx / xls / xlsb / csv / ods 等十多种格式，浏览器与 Node 通用。格式最广、解析最强

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/SheetJS/sheetjs" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 SheetJS，社区版的 npm 包名叫 xlsx。它的官方定位是「unified interface to every Excel file format」——用一套统一的 JS API 抹平各种电子表格格式的差异，并且 runs everywhere，浏览器、Node、桌面移动 App 都能跑。

它最核心的卖点是三条：格式覆盖最广、解析能力最强、环境无关。

主线安排：为什么用它 → 安装的坑 → 数据模型 → 读 → 写 → 转换 → 单元格对象 → 选项 → 大文件 → 与 ExcelJS 取舍 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用它

<v-clicks>

- 要解析的表格格式五花八门：xls / xlsb / csv / ods
- 旧文件来源杂乱，解析容易出错
- 浏览器和 Node 想用同一套读写逻辑
- 导出 Excel 给用户下载

</v-clicks>

<div v-click class="mt-6">

SheetJS 的回应：

- **统一 CSF 模型** → 各格式同一套数据结构
- **解析强、容错好** → 抽数据是最强场景
- **环境无关** → 浏览器 + Node 同一 API
- **`writeFile`** → 浏览器一行触发下载

</div>

<!--
为什么需要 SheetJS？几个常见场景。

要解析的表格格式五花八门，老的 xls、二进制 xlsb、纯文本 csv、开源的 ods，各家格式都不一样。这些文件来源还很杂，手写解析极易出错。前端要让用户上传表格读数据、又要导出 Excel 下载；服务端也要生成表格。

SheetJS 的回应：把所有格式都解析成统一的 Common Spreadsheet Format，一套数据结构走天下；解析能力强、容错好，读各种乱来源的表格抽数据是它最强的场景；浏览器和 Node 用同一套 API；导出时一个 writeFile 就能在浏览器触发下载。这四点是今天的主线。
-->

---

# ⚠️ 第一个坑：从哪里安装

```bash
# ❌ 装到的是 npm 上滞后的 0.18.5
npm i xlsx

# ✅ 官方推荐：从 CDN 的 tarball URL 装最新版
npm rm --save xlsx
npm i --save https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
```

<v-clicks>

- npm registry 上的 `xlsx` 长期停在 **0.18.5**（官方称 known registry bug）
- **authoritative source 是 `cdn.sheetjs.com`**，最新版只在 CDN 发布
- 浏览器可 `<script src="…/xlsx.full.min.js">`（挂全局 `XLSX`）

</v-clicks>

<!--
开篇先讲最高频的坑：从哪里安装。

很多人习惯性地 npm i xlsx，结果装到的是 npm registry 上的 0.18.5——这是个长期滞后的旧版，官方明确说是 known registry bug。

正确做法是官方推荐的：先 npm rm --save xlsx 移除旧的，再从 CDN 的 tarball URL 安装最新版，也就是 cdn.sheetjs.com 这个域名下的 .tgz。pnpm、yarn 同理替换前缀。

authoritative source，也就是权威来源，是 cdn.sheetjs.com，最新版只在那里发布。浏览器里也可以直接用 script 标签引入 xlsx.full.min.js，引入后挂在全局变量 XLSX 上。这条坑记牢，能省掉无数「为什么我的 API 不存在」的困惑。
-->

---

# 数据模型：CSF 三层结构

```text
Workbook 工作簿
├── SheetNames: ['Sheet1', 'Sheet2']   有序工作表名
├── Sheets: { Sheet1: {…}, … }         名 → 工作表
└── Props: { Title, Author }           文档属性

Worksheet 工作表
├── 'A1': { t:'s', v:'姓名' }          A1 地址作键的单元格
├── '!ref': 'A1:B3'                    有效范围
└── '!cols' / '!merges'               列宽 / 合并
```

<div v-click class="mt-2 text-sm">

> 取表：`wb.Sheets[wb.SheetNames[0]]`——`Sheets` 以**名字**作键，不能 `Sheets[0]`。

</div>

<!--
理解 SheetJS 的关键是它的数据模型，叫 Common Spreadsheet Format，简称 CSF，所有格式都被解析成它。

三层结构。最外层是 Workbook 工作簿，它有 SheetNames，一个有序的工作表名数组；有 Sheets，名字到工作表对象的映射；还有 Props，文档属性比如标题作者。

中间层是 Worksheet 工作表，它默认以 A1 风格地址作键，直接把单元格对象挂上去，比如 ws 中括号 A1。还有以叹号开头的特殊键，!ref 标记有效范围，!cols 管列宽，!merges 管合并。

最里层是单元格对象，下一页讲。

这里有个新手必踩的点：取第一个工作表要写 wb.Sheets 中括号 wb.SheetNames 中括号 0，因为 Sheets 是以名字作键的，不能直接 Sheets 中括号 0。
-->

---

# 读：浏览器 vs Node

```ts
import * as XLSX from 'xlsx'

// Node：直接读磁盘
const wb = XLSX.readFile('data.xlsx')

// 浏览器：先把 File 转二进制，再解析
const wb2 = XLSX.read(await file.arrayBuffer(), { type: 'array' })

// 拿数据：取表 → 转对象数组
const ws = wb.Sheets[wb.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(ws)
```

<div v-click class="mt-2 text-sm">

> `readFile` 仅 Node（按路径读盘）；浏览器用 `read` + `type:'array'`（ArrayBuffer）。

</div>

<!--
读取，分浏览器和 Node 两条路。

Node 有文件系统，直接 XLSX.readFile 传路径，从磁盘读，返回 workbook。

浏览器没有文件系统，要先把 input 选到的 File 对象转成二进制——现代写法是 await file.arrayBuffer 拿到 ArrayBuffer，再交给 XLSX.read，并用 type 冒号 array 声明输入是字节数组。

不管哪条路，拿到 workbook 后取数据的姿势一样：先 wb.Sheets 取第一个工作表，再用 utils.sheet_to_json 转成对象数组，默认首行作为各列的键。

记住区别：readFile 仅 Node 可用、参数是磁盘路径；浏览器一律用 read 加 type array。把 File 直接丢给 read 是不行的，必须先取出二进制。
-->

---

# 读：拉取远程表格

```ts
// xlsx 是二进制 ZIP，必须取 arrayBuffer（不能 text）
const buf = await (await fetch(url)).arrayBuffer()
const wb = XLSX.read(buf, { type: 'array' })
```

<v-clicks>

- ✅ `response.arrayBuffer()` + `type: 'array'`
- ❌ `response.text()` → 会破坏二进制内容
- ❌ `response.json()` → xlsx 不是 JSON

</v-clicks>

<!--
浏览器里还常需要拉取远程表格。关键点：xlsx 本质是个二进制 ZIP 容器，所以 fetch 回来后必须取 response.arrayBuffer，得到 ArrayBuffer，再用 type array 解析。

千万别用 response.text，那会按文本编码解码，把二进制内容破坏掉——只有 CSV 这种纯文本格式才能用 text。也别用 response.json，xlsx 不是 JSON，会直接解析失败。

记住一句话：二进制格式取 arrayBuffer，纯文本格式才取 text。
-->

---

# 写：标准三步

```ts
const rows = [{ 姓名: '张三', 年龄: 20 }]

// 1. 数据 → 工作表
const ws = XLSX.utils.json_to_sheet(rows)

// 2. 建簿 + 加表（名 ≤31 字符且唯一）
const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, ws, '名单')

// 3. 落地：Node 写盘 / 浏览器下载
XLSX.writeFile(wb, 'out.xlsx')
```

<div v-click class="mt-2 text-sm">

> 只导出 xlsx 时用 `writeFileXLSX`，可摇掉其它格式写出代码，减小包体积。

</div>

<!--
写出，标准三步。

第一步，把数据转成工作表：对象数组用 json_to_sheet，键会自动作表头；二维数组用 aoa_to_sheet。

第二步，建一个空工作簿 book_new，再用 book_append_sheet 把工作表加进去，第三参是工作表名。注意 Excel 限制：工作表名最长 31 个字符，而且同一簿内必须唯一，默认重名会报错。

第三步，落地。writeFile 会按文件名后缀推断格式：Node 下写磁盘，浏览器下触发下载，一行搞定。

一个优化：如果应用只需要导出 xlsx，用 writeFileXLSX 这个专用变体，打包器能摇掉 csv、ods 等其它格式的写出代码，显著减小生产包体积。
-->

---

# 写：浏览器下载的真相

```ts
XLSX.writeFile(wb, 'report.xlsx', { compression: true })
```

等价于内部做了这些：

```ts
const u8 = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })
const blob = new Blob([u8])
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.download = 'report.xlsx'; a.href = url
document.body.appendChild(a); a.click(); a.remove()
```

<!--
浏览器里 writeFile 是怎么「下载」的？它没有魔法，内部就是这套标准前端套路。

先用 XLSX.write 生成字节，包成一个 Blob，用 URL.createObjectURL 得到一个对象 URL，然后创建一个 a 元素，设上 download 属性和 href，加到页面、click 触发下载、再移除。

知道这套等价代码有两个好处：一是理解 writeFile 在浏览器到底干了什么，二是当你需要更精细的控制——比如自定义下载时机、上传而非下载——你可以改用 write 拿字节自己处理。

顺带：compression 冒号 true 会对 xlsx 启用 ZIP 压缩，默认是不压缩的存储模式，大表开了能明显减小体积。
-->

---

# write vs writeFile

| 维度 | `write` | `writeFile` |
|---|---|---|
| 返回 | 文件数据（字节/串） | 无（直接落地） |
| 落地 | 自己处理 | 下载 / 写盘 |
| 格式 | 必须显式 `bookType`+`type` | 可按后缀推断 |
| 场景 | 服务端响应体、上传 | 直接导出 |

```ts
// 服务端：拿 Buffer 作为响应体
const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })
res.send(buf)
```

<!--
write 和 writeFile 的区别，是常考点。

writeFile 是「生成加落地」一体：浏览器下载、Node 写盘，还能按文件名后缀自动推断格式，开箱即用。

write 只返回文件数据，字节或字符串，不落地，而且必须显式给 bookType 和 type。它的用途是：你需要拿到原始字节去对接平台 API，比如服务端把它作为 HTTP 响应体返回、或者上传到对象存储。

下面这段就是服务端最典型的用法：write 加 type buffer 拿到 Node Buffer，配好 Content-Type 和 Content-Disposition 响应头，res.send 直接发给客户端，全程不落地磁盘。注意要 Node Buffer 就用 type buffer，type array 给的是 Uint8Array 风格的数组。
-->

---
layout: two-cols-header
---

# 核心转换：表 ↔ JS 数据

::left::

**读出**

```ts
// 对象数组（首行作键）
sheet_to_json(ws)

// 二维数组（自己处理表头）
sheet_to_json(ws, { header: 1 })
```

::right::

**写入**

```ts
// 对象数组 → 表
json_to_sheet(rows)

// 二维数组 → 表
aoa_to_sheet(aoa)
```

<div class="mt-4 text-sm">

> 都在 `XLSX.utils.*` 下。`header:1` 出二维数组、**首行不作键**；默认才是「首行作键的对象数组」。

</div>

<!--
核心转换都在 XLSX.utils 命名空间下，是「表」和「JS 数据」之间的桥。

读出方向：sheet_to_json。不传选项时返回对象数组，第一行作为各列的键，每行一个对象，这是最常用的。传 header 冒号 1，切到二维数组模式，每行是一个按列排的值数组，首行不再作键——适合你想自己处理表头、或者表头不规整的情况。

写入方向：json_to_sheet 把对象数组转成表，键自动作表头；aoa_to_sheet 把二维数组转成表，第一行就是你给的第一个内层数组。

记住对应关系：sheet_to_json 默认对象数组，对应 json_to_sheet；header 冒号 1 是二维数组，对应 aoa_to_sheet。
-->

---

# sheet_to_json：三个关键选项

```ts
// range: 跳过顶部说明行（数字 = 起始行，0 基）
sheet_to_json(ws, { range: 2 })

// defval: 缺失/空单元格统一填默认值
sheet_to_json(ws, { defval: null })

// raw: false → 取格式化文本 w（而非原始值 v）
sheet_to_json(ws, { raw: false })
```

<div v-click class="mt-3 text-sm">

> ⚠️ 默认稀疏模型下空单元格会被**省略**，导致对象字段时有时无——加 `defval` 即可补齐。

</div>

<!--
sheet_to_json 有三个最该掌握的选项。

range，覆盖读取范围。传数字，比如 2，表示从第 3 行也就是 0 基的第 2 行开始读到末尾，常用于跳过表格顶部的标题说明行。传字符串如 A2 冒号 C100，则精确限定一个 A1 区域。

defval，默认值。这个解决一个高频困惑：默认稀疏模型下，没有值的空单元格根本不存在，sheet_to_json 也会把这些位置省略掉，于是你会发现结果对象「字段时有时无」。这不是 bug，传 defval 冒号 null 或空串，所有空位就都补上默认值，字段齐全。

raw，原始值还是格式化文本。默认取原始值 v；设 raw 冒号 false，尽量取按数字格式渲染后的显示文本 w，适合所见即所得地导出。
-->

---

# 单元格对象：内容与呈现分离

```ts
const cell = ws['B2']
// { t:'n', v:3.5, z:'$0.00', w:'$3.50' }
```

| 字段 | 含义 | 例子 |
|---|---|---|
| `v` | 原始底层值 | `3.5` |
| `t` | 类型 | `'n'` |
| `z` | 数字格式串 | `'$0.00'` |
| `w` | 格式化显示文本 | `'$3.50'` |
| `f` | 公式（不含 =） | `'A1+B1'` |

<div v-click class="text-sm">

> `t` 取值：`b`布尔 / `n`数字 / `s`字符串 / `d`日期 / `e`错误 / `z`空白存根。

</div>

<!--
单元格是个普通 JS 对象，设计哲学是「内容与呈现分离」。

四个核心字段：v 是原始底层值，比如数字 3.5；z 是数字格式串，比如美元格式;w 是按格式渲染后的显示文本，比如 dollar 3.50;还有 f，公式文本，注意不含前导等号。

所以数据处理读 v，展示给人看用 w，两者分开。

t 是类型，决定 SheetJS 怎么解释 v。取值要记：b 布尔、n 数字、s 字符串、d 日期、e 错误、z 空白存根。

写入时 t 很重要：手动构造单元格，想写数字却把 t 设成 s，会被当文本，Excel 里就没法参与计算。好在用 json_to_sheet、aoa_to_sheet 时类型是自动推断的，多数情况不用手设。
-->

---

# 日期：默认是数字，不是 Date

```ts
// 默认：日期单元格 t:'n'，v 是 Excel 序列号
const wb = XLSX.readFile('data.xlsx')

// 要 JS Date：传 cellDates
const wb2 = XLSX.readFile('data.xlsx', { cellDates: true })
// 此后日期单元格 t:'d'，v 是 Date 对象
```

<v-clicks>

- Excel 底层把日期存成**数字序列号**
- SheetJS 默认不转换（`w` 才是看得懂的日期文本）
- `{ cellDates: true }` 才得到真正的 `Date`

</v-clicks>

<!--
日期是个经典坑。

Excel 底层把日期存成数字，叫序列号。SheetJS 默认不替你转换：读出来的日期单元格 t 是 n、v 是一个数字，只有 w 字段才是看得懂的日期文本。所以你直接拿 v 会得到一串数字，很困惑。

要得到真正的 JS Date 对象，读取时传 cellDates 冒号 true，此后日期单元格 t 变成 d、v 就是 Date 了。

这个选项几乎是处理带日期表格的标配，遇到「日期变数字」第一反应就是它。
-->

---

# 地址与范围

```ts
// A1 字符串 ↔ {c,r} 对象（0 基）
XLSX.utils.decode_cell('C4')        // { c:2, r:3 }
XLSX.utils.encode_cell({ c:2, r:3 }) // 'C4'

// 范围 ↔ {s,e}
XLSX.utils.decode_range('A1:B3')    // { s:{c:0,r:0}, e:{c:1,r:2} }
```

<v-clicks>

- `!ref` 是 A1 范围字符串，标记有效区域
- 多数工具据 `!ref` 遍历——**缺失/不对就读不到数据**
- 合并：`ws['!merges'] = [decode_range('A1:B1')]`

</v-clicks>

<!--
地址与范围。SheetJS 用 A1 字符串地址，但内部也有对象形式，二者用 utils 互转。

decode_cell 把 A1 字符串如 C4 转成 c r 对象，列行都是 0 基，C4 就是 c 2 r 3。反向用 encode_cell。范围用 decode_range、encode_range，对象形式是 s 起、e 止。

这里要强调 !ref：它是工作表的有效范围字符串，比如 A1 冒号 B3。多数工具，包括 sheet_to_json，都是按 !ref 来决定遍历范围的——所以如果你手动改了单元格却没更新 !ref，可能会读不到新数据，这是个隐蔽坑。

合并单元格也用范围：往 !merges 数组里 push 一个 decode_range 生成的范围对象即可，数据以左上角单元格为准。
-->

---

# 大文件：别卡死主线程

<v-clicks>

- SheetJS 解析是**同步、CPU 密集**——大文件阻塞 UI
- 截断：`sheetRows: N`（只读前 N 行）、`sheets`（只解析目标表）
- `dense: true`：单元格存进 `!data` 二维数组，省内存
- 放进 **Web Worker**，主线程只收结果

</v-clicks>

<div v-click class="mt-4">

```ts
// worker.js
const wb = XLSX.read(data, { type: 'array', dense: true })
postMessage(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]))
```

</div>

<!--
大文件性能，生产里绕不开。

关键认知：SheetJS 的解析是同步的、CPU 密集的操作。在浏览器里直接 read 一个大文件，会阻塞主线程，页面卡死。

应对组合拳。第一，截断数据量：sheetRows 冒号 N 在解析阶段就只读每表前 N 行；sheets 选项只解析你关心的那个工作表，不读全部。第二，dense 冒号 true 开启密集模式，单元格存进 !data 二维数组，而不是用 A1 字符串作键的稀疏对象，对超大表更省内存、遍历更快。第三，也是最重要的，把整段 read 加 sheet_to_json 移到 Web Worker 里跑，主线程只接收转好的结果，UI 就不卡了。

下面这段就是 Worker 里的核心：read 加 dense，转 json，postMessage 发回主线程。
-->

---

# 边界：公式与样式

<v-clicks>

- **不内置公式引擎**：读取给缓存结果 + 公式文本；写出原样写 `f`，**不替你算**（Excel 打开时才算）
- **社区版样式弱**：字体/颜色/边框等**写出**能力有限 → 需 SheetJS Pro 或 ExcelJS
- 审查公式：`utils.sheet_to_formulae(ws)` → `['C1=A1+B1', …]`

</v-clicks>

<div v-click class="mt-4 text-sm">

```ts
ws['C1'] = { t: 'n', f: 'A1+B1' }   // 写公式（结果由打开软件计算）
```

</div>

<!--
两个重要边界，必须心里有数。

第一，SheetJS 不内置公式计算引擎。读取含公式的文件，它给你 f 公式文本和 v 缓存的计算结果；写出时，它把你给的公式原样写进文件，但不替你算结果——结果要等 Excel 或 WPS 打开文件时才计算。所以如果你需要在 JS 里真正对公式求值，得另外接一个公式计算库。想审查工作表里都有哪些公式，用 sheet_to_formulae，它会列出每个单元格的「地址等于公式」。

第二，社区版的样式能力弱，这是它最大的短板。字体、颜色、填充、边框这些呈现属性的写出基本做不到，要带丰富样式导出，得用 SheetJS Pro，或者换 ExcelJS。

写公式很简单：给单元格设 f 字段，不含前导等号。
-->

---

# SheetJS vs ExcelJS：怎么选

| 维度 | SheetJS 社区版 | ExcelJS |
|---|---|---|
| 格式覆盖 | **最广** | 较窄（xlsx/csv） |
| 解析能力 | **强、容错好** | 一般 |
| 样式写出 | 弱（需 Pro） | **强** |
| 流式写大文件 | 不专长 | **支持** |

<v-clicks>

- 读**异构格式**抽数据 → **SheetJS**
- 导出**带样式报表** / 流式写超大 xlsx → **ExcelJS**

</v-clicks>

<!--
选型，SheetJS 还是 ExcelJS。

看这张对比表。格式覆盖，SheetJS 最广，xls、xlsb、ods、csv 乃至 Lotus、Numbers 十多种；ExcelJS 较窄，主要 xlsx 和 csv。解析能力，SheetJS 强、容错好；ExcelJS 一般。样式写出，SheetJS 社区版弱、要 Pro；ExcelJS 强，字体颜色边框都行。流式写大文件，ExcelJS 支持 streaming writer，SheetJS 不专长。

所以经验法则很清晰：如果你的任务是读各种异构格式、把数据抽出来，选 SheetJS，这是它最强的场景。如果你要导出一份带丰富样式的精美报表、或者要流式逐行写一个超大 xlsx 来控制内存，选 ExcelJS，或者上 SheetJS Pro。

简单的跨格式读写，SheetJS 完全够用。
-->

---
layout: intro
---

# 总结

SheetJS（`xlsx`）= **格式最广、解析最强的电子表格读写库**

- 安装：**从 CDN 装最新版**（`npm i xlsx` 是滞后的 0.18.5）
- 模型：**Workbook → Worksheets → Cells**，A1 地址 + `!ref`
- 读：Node `readFile` / 浏览器 `read`+`type:'array'`
- 写：`book_new` + `book_append_sheet` + `writeFile`（浏览器自动下载）
- 转换：`sheet_to_json` / `json_to_sheet` / `aoa_to_sheet`
- 边界：社区版样式弱、不重算公式；大文件用 `sheetRows`+Worker

<!--
总结。

SheetJS，包名 xlsx，是格式最广、解析最强的电子表格读写库。

几个要点。安装：一定从官方 CDN 装最新版，npm i xlsx 装到的是滞后的 0.18.5，这是第一坑。数据模型：Workbook 包工作表、工作表按 A1 地址存单元格、!ref 标范围，这是理解一切的基础。读：Node 用 readFile，浏览器用 read 加 type array。写：book_new、book_append_sheet、writeFile 三步，浏览器里 writeFile 自动触发下载。转换：sheet_to_json 读出、json_to_sheet 和 aoa_to_sheet 写入，是表和 JS 数据的桥。

最后是边界：社区版样式写出弱、不重算公式，这两点决定了什么时候该换 ExcelJS;大文件记得用 sheetRows 截断加 Web Worker 隔离，别卡死主线程。谢谢大家。
-->
