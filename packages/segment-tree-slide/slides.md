---
theme: seriph
background: https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=2048
title: 线段树与树状数组
info: |
  ## 线段树与树状数组（Segment Tree & BIT）
  边改边查的 O(log n) 在线区间结构。
  前缀和/差分的「在线升级版」。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 线段树与树状数组

O(log n) 在线维护区间信息 · 边改边查

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/segment-tree" target="_blank" class="icon-btn">
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
前缀和查 O(1) 但改要 O(n) 重建；差分改 O(1) 但查要 O(n)。改查交替就退化——本讲两套 O(log n) 在线结构。
-->

---
transition: fade-out
---

# 为何需要在线结构

前缀和/差分是「**离线**」套路，改查**交替**时退化。

<v-clicks>

- **前缀和**：只读多次查 O(1)；但改一个元素要 **O(n) 重建**
- **差分数组**：多次区间改 O(1)；但查要 **O(n) 还原**
- **改查交替**场景（改一下查一下）：两者都退化到 **O(nq)**，n=q=10⁵ 时 10¹⁰ 超时
- 需要每次操作都 **O(log n)** 的「**在线**」结构

</v-clicks>

<div v-click class="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**目标**：单点改 / 区间改 / 区间查（和/最值）**全 O(log n)**，且支持边改边查。

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
核心动机：离线 O(1) 极致不够，要在 O(log n) 内同时支持改和查。
-->

---

# 线段树：分治二叉树

把数组编成二叉树，每节点管一个**区间**、存其聚合信息。

<div class="grid grid-cols-2 gap-6">
<div>

**结构**

```
        [0,7]:36
       /       \
   [0,3]:10  [4,7]:26
   /    \     /    \
 [0,1] [2,3] [4,5] [6,7]
  /\    /\    /\    /\
 0 1   2 3   4 5   6 7
```

- 数组 `tree[4n]` 存树（4n 防越界）
- 节点 `p` 的孩子：`2p` / `2p+1`

</div>
<div>

**复杂度**

- 建树：**O(n)**
- 单点改：**O(log n)**
- 区间查：**O(log n)**
- 区间改 + 懒标记：**O(log n)**

<v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

查询 `[l,r]` 被拆成 **O(log n)** 个完全覆盖的子区间

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
pre { font-size: 0.7em; }
</style>

<!--
线段树用分治把区间操作降到 O(log n)：每层至多碰 2 个边界节点，树高 log n。
-->

---

# 线段树：单点改 + 区间查

`pushUp`（回溯重算）+ 递归分治，核心 O(log n)。

<div class="grid grid-cols-2 gap-6">
<div>

**建树 + 单点改**

```js
function build(p,l,r,a){
  if(l===r){tree[p]=a[l];return;}
  const m=(l+r)>>1;
  build(2*p,l,m,a);
  build(2*p+1,m+1,r,a);
  tree[p]=tree[2*p]+tree[2*p+1];
}
// 单点改 a[idx]=val：递归到叶子，
// 回溯 pushUp 即可
```

</div>
<div>

**区间查 [ql,qr]**

```js
function query(p,l,r,ql,qr){
  if(ql<=l&&r<=qr)return tree[p];
  const m=(l+r)>>1;let s=0;
  if(ql<=m)s+=query(2*p,l,m,ql,qr);
  if(qr>m)s+=query(2*p+1,m+1,r,ql,qr);
  return s;
}
```

<v-click class="mt-2 text-sm">

完全覆盖直接返回，否则下分合并

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
pre { font-size: 0.7em; }
</style>

<!--
pushUp = tree[p]=tree[2p]+tree[2p+1]。单点改不需要 pushDown（不涉及记账）。
-->

---

# 懒标记：区间修改 O(log n)

**延迟下传**：在「完全覆盖」节点记账，不递归到叶子。

<div class="grid grid-cols-2 gap-6">
<div>

**区间加 + pushDown**

```js
function addR(p,l,r,ql,qr,v){
  if(ql<=l&&r<=qr){
    tree[p]+=v*(r-l+1);
    lazy[p]+=v;return;}
  pushDown(p,l,r);
  const m=(l+r)>>1;
  if(ql<=m)addR(2*p,l,m,ql,qr,v);
  if(qr>m)addR(2*p+1,m+1,r,ql,qr,v);
  tree[p]=tree[2*p]+tree[2*p+1];
}
```

</div>
<div>

**两条铁律**

<v-clicks>

- 下分孩子**前**必 `pushDown`
- 回溯父节点**前**必 `pushUp`

</v-clicks>

<v-click class="mt-3 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm">

⚠️ 区间加忘乘长度：`tree[p] += v×(r-l+1)` 不是 `+=v`

</v-click>

<v-click class="mt-2 text-sm text-green-600">

区间改从 O(n) 压到 **O(log n)**

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
pre { font-size: 0.66em; }
</style>

<!--
懒标记是高频考点：完全覆盖节点先记账 lazy[p]+=v，后续必须经过孩子时才 pushDown 下传。
-->

---

# 树状数组（BIT）：lowbit 前缀结构

用普通数组编码隐式二叉树，常数极小、代码极短。

<div class="grid grid-cols-2 gap-6">
<div>

**lowbit 与管辖区间**

```
lowbit(x) = x & (-x)  // 最低位的 1

tree[i] 管 [i-lowbit(i)+1, i]

i  bin   lowbit  管辖
1  0001  1       [1,1]
2  0010  2       [1,2]
4  0100  4       [1,4]
6  0110  2       [5,6]
8  1000  8       [1,8]
```

</div>
<div>

**两点铁律**

<v-clicks>

- 下标**从 1 开始**（lowbit(0)=0 死循环）
- 修改沿 `i += lowbit(i)` 上传
- 查询沿 `i -= lowbit(i)` 累加
- 区间查 = `query(r) - query(l-1)`
- 维护的信息须**可逆**（和、异或）

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
pre { font-size: 0.72em; }
</style>

<!--
BIT 用 lowbit 把二叉树塞进普通数组：i 末尾 0 越多管得越长，天然编码父子关系。
-->

---

# BIT：单点改 + 前缀查 O(log n)

~20 行的 O(log n) 在线结构。

<div class="grid grid-cols-2 gap-6">
<div>

**单点改 + 前缀查**

```js
function lowbit(x){return x&(-x);}
// 单点改 a[i]+=v
function add(i,v){
  for(;i<=n;i+=lowbit(i))tree[i]+=v;
}
// 前缀查 a[1]+...+a[i]
function query(i){
  let s=0;
  for(;i>0;i-=lowbit(i))s+=tree[i];
  return s;
}
```

</div>
<div>

**区间查 & 复杂度**

```js
// 区间 [l,r] 的和
function rangeSum(l,r){
  return query(r)-query(l-1);
}
```

<v-clicks>

- 单点改 / 前缀查：**O(log n)**
- 常数比线段树小数倍（迭代无递归）
- 空间 **n+1**（线段树要 4n）

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
pre { font-size: 0.7em; }
</style>

<!--
add 沿 i+=lowbit(i) 把末尾的 1 进位上传；query 沿 i-=lowbit(i) 抹掉末尾的 1 累加前缀。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 线段树 vs 树状数组

::left::

<div class="text-center text-2xl font-bold mb-3 text-blue-600">线段树</div>

| 维度 | 值 |
| --- | --- |
| 区间改+查 | **✅ 懒标记** |
| 维护信息 | 任意结合律 |
| 代码量 | ~100 行 |
| 空间 | 4n |
| 常数 | 较大（递归） |

::right::

<div class="text-center text-2xl font-bold mb-3 text-purple-600">树状数组</div>

| 维度 | 值 |
| --- | --- |
| 区间改+查 | ❌ 仅差分加法 |
| 维护信息 | 需**可逆** |
| 代码量 | **~20 行** |
| 空间 | **n+1** |
| 常数 | **极小** |

::bottom::

<div v-click class="mt-4 text-center">

🎯 **区间改+区间查 → 线段树；单点改+区间查、追常数 → 树状数组**

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
核心选型：线段树通用（带懒标记），树状数组轻量（常数小代码短但能力受限）。
-->

---

# 选型与应用

**选型决策树**

- 只查不改 → **前缀和**（O(1) 查）
- 多次改后一次查 → **差分数组**（O(1) 改）
- 单点改 + 区间查交替 → **树状数组**（O(log n) 常数小）
- 区间改 + 区间查交替 → **线段树**（带懒标记）

<div class="grid grid-cols-2 gap-6 mt-4">
<div>

**BIT 经典应用**

<v-clicks>

- **逆序对**：扫描 + `已插入数 - query(a[j])`
- 值域大先**离散化**到 `[1,n]`
- LIS O(n log n)：BIT 维护前缀 max
- 动态前缀和、求排名

</v-clicks>

</div>
<div>

**线段树经典应用**

<v-clicks>

- **RMQ** 区间最值（聚合换 min/max）
- 区间加 + 区间和（懒标记）
- 扫描线求矩形面积并
- 动态开点（值域 10⁹）

</v-clicks>

</div>
</div>

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm text-center">

⚠️ 共同前提：维护的信息须满足**结合律**；BIT 额外要求**可逆**（最值不可逆 → 用线段树）

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
应用层：BIT 适合逆序对/排名（扫描计数），线段树适合 RMQ/扫描线/区间批量改。
-->

---
layout: center
class: text-center
---

# 在线区间维护的两大支柱

<div class="text-2xl mt-8 mb-10">

线段树（通用）· 树状数组（轻量）

</div>

<v-click>

<div class="text-lg">

O(log n) 边改边查 · 前缀和/差分的在线升级版

</div>

</v-click>

<div class="mt-8 text-base text-gray-500">

区间改+区间查 → 线段树（懒标记） · 单点改+前缀查 → 树状数组（lowbit）

</div>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/segment-tree" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/segment-tree-slide/" target="_blank" class="text-xl icon-btn">
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
总结：线段树通用（懒标记实现区间改），树状数组轻量（lowbit 编码前缀结构）。两者都是前缀和的在线升级版。
-->
