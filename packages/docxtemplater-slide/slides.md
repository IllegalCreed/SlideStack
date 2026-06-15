---
theme: seriph
background: https://cover.sli.dev
title: docxtemplater — 模板填充文档
info: |
  Presentation docxtemplater — 用模板填充生成 docx/pptx/xlsx。

  Learn more at [https://docxtemplater.com/docs/](https://docxtemplater.com/docs/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📄</span>
</div>

<br/>

## docxtemplater — 模板填充文档

在 Word/PPT/Excel 里写 `{标签}` 做模板，运行时 `render(data)` 填数据。非程序员维护排版，开发只管填数据。**开放核心**：核心免费，图片/HTML/图表等付费

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/open-xml-templating/docxtemplater" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 docxtemplater。它的官方定位是「用模板填充生成 docx、pptx、xlsx」——让非程序员在自己熟悉的 Office 软件里排好版、在动态处写上花括号标签，开发只负责调 render 把后端 JSON 填进去。

它处理的是 Office Open XML 文档的模板填充，不是从零用代码画文档，那是 docx 库的路子。

一条贯穿全场的红线先抛出来：它是开放核心，核心库免费，但图片、HTML、图表、XLSX 等功能模块是付费的。这条免费边界后面会专门讲。

主线：为什么用它 → PizZip 加载 → 第一次填充 → 标签语法 → 循环作用域 → 默认解析器的坑 → expressions 解析器 → 异步数据 → 错误处理 → 浏览器与服务端 → 免费边界 → 选型 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用它

<v-clicks>

- 报表/合同样式复杂，纯代码拼太痛苦
- 想让业务/设计人员维护模板排版
- 同一份模板，只是数据不同
- docx/pptx/xlsx 想用一套方案

</v-clicks>

<div v-click class="mt-6">

docxtemplater 的回应：

- 模板在 Office 里**可视化**做好
- 代码只写 `render(data)`，**样式与逻辑解耦**
- 标签语法对 **OOXML 通用**

</div>

<!--
为什么要用模板填充这种方案？几个痛点。

第一，报表、合同这类文档样式复杂，用代码一段段拼极其痛苦，还难维护。第二，样式经常是业务或设计人员定的，理想状态是让他们直接维护模板，而不是来改代码。第三，很多场景模板是固定的，变的只是数据。第四，docx、pptx、xlsx 想用同一套思路解决。

docxtemplater 的回应：模板在 Word、PowerPoint、Excel 里可视化做好，需要动态内容的地方写花括号标签；代码这边只调 render 填数据，样式和逻辑彻底解耦；而且标签语法对所有 OOXML 文件通用，三种格式一套写法。
-->

---

# 第一步：必须配 PizZip

```bash
npm install docxtemplater pizzip
```

<v-clicks>

- docx/pptx/xlsx 本质是 **ZIP 压缩包**
- docxtemplater **自己不解压**
- 必须用 PizZip 把模板读进内存再交给它
- 少装 PizZip 就跑不起来

</v-clicks>

<div v-click class="mt-4 text-sm">

> 浏览器端再按需装 `pizzip-utils`（拉模板）、`file-saver`（下载）。

</div>

<!--
上手第一步，也是第一个坑：必须配 PizZip。

为什么？因为 docx、pptx、xlsx 本质都是 ZIP 压缩包，里面装的是 XML。docxtemplater 自己不具备解压能力，官方要求搭配 PizZip，把模板文件读成一个可操作的 zip 对象，再传给 Docxtemplater 构造函数。

所以安装命令是 docxtemplater 加 pizzip 两个包，少装 PizZip 就无法加载模板。

浏览器端还会再按需装两个：pizzip-utils 用来按二进制拉取模板文件，file-saver 用来触发下载。
-->

---

# 第一次填充（Node）

```ts
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import fs from 'node:fs';

// 按二进制读模板（别用 utf8，会破坏 zip）
const content = fs.readFileSync('tpl.docx', 'binary');
const zip = new PizZip(content);

const doc = new Docxtemplater(zip, {
  paragraphLoop: true,
  linebreaks: true,
});

doc.render({ first_name: 'John', last_name: 'Doe' });

const buf = doc.toBuffer();            // 3.62.0+
fs.writeFileSync('out.docx', buf);
```

<!--
第一次填充的完整流程，记住这五步。

第一，按二进制读模板。注意这里用 binary，不能用 utf8，因为模板是二进制 zip，utf8 解码会破坏字节导致 PizZip 解析失败。也可以读成 Buffer。

第二，new PizZip 把内容加载成 zip 对象。

第三，new Docxtemplater 传入 zip 和选项。这里两个常用选项：paragraphLoop 让段落级循环去掉多余空行，linebreaks 让数据里的换行符渲染成真正的换行。

第四，render 填数据，这是同步方法，把花括号 first_name 替换成 John。

第五，toBuffer 拿到 Node Buffer 再写盘。toBuffer 是 3.62 之后的便捷方法，等价于老写法 getZip().generate 传 nodebuffer。
-->

---

# 标签语法：四类标签

| 写法 | 名字 | 作用 |
|---|---|---|
| `{name}` | 占位符 | 取数据填进去 |
| `{#list}…{/list}` | 区块 | 数组→循环；真值→条件 |
| `{^list}…{/list}` | 反向区块 | falsy 时才渲染 |
| `{@xml}` | raw XML | 插原始 OOXML（段落级） |

<div v-click class="mt-4">

辅助：`{.}` 当前元素本身；`{/}` 闭合最近区块

</div>

<div v-click class="mt-2 text-sm">

> 默认分隔符是单花括号 `{` `}`，不是 `{{ }}`。

</div>

<!--
标签语法，四类标签先有个全貌。

第一类，占位符，花括号 name，最基础，取数据里的 name 填进去。

第二类，区块，井号开、斜杠闭。它有双重身份：数据是数组时是循环，数据是真值时是条件。这是 docxtemplater 很精妙的设计，后面单独讲。

第三类，反向区块，脱字符开头，只在数据为 falsy，比如空数组、false、null 时才渲染，常用来写「没有数据时的提示」。

第四类，raw XML，at 符号，插入一段原始 OOXML，不转义，但只在段落级工作。

两个辅助：点号取当前元素本身，适合字符串数组；单独的斜杠闭合最近打开的区块，省得重写名字。

最后提醒，默认分隔符是单花括号，不是 Mustache 那种双花括号。
-->

---

# 循环 = 条件：同一个区块

```text
{#users}{name}{/users}
```

<v-clicks>

- `users` 是**数组** → 内容对每个元素重复（循环）
- `users` 是**真值** → 渲染一次（条件成立）
- `users` 是 **falsy** → 不渲染
- 循环内**作用域切到当前元素**，故直接写 `{name}`

</v-clicks>

<div v-click class="mt-3 text-sm">

```text
{#orders}有 {.length} 个订单{/orders}
{^orders}暂无订单{/orders}
```

</div>

<!--
区块的双重身份，这页讲透。

同一个 井号 users 斜杠 users，根据数据类型自动变身。users 是数组，中间内容对每个元素重复一次，这是循环。users 是真值，比如一个对象或 true，中间内容渲染一次，这是条件成立。users 是 falsy，比如空数组、false、null，中间内容不渲染。

关键认知：循环内部，作用域会下沉到当前迭代的元素。所以 井号 users 里直接写 name，取的是当前 user 的 name，不是顶层数据的 name。如果当前元素没这个属性，会向上回溯到父作用域找。

底下的例子展示正反配合：井号 orders 在有订单时渲染，脱字符 orders 在没订单时渲染「暂无订单」。
-->

---

# 默认解析器的天花板

```text
{user.name}    ← 当成字面键名 "user.name"，取不到！
{price + tax}  ← 不做加法
{n > 1}        ← 不支持比较
```

<v-clicks>

- 默认解析器**只做简单属性查找**
- 点号、运算、比较一律**不支持**
- 更坑：**不报错**，只是默默渲染成 `undefined`

</v-clicks>

<div v-click class="mt-3 text-sm">

> 这是新手最常栽的坑：以为支持嵌套，结果一片空白。

</div>

<!--
现在讲最容易栽的坑：默认解析器很弱。

很多人想当然地写 user 点 name，期待先取 user 再取 name。但默认解析器只做简单属性查找，它会把整个 user 点 name 当成一个字面键名去找，自然找不到。同理，price 加 tax 不会做加法，n 大于 1 不支持比较。

更坑的是，它不会报编译错误，只是默默取不到、渲染成 undefined，问题非常隐蔽，你盯着模板看半天也发现不了。

所以记住：默认解析器不支持嵌套属性和表达式。要用，得换解析器，下一页就是解药。
-->

---

# 解药：expressions 解析器（免费）

```ts
import expressionParser from 'docxtemplater/expressions.js';

const doc = new Docxtemplater(zip, {
  parser: expressionParser,   // 关键
  paragraphLoop: true,
});
```

启用后全部可用：

```text
{user.name}   {price + tax}   {n > 1 ? '多' : '少'}
{name | upper}   {$index}   {full = a + b}
```

<div v-click class="mt-2 text-sm">

> 基于 `angular-expressions`，随包提供、**免费**，不是付费模块。

</div>

<!--
解药来了：expressions 解析器，也叫 angular 解析器。

用法很简单：从 docxtemplater 斜杠 expressions.js 引入，作为 parser 选项传给构造函数。一行配置就解锁了一整套能力。

启用后，点号嵌套属性可以了，算术运算可以了，比较和三元可以了，管道过滤器可以了，循环下标 dollar index 可以了，甚至模板内变量赋值也可以了。

特别强调一点，避免误解：这个 expressions 解析器是免费的，它基于开源的 angular-expressions，随 docxtemplater 包一起提供，不在付费模块之列。免费的是解析器，付费的是后面要讲的功能模块。
-->

---

# 异步数据：renderAsync

```ts
const doc = new Docxtemplater(zip, { paragraphLoop: true });

await doc.renderAsync({
  user: new Promise((resolve) => {
    // HTTP 请求 / 数据库 / 外部 API
    setTimeout(() => resolve('John'), 1000);
  }),
});

fs.writeFileSync('out.docx', doc.toBuffer());
```

<v-clicks>

- 数据含 Promise 时，**同步 `render` 不会等**
- `renderAsync` 先 resolve 所有 Promise 再渲染
- 付费 image 模块常因「图片需异步加载」走这条路

</v-clicks>

<!--
数据要异步获取怎么办？比如某个字段得先发 HTTP 请求、查数据库才能拿到。

关键认知：同步的 render 不会等待 Promise，你把 Promise 传给 render，它不会自动 await，结果就出错。

正确做法是用 renderAsync。你可以直接把 Promise 放进数据对象，renderAsync 会先把数据里所有 Promise 都 resolve 掉，再执行渲染，最后返回一个 Promise，await 它即可。旧版的等价写法是 await resolveData 再 render。

一个典型场景：付费的 image 模块，因为图片通常要通过 HTTP 异步加载，所以用它时往往要配合 renderAsync。
-->

---

# 错误处理：聚合可读信息

```ts
try {
  doc.render(data);
} catch (error) {
  if (error.properties?.errors instanceof Array) {
    const msg = error.properties.errors
      .map((e) => e.properties.explanation)
      .join('\n');
    console.log(msg); // The tag ... is unopened
  }
  throw error;
}
```

<div v-click class="mt-2 text-sm">

> 多个模板错误聚合成 **MultiError**；编译期抛结构错误，render 期抛数据错误。

</div>

<!--
生产环境必须做的错误处理。

docxtemplater 在模板有多处问题时，会抛出一个 MultiError，把全部子错误放在 error 点 properties 点 errors 这个数组里。每个子错误的人类可读说明在它的 properties 点 explanation。

所以标准写法是：try catch 包住 render，catch 里判断 properties.errors 是数组，然后 map 取出每条的 explanation 拼起来，就能得到类似「某标签未闭合」这种可读信息，再决定是记录还是转成对用户友好的提示。

注意两个抛错时机：构造、也就是编译阶段，抛模板结构错误，比如标签没闭合；render 阶段，抛数据和解析错误。另外 properties.id 可以用来程序化区分错误类型。
-->

---

# 浏览器 vs 服务端

````md magic-move
```ts
// 浏览器：拉模板（二进制）+ 下载
PizZipUtils.getBinaryContent('/tpl.docx', (e, content) => {
  const doc = new Docxtemplater(new PizZip(content), {
    paragraphLoop: true,
  });
  doc.render({ first_name: 'John' });
  saveAs(doc.toBlob(), 'out.docx');   // toBlob 3.62.0+
});
```

```ts
// 服务端：toBuffer 作为响应返回
app.get('/contract', (req, res) => {
  const doc = new Docxtemplater(zip, { paragraphLoop: true });
  doc.render({ name: req.query.name });
  res.setHeader('Content-Type',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.send(doc.toBuffer());
});
```
````

<!--
浏览器和服务端两端的差异，这页对照看。

浏览器端：先用 PizZipUtils 的 getBinaryContent 按二进制拉模板，注意必须二进制，不能用 fetch 的 text，否则破坏 zip。渲染后用 toBlob 拿到 Blob，再配 file-saver 的 saveAs 触发下载。toBlob 是 3.62 之后的方法。

服务端：通常不落地磁盘，渲染后用 toBuffer 拿到 Buffer，设置正确的 Content-Type，docx 的 MIME 是 wordprocessingml.document，再加 Content-Disposition attachment，然后 res.send。千万别用 res.json，JSON 序列化会破坏二进制。

一句话记忆：Node 用 toBuffer，浏览器用 toBlob，本质都是 getZip().generate 的封装。
-->

---

# 免费边界（最重要）

| 能力 | 归属 |
|---|---|
| 占位符 / 循环 / 条件 | **免费核心** |
| 表格行循环 / raw XML | **免费核心** |
| expressions 解析器 | **免费** |
| 插图片 / 插 HTML / 图表 | **付费** |
| xlsx 单元格 / 幻灯片 / 子模板 | **付费** |

<div v-click class="mt-3 text-sm">

> 核心 **MIT/GPLv3 双许可**（可闭源商用）；约 19 个功能模块按套餐付费。

</div>

<!--
这页是全场最重要的一页：免费边界，立项前必须算清。

免费的部分：占位符替换、循环、条件、反向条件，这些是核心能力；表格行循环，把标签放进表格行就能按数据增删行，也免费；raw XML 段落级插入，免费；还有 expressions 解析器，免费。

付费的部分：往文档里插图片，付费 image 模块；插 HTML 富文本，付费 html 模块；图表数据绑定，付费 chart 模块；操作 xlsx 单元格，付费 xlsx 模块；幻灯片复制拆分、子模板嵌入，也都是付费模块。一共大约 19 个功能模块。

授权上，核心库是 MIT 或 GPLv3 双许可，你可以按 MIT 闭源商用，不必开源自己代码。付费的是功能模块和商业支持，不是核心本身。

实操建议：立项时列清楚要用哪些能力，一旦出现插图片、插 HTML、画图表、写 xlsx 单元格，就要把对应模块的 license 成本算进预算。
-->

---

# 选型：三个库怎么选

| 维度 | docxtemplater | docx | SheetJS |
|---|---|---|---|
| 范式 | **模板填充** | 代码构造 | 表格读写 |
| 样式来源 | 模板 | 代码 | 数据 |
| 适合 | 有模板填数据 | 代码生成 Word | 电子表格 |

<v-clicks>

- 有**排好版的 Word/PPT 模板** → docxtemplater
- 要**用代码从零拼** Word → docx
- 主要是**电子表格数据** → SheetJS / ExcelJS

</v-clicks>

<!--
最后讲选型，和相邻的两类库怎么区分。

docxtemplater 是模板填充范式，样式来自你在 Office 里排好的模板，适合「已有精美模板、只缺数据」的场景，非程序员能维护模板。

docx，也就是 dolanmiu 的 docx 库，是编程式构造，样式由代码决定，适合「完全用代码从零拼出 Word 结构」、不想做模板的场景。

SheetJS 和 ExcelJS 是电子表格读写，处理的是表格数据，和前两个不是一个赛道。

所以三句话：有排好版的 Word 或 PPT 模板、只想填后端数据，选 docxtemplater；要用代码从零拼复杂 Word，选 docx；主要是电子表格数据读写，选 SheetJS 或 ExcelJS。
-->

---
layout: intro
---

# 总结

docxtemplater = **模板填充生成 Office 文档**

- 配 **PizZip** 加载，`render(data)` 填数据
- 标签：`{x}` / `{#}{/}` 循环 / `{^}{/}` 条件
- 默认解析器弱 → 启用免费 **expressions 解析器**
- 异步用 `renderAsync`，错误读 `properties.errors`
- 导出：Node `toBuffer()` / 浏览器 `toBlob()`
- **免费边界**：核心免费，图片/HTML/图表/xlsx **付费**

<!--
总结一下今天的内容。

docxtemplater 的本质是用模板填充生成 Office 文档，让非程序员维护排版，开发只管填数据。

技术要点：第一，必须配 PizZip 加载模板，核心方法是 render 填数据。第二，标签三件套，花括号占位符、井号斜杠循环、脱字符斜杠条件，循环和条件是同一个区块。第三，默认解析器很弱，不支持嵌套和表达式，要启用免费的 expressions 解析器。第四，异步数据用 renderAsync，错误处理读 properties.errors 拿可读信息。第五，导出在 Node 用 toBuffer、浏览器用 toBlob。

最后再敲一遍最重要的红线：开放核心，核心库 MIT 免费可商用，但图片、HTML、图表、xlsx 单元格这些功能模块是付费的。选型和预算时，先算清你要用哪些能力落在免费还是付费这一侧。谢谢大家。
-->
