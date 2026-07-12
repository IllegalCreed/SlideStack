---
theme: seriph
layout: cover
title: File 与文件系统 API
info: |
  浏览器操作文件的三层能力：File/Blob/FileReader 只读、File System Access 读写可见文件、OPFS 源私有高性能读写。

  Learn more at [MDN File System API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark">FS</div>

# File 与文件系统 API

## 三层能力：只读用户交出的文件 · 读写可见文件 · 源私有高性能读写

<div class="cover-meta">
  <span>WHATWG File API / File System</span>
  <span>File/Blob · FileReader · File System Access · OPFS</span>
  <span>核于 2026-07</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_API" target="_blank" class="slidev-icon-btn" aria-label="MDN File System API">
    <carbon:document />
  </a>
  <a href="https://github.com/whatwg/fs" target="_blank" class="slidev-icon-btn" aria-label="whatwg/fs GitHub">
    <carbon:logo-github />
  </a>
</div>

<!--
这一讲不做 API 目录。浏览器里操作文件不是一个 API，而是三层能力叠加：最底层 File/Blob 这对「字节 + 类型」的不可变数据对象配 FileReader 与新式 Promise 读法，只读用户主动交出的文件；往上 File System Access 第一次让 Web 能读写用户可见的真实文件与目录；最上层 OPFS 是源私有、免授权的高性能沙盒。

口径基于 WHATWG File API / File System 现行标准，核于 2026 年 7 月。文件的存储定位、配额与驱逐属于浏览器存储章，结构化记录里夹 Blob 属于 IndexedDB 叶，本讲只在边界点到即链接，专注三层各自的 API 编程。
-->

---
layout: default
---

# 一个"操作文件"，其实是三层能力

<div class="grid grid-cols-3 gap-4 mt-6">
  <div v-click class="fact tone-green" style="border-left-color:#17875d">
    <strong>① File / Blob / FileReader</strong>
    <span><code>&lt;input&gt;</code>/拖放拿到文件 → 读文本/二进制/流。<b>只读</b>、拿不到路径、写不回磁盘</span>
  </div>
  <div v-click class="fact" style="border-left-color:#3178c6">
    <strong>② File System Access</strong>
    <span>三个 picker + 句柄，读写用户<b>可见</b>的真实文件与目录，还能持久化句柄</span>
  </div>
  <div v-click class="fact tone-amber" style="border-left-color:#b76e00">
    <strong>③ OPFS 源私有文件系统</strong>
    <span>源独占、不可见、<b>免授权</b>的高性能沙盒；Worker 内同步字节读写</span>
  </div>
</div>

<div class="grid grid-cols-3 gap-4 mt-4">
  <div v-click class="fact"><strong>全浏览器 Baseline</strong><span>2015 年起，含 Web Worker——上传/预览/导出的地基</span></div>
  <div v-click class="fact"><strong>仅 Chromium</strong><span>非 Baseline、每次要用户手势——面向公网必须写降级</span></div>
  <div v-click class="fact"><strong>主入口 Baseline</strong><span>2023-03 起三大浏览器——SQLite WASM 的落点</span></div>
</div>

<div v-click class="takeaway mt-5">
  文件<strong>存哪、多大、何时被清、<code>persist()</code></strong> 归<strong>浏览器存储章</strong>；结构化记录里夹 Blob 归 <strong>IndexedDB 叶</strong>——本讲只讲这三层<strong>怎么编程</strong>。
</div>

<!--
先建立全局地图。同样是「操作文件」，浏览器给了三条能力与支持面都不同的路线。

[click:3] 第一层 File/Blob/FileReader，只读用户通过 input 或拖放交出的文件，拿不到磁盘路径、写不回原文件；第二层 File System Access，读写用户在文件管理器里能看到的真实文件与目录；第三层 OPFS，一个对用户不可见的源私有高速沙盒。

[click:3] 三层的支持面差异极大：第一层 2015 年起全浏览器 Baseline；第二层至今仅 Chromium、非 Baseline；第三层主入口 2023 年 3 月起已跨三大浏览器。

[click] 记住边界：文件存哪、能存多大、何时被驱逐、persist 怎么用，是浏览器存储章的事；结构化数据里夹一个 Blob 是 IndexedDB 叶的事。本讲只讲这三层的 API 编程，边界只点到即链接。
-->

---
layout: default
---

# 三条路线怎么选：先看需求，再看约束

| 需求 | 选哪条 | 关键约束 |
| --- | --- | --- |
| 上传前预览、解析用户选的文件 | **File API** | 只读；全浏览器可用 |
| 在线编辑器"打开本地、存回原文件" | **File System Access** | 仅 Chromium；要手势；写降级 |
| 遍历用户整个项目目录批处理 | **File System Access** | 同上（`showDirectoryPicker`） |
| 离线大文件缓存 / SQLite 搬进浏览器 | **OPFS** | 免授权高性能；同步限 Worker |
| 结构化记录里夹一个头像 Blob | **IndexedDB** | 归 IndexedDB 叶，不展开 |

<div v-click class="takeaway mt-4">
  一句话：<strong>只读 → File API</strong>；<strong>读写可见文件（接受 Chromium / 写降级）→ File System Access</strong>；<strong>私有大容量高性能 → OPFS</strong>。
</div>

<!--
把三条路线放进一张决策表。上传前预览、解析用户选的文件，选 File API，全浏览器可用直接上。想做在线编辑器那种「打开本地文件、Ctrl+S 存回原文件」，或者遍历用户整个项目目录，必须用 File System Access，代价是仅 Chromium、每次要用户手势、面向公网还要写降级。要离线缓存大文件、或者把 SQLite 搬进浏览器，选 OPFS，免授权高性能，但同步 API 限 Worker。最后一行——结构化记录里夹个头像 Blob——那是 IndexedDB 叶的活，本讲不展开。

[click] 一句话决策就三条：只读走 File API；读写可见文件走 File System Access；要私有大容量高性能走 OPFS。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 地基：File 是"带名字的 Blob"，slice 零拷贝

::left::

```js {1-2|4-6|8-10|all}
// File 是 Blob 的子类：只多了 name / lastModified
const file = new File(["中文"], "a.txt", { type: "text/plain" });

file.size; // 6 —— UTF-8 编码后字节数，非字符数（中 = 3 字节）
file.name; // "a.txt"
file.lastModified; // 毫秒时间戳

const head = file.slice(0, 3); // 零拷贝切片，仍是 Blob，不占内存
await head.text(); // "中" —— 此刻才真正把这 3 字节读入内存
// 凡是收 Blob 的 API，都能直接收 File
```

::right::

<div class="rule-stack mt-1">
  <div v-click class="rule tone-green"><strong>继承关系</strong><span><code>File</code> extends <code>Blob</code>，多 <code>name</code>/<code>lastModified</code>/<code>webkitRelativePath</code></span></div>
  <div v-click class="rule tone-blue"><strong><code>size</code> 是字节数</strong><span>编码后字节，不是字符数——中文每字 3 字节</span></div>
  <div v-click class="rule tone-amber"><strong><code>slice</code> 零拷贝</strong><span>只记「从哪到哪」的视图，真正 I/O 在读切片时</span></div>
</div>

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span><code>type</code> 全靠声明/嗅探、<b>不校验内容</b>，可为空串或被伪造——安全校验不能只信它</span>
</div>

<!--
一切从两个数据对象开始。Blob 是一段不可变字节加一个 MIME type 标签；File 就是 Blob 的子类，只多了 name、lastModified 和目录选择时的 webkitRelativePath。

[click:3] 三个要点。第一，继承关系——凡是接受 Blob 的 API，FileReader、createObjectURL、fetch body、createImageBitmap，都能直接接受 File。第二，size 是编码后的字节数不是字符数，一个中文占 3 字节，new Blob(["中文"]).size 是 6 不是 2。第三，slice 是零拷贝的，它只记录一个字节区间的视图，真正的 I/O 发生在你对切片调 text 或 arrayBuffer 时——这是后面大文件分片的地基。

[click] 一个必须刻住的坑：type 只是个标签，浏览器按扩展名或嗅探给，可能为空串、也可能被伪造，安全校验绝不能只信它。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 读 Blob：新式 Promise 优先，FileReader 留三处

::left::

```js {1|3-5|7-9|all}
const reader = new FileReader();
// 结果走事件，不是返回值——异步、非 Promise
reader.onload = () => console.log(reader.result);
reader.onerror = () => console.error(reader.error);
reader.onprogress = (e) => console.log(e.loaded, "/", e.total);
// 三选一，异步启动立即返回
reader.readAsText(file, "utf-8"); // → 字符串
// reader.readAsDataURL(file);    // → data: URL
// reader.readAsArrayBuffer(file);// → ArrayBuffer
```

::right::

<div class="grid grid-cols-2 gap-3 mt-1">
  <div v-click class="fact"><strong><code>text()</code></strong><span>→ <code>string</code>（UTF-8）</span></div>
  <div v-click class="fact"><strong><code>arrayBuffer()</code></strong><span>→ <code>ArrayBuffer</code> 解析二进制</span></div>
  <div v-click class="fact"><strong><code>bytes()</code></strong><span>→ <code>Uint8Array</code>（较新）</span></div>
  <div v-click class="fact"><strong><code>stream()</code></strong><span>→ <code>ReadableStream</code> 超大文件</span></div>
</div>

<div v-click class="signal signal-good mt-4">
  <carbon:checkmark-outline />
  <span>新代码首选 <code>await blob.text()</code> 等——短、可 <code>await</code>、可组合</span>
</div>

<div v-click class="mini-note mt-3">
  FileReader 仅三处不可替代：<b>progress</b> 进度、<b>abort()</b> 取消、<b>readAsDataURL</b>；<code>readAsBinaryString</code> 已废弃。
</div>

<!--
拿到 Blob 要把它变成能用的数据。左边是老式 FileReader——诞生在 Promise 之前，异步、事件驱动：结果放 reader.result，靠 onload、onerror、onprogress 事件取，readAsText、readAsDataURL、readAsArrayBuffer 三选一发起。

[click:4] 右边是新式读法，直接 await blob.text 拿文本、arrayBuffer 拿通用二进制、bytes 拿字节视图、stream 拿流处理超大文件。

[click] 新代码首选后者，短、可 await、可组合，心智负担骤降。

[click] FileReader 只在三处不可替代：需要 progress 进度事件、需要 abort 中途取消、或者读成 DataURL。readAsBinaryString 已废弃，要二进制用 readAsArrayBuffer。下一页现场把这套跑起来。
-->

---
layout: default
class: lab-slide
---

# 交互实验：input/拖放选文件 → 元信息 / slice / 预览

<FileReaderLab />

<!--
现在现场跑真实的 File API。点「选择文件」或直接把文件拖进虚线框。

选中后立刻看到四样东西。左上是元信息——name、size（同时给人类可读和原始字节数，选个含中文的文本你会看到字节数大于字符数）、type（可能是空串）、lastModified。中间是 slice 演示——file.slice(0,16) 零拷贝切前 16 字节，只在这一刻读入内存，渲染成十六进制;选张 PNG 你能看到开头的 89 50 4e 47 魔数。右边按类型分流：文本文件走 slice 前 2KB 再 text() 预览，图片文件走 createObjectURL 造缩略图。

重点看图片那条：缩略图一旦 onload，我们立刻 revokeObjectURL，下面会显示「已 revoke，图仍显示」——因为 DOM 已经持有解码结果，撤 URL 不影响显示，却把那块内存释放了。这就是下一页要讲的内存管理。整个组件顶层零 window 访问、读取全在事件回调里、URL 用后即撤，是 SSR 安全的范例。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# object URL：本叶最高频的内存泄漏源

::left::

```js {1-2|4-5|all}
const url = URL.createObjectURL(blob); // 造 blob:… 短链
img.src = url;

// ⚠️ 用完必撤，否则常驻到文档卸载 = 稳定泄漏
img.onload = () => URL.revokeObjectURL(url);
```

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>每个 <code>createObjectURL</code> 都<b>让对应 Blob 无法被 GC</b>，一直活到显式 revoke 或文档卸载</span>
</div>

::right::

| | `createObjectURL` | `readAsDataURL` |
| --- | --- | --- |
| 形态 | 指向内存的短引用 | base64 内联进字符串 |
| 体积 | 零拷贝、URL 极短 | 比原文件约 **+33%** |
| 内存 | 须手动 `revoke` | 字符串本身、可被 GC |
| 可持久化 | 否（页面级） | 是（普通字符串） |
| 适用 | 预览大图、临时下载 | 小图内联、当字符串存 |

<div v-click class="mini-note mt-3">
  预览在 <code>onload</code> 后撤、下载在 <code>click</code> 后撤、列表卸载统一撤。
</div>

<!--
object URL 是本叶最高频的泄漏源。createObjectURL 给一个 Blob 造一个 blob 开头的短链，交给 img、video、a 使用。

[click:2] 关键在于——每一次 createObjectURL 都在文档里登记一个映射，它让对应的 Blob 无法被垃圾回收，一直活到你显式 revokeObjectURL 或整个文档卸载。在列表里给上百张图各造一个 URL 又不释放，就是一条稳定上升的内存曲线。所以 img.onload 里立刻 revoke。

[click:2] 右边对比 DataURL：createObjectURL 是指向内存的零拷贝短引用，须手动撤；readAsDataURL 把内容 base64 内联进字符串，体积涨约 33%，但它就是个普通字符串，能被 GC、能存进 localStorage。预览大图选前者，需要把图当字符串持久化或传输才选后者。

[click] 释放时机记三条：预览在 onload 后、下载在 click 后、列表卸载时统一撤销本组件登记过的所有 URL。
-->

---
layout: default
---

# 拖放：dataTransfer.files，别忘 preventDefault

<div class="grid grid-cols-[1.1fr_.9fr] gap-8 mt-4 items-start">

```js {1-4|6-11|all}
// 关键：dragover 里必须 preventDefault，
// 否则 drop 不触发、浏览器直接打开文件
zone.addEventListener("dragover", (e) => {
  e.preventDefault();
});

zone.addEventListener("drop", (e) => {
  e.preventDefault(); // 阻止默认"打开文件"
  const files = Array.from(e.dataTransfer.files); // FileList
  for (const file of files) console.log(file.name);
});
```

<div class="rule-stack">
  <div v-click class="rule tone-red"><strong>两处都要 preventDefault</strong><span><code>dragover</code> 阻止默认、<code>drop</code> 阻止打开文件</span></div>
  <div v-click class="rule tone-blue"><strong><code>dataTransfer.files</code></strong><span>拖入文件的 <code>FileList</code>，之后同 input 来源</span></div>
  <div v-click class="rule tone-amber"><strong>进阶 <code>.items</code></strong><span>Chromium 里 <code>getAsFileSystemHandle()</code> 能拿<b>拖入的目录</b></span></div>
</div>

</div>

<div v-click class="takeaway mt-5">
  input 与拖放是 File API 的两条文件来源——共同点是<strong>都拿不到磁盘绝对路径</strong>，<code>input.value</code> 只是个假路径。
</div>

<!--
拖放是 File API 的第二条来源。最容易漏的坑在第一段：必须在 dragover 事件里 preventDefault，否则 drop 根本不会触发、浏览器会直接把文件当页面打开。

[click:2] drop 事件里再 preventDefault 一次，然后从 e.dataTransfer.files 拿 FileList，转成数组遍历，之后就和 input 来源完全一样了。

[click] 进阶一点，e.dataTransfer.items 比 files 更强，每个 item 有 getAsFile，Chromium 里还有 getAsFileSystemHandle，能直接拿到拖入的目录句柄——这就接到了下一层 File System Access。

[click] 记住 input 和拖放的共同点：前端拿到 File 都拿不到磁盘绝对路径，这是安全限制，input.value 里只是个 C 盘 fakepath 的假路径。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# File System Access：三个 picker，返回值形态各异

::left::

```js {1-2|4-5|7-8|all}
// ① 打开：返回句柄【数组】——哪怕单选也是数组
const [fileHandle] = await window.showOpenFilePicker();

// ② 保存：返回【单个】句柄
const saveHandle = await window.showSaveFilePicker({ suggestedName: "note.txt" });

// ③ 选目录：返回【目录句柄】
const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });
// 用户点「取消」→ 三者都以 AbortError reject
```

::right::

| 入口 | 返回 | 记忆点 |
| --- | --- | --- |
| `showOpenFilePicker` | `FileHandle[]` | **数组** |
| `showSaveFilePicker` | `FileHandle` | **单个** |
| `showDirectoryPicker` | `DirectoryHandle` | **目录** |

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span><b>仅 Chromium · 非 Baseline</b>；每个 picker 都要<b>瞬时用户激活</b>，且仅 HTTPS/localhost</span>
</div>

<div v-click class="mini-note mt-3">
  面向公网第一行永远是 <code>if ("showOpenFilePicker" in window)</code> 特性检测。
</div>

<!--
进入第二层。File System Access 是第一个让 Web 读写用户可见真实文件的标准 API，三个入口。最容易记错的是返回值形态各不相同。

[click:3] showOpenFilePicker 返回的是句柄数组，哪怕你没开 multiple 也是长度 1 的数组，所以要用解构 const 方括号 fileHandle。showSaveFilePicker 返回单个句柄。showDirectoryPicker 返回目录句柄。用户点取消时，三者都以 AbortError reject，要 try catch 区分取消和真错误。

[click:2] 一条必须刻在脑子里的约束：至今仅 Chromium 实现、不是 Baseline，Firefox 和 Safari 出于隐私长期不落地这三个 picker；而且每次弹 picker 都要瞬时用户激活，不能页面加载时静默调用，还只在 HTTPS 或 localhost 可用。

[click] 所以面向公网的第一行永远是特性检测——showOpenFilePicker in window，为假就走降级。
-->

---
layout: default
---

# 写回磁盘：createWritable → write → close 才落盘

<div class="grid grid-cols-[1.05fr_.95fr] gap-8 mt-4 items-start">

```js {1|2-5|6|all}
const writable = await fileHandle.createWritable(); // 写进临时文件
await writable.write("第一段"); // 光标处写入
await writable.write({ type: "seek", position: 0 }); // 移动光标
await writable.write("覆盖开头");
await writable.truncate(100); // 裁剪到 100 字节
await writable.close(); // ⭐ 此刻才把临时文件原子替换到目标
```

<div class="rule-stack">
  <div v-click class="rule tone-red"><strong>写的是临时文件</strong><span>不 <code>close()</code> 改动全丢；中途崩溃原文件无损（原子写）</span></div>
  <div v-click class="rule tone-green"><strong><code>close()</code> 才生效</strong><span>关闭时临时文件<b>原子替换</b>到目标，避免写坏</span></div>
  <div v-click class="rule tone-blue"><strong>增量改</strong><span><code>createWritable({ keepExistingData: true })</code> 保留原内容</span></div>
</div>

</div>

<div v-click class="mini-note mt-5">
  <code>FileSystemWritableFileStream</code> 继承 <code>WritableStream</code>：<code>write</code> / <code>seek</code> / <code>truncate</code> / <code>close</code> / <code>abort</code>；接口本身近年已跨浏览器，但入口 picker 仍锁 Chromium。
</div>

<!--
拿到文件句柄怎么写。createWritable 拿到一个可写流，注意——你写进的是一个临时文件，不是目标文件本身。

[click:3] write 在光标处写入，可以传对象做 seek 移动光标、truncate 裁剪。真正的关键在最后一行：close 的这一刻，才把临时文件原子替换到目标文件。

[click:2] 两个语义要记牢。第一，中途崩溃或者忘了 close，原文件安然无恙，这是原子写、避免写坏文件。第二，默认是清空重写，要在原内容基础上增量改，得传 keepExistingData true 保留原数据再用 seek 局部覆盖。

[click] 补一句支持面：FileSystemWritableFileStream 这个接口本身近年已经跨浏览器 Baseline 了，但它的入口 picker 仍锁 Chromium，所以整条「picker 到写回可见文件」的链条依然非 Baseline。真正跨浏览器的 createWritable 在 OPFS 里。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 权限与句柄持久化：句柄能存，权限不能

::left::

```js {1-4|6-9|all}
async function ensurePermission(handle, mode = "readwrite") {
  if ((await handle.queryPermission({ mode })) === "granted") return true;
  return (await handle.requestPermission({ mode })) === "granted";
}

// 句柄可结构化克隆 → 存进 IndexedDB（不能进 localStorage）
await set("last-file", fileHandle); // idb-keyval 示意
const handle = await get("last-file"); // 下次会话取回，引用仍指原文件
if (await ensurePermission(handle)) await (await handle.getFile()).text();
```

::right::

<div class="rule-stack mt-1">
  <div v-click class="rule tone-blue"><strong>句柄可持久化</strong><span><code>FileSystemHandle</code> 结构化克隆 → <b>IndexedDB</b>，做"最近打开"</span></div>
  <div v-click class="rule tone-red"><strong>权限不随句柄走</strong><span>重开会话取回句柄，<code>queryPermission</code> 是 <code>"prompt"</code></span></div>
  <div v-click class="rule tone-amber"><strong>复用要确权</strong><span>必须在用户手势里 <code>requestPermission</code> 重新确权</span></div>
</div>

<div v-click class="mini-note mt-4">
  <code>queryPermission</code>/<code>requestPermission</code> 是 <b>Chromium 非标准</b>扩展；把 Blob/句柄存进结构化记录归 <b>IndexedDB 叶</b>。
</div>

<!--
File System Access 最实用的能力之一：把句柄存起来，下次直接打开「最近的文件」。

[click:3] 左边 ensurePermission：先 queryPermission 查，已授权直接过，否则 requestPermission 求。关键在下面——FileSystemHandle 是可结构化克隆的，能直接 put 进 IndexedDB，注意是 IndexedDB 不是 localStorage，后者只存字符串。下次会话 get 取回，句柄的引用仍指向原来那个文件。

[click:3] 右边三条规则。句柄能持久化；但权限不能——重开页面拿到的句柄，queryPermission 会是 prompt；所以复用前必须在用户手势里 requestPermission 重新确权。

[click] 两个提醒：queryPermission 和 requestPermission 是 Chromium 非标准扩展；而把 Blob 或句柄当字段塞进结构化记录、连同其他字段一起事务存取，那套完整用法在 IndexedDB 叶，本讲只点到。
-->

---
layout: default
---

# 降级：面向公网必须给 Firefox / Safari 退路

<div class="grid grid-cols-[1.05fr_.95fr] gap-8 mt-4 items-start">

```js {1-2|3-8|9-13|all}
/** 保存：优先写回原文件，降级到 a.download 下载 */
async function saveFile(blob, name) {
  if ("showSaveFilePicker" in window) { // Chromium 原生
    const h = await window.showSaveFilePicker({ suggestedName: name });
    const w = await h.createWritable();
    await w.write(blob);
    await w.close(); // 原地存回原文件
    return;
  }
  const url = URL.createObjectURL(blob); // 降级：object URL + a[download]
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url); // 用完即撤
}
```

<div class="rule-stack">
  <div v-click class="rule tone-green"><strong>原生</strong><span>打开 A.txt → 改 → <b>原地存回</b> A.txt</span></div>
  <div v-click class="rule tone-amber"><strong>降级</strong><span>"保存"永远是<b>另存/下载</b>新文件，拿不到原文件引用</span></div>
  <div v-click class="rule tone-blue"><strong>成熟库</strong><span><code>browser-fs-access</code> 封装优先/降级</span></div>
</div>

</div>

<!--
面向公网必须给不支持 picker 的 Firefox 和 Safari 一条退路。

[click:2] 左边 saveFile：先特性检测 showSaveFilePicker in window，支持就走 Chromium 原生，拿句柄、createWritable、write、close，原地存回原文件。

[click] 不支持就降级——object URL 加隐藏 a download，走浏览器下载，用完立刻 revoke 避免泄漏。同理 openFile 降级到临时 input。

[click:3] 降级的本质差异必须讲清楚：原生路线能「打开 A.txt、改、原地存回 A.txt」；降级路线的「保存」永远是另存或下载一个新文件，拿不到原文件引用。成熟项目可以直接用 GoogleChromeLabs 的 browser-fs-access 库，自动封装这套优先原生、降级 input 加 a 的逻辑。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# OPFS：源私有、免授权、主入口跨浏览器

::left::

```js {1-2|4-7|9|all}
// 唯一入口：源私有根目录（免 picker、免用户激活、免确权）
const root = await navigator.storage.getDirectory();

const fh = await root.getFileHandle("cache.bin", { create: true });
const w = await fh.createWritable(); // 主线程异步写
await w.write(new Uint8Array([1, 2, 3]));
await w.close();

const file = await fh.getFile(); // 读同普通 File，await file.text()
```

::right::

<div class="grid grid-cols-1 gap-3 mt-1">
  <div v-click class="fact tone-amber" style="border-left-color:#b76e00"><strong>源私有</strong><span>每个源一棵独立文件树，别的源与用户都看不到，路径不暴露</span></div>
  <div v-click class="fact tone-green" style="border-left-color:#17875d"><strong>免授权</strong><span>没有 picker、没有权限弹窗、没有用户激活——直接 <code>getDirectory()</code></span></div>
  <div v-click class="fact" style="border-left-color:#3178c6"><strong>主入口 Baseline</strong><span>Chrome 102 / Safari 15.2 / Firefox 111（2023-03）</span></div>
</div>

<div v-click class="mini-note mt-3">
  容量/驱逐/<code>persist()</code> → <b>浏览器存储章</b>（本页只讲 API）。
</div>

<!--
第三层 OPFS，Origin Private File System，源私有文件系统。它和上一层用的是同一套句柄 API，但作用在一个对用户不可见的沙盒里。

[click:3] 左边看入口：navigator.storage.getDirectory 拿到源私有根目录，注意——免 picker、免用户激活、免确权，代码直接调就能读写。之后 getFileHandle 建文件、createWritable 主线程异步写、getFile 读，和 File System Access 完全一样，只是不用弹窗。

[click:3] 右边三个决定性特征：源私有——每个源一棵独立文件树，别的源和用户在文件管理器里都看不到；免授权——没有任何弹窗；主入口已跨浏览器 Baseline，Chrome 102、Safari 15.2、Firefox 111，2023 年 3 月起。

[click] 边界提醒：OPFS 占多大、会不会被驱逐、persist 怎么申请持久化，是浏览器存储章的话题，本页只讲 API。
-->

---
layout: default
---

# 高性能杀手锏：createSyncAccessHandle，仅 Worker

````md magic-move {at:1}
```js
// worker.js —— 只能在 Dedicated Web Worker 内
const root = await navigator.storage.getDirectory();
const fh = await root.getFileHandle("fast.bin", { create: true });
```

```js
// createSyncAccessHandle 本身 async（要 await），
// 但它返回的句柄上所有方法【全同步】——无 await
const h = await fh.createSyncAccessHandle();
const size = h.getSize(); // 同步：当前字节数
```

```js
const h = await fh.createSyncAccessHandle();
h.write(new TextEncoder().encode("hi"), { at: h.getSize() }); // 同步写、返回字节数
h.flush(); // 同步落盘
const buf = new DataView(new ArrayBuffer(h.getSize()));
h.read(buf, { at: 0 }); // 同步读、{ at } 随机偏移
h.close(); // ⭐ 必须关闭，释放独占锁
```
````

<div class="grid grid-cols-2 gap-4 mt-4">
  <div v-click class="fact"><strong>仅 Worker · 全同步 · 独占锁</strong><span>同步 I/O 放主线程会卡死 UI，故刻意限 Dedicated Worker；用完必 <code>close()</code></span></div>
  <div v-click class="fact"><strong>SQLite WASM 的主力</strong><span><code>read/write({ at })</code> 随机偏移 + 同步语义，正对数据库 VFS 胃口</span></div>
</div>

<!--
OPFS 的性能杀手锏是 createSyncAccessHandle，同步的字节级读写。

[click] 第一步，在 Worker 里 getDirectory、getFileHandle，和主线程一样。

[click] 第二步是最容易搞混的组合：createSyncAccessHandle 本身是 async 要 await，但它返回的句柄上所有方法全是同步的，getSize、read、write 都没有 await。

[click] 第三步跑起来：write 传字节和 at 偏移、flush 落盘、read 读进你提供的 buffer、最后 close 释放独占锁。

[click:2] 两个必记点。一，它只能在 Dedicated Web Worker 里用，主线程调用直接抛错——因为同步 I/O 放主线程会卡死 UI，这是刻意设计；而且默认对文件加独占锁，用完必须 close，忘了会锁死文件。二，正因为它提供 read write 带 at 的随机偏移加同步语义，恰好对上 SQLite 的 VFS 胃口，所以它是把 SQLite 搬进浏览器方案的性能主力，官方反复强调 OPFS 为数据库类高性能场景设计。
-->

---
layout: default
---

# OPFS vs File System Access：私有 vs 可见

| 维度 | **OPFS** | **File System Access（picker）** |
| --- | --- | --- |
| 文件可见性 | 源私有沙盒，用户**不可见** | 用户桌面上**真实可见**的文件 |
| 授权 | **免**——无 picker、无弹窗、无激活 | 每次 picker 要**用户激活**；写要确权 |
| 支持面 | **主入口 Baseline**（含 Safari/FF） | **仅 Chromium** |
| 同步 API | **有**（`createSyncAccessHandle`，限 Worker） | 无（只有异步 `createWritable`） |
| 典型用途 | 数据库、缓存、离线大文件（应用自用） | 打开/编辑/保存用户文档 |
| 数据归属 | 应用私有数据（清站点数据即没） | 用户的文件（独立于站点数据） |

<div v-click class="takeaway mt-5">
  一句话：<strong>OPFS 是"应用自己的高速私有磁盘"，File System Access 是"借用户之手读写用户自己的文件"</strong>。
</div>

<!--
把两层放一起对照，它们是两个世界。

文件可见性：OPFS 在源私有沙盒里、用户不可见；File System Access 操作的是用户桌面上真实可见的文件。授权：OPFS 免授权直接可用；picker 每次要用户激活、写还要确权。支持面：OPFS 主入口跨浏览器含 Safari 和 Firefox；picker 仅 Chromium。同步 API：OPFS 有 createSyncAccessHandle 限 Worker，picker 一侧没有。典型用途和数据归属：OPFS 存的是应用自己的私有数据、清掉站点数据就没了；File System Access 操作的是用户的文件、独立于站点数据。

[click] 一句话记住：OPFS 是应用自己的高速私有磁盘，File System Access 是借用户之手读写用户自己的文件。要存应用内部数据、要大要快要私有，选 OPFS；要操作用户能在文件管理器里看到的文档，选 File System Access。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 目录遍历：entries 异步迭代，按 kind 分流

::left::

```js {1|3-8|10-12|all}
const dir = await window.showDirectoryPicker({ mode: "readwrite" });

// 异步迭代：entries() 给 [名字, 句柄]
for await (const [name, handle] of dir.entries()) {
  handle.kind === "file"
    ? console.log("文件", name)
    : console.log("子目录", name); // 是 DirectoryHandle，可递归
}

const sub = await dir.getDirectoryHandle("assets", { create: true });
await dir.removeEntry("old.txt");
await dir.removeEntry("cache", { recursive: true }); // 删非空目录
```

::right::

<div class="rule-stack mt-1">
  <div v-click class="rule tone-blue"><strong>三个异步迭代器</strong><span><code>entries()</code> / <code>keys()</code> / <code>values()</code>；<code>for await...of dir</code> ≡ <code>entries()</code></span></div>
  <div v-click class="rule tone-green"><strong><code>{ create: true }</code></strong><span>存在则返回、不存在则建；缺省不存在抛 <code>NotFoundError</code></span></div>
  <div v-click class="rule tone-amber"><strong><code>resolve(handle)</code></strong><span>算某句柄相对本目录的路径段数组</span></div>
</div>

<div v-click class="mini-note mt-4">
  OPFS 与 File System Access 共用<b>同一套目录 API</b>——只是 OPFS 不用 picker、不用确权。
</div>

<!--
目录句柄怎么用。左边：showDirectoryPicker 拿到目录句柄后，用 for await of 异步迭代 entries，每次给一个「名字加句柄」对，按 handle.kind 是 file 还是 directory 分流，是目录就能递归下去。getDirectoryHandle、getFileHandle 传 create true 取或建子条目，removeEntry 删除、recursive 删非空目录。

[click:3] 右边三条。第一，三个异步迭代器：entries 给名字加句柄、keys 给名字、values 给句柄，直接 for await of 目录本身等价于 entries。第二，create true 的语义：存在则返回、不存在则创建；不传时若不存在抛 NotFoundError。第三，resolve 能算出某个句柄相对当前目录的路径段数组。

[click] 关键一点：这套目录 API，OPFS 和 File System Access 是完全共用的，同样的 getFileHandle、entries、removeEntry，只是 OPFS 不用 picker、不用确权。
-->

---
layout: default
---

# 三路线支持矩阵：按"入口"检测，不是按 API

| 特性 | Chrome/Edge | Firefox | Safari | Baseline |
| --- | --- | --- | --- | --- |
| `File`/`Blob`/`FileReader`/读法/`objectURL` | ✅ | ✅ | ✅ | ✅ 2015 |
| `showOpen/Save/DirectoryPicker` | ✅ | ❌ | ❌ | ❌ 仅 Chromium |
| `WritableFileStream` 接口 | ✅ | ✅ | ✅ | ✅ 接口 · 入口锁 Chromium |
| `getDirectory()`（OPFS 根） | ✅ 102 | ✅ 111 | ✅ 15.2 | ✅ 2023-03 |
| `createSyncAccessHandle()`（Worker） | ✅ | ✅ | ✅ | ✅ 限 Worker |

<div v-click class="takeaway mt-3">
  同样是"写文件"，<strong>OPFS 跨浏览器、picker 仅 Chromium</strong>——特性检测按<strong>具体入口</strong>分别做，别把三条路线当一个开关。
</div>

<!--
一张矩阵收束支持面。底层 File、Blob、FileReader、新式读法、createObjectURL，全浏览器 Baseline，2015 年起。三个 picker，只有 Chrome 和 Edge 有，Firefox、Safari 都是叉，非 Baseline。FileSystemWritableFileStream 接口本身三家都支持了，但它的入口 picker 仍锁 Chromium。OPFS 根 getDirectory，Chrome 102、Firefox 111、Safari 15.2，2023 年 3 月起跨浏览器。Worker 内的 createSyncAccessHandle，同批落地、跨浏览器。

[click] 最关键的推论：同样是「写文件」这件事，OPFS 里是跨浏览器的、picker 里却仅 Chromium。所以特性检测千万别把三条路线当一个开关，要按具体入口分别测——showOpenFilePicker in window 测 picker、getDirectory in navigator.storage 测 OPFS，Safari 和 Firefox 正是「有 OPFS、无 picker」的组合。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 工程模式：下载 / 预览 / 导出

::left::

```js {1-8|all}
/** 跨浏览器通用下载：Blob → a[download] */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename; // 触发下载而非导航
  a.click();
  URL.revokeObjectURL(url); // ⭐ 立即释放
}
```

::right::

<div class="rule-stack mt-1">
  <div v-click class="rule tone-blue"><strong>图片预览</strong><span>首选 <code>img.src = URL.createObjectURL(file)</code>，<code>onload</code> 后 revoke——省 base64 +33%</span></div>
  <div v-click class="rule tone-amber"><strong>CSV 导出</strong><span><code>new Blob([csv], { type: "text/csv" })</code>；中文加 <b>UTF-8 BOM</b> 防 Excel 乱码</span></div>
  <div v-click class="rule tone-green"><strong>JSON 导出</strong><span><code>JSON.stringify(data, null, 2)</code> → Blob → 下载式</span></div>
</div>

<div v-click class="mini-note mt-3">
  Chromium 想要"选保存位置"就先分支到 <code>showSaveFilePicker</code>，失败再退回这段。
</div>

<!--
把三层的读写拼成实战工程模式。左边是导出功能的默认实现——跨浏览器通用下载：Blob 造 object URL，建隐藏 a、设 download 属性触发下载而非导航、程序化 click、然后立即 revoke。全浏览器可用。

[click:3] 右边三个高频场景。图片预览首选 object URL，img.src 赋值、onload 后 revoke，比 readAsDataURL 省掉 base64 的 33% 膨胀。CSV 导出拼字符串包 Blob，中文一定要加 UTF-8 BOM，否则 Excel 打开乱码。JSON 导出 stringify 加两个缩进参数再走下载式。

[click] 补一句：在 Chromium 上想要「选择保存位置」的原生体验，可以在 downloadBlob 前分支到 showSaveFilePicker，不支持或失败再退回这段通用下载。
-->

---
layout: default
---

# 大文件：slice 分片 + 断点续传

<div class="grid grid-cols-[1.15fr_.85fr] gap-8 mt-4 items-start">

```js {1|3-4|6-10|all}
const CHUNK = 5 * 1024 * 1024; // 5MB 一片

// ① 先问服务端已收哪些片（断点续传关键）
const done = new Set((await fetch(`/status`).then((r) => r.json())).chunks);

for (let i = 0; i < Math.ceil(file.size / CHUNK); i++) {
  if (done.has(i)) continue; // 跳过已传
  const chunk = file.slice(i * CHUNK, (i + 1) * CHUNK); // 零拷贝切片
  await fetch(`/chunk/${i}`, { method: "PUT", body: chunk }); // Blob 直作 body
}
```

<div class="rule-stack">
  <div v-click class="rule tone-red"><strong>别整体读</strong><span>GB 级文件禁 <code>file.arrayBuffer()</code>/<code>text()</code>，用 <code>slice</code> 或 <code>stream</code></span></div>
  <div v-click class="rule tone-green"><strong>切片零成本</strong><span><code>slice</code> 只记区间，I/O 在 <code>fetch(body=chunk)</code> 时</span></div>
  <div v-click class="rule tone-blue"><strong>限并发 + 片内重试</strong><span>3~4 片并发、瞬时抖动重试；要秒传给片算哈希</span></div>
</div>

</div>

<!--
大文件——视频、镜像——绝不能整体读进内存。左边是分片加断点续传的骨架：5MB 一片；先问服务端已经收到哪些片，这是断点续传的关键；然后循环，跳过已传的片，用 slice 零拷贝切出当前片，Blob 可以直接当 fetch 的 body 上传。

[click:3] 右边三条铁律。第一，别对大文件整体 arrayBuffer 或 text，那会把整个 GB 级文件塞进内存，用 slice 分片或 stream 流式。第二，切片本身零成本，slice 只记录一个区间，真正的 I/O 发生在 fetch 传 chunk 那一刻。第三，工程上限制并发比如 3 到 4 片、片内失败重试吸收网络抖动；想做秒传去重就给每片算哈希，crypto.subtle.digest 配 chunk.arrayBuffer。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 载体选型 + 内存红线

::left::

| 载体 | 什么时候用 |
| --- | --- |
| **`File`** | 要文件名、修改时间（input/拖放/句柄） |
| **`Blob`** | 跨 API 传整块（上传 body、objectURL、存 IDB） |
| **`ArrayBuffer`** | 解析/改写二进制（`DataView`、算哈希） |
| **`ReadableStream`** | 超大文件、边读边处理、管道转换 |

<div v-click class="mini-note mt-3">
  口诀：只读小数据 <code>text()</code>；解析二进制 <code>arrayBuffer()</code>；超大/管道 <code>stream()</code>。
</div>

::right::

<div class="rule-stack mt-1">
  <div v-click class="rule tone-red"><strong>object URL 撤销时机</strong><span>预览 <code>onload</code> 后、下载 <code>click</code> 后、卸载统一撤</span></div>
  <div v-click class="rule tone-amber"><strong>列表懒建懒撤</strong><span><code>IntersectionObserver</code> 进视口才建 URL、离开就 revoke</span></div>
  <div v-click class="rule tone-blue"><strong>安全校验</strong><span><code>type</code>/扩展名可伪造，服务端按<b>魔数/内容</b>校验</span></div>
</div>

<!--
同一份数据有多种载体，按「你要拿它干什么」选。左边表：要文件名和修改时间留着 File；跨 API 传整块字节用 Blob，上传 body、createObjectURL、存 IndexedDB 都是它；要解析或改写二进制用 ArrayBuffer 配 DataView、算哈希；超大文件、边读边处理、管道转换用 ReadableStream。

[click] 口诀四句：只读小数据 text，解析二进制 arrayBuffer，超大或管道 stream，要元数据留 File、跨 API 传字节用 Blob。

[click:3] 右边是内存红线。object URL 撤销时机：预览 onload 后、下载 click 后、组件卸载统一撤。列表大量预览用 IntersectionObserver 懒建懒撤——进视口才建 URL、离开视口就 revoke。最后安全：file.type 和扩展名都可伪造，前端先卡大小减少无效上传，但服务端必须按魔数、按内容校验。
-->

---
layout: default
---

# 易错点清单

<div class="grid grid-cols-2 gap-x-6 gap-y-3 mt-5">
  <div v-click class="signal signal-bad"><carbon:close /><span>忘 <code>revokeObjectURL</code>——常驻到文档卸载，预览/下载后即撤</span></div>
  <div v-click class="signal signal-bad"><carbon:close /><span>把 File System Access 当默认——仅 Chromium，公网必写降级</span></div>
  <div v-click class="signal signal-bad"><carbon:close /><span>picker 不在用户手势里调——抛 <code>SecurityError</code></span></div>
  <div v-click class="signal signal-bad"><carbon:close /><span><code>showOpenFilePicker</code> 当单句柄——它返回<b>数组</b></span></div>
  <div v-click class="signal signal-bad"><carbon:close /><span><code>createWritable</code> 后不 <code>close()</code>——写进临时文件、改动全丢</span></div>
  <div v-click class="signal signal-bad"><carbon:close /><span>以为句柄持久化带权限——重开需重新 <code>requestPermission</code></span></div>
  <div v-click class="signal signal-bad"><carbon:close /><span>主线程调 <code>createSyncAccessHandle</code>——仅 Dedicated Worker</span></div>
  <div v-click class="signal signal-bad"><carbon:close /><span>大文件整体 <code>arrayBuffer()</code>——GB 全进内存，用 <code>slice</code></span></div>
</div>

<!--
一屏收束最常踩的坑。忘 revokeObjectURL，object URL 常驻到文档卸载，预览 onload 后、下载 click 后立即撤。把 File System Access 当默认能力——它仅 Chromium，面向公网必须写 input 加 a download 降级。picker 不在用户手势里调，抛 SecurityError。把 showOpenFilePicker 当返回单句柄——它返回数组，哪怕单选，要用解构。createWritable 后不 close，写进的是临时文件、改动全丢。以为句柄持久化就带权限——权限不随句柄走，重开会话取回句柄要重新 requestPermission。在主线程调 createSyncAccessHandle——那是同步 API、仅 Dedicated Worker。大文件整体 arrayBuffer 或 text——GB 级全进内存，用 slice 分片或 stream。

还有几条速记：把句柄存 localStorage（只能存字符串，句柄要存 IndexedDB）、只信 type 做安全校验、blob.size 当字符数、CSV 中文忘加 BOM、把三条路线当一个特性检测——这些参考页都有清单。
-->

---
layout: center
class: summary-slide
---

# 带走四个判断

<div class="summary-grid mt-8">
  <div><span>01</span><strong>三层分工先认清</strong><small>只读 File API · 可见 FS Access · 私有 OPFS</small></div>
  <div><span>02</span><strong>按入口做特性检测</strong><small>picker 仅 Chromium，OPFS 跨浏览器，分别测</small></div>
  <div><span>03</span><strong>object URL 必配对</strong><small>createObjectURL 用完 revoke，否则稳定泄漏</small></div>
  <div><span>04</span><strong>同步高性能进 Worker</strong><small>createSyncAccessHandle 限 Worker、用完 close</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_API" target="_blank"><carbon:document /> MDN File System API</a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system" target="_blank"><carbon:book /> MDN OPFS</a>
  <a href="https://developer.chrome.com/docs/capabilities/web-apis/file-system-access" target="_blank"><carbon:chip /> Chrome FS Access</a>
  <a href="https://fs.spec.whatwg.org/" target="_blank"><carbon:logo-github /> WHATWG fs</a>
</div>

<!--
最后用四句话复盘。第一，三层分工先认清：只读用户交出的文件走 File API、读写用户可见文件走 File System Access、要私有高性能走 OPFS。第二，特性检测按具体入口做，picker 仅 Chromium、OPFS 跨浏览器，分别测，别一杆子。第三，object URL 必须配对，createObjectURL 用完就 revoke，否则是稳定的内存泄漏。第四，要同步高性能就把 createSyncAccessHandle 放进 Worker，用完 close 释放独占锁。

掌握这四条判断，再深入 SQLite WASM、browser-fs-access 封装、Streams 管道这些进阶，就有了稳定的基座。定位配额去浏览器存储章，结构化夹 Blob 去 IndexedDB 叶。
-->
