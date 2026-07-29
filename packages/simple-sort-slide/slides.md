---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 简单排序（冒泡 / 选择 / 插入）
info: |
  ## 简单排序（冒泡 / 选择 / 插入）
  三种 O(n²) 比较型排序 · 稳定性 · 小数组兜底
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 简单排序

冒泡 · 选择 · 插入 —— 三种 O(n²) 排序的定位与取舍

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/bubble-sort" target="_blank" class="icon-btn">
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
三种 O(n²) 排序是排序入门必修，也是工程小数组兜底。今天对比讲透它们的特性差异。
-->

---
transition: fade-out
---

# 三种 O(n²) 排序的定位

都是**比较型**原地排序，平均/最坏 **O(n²)**，空间 **O(1)**——区别在每轮做什么。

<v-clicks>

- **冒泡**：相邻比较交换，大值逐轮「上浮」到末尾——最直观、**稳定**
- **选择**：每轮在剩余区选**最小**，放到前段——**交换最少**、但**不稳定**
- **插入**：把元素逐个插进已排序区——**近乎有序最快**、**稳定**、工程价值最高

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：冒泡最易、选择交换少但不稳、插入沾有序的光——**插入活得最久**。

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
三者都是 O(n²)，但特性迥异。核心差异：能不能沾有序的光、稳不稳、交换多少。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# 冒泡排序：相邻比较交换

::left::

**思路**：每轮比较相邻元素，逆序就交换，一轮后最大值浮到末尾。

```js {all|1-3|5-7|all}
for (let i = 0; i < n - 1; i++) {
  let swapped = false;
  for (let j = 0; j < n - 1 - i; j++) {
    if (a[j] > a[j + 1]) {        // 用 > 保稳定
      [a[j],a[j+1]] = [a[j+1],a[j]];
      swapped = true;
    }
  }
  if (!swapped) break;            // 无交换即有序
}
```

::right::

<div class="text-center text-2xl font-bold mb-4 text-blue-600">特性</div>

<v-clicks>

- **稳定** ✅：相邻比较，相等不动
- 交换次数**最多**（O(n²)，搬一格）
- **最好 O(n)**：加 `swapped` 提前终止
- 缓存友好（只比较相邻）
- 实际是三者中较慢的

</v-clicks>

::bottom::

<div v-click class="mt-4 text-center text-lg">

🎯 `if (!swapped) break` 是冒泡「最好 O(n)」的来源

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
冒泡靠相邻交换。关键是加 swapped 标志位提前终止，否则近有序退化 O(n²)。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# 选择排序：每轮选最小

::left::

**思路**：每轮在剩余区找最小值的下标，与位置 `i` 交换（每轮至多一次）。

```js {all|1-2|3-4|5-6|all}
for (let i = 0; i < n - 1; i++) {
  let minIdx = i;
  for (let j = i + 1; j < n; j++) {
    if (a[j] < a[minIdx]) minIdx = j;
  }
  if (minIdx !== i)
    [a[i],a[minIdx]] = [a[minIdx],a[i]];
}
```

::right::

<div class="text-center text-2xl font-bold mb-4 text-purple-600">特性</div>

<v-clicks>

- **交换次数最少** ✅：每轮至多一次，共 **O(n)**
- **不稳定** ❌：跨距离交换越过相等元素
- 比较次数**固定** O(n²)
- **不沾有序的光**（已有序也要比完）
- 适合「元素大、交换贵」

</v-clicks>

::bottom::

<div v-click class="mt-4 text-center text-lg">

🎯 交换最少 ≠ 最快：比较固定 O(n²)，平均仍不快

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
选择每轮只换一次，交换最少。但跨距离交换破坏稳定，且不沾有序的光。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# 插入排序：插进有序区

::left::

**思路**：前段 `[0..i-1]` 已有序，取 `a[i]` 从右往左比，大的右移让位，插入。

```js {all|1-2|3-5|6|all}
for (let i = 1; i < n; i++) {
  const cur = a[i];           // 暂存
  let j = i - 1;
  while (j >= 0 && a[j] > cur) {  // 大的右移
    a[j + 1] = a[j];
    j--;
  }
  a[j + 1] = cur;             // 插入
}
```

::right::

<div class="text-center text-2xl font-bold mb-4 text-green-600">特性</div>

<v-clicks>

- **稳定** ✅：用 `>`（非 `>=`），相等停插右侧
- **最好 O(n)**：近有序时每轮只比一次
- 搬移**连续**，缓存友好
- **小数据最快**（常数最小）
- **在线**：来一个插一个

</v-clicks>

::bottom::

<div v-click class="mt-4 text-center text-lg">

🎯 近乎有序 / n 小 → 插入排序是三者中最快的

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
插入排序沾有序的光、连续搬移缓存友好、小数据最快。注意暂存 cur 防被覆盖。
-->

---

# 三者对比：复杂度与稳定性

| 排序 | 最好 | 平均 | 最坏 | 空间 | 稳定 | 交换次数 |
| --- | --- | --- | --- | --- | --- | --- |
| 冒泡（优化） | **O(n)** | O(n²) | O(n²) | O(1) | ✅ | O(n²) |
| 选择 | O(n²) | O(n²) | O(n²) | O(1) | ❌ | **O(n)** |
| 插入 | **O(n)** | O(n²) | O(n²) | O(1) | ✅ | O(n²) |

<div class="grid grid-cols-3 gap-4 mt-6">

<div v-click class="p-3 rounded bg-blue-50 dark:bg-blue-900/20 text-sm text-center">

**冒泡**：最易、稳定<br/>交换多、较慢

</div>

<div v-click class="p-3 rounded bg-purple-50 dark:bg-purple-900/20 text-sm text-center">

**选择**：交换最少<br/>不稳、不沾光

</div>

<div v-click class="p-3 rounded bg-green-50 dark:bg-green-900/20 text-sm text-center">

**插入**：沾光、稳定<br/>**工程价值最高**

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
table { font-size: 0.85em; }
</style>

<!--
对比表必记。三者空间都 O(1)，差异在最好情况和稳定性。插入沾光、稳，所以工程首选。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 稳定性：排序的第二维度

::left::

**正式定义**：值相等的元素排序后**仍保持原相对顺序**，则稳定。

**判定口诀**：

<v-clicks>

- 相邻比较/交换 + **相等不动** → 稳定
- **跨距离交换** → 可能不稳

</v-clicks>

| 算法 | 稳定 |
| --- | --- |
| 冒泡 / 插入 | ✅ |
| 选择 / 快排 / 堆排 | ❌ |

::right::

**选择为何不稳**（反例 `[5a,5b,2]`）

<v-clicks>

- 第 1 轮选最小 `2`（下标 2）
- 与位置 0 的 `5a` **跨距离交换**
- 得 `[2, 5b, 5a]` —— 两个 5 调位 ❌

</v-clicks>

<div v-click class="mt-3 p-3 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ 不稳源于**交换**（跨距离越过相等元素），与「选哪个最小」无关。

</div>

::bottom::

<div v-click class="mt-4 text-center">

🎯 多 key 排序（先按 A 再按 B）→ 第二次必须用**稳定**排序

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
稳定性判定口诀：相邻交换+相等不动=稳，跨距离交换=可能不稳。多 key 排序才真正需要稳定。
-->

---

# 插入排序的工程价值

它活在所有现代排序的**小数组分支**里。

<div class="grid grid-cols-2 gap-8">
<div>

**为什么小数组插入更快**

<v-clicks>

- O(n log n) 有递归/分治常数开销
- n 小时这些开销超过 O(n²) 扫描
- 插入常数极小（一个 while + 连续右移）
- n ≤ 几十时插入**反而赢**

</v-clicks>

</div>
<div>

**工业级排序的小数组兜底**

<v-clicks>

- Java `Arrays.sort`：n < 47 切插入
- Python `Timsort`：run 不足 minrun 用插入补齐
- V8 `Array.sort`：小段用成对插入排序
- **Timsort 的 run**：零碎短段→插入排序→归并

</v-clicks>

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-sm">

**Timsort** = 利用「真实数据常含有序段」+ 插入排序补齐小段 + 归并——插入排序是「找有序」的零件。

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
插入排序没过时。Java/Python/V8 排序在小数据段都退化为插入排序。
-->

---

# 冒泡的两种优化

<div class="grid grid-cols-2 gap-8">
<div>

**① 标志位提前终止**

```js
let swapped = false;
for (let j = 0; j < n-1-i; j++)
  if (a[j] > a[j+1]) {
    [a[j],a[j+1]] = [a[j+1],a[j]];
    swapped = true;
  }
if (!swapped) break;   // 本轮无交换→有序
```

近有序 → **最好 O(n)**

</div>
<div>

**② 记录最后交换位置**

```js
let end = n - 1;
while (end > 0) {
  let lastSwap = 0;
  for (let j = 0; j < end; j++)
    if (a[j] > a[j+1]) {
      [a[j],a[j+1]] = [a[j+1],a[j]];
      lastSwap = j;
    }
  end = lastSwap;   // 其后已有序
}
```

减少无效比较（① 的推广）

</div>
</div>

<div v-click class="mt-4 text-center text-sm">

**选型口诀**：n 小或近有序 → 插入；元素大交换贵 → 选择；大数据 → 上 O(n log n)

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
冒泡两种优化让它沾有序的光。①是②的特例（lastSwap=0 即整体有序）。
-->

---
layout: center
class: text-center
---

# 三种 O(n²) 排序，各有所长

<div class="text-2xl mt-8 mb-12">

冒泡最易 · 选择交换最少 · 插入工程价值最高

</div>

<v-click>

<div class="text-lg">

沾有序的光 + 稳定 + 小数组最快 → **插入排序活了下来**

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/insertion-sort" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/simple-sort-slide/" target="_blank" class="text-xl icon-btn">
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
三者各有所长。记住定位：冒泡教学、选择交换少、插入工程兜底。后续升级到 O(n log n)。
-->
