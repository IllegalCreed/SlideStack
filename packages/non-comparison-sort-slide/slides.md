---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 非比较排序
info: |
  ## 非比较排序（计数 / 桶 / 基数）
  绕开比较 · 突破 O(n log n) · 线性时间
  用值域 / 分布 / 位数换 O(n)。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 非比较排序

计数 · 桶 · 基数 —— 绕开比较，突破 O(n log n)

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/radix-sort" target="_blank" class="icon-btn">
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
非比较排序靠数值性质而非比较来定位元素，因此能突破比较排序的 O(n log n) 下限。
-->

---
transition: fade-out
---

# 突破比较排序的 O(n log n) 下限

任何「只靠比较」的排序最坏比较次数 ≥ `⌈log₂(n!)⌉ ≈ n log n`——决策树证明的硬下限。

<v-clicks>

- **决策树证明**：`n!` 种排列 → 决策树至少 `n!` 叶 → 树高 ≥ `log₂(n!) ≈ n log n`
- **下限只束缚「比较」**：不用比较的算法不受此限
- **非比较的突破口**：直接用数值性质（值域 / 分布 / 位数）定位元素
- **代价**：要额外信息 + 空间，且前提苛刻、不能通用

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：不比较 → 绕开决策树 → 能 O(n)，但要用「前提 + 空间」换时间。

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
这是整章的立论：下限只束缚比较排序，非比较排序绕开它就能线性。
-->

---

# 计数排序：频次 → 前缀和 → 定位

值域 `[0,k)` 时统计每个值频次，前缀和后频次变成末尾下标。

<div class="grid grid-cols-2 gap-6">
<div>

```js {all|1-3|5|7-8|all}
function countingSort(a) {
  const k = Math.max(...a) + 1;
  const c = new Array(k).fill(0);
  for (const x of a) c[x]++;          // ① 频次
  for (let i = 1; i < k; i++) c[i] += c[i-1];
  const out = new Array(a.length);
  for (let i = a.length-1; i >= 0; i--)
    out[--c[a[i]]] = a[i];   // ③ 倒序放
  return out;
}
```

</div>
<div>

**三步**：频次 → 前缀和 → 倒序放

<v-clicks>

- **时间 O(n+k)** · 空间 O(n+k)
- **稳定**（倒序放保证）
- 前提：值域 `k = O(n)`
- 支持负数：减 `min` 偏移

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ `k ≫ n` 时空间爆炸（32 位整数 `k≈4×10⁹`）

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
计数排序：倒序放是稳定的关键。值域小整数最快。
-->

---

# 桶排序：分桶 → 桶内排序 → 合并

值域均分成 `m` 个桶，元素按值入桶，桶内各自排好后依序拼接。

<div class="grid grid-cols-2 gap-6">
<div>

```js {all|1-4|5-6|all}
function bucketSort(a, m = a.length) {
  const b = Array.from({length: m}, () => []);
  for (const x of a) {
    let i = Math.floor(x * m);     // [0,1)→桶号
    if (i === m) i = m - 1;        // x==1 边界
    b[i].push(x);
  }
  for (const t of b) insertSort(t);
  return b.flat();                 // 按桶号拼接
}
```

</div>
<div>

**均匀分布时**：每桶平均 `O(1)` 元素

<v-clicks>

- **期望 O(n)** · 最坏 O(n²)（全挤一桶）
- 空间 O(n+m)
- 稳定性看桶内排序
- 适合 `[0,1)` 均匀浮点

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm">

⚠️ 分布倾斜 → 全挤一桶退化到 O(n²)

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
桶排序靠分布均匀。分布倾斜就退化。
-->

---

# 基数排序：按位 LSD + 稳定计数排序

整数按位分解，从低位到高位逐位做一趟**稳定**计数排序。

<div class="grid grid-cols-2 gap-6">
<div>

```js {all|1-4|all}
function radixSort(a) {
  const max = Math.max(...a);
  for (let exp = 1; max/exp > 0; exp *= 10)
    byDigit(a, exp);   // 每位稳定计数排序
  return a;
}
function byDigit(a, e) { /* 基数10计数排序 */ }
```

**流程**（`[329,457,657,839,436,720,355]`）：

```
按个位→按十位→按百位 = 全局有序
```

</div>
<div>

**LSD 逐趟稳定排序**

<v-clicks>

- **时间 O(d·(n+b))** · 空间 O(n+b)
- `d`=位数，`b`=基数
- **稳定**（每趟稳定）
- 适合手机号 / 定长字符串

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

🔑 每趟**必须稳定**，否则高位打乱低位次序

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
</style>

<!--
基数排序：稳定性是正确性的前提。内部必用稳定计数排序。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# 三者复杂度对比

::left::

| 算法 | 时间 | 空间 | 稳定 |
| --- | --- | --- | --- |
| 计数 | O(n+k) | O(n+k) | ✅ |
| 桶 | 期望 O(n) | O(n+m) | 看桶内 |
| 基数 | O(d·(n+b)) | O(n+b) | ✅ |

::right::

**前提决定性能**

<v-clicks>

- 计数：值域 `k=O(n)`
- 桶：分布均匀
- 基数：可拆位、`d` 小

</v-clicks>

::bottom::

<div v-click class="mt-6 text-center text-lg">

🎯 **计数靠值域 · 桶靠分布 · 基数靠位数**

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
三者各吃一类数据特性，前提满足则线性，否则退化。
-->

---

# 何时用计数 vs 桶 vs 基数

<div class="grid grid-cols-3 gap-6">
<div>

**① 计数排序**

<v-clicks>

- 整数 + 值域小
- 年龄 / 分数 / ASCII
- `k = O(n)`
- O(n+k) 稳定

</v-clicks>

</div>
<div>

**② 桶排序**

<v-clicks>

- 浮点 + 分布均匀
- `[0,1)` 随机数
- 均匀分桶
- 期望 O(n)

</v-clicks>

</div>
<div>

**③ 基数排序**

<v-clicks>

- 固定位数
- 手机号 / 字符串
- 可按位分解
- O(d·n) 稳定

</v-clicks>

</div>
</div>

<div v-click class="mt-6 p-3 rounded bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-center">

**选型三问**：值域小→计数 · 均匀→桶 · 固定位数→基数 · 都不满足→比较排序

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
按数据特性选型：值域、分布、位数。
-->

---

# 局限性与负数处理

非比较排序的命门是「**前提**」，三个常见陷阱：

<v-clicks>

- **值域 `k` 过大 → 空间爆炸**：计数排序 `O(k)` 空间，32 位整数 `k≈4×10⁹` 不可接受
- **分布倾斜 → 桶排序退化**：全挤一桶，退化到桶内最坏 O(n²)
- **位数大 / 不可拆位 → 基数失效**：大整数 `d` 大、浮点位模式非单调、任意对象不可拆位

</v-clicks>

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click class="p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">

**负数处理**：计数排序减 `min` 偏移到 `[0,k)` 最干净

</div>
<div v-click class="p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">

**工程现实**：库默认仍是比较排序，非比较只作特定加速

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
前提不满足就退回比较排序。负数用计数偏移法最简单。
-->

---
layout: center
class: text-center
---

# 用前提换线性时间

<div class="text-2xl mt-8 mb-12">

不比较 → 绕开决策树 → 突破 O(n log n)

</div>

<v-click>

<div class="text-lg">

计数靠值域 · 桶靠分布 · 基数靠位数 —— 前提满足则 O(n)

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/radix-sort" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/non-comparison-sort-slide/" target="_blank" class="text-xl icon-btn">
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
总结：非比较排序是特定场景的线性加速器，不是通用替代品。
-->
