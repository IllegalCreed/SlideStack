---
theme: seriph
layout: cover
title: Server-Sent Events
info: |
  浏览器原生的服务器单向推送：EventSource 正统用法、事件流解析、重连语义与 fetch 流式替代。

  Learn more at [MDN Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark">SSE</div>

# Server-Sent Events

## 一条不结束的 HTTP 响应，浏览器原生的服务器单向推送

<div class="cover-meta">
  <span>WHATWG HTML Living Standard</span>
  <span>EventSource · 事件流解析 · 自动重连 · fetch 流式</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events" target="_blank" class="slidev-icon-btn" aria-label="MDN 文档">
    <carbon:document />
  </a>
  <a href="https://github.com/whatwg/html" target="_blank" class="slidev-icon-btn" aria-label="whatwg/html GitHub">
    <carbon:logo-github />
  </a>
</div>

<!--
SSE 是浏览器内建的服务器单向推送能力，定义在 WHATWG HTML Living Standard 里，不是独立规范。它从 2010 年前后就进入各引擎，Baseline Widely available，十几年没变也不需要变。

近年它因 AI 流式输出重新翻红——ChatGPT 类接口的流式响应正是 SSE 格式。这份幻灯片走两条主线：EventSource 的正统用法，以及 AI 场景为什么改用 fetch 流式消费同一种格式。
-->

---
layout: default
---

# 为什么需要"服务器推"：三种姿势，一图看懂

<div class="pipeline mt-8">
  <div class="pipeline-step tone-amber">
    <span class="step-no">轮询</span>
    <strong>每隔几秒问一遍</strong>
    <span>大量空询 · 延迟取决于间隔</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-blue">
    <span class="step-no">长轮询</span>
    <strong>问一次吊着等</strong>
    <span>有数据才响应 · 答完就得重新问</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-green">
    <span class="step-no">SSE</span>
    <strong>订一次，持续收</strong>
    <span>一条不结束的响应里连续派发事件</span>
  </div>
</div>

<div class="grid grid-cols-3 gap-4 mt-8">
  <div v-click class="fact"><strong>单向</strong><span>只有服务器到客户端；双向场景选 WebSocket</span></div>
  <div v-click class="fact"><strong>复用 HTTP 全家桶</strong><span>鉴权、压缩、CDN、负载均衡照常工作</span></div>
  <div v-click class="fact"><strong>纯文本 UTF-8</strong><span>裸眼可读，`curl -N` 就能调试</span></div>
</div>

<div v-click class="takeaway mt-6">协议层的完整叙事（演进史、与 WebSocket 的选型）在网络章已展开；本片假定你已确认"单向文本推送选 SSE"，聚焦浏览器 API 与工程实践。</div>

<!--
先把动机一页带过：客户端反复问是轮询，问一次吊着是长轮询，SSE 则是订阅——服务器有数据随时写进同一条响应。

[click] 它是单向的，客户端要发言得另开普通请求。
[click] 它的本质是一条普通 GET 加长响应，所以 HTTP 的既有基础设施全部可用，不像 WebSocket 要为独立协议单独铺路。
[click] 事件流是纯文本，curl 就能调试。
[click] 协议层对比这里不重复，网络章已经讲透；这份片子聚焦浏览器端怎么把它用好。
-->

---
layout: default
---

# 心智模型：订阅一条"不结束"的响应

<div class="seq mt-5">
  <div class="seq-head"><span>浏览器</span><span>服务器</span></div>
  <div class="seq-row to-server">GET /events ─────────────────────────────▶</div>
  <div v-click class="seq-row to-client">◀───────────── 200 OK · Content-Type: text/event-stream</div>
  <div v-click class="seq-row to-client">◀───────────── data: 事件 1　（响应保持不结束，随时再写一段）</div>
  <div v-click class="seq-row to-client">◀───────────── : 心跳注释</div>
  <div v-click class="seq-row seq-break">✕ 断线 → 浏览器等一会儿自动重连，并带上 Last-Event-ID 请求头</div>
</div>

<div class="grid grid-cols-3 gap-4 mt-6">
  <div v-click class="fact"><strong>是订阅，不是请求—响应</strong><span>事件何时到、到多少，由服务器决定</span></div>
  <div v-click class="fact"><strong>空行是发令枪</strong><span>一个空行宣告事件完整，浏览器随即派发</span></div>
  <div v-click class="fact"><strong>断线重连是浏览器的事</strong><span>抖动、重启、掐线，都自动兜底</span></div>
</div>

<!--
EventSource 的一切行为都源自一个事实：它发的是一次普通 GET，但对方的响应永远"没写完"。

[click] 响应头通过校验后连接进入 OPEN。
[click] 之后服务器随时往响应里追加一段文本，浏览器持续解析派发。
[click] 冒号开头的行是注释，常用来保活。
[click] 连接断了浏览器自己重连，还替你捎上"我读到哪了"。

[click:3] 三个心智锚点请记住：订阅语义、空行派发、重连内建。后面所有细节都挂在这三条上。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 一分钟上手：零依赖的最小可运行示例

::left::

### 服务端（Node，任何框架同理）

```js {2-5|6|7-10|11|all}
createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream", // 铁律
    "Cache-Control": "no-cache",
  });
  res.write("retry: 5000\n\n"); // 建议重连间隔
  let id = 0;
  const timer = setInterval(() => {
    res.write(`id: ${++id}\ndata: tick ${id}\n\n`);
  }, 1000);
  req.on("close", () => clearInterval(timer)); // 防泄漏
}).listen(3000);
```

::right::

### 客户端（浏览器）

```js {1|3|5-7|9-10|all}
const es = new EventSource("/events");

es.onopen = () => console.log(es.readyState); // 1 = OPEN

es.onmessage = (e) => {
  console.log(e.data, e.lastEventId); // data 永远是字符串
};

// 退订的唯一方式：没有 close 事件，置 null 不断连
es.close();
```

<div v-click class="mini-note mt-4">断线实验：杀掉 Node 再重启，5 秒内自动恢复推送；DevTools 网络面板可见重连请求自动带 `Last-Event-ID` 头。</div>

<!--
服务端三步：响应头三件套（MIME 必须是 text/event-stream）、可选的 retry 建议、之后每条消息就是"若干字段行 + 一个空行"。

[click] retry 作为流的第一段写出去，让第一次断线就用你定的节奏。
[click] 每秒写一个带 id 的事件，空行触发派发。
[click] 客户端断开时记得清理定时器。

[click:2] 客户端一行构造即发起连接，没有手动 connect 阶段。
[click:2] onmessage 的 e.data 永远是字符串，JSON 要自己 parse。
[click] close 是唯一退订手段。
[click:2] 强烈建议现场做一次断线实验，SSE 最值钱的重连能力零代码就能看到。
-->

---
layout: default
---

# 事件流格式：四个字段 + 一个空行

<div class="grid grid-cols-[.92fr_1.08fr] gap-7 mt-4 items-start">

```text
retry: 10000

: 心跳注释（客户端不可见）

data: 你好

event: price
id: 42
data: {"symbol":"AAPL"}
data: {"line":2}
```

<table class="decision-table">
  <thead><tr><th>字段</th><th>语义</th></tr></thead>
  <tbody>
    <tr v-click><td><code>data:</code></td><td>值追加进数据缓冲；多行以 <code>\n</code> 拼接，末尾一个换行剥掉</td></tr>
    <tr v-click><td><code>event:</code></td><td>设定本次事件类型；派发后重置回 <code>message</code></td></tr>
    <tr v-click><td><code>id:</code></td><td>写入"最后事件 ID"；派发后不清空、持续沿用</td></tr>
    <tr v-click><td><code>retry:</code></td><td>重连等待毫秒数；仅纯 ASCII 数字有效</td></tr>
  </tbody>
</table>

</div>

<div v-click class="takeaway mt-5">**空行才是发令枪**：连续两个换行宣告事件完整、触发派发；未知字段一律忽略（向前兼容），最后一个块的 `e.data` 是两行 JSON 以 `\n` 拼接的结果。</div>

<!--
事件流是 UTF-8 纯文本，每行"字段名: 值"。左边这段流覆盖了全部四个字段。

[click] data 可以连写多行，派发时以换行符拼接——这是传多行文本的正规姿势。
[click] event 决定消息派发给谁，下一页专门展开。
[click] id 是断点续推的记账凭据。
[click] retry 只认纯数字，写 5s 会被整行忽略。
[click] 最关键的规则：空行才触发派发。写服务端时每条消息末尾的两个换行一个都不能少。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 解析规则的魔鬼细节：写服务端必须照办

::left::

### 行级判定（浏览器内置解析器）

<table class="decision-table">
  <thead><tr><th>行形态</th><th>处理</th></tr></thead>
  <tbody>
    <tr><td>空行</td><td>派发累积的事件；数据缓冲为空则不派发</td></tr>
    <tr><td>以冒号开头</td><td>注释，整行忽略</td></tr>
    <tr><td>含冒号</td><td>首个冒号切字段名 / 值</td></tr>
    <tr><td>不含冒号</td><td>整行是字段名，值为空串</td></tr>
  </tbody>
</table>

<div v-click class="mini-note mt-3">行尾 CRLF / LF / CR 均合法；编码只能 UTF-8；流开头一个 BOM 被剥掉。</div>

::right::

### 三个最易踩的细节

<div class="rule-stack">
  <div v-click class="rule tone-amber"><strong>冒号后恰好一个空格被剥</strong><span>`data:test` 等价 `data: test`；两个空格保留一个</span></div>
  <div v-click class="rule tone-amber"><strong>裸 `id` 行 = 重置</strong><span>无冒号则值为空串，把"最后事件 ID"清空</span></div>
  <div v-click class="rule tone-red"><strong>字段名大小写敏感</strong><span>`Data:` / `EVENT:` 按未知字段整行忽略</span></div>
</div>

<div v-click class="col-span-2 takeaway mt-4">流半途断掉时，未以空行收尾的残块**整体丢弃**、不派发不完整事件——这些规则下一页全部亲手验证。</div>

<!--
EventSource 之所以"零解析成本"，是因为浏览器内置了一套严格定义的行式解析器。写服务端时必须按它的规则产出。

左表是行级判定的全部四种形态，特别注意"数据缓冲为空则不派发"。

[click] 行尾三种换行都合法，编码没有商量余地。
[click] 冒号后只剥一个空格，想保留前导空格就多写一个。
[click] 裸 id 行不是语法错误，是"重置最后事件 ID"的正规手段。
[click] 大小写写错的字段静默失效，流"看着对"但客户端毫无反应，非常隐蔽。
[click] 残块丢弃保证了不派发半截事件。下一页交互实验室里逐条验证。
-->

---
layout: default
class: lab-slide
---

# 交互实验：事件流解析实验室

<EventStreamLab />

<!--
左侧是可编辑的原始事件流文本，右侧是按 WHATWG 规范逐行解析的结果：每行被判定成什么字段、每个块最终派发成什么事件、底部是连接状态。

演示脚本：先看"四字段全家福"——注释块和 retry 块都不派发任何事件，但 retry 的副作用生效了（看底部状态栏）；两行 data 以换行拼接；price 块派发的是命名事件。

切到"空块与心跳"——event: ping 没有 data，空行到来不派发；而空值 data: 行仍会派发空字符串；大小写错误的 Data: 被当未知字段；最后一行没有空行收尾，整块丢弃。

切到"id 记账与重置"——第二条消息没带 id 却沿用 41；裸 id 行把 lastEventId 重置为空，底部显示"重连不带 Last-Event-ID 头"；retry: 5s 整行忽略。鼓励现场随手改文本观察变化。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# `event:` 改变收件人：onmessage 的精确语义

::left::

### 服务器发出三条消息

```text
data: 无类型消息

event: price
data: {"symbol":"AAPL","price":211.5}

event: message
data: 显式写 event: message
```

<div v-click class="mini-note mt-3">事件名可以是任意字符串，但避开 `open` / `error` 保留名——业务消息与连接事件混在同一 target 上难分辨。</div>

::right::

### 客户端的接收方

```js {1-2|4-8|all}
// 第 1、3 条到这里：无 event: 字段 + event: message
es.onmessage = (e) => console.log(e.data);

// 第 2 条只到这里：命名事件必须 addEventListener
es.addEventListener("price", (e) => {
  const quote = JSON.parse(e.data); // data 永远是字符串
  render(quote.symbol, quote.price);
});
```

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>"服务端加了 `event:`、客户端还挂 `onmessage`"是收不到消息的第一嫌疑</span>
</div>

<!--
onmessage 的语义比直觉窄：它只接收"没有 event: 字段"的消息和"event: message"的消息，其他命名事件一概不进。

[click] 无类型消息和显式 message 类型都走 onmessage。
[click] 命名事件必须用 addEventListener 挂对应类型。
[click] 排查"收不到消息"时第一个检查点就是这里：服务端加了类型、客户端没改监听。
[click] 另外事件名避开保留名，敏感指令处理前还可以用 e.origin 核对事件流来源。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# readyState 三态与 error 的双语义

::left::

### 状态流转

<table class="decision-table">
  <thead><tr><th>时机</th><th>readyState</th><th>事件</th></tr></thead>
  <tbody>
    <tr><td>构造之初</td><td><code>CONNECTING(0)</code></td><td>—</td></tr>
    <tr v-click><td>200 + 正确 MIME</td><td><code>OPEN(1)</code></td><td><code>open</code>（每次重连成功都再触发）</td></tr>
    <tr v-click><td>断线进入重连等待</td><td><code>CONNECTING(0)</code></td><td><code>error</code>（每轮一次）</td></tr>
    <tr v-click><td>致命失败</td><td><code>CLOSED(2)</code></td><td><code>error</code></td></tr>
    <tr v-click><td>调用 <code>close()</code></td><td><code>CLOSED(2)</code></td><td>无</td></tr>
  </tbody>
</table>

::right::

### 同一个 error，两种处境

```js
es.onerror = () => {
  if (es.readyState === EventSource.CONNECTING) {
    // 浏览器已接管：自动重连中，无需人工干预
  } else if (es.readyState === EventSource.CLOSED) {
    // 已死心：要重来只能 new 一个新实例
  }
};
```

<div v-click class="mini-note mt-3">`error` 事件对象本身几乎无信息（规范专门建议浏览器在 DevTools 里补充诊断细节）——判断处境只能靠 `readyState`。</div>

<!--
接口全貌很小：三个只读属性、一个方法、三个事件。真正要理解的是状态流转。

[click] open 在每次成功建连时都触发，包括重连成功，适合用来消除"连接波动"横幅。
[click] error 的第一种语义：掉线了、我正准备重连——此刻 readyState 是 CONNECTING，浏览器已接管。
[click] error 的第二种语义：彻底放弃——此刻是 CLOSED，绝不再重连。
[click] close 静默生效，连 error 都不触发。
[click] 判别姿势就右边这几行：error 事件本身不带信息，一切看 readyState。
-->

---
layout: default
---

# 自动重连状态机：什么时候重连，什么时候放弃

<div class="machine-nodes mt-4">
  <div class="machine-node n-connecting"><strong>CONNECTING</strong><small>首连 / 重连等待中</small></div>
  <div class="machine-node n-open"><strong>OPEN</strong><small>已连通，派发中</small></div>
  <div class="machine-node n-closed"><strong>CLOSED</strong><small>终态，绝不再重连</small></div>
</div>

<div class="edge-list mt-4">
  <div v-click class="edge-row"><code>CONNECTING → OPEN</code><span>200 + `text/event-stream` 校验通过（触发 `open`）</span></div>
  <div v-click class="edge-row"><code>OPEN → CONNECTING</code><span>网络错误 / **响应正常结束**：等 retry 间隔（浏览器可叠加退避）后自动重连</span></div>
  <div v-click class="edge-row"><code>任意 → CLOSED</code><span>非 200（含 204 / 4xx / 5xx）、MIME 不对、请求被中止：致命失败</span></div>
  <div v-click class="edge-row"><code>任意 → CLOSED</code><span>`close()`：静默关闭，无事件</span></div>
</div>

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>反直觉一：服务器体面地 end 掉响应也算断线，**照样重连**——一次性任务会被反复触发</span>
</div>
<div v-click class="signal signal-bad mt-2">
  <carbon:warning-alt />
  <span>反直觉二：非 200 一律死刑，502 抖动一次订阅就永久挂——生产要在 CLOSED 后自建带退避的重建兜底</span>
</div>
<div v-click class="signal signal-good mt-2">
  <carbon:checkmark-outline />
  <span>规范钦点的停止信号：**HTTP 204**——服务端拦停重连的正解；客户端侧则是显式 `close()`</span>
</div>

<!--
规范用两个动词严格区分连接结束的处置：reestablish 重连，fail 致命失败。这张状态机图就是全部语义。

[click] 校验通过进 OPEN。
[click] 重连的两种触发：网络错误，以及最容易被忽视的"响应正常结束"。
[click] 致命失败的三种触发：非 200、MIME 错、请求被中止。注意 4xx、5xx 全在其中。
[click] close 是唯一的主动出口。

[click] 反直觉一：SSE 的世界观里响应就不该结束，把它当一次性接口用，服务端会被隔几秒反复触发。
[click] 反直觉二：EventSource 不会对 5xx"过一会儿再试"，网关偶发一个 502 就永久杀死订阅，生产代码要自己兜底。
[click] 服务端想让客户端死心，对重连请求回 204——这是规范钦点的停止信号。
-->

---
layout: default
---

# lastEventId 断点续推：不只连得上，还要不丢数据

<div class="seq mt-4">
  <div class="seq-head"><span>浏览器</span><span>服务器</span></div>
  <div class="seq-row to-client">◀───────────── id: 41 ↵ data: …　（浏览器记住 41）</div>
  <div v-click class="seq-row to-client">◀───────────── id: 42 ↵ data: …　（记住 42）</div>
  <div v-click class="seq-row seq-break">✕ 断线（网络抖动 / 服务重启 / 代理掐线）→ 等待 retry 间隔</div>
  <div v-click class="seq-row to-server">GET /events　+　Last-Event-ID: 42 ─────────────▶　（自动携带，零代码）</div>
  <div v-click class="seq-row to-client">◀───────────── 从 43 开始补发（无缝续上）</div>
</div>

<div class="grid grid-cols-3 gap-4 mt-6">
  <div v-click class="fact"><strong>服务端三件事</strong><span>单调递增 id · 保留近期事件窗口 · 按 `Last-Event-ID` 从断点补发</span></div>
  <div v-click class="fact"><strong>窗口滑出别硬撑</strong><span>退化为全量重推 + 客户端幂等消费（按业务主键去重）</span></div>
  <div v-click class="fact"><strong>只在内建重连时携带</strong><span>首连、页面刷新都不带——跨会话续推要自己持久化进 URL</span></div>
</div>

<!--
重连解决"连得上"，Last-Event-ID 解决"不丢数据"。机制全靠事件流里的 id 字段记账。

[click] 每个带 id 的事件都会更新连接的"最后事件 ID"，没带 id 的消息沿用旧值。
[click] 断线后浏览器等待 retry 间隔。
[click] 重连请求自动带上 Last-Event-ID 头，这是服务端断点续推的唯一钩子；最后事件 ID 为空则不带。
[click] 服务端从断点之后补发，用户无感。

[click] 续推能力要服务端配合：递增 id、保留窗口、按头补发。
[click] 断线太久窗口滑出时，全量重推加幂等消费，别硬保证不重不漏。
[click] 注意这个头只在浏览器内建重连时发送，"最后事件 ID"是连接对象的内存状态，不落盘。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# HTTP/1.1 六连接红线：多开标签页就翻车

::left::

### 配额按"浏览器 + 域名"计

<div class="slot-board mt-2">
  <div class="slot">标签页 1<br>1 条 SSE</div>
  <div class="slot">标签页 2<br>1 条 SSE</div>
  <div class="slot">标签页 3<br>1 条 SSE</div>
  <div class="slot">标签页 4<br>1 条 SSE</div>
  <div class="slot">标签页 5<br>1 条 SSE</div>
  <div class="slot">标签页 6<br>1 条 SSE</div>
  <div v-click class="slot blocked">第 7 个标签页：SSE 连同该域一切请求排队挂起——"整个网站卡死"</div>
</div>

<div v-click class="mini-note mt-3">MDN 在 EventSource 文档里加粗警告的坑；Chrome / Firefox 明确标记 **Won't fix**。</div>

::right::

### 两条正解

<div class="rule-stack">
  <div v-click class="rule tone-green"><strong>HTTP/2（治本）</strong><span>多路复用共享一条 TCP，并发流上限由双方协商、默认 100——生产跑 SSE 的默认前提</span></div>
  <div v-click class="rule tone-blue"><strong>SharedWorker（治标也治费）</strong><span>多标签页共享一条 `EventSource`（规范作者注推荐），还省服务器连接数</span></div>
</div>

```js
// shared-worker.js：所有同源标签页共享这一条
const es = new EventSource("/events");
es.onmessage = (e) =>
  ports.forEach((p) => p.postMessage(e.data));
```

<!--
HTTP/1.1 下浏览器对每个域名的并发连接上限约 6 条，而且按"浏览器 + 域名"计，跨标签页累计。每页挂一条 SSE，六个标签页就把配额吃光。

[click] 第 7 个标签页的现象不是"SSE 连不上"，而是同域一切请求排队——整个网站看起来卡死了。
[click] 浏览器厂商明确不修，这是需要架构上回避的约束。

[click] 治本方案是部署层启用 HTTP/2，多路复用后六连接问题基本消失。
[click] SharedWorker 让多标签页共用一条物理连接，页面从 worker 的 port 收数据，而不是各自开 EventSource。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 代理缓冲坑与心跳看门狗

::left::

### 症状 → 排查

<table class="decision-table">
  <thead><tr><th>浏览器侧症状</th><th>处理</th></tr></thead>
  <tbody>
    <tr v-click><td><code>open</code> 迟迟不来 / 事件攒批到达</td><td>Nginx 类反代默认缓冲：<code>X-Accel-Buffering: no</code> 或 <code>proxy_buffering off</code>；慎用响应压缩</td></tr>
    <tr v-click><td>每隔固定几十秒断一次再重连</td><td>代理空闲超时掐线：服务端每约 15 秒发一行 <code>: ping</code> 注释</td></tr>
    <tr v-click><td>断了但 <code>error</code> 不来、数据也不来</td><td>半开连接假死：客户端看门狗超时重建</td></tr>
  </tbody>
</table>

::right::

### 暗礁：注释行喂不了看门狗

<div v-click class="signal signal-bad mb-3">
  <carbon:warning-alt />
  <span>`: ping` 对客户端 JS **完全不可见**——骗得过代理，测活得用真实事件</span>
</div>

```js
// 服务端：测活心跳改用真实事件
setInterval(() => res.write("event: ping\ndata: 1\n\n"), 15000);
```

```js
// 客户端：40s 无任何事件 → 重建（阈值 > 心跳 × 2）
let dog;
const feed = () => {
  clearTimeout(dog);
  dog = setTimeout(reconnect, 40000);
};
es.onmessage = (e) => { feed(); render(e.data); };
es.addEventListener("ping", feed);
es.onerror = feed; // 正在自动重连时，别误杀
```

<!--
SSE 的实时性依赖"每个事件立即冲到客户端"，而 HTTP 链路每一层都可能在攒缓冲。这页按浏览器侧症状给排查路径。

[click] open 不来或事件成批到达，八成是反向代理在缓冲，按路由关掉。
[click] 固定周期掉线是代理空闲超时，规范作者注的经典建议：每 15 秒左右一行注释保活。
[click] 最阴的是半开连接：对端悄悄消失，TCP 没收到 FIN，浏览器不知道断了。

[click] 这里有个协议层暗礁：注释行不触发任何客户端事件，它救得了代理超时，喂不了客户端的看门狗。测活心跳必须用真实事件，客户端超时无事件就主动重建，onerror 也要喂狗防止误杀正在自动重连的连接。
-->

---
layout: default
---

# 认证局限：请求头无门，只有三条出路

<div class="signal signal-bad mt-2">
  <carbon:warning-alt />
  <span>构造选项只有 `withCredentials` 一项——`Authorization: Bearer` 连塞的地方都没有</span>
</div>

<div class="grid grid-cols-3 gap-4 mt-4">
  <div v-click class="rule tone-blue"><strong>出路一：Cookie</strong><span>同源零配置；跨域三件套：`withCredentials: true` + 明确 `Allow-Origin` + `Allow-Credentials: true`</span></div>
  <div v-click class="rule tone-green"><strong>出路二：URL 短票</strong><span>先用带 `Authorization` 的请求换一次性短时效 ticket，再拼 URL 开流</span></div>
  <div v-click class="rule tone-amber"><strong>出路三：换 fetch 流式</strong><span>两条都嫌绕、或后端只认 Bearer——`EventSource` 的能力边界到了（下一页）</span></div>
</div>

````md magic-move {at:4}
```js
// ✗ 长期 token 直接拼 URL：落入访问日志、代理日志与浏览器历史
const es = new EventSource(`/events?token=${longLivedToken}`);
```

```js
// ✓ 先换短票再开流——即使进了日志，票也早已失效
const { ticket } = await (
  await fetch("/api/sse-ticket", {
    headers: { Authorization: `Bearer ${token}` },
  })
).json();
const es = new EventSource(`/events?ticket=${encodeURIComponent(ticket)}`);
```
````

<!--
EventSource 最大的工程局限：构造函数没有任何塞自定义请求头的入口，现代 API 标配的 Bearer 认证直接无门。

[click] 出路一走 Cookie：同源自动携带；跨域要凑齐凭据三件套，跨站 Cookie 还需要 SameSite=None 加 Secure。
[click] 出路二走 URL：但长期 token 拼 URL 风险不可接受。
[click] 两条都走不通，就该换 fetch 流式了。

[click] 短票模式的正确姿势看这段演化：先用正经带认证头的请求换一张一次性短票（比如 60 秒有效），再拿票开流——即使进了日志，票也早已失效。
-->

---
layout: default
---

# AI 流式响应仍是 SSE 格式，为什么绕开 EventSource

<div class="grid grid-cols-[1.02fr_.98fr] gap-7 mt-4 items-start">

<div class="rule-stack">
  <div v-click class="rule tone-red"><strong>墙一：只能 GET、无请求体</strong><span>对话上下文动辄几十 KB，塞不进 URL</span></div>
  <div v-click class="rule tone-red"><strong>墙二：无法带 `Authorization`</strong><span>LLM API 的标准门禁直接无门</span></div>
  <div v-click class="rule tone-red"><strong>墙三：错误体不可读</strong><span>429 的配额详情只剩一个干瘪 `error` 事件</span></div>
  <div v-click class="rule tone-red"><strong>墙四：正常结束也重连</strong><span>一次性生成被反复触发、token 反复计费</span></div>
</div>

<div>

```text
data: {"choices":[{"delta":{"content":"你"}}]}

data: {"choices":[{"delta":{"content":"好"}}]}

data: [DONE]
```

```text
event: content_block_delta
data: {"delta":{"text":"你好"}}

event: message_stop
data: {"type":"message_stop"}
```

<div class="mini-note mt-2">上：OpenAI 风格（只用 `data:`，以 `[DONE]` 哨兵收尾）；下：Anthropic 风格（命名事件流，须按 `event:` 分派）。</div>

</div>

</div>

<div v-click class="takeaway mt-4">行业默契：服务端继续用 SSE 格式下发（简单、可调试、基建友好），**浏览器端换 fetch 消费**——四堵墙全拆。</div>

<!--
抓包看主流 LLM API 的流式响应，Content-Type 依旧是 text/event-stream，语法和前面讲的完全一致——但客户端读法变了。

[click] 墙一：AI 接口清一色 POST 加 JSON body，EventSource 只能 GET。
[click] 墙二：Bearer 认证无门，第三方 API 连 Cookie、短票出路都不适用。
[click] 墙三：配额用尽时的 429 错误详情，EventSource 一个字节都拿不到。
[click] 墙四：生成完毕服务器体面收流，EventSource 视为断线自动重发——同一个 prompt 反复触发、反复计费，订阅型的贴心设计在一次性任务里是事故。

右边两段流对应两种风格：OpenAI 只看 data 行加识别哨兵；Anthropic 要读 event 字段按类型分派。
[click] 于是行业形成默契：下发格式不变，消费方式换成 fetch。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# fetch + ReadableStream：手动消费同一种流

::left::

### 请求侧：四堵墙全拆

```js {1-6|7-8|all}
const res = await fetch("/v1/chat/completions", {
  method: "POST",                    // 可 POST
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify({ messages, stream: true }),
  signal: controller.signal,         // 随时取消
});
// 非 200：状态码 + 错误体完整可读
if (!res.ok) throw new Error(await res.text());
```

<div v-click class="mini-note mt-3">`AbortController` 就是"停止生成"按钮的标准实现；`abort()` 后 `read()` 以 `AbortError` 拒绝。</div>

::right::

### 响应侧：读流 + 切块解析

```js {1-3|4-8|9-12|all}
const reader = res.body
  .pipeThrough(new TextDecoderStream()) // 跨块多字节安全
  .getReader();
let buffer = "";
while (true) {
  const { done, value } = await reader.read();
  if (done) break;        // 结束就是结束，不会自动重连
  buffer += value;
  const blocks = buffer.split(/\r?\n\r?\n/);
  buffer = blocks.pop();  // 残块必须留到下一轮！
  for (const { data } of blocks.map(parseBlock))
    if (data !== "[DONE]") append(JSON.parse(data));
}
```

<div v-click class="col-span-2 takeaway mt-4">代价是同时接手：SSE 解析、重连退避、`lastEventId` 记账全归你（生产可用 eventsource-parser）；一次性生成断了通常**整个请求重发**，别照抄订阅型断点续推。</div>

<!--
这页是 fetch 路线的最小完整实现，请求侧和响应侧各一半。

[click] 请求侧几行就把四堵墙全拆了：POST、认证头、可取消。
[click] 非 200 时能读出完整错误细节，这是 EventSource 做不到的。

[click:2] 响应侧的读流三件套：res.body 是 ReadableStream，pipeThrough TextDecoderStream 保证跨 chunk 的多字节字符不出乱码，再 getReader 循环读。
[click] 攒缓冲、按空行切事件块——网络分包与事件边界无关，末段经常只到了一半，必须留到下一轮，少了这步会随机丢事件或 JSON.parse 炸在半截 JSON 上。
[click] parseBlock 按前面实验室的规则逐行解析，识别 OpenAI 的 DONE 哨兵。

[click:2] 天下没有免费午餐：EventSource 白送的可靠性逻辑全要自己造。手动重连要点：指数退避加抖动、4xx 与 AbortError 不重试；但一次性生成的主流做法是整个请求重发。
-->

---
layout: default
---

# 选型：EventSource vs fetch 流式

<table class="decision-table mt-2">
  <thead><tr><th>维度</th><th>EventSource</th><th>fetch + ReadableStream</th></tr></thead>
  <tbody>
    <tr v-click><td>方法 / 请求头 / 体</td><td>仅 GET · 仅 <code>withCredentials</code> · 无体</td><td>任意（跨域自定义头触发预检）</td></tr>
    <tr v-click><td>解析 / 重连 / 续推</td><td>内建白送</td><td>全手写（或 eventsource-parser）</td></tr>
    <tr v-click><td>非 200 错误细节</td><td>拿不到（干瘪的 <code>error</code> 事件）</td><td>状态码 + 响应体完整可读</td></tr>
    <tr v-click><td>取消</td><td><code>close()</code></td><td><code>AbortController</code></td></tr>
    <tr v-click><td>流结束语义</td><td>视为断线 → 自动重连（订阅心智）</td><td><code>done</code> 即结束（一次性心智）</td></tr>
    <tr v-click><td>典型场景</td><td>通知 · 行情 · 日志 · 进度（常驻订阅）</td><td>AI 生成 · 带认证头的一次性流</td></tr>
  </tbody>
</table>

<div v-click class="takeaway mt-5">fetch 换来**请求侧的全部自由**，付出**响应侧的全部手工**；服务端不用二选一——同一个 `text/event-stream` 端点天然同时伺候两种客户端。</div>

<!--
两条路线走完，用一张表定选型。

[click] 请求侧的自由度差异是根本分歧。
[click] EventSource 三行代码换来的内建可靠性，fetch 路线要几十行起步。
[click] 错误可观测性在生产排障时价值巨大。
[click] 取消语义 fetch 反而更好，signal 可以贯穿业务层。
[click] 流结束语义是两种心智模型：订阅 vs 一次性。
[click] 所以决策树很短：常驻订阅、Cookie 认证够用，选 EventSource；要认证头、POST 大参数、一次性生成，选 fetch。
[click] 服务端同一个端点即可同时服务两种客户端，不用站队。
-->

---
layout: default
---

# 易错点 TOP 6：收不到消息先查这里

<div class="grid grid-cols-2 gap-4 mt-5">
  <div v-click class="fact"><strong>服务端加了 `event:`，客户端还挂 `onmessage`</strong><span>命名事件必须 `addEventListener`；`onmessage` 只收无类型与 `event: message`</span></div>
  <div v-click class="fact"><strong>MIME / 状态码不对</strong><span>`text/plain`、502 都是致命失败——立即 CLOSED，连重试都没有</span></div>
  <div v-click class="fact"><strong>把 SSE 端点当一次性接口</strong><span>正常结束也重连，任务被反复触发——204 拦停或客户端 `close()`</span></div>
  <div v-click class="fact"><strong>只发 `event:` 不发 `data`</strong><span>空行到来不派发任何事件——心跳事件至少带一行 `data:`</span></div>
  <div v-click class="fact"><strong>置 `null` 想断连</strong><span>挂监听器的实例不被 GC——组件卸载必须显式 `close()`（且没有 close 事件）</span></div>
  <div v-click class="fact"><strong>`retry: 5s` / `Data:` 悄悄失效</strong><span>非纯数字、错大小写整行忽略——流"看着对"，行为没变</span></div>
</div>

<!--
最后把全片的坑浓缩成六条，按"收不到消息"的排查频率排序。

[click] 第一嫌疑永远是 event 字段和监听方式不匹配。
[click] 响应三要素铁律：错一个就是致命失败，不重连。
[click] 一次性任务用 SSE 端点会被反复触发，出口是 204 或 close。
[click] 无 data 的块不派发，实验室里亲眼看过。
[click] SPA 里不 close 就是常驻后台、断线还自动重连的"幽灵订阅"——浏览器只在 Document 销毁时才强制关闭，路由切换不算。
[click] 静默失效类的坑最隐蔽：retry 格式、字段名大小写，写错不报错，行为就是不变。
-->

---
layout: center
class: summary-slide
---

# 带走四个判断

<div class="summary-grid mt-8">
  <div><span>01</span><strong>响应三要素是铁律</strong><small>200 + `text/event-stream` + 保持不结束；违者致命失败、不重连</small></div>
  <div><span>02</span><strong>空行派发，无 data 不派发</strong><small>服务端要按浏览器解析器的规则产出事件流</small></div>
  <div><span>03</span><strong>重连白送但有边界</strong><small>正常结束也重连、非 200 一律致命、204 拦停、CLOSED 后兜底自己建</small></div>
  <div><span>04</span><strong>订阅与生成分开选</strong><small>常驻订阅用 `EventSource`；认证头 / POST / 一次性生成用 fetch 流式</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events" target="_blank"><carbon:book /> MDN 使用指南</a>
  <a href="https://html.spec.whatwg.org/multipage/server-sent-events.html" target="_blank"><carbon:document /> HTML Living Standard</a>
  <a href="https://github.com/whatwg/html" target="_blank"><carbon:logo-github /> whatwg/html</a>
</div>

<!--
四句话复盘：响应三要素错一个就致命；空行才派发、无 data 不派发；重连内建但边界必须背下来——正常结束也重连、非 200 一律致命、204 是钦点的停止信号；最后，订阅场景享受 EventSource 的白送可靠性，一次性生成场景用 fetch 换请求自由。

规范原文在 HTML Living Standard 的 Server-sent events 章，事件流 ABNF、解析与重连处理模型、作者注都在里面，值得通读一次。
-->
