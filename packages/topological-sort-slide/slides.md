---
theme: seriph
background: https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=2048
title: 拓扑排序
info: |
  ## 拓扑排序（Topological Sort）
  DAG · 入度 BFS · 后序逆序
  依赖调度的核心算法。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 拓扑排序

DAG 线性序 · O(V+E) · 依赖调度的基石

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/topological-sort" target="_blank" class="icon-btn">
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
拓扑排序是 DAG 上把偏序依赖展平成全序的核心算法，今天讲透定义、两套实现与应用。
-->

---
transition: fade-out
---

# 拓扑排序是什么

对 **DAG** 的所有顶点排成线性序列，使任意有向边 `u → v` 都满足「**u 在 v 前**」。

<v-clicks>

- **本质**：把「偏序依赖」展平成「全序执行」
- **前提**：图必须是 **DAG（有向无环图）**，有环则无解
- **判据**：能拓扑排序 ⇔ 图无环
- **序不唯一**：多个入度 0 点时选谁不同，结果分叉
- **复杂度**：**O(V+E)**（邻接表建图）
- **万物之基**：课程表 / 编译 / 任务调度 / 包管理

</v-clicks>

<div v-click class="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：边 `u→v` 要求 u 先 v 后，没约束的元素可任意排。

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
一切考点源于「拓扑能完成 ⇔ DAG」这一判据。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# DAG 前提：有环就无解

::left::

<div class="text-center text-2xl font-bold mb-4 text-green-600">DAG ✅</div>

```
   1 → 2 → 4
   ↓       ↑
   3 ──────┘
```

能拓扑排序：`1,3,2,4`

<v-click>

<div class="text-center text-sm text-gray-500 mt-2">

无环 ⇒ 存在合法线性序

</div>

</v-click>

::right::

<div class="text-center text-2xl font-bold mb-4 text-red-600">有环 ❌</div>

```
   1 → 2
   ↑    ↓
   4 ← 3
```

无法拓扑排序（环 1→2→3→4→1）

<v-click>

<div class="text-center text-sm text-gray-500 mt-2">

环要求「A 在 A 前」矛盾

</div>

</v-click>

::bottom::

<div v-click class="mt-6 text-center text-lg">

🎯 序不唯一：同时多个入度 0 点可任选 → 字典序最小用**优先队列**

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
有环就矛盾，所以「拓扑失败」本身就是环检测。
-->

---

# Kahn 算法：入度 BFS

逐层摘除入度 0 的点——像剥洋葱，出队顺序即拓扑序。

<div class="grid grid-cols-2 gap-6">
<div>

```js {all|1-4|6|7-9|all}
function kahn(n, edges) {
  const g = Array.from({length:n},()=>[]);
  const ind = new Array(n).fill(0);
  for (const [u,v] of edges){g[u].push(v);ind[v]++;}
  const q = [], order = [];
  for (let i=0;i<n;i++) if(ind[i]===0) q.push(i);
  let h=0;
  while(h<q.length){const u=q[h++];order.push(u);
    for(const v of g[u]) if(--ind[v]===0) q.push(v);}
  return order; // length<n ⇒ 有环
}
```

</div>
<div>

**三步走**

<v-clicks>

- ① 算所有点入度
- ② 入度 0 的入队
- ③ 出队 → 摘边（邻居入度减 1）
- 邻居入度归 0 → 入队
- 重复至队空

</v-clicks>

<div v-click class="mt-3 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ `order.length < n` ⇒ **有环**

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
pre { font-size: 0.62em; }
</style>

<!--
Kahn：入度0即可安全输出，删边模拟前置完成。判环看出队数。
-->

---

# DFS：后序逆序

递归到底再记录，倒过来就是拓扑序。

<div class="grid grid-cols-2 gap-6">
<div>

```js {all|1-3|5-9|11|all}
function dfsTopo(n, edges) {
  const g = Array.from({length:n},()=>[]);
  for (const [u,v] of edges) g[u].push(v);
  const c = new Array(n).fill(0), ord=[];
  let cycle=false;
  function dfs(u){c[u]=1;
    for(const v of g[u]){if(c[v]===1){cycle=true;return;}
      if(c[v]===0) dfs(v);}
    c[u]=2; ord.push(u);}     // 后序记录
  for(let i=0;i<n;i++) if(c[i]===0) dfs(i);
  return cycle?[]:ord.reverse();
}
```

</div>
<div>

**三色标记判环**

<v-clicks>

- 🟦 白(0) 未访问
- 🟨 灰(1) 访问中（在栈）
- ⬛ 黑(2) 已完成

</v-clicks>

<v-clicks>

- 后序：先递归邻居再记录自己
- 翻转后序 = 拓扑序
- 遇「灰」邻居 = **回边 = 环**

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
pre { font-size: 0.6em; }
</style>

<!--
DFS 后序保证被依赖点先记录，翻转即拓扑序。灰邻居=回边=环。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# 环检测：拓扑失败即有环

::left::

<div class="text-center text-2xl font-bold mb-4 text-blue-600">Kahn 判环</div>

```js
const order = kahn(n, edges);
const hasCycle =
  order.length < n; // 出队数<V
```

<v-clicks>

- 出队数 == V ⇒ 无环
- 出队数 < V ⇒ **有环**
- 剩下的点互相依赖成环

</v-clicks>

::right::

<div class="text-center text-2xl font-bold mb-4 text-purple-600">DFS 判环</div>

```js
// 灰邻居 = 回边 = 环
if (color[v] === 1)
  return true; // 灰=访问中
```

<v-clicks>

- 单 visited 会**漏判环**
- 必须三色区分灰/黑
- 灰邻居绕回祖先 = 环

</v-clicks>

::bottom::

<div v-click class="mt-6 text-center text-lg">

⚡ 拓扑排序顺带完成判环，无需额外算法

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
判环：Kahn看出队数，DFS看灰邻居。两者都O(V+E)。
-->

---

# 课程表：LeetCode 207 / 210

`prerequisites[i]=[a,b]` 表示「修 a 先修 b」⇒ 画边 **b → a**。

<div class="grid grid-cols-2 gap-6">
<div>

**207 能否修完 = 判环**

```js
function canFinish(n, pre) {
  const order = findOrder(n, pre);
  return order.length === n;
}
```

**210 修课顺序 = 拓扑序**

```js
// 有环返回空数组
return order.length === n
  ? order : [];
```

</div>
<div>

<div class="p-3 rounded bg-red-50 dark:bg-red-900/20 text-sm">

⚠️ **建图方向陷阱**

</div>

<v-clicks>

- `[a,b]` = 修 a 先修 b
- b 是 a 的前置
- 画 `g[b].push(a)`，`ind[a]++`
- 画反会得到错序

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-green-50 dark:bg-green-900/20 text-sm">

✅ `b → a`：b 入度不变，a 入度增

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
pre { font-size: 0.68em; }
</style>

<!--
课程表是拓扑排序的高频题。关键是建图方向：[a,b]画 b→a。
-->

---

# 编译依赖与任务调度

拓扑序天然给出「先依赖后使用」的处理顺序。

<div class="grid grid-cols-2 gap-6">
<div>

**编译/构建顺序**

<v-clicks>

- make：目标依赖源文件
- webpack：模块图打包
- 「循环依赖」报错 = 拓扑失败

</v-clicks>

**任务调度**

<v-clicks>

- 串行：拓扑序即执行序
- 并行：每轮处理所有入度 0 点
- 总轮数 = 最长路径长度

</v-clicks>

</div>
<div>

**包管理安装序**

<v-clicks>

- npm/pip/maven 解析依赖
- 底层库先于上层库
- 环 = 版本冲突

</v-clicks>

<div v-click class="mt-3 p-3 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

**关键路径（AOE 网）**：带权 DAG 的**最长路径** = 工程最短工期；按拓扑序 DP `ve[v]=max(ve[u]+w)`，关键活动延迟则拖延全局。

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
编译、调度、包管理都是依赖建模；带权升级到关键路径求最长路。
-->

---
layout: center
class: text-center
---

# 拓扑排序是依赖调度的核心

<div class="text-2xl mt-8 mb-12">

DAG 线性序 → O(V+E) → 一举两得判环

</div>

<v-click>

<div class="text-lg">

Kahn（入度 BFS） · DFS（后序逆序） · 课程表 · 编译 · 关键路径

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/topological-sort" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/topological-sort-slide/" target="_blank" class="text-xl icon-btn">
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
掌握 Kahn 与 DFS 两套实现，加上环检测与依赖调度应用，拓扑排序全叶打通。
-->
