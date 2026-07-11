---
theme: seriph
layout: cover
title: Fetch API
info: |
  浏览器网络请求的标准答案：Promise 心智模型、三对象、取消与超时、请求策略、流式与离页请求。

  Learn more at [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark cover-mark--fn">fetch()</div>

# Fetch API

## 浏览器网络层的标准答案：Promise、对象模型与平台集成

<div class="cover-meta">
  <span>WHATWG Fetch Living Standard</span>
  <span>核心 Baseline Widely available · 2017-03 起</span>
  <span>浏览器 / Node 18+ / Deno / Bun</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" target="_blank" class="slidev-icon-btn" aria-label="MDN Fetch API">
    <carbon:document />
  </a>
  <a href="https://github.com/whatwg/fetch" target="_blank" class="slidev-icon-btn" aria-label="whatwg/fetch GitHub">
    <carbon:logo-github />
  </a>
</div>

<!--
这一讲不做 API 目录，只回答四个问题：fetch 的 Promise 什么时候 reject（头号考点）、请求和响应为什么要变成对象、取消与超时怎么组合、流式与离页请求各自解决什么。

口径基于 WHATWG Fetch 现行标准，核于 2026-07。核心 API 自 2017 年起 Baseline 全绿；Node 18+、Deno、Bun 内置同一套接口——今天写 fetch 的代码，是所有 JS 运行时的公约数。近年增量（组合信号、bytes、keepalive、fetchLater）后面都会讲到各自的支持时间点。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 一分钟上手：两步走样板

::left::

### GET + JSON：`ok` 检查一步不能省

```js {1|3-6|8|all}
const res = await fetch(`/api/users/${id}`);

// 4xx/5xx 不会 reject —— 必须自查
if (!res.ok) {
  throw new Error(`HTTP ${res.status}`);
}

const user = await res.json(); // 又一个异步步骤
```

<div v-click class="mini-note mt-3">fetch 收到状态行 + 响应头就 fulfill，body 可能还在路上——所以读 body 是第二个会失败的异步步骤。</div>

::right::

### POST JSON：三件缺一不可

```js {2|3|4|all}
const res = await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(user), // 不会自动序列化
});

if (!res.ok) throw new Error(`HTTP ${res.status}`);
```

<div v-click class="signal signal-bad mt-3">
  <carbon:warning-alt />
  <span>GET 塞 body 直接 TypeError（查询串用 URLSearchParams）；FormData 别手设 Content-Type——boundary 要浏览器生成。</span>
</div>

<!--
左边是全场最重要的一段样板。fetch 返回 Promise，await 拿到 Response。

[click] 关键在第二步：404、500 这些 HTTP 错误码不会让 Promise reject，必须自己查 ok——它是 status 在 200 到 299 的布尔。

[click:3] 右边 POST JSON 三件套：method、Content-Type、JSON.stringify。fetch 不会自动序列化对象，也不会自动设内容类型，三件缺一个后端就收不到预期数据。

[click:3] 两个默认值顺带记住：method 默认 GET、credentials 默认 same-origin。GET 带 body 会直接抛 TypeError；上传表单时让浏览器自己生成 multipart 边界。
-->

---
layout: default
---

# 头号考点：`fetch()` 什么时候 reject

`fetch()` 的 Promise 只关心「网络对话是否完成」，与业务成败无关——错误面分三层。

<div class="plane-stack mt-5">
  <div v-click class="plane tone-red">
    <strong>网络层</strong>
    <span>断网 / DNS 失败 / URL 非法或带 user:pass / CORS 被拦 / integrity 校验不过</span>
    <code>reject · TypeError</code>
  </div>
  <div v-click class="plane tone-amber">
    <strong>取消层</strong>
    <span>controller.abort() 主动取消；AbortSignal.timeout() 到点</span>
    <code>reject · AbortError / TimeoutError</code>
  </div>
  <div v-click class="plane tone-blue">
    <strong>HTTP 层</strong>
    <span>服务器回了 404 / 500——「对话」已完成，哪怕业务失败</span>
    <code>fulfill · response.ok 自查</code>
  </div>
</div>

<div v-click class="takeaway mt-5">在 catch 里等 HTTP 错误永远等不到——4xx/5xx 根本不进 catch。这不是 fetch 独有的怪癖：XHR 的 onerror 同样只管网络错误，是 HTTP 客户端的通用语义。</div>

<!--
这一页是整个 fetch 的心智模型，也是面试与线上事故的头号来源。

[click] 网络层：对话根本没建立或中断——断网、DNS、URL 非法、CORS 被拦、integrity 不匹配，统统 reject 一个 TypeError。注意 CORS 失败脚本只能拿到笼统的网络错误，细节只在控制台，这是防探测的安全设计。

[click] 取消层：都是 DOMException，用户取消是 AbortError，超时是 TimeoutError，catch 里按 err.name 分流。

[click] HTTP 层：服务器回了错误码，对话算完成，Promise 照样 fulfill——成败要自己查 ok。

[click] 所以健壮的请求函数天然是三段式：catch 网络与取消、if 查 ok、再单独处理 json() 的解析失败。
-->

---
layout: default
---

# 与 XHR 对比：只剩一条理由留下

<table class="decision-table mt-4">
  <thead><tr><th>维度</th><th>XMLHttpRequest</th><th>fetch</th></tr></thead>
  <tbody>
    <tr><td>异步模型</td><td>事件回调（onload / onerror）</td><td>Promise，async/await 原生</td></tr>
    <tr><td>请求 / 响应实体</td><td>无——配置绑死在 xhr 实例上</td><td>Request / Response 一等对象，可传递可克隆</td></tr>
    <tr><td>HTTP 错误码</td><td>onload 照常触发，查 status</td><td>fulfill，查 ok——两者语义一致</td></tr>
    <tr><td>响应流式读取</td><td>无（responseText 全量）</td><td>response.body 就是 ReadableStream</td></tr>
    <tr><td>Service Worker / Cache API</td><td>不可用（SW 内无 XHR）</td><td>一等公民</td></tr>
    <tr><td>跨端可用性</td><td>仅浏览器</td><td>浏览器 / Node 18+ / Deno / Bun / 边缘运行时</td></tr>
    <tr v-click class="row-hot"><td><strong>上传进度</strong></td><td><strong>xhr.upload.onprogress 原生</strong></td><td><strong>缺位</strong>（上传流仅 Chromium 且限制多）</td></tr>
  </tbody>
</table>

<div v-click class="takeaway mt-4">新代码没有理由再写 XHR；存量场景里只有「上传大文件要精确进度条」这一条，XHR 或基于 XHR 的库仍是务实选择。</div>

<!--
XHR 是 2000 年前后的设计：事件回调面条、命令式 open/setRequestHeader/send、请求响应不是实体。fetch 是 WHATWG 对"网络请求"的重新设计——Promise 异步模型、一等对象模型、平台集成三个层面全面升级。

表里第三行值得强调：HTTP 错误码在两边都算"成功拿到响应"，这是 HTTP 客户端的通用语义，别把它当 fetch 的缺陷。

[click] 唯一的例外是上传进度：xhr.upload.onprogress 至今没有跨浏览器的 fetch 等价物——上传流只有 Chromium 实现，后面专家页会讲它的四条硬限。

[click] 结论：新代码默认 fetch；下载进度 fetch 能自己搭（流式页讲），只有精确上传进度条这一条留给 XHR 系。
-->

---
layout: two-cols-header
layoutClass: gap-x-9 grid-rows-[88px_1fr]
---

# 三对象：请求终于成了「值」

::left::

```js {1-7|9-12|all}
// fetch(url, options) 与 new Request(url, options) 签名一致
const request = new Request("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "张三" }),
});
const res = await fetch(request);

// 二次构造：以旧请求为模板，只换 body
const variant = new Request(request, {
  body: JSON.stringify({ name: "李四" }),
});
```

<div v-click class="mini-note mt-3">同名选项两处都传时，以 fetch() 直传的为准；SW 里「改头换面再转发」用的就是模板派生。</div>

::right::

<div class="boundary-stack mt-1">
  <div class="boundary check"><carbon:document /> Request：可构造 · 可克隆 · 可传递</div>
  <carbon:arrow-down />
  <div class="boundary neutral"><carbon:cloud /> fetch() —— 浏览器网络引擎</div>
  <carbon:arrow-down />
  <div class="boundary trusted"><carbon:checkmark-outline /> Response：status / ok / type + body 流</div>
</div>

<div v-click class="fact mt-4"><strong>Response 三静态工厂</strong><span>Response.json(data) 自动设 Content-Type、Response.error()、Response.redirect(url)——SW / mock / 边缘函数刚需</span></div>

<div v-click class="fact mt-3"><strong>Headers 有纪律</strong><span>名字小写化、遍历按字典序且同名合并；fetch 响应头 immutable；Cookie / Origin 等禁设头静默忽略</span></div>

<!--
fetch 把一次 HTTP 对话拆成 Request、Response、Headers 三个标准对象。fetch 的参数和 Request 构造器签名完全一致，所以选项既可以直接给 fetch，也可以先造一个 Request——请求从此是可以存进 Cache API、在 SW 里改写转发、当模板派生变体的"值"。这是 Service Worker 能工作的根基，XHR 完全给不了。

[click] 第二段是二次构造：以旧请求为模板只换部分选项，其余全部继承。注意带 body 的 Request 发送一次就被消费，重发要先 clone——下一页展开。

[click] Response 有三个静态工厂，Response.json 一行造 JSON 响应，是 SW mock 和边缘函数的标准姿势；type 有五个值，其中 opaque 后面单独讲。

[click] Headers 会做输入净化，fetch 拿到的响应头是 immutable 的，想"补个头"只能用旧 body 重建一个 Response；Cookie、Origin 这些禁设头写了也是静默忽略。
-->

---
layout: default
---

# body 是一次性的：单次消费与 `clone()` 时机

<div class="grid grid-cols-[1.15fr_.85fr] gap-8 mt-4 items-start">

````md magic-move {at:1}
```js
const res = await fetch("/api/data");

const a = await res.json(); // OK，bodyUsed → true
const b = await res.json(); // TypeError：body 已被消费
```

```js
const res = await fetch("/api/data");
const copy = res.clone(); // 克隆必须赶在任何读取之前

const a = await res.json();  // 原件读原件的
const b = await copy.json(); // 克隆件读克隆件的
```

```js
// SW 标准模式：一份回页面、一份进缓存
const res = await fetch(request);
if (res.ok) {
  const cache = await caches.open("v1");
  cache.put(request, res.clone()); // 读之前克隆
}
return res;
```
````

<div class="rule-stack">
  <div class="rule tone-red"><strong>disturbed：读过即废</strong><span>任何读取方法动过 body，bodyUsed 置 true，再读抛 TypeError</span></div>
  <div v-click class="rule tone-amber"><strong>locked：被读取器锁住</strong><span>getReader() 附加后全量方法进不来；带 body 的 Request「发送」也算消费</span></div>
  <div v-click class="rule tone-blue"><strong>clone() 两条铁律</strong><span>对 bodyUsed 的对象克隆本身就抛错；克隆不免费——两份流各自缓冲内存</span></div>
</div>
</div>

<!--
body 本质是流，流只能读一次。第一屏是最常见的翻车现场：读两次 json，第二次直接 TypeError。

[click] 修复方式是 clone，但克隆必须赶在任何读取之前——对 bodyUsed 为 true 的对象调 clone 本身就抛错。

[click] 第三屏是这个机制存在的意义：Service Worker 里"一份回页面、一份进缓存"，clone 让两个消费方各自拥有完整的一次读取机会。

右边三条规则：disturbed 和 locked 是 MDN 口径的两个"不可再读"状态；带 body 的 Request 发送本身就是在读流，同一个 POST Request 发两次也抛错；最后，克隆的两份流数据要各自缓冲，一方读得慢内存里就积压另一方的数据，海量大响应别无脑克隆。
-->

---
layout: default
---

# 六种 body 读取方法：全量、异步、只此一次

<div class="type-map type-map--three mt-6">
  <div v-click class="type-cell tone-blue"><code>json()</code><span>API 响应；body 非法或为空时 reject——204 别调它</span></div>
  <div v-click class="type-cell tone-blue"><code>text()</code><span>纯文本 / HTML；始终按 UTF-8 解码</span></div>
  <div v-click class="type-cell tone-green"><code>blob()</code><span>文件下载，配 URL.createObjectURL() 用</span></div>
  <div v-click class="type-cell tone-green"><code>arrayBuffer()</code><span>二进制底座，再包 TypedArray 才能操作</span></div>
  <div v-click class="type-cell tone-amber"><code>bytes()</code><span>直接给 Uint8Array——Baseline Newly 2025-01</span></div>
  <div v-click class="type-cell tone-red"><code>formData()</code><span>主用于 SW 解析拦截到的表单提交</span></div>
</div>

<div v-click class="takeaway mt-6">六读方法 Request 与 Response 通用，全部消费掉唯一一次读取机会；兼容旧浏览器时 bytes() 的等价写法是 new Uint8Array(await res.arrayBuffer())。</div>

<!--
六种读取方法共同特征：全部返回 Promise、全部等 body 完整到达才兑现、全部消费掉唯一一次读取机会。

[click:2] json 和 text 是日常主力。json 的失败面注意两个：body 不是合法 JSON、以及空 body——204 No Content 调 json 必炸，先看 status 再决定读不读。

[click:2] blob 拿带 MIME 类型的文件对象；arrayBuffer 是二进制底座，但拿到后还要手包一层 TypedArray。

[click] 所以有了 bytes：直接给 Uint8Array，2025 年 1 月进 Baseline——Firefox 128、Safari 18、Chrome 132 补齐。读文件头识别类型这种场景比 arrayBuffer 顺手。

[click:2] formData 页面侧少用，主战场是 SW 里解析拦截到的表单提交。要"边到边处理"而不是全量等待，就直接读 response.body——流式页展开。
-->

---
layout: default
---

# 取消与超时：`AbortController` → `timeout()` → `any()`

<div class="grid grid-cols-[1.1fr_.9fr] gap-8 mt-4 items-start">

````md magic-move {at:1}
```js
// ① 取消的标准接线：fetch 自己没有 cancel()
const controller = new AbortController();
const promise = fetch("/api/report", {
  signal: controller.signal,
});

cancelBtn.onclick = () => controller.abort();
// reject → AbortError（DOMException）
```

```js
// ② 超时的官方答案：到点自动中止的信号
const res = await fetch("/api/report", {
  signal: AbortSignal.timeout(8000),
});
// 到点 reject → TimeoutError
// 与用户取消天然可区分，且不用 clearTimeout
```

```js
// ③ 组合信号：任一触发即中止，对标 Promise.race
const controller = new AbortController();
const res = await fetch("/api/report", {
  signal: AbortSignal.any([
    controller.signal,         // 用户取消 → AbortError
    AbortSignal.timeout(8000), // 超时 → TimeoutError
  ]),
});
```
````

<div class="rule-stack">
  <div class="rule tone-blue"><strong>信号一次性</strong><span>aborted 过的 signal 再交给 fetch 立即 reject——每轮请求配新 controller / 新 timeout()</span></div>
  <div v-click class="rule tone-amber"><strong>取消覆盖全程</strong><span>fetch 已 fulfill、body 还在读时 abort()，读取的 Promise 同样以 AbortError reject</span></div>
  <div v-click class="rule tone-green"><strong>reason 可分流</strong><span>any() 的 reason 取第一个触发的源信号——err.name 分流依然成立（Baseline 2024-03）</span></div>
</div>
</div>

<!--
取消能力被抽成独立的 AbortController / AbortSignal 体系，所以它能被 Streams、WebSocket 封装、addEventListener 复用。第一屏：signal 接线、controller.abort() 触发，Promise 以 AbortError reject。经典应用是搜索建议的竞态治理——发新请求前先干掉在途的旧请求。

[click] fetch 没有 timeout 选项，官方补丁是 AbortSignal.timeout：超时抛 TimeoutError，和用户取消的 AbortError 天然可区分——手写 setTimeout 加 abort 两者都是 AbortError，分不开。注意计时覆盖整个响应期，大文件按总时长估。

[click] 真实场景两样都要：AbortSignal.any 把多个信号并成一个，任一触发即中止。层层封装时每层还能叠加自己的超时，不破坏上游信号。

[click:2] 右边三条语义：信号一次性（重试循环里尤其要每轮新建）；取消管到最后一个字节；组合后按 err.name 分流依然成立。any 是 2024-03 Baseline——Chrome 116、Firefox 124、Safari 17.4。
-->

---
layout: default
class: lab-slide
---

# 交互实验：取消与超时的竞速

<AbortRaceLab />

<!--
现场演示错误分流。数据源是自造的慢速 ReadableStream——32 块、每块 32 KiB、每 100 毫秒到一块，全部收完约 3.2 秒，不依赖真实网络。两个信号用 AbortSignal.any 合并：手动按钮触发 controller.abort()，滑杆控制 AbortSignal.timeout 的毫秒数。

三种玩法：默认超时闸 2 秒，什么都不做，时间条先到头——状态卡变玫红，err.name 是 TimeoutError；下载中途点 controller.abort()——琥珀色 AbortError，提示"静默收尾，别灌监控"；把闸拉到 6 秒再开始——数据条跑赢，绿色完成。

让大家盯住状态卡里的 err.name：组合信号的 reason 取第一个触发的源信号，所以分流逻辑在组合后依然成立——这就是上一页第三条规则的肉眼版。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 按 `err.name` 分流，然后才谈重试

::left::

### 错误四分流

<table class="decision-table">
  <thead><tr><th>错误</th><th>处置</th></tr></thead>
  <tbody>
    <tr><td><code>AbortError</code></td><td>预期内流程：静默收尾，勿上报勿重试</td></tr>
    <tr><td><code>TimeoutError</code></td><td>提示用户 / 退避重试</td></tr>
    <tr><td><code>TypeError</code></td><td>网络层故障，可重试</td></tr>
    <tr><td><code>!response.ok</code></td><td>按状态码分治：401 登录、429 退避</td></tr>
  </tbody>
</table>

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>Chrome / Edge 103–123 的 timeout() 超时误抛 AbortError（124 才修）——老 Chromium 存量多的产品要双兜底。</span>
</div>

::right::

### 重试先过三道闸

<div class="rule-stack">
  <div v-click class="rule tone-blue"><strong>① 错误可重试吗</strong><span>TypeError / TimeoutError / 5xx / 429 才值得重；4xx 重多少次都是错</span></div>
  <div v-click class="rule tone-amber"><strong>② 方法幂等吗</strong><span>GET / PUT / DELETE 天然幂等；POST 配 Idempotency-Key——超时 ≠ 服务端没收到</span></div>
  <div v-click class="rule tone-green"><strong>③ 有节制吗</strong><span>次数封顶 + 指数退避 + 随机抖动防重试风暴；尊重 Retry-After</span></div>
</div>

<div v-click class="mini-note mt-3">两个易漏：退避等待期也要能被 signal 打断；timeout() 信号触发过就废——重试循环里每轮新建。</div>

<!--
左表是错误处理的落点：AbortError 静默、TimeoutError 与 TypeError 可重试、HTTP 层按状态码分治。把 AbortError 灌进错误监控是常见污染源——组件卸载、搜索词变更都会产生取消，全是预期内流程。

[click] 一个真实兼容坑：Chrome 和 Edge 的 103 到 123 版，timeout 超时误抛的是 AbortError，124 才修正成 TimeoutError。按 name 分流时，老 Chromium 存量用户多的产品在 AbortError 分支里别把"用户取消"当唯一可能。

[click] 重试第一道闸：错误得可重试。网络类、超时、5xx、429 才有意义；参数错、未授权这些 4xx 重一万次也是错，还给服务端加压。

[click] 第二道闸最容易出事故：POST 不幂等，超时不等于服务端没收到——盲目重试就是重复下单。工程解法是客户端生成幂等键，服务端按键去重。

[click:2] 第三道闸：封顶次数、指数退避加随机抖动，防止故障恢复瞬间所有客户端同节拍打回来造成二次雪崩。ky、ofetch 都内建这套，不想手维护就上库。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# `mode` 与 opaque：能发出去，不等于能读到

::left::

### mode：跨域行为总开关

<table class="decision-table">
  <thead><tr><th>值</th><th>跨域行为</th></tr></thead>
  <tbody>
    <tr><td><code>cors</code>（默认）</td><td>走 CORS 协商；服务端不配头 → reject TypeError</td></tr>
    <tr><td><code>same-origin</code></td><td>跨域直接网络错误，请求根本不发</td></tr>
    <tr><td><code>no-cors</code></td><td>不协商不预检——代价是 opaque 响应</td></tr>
    <tr><td><code>navigate</code></td><td>仅文档导航自建，脚本用不到</td></tr>
  </tbody>
</table>

<div v-click class="mini-note mt-3">no-cors 三限制：方法只剩 GET / HEAD / POST；头只剩 CORS-safelisted（Range 也不行）；响应被「封箱」。</div>

::right::

### opaque：被浏览器「封箱」

```js
const res = await fetch(cdn, { mode: "no-cors" });

res.type;         // "opaque"
res.status;       // 0 —— 不是真实状态码！
res.ok;           // false —— 永远 false
[...res.headers]; // [] —— 头全滤掉
await res.text(); // "" —— body 也读不到
```

<div v-click class="signal signal-bad mt-3">
  <carbon:warning-alt />
  <span>把 no-cors 当「绕过 CORS」的偏方：报错没了，数据也没了，连成败都无从判断。唯一正经用途是 SW 缓存跨域静态资源。</span>
</div>

<!--
mode 决定"允不允许跨域、按什么规则跨"。默认 cors：简单请求直发、非简单先预检，服务端头不对整个请求按网络错误处理。CORS 协商机制本身是网络层知识，这里只记 fetch 侧映射。

[click] no-cors 换来的三条硬限制：方法、头都被砍到白名单，响应变 opaque。

右边这段代码值得逐行看：opaque 响应 status 恒 0、ok 恒 false、头全滤、body 读出来是空——服务器返回 200 还是 404 你都不知道。通用封装里 if (!res.ok) throw 的逻辑遇到 opaque 一律抛错，哪怕请求其实成功了。

[click] 真实项目里 no-cors 出现在业务代码，九成是把它当"绕过 CORS 报错"的偏方——绕过的只是报错，数据照样拿不到。唯一正经用途是 Service Worker 缓存跨域静态资源：能存能回放，就是不能看；而且浏览器为防泄露给 opaque 记远大于实际的配额占用（Chromium 约 7MB 一个），大量缓存会撑爆存储。想读响应，唯一正解是服务端配 CORS 头。
-->

---
layout: default
---

# `credentials`：凭据三档，include 要连过三道闸

凭据 = Cookie + TLS 客户端证书 + Authorization 头；这个选项同时管「发」与「收 Set-Cookie」。

<table class="decision-table mt-3">
  <thead><tr><th>值</th><th>行为</th></tr></thead>
  <tbody>
    <tr><td><code>omit</code></td><td>任何情况都不带，也忽略响应里的 Set-Cookie</td></tr>
    <tr><td><code>same-origin</code>（默认）</td><td>仅同源请求带凭据</td></tr>
    <tr><td><code>include</code></td><td>跨域也带——需要下面三道闸全过</td></tr>
  </tbody>
</table>

<div class="pipeline mt-5">
  <div v-click class="pipeline-step tone-blue">
    <span class="step-no">闸 1 · 客户端</span>
    <strong>credentials: "include"</strong>
    <span>请求侧声明跨域带凭据</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div v-click class="pipeline-step tone-amber">
    <span class="step-no">闸 2 · 服务端双头</span>
    <strong>ACAC: true + ACAO 具体源</strong>
    <span>Allow-Credentials 必须 true；Allow-Origin 不能是 *</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div v-click class="pipeline-step tone-green">
    <span class="step-no">闸 3 · Cookie 自身</span>
    <strong>SameSite 放行</strong>
    <span>Strict / Lax 照样拦跨站——「include 了没 Cookie」头号答案</span>
  </div>
</div>

<div v-click class="takeaway mt-4">headers 里手写 Cookie 是禁设头，静默忽略还不报错——凭据只能靠这套开关声明。</div>

<!--
credentials 三档：omit 永不带、same-origin 默认仅同源带、include 跨域也带。注意它是双向的：不光管请求带不带，还管响应里的 Set-Cookie 认不认。

[click] include 是 CSRF 风险放大器，所以规范要求层层确认。第一道闸是客户端声明。

[click] 第二道闸在服务端：响应必须同时有 Access-Control-Allow-Credentials 为 true，且 Allow-Origin 写具体的请求源——凭据模式下通配符被禁用。缺一条，浏览器把响应按网络错误处理。

[click] 第三道闸最容易被忽略：Cookie 自身的 SameSite 属性优先级更高。现代浏览器默认 Lax，跨站请求照样带不出去——"为什么 include 了还没 Cookie"的头号答案在这里，跟 fetch 无关。

[click] 最后：在 headers 里手写 Cookie 不报错但静默无效，这是安全模型的一部分。
-->

---
layout: default
---

# `cache`：六档只回答三个问题——读吗、验吗、写吗

<table class="decision-table mt-4">
  <thead><tr><th>值</th><th>读缓存</th><th>写缓存</th><th>行为</th></tr></thead>
  <tbody>
    <tr><td><code>default</code></td><td>是</td><td>是</td><td>标准语义：新鲜直接用，过期发条件请求验证</td></tr>
    <tr><td><code>no-store</code></td><td>否</td><td><strong>否</strong></td><td>完全绕过缓存直连网络</td></tr>
    <tr><td><code>reload</code></td><td>否</td><td><strong>是</strong></td><td>直连网络，并用响应刷新缓存</td></tr>
    <tr><td><code>no-cache</code></td><td>是</td><td>是</td><td>命中也必发条件请求验证，304 才用缓存</td></tr>
    <tr><td><code>force-cache</code></td><td>是</td><td>是</td><td>命中就用——过期也用；miss 才走网络</td></tr>
    <tr><td><code>only-if-cached</code></td><td>是</td><td>—</td><td>只用缓存；miss 直接按网络错误 reject</td></tr>
  </tbody>
</table>

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>only-if-cached 必须配 mode: "same-origin"，否则 TypeError；no-cache（必验证）≠ no-store（不碰缓存），与 Cache-Control 同名指令同义。</span>
</div>

<div v-click class="takeaway mt-3">选项是客户端单方面的「怎么用本地 HTTP 缓存」；服务端 Cache-Control 决定「能不能存、新鲜多久」——force-cache 救不了响应头 no-store 的资源。</div>

<!--
cache 声明这次请求怎么用浏览器的 HTTP 缓存，六个值按"读缓存吗、怎么算新鲜、写缓存吗"三个问题理解。典型场景：用户点"刷新报表"用 reload——拉新并更新缓存；静态字典能用就用选 force-cache；离线兜底探测用 only-if-cached。

[click] 两个坑：only-if-cached 必须绑 same-origin 出现，否则直接 TypeError；no-cache 和 no-store 名字最容易记反——no-cache 是"命中也必须验证一次"，no-store 是"完全不碰缓存"，语义沿用 Cache-Control 的同名指令。

[click] 概念对齐：这里是客户端单方面的使用策略，服务端 Cache-Control 决定的是缓存里存什么、新鲜多久，两层配合不冲突——响应头本身 no-store 的资源，force-cache 也救不了，因为缓存里根本没有。

同族策略选项还有三个，口径记速记版：redirect 的 manual 档读不到 Location（是给 SW 存储重放用的，事后侦测靠 res.redirected 和 res.url）；integrity 做 SRI 校验，不匹配按 TypeError reject 而不是 !ok；priority 是调度提示，2024-10 Baseline。
-->

---
layout: default
---

# 流式读取：`response.body` 就是 ReadableStream

<div class="grid grid-cols-[1.15fr_.85fr] gap-8 mt-4 items-start">

````md magic-move {at:1}
```js
// 可移植读法：getReader() + read 循环（全浏览器安全）
const reader = res.body.getReader();

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  process(value); // Uint8Array 一到就处理
}
```

```js
// fetch 版 onprogress：总量看头，进度靠累计
const total = Number(res.headers.get("Content-Length")) || 0;
const reader = res.body.getReader();
let loaded = 0;

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  loaded += value.byteLength;
  onProgress(loaded, total); // total 为 0 → 显示已下载量
}
```

```js
// 字节 → 文本：跨块安全是关键
const reader = res.body
  .pipeThrough(new TextDecoderStream()) // 路线一：全绿
  .getReader();

// 路线二：手动解码必须 stream: true ——
// 汉字 3 字节可能被分块拦腰截断，不带就周期性乱码
decoder.decode(value, { stream: true });
```
````

<div class="rule-stack">
  <div class="rule tone-red"><strong>gzip 口径坑</strong><span>Content-Length 是压缩后的线上字节，read() 拿到的是解压后字节——相除能算出 120% 的进度</span></div>
  <div v-click class="rule tone-amber"><strong>for await 先别裸用</strong><span>ReadableStream 异步迭代 Safari 27 才补齐——核于 2026-07 还不是跨浏览器安全写法</span></div>
  <div v-click class="rule tone-blue"><strong>流式与全量二选一</strong><span>getReader() 后流 locked，json() 必炸；两样都要先 clone()；取消走同一套 AbortSignal</span></div>
</div>
</div>

<!--
json、text 都要等 body 全部到达；response.body 直接暴露底层字节流，数据一到就能处理——大文件、AI 逐 token 输出、日志尾随全靠它。第一屏是可移植读法：getReader 加 read 循环，每块是一个 Uint8Array，块大小由网络和浏览器决定，不可假设。

[click] 第二屏搭出 fetch 版 onprogress：总量取 Content-Length，进度靠累计每块的 byteLength。注意 total 可能是 0——分块传输没这个头，进度条要能降级成不确定态；跨域还需要服务端用 Access-Control-Expose-Headers 暴露它。

[click] 第三屏是文本解码：推荐 TextDecoderStream 管道，全绿。手动路线必须带 stream: true——UTF-8 汉字占 3 字节，网络分块随时把它拦腰截断，不带这个选项就周期性输出乱码，这是 AI 打字机效果偶发"锟斤拷"的经典病根；结尾还要空参 decode 一次冲刷缓冲。

右边三条：gzip 口径坑让进度算出超过 100%；for await 遍历 body 在 Safari 27 之前不可用，MDN 示例别照抄；流式和全量二选一，两样都要先 clone。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 上传流（专家页）：`duplex: "half"` 与四条硬限

::left::

```js {1-2|4-8|10-12|all}
// 恒等 TransformStream：拿到 WritableStream 接口
const { readable, writable } = new TransformStream();

const uploading = fetch("/api/upload-stream", {
  method: "POST",
  body: readable,   // readable 端当请求体
  duplex: "half",   // body 为流时必填
});

// 生产侧随写随传；配 CompressionStream 边压边传
const writer = writable.getWriter();
await writer.write(new TextEncoder().encode("part 1"));
```

<div v-click class="mini-note mt-3">仅 Chromium 105+（Firefox / Safari 未实现，非 Baseline）——渐进增强：特性检测通过才流式，否则回退 Blob / FormData 整体上传。</div>

::right::

<div class="grid grid-cols-2 gap-3 mt-1">
  <div v-click class="rule tone-blue"><strong>half 半双工必填</strong><span>请求体发完才开始给响应；「边发边收」要拆两个 fetch 用 ID 关联</span></div>
  <div v-click class="rule tone-amber"><strong>非 303 重定向 reject</strong><span>流不可重放；303 改成 GET 丢弃 body，所以放行</span></div>
  <div v-click class="rule tone-red"><strong>必触发 CORS 预检</strong><span>无 Content-Length 属「新型请求」；no-cors 下直接禁用</span></div>
  <div v-click class="rule tone-green"><strong>仅 H2 / H3</strong><span>HTTP/1.x 连接直接 reject；反代终止 H2 再以 H1 回源也会缓冲破坏流式</span></div>
</div>

<div v-click class="takeaway mt-4">这是 fetch 里少有的「先检测再用」区域——链路上任何一环缓冲请求体都会让流式退化，服务端要实测。</div>

<!--
反方向——请求体也可以是流：不等数据备齐就开始发送，录音边采边传、客户端实时日志都是这个形态。这段代码展示一个实用技巧：不传参的 TransformStream 是恒等管道，writable 端给生产者随写随传，readable 端交给 fetch 当 body；配 CompressionStream 还能边压边传。

[click:2] duplex: "half" 是 body 为流时的必填项，缺了直接 TypeError。

[click:2] 右边四条硬限全部来自 Chrome 官方口径。半双工：整个请求体发完才开始读响应，想真双工目前只能拆两个 fetch。重定向：流不可重放，除 303 外一律 reject。

[click:2] 预检：没有 Content-Length 的请求属于新型请求，一律先预检，no-cors 禁用。协议：仅 H2、H3——HTTP/1.1 请求方向的 chunked 兼容风险大，直接拒。

[click] 工程判断：这是渐进增强项。特性检测的官方写法利用"不支持的浏览器会把流 toString 成字符串"这个行为探测；检测过了也别掉以轻心，反代、CDN、安全软件缓冲请求体都会让流式静默退化。
-->

---
layout: default
---

# 离页最后一发：`keepalive: true`

<div class="grid grid-cols-[1.05fr_.95fr] gap-8 mt-4 items-start">

```js {2-3|6|all}
// pagehide / visibilitychange(hidden) 里发最后一包
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "hidden") return;
  fetch("/api/analytics", {
    method: "POST",
    keepalive: true, // 页面销毁，请求继续存活
    body: JSON.stringify(collectMetrics()),
  });
});
```

<table class="decision-table">
  <thead><tr><th>维度</th><th>keepalive fetch</th><th>sendBeacon</th></tr></thead>
  <tbody>
    <tr><td>方法与头</td><td>任意方法 + 自定义头</td><td>仅 POST，无自定义头</td></tr>
    <tr><td>响应</td><td>可读（Promise 正常兑现）</td><td>拿不到，只返回入队布尔</td></tr>
    <tr><td>支持面</td><td>Baseline 2024-11（Firefox 133 补齐）</td><td>多年全绿——退居兜底位</td></tr>
  </tbody>
</table>

</div>

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>64 KiB 配额由所有在途 keepalive 请求共享——超限立即 reject TypeError，不是排队；大报文先压缩 / 采样 / 拆分。</span>
</div>

<div v-click class="takeaway mt-3">别在 unload / beforeunload 里发：事件本身不可靠还破坏 BFCache——pagehide + visibilitychange(hidden) 双监听。</div>

<!--
页面卸载瞬间的"最后一发"上报有个经典困境：普通 fetch 会随页面销毁被取消。keepalive: true 让请求脱离页面生命周期，页面关了也会送达。

[click] 时机监听 visibilitychange 变 hidden，配合 pagehide 双保险。

[click] 关键就一个选项。它 2024 年 11 月才真正 Baseline——Chrome 66、Safari 13 早就支持，等的是 Firefox 133 补齐。

右表对比老前辈 sendBeacon：只有 POST、不能自定义头（发不了 application/json 和认证头）、拿不到响应、SW 里不可用。新代码一律 keepalive fetch，sendBeacon 退居老浏览器兜底。

[click] 最大的坑是配额：body 上限 64 KiB，而且由所有在途 keepalive 请求共享——超限立即抛 TypeError 而不是排队。

[click] 时机上别用 unload 系事件：多家浏览器干脆不触发，还会破坏往返缓存。但"什么时机调用"这个问题本身在移动端仍有缺口——这正是下一页 fetchLater 要根治的。
-->

---
layout: default
---

# `fetchLater()`：把「何时发」交还浏览器（前沿）

不再赌 unload 系事件——注册延迟请求，页面销毁或 activateAfter 到点（先到者）由浏览器代发。

<div class="quota-map mt-4">
  <div class="quota-map__label">顶级文档配额总额 640 KiB（URL + 头 + 体全部计入）</div>
  <div class="quota-map__row">
    <div v-click class="quota-block tone-blue"><strong>512 KiB</strong><span>顶级文档 + 同源直接子框架共享</span></div>
    <div v-click class="quota-block tone-amber"><strong>128 KiB</strong><span>跨域子框架公共池：每框架预分配 8 KiB，约前 16 个有份</span></div>
  </div>
  <div v-click class="quota-strip"><carbon:warning /> 单上报源在途合计 ≤ 64 KiB；超限或被 Permissions Policy 拒绝统一抛 QuotaExceededError——调用必须 try/catch，降级走 keepalive</div>
</div>

<div class="grid grid-cols-3 gap-4 mt-4">
  <div v-click class="fact"><strong>响应不可读</strong><span>返回值只有 activated 布尔；改 payload = abort 旧的再注册新的</span></div>
  <div v-click class="fact"><strong>硬限制</strong><span>仅 HTTPS；body 不能是流；activateAfter 负值抛 RangeError</span></div>
  <div v-click class="fact"><strong>支持面</strong><span>Chrome / Edge 135+，非 Baseline——特性检测后渐进增强</span></div>
</div>

<div v-click class="takeaway mt-4">离页三件定位：keepalive 解决「发了别断」（Baseline 主线）；sendBeacon 是老式简配（兜底）；fetchLater 解决「何时发」（Chromium 前沿，增强）。</div>

<!--
fetchLater 换了思路：不是"在正确的时机发请求"，而是提前注册一个延迟请求，由浏览器保证在页面销毁或 activateAfter 超时到点时发出，先到者触发——开发者从此不赌 unload 系事件。

[click:2] 配额结构图对着看：顶级文档总额 640 KiB，拆成 512 给顶级文档和同源子框架共享，128 给跨域子框架公共池——每个跨域 iframe 入 DOM 时预分配 8 KiB，所以大约前 16 个有份。这套设计是防止离页带宽被第三方脚本滥用。

[click] 更细一层：同一个上报源在途合计不超 64 KiB，URL 长度、头、体全部计入。超限抛 QuotaExceededError，而且被 Permissions Policy 拒绝也是同一个错误、不可区分——所以官方口径是几乎所有调用都应该 try/catch，配额没了降级走 keepalive。

[click:3] 三个事实：它是纯上报通道，响应发出即丢弃；仅 HTTPS、body 长度必须已知；Chrome/Edge 135 起，非 Baseline，Firefox 和 Safari 立场积极但未实现。

[click] 收个尾：keepalive 是主线、sendBeacon 是兜底、fetchLater 是增强，三者分工记这一句就够。
-->

---
layout: default
---

# 选型：原生 fetch 与封装库的分工

<table class="decision-table mt-4">
  <thead><tr><th>诉求</th><th>答案</th><th>一句话理由</th></tr></thead>
  <tbody>
    <tr v-click><td>几个请求、无统一治理需求</td><td><strong>裸写 fetch</strong></td><td>SW / Cache / 流式 / 边缘运行时的唯一一等公民</td></tr>
    <tr v-click><td>拦截器体系 + 大生态 + 上传进度</td><td>Axios</td><td>历史 XHR 底座（现支持 fetch adapter），兼容老项目</td></tr>
    <tr v-click><td>现代浏览器的轻治理层</td><td>ky</td><td>fetch 薄封装：retry / timeout / hooks / 非 2xx 自动抛</td></tr>
    <tr v-click><td>Node / 浏览器同构</td><td>ofetch</td><td>Nuxt 系通用封装：自动 JSON、baseURL</td></tr>
  </tbody>
</table>

<div v-click class="takeaway mt-5">封装库的取消语义、错误分类、流式能力全部继承自 fetch——原生语义不清楚，库的坑照样踩；「自动 reject 非 2xx」正是所有封装库针对原生头号坑的共同产品点。</div>

<!--
原生 fetch 刻意保持低层：拦截器、自动重试、统一超时治理、自动 JSON，一概不管——这些正是封装库的产品化空间。

[click] 简单场景裸写 fetch 就够；而且在 Service Worker、Cache API、流式、边缘运行时这些平台集成场景，它是唯一选项。

[click] Axios 生态最大、拦截器体系成熟，历史底座是 XHR——这反而成全了它的上传进度能力，老项目和上传进度需求选它。

[click:2] ky 和 ofetch 都是 fetch 薄封装：ky 浏览器优先，重试超时 hooks 齐活；ofetch 是 Nuxt 系，Node 浏览器同构、自动 JSON。

[click] 最后一句话是本页的点题：所有封装库的底座与心智模型仍是 fetch。第一个共同产品点就是"自动 reject 非 2xx"——恰好是我们第三页讲的原生头号坑。原生语义不清楚，换库不解决问题。
-->

---
layout: default
---

# 易错点 TOP 6

<div class="summary-grid mt-6">
  <div v-click><span>01</span><strong>不查 ok 直接 json()</strong><small>404 错误页进 JSON 解析器，收获 SyntaxError——两步走不能省</small></div>
  <div v-click><span>02</span><strong>body 读两次 / clone 太晚</strong><small>bodyUsed 之后连 clone() 都抛错——克隆永远是第一动作</small></div>
  <div v-click><span>03</span><strong>no-cors 当 CORS 偏方</strong><small>opaque：status 恒 0，成败无从判断——服务端配头才是正解</small></div>
  <div v-click><span>04</span><strong>include 只配了 ACAO *</strong><small>凭据模式禁通配，还差 ACAC: true 与 Cookie 的 SameSite 放行</small></div>
  <div v-click><span>05</span><strong>AbortError 灌进错误监控</strong><small>取消是预期流程——按 err.name 过滤，别让噪声淹了大盘</small></div>
  <div v-click><span>06</span><strong>keepalive 塞大报文</strong><small>64 KiB 在途共享配额，超限立即 TypeError——压缩 / 采样 / 拆分</small></div>
</div>

<!--
[click] 一号坑贯穿全场：不查 ok 直接 json，404 的 HTML 错误页进了 JSON 解析器，报出来的是莫名其妙的 SyntaxError，排查方向直接带偏。

[click] 二号：body 是一次性的流，clone 必须是第一动作——对 bodyUsed 的对象克隆本身就抛错。

[click] 三号：no-cors 绕过的只是报错，opaque 响应连成败都无从判断。

[click] 四号：跨域凭据要三道闸全过——客户端 include、服务端双头且禁通配、Cookie 自身 SameSite 放行。

[click] 五号：把取消当故障上报，错误监控全是噪声——组件卸载、搜索词变更产生的 AbortError 都是预期内流程。

[click] 六号：keepalive 的 64 KiB 是所有在途请求共享的硬配额，超限立即 TypeError。这六条覆盖了笔记里易错点清单的头部，全表见参考页。
-->

---
layout: center
class: summary-slide
---

# 带走四个判断

<div class="summary-grid mt-8">
  <div><span>01</span><strong>错误分三层</strong><small>reject 只有网络与取消；HTTP 成败靠 ok 自查</small></div>
  <div><span>02</span><strong>body 是一次性的流</strong><small>单次消费、读前 clone、流式与全量二选一</small></div>
  <div><span>03</span><strong>取消超时可组合</strong><small>AbortSignal.any + err.name 分流；信号每轮新建</small></div>
  <div><span>04</span><strong>离页上报走 keepalive</strong><small>64 KiB 配额记心里；fetchLater 渐进增强</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" target="_blank"><carbon:book /> Using Fetch（MDN）</a>
  <a href="https://fetch.spec.whatwg.org/" target="_blank"><carbon:document /> WHATWG 规范</a>
  <a href="https://developer.chrome.com/docs/capabilities/web-apis/fetch-streaming-requests" target="_blank"><carbon:rocket /> 上传流（Chrome Docs）</a>
</div>

<!--
四句话复盘：错误面分三层，Promise 只 reject 网络与取消，HTTP 成败查 ok；body 是一次性的流，克隆赶在读取前；取消与超时用 AbortSignal.any 组合、按 err.name 分流，信号每轮新建；离页上报以 keepalive 为主线，fetchLater 做渐进增强。

掌握这四条，再去看 Axios、ky、ofetch 这些封装库，就能分清哪些是库的产品化、哪些是 fetch 的本体语义。深入细节回笔记：三对象、请求策略三件套、流式与离页各有一页速查表。
-->
