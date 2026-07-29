---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 二分查找变体
info: |
  ## 二分查找变体
  旋转数组 · 二分答案 · 三分法
  单调性 ⇒ 可二分。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 二分查找变体

旋转数组 · 二分答案 · 三分法 · 单调性即可二分

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/rotated-search" target="_blank" class="icon-btn">
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
二分的强大在于「单调性即可二分」。今天讲透旋转数组、二分答案、三分三大变体。
-->

---
transition: fade-out
---

# 二分的广义化

不止「查有序数组」——**有单调性就能二分**。

<v-clicks>

- **单调性 ⇒ 可二分**：判定 `check(x)` 随 `x` 单调变化即可折半 `x`
- **朴素二分**：`x` 是下标，`check` = `nums[x] >= target`
- **旋转数组**：部分有序（两段各自有序），仍能判断哪半可排除
- **二分答案**：`x` 是候选答案，`check(x)` 验证可行性
- **三分法**：`x` 是自变量，函数单峰时比较两点定极值方向

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：把二分理解为「单调判定的折半搜索」，就能在更多地方发现它能用。

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
这是本叶所有变体的统一视角：广义单调性。理解了这点，三变体只是同一个思想的不同应用。
-->

---

# 旋转数组：两段各自有序

升序数组在某点旋转，拆成**两段升序**子段。

```
原序： [0, 1, 2, 4, 5, 6, 7]
旋转： [4, 5, 6, 7, 0, 1, 2]
         左段      右段
```

<v-clicks>

- 左段 `[4,5,6,7]` 升序，右段 `[0,1,2]` 升序
- 左段任一元素 > 右段任一元素（无重复）
- **断点 = 最小值位置**

</v-clicks>

<div v-click class="mt-6 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

⚠️ 关键性质：对任意 `mid`，`[lo,mid]` 与 `[mid,hi]` **至少有一半严格有序**。

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
旋转数组虽整体无序，但拆成两段各自有序——这就是部分有序，仍能折半。
-->

---

# 旋转数组搜索：判断哪半有序

取 `mid`，**先判哪半有序**，再判目标在不在那半。

```js
let lo = 0, hi = nums.length - 1;
while (lo <= hi) {
  const mid = (lo + hi) >> 1;
  if (nums[mid] === target) return mid;
  if (nums[lo] <= nums[mid]) {            // 左半有序
    if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
    else lo = mid + 1;
  } else {                                // 右半有序
    if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
    else hi = mid - 1;
  }
}
```

<div v-click class="mt-4 text-center text-sm">

🎯 `nums[lo] <= nums[mid]` 判左半有序（含等号处理 `lo==mid`） · O(log n)

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
搜索目标值的核心：每轮至少一半有序，判断 target 在不在那半，不在就去另一半。两层判定。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 找旋转点（最小值）与重复退化

::left::

**找最小值（无重复）**

```js
let lo = 0, hi = n - 1;
while (lo < hi) {
  const mid = (lo + hi) >> 1;
  nums[mid] > nums[hi]
    ? (lo = mid + 1)
    : (hi = mid);
}
return nums[lo]; // 最小值
```

- 与 `nums[hi]` 比（不是 `lo`）
- `hi = mid`（含 mid，不能 -1）
- O(log n)

::right::

**含重复退化 O(n)**

```js
while (lo < hi) {
  const mid = (lo + hi) >> 1;
  if (nums[mid] > nums[hi]) lo = mid + 1;
  else if (nums[mid] < nums[hi]) hi = mid;
  else hi--; // == 无法判断
}
```

- `[1,1,1,2,1]` 无法分辨
- 只能逐个去端点
- 最坏 O(n)

::bottom::

<div v-click class="mt-4 text-center">

⚡ 无重复 O(log n) · 有重复 `==` 时 `hi--` 退化 O(n)

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
找最小值用 nums[hi] 做参照；含重复时 == 无法分辨哪段有序，只能线性去端点。
-->

---

# 二分答案：对值域二分 + check

不对下标二分，对**答案值域** `[L, R]` 二分，`check(mid)` 验证。

<div class="grid grid-cols-2 gap-6">
<div>

```js
// 求最大可行答案（上取整）
while (lo < hi) {
  const mid = (lo + hi + 1) >> 1;
  check(mid) ? (lo = mid)
             : (hi = mid - 1);
}
```

</div>
<div>

**适用三要素**

<v-clicks>

- 答案有上下界
- `check(x)` 多项式可解
- **可行性关于答案单调**

</v-clicks>

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

**取整口诀**：`lo = mid` 配上取整（`+1`），`hi = mid` 配下取整——配错会死循环。

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
二分答案是「最优化」问题的通用武器。关键是设计 check 并验证可行性单调。
-->

---

# 二分答案经典题：分裂数组最大值最小化

把数组分成 m 段，使**各段和的最大值最小**。

<div class="grid grid-cols-2 gap-6">
<div>

```js
let lo = Math.max(...nums);
let hi = nums.reduce((a,b)=>a+b);
while (lo < hi) {
  const mid = (lo + hi) >> 1;
  let cnt = 1, sum = 0;
  for (const x of nums) {
    if (sum + x > mid) { cnt++; sum = 0; }
    sum += x;
  }
  cnt <= m ? (hi = mid) : (lo = mid + 1);
}
```

</div>
<div>

**思路**

<v-clicks>

- 答案 ∈ `[max, sum]`
- `check(limit)`：贪心分段
- 段数 ≤ m ⇒ limit 够大
- **答案越大越易满足**（单调）

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-blue-50 dark:bg-blue-900/20 text-sm">

同理：木头切割、吃香蕉速度、运送货物

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
「最大化最小值/最小化最大值」是二分答案的标志题型。check 多是贪心模拟。
-->

---

# 三分法：单峰函数求极值

函数 `f(x)` **单峰（先增后减）**时，取 `m1 < m2` 比较缩区间。

<div class="grid grid-cols-2 gap-6">
<div>

```js
function ternaryMax(f, lo, hi) {
  const eps = 1e-8;
  while (hi - lo > eps) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    f(m1) < f(m2) ? (lo = m1)
                  : (hi = m2);
  }
  return (lo + hi) / 2;
}
```

</div>
<div>

**判定（单峰）**

<v-clicks>

- `f(m1) < f(m2)` ⇒ 极值在右
- `f(m1) > f(m2)` ⇒ 极值在左
- 每次缩到 2/3
- O(log n)（底数 1.5）

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm">

⚠️ 只适用严格单峰/单谷，多峰会陷局部极值

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
pre { font-size: 0.76em; }
</style>

<!--
三分靠凸性。单峰时比较两内分点函数值即可排除一侧。多峰不适用。
-->

---
layout: center
class: text-center
---

# 单调性 ⇒ 可二分

<div class="text-2xl mt-8 mb-12">

旋转数组 · 二分答案 · 三分 都是同一思想的变体

</div>

<v-click>

<div class="text-lg">

部分有序 → 判哪半有序 · 可行性单调 → 二分值域 · 函数单峰 → 三分缩区间

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/rotated-search" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/binary-search-variants-slide/" target="_blank" class="text-xl icon-btn">
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
三变体的共性是广义单调性。掌握了判定设计，二分就从模板题升级为通用武器。
-->
