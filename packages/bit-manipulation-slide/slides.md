---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 位运算
info: |
  ## 位运算（Bit Manipulation）
  按位运算 · 异或自反 · 位掩码
  算法里的「积木」。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 位运算

按位运算 · O(1) 常数 · 状态压缩的基石

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/fastpower" target="_blank" class="icon-btn">
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
位运算是最底层的算法积木，今天我们讲透六运算、异或性质和经典位掩码技巧。
-->

---
transition: fade-out
---

# 位运算是什么

直接对整数的**二进制位**做逻辑运算，每条都映射一条 CPU 指令。

<v-clicks>

- **六种运算**：与 `&`、或 `|`、非 `~`、异或 `^`、左移 `<<`、右移 `>>`
- **核心特性**：按位独立运算、O(1)、常数极小、无分支无访存
- **两个根基**：异或自反 `a^a=0` ⇒ 成对抵消；`n&(n-1)` ⇒ 操作单个 1
- **应用面**：找单元素、不用加减求和、状态压缩 DP、权限标志位

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：整数即位串，异或抵消成对、`n&(n-1)` 精耕每个 1。

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
位运算的一切都源于"整数即位串"。两个核心技巧贯穿全章：异或的成对抵消，和 n&(n-1) 去最低位1。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 六种位运算（a=12, b=10）

::left::

<div class="text-center text-xl font-bold mb-2 text-blue-600">运算表</div>

| 运算 | a op b | 结果 |
| --- | --- | --- |
| 与 `&` | `1100 & 1010` | 8 |
| 或 `\|` | `1100 \| 1010` | 14 |
| 异或 `^` | `1100 ^ 1010` | 6 |
| 左移 `<<` | `12 << 1` | 24 |
| 右移 `>>` | `12 >> 1` | 6 |

::right::

<div class="text-center text-xl font-bold mb-2 text-purple-600">用途口诀</div>

<v-clicks>

- **与 `&`**：遮罩、清零、检测
- **或 `|`**：置位、授权、合并
- **异或 `^`**：翻转、抵消、交换
- **左移 `<<`**：乘 2^k
- **右移 `>>`**：除 2^k

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ `~5 === -6`（JS 32 位取反后为负）

</div>

::bottom::

<div v-click class="mt-3 text-center text-sm">

非 `~` 是一元取反；每条都是单条 CPU 指令，O(1) 常数极小。

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
table { font-size: 0.8em; }
</style>

<!--
六运算的记忆诀窍：与遮罩、或置位、异或翻转。这三用途是所有位运算技巧的出发点。
-->

---

# 异或：成对抵消的代数根基

三大性质派生出无数技巧。

<div class="grid grid-cols-2 gap-6">
<div>

**三大性质**

<v-clicks>

- **自反性**：`a ^ a = 0`（相同抵消）
- **恒等性**：`a ^ 0 = a`（与 0 不变）
- **交换 + 结合**：顺序无关

</v-clicks>

**异或 = 无进位加法**

```js
0^0=0  0^1=1
1^0=1  1^1=0(进位本位0)
```

</div>
<div>

**不用临时变量交换**

```js
a ^= b;   // a = a^b
b ^= a;   // b = b^(a^b) = a
a ^= b;   // a = (a^b)^a = b
```

<div v-click class="mt-3 p-2 rounded bg-green-50 dark:bg-green-900/20 text-sm">

🎯 把数组全异或：成对的抵消，剩单数——「只出现一次的数字」原理

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
pre { font-size: 0.75em; }
</style>

<!--
异或是位运算里最有代数味的操作。自反性是找单元素和交换的根基。
-->

---

# 移位与补码：乘除 2^k 与负数

<div class="grid grid-cols-2 gap-6">
<div>

**移位 = 乘除 2^k**

```js
a << 1   // = a * 2
a << k   // = a * 2^k
a >> 1   // = a / 2 (向下取整)
a >> k   // = a / 2^k
(n >> k) & 1   // 取第 k 位
```

<div class="mt-2 text-sm">

现代编译器自动优化 `*2`→`<<1`，可读性优先。

</div>

</div>
<div>

**补码：`-n = ~n + 1`**

```
5:  0101   ~5: 1010   +1: 1011 = -5
-1 = 全 1 (0xFFFFFFFF)
```

<v-clicks>

- `n & (-1) = n`（与全 1 不变）
- `n & (-n)`：取最低位的 1
- `n ^ (-1) = ~n`（异或全 1 = 取反）

</v-clicks>

</div>
</div>

<div v-click class="mt-2 p-3 rounded bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-sm">

⚠️ **JS 位运算是 32 位有符号**：`(2**32)|0 === 0`、`(1<<31) === -2147483648`——大数用 BigInt

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
移位是乘除2的幂的底层；补码定义了负数，n&(-n)取lowbit是树状数组基石。
-->

---

# 常用位运算技巧（一）

<div class="grid grid-cols-2 gap-6">
<div>

**判断奇偶**

```js
const isOdd = (n) => (n & 1) === 1;
const isEven = (n) => (n & 1) === 0;
// 最低位 0 偶 1 奇
```

**去最低位的 1：`n&(n-1)`**

```js
// n-1: 最低位1借位变0，低位全变1
let c = 0;
while (n !== 0) { n &= n - 1; c++; }
// c = 1 的个数（汉明重量）
```

</div>
<div>

**取最低位 1（lowbit）：`n&(-n)`**

```js
const lowbit = (n) => n & (-n);
lowbit(12)  // 12=1100 → 100=4
// 树状数组（BIT）基石
```

**判断 2 的幂**

```js
const isPow2 = (n) =>
  n > 0 && (n & (n - 1)) === 0;
// 2的幂只有一个1
```

</div>
</div>

<div v-click class="mt-2 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

🎯 `n&(n-1)` 抹一个 1、`n&(-n)` 取一个 1——这是统计/分离 1 的瑞士军刀

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
两个核心技巧：n&(n-1)去最低位1（统计1的个数、判断2的幂），n&(-n)取最低位1（lowbit）。
-->

---

# 取、设、清、翻某位

操作第 k 位的四个模板，掩码 `1 << k` 是核心。

<div class="grid grid-cols-2 gap-6">
<div>

**取位 / 置位**

```js
// 取第 k 位（0 或 1）
const getBit = (n, k) => (n >> k) & 1;

// 置第 k 位为 1
const setBit = (n, k) => n | (1 << k);
```

**清位 / 翻位**

```js
// 清第 k 位为 0
const clearBit = (n, k) => n & ~(1 << k);

// 翻转第 k 位
const toggleBit = (n, k) => n ^ (1 << k);
```

</div>
<div>

**用途映射**

| 操作 | 运算 |
| --- | --- |
| 取位 | 右移 + 与 |
| 置位 | 或掩码 |
| 清位 | 与反向 |
| 翻位 | 异或掩码 |

<div v-click class="mt-3 p-2 rounded bg-blue-50 dark:bg-blue-900/20 text-sm">

这一组是**权限标志位、状态压缩、位图**的基石——「整数当布尔数组」。

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
pre { font-size: 0.74em; }
table { font-size: 0.85em; }
</style>

<!--
取设清翻是位掩码的基本操作，任何"用整数当布尔数组"的场景都靠它们。
-->

---

# 只出现一次的数字（异或）

数组中除一个数出现一次外，其余都出现两次，找那个单数。

<div class="grid grid-cols-2 gap-6">
<div>

**异或解法（O(n) O(1)）**

```js
function singleNumber(nums) {
  let ans = 0;
  for (const x of nums) ans ^= x;
  return ans;
}
```

</div>
<div>

**为什么对**

<v-clicks>

- `a ^ a = 0`：成对抵消
- `a ^ 0 = a`：单数留下
- 异或顺序无关，全部异或后
- 出现两次的都成 0
- 剩下那个单数

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-green-50 dark:bg-green-900/20 text-sm">

⚡ 比哈希表（O(n) 空间）省一个 Map，是**空间最优解**

</div>

</div>
</div>

<div v-click class="mt-2 text-center text-sm">

扩展：其余出现**三次**找单数 → 按位统计 1 的个数对 3 取模

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
异或的成对抵消是这个题的灵魂。注意初值取0（0^x=x）。
-->

---

# 不用加减法求和

模拟硬件加法器：拆成无进位和 + 进位，循环到进位为 0。

<div class="grid grid-cols-2 gap-6">
<div>

**核心公式**

```
无进位和 = a ^ b
进位     = (a & b) << 1
```

**循环求和**

```js
function getSum(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}
```

</div>
<div>

**推导（a=5, b=3）**

<v-clicks>

- `a^b`：无进位逐位和
- `(a&b)<<1`：进位左移
- 把进位再加回去（循环）
- 直到无进位 `b===0`
- 此时 `a` 即为最终和

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ JS 32 位截断，大数用 `>>> 0` 处理符号位

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
pre { font-size: 0.74em; }
</style>

<!--
异或=无进位加法。把无进位和与进位反复相加，直到进位归零，就是和。这就是硬件加法器原理。
-->

---

# 汉明重量 & 状态压缩

<div class="grid grid-cols-2 gap-6">
<div>

**汉明重量（1 的个数）**

```js
function popcount(n) {
  let c = 0;
  while (n !== 0) {
    n &= n - 1;   // 抹一个 1
    c++;
  }
  return c;
}
// 汉明距离 = popcount(a ^ b)
```

</div>
<div>

**状态压缩：整数当集合**

```js
// 枚举 mask 的所有非空子集
for (let sub = mask; sub > 0;
     sub = (sub - 1) & mask) {
  // sub 降序遍历
}
```

<div v-click class="mt-2 p-2 rounded bg-blue-50 dark:bg-blue-900/20 text-sm">

位掩码第 i 位 = 元素 i 选/不选——旅行商、子集划分 DP

</div>

</div>
</div>

<div v-click class="mt-2 p-3 rounded bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 text-sm">

**权限标志位**也同源：读=4 写=2 执行=1（`rwx`），或授权、与检测、异或撤销——Unix 文件权限即此

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
popcount用n&(n-1)抹1法；状态压缩用位掩码表示集合，枚举子集是位DP核心模板。
-->

---
layout: center
class: text-center
---

# 位运算是算法的积木

<div class="text-2xl mt-8 mb-12">

整数即位串 → 异或抵消、n&(n-1) 精耕

</div>

<v-click>

<div class="text-lg">

找单元素 · 不用加减求和 · 状态压缩 DP · 权限标志位

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/fastpower" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 快速幂
  </a>
  <a href="/SlideStack/bit-manipulation-slide/" target="_blank" class="text-xl icon-btn">
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
掌握六运算、异或性质和两大核心技巧，位运算就通透了。进阶看快速幂——位运算思想最优雅的体现。
-->
