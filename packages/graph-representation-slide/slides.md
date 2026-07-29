---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 图的表示
info: |
  ## 图的表示（Graph Representation）
  邻接矩阵 · 邻接表 · 边集数组
  图算法的存储地基。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 图的表示

邻接矩阵 · 邻接表 · 边集数组 · 图算法的存储地基

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/graph" target="_blank" class="icon-btn">
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
图是最通用的非线性数据结构。今天讲透「图怎么存」——三种表示法的时空权衡与选型。
-->

---
transition: fade-out
---

# 图是什么

`G = (V, E)`：**V** 个顶点 + **E** 条边，表达任意二元关系。

<v-clicks>

- **有向 vs 无向**：边有方向（关注/超链接）叫有向图；无方向（好友/道路）叫无向图
- **带权 vs 无权**：边带数值（距离/费用）叫带权图；只表「有/无」是无权图
- **稠密 vs 稀疏**：边数 `m ≈ n²` 稠密；`m ≪ n²`（如 O(n)）稀疏——**决定选型**
- **度**：关联边数；有向图分入度（指进来）、出度（指出去）
- **树是特殊图**：连通 + 无环 + 无向 + n-1 条边 = 树

</v-clicks>

<div v-click class="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：图统一了链表、树、网格——本叶只解决「**V 和 E 怎么存进内存**」。

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
图的基本概念。核心分类维度：有向/无向、带权/无权、稠密/稀疏。稀疏稠密是选型关键。
-->

---

# 邻接矩阵：n×n 数组查边 O(1)

`a[i][j]=1`（或权重）表示有边，**无向图矩阵对称**。

<div class="grid grid-cols-2 gap-8">
<div>

```js {all|1-2|3-5|all}
function buildMatrix(n, edges) {
  const a = Array.from({length:n}, () => new Array(n).fill(0));
  for (const [u,v] of edges) {
    a[u][v] = 1; a[v][u] = 1; // 无向双向
  }
  return a;
}
// 查边：a[u][v] === 1   O(1)
```

</div>
<div>

**优点**

- 查边 / 判边 **O(1)** ✅
- 实现最简单
- 适合**稠密图**、Floyd

**缺点**

- **空间 O(n²)** ❌
- 遍历邻居 O(n)（满行 0）
- 加顶点要扩矩阵 O(n²)

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

⚠️ 一亿顶点的稀疏图要 10¹⁶ 个槽——根本存不下，必须改用邻接表。

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
矩阵赢在查边 O(1)，输在空间 O(n²)。只有稠密图或要 O(1) 判边时才用。
-->

---

# 邻接表：每顶点挂邻居链表，省空间

外层数组套内层动态数组，存每个顶点的邻居。

<div class="grid grid-cols-2 gap-8">
<div>

```js {all|1-2|3-5|all}
function buildAdj(n, edges) {
  const adj = Array.from({length:n}, () => []);
  for (const [u,v] of edges) {
    adj[u].push(v); adj[v].push(u);
  }
  return adj;
}
// 遍历：for (w of adj[u])  O(度)
```

</div>
<div>

**优点**

- **空间 O(V+E)** ✅ 只存有边
- 遍历邻居 **O(度)** ✅
- BFS / DFS / Dijkstra 标配

**缺点**

- 查边 **O(度)**（扫链表）
- 删边 O(度)
- 重边会存多份

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-sm">

✅ 现实图（社交/网页/地图）几乎都稀疏——**邻接表是 90% 场景的默认选择**。

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
邻接表是默认选择。省空间 O(V+E)、遍历邻居 O(度)——这是 BFS/DFS/Dijkstra 的核心操作。
-->

---

# 边集数组：只存边，按边遍历

存一条条边 `{u, v, w}`，**不维护每个顶点的邻居**。

<div class="grid grid-cols-2 gap-8">
<div>

```js {all|1-3|all}
function buildEdges(edges) {
  return edges.map(([u,v,w]) => ({u,v,w}))
    .sort((a,b) => a.w - b.w); // 按权排
}
// 查边：扫全部 edges  O(E)
// 遍历 u 邻居：筛 u∈{e.u,e.v}  O(E)
```

</div>
<div>

**优点**

- **空间最小 O(E)** ✅
- 按边遍历天然高效
- 实现极简

**缺点**

- 查边 / 遍历邻居都 **O(E)** ❌
- 不适合 BFS / DFS / Dijkstra

**典型算法**：Kruskal、Bellman-Ford

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 text-sm">

🎯 当算法「**按边处理**」（Kruskal 排序所有边、Bellman-Ford 每轮松弛所有边）时，边集数组最顺手。

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
边集数组查询最慢但最省空间。Kruskal、Bellman-Ford 这类按边遍历的算法首选。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 三种表示法对比

::left::

<div class="text-center text-xl font-bold mb-3 text-blue-600">时空复杂度</div>

| 维度 | 矩阵 | 邻接表 |
| --- | --- | --- |
| 空间 | O(n²) | **O(V+E)** |
| 查边 | **O(1)** | O(度) |
| 遍历邻居 | O(n) | **O(度)** |
| 建图 | O(n²+m) | O(V+E) |

::right::

<div class="text-center text-xl font-bold mb-3 text-purple-600">选型与算法</div>

| 维度 | 矩阵 | 邻接表 |
| --- | --- | --- |
| 适合图 | 稠密 | **稀疏** |
| Floyd | ✅ | — |
| BFS/DFS | — | ✅ |
| Dijkstra | — | ✅ |
| Kruskal | 边集数组 | 边集数组 |

::bottom::

<div v-click class="mt-4 text-center text-lg">

🎯 **稠密选矩阵、稀疏选表、按边遍历选边集数组**

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
核心对比表。矩阵赢查边、表赢空间和遍历邻居。记住一句话选型口诀。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 有向 / 无向 / 带权怎么存

::left::

**有向图**（只存出边）

```js
for (const [u,v] of edges) {
  adj[u].push(v);    // 没有 adj[v]
  inDeg[v]++;        // 顺便统计入度
}
```

**无向图**（双向各存一次）

```js
for (const [u,v] of edges) {
  adj[u].push(v);
  adj[v].push(u);    // 必须再存一次
}
```

::right::

**带权图**（存权重）

```js
// 邻接表：[邻居, 权重]
for (const [u,v,w] of edges) {
  adj[u].push([v, w]);
}
// 邻接矩阵：a[u][v]=w，无边 Infinity
```

<div v-click class="mt-3 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm border-l-4 border-red-500">

⚠️ **无向图边只存一次**是最高频 bug——图会变成有向、边数对不上。

</div>

::bottom::

<div v-click class="mt-3 text-center">

💡 带权矩阵对角线 `0`、无边 `Infinity`；自环 `a[v][v]`、重边需按题意处理。

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
有向只存出边；无向双向存（最易错）；带权表存[邻居,权重]，矩阵存权重。
-->

---

# 选型决策树

```
图的表示选型
│
├─ 稠密图（m ≈ n²）？
│    └─ 是 → 邻接矩阵
│
├─ 要 O(1) 判边？或用 Floyd？
│    └─ 是 → 邻接矩阵
│
├─ 按边遍历型？（Kruskal / Bellman-Ford）
│    └─ 是 → 边集数组（常与邻接表并用）
│
└─ 否（稀疏 + 按顶点遍历）
     └─ 邻接表（默认首选，90% 场景）
```

<div v-click class="mt-6 grid grid-cols-3 gap-4">
<div class="p-3 rounded bg-blue-50 dark:bg-blue-900/20 text-center">

**矩阵**<br>稠密 · O(1) 判边 · Floyd

</div>
<div class="p-3 rounded bg-green-50 dark:bg-green-900/20 text-center">

**邻接表**<br>稀疏 · BFS/DFS · Dijkstra

</div>
<div class="p-3 rounded bg-purple-50 dark:bg-purple-900/20 text-center">

**边集数组**<br>Kruskal · Bellman-Ford

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
pre { font-size: 0.82em; }
</style>

<!--
选型决策树。默认邻接表；稠密或要 O(1) 判边或 Floyd 才用矩阵；按边遍历用边集数组。
-->

---
layout: center
class: text-center
---

# 图存好，才能跑算法

<div class="text-2xl mt-8 mb-12">

稠密选矩阵 · 稀疏选表 · 按边选边集数组

</div>

<v-click>

<div class="text-lg">

邻接表是默认选择 · BFS / DFS / Dijkstra / Prim / Kruskal 都建立在「图已存好」之上

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/graph" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/graph-representation-slide/" target="_blank" class="text-xl icon-btn">
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
本叶是图算法的前置——图怎么存。掌握三种表示法的时空权衡与选型，后续图算法才有根基。
-->
