---
theme: seriph
background: https://cover.sli.dev
title: mammoth.js — docx to clean HTML
info: |
  Presentation mammoth.js — convert .docx to clean, semantic HTML.

  Learn more at [https://github.com/mwilliamson/mammoth.js](https://github.com/mwilliamson/mammoth.js)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📄</span>
</div>

<br/>

## mammoth.js — docx 转干净 HTML

把 .docx 转成 **clean & semantic HTML**：按**语义样式名**映射、忽略 Word 直接格式。浏览器 + Node 通用，求「干净内容」而非像素还原

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/mwilliamson/mammoth.js" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 mammoth.js，一个把 Word 的 .docx 转成干净 HTML 的库。

它最核心的一句话定位:把 docx 转成 simple and clean HTML。关键在于它只按文档里的语义样式名来映射,比如 Heading 1 转成 h1,而刻意忽略你在 Word 里手动设的字号、颜色、缩进这些直接格式。

主线:为什么用它 → 核心理念 → 两大入口 → 浏览器与 Node 差异 → styleMap 语法 → 默认映射 → 图片 → messages → transform → 安全 → 选型 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 mammoth

<v-clicks>

- Word 文档要进 CMS / 编辑器，需要**干净 HTML**
- 直接读 docx 的 XML 太底层、太痛苦
- 想要能套自己网站 CSS 的语义结构
- 不想要 Word 一堆内联样式噪声

</v-clicks>

<div v-click class="mt-6">

mammoth 的回应：

- 按**样式名**映射 → 语义化 `<h1>`/`<p>`/`<ul>`
- **丢弃直接格式** → 输出干净
- styleMap 可定制 → 精确控制结构
- 浏览器 + Node → 同一套 API

</div>

<!--
为什么需要 mammoth?场景很常见:把用户的 Word 文档导入你的 CMS、博客、富文本编辑器。

痛点有几个。第一,你需要的是干净 HTML,而不是 Word 那套复杂格式。第二,如果自己去解析 docx 的 OOXML XML,非常底层、非常痛苦。第三,你想要的是能套自家 CSS 的语义结构,比如标题就是 h1。第四,Word 导出的东西往往带一大堆内联样式噪声。

mammoth 针对性回应:按样式名映射成语义化标签;丢弃直接格式让输出干净;styleMap 让你精确定制;浏览器和 Node 同一套 API。这就是今天的主线。
-->

---

# 核心理念：按样式名映射

```text
Word 段落（样式名 = "Heading 1"，作者手动调成 20px 红）
   │  mammoth 忽略「20px 红」这类直接格式
   ▼  只认样式名 "Heading 1"
<h1>…</h1>
```

<v-clicks>

- 只看**样式名（style name）**，不看手动排版
- 副作用：**倒逼语义化**——作者越规范，输出越干净
- 反例：全靠手动格式的文档 → 退化成一堆 `<p>`

</v-clicks>

<!--
这一页是理解 mammoth 的钥匙。

看这个例子:一个 Word 段落,应用了名为 Heading 1 的样式,同时作者又手动把它调成 20 像素红色。mammoth 会忽略 20 像素红色这种直接格式,只认样式名 Heading 1,据此输出一个 h1。

所以它的机制是:只看样式名,不看手动排版。这有个很好的副作用,叫倒逼语义化——作者越是规范地用样式而不是手动调格式,mammoth 的输出就越干净。

反过来也是它的局限:如果一份文档全靠手动格式、根本不用样式,mammoth 就很难映射出理想结构,只能退化成一堆普通段落。所以 mammoth 适合规范的文档。
-->

---
layout: two-cols-header
---

# 两大入口

::left::

**转 HTML**

```ts
import mammoth from "mammoth";

const { value, messages } =
  await mammoth.convertToHtml(
    { path: "doc.docx" }
  );
// value: HTML 字符串
```

::right::

**抽纯文本**

```ts
const { value } =
  await mammoth.extractRawText(
    { path: "doc.docx" }
  );
// 纯文本，丢所有格式
```

<div class="mt-2 text-sm">

> 都返回 `Promise<{ value, messages }>`。`convertToMarkdown` 存在但**已弃用**。

</div>

<!--
mammoth 有两个主要入口。

左边,convertToHtml,把 docx 转成 HTML,这是主力。它返回一个 Promise,解析出 value 和 messages 两个字段:value 是生成的 HTML 字符串,messages 是转换过程中的警告和错误。

右边,extractRawText,只抽纯文本,丢弃所有格式和结构,每个段落后跟两个换行。适合做全文检索、摘要、内容迁移这种只要文字的场景,比 convertToHtml 更轻量。注意它不接受 styleMap,因为没有格式可映射。

还有第三个 convertToMarkdown,能输出 Markdown,但官方已经标记为 deprecated,推荐先转 HTML 再用专门的库转 Markdown。所有转换函数的返回形态都是统一的 value 加 messages。
-->

---

# 浏览器 vs Node：input 差异

| 写法 | 环境 | 含义 |
|---|---|---|
| `{ path: "doc.docx" }` | 仅 Node | 从磁盘读 |
| `{ buffer: nodeBuffer }` | 仅 Node | Node Buffer |
| `{ arrayBuffer: ab }` | 浏览器 | ArrayBuffer |

```ts
// 浏览器：先把 File 转 ArrayBuffer，且要引 mammoth.browser
const mammoth = require("mammoth/mammoth.browser");
const { value } = await mammoth.convertToHtml({
  arrayBuffer: await file.arrayBuffer(),
});
```

<!--
mammoth 浏览器和 Node 都能跑,但喂数据的方式不同,这是个高频混淆点。

看表格。Node 端有两种:path 是文件路径,直接从磁盘读;buffer 是 Node Buffer,适合从上传中间件拿到的内存数据。浏览器端只有一种:arrayBuffer,因为浏览器没有文件系统、也没有 Node Buffer。

下面是浏览器的典型写法。两个要点:第一,要引入 mammoth 斜杠 mammoth.browser 这个构建,它不带 Node 的 fs 和 Buffer 依赖;第二,先调用 file.arrayBuffer 把 File 转成 ArrayBuffer,再包成 arrayBuffer 字段传进去。

记住这个对应关系:Node 用 path 或 buffer,浏览器用 arrayBuffer,转换逻辑本身完全一致。
-->

---

# styleMap：一条规则的结构

```text
p[style-name='Section Title']  =>  h1:fresh
└──────── 匹配器 ────────┘      └ HTML 路径 ┘
```

<v-clicks>

- 左侧**匹配器**：`p` 段落 / `r` run（字符级）/ `table`
- `[style-name='…']` 按样式名；`.Id` 按样式 ID
- 右侧 **HTML 路径**：目标标签 + 修饰符
- 可写数组（每条一个元素）或字符串（每行一条，`#` 注释）

</v-clicks>

<!--
mammoth 的灵魂是 styleMap,样式映射。看它一条规则的结构。

左边是文档元素匹配器,右边是 HTML 路径,中间用箭头连接。这个例子:匹配样式名为 Section Title 的段落,转成 h1,带 fresh 修饰符。

匹配器有讲究。前缀字母代表元素类型:p 是段落,r 是 run 也就是字符级的文字游程,table 是表格。用方括号 style-name 等于按样式名匹配,用点号加 ID 按样式 ID 匹配。注意匹配的是 Word 的样式名,不是 CSS class。

右边是 HTML 路径,指定目标标签,还能带各种修饰符,下一页详讲。

写法上,styleMap 可以是数组,每个元素一条规则;也可以是一个字符串,每行一条,空行和井号开头的注释行会被忽略。两种等价。
-->

---

# styleMap：HTML 路径修饰符

| 写法 | 含义 |
|---|---|
| `h2.section-title` | 带 class |
| `:fresh` | 每段新开元素，不复用 |
| `div.aside > p:fresh` | `>` 嵌套，多段聚合进一个外层 |
| `pre:separator('\n')` | 折叠多段进一个元素，段间插分隔符 |
| `p[…] => !` | 忽略该元素及内容 |
| `r[…] =>`（右侧空） | 不生成包裹元素 |

<!--
右侧 HTML 路径的修饰符,这是 styleMap 最有威力的部分。

点号加名字,生成带 class 的标签,比如 h2 点 section-title。

fresh 是最重要的:它强制每个匹配段落都新开一个元素。因为 mammoth 默认会复用元素——两个相邻的标题段落如果不加 fresh,会被合并进同一个 h1。所以标题几乎都要 fresh。

大于号表示嵌套,左外右内。配合「只给内层加 fresh」,能让相邻的段落共享同一个外层容器,比如做侧边栏 aside。

separator 相反,它让多段折叠进同一个元素、段间插分隔符,典型用于代码块 pre,注意代码块不能加 fresh。

右侧写感叹号表示彻底忽略这个元素和内容。右侧留空表示不生成包裹元素,默认映射里清空 Hyperlink 字符样式就是这么用的。
-->

---

# 默认映射：开箱即用

```text
Heading 1~6  =>  h1~h6  (都 :fresh)
Normal       =>  p
Strong       =>  strong
列表 1~5 级   =>  ul / ol > li
脚注/尾注     =>  p
```

<v-clicks>

- 不传 styleMap 也能转好常见结构
- 自定义映射与默认**合并、且优先**
- 关掉默认：`includeDefaultStyleMap: false`

</v-clicks>

<!--
好消息是,即使你一条 styleMap 都不写,mammoth 也内置了一份默认映射,覆盖最常见的结构。

看这些:Heading 1 到 6 映射成 h1 到 h6,而且都带 fresh;正文 Normal 映射成 p;字符样式 Strong 映射成 strong;无序和有序列表,从 1 到 5 级都覆盖,映射成 ul 或 ol 加 li;脚注、尾注文本映射成 p。它还兼容 LibreOffice、Apple Pages 的样式名。

你自己传的 styleMap 会和这份默认映射合并,而且因为是「第一条匹配优先」,你的规则总能覆盖默认的。

如果你想完全只用自己的映射,把 includeDefaultStyleMap 设为 false 就能关掉所有内置默认规则。还有个 includeEmbeddedStyleMap,控制是否采用文档内嵌的映射,这个后面讲。
-->

---

# 图片：默认内嵌，可自定义

```ts
// 默认：内嵌为 base64 data URI（images.dataUri）
// 自定义：上传后引用 URL
const options = {
  convertImage: mammoth.images.imgElement(async (image) => {
    const buf = await image.readAsBuffer();      // Node
    const url = await uploadToOSS(buf, image.contentType);
    return { src: url };
  }),
};
```

<v-clicks>

- 浏览器优先 `readAsBase64String()` / `readAsArrayBuffer()`
- `readAsBuffer()` 仅 Node（浏览器没有 Buffer）

</v-clicks>

<!--
图片处理。mammoth 默认把每张图片内嵌成 base64 的 data URI,也就是 src 里直接是 data 冒号 image 那一长串。对应的转换器是 images.dataUri。好处是 HTML 自包含,坏处是体积大。

要自定义,用 convertImage 选项,配合 mammoth.images.imgElement 传一个回调。回调收到 image 对象,你可以读出图片数据、上传到对象存储,然后返回一个对象,里面的 src 会作为 img 标签的属性。这个例子就是上传后引用远程 URL。

读取方法要注意环境差异:readAsBase64String 和 readAsArrayBuffer 在浏览器和 Node 都能用;但 readAsBuffer 返回的是 Node Buffer,浏览器没有 Buffer,所以浏览器端别用它,优先用 readAsBase64String 来拼 data URI。
-->

---

# messages：别忽略它

```ts
const { value, messages } =
  await mammoth.convertToHtml({ path: "doc.docx" });

for (const m of messages) {
  // m.type: "warning" | "error"
  console.warn(`[${m.type}] ${m.message}`);
}
```

<v-clicks>

- 最常见：**未被 styleMap 识别的样式**（warning）
- 不丢内容（退化为普通段落），但提示你补映射
- 生产中应检查并记录

</v-clicks>

<!--
每次转换都返回 messages 数组,很多人忽略它,其实很有用。

每条 message 有 type 和 message:type 是 warning 或 error,只有这两种,没有 info 级别;error 还会多带一个 error 字段是异常对象。

最常见的是一条 warning,大意是「一个未识别的段落样式被忽略了」,后面跟样式名。这说明文档里用了某个样式,但你没有任何规则匹配它。

注意它不会丢内容——那段文字仍然会输出,只是退化成普通段落。但这条 warning 是个信号,提示你也许该补一条映射规则,让这个样式得到正确的标签。

所以生产环境里,应该检查并记录 messages,把高频的未识别样式补进 styleMap,逐步完善映射质量。
-->

---

# 进阶：transformDocument

按字体识别代码段（直接格式 styleMap 匹配不到）：

```ts
const mono = ["consolas", "courier", "courier new"];
mammoth.transforms.paragraph((p) => {
  const runs = mammoth.transforms.getDescendantsOfType(p, "run");
  const isCode = runs.length > 0 &&
    runs.every((r) => r.font && mono.includes(r.font.toLowerCase()));
  return isCode ? { ...p, styleName: "Code" } : p;
});
// 再配 styleMap: p[style-name='Code'] => pre:separator('\n')
```

> ⚠️ transform API 被官方标注 **unstable**，锁版本 + 加测试。

<!--
进阶能力:transformDocument。styleMap 只能按样式名和直接格式匹配,但有些更复杂的条件,比如按字体、按对齐方式来判断,就得用 transformDocument。它作用于解析出的文档 AST,在转 HTML 之前。

看这个经典例子:按等宽字体识别代码段。用 transforms.paragraph 包一个段落函数,里面用 getDescendantsOfType 取出段落里所有的 run,判断它们的 font 是不是都是等宽字体,比如 consolas、courier。如果是,就给这个段落赋一个样式名 Code,返回新段落。

然后再配一条 styleMap,把样式名 Code 映射成 pre 加 separator 换行。

思路是:transform 先把「直接格式特征」翻译成一个样式名,再交给 styleMap 走常规映射,两者配合。

一个重要警告:官方明确说 transform 这套 API 应被视为 unstable,版本间可能变化。所以生产用要锁定版本并加测试。
-->

---

# 安全：mammoth 不做消毒

```ts
import DOMPurify from "dompurify";

const { value } = await mammoth.convertToHtml({ arrayBuffer });
el.innerHTML = DOMPurify.sanitize(value);   // 不受信任输入必须这样
```

<v-clicks>

- 官方明确：**no sanitisation**，输出可能含 `javascript:` 链接
- `externalFileAccess` 默认 `false`（防读本地文件 / SSRF）
- mammoth 负责「转得干净」，**不负责「转得安全」**

</v-clicks>

<!--
安全,这是最容易踩的坑,一定要讲。

官方原文写得很清楚:mammoth 不对源文档做任何消毒。这意味着,源文档里可能藏着 javascript 冒号开头的恶意链接、可能引用外部文件,这些都会原样进入输出的 HTML。

所以处理不受信任的用户上传时,必须对 value 做消毒再注入页面。最常见的搭配是 DOMPurify,调用 sanitize 清洗一遍。直接 innerHTML 不消毒,就是 XSS 漏洞。

另一个安全选项是 externalFileAccess,默认是 false,禁止文档访问外部引用的文件,防止读取本地文件或者 SSRF 这类攻击。只有当你完全信任这份文档时,才显式开成 true。

一句话总结:mammoth 负责把文档转得干净,但不负责转得安全。安全是你的责任。
-->

---

# 选型：mammoth vs docx-preview vs docx

| 维度 | mammoth | docx-preview | docx |
|---|---|---|---|
| 方向 | docx→干净 HTML | docx→保真渲染 | JS→生成 docx |
| 目标 | 拿语义内容 | 像素级还原 | 创建文档 |
| 套自家 CSS | 强 | 弱 | — |
| 场景 | 导入/检索/迁移 | 在线预览 | 生成报告 |

<div v-click class="mt-3 text-sm">

> mammoth 是**单向**的,不能把 HTML 回写成 docx。

</div>

<!--
最后是选型,把三个常被混淆的库放一起。

mammoth,方向是 docx 转干净 HTML,目标是拿到语义内容,能很好地套你自家的 CSS,典型场景是把 Word 内容导入系统、做检索、做迁移。

docx-preview,方向是 docx 转保真渲染,目标是像素级还原 Word 的外观,它自带样式所以不太好套你的 CSS,典型场景是在网页里原样预览一份 Word。

docx 这个库,方向相反,是用 JS 代码生成 docx 文件,典型场景是后端生成报告、合同。

经验法则:要内容、要套样式、要检索迁移,选 mammoth;要原样预览,选 docx-preview;要生成 docx,选 docx 或 docxtemplater。

最后强调:mammoth 是单向的,只能 docx 转 HTML,不能把 HTML 回写成 docx,别搞混。
-->

---
layout: intro
---

# 总结

mammoth.js = **docx → 干净语义 HTML**

- 理念：按**样式名**映射，忽略直接格式 → 倒逼语义化
- 入口：`convertToHtml`（HTML）/ `extractRawText`（纯文本）
- input：浏览器 `arrayBuffer` / Node `path`·`buffer`
- styleMap：`:fresh` / `>` 嵌套 / `separator` / `=>!`
- 默认映射开箱即用，自定义合并且优先
- 安全：**不做消毒**，输出务必 DOMPurify
- 边界：求干净内容，非像素还原（那用 docx-preview）

<!--
总结一下。

mammoth.js 本质是把 docx 转成干净的语义 HTML。

核心理念:按样式名映射、忽略直接格式,从而倒逼文档语义化。

两大入口:convertToHtml 出 HTML,extractRawText 出纯文本,都返回 value 加 messages。

input 形态记牢:浏览器用 arrayBuffer,Node 用 path 或 buffer。

styleMap 是灵魂,几个关键修饰符:fresh 控制元素是否复用、大于号做嵌套、separator 折叠多段、感叹号忽略元素。

默认映射开箱即用,覆盖标题、列表、脚注;你的自定义映射会合并而且优先。

安全是底线:mammoth 不做任何消毒,处理不受信任的输入,输出一定要过 DOMPurify。

最后是边界:mammoth 求的是干净内容,不是像素级还原,要保真预览就用 docx-preview。把这条记牢,选型就不会错。谢谢大家。
-->
