---
theme: seriph
background: https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=2048
title: 并查集
info: |
  ## 并查集（Union-Find / DSU）
  不相交集合 · find / union · 近乎 O(1)
  连通性与等价类的首选利器。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 并查集

不相交集合 · find/union · 近乎 O(1) 的连通性利器

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/union-find" target="_blank" class="icon-btn">
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
并查集是管理「不相交集合」的树型结构，今天讲透它的核心模型、两大优化和工程应用。
-->

---
transition: fade-out
---

# 并查集是什么

一种管理**一组不相交集合**的树型结构，只做两件事：**find** 与 **union**。

<v-clicks>

- **核心思想**：用一棵树表示一个集合，**树根（代表元）**标识这个集合
- **同组判断**：`find(x) === find(y)` ⇔ x、y 在同一集合
- **只合不分**：支持合并两集合，不支持拆分（这是它最大的硬伤）
- **近乎 O(1)**：路径压缩 + 按秩合并后，每次操作均摊 **O(α(n))**

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：判断两元素是否同属一类，并查集把每次 O(n) 降到近乎 O(1)。

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
并查集的一切都源于「用树表示集合、根作代表元」这个朴素思想。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# parent 数组：一棵树的表示

::left::

`parent[i]` 存 `i` 的父节点，**根 `parent[root] === root`**（自指）。

```
下标 i:    0   1   2   3   4
parent:  [ 0,  0,  1,  2,  4 ]
```

<v-clicks>

- `0`：parent=0 → **根**（集合 {0,1,2,3}）
- `1→0`、`2→1→0`、`3→2→1→0`：根都是 0
- `4`：parent=4 → **根**（集合 {4}）

</v-clicks>

::right::

**初始化**：每元素自成一组

```js
function init(n) {
  const p = new Array(n);
  for (let i = 0; i < n; i++)
    p[i] = i;        // 自己是自己的根
  return p;
}
```

<div v-click class="mt-4 text-center text-sm">

初始 **n 个独立集合**，每个集合只有一个元素

</div>

::bottom::

<div v-click class="mt-4 text-center text-lg">

🎯 只用一个 `parent` 数组就能表示整个森林——无需树节点

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
parent 数组是并查集的全部存储。根的标志是 parent[root]===root，这是所有逻辑的起点。
-->

---

# find 与 union：找代表元与合并

<div class="grid grid-cols-2 gap-8">
<div>

**find(x)**：沿 parent 找根

```js
function find(p, x) {
  while (p[x] !== x)
    x = p[x];      // 往上走
  return x;        // 返回根
}
```

返回 `x` 所属集合的**代表元**

</div>
<div>

**union(x,y)**：合并两集合

```js
function union(p, x, y) {
  const rx = find(p, x);
  const ry = find(p, y);
  if (rx !== ry) p[rx] = ry; // 根挂根
}
```

</div>
</div>

<div v-click class="mt-4 p-4 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

⚠️ **union 前必须先 find 两个根**——直接 `parent[x]=y` 只搬一个节点，整棵子树不会跟着走，破坏「同集合根相同」不变量。

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
find 找根、union 把根挂到根下。关键：必须 find 两根，整棵子树才一起迁移。
-->

---

# 朴素实现的退化问题

每次 `parent[rootX]=rootY` 直接挂，输入不幸时树退化成**链**。

<div class="grid grid-cols-2 gap-8">
<div>

依次 `union(0,1),(1,2),...,(n-2,n-1)`：

```
0 ← 1 ← 2 ← 3 ← ... ← n-1
（一条链，根是 0）
```

<v-clicks>

- `find(n-1)` 要一路走到 0 → **O(n)**
- n 次 find 总共 **O(n²)**

</v-clicks>

</div>
<div>

<div v-click class="p-4 rounded bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">

**比直接用数组还慢！**

</div>

<div v-click class="mt-4">

**两条解药（同时用才到 O(1)）**：

- 路径压缩：治「已变长的路径」
- 按秩/按大小合并：治「还在变长的树」

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
退化为链是朴素并查集的噩梦。两大优化一个治标、一个治本，必须同时用。
-->

---

# 路径压缩：find 时挂到根

既然都要 find 到根，不如顺手把沿途节点**直接挂到根下**。

<div class="grid grid-cols-2 gap-8">
<div>

**递归版（推荐，一行压平）**

```js
function find(p, x) {
  if (p[x] !== x)
    p[x] = find(p, p[x]); // 挂到根
  return p[x];
}
```

回溯时整条路径所有节点都接到根

</div>
<div>

<v-clicks>

- **效果**：树越来越扁平
- 查询越多 → 树越平 → 后续越快
- 单用路径压缩：**O(log n)** 均摊

</v-clicks>

<div v-click class="mt-4 p-3 rounded bg-green-50 dark:bg-green-900/20 text-sm">

下次查这些节点，**一步到根** → O(1)

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
路径压缩是「事后补救」。递归一行就能把整条路径压平，下次查询接近 O(1)。
-->

---

# 按秩合并：矮树挂高树

合并时把**矮树挂到高树下**，控制树高增长。

<div class="grid grid-cols-2 gap-8">
<div>

```js
function union(p, rank, x, y) {
  const rx = find(p, x), ry = find(p, y);
  if (rx === ry) return;
  if (rank[rx] < rank[ry]) p[rx] = ry;
  else if (rank[rx] > rank[ry])
    p[ry] = rx;
  else { p[rx] = ry; rank[ry]++; }
}
```

</div>
<div>

<v-clicks>

- **rank**：树高的上界（不下调）
- 只有「等高合并」树高才 +1
- 树高最多 **log₂ n**

</v-clicks>

<div v-click class="mt-4 p-3 rounded bg-purple-50 dark:bg-purple-900/20 text-sm">

**按大小合并**（小挂大）效果等价，还能直接读集合元素数 → 工程更常用

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
pre { font-size: 0.7em; }
</style>

<!--
按秩合并是「事前预防」。矮挂高保证树高 O(log n)。按大小合并更直观、工程更常用。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 均摊 O(α(n)) ≈ O(1)：阿克曼反函数

::left::

**两者结合** → 每次操作 **O(α(n))**

| 优化 | 复杂度 |
| --- | --- |
| 朴素 | O(n) ❌ |
| 仅路径压缩 | O(log n) |
| 仅按秩/大小 | O(log n) |
| **两者结合** | **O(α(n))** ✅ |

::right::

**α(n) = 阿克曼反函数**

<v-clicks>

- 增长**极慢**
- n ≤ 10⁸⁰ 时 **α(n) < 5**
- 实际就是常数

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-green-50 dark:bg-green-900/20 text-sm">

10⁸⁰ > 宇宙原子总数，所以任何实际 n 都是 **事实上的 O(1)**

</div>

::bottom::

<div v-click class="mt-4 text-center text-lg">

⚡ Tarjan（1975）的证明：数据结构里最美的结果之一

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
两大优化结合到 O(α(n))。阿克曼反函数增长极慢，实际就是 O(1)。
-->

---

# 应用：连通分量与 Kruskal

<div class="grid grid-cols-2 gap-8">
<div>

**连通分量计数**

```js
let count = n;
for (const [u, v] of edges)
  if (union(u, v)) count--;
// count = 连通分量数
```

<v-clicks>

- 边 union 两端
- 剩余集合数 = 分量数

</v-clicks>

</div>
<div>

**Kruskal 最小生成树**

```js
edges.sort((a, b) => a[2] - b[2]);
for (const [u, v, w] of edges)
  if (find(u) !== find(v)) { // 判环
    union(u, v); total += w;
  }
```

<v-clicks>

- 边排序 + 贪心加边
- find 同根 = 成环，跳过

</v-clicks>

</div>
</div>

<div v-click class="mt-3 p-3 rounded bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-sm">

🎯 **通用套路**：朋友圈/岛屿等价类、无向图判环、冗余连接——都是「find 同根判连通 + union 合并」的变体

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
连通分量和 Kruskal 是并查集最经典的应用。核心都是 find 同根判连通。
-->

---
layout: center
class: text-center
---

# 并查集：连通性问题的最优解

<div class="text-2xl mt-8 mb-12">

parent 数组 · 路径压缩 + 按秩合并 → 近乎 O(1)

</div>

<v-click>

<div class="text-lg">

连通分量 · Kruskal · 朋友圈 · 岛屿 · 冗余连接 都靠它

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/union-find" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/union-find-slide/" target="_blank" class="text-xl icon-btn">
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
并查集用最少的代码换取最大的性能。掌握了 find/union 和两大优化，连通性问题就有了最优解。
-->
