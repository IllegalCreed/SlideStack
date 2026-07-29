---
theme: seriph
background: https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=2048
title: 回溯算法
info: |
  ## 回溯算法（Backtracking）
  DFS + 撤销选择 · 剪枝 · 求所有解
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 回溯算法

DFS + 撤销选择 · 有组织可剪枝的暴力枚举

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/n-queens" target="_blank" class="icon-btn">
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
回溯是组合搜索的万能解法。今天讲透它的核心三步、解空间树、剪枝与经典问题。
-->

---
transition: fade-out
---

# 回溯是什么

在**解空间树**上做 **DFS**，走到死路就**撤销上一步选择**回退换分支。

<v-clicks>

- **本质**：有组织 + 可剪枝的**暴力枚举**
- **三步**：**选 → 递归 → 撤销**（撤销是灵魂）
- **与暴力区别**：边走边判，发现无解立刻回退
- **典型题**：全排列 / 组合 / 子集 / N 皇后 / 数独
- **复杂度**：指数级 O(2ⁿ) 或 O(n!)

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：DFS 一条路走到黑，不通就撤销回上一层换条路再走。

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
核心：撤销选择让兄弟分支在干净状态上尝试，这是回溯和普通 DFS 的关键。
-->

---

# 解空间树：子集树 vs 排列树

识别树型 = 定模板。

<div class="grid grid-cols-2 gap-8">
<div>

<div class="text-center text-xl font-bold mb-2 text-blue-600">子集树（2ⁿ 叶）</div>

每层「选 / 不选」某元素

```js
// 子集/组合：用 start 往后选
const dfs = (start) => {
  res.push([...path]);
  for (let i = start; i < n; i++) {
    path.push(a[i]);
    dfs(i + 1);
    path.pop();
  }
};
```

适用：子集、组合、凑数

</div>
<div>

<div class="text-center text-xl font-bold mb-2 text-purple-600">排列树（n! 叶）</div>

每层从剩余元素挑一个

```js
// 全排列：用 used 标记已用
const dfs = () => {
  if (path.length === n) { res.push([...path]); return; }
  for (let i = 0; i < n; i++) {
    if (used[i]) continue;
    used[i] = true; path.push(a[i]);
    dfs();
    path.pop(); used[i] = false;
  }
};
```

适用：排列、N 皇后

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
选 start 还是 used？顺序无关用 start，区分顺序用 used。
-->

---

# 通用模板：选 / 递归 / 撤销

所有回溯题都套这个骨架，只改三处。

```js
function backtrack(path, state) {
  if (满足结束条件) {           // 1. 叶子：记录答案
    res.push([...path]);        //    浅拷贝！
    return;
  }
  for (选择 of 选择列表) {       // 2. 遍历合法选择
    if (剪枝条件) continue;     //    剪枝：跳过无解分支
    做选择;                     //    path.push / used=true
    backtrack(path, 新state);   // 3. 递归
    撤销选择;                   // 4. 恢复（缺一不可）
  }
}
```

<v-click>

<div class="mt-3 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

⚠️ **三大坑**：`push([...path])` 要浅拷贝 · 做选择和撤销必须成对 · 记录后要 `return`

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
pre { font-size: 0.78em; }
</style>

<!--
四要素：结束条件、选择列表、做选择、撤销。撤销漏写是最常见 bug。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 全排列 / 组合 / 子集

::left::

**全排列**（used 数组）

```js
for (let i = 0; i < n; i++) {
  if (used[i]) continue;
  used[i] = true; path.push(a[i]);
  dfs();
  path.pop(); used[i] = false;
}
```

- 区分顺序 `[1,2]≠[2,1]`
- for 从 0 全扫

::right::

**组合 / 子集**（start 索引）

```js
for (let i = start; i < n; i++) {
  path.push(a[i]);
  dfs(i + 1);
  path.pop();
}
```

- 顺序无关，只往后选
- 天然去重

::bottom::

<div v-click class="mt-6 text-center text-lg">

🎯 口诀：**排列用 used，组合子集用 start**

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
used vs start 是回溯最高频的模板分水岭。
-->

---

# 剪枝：把无解分支提前砍掉

剪枝是回溯从「能跑」到「跑得快」的关键。

<div class="grid grid-cols-2 gap-6">
<div>

**三招**

<v-clicks>

- **约束剪枝**：递归前判合法
- **排序剪枝**：升序后超限 `break`
- **可行性预估**：剩余不够就 `return`

</v-clicks>

</div>
<div>

**组合总和剪枝**

```js
c.sort((a, b) => a - b);
for (let i = start; i < n; i++) {
  if (sum + c[i] > target) break;
  path.push(c[i]);
  dfs(i, sum + c[i]);
  path.pop();
}
```

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-sm">

⚠️ **正确性**：剪枝必须是「一定无解」的充分条件——宁可少剪不可错剪

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
剪枝只降常数不降阶。组合总和排序后用 break 不是 continue，后续更大全超限。
-->

---

# N 皇后：约束满足经典

逐行放置，三个 Set 查列与两条对角线冲突。

```js
const dfs = (row) => {
  if (row === n) { res.push(build()); return; }
  for (let col = 0; col < n; col++) {
    if (cols.has(col) || d1.has(row-col) || d2.has(row+col)) continue;
    cols.add(col); d1.add(row-col); d2.add(row+col);
    dfs(row + 1);
    cols.delete(col); d1.delete(row-col); d2.delete(row+col);
  }
};
```

<v-click>

<div class="mt-3 p-3 rounded bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-sm">

💡 **对角线妙算**：主对角线 `row-col` 相同，副对角线 `row+col` 相同——O(1) 查冲突，无需扫整条线。复杂度最坏 O(n!)。

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
pre { font-size: 0.74em; }
</style>

<!--
N 皇后是排列树（每行选一列），对角线用 row-col / row+col 编码是经典技巧。
-->

---

# 数独：回溯求一个解

逐格试 1~9，合法就填并递归，求一解用 return true 提前退出。

```js
const dfs = () => {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    if (board[r][c] !== '.') continue;
    for (let ch = '1'; ch <= '9'; ch++) {
      if (!valid(r, c, ch)) continue;   // 查行/列/3×3 宫
      board[r][c] = ch;
      if (dfs()) return true;           // 成功一路 return true
      board[r][c] = '.';                // 撤销
    }
    return false;                       // 1~9 都不行，回退
  }
  return true;
};
```

<div v-click class="mt-2 text-center text-sm text-gray-500">

剪枝进阶：每次选「**候选最少的空格**」先填（约束传播）→ Dancing Links

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
数独只求一解，所以用返回值布尔一路 return true 省掉剩余搜索。
-->

---

# 单词搜索：网格 DFS + 回溯

从匹配首字母的格子出发四方向 DFS，临时改格子标记已访问。

```js
const dfs = (i, j, k) => {
  if (k === word.length) return true;
  if (越界 || board[i][j] !== word[k]) return false;
  const tmp = board[i][j];
  board[i][j] = '#';                    // 做：标记已访问
  const found = dfs(i+1,j,k+1) || dfs(i-1,j,k+1)
             || dfs(i,j+1,k+1) || dfs(i,j-1,k+1);
  board[i][j] = tmp;                    // 撤：恢复（不能漏）
  return found;
};
```

<div v-click class="mt-3 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

⚠️ 撤销 = 把格子从 `#` 改回 `tmp`，漏写则后续路径全被错误标记为已访问。复杂度 O(m·n·4^L)。

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
网格上的回溯：标记 + 撤销同样适用。tmp 存原值，递归后还原。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 回溯 vs 动态规划

::left::

<div class="text-center text-2xl font-bold mb-4 text-blue-600">回溯</div>

- 求**所有具体方案**
- 子问题**不去重**
- 复杂度 **指数级**
- 输出一个个解

<div class="mt-2 text-sm text-gray-500">

全排列、N 皇后、数独

</div>

::right::

<div class="text-center text-2xl font-bold mb-4 text-purple-600">动态规划</div>

- 求**最优值 / 方案数**
- 子问题**记忆化去重**
- 复杂度 **多项式级**
- 输出一个数值

<div class="mt-2 text-sm text-gray-500">

背包最值、方案数、LIS

</div>

::bottom::

<div v-click class="mt-6 text-center text-lg">

🎯 口诀：**问个数/最值 → DP；列方案/求一解 → 回溯**

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
能 DP 就别回溯——DP 用记忆化把指数级压到多项式。但需列方案时只能回溯。
-->

---
layout: center
class: text-center
---

# 回溯：组合搜索的万能解法

<div class="text-2xl mt-8 mb-12">

选 → 递归 → 撤销 · 剪枝压缩空间

</div>

<v-click>

<div class="text-lg">

排列（used） · 组合子集（start） · N 皇后 · 数独 · 单词搜索

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/n-queens" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/backtracking-slide/" target="_blank" class="text-xl icon-btn">
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
掌握三步模板、识别解空间树、设计剪枝，回溯就通了。
-->
