---
theme: seriph
background: https://cover.sli.dev
title: RxJS — Reactive Programming with Observables
info: |
  Presentation RxJS — reactive programming for JavaScript with Observables.

  Learn more at [https://rxjs.dev](https://rxjs.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🔁</span>
</div>

<br/>

## RxJS — 响应式编程

用 **Observable** 统一表达异步与事件流：可取消、惰性、可组合。`pipe()` 串操作符，一套模型搞定 HTTP、定时器、DOM 事件、状态流

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格进入下一页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/ReactiveX/rxjs" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 RxJS，JavaScript 的响应式编程库。它的核心抽象是 Observable，官方定义为「一个惰性的、可随时间推送 0 到 N 个值的集合」。

一句话理解：Observable 就像一个能在未来不断「推」给你多个值的函数。它把 HTTP 请求、WebSocket、定时器、DOM 事件、状态流，统一成一套「Observable 加操作符」的模型。

主线：为什么需要 → 三件套 → 创建函数 → 操作符与 pipe → 高阶映射四兄弟 → 冷热 → Subject 多播 → 错误处理 → 调度器 → 取消订阅防泄漏 → 与 Promise 取舍 → 测试 → 7.x 变更 → 总结。版本基线是 RxJS 7.x。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么需要 RxJS

<v-clicks>

- Promise 只能发**一个值**、**不可取消**、创建即执行
- 回调地狱：多个异步事件交织难管理
- 竞态：搜索请求乱序返回，旧结果覆盖新结果
- 事件流的防抖/节流/合并要手写一堆状态

</v-clicks>

<div v-click class="mt-6">

RxJS 的回应：

- Observable → **多值 + 可取消 + 惰性**
- 操作符 → 声明式组合，几行搞定竞态/防抖
- Subject → **多播**，事件总线与状态共享

</div>

<!--
为什么要专门学一套响应式库？看几个老痛点。

第一，Promise 只能发一个值、不可取消、创建就立即执行。一个按钮的连续点击、一个 WebSocket 的持续推送，Promise 表达不了。第二，多个异步事件交织时，回调嵌套难管理。第三，竞态：搜索框快速输入，先发的请求后返回，旧结果覆盖了新结果。第四，事件流的防抖、节流、合并，用原生方式要手写一堆定时器和状态变量。

RxJS 的回应：Observable 是多值、可取消、惰性的 Push 流；操作符让你用声明式几行代码解决竞态和防抖；Subject 提供多播，轻松实现事件总线和状态共享。这就是今天的主线。
-->

---

# Observable：核心抽象

```ts
import { Observable } from 'rxjs'

const obs$ = new Observable<number>((subscriber) => {
  subscriber.next(1)        // 推一个值
  subscriber.next(2)
  subscriber.complete()     // 终止通知
})

console.log('A')
obs$.subscribe((v) => console.log(v))   // 同步发值
console.log('B')
// 打印：A → 1 → 2 → B
```

<v-clicks>

- **惰性**：订阅前生产函数不执行；**可同步**也可异步
- **Push 模型**：生产者主动推，消费者被动收

</v-clicks>

<!--
先看核心抽象 Observable。用 new Observable 传一个生产函数，函数里拿到 subscriber，调用 next 推值、complete 终止。

注意两个关键点。第一，惰性：定义 Observable 时生产函数不执行，只有 subscribe 时才为这次订阅运行一遍。这和 Promise 不同，Promise 创建时 executor 就立即跑。第二，Observable 不一定异步。这段代码的生产函数是同步的，所以打印顺序是 A、1、2、B——subscribe 同步把 next 跑完了。把值放进 setTimeout 才会变成 A、B、1、2。

用 Pull、Push 二分法看：函数和 Iterator 是 Pull，消费者主动取值；Promise 和 Observable 是 Push，生产者主动推值。Observable 就是「多值的 Push」。
-->

---
layout: two-cols-header
---

# 三件套与对位 Promise

::left::

**Observable / Observer / Subscription**

```ts
const observer = {
  next: (v) => console.log(v),
  error: (e) => console.error(e),
  complete: () => console.log('done'),
}
const sub = obs$.subscribe(observer)
sub.unsubscribe()   // 取消、释放资源
```

::right::

**vs Promise**

```ts
// Promise：单值 / 不可取消 / 急切
const data = await fetch('/api')

// Observable：多值 / 可取消 / 惰性
const s = obs$.subscribe(observer)
```

<div class="mt-2 text-sm">

> `error` 与 `complete` 互斥，各至多一次（终止通知）。

</div>

<!--
RxJS 的三件套。

Observable 是值的生产者蓝图，惰性。Observer 是消费者，一个含 next、error、complete 的对象。Subscription 是 subscribe 的返回值，代表一次正在进行的执行，调 unsubscribe 取消它、释放资源。

关键契约：error 和 complete 是终止通知，互斥，整条流只发生一次，之后任何通知都被忽略。

右边和 Promise 对位。Promise 单值、不可取消、创建即执行；Observable 多值、可取消、订阅才执行。这三点差异就是选 RxJS 的根本理由。注意 subscribe 返回的是 Subscription，不是 Promise，要转 Promise 得用后面讲的 firstValueFrom。
-->

---

# 创建函数：流从哪来

```ts
import { of, from, fromEvent, interval, timer } from 'rxjs'

of(1, 2, 3)                  // 逐个参数发出后 complete
from([1, 2, 3])             // 转可迭代/Promise/Observable，逐项发
from(fetch('/api'))         // Promise → Observable
fromEvent(btn, 'click')     // DOM 事件 → 流（自动 add/removeEventListener）
interval(1000)              // 每秒发递增整数，首值滞后、永不完成
timer(0, 1000)             // 立即开始、之后每秒一次
```

<v-clicks>

- `of([1,2,3])` 发**一个数组**；`from([1,2,3])` 发**三个数字**
- `interval` 首值在**一个周期之后**、且**永不自动 complete**

</v-clicks>

<!--
流从哪来？创建函数。

of 把每个参数依次发出后 complete。from 把单个可迭代对象、Promise 或 Observable 转成流逐项发出。注意 of 和 from 的区别：of 中括号 1、2、3 发的是一个数组，from 中括号 1、2、3 发的是三个数字。from 还能接 Promise，这是接入现有异步代码的常用入口。

fromEvent 把 DOM 事件包成流，内部自动 addEventListener，退订时自动 removeEventListener，是 UI 事件流的标准入口。

interval 每隔指定毫秒发一个递增整数，但要小心两点：第一个值在第一个周期之后才发，而且永不自动完成。想立即开始就用 timer 第一个参数传 0。timer 单参是延迟后发一次，双参是延迟后周期发。
-->

---

# 操作符与 pipe

```ts
import { of, filter, map, take } from 'rxjs'

of(1, 2, 3, 4, 5).pipe(
  filter((x) => x % 2 === 1),   // 放行奇数：1,3,5
  map((x) => x * 10),           // 逐值变换：10,30,50
  take(2),                      // 取够 2 个就完成
).subscribe(console.log)        // 10 30
```

<v-clicks>

- **pipeable 操作符**是纯函数，`pipe()` 串联，tree-shaking 友好
- 操作符**不改源**、返回**新 Observable** → 源可被多条链复用
- 7.x 扁平导入：`import { map } from 'rxjs'`

</v-clicks>

<!--
有了源，用操作符变换。RxJS 7 的标准写法是 pipeable 操作符：操作符是纯函数，通过 source 点 pipe 串起来。

这段先 filter 放行奇数，再 map 逐值乘十，再 take 取两个就完成。常用的还有 tap 做副作用、scan 做累加、distinctUntilChanged 去连续重复、startWith 加初始值。

两个要点。第一，操作符是纯函数，不修改源，而是返回一个新 Observable，所以同一个源可以被多条不同的链安全复用。第二，导入。RxJS 7 把操作符和创建函数扁平导出到包根 rxjs，直接 import 大括号 map from rxjs。旧的 rxjs 斜杠 operators 子路径还能用但不是首选；而原型链上的 obs 点 map 点 filter 已经彻底废弃了。
-->

---

# tap：副作用，别用 map 冒充

```ts
import { of, tap, map } from 'rxjs'

of(1, 2, 3).pipe(
  tap((v) => console.log('看到', v)),   // ✅ 原样透传、不改值
  map((v) => v * 2),                    // 变换
).subscribe()

// ❌ 用 map 打日志，忘了 return → 所有值变 undefined
of(1, 2, 3).pipe(map((v) => { console.log(v) }))
```

<v-clicks>

- `tap` 专做日志/调试等**副作用**，**不修改流**
- 调试复杂链：各阶段插 `tap` 观察，安全不污染数据

</v-clicks>

<!--
专门说一下 tap，因为它最容易被误用。

tap 用于副作用：日志、调试、触发与流值无关的操作。它把上游值原样透传、不修改流。而 map 会用回调的返回值替换原值。

新手常见错误：想打个日志却用了 map，结果忘记 return，回调返回 undefined，于是流里所有值都变成了 undefined，数据被污染。所以「只观察、不改值」必须用 tap。

实用技巧：调试一条复杂的操作符链时，在各个阶段插入 tap 打印，就能看清值在每一步怎么流动，而且完全不影响数据。还能用 tap 传一个对象，分别观察 next、error、complete。
-->

---

# 高阶映射四兄弟（高频考点）

当映射返回的是**另一个 Observable**（如发请求），需要「拍平」：

| 操作符 | 新值到来、旧内层未完成时 | 记忆 |
|---|---|---|
| `switchMap` | **取消**旧内层，切到新的 | 只要最新 |
| `mergeMap` | **并发**保留全部内层 | 全都要 |
| `concatMap` | **排队**，等上个完成再下个 | 保序 |
| `exhaustMap` | **忽略**新值直到内层完成 | 忙时拒新 |

<div v-click class="mt-3 text-sm">

> `xxxMap` ≈ `map(...)` + 对应的 `xxxAll`。`concatMap` = `mergeMap(fn, 1)`。

</div>

<!--
重点中的重点，面试必考：高阶映射四兄弟。

当你的映射函数返回的不是普通值，而是另一个 Observable，比如发起一个 HTTP 请求，这就产生了高阶 Observable，需要把它拍平。

四个操作符拍平的方式一致，差别全在一件事上：当新的外层值到来、而上一个内层 Observable 还没完成时，怎么办？

switchMap 取消旧内层、切到新的，口诀「只要最新」。mergeMap 并发保留所有内层，口诀「全都要」。concatMap 排队，等上一个内层完成再订阅下一个，口诀「保序」。exhaustMap 在当前内层没完成时，忽略新外层值，口诀「忙时拒新」。

它们的关系：xxxMap 约等于 map 加上对应的 xxxAll；concatMap 本质就是并发度为一的 mergeMap。
-->

---

# 四兄弟的场景对号入座

```ts
// 搜索补全：取消过期请求、防竞态
term$.pipe(debounceTime(300), switchMap((q) => api(q)))

// 防重复提交：请求中忽略后续点击
click$.pipe(exhaustMap(() => submit()))

// 顺序保存：严格按序、不丢
ids$.pipe(concatMap((id) => save(id)))

// 并行限流：最多同时 3 个
ids$.pipe(mergeMap((id) => fetchOne(id), 3))
```

<!--
四兄弟对号入座，记住这四个场景就够用了。

搜索框自动补全用 switchMap。用户每敲一个字符发起新请求，switchMap 会取消上一个还没返回的请求，避免旧关键词的响应后到、覆盖了最新结果，这就是防竞态。配 debounceTime 等用户停手再发。

防重复提交用 exhaustMap。点击提交映射成请求，请求没返回前再点都被忽略，天然防重复。

顺序保存用 concatMap。严格按外层顺序，等上一个完成再下一个，不乱序、不丢值。

并行限流用 mergeMap 加第二个参数 concurrent。比如批量请求但最多同时三个，超出的排队，避免压垮服务器。

选错的代价很实在：补全用 mergeMap 会结果错乱，提交用 concatMap 会重复提交。
-->

---

# 冷 vs 热 Observable

| 维度 | 冷（cold） | 热（hot） |
|---|---|---|
| 生产者 | 每次订阅**内部新建** | **外部共享** |
| 订阅者拿到 | 各自独立、从头 | 仅订阅后的值 |
| 模型 | 单播 | 多播 |
| 例子 | `of`、HTTP | `fromEvent`、`Subject` |

```ts
const req$ = defer(() => fetch('/api'))
req$.subscribe()  // 请求 1
req$.subscribe()  // 请求 2 —— 冷！各自独立，发了两次
```

<!--
另一个核心概念：冷和热。

本质区别在于数据生产者是在订阅内部创建，还是在外部共享。

冷 Observable，每次 subscribe 都在内部新建一个生产者，各订阅者拿到独立、从头开始的数据。of、from、HTTP 请求都是冷的，是单播。热 Observable，生产者在外部、被所有订阅者共享，订阅者只能收到订阅之后推送的值。fromEvent 的 DOM 事件、Subject 都是热的，是多播。

底下这段是新手最常踩的坑。一个发请求的冷 Observable，订阅两次，就会发起两次独立的 HTTP 请求，互不共享。这就是「为什么我的请求、我的日志跑了好几遍」的根因。要让多个订阅者共享一次执行，需要显式多播，下面就讲。
-->

---

# Subject：把单播变多播

```ts
import { Subject } from 'rxjs'

const subject = new Subject<number>()
subject.subscribe((v) => console.log('A:', v))
subject.subscribe((v) => console.log('B:', v))
subject.next(1)   // A:1  B:1  —— 同一个值多播
subject.next(2)   // A:2  B:2
```

<v-clicks>

- Subject 既是 **Observable** 又是 **Observer**，可主动 `next`
- 维护订阅者列表 → 一个值同时推给所有订阅者
- 对外用 `subject.asObservable()` 暴露**只读**视图

</v-clicks>

<!--
怎么把单播变多播？用 Subject。

普通 Observable 是单播，每个订阅者独立执行。Subject 特殊：它既是 Observable 又是 Observer。作为 Observer，它能被主动调用 next、error、complete；作为 Observable，它能被订阅。它内部维护一个订阅者列表，调 next 一个值，会同时推给所有订阅者，这就是多播。

这段代码两个订阅者，subject 点 next 一，两个都收到一，这就是事件总线的雏形。

一个良好实践：在服务里用 Subject 写入，对外通过 asObservable 暴露一个只读的 Observable 视图，隐藏 next，防止消费方误调用 next 破坏数据来源的单一性。
-->

---

# Subject 家族：四种变体

| 类型 | 关键特性 | 适用 |
|---|---|---|
| `Subject` | 只收订阅**之后**的值 | 事件总线 |
| `BehaviorSubject(init)` | 需初始值，立即收**当前值**，`.value` 同步读 | **状态** |
| `ReplaySubject(n)` | 重放**最近 n 个**值给新订阅者 | 历史回放 |
| `AsyncSubject` | 仅 **complete 时**发最后一个值 | 最终结果 |

```ts
const state$ = new BehaviorSubject(0)   // 状态管理首选
state$.subscribe((v) => console.log(v)) // 立即 0
state$.next(1)                           // 1
console.log(state$.value)                // 同步读 1
```

<!--
Subject 有四种变体，按需求选。

普通 Subject，订阅者只能收到订阅之后的值。适合事件总线。

BehaviorSubject，需要一个初始值，每个新订阅者立即收到当前最新值，还能用点 value 同步读。它最适合表达状态，比如当前登录用户、主题色、加载状态。Angular 里做轻量状态管理就靠它。

ReplaySubject 传一个缓冲大小 n，向新订阅者重放最近 n 个值。比如 ReplaySubject 二，新订阅者会先收到最近两个值。适合需要历史回放的场景。

AsyncSubject，只在自己 complete 时，把最后一次 next 的值发给所有订阅者，语义类似 Promise 的最终单值。

底下演示 BehaviorSubject：订阅立即得 0，next 一后是 1，还能 state 点 value 同步读到 1。
-->

---

# share / shareReplay：共享一次执行

```ts
import { defer, shareReplay } from 'rxjs'

// 缓存 HTTP 响应：一次请求，多订阅者共享 + 重放
const user$ = defer(() => fetch('/api/user').then((r) => r.json())).pipe(
  shareReplay({ bufferSize: 1, refCount: true }),
)
user$.subscribe()   // 发起唯一一次请求
user$.subscribe()   // 共享结果，并重放给后来者
```

<v-clicks>

- `share()`：Subject 多播 + 引用计数，多订阅者共享一次执行
- `shareReplay()`：额外**缓存并重放**给后来的订阅者
- ⚠️ `refCount:false` + 源不完成 → 一直保活、可能泄漏

</v-clicks>

<!--
怎么让多个订阅者共享一次底层执行？用 share 系列。

share 在内部用一个 Subject 把源多播给多个订阅者，并采用引用计数：第一个订阅者到来时订阅源、开始执行，订阅者归零时退订源。这样多个订阅者只触发一次底层执行，比如一次 HTTP、一个 interval。

shareReplay 在多播之上多了一个能力：缓存最近 N 个值，并重放给之后才订阅的新订阅者。这是缓存 HTTP 响应的经典配方：bufferSize 一、refCount true，一次请求、结果共享、晚来的订阅者也能立刻拿到。

一个坑要注意：refCount 设为 false 而源又不会 complete 时，缓存会一直保活，订阅者归零也不退订源，可能造成内存泄漏。一般用 refCount true，或确保源会终止。
-->

---

# 组合多个流

```ts
import { combineLatest, withLatestFrom, forkJoin } from 'rxjs'

// 任一源变化就重算（每源都发过值后）
combineLatest([name$, email$]).pipe(map(([n, e]) => validate(n, e)))

// 仅主源触发，附带其它源最新值快照
saveClick$.pipe(withLatestFrom(form$), map(([, f]) => f))

// 等全部 complete，取各自最后值（似 Promise.all）
forkJoin({ user: getUser$, posts: getPosts$ })
```

<v-clicks>

- `combineLatest` 对称：任一源更新即发；`withLatestFrom` 不对称：仅主源
- `forkJoin` 一次性请求并发、全完成后统一处理

</v-clicks>

<!--
组合多个流，三个最常用的。

combineLatest，每个源都至少发过一个值之后，任意一个源再发新值，就把所有源的最新值组合成数组发出。它是对称的：任一源更新都触发。适合多个表单字段任一变化就重新校验。

withLatestFrom，不对称：只有主源发值时才输出，输出里携带其它源的最新值作为快照，其它源自己发新值不触发。适合「点击保存时，顺带读当前表单值」这种以主事件驱动的场景。

forkJoin，类似 Promise.all：等所有源都 complete，取各自的最后一个值组合发一次。适合并发发起多个一次性请求、全部完成后统一处理。注意任一源不 complete 它就永远不发。

还有 merge 并行交错、concat 串行衔接、zip 配对、race 取最快，按需选用。
-->

---

# 防抖 vs 节流

```ts
// 防抖：源静默 300ms 后发最近一个（搜索输入）
input$.pipe(debounceTime(300), distinctUntilChanged())

// 节流：发一个后窗口内忽略其余，按频率放行（滚动）
scroll$.pipe(throttleTime(200))

// 批处理：1 秒内的值收集成数组整批发出（不丢值）
event$.pipe(bufferTime(1000))
```

<v-clicks>

- `debounceTime`「等停手发末值」；`throttleTime`「限频丢中间」
- `throttleTime(d, sch, { leading, trailing })` 控发头 / 发尾

</v-clicks>

<!--
处理高频事件，防抖和节流。

debounceTime，每来一个值就重置计时，只有当源静默达到指定时长后，才发出最后一个值。适合搜索输入：等用户停手 300 毫秒再发请求。常配 distinctUntilChanged 去掉和上次相同的关键词。

throttleTime，发出一个值后，在节流窗口内忽略后续值，窗口过后才放行下一个。适合限制滚动、按钮连点这类高频事件的触发频率。默认发窗口的第一个值，可以用第三个 config 参数的 leading 和 trailing 控制发头还是发尾。

还有一个 bufferTime：把一段时间内的所有值收集进一个数组整批发出，一个都不丢。这是「批处理」，和 throttle「丢中间值」是两种思路。要降频用 throttle，要批处理不丢用 buffer。
-->

---

# 错误处理：catchError + retry

```ts
import { of, catchError, retry, throwError } from 'rxjs'

source$.pipe(
  retry({ count: 3, delay: 1000 }),     // 失败重试 3 次，间隔 1s
  catchError((err) => {
    return of({ fallback: true })       // 降级：返回替代流
    // return EMPTY                      // 静默结束
    // return throwError(() => err)      // 重新抛出
  }),
).subscribe(handle)
```

<v-clicks>

- `catchError` 必须**返回一个 Observable** 作为替代流
- 顺序：`catchError` 放 `retry` **之后** → 先重试、仍失败才兜底

</v-clicks>

<!--
错误处理两个核心：catchError 和 retry。

catchError 在上游 error 时被调用，必须返回一个新的 Observable 作为替代流。常见三种：返回 of 默认值做优雅降级，返回 EMPTY 静默结束，返回 throwError 重新抛出。

retry 在源 error 后重新订阅源来重试。它接受一个数字，也接受配置对象 count 加 delay，delay 既可以是毫秒，也可以是一个函数返回通知流，用来做指数退避。

最容易错的是顺序。retry 重新订阅它的上游、捕获上游的错误。如果 catchError 放在 retry 之前、更靠近源，错误会先被 catchError 消化掉，retry 就感知不到、不会重试。想要「先重试三次、仍失败才兜底」，必须把 catchError 放在 retry 之后、更靠下游。
-->

---

# 调度器 Scheduler

```ts
import { of, observeOn, asyncScheduler } from 'rxjs'

of(1, 2, 3).pipe(observeOn(asyncScheduler)).subscribe(console.log)
// 通知被异步投递到下一个宏任务
```

| 调度器 | 机制 |
|---|---|
| `asyncScheduler` | setTimeout（宏任务，时间操作符默认） |
| `asapScheduler` | 微任务 |
| `animationFrameScheduler` | requestAnimationFrame |

<div v-click class="mt-2 text-sm">

> `subscribeOn` 控订阅起点；`observeOn` 控之后的下游投递。**单线程：调时机不调线程，真并行需 Worker**。

</div>

<!--
调度器 Scheduler，控制的是执行时机，不是值的内容。它决定订阅何时开始、通知何时投递，在什么队列、什么时候执行。

几个内置调度器：asyncScheduler 基于 setTimeout，是宏任务，时间相关操作符默认用它；asapScheduler 基于微任务，比 setTimeout 早；animationFrameScheduler 基于 requestAnimationFrame，适合动画；queueScheduler 是同步队列，递归调度时排队防栈溢出。

两个操作符：subscribeOn 决定订阅、生产开始在哪个调度器执行，影响整链起点，一条链一个就够。observeOn 决定它位置之后的下游通知投递在哪个调度器执行，可放链中任意处。

一个重要认知：JS 是单线程，调度器只能改执行时机，不能提供真正的并行。把同步长循环切片成异步可以缓解卡顿，但 CPU 密集仍占主线程，真并行得用 Web Worker。
-->

---

# 取消订阅：防内存泄漏

```ts
import { interval, take, takeUntil, Subject } from 'rxjs'

// ✅ takeUntil + destroy$：组件最常用，一处触发批量退订
const destroy$ = new Subject<void>()
interval(1000).pipe(takeUntil(destroy$)).subscribe(console.log)
// 销毁时：destroy$.next(); destroy$.complete()

// ✅ take：流自己会完成
interval(1000).pipe(take(5)).subscribe()
```

<v-clicks>

- 活跃订阅**不会被 GC**；持续型流忘退订 → 泄漏
- 方案：`unsubscribe` / `takeUntil` / `take` / Angular `async` 管道

</v-clicks>

<!--
RxJS 最常见的线上隐患：内存泄漏。

根因是活跃订阅不会被垃圾回收。一个持续发值的流，比如 interval、fromEvent、长生命周期的 Subject，如果忘记退订，它的回调和闭包会被一直持有，组件销毁后回调还在跑，甚至访问已销毁的状态。

四种退订方案。手动 unsubscribe，适合简单场景。take 或 first，让流自己达到条件就 complete、自动收尾。takeUntil 加一个 destroy Subject，这是组件里最常用的模式：所有业务流都 pipe takeUntil destroy，组件销毁时 destroy 点 next 一次，所有流批量退订，不用逐个 unsubscribe，takeUntil 建议放在链的最后。第四，框架层，Angular 模板里的 async 管道会自动订阅、组件销毁时自动退订，从根本上免去手动处理。

嵌套订阅也要避免——subscribe 里再 subscribe，改用高阶映射 switchMap、mergeMap，它们会自动管理内层退订。
-->

---

# 与 Promise / async 取舍

<v-clicks>

- **用 Observable**：多值、可取消、惰性、要操作符组合（debounce/retry/switchMap）
- **用 Promise**：一次性、单值、简单异步 → async/await 更轻
- 不要为了用而用，盲目上 RxJS 是过度工程

</v-clicks>

<div v-click class="mt-4">

**互操作**

```ts
import { from, firstValueFrom, lastValueFrom } from 'rxjs'

from(fetch('/api'))                         // Promise → Observable
const v = await firstValueFrom(source$)     // Observable → Promise（首值）
const last = await lastValueFrom(source$)    // 最后一个值
```

</div>

<!--
RxJS 不是银弹，要会取舍。

什么时候用 Observable？需要多个值、可取消、惰性，或者要用 debounce、retry、switchMap 这些操作符组合时。典型场景：事件流、可中断的请求、自动补全、轮询。

什么时候用 Promise？一次性、单值、简单的异步，用 async await 更轻、更直观。比如读一次配置、发一个不需要取消的请求。

关键是别为了用而用。盲目把所有异步都改成 RxJS 是过度工程，反而增加复杂度。

互操作三件套。from 把 Promise 转成 Observable，也可以在 switchMap、mergeMap 里直接返回 Promise，它们接受含 Promise 的 ObservableInput。反向，firstValueFrom 拿第一个值后 resolve，lastValueFrom 在 complete 时用最后一个值 resolve。注意不能在 pipe 链里直接 await。
-->

---

# 测试：TestScheduler + 弹珠图

```ts
import { TestScheduler } from 'rxjs/testing'

const scheduler = new TestScheduler((a, e) => expect(a).toEqual(e))

scheduler.run(({ cold, expectObservable }) => {
  const source = cold(' -a--b--c|')
  const expected = '    -a--b--c|'
  expectObservable(source.pipe(/* ... */)).toBe(expected)
})
```

<div class="mt-2 text-sm">

弹珠符号：`-` 一帧时间 ｜ 字母 发值 ｜ `|` complete ｜ `#` error ｜ `()` 同帧分组

</div>

<!--
测试基于时间的流，不应该真的 setTimeout 去等。RxJS 提供 TestScheduler，配合弹珠图，把时间虚拟化、同步执行。

用法：new TestScheduler 传一个断言回调，接到你的测试框架。在 scheduler 点 run 的回调里拿到 helpers，用 cold 或 hot 构造输入流，用 expectObservable 点 toBe 断言输出。run 回调里所有基于 asyncScheduler 的时间操作都被虚拟时钟接管，几毫秒的真实等待被压缩成同步。

弹珠语法要记住：横杠代表一帧时间流逝，字母或数字代表在那个时刻发出一个值，竖线代表 complete，井号代表 error，小括号把同一帧内的多个事件分组，尖角号在 hot Observable 里标记订阅起点。

掌握这套，时间相关的流就能写出精确、可重复、跑得飞快的单元测试。
-->

---

# RxJS 6 → 7 破坏性变更

| 变更 | 现状 |
|---|---|
| 扁平导入 | 从 `'rxjs'` 直接导出操作符 |
| `toPromise()` | **废弃** → `firstValueFrom`/`lastValueFrom` |
| `subscribe(next,err,done)` | **废弃** → 传 observer 对象 |
| `retryWhen` | **废弃** → `retry({ delay })` |
| 多播 patch | 废弃 → `share`/`shareReplay`/`connectable` |
| 原型链操作符 | 移除 → 全用 pipeable |

<div v-click class="mt-2 text-sm">

> `firstValueFrom` 空流会 **reject `EmptyError`**（旧 `toPromise` resolve `undefined`），可传 `{ defaultValue }`。

</div>

<!--
从 RxJS 6 升级到 7，几个必须知道的破坏性变更。

第一，扁平导入：操作符和创建函数从 rxjs 包根直接导出。

第二，toPromise 被废弃，计划 v8 移除，改用 firstValueFrom 和 lastValueFrom。这里有个语义陷阱：旧的 toPromise 在空流时 resolve 成 undefined，而 firstValueFrom 在空流时会 reject 一个 EmptyError。要避免就传第二参 defaultValue。

第三，subscribe 传多个分散回调参数的写法废弃了，改成传一个 observer 对象；只传一个 next 函数仍然合法。

第四，retryWhen 废弃，改用 retry 的 delay 选项。

第五，multicast、publish、refCount 这套多播 patch 废弃，改用 share、shareReplay、connectable。

第六，原型链上的 patch 操作符彻底移除，全部用 pipeable。

迁移建议就一句话：坚持扁平导入加 pipeable 加 firstValueFrom，把旧 API 逐步替换。
-->

---
layout: intro
---

# 总结

RxJS = **用 Observable 统一异步的响应式编程**

- 三件套：Observable（惰性多值）/ Observer / Subscription
- 操作符：`pipe()` 串纯函数，**switchMap/mergeMap/concatMap/exhaustMap** 分清
- 冷热：冷=单播每次重跑，热=多播共享；`Subject` + `share` 多播
- 错误：`catchError` 返回替代流 + `retry({ delay })`
- 防泄漏：`takeUntil(destroy$)` / `take` / Angular `async` 管道
- 取舍：多值/可取消/可组合用它；简单单值用 Promise
- 7.x：扁平导入、`firstValueFrom` 取代 `toPromise`

<!--
总结一下。

RxJS 的本质是用 Observable 统一异步的响应式编程。

三件套：Observable 惰性、可推多个值，Observer 用 next、error、complete 接收，Subscription 用 unsubscribe 取消。

操作符用 pipe 串纯函数，最重要的是分清高阶映射四兄弟：switchMap 取消旧的取最新、mergeMap 并发、concatMap 排队保序、exhaustMap 忙时拒新。

冷热：冷是单播、每次订阅重跑，热是多播、共享数据源；用 Subject 和 share 把单播变多播、共享一次执行。

错误处理：catchError 返回替代流降级，retry 加 delay 重试，注意两者顺序。

防内存泄漏：takeUntil 加 destroy、take、或 Angular 的 async 管道，活跃订阅不会被 GC，这是最常见的线上坑。

取舍：多值、可取消、要组合就用 Observable，简单单值用 Promise，别过度工程。

最后，RxJS 7 记住扁平导入和 firstValueFrom 取代 toPromise。谢谢大家。
-->
