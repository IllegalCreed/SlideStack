---
theme: seriph
background: https://cover.sli.dev
title: JavaScript 异步编程
info: |
  JavaScript 异步全链路 —— 事件循环、回调、Promise、async/await、取消与竞态
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:javascript class="text-8xl" />
</div>

<br/>

## JavaScript 异步编程

单线程为何「不阻塞」：从事件循环到取消机制（基于现代 JavaScript · ES2025）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
引擎只有一条调用栈，却能同时下载、定时、响应点击——秘密全在事件循环。这一章把异步的来龙去脉讲透。
-->

---
transition: fade-out
---

# 这一章讲什么

一条主线：**同步阻塞 → 回调 → Promise → async/await**

<v-click>

- **地基**：事件循环、调用栈、宏任务 vs 微任务
- **起点**：回调与回调地狱、控制反转
- **拉平**：Promise 三态、链式、错误冒泡、组合器
- **顺手**：async/await、顺序 vs 并行、顶层 await
- **收尾**：AbortController 取消、超时、竞态防护

</v-click>

<v-click>

> 看懂事件循环，就理解了后面所有「为什么这样跑」。

</v-click>

---
layout: section
---

# 事件循环

单线程「不阻塞」的本体

---

# 同步阻塞：问题所在

引擎只有**一条调用栈**，一行不结束下一行不开始

```js
function sleepSync(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {} // 死循环占着调用栈
}
console.log("开始");
sleepSync(3000); // 这 3 秒：点击无响应、动画卡住
console.log("结束");
```

<v-click>

渲染、事件、JS 共用这条线程 → **同步耗时操作 = 页面假死**。异步要解决的就是「发起耗时操作时不阻塞这条线程」。

</v-click>

---

# 调用栈：单线程的本体

函数调用入栈、返回出栈，LIFO（后进先出）

```js
function foo(b) {
  return b + 11;
}
function bar(x) {
  return foo(x * 3); // 调用 foo，foo 入栈
}
const baz = bar(7); // bar 入栈；baz === 32
```

<v-click>

整个引擎**只有这一条栈**——栈在跑代码时谁都插不进来。这就是「单线程」，也是下面「运行到完成」的根源。

</v-click>

---

# 运行到完成：任务不可被打断

每个任务一旦开始，就**完整跑完**，中途不被打断

```js
const p = Promise.resolve();
let i = 0;
p.then(() => { i += 1; console.log(i); }); // 1
p.then(() => { i += 1; console.log(i); }); // 2
// 输出顺序恒定：1 → 2
```

<v-click>

好处是**确定性**：不必担心变量在两行之间被偷改。代价是：重任务（大循环）会一直占栈，**渲染和事件都得等它**。

</v-click>

---

# 事件循环：栈空时取任务

耗时操作由宿主在后台处理，完成后回调**排队**

<v-click>

- 引擎进入「等任务 → 取任务 → 执行 → 再等」的无限循环
- 队列分两类，**优先级不同**——这是整章核心

</v-click>

<v-click>

| 类别 | 来源举例 |
| --- | --- |
| 宏任务 task | `setTimeout`、I/O、UI 事件、整段脚本 |
| 微任务 microtask | `Promise.then`、`queueMicrotask`、`MutationObserver` |

</v-click>

---

# 调度铁律：微任务优先

每跑完一个宏任务，先**清空整个微任务队列**

<v-click>

1. 从宏任务队列取**一个**最老的，执行到完成
2. **清空整个微任务队列**（含其间新产生的微任务）
3. 如有需要，渲染
4. 回到第 1 步

</v-click>

<v-click>

口诀：**一个宏任务 → 掏空所有微任务 →（可能渲染）→ 下一个宏任务**。

</v-click>

---

# 执行顺序：必考排序题

```js
console.log("1 同步");
setTimeout(() => console.log("4 宏任务"), 0);
Promise.resolve().then(() => console.log("3 微任务"));
console.log("2 同步");
// 输出：1 同步 → 2 同步 → 3 微任务 → 4 宏任务
```

<v-click>

**同步全跑完 → 清空所有微任务 → 才取一个宏任务**。即便 `setTimeout` 写 `0`，也排在微任务之后。

</v-click>

---

# 进阶排序：微任务里再排宏任务

```js
console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
Promise.resolve().then(() => setTimeout(() => console.log(4)));
Promise.resolve().then(() => console.log(5));
setTimeout(() => console.log(6));
console.log(7);
// 输出：1 7 3 5 2 6 4
```

<v-click>

`1 7` 同步 → `3 5` 清微任务（中间排的 `4` 进宏任务队尾）→ `2 6 4` 逐个取宏任务。

</v-click>

---

# queueMicrotask：不借 Promise 排微任务

把逻辑推迟到同步代码之后、任何宏任务之前

```js
console.log("A");
queueMicrotask(() => console.log("B 微任务"));
console.log("C");
// 输出：A → C → B 微任务
```

<v-click>

和 `Promise.resolve().then(...)` 进**同一队列、同一时机**，但语义更直白、开销更小。典型用于库作者保证回调「恒定异步」。

</v-click>

---

# 渲染只在宏任务之间

微任务里疯狂改 DOM，用户**一帧都看不到**

```js
const box = document.querySelector("#box");
// 三次改色都在微任务里，用户只看到最后的蓝
Promise.resolve().then(() => (box.style.background = "red"));
Promise.resolve().then(() => (box.style.background = "green"));
Promise.resolve().then(() => (box.style.background = "blue"));
```

<v-click>

微任务队列被「一次性清空」，期间不重绘。想逐帧展示进度，须把每步放进**不同宏任务**；动画对齐用 `requestAnimationFrame`。

</v-click>

---

# `setTimeout(fn, 0)` 的两个真相

很多人以为它「立刻执行」，其实有两个坑

<v-click>

1. **它是宏任务**：要等当前同步 + 所有微任务跑完才轮到
2. **最小 4ms**：嵌套调用超过 5 层后，规范强制延迟钳到至少 **4ms**，即便你写 `0`

</v-click>

<v-click>

```js
function loop() {
  if (Date.now() - start < 100) setTimeout(loop); // 嵌套调度
} // 前几次间隔很小，之后趋于每次约 4ms
```

</v-click>

---

# 拆分长任务：让重计算不冻结页面

每块结束用 `setTimeout(0)` 把控制权交还事件循环

```js
function countChunk() {
  do { i++; /* 一小批工作 */ } while (i % 1e6 !== 0);
  if (i < end) setTimeout(countChunk); // 交还控制权 → 可渲染
  else console.log("完成");
}
countChunk();
```

<v-click>

页面在整个计算期间仍能响应交互、刷新进度。更精细可用 `MessageChannel`，或 `scheduler.yield`（渐进增强）。

</v-click>

---
layout: section
---

# 回调与回调地狱

异步的第一代解法，与它的四宗罪

---

# 回调：把「之后做什么」传进去

不等结果，把「结果就绪后做什么」打包交出去

```js
console.log("发起");
setTimeout(() => {
  console.log("1 秒后由浏览器调用这个回调");
}, 1000);
console.log("继续，不阻塞");
// 输出：发起 → 继续，不阻塞 →（1 秒后）回调
```

<v-click>

回调本身没问题，问题出在**组合**——当多个异步操作需要按顺序依赖时。

</v-click>

---

# 错误优先约定（error-first）

Node 风格：第一个参数恒为错误，无错则 `null`

```js
fs.readFile("/data.txt", "utf8", (err, data) => {
  if (err) {
    console.error("读取失败：", err); // 每次手动检查
    return; // 别忘 return
  }
  console.log("内容：", data);
});
```

<v-click>

约定让错误处理有统一形态，但**每一层回调都要重复 `if (err)`**，逻辑散落各处。

</v-click>

---

# 回调地狱：金字塔噩梦

下一步依赖上一步 → 只能往里嵌套

```js
login(user, (err, token) => {
  if (err) return handle(err);
  getUser(token, (err, profile) => {
    if (err) return handle(err);
    getOrders(profile.id, (err, orders) => {
      console.log(orders); // 业务逻辑被推到最深处
    });
  });
});
```

<v-click>

可读性差、错误处理重复、难复用重构、顺序与并发混在一起。

</v-click>

---

# try/catch 抓不到异步错误

初学者最容易踩的坑

```js
try {
  setTimeout(() => {
    throw new Error("定时器里炸了");
  }, 1000);
} catch (err) {
  console.error("抓到了吗？", err); // ❌ 永远进不来
}
```

<v-click>

回调在**另一个宏任务、另一条全新调用栈**上执行，那时包它的 `try` 早已出栈。错误无处可去 → 全局未捕获异常。

</v-click>

---

# 控制反转：信任危机

回调交给第三方，你交出了**控制权**

```js
thirdPartyCheckout(order, function onSuccess(receipt) {
  chargeCreditCard(receipt); // 扣款
});
```

<v-click>

第三方可能：

- 一次都不调（付了钱却没反应）
- 调用多次（信用卡**重复扣款**）
- 同步立即调，破坏时序假设
- 把回调吞进 try/catch，让异常神秘消失

</v-click>

---

# Promise 如何破局

控制权**回到你手里**，从机制上堵死隐患

<v-click>

- 异步操作返回一个 `Promise` **对象**给你
- 由**你**来 `.then()` 决定后续
- 状态一旦敲定**不可逆**、回调**至多触发一次**

</v-click>

<v-click>

> 「调多次」「调零次」「时序错乱」的隐患被一次性封死——这正是 `Promise` 诞生的理由。

</v-click>

---

# Zalgo：别让 API 时同步时异步

同一函数有时同步、有时异步触发回调

```js
function getData(key, cb) {
  if (cache[key]) cb(cache[key]); // 同步：回调抢先跑
  else fetchRemote(key, (d) => cb(d)); // 异步：下轮才跑
}
getData("a", (d) => console.log("回调", d));
console.log("之后"); // 命中缓存在「回调」后，未命中在前——非确定
```

<v-click>

修法：用 `queueMicrotask` 把同步分支也推迟，**让回调恒定异步**。`Promise.then` 在规范层面内建免疫。

</v-click>

---
layout: section
---

# Promise 基础

不可逆的三态机，拉平嵌套

---

# 一个对象，三种状态

状态转移**单向且不可逆**，敲定后再也不变

| 状态 | 含义 | 携带 |
| --- | --- | --- |
| `pending` | 待定：还没结束 | 无 |
| `fulfilled` | 已兑现：成功 | 兑现值 value |
| `rejected` | 已拒绝：失败 | 拒绝原因 reason |

<v-click>

「不可逆」是 `Promise` 比回调可靠的根基——从机制上保证结果**至多产生一次**。

</v-click>

---

# 创建 Promise

`new Promise((resolve, reject) => {…})`，执行器同步执行

```js
const p = new Promise((resolve, reject) => {
  const ok = Math.random() > 0.5;
  if (ok) resolve("成功的值"); // pending → fulfilled
  else reject(new Error("失败的原因")); // pending → rejected
  // 之后再调用 resolve/reject 都无效——状态已敲定
});
```

<v-click>

实际开发很少自己 `new`——`fetch`、`fs.promises`、各种 SDK 都已返回 `Promise`。手写主要用于**包装老式回调 API**。

</v-click>

---

# then / catch / finally

| 方法 | 作用 |
| --- | --- |
| `then(onF, onR)` | 注册兑现 / 拒绝回调，**返回新 Promise** |
| `catch(onR)` | `then(null, onR)` 简写，专捕拒绝 |
| `finally(fn)` | 无论成败都执行，不接值、不改结果 |

<v-click>

- 回调**永不同步**触发——即便已敲定也排进微任务
- `finally` 最适合清理（关 loading）

</v-click>

---

# 链式：把嵌套拉成直线

`then` 返回新 Promise → 可一路 `.then` 下去

```js
login(user)
  .then((token) => getUser(token)) // 返回 Promise
  .then((profile) => getOrders(profile.id)) // 上一步的值传进来
  .then((orders) => console.log(orders))
  .catch((err) => handle(err)); // 一个 catch 兜住全链
```

<v-click>

对比回调地狱版本，金字塔被拉成一条**扁平的直线**。

</v-click>

---

# 返回值如何在链上流动

回调的**返回值**决定下一个 Promise 的兑现值

```js
Promise.resolve(5)
  .then((x) => x * 2) // 返回普通值 10
  .then((x) => x + 3) // 收到 10，返回 13
  .then((x) => console.log(x)); // 13
```

<v-click>

若回调**返回一个 Promise**，链会**自动等它敲定**，再把兑现值往下传（展开 / 同化）——`fetch(url).then(res => res.json())` 正靠这点。

</v-click>

---

# 必须 return，否则链不等它

最常见的链式 bug：**忘了 `return`**

```js
// ❌ 漏 return：链不等 fetch，下一步拿到 undefined
.then((url) => {
  fetch(url).then((res) => res.json());
})
// ✅ 加 return：链等内部 Promise 敲定后再继续
.then((url) => {
  return fetch(url).then((res) => res.json());
})
```

<v-click>

口诀：**在 `then` 里发起的每个 Promise，都要 `return`**（用 async/await 能从根本上避开）。

</v-click>

---

# 错误冒泡：跳过 then 直奔 catch

任一步抛错或拒绝 → 跳过其后所有 `then`

```js
doSomething()
  .then((r) => doStep2(r)) // 若这里抛错…
  .then((r2) => doStep3(r2)) // …被跳过
  .then((r3) => doStep4(r3)) // …也被跳过
  .catch((err) => console.error(err)); // 直接到这
```

<v-click>

和同步 `try`/`catch` 一一对应——一个 `catch` 放链尾，兜住链上**任何一环**的错误。

</v-click>

---

# catch 之后链可以继续

`catch` 也返回新 Promise，没再抛错就**恢复兑现**

```js
fetchFromCDN()
  .catch(() => fetchFromBackup()) // CDN 失败就退而求其次
  .then((data) => render(data)) // 走 CDN 或备份都到这
  .catch((err) => showError(err)); // 两个源都挂才到这
```

<v-click>

这可用于**错误降级**。养成「每条链以 `catch` 收尾」的习惯，避免 `unhandledrejection` 静默吞错。

</v-click>

---
layout: section
---

# Promise 组合器

把「一批 Promise」聚成「一个 Promise」

---

# 四个静态组合器

区别全在于**「什么时候敲定、敲定成什么」**

| 组合器 | 何时兑现 | 何时拒绝 |
| --- | --- | --- |
| `all` | **全部**兑现 | **任一**拒绝（fail-fast） |
| `allSettled` | **全部**敲定 | **永不**拒绝 |
| `race` | 第一个**敲定**是兑现 | 第一个**敲定**是拒绝 |
| `any` | 第一个**兑现** | **全部**拒绝（`AggregateError`） |

---

# Promise.all：全部成功，否则全败

全兑现 → 有序值数组；任一拒绝 → 立刻整体拒绝

```js
const [a, b, c] = await Promise.all([
  ok("A", 100), ok("B", 50), ok("C", 80),
]);
console.log(a, b, c); // "A" "B" "C"——顺序按输入，不按快慢
```

<v-click>

**适用**：多请求缺一不可、且「一个失败就别等了」。⚠️ 拒绝时其余请求**不会被取消**，仍在后台跑完，只是结果被丢弃。

</v-click>

---

# Promise.allSettled：要全部结果

等全部敲定，**永不拒绝**，返回结果对象数组

```js
const results = await Promise.allSettled([ok("A", 100), fail("B", 30)]);
// [{ status: "fulfilled", value: "A" },
//  { status: "rejected",  reason: Error("B") }]
const good = results.filter((r) => r.status === "fulfilled");
```

<v-click>

**适用**：批量操作里**部分失败可接受**，且想知道每一个的结局——批量上传统计「8 成 2 败」、并行拉多个看板数据。

</v-click>

---

# Promise.race：谁先敲定听谁的

第一个敲定即随之敲定——**不管兑现还是拒绝**

```js
const winner = await Promise.race([ok("慢", 200), ok("快", 50)]);
console.log(winner); // "快"——先敲定的赢
```

<v-click>

经典用法是做**超时**——让真实任务和「定时拒绝」赛跑：

```js
Promise.race([promise, timeout]); // 没在 ms 内完成就以超时拒绝
```

但它**不会真正取消**底层请求，更彻底的是 `AbortSignal.timeout`。

</v-click>

---

# Promise.any：第一个成功的就行

第一个兑现即敲定；**全部拒绝**才拒绝

```js
const fastest = await Promise.any([
  fail("CDN1 挂了", 30), // 拒绝被忽略
  ok("来自 CDN2", 80), // 第一个兑现 → any 兑现
]);
console.log(fastest); // "来自 CDN2"
// 全挂时拒绝为 AggregateError，err.errors 收集所有原因
```

<v-click>

**适用**：多个**冗余源**只要一个成功就够——多 CDN / 多镜像取最快可用。

</v-click>

---

# race 与 any：对失败态度相反

两者都「取最快」，但区别在拒绝

| | 第一个是**兑现** | 第一个是**拒绝** |
| --- | --- | --- |
| `race` | 兑现 | **拒绝**（失败也算敲定） |
| `any` | 兑现 | **忽略**，继续等下一个 |

<v-click>

记忆：`race` 是「最快**敲定**」（含失败，适合超时），`any` 是「最快**成功**」（容忍失败，适合冗余源）。

</v-click>

---

# 并发控制：组合器会一次发起全部

几百个请求会瞬间打满连接、压垮服务器

```js
async function mapWithLimit(items, limit, task) {
  let cursor = 0; // 共享游标，跑完一个补一个
  async function worker() {
    while (cursor < items.length) {
      await task(items[cursor++]); // 领取下一个任务
    }
  }
  // 启动 limit 个 worker 并行消费队列
  await Promise.all(Array.from({ length: limit }, worker));
}
```

<v-click>

启动 `limit` 个 worker 并行消费队列，**跑完一个补一个**。生产可直接用 `p-limit` / `p-map`。

</v-click>

---
layout: section
---

# async/await

把异步写成「看起来同步」的顺序代码

---

# async 函数：永远返回 Promise

`return 值` → 兑现；`throw` → 拒绝

```js
async function f() {
  return 42; // 普通值被包成 Promise
}
f().then((v) => console.log(v)); // 42——f() 是 Promise 不是 42

async function g() {
  throw new Error("炸了"); // 抛错 → 返回拒绝的 Promise
}
g().catch((e) => console.error(e.message)); // "炸了"
```

<v-click>

这是理解一切的起点：**给函数加 `async`，它就一定返回 `Promise`**。

</v-click>

---

# await：暂停直到敲定

暂停**这个 async 函数自己**，引擎照常跑别的

```js
async function showUser() {
  const res = await fetch("/api/user"); // 暂停，直到响应到达
  const user = await res.json(); // 暂停，直到解析完成
  console.log(user.name); // 两次 await 都敲定后才执行
}
```

<v-click>

「暂停」不阻塞引擎——它把「后续代码」登记为「该 Promise 敲定后的微任务」，所以顺序仍服从微任务规则。

</v-click>

---

# then 链 vs async/await

同一段逻辑，后者读起来像同步

```js
// then 链版
return fetch("/api/user")
  .then((res) => res.json())
  .then((user) => fetch(`/api/orders/${user.id}`));

// async/await 版
const res = await fetch("/api/user");
const user = await res.json();
return fetch(`/api/orders/${user.id}`);
```

<v-click>

优势：无层层缩进、中间是普通局部变量、可用普通 `if`/`for`/`try`、不存在「漏写 `return`」的隐患。

</v-click>

---

# 错误处理：回归 try/catch

`await` 的 Promise 拒绝，就在 `await` 处像 `throw` 抛出

```js
async function showUser() {
  try {
    const res = await fetch("/api/user");
    if (!res.ok) throw new Error(`HTTP ${res.status}`); // 自己抛
    console.log(await res.json());
  } catch (err) {
    console.error("加载失败：", err); // 任意一步的错都到这
  }
}
```

<v-click>

跨出 async 边界时，在调用处用 `.catch()`：`showUser().catch(report)`。

</v-click>

---

# fetch 不会因 4xx/5xx 而拒绝

最隐蔽的坑：服务器返回 404/500 时 `fetch` **仍兑现**

```js
const res = await fetch("/api/user");
// ❌ 以为出错会进 catch——其实 404 也走到这里
if (!res.ok) throw new Error(`HTTP ${res.status}`); // ✅ 必须手动检查
```

<v-click>

`fetch` 只在**网络层失败**（断网、CORS、DNS）时才拒绝。务必自己检查 `res.ok` 并手动 `throw`，否则错误被 `try`/`catch` 漏掉。

</v-click>

---

# 顺序 vs 并行：最重要的性能取舍

逐个 `await` 会把本可并行的任务**变成串行**

```js
// ❌ 串行：总耗时 ≈ t1 + t2 + t3
const a = await fetch("/api/a"); // 等 a 完成…
const b = await fetch("/api/b"); // …才开始 b

// ✅ 并行：总耗时 ≈ max(t1, t2)
const [a2, b2] = await Promise.all([fetch("/api/a"), fetch("/api/b")]);
```

<v-click>

诀窍：**先把所有 Promise 都发起（不加 `await`），再一起 `await`**。只有真依赖前一步时才串行。

</v-click>

---

# 循环里的陷阱

`for` 里 `await` 是**串行**的（每轮等上一轮）

```js
// ❌ 串行：一个接一个，慢
for (const id of ids) {
  await fetchUser(id);
}
// ✅ 并行：全部同时发起
await Promise.all(ids.map((id) => fetchUser(id)));
```

<v-click>

> `forEach` **不会**等待其中的 async 回调——别用 `arr.forEach(async ...)` 做需要等待的批处理。

</v-click>

---

# 顶层 await（ES2022）

**ES 模块**顶层可直接 `await`，无需包 async 函数

```js
// 仅在 ES 模块顶层有效
const config = await fetch("/config.json").then((r) => r.json());
const { renderer } = await import(config.rendererModule);
export const ready = renderer.init(config);
```

<v-click>

- **只在 ES 模块可用**：CommonJS、普通 `<script>` 会语法报错
- **会阻塞模块图**：依赖它的模块会等待，适合「启动必需的初始化」

</v-click>

---
layout: section
---

# 取消、超时与竞态

Promise 不可取消，靠外部信号机制

---

# Promise 为什么不能取消

一旦发起，底层操作就已在跑，**没有 `.cancel()`**

<v-click>

- `Promise.race` 的「超时」只是**不再等待**结果
- 底层请求仍在后台跑完，不会真正停掉

</v-click>

<v-click>

> 要真正**中止**操作（停掉网络请求、不再触发回调），需要一套独立的信号机制：`AbortController` 与 `AbortSignal`。

</v-click>

---

# AbortController：固定三步

建控制器 → 把 `signal` 交给 API → `abort()`

```js
const controller = new AbortController();
const { signal } = controller;
signal.addEventListener("abort", () => {
  console.log("被中止，原因：", signal.reason);
});
controller.abort(); // 也可 abort(new Error("用户取消"))
console.log(signal.aborted); // true
```

<v-click>

`AbortSignal` 关键成员：`aborted`、`reason`、`abort` 事件、`throwIfAborted()`。

</v-click>

---

# 用 AbortController 取消 fetch

`fetch` 原生支持 `signal`，被中止时拒绝为 `AbortError`

```js
const controller = new AbortController();
fetch("/api/large-file", { signal: controller.signal })
  .then((res) => res.blob())
  .catch((err) => {
    if (err.name === "AbortError") console.log("请求已取消");
    else throw err; // 区分「主动取消」与「真正出错」
  });
setTimeout(() => controller.abort(), 3000); // 3 秒后取消
```

<v-click>

`signal` 是统一的「取消令牌」，也能传给 `addEventListener` 等各种 Web API。

</v-click>

---

# AbortSignal.timeout：声明式超时

Baseline **2024**：`ms` 后自动中止，拒绝为 `TimeoutError`

```js
try {
  const res = await fetch("/api/slow", { signal: AbortSignal.timeout(5000) });
  const data = await res.json();
} catch (err) {
  if (err.name === "TimeoutError") console.error("超过 5 秒没响应");
  else if (err.name === "AbortError") console.error("被手动取消");
}
```

<v-click>

比 `Promise.race` 超时更优——能**真正中止**底层请求，而非只是放弃等待（注意是 `TimeoutError`，不是 `AbortError`）。

</v-click>

---

# AbortSignal.any：合并多个取消源

**任一中止则合并信号中止**

```js
const userCancel = new AbortController();
const signal = AbortSignal.any([
  userCancel.signal, // 用户点取消
  AbortSignal.timeout(10000), // 或者 10 秒超时
]);
const res = await fetch("/api/data", { signal }); // 谁先到都会中止
```

<v-click>

常见需求：一个请求**既要有超时、又要能被用户手动取消**——两个条件合二为一。

</v-click>

---

# Promise.withResolvers（ES2024）

把 `resolve`/`reject` 提到外部作用域

```js
// 旧写法：手动 deferred，啰嗦
let resolve, reject;
const promise = new Promise((res, rej) => { resolve = res; reject = rej; });

// 新写法（ES2024）：一行解构
const { promise, resolve, reject } = Promise.withResolvers();
```

<v-click>

适合「监听器只挂一次、却要为多次事件分别 resolve」——如把基于事件的流包装成异步迭代。Baseline 2024，老环境需 polyfill。

</v-click>

---

# 竞态条件：丢弃过期的响应

搜索框快速输入，**旧结果 A 覆盖新结果 B**

```js
// ❌ 有竞态：哪个先回来就显示哪个，可能是过期的
async function search(keyword) {
  const res = await fetch(`/api/search?q=${keyword}`);
  showResults(await res.json()); // A 晚于 B 返回时会覆盖 B
}
```

<v-click>

异步最隐蔽的 bug 之一：界面显示与「最新输入」错位。两种方案见下页。

</v-click>

---

# 防竞态：取消上一个 / 标记最新

```js
// 方案一：取消上一个请求（首选，连带省流量）
controller?.abort();
controller = new AbortController();
const res = await fetch(url, { signal: controller.signal });

// 方案二：标记最新请求，丢弃过期响应
const requestId = ++latestId;
const data = await (await fetch(url)).json();
if (requestId === latestId) showResults(data); // 只有最新才渲染
```

<v-click>

方案一连带省流量（首选）；方案二适合**无法取消**的场景。

</v-click>

---

# 全链路小结

<v-click>

- **事件循环**：单线程 + 微任务优先于宏任务、渲染只在宏任务之间
- **回调**：金字塔、错误难捕获、控制反转、Zalgo 四宗罪
- **Promise**：不可逆三态、链式拉平、错误冒泡；组合器收敛一批
- **async/await**：必返 Promise、`await` 暂停即抛；分清顺序 vs 并行
- **取消**：`AbortController` 取消令牌、`AbortSignal.timeout` 超时、防竞态

</v-click>

<v-click>

> 一条主线：**同步阻塞 → 回调 → Promise → async/await + 取消机制**。

</v-click>

---
layout: center
class: text-center
---

# 谢谢

看懂事件循环，异步的一切「为什么这样跑」都迎刃而解

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
