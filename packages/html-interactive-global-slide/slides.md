---
theme: seriph
background: https://cover.sli.dev
title: HTML 交互元素与全局属性
info: |
  原生交互元素与全局属性 —— details/summary、dialog、popover、焦点管理、ARIA
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:html-5 class="text-8xl" />
</div>

<br/>

## HTML 交互元素与全局属性

零 JavaScript 就能做的折叠、对话框、弹层与焦点（基于 HTML Living Standard）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
浏览器早把折叠、对话框、弹层、焦点管理做进了原生元素，过去要写一堆 JS 的交互，如今几行 HTML 就够。
-->

---
transition: fade-out
---

# 这一章讲什么

四类原生交互 + 全局属性 + 可访问性，几乎不写 JS

<v-click>

- **折叠**：`<details>` / `<summary>`，同 `name` 组手风琴
- **对话框**：`<dialog>` 的 `showModal()` 模态 + `inert` 背景失活
- **弹层**：`popover` 属性 + `command` / `commandfor` 声明式调用
- **焦点 + 全局属性 + ARIA**：键盘可达与可访问性地基

</v-click>

<v-click>

> 核心理念：能用原生就别用 `div`，原生元素自带语义、键盘可达、可访问，**写得更少、做得更对**。

</v-click>

---

# 一段代码串起四类交互

```html
<details>
  <summary>什么是 Baseline？</summary>
  <p>一项 Web 特性在主流浏览器稳定可用的状态。</p>
</details>

<button popovertarget="tips">查看提示</button>
<div id="tips" popover><p>轻量提示弹层。</p></div>

<button id="openBtn">打开对话框</button>
<dialog id="dlg">…用 showModal() 打开为模态…</dialog>
```

<v-click>

折叠与弹层**完全不用 JS**；只有对话框的「模态」必须经 JS 触发——这是现代写法的基本分工。

</v-click>

---
layout: section
---

# 折叠：`details` / `summary`

零 JS 的展开 / 收起，自 2020 年广泛可用

---

# `details` 最小结构

```html
<details>
  <summary>系统要求</summary>
  <p>需要现代浏览器，支持 ES2020。</p>
</details>
```

<v-click>

- `<summary>` 必须是**第一个子元素**：永远可见的标题 + 点击区
- 其后所有内容默认隐藏，点 `summary`（或聚焦后 `Space` / `Enter`）切换
- **一行 JavaScript 都不用写**

</v-click>

---

# `open`：默认展开（布尔属性）

```html
<details open>
  <summary>默认就展开</summary>
  <p>页面加载时这块已可见。</p>
</details>
```

<v-click>

`open` 是**布尔属性**——「有 / 无」决定状态，「值」被忽略：

- `open="false"` 依然是**展开**（属性存在）
- 要收起，必须把 `open` 属性**整个删掉**
- JS 切换：`d.open = true / false`（等价于增删属性）

</v-click>

---

# `name`：纯 HTML 手风琴（2024）

```html
<details name="faq"><summary>支持哪些浏览器？</summary>…</details>
<details name="faq"><summary>如何降级？</summary>…</details>
<details name="faq"><summary>要写脚本吗？</summary>…</details>
```

<v-click>

给一组 `<details>` 设**相同 `name`** → 互斥分组，**同一时刻最多开一个**：

- 同组成员**不必在 DOM 里相邻**，只看 `name` 是否相同
- 多个同名都带 `open` 时，只有源码中**第一个**渲染为展开

</v-click>

---

# `name` 手风琴：Baseline 与降级

::: tip Baseline 现状
`name` 手风琴自 **2024 年**起落地（Chrome / Edge 120、Safari 17.2、Firefox 130），属 **Baseline 新近可用**。
:::

<v-click>

降级**几乎无害**：不支持 `name` 的旧浏览器把它们当成各自独立的折叠（可同时展开多个），核心信息不丢——可放心用于生产。

</v-click>

---

# `toggle` 事件与三角定制

```js
details.addEventListener("toggle", () => {
  if (details.open) loadOnDemand(); // 展开时才懒加载
});
```

<v-click>

- `toggle` 在开 / 收状态**变化之后**触发，可读 `event.newState`（`"open"` / `"closed"`）
- 左侧三角其实是**列表标记**：`summary { list-style: none }` 去掉
- 旧 WebKit 兜底：`summary::-webkit-details-marker { display: none }`
- 展开内容做动画用较新的 `details::details-content` 伪元素（渐进增强）

</v-click>

---

# 折叠的可访问性

`<details>` / `<summary>` 天然可访问，**别再手动加 ARIA**：

<v-click>

- `<details>` 隐式 `role="group"`，`<summary>` 充当其可访问标签
- 键盘：`Tab` 聚焦 `<summary>`，`Space` / `Enter` 切换
- 读屏器会朗读「展开」还是「折叠」

</v-click>

<v-click>

⚠️ 别再加 `role` 或 `aria-expanded`——原生语义已齐全，加了反而冲突。这正是「能用原生就别用 ARIA」的典型。

</v-click>

---
layout: section
---

# 对话框：`dialog` 与 `inert`

`showModal()` 一行拿到完整模态（Baseline 2022）

---

# 三个方法：showModal / show / close

```html
<button id="openBtn">打开</button>
<dialog id="dlg">
  <p>确定要发布吗？</p>
  <button id="closeBtn" autofocus>关闭</button>
</dialog>
<script>
  openBtn.onclick = () => dlg.showModal(); // 模态
  closeBtn.onclick = () => dlg.close();
</script>
```

`showModal()` 打开**模态**，`show()` 打开**非模态**，`close(值)` 关闭并设 `returnValue`。

---

# 模态 vs 非模态

| 方法 | 模态 | 背景 | `Esc` 关 | `::backdrop` |
| --- | --- | --- | --- | --- |
| `showModal()` | 是 | 自动 `inert` | 默认可 | 有 |
| `show()` | 否 | 可正常交互 | 默认不可 | 无 |

<v-click>

::: warning 别用 `open` 属性手搓模态
`<dialog open>` 只能渲染**非模态**——没遮罩、不失活背景、不接管焦点、`Esc` 不关。真模态**只能**由 `showModal()` 提供。
:::

</v-click>

---

# `::backdrop`：背景遮罩

```css
dialog::backdrop {
  background: rgb(0 0 0 / 0.5);
  backdrop-filter: blur(3px); /* 模糊背后页面 */
}
```

<v-click>

- 只有 `showModal()` 才会在对话框**之下**铺一层 `::backdrop`
- 默认半透明黑，可染色 / 模糊
- 非模态（`show()`）**没有** `::backdrop`——这是模态最直观的视觉差别

</v-click>

---

# `method="dialog"`：表单即关闭

```html
<dialog id="dlg">
  <form method="dialog">
    <p>是否保存更改？</p>
    <button value="cancel">不保存</button>
    <button value="save" autofocus>保存</button>
  </form>
</dialog>
```

<v-click>

提交表单**不发请求**，而是关闭对话框，并把所点按钮的 `value` 写入 `dialog.returnValue`；在 `close` 事件里读取即可。

</v-click>

---

# 对话框的焦点管理

```js
let lastTrigger = null;
openBtn.onclick = () => { lastTrigger = openBtn; dlg.showModal(); };
dlg.addEventListener("close", () => lastTrigger?.focus());
```

<v-click>

- 打开时焦点落到第一个可聚焦元素，用 `autofocus` 显式指定落点
- 打开期间焦点被「困」在对话框内，`Tab` 不跑到背后已 `inert` 的页面
- **关闭后须主动把焦点还给触发按钮**（浏览器不全包）

</v-click>

<v-click>

⚠️ 别给 `<dialog>` 本身加 `tabindex`——它不是交互元素。

</v-click>

---

# `Esc` 与 `cancel` 事件

```js
dlg.addEventListener("cancel", (e) => {
  if (hasUnsaved) {
    e.preventDefault(); // 阻止 Esc 关闭
    alert("请先保存或放弃更改");
  }
});
```

<v-click>

- 按 `Esc` 先派发 `cancel`，可 `preventDefault()` 拦下
- `close` 在真正关闭后触发（无论 `close()`、表单提交还是 `Esc`）
- `dialog.requestClose()`：先发可取消的 `cancel`，语义同「点关闭按钮」

</v-click>

---

# `closedby`：控制关闭方式（较新）

| 取值 | 含义 |
| --- | --- |
| `any` | 点外面、`Esc`、代码都可关 |
| `closerequest` | `Esc` 或代码可关，点外面**不**关 |
| `none` | 只有代码能关 |

<v-click>

::: tip Baseline 现状
`closedby` 较新（Chrome 134+ 起），当**渐进增强**：不支持的浏览器忽略它、退回默认行为（`showModal()` 默认相当于 `closerequest`）。
:::

</v-click>

---

# `inert`：让一片区域失活

```html
<form inert>…加载中，整块失活…</form>
```

加 `inert` 后，该元素**及其后代**整体失活：不可点、不可聚焦、移出可访问性树、页内查找跳过。

<v-click>

::: tip 与 dialog 的关系
`showModal()` 会**自动**把对话框之外的整页设为 `inert`——这正是模态「背景点不动」的底层机制，用原生 `dialog` **无需手动**加。⚠️ `inert` 无默认样式（不变灰），失活仍可见的内容须自己加 CSS 明示；失活单个控件优先用 `disabled`。（Baseline 2023）
:::

</v-click>

---

# 对话框的可访问性

<v-click>

- `<dialog>` 隐式 `role="dialog"`；`showModal()` 时自动 `aria-modal="true"`
- 用 `aria-labelledby` 指向标题：`<dialog aria-labelledby="dlgTitle">`
- **务必提供显式「关闭」按钮**——确保键盘 / 读屏器用户能退出
- 警告类对话框可把 `role` 改为 `alertdialog`

</v-click>

<v-click>

> Baseline：`<dialog>` 自 **2022** 年广泛可用，`aria-modal` 由浏览器自动维护。

</v-click>

---
layout: section
---

# 弹层：`popover` 与 `command`

一个属性换来顶层渲染 + light dismiss（Baseline 2025-01）

---

# `popover`：零 JS 弹层

```html
<button popovertarget="menu">操作菜单</button>

<div id="menu" popover>
  <button>重命名</button>
  <button>删除</button>
</div>
```

<v-click>

两段标签免费得到：点按钮**开合**、点外面**关闭**（light dismiss）、`Esc` 关闭、渲染到**顶层**——不必再和 `z-index` 较劲。

</v-click>

---

# 三种 popover 状态

| 取值 | light dismiss | 互斥 | 典型用途 |
| --- | --- | --- | --- |
| `auto`（默认） | 是 | 是（开新关旧） | 菜单、下拉 |
| `manual` | 否 | 否（可同开多个） | 常驻提示、Toast |
| `hint` | 是 | 不影响 `auto` | 悬浮提示 tooltip |

<v-click>

`hint` 较新，用于「不应关掉已打开菜单」的轻提示；不支持时退回 `auto` / `manual`。

</v-click>

---

# 触发动作与 JS 控制

```html
<div id="card" popover>
  <p>提示内容</p>
  <button popovertarget="card" popovertargetaction="hide">知道了</button>
</div>
```

<v-click>

- `popovertargetaction`：`show` / `hide` / `toggle`（默认）
- JS 方法：`showPopover()` / `hidePopover()` / `togglePopover()`
- CSS 钩子：`:popover-open`（显示时）、`::backdrop`（背后遮罩）

</v-click>

---

# popover 的事件、降级与红线

```js
menu.addEventListener("toggle", (e) => {
  if (e.newState === "open") console.log("菜单打开了"); // beforetoggle 在变化前
});
```

<v-click>

::: warning popover 不是 dialog
弹层**永远非模态**——不接管焦点、不失活背景。要真模态仍用 `<dialog>` 的 `showModal()`（`<dialog popover>` 也合法）。
:::

::: tip Baseline 2025-01 · 注意降级
自 2025 年 1 月新近可用（Chrome 114、Safari 17、Firefox 125）。老浏览器里带 `popover` 的元素因默认 `display: none` 会**完全不显示**——这是不可忽视的降级，须 JS 兜底或确认支持度。
:::

</v-click>

---

# `command` / `commandfor`：声明式调用

```html
<button command="show-modal" commandfor="dlg">打开对话框</button>

<dialog id="dlg">
  <p>确认删除？</p>
  <button command="close" commandfor="dlg" value="confirm">确定</button>
</dialog>
```

<v-click>

- `commandfor`：指向被控元素 `id`（`popovertarget` 的「通用版」）
- `command`：要执行的动作——把声明式调用从弹层扩展到**对话框**，同样零 JS

</v-click>

---

# 内置 command 值

| 目标 | `command` | 等价 JS |
| --- | --- | --- |
| `<dialog>` | `show-modal` | `dialog.showModal()` |
| `<dialog>` | `close` | `dialog.close()` |
| `<dialog>` | `request-close` | `dialog.requestClose()` |
| 弹层 | `show-popover` | `el.showPopover()` |
| 弹层 | `toggle-popover` | `el.togglePopover()` |

<v-click>

以**两个连字符 `--`** 开头是自定义命令，会在目标上派发 `CommandEvent`（带 `command` / `source`）。

</v-click>

---

# command 的 Baseline：很新，务必降级

::: danger 最多算刚进入新近可用区间
`command` / `commandfor` 是本章**最新**特性：Chrome / Edge 135、Safari 26.2、Firefox 144，全集中在 **2025 年**落地，**尚非 Baseline 广泛可用**。
:::

<v-click>

- 不支持的浏览器把它当**普通按钮**——点了**毫无效果**（不像 popover 还能看到 fallback）
- 现阶段：仍用 JS 绑点击作主逻辑，或特性检测 `'command' in HTMLButtonElement.prototype`
- 简单弹层控制优先用支持度更高的 `popovertarget`

</v-click>

---

# 弹层三者怎么选

| 需求 | 推荐 |
| --- | --- |
| 轻量弹层（菜单 / 提示），点外面就关 | `popover` + `popovertarget` |
| 遮挡背景、收拢焦点的真模态 | `<dialog>` + `showModal()` |
| 声明式控对话框 / 自定义动作（能降级） | `command` / `commandfor` + JS 兜底 |

<v-click>

一句话：轻量交给 `popover`，模态交给 `dialog`，声明式调用按支持度谨慎引入。

</v-click>

---
layout: section
---

# 焦点管理

键盘可访问性的命脉

---

# 谁默认可聚焦

键盘用户靠 `Tab` / `Shift+Tab` 在「可聚焦元素」间移动。**默认可聚焦**的是交互元素：

<v-click>

- 链接 `<a href>`（**没有** `href` 的 `<a>` 不可聚焦）
- 表单控件 `<button>` / `<input>` / `<select>` / `<textarea>`
- `contenteditable` 元素

</v-click>

<v-click>

其余元素（`<div>` / `<span>` / `<p>`…）默认**不可聚焦**，想参与键盘交互得靠 `tabindex`。

</v-click>

---

# `tabindex`：三类取值

| 取值 | 可 `Tab` 到 | 可 `.focus()` / 点击 | 用途 |
| --- | --- | --- | --- |
| `0` | 是（按 DOM 序） | 是 | 自定义组件可聚焦 |
| `-1` | 否 | 是 | 仅脚本聚焦的目标 |
| 正数（`1`+） | 是（按数字序） | 是 | ⚠️ 反模式，避免 |

<v-click>

```html
<div role="button" tabindex="0">自定义按钮，可被 Tab</div>
<section id="results" tabindex="-1">提交后 JS 聚焦到这里</section>
```

</v-click>

---

# 为什么正数 tabindex 是反模式

`tabindex="1"`、`"2"`… 创建一条**凌驾于 DOM 顺序之上**的优先序：浏览器先按数字跳完所有正数元素，再回到 `0` 与默认可聚焦元素。

<v-click>

- **极难维护**：新增一个元素就可能要重排一长串数字
- **顺序错乱**：焦点轨迹与视觉、与 DOM 全脱节

</v-click>

<v-click>

正确做法永远是：**用 DOM 顺序表达 Tab 顺序**，只在 `0` / `-1` 间选择。

</v-click>

---

# `autofocus`：自动聚焦，慎用

```html
<input name="q" autofocus />
```

它方便（搜索 / 登录页光标直接落在输入框），但**容易帮倒忙**：

<v-click>

- 会把页面**滚动**到该元素，用户可能**错过**上方标题与说明
- 会**跳过**焦点序中更靠前的元素

</v-click>

<v-click>

法则：仅在「这显然是用户来此唯一要做的事」时用；在 `<dialog>` 内则相对安全（对话框本就要求立即处理）。

</v-click>

---

# 焦点顺序：DOM 即顺序

::: warning 别用 CSS 打乱焦点顺序
焦点导航顺序**默认等于 DOM 源码顺序**，也应**等于视觉顺序**。但 flexbox `order`、grid、绝对定位能让元素**看起来**换位却**不改 DOM**——键盘按 DOM 跳、眼睛看到另一个顺序，二者错位，键盘用户迷失。
:::

<v-click>

务必保证：**视觉顺序 = DOM 顺序**，并在所有视口尺寸下用 `Tab` 实测一遍。

</v-click>

---

# `:focus` vs `:focus-visible`

```css
/* ✅ 优先 :focus-visible：仅在「该提示焦点」时显示环（主要是键盘） */
button:focus-visible {
  outline: 2px solid royalblue;
  outline-offset: 2px;
}
```

<v-click>

- `:focus`：任何方式获焦都命中（鼠标点击也留下焦点环，常被嫌碍眼）
- `:focus-visible`：浏览器判断「此刻该让用户看到焦点」才命中——键盘聚焦显示、鼠标点击不显示

</v-click>

<v-click>

正好满足「键盘要焦点环、鼠标不想要」。自 **2022 年 3 月** Baseline 广泛可用。

</v-click>

---

# `:focus-within` 与编程式焦点

```css
.form-row:focus-within {
  background: var(--row-active); /* 高亮当前正在填的整组 */
}
```

<v-click>

- `:focus-within`：自身或**任意后代**获焦时命中
- `element.focus()`：移动焦点（会滚动进视口）；聚焦非交互容器须先给 `tabindex="-1"`
- `document.activeElement`：只读，返回当前获焦元素

</v-click>

---

# 跳转链接（skip link）

```html
<a href="#main" class="skip-link">跳到主内容</a>
<main id="main">…</main>
```

```css
.skip-link { position: absolute; left: -9999px; }
.skip-link:focus { left: 1rem; top: 1rem; } /* 获焦时显现 */
```

<v-click>

页首一个链接，平时藏、获焦时显，让键盘用户一键越过冗长导航。⚠️ skip link **不要**设 `inert`，否则永远聚焦不到。

</v-click>

---
layout: section
---

# 全局属性精要

对**所有**元素生效的工具箱

---

# 什么是「全局属性」

全局属性是**可加在任何 HTML 元素上**的一组属性——不像 `href` 只属于 `<a>`、`src` 只属于 `<img>`。

<v-click>

按用途分组：

- **标识 / 样式 / 数据**：`id`、`class`、`data-*`
- **状态**：`hidden`、`contenteditable`、`draggable`
- **移动键盘**：`inputmode`、`enterkeyhint`
- **交互 / 焦点**：`tabindex`、`autofocus`、`inert`、`popover`
- **可访问性**：`role`、`aria-*`

</v-click>

---

# 标识与数据：id / class / data-\*

```html
<li data-user-id="42" data-role="admin">Alice</li>
<script>
  li.dataset.userId; // "42"（连字符自动转驼峰）
  li.dataset.role = "editor"; // 写回 data-role="editor"
</script>
```

<v-click>

- `id`：元素唯一标识，**全文档不可重复**（用于 `#片段`、`for`、`getElementById`）
- `class`：空格分隔的类名列表，CSS / JS 最常用的钩子
- `data-*`：挂自定义数据，JS 用 `dataset` 读写；别滥用它替代真正的数据层

</v-click>

---

# 隐藏：`hidden`

```html
<div hidden>暂时不显示</div>
<section hidden="until-found">折叠的长文（Ctrl+F 能搜到并展开）</section>
```

<v-click>

- `hidden`（布尔）等价于 `display: none`——不渲染、不占位、不可交互
- `hidden="until-found"`：视觉隐藏，但**页内查找**能搜到其中文字并**自动展开**（触发 `beforematch`），适合「默认折叠但希望可被搜索命中」

</v-click>

---

# 文本与语言

```html
<abbr title="超文本标记语言">HTML</abbr>
<p lang="fr">Bonjour</p>
<code translate="no">const x = 1;</code>
```

<v-click>

- `title`：悬停提示气泡；别把关键信息只放这里（移动端无悬停）
- `lang`：BCP 47 语言标签，影响发音、断词、字体匹配、翻译
- `dir`：`ltr` / `rtl` / `auto`（按内容首个强方向字符推断）
- `translate`：`no` 让翻译工具跳过（代码、品牌名）；`spellcheck`：拼写检查开关

</v-click>

---

# 可编辑与拖放

```html
<div contenteditable="true">可富文本编辑</div>
<div contenteditable="plaintext-only">只能输入纯文本</div>
<img src="card.png" draggable="true" alt="可拖拽卡片" />
```

<v-click>

- `contenteditable`：`true` / `false` / `plaintext-only`（仅纯文本，已广泛可用）；空字符串等价于 `true`
- `draggable`：`true` / `false`，配合 HTML 拖放 API

</v-click>

---

# 移动端虚拟键盘

```html
<input inputmode="tel" enterkeyhint="send" />
<input inputmode="numeric" />
```

<v-click>

它们**不改变校验**，只优化弹出的虚拟键盘：

- `inputmode`：`numeric` / `tel` / `email` / `url` / `decimal` / `search`…决定弹哪种键盘
- `enterkeyhint`：`done` / `go` / `next` / `search` / `send`…决定回车键文案，给用户「按下会发生什么」的预期

</v-click>

---

# 交互焦点与其它全局属性

| 属性 | 作用 |
| --- | --- |
| `tabindex` / `autofocus` / `inert` | 焦点与失活（见前文） |
| `popover` | 把元素变弹层 |
| `accesskey` | 键盘快捷键（坑多，慎用） |
| `autocapitalize` | 移动端自动大写策略 |
| `nonce` | CSP 放行内联脚本 / 样式 |
| `is` / `slot` / `part` | Web Components / Shadow DOM |

<v-click>

`writingsuggestions`（写作建议开关）较新，不支持则忽略。

</v-click>

---
layout: section
---

# HTML 层可访问性

核心就一句：能用原生就别用 ARIA

---

# 可访问性树与 ARIA

浏览器渲染 DOM 时会构建一棵**可访问性树**：把每个元素映射为「角色 + 名字 + 状态」，供读屏器读取。

<v-click>

**ARIA**（`role` + `aria-*`）的作用是**修正或补充**这棵树——原生表达不了某语义时用它补上。

</v-click>

<v-click>

> 关键认知：ARIA **只改变「辅助技术怎么理解」**，不改变任何视觉、不添加任何行为（`<div role="button">` 不会自动能按回车、能聚焦）。

</v-click>

---

# ARIA 第一条规则

> 能用「语义和行为都已内置」的原生 HTML 元素，就用它；不要改造一个普通元素再加 ARIA 让它「变得可访问」。

```html
<!-- ❌ div 硬搓按钮：要手补 role、tabindex、键盘事件，极易漏 -->
<div role="button" tabindex="0" onclick="save()">保存</div>

<!-- ✅ 原生 button：可聚焦、Enter/Space 触发、role=button 全自带 -->
<button onclick="save()">保存</button>
```

<v-click>

本章的 `<details>` / `<dialog>` / `popover` 同理——优先用原生，正是「写得更少、做得更对」。

</v-click>

---

# 隐式角色：大多数元素自带语义

| HTML 元素 | 隐式角色 |
| --- | --- |
| `<button>` | `button` |
| `<a href>` | `link` |
| `<nav>` | `navigation` |
| `<main>` | `main` |
| `<input type="checkbox">` | `checkbox` |

<v-click>

加同名 `role`（`<nav role="navigation">`）是**多余**；加**不同** `role`（`<button role="link">`）通常是**错误**——语义自相矛盾。

</v-click>

---

# 可访问名（accessible name）

**每个交互元素都必须有可访问名**，否则读屏器只读出「按钮」毫无信息：

```html
<button aria-label="关闭"><svg>…</svg></button>

<label for="email">邮箱</label>
<input id="email" />
```

<v-click>

来源优先级大致：`aria-labelledby` > `aria-label` > 原生 `<label>` / 内容文本。**能用可见文本就别用 `aria-label`**——可见文本对所有人有帮助，且能被翻译。

</v-click>

---

# 常用 `aria-*` 属性

| 属性 | 作用 | 场景 |
| --- | --- | --- |
| `aria-label` / `aria-labelledby` | 给可访问名 | 图标按钮、对话框标题 |
| `aria-describedby` | 补充说明 | 输入框格式提示 |
| `aria-hidden="true"` | 移出可访问性树 | 纯装饰图标 |
| `aria-expanded` | 折叠开 / 合 | 自定义下拉 |
| `aria-current` | 当前项 | 导航当前页 |
| `aria-live` | 动态播报 | 异步结果、Toast |

<v-click>

⚠️ `aria-hidden="true"` 别加在**可聚焦**元素上——会造成「能聚焦却读不到」的割裂。

</v-click>

---

# ARIA 五律

<v-click>

1. **优先原生**——能用原生元素就别拿 `div` + `role` 硬凑
2. **别改原生语义**——别写 `<h2 role="button">`，应在 `<h2>` 里放 `<button>`
3. **交互 ARIA 控件须键盘可用**——`role="button"` 的 `div` 要自补 `tabindex` + 键盘事件
4. **别在可聚焦元素上用 `aria-hidden` / `role="presentation"`**
5. **所有交互元素须有可访问名**

</v-click>

<v-click>

> 这五条就是日常写 ARIA 的全部底线。

</v-click>

---

# No ARIA is better than bad ARIA

ARIA 用错比不用更糟：`role` 写错、`aria-*` 状态忘了随交互更新，读屏器就告诉用户**错误**信息（明明展开了却报「折叠」）。

<v-click>

统计也显示，带 ARIA 的页面可访问性问题反而常更多——往往是误用所致。

</v-click>

<v-click>

::: tip 没把握就先别加 ARIA
先把**原生可访问性**做对：`<html lang>`、`<img alt>`、`<label for>`、正确**标题层级**、**键盘可达**——这些比 ARIA 更基础，做对就成功大半。
:::

</v-click>

---

# 本章 Baseline 一览

| 特性 | Baseline | 提示 |
| --- | --- | --- |
| `<dialog>` | 2022 广泛可用 | 放心用 |
| `inert` | 2023 广泛可用 | 放心用 |
| `name` 手风琴 | 2024 新近可用 | 降级无害 |
| `popover` API | 2025-01 新近可用 | 老浏览器**完全不显示** |
| `command` / `commandfor` | 2025 很新 | **务必降级** + JS 兜底 |

<v-click>

越往下越新：`dialog` / `inert` 已稳，`popover` 须留意降级，`command` 现阶段当锦上添花。

</v-click>

---

# 最佳实践小结

<v-click>

- **优先原生**：`details` / `dialog` / `popover` 自带语义、键盘可达、可访问
- **分工**：轻量点外面就关用 `popover`，遮挡 + 焦点陷阱用 `dialog` 的 `showModal()`
- **焦点**：`tabindex` 只在 `0` / `-1` 间选，DOM 顺序 = 视觉顺序，焦点环用 `:focus-visible`
- **降级**：`popover` / `command` 较新，按受众确认支持度或加 JS 兜底
- **可访问性**：能用原生就别用 ARIA，补足可访问名，键盘全程可达

</v-click>

---
layout: center
class: text-center
---

# 谢谢

把交互交给原生元素，写得更少、做得更对，还顺手把可访问性做对了

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
