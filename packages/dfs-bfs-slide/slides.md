---
theme: seriph
background: https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=2048
title: 图遍历（DFS / BFS）
info: |
  ## 图遍历（DFS / BFS）
  深入到底 · 逐层扩展 · 连通与最短路
  图算法的「两条腿」。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 图遍历（DFS / BFS）

深度优先 · 广度优先 · 图算法的两条腿

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/maze" target="_blank" class="icon-btn">
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
图遍历是图算法的地基。今天讲透 DFS 与 BFS 的框架、复杂度与经典应用。
-->

---
transition: fade-out
---

# 图遍历是什么

系统地访问图中**所有顶点**，核心是「**不走回头路**」——靠 `visited` 标记。

<v-clicks>

- **两种范式**：DFS（一条路走到底再回溯）/ BFS（一层一层向外扩）
- **与树遍历的区别**：图**可能有环**，必须标记 `visited`，否则死循环
- **DFS 数据结构**：递归（系统栈）或显式栈 —— 后进先出
- **BFS 数据结构**：队列 —— 先进先出，天然按层有序
- **复杂度**：邻接表 **O(V+E)**，邻接矩阵 O(V²)

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：图有环 → 必须 visited；DFS 用栈走到底，BFS 用队列层层扩。

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
图遍历的第一性原则：进入节点立刻标记 visited。这是 O(V+E) 的关键。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# DFS vs BFS

::left::

<div class="text-center text-2xl font-bold mb-4 text-blue-600">DFS 深度优先</div>

- **策略**：走到底再回溯
- **结构**：栈 / 递归
- **擅长**：找路径、判连通、探环、拓扑
- **风险**：深链图**栈溢出**

```js
function dfs(u) {
  visited[u] = true;
  for (const v of adj[u])
    if (!visited[v]) dfs(v);
}
```

::right::

<div class="text-center text-2xl font-bold mb-4 text-purple-600">BFS 广度优先</div>

- **策略**：逐层向外扩散
- **结构**：队列
- **擅长**：**无权最短路**、层序
- **关键**：层 = 到起点距离

```js
const q = [s]; visited[s] = true;
while (q.length) {
  const u = q.shift();
  for (const v of adj[u])
    if (!visited[v]) q.push(v);
}
```

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.62em; }
</style>

<!--
两者复杂度相同，区别在访问顺序：BFS 的层序让它垄断无权最短路。
-->

---

# 为什么图遍历必须 visited

树无环，沿着父→子走不会回头；图**可能有环**，不标记就死循环。

<div class="grid grid-cols-2 gap-8">
<div>

**无 visited（错误）**

```
图：A → B → C → A

A → B → C → A → B → C → A → ...
       ❌ 死循环
```

<div v-click class="mt-2 text-sm text-red-500">

环上无限绕，复杂度爆炸

</div>

</div>
<div>

**有 visited（正确）**

```
A →(标记) B →(标记) C →(标记)
                 ↓
        A 已访问，跳过 ✅
```

<div v-click class="mt-2 text-sm text-green-500">

每点只处理一次 → O(V+E)

</div>

</div>
</div>

<div v-click class="mt-6 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

**第一性原则**：进入节点立刻标记 `visited`；遇到已访问节点直接跳过。

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
visited 是图遍历的灵魂。时机错了（拖到出队才标）会重复入队，是 BFS 最高频 bug。
-->

---

# 复杂度：为什么是 O(V+E)

用 `visited` 去重后，DFS 和 BFS 代价完全相同。

<v-clicks>

- **每个顶点**进入一次（被标记时），处理它「取邻居」
- **邻接表**：所有节点度之和 = 2E，加 V 个顶点 → **O(V+E)**
- **邻接矩阵**：每顶点扫整行 V 找邻居 → **O(V²)**
- **空间**：visited 数组 + 栈/队列，最坏存 V → **O(V)**

</v-clicks>

<div class="mt-6 grid grid-cols-2 gap-6">
<div>

| 存储 | 时间 | 适用 |
| --- | --- | --- |
| 邻接表 | **O(V+E)** | 稀疏图 ✅ |
| 邻接矩阵 | O(V²) | 稠密图 |

</div>
<div>

<div v-click class="p-3 rounded bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-sm">

**结论**：邻接表 + DFS/BFS = 稀疏图最优遍历。稠密图 E≈V²，两者都是 O(V²)。

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
table { font-size: 0.85em; }
</style>

<!--
O(V+E) 的根源：visited 保证每点每边只访问常数次。邻接表取邻居是 O(度)，矩阵是 O(V)。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# DFS 框架：递归 + 迭代

::left::

**递归（最常用）**

```js
function dfs(u) {
  visited[u] = true;       // 进入即标记
  for (const v of adj[u])
    if (!visited[v]) dfs(v);
}                          // 返回 = 回溯
dfs(0);
```

<div class="mt-2 text-sm">

✅ 写法极简，递归栈即路径

</div>

::right::

**迭代（显式栈，防溢出）**

```js
const st = [0];
while (st.length) {
  const u = st.pop();
  if (visited[u]) continue; // 二次判断
  visited[u] = true;
  for (const v of adj[u])
    if (!visited[v]) st.push(v);
}
```

<div v-click class="mt-2 text-sm text-amber-600">

⚠️ 深链图（十万节点）递归会栈溢出 → 改迭代

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
递归 DFS 在深链状图上会超调用栈上限（JS 约一万层）。迭代版本把栈放在堆上，不受限。
-->

---

# BFS 框架：队列 + 层序

```js
function bfs(start) {
  const dist = new Array(V).fill(-1);
  const q = [start];
  dist[start] = 0;                 // ⚠️ 入队时标记（不是出队！）
  while (q.length) {
    const u = q.shift();
    for (const v of adj[u]) {
      if (dist[v] === -1) {        // 未访问（-1 哨兵）
        dist[v] = dist[u] + 1;     // 首次 = 最短距离
        q.push(v);                 // 入队即标记
      }
    }
  }
  return dist;                     // dist[target] = 最短边数
}
```

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click class="p-3 rounded bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-sm">

✅ **层序 = 距离**：第 k 层到起点恰 k 步，首次访问即最短

</div>
<div v-click class="p-3 rounded bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-sm">

⚠️ **visited 必须入队时标**：拖到出队会重复入队，队列膨胀

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
BFS 是无权图最短路的唯一正解。dist 数组兼做 visited 哨兵，入队时赋值。
-->

---

# 网格问题：方向数组

岛屿 / 迷宫把**格子当节点、四邻接当边**，用方向数组遍历。

<div class="grid grid-cols-2 gap-6">
<div>

**四方向数组**

```js
const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
// 上    下    左    右
```

**网格 DFS（岛屿感染）**

```js
function dfs(g, i, j) {
  if (i<0||i>=m||j<0||j>=n) return; // 越界
  if (g[i][j] !== '1') return;      // 水/已访问
  g[i][j] = '2';                    // 原地标记
  for (const [di,dj] of dirs)
    dfs(g, i+di, j+dj);
}
```

</div>
<div>

**岛屿数量（数启动次数）**

```js
function numIslands(g) {
  let cnt = 0;
  for (let i=0;i<m;i++)
    for (let j=0;j<n;j++)
      if (g[i][j]==='1') {
        dfs(g, i, j); cnt++;
      }
  return cnt;
}
```

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

🎯 **最短步数用 BFS**（层序）；**求连通块用 DFS**。`di` 是行、`dj` 是列别搞反。

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
pre { font-size: 0.6em; }
</style>

<!--
方向数组是网格遍历的统一套路：生成邻居 + 判越界/障碍/已访问。原地标记省 visited 矩阵。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 应用：连通分量与最短路

::left::

**连通分量计数**

```js
let cnt = 0;
for (let i=0;i<V;i++)
  if (!visited[i]) {
    dfs(i);          // 标记整个连通块
    cnt++;           // 启动次数 = 分量数
  }
```

<div class="text-sm mt-1">

数「启动 DFS/BFS 的次数」= 连通分量数（含不连通部分）

</div>

**拓扑排序（DAG）**

<div class="text-sm">

DFS 后序逆序 / 入度法 Kahn（取入度 0 的节点）—— 有环则无解

</div>

::right::

**无权图最短路（BFS）**

```js
dist[start] = 0;
while (q.length) {
  const u = q.shift();
  for (const v of adj[u])
    if (dist[v] === -1) {
      dist[v] = dist[u] + 1; // 最短
      q.push(v);
    }
}
```

<div class="text-sm mt-1">

层序天然给距离，**首次访问即最短**。DFS 求最短要遍历所有路径，慢且易错。

</div>

**二分图判定**

<div class="text-sm">

DFS 染色：邻居染反色，冲突（同色）则非二分图

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.64em; }
</style>

<!--
四大应用都在 DFS/BFS 之上：连通分量数启动次数、最短路用 BFS 层序、拓扑两种实现、二分图染色。
-->

---
layout: center
class: text-center
---

# DFS 与 BFS 是图算法的两条腿

<div class="text-2xl mt-8 mb-12">

visited 防环 → O(V+E) → 连通 · 最短路 · 拓扑 · 染色

</div>

<v-click>

<div class="text-lg">

求最短步数 → BFS · 找路径/探环/拓扑 → DFS（深图改迭代）

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/maze" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/dfs-bfs-slide/" target="_blank" class="text-xl icon-btn">
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
掌握了 DFS/BFS 的框架、复杂度与应用，后续带权最短路、最小生成树、强连通分量都有了根基。
-->
