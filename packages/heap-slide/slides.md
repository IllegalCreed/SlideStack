---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 堆
info: |
  ## 堆（Heap）
  完全二叉树 · 堆序性 · 数组表示
  优先队列的标准实现。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 堆

完全二叉树 · O(1) 取极值 · 优先队列的底层

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/heap" target="_blank" class="icon-btn">
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
堆是优先队列的标准实现，今天讲透它的两个性质、数组映射、sift up/down 和 Top-K 应用。
-->

---
transition: fade-out
---

# 堆是什么

两个性质的叠加：**完全二叉树** + **堆序性**。

<v-clicks>

- **完全二叉树**：除末层外每层填满，末层从左到右连续——形状「紧致」
- **堆序性**：每个节点 ≤ 或 ≥ 其子节点（只约束父子，不约束兄弟）
- **大根堆**：父 ≥ 子，堆顶是**最大值**
- **小根堆**：父 ≤ 子，堆顶是**最小值**

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：堆只保证「根是极值」，不关心全序——为「动态取最值」量身定做。

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
堆的两个性质：形状（完全二叉树）+ 值（堆序性）。堆序性只约束父子，所以中序无序。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# 大根堆 vs 小根堆

::left::

<div class="text-center text-2xl font-bold mb-4 text-blue-600">大根堆</div>

```
        9
      /   \
     8     7
    / \   /
   5   4 6
```

- 父 **≥** 子
- 堆顶 = **最大值**
- 堆排序（升序）

::right::

<div class="text-center text-2xl font-bold mb-4 text-purple-600">小根堆</div>

```
        1
      /   \
     3     2
    / \   /
   7  6  4
```

- 父 **≤** 子
- 堆顶 = **最小值**
- 优先队列 / Top-K

::bottom::

<div v-click class="mt-6 text-center text-lg">

🎯 口诀：**要最小用小根堆，要最大用大根堆**——堆顶直接给极值

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.9em; }
</style>

<!--
两种堆的对照。注意求前K大反而用小根堆（堆顶当门槛）——下一页讲。
-->

---

# 数组表示：完全二叉树的天然映射

完全二叉树按层序映射到数组，父子下标是 O(1) 算术运算。

<div class="grid grid-cols-2 gap-8">
<div>

**下标公式（根在 0）**

```
父节点  = (i - 1) / 2
左子    = 2 * i + 1
右子    = 2 * i + 2
```

**示例 `[9,8,7,5,4,6]`**

```
根 9 (下标0)
 左子 8 = 2*0+1
 右子 7 = 2*0+2
节点7 父 = (2-1)/2 = 0
```

</div>
<div>

**为什么 O(1) 且省内存**

<v-clicks>

- 纯算术：乘 2 / 除 2，无指针
- 内存紧凑：只存值，无左右指针
- 缓存友好：连续存放命中缓存行
- 位运算更快：`>>1` / `<<1`

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ 前提是**完全二叉树**——有空缺下标公式就失效

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
pre { font-size: 0.78em; }
</style>

<!--
完全二叉树的紧致形状让下标与数组位置一一对应，父子关系是算术公式。
-->

---

# sift up：插入时的上浮

新元素追加到**尾部**（保持完全二叉树），再与父比较上浮。

<div class="grid grid-cols-2 gap-8">
<div>

```js
// 大根堆 sift up
function siftUp(h, i) {
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (h[i] <= h[p]) break;
    [h[i], h[p]] = [h[p], h[i]];
    i = p;
  }
}
```

**插入 = 追加 + sift up**

```js
function push(h, x) {
  h.push(x);
  siftUp(h, h.length - 1);
}
```

</div>
<div>

**要点**

<v-clicks>

- 追加尾部保形状
- 比**父大**就交换上浮
- 每步 i 减半，最多 log n 步
- 小根堆：`<=` 改 `>=`

</v-clicks>

<div v-click class="mt-4 p-3 rounded bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-sm">

**复杂度 O(log n)**：沿一条路径调整，树高 ⌈log n⌉

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
pre { font-size: 0.78em; }
</style>

<!--
sift up 用于插入。新元素放尾部，逐层与父比较，不满足就交换上浮到根。
-->

---

# sift down：删除堆顶时的下沉

尾部元素补到堆顶，再与**较大子**比较下沉（大根堆）。

<div class="grid grid-cols-2 gap-8">
<div>

```js
// 大根堆 sift down
function siftDown(h, i, n) {
  while (true) {
    let big = i;
    const l = 2*i+1, r = 2*i+2;
    if (l < n && h[l] > h[big]) big = l;
    if (r < n && h[r] > h[big]) big = r;
    if (big === i) break;
    [h[i], h[big]] = [h[big], h[i]];
    i = big;
  }
}
```

</div>
<div>

**删堆顶三步**

```js
function pop(h) {
  const top = h[0];
  const last = h.pop();
  if (h.length > 0) {
    h[0] = last;
    siftDown(h, 0, h.length);
  }
  return top;
}
```

<v-click>

⚠️ 先 `pop()` 取尾部，判空，再补顶下沉

</v-click>

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
sift down 用于删堆顶。尾部补顶，与较大子交换下沉。删堆顶顺序易错：先pop取尾再补。
-->

---

# 建堆 O(n)：Floyd 自底向下

从**最后一个非叶节点**起，自底向下逐个 sift down。

<div class="grid grid-cols-2 gap-8">
<div>

```js
function buildHeap(h) {
  const n = h.length;
  // 最后一个非叶节点
  for (let i = (n >> 1) - 1;
       i >= 0; i--) {
    siftDown(h, i, n);
  }
}
```

**为什么是 O(n) 而非 O(n log n)**

<v-clicks>

- n/2 个叶子下沉 **0 步**
- n/4 个节点下沉 ≤ 1 步
- 只有根下沉 ≤ log n 步
- 求和收敛：**O(n)**

</v-clicks>

</div>
<div>

**vs 逐个插入（O(n log n)）**

| 方法 | 复杂度 |
| --- | --- |
| Floyd 建堆 | **O(n)** ✅ |
| 逐个 sift up | O(n log n) ❌ |

<div v-click class="mt-4 p-3 rounded bg-green-50 dark:bg-green-900/30 border-l-4 border-green-600 text-sm">

**关键**：叶子层（占一半）不调整，上层虽深但节点少，求和收敛到 O(n)

</div>

<div v-click class="mt-2 text-center text-sm">

建堆永远用 Floyd

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
pre { font-size: 0.78em; }
table { font-size: 0.85em; }
</style>

<!--
Floyd建堆O(n)是堆独有的线性构建优势。叶子不调整，求和收敛。逐个插入才是O(n log n)。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 堆 vs 二叉搜索树（BST）

::left::

<div class="text-center text-xl font-bold mb-3 text-blue-600">堆</div>

| 维度 | 堆 |
| --- | --- |
| 结构 | 完全二叉树 |
| 约束 | 父≥/≤子（部分序）|
| 取极值 | **O(1)** ✅ |
| 查任意值 | O(n) ❌ |
| 中序遍历 | **无序** |

::right::

<div class="text-center text-xl font-bold mb-3 text-purple-600">BST</div>

| 维度 | BST |
| --- | --- |
| 结构 | 任意形状 |
| 约束 | 左<根<右（全序）|
| 取极值 | O(log n) |
| 查任意值 | **O(log n)** ✅ |
| 中序遍历 | **有序** ✅ |

::bottom::

<div v-click class="mt-6 text-center text-lg">

🎯 堆牺牲全序换 **O(1) 极值** → 优先队列；BST 保全序换 **O(log n) 查找** → 字典

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
table { font-size: 0.8em; }
</style>

<!--
堆只管根极值（取最值O(1)），BST管全序（查任意值O(log n)）。选型看需求。
-->

---

# 优先队列与 Top-K

**优先队列**：按优先级出队，堆是标准实现；**Top-K**：堆的高频应用。

<div class="grid grid-cols-2 gap-8">
<div>

**优先队列复杂度**

| 操作 | 复杂度 |
| --- | --- |
| 入队 push | O(log n) |
| 出队 pop | O(log n) |
| 查队首 peek | **O(1)** |

**典型场景**：进程调度、定时器、任务队列

</div>
<div>

**Top-K：求前 K 大用小根堆**

```js
function topK(arr, k) {
  const h = [];
  for (const x of arr) {
    pushMin(h, x);
    if (h.length > k) popMin(h);
  }
  return h; // 前 K 大
}
```

<v-click>

- 堆顶 = K 个里的**门槛**（最小）
- O(n log K) 时间，O(K) 空间
- 适合**数据流**、K ≪ n

</v-click>

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
pre { font-size: 0.74em; }
table { font-size: 0.85em; }
</style>

<!--
优先队列=堆。Top-K反直觉：求前K大用小根堆，堆顶当门槛淘汰较小者。
-->

---

# 各语言堆实现

| 语言 | 类型 / 模块 | 默认序 | 备注 |
| --- | --- | --- | --- |
| Java | `PriorityQueue` | 小根堆 | 传反转比较器变大根 |
| C++ | `priority_queue` | 大根堆 | 配 `greater<T>` 变小根 |
| Python | `heapq` | 小根堆 | 大根堆用取负技巧 |
| Go | `container/heap` | 自定义 | 实现 `heap.Interface` |
| **JS** | **无原生** | — | **手写或用 `heap-js`** |

<div v-click class="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 text-sm">

**JS 无原生堆** 是高频考点——面试常要求手写 sift up/down，工程里引入第三方库或自己实现。

</div>

<div v-click class="mt-3 grid grid-cols-2 gap-4 text-sm">

**Dijkstra/Prim**：堆优化「取最小」从 O(V) 降到 O(log V)

**合并 K 链表**：小根堆每次取全局最小，O(N log K)

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
table { font-size: 0.8em; }
</style>

<!--
各语言堆支持差异大。JS无原生堆是痛点。Dijkstra/Prim/合并K链表都是堆的图算法应用。
-->

---
layout: center
class: text-center
---

# 堆：动态取极值的利器

<div class="text-2xl mt-8 mb-12">

完全二叉树 + 堆序性 → O(1) 取极值 → 优先队列

</div>

<v-click>

<div class="text-lg">

插入 / 删除 O(log n) · 建堆 O(n) · Top-K 的高频解法

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/heap" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/heap-slide/" target="_blank" class="text-xl icon-btn">
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
掌握堆的两个性质、sift up/down、建堆O(n)和Top-K应用，就掌握了动态取极值的核心工具。
-->
