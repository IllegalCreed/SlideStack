---
theme: seriph
layout: cover
title: WebSocket
info: |
  浏览器原生的全双工连接对象：WebSocket 对象 API 面——构造与 URL、readyState 四态、send / close 约束、二进制与背压、页面生命周期与重连封装。

  Learn more at [MDN WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark">WS</div>

# WebSocket

## 一个对象、四个状态、双向随时互推——浏览器原生的全双工连接

<div class="cover-meta">
  <span>WHATWG WebSockets 现行标准</span>
  <span>构造 · readyState · send / close · 二进制背压 · 生命周期</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" target="_blank" class="slidev-icon-btn" aria-label="MDN 文档">
    <carbon:document />
  </a>
  <a href="https://github.com/whatwg/websockets" target="_blank" class="slidev-icon-btn" aria-label="whatwg/websockets GitHub">
    <carbon:logo-github />
  </a>
</div>

<!--
这份幻灯片只讲一件事：浏览器里的 WebSocket 对象怎么用对。它是唯一在单条连接上做到「双方同时收发」的原生协议，接口十几年不变、零依赖。

刻意划清边界：握手怎么升级、帧怎么切、心跳 / 重连 / 关闭码的运维语义——这些协议与工程策略在网络章。本片站在它的结论之上，聚焦这个对象的 API 面：构造、四态、四事件、send / close 约束、二进制与背压、生命周期与封装骨架。
-->

---
layout: default
---

# 先划边界：本叶只讲「浏览器 WebSocket 对象」

<div class="pipeline mt-8">
  <div class="pipeline-step tone-amber">
    <span class="step-no">协议层</span>
    <strong>握手 · 帧 · 掩码 · wss</strong>
    <span>去网络章读「为什么」</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-blue">
    <span class="step-no">本叶</span>
    <strong>WebSocket 对象</strong>
    <span>构造 / 四事件 / send / close 的 API 面</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-amber">
    <span class="step-no">工程策略</span>
    <strong>心跳 · 重连 · 鉴权</strong>
    <span>去网络章读「怎么做」</span>
  </div>
</div>

<div class="grid grid-cols-3 gap-4 mt-10">
  <div v-click class="fact"><strong>全双工、长寿命</strong><span>双方随时互推，一条持久连接</span></div>
  <div v-click class="fact"><strong>API 极简完备</strong><span>一个构造 + 四事件 + send / close</span></div>
  <div v-click class="fact"><strong>二进制一等公民</strong><span>文本与 ArrayBuffer / Blob 无缝</span></div>
</div>

<!--
第一张图先把范围钉死。WebSocket 这个词横跨三层：协议层的握手与帧、浏览器暴露的对象、以及应用层的工程封装。

[click] 对象本身给你的是：全双工、长寿命的一条连接，双方随时能主动说话——这正是它区别于 SSE 单向推送的根本。
[click] API 面薄到极致：一个构造函数、open / message / error / close 四个事件、send / close 两个方法。
[click] 二进制是一等公民，文本和字节流用同一套 API。

真正难的不是这套薄 API，而是它「刻意不管」的心跳、重连、鉴权——那些在网络章。本片只把中间这层讲透。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 一分钟上手：连接、发送、接收、关闭四件套

::left::

```js {1|3|5-6|8|10|all}
const ws = new WebSocket("wss://host/chat"); // 构造即连接

ws.onopen = () => ws.send("hi"); // OPEN 后才能发

ws.onmessage = (e) => show(e.data);
//               e.data 是 string 或二进制

ws.onerror = () => log("出错了，细节看随后的 close");

ws.onclose = (e) => log(e.code, e.reason, e.wasClean);
```

::right::

<div class="rule-stack">
  <div v-click class="rule tone-blue"><strong>new 即连接、不阻塞</strong><span>构造后是 CONNECTING；别急着 send，等 open</span></div>
  <div v-click class="rule tone-green"><strong>消息没有「类型」层</strong><span>全进 message；要区分自己在 payload 带字段</span></div>
  <div v-click class="rule tone-amber"><strong>error 不解释、close 才解释</strong><span>诊断信息在 CloseEvent 里</span></div>
</div>

<div v-click class="mini-note mt-4">断线实验：杀掉服务端进程，控制台打出 `close` 且 `code=1006` / `wasClean=false`——「网络异常断开」在 API 层的样子。浏览器**不自动重连**（与 SSE 相反）。</div>

<!--
最小四件套：构造、onopen 里发、onmessage 里收、onclose 收尾。

[click] 一行 new 就发起连接，构造函数同步返回、不阻塞。
[click] 只有到了 open，readyState 才是 OPEN，之前 send 会抛异常。
[click:2] onmessage 的 e.data 可能是字符串也可能是二进制，取决于帧类型与 binaryType。
[click] onerror 是空信号，真正的诊断在 close。
[click] onclose 的 CloseEvent 三件套才是排错来源。

[click:3] 右边三个心智锚点先立住：new 即连接必须等 open、消息无类型层、error 不解释 close 才解释。做一次断线实验最直观：杀掉服务端，会看到 code=1006、wasClean=false，而且浏览器不会自动重连。
-->

---
layout: default
---

# 构造：`new WebSocket(url[, protocols])`

<div class="grid grid-cols-[1fr_1fr] gap-8 mt-4 items-start">

```js {1|2|4-5|all}
const ws = new WebSocket("wss://example.com/chat");
console.log(ws.readyState); // 0 = CONNECTING（构造后立即读）

// 2024 起也接受 http / https 与相对 URL
const ws2 = new WebSocket("/live"); // 按页面 base 解析
```

<table class="decision-table">
  <thead><tr><th>URL 规则</th><th>结果</th></tr></thead>
  <tbody>
    <tr v-click><td><code>ws</code> / <code>wss</code></td><td>标准 scheme，生产一律 <code>wss</code></td></tr>
    <tr v-click><td><code>http</code> / <code>https</code></td><td>2024 新基线，自动升为 <code>ws</code> / <code>wss</code></td></tr>
    <tr v-click><td>相对 URL</td><td>2024 新基线，按脚本 base URL 解析</td></tr>
    <tr v-click><td>带 <code>#fragment</code> / 非法 scheme</td><td>构造抛 <code>SyntaxError</code></td></tr>
  </tbody>
</table>

</div>

<div v-click class="signal signal-bad mt-5">
  <carbon:warning-alt />
  <span>HTTPS 页发明文 `ws://` 被「混合内容」拦截——但那不是构造异常，而是连接失败走 `error` → `close`。</span>
</div>

<!--
构造函数即发起连接：同步返回一个 CONNECTING 态实例，握手在后台跑，成功后触发 open。

[click] 构造后立刻读 readyState 就是 0。
[click] 2024 年补了新基线：构造函数也接受 http / https（自动升级）和相对 URL——Chrome 125 / Firefox 124 / Safari 17.3 起。

[click:2] URL 校验很严：scheme 只认白名单，带 fragment 或非法 scheme 直接抛 SyntaxError。
[click] 注意一个易混点：HTTPS 页里发 ws:// 明文连接，被混合内容策略拦截——但这不是构造函数抛的异常，而是连接建立失败，走 error 再走 close。所以生产环境一律 wss。
-->

---
layout: default
---

# readyState 四态：不可逆流动，比 SSE 多一个 CLOSING

<div class="ws-states mt-6">
  <div class="ws-state n-connecting"><span class="ws-state__v">0</span><strong>CONNECTING</strong><small>握手中，初始态</small></div>
  <carbon:arrow-right class="ws-arrow" />
  <div class="ws-state n-open"><span class="ws-state__v">1</span><strong>OPEN</strong><small>可收发</small></div>
  <carbon:arrow-right class="ws-arrow" />
  <div class="ws-state n-closing"><span class="ws-state__v">2</span><strong>CLOSING</strong><small>关闭握手中</small></div>
  <carbon:arrow-right class="ws-arrow" />
  <div class="ws-state n-closed"><span class="ws-state__v">3</span><strong>CLOSED</strong><small>已关 / 从未建立</small></div>
</div>

<div class="grid grid-cols-3 gap-4 mt-8">
  <div v-click class="fact"><strong>单向、不可逆</strong><span>握手失败则从 CONNECTING 直接到 CLOSED</span></div>
  <div v-click class="fact"><strong>实例用完即弃</strong><span>走到 CLOSED 即作废，重连必须 `new` 一个新的</span></div>
  <div v-click class="fact"><strong>常量两处都挂</strong><span>`WebSocket.OPEN` 与 `ws.OPEN` 等价</span></div>
</div>

<div v-click class="takeaway mt-6">对比 `EventSource` 的三态且自带重连：WebSocket 多了 `CLOSING`（关闭握手进行中），且**既不自带重连、实例也不可复用**——这是两者用法的分水岭。</div>

<!--
readyState 是只读数字，四个常量之一。和 SSE 的三态相比，WebSocket 多了一个 CLOSING——关闭握手进行中的中间态。

四态单向流动、不可逆：CONNECTING 到 OPEN 到 CLOSING 到 CLOSED，握手失败就从 CONNECTING 直接跳 CLOSED。

[click] 这条线走完实例就作废。
[click] 要重连，只能 new 一个新实例——WebSocket 没有 reopen 这回事。这与 SSE 实例可长期存活、自带重连截然不同。
[click] 常量既挂在类上也挂在实例上，两种写法等价。
[click] 记住这个分水岭：多一个 CLOSING 态、不自带重连、实例不可复用。后面交互实验里会亲手走一遍这条状态线。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 四个事件：一切通过事件通知你

::left::

<table class="decision-table">
  <thead><tr><th>事件</th><th>对象</th><th>触发</th></tr></thead>
  <tbody>
    <tr v-click><td><code>open</code></td><td><code>Event</code></td><td>握手成功、进入 OPEN</td></tr>
    <tr v-click><td><code>message</code></td><td><code>MessageEvent</code></td><td>收到一条消息</td></tr>
    <tr v-click><td><code>error</code></td><td><code>Event</code></td><td>出错（无细节，后必跟 close）</td></tr>
    <tr v-click><td><code>close</code></td><td><code>CloseEvent</code></td><td>关闭（正常 / 异常）</td></tr>
  </tbody>
</table>

::right::

### 与 SSE 最大的用法差异

```js
// 服务端所有消息都进 message，
// 「命名事件」概念不存在
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  route(msg.type); // 类型自己在 payload 里带
};
```

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>别等一个「命名事件」——WebSocket 没有 SSE 的 `event:` 概念，全进 `message`。</span>
</div>

<!--
WebSocket 是个 EventTarget，一切通过四个事件通知你。

[click:4] open 握手成功触发；message 每收到一条消息触发，事件对象是 MessageEvent；error 出错触发，但对象是空的，随后必有 close；close 关闭时触发，CloseEvent 带诊断信息。

右边是与 SSE 最关键的用法差异：SSE 有 event: 命名事件，可以用 addEventListener 按类型分派。WebSocket 没有——服务端发来的每条消息，无论内容，都只进 message。

[click] 要区分业务消息类型，只能自己在 payload 里放一个 type 字段，在 onmessage 里手动路由。从 SSE 迁过来的人最容易在这里踩坑：还挂着按类型监听的心智，结果消息全在 message 里。
-->

---
layout: default
class: lab-slide
---

# 交互实验：readyState 状态机 + send 时机实验室

<WsStateLab />

<!--
这是一个「模拟的」WebSocket——纯定时器驱动，不连任何真实服务器，专门用来复现 send 在不同状态下的三种结局。

演示脚本：先点「连接」，实例进入 CONNECTING(0)。此刻立刻点「发送」——日志会打出「抛 InvalidStateError」，这是最常见的新手错误：new 完立刻 send。

等约 1.2 秒握手完成进入 OPEN(1)，再点「发送」——字节进入 bufferedAmount 水位条，入队时抬升、后台「发出」时回落。连续快速点发送，水位冲过容量线，会看到「缓冲满 → 浏览器自动关闭连接」。

最后点「关闭」进入 CLOSING(2)，再点「发送」——日志显示「静默丢弃，不发送、不报错」，这正是消息神秘消失的头号嫌疑。整个过程把四态迁移和 send 时机一次演清楚。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# `send()`：一个方法，五种数据，时机极敏感

::left::

<table class="decision-table">
  <thead><tr><th>数据类型</th><th>帧</th></tr></thead>
  <tbody>
    <tr v-click><td><code>string</code></td><td>文本帧（UTF-8）</td></tr>
    <tr v-click><td><code>ArrayBuffer</code></td><td>二进制帧</td></tr>
    <tr v-click><td><code>TypedArray</code>（<code>Uint8Array</code>…）</td><td>二进制帧</td></tr>
    <tr v-click><td><code>DataView</code></td><td>二进制帧</td></tr>
    <tr v-click><td><code>Blob</code></td><td>二进制帧（`type` 被忽略）</td></tr>
  </tbody>
</table>

<div v-click class="mini-note mt-3">`send()` 是异步：只入本地缓冲即返回，不等真正发出——进度看 `bufferedAmount`。</div>

::right::

<div class="rule-stack">
  <div v-click class="rule tone-blue"><strong>CONNECTING(0)</strong><span>抛 `InvalidStateError`——必须等 open</span></div>
  <div v-click class="rule tone-green"><strong>OPEN(1)</strong><span>正常入缓冲发送</span></div>
  <div v-click class="rule tone-red"><strong>CLOSING(2) / CLOSED(3)</strong><span>**静默丢弃**，既不发送也不报错</span></div>
</div>

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>缓冲满到发不出去时，浏览器**自动关闭连接**——大流量必须节流。</span>
</div>

<!--
send 接受五种数据：string 是文本帧，另外四种 ArrayBuffer、TypedArray、DataView、Blob 都是二进制帧。一个方法通吃文本与二进制。

[click:5] 逐一看这五类；注意 Blob 的 type 会被忽略。
[click] 关键：send 是异步的，只把数据塞进本地发送缓冲就立即返回，不等真正发出。

右边是 send 对状态的敏感性，也是这个 API 最容易踩的点：
[click] CONNECTING 态 send 抛 InvalidStateError——new 完立刻发就中招。
[click] OPEN 态才正常入缓冲。
[click] CLOSING / CLOSED 态 send 被静默丢弃，不发也不报错——排查「消息神秘消失」的第一嫌疑。
[click] 还有一条：如果缓冲满到发不出去，浏览器会直接自动关闭连接。这就是下面背压页要讲的为什么大流量必须看 bufferedAmount 节流。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# `close(code, reason)`：优雅关闭与合法码

::left::

```js {1|2|3|all}
ws.close();                    // 默认按 1000 正常关闭
ws.close(1000, "user logout"); // 带码带原因
ws.close(4001, "session expired"); // 应用私有码
```

<div v-click class="mini-note mt-3">**优雅关闭**：发起关闭握手，且**不丢已排队消息**——会等它们发完再走关闭；对已 CLOSED 连接调用是空操作（幂等）。</div>

<div v-click class="mini-note mt-2">`reason` 按 **UTF-8 字节**计 ≤ 123（中文每字 3 字节），超出抛 `SyntaxError`。</div>

::right::

<table class="decision-table">
  <thead><tr><th>code 取值</th><th>结果</th></tr></thead>
  <tbody>
    <tr v-click><td><code>1000</code></td><td>合法：正常关闭（默认）</td></tr>
    <tr v-click><td><code>3000</code>–<code>4999</code></td><td>合法：库 / 框架 / 应用私有码</td></tr>
    <tr v-click><td>其他（含 <code>1001</code>–<code>1015</code>）</td><td>抛 <code>InvalidAccessError</code></td></tr>
  </tbody>
</table>

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>`1001` / `1011` 等协议保留码你**读得到、传不进**——只能由浏览器 / 服务端产生。</span>
</div>

<!--
close 发起关闭握手，把状态推向 CLOSING 再到 CLOSED。

[click:3] 不传参默认 1000；也可以带码带原因；3000 到 4999 是留给应用的私有码。

[click] 两条行为约定：close 是优雅关闭，不会丢弃之前 send 但没发出的消息，会等它们发完；对已关闭连接再 close 是空操作。
[click] reason 有长度限制，按 UTF-8 字节算不是字符数——中文每字 3 字节，超 123 字节抛 SyntaxError。

右边是最容易踩的 API 约束：你能主动传给 close 的 code 只有两类。
[click:3] 1000，或 3000 到 4999，其余全抛 InvalidAccessError。
[click] 像 1001 Going Away、1011 Internal Error 这些协议保留码，你在 CloseEvent 里读得到，却不能手动传给 close——它们只能由协议层产生。
-->

---
layout: default
---

# error 干瘪、close 才说话

<div class="grid grid-cols-[1fr_1.1fr] gap-8 mt-4 items-start">

<div>

### error：刻意的「无信息」

```js
ws.onerror = () => {
  // 事件对象里没有码、没有原因
  // 安全设计：防泄露底层网络细节
  log("出错了，看随后的 close");
};
```

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>`error` 之后**必定紧跟一个 `close`**；重连逻辑挂 `onclose`，别挂 `onerror`。</span>
</div>

</div>

<div>

### CloseEvent：排错的核心信息源

<table class="decision-table">
  <thead><tr><th>属性</th><th>说明</th></tr></thead>
  <tbody>
    <tr v-click><td><code>code</code></td><td>关闭码（`1000` 正常、`1006` 异常）</td></tr>
    <tr v-click><td><code>reason</code></td><td>服务端给的原因文本（可能空）</td></tr>
    <tr v-click><td><code>wasClean</code></td><td>是否走完关闭握手；`false` 常伴 `1006`</td></tr>
  </tbody>
</table>

<div v-click class="mini-note mt-3">`1006` = 异常断开、无 Close 帧，是「网络掉了」的 API 层信号——**只读**，你无法用 `close(1006)` 产生它。</div>

</div>

</div>

<!--
error 和 close 是一对：error 负责「出事了」这个信号，close 负责解释。

左边：error 事件对象是空的——没有错误码、没有原因。这是刻意的安全设计，暴露底层网络失败细节可能泄露信息，比如探测内网端口。
[click] 所以实践里 onerror 往往只打一行日志，重连 / 恢复逻辑一律挂在 onclose 上，因为 error 后必定紧跟一个 close。

右边：CloseEvent 才是排错核心。
[click:3] code 是关闭码，reason 是人类可读原因，wasClean 表示是否走完了关闭握手。
[click] 特别记住 1006：异常断开、没收到 Close 帧，是浏览器合成给你的「网络掉了」信号，也是判断该不该重连的依据——但它只读，你无法用 close(1006) 主动产生，同理 1005、1015 也是只读保留码。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# `binaryType`：接收二进制的两种「装法」，默认 `blob`

::left::

```js {1-2|4-9|all}
const ws = new WebSocket(url);
ws.binaryType = "arraybuffer"; // 构造后立刻设

ws.onmessage = (e) => {
  if (typeof e.data === "string") return handleText(e.data);
  // arraybuffer：可同步随机读字节
  const view = new DataView(e.data);
  read(view.getUint32(0));
};
```

::right::

<table class="decision-table">
  <thead><tr><th>值</th><th>e.data</th><th>适合</th></tr></thead>
  <tbody>
    <tr v-click><td><code>"blob"</code>（默认）</td><td><code>Blob</code></td><td>大文件 / 整体转手</td></tr>
    <tr v-click><td><code>"arraybuffer"</code></td><td><code>ArrayBuffer</code></td><td>同步随机读字节</td></tr>
  </tbody>
</table>

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>`WebSocket` 默认 `"blob"`，`RTCDataChannel` 默认 `"arraybuffer"`——**正好相反**，跨 API 搬代码必显式设。</span>
</div>

<div v-click class="mini-note mt-3">`binaryType` 只影响**接收**；只影响改之后到达的消息，稳妥做法是 open 前设好。</div>

<!--
WebSocket 能收发二进制。发什么由 send 的参数决定；收到的二进制帧长什么样，由 binaryType 这个唯一可写属性控制。

[click:2] 设成 arraybuffer 后，onmessage 里二进制帧的 e.data 就是 ArrayBuffer，可以直接喂 DataView 同步随机读字节。

[click:2] 两个值：默认的 blob 适合大文件、整体转手给 createObjectURL 或下载，惰性不立刻占内存；arraybuffer 适合要同步解析二进制协议、喂 WASM。

[click] 最隐蔽的坑：WebSocket 默认 blob，但 RTCDataChannel 默认 arraybuffer，两者正好相反。同一段 onmessage 里 instanceof ArrayBuffer 的判断，换个 API 默认就走了另一分支。跨 API 复用逻辑永远显式设一次。
[click] 还有 binaryType 只影响接收、只影响改之后到达的消息，所以构造后立刻设最稳。
-->

---
layout: default
---

# `bufferedAmount`：发送侧唯一的背压信号

<div class="gauge mt-4">
  <div class="gauge__fill" style="width: 58%"></div>
  <span class="gauge__cap">bufferedAmount = 已 send 入缓冲、尚未发到网络的字节数 · 入队↑ 发出↓ 发完归 0</span>
</div>

<div class="grid grid-cols-2 gap-4 mt-6">
  <div v-click class="fact"><strong>实时水位表，非计数器</strong><span>每次 send 抬升，后台发出回落，全发完归 0</span></div>
  <div v-click class="fact"><strong>没有 `bufferedamountlow` 事件</strong><span>那是 `RTCDataChannel` 的；节流只能**轮询**</span></div>
  <div v-click class="fact"><strong>缓冲满自动断连</strong><span>狂发不看水位 → 内存涨、连接被自动关闭</span></div>
  <div v-click class="fact"><strong>接收侧完全无背压</strong><span>标准 API 短板：靠 Worker / 采样 / 服务端限速缓解</span></div>
</div>

<div v-click class="takeaway mt-6">发送节流的标准手写模式：`requestAnimationFrame` / `setTimeout` 周期回来看 `bufferedAmount` 是否降下去，低于水位线才喂下一块——因为**没有事件可等**。</div>

<!--
send 是异步非阻塞的，塞进本地缓冲就返回。那到底发出去没有？靠只读属性 bufferedAmount——已排队、尚未发到网络的字节数。

[click] 它是一个实时水位表，不是累计计数器：每次 send 让它增加，后台发出让它回落，全部发完归 0。
[click] 关键短板一：标准 WebSocket 没有 bufferedamountlow 事件，那是 RTCDataChannel 的。你无法等一个事件，只能主动轮询 bufferedAmount。
[click] 关键短板二：缓冲满到排不进去时，浏览器直接自动关闭连接，所以大流量必须节流。
[click] 关键短板三：接收侧连 bufferedAmount 都没有，完全无背压——消息到得比处理快，只能在内存里堆，或把主线程占到 100% CPU。API 层无解，只能靠 Worker、采样丢帧、或让服务端限速。

[click] 所以发送节流的标准写法就是用 rAF 或定时器周期回来看水位，低于阈值才喂下一块。下一页会看到 WebSocketStream 用 Streams 把这一切变成天然背压。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 子协议：API 侧只有「传数组 + 读属性」

::left::

```js {1|2-5|all}
const ws = new WebSocket(url, ["v2.chat", "v1.chat"]);
ws.onopen = () => {
  // 握手后 protocol 是服务端选中的那一个
  console.log(ws.protocol); // 如 "v2.chat"
};
```

<div v-click class="mini-note mt-3">数组按偏好排序、值不能重复；**最终只选中一个**，服务端可以一个都不选（此时 `protocol` 为空串）。</div>

::right::

<div class="rule-stack">
  <div v-click class="rule tone-blue"><strong>传什么</strong><span>第二参：字符串或字符串数组</span></div>
  <div v-click class="rule tone-green"><strong>读什么</strong><span>只读属性 `ws.protocol` 拿选中结果</span></div>
</div>

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>**不能自定义握手头**：`Authorization` / `Sec-*` 都设不了——鉴权走 Cookie / ticket / 子协议夹带（详见网络章）。</span>
</div>

<!--
子协议在 API 面非常简单，就两件事：传什么、读什么。

[click:2] 传：构造第二参给一个字符串数组，声明客户端能接受哪些子协议，按偏好排序。读：握手完成后读只读属性 protocol，就是服务端从数组里选中的那一个。
[click] 同一连接最终只会选中一个；服务端也可以一个都不选，此时 protocol 是空串。至于服务端怎么选、怎么用它协商消息格式版本——那是协商机制，属工程策略，在网络章。

[click:2] 右边强调 API 侧的定位：传数组、读属性，就这两步。
[click] 顺带一个硬约束：浏览器侧 WebSocket 构造函数没有传自定义请求头的入口，Authorization、任意 Sec 头都设不了。所以浏览器侧鉴权只能走 Cookie、URL 短票、或把 token 塞进子协议夹带——这些路线的取舍在网络章。
-->

---
layout: default
---

# 页面生命周期：开着的连接会挡 bfcache

<div class="grid grid-cols-[1.05fr_.95fr] gap-8 mt-4 items-start">

```js {1-4|6-9|all}
window.addEventListener("pagehide", () => {
  ws?.close(1000, "page hidden"); // 主动优雅关
  ws = null; // 断引用，别让冻结页面攥着死连接
});

window.addEventListener("pageshow", (e) => {
  // 只有从 bfcache 复活才重建（旧实例已作废）
  if (e.persisted) connect(); // 必须 new 新的
});
```

<div class="rule-stack">
  <div v-click class="rule tone-green"><strong>bfcache 用 pagehide / pageshow</strong><span>离场关、`persisted` 为真则重建</span></div>
  <div v-click class="rule tone-blue"><strong>visibilitychange 管前后台</strong><span>转 `visible` 是最佳重连检查点</span></div>
  <div v-click class="rule tone-red"><strong>别用 unload / beforeunload</strong><span>它们本身就**破坏 bfcache**</span></div>
</div>

</div>

<div v-click class="takeaway mt-5">核心事实：**未关闭的 WebSocket 会阻止页面进入 bfcache**——用户点「后退」本该秒开的页面被迫重载。SPA 路由切走 / 组件卸载都要显式 `close()`。</div>

<!--
WebSocket 是长连接，浏览器不会替你在合适时机断开，而它的存在又反过来影响页面生命周期。这不是可选项，是用对它的前提。

核心事实先立住：开着的 WebSocket 会阻止页面进入 bfcache，也就是往返缓存。用户点后退本该秒开的页面，会因为这条没关的连接被迫重新加载。

左边是与 bfcache 的正确协作：
[click] pagehide 里主动 close 并把引用置 null，别让冻结的页面攥着死连接。
[click] pageshow 里判 event.persisted，只有从 bfcache 复活才重建——而且旧实例已作废，必须 new 一个新的。

[click:2] 右边三条：bfcache 用 pagehide / pageshow；前后台切换用 visibilitychange，转 visible 时立即检查连接、必要时重连。
[click] 最关键的反面提醒：别用 unload 或 beforeunload 做收尾，这两个事件的存在本身就让页面失去 bfcache 资格。离场一律 pagehide。
[click] 一句话：不 close 就是幽灵连接加挡 bfcache，SPA 里组件卸载、路由切走都要显式关。
-->

---
layout: default
---

# 重连封装骨架：`onclose` → 排程 → `new` 新实例

```ts {1-3|5-7|9-12|14|all}
class ReconnectingSocket extends EventTarget {
  #ws = null; #closedByUser = false; #queue = []; #retries = 0;

  #connect() {
    const ws = (this.#ws = new WebSocket(this.url, this.protocols));
    ws.onopen = () => this.#queue.splice(0).forEach((d) => ws.send(d)); // 补发排队

    ws.onclose = (e) => {
      if (this.#closedByUser || e.code === 1000) return; // 主动关 / 正常关 → 不重连
      setTimeout(() => this.#connect(), backoff(this.#retries++)); // 退避策略见网络章
    };
  }
  send(d) { this.#ws?.readyState === WebSocket.OPEN ? this.#ws.send(d) : this.#queue.push(d); }
  close() { this.#closedByUser = true; this.#ws?.close(1000); }
}
```

<div class="grid grid-cols-2 gap-3 mt-4">
  <div v-click class="fact"><strong>区分主动关 vs 异常断开</strong><span>`closedByUser` 或 `code === 1000` 时不重连</span></div>
  <div v-click class="fact"><strong>send 前判 readyState</strong><span>未 OPEN 入待发队列，规避 CONNECTING 抛异常</span></div>
</div>

<!--
重连的本质就一句话：WebSocket 走到 CLOSED 即作废，重连等于 new 一个新实例。这个骨架只负责浏览器侧的连接管理与 API 编排，退避算法留空、指向网络章。

[click] 内部持有一个可替换的 ws 引用，重连时旧的弃、新的上，外部拿到的封装对象不变。
[click] onopen 时补发排队消息。
[click] onclose 是重连的枢纽：如果是用户主动关、或收到正常关闭码 1000，就不重连；否则排程一个带退避的重连——退避加抖动的具体算法是策略，在网络章。
[click] send 前判 readyState，未 OPEN 就入待发队列。

[click:2] 底下两条是封装的通用要点，不分框架：一要区分「用户主动关」和「异常断开」，主动关后不该重连；二要 send 前判状态，彻底规避 CONNECTING 态 send 抛 InvalidStateError。Vue 用 composable 加 onUnmounted 关，React 用 useEffect 的 cleanup 关——核心都是把连接生命周期绑到组件生命周期，卸载必 close。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# `WebSocketStream`：前沿，补背压短板（仅 Chromium）

::left::

```js {1|2-4|6-8|all}
if ("WebSocketStream" in window) { // 非标准，必先检测
  const wss = new WebSocketStream(url, { signal }); // 可中止建连
  const { readable, writable } = await wss.opened;
  const writer = writable.getWriter();
  await writer.write("hi"); // 发太快自动 await 等——天然背压
  const reader = readable.getReader();
  const { value } = await reader.read(); // 读得慢，上游自动放缓
}
```

::right::

<table class="decision-table">
  <thead><tr><th>维度</th><th>标准 WS</th><th>Stream</th></tr></thead>
  <tbody>
    <tr v-click><td>形态</td><td>事件</td><td>Promise + Streams</td></tr>
    <tr v-click><td>接收背压</td><td>无</td><td>有</td></tr>
    <tr v-click><td>发送背压</td><td>轮询</td><td>有</td></tr>
    <tr v-click><td>标准化</td><td>全绿</td><td>仅 Chromium</td></tr>
  </tbody>
</table>

<div v-click class="signal signal-bad mt-3">
  <carbon:warning-alt />
  <span>**非标准、Firefox / Safari 无**——特性检测 + 降级，别当生产主线。</span>
</div>

<!--
WebSocketStream 是为解决标准 WebSocket 无背压短板而生的新 API：用 Streams 收发，ReadableStream 和 WritableStream 天然带背压。

[click:3] 用前必须特性检测，因为它非标准。构造支持 AbortSignal，可以在握手完成前中止连接——这是标准 WebSocket 没有的能力。opened 是个 Promise，resolve 出可读可写流。await writer.write 发太快会自动等，await reader.read 读得慢上游自动放缓，收发两侧都不用再手动轮询 bufferedAmount。

[click:4] 右边对比：标准 WebSocket 是事件驱动、接收无背压、发送靠轮询，但全绿；WebSocketStream 是 Promise 加 Streams、收发都有背压，但只有 Chromium 支持。
[click] 最重要的提醒：它非标准，Firefox 和 Safari 完全不支持，也没进标准轨道。它是「知道有这么个更优形态」的前沿了解对象。绝大多数项目的现实答案，还是标准 WebSocket 加上一页那个封装骨架。
-->

---
layout: default
---

# 选型：WebSocket vs SSE vs WebTransport（API 视角）

<table class="decision-table mt-3">
  <thead><tr><th>维度</th><th>WebSocket</th><th>SSE（EventSource）</th><th>WebTransport</th></tr></thead>
  <tbody>
    <tr v-click><td>方向</td><td>**全双工双向**</td><td>服务器 → 客户端单向</td><td>双向</td></tr>
    <tr v-click><td>API 形态</td><td>事件（`onmessage` + `send`）</td><td>事件（只收）</td><td>Streams + datagrams</td></tr>
    <tr v-click><td>数据类型</td><td>文本 + 二进制</td><td>**仅文本**</td><td>文本 + 二进制</td></tr>
    <tr v-click><td>自动重连</td><td>**无**（自己写）</td><td>**内建**（带 `Last-Event-ID`）</td><td>无</td></tr>
    <tr v-click><td>背压</td><td>接收无、发送轮询</td><td>无（只收）</td><td>**Streams 天然背压**</td></tr>
    <tr v-click><td>一句话</td><td>双向、二进制、自管重连</td><td>单向、纯文本、省心自带重连</td><td>双向 + 背压 + 不可靠 datagram</td></tr>
  </tbody>
</table>

<div v-click class="takeaway mt-4">只要服务器**单向推文本** → 选 SSE（省一堆重连代码）；要**双向、二进制、低延迟互推** → WebSocket；要**双向 + 背压 + 不可靠 datagram** 且能接受较新支持面 → WebTransport（了解为主）。</div>

<!--
三个实时通信 API 放一张表，从 API 能力视角对比，协议和性能取舍在网络章。

[click:5] 方向上 WebSocket 全双工，SSE 只有服务器到客户端单向，WebTransport 双向。API 形态 WebSocket 是事件加 send，SSE 只收，WebTransport 是 Streams 加 datagram。数据类型 SSE 只能文本，另两个文本二进制都行。自动重连是关键差异：SSE 内建、还自带 Last-Event-ID 断点续推，WebSocket 完全要自己写。背压 WebTransport 最强，Streams 天然背压。

[click] 选型速断：单向推文本选 SSE，能省一大堆重连代码；要双向、要二进制、要低延迟互推选 WebSocket；要双向加背压加可选不可靠 datagram，比如音视频或游戏状态，且能接受较新支持面，看 WebTransport，目前以了解为主。
-->

---
layout: default
---

# 易错点 TOP：消息神秘丢失先查这里

<div class="grid grid-cols-2 gap-4 mt-5">
  <div v-click class="fact"><strong>`new` 完立刻 `send`</strong><span>此刻是 CONNECTING → 抛 `InvalidStateError`，必须等 open</span></div>
  <div v-click class="fact"><strong>CLOSING / CLOSED 态 `send`</strong><span>**静默丢弃、不报错**——消息神秘消失头号嫌疑</span></div>
  <div v-click class="fact"><strong>`close(1001)` / `close(500)`</strong><span>只能 `1000` 或 `3000`–`4999`，其余抛 `InvalidAccessError`</span></div>
  <div v-click class="fact"><strong>以为断线会自动重连</strong><span>WebSocket **不自动重连**（与 SSE 相反），得自己写</span></div>
  <div v-click class="fact"><strong>二进制默认当 `ArrayBuffer` 用</strong><span>默认 `binaryType` 是 `"blob"`，`e.data` 是 `Blob`</span></div>
  <div v-click class="fact"><strong>狂发不看 `bufferedAmount`</strong><span>缓冲满浏览器**自动断连**，大流量必须节流</span></div>
  <div v-click class="fact"><strong>指望 `error` 给原因</strong><span>它无任何细节，诊断看 `close` 的 `code` / `wasClean`</span></div>
  <div v-click class="fact"><strong>忘了 `close()`</strong><span>幽灵连接常驻后台，还挡 bfcache</span></div>
</div>

<!--
最后把全片的坑浓缩成八条，按「收不到消息 / 消息丢失」的排查频率排。

[click:8] 一，new 完立刻 send，CONNECTING 态抛异常；二，CLOSING / CLOSED 态 send 静默丢弃、不报错，这是消息神秘消失第一嫌疑；三，close 只认 1000 和 3000 到 4999，传 1001 或 500 都抛 InvalidAccessError；四，别以为断线会自动重连，WebSocket 不自动重连，这点和 SSE 相反；五，二进制默认是 blob 不是 ArrayBuffer，要字节先设 arraybuffer 或 await blob.arrayBuffer；六，狂发不看 bufferedAmount，缓冲满会被自动断连；七，别指望 error 给原因，诊断全看 close 的 code 和 wasClean；八，忘了 close 就是幽灵连接常驻后台还挡 bfcache。这八条覆盖了日常九成的翻车现场。
-->

---
layout: center
class: summary-slide
---

# 带走四个判断

<div class="summary-grid mt-8">
  <div><span>01</span><strong>四态不可逆、实例不可复用</strong><small>多一个 CLOSING；重连必须 `new` 新实例</small></div>
  <div><span>02</span><strong>send 看状态、close 看码</strong><small>CONNECTING 抛 / CLOSED 静默丢；码只能 `1000` 或 `3000`–`4999`</small></div>
  <div><span>03</span><strong>背压是唯一短板</strong><small>发送轮询 `bufferedAmount`，接收无背压；`binaryType` 默认 `blob`</small></div>
  <div><span>04</span><strong>长连接必管生命周期</strong><small>`pagehide` 关、`pageshow` 重建、卸载必 `close()`</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" target="_blank"><carbon:book /> MDN WebSocket</a>
  <a href="https://websockets.spec.whatwg.org/" target="_blank"><carbon:document /> WHATWG 标准</a>
  <a href="https://github.com/whatwg/websockets" target="_blank"><carbon:logo-github /> whatwg/websockets</a>
</div>

<!--
四句话复盘：一，readyState 四态不可逆，比 SSE 多一个 CLOSING，实例走到 CLOSED 就作废，重连必须 new 新的；二，send 对状态敏感，CONNECTING 抛异常、CLOSED 静默丢弃，close 的码只能是 1000 或 3000 到 4999；三，背压是标准 WebSocket 唯一的能力短板，发送靠轮询 bufferedAmount、接收完全没有，binaryType 还默认 blob 与 RTCDataChannel 相反；四，它是长连接，必须管生命周期，pagehide 关、pageshow 重建、组件卸载必 close，否则幽灵连接加挡 bfcache。

握手、帧、心跳、重连策略、关闭码运维语义在网络章，配合这份对象 API 面一起读，WebSocket 就算吃透了。
-->
