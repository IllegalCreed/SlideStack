---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 链表
info: |
  ## 链表（Linked List）
  节点 · 指针 · 分散存储
  用 O(1) 增删换 O(n) 访问。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 链表

节点 · 指针连接 · 用 O(1) 增删换 O(n) 访问

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/link" target="_blank" class="icon-btn">
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
链表是最基础的线性数据结构之一，今天讲透它的节点模型、三种形态和双指针套路。
-->

---
transition: fade-out
---

# 链表是什么

用**指针**把一组**分散在内存各处的节点**串成一条链的线性结构。

<v-clicks>

- **节点（node）**：`数据域 val + 指针域 next`，节点散落在堆内存各处
- **核心权衡**：O(1) 增删（已知节点）✅  vs  O(n) 访问 ❌
- **缓存不友好**：节点分散，CPU 缓存行命中率极低
- **不能随机访问**：按下标 `node(i)` 要从头遍历，也无法二分
- **手写结构入门**：栈 / 队列 / 哈希桶 / LRU 都以它为底层

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：节点分散 + 指针连接 ⇒ O(1) 增删，但失去随机访问。

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
链表的一切特性都源于"节点分散+指针连接"。这是它和数组的核心区别。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# 复杂度：数组 vs 链表

::left::

<div class="text-center text-2xl font-bold mb-4 text-blue-600">数组</div>

| 操作 | 复杂度 |
| --- | --- |
| 访问 `a[i]` | **O(1)** ✅ |
| 头部增删 | O(n) ❌ |
| 尾部增删 | **O(1)** ✅ |
| 中间增删 | O(n) ❌ |
| 二分查找 | **O(log n)** ✅ |

::right::

<div class="text-center text-2xl font-bold mb-4 text-purple-600">链表</div>

| 操作 | 复杂度 |
| --- | --- |
| 访问 `node(i)` | O(n) ❌ |
| 头部增删 | **O(1)** ✅ |
| 尾部增删 | **O(1)** ✅ |
| 中间增删 | **O(1)** ✅ |
| 二分查找 | 不支持 ❌ |

::bottom::

<div v-click class="mt-6 text-center text-lg">

🎯 选型：**读多/要随机访问/要二分 → 数组；增删多/频繁头插 → 链表**

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
两者复杂度完全镜像：数组擅长访问，链表擅长增删。
-->

---

# 单 / 双 / 循环链表

<div class="grid grid-cols-3 gap-6">
<div>

**单链表**

```
A -> B -> C -> null
```

<v-clicks>

- 只有 `next`
- 单向遍历
- 删节点需找前驱
- 面试默认形态

</v-clicks>

</div>
<div>

**双链表**

```
A <-> B <-> C
```

<v-clicks>

- `prev + next`
- 双向遍历
- 删节点 O(1)
- LRU 底层
- 多存一个指针

</v-clicks>

</div>
<div>

**循环链表**

```
A -> B -> C -> A
```

<v-clicks>

- 尾指回头
- 首尾相接
- 约瑟夫环
- 遍历判 `===head`

</v-clicks>

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
.text-sm { font-size: 0.85em; }
</style>

<!--
三种形态的区别核心在指针数量和首尾连接方式。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 反转链表：迭代 + 递归

::left::

**迭代：三指针翻转**

```js
let prev = null, curr = head;
while (curr) {
  const next = curr.next; // 1.先存
  curr.next = prev;       // 2.掉头
  prev = curr;            // 3.推进
  curr = next;            // 4.推进
}
return prev; // 新头
```

<v-click>

O(n) O(1) —— 工程首选

</v-click>

::right::

**递归：自底向上接回**

```js
function reverse(head) {
  if (!head || !head.next)
    return head;
  const h = reverse(head.next);
  head.next.next = head;
  head.next = null;
  return h;
}
```

<v-click>

O(n) O(n) 栈 —— 长链栈溢出

</v-click>

::bottom::

<div v-click class="mt-4 text-center">

🔑 **铁律**：改 `next` 前必须先存原值，否则断链丢节点

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
反转是链表题的Hello World。迭代用三指针，递归靠回溯接回。铁律：先存next。
-->

---

# 环检测：Floyd 快慢指针

`slow` 走 1 步、`fast` 走 2 步，有环必在环内相遇。

```js {all|1-2|3-5|all}
let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next;       // 慢针走 1
  fast = fast.next.next;  // 快针走 2
  if (slow === fast) return true; // 相遇⇒有环
}
return false;             // fast 到 null⇒无环
```

<v-clicks>

- **为什么有环必相遇**：入环后每步快比慢多走 1，距离每轮缩短 1，必追上
- **找环入口**：相遇后，从头再发一指针，与相遇点同速走，再次相遇即入口
- **复杂度**：O(n) 时间 O(1) 空间 —— 优于哈希表记录访问的 O(n) 空间

</v-clicks>

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
Floyd判圈是快慢指针的经典应用。快慢入环后距离每步缩1必相遇，无需额外空间。
-->

---

# 双指针套路：找中点 + 倒数第 k

<div class="grid grid-cols-2 gap-6">
<div>

**找中点（快慢指针）**

```js
let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;
}
return slow; // 中点
```

<v-clicks>

- fast 走 2 步、slow 走 1 步
- 偶数长度返回后半第一个
- 用途：归并排序、回文判定

</v-clicks>

</div>
<div>

**倒数第 k（间隔指针）**

```js
let fast = head, slow = head;
for (let i = 0; i < k; i++)
  fast = fast.next; // 先走 k 步
while (fast) {
  slow = slow.next;
  fast = fast.next;
}
return slow; // 倒数第 k
```

<v-clicks>

- fast 先走 k 步拉开间隔
- 再同步走，fast 到尾
- 删倒数 k：fast 走 k+1 步

</v-clicks>

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
找中点和找倒数第k都是快慢/间隔指针的经典套路。前者用速度差，后者用间隔差。
-->

---

# 合并两个有序链表

`dummy` 哨兵 + 双指针，每次取较小者接到结果链尾。

```js {all|1-2|3-7|9-10|all}
function merge(a, b) {
  const dummy = new ListNode(-1);
  let t = dummy;
  while (a && b) {
    if (a.val <= b.val) { t.next = a; a = a.next; }
    else { t.next = b; b = b.next; }
    t = t.next;
  }
  t.next = a || b;  // 接上剩余
  return dummy.next;
}
```

<v-clicks>

- **dummy 的作用**：避免「结果链为空要初始化 head」的特判
- **复杂度**：O(n+m) 时间，O(1) 空间（复用原节点）
- **进阶**：合并 k 个有序链表 → 小顶堆，O(N log k)

</v-clicks>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.74em; }
</style>

<!--
合并有序链表是dummy哨兵的典型应用。凡是"结果链头一开始为空"的题都该用dummy。
-->

---

# 虚拟头节点（dummy）

在真头前加一个**不存数据的哨兵节点**，统一头节点与中间节点的增删。

```js
function operate(head) {
  const dummy = new ListNode(0, head);
  // ... 对 dummy.next 链增删 ...
  return dummy.next; // 返回新头
}
```

<div class="grid grid-cols-2 gap-6 mt-4">
<div>

**何时必须用 dummy**

<v-clicks>

- 删节点（可能删的就是头）
- 合并/拼接（结果头初始为空）
- 反转区段（区段含头节点）
- 头插法构造

</v-clicks>

</div>
<div>

**不用 dummy 的代价**

<v-clicks>

- 「删头节点则更新 head」特判
- 「结果链空则初始化 head」特判
- 代码啰嗦且极易写错
- LRU 用头尾双哨兵免空表特判

</v-clicks>

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
dummy是链表工程里最常用的技巧，凡是可能改变head的操作都该用。核心是消除头节点特判。
-->

---
layout: center
class: text-center
---

# 链表 = 节点 + 指针 + 双指针套路

<div class="text-2xl mt-8 mb-12">

分散存储 → O(1) 增删 → 失去随机访问

</div>

<v-click>

<div class="text-lg">

反转 · 环检测 · 找中点 · 倒数第 k · 合并 · 相交 都是**双指针**的应用

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/link" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/linked-list-slide/" target="_blank" class="text-xl icon-btn">
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
链表的灵魂是双指针。掌握了节点模型和双指针套路，链表题就通了。
-->
