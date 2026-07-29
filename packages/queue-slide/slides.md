---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 队列
info: |
  ## 队列（Queue）
  先进先出 · 循环队列 · BFS
  「先来先服务」的数据结构。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 队列

先进先出 FIFO · 两端 O(1) · 先来先服务

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/queue" target="_blank" class="icon-btn">
    <carbon:dashboard />
  </a>
</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
队列是先进先出的受限线性表，今天讲透它的 FIFO 本质、循环队列的取模、双端队列与单调队列、以及 BFS 这一灵魂应用。
-->

---
transition: fade-out
---

# 队列是什么

一种**先进先出（FIFO）**的受限线性表——只能在**队尾入队**、**队头出队**。

<v-clicks>

- **FIFO 语义**：先入队的先出队，天然匹配「先来先服务」
- **核心权衡**：两端 O(1) 操作 ✅  vs  不能随机访问中间 ❌
- **三个核心操作**：`enqueue` / `dequeue` / `peek`，全 O(1)
- **万物之用**：BFS · 任务调度 · 生产消费 · 消息队列 · JS 事件循环

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：一头进一头出 ⇒ 先来的先走，是「按序处理」场景的最优解。

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
队列的一切特性源于"一头进一头出"的受限。这种限制换来两端 O(1) 与 FIFO 公平。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# 复杂度：队列 vs 栈

::left::

<div class="text-center text-2xl font-bold mb-4 text-blue-600">队列（FIFO）</div>

| 操作 | 复杂度 |
| --- | --- |
| `enqueue` 入队 | **O(1)** ✅ |
| `dequeue` 出队 | **O(1)** ✅ |
| `peek` 看队头 | **O(1)** ✅ |
| 随机访问 `q[i]` | O(n) ❌ |

::right::

<div class="text-center text-2xl font-bold mb-4 text-purple-600">栈（LIFO）</div>

| 操作 | 复杂度 |
| --- | --- |
| `push` 压栈 | **O(1)** ✅ |
| `pop` 弹栈 | **O(1)** ✅ |
| `peek` 看栈顶 | **O(1)** ✅ |
| 随机访问 `s[i]` | O(n) ❌ |

::bottom::

<div v-click class="mt-6 text-center text-lg">

🎯 区别：队列**一头进一头出**（双指针 front/rear）；栈**同端进出**（单指针 top）

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
table { font-size: 0.85em; }
</style>

<!--
队列和栈都是受限线性表，复杂度相同（端操作 O(1)），区别在限制方式：FIFO vs LIFO。
-->

---

# 核心操作：入队出队都是 O(1)

队尾写入、队头移除，无需搬移其他元素。

<div class="grid grid-cols-2 gap-8">
<div>

```js {all|1-3|5-7|all}
// 链式队列：头尾指针
class Queue {
  constructor() {
    this.head = this.tail = null;
  }
  enqueue(x) {              // 队尾入 O(1)
    const n = { val: x };
    this.tail ? this.tail.next = n
              : this.head = n;
    this.tail = n;
  }
  dequeue() {               // 队头出 O(1)
    const x = this.head.val;
    this.head = this.head.next;
    return x;
  }
}
```

</div>
<div>

**为什么两端都 O(1)**

<v-clicks>

- 入队：只动 `tail` 指针
- 出队：只动 `head` 指针
- **不搬移任何元素**
- 对比数组头删 O(n)（要整体搬）

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm">

⚠️ JS 用 `Array` 的 `shift()` 出队是 **O(n)**，高频队列别用它

</div>

</div>
</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.7em; }
</style>

<!--
队列两端 O(1) 的根源：只改指针不搬数据。JS 的 shift() 是反例——整体搬移退化 O(n)。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 顺序队列 vs 链式队列

::left::

**顺序队列（数组 + 指针）**

```js
class ArrayQueue {
  enqueue(x) {
    this.data[this.rear++] = x;
  }
  dequeue() {
    return this.data[this.front++];
  }
}
```

<v-clicks>

- ✅ 连续内存缓存友好
- ❌ **假溢出**：front 前空间浪费

</v-clicks>

::right::

**链式队列（链表 + 头尾指针）**

```js
class LinkedQueue {
  enqueue(x) {
    this.tail.next = node;
    this.tail = node;
  }
}
```

<v-clicks>

- ✅ 动态扩容、无假溢出
- ❌ 每节点多一个指针
- ❌ 节点分散缓存不友好

</v-clicks>

::bottom::

<div v-click class="mt-4 text-center">

⚡ 假溢出 → 用**循环队列**（取模回绕）解决

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.72em; }
</style>

<!--
顺序队列的假溢出是核心痛点。循环队列用取模让它首尾相接，彻底复用空间。
-->

---

# 循环队列：取模 + 判满

数组视为首尾相接的环：`(i+1) % capacity` 让 rear 绕回头部。

<div class="grid grid-cols-2 gap-6">
<div>

**核心：取模回绕**

```js
class CircularQueue {
  constructor(k) {
    this.data = new Array(k + 1); // 牺牲 1 单元
    this.cap = k + 1;
    this.front = 0;
    this.rear = 0;          // 下一个写位置
  }
  isEmpty() { return this.front === this.rear; }
  isFull()  { return (this.rear + 1) % this.cap === this.front; }
  enqueue(x) {
    if (this.isFull()) return false;
    this.data[this.rear] = x;
    this.rear = (this.rear + 1) % this.cap;
  }
}
```

</div>
<div>

**判空判满三种方式**

| 方式 | 判满 |
| --- | --- |
| 牺牲单元 | `(rear+1)%cap==front` |
| 计数器 size | `size==cap` |
| 标志位 tag | `front==rear&&tag` |

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ `rear-1` 取模：`(rear-1+cap)%cap`，避免 JS 负数取模

</div>

<div v-click class="mt-2 text-center text-sm">

容量 k → 数组开 **k+1**（牺牲单元）

</div>

</div>
</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.62em; }
</style>

<!--
循环队列：取模让下标回绕，判满用牺牲单元最经典。容量 k 开 k+1 是高频坑。
-->

---

# 双端队列 deque：两端都能进出

两端都能 push/pop，兼具栈和队列能力，全 O(1)。

<div class="grid grid-cols-2 gap-8">
<div>

```
pushBack  → [ A, B, C ] ← pushFront
popBack   ←             → popFront
```

**四个操作全 O(1)**

<v-clicks>

- `pushFront` / `pushBack`
- `popFront` / `popBack`
- 既能当栈，又能当队列

</v-clicks>

</div>
<div>

**各语言实现**

<v-clicks>

- C++ `std::deque`（分块存储）
- Java `ArrayDeque`（循环数组）
- Python `collections.deque`
- JS 无内建（自实现/库）

</v-clicks>

<div v-click class="mt-3 p-2 rounded bg-blue-50 dark:bg-blue-900/20 text-sm">

🎯 deque 是**单调队列**的底层容器

</div>

</div>
</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
双端队列两端都能操作。它的真正威力在于作为单调队列的容器，解决滑动窗口最值。
-->

---

# 滑动窗口最大值：单调队列 O(n)

维护值单调递减的 deque，队头恒是窗口最大值。

<div class="grid grid-cols-2 gap-6">
<div>

**核心三步**

```js {all|1-4|5-6|7-8|all}
for (let i = 0; i < n; i++) {
  // 1. 弹尾：比新来的小的全弹掉
  while (dq.length && nums[dq.at(-1)] <= nums[i])
    dq.pop();
  dq.push(i);
  // 2. 弹头：队头超出窗口
  if (dq[0] <= i - k) dq.shift();
  // 3. 队头即最大值
  if (i >= k - 1) res.push(nums[dq[0]]);
}
```

</div>
<div>

**为什么 O(n)**

<v-clicks>

- 每元素最多入队 1 次
- 最多出队 1 次（弹尾或弹头）
- 总操作 ≤ 2n
- **整体 O(n)** ✅

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-green-50 dark:bg-green-900/20 text-sm">

暴力 O(nk) → 单调队列 **O(n)**

</div>

<div v-click class="mt-2 text-center text-sm">

口诀：窗口问最值 → 单调队列

</div>

</div>
</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.72em; }
</style>

<!--
单调队列把滑动窗口最值从 O(nk) 降到 O(n)。弹尾保持单调、弹头维持窗口、队头即最值。
-->

---

# BFS：队列的灵魂应用

广度优先——用队列按层扩展，先入队的先访问。

<div class="grid grid-cols-2 gap-6">
<div>

**层序遍历框架**

```js {all|1-3|5|6-8|all}
function levelOrder(root) {
  const res = [], q = [root];
  let head = 0;            // 避 shift() 的 O(n)
  while (head < q.length) {
    const level = [], n = q.length;
    for (let i = head; i < n; i++) {
      const node = q[head++];
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    res.push(level);
  }
  return res;
}
```

</div>
<div>

**BFS 适用场景**

<v-clicks>

- 树/图的**层序遍历**
- 无权图**最短步数**
- 岛屿数量、腐烂橘子
- 单词接龙

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ 标记 visited 要在**入队时**，不是出队时

</div>

<div v-click class="mt-2 text-center text-sm">

复杂度 **O(V+E)**

</div>

</div>
</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.65em; }
</style>

<!--
BFS 是队列最重要的算法应用。用 head++ 索引出队避免 shift 的 O(n)。visited 入队时标记。
-->

---

# 工程应用：调度、生产消费、消息队列

<v-clicks>

- **任务调度**：操作系统进程就绪队列（FCFS 先来先服务）、打印机任务——FIFO 保证公平
- **生产者-消费者**：阻塞队列缓冲——满则生产者阻塞、空则消费者阻塞（线程同步）
- **消息队列（MQ）**：Kafka / RabbitMQ 跨进程的解耦 + 削峰 + 异步
- **优先队列**：FIFO 不够用时升级——按优先级出队，底层是堆（O(log n)）
- **JS 事件循环**：宏任务队列 + 微任务队列，微任务每轮宏任务后全部清空

</v-clicks>

<div v-click class="mt-6 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500">

**选型口诀**：要 FIFO 公平 → 普通队列；要最短路径/分层 → BFS；要优先级 → 优先队列；要跨进程解耦 → 消息队列

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
队列在工程中无处不在：调度、缓冲、解耦。FIFO 不够用时升级为优先队列（堆）或消息队列。
-->

---
layout: center
class: text-center
---

# 队列是「按序处理」的基石

<div class="text-2xl mt-8 mb-12">

FIFO → 两端 O(1) → 承载按序与按层场景

</div>

<v-click>

<div class="text-lg">

循环队列 · 双端队列 · 单调队列 · BFS · 调度 · 生产消费 都以它为核心

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/queue" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/queue-slide/" target="_blank" class="text-xl icon-btn">
    <carbon:link /> 幻灯片
  </a>
</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
队列是「按序处理」的基石。掌握循环队列取模、单调队列、BFS，就有了队列的全部考点。
-->
