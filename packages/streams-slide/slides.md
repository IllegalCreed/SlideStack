---
theme: seriph
layout: cover
title: Streams API
info: |
  WHATWG Streams 标准的流式数据处理原语：三类流、背压、排队策略、字节流与管道。

  Learn more at [MDN Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark">≋</div>

# Streams API

## 把"陆续到达的数据"变成可组合的管道：三类流、背压、字节流

<div class="cover-meta">
  <span>WHATWG Streams Standard</span>
  <span>ReadableStream Baseline 2019 · 三类流全绿</span>
  <span>浏览器 / Node 18+ / Deno / Bun</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Streams_API" target="_blank" class="slidev-icon-btn" aria-label="MDN Streams API">
    <carbon:document />
  </a>
  <a href="https://github.com/whatwg/streams" target="_blank" class="slidev-icon-btn" aria-label="whatwg/streams GitHub">
    <carbon:logo-github />
  </a>
</div>

<!--
这一讲不做 API 目录，只回答一条主线：怎么把"陆续到达的数据"安全地边到边处理。围绕它展开三类流的构造、背压如何反向协调快慢、字节流与压缩管道。

口径基于 WHATWG Streams 现行标准，核于 2026-07。ReadableStream 2019 年就 Baseline，WritableStream、TransformStream 也已全绿；Node 18+、Deno、Bun 内置同一套接口。fetch 的 response.body 只是流的一个应用面——它的读取、下载进度、上传流在 fetch 叶讲，本叶专注流本身的完整模型。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 为什么要有流：一把梭 vs 边到边

::left::

### 一把梭：等全部到齐再动手

```js {1-2|4|all}
const text = await res.text(); // 整份响应下载完才返回
const buf = readFileSync(path); // 整个文件读进内存

process(text); // 10 GB 文件直接 OOM
```

<div class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>两点崩：内存随数据量线性涨；首字节到末字节全程白等</span>
</div>

::right::

### 边到边：数据分 chunk，一到就处理

```js {1|2-5|all}
const reader = stream.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  handle(value); // 处理完就丢
}
```

<div class="signal signal-good mt-4">
  <carbon:checkmark-outline />
  <span>峰值内存与数据总量解耦；第一块到就能开工（进度、逐 token）</span>
</div>

<!--
流的全部动机就在这一页。传统"一把梭"要等全部到齐：res.text() 等整份下载完、readFileSync 把整个文件读进内存。数据一大，内存和延迟两点同时崩——10 GB 文件 OOM，而且末字节没到之前什么都做不了。

[click:2] 流的思路相反：数据切成 chunk，一到就处理、处理完就丢。于是峰值内存与总量解耦，无论 10 MB 还是 10 GB 同一时刻内存里只有正在处理的少量 chunk；而且第一块到就能开工——进度条、AI 逐 token 渲染、边下边解压都靠这个。

剩下所有概念——谁生产、谁消费、生产快于消费怎么办、多段怎么串——都是为"安全地边到边处理"服务的。
-->

---
layout: default
---

# 三类流：读源、写汇、中间变换，串成管道

<div class="pipeline mt-6">
  <div class="pipeline-step tone-blue">
    <span class="step-no">读源 · 数据流出</span>
    <strong>ReadableStream</strong>
    <code>underlying source</code>
    <span>fetch 响应体 / 文件 / 生成器</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-amber">
    <span class="step-no">中间变换 · 写入端进、读取端出</span>
    <strong>TransformStream</strong>
    <code>writable + readable</code>
    <span>解压 / 编解码 / 自定义</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-green">
    <span class="step-no">写汇 · 数据落地</span>
    <strong>WritableStream</strong>
    <code>underlying sink</code>
    <span>磁盘 / 网络 / DOM</span>
  </div>
</div>

```js
// 一条典型管道：读源 →（解压）→（转文本）→ 写汇
readable
  .pipeThrough(new DecompressionStream("gzip"))
  .pipeThrough(new TextDecoderStream())
  .pipeTo(writable);
```

<!--
WHATWG Streams 定义三类流，对应数据流动的三个位置。ReadableStream 是读源，背后是 underlying source，数据从这里流出；WritableStream 是写汇，背后是 underlying sink，数据流入这里落地；TransformStream 是中间变换，它是"读 + 写"的组合体，有一个 writable 端你往里写、一个 readable 端变换后的数据从这里出——正因为两端俱全，它能插进管道中间。

下面这条管道就是全叶的缩影：读源经解压转换流、再经文本解码转换流，最后汇入写汇。后面几页把每一类流的构造、读写、以及把它们串起来的背压逐个讲透。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# ReadableStream：用 underlying source 造一个流

::left::

```js {1|2-4|6-8|10|all}
const stream = new ReadableStream({
  start(controller) {
    connect(); // 构造后立即一次：初始化
  },
  pull(controller) {
    controller.enqueue(next()); // 续喂一块
  }, // 队列满就不再调 pull —— 自动背压
  cancel(reason) {
    cleanup(); // 消费者取消：释放资源
  },
}, { highWaterMark: 3 });
```

::right::

<table class="decision-table">
  <thead><tr><th>方法</th><th>何时调 / 干什么</th></tr></thead>
  <tbody>
    <tr v-click><td><code>start</code></td><td>构造后立即一次：初始化、可同步 enqueue 首批</td></tr>
    <tr v-click><td><code>pull</code></td><td>队列未满时反复：续喂 chunk——背压关键钩子</td></tr>
    <tr v-click><td><code>cancel</code></td><td>消费者取消时：停生成、清定时器</td></tr>
  </tbody>
</table>

<div v-click class="fact mt-4">
  <strong>控制器 controller</strong>
  <span><code>enqueue</code> 入队 · <code>close</code> 关流 · <code>error</code> 进错误态 · <code>desiredSize</code> 背压信号</span>
</div>

<!--
消费现成的流之外，你也能用 new ReadableStream 自己造。第一个参数是 underlying source，用三个可选方法描述"数据从哪来、怎么续、怎么停"。

[click] start 在构造后立即调一次，做初始化、拉起数据源，也可以同步 enqueue 首批。
[click] pull 在队列没满时被反复调，用来续喂 chunk——它是背压的关键钩子：队列满了浏览器就不再调 pull，你什么都不用做就有了背压。
[click] cancel 在消费者取消时调，负责停生成、清定时器、关句柄。

[click] start 和 pull 收到的 controller 是操控流的手柄：enqueue 入队一块、close 关流（已入队的仍可读完）、error 让流进错误态、desiredSize 是背压信号。第二参 highWaterMark 是排队策略，后面背压页展开。
-->

---
layout: default
---

# getReader 与 read 循环：done / value 协议

<div class="grid grid-cols-[1.2fr_.8fr] gap-8 mt-4 items-start">

````md magic-move {at:1}
```js
// 可移植读法：getReader() + read 循环（全浏览器安全）
const reader = stream.getReader(); // 流被锁定 locked
try {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break; // 读完，value 为 undefined
    handle(value);
  }
} finally {
  reader.releaseLock(); // ⭐ 收尾必做：释放锁
}
```

```js
// for await：更简洁，但要等 Safari 27
for await (const chunk of stream) {
  handle(chunk); // 自动 read 循环 + 自动 releaseLock
}
// 跨端安全写法仍是左边的 getReader 循环
```
````

<div class="rule-stack">
  <div class="rule tone-blue"><strong>read() 协议</strong><span>返回 <code>Promise&lt;{ done, value }&gt;</code>；<code>done:false</code> 带 chunk，<code>done:true</code> 读完</span></div>
  <div v-click class="rule tone-amber"><strong>locked 锁定</strong><span><code>getReader()</code> 后 <code>stream.locked</code> 为 true；不 releaseLock 换不了 reader、也不能 pipeTo</span></div>
  <div v-click class="rule tone-green"><strong>for await 待兼容</strong><span>异步迭代 Safari 27 才补齐——2026-07 跨端别裸用</span></div>
</div>
</div>

<!--
拿到流先 getReader 取默认 reader，流随即被锁定。左边是可移植读法：while 循环里反复 read，done 为 false 时 value 是一块 chunk，done 为 true 时读完、value 是 undefined。read 返回的这个 Promise 就是整个读取的核心协议。

[click] 收尾必做：try/finally 里 releaseLock。漏了流一直锁着，后续 tee、pipeTo 全用不了，还可能泄漏底层资源。

[click] ReadableStream 也实现了异步可迭代协议，可以直接 for await，语法上最简洁、自动收尾。但代价是兼容性：Safari 直到 27 才补齐，核于 2026-07 还不是跨浏览器安全写法。移植 MDN 示例里的 for await 时，跨端代码换回左边的 getReader 循环——这和 fetch 叶的结论一致。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# tee：把一个流分成两份独立分支

::left::

```js {1|2-3|all}
const [a, b] = stream.tee(); // 复制成两分支，原流随即锁定
consume(a); // 分支 A：喂给浏览器渲染
consume(b); // 分支 B：写入缓存
// 各有自己的 reader 与内部队列，互不影响读取进度
```

<div v-click class="mini-note mt-3">流只能顺序读一遍。要"同一份数据读两次"（Service Worker 里一边渲染一边写 Cache），只能靠 tee 分流。</div>

::right::

<div class="boundary-stack mt-1">
  <div class="boundary neutral"><carbon:copy /> 一个 ReadableStream（tee() 后锁定）</div>
  <carbon:arrow-down />
</div>

<div class="grid grid-cols-2 gap-3 mt-2">
  <div class="boundary trusted">分支 A · 渲染</div>
  <div class="boundary check">分支 B · 缓存</div>
</div>

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>内存坑：读得慢的一支会把未读 chunk 堆在它的内部队列——别 tee 出"慢半拍"的分支</span>
</div>

<!--
流是单向、只能读一遍的。经典需求是同一份数据读两次：Service Worker 里一边把响应流给浏览器渲染、一边写进 Cache。tee 就是干这个的——把一个流复制成两个独立分支，各有自己的 reader 和内部队列，互不影响读取进度。

[click] 注意 tee 之后原流立即被锁，此后只能通过两个分支读；对原流再 getReader、pipeTo 都会抛 TypeError。

[click] 唯一的坑是内存：两分支共享同一批上游 chunk，读得慢的一支会把未读 chunk 堆在它自己的队列里。两支速度差越大、数据越多，累积越多——本质也是背压问题，别 tee 出一个永远不读或慢半拍的分支。
-->

---
layout: default
---

# WritableStream：写汇与 writer.ready 背压钩子

```js {1|3-4|5-6|all}
const stream = new WritableStream({
  start(controller) { open(); },
  // 返回 Promise 兑现前算"忙" → 可写流背压的实现基础
  write(chunk) { return doWrite(chunk); },
  close() { return flush(); }, // 正常收尾、冲刷缓冲
  abort(reason) { return cleanup(); }, // 异常中止、进错误态
}, new CountQueuingStrategy({ highWaterMark: 1 }));
```

<table class="decision-table mt-4">
  <thead><tr><th>writer 成员</th><th>说明</th></tr></thead>
  <tbody>
    <tr><td><code>write(chunk)</code></td><td>写一块，返回 Promise（被 sink 接受即兑现）</td></tr>
    <tr><td><code>ready</code></td><td><strong>背压钩子</strong>：队列低于高水位（可再收）时兑现</td></tr>
    <tr><td><code>close() / abort()</code></td><td>等写完再关，触发 sink close / 立即弃写进错误态</td></tr>
  </tbody>
</table>

<div class="takeaway mt-4">高频写的正确姿势：先 `await writer.ready` 再 `write`——只 await write 不看 ready 会越过高水位、丢背压。</div>

<!--
WritableStream 抽象数据的去处。第一个参数是 underlying sink，四个方法：start 初始化、write 每块调一次、close 正常收尾、abort 异常中止。关键在 write 返回 Promise——它兑现之前这块被视为还在写，浏览器不会催下一块，这就是可写流背压的实现基础。sink 写得慢，write 的 Promise 就晚兑现，上游自然被拖慢。

写要先 getWriter 拿 writer，流随即锁定。下表是 writer 的成员：write 写一块、ready 是背压钩子、close 等写完再关、abort 立即弃写。

高频写入的正确姿势是"先 await writer.ready 再 write"。只 await write 不代表队列没满——write 兑现只表示这块被接受，ready 兑现才代表可以再收。这个区别下面背压页还会再强调。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# TransformStream 与 pipeThrough：管道变换

::left::

```js {1|3-5|7-9|11-12|all}
const ts = new TransformStream({
  // 每块：变换后 enqueue 推到 readable 端
  transform(chunk, controller) {
    controller.enqueue(map(chunk));
  },
  // writable 端关闭后一次：冲刷尾巴/残行
  flush(controller) {
    if (tail) controller.enqueue(tail);
  },
});
ts.writable; // 往这写
ts.readable; // 从这读
```

::right::

```js
readable
  .pipeThrough(new DecompressionStream("gzip"))
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(makeLineSplitter())
  .pipeTo(writable);
```

<div v-click class="fact mt-3">
  <strong>pipeThrough 三自动</strong>
  <span>自动背压 · 自动错误传播 · 自动锁定/解锁——对比手写 read-write 循环</span>
</div>

<div v-click class="mini-note mt-3">恒等流：`new TransformStream()` 不传 transformer 即原样透传，用来"凭空造一对相连的 writable/readable"。</div>

<!--
TransformStream 是读加写的组合体。transformer 有三个方法：transform 每块调一次，变换后用 controller.enqueue 推到 readable 端；flush 在写入端关闭后调一次，冲刷跨 chunk 攒着的尾巴——漏写 flush 会丢结尾数据。transform 里 enqueue 的次数不限，所以它能做拆分、合并、分帧，不必一进一出。两端分别是 ts.writable 和 ts.readable。

[click:4] 有了转换流就能用 pipeThrough 声明式串联：readable 接到 ts.writable、返回 ts.readable，一段接一段。

[click] pipeThrough 的价值是三个自动：末端读得慢，背压一路传到最上游全链降速；任一段出错，默认沿链传播、整条 abort；管道期间各流锁定、结束自动释放。对比手写"读一段、变换、写一段"的循环，这三样它全照顾好了——优先用管道。

[click] 最后一个技巧：不传 transformer 的 TransformStream 是恒等流，原样透传，常用来凭空造一对相连的读写端做管道接头。
-->

---
layout: default
---

# 背压：信号反向传播，让上游自动降速

<div class="backflow mt-6">
  <div class="backflow__row">
    <div class="backflow__box tone-blue">上游 source</div>
    <carbon:arrow-right class="backflow__fwd" />
    <div class="backflow__box">队列 A</div>
    <carbon:arrow-right class="backflow__fwd" />
    <div class="backflow__box tone-amber">transform</div>
    <carbon:arrow-right class="backflow__fwd" />
    <div class="backflow__box">队列 B</div>
    <carbon:arrow-right class="backflow__fwd" />
    <div class="backflow__box tone-green">下游 sink</div>
  </div>
  <div class="backflow__reverse">
    <carbon:arrow-left />
    <span>压力反向传播：<code>desiredSize ≤ 0</code> / <code>ready</code> 未兑现 → 逐段回压 → 源暂停生产</span>
  </div>
</div>

<div class="grid grid-cols-2 gap-4 mt-6">
  <div class="fact"><strong>highWaterMark（高水位）</strong><span>内部队列"愿意缓冲的上限"，达到即认为"满"</span></div>
  <div class="fact"><strong>desiredSize = HWM − 已缓冲</strong><span>还能再收多少；降到 0 或负数 = 背压生效信号</span></div>
</div>

<div class="takeaway mt-5">用 pipeTo / pipeThrough 拼管道，背压全自动；只有手写 reader-writer 循环才需自己读这些信号。</div>

<!--
背压是流区别于一把梭的核心。设想上游每毫秒产一块、下游每秒才消费一块，若不加协调，未消费的 chunk 在中间无限堆积，内存照样爆——流化了个寂寞。

数据正向流、压力反向传：每个流用内部队列加排队策略在本地判断"我满没满"，满了就通过"不再被 pull"或"ready 不兑现"把压力递给上一段，逐段相连就成了端到端的自动限速。

它靠两个量运转：highWaterMark 是队列愿意缓冲的上限，达到即算满；desiredSize 等于高水位减去已缓冲，表示还能再收多少，降到 0 或负数就是背压生效的信号。

心智模型先记这一句：用 pipeTo、pipeThrough 拼管道，背压全自动，这些底层钩子由管道内部照顾好了；只有手写 reader-writer 循环时才需要自己读——否则就丢了背压、退化成一把梭。下一页现场看它发生。
-->

---
layout: default
class: lab-slide
---

# 交互实验：背压把源的产出速率压下来

<BackpressureLab />

<!--
这是真实的 Streams API 管道：源 ReadableStream 是 pull 型，最快每 160 毫秒产一块、高水位 6；中间一个恒等 TransformStream 透传；末端一个慢速 WritableStream，sink 的 write 里 await 一个定时器模拟下游慢消费，延迟由滑杆控制。整条用 pipeThrough + pipeTo 串起来，流全部创建在"开始"按钮回调里，SSR 安全，停止时 abort 取消。

现场分两条路径演示。第一条：默认下游延迟 420 毫秒，比源的 160 毫秒慢——点开始，能看到队列水位很快涨满、desiredSize 掉到 0 附近，状态卡翻成玫红 BACKPRESSURE，源产出速率被自动拉低到跟下游消费速率一样。这就是背压：下游慢，队列满，浏览器不再调源的 pull，源被反压暂停。

第二条：把滑杆拖到 80 到 140 毫秒，让下游比源还快——队列水位掉下来、desiredSize 回到正数，状态卡变蓝 FLOWING，源恢复到最大速率自由生产。来回拖滑杆，观众能肉眼看到"下游一慢，压力就顶回到源"。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[100px_1fr]
---

# 排队策略：highWaterMark 与 size 定"多满算满"

`desiredSize = highWaterMark − 队列中所有 chunk 的 size 之和`；≤ 0 触发背压

::left::

### CountQueuingStrategy（按条数）

```js
new WritableStream(
  sink,
  new CountQueuingStrategy({
    highWaterMark: 16,
  }),
); // size 恒为 1 → 最多缓冲 16 条
```

<div class="mini-note mt-2">适合对象流 / 记录流——"最多缓冲 N 条"</div>

::right::

### ByteLengthQueuingStrategy（按字节）

```js
new ReadableStream(
  source,
  new ByteLengthQueuingStrategy({
    highWaterMark: 65536,
  }),
); // size 取 byteLength → 最多缓冲 64 KiB
```

<div class="mini-note mt-2">适合字节流——用字节数直接控内存</div>

<!--
构造流时的第二个参数是排队策略，一个 highWaterMark 加 size 的二元组，决定队列多满算满。核心公式记在标题下：desiredSize 等于高水位减去队列里所有 chunk 的 size 之和，小于等于 0 就触发背压。

不想自己写 size 时用两个内建策略。CountQueuingStrategy 按条数：size 恒为 1，highWaterMark 就是最多缓冲几条，适合对象流、记录流。ByteLengthQueuingStrategy 按字节：size 取 chunk.byteLength，highWaterMark 是最多缓冲多少字节，适合字节流、用字节数直接控内存最直观。

一个提醒：highWaterMark 别拍脑袋设很大，那等于放宽缓冲、削弱背压，内存峰值随之上去。非字节流默认高水位是 1，即缓冲一块就算满。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 手写源/汇的背压钩子：desiredSize 与 ready

::left::

### push 源：读 controller.desiredSize

```js
socket.onmessage = (e) => {
  controller.enqueue(e.data);
  // 队列满就暂停底层源，别继续堆内存
  if (controller.desiredSize <= 0) {
    socket.pause();
  }
};
// pull：消费者又要了 → 有空位 → 恢复源
```

::right::

### 可写侧：await writer.ready

```js
const writer = writable.getWriter();
for (const chunk of source) {
  await writer.ready; // sink 忙就在此等
  writer.write(chunk);
}
await writer.close();
```

<div class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>push 源不看 desiredSize = 没有背压；只 await write 不看 ready 也会越过高水位——ready 才是背压信号</span>
</div>

<!--
背压对用管道的人是隐形的，但手写源或汇时要主动读钩子。

pull 型源天然有背压——队列满就不再被 pull。但 push 型源，数据自己不停来的那种，比如 WebSocket、定时器，必须自己看 desiredSize：每次 enqueue 后检查，小于等于 0 就暂停底层源，等 pull 被调（有空位了）再恢复。不看 desiredSize 就等于没有背压，enqueue 会无脑堆队列直到内存吃紧。

可写侧的背压钩子是 writer.ready，一个 Promise，队列低于高水位时兑现。写前 await 它，写入速度就自动跟随 sink 消费速度。

底部这条是易错点：push 源不看 desiredSize 就没背压；手写 write 只 await write 不看 ready，高频写会越过高水位、desiredSize 变负——虽然仍能写，但丢了背压保护。ready 才是"该不该继续写"的信号。要么补钩子，要么干脆用 pipeTo。
-->

---
layout: default
---

# pipeTo 三开关：结束与错误怎么传播

<table class="decision-table mt-4">
  <thead><tr><th>选项</th><th>默认</th><th>设 true 的效果</th></tr></thead>
  <tbody>
    <tr v-click><td><code>preventClose</code></td><td>false</td><td>源正常结束时不关 destination（多段拼接、共享 dest）</td></tr>
    <tr v-click><td><code>preventAbort</code></td><td>false</td><td>源出错时不 abort destination（错误不往下游传）</td></tr>
    <tr v-click><td><code>preventCancel</code></td><td>false</td><td>destination 出错时不 cancel 源（错误不往上游传）</td></tr>
    <tr v-click><td><code>signal</code></td><td>—</td><td>传 AbortSignal，可中途取消整条管道</td></tr>
  </tbody>
</table>

<div class="grid grid-cols-[1fr_1fr] gap-6 mt-4 items-start">

```js
// 多段顺序汇入同一 writable：
// 除最后一段外都保留 dest 不关
for (let i = 0; i < sources.length; i++) {
  const isLast = i === sources.length - 1;
  await sources[i].pipeTo(writable, {
    preventClose: !isLast,
  });
}
```

<div class="mini-note">默认全 false = "善始善终、错误双向传播"：源结束就关 dest、任一端出错就连带处理另一端。只有多段拼接 / 共享 dest 才动这些开关。</div>

</div>

<!--
pipeTo 和 pipeThrough 的第二个参数 options，控制结束与错误如何传播。

preventClose：源正常结束时不自动关 destination，留着继续接别的源；preventAbort：源出错时不 abort destination，错误不往下游传；preventCancel：destination 出错时不 cancel 源，错误不往上游传。还有 signal，传一个 AbortSignal 可中途取消整条管道。

[click:4] 默认全是 false，语义是"善始善终、错误双向传播"：源结束就关 dest，任一端出错就连带处理另一端。这套默认适合绝大多数场景，只有要改行为时才动开关。

最典型的用途就是左边这段：把多个源依次写进同一个 writable，靠 preventClose 设 true 让前几段结束别关 dest，最后一段才关。signal 那档则用来做可取消的管道。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 字节流 + BYOB：自带缓冲区，减少拷贝

::left::

```js {1-3|5-9|all}
const byteStream = new ReadableStream({
  type: "bytes", // 字节流 → ReadableByteStreamController
  autoAllocateChunkSize: 4096, // 默认 reader 也走零拷贝
  async pull(controller) {
    const view = controller.byobRequest.view;
    const n = await readInto(view); // 直接写进这块 buffer
    controller.byobRequest.respond(n); // ⭐ 告知写入字节数
  },
});
```

::right::

```js
// BYOB：自带 buffer，数据直接写进来
const reader =
  byteStream.getReader({ mode: "byob" });
const { done, value } =
  await reader.read(new Uint8Array(4096));
```

<div v-click class="fact mt-3">
  <strong>BYOB 是优化不是必需</strong>
  <span>不可用时回退默认 <code>getReader()</code>——字节流默认 reader 照样读，拿到 Uint8Array</span>
</div>

<div v-click class="mini-note mt-3">Baseline：随 Firefox 133（2024-11）补齐进入 Baseline，生产建议保留回退。</div>

<!--
普通可读流的 chunk 可以是任意值；字节流专门流字节，用 type 等于 bytes 声明，控制器变成 ReadableByteStreamController，并解锁一条零拷贝读取路径。

BYOB 是 Bring Your Own Buffer，自带缓冲区。常规读取里源把数据放进流的内部队列、消费者 read 时再拷到手里，两次拷贝。BYOB 让消费者先把一块 buffer 交给流，源直接往这块 buffer 写，省掉中间拷贝。源侧配合 byobRequest：拿到消费者提供的 view，写完调 respond 告知写入了多少字节。设了 autoAllocateChunkSize，即便消费者用普通 getReader，浏览器也自动分配 buffer 走 byobRequest，让默认 reader 也享零拷贝。

[click:2] 工程上记两点：BYOB 是优化不是必需，不可用时回退默认 getReader，字节流用默认 reader 照样能读、拿到 Uint8Array；它随 Firefox 133、2024 年 11 月补齐后进入 Baseline，仍在 widely available 窗口内，生产建议保留回退。大二进制、要精确控制每次读取大小（解析定长头加变长体）时 BYOB 收益最大。
-->

---
layout: default
---

# CompressionStream：免库压缩，本身就是转换流

```js {1-2|4-6|all}
// 流式压缩：边读边 gzip 边写，恒定内存
await readable.pipeThrough(new CompressionStream("gzip")).pipeTo(writable);

// 流式解压一个 Blob（用 Response 一把收成 Blob）
const ds = new DecompressionStream("gzip");
return new Response(blob.stream().pipeThrough(ds)).blob();
```

<table class="decision-table mt-4">
  <thead><tr><th>格式</th><th>含义</th><th>状态</th></tr></thead>
  <tbody>
    <tr><td><code>"gzip"</code></td><td>gzip 封装（RFC 1952），带头 + CRC</td><td><strong>Baseline</strong>（2023-05）</td></tr>
    <tr><td><code>"deflate"</code></td><td>zlib 封装 DEFLATE（RFC 1950）</td><td><strong>Baseline</strong></td></tr>
    <tr><td><code>"deflate-raw"</code></td><td>裸 DEFLATE、无头无校验（RFC 1951）</td><td><strong>Baseline</strong></td></tr>
    <tr><td><code>"brotli" / "zstd"</code></td><td>Brotli / Zstandard</td><td>非 Baseline，先查支持</td></tr>
  </tbody>
</table>

<div class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>压/解格式必须一致；deflate 与 deflate-raw 头不同不通用；非法格式抛 TypeError</span>
</div>

<!--
CompressionStream 和 DecompressionStream 本身就是 TransformStream，pipeThrough 一接就用，无需打包 pako 这类压缩库。上面第一段是流式压缩：边读边 gzip 边写，恒定内存；第二段流式解压一个 Blob，再用 Response 一把收成 Blob。

格式表记牢三个 Baseline 加两个前沿。gzip、deflate、deflate-raw 三个自 2023 年 5 月起 Baseline widely，放心用；brotli 和 zstd 是规范近期新增，核于 2026-07 只有 Chromium 系较前落地，非 Baseline，跨端前必查 caniuse 或实测，别默认可用。

底部三条硬规则：压缩和解压的格式字符串必须一致；deflate 和 deflate-raw 头不同、不通用；传非法格式直接抛 TypeError。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# TextDecoderStream / TextEncoderStream：编解码流

::left::

### 字节 → 文本：跨块多字节安全

```js
const textStream = byteStream.pipeThrough(
  new TextDecoderStream("utf-8"),
);
// 自动处理跨 chunk 的多字节字符
// UTF-8 汉字被拆在块边界也不会乱码
```

<div class="mini-note mt-2">别手动 decode 漏 `stream:true`——汉字 3 字节被分块截断就周期性乱码</div>

::right::

### 文本 → 字节 → 压缩：一条管道

```js
await textReadable
  .pipeThrough(new TextEncoderStream())
  .pipeThrough(new CompressionStream("gzip"))
  .pipeTo(fileWritable);
```

<div class="mini-note mt-2">TextDecoderStream / TextEncoderStream 自 Chrome 71 / FF 105 / Safari 14.1 起 Baseline，放心用</div>

<!--
字节流转文本，最稳的是 TextDecoderStream。它是转换流，自动处理跨 chunk 的多字节字符——一个 UTF-8 汉字占 3 字节，被网络分块拦腰截断在两个 chunk 边界时也不会乱码。反向用 TextEncoderStream，文本转 Uint8Array 字节。

右边这条管道很典型：文本先编码成字节、再 gzip 压缩、最后写盘，一条 pipeThrough 链搞定编码加压缩加写。

左下这条易错点很重要：别手动 new TextDecoder().decode(chunk) 漏掉 stream: true，手动解码时多字节字符跨块会截断乱码，这是 AI 打字机效果偶发锟斤拷的经典病根。要么全程带 stream: true 加结尾冲刷，要么直接用 TextDecoderStream，它内部就带流式语义。这两个编解码流自 Chrome 71、Firefox 105、Safari 14.1 起就 Baseline，放心用。
-->

---
layout: default
---

# 坑：response.body 已被浏览器自动解压

<div class="grid grid-cols-[1fr_1fr] gap-6 mt-5 items-start">

<div class="boundary-stack">
  <div class="boundary external"><carbon:cloud /> HTTP 响应 · Content-Encoding: gzip</div>
  <carbon:arrow-down />
  <div class="boundary check"><carbon:flash /> 浏览器按 Content-Encoding 自动解压</div>
  <carbon:arrow-down />
  <div class="boundary trusted"><carbon:checkmark /> response.body 给你的是解压后的字节</div>
</div>

<div class="rule-stack">
  <div class="rule tone-red"><strong>别二次解压</strong><span>对普通 response.body 再套 DecompressionStream = 二次解压必错</span></div>
  <div class="rule tone-blue"><strong>手动解压的正当场景</strong><span>body 本身是你自定义 gzip 的 payload、或读本地 .gz 文件</span></div>
</div>

</div>

<div class="signal signal-good mt-5">
  <carbon:checkmark-outline />
  <span>response.body 的读取 / 下载进度 / 上传流 → 见 fetch 叶；本叶只讲"拿到字节流之后"的字节级处理</span>
</div>

<!--
一个关键坑：response.body 是字节流、天然能接压缩流，但浏览器对 HTTP 响应的 Content-Encoding，比如 gzip、br，已经自动解压了——response.body 给你的是解压后的字节。

所以别对普通 response.body 再套 DecompressionStream，那是二次解压、必错。手动解压只用于一种场景：body 本身是你自定义压缩的数据，比如接口返回一段你自己 gzip 的 payload、或读本地的 .gz 文件，这时才 pipeThrough 一个 DecompressionStream。

最后划清边界：response.body 的读取套路、下载进度、上传流都在 fetch 叶，本叶不重复；本叶只讲拿到字节流之后的字节级、压缩、编解码处理。这也是三处流内容分工的一贯口径。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 跨端一套：Node 互操作与 Response 桥

::left::

### Node / Deno / Bun 内置同款

```js
import { ReadableStream, TransformStream }
  from "node:stream/web";

// 与 Node 老式流互转
const web = Readable.toWeb(nodeReadable);
const node = Readable.fromWeb(webReadable);
```

<div class="mini-note mt-2">同一段 Web Streams 逻辑前后端复用；Node 里 fetch 的 response.body 也是 Web ReadableStream</div>

::right::

### Response：流 ↔ 整体的桥

```js
// 把任意可读流一把收成 text / blob
const text = await new Response(stream).text();
const blob = await new Response(stream).blob();

// 反向：把自造流交给需要 Response 的 API
respondWith(new Response(readable));
```

<div class="mini-note mt-2">恒等 TransformStream + `new Response(readable)` 是"造流并交出去"的常用接头</div>

<!--
Web Streams 不是浏览器专属：Node 18+、Deno、Bun 都内置同一套，从 node:stream/web 拿到与浏览器同款的构造器；还能和 Node 传统流互转，Readable.toWeb、Readable.fromWeb，可写侧同理。意义是同一段用 Web Streams 写的流处理逻辑能在浏览器和服务端复用，比如一个自定义 TransformStream 解析器前后端共用；Node 里 fetch 的 response.body 也是 Web ReadableStream，与浏览器代码无缝对齐。

右边 Response 是流和整体之间的桥。new Response 包住任意可读流，再用它的 text、blob、arrayBuffer 一把收完——常用作把流收成整体。反过来，new Response(readable) 也用于把自造流交给需要 Response 的 API，比如 Service Worker 的 respondWith。恒等 TransformStream 加 new Response(readable) 就是造流并交出去的常用接头。
-->

---
layout: default
---

# 何时用流、何时别用

<div class="grid grid-cols-2 gap-5 mt-5">
  <div class="fact"><strong>该用 · 数据大</strong><span>大文件 / 大响应，避免 OOM，峰值内存恒定</span></div>
  <div class="fact"><strong>该用 · 陆续到达</strong><span>网络、串口、媒体、AI 逐 token 输出</span></div>
  <div class="fact"><strong>该用 · 边到边 / 组合</strong><span>进度、边下边转；解压 + 解码 + 落盘串成一条管道</span></div>
  <div class="fact"><strong>别用 · 小数据</strong><span>几 KB 一次性 JSON——res.json() 更直接，套流是过度工程</span></div>
</div>

<div class="pipeline mt-6">
  <div class="pipeline-step tone-blue">
    <span class="step-no">只要结果</span>
    <strong>res.json() / res.text()</strong>
    <span>内部帮你收流</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-amber">
    <span class="step-no">要过程</span>
    <strong>读 res.body</strong>
    <span>进度 / 逐块 / 边到边</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-green">
    <span class="step-no">要组合</span>
    <strong>pipeThrough 管道</strong>
    <span>解压 / 解码 / 变换串联</span>
  </div>
</div>

<!--
选型收束成两组判断。该用流：数据大，大文件大响应，避免 OOM、峰值内存恒定；数据陆续到达，网络、串口、媒体、AI 逐 token；要边到边处理或组合多段，进度、边下边转，解压加解码加落盘串成一条管道。别用流：几 KB 的一次性小数据，await res.json()、res.text() 更直接，套流是过度工程。

下面这条判据专门给 fetch 场景：只要最终结果、不关心中间过程，就用 res.json 或 res.text，它们内部帮你收流；要进度、逐块、边到边，就读 res.body；要组合多段处理，就 pipeThrough 拼管道。具体的 response.body 读取仍回 fetch 叶。
-->

---
layout: default
---

# 易错点 TOP 6

<div class="summary-grid mt-6">
  <div v-click><span>01</span><strong>手写循环丢背压</strong><small>read() + write() 不 await ready → 退化成一把梭，优先 pipeTo</small></div>
  <div v-click><span>02</span><strong>忘记 releaseLock()</strong><small>手写 read 循环后不释放，流一直锁着，tee / pipeTo 全用不了</small></div>
  <div v-click><span>03</span><strong>裸用 for await 遍历流</strong><small>Safari 27 才支持——跨端用 getReader() 循环</small></div>
  <div v-click><span>04</span><strong>转换流漏写 flush</strong><small>跨 chunk 攒的半行 / 残字节丢在结尾——收尾冲刷放 flush</small></div>
  <div v-click><span>05</span><strong>对 response.body 二次解压</strong><small>浏览器已按 Content-Encoding 自动解压——手动只对自定义 payload</small></div>
  <div v-click><span>06</span><strong>tee 慢分支 / 小数据套流</strong><small>慢支内部队列堆内存；几 KB JSON 直接 res.json()</small></div>
</div>

<!--
六条易错点快速过。

[click:2] 一号，手写 read-write 循环只 read 加 write 不 await writer.ready，退化成一把梭、丢了背压——优先 pipeTo。二号，手写 read 循环后忘了 releaseLock，流一直锁着，tee、pipeTo 全用不了，try/finally 里释放。

[click:2] 三号，裸用 for await 遍历流，Safari 27 才支持，跨端换回 getReader 循环。四号，转换流漏写 flush，跨 chunk 攒的半行、残字节、半个包丢在结尾，收尾冲刷放 flush。

[click:2] 五号，对 response.body 二次解压，浏览器已按 Content-Encoding 自动解压，手动解压只对自己压的 payload。六号，tee 出的慢分支内部队列堆内存，以及几 KB 小数据也套流——直接 res.json 更好。完整清单见参考页。
-->

---
layout: center
class: summary-slide
---

# 带走四个判断

<div class="summary-grid mt-8">
  <div><span>01</span><strong>流 = 边到边 + 恒定内存</strong><small>数据分 chunk，一到就处理，峰值内存与总量解耦</small></div>
  <div><span>02</span><strong>三类流拼成管道</strong><small>Readable 读源 / Writable 写汇 / Transform 变换，pipeThrough 串联</small></div>
  <div><span>03</span><strong>背压是核心价值</strong><small>desiredSize ≤ 0 / ready 反向传播；用管道则全自动</small></div>
  <div><span>04</span><strong>优先管道、少手写循环</strong><small>pipeTo 自带背压 + 错误传播 + 锁定；手写易丢背压</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Streams_API" target="_blank"><carbon:book /> Streams API（MDN）</a>
  <a href="https://streams.spec.whatwg.org/" target="_blank"><carbon:document /> WHATWG 规范</a>
  <a href="https://web.dev/articles/streams" target="_blank"><carbon:rocket /> web.dev 权威长文</a>
</div>

<!--
四句话复盘。流的本质是边到边加恒定内存：数据分 chunk，一到就处理，峰值内存与总量解耦。三类流拼成管道：Readable 读源、Writable 写汇、Transform 变换，用 pipeThrough 串联。背压是流的核心价值：desiredSize 小于等于 0、ready 不兑现，压力反向传播，用管道则全自动。最后一条工程判断：优先用管道、少手写 reader-writer 循环，pipeTo 自带背压、错误传播和锁定，手写最容易丢的就是背压。

掌握这四条，再去看字节流 BYOB、Compression Streams、跨端 Node 互操作这些细节，就有稳定的判断基座。深入回笔记，参考页有三类流对比表、排队策略表和完整易错点清单。
-->
