---
theme: seriph
layout: cover
title: 跨上下文通信
info: |
  浏览器里主文档、iframe、弹窗、Worker、同源多标签页各有独立全局与事件循环，不共享变量，只能靠「传消息」通信。本讲讲透 postMessage / MessageChannel / BroadcastChannel / Web Locks 四件标准 API，以及跨源通信的两条安全铁律。

  Learn more at [MDN Channel Messaging API](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark">MSG</div>

# 跨上下文通信

## 让隔离的执行环境，在明确知道对方是谁的前提下安全交换数据

<div class="cover-meta">
  <span>WHATWG HTML · Web messaging</span>
  <span>postMessage · MessageChannel · BroadcastChannel · Web Locks</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API" target="_blank" class="slidev-icon-btn" aria-label="MDN 文档">
    <carbon:document />
  </a>
  <a href="https://github.com/whatwg/html" target="_blank" class="slidev-icon-btn" aria-label="whatwg/html GitHub">
    <carbon:logo-github />
  </a>
</div>

<!--
这不是四个 API 的语法罗列。一个网页运行时往往有多个 JavaScript 执行环境——主文档、iframe、弹窗、Worker、同源多标签页——它们各有独立全局对象与事件循环，内存互不相通，唯一的桥梁就是「传消息」。

主线三条：先建立「跨上下文」的心智与四机制的生态位；再逐个讲 postMessage 跨源与它的两条安全铁律、MessageChannel 私有管道、BroadcastChannel 广播；中间有一页真实的 BroadcastChannel 交互实验，现场看广播如何跨实例流动、又为什么不回发给自己。最后讲多标签页选主与选型。
-->

---
layout: default
---

# 什么是「跨上下文」：一页之内的多个执行环境

<div class="grid grid-cols-2 gap-4 mt-5">
  <div v-click class="fact"><strong>主文档 ↔ <code>&lt;iframe&gt;</code></strong><span>嵌入的另一份文档，常是跨源第三方：支付、登录、地图、富文本编辑器</span></div>
  <div v-click class="fact"><strong>主文档 ↔ <code>window.open</code> 弹窗</strong><span>被打开的窗口有 <code>window.opener</code> 指回来，OAuth 弹窗登录的骨架</span></div>
  <div v-click class="fact"><strong>主文档 ↔ Web Worker</strong><span>后台线程，无 DOM，与主线程只能靠 postMessage 往来</span></div>
  <div v-click class="fact"><strong>同源的多个标签页 / 窗口</strong><span>用户开了好几个你的页面，要同步登录态、主题、购物车</span></div>
</div>

<div v-click class="takeaway mt-6">
  同源策略封死「跨源直接读对方变量 / DOM」，哪怕同源、跨标签页也没有共享内存——浏览器于是提供一组<strong>受控消息通道</strong>。
</div>

<!--
第一张心智图最重要：一个网页运行时不止一个执行环境。

[click] 主文档与 iframe，iframe 可能同源也可能跨源，第三方嵌入几乎都是跨源 iframe。
[click] 主文档与 window.open 弹窗，弹窗里 window.opener 指回打开它的窗口。
[click] 主文档与 Web Worker，后台线程没有 DOM，只能靠 postMessage。
[click] 还有同源的多个标签页，它们之间要同步状态。
[click] 关键：这些环境内存互不相通。同源策略堵死了跨源直接访问，跨标签页也没有共享内存，所以唯一手段是传消息，浏览器提供的正是一组受控通道。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# 四种机制，各占一个生态位

::left::

<div class="grid grid-cols-1 gap-3">
  <div v-click class="fact tone-blue" style="border-left-color:#3178c6"><strong><code>window.postMessage</code></strong><span>点对点 · <strong>可跨源</strong> · iframe / 弹窗 / Worker 通信的基石，也是头号安全面</span></div>
  <div v-click class="fact" style="border-left-color:#17875d"><strong><code>MessageChannel</code> / <code>MessagePort</code></strong><span>点对点私有管道 · 把一端转移给 Worker / 子框架建直连</span></div>
  <div v-click class="fact" style="border-left-color:#b76e00"><strong><code>BroadcastChannel</code></strong><span>一对多广播 · <strong>仅同源</strong> · 多标签同步：登出 / 主题 / 数据失效</span></div>
  <div v-click class="fact" style="border-left-color:#c33a46"><strong>Web Locks（<code>navigator.locks</code>）</strong><span>协调 / 选主 · <strong>不传数据</strong> · 只让一个标签页干活</span></div>
</div>

::right::

<div class="rule-stack mt-1">
  <div v-click class="rule tone-blue"><strong>跨源 / 跨文档点对点</strong><span>只有 postMessage 能跨过同源策略</span></div>
  <div v-click class="rule tone-green"><strong>要私有双向管道 / 交端口给 Worker</strong><span>MessageChannel</span></div>
  <div v-click class="rule tone-amber"><strong>同源「一处改、处处变」</strong><span>BroadcastChannel</span></div>
  <div v-click class="rule tone-red"><strong>多标签「只让一个干活」</strong><span>Web Locks 选主</span></div>
</div>

<!--
把四机制放到一张生态位图上，各占一格、不重叠。

[click:4] 左边四件：postMessage 是唯一能跨源的点对点通道；MessageChannel 给你一条私有专线，还能把端口转移出去建直连；BroadcastChannel 是同源一对多广播；Web Locks 不传数据，只做协调和选主。

[click:4] 右边是选型顺序：先问对端是不是跨源，是就只能用 postMessage；要私有管道或把通信端交给 Worker，叠 MessageChannel；要同源处处同步用 BroadcastChannel；要在多个标签页里选出唯一负责人用 Web Locks。后面逐个展开。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# 第一个闭环：postMessage 跨源点对点

::left::

```js
// 父页面（源 https://parent.example）
const iframe = document.querySelector("iframe");

// 等 iframe load 再发，否则对方还没挂监听
iframe.addEventListener("load", () => {
  // 第二参数 targetOrigin：写死子框架的源
  iframe.contentWindow.postMessage(
    { type: "greet", text: "你好" },
    "https://child.example",
  );
});
```

::right::

```js
// 子框架（源 https://child.example）
window.addEventListener("message", (event) => {
  // 头号安全点：先校验来源，非白名单丢弃
  if (event.origin !== "https://parent.example") return;
  // event.source 回复，event.origin 回填 targetOrigin
  event.source.postMessage({ type: "ack" }, event.origin);
});
```

<div v-click class="takeaway mt-3">
  <strong>发</strong> <code>目标window.postMessage(数据, targetOrigin)</code> · <strong>收</strong> 给自己 <code>window</code> 挂 <code>message</code>，数据在 <code>event.data</code> · <strong>回</strong> 用 <code>event.source</code> + <code>event.origin</code>。
</div>

<!--
一个可直接运行的最小闭环：父页面向 iframe 发消息，iframe 校验来源后回复。

左边父页面：拿到 iframe.contentWindow 引用，等 load 事件再发首条消息——发太早子框架脚本还没执行、监听未就绪，消息直接丢。第二参数 targetOrigin 写死子框架的源。

右边子框架：给自己的 window 挂 message 监听，第一行就校验 event.origin，非白名单直接 return。回复用 event.source——它是对方 window 的引用——targetOrigin 回填 event.origin，天然打回正确对端。

[click] 三件事记牢：发是目标窗口点 postMessage 加 targetOrigin；收是挂 message 监听、数据在 event.data；回是 event.source 加 event.origin。
-->

---
layout: default
---

# 两条安全铁律：写死 targetOrigin + 校验 origin

<div class="grid grid-cols-2 gap-5 mt-3">
  <div class="rule tone-red"><strong>铁律① 发送端：<code>targetOrigin</code> 别用 <code>*</code> 传敏感数据</strong><span>恶意站点可在你不知情时改目标窗口 location 截获数据——令牌 / 个人数据必须写死对方确切的源</span></div>
  <div class="rule tone-green"><strong>铁律② 接收端：先校验 <code>event.origin</code>（头号安全点）</strong><span>每条消息都可能来自任何窗口——非白名单一律丢弃；不收外站消息就干脆别挂监听</span></div>
</div>

<div class="boundary-stack mt-5" style="max-width:660px;margin-inline:auto">
  <div v-click class="boundary external"><carbon:close /> 任意窗口（含 <code>https://evil.example</code>）都能给你发消息</div>
  <carbon:arrow-down />
  <div v-click class="boundary check"><carbon:security /> <code>if (event.origin !== "https://trusted.example") return;</code></div>
  <carbon:arrow-down />
  <div class="grid grid-cols-2 gap-3 w-full">
    <div v-click class="boundary external" style="justify-content:center"><carbon:close /> 非白名单 → 丢弃</div>
    <div v-click class="boundary trusted" style="justify-content:center"><carbon:checkmark /> 白名单 → 再验结构后处理</div>
  </div>
</div>

<!--
整套 API 最重要的就是这两行，反复强调。

铁律一，发送端：targetOrigin 匹配 scheme host port，必须精确相等。MDN 原文说，恶意站点可以在你不知情时改变目标窗口的地址，从而截获用 postMessage 发送的数据。你以为在跟 secure 通信，那个窗口可能已被导航到 evil，用星号就等于把 token 送给攻击者。只有 data 这类不透明源不得已才用星号，且不传敏感数据。

铁律二，接收端：收到的每条消息都可能来自任何窗口。

[click] 图示：任何窗口，包括 evil，都能给你发消息。
[click] 所以第一行就是校验 origin 的闸门。
[click:2] 非白名单直接丢弃；只有白名单通过——而且通过后还要再验消息结构，别把 event.data 直接塞进 innerHTML 或 eval，否则被信任站点的一个 XSS 就顺着消息链变成你的 XSS。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# 两种经典拓扑：`<iframe>` 与 `window.open` 弹窗

::left::

### 父页面 ↔ `iframe.contentWindow`

```js
// 父：iframe.contentWindow 拿子窗口引用
iframe.contentWindow.postMessage(
  { type: "config", theme: "dark" },
  "https://widget.example",
);
// 子：event.source 即父窗口，用它回复
event.source.postMessage(
  { type: "config-applied" },
  event.origin,
);
```

::right::

### 主窗口 ↔ 弹窗（`window.opener`）

```js
// 主窗口：持有 window.open 返回值
const popup = window.open(url, "login");

// 弹窗（认证完成）→ 回传结果给主窗口
if (window.opener) {
  window.opener.postMessage(
    { type: "auth-result", token },
    "https://host.example", // 绝不用 "*" 传 token
  );
}
```

<div v-click class="mini-note mt-2">这正是 OAuth「弹窗登录」的经典骨架：弹窗用 <code>window.opener.postMessage</code> 带确切 <code>targetOrigin</code> 把结果送回。</div>

<!--
两种最常见拓扑，接口来源不同、安全规则一致。

左边父子 iframe：父页面通过 iframe.contentWindow 拿子窗口引用发消息，子框架收到后用 event.source——也就是父窗口——回复。时序要点是父页面要等 iframe 的 load 再发首条，或者让子框架先发一条 ready 握手，更稳。

右边弹窗：window.open 打开的弹窗里，window.opener 指回打开它的主窗口；主窗口持有 window.open 的返回值。弹窗完成认证后用 window.opener.postMessage 把结果回传。

[click] 这就是 OAuth 弹窗登录的骨架。注意回传 token 时 targetOrigin 一定写死主窗口的源，绝不用星号。
-->

---
layout: default
---

# 能传什么：结构化克隆与 transfer 零拷贝

<div class="grid grid-cols-2 gap-4 mt-4">
  <div v-click class="fact" style="border-left-color:#17875d"><strong>能传（结构化克隆，比 JSON 强）</strong><span>原始值 / 对象 / 数组 / <code>Date</code> / <code>RegExp</code> / <code>Map</code> / <code>Set</code> / <code>ArrayBuffer</code> / <code>Blob</code> / <code>File</code> / <code>ImageBitmap</code> / <code>MessagePort</code></span></div>
  <div v-click class="fact" style="border-left-color:#c33a46"><strong>传不了（抛 <code>DataCloneError</code>）</strong><span><strong>函数</strong> / <strong>DOM 节点</strong> / 含方法的类实例——取回变普通对象、方法与原型全丢；只传纯数据，对端重建</span></div>
</div>

```js {1|2-3|5|all}
const buffer = new ArrayBuffer(64 * 1024 * 1024); // 64 MB
// 第三参数 transfer：列出要【移交所有权】的对象，几乎零成本
otherWindow.postMessage({ buffer }, "https://render.example", [buffer]);

console.log(buffer.byteLength); // 0：已移交，本上下文这个 buffer 失效
```

<div v-click class="signal signal-bad mt-3"><carbon:warning-alt /><span>移交后<strong>原上下文即失效</strong>——<code>ArrayBuffer</code> 变 <code>byteLength === 0</code>，port 变 neutered。这与 MessageChannel 转移 port 是同一套语义。</span></div>

<!--
message 参数走结构化克隆算法，比 JSON 强得多。

[click:2] 能传的：原始值、普通对象、数组、Date、Map、Set、ArrayBuffer、Blob、ImageBitmap、MessagePort 等，而且是深拷贝，对端拿到副本。传不了的：函数、DOM 节点、含方法的类实例，会抛 DataCloneError；含这些只能传纯数据、对端重建。

[click:3] 但大对象深拷贝很贵。Transferable 对象——ArrayBuffer、MessagePort、ImageBitmap、OffscreenCanvas——可以用第三参数 transfer 移交所有权，零拷贝。

[click] 代价是移交后原上下文里该对象立即失效，ArrayBuffer 变成 byteLength 为 0。这套「转移即失效」的语义，下面 MessageChannel 转移 port 时会再遇到一次。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# MessageChannel：一对 port 与 `start()` 坑

::left::

```js
// 一次造出一对【用管道连通】的端口
const { port1, port2 } = new MessageChannel();

port2.onmessage = (e) => {
  console.log("port2 收到：", e.data);
};

// port1 发 —— 只会到 port2，不撞全局 onmessage
port1.postMessage("你好");
// port.postMessage 无 targetOrigin：管道已私有
```

::right::

<div class="mini-note mb-2">端口消息队列<strong>初始禁用</strong>，启用有两种方式、行为不同：</div>

```js
// A：赋值 onmessage —— 隐式 start()，直接能收
port.onmessage = (e) => handle(e.data);

// B：addEventListener —— 必须显式 start()
port.addEventListener("message", (e) => handle(e));
port.start(); // ⭐ 漏了它：一条都收不到，且不报错
```

<div v-click class="signal signal-bad mt-3"><carbon:warning-alt /><span>「代码看着没错、一条消息都收不到、又不报错」的经典排查点——用 <code>addEventListener</code> 风格时检查是否漏了 <code>start()</code>。</span></div>

<!--
window.postMessage 的所有消息都撞在同一个 window.onmessage 上，像在公共广场喊话。MessageChannel 给你一条专线。

左边：new MessageChannel 一次造出一对用管道连通的 port，port1 和 port2。一端发、另一端收，消息只在这对 port 间流动。注意 port.postMessage 没有 targetOrigin 参数——管道已经是私有专线，不需要再限定收方源。

右边是本页头号坑：port 的消息队列初始是禁用的。启用有两种方式，行为不同：方式 A 赋值 onmessage，隐式调用 start，直接能收；方式 B 用 addEventListener，必须手动 port.start，否则回调一次都不触发。

[click] 这就是「代码没错、收不到、还不报错」的经典排查点。记牢：addEventListener 风格一定要配 start。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# 转移 port：建立真正的跨上下文直连

::left::

```js
// 父页面：造通道，留 port1，把 port2 转移给 iframe
const channel = new MessageChannel();
channel.port1.onmessage = (e) =>
  console.log("父经专线收到：", e.data);

iframe.addEventListener("load", () => {
  // 转移这一次仍是普通 postMessage：安全规则照旧
  iframe.contentWindow.postMessage(
    "端口交付", "https://widget.example",
    [channel.port2], // 第三参数 transfer 放 port2
  );
});
```

::right::

```js
// iframe 侧：从 event.ports[0] 取转移来的 port
window.addEventListener("message", (event) => {
  if (event.origin !== "https://host.example") return;
  const port = event.ports[0]; // 拿到 port2
  port.onmessage = (e) => {     // 赋值即隐式 start
    port.postMessage({ type: "pong" });
  };
});
```

<div v-click class="signal signal-bad mt-3"><carbon:warning-alt /><span><code>MessagePort</code> 是 Transferable：<strong>转移后原上下文里那个 port 立即失效（neutered）</strong>，只能在新宿主用；一个 port 同一时刻只属一个上下文。</span></div>

<!--
单页内的一对 port 意义不大，MessageChannel 的威力在于把一端转移给另一个上下文。

左边父页面：造通道，自己留 port1，用一次 window.postMessage 把 port2 放进第三参数 transfer 列表转移给 iframe。关键：转移这一次仍然是普通的跨源 postMessage，targetOrigin 要写明、接收端要校验 origin，安全规则一点不少。握手完成后，专线上的后续消息才不必再带 targetOrigin。

右边 iframe：转移来的 port 不在 event.data 里，在 event.ports 数组里，按下标 event.ports[0] 取出来，挂 onmessage 就能直连。

给 Worker 转移时签名略不同——worker.postMessage 的 transfer 是第二参数，没有 targetOrigin。把两端分别交给两个不同的 Worker，它们就能绕过主线程直连。

[click] 转移的本质是移交所有权：port 一经发送，原上下文即 neutered、不可再用，和转移 ArrayBuffer 完全一致。
-->

---
layout: default
---

# BroadcastChannel：同源多上下文一对多广播

<div class="grid grid-cols-[1.05fr_.95fr] gap-6 mt-3">

```js {1-2|4-7|9-10|all}
// 自带 senderId 溯源、type 分发——广播总线的标准约定
const SELF_ID = crypto.randomUUID();
const bc = new BroadcastChannel("app-sync");

bc.onmessage = (event) => {
  const { type, payload } = event.data;
  if (type === "logout") forceLogout();
};

// 广播给同源【所有其他】订阅者，无 targetOrigin
bc.postMessage({ senderId: SELF_ID, type: "logout" });
```

<div class="flex flex-col gap-3">
  <div v-click class="fact" style="border-left-color:#b76e00"><strong>不回发给自己</strong><span>WHATWG「Remove source from destinations」——发送者自己的实例收不到这条，天然省掉回声判重</span></div>
  <div v-click class="fact" style="border-left-color:#c33a46"><strong>无 sender 标识、无语义</strong><span>消息不带「谁发的 / 什么类型」——全靠 payload 自带 <code>senderId</code> / <code>type</code></span></div>
  <div v-click class="fact" style="border-left-color:#3178c6"><strong>仅同源同分区</strong><span>跨顶级站点被存储分区隔开，即便技术同源也不通</span></div>
</div>

</div>

<!--
从点对点专线转到同源一对多广播。很多状态需要在同源多标签间保持一致：一处登出、处处登出；一处切暗色、处处换肤。BroadcastChannel 就是为此而生的广播总线，三行代码：连到同名频道、挂 onmessage、postMessage 广播。

[click:3] 两个定义性特征最关键。第一，不回发给自己：WHATWG 的 postMessage 算法明确有一步「把发送者自己从投递列表移除」，所以你广播出去的只有别人收到，不用像 storage 那样费心区分是不是自己刚发的。第二，消息不带发送者身份、也不带语义，谁发的、什么类型全靠你往 payload 里塞 senderId 和 type。第三，只在同源同分区互通，跨站一律不通。

下一页现场看这两个特征——尤其是「不回发」。
-->

---
layout: default
class: lab-slide
---

# 交互实验：BroadcastChannel 广播总线

<BroadcastChannelLab />

<!--
这是真实的 BroadcastChannel。三个面板 A、B、C 各持有一个独立的 BroadcastChannel 实例，都连到同一个频道 bc-lab-demo，每个实例扮演一个模拟标签页。

现场演示：点面板 A 的「广播一条」，看 B 和 C 的日志里实时冒出「收到 A 井 1」的绿色条目——这就是同源广播跨实例流动。

关键看 A 自己：它只有一条蓝色的「发出 A 井 1」，绝不会出现「收到」——因为 WHATWG 算法把发送者自己的实例从投递列表里移除了，这就是「不回发给自己」。三个实例共处一页，恰好证明：不回发的是发送实例本身，别的实例照收。

这也解释了上一页主题切换的坑：因为自己收不到广播，本页要立即生效必须自己手动 apply，再广播给别人。组件在 onMounted 才建实例、onUnmounted 全部 close，顶层零 window，SSR 安全。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# 对比 storage 事件：广播总线 vs 存储副产物

::left::

<div class="flex flex-col gap-3 mt-1">
  <div class="rule tone-green"><strong><code>BroadcastChannel</code></strong><span>专为广播设计的消息总线</span></div>
  <div v-click class="fact" style="border-left-color:#17875d"><strong>任意结构化数据</strong><span>直接传对象，无需 <code>JSON.stringify</code>，不落盘</span></div>
  <div v-click class="fact" style="border-left-color:#17875d"><strong>不回发给自己</strong><span>发送实例收不到，判重省心</span></div>
</div>

::right::

<div class="flex flex-col gap-3 mt-1">
  <div class="rule tone-amber"><strong>storage 事件</strong><span><code>localStorage</code> 变更的副产物</span></div>
  <div v-click class="fact" style="border-left-color:#b76e00"><strong>仅字符串</strong><span>要读回 <code>event.newValue</code>，复杂数据得手动序列化</span></div>
  <div v-click class="fact" style="border-left-color:#b76e00"><strong>写入页自身不触发</strong><span>老浏览器兜底方案，API 属 Web Storage 叶</span></div>
</div>

<div v-click class="takeaway mt-4">
  纯广播、无共享状态、代码最短 → <strong><code>BroadcastChannel</code></strong>（2022 起 Baseline，新项目首选）；只为兼容很老的浏览器 → storage 事件兜底。
</div>

<!--
BroadcastChannel 常被拿来和 storage 事件比，因为两者都能做多标签同步，但本质不同。

左边 BroadcastChannel 是专为广播设计的消息总线：任意结构化数据直接传对象、不落盘，而且不回发给自己。

右边 storage 事件是 localStorage 变更的副产物：只能传字符串，要从 event.newValue 读回值；而且写入页自己不触发，这既是特性也是坑。它的完整 API 属于 Web Storage 叶。

[click] 一句话取舍：新项目纯同步就用 BroadcastChannel，2022 年起已 Baseline；只有要兼容很老的浏览器，才退回 storage 事件兜底。别再用 storage 的心智去套 BroadcastChannel、退回 JSON.stringify。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# 对比 SharedWorker：去中心化 vs 中心化

::left::

<div class="flex flex-col gap-3 mt-1">
  <div class="rule tone-green"><strong><code>BroadcastChannel</code></strong><span>去中心化广播总线</span></div>
  <div v-click class="fact" style="border-left-color:#17875d"><strong>无共享状态</strong><span>只扩散消息，谁都不持有中心状态</span></div>
  <div v-click class="fact" style="border-left-color:#17875d"><strong>代码最短</strong><span>连同名频道即入网，三行搞定</span></div>
</div>

::right::

<div class="flex flex-col gap-3 mt-1">
  <div class="rule tone-blue"><strong><code>SharedWorker</code></strong><span>中心化单实例后台线程</span></div>
  <div v-click class="fact" style="border-left-color:#3178c6"><strong>可持共享状态</strong><span>多页连到同一后台实例，状态集中在 worker 里</span></div>
  <div v-click class="fact" style="border-left-color:#3178c6"><strong>单一长连接复用</strong><span>一条 WebSocket 多页共享；Safari 支持曲折需核对</span></div>
</div>

<div v-click class="takeaway mt-4">
  要在多标签间<strong>共享一份状态或一条长连接</strong> → <code>SharedWorker</code>；纯广播、无中心状态 → <code>BroadcastChannel</code>。API 属 Web Workers 叶。
</div>

<!--
第二个对比是 SharedWorker，两者的差别是去中心化对中心化。

左边 BroadcastChannel 是去中心化的总线：没有谁持有中心状态，只负责把消息扩散出去，代码最短。

右边 SharedWorker 是中心化的单实例后台：多个页面连到同一个后台实例，状态可以集中在 worker 里，一条 WebSocket 多页复用，天然「一份连接多页用」。但它的浏览器支持历史曲折，尤其 Safari，用前要核对；API 属于 Web Workers 叶。

[click] 取舍：只是广播状态用 BroadcastChannel；要在多页间共享一份状态或一条长连接，才上 SharedWorker。下一页会看到，其实用「Web Locks 选主加普通 Worker 加广播」也能替代 SharedWorker。
-->

---
layout: default
---

# Web Locks：多标签页选主（leader election）

<div class="grid grid-cols-[1.15fr_.85fr] gap-6 mt-3">

```js {1-3|5-6|8-10|all}
function becomeLeader(runAsLeader) {
  navigator.locks.request("app-leader", () => {
    // 只有一个标签页能进来 —— 它就是 leader
    runAsLeader(); // 连 WebSocket / 跑轮询 / 后台同步

    // 返回永不 resolve 的 Promise：锁一直攥在手里
    // = 一直当 leader；本页崩溃 / 关闭锁【自动释放】
    return new Promise(() => {});
  });
}
```

<div class="flex flex-col gap-3">
  <div v-click class="fact" style="border-left-color:#c33a46"><strong>永不 resolve = 一直持有</strong><span>锁在<strong>回调返回时</strong>释放；回调返回永不 resolve 的 Promise，就一直是 leader</span></div>
  <div v-click class="fact" style="border-left-color:#17875d"><strong>异常自动释放</strong><span>leader 崩溃 / 关闭，浏览器自动释放锁，排队者顺位补位</span></div>
  <div v-click class="fact" style="border-left-color:#3178c6"><strong>比自造心跳锁健壮</strong><span>免去时钟漂移 / 死锁 / 僵尸持有者一堆边界</span></div>
</div>

</div>

<!--
BroadcastChannel 解决广播，但解决不了「谁负责发」。如果每个标签页都连一条 WebSocket、都跑一份轮询，就是 N 倍浪费和数据打架。Web Locks 让多个标签页协调出唯一的负责人。

看代码：navigator.locks.request 抢同名锁 app-leader，同源里只有一个标签页能进到回调——它就是 leader。

[click:2] 选主的诀窍是让回调永远不返回：回调返回一个永不 resolve 的 Promise，锁就一直被这个标签页持有，它就一直是 leader。因为锁是在回调返回时才释放的。

[click:2] 关键优势是异常自动释放：leader 被关闭或崩溃，浏览器自动释放锁，正在排队 request 的其他标签页里会有一个立刻拿到、接任 leader。这比用 localStorage 自造心跳锁健壮得多——自造锁要处理时钟漂移、死锁、僵尸持有者一堆边界。注意 Web Locks 仅 HTTPS 安全上下文可用，localhost 视作安全。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# Web Locks 进阶：mode / ifAvailable / steal / signal

::left::

<table class="decision-table">
  <thead><tr><th>选项</th><th>含义</th></tr></thead>
  <tbody>
    <tr v-click><td><code>mode</code></td><td><code>exclusive</code>（默认，仅一个持有）/ <code>shared</code>（多个并行，读写者的「读」）</td></tr>
    <tr v-click><td><code>ifAvailable</code></td><td>拿不到<strong>不排队</strong>，回调立即以 <code>null</code> 调用</td></tr>
    <tr v-click><td><code>steal</code></td><td>抢占：释放同名已持有锁并夺过来（慎用，打断原持有者）</td></tr>
    <tr v-click><td><code>signal</code></td><td><code>AbortSignal</code>：配 <code>setTimeout</code> 给锁请求做超时 / 取消</td></tr>
  </tbody>
</table>

::right::

```js
// ifAvailable：抢不到就当 follower，不阻塞
navigator.locks.request(
  "app-leader",
  { ifAvailable: true },
  (lock) => {
    if (lock === null) {
      setupFollower(); // 已有 leader
      return;
    }
    return new Promise(() => {}); // 我是 leader
  },
);
```

<div v-click class="mini-note mt-2"><code>navigator.locks.query()</code> 返回锁状态快照 <code>{ held, pending }</code>，调试选主必备。</div>

<!--
Web Locks 的 request 还有四个进阶选项。

mode：exclusive 是默认，同名锁只能一个持有；shared 可多个同时持有，用来做读者写者模式，多个读并行、写独占。

ifAvailable：拿不到锁不排队，回调立即以 null 调用——用来「抢不到就当自己不是 leader」，这是选主里最常用的。

steal：抢占，释放同名已持有的锁并夺过来、绕过排队，用于原 leader 疑似卡死时强制换主，慎用，会打断对方临界区。

signal：传 AbortSignal，配 AbortController 加 setTimeout 给锁请求做超时或取消。

[click] 右边就是 ifAvailable 的典型写法：lock 为 null 就 setupFollower 立即返回，不为 null 就返回永不 resolve 的 Promise 当 leader。query 方法返回锁状态快照，调试选主为什么拿不到时必备。
-->

---
layout: default
---

# 组合拳：Web Locks 选主 + BroadcastChannel 分发

<div class="grid grid-cols-[1.25fr_.75fr] gap-6 mt-3">

```js {1|3-6|7-12|all}
const bc = new BroadcastChannel("realtime");

// 每个标签页都竞选；ifAvailable 拿不到就当 follower
navigator.locks.request("rt-leader", { ifAvailable: true }, (lock) => {
  if (lock === null) {                 // follower：只听广播
    bc.onmessage = (e) => applyRealtime(e.data);
    return;
  }
  const ws = new WebSocket("wss://push.example"); // leader：唯一连接
  ws.onmessage = (e) => {
    applyRealtime(e.data);  // 不回发给自己，leader 也要消费
    bc.postMessage(e.data); // 再分发给其余标签页
  };
  return new Promise(() => {}); // 永不 resolve = 持锁当 leader
});
```

<div class="flex flex-col gap-3">
  <div v-click class="fact" style="border-left-color:#c33a46"><strong>全站只有一条 WS</strong><span>leader 持有；follower 零连接、纯靠广播消费</span></div>
  <div v-click class="fact" style="border-left-color:#17875d"><strong>leader 挂了自动补位</strong><span>某 follower 竞选接管连接</span></div>
</div>

</div>

<!--
这是多标签页架构的黄金搭档：用 Web Locks 选出唯一 leader，用 BroadcastChannel 把 leader 的成果广播给全体。

每个标签页都用 ifAvailable 参与竞选。抢不到锁的是 follower，只挂 bc.onmessage 听广播、不连 WebSocket。抢到锁的是 leader，连唯一一条 WebSocket，收到推送后先自己 applyRealtime，再 bc.postMessage 分发给其余标签页；最后返回永不 resolve 的 Promise 持锁当 leader。

[click:2] 这套组合彻底解决了「N 个标签页各连各的」：全站只有一条 WebSocket，其余标签页零连接、纯靠广播消费；leader 挂了，某个 follower 竞选补位、接管连接。

特别注意 leader 自己也要 applyRealtime——因为 BroadcastChannel 不回发给发送者自己，这正是前面那个特性在架构里的直接后果。
-->

---
layout: default
---

# 多标签页选型：一张表定方案

<table class="decision-table" style="font-size:0.78rem">
  <thead><tr><th>需求</th><th>首选</th><th>备选 / 兜底</th></tr></thead>
  <tbody>
    <tr v-click><td>同步状态（登出 / 主题 / 数据失效）</td><td><strong><code>BroadcastChannel</code></strong></td><td>storage 事件（老浏览器）· SW 转发（已用 SW）</td></tr>
    <tr v-click><td>共享一份状态 / 一条长连接</td><td><strong><code>SharedWorker</code></strong></td><td>Web Locks 选主 + 普通 Worker + 广播</td></tr>
    <tr v-click><td>只让一个标签页干活（连 WS / 轮询）</td><td><strong>Web Locks 选主</strong></td><td>——</td></tr>
    <tr v-click><td>选主 + 把成果发给全体</td><td><strong>Web Locks + <code>BroadcastChannel</code></strong></td><td><code>SharedWorker</code> 集中 + 广播</td></tr>
    <tr v-click><td>跨源（<code>&lt;iframe&gt;</code> / 弹窗）传数据</td><td><strong><code>postMessage</code></strong></td><td><code>postMessage</code> + <code>MessageChannel</code> 建专线</td></tr>
  </tbody>
</table>

<div v-click class="mini-note mt-4">「多标签页」其实混着两类问题：<strong>同步</strong>（fan-out 状态）用广播；<strong>选主 / 互斥</strong>（single-owner）用 Web Locks——别用一把锤子砸所有钉子。</div>

<!--
把多标签页的所有方案摆到一张选型表上。

[click:5] 同步状态首选 BroadcastChannel，老浏览器退回 storage 事件、已用 Service Worker 可以 clients.matchAll 转发。要共享一份状态或一条长连接用 SharedWorker，或者用 Web Locks 选主加普通 Worker 加广播替代。只让一个标签页干活用 Web Locks 选主。选主加分发就是上一页的黄金搭档。跨源传数据只能用 postMessage，要私有管道再叠 MessageChannel。

[click] 最后点透：多标签页其实混着两类不同问题——同步是 fan-out 状态、用广播；选主是 single-owner、用 Web Locks。别用一把锤子砸所有钉子。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# 典型场景：登出同步与主题切换

::left::

```js
// 场景一：登出同步 —— 一处登出，处处登出
function logout() {
  clearSession();
  bc.postMessage({ type: "logout", senderId: SELF_ID });
  location.href = "/login";
}
bc.onmessage = (e) => {
  if (e.data.type === "logout") {
    clearSession();
    location.href = "/login"; // 别的页跟着登出
  }
};
```

::right::

```js
// 场景二：主题切换 —— 广播新主题，实时换肤
function setTheme(theme) {
  localStorage.setItem("theme", theme); // 持久化
  applyTheme(theme);   // ⭐ 本页自己应用
  bc.postMessage({ type: "theme", theme, senderId: SELF_ID });
}
```

<div v-click class="signal signal-bad mt-3"><carbon:warning-alt /><span>场景二的关键：<strong>因为发送者收不到自己的广播，本页必须自己 <code>applyTheme</code></strong> 再广播给别人——「不回发」特性的直接后果。</span></div>

<!--
两个最典型的场景，都建立在 BroadcastChannel 上。

左边登出同步：一个页登出，清 session、广播一条 logout、跳登录页；其他页收到 logout 也清 session 跳登录。同源所有页一起登出。

右边主题切换：切主题时先 localStorage 持久化让新开的页读得到，然后本页自己 applyTheme，再广播给别人。

[click] 这里的关键细节，也是最容易忘的：因为发送者收不到自己的广播，本页必须自己 applyTheme，不能指望广播回来触发。这正是实验那页「不回发给自己」特性在实践中的直接后果。其他常见场景还有购物车、草稿同步、缓存失效通知、已在其他标签页打开的抢占提示。
-->

---
layout: default
---

# 易错点：三个招牌坑 + 清单

<div class="grid grid-cols-3 gap-4 mt-3">
  <div v-click class="signal signal-bad"><carbon:warning-alt /><span><strong>postMessage 不校验 <code>origin</code></strong>——任何窗口都能发消息，等于自开 XSS</span></div>
  <div v-click class="signal signal-bad"><carbon:warning-alt /><span><strong><code>MessagePort</code> 漏 <code>start()</code></strong>——<code>addEventListener</code> 风格一条都收不到、还不报错</span></div>
  <div v-click class="signal signal-bad"><carbon:warning-alt /><span><strong>选主回调提前返回</strong>——锁一释放 leader 秒卸任</span></div>
</div>

<div class="grid grid-cols-2 gap-3 mt-5">
  <div v-click class="fact"><strong>拿 <code>event.source</code> 当身份</strong><span>它只是回信地址——身份永远看 <code>event.origin</code></span></div>
  <div v-click class="fact"><strong>转移后还用原 port / buffer</strong><span>已 neutered / <code>byteLength</code> 0——转移前发完</span></div>
  <div v-click class="fact"><strong>以为 BroadcastChannel 收自己发的</strong><span>不会——本页状态自己手动应用再广播</span></div>
  <div v-click class="fact"><strong>自造 <code>localStorage</code> 心跳锁选主</strong><span>时钟 / 死锁 / 僵尸——用 Web Locks 自动释放</span></div>
</div>

<!--
把最常踩的坑集中过一遍。

[click:3] 先是三个招牌坑，各机制一个：postMessage 接收端不校验 origin，任何窗口都能发消息，等于自开 XSS 大门；MessagePort 用 addEventListener 却漏了 start，一条都收不到还不报错；选主回调写成会返回的 async，锁一释放 leader 就秒卸任，要返回永不 resolve 的 Promise。

[click:4] 再是四个高频误区：拿 event.source 当身份认证，其实它只是回信地址、身份永远看 origin；转移后还用原来的 port 或 ArrayBuffer，它们已经失效；以为 BroadcastChannel 会收到自己发的，不会，本页状态得自己手动应用；用 localStorage 自造心跳锁做选主，要处理时钟死锁僵尸一堆边界，用 Web Locks 的异常自动释放天然免这些坑。
-->

---
layout: default
---

# 四机制对比：一图收束

<table class="decision-table" style="font-size:0.76rem">
  <thead><tr><th>维度</th><th>postMessage</th><th>MessageChannel</th><th>BroadcastChannel</th><th>Web Locks</th></tr></thead>
  <tbody>
    <tr v-click><td>拓扑</td><td>点对点</td><td>点对点专线</td><td>一对多广播</td><td>协调 / 选主</td></tr>
    <tr v-click><td>跨源</td><td>✅</td><td>随宿主</td><td>❌ 仅同源</td><td>❌ 仅同源</td></tr>
    <tr v-click><td>收自己发的</td><td>视对端</td><td>视对端</td><td><strong>❌ 不回发</strong></td><td>——</td></tr>
    <tr v-click><td>传数据</td><td>克隆 + transfer</td><td>克隆 + transfer</td><td>克隆（无 transfer）</td><td>不传数据</td></tr>
    <tr v-click><td>招牌坑</td><td>不校验 <code>origin</code></td><td>漏 <code>start()</code></td><td>以为收自己发的</td><td>回调提前返回</td></tr>
    <tr v-click><td>Baseline</td><td>2015 起</td><td>2015-09 起</td><td>2022-03 起</td><td>2022-03 起 · HTTPS</td></tr>
  </tbody>
</table>

<!--
最后一张全景对比表，把四机制按六个维度收束。

[click:6] 拓扑：postMessage 和 MessageChannel 是点对点，后者是私有专线；BroadcastChannel 一对多广播；Web Locks 是协调选主、不传数据。跨源：只有 postMessage 直接可跨源，MessageChannel 随宿主，Broadcast 和 Web Locks 仅同源。收自己发的：只有 BroadcastChannel 明确不回发。传数据：postMessage 和 port 支持 transfer 零拷贝，Broadcast 只有克隆没有 transfer。招牌坑各记一个。Baseline：前两个 2015 就有，后两个 2022 起，Web Locks 还要求 HTTPS 安全上下文。这张表就是全讲的速查卡。
-->

---
layout: center
class: summary-slide
---

# 带走四个判断

<div class="summary-grid mt-6">
  <div><span>01</span><strong>跨源点对点 → postMessage</strong><small>写死 <code>targetOrigin</code> + 接收端第一行校验 <code>event.origin</code></small></div>
  <div><span>02</span><strong>私有管道 / 交端口给 Worker → MessageChannel</strong><small><code>addEventListener</code> 记得 <code>start()</code>；转移即失效</small></div>
  <div><span>03</span><strong>同源一对多广播 → BroadcastChannel</strong><small>不回发、无 sender：payload 自带 <code>type</code> / <code>senderId</code></small></div>
  <div><span>04</span><strong>只让一个标签页干活 → Web Locks 选主</strong><small>永不 resolve 的锁 = 一直当 leader，异常自动释放</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage" target="_blank"><carbon:document /> postMessage</a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API" target="_blank"><carbon:chat /> BroadcastChannel</a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API" target="_blank"><carbon:locked /> Web Locks</a>
  <a href="https://html.spec.whatwg.org/multipage/web-messaging.html" target="_blank"><carbon:book /> WHATWG Web messaging</a>
</div>

<!--
最后用四句话复盘全讲。

第一，跨源点对点用 postMessage，两条安全铁律焊死：发送端写死 targetOrigin、接收端第一行校验 event.origin。第二，要私有双向管道或把通信端交给 Worker 用 MessageChannel，addEventListener 风格记得 start，端口转移后即失效。第三，同源一对多广播用 BroadcastChannel，它不回发给自己、消息无身份，payload 自带 type 和 senderId。第四，多标签页里只让一个干活用 Web Locks 选主，永不 resolve 的锁就是一直当 leader，异常还会自动释放。

掌握这四条判断，再配合 storage、SharedWorker、Service Worker 的边界认知，多上下文通信的选型就有了稳定的基座。
-->
