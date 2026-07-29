---
theme: seriph
background: https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=2048
title: 快速幂与模运算
info: |
  ## 快速幂与模运算（Fast Exponentiation & Modular Arithmetic）
  二进制幂 O(log n) · 模运算性质 · 防溢出
  数论模板的基石。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 快速幂与模运算

二进制幂 O(log n) · 模运算防溢出 · 数论基石

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
快速幂把 a^n 从 O(n) 降到 O(log n)，配合模运算防溢出，是数论与组合数学的基石。
-->

---
transition: fade-out
---

# 为什么需要快速幂

朴素幂 `a^n` 连乘 n 次，**O(n)** 乘法——n 大了就跑不动。

<v-clicks>

- `2^10^9`：朴素要 **10 亿次**乘法，直接超时
- RSA 密码学指数是 **2048 位**（约 10^617），朴素法算到宇宙尽头
- 快速幂：**O(log n)** 次乘法，算 `2^10^9` 只需约 **30 次**

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**核心**：把「乘 n 次」变成「乘 log₂n 次」——加速约 **n / log n** 倍。

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
朴素 O(n) 对大指数完全不可行。快速幂把乘法次数降到对数级。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 二进制分解思想

::left::

把指数 n 写成二进制，每位为 1 就累乘对应的积木。

```
13 = 8 + 4 + 1 = 1101₂
a^13 = a^8 × a^4 × a^1
```

<v-clicks>

- 积木链：`a → a² → a⁴ → a⁸`
- 每项是前一项**自平方**
- 位为 0 的项（如 a²）不累乘

</v-clicks>

::right::

<div class="text-center font-mono text-sm">

```
位    积木    n&1   结果res
─3    a^8     1     a·a⁴·a⁸
─2    a^4     1       ↓
─1    a^2     0     (跳过 a²)
─0    a^1     1       start
```

</div>

::bottom::

<div v-click class="mt-4 text-center">

🎯 **底数每轮自平方生成下一块积木；二进制位为 1 时累乘进结果**

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
二进制分解是快速幂的灵魂：积木自平方 + 按位累乘。
-->

---

# 快速幂：递归写法

按指数奇偶分治，每次规模砍半。

```js
function pow(a, n) {
  if (n === 0) return 1;          // a^0 = 1
  const half = pow(a, n >> 1);    // 算一半
  const sq = half * half;         // 平方
  return n % 2 === 0 ? sq : sq * a; // 奇数多乘 a
}
```

<div class="grid grid-cols-2 gap-6 mt-4">
<div>

**递推式**

```
a^n = (a^(n/2))²        n 偶
a^n = (a^((n-1)/2))²×a  n 奇
```

</div>
<div>

<v-clicks>

- 每层 O(1) 次乘法
- 递归深度 **O(log n)**
- 贴近数学定义，易证明

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
pre { font-size: 0.8em; }
</style>

<!--
递归版：分治思想，指数砍半。适合教学，超大指数时工程上偏好迭代。
-->

---

# 快速幂：迭代写法（最常用）

位运算扫二进制位，先判位再自平方。

```js
function pow(a, n) {
  let res = 1, base = a;
  while (n > 0) {
    if (n & 1) res *= base;   // 位为1：累乘
    base *= base;             // 底数自平方
    n = Math.floor(n / 2);    // 指数右移
  }
  return res;
}
```

<div v-click class="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

⚠️ **顺序**：必须**先判 `n&1` 累乘，再 `base*=base`**——反了会多乘一次（用到下一轮的积木）。

</div>

<div v-click class="mt-2 text-center text-sm">

**复杂度**：O(log n) 时间 · O(1) 空间

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
迭代版是工程首选。注意先判位再自平方的顺序，这是最高频的坑。
-->

---

# 取模版快速幂：边算边取模

每步乘法后 `%p`，中间值压在 `[0,p)` 防溢出。

```js
function powMod(a, n, p) {
  let res = 1, base = a % p;
  while (n > 0) {
    if (n & 1) res = (res * base) % p;
    base = (base * base) % p;
    n = Math.floor(n / 2);
  }
  return res;
}
```

<v-clicks>

- **为什么对**：`(a×b)%p = ((a%p)×(b%p))%p`，每步取模不改最终结果
- 中间值始终 `< p`，杜绝大数爆炸
- 是费马逆元、组合数取模的基础

</v-clicks>

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
取模版是实战模板。正确性来自模运算乘法可分配性。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 模运算六大性质

::left::

| 运算 | 可分配？ |
| --- | --- |
| 加 `(a+b)%p` | ✅ |
| 减 `(a-b)%p` | ✅ 需 `+p` |
| 乘 `(a×b)%p` | ✅ |
| 幂 `a^n%p` | ✅ |
| 除 `(a/b)%p` | ❌ 需逆元 |

::right::

<v-clicks>

- **加/减/乘/幂**：都能边算边取模
- **减法**：JS `%` 可能得负，要 `((x%p)+p)%p`
- **乘法可分配证明**：

```
a=q₁p+r₁, b=q₂p+r₂
a×b = ...p 的倍数 + r₁r₂
⇒ (a×b)%p=(r₁r₂)%p
```

</v-clicks>

::bottom::

<div v-click class="mt-4 text-center">

🎯 口诀：**加减乘幂可取模，减法防负，除法转逆元**

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
pre { font-size: 0.75em; }
</style>

<!--
模运算性质：加减乘幂可分配，除法不行。减法要防负，除法要逆元。
-->

---

# 大数取模：JS 精度与 BigInt

JS `Number` 安全整数上限 **`2^53-1`**；`p×p` 超限就丢精度。

```js
// p = 10^9+7 时，p×p ≈ 10^18 > 2^53 ❌ 必须用 BigInt
function powModBig(a, n, p) {
  a = BigInt(a); n = BigInt(n); p = BigInt(p);
  let res = 1n, base = a % p;
  while (n > 0n) {
    if (n & 1n) res = (res * base) % p;
    base = (base * base) % p;
    n >>= 1n;
  }
  return res;
}
```

<v-clicks>

- `p ≤ 3×10⁹` 时 `p×p < 2^53`，Number 安全
- `p = 10⁹+7` 等：**必须 BigInt**（`n` 后缀）
- BigInt 不可与 Number 混算，除法是整除

</v-clicks>

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
p 大时 Number 丢精度且不报错，必须 BigInt。这是 JS 数论题的最大陷阱。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 费马小定理：求乘法逆元

::left::

**定理**：p 质数且 `gcd(a,p)=1` 时

```
a^(p-1) ≡ 1 (mod p)
⇒ a^(-1) ≡ a^(p-2) (mod p)
```

```js
function inv(a, p) {
  return powMod(a, p - 2, p); // O(log p)
}
```

::right::

**验证**：求 3 模 7 的逆元

```
3^(-1) ≡ 3^5 = 243
243 mod 7 = 5
3 × 5 = 15 mod 7 = 1 ✅
```

<v-click>

**应用**：组合数取模

```
C(n,k)%p
= n!×(k!)^(-1)×((n-k)!)^(-1)
```

</v-click>

::bottom::

<div v-click class="mt-4 text-center">

🎯 除法 `a/b mod p` → 乘法 `a×b^(-1) mod p`，用快速幂 O(log p)

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
费马小定理把除法转成乘法（逆元），是组合数取模的关键。p 必须是质数。
-->

---

# 矩阵快速幂：斐波那契 O(log n)

把快速幂推广到矩阵乘法——线性递推加速。

```js
// F(n) = F(n-1) + F(n-2)  ⇒  [F(n),F(n-1)]ᵀ = M×[F(n-1),F(n-2)]ᵀ
// M = [[1,1],[1,0]]，则 F(n) = (M^(n-1))[0][0]
function fibMod(n, p) {
  if (n === 0) return 0;
  let res = [[1,0],[0,1]], base = [[1,1],[1,0]], m = n - 1;
  while (m > 0) {                 // 套快速幂框架
    if (m & 1) res = matMul(res, base, p);  // 矩阵乘代替数乘
    base = matMul(base, base, p);
    m = Math.floor(m / 2);
  }
  return res[0][0] % p;
}
```

<div v-click class="mt-3 p-3 rounded bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-sm">

**关键**：构造转移矩阵 M，把递推写成 `[状态]=M×[上状态]`；剩下套快速幂模板。常系数线性递推都能 **O(k³ log n)**。

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
矩阵快速幂：快速幂思想 + 矩阵乘法。斐波那契从 O(n) 降到 O(log n)。
-->

---
layout: center
class: text-center
---

# 快速幂：数论模板的基石

<div class="text-2xl mt-8 mb-12">

二进制分解 → O(log n) → 边算边取模 → 防溢出

</div>

<v-click>

<div class="text-lg">

逆元 · 组合数取模 · 矩阵快速幂 · RSA 密码学 都建在快速幂之上

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/fastpower" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/fast-power-slide/" target="_blank" class="text-xl icon-btn">
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
快速幂是数论基石。掌握了二进制分解 + 取模防溢出，后续逆元、组合数、矩阵快速幂都有了根基。
-->
