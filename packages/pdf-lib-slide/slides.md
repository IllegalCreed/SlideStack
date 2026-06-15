---
theme: seriph
background: https://cover.sli.dev
title: pdf-lib
info: |
  Presentation pdf-lib — create and modify PDFs in any JavaScript environment.

  Learn more at [https://pdf-lib.js.org/](https://pdf-lib.js.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📄</span>
</div>

<br/>

## pdf-lib — 创建与「修改既有」PDF

纯 JavaScript，在浏览器 / Node / Deno / React Native 都能跑。独占「修改既有 PDF」生态位：load 后加页、画字、盖章、填表单

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/Hopding/pdf-lib" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 pdf-lib：一个用纯 JavaScript 创建并修改 PDF 的库。

官方一句话定位：Create and modify PDF documents in any JavaScript environment。关键词是 modify——修改既有 PDF，这是它区别于其它库的核心，也是 JS 生态里的稀缺能力。它纯 JS、零原生依赖，浏览器、Node、Deno、React Native 同一套 API。

主线：为什么用它 → create/load 双入口 → 坐标系 → 画字画图 → 字体与中文 → 修改既有 PDF → 合并 → 表单 → 输出 → 维护现状与选型 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 pdf-lib

<v-clicks>

- 要给一份**现成 PDF** 盖章 / 加水印 / 填表单
- 要把几份 PDF **合并**成一份
- 要在**浏览器**里生成 PDF，不想依赖后端
- jsPDF 只能**新建**，改不了既有文件

</v-clicks>

<div v-click class="mt-6">

pdf-lib 的回应：

- `load` 既有 PDF → **能改**
- 纯 JS、零原生依赖 → **到处跑**
- 表单读写 + flatten → **填好固化**

</div>

<!--
为什么需要 pdf-lib？几个典型场景。

第一，你手里有一份现成的 PDF，要盖章、加水印、填表单——不是从零生成。第二，要把好几份 PDF 合并成一份。第三，想在浏览器里直接生成 PDF，不想为这点事搭后端。第四，常见替代 jsPDF 只能从零新建，改不了既有文件。

pdf-lib 针对性地回应：load 进来就能改；纯 JS 零原生依赖，浏览器、Node、Deno、RN 都能跑；表单能读写、还能 flatten 扁平化把填好的内容固化成不可编辑。这就是今天的主线。
-->

---

# 两个入口：create 与 load

```ts
import { PDFDocument } from 'pdf-lib'

// 从零新建
const doc = await PDFDocument.create()

// 载入既有 PDF（这是招牌能力）
const doc2 = await PDFDocument.load(existingBytes)
```

<v-clicks>

- `create()` → 空文档；`load(bytes)` → 载入既有
- `load` 接受 `Uint8Array` / `ArrayBuffer` / base64
- 构造函数不公开，**必须**走静态工厂

</v-clicks>

<!--
pdf-lib 有两个入口，先分清。

PDFDocument.create 从零新建一个空文档。PDFDocument.load 载入一份既有 PDF——这是它的招牌能力，jsPDF 没有。

load 接受三种输入：Uint8Array 字节、ArrayBuffer、或 base64 字符串。Node 里常配 fs.readFileSync，浏览器里常配 fetch 后取 arrayBuffer。

注意 PDFDocument 的构造函数是受保护的，不能 new，必须通过 create 或 load 这两个静态工厂创建。两个方法都返回 Promise，记得 await。
-->

---

# 头号坑：坐标系

```ts
const page = doc.addPage([595.28, 841.89]) // A4，单位 point
const { width, height } = page.getSize()

// 放顶部：y 要用 height 减边距！
page.drawText('Top', { x: 40, y: height - 40, size: 12, font })
```

<v-clicks>

- 原点在**左下角**，y 轴**向上**为正
- y 越大越靠**顶部**（与 canvas / CSS 相反）
- 单位是 **point**：72pt = 1 英寸

</v-clicks>

<!--
开始画之前，必须先记住坐标系，这是头号新手坑。

PDF 的坐标原点在页面左下角，y 轴向上为正。所以 y 越大越靠近顶部。这和 canvas、CSS 的左上角原点、y 向下完全相反。

后果是：你想把文字放到页面顶部，y 不能写一个小数字，要写 height 减去边距，比如 height - 40。height 从 page.getSize 拿。

单位是 point，72 point 等于 1 英寸，A4 大约是 595 乘 842 point。把这条记牢，定位就不会上下颠倒。
-->

---

# 画字与画图

```ts
import { StandardFonts, rgb } from 'pdf-lib'

const font = await doc.embedFont(StandardFonts.Helvetica)
page.drawText('Hello', { x: 50, y: 700, size: 24, font, color: rgb(0, 0, 0) })

const img = await doc.embedPng(pngBytes)   // JPEG 用 embedJpg
const d = img.scale(0.5)                    // 等比缩放
page.drawImage(img, { x: 50, y: 300, width: d.width, height: d.height })
```

<v-clicks>

- 字体也要先 `embedFont` 拿 PDFFont 对象再用
- 颜色用 `rgb(r,g,b)`，分量 **0~1**（不是 0~255）
- 图片先 `embed` 再 `drawImage`

</v-clicks>

<!--
画字和画图是核心动作，统一用 draw 加名词。

写字用 drawText，但字体要先 embedFont 拿到 PDFFont 对象再传给 font 选项——即使是标准字体也要 embed，font 不能直接传字符串名。

颜色用 rgb 辅助函数，三个分量是 0 到 1 的小数，不是 0 到 255。红色是 rgb(1,0,0)，黑色是 rgb(0,0,0)。不传 color 默认黑色。

图片同理：先 embedPng 或 embedJpg 嵌入得到 PDFImage，再 drawImage 画上去。用 img.scale(0.5) 可以等比缩放，把返回的 width、height 喂给 drawImage。
-->

---
layout: two-cols-header
---

# 标准字体 vs 中文

::left::

**标准 14 字体**

```ts
StandardFonts.Helvetica
StandardFonts.TimesRoman
StandardFonts.Courier
// 只支持 WinAnsi(Latin)
// 写中文会乱码/报错
```

::right::

**中文要嵌字体**

```ts
import fontkit from
  '@pdf-lib/fontkit'

doc.registerFontkit(fontkit)
const cn = await doc.embedFont(
  fontBytes, { subset: true })
```

<div class="mt-2 text-sm">

> 标准字体缺中文**字形**，不是编码问题。`subset:true` 让中文字体从 MB 降到几十 KB。

</div>

<!--
字体是中文用户最关心的点。

左边，标准 14 字体：Helvetica、TimesRoman、Courier 等。它们只支持 WinAnsi，也就是约 218 个 Latin 字符，根本不含中文。用 Helvetica 写中文会乱码或报错——根因是缺字形，不是编码问题，给 encoding 设 utf-8 没用。

右边，写中文必须嵌入支持中文的自定义字体，比如思源黑体。两步：先 import fontkit 并 registerFontkit 注册——嵌自定义字体前这步不能少，否则 embedFont 抛错；然后 embedFont 传字体字节。

强烈建议加 subset: true 开启子集化，只嵌入用到的字形。中文字体动辄好几兆，子集化后通常只剩几十 KB。
-->

---

# 招牌能力：修改既有 PDF

```ts
const doc = await PDFDocument.load(existingBytes)
const font = await doc.embedFont(StandardFonts.Helvetica)

for (const page of doc.getPages()) {
  const { width, height } = page.getSize()
  page.drawText('CONFIDENTIAL', {
    x: width / 2 - 150, y: height / 2, size: 50, font,
    color: rgb(0.6, 0.6, 0.6), opacity: 0.3, rotate: degrees(45),
  })
}
```

<div v-click class="mt-2 text-sm">

> drawText 是**叠加**在原内容之上：不替换、也无法改写原有文字。

</div>

<!--
这一页是 pdf-lib 的灵魂：修改既有 PDF。

load 进来一份现成 PDF，遍历每一页 getPages，在每页中间叠加一行半透明、倾斜 45 度的水印。opacity 控制不透明度 0 到 1，rotate 用 degrees 包装角度。这就是一个给整份 PDF 批量加水印的完整逻辑。

要强调一个边界：drawText 是叠加绘制，把新内容画在原内容之上。它不替换原文字，也无法定位、改写 PDF 里已经存在的某段文字。批注、盖章、补字段都靠这种叠加；想把原文里某个词改掉，pdf-lib 做不到。
-->

---

# 合并多个 PDF：copyPages

```ts
const merged = await PDFDocument.create()

for (const bytes of [bytesA, bytesB, bytesC]) {
  const src = await PDFDocument.load(bytes)
  const pages = await merged.copyPages(src, src.getPageIndices())
  pages.forEach((p) => merged.addPage(p))
}

const out = await merged.save()
```

<v-clicks>

- 无一键 merge：靠 `copyPages` + `addPage` 循环
- 跨文档**必须先 copyPages 过户**，不能直接 addPage 别人的页
- `getPageIndices()` 返回 `[0,1,…]`，复制全部页

</v-clicks>

<!--
合并是高频需求。pdf-lib 没有一键 merge，标准做法是循环 copyPages 加 addPage。

新建一个目标文档，对每份源 PDF：load 进来，用 merged.copyPages 把源页复制过来，再逐页 addPage 放进目标文档。

关键点：跨文档不能直接把别人的 page 对象 addPage 进来，必须先 copyPages 过户——它会连同页面用到的字体、图像资源一起搬过来，否则资源引用会错乱。

getPageIndices 返回 0 到 n-1 的数组，方便复制全部页；只要某几页就传 [0,2] 这样的数组。拆分 PDF 是同理，反过来抽页就行。
-->

---

# 表单：填写与扁平化

```ts
const form = doc.getForm()

form.getTextField('Age').setText('24')
form.getCheckBox('agree').check()
form.getRadioGroup('gender').select('male')
form.getDropdown('country').select('China')

form.flatten()              // 固化为不可编辑
```

<v-clicks>

- `getForm` → 按字段名取：TextField / CheckBox / RadioGroup …
- 文本 `setText`、复选 `check`、单选/下拉 `select`
- `flatten()` 把字段烘焙成页面内容，不再可填

</v-clicks>

<!--
表单是 pdf-lib 的强项。getForm 拿到表单对象，再按字段名取具体字段。

文本框用 getTextField 加 setText 填值；复选框用 getCheckBox 加 check 或 uncheck；单选组、下拉、列表都用 select 选值。取可能不存在的字段，用 getFieldMaybe，找不到返回 undefined 而不抛错。

最后 flatten 扁平化：把所有字段的外观烘焙成页面静态内容、移除控件，PDF 就不再可填写了。这适合生成最终交付件、防止别人改动。

一个中文坑：字段默认用 Helvetica 生成外观，写不出中文。解决办法是嵌入中文字体后调用 form.updateFieldAppearances 传入这个字体，重绘字段外观。
-->

---

# 输出：save 返回字节，自己落地

```ts
const bytes = await doc.save()   // Uint8Array

// Node：写盘
fs.writeFileSync('out.pdf', bytes)

// 浏览器：Blob 下载
const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
const a = document.createElement('a')
a.href = url; a.download = 'out.pdf'; a.click()
```

<v-clicks>

- `save()` 返回 **Uint8Array**，落地要你自己来
- 要 base64 / data URI：`saveAsBase64({ dataUri: true })`
- 老阅读器打不开：`save({ useObjectStreams: false })`

</v-clicks>

<!--
最后是输出。save 返回的是 Uint8Array 字节，它不替你落地，落地要你自己来。

Node 里直接 fs.writeFileSync 写盘，writeFileSync 接受 Uint8Array，不用转 Buffer 也不用转 base64。

浏览器里没有文件系统：用字节构造 Blob，createObjectURL 得到 URL，建一个隐藏的 a 标签设 download 再 click 触发下载，用完记得 revokeObjectURL 释放。

两个实用选项：想直接拿 base64 塞进 iframe 预览，用 saveAsBase64 传 dataUri true。极少数老旧阅读器打不开时，save 传 useObjectStreams false 关掉对象流压缩，体积略大但兼容性更好。
-->

---

# ⚠️ 维护现状：原库已停滞

| 维度 | Hopding/pdf-lib | @cantoo/pdf-lib |
|---|---|---|
| 最新稳定版 | **1.17.1（2021）** | **2.x（活跃）** |
| 维护 | **基本停滞** | 活跃 |
| API | —— | **高度兼容** |

```ts
// 需要新特性/修复：换 fork，多半只换导入
import { PDFDocument } from '@cantoo/pdf-lib'
```

<div v-click class="mt-2 text-sm">

> `@cantoo/pdf-lib` 是社区 **fork**，不是官方改名；原库仍在 npm、未删库。

</div>

<!--
这一页是选型时最该知道的现状，务必记住。

原仓库 Hopding/pdf-lib 的 npm 最新稳定版长期停在 1.17.1，那是 2021 年底发的，master 分支也多年没更新，维护基本停滞。但它的周下载量仍然有几百万，生态还在大量使用。

社区维护的活跃 fork 是 @cantoo/pdf-lib，已经发到 2.x，持续修 bug、加特性，而且 API 跟原库高度兼容。

所以如果你需要新特性或者修复，最稳妥的做法是换到这个 fork，迁移多半只需要把 import 的包名从 pdf-lib 换成 @cantoo/pdf-lib，其它代码基本不动。

要澄清：@cantoo/pdf-lib 是社区 fork，不是官方改名；原库仍在 npm 上、仓库没有 archive、没删库，只是停更。
-->

---

# 选型：pdf-lib vs jsPDF vs PDF.js

| 需求 | 选谁 |
|---|---|
| 改 / 合并 / 拆既有 PDF | **pdf-lib** |
| 填表单 + 扁平化 | **pdf-lib** |
| 纯从零生成 + html() 便利 | jsPDF |
| 读出 PDF 文字 / 渲染到屏幕 | **PDF.js** |
| HTML → PDF | Puppeteer(page.pdf) |

<div v-click class="mt-4 text-sm">

> pdf-lib **不做**：抽取文字、屏幕渲染、改写原文字、解密、HTML 转 PDF。

</div>

<!--
横向选型，一张表说清。

要修改、合并、拆分既有 PDF，或者填表单加扁平化，选 pdf-lib，这是它的独占能力。

如果只是纯从零生成报表，还想要 html 这类便利方法，可以考虑 jsPDF——但注意它的 html 插件基于 html2canvas，效果有限。

要读出 PDF 里已有的文字、或者把 PDF 渲染到屏幕上，pdf-lib 和 jsPDF 都不行，那是 PDF.js 的活。

要把 HTML 页面转成 PDF，用 Puppeteer 的 page.pdf 这类无头浏览器方案。

再强调 pdf-lib 的边界：它不抽取文字、不做屏幕渲染、不能改写原有文字、不解密加密 PDF、不解析 HTML。划清边界，就不会用错工具。
-->

---
layout: intro
---

# 总结

pdf-lib = **能「改既有」的纯 JS PDF 库**

- 双入口：`create` 新建 / `load` 改既有
- 坐标：**左下原点、y 向上**，单位 point
- 画：`drawText` / `drawImage`，颜色 `rgb` 0~1
- 中文：`registerFontkit` + `embedFont(subset:true)`
- 改既有：水印 / 合并 copyPages / 表单 flatten
- 输出：`save()` → Uint8Array，自己落地
- 现状：原库停滞，新项目用 **@cantoo/pdf-lib**

<!--
总结一下。

pdf-lib 的本质，是一个能修改既有 PDF 的纯 JS 库，这是它和 jsPDF 最大的区别。

技术要点：两个入口，create 新建、load 改既有；坐标系是左下角原点、y 向上，单位 point，这是头号坑；画字画图用 drawText、drawImage，颜色用 rgb，分量 0 到 1；中文要 registerFontkit 加 embedFont 并开 subset；改既有的招牌玩法是加水印、用 copyPages 合并、表单填写加 flatten 扁平化；输出 save 返回 Uint8Array，落地自己来。

最后再强调今天最重要的现状：原库 Hopding/pdf-lib 已经停滞在 1.17.1，新项目如果要长期维护、需要新特性，优先用社区活跃 fork @cantoo/pdf-lib，API 兼容、迁移成本极低。谢谢大家。
-->
