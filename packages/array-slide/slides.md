---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 数组
info: |
  ## 数组（Array）
  连续内存 · 随机访问 · 动态扩容
  数据结构的「地基」。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 数组

连续内存 · O(1) 随机访问 · 数据结构的地基

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/array" target="_blank" class="icon-btn">
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
数组是最基础的线性数据结构，今天我们讲透它的物理本质、复杂度权衡和三大算法套路。
-->

---
transition: fade-out
---

# 数组是什么

一段**连续内存**里顺序存放**同类型元素**的线性结构，靠**下标**随机访问。

<v-clicks>

- **地址公式**：`元素地址 = 基址 + 下标 × 元素大小` —— O(1) 访问的物理根源
- **核心权衡**：O(1) 随机访问 ✅  vs  O(n) 插入删除 ❌
- **缓存友好**：连续内存命中 CPU 缓存行，顺序遍历比链表快一个数量级
- **万物之基**：栈 / 队列 / 堆 / 哈希表（开放寻址）/ 字符串都以它为底层

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：内存连续 ⇒ 能 O(1) 算地址访问，但插入删除要搬移。

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
数组的一切特性都源于"内存连续"这一物理事实。这个权衡贯穿整个章节。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# 复杂度：数组 vs 链表

::left::

<div class="text-center text-2xl font-bold mb-4 text-blue-600">数组</div>

| 操作 | 复杂度 |
| --- | --- |
| 访问 `a[i]` | **O(1)** ✅ |
| 头部增删 | O(n) ❌ |
| 尾部增删 | **O(1)** ✅ |
| 中间增删 | O(n) ❌ |
| 查找（有序） | **O(log n)** ✅ |

::right::

<div class="text-center text-2xl font-bold mb-4 text-purple-600">链表</div>

| 操作 | 复杂度 |
| --- | --- |
| 访问 `a[i]` | O(n) ❌ |
| 头部增删 | **O(1)** ✅ |
| 尾部增删 | **O(1)** ✅ |
| 中间增删 | **O(1)** ✅ |
| 查找（有序） | O(n) ❌ |

::bottom::

<div v-click class="mt-6 text-center text-lg">

🎯 选型口诀：**读多写少 / 要随机访问 → 数组；增删多 → 链表**

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
这是数组vs链表的核心对比表，要记熟。两者复杂度完全镜像。
-->

---

# 动态数组与几何扩容

满则扩容：申请新块 ×2，拷贝旧元素，释放旧块。

<div class="grid grid-cols-2 gap-8">
<div>

```js {all|1-3|5-8|all}
function pushBack(arr, x) {
  if (arr.size === arr.capacity) {
    // 几何扩容：×2
    const newCap = arr.capacity * 2;
    const next = allocate(newCap);
    copy(next, arr.data);
    arr.data = next;
    arr.capacity = newCap;
  }
  arr.data[arr.size++] = x;
}
```

</div>
<div>

**摊还分析：为什么尾插是 O(1)**

<v-clicks>

- 单次扩容 O(n)（拷贝全部）
- 但连续插 n 个元素：
- 搬移次数 `1+2+4+...+n ≈ 2n`
- **摊还每次 2n/n = O(1)** ✅
- 最坏单次仍 O(n)（恰好扩容）

</v-clicks>

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

**容量 vs 长度**：`capacity`（已申请）≠ `size`（实际元素）。×2 峰值 ~2 倍内存；×1.5 峰值 ~1.5 倍。

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
摊还分析是面试高频考点。核心：几何级数求和约 2n，摊到 n 次是 O(1)。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 双指针三大类

::left::

**① 对撞指针**（有序数组）

```js
let l = 0, r = n - 1;
while (l < r) {
  const sum = a[l] + a[r];
  if (sum === target) return [l, r];
  sum < target ? l++ : r--;
}
```

**② 快慢指针**（原地改造）

```js
let slow = 0;
for (let fast = 0; fast < n; fast++)
  if (keep(a[fast])) a[slow++] = a[fast];
// slow = 压实后的长度
```

::right::

**③ 分离指针**（两有序数组）

```js
let i = 0, j = 0;
while (i < a.length && j < b.length)
  a[i] <= b[j]
    ? res.push(a[i++])
    : res.push(b[j++]);
```

<div class="mt-4 text-center text-sm text-gray-500">

三类指针都把 O(n²) 优化到 **O(n)**

</div>

::bottom::

<div v-click class="mt-4 text-center">

🎯 对撞 → 两数之和 · 快慢 → 移除元素/去重 · 分离 → 归并/交集

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
双指针是数组最高频的套路。对撞要有序前提；快慢用于原地改造；分离用于两数组。
-->

---

# 滑动窗口：连续子数组万能套路

维护 `[left, right]`，右扩探索、左缩合法化。

<div class="grid grid-cols-2 gap-6">
<div>

**框架（背下来）**

```js
let left = 0, ans = 0;
for (let right = 0; right < n; right++) {
  window.add(a[right]);        // 右扩
  while (!valid(window)) {     // 不合法就左缩
    window.remove(a[left]);
    left++;
  }
  ans = Math.max(ans, right - left + 1); // 最长
}
```

</div>
<div>

**何时能用**

<v-clicks>

- 求**连续**子数组/子串
- 的**最长 / 最短 / 恰好 k**
- 且窗口状态**单调**（缩 left 让窗口更合法）

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm">

⚠️ 含负数时状态不单调 → 用**前缀和+哈希**

</div>

</div>
</div>

<div v-click class="mt-2 text-center text-sm">

**经典题**：无重复最长子串 · 最小覆盖子串 · 长度最小子数组

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
滑动窗口依赖单调性。含负数失效时换前缀和+哈希——这个边界必考。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 前缀和 vs 差分：互为逆运算

::left::

**前缀和**（擅长查询）

```
prefix[i] = a[0]+...+a[i-1]
sum(l, r) = prefix[r+1] - prefix[l]
```

- 区间求和：O(n) → **O(1)**
- `prefix[0]=0` 整体右移避越界
- 前缀和+哈希：和为 k 的子数组

::right::

**差分数组**（擅长修改）

```
diff[i] = a[i] - a[i-1]
区间[l,r]加v: diff[l]+=v; diff[r+1]-=v
```

- 区间修改：O(n) → **O(1)**
- 求前缀和还原原数组
- 「多次区间改 + 最后一次查」

::bottom::

<div v-click class="mt-4 text-center">

⚡ 查询与修改**交替**进行时 → 升级到 **树状数组 / 线段树**

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
前缀和查、差分改，互为逆运算。交替操作就上树状数组/线段树。
-->

---

# 矩阵：行主序与旋转

<div class="grid grid-cols-2 gap-6">
<div>

**缓存友好遍历**（行主序）

```js
// ✅ 外层行 内层列
for (let i = 0; i < rows; i++)
  for (let j = 0; j < cols; j++)
    process(m[i][j]);
```

**顺时针旋转 90° = 转置 + 行翻转**

```js
// 转置（仅上三角）
for (let i = 0; i < n; i++)
  for (let j = i+1; j < n; j++)
    [m[i][j], m[j][i]] = [m[j][i], m[i][j]];
for (const row of m) row.reverse(); // 行翻转
```

</div>
<div>

**螺旋遍历：四边界剥皮**

```js
let [t,b,l,r] = [0,rows-1,0,cols-1];
while (t<=b && l<=r) {
  for (let j=l;j<=r;j++) visit(m[t][j]); t++;
  for (let i=t;i<=b;i++) visit(m[i][r]); r--;
  if (t<=b){for(let j=r;j>=l;j--) visit(m[b][j]); b--;}
  if (l<=r){for(let i=b;i>=t;i--) visit(m[i][l]); l++;}
}
```

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ 下边/左边两步必须判 `t<=b`/`l<=r`，避免剩一行时重复遍历

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
矩阵遍历：行主序要外层行内层列；旋转=转置+行翻转；螺旋要四边界且判剩余单行。
-->

---
layout: center
class: text-center
---

# 数组是数据结构的地基

<div class="text-2xl mt-8 mb-12">

连续内存 → O(1) 访问 → 承载万物

</div>

<v-click>

<div class="text-lg">

栈 · 队列 · 堆 · 哈希表 · 字符串 · 树状数组 都建在数组之上

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/array" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/array-slide/" target="_blank" class="text-xl icon-btn">
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
数组是地基。掌握了它的物理模型和三大套路（双指针、滑窗、前缀和），后续数据结构就有了根基。
-->
