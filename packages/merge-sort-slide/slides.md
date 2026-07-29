---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 归并排序
info: |
  ## 归并排序（Merge Sort）
  分治 · 合并 · O(n log n) 稳定
  排序三件套的「稳」。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 归并排序

分治 · O(n log n) 稳定 · 排序三件套的「稳」

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/merge-sort" target="_blank" class="icon-btn">
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
归并排序是分治思想的经典体现。今天讲透它的分治结构、两种写法、稳定性，以及逆序对、外排序等高阶应用。
-->

---
transition: fade-out
---

# 归并排序是什么

**分治**算法——对半切成两段各自排序，再用一次 **O(n) merge** 合并成有序整体。

<v-clicks>

- **核心结构**：分（对半切）→ 治（递归排序两半）→ 合（merge 缝合）
- **递归式**：`T(n) = 2·T(n/2) + O(n)` → **O(n log n)**
- **三态一致**：最好 = 平均 = 最坏 = O(n log n)，**无最坏退化**
- **稳定排序**：merge「相等取左半」保证相等元素次序不变
- **代价**：**O(n) 辅助空间**，非原地

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：分治递归 + O(n) merge ⇒ O(n log n) 且稳定，代价是 O(n) 空间。

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
归并的一切源于「分治递归 + O(n) merge」这个结构。三态一致和稳定性是它对快排的核心优势。
-->

---

# 分治递归树：分两半、各自排、再合并

递归树高 log₂ n，每层 merge 总工作量 n，故 O(n log n)。

```
        [8,5,2,6,3,7,1,4]
       /                \
   [8,5,2,6]          [3,7,1,4]      ← 对半切（分）
   /      \            /      \
 [8,5]   [2,6]      [3,7]   [1,4]    ← 继续分
  ↓       ↓           ↓       ↓
 [5,8]   [2,6]      [3,7]   [1,4]    ← 单元素有序→merge（治）
   \      /            \      /
 [2,5,6,8]          [1,3,4,7]        ← 再 merge
        \              /
    [1,2,3,4,5,6,7,8]                ← 最终 merge
```

<div v-click class="mt-2 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

**递归基**：长度 ≤ 1 天然有序，直接返回。树高恒为 ⌈log₂ n⌉，与输入无关——这是三态一致的根源。

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.62em; line-height: 1.25; }
</style>

<!--
递归树形状固定，所以最好最坏平均都一样。merge每层总量n，共log n层。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 两种写法：递归 vs 迭代

::left::

**自顶向下（递归）**

```js
function sort(a, l, r, t) {
  if (l >= r) return;          // 递归基
  const m = (l + r) >> 1;
  sort(a, l, m, t);            // 左半
  sort(a, m+1, r, t);          // 右半
  merge(a, l, m, r, t);        // 合并
}
```

- 直观、好写好讲
- 递归树自然展开
- 栈空间 O(log n)

::right::

**自底向上（迭代）**

```js
for (let w = 1; w < n; w <<= 1) {
  for (let i = 0; i < n; i += 2*w) {
    const m = i + w - 1;
    const r = Math.min(i+2*w-1, n-1);
    if (m < n-1) merge(a, i, m, r, t);
  }
}
```

- 步长 1→2→4→…→n
- 无递归，省栈
- 边界处理更繁琐

::bottom::

<div v-click class="mt-4 text-center">

🎯 两者复杂度**完全一致**（O(n log n)/O(n) 空间/稳定），用同一个 merge 函数，只是组织方式不同。

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
递归版教学默认；迭代版省栈常数小但边界烦。面试默认写递归。
-->

---

# merge 操作：双指针取小

两个有序段合并，`i` 指左段头、`j` 指右段头，每次取小者。

```js
function merge(a, l, m, r, t) {
  for (let k = l; k <= r; k++) t[k] = a[k];   // 1. 先拷到临时区
  let i = l, j = m+1, k = l;
  while (i <= m && j <= r)                     // 2. 双指针取小
    if (t[i] <= t[j]) a[k++] = t[i++];         // ★ <= 取左半→稳定
    else a[k++] = t[j++];
  while (i <= m) a[k++] = t[i++];              // 3. 左段剩余
  while (j <= r) a[k++] = t[j++];              // 4. 右段剩余
}
```

<div class="grid grid-cols-2 gap-4 mt-3">
<div v-click class="p-2 rounded bg-green-50 dark:bg-green-900/20 text-sm">

✅ **稳定关键**：`<=` 相等时取**左半**，保持次序

</div>
<div v-click class="p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm">

❌ **常见坑**：不先拷 t 直接合并会**自覆盖**

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
merge是归并的灵魂。先拷tmp避免自覆盖；<=取左半保证稳定。单次O(段长)。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 复杂度与稳定性

::left::

<div class="text-center text-2xl font-bold mb-4 text-blue-600">时间 · 空间</div>

| 维度 | 归并 |
| --- | --- |
| 最好 | **O(n log n)** |
| 平均 | **O(n log n)** |
| 最坏 | **O(n log n)** |
| 空间 | **O(n)** |
| 栈 | O(log n) |

<div class="mt-2 text-sm text-center text-gray-500">三态一致是它对快排的优势</div>

::right::

<div class="text-center text-2xl font-bold mb-4 text-purple-600">稳定性</div>

**为什么稳定？**

<v-clicks>

- merge 比较 `t[i] <= t[j]`
- 相等时**优先取左半**
- 左半本就排在右半前面
- 次序自然保持

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm">

⚠️ 写成 `<` 会破坏稳定

</div>

::bottom::

<div v-click class="mt-4 text-center">

⚡ 递归式 `T(n)=2·T(n/2)+O(n)`，主定理 → **O(n log n)**

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
三态一致+稳定+O(n)空间。稳定性的关键在merge的比较方向写<=。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# 归并 vs 快排

::left::

<div class="text-center text-2xl font-bold mb-4 text-blue-600">归并排序</div>

| 维度 | 复杂度 |
| --- | --- |
| 平均 | O(n log n) |
| 最坏 | **O(n log n)** ✅ |
| 空间 | O(n) ❌ |
| 稳定 | **是** ✅ |
| 原地 | 否 ❌ |

::right::

<div class="text-center text-2xl font-bold mb-4 text-purple-600">快速排序</div>

| 维度 | 复杂度 |
| --- | --- |
| 平均 | O(n log n)（更快） |
| 最坏 | O(n²) ❌ |
| 空间 | O(log n) ✅ |
| 稳定 | 否 ❌ |
| 原地 | **是** ✅ |

::bottom::

<div v-click class="mt-6 text-center text-lg">

🎯 **要稳定 / 怕最坏退化 → 归并；要原地 / 求最快 → 快排**

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
归并赢稳定+最坏可控，快排赢原地+常数小。库选型看场景：Python/Java对象要稳定用Timsort，基本类型求快用快排系。
-->

---

# 逆序对计数：merge 的副产品

merge 时若**取右段**，说明左段剩余**全部**大于它。

```js
let cnt = 0;
// ... merge 内双指针循环 ...
if (t[i] <= t[j]) a[k++] = t[i++];
else { a[k++] = t[j++]; cnt += m - i + 1; }   // ★ 逆序对 += 左段剩余
```

<div class="grid grid-cols-2 gap-6 mt-4">
<div>

**为什么对？**

<v-clicks>

- 暴力双循环 O(n²)
- merge 跨段统计逆序对
- 段内逆序对深层已统计
- 每对**恰好统计一次**
- 总 **O(n log n)** ✅

</v-clicks>

</div>
<div v-click class="p-3 rounded bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**例**：左 `[5,6,8]` 右 `[2,4]`

取 2 时，左段剩余 3 个全 > 2 → `cnt += 3`

取 4 时，左段剩余 3 个全 > 4 → `cnt += 3`

共 6 对逆序对。

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
逆序对是归并的高频考点。取右段时左段剩余都构成逆序对，一次累加mid-i+1。剑指Offer51。
-->

---

# 外排序与 Timsort

<div class="grid grid-cols-2 gap-6">
<div>

**外排序（海量数据）**

<v-clicks>

- 数据超内存 → **分块**内排序落盘
- **多路归并**（最小堆）合并
- 归并**顺序 I/O** 对磁盘友好
- k 路归并 O(n log k)
- 数据库 `ORDER BY` 爱用归并

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

为何？稳定 + 顺序 I/O + 可外排序 + 可并行

</div>

</div>
<div>

**Timsort（归并 + 插入）**

<v-clicks>

- Python `sorted` / Java 对象默认
- 识别已有序的 **run**
- 短 run 用**插入排序**扩长
- 自适应合并，galloping 加速
- 最好 **O(n)**（数据有序）

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-purple-50 dark:bg-purple-900/20 text-sm">

本质：自适应归并，越有序越快

</div>

</div>
</div>

<div v-click class="mt-3 text-center text-sm text-gray-500">

链表归并排序：快慢指针找中点、改指针合并 → **O(1) 额外空间**，链表排序最优解

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
归并的应用：外排序（海量数据分块+多路归并）、Timsort（自适应归并）、链表归并（O(1)空间）。这几点让归并成为数据库/文件排序的事实标准。
-->

---
layout: center
class: text-center
---

# 归并排序：稳如磐石

<div class="text-2xl mt-8 mb-12">

分治递归 → O(n log n) 三态一致 → 稳定 + 可外排序

</div>

<v-click>

<div class="text-lg">

逆序对 · 外排序 · Timsort · 链表归并 都源于 merge

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/merge-sort" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/merge-sort-slide/" target="_blank" class="text-xl icon-btn">
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
归并的核心价值：稳定、最坏可控、适合外排序和链表。掌握merge和分治结构，就抓住了归并的全部。
-->
