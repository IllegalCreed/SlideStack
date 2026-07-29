---
theme: seriph
background: https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=2048
title: 分治算法
info: |
  ## 分治算法（Divide and Conquer）
  分 · 治 · 合 · 主定理
  把大问题拆成同构子问题的通用方法论。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 分治算法

分而治之 · 递归求解 · 主定理分析

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
分治是算法设计的核心方法论。今天讲透分治三步、主定理和经典应用。
-->

---
transition: fade-out
---

# 分治是什么

把原问题**拆成同构子问题**，**递归求解**后再**合并**——三步走。

<v-clicks>

- **核心三步**：分（Divide）/ 治（Conquer）/ 合（Combine）
- **适用条件**：子问题**独立同构**、合并不贵、有自然边界
- **复杂度公式**：`T(n) = a·T(n/b) + f(n)` —— 主定理给闭式解
- **天然并行**：子问题独立，可多核/分布式并行求解
- **突破下界**：Strassen、Karatsuba 靠分治优化乘法

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：能切成同构、独立的子问题，且合并不贵 → 分治。

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
分治的一切都源于「子问题独立同构 + 合并不贵」。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 分治三步：分、治、合

::left::

**以归并排序为例**

```
[38,27,43,3,9,82,10]
       │ 分：对半切
   ┌───┴───┐
 [38,27,43,3] [9,82,10]
       │ 治：递归排序
 [3,27,38,43] [9,10,82]
       │ 合：双指针归并
 [3,9,10,27,38,43,82]
```

::right::

**三步详解**

<v-clicks>

- **分**：切成 a 个 n/b 规模子问题
- **治**：递归求解（小则直接算）
- **合**：拼装子问题的解

</v-clicks>

<div v-click class="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ **「合」决定复杂度**：归并 O(n) → O(n log n)

</div>

::bottom::

<div v-click class="mt-3 text-center text-sm">

🎯 分 → 治 → 合，递归到底再逐层合并

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
三步是分治的灵魂。「合」往往是复杂度瓶颈。
-->

---

# 适用条件：何时用分治

<v-clicks>

- **同构子问题**：能切成结构相同的更小子问题（排序✓、最短路✗）
- **子问题独立**：无依赖、不共享状态、可并行
- **合并不贵**：combine 代价小，否则整体退化
- **自然边界**：规模小到阈值（如 n=1）可直接解

</v-clicks>

<div v-click class="mt-6 grid grid-cols-2 gap-4">
<div class="p-3 rounded bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">

✅ **适用**：排序、查找、最近点对、矩阵乘法

</div>
<div class="p-3 rounded bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">

❌ **不适用**：图最短路、子问题重叠（→DP）

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
四个条件缺一不可。子问题重叠时升级为 DP。
-->

---

# 主定理：T(n)=aT(n/b)+f(n)

分治复杂度的万能公式。令 `c = log_b a`，比较 `f(n)` 与 `n^c`：

<div class="mt-2 text-center text-sm text-gray-500">

递归树共 `log_b n` 层，第 i 层 aⁱ 个节点、每个代价 f(n/bⁱ)

</div>

| 情况 | 条件 | 结论 | 主导 |
| --- | --- | --- | --- |
| 一 | `f(n) < n^c` | `Θ(n^c)` | 叶子 |
| 二 | `f(n) ≈ n^c` | `Θ(n^c · log n)` | 平衡 |
| 三 | `f(n) > n^c` 且正则 | `Θ(f(n))` | 根 |

<div v-click class="mt-4 p-3 rounded bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-sm">

**直觉**：叶子多则叶子主导；各层均匀则乘 log n；根太重则根主导。

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
主定理三种情况：看 f(n) 与 n^(log_b a) 谁大。
-->

---

# 主定理套经典算法

| 算法 | a | b | f(n) | 情况 | 复杂度 |
| --- | --- | --- | --- | --- | --- |
| 二分查找 | 1 | 2 | O(1) | 二 | **O(log n)** |
| 归并排序 | 2 | 2 | O(n) | 二 | **O(n log n)** |
| 快排(平均) | 2 | 2 | O(n) | 二 | **O(n log n)** |
| Karatsuba | 3 | 2 | O(n) | 一 | **O(n^1.585)** |
| Strassen | 7 | 2 | O(n²) | 一 | **O(n^2.807)** |

<v-clicks>

- 二分 `c=log₂1=0`，f(n)=O(1) 与 n⁰ 同阶 → 情况二
- 归并 `c=log₂2=1`，f(n)=O(n) 与 n¹ 同阶 → 情况二
- Strassen `c=log₂7≈2.807`，f(n)=O(n²) 更小 → 情况一

</v-clicks>

<div v-click class="mt-3 text-center text-sm">

🎯 算 c=log_b a，再比 f(n) 与 n^c —— 一查便知

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
记住 c=log_b a，比较 f(n) 与 n^c 即可分类。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 归并 vs 快排：分治两典范

::left::

**归并排序**（稳定）

```js
function msort(a) {
  if (a.length <= 1) return a;
  const mid = a.length >> 1;
  const L = msort(a.slice(0, mid));
  const R = msort(a.slice(mid));
  return merge(L, R);
}
```

- 最坏/平均都 **O(n log n)**
- 稳定，但 **O(n) 空间**
- 适合外排序

::right::

**快速排序**（原地）

```js
function qsort(a, lo, hi) {
  if (lo >= hi) return;
  const p = partition(a, lo, hi);
  qsort(a, lo, p - 1);
  qsort(a, p + 1, hi);
}
```

- 平均 **O(n log n)**，最坏 **O(n²)**
- 原地 O(1)，不稳定
- 随机化 pivot 规避最坏

::bottom::

<div v-click class="mt-3 text-center text-sm">

归并：合 O(n) 决定复杂度；快排：分（partition）已就位，无显式合

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
归并「合」显式 O(n)；快排「合」隐式（partition 已就位）。
-->

---

# 二分查找：减治特例

二分是分治 a=1 的退化——只保留一半，**无合并步骤**。

```js
function bsearch(a, t) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] === t) return mid;
    a[mid] < t ? (lo = mid + 1) : (hi = mid - 1);
  }
  return -1;
}
```

<v-clicks>

- `T(n) = T(n/2) + O(1)` → **O(log n)**（主定理情况二）
- 前提：**有序** + **可随机访问**（链表不行）
- 变体：lower_bound / upper_bound 找边界

</v-clicks>

<div v-click class="mt-3 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ 减治（a=1）≠ 典型分治，但递推关系同样适用主定理

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
二分是减治：每次砍一半，无合并。前提是有序+随机访问。
-->

---

# 最近点对：分治几何典范

平面 n 个点找最近两点，朴素 O(n²) → 分治 **O(n log n)**。

<v-clicks>

- **分**：按 x 排序，对半切左右
- **治**：递归求左 dL、右 dR，取 `d = min(dL, dR)`
- **合**：检查分割线两侧**宽 2d 的带状区域**

</v-clicks>

<div v-click class="mt-4 p-3 rounded bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**关键洞见**：带内按 y 排序后，每个点只需检查其后 **常数个（≤7）** 邻居——这是把 O(n²) 降到 O(n log n) 的核心。

</div>

<div v-click class="mt-3 text-center text-sm text-gray-500">

`T(n) = 2T(n/2) + O(n)` → O(n log n)（带状按 y 排序整体维护）

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
关键：带状内按 y 排序后每点只比常数个邻居。
-->

---

# Strassen 与 Karatsuba：突破下界

靠「减少子问题个数」优化乘法。

| 问题 | 朴素 | 分治 | 思路 |
| --- | --- | --- | --- |
| 大整数乘法 | O(n²) | **Karatsuba O(n^1.585)** | 4 子乘 → 3 子乘 |
| 矩阵乘法 | O(n³) | **Strassen O(n^2.807)** | 8 子乘 → 7 子乘 |

<v-clicks>

- **Karatsuba**：`z1=(x₁+x₀)(y₁+y₀)-z2-z0`，1 次乘代 2 次
- **Strassen**：7 个中间矩阵 M₁..M₇ 代 8 次，加减 O(n²) 被吸收
- 都属主定理**情况一**（叶子主导）

</v-clicks>

<div v-click class="mt-3 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ 理论更优但常数大，小规模反而更慢——实战设阈值切朴素

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
table { font-size: 0.82em; }
</style>

<!--
核心：减少子乘法个数。代价是常数大，小规模不划算。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 分治 vs DP：独立 vs 重叠

::left::

**分治（子问题独立）**

```
排序[1..n]
  /      \
排序[1..n/2] 排序[n/2..n]
   两半无交集
```

- 归并：左右两半独立
- 无需记忆化
- 子问题不重复

::right::

**DP（子问题重叠）**

```
fib(n)
  /    \
fib(n-1) fib(n-2)
  /\        /\
 ... fib(n-3) ...  ← 算两遍！
```

- 斐波那契：大量重叠
- 记忆化/递推填表
- O(2ⁿ) → O(n)

::bottom::

<div v-click class="mt-4 text-center">

🎯 判据：子问题**不重叠 → 分治**；**重叠 → DP（记忆化）**

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.75em; }
</style>

<!--
最高频辨析：子问题独立用分治，重叠用 DP。
-->

---
layout: center
class: text-center
---

# 分治：分而治之的通用方法论

<div class="text-2xl mt-8 mb-12">

同构子问题 → 递归求解 → 合并 → 主定理分析

</div>

<v-click>

<div class="text-lg">

归并 · 快排 · 二分 · 最近点对 · Karatsuba · Strassen

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/merge-sort" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 归并可视化
  </a>
  <a href="/SlideStack/divide-conquer-slide/" target="_blank" class="text-xl icon-btn">
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
分治是高级算法的根基。掌握三步、主定理、辨析，后续 DP/回溯才有比照。
-->
