---
theme: seriph
layout: cover
title: Web Workers API
info: |
  从主线程的单线程本质出发，建立 Web Worker 的消息传递心智：三类 worker 的定位、postMessage 与结构化克隆、Transferable 移交、OffscreenCanvas 与 Comlink 工程模式。

  Learn more at [MDN Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark">WW</div>

# Web Workers

## 把重活搬离主线程：真并行、不阻塞 UI 的后台线程

<div class="cover-meta">
  <span>WHATWG HTML 现行标准 · Web workers 章</span>
  <span>Dedicated · Shared · Transfer · Comlink</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API" target="_blank" class="slidev-icon-btn" aria-label="MDN Web Workers">
    <carbon:document />
  </a>
  <a href="https://github.com/whatwg/html" target="_blank" class="slidev-icon-btn" aria-label="whatwg/html GitHub">
    <carbon:logo-github />
  </a>
</div>

<!--
这一讲不做 API 目录。我们从一个事实出发：浏览器给每个页面只有一条主线程，它既要跑你的 JS、又要算布局绘制、还要响应输入。一段长同步计算堵住它，整个界面就冻结。

Worker 是标准给出的唯一解法——把 CPU 密集计算搬到后台线程，靠 postMessage 消息传递协作。口径基于 WHATWG HTML 现行标准的 Web workers 章，核于 2026 年 7 月：专用 worker 早已 Baseline，模块 worker 随 Firefox 114 补齐，OffscreenCanvas 2025 末进入 Baseline。边界声明：WASM 在 worker 里跑、Service Worker 的生命周期，本讲只点到链接，不展开。
-->

---
layout: default
---

# 主线程是单线程：一段同步计算能冻结整个 UI

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="fact"><strong>跑你的 JavaScript</strong><span>事件回调、计算、框架更新</span></div>
  <div class="fact"><strong>布局与绘制</strong><span>重排、重绘、合成上屏</span></div>
  <div class="fact"><strong>响应用户输入</strong><span>点击、滚动、键盘</span></div>
</div>

<div class="mini-note mt-3">三件事都在<strong>同一条主线程</strong>上排队——一段长同步计算堵住它，后面全被卡在后面。</div>

```js {1|2|3|all}
button.onclick = () => {
  const result = sortHugeArray(millionRecords); // 同步跑 300ms
  render(result); // 期间：按钮点不动、动画定格、滚动卡住
};
```

<div class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span><code>setTimeout</code> / <code>requestIdleCallback</code> 只是「延后」执行，跑起来照样在主线程、照样冻结</span>
</div>

<!--
这是理解 worker 的起点。主线程是单线程，这三类活轮流排队。

[click:3] 所以只要 JS 里出现一段长同步计算，比如 300ms 的排序或加密，这 300ms 里布局、绘制、输入响应全被堵死，用户体感就是「卡死了」。

关键澄清：setTimeout 和 requestIdleCallback 解决的是「什么时候跑」，不是「在哪条线程跑」——它们把计算推迟，真跑起来照样在主线程照样冻结。要真正并行、跑的时候主线程还能响应用户，只有一条路：搬到另一条线程，也就是 Worker。记住定位：worker 不让代码变快，是让重活不挡道。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# postMessage 心智模型：两个隔离世界之间的一扇门

::left::

```js {1-4|6-7|9-13|all}
// 主线程 main.js
const worker = new Worker(
  new URL("./echo.worker.js", import.meta.url),
  { type: "module" });

worker.postMessage({ type: "greet", name: "worker" }); // 发
worker.onmessage = (e) => console.log(e.data); // 收

// echo.worker.js —— 没有 window，全局是 self
self.onmessage = (e) => {
  if (e.data.type === "greet")
    self.postMessage(`你好，来自 ${e.data.name}`);
};
```

::right::

<div class="rule-stack mt-1">
  <div class="rule tone-blue"><strong>传拷贝，不传引用</strong><span>结构化克隆深拷贝；发出后再改原对象，对方拿到的仍是那一刻的快照</span></div>
  <div v-click class="rule tone-amber"><strong>传数据，不传行为</strong><span>函数 / DOM 节点 / 类方法克隆不了 → <code>DataCloneError</code></span></div>
  <div v-click class="rule tone-green"><strong>通信是异步的</strong><span>发出即返回；一发一收要自己用 id 关联，或交给 Comlink</span></div>
</div>

<!--
理解 worker 只需要建立这一个模型：主线程和 worker 是两个完全隔离的 JS 世界，各有自己的全局对象、内存、事件循环，不能读写对方的变量。唯一的联系是一扇双向的门——postMessage 往门里塞、onmessage 在门这边接。

[click:3] 三个必须内化的推论。第一，传的是拷贝不是引用：底层用结构化克隆深拷贝一份，所以发出后再改原对象不影响对方。第二，不是什么都能传：函数、DOM 节点、类的方法传不过去，会抛 DataCloneError——传数据不传行为。第三，通信是异步的：发出即返回，一发一收得自己用 id 关联，或者用 Comlink 包成一次 await。
-->

---
layout: default
---

# 三类 worker：先分清定位再选型

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="type-cell tone-blue">
    <code>Worker</code>
    <span><strong>专用 Dedicated</strong> · 仅创建它的页面</span>
    <span>绝大多数后台计算，学会它就掌握核心</span>
  </div>
  <div class="type-cell tone-green">
    <code>SharedWorker</code>
    <span><strong>共享 Shared</strong> · 同源多页共享一实例</span>
    <span>跨标签共享一条连接 / 一份状态 / 一个缓存</span>
  </div>
  <div class="type-cell tone-amber">
    <code>ServiceWorker</code>
    <span><strong>服务 Service</strong> · 网络代理型</span>
    <span>离线缓存 / 请求拦截 / 推送（本叶只点到）</span>
  </div>
</div>

<div class="takeaway mt-6"><strong>Dedicated 是基础</strong>，Shared 只是把「一对一」换成「多对一」，两者都为计算服务；<strong>Service Worker 是另一个物种</strong>——坐在页面和网络之间当代理，本叶只在对比时点名。</div>

<!--
Web Workers 这把大伞下有三种 worker，能力和用途差别很大。

专用 worker：只有创建它的页面能连，一页一个，绝大多数后台计算用它——学会它就掌握了 worker 的核心：构造、消息、错误、传输。

共享 worker：同源的多个页面、标签、iframe 共享同一个实例，靠 MessagePort 连；典型场景是多标签共用一条 WebSocket、一份状态。

Service Worker：它碰巧也是 worker，同样没有 DOM、同样事件驱动，但它不做计算，而是坐在页面和网络之间当代理，有自己的注册、安装、激活生命周期。用途、API、心智完全不同，所以单开一叶，本讲只在对比时点它的名字。后续所有内容围绕 Dedicated 和 Shared。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 第一个专用 worker：完整闭环

::left::

```js {2-4|6-7|9-10|12|all}
// main.js（主线程）
const worker = new Worker(
  new URL("./multiply.worker.js", import.meta.url),
  { type: "module" });

worker.onmessage = (e) =>          // ① 先挂监听
  console.log("乘积 =", e.data);   //   → 12

worker.onerror = (err) =>          // ② 错误冒泡到这
  console.error(err.message);

worker.postMessage([3, 4]);        // ③ 再发请求
```

::right::

```js {all}
// multiply.worker.js
self.onmessage = (e) => {
  const [a, b] = e.data;   // 收到拷贝
  self.postMessage(a * b); // 送回结果
};
```

<div class="rule-stack mt-3">
  <div class="rule tone-blue"><strong>先挂 onmessage 再 postMessage</strong><span>worker 可能秒回，监听挂晚了会漏</span></div>
  <div v-click class="rule tone-amber"><strong>worker 里改不了界面</strong><span>没有 document，算完发回主线程改 DOM</span></div>
</div>

<!--
一个能直接跑的最小闭环：主线程发两个数，worker 算乘积送回。

[click:3] 主线程侧三步。第一步先挂 onmessage 监听——worker 可能很快就回消息，监听挂晚了会漏。第二步挂 onerror，worker 内部未捕获的异常会冒泡到这里。第三步才 postMessage 发请求。

worker 端极简：收到数组拷贝，算乘积，postMessage 送回。两个第一次就该记住的点：先挂监听再发消息；worker 里没有 document，算完只能把结果发回主线程、由主线程改 DOM。模块 worker 的 new URL 写法是 Vite/Rollup/webpack 都认的可靠写法。
-->

---
layout: default
class: lab-slide
---

# 交互实验：Worker 卸载实验室

<WorkerOffloadLab />

<!--
这是真实的 Web Worker，不是模拟。现场点两个按钮，用同一段素数计算对比「主线程被不被阻塞」。

先看那个旋转的方块和「界面心跳」计数——它由 requestAnimationFrame 驱动，是主线程还活着的证据。

点①主线程直接算：同一段计算同步跑在主线程，方块立刻定死、心跳停跳，实测「计算期间界面推进 0 帧」——这就是 UI 冻结。

点②丢给 Worker 算：同一段计算被内联 Blob worker 搬到后台线程，主线程空闲，方块照转、心跳照跳，实测「期间推进几十帧」。两条路径用时相近，做的是同一件活——差别只在谁被卡住。

工程细节：worker 只在按钮回调里用 Blob 创建，收到结果立即 terminate 并释放对象 URL，顶层零 window 访问，SSR 安全。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 经典 vs 模块 worker：先决定模块系统

::left::

<table class="decision-table">
  <thead><tr><th>维度</th><th>经典（默认）</th><th>模块 <code>type:"module"</code></th></tr></thead>
  <tbody>
    <tr><td>加载依赖</td><td><code>importScripts()</code></td><td>标准 <code>import</code></td></tr>
    <tr v-click><td>顶层 import</td><td>不支持</td><td>支持</td></tr>
    <tr v-click><td><code>import.meta</code></td><td>无</td><td>有</td></tr>
    <tr v-click><td>兼容性</td><td>全支持</td><td>FF 114+ 已 Baseline</td></tr>
  </tbody>
</table>

::right::

```js {all}
// 模块 worker：可直接 import 复用 ES 模块
import { sum } from "./math.js";
self.onmessage = (e) =>
  self.postMessage(sum(e.data));
```

<div class="signal signal-good mt-4">
  <carbon:checkmark-outline />
  <span>新项目优先模块 worker：能 <code>import</code>、配打包器体验最好</span>
</div>

<div class="mini-note mt-3">只有要兼容极老环境、或用 <code>importScripts</code> 动态加载跨源脚本时，才回落经典。</div>

<!--
构造 worker 最需要先决定的一件事：经典还是模块，它决定 worker 内部的模块系统。

[click:3] 经典 worker 用 importScripts 同步加载依赖，不支持顶层 import，没有 import.meta，但老到全支持。模块 worker 传 type:module，可以用标准 import/export、有 import.meta，兼容性上 Chrome/Edge 80+、Safari 15+、Firefox 114+ 也就是 2023 年中已经全绿、进入 Baseline。

选择很清楚：新项目优先模块 worker，能 import 复用主项目的 ES 模块、配合打包器体验最好；只有要兼容极老环境、或要用 importScripts 动态加载跨源脚本时，才回落经典。
-->

---
layout: default
---

# 结构化克隆：搬数据，不搬行为

<div class="grid grid-cols-2 gap-6 mt-4">

```js {all}
// ✅ 能传（比 JSON 强得多）
worker.postMessage({
  when: new Date(),
  tags: new Set(["a", "b"]),
  buf: new Uint8Array([1, 2, 3]),
  pattern: /ab+c/gi,
});
```

```js {all}
// ❌ 抛 DataCloneError
worker.postMessage({
  fn: () => 1,         // 函数不可克隆
  node: document.body, // DOM 不可克隆
});
// ⚠️ 类实例：数据字段过得去，
//    但方法与原型链丢失
```

</div>

<div class="takeaway mt-4">口诀：<strong>结构化克隆搬数据，不搬行为</strong>。要在 worker 里用某个类，就在两边各定义它、只传纯数据字段、在对面重建实例。</div>

<!--
postMessage 用结构化克隆算法把数据深拷贝到对方世界。它比 JSON.stringify 强得多。

左边这些都能保真：Date、Set、Map、TypedArray、ArrayBuffer、RegExp、循环引用。

右边是硬边界：函数、DOM 节点克隆不了，直接抛 DataCloneError。还有个容易忽略的坑——类实例的数据字段能过去，但方法和原型链丢失，对面收到的是个普通对象，没有那些方法。

记忆口诀就一句：结构化克隆搬数据，不搬行为。要在 worker 里用某个类，就在两边各定义这个类、只传纯数据字段、在对面重建实例。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 错误处理：error 与 messageerror 是两回事

::left::

```js {1-6|8-9|all}
// 主线程
worker.onerror = (e) => {
  // ErrorEvent：带定位信息
  console.error(e.message);
  console.error(`${e.filename}:${e.lineno}`);
};

worker.onmessageerror = (e) =>
  console.error("消息无法反序列化", e);
```

::right::

<div class="grid grid-cols-1 gap-3 mt-1">
  <div class="fact"><strong>error</strong><span>worker 内代码抛了未捕获异常，冒泡到 <code>onerror</code>（<code>ErrorEvent</code>：message / filename / lineno）</span></div>
  <div class="fact" style="border-left-color:#b76e00"><strong>messageerror</strong><span>收到的消息无法反序列化——与 error 含义、位置都不同</span></div>
</div>

<div class="signal signal-good mt-4">
  <carbon:idea />
  <span>生产做法：worker 内 <code>try/catch</code>，把 <code>{ ok, error }</code> 当消息回传，拿到结构化上下文</span>
</div>

<!--
worker 相关的错误分两类，别混。

[click:2] 类型一 error：worker 内部代码抛了未捕获异常，冒泡到主线程的 onerror，事件是 ErrorEvent，带 message、filename、lineno，能帮你定位 worker 里哪行出的错。类型二 messageerror：收到的消息无法反序列化时触发，比如对方传了当前环境克隆不了的值，和 error 是两回事。

生产代码通常不依赖 onerror 冒泡——它拿不到结构化的业务上下文。更稳的做法是在 worker 内 try/catch，把 { ok, error } 当普通消息 postMessage 回来，主线程按约定处理。注意 Error 对象跨 postMessage 的可克隆性各浏览器不完全一致，稳妥起见把关键字段拆成纯数据传回。
-->

---
layout: default
---

# 销毁：terminate（外部强杀）vs self.close（内部自关）

<div class="grid grid-cols-2 gap-6 mt-5">

```js {all}
// 主线程侧：立即强杀
worker.terminate();
// 线程立刻销毁，正在跑的任务
// 直接中断；terminate 之后
// 再 postMessage 无效
```

```js {all}
// worker 内部：自行了结
self.onmessage = (e) => {
  if (e.data === "shutdown")
    self.close(); // 收尾后停事件循环
};
```

</div>

<div class="grid grid-cols-2 gap-4 mt-5">
  <div class="fact"><strong>都不给「优雅收尾」</strong><span>没有 beforeterminate 事件，要存的状态得在关闭前自己处理好</span></div>
  <div class="fact"><strong>Service Worker 没有 terminate</strong><span>生命周期由浏览器托管——两者定位不同的一个体现</span></div>
</div>

<!--
专用 worker 的生命周期跟着创建它的文档，但你也能手动结束它，从两侧都行。

主线程侧的 terminate 粗暴但可靠：worker 线程被立刻销毁，正在跑的任务直接中断，不触发任何收尾事件，terminate 之后再 postMessage 也无效。用户取消了长任务、worker 卡死时用它一刀切。

worker 内部的 self.close 是自我了断：处理完当前任务后停止事件循环、关闭自己，适合一次性任务型 worker。

两个共同点要记住：都不给优雅收尾的机会，没有 beforeterminate 之类事件，要保存的状态得在关闭前自己处理好。另外顺带对比——terminate 是 Worker 的方法，Service Worker 没有 terminate，它的生命周期由浏览器托管，这也是两者定位不同的体现。要复用 worker 做多次任务就别关它，建 worker 池。
-->

---
layout: default
---

# Transferable：把「原件」搬过去，我这份作废

<div class="grid grid-cols-[1.1fr_.9fr] gap-8 mt-5">

````md magic-move {at:1}
```js
const buf = new ArrayBuffer(50 * 1024 * 1024); // 50MB

// 结构化克隆（默认）：复制 50MB，主线程仍持有
worker.postMessage(buf);
console.log(buf.byteLength); // 52428800（照常可用）
```

```js
const buf = new ArrayBuffer(50 * 1024 * 1024); // 50MB

// Transferable 移交：零拷贝，主线程失去它
worker.postMessage(buf, [buf]); // ⚡ 第二参数列出移交对象
console.log(buf.byteLength); // 0 —— 已 detached
```
````

<div class="rule-stack">
  <div class="rule tone-green"><strong>克隆 = 复印一份给你</strong><span>原对象照常可用，内存里有两份</span></div>
  <div v-click class="rule tone-amber"><strong>transfer = 原件给你、我作废</strong><span>原对象 detached：读到 0，继续用抛错——这是语义不是 bug</span></div>
</div>

</div>

<!--
postMessage 默认走结构化克隆，传 50MB 的 ArrayBuffer 就要实打实复制 50MB 内存，既慢又翻倍占用。

[click] Transferable 给出另一条路：不复制，直接把底层资源的所有权从发送方搬到接收方——零拷贝，代价是发送方从此失去它。语法就是 postMessage 的第二个参数，列出要移交的对象。移交后主线程再读 buf.byteLength 得到 0，已经 detached，继续用会抛错——这是 transfer 的核心语义，不是 bug。

一句话记牢：克隆是复印一份给你，我这份还在；transfer 是把原件给你、我这份作废。传大二进制就 transfer，传小对象或要保留原件就克隆。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# TypedArray 的转移：搬的是它背后的 buffer

::left::

```js {1-4|6-7|9-10|all}
const view = new Uint8Array(1024 * 1024);

// ✅ 转移底层 buffer（view 是壳、buffer 是肉）
worker.postMessage(view, [view.buffer]);

console.log(view.byteLength);
// 0 —— buffer 被搬走，view 也空了

// 主线程内深拷贝时也能顺手移交：
structuredClone(src, { transfer: [src.buffer] });
```

::right::

<div class="boundary-stack mt-2">
  <div class="boundary external">消息体里放 <code>view</code></div>
  <carbon:arrow-down />
  <div class="boundary check">transfer 列表里放 <code>view.buffer</code></div>
  <carbon:arrow-down />
  <div class="boundary trusted">对面收到指向搬过去 buffer 的 <code>Uint8Array</code></div>
</div>

<div class="mini-note mt-4">TypedArray 视图<strong>本身不在可转移列表</strong>，能转移的永远是它背后的 <code>ArrayBuffer</code>。</div>

<!--
一个高频细节：Uint8Array 这类 TypedArray 本身不在可转移列表里，可转移的是它背后的 ArrayBuffer。

[click:2] 所以要转移一个视图，消息体里放的是 view，transfer 列表里放的是 view.buffer。转移之后 view 也变空了——因为它的肉被搬走了，只剩一个空壳。对面会收到一个指向搬过去那块 buffer 的新 Uint8Array。

顺带一提 structuredClone 这个全局函数：它和 postMessage 同款算法，用来在同一线程内做深拷贝，也支持 transfer 选项在克隆时移交部分资源。
-->

---
layout: default
---

# 可转移类型：只有少数类型能「搬家」

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="type-cell tone-blue"><code>ArrayBuffer</code><span>大块二进制；TypedArray 传其 <code>.buffer</code></span></div>
  <div class="type-cell tone-blue"><code>MessagePort</code><span>通信端口（MessageChannel、SharedWorker）</span></div>
  <div class="type-cell tone-green"><code>ImageBitmap</code><span>已解码位图，配 bitmaprenderer 上屏</span></div>
  <div class="type-cell tone-green"><code>OffscreenCanvas</code><span>把 canvas 渲染控制权交给 worker</span></div>
  <div class="type-cell tone-amber"><code>ReadableStream…</code><span>Readable / Writable / Transform 流的一端</span></div>
  <div class="type-cell tone-amber"><code>VideoFrame…</code><span>AudioData / MediaStreamTrack / RTCDataChannel</span></div>
</div>

<div class="mini-note mt-6">不在表内的（普通对象、<code>Date</code>、<code>Map</code>/<code>Set</code>、<code>Blob</code>、TypedArray 视图本身）只能被<strong>克隆</strong>，不能被转移——它们照样能 <code>postMessage</code>，只是走深拷贝。</div>

<!--
不是所有对象都能 transfer，只有实现了可转移语义的少数类型可以。

最常用的是 ArrayBuffer，传大块二进制；注意 TypedArray 要传它的 .buffer。MessagePort 传通信端口，比如 MessageChannel 的两端、SharedWorker 的 port。ImageBitmap 是已解码位图。OffscreenCanvas 把 canvas 控制权交给 worker。三种 Stream 可以把一端交给另一线程。还有 WebCodecs 的 VideoFrame、AudioData，以及 MediaStreamTrack、RTCDataChannel。

划重点：不在这个表里的——普通对象、Date、Map、Set、Blob、还有 TypedArray 视图本身——只能被克隆，不能被转移。它们照样能 postMessage，只是走深拷贝而已。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# SharedArrayBuffer：真共享内存，门槛也真高

::left::

```js {1-3|5-6|7-8|all}
// 先自检环境是否跨源隔离
if (!crossOriginIsolated)
  throw new Error("需要 COOP + COEP");

const sab = new SharedArrayBuffer(1024);
worker.postMessage(sab); // 不放 transfer 列表、不 detached
// worker 改这块内存，主线程直接读到
Atomics.wait(view, 0, 0); // 配 Atomics 做同步
```

::right::

<div class="mini-note mb-2">页面必须发这两个响应头（Spectre 缓解后的硬门槛）：</div>

```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

<div class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>绝大多数「传数据」用 <code>transfer</code> 就够——只有两线程<strong>高频共享同一状态</strong>才值得上 SAB</span>
</div>

<!--
克隆和 transfer 都是「一份数据只在一个地方」。SharedArrayBuffer 打破这点：主线程和 worker 同时映射到同一块物理内存，一边写、另一边立刻能读，无需再 postMessage，配 Atomics 做无锁同步。注意它 postMessage 时不放 transfer 列表、也不会 detached，因为它就是共享的。

[click:3] 但它有个硬门槛：Spectre 幽灵漏洞之后，浏览器要求使用 SAB 的页面处于跨源隔离状态，即服务器返回 COOP same-origin 加 COEP require-corp 这两个响应头，之后 crossOriginIsolated 才为 true。代价是页面会被限制加载不带 CORP/CORS 许可的跨源资源。

结论：绝大多数传数据需求用 transfer 就够，只有确实需要两线程高频共享同一状态——比如共享的物理引擎状态、音频环形缓冲——才值得上 SAB 并接受这个门槛。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# OffscreenCanvas：把渲染整个搬进 worker

::left::

```js {1-3|5-8|9-13|all}
// 主线程：把 <canvas> 控制权转出
const off = canvas.transferControlToOffscreen();
worker.postMessage({ canvas: off }, [off]);

// render.worker.js
self.onmessage = (e) => {
  const gl = e.data.canvas.getContext("webgl");
  // worker 里有自己的 requestAnimationFrame
  function frame() {
    // …绘制一帧，主线程全程不参与…
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};
```

::right::

<div class="rule-stack mt-1">
  <div class="rule tone-blue"><strong>① transferControlToOffscreen()</strong><span>交给 worker 渲染，画什么自动同步上屏</span></div>
  <div v-click class="rule tone-green"><strong>② new OffscreenCanvas(w, h)</strong><span>worker 内离屏渲染 + transferToImageBitmap() 出图</span></div>
</div>

<div v-click class="mini-note mt-3">Chrome 69+ / Firefox 105+ / Safari 17+，<strong>2025 末进入 Baseline</strong>；目标含老 Safari 时特性检测 + 回落主线程渲染。</div>

<!--
canvas 绑在 DOM 上、只能在主线程画，复杂的 WebGL 渲染因此和 UI 抢主线程。OffscreenCanvas 把画布从 DOM 解耦，让渲染整个跑在 worker 线程。它本身是可转移对象。

[click:3] 最常用的用法一：主线程调 transferControlToOffscreen 拿到一个 OffscreenCanvas，transfer 给 worker，此后 worker 直接 getContext 渲染，画到它上面的内容会被浏览器自动同步显示到页面那个 canvas 上，你不用手动搬像素。而且 worker 里有自己的 requestAnimationFrame，整条渲染循环都在后台线程，主线程哪怕在跑别的重活画面也照样流畅。用法二是 worker 内 new OffscreenCanvas 离屏渲染，再 transferToImageBitmap 出图送回。

兼容性：Chrome 69、Firefox 105、Safari 17，2025 年末进入 Baseline，Safari 是最后补齐的一环，目标含老 Safari 就做特性检测加回落。
-->

---
layout: default
---

# SharedWorker：多标签共享同一个实例

<div class="grid grid-cols-2 gap-6 mt-4">

```js {1-2|3-8|10-12|all}
// shared.worker.js —— 入口是 onconnect
const ports = new Set();
self.onconnect = (e) => {
  const port = e.ports[0]; // 这个页面的端口
  ports.add(port);
  port.onmessage = (m) => {/* 处理 */};
  port.start(); // addEventListener 时必须调
};
// 状态变化时广播给所有页面
function broadcast(d) {
  for (const p of ports) p.postMessage(d);
}
```

<div class="flex flex-col gap-3">
  <div class="fact"><strong>经 sw.port 通信</strong><span>不是 worker.postMessage 直连；每页各持一条 MessagePort</span></div>
  <div class="fact"><strong>忘了 port.start()</strong><span>用 addEventListener 却不 start，消息永远不来（头号坑）</span></div>
  <div class="fact" style="border-left-color:#c33a46"><strong>Firefox 不支持 module 型</strong><span>要兼容就回落经典脚本；移动端支持有限，先验证</span></div>
</div>

</div>

<!--
专用 worker 是一页一个，开三个标签就是三个互不相干的 worker。共享 worker 把它翻转成多个页面连同一个实例，带来一个专用 worker 给不了的能力：跨标签共享状态与资源。最典型的场景是多标签共用一条 WebSocket，让唯一实例持有那条连接，服务器眼里永远只有一条。

[click:3] 通信模型：共享 worker 不能直接 postMessage，因为它要区分消息来自哪个页面，答案是 MessagePort。worker 侧的入口是 onconnect，每有一个新页面连上就触发一次，e.ports[0] 是这条连接的端口；worker 要自己维护端口列表，状态变化时遍历广播——这是多标签同步的核心。

三个必记的点：经 sw.port 通信不是直连；忘了 port.start 是头号坑——用 addEventListener 监听却不 start，消息永远不来，改属性赋值会隐式 start；还有 Firefox 不支持 module 型 SharedWorker，移动端支持也有限，用前必须验目标环境并备降级。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# Comlink：用 Proxy 让 worker 调用像本地函数

::left::

```js {1-6|8-11|all}
// worker：暴露一个对象，就一行
import * as Comlink from "comlink";
const api = {
  parse: (t) => JSON.parse(t),
};
Comlink.expose(api);

// 主线程：wrap 成一个 Proxy
const api = Comlink.wrap(worker);
const data = await api.parse('{"a":1}');
// 没有 postMessage / 没有 id / 没有 switch
```

::right::

<div class="rule-stack mt-1">
  <div class="rule tone-blue"><strong>一切变异步</strong><span>方法返回 Promise，连读属性都要 <code>await</code></span></div>
  <div v-click class="rule tone-green"><strong>加方法零成本</strong><span>worker 加个函数，主线程立刻能 <code>await</code>，不改协议</span></div>
  <div v-click class="rule tone-amber"><strong>错误自动传播</strong><span>worker 抛异常 → 主线程对应 <code>await</code> reject</span></div>
</div>

<div v-click class="mini-note mt-3">约 <strong>1.1KB</strong>（brotli）；回调包 <code>Comlink.proxy(fn)</code>、零拷贝移交用 <code>Comlink.transfer(v, [buf])</code>。</div>

<!--
裸 postMessage 把「调一个 worker 里的函数」这么简单的意图，摊成了一大堆基础设施：手工 id 关联、手工 switch 路由、手工传播错误、加一个方法要改三处。Comlink 就是来抹掉这一切的。

它是 Google Chrome Labs 出品的 RPC 库，核心思路：worker 里 expose 一个对象，主线程 wrap 成一个 ES6 Proxy，你在代理上调方法，它底层自动转成 postMessage 往返并把结果 resolve 回来。几十行样板缩成两行。

[click:3] 三个要点。一切都变异步：方法返回 Promise，连读属性也要 await，因为值在另一个线程。加方法零成本：worker 的 api 对象上加个函数，主线程立刻能 await，不用改任何协议代码。错误自动传播：worker 里抛的异常会让主线程对应的 await reject。体积约 1.1KB brotli 几乎零负担；回调不可克隆要包 Comlink.proxy，大 buffer 零拷贝移交用 Comlink.transfer。
-->

---
layout: default
---

# 工程化：打包器导入 worker + Worker 池

<div class="mini-note mt-4 mb-2">Vite / Rollup / webpack 5 通用写法——<strong>别用裸字符串路径</strong>（打包/部署后相对路径易错位）：</div>

```js {all}
const worker = new Worker(
  new URL("./heavy.worker.ts", import.meta.url), // 相对当前模块解析
  { type: "module" }, // 模块 worker，可在 worker 内 import
);
```

<div class="mini-note mt-5 mb-2">高频、可并行的任务流用 <strong>Worker 池</strong>：建 N≈<code>hardwareConcurrency</code> 个常驻 worker 轮流分派——省启动、吃满多核：</div>

```js {all}
const pool = Array.from({ length: navigator.hardwareConcurrency || 4 },
  () => Comlink.wrap(new Worker(url, { type: "module" })));
const out = await Promise.all(chunks.map((c, i) => pool[i % pool.length].run(c)));
```

<!--
两个必会的工程写法。

第一，用打包器导入 worker。Vite、Rollup、webpack 5、Parcel 都认 new URL 加 import.meta.url 再配 type module 这个组合——它让打包器把 worker 当独立入口、产出单独的 chunk、正确改写路径。千万别用裸字符串路径 new Worker('./heavy.js')，打包部署后相对路径经常错位，打包器也不会把它当模块处理。Vite 另有 ?worker 语法糖，但 new URL 写法跨打包器最通用。

第二，Worker 池。单个 worker 只有一条线程，扛不住高频可并行的任务流；反复 new Worker 和 terminate 又让启动成本乘以调用次数。池建一组常驻 worker 按空闲分派，既复用省启动、又并行吃满多核。池大小取 hardwareConcurrency 附近也就是逻辑核数，再多只会互相抢核。生产可以用 workerpool 这类成熟库。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 何时不值得下放：worker 的成本账

::left::

<div class="rule-stack mt-1">
  <div class="rule tone-amber"><strong>启动成本</strong><span>下载解析脚本 + 建独立上下文，冷启动几~几十 ms</span></div>
  <div class="rule tone-amber"><strong>通信成本</strong><span>postMessage 序列化拷贝；大对象深拷贝本身就慢</span></div>
</div>

<div class="signal signal-good mt-5">
  <carbon:timer />
  <span>衡量而非猜测：先用 <code>performance.now()</code> 量真实耗时，再对照右表决定</span>
</div>

::right::

<table class="decision-table">
  <thead><tr><th>情形</th><th>判断</th></tr></thead>
  <tbody>
    <tr><td>单次同步 &gt; ~50ms、可序列化</td><td>✅ 值得下放</td></tr>
    <tr v-click><td>任务只有几 ms</td><td>❌ 启动+通信比计算贵</td></tr>
    <tr v-click><td>只想「稍后跑」不需并行</td><td>❌ 用 setTimeout</td></tr>
    <tr v-click><td>大数据频繁双向往返</td><td>⚠️ 先算通信账 / transfer</td></tr>
    <tr v-click><td>高频可并行任务流</td><td>✅ 用 worker 池</td></tr>
  </tbody>
</table>

<!--
Worker 不是免费的加速器，它有两笔明确成本。启动成本：new Worker 要下载解析脚本、创建独立上下文，冷启动几毫秒到几十毫秒，任务越短这笔固定开销占比越离谱。通信成本：postMessage 要序列化反序列化，传大对象深拷贝本身就慢，来回频繁通信时序列化开销可能吃掉全部并行收益。

[click:4] 由此得到该不该下放的判断。单次同步计算超过约 50ms 又能序列化，值得下放，50ms 是用户可感知卡顿的门槛。任务只有几 ms，别下放，启动加通信比计算还贵。只是想稍后跑不需要真并行，用 setTimeout。数据极大又要频繁双向往返，先算通信账、能 transfer 就 transfer。高频可并行的任务流，用 worker 池别每次新建。

最重要的一条：衡量而非猜测。下放前先用 performance.now 量一下这段活在主线程上的真实耗时，感觉很重常常并不重。
-->

---
layout: default
---

# 易错点 TOP

<div class="grid grid-cols-2 gap-3 mt-5">
  <div class="fact"><strong>在 worker 里找 DOM</strong><span>没有 window/document——发回主线程改 DOM</span></div>
  <div class="fact"><strong>传函数 / DOM / 类方法</strong><span>DataCloneError 或方法丢失——只传纯数据</span></div>
  <div class="fact"><strong>transfer 后还用原对象</strong><span>已 detached，读 0、写抛错——要留先 structuredClone</span></div>
  <div class="fact"><strong>忘了 port.start()</strong><span>SharedWorker addEventListener 后不 start，消息不来</span></div>
  <div class="fact"><strong>裸字符串路径建 worker</strong><span>打包后易错位——用 new URL(…, import.meta.url)</span></div>
  <div class="fact"><strong>短任务下放 / 想「延后」用 worker</strong><span>启动+通信更贵——延后用 setTimeout 就够</span></div>
</div>

<!--
把最容易踩的坑集中过一遍。

在 worker 里找 DOM——它没有 window 和 document，把结果发回主线程改 DOM。传函数、DOM 节点、类实例的方法——抛 DataCloneError 或方法丢失，只传纯数据、行为在对面重建。transfer 之后还用原对象——已经 detached，读到 0、写就抛错，要保留就先 structuredClone 留副本。

SharedWorker 忘了 port.start——用 addEventListener 监听却不 start，消息永远不来，这是共享 worker 头号坑。裸字符串路径建 worker——打包后路径易错位，用 new URL 加 import.meta.url。最后，短任务也下放、或者想延后却用了 worker——worker 是并行不是延后，几 ms 的活启动加通信比计算还贵，延后用 setTimeout 就够。更全的清单在笔记参考页。
-->

---
layout: center
class: summary-slide
---

# 带走四个判断

<div class="summary-grid mt-8">
  <div><span>01</span><strong>重活挪出主线程</strong><small>worker 让重活不挡道，不是让代码变快</small></div>
  <div><span>02</span><strong>传的是拷贝，边界要当心</strong><small>克隆搬数据不搬行为；大二进制走 transfer</small></div>
  <div><span>03</span><strong>共享用 Shared，渲染用 Offscreen</strong><small>多标签共享连接状态；渲染重卸到 OffscreenCanvas</small></div>
  <div><span>04</span><strong>超三五条消息就上 Comlink</strong><small>Proxy 把裸消息变 async 调用，约 1.1KB</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API" target="_blank"><carbon:book /> MDN Web Workers</a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers" target="_blank"><carbon:document /> Using web workers</a>
  <a href="https://html.spec.whatwg.org/multipage/workers.html" target="_blank"><carbon:rocket /> WHATWG 规范</a>
  <a href="https://github.com/GoogleChromeLabs/comlink" target="_blank"><carbon:logo-github /> Comlink</a>
</div>

<!--
最后用四句话复盘。第一，把重活挪出主线程——worker 的唯一但决定性的价值是让重活不挡道，不是让代码变快。第二，传的是拷贝、边界要当心——结构化克隆搬数据不搬行为，函数和 DOM 传不过去，大二进制务必走 transfer 零拷贝。第三，共享用 SharedWorker、渲染用 OffscreenCanvas——多标签共享连接和状态用前者，渲染重就把画布卸到后者。第四，一旦通信超过三五条消息就上 Comlink，把裸消息收发变成普通 async 调用，约 1.1KB 几乎零成本。

掌握这四条判断，再去啃 SharedArrayBuffer、WebCodecs、WASM 在 worker 里跑这些进阶，就有稳定的基座。资源页留了 MDN 教程、WHATWG 规范原文和 Comlink 仓库。
-->
