---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 希尔排序
info: |
  ## 希尔排序（Shell Sort）
  分组插入 · 缩小增量 · 突破 O(n²)
  插入排序的工程增强版。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 希尔排序

分组插入 · 缩小增量 · 突破 O(n²)

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/shell-sort" target="_blank" class="icon-btn">
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
希尔排序是插入排序的推广，通过分组插入让元素跨距离交换，成为最早突破 O(n²) 的排序之一。
-->

---
transition: fade-out
---

# 希尔排序 = 分组插入排序

把数组按**间隔 gap** 分组，每组各自做**插入排序**。

<v-clicks>

- **插入排序痛点**：只能**相邻交换**，末尾最小元素挪到首位要 n-1 步
- **希尔解法**：相距 gap 的元素直接比较交换，**一次跨多步**
- **gap=g 分组**：下标 `i` 与 `i+g`、`i+2g` 同组，共 g 组
- **多轮收尾**：gap 从大到小，最后一轮 gap=1 即普通插入排序

</v-clicks>

<div v-click class="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：先粗调（大 gap 大跨步），再微调（gap=1 收尾），整体降到约 O(n^1.3)。

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
核心：分组让元素跨距离交换，突破插入排序只能相邻挪动的瓶颈。
-->

---

# gap 从大到小：先粗调后微调

`[8,1,5,7,4,3,6,2]`，gap 序列 4 → 2 → 1

```
gap=4（跨4步）：[4,1,5,2,8,3,6,7]   8、7 大步右移
gap=2（跨2步）：[4,1,5,2,6,3,8,7]   继续收紧
gap=1（插入）： [1,2,3,4,5,6,7,8]   近乎有序，一遍扫完
```

<v-clicks>

- **大 gap**：少量大跨步消除「远距离逆序」
- **中 gap**：在前一步基础上继续收紧
- **gap=1**：数组已近乎有序，插入排序接近 O(n)

</v-clicks>

<div v-click class="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

⚠️ gap **必须缩到 1**——只有 gap=1 能消除所有相邻逆序，保证完全有序。

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
gap=4 一轮，元素 8 从下标 0 跳到 4，一步顶插入排序挪 4 次。这就是跨距离交换的威力。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# 为何比插入快：跨距离交换

::left::

**插入排序（只能相邻挪）**

```
[5,4,3,2,1] 逆序
处理末尾的 1：
1 与 2、3、4、5 各比一次
左移 4 次（一步一格）
→ 单个元素 O(n)
```

<div class="text-sm text-gray-500 mt-2">总移动 1+2+…+n = O(n²)</div>

::right::

**希尔排序（跨 gap 交换）**

```
gap=n/2：1 一次跨 n/2 步
gap=n/4：再跨 n/4 步
……
每轮跨越距离指数衰减
单元素总挪动 ≈ O(n)
```

<div class="text-sm text-gray-500 mt-2">n 个元素分摊 → O(n^1.3)</div>

::bottom::

<div v-click class="mt-4 text-center">

🎯 **本质**：一步挪 gap 格，远距离元素快速接近终位，而非一格一格挪

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
对比一目了然：插入一步一格，希尔一步跨 gap。这是希尔突破 O(n²) 的根本原因。
-->

---

# gap 序列：决定性能的「调参」

**同一个分组插入框架，换 gap 序列，复杂度天差地别。**

| 序列 | 取值 | 最坏 |
| --- | --- | --- |
| Shell 原版 | n/2, n/4, …, 1 | O(n²) |
| Knuth | 1, 4, 13, 40, …（3h+1） | O(n^1.5) |
| Sedgewick | 1, 5, 19, 41, 109, … | O(n^1.3) |

<v-clicks>

- **Shell 原版**：最简单，但 gap 间有公因子 2，存在退化输入
- **Knuth**：`3h+1` 让相邻 gap 互质，最坏 O(n^1.5)，工程默认
- **Sedgewick**：两式交错合并，实际最快，最坏 O(n^(4/3))

</v-clicks>

<div v-click class="mt-2 p-3 rounded bg-blue-50 dark:bg-blue-900/30 text-sm">

💡 **无「最优」序列**——希尔精确复杂度至今是数学开放问题

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
关键认知：gap 序列是希尔的「调参」——不是算法骨架，而是数列选择决定性能。
-->

---

# 复杂度：依赖 gap 序列

| 维度 | 数值 |
| --- | --- |
| 平均（经验） | ~**O(n^1.3)** |
| 最好（已有序） | O(nlog²n) ~ O(nlogn) |
| 最坏（Shell 原版） | O(n²) |
| 最坏（Knuth/Sedgewick） | O(n^1.5) / O(n^1.3) |
| 空间 | **O(1)**（原地、无递归） |

<v-clicks>

- **最好情况**：已有序时每轮插入都立即 break，总比较 n×轮数 ≈ O(nlogn)
- **平均 O(n^1.3)**：经验值 + 特定序列上界，**非严格数学证明**
- **空间 O(1)**：迭代实现，无递归栈，无辅助数组

</v-clicks>

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
记住：希尔复杂度不是一个数，是「依赖序列」的一族。别把 O(n^1.3) 写成严格证明。
-->

---

# 不稳定：分组破坏次序

**希尔排序固有不稳定**——分组让相等元素跨段交换。

```
相等元素若下标差不是 gap 的倍数
→ 被分到不同子序列，各自独立排序
→ 相对次序无法保证（可能被打乱）
```

<v-clicks>

- **与归并不同**：归并不稳定是「比较符号写错」（可修复），希尔不稳定是**分组机制本身**
- **无法靠代码修复**：换写法也救不回来，是算法固有性质
- **需要稳定时**：数据库多关键字排序 → 用归并或 Timsort，**别用希尔**

</v-clicks>

<div v-click class="mt-4 p-3 rounded bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-sm">

⚠️ 多关键字排序（先按 A 再按 B）依赖稳定性——希尔会让第二次排序打乱第一次结果

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
这是希尔的硬伤。需要稳定排序的场景一定不能用希尔。
-->

---

# 与插入、快排对比

| 维度 | 希尔 | 插入 | 快排 |
| --- | --- | --- | --- |
| 平均 | ~O(n^1.3) | O(n²) | **O(nlogn)** |
| 空间 | **O(1)** | **O(1)** | O(logn) |
| 稳定 | 否 | **是** | 否 |
| 关系 | 插入的推广 | 希尔 gap={1} | 独立 |
| 中等规模 | **实用** | 慢 | 快但需递归 |

<div v-click class="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">

**为何中等规模实用**：n 几百~几千时，希尔**常数小、无递归、原地、极简**，实测常快于堆排、接近快排——库排序对小数组的兜底常选它。

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
希尔 = 插入的工程增强版。大规模输给快排，但中等规模因常数小而实用。
-->

---

# 代码实现（Shell 原版）

<div class="grid grid-cols-2 gap-8">
<div>

```js
function shellSort(a) {
  const n = a.length;
  for (let gap = n >> 1; gap >= 1;
       gap >>= 1) {           // gap: n/2 → 1
    for (let i = gap; i < n; i++) {
      const tmp = a[i];
      let j = i;
      while (j >= gap &&
             a[j - gap] > tmp) { // 跨 gap 比较
        a[j] = a[j - gap];
        j -= gap;
      }
      a[j] = tmp;
    }
  }
}
```

</div>
<div>

**逐层解读**

<v-clicks>

- 外层 `gap >>= 1`：序列缩到 1
- 内层从 `i = gap` 起（前 gap 个是各组首元素）
- `while` 把插入排序的 `1` 换成 `gap`
- 换 Knuth 序列只改外层 gap 取值

</v-clicks>

<div v-click class="mt-3 p-2 rounded bg-blue-50 dark:bg-blue-900/20 text-sm">

💡 内层就是「步长为 gap 的插入排序」

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
代码极简：插入排序加一层 gap 循环。换序列只动外层。
-->

---
layout: center
class: text-center
---

# 希尔排序：插入的工程增强版

<div class="text-2xl mt-8 mb-12">

分组插入 → 跨距离交换 → 突破 O(n²)

</div>

<v-click>

<div class="text-lg">

平均 O(n^1.3) · 原地 O(1) · 不稳定 · 中等规模实用

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/shell-sort" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/shell-sort-slide/" target="_blank" class="text-xl icon-btn">
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
总结：希尔用分组插入突破了 O(n²)，在中等规模上以极简代码跑出接近快排的速度。
-->
