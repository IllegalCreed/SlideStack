---
theme: seriph
background: https://cover.sli.dev
title: ExcelJS — 读写 xlsx 与精细样式
info: |
  Presentation ExcelJS — 在 Node 与浏览器读写 XLSX、精细控制样式的 JavaScript 库。

  Learn more at [https://github.com/exceljs/exceljs](https://github.com/exceljs/exceljs)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📊</span>
</div>

<br/>

## ExcelJS — 读写 xlsx 与精细样式

Read, manipulate and write spreadsheet data and styles to XLSX。同构跑两端，强在 font/fill/border/numFmt、条件格式、数据校验与流式读写

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/exceljs/exceljs" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 ExcelJS,一个在 Node 和浏览器里读取、操作、写入 xlsx 电子表格数据与样式的 JavaScript 库。官方定位就是这句话:read, manipulate and write spreadsheet data and styles to XLSX。

它最大的卖点是样式精细:字体、填充、边框、对齐、数字格式、条件格式、数据校验、合并单元格、图片,全是对象化的 API。而且它是同构的,一套核心 API 既能在 Node 用文件流读写,也能在浏览器用 writeBuffer 配 Blob 导出。

主线:为什么用它 → 对象模型 → 基本读写 → 样式四件套 → 填充与颜色坑 → 合并单元格 → 值类型 → 数据校验 → 条件格式与图片 → 浏览器导出 → 流式大文件 → 样式引用陷阱 → 与 SheetJS 选型 → 总结。版本基线 4.x,latest 4.4.0,MIT。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 ExcelJS

<v-clicks>

- 原生 fetch 导出只能拼 CSV，没样式
- 业务要「带格式的报表」：表头加粗、金额货币格式、隔行变色
- 还要合并单元格、下拉校验、插图片、冻结表头
- 几十万行导出，普通方案内存爆掉

</v-clicks>

<div v-click class="mt-6">

ExcelJS 的回应：

- 样式对象化 → **font / fill / border / numFmt** 全覆盖
- 条件格式 + 数据校验 + 图片 → **富报表**
- `stream.xlsx` + `commit()` → **大文件省内存**
- 同构 → **Node 与浏览器一套 API**

</div>

<!--
为什么要专门用一个库?四个痛点。第一,用原生 fetch 或简单方案导出,往往只能拼出无样式的 CSV。第二,真实业务要的是带格式的报表:表头加粗、金额按货币格式、隔行变色斑马纹。第三,还经常要合并单元格、做下拉框校验、插公司 logo、冻结表头。第四,数据量一大,几十万行,把整个文档放内存里就爆了。

ExcelJS 针对性地回应:样式全部对象化,font、fill、border、numFmt 一应俱全;条件格式、数据校验、图片让你做出富报表;流式的 stream.xlsx 配 commit 处理大文件不爆内存;而且同构,Node 和浏览器共用一套核心 API。这就是今天的主线。
-->

---

# 对象模型：四层结构

```text
Workbook  工作簿   new ExcelJS.Workbook()
  └─ Worksheet  工作表   workbook.addWorksheet('名字')
       ├─ Row     行       ws.addRow(...) / ws.getRow(n)
       └─ Cell    单元格   ws.getCell('A1')
  Column  列   ws.getColumn('key' | 'B' | 3)  ← 整列设宽与样式
```

<v-clicks>

- **Workbook**：顶层，负责文件 IO（`workbook.xlsx` / `workbook.csv`）
- **Worksheet**：一张表，承载列、行、合并、视图、条件格式
- **Cell**：值（`value`）+ 样式（`font`/`fill`/`border`/`alignment`/`numFmt`）
- **Column**：按 key / 字母 / 1 基列号取，可整列设样式

</v-clicks>

<!--
先建立心智模型。ExcelJS 自上而下是四层对象。

最顶上是 Workbook 工作簿,用 new ExcelJS.Workbook 创建,它负责文件读写,xlsx 读写挂在 workbook.xlsx,csv 挂在 workbook.csv。

往下是 Worksheet 工作表,用 workbook.addWorksheet 加,一张表承载列、行、合并单元格、冻结视图、条件格式这些。

再往下是 Row 行和 Cell 单元格。单元格是最终承载值和样式的地方,value 是值,font、fill、border、alignment、numFmt 是样式。

还有一个横向的 Column 列对象,用 getColumn 取,可以传列的 key、列字母、或者 1 基的列号,主要用来整列设置宽度和样式。记住这四层,后面所有 API 都挂在它们身上。
-->

---
layout: two-cols-header
---

# 基本读写

::left::

**写出（Node）**

```js
const wb = new ExcelJS.Workbook();
const ws = wb.addWorksheet('员工');
ws.columns = [
  { header: '工号', key: 'id', width: 10 },
  { header: '姓名', key: 'name', width: 20 },
];
ws.addRow({ id: 1, name: '张三' });
await wb.xlsx.writeFile('out.xlsx');
```

::right::

**读取（Node）**

```js
const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile('data.xlsx');
const ws = wb.getWorksheet('员工');
ws.eachRow((row, n) => {
  console.log(n, row.values);
});
```

<div class="mt-2 text-sm">

> `columns` 的 `header` 自动写入第一行；`key` 让 `addRow({key:value})` 按键写入。

</div>

<!--
基本读写。左边是写出:new 一个 Workbook,addWorksheet 加一张表,然后给 ws.columns 赋值,每列有 header 表头、key 逻辑键、width 列宽。

这里有个关键点:给 columns 赋值时,header 会自动写到第一行形成表头,所以你的数据 addRow 是从第二行开始的。而 key 的作用是让你能 addRow 传一个对象,按键写入,不用关心列的物理顺序。最后 await writeFile 落盘,注意它返回 Promise,必须 await。

右边是读取:new Workbook 后 readFile,再 getWorksheet 按名取表,用 eachRow 遍历有数据的行。getWorksheet 可以传名字,也可以传 id,还可以用 worksheets 下标。这三种取法后面会讲到一个坑。
-->

---

# 样式四件套：font / alignment / border / numFmt

```js
const cell = ws.getCell('A1');

cell.font = { name: '微软雅黑', size: 14, bold: true,
  color: { argb: 'FF0000FF' } };            // 颜色是 ARGB 对象

cell.alignment = { horizontal: 'center',
  vertical: 'middle', wrapText: true };       // 居中是 middle

cell.border = { top: { style: 'thin' },
  bottom: { style: 'double', color: { argb: 'FFFF0000' } } };

cell.numFmt = '0.00%';                         // 仅改显示，不改值
```

<div v-click class="mt-2 text-sm">

> 三个易错：颜色必须 `{ argb }` 不能写 `'red'`；垂直居中是 `'middle'`；`numFmt` 不改存储的真实数值。

</div>

<!--
样式四件套。第一是 font 字体,name、size、bold、italic、underline、color。注意 color 必须是 ARGB 对象,不能写字符串 red。

第二是 alignment 对齐,horizontal 水平、vertical 垂直、wrapText 自动换行。这里最容易错的是:垂直居中的取值是 middle,不是 center,写 center 不生效。

第三是 border 边框,按 top、left、bottom、right、diagonal 分方向,每个方向是 style 加 color。style 是枚举字符串,thin、medium、thick、double、dotted 这些。

第四是 numFmt 数字格式,用 Excel 的格式代码,百分比是 0.00%,货币、日期都有对应代码。关键认知:numFmt 只改变显示,不改变单元格里存的真实数值,所以 0.456 存着还是 0.456,只是显示成 45.6%。
-->

---

# 填充与颜色：两个高频坑

```js
// ✅ 纯色填充：看的是 fgColor，不是 bgColor！
cell.fill = { type: 'pattern', pattern: 'solid',
  fgColor: { argb: 'FFFFFF00' } };   // 黄色

// ❌ 只写 bgColor 不会变色
cell.fill = { type: 'pattern', pattern: 'solid',
  bgColor: { argb: 'FFFFFF00' } };
```

<v-clicks>

- **坑一**：`solid` 填充的可见色取 **`fgColor`**，`bgColor` 只用于纹理图案底色
- **坑二**：颜色是 **ARGB**——`'FFFF0000'` 首两位 `FF` 是 **Alpha 透明度**，不是红色
- 也可用主题色 `{ theme: 0 }`，配 `tint` 调明暗

</v-clicks>

<!--
填充和颜色,两个高频坑,几乎人人踩过。

第一个坑:纯色填充。直觉上你会觉得背景色应该是 bgColor,但 ExcelJS 的 solid 填充,实际显示的是 fgColor 前景色!只写 bgColor 是不会变色的。bgColor 只在非 solid 的纹理图案里,作为图案的底色。所以纯色填充一律用 fgColor。

第二个坑:颜色格式是 ARGB,不是 RGB。八位十六进制,首两位是 Alpha 透明度通道,然后才是红绿蓝。FFFF0000,首两位 FF 是完全不透明,后面 FF0000 才是红色。很多人当成 RGB,漏掉 alpha,六位写成 FF0000,结果颜色不对。

除了 argb,还能用主题色,theme 加索引号,再配 tint 调明暗,这在做企业主题报表时有用。
-->

---

# 合并单元格

```js
ws.mergeCells('A1:C1');          // 范围字符串
ws.mergeCells(10, 11, 12, 13);   // 起始行,列,结束行,列 → K10:M12

ws.getCell('A1').value = '标题';  // ✅ 值写左上角 master
// ws.getCell('B1').value = ...   // ❌ 从属单元格，无效

ws.getCell('B1').master === ws.getCell('A1');  // true
ws.unMergeCells('A1');           // 取消合并，样式恢复独立
```

<div v-click class="mt-3 text-sm">

> 合并后**值与样式都以左上角单元格为准**；从属单元格指向 master，单独赋值无效。

</div>

<!--
合并单元格。三种写法:范围字符串 A1 冒号 C1;起止单元格;或者四个数字,起始行、起始列、结束行、结束列。

关键规则:合并之后,整个区域的值和样式,都由左上角那个单元格承载,叫 master 主单元格。所以你要给合并区域设标题,必须写左上角 A1。给 B1、C1 赋值是无效的,因为它们是从属单元格,实际都指向 A1。你可以用 cell.master 验证,getCell B1 的 master 就等于 getCell A1。

取消合并用 unMergeCells,取消后各个单元格的样式才恢复独立。这个 master 机制,是合并单元格读写时最需要记住的一点。
-->

---

# 单元格值类型

```js
ws.getCell('A1').value = 123;                 // 数字
ws.getCell('A2').value = new Date();          // 日期（配 numFmt 显示）
ws.getCell('A3').value = { formula: 'A1*2', result: 246 };   // 公式
ws.getCell('A4').value = { text: '官网',
  hyperlink: 'https://exceljs.github.io/' };  // 超链接
ws.getCell('A5').value = { richText: [        // 富文本：一格多样式
  { font: { bold: true }, text: '红' },
  { font: { italic: true }, text: '字' },
] };
```

<div v-click class="mt-2 text-sm">

> 读取：`cell.value`（原始）/ `cell.text`（字符串）/ `cell.type`（ValueType 枚举）。公式写字符串 `'=A1*2'` 会变文本！

</div>

<!--
单元格的值不只是数字和字符串,有好几种值类型,都是给 cell.value 赋不同结构。

数字、字符串直接赋。日期赋 Date 对象,但记得配 numFmt 才能正常显示,否则可能显示成序列号。

公式是赋一个 formula 对象,可以带 result 缓存计算结果。注意:ExcelJS 不是计算引擎,它不会帮你求值,所以带上 result,别人不打开 Excel 也能读到值。还有个坑:直接写字符串等号 A1 乘 2,会被当成普通文本,不是公式。

超链接是 text 加 hyperlink 对象,text 是显示文字,hyperlink 是地址。富文本是 richText 数组,每段独立设 font,实现一个单元格里多种样式。

读取时,value 是原始值可能是对象,text 是渲染后的字符串,type 是 ValueType 枚举,告诉你这格是数字、日期还是公式。
-->

---

# 数据校验：下拉列表与区间

```js
// 下拉列表：离散值是「数组里一个带引号的字符串」
ws.getCell('A1').dataValidation = {
  type: 'list', allowBlank: true,
  formulae: ['"待办,进行中,已完成"'],
};

// 数值区间：operator 'between' + 两个边界
ws.getCell('B1').dataValidation = {
  type: 'decimal', operator: 'between', formulae: [1.5, 7],
  showErrorMessage: true, error: '请输入 1.5~7',
};
```

<div v-click class="mt-2 text-sm">

> type：`list`/`whole`/`decimal`/`textLength`/`date`/`custom`。list 写成 `['A','B']` 多元素是错的。

</div>

<!--
数据校验,限制用户能输入什么,常用来做下拉框。

下拉列表用 type list。最容易错的是 formulae 写法:离散候选值,要写成数组里的一个字符串,而且字符串内部用双引号包住逗号分隔的值。是这样:中括号里一个字符串,字符串是双引号待办逗号进行中逗号已完成。写成多个数组元素,中括号待办逗号进行中,是错的。也可以用区域引用,比如美元 D 美元 1 冒号美元 D 美元 5。

数值校验用 whole 整数或 decimal 小数,配 operator,区间是 between,加两个边界值。还可以配报错提示,showErrorMessage、errorTitle、error。

type 一共这几种:list、whole、decimal、textLength、date、custom。operator 有 between、greaterThan、lessThan 等等。做表单模板时这个很实用。
-->

---

# 条件格式 + 图片

```js
// 斑马纹：隔行变色
ws.addConditionalFormatting({
  ref: 'A2:D100',
  rules: [{ type: 'expression', formulae: ['MOD(ROW(),2)=0'],
    style: { fill: { type: 'pattern', pattern: 'solid',
      bgColor: { argb: 'FFF2F2F2' } } } }],
});

// 图片：先在 workbook 注册拿 id，再贴到 worksheet
const id = wb.addImage({ filename: 'logo.png', extension: 'png' });
ws.addImage(id, 'B2:D6');
```

<div v-click class="mt-2 text-sm">

> 规则 type：`expression`/`cellIs`/`colorScale`/`dataBar`/`iconSet`/`top10`/`aboveAverage` 等。图片**两步**：注册 + 贴图。

</div>

<!--
条件格式和图片。

条件格式用 worksheet 的 addConditionalFormatting,接 ref 作用区域和 rules 规则数组。最常见的斑马纹隔行变色,用 expression 类型,公式是 MOD ROW 取 2 等于 0,配一个 fill 样式。规则的 type 很丰富:expression 表达式、cellIs 单元格比较、colorScale 色阶、dataBar 数据条、iconSet 图标集、top10、aboveAverage 等等,基本覆盖 Excel 里的条件格式。

图片是两步走,这点要记牢。第一步在 workbook 上 addImage 注册图片,传 filename 加 extension,也支持 buffer 和 base64,它返回一个 imageId。第二步在 worksheet 上 addImage,传刚才的 id 和目标区域,可以是范围字符串 B2 冒号 D6,也可以用 tl、br 锚点或 ext 像素尺寸精确定位。注意是先 workbook 注册,再 worksheet 贴图。
-->

---
layout: two-cols-header
---

# 浏览器导出与读取

::left::

**导出下载**

```js
const buf = await wb.xlsx.writeBuffer();
const blob = new Blob([buf], {
  type: 'application/vnd.openxml' +
    'formats-officedocument.' +
    'spreadsheetml.sheet',
});
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = '导出.xlsx';
a.click();
```

::right::

**读取上传文件**

```js
// FileReader 读出 ArrayBuffer 后
await wb.xlsx.load(arrayBuffer);
```

<div class="mt-4 text-sm">

> 浏览器**无文件系统**：
> 用 `writeBuffer` / `load`
> 替代 `writeFile` / `readFile`。
> 样式能力两端一致。

</div>

<!--
浏览器场景。浏览器没有文件系统写权限,所以不能用 writeFile 和 readFile,要用对应的内存版本。

导出下载:先 writeBuffer 拿到二进制 buffer,然后包成 Blob,MIME 类型是那一长串 openxmlformats 的 spreadsheetml.sheet。再创建一个 a 标签,href 设成 createObjectURL,download 设文件名,click 触发下载。这是标准套路。也可以用 FileSaver 这个库的 saveAs 简化。

读取上传文件:用 FileReader 把 File 读成 ArrayBuffer,然后 workbook.xlsx.load 载入。load 是从内存 buffer 解析的入口,服务端拿到 Buffer 也用它。

记住对应关系:Node 用 writeFile readFile,浏览器用 writeBuffer load。核心的样式和读写能力,两端是完全一致的。
-->

---

# 流式读写：大文件不爆内存

```js
// 写：WorkbookWriter + 逐行 commit
const wb = new ExcelJS.stream.xlsx.WorkbookWriter({
  filename: 'large.xlsx',
  useStyles: true, useSharedStrings: true,
});
const ws = wb.addWorksheet('数据');
for (let i = 1; i <= 500000; i++) {
  ws.addRow({ id: i }).commit();   // 写一行，释放一行
}
await ws.commit();
await wb.commit();
```

<v-clicks>

- `commit` 后该行**落盘并从内存丢弃，不可再访问**——故大文件不爆内存
- `useSharedStrings`：重复文本去重，**减小体积**；`useStyles`：流式也输出样式

</v-clicks>

<!--
流式读写,处理大文件的关键。普通 Workbook 把整个文档放内存,几十万行会 OOM。

流式写用 stream.xlsx.WorkbookWriter,构造时传 filename,还有两个选项:useStyles 让流式输出也带样式,默认是关的;useSharedStrings 让重复字符串走共享字符串表,去重减小体积。然后循环里每加一行就 commit,最后 worksheet commit、workbook commit。

核心机制就是这个 commit:一旦某行被 commit,它就被写入输出流,并从内存里丢弃,之后不可再访问。这正是流式不爆内存的原因,代价是你没法回头改已提交的行,所以要数据备齐再逐行写。

读的一侧用 WorkbookReader,配 for await 双层循环,外层遍历 worksheet,内层遍历 row,边读边处理,不把整个文件载进内存。导出报表动辄十万行时,流式是唯一稳妥的选择。
-->

---

# 样式按引用共享：一个隐蔽陷阱

```js
const base = { name: 'Arial', size: 12 };
ws.getCell('A1').font = base;
ws.getCell('A2').font = base;
base.size = 20;          // ❌ A1、A2 同时变 20 号！

// ✅ 需独立时克隆后再赋
const make = (over) => ({ name: 'Arial', size: 12, ...over });
ws.getCell('A1').font = make({ bold: true });
ws.getCell('A2').font = make({ italic: true });
```

<v-clicks>

- 样式对象（font/fill/border）**按引用共享**，改一处会牵连所有引用它的格
- 需独立 → **克隆**；故意「一改全改」→ 复用同一引用（也是特性）

</v-clicks>

<!--
一个很隐蔽、批量设样式时极易踩的陷阱:样式对象按引用共享。

看代码:定义一个 base 字体对象,赋给 A1,又赋给 A2。这时如果你改 base.size 等于 20,A1 和 A2 会同时变成 20 号!因为它俩引用的是同一个对象。font、fill、border 这些样式对象都是这样,赋的是引用,不是拷贝。

解决办法:需要每格独立时,克隆一份再赋值。这里用一个 make 工厂函数,每次展开返回一个新对象,A1、A2 就各自独立了。也可以用对象展开或深拷贝。

反过来想,如果你是故意要一改全改,比如统一调整整批单元格的字号,那复用同一个引用反而是个方便的特性。关键是分清楚:什么时候要克隆隔离,什么时候要复用联动。理解这一点,你就掌握了 ExcelJS 样式的精髓。
-->

---

# ExcelJS vs SheetJS：怎么选

| 维度 | **ExcelJS** | **SheetJS（xlsx）** |
|---|---|---|
| 强项 | 带样式的**写出**（报表） | 广格式**解析**与转换 |
| 样式写入 | 精细（条件格式/校验/图片） | 社区版有限 |
| 支持格式 | xlsx / csv | xlsx/xls/csv/ods 等 |
| 流式 | `stream.xlsx` 读写 | 有 |
| 公式计算 | 不求值 | 不求值 |

<div v-click class="mt-3">

一句话：**要好看的样式导出选 ExcelJS，要解析多种来源格式选 SheetJS**。两者独立、无封装关系，可组合用。

</div>

<!--
选型对比。ExcelJS 和 SheetJS,也就是 xlsx 包,是这个领域最常被拿来比的两个。

ExcelJS 的强项是带样式的写出,做报表导出,样式精细,条件格式、数据校验、图片都行;但支持的格式相对窄,主要是 xlsx 和 csv。

SheetJS 的强项是广泛格式的解析和数据转换,xlsx、老的 xls 二进制、csv、ods 等等都能读;但社区版的样式写入能力有限。

两者都不是计算引擎,都不会帮你求公式。都有流式 API。

一句话选型:你要导出一份好看的、带样式的报表,选 ExcelJS;你要解析各种来源、各种格式的表格,或者纯数据进进出出,选 SheetJS。它俩是各自独立实现的,没有封装关系,真实项目里甚至可以组合用,比如 SheetJS 解析、ExcelJS 美化导出。
-->

---
layout: intro
---

# 总结

ExcelJS = **读写 xlsx + 精细样式，同构跑两端**

- 模型：Workbook → Worksheet → Row / Cell（+ Column）
- 样式：`font`/`alignment`/`border`/`numFmt`/`fill` 对象化
- 两坑：纯色填充看 **`fgColor`**；颜色是 **ARGB**（首位 alpha）
- 值类型：数字/日期/公式/超链接/富文本
- 富报表：合并、数据校验、条件格式、图片、冻结
- 大文件：`stream.xlsx` + `commit()` 省内存
- 选型：**样式导出选 ExcelJS，广格式解析选 SheetJS**

<!--
总结一下。

ExcelJS 是一个读写 xlsx、强在精细样式、同构跑两端的库。

对象模型记四层:Workbook 工作簿、Worksheet 工作表、Row 行、Cell 单元格,加一个横向的 Column 列。

样式五件套全对象化:font、alignment、border、numFmt、fill。两个必记的坑:纯色填充看的是 fgColor 不是 bgColor;颜色是 ARGB 格式,首两位是 alpha 透明度。

值类型丰富:数字、日期、公式对象、超链接对象、富文本数组。但要记住 ExcelJS 不求值公式。

做富报表的能力:合并单元格、数据校验下拉、条件格式斑马纹、插图片、冻结表头。

大文件一定要用流式,stream.xlsx 的 WorkbookWriter 配 commit,写一行释放一行,不爆内存。

最后选型:要样式好看的导出用 ExcelJS,要解析各种杂格式用 SheetJS。谢谢大家。
-->
