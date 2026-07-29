---
theme: seriph
background: https://images.unsplash.com/photo-1518770660439-4636190af475?w=2048
title: 进阶动态规划
info: |
  ## 进阶动态规划（Advanced DP）
  树形 · 数位 · 换根 · 状态压缩
  把 DP 推广到更复杂的结构维度。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 进阶动态规划

树形 · 数位 · 换根 · 状态压缩 DP

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/tree-dp" target="_blank" class="icon-btn">
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
进阶 DP 把状态从一维序列推广到树、数位、可换根的树、位掩码集合。核心难点是为每类结构找到正确的计算顺序。
-->

---
transition: fade-out
---

# 四大进阶 DP 模型

把 DP 从「一维序列」推广到**更复杂的结构维度**。

<v-clicks>

- **树形 DP**：状态挂节点 `f[u]`，后序 DFS 从叶到根合并
- **数位 DP**：按位拆解，逐位 DP + 记忆化 + `limit` 标志
- **换根 DP**：两次 DFS，求「每个根的答案」
- **状态压缩 DP**：位掩码把集合压成整数当状态维度

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：难点不在写代码，而在**为每类结构找到正确的计算顺序**。

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
四类模型长得完全不一样，最难的是识别题目该用哪一个。
-->

---

# 树形 DP：后序从叶到根

状态挂节点 `f[u]`，先递归子节点，回溯时合并。

<div class="grid grid-cols-2 gap-8">
<div>

```js {all|1-3|5-6|all}
function dfs(u, fa) {
  for (const v of adj[u]) {
    if (v === fa) continue;
    dfs(v, u);            // 后序：先算子
  }
  // 回溯：合并子节点
  f[u] = merge(f[v] for v);
}
dfs(0, -1);
```

</div>
<div>

**为什么是后序**

<v-clicks>

- 父依赖子，子必须先算完
- 后序 DFS = 树上的拓扑序
- `fa` 防止回到父节点死循环
- 每个节点 / 每条边访问一次

</v-clicks>

<div v-click class="mt-3 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ 遍历邻接表必须 `if (v === fa) continue`

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
pre { font-size: 0.78em; }
</style>

<!--
树形 DP 的核心：后序 DFS 制造计算顺序，fa 防回父。复杂度 O(n)。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 树形 DP 经典：独立集与直径

::left::

**最大独立集**（`f[u][0/1]`）

```js
function dfs(u, fa) {
  f[u][1] = w[u];
  for (const v of adj[u]) {
    if (v === fa) continue;
    dfs(v, u);
    f[u][0] += Math.max(f[v][0], f[v][1]);
    f[u][1] += f[v][0];
  }
}
```

- 选 u：子必不选
- 不选 u：子可选可不选

::right::

**树的直径**（最长链 + 次长链）

```js
function dfs(u, fa) {
  let m1 = 0, m2 = 0;
  for (const [v, w] of adj[u]) {
    if (v === fa) continue;
    dfs(v, u);
    const len = d[v] + w;
    if (len > m1) { m2 = m1; m1 = len; }
    else if (len > m2) m2 = len;
  }
  d[u] = m1;
  dia = Math.max(dia, m1 + m2);
}
```

::bottom::

<div v-click class="mt-4 text-center">

🎯 独立集 = 打家劫舍的树上版 · 直径 = 两条不同子树的下行链之和

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
独立集是树形 DP 最经典范式；直径要维护最长链+次长链，不能只记一条。
-->

---

# 数位 DP：逐位 + limit 标志

统计 `[1, R]` 内满足数位条件的数个数。

<div class="grid grid-cols-2 gap-8">
<div>

```js {all|1-2|4-7|all}
function dfs(pos, prev, limit) {
  if (pos === s.length) return 1;
  const up = limit ? s[pos] : 9;
  let ans = 0;
  for (let d = 0; d <= up; d++) {
    if (prev === 6 && d === 2) continue;
    ans += dfs(pos+1, d, limit && d === up);
  }
  return ans;
}
```

</div>
<div>

**`limit` 标志的含义**

<v-clicks>

- `limit=true`：前面顶到上界，本位受限
- `limit=false`：本位 `0~9` 自由
- 传递：`limit && d === up`

</v-clicks>

<div v-click class="mt-3 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

区间 `[L,R]` = `count(R) - count(L-1)`

</div>

</div>
</div>

<div v-click class="mt-3 text-center text-sm">

**复杂度** `O(log R × 状态数)` —— 位数极少，极快

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
数位 DP 最易错的是 limit 标志：true 时本位不能超上界位，传递用 limit && d===up。
-->

---

# 换根 DP：两次 DFS

求「以**每个**节点为根时的答案」，朴素 O(n²) → 优化到 O(n)。

<div class="grid grid-cols-2 gap-8">
<div>

**① 第一遍 DFS 求 `down`**

```js
function dfs1(u, fa) {
  size[u] = 1;
  for (const [v, w] of adj[u]) {
    if (v === fa) continue;
    dfs1(v, u);
    size[u] += size[v];
    down[u] += down[v] + size[v]*w;
  }
}
```

</div>
<div>

**② 第二遍 DFS 换根求 `ans`**

```js
function dfs2(u, fa) {
  for (const [v, w] of adj[u]) {
    if (v === fa) continue;
    ans[v] = ans[u]
      - size[v]*w + (n-size[v])*w;
    dfs2(v, u);
  }
}
```

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-sm">

**关键**：换根时用父答案**扣除子这棵树的贡献**再传给子，防重复计算。`ans[u] = down[u] + up[u]`

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
换根 DP 两遍 DFS：先求 down（自底向上），再换根推 ans（自顶向下）。关键是扣除子贡献。
-->

---

# 状态压缩 DP：位掩码当集合

集合小（n ≤ 20）时，用整数二进制位表示集合。

<div class="grid grid-cols-2 gap-8">
<div>

**位运算速记**

```js
mask | (1 << i)   // 加入 i
mask & (1 << i)   // 测试 i 是否在
mask ^ (1 << i)   // 删除 i
// 枚举 mask 的所有子集
for (let sub = mask; sub;
     sub = (sub - 1) & mask) { }
```

</div>
<div>

**TSP（旅行商）**

```js
f[1<<0][0] = 0;
for (let mask = 1; mask < (1<<n); mask++)
  for (let i = 0; i < n; i++) {
    if (!(mask & (1<<i))) continue;
    for (let j = 0; j < n; j++) {
      if (mask & (1<<j)) continue;
      f[mask|(1<<j)][j] =
        Math.min(f[mask|(1<<j)][j],
                 f[mask][i] + dist[i][j]);
    }
  }
```

</div>
</div>

<div v-click class="mt-3 text-center text-sm">

`f[mask][i]` = 已访问 `mask`、当前在 `i` 的最优值 · 复杂度 **O(2ⁿ · n²)**

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
状压 DP 用整数位表示集合，是 TSP / 连通性 / 哈密顿路的通用武器，n 必须 ≤ 20。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# DP 优化引入（思想层面）

::left::

**单调队列优化**

<v-clicks>

- 转移是定长滑动区间最值
- 区间查询 O(n) → **O(1)**
- 整体降一维

</v-clicks>

<div class="mt-2 text-xs text-gray-500">典型：滑动窗口最大值、多重背包</div>

**矩阵快速幂**

<v-clicks>

- 线性递推（斐波那契、爬楼梯）
- 写成矩阵乘法 + 快速幂
- O(n) → **O(k³ log n)**

</v-clicks>

::right::

**斜率优化**

<v-clicks>

- 转移写成 `g(j) + h(i)·k(j)`
- 维护凸包 + 斜率单调
- O(n²) → **O(n log n)**

</v-clicks>

<div class="mt-2 text-xs text-gray-500">典型：任务安排、仓库建设</div>

::bottom::

<div v-click class="mt-4 text-center text-sm">

🎯 选哪个：定长区间最值 → 单调队列 · 线性式斜率比较 → 斜率 · 线性递推求第 n 项 → 矩阵快速幂

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
三种优化只讲思想：单调队列处理定长区间、斜率处理线性式、矩阵快速幂加速线性递推。
-->

---

# 模型识别决策树

```
是树上的问题吗？
├─ 是 → 求每个节点为根的答案？
│       ├─ 是 → 换根 DP（两遍 DFS）
│       └─ 否 → 树形 DP（后序，f[u]）
└─ 否 → 区间 [L,R] 内满足数位条件？
        ├─ 是 → 数位 DP（逐位 + limit）
        └─ 否 → 集合/连通性，n ≤ 20？
                ├─ 是 → 状压 DP（位掩码）
                └─ 否 → 线性/区间/背包 DP
```

<div v-click class="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500">

**口诀**：树上的问题用树形 · 数位的计数用数位 · 每个根都要答案用换根 · 集合小用状压

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
识别口诀是面试必背：四个「树/数位/根/集合」的特征词直接对应四个模型。
-->

---
layout: center
class: text-center
---

# 为复杂结构找到计算顺序

<div class="text-2xl mt-8 mb-12">

树形 · 数位 · 换根 · 状压 · 四类模型一站通

</div>

<v-click>

<div class="text-lg">

后序 DFS · 逐位 + limit · 两遍 DFS · 位掩码 —— DP 疆域的收官

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/tree-dp" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/dp-advanced-slide/" target="_blank" class="text-xl icon-btn">
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
进阶 DP 收官：掌握四大模型，再加上单调队列/斜率/矩阵快速幂的优化思想，DP 版图基本完整。
-->
