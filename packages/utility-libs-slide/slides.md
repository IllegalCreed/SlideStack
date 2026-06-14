---
theme: seriph
background: https://cover.sli.dev
title: 前端实用小库（7 合 1）
info: |
  前端实用小库：mitt / qs / JSZip / FileSaver / qrcode / chroma.js / marked。
  7 个单点能力、上手即用的轻量库，一节讲透。
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-7xl">🧰</span>
</div>

<br/>

## 前端实用小库 · 7 合 1

mitt · qs · JSZip · FileSaver · qrcode · chroma.js · marked —— 七个「小而专」的轻量库，职责单一、API 极简、即插即用

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<!--
今天把 7 个常用的前端小工具库合在一节里横向过一遍。它们的共同气质是「小而专」：每个只解决一类具体问题，没有庞大抽象和配置负担，引入后几行代码就能用。

主线：先看七库全景和各自定位，再每个库花两到三页讲核心 API 与最该记的点，最后做一页总结。贯穿全程的几条红线:marked 默认不净化要配 DOMPurify、FileSaver 只管下载不产内容、JSZip 是异步的、mitt 没有 once。
-->

---

# 七库全景

| 库 | 定位 | 核心 API |
|---|---|---|
| **mitt** | 约 200B 事件总线 | `mitt()` → `on/off/emit/all` |
| **qs** | 查询字符串解析/序列化 | `qs.parse` / `qs.stringify` |
| **JSZip** | 浏览器/Node 打包 ZIP | `generateAsync` / `loadAsync` |
| **FileSaver** | 客户端触发下载 | `saveAs(blob, name)` |
| **qrcode** | 生成二维码 | `toCanvas/toDataURL/toString` |
| **chroma.js** | 颜色处理与配色 | `chroma()`、`scale`、`contrast` |
| **marked** | Markdown → HTML | `marked.parse(md)` |

<!--
先记住这张全景表。

mitt 是约 200 字节的微型事件总线;qs 处理 URL 查询字符串,强在嵌套;JSZip 在浏览器和 Node 里打包解包 ZIP;FileSaver 负责触发浏览器下载;qrcode 生成二维码;chroma.js 做颜色处理和数据可视化配色;marked 把 Markdown 转 HTML。

它们彼此独立、各管一摊。下面逐个展开,每个库我都只挑最核心、最该记的点讲。
-->

---

# 它们之间的互补关系

<v-clicks>

- **JSZip + FileSaver**：JSZip 产内容（Blob），FileSaver 负责下载 —— 经典「打包下载」组合
- **marked + DOMPurify**：marked 转 HTML，DOMPurify 净化 —— marked 默认不安全
- **qs vs URLSearchParams**：qs 支持嵌套对象/数组，原生不支持
- **mitt vs Vue 实例事件**：Vue 3 移除 `$on/$off`，用 mitt 补位事件总线

</v-clicks>

<div v-click class="mt-6 text-sm">

> 边界感是用好这些库的关键：每个只做一件事，组合起来才完整。

</div>

<!--
理解这些库,边界感比 API 更重要。

JSZip 只负责打包解包,FileSaver 只负责触发下载,两者经常串联:JSZip 生成 Blob,FileSaver 把它存成文件。marked 只负责 Markdown 转 HTML,而且默认不净化,必须配 DOMPurify 才安全。qs 的价值是原生 URLSearchParams 给不了的嵌套对象和数组。mitt 则常用来补 Vue 3 移除实例事件后的事件总线空缺。

把这四组关系记住,选型时就不会用错工具。
-->

---
layout: section
---

# mitt
约 200 字节的事件总线

<!--
第一个库,mitt。它是整组里最小的,核心代码大约 200 字节,零依赖,和框架无关。
-->

---

# mitt：核心 API

```ts
import mitt from "mitt";
const bus = mitt();

bus.on("login", (user) => console.log(user)); // 订阅
bus.on("*", (type, payload) => log(type)); // 通配:监听所有
bus.emit("login", { id: 1 }); // 触发
bus.off("login", handler); // 退订(传同一引用)
bus.off("login"); // 省略 handler:移除该事件全部
```

<v-clicks>

- 返回对象只有 `on` / `off` / `emit` + `all`
- `'*'` 通配监听所有事件，回调首参是事件名
- 方法不依赖 `this`，可解构使用

</v-clicks>

<!--
mitt 的全部 API 就这几行。mitt() 返回一个对象,只有 on、off、emit 三个方法和一个 all 属性。

on 订阅,事件名传星号就是监听所有事件,这时回调第一个参数是被触发的事件名。emit 触发。off 退订,要传和 on 时同一个函数引用才能精确移除;如果省略第二个参数,就移除这个事件下的全部监听。

还有个特性:这些方法不依赖 this,可以解构出来单独调用,这和很多面向对象风格的 emitter 不同。
-->

---

# mitt：两个高频考点

<v-clicks>

- **没有 `once`**：一次性监听需在 handler 内 `off` 自己

```ts
function onReady() {
  /* ... */
  bus.off("ready", onReady); // 用完解绑
}
bus.on("ready", onReady);
```

- **`all` 是 `Map`**：`bus.all.clear()` 一键清空全部监听
- **触发顺序**：类型化 handler **先于** `'*'` 通配 handler

</v-clicks>

<!--
mitt 有两个高频考点。

第一,它故意不提供 once。要实现只触发一次,得写个具名 handler,在里面执行完逻辑后调用 off 把自己解绑。

第二,all 这个属性是个 Map,键是事件名、值是 handler 数组。它对外暴露,可以直接操作,比如 all.clear() 一次清空所有监听。

再补一个细节:同一次 emit,类型化的 handler 先执行,星号通配的 handler 后执行,这个顺序是确定的。
-->

---
layout: section
---

# qs
查询字符串,强在嵌套

<!--
第二个,qs,处理 URL 查询字符串。它最大的卖点是支持嵌套对象和数组,这是原生 URLSearchParams 做不到的。
-->

---

# qs：嵌套与数组

```ts
import qs from "qs";

qs.parse("user[name]=jo&user[age]=3");
// { user: { name: 'jo', age: '3' } }
qs.parse("tags[]=a&tags[]=b"); // { tags: ['a', 'b'] }

qs.stringify({ user: { name: "jo" } });
// 'user%5Bname%5D=jo' (默认 URI 编码 [ ])
qs.stringify({ user: { name: "jo" } }, { encode: false });
// 'user[name]=jo'
```

<div v-click class="mt-2 text-sm">

> 核心增量：嵌套对象/数组。原生 `URLSearchParams` 只能扁平键值对。

</div>

<!--
qs 用方括号路径表达层级。parse 能把 user 方括号 name 解析成嵌套对象;tags 方括号等号解析成数组。

stringify 反过来,注意默认会做 URI 编码,方括号会变成百分号 5B、5D,可读性差;加 encode false 才得到可读的方括号形式。

这就是 qs 相对原生 URLSearchParams 的核心增量:嵌套对象和数组。原生那个只能处理扁平的键值对。
-->

---

# qs：数组格式 + 安全限制

```ts
qs.stringify({ a: ["x", "y"] }, { encode: false });
// 'a[0]=x&a[1]=y'  (默认 indices)
// brackets → a[]=x&a[]=y   repeat → a=x&a=y   comma → a=x,y
```

| 防 DoS 默认 | 值 | 含义 |
|---|---|---|
| `depth` | `5` | 最大嵌套深度 |
| `parameterLimit` | `1000` | 最大参数数 |
| `arrayLimit` | `20` | 超过则数组转对象 |

<!--
数组序列化有四种格式。默认是 indices,带数字下标 a 方括号 0;还有 brackets 空括号、repeat 重复键、comma 逗号分隔。按后端期望选。

下面这张表是 qs 的安全设计,都是默认值,目的是防 DoS。depth 默认 5,最大嵌套深度,超过的部分并入键名;parameterLimit 默认 1000,最大参数个数,超出默认被忽略;arrayLimit 默认 20,数组下标超过 20 就转成对象,避免有人用稀疏大下标制造超大数组。这三个默认值不要随便放宽。
-->

---

# qs：comma 往返陷阱

<v-clicks>

- `arrayFormat: 'comma'` 把数组拼成 `a=b,c`，但**反向解析有歧义**：
  - 单元素 `['b']` → `a=b` → parse 回**字符串** `'b'`
  - 值含逗号 `['a,b']` → 被错误拆成 `['a','b']`
- 要稳定往返优先用 `brackets` / `indices`

</v-clicks>

<div v-click class="mt-4 text-sm">

> qs 默认过滤 `__proto__` 等键防原型污染；可用 `throwOnLimitExceeded` 让超限抛错。

</div>

<!--
一个专家级陷阱:comma 格式不保证无损往返。

它把数组拼成逗号分隔串。但反向解析有歧义:单元素数组序列化成 a 等号 b,再 parse 通常得到字符串而不是数组;如果值本身含逗号,会被错误地拆开。所以需要稳定往返的场景,优先用 brackets 或 indices。

安全方面再补两点:qs 默认会过滤双下划线 proto 这类危险键,防原型污染;需要的话可以开 throwOnLimitExceeded,让超限直接抛错而不是静默截断。
-->

---
layout: section
---

# JSZip
浏览器/Node 打包 ZIP

<!--
第三个,JSZip,在浏览器和 Node 里创建、读取、编辑 ZIP 压缩包。最该记住的是:它的核心操作都是异步的。
-->

---

# JSZip：创建与生成

```ts
import JSZip from "jszip";

const zip = new JSZip();
zip.file("hello.txt", "Hello!"); // 加文件
zip.folder("imgs")?.file("a.png", blob); // 建目录并放文件

// 生成 —— 异步 Promise
const blob = await zip.generateAsync({ type: "blob" });
```

<v-clicks>

- `type`：浏览器用 `blob`，Node 用 `nodebuffer`
- 还支持 `base64` / `uint8array` / `arraybuffer`
- I/O **全异步**：`generateAsync` / `loadAsync` 返回 Promise

</v-clicks>

<!--
创建一个 JSZip 实例,用 file 方法加文件,内容可以是字符串、Blob、ArrayBuffer 等多种类型;用 folder 建目录,它返回一个相对该目录的子对象,往里 file 就落到那个目录。

生成压缩包用 generateAsync,注意是异步,返回 Promise。type 要按环境选:浏览器下载用 blob,Node 写文件用 nodebuffer,还支持 base64、uint8array 等。

记住这条:JSZip 的核心 I/O 全是异步的,别当同步用。
-->

---

# JSZip：读取已有 zip

```ts
// 读取上传的 zip(File / ArrayBuffer / Blob)
const zip = await JSZip.loadAsync(file);

// 遍历条目
zip.forEach((path, entry) => {
  if (!entry.dir) console.log(path);
});

// 读出单个文件内容
const text = await zip.file("data.csv")?.async("string");
```

<div v-click class="mt-3 text-sm">

> 配合 FileSaver 下载：`saveAs(await zip.generateAsync({type:'blob'}), 'out.zip')`

</div>

<!--
读取已有 zip 用静态方法 loadAsync,接受 File、ArrayBuffer、Blob 等,返回 Promise。

拿到实例后,用 forEach 遍历所有条目,entry.dir 能区分文件和目录;读出某个文件的内容,先 file 取到对象,再调用它的 async 方法,传 string、blob 等指定格式。

最后这条注释是最常见的组合:JSZip 生成 blob,交给 FileSaver 的 saveAs 下载。下面就讲 FileSaver。
-->

---
layout: section
---

# FileSaver.js
只管「存」,不产内容

<!--
第四个,FileSaver。它只做一件事:在浏览器端触发把一个 Blob 保存为文件的下载动作。内容不归它管。
-->

---

# FileSaver：saveAs

```ts
import { saveAs } from "file-saver";

const blob = new Blob(["你好"], { type: "text/plain;charset=utf-8" });
saveAs(blob, "hello.txt", { autoBom: true }); // autoBom 防中文乱码

canvas.toBlob((b) => saveAs(b, "shot.png")); // canvas 截图
```

<v-clicks>

- 签名：`saveAs(Blob | File | url, filename?, { autoBom })`
- 底层：Blob URL + 隐藏 `<a download>` + 程序化点击
- `autoBom`：blob 含 `charset=utf-8` 时加 BOM，助 Excel 识别

</v-clicks>

<!--
FileSaver 的核心就是 saveAs。第一个参数是 Blob、File 或 URL 字符串,第二个是文件名,第三个选项里有个 autoBom。

底层原理:用 URL.createObjectURL 造一个临时 Blob URL,建一个带 download 属性的隐藏 a 标签,程序化点击,再释放 URL,并对各浏览器做兼容。

autoBom 这个选项:当 blob 的 type 含 charset utf-8 时,会在开头加 UTF-8 的 BOM,帮助 Excel 这类程序正确识别编码,导出 CSV 防中文乱码常用。注意它只负责存,内容要你用 new Blob、canvas.toBlob 或 JSZip 准备好。
-->

---

# FileSaver：跨浏览器边界

<v-clicks>

- **单 Blob 有体积上限**：Chrome ~2GB、Firefox ~800MiB，超限失败
- **iOS Safari** 常「新窗口打开」而非保存，且需**用户手势**触发
- **跨源 URL** 能否按数据下载取决于服务端 **CORS**
- 大文件/精确保存可评估 File System Access API

</v-clicks>

<div v-click class="mt-4 text-sm">

> 它不读取、不生成内容；也不上传 —— 只触发下载。

</div>

<!--
FileSaver 的边界要心里有数。

第一,单个 Blob 有体积上限,因浏览器而异,Chrome 大约 2GB,Firefox 大约 800MiB,超过会失败,大文件别一次性 saveAs。第二,iOS Safari 对下载支持弱,常常是新窗口打开而不是保存,而且需要用户手势触发,延迟很久再调用会被拦。第三,跨源 URL 能不能按数据下载,取决于服务端的 CORS。

如果需要保存到用户指定位置、或大文件流式写,可以评估更新的 File System Access API,但兼容性不如 FileSaver。
-->

---
layout: section
---

# qrcode
生成二维码

<!--
第五个,qrcode,包名就叫 qrcode。它负责生成二维码,注意是只生成、不解码。扫码解码是另外的库。
-->

---

# qrcode：四种输出

```ts
import QRCode from "qrcode";

await QRCode.toCanvas(el, "https://x.com"); // 画到 canvas
const url = await QRCode.toDataURL("https://x.com"); // img src
const svg = await QRCode.toString(text, { type: "svg" }); // SVG 串
await QRCode.toFile("qr.png", text); // 写文件(仅 Node)
```

<v-clicks>

- `toCanvas` / `toDataURL` / `toString`：浏览器 + Node
- `toFile`：**仅 Node**（浏览器无文件系统）
- 回调与 Promise **两套风格**都支持

</v-clicks>

<!--
qrcode 按输出目标提供四组方法。toCanvas 把二维码画到 canvas 元素;toDataURL 返回 base64 的 Data URL,可以直接赋给 img 的 src;toString 传 type svg 直出 SVG 字符串,不依赖 DOM,服务端渲染很方便;toFile 写文件,这个仅 Node 可用,因为浏览器没有文件系统。

前三个浏览器和 Node 都能用。还有个细节:所有这些方法既支持传 callback 的回调风格,也支持不传 callback 返回 Promise 的风格,新旧代码都好用。
-->

---

# qrcode：纠错级别 L/M/Q/H

| 级别 | 可恢复污损 | 场景 |
|---|---|---|
| `L` | ~7% | 密度最高、最脆弱 |
| `M` | ~15% | 默认、均衡 |
| `Q` | ~25% | 较抗损 |
| `H` | ~30% | 最抗损，带 logo 用它 |

<v-clicks>

- `width` 定总宽（覆盖 `scale`）；`margin` 静默区别设太小
- 级别越高，同样数据需要更大的码

</v-clicks>

<!--
纠错级别是二维码的核心概念,从低到高 L、M、Q、H,可恢复的污损比例大约是 7%、15%、25%、30%。级别越高越抗损,即使部分被遮挡弄脏也能扫出,默认是 M。

带 logo 的二维码要用 H,因为中心叠了 logo 会遮挡模块,H 的 30% 冗余能容忍这种遮挡。

两个渲染细节:width 直接指定总宽,会覆盖 scale,scale 是每个模块的像素数;margin 是四周静默区,别设太小,它是识别的一部分。代价是级别越高,同样的数据需要更大的码。
-->

---
layout: section
---

# chroma.js
颜色处理与配色

<!--
第六个,chroma.js,颜色处理库,数据可视化配色的利器。
-->

---

# chroma.js：转换与调整

```ts
import chroma from "chroma-js";

chroma("#ff0000").hsl(); // [0, 1, 0.5]
chroma("tomato").darken().hex(); // 调暗
chroma("red").alpha(0.5).css(); // 'rgba(255,0,0,0.5)'
chroma.mix("red", "blue", 0.5).hex(); // 两色中点
```

<v-clicks>

- `chroma(input)` 构造，链式取 `.rgb()/.hsl()/.lab()/.hex()`
- `.darken()/.brighten()/.alpha()` 返回新对象，可继续链式
- `chroma.contrast(a, b)`：WCAG 对比度（1~21）

</v-clicks>

<!--
chroma 用 chroma 函数构造颜色,接受 hex、CSS 名等,再链式调用目标空间方法取值:rgb、hsl、lab、hex 等。

调整类方法 darken 调暗、brighten 调亮、alpha 设透明度,都返回新的 chroma 对象,可以继续链式。chroma.mix 在两色间插值,ratio 默认 0.5 就是取中点。

还有个常用的 contrast,计算两色的 WCAG 对比度,范围 1 到 21,用来判断文字在背景上清不清楚,正文一般要求至少 4.5。
-->

---

# chroma.js：色阶 scale

```ts
const s = chroma.scale(["white", "red"]);
s(0.5).hex(); // 传 0~1 取插值色
s.colors(5); // 取 5 个等距色

// domain:设输入数值范围(连续)
chroma.scale(["yellow", "navy"]).domain([0, 100])(42);
// classes:切 n 个离散分级(阶梯)
chroma.scale("OrRd").classes(5);
```

<div v-click class="mt-2 text-sm">

> `domain` 管连续输入映射，`classes` 管离散分桶。默认插值 `scale`=rgb、`mix`=lrgb。

</div>

<!--
scale 是 chroma 做配色的核心。chroma.scale 传一组颜色,返回一个色阶函数,传 0 到 1 的数取插值色;colors n 一次取 n 个等距颜色。

两个关键方法要分清:domain 设输入的数值范围,做连续映射,比如 domain 0 到 100,那 scale 42 就取对应位置的色;classes 把色阶切成 n 个离散的分级色,是阶梯效果,分档地图常用。一个管连续、一个管离散。

最后一个易错点:默认插值色彩空间,scale 是 rgb,而 mix 和 average 是 lrgb,线性 RGB,别记混。
-->

---
layout: section
---

# marked
Markdown → HTML

<!--
最后一个,marked,把 Markdown 转成 HTML,以快和简著称。它有一条最重要的安全红线,等会重点说。
-->

---

# marked：基本用法

```ts
import { marked } from "marked";

marked.parse("# 标题\n\n- 列表"); // <h1>标题</h1>...
marked("# 标题"); // 等价简写

marked.parse("第一行\n第二行", { breaks: true }); // 单换行 → <br>
```

| 选项 | 默认 | 含义 |
|---|---|---|
| `gfm` | `true` | GitHub Flavored Markdown |
| `breaks` | `false` | 单换行 → `<br>` |
| `async` | `false` | 返回 `Promise<string>` |

<!--
marked 的基本用法:marked.parse 把 Markdown 转 HTML,默认同步返回字符串;marked 函数本身是等价简写。

常用选项三个:gfm,GitHub 风味 Markdown,默认就是 true,提供表格、删除线、任务列表;breaks,默认 false,开了把单个换行渲染成 br,像聊天软件那样;async,默认 false,开了之后 parse 返回 Promise,要 await,别忘了,否则会把 object Promise 渲染进页面。
-->

---

# marked：⚠️ 默认不净化

```ts
import DOMPurify from "dompurify";

// ❌ 直接渲染用户输入 = XSS 漏洞
el.innerHTML = marked.parse(userInput);

// ✅ 先转、再净化、最后写入
const html = DOMPurify.sanitize(marked.parse(userInput));
el.innerHTML = html;
```

<v-clicks>

- marked **原样输出 HTML**，旧 `sanitize` 选项已**移除**
- 防 XSS 必须配 **DOMPurify**（高频安全考点）
- 净化要紧挨「写入 DOM」，且配 CSP 做纵深防御

</v-clicks>

<!--
这是 marked 最重要、最该记的一条。

marked 默认不净化 HTML,它会原样输出 Markdown 里内嵌的 HTML。所以直接把用户输入喂给 marked 再 innerHTML,就是一个 XSS 漏洞,比如有人写 img onerror 弹窗。而且旧版的 sanitize 选项已经被移除了,别指望它。

正确做法:先用 marked 转成 HTML,再用 DOMPurify 的 sanitize 净化,最后才写入 DOM。顺序很重要,净化必须紧挨着写入 DOM 这一步,之后别再被别的库改写。光净化还不够,生产环境再配上 CSP,做纵深防御。这是高频安全考点,务必记牢。
-->

---

# marked：vs markdown-it

<v-clicks>

- **marked**：更快、更简洁、体积小 —— 直出 HTML 的首选
- **markdown-it**：插件生态更丰富、可定制性更强
- 自定义渲染走 `marked.use({ renderer })`（v5+ 收 token 对象）
- 多配置场景用 `new Marked(opts)` 避免污染全局

</v-clicks>

<!--
marked 和 markdown-it 常被拿来比。简单说:marked 更快、API 更简洁、体积更小,适合直接把 Markdown 渲染成 HTML 的场景;markdown-it 插件生态更丰富、可定制性更强,适合需要大量语法扩展的场景。

如果要自定义渲染,比如给所有外链加 target blank,用 marked.use 传 renderer,注意 v5 起 renderer 方法收的是一个 token 对象。如果一个应用里多处需要不同配置,用 new Marked 创建独立实例,避免改全局单例互相串扰。
-->

---
layout: intro
---

# 总结

七个小库 = **七件趁手的单功能工具**

- **mitt**：事件总线，无 `once`，`all` 是 Map
- **qs**：嵌套查询串，`depth/limit` 防 DoS
- **JSZip**：异步打包，配 FileSaver 下载
- **FileSaver**：只触发下载，不产内容
- **qrcode**：纠错 L/M/Q/H，回调+Promise
- **chroma.js**：`scale` 配色，`contrast` 查对比
- **marked**：Markdown→HTML，**必配 DOMPurify**

<!--
总结一下今天的七个小库。

mitt,事件总线,记住没有 once、all 是 Map、类型化先于通配触发。qs,嵌套查询字符串,depth、parameterLimit、arrayLimit 三个默认值是防 DoS。JSZip,异步打包,常和 FileSaver 组合下载。FileSaver,只负责触发下载,内容要自己准备。qrcode,纠错级别 L M Q H,回调和 Promise 两套风格。chroma.js,scale 做配色、contrast 查 WCAG 对比度,注意 scale 默认 rgb、mix 默认 lrgb。marked,Markdown 转 HTML,默认不净化,必须配 DOMPurify。

这些库的共同点是小而专:每个只做一件事,看一眼示例就能用。把它们的边界和那几条红线记牢,就能在合适的缝隙里随手取用。谢谢大家。
-->
