---
theme: seriph
background: https://cover.sli.dev
title: PDF.js — 浏览器里的 PDF 解析与渲染
info: |
  Presentation PDF.js（pdfjs-dist）— 解析与渲染 PDF 的 Web 引擎。

  Learn more at [https://mozilla.github.io/pdf.js/](https://mozilla.github.io/pdf.js/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📄</span>
</div>

<br/>

## PDF.js — 解析与渲染 PDF

Mozilla 出品、Firefox 内置阅读器的引擎。用 worker 解析、把页面渲染到 canvas。npm 包名 `pdfjs-dist`，版本基线 6.0.x。**只解析/渲染，不生成 PDF**

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/mozilla/pdf.js" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 PDF.js，npm 包名 pdfjs-dist，Mozilla 出品，也是 Firefox 内置 PDF 阅读器的底层引擎。

官方一句话定位：a general-purpose, web standards-based platform for parsing and rendering PDFs。基于 Web 标准、用 HTML5 的 Canvas 在浏览器里解析并渲染 PDF。

贯穿全场的一条边界，先立在这里：PDF.js 只做解析和渲染，不生成 PDF。生成是 jsPDF、pdf-lib 的事。这是最常见的误解。

主线：为什么用它 → 核心链路 → worker → 渲染一页 → 高分屏 → 文本层 → 注解层 → 加载来源 → CJK 字体 → 大文档性能 → 构建与打包 → 生态 → 选型 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用它

<v-clicks>

- 浏览器原生看 PDF，不依赖插件
- 同一套渲染，跨平台一致
- 久经考验：Firefox 阅读器同源
- 不只渲染：还能抽文本、读元数据

</v-clicks>

<div v-click class="mt-6">

它的取舍：

- canvas 渲染 → **位图**，文字要另叠文本层
- worker 解析 → **不卡 UI**
- 偏底层 → 画布/HiDPI/生命周期要自己管

</div>

<!--
为什么用 PDF.js？四个理由。第一，纯前端在浏览器里渲染 PDF，不依赖已被淘汰的浏览器插件。第二，同一套渲染逻辑，各平台表现一致。第三，它和 Firefox 内置阅读器同源，覆盖了大量真实世界里格式很脏的 PDF，兼容性久经考验。第四，它不只渲染，还能抽文本、读元数据、渲染链接和表单。

取舍也要先讲清楚。它把页面画到 canvas，产出是位图，所以文字默认不能选，要可选可搜得自己叠一层文本层。它把解析放进 worker，所以主线程不卡。但它的 display API 偏底层，画布、高分屏、生命周期都要你自己处理，这也是 react-pdf 这类封装存在的原因。
-->

---

# 核心链路：四步对象流

```ts
// 1) 加载任务 → await .promise 得到文档
const pdf = await pdfjsLib.getDocument({ url }).promise
// 2) 取页（页码 1 基！）
const page = await pdf.getPage(1)
// 3) 算视口（尺寸 + 变换）
const viewport = page.getViewport({ scale: 1.5 })
// 4) 渲染到 canvas（返回 RenderTask）
await page.render({ canvas, viewport }).promise
```

<v-clicks>

- `getDocument` 给的是**任务**，不是文档
- 页码**从 1 开始**，没有 `pages[]` 数组
- `render` 也给**任务**，要 `await .promise`

</v-clicks>

<!--
核心就是这条四步链路，记牢它，PDF.js 就懂了大半。

第一步，getDocument 接收一个参数对象，常用 url 或 data。注意它返回的不是文档，而是一个加载任务 loadingTask，要 await 它的 promise 才拿到文档对象 PDFDocumentProxy。

第二步，pdf.getPage 取某一页，关键坑：页码是 1 基，第一页是 getPage(1)，传 0 非法；也没有同步的 pages 数组，页面一律按需取。

第三步，page.getViewport 按 scale 算出这一页的像素尺寸和坐标变换。

第四步，page.render 把页面画到 canvas，它返回的同样是个任务 RenderTask，await 它的 promise 表示渲染完成。三个对象：文档、页面、视口，外加两个任务对象，就是全部骨架。
-->

---

# worker：绕不开的前置

```ts
// 使用前必设，指向同版本的 worker 脚本
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString()
```

<v-clicks>

- PDF 解析 CPU 密集 → 放 **Web Worker** 后台，主线程只绘制
- 不配 → 退化「fake worker」在主线程跑，**卡 UI**
- 主库与 worker **必须同版本**，否则报版本不匹配

</v-clicks>

<!--
worker 是 PDF.js 的核心机制，不是可选优化，所以单独一页。

为什么要 worker？PDF 的解析，包括解压、字体处理、构建绘制指令，是 CPU 密集的同步活儿。PDF.js 把这部分搬到 Web Worker 后台线程，主线程只负责把指令画到 canvas，这样滚动、点击都不卡。

用之前必须设 GlobalWorkerOptions.workerSrc，指向 pdf.worker.mjs。这里给的是最稳的写法：用 new URL 配 import.meta.url，让 Vite、webpack 把 worker 作为资源正确产出，避免写死相对路径在构建后 404。

两个高频坑：第一，不配 workerSrc，PDF.js 会退化成 fake worker 在主线程解析，卡 UI；第二，主库 pdf.mjs 和 worker pdf.worker.mjs 版本不一致，会直接报 The API version does not match the Worker version，所以务必来自同一个 pdfjs-dist 安装。
-->

---
layout: two-cols-header
---

# 渲染一页

::left::

**最小渲染**

```ts
const page = await pdf.getPage(1)
const viewport =
  page.getViewport({ scale: 1.5 })

const canvas = document
  .getElementById('c')
canvas.width = viewport.width
canvas.height = viewport.height

await page.render({
  canvas, viewport,
}).promise
```

::right::

**要点**

<div class="mt-2 text-sm">

- canvas 宽高按 `viewport`
- 新版传 `canvas`；`canvasContext` 兼容
- `scale` 越大越清晰、越耗资源

</div>

<div v-click class="mt-3 text-sm">

> `render()` 返回 `RenderTask`：`.promise` 完成、`.cancel()` 取消。

</div>

<!--
把这页画出来。左边是最小可用代码：取第一页，getViewport 按 scale 1.5 算尺寸，按 viewport 的宽高设 canvas，然后 render，传画布和视口，await promise。

右边几个要点。canvas 的宽高一定按 viewport 来设，否则尺寸对不上。新版推荐直接传 canvas 元素，旧写法传 canvasContext，也就是 2D 上下文，仍然兼容，二选一即可。scale 是线性缩放因子，整页等比放大，越大越清晰，但内存和算力也越高。

最后强调 render 的返回值是 RenderTask，不是普通 Promise。它的 promise 表示完成，cancel 可以取消。下一页就讲为什么 cancel 很关键。
-->

---

# 翻页：取消未完成的渲染

```ts
let task = page.render({ canvas, viewport })
// 用户快速翻页时，先取消旧任务，再渲染新页
task.cancel()  // 抛 RenderingCancelledException，捕获忽略
task = nextPage.render({ canvas, viewport })
```

<v-clicks>

- 同一个 canvas **不能并发** render
- 否则报「Cannot use the same canvas during multiple render operations」
- 正解：存 `RenderTask` → 翻页 `cancel()` → 再渲染

</v-clicks>

<!--
单页应用里一个经典坑：用户快速点下一页，上一页的 render 还没画完。

对同一个 canvas 同时跑两个 render，PDF.js 会直接报错：Cannot use the same canvas during multiple render operations。它不会自动排队。

正确做法：保存当前的 RenderTask，翻页时先调它的 cancel，取消会抛 RenderingCancelledException，用 catch 吞掉即可，然后再开始新一页的渲染。不要用 setTimeout 固定延迟去赌，那不可靠；也不要每次翻页都重新 getDocument，代价高还是没解决并发。记住三步：存任务、取消、再渲染。
-->

---

# 高分屏（Retina）不糊

```ts
const viewport = page.getViewport({ scale: 1.5 })
const ratio = window.devicePixelRatio || 1
canvas.width = Math.floor(viewport.width * ratio)
canvas.height = Math.floor(viewport.height * ratio)
canvas.style.width = viewport.width + 'px'   // CSS 尺寸不变
canvas.style.height = viewport.height + 'px'
const transform =
  ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : null
await page.render({ canvas, viewport, transform }).promise
```

<div v-click class="mt-2 text-sm">

> 物理像素按 `devicePixelRatio` 放大，CSS 尺寸保持视口大小，render 传对应 `transform`——官方 helloworld 同款。

</div>

<!--
在 Retina 这类高分屏上，如果让 canvas 的像素尺寸直接等于 CSS 尺寸，画面会糊。

官方 helloworld 的处理：取 devicePixelRatio，把 canvas 的像素宽高乘以这个比例，也就是用更多物理像素绘制；而 CSS 尺寸，即 style.width，仍然保持视口的逻辑像素大小；最后在 render 里传一个缩放 transform 矩阵，把绘制放大到物理像素。

这样在 2 倍屏上就用 2 倍像素画再缩放显示，文字和线条都很锐利。千万别用 CSS 的 image-rendering pixelated 去硬撑，那是把位图放大成马赛克，并不能提升渲染清晰度。
-->

---

# 文本层：让文字可选/可搜

```ts
// canvas 是位图，文字默认不能选！需叠文本层
const textLayer = new pdfjsLib.TextLayer({
  textContentSource: await page.getTextContent(),
  container: textLayerDiv,   // 绝对定位、叠在 canvas 上
  viewport,                  // 必须与 canvas 同 viewport
})
await textLayer.render()
```

<v-clicks>

- `getTextContent().items[]`：`str` 文本 + `transform` 位置
- 新版用 **`TextLayer` 类**（旧 `renderTextLayer` 已弃用）
- 两层 scale/rotation 不一致 → 文字错位

</v-clicks>

<!--
非常重要的一页。canvas 渲染出来的是位图，文字只是画上去的图，没有文本语义，用鼠标选不中、也搜不了。

要可选中、可复制、可搜索，得额外建一个文本层。做法：用 getTextContent 拿到这页所有文本片段，每个片段 items 里有 str 是文本、transform 是它在页面上的位置和缩放矩阵；然后用 TextLayer 类，传文本内容源、一个叠在 canvas 之上的容器 div、以及和 canvas 同一个 viewport，调 render，它会把一堆透明定位的 span 铺到对应位置。

两个关键：第一，新版用 TextLayer 类，旧的函数式 renderTextLayer 已经弃用，控制台会提示你换；第二，文本层和 canvas 必须用一致的 scale 和 rotation，否则文字和图错位。整本搜索高亮也是基于这一层。
-->

---

# 注解层：链接与表单

```ts
const annotationLayer = new pdfjsLib.AnnotationLayer({
  div: annotationLayerDiv, viewport, page,
})
await annotationLayer.render({
  annotations: await page.getAnnotations(),
  viewport,
})
```

<v-clicks>

- 链接、表单控件、批注 = **注解**
- 需 `getAnnotations()` + `AnnotationLayer` 类
- 三层叠放：canvas 位图 → 文本层 → 注解层

</v-clicks>

<!--
第三层：注解层。PDF 里的链接、表单输入框、按钮、批注，统称注解。canvas 只会把它们画成静态像素，不可交互。

要让链接可点、表单可填，得用 getAnnotations 拿注解数据，再用 AnnotationLayer 类把对应的 DOM 元素叠在 canvas 上。

到这里就凑齐了完整的三层结构，从下到上：最底是 canvas 位图层负责画面，中间是文本层负责选择和搜索，最上是注解层负责交互。一个功能完整的 PDF 阅读器，就是这三层的叠加。自己手写要管好三层的对齐和层级，这也是为什么很多人直接用封装库。
-->

---

# 加载来源：url 与 data

```ts
// 远程 URL（跨域要服务端配 CORS）
await pdfjsLib.getDocument({ url: '/a.pdf' }).promise

// 用户本地文件：先转二进制再用 data
const buf = await file.arrayBuffer()
await pdfjsLib.getDocument({ data: buf }).promise

// 需要凭据
getDocument({ url, withCredentials: true,
  httpHeaders: { Authorization: 'Bearer x' } })
```

<v-clicks>

- `data` 推荐 `Uint8Array`（会转移给 worker）
- 跨域失败 = 目标服务器没配 CORS，PDF.js 绕不过
- 口令保护：`getDocument({ url, password })`

</v-clicks>

<!--
加载来源主要两种。远程用 url，但跨域受同源策略约束，失败通常是目标服务器没返回 Access-Control-Allow-Origin，要服务端放行，PDF.js 端绕不过去。

用户用 input 选的本地文件，不能直接当 url，要先 file.arrayBuffer 读成二进制，再用 data 传。注意别用 FileReader.readAsText，那会破坏二进制。data 官方推荐 Uint8Array，它内存紧凑，而且会被转移给 worker 线程，省主线程内存，转移后主线程别再用这个数组。

要带 Cookie 或鉴权头，用 withCredentials 和 httpHeaders，这是 HTTP 传输层鉴权。注意它和 password 不是一回事，password 是解 PDF 文档内部加密的。受口令保护的文件缺密码会抛 PasswordException。
-->

---

# CJK / 字体：方块的根因

```ts
await pdfjsLib.getDocument({
  url,
  cMapUrl: '/pdfjs/cmaps/',          // Adobe CMap 资源
  cMapPacked: true,                  // 自带的是打包格式
  standardFontDataUrl: '/pdfjs/standard_fonts/',
}).promise
```

<v-clicks>

- 中文方块 = 未内嵌 CJK 字体、缺 **CMap** 数据
- 把 `pdfjs-dist` 的 `cmaps/`、`standard_fonts/` 部署成静态资源
- 与 `scale`、渲染目标**无关**

</v-clicks>

<!--
一个很常见的现象：PDF 里中文、日文显示成方块或乱码。

根因是这份 PDF 用了未内嵌的 CJK 字体编码，PDF.js 需要预置的 Adobe CMap 数据才能正确把编码映射成字形。解法是配置 cMapUrl 指向 CMap 资源目录，记得带尾斜杠，cMapPacked 设 true，因为 pdfjs-dist 自带的 cmaps 就是二进制打包格式。非内嵌的标准字体则配 standardFontDataUrl。

操作上，把 pdfjs-dist 包里的 cmaps 和 standard_fonts 两个目录作为静态资源部署，再把 URL 指给它即可。要强调：这是字体映射问题，跟你把 scale 调多大、用 canvas 还是别的渲染目标都无关，也不是 PDF.js 不支持中文，配好资源就正常。
-->

---

# 大文档：虚拟化/懒渲染

<v-clicks>

- 一次性全渲染成全分辨率 canvas → **爆内存、卡顿**
- 只渲染**视口内及邻近**页，滚出后回收
- 滚动/翻页时 `cancel()` 未完成的 RenderTask
- 非聚焦页可降低 `scale` 或用占位骨架

</v-clicks>

<div v-click class="mt-4 text-sm">

> 关键词：**按需渲染 + 取消 + 回收**。这是连续滚动阅读器的性能命门。

</div>

<!--
大文档，比如几百页的 PDF 做连续滚动阅读器，性能要专门设计。

最不能做的就是一次性把所有页都 render 成全分辨率 canvas，那会占用巨量内存，直接卡死。

正确思路是虚拟化、懒渲染：只渲染当前视口内以及前后相邻的几页，滚出视口的页面就释放或降级，用一个占位骨架顶着位置。滚动和翻页时，记得 cancel 掉那些还没画完、但已经滚走的页面的 RenderTask。对不在焦点的页，还可以用更低的 scale 渲染省资源。

一句话记住性能命门：按需渲染、取消、回收。别禁用 worker 去提速，那会把解析压回主线程，更卡。
-->

---

# 构建与打包

| 维度 | 现代构建 | legacy 构建 |
|---|---|---|
| 入口 | `build/pdf.mjs` | `legacy/build/pdf.mjs` |
| 目标 | 最新浏览器 | 老浏览器 + **Node** |
| 何时用 | 现代 Web 应用 | 报语法错 / Node 端 |

```ts
// Node 端抽文本：用 legacy，且不需要 canvas
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
```

<div v-click class="mt-2 text-sm">

> worker 路径用 `new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url)`，别写死相对路径。

</div>

<!--
构建形态。新版 pdfjs-dist 以 ES Module 为主，现代构建入口是 build 下的 pdf.mjs，面向最新浏览器，用了较新的 JS 特性。

另有一套 legacy 构建，入口在 legacy/build 下，做了向后兼容转译，面向较老的浏览器，以及在 Node.js 里使用 PDF.js 的场景。在老环境报语法或特性不支持时，首选切到 legacy 构建，主库和 worker 都用 legacy 版本，而不是把整个 PDF.js 降级到旧版。

Node 端有个实用点：纯抽文本只走 getTextContent，根本不需要 canvas，用 legacy 入口就行；只有要在 Node 里渲染成图片才需要额外的 canvas 实现。

打包器里配 worker，反复强调：用 new URL 配 import.meta.url，让 Vite、webpack 正确解析资源，别写死相对路径，否则构建后哈希和目录变化会 404。
-->

---

# 生态与选型

| 库 | 用途 |
|---|---|
| **PDF.js** | 解析 / 渲染 / 查看 |
| react-pdf / vue-pdf-embed | PDF.js 的**框架封装** |
| jsPDF | 从零**生成** PDF |
| pdf-lib | **改/拼**现有 PDF |

<v-clicks>

- 要在页面里**看/搜/选** → PDF.js（或其封装）
- 要**生成**新 PDF → jsPDF
- 要**改/拼**现有 PDF → pdf-lib

</v-clicks>

<!--
生态和选型，帮你别选错库。

react-pdf、vue-pdf-embed、ng2-pdf-viewer 这些，都是对 PDF.js 的封装，底层仍然调用 PDF.js 的 getDocument 和 render，只是对外提供框架风格的组件，帮你把 worker 配置、按页渲染、文本层注解层都处理好。它们不是竞品，依赖方向是它们依赖 PDF.js。在 React 里嫌手写麻烦，直接用 react-pdf 的 Document 和 Page 最省事。

而 jsPDF 和 pdf-lib 是另一类：jsPDF 是从零编程式生成 PDF，比如导出报表票据；pdf-lib 是修改和拼接已有 PDF，比如加水印、合并、填表单。

选型一句话：要在页面里看、搜、选 PDF，用 PDF.js 或它的封装；要生成新 PDF 用 jsPDF；要改拼现有 PDF 用 pdf-lib。
-->

---
layout: intro
---

# 总结

PDF.js = **浏览器里解析与渲染 PDF 的引擎**

- 链路：`getDocument` → `getPage`(1 基) → `getViewport` → `render`
- worker：必配 `workerSrc`，与主库**同版本**
- canvas 是位图：可选文字叠**文本层**，交互叠**注解层**
- 高分屏靠 `devicePixelRatio` + `transform`
- 大文档要**虚拟化** + 翻页 `cancel()`
- 边界：**只渲染/解析，不生成**（生成用 jsPDF / pdf-lib）

<!--
总结一下。

PDF.js 是浏览器里解析与渲染 PDF 的引擎，Mozilla 出品，Firefox 阅读器同源。

核心链路记牢：getDocument 拿加载任务、await promise 得文档、getPage 取页注意 1 基、getViewport 算尺寸、render 画到 canvas 并 await 它的 promise。

worker 是前置必做：配 workerSrc，且主库与 worker 必须同版本。

canvas 渲染产出是位图，所以可选中的文字要叠文本层，链接表单要叠注解层，从下到上三层叠放。高分屏靠 devicePixelRatio 放大物理像素再配 transform。大文档要虚拟化按需渲染，翻页记得 cancel 旧任务。

最后再把那条边界钉死：PDF.js 只解析和渲染，不生成 PDF。要生成用 jsPDF，要改拼用 pdf-lib。把这条记牢，就不会用错库。谢谢大家。
-->
