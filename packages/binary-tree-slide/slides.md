---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 二叉树与二叉搜索树
info: |
  ## 二叉树与二叉搜索树（Binary Tree & BST）
  递归结构 · 四种遍历 · BST 与平衡树
  非线性数据结构的根基。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 二叉树与二叉搜索树

根 + 左子树 + 右子树 · BST 二分查找 · 平衡树 O(log n)

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/tree" target="_blank" class="icon-btn">
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
二叉树是最基础的非线性数据结构，今天讲透它的递归结构、四种遍历、BST 性质与平衡树。
-->

---
transition: fade-out
---

# 二叉树是什么

每个节点最多两个子节点，由「**根 + 左子树 + 右子树**」递归构成的非线性结构。

<v-clicks>

- **核心术语**：根（无父）、叶（无孩子）、度（孩子数 ≤2）、**深度**（根到此的边数）、**高度**（此到最远叶的边数）
- **递归定义**：空树 ∅ 合法，或根 + 左子树 + 右子树（子树也是二叉树）
- **核心权衡**：天然递归结构易写算法 ✅  vs  链式存储缓存不友好 ❌
- **万物之基**：堆（完全二叉树）、BST、表达式树、哈夫曼树、线段树都以它为模型

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：90% 的二叉树问题 =「处理根 + 递归左 + 递归右 + 合并结果」。

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
递归结构是二叉树的核心。深度自顶向下，高度自底向上，方向别搞反。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 三种特殊二叉树：满、完全、完美

::left::

<div class="text-center text-xl font-bold mb-3 text-blue-600">满 / 完全 / 完美</div>

```
满:        完全:       完美:
   1          1           1
  / \        / \         / \
 2   3      2   3       2   3
           /            / \
          4            4   5
```

::right::

<v-clicks>

- **满二叉树**：非叶节点**必有两个孩子**（度为 0 或 2）——表达式树、哈夫曼树
- **完全二叉树**：除最后一层全满，最后一层**左对齐连续**——**堆**用它
- **完美二叉树**：**每层都满**，第 k 层 2^k 个，共 2^(k+1)-1——理想平衡 BST

</v-clicks>

<div v-click class="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

⚠️ 完全二叉树 = 堆的存储基础；数组存完全二叉树下标 `2i+1`/`2i+2` 无空洞。

</div>

::bottom::

<div v-click class="mt-4 text-center">

🎯 满看「双子」· 完全看「紧凑」· 完美看「全满」

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.8em; }
</style>

<!--
三种特殊树约束递进：满最松（只要非叶双子）、完全中等（左对齐）、完美最严（全满）。
-->

---

# 链式 vs 数组存储

<div class="grid grid-cols-2 gap-6">
<div>

**链式存储**（通用）

```js
class TreeNode {
  constructor(v, l=null, r=null){
    this.val = v;
    this.left = l;
    this.right = r;
  }
}
```

- 支持任意形状
- 增删改指针 O(1)
- 每节点多 2 个指针
- 缓存不友好（节点分散）

</div>
<div>

**数组存储**（完全/满专用）

```
节点 i:  左孩子 2i+1
         右孩子 2i+2
         父    (i-1)>>1
```

- 零指针开销、紧凑
- 下标算父子 O(1)
- 缓存友好（连续内存）
- 普通树有空洞浪费

</div>
</div>

<div v-click class="mt-3 p-3 rounded bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-sm">

⚠️ 数组存储退化单链表要 2^h 大小——**只适合完全/满二叉树**（堆、线段树）。

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
链式通用但浪费空间且缓存差；数组紧凑但只适合完全树。堆用数组是经典组合。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 四种遍历：前中后序（DFS）

::left::

**递归写法**（只差根的位置）

```js
function dfs(root) {
  if (!root) return;
  res.push(root.val); // 前序
  dfs(root.left);
  res.push(root.val); // 中序
  dfs(root.right);
  res.push(root.val); // 后序
}
```

::right::

**前/中/后序对比**

```
      1
     / \
    2   3
   / \   \
  4   5   6

前序(根左右): 1 2 4 5 3 6
中序(左根右): 4 2 5 1 3 6
后序(左右根): 4 5 2 6 3 1
```

<v-clicks>

- 根的访问时机决定遍历名
- 时间 O(n)，栈空间 O(h)

</v-clicks>

::bottom::

<div v-click class="mt-3 p-3 rounded bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-sm">

⚡ 前序「自顶向下」传信息 · 中序「BST 升序」· 后序「自底向上」汇总（求高度/判断平衡）

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
前/中/后序递归写法几乎一样，只差「处理根」那行的位置。根的时机决定遍历名。
-->

---

# 迭代遍历：用栈和队列

<div class="grid grid-cols-2 gap-5">
<div>

**前序迭代**（栈：压右再压左）

```js
const s = [root];
while (s.length) {
  const n = s.pop();
  res.push(n.val);
  if (n.right) s.push(n.right);
  if (n.left) s.push(n.left);
}
```

**层序 BFS**（队列逐层）

```js
const q = [root];
while (q.length) {
  const sz = q.length;
  for (let i=0;i<sz;i++){
    const n = q.shift();
    if (n.left) q.push(n.left);
    if (n.right) q.push(n.right);
  }
}
```

</div>
<div>

**关键技巧**

<v-clicks>

- 前序迭代想「先左」就「先压右」
- 中序：一路向左压栈，弹出处理转右
- 后序：前序镜像（根右左）再反转
- 层序：记录 `sz=queue.length` 区分层
- Morris 遍历：线索化 O(1) 空间

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ 层序忘记记录本层大小，会导致层数混乱

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
迭代用栈模拟递归。前序压栈顺序最易写反。层序用队列且必须逐层记录大小。
-->

---

# BST：中序得升序序列

加有序约束：**左子树值 < 根 < 右子树值**，中序遍历天然升序。

<div class="grid grid-cols-2 gap-6">
<div>

```
        8
       / \
      3   10
     / \    \
    1   6    14
       / \   /
      4   7 13

中序：1 3 4 6 7 8 10 13 14
      ↑ 严格升序 ↑
```

</div>
<div>

<v-clicks>

- **验证 BST**：中序检查严格递增
- **找第 k 小**：中序第 k 个
- **查找**：沿树下行二分，O(h)
- **插入**：找空位挂叶子，O(h)
- 平衡时 h=O(log n)，退化链表 h=O(n)

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-sm">

✅ BST = 链表的动态增删 + 有序数组的快速查找

</div>

</div>
</div>

<div v-click class="mt-2 text-center text-sm text-gray-500">

注意：验证 BST 不能只比左右孩子，要保证**整个左子树**都小于根（传合法上下界或中序）

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
BST 中序得升序是最重要推论。查找本质是沿树二分。退化会让 O(log n) 变 O(n)。
-->

---

# 删除节点：三种情况

最复杂的 BST 操作，按孩子数分情况处理。

<div class="grid grid-cols-2 gap-6">
<div>

**核心代码**（双子用中序后继）

```js
function del(root, key) {
  if (!root) return null;
  if (key < root.val)
    root.left = del(root.left, key);
  else if (key > root.val)
    root.right = del(root.right, key);
  else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    let s = root.right;
    while (s.left) s = s.left; // 后继
    root.val = s.val;
    root.right = del(root.right, s.val);
  }
  return root;
}
```

</div>
<div>

**三种情况**

<v-clicks>

- **① 叶子节点**：直接删，父指针置空
- **② 单子节点**：用唯一孩子**顶替**
- **③ 双子节点**：用**中序后继**（右子树最小）替换值，再删后继

</v-clicks>

<div v-click class="mt-3 p-3 rounded bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-sm">

⚠️ 双子节点**不能直接拿右子顶替**（会丢左子树），必须用后继替换

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
pre { font-size: 0.6em; }
</style>

<!--
删除三情况：叶子删、单子顶替、双子用后继替换。双子最易错——必须用中序后继。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 平衡树：AVL vs 红黑树

BST 退化为链表 O(n) → 平衡树把高度压到 O(log n)。

::left::

**AVL 树**（严格平衡）

<v-clicks>

- 左右子树**高度差 ≤ 1**
- 四种旋转：LL / RR / LR / RL
- 树最矮 → **查找最快**
- 删除最坏 **O(log n) 次旋转**
- 适合**读多写少**（数据库索引）

</v-clicks>

::right::

**红黑树**（弱平衡）

<v-clicks>

- 五条性质：无连续红、黑高相同
- 路径差 ≤ 2 倍，高度仍 O(log n)
- 插入最多 **2 次旋转**
- 删除最多 **3 次旋转**
- **工业标准**：读写均衡

</v-clicks>

::bottom::

<div v-click class="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">

🎯 AVL 查找快但增删旋转多（读多写少）；红黑增删旋转少且均衡（通用场景）。

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
AVL 严格平衡查找快但增删旋转多；红黑弱平衡增删旋转少。退化是平衡树的动机。
-->

---

# 为何红黑树是工业标准

增删查都稳定 O(log n)，且**旋转次数有严格上界**——写多场景优势明显。

<div class="grid grid-cols-2 gap-6">
<div>

**红黑树五条性质**

<v-clicks>

1. 节点是红色或黑色
2. 根节点是黑色
3. 叶子（NIL）是黑色
4. 红节点的孩子必黑（无连续红）
5. 任一节点到叶子的**黑高相同**

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-blue-50 dark:bg-blue-900/20 text-sm">

⇒ 最长路径（红黑相间）≤ 2 × 最短路径（全黑）→ 高度 O(log n)

</div>

</div>
<div>

**工业应用**（无处不在）

<v-clicks>

- C++ STL `std::map` / `std::set`
- Java `TreeMap` / `TreeSet`
- Linux 内核 **CFS 进程调度**
- `epoll` 事件管理
- Nginx timer 管理

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-sm">

✅ 删除最多 3 次旋转 vs AVL 的 O(log n) 次——写多选红黑

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
红黑树增删旋转次数有严格上界，写多场景碾压 AVL，所以成了标准库和内核的首选。
-->

---
layout: center
class: text-center
---

# 二叉树是非线性结构的根基

<div class="text-2xl mt-8 mb-12">

递归结构 → 四种遍历 → BST 有序 → 平衡树 O(log n)

</div>

<v-click>

<div class="text-lg">

堆 · 表达式树 · 哈夫曼树 · 线段树 · 字典树 都建在二叉树之上

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/tree" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/binary-tree-slide/" target="_blank" class="text-xl icon-btn">
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
二叉树是根基。掌握递归思维、四种遍历、BST 与平衡树，后续树形结构就有了根基。
-->
