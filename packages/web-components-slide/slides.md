---
theme: seriph
layout: cover
title: Web Components
info: |
  浏览器原生的组件模型：Custom Elements、Shadow DOM 与 template/slot 的协作、封装边界与工程实践。

  Learn more at [MDN Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark">WC</div>

# Web Components

## 浏览器原生的组件模型：把封装做成标准能力

<div class="cover-meta">
  <span>核心三件 Baseline 全绿</span>
  <span>Custom Elements · Shadow DOM · template/slot</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components" target="_blank" class="slidev-icon-btn" aria-label="MDN Web Components">
    <carbon:document />
  </a>
  <a href="https://github.com/WICG/webcomponents" target="_blank" class="slidev-icon-btn" aria-label="WICG webcomponents">
    <carbon:logo-github />
  </a>
</div>

<!--
Web Components 不是某个框架的替代品，而是浏览器把"组件化"下沉为标准能力：Custom Elements 管身份与行为，Shadow DOM 管封装边界，template 和 slot 管结构与内容分发。

支持现状先给结论：核心三件已在全部主流浏览器全绿多年；声明式 Shadow DOM 在 2024 年补上了 SSR 这块最大缺口；ElementInternals 让组件能以一等公民身份参与表单；Scoped Registries 由 Safari 26 首发。这一场讲清楚两件事：怎么用，以及边界在哪。
-->

---
layout: default
---

# 为什么需要原生组件模型

<div class="grid grid-cols-2 gap-5 mt-6">
  <div class="rule tone-amber">
    <strong>框架组件：活在各自运行时里</strong>
    <span>Vue 组件进不了 React 项目；框架大版本升级，组件库可能跟着整体重写</span>
  </div>
  <div class="rule tone-green">
    <strong>Web Components：下沉为浏览器标准</strong>
    <span>产物是一个标准 HTML 标签，任何页面、任何框架（或没有框架）直接使用</span>
  </div>
</div>

```html
<!-- 用起来和 <video>、<details> 这些内置标签没有区别 -->
<user-card name="张三" avatar="/avatar.png"></user-card>
```

<div class="grid grid-cols-3 gap-4 mt-5">
  <div v-click class="fact"><strong>跨框架</strong><span>Vue/Angular 满分支持，React 19 起完整支持</span></div>
  <div v-click class="fact"><strong>真封装</strong><span>浏览器级 DOM/样式隔离，不是约定式的 scoped class</span></div>
  <div v-click class="fact"><strong>长寿命</strong><span>标准标签不随框架世代更替而报废</span></div>
</div>

<!--
框架早就把组件化做得很好，但框架组件只活在各自的运行时里——跨框架不可复用、随框架世代报废，这是两个真实成本。

Web Components 解决的是另一个层面的问题：把组件下沉为浏览器标准。产物就是一个标准 HTML 标签，和 video、details 用起来没有区别。

[click] 跨框架：custom-elements-everywhere 实测 Vue、Angular 满分，React 从 19 起完整支持。
[click] 真封装：Shadow DOM 是浏览器级别的硬边界，外部选择器进不来，不是靠命名约定。
[click] 长寿命：这是设计系统、跨团队组件库选它的核心动机。
-->

---
layout: default
---

# 三大技术：各自独立，组合成完整组件

<div class="pipeline mt-7">
  <div v-click class="pipeline-step tone-blue">
    <span class="step-no">CUSTOM ELEMENTS</span>
    <strong>给"身份与行为"</strong>
    <span>元素类 + 注册表 + 生命周期回调（WHATWG HTML）</span>
  </div>
  <carbon:add class="pipeline-arrow" />
  <div v-click class="pipeline-step tone-green">
    <span class="step-no">SHADOW DOM</span>
    <strong>给"封装边界"</strong>
    <span>隔离渲染的影子树：外部进不来、内部不外泄（WHATWG DOM）</span>
  </div>
  <carbon:add class="pipeline-arrow" />
  <div v-click class="pipeline-step tone-amber">
    <span class="step-no">HTML TEMPLATES</span>
    <strong>给"结构与分发"</strong>
    <span><code>&lt;template&gt;</code> 惰性标记 + <code>&lt;slot&gt;</code> 内容投影</span>
  </div>
</div>

<div class="grid grid-cols-2 gap-4 mt-8">
  <div v-click class="fact"><strong>可以拆开用</strong><span>只用 template 做惰性模板、只用 Shadow DOM 做样式隔离，都成立</span></div>
  <div v-click class="fact"><strong>先立四个术语</strong><span>shadow host（宿主）/ shadow root（影子根）/ shadow tree / light DOM（宿主标签内的常规子节点）</span></div>
</div>

<!--
[click] Custom Elements 负责身份与行为：定义元素类、在注册表登记名字，浏览器解析到标签就实例化并按时机调用生命周期回调。
[click] Shadow DOM 负责封装边界：给元素挂一棵隔离渲染的影子树。
[click] template 和 slot 负责结构与内容分发：解析一次、多实例克隆，slot 把使用者的内容投影进来。
[click] 三者是三项独立标准，可以各自单独使用，组合起来才是完整的组件模型。
[click] 四个术语现在立住：host、root、tree、light DOM——后面每一页都用得到。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 第一个元素：class → attachShadow → define

::left::

```js {1-2|4-9|11-13|15|all}
class UserCard extends HTMLElement {
  static observedAttributes = ["name"]; // 声明要观察的属性

  constructor() {
    super(); // 必须首先调用
    // 挂影子树：内部结构与样式从此和页面隔离
    this.attachShadow({ mode: "open" }).innerHTML = `
      <style>:host { display: inline-block }</style><b></b>`;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.shadowRoot.querySelector("b").textContent = newValue ?? "";
  }
}
customElements.define("user-card", UserCard);
```

::right::

```html
<user-card name="张三"></user-card>
```

<div class="rule-stack mt-4">
  <div v-click class="rule tone-blue"><strong>命名铁律</strong><span>小写字母开头 + 至少一个连字符；违反直接抛 <code>SyntaxError</code></span></div>
  <div v-click class="rule tone-amber"><strong>构造函数三禁</strong><span>先 <code>super()</code>；不读属性/子节点；不加属性/子节点——初始化放 <code>connectedCallback()</code></span></div>
  <div v-click class="rule tone-green"><strong>attribute 只有字符串</strong><span>对象/数组要在 JS 里设 property（<code>el.data = {...}</code>）——框架互操作差异的根源</span></div>
</div>

<!--
左边十五行就是一个完整可运行的组件。

[click] observedAttributes 是显式 opt-in：只有列出来的属性才会触发变更回调。
[click] 构造函数里只做与 DOM 无关的初始化，加上挂影子树——这两件是合法的。
[click] attributeChangedCallback 在初始解析时也会触发一次，所以渲染逻辑写在这里能同时覆盖初始值和后续变更。
[click] define 在全局注册表登记名字，从此浏览器解析到 user-card 就实例化这个类。
[click] 命名必须小写开头且含连字符，这是与内置标签的命名空间隔离。
[click] 构造函数三禁是规范硬性要求，违反会抛错或产生行为不一致。
[click] attribute 传字符串、property 传对象——记住这条，后面讲框架互操作时它是全部差异的根源。
-->

---
layout: default
---

# 生命周期五回调：知道"何时被叫"

<table class="decision-table mt-4">
  <thead><tr><th>回调</th><th>触发时机</th><th>关键注意</th></tr></thead>
  <tbody>
    <tr v-click><td><code>connectedCallback()</code></td><td>每次插入文档</td><td><strong>可多次触发</strong>；读属性、挂事件、发请求的主场</td></tr>
    <tr v-click><td><code>disconnectedCallback()</code></td><td>每次移出文档</td><td>做清理；页面整体卸载时不保证触发</td></tr>
    <tr v-click><td><code>attributeChangedCallback(n, old, new)</code></td><td>被观察属性变化</td><td>仅 <code>observedAttributes</code> 列出的属性；初始解析也触发一次</td></tr>
    <tr v-click><td><code>adoptedCallback()</code></td><td>移入另一个 document</td><td><code>document.adoptNode()</code> 场景（如 iframe 间），极少用</td></tr>
    <tr v-click><td><code>connectedMoveCallback()</code>（新）</td><td><code>moveBefore()</code> 移动</td><td>定义了它，移动就<strong>代替</strong>断连+重连一对，内部状态保持</td></tr>
  </tbody>
</table>

<div v-click class="takeaway mt-5">
  移动元素 = 先断开再连接：<code>appendChild</code> 挪个位置就让回调各来一次——<code>connectedCallback</code> 必须写成幂等。
</div>

<!--
[click] connectedCallback 的头号认知点是"可多次触发"：元素每次连接到文档都会调用它。
[click] disconnectedCallback 做清理——解绑挂在 document、window 上的监听器、清定时器；但关闭标签页时不保证触发，持久化逻辑别押在这里。
[click] attributeChangedCallback 只对 observedAttributes 里列出的属性触发，忘记声明就静默不观察；初始 HTML 里写着的属性在解析时也会触发一次。
[click] adoptedCallback 对应跨 document 移动，知道语义即可。
[click] connectedMoveCallback 是配合 moveBefore 的新回调：定义了它，移动时就不再拆掉重建，iframe、动画、焦点这些内部状态得以保住。
[click] 总结成一条纪律：移动等于断开加连接，所以 connectedCallback 必须幂等——挂监听器前判断是否已初始化。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 先用后定义：升级机制与配套 API

::left::

<div class="boundary-stack mt-2">
  <div class="boundary external"><carbon:help /><span>HTML 先出现 <code>&lt;user-card&gt;</code>：以"未定义元素"占位</span></div>
  <carbon:arrow-down />
  <div v-click class="boundary check"><carbon:code /><span><code>customElements.define()</code> 稍后执行</span></div>
  <carbon:arrow-down />
  <div v-click class="boundary trusted"><carbon:checkmark /><span>文档内同名元素<strong>就地升级</strong>：构造函数补跑、回调补触发</span></div>
</div>

<div v-click class="mini-note mt-4">升级只覆盖文档内的元素；文档外的树要 <code>customElements.upgrade(node)</code> 手动升级。</div>

::right::

```js
// 等组件就绪再操作（Promise）
await customElements.whenDefined("user-card");

// 防重复注册（HMR/重复执行的脚本必备）
if (!customElements.get("user-card")) {
  customElements.define("user-card", UserCard);
}
```

```css
/* :defined 防 FOUC：未升级期间隐藏或给骨架 */
user-card:not(:defined) {
  visibility: hidden;
}
```

<!--
自定义元素支持"先用后定义"，这是渐进增强的基石。

HTML 解析到 user-card 而注册表里还没有这个名字时，它以未定义元素的状态占位，页面照常解析。
[click] 之后任意时刻 define 执行——脚本晚加载完全没问题。
[click] 文档中所有同名元素就地升级：构造函数补跑、connectedCallback 等回调按当前状态补触发。

右边三个配套 API 都是高频实战款：whenDefined 返回 Promise，等组件就绪再操作；get 判断是否已注册，热重载防重复 define 抛 NotSupportedError；CSS 的 :defined 伪类给未升级状态做隐藏或骨架，防止组件"裸奔"闪烁。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 两类自定义元素：只有一类能用

::left::

### autonomous（自治）

```js
class PopupInfo extends HTMLElement {}
customElements.define("popup-info", PopupInfo);
```

```html
<popup-info></popup-info>
```

<div v-click class="signal signal-good mt-3">
  <carbon:checkmark-outline />
  <span>全浏览器多年全绿——唯一可移植路线</span>
</div>

::right::

### customized built-in（定制内置）

```js
class WordCount extends HTMLParagraphElement {}
customElements.define("word-count", WordCount, { extends: "p" });
```

```html
<p is="word-count"></p>
```

<div v-click class="signal signal-bad mt-3">
  <carbon:warning-alt />
  <span>WebKit/Safari 明确拒绝实现（standards-positions #97）——跨浏览器死路</span>
</div>

<div v-click class="col-span-2 takeaway mt-4">
  需要原生行为/语义时用<strong>组合</strong>代替继承：影子树内包一个真的 <code>&lt;button&gt;</code>，把交互代理给它。
</div>

<!--
规范定义了两类自定义元素。左边是自治自定义元素：继承 HTMLElement，行为完全自建，以独立标签使用。

右边是定制内置元素：继承某个具体内置元素类，用 is 属性挂到原生标签上，意图是继承原生行为再增强。

[click] 自治路线全浏览器多年全绿。
[click] 但定制内置这条路，WebKit 在 standards-positions 第 97 号立场里明确拒绝实现，多年僵持后事实结论就是跨浏览器死路。后面会看到 Scoped Registries 也不支持 extends，标准演进在事实上冷落了它。
[click] 那需要原生按钮的语义和可访问性怎么办？用组合——影子树内部包一个真的 button，把交互代理给它。把这条边界讲清楚，比记住 is 的语法重要得多。
-->

---
layout: default
---

# Scoped Registries：微前端的重名解药

<div class="mini-note mt-1"><code>customElements</code> 是全局单例——两个子应用带着同名不同版的 <code>&lt;fancy-button&gt;</code>，第二次 <code>define()</code> 直接抛 <code>NotSupportedError</code>。</div>

```js {1-3|5-9|10|all}
// 1. 局部注册表：同一个名字，可以是另一套实现
const registry = new CustomElementRegistry();
registry.define("fancy-button", FancyButtonV2);

// 2. 挂影子树时绑定：这棵影子树内的标签查"局部字典"
const shadow = host.attachShadow({
  mode: "open",
  customElementRegistry: registry,
});
shadow.innerHTML = "<fancy-button></fancy-button>"; // 解析为 V2
```

<div class="grid grid-cols-3 gap-4 mt-5">
  <div v-click class="fact"><strong>Safari 26.0 首发</strong><span>2025-09 第一个标准化实现；26.4 增 <code>initialize()</code> 后期关联</span></div>
  <div v-click class="fact"><strong>Chromium 跟进中</strong><span>原型阶段——当前适合渐进增强或 polyfill 兜底</span></div>
  <div v-click class="fact"><strong>不支持 extends</strong><span>局部注册表只服务 autonomous——再次坐实 <code>is=""</code> 死路</span></div>
</div>

<!--
全局注册表一个名字只能注册一次，这在微前端里是真实痛点：两个子应用带着同名不同版的组件就撞车了。

Scoped Custom Element Registries 让注册表可以按影子树局部化。代码分三步：new 一个局部注册表、在里面 define 自己版本的实现；attachShadow 时通过 customElementRegistry 选项绑定；从此这棵影子树内解析自定义元素时查的是局部字典，同名标签在不同影子树里指向不同实现。

[click] 现状要讲清楚：Safari 26.0 在 2025 年 9 月首发标准化实现，26.4 补了 initialize 后期关联。
[click] Chromium 还在原型阶段，跨浏览器可用尚需时日，当前适合渐进增强或有 polyfill 兜底的场景。
[click] 另外局部注册表的 define 不支持 extends 选项——又一次坐实了定制内置元素的死路地位。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# Shadow DOM：挂在元素上的私有 DOM 树

::left::

<div class="wc-tree mt-2">
  <div class="wc-node">&lt;body&gt; —— 页面常规 DOM</div>
  <div class="wc-node wc-node--host">
    &lt;user-card&gt;<span class="wc-boundary-tag">shadow host（宿主）</span>
    <div class="wc-shadow-box">
      <span class="wc-boundary-tag">#shadow-root —— 边界内独立渲染</span>
      <div class="wc-node">&lt;style&gt; 只作用于本树</div>
      <div class="wc-node">&lt;div class="name"&gt;</div>
      <div class="wc-node">&lt;slot&gt; ← light DOM 内容投影处</div>
    </div>
  </div>
</div>

<div v-click class="mini-note mt-3">浏览器早就在用：<code>&lt;video&gt;</code> 的控制条、<code>&lt;input type="range"&gt;</code> 的滑轨都是内置影子树。</div>

::right::

<div class="rule-stack mt-2">
  <div v-click class="rule tone-blue"><strong>JS 边界</strong><span><code>document.querySelector()</code> 止步于边界；open 模式唯一入口 <code>el.shadowRoot</code>（closed 返回 <code>null</code>）</span></div>
  <div v-click class="rule tone-green"><strong>CSS 双向隔离，留两条通道</strong><span>页面选择器进不来、内部 <code>&lt;style&gt;</code> 不外泄；但可继承属性与 CSS 变量沿继承<strong>穿透</strong>——主题定制的正门</span></div>
  <div v-click class="rule tone-red"><strong>closed ≠ 安全机制</strong><span>只挡 <code>el.shadowRoot</code> 一条路，可被绕过；它是 API 约定，不是沙箱</span></div>
</div>

<!--
左边这张图是 Shadow DOM 的全部结构：宿主元素上挂一棵影子树，虚线就是影子边界，封装的全部故事都发生在边界两侧。

[click] 这不是新发明——video 的控制条、range 的滑轨都是浏览器内置的影子树，Web Components 只是把同样的能力开放给了开发者。
[click] JS 边界：页面的 querySelector 穿不进影子树，open 模式下唯一入口是 el.shadowRoot；影子树内部用自己的 shadowRoot 查自己。
[click] CSS 双向隔离是默认行为，但规范特意留了两条穿透通道：可继承属性照常继承（组件字体自动跟随页面），CSS 自定义属性穿透边界——这是组件对外暴露样式 API 的标准方式，下一页展开。
[click] closed 模式经常被误当安全机制：它只是让 el.shadowRoot 返回 null，打补丁就能绕过。常规组件用 open 即可。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 样式开口：变量管"值"，::part() 管"块"

::left::

### 组件作者：留出开口

```css
/* 影子树内：消费变量，给默认值兜底 */
.name {
  color: var(--card-accent, #333);
}
```

```html
<!-- 把允许外部定制的节点标上 part 名 -->
<input part="field" />
```

<div v-click class="mini-note mt-3">嵌套组件的内层 part 默认不透传，外层用 <code>exportparts="field, label:inner-label"</code> 显式转发（可改名）。</div>

::right::

### 使用者：显式定制

```css
/* CSS 变量沿继承穿透影子边界 */
user-card {
  --card-accent: #d33;
}

/* ::part() 是官方外部样式接口，后可接伪类 */
user-card::part(field) {
  border-radius: 6px;
}
user-card::part(field):hover {
  border-color: #d33;
}
```

<div v-click class="col-span-2 takeaway mt-4">
  全局主题/工具类 CSS（Tailwind、normalize）进不了影子树——组件的对外样式 API 必须<strong>显式设计</strong>：变量定"值"（颜色/尺寸），<code>::part()</code> 定"块"（某个内部元素的整体样式）。
</div>

<!--
封装是硬边界，那设计系统的主题怎么进来？答案是两个设计好的正门。

第一个门是 CSS 自定义属性：组件作者在影子树内用 var 消费变量并给默认值兜底，使用者在页面侧给宿主定变量值，变量沿继承链穿透边界。它负责"值"级别的定制——颜色、尺寸、圆角。

第二个门是 part：作者把允许外部定制的内部节点标上 part 名，使用者用双冒号 part 显式样式化，后面还可以接 hover、state 这些伪类。它负责"块"级别的定制。

[click] 嵌套组件的内层 part 默认不透传，需要外层用 exportparts 显式转发，转发时还能改名避免冲突。
[click] 带走这条设计约定：变量管值、part 管块，二者构成组件完整的对外样式 API。全局工具类进不来不是缺陷，是逼着你把样式接口设计出来。
-->

---
layout: default
---

# 事件跨越边界：retargeting 与 composed

<div class="pipeline mt-4">
  <div class="pipeline-step tone-blue">
    <span class="step-no">影子树内</span>
    <strong>真实 target</strong>
    <span>内部 <code>&lt;button&gt;</code> 被点击，内部监听器看到真身</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div v-click class="pipeline-step tone-amber">
    <span class="step-no">SHADOW BOUNDARY</span>
    <strong>composed 把关</strong>
    <span>只有 <code>composed: true</code> 的事件有资格穿出边界</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div v-click class="pipeline-step tone-green">
    <span class="step-no">页面侧</span>
    <strong>target 被重定向为宿主</strong>
    <span>外部只看到 <code>&lt;user-card&gt;</code>，内部结构不泄露</span>
  </div>
</div>

````md magic-move {at:3}
```js
// 组件内部：看似正常地对外发事件……外面永远听不到
this.dispatchEvent(
  new CustomEvent("change", { detail: { value: this._value } }),
);
```

```js
this.dispatchEvent(
  new CustomEvent("change", {
    bubbles: true,   // 默认 false：允许冒泡
    composed: true,  // 默认 false：允许穿越影子边界——忘了它就是"静音"
    detail: { value: this._value },
  }),
);
```
````

<div v-click class="mini-note mt-3">多数原生 UI 事件（click/input）天生 <code>composed: true</code>；要"看穿"重定向用 <code>event.composedPath()[0]</code> 拿真实起点。</div>

<!--
事件系统对影子边界做了两件事。

第一件是 retargeting：影子树内元素触发的事件冒泡出边界后，外部监听器看到的 target 被替换成宿主元素——外界不该知道组件内部的按钮长什么样。影子树内部的监听器看到的仍是真实节点。

[click] 第二件是 composed 把关：事件能不能穿越边界由 composed 标志决定。
[click] 多数原生 UI 事件天生为 true，正常穿出。

[click] 但 CustomEvent 默认 bubbles 和 composed 都是 false。上面这段代码看起来毫无问题，外面却永远听不到——这是组件事件"静音"的头号原因。完整样板必须两个开关都显式打开。

[click] 需要看穿重定向时用 composedPath，数组第一项是真实起点；closed 影子树的内部节点会被隐去。
-->

---
layout: default
class: lab-slide
---

# 交互实验：亲眼验证影子边界

<ShadowIsolationLab />

<!--
两块内容长得一模一样，class 名也完全相同：左边是普通 DOM，右边包在 Shadow DOM 影子树里。

先点"注入页面级 CSS"——注入的规则直接按 class 命中 wc-victim 这组选择器，左边立刻被改成红色删除线，右边纹丝不动。这就是浏览器级封装与约定式 scoped class 的区别：选择器根本进不了影子边界。

再点"改写 CSS 变量"——两边一起变色：CSS 自定义属性沿继承链穿透边界，这是规范特意留下的主题开口。

隔离与开口是同一套设计的两面：默认全隔离，定制走正门。这个实验本身就是一个真的自定义元素，定义放在 onMounted 里并用 customElements.get 防了重复注册。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# template 惰性 + slot 投影

::left::

### `<template>`：解析但不渲染

```js {1|3-4|all}
const tpl = document.getElementById("row-tpl");

// 直接 appendChild(tpl.content) 会把模板"掏空"
tbody.appendChild(tpl.content.cloneNode(true));
```

<div v-click class="mini-note mt-3">惰性 = 不进渲染树、脚本不执行、图片不加载；组件模式 = 模板解析一次，千百实例克隆共享。</div>

::right::

### `<slot>`：把使用者内容投影进来

```html
<!-- 影子树内：命名插槽 + fallback 后备内容 -->
<slot name="title">未命名卡片</slot>

<!-- 使用侧 light DOM：按 slot 属性对号入座 -->
<h2 slot="title">季度报告</h2>
```

<div v-click class="col-span-2 takeaway mt-4">
  分发是<strong>投影不是搬家</strong>：被分发节点仍在 light DOM（<code>parentNode</code> 不变、页面 CSS 仍可样式化它）；动态感知靠 <code>slotchange</code> + <code>assignedElements()</code>——注意 <code>slotchange</code> 不穿出影子树。
</div>

<!--
template 的内容是"冻结"的：不进渲染树、脚本不执行、图片不发请求，内容挂在 content 上，是一个 DocumentFragment。

[click] 经典陷阱：直接 appendChild 模板的 content 会把 fragment 的子节点搬走，模板被掏空，第二个实例就是空白——必须深克隆再用，cloneNode 带 true。
[click] 和组件结合的价值：模板只解析一次，千百个实例共享解析成果。

右边是 slot：影子树封住了内部结构，但组件总要接收使用者的内容。命名插槽按 name 和 slot 属性精确匹配，没有 name 的默认插槽接住所有未标记内容，slot 标签的子内容是后备。

[click] 最重要的心智：分发是投影不是搬家。被分发节点的 parentNode 还是宿主、还在 light DOM 里，页面 CSS 仍然能样式化它们——这与影子树内部节点截然不同。动态感知用 slotchange，但它不穿出影子树，要挂在 slot 或影子根上监听。
-->

---
layout: default
---

# 声明式 Shadow DOM：SSR 的关键拼图

<div class="mini-note mt-1">命令式 <code>attachShadow()</code> 的结构缺陷：影子树要等 JS 跑起来才存在——服务端渲染的首屏要么白块（FOUC）、要么布局跳动。</div>

```html {1-2|3-6|all}
<user-card>
  <!-- 解析器读到开标签就地建影子根，内容流式解析进去，template 从 DOM 消失 -->
  <template shadowrootmode="open">
    <style>:host { display: inline-block }</style>
    <div class="name">张三</div>
  </template>
</user-card>
```

<div class="grid grid-cols-3 gap-4 mt-4">
  <div v-click class="fact"><strong>零 JS 首渲</strong><span>不加载任何脚本也有完整样式的首屏</span></div>
  <div v-click class="fact"><strong>Baseline 2024-08-05</strong><span>Chrome/Edge 111、Firefox 123、Safari 16.4</span></div>
  <div v-click class="fact"><strong>水合先复用</strong><span>构造函数查 <code>internals.shadowRoot</code>：有就接管、没有才自建</span></div>
</div>

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span><code>innerHTML</code> 出于防注入<strong>不解析</strong> DSD——动态注入要用 <code>setHTMLUnsafe()</code>/<code>parseHTMLUnsafe()</code>；对声明式根盲目 <code>attachShadow()</code> 会清空它、丢掉服务端成果。</span>
</div>

<!--
命令式 API 有个结构性缺陷：影子树必须等 JS 跑起来才存在，服务端渲染输出的 HTML 里没有影子树。声明式 Shadow DOM 补上了这块：template 带上 shadowrootmode 属性，解析器读到开标签就地把它转为影子根，模板内容直接流式解析进去，边下载边渲染。

[click] 所以这段 HTML 不加载任何脚本也能以完整样式渲染，组件 JS 只负责后续交互。
[click] Baseline 时间点：2024 年 8 月 5 日达成 Newly available。历史坑：Chrome 90 曾短暂支持旧的非标 shadowroot 属性，已废弃，一律写 shadowrootmode。
[click] 水合的正确姿势：构造函数先查 internals.shadowRoot——用 internals 的好处是 closed 模式的声明式根也拿得到——有就复用既有 DOM 只挂事件，没有才走客户端渲染。

[click] 两个坑：innerHTML、insertAdjacentHTML 出于安全不解析声明式影子根，动态注入必须用显式"知情"的 setHTMLUnsafe；对已带声明式根的元素调 attachShadow 不抛错，而是清空该根返回——盲目重建等于把 SSR 成果扔了。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# ElementInternals：晋级"真表单控件"

::left::

```js {1-2|4-7|9-14|all}
class FancyInput extends HTMLElement {
  static formAssociated = true; // 声明"我是表单控件"

  constructor() {
    super();
    this.internals_ = this.attachInternals(); // 每元素仅一次
  }

  #sync(v) {
    this.internals_.setFormValue(v); // 提交值进 FormData
    this.internals_.setValidity(     // 空对象 {} = 有效
      v ? {} : { valueMissing: true },
      "请填写此字段");
  }
}
```

::right::

<div class="rule-stack mt-1">
  <div v-click class="rule tone-blue"><strong>不接入就是"残疾"</strong><span>自定义元素天生不进 <code>FormData</code>、reset 无效、<code>&lt;label&gt;</code> 关联不上、没有约束校验</span></div>
  <div v-click class="rule tone-amber"><strong>表单四回调</strong><span>不写 <code>formResetCallback</code> = reset 对组件无效；<code>formDisabledCallback</code> 只是通知，置灰要自己做</span></div>
  <div v-click class="rule tone-green"><strong>默认 ARIA 语义</strong><span><code>internals.role = "checkbox"</code> 不污染使用者 HTML；<code>ariaLabelledByElements</code> 元素引用可跨影子根</span></div>
</div>

<div v-click class="mini-note mt-3">仅 autonomous 可调 <code>attachInternals()</code>；表单组件标配 <code>delegatesFocus: true</code>；Safari 16.4（2023-03）补齐后全绿。</div>

<!--
做好了外观和交互的组件放进 form 会发现：提交时 FormData 里没有它、reset 无效、label 关联不上。原生控件的这些能力来自浏览器内部的表单关联机制，ElementInternals 把这套机制开放给了自定义元素。

代码里是开启两件套：[click] 类上声明 formAssociated 为 true；[click] 构造函数里 attachInternals 领取入口，每个元素只能调一次。
[click] 然后 setFormValue 设置提交值，setValidity 参与约束校验——空对象表示有效，有 flag 为 true 就必须给提示文案。checkValidity、reportValidity 与原生表单 API 完全同构。

[click] 右边三条边界：不接入就是残疾；表单四回调里最容易漏的是 formResetCallback，不写 reset 按钮对你无效，formDisabledCallback 只是通知、表现全要自己做。
[click] ElementInternals 的另一半价值是可访问性：internals.role 建立默认语义而不在 HTML 上喷属性，作者可覆盖、删除后默认还在；元素引用版的 aria 属性能跨影子根，绕开 id 引用失效。
[click] 记住适用限制和时间点：仅自治元素可用，Safari 16.4 补齐后全绿——这是组件从展示件晋级表单控件的分水岭。
-->

---
layout: default
---

# 框架互操作：差异只来自两个决定

<div class="mini-note mt-1">框架渲染 <code>&lt;my-el foo="…"&gt;</code> 时要决定：foo 设 attribute（只能字符串）还是 property（任意类型）？能否声明式监听 <code>CustomEvent</code>？——custom-elements-everywhere 测的就是这两件事。</div>

<table class="decision-table mt-4">
  <thead><tr><th>框架</th><th>结论（核于 2026-07）</th><th>要点</th></tr></thead>
  <tbody>
    <tr v-click><td><strong>Vue</strong></td><td>满分</td><td>智能分配 + <code>.prop</code>/<code>.attr</code> 修饰符；需配 <code>isCustomElement</code>；还能 <code>defineCustomElement()</code> 反向输出</td></tr>
    <tr v-click><td><strong>Angular</strong></td><td>满分</td><td><code>[prop]</code> 绑 property、<code>(event)</code> 听任意事件；需 <code>CUSTOM_ELEMENTS_SCHEMA</code></td></tr>
    <tr v-click><td><strong>React 19+</strong></td><td>完整支持</td><td>2024 末关键变化：属性智能分配 + 可声明式监听自定义事件</td></tr>
    <tr v-click><td><strong>React ≤ 18</strong></td><td>有坑</td><td>props 一律序列化为 attribute（对象变 <code>"[object Object]"</code>）；事件只能 ref 手动 <code>addEventListener</code></td></tr>
  </tbody>
</table>

<div v-click class="takeaway mt-4">
  组件作者侧的最大公约数：对外事件 <code>bubbles + composed</code>、事件名全小写；富数据走 property、简单标量镜像成 attribute 并保持同步。
</div>

<!--
框架互操作曾是 Web Components 名声最差的一块，但差异的来源其实只有两个决定：绑定值设 attribute 还是 property——attribute 只能是字符串，对象设错了组件拿到的就是 "[object Object]"；以及框架的事件语法能不能听到组件 dispatch 的 CustomEvent。

[click] Vue 满分：按属性名是否存在于元素实例智能分配，还有 .prop、.attr 修饰符显式指定；工程上要配 isCustomElement 告诉编译器带连字符的标签不是 Vue 组件；Vue 甚至能反向输出——defineCustomElement 把 Vue 组件编译成标准自定义元素。
[click] Angular 满分：方括号绑 property、圆括号听任意事件，天生契合，加个 CUSTOM_ELEMENTS_SCHEMA 即可。
[click] React 19 是 2024 年末的关键转折：属性智能分配、自定义事件可声明式监听。
[click] 但 React 18 及之前的存量项目仍要留意：props 全序列化成 attribute、事件只能 ref 手动挂。
[click] 组件作者能做的是取最大公约数：事件两开关全开、名字全小写；富数据走 property、简单标量镜像 attribute 并保持同步。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 该不该用：场景决策

::left::

### 适合

<div class="rule-stack mt-2">
  <div v-click class="rule tone-green"><strong>跨框架组件库 / 设计系统</strong><span>一套产物同时服务 Vue、React、Angular 团队</span></div>
  <div v-click class="rule tone-green"><strong>微前端 / 嵌入第三方页面的挂件</strong><span>评论框、客服气泡——宿主页面 CSS 再乱也砸不进来</span></div>
  <div v-click class="rule tone-green"><strong>长生命周期项目</strong><span>标准标签不随框架世代更替报废</span></div>
</div>

::right::

### 不适合 / 要绕开

<div class="rule-stack mt-2">
  <div v-click class="rule tone-amber"><strong>单一框架业务应用内部</strong><span>框架组件在响应式、状态、模板表达力上更顺手——不必为用而用</span></div>
  <div v-click class="rule tone-amber"><strong>全局样式要随意贯通</strong><span>没设计变量/<code>::part()</code> 开口时会处处受阻</span></div>
  <div v-click class="rule tone-red"><strong>裸写大型组件库</strong><span>属性反射、模板更新全是手工样板——上 Lit（约 5KB，产物仍是标准元素）</span></div>
</div>

<div v-click class="col-span-2 takeaway mt-4">
  一句话选型：<strong>多框架 / 多团队 / 长生命周期，或嵌入式挂件 → Web Components（工程上配 Lit）</strong>；单框架业务内部 → 框架组件。
</div>

<!--
技术边界都讲完了，最后回到选型判断。

[click] 跨框架组件库和设计系统是主战场：一套产物同时服务多个技术栈的团队。
[click] 微前端和嵌入第三方页面的挂件：Shadow DOM 保证宿主页面的样式再乱也砸不进来。
[click] 长生命周期项目：标准标签是"防框架报废"层。

[click] 反过来，单一框架业务应用的内部组件没必要为用而用，框架组件更顺手。
[click] 重度依赖全局样式贯通、又不想设计样式开口的场景会觉得处处受阻。
[click] 还有一条工程建议：裸写原生 API 样板太多，生产级组件库的主流选择是 Lit 这类轻封装——大约 5KB，产物仍是标准自定义元素，不是运行时锁定。
[click] 一句话记住这页：跨框架、多团队、长周期、嵌入式挂件选 Web Components；单框架业务内部用框架组件。
-->

---
layout: default
---

# 易错点 TOP 8：先在这里踩一遍

<div class="grid grid-cols-2 gap-3 mt-4">
  <div v-click class="signal signal-bad"><carbon:warning-alt /><span><strong><code>:host</code> 忘设 display</strong>——自定义元素默认 <code>inline</code>，宽高布局"莫名失效"</span></div>
  <div v-click class="signal signal-bad"><carbon:warning-alt /><span><strong><code>CustomEvent</code> 忘开两开关</strong>——<code>bubbles + composed</code>，组件事件"外面听不到"头号嫌疑</span></div>
  <div v-click class="signal signal-bad"><carbon:warning-alt /><span><strong>忘声明 <code>observedAttributes</code></strong>——<code>attributeChangedCallback</code> 静默不跑的第一原因</span></div>
  <div v-click class="signal signal-bad"><carbon:warning-alt /><span><strong><code>connectedCallback</code> 当"只跑一次"</strong>——移动元素会再触发，监听器重复挂</span></div>
  <div v-click class="signal signal-bad"><carbon:warning-alt /><span><strong>直接 <code>appendChild(tpl.content)</code></strong>——模板被掏空，第二个实例空白；先 <code>cloneNode(true)</code></span></div>
  <div v-click class="signal signal-bad"><carbon:warning-alt /><span><strong>押注 <code>is=""</code></strong>——Safari 永不支持；重复 <code>define()</code> 也抛错，先 <code>get()</code> 判存在</span></div>
  <div v-click class="signal signal-bad"><carbon:warning-alt /><span><strong><code>::slotted()</code> 选后代/文本</strong>——只能选中被分发内容的<strong>顶层元素</strong></span></div>
  <div v-click class="signal signal-bad"><carbon:warning-alt /><span><strong>水合时盲目 <code>attachShadow()</code></strong>——声明式根被清空，SSR 成果丢失；先查 <code>internals.shadowRoot</code></span></div>
</div>

<!--
把散在各页的坑收成一张清单，按报障频率排序。

[click] 排第一的永远是 :host 忘设 display——自定义元素默认 inline，影子树里写好的宽高布局全部失效，九成新手都在这里卡过。
[click] 第二是 CustomEvent 忘开 bubbles 和 composed，组件事件静音。
[click] 第三是忘声明 observedAttributes，回调静默不跑。
[click] connectedCallback 可多次触发，挂监听器要幂等。
[click] template 的 content 必须深克隆，直接 append 会掏空模板。
[click] is 属性是跨浏览器死路；同名重复 define 抛 NotSupportedError，HMR 场景先 get 判存在。
[click] slotted 只能选顶层被分发元素，选不到后代和文本。
[click] 水合时先查已有影子根再决定要不要自建，盲目 attachShadow 等于扔掉服务端渲染成果。
-->

---
layout: center
class: summary-slide
---

# 带走四个判断

<div class="summary-grid mt-8">
  <div><span>01</span><strong>选型看场景</strong><small>跨框架 / 挂件 / 长周期选 Web Components；单框架业务别为用而用</small></div>
  <div><span>02</span><strong>封装是硬边界</strong><small>主题定制走正门：CSS 变量管"值"、::part() 管"块"</small></div>
  <div><span>03</span><strong>对外事件两开关</strong><small>bubbles + composed 缺一不可，事件名全小写</small></div>
  <div><span>04</span><strong>短板已补齐</strong><small>SSR 用声明式 Shadow DOM，表单用 ElementInternals，重名等 Scoped Registries</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components" target="_blank"><carbon:book /> MDN 指南</a>
  <a href="https://web.dev/articles/declarative-shadow-dom" target="_blank"><carbon:document /> DSD 权威解读</a>
  <a href="https://custom-elements-everywhere.com/" target="_blank"><carbon:checkmark-outline /> 框架互操作评分</a>
  <a href="https://github.com/WICG/webcomponents" target="_blank"><carbon:logo-github /> WICG 提案仓库</a>
</div>

<!--
最后四句话复盘。

第一，选型看场景：Web Components 的主战场是框架管不到的地方——跨框架交付、微前端、嵌入第三方页面；单框架业务内部直接用框架组件。

第二，封装是浏览器级硬边界，主题定制不要硬闯，走 CSS 变量和 part 这两个正门。

第三，对外事件 bubbles 和 composed 两个开关缺一不可，这是最常见的静音坑。

第四，历史短板都已补齐：SSR 有声明式 Shadow DOM，表单有 ElementInternals，微前端重名有 Scoped Registries——2026 年"能不能用"已经不是问题，要想清楚的是"该不该用"。

四个资源：MDN 是三篇官方指南入口，web.dev 那篇是声明式 Shadow DOM 的权威解读，custom-elements-everywhere 看各框架实测得分，WICG 仓库跟进提案演进。
-->
