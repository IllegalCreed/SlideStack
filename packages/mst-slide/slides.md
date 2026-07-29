---
theme: seriph
background: https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=2048
title: 最小生成树算法
info: |
  ## 最小生成树算法（MST）
  Kruskal · Prim
  连通无向带权图的最小成本骨架。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 最小生成树算法

Kruskal · Prim · 用最小成本连通万物

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/kruskal" target="_blank" class="icon-btn">
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
最小生成树是贪心算法最经典的范例。今天讲透它的定义、两种算法和选型。
-->

---
transition: fade-out
---

# 生成树与最小生成树

**生成树**：连通无向图的「骨架」——含全部顶点、连通、无环。

<v-clicks>

- **恰好 n−1 条边**（n 是顶点数）：多一条成环，少一条断开
- **最小生成树（MST）**：边权之和最小的生成树
- **适用前提**：连通、无向、带权图
- **不连通**：只能求最小生成森林（每分量一棵）

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：MST = n 个顶点 + n−1 条边 + 连通无环 + 边权和最小。

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
核心：生成树必然 n-1 条边；MST 是权和最小的那棵。前提是连通无向带权。
-->

---

# 贪心为什么对：切割性质

把顶点集**任意切成 S 和 V−S**，横跨两半的边里**权最小**的那条**必属于 MST**。

<div class="grid grid-cols-2 gap-8">
<div>

<v-clicks>

- 每步贪心选「跨切割的最小边」
- 加入 MST 后不会成环（安全边）
- 无需回溯，保证全局最优
- 是 Kruskal / Prim 的**共同基石**

</v-clicks>

</div>
<div>

<div class="mt-4 p-4 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">

**环性质**：任一环上**权最大**的边**必不属于** MST。

两者合起来：贪心选小边对、贪心弃大边也对。

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
</style>

<!--
切割性质是 MST 贪心正确性的基石。Kruskal 和 Prim 都用它，只是切法不同。
-->

---

# Kruskal：排序边 + 并查集判环

全局挑最便宜的边，凑够 n−1 条收工。

<div class="grid grid-cols-2 gap-6">
<div>

```js {all|1-3|5-6|8-12|all}
edges.sort((a, b) => a.w - b.w);
let ans = 0, cnt = 0;
for (const { u, v, w } of edges) {
  if (find(u) !== find(v)) { // 不成环
    union(u, v);
    ans += w;
    if (++cnt === n - 1) break;
  }
}
```

</div>
<div>

**判环靠并查集**

<v-clicks>

- 两端点 `find` **同根** ⇒ 已连通 ⇒ 加了成环 ⇒ 跳过
- 不同根 ⇒ 加入并 `union`
- 每次 `find`/`union` 近似 **O(1)**

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-green-50 dark:bg-green-900/20 text-sm">

✅ 适合**稀疏图**：边少排序快

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
Kruskal = 排序 + 并查集判环。判环是灵魂：同根即成环。代码极短。
-->

---

# Kruskal 复杂度：O(E log E)

| 项 | 复杂度 | 说明 |
| --- | --- | --- |
| 排序边 | **O(E log E)** | 主导项 |
| 并查集 | O(E·α(n)) | α ≤ 5，近似常数 |
| **总计** | **O(E log E)** | 稀疏图占优 |

<div v-click class="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**为什么是 O(E log E)**：连通图 E ≤ V²，故 `log E ≤ 2 log V`，与 O(E log V) 同级，但**常数更小、代码更短**。

</div>

<v-click>

<div class="mt-4 text-center text-lg">

🎯 Kruskal 天然用**边集数组**（输入就是边列表），免建图。

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
table { font-size: 0.9em; }
</style>

<!--
Kruskal 复杂度由排序主导。并查集的 alpha 函数近似常数。稀疏图首选。
-->

---

# Prim：从点出发贪心最小边

从一颗种子长成一棵树，每次抓「连已选集合的最小边」。

<div class="grid grid-cols-2 gap-6">
<div>

```js {all|1-3|5-8|all}
visited[start] = true;
for (const { v, w } of g[start])
  heap.push([w, v]);
while (heap.size()) {
  const [w, u] = heap.pop();
  if (visited[u]) continue; // 丢弃
  visited[u] = true; ans += w;
  // 再把 u 的出边入堆
}
```

</div>
<div>

**堆存 `(w, v)`**

<v-clicks>

- 弹出即「跨切割最小边」
- 对端已选 → 跳过（过时边）
- 并入新顶点 → 它的出边入堆

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-purple-50 dark:bg-purple-900/20 text-sm">

✅ 适合**邻接表 / 通用**场景

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
Prim 像从一点向外长。堆保证每次弹出跨切割最小边。已选顶点要跳过。
-->

---

# Prim 复杂度：O(E log V) 与 O(V²)

| 实现 | 复杂度 | 适合图 |
| --- | --- | --- |
| 堆优化 | **O(E log V)** | 通用 / 中等 |
| 矩阵朴素 | **O(V²)** | **稠密图** |

<div class="grid grid-cols-2 gap-8 mt-4">
<div>

<v-click>

**堆优化版**

- 每条边至多入堆一次
- 堆操作 O(log V)
- 邻接表 + 稀疏图

</v-click>

</div>
<div>

<v-click>

**矩阵朴素版**

- 每轮 O(V) 扫最小 + 松弛
- n 轮 → O(V²)
- 邻接矩阵 + 稠密图

</v-click>

</div>
</div>

<div v-click class="mt-2 text-center text-sm">

⚠️ 稠密图（E≈V²）时，O(E log V) ≈ O(V² log V) **反而比朴素 O(V²) 慢**

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
table { font-size: 0.9em; }
</style>

<!--
Prim 两版：堆优化通用，矩阵朴素在稠密图反而最优（避开 log 因子）。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# Kruskal vs Prim：稀疏选谁？

::left::

<div class="text-center text-2xl font-bold mb-4 text-blue-600">Kruskal</div>

| 维度 | 值 |
| --- | --- |
| 贪心对象 | 边 |
| 复杂度 | **O(E log E)** |
| 适合图 | **稀疏** |
| 表示 | 边集数组 |

::right::

<div class="text-center text-2xl font-bold mb-4 text-purple-600">Prim</div>

| 维度 | 值 |
| --- | --- |
| 贪心对象 | 顶点 |
| 复杂度 | O(E log V) / O(V²) |
| 适合图 | **稠密** |
| 表示 | 邻接矩阵/表 |

::bottom::

<div v-click class="mt-6 text-center text-lg">

🎯 口诀：**稀疏选 Kruskal（排序省），稠密选 Prim（矩阵稳）**

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
核心选型：边少选 Kruskal，边多选 Prim 矩阵。两者都基于切割性质。
-->

---

# MST 性质与唯一性

<v-clicks>

- **边权全互异** ⇒ MST **唯一**，Kruskal 和 Prim 边集合完全一致
- **存在相等权值** ⇒ MST 可能不唯一，但**总权值必然相同**
- **判唯一性**：检查非树边加入后，环上是否有**等权边**可替代
- **不连通图**：无 MST，只能求**最小生成森林**
- **负权边**：不影响 MST（允许任意实数权），别和最短路负环混淆

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">

⚠️ **别混 MST 与最短路**：MST 连通所有点求总权最小（Prim）；最短路求一点到其余点最短（Dijkstra）。目标不同，算法不同。

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
唯一性：边权互异则唯一。负权不影响 MST。最常错的是把 MST 当最短路。
-->

---

# 应用：用最小成本连通万物

<div class="grid grid-cols-2 gap-8">
<div>

<v-clicks>

- **网络设计**：光缆/电网/管道连通，求最低总造价
- **聚类**：MST 删最大 k−1 条边得 k 个簇
- **近似 TSP**：MST 权 ≤ 最优 TSP，给下界

</v-clicks>

</div>
<div>

<v-click>

<div class="p-4 rounded bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**经典模型**：n 个城市，每条线路造价不同，连通所有城市且总造价最低 → **MST**。

</div>

</v-click>

<v-click>

<div class="mt-4 p-4 rounded bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">

**2-近似 TSP**：对 MST 做 DFS 先序遍历，回路长 ≤ 2 × 最优（满足三角不等式）。

</div>

</v-click>

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
MST 应用：网络设计最经典，聚类靠删大边，近似 TSP 用 MST 做下界。
-->

---
layout: center
class: text-center
---

# 用最小成本连通万物

<div class="text-2xl mt-8 mb-12">

n−1 条边 · 贪心选小边 · 稀疏 Kruskal 稠密 Prim

</div>

<v-click>

<div class="text-lg">

切割性质 → Kruskal 排序判环 · Prim 堆选最小连边

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/kruskal" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/mst-slide/" target="_blank" class="text-xl icon-btn">
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
总结：MST 是贪心的经典。掌握切割性质、两种算法、稀疏稠密选型即可。
-->
