---
theme: seriph
background: https://cover.sli.dev
title: docx — Generate .docx with JS/TS
info: |
  Presentation about docx (dolanmiu/docx) — generate and modify Word .docx files with JS/TS.

  Learn more at [https://docx.js.org/](https://docx.js.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📄</span>
</div>

<br/>

## docx — 用 JS/TS 生成 Word

声明式对象树生成（并可修改）`.docx`：`Document → Section → Paragraph → TextRun`，最后用 `Packer` 打包。跨 Node 与浏览器，不依赖 Microsoft Word

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/dolanmiu/docx" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 docx，dolanmiu 的这个库，是「用代码生成 Word 文档」的事实标准。

它的官方定位一句话：用 JS 或 TS 轻松生成并修改 .docx 文件，Node 和浏览器都能跑。关键是它不依赖也不调用 Microsoft Word，纯用 JavaScript 直接构造 OOXML 再打包成 .docx，所以在没装 Office 的服务器、CI、甚至浏览器里都能用。

主线：是什么 → 为什么用它 → 对象模型 → 文本与样式 → 段落标题列表 → 表格 → 图片 → 页眉页脚页码 → 命名样式 → 多节排版 → Packer 导出与环境差异 → 模板补丁 → 与 docxtemplater/mammoth 选型 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用它生成 Word

<v-clicks>

- 后端要按用户数据导出报告，结构还不固定
- 不想在服务器上装 Office、调 COM 自动化
- 前端也想直接生成并下载 .docx
- 手拼 OOXML 的 XML 太痛苦

</v-clicks>

<div v-click class="mt-6">

docx 的回应：

- **声明式对象树** → 用 map/循环按数据拼
- **纯 JS 产出 OOXML** → 不依赖 Word
- **跨 Node 与浏览器** → 一套生成 API
- **TS 友好** → 自带类型，选项有提示

</div>

<!--
为什么要专门用一个库生成 Word？几个常见场景。

第一，后端要按用户数据导出报告，章节数、表格行数都不固定，纯模板搞不定。第二，不想在服务器上装 Office，更不想调 COM 自动化那套又重又脆。第三，前端有时也想直接生成并下载 .docx，不走后端。第四，.docx 底层是 OOXML，手写那堆 XML 极其痛苦。

docx 针对性地回应：用声明式对象树，你用普通的 map、循环、条件就能按数据拼出文档；纯 JS 直接产出 OOXML，不依赖 Word；同一套生成 API 跨 Node 和浏览器；库本身用 TS 写，自带类型声明，写选项有提示。这就是今天的主线。
-->

---

# docx 是什么

```ts
import { Document, Packer, Paragraph, TextRun } from 'docx'
```

<v-clicks>

- **生成导向**：用代码「描述」文档，不是解析已有文档
- **不依赖 Word**：纯 JS 产出 OOXML，`.docx` 本质是 ZIP 包
- **声明式对象树**：搭好结构，交给 `Packer` 序列化
- **跨环境**：Node 写盘 / 浏览器下载，生成逻辑通用

</v-clicks>

<div v-click class="mt-4 text-sm">

> 包名就是 `docx`：`npm install docx`，自带 TS 类型。版本基线 9.x（latest 9.7.1，MIT）。

</div>

<!--
docx 到底是什么，四个关键点。

第一，它是生成导向的，你用代码描述一份 Word 文档长什么样，而不是去解析已有文档。把已有 .docx 读出来转 HTML 那是 mammoth 的活，方向相反。

第二，它不依赖 Word，纯 JavaScript 直接产出 OOXML，也就是 Office Open XML。.docx 文件本质就是一个 ZIP 包，里面是一堆 XML 部件。

第三，它是声明式对象树：你用 Document、Paragraph、TextRun 这些类把结构搭好，最后交给跟 Document 完全解耦的 Packer 去序列化成真正的字节。

第四，跨环境：Node 里写盘、浏览器里下载，但搭结构的代码两端完全一样。

安装很简单，npm install docx，包名就叫 docx，跟微软官方没关系，它是社区库 dolanmiu slash docx，自带 TypeScript 类型。
-->

---

# 对象模型：四层嵌套

```text
Document（文档）
└── sections[]                  ← 一个或多个「节」
      ├── properties / headers / footers   ← 节级页面与页眉脚
      └── children[]            ← 块级内容
            └── Paragraph（段落）
                  └── children[]    ← 行内内容
                        └── TextRun（带样式文本）
```

<div v-click class="mt-4">

记牢一句话：**文档含节、节含段落、段落含文本片段**。

样式分两级：段落级（对齐/标题/间距）落 `Paragraph`，字符级（粗斜体/字号/颜色）落 `TextRun`。

</div>

<!--
理解 docx 最重要的就是这棵对象树，外层包内层，一共四层。

最外是 Document，文档根。它含一个 sections 数组，里面是一个或多个节。每个节带自己的 properties，也就是页面属性，还有 headers 和 footers 页眉页脚；节的 children 放块级内容。

块级内容里最常见的是 Paragraph 段落。段落又有自己的 children，放行内内容，最常见的是 TextRun，也就是带样式的文本片段。

记牢一句话：文档含节、节含段落、段落含文本片段。

还有一个关键认知：样式分两级。段落级的样式，比如对齐、标题、段间距，落在 Paragraph 上；字符级的样式，比如粗体、斜体、字号、颜色，落在 TextRun 上。这条贯穿后面所有内容。
-->

---

# 最小可用：生成第一份文档

```ts
import { Document, Packer, Paragraph, TextRun } from 'docx'
import * as fs from 'fs'

const doc = new Document({
  sections: [
    { children: [new Paragraph({
        children: [
          new TextRun('Hello '),
          new TextRun({ text: 'World', bold: true }), // 这片段加粗
        ],
    })] },
  ],
})

Packer.toBuffer(doc).then((buf) => fs.writeFileSync('out.docx', buf))
```

<div v-click class="mt-2 text-sm">

> `sections` 是 Document **唯一必填**项；Packer 方法都是**异步**的。

</div>

<!--
来看最小可用的例子，Node 环境。

第一步搭对象树：new Document，传 sections 数组，里面一个节，节的 children 放一个段落。这个段落用 children 写法，放两个 TextRun：第一个是普通的 Hello 空格，第二个 text 是 World 并且 bold true，所以 World 会加粗。这就是同一段里局部加粗。

第二步导出：Packer.toBuffer，注意它是异步的，返回 Promise，所以用 then 拿到 buffer，再用 fs.writeFileSync 写到磁盘。

两个要点写在底下。第一，sections 是 Document 唯一必填的选项，其它 creator、title、styles 全可选。第二，Packer 的所有导出方法都是异步的，记得 then 或 await。
-->

---

# 文本样式：TextRun 全家桶

```ts
new TextRun({
  text: '示例',
  bold: true,          // 粗体
  italics: true,       // 斜体（注意复数 italics！）
  size: 24,            // 字号 half-points：24 = 12pt
  color: '2E74B5',     // 字色：不带 # 的 hex
  underline: { type: UnderlineType.SINGLE },
  highlight: 'yellow', // 记号笔高亮（预设色名）
})
```

<v-clicks>

- 字号 `size` 是 **half-points（半磅）**：想要的 pt **×2**
- `color` 用**不带 `#`** 的十六进制；斜体是 `italics`（复数）

</v-clicks>

<!--
文本样式都在 TextRun 上设，这是个高频的全家桶。

text 是内容。bold 加粗。italics 斜体，特别注意是复数 italics，少个 s 不生效，这是新手第一个坑。size 是字号，但单位是 half-points 半磅，所以 24 代表 12 磅，这是第二个坑。color 是字色，用不带井号的十六进制，比如 2E74B5。underline 下划线是个对象，type 取 UnderlineType 枚举。highlight 是记号笔式高亮，只接受预设色名，比如 yellow。

两条划重点。第一，字号 size 是半磅，想要多少磅就乘以 2，12 磅写 24。第二，color 用不带井号的 hex，斜体属性名是 italics 复数。把这两条记牢，能少踩一半的坑。
-->

---

# 段落：标题 / 对齐 / 列表

```ts
import { Paragraph, HeadingLevel, AlignmentType } from 'docx'

new Paragraph({ text: '一级标题', heading: HeadingLevel.HEADING_1 })
new Paragraph({ text: '居中',     alignment: AlignmentType.CENTER })
new Paragraph({ text: '项目',     bullet: { level: 0 } })   // 无序列表
```

<v-clicks>

- `heading` 取 `HeadingLevel`（`HEADING_1`~`6`、`TITLE`）——也是目录识别层级的依据
- `alignment` 取 `AlignmentType`（`CENTER`/`BOTH`…）
- `bullet: { level }` 做无序列表（0~9 控制缩进）

</v-clicks>

<!--
段落级的格式都在 Paragraph 上设。

标题用 heading，取 HeadingLevel 枚举，有 HEADING_1 到 6，还有 TITLE。它不只是套个标题样式，还是后面生成目录时识别标题层级的依据。

对齐用 alignment，取 AlignmentType 枚举，比如 CENTER 居中、BOTH 两端对齐。注意对齐是段落级的，不在 TextRun 上。

无序列表用 bullet，传一个对象 level，0 是顶层，到 9 是最深，控制缩进层级。

这里有个常见坑提前说：如果你用了 heading 或者自定义段落样式，却没在文档的 styles 里定义对应的 Heading 样式，导出后会显示成没套样式的默认样子。这点后面讲样式时再展开。
-->

---

# 有序与多级编号：numbering

```ts
const doc = new Document({
  numbering: { config: [{
    reference: 'n1',
    levels: [
      { level: 0, format: LevelFormat.DECIMAL,      text: '%1.' },
      { level: 1, format: LevelFormat.LOWER_LETTER, text: '%2)' },
    ],
  }] },
  sections: [{ children: [
    new Paragraph({ text: '一',   numbering: { reference: 'n1', level: 0 } }),
    new Paragraph({ text: '子项', numbering: { reference: 'n1', level: 1 } }),
  ] }],
})
```

<div v-click class="mt-2 text-sm">

> 文档级定义方案，段落级 `numbering: { reference, level }` 引用。`%1` 是本级序号占位。

</div>

<!--
有序列表、多级编号，比如 1 点、1.1、a 括号，不用 bullet，要用 numbering，而且是两段式。

文档级先在 numbering.config 里定义方案：reference 是方案名，levels 是各层级配置。每一层有 level 层号、format 编号格式取 LevelFormat 枚举比如 DECIMAL 十进制、LOWER_LETTER 小写字母，还有 text，里面的 %1 是本级序号的占位符。

段落级再用 numbering，传 reference 指向方案名、level 指定用第几层。

底下一句话总结：文档级定义方案、段落级引用。这种集中定义、按引用使用的设计，跟样式是一个思路。手敲 1 点 2 点那种是假编号，增删条目不会自动重排，一定要用 numbering。
-->

---

# 表格：Table → Row → Cell → Paragraph

```ts
import { Table, TableRow, TableCell, Paragraph, WidthType } from 'docx'

const table = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({ children: [
      new TableCell({ children: [new Paragraph('姓名')] }),
      new TableCell({ children: [new Paragraph('年龄')] }),
    ] }),
  ],
})
```

<v-clicks>

- 单元格里放的是 **Paragraph**，不能直接塞字符串
- 数据驱动：`rows.map(r => new TableRow({...}))`

</v-clicks>

<!--
表格是四层结构：Table 含 rows，rows 是 TableRow 数组；TableRow 含 children，是 TableCell 数组；TableCell 含 children，放 Paragraph，或者嵌套表格。

看代码：new Table，传 width 设整表占页宽百分之百，rows 里放 TableRow，每个 TableRow 的 children 放 TableCell，每个 TableCell 的 children 放 Paragraph。

两个要点。第一，单元格里放的是 Paragraph 段落，不能直接塞字符串，这是最常见的类型错误。第二，数据驱动场景特别顺手，直接 rows 等于你的数组 map 成一组 TableRow，这正是 docx 相比模板的优势。
-->

---

# 表格：合并与宽度

```ts
// 横向合并（类似 colspan）
new TableCell({ columnSpan: 2, children: [new Paragraph('跨两列')] })

// 纵向合并（类似 rowspan）
new TableCell({ rowSpan: 3, children: [new Paragraph('跨三行')] })

// 宽度：百分比 / twips(DXA)；单元格背景用 shading
new TableCell({
  width: { size: 4535, type: WidthType.DXA },
  shading: { fill: 'DDDDDD' },           // 不带 # 的 hex
  children: [new Paragraph('灰底')],
})
```

<div v-click class="mt-2 text-sm">

> `WidthType`：`PERCENTAGE` / `DXA`(twips) / `AUTO` / `NIL`。

</div>

<!--
表格的合并和宽度。

横向合并用单元格的 columnSpan，传要合并的列数，类似 HTML 的 colspan。纵向合并用 rowSpan，类似 rowspan。注意属性名是 columnSpan，不是 colSpan。

宽度写成一个对象，size 加 type，type 取 WidthType 枚举：PERCENTAGE 百分比、DXA 也就是 twips 一磅的二十分之一、AUTO、NIL。

单元格背景色用 shading，传 fill，是不带井号的十六进制。注意单元格背景是 shading，不是 backgroundColor。

底下列出 WidthType 的四个取值，没有像素选项，这点要注意。
-->

---

# 图片：ImageRun 放进段落

```ts
import { Paragraph, ImageRun } from 'docx'
import * as fs from 'fs'

new Paragraph({ children: [
  new ImageRun({
    type: 'png',                       // 显式声明格式
    data: fs.readFileSync('logo.png'), // 二进制 / Base64 / Blob
    transformation: { width: 120, height: 120 }, // 像素
  }),
] })
```

<v-clicks>

- 图片是 **ImageRun**，必须装在某个 **Paragraph** 里
- `data` 要**已读入的二进制**，库不替你下载 URL
- 浮动定位 offset 单位是 **EMU**（1in = 914400）

</v-clicks>

<!--
插图片用 ImageRun，而且必须装在某个 Paragraph 的 children 里，图片不能直接挂在节上。

看代码：new ImageRun，type 显式声明格式，比如 png，当前版本要求写 type，尤其 svg。data 是图片二进制，可以是 Buffer、Uint8Array、ArrayBuffer、Base64 字符串、Blob。transformation 设尺寸，width 和 height，单位是像素。

三条要点。第一，图片是 ImageRun，类名别记成 Image，且必须在段落里。第二，data 必须是你已经读进来的二进制或 Base64，库不会替你 fetch 下载 URL，浏览器里先用 fetch 拿 arrayBuffer。第三，如果做浮动图片，offset 偏移的单位是 EMU，一英寸等于 914400 EMU，跟字号、间距都不是一套单位。
-->

---

# 页眉页脚与页码

```ts
import { Header, Footer, Paragraph, TextRun, PageNumber } from 'docx'

sections: [{
  headers: { default: new Header({ children: [new Paragraph('公司机密')] }) },
  footers: { default: new Footer({ children: [new Paragraph({
    children: [ new TextRun({
      children: ['第 ', PageNumber.CURRENT, ' 页 / 共 ', PageNumber.TOTAL_PAGES, ' 页'],
    }) ],
  })] }) },
  children: [new Paragraph('正文')],
}]
```

<div v-click class="mt-2 text-sm">

> 页眉脚是**节级**；页码是**字段**，由 Word 打开时计算，不能用 JS 自己算。

</div>

<!--
页眉页脚是节级配置，写在 section 上，用 Header 和 Footer 对象。

headers 传一个对象，default 是默认页眉，值是 new Header，children 放段落。footers 同理。

页码怎么来？用 PageNumber.CURRENT 当前页和 PageNumber.TOTAL_PAGES 总页数，把它们放进 TextRun 的 children 数组，跟文字字符串混在一起，就拼出第几页共几页。

底下两个关键。第一，页眉页脚是节级的，每个节可以不一样，default 是默认或奇数页，还有 first 首页需要 titlePage true、even 偶数页需要文档级开关。第二，页码是字段 field，生成时还不知道分页，所以必须用 PageNumber 这两个常量，绝对不能用 JS 自己算页数填进去。
-->

---

# 命名样式：像 CSS 一样复用

```ts
const doc = new Document({
  styles: { paragraphStyles: [{
    id: 'myHeading',                       // 引用用的 id
    name: 'My Heading',
    run: { size: 32, bold: true, color: '2E74B5' }, // 字符级
    paragraph: { spacing: { after: 120 } },          // 段落级
  }] },
  sections: [{ children: [
    new Paragraph({ text: '标题', style: 'myHeading' }), // 用 id 引用
  ] }],
})
```

<div v-click class="mt-2 text-sm">

> ⚠️ 用了 `heading`/列表，就要定义对应 `HeadingX`/`ListParagraph` 样式，否则显示成默认。

</div>

<!--
重复的样式别每段写一遍，用命名样式集中管理，思路跟外部 CSS 一样。

在文档的 styles 里定义，常用 paragraphStyles 数组。每个样式有 id 用来引用，name 是 UI 显示名，run 是字符级配置比如字号加粗颜色，paragraph 是段落级配置比如段后间距。还能用 basedOn 继承、next 指定下一段样式。

段落用 style 属性传 id 就能引用，一处定义、多处复用。

底下这条警告很重要：如果你用了内置的 headingX、title，或者列表，就必须确保在 styles 里定义了对应的 HeadingX、Title、ListParagraph 样式，否则它们会显示成没套样式的默认样子。这是「标题/列表样式丢失」最常见的原因。
-->

---

# 多 section：分区排版

```ts
import { PageOrientation } from 'docx'

const doc = new Document({
  sections: [
    { children: [new Paragraph('封面')] },   // 第 1 节
    {
      properties: { page: { size: { orientation: PageOrientation.LANDSCAPE } } },
      children: [new Paragraph('横向附录')], // 第 2 节横向
    },
  ],
})
```

<v-clicks>

- 每个 section 各带页面布局 / 页眉脚 / 页码规则
- 典型：封面、正文、附录各一套版式，仍是**同一个** `.docx`

</v-clicks>

<!--
什么时候用多个 section？当文档不同区段需要不同的页面设置时。

看例子：sections 放两个节。第一个节是封面，普通设置。第二个节在 properties.page.size 里设 orientation 为 LANDSCAPE 横向，所以这一节是横向纸张，适合放宽表格。

两个要点。第一，每个 section 都能带自己的 properties 页面属性、headers、footers、页码规则，互不影响。第二，典型用法是封面、正文、附录各一套版式，比如正文从第一页重新计数、封面不计入，附录横向。但注意，不管多少个节，最后都打包进同一个 .docx 文件，不是多个文件。

页码重启也在节里配，properties.page.pageNumbers 设 start。
-->

---

# Packer：四种导出 + 环境差异

| 方法 | 返回 | 场景 |
|---|---|---|
| `toBuffer` | Node Buffer / 浏览器 Uint8Array | Node 写盘、HTTP 响应 |
| `toBlob` | Blob | 浏览器下载（配 `saveAs`） |
| `toBase64String` | string | 内嵌、传输 |
| `toStream` | 可读流 | Node 流式写大文件 |

```ts
Packer.toBuffer(doc).then(buf => fs.writeFileSync('out.docx', buf)) // Node
Packer.toBlob(doc).then(blob => saveAs(blob, 'out.docx'))           // 浏览器
```

<!--
Packer 跟 Document 完全解耦，提供四种导出，全是异步的。

toBuffer 在 Node 返回 Buffer，注意在浏览器里返回的是 Uint8Array，因为浏览器没有 Node 的 Buffer；它适合 Node 写盘或者直接作为 HTTP 响应体。toBlob 返回 Blob，浏览器下载用，配合 FileSaver 的 saveAs。toBase64String 返回 Base64 字符串，适合内嵌、传输、邮件附件。toStream 返回可读流，Node 里流式写超大文档、降低内存峰值。

底下两行是最常用的对照：Node 用 toBuffer 加 fs 写盘，浏览器用 toBlob 加 saveAs 下载。

这里最大的陷阱就是 toBuffer 跨环境返回类型不同，下一页专门讲浏览器。
-->

---

# 浏览器：没有 fs，用 Blob 下载

```ts
import { Document, Packer, Paragraph } from 'docx'
import { saveAs } from 'file-saver'

const doc = new Document({ sections: [{ children: [new Paragraph('Hi')] }] })

Packer.toBlob(doc).then((blob) => saveAs(blob, 'example.docx'))
```

<v-clicks>

- 浏览器**没有 Node `fs`**，不能 `import fs` / `writeFileSync`
- 生成逻辑两端通用，只有「落地」方式不同
- `toBuffer` 在浏览器返回 `Uint8Array`，下载首选 `toBlob`

</v-clicks>

<!--
前端项目里用 docx，特别要注意文件系统。

浏览器没有 Node 的 fs，所以不能 import fs，也不能 toBuffer 之后 writeFileSync。正确做法是 Packer.toBlob 拿到 Blob，再用 FileSaver 的 saveAs 触发下载，或者自己用 URL.createObjectURL 加一个 a download 元素点击。

看代码，生成 Document 的部分跟 Node 一模一样，只有最后导出换成 toBlob 加 saveAs。

三条要点。第一，浏览器没有 fs，别 import fs。第二，生成对象树的代码两端完全通用，Document、Paragraph、TextRun 都一样，只有落地方式不同。第三，toBuffer 在浏览器返回的是 Uint8Array 而不是 Node Buffer，所以浏览器下载首选 toBlob，别在 toBuffer 的返回值上假设它是 Buffer。
-->

---

# patchDocument：往模板打补丁

```ts
import { patchDocument, PatchType, TextRun, Paragraph } from 'docx'

const out = await patchDocument({
  outputType: 'nodebuffer',
  data: fs.readFileSync('template.docx'),  // 已有 .docx 模板
  patches: {
    name:  { type: PatchType.PARAGRAPH, children: [new TextRun('John')] },  // 段内替换
    intro: { type: PatchType.DOCUMENT,  children: [new Paragraph('整段')] }, // 块级替换
  },
})
```

<div v-click class="mt-2 text-sm">

> 模板里写 `{{name}}` 占位；`PARAGRAPH` 段内替换、`DOCUMENT` 块级替换。

</div>

<!--
docx 除了从零生成，还能在已有的 .docx 模板上打补丁，这就是 patchDocument。

模板文件里用 mustache 风格写占位符，比如双大括号 name。调用 patchDocument 时，outputType 指定输出形态比如 nodebuffer，data 传模板的二进制，patches 是补丁映射。

每个补丁有 type 和 children。type 取 PatchType.PARAGRAPH 表示在段落内部替换片段，或者 PatchType.DOCUMENT 表示替换整段、插入块级元素比如表格。

底下一句话：模板里写双大括号占位符，PARAGRAPH 段内替换、DOCUMENT 块级替换。这个能力跟 docxtemplater 思路相近，但 API 贴近 docx。下一页就讲它俩怎么选。
-->

---

# 选型：docx vs docxtemplater vs mammoth

| 维度 | docx | docxtemplater | mammoth |
|---|---|---|---|
| 方向 | **生成 / 修改** | 模板填充 | **解析 / 读取** |
| 典型 | 代码从零搭 | 模板填 `{{占位}}` | `.docx` → HTML |
| 复杂既有版式 | 成本高 | **强** | — |
| 动态结构 | **强** | 一般 | — |

<v-clicks>

- 结构高度可变、**数据驱动从零生成** → **docx**
- 设计师排好模板、只**填数据** → **docxtemplater**
- 把上传的 `.docx`**读出来展示** → **mammoth**

</v-clicks>

<!--
这三个库经常一起出现，方向其实完全不同，别选错。

docx 是生成和修改，典型用法是用代码从零搭结构，动态结构最强，但复刻设计师排好的复杂版式成本高。docxtemplater 是模板填充，设计师在 Word 里排好版、代码只往双大括号占位符里填数据，保留原版式最强。mammoth 是解析读取，把已有 .docx 转成 HTML 或纯文本。

底下给经验法则。结构高度可变、数据驱动从零生成，选 docx。设计师已经排好精美模板、你只想填数据，选 docxtemplater。要把用户上传的 .docx 读出来在网页展示，选 mammoth。

三者并不互斥，可以用 docxtemplater 填模板、再用 mammoth 把结果转 HTML 做预览。关键是分清方向：生成、填充、还是解析。
-->

---

# 单位与避坑速记

<v-clicks>

- **字号 `size`**：half-points 半磅，pt **×2**（12pt → 24）
- **间距 / 宽度 / 页边距**：twips（DXA），1pt = 20，1in = 1440
- **图片 / 浮动偏移**：EMU，1in = 914400
- **颜色**：不带 `#` 的 6 位 hex（`'FF0000'`）
- 斜体是 `italics`（复数）；单元格里放 `Paragraph` 不能塞字符串
- 用 `heading`/列表 → 要在 `styles` 定义对应样式

</v-clicks>

<div v-click class="mt-3 text-sm">

> 用工厂 / `map` 按数据**新建**元素，别把同一对象塞到树多处。

</div>

<!--
这一页是避坑速记，把前面散落的坑集中起来。

第一，三套单位别混：字号 size 是半磅，想要的磅数乘以 2；段间距、表格宽度、页边距是 twips，一磅二十分之一，一英寸 1440；图片和浮动偏移是 EMU，一英寸 914400。

第二，颜色一律用不带井号的六位十六进制，比如 FF 00 00。

第三，斜体属性名是 italics 复数；单元格里放的是 Paragraph，不能直接塞字符串。

第四，只要用了 heading 或列表，就得在 styles 里定义对应的 Heading、ListParagraph 样式，否则显示成默认。

最后底下一条最佳实践：用工厂函数或者 map 按数据每次新建元素实例，别为了省内存把同一个对象引用塞到对象树的多个位置，那样容易出歧义。
-->

---
layout: intro
---

# 总结

docx = **用代码声明式生成 Word，不依赖 Office**

- 模型：`Document → Section → Paragraph → TextRun`
- 文本样式落 `TextRun`，段落样式落 `Paragraph`
- 表格 / 图片 / 页眉脚 / 列表 / 目录 / 命名样式全覆盖
- 导出：Node `toBuffer` 写盘、浏览器 `toBlob` 下载
- 单位：字号半磅、间距 twips、绘图 EMU
- 选型：生成用 docx、填模板用 docxtemplater、解析用 mammoth

<!--
总结一下。

docx 的本质，是用代码声明式地生成 Word 文档，不依赖 Office，纯 JS 产出 OOXML，跨 Node 和浏览器。

技术要点回顾。对象模型是 Document、Section、Paragraph、TextRun 四层嵌套。样式分两级：字符样式落 TextRun，段落样式落 Paragraph。功能上表格、图片、页眉页脚、列表编号、目录、命名样式全都覆盖。导出靠 Packer，Node 用 toBuffer 写盘、浏览器用 toBlob 下载，记住 toBuffer 在浏览器返回 Uint8Array。单位三套别混：字号半磅、间距和宽度 twips、绘图和浮动 EMU。

最后是选型这条主线：要从零按数据生成，用 docx；设计师排好模板只填数据，用 docxtemplater；把已有 .docx 读出来展示，用 mammoth。分清生成、填充、解析三个方向，就不会选错工具。谢谢大家。
-->
