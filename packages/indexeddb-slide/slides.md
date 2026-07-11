---
theme: seriph
layout: cover
title: IndexedDB
info: |
  浏览器内建的事务型对象数据库：请求-事件心智、事务模型与 await 失活、CRUD/索引/游标、版本与多标签页、idb/Dexie 生态。

  Learn more at [MDN IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark">IDB</div>

# IndexedDB

## 浏览器里唯一的「真数据库」：请求-事件、事务、版本化 schema

<div class="cover-meta">
  <span>W3C IndexedDB 3.0 · Editor's Draft</span>
  <span>事务 · 索引游标 · 版本化</span>
  <span>window / Worker / Service Worker</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" target="_blank" class="slidev-icon-btn" aria-label="MDN IndexedDB">
    <carbon:document />
  </a>
  <a href="https://github.com/w3c/IndexedDB" target="_blank" class="slidev-icon-btn" aria-label="w3c/IndexedDB GitHub">
    <carbon:logo-github />
  </a>
</div>

<!--
这一讲不做 API 目录。IndexedDB 是浏览器内建的事务型对象数据库——请求-事件心智、事务、版本化 schema、索引与游标一应俱全，在 window / Web Worker / Service Worker 全量可用。

口径基于 W3C IndexedDB 3.0 现行草案，核于 2026 年 7 月：commit()、databases()、durability 提示已广泛落地，getAllRecords() 等最新提案仍在铺开。定位选型与配额驱逐属于浏览器存储章，本讲专注 API 编程深度：打开与升级、事务与自动提交深坑、CRUD/索引/游标、多标签页协调、以及 idb/Dexie 生态。
-->

---
layout: default
---

# 为什么需要浏览器内的数据库

<div class="grid grid-cols-3 gap-4 mt-8">
  <div v-click class="fact"><strong>localStorage</strong><span>同步字符串 KV，几 MB；只配三五个偏好字段</span></div>
  <div v-click class="fact"><strong>IndexedDB</strong><span>异步事务型对象库，GB 级源配额，索引 + 游标查询，离线优先标配</span></div>
  <div v-click class="fact"><strong>OPFS</strong><span>文件语义，字节级随机读写，承载 wasm 数据库</span></div>
</div>

<div class="grid grid-cols-3 gap-4 mt-5">
  <div v-click class="fact"><strong>结构化克隆</strong><span>对象 / Date / Map / Blob 原样进出，免 JSON 序列化</span></div>
  <div v-click class="fact"><strong>全环境可用</strong><span>window / Worker / SW 同一套 API，重 I/O 挪出主线程</span></div>
  <div v-click class="fact"><strong>结构化演进</strong><span>版本号 + 升级事务，把改表约束在唯一入口</span></div>
</div>

<div v-click class="takeaway mt-8">
  它是什么、和 Web Storage / OPFS 怎么选、能存多大何时被清 —— 归<strong>浏览器存储章</strong>；本讲专注 <strong>API 编程深度</strong>。
</div>

<!--
先回答「为什么不用 localStorage 就好」。三种浏览器存储各管一段：localStorage 是同步字符串 KV，只配三五个偏好字段；IndexedDB 是异步事务型对象数据库，走 GB 级源配额、有索引和游标，是离线优先应用的事实标配；OPFS 是文件语义，适合字节级随机读写和 wasm 数据库文件。

[click:3] IndexedDB 的三个底色：结构化克隆直接存对象、免 JSON；window/Worker/SW 全环境同一套 API；版本号 + 升级事务让 schema 演进有唯一入口。

[click] 它的定位、和 OPFS/Web Storage 怎么选、配额驱逐规则属于浏览器存储章，本讲只专注 API 编程。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 心智模型：一切皆请求，结果走事件

::left::

```js {1-2|4-6|7-9|all}
// 调用 → 立即拿到 IDBRequest（此刻还没有结果）
const request = store.get(1);

request.onsuccess = () => {
  console.log("查到：", request.result); // 结果挂在 result
};
request.onerror = () => {
  console.error("失败：", request.error); // 错误挂在 error
};
```

::right::

<div class="rule-stack mt-1">
  <div v-click class="rule tone-green"><strong>onsuccess ≈ then</strong><span>request.result ≈ resolve 值</span></div>
  <div v-click class="rule tone-red"><strong>onerror ≈ catch</strong><span>request.error 装 DOMException</span></div>
  <div v-click class="rule tone-blue"><strong>请求活在事务里</strong><span>除打开 / 删库外，每个请求都隶属某个事务</span></div>
</div>

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>请求的生命周期 = 事务的生命周期，这是下一个坑的根源</span>
</div>

<!--
IndexedDB 诞生于 Promise 之前，整套 API 是事件驱动的请求-回调。三个对象的关系理解了，后面所有 API 都是同一个模式的重复：调用立即返回 IDBRequest，此刻操作尚未发生；后台完成后触发 success 或 error，结果放 request.result、错误放 request.error。

[click:2] 和 Promise 对齐着记：onsuccess 约等于 then、onerror 约等于 catch、result 约等于 resolve 值。

[click] 但有个关键区别：请求活在事务的生命周期里。这带来了 IndexedDB 最特殊、也最容易踩的约束——事务自动提交与失活，是第八页的主题。
-->

---
layout: default
---

# open 与 onupgradeneeded：带版本号的打开

<div class="grid grid-cols-[1fr_1fr] gap-8 mt-4 items-start">

```js {1|3-4|5-9|10|all}
const req = indexedDB.open("todo-db", 1);

req.onupgradeneeded = () => {
  const db = req.result; // 独占 versionchange 事务
  // ⭐ 唯一能建 / 删 store 与索引的地方
  const store = db.createObjectStore("todos", {
    keyPath: "id",
    autoIncrement: true,
  });
  store.createIndex("by_done", "done");
};

req.onsuccess = () => { /* 拿到 IDBDatabase 连接 */ };
```

<table class="decision-table">
  <thead><tr><th>open 的 version</th><th>结果</th></tr></thead>
  <tbody>
    <tr v-click><td>库不存在</td><td>建库，upgradeneeded(oldVersion=0) → success</td></tr>
    <tr v-click><td>高于现存</td><td>upgradeneeded（升级）→ success</td></tr>
    <tr v-click><td>等于现存</td><td>直接 success</td></tr>
    <tr v-click><td>低于现存</td><td>error：VersionError</td></tr>
  </tbody>
</table>
</div>

<div v-click class="mini-note mt-4">版本号 = 从 1 起的无符号整数；小数被取整（2.1 与 2.4 都是 2）；<strong>只增不减</strong>。</div>

<!--
open 同时承担「打开」和「建库 / 升级」两件事，靠版本号分流。onupgradeneeded 回调运行在一笔独占的 versionchange 事务里——createObjectStore / createIndex 只在这里合法，其他时机调用抛 InvalidStateError。

[click:4] 右边四种情形要记牢：库不存在则建库、oldVersion 为 0；version 更高则升级；相等直接 success；更低直接 VersionError。

[click] 版本号是从 1 起的无符号整数，传小数会被取整，2.1 和 2.4 都当 2。纪律是只增不减——线上到了 v5 就不能再发 v4 的代码，否则老用户全部 VersionError。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 三步用库：事务 → 存储 → 请求

::left::

```js {1|2|3-4|6-7|all}
const tx = db.transaction("todos", "readwrite");  // ① 开事务
const store = tx.objectStore("todos");            // ② 拿存储
store.add({ title: "学习 IndexedDB", done: false }); // ③ 发请求
store.add({ title: "写周报", done: true });

tx.oncomplete = () => console.log("整笔落库"); // 写成功看事务
tx.onerror = () => console.error("失败：", tx.error);
```

::right::

<div class="rule-stack mt-1">
  <div v-click class="rule tone-blue"><strong>① db.transaction(stores, mode)</strong><span>开事务：作用域 + 模式</span></div>
  <div v-click class="rule tone-green"><strong>② tx.objectStore(name)</strong><span>拿作用域内的对象存储</span></div>
  <div v-click class="rule tone-amber"><strong>③ store.add / put / get(…)</strong><span>发 IDBRequest，同笔原子提交</span></div>
</div>

<div v-click class="signal signal-good mt-4">
  <carbon:checkmark-outline />
  <span><strong>tx.oncomplete</strong> 才代表落库；单个请求 success 只是「被接受」</span>
</div>

<!--
用库永远是这三步：db.transaction 开事务（列出作用域和模式）、tx.objectStore 拿存储、然后 add/put/get 发请求。同一事务内连发多个请求，整笔原子提交。

[click:3] 三步在右边一一对应。

[click] 最容易错的判据：单个请求的 success 只代表「该请求被接受」，tx.oncomplete 才代表整笔事务真正落库；失败走 onerror / onabort。写成功看事务，不看单个请求。
-->

---
layout: default
---

# 事务模型：三模式、作用域与自动提交

<div class="grid grid-cols-[1fr_1fr] gap-8 mt-4 items-start">

<table class="decision-table">
  <thead><tr><th>模式</th><th>并发规则</th></tr></thead>
  <tbody>
    <tr v-click><td><code>readonly</code></td><td>任意多个可同时跑（含作用域重叠）</td></tr>
    <tr v-click><td><code>readwrite</code></td><td>作用域重叠者按创建序串行；不重叠可并行</td></tr>
    <tr v-click><td><code>versionchange</code></td><td>独占全库；仅 open 升级触发</td></tr>
  </tbody>
</table>

<div class="rule-stack">
  <div v-click class="rule tone-green"><strong>创建即启动 → 活跃</strong><span>transaction() 返回即计生命周期</span></div>
  <div v-click class="rule tone-amber"><strong>回事件循环 → 失活</strong><span>本任务结束，事务暂时失活</span></div>
  <div v-click class="rule tone-blue"><strong>无新请求 → 自动提交</strong><span>没有「开着不用、留到以后」的事务</span></div>
</div>
</div>

<div v-click class="takeaway mt-5">作用域往小里列、模式往小里选：<code>db.transaction(db.objectStoreNames, "readwrite")</code> 全库大锁是吞吐杀手。</div>

<!--
除打开 / 删库外的一切读写都在事务里。三种模式：readonly 可任意并发；readwrite 作用域重叠者按创建序串行、不重叠可并行；versionchange 独占全库、只能由 open 升级触发，这保证了 schema 变更天然独占。

[click:3] 生命周期没有显式的 begin/commit：创建即启动进入活跃；控制权回到事件循环就失活；活跃期没有新请求且没有未决请求就自动提交。

[click] 两条工程纪律：作用域只列真正要碰的 store、能 readonly 就别 readwrite。全库大锁是吞吐杀手。下一页现场演示这个模型最著名的坑。
-->

---
layout: default
class: lab-slide
---

# 交互实验：事务失活实验室

<TransactionLab />

<!--
这是真实的浏览器 IndexedDB，不是模拟。现场点两个按钮对比。

左路「事务内同步连续 put」：开事务、连发两个 put，全程在创建任务这个活跃窗口内，事务正常提交，tx.oncomplete 落库。

右路「事务内 await 后再 put」：先同步 put 一条（活跃），然后 await 一个慢 Promise——这里用 setTimeout 制造一个真实的宏任务边界，模拟 await fetch，不发真实网络。等待期间控制权回到事件循环，事务没有未决请求就自动提交了；慢 Promise 在另一个任务里 resolve，我们的续行代码再发 put，就同步抛 TransactionInactiveError。

强调：这个坑换 idb / Dexie 也躲不掉，是规范级的事务生命周期行为，包装库改的是语法不是命。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# await 失活：await IDB 安全，await fetch 必死

::left::

````md magic-move {at:1}
```js
// 💥 灾难：await fetch 跨了一个任务
store.put(localDraft);            // 活跃：创建任务内
const r = await fetch("/api/1");  // 控制权回事件循环 → 事务自动提交
store.put(r);                     // TransactionInactiveError
```

```js
// ✅ 正确：异步准备在事务外，事务内一气呵成
const r = await fetch("/api/1").then((x) => x.json()); // 先取数
const tx = db.transaction("todos", "readwrite");
tx.objectStore("todos").put(localDraft);
tx.objectStore("todos").put(r); // 全程只发 IDB 请求，不跨任务
```
````

::right::

<div class="boundary-stack mt-1">
  <div v-click class="boundary trusted"><carbon:checkmark /> await IDB 请求：在 success 任务的微任务里恢复 → 仍活跃</div>
  <div v-click class="boundary external"><carbon:warning-alt /> await fetch / setTimeout：续行在别的任务 → 事务已提交</div>
</div>

<div v-click class="takeaway mt-4">心智规则：<strong>事务内只 await IDB 自己的请求</strong>。换 idb / Dexie 不换命（Dexie 有 waitFor 逃生舱）。</div>

<!--
把上一页的机制放进 async/await，就得到最著名的陷阱。左边灾难代码：put 一条（活跃），await fetch，等待期间事务提交，再 put 就抛 TransactionInactiveError。

[click] 正确姿势是把异步准备挪到事务外——先 fetch 拿到数据，再开事务，事务内全程只发 IDB 请求。

[click:2] 为什么 await IDB 请求没事、await fetch 必死？失活边界是事件循环任务：包装了 IDB 请求的 Promise 在请求 success 事件的任务里 resolve，续行作为同一任务的微任务执行，彼时事务仍活跃；而 fetch/setTimeout 的续行在别的任务里，事务早提交了。

[click] 心智规则就一句：事务内只 await IDB 自己的请求。这个坑是规范级的，idb 和 Dexie 都逃不掉，Dexie 只是多了个 waitFor 逃生舱。
-->

---
layout: default
---

# durability：complete 到底承诺了什么

<div class="release-grid mt-5">
  <div class="release-hero">
    <span class="release-label">Chrome 121 起默认 relaxed</span>
    <strong>3~30×</strong>
    <span>官方实测：relaxed 相对 strict 的写入提速</span>
  </div>
  <div class="release-detail tone-green">
    <carbon:flash />
    <strong>relaxed</strong>
    <span>交到 OS 写缓冲即算 complete —— 缓存 / 可重建数据 / 绝大多数场景</span>
  </div>
  <div class="release-detail tone-blue">
    <carbon:security />
    <strong>strict</strong>
    <span>刷盘确认后才 complete —— 账本 / 用户创作内容 / 迁移落点</span>
  </div>
  <div class="release-detail tone-amber">
    <carbon:warning />
    <strong>default</strong>
    <span>交给浏览器桶默认策略；<strong>complete ≠ 已刷盘</strong></span>
  </div>
</div>

<div v-click class="takeaway mt-5">关键不可重算数据显式换保证：<code>db.transaction("ledger", "readwrite", { durability: "strict" })</code>。</div>

<!--
durability 是事务的落盘语义提示。三个取值：relaxed 表示改动交到操作系统写缓冲即算 complete，不等物理刷盘，适合缓存和可重建数据，也就是绝大多数场景；strict 表示刷盘确认后才算 complete，用于账本、用户创作内容这类不可重算的关键数据；default 交给浏览器桶策略。

关键结论：Chromium 从 Chrome 121 起默认策略就是 relaxed，官方实测提速 3 到 30 倍，Firefox 自版本 40 起也是宽松语义。推论是 tx.oncomplete 不等于数据已在磁盘上。

[click] 接受不了「提交成功后立刻断电可能丢」这个窗口，就显式声明 durability strict 换刷盘确认——更慢，但 complete 后数据确定已持久化。注意它是提示，跨浏览器别当硬合同。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 错误冒泡与默认中止：preventDefault 保事务

::left::

```js {1|3-8|10-11|all}
const req = store.add({ id: 1, title: "重复主键" });

req.onerror = (event) => {
  if (req.error?.name === "ConstraintError") {
    event.preventDefault();  // ⭐ 取消默认=中止事务，让事务继续
    event.stopPropagation(); // 可选：不再向 tx / db 冒泡
    console.warn("该条已存在，跳过");
  }
};

tx.onabort = () => console.error("中止：", tx.error); // 配额超限也走这
tx.oncomplete = () => console.log("整笔落库");
```

::right::

<div class="boundary-stack mt-1">
  <div v-click class="boundary external"><carbon:cloud /> request 请求级</div>
  <carbon:arrow-down />
  <div v-click class="boundary check"><carbon:security /> transaction 事务级</div>
  <carbon:arrow-down />
  <div v-click class="boundary trusted"><carbon:checkmark /> database 全库兜底</div>
</div>

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span>未 preventDefault 的错误<strong>默认中止整笔事务</strong>；stopPropagation 只拦冒泡拦不住中止</span>
</div>

<!--
错误事件沿 request 到 transaction 再到 database 三级冒泡，可以按粒度接。

[click:2] 最关键的语义在这：未被 preventDefault 的错误，其默认行为就是中止整个事务——事务内已经成功的请求也一并回滚。想「单个请求失败、事务继续」，必须在错误回调里 preventDefault；stopPropagation 只拦冒泡，救不了事务。

[click] 另外两点：回调里抛未捕获异常同样中止事务；配额超限 QuotaExceededError 是从 onabort 收到的。db.onerror 是全库兜底日志的好位置。
-->

---
layout: default
---

# 键：IndexedDB 数据设计的地基

<div class="key-chain mt-6">
  <code>number</code><span class="lt">&lt;</span>
  <code>Date</code><span class="lt">&lt;</span>
  <code>string</code><span class="lt">&lt;</span>
  <code>binary</code><span class="lt">&lt;</span>
  <code>array</code>
  <em>跨类型全序（boolean / null / undefined / 对象非法 → DataError）</em>
</div>

<table class="decision-table mt-6">
  <thead><tr><th>keyPath</th><th>autoIncrement</th><th>行为</th></tr></thead>
  <tbody>
    <tr v-click><td>无</td><td>无</td><td>存任意值，add / put 必须显式传 key（out-of-line）</td></tr>
    <tr v-click><td>有</td><td>无</td><td>只能存对象，键取自 keyPath 属性（in-line）</td></tr>
    <tr v-click><td>无</td><td>有</td><td>存任意值；不传 key 时自动生成</td></tr>
    <tr v-click><td>有</td><td>有</td><td>带属性则用之，缺失则生成并写回该属性</td></tr>
  </tbody>
</table>

<div v-click class="mini-note mt-4">自增键从 1 起、<strong>只增不减</strong>——删记录 / 清空 store 都不重置计数器；封顶 2^53。</div>

<!--
一切查询都建立在键有全序之上。合法键是数字（NaN 除外）、Date、字符串、二进制、以及它们组成的数组；boolean、null、undefined、普通对象都非法，用了抛 DataError。跨类型顺序背下来：number 小于 Date 小于 string 小于 binary 小于 array。

[click:4] 键从哪来由 keyPath 和 autoIncrement 两个选项的四种组合决定：都无就显式传键；有 keyPath 就从属性取；有 autoIncrement 就自动生成；两者都有则带属性用属性、缺了就生成并写回。

[click] 自增键的脾气：从 1 起、只增不减，删记录和清空 store 都不回收号码，封顶 2 的 53 次方。
-->

---
layout: two-cols-header
layoutClass: gap-x-10 grid-rows-[88px_1fr]
---

# add vs put：没有「部分更新」这回事

::left::

### add —— 只插入，防覆盖

```js
store.add({ id: 1, name: "张三" });
// id=1 已存在 → 请求报 ConstraintError
```

<div v-click class="mini-note">导入去重用 add + 捕获 ConstraintError（记得 preventDefault 保事务）。</div>

::right::

### put —— upsert，整条覆盖

```js
store.put({ id: 1, name: "张三改" });
// 存在即整条替换；不是合并补丁
```

<div v-click class="mini-note">改一个字段的标准流程：get → 改对象 → put（同一事务内保证原子）。</div>

<div v-click class="col-span-2 signal signal-bad mt-5">
  <carbon:warning-alt />
  <span>非法键 <code>DataError</code>、值含函数 / DOM 节点 <code>DataCloneError</code> —— 都在<strong>调用当下同步抛</strong>，不走事件</span>
</div>

<!--
add 和 put 的分工要分清。add 是「只插入」，键已存在就抛 ConstraintError，价值是防覆盖——导入数据、消息去重这类「存在即跳过」的场景用它。

put 是 upsert，存在即整条覆盖。注意这是「整条替换」不是「合并补丁」——想改一个字段，标准流程是 get 出来、改对象、再 put 回去，同一事务内完成保证原子。IndexedDB 没有部分更新原语，Dexie 的 update 帮你封装的正是这套 get 改 put。

[click:3] 还有一类容易漏的错：传了非法键抛 DataError、值含函数或 DOM 节点抛 DataCloneError，这两类是在调用瞬间同步抛的，不走请求的 error 事件——try/catch 和 onerror 要两手都有。
-->

---
layout: default
---

# 索引：给对象另开检索维度

```js {2|3|4|5|all}
// ⚠️ 只能在 onupgradeneeded 的升级事务里建
store.createIndex("by_author", "author");                  // 普通索引（可重复）
store.createIndex("by_slug", "slug", { unique: true });    // 唯一：撞值 ConstraintError
store.createIndex("by_tag", "tags", { multiEntry: true }); // 数组每元素各建一条
store.createIndex("by_a_d", ["author", "publishedAt"]);    // 复合：按数组序
```

<div class="grid grid-cols-3 gap-4 mt-6">
  <div v-click class="fact"><strong>unique 升级坑</strong><span>给已有数据建 unique，存量重复会让整个升级事务失败——先清洗再建</span></div>
  <div v-click class="fact"><strong>multiEntry</strong><span>「按标签查文章」的标准解法；不能与数组 keyPath 同用</span></div>
  <div v-click class="fact"><strong>稀疏语义</strong><span>缺该字段的记录不进索引——idx.getAll 可能比 store.getAll 少</span></div>
</div>

<div v-click class="takeaway mt-5">索引有<strong>写放大</strong>：每多一个，每次写入多一份维护——按真实查询建，别「先都建上」。</div>

<!--
对象存储只按主键有序，要按其他字段查就建索引——一个以该字段值为键、指回主键的影子有序结构。索引只能在 onupgradeneeded 升级事务里建，其余时机抛 InvalidStateError。

[click:3] 三种选项各有暗坑。unique 最大的坑在升级期：对已有数据建 unique 索引，存量一旦有重复，createIndex 会让整个升级事务失败、版本升不上去，得先游标清洗再建。multiEntry 是「按标签查文章」的标准解法，数组每个元素各建一条索引项。稀疏语义要记牢：记录缺失该字段就不进索引，所以 idx.getAll 拿到的可能比 store.getAll 少，这不是 bug 是语义。

[click] 索引有写放大，每多一个索引每次写入就多一份维护开销，按真实查询需求建。
-->

---
layout: default
---

# IDBKeyRange：四个工厂读懂所有范围

<table class="decision-table mt-4">
  <thead><tr><th>工厂</th><th>含义</th><th>数学写法</th></tr></thead>
  <tbody>
    <tr v-click><td><code>only(v)</code></td><td>恰好等于</td><td>key = v</td></tr>
    <tr v-click><td><code>lowerBound(x, open?)</code></td><td>从 x 起</td><td>key ≥ x（open 则 &gt; x）</td></tr>
    <tr v-click><td><code>upperBound(y, open?)</code></td><td>到 y 止</td><td>key ≤ y（open 则 &lt; y）</td></tr>
    <tr v-click><td><code>bound(x, y, lo?, uo?)</code></td><td>区间</td><td>x ≤ key ≤ y</td></tr>
    <tr v-click><td><code>includes(key)</code></td><td>实例法：命中判断</td><td>—</td></tr>
  </tbody>
</table>

<div class="grid grid-cols-2 gap-4 mt-5">
  <div v-click class="fact"><strong>open = 开区间 = 不含端点</strong><span>默认 false（含端点）；记忆锚点</span></div>
  <div v-click class="fact"><strong>前缀查询惯用法</strong><span>bound(x, x + 哨兵) 近似「以 x 开头」，哨兵取排序最大字符封顶</span></div>
</div>

<!--
IDBKeyRange 是贯穿全 API 的查询语言，所有读方法都接受键或键范围。四个工厂：only 恰好等于、lowerBound 从下界起、upperBound 到上界止、bound 区间。

[click:5] 每个工厂的 open 参数控制端点开闭。

[click:2] 记忆锚点就一条：open 等于 true 表示开区间、不含端点，默认 false 含端点。实例方法 includes 判断任意键是否落在范围内。字符串前缀查询有个惯用法：bound 配一个排序最大的哨兵字符封顶上界，近似「以某前缀开头」。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 游标：逐条扫描与原位改写

::left::

```js {1|2-3|4|5|6|all}
store.openCursor(IDBKeyRange.lowerBound(100), "prev").onsuccess = (e) => {
  const cursor = e.target.result;
  if (!cursor) return; // result 为 null = 扫完
  console.log(cursor.key, cursor.value);
  if (cursor.value.draft) cursor.delete(); // 原位删
  cursor.continue(); // 推进：再次触发本 onsuccess
};
```

::right::

<table class="decision-table mt-1">
  <thead><tr><th></th><th>openCursor</th><th>openKeyCursor</th></tr></thead>
  <tbody>
    <tr v-click><td>返回</td><td>带 value</td><td>只有键、更快</td></tr>
    <tr v-click><td>改删</td><td>update / delete 可用</td><td>不可（InvalidStateError）</td></tr>
  </tbody>
</table>

<div v-click class="mini-note mt-3">方向四值：<code>next</code>(默认升序) / <code>prev</code> / <code>nextunique</code> / <code>prevunique</code>（跳过重复索引键）。</div>

<div v-click class="mini-note mt-2">推进三动词：<code>continue(key?)</code> 下一条·跳段 / <code>advance(n)</code> 跳过 n 条 / <code>continuePrimaryKey</code>（仅索引游标·断点续扫）。</div>

<!--
getAll 解决整段取回，游标解决三类它做不了的事：边扫边改删、只取部分后提前停、低内存遍历超大集合。每次 continue 都会再次触发 onsuccess，result 为 null 表示扫完。

[click:2] 两种游标：openCursor 带 value、可以 update/delete；openKeyCursor 只有键、更快，但不能改删，调 update 会抛 InvalidStateError。只要键就用 openKeyCursor 省掉值物化。

[click:2] 方向四值 next/prev/nextunique/prevunique，unique 变体在索引上跳过重复索引键。推进三动词：continue 下一条或跳段、advance 跳过 n 条、continuePrimaryKey 仅索引游标可用、是断点续扫神器。
-->

---
layout: default
---

# getAll vs 游标：取舍口径

<table class="decision-table mt-4">
  <thead><tr><th>维度</th><th>getAll(query, count)</th><th>游标</th></tr></thead>
  <tbody>
    <tr v-click><td>内存</td><td>一次物化全部命中（大集合峰值）</td><td>每次只在手一条</td></tr>
    <tr v-click><td>速度</td><td>一次往返、引擎批量取，通常更快</td><td>每条一次事件循环往返</td></tr>
    <tr v-click><td>中途停 / 跳</td><td>只能靠 count 截断</td><td>continue(key) / advance 自由跳</td></tr>
    <tr v-click><td>边扫边写</td><td>不能</td><td>update / delete 原位</td></tr>
    <tr v-click><td>倒序</td><td>不支持方向</td><td>prev 即可</td></tr>
  </tbody>
</table>

<div v-click class="takeaway mt-5">
  结论：要「全部对象数组」就 getAll；只看键或要逐条控制就游标（只要键配 getAllKeys / openKeyCursor 更省）。折中：分块 <code>getAll(range, 500)</code>。
</div>

<div v-click class="mini-note mt-3">3.0 新提案 <code>getAllRecords()</code> 返回 key / primaryKey / value 且支持 direction，补齐主键 + 倒序——<strong>实验性、非 Baseline</strong>，留游标回退。</div>

<!--
getAll 一次物化全部命中，大集合有内存峰值，但一次往返、引擎内部批量取，通常更快；游标每次只在手一条、低内存，但每条一次事件循环往返，条数大时显著变慢——慢在往返不在读。

[click:5] 中途停跳、边扫边写、倒序这三件事只有游标能做。

[click] MDN 的口径可以直接当结论：要全部对象数组就 getAll，只看键或要逐条控制就游标，只要键配 getAllKeys 或 openKeyCursor 更省。工程折中是分块 getAll。

[click] 3.0 新提案 getAllRecords 一把返回 key/primaryKey/value 且支持 direction，补齐 getAll 拿不到主键和不能倒序两块短板，但目前实验性、非 Baseline，生产要留游标回退。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 版本与多标签页：blocked / versionchange 二重奏

::left::

```js {1|3-6|8-12|all}
const req = indexedDB.open("app-db", 3);

// 升级侧：被旧连接挡住 → 挂起（不是 error）
req.onblocked = () => {
  alert("请关闭本站其他标签页以完成升级");
};

req.onsuccess = () => {
  const db = req.result;
  // 旧连接侧：有人要升级，主动让路
  db.onversionchange = () => db.close();
};
```

::right::

<div class="boundary-stack mt-1">
  <div v-click class="boundary check"><carbon:document /> 新标签页 open(v3) 想升级</div>
  <carbon:arrow-down />
  <div v-click class="boundary external"><carbon:warning-alt /> 旧连接没关 → 升级侧 blocked</div>
  <carbon:arrow-down />
  <div v-click class="boundary trusted"><carbon:checkmark /> 旧连接 onversionchange → close → 升级继续</div>
</div>

<div v-click class="takeaway mt-4">黄金搭档：<strong>onversionchange → close + 提示刷新</strong> ＋ 升级侧 onblocked 兜底——两边都写才闭环。</div>

<!--
IndexedDB 是同源共享的，同一站点开三个标签页连的是同一个库。矛盾在于升级需要独占，而其他标签页可能开着旧连接。IndexedDB 用一对事件协调。

[click:3] 升级侧：open 被旧连接挡住触发 blocked，注意这不是 error，只是挂起，等旧连接关闭后自动继续。旧连接侧：收到 versionchange 事件，正确响应是主动 db.close 让路，否则对方一直 blocked。

[click] 黄金搭档是两边都写：旧连接 onversionchange 里 close 加提示刷新，升级侧 onblocked 兜底提示关闭其他标签页。只写一边都不闭环。这个「拿到连接就 onversionchange close」的单连接礼仪，是绝大多数 SPA 的默认最优解。
-->

---
layout: default
---

# 结构化克隆：能存什么、存进去变成什么

<table class="decision-table mt-4">
  <thead><tr><th>能原样存取</th><th>存不了 / 会变形</th></tr></thead>
  <tbody>
    <tr v-click><td>原始值、普通对象、数组</td><td>函数（DataCloneError）</td></tr>
    <tr v-click><td>Date、RegExp、Map、Set</td><td>DOM 节点（DataCloneError）</td></tr>
    <tr v-click><td>Blob、File</td><td>Error（跨浏览器不一致）</td></tr>
    <tr v-click><td>ArrayBuffer、TypedArray</td><td>原型链、类方法（类实例取出变普通对象）</td></tr>
  </tbody>
</table>

<div class="grid grid-cols-2 gap-4 mt-5">
  <div v-click class="fact"><strong>存取皆深拷贝</strong><span>put 存的是当下快照，get 返回全新副本——无引用共享</span></div>
  <div v-click class="fact"><strong>类实例会降级</strong><span>取回是纯数据对象，instanceof 与方法尽失——存纯数据、取出重建</span></div>
</div>

<!--
IndexedDB 存值走结构化克隆算法，这决定了能存什么和存取的引用语义。左列原样存取：原始值、普通对象、数组、Date、RegExp、Map、Set、Blob、File、ArrayBuffer、TypedArray。右列存不了或会变形：函数和 DOM 节点抛 DataCloneError，Error 跨浏览器不一致，原型链和类方法会丢。二进制是一等公民，存用户上传的图片直接丢整个 Blob 进去。

[click:4] 两个工程直觉。

[click:2] 存取都是深拷贝：put 存的是调用当下的快照，之后改对象不影响库；get 返回全新副本，没有引用共享。类实例会降级：put 一个 User 实例，取回来是普通字段对象，方法和 instanceof 都没了——要保留行为就存纯数据、取出后再 new 重建。
-->

---
layout: default
---

# idb vs Dexie：几乎不该裸写

<table class="decision-table mt-4">
  <thead><tr><th>维度</th><th>裸写原生</th><th>idb</th><th>Dexie</th></tr></thead>
  <tbody>
    <tr v-click><td>体积 / 范式</td><td>0 / 事件回调</td><td>~1~2 KB / Promise 镜像</td><td>几十 KB / 前端 ORM</td></tr>
    <tr v-click><td>事务完成</td><td>听 oncomplete</td><td>tx.done Promise</td><td>async 事务 + 自动回滚</td></tr>
    <tr v-click><td>游标 / 查询</td><td>事件 + continue</td><td>for await 迭代</td><td>where().equals() 链式</td></tr>
    <tr v-click><td>响应式</td><td>无（自搭 BroadcastChannel）</td><td>无</td><td>liveQuery + 框架 hooks</td></tr>
    <tr v-click><td>await 失活坑</td><td>有</td><td>有（规范级）</td><td>有（Dexie.waitFor 逃生舱）</td></tr>
  </tbody>
</table>

<div v-click class="takeaway mt-5">最薄壳、保留原生心智 → <strong>idb</strong>；要查询链 / 响应式 / 迁移 / 云同步 → <strong>Dexie</strong>。</div>

<!--
原生 API 生于 Promise 之前，回调地狱、与 async/await 打架、样板繁重、无查询语言、多标签页要自理、无响应式——web.dev 和 MDN 都建议别裸写生产代码。

[click:5] 两条主流路线。idb 是最薄的 Promise 镜像，约 1 到 2 KB，一对一把每个 API Promise 化，心智几乎不变，亮点是 tx.done 把事务是否落库变成可 await 的 Promise、游标变 for await 异步迭代。Dexie 是前端 ORM，有声明式 schema、链式查询、自动迁移，杀手锏是 liveQuery 响应式——数据一变查询结果自动重发，这是原生没有的能力。注意 await 失活坑三者都有，规范级。

[click] 选型：保留原生心智、极小体积选 idb；要查询链、响应式、迁移、云同步选 Dexie。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 适用场景决策：什么时候选谁

::left::

<div class="rule-stack mt-1">
  <div v-click class="rule tone-blue"><strong>保留原生心智、消灭样板、极小体积</strong><span>→ idb（1~2 KB，API 一对一 Promise 化）</span></div>
  <div v-click class="rule tone-green"><strong>查询链 / 响应式 UI / 迁移 / 云同步</strong><span>→ Dexie（前端 ORM，liveQuery 是杀手锏）</span></div>
</div>

::right::

<div class="rule-stack mt-1">
  <div v-click class="rule tone-amber"><strong>只缓存三五个偏好字段</strong><span>→ 别开数据库，用 localStorage</span></div>
  <div v-click class="rule tone-red"><strong>大二进制 / 字节级随机读写 / wasm 库文件</strong><span>→ OPFS（对比见浏览器章）</span></div>
</div>

<div v-click class="col-span-2 takeaway mt-6">一句话：<strong>前端要「真数据库」就是 IndexedDB，但几乎不该裸写</strong>——按「要不要查询引擎与响应式」二选一即可。</div>

<!--
把选型收成一张决策图。

[click:2] 要用 IndexedDB 时：想保留原生心智、只求消灭回调样板、极致小体积，选 idb；要查询链、响应式 UI、声明式迁移、批量操作、云同步，选 Dexie。

[click:2] 但也要知道什么时候别用 IndexedDB：只缓存三五个偏好字段就用 localStorage，别开数据库；大二进制、字节级随机读写、wasm 数据库文件走 OPFS。

[click] 一句话收束：前端要真数据库就是 IndexedDB，但几乎不该裸写，按要不要查询引擎与响应式二选一即可。
-->

---
layout: default
---

# 易错点 TOP

<div class="summary-grid mt-6">
  <div v-click><span>01</span><strong>事务内 await 非 IDB 异步</strong><small>TransactionInactiveError——异步准备放事务外</small></div>
  <div v-click><span>02</span><strong>把 add 当 put 用</strong><small>重复键 ConstraintError——upsert 用 put</small></div>
  <div v-click><span>03</span><strong>put 半个对象想「部分更新」</strong><small>整条覆盖——先 get 改再 put</small></div>
  <div v-click><span>04</span><strong>非升级期建索引</strong><small>InvalidStateError——只能在 upgradeneeded</small></div>
  <div v-click><span>05</span><strong>给重复数据建 unique 索引</strong><small>升级事务直接失败——先清洗再建</small></div>
  <div v-click><span>06</span><strong>误信 complete = 已刷盘</strong><small>默认 relaxed——关键数据用 strict</small></div>
  <div v-click><span>07</span><strong>版本号发布倒退</strong><small>老用户 VersionError——版本只增不减</small></div>
  <div v-click><span>08</span><strong>不写 onversionchange</strong><small>别的标签页永远 blocked 升不了级</small></div>
</div>

<!--
八个高频坑串一遍。头号是事务内 await 非 IDB 异步、抛 TransactionInactiveError，异步准备放事务外。把 add 当 put 用会撞 ConstraintError。put 半个对象想部分更新——put 是整条覆盖，先 get 改再 put。非升级期建索引抛 InvalidStateError。给已有重复数据建 unique 索引会让升级事务直接失败、版本升不上去。误信 complete 等于已刷盘——默认 relaxed 只保证交给 OS。版本号发布倒退会让老用户 VersionError。不写 onversionchange，别的标签页永远 blocked。

这些坑几乎都在前面每一页出现过，能全部避开就说明 IndexedDB 的心智模型真正建立起来了。
-->

---
layout: center
class: summary-slide
---

# 带走四个判断

<div class="summary-grid mt-8">
  <div><span>01</span><strong>一切皆请求</strong><small>结果走事件，写成功看 tx.oncomplete</small></div>
  <div><span>02</span><strong>事务内只 await IDB 请求</strong><small>失活是规范级，换库不换命</small></div>
  <div><span>03</span><strong>schema 只在升级改</strong><small>版本只增不减，多标签页写协调礼仪</small></div>
  <div><span>04</span><strong>几乎不该裸写</strong><small>idb 保守、Dexie 全能</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB" target="_blank"><carbon:book /> Using IndexedDB</a>
  <a href="https://developer.chrome.com/blog/indexeddb-durability-mode-now-defaults-to-relaxed" target="_blank"><carbon:flash /> durability relaxed</a>
  <a href="https://github.com/jakearchibald/idb" target="_blank"><carbon:logo-github /> idb</a>
  <a href="https://dexie.org/" target="_blank"><carbon:data-base /> Dexie</a>
</div>

<!--
最后用四句话复盘。第一，一切皆请求、结果走事件，写成功的判据是 tx.oncomplete 不是单个请求。第二，事务内只 await IDB 自己的请求，失活是规范级行为、换库不换命。第三，schema 只能在升级事务里改、版本号只增不减，多标签页要写 onversionchange close 的协调礼仪。第四，前端要真数据库就是 IndexedDB，但几乎不该裸写，idb 保守、Dexie 全能。

掌握这四条，再深入结构化克隆边界、getAllRecords 这些细节就有稳定的判断基座。链接留了 MDN 的 Using IndexedDB 教程、Chrome durability 公告、以及 idb 和 Dexie 官方文档。
-->
