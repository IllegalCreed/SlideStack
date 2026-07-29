---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 快速排序
info: |
  ## 快速排序（Quicksort）
  分治 · 分区 · 平均 O(n log n)
  实际最快的比较排序。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 快速排序

分治分区 · 平均 O(n log n) · 实际最快的比较排序

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/quick-sort" target="_blank" class="icon-btn">
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
快排是实际工程中最快的通用比较排序，今天讲透它的分治思想、分区策略与工程优化。
-->

---
transition: fade-out
---

# 快排是什么

一种**分治**比较排序：选 pivot、分区、递归，平均 **O(n log n)**。

<v-clicks>

- **三步走**：选 pivot → 分区（小左大右）→ 递归两边
- **核心权衡**：平均 O(n log n) ✅  vs  最坏 O(n²) ❌
- **原地 + 不稳定**：O(log n) 栈空间，相等元素可能换位
- **实际最快**：常数小、缓存友好，比归并快 1.5~2 倍
- **工程标配**：C++ `std::sort`、Java `Arrays.sort`、V8 大数组分支

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：选一个 pivot，把小元素挪左、大元素挪右，再递归排两边。

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
快排的一切特性都源于"选 pivot + 分区"这一核心操作。pivot 选得好就是 O(n log n)，选得差就退化 O(n²)。
-->

---

# 分治三步：选 pivot、分区、递归

每轮分区后 pivot 落到最终位置，问题被切成两个更小的子问题。

```js
function quickSort(a, lo, hi) {
  if (lo >= hi) return;          // 子段 ≤ 1，递归出口
  const p = partition(a, lo, hi); // 分区，返回 pivot 最终下标
  quickSort(a, lo, p - 1);       // 排左段
  quickSort(a, p + 1, hi);       // 排右段
}
```

<v-clicks>

- **选 pivot**：朴素取首/末，工程用随机或三数取中
- **分区**：把 `< pivot` 挪左、`> pivot` 挪右，pivot 落位
- **递归**：子段长度 ≤ 1 时天然有序，递归收敛

</v-clicks>

<div v-click class="mt-4 text-center text-sm text-gray-500">

🎯 pivot 分区后**永远不再移动**——这是快排正确性的关键

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.82em; }
</style>

<!--
快排的骨架极简。唯一有技术含量的是 partition，下一页详细对比。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# Lomuto vs Hoare 分区

::left::

**Lomuto**（单指针，简单）

```js
const pivot = a[hi];
let i = lo - 1;
for (let j = lo; j < hi; j++)
  if (a[j] < pivot) {
    i++;
    [a[i], a[j]] = [a[j], a[i]];
  }
[a[i+1], a[hi]] = [a[hi], a[i+1]];
return i + 1;
```

<div class="mt-2 text-sm text-gray-500">易写 · 交换多 · 教科书首选</div>

::right::

**Hoare**（双指针，快）

```js
const pivot = a[lo + (hi-lo>>1)];
let i = lo-1, j = hi+1;
while (true) {
  do { i++; } while (a[i] < pivot);
  do { j--; } while (a[j] > pivot);
  if (i >= j) return j;
  [a[i], a[j]] = [a[j], a[i]];
}
```

<div class="mt-2 text-sm text-gray-500">交换少 · 更对称 · 工程更快</div>

::bottom::

<div v-click class="mt-4 text-center">

⚠️ Hoare 返回的 `j` **不是** pivot 位，递归用 `(lo,j)` 与 `(j+1,hi)`

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.66em; }
</style>

<!--
两种分区各有取舍。Lomuto 易写但慢；Hoare 快但边界坑多。Hoare 递归边界是最常写错的地方。
-->

---

# 三路快排：专治重复元素

大量重复元素时二路分区会退化——三路把数组切成 `<p`、`=p`、`>p` 三段。

```js
let lt = lo, i = lo, gt = hi;
while (i <= gt) {
  if (a[i] < pivot)      { [a[lt], a[i]] = [a[i], a[lt]]; lt++; i++; }
  else if (a[i] > pivot) { [a[i], a[gt]] = [a[gt], a[i]]; gt--; }
  else                   { i++; }
}
```

<v-clicks>

- **三指针**：`lt`=小于区右界，`i`=扫描，`gt`=大于区左界
- **`a[i] > pivot` 时 `i` 不自增**：换回来的 `a[gt]` 还没看过
- **全相等输入从 O(n²) 降到 O(n)**：一次分区全部进等号区
- **适用**：枚举、布尔、字符串首字符大量重复

</v-clicks>

<div v-click class="mt-4 text-center text-sm">

🎯 Dijkstra 的「荷兰国旗问题」——重复元素越多越占便宜

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.76em; }
</style>

<!--
三路快排解决重复元素退化。Java 基本类型排序、字符串排序都用三路思想。
-->

---

# 最坏 O(n²) 与如何规避

pivot 总选极值 → 每次分出 `0 : n-1` → 退化为冒泡。

<div class="grid grid-cols-2 gap-8">
<div>

**退化成因**

<v-clicks>

- 有序输入 + 取首/末元素
- 每次只消去 1 个元素
- 递归 n 层，每层 O(n)
- 总工作量 `n+(n-1)+...+1 = O(n²)`

</v-clicks>

<div v-click class="mt-4 p-3 rounded bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-sm">

⚠️ 新手实现几乎必中：直接 `a[0]` 当 pivot

</div>

</div>
<div>

**规避手段**

<v-clicks>

- **随机化 pivot**：期望 O(n log n)
- **三数取中**：首中末的中位数
- **Introsort**：深度过 2log₂n 切堆排
- **三路分区**：专治重复元素

</v-clicks>

<div v-click class="mt-4 p-3 rounded bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-sm">

✅ 工程上 Introsort 保证最坏 O(n log n)

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
O(n²) 不是宿命——随机化/三数取中/Introsort 三板斧能把最坏情况彻底消除。
-->

---

# 为何实际最快

理论上归并、堆排、快排都是 O(n log n)，但快排快 1.5~2 倍。

<div class="grid grid-cols-3 gap-6">
<div v-click class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30">

**① 常数小**

内层循环只有比较 + 交换，无额外内存分配；归并要拷辅助数组，堆排父子比较多。

</div>
<div v-click class="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30">

**② 缓存友好**

分区顺序扫描连续内存，整块载入缓存行，分支预测准确；堆排跨层跳跃频繁 miss。

</div>
<div v-click class="p-4 rounded-lg bg-green-50 dark:bg-green-900/30">

**③ 原地**

无需归并的 O(n) 辅助数组，内存占用小，访问集中。

</div>
</div>

<div v-click class="mt-8 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500">

**关键认知**：大 O 只描述渐近，决定实际快慢的是**常数、内存访问模式、分支预测**——快排在三方面都占优。

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
这是理解"为什么 O(n log n) 还能分快慢"的核心：常数、缓存、分支预测。
-->

---

# 工程优化：真实排序库怎么做

工业级快排 = 快排 + 插入 + 堆排的混合，叠加多项优化。

<div class="grid grid-cols-2 gap-6">
<div>

<v-clicks>

- **小数组切插入排序**：子段 < 16~47 时换插入排序，省递归开销
- **尾递归优化**：短段递归、长段迭代，栈深 O(log n)
- **三数取中**：规避有序退化，零额外开销
- **Introsort**：深度过 2log₂n 切堆排兜底

</v-clicks>

</div>
<div>

<v-clicks>

- **Dual-pivot 快排**：两个 pivot 分三段，Java 基本类型实测快 ~10%
- **三路分区**：重复元素场景的利器
- **C++ `std::sort`**：Introsort（快+堆+插）
- **JS `sort`/Java 对象**：Timsort（要稳定）

</v-clicks>

</div>
</div>

<div v-click class="mt-6 p-4 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">

🎯 **哲学**：用「检测退化 + 切换算法」替代「赌 pivot 选得好」——这是工业排序库的通用思路。

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
工程快排不是教科书快排。小数组切插入、尾递归、Introsort 兜底——每一项都是实战优化。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 快排 vs 归并

::left::

<div class="text-center text-2xl font-bold mb-4 text-blue-600">快排</div>

| 维度 | 值 |
| --- | --- |
| 平均 | **O(n log n)** |
| 最坏 | O(n²) |
| 空间 | **O(log n)** |
| 稳定 | ❌ |
| 缓存 | ✅ 友好 |

::right::

<div class="text-center text-2xl font-bold mb-4 text-purple-600">归并</div>

| 维度 | 值 |
| --- | --- |
| 平均 | O(n log n) |
| 最坏 | **O(n log n)** |
| 空间 | O(n) |
| 稳定 | ✅ |
| 缓存 | ✅ 友好 |

::bottom::

<div v-click class="mt-6 text-center text-lg">

🎯 通用求快 → 快排；要稳定 → 归并/Timsort

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
快排和归并是对照项：快排赢在常数和原地，归并赢在稳定和最坏保证。JS sort 因规范要求稳定而用 Timsort。
-->

---
layout: center
class: text-center
---

# 快排：实际最快的比较排序

<div class="text-2xl mt-8 mb-12">

分治 + 分区 → 平均 O(n log n) → 工程优化消除最坏

</div>

<v-click>

<div class="text-lg">

Lomuto · Hoare · 三路分区 · 随机化 · Introsort

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/quick-sort" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/quick-sort-slide/" target="_blank" class="text-xl icon-btn">
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
掌握了快排的分治思想、分区策略与工程优化，就理解了为什么它是实际最快的比较排序。
-->
