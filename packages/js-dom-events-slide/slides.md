---
theme: seriph
background: https://cover.sli.dev
title: JavaScript DOM 与事件
info: |
  浏览器把 HTML 解析成一棵活的对象树 —— 查找、修改、监听三条主线
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:javascript class="text-8xl" />
</div>

<br/>

## JavaScript DOM 与事件

把 HTML 当成一棵能查、能改、能听的对象树（基于现代 JavaScript · ES2025）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
DOM 是浏览器提供的一套 Web API，把你写的 HTML 文本解析成内存里的一棵对象树。
JS 操作页面，本质就是在这棵树上做三件事：查、改、听。
-->

---
transition: fade-out
---

# 这一章讲什么

操作 DOM 的全部工作，几乎都能归到三件事

<v-click>

- **查**：找到节点 —— `querySelector` 系列、遍历、`closest`
- **改**：修改节点 —— 创建插入删除、`textContent` vs `innerHTML`
- **听**：监听事件 —— 三阶段传播、`addEventListener`、事件委托

</v-click>

<v-click>

> DOM 是浏览器塞给 JavaScript 的 **Web API**，不是语言本身——所以同一份 JS 在 Node.js 里没有 `document`。

</v-click>

---
layout: section
---

# 一、DOM 树与节点

浏览器把 HTML 解析成的一棵活的对象树

---

# DOM 到底是什么

你写的是 HTML 文本，浏览器把它**解析成一棵对象树**存在内存里

```html
<html>
  <head><title>关于我</title></head>
  <body><p>你好，<b>世界</b></p></body>
</html>
```

<v-click>

```
html
├─ head → title → "关于我"      ← 文本节点
└─ body → p
          ├─ "你好，"           ← 文本节点
          └─ b → "世界"         ← 文本节点
```

JS 看不到原始字符串，它操作的始终是这棵树。

</v-click>

---

# 四种常见节点类型

关键认知：**文字也是节点**，源码里标签间的换行和空格都会变成文本节点

| 节点类型 | `nodeType` | 说明 |
| --- | --- | --- |
| 元素（element） | `1` | HTML 标签，树的骨架 |
| 文本（text） | `3` | 文字——**含换行和空格** |
| 注释（comment） | `8` | `<!-- … -->`，不渲染但在树里 |
| 文档（document） | `9` | `document` 自身，整棵树的根 |

<v-click>

::: warning 空白文本节点是常见困惑源
`body.childNodes` 往往比你想象的多——标签间换行各占一个文本节点。需要精确操作元素时用「只看元素」那套属性，会自动跳过文本与注释。读标签名用 `nodeName` / `tagName`（HTML 里返回**大写** `"P"`）。
:::

</v-click>

---

# 三个根入口 + 两套遍历

从 `document.documentElement`（`<html>`）、`document.head`、`document.body` 进树

<v-click>

DOM 提供**两套**平行的遍历属性，业务**优先用只看元素**那套：

| 维度 | 全部节点（含文本/注释） | 只看元素 |
| --- | --- | --- |
| 父 | `parentNode` | `parentElement` |
| 子集合 | `childNodes` | `children` |
| 首子 | `firstChild` | `firstElementChild` |
| 兄弟 | `nextSibling` | `nextElementSibling` |

</v-click>

<v-click>

`document.body` 可能为 `null`——脚本在 `<head>` 里、`<body>` 还没解析到时读它就是空。

</v-click>

---

# 只看元素：干净不踩坑

```js
const list = document.querySelector("ul");

list.children;          // 只含 <li>，干净
list.firstElementChild; // 第一个 <li>
list.childNodes;        // 含换行文本节点，往往不是你想要的
```

<v-click>

::: tip `parentNode` 与 `parentElement` 的唯一区别
只在树顶：`<html>` 的 `parentNode` 是 `document`，但 `parentElement` 是 `null`——因为 `document` 不是元素。
:::

</v-click>

---

# 查找节点：`querySelector` 系列是首选

「凭空在整篇文档里捞节点」，用查找方法最直接——接受**任意 CSS 选择器**

```js
// 第一个匹配（没有则 null）
const first = document.querySelector(".card .title");

// 全部匹配，返回静态 NodeList，可直接 forEach
document.querySelectorAll("ul.menu > li")
  .forEach((li) => console.log(li.textContent));

// 也能在元素上调用，把范围限定在它内部
card.querySelectorAll("button");
```

---

# 老式查找方法（了解即可）

```js
document.getElementById("main");       // 按 id，整文档唯一
elem.getElementsByTagName("li");       // 按标签名，可用 "*"
elem.getElementsByClassName("active"); // 按类名
document.getElementsByName("gender");  // 按 name 特性
```

<v-click>

::: warning `id` 会污染全局，别依赖
浏览器为每个 `id` 自动创建同名全局变量——历史遗留行为，会与你的变量冲突。永远显式 `getElementById` 或 `querySelector("#main")`。
:::

</v-click>

---

# 实时集合 vs 静态集合：必须分清的坑

`getElementsBy*` 返回**实时**集合（DOM 一变它跟着变）；`querySelectorAll` 返回**静态**快照

```js
const divs = document.getElementsByTagName("div"); // live
// 循环里 append div → divs.length 不断增长 → 死循环！

const snap = document.querySelectorAll("div");     // static
snap.length; // 查询那刻定格，后续新增不进来
```

<v-click>

实战：**绝大多数场景用 `querySelector` / `querySelectorAll`**——行为可预测、能限定子树；只有确需集合随 DOM 自动更新才用 `getElementsBy*`。

</v-click>

---

# `matches` / `closest` / `contains`

三个好用的辅助判断方法

```js
// matches：自身是否匹配选择器（只判断，不搜索）
if (elem.matches("a.external")) { /* … */ }

// closest：从自身【向上】找最近匹配祖先（含自身），没有则 null
const li = event.target.closest("li.item");

// contains：某节点是否在另一节点内部
container.contains(node); // true / false
```

<v-click>

`closest` 是**事件委托**的主力——点中 `<li>` 里的 `<span>`，一步定位到那个 `<li>`。

</v-click>

---
layout: section
---

# 二、修改文档

把找到的节点创建、插入、删除

---

# 造节点：`createElement`

修改 DOM 第一步是「凭空造一个新节点」——它**还不在页面上**，必须插入才可见

```js
const li = document.createElement("li");
li.textContent = "新条目"; // 此刻仍是游离对象
```

<v-click>

也能 `createTextNode("纯文字")` 单独造文本节点，但更多时候 `textContent` 一步到位。

</v-click>

---

# 插入节点：现代五法

成对的方法，名字直白，且**都能一次接受多个参数**（节点或字符串混传）

| 方法 | 插到哪里 |
| --- | --- |
| `node.append(...)` | 内部**末尾** |
| `node.prepend(...)` | 内部**开头** |
| `node.before(...)` | 自身**前面**（前一个兄弟） |
| `node.after(...)` | 自身**后面**（后一个兄弟） |
| `node.replaceWith(...)` | **替换**自身 |

```js
ul.append(li);       // 末尾
ul.prepend("置顶项");  // 字符串自动变文本节点，加到开头
li.after("说明文字");  // 在它后面插一段文字
```

---

# 老式插入方法（还会遇到）

行为相同但更繁琐——一次只插一个，且必须由**父节点**发起

```js
parent.appendChild(node);            // ≈ parent.append(node)
parent.insertBefore(node, refNode);  // 插到 refNode 前面
parent.replaceChild(newNode, oldNode); // 换掉 oldNode
parent.removeChild(node);            // 删除 node
```

<v-click>

::: tip 字符串参数永远是「安全文本」
现代五法收到字符串时当**纯文本**插入——哪怕写着 `<b>` 也只显示字面量，天然无注入风险。新代码优先用它们；删除直接用 `node.remove()`。
:::

</v-click>

---

# 插 HTML 字符串：`insertAdjacentHTML`

手里是一段 HTML 字符串、又想精确控制插入位置时用它

```js
box.insertAdjacentHTML("beforeend", "<p>追加的段落</p>");
```

四个位置关键字，以目标元素为参照：

```
<!-- beforebegin --> 元素前面（外部）
<div id="box">
  <!-- afterbegin --> 内容最前
  <!-- beforeend  --> 内容最后
</div>
<!-- afterend --> 元素后面（外部）
```

---

# `textContent` vs `innerHTML`：安全分水岭

本章最关键的一节——两者都设内容，但本质不同

```js
// textContent：当【纯文本】，标签原样显示，绝不解析 —— 安全
el.textContent = userInput; // 哪怕是 "<img onerror=…>" 也无害

// innerHTML：当【HTML】解析，会真的生成元素 —— 危险
el.innerHTML = userInput;   // 用户输入恶意标签 → XSS 攻击
```

<v-click>

铁律：**展示纯文本一律 `textContent`；只有内容完全可信时才用 `innerHTML`**。

</v-click>

<v-click>

::: warning `<script>` 不执行 ≠ `innerHTML` 安全
浏览器规定 `innerHTML` 插入的 `<script>` 不跑，但 `<img src=x onerror=alert(1)>` 这类**带内联事件处理器**的标签照样触发，仍是完整 XSS 攻击面。
:::

</v-click>

---

# `DocumentFragment`：批量插入省力容器

逐个 `append` 大量节点，每次都可能触发回流；fragment 是**游离的轻量容器**

```js
const frag = document.createDocumentFragment();
for (const name of ["苹果", "香蕉", "橙子"]) {
  const li = document.createElement("li");
  li.textContent = name;
  frag.append(li); // 先攒着，不碰真实 DOM
}
document.querySelector("ul").append(frag); // 一次性插入
```

<v-click>

`append(frag)` 后 frag 被清空——子节点「移动」进目标，fragment 这层容器本身不进 DOM。现代 `append(...数组)` 也能近似效果。

</v-click>

<v-click>

> 顺带：远古 API `document.write` **只在页面初次解析期间**有效，加载完再调用会**清空整页**——现代代码完全用节点 API 取代，避开它。

</v-click>

---
layout: section
---

# 三、属性、特性与样式

读写节点的数据与外观

---

# 特性 vs 属性：一字之差，两个世界

中文都叫「属性」，其实是两样东西，建议用**特性 / 属性**区分

<v-click>

- **特性（attribute）**：你在 **HTML 源码里写的**那串文本，值**永远是字符串**
- **属性（property）**：解析成 DOM 对象后挂的**字段**，值可为**任意类型**

</v-click>

<v-click>

```js
// HTML: <input id="login" type="checkbox" checked>
el.id;                       // "login"  —— 属性（字符串）
el.checked;                  // true     —— 属性是【布尔】
el.getAttribute("checked");  // ""        —— 特性只是 HTML 那段文本
```

</v-click>

---

# 经典的「不同步」：`input.value`

最常被坑：用户输入改了属性后，**不再回写**特性

```js
// HTML: <input id="t" value="初始">
t.getAttribute("value"); // "初始" —— 特性 = HTML 里的【初始值】
t.value;                 // "初始" —— 一开始相同

// 用户在框里敲字改成「新值」之后：
t.value;                 // "新值" —— 属性跟随当前实际内容
t.getAttribute("value"); // "初始" —— 特性【纹丝不动】
```

<v-click>

记忆：**`value` 特性 = 初始值；`value` 属性 = 当前值**。读用户「现在输入了什么」永远读 `el.value`。（`href` 同理：特性是原样相对路径，属性是完整绝对 URL。）

</v-click>

---

# 操作特性 + 自定义数据 `dataset`

非标准特性靠这四个方法（值按字符串、名不区分大小写）

```js
elem.getAttribute("data-id");      // 读，不存在则 null
elem.setAttribute("title", "提示"); // 写；另有 hasAttribute / removeAttribute
```

<v-click>

挂自定义数据**别乱造特性**，统一 `data-` 前缀，连字符自动转驼峰：

```js
// HTML: <div data-order-id="42" data-order-state="paid">
order.dataset.orderId;                // "42"  （data-order-id）
order.dataset.orderState = "shipped"; // 写回 HTML（行为模式常用载体）
```

</v-click>

---

# 改类名：用 `classList`

切换 CSS 类是最高频的样式操作，别手拼 `className` 字符串

```js
elem.classList.add("active");        // 加一个类
elem.classList.remove("hidden");     // 删一个类
elem.classList.toggle("open");       // 有则删、无则加
elem.classList.toggle("on", isOn);   // 第二参强制 true/false
elem.classList.contains("active");   // 是否含某类，布尔
```

<v-click>

日常**优先 `classList` 四个方法**；只有「一次性整体替换」才用 `elem.className = "a b c"`（覆盖原有全部，慎用）。

</v-click>

---

# 改内联样式：`elem.style`

对应元素的**内联样式**（`style="…"`），属性名用**驼峰**

```js
elem.style.color = "red";
elem.style.backgroundColor = "#0d1117"; // CSS 的 background-color
elem.style.marginTop = "8px";           // 带单位写全，"8" 无效
elem.style.display = "";                // 清除某条：赋空字符串
```

<v-click>

::: tip `style` 只看内联，改不动样式表
`elem.style` 读写的**只是内联样式**——看不到 `.css` 或 `<style>` 里选择器命中的规则。想读最终效果，用下面的 `getComputedStyle`。
:::

</v-click>

---

# 读最终样式：`getComputedStyle`

读「层叠计算后、浏览器实际应用」的样式，无论来自内联还是样式表

```js
const styles = getComputedStyle(elem);
styles.color;       // "rgb(255, 0, 0)" —— 颜色解析成 rgb(...)
styles.marginTop;   // "8px"            —— 长度解析成绝对 px
styles.paddingLeft; // 必须用完整属性名，不能用简写 padding
```

<v-click>

- 返回**只读**对象（改样式仍用 `elem.style`）
- 返回**解析后的值**——颜色统一 `rgb(…)`、长度统一 `px`，便于计算

</v-click>

---

# 量尺寸与坐标

布局几何信息不在 `style` 里，要读这些**几何属性**（返回数字，单位 px）

```js
elem.offsetWidth;  // 含 padding + border 的渲染宽
elem.clientWidth;  // 含 padding、不含 border 与滚动条
elem.scrollTop;    // 已纵向滚动距离（可读可写）

const rect = elem.getBoundingClientRect();
rect.top;   // 元素顶边距【视口】顶部距离
rect.width; // 渲染宽度
```

<v-click>

`getBoundingClientRect()` 是**相对视口**的坐标；换算成相对整页，加 `window.scrollX` / `scrollY`。

</v-click>

---
layout: section
---

# 四、事件机制

事件怎样在树上传播、又怎样监听

---

# 三种绑定方式，只推荐一种

```html
<button onclick="alert('hi')">点我</button>  <!-- ① 内联属性，逻辑混进结构 -->
```

```js
btn.onclick = () => alert("bye"); // ② DOM 属性，再赋值会【覆盖】前一个

// ③（推荐）addEventListener，可叠加多个、可移除、可配置
btn.addEventListener("click", () => alert("hi"));
btn.addEventListener("click", () => alert("bye")); // 两个都执行
```

<v-click>

::: tip 解绑要用同一个函数引用
`removeEventListener` 的 handler 必须是**同一个函数引用**——匿名箭头函数移不掉。「之后要移除」的处理器**必须用具名函数或保存引用**。
:::

</v-click>

---

# `event` 对象：这次事件的一切

处理器被调用时收到一个 `event` 对象，承载本次事件全部信息

```js
btn.addEventListener("click", (event) => {
  event.type;          // "click" 事件类型
  event.target;        // 真正被点击的元素（事件源）
  event.currentTarget; // 当前处理事件的元素（= 绑监听的 btn）
  event.clientX;       // 鼠标相对【视口】横坐标
});
```

<v-click>

`event.target` 与 `event.currentTarget` 的区别，是**理解事件委托的钥匙**，下面专门讲。

</v-click>

---

# 事件传播：捕获 → 目标 → 冒泡

点击页面深处元素，事件沿 DOM 树**走一趟完整旅程**，分三阶段

```
                    │ ① 捕获：从 document 自上而下
   document         ▼    往目标【下沉】
     └─ body
        └─ button ◀──── ② 目标：到达真正被点的元素
        ┌─ body     ▲
   ┌─ document       │ ③ 冒泡：从目标自下而上
                    │    往 document【上浮】
```

<v-click>

`addEventListener` **默认在冒泡阶段**触发。正因为有冒泡，「点子元素、却能在父元素统一处理」才成立——这就是事件委托的基础。

</v-click>

---

# `target` vs `currentTarget`

冒泡途中事件流经多个祖先，每个绑监听的都会被触发，此时

<v-click>

- **`event.target`** 始终指向**最初触发事件的元素**（旅程不变的「源头」）
- **`event.currentTarget`** 指向**当前正在执行处理器的元素**（随冒泡逐层变），等于 `this`

</v-click>

<v-click>

```js
// HTML: <ul id="menu"><li>A</li><li>B</li></ul>
menu.addEventListener("click", (event) => {
  event.currentTarget; // 永远是 #menu（监听器绑在它上）
  event.target;        // 你点的那个 <li>——据此知道点了谁
});
```

</v-click>

---

# `preventDefault` vs `stopPropagation`

两个方法作用**完全不同**，别混

```js
// preventDefault：取消浏览器默认动作（跳转/提交/右键菜单），不拦传播
event.preventDefault();

// stopPropagation：阻止事件继续向祖先传播，不影响默认动作
event.stopPropagation();
```

<v-click>

- `preventDefault` 改默认行为：SPA 路由拦链接跳转、`submit` 拦整页刷新
- `stopPropagation` 改传播路径：让外层监听不再被触发

</v-click>

<v-click>

::: warning 别滥用 `stopPropagation`
父层依赖冒泡的统计、「点外部收起」、整套**事件委托**都会被它悄悄打断且极难排查。没有明确理由不要调用——更狠的 `stopImmediatePropagation` 连同元素其它监听器也停。
:::

</v-click>

---

# `addEventListener` 的 `options`

第三个参数细调监听行为

```js
elem.addEventListener("click", handler, {
  capture: true, // 在【捕获】阶段触发（默认 false = 冒泡）
  once: true,    // 只触发【一次】，之后自动移除
  passive: true, // 承诺不调用 preventDefault，浏览器放心优化滚动
});
```

<v-click>

- `once`：适合「只需响应第一次」，免去手写解绑
- `passive`：常用于 `touchstart` / `wheel` / `scroll`——告诉浏览器「我不拦默认滚动」，显著改善移动端性能

</v-click>

---
layout: section
---

# 五、事件委托

把「给每个后代绑监听」收拢成「在共同祖先绑一个」

---

# 委托的标准四步

给一千个 `<li>` 各绑 `click` 占内存、且**动态新增的项不会自带监听**——委托用冒泡一举解决

```js
// 在【共同祖先】上绑一个监听，靠冒泡接住所有 <li>
menu.addEventListener("click", (event) => {
  // ① 祖先监听 ② event.target 看谁触发 ③ closest 定位
  const li = event.target.closest("li");
  if (!li || !menu.contains(li)) return; // 点空白或不属于本菜单 → 忽略
  console.log("点了：", li.textContent); // ④ 处理
});
```

<v-click>

`closest("li")` 的妙处：哪怕点的是 `<li>` 里嵌的 `<span>` 或图标，也能稳稳向上找到那个 `<li>`。

</v-click>

---

# 三大收益

| 收益 | 说明 |
| --- | --- |
| **省内存 / 提速** | 一个监听器替代成百上千个 |
| **动态元素零成本** | 后续新增子元素**自动**被接管，无需补绑 |
| **初始化 / 清理简单** | 绑定解绑只针对那**一个**祖先 |

<v-click>

「动态元素零成本」最被低估：异步加载列表、无限滚动、增删行——逐个绑几乎无法维护，委托天然适配。

</v-click>

---

# 「行为模式」：用 `data-*` 声明式驱动

HTML 里用 `data-*` **声明**行为，JS 在文档级别用一个监听器统一分派

```html
<button data-action="save">保存</button>
<button data-action="delete">删除</button>
```

```js
const actions = { save: () => {/*…*/}, delete: () => {/*…*/} };
document.addEventListener("click", (event) => {
  const el = event.target.closest("[data-action]");
  if (!el) return;
  actions[el.dataset.action]?.(); // 找到对应动作就执行
});
```

<v-click>

新增带标注的元素时**完全不用碰 JS**——这正是许多框架指令（如 `v-on`）背后的朴素原理。

</v-click>

---

# 自定义事件：`CustomEvent` + `dispatchEvent`

代码也能**主动造事件并派发**——组件解耦通信的常用手段

```js
const event = new CustomEvent("cart:add", {
  detail: { id: 42, name: "键盘" }, // 自定义数据放 detail
  bubbles: true,                    // 让它能冒泡、被祖先委托接住
});
productEl.dispatchEvent(event);

document.addEventListener("cart:add", (event) => {
  console.log("加入购物车：", event.detail.name); // 读 detail
});
```

<v-click>

`dispatchEvent` 是**同步**的；`event.isTrusted` 为 `true` 表示真实用户事件、脚本派发的为 `false`。

</v-click>

---

# 委托的三条限制

委托很强，但有边界，得心里有数

<v-click>

1. **事件必须会冒泡**：`focus` / `blur` 默认**不冒泡**，无法直接委托——用 `focusin` / `focusout` 或捕获阶段
2. **`stopPropagation()` 会断链**：途中任何后代调用它，事件到不了祖先，委托失效
3. **祖先要处理子树全部事件**：保持处理器轻量、尽早 `return` 掉不相关的

</v-click>

---
layout: section
---

# 六、表单事件与页面加载

控件事件，以及脚本何时能安全访问 DOM

---

# `input` vs `change`：分工要分清

表单控件最常用两个「值变化」事件

```js
// input：每敲一个字符就立即触发，适合实时搜索 / 即时校验
box.addEventListener("input", () => console.log(box.value));

// change：失焦且值确实变了才触发，适合「最终确认」类逻辑
box.addEventListener("change", () => console.log(box.value));
```

<v-click>

- **`input`**：内容一变**立即**触发（连续敲字连续触发）
- **`change`**：等控件**失焦**且值有变化；对 `<select>` / 复选框则是选中即触发

取值始终用**属性**：`el.value` / `el.checked`（布尔）/ `select.value`。

</v-click>

---

# `focus` / `blur` 不冒泡

```js
input.addEventListener("focus", () => input.classList.add("active"));
input.addEventListener("blur", () => validate(input)); // 失焦校验
```

<v-click>

::: warning 委托要换门路
和 `click` 不同，`focus` / `blur` **不会冒泡**，不能直接在父容器委托。两条出路：
- 用会冒泡的**孪生版本** `focusin` / `focusout`（语义相同）
- 或传 `{ capture: true }`，在**捕获阶段**监听
:::

</v-click>

---

# 表单提交：拦住默认提交

监听 `<form>` 的 `submit`，**不是**监听按钮的 `click`——回车提交也走 `submit`，更可靠

```js
form.addEventListener("submit", (event) => {
  event.preventDefault(); // 关键：拦住「整页刷新式提交」

  const data = new FormData(form);
  console.log("用户名：", data.get("username"));
  // 自行校验、用 fetch 异步提交……
});
```

<v-click>

`preventDefault()` 是表单 JS 化的核心——拦下默认提交后，由你接管校验与提交流程。

</v-click>

---

# 页面加载：`DOMContentLoaded` vs `load`

脚本想操作 DOM，前提是 DOM 已存在；两个里程碑标记不同阶段

| 事件 | 触发对象 | 触发时机 |
| --- | --- | --- |
| `DOMContentLoaded` | `document` | **HTML 解析完、DOM 就绪**；图片/样式表未必好 |
| `load` | `window` | 连图片、样式表等**全部资源**都加载完 |

<v-click>

绝大多数初始化挂 `DOMContentLoaded` 即可——它**早于** `load`，让页面更快「活」起来；只有依赖图片真实尺寸等才用 `load`。

</v-click>

<v-click>

```js
// 健壮写法：document.readyState 反映阶段（loading→interactive→complete）
if (document.readyState !== "loading") init();
else document.addEventListener("DOMContentLoaded", init); // 否则等事件
```

</v-click>

---

# 脚本加载时机：`defer` / `async` / `module`

「脚本拿不到元素」的根因常是**执行时 DOM 还没解析到那里**

```html
<!-- 普通：下载与执行都【阻塞】解析，后面 DOM 此刻不存在 -->
<script src="app.js"></script>
<!-- defer：后台并行下载，解析完、DOMContentLoaded 前执行 -->
<script defer src="app.js"></script>
<!-- async：下完【立即执行】，不等其它脚本、不保证顺序 -->
<script async src="analytics.js"></script>
<!-- module：默认就是 defer 行为 -->
<script type="module" src="app.js"></script>
```

---

# 四种脚本时机对比

| 方式 | 阻塞解析 | 执行时机 | 顺序 | `DOMContentLoaded` 等它 |
| --- | --- | --- | --- | --- |
| `<script>` | 是 | 立即 | 文档顺序 | 等 |
| `defer` | 否 | 解析完、事件前 | 文档顺序 | 等 |
| `async` | 否 | 下完即跑 | 无序 | **不等** |
| `module` | 否 | 同 `defer` | 文档顺序 | 等 |

<v-click>

选择：**依赖完整 DOM / 多脚本有先后** → `defer`（或 `module`）；**完全独立的第三方脚本** → `async`。

</v-click>

---

# 最佳实践小结

<v-click>

- **查**：统一 `querySelector` 系列；记牢 `querySelectorAll` 静态、`getElementsBy*` 实时
- **改**：现代五法插入；展示纯文本一律 `textContent`，可信才 `innerHTML`
- **样式**：类用 `classList`、内联用 `style`（驼峰）、读最终用 `getComputedStyle`
- **听**：统一 `addEventListener`；分清 `target`（源）vs `currentTarget`（绑监听者）
- **委托**：祖先一个监听 + `target.closest`；别乱 `stopPropagation`
- **时机**：脚本用 `defer` / `module`，逻辑挂 `DOMContentLoaded`

</v-click>

---
layout: center
class: text-center
---

# 谢谢

把「查、改、听」三条主线打通，DOM 与事件就不再是黑盒

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
