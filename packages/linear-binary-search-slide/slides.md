---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 线性查找与二分查找
info: |
  ## 线性查找与二分查找
  线性 O(n) · 二分 O(log n) · 三种区间写法 · 边界与坑
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 线性查找与二分查找

线性 O(n) · 二分 O(log n) · 有序数组上的极速查找

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/binary-search" target="_blank" class="icon-btn">
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
线性是保底，二分是加速。今天讲透二分的前提、三种区间写法和边界易错点。
-->

---
transition: fade-out
---

# 线性 O(n) vs 二分 O(log n)

<v-clicks>

- **线性查找**：顺序扫描逐个比较，**O(n)** —— 无序也能用，万能保底
- **二分查找**：每次排除一半，**O(log n)** —— 需「有序 + 随机访问」
- 10 亿数据：线性 ~10 亿次比较，二分 **~30 次**

</v-clicks>

<div class="grid grid-cols-2 gap-6 mt-6">
<div>

**线性查找**

```js
function linearSearch(a, t) {
  for (let i = 0; i < a.length; i++)
    if (a[i] === t) return i;
  return -1;
}
```

</div>
<div>

**二分查找**

```js
function binarySearch(a, t) {
  let l = 0, r = a.length - 1;
  while (l <= r) {
    const m = l + ((r - l) >> 1);
    if (a[m] === t) return m;
    a[m] < t ? l = m + 1 : r = m - 1;
  }
  return -1;
}
```

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
pre { font-size: 0.7em; }
</style>

<!--
线性万能但慢；二分快但强依赖有序和随机访问。两者是查找算法的基本盘。
-->

---

# 二分的两个硬前提

<v-clicks>

- **前提一：数据有序**（升序或降序）
- **前提二：支持随机访问**（数组可以，链表不行）

</v-clicks>

<div v-click class="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**为何有序就能二分**：比较 `a[mid]` 与 `target` 后，有序性保证能**确定地排除一半**——`a[mid] < target` 时左半（含 mid）全太小，整体排除。每步区间减半 ⇒ **O(log n)**。

</div>

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click class="p-3 rounded bg-green-50 dark:bg-green-900/20 text-sm">

✅ **能二分**：有序数组、排序后的 `vector`/`ArrayList`

</div>
<div v-click class="p-3 rounded bg-red-50 dark:bg-red-900/20 text-sm">

❌ **不能二分**：无序数组、链表（取 mid 要 O(n)）

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
二分正确性全靠有序性带来的单调性。没有有序性，排除一半就站不住脚。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 三种区间写法

::left::

**① 左闭右闭 `[l, r]`**

```js
let l = 0, r = n - 1;
while (l <= r) {
  const m = l + ((r - l) >> 1);
  if (a[m] === t) return m;
  a[m] < t ? l = m + 1 : r = m - 1;
}
```

**② 左闭右开 `[l, r)`**

```js
let l = 0, r = n;
while (l < r) {
  const m = l + ((r - l) >> 1);
  if (a[m] === t) return m;
  a[m] < t ? l = m + 1 : r = m;
}
```

::right::

**③ 左开右开 `(l, r)`**

```js
let l = -1, r = n;
while (l + 1 < r) {
  const m = l + ((r - l) >> 1);
  if (a[m] === t) return m;
  a[m] < t ? l = m : r = m;
}
```

<div class="mt-3 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

🔑 心法：`while` 条件 = 区间非空判据；mid 可能是答案就保留，否则 `±1` 排除

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
三种写法本质是同一个循环不变量的不同表达。闭区间直观，半开是标准库风格。
-->

---

# 查找目标值：精确命中

```js
// 左闭右闭 [l, r]：返回下标，找不到返回 -1
function binarySearch(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const mid = l + ((r - l) >> 1);
    if (nums[mid] === target) return mid;
    nums[mid] < target ? (l = mid + 1) : (r = mid - 1);
  }
  return -1;
}
```

<v-clicks>

- **为什么 `while (l <= r)`**：闭区间里 `l === r` 仍是单元素，要查
- **为什么 `mid ± 1`**：`a[mid]` 已比较过、确认非答案，必须彻底排除
- **每次区间减半** ⇒ 至多 `⌈log₂n⌉ + 1` 次比较

</v-clicks>

<div v-click class="mt-4 p-3 rounded bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-sm">

**循环不变量**：答案若存在，必在 `[l, r]` 内——每次收缩只排除确认不含答案的部分

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
精确查找是最基础的二分。关键是理解循环不变量——答案必在区间内。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 查找左 / 右边界

::left::

**左边界**（第一个 `>= t`）

```js
let l = 0, r = n;
while (l < r) {
  const m = l + ((r - l) >> 1);
  a[m] < t ? l = m + 1 : r = m;
}
return l; // 第一个 >= t
```

- `a[m] >= t` 时 m 可能是答案 → `r = m` 保留
- 全 `< t` 时返回 `n`（插末尾）

::right::

**右边界**（最后一个 `<= t`）

```js
let l = 0, r = n - 1;
while (l < r) {
  const m = l + ((r - l + 1) >> 1);
  a[m] <= t ? l = m : r = m - 1;
}
return l; // 最后一个 <= t
```

- `a[m] <= t` 时 m 可能是答案 → `l = m` 保留
- **mid 向上取整**防 `l = m` 死循环

::bottom::

<div v-click class="mt-3 text-center text-sm">

⚡ 范围计数：target 出现次数 = `upperFirst(>t) - lowerBound(t)`

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
左边界是 lower_bound，右边界要向上取整防死循环。两者构成范围查询的基础。
-->

---

# mid 防溢出：永远写减法

<div class="grid grid-cols-2 gap-8">
<div>

**❌ 溢出写法**

```js
const mid = (l + r) / 2;
const mid = (l + r) >> 1;
```

- `l + r` 超整型上限 → 变负数
- 位运算前转 32 位，`l+r > 2^31` 仍错

</div>
<div>

**✅ 防溢出写法**

```js
// 向下取整（r = m 场景）
const mid = l + ((r - l) >> 1);
// 向上取整（l = m 场景）
const mid = l + ((r - l + 1) >> 1);
```

- `r - l` 必在 `[0, n)` 内，不溢出

</div>
</div>

<div v-click class="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">

**一句话**：永远写 `l + ((r - l) >> 1)`，不写 `(l + r) / 2`——零成本防溢出，养成肌肉记忆。

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
mid 溢出是经典面试考点（LeetCode 278）。养成写减法的习惯即可避免。
-->

---

# 死循环陷阱：l = mid 配向下取整

```js
// ❌ 求最后一个 <= t，会死循环
while (l < r) {
  const mid = l + ((r - l) >> 1);   // 向下取整
  a[mid] <= t ? (l = mid) : (r = mid - 1); // l = mid！
}
```

<v-clicks>

- 当 `l + 1 === r` 时：`mid = l + 0 = l`（向下取整）
- 若 `a[mid] <= t`：执行 `l = mid = l` —— **`l` 没动**
- `l < r` 仍成立 → 下一轮 `mid` 还是 `l` → **永远跳不出**

</v-clicks>

<div v-click class="mt-4 p-3 rounded bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-sm">

✅ **修法**：求右边界时 mid **向上取整** `l + ((r - l + 1) >> 1)`，让 `l = mid` 能前进

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
死循环是二分最隐蔽的 bug——程序不报错只是卡住。根因是 l=mid 配向下取整。
-->

---

# 循环不变量心法

<v-clicks>

- **心法**：答案若存在，**必在 `[l, r]` 内**
- 每次收缩只排除「**确认不含答案**」的部分，保留「**可能含答案**」的部分

</v-clicks>

<div class="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**三步写对二分**：

1. **定区间开闭**（`[l,r]` / `[l,r)` / `(l,r)`）—— 地基
2. **定退出条件**（闭 `l<=r`、半开 `l<r`、双开 `l+1<r`）
3. **定收缩方式**（mid 可能是答案就保留，否则 `±1`）

</div>

<v-click>

<div class="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ 验证四 case：`n=1` 命中 / `n=1` 不存在 / target 在首末 / target 比全大或全小

</div>

</v-click>

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
守不住循环不变量是写错二分的根因。三步自洽即对，背模板只是表象。
-->

---
layout: center
class: text-center
---

# 二分：有序数组上的极速查找

<div class="text-2xl mt-8 mb-12">

线性 O(n) → 二分 O(log n) → 守住循环不变量

</div>

<v-click>

<div class="text-lg">

每次排除一半 · 三种区间写法 · 三种边界 · 心法自洽

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/binary-search" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/linear-binary-search-slide/" target="_blank" class="text-xl icon-btn">
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
二分的全部考点在边界。掌握循环不变量心法，就能以不变应万变。
-->
