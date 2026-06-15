---
theme: seriph
background: https://cover.sli.dev
title: docx-editor — 浏览器内编辑 .docx
info: |
  Presentation docx-editor (@eigenpal/docx-editor) — 浏览器内 WYSIWYG 编辑 .docx，可编辑、修订追踪、实时协同。

  Learn more at [https://www.docx-editor.dev/](https://www.docx-editor.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📝</span>
</div>

<br/>

## docx-editor — 浏览器内编辑 .docx

`@eigenpal/docx-editor`：在浏览器里所见即所得编辑 Word 文档，`.docx` 进、`.docx` 出。canonical OOXML、修订追踪、实时协同。支持 React / Vue 3

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/eigenpal/docx-editor" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 docx-editor，npm 作用域是 @eigenpal。它的官方定位是一句话：浏览器内的 WYSIWYG .docx 编辑器，支持 React 和 Vue，带 canonical OOXML、修订追踪、实时协同，而且 agent-ready。

它最关键的卖点只有一个词：可编辑。同一栏里的 docx 是生成、mammoth 是解析转 HTML、docx-preview 是只读渲染，只有它让用户在浏览器里真正改文档，再写回 .docx。

它是较新的项目，迭代很快，所有事实我都以官网 docx-editor.dev 和 GitHub 源码为准。版本基线 1.5.0，许可证 Apache-2.0。

主线：定位与差异 → 架构 → 安装 → 加载保存 → mode → 修订追踪 → 往返 → 协同 → headless → agents → 选型 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它解决什么问题

<v-clicks>

- 要在网页里**直接改** Word 文档，不只是预览
- 改完要还是**标准 .docx**，能用 Word 打开
- 要**修订追踪**，和 Word 审阅窗格互通
- 要**多人实时协同**编辑同一份文档

</v-clicks>

<div v-click class="mt-6">

docx-editor 的回应：

- **WYSIWYG 编辑** → 正文 / 表格 / 图片 / 页眉页脚
- **canonical OOXML** → 语义无损往返
- **suggesting 模式** → 写成原生 `w:ins` / `w:del`
- **Yjs（CRDT）** → 光标 / 在场 / 修订归属

</div>

<!--
为什么需要这样一个库？四个真实诉求。第一，要在网页里直接改 Word 文档，不是 mammoth 那种转成 HTML 看，而是真正编辑。第二，改完还得是标准 .docx，能在 Word、WPS 里正常打开。第三，要修订追踪，企业合同审阅离不开，而且最好和 Word 的审阅窗格互通。第四，要多人实时协同，像在线文档那样。

docx-editor 针对性地回应：提供浏览器内 WYSIWYG 编辑，覆盖正文、表格、图片、页眉页脚；用 canonical OOXML 做语义无损往返；suggesting 模式把编辑写成 Word 原生的 w:ins 和 w:del；协同基于 Yjs，也就是 CRDT，提供光标、在场状态、修订归属。这四点就是今天的主线。
-->

---

# 和同类库的本质差异

| 库 | 角色 | 可编辑 | 修订 | 协同 |
|---|---|---|---|---|
| **docx-editor** | **浏览器内编辑** | ✓ | ✓ | ✓ |
| docx | 生成 | ✗ | ✗ | ✗ |
| mammoth | 解析转 HTML | ✗ | ✗ | ✗ |
| docx-preview | 只读渲染 | ✗ | ✗ | ✗ |
| docxtemplater | 模板批量生成 | ✗ | ✗ | ✗ |

<div v-click class="mt-4">

> 一句话：**它是唯一让用户/AI 在浏览器里真正编辑 .docx 并写回的那个**。

</div>

<!--
把它放进文档处理这一栏，和邻居们对比，本质差异一目了然。

docx 是从零生成 .docx，没有编辑界面。mammoth 是把 .docx 解析转成 HTML 展示，单向、不可编辑。docx-preview 是只读渲染，看得见改不了。docxtemplater 是按占位符把数据填进模板批量生成，也没有可视化编辑。

docx-editor 是这一栏里唯一可编辑的：用户或者 AI agent 能在浏览器的所见即所得界面里真正改文档，再序列化回 .docx。修订追踪和实时协同更是其它几个完全没有的能力。记住这句话：它是唯一让人在浏览器里真正编辑 .docx 并写回的那个。
-->

---

# 架构：双渲染器

<v-clicks>

- **隐藏的 ProseMirror 实例** = 编辑器：持有文档状态、选区、撤销、IME 输入；离屏、永不显示
- **布局画家（layout painter）** = 渲染器：用 Word 度量（twips / EMU）重建分页页面
- 换行与分页由**画家计算**，浏览器不参与；输出是 **DOM 文本**，非画布位图
- 一层薄桥双向同步：点击映射回 ProseMirror 位置，标记落在正确像素

</v-clicks>

<div v-click class="mt-4 text-sm">

> 代价：每个可见特性都要在画家里实现。收益：表达 contenteditable 表达不了的真实分页，且可选择、可访问。

</div>

<!--
它凭什么做到 Word 级排版保真？靠的是双渲染器架构，这是理解全库的关键。

它同时跑两个渲染器、两套 DOM。第一个是隐藏的 ProseMirror 实例，它才是真正的编辑器，持有文档状态、选区、撤销重做、键盘和 IME 输入，但它离屏挂载、永远不显示给用户。第二个是布局画家，它是唯一可见的渲染器，每次状态变化就从 ProseMirror 重建静态 DOM，用 Word 自己的度量单位，twips、half-points、EMU，计算页面尺寸、页边距、页眉页脚和分页。

关键点：换行和分页是画家计算的，浏览器不参与决定，输出还是普通 DOM 文本，不是 canvas 位图，所以能选择、能被辅助技术读。两者通过一层薄桥同步，点击画面会映射回 ProseMirror 位置，选区高亮、批注锚点、修订标记因此能精确落在像素上。代价是每个可见特性都得在画家里实现，但收益是表达出了 contenteditable 根本表达不了的真实分页。
-->

---

# 安装：选一个适配器

```bash
npm install @eigenpal/docx-editor-react   # React
npm install @eigenpal/docx-editor-vue     # Vue 3
npm install @eigenpal/nuxt-docx-editor    # Nuxt 3 & 4 模块
npm install @eigenpal/docx-editor-core    # 无 UI 服务端处理
npm install @eigenpal/docx-editor-agents  # AI / agent 工具
```

<v-clicks>

- 适配器会**传递带入** `-core` 与 `-i18n`，多数应用装一个即可
- `prosemirror-*` 是 **peer 依赖**：npm 7+ 自动装；pnpm/Yarn PnP 需显式补齐
- 0.x 单体 `@eigenpal/docx-js-editor` 已归档，建议用 1.x（≥1.0.1）

</v-clicks>

<!--
安装。1.x 把库按关注点拆成多个包，但大多数应用只装一个适配器就够。

React 装 docx-editor-react，Vue 3 装 docx-editor-vue，Nuxt 装专门的 nuxt-docx-editor 模块。无 UI 的服务端处理装 docx-editor-core，AI 工具装 docx-editor-agents。

要点：适配器会把框架无关核心 -core 和语言包 -i18n 作为传递依赖一起带进来，所以常规应用装一个适配器即可，只有当你直接 import 文档模型、agent 工具或语言数据时才点名其它包。

一个坑：ProseMirror 系列包是 peerDependencies，为的是避免重复的编辑器状态包导致状态分裂。npm 7 以上会自动装，但 pnpm 关了 peer 自动安装、或者 Yarn PnP，需要你显式安装那一串 prosemirror 包。另外 0.x 的单体包 docx-js-editor 已经归档，建议直接用 1.x，至少升到 1.0.1，它修了一些导入路径的痛点。
-->

---

# 挂载：组件 + 样式表

```tsx
import { DocxEditor } from '@eigenpal/docx-editor-react';
import '@eigenpal/docx-editor-react/styles.css'; // 缺了工具栏无样式

export default function App() {
  return <DocxEditor documentBuffer={null} mode="editing" />;
}
```

<div v-click class="mt-2 text-sm">

> 样式作用域在 `.ep-root`，**不泄漏**到你的应用。Vue 写法对等：同组件名、同 props，`import '.../docx-editor-vue/styles.css'`。

</div>

<!--
挂载只要两样东西：组件和样式表。从 docx-editor-react 里导入 DocxEditor 组件，再导入它的 styles.css。注意样式表不能漏，漏了编辑器仍能工作，但工具栏会渲染成没样式的裸状态。

documentBuffer 传 null 表示立即挂一个空文档，适合从零录入。

样式作用域在 .ep-root 这个类下面，官方保证不会泄漏污染你自己的应用样式。Vue 端完全对等，同样的组件名、同样的 props，只是把样式表换成 docx-editor-vue 的 styles.css。React 和 Vue 的对等是由机器校验的契约保证的。
-->

---

# 加载与保存：buffer 进，save 出

```tsx
const ref = useRef<DocxEditorRef>(null);

// 加载：documentBuffer 接受 File / Blob / ArrayBuffer / Uint8Array
<DocxEditor ref={ref} documentBuffer={file} mode="editing" />

// 保存：返回 Promise<ArrayBuffer | null>，务必判空
const out = await ref.current?.save();
```

<v-clicks>

- `documentBuffer`：`null` 挂空文档，`undefined` 推迟挂载（防闪烁）
- 远程加载：`fetch(url).then(r => r.arrayBuffer())`，**不能用 `text()`**
- `onSave` 接住用户经工具栏（Ctrl/Cmd+S）触发的保存

</v-clicks>

<!--
核心用法就一句话：buffer 进，save 出，全程客户端。

加载用 documentBuffer prop，它接受 File、Blob、ArrayBuffer、Uint8Array 四种形态，你手里有哪种就传哪种。保存通过 ref 调 save 方法，它返回一个 Promise，解析为 ArrayBuffer 或 null，没有文档可序列化时是 null，所以一定要判空。

三个细节。documentBuffer 传 null 是立即挂空文档，传 undefined 是推迟挂载，避免 fetch 在途时空状态闪一下。从远程 URL 加载时，.docx 是二进制 ZIP，必须取 arrayBuffer，绝对不能用 text，text 会按文本解码把二进制弄坏。除了主动 save，还有 onSave prop，用户通过内置工具栏按 Ctrl 或 Cmd S 保存时会回调它，带着 ArrayBuffer。
-->

---

# 触发下载

```ts
async function downloadDocx(ref: DocxEditorRef, name: string) {
  const buf = await ref.save();
  if (!buf) return; // 判空
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name.endsWith('.docx') ? name : `${name}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
```

<!--
拿到 save 返回的 ArrayBuffer 后，在浏览器里触发下载是标准的几步。

先判空。然后把 ArrayBuffer 包成 Blob，注意 MIME 类型要写对，是那一长串 openxmlformats 的 wordprocessingml.document。接着用 URL.createObjectURL 生成一个对象 URL，建一个 a 标签，设上 href 和 download 文件名，程序化 click 触发下载，最后 revokeObjectURL 释放掉。

这就是官方的下载 helper。整条链路全在客户端，不需要把文件上传到服务器再下回来。
-->

---

# 三种 mode

```tsx
<DocxEditor documentBuffer={buf} mode={mode} onModeChange={setMode} />
```

| mode | 行为 |
|---|---|
| `editing` | 正常编辑，改动直接写入（默认） |
| `suggesting` | **修订模式**：每次编辑记成一条修订 |
| `viewing` | 带工具栏的只读查看 |

<div v-click class="mt-3 text-sm">

> `readOnly` 与 `mode` 独立：纯查看器用 `readOnly` + `showToolbar={false}`；要「能读但可加建议」用 `mode="suggesting"`。

</div>

<!--
mode prop 有三个合法取值，注意不是 Google Docs 那套命名。

editing 是正常编辑，改动直接写进文档，是默认值。suggesting 是修订模式，每次编辑都记成一条修订而不是直接改。viewing 是带工具栏的只读查看。传 onModeChange 表示你自己持有 mode 状态，不传则编辑器内部管理，用户能在工具栏的模式选择器里切。

容易混的一点：readOnly 和 mode 是两个独立维度。readOnly 禁用一切输入但保留完整分页渲染，要做纯查看器就 readOnly 加上 showToolbar false。而如果你想让用户能读、但仍然可以加建议，那就用 mode suggesting，而不是 readOnly。
-->

---

# 修订追踪：写成真 OOXML

```tsx
<DocxEditor documentBuffer={buf} author="Jess Lin" mode="suggesting" />
```

<v-clicks>

- 序列化为 Word 原生 `<w:ins>` / `<w:del>`，与 Word 审阅窗格**互通**
- 覆盖文本、段落结构、表格行/单元格、图片、列表编号
- `author` 标注作者，每条修订带时间戳，存读后保留
- 接受/拒绝是 `-core/prosemirror/commands` 的 ProseMirror 命令

</v-clicks>

<div v-click class="mt-2 text-sm">

```ts
acceptAllChanges()(view.state, view.dispatch); // 用 onEditorViewReady 拿 view
```

</div>

<!--
修订追踪是企业场景的核心能力。开启就是 mode 设成 suggesting，再用 author 标注作者。

关键事实：在 suggesting 模式保存，修订会序列化成 Word 原生的 w:ins 插入和 w:del 删除元素，所以编辑器里审阅的文档和 Word 里审阅的文档可以互换，Word 的审阅窗格能列出它们、能接受拒绝。

被追踪的不止行内文本，还包括段落结构、段落属性、表格的行和单元格增删合并、图片的插入删除、列表编号的变化，全都作为真实 OOXML 修订往返，不是编辑器私有状态。author 命名作者，每条修订还带创建时间戳，这两个字段经保存重载都保留。

接受拒绝怎么做？侧栏按钮背后是从 docx-editor-core 的 prosemirror commands 导出的 ProseMirror 命令，比如 acceptAllChanges、acceptChangeById。每个返回一个 Command，需要对编辑器的 view 运行，view 用 onEditorViewReady prop 捕获。
-->

---

# 无损往返：语义保留 ≠ 字节相同

<v-clicks>

- 只重写**改过的部件**（正文 + 被改的页眉/页脚/批注）
- 其余部件**逐字节带过**：styles、主题、字体、媒体、自定义 XML、VBA
- 关系 ID / 书签 / 域 / 样式 ID / 编号**不重命名、不重排**
- 输出是 **canonical OOXML**，不只是 valid

</v-clicks>

<div v-click class="mt-4">

> ⚠️ **不保证字节级相同**：ZIP 重建、XML 重序列化，空白与部件顺序可能变。目标是**你没编辑的内容不丢失、不被重新解释**。

</div>

<!--
官方反复强调 canonical OOXML 和无损往返，这里说清它到底是什么。

.docx 是一堆 XML 部件的 ZIP，Word 写了很多编辑器无须建模的东西，书签、自定义 XML、邮件合并域、兼容性设置、VBA 工程。docx-editor 的管线是解析、文档模型、编辑、序列化。保存时只重写它改过的部件，也就是正文，加上被改动过的页眉页脚批注注释；其余所有部件，styles.xml、主题、字体表、媒体、关系、自定义 XML、VBA，逐字节从原始 ZIP 带过。而且关系 ID、书签名、域代码、样式 ID、编号定义都不被重命名或重排。输出是 canonical OOXML，不只是合法，修订是 Word 认得的真 w:ins、w:del。

但要划清一个边界：它不保证字节级相同。ZIP 容器会被重建、XML 会被重新序列化，所以空白和部件顺序可能不同。目标是语义保留，你没编辑的内容不会丢失、不会被重新解释。如果某文档破坏了这个行为，按官方说法那就是 bug，应该附上文件去提 issue。
-->

---

# 实时协同：基于 Yjs

```tsx
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from 'y-prosemirror';

const plugins = [ySyncPlugin(fragment), yCursorPlugin(awareness), yUndoPlugin()];

<DocxEditor document={createEmptyDocument()}
            externalPlugins={plugins} externalContent />
```

<v-clicks>

- Yjs（CRDT）：光标、在场、批注同步、修订归属
- provider 自选：y-webrtc / Hocuspocus / Liveblocks / PartyKit
- **修订自动同步**；**批注线程**需受控 `comments` 手动桥接

</v-clicks>

<!--
实时协同基于 Yjs，也就是 CRDT。把 DocxEditor 绑定到一个 Y.Doc，就能得到多用户实时编辑：光标、在场状态、批注同步、修订归属。

做法是把 document 当作 schema 种子，设上 externalContent 禁用内置加载、改由 Yjs 填充，再通过 externalPlugins 传入 y-prosemirror 的三个插件：ySyncPlugin 同步文档、yCursorPlugin 显示远端光标、yUndoPlugin 共享撤销。传输 provider 由你自己选，开发可以用点对点的 y-webrtc，生产换 Hocuspocus、Liveblocks、PartyKit 这些托管方案。

一个重要区别：修订是自动同步的，因为它的元数据存在 ProseMirror 文档的 mark 属性里，随 ySyncPlugin 一起同步。但批注线程的元数据存在文档之外，只有批注的范围标记自动同步，要让线程跨协作者同步，得用受控的 comments 加 onCommentsChange 手动桥接到协同后端，比如 Y.Array。
-->

---

# 协同的坑：必须设 externalContent

<v-clicks>

- 不设它 → 挂载期 `useEffect` 调 `loadDocument()` **重置** ProseMirror
- 此时 `ySyncPlugin` 已填的 Y.Doc 内容被**清空**
- ySync 又把空状态同步回 Y.Doc → **污染所有客户端**
- 设了 `externalContent`：`document` 仅作 schema 种子，挂载不加载

</v-clicks>

<div v-click class="mt-6 text-center text-2xl">

⚠️ 接 Yjs 时 `externalContent` 不是可选项

</div>

<!--
协同有一个必须知道的坑，否则会损坏共享文档。

不设 externalContent 时，DocxEditor 挂载期的 useEffect 会调用 loadDocument，它会重置 ProseMirror 状态。如果这时候 ySyncPlugin 已经用 Y.Doc 的内容填充了 ProseMirror，这个重置就把内容清空了。更糟的是，随后 ySync 又把这份空状态同步回 Y.Doc，于是每一个已连接客户端的共享文档都被污染了。

设了 externalContent 之后，document 就只作为 schema 种子，挂载时不会被加载，这个问题就消失了。所以记住：接 Yjs 协同时，externalContent 不是可选项，是必须设的。
-->

---

# headless：服务端处理，无 DOM

```ts
import { parseDocx, repackDocx } from '@eigenpal/docx-editor-core/headless';

const doc = await parseDocx(buffer);
// ...读取 / 变更文档模型...
const out = await repackDocx(doc); // ArrayBuffer，未改部件逐字节带过
```

<v-clicks>

- 在 Node / Worker 跑，不碰 DOM：填模板、抽文本、盖水印、批量生成
- `repackDocx` 回写原包 · `createDocx` 从零构建 · `serializeDocx` 只出 XML
- `DocumentAgent` 链式不可变操作 · `processTemplate` 填 `{{变量}}`
- 内容控件按 `tag` / `alias` / `id` 寻址（与 mustache 并存）

</v-clicks>

<!--
不挂编辑器、在服务端处理文档，用 docx-editor-core 的 headless 子路径。它是去掉 UI 的文档引擎，OOXML 解析器、文档模型、变更助手、序列化器，在 Node 和 Web Worker 里跑，完全不碰 DOM。典型用途是批量管线：填模板、抽文本、盖水印、生成文档、后处理上传。

写回字节有两条路径要分清：repackDocx 针对文档的原始 buffer 选择性回写，未改部件逐字节带过，文档来自 parseDocx 时用它；createDocx 是从零构建全新包，用于代码里凭空创建的文档；serializeDocx 只返回 document.xml 字符串，不是 .docx 文件，少用。

还有两个常用能力：DocumentAgent 把文档包成链式、不可变的 API，每次调用返回新 agent；模板填充用 processTemplate 和 detectVariables，处理双花括号的变量，背后是 docxtemplater。另外 Word 的内容控件，也就是 SDT，按稳定的 tag、alias、id 寻址，注意它和双花括号模板变量是两套并存的系统。
-->

---

# agents：把编辑暴露成 AI 工具

| 形态 | 在哪跑 | 文档在哪 | 用途 |
|---|---|---|---|
| **live editor** | API 路由，浏览器执行 | 用户浏览器 | 编辑器内 AI 写作 |
| **DocxReviewer** | 你的服务端 | 你加载的 buffer | 合同审阅 / CI bot |
| **MCP server** | MCP 客户端处 | 每请求加载 | 已支持 MCP 的平台 |

<v-clicks>

- 14 个工具：定位 7 + 变更 6（加批注/提修订/改格式）+ 导航 1
- 模型运行时**你自带**；提供 Vercel AI SDK / OpenAI 风格 / MCP 适配器

</v-clicks>

<!--
docx-editor 还是 agent-ready 的，这是 docx-editor-agents 包的事。它把 DOCX 编辑操作暴露成模型工具，一共 14 个：读段落、加批注、提修订、改格式等等，可以三种形态运行。

第一种 live editor，工具调用对着用户浏览器里活的 DocxEditor 执行，你的 API 路由只看到聊天消息和工具调用，文档留在客户端，适合编辑器内的 AI 写作助手。第二种 DocxReviewer，在你的服务端进程跑，无 DOM，加载 buffer、审阅、写回，适合合同审阅 API、队列 worker、CI bot。第三种 MCP server，把工具目录通过 JSON-RPC 暴露给任意 MCP 兼容客户端。

14 个工具分三组：定位 7 个、变更 6 个、导航 1 个，模式是先定位再变更，定位返回带稳定 paraId 的段落，变更按 paraId 寻址。模型运行时由你自带，包只提供 JSON-Schema 工具定义和可选适配器，对接 Vercel AI SDK、OpenAI 风格工具、还有 MCP。选型上：做产品 UI 从 live editor 起步，有文档没 UI 用 DocxReviewer，客户端已支持 MCP 才选 MCP。
-->

---

# 几个工程要点

<v-clicks>

- **SSR 必须客户端渲染**：Next.js 用 `dynamic(..., { ssr:false })`，Astro 用 `client:only`，Nuxt 用官方模块（自动 SSR 安全）
- **选择性保存**：`save()` 默认只补改过的部件；`save({ selective:false })` 全量重打包
- **自动保存**：`onChange` 防抖 + `ref.save()`；`useAutoSave` 做本地崩溃恢复
- **打包**：`-core` 子路径可摇树；懒加载编辑器移出首屏
- **安全**：不上传文档、不调转换 API、不执行 VBA 宏

</v-clicks>

<!--
几个工程上的要点，快速过一遍。

第一，编辑器挂载时要在 DOM 里测量文本，所以必须客户端渲染。SSR 框架要做 client-only 边界：Next.js 用 dynamic 加 ssr false，Astro 用 client only，Remix 用挂载检查加 React.lazy，Nuxt 最省事，用官方模块就自动 SSR 安全。

第二，save 默认是选择性保存，只修补你改过的 XML 部件，其余原样带过；要强制全量重打包，传 selective false。

第三，自动保存用 onChange 触发、防抖、再经 ref.save 序列化；本地崩溃恢复有 React 适配器的 useAutoSave，按间隔存到 localStorage。

第四，打包上 -core 提供可独立摇树的子路径，懒加载编辑器能把它移出首屏 bundle。第五，安全上普通编辑器用法仅浏览器，不上传文档、不调转换 API、也不执行 VBA 宏。
-->

---
layout: intro
---

# 总结

docx-editor = **浏览器内唯一可编辑 .docx 的开源库**

- 定位：WYSIWYG 编辑 `.docx`，React / Vue，Apache-2.0
- 架构：隐藏 ProseMirror + 布局画家，Word 度量分页
- 用法：`documentBuffer` 进，`ref.save()` 出，全客户端
- 修订：`mode="suggesting"` → 原生 `w:ins` / `w:del`，与 Word 互通
- 往返：canonical OOXML，**语义无损**（非字节相同）
- 协同：Yjs（CRDT），记得设 `externalContent`
- 进阶：`-core/headless` 服务端处理 + `-agents` AI / MCP

<!--
总结一下。

docx-editor 是浏览器内唯一可编辑 .docx 的开源库，这是它区别于 docx、mammoth、docx-preview、docxtemplater 的本质。

定位是 WYSIWYG 编辑 .docx，支持 React 和 Vue，Apache-2.0 开源。架构是隐藏的 ProseMirror 加布局画家，用 Word 自己的度量计算分页，做到排版保真。基本用法记住一句话：documentBuffer 进，ref.save 出，全程客户端。修订追踪用 mode suggesting，写成 Word 原生的 w:ins 和 w:del，和 Word 审阅窗格互通。往返是 canonical OOXML，做到语义无损，但不是字节级相同。协同基于 Yjs，记得一定要设 externalContent，否则会污染共享文档。再往上走，有 -core 的 headless 做无 DOM 的服务端处理，有 -agents 把编辑暴露成 AI 工具，支持 DocxReviewer 和 MCP。

它是较新的项目、迭代很快，用之前建议对照官网和你所装版本的文档。谢谢大家。
-->
