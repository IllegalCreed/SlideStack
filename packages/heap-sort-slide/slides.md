---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 堆排序
info: |
  ## 堆排序（Heap Sort）
  建堆 O(n) + n 次取堆顶 O(n log n) = O(n log n)
  原地 · 最坏保证 · 不稳定。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 堆排序

建堆 + 反复取堆顶 · 原地 O(n log n) 最坏保证

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/heap-sort" target="_blank" class="icon-btn">
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
堆排序是原地比较型排序，有 O(n log n) 最坏保证。今天讲透它的建堆、排序、特性与 Top-K 应用。
-->

---
transition: fade-out
---

# 堆排序是什么

**原地比较型排序**：把数组建成完全二叉树（堆），反复「取堆顶极值 + 下沉」。

<v-clicks>

- **核心套路**：建堆 → 堆顶换末尾 → 堆缩小 → 下沉恢复，重复 n 次
- **升序用大根堆**（顶最大沉到底）、**降序用小根堆**（顶最小沉到底）
- **复杂度**：建堆 O(n) + n 次下沉 O(n log n) = **O(n log n)**
- **最坏一致**：最好/平均/最坏都是 O(n log n)（无快排 O(n²) 退化）
- **原地 O(1)**：堆区与有序区共用数组，无需辅助空间

</v-clicks>

<div v-click class="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：用堆「O(1) 取极值」的能力，做 n 次取顶即得排序。

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
堆排序=建堆+反复取堆顶。最关键的易错点：升序用大根堆，方向与堆性质相反。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 升序用大根堆：顶沉到底

::left::

**为什么不用小根堆？**

<v-clicks>

- 小根堆顶是**最小值**
- 换到末尾 → 末尾最小
- 这是**降序**，方向错了 ❌

</v-clicks>

**大根堆才对**：

<v-clicks>

- 大根堆顶是**最大值**
- 换到末尾 → 末尾最大
- 升序数组末尾本应最大 ✅

</v-clicks>

::right::

**执行流程**

```
建大根堆: [10,5,3,4,1] 顶=10
i=4: swap(顶,4位) → 10到底
     下沉 → [5,4,3,1 | 10]
i=3: swap(顶,3位) → 5到底
     下沉 → [4,1,3 | 5,10]
i=2: swap → [3,1 | 4,5,10]
i=1: swap → [1 | 3,4,5,10]
```

::bottom::

<div v-click class="mt-4 text-center text-lg">

🎯 口诀：**排升序用大根堆，排降序用小根堆**

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
升序用大根堆是最高频考点。堆顶最大换到末尾，正好满足升序末尾最大的要求。
-->

---

# 建堆 O(n)：Floyd 自底向下

从**最后非叶子节点** `⌊n/2⌋-1` 倒着往前，每个节点下沉。

<div class="grid grid-cols-2 gap-8">
<div>

```js {all|1-2|3-9|all}
function heapify(a) {
  const n = a.length;
  for (let i = (n >> 1) - 1;
       i >= 0; i--) {
    siftDown(a, i, n);
  }
}
// siftDown: 与较大子比较
// 交换后继续下沉，O(log n)
```

</div>
<div>

**为什么是 O(n) 不是 O(n log n)？**

<v-clicks>

- 高度 h 的节点 ≤ `⌈n/2^(h+1)⌉`
- 每个下沉 ≤ h 步
- 总和 `≤ Σ h·n/2^(h+1)`
- `= (n/2)·Σ h/2^h`
- `= (n/2)·2 = O(n)` ✅

</v-clicks>

</div>
</div>

<div v-click class="mt-3 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

⚠️ 叶子节点（下标 ≥ `⌊n/2⌋`）无需调整，从 `⌊n/2⌋-1` 开始即可。

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
建堆O(n)是面试高频证明题。核心：靠近叶子节点多但下沉浅，加权求和后是线性。
-->

---

# 排序：n 次交换 + 下沉

建堆后堆顶是最大值，反复「换末尾 + 下沉」即得升序。

```js {all|1-3|4-7|all}
function heapSort(a) {
  const n = a.length;
  for (let i = (n >> 1) - 1; i >= 0; i--) siftDown(a, i, n); // 建堆 O(n)
  for (let i = n - 1; i > 0; i--) {                           // 排序
    [a[0], a[i]] = [a[i], a[0]];                              // 顶换末尾
    siftDown(a, 0, i);                                        // 下沉 [0,i)
  }
  return a;
}
```

<v-clicks>

- 每轮 `swap(a[0], a[i])`：最大值换到 `a[i]`（有序区）
- `siftDown(a, 0, i)`：对缩小后的堆 `[0, i)` 恢复堆序
- 单次下沉 ≤ O(log n)，共 n 次 → **O(n log n)**

</v-clicks>

<div v-click class="mt-3 p-3 rounded bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-sm">

✅ `i` 从 `n-1` 到 `1`（不是到 `0`）；下沉长度传 `i` 不是 `n`。

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
排序段是n次交换+下沉，每次O(log n)，主导了总复杂度。注意下沉的堆长度是i不是n。
-->

---

# 原地 O(1)：堆区与有序区共用数组

<div class="grid grid-cols-2 gap-8">
<div>

**空间划分随排序推进**

```
建堆:  [堆区: 全数组              ]
i=n-1: [堆区 0..n-2 | 有序: n-1  ]
i=n-2: [堆区 0..n-3 | 有序: n-2.. ]
...
完成:  [有序区: 全数组（升序）    ]
```

<v-clicks>

- `swap(a[0], a[i])` 一句话两件事
- 取出堆顶最大 + 放到有序区末尾
- 无需辅助数组搬运

</v-clicks>

</div>
<div>

**对比各排序空间**

| 排序 | 额外空间 |
| --- | --- |
| 堆排 | **O(1)** ✅ |
| 快排 | O(log n)（栈） |
| 归并 | O(n) ❌ |

<div v-click class="mt-4 p-3 rounded bg-blue-50 dark:bg-blue-900/20 text-sm">

**堆排空间最优**：原地 + 无递归栈深，比快排更省。

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
pre { font-size: 0.75em; }
table { font-size: 0.85em; }
</style>

<!--
堆排原地O(1)的根源：堆区和有序区共用同一数组，swap一句话完成取顶+入有序区。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# O(n log n) 最坏保证 vs 快排

::left::

**快排的痛点：最坏 O(n²)**

<v-clicks>

- 输入有序/逆序时退化
- 构造输入可触发攻击
- 实时系统不可接受

</v-clicks>

**堆排：无坏输入**

<v-clicks>

- 建堆恒 O(n)
- n 次下沉恒 O(n log n)
- 最好/平均/最坏一致 ✅

</v-clicks>

::right::

**适用场景**

<v-clicks>

- 延迟敏感系统（实时）
- 防 DoS 攻击
- 内省排序的「兜底」
  （快排递归过深切堆排）

</v-clicks>

<div v-click class="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ C++ `std::sort` 用内省排序：快排为主 + 过深切堆排 + 小段切插排。

</div>

::bottom::

<div v-click class="mt-4 text-center text-lg">

🎯 堆排价值在**最坏边界可控**，而非平均速度。

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
堆排对快排的核心优势：O(n log n)最坏保证。内省排序正是利用这一点在快排过深时切堆排。
-->

---

# 为何实际比快排慢：缓存与常数

理论 O(n log n) 最优，为何通用库不用堆排？

<div class="grid grid-cols-2 gap-8">
<div>

**① 缓存不友好**

<v-clicks>

- 快排分区：**顺序扫描**连续内存
- 堆排下沉：`i → 2i+1` **大跨度跳跃**
- 跳跃踩新缓存行，命中率低

</v-clicks>

**② 常数大**

<v-clicks>

- 每次下沉：左子+右子+交换判断
- 分支多，预测差，指令数多

</v-clicks>

</div>
<div>

**实测对比**

| 排序 | 相对速度 |
| --- | --- |
| 快排 | **1.0x**（基准） |
| 归并 | ~1.2x |
| 堆排 | ~2~3x ❌ |

<div v-click class="mt-4 p-3 rounded bg-red-50 dark:bg-red-900/20 text-sm">

**结论**：堆排理论好看、实际少用。现代 CPU 缓存层级深，跳跃访问代价远超顺序。

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
table { font-size: 0.85em; }
</style>

<!--
堆排实际慢于快排的根因：缓存。2i+1的跳跃访问破坏了局部性，现代CPU缓存对此极敏感。
-->

---

# 不稳定：原因与影响

堆排序是**不稳定排序**——相等元素相对顺序可能被打乱。

<v-clicks>

- **根因**：堆顶与末尾**远距离交换** + 下沉再次跨越
- 例：`[5a, 5b, 3]` 建堆取顶换末尾，5a、5b 先后无法保证
- **不影响数值正确性**，但影响**多关键字排序**
- 例：先按成绩排再按姓名排，成绩相同时需稳定

</v-clicks>

<div class="grid grid-cols-3 gap-4 mt-6">
<div class="text-center p-3 rounded bg-red-50 dark:bg-red-900/20">

**堆排**

不稳定 ❌

</div>
<div class="text-center p-3 rounded bg-red-50 dark:bg-red-900/20">

**快排**

不稳定 ❌

</div>
<div class="text-center p-3 rounded bg-green-50 dark:bg-green-900/20">

**归并**

稳定 ✅

</div>
</div>

<div v-click class="mt-4 text-center text-sm">

💡 要**稳定 + O(n log n) 最坏保证** → 只能选**归并**（代价 O(n) 空间）

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
堆排不稳定源于远距离交换。要稳定排序别用堆排，用归并。三大O(n log n)排序只有归并稳定。
-->

---

# Top-K：堆排的真正强项

只取前 k 个最大/最小，不必全排——堆远优于全排序。

<div class="grid grid-cols-2 gap-8">
<div>

**方法对比**

| 方法 | 复杂度 |
| --- | --- |
| 全排取前 k | O(n log n) |
| 建堆+取顶 | O(n+k log n) |
| **大小 k 堆** | **O(n log k)** |

</div>
<div>

**流式 Top-K 大**

<v-clicks>

- 维护大小 k 的**小根堆**
- 堆顶 = 当前第 k 大
- 新元素 > 堆顶 → 替换+下沉
- 空间仅 O(k)

</v-clicks>

<div v-click class="mt-3 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ 求 Top-K **大**用**小**根堆（堆顶是淘汰线）

</div>

</div>
</div>

<div v-click class="mt-3 p-3 rounded bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-sm">

✅ **场景**：海量数据 Top-K、流式数据、求第 k 大、内存受限——堆是唯一可行解。

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
Top-K是堆排思想最高频应用。维护大小k的堆，O(n log k)，远优于全排。求大用小根堆是易错点。
-->

---
layout: center
class: text-center
---

# 堆排序：最坏保证的实用主义

<div class="text-2xl mt-8 mb-8">

建堆 O(n) + n 次下沉 O(n log n)

</div>

<v-clicks>

<div class="text-lg mb-3">

✅ O(n log n) 最坏保证 · 原地 O(1) · Top-K 强项

</div>

<div class="text-lg mb-3">

⚠️ 缓存不友好 · 不稳定 · 实际比快排慢

</div>

<div class="text-lg">

选型：**最坏可控 → 堆排 · 平均最快 → 快排 · 稳定 → 归并**

</div>

</v-clicks>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/heap-sort" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/heap-sort-slide/" target="_blank" class="text-xl icon-btn">
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
堆排的定位：最坏边界可控的实用主义。通用排序用快排，但要最坏保证或Top-K时用堆排。
-->
