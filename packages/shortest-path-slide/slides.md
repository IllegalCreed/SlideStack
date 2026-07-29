---
theme: seriph
background: https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=2048
title: 最短路径算法
info: |
  ## 最短路径算法（Shortest Path）
  Dijkstra · Bellman-Ford · SPFA · Floyd-Warshall
  图论里最核心的一类问题。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 最短路径算法

Dijkstra · Bellman-Ford · SPFA · Floyd-Warshall

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/dijkstra" target="_blank" class="icon-btn">
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
最短路径是图论的核心问题。今天讲透松弛操作与四大算法的适用边界。
-->

---
transition: fade-out
---

# 单源 vs 全源

带权图里求**权和最小**的路径，按求几个点对分两类。

<v-clicks>

- **单源最短路（SSSP）**：源点 `s` 到其他**所有点** —— Dijkstra / Bellman-Ford / SPFA
- **全源最短路（APSP）**：**任意两点间** —— Floyd-Warshall
- **权的关键分野**：非负权 → Dijkstra；**可负权** → Bellman-Ford/SPFA
- **负权环**：可达的权值和为负的环 → 绕圈无限变小 → 最短路无定义，只能判环

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：选型看「单源还是全源」「有没有负权」「图多大」三个维度。

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
两类问题、权的正负是选型的两个首要维度。
-->

---

# 松弛操作：四算法的共同内核

所有最短路算法本质都是用不同策略执行同一个松弛操作。

```js
// 松弛边 (u, v, w)：尝试用「经 u 到 v」更新 d[v]
function relax(u, v, w) {
  if (d[u] + w < d[v]) {     // 发现更短路径
    d[v] = d[u] + w;          // 更新
    prev[v] = u;              // 记前驱，还原路径
  }
}
```

<v-clicks>

- **根基**：最短路的子路径也是最短路（最优子结构）
- **四种算法的差异** = 松弛「哪些边 / 几轮 / 什么顺序」

</v-clicks>

<div v-click class="mt-4 text-center text-sm text-gray-500">

Dijkstra 贪心选最近 · BF 暴力 V−1 轮 · SPFA 队列优化 · Floyd 三重循环 DP

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
松弛是内核。四种算法只是松弛策略的组合。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# Dijkstra：贪心 + 堆优化

::left::

**思想**：每轮取 `d[]` 最小的未确定点，一次性确定，松弛其出边。

```js
d[s] = 0; heap = [[0, s]];
while (heap.length) {
  const [, u] = popMin(heap);
  if (visited[u]) continue;
  visited[u] = true;        // 确定 u
  for ([v, w] of g[u])
    if (d[u]+w < d[v]) {
      d[v] = d[u]+w;
      heap.push([d[v], v]);
    }
}
```

::right::

**前提：边权非负**

<v-clicks>

- 复杂度 **O((V+E)logV)**
- 非负权保证「先确定的最优」
- 朴素数组版 O(V²) 适合稠密图
- 路径还原：沿 `prev[]` 回溯

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-green-50 dark:bg-green-900/20 text-sm">

✅ GPS 导航、OSPF 网络路由的内核

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
Dijkstra 贪心：非负权下 d 最小的未确定点可一次性确定。
-->

---

# Dijkstra 为何不能负权

贪心假设「`d[]` 最小的未确定点可一次性确定」——负权会打破它。

<div class="grid grid-cols-2 gap-6">
<div>

**反例**

```
s --2--> a
s --3--> b
b --(-4)--> a
```

正确：s→b→a = 3+(−4) = **−1**

</div>
<div>

**Dijkstra 执行**

<v-clicks>

- 取 s：d[a]=2, d[b]=3
- 取 a（d=2 最小）→ **确定 a=2**
- 但真实是 −1，已锁死 ❌

</v-clicks>

</div>
</div>

<div v-click class="mt-6 p-4 rounded bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500">

**根因**：负边让「后面经 b 到 a 更短」成为可能，而 a 已 `visited` 不再更新。**遇负权必须换 Bellman-Ford/SPFA**。

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
负权让贪心失效：先确定的不一定最优。这是最高频考点。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# Bellman-Ford 与 SPFA：可负权、判负环

::left::

**Bellman-Ford**：松弛所有边 V−1 轮

```js
for (i = 1; i < n; i++)        // V-1 轮
  for ([u,v,w] of edges)
    if (d[u]+w < d[v])
      d[v] = d[u]+w;
// 第 V 轮仍能松弛 → 负环
for ([u,v,w] of edges)
  if (d[u]+w < d[v]) 负环！
```

复杂度 **O(VE)**

::right::

**SPFA**（队列优化 BF）

<v-clicks>

- 只把「`d[]` 刚变小的点」入队
- 出队时松弛其出边
- 新更新的再入队
- 平均 O(E)，最坏 O(VE)
- 入队次数 ≥ V → 负环

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ SPFA 易被构造数据卡，竞赛求稳用 BF

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
BF 暴力 V-1 轮可负权判负环；SPFA 是队列优化版。
-->

---

# Floyd-Warshall：全源三重循环 DP

依次以每个点 `k` 为中转，松弛所有点对。

```js
for (let k = 0; k < n; k++)        // 中转点在最外层！
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (dp[i][k] + dp[k][j] < dp[i][j])
        dp[i][j] = dp[i][k] + dp[k][j];
// dp[i][i] < 0 → 经过 i 的负环
```

<div class="grid grid-cols-2 gap-6 mt-4">
<div>

<v-clicks>

- 状态：`dp[i][j]` = i→j 最短路
- 复杂度 **O(V³)** 时间 **O(V²)** 空间
- 能处理负权（无负环）

</v-clicks>

</div>
<div>

<v-clicks>

- 适合 **V ≤ 500** / 稠密图
- 传递闭包：`min/+` 换 `||/&&`
- `k` 必须在最外层（DP 阶段）

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
pre { font-size: 0.78em; }
</style>

<!--
Floyd 三重循环 DP 全源，k 在最外层是关键，只适合小图。
-->

---

# 四算法选型表

| 场景 | 权 | 首选 | 复杂度 |
| --- | --- | --- | --- |
| 单源 | 非负权 | **Dijkstra** | O((V+E)logV) |
| 单源 | 可负权 | **Bellman-Ford** | O(VE) |
| 判负环 | 可负权 | **BF / SPFA** | O(VE) |
| 全源 | 稠密 / V 小 | **Floyd** | O(V³) |
| 全源 | 稀疏 / V 大 | **V 次 Dijkstra** | O(V(V+E)logV) |

<div v-click class="mt-5 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-sm">

**口诀**：非负单源 → Dijkstra；负权/判环 → BF/SPFA；全源小图稠密 → Floyd。

</div>

<div v-click class="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-xs">

⚠️ Dijkstra 遇负权算错 · Floyd 跑大图超时 · SPFA 易被卡成 O(VE)

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
选型表要记熟。三个常见坑：Dijkstra负权、Floyd大图、SPFA被卡。
-->

---

# 典型应用

<v-clicks>

- **地图导航**：道路网（权=距离/耗时，非负）求最短路线 → Dijkstra（A\* 是带启发式升级）
- **网络路由**：OSPF 协议用 Dijkstra 算「本路由器到全网」更新路由表
- **汇率套利**：汇率取负对数当权，**负环 = 无限套利** → Bellman-Ford 判负环
- **可达性 / 依赖分析**：A 能否到 B 的传递闭包 → Floyd（稠密多次查询）
- **任务调度**：带约束的关键路径（最长路）可转最短路（权取负）或拓扑+DP

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500">

**工程价值**：Dijkstra 是 GPS/路由的内核；BF/SPFA 支撑负权金融场景；Floyd 服务全源可达性查询。

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
最短路算法的工程落地点。
-->

---
layout: center
class: text-center
---

# 一个松弛操作，四种算法

<div class="text-2xl mt-8 mb-12">

非负权 → Dijkstra · 负权 → BF/SPFA · 全源 → Floyd

</div>

<v-click>

<div class="text-lg">

选对算法 = 一半的正确性 · 选错 = 算错或超时

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/dijkstra" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/shortest-path-slide/" target="_blank" class="text-xl icon-btn">
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
核心：理解松弛操作与四算法的适用边界，选型就不慌。
-->
