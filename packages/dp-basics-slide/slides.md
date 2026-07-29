---
theme: seriph
background: https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=2048
title: 动态规划基础
info: |
  ## 动态规划基础（Dynamic Programming Basics）
  最优子结构 · 重叠子问题 · 状态转移
  DP 三部曲之一：基础模型。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 动态规划基础

最优子结构 · 重叠子问题 · 状态转移方程

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/knapsack" target="_blank" class="icon-btn">
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
动态规划是算法里最值得投资的思想。今天讲透它的核心思想、三要素和基础模型。
-->

---
transition: fade-out
---

# DP 是什么

一套「**大问题拆成语义相同的小问题、合并小问题解得大问题解**」的方法论。

<v-clicks>

- **最优子结构**：大问题最优解 = 子问题最优解的组合 ✅
- **重叠子问题**：子问题被反复求解，必须记下来 ⚡
- **核心收益**：暴力 O(2ⁿ) → DP O(n²)，常常质变
- **不是万能**：要求「无后效性」（未来不依赖到达路径）

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：有最优子结构 + 重叠子问题 → 用记忆化/递推把指数级降到多项式。

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
抓住两个特征：最优子结构和重叠子问题。分治缺重叠，贪心缺穷举。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# DP vs 分治 vs 贪心

::left::

<div class="text-center text-2xl font-bold mb-4 text-blue-600">DP</div>

| 维度 | DP |
| --- | --- |
| 子问题 | **重叠** |
| 记忆化 | **必须记** |
| 解 | 最优（穷举） |
| 典型 | 背包、LCS |

::right::

<div class="text-center text-2xl font-bold mb-4 text-purple-600">分治 / 贪心</div>

| 维度 | 分治 | 贪心 |
| --- | --- | --- |
| 子问题 | 独立 | 不显式 |
| 记忆化 | 不需 | 不需 |
| 解 | 最优 | 需证明 |
| 典型 | 归并 | 区间调度 |

::bottom::

<div v-click class="mt-6 text-center text-lg">

🎯 选型：能证贪心就贪心 → 子问题独立用分治 → 都不行用 DP 兜底

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
DP 的子问题是重叠的，必须记下来；分治的子问题独立；贪心不回头。
-->

---

# 三要素：状态、转移、边界

任何 DP 题都能拆成这三件事。

<v-clicks>

- **① 状态定义**：`dp[...]` 代表什么（最难、最关键）
- **② 状态转移方程**：`dp[i]` 怎么由更小子问题推出（灵魂）
- **③ 边界条件**：最小的初始值（`dp[0]`、`dp[1]`）

</v-clicks>

<div v-click class="mt-6 p-4 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">

**找转移的技巧**：从「最后一步」倒推——假设已到终点，最后一步怎么来的？枚举所有可能取最优。

</div>

<div v-click class="mt-4 text-center text-sm text-gray-500">

流程：暴力递归 → 观察重叠 → 加记忆化 → 改递推 → 优化空间

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
三要素：状态、转移、边界。找转移从最后一步倒推是最实用的技巧。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 记忆化 vs 递推

::left::

**自顶向下（记忆化递归）**

```js
const memo = new Map();
function fib(n) {
  if (n <= 2) return 1;
  if (memo.has(n)) return memo.get(n);
  const r = fib(n-1) + fib(n-2);
  memo.set(n, r);
  return r;
}
```

- 贴近直觉，只算用到的
- 有递归栈开销

::right::

**自底向上（递推填表）**

```js
function fib(n) {
  const dp = [0, 1, 1];
  for (let i = 3; i <= n; i++)
    dp[i] = dp[i-1] + dp[i-2];
  return dp[n];
}
```

- 无栈，常数小
- 易做滚动/一维化

::bottom::

<div v-click class="mt-6 text-center">

⚡ 两者等价，O(2ⁿ) → **O(n)**。斐波那契是 DP 的 Hello World。

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
记忆化贴近直觉，递推常数小。新手先用记忆化理顺思路，再改递推拿性能。
-->

---

# 爬楼梯：一维递推

每次爬 1 或 2 阶，到第 n 阶的方案数（LeetCode 70）。

<div class="grid grid-cols-2 gap-8">
<div>

**转移（最后一步倒推）**

```js
function climbStairs(n) {
  if (n <= 2) return n;
  let p2 = 1, p1 = 2;       // dp[1], dp[2]
  for (let i = 3; i <= n; i++) {
    const cur = p1 + p2;    // dp[i]=dp[i-1]+dp[i-2]
    p2 = p1; p1 = cur;
  }
  return p1;
}
```

</div>
<div>

**五步拆解**

<v-clicks>

- 状态：`dp[i]`=到 i 阶方案数
- 转移：`dp[i]=dp[i-1]+dp[i-2]`
- 边界：`dp[1]=1, dp[2]=2`
- 顺序：i 从 3 到 n
- 空间：滚动到 **O(1)**

</v-clicks>

</div>
</div>

<div v-click class="mt-2 text-center text-sm">

本质是斐波那契。若可跨 1~k 阶，转移改为 `dp[i]=Σdp[i-k]`

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
爬楼梯是斐波那契的变体。最后一步要么跨1阶要么跨2阶，方案数相加。
-->

---

# 0-1 背包：选或不选

每件物品 0 或 1，容量 W 下求最大价值。

<div class="grid grid-cols-2 gap-8">
<div>

```js
function knap01(w, v, W) {
  const dp = new Array(W + 1).fill(0);
  for (let i = 0; i < w.length; i++)
    for (let j = W; j >= w[i]; j--) // 倒序!
      dp[j] = Math.max(dp[j],
        dp[j - w[i]] + v[i]);
  return dp[W];
}
```

</div>
<div>

**转移（二维）**

```
dp[i][j] = max(
  dp[i-1][j],            // 不放
  dp[i-1][j-w]+v         // 放
)
```

<v-clicks>

- 只依赖上一行 → 压一维
- **容量必须倒序**
- 正序会「放多次」→ 退化完全背包

</v-clicks>

</div>
</div>

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm border-l-4 border-amber-500">

⚠️ 倒序保证算 `dp[j]` 时 `dp[j-w]` 还是上一轮旧值——每件只放一次

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.74em; }
</style>

<!--
0-1背包是DP的Hello World。二维压一维时容量必须倒序，这是最高频考点。
-->

---

# 完全背包 vs 零钱兑换

物品无限件，唯一区别：容量**正序**遍历。

<div class="grid grid-cols-2 gap-6">
<div>

**完全背包（正序）**

```js
function knapComp(w, v, W) {
  const dp = new Array(W + 1).fill(0);
  for (let i = 0; i < w.length; i++)
    for (let j = w[i]; j <= W; j++) // 正序
      dp[j] = Math.max(dp[j],
        dp[j - w[i]] + v[i]);
  return dp[W];
}
```

</div>
<div>

**零钱兑换 II（组合数）**

```js
function change(amt, coins) {
  const dp = new Array(amt + 1).fill(0);
  dp[0] = 1;
  for (const c of coins)
    for (let j = c; j <= amt; j++) // 正序
      dp[j] += dp[j - c];
  return dp[amt];
}
```

</div>
</div>

<div v-click class="mt-2 text-center text-sm">

🎯 组合 vs 排列：**外层物品内层容量 → 组合**；外层容量内层物品 → 排列

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
完全背包只把倒序改正序，就是无限件。零钱兑换是它在求方案数上的应用。
-->

---

# DP 设计五步与识别信号

<div class="grid grid-cols-2 gap-8">
<div>

**五步法**

<v-clicks>

- ① 定义状态
- ② 找转移方程
- ③ 定边界条件
- ④ 定计算顺序
- ⑤ 优化空间

</v-clicks>

</div>
<div>

**何时用 DP**

<v-clicks>

- 问「最大/最小/最长」
- 问「方案数/是否可行」
- 能拆语义相同子问题
- 子问题重叠

</v-clicks>

</div>
</div>

<div v-click class="mt-6 p-3 rounded bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**经典一维模型**：爬楼梯 `dp[i]=dp[i-1]+dp[i-2]` · 打家劫舍 `dp[i]=max(dp[i-1],dp[i-2]+nums[i])` · Kadane `dp[i]=max(nums[i],dp[i-1]+nums[i])`

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
五步法是解题流程。识别信号：最值、方案数、可拆同形子问题、子问题重叠。
-->

---
layout: center
class: text-center
---

# DP 基础：状态转移的艺术

<div class="text-2xl mt-8 mb-12">

最优子结构 + 重叠子问题 → 记忆化/递推 → 多项式时间

</div>

<v-click>

<div class="text-lg">

斐波那契 · 爬楼梯 · 打家劫舍 · Kadane · 背包 · 零钱兑换

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/knapsack" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/dp-basics-slide/" target="_blank" class="text-xl icon-btn">
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
DP基础是三部曲开篇。掌握状态转移思想，后续LCS/编辑距离/树DP才有根基。
-->
