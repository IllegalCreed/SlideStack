---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 序列与区间动态规划
info: |
  ## 序列与区间动态规划（Sequence & Interval DP）
  LCS · LIS · 编辑距离 · 最长回文子串 · 石子合并
  DP 三部曲的承上启下之叶。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 序列与区间动态规划

序列 DP · 区间 DP · 状态落在边界上

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/lcs" target="_blank" class="icon-btn">
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
本叶是 DP 三部曲的中段：把基础 DP 的状态从「容量」换成「序列下标」或「区间右端」。
-->

---
transition: fade-out
---

# 序列 DP vs 区间 DP

状态落在「边界」上，转移在边界之间发生。

<v-clicks>

- **序列 DP**：`dp[i]` 表「前 i 个」或「以 i 结尾」的最优 —— 一维递推
- **区间 DP**：`dp[i][j]` 表「区间 `[i,j]`」的最优 —— **按长度枚举 + 枚举断点 k**
- **LCS / 编辑距离**：状态虽是 `dp[i][j]`，但 i、j 各管一个序列（双序列 DP，非区间）

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：问「前 i 个 / 以 i 结尾」→ 序列 DP；问「一个区间合并/消除」→ 区间 DP。

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
判别技巧：双序列用 dp[i][j]（LCS/编辑距离）；单序列区间用 dp[i][j]（石子合并/回文）。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# LCS：最长公共子序列

::left::

**状态**：`dp[i][j]` = s1 前 i 与 s2 前 j 的 LCS 长度

**转移**：

```js
for (let i = 1; i <= n; i++)
  for (let j = 1; j <= m; j++)
    dp[i][j] = s1[i-1] === s2[j-1]
      ? dp[i-1][j-1] + 1           // 相等：斜上 +1
      : Math.max(                  // 否则：左/上取大
          dp[i-1][j], dp[i][j-1]);
```

::right::

**直觉**：最后一步看两串末字符

<v-clicks>

- 相等 → 配对，斜上 +1
- 不等 → 丢一个，左/上取大
- 边界 `dp[0][*]=0`
- 复杂度 **O(nm)**
- 可滚动压到 O(min(n,m))

</v-clicks>

::bottom::

<div v-click class="mt-4 text-center">

🎯 例：`"abcde"` 与 `"ace"` → LCS = `"ace"`，长度 3

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
LCS 的对角线 +1 对应匹配字符，回溯这些步骤即可还原 LCS。
-->

---

# LIS：最长递增子序列

朴素 O(n²) 与二分优化 O(n log n)。

<div class="grid grid-cols-2 gap-8">
<div>

**朴素 O(n²)**：`dp[i]` = 以 `a[i]` 结尾

```js
const dp = Array(n).fill(1);
for (let i = 0; i < n; i++)
  for (let j = 0; j < i; j++)
    if (a[j] < a[i])
      dp[i] = Math.max(dp[i], dp[j]+1);
return Math.max(...dp);
```

</div>
<div>

**二分 O(n log n)**：`tails[k]`=长度 k+1 最小尾

```js
const tails = [];
for (const x of a) {
  // lowerBound：第一个 >= x
  let lo = 0, hi = tails.length;
  while (lo < hi) {
    const m = (lo+hi) >> 1;
    tails[m] >= x ? (hi=m) : (lo=m+1);
  }
  lo === tails.length ? tails.push(x) : (tails[lo]=x);
}
return tails.length;
```

</div>
</div>

<div v-click class="mt-2 text-center text-sm">

🎯 二分直觉：**尾越小，后面越容易接更长** —— 严格递增用 `lowerBound`

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.68em; }
</style>

<!--
二分版只给长度，要还原序列得另存前驱。严格递增必须用 lowerBound。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 编辑距离：增删改的 min

::left::

**状态**：`dp[i][j]` = s1 前 i 变 s2 前 j 的最少操作数

**转移**：

```js
if (s1[i-1] === s2[j-1])
  dp[i][j] = dp[i-1][j-1];        // 相等：免操作
else
  dp[i][j] = 1 + Math.min(        // 否则三选一
    dp[i-1][j-1],                  // 改
    dp[i-1][j],                    // 删 s1[i-1]
    dp[i][j-1]                     // 增 s2[j-1]
  );
```

::right::

**边界**：`dp[0][j]=j`、`dp[i][0]=i`

<v-clicks>

- 空串变 j 长 = j 次增
- j 长变空串 = i 次删
- 复杂度 **O(nm)**
- 与 LCS 同构：相等 +1/免操作，否则 max/min

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ 不等时是 **1+min(改,删,增)** 三项，漏一项少算一种操作

</div>

::bottom::

<div v-click class="mt-4 text-center">

🎯 `"kitten"` → `"sitting"` 编辑距离 = 3

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
编辑距离和 LCS 结构几乎一致：LCS 是相等+1否则max，编辑距离是相等免操作否则1+min。
-->

---

# 最长回文子串：区间 DP 入门

`dp[i][j]` 表 `s[i..j]` 是否回文，**按长度枚举**。

<div class="grid grid-cols-2 gap-8">
<div>

```js
for (let i = 0; i < n; i++) dp[i][i] = true;
for (let len = 2; len <= n; len++)
  for (let i = 0; i+len-1 < n; i++) {
    const j = i + len - 1;
    if (s[i] === s[j]) {
      dp[i][j] = len <= 2 ? true : dp[i+1][j-1];
      if (dp[i][j] && len > max) { max = len; }
    }
  }
```

</div>
<div>

**三层判断**

<v-clicks>

- 长度 1：必回文
- 长度 2：`s[i]==s[j]`
- 长度 >2：两端相等 **且** 内部 `dp[i+1][j-1]`

</v-clicks>

<div v-click class="mt-2 text-sm">

依赖更短的子区间 → **必须按长度从小到大枚举**

</div>

</div>
</div>

<div v-click class="mt-2 text-center text-sm">

⚠️ 「最长回文**子串**」（连续，是否）≠ 「最长回文**子序列**」（不连续，长度）

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
区间 DP 的标志：dp[i][j] 依赖 dp[i+1][j-1]，必须按长度递增枚举。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 石子合并：区间 DP 标杆

::left::

合并相邻两堆，代价 = 两堆之和，求最小总代价

```js
for (let len = 2; len <= n; len++)
  for (let i = 0; i+len-1 < n; i++) {
    const j = i+len-1;
    dp[i][j] = Infinity;
    for (let k = i; k < j; k++)      // 枚举断点
      dp[i][j] = Math.min(
        dp[i][j], dp[i][k]+dp[k+1][j]);
    dp[i][j] += sum(i, j);           // 加区间和
  }
```

::right::

**转移公式**

`dp[i][j] = min(dp[i][k]+dp[k+1][j]) + sum[i..j]`

<v-clicks>

- 最后一次合并：`[i,k]` 一堆 + `[k+1,j]` 一堆
- 区间和用前缀和 O(1) 取
- 复杂度 **O(n³)**
- 四边形优化可降到 O(n²)

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm">

⚠️ 必须按长度枚举，否则子区间未算

</div>

::bottom::

<div v-click class="mt-4 text-center">

🎯 断点 k 从 i 到 j-1，保证 `dp[i][k]`、`dp[k+1][j]` 先就绪

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.68em; }
</style>

<!--
石子合并是区间 DP 的标杆：枚举断点 + 前缀和。识别信号：相邻合并求最优。
-->

---

# 区间 DP 万能模板

「对一个序列反复相邻合并/消除，求最优」就套它。

```js
for (let i = 0; i < n; i++) dp[i][i] = /* 单点边界 */;
for (let len = 2; len <= n; len++) {        // 外层：区间长度（小→大）
  for (let i = 0; i + len - 1 < n; i++) {   // 中层：左端点
    const j = i + len - 1;                  // 算出右端点
    dp[i][j] = /* 初始值 */;
    for (let k = i; k < j; k++)             // 内层：枚举断点
      dp[i][j] = optimize(dp[i][j], combine(dp[i][k], dp[k+1][j]));
  }
}
```

<div class="grid grid-cols-2 gap-8 mt-4">
<div>

<v-clicks>

- **石子合并**：`+sum[i..j]`
- **最长回文子串**：`s[i]==s[j] && dp[i+1][j-1]`
- **矩阵连乘**：`+行列相乘代价`

</v-clicks>

</div>
<div>

<v-clicks>

- **戳气球**：合并方向反过来
- **合并石头（k 堆）**：步长改 k-1
- **Remove Boxes**：加「颜色维度」

</v-clicks>

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
三层 for + 枚举断点是区间 DP 的骨架。按长度枚举保证子区间先算好。
-->

---

# 复杂度对比

| 模型 | 状态 | 时间 | 空间 |
| --- | --- | --- | --- |
| LCS | `dp[i][j]` 前 i 前 j | O(nm) | O(nm)→O(min) |
| LIS 朴素 | `dp[i]` 以 i 结尾 | O(n²) | O(n) |
| LIS 二分 | `tails[k]` 最小尾 | **O(n log n)** | O(n) |
| 编辑距离 | `dp[i][j]` 前 i 前 j | O(nm) | O(nm)→O(min) |
| 最长回文子串 | `dp[i][j]` 是否回文 | O(n²) | O(n²) |
| 石子合并 | `dp[i][j]` 最小代价 | **O(n³)** | O(n²) |

<div v-click class="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**记忆要点**：双序列 DP（LCS/编辑距离）都是 O(nm)；区间 DP 多是 O(n³)（三层 for）；LIS 二分是唯一 O(n log n) 的优雅优化。

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
table { font-size: 0.78em; }
</style>

<!--
复杂度速记：双序列 O(nm)、区间 O(n³)、LIS 二分 O(nlogn)。
-->

---
layout: center
class: text-center
---

# 状态落在边界，转移在边界之间

<div class="text-2xl mt-8 mb-12">

序列 DP `dp[i]` · 区间 DP `dp[i][j]` · 按长度枚举 + 枚举断点

</div>

<v-click>

<div class="text-lg">

LCS · LIS · 编辑距离 · 最长回文子串 · 石子合并 —— 序列区间 DP 的主力战场

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/lcs" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/dp-sequence-interval-slide/" target="_blank" class="text-xl icon-btn">
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
吃透这五个模型，序列区间 DP 的面试题基本能对号入座。下一站进阶 DP（树/数位/换根）。
-->
