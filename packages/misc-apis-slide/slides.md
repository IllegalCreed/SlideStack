---
theme: seriph
layout: cover
title: 常用杂项 API
info: |
  一批贴设备、贴系统的小 API 合集：剪贴板 / 分享 / 通知 / 页面可见性 / 唤醒锁 / 定位 / URLPattern / 权限查询，共享同一套「安全上下文 + 用户激活 + 权限模型 + 特性检测」地基。

  Learn more at [MDN Web API 索引](https://developer.mozilla.org/en-US/docs/Web/API)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark">API</div>

# 常用杂项 API

## 贴设备、贴系统的一批小能力，共享同一套权限与安全地基

<div class="cover-meta">
  <span>W3C / WHATWG 标准</span>
  <span>Clipboard · Share · Notification · Visibility · Wake Lock · Geolocation · URLPattern · Permissions</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API" target="_blank" class="slidev-icon-btn" aria-label="MDN Web API 文档">
    <carbon:document />
  </a>
  <a href="https://github.com/w3c/permissions" target="_blank" class="slidev-icon-btn" aria-label="W3C Permissions GitHub">
    <carbon:logo-github />
  </a>
</div>

<!--
这不是八个 API 的语法罗列。它们体量不一、场景各异，却共享同一套底层契约：安全上下文、用户激活、权限模型、特性检测降级。

主线是两句话：先把这四条共性地基讲透一次，再逐个 API 抓住「怎么用、什么时候拿不到、怎么优雅降级」。中间有一页真实的四探针实验台，可以现场复制、看可见性翻转、查权限状态、跑 URLPattern 匹配。
-->

---
layout: default
---

# 一个「合集叶」：小而常用，共享同一套契约

<div class="type-map mt-6">
  <div v-click class="type-cell tone-blue"><code>Clipboard</code><span>复制 / 粘贴</span></div>
  <div v-click class="type-cell tone-blue"><code>Web Share</code><span>系统分享面板</span></div>
  <div v-click class="type-cell tone-green"><code>Notifications</code><span>本地系统通知</span></div>
  <div v-click class="type-cell tone-green"><code>Page Visibility</code><span>前台 / 后台</span></div>
  <div v-click class="type-cell tone-amber"><code>Screen Wake Lock</code><span>防熄屏</span></div>
  <div v-click class="type-cell tone-amber"><code>Geolocation</code><span>取经纬度</span></div>
  <div v-click class="type-cell tone-red"><code>URLPattern</code><span>URL 模式匹配</span></div>
  <div v-click class="type-cell tone-red"><code>Permissions</code><span>权限查询总线</span></div>
</div>

<div v-click class="takeaway mt-6">收在一起不是凑数——它们共享同一套底层契约：<strong>安全上下文（HTTPS）+ 用户激活（手势）+ 权限模型 + 特性检测降级</strong>。外加 Battery / Network Information / Vibration 三个「知道就好」的边角 API。</div>

<!--
Web API 章前面的叶子都是单一大主题：IndexedDB、Fetch、Streams、WebRTC。到收尾时还剩一批单独拎出来撑不起一叶、日常又高频的平台能力：复制一段文字、唤起系统分享、弹条通知、知道页面在不在前台、别让屏幕熄掉、拿一次经纬度、匹配一条路由、查一下某个权限。

[click:8] 八个成员一一点出：剪贴板、分享、通知、可见性、唤醒锁、定位、URLPattern、权限。

[click] 把它们收在一起不是凑数，而是因为它们共享同一套底层契约。与其在八个地方各讲一遍要 HTTPS、要点一下、先查权限，不如把四条共性地基讲透一次。另有三个正在被隐私收缩的边角 API 单独一页速览。
-->

---
layout: default
---

# 四条共性地基：学一次，通一批

<div class="grid grid-cols-2 gap-4 mt-6">
  <div v-click class="rule tone-blue"><strong>① 安全上下文（HTTPS）</strong><span>几乎全部要 HTTPS；<code>localhost</code> / <code>127.0.0.1</code> 放行；<code>window.isSecureContext</code> 自查</span></div>
  <div v-click class="rule tone-amber"><strong>② 用户激活（手势）</strong><span>剪贴板写读 / Web Share / Vibration / 申请通知权限，须由真实点击触摸触发</span></div>
  <div v-click class="rule tone-green"><strong>③ 权限模型（Permissions）</strong><span>敏感资源走三态 <code>granted / denied / prompt</code>，可 <code>query()</code> 先查后用</span></div>
  <div v-click class="rule tone-red"><strong>④ 特性检测（渐进增强）</strong><span><code>in</code> 运算符 + 能力探针（<code>canShare</code> / <code>supports</code>），拿不到就降级</span></div>
</div>

<div v-click class="mini-note mt-6 text-center">与其在八个 API 各讲一遍「要 HTTPS、要点一下、先查权限、先探再用」，不如把这四条地基讲透一次，后面每个 API 只讲它<strong>独有</strong>的部分。</div>

<!--
四条地基，逐一点出。

[click] 地基一安全上下文：这批 API 几乎清一色只在安全上下文可用，线上必须 HTTPS，本地 localhost、127.0.0.1、file 放行；window.isSecureContext 是最直接的判据。

[click] 地基二用户激活：浏览器不允许页面静默调用打扰用户的能力，写剪贴板、弹分享、震动、申请通知权限都要由真实手势触发。

[click] 地基三权限模型：定位、通知、摄像头这类访问敏感资源的，授权状态由浏览器统一管理，Permissions API 能先查三态。

[click] 地基四特性检测：平台割裂是常态，先探测、后使用、拿不到就降级不是可选项而是默认姿势。

[click] 记住这个分工：四条地基讲一次，后面每页只填各 API 独有的空。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# 用户激活是「瞬时」的：await 之后就过期

::left::

```js {1|2|3|all}
button.addEventListener("click", async () => {
  const data = await fetch("/api/report").then((r) => r.json());
  await navigator.share(data); // ❌ 激活在等待中过期
});
```

<div class="signal signal-bad mt-3"><carbon:warning-alt /><span>手势激活窗口是<strong>秒级</strong>的、且<strong>会被消耗</strong>——先 <code>await</code> 耗时异步、再调受激活约束的 API，常抛 <code>NotAllowedError</code></span></div>

::right::

```js {2|3|all}
button.addEventListener("click", async () => {
  // 异步准备提前备好，回调里直接用
  await navigator.share(preparedData); // ✅ 手势仍新鲜
});
```

<div v-click class="signal signal-good mt-3"><carbon:checkmark-outline /><span>受激活约束的调用放在手势回调<strong>第一时间</strong>，调用前别夹会消耗激活的 <code>await</code></span></div>

<div v-click class="takeaway mt-3">口诀：<strong>先拿激活，把异步准备提前</strong>。吃这一套的有：写 / 读剪贴板、Web Share、Vibration、申请通知权限。</div>

<!--
这是这批 API 最常见、也最隐蔽的翻车方式。

左边：点击回调里先 await 一个耗时请求，等 fetch 回来再调 navigator.share，很可能抛 NotAllowedError。关键在瞬时两个字：手势带来的激活窗口很短、秒级，而且会被消耗。await 一等就过期了。

[click:2] 右边是正解：把异步数据在点击前或更早备好，手势一到就第一时间调用受激活约束的 API，激活仍然新鲜。

[click] 口诀就一句：先拿激活，把异步准备提前。哪些 API 吃这一套？写读剪贴板、Web Share、Vibration、申请通知权限——后面每个都会照这条纪律。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# 异步剪贴板：四方法，读比写更严

::left::

```js {1-2|4|5|all}
// 写：最高频、支持面最广
await navigator.clipboard.writeText(text);
// 读：更敏感——要求文档有焦点
if (!document.hasFocus()) return; // 否则 NotAllowedError
const t = await navigator.clipboard.readText();
```

<div class="mini-note mt-2">四方法两两成对：<code>writeText</code> / <code>readText</code> 管文本，<code>write</code> / <code>read</code> 管富内容（下页）。仅<strong>安全上下文</strong>、<strong>不在 Worker</strong>。</div>

::right::

<table class="matrix-table">
  <thead><tr><th>方法</th><th>返回</th><th>门槛</th></tr></thead>
  <tbody>
    <tr><td><code>writeText(s)</code></td><td><code>Promise&lt;void&gt;</code></td><td>激活</td></tr>
    <tr><td><code>readText()</code></td><td><code>Promise&lt;string&gt;</code></td><td class="no">焦点 + 激活</td></tr>
    <tr><td><code>write(items)</code></td><td><code>Promise&lt;void&gt;</code></td><td>激活</td></tr>
    <tr><td><code>read()</code></td><td><code>Promise&lt;Item[]&gt;</code></td><td class="no">焦点 + 激活</td></tr>
  </tbody>
</table>

<div v-click class="signal signal-bad mt-3"><carbon:warning-alt /><span>Console 里 <code>readText()</code> 常失败——焦点在 DevTools 上；由页面按钮点击触发才有焦点</span></div>

<!--
navigator.clipboard 是现代的异步剪贴板，取代了 execCommand。四个方法两两成对：文本一对、富内容一对。

[click:3] 左边看最高频的两个。writeText 写纯文本，支持面最广。readText 读纯文本，危险得多——网页能窥探你从别处复制的密码验证码，所以门设得更严：必须文档有焦点，否则直接 NotAllowedError，用 document.hasFocus 可以自查。它只在安全上下文存在，且不暴露给 Web Worker。

右边这张表记住一个规律：读那两个方法都要焦点加激活，比写更严。

[click] 一个高频困惑：在 DevTools Console 里直接 readText 常常失败，就是因为焦点在 DevTools 上、文档没焦点；页面代码里由按钮点击触发才有焦点。
-->

---
layout: default
---

# ClipboardItem 富内容 · Chromium vs Firefox/Safari

<div class="grid grid-cols-[1.05fr_.95fr] gap-6 mt-4 items-start">

```js {1-4|2|6|7|all}
// 一个 item 挂多种表示，粘贴目标各取所需
const item = new ClipboardItem({
  "text/html": new Blob([html], { type: "text/html" }),
  "text/plain": new Blob([plain], { type: "text/plain" }),
});
if (ClipboardItem.supports?.("image/png")) { /* 静态探 MIME */ }
await navigator.clipboard.write([item]);
```

<table class="matrix-table">
  <thead><tr><th>维度</th><th>Chromium</th><th>Firefox / Safari</th></tr></thead>
  <tbody>
    <tr><td>写</td><td class="yes">激活或授权</td><td>需激活</td></tr>
    <tr><td>读</td><td>焦点 + <code>clipboard-read</code></td><td class="no">落地晚 + 粘贴提示</td></tr>
    <tr><td>权限查询</td><td class="yes">可 <code>query</code></td><td class="no">抛 TypeError</td></tr>
  </tbody>
</table>

</div>

<div class="edge-note mt-4"><carbon:warning-alt /><span><code>text/plain</code> · <code>text/html</code> · <code>image/png</code> 是较稳三种；<code>execCommand("copy")</code> 已废弃、仅作 <code>catch</code> 兜底。剪贴板威胁模型（paste-jacking）归<strong>浏览器安全章</strong>。</span></div>

<!--
write 和 read 处理的是 ClipboardItem——一个剪贴板项可以同时携带多种表示：同一份内容的纯文本版加 HTML 版加图片版，粘贴目标按自己能力挑一种。

[click:3] 左边构造一个 item 挂 HTML 和纯文本双表示：粘进富文本编辑器带格式，粘进纯文本框退回纯文本。写图片这类要先用静态方法 ClipboardItem.supports 探测 MIME 支持，再 write。

右边这张表是本页最该记的差异：剪贴板的能不能用在各家判定不同。写在 Chromium 授权后可免激活，Firefox/Safari 恒需激活。读在 Firefox 落地晚。权限查询最扎眼——clipboard-read、clipboard-write 基本只有 Chromium 认，Firefox/Safari 查会抛 TypeError。

底部两条边界：text/plain、text/html、image/png 是跨浏览器较稳的三种；execCommand copy 已废弃只作兜底；剪贴板的 paste-jacking 等威胁模型归浏览器安全章，本页只讲 API。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# Web Share：唤起系统原生分享面板

::left::

```js {3|4|6|8-9|all}
shareBtn.addEventListener("click", async () => {
  // 分享文件前必须单独探测——各平台差异大
  const data = { files: [file], title: "一张图" };
  if (!navigator.canShare?.(data)) return fallbackDownload(file);
  try {
    await navigator.share(data); // 必须在手势内
  } catch (err) {
    // 用户取消面板 = AbortError，是正常流程、别报错
    if (err.name !== "AbortError") console.error(err);
  }
});
```

::right::

<div class="rule-stack">
  <div v-click class="rule tone-blue"><strong>硬门槛</strong><span>安全上下文 + <strong>必须用户激活</strong> + <code>web-share</code> 权限策略</span></div>
  <div v-click class="rule tone-amber"><strong>canShare 探文件</strong><span><code>share</code> 支持不代表 <code>files</code> 支持——分开探测，用 <code>canShare({ files })</code></span></div>
  <div v-click class="rule tone-green"><strong>移动主力、桌面稀薄</strong><span><code>"share" in navigator</code> 探测后再显示按钮，不支持退回「复制链接」</span></div>
</div>

<!--
Web Share 让网页调起操作系统的原生分享面板——微信、邮件、AirDrop、蓝牙，把分享到哪交给系统，网页无需自己列一排分享按钮。

[click:4] 左边这段体现三个要点。第一，ShareData 有 title、text、url、files，至少给一个有效字段。第二，分享文件前用 canShare 单独探测——文件支持在各平台差异极大，不支持就降级到下载。第三，share 被用户关掉面板会拒绝为 AbortError，这是正常操作不是错误，只有非 AbortError 才算真错。

右边三条门槛。[click] 硬门槛：安全上下文加必须用户激活加 web-share 权限策略。[click] canShare 最重要的用途是探文件，share 支持不代表 files 支持。[click] 移动主力桌面稀薄，务必先探测再决定显不显示分享按钮，不支持退回复制链接。
-->

---
layout: default
class: lab-slide
---

# 交互实验：四探针 API 探针台

<MiscApiProbeLab />

<!--
这是真实的四个 API，不是演示动画。

探针一 Clipboard：输入框改文本，点复制触发真实的 clipboard.writeText。它做了特性检测，非安全上下文或老浏览器会显示降级到 execCommand；无焦点或被拒会优雅兜底而不是抛脸。

探针二 Page Visibility：中间大字实时显示 document.visibilityState。现在切到别的标签再切回来，会看到它在 visible 和 hidden 之间翻转，下面的 visibilitychange 计数每次加一——这就是页面省电模式的判据来源。

探针三 Permissions：挂载时对四个权限名做 query，显示三态。注意 clipboard-read 那行——在 Firefox 和 Safari 会抛 TypeError，被兜底成 unknown，这正是为什么 query 必须包 try/catch。

探针四 URLPattern：固定模式 users 冒号 id、posts 冒号 postId，改上面的 URL 输入框，下面实时显示匹配与否和抽出的命名分组 id、postId。特性检测到位，旧环境会提示用 polyfill。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# Notifications：页面级 vs Service Worker 持久

::left::

<table class="matrix-table">
  <thead><tr><th>维度</th><th>页面级 <code>new Notification</code></th><th>SW <code>showNotification</code></th></tr></thead>
  <tbody>
    <tr><td>生命周期</td><td>绑当前页面</td><td class="yes">脱离页面存活</td></tr>
    <tr><td>移动端</td><td class="no">多抛 TypeError</td><td class="yes">唯一可行</td></tr>
    <tr><td>动作按钮 <code>actions</code></td><td class="no">不支持</td><td class="yes">支持</td></tr>
    <tr><td>事件</td><td>实例 <code>click</code></td><td>全局 <code>notificationclick</code></td></tr>
  </tbody>
</table>

<div class="mini-note mt-2">权限三态 <code>Notification.requestPermission()</code> → <code>granted / denied / default</code>；先读静态 <code>Notification.permission</code> 避免重复弹窗，<strong>在手势内</strong>申请。</div>

::right::

```js {1|2|5-6|all}
const reg = await navigator.serviceWorker.ready;
await reg.showNotification("下载完成", {
  body: "报表已生成",
  requireInteraction: true,
  // actions 仅 SW 通知生效
  actions: [{ action: "open", title: "打开" }],
});
```

<div class="edge-note mt-3"><carbon:warning-alt /><span><strong>iOS 的 Web 通知只对「已装到主屏的 PWA」生效</strong>（16.4+）；<strong>服务端主动推送</strong>（Push + 订阅 + 后台唤醒）归 Service Worker & PWA 叶。</span></div>

<!--
Notifications 让网页弹出系统级通知，显示在通知中心，切到别的标签也在。本页只讲本地触发的通知。

左边这张对比表是本节最关键的分叉——两种通知，能力与适用面完全不同。页面级 new Notification 生命周期绑当前页面，在多数移动浏览器直接抛 TypeError，不支持动作按钮，事件在实例上。SW 的 showNotification 脱离页面存活、可后台点击，是移动端唯一可行的选择，支持 actions 按钮，事件在 SW 全局的 notificationclick。

权限方面：requestPermission 返回三态，先读静态属性 Notification.permission 避免重复弹窗，且必须在用户手势内申请。

[click:3] 右边是持久通知的写法：从 SW 注册拿 registration，showNotification 弹一条带动作按钮的通知，requireInteraction 让它不自动消失，actions 只在 SW 通知里生效。

底部两条现实约束：iOS 的 Web 通知只对已装到主屏的 PWA 生效，普通 Safari 标签页不行；关掉页面还能收的服务端推送要 Push API 加 SW，归 Service Worker 与 PWA 叶。
-->

---
layout: default
---

# Page Visibility：转后台就停，省电省流量

<div class="grid grid-cols-[1.05fr_.95fr] gap-6 mt-4 items-start">

```js {1|3|4|all}
document.addEventListener("visibilitychange", () => {
  // document.visibilityState: "visible" | "hidden"
  if (document.visibilityState === "hidden") stopPolling(); // 停轮询 / 动画 / 视频
  else startPolling(); // 回前台恢复
});
```

<div class="rule-stack">
  <div v-click class="rule tone-green"><strong>省电场景</strong><span>转后台暂停 <code>setInterval</code> 轮询、<code>&lt;video&gt;</code>、<code>requestAnimationFrame</code>、WebSocket 心跳</span></div>
  <div v-click class="rule tone-blue"><strong>存状态用它</strong><span>转 hidden + <code>sendBeacon</code> 上报，<strong>别用</strong> <code>unload</code> / <code>beforeunload</code></span></div>
</div>

</div>

<div v-click class="edge-note mt-5"><carbon:warning-alt /><span><code>unload</code> / <code>beforeunload</code> 执行不可靠（移动端切走直接杀进程）且<strong>破坏 bfcache</strong>；<code>visibilitychange</code> 转 hidden 是最可靠的「即将离开」信号。<code>document.hidden</code> 已不推荐，用 <code>visibilityState</code>。</span></div>

<!--
Page Visibility 让页面知道自己是否对用户可见——前台标签、非最小化、屏幕未熄，从而在转入后台时暂停无谓的工作。它早已 Baseline，几乎零门槛。

左边就是核心用法：监听 visibilitychange，visibilityState 是 visible 或 hidden，转后台停轮询停动画停视频，回前台恢复。

[click] 省电场景很广：转后台暂停 setInterval 轮询、暂停 video、停 requestAnimationFrame 循环、WebSocket 心跳降频。[click] 还有个重要用途：保存草稿、上报用户离开这类清理，要挂在 visibilitychange 转 hidden、配 sendBeacon，而不是 unload。

[click] 为什么？unload 和 beforeunload 执行不可靠，移动端切走进程可能直接杀，回调根本不跑；而且它们破坏 bfcache，让页面无法进往返缓存。visibilitychange 转 hidden 才是最可靠的即将离开信号。另外 document.hidden 布尔属性已不推荐，一律用语义更清晰的 visibilityState。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# Screen Wake Lock：别让屏幕熄掉

::left::

```js {2|4|5|9-11|all}
async function requestWakeLock() {
  if (!("wakeLock" in navigator)) return; // 特性检测
  try {
    wakeLock = await navigator.wakeLock.request("screen"); // 唯一类型
    wakeLock.addEventListener("release", () => {}); // released = true
  } catch (err) {
    console.error(err); // 低电量 / 省电 / 文档不可见都可能被拒
  }
}
document.addEventListener("visibilitychange", () => {
  // 页面隐藏会自动释放，回前台必须重获
  if (wakeLock && document.visibilityState === "visible") requestWakeLock();
});
```

::right::

<div class="signal signal-bad"><carbon:warning-alt /><span><strong>最容易踩的坑</strong>：页面转 hidden（切标签 / 最小化 / 锁屏）唤醒锁被系统<strong>自动释放</strong>，回 visible <strong>不会自动恢复</strong></span></div>

<div v-click class="signal signal-good mt-3"><carbon:checkmark-outline /><span>标准配方：与 Page Visibility 绑定，回前台时若之前持有过就重新 <code>request</code></span></div>

<div v-click class="mini-note mt-3">门槛：安全上下文 + 文档需可见 + <code>screen-wake-lock</code> 策略。支持 <strong>Chromium 与 Safari 16.4+</strong>、<strong>Firefox 暂无</strong>——探测后降级。用完即 <code>release()</code>。</div>

<!--
Screen Wake Lock 让网页阻止屏幕自动变暗、熄灭、锁屏——扫码页、导航、菜谱、演示、跟练视频这类用户在看但不摸屏幕的场景刚需。

左边：wakeLock.request screen 申请，screen 是唯一支持的类型，返回一个 WakeLockSentinel 持有凭证，有 release 方法、released 布尔、release 事件。低电量、省电模式、文档不可见都可能拒绝，所以包 try catch。

[click:2] 下半段是重点：页面隐藏会自动释放锁，所以监听 visibilitychange，回到 visible 且之前持有过就重新申请。

右边把这个坑讲透。[click] 这是唤醒锁最容易踩的坑：页面一旦转 hidden——切标签、最小化、锁屏——唤醒锁被系统自动释放，而且回到 visible 不会自动恢复。[click] 标准配方就是和 Page Visibility 绑定重获。[click] 门槛是安全上下文加文档需可见加 screen-wake-lock 策略；支持 Chromium 和 Safari 16.4 加，Firefox 暂无，务必探测后降级；用完即 release，别长期霸占。
-->

---
layout: default
---

# Geolocation：单次 / 持续 / 停止

<div class="grid grid-cols-[1.05fr_.95fr] gap-6 mt-4 items-start">

```js {1|3|6|8|9|all}
navigator.geolocation.getCurrentPosition(
  (pos) => {
    const { latitude, longitude, accuracy } = pos.coords;
  },
  (err) => {}, // err.code: 1 拒绝 / 2 不可用 / 3 超时
  { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
);
const id = navigator.geolocation.watchPosition(ok, err); // 持续追踪
navigator.geolocation.clearWatch(id); // 用完必停，否则持续耗电
```

<table class="matrix-table">
  <thead><tr><th>选项</th><th>默认</th><th>含义</th></tr></thead>
  <tbody>
    <tr><td><code>enableHighAccuracy</code></td><td>false</td><td>开 GPS：更准更慢更耗电</td></tr>
    <tr><td><code>timeout</code></td><td>∞</td><td>超时走 code 3</td></tr>
    <tr><td><code>maximumAge</code></td><td>0</td><td>可用多旧的缓存位置</td></tr>
  </tbody>
</table>

</div>

<div class="mini-note mt-3"><code>coords</code>：<code>latitude</code> / <code>longitude</code> / <code>accuracy</code> 必有，<code>altitude</code> / <code>heading</code> / <code>speed</code> 无传感器时为 <code>null</code>。权限名 <code>geolocation</code>，<code>denied</code> 时别再弹、走手动输入城市；中国大陆常改用百度 / 高德 SDK。</div>

<!--
Geolocation 提供设备定位，需安全上下文且用户授权，仅主线程。三个方法：单次 getCurrentPosition、持续 watchPosition、停止 clearWatch。

[click:4] 左边单次定位收三个参数：成功回调拿 GeolocationPosition，coords 里 latitude、longitude、accuracy 三者必有，accuracy 单位米。错误回调按 code 分流，1 是权限拒绝，2 是位置不可用，3 是超时。第三个是选项对象。watchPosition 持续追踪返回一个 watchId，clearWatch 停止——用完必停，否则持续耗电耗流量。

右边三个选项要记默认值：enableHighAccuracy 默认 false，开则尽量用 GPS，更准但更慢更耗电；timeout 默认无穷大；maximumAge 默认 0 强制取新，设大可秒回但可能偏旧。

底部：coords 里 altitude、heading、speed 在无对应传感器时为 null。权限名 geolocation，denied 时别再弹窗、引导手动输入城市。地域提示：中国大陆基于 WiFi 的定位常不准，实际项目多改用百度高德的定位 SDK。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# URLPattern：声明式路由匹配（2025-09 Baseline）

::left::

```js {1|3|5|6-7|all}
const route = new URLPattern({ pathname: "/users/:id/posts/:postId" });

route.test("https://x.com/users/42/posts/7"); // true

const r = route.exec("https://x.com/users/42/posts/7");
r.pathname.groups.id; // "42"  ← 命名分组
r.pathname.groups.postId; // "7"
```

<div class="mini-note mt-2">语法：<code>:name</code> 命名分组 · <code>*</code> 通配 · <code>(\d+)</code> 正则组 · <code>? + *</code> 修饰 · <code>{}</code> 分组。<code>exec</code> 结果按 URL 分量分层，Worker 内可用。</div>

::right::

<div class="baseline-hero">
  <span>Baseline Newly available</span>
  <strong>2025-09-15</strong>
  <small>URLPattern 最后补齐的浏览器日期</small>
</div>

<div v-click class="signal signal-bad mt-3"><carbon:warning-alt /><span><strong>易混点</strong>：URLPattern 是 <strong>Safari 26</strong>（2025-09-15），<strong>不是 Safari 16.4</strong>——16.4 那批是 Screen Wake Lock 等</span></div>

<div v-click class="mini-note mt-2">Chrome 95（2021）· Firefox 142（2025-08）· Safari 26（2025-09）。旧环境用 <code>urlpattern-polyfill</code> 或退回手写正则。</div>

<!--
URLPattern 用一套声明式模式语法匹配 URL 并抽取命名分组，把手写正则的路由判断替换成可读的模式。它和 Express、Next.js 路由、path-to-regexp 同源，非常适合前端路由和 Service Worker 请求分流。

[click:4] 左边：构造既可传模式串加 baseURL，也可传分量对象。test 只问匹不匹配返回布尔。exec 匹配则返回结构化结果，命名分组从 r.pathname.groups 点 id 取。返回对象按 URL 分量分层，每个分量有 input 和 groups。语法一览：冒号 name 命名分组、星号通配、括号正则组、问号加号星号修饰、花括号分组。URLPattern 在 Worker 里也可用。

右边是支持状态，也是最容易记错的地方。URLPattern 在 2025 年 9 月 15 日转为 Baseline Newly available，即最后一个主流浏览器补齐支持的日期。

[click] 易混点务必记牢：URLPattern 的 Safari 支持是 Safari 26，不是 Safari 16.4；16.4 那批新增的是 Screen Wake Lock 等，不含 URLPattern。[click] 各浏览器起点：Chrome 95 早就有、Firefox 142、Safari 26。旧环境用官方 urlpattern-polyfill 或退回手写正则。
-->

---
layout: default
---

# 三个边角 API：知道就好，别当默认可用

<div class="obs-grid mt-6">
  <div v-click class="obs-card is-report"><code>Battery Status</code><strong>navigator.getBattery()</strong><small><code>charging</code> / <code>level</code> + 事件。Firefox 已移除、Safari 从未实现、仅 Chromium——指纹风险，新项目别用</small></div>
  <div v-click class="obs-card is-perf"><code>Network Information</code><strong>navigator.connection</strong><small><code>effectiveType</code> / <code>rtt</code> / <code>saveData</code>。Chromium 独占非标准；<code>saveData</code> 省流量偏好相对最值得读</small></div>
  <div v-click class="obs-card is-io"><code>Vibration</code><strong>navigator.vibrate(pattern)</strong><small>数字或数组（震 / 停交替）。需激活、仅移动；桌面与 iOS Safari 静默无效</small></div>
</div>

<div v-click class="edge-note mt-6"><carbon:warning-alt /><span>共同底色：<strong>「读设备状态」类 API 因指纹隐私整体收缩</strong>。一律当增强层、先探测（<code>if (navigator.connection)</code>）再用，绝不作关键交互的唯一依赖。</span></div>

<!--
最后三个体量更小、且都处于隐私收缩或半支持状态，了解现状即可。

[click:3] Battery Status 读电量：getBattery 返回 BatteryManager，有 charging、level 加事件。现状是 Firefox 已移除、Safari 从未实现、仅 Chromium 保留，因指纹追踪隐私风险整体淘汰，新项目不要依赖。

Network Information 报告网络质量：navigator.connection 有 effectiveType、downlink、rtt、saveData。现状是 Chromium 独占的非标准，Firefox 和 Safari 都不支持。其中 saveData 省流量偏好是相对最值得读的信号，尊重用户省流量意愿，但同样要探测后用。

Vibration 让移动设备震动：vibrate 收数字或数组，数组是震停交替。需用户激活、仅移动端有震动硬件时生效，桌面和 iOS Safari 静默无效。

[click] 共同底色一句话：读设备状态类的 API 因指纹隐私整体收缩，一律当增强层，先探测再用，绝不作关键交互的唯一依赖。
-->

---
layout: default
---

# Permissions：权限状态的「只读总线」

<div class="grid grid-cols-[1.05fr_.95fr] gap-6 mt-4 items-start">

```js {1|2|4-5|8|all}
const status = await navigator.permissions.query({ name: "geolocation" });
status.state; // "granted" | "denied" | "prompt"

// ⭐ 只读不请求：query 不弹窗，只告诉你现状
// 真正授权仍靠调用对应 API（getCurrentPosition…）

// 用户在设置里改权限 → 实时触发
status.addEventListener("change", () => update(status.state));
```

<table class="matrix-table">
  <thead><tr><th>state</th><th>该怎么做</th></tr></thead>
  <tbody>
    <tr><td class="yes">granted</td><td>已允许，直接用</td></tr>
    <tr><td>prompt</td><td>调用对应 API（顺带弹窗）</td></tr>
    <tr><td class="no">denied</td><td>别再弹，引导设置或降级</td></tr>
  </tbody>
</table>

</div>

<div class="edge-note mt-4"><carbon:warning-alt /><span>可查名单各家不一：<code>clipboard-read</code> / <code>clipboard-write</code> 基本仅 Chromium，Firefox/Safari 查会<strong>抛 TypeError</strong>——<code>query()</code> 必须包 <code>try/catch</code>。无 <code>revoke()</code>，用户只能去设置改。</span></div>

<!--
前面几页反复出现先查权限、按状态分流，统一它们的就是 Permissions API——一条只读的权限状态总线。它不负责申请，只负责告诉你现在什么状态。

[click:3] 左边：query 传权限名，拿到 PermissionStatus，核心是 state 三态。最关键的边界——query 只读不请求，它不会弹授权窗，真正触发授权仍要调用对应 API 本身，比如 getCurrentPosition。PermissionStatus 是活的，能监听 change，用户在设置里改权限会实时触发。

右边三态怎么处理：granted 已允许直接用；prompt 尚未决定，调用对应 API 时会弹窗；denied 已拒绝，别再弹，引导去设置或走降级。

[click] 底部这条是重灾区：可查询名单因浏览器而异，clipboard-read、clipboard-write 基本只有 Chromium 支持，Firefox 和 Safari 查它们会抛 TypeError，所以 query 必须包 try catch。还有 Permissions 没有 revoke，网页不能替用户撤销权限，用户只能自己去设置改。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# 三道门：权限 × 激活 × 策略（与关系）

::left::

<table class="matrix-table">
  <thead><tr><th>门</th><th>管什么</th><th>典型 API</th></tr></thead>
  <tbody>
    <tr><td>用户授权<br>Permissions</td><td>敏感资源访问许可</td><td>定位 / 通知 / 摄像头 / 唤醒锁</td></tr>
    <tr><td>用户激活<br>手势</td><td>防脚本静默打扰</td><td>Share / 剪贴板 / Vibration</td></tr>
    <tr><td>权限策略<br>Policy</td><td>站点 / iframe 允许清单</td><td>几乎所有（尤其 iframe）</td></tr>
  </tbody>
</table>

<div class="mini-note mt-2">三者是<strong>与</strong>关系：即便授权了定位，若非安全上下文、或 iframe 没 <code>allow</code>，仍拿不到。</div>

::right::

<div class="rule-stack">
  <div v-click class="rule tone-green"><strong>走 Permissions 的</strong><span>定位 / 通知 / 摄像头 → <code>query</code> 先查三态、按 denied 短路</span></div>
  <div v-click class="rule tone-amber"><strong>主要靠激活的</strong><span>Share / 剪贴板写 / Vibration → 无可查权限名，只能保证手势内调用、失败降级</span></div>
  <div v-click class="rule tone-blue"><strong>iframe 里用</strong><span><code>&lt;iframe allow="geolocation; camera"&gt;</code>，否则 <code>query</code> 直接返回 denied</span></div>
</div>

<!--
这批 API 的能不能用由三道叠加的门共同决定，缺一不可——混淆它们是踩坑的根源。

左边这张表把三道门列清。第一道用户授权，用户点允许拒绝，管敏感资源的访问许可，典型是定位、通知、摄像头、唤醒锁。第二道用户激活，一次真实手势，防止脚本静默调用打扰性能力，典型是 Share、剪贴板、Vibration。第三道权限策略，站点或 iframe 层面的允许清单，几乎所有能力都受它约束，尤其 iframe 嵌入时。三者是与关系：即便用户授权了定位，若不在安全上下文、或 iframe 没有 allow，仍然拿不到。

右边是区分它们的实操意义。[click] 走 Permissions 的可以 query 先查三态、按 denied 短路。[click] 主要靠激活的没有可查的权限名，只能保证在手势回调里激活未过期时调用，失败就 catch 降级。[click] iframe 里用记得给 iframe allow 或响应头 Permissions-Policy，否则 query 直接返回 denied。
-->

---
layout: default
---

# 工程模式：把「拿权限」做对

<div class="grid grid-cols-2 gap-4 mt-4">
  <div v-click class="fact"><strong>特性检测优先</strong><span>先确认 API 存在再谈权限：<code>in</code> 运算符 + 能力探针</span></div>
  <div v-click class="fact"><strong>渐进增强</strong><span>当增强层：分享退复制、定位退手选城市、通知退红点，核心流程不因杂项 API 缺失卡死</span></div>
  <div v-click class="fact"><strong>最小权限 · 恰时申请</strong><span>用到那一刻、由用户操作触发才申请，别一进页面连弹一串</span></div>
  <div v-click class="fact"><strong>先给理由（pre-prompt）</strong><span>系统窗只弹一次印象；先用页面 UI 解释，用户点「好」再触发真正的系统窗</span></div>
</div>

```js {2|4|all}
// ❌ 一进页面就抢权限，转化率极低、体验差
window.addEventListener("load", () => Notification.requestPermission());
// ✅ 点「订阅提醒」时才申请
subscribeBtn.addEventListener("click", () => Notification.requestPermission());
```

<!--
把拿权限做对，四条工程原则。

[click:4] 特性检测优先：永远先确认 API 存在，再谈权限，用 in 运算符加能力探针。渐进增强：把这批 API 当增强层，有了更好没有也能用——分享不支持退回复制链接，定位拿不到让用户手选城市，通知没授权用站内红点，核心流程永远不应因某个杂项 API 缺失卡死。最小权限加恰时申请：别一进页面就连弹一串授权，用户会本能全拒，正确姿势是用到某能力那一刻、由用户操作触发时才申请。先给理由：系统授权窗只弹得起一次印象，被拒后再要就难了，先用页面自己的 UI 解释为什么需要，用户点好再触发真正的系统窗。

底下代码就是恰时申请的对比：反例在 load 时就抢通知权限，转化率极低；正解是点订阅提醒时才申请。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# 优雅降级：一个骨架收进四条地基

::left::

```js {2|4-5|7|9-11|all}
async function requestCapability({ feature, permission, use, fallback }) {
  if (!(feature in navigator)) return fallback("unsupported"); // 1 检测

  const state = await safeQuery(permission); // 2 查权限（try/catch 包过）
  if (state === "denied") return fallback("denied");

  try {
    return await use(); // 3 调用（prompt 在此弹窗）
  } catch (err) {
    if (err?.name === "AbortError") return; // 用户取消，不算失败
    return fallback(err?.name ?? "error"); // 4 降级
  }
}
```

::right::

<div class="boundary-stack mt-1">
  <div v-click class="boundary trusted"><carbon:search /> 特性检测 <code>in</code> + 能力探针</div>
  <carbon:arrow-down />
  <div v-click class="boundary check"><carbon:security /> 手势内调用 · 查权限短路</div>
  <carbon:arrow-down />
  <div v-click class="boundary external"><carbon:warning-alt /> 拒绝 / 超时 / 不支持 → 等价替代</div>
</div>

<div v-click class="takeaway mt-3">每条失败路径都要有<strong>等价替代 + 友好提示</strong>，绝不把异常甩给用户。</div>

<!--
把前面所有模式浓缩成一个可复用的请求某能力助手，体现检测、查询、恰时申请、降级四步。

[click:4] 左边这段骨架四步走。第一步特性检测，feature 不在 navigator 上就降级。第二步查权限，safeQuery 里包了 try catch，denied 直接短路降级。第三步调用对应 API，prompt 会在这里弹窗。第四步失败降级，注意 AbortError 是用户主动取消不算失败，其余错误走 fallback。这套骨架适配本叶几乎所有 API：把 feature、permission、use、fallback 换成对应的即可，权限激活降级都收敛在一处。

[click:3] 右边把这个流水线画出来：先特性检测 in 加探针，再手势内调用查权限短路，最后拒绝超时不支持都给等价替代。[click] 收一句：每条失败路径都要有等价替代加友好提示，绝不把异常甩给用户。
-->

---
layout: default
---

# 支持面矩阵（现行 Baseline 概览）

<table class="matrix-table mt-3">
  <thead><tr><th>API</th><th>Chromium</th><th>Firefox</th><th>Safari</th><th>备注</th></tr></thead>
  <tbody>
    <tr><td>Clipboard <code>writeText</code></td><td class="yes">✅</td><td class="yes">✅</td><td class="yes">✅</td><td>广泛可用</td></tr>
    <tr><td>Clipboard <code>read</code></td><td class="yes">✅</td><td class="no">⚠️ 落地晚</td><td class="yes">✅</td><td>读比写严</td></tr>
    <tr><td>Web Share</td><td>部分</td><td class="no">⚠️ 有限</td><td class="yes">✅ 移动强</td><td>移动主力</td></tr>
    <tr><td>Notifications（SW 持久）</td><td class="yes">✅</td><td class="yes">✅</td><td class="yes">✅ iOS 装 PWA</td><td>移动唯一可行</td></tr>
    <tr><td>Page Visibility · Geolocation</td><td class="yes">✅</td><td class="yes">✅</td><td class="yes">✅</td><td>Baseline 广泛</td></tr>
    <tr><td>Screen Wake Lock</td><td class="yes">✅</td><td class="no">❌ 暂无</td><td class="yes">✅ 16.4+</td><td>探测降级</td></tr>
    <tr><td>URLPattern</td><td class="yes">✅ 95+</td><td class="yes">✅ 142+</td><td class="yes">✅ 26+</td><td>Baseline 2025-09-15</td></tr>
    <tr><td>Battery · Network Info</td><td class="yes">✅</td><td class="no">❌</td><td class="no">❌</td><td>收缩 / 非标准</td></tr>
    <tr><td>Vibration</td><td class="yes">✅ 移动</td><td class="yes">✅ 移动</td><td class="no">❌ 含 iOS</td><td>桌面无效</td></tr>
  </tbody>
</table>

<div class="mini-note mt-3">URLPattern 的 Baseline 日期即最后补齐的 <strong>Safari 26（2025-09-15）</strong>，<strong>不是 16.4</strong>；Safari 16.4 对应的是 Screen Wake Lock 等。</div>

<!--
把支持面收进一张表。逐行扫过去：Clipboard writeText 三家广泛可用；Clipboard read 在 Firefox 落地晚，读比写严；Web Share 是移动主力，桌面部分、Firefox 有限；Notifications 的 SW 持久通知三家都行，iOS 要装 PWA，是移动唯一可行；Page Visibility 和 Geolocation 都是 Baseline 广泛可用；Screen Wake Lock 是 Chromium 加 Safari 16.4，Firefox 暂无，务必探测降级；URLPattern 是 Chrome 95、Firefox 142、Safari 26，Baseline 2025 年 9 月 15；Battery 和 Network Information 基本 Chromium 独占、在收缩；Vibration 仅移动，桌面和 iOS 无效。

底部再强调一次最容易记错的：URLPattern 的 Baseline 日期即最后补齐的 Safari 26、2025 年 9 月 15，不是 16.4；Safari 16.4 对应的是 Screen Wake Lock 等。
-->

---
layout: default
---

# 易错点清单：最常翻车的十个

<div class="grid grid-cols-2 gap-x-8 gap-y-1 mt-4">
  <div v-click class="pit"><carbon:warning-alt /><span><code>await</code> 后再调 Share / 剪贴板 → 激活过期 <code>NotAllowedError</code></span></div>
  <div v-click class="pit"><carbon:warning-alt /><span>Console 里 <code>readText()</code> 失败 → 焦点在 DevTools，由页面按钮触发</span></div>
  <div v-click class="pit"><carbon:warning-alt /><span>把 Web Share 的 <code>AbortError</code> 当错误报 → 那是用户取消</span></div>
  <div v-click class="pit"><carbon:warning-alt /><span>只 <code>"share" in navigator</code> 就分享文件 → 用 <code>canShare({ files })</code> 单独探</span></div>
  <div v-click class="pit"><carbon:warning-alt /><span>移动端用 <code>new Notification()</code> → 抛 TypeError，改 SW <code>showNotification</code></span></div>
  <div v-click class="pit"><carbon:warning-alt /><span>指望页面级通知带 <code>actions</code> → 按钮仅 SW 通知支持</span></div>
  <div v-click class="pit"><carbon:warning-alt /><span><code>unload</code> / <code>beforeunload</code> 存状态 → 不可靠 + 破坏 bfcache，改 <code>visibilitychange</code></span></div>
  <div v-click class="pit"><carbon:warning-alt /><span>申请了唤醒锁就以为一直有效 → 隐藏自动释放，回前台重获</span></div>
  <div v-click class="pit"><carbon:warning-alt /><span><code>watchPosition</code> 忘 <code>clearWatch</code> → 持续耗电耗流量</span></div>
  <div v-click class="pit"><carbon:warning-alt /><span><code>query({ name: "clipboard-read" })</code> 在 FF/Safari 崩 → 必 <code>try/catch</code></span></div>
</div>

<!--
十个最常翻车的坑，快速过一遍。

第一，await 后再调 Share 或剪贴板写，激活过期报 NotAllowedError，手势回调第一时间调、异步准备提前。第二，Console 里 readText 失败是焦点在 DevTools 上，由页面按钮点击触发。第三，把 Web Share 的 AbortError 当错误报，那是用户取消、正常流程。第四，只判断 share in navigator 就分享文件，文件支持另说、用 canShare files 单独探。第五，移动端用 new Notification 多抛 TypeError，改用 SW 的 showNotification。第六，指望页面级通知带 actions 按钮，那仅 SW 持久通知支持。第七，用 unload、beforeunload 存状态不可靠且破坏 bfcache，改 visibilitychange 转 hidden 加 sendBeacon。第八，申请了唤醒锁就以为一直有效，页面转 hidden 自动释放，回前台要重获。第九，watchPosition 忘了 clearWatch 持续耗电。第十，query clipboard-read 在 Firefox、Safari 抛 TypeError，必须 try catch。
-->

---
layout: center
class: summary-slide
---

# 带走六条

<div class="summary-grid mt-6">
  <div><span>01</span><strong>先探再用</strong><small><code>in</code> + 能力探针，拿不到就降级，核心流程不依赖杂项 API</small></div>
  <div><span>02</span><strong>手势第一时间调</strong><small>激活是瞬时的，别在 <code>await</code> 之后调 Share / 剪贴板</small></div>
  <div><span>03</span><strong>query 只读不请求</strong><small>三态先查后用，denied 别再弹；名不认要 <code>try/catch</code></small></div>
  <div><span>04</span><strong>通知分两种</strong><small>页面级 vs SW 持久；移动 / actions 用 SW；iOS 装 PWA</small></div>
  <div><span>05</span><strong>唤醒锁隐藏即释放</strong><small>绑 <code>visibilitychange</code>，回前台重获</small></div>
  <div><span>06</span><strong>URLPattern 是 Safari 26</strong><small>2025-09 Baseline，非 16.4；旧环境 polyfill</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API" target="_blank"><carbon:book /> MDN Web API</a>
  <a href="https://web.dev/blog/baseline-urlpattern" target="_blank"><carbon:rocket /> URLPattern Baseline</a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/Security/User_activation" target="_blank"><carbon:security /> User activation</a>
</div>

<!--
六条铁律收尾。一，先探再用，in 加能力探针，拿不到就降级，核心流程不依赖任何杂项 API。二，受激活约束的调用放手势第一时间，激活是瞬时的，别在 await 之后调 Share 或剪贴板。三，Permissions 的 query 只读不请求，三态先查后用，denied 别再弹，查不认的名字要 try catch。四，通知分两种，页面级和 SW 持久，移动端和要按钮的用 SW，iOS 要装 PWA。五，唤醒锁页面隐藏就自动释放，绑 visibilitychange 回前台重获。六，URLPattern 是 Safari 26、2025 年 9 月 Baseline，不是 16.4，旧环境用 polyfill。

掌握这六条，凡是要贴合系统的小能力，都能在这批 API 里按同一套心智找到、用对、并优雅降级。
-->
