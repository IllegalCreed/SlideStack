---
theme: seriph
layout: cover
title: Web Storage API
info: |
  localStorage / sessionStorage 的 API 编程面：方法语义、storage 事件、序列化陷阱、异常处理与工程封装。

  Learn more at [MDN Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark">WS</div>

# Web Storage

## 最简单的浏览器键值存储：只存字符串、同步阻塞、按源隔离

<div class="cover-meta">
  <span>WHATWG HTML 标准 · Web storage 章</span>
  <span>方法语义 · storage 事件 · 序列化 · 工程封装</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API" target="_blank" class="slidev-icon-btn" aria-label="MDN 文档">
    <carbon:document />
  </a>
  <a href="https://github.com/whatwg/html" target="_blank" class="slidev-icon-btn" aria-label="whatwg/html GitHub">
    <carbon:logo-github />
  </a>
</div>

<!--
这不是一份"两行代码存 localStorage"的入门。Web Storage 的 API 只有六个成员，简单到十几年零演进——但正因为它简单，所有深度都藏在语义边界、storage 事件、只存字符串的序列化陷阱和工程封装里。

本片严格聚焦 API 编程面。存储模型、选型矩阵、配额驱逐、存储分区这些机制话题归浏览器章，这里只点到链接、不展开。下一页先把这条边界画清楚。
-->

---
layout: default
---

# 先划边界：本叶只讲 API 编程面

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="fact"><strong>Storage 接口</strong><span>五方法一属性的键值容器，两个实例共用同一接口</span></div>
  <div class="fact"><strong>两个实例</strong><span>`localStorage` 按源共享持久 · `sessionStorage` 按页签隔离关页即清</span></div>
  <div class="fact"><strong>storage 事件</strong><span>存储被改时广播给同源其他文档，原生跨页签同步</span></div>
</div>

<div class="boundary-stack mt-6">
  <div class="boundary trusted"><carbon:api /> <strong>本叶（API 编程面）</strong>：方法语义 · storage 事件 · 序列化 · 异常 · 工程封装</div>
  <div v-click class="boundary check"><carbon:link /> <strong>归浏览器章</strong>：隔离模型 · 选型矩阵 · 配额驱逐 · 存储分区（只链接、不展开机制）</div>
</div>

<div v-click class="takeaway mt-5">定义在 WHATWG HTML 标准 Web storage 章，2015-07 起 Baseline Widely available——没有兼容问题，也没有新特性要追，要学的全是语义细节与工程陷阱。</div>

<!--
先把地图摊开。整个 API 就三块：一个 Storage 接口、两个实例、一个 storage 事件。localStorage 与 sessionStorage 方法完全相同，差异只在"数据活多久、谁能看见"。

[click] 关键是这条边界：本叶只讲编程面——方法怎么用、事件怎么触发、字符串怎么序列化、异常怎么兜、怎么封装。隔离模型、跟谁选、配额怎么算、第三方 iframe 怎么分区，这四个机制话题在浏览器章讲透了，这里只链接。

[click] 它 2015 年就 Baseline 了，全绿十几年。好处是一次学会终身有效，代价是"只存字符串、同步阻塞"这些先天设定被永久锁死。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 整个 API 就六个成员，一分钟过完

::left::

```js {1|2-3|4|5-6|7|all}
localStorage.setItem("app:theme", "dark"); // 键、值都被 String() 强转
localStorage.getItem("app:theme");         // "dark"
localStorage.getItem("missing");           // null（不是 undefined）
localStorage.removeItem("app:theme");      // 删不存在的键：静默无事
localStorage.length;                        // 键数（只读属性）
localStorage.key(0);                        // 按索引取键名，越界 → null
localStorage.clear();                       // 清空当前源整个存储区
```

::right::

<table class="decision-table">
  <thead><tr><th>成员</th><th>关键语义 / 边界</th></tr></thead>
  <tbody>
    <tr v-click><td><code>setItem</code></td><td>新增/更新；<strong>值相同即无操作</strong>；满时抛 <code>QuotaExceededError</code></td></tr>
    <tr v-click><td><code>getItem</code></td><td>缺键返回 <code>null</code>（非 <code>undefined</code>），不抛错</td></tr>
    <tr v-click><td><code>removeItem</code></td><td>删不存在的键静默无事</td></tr>
    <tr v-click><td><code>clear</code></td><td>清空当前源整个存储区（会波及同源第三方脚本）</td></tr>
    <tr v-click><td><code>key</code> / <code>length</code></td><td>索引取键名（越界 <code>null</code>）/ 键数；顺序由实现决定</td></tr>
  </tbody>
</table>

<!--
左边这段代码覆盖了全部 API 成员，可直接粘进控制台。Web Storage 没有第七个方法。

[click:5] 逐行看关键边界：setItem 的键和值都会被强制字符串化；getItem 缺键返回的是 null 不是 undefined；removeItem 删不存在的键静默无事；length 和 key(i) 是仅有的枚举原语，key 越界也返回 null；clear 一把清空整个源。

右表把六个成员的语义边界收在一起。三个要背下来的点：setItem 值相同是无操作、getItem 缺键是 null、clear 会波及同源其他脚本。这三个后面都会展开。
-->

---
layout: default
---

# 一套接口，两种生命周期

<div class="grid grid-cols-2 gap-6 mt-4">
  <div class="life-col life-col--local">
    <div class="life-col__head">localStorage</div>
    <div class="life-col__row"><span>隔离粒度</span><span>源（scheme+host+port）</span></div>
    <div class="life-col__row"><span>同源两页签</span><span>共享同一份</span></div>
    <div class="life-col__row"><span>刷新 / 恢复页签</span><span>在</span></div>
    <div class="life-col__row"><span>关页签 / 关浏览器</span><span>在 / 在</span></div>
    <div class="life-col__row"><span>storage 事件受众</span><span>同源其他页签</span></div>
    <div class="life-col__row"><span>典型用途</span><span>主题、语言等跨页签偏好</span></div>
  </div>
  <div class="life-col life-col--session">
    <div class="life-col__head">sessionStorage</div>
    <div class="life-col__row"><span>隔离粒度</span><span>页签 + 源</span></div>
    <div class="life-col__row"><span>同源两页签</span><span>各一份，互不可见</span></div>
    <div class="life-col__row"><span>刷新 / 恢复页签</span><span>在（会话跨刷新存活）</span></div>
    <div class="life-col__row"><span>关页签 / 关浏览器</span><span>清 / 清</span></div>
    <div class="life-col__row"><span>storage 事件受众</span><span>仅同页签内同源文档</span></div>
    <div class="life-col__row"><span>典型用途</span><span>表单草稿、向导步骤</span></div>
  </div>
</div>

<div v-click class="takeaway mt-5">sessionStorage 的"页面会话"比直觉顽强：<strong>刷新不清、崩溃后"恢复标签页"也不清</strong>，只有真正关页签才清——是"防误刷丢数据"的天然容器。而跨页签同步是 localStorage 的专利。</div>

<!--
方法一模一样，差异全在这张对照表。左边 localStorage 按源隔离、同源所有页签共享、持久存活；右边 sessionStorage 按"页签加源"隔离、每个页签各一份、关页签即清。

[click] 最容易考的一条：sessionStorage 的"页面会话"很顽强——刷新不清、浏览器崩溃后"恢复标签页"也不清，只有真正关掉页签才清。所以它天生适合装表单草稿、向导步骤这类怕误刷新丢失的临时态。而"一处改、处处生效"的跨页签同步，只有 localStorage 做得到，下面会专门讲。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 遍历与批量删除：两个必踩的坑

::left::

```js {1-5|7-13|all}
// 正统遍历：length + key(i)，顺序由实现决定
for (let i = 0; i < localStorage.length; i++) {
  const k = localStorage.key(i);
  console.log(k, "=", localStorage.getItem(k));
}

// 批量删除：先收快照再删——边遍历边删会漏项
const doomed = [];
for (let i = 0; i < localStorage.length; i++) {
  const k = localStorage.key(i);
  if (k?.startsWith("cache:")) doomed.push(k);
}
for (const k of doomed) localStorage.removeItem(k);
```

::right::

<div class="fact"><strong>顺序由实现决定</strong><span>规范只保证键数不变期间稳定；跨浏览器、跨会话都可能不同，别依赖"第 0 个是谁"</span></div>
<div v-click class="fact mt-3"><strong>边遍历边删会漏项</strong><span>删除让后续键索引前移，<code>i++</code> 正好跳过一个——必须先收集键名快照再删</span></div>
<div v-click class="fact mt-3"><strong>唯一枚举原语</strong><span><code>length</code> + <code>key(i)</code>；<code>Object.keys</code> 有盲区，见下一页</span></div>

<!--
遍历只有一种正统写法：length 配 key(i)。但这里埋了两个坑。

[click] 第一个：键的顺序由实现决定，规范只保证键数不变期间稳定，不同浏览器甚至同一浏览器不同会话都可能不一样。凡是依赖"第 0 个键是谁"的代码都是错的。

[click] 第二个更隐蔽：边遍历边删。删掉一个键，后面所有键的索引前移一位，i++ 又加一位，正好跳过一个——漏删。正确姿势永远是先收集完整快照、再逐个删。批量枚举一律用 length 加 key(i)，别用 Object.keys，为什么下一页揭晓。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 属性式访问：三宗罪，一律方法式

::left::

```js {1-3|5-7|9-11|all}
localStorage.setItem = "hello"; // 赋值走命名 setter：真写进存储
localStorage.getItem("setItem"); // "hello" —— 数据在库里
typeof localStorage.setItem; // "function" —— 读回的仍是方法！

localStorage.setItem("theme", "dark");
localStorage.length; // 2 —— length 数得到
Object.keys(localStorage); // ["theme"] —— 同名键被隐藏！

localStorage.foo = "x"; // 点号/方括号都能写
localStorage["foo"]; // "x"（键名不撞原型时才安全）
localStorage.setItem("foo", "x"); // 官方推荐：一律方法式
```

::right::

<div class="fact tone-red"><strong>其一 · 原型遮蔽</strong><span>写得进、读回却是原型方法——读写各走各路，不对称</span></div>
<div v-click class="fact tone-amber mt-3"><strong>其二 · 枚举盲区</strong><span><code>Object.keys</code> 数不到与原型成员同名的键（<code>length</code>+<code>key(i)</code> 数得到）</span></div>
<div v-click class="fact tone-blue mt-3"><strong>其三 · 原型污染式风险</strong><span>不可信键名（如 <code>__proto__</code>）直当属性名；方法式永远把键当数据</span></div>

<!--
localStorage.foo = "x" 这种属性式写法能跑，MDN 也列了点号、方括号、方法式三种等效写法，但官方建议永远是方法式。原因是三个实打实的坑。

[click] 其一原型遮蔽：给 localStorage.setItem 赋值确实写进了存储——命名 setter 语义，但属性式读回来时原型成员优先，你读到的还是那个方法。写得进、读不回。

[click] 其二枚举盲区：与原型成员同名的键，length 数得到、key(i) 枚举得到，但 Object.keys 看不见它。批量操作用 Object.keys 就会漏。

[click] 其三最阴：键名来自变量或用户输入时，属性式赋值就是把外部输入直接当对象属性名，__proto__ 之类是原型污染式风险面。方法式 setItem/getItem 永远把键名当数据，天然免疫这一整类问题。
-->

---
layout: default
---

# storage 事件：改的人收不到，别人才收到

<div class="broadcast mt-3">
  <div class="broadcast__origin">
    <strong>页签 A（发起修改）</strong>
    <code>setItem / removeItem / clear()</code>
    <span class="broadcast__self">自己不触发 · 头号考点</span>
  </div>
  <carbon:arrow-down class="text-gray-400 text-xl" />
  <div class="broadcast__bus">广播——仅当<strong>真正发生修改</strong>时（写相同值、删缺键都不发）</div>
  <div class="broadcast__fanout">
    <div v-click class="broadcast__peer"><strong>页签 B</strong><code>storage 事件触发</code><span>同源其他页签</span></div>
    <div v-click class="broadcast__peer"><strong>页签 C</strong><code>storage 事件触发</code><span>同源其他页签</span></div>
    <div v-click class="broadcast__peer"><strong>同源 iframe</strong><code>storage 事件触发</code><span>同页签内也算"其他文档"</span></div>
  </div>
</div>

<div v-click class="signal signal-bad mt-5"><carbon:warning-alt /><span>在发起修改的页面上监听，永远等不到自己的变更——想同页也收到通知，得在封装层自己补派发一个自定义事件。</span></div>

<!--
这是本 API 的头号考点，也是最常见的调试困惑："我 setItem 之后自己的 listener 怎么不跑？"——设计如此。

规则一句话：存储被某文档修改时，事件发给同源的"其他"文档，发起修改的文档自己不触发。而且必须是真正发生了修改——结合前面的无操作语义，写相同的值、删不存在的键,都因为"没有修改"而不触发。

[click:3] 同源的其他页签、其他窗口、甚至同页签里的同源 iframe，都算"其他文档",都会收到。

[click] 所以在发起页监听自己的变更是永远等不到的。真要同页也收到通知，标准做法是在统一写入口里手动派发一个自定义事件——VueUse 的 useStorage、各家 React hook 的同页响应式，内部都是这个补丁。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 事件五字段与 null 语义矩阵

::left::

<table class="decision-table">
  <thead><tr><th>字段</th><th>含义</th></tr></thead>
  <tbody>
    <tr v-click><td><code>key</code></td><td>变动的键名（<code>clear()</code> 时为 <code>null</code>）</td></tr>
    <tr v-click><td><code>oldValue</code></td><td>变动前的值（新增键时 <code>null</code>）</td></tr>
    <tr v-click><td><code>newValue</code></td><td>变动后的值（删除键时 <code>null</code>）</td></tr>
    <tr v-click><td><code>url</code></td><td>发起修改的文档地址（谁改的）</td></tr>
    <tr v-click><td><code>storageArea</code></td><td>被改的 Storage 对象（分辨 local/session）</td></tr>
  </tbody>
</table>

::right::

<table class="decision-table">
  <thead><tr><th>操作</th><th>key</th><th>old</th><th>new</th></tr></thead>
  <tbody>
    <tr><td>新增键</td><td>键名</td><td><code>null</code></td><td>新值</td></tr>
    <tr><td>更新值</td><td>键名</td><td>旧值</td><td>新值</td></tr>
    <tr><td>删除键</td><td>键名</td><td>旧值</td><td><code>null</code></td></tr>
    <tr><td><code>clear()</code></td><td><code>null</code></td><td><code>null</code></td><td><code>null</code></td></tr>
    <tr><td>值相同 / 删缺键</td><td colspan="3">无修改 → 不触发事件</td></tr>
  </tbody>
</table>

<div v-click class="mini-note mt-3"><code>e.newValue === null</code> = 该键被删；<code>e.key === null</code> = 整区被清——多页签登出同步全靠这两个信号。</div>

<!--
StorageEvent 在普通 Event 上加五个只读字段。左表逐个记：key 是变动的键名、oldValue 是旧值、newValue 是新值、url 是谁改的、storageArea 分辨改的是 local 还是 session。

[click:5] 而这五个字段里的 null,本身就是"发生了什么"的编码,右表这张矩阵值得背下来:新增键 oldValue 为 null、删除键 newValue 为 null、clear 则 key/oldValue/newValue 三者全 null。最后一行提醒:值相同、删缺键都不触发事件。

[click] 直接推论:newValue 为 null 就是"这个键被删了",key 为 null 就是"整区被清空"。下一页的多页签登出同步,就是把这两个信号用起来。
-->

---
layout: default
---

# 跨页签实战：删一个键，全端下线

```js {1-5|7-12|all}
// —— 任意页签执行登出 ——
function logout() {
  localStorage.removeItem("session:alive"); // 删除会广播给其他页签
  location.href = "/login";
}

// —— 所有页签的公共代码：监听并跟随 ——
window.addEventListener("storage", (e) => {
  if (e.storageArea !== localStorage) return; // 只认 localStorage 的变化
  if (e.key === "session:alive" && e.newValue === null) location.href = "/login";
  if (e.key === null) location.href = "/login"; // key 为 null = clear()，整区被清
});
```

<div v-click class="takeaway mt-4">发起页因"事件不发给自己"必须<strong>自己先跳转</strong>；监听器只服务别的页签。主题同步同理：改动方写盘 + 本页立即应用，其他页签听 <code>storage</code> 事件跟随换肤。</div>

<!--
把上一页的 null 信号用起来。登出很简单:任意页签删掉 session:alive 这个键,删除动作广播给所有其他页签。

[click:2] 公共监听代码里,先用 storageArea 过滤只认 localStorage;newValue 为 null 说明这个会话键被删了,别的页签登出了,本页跟随跳登录页;key 为 null 说明有人 clear() 了整区,同样按登出处理。

[click] 注意一个必然结论:因为事件不发给发起页,执行 logout 的那个页签必须自己先跳转,监听器只负责"别的页签"。主题同步是同一个套路——切主题的页面自己立即换肤加写盘,其他页签靠 storage 事件跟随。
-->

---
layout: default
class: lab-slide
---

# 交互实验：序列化陷阱实验室

<SerializationTrapLab />

<!--
现在动手。这个实验室用真实 localStorage:点一个预设,现造一个值,按写入方式落盘,再读回并 JSON.parse,左右三行肉眼对比"原值 / 落盘字符串 / 取回值"。

建议演示顺序:先点"普通对象"看无损往返做基线;再点"对象裸存"——不经 JSON.stringify 直接 setItem,落盘变成 [object Object];然后 Date 变字符串、Map 变空对象、undefined 和函数属性被静默跳过、NaN 变 null;最后点"循环引用",看 JSON.stringify 当场抛 TypeError,右下角显示的是真实的错误信息。每跑一次读完就 removeItem 清理,不污染存储。

肉眼看过这一轮丢形,下面几页把每条路径讲成清单。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 只存字符串：String() 的三重伏击

::left::

```js {1-2|4-6|8-10|all}
localStorage.setItem("user", { name: "Alex" });
localStorage.getItem("user"); // "[object Object]" —— 什么都不剩

localStorage.setItem("token", undefined);
localStorage.getItem("token"); // "undefined"（字符串！）
JSON.parse(localStorage.getItem("token")); // SyntaxError —— 读时爆炸

localStorage.setItem("count", 1);
localStorage.getItem("count") + 1; // "11" —— 字符串拼接
localStorage.getItem("count") === 1; // false
```

::right::

<div class="rule-stack mt-1">
  <div class="rule tone-red"><strong>对象 → "[object Object]"</strong><span>裸存对象数据实质丢失，是纯事故</span></div>
  <div v-click class="rule tone-amber"><strong>undefined → "undefined"</strong><span>写侧 bug，几天后读侧 <code>JSON.parse</code> 才爆炸</span></div>
  <div v-click class="rule tone-blue"><strong>数字/布尔 → 字符串</strong><span>运算前先 <code>Number()</code>、比较前显式转换</span></div>
</div>

<div v-click class="takeaway mt-4">存结构化数据的唯一正道：写 <code>setItem(k, JSON.stringify(v))</code>、读 <code>JSON.parse(getItem(k) ?? "{}")</code>。</div>

<!--
Web Storage 一切序列化问题的总根源是一句话:键和值写入前都被强制 String()。三重伏击按杀伤力排序。

[click:3] 伏击一,对象直接存进去是 String(对象),也就是 [object Object],什么都不剩。伏击二最阴,变量意外为 undefined 时 setItem 存进的是字符串 "undefined",几天后另一处 JSON.parse 它抛 SyntaxError,栈里完全看不到肇事者——这是典型的写侧 bug 在读侧爆炸。伏击三,数字和布尔读回来都是字符串,"1" 加 1 是 "11" 不是 2。

[click] 所以存任何结构化数据的标准姿势就一条:写的时候 JSON.stringify,读的时候 JSON.parse 加缺键兜底。但 JSON 往返本身又有一张丢形清单,下一页。
-->

---
layout: default
---

# JSON 往返丢形清单：静默的比抛错的更危险

<table class="decision-table mt-3">
  <thead><tr><th>原始值</th><th><code>stringify</code> 结果</th><th><code>parse</code> 回来</th><th>定性</th></tr></thead>
  <tbody>
    <tr v-click><td>对象属性 <code>undefined</code>/函数/<code>Symbol</code></td><td>键被跳过</td><td>键不存在</td><td>静默丢</td></tr>
    <tr v-click><td>数组元素 <code>undefined</code>/函数/<code>Symbol</code></td><td><code>null</code></td><td><code>null</code></td><td>静默变形</td></tr>
    <tr v-click><td><code>Date</code></td><td>ISO 字符串</td><td>字符串（非 <code>Date</code>）</td><td>丢类型</td></tr>
    <tr v-click><td><code>Map</code> / <code>Set</code> / <code>RegExp</code> / <code>Blob</code></td><td><code>"{}"</code></td><td>空对象</td><td>全丢</td></tr>
    <tr v-click><td><code>NaN</code> / <code>Infinity</code></td><td><code>null</code></td><td><code>null</code></td><td>静默变形</td></tr>
    <tr v-click><td><code>BigInt</code> / 循环引用</td><td>抛 <code>TypeError</code></td><td>——</td><td>显式炸</td></tr>
  </tbody>
</table>

<div v-click class="takeaway mt-4"><code>BigInt</code>、循环引用当场炸你立刻知道；<code>undefined</code> 属性、<code>Map</code>、<code>NaN</code> 是<strong>无声变形</strong>——写时一切正常，几周后读出来结构对不上。往 Storage 放的对象要保持"纯 JSON"形状。</div>

<!--
这张表刚才在实验室里已经亲眼见过,现在收成清单。每一行都实测过。

[click:6] 对象里的 undefined、函数、Symbol 属性,键直接被跳过;放在数组里则变成 null。Date 变 ISO 字符串,类型丢了。Map、Set、RegExp、Blob 全部序列化成空对象。NaN、Infinity 变 null。BigInt 和循环引用则当场抛 TypeError。

[click] 工程结论就一句:静默丢比抛错更危险。BigInt 和循环引用炸得响,你立刻知道;而 undefined 属性、Map、NaN 是无声变形,写的时候一切正常,几周后读出来的数据结构对不上,排查起来要命。凡是往 Storage 里放的对象,形状要保持纯 JSON:字符串、有限数字、布尔、null、普通对象、数组,其余先手动转换。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 读侧防御：null、脏数据与 Date 恢复

::left::

```js {1-2|4-9|all}
JSON.parse(null); // null —— 不抛错（null→"null"再解析）
JSON.parse("undefined"); // SyntaxError —— 库里躺着它就炸

function readJSON(key, fallback = null) {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback; // ① 显式判 null，区分"没存过"
  try { return JSON.parse(raw); } // ② parse 必须 try-catch
  catch { localStorage.removeItem(key); return fallback; } // ③ 脏数据顺手清
}
```

::right::

<div class="fact"><strong>缺键是 <code>null</code> 不是 <code>undefined</code></strong><span>判存在用 <code>=== null</code>；falsy 判断会把存过 <code>""</code>/<code>"0"</code> 的键误判成没存过</span></div>
<div v-click class="fact mt-3"><strong><code>Date</code> 用 reviver 恢复</strong><span><code>JSON.parse(s, (k,v) =&gt; k==="at" ? new Date(v) : v)</code>；或干脆存时间戳数字</span></div>
<div v-click class="fact mt-3"><strong>脏数据是常态</strong><span>localStorage 用户可改、旧版本残留常见——"库里一定是我写的合法 JSON"是错误前提</span></div>

<!--
读侧的组合陷阱先看两行:JSON.parse(null) 碰巧不抛错,因为 null 被转成字符串 "null" 再解析——但这是巧合不是设计;JSON.parse("undefined") 就直接 SyntaxError,而伏击二存进来的正是它。

[click:2] 所以完整的读侧防御是三步:第一步显式判 null,把"没存过"和"存过空串"分开;第二步 parse 必须裹 try-catch;第三步 catch 里顺手把脏数据删掉,避免下次反复炸。

右边三个要点。缺键判断一定要用等于 null,别用 falsy,否则存过空字符串或 "0" 的键会被误判。Date 用 reviver 按键名恢复,或者一开始就存时间戳。最后一句是心态:localStorage 对用户完全可写,DevTools 里随便改,旧版本还留格式残留——把"库里的值一定合法"当前提,迟早翻车。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 写侧唯一常态异常：QuotaExceededError

::left::

```js {1-2|3-9|all}
function safeSet(key, value) {
  try { localStorage.setItem(key, value); return true; }
  catch (e) {
    // MDN 官方判错：确认是配额问题而非 SecurityError
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      evictReproducible(); // 清理可再生（缓存类）键
      try { localStorage.setItem(key, value); return true; } // 重试一次
      catch { return false; } // 还满 → 降级：内存 / IndexedDB
    }
    return false;
  }
}
```

::right::

<div class="fact"><strong><code>setItem</code> 是唯一常态抛错口</strong><span>满时同步抛 <code>QuotaExceededError</code>——每个 <code>setItem</code> 都必须 try-catch</span></div>
<div v-click class="fact mt-3"><strong><code>SecurityError</code> 是另一类</strong><span>禁站点数据、不透明源——访问 <code>window.localStorage</code> 属性本身就抛，与配额无关</span></div>
<div v-click class="signal signal-good mt-3"><carbon:time /><span>Safari 隐私模式历史坑已成历史：旧版配额 0、<code>setItem</code> 必抛；现代浏览器统一"可正常写、关窗即清"</span></div>

<!--
读侧永不抛错、删除静默,整个 API 唯一会常态抛错的就是 setItem——存储满时同步抛 QuotaExceededError。所以规矩只有一条没有例外:每个 setItem 都必须在 try-catch 里。

[click] 左边是处理模板,优先级是清理可再生数据、重试一次、还满就降级。判错要用 MDN 的官方写法:e instanceof DOMException 且 e.name 等于 QuotaExceededError,这一步是为了和 SecurityError 区分开。

[click] SecurityError 是完全不同的一类——不是满了,而是根本不让你碰:用户禁了站点数据、代码跑在 data 这类不透明源里,访问 window.localStorage 属性本身就抛。

[click] 最后澄清一个老坑:网上很多文章说"隐私模式写不进 localStorage",那说的是旧版 Safari 隐私模式配额为 0 的历史行为。现代浏览器包括 Safari 已经统一为:隐私窗口内可正常读写,只是关窗即清,表现像 sessionStorage。
-->

---
layout: default
---

# 同步 API 的代价与三个姿势

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="fact"><strong>读走内存</strong><span>启动时一次读入 Map，之后读走内存、写透（write-through）回存储</span></div>
  <div v-click class="fact"><strong>高频写防抖</strong><span>草稿、滚动位置合并落盘，别每次键入都 <code>setItem</code></span></div>
  <div v-click class="fact"><strong>别塞巨型单键</strong><span>小改动 = 整串重序列化 + 重解析；拆多键按需读写</span></div>
</div>

<div v-click class="signal signal-bad mt-6"><carbon:warning-alt /><span>每次读写都<strong>同步阻塞主线程</strong>，且 Worker / Service Worker 里完全不可用；大值、高频写是实打实的卡顿来源。</span></div>

<div v-click class="takeaway mt-5">量化口径（5 MiB 怎么算、多大算卡）在浏览器章配额页；本叶只给"怎么写才不卡"的工程姿势。</div>

<!--
Web Storage 每次读写都同步阻塞主线程,这是它的先天设定。三个姿势把开销压到最低。

姿势一:启动时一次性把本应用前缀的键读入内存 Map,之后读操作全走内存、写操作先改内存再写透回存储——同步开销压到每会话常数次。

[click] 姿势二:编辑器草稿、滚动位置这类每秒变多次的状态,防抖之后再落盘,别每次键入都 setItem。

[click] 姿势三反面提醒:别把所有状态塞成一个巨型 JSON 键,任何小改动都要整串重序列化重解析,拆成多个键按需读写才符合它"小键值"的定位。

[click] 补一句边界:它在 Worker 和 Service Worker 里根本不存在。具体多大算卡、5 MiB 怎么算,那是浏览器章配额页的量化口径,这里只给工程姿势。
-->

---
layout: default
---

# 业务不直接碰 localStorage：五个标准封装件

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="fact"><strong>TTL 信封</strong><span>值包成 <code>{ v, e:过期戳 }</code>，读时惰性过期即删</span></div>
  <div v-click class="fact"><strong>命名空间前缀</strong><span><code>应用:模块:键</code>，批量清理只清自己，绝不裸 <code>clear()</code></span></div>
  <div v-click class="fact"><strong>TS 泛型包装</strong><span>一张 Schema 映射键名→值类型，拼错/类型不符编译期报</span></div>
  <div v-click class="fact"><strong>版本迁移</strong><span>版本号键 + 逐版本迁移链，迁移函数必须幂等</span></div>
  <div v-click class="fact"><strong>SSR 守卫</strong><span><code>typeof window</code> 检查 + 挂载后再读，模块顶层不碰</span></div>
  <div v-click class="fact"><strong>写失败降级</strong><span>封装层内置内存 Map，配额满/被禁本会话不塌</span></div>
</div>

<div v-click class="takeaway mt-5">VueUse <code>useStorage</code>、usehooks-ts <code>useLocalStorage</code> 就是这套路数的成品——本叶价值在讲透它们内部在做什么。</div>

<!--
裸的 localStorage 用在一个地方很清爽,用到第三个模块问题全浮现:序列化到处重复、键名打架、没有生命周期。所以工程共识是:业务代码不直接碰 localStorage,一律经过一层薄封装。这层封装有六个标准件。

[click:5] TTL 信封:值包进带过期戳的信封,读时惰性过期即删。命名空间前缀:键名统一三段式,批量清理只清自己前缀,绝不裸 clear()。TS 泛型包装:一张 Schema 接口把键名映射到值类型,拼错键名、值类型不符都在编译期报。版本迁移:专设版本号键加逐版本迁移链,每个迁移函数必须幂等。SSR 守卫:typeof window 检查加挂载后再读。写失败降级:封装层内置内存 Map,配额满或被禁时本会话功能不塌,只丢持久化。

[click] 这六件不用自己从零写:VueUse 的 useStorage、usehooks-ts 的 useLocalStorage 就是成品,本叶的价值是让你知道它们内部在做什么。SSR 守卫这件最容易漏,下一页单独讲。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# SSR 守卫与框架时机

::left::

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";

// 首帧用默认值（与服务端产物一致）
const theme = ref<"light" | "dark">("light");

onMounted(() => {
  // onMounted 只在浏览器执行：
  // 天然 SSR 守卫 + 水合安全时机
  const saved = localStorage.getItem("app:theme");
  if (saved === "dark" || saved === "light") theme.value = saved;
});
</script>
```

::right::

<div class="fact"><strong>模块顶层不碰 storage</strong><span>import 即执行，服务端没有 <code>window</code> → SSR 直接抛</span></div>
<div v-click class="fact mt-3"><strong>为什么要等挂载后</strong><span>服务端 HTML 不含本地 storage 值，首帧直接按它渲染 → 水合错位</span></div>
<div v-click class="fact mt-3"><strong>框架对应时机</strong><span>Vue <code>onMounted</code> · React <code>useEffect</code>；现成 hook 已带这层守卫</span></div>

<!--
SSR 是封装里最容易翻车的一件。localStorage 只存在于浏览器的 window 上,Nuxt、Next 这类框架的服务端阶段没有它。

关键有两层。第一层防炸:模块顶层千万别写 localStorage.getItem,因为 import 即执行,服务端渲染直接抛错。第二层防水合错位:服务端渲染的 HTML 里不可能包含用户本地的 storage 值,客户端首帧如果直接按 storage 渲染,就会和服务端产物对不上。

[click:2] 所以正确姿势是:首帧用默认值渲染,和服务端一致;等挂载之后再从 storage 恢复。Vue 里这个时机是 onMounted,React 里是 useEffect,它们都只在浏览器执行,天然就是 SSR 守卫加水合安全时机。用现成 hook 时这层已经带上了,自己裸写才要操心。
-->

---
layout: default
---

# 何时升级 IndexedDB：数据长出了尺码

<table class="decision-table mt-4">
  <thead><tr><th>信号</th><th>为什么 Web Storage 顶不住</th></tr></thead>
  <tbody>
    <tr v-click><td>单值几十 KB+、总量逼近 MiB 级</td><td>同步读写 + JSON 往返开销可感知；约 5 MiB 天花板在望</td></tr>
    <tr v-click><td>要保形（<code>Date</code>/<code>Map</code>/<code>Blob</code>/二进制）</td><td>JSON 丢形躲不开；IndexedDB 结构化克隆原样存取</td></tr>
    <tr v-click><td>要按字段查询、排序、分页</td><td>键值模型只能全量取回自己过滤；IndexedDB 有索引游标</td></tr>
    <tr v-click><td>Worker / Service Worker 里要访问</td><td>Web Storage 在 Worker 中不存在</td></tr>
    <tr v-click><td>写频率高到防抖也救不了</td><td>异步事务不阻塞主线程</td></tr>
  </tbody>
</table>

<div v-click class="takeaway mt-5">满足任何一条就迁 IndexedDB；小体量、扁平、同步读写无压力的偏好类数据，Web Storage 仍是最顺手的答案。</div>

<!--
封装能解决舒适性问题,解决不了先天限制。出现下面任何一条信号,说明数据已经长出了 Web Storage 的尺码。

[click:5] 单值几十 KB 以上、总量逼近 MiB 级,同步加 JSON 往返的开销开始可感知,5 MiB 天花板也在望;需要保形存 Date、Map、二进制,JSON 丢形躲不开,而 IndexedDB 结构化克隆原样存取;需要按字段查询排序分页,键值模型只能全量取回自己过滤,IndexedDB 有索引和游标;要在 Worker 里访问,Web Storage 根本不存在;写频率高到防抖也救不了,异步事务不阻塞主线程。

[click] 反过来说,满足任何一条就迁 IndexedDB;但小体量、结构扁平、同步读写无压力的偏好类数据,Web Storage 仍然是最顺手的答案,别为了"高级"而过度工程。
-->

---
layout: default
---

# 易错点 TOP 8：出问题先查这里

<div class="grid grid-cols-2 gap-3 mt-4">
  <div v-click class="fact"><strong><code>getItem</code> 缺键当 <code>undefined</code> 用</strong><span>判存在要 <code>=== null</code>；falsy 判断误伤存过 <code>""</code>/<code>"0"</code> 的键</span></div>
  <div v-click class="fact"><strong><code>setItem</code> 不裹 try-catch</strong><span>满时同步抛 <code>QuotaExceededError</code>，唯一常态异常口</span></div>
  <div v-click class="fact"><strong>在发起页等自己的 storage 事件</strong><span>永远等不到，设计如此；同页要通知得自派发</span></div>
  <div v-click class="fact"><strong>拿 sessionStorage 跨页签同步</strong><span>各页签独立副本——跨页签只能用 localStorage</span></div>
  <div v-click class="fact"><strong><code>Object.keys</code> 做批量清理</strong><span>数不到与原型成员同名的键——用 <code>length</code>+<code>key(i)</code></span></div>
  <div v-click class="fact"><strong>裸调 <code>clear()</code></strong><span>清掉同源第三方脚本的键——只删自己前缀</span></div>
  <div v-click class="fact"><strong>对象塞 <code>Date</code>/<code>Map</code> 指望原样取回</strong><span>JSON 丢形——保形去 IndexedDB</span></div>
  <div v-click class="fact"><strong>把 token 存 localStorage</strong><span>同源 XSS 一行读光——敏感凭证进 HttpOnly Cookie</span></div>
</div>

<!--
全叶的坑浓缩成八条,按排查频率排序,收不到、读不对、写翻车先查这里。

[click:8] 一,getItem 缺键当 undefined 用,判存在一定要等于 null。二,setItem 不裹 try-catch,满时同步抛。三,在发起页等自己的 storage 事件,永远等不到。四,拿 sessionStorage 做跨页签同步,各页签是独立副本。五,Object.keys 做批量清理数不全,用 length 加 key(i)。六,裸调 clear() 会清掉同源其他脚本的键,只删自己前缀。七,对象里塞 Date、Map 指望原样取回,JSON 会丢形。八,把 token 存 localStorage,同源 XSS 一行读光,敏感凭证该进 HttpOnly Cookie。
-->

---
layout: center
class: summary-slide
---

# 带走四个判断

<div class="summary-grid mt-8">
  <div><span>01</span><strong>读侧永不抛错，写侧必 try-catch</strong><small>缺键返回 <code>null</code>；<code>setItem</code> 满时抛 <code>QuotaExceededError</code></small></div>
  <div><span>02</span><strong>只存字符串，对象靠 JSON 往返</strong><small><code>Date</code>/<code>Map</code>/<code>undefined</code>/<code>NaN</code> 各有丢形，循环引用/<code>BigInt</code> 抛错</small></div>
  <div><span>03</span><strong>storage 事件只发别人</strong><small>发起页自己不触发；<code>newValue</code>/<code>key</code> 为 <code>null</code> 是删除/清空信号</small></div>
  <div><span>04</span><strong>业务经一层薄封装</strong><small>TTL/前缀/泛型/迁移/SSR 守卫；顶不住就升 IndexedDB</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API" target="_blank"><carbon:book /> MDN 使用指南</a>
  <a href="https://html.spec.whatwg.org/multipage/webstorage.html" target="_blank"><carbon:document /> HTML Living Standard</a>
  <a href="https://github.com/whatwg/html" target="_blank"><carbon:logo-github /> whatwg/html</a>
</div>

<!--
四句话复盘。第一,读侧永不抛错、写侧必须 try-catch:缺键返回 null,setItem 满时抛 QuotaExceededError。第二,只存字符串,对象靠 JSON 往返,而 JSON 有一张丢形清单,Date、Map、undefined、NaN 各有姿势,循环引用和 BigInt 直接抛。第三,storage 事件只发别人不发自己,newValue 或 key 为 null 是删除和清空的信号。第四,业务代码经一层薄封装:TTL、前缀、泛型、迁移、SSR 守卫,顶不住就升 IndexedDB。

规范原文在 HTML Living Standard 的 Web storage 章,MDN 使用指南给了特性检测和 storage 事件的完整示例,值得通读一次。
-->
