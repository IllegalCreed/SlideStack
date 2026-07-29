---
theme: seriph
background: https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=2048
title: 素数筛
info: |
  ## 素数筛（埃氏筛 / 线性筛）
  试除法 · 埃氏筛 · 线性筛
  数论的「批量筛素」利器。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 素数筛

埃氏筛 O(n log log n) · 线性筛 O(n) · 数论的批量利器

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/sieve-of-eratosthenes" target="_blank" class="icon-btn">
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
素数筛是数论最基础的算法之一。今天讲透试除判定、埃氏筛、线性筛三种思路与它们的复杂度差异。
-->

---
transition: fade-out
---

# 素数是什么

**大于 1** 且只能被 **1 和自身**整除的自然数（正因子恰好两个）。

<v-clicks>

- **最小的素数是 2**，也是唯一的偶素数
- 前 10 个素数：`2, 3, 5, 7, 11, 13, 17, 19, 23, 29`
- **1 不是素数**（因子只有一个，既非素数也非合数）
- **合数**：大于 1 且非素数（至少有一个其他因子）

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**算术基本定理**：任何大于 1 的整数都能**唯一**分解为素数乘积——素数是数论的「原子」。

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
关键：1 不是素数，这是筛法初始化和算术基本定理的前提。2 是唯一的偶素数。
-->

---

# 试除法：判定单个数

判定 `n` 是否为素数，只需试除 `2` 到 `√n`——**O(√n)**。

<div class="grid grid-cols-2 gap-8">
<div>

```js
function isPrime(n) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let i = 3; i * i <= n; i += 2)
    if (n % i === 0) return false;
  return true;
}
```

</div>
<div>

<v-clicks>

- **为何只到 √n**：因子成对
- 若 `n = a × b` 且 `a ≤ b`
- 则 `a ≤ √n`
- `2..√n` 都除不尽 → 是素数

</v-clicks>

<div v-click class="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

**单判用试除**最划算；批量求区间素数才用筛法。

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
pre { font-size: 0.8em; }
</style>

<!--
试除法 O(√n)。关键理解为何只到 √n：因子成对，较小的那个必 ≤ √n。
-->

---

# 埃氏筛：素数筛掉倍数

从 2 起，每遇到素数 `p`，把 `p` 的倍数全标成合数。

<div class="grid grid-cols-2 gap-8">
<div>

```js
const isp = new Array(n+1).fill(true);
isp[0] = isp[1] = false;
for (let p = 2; p * p <= n; p++)
  if (isp[p])
    for (let k = p*p; k <= n; k += p)
      isp[k] = false;
```

</div>
<div>

<v-clicks>

- 外层只到 **√n**（更大素数无倍数可筛）
- 内层从 **p²** 起（更小倍数已筛过）
- 剩下的 `true` 即素数

</v-clicks>

<div v-click class="mt-4 p-3 rounded bg-green-50 dark:bg-green-900/20 text-sm">

复杂度 **O(n log log n)**——`log log n` 增长极慢，几乎线性。

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
pre { font-size: 0.8em; }
</style>

<!--
埃氏筛：素数 p 筛 p 的倍数。两处优化：外层到 √n，内层从 p² 起。
-->

---

# 为何埃氏筛有重复

一个合数会被它的**每个素因子**各筛一次。

<v-clicks>

- 以 `12 = 2² × 3` 为例：

</v-clicks>

```
外层到 p=2：标 4, 6, 8, 10, 12, ...   → 12 被筛第 1 次
外层到 p=3：标 9, 12, 15, ...          → 12 被筛第 2 次
```

<v-clicks>

- `12` 被素因子 `2` 和 `3` **各筛一次**
- `30 = 2×3×5` 被筛 **三次**
- 重复不影响正确性，但拉高常数
- 复杂度从 O(n) 退化到 **O(n log log n)**

</v-clicks>

<div v-click class="mt-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500">

**线性筛的目标**：让每个合数只被最小质因子筛一次，消除重复。

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
重复问题是理解线性筛动机的关键。12 被 2 和 3 各筛一次。
-->

---

# 线性筛：每个合数只筛一次

维护素数表，让合数**只被最小质因子筛掉**——`i % p === 0` 时 `break`。

<div class="grid grid-cols-2 gap-6">
<div>

```js
const isp = new Array(n+1).fill(true);
const pr = [];
isp[0] = isp[1] = false;
for (let i = 2; i <= n; i++) {
  if (isp[i]) pr.push(i);
  for (const p of pr) {
    if (p * i > n) break;
    isp[p * i] = false;
    if (i % p === 0) break; // 关键
  }
}
```

</div>
<div>

**为何 `break`**

<v-clicks>

- 设 `i = p × k`（p 是 i 的最小质因子）
- 对更大素数 `q > p`：
- `i × q = p × k × q`
- 最小质因子仍是 **p** 不是 q
- 应留给「`k×q` 配 p」那次筛

</v-clicks>

</div>
</div>

<div v-click class="mt-2 text-center text-sm">

复杂度 **O(n)**——但常数比埃氏筛大

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
线性筛的核心：i%p===0 时 break。这保证每个合数只被最小质因子筛一次。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# 埃氏筛 vs 线性筛

::left::

<div class="text-center text-2xl font-bold mb-4 text-blue-600">埃氏筛</div>

| 维度 | 值 |
| --- | --- |
| 复杂度 | O(n log log n) |
| 重复 | 有 |
| 外层 | 到 √n |
| 空间 | O(n) |
| 实测 n=10⁷ | ~30ms ✅ |

::right::

<div class="text-center text-2xl font-bold mb-4 text-purple-600">线性筛</div>

| 维度 | 值 |
| --- | --- |
| 复杂度 | **O(n)** |
| 重复 | 无 |
| 外层 | 到 n |
| 空间 | O(n)+表 |
| 实测 n=10⁷ | ~60ms |

::bottom::

<div v-click class="mt-6 text-center text-lg">

🎯 小数据埃氏快（常数小） · 大数据 / 积性函数用线性筛

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
对照表。注意：线性筛虽然大 O 更优，但常数大，小数据反而慢。
-->

---

# 优化：从 p² 起筛 + 压缩

<v-clicks>

- **从 p² 起筛**：内层起点从 `2p` 改 `p²`——更小倍数在筛更小素因子时已标过，省一半常数
- **外层到 √n**：`p > √n` 时 `p² > n`，无倍数可筛
- **只筛奇数**：单独处理 2，只对奇数开数组，空间时间均减半
- **位压缩**：用 BitSet 每位存一数，空间再除 8（`n=10⁹` 约 125MB）
- **分段筛**：`n` 超内存时分段，用 `[2, √n]` 素数逐段筛，空间降到 O(√n+B)

</v-clicks>

<div v-click class="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500">

**上限参考**：`n=10⁷` 约几十毫秒；`n=10⁸` 约 0.5~1 秒、内存 ~100MB；`n≥10⁹` 需位压缩或分段。

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
优化技巧：从 p² 起筛最常用。超大 n 用分段筛。
-->

---

# 应用：素数表 + 质因数分解

筛一次，长期复用：`isPrime` O(1) 查询、`primes` O(1) 取第 k 个。

<div class="grid grid-cols-2 gap-6">
<div>

**最小质因子表 spf**

```js
const spf = new Array(n+1).fill(0);
for (let i = 2; i <= n; i++) {
  if (spf[i] === 0) { spf[i] = i; pr.push(i); }
  for (const p of pr) {
    if (p > spf[i] || p*i > n) break;
    spf[p*i] = p;
  }
}
```

</div>
<div>

**O(log n) 质因数分解**

```js
function factorize(x, spf) {
  const res = [];
  while (x > 1) {
    const p = spf[x]; let c = 0;
    while (x % p === 0) { x /= p; c++; }
    res.push([p, c]);
  }
  return res;
}
// factorize(60) => [[2,2],[3,1],[5,1]]
```

</div>
</div>

<div v-click class="mt-2 text-center text-sm">

素性查询 · 第 k 素数 · 质因数分解 · 欧拉函数 φ · 莫比乌斯 μ

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
spf 表是线性筛的副产物，支撑 O(log n) 质因数分解和积性函数筛。
-->

---
layout: center
class: text-center
---

# 素数筛：批量求素数的利器

<div class="text-2xl mt-8 mb-12">

单判 O(√n) · 埃氏 O(n log log n) · 线性 O(n)

</div>

<v-click>

<div class="text-lg">

从 p² 起筛 · spf 表分解 · 积性函数筛

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/sieve-of-eratosthenes" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/prime-sieve-slide/" target="_blank" class="text-xl icon-btn">
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
总结：掌握三种复杂度阶梯和 spf 应用，覆盖绝大多数素数问题。
-->
