---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 工程实用结构
info: |
  ## 工程实用结构（LRU / 跳表 / 布隆过滤器）
  LRU 缓存 · 跳表 · 布隆过滤器
  用一个数据结构补另一个的短板。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 工程实用结构

LRU 缓存 · 跳表 · 布隆过滤器 · 概率与拼装

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/lru" target="_blank" class="icon-btn">
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
三种工程高频结构：LRU 缓存、跳表、布隆过滤器。它们共同展示了「用一个结构补另一个的短板」的工程思想。
-->

---
transition: fade-out
---

# 三种结构一图概览

都不追求理论最优，而追求「工程上够用、常数小、实现可控」。

<v-clicks>

- **LRU 缓存** = 哈希表 + 双向链表 → `get`/`put` **O(1)**，淘汰「最久未访问」
- **跳表（Skip List）** = 多层概率索引链表 → 有序操作 **期望 O(log n)**
- **布隆过滤器（Bloom Filter）** = 位数组 + 多哈希 → 空间极省的概率判重

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**共同思想**：用一个数据结构补另一个的短板——LRU 拼 哈希+链表；跳表 拼 索引+概率；布隆 拼 多哈希+位数组+接受误判。

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
这页是总纲。三者都不追求理论最优，而是工程够用：LRU 用哈希+链表做 O(1) 淘汰，跳表用概率索引避开平衡树，布隆用误判换空间。
-->

---

# LRU 缓存：淘汰「最久没被访问」的

容量满时，淘汰最长时间没碰过的元素——依据是**局部性原理**。

<v-clicks>

- **两个动作**：①访问/写入时把元素移到「最近」端（队头）；②满时淘汰「最久」端（队尾）
- **难点**：两个动作都要 **O(1)**——单链表搬移 O(1) 但查找 O(n)
- **解法**：**哈希表 + 双向链表**，两者各补对方短板
- **工程地位**：Redis `allkeys-lru` · MySQL Buffer Pool · 操作系统页置换

</v-clicks>

<div v-click class="mt-6 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">

⚠️ **退化**：顺序扫描整个数据集会逐个淘汰热数据——工程上用 **LRU-K / W-TinyLFU** 改良。

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
LRU 的核心：维护一个按最近访问时间排序的队列。关键挑战是两个动作都要 O(1)。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# LRU = 哈希 + 双向链表，全 O(1)

::left::

**为什么是这两个结构**

- 哈希表：**O(1)** 定位节点
- 双向链表：**O(1)** 移到头 / 删尾
- 必须双向：已知节点拿前驱 O(1)
- 单链表删节点要 O(n) 找前驱

**虚拟头尾节点**

- 首尾各加哨兵，真实节点夹中间
- 边界（空表/单节点/头尾）全消失
- `_remove` 全无 `if` 判空

::right::

**核心代码**

```js
get(key) {
  if (!map.has(key)) return -1;
  const n = map.get(key);
  remove(n); addToHead(n);
  return n.val;
}
// 删尾（超容时）
const lru = tail.prev;
remove(lru); map.delete(lru.key);
```

<div class="mt-2 text-center text-sm text-blue-600">

`get`/`put` 均 **O(1)** ✅

</div>

::bottom::

<div v-click class="mt-4 text-center">

🎯 Redis `ZSET`、`LinkedHashMap`(accessOrder) 都是这个套路

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
哈希表解决「找到节点」O(1)，双向链表解决「移到头/删尾」O(1)。虚拟头尾节点是消灭边界判断的关键技巧。
-->

---

# 跳表：多层概率索引链表

在有序链表之上叠加多层「快车道」，把 O(n) 查找压到 **期望 O(log n)**。

```
L2:  HEAD ─────────► 30 ──────────────────► NIL
L1:  HEAD ───► 10 ──► 30 ───► 50 ─────────► NIL
L0:  HEAD ►5►10►20►30►40►50►60►70►80 ────► NIL
```

<v-clicks>

- **查找**：从最高层起，向右走（值更小就走）、走不动就下一层
- **概率层级**：每节点以 p=1/2 概率「晋升」上一层，高度期望 O(log n)
- **无旋转、无颜色翻转**——实现远比红黑树简单

</v-clicks>

<div v-click class="mt-4 p-3 rounded bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-sm">

**代价**：空间约 **1.33 倍**指针开销；期望 O(log n) 而非最坏 O(log n)（极低概率退化）。

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
跳表核心：用概率决定层级，避免平衡树的旋转。查找从高层下探，像走楼梯。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 跳表 O(log n) 查找 + Redis zset

::left::

**查找骨架**

```js
find(k) {
  let cur = this.head;
  for (let i = L-1; i >= 0; i--) {
    while (cur.next[i]
      && cur.next[i].k < k)
      cur = cur.next[i];
  }
  cur = cur.next[0];
  return cur && cur.k === k
    ? cur.v : null;
}
```

::right::

**为什么 Redis 选跳表而非红黑树**

<v-clicks>

- 实现**简单**（代码量 1/3）
- **并发友好**（局部锁）
- 天然**范围查询** O(log n+m)
- 内存可调（改 p 压低层数）

</v-clicks>

::bottom::

<div v-click class="mt-4 text-center">

🎯 Redis `ZSET` = **跳表**（按 score 排序）+ **哈希表**（按 member 查 O(1)）· LevelDB MemTable 同款

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
Redis 选跳表是工程经典：简单、并发友好、支持范围查询。zset 是跳表+哈希表的拼装。
-->

---

# 布隆过滤器：位数组 + 多哈希

**m 位位数组 + k 个哈希函数**，空间极省的概率判重。

<div class="grid grid-cols-2 gap-8">
<div>

**插入**：对 x 算 k 个哈希，对应位全置 1

```
x 的 k=3 个哈希位: 2,5,7
bits: [0,0,1,0,0,1,0,1,0,...]
```

**查询**：算 k 个哈希检查对应位

- 全为 1 → **可能在** 🟡
- 有 0 → **一定不在** ✅

</div>
<div>

**核心性质**

<v-clicks>

- **可能误判**（false positive）
- **绝不漏判**（no false negative）
- 误判率随填充率上升而升高
- **不支持删除**（多位共享）

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ 要删除 → 用 **Counting Bloom Filter**（计数器替位）

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
布隆的核心：多哈希 + 位数组 + 接受误判。关键性质是「可能误判但不漏判」。
-->

---

# 布隆的误判与应用

**应用共性**：海量数据 + 容忍误判 + 要省空间。

<v-clicks>

- **缓存穿透防护**：数据库前挡一层，不存在的 key 直接返回
- **爬虫 URL 去重**：百亿 URL 精确去重哈希表扛不住
- **黑名单/垃圾过滤**：恶意 URL、垃圾邮箱
- **HBase/LevelDB 读优化**：读前过滤避免无谓磁盘 IO

</v-clicks>

<div class="mt-6 p-4 rounded bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**参数选择**（给定元素数 n、误判率 p）

- 位数组大小 `m = -n·ln p / (ln2)²`
- 哈希个数 `k = (m/n)·ln2`
- **1% 误判率 ≈ 每元素 9.6 bit + 7 哈希**（1 亿元素仅 ~114 MB）

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
布隆是缓存穿透、URL 去重、黑名单的第一道防线。参数选择决定误判率和空间。
-->

---

# 三者复杂度与定位对比

| 结构 | 查找 | 插入 | 删除 | 范围查询 | 空间 |
| --- | --- | --- | --- | --- | --- |
| **LRU 缓存** | **O(1)** | **O(1)** | O(1) | ❌ | O(cap) ~2-3x |
| **跳表** | O(log n) | O(log n) | O(log n) | **O(log n+m)** ✅ | ~1.33x 指针 |
| **布隆过滤器** | **O(k)** | **O(k)** | ❌ | ❌ | **极省** |

<div class="grid grid-cols-3 gap-4 mt-6">
<div v-click class="p-3 rounded bg-cyan-50 dark:bg-cyan-900/20 text-center text-sm">

**LRU** 求 O(1) 淘汰

</div>
<div v-click class="p-3 rounded bg-purple-50 dark:bg-purple-900/20 text-center text-sm">

**跳表** 求有序 + 范围

</div>
<div v-click class="p-3 rounded bg-green-50 dark:bg-green-900/20 text-center text-sm">

**布隆** 求空间最省

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
table { font-size: 0.8em; }
</style>

<!--
三者定位完全不同：LRU 求缓存淘汰 O(1)，跳表求有序操作 O(log n)，布隆求空间最省的判重。
-->

---
layout: center
class: text-center
---

# 用一个结构补另一个的短板

<div class="text-2xl mt-8 mb-12">

LRU 拼 哈希+链表 · 跳表 拼 索引+概率 · 布隆 拼 多哈希+位数组+接受误判

</div>

<v-click>

<div class="text-lg">

工程选型看的不是理论最优，而是「延迟 · 内存 · 实现复杂度 · 并发」的综合权衡

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/lru" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/utility-structures-slide/" target="_blank" class="text-xl icon-btn">
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
三者共同思想：用一个结构补另一个的短板。工程选型看综合权衡，不是理论最优。
-->
