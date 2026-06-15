---
theme: seriph
background: https://cover.sli.dev
title: jsPDF — Client-side PDF Generation
info: |
  Presentation jsPDF — 在浏览器用纯 JavaScript 生成 PDF。

  Learn more at [https://github.com/parallax/jsPDF](https://github.com/parallax/jsPDF)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📄</span>
</div>

<br/>

## jsPDF — 客户端 PDF 生成

在浏览器本地用纯 JavaScript 把数据「画」成 PDF：命令式绘图、矢量文本、零后端依赖

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/parallax/jsPDF" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 jsPDF：客户端 JavaScript PDF 生成的主力库。官方一句话定位就是 Client-side JavaScript PDF generation。

它在浏览器本地把绘制指令直接编排成 PDF 字节，全程不需要后端，最后用 save 下载或 output 拿 Blob 上传预览。它也能在 Node 跑，但主战场是客户端。

主线：定位 → 命令式范式 → 创建与单位 → 画字与图形 → 字体与中文 → 多页与导出 → autotable 表格 → html 栅格化 → 矢量 vs 栅格 → 选型 → 总结。贯穿全程有两条暗线：一是它是命令式绘图、没有自动布局；二是矢量文本和 html 栅格化的本质区别。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它解决什么

<v-clicks>

- 前端按用户数据**实时**生成 PDF（发票、证书、报表）
- 不想为「导出 PDF」单独搭一套服务端渲染
- 数据敏感，**不希望数据离开浏览器**
- 已有页面/图表，想快速截图成 PDF

</v-clicks>

<div v-click class="mt-6">

jsPDF 的回应：

- **纯客户端**生成 → 零后端、利隐私
- **命令式绘图** → 像素级精确控制
- **矢量文本** → 可选、可搜、打印锐利
- 生态：**autotable** 表格、**svg2pdf** 矢量、`.html()` 截图

</div>

<!--
为什么需要 jsPDF？几个典型场景。

第一，前端要按用户实时数据生成 PDF，比如点一下按钮导出发票、证书、报表。第二，不想为了一个导出功能单独搭服务端 PDF 渲染，省部署和算力。第三，数据敏感，希望生成全程在浏览器本地、数据不出去。第四，页面上已经有现成的内容或图表，想快速截图成 PDF。

jsPDF 的回应：纯客户端生成，零后端依赖、利于隐私；命令式绘图，给你像素级精确控制；原生文本是矢量，可选中、可搜索、打印清晰；生态成熟，有 autotable 做表格、svg2pdf 做矢量 SVG、html 方法做 DOM 截图。
-->

---

# 核心范式：命令式绘图

```ts
import { jsPDF } from 'jspdf';

const doc = new jsPDF();        // 一块画布
doc.text('标题', 20, 20);       // 坐标即绝对位置（左上为原点）
doc.line(20, 25, 190, 25);      // 自己定坐标
doc.rect(20, 30, 60, 30);
doc.save('a4.pdf');
```

<v-clicks>

- 一页 = 从 `(0,0)` 到 `(pageWidth, pageHeight)` 的画布
- **没有**自动页边距、自动换行、自动分页
- 留白、断行、分页都得**自己算**
- 对比：pdfmake / @react-pdf 是声明式、有布局引擎

</v-clicks>

<!--
理解 jsPDF 最关键的一点：它是命令式绘图，不是声明式文档定义。

看代码：new jsPDF 给你一块画布，然后你一条条下指令——text 在某坐标写字、line 画线、rect 画矩形，最后 save。坐标就是绝对位置，原点在左上、x 向右、y 向下。

这意味着：jsPDF 没有自动页边距、没有内容流、不自动换行、不自动分页。要留白、要断长文本、要换页，全得你自己计算。这是它和 pdfmake、@react-pdf 最根本的区别——那两个是声明式，写个结构定义，由布局引擎自动排版分页。jsPDF 换来的是像素级精确控制和轻量。
-->

---

# 创建文档与单位

```ts
const doc = new jsPDF();  // 默认：A4 / 纵向 / 毫米
const doc2 = new jsPDF({
  orientation: 'landscape',  // 'portrait' | 'landscape'
  unit: 'in',                // pt | mm | cm | m | in | px
  format: [4, 2],            // 预设名 或 [width, height]
});
```

<v-clicks>

- 默认 **A4 / portrait / mm**，不传参即用这套
- `unit` 决定**坐标/尺寸**的含义（mm/in/px…）
- ⚠️ `setFontSize` 字号**始终以 pt 计**，与 unit 无关

</v-clicks>

<!--
创建文档。new jsPDF 不传参，默认是 A4 纸、纵向 portrait、毫米 mm，这是官方默认。

要自定义就传配置对象：orientation 设方向，portrait 或 landscape，简写 p、l；unit 设单位，合法值是 pt、mm、cm、m、in、px，注意是缩写，没有 inch、没有 rem 百分比这些；format 设尺寸，可以是预设名比如 a4、letter，也可以是自定义的宽高数组。

一个高频困惑要先说清：unit 只影响坐标和尺寸的含义，但 setFontSize 的字号永远以 pt 也就是磅计，不随 unit 变。所以 unit 是 mm 时，text 的坐标 10 是毫米，但 setFontSize 12 永远是 12 磅。
-->

---

# 画字与图形

```ts
doc.setFontSize(18);
doc.setTextColor(255, 0, 0);   // 状态型：先设后画
doc.text('Hello', 10, 20);

doc.setFillColor(230, 230, 230);
doc.setDrawColor(40, 40, 40);
doc.rect(20, 30, 50, 20, 'FD'); // S=描边 F=填充 FD=两者
```

<v-clicks>

- 颜色/线宽是**状态**：在绘制**之前**设好才生效
- `setDrawColor` 描边 / `setFillColor` 填充 / `setTextColor` 文字
- 图形 `style`：`'S'` 只描边 / `'F'` 只填充 / `'FD'` 填充+描边

</v-clicks>

<!--
画字和图形。setFontSize 设字号，setTextColor 设文字颜色，然后 text 写字。

关键概念：颜色、线宽这些都是状态型的，调用设置方法后影响其后的绘制，直到下次更改。所以必须在绘制之前设好——先 rect 再 setFillColor，颜色对这次绘制是不生效的。

三种颜色分工要记牢：setDrawColor 管描边和线条颜色，setFillColor 管图形填充颜色，setTextColor 管文字颜色。

图形方法 rect、circle、roundedRect 等最后一个 style 参数控制绘制方式：大 S 只描边，用描边色；大 F 只填充，用填充色；FD 或 DF 既填充又描边；不传默认只描边。
-->

---

# 文字进阶：换行与居中

```ts
const w = doc.internal.pageSize.getWidth();

// 居中：x 取页宽一半，再 align: 'center'
doc.text('居中标题', w / 2, 20, { align: 'center' });

// 长文本不自动换行 → 先按宽度切成行数组
const lines = doc.splitTextToSize(longText, w - 40);
doc.text(lines, 20, 40);
```

<v-clicks>

- `text` **不自动换行**：`splitTextToSize(text, maxWidth)` 切行
- `align` 以传入的 **x 为基准**（center=中心，right=右端）
- 页面尺寸读 `internal.pageSize.getWidth()/getHeight()`

</v-clicks>

<!--
文字进阶两个高频需求：换行和居中。

居中：text 的 options 传 align center，是以传入的 x 为水平中心对齐的。所以要整页居中，x 得取页宽的一半，页宽用 internal.pageSize.getWidth 拿。align right 同理，是以 x 为右端。只写 align、x 还是左边距，是不会居中的。

换行：text 不会自动换行，长字符串会冲出右边界。解决办法是 splitTextToSize，按给定宽度把长文本切成一个数组、每项一行，再把数组传给 text 就会按行排版。这是处理段落长文本的标准做法。

页面尺寸别写死 210 乘 297，那只是 A4 加毫米的值，换 format 或 unit 就不对，要用 pageSize 动态读。
-->

---

# 字体：内置只覆盖 ASCII

<v-clicks>

- 内置 **14 标准字体**（helvetica/times/courier 系）开箱即用
- 但官方明确：它们 **limited to the ASCII-codepage**
- 直接写中文 / 日文 / 阿拉伯文 → **乱码、丢字**

</v-clicks>

<div v-click class="mt-4">

要支持非拉丁字符，**必须嵌入自定义字体**：

```ts
doc.addFileToVFS('MyFont.ttf', base64);     // ① 进虚拟文件系统
doc.addFont('MyFont.ttf', 'MyFont', 'normal'); // ② 注册
doc.setFont('MyFont');                       // ③ 切换后再 text
doc.text('你好，世界', 10, 10);
```

</div>

<!--
字体是 jsPDF 一个绕不开的坑。

jsPDF 默认带 14 个标准字体，helvetica、times、courier 的常规、粗、斜变体，开箱即用、无需嵌入。但官方明确说：这 14 个标准字体只覆盖 ASCII 码页。也就是说，你直接写中文、日文、阿拉伯文，会乱码或丢字。

要显示这些非拉丁字符，必须自己嵌入一个自定义字体，标准三步：第一步 addFileToVFS，把字体文件以 base64 放进 jsPDF 的虚拟文件系统；第二步 addFont，注册字体，三个参数是 VFS 里的文件名、字体族名、样式；第三步 setFont 切换到这个字体，之后再 text 写字。base64 字体串可以用官方的 fontconverter 工具生成。

顺序不能颠倒，必须先 addFileToVFS 加文件、addFont 注册，最后才能 setFont 切换。
-->

---

# 中文字体的代价：体积

<v-clicks>

- 完整中文 TTF 覆盖数千~数万汉字，常达 **数 MB**
- 嵌入后 **PDF 体积显著变大**，加载与生成也变慢

</v-clicks>

<div v-click class="mt-4">

三种瘦身手段：

| 手段 | 作用 |
|---|---|
| 字体**子集化** subset | 只留用到的字，数 MB → 几十 KB（最有效） |
| `putOnlyUsedFonts: true` | 只嵌入用到的**整个**字体（字体级） |
| `compress: true` | 压缩 PDF 内容流（FlateDecode） |

</div>

<!--
嵌入中文字体有个直接代价：体积。

完整的中文 TTF 覆盖数千到数万汉字，文件常达数 MB，像思源黑体一个字重就能到 5 到 15 兆。addFileToVFS 把它嵌进去后，生成的 PDF 会显著变大，前端加载字体和首次生成的耗时也增加。

三种瘦身手段。第一也是最有效的：字体子集化，用 fonttools 这类工具只保留实际用到的字符，能把字库从数 MB 压到几十 KB。第二：构造时开 putOnlyUsedFonts，只把用到的整个字体写进 PDF，注意它是字体级裁剪、不是字符级子集，注册了多个字体只用一两个时有效。第三：开 compress，压缩 PDF 内容流，整体减小体积。三者可以叠加用。
-->

---

# 多页与导出

```ts
doc.text('第 1 页', 10, 10);
doc.addPage();           // 新增页并切到新页
doc.text('第 2 页', 10, 10);
doc.setPage(1);          // 切回已有页补内容

doc.save('out.pdf');              // ① 下载
const blob = doc.output('blob');  // ② 拿 Blob 上传
iframe.src = doc.output('bloburl'); // ③ iframe 预览
```

<v-clicks>

- `addPage()` 新增并切页；`setPage(n)` 在已有页间切换
- `getNumberOfPages()` + 循环 `setPage` → 全页页码
- 导出：`save` 下载 / `output('blob'|'arraybuffer')` 数据 / `bloburl` 预览

</v-clicks>

<!--
多页和导出。

多页：addPage 新增一页，并自动把当前页指针移到新页，之后绘制都落在新页。要回到之前某页补内容，比如给第 1 页加页脚，用 setPage 切回去。getNumberOfPages 拿总页数。常见的全页加页码套路：先把所有内容画完，再 for 循环 setPage 到每一页、逐页 text 写页码，因为得先画完才知道总页数。

导出有三种形态，对应三类需求。第一，save 直接触发下载，它底层是 output save 别名，靠 FileSaver 实现。第二，output blob 拿到 Blob 对象，可以塞进 FormData 上传后端，或者 output arraybuffer 拿字节、在 Node 端作 HTTP 响应。第三，output bloburl 拿到一个对象 URL，赋给 iframe 的 src 就能预览、不触发下载，大文件预览优先用它，别用超长的 datauristring。
-->

---

# 表格：jspdf-autotable

```ts
import { autoTable } from 'jspdf-autotable';

autoTable(doc, {
  head: [['ID', '姓名', '城市']],
  body: [[1, '张三', '北京']],
  startY: 20,
  theme: 'striped',  // striped | grid | plain
});
// 衔接下一块：doc.lastAutoTable.finalY
```

<v-clicks>

- 手画表格繁琐 → autotable 一键生成、**自动分页**
- 数据用 `head`/`body`、`columns`+对象、或 `html` 读 DOM 表
- 表尾位置 `doc.lastAutoTable.finalY`；钩子 `didParseCell` 改单元格

</v-clicks>

<!--
表格。用原生 text、line 手画表格非常繁琐，社区标准方案是 jspdf-autotable 插件。

v5 推荐函数式用法：从 jspdf-autotable 导入 autoTable，把 doc 作为第一个参数传进去。它能自动分页、带样式。数据来源有三种：直接给 head 和 body 二维数组；给 columns 列定义加对象数组；或者给 html 选项传一个 CSS 选择器或 table 元素，直接读页面 DOM 表生成——注意这种方式产出的仍是矢量可选文字，和待会儿说的 html 截图不一样。

theme 三个取值：striped 斑马纹是默认、grid 完整网格线、plain 无边框极简。

画完一张表，下一块内容用 doc.lastAutoTable.finalY 定位起点，加点间距作为下一个 startY。要在单元格绘制前改文本或样式，用 didParseCell 钩子；画完后叠加图片或链接，用 didDrawCell。
-->

---

# html()：把 DOM 栅格化

```ts
await doc.html(document.getElementById('content'), {
  callback: (doc) => doc.save('out.pdf'), // 异步！须在回调里导出
  width: 180,
  windowWidth: 800,
  autoPaging: 'text',                 // 尽量不切断文字
  html2canvas: { scale: 2, useCORS: true },
});
```

<v-clicks>

- 底层用 **html2canvas 把 DOM 截图成位图**再嵌入
- ⚠️ PDF 里的「文字」是**图片像素**：不可选、不可搜、缩放糊
- 异步：必须在 `callback` / `await` 后导出；依赖 DOM（纯 Node 不可用）

</v-clicks>

<!--
html 方法，很多人会用错的地方。

doc.html 可以把一个 DOM 元素或 HTML 字符串渲染进 PDF。但要看清它的本质：底层是借助 html2canvas，把 DOM 截图成一张位图，再把这张图嵌进 PDF。

关键后果，这是重点：PDF 里看到的文字其实是图片像素，不可选中、不可搜索、放大会糊。这和原生 text 画的矢量文字有本质区别。

用法上几个要点：html2canvas 渲染是异步的，所以必须在 callback 回调里、或者 await 之后再 save，回调首参是 doc 实例；width 配 windowWidth 控制缩放；autoPaging 设 text 尽量不在半行处切断文字，设 slice 会硬切；html2canvas 子选项里 scale 提清晰度、useCORS 允许跨域图片。还有，html 依赖 DOM 和 html2canvas，纯 Node 环境用不了；HTML 字符串输入还会用 dompurify 净化，记得先 sanitize 不可信内容。
-->

---

# 矢量文本 vs html() 栅格化

| 维度 | 原生 `text()` | `.html()` 截图 |
|---|---|---|
| 文字本质 | 矢量字形 | 图片像素 |
| 可选 / 搜索 | ✅ | ❌ |
| 缩放清晰 | 锐利 | 会糊 |
| 体积 | 小 | 较大 |
| 还原复杂 CSS | 手写布局 | ✅ 照搬 |
| 依赖 | 无 | html2canvas + DOM |

<div v-click class="mt-3 text-sm">

> 票据/证书/报表要可选文字 → **原生绘制**；还原现成复杂网页 → **html()**。两者可混用。

</div>

<!--
把矢量文本和 html 栅格化正面对比一下，这是 jsPDF 最该想清楚的一道选择题。

原生 text 出的是矢量字形，可选可搜、缩放锐利、体积小，但还原复杂 CSS 要自己手写布局，没有额外依赖。

html 出的是图片像素，不可选不可搜、放大会糊、体积较大，但能直接照搬页面的复杂样式，代价是依赖 html2canvas 和 DOM。

经验法则：布局相对固定、要求文字可选可搜、打印锐利的，比如发票、证书、报表，优先用原生绘制加 autotable；要像素级还原一个现成的、样式复杂多变的网页，又不在意文字可选的，用 html。而且两者可以混用：主体用 text 和 autotable 画矢量，个别复杂区块用 html 截图嵌进去。
-->

---

# 选型：和谁配合、何时换

| 库 | 范式 | 适合 |
|---|---|---|
| **jsPDF** | 命令式绘图 | 精确控制、票据、DOM 截图、轻量 |
| **pdfmake** | 声明式 JSON | 复杂自动流式排版、自动分页 |
| **@react-pdf** | 声明式 React | React 栈、组件化、自动布局 |
| **pdf-lib** | 操作已有 PDF | 编辑/合并/填表单 |
| **PDF.js** | 渲染/解析 | **查看**已有 PDF（非生成） |

<div v-click class="mt-3 text-sm">

> jsPDF 只管**生成**新 PDF；要改已有 PDF 用 pdf-lib，要看 PDF 用 PDF.js。

</div>

<!--
选型。jsPDF 不是万能，要知道它的边界和邻居。

jsPDF 是命令式绘图，适合像素级精确控制、票据证书标签、DOM 截图、轻量零框架的场景。

pdfmake 是声明式 JSON，写 docDefinition，适合复杂的自动流式排版、自动分页。@react-pdf 是声明式 React 组件加 Flexbox，适合 React 技术栈、组件化复用、复杂自动布局。要大量自动排版、不想手算坐标，就在这两个里选。

pdf-lib 是操作已有 PDF 的，读取、编辑、合并拆分、填表单域，这是 jsPDF 做不了的。PDF.js 是渲染解析，在浏览器查看已有 PDF，注意它不是生成。

一句话边界：jsPDF 只管生成新 PDF；要改已有 PDF 用 pdf-lib，只想看 PDF 用 PDF.js。
-->

---
layout: intro
---

# 总结

jsPDF = **客户端 PDF 生成，命令式 + 矢量优先**

- 定位：浏览器本地生成、零后端、利隐私
- 范式：命令式绘图，坐标即位置，**无自动布局**
- 文字：原生 `text` 矢量可选；中文须 `addFileToVFS`+`addFont` 嵌入
- 导出：`save` 下载 / `output('blob'/'bloburl')` 上传预览
- 生态：`jspdf-autotable` 表格、`svg2pdf` 矢量、`.html()` 截图
- 取舍：**矢量 text vs html() 栅格化**——按是否要可选文字二选一

<!--
总结一下。

jsPDF 的本质是客户端 PDF 生成，两个关键词：命令式、矢量优先。

定位：在浏览器本地生成 PDF，零后端依赖，利于隐私和部署成本。范式：命令式绘图，坐标就是绝对位置，没有自动页边距、换行、分页，复杂排版要自己算。

文字：原生 text 出矢量、可选可搜可打印；但内置字体只覆盖 ASCII，中文必须 addFileToVFS 加 addFont 嵌入字体，还要注意体积、用子集化瘦身。导出三形态：save 下载、output blob 上传、output bloburl 预览。

生态：autotable 做自动分页表格，svg2pdf 做矢量 SVG，html 方法做 DOM 截图。

最后再强调今天的核心取舍：原生 text 的矢量文本，和 html 方法的 html2canvas 栅格化，是两条路——前者可选可搜清晰、后者能照搬复杂样式但文字是图片。按你是否需要可选文字、是否要还原现成网页，二选一，也可以混用。谢谢大家。
-->
