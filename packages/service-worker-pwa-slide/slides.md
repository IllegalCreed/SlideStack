---
theme: seriph
layout: cover
title: Service Worker 与 PWA
info: |
  从"可编程网络代理"出发，讲透 Service Worker 的生命周期与更新模型、fetch 拦截、离线兜底、
  Push 推送、后台同步，以及 PWA 的 Manifest 与安装。

  Learn more at [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark">SW</div>

# Service Worker 与 PWA

## 坐在页面与网络之间的可编程代理，把离线、推送、安装带进 Web

<div class="cover-meta">
  <span>W3C Service Workers 标准</span>
  <span>生命周期 · fetch 拦截 · 离线 · Push · 安装</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API" target="_blank" class="slidev-icon-btn" aria-label="MDN 文档">
    <carbon:document />
  </a>
  <a href="https://github.com/w3c/ServiceWorker" target="_blank" class="slidev-icon-btn" aria-label="w3c/ServiceWorker GitHub">
    <carbon:logo-github />
  </a>
</div>

<!--
这份幻灯片讲 Service Worker 与 PWA 的"机制"：生命周期与更新模型、fetch 拦截、离线、Push、后台同步、安装。

一条边界先说清楚：缓存策略（cache-first / network-first / SWR）与 Cache API 的用法在浏览器章讲透，本片只在 fetch 拦截处链接过去、不展开那几段缓存代码。SW 核心已是全浏览器 Baseline，但 Push、Background Sync、beforeinstallprompt 这些周边能力跨浏览器差异极大，是后半程的重点。
-->

---
layout: default
---

# Service Worker 是什么：可编程的网络代理

<div class="pipeline mt-8">
  <div class="pipeline-step tone-blue">
    <span class="step-no">页面</span>
    <strong>发起请求</strong>
    <span>导航 · 子资源 · 跨源引用</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-amber">
    <span class="step-no">Service Worker</span>
    <strong>fetch 事件拦截</strong>
    <span><code>respondWith</code> 决定回什么</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-green">
    <span class="step-no">来源</span>
    <strong>网络 / 缓存 / 合成</strong>
    <span>走网络、命中缓存或就地合成</span>
  </div>
</div>

<div class="grid grid-cols-3 gap-4 mt-10">
  <div v-click class="fact"><strong>独立线程、无 DOM</strong><span>跑在 worker 线程，碰不到 <code>window</code>/<code>document</code>，不阻塞 UI</span></div>
  <div v-click class="fact"><strong>事件驱动、可唤醒</strong><span>空闲即被终止，<code>fetch</code>/<code>push</code>/<code>sync</code> 到来时重新启动</span></div>
  <div v-click class="fact"><strong>脱离页面存活</strong><span>可同时控制多个标签页，页面全关后仍能被唤醒</span></div>
</div>

<!--
MDN 的定义一句话到位：Service Worker 本质上是坐在 Web 应用、浏览器与网络之间的代理服务器。一旦激活，它就能拦截并改写作用域内的每个请求，决定走网络、走缓存，还是就地合成一个响应。

[click] 它跑在独立线程、没有 DOM，所以碰不到 window 和 document。
[click] 它是事件驱动的，空闲会被浏览器终止，事件到来时再唤醒——不是常驻进程。
[click] 正因为"能唤醒 + 能拦网络 + 脱离页面存活"，它才能承载离线、推送、后台同步这些页面脚本做不到的能力。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 注册与作用域：scope 决定它能控制谁

::left::

```js {1|3|4|5-6|all}
if ("serviceWorker" in navigator) {
  // 特性探测，老浏览器优雅降级
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => console.log("作用域", reg.scope))
      .catch((err) => console.error("注册失败", err));
  });
}
```

<div v-click class="mini-note mt-3"><code>register()</code> 不接管已打开的页面——文档要<strong>重新加载</strong>后才被新 SW 控制。</div>

::right::

<div class="rule-stack">
  <div v-click class="rule tone-blue"><strong>默认 scope = 脚本所在目录</strong><span><code>/sw.js</code> 控整站；想控整站就放根目录</span></div>
  <div v-click class="rule tone-amber"><strong>scope 不能宽于脚本路径</strong><span>越权需响应头 <code>Service-Worker-Allowed</code></span></div>
  <div v-click class="rule tone-green"><strong>一个 scope 只有一个 SW</strong><span>重复 <code>register</code> 是幂等更新，不并存两个</span></div>
</div>

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>强安全上下文：只在 <strong>HTTPS</strong> 可用（<code>localhost</code> 例外），非 HTTPS <code>register()</code> 直接失败</span>
</div>

<!--
注册是在页面脚本里做的，不是在 sw.js 里。习惯放在 load 之后，避免和首屏关键资源抢带宽。

[click:4] 关于 scope 三条事实：默认作用域是脚本所在目录，所以想控整站就把 sw.js 放根目录；scope 不能宽于脚本路径，越权要服务端带 Service-Worker-Allowed 头；同一作用域只能有一个 SW，重复注册是幂等更新。

[click] 注册成功不等于立刻生效——register 不控制当前已打开的页面，得刷新后才接管。
[click] 最后是硬门槛：SW 只能在 HTTPS 下注册，localhost 例外用于本地开发。这既是安全要求，也是 PWA 可安装的前提。
-->

---
layout: default
---

# PWA 三件套：可安装 + 离线 + 可推送

<div class="triad mt-6">
  <div v-click class="triad-card tone-blue">
    <strong>Service Worker</strong>
    <span>离线缓存、请求拦截、后台 Push / Sync——"页面之外的能力"的引擎</span>
  </div>
  <div v-click class="triad-card tone-green">
    <strong>Web App Manifest</strong>
    <span>应用身份：名称、图标、启动地址与独立窗口外观——可安装的身份证</span>
  </div>
  <div v-click class="triad-card tone-amber">
    <strong>HTTPS</strong>
    <span>安全上下文前提，SW 注册与 PWA 安装都强制要求（<code>localhost</code> 例外）</span>
  </div>
</div>

<div class="grid grid-cols-2 gap-4 mt-6">
  <div v-click class="fact"><strong>三者独立又缺一不可</strong><span>只有 SW 没 manifest 只是更快的网站；只有 manifest 没 SW 装完断网就白屏</span></div>
  <div v-click class="fact"><strong>SW 安装 ≠ PWA 安装</strong><span><code>install</code> 事件是脚本静默装进浏览器；PWA 安装是用户把应用装到主屏——两回事</span></div>
</div>

<!--
PWA 不是某一个 API，而是一组能力的组合，让 Web 站点获得可安装、能离线、能收推送的类原生体验。拆开就是三件套。

[click:3] Service Worker 提供离线与后台能力，是引擎；Manifest 提供应用身份与安装外观，是身份证；HTTPS 是两者共同的安全前提。

[click] 三者互相独立又缺一不可：只有 SW 没 manifest，能离线但装不到主屏；只有 manifest 没 SW，能弹安装但装完断网白屏。
[click] 特别澄清一个高频混淆：SW 的 install 事件是脚本静默装进浏览器、无需用户许可；PWA 的"安装"是用户把应用装到设备。web.dev 原话——两件相关但独立的事，别混。
-->

---
layout: default
---

# 生命周期：一条单向状态机

<div class="sw-track mt-7">
  <div class="sw-stage tone-blue"><code>installing</code><span>抓取脚本、触发 install</span></div>
  <carbon:arrow-right class="sw-arrow" />
  <div class="sw-stage tone-amber"><code>installed (waiting)</code><span>有旧 SW 时在此排队</span></div>
  <carbon:arrow-right class="sw-arrow" />
  <div class="sw-stage tone-blue"><code>activating</code><span>触发 activate、开始接管</span></div>
  <carbon:arrow-right class="sw-arrow" />
  <div class="sw-stage tone-green"><code>activated</code><span>处理 fetch / push / sync</span></div>
</div>

<div class="grid grid-cols-2 gap-5 mt-8">
  <div v-click class="rule tone-green">
    <strong>分叉一：没有旧 SW（首次安装）</strong>
    <span>install 成功后<strong>直接激活</strong>，<code>registration.active</code> 指向它</span>
  </div>
  <div v-click class="rule tone-amber">
    <strong>分叉二:有旧 SW 在控制页面</strong>
    <span>新 SW 进 <strong>waiting</strong> 排队，等旧标签全关或 <code>skipWaiting</code> 才激活</span>
  </div>
</div>

<div v-click class="mini-note mt-5 text-center">失败或被新版替换 → <code>redundant</code>（作废回收）；三个槽位 <code>installing</code> / <code>waiting</code> / <code>active</code> 各至多一个。</div>

<!--
一个 Service Worker 从注册到作废，走的是一条单向状态机：installing 抓取并触发 install，成功后进 installed；轮到它接管时 activating，正式生效后 activated，开始处理功能事件。

[click:2] 关键在 install 成功后的分叉：如果没有旧 SW 在控制页面，就直接激活；如果有旧 SW，新版进 waiting 排队。这个分叉是下一页交互实验室的主线。

[click] 任何 SW 被新版本替换或安装失败都会变 redundant 作废。规范用 installing、waiting、active 三个槽位记录它，同一时刻各至多一个。下一页我们亲手驱动这台状态机。
-->

---
layout: default
class: lab-slide
---

# 交互实验：生命周期状态机实验室

<ServiceWorkerLifecycleLab />

<!--
这是纯前端模拟，不注册真实 SW——顶部是状态机轨道，实时高亮当前占用的状态并标注版本；左侧是控制面板，右侧是事件日志，每步触发的 install / activate / statechange 都记在里面。

按底部剧本走四条路径：第一次点"部署新版"，没有旧 SW，新版直接 activate 接管；再点一次"部署新版"，这次有旧 SW 控制着标签，新版进入 waiting 排队；勾上 skipWaiting 再部署，跳过等待立即接管；最后不勾 skipWaiting、连点"关闭标签"到 0，waiting 的新版才激活——普通刷新不算关闭标签，这正是"改了代码用户还是旧版"的根源。还可以点"部署相同 sw.js"，字节无差异不触发更新。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# install：waitUntil 圈住预缓存

::left::

```js {1|3|4-9|5|all}
const CACHE = "app-shell-v1"; // 版本化缓存名，发版递增

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      // 预缓存 App Shell（Cache API 用法见浏览器章）
      cache.addAll(["/", "/app.css", "/app.js", "/offline.html"]),
    ),
  );
});
```

::right::

<div class="rule-stack">
  <div v-click class="rule tone-blue"><strong>waitUntil 延长事件寿命</strong><span>promise 未 resolve 就不算装成功，<code>fetch</code>/<code>push</code> 也会等它</span></div>
  <div v-click class="rule tone-amber"><strong>失败可重试</strong><span>某资源 404 让 <code>addAll</code> 整批失败 → 本次 install 失败、下次再试</span></div>
  <div v-click class="rule tone-green"><strong>静默发生</strong><span>install 是脚本装进浏览器，无需用户许可</span></div>
</div>

<div v-click class="signal signal-good mt-4">
  <carbon:checkmark-outline />
  <span>缓存"存什么、什么策略"在浏览器章，这里只演示 install 阶段调用它</span>
</div>

<!--
install 事件在首次注册或更新后触发一次，是预缓存离线资源的标准场所。关键是用 waitUntil 把异步工作圈进安装生命周期。

[click:3] waitUntil 延长事件寿命：一旦用了它，功能事件会等这个 promise resolve 才派发，保证资源没缓存好之前不开始服务；如果某个资源 404 让 addAll 整批失败，本次 install 失败、SW 变 redundant，下次注册会再试；注意 install 是静默发生的，不需要用户许可。

[click] 再次强调边界：怎么存、用什么缓存策略在浏览器章，这里只是在 install 阶段调用 Cache API。
-->

---
layout: default
---

# "关闭所有标签才更新"的坑

<div class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>普通刷新（Cmd/Ctrl + R）<strong>不算关闭标签</strong>——刷新期间标签从未真正关闭，旧 SW 控制权连续，你改了 <code>sw.js</code> 拿到的还是旧版</span>
</div>

<div class="grid grid-cols-2 gap-5 mt-6">
  <div v-click class="rule tone-blue">
    <strong><code>self.skipWaiting()</code></strong>
    <span>在 install 里调用，让新 SW <strong>跳过 waiting、装完立即激活</strong>，不等旧标签关闭</span>
  </div>
  <div v-click class="rule tone-green">
    <strong><code>self.clients.claim()</code></strong>
    <span>在 activate 里调用，让激活的 SW <strong>立即接管当前已打开的页面</strong>（否则等下次导航）</span>
  </div>
</div>

<div v-click class="takeaway mt-6">两者常配对：一个跳过等待、一个立刻接管。代价是页面可能中途被换新 SW——有复杂运行时状态时，更稳的是<strong>探测到 waiting 就弹"有新版本"提示</strong>，让用户点刷新再切。</div>

<!--
这是 SW 生命周期最反直觉的一点。默认行为：已有旧 SW 控制页面时，新 SW 进 waiting 排队，要等所有受控标签全部关闭才激活。

致命细节是普通刷新不算关闭标签——刷新时旧页卸载、新页加载，但标签从未真正关闭，旧 SW 的控制权在刷新前后连续。所以你改了 sw.js、刷新了，拿到的还是旧版。

[click:2] 想快就得主动出手：skipWaiting 让新 SW 跳过 waiting 立即激活；clients.claim 让激活的 SW 立即接管现有页面。skipWaiting 只解决"立即激活"，接管现页是 claim 的事。

[click] 两者常配对。但跳过等待意味着页面可能运行到一半被换新 SW，缓存或协议不兼容就会出错。纯静态站点可以一把梭，有复杂状态的应用更稳的做法是弹提示、让用户点刷新再切版本。
-->

---
layout: default
---

# 更新模型：字节比对与 24 小时检查

<div class="grid grid-cols-3 gap-4 mt-6">
  <div v-click class="fact"><strong>逐字节比对</strong><span>重新抓 <code>sw.js</code> 与已装版本对比，含 <code>importScripts</code>——<strong>差 1 字节就触发更新</strong></span></div>
  <div v-click class="fact"><strong>一字节没变不重装</strong><span>只改资源没改 <code>sw.js</code> 不会更新——版本号 / 清单写进 <code>sw.js</code> 保证内容变化</span></div>
  <div v-click class="fact"><strong>至少每 24h 检查</strong><span>每次导航到作用域内页面都查；长期不导航也至少 24 小时一次</span></div>
</div>

<div class="grid grid-cols-[1fr_1fr] gap-6 mt-6 items-start">

```js {1-2|4-6|all}
// 页面侧：切到新版后重载一次
let reloaded = false;
navigator.serviceWorker.addEventListener("controllerchange", () => {
  if (reloaded) return; // 防重复
  reloaded = true;
  location.reload();
});
```

<div class="rule-stack">
  <div v-click class="rule tone-amber"><strong>别给 <code>sw.js</code> 设长 HTTP 缓存</strong><span>否则更新被推迟；配 <code>Cache-Control: max-age=0</code> 或很短</span></div>
  <div v-click class="rule tone-blue"><strong>手动催更 / 自建提示</strong><span><code>registration.update()</code> 强制查；<code>updatefound</code> + <code>statechange</code> 搭"点击刷新"条</span></div>
</div>

</div>

<!--
浏览器怎么知道 SW 有新版本？靠逐字节比对：每当满足检查时机，重新抓 sw.js 与当前版本对比，含 importScripts 拉取的脚本，差一个字节就认定新版本、触发 install。

[click:3] 反过来，一字节没变就不重装——所以只改了缓存资源却没改 sw.js，SW 不会更新，版本化的做法是在 sw.js 里维护版本常量。检查时机上，每次导航到作用域内页面都查，长期不导航也至少每 24 小时查一次。

[click:2] controllerchange 在控制本页的 SW 变更时触发，配合 skipWaiting 常用来 reload 一次切到新版，注意防重复。
[click:2] 一个部署坑：别给 sw.js 设长 HTTP 缓存，否则更新延迟。想手动催更用 registration.update，想自建"有新版本"提示条监听 updatefound 加 statechange。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# fetch 拦截：respondWith 是全部魔力来源

::left::

```js {1|2|3|all}
self.addEventListener("fetch", (event) => {
  // 调 respondWith = 接管；不调 = 放行走默认网络
  event.respondWith(fetch(event.request));
});
```

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>必须在回调里<strong>同步决定</strong>是否 <code>respondWith</code>——不能先 await 再决定调不调（异步放进它的参数 promise 里）</span>
</div>

::right::

<div class="rule-stack">
  <div v-click class="rule tone-green"><strong>调用它 = 接管</strong><span>返回 <code>Response</code> 或最终 resolve 成 <code>Response</code> 的 promise，页面就拿它</span></div>
  <div v-click class="rule tone-blue"><strong>不调用 = 放行</strong><span>走浏览器默认流程，和没有 SW 一样</span></div>
  <div v-click class="rule tone-amber"><strong>reject 没兜底 = 网络错误</strong><span>每条分支都要 <code>catch</code>，导航请求兜底离线页</span></div>
</div>

<div v-click class="takeaway mt-4">缓存策略（cache-first / network-first / SWR）与 Cache API 用法<strong>在浏览器章</strong>，本页只讲"在哪拦、怎么决定"。</div>

<!--
前面反复说 SW 是可编程网络代理，这个能力就落在 fetch 事件上。一旦 SW 控制了页面，每一个网络请求——导航、子资源、甚至跨源资源——都会触发一次 fetch 事件。

[click:3] 关键理解 respondWith：调用它就接管这个请求，你返回什么页面就拿什么，完全不管原始网络行为；不调用就放行；如果返回的 promise reject 又没兜底，页面直接拿到网络错误，所以每条路径都要 catch。

[click] 一个易踩的细节：必须在回调里同步决定要不要 respondWith，不能先 await 一个结果再决定调不调——要接管就同步调用，把异步放进参数 promise 里。
[click] 再次划边界：缓存策略和 Cache API 的写法全在浏览器章，本页只负责"在哪拦、怎么决定"。
-->

---
layout: default
---

# 请求过滤：不是所有请求都该拦

<table class="decision-table mt-4">
  <thead><tr><th>读 <code>event.request</code> 的</th><th>用途</th></tr></thead>
  <tbody>
    <tr v-click><td><code>method</code></td><td><strong>通常只接管 GET</strong>——Cache API 只支持 GET，<code>POST</code>/<code>PUT</code> 写请求直接放行网络</td></tr>
    <tr v-click><td><code>url</code></td><td>按路径 / 域名过滤；跨源第三方（打点、CDN 脚本）用 <code>origin</code> 白名单放行</td></tr>
    <tr v-click><td><code>mode</code></td><td><code>navigate</code>（页面导航）单独处理，走"网络优先 + 离线兜底"</td></tr>
    <tr v-click><td><code>destination</code></td><td><code>document</code>/<code>script</code>/<code>image</code>/<code>video</code>——按资源类型分流；<code>Range</code> 请求单独放行</td></tr>
  </tbody>
</table>

<div v-click class="takeaway mt-6">盲目接管所有请求是新手最大翻车点：拦了 <code>POST</code> 会误缓存写请求，拦了跨源打点、视频 <code>Range</code> 都会出问题。<strong>先过滤，再决定挑哪个缓存策略（策略在浏览器章）</strong>。</div>

<!--
盲目接管所有请求是新手最常见的翻车点。event.request 上有足够信息做精细过滤。

[click:4] 通常只接管 GET，因为 Cache API 只支持 GET，POST、PUT 这类写请求该直接放行网络；用 url 的 origin 做白名单，别乱接管跨源第三方的打点和 CDN 脚本；mode 为 navigate 的页面导航单独处理，走网络优先加离线兜底；destination 按资源类型分流，视频的 Range 请求缓存处理复杂要单独放行。

[click] 记住顺序：先过滤，再对同源静态资源挑一个缓存策略填进来——而缓存策略本身在浏览器章。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 离线兜底页与 navigation preload

::left::

```js {1|3-10|5|7-8|all}
const OFFLINE = "/offline.html"; // install 时预缓存

async function handleNavigate(request) {
  try {
    return await fetch(request); // 有网走网络
  } catch {
    // 断网 → fetch 抛错 → 回退预缓存的静态离线页
    const cache = await caches.open("offline-v1");
    return (await cache.match(OFFLINE)) ?? Response.error();
  }
}
```

::right::

<div class="rule-stack">
  <div v-click class="rule tone-blue"><strong>离线页是预缓存的静态 HTML</strong><span>SW 里没有 <code>window</code>/DOM，兜底页不能运行时渲染</span></div>
  <div v-click class="rule tone-amber"><strong>判离线靠 <code>fetch</code> 的 catch</strong><span><code>navigator.onLine</code> 只是弱信号，连着 WiFi 没外网仍为 <code>true</code></span></div>
  <div v-click class="rule tone-green"><strong>navigation preload 消冷启动</strong><span><code>registration.navigationPreload.enable()</code> 让浏览器唤醒 SW 时并行发导航请求，<code>event.preloadResponse</code> 取结果</span></div>
</div>

<!--
即便不做完整离线缓存，给导航请求配一个离线兜底页也是性价比最高的一步：有网正常走网络，一旦断网 fetch 抛错，就返回预缓存的静态 offline.html，避免浏览器默认的恐龙页。

[click:2] 两个要点：离线页必须是 install 时就存好的完整 HTML，因为 SW 里没有 window 和 DOM，兜底页不能靠运行时渲染；判定离线靠 fetch 的 catch，不靠 navigator.onLine，后者连着 WiFi 但上不了外网时仍是 true。

[click] 再补一个性能优化：SW 空闲会被终止，导航时得先启动 SW 再发请求，这段冷启动串在关键路径上。navigation preload 让浏览器在唤醒 SW 的同时并行发起导航请求，SW 起来后直接用 event.preloadResponse，注意判空后回退普通 fetch。它是导航请求专属的。
-->

---
layout: default
---

# Push API：服务器把消息推进 SW

<div class="flow mt-6">
  <div v-click class="flow-step"><b>①</b><strong>页面订阅</strong><span><code>pushManager.subscribe({ userVisibleOnly, applicationServerKey })</code> → 拿到 <code>PushSubscription</code>（含 <code>endpoint</code> + 加密公钥）</span></div>
  <div v-click class="flow-step"><b>②</b><strong>上报服务器</strong><span>把订阅（<code>endpoint</code> 要保密）POST 给自己的服务器保存</span></div>
  <div v-click class="flow-step"><b>③</b><strong>服务器推送</strong><span>用 <code>web-push</code> 库 + <strong>VAPID 私钥</strong>签名，经推送服务（FCM / Mozilla / Apple）发消息</span></div>
  <div v-click class="flow-step"><b>④</b><strong>SW 被唤醒</strong><span><code>push</code> 事件触发 → <code>event.waitUntil(registration.showNotification(...))</code> 弹通知</span></div>
</div>

<div v-click class="signal signal-bad mt-5">
  <carbon:warning-alt />
  <span>Baseline 广泛可用（含 <strong>Safari 16.4+</strong>），但 <strong>iOS/iPadOS 必须先"添加到主屏幕"安装为 PWA</strong> 才能订阅推送</span>
</div>

<!--
Push API 让服务器在页面未打开、甚至浏览器未运行时把消息推给用户。它必须和 SW 搭档：消息到达时唤醒 SW 的 push 事件。整条链路四步。

[click:4] 页面订阅拿到 PushSubscription，里面有推送服务分配的唯一 endpoint 和加密公钥；把订阅上报给自己的服务器保存，endpoint 要保密，拿到它就能给用户发推送；服务器用 web-push 库加 VAPID 私钥签名，经推送服务发消息；消息到达唤醒 SW 的 push 事件，用 waitUntil 保证通知弹出前 SW 不被杀。

[click] 支持面：Baseline 广泛可用，含 Safari 16.4 以上。但 iOS 上有个最容易忽略的硬门槛——必须先把网站添加到主屏幕、安装为 PWA，才能在这个已装 PWA 里订阅推送，普通 Safari 标签页订阅不了。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# Push 订阅与接收

::left::

### 页面侧：先要权限，再订阅

```js {1|2|3-6|8|all}
async function subscribePush() {
  if ((await Notification.requestPermission()) !== "granted") return;
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,              // Chrome 强制：必弹通知
    applicationServerKey: VAPID_PUBLIC, // VAPID 公钥
  });
  await fetch("/api/subscribe", { method: "POST", body: JSON.stringify(sub) });
}
```

::right::

### SW 侧：push 事件 + 弹通知

```js {1|2|3-8|all}
self.addEventListener("push", (event) => {
  const p = event.data?.json() ?? { title: "新消息" };
  event.waitUntil(
    // SW 里没有 new Notification()，只能走 registration
    self.registration.showNotification(p.title, {
      body: p.body,
      data: { url: p.url }, // 存点击后跳转地址
    }),
  );
});
```

<!--
左边页面侧订阅：通知权限必须由用户手势触发，未授权就直接返回，因为 userVisibleOnly 的推送发不出；订阅时 applicationServerKey 传你的 VAPID 公钥，私钥留服务器签名；userVisibleOnly 为 true 是 Chrome 强制的，承诺每条推送都弹通知，杜绝静默推送追踪；最后把订阅序列化上报服务器。

右边 SW 侧接收：push 事件里用 event.data 读载荷，waitUntil 保证通知弹出前 SW 不被终止。关键约束——SW 里没有 new Notification，那是页面 API，只能用 registration.showNotification 弹通知，data 字段常用来存点击后要跳转的地址，配合 notificationclick 事件聚焦或打开窗口。
-->

---
layout: default
---

# Notification 权限与点击处理

<div class="grid grid-cols-2 gap-5 mt-5">
  <div v-click class="rule tone-amber"><strong>权限要用户手势</strong><span><code>Notification.requestPermission()</code> 必须由点击等手势触发；未授权不能弹，<code>userVisibleOnly</code> 推送也发不出</span></div>
  <div v-click class="rule tone-blue"><strong>SW 里没有 <code>new Notification()</code></strong><span>只能 <code>self.registration.showNotification(title, opts)</code>；<code>opts</code> 含 <code>body</code>/<code>icon</code>/<code>badge</code>/<code>data</code>/<code>actions</code></span></div>
  <div v-click class="rule tone-green"><strong><code>notificationclick</code> 聚焦或开窗</strong><span><code>clients.matchAll()</code> 找已开窗口 <code>focus()</code>，否则 <code>clients.openWindow(url)</code></span></div>
  <div v-click class="rule tone-blue"><strong><code>pushsubscriptionchange</code></strong><span>订阅失效 / 过期时在 SW 触发——重新订阅并更新服务器</span></div>
</div>

<div v-click class="signal signal-good mt-6">
  <carbon:checkmark-outline />
  <span>通知能力 Chrome / Firefox / Safari 都支持（需用户授权）——是 Push 之外少数跨浏览器一致的周边能力</span>
</div>

<!--
围绕通知的几个要点。

[click:4] 通知权限必须由用户手势触发，未授权不仅不能弹通知，连 userVisibleOnly 的推送都发不出；SW 里没有 new Notification，只能用 registration.showNotification，options 里可以配 body、icon、badge、data、actions；用户点通知触发 notificationclick，标准姿势是用 clients.matchAll 找已有同源窗口聚焦、避免重复开，否则 openWindow 开新窗口；订阅失效或即将过期会在 SW 触发 pushsubscriptionchange，需要重新订阅并更新服务器。

[click] 好消息是，SW 内的通知能力三大浏览器都支持，是 Push 之外少数跨浏览器一致的周边能力，前提是用户授权。
-->

---
layout: default
---

# 后台同步：Background Sync 与 Periodic Sync

<table class="decision-table mt-4">
  <thead><tr><th>能力</th><th>触发时机</th><th>SW 事件</th><th>支持面</th></tr></thead>
  <tbody>
    <tr v-click><td><strong>Push</strong></td><td>服务器主动推</td><td><code>push</code></td><td>Baseline（含 Safari 16.4+；iOS 需装 PWA）</td></tr>
    <tr v-click><td><strong>Background Sync</strong></td><td>恢复网络时</td><td><code>sync</code></td><td><strong>仅 Chromium</strong>（Firefox / Safari 不支持）</td></tr>
    <tr v-click><td><strong>Periodic Sync</strong></td><td>周期性（浏览器裁量）</td><td><code>periodicsync</code></td><td><strong>仅 Chromium + 仅已装 PWA + 参与度门槛</strong></td></tr>
  </tbody>
</table>

<div class="grid grid-cols-2 gap-4 mt-5">
  <div v-click class="fact"><strong>都要 <code>event.waitUntil</code></strong><span>否则 SW 处理到一半就被终止；<code>sync</code> 失败会重试，<code>event.lastChance</code> 标最后一次</span></div>
  <div v-click class="fact"><strong>都是"尽力而为"</strong><span>触发受网络 / 电量 / 参与度裁量，别当准时定时器；全程特性探测 + 降级</span></div>
</div>

<!--
三种后台能力放一起对比。它们的共同前提是"在 SW 里被唤醒执行"，页面关了也能跑。

[click:3] Push 是服务器主动推，Baseline 可用但 iOS 要装 PWA；一次性 Background Sync 在设备恢复网络时触发 sync 事件，用来补发离线期间攒下的请求，但仅 Chromium 支持；Periodic Sync 周期性触发 periodicsync 做定期预取，限制最严——仅 Chromium、仅已安装 PWA，还受站点参与度门槛，冷门站点根本不触发。

[click:2] 共同心法两条：都要用 waitUntil 保活，sync 失败会重试、lastChance 为 true 是最后一次；都是尽力而为，触发时机由浏览器裁量，别当准时定时器，Firefox 和 Safari 不支持 sync 时必须降级成"页面在线就立即发"。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# Web App Manifest：PWA 的身份证

::left::

```json {2-3|4-5|6-10|all}
{
  "name": "IllegalCreed 技术笔记",
  "short_name": "笔记",
  "start_url": "/?source=pwa",
  "display": "standalone",
  "theme_color": "#1e293b",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192" },
    { "src": "/icon-512.png", "sizes": "512x512" }
  ]
}
```

<div v-click class="mini-note mt-2">用 <code>&lt;link rel="manifest"&gt;</code> 挂进 <code>&lt;head&gt;</code>，MIME <code>application/manifest+json</code>。</div>

::right::

<table class="decision-table">
  <thead><tr><th>字段</th><th>作用</th></tr></thead>
  <tbody>
    <tr v-click><td><code>name</code>/<code>short_name</code></td><td>全名 / 主屏短名</td></tr>
    <tr v-click><td><code>icons</code></td><td><strong>安装需 192 与 512</strong>；<code>purpose:maskable</code> 自适应</td></tr>
    <tr v-click><td><code>start_url</code></td><td>从图标启动加载的 URL</td></tr>
    <tr v-click><td><code>display</code></td><td>外壳模式（下页详解）</td></tr>
    <tr v-click><td><code>theme_color</code></td><td>地址栏 / 任务切换器配色</td></tr>
  </tbody>
</table>

<!--
Manifest 是一个 JSON 文件，回答浏览器四个问题：这个网站作为应用叫什么、什么图标、从哪启动、以什么外观显示。用一个 link 标签挂进 head，MIME 是 application slash manifest+json。

[click:3] 左边示例覆盖核心字段：name 和 short_name 是全名与主屏短名；start_url 是启动地址，可带来源参数做埋点；display standalone 是独立窗口；icons 至少要一个 192 和一个 512，否则不判定为可安装，purpose maskable 提供适配各平台形状的自适应图标。

右边字段表逐条对应。这些是把网站变成可安装 PWA 的最小字段集，theme_color 影响地址栏和任务切换器配色。
-->

---
layout: default
---

# display 显示模式与安装条件

<div class="grid grid-cols-[1.05fr_.95fr] gap-6 mt-4 items-start">

<table class="decision-table">
  <thead><tr><th><code>display</code></th><th>外观</th></tr></thead>
  <tbody>
    <tr v-click><td><code>standalone</code></td><td>独立应用窗口，无地址栏——最像原生（最常用）</td></tr>
    <tr v-click><td><code>fullscreen</code></td><td>全屏，游戏 / 沉浸式媒体</td></tr>
    <tr v-click><td><code>minimal-ui</code></td><td>独立窗口保留最小导航控件</td></tr>
    <tr v-click><td><code>browser</code></td><td>普通标签页——等于"不作为应用"</td></tr>
  </tbody>
</table>

<div class="rule-stack">
  <div v-click class="rule tone-green"><strong>安装条件（Chromium）</strong><span>HTTPS + 合规 manifest：有 <code>name</code>、<code>icons</code> 含 192 与 512、<code>start_url</code>、<code>display</code> 非 <code>browser</code>、<code>prefer_related_applications</code> 非 true</span></div>
  <div v-click class="rule tone-amber"><strong><code>display_override</code></strong><span>有序回退链，优先于 <code>display</code>；可启用 <code>window-controls-overlay</code> 等新模式</span></div>
</div>

</div>

<!--
display 决定 PWA 启动后的外壳长什么样。

[click:4] standalone 是独立应用窗口、没有地址栏，最像原生，绝大多数 PWA 用它；fullscreen 全屏，适合游戏和沉浸式媒体；minimal-ui 保留刷新前进后退等最小导航控件；browser 就是普通标签页，等于不作为应用运行、也不会弹安装。

[click:2] 右边是 Chromium 的安装条件：整站 HTTPS，加一个合规 manifest——有 name 或 short_name、icons 含 192 与 512、有 start_url、display 不是 browser、prefer_related_applications 不为 true。display_override 是更细的控制，给一个有序数组，浏览器挑第一个认识的模式，还能启用 window-controls-overlay 这类枚举里没有的桌面新模式。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# beforeinstallprompt：自定义安装体验

::left::

```js {1|3-7|9-13|15|all}
let deferred = null;

// 满足安装条件时 Chromium 在 window 触发
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();  // 拦掉默认安装小横幅
  deferred = e;        // 存事件，等用户点自定义按钮
  installBtn.hidden = false;
});

installBtn.addEventListener("click", async () => {
  deferred.prompt();   // 一个事件只能调一次
  const { outcome } = await deferred.userChoice;
  deferred = null;     // 用过即废，置空
});

window.addEventListener("appinstalled", () => (deferred = null));
```

::right::

<div class="rule-stack">
  <div v-click class="rule tone-red"><strong>Chromium 私有事件</strong><span>Firefox / Safari 完全不支持——必须能力探测</span></div>
  <div v-click class="rule tone-blue"><strong>preventDefault + 存事件</strong><span>不拦就是浏览器默认 UI；拦下才能延后到你的时机</span></div>
  <div v-click class="rule tone-amber"><strong><code>prompt()</code> 一次性</strong><span>调用一次即失效；<code>userChoice</code> 得 <code>accepted</code>/<code>dismissed</code></span></div>
  <div v-click class="rule tone-green"><strong><code>appinstalled</code></strong><span>安装成功后在 <code>window</code> 触发——埋点、隐藏入口</span></div>
</div>

<!--
默认满足安装条件后 Chromium 会自己弹一个不起眼的安装提示。想自己掌控何时、以什么样式引导安装，就拦截 beforeinstallprompt。

[click:4] 四个必须记住的点：它是 Chromium 私有事件，Firefox 和 Safari 完全不支持，做自定义安装 UI 一定要能力探测；preventDefault 加存事件，不拦就是浏览器默认 UI，拦下来存事件才能延后到你想要的时机 prompt；prompt 一次性，一个事件对象调用一次后失效，userChoice 拿到 accepted 或 dismissed；安装成功后 window 触发 appinstalled，用于埋点和隐藏安装入口。
-->

---
layout: default
---

# SW 已非安装硬条件 + iOS 差异

<div class="signal signal-good mt-4">
  <carbon:checkmark-outline />
  <span><strong>较新 Chromium 已放宽</strong>：SW / <code>fetch</code> 处理器不再是"能弹安装"的强制项，仅凭 HTTPS + 合规 manifest 即可触发安装</span>
</div>

<div class="signal signal-bad mt-3">
  <carbon:warning-alt />
  <span>但"能装" ≠ "能离线"：<strong>没 SW 的 PWA 装完断网就白屏</strong>——可安装门槛放宽了，离线仍应配 SW</span>
</div>

<div class="grid grid-cols-3 gap-4 mt-6">
  <div v-click class="fact"><strong>iOS 无 <code>beforeinstallprompt</code></strong><span>无法用 JS 触发安装；引导用户分享菜单"添加到主屏幕"</span></div>
  <div v-click class="fact"><strong>iOS 只认部分字段</strong><span>补 <code>apple-touch-icon</code> + <code>apple-mobile-web-app-*</code> 系列 meta</span></div>
  <div v-click class="fact"><strong>iOS 16.4+ 放开</strong><span>Safari/Chrome/Edge/Firefox 都能从分享菜单装 PWA</span></div>
</div>

<!--
一个容易过时的点：历史上 Chromium 要求注册一个带 fetch 处理器的 Service Worker 才算可安装，这曾是硬门槛。

[click] 较新的 Chromium 已放宽——SW 和 fetch 处理器不再是能弹安装的强制条件，仅凭 HTTPS 加合规 manifest 就能触发安装。
[click] 但请注意：能装不等于能离线，没有 SW 的 PWA 装完断网就白屏，体验残缺。所以"能装"和"该配 SW"是两件事，门槛放宽了但离线仍要配 SW。

[click:3] iOS 是另一套逻辑：没有 beforeinstallprompt，无法用 JS 触发安装，只能引导用户走分享菜单添加到主屏幕；只认部分 manifest 字段，很多能力要靠 apple-touch-icon 和 apple 系 meta 补；版本线上，iOS 16.4 起 Safari、Chrome、Edge、Firefox 都能从分享菜单安装。
-->

---
layout: default
---

# 易错点 TOP：改了没生效先查这里

<div class="grid grid-cols-2 gap-4 mt-5">
  <div v-click class="fact"><strong>改了 <code>sw.js</code> 刷新没生效</strong><span>新 SW 在 waiting，普通刷新不换版——关所有标签重开 / <code>skipWaiting</code> / DevTools「Update on reload」</span></div>
  <div v-click class="fact"><strong><code>skipWaiting</code> 但页面还是旧的</strong><span>它只激活新 SW，接管现页要 <code>clients.claim()</code>——两者配对</span></div>
  <div v-click class="fact"><strong>只改资源没改 <code>sw.js</code></strong><span>字节没变不更新——版本号 / 清单写进 <code>sw.js</code></span></div>
  <div v-click class="fact"><strong>拦了 <code>POST</code> / 靠 <code>onLine</code> 判离线</strong><span>Cache API 只认 GET；离线兜底靠 <code>fetch</code> 的 <code>catch</code></span></div>
  <div v-click class="fact"><strong>推送用 <code>new Notification()</code></strong><span>SW 里没有——用 <code>registration.showNotification()</code>；先要权限</span></div>
  <div v-click class="fact"><strong>在 Firefox/Safari 等 <code>beforeinstallprompt</code></strong><span>永远等不到——能力探测，iOS 走"添加到主屏幕"</span></div>
</div>

<!--
把全片的坑浓缩成六条，按排查频率排序。

[click:6] 改了 sw.js 刷新没生效，是新 SW 在 waiting、普通刷新不换版，开发时用 DevTools 的 Update on reload；skipWaiting 只激活新 SW，接管现页要 clients.claim，两者配对；只改资源没改 sw.js 字节没变不更新，把版本号写进 sw.js；fetch 里别拦 POST，Cache API 只认 GET，判离线别靠 navigator.onLine 要靠 fetch 的 catch；SW 里没有 new Notification，用 registration.showNotification，而且先要通知权限；最后别在 Firefox 和 Safari 上等 beforeinstallprompt，那是 Chromium 私有事件，iOS 要引导用户添加到主屏幕。

一条总纲：除离线缓存这一核心外，Push、Sync、安装体验都要能力探测加降级。
-->

---
layout: center
class: summary-slide
---

# 带走四个判断

<div class="summary-grid mt-8">
  <div><span>01</span><strong>SW 是可编程网络代理</strong><small><code>fetch</code> + <code>respondWith</code> 是全部魔力；HTTPS + 同源 + scope 是前提</small></div>
  <div><span>02</span><strong>生命周期是更新的闸门</strong><small>默认进 waiting、等标签全关；<code>skipWaiting</code> + <code>clients.claim</code> 才快</small></div>
  <div><span>03</span><strong>离线是核心，周边要降级</strong><small>Push/Sync/安装碎片化——全程特性探测 + 降级</small></div>
  <div><span>04</span><strong>PWA = SW + Manifest + HTTPS</strong><small>缺一不可；"能装" ≠ "能离线"，离线仍靠 SW</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers" target="_blank"><carbon:book /> MDN 使用指南</a>
  <a href="https://web.dev/learn/pwa/" target="_blank"><carbon:rocket /> web.dev Learn PWA</a>
  <a href="https://github.com/w3c/ServiceWorker" target="_blank"><carbon:logo-github /> w3c/ServiceWorker</a>
</div>

<!--
四句话复盘：SW 是坐在页面与网络之间的可编程代理，fetch 加 respondWith 是全部魔力，HTTPS、同源、scope 是注册前提；生命周期是更新的闸门，新 SW 默认进 waiting 等所有标签关闭，要快就 skipWaiting 加 clients.claim；离线缓存是可依赖的核心，Push、Sync、安装这些周边能力跨浏览器碎片化，全程特性探测加降级；PWA 是 SW、Manifest、HTTPS 三件套，缺一不可，能装不等于能离线，离线仍靠 SW。

缓存策略与 Cache API 的用法在浏览器章，配合本片的机制一起用，就能落地一个可安装、能离线、能推送的 PWA。规范原文与 MDN 使用指南值得通读。
-->
