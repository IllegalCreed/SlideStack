---
theme: seriph
layout: cover
title: View Transitions API
info: |
  只改 DOM，浏览器为「更新前后的视觉状态」抓快照并自动补间——把跨状态、跨页面的转场从「手写每一帧中间态」降为「声明式一句话 + 少量 CSS」。

  Learn more at [MDN View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark">VT</div>

# View Transitions

## 只改 DOM，浏览器自动补间「前后两态」

<div class="cover-meta">
  <span>W3C CSS View Transitions L1/2</span>
  <span>快照 · 伪元素树 · 命名形变 · SPA / MPA</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API" target="_blank" class="slidev-icon-btn" aria-label="MDN 文档">
    <carbon:document />
  </a>
  <a href="https://github.com/WICG/view-transitions" target="_blank" class="slidev-icon-btn" aria-label="WICG/view-transitions GitHub">
    <carbon:logo-github />
  </a>
</div>

<!--
这不是一份 CSS 属性清单。View Transitions 的心智模型只有一句：抓旧状态快照 → 更新 DOM（此间渲染被抑制）→ 抓新状态快照 → 在一棵伪元素树上补间。

同一套机制覆盖两种场景：同文档 SPA 用 JavaScript 的 startViewTransition 触发，跨文档 MPA 用一行 CSS 的 @view-transition 在同源导航时自动触发。中间会有一页真实可交互的实验室，现场点按钮看浏览器怎么补间。

支持面口径先交底：同文档核心 2025 年 10 月已进 Baseline，三大引擎齐全；而 types 与跨文档转场唯一缺口是 Firefox，Chrome 与 Safari 都已支持——别再用「仅 Chromium」的旧说法。
-->

---
layout: default
---

# 定位：浏览器补间前后态，你不再手写中间帧

<div class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>旧法做「缩略图飞成详情大图」：读起止坐标 → 算差值 → <strong>transform</strong> 反向偏移 → 触发归位 → 清理临时样式……几十行胶水，响应式下极易算错</span>
</div>

<div class="pipeline mt-6">
  <div class="pipeline-step tone-blue">
    <span class="step-no">01</span>
    <strong>抓旧快照</strong>
    <span>调用 startViewTransition，为当前带 name 的元素拍照</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-amber">
    <span class="step-no">02</span>
    <strong>更新 DOM</strong>
    <span>运行回调，此间渲染被抑制、看不到中间态</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-green">
    <span class="step-no">03</span>
    <strong>抓新快照 + 补间</strong>
    <span>建 <code>::view-transition</code> 伪元素树，自动补间</span>
  </div>
</div>

<div v-click class="takeaway mt-6">你永远只写「最终状态」，从不写「第 30% 帧长什么样」——那是浏览器的活。这也是它叫 transition（前后两态之间）而非 animation 的原因。</div>

<!--
动态位置飞行动画的痛，做过的人都懂：读旧元素的盒、读新元素的盒、算差、用 transform 把新元素反向贴回旧位、再触发归位、动画完清理——几十行且脆。

View Transitions 把它反过来：你只管把 DOM 从旧改到新，浏览器在你改之前抓旧快照、改之后抓新快照，中间自动补间。

[click] 关键推论是「改 DOM」与「动画」彻底解耦。你写的永远是终态，中间帧交给浏览器，这正是 transition 与 animation 的分界。
-->

---
layout: default
---

# 三足分工：和 CSS 过渡、JS 动画库各管一段

<table class="decision-table mt-4">
  <thead><tr><th>你要做的事</th><th>用什么</th><th>为什么</th></tr></thead>
  <tbody>
    <tr v-click>
      <td><strong>状态切换 / 页面导航</strong>的跨态转场（列表↔详情、Tab、路由）</td>
      <td><strong>View Transitions</strong></td>
      <td>专长「前后两态」快照补间，尤擅位置尺寸形变</td>
    </tr>
    <tr v-click>
      <td>元素<strong>自身属性</strong>的入场 / 悬停 / 展开 / 渐变</td>
      <td>CSS <code>transition</code> / <code>@keyframes</code></td>
      <td>单元素属性变化，无需「前后配对」，原生更轻</td>
    </tr>
    <tr v-click>
      <td><strong>持续、可编排、交互驱动</strong>：时间线 / 手势 / 物理 / 循环</td>
      <td>JS 动画库（WAAPI / GSAP / Framer Motion）</td>
      <td>VT 没有时间线编排 / 手势跟随 / 物理，也不循环</td>
    </tr>
  </tbody>
</table>

<div v-click class="takeaway mt-6">三者<strong>可叠加不是替代</strong>：用 View Transitions 搭路由转场骨架，在 <code>transition.ready</code> 后用 WAAPI 给某个伪元素加一段 <code>clip-path</code> 圆形揭示，是常见组合。</div>

<!--
View Transitions 常被误当成动画库或 CSS 过渡的替代。其实三足鼎立、各管一段。

[click] 跨态转场——列表进详情、Tab 切换、路由跳转——是它的主场，尤其擅长形变。
[click] 单个元素自身属性的入场、悬停、展开，是 CSS transition 与 keyframes 的活，无需前后配对，更轻。
[click] 而时间线编排、手势跟随、物理弹簧、循环动画，仍归 JS 动画库。

[click] 三者可叠加：VT 搭骨架，WAAPI 在 ready 之后接管某个伪元素做精细揭示。本叶只在衔接点提这些库，不展开任何一个。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# startViewTransition 一分钟：两种场景一套心智

::left::

### 同文档（SPA）：JS 包一层回调

```js {1-2|4|6|all}
function showDetail(data) {
  const update = () => renderInto("#app", data); // 只改 DOM

  // 不支持就直接更新——渐进增强的标准起手式
  if (!document.startViewTransition) return update();
  document.startViewTransition(update); // 返回 ViewTransition
}
```

::right::

### 跨文档（MPA）：一行 CSS，零 JS

```css
/* 两侧同源页面都写，导航时自动过渡 */
@view-transition {
  navigation: auto;
}
```

<div v-click class="mini-note mt-4">同一套心智：SPA 用 JS 包回调、MPA 用 CSS 开关；不支持的浏览器直接忽略 <code>@view-transition</code> → 退化为普通硬切，不报错不白屏。</div>

<!--
同文档场景，入口只有一个方法：把「改 DOM」这步包进 startViewTransition，它返回一个 ViewTransition 对象。

[click] 回调里只做纯粹的 DOM 变更。
[click] 前面加一句特性检测：不支持就直接更新，这是渐进增强的标准起手式。
[click] 支持就包一层，浏览器负责补间。

右边跨文档几乎零 JS：源页和目标页都声明 @view-transition，同源导航时自动抓两侧快照过渡。

[click] 两种场景共享同一棵伪元素树与命名规则，学一次两处通用；不支持时浏览器直接忽略这条规则，天然降级。
-->

---
layout: default
class: lab-slide
---

# 交互实验：View Transitions 实验室

<ViewTransitionsLab />

<!--
这是真实的 document.startViewTransition。右侧每张卡片都带一个稳定唯一的 view-transition-name，所以重排、增删、展开时，浏览器会自动为它们补间——位置变化就「飞」过去，尺寸变化就平滑长大。

现场演示三条：先点「打乱顺序」，看卡片飞到新位置，左下「本次状态」从 running 走到 finished，这是真实的 transition.finished 在 resolve；再点「增 / 删元素」，删的淡出、增的淡入；点「展开 / 收起」，首张卡片尺寸形变。

注意一个细节：整页的 root 组也在过渡，但因为卡片各有自己的 name、被从 root 快照里「拎」了出去，root 的旧新快照几乎一致，交叉淡入淡出看不出变化，所以只有卡片在动，页面其余静止——这正是「命名主角」的干净效果。

最后勾上「强制降级」，再点按钮，走的就是特性检测的直更路径：DOM 照样更新，但没有动画，状态标成「降级」。这演示了渐进增强的两条分支。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# ViewTransition 对象：三个 Promise + 一个方法

::left::

```js {1|3|4|5|7-8|all}
const t = document.startViewTransition(update);

t.updateCallbackDone.then(() => {}); // DOM 已更新
t.ready.then(() => {}).catch(() => {}); // 树就绪 · 会 reject
t.finished.then(() => {}); // 动画结束 · 可交互

// 连点 / 减弱动效：跳动画但仍更新 DOM
t.skipTransition();
```

::right::

<table class="decision-table">
  <thead><tr><th>成员</th><th>resolve / 行为时机</th></tr></thead>
  <tbody>
    <tr><td><code>updateCallbackDone</code></td><td>回调完成 = DOM 已更新</td></tr>
    <tr><td><code>ready</code></td><td>树就绪、动画将开始（<strong>会 reject</strong>）</td></tr>
    <tr><td><code>finished</code></td><td>动画结束、新视图可交互</td></tr>
    <tr><td><code>skipTransition()</code></td><td>跳动画，DOM 仍更新</td></tr>
  </tbody>
</table>

<div v-click class="mini-note mt-4">时序固定：<code>updateCallbackDone</code> → <code>ready</code> → <code>finished</code>。<code>ready</code> 是唯一会 reject 的那个（撞名 / 不可见），自定义动画挂它上面记得配 <code>.catch</code>。</div>

<!--
startViewTransition 立即返回的 ViewTransition 对象，是你观测与干预这次过渡的全部把手。

[click] updateCallbackDone：回调完成、DOM 已更新的信号。
[click] ready：伪元素树建好、动画将开始，这是用 Web Animations API 接管伪元素的黄金时机；它也是唯一会 reject 的。
[click] finished：动画结束、新视图可交互，用来清理临时命名或埋点。
[click] skipTransition 跳动画但不跳 DOM 更新，连点或减弱动效时即时收敛。

[click] 三个 Promise 时序固定。记住 ready 会 reject——撞名、页面不可见都会让它拒绝，而 finished 只要 DOM 更新成功仍会 resolve。挂在 ready 上的 WAAPI 动画一定要配 catch 兜底。
-->

---
layout: default
---

# `::view-transition` 伪元素树：五层结构

<div class="vt-tree mt-5">
  <div class="vt-tree__row lv0 tone-blue"><code>::view-transition</code><span>根覆盖层 · 浮在页面之上 · 全视口</span></div>
  <div v-click class="vt-tree__row lv1 tone-amber"><code>::view-transition-group(name)</code><span>每组一个 · <strong>位置尺寸形变补间在此</strong></span></div>
  <div v-click class="vt-tree__row lv2"><code>::view-transition-image-pair(name)</code><span>配对容器 · <code>isolation: isolate</code></span></div>
  <div v-click class="vt-tree__row lv3 tone-green"><code>::view-transition-old(name)</code><span>旧态：更新前的<strong>静态位图</strong></span></div>
  <div v-click class="vt-tree__row lv3 tone-green"><code>::view-transition-new(name)</code><span>新态：新 DOM 的<strong>实时</strong>表示</span></div>
</div>

<div v-click class="mini-note mt-5"><code>name</code> = 元素的 <code>view-transition-name</code>；默认整页那组叫 <code>root</code>。<code>::view-transition-group(*)</code> 通配命中所有组；<code>old</code>/<code>new</code> 都以「被替换内容」（类似 <code>&lt;img&gt;</code>）渲染，可用 <code>object-fit</code> 控制填充。</div>

<!--
过渡进行时，浏览器在 root 上生成一棵临时伪元素树，浮在页面之上、覆盖全视口。所有 CSS 定制都作用在它身上。

[click] group 是形变动画发生的层——位置、尺寸补间加在这里，想统一调某组时长就选它。
[click] image-pair 是装 old 与 new 的容器，默认 isolation isolate 以便 mix-blend-mode 生效，做自定义 clip 时常改回 auto。
[click] old 是更新前的静态位图。
[click] new 是新 DOM 的实时表示，内容会随新 DOM 继续变。

[click] name 就是元素的 view-transition-name，默认整页那组叫 root。星号通配一次命中所有组。old 和 new 都像 img 一样是被替换内容，宽高比变化时用 object-fit 防拉伸。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 默认动画：交叉淡入淡出 + 形变，零配置也有

::left::

```css
/* 浏览器 UA 内置：根元素默认参与，名叫 root */
:root {
  view-transition-name: root;
}
```

<div class="rule-stack mt-4">
  <div class="rule tone-blue"><strong>交叉淡入淡出</strong><span><code>old</code> 从 <code>opacity:1→0</code>，<code>new</code> 从 <code>0→1</code></span></div>
  <div v-click class="rule tone-green"><strong>形变补间</strong><span><code>group</code> 对 <code>transform</code> + <code>width</code>/<code>height</code> 平滑补间</span></div>
</div>

::right::

<div class="signal signal-bad">
  <carbon:warning-alt />
  <span>不命名任何元素时，<code>:root</code> 默认承担整页交叉淡入淡出——大面积内容跳变时观感<strong>全屏闪</strong></span>
</div>

<div v-click class="takeaway mt-5">对策：把真正要动的元素<strong>单独命名成组</strong>，再给 <code>::view-transition-old(root)</code> / <code>new(root)</code> 收敛或关掉默认动画。</div>

<!--
即使你没给任何元素写 view-transition-name，一次 startViewTransition 也有可见转场——因为 UA 样式表里有一条 root 规则，让根元素默认参与、名叫 root。

于是默认永远至少有一组 root。它的两条默认动画：old 淡出、new 淡入；
[click] 同名元素位置尺寸不同时，group 自动对 transform 和宽高做形变补间，这就是「元素飞过去加缩放」的来源。

右边是它的代价：大面积内容跳变时，那一整组 root 的交叉淡入淡出会显得突兀，像全屏闪。
[click] 对策是把真正要动的元素单独命名成组，把它们从 root 里拎出去，再给 root 收敛动画。这正是命名的用武之地。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# `view-transition-name`：配对钥匙 + 唯一性

::left::

```css {1-2|4-5|all}
/* 详情大图与列表缩略图同名 → 当「同一物」补间 */
.thumb, .detail-hero { view-transition-name: hero; }

/* 列表别都叫 card！用 match-element 自动派发唯一名 */
.card { view-transition-name: match-element; } /* FF144 */
```

::right::

<div class="signal signal-bad">
  <carbon:warning-alt />
  <span>同一时刻两个渲染中的元素<strong>撞同名</strong> → <code>ready</code> reject、整过渡被<strong>跳过</strong>（不是凑合，是彻底不 animate）</span>
</div>

<div class="grid grid-cols-2 gap-3 mt-4">
  <div v-click class="fact"><strong>手动拼 id</strong><span><code>card-42</code>：把唯一标识拼进 name</span></div>
  <div v-click class="fact"><strong><code>match-element</code></strong><span>浏览器按元素身份自动派唯一名</span></div>
</div>

<div v-click class="mini-note mt-4"><code>none</code>（默认）= 不单独成组；JS 动态命名用完复位 <code>"none"</code>，防 bfcache 恢复时撞名。</div>

<!--
view-transition-name 做两件事：让元素从整页快照里独立出来单独成组，以及作为新旧两态的配对钥匙。左边给缩略图和详情大图同一个名，浏览器就把它俩当同一张图，自动补间位置与尺寸，你一行坐标都不用算。

[click] 但列表元素千万别都叫 card。
右边是硬约束：同一时刻两个渲染中的元素撞同名，ready 直接 reject、整个过渡被跳过——DOM 照常更新，但没有任何动画。

[click] 两条解法：手动把唯一 id 拼进名字，
[click] 或更省事的 match-element，让浏览器按元素身份自动派发唯一名，特别适合动态列表，已随 Firefox 144 进 Baseline。

[click] none 是默认值、不单独成组；JS 临时命名用完记得复位 none，尤其跨文档要防 bfcache 撞名。
-->

---
layout: default
---

# `view-transition-class`：一条规则批量样式化多组

```css {1-5|7-8|all}
/* 每张卡片仍需各自唯一的 name，再共享一个 class */
.card {
  view-transition-name: match-element;
  view-transition-class: card; /* 共享类 · 不要求唯一 · FF144 */
}

/* 用 .类名 命中所有带该 class 的组 —— 一条规则搞定一批 */
::view-transition-group(.card) { animation-duration: 0.3s; }
```

<div class="grid grid-cols-3 gap-4 mt-5">
  <div v-click class="fact"><strong>不要求唯一</strong><span>多个元素可共享同一个 class</span></div>
  <div v-click class="fact"><strong>不额外成组</strong><span>成组仍取决于元素自己的 <code>name</code></span></div>
  <div v-click class="fact"><strong>选择器带 <code>.</code></strong><span><code>(.card)</code> 命中类；<code>(card)</code> 命中名</span></div>
</div>

<div v-click class="mini-note mt-4">别混：<code>::view-transition-group(.card)</code>（有点）命中所有带 <code>card</code> 类的组；<code>::view-transition-group(card)</code>（无点）命中<strong>名叫</strong> <code>card</code> 的那一个组。</div>

<!--
命名解决配对，但如果一堆快照要共享同一段动画样式，逐个写 group(card-1)、group(card-2) 太啰嗦。view-transition-class 就是为此而生的样式钩子，已随 Firefox 144 进 Baseline。

注意上例里 match-element 不能省——class 只是样式钩子，元素能否成组仍取决于它有没有自己的 name。

[click] 三个关键区别，和 name 对照记：
[click] class 不要求唯一，多个元素可共享，这正是它的意义；
[click] 它不让元素单独成组；
[click] 选择器用点前缀。

[click] 最容易混的一点：有点的 .card 命中所有带 card 类的组；无点的 card 命中名叫 card 的那一个组。二者完全不同。
-->

---
layout: default
---

# 自定义 old/new 动画：覆盖默认淡入淡出

````md magic-move {at:1}
```css
/* 先备好关键帧：旧图上滑离场、新图从下滑入 */
@keyframes slide-out-up { to { transform: translateY(-100%); } }
@keyframes slide-in-up { from { transform: translateY(100%); } }
```

```css
/* 写在 old/new 上 = 出/入场外观；both 填充避免首尾回弹 */
::view-transition-old(root) { animation: 0.4s ease-in both slide-out-up; }
::view-transition-new(root) { animation: 0.4s ease-in both slide-in-up; }
```

```css
/* 想用 WAAPI 完全接管：先清场 UA 的动画与混合 */
::view-transition-image-pair(root) { isolation: auto; }
::view-transition-old(root),
::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
```
````

<div class="takeaway mt-6">写在 <code>old</code>/<code>new</code> 上覆盖「出场 / 入场」外观；写在 <code>group</code> 上调「整组节奏」（时长 / 缓动 / 延迟）与形变。<code>both</code> 填充几乎必带。</div>

<!--
默认的交叉淡入淡出，通过覆盖 old 和 new 的 animation 就能替换。

先备好两个关键帧：旧图上滑离场、新图从下滑入。

[click] 然后把 animation 写在 old 和 new 上，这覆盖的是出场入场外观。both 填充模式几乎必带，否则动画首尾帧会回弹。

[click] 如果想用 Web Animations API 完全接管，比如做 clip-path 圆形揭示，先在 CSS 里清场：把 image-pair 的 isolation 改回 auto，把 old new 的 UA 动画与混合关掉，再在 ready 之后用 JS animate。

记住这条分工：写在 old new 上是外观，写在 group 上是整组节奏与形变。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 形变补间与多元素独立过渡

::left::

### 形变：位置尺寸自动动

```css
/* 只需两处同名，浏览器自动把「小图」补到「大图」 */
.thumb, .detail-hero { view-transition-name: hero; }

/* 内容一致时：留形变、去交叉淡入淡出，更干净 */
::view-transition-old(hero),
::view-transition-new(hero) { animation: none; }
```

::right::

### 多元素：各自成组、并行播

```css
/* 三个名 → 三组，并行、互不干扰 */
header   { view-transition-name: site-header; }
h1.title { view-transition-name: page-title; }
.hero    { view-transition-name: hero; }

/* 通配给统一基调，个别组再覆盖 */
::view-transition-group(*) { animation-duration: 0.35s; }
```

<!--
本 API 最省事的能力：同名元素在新旧两态的位置尺寸差异，group 会自动补间，你一行坐标不用算。左边点第三张缩略图进详情，旧态是小矩形、新态是大图，group 自动把 transform 和宽高从小平滑补到大，观感是缩略图飞出来放大。响应式下也不会算错，因为浏览器读的是真实布局盒。

如果内容其实是同一张图，交叉淡入淡出反而发虚，就把 old new 的 animation 关掉，只留 group 的形变。

右边是多元素独立：给不同元素起不同名，它们各自成组、各自定制、并行播放，互不干扰——header 横向收放、标题延迟淡入、主图形变可以同时跑。最后用星号通配给所有组一个统一基调，个别组再单独覆盖。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 同文档 SPA：把「改 DOM」包进过渡

::left::

### 能跑，但回调里塞了网络

```js {3|all}
async function navigate(url) {
  const render = async () => {
    const html = await loadRouteHTML(url); // ⚠️ 卡
    document.querySelector("#app").innerHTML = html;
  };
  if (!document.startViewTransition) return render();
  document.startViewTransition(render);
}
```

::right::

### 更稳：数据先取好再进过渡

```js {2-3|all}
async function navigate(url) {
  const data = await loadRoute(url); // 网络在过渡外
  const render = () => renderInto("#app", data); // 只改 DOM
  if (!document.startViewTransition) return render();
  document.startViewTransition(render);
}
```

<div v-click class="signal signal-good mt-3">
  <carbon:checkmark-outline />
  <span><code>updateCallback</code> 是<strong>渲染抑制窗口</strong>——里面 <code>await fetch</code> 会把整页「冻」在旧态；数据准备一律挪到过渡外</span>
</div>

<!--
单页应用里，导航其实就是 JS 改 DOM。把改 DOM 这步包进 startViewTransition 即可。

左边这版能跑，但有个隐患：render 回调里 await 了 loadRouteHTML。
[click] 而 updateCallback 是渲染抑制窗口，里面 await 网络会把整页冻在旧态直到请求回来，观感是卡顿。

[click] 右边是更稳的写法：先在过渡外把数据取好，
[click] 回调里只做同步的纯 DOM 变更，快进快出。

[click] 记牢这条纪律：回调是渲染抑制窗口，数据准备、路由数据拉取都要放在 startViewTransition 之前。
-->

---
layout: default
---

# 跨文档 MPA：`@view-transition` 自动触发

```css {1-2|4-5|all}
/* 两侧同源页面都写，导航时自动整页交叉淡入淡出 */
@view-transition { navigation: auto; } /* none 可关闭 */

/* 两侧对应元素同名 → 跨文档也能形变补间（如头像飞到详情） */
.avatar { view-transition-name: avatar; }
```

<div v-click class="signal signal-good mt-5">
  <carbon:checkmark-outline />
  <span>降级无痛：不支持的浏览器<strong>直接忽略</strong> <code>@view-transition</code> → 退化为普通硬切，不报错不白屏，是「零成本降级」的典范</span>
</div>

<div v-click class="takeaway mt-5">支持面：<code>@view-transition</code> 在 <strong>Chrome 126+ 与 Safari 18.2+</strong> 可用，<strong>唯一缺口是 Firefox</strong>——Safari 早已跟上，别再说「仅 Chromium」；只要 FF 没补齐，它就非 Baseline，生产用要渐进增强。</div>

<!--
多页应用每次导航是真正的文档切换，却几乎零 JS：源页与目标页都声明 @view-transition，浏览器在同源导航时自动抓两侧文档快照并过渡。navigation auto 是开、none 是关。

[click] 要让同一元素跨页面形变，比如列表头像飞到详情页头像，给两侧对应元素同名即可。

[click] 它的降级是零成本典范：不支持的浏览器直接忽略这条规则，退化为普通硬切，不报错不白屏。

[click] 支持面务必分清：Chrome 126 加、Safari 18.2 加都支持，唯一缺口是 Firefox。这和旧资料常说的「仅 Chromium」不同，Safari 早跟上了。但只要 Firefox 没补齐，跨文档就不是 Baseline，生产必须渐进增强。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# view transition types：一次过渡，分场景样式

::left::

```js {1-2|4-7|all}
// ① SPA：选项对象带 types
document.startViewTransition({ update, types: ["forward"] });

// ③ 运行时增删（set-like：add / delete / has）
const t = document.startViewTransition(update);
t.types.add("forward");
t.types.delete("backward");
```

::right::

```css
/* ② MPA 描述符 + 按类型分流样式 */
@view-transition { navigation: auto; types: slide; }

:active-view-transition-type(forward) {
  &::view-transition-new(root) { animation-name: from-right; }
}
```

<div v-click class="signal signal-bad mt-3">
  <carbon:warning-alt />
  <span>types 缺 <strong>Firefox 144</strong>（Chrome 125+ / Safari 18+ 有）→ 渐进增强，FF 落到无类型默认动画</span>
</div>

<!--
同一个转场，前进和后退往往想要相反的方向。view transition types 给一次过渡贴上类型标签，让 CSS 按类型分流。

设置有三条路：
[click] SPA 用选项对象传 types 字段；运行时也能改，ViewTransition.types 是 set-like，可以 add、delete、has。
[click] MPA 用 at-rule 的 types 描述符。然后用 active-view-transition-type 按类型写样式，前进从右滑入、后退从左滑入，同一套 DOM 方向相反。

另有无参的 active-view-transition，匹配任意过渡进行中的根元素，它已随同文档核心进 Baseline。

[click] 但 types 相关能力缺 Firefox 144 初版，Chrome 125 和 Safari 18 都有，短板同样只在 Firefox——依赖它必须渐进增强，Firefox 上落到无类型的默认动画。
-->

---
layout: default
---

# 跨文档的 JS 定制点：`pageswap` / `pagereveal`

<div class="grid grid-cols-2 gap-4 mt-4">
  <div class="fact"><strong><code>pageswap</code></strong>（<code>PageSwapEvent</code>）<span>旧页<strong>离开前</strong>触发；<code>e.viewTransition</code> + <code>e.activation</code>——给<strong>离场</strong>元素打标</span></div>
  <div class="fact"><strong><code>pagereveal</code></strong>（<code>PageRevealEvent</code>）<span>新页<strong>首次渲染时</strong>触发；<code>e.viewTransition</code>——给<strong>入场</strong>元素打标</span></div>
</div>

```js {2-3|4|5-6|all}
// 打标 + 抓完即复位（跨文档固定套路）
window.addEventListener("pageswap", async (e) => {
  if (!e.viewTransition) return; // 不支持 / 未触发过渡
  el.style.viewTransitionName = "avatar"; // 临时打标
  await e.viewTransition.finished; // 快照抓完
  el.style.viewTransitionName = "none"; // 复位，防 bfcache 撞名
});
```

<!--
跨文档转场里没有一个 JS 回调，取而代之的是两侧各一个事件。

pageswap 在旧页即将卸载前、在旧页触发，用来给离场元素打标；它的 activation 还带导航来源和目标信息。pagereveal 在新页首次渲染时、在新页触发，用来给入场元素打标。

[click] 下面是固定套路：在事件里用 JS 临时给元素设 view-transition-name，
[click] await viewTransition 的 finished 或 ready 等快照抓完，
[click] 再复位成 none。因为 view-transition-name 只需在抓快照那一刻存在，留着反而会在 bfcache 前进后退恢复页面时造成撞名。跨文档同样缺 Firefox。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 特性检测：渐进增强的标准起手式

::left::

### 最小检测

```js {1-4|6|all}
// 不支持：直接更新，不进过渡流程
if (!document.startViewTransition) {
  updateDOM();
  return;
}
document.startViewTransition(updateDOM);
```

<div class="mini-note mt-3"><code>"startViewTransition" in document</code> 亦可；MPA 无需 JS 检测。</div>

::right::

### 封一个 helper，业务只调它

```js
/** 检测 + 无障碍 + 降级 一站式 */
function withViewTransition(update, types = []) {
  const reduce = matchMedia(
    "(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduce) {
    update();
    return null;
  }
  return document.startViewTransition({ update, types });
}
```

<!--
同文档场景，检测 document.startViewTransition 是否存在即可，这是渐进增强的标准起手式。
[click] 不支持就直接更新、直接返回。
[click] 支持就包一层。字符串 in document 的写法也等价；跨文档则完全无需 JS 检测，不支持时浏览器忽略 at-rule 硬切。

右边是生产做法：别把这段检测散落各处，封一个统一处理检测、无障碍、降级的工具，业务只调它。这里顺带把 prefers-reduced-motion 也收了进来——不支持或用户要求减少动效时,直接更新不做动画，支持时传选项对象携带 types。下一页展开无障碍这条。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 无障碍：尊重 `prefers-reduced-motion`

::left::

### 法一（推荐）：CSS 媒体查询包住

```css
/* 默认不给动画，仅「不介意动效」时才启用 */
@media (prefers-reduced-motion: no-preference) {
  ::view-transition-group(*) {
    animation-duration: 0.3s;
  }
}
```

::right::

### 法二：JS 检测到 reduce 就 skip

```js
const t = document.startViewTransition(update);
// reduce：跳动画，但 DOM 仍更新
if (matchMedia(
  "(prefers-reduced-motion: reduce)").matches) {
  t.skipTransition();
}
```

<div v-click class="takeaway mt-4">「减少动效」<strong>≠</strong>「零过渡」——通常保留极短的淡入淡出、去掉大幅位移与缩放，兼顾连续性与舒适度。</div>

<!--
View Transitions 是纯视觉动效，对前庭功能障碍用户可能引发不适，系统级的减少动态效果偏好必须尊重。

法一推荐：默认不给动画，把动画规则包进 prefers-reduced-motion no-preference，只有用户不介意动效时才启用；reduce 时规则不生效，退化为近乎瞬时。

法二：JS 里检测到 reduce 就 skipTransition，跳动画但 DOM 照常更新。

[click] 注意减少动效不等于零过渡，通常做法是保留极短的淡入淡出、去掉大幅位移与缩放,兼顾连续性与舒适度。这是无障碍的红线，别漏。
-->

---
layout: default
---

# 常见坑：最容易踩的六个

<div class="grid grid-cols-3 gap-4 mt-5">
  <div v-click class="fact tone-red" style="border-left-color: var(--deck-red)"><strong>唯一名冲突</strong><span>撞名 → <code>ready</code> reject、整过渡跳过 · 用 <code>match-element</code> / 拼 id</span></div>
  <div v-click class="fact" style="border-left-color: var(--deck-amber)"><strong>根元素全屏闪</strong><span><code>root</code> 组整页淡入淡出 · 命名主角 + 收敛 <code>root</code></span></div>
  <div v-click class="fact"><strong>回调塞异步</strong><span><code>await fetch</code> 卡页面 · 数据先取好再进过渡</span></div>
  <div v-click class="fact"><strong>动态命名忘复位</strong><span>不清 → bfcache 撞名 · <code>await</code> 后设 <code>"none"</code></span></div>
  <div v-click class="fact"><strong>快照过多</strong><span>每个 name 抓两张位图 · 只命名跨态移动的主角</span></div>
  <div v-click class="fact"><strong>只在 Chrome 测</strong><span>三引擎能力不齐 · CI 覆盖「过渡」与「降级」两路</span></div>
</div>

<!--
六个最容易踩的坑，也是头号事故来源。

[click] 唯一名冲突：同一时刻两元素撞名，ready reject、整过渡跳过。列表用 match-element 或把 id 拼进名字。
[click] 根元素全屏闪：不命名任何元素时 root 组整页淡入淡出，大改动突兀。对策是命名主角、收敛 root。
[click] 回调里塞异步：updateCallback 是渲染抑制窗口，await fetch 卡页面，数据先取好再进过渡。
[click] 动态命名忘复位：JS 设的 name 不清，跨文档 bfcache 恢复时残留撞名，await finished 或 ready 后设回 none。
[click] 快照过多拖性能：每个 name 抓两张位图，别给成百上千元素命名，只命名真正跨态移动的主角。
[click] 只在 Chrome 测：三引擎能力不齐，Firefox 缺 types 和跨文档，CI 要覆盖过渡与降级两条路径。
-->

---
layout: default
---

# 支持矩阵：三层能力，短板都在 Firefox

<table class="decision-table mt-4">
  <thead><tr><th>能力</th><th>Chrome / Edge</th><th>Safari</th><th>Firefox</th><th>Baseline</th></tr></thead>
  <tbody>
    <tr><td><strong>同文档核心</strong> <code>startViewTransition</code>、<code>-name</code>/<code>-class</code>、<code>match-element</code></td><td>111+</td><td>18+</td><td class="yes">144+</td><td class="yes">✓ 2025-10</td></tr>
    <tr><td><strong>view transition types</strong> <code>types</code>、<code>:active-view-transition-type()</code></td><td>125+</td><td>18+</td><td class="no">✗</td><td>否</td></tr>
    <tr><td><strong>跨文档 MPA</strong> <code>@view-transition</code>、<code>pageswap</code>/<code>pagereveal</code></td><td>126+</td><td>18.2+</td><td class="no">✗</td><td>否</td></tr>
  </tbody>
</table>

<div class="grid grid-cols-3 gap-4 mt-5">
  <div v-click class="fact tone-green" style="border-left-color: var(--deck-green)"><strong>同文档 = 安全区</strong><span>三引擎齐全，可放心用</span></div>
  <div v-click class="fact" style="border-left-color: var(--deck-amber)"><strong>唯一缺口 = Firefox</strong><span>Safari 已跟上，非「仅 Chromium」</span></div>
  <div v-click class="fact"><strong>降级无痛</strong><span>SPA 检存在性 · MPA 忽略即硬切</span></div>
</div>

<!--
把支持面收成一张矩阵，务必分三层看。

第一层同文档核心：startViewTransition、name、class、match-element。Chrome 111、Safari 18、Firefox 144 都有，2025 年 10 月 14 日 Firefox 补齐后进 Baseline。

第二层 view transition types 和第三层跨文档 MPA：Chrome 和 Safari 都支持，Firefox 144 初版都不含,所以都还没进 Baseline。

[click] 三句话记牢：同文档核心是安全区，三引擎齐全可放心用。
[click] types 与跨文档的唯一短板是 Firefox，Safari 早已跟上，别再说仅 Chromium。
[click] 降级无痛：SPA 检存在性，MPA 不支持时忽略 at-rule 硬切,不报错不白屏。
-->

---
layout: center
class: summary-slide
---

# 带走四个判断

<div class="summary-grid mt-8">
  <div><span>01</span><strong>只写最终状态</strong><small>浏览器补间前后两态，你从不写中间帧</small></div>
  <div><span>02</span><strong><code>name</code> 是配对钥匙</strong><small>同一时刻必须唯一，撞名整过渡跳过</small></div>
  <div><span>03</span><strong>形变在 <code>group</code>、外观在 <code>old</code>/<code>new</code></strong><small>命名要克制，只给跨态主角命名</small></div>
  <div><span>04</span><strong>生产必渐进增强</strong><small>缺口在 Firefox，两条路径都要测</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API" target="_blank"><carbon:book /> MDN API</a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using" target="_blank"><carbon:document /> Using 教程</a>
  <a href="https://developer.chrome.com/docs/web-platform/view-transitions" target="_blank"><carbon:rocket /> Chrome 指南</a>
  <a href="https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available" target="_blank"><carbon:flash /> Baseline 公告</a>
</div>

<!--
最后用四句话复盘。

第一，你只写最终状态，浏览器补间前后两态,中间帧不用管。
第二，view-transition-name 是配对钥匙，同一时刻必须唯一，撞名会让整过渡被跳过。
第三，形变加在 group、外观加在 old new，命名要克制，只给真正跨态移动的主角命名，别抓成百上千张快照。
第四，生产必须渐进增强，唯一缺口在 Firefox，CI 要同时覆盖有过渡和降级两条路径。

掌握这四条，再去查 MDN 的 Using 教程、Chrome 指南和 web.dev 的 Baseline 公告深入，就有稳定的判断基座。
-->
