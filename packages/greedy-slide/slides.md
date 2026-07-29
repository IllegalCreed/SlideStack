---
theme: seriph
background: https://images.unsplash.com/photo-1614032686099-e648d6dea9b3?w=2048
title: 贪心算法
info: |
  ## 贪心算法（Greedy Algorithm）
  局部最优 → 全局最优 · 不回退 · 快但有前提
  算法世界里「最值得小心」的思想。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 贪心算法

局部最优 · 不回退 · 快但有前提的赌博

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/quick-sort" target="_blank" class="icon-btn">
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
贪心是最「直觉」但最「危险」的算法：快如闪电，但没证明就可能在赌。今天讲透它的思想、成立条件和经典模型。
-->

---
transition: fade-out
---

# 贪心是什么

每一步都做**当前最优**的选择，**不回退、不枚举**，赌局部最优叠加成全局最优。

<v-clicks>

- **核心权衡**：O(n log n) 极快 ✅  vs  不一定正确 ❌（需证明）
- **关键前提**：必须证明「贪心选择性质」——局部最优能推出全局最优
- **两步套路**：排序（键是灵魂）+ 一个 for 循环（选或不选）
- **本质**：把「全局最优化」降级为「一系列局部最优化的叠加」

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：只看眼前、一条路走到底——对了极快，错了彻底错。

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
贪心放弃「比较所有可能」换取速度，这个取舍必须靠贪心选择性质的证明来兜底。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 成立两条件（缺一不可）

::left::

<div class="text-center text-xl font-bold mb-3 text-blue-600">① 贪心选择性质</div>

全局最优解可由**局部最优选择**组成

<v-clicks>

- 即「第一步贪心选择安全」
- 存在某最优解，它第一步就做了贪心选择
- 这是贪心区别于 DP 的关键

</v-clicks>

::right::

<div class="text-center text-xl font-bold mb-3 text-purple-600">② 最优子结构</div>

贪心选择后，子问题最优解 + 该选择 = 原问题最优解

<v-clicks>

- 即「之后每步都安全地递归」
- 贪心与 DP 共享此性质
- 子问题独立、可组合

</v-clicks>

::bottom::

<div v-click class="mt-6 text-center">

🎯 **两个都成立 → 贪心正确**；DP 只需最优子结构（因它枚举所有选择）

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
两个条件缺一不可。记：贪心选择性质管「第一步」，最优子结构管「之后每步」。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 贪心 vs DP：一条路 vs 枚举

::left::

<div class="text-center text-xl font-bold mb-3 text-blue-600">贪心</div>

| 维度 | 值 |
| --- | --- |
| 决策 | 只选当前最优，**不回退** |
| 前提 | 贪心选择性质 + 最优子结构 |
| 正确性 | **不一定对**（需证明） |
| 复杂度 | **O(n log n)** ✅ |

::right::

<div class="text-center text-xl font-bold mb-3 text-purple-600">DP</div>

| 维度 | 值 |
| --- | --- |
| 决策 | 枚举**所有选择**择优 |
| 前提 | 最优子结构 + 重叠子问题 |
| 正确性 | 一定最优 ✅ |
| 复杂度 | O(n²) ~ O(n³) |

::bottom::

<div v-click class="mt-6 text-center text-lg">

🎯 **取舍**：能证明局部 ⇒ 全局用贪心（快）；证不出或有反例用 DP（保底）

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
这是核心对比。贪心快但有前提，DP 慢但保底。工程上贪心先试，错了上 DP。
-->

---

# 正确性证明：交换论证

把最优解 OPT **逐步替换**成贪心解 GREEDY，每步不劣化 → GREEDY 也最优。

<v-clicks>

- **①** 设 OPT 为最优解，GREEDY 为贪心解
- **②** 找 OPT 与 GREEDY **第一个不同的选择**
- **③** 用 GREEDY 的选择替换 OPT 的，证替换后仍**合法**
- **④** 证替换后目标函数**不劣化**
- **⑤** 反复替换至 OPT = GREEDY，故 GREEDY 最优

</v-clicks>

<div v-click class="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

**实例**（活动选择）：`g₁.end ≤ o₁.end`（贪心选结束最早的），用 `g₁` 替换 OPT 的 `o₁` 后仍不冲突、活动数不减 → 归纳得贪心解最优。

</div>

<div v-click class="mt-2 text-center text-sm">

⚠️ 「看起来对」≠「证明对」——没证明就写贪心，极可能挂

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
交换论证是贪心证明的首选。掌握「替换后合法 + 不劣化」两步，绝大多数证明都能搞定。
-->

---

# 活动选择 / 区间调度

n 个区间选**最多**互不重叠——**按结束时间排序**，不冲突就选。

<div class="grid grid-cols-2 gap-6">
<div>

```js {all|1|2-3|5-8|all}
function select(acts) {
  acts.sort((a, b) => a.end - b.end);
  const res = [acts[0]];
  let lastEnd = acts[0].end;
  for (let i = 1; i < acts.length; i++) {
    if (acts[i].start >= lastEnd) {
      res.push(acts[i]); lastEnd = acts[i].end;
    }
  }
  return res;
}
```

</div>
<div>

**为什么按结束时间**

<v-clicks>

- 结束越早，给后面留时间越多
- 按开始时间 / 时长排序都**错**

</v-clicks>

<div v-click class="mt-3 p-2 rounded bg-green-50 dark:bg-green-900/20 text-sm">

✅ 复杂度 **O(n log n)** —— 贪心的 Hello World

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
pre { font-size: 0.72em; }
</style>

<!--
活动选择是贪心入门题。灵魂是按结束时间排序——这个选择能用交换论证证明正确。
-->

---

# 跳跃游戏 II（最少跳跃）

每位置最大跳力 `nums[i]`，求到末尾**最少几跳**——扫最远可达，越过边界就再跳。

<div class="grid grid-cols-2 gap-6">
<div>

```js
function jump(nums) {
  let steps = 0, end = 0, maxReach = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    maxReach = Math.max(maxReach, i + nums[i]);
    if (i === end) { steps++; end = maxReach; }
  }
  return steps;
}
```

</div>
<div>

**贪心直觉**

<v-clicks>

- 在「当前一跳范围内」找下一跳最远点
- 贪心地最大化每跳覆盖范围
- **无需排序**，O(n) 一次扫描

</v-clicks>

<div v-click class="mt-3 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ 跳跃游戏**不排序**，排序反而错

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
跳跃游戏的贪心不是排序，而是扫最远可达。维护 maxReach，越过 end 就再跳一次。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 分发糖果 & Huffman 编码

::left::

**分发糖果**（双向扫描）

相邻评分高糖更多，约束是**双向**的：

```js
const c = Array(n).fill(1);
for (let i = 1; i < n; i++)
  if (r[i] > r[i-1]) c[i] = c[i-1] + 1;
for (let i = n-2; i >= 0; i--)
  if (r[i] > r[i+1])
    c[i] = Math.max(c[i], c[i+1] + 1);
```

- 右→左取 **max**（不能覆盖）
- O(n)

::right::

**Huffman 编码**（优先队列）

低频字符放深处（编码长）：

```js
while (heap.size > 1) {
  const a = heap.pop();      // 最小频率
  const b = heap.pop();      // 次小频率
  heap.push({
    freq: a.freq + b.freq,
    left: a, right: b
  });
}
```

- 每次合并两个最小频率
- O(n log n)

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.62em; }
p { font-size: 0.85em; }
ul { font-size: 0.85em; }
</style>

<!--
分发糖果靠双向扫描满足双向约束；Huffman 靠优先队列每次合并最小频率——都是贪心典范。
-->

---

# 图算法的贪心内核

Dijkstra / Prim / Kruskal 虽「大」，但**本质都是贪心**——每步做当前最优且不回退。

| 算法 | 贪心选择 | 前提 |
| --- | --- | --- |
| **Dijkstra** | 未确定点中距离最小的 | 边权非负 |
| **Prim** | 横切边中最短的 | 连通图 |
| **Kruskal** | 边权升序逐条加 | 并查集判环 |

<div v-click class="mt-6 grid grid-cols-2 gap-6">
<div class="p-3 rounded bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">

**贪心成立（排序 + 选择）**

<v-clicks>

- 活动选择 ✅
- 分数背包（可分割）✅
- 标准币制找零 ✅

</v-clicks>

</div>
<div class="p-3 rounded bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">

**贪心失效 → 用 DP**

<v-clicks>

- 非标准币制（1/3/4）❌
- 0-1 背包（不可分割）❌
- 负权图 Dijkstra ❌

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
table { font-size: 0.82em; }
ul { font-size: 0.82em; }
</style>

<!--
大算法的本质是贪心。记住哪些贪心成立、哪些失效——失效的换 DP。
-->

---
layout: center
class: text-center
---

# 贪心：快如闪电，但有前提

<div class="text-2xl mt-8 mb-12">

局部最优 → 全局最优 · 不回退 · O(n log n)

</div>

<v-click>

<div class="text-lg">

证明成立 → 贪心（快） · 证不出或有反例 → DP（保底）

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/quick-sort" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 排序
  </a>
  <a href="/SlideStack/greedy-slide/" target="_blank" class="text-xl icon-btn">
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
贪心是算法世界里最值得小心的思想。掌握了「证明 + 策略 + 经典模型」，贪心就是利器。
-->
