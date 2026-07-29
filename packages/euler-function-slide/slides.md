---
theme: seriph
background: https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=2048
title: 欧拉函数与组合数
info: |
  ## 欧拉函数与组合数
  φ(n) · 欧拉定理 · 组合数取模 · 乘法逆元
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 欧拉函数与组合数

φ(n) · 欧拉定理 · 组合数取模 · 乘法逆元

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/phi" target="_blank" class="icon-btn">
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
欧拉函数与组合数是模算术的核心。今天串起「φ → 欧拉定理 → 逆元 → 组合数取模」这条链。
-->

---
transition: fade-out
---

# φ(n) 是什么

`1..n` 中与 `n` **互质**（`gcd=1`）的正整数个数。

<v-clicks>

- **φ(1) = 1**：约定
- **φ(6) = 2**：`1,5` 互质（2/3/4/6 不互质）
- **φ(7) = 6**：质数，`1..6` 全互质
- **φ(8) = 4**：`8=2³`，奇数 `1,3,5,7` 互质

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**质数结论**：`φ(p) = p - 1`；**质数幂**：`φ(p^k) = p^(k-1) × (p-1)`（只 p 的倍数不互质）

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
φ(n) 数的是「互质个数」。记住质数 p 的 φ=p-1 和质数幂的公式。
-->

---

# φ 的通项公式

`n = Π pi^ai` 时：**`φ(n) = n × Π(1 - 1/pi)`**

<div class="grid grid-cols-2 gap-8">
<div>

**验证 φ(6)**：`6 = 2 × 3`

```
φ(6) = 6 × (1-1/2) × (1-1/3)
     = 6 × 1/2 × 2/3 = 2 ✓
```

**理论依据**：

- **积性**：`gcd(a,b)=1 ⇒ φ(a·b)=φ(a)·φ(b)`
- **容斥**：质数幂扣掉 p 的倍数

</div>
<div>

**计算意义**：对 `n` 做质因数分解即可算 φ，每个因子 `p` 贡献一次 `×(p-1)/p`。

用整数运算避免浮点：

```
φ = φ / p × (p - 1)   // 先除后乘！
```

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ 必须**先除后乘**：循环到 p 时 φ 还含 p，整除安全；先乘可能除不尽

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
通项公式是计算 φ 的根本。关键工程细节：先除后乘避免分数。
-->

---

# 单值 φ + 埃氏筛

<div class="grid grid-cols-2 gap-6">
<div>

**单值 O(√n)**

```js
function phi(n) {
  let res = n;
  for (let p = 2; p*p <= n; p++) {
    if (n % p === 0) {
      while (n % p === 0) n /= p;
      res = res / p * (p - 1);
    }
  }
  if (n > 1) res = res / n * (n-1);
  return res;
}
```

</div>
<div>

**筛法 O(n log log n)**

```js
function sievePhi(N) {
  const phi = [...Array(N+1)].map((_,i)=>i);
  for (let p = 2; p <= N; p++)
    if (phi[p] === p)        // p 质数
      for (let m = p; m <= N; m += p)
        phi[m] = phi[m]/p*(p-1);
  return phi;
}
```

</div>
</div>

<div v-click class="mt-2 p-3 rounded bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-sm">

**筛法原理**：初始化 `phi[i]=i`，每个质数 p 把它的所有倍数 m 各乘一次 `(1-1/p)`——正好是通项公式逐因子贡献

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
单值 O(√n) 分解；筛法初始化 phi[i]=i 是关键，质数 p 改它所有倍数。
-->

---

# 欧拉定理：降幂咒语

`gcd(a, n) = 1` 时：**`a^φ(n) ≡ 1 (mod n)`**

<div class="grid grid-cols-2 gap-8">
<div>

**降幂**（前提互质）：

```
a^e ≡ a^(e mod φ(n))  (mod n)
```

**例：`3^100 mod 7`**

- `φ(7) = 6`，`gcd(3,7)=1`
- `100 mod 6 = 4`
- `3^4 = 81 ≡ 4 (mod 7)`

100 次方 → 4 次方

</div>
<div>

**费马小定理（特例）**：`n` 为质数 `p`，`φ(p)=p-1`：

```
a^(p-1) ≡ 1 (mod p)
```

<div v-click class="mt-2 p-2 rounded bg-green-50 dark:bg-green-900/20 text-sm">

✅ **费马 = 欧拉在质数模的特例**

</div>

<div v-click class="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm">

⚠️ `gcd(a,n)≠1` 且 `e≥φ(n)` 时用扩展：`a^e ≡ a^(e mod φ(n)+φ(n))`

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
欧拉定理是降幂的根。费马小定理是它在质数模的特例。
-->

---

# 组合数 C(n,k)

从 `n` 个不同元素里选 `k` 个（不计顺序）的方案数。

<v-clicks>

- **公式**：`C(n,k) = n! / (k! × (n-k)!)`
- **对称**：`C(n,k) = C(n,n-k)`
- **边界**：`C(n,0) = C(n,n) = 1`；`k > n` 时为 0
- **例**：`C(5,2) = 120 / (2 × 6) = 10`

</v-clicks>

<div v-click class="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**取模三打法**：①递推（小 n，模数任意）②阶乘+逆元（O(1) 查，模数质数）③卢卡斯（n 极大、p 小）

</div>

<div v-click class="mt-2 text-center text-sm text-gray-500">

模算术里「除法」要靠**乘法逆元**把分母换成乘逆元

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
组合数公式是基础。取模下做不了除法，要靠逆元。
-->

---

# 杨辉三角递推

`C(n,k) = C(n-1,k-1) + C(n-1,k)` —— O(n²) 建全表，模数任意。

<div class="grid grid-cols-2 gap-8">
<div>

```js
function pascal(N, m) {
  const C = [...Array(N+1)].map(
    () => Array(N+1).fill(0));
  for (let n = 0; n <= N; n++) {
    C[n][0] = C[n][n] = 1;
    for (let k = 1; k < n; k++)
      C[n][k] = (C[n-1][k-1]
             + C[n-1][k]) % m;
  }
  return C;
}
```

</div>
<div>

**为何成立**：选 k 个 = 含第 n 个（再选 k-1）+ 不含（选 k）

**杨辉三角**（m=任意）：

```
1
1 1
1 2 1
1 3 3 1
1 4 6 4 1
```

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ 只有加法无除法 → **模数不必质数**

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
递推只有加法，模数任意。适合 n 小、要全表。
-->

---

# 阶乘 + 逆元：O(1) 查询

模数质数 `p`：`C(n,k) = fact[n] · invfact[k] · invfact[n-k]`

<div class="grid grid-cols-2 gap-6">
<div>

**预处理 O(n)**

```js
fact[0] = 1;
for (i=1..N) fact[i] = fact[i-1]*i % p;
inv[1] = 1;
for (i=2..N) // 线性求逆元
  inv[i] = (p-p/i)*inv[p%i] % p;
invfact[0] = 1;
for (i=1..N)
  invfact[i] = invfact[i-1]*inv[i] % p;
```

</div>
<div>

**查询 O(1)**

```js
function C(n, k) {
  if (k < 0 || k > n) return 0;
  return fact[n] * invfact[k] % p
         * invfact[n-k] % p;
}
```

<div v-click class="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm">

⚠️ `n ≥ p` 时 `fact[n] ≡ 0`（含因子 p）→ 改用**卢卡斯**

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
最常用打法：预处理阶乘和逆元阶乘，三次乘法 O(1) 查。n≥p 失效用卢卡斯。
-->

---

# 卢卡斯定理

`n, k` 极大、模数 `p` 小且质数：**按 p 进制拆位**

```
C(n,k) mod p = C(n mod p, k mod p) × C(⌊n/p⌋, ⌊k/p⌋) mod p
```

<div class="grid grid-cols-2 gap-8">
<div>

```js
function lucas(n, k, p) {
  if (k < 0 || k > n) return 0;
  let res = 1n, N=n, K=k, P=p;
  while (N > 0n || K > 0n) {
    const ni = N % P, ki = K % P;
    if (ki > ni) return 0;
    res = res*C(ni,ki) % P;
    N /= P; K /= P;
  }
  return res;
}
```

</div>
<div>

**要点**：

- 每段 `ni, ki < p`，用 0..p-1 阶乘表
- 递归深度 `O(log_p n)`
- 复杂度 `O(log_p n)`

<div v-click class="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm">

⚠️ `p` 必须**质数**；合数模用扩展卢卡斯

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
卢卡斯把 n,k 按 p 进制拆，每段小于 p 用阶乘表。限质数模。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 乘法逆元：费马 vs 欧拉

::left::

**费马**（模数 `p` 质数）

```
a⁻¹ ≡ a^(p-2) (mod p)
```

```js
const invFermat = (a, p) =>
  powmod(a, p - 2, p);
```

- 配快速幂 `O(log p)`
- 最常用（多数题模质数）

::right::

**欧拉**（模数 `m` 任意）

```
a⁻¹ ≡ a^(φ(m)-1) (mod m)
```

```js
const invEuler = (a, m) =>
  powmod(a, phi(m) - 1, m);
```

- 需先算 `φ(m)`
- 需 `gcd(a,m)=1`

::bottom::

<div v-click class="mt-4 text-center">

🎯 共同前提：**`gcd(a, m) = 1`**，否则无逆元；模合数 → 欧拉或扩欧

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
逆元两条路都来自欧拉定理家族。共同前提是互质，否则无逆元。
-->

---
layout: center
class: text-center
---

# φ → 欧拉定理 → 逆元 → 组合数

<div class="text-2xl mt-8 mb-12">

一条链贯通模算术

</div>

<v-click>

<div class="text-lg">

φ(n) 计算 · 降幂 · RSA · 费马/欧拉逆元 · 阶乘+逆元 O(1) · 卢卡斯

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/phi" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/euler-function-slide/" target="_blank" class="text-xl icon-btn">
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
掌握这条链，模算术的考点就通了：φ 计算、降幂、逆元、组合数取模。
-->
