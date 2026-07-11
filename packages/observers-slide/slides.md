---
theme: seriph
layout: cover
title: Observer 观察器 API
info: |
  浏览器内建的五类异步观察器：把「我关心某种变化」声明给浏览器，由它在渲染管线恰当时机批量、异步地回调你——取代 scroll/resize 事件与 setInterval 轮询。

  Learn more at [MDN Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark">OBS</div>

# Observer 观察器 API

## 声明你关心的变化，浏览器在恰当时机批量回调

<div class="cover-meta">
  <span>W3C / WHATWG 标准</span>
  <span>Intersection · Resize · Mutation · Performance · Reporting</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API" target="_blank" class="slidev-icon-btn" aria-label="MDN 文档">
    <carbon:document />
  </a>
  <a href="https://github.com/w3c/IntersectionObserver" target="_blank" class="slidev-icon-btn" aria-label="w3c/IntersectionObserver GitHub">
    <carbon:logo-github />
  </a>
</div>

<!--
这不是五个 API 的语法罗列。它们共享同一套设计哲学：你只声明「我关心某种变化」，浏览器在渲染管线的恰当时机，批量、异步地把「变了什么」回调给你——从根本上取代 scroll/resize 事件监听和 setInterval 轮询那套在主线程高频计算的旧范式。

主线是三条：为什么这套模式更快更省电、五个成员各自的机制、以及唯一真正需要死记的差异——回调时机。中间有一页真实的 IntersectionObserver 交互实验，可以现场滚动、调参看回调怎么触发。
-->

---
layout: default
---

# 观察器模式：为何取代 scroll/resize 与轮询

<div class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>旧范式：<strong>scroll/resize</strong> 在主线程高频触发，回调里反复 <strong>getBoundingClientRect</strong> → 读布局又改样式交替 → 强制同步布局（layout thrashing）→ 滚动卡顿</span>
</div>

<div class="pipeline mt-6">
  <div class="pipeline-step tone-blue">
    <span class="step-no">01</span>
    <strong>变化发生</strong>
    <span>元素进视口 / 尺寸变 / DOM 改</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-amber">
    <span class="step-no">02</span>
    <strong>浏览器批处理</strong>
    <span>渲染管线恰当时机，同帧合并</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-green">
    <span class="step-no">03</span>
    <strong>回调你</strong>
    <span>布局已算好，结果直接给</span>
  </div>
</div>

<div class="grid grid-cols-3 gap-4 mt-6">
  <div v-click class="fact"><strong>声明式</strong><span>只说「关心什么」，省掉防抖节流样板</span></div>
  <div v-click class="fact"><strong>异步批处理</strong><span>同帧多次变化合成一批，一次回调</span></div>
  <div v-click class="fact"><strong>更省电</strong><span>后台标签页里浏览器可暂停观察</span></div>
</div>

<!--
观察器出现前，「元素滚进视口了吗」「这个 div 尺寸变了吗」都靠两种笨办法：高频监听 scroll/resize，或 setInterval 轮询。两者都在主线程高频跑，还有个隐蔽杀手——强制同步布局：回调里刚读 getBoundingClientRect 触发布局计算，紧接着改样式，下次读又得重算，读写交替把本可批处理的布局拆成一次次同步计算。

观察器把这套彻底反转：你声明关心什么，何时算、算完通知你全交给浏览器，它在最省的时机（布局已算好、准备绘制前）一次性把这批变化派发给回调。

[click] 声明式省样板。[click] 内建批处理。[click] 后台还能暂停，更省电。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# 旧范式 vs Observer

::left::

### scroll/resize 事件 + 轮询

<div class="flex flex-col gap-3 mt-3">
  <div class="signal signal-bad"><carbon:warning-alt /><span>你的 JS 在主线程高频跑</span></div>
  <div class="signal signal-bad"><carbon:warning-alt /><span>手动量位置，易 layout thrashing</span></div>
  <div class="signal signal-bad"><carbon:warning-alt /><span>自己写防抖 / 节流</span></div>
  <div class="signal signal-bad"><carbon:warning-alt /><span>后台标签页照常空转耗电</span></div>
</div>

::right::

### Observer：声明 + 异步 + 批处理

<div class="flex flex-col gap-3 mt-3">
  <div v-click class="signal signal-good"><carbon:checkmark-outline /><span>浏览器在渲染管线恰当时机驱动</span></div>
  <div v-click class="signal signal-good"><carbon:checkmark-outline /><span>布局算好，结果直接给你</span></div>
  <div v-click class="signal signal-good"><carbon:checkmark-outline /><span>同帧多次变化内建合成一批</span></div>
  <div v-click class="signal signal-good"><carbon:checkmark-outline /><span>一个观察器 observe 多目标，回调带 target</span></div>
</div>

<!--
把两种范式并排看。左边是旧世界：谁驱动？你的 JS。频率？每次滚动每个 tick。拿尺寸？自己 getBoundingClientRect，可能 thrashing。批处理？自己写防抖节流。后台？照常空转。

[click] 右边是观察器：浏览器驱动，只在关心的变化真的发生时回调；布局它内部算好直接给你；批处理是内建的；一个观察器能 observe 任意多元素，回调里用 target 区分来源。

核心心智一句话：观察器是声明式、异步、批处理的。剩下的交给浏览器。
-->

---
layout: default
---

# 五类 Observer 各司其职

<div class="obs-grid mt-6">
  <div v-click class="obs-card is-io">
    <code>IntersectionObserver</code>
    <strong>元素 ↔ root 交叉可见性</strong>
    <small>元素进视口了吗？可见几成？</small>
  </div>
  <div v-click class="obs-card is-resize">
    <code>ResizeObserver</code>
    <strong>单个元素的尺寸变化</strong>
    <small>这个容器变宽 / 变窄了吗？</small>
  </div>
  <div v-click class="obs-card is-mutation">
    <code>MutationObserver</code>
    <strong>DOM 结构 / 属性 / 文本</strong>
    <small>有人往列表里加删改节点了吗？</small>
  </div>
  <div v-click class="obs-card is-perf">
    <code>PerformanceObserver</code>
    <strong>性能条目 Timeline</strong>
    <small>有新的加载 / 绘制 / 长任务吗？</small>
  </div>
  <div v-click class="obs-card is-report">
    <code>ReportingObserver</code>
    <strong>报告（弃用 / 干预）</strong>
    <small>页面用了将废弃的 API 吗？</small>
  </div>
</div>

<div v-click class="mini-note mt-6 text-center">前三个是 <strong>DOM 观察器</strong>（观察页面元素），后两个观察 <strong>浏览器产生的信息流</strong>（性能数据、报告）；五者 API 形状高度一致——学会一个，其余触类旁通。</div>

<!--
五个成员，一个一个点出来。

[click] IntersectionObserver 观察元素和 root——视口或某个祖先——的交叉可见性。[click] ResizeObserver 观察单个元素的尺寸。[click] MutationObserver 观察 DOM 树的结构、属性、文本变化。[click] PerformanceObserver 观察浏览器产生的性能条目。[click] ReportingObserver 观察弃用、干预这类报告。

[click] 关键分野：前三个观察 DOM，后两个观察浏览器的信息流。但 API 形状高度一致，学一个会一串——这正是接下来两页要建立的通用骨架。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# 共同 API 形状与差异矩阵

::left::

```js {1-6|8|9|all}
// 骨架：五类观察器通用
const observer = new SomeObserver((records, obs) => {
  // records 是一批变化（数组），obs 是观察器自身
  for (const record of records) {
    // 处理单条变化……
  }
});
observer.observe(/* 目标或配置，因观察器而异 */);
observer.disconnect(); // 停止一切观察，释放引用
```

<div class="mini-note mt-3">回调统一 <code>(records, observer) =&gt; {}</code>，<code>records</code> 是<strong>一批</strong>——永远遍历，别只取第一个。</div>

::right::

<table class="matrix-table">
  <thead>
    <tr><th>观察器</th><th>配置在</th><th>unobserve</th><th>takeRecords</th></tr>
  </thead>
  <tbody>
    <tr><td><code>Intersection</code></td><td>构造</td><td class="yes">有</td><td class="yes">有</td></tr>
    <tr><td><code>Resize</code></td><td>observe</td><td class="yes">有</td><td class="no">无</td></tr>
    <tr><td><code>Mutation</code></td><td>observe</td><td class="no">无</td><td class="yes">有</td></tr>
    <tr><td><code>Performance</code></td><td>observe</td><td class="no">无</td><td class="yes">有</td></tr>
    <tr><td><code>Reporting</code></td><td>构造</td><td class="no">无</td><td class="yes">有</td></tr>
  </tbody>
</table>

<div class="mini-note mt-3"><code>disconnect</code> 五家都有；<strong>配置在构造</strong>的 IO / Reporting 构造后不可改，换配置＝新建。</div>

<!--
所有观察器都遵循同一套骨架：构造时传回调，observe 开始，disconnect 收工。回调签名统一是 records 加 observer，records 是一批变化的数组。

[click] observe 开始观察。[click] disconnect 停止一切、释放引用。

但四个方法的有无因观察器而异，右边这张矩阵是最该记住的结构差异。读出三条规律：配置放构造还是 observe——IO 和 Reporting 在构造函数、且构造后不可改，其余在 observe。unobserve 只有逐目标的 IO 和 Resize 有。takeRecords 四家都有、唯独 ResizeObserver 缺席。
-->

---
layout: default
---

# 回调时机总览：唯一需要死记的差异

| 观察器 | 回调时机 | 含义 |
| --- | --- | --- |
| `IntersectionObserver` | 交叉跨阈值后异步入队 | 批量去抖，不保证同步每帧 |
| `ResizeObserver` | **布局后、绘制前**（同帧） | 读到最新尺寸，改样式本帧生效 |
| `MutationObserver` | **微任务**（当前任务改完后） | 一个任务多次变化合一批 |
| `PerformanceObserver` | 条目产生后异步派发 | `buffered` 可补历史 |
| `ReportingObserver` | 报告产生后异步派发 | `buffered` 可补历史 |

<div class="grid grid-cols-3 gap-4 mt-6">
  <div v-click class="fact"><strong>Resize 绘制前</strong><span>能读最新尺寸，也最容易撞 loop 告警</span></div>
  <div v-click class="fact"><strong>Mutation 微任务</strong><span>连改 100 个节点只回调一次</span></div>
  <div v-click class="fact"><strong>buffered 补历史</strong><span>观察器注册晚也能追溯早期条目</span></div>
</div>

<!--
观察器都是异步回调，但异步到什么时机各不相同，这决定了你能不能在回调里安全地读写布局——是五类里唯一真正需要死记的差异。

IO 在交叉跨阈值后异步入队，批量去抖。ResizeObserver 在布局后、绘制前，同一帧内，能读到最新尺寸。MutationObserver 走微任务，当前任务 DOM 改完后。Performance 和 Reporting 在条目或报告产生后异步派发。

[click] 三个直接影响写法的推论：Resize 的绘制前时机是双刃剑，回调里改尺寸就会 loop。[click] Mutation 微任务批处理意味着连改百次只回调一次。[click] buffered 是 Performance 和 Reporting 的补历史开关。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# IntersectionObserver：构造与三个 option

::left::

```js {2|3|4|all}
const io = new IntersectionObserver(cb, {
  root: null,              // 参照框：null=视口，或传祖先元素
  rootMargin: "200px 0px", // 扩/缩 root 边界，正值提前触发
  threshold: [0, 0.5, 1],  // 交叉比例阈值，单值或数组
});
// 配置全在构造函数，且构造后不可改——换配置＝新建观察器
```

::right::

<div class="rule-stack">
  <div v-click class="rule tone-blue"><strong>root</strong><span>默认浏览器视口；或某个可滚动祖先（目标须是其后代）</span></div>
  <div v-click class="rule tone-amber"><strong>rootMargin</strong><span>仅 px / %；正值把触发线提前（预加载），负值推后</span></div>
  <div v-click class="rule tone-green"><strong>threshold</strong><span>比例 0~1，每跨一档回调一次；<code>[0,.25,.5,.75,1]</code> 多档采样</span></div>
</div>

<div v-click class="takeaway mt-4"><code>threshold</code> 是<strong>比例不是像素</strong>——「相交超 137px 才触发」得在回调里用 <code>intersectionRect</code> 自己算。</div>

<!--
IntersectionObserver 的全部行为由构造时的 options 决定，且构造后不可修改，想换阈值或 root 只能新建。

[click] root 是交叉判定的参照框，默认 null 就是视口，也可传一个可滚动的祖先——用于内部滚动容器，目标必须是它的后代。[click] rootMargin 用 CSS 边距语法，只接受 px 和百分比，正值外扩把触发线提前，这是预加载的关键。[click] threshold 是可见比例阈值，取值零到一，可以是单值或数组，每跨过一档就回调一次。

[click] 记住一个反直觉点：threshold 是比例不是像素，IO 天生做不了像素级判断，那类需求得自己用 intersectionRect 算。
-->

---
layout: default
---

# IntersectionObserverEntry：回调拿到什么

| 字段 | 含义 |
| --- | --- |
| `target` | 哪个被观察元素——多目标靠它区分 |
| `isIntersecting` | 进入(`true`) / 离开(`false`) 相交——懒加载主判据 |
| `intersectionRatio` | 交叉比例 `0`~`1`——曝光 / 可见度判断 |
| 三个矩形 | `boundingClientRect` 目标 · `intersectionRect` 相交区 · `rootBounds` root |
| `time` | 交叉发生的时间戳，用于精确排序 |

<div class="takeaway mt-5">90% 场景只用 <code>target</code> + <code>isIntersecting</code>，加 <code>intersectionRatio</code>（曝光）；三个矩形字段留给自算精确位置的高级场景。</div>

<!--
回调收到的每个 entry 描述一次交叉状态变化。target 指明哪个元素，多目标靠它区分。isIntersecting 是本次进入还是离开相交，懒加载和曝光的主判据。intersectionRatio 是当前交叉比例，等于相交区域面积除以目标面积，配多阈值做「可见 75% 才算曝光」这类判断。

后面三个是矩形字段：目标矩形、相交区域矩形、root 矩形。加一个时间戳。

实践中九成场景只用 target 加 isIntersecting，再加 intersectionRatio，其余矩形字段是自己算精确位置的高级场景才用。下一页就现场看这些字段随滚动怎么变。
-->

---
layout: default
class: lab-slide
---

# 交互实验：IntersectionObserver 实验室

<IntersectionObserverLab />

<!--
这是真实的 IntersectionObserver。右侧滚动容器就是观察器的 root，里面一列卡片是被观察的目标。观察器用了 0 到 1 共 21 档密集阈值，所以滚动时每张卡片的 intersectionRatio 会连续刷新，进度条实时反映可见比例，isIntersecting 徽标标出进 / 出。

现场演示：先滚动列表，看比例条随可见程度平滑变化、回调触发次数在真实累加。再切换左上角 threshold 命中阈值——0、0.5、1，它是「可见比例达到多少才算命中」的门槛，黄色竖线就是这条门槛，切换时高亮的绿卡集合立刻变化，这正是 threshold 的概念。

最后改 rootMargin 输入框，比如填 100px，观察器会被重建——因为 IO 构造后不可改，改配置只能新建——边缘卡片的 isIntersecting 会提前翻转。填个非法值会看到保留上一台观察器并提示非法。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# IO 场景：懒加载与无限滚动 sentinel

::left::

### 图片懒加载

```js {3|4-5|6|all}
const io = new IntersectionObserver((entries, obs) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue; // 只处理进入
    entry.target.src = entry.target.dataset.src;
    entry.target.removeAttribute("data-src");
    obs.unobserve(entry.target); // ⭐ 命中即停，去重
  }
}, { rootMargin: "200px 0px" }); // 提前 200px 预载
```

::right::

### 无限滚动（sentinel 哨兵）

```js {1|2-3|5|all}
const sentinel = document.querySelector("#sentinel");
const io = new IntersectionObserver(async ([entry]) => {
  if (!entry.isIntersecting || loading) return;
  loading = true;
  renderItems(await fetchPage(++page)); // 拉下一页
  loading = false;
}, { rootMargin: "400px 0px" }); // 提前触发
io.observe(sentinel);
```

<div class="edge-note col-span-2 mt-4"><carbon:warning-alt /><span>首屏排除、占位策略、优先级、与原生 loading="lazy" 的取舍等<strong>工程优化</strong>归优化章「懒加载和预加载」——本页只给通用实现机制。</span></div>

<!--
两个最经典的 IO 场景并排。

左边图片懒加载：真实地址存 data-src，元素接近视口时才赋给 src 触发加载。三个要点——rootMargin 正值预载、isIntersecting 分流只处理进入、命中后 unobserve 去重。

右边无限滚动：不要监听 scroll 去比 scrollTop，在列表末尾放一个空的哨兵元素观察它，进视口就加载下一页。这里只有一个哨兵所以可以直接解构 entries 第一个；loading 标志位防重复触发；rootMargin 提前量决定无缝体验。

严守边界：首屏是否排除懒加载、占位图策略、和原生 loading="lazy" 的取舍，这些工程优化口径归优化章「懒加载和预加载」，本页只负责讲清 IO 的实现机制。
-->

---
layout: default
---

# IO 场景：曝光埋点与收尾时机

```js {3|4-5|6|8|all}
const io = new IntersectionObserver((entries, obs) => {
  for (const entry of entries) {
    // 可见比例 ≥ 50% 才算「曝光」
    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
      report(entry.target.dataset.trackId); // 上报曝光
      obs.unobserve(entry.target); // ⭐ 一次曝光只报一次
    }
  }
}, { threshold: [0.5] }); // 只在跨过 50% 可见度时回调
```

<div class="grid grid-cols-3 gap-4 mt-5">
  <div v-click class="fact"><strong>unobserve</strong><span>一次性任务命中即停单个，其余继续</span></div>
  <div v-click class="fact"><strong>disconnect</strong><span>组件卸载停全部、断 DOM 引用（必做）</span></div>
  <div v-click class="fact"><strong>takeRecords</strong><span>disconnect 前同步捞走待派发记录防丢失</span></div>
</div>

<!--
曝光埋点：广告或卡片被用户真正看到才计一次曝光。用 threshold 设可见度门槛，这里 0.5，命中后 unobserve 去重，一次曝光只报一次。如果要求连续可见一秒才算，就在 isIntersecting 时启定时器、离开时清掉——IO 负责进出通知，停留时长自己计时。

[click] 三种收尾要分清：unobserve 停单个，一次性任务命中即用。[click] disconnect 停全部并断开 DOM 引用，组件卸载务必调用，否则观察器持有 DOM 引用泄漏。[click] takeRecords 在 disconnect 前同步取走还没派发的记录，避免最后一批丢失。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# IntersectionObserver v2：trackVisibility

::left::

```js {6|7|3|all}
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isVisible) reportGenuine(entry.target);
  }
}, {
  trackVisibility: true, // 真实可见性计算（较昂贵）
  delay: 100,            // 两次通知最小间隔，开时 ≥ 100
});
```

::right::

<div class="signal signal-bad"><carbon:warning-alt /><span>默认 <code>isIntersecting</code> 只算<strong>几何相交</strong>——被遮挡、opacity:0、transform 移出仍算相交，给广告作弊留空子</span></div>

<div v-click class="signal signal-good mt-3"><carbon:checkmark-outline /><span><code>isVisible</code> 为 true 才代表未被遮挡、未透明、未被 transform 隐藏的真实可见</span></div>

<div v-click class="mini-note mt-3">开销大且判断<strong>偏保守</strong>（浏览器不确定时返回 false），只在防遮挡 / 防作弊时开，普通懒加载不必；目前主要 Chromium 系落地。</div>

<!--
默认的 isIntersecting 和 intersectionRatio 只算几何交叉——元素在视口里，但它可能被别的元素遮挡、被 opacity 0 透明化、被 transform 移出可见范围，几何上仍然相交。这给广告可见性作弊留了空子。

IO v2 引入 trackVisibility 加 delay 加 entry.isVisible 来判断真实可见性。

[click] isVisible 为 true 才代表真实可见。[click] 但两条注意：trackVisibility 计算开销较大，规范要求配 delay 至少 100 毫秒限制频率，只在真需要防遮挡防作弊时开；而且 isVisible 判断偏保守，浏览器无法百分百确定时返回 false，别拿它做核心业务的唯一开关。目前主要在 Chromium 系落地。
-->

---
layout: default
---

# ResizeObserver：box 选项与读尺寸

<div class="grid grid-cols-[.9fr_1.1fr] gap-6 mt-4 items-start">

<div class="rule-stack">
  <div class="rule tone-blue"><strong>content-box（默认）</strong><span>内容区，不含 padding / border——多数布局判断</span></div>
  <div class="rule tone-green"><strong>border-box</strong><span>含 padding + border——关心占位总尺寸</span></div>
  <div class="rule tone-amber"><strong>device-pixel-content-box</strong><span>设备物理像素内容区——Canvas 高清渲染防糊</span></div>
</div>

```js {3|4|7|all}
const ro = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const box = entry.contentBoxSize[0]; // ⭐ 是数组，取 [0]
    applyLayout(entry.target, box.inlineSize); // 逻辑「宽」
  }
});
ro.observe(el, { box: "content-box" }); // 配置在每次 observe
```

</div>

<div class="mini-note mt-4">回调在<strong>布局后、绘制前</strong>（读到最新尺寸、改样式本帧生效）；<code>inlineSize</code>/<code>blockSize</code> 是<strong>逻辑尺寸</strong>随 writing-mode（竖排对调）；遗留 <code>contentRect</code> 是物理尺寸，仅老浏览器兜底。</div>

<!--
ResizeObserver 把回调放构造函数、配置放 observe，所以一个观察器能对不同元素用不同盒模型口径。

box 三个取值：content-box 默认，内容区不含 padding 和 border，多数布局判断用它。border-box 含 padding 加 border，关心占位总尺寸时用。device-pixel-content-box 是设备物理像素内容区，对 Canvas 尤其关键——它把 CSS 像素乘以 devicePixelRatio 后的真实物理像素给你，避免高分屏下 Canvas 模糊。

读尺寸首选 contentBoxSize，注意它是数组，为多列分片场景预留，当前取第 0 项。inlineSize 是逻辑宽、blockSize 是逻辑高，随 writing-mode——竖排会对调，国际化友好。旧的 contentRect 是物理尺寸，新代码别用，只在极老浏览器兜底才回落。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# ResizeObserver：loop 告警与规避

::left::

```js {4|all}
// ❌ 回调里改被观察元素尺寸 → 再观察 → 循环
const ro = new ResizeObserver((entries) => {
  for (const e of entries)
    e.target.style.width = `${e.contentBoxSize[0].inlineSize + 10}px`;
});
```

<div class="signal signal-bad mt-3"><carbon:warning-alt /><span><code>ResizeObserver loop completed with undelivered notifications</code>（旧版 loop limit exceeded）——多数无害，但刷屏并冒泡到全局 error 监控</span></div>

::right::

```js {1-2|4-6|all}
// ✅ 规避一：改尺寸推迟到下一帧，跳出当前循环
new ResizeObserver((es) => requestAnimationFrame(() => resize(es)));

// ✅ 规避二：幂等——记期望尺寸，相同就跳过
if (want.get(t) === current) continue; // 已是期望值
want.set(t, next);
```

<div v-click class="mini-note mt-3">心法：回调里<strong>别改被观察元素自身尺寸</strong>；非改不可就 <code>requestAnimationFrame</code> 延帧 + 幂等判断。</div>

<!--
在回调里修改被观察元素的尺寸，是最常见的翻车方式。左边这段改了宽度，下一轮又被观察到，无限循环。

浏览器为防真死循环设了单帧递归上限：一帧内观察-回调-再观察超过上限还没稳定，就把剩余通知推迟到下一帧，并在控制台报 loop completed with undelivered notifications，旧版 Chrome 文案是 loop limit exceeded。多数情况无害，视觉照常收敛，但它会刷屏控制台淹没真错误，还会冒泡到全局 error 监控造成误报噪声。

[click] 两种规避：把改尺寸推迟到下一帧的 requestAnimationFrame，跳出当前观察循环；或者记录期望尺寸，与本次相同就跳过，从根上断掉循环。[click] 心法就一句：回调里尽量别改被观察元素自身尺寸。
-->

---
layout: default
---

# MutationObserver：options、record 与微任务

<div class="grid grid-cols-[1.05fr_.95fr] gap-6 mt-4 items-start">

```js {2|3-4|5|6-7|all}
observer.observe(target, {
  childList: true,            // 直接子节点增删
  attributes: true,          // 属性变化
  characterData: true,       // 文本内容变化
  subtree: true,             // 扩到所有后代
  attributeFilter: ["class"],// 只看指定属性，省开销
  attributeOldValue: true,   // 记录属性旧值
});
```

<table class="matrix-table">
  <thead><tr><th>MutationRecord</th><th>含义</th></tr></thead>
  <tbody>
    <tr><td><code>type</code></td><td>childList / attributes / characterData</td></tr>
    <tr><td><code>target</code></td><td>变化发生的节点</td></tr>
    <tr><td><code>added·removedNodes</code></td><td>增 / 删的节点 NodeList</td></tr>
    <tr><td><code>prev·nextSibling</code></td><td>增删位置的兄弟节点</td></tr>
    <tr><td><code>attributeName</code></td><td>变化的属性名</td></tr>
    <tr><td><code>oldValue</code></td><td>旧值（需开对应 OldValue）</td></tr>
  </tbody>
</table>

</div>

<div class="edge-note mt-4"><carbon:warning-alt /><span><strong>微任务批处理</strong>：一个任务连改 100 次只回调一次；且<strong>不回放已有内容</strong>（与 IO/Resize 首帧回调相反）——现有元素得自己先扫一遍。</span></div>

<!--
MutationObserver 把观察什么完全交给 observe 的第二参数。childList 观察直接子节点增删，attributes 观察属性，characterData 观察文本，subtree 把上述观察扩到所有后代，attributeFilter 只看指定属性省开销，OldValue 系列记录旧值。

右边是 MutationRecord 的结构：type 是三种之一，target 是变化节点，childList 变化带 addedNodes、removedNodes 和前后兄弟，attributes 变化带 attributeName，配合开关带 oldValue。

底部两条时机机制决定用法：微任务批处理——一个任务连续改一百次 DOM 只回调一次，把这批变化攒起来在任务结束以一个微任务派发。以及不回放已有内容——observe 只报此后的变化，不会为已存在的 DOM 回调，这和 IO、Resize 的首帧立即回调相反，要处理现有元素得自己先扫一遍。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# MutationObserver：非法配置与自触发循环

::left::

<div class="signal signal-bad"><carbon:warning-alt /><span><code>observe</code> 什么都不传，或 <code>attributes:false</code> 配 <code>attributeOldValue:true</code> → <strong>TypeError</strong></span></div>

<div v-click class="signal signal-good mt-3"><carbon:checkmark-outline /><span>至少给 <code>childList</code>/<code>attributes</code>/<code>characterData</code> 之一；只写 <code>attributeFilter</code> 时 <code>attributes</code> 隐式为 true</span></div>

::right::

```js {2-4|6|all}
// ❌ 观察 subtree，回调里又插节点 → 新记录 → 再回调
new MutationObserver((list) => {
  for (const r of list)
    r.target.appendChild(document.createElement("span"));
});
// ✅ 破解：改前 disconnect → mutate → takeRecords 丢弃自造记录 → 重新 observe
```

<div v-click class="mini-note mt-3">破解还有：<strong>缩小观察范围</strong>（去 subtree / 加 attributeFilter）让改动落在范围外，或<strong>幂等判断</strong>先看是否已达目标状态。</div>

<!--
两类坑。第一类是非法配置：observe 什么观察项都不传是非法的，会抛 TypeError；自相矛盾的配置也会，比如 attributes 显式 false 却给了 attributeOldValue 或 attributeFilter。

[click] 好在有隐式默认兜底：至少给三类观察项之一为 true 就合法；而且只写 attributeFilter 或 attributeOldValue 时 attributes 自动视为 true。

右边是第二类坑，头号坑：自触发循环。回调里改 DOM，改动又落在观察范围内，就产生新记录再次触发回调，不收敛就是死循环。破解一是改 DOM 前临时 disconnect，改完 takeRecords 丢弃自己造成的记录再重新 observe。[click] 破解二是缩小观察范围让改动落在范围外，破解三是加幂等判断。
-->

---
layout: default
---

# 取代已废弃的 Mutation Events

| 维度 | Mutation Events（已废弃） | `MutationObserver` |
| --- | --- | --- |
| 触发 | **同步**，每次变化立刻打断当前脚本 | **异步**，微任务批处理 |
| 性能 | 差：高频变化反复中断、拖慢主线程 | 好：一批变化合成一次回调 |
| 粒度 | 每个事件一次 | 一次回调带一批 `MutationRecord` |
| 状态 | **已废弃**，不应再用 | 现行标准，Baseline |

<div class="grid grid-cols-3 gap-4 mt-5">
  <div v-click class="fact"><strong>监听第三方改 DOM</strong><span>富文本编辑器、注入脚本、微前端</span></div>
  <div v-click class="fact"><strong>等某节点出现</strong><span>替代 setInterval 轮询 querySelector</span></div>
  <div v-click class="fact"><strong>给动态元素补初始化</strong><span>subtree 观察 + 增量初始化</span></div>
</div>

<!--
MutationObserver 是为取代旧的 Mutation Events 而生——就是 DOMNodeInserted、DOMNodeRemoved、DOMAttrModified 这些。

对比很清楚：Mutation Events 同步触发，每次 DOM 变化立刻打断当前脚本，高频变化时反复中断拖慢主线程，每个事件一次，而且已经废弃。MutationObserver 异步微任务批处理，一批变化合成一次回调，性能好得多，是现行标准。结论明确：任何还在用 DOMNodeInserted 之类的老代码都应迁移。

[click] 三个典型用武之地：监听第三方或宿主对 DOM 的改动。[click] 等某节点出现，用观察替代 setInterval 轮询 querySelector，观察到即 resolve 一个 Promise。[click] 给 SPA 或第三方渲染插入的动态元素补初始化。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# PerformanceObserver：两种 observe

::left::

```js {1-2|4-5|7|all}
// 方式一：一次订阅多类（不能带 buffered）
po.observe({ entryTypes: ["paint", "resource"] });

// 方式二：单类 + buffered，补取注册前的历史条目
po.observe({ type: "largest-contentful-paint", buffered: true });

// 回调收 PerformanceObserverEntryList：getEntries() 等
```

::right::

<table class="matrix-table">
  <thead><tr><th>形态</th><th>补历史</th></tr></thead>
  <tbody>
    <tr><td><code>entryTypes</code>（多类）</td><td class="no">不支持 buffered</td></tr>
    <tr><td><code>type</code>（单类）</td><td class="yes">buffered 补历史</td></tr>
  </tbody>
</table>

<div class="mini-note mt-3"><code>entryTypes</code> 与 <code>type</code> <strong>互斥</strong>；<code>buffered</code>/<code>durationThreshold</code> 只配 <code>type</code>；<code>supportedEntryTypes</code> 先探测。</div>

<div class="edge-note mt-3"><carbon:warning-alt /><span>LCP/CLS/INP 等 Web Vitals <strong>指标解读</strong>归优化章「性能评估」——本页只讲 API 机制。</span></div>

<!--
PerformanceObserver 让你订阅感兴趣的性能条目类型，条目产生时异步收到回调，比一次性 getEntries 轮询更实时也不会错过。回调收到的是 PerformanceObserverEntryList，用 getEntries、getEntriesByType、getEntriesByName 取条目，注意它不是数组。

observe 有两种互斥形态。方式一 entryTypes 传数组，一次订阅多类，但不能带 buffered。方式二 type 传单类，可以配 buffered true 补取观察器注册前就已缓冲的同类条目。

三条硬规则：entryTypes 和 type 不能同时给；buffered 和 durationThreshold 只对 type 生效；observe 冷门类型前先用 supportedEntryTypes 探测。很多条目在脚本执行前就产生了，要拿这些早期条目，type 加 buffered 是唯一正确姿势。

严守边界：LCP、CLS、INP 这些 Web Vitals 指标的定义、阈值、优化归优化章「性能评估」，本页只讲 API。
-->

---
layout: default
---

# 有哪些 entryType（指标解读归优化章）

<table class="matrix-table mt-2">
  <thead><tr><th>entryType</th><th>大致内容</th><th>关联指标（解读见优化章）</th></tr></thead>
  <tbody>
    <tr><td><code>navigation</code></td><td>导航时序（DNS/TCP/DOM）</td><td>TTFB</td></tr>
    <tr><td><code>resource</code></td><td>资源加载时序</td><td>瀑布分析</td></tr>
    <tr><td><code>paint</code></td><td>首次绘制 FP、内容绘制 FCP</td><td>FCP</td></tr>
    <tr><td><code>largest-contentful-paint</code></td><td>最大内容绘制候选</td><td class="yes">LCP 来源</td></tr>
    <tr><td><code>layout-shift</code></td><td>布局偏移记录</td><td class="yes">CLS 来源</td></tr>
    <tr><td><code>first-input</code> / <code>event</code></td><td>输入 / 事件时序</td><td class="yes">INP / FID 来源</td></tr>
    <tr><td><code>longtask</code></td><td>≥ 50ms 长任务</td><td>主线程阻塞</td></tr>
  </tbody>
</table>

<div class="edge-note mt-2"><carbon:warning-alt /><span>指标 <strong>定义 / 阈值 / 优化归优化章「性能评估」</strong>，本页只讲「有哪些 entryType、怎么拿到条目」。</span></div>

<!--
supportedEntryTypes 会列出当前浏览器支持的类型。常见的一批过一遍：navigation 是本次页面导航的时序，DNS、TCP、请求、DOM 各阶段。resource 是每个资源的加载时序。paint 是首次绘制和首次内容绘制。largest-contentful-paint 是 LCP 的来源。layout-shift 是 CLS 的来源数据。first-input 和 event 是 INP、FID 的来源。longtask 是阻塞主线程超过 50 毫秒的长任务。

还有 mark 和 measure 是你自己用 performance.mark 和 measure 打的自定义点，配 PerformanceObserver 做业务耗时监控；以及 element、visibility-state 等。

再次严守边界：上表的 LCP、CLS、INP 只标注哪个 entryType 是它的来源，这些指标的定义、好坏阈值、如何优化属于优化章「性能评估」，本页到如何用 API 拿到条目为止。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[80px_1fr]
---

# ReportingObserver：弃用与干预报告

::left::

```js {1-2|4-5|6|8|all}
const ro = new ReportingObserver((reports) => {
  for (const r of reports) send({ type: r.type, url: r.url, body: r.body });
}, {
  types: ["deprecation", "intervention"], // 观察哪些报告
  buffered: true, // 补取创建前的报告
}); // ⭐ 配置在构造函数
ro.observe(); // 无参：开始收集
```

::right::

<div class="flex flex-col gap-2">
  <div v-click class="fact"><strong>type</strong><span>deprecation / intervention / crash / csp-violation…</span></div>
  <div v-click class="fact"><strong>url</strong><span>触发报告的页面</span></div>
  <div v-click class="fact"><strong>body</strong><span>类型专有细节：弃用 API 名、sourceFile、行列号</span></div>
</div>

<div v-click class="mini-note mt-3">价值＝把开发期才看得到的<strong>控制台弃用 / 干预警告</strong>，变成生产环境可采集的结构化数据，为技术债清理排优先级。</div>

<!--
浏览器平时把「你用了将废弃的 API」「出于性能安全我否决了这个操作」这类信息打到控制台警告里——散落、抓不住、上不了报。ReportingObserver 把它们变成结构化、可订阅、可上报的报告流。

注意两个特殊点：配置在构造函数里给，types 指定观察哪些报告类型，buffered 补历史；而 observe 是无参的，因为配置已经在构造函数给过了。

[click] Report 有三个字段：type 是报告类型，常见有 deprecation 弃用、intervention 干预、crash 崩溃、csp-violation 策略违规。[click] url 是触发页面。[click] body 是类型专有细节，比如弃用的 API 名、源文件、行列号。

[click] 它的价值在于把开发期才看得到的控制台警告，变成生产环境可采集的数据：线上多少真实用户命中了弃用 API、哪些浏览器触发了干预，一目了然。
-->

---
layout: default
---

# 五类观察器横向对比

| 观察器 | 观察对象 | 回调时机 | 典型场景 |
| --- | --- | --- | --- |
| `IntersectionObserver` | 元素 ↔ root 交叉可见性 | 交叉跨阈值异步 | 懒加载 · 无限滚动 · 曝光 |
| `ResizeObserver` | 元素尺寸 | **布局后绘制前** | 容器查询式响应式 · Canvas 重绘 |
| `MutationObserver` | DOM 结构/属性/文本 | **微任务** | 监听第三方改 DOM · 等元素出现 |
| `PerformanceObserver` | 性能条目 | 条目产生后异步 | 性能监控 · 长任务 · 自定义耗时 |
| `ReportingObserver` | 报告（弃用/干预） | 报告产生后异步 | 弃用/干预上报 · 策略违规采集 |

<div class="grid grid-cols-3 gap-4 mt-5">
  <div v-click class="fact"><strong>前三观 DOM</strong><span>后两观浏览器信息流，API 形状一致</span></div>
  <div v-click class="fact"><strong>时机是最大差异</strong><span>Resize 绘制前、Mutation 微任务、其余队列异步</span></div>
  <div v-click class="fact"><strong>buffered 补历史</strong><span>Performance / Reporting 追溯早期条目</span></div>
</div>

<!--
把五个观察器放到一张表里收束。观察对象、回调时机、典型场景一栏看清：IO 观察交叉可见性、跨阈值异步，用于懒加载无限滚动曝光。Resize 观察尺寸、布局后绘制前，用于容器查询式响应式和 Canvas 重绘。Mutation 观察 DOM、微任务，用于监听第三方改 DOM 和等元素出现。Performance 观察性能条目。Reporting 观察报告。

[click] 三点收束：前三个观察 DOM、后两个观察浏览器信息流，但 API 形状一致，学一个会一串。[click] 回调时机是最大差异——Resize 在绘制前也最容易 loop，Mutation 在微任务批处理，其余走队列异步。[click] buffered 是 Performance 和 Reporting 的补历史开关。
-->

---
layout: center
class: summary-slide
---

# 带走五条铁律

<div class="summary-grid mt-6">
  <div><span>01</span><strong>别当同步 API</strong><small>结果在回调里拿，且永远遍历一批 records</small></div>
  <div><span>02</span><strong>IO 三判据</strong><small>命中即 unobserve，threshold 是比例不是像素，构造后不可改</small></div>
  <div><span>03</span><strong>Resize 读法</strong><small>取 contentBoxSize[0].inlineSize，回调别改自身尺寸（loop）</small></div>
  <div><span>04</span><strong>Mutation 约束</strong><small>至少给一类观察项，微任务批处理，警惕自触发循环</small></div>
  <div><span>05</span><strong>卸载必 disconnect</strong><small>否则观察器持 DOM 引用泄漏</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API" target="_blank"><carbon:book /> MDN Intersection</a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank"><carbon:document /> Resize · Mutation</a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver" target="_blank"><carbon:rocket /> Performance · Reporting</a>
</div>

<!--
五条铁律收尾。一，别把观察器当同步 API，结果都在回调里拿，而且回调是批处理的，永远遍历一批 records，别只取第一个。二，IntersectionObserver 三个判据：一次性任务命中即 unobserve 去重，threshold 是比例不是像素，配置构造后不可改。三，ResizeObserver 读 contentBoxSize 第 0 项的 inlineSize，回调里别改被观察元素自身尺寸否则 loop。四，MutationObserver 至少给一类观察项否则 TypeError，微任务批处理，警惕自触发循环。五，最通用的一条——组件卸载务必 disconnect，否则观察器持有 DOM 引用造成泄漏。

掌握这五条，凡是在轮询 DOM、尺寸、可见性，或高频监听 scroll、resize 的地方，几乎都该换成对应的 Observer——更快、更省电、更少样板。
-->
