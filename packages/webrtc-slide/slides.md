---
theme: seriph
layout: cover
title: WebRTC API
info: |
  浏览器原生实时通信：媒体捕获、RTCPeerConnection 编排、完美协商、数据通道、统计调试与 Encoded Transform。

  Learn more at [MDN WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark cover-mark--rtc">RTC</div>

# WebRTC API

## 不经服务器中转：浏览器里的实时音视频与任意数据直连

<div class="cover-meta">
  <span>W3C Recommendation · 2021-01</span>
  <span>捕获 · 连接 · 数据通道</span>
  <span>核心 API 全绿多年</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API" target="_blank" class="slidev-icon-btn" aria-label="MDN WebRTC API">
    <carbon:document />
  </a>
  <a href="https://github.com/w3c/webrtc-pc" target="_blank" class="slidev-icon-btn" aria-label="w3c/webrtc-pc GitHub">
    <carbon:logo-github />
  </a>
</div>

<!--
这一讲只讲浏览器 API 的编排：摄像头怎么变成流、两端怎么谈判、数据怎么直传、跑起来怎么观测。ICE、STUN、TURN、SDP 这些协议原理在网络章已经讲过，这里只看它们在 API 上的投影。

口径基于 WebRTC 1.0——2021 年 1 月定稿的 W3C Recommendation，核于 2026-07。核心三大件全绿多年，「能不能用」不是问题；真正的功课在「怎么把编排写对」，这正是后面每一页的主题。
-->

---
layout: default
---

# 换一个维度：从「必经服务器」到「端点直连」

<div class="net-modes mt-7">
  <div class="net-mode tone-blue">
    <strong>客户端 ↔ 服务器</strong>
    <span>fetch · SSE · WebSocket——请求、推送、双工，数据都必须经过你的服务器</span>
  </div>
  <div v-click class="net-mode tone-green">
    <strong>端点 ↔ 端点</strong>
    <span>WebRTC——NAT 穿透后两个浏览器直接互发媒体与数据，服务器只在「牵线」阶段出场</span>
  </div>
</div>

<div class="grid grid-cols-3 gap-4 mt-8">
  <div v-click class="fact"><strong>信令自备</strong><span>标准刻意不规定 offer/answer 怎么送达——自建通道转发，工程上几乎都用 WebSocket</span></div>
  <div v-click class="fact"><strong>默认强制加密</strong><span>媒体走 SRTP、数据走 DTLS/SCTP——规范层面没有「明文模式」可选</span></div>
  <div v-click class="fact"><strong>协议原理另有去处</strong><span>ICE / STUN / TURN / SDP 与 NAT 穿透见网络章——本讲只讲 API 编排</span></div>
</div>

<div v-click class="takeaway mt-6">W3C Recommendation（2021-01）、核心 API 全绿多年——「能不能用」早已不是问题，功课在「怎么把编排写对」。</div>

<!--
在 WebRTC 之前，浏览器的网络能力全是客户端对服务器：fetch 请求响应、SSE 单向推、WebSocket 双工，数据都要过你的服务器。

[click] WebRTC 打开另一个维度：端点对端点。穿透完成后媒体和数据直连，延迟压到最低，服务器带宽成本几乎归零。

[click] 三个边界先立住：信令通道标准刻意不管，得自己搭；

[click] 加密不是可选项，SRTP 和 DTLS 是内建属性；

[click] 协议层的水下部分本站网络章已完整产出，这一讲全部只看 API 投影。

[click] 支持现状一句话：2021 年就是 W3C Recommendation 了，连 adapter.js 这个历史 shim 都基本退休——难点全在编排。
-->

---
layout: default
---

# 三大件：捕获、连接、通道，正交拼装

<div class="grid grid-cols-3 gap-4 mt-6">
  <div v-click class="type-cell tone-blue"><code>getUserMedia()</code><span>媒体捕获：摄像头 / 麦克风 / 屏幕（<code>getDisplayMedia</code>）产出 <code>MediaStream</code>——归 Media Capture 规范</span></div>
  <div v-click class="type-cell tone-green"><code>RTCPeerConnection</code><span>点对点连接：offer/answer 协商、ICE 打通、加密、收发的全生命周期——WebRTC 1.0 主角</span></div>
  <div v-click class="type-cell tone-amber"><code>RTCDataChannel</code><span>数据通道：同一条 P2P 通路上传任意数据，可靠性语义从 TCP 风格到 UDP 风格连续可调</span></div>
</div>

<div v-click class="oa-span oa-span--ok mt-5">音视频与数据通道复用同一条打通的 ICE 通路——一次穿透，全家受益</div>

<div class="grid grid-cols-2 gap-4 mt-5">
  <div v-click class="fact"><strong>三块正交</strong><span>只传数据可以不碰摄像头；媒体捕获也常单独服务拍照、录屏等本地场景</span></div>
  <div v-click class="fact"><strong>增量仍在落地</strong><span>Encoded Transform 2025 达成 Baseline；<code>setCodecPreferences</code> 自 Firefox 128 补齐后全绿</span></div>
</div>

<!--
MDN 官方就是按这三块拼图组织 WebRTC 的。

[click] 媒体捕获把摄像头、麦克风、屏幕变成可编程的媒体流，规范归属 Media Capture and Streams 和 Screen Capture；

[click] RTCPeerConnection 是连接的化身，协商、打洞、加密、收发全在它身上；

[click] 数据通道在同一条 P2P 通路上传任意数据，可靠性语义可调。

[click] 关键的架构红利：三者复用同一条 ICE 通路，穿透只做一次。

[click] 而且三块正交——文件直传、联机对战只用后两块，完全不碰摄像头。

[click] 标准也没停：Encoded Transform 和 setCodecPreferences 是近两年补齐的增量，后面都有专页。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# getUserMedia：裸值是愿望，`exact` 是门槛

::left::

```js {1-7|9|11-14|all}
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true, // 布尔：要这类轨道，参数交给浏览器
  video: {
    width: { ideal: 1280 }, // 裸值等价 ideal：尽力靠近，不满足不失败
    facingMode: "user", // 移动端：user 前置 / environment 后置
  },
});

videoEl.srcObject = stream; // 接 video 元素用 srcObject，不是 src

// 硬性要求：无解直接 OverconstrainedError（err.constraint 指认）
await navigator.mediaDevices.getUserMedia({
  video: { facingMode: { exact: "environment" } },
});
```

::right::

<table class="decision-table">
  <thead><tr><th>写法</th><th>失败行为</th></tr></thead>
  <tbody>
    <tr><td>裸值 / <code>ideal</code></td><td>不失败——按 fitness distance 择优</td></tr>
    <tr v-click><td><code>min</code> / <code>max</code> / <code>exact</code></td><td>无解抛 <code>OverconstrainedError</code></td></tr>
  </tbody>
</table>

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>硬约束失败发生在<strong>弹权限框之前</strong>——可当设备指纹探测面，公开页面慎用。</span>
</div>

<div v-click class="mini-note mt-4"><code>MediaStream</code> 只是轨道容器，<code>MediaStreamTrack</code> 才是实体；结束必须逐轨 <code>track.stop()</code> 释放设备——只置空 <code>srcObject</code>，指示灯还亮着。</div>

<!--
入口是 navigator.mediaDevices，只在安全上下文存在——HTTP 页面上它是 undefined，这是「本地正常、HTTP 测试机全挂」的标准答案。约束系统的核心是强度语义：裸值和 ideal 是愿望，浏览器综合所有 ideal 算 fitness distance，挑最接近的设备加配置。

[click:2] 拿到流接 video 元素，用 srcObject 不是 src。

[click] exact 和 min、max 是硬门槛，无解直接 OverconstrainedError，err.constraint 会指认是哪条约束。

[click:2] 更隐蔽的是：这个失败发生在权限框弹出之前——规范点名的指纹面，日常用 ideal，确有硬要求才 exact。

[click] 媒体模型一句话：流是容器、轨道是实体。挂断必须逐轨 stop，置空 srcObject 不释放设备。
-->

---
layout: default
---

# 异常分诊：按 `err.name` 走，别一把 catch 到黑

<table class="decision-table mt-4">
  <thead><tr><th><code>err.name</code></th><th>什么时候发生</th><th>该怎么办</th></tr></thead>
  <tbody>
    <tr><td><code>NotAllowedError</code></td><td>用户拒绝 / 之前拒过 / 策略禁止</td><td>展示重开权限引导，别死循环重试</td></tr>
    <tr v-click><td><code>NotFoundError</code></td><td>没有满足要求的设备</td><td>提示接入设备 / 放宽约束</td></tr>
    <tr v-click><td><code>NotReadableError</code></td><td>系统层拿不到——常见设备被占用</td><td>提示关闭占用的应用</td></tr>
    <tr v-click><td><code>OverconstrainedError</code></td><td>约束无解，<code>err.constraint</code> 指认</td><td>降级为 ideal 重试</td></tr>
    <tr v-click><td><code>TypeError</code></td><td>约束全空，或 HTTP 页调用</td><td>修约束 / 上 HTTPS</td></tr>
  </tbody>
</table>

<div class="grid grid-cols-3 gap-4 mt-6">
  <div v-click class="fact"><strong>安全上下文硬门槛</strong><span>HTTP 页面 <code>navigator.mediaDevices</code> 是 <code>undefined</code>——先查协议再查代码</span></div>
  <div v-click class="fact"><strong>iframe 二道门</strong><span>宿主页需 <code>allow="camera; microphone"</code>（Permissions Policy）放行</span></div>
  <div v-click class="fact"><strong>先授权再枚举</strong><span>未授权时 <code>enumerateDevices()</code> 的 <code>label</code> 全空串——顺序反了列表没法看</span></div>
</div>

<!--
规范对隐私是硬要求：每次采集要授权、使用中必须有指示灯。开发者这边的功课是把失败逐个接住，按 err.name 分诊。

[click] NotFoundError 是真没有这类设备；

[click] NotReadableError 是授权了但系统层拿不到，最常见的是设备被其他会议软件占用；

[click] OverconstrainedError 上一页讲过，约束无解，降级为 ideal 重试；

[click] TypeError 两种来源：约束全空，或者不安全上下文。

[click] 三个环境坑补齐：HTTP 页 mediaDevices 直接不存在；

[click] iframe 里还有第二道门，宿主页要用 Permissions Policy 显式放行；

[click] 设备下拉框要先拿一次权限再枚举，否则 label 全是空字符串。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# getDisplayMedia：三条铁律都是「API 做不到」

::left::

<div class="rule-stack">
  <div class="rule tone-red"><strong>不可预选共享源</strong><span>你传的选项不能缩小用户的可选范围，只在用户选定后套用——「只让选某窗口」这种需求 API 层面不存在</span></div>
  <div v-click class="rule tone-amber"><strong>权限不可持久化</strong><span>每次调用都弹选择框，没有「记住我的选择」</span></div>
  <div v-click class="rule tone-blue"><strong>需瞬时用户激活</strong><span>必须在点击等手势的事件处理器里调用，否则 <code>InvalidStateError</code></span></div>
</div>

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>约束里禁用 <code>min</code> / <code>exact</code>——给了就 <code>TypeError</code>；<code>video: false</code> 同样 <code>TypeError</code>。</span>
</div>

::right::

```js {1-5|7-8|10-12|all}
const screen = await navigator.mediaDevices.getDisplayMedia({
  video: { displaySurface: "window" }, // 只是偏好提示
  selfBrowserSurface: "exclude", // 防「镜中镜」
  surfaceSwitching: "include", // 共享中允许换标签页
});

// 用户点的是浏览器的「停止共享」条——ended 才是收尾正门
screen.getVideoTracks()[0].addEventListener("ended", restoreUI);

// 接进通话：replaceTrack 换轨不重协商
const sender = pc.getSenders().find((s) => s.track?.kind === "video");
await sender.replaceTrack(screen.getVideoTracks()[0]);
```

<!--
屏幕上什么都可能有，所以 getDisplayMedia 的威胁模型和 getUserMedia 完全不同，规范写死了三条安全设计。第一条最常被当成 bug 反复搜索：不可预选源，选项只在用户选定之后套用。

[click] 第二条：权限没有持久化，每次都弹框。

[click] 第三条：必须在用户手势里调用。这三条都是「API 做不到」，不是「你没找到参数」。

[click] 约束规则也更严：min 和 exact 直接 TypeError——不可预选源的前提下，硬约束无从谈起。

[click] 右边代码三段：选项都是偏好提示；

[click] 用户常点浏览器自带的停止共享条，不会经过你的按钮，监听视频轨的 ended 事件收尾；

[click] 把屏幕接进已有通话，用 replaceTrack 热替换，不触发重协商——这也是下一批页面会反复出现的技巧。
-->

---
layout: default
---

# offer/answer 编排：四个调用，两次投递

<div class="oa-seq mt-4">
  <div class="oa-head"><div>端 A · 呼叫方</div><div>信令（自备 · 只转发）</div><div>端 B · 应答方</div></div>
  <div class="oa-row">
    <div class="oa-act oa-act--a">addTrack() → createOffer() → setLocalDescription()</div>
    <div class="oa-wire">── offer ──►</div>
    <div v-click class="oa-act oa-act--b">setRemoteDescription(offer)</div>
  </div>
  <div v-click class="oa-row">
    <div></div>
    <div></div>
    <div class="oa-act oa-act--b">addTrack() → createAnswer() → setLocalDescription()</div>
  </div>
  <div v-click class="oa-row">
    <div class="oa-act oa-act--a">setRemoteDescription(answer)</div>
    <div class="oa-wire">◄── answer ──</div>
    <div></div>
  </div>
  <div v-click class="oa-span">双方 <code>icecandidate</code> 逐个冒候选，经信令互递给对端 <code>addIceCandidate()</code>——Trickle ICE：边收集边发，不等收齐</div>
  <div v-click class="oa-span oa-span--ok">ICE 打通：媒体与数据 P2P 直连，不再经过服务器——媒体等 <code>track</code> 事件、通道等 <code>open</code> 事件</div>
</div>

<div v-click class="takeaway mt-5"><code>create*</code> 只是生成，<code>setLocalDescription()</code> 才落位并启动候选收集——四个调用两两成对，每端各存本地 / 远端两份描述。</div>

<!--
这是全讲的编排轴线，后面每一页都在给它的某一段加细节。呼叫方放轨、生成 offer、落位本地描述，经信令送出。

[click] 应答方先把对方的提案记下来；

[click] 再放自己的媒体、生成 answer 并落位；

[click] answer 回到呼叫方落位远端描述，谈判完成。

[click] 与此同时候选在异步流动：setLocalDescription 一落位 ICE 层就开始收集，每发现一个就冒一次事件，边收集边发，这叫 Trickle ICE，显著缩短建连时间。

[click] 「谈妥了」不等于「路通了」：真正可用要看 track 事件和 open 事件。

[click] 最容易忘的事实：createOffer 只是生成描述，不 setLocalDescription 就永远不会开始收集候选。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# Trickle ICE：候选边收集边发，认清两种哨兵

::left::

```js {1-4|6-7|all}
// 本端候选 → 信令 → 对端（setLocalDescription 后才开始冒）
pc.onicecandidate = ({ candidate }) => {
  if (candidate) signaling.send({ candidate });
};

// 对端候选 → 本地 ICE 层（必须已 setRemoteDescription）
await pc.addIceCandidate(candidate);
```

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>信令乱序时候选可能先于 offer 到达——直接丢弃就漏了：先缓存，<code>setRemoteDescription</code> 之后再喂。</span>
</div>

::right::

<div class="rule-stack">
  <div v-click class="rule tone-green"><strong>空字符串 = 本代收集完</strong><span><code>candidate.candidate === ""</code> 是 end-of-candidates 通知——<strong>照常转发</strong>并 <code>addIceCandidate()</code>，让对端别再等</span></div>
  <div v-click class="rule tone-amber"><strong>null = 终止哨兵</strong><span>事件里 <code>candidate === null</code> 表示全部结束（等价 <code>iceGatheringState</code> 变 <code>complete</code>）——不用发</span></div>
  <div v-click class="rule tone-blue"><strong><code>icecandidateerror</code> ≠ 失败</strong><span>单个 STUN/TURN 服务器报错当诊断日志——其他候选可能已经把路打通了</span></div>
</div>

<!--
候选交换的代码只有几行，坑全在边界情况。外发很简单：icecandidate 事件冒一个发一个；进来的候选喂给 addIceCandidate。

[click:2] 第一个坑是时序：信令没有顺序保证，候选可能比 offer 先到。丢弃就永远缺了这批路径——先缓存，等 setRemoteDescription 之后再喂。

[click] 第二个坑是两种哨兵长得像：candidate 属性为空字符串，是「本代收集完毕」的通知，要照常转发给对端；

[click] 事件参数整个为 null 才是终止哨兵，纯本地信号，不用发。把空字符串误当 null 过滤掉，对端 ICE 层会多等一段超时。

[click] 第三个：icecandidateerror 只说明某台 STUN 或 TURN 服务器不可达，不代表连接失败——当诊断日志用。
-->

---
layout: default
---

# 三个状态机并行：日常只看 `connectionState`

<table class="decision-table mt-3">
  <thead><tr><th>状态机</th><th>回答什么</th></tr></thead>
  <tbody>
    <tr><td><code>signalingState</code></td><td>协商对话走到哪步——完美协商样板内部用</td></tr>
    <tr v-click><td><code>iceConnectionState</code></td><td>ICE 通路通没通——<code>disconnected</code> / <code>failed</code> 的首发地</td></tr>
    <tr v-click><td><code>connectionState</code></td><td>ICE + DTLS 聚合总态——<strong>日常监控只看它</strong></td></tr>
  </tbody>
</table>

<div v-click class="cs-line mt-5">
  <div class="state-node">new</div>
  <carbon:arrow-right />
  <div class="state-node active">connecting</div>
  <carbon:arrow-right />
  <div class="state-node success">connected —— 用户能听到对方</div>
</div>

<div class="grid grid-cols-3 gap-3 mt-4">
  <div v-click class="rule tone-amber"><strong>disconnected</strong><span>瞬断（WiFi 切 4G）——规范允许自愈回 <code>connected</code>，先等，别急着重建</span></div>
  <div v-click class="rule tone-red"><strong>failed</strong><span>确认无路可走——<code>restartIce()</code> 重跑一轮 ICE，媒体管线与编解码保留</span></div>
  <div v-click class="rule" style="background: #f8fafc; border-color: #cbd5e1"><strong>closed</strong><span><code>close()</code> 后的终态——实例不可复用，重连 = 新建</span></div>
</div>

<!--
连接推进时三个状态属性并行变化，各答各的问题。signalingState 管协商步点，业务层少碰；

[click] iceConnectionState 管 ICE 通路；

[click] connectionState 聚合了 ICE 加 DTLS 全部传输，是「用户能不能听到对方」的最诚实答案——日常监控只挂它。

[click] 顺利时三步走到 connected。

[click] 工程分寸全在两个异常态的区别：disconnected 是「可能是暂时的」，丢了几个心跳，规范明确允许它自己回到 connected——贸然重建反而把能自愈的连接杀死。

[click] failed 才是「试过了，不行」，标准动作是 restartIce：带新 ufrag 重新收集候选、走一轮重协商，媒体管线和已协商的编解码都保留，不必推倒连接。

[click] closed 是终态，重连必须新建实例。
-->

---
layout: default
class: lab-slide
---

# 交互实验：本地回环，两个 RTCPeerConnection 互连

<LoopbackLab />

<!--
现场跑真实 API：同一个页面里建两个 RTCPeerConnection，信令退化成内存直传——offer/answer 直接互 set，候选互喂 addIceCandidate，一行服务器代码都不需要。

点「建立连接」，盯两侧徽标：connectionState 从 new 到 connecting 再到 connected，iceConnectionState 走 checking 到 connected，数据通道 readyState 到 open——三个状态机并行推进，上一页的表格活了。

通道开了之后双向发消息：A 发 ping，B 原样带回时间戳回 pong，A 算出往返时延——同机回环通常零点几毫秒，这就是「不过服务器」的直观感受。B 到 A 的反方向照样能发，datachannel 事件接住的通道和创建端功能完全对等。

最后点 close：徽标全变 closed，这是终态——再点建立连接，走的是全新实例，呼应上一页「重连等于新建」。真实两台设备之间，把标注「信令」的两行换成 WebSocket 转发，其余代码原样可用。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# glare：双方同时出价，朴素编排双双卡死

::left::

<div class="oa-seq">
  <div class="oa-head"><div>端 A</div><div></div><div>端 B</div></div>
  <div class="oa-row">
    <div class="oa-act oa-act--a">setLocalDescription(offerA)</div>
    <div class="oa-wire">offerA ─►<br>◄─ offerB</div>
    <div class="oa-act oa-act--b">setLocalDescription(offerB)</div>
  </div>
  <div v-click class="oa-span oa-span--bad">两端同处 <code>have-local-offer</code>，又各自收到对方的 offer——旧实现直接抛状态错误；都放弃重来，又可能再次同时出价、无限互撞</div>
</div>

<div v-click class="takeaway mt-4">手写「谁赢谁让」竞态防不胜防——<code>signalingState</code> 异步变化，判断的瞬间可能已经过期。</div>

::right::

<div class="rule-stack">
  <div v-click class="rule tone-green"><strong>polite peer</strong><span>碰撞时<strong>让步</strong>：靠 rollback 放弃自己的提案，转而应答对方</span></div>
  <div v-click class="rule tone-red"><strong>impolite peer</strong><span>碰撞时<strong>无视</strong>对方的 offer，绝不让步——反正对方会让</span></div>
  <div v-click class="rule tone-blue"><strong>角色怎么定</strong><span>信令层约定（先进房间 polite / 随机数比大小），与谁发起呼叫无关——两端必须一真一假</span></div>
</div>

<!--
上一批页面的编排有个隐含假设：同一时刻只有一端想协商。现实里很容易破功——双方同时点开视频、网络恢复后两端同时 restartIce，于是两端同时进入 have-local-offer，又同时收到对方的 offer。

[click] 这就是 glare，协商碰撞：旧实现直接抛状态错误；两端都放弃重来，又可能再撞，无限循环。

[click] 想手写补丁的都翻车在同一处：signalingState 的变化是异步的，你判断它的瞬间可能已经过期。

[click] MDN 官方的解法是给两端各分配一个协商人格：polite 端碰撞时让步，放弃自己的提案转而应答；

[click] impolite 端碰撞时无视对方的 offer——一让一不让，碰撞有了确定性解法。

[click] 角色分配随意但必须恰好一端一种，信令层约定即可。还有个重要推论：polite 让步后就从 caller 变成了 callee——业务代码不该假设自己固定是哪一方。
-->

---
layout: default
---

# Perfect negotiation：两端跑同一套代码

<div class="grid grid-cols-[1.3fr_.7fr] gap-7 mt-4 items-start">

````md magic-move {at:1}
```js
// 朴素出价：谁触发谁出 offer
pc.onnegotiationneeded = async () => {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  signaler.send({ description: pc.localDescription });
};
// 双方同时触发 → 双双 have-local-offer → 卡死
```

```js
// 出价端样板：makingOffer 从「打算出价」就上锁
let makingOffer = false;

pc.onnegotiationneeded = async () => {
  try {
    makingOffer = true;
    await pc.setLocalDescription(); // 无参：自动 createOffer 并落位
    signaler.send({ description: pc.localDescription });
  } finally {
    makingOffer = false; // 出完（或失败）解锁
  }
};
```

```js
// 收件端样板：判碰撞 → impolite 无视 / polite 隐式回滚
const readyForOffer =
  !makingOffer &&
  (pc.signalingState === "stable" || isSettingRemoteAnswerPending);
const offerCollision = description.type === "offer" && !readyForOffer;
ignoreOffer = !polite && offerCollision;
if (ignoreOffer) return; // 连带吞掉其配套候选的报错

await pc.setRemoteDescription(description); // polite 撞车：自动回滚己方 offer
if (description.type === "offer") {
  await pc.setLocalDescription(); // 无参：自动生成 answer
  signaler.send({ description: pc.localDescription });
}
```
````

<div class="rule-stack">
  <div class="rule tone-blue"><strong><code>makingOffer</code> 判碰撞</strong><span>布尔在 <code>setLocalDescription()</code> 之前就置位——把 <code>signalingState</code> 的异步窗口焊死</span></div>
  <div v-click class="rule tone-green"><strong>无参 <code>setLocalDescription()</code></strong><span>按当前状态自动产出 offer 或 answer——样板两处都靠它省掉分支</span></div>
  <div v-click class="rule tone-amber"><strong><code>ignoreOffer</code> 连带吞错</strong><span>无视了 offer，其配套候选的 <code>addIceCandidate</code> 报错属预期——静音处理</span></div>
</div>
</div>

<div v-click class="takeaway mt-4">只有 offer 能被回滚：polite 的让步 = <code>have-local-offer</code> 收 offer 时的<strong>隐式 rollback</strong>；显式写法 <code>setLocalDescription({ type: "rollback" })</code>。照抄样板，别「优化」。</div>

<!--
negotiationneeded 事件把「什么时候该发 offer」从业务代码剥离出来：加轨、建首条数据通道、restartIce 都会触发，且只在 stable 状态触发。朴素写法直接在里面 createOffer——碰撞没处理。

[click] 样板的出价端：makingOffer 在 setLocalDescription 之前就置位，从「打算出价」起就算数，把异步窗口期焊死；无参 setLocalDescription 自动生成并落位。

[click] 收件端是精髓：readyForOffer 综合三个条件判碰撞；impolite 端直接 return 无视；polite 端什么都不用写——规范保证 have-local-offer 状态下 setRemoteDescription 会自动先回滚己方提案。

[click:2] 右边三处精妙正是手写版本翻车的地方。尤其吞错误那条：无视了 offer，本地 ICE 层不知道这回事，对方随后送来的配套候选报错是预期内的，静音掉避免噪声。

[click] 回滚只对 offer 存在，answer 落位即 stable 无反悔。这套样板每个标志位的时机都是精确设计——照抄，别改。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# RTCDataChannel：WebSocket 手感，P2P 通路

::left::

### in-band：一端建，对端事件接（默认）

```js
const dc = pc.createDataChannel("chat");
dc.onopen = () => dc.send("通道就绪"); // 等 open 才能发

// 对端：datachannel 事件接住
pc.ondatachannel = ({ channel }) => {
  channel.onmessage = ({ data }) => render(data);
};
```

<div v-click class="mini-note mt-3">适合动态开通道；首条通道会触发 <code>negotiationneeded</code>（要搭 SCTP 传输）。</div>

::right::

### negotiated：双端同 `id` 各自建

```js
const dc = pc.createDataChannel("chat", {
  negotiated: true,
  id: 0, // 两端必须一致
});
// 没有 datachannel 事件——两端代码完全对称
```

<div v-click class="mini-note mt-3">通道拓扑写死在代码里，与完美协商「同一套代码」哲学最搭。</div>

<div v-click class="col-span-2 takeaway mt-5">底层是 SCTP over DTLS，复用同一条打通的 ICE 通路；<code>label</code> 只是人类可读名不要求唯一，每连接至多 <strong>65,534</strong> 条通道。</div>

<!--
数据通道把 WebSocket 般的收发体验搬到 P2P 通路上，API 刻意对齐：open 事件、send、message、close。创建有两种模式。

in-band 是默认：一端创建，WebRTC 层自动告知对端，对端靠 datachannel 事件接住——回环实验里就是这个模式。

[click] 注意首条通道会触发 negotiationneeded，因为要协商搭建 SCTP 传输。

[click] negotiated 模式两端各自创建，靠相同的 id 对上号，没有 datachannel 事件可等。

[click] 它让两端代码完全对称，和完美协商的哲学一脉相承；代价是拓扑要写死。

[click] 底层一句话：SCTP over DTLS，加密与穿透复用同一条 ICE 通路；id 取值区间决定了每连接最多六万五千余条通道，够用。
-->

---
layout: default
---

# 可靠性光谱：三个选项，两个典型档位

<table class="decision-table mt-3">
  <thead><tr><th>选项</th><th>默认</th><th>含义</th></tr></thead>
  <tbody>
    <tr><td><code>ordered</code></td><td><code>true</code></td><td>是否保证到达顺序</td></tr>
    <tr v-click><td><code>maxRetransmits</code></td><td><code>null</code></td><td>放弃前最多重传<strong>次数</strong>（次数计的部分可靠）</td></tr>
    <tr v-click><td><code>maxPacketLifeTime</code></td><td><code>null</code></td><td>放弃前最多重传<strong>毫秒数</strong>（时间计的部分可靠）</td></tr>
  </tbody>
</table>

<div class="grid grid-cols-2 gap-4 mt-4">

```js
// TCP 风格（默认）：可靠 + 有序
// —— 文件、聊天记录、控制指令
const fileDC = pc.createDataChannel("file");
```

```js
// UDP 风格：不保序 + 不重传——旧包到了也没用
const gameDC = pc.createDataChannel("game", {
  ordered: false,
  maxRetransmits: 0,
});
```

</div>

<div class="grid grid-cols-2 gap-4 mt-4">
  <div v-click class="fact"><strong>后两者互斥</strong><span><code>maxRetransmits</code> 与 <code>maxPacketLifeTime</code> 同时设置抛 <code>SyntaxError</code>——设其一即进入部分可靠模式</span></div>
  <div v-click class="fact"><strong><code>binaryType</code> 分水岭</strong><span>这边默认 <code>"arraybuffer"</code>，WebSocket 默认 <code>"blob"</code>——跨 API 复用收包代码先对表</span></div>
</div>

<!--
TCP 的可靠有序不是免费的：一个包丢了，后面全部等它重传，这叫队头阻塞，实时场景宁可丢也不等。数据通道把选择权交给你，三个创建选项。

[click] maxRetransmits 按次数放弃；

[click] maxPacketLifeTime 按时间放弃——设了任何一个就进入部分可靠模式。

两个典型档位：默认全缺省是 TCP 风格，适合文件和聊天；ordered false 加 maxRetransmits 零是 UDP 风格，适合游戏状态和实时坐标——旧包重传到了也没意义。

[click] 两个坑：互斥选项同时设直接 SyntaxError；

[click] binaryType 的默认值和 WebSocket 相反——这边 arraybuffer、那边 blob，两个 API 长得太像，这里是分水岭。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 背压：`send()` 只入队，水位要自己盯

::left::

```js {1-2|4-9|10-12|all}
const CHUNK = 16 * 1024; // 16 KiB：跨浏览器稳妥的块
dc.bufferedAmountLowThreshold = 1024 * 1024; // 低水位 1 MB

async function sendFile(file) {
  for (let off = 0; off < file.size; off += CHUNK) {
    if (dc.bufferedAmount > dc.bufferedAmountLowThreshold) {
      await new Promise((r) =>
        dc.addEventListener("bufferedamountlow", r, { once: true }),
      );
    } // 背压闸门：高于水位就等 bufferedamountlow
    const blob = file.slice(off, off + CHUNK);
    dc.send(await blob.arrayBuffer()); // send() 只入队，不阻塞
  }
}
```

::right::

<div class="rule-stack">
  <div v-click class="rule tone-amber"><strong>缓冲不可配置</strong><span>大小由浏览器管理，只能观测 <code>bufferedAmount</code>——塞得比消费快它就一路涨</span></div>
  <div v-click class="rule tone-red"><strong>消息大小是互操作边界</strong><span>SDP <code>max-message-size</code> 声明对端能收多大，<strong>缺席按 64 KB 估</strong>（<code>pc.sctp.maxMessageSize</code> 可读）</span></div>
  <div v-click class="rule tone-blue"><strong>大消息队头阻塞</strong><span>没有消息交错时，一条大消息会阻塞同连接其他通道——大数据一律分块 + 结束标记</span></div>
</div>

<!--
send 是纯入队：不阻塞、不节流，也不告诉你队列满了。文件直传这种大数据量场景必须自己写背压。

[click] 两个配置先立住：16 KiB 是跨浏览器稳妥的块大小；低水位阈值默认是零——缓冲彻底清空才触发，调高一点能让管道始终有货又不撑爆。

[click] 发送循环的闸门：bufferedAmount 高于水位就停下，等 bufferedamountlow 事件再续弹。

[click:2] 右边三个事实：缓冲区大小无法配置，只能观测；

[click] 消息大小是真实的互操作边界，SDP 声明缺席时按 64 KB 假定——别赌浏览器上限；

[click] 而且没有消息交错时一条大消息会队头阻塞同连接的其他通道。结论统一：大数据一律分块，配自定义结束标记。
-->

---
layout: default
---

# setCodecPreferences：三件已核实的事

<div class="mini-note mt-2"><code>addTrack()</code> 背后，每条媒体 m-line 对应一个 <code>RTCRtpTransceiver</code>（sender + receiver 配对）；<code>addTransceiver(kind, { direction })</code> 可显式声明 <code>sendrecv</code> / <code>sendonly</code> / <code>recvonly</code> / <code>inactive</code>。</div>

```js {1-2|3-6|all}
// 入参必须来自接收能力集（Chrome M124 起严格校验）
const { codecs } = RTCRtpReceiver.getCapabilities("video");
transceiver.setCodecPreferences([
  ...codecs.filter((c) => c.mimeType === "video/AV1"), // 想要的排前面
  ...codecs.filter((c) => c.mimeType !== "video/AV1"),
]);
```

<div class="grid grid-cols-3 gap-4 mt-5">
  <div v-click class="fact"><strong>① 全绿时间点</strong><span>Firefox 128（2024 年中）补齐后全浏览器可用</span></div>
  <div v-click class="fact"><strong>② 入参强校验</strong><span>codec 必须来自 <code>RTCRtpReceiver.getCapabilities()</code> 的能力集——混入自造对象会抛错</span></div>
  <div v-click class="fact"><strong>③ 不触发 <code>negotiationneeded</code></strong><span>偏好只影响<strong>下一次</strong>协商产出的 SDP——要生效需自己再发起一轮重协商</span></div>
</div>

<div v-click class="takeaway mt-5">同场对照：<code>replaceTrack()</code> 同样不触发重协商（换轨免谈判）；<code>addTrack()</code> / 首条 <code>createDataChannel()</code> / <code>restartIce()</code> 会触发。</div>

<!--
先补一块地基：addTrack 背后每条媒体线对应一个 transceiver，是 sender 和 receiver 的配对体。观众端只收不发，用 addTransceiver 显式声明 recvonly，省去先拿本地媒体的步骤。

编解码偏好就挂在 transceiver 上。写法固定：从 getCapabilities 拿能力集，把想要的排前面。

[click:3] 三件已核实的事，对应三种翻车：一，可用性——Firefox 128 补齐后全绿，老资料说的兼容性问题过时了；

[click] 二，Chrome M124 起严格校验入参，codec 对象必须来自能力集，自己拼的会抛错；

[click] 三，最反直觉：设置后不触发 negotiationneeded——偏好只影响下一次协商的 SDP，不自己发起重协商就永远不生效。

[click] 顺手记一张「谁触发重协商」的对照表，回环到 negotiationneeded 那一页的清单。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# getStats：累计值求差，才有实时指标

::left::

```js {1|5-6|8-12|14|all}
const last = new Map(); // id → 上一次快照（用 id 对齐，别用下标）
setInterval(async () => {
  const report = await pc.getStats();
  report.forEach((stat) => {
    if (stat.type !== "inbound-rtp" || stat.kind !== "video") return;
    const prev = last.get(stat.id);
    if (prev) {
      const dt = (stat.timestamp - prev.timestamp) / 1000; // 秒
      const kbps = ((stat.bytesReceived - prev.bytesReceived) * 8) / dt / 1e3;
      const dLost = stat.packetsLost - prev.packetsLost; // 区间丢包数
      show({ kbps, dLost, fps: stat.framesPerSecond }); // fps 是瞬时值
    }
    last.set(stat.id, stat);
  });
}, 1000);
```

::right::

<table class="decision-table">
  <thead><tr><th><code>type</code></th><th>要看什么</th></tr></thead>
  <tbody>
    <tr><td><code>inbound-rtp</code></td><td>收流质量：<code>packetsLost</code> / <code>jitter</code> / <code>framesPerSecond</code></td></tr>
    <tr v-click><td><code>outbound-rtp</code></td><td><code>qualityLimitationReason</code>：带宽还是 CPU 在压画质</td></tr>
    <tr v-click><td><code>remote-inbound-rtp</code></td><td>对端收我的回执：丢包 / <code>roundTripTime</code></td></tr>
    <tr v-click><td><code>transport</code></td><td><code>selectedCandidatePairId</code> → 当前线路（<code>relay</code> = 走 TURN）</td></tr>
  </tbody>
</table>

<div v-click class="mini-note mt-4">先用 <code>chrome://webrtc-internals</code> / <code>about:webrtc</code> 定位问题层，再把关键指标 <code>getStats()</code> 产品化上报。</div>

<!--
「视频卡不卡、为什么卡」不能靠猜。getStats 返回只读 Map-like 的报告，键是统计对象的 id。用它的第一铁律：绝大多数计数器是累计值，从连接建立起累加——单次快照没有意义，必须定时采样、与上次求差。

[click] 第二铁律：跨采样对齐同一对象要用 id，条目顺序没有保证。

[click] 求差的分母就是两次 timestamp 之差：字节差乘八除时长是码率，丢包差是区间丢包数；帧率是少数瞬时值，直接读。

[click:2] 右表是排障食谱：出站质量看 qualityLimitationReason，它会直说是带宽还是 CPU 在压画质；

[click] 我发的丢没丢要问对端——remote-inbound-rtp 是 RTCP 回执；

[click] 「流量走直连还是 TURN 中继」从 transport 的 selectedCandidatePairId 顺藤摸瓜，候选类型是 relay 就在烧中继带宽。

[click] 经验路径：先内置调试台定位问题层，再把指标产品化。
-->

---
layout: default
---

# Encoded Transform：在编码帧管线上做手脚

<div class="pipeline mt-6">
  <div class="pipeline-step tone-blue">
    <span class="step-no">发端</span>
    <strong>编码器出帧</strong>
    <span>采集 → 编码，应用原本碰不到</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-amber">
    <span class="step-no">切入点</span>
    <strong>你的 Transform（Worker）</strong>
    <span><code>TransformStream</code> 逐帧加工</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-green">
    <span class="step-no">出口</span>
    <strong>RTP 打包 → 网络</strong>
    <span>收端对称：解包 → Transform → 解码器</span>
  </div>
</div>

<div class="grid grid-cols-3 gap-4 mt-6">
  <div v-click class="fact"><strong>编码后的帧</strong><span><code>RTCEncodedVideoFrame</code> / <code>RTCEncodedAudioFrame</code>——不是原始像素，开销小</span></div>
  <div v-click class="fact"><strong>正门场景 E2EE</strong><span>发端加密、收端解密——中间的 SFU 转发服务器只见密文；另有水印、自定义帧头</span></div>
  <div v-click class="fact"><strong>Baseline 2025</strong><span>特性检测：<code>"transform" in RTCRtpSender.prototype</code></span></div>
</div>

<!--
常规管线里，帧从编码器出来直接进 RTP 打包发走，应用层碰不到。Encoded Transform 把这段管线切开，让你插入一段跑在 Worker 里的 TransformStream——注意必须在 Worker 里，这是 API 设计，不是建议。

[click] 处理的是编码后的帧对象，不是原始像素，所以开销小，也正好落在加密该在的位置。

[click] 正门场景是端到端加密：多方会议的媒体要经过 SFU 转发服务器，常规加密到服务器就终止了；发端变换里加密、收端变换里解密，SFU 只见密文。水印、自定义帧头元数据也走这条管线。

[click] 支持现状：2025 年达成 Baseline，全主流浏览器可用，上线前照常做一行特性检测。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 三步接线：主线程挂 transform，Worker 接管道

::left::

```js {1|3-7|9-13|all}
const worker = new Worker("transform-worker.js");

// 发送侧：addTrack 后立刻挂上，保证第一帧就被变换
const sender = pc.addTrack(track, stream);
sender.transform = new RTCRtpScriptTransform(worker, {
  name: "senderTransform",
});

// 接收侧：track 事件里挂 receiver，晚了就漏帧
pc.ontrack = ({ receiver }) => {
  receiver.transform = new RTCRtpScriptTransform(worker,
    { name: "receiverTransform" });
};
```

::right::

```js {2|3-8|9-11|all}
// transform-worker.js —— rtctransform 事件接管道
onrtctransform = (event) => {
  const ts = new TransformStream({
    transform(frame, controller) {
      frame.data = encrypt(frame.data); // 改完 data 放行
      controller.enqueue(frame);
    },
  });
  event.transformer.readable
    .pipeThrough(ts)
    .pipeTo(event.transformer.writable);
};
```

<div v-click class="col-span-2 takeaway mt-4">运行时换密钥：<code>MessageChannel</code> 端口作 options 传入并 transfer；<strong>换钥必配 <code>generateKeyFrame()</code></strong>——否则新入会者黑屏等到下个周期关键帧（收端可 <code>sendKeyFrameRequest()</code> 索要）。</div>

<!--
接线三步。第一步建 Worker；

[click] 第二步把 RTCRtpScriptTransform 挂到 sender 和 receiver 的 transform 属性上。挂载时机讲究「不漏第一帧」：发送侧 addTrack 返回 sender 就立刻挂；

[click] 接收侧必须在 track 事件里挂——晚了第一帧就未经变换直接进解码器，E2EE 下就是花屏。

[click] 第三步在 Worker 里：监听 rtctransform 事件，

[click] TransformStream 的 transform 回调里逐帧加工：改 frame.data 这个 ArrayBuffer，enqueue 放行；

[click] 最后 readable 经 pipeThrough 接到 writable。注意 writableStrategy、readableStrategy 会被忽略，排队策略浏览器全权管理。

[click:2] E2EE 还差两块拼图：换密钥用 MessageChannel 端口随构造传入，处理帧的上下文里直接可用；换钥必须配 generateKeyFrame——老密钥的增量帧链对新密钥持有者毫无意义，不出关键帧新人就一直黑屏。
-->

---
layout: default
---

# 选型：什么时候才需要 WebRTC

<div class="grid grid-cols-2 gap-3 mt-5">
  <div class="rule tone-green"><strong>视频通话 · 屏幕共享</strong><span>两个端点之间的实时音视频——浏览器里唯一的原生答案</span></div>
  <div v-click class="rule tone-green"><strong>文件直传 · 联机对战</strong><span><code>RTCDataChannel</code> 低延迟任意数据，不占你的服务器带宽</span></div>
  <div v-click class="rule tone-blue"><strong>服务器推送 / 双工</strong><span>SSE / WebSocket 就够——纯客户端-服务器需求别引入 P2P 的复杂度</span></div>
  <div v-click class="rule tone-amber"><strong>多人会议</strong><span>全互连 mesh 上行带宽随人数<strong>平方</strong>增长——生产级引入 SFU / MCU（服务端架构，浏览器 API 管不到）</span></div>
</div>

<div v-click class="signal signal-bad mt-5">
  <carbon:warning-alt />
  <span>成本项别忘：对称型 NAT 打洞必败只能走 TURN 中继——<strong>TURN 带宽费用</strong>是生产部署的主要开销。</span>
</div>

<div v-click class="takeaway mt-4">一句话：两个端点之间传实时音视频或低延迟数据 → WebRTC；纯 C/S 的推送与双工 → SSE / WebSocket。</div>

<!--
收束到选型判断。WebRTC 的主场清晰：视频通话、屏幕共享，浏览器里没有第二个原生答案；

[click] 加上数据通道，文件直传和联机对战也直连——媒体和数据都不占你的服务器带宽。

[click] 反过来，纯客户端对服务器的推送和双工，SSE 或 WebSocket 就够，别为它引入三个状态机和协商样板的复杂度。

[click] 多人场景要清醒：全互连 mesh 的上行带宽随人数平方增长，四五个人就到极限——生产级多方会议要引入 SFU 或 MCU 媒体服务器，那已是服务端架构问题。

[click] 成本项：对称型 NAT 下打洞必败、只能走 TURN 中继，TURN 带宽费用是生产部署的主要开销——协议细节网络章有完整展开。

[click] 一句话选型带走。
-->

---
layout: default
---

# 易错点 TOP：翻车都翻在同几个地方

<div class="grid grid-cols-2 gap-3 mt-4">
  <div class="fact"><strong>忘 <code>setLocalDescription()</code></strong><span><code>createOffer()</code> 只是生成——不落位，候选收集永远不开始</span></div>
  <div class="fact"><strong>把 <code>disconnected</code> 当 <code>failed</code></strong><span>杀死了本可自愈的连接——<code>failed</code> 才 <code>restartIce()</code></span></div>
  <div v-click class="fact"><strong>空字符串候选没转发</strong><span>对端 ICE 等不到 end-of-candidates，多耗一段超时</span></div>
  <div v-click class="fact"><strong>没等 <code>open</code> 就 <code>send()</code></strong><span>通道搭传输是异步的——<code>connecting</code> 期间发送抛错</span></div>
  <div v-click class="fact"><strong>可靠性选项同设</strong><span><code>maxRetransmits</code> + <code>maxPacketLifeTime</code> 互斥——抛 <code>SyntaxError</code></span></div>
  <div v-click class="fact"><strong>先枚举后授权</strong><span><code>label</code> 全空串——先 <code>getUserMedia</code> 再 <code>enumerateDevices</code></span></div>
  <div v-click class="fact"><strong>置空 <code>srcObject</code> 当停止</strong><span>设备仍占用、指示灯常亮——逐轨 <code>track.stop()</code></span></div>
  <div v-click class="fact"><strong>receiver transform 挂晚了</strong><span>不在 <code>ontrack</code> 里挂就漏首帧——E2EE 下直接花屏</span></div>
</div>

<!--
全讲的易错点收拢成一屏，都是真实项目里高频翻车的地方。前两条最贵：createOffer 之后忘落位，整条连接看起来什么都没发生；disconnected 贸然重建，把能自愈的连接杀死。

[click] 空字符串候选是哨兵那页的坑，误当 null 过滤掉，对端多等超时；

[click] 数据通道一切从 open 事件开始；

[click] 互斥选项同设直接语法错误；

[click] 设备枚举的顺序问题——授权前 label 全是空串；

[click] 挂断要逐轨 stop，置空 srcObject 指示灯还亮着，用户会以为你在偷拍；

[click] 最后是 Encoded Transform 的时机坑，receiver 的变换必须在 track 事件里挂。这一页适合回来当 checklist 用。
-->

---
layout: center
class: summary-slide
---

# 带走四个判断

<div class="summary-grid mt-8">
  <div><span>01</span><strong>编排两两成对</strong><small><code>create*</code> 只生成，<code>set*</code> 才落位；谈妥了 ≠ 路通了</small></div>
  <div><span>02</span><strong>状态看聚合</strong><small>日常只盯 <code>connectionState</code>：<code>disconnected</code> 等自愈，<code>failed</code> 才 <code>restartIce()</code></small></div>
  <div><span>03</span><strong>协商用样板</strong><small>polite / impolite + 无参 <code>setLocalDescription()</code>——照抄，别自造</small></div>
  <div><span>04</span><strong>数据要节流</strong><small>16 KiB 分块 + <code>bufferedAmount</code> 背压；可靠性按场景挑档位</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API" target="_blank"><carbon:book /> MDN WebRTC API</a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation" target="_blank"><carbon:collaborate /> Perfect negotiation</a>
  <a href="https://www.w3.org/TR/webrtc/" target="_blank"><carbon:document /> W3C 规范</a>
  <a href="https://webrtc.github.io/samples/" target="_blank"><carbon:play-filled-alt /> WebRTC samples</a>
</div>

<!--
四句话复盘。一，编排的节奏感：create 与 set 两两成对，offer/answer 换完只是谈妥，ICE 打通才是路通。二，状态机只信聚合的 connectionState，对 disconnected 保持耐心、对 failed 用 restartIce。三，协商碰撞不要自己发明解法，官方样板的每个标志位都是精确设计。四，数据通道大数据分块加背压，可靠性语义按场景选档。

深入路径：MDN 的 WebRTC 专区所有指南都值得读；perfect negotiation 原文配着样板逐行对；规范正文查行为细节；WebRTC samples 每个 API 一个可跑 demo。协议层的 ICE、STUN、TURN、SDP 在本站网络章配合着读。
-->
