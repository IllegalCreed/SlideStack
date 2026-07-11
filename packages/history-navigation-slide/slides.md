---
theme: seriph
layout: cover
title: History 与 Navigation API
info: |
  浏览器会话历史的两套原生接口：History API 的 pushState/popstate 与 hash/history 路由原理，
  以及 2026-01 进入 Baseline 的 Navigation API——所有 SPA 客户端路由的底座。

  Learn more at [MDN Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark">HN</div>

# History 与 Navigation API

## 会话历史的两套原生接口：所有 SPA 客户端路由的底座

<div class="cover-meta">
  <span>WHATWG HTML 现行标准 · 导航与会话历史</span>
  <span>History API · Navigation API · hash / history 路由</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API" target="_blank" class="slidev-icon-btn" aria-label="MDN Navigation API">
    <carbon:document />
  </a>
  <a href="https://github.com/WICG/navigation-api" target="_blank" class="slidev-icon-btn" aria-label="WICG navigation-api GitHub">
    <carbon:logo-github />
  </a>
</div>

<!--
这一叶不讲某个路由库，而是讲路由库脚下的地基：浏览器怎么维护「会话历史」，以及两套操作它的原生 API。

History API 是 2015 年就全绿的老牌方案，撑起了 SPA 路由二十年；Navigation API 是专为 SPA 重做的新一代方案，2026-01 才进 Baseline。两者都属于 WHATWG HTML 现行标准的「导航与会话历史」章节。

框架路由——Vue Router、React Router、TanStack Router——只在边界处对比点到，不展开任何一个库；本叶帮你读懂它们内部到底在替你做什么。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 两套 API 的定位：老牌全绿 vs 为 SPA 重做

::left::

### History API · `window.history`

<div class="flex flex-col gap-3 mt-2">
  <div class="fact"><strong>2015 年起全绿</strong><span>SPA 路由二十年的事实底座，最大公约数</span></div>
  <div v-click class="fact"><strong>三件套心智</strong><span><code>pushState</code> / <code>replaceState</code> + <code>popstate</code> + <code>history.state</code></span></div>
  <div v-click class="fact fact--warn"><strong>缺口多</strong><span>读不到完整栈、拦不全导航——路由库都在补它</span></div>
</div>

::right::

### Navigation API · `window.navigation`

<div class="flex flex-col gap-3 mt-2">
  <div class="fact fact--nav"><strong>2026-01 进 Baseline</strong><span>Chrome/Edge · Firefox 147 · Safari 26.2</span></div>
  <div v-click class="fact fact--nav"><strong>一个事件拦一切</strong><span><code>navigate</code> 覆盖所有同源导航 + <code>entries()</code> 读完整栈</span></div>
  <div v-click class="fact fact--nav"><strong>Promise 化生命周期</strong><span><code>navigate()</code> 返回 committed / finished</span></div>
</div>

<!--
先建立全局坐标。左边 History API 从 window.history 进入，2015 年全绿，是所有 SPA 路由的地基；它的心智极简，就是两个改址方法加一个事件加一个属性。

[click] 但它缺口太多——读不到完整历史栈、拦不住所有导航来源，逼得每个路由库都要在上面糊一层。

[click] 右边 Navigation API 从 window.navigation 进入，2026 年 1 月才进 Baseline。它用一个 navigate 事件收敛所有导航，用 entries 读完整历史栈。

[click] 还把导航做成 Promise：navigate 返回 committed 和 finished 两个时刻。一句话——只要兼容面用 History，做严肃路由内核用 Navigation。
-->

---
layout: default
---

# SPA 路由要解决的，只有三件事

<div class="pipeline mt-8">
  <div class="pipeline-step tone-amber">
    <span class="step-no">01</span>
    <strong>拦截导航</strong>
    <span>点链接、前进后退，别让浏览器真加载新文档</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-blue">
    <span class="step-no">02</span>
    <strong>换内容</strong>
    <span>用 JS 按目标 URL 渲染对应视图</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-green">
    <span class="step-no">03</span>
    <strong>同步历史</strong>
    <span>写进历史栈，让地址栏、前进后退、刷新都对</span>
  </div>
</div>

<div class="grid grid-cols-3 gap-4 mt-9">
  <div v-click class="fact"><strong>MPA</strong><span>每次导航向服务端要新文档，历史栈浏览器自动维护</span></div>
  <div v-click class="fact"><strong>SPA</strong><span>只有一个文档，「翻页」是 JS 换内容，不要新文档</span></div>
  <div v-click class="fact"><strong>缺口</strong><span>只换内容不动历史 → 地址栏不变、后退失灵、刷新回首页</span></div>
</div>

<!--
把 SPA 路由拆开，本质只有三件事：拦截导航、用 JS 换内容、把这次翻页同步进历史栈。History 和 Navigation 就是完成这三件事的原生工具。

[click] 传统多页应用里，每次导航都向服务端要新 HTML、整页重载，历史栈由浏览器自动维护，开发者不用管。

[click] 单页应用打破了这个模型——整个应用只有一个文档，翻页是 JS 换内容，不向服务端要新文档。

[click] 于是问题来了：如果只换内容不动历史栈，地址栏不变、前进后退失灵、刷新回到首页。这三件事就是为了补上这个缺口。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# History 改址：pushState 与 replaceState

::left::

```js {1|2|4|5|all}
history.pushState(state, "", "/users/1");
history.replaceState(state, "", "?sort=hot");

console.log(history.state); // 读当前 state，无需等 popstate
// pushState 推新条目（栈变长）、replaceState 原地替换（栈不变）
```

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>第二参 title 是「死参数」；url 必须同源，跨源抛 <code>SecurityError</code></span>
</div>

::right::

<table class="decision-table">
  <thead><tr><th>参数</th><th>说明</th></tr></thead>
  <tbody>
    <tr v-click><td><code>state</code></td><td>结构化克隆数据；Firefox 上限约 16 MiB</td></tr>
    <tr v-click><td><code>unused</code></td><td>历史上的 title，<strong>几乎全被忽略</strong>，传 <code>""</code></td></tr>
    <tr v-click><td><code>url</code></td><td>可选；<strong>必须同源</strong>，否则 <code>SecurityError</code></td></tr>
  </tbody>
</table>

<div v-click class="mini-note mt-4">改标题请直接 <code>document.title = "…"</code>；<code>replaceState</code> 常用于把筛选参数同步进 URL 而不产生新历史。</div>

<!--
pushState 和 replaceState 是 history 路由的心脏，签名一致，三个参数。左边：pushState 推一条新条目，地址栏变、页面不刷新；replaceState 原地替换当前条目。history.state 随时能读当前 state，不用等 popstate。

[click] 两个初学者最常撞的墙：第二个参数是历史遗留的页面标题，现今几乎所有浏览器都忽略它——想改标题直接写 document.title；第三个参数只能同源，跨源会抛 SecurityError。

[click:3] 右边参数表逐条看：state 走结构化克隆、Firefox 约 16 MiB 上限；unused 传空串；url 可选但必须同源。

[click] replaceState 的典型用法是把当前筛选、排序参数写进 URL，又不想产生一条新历史。
-->

---
layout: default
---

# 头号坑：popstate 只认「前进后退」

<div class="trigger-pair mt-6">
  <div class="trigger-card nofire">
    <code>pushState / replaceState</code>
    <span>❌ 不触发 popstate —— push 完要换 UI 必须<strong>自己调渲染</strong></span>
  </div>
  <div class="trigger-card fire">
    <code>back / forward / go</code>
    <span>✅ 触发 popstate —— 用户前进后退时被动响应</span>
  </div>
</div>

<table class="decision-table mt-5">
  <tbody>
    <tr><td>用户点浏览器<strong>后退 / 前进</strong>按钮</td><td>✅ 触发</td></tr>
    <tr v-click><td><code>history.back()</code> / <code>forward()</code> / <code>go(n)</code></td><td>✅ 触发</td></tr>
    <tr v-click><td><code>history.pushState(...)</code> / <code>replaceState(...)</code></td><td>❌ <strong>不触发</strong></td></tr>
    <tr v-click><td>页面首次加载</td><td>❌ 不触发</td></tr>
  </tbody>
</table>

<div v-click class="takeaway mt-4">「去某页」（push + 手动渲染）与「回某页」（popstate 驱动）是<strong>两条独立代码路径</strong>——这是自研 SPA 路由的头号 bug。</div>

<!--
这是整叶必须刻进肌肉记忆的一条。左边红卡：pushState 和 replaceState 不触发 popstate；右边绿卡：只有 back、forward、go，也就是历史导航，才触发 popstate。

[click:3] 表格把所有情况列全：点浏览器前进后退按钮、调 back/forward/go 都触发；而 pushState、replaceState 都不触发；页面首次加载也不触发。

[click] 工程含义：「主动去某页」和「被动回某页」是两条独立的代码路径。push 之后必须自己调渲染函数，不能指望 popstate。漏掉手动渲染，就出现「地址栏变了但页面没变」；反过来误以为 push 会触发 popstate、只在 popstate 里渲染，就是「点链接毫无反应」。下一页我们现场把它跑出来。
-->

---
layout: default
class: lab-slide
---

# 交互实验：历史栈可视化

<HistoryStackLab />

<!--
现场演示脚本。左边选一个目标路径，点 pushState——右边历史栈追加一条、length 加一、指针到栈顶，而顶部大徽标显示「popstate 未触发」。这就是头号坑：push 不通知你。

多点几次 pushState 造出一条长历史，然后点 back——指针左移、徽标立刻变绿「popstate 触发」，history.state 也切成目标条目的 state。再点 forward 同样触发。对比非常直观：push/replace 一路红（不触发），back/forward 一路绿（触发）。

再演示两个细节：在历史中间 back 几步、然后 pushState——注意前进项被截断、length 缩短，这就是「分叉即截断」；replaceState 则原地替换，key 不变、length 不变。底部读数区实时显示 length、state、canGoBack/canGoForward。

说明一句：这是教学模拟栈，忠实复刻会话历史语义，但不改真实地址栏——因为 Slidev 自己就用 History API 翻页，真改会劫持演示。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 在历史里移动：back / forward / go / length

::left::

```js {1-2|3|5|6|all}
history.back(); // = go(-1)，触发 popstate（异步）
history.forward(); // = go(1)
history.go(-2); // 后退两条；go(0) / go() 刷新当前页

history.length; // 会话历史条目数（含当前），只读
// 读不到每条 URL/state，也不能清空——History 的硬伤
```

::right::

<div class="flex flex-col gap-3 mt-2">
  <div class="fact"><strong>异步执行</strong><span><code>back/forward/go</code> 触发的导航是异步的，<code>popstate</code> 随后派发</span></div>
  <div v-click class="fact fact--warn"><strong>越界静默</strong><span>栈底再 <code>back()</code>、栈顶再 <code>forward()</code> 都无效果也不报错</span></div>
  <div v-click class="fact"><strong>length 的局限</strong><span>只给个数，读不到具体条目——遍历完整栈只有 Navigation 的 <code>entries()</code></span></div>
</div>

<!--
在历史里移动的四个成员。左边：back 等价 go(-1)、forward 等价 go(1)、go(n) 相对跳转，go(0) 或无参 go() 刷新当前页。history.length 是会话历史条目数，含当前页，只读。

右边三个要点：这些导航都是异步的，popstate 随后才派发；

[click] 越界静默——已在栈底再 back、栈顶再 forward，都无效果也不报错，所以「能不能后退」你从 History API 问不出来，这正是 Navigation 的 canGoBack 要补的；

[click] length 只告诉你有多少条，读不到每条的 URL 和 state，也不能清空或裁剪。想遍历完整历史栈，只有 Navigation API 的 entries。
-->

---
layout: default
---

# scrollRestoration：接管滚动恢复

```js {1-3|all}
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual"; // 关掉浏览器自动滚动恢复，SPA 自控
}
```

<table class="decision-table mt-5">
  <thead><tr><th>取值</th><th>行为</th></tr></thead>
  <tbody>
    <tr><td><code>"auto"</code>（默认）</td><td>浏览器在历史导航时自动恢复用户上次滚动到的位置</td></tr>
    <tr v-click><td><code>"manual"</code></td><td>浏览器不恢复滚动，<strong>由你自己</strong>在渲染完成后决定滚到哪</td></tr>
  </tbody>
</table>

<div v-click class="mini-note mt-5">SPA 里内容是异步渲染的，浏览器「自动恢复」常在内容还没出来时就执行、滚到错位置——所以 SPA 常设 <code>"manual"</code>，把 <code>window.scrollY</code> 存进条目 state，渲染完再手动 <code>scrollTo</code>。</div>

<!--
浏览器默认会在前进后退时自动把页面滚回上次位置，对多页应用很贴心，但 SPA 里内容异步渲染，自动恢复往往在内容还没出来时就执行，滚到错误位置。scrollRestoration 让你接管。

先做特性检测，再设成 manual。

[click] auto 是默认，浏览器自动恢复；manual 关闭自动恢复，由你在渲染完成后自己控制。

[click] SPA 的典型做法：设 manual，把 window.scrollY 存进该条目的 state，在 popstate 渲染完内容后手动 scrollTo。Navigation API 的 intercept scroll 选项提供了更精细的接管，稍后会讲。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 两条路线：hash 路由 vs history 路由

::left::

### hash 路由 · `#/path`

```js
location.hash = "/users/1"; // 改 fragment
addEventListener("hashchange", render);
```

<div class="flex flex-col gap-2 mt-3">
  <div class="fact"><strong>无需服务端配合</strong><span><code>#</code> 后变化不发请求，纯静态可跑</span></div>
  <div class="fact fact--warn"><strong>URL 不美、SEO 弱</strong><span>挂个 <code>#</code>，与真实锚点有潜在冲突</span></div>
</div>

::right::

### history 路由 · 真实路径

```js
history.pushState(null, "", "/users/1");
// Nginx: try_files $uri $uri/ /index.html;
```

<div class="flex flex-col gap-2 mt-3">
  <div class="fact fact--nav"><strong>URL 干净、可 SEO</strong><span>符合直觉，现代项目默认</span></div>
  <div class="fact fact--warn"><strong>必须服务端 fallback</strong><span>否则刷新 / 直接访问子路由即 404</span></div>
</div>

<div v-click class="col-span-2 signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>「本地正常、部署后刷新 404」＝十有八九漏配 fallback——开发服务器帮你做了，生产没配就露馅。</span>
</div>

<!--
无论用哪套 API，SPA 路由在 URL 形态上都要二选一。左边 hash 路由：把路由信息放在井号之后，改 location.hash 换路由、监听 hashchange 渲染。关键机制是井号后的 fragment 变化不触发整页请求，服务端永远只看到根路径——所以无需任何后端配合，纯静态托管即可；代价是 URL 不美、SEO 弱。

右边 history 路由：用 pushState 造干净的真实路径，可 SEO，是现代项目默认。但代价明确——用户刷新或直接输入子路由 URL 时，浏览器会真的向服务端请求那个路径，服务端没有就 404。所以必须配 fallback：把未匹配静态资源的路径统统回退到 index.html。

[click] 这条底部红条是 history 路由最经典的坑：本地开发一切正常，部署后刷新子路由 404——开发服务器默认帮你做了 fallback，生产服务器没配就露馅。记住：history 路由必配服务端 fallback，这不是可选项。
-->

---
layout: default
---

# History API 的四宗罪（承上启下）

<div class="summary-grid mt-6">
  <div><span>01</span><strong>读不到完整历史栈</strong><small><code>length</code> 只给个数，<code>state</code> 只给当前条</small></div>
  <div v-click><span>02</span><strong>改不了非当前 entry</strong><small>只能改「当前」条目的 state，更早的动不了</small></div>
  <div v-click><span>03</span><strong>popstate 不因 push/replace 触发</strong><small>主动导航和被动导航两条路径，易顾此失彼</small></div>
  <div v-click><span>04</span><strong>感知不到所有导航来源</strong><small>点链接、表单、<code>go</code>……靠全局监听拼凑，拦不全</small></div>
</div>

<div v-click class="takeaway mt-7">这四点正是 <strong>Navigation API</strong> 的设计出发点——下一页看它如何逐一填平。</div>

<!--
用 History API 手搓 SPA 路由，你会撞上四个规范级缺口，我们叫它四宗罪。

第一，读不到完整历史栈：length 只给个数、state 只给当前条，看不到其他条目的 URL 和 state。

[click] 第二，改不了非当前 entry：只能改当前条目的 state，历史里更早的条目动不了。

[click] 第三，popstate 不因 push/replace 触发：主动导航和被动导航是两条路径，容易顾此失彼——就是刚才那个头号坑。

[click] 第四，感知不到所有导航来源：点链接、提交表单、location.assign、history.go，得靠全局监听 click 加 preventDefault 拼凑，还拦不全。

[click] 这四点正是 Navigation API 的设计出发点。从下一页开始，看它如何逐一填平。
-->

---
layout: default
---

# Navigation API：一个为 SPA 重做的入口

<div class="release-grid mt-6">
  <div class="release-hero">
    <span class="release-label">2026-01</span>
    <strong>Baseline</strong>
    <span>Newly Available：Chrome/Edge · Firefox 147 · Safari 26.2</span>
  </div>
  <div class="release-detail tone-green">
    <carbon:flash />
    <strong><code>window.navigation</code></strong>
    <span>每窗口一个实例；特性检测 <code>"navigation" in window</code></span>
  </div>
  <div class="release-detail tone-blue">
    <carbon:list-boxes />
    <strong>一个事件拦一切</strong>
    <span><code>navigate</code> 事件覆盖所有同源导航来源</span>
  </div>
  <div class="release-detail tone-amber">
    <carbon:warning />
    <strong>仍需降级</strong>
    <span>Newly Available：老设备上的旧版本仍可能缺，保留 History API 兜底</span>
  </div>
</div>

<div v-click class="takeaway mt-5">它把 History 散落的能力收敛成一套自洽对象模型：发起导航、读历史栈、改当前状态、拦截导航、生命周期事件，各归其位。</div>

<!--
Navigation API 从 window.navigation 进入，每个窗口一个实例。它 2026 年 1 月进入 Baseline 的 Newly Available 状态——最新版三大引擎全支持：Chrome/Edge、Firefox 147、Safari 26.2。

但 Newly Available 的含义要讲清：它意味着最新版全支持，用户设备上的老版本仍可能缺——所以生产务必用特性检测「navigation in window」，未命中就降级到 History API。

[click] 它最大的价值是把 History API 散落的能力收敛成一套自洽的对象模型：发起导航、读历史栈、改当前状态、拦截导航、生命周期事件，各归其位——不再是零散的方法加全局事件。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 五个导航方法：都返回两个 Promise

::left::

```js {1|2-3|5-6|all}
const { committed, finished } = navigation.navigate("/dashboard", {
  state: { tab: "home" }, // 结构化克隆，持久在 entry
  info: { anim: "swipe" }, // 一次性，只给本次 navigate 事件
});
await committed; // URL 已变、新 entry 入栈
await finished; // intercept handler 全跑完，内容就绪
```

::right::

<table class="decision-table">
  <thead><tr><th>方法</th><th>作用</th></tr></thead>
  <tbody>
    <tr><td><code>navigate(url, opts?)</code></td><td>导航到新 URL、建条目</td></tr>
    <tr v-click><td><code>reload(opts?)</code></td><td>重载当前条目</td></tr>
    <tr v-click><td><code>back()</code> / <code>forward()</code></td><td><code>canGoBack/Forward</code> 为假则拒绝</td></tr>
    <tr v-click><td><code>traverseTo(key, opts?)</code></td><td>跳到 key 指定条目</td></tr>
  </tbody>
</table>

<div v-click class="mini-note mt-3"><code>state</code> 持久、<code>info</code> 一次性、<code>history</code> 取 <code>"auto"/"push"/"replace"</code>。</div>

<!--
Navigation API 最鲜明的现代化：每个导航方法都返回一个含两个 Promise 的对象。左边看 navigate：options 里 state 是结构化克隆数据、持久在 entry 上，info 是一次性信息、只给本次 navigate 事件，常用于指示动画方向。

关键是这两个 await：committed 在 URL 已变、新 entry 入栈时兑现——这时可以更新「当前路由」指示；finished 在 intercept 的 handler 全跑完、内容真正就绪时兑现。这是 History API 完全没有的生命周期。

[click:3] 右边五个方法：navigate 导航建条目、reload 重载、back/forward 在 canGoBack/canGoForward 为假时会拒绝、traverseTo 跳到 key 指定条目。

[click] options 里 state 持久、info 一次性、history 取 auto/push/replace 决定入栈方式。
-->

---
layout: default
---

# 读完整历史栈 + traverseTo：key 认「位置」

```js {1-3|5-6|8|9|all}
for (const entry of navigation.entries()) {
  console.log(entry.index, entry.url, entry.getState()); // 完整同源栈——History 做不到
}

const homeKey = navigation.currentEntry.key; // key = UA 生成的 slot 标识，不可变
// 用户逛了很多页之后……

homeButton.onclick = () => navigation.traverseTo(homeKey); // 直达首屏 slot
// key 已被清出历史栈 → 抛 InvalidStateError（需 entries() 预校验或 try/catch 降级）
```

<div v-click class="takeaway mt-5"><strong>key 认位置</strong>：它标记历史栈里的「槽位」，用户在这个 slot 上前进后退甚至重新导航覆盖，key 都不变——存下首页的 key 就能「永远回首页」。</div>

<!--
这是 Navigation API 相对 History 的质变能力。上面：entries 遍历完整同源历史栈，每条的 index、url、getState 都能读——History 只能读当前一个 state，这是质变。

下面是 traverseTo 的经典用法：应用启动时记下首屏条目的 key，用户逛了很多页之后，点「回首页」直接 traverseTo 那个 key，无论中间隔了多少条历史。要处理的断点是：如果这个 key 已被清出历史栈，traverseTo 会抛 InvalidStateError，所以要先用 entries 校验 key 还在，或者 try/catch 后降级为普通 navigate。

[click] 理解 key 的语义是用好它的前提：key 认的是「位置、槽位」，不是「某次导航实例」。用户在这个 slot 上前进后退、甚至重新导航覆盖，只要还是同一个 slot，key 就不变。所以存下某个 entry 的 key，之后随时能回到它——这就是「永远回首页」按钮的标准实现。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# NavigationHistoryEntry：一个条目的全部信息

::left::

<table class="decision-table">
  <thead><tr><th>字段</th><th>含义</th></tr></thead>
  <tbody>
    <tr><td><code>getState()</code></td><td>读该条目结构化 state（<strong>任意条目</strong>）</td></tr>
    <tr v-click><td><code>url</code></td><td>条目 URL</td></tr>
    <tr v-click><td><code>key</code></td><td>slot 标识——认「位置」，<code>traverseTo</code> 用</td></tr>
    <tr v-click><td><code>id</code></td><td>实例标识——认「这一次」，埋点用</td></tr>
    <tr v-click><td><code>index</code> / <code>sameDocument</code></td><td>栈内位置 / 是否同文档导航</td></tr>
  </tbody>
</table>

::right::

<div class="flex flex-col gap-3 mt-2">
  <div class="fact fact--nav"><strong>key 认位置</strong><span>同一 slot 复用则不变——做「回到这个位置」<code>traverseTo(key)</code></span></div>
  <div v-click class="fact"><strong>id 认实例</strong><span>每次新导航都换新——做「认出这一次」的缓存键 / 埋点</span></div>
  <div v-click class="fact fact--warn"><strong>dispose 事件</strong><span>条目被移出历史栈时触发——回收其绑定资源</span></div>
</div>

<div v-click class="col-span-2 mini-note mt-3">一句话：<strong>要「回去」用 key，要「认出这一次」用 id</strong>——用反了逻辑就错。</div>

<!--
entries、currentEntry、navigate 事件的 destination 里拿到的，都是 NavigationHistoryEntry。左边字段表：getState 读该条目的结构化 state，注意是任意条目都能读，不像 history.state 只能读当前；url、key、id、index、sameDocument。

[click:3] 右边把最易混的 key 和 id 讲透：key 认位置，同一 slot 复用则不变，用来做「回到这个位置」；

[click] id 认实例，每次新导航都换新，用来做「认出这一次导航」的缓存键或埋点；

[click] 还有 dispose 事件，某条目被移出历史栈时触发，可以在这里回收它绑定的资源——这是 History API 连感知都做不到的。

[click] 一句话记法：要回去用 key，要认出这一次用 id，用反了逻辑就错。
-->

---
layout: default
---

# navigate 事件：所有导航的统一入口

```js {1|2|3|4|6-9|all}
navigation.addEventListener("navigate", (event) => {
  if (!event.canIntercept) return; // 跨源等——不查直接 intercept 抛 SecurityError
  if (event.hashChange) return; // 纯 fragment 变化，交给锚点行为
  if (event.downloadRequest !== null) return; // 下载链接，放行给浏览器

  const url = new URL(event.destination.url); // 走到这才是要接管的应用内导航
  event.intercept({
    async handler() { render(await loadView(url.pathname)); },
  });
});
```

<div v-click class="takeaway mt-5">一个事件收编了点链接、提交表单、<code>history.go()</code>、<code>navigation.navigate()</code>、地址栏改 hash——先据属性判断「拦还是放」，再 <code>intercept()</code> 接管。</div>

<!--
History 时代做 SPA 路由，你得全局监听 click、preventDefault、手动 pushState、手动渲染，还拦不住表单提交和 history.go。Navigation API 用一个 navigate 事件收敛了这一切。

但不是所有导航都该被 SPA 拦截，标准的守卫写法有三道：

[click] 第一，canIntercept 为假的（跨源、特殊导航）直接放行——不查就 intercept 会抛 SecurityError，这是拦前必查；

[click] 第二，纯 hash 变化放行，交给锚点行为；

[click] 第三，下载链接放行给浏览器。

[click] 走过这三道守卫，才是要接管的应用内导航——取出目标 URL，调 intercept，在 handler 里渲染。

[click] 一个事件就收编了点链接、提交表单、history.go、navigation.navigate、地址栏改 hash 等所有同源导航。先据属性判断拦还是放，再 intercept 接管。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# intercept 时序：precommit 在前、handler 在后

::left::

<div class="timeline mt-2">
  <div class="timeline-node">
    <span class="timeline-phase">提交前</span>
    <strong><code>precommitHandler</code></strong>
    <span>URL 未变、旧内容仍可见；可取数 / 校验 / 重定向</span>
  </div>
  <carbon:arrow-down class="timeline-arrow" />
  <div class="timeline-node timeline-commit">
    <span class="timeline-phase">commit</span>
    <strong>URL 更新、新 entry 入栈</strong>
    <span><code>committed</code> 兑现、<code>currentEntry</code> 切换</span>
  </div>
  <carbon:arrow-down class="timeline-arrow" />
  <div class="timeline-node">
    <span class="timeline-phase">提交后</span>
    <strong><code>handler</code></strong>
    <span>URL 已变，渲染新内容 → <code>navigatesuccess</code></span>
  </div>
</div>

::right::

<div class="flex flex-col gap-3 mt-2">
  <div class="fact"><strong>handler（最常用）</strong><span>提交后运行，绝大多数 SPA 路由只需要它——换内容</span></div>
  <div v-click class="fact fact--nav"><strong>precommitHandler</strong><span>提交前运行，保留旧页面可见，先取数或校验重定向</span></div>
  <div v-click class="fact fact--warn"><strong>只在可取消导航可用</strong><span><code>traverse</code>（前进后退）<code>cancelable=false</code>，用 precommit 抛 <code>SecurityError</code></span></div>
</div>

<!--
intercept 是核心，理解它两个回调的时序是理解全局的钥匙。左边时间线从上到下：precommitHandler 在提交前运行，此时 URL 还没变、旧内容仍在屏幕上，适合先把数据取好、或做校验重定向；它的 Promise 兑现后才提交。

中间黑块是提交时刻：URL 更新、新 entry 入栈、committed 兑现、currentEntry 切换。

然后 handler 在提交后运行，此时 URL 已经是目标 URL，只管渲染新内容，跑完触发 navigatesuccess。

[click:2] 右边补充：handler 最常用，绝大多数 SPA 路由只需要它；precommitHandler 适合保留旧页面可见、先取数或鉴权重定向；

[click] 但要注意 precommitHandler 只在可取消的导航上可用，像 traverse——用户前进后退——cancelable 是 false，用 precommit 会抛 SecurityError，那种场景把逻辑放进 handler 就行。
-->

---
layout: default
---

# 鉴权重定向 + 防竞态：SPA 路由骨架成型

````md magic-move {at:1}
```js
// ① 最常用：提交后渲染
event.intercept({
  async handler() {
    render(await loadView(url.pathname));
  },
});
```

```js
// ② 加鉴权：precommit 提交前改道，地址栏不闪受限 URL
event.intercept({
  async precommitHandler(controller) {
    controller.redirect("/signin/", { history: "push" });
  },
  async handler() {
    render(await loadView(url.pathname));
  },
});
```

```js
// ③ 加防竞态：signal 透传，新导航打断旧导航则旧 fetch 自动取消
event.intercept({
  async handler() {
    const res = await fetch(`/api${url.pathname}`, { signal: event.signal });
    render(await res.json());
  },
});
navigation.addEventListener("navigateerror", (e) => showError(e.message));
```
````

<div class="takeaway mt-4">没有一处 <code>pushState</code>、<code>preventDefault</code> 或全局 <code>click</code> 监听——地址栏、历史栈、滚动、焦点全由浏览器代管。</div>

<!--
把前面的拼起来，看一个 SPA 路由骨架逐步成型。第一步最常用：提交后在 handler 里渲染。

[click] 第二步加鉴权：用 precommitHandler 在提交前调 controller.redirect 改道到登录页——关键收益是地址栏不会先闪一下受限 URL，比在 handler 里再导航干净得多。

[click] 第三步加防竞态：把 event.signal 透传给 fetch。当新导航打断旧导航——用户快速点了另一个链接——旧导航的 signal 会 abort，旧 fetch 自动取消，避免陈旧请求晚回来覆盖新内容。再挂一个 navigateerror 做全局错误提示。

这份代码没有一处 pushState、没有一处 preventDefault、没有全局 click 监听——浏览器把地址栏、历史栈、滚动、焦点全代管了。这正是「我们一直想要的路由器」。
-->

---
layout: default
---

# 迁移对照表：History → Navigation

<table class="decision-table mt-4">
  <thead><tr><th>目的</th><th>History API</th><th>Navigation API</th></tr></thead>
  <tbody>
    <tr><td>推新条目 / 替换</td><td><code>pushState</code> / <code>replaceState</code></td><td><code>navigate(url, { history })</code></td></tr>
    <tr v-click><td>只改 state、不导航</td><td><code>replaceState(s, "", href)</code></td><td><code>updateCurrentEntry({ state })</code></td></tr>
    <tr v-click><td>读当前 state</td><td><code>history.state</code></td><td><code>currentEntry.getState()</code></td></tr>
    <tr v-click><td>读完整历史栈</td><td><strong>做不到</strong></td><td><code>entries()</code></td></tr>
    <tr v-click><td>回到某页</td><td><code>go(-n)</code> 数步数（易错）</td><td>存 key 后 <code>traverseTo(key)</code></td></tr>
    <tr v-click><td>监听导航</td><td><code>popstate</code>（仅前进后退）</td><td><code>navigate</code> 事件（所有导航）</td></tr>
    <tr v-click><td>拦截换内容 / 完成回调</td><td><code>click</code>+<code>preventDefault</code> / 无</td><td><code>intercept()</code> / <code>navigatesuccess</code></td></tr>
  </tbody>
</table>

<!--
落地一次迁移，照着这张表逐条换。推新条目和替换，从 pushState/replaceState 换成 navigate 带 history 选项。

[click] 只改 state 不导航，从 replaceState 传当前 href，换成语义更聚焦的 updateCurrentEntry。

[click] 读当前 state，从 history.state 换成 currentEntry.getState。

[click] 读完整历史栈——History 做不到，Navigation 用 entries。

[click] 回到某页，从 go 负 n 数步数这种易错写法，换成存 key 后 traverseTo 直达。

[click] 监听导航，从只认前进后退的 popstate，换成覆盖所有导航的 navigate 事件。

[click] 拦截换内容，从全局 click 加 preventDefault，换成一次 intercept；完成回调从无到 navigatesuccess。迁移后最大的心智简化是：主动导航和被动导航合流成一条路径，不再 push 一套、popstate 一套。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 渐进增强与框架边界：别抢管理权

::left::

```js {1-2|3-4|6-9|all}
function createRouter(render) {
  if ("navigation" in window) {
    navigation.addEventListener("navigate", onNavigate); // 现代路径
    return { navigate: (u, s) => navigation.navigate(u, { state: s }) };
  }
  addEventListener("popstate", (e) => render(location.pathname, e.state));
  return {
    navigate(u, s) {
      history.pushState(s, "", u); // 兜底：push 不触发 popstate
      render(u, s); // 手动渲染
    },
  };
}
```

::right::

<div class="flex flex-col gap-3 mt-2">
  <div class="fact"><strong>框架仍以自有 API 为主</strong><span>业务里写 Vue Router / React Router 的声明式路由表</span></div>
  <div v-click class="fact fact--nav"><strong>红利多在框架内部</strong><span>路由库逐步用 Navigation 做内核，升级即受益</span></div>
  <div v-click class="fact fact--warn"><strong>别与框架抢管</strong><span>用了框架就别再自己 <code>intercept</code>——会打架</span></div>
</div>

<!--
Navigation 2026 年 1 月才进 Baseline，老环境仍需 History 兜底，标准做法是特性检测加两条代码路径。左边这个薄路由层：navigation in window 命中走现代路径，用 navigate 事件加 intercept；否则走兜底路径，用 popstate 加 pushState，注意兜底里 push 不触发 popstate、要手动渲染。把差异关进一个薄路由层，业务只调 router.navigate，不感知底层是哪套 API。检测用 navigation in window，不要 UA 嗅探。

[click:2] 右边是本叶必须讲清的边界：框架路由目前仍以自有 API 为主，你在业务里写的还是 Vue Router 的路由表、React Router 的 Routes；

[click] Navigation API 的红利多在框架内部逐步采用，你升级路由库版本即可受益，不需要自己改；

[click] 最重要的一条——别与框架抢管理权：用了框架路由就不要再自己 addEventListener navigate 去 intercept，那会和框架的导航流程打架。要么全交给框架，要么只在没有框架的场景用原生。
-->

---
layout: default
---

# 易错点 TOP

<div class="grid grid-cols-2 gap-x-6 gap-y-3 mt-6">
  <div class="fact fact--warn"><strong>以为 pushState 触发 popstate</strong><span>不会——push 后换 UI 必须自己调渲染</span></div>
  <div v-click class="fact fact--warn"><strong>history 路由刷新 404</strong><span>漏配服务端 fallback 到 <code>index.html</code></span></div>
  <div v-click class="fact fact--warn"><strong>state 塞函数 / 大对象</strong><span>结构化克隆存不了函数 / DOM，Firefox 约 16 MiB</span></div>
  <div v-click class="fact fact--warn"><strong>intercept 前不查 canIntercept</strong><span>跨源等导航直接 <code>intercept</code> 抛 <code>SecurityError</code></span></div>
  <div v-click class="fact fact--warn"><strong>traverseTo key 失效不处理</strong><span>key 被清出抛 <code>InvalidStateError</code>——先校验或降级</span></div>
  <div v-click class="fact fact--warn"><strong>混淆 key 与 id</strong><span>回某页用 key（认位置）、埋点用 id（认这一次）</span></div>
</div>

<!--
把全叶的坑集中过一遍。第一，以为 pushState 会触发 popstate——不会，push 后要换 UI 必须自己调渲染，这是头号坑。

[click] 第二，history 路由刷新 404，十有八九是漏配服务端 fallback 到 index.html。

[click] 第三，把函数、大对象、类实例塞进 state——结构化克隆存不了函数和 DOM，类实例会丢方法，Firefox 还有约 16 MiB 上限，history 里只放 id，真数据放外部存储。

[click] 第四，intercept 前不查 canIntercept，跨源等导航上直接 intercept 会抛 SecurityError。

[click] 第五，traverseTo 不处理 key 失效，key 被清出栈后抛 InvalidStateError，要先用 entries 校验或 try/catch 降级。

[click] 第六，混淆 key 与 id：回某页用 key 认位置，埋点缓存键用 id 认这一次，用反了逻辑就错。
-->

---
layout: center
class: summary-slide
---

# 带走五个判断

<div class="summary-grid mt-6">
  <div><span>01</span><strong>push / replace 不触发 popstate</strong><small>去某页要自己渲染，回某页才由 popstate 驱动</small></div>
  <div><span>02</span><strong>history 路由必配服务端 fallback</strong><small>否则刷新子路由 404；纯静态退回 hash 路由</small></div>
  <div><span>03</span><strong>Navigation：一个事件拦一切</strong><small><code>navigate</code> + <code>intercept</code> + 完整 <code>entries()</code></small></div>
  <div><span>04</span><strong>key 认位置、id 认这一次</strong><small>回去用 key、埋点用 id；两 state 都走结构化克隆</small></div>
  <div><span>05</span><strong>特性检测 + History 降级</strong><small><code>"navigation" in window</code>；别与框架路由抢管</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API" target="_blank"><carbon:book /> MDN Navigation API</a>
  <a href="https://web.dev/blog/baseline-navigation-api" target="_blank"><carbon:rocket /> web.dev Baseline 公告</a>
  <a href="https://github.com/WICG/navigation-api" target="_blank"><carbon:logo-github /> WICG/navigation-api</a>
</div>

<!--
最后用五句话复盘。第一，push 和 replace 不触发 popstate——去某页要自己渲染，回某页才由 popstate 驱动，这是自研路由的头号坑。

第二，history 路由必须配服务端 fallback，否则刷新子路由 404；纯静态托管配不了就退回 hash 路由。

第三，Navigation API 的核心是一个 navigate 事件拦一切、一次 intercept 接管、完整 entries 随手可读。

第四，key 认位置、id 认这一次——回去用 key、埋点用 id；两套 API 的 state 都走结构化克隆，函数和 DOM 存不了。

第五，工程上用 navigation in window 特性检测、以 History API 降级，业务里用了框架路由就别与框架抢管理权。掌握这五条，你就能读懂任何路由库脚下的地基。
-->
