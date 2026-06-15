---
theme: seriph
background: https://cover.sli.dev
title: PptxGenJS — 用 JS 生成 PowerPoint
info: |
  Presentation PptxGenJS — 纯 JavaScript 生成 .pptx 文件。

  Learn more at [https://gitbrent.github.io/PptxGenJS/](https://gitbrent.github.io/PptxGenJS/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📊</span>
</div>

<br/>

## PptxGenJS — 用 JS 生成 PowerPoint

纯 JavaScript 声明式生成 `.pptx`：`new pptxgen()` → `addSlide()` → `addText/addChart/...` → `writeFile()`。Node、浏览器、React/Vite、Electron 通用

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/gitbrent/PptxGenJS" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 PptxGenJS：一个纯 JavaScript 生成 PowerPoint 文件的库。版本基线 4.0.1。

它的官方定位是用简洁强大的 JS API 创建 PowerPoint，产出符合 OOXML 的 .pptx 文件，并且 runs everywhere：Node、浏览器、React、Electron 都能跑。

主线：定位与边界 → 对象模型 → 坐标与颜色 → 文本 → 图片 → 图表 → 表格 → 形状 → 母版与布局 → 输出三件套 → 只生成不解析 → 总结。其中有一条贯穿全篇的边界，请先记住：它只生成、不解析。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么，不是什么

<v-clicks>

- ✅ 用代码**生成** `.pptx` 文件
- ✅ 跨环境：Node / 浏览器 / React / Electron
- ✅ 元素全：文本、图片、图表、表格、形状、音视频

</v-clicks>

<div v-click class="mt-6">

边界（最重要）：

- ❌ **不能读取/修改**既有 pptx → 改模板用 **pptx-automizer**
- ❌ **不渲染/预览** → 看效果用 PowerPoint/WPS 打开

</div>

<!--
先划清能力边界，这决定选型对不对。

它能做的：用代码从零生成 .pptx；跨环境运行；元素覆盖很全，文本、图片、图表、表格、形状、音视频都有。

它做不到的，也是最容易误解的两点：第一，它只生成不解析，无法读取或修改一个既有的 .pptx 模板，没有 load 这种 API；要基于现成模板替换文字换图，得用 pptx-automizer。第二，它不渲染也不预览，产出文件后要用 PowerPoint 或 WPS 打开才能看效果，纯 JS 渲染 pptx 生态里没有成熟方案。把这两条记牢，后面就不会走弯路。
-->

---

# 对象模型：三层

```ts
import pptxgen from 'pptxgenjs'

const pres = new pptxgen()        // 1. 演示文稿（默认导出是类）
const slide = pres.addSlide()     // 2. 幻灯片
slide.addText('Hello', {          // 3. 元素
  x: 1, y: 1, w: 8, h: 1.5,
  fontSize: 36, color: '0088CC',
})
await pres.writeFile({ fileName: 'hello.pptx' })  // 输出（异步）
```

<v-clicks>

- 浏览器全局名是 `PptxGenJS`（`pptxgen` 只是 Node import 别名）
- `addText/addImage/...` 都返回 **slide 本身**，可链式

</v-clicks>

<!--
理解这个库的关键是三层对象模型。

第一层是演示文稿，new pptxgen 得到。注意默认导出是一个类，Node 里习惯把它别名为小写 pptxgen，浏览器用 script 引入时全局名是大驼峰 PptxGenJS，两者是同一个类。

第二层是幻灯片，pres.addSlide 新增并返回一张。

第三层是元素，往 slide 上 addText、addImage、addChart 等。这些 addX 方法都返回 slide 本身，所以可以链式调用。

最后用 writeFile 落地。它返回 Promise，是异步的，记得 await。
-->

---

# 两条必记规则

```ts
slide.addText('红字蓝底', {
  x: 1, y: '50%', w: 4, h: 1,   // 数字=英寸；'50%'相对幻灯片
  color: 'FF0000',              // ✅ 无 # 的 6 位十六进制
  // color: '#FF0000',          // ❌ 带 # 会失效
  fill: { color: '0000FF' },
})

await pres.writeFile({ fileName: 'a.pptx' })  // ✅ 必须 await
```

<v-clicks>

- **坐标单位是英寸**（或百分比字符串），不是 px；字号 `fontSize` 才是 pt
- **颜色一律无 `#`**；`writeFile/write/stream` 都是 **Promise**

</v-clicks>

<!--
两条最容易翻车的规则，单独拿出来强调。

第一，坐标和尺寸 x、y、w、h 默认单位是英寸，数字 1 就是 1 英寸；也支持百分比字符串，相对幻灯片尺寸。它不是像素思维。注意字号 fontSize 的单位是磅 pt，和坐标的英寸是两码事，别混。

第二，颜色一律用不带井号的 6 位十六进制，写 FF0000，不要写 井号 FF0000，带井号会让颜色失效，这是新手第一坑。

还有一条贯穿后面的：所有输出方法 writeFile、write、stream 都返回 Promise，是异步的，忘了 await 经常导致文件为空或没下载。
-->

---

# 文本：字符串 vs 数组

```ts
// 整段同样式
slide.addText('单一样式', { x: 1, y: 1, w: 6, h: 1, fontSize: 18 })

// 词级混排：文本对象数组
slide.addText([
  { text: '红粗 ', options: { color: 'FF0000', bold: true } },
  { text: '蓝斜', options: { color: '0000FF', italic: true } },
], { x: 1, y: 2, w: 8, h: 1 })
```

<v-clicks>

- 水平 `align: 'center'`，垂直 `valign: 'middle'`（**别搞反**）
- 项目符号 `bullet: true` / `{ type: 'number' }`；缩进 `indentLevel`

</v-clicks>

<!--
文本是最常用的元素。addText 第一个参数有两种形态。

字符串形态：整段统一样式，适合标题、单行文字，用反斜杠 n 换行。

数组形态：传文本对象数组，每段自带 options，可以做词级混排，比如一句话里红色加粗加蓝色斜体。每段加 breakLine true 可强制换行。

对齐有个高频坑：水平居中是 align center，垂直居中是 valign middle，两个值经常被人搞反——记住垂直用 middle，水平用 center。属性名是全小写 align、valign，不是 CSS 的 textAlign。

项目符号用 bullet，true 是圆点，对象 type number 是编号，code 是 Unicode 自定义符号，缩进层级用 indentLevel。
-->

---

# 图片：path 或 data

```ts
// path：浏览器是 URL，Node 是本地路径
slide.addImage({ path: 'logo.png', x: 1, y: 1, w: 2, h: 2 })

// data：base64 data URI
slide.addImage({ data: 'image/png;base64,iVBORw0...', x: 4, y: 1, w: 2, h: 2 })

// 等比放入框不裁切
slide.addImage({ path: 'p.jpg', x: 1, y: 4, w: 3, h: 2,
  sizing: { type: 'contain', w: 3, h: 2 } })
```

<div v-click class="mt-2 text-sm">

> `sizing.type`：`contain`(留白) / `cover`(裁溢出) / `crop`(定区裁切)；`rounding: true` 裁圆。

</div>

<!--
图片用 addImage，接收单个选项对象，来源二选一。

path：图片路径，在浏览器里是可访问的 URL，在 Node 里可以是本地文件路径，库会去读。字段名是 path，不是 src 或 url。

data：base64 的 data URI，格式是 MIME 类型加分号 base64 逗号再加编码数据，比如 image/png;base64,后面一长串。

缩放用 sizing.type：contain 等比完整放入可能留白，cover 等比铺满会裁掉溢出，crop 是按指定区域裁切。rounding true 可把图裁成圆形。
-->

---

# 图表：addChart(type, data, opts)

```ts
const data = [
  { name: '销量', labels: ['一月','二月','三月'], values: [150, 460, 515] },
]

slide.addChart(pres.ChartType.bar, data, {
  x: 1, y: 1, w: 8, h: 4,
  barDir: 'col',                  // 竖直柱（'bar'=水平条）
  showTitle: true, title: '季度销量',
  showLegend: true, legendPos: 'b',
})
```

<v-clicks>

- 数据是**系列数组** `[{ name, labels, values }]`（非 Chart.js 格式）
- 无 `column` 类型；竖直柱 = `bar` + `barDir:'col'`

</v-clicks>

<!--
图表用 addChart，三个参数：类型、数据、选项。

类型用枚举 pres.ChartType，比如 bar、line、pie、doughnut、radar、scatter，也可以用大写便捷别名 pres.charts.BAR。

数据是系列数组，每个系列含 name 系列名、labels 分类标签、values 数值。注意这不是 Chart.js 的 labels 加 datasets 格式，别搞混。

一个常考点：没有 column 类型，竖直柱状图是用 bar 类型加选项 barDir col；barDir bar 是水平条。图例用 showLegend 加 legendPos，位置取单字母 b t l r，底部是 b。
-->

---

# 图表：3D 与组合图的坑

```ts
// 3D 柱图：枚举键是 bar3d（小写 d），值是 'bar3D'（大写 D）
slide.addChart(pres.ChartType.bar3d, data, { x: 1, y: 1, w: 8, h: 4 })

// 组合图：首参传数组，每项一种子图
slide.addChart([
  { type: pres.ChartType.bar,  data: d1, options: { barDir: 'col' } },
  { type: pres.ChartType.line, data: d2, options: { secondaryValAxis: true } },
], { x: 1, y: 1, w: 8, h: 5 })
```

<div v-click class="mt-2 text-sm">

> `饼/环`图扇区显百分比用 `showPercent: true`；配色用 `chartColors: ['0088CC', ...]`。

</div>

<!--
图表有两个经典的坑。

第一，3D 柱状图。TypeScript 枚举定义是 bar3d 等于字符串 bar3D，也就是枚举键是小写 d 的 bar3d，但它的值是大写 D 的 bar3D。所以代码里写 ChartType.bar3d 对，写 ChartType.bar3D 会取到 undefined；如果直接传字符串则要传 bar3D。bubble3d 同理。

第二，组合图。要在一张图叠加柱和线，是把 addChart 的第一个参数传成数组，每项是 type、data、options 的对象。不是连续调两次 addChart，那会变成两个独立图。

补充：饼图环图想在扇区显示百分比用 showPercent true；自定义系列配色用 chartColors，传无井号的 hex 数组。
-->

---

# 表格与形状

```ts
slide.addTable([
  ['姓名', '部门', '绩效'],
  ['张三', '研发', { text: 'A', options: { color: '009900' } }],
  [{ text: '合计', options: { colspan: 2 } }, '—'],   // 跨列
], { x: 0.5, y: 0.5, w: 9, autoPage: true })          // 超长自动分页

slide.addText('按钮', {                                 // 形状里写字
  shape: pres.ShapeType.roundRect,
  x: 1, y: 5, w: 3, h: 1, fill: { color: '0088CC' }, color: 'FFFFFF',
})
```

<v-clicks>

- 表格 `rows` 是二维数组；合并用 `colspan`/`rowspan`；`autoPage` 自动续页
- 形状内文字用 `addText` 的 `shape` 选项；ShapeType 键是小驼峰（`roundRect`）

</v-clicks>

<!--
表格和形状放一起讲。

表格 addTable，rows 是行数组，每行是单元格数组，单元格可为字符串或 text 加 options 对象。合并单元格用 colspan 跨列、rowspan 跨行，语义和 HTML 一样。内容超长想自动续到新幻灯片，开 autoPage true，配 autoPageRepeatHeader 每页重复表头。

形状用 addShape，类型枚举 pres.ShapeType，键是小驼峰，比如 rect、roundRect、ellipse，注意圆和椭圆是 ellipse 没有 circle。

要在形状里写字，最直接的写法是用 addText 加 shape 选项一步到位，而不是先 addShape 再叠 addText。
-->

---

# 母版与布局

```ts
pres.layout = 'LAYOUT_WIDE'          // 13.333×7.5；默认 LAYOUT_16x9

pres.defineSlideMaster({
  title: 'BRAND',                     // 母版唯一名
  background: { color: 'FFFFFF' },
  objects: [{ rect: { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: '0088CC' } } }],
})

const slide = pres.addSlide({ masterName: 'BRAND' })  // 字段名 masterName
```

<v-clicks>

- 内置布局：`LAYOUT_16x9`/`16x10`/`4x3`/`WIDE`（注意小写 x）
- 自定义尺寸：`defineLayout({ name, width, height })` 后再设 `pres.layout`

</v-clicks>

<!--
做品牌化、统一外观靠母版与布局。

布局就是幻灯片尺寸，给 pres.layout 赋常量字符串。内置四个：LAYOUT_16x9 默认 10 乘 5.625，16x10、4x3，还有 WIDE 是 13.333 乘 7.5。注意常量名里是小写 x，写大写 X 不匹配。要自定义尺寸，先 defineLayout 注册 name 加数字英寸的 width height，再把 pres.layout 设成那个名字。

母版用 defineSlideMaster，title 是母版唯一名，里面 background 设背景，objects 放装饰元素和占位符。套用时在 addSlide 里传 masterName，注意字段名是 masterName，不是 master。
-->

---

# 输出三件套（全异步）

```ts
// 1. writeFile：Node 写盘 / 浏览器自动下载
await pres.writeFile({ fileName: 'out.pptx', compression: true })

// 2. write：拿数据（服务端常用 nodebuffer）
const buf = await pres.write({ outputType: 'nodebuffer' })
res.send(buf)

// 3. stream：流式输出
const s = await pres.stream()
```

<v-clicks>

- `outputType`（全小写）：`base64`/`blob`/`arraybuffer`/`uint8array`/`nodebuffer`
- 大小写坑：是 `nodebuffer`（非 `buffer`）、`arraybuffer`（非 `arrayBuffer`）

</v-clicks>

<!--
输出有三个方法，都是异步返回 Promise。

writeFile 是环境自适应的：Node 里写入磁盘，浏览器里自动触发下载，你不必手动拼 Blob。参数是 fileName 驼峰，compression true 可开 ZIP 压缩减小体积。

write 用来拿数据而不落地，参数 outputType 决定形态。服务端最常用 nodebuffer，拿到 Buffer 直接作为 HTTP 响应体 send 出去。

stream 是流式输出，适合大文件服务端场景。

outputType 取值全小写：base64、blob 默认、arraybuffer、uint8array、nodebuffer、binarystring。大小写是高频坑：是 nodebuffer 一个词全小写不是 buffer，是 arraybuffer 不是驼峰 arrayBuffer。
-->

---

# 边界：只生成，不解析

<v-clicks>

- PptxGenJS 是 **write-only**：能从零生成，**不能读取/编辑既有 pptx**
- 没有 `load()`，没有读取插件——这是设计本身

</v-clicks>

<div v-click class="mt-4">

| 需求 | 用什么 |
|---|---|
| 代码从零生成 pptx | **PptxGenJS** |
| 改既有 pptx 模板（替换/填充） | **pptx-automizer** |
| 网页预览 pptx | 转图片/PDF 或 Office 在线（非本库） |

</div>

<!--
再次强调这条最重要的边界，因为它直接决定选型对错。

PptxGenJS 是 write-only，只能从零生成新文件，不能读取、解析、打开或修改一个既有的 .pptx。它没有 load 之类的 API，也没有读取插件，这是设计本身，不是缺功能。

所以选型这样分：要用代码从零拼一份 ppt，用 PptxGenJS，这是它最强的场景。要基于一份做好的 ppt 模板替换里面的文字和图，那不是它的活，用 pptx-automizer。要在网页里预览 ppt，它也帮不上，得把 pptx 转成图片或 PDF，或者接 Office 在线查看。
-->

---
layout: intro
---

# 总结

PptxGenJS = **纯 JS 声明式生成 PowerPoint**

- 模型：`new pptxgen()` → `addSlide()` → `addText/addChart/...`
- 单位：坐标用**英寸**/百分比；颜色用**无 # 十六进制**
- 元素：文本(混排/项目符号)、图片、图表、表格、形状、媒体
- 母版：`defineSlideMaster` + `addSlide({ masterName })`
- 输出：`writeFile`(写盘/下载) / `write` / `stream`，**全异步**
- 边界：**只生成不解析**（改模板用 pptx-automizer）、**不渲染预览**

<!--
总结一下。

PptxGenJS 本质是纯 JS 声明式生成 PowerPoint 的库。

对象模型三层：new pptxgen 得到演示文稿，addSlide 得到幻灯片，再 addText、addChart 等加元素。

两条必记单位规则：坐标尺寸用英寸或百分比不是像素，颜色用不带井号的十六进制。

元素覆盖很全：文本支持词级混排和项目符号，还有图片、图表、表格、形状、音视频。

母版用 defineSlideMaster 定义、addSlide 的 masterName 套用，做品牌化。

输出三件套 writeFile、write、stream，都是异步 Promise，writeFile 在 Node 写盘、浏览器下载。

最后两条边界请记牢：它只生成不解析，改既有模板用 pptx-automizer；它也不渲染预览，看效果要用 PowerPoint 打开。把这些记住，就能正确地用它，也能在选型时不踩坑。谢谢大家。
-->
