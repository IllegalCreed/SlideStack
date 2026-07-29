---
theme: seriph
background: https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=2048
title: GCD 与扩展欧几里得
info: |
  ## GCD 与扩展欧几里得
  辗转相除 · 贝祖定理 · 扩欧求逆元
  数论算法的地基。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# GCD 与扩展欧几里得

辗转相除 · O(log) · 贝祖定理 · 扩欧求逆元

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/gcd" target="_blank" class="icon-btn">
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
GCD/LCM/贝祖/扩欧四件套是数论算法的地基。今天讲透辗转相除的复杂度来源、扩欧的回代原理和逆元求法。
-->

---
transition: fade-out
---

# GCD 是什么

两个整数**公约数**中最大的那个，记作 `gcd(a, b)`。

<v-clicks>

- **定义**：`gcd(a, b)` 是同时整除 `a`、`b` 的最大正整数
- **边界**：`gcd(a, 0) = |a|`；结果总非负（取绝对值）
- **互质**：`gcd(a, b) == 1`，即无大于 1 的公约数
- **线性性**：`gcd(k×a, k×b) = k × gcd(a, b)`
- **例子**：`gcd(12, 18) = 6`；`gcd(7, 13) = 1`（互质）

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：gcd 是「共享因子」的最大值，结果非负，是数论算法的起点。

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
gcd 是最基础的工具。注意边界 gcd(a,0)=|a|，结果恒非负——处理负数先取绝对值。
-->

---

# 辗转相除：gcd(a, b) = gcd(b, a mod b)

核心递推把问题归约到更小规模，直到 `b == 0` 返回 `a`。

<div class="grid grid-cols-2 gap-8">
<div>

**为什么对**

设 `a = q×b + r`，任何 `a,b` 的公约数 `d` 都整除 `r`，反之亦然——两组公约数完全相同。

```
gcd(18, 12)
18 = 1×12 + 6 → gcd(12, 6)
12 = 2×6  + 0 → gcd(6, 0) = 6
```

</div>
<div>

**代码（迭代首选）**

```js
function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}
```

<v-click>

每步 `r < b` 严格递减，必终止。

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
pre { font-size: 0.8em; }
</style>

<!--
核心递推 gcd(a,b)=gcd(b,a mod b)。正确性靠公约数集相同。迭代版常数更小。
-->

---

# LCM：最小公倍数 = a × b / gcd

求了 gcd，lcm 是顺手一行的事。

<div class="grid grid-cols-2 gap-8">
<div>

**公式**

```
lcm(a, b) = a × b / gcd(a, b)
```

- `lcm(4, 6) = 24 / 2 = 12`
- 互质时 lcm = 乘积
- `gcd × lcm = |a × b|`（对偶关系）

</div>
<div>

**溢出陷阱：先除后乘**

```js
function lcm(a, b) {
  const g = gcd(a, b);
  return Math.abs(a / g) * Math.abs(b);
}
```

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ `a×b` 中间可能溢出 → 先 `a/g`（必整除）再乘 `b`

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
pre { font-size: 0.82em; }
</style>

<!--
lcm = a*b/gcd。关键陷阱：先除后乘防溢出，a/g 必整除所以安全。
-->

---

# 复杂度：为什么是 O(log min(a, b))

每两步较大的数至少缩到原来一半以下。

<v-clicks>

- **折半引理**：无论 `b > a/2` 还是 `b ≤ a/2`，两步后较大数 < `a/2`
- **拉梅定理**：步数 ≤ 5 × (min 的十进制位数)
- **64 位整数**：最多约 90 步——所以对大数也极快
- **最坏情况**：相邻斐波那契数 `gcd(F_{n+1}, F_n)` 要 n 步（极端构造）

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500">

**结论**：辗转相除 O(log min(a, b))，两千年来仍是求 gcd 的主流算法。

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
复杂度来源：每两步至少折半。斐波那契对是最坏情况，日常数据远没这么多步。
-->

---

# 贝祖定理：ax + by = gcd(a, b) 必有解

对任意整数 `a, b`，存在整数 `x, y` 使 `ax + by = gcd(a, b)`。

<div class="grid grid-cols-2 gap-8">
<div>

**核心结论**

- gcd 是 a、b 所有**整数线性组合**中最小的正值
- 解 `(x, y)` **不唯一**
- `gcd(18,12)=6`：`18×1 + 12×(-1) = 6` ✓

</div>
<div>

**通解**

若 `(x₀, y₀)` 是特解，`g = gcd(a,b)`：

```
x = x₀ + k × (b / g)
y = y₀ - k × (a / g)
k 为任意整数
```

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-purple-50 dark:bg-purple-900/30 border-l-4 border-purple-500 text-sm">

如何**系统求出** `(x, y)`？→ 扩展欧几里得算法（下一页）

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
pre { font-size: 0.85em; }
</style>

<!--
贝祖定理是存在性保证。解不唯一，通解用 k 参数化。怎么求——扩欧。
-->

---

# 扩展欧几里得：回代求 (x, y)

在递归求 gcd 的同时回代出贝祖等式的解。

<div class="grid grid-cols-2 gap-8">
<div>

**回代原理**

子问题 `b·x' + (a mod b)·y' = g`，代入 `a mod b = a - q·b`：

```
g = a·y' + b·(x' - q·y')
→ 本层 x = y'
→ 本层 y = x' - q·y'
```

基础：`b==0` 时 `x=1, y=0`

</div>
<div>

**代码**

```js
function extgcd(a, b) {
  if (b === 0) return [a, 1, 0];
  const [g, x1, y1] = extgcd(b, a % b);
  const q = Math.floor(a / b);
  return [g, y1, x1 - q * y1];
}
// extgcd(18,12) → [6, 1, -1]
```

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
扩欧：子问题解代入 a mod b = a - q*b，整理得本层解。与 gcd 同阶 O(log)。
-->

---

# 乘法逆元：扩欧 vs 费马小定理

`a⁻¹ mod m` 满足 `a × a⁻¹ ≡ 1 (mod m)`，存在 ⟺ `gcd(a, m) == 1`。

<div class="grid grid-cols-2 gap-6">
<div>

**方法①：扩欧（通用）**

求 `a·x + m·y = 1`，取 `x mod m`：

```js
function inv(a, m) {
  const [g, x] = extgcd(a, m);
  if (g !== 1) return null;
  return ((x % m) + m) % m;
}
```

不要求 m 质数

</div>
<div>

**方法②：费马小定理（m 质数）**

`a⁻¹ ≡ a^(m-2) (mod m)`，快速幂 O(log m)：

```js
function invF(a, p) {
  return modPow(a, p - 2, p);
}
```

<div v-click class="mt-2 p-2 rounded bg-blue-50 dark:bg-blue-900/20 text-sm">

m=1e9+7 → 用费马；通用场景 → 扩欧

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
逆元存在前提 gcd(a,m)==1。费马小定理要 m 质数且更快；扩欧通用。
-->

---

# 应用：分数、互质与方程

<div class="grid grid-cols-2 gap-8">
<div>

**分数化简**：除 gcd

```js
function simp(a, b) {
  const g = gcd(a, b);
  return [a/g, b/g];
}
// simp(6,4) → [3,2]
```

**互质判断**：`gcd(a, b) == 1`

**不定方程**：`ax+by=c` 有解 ⟺ `gcd(a,b) | c`

</div>
<div>

**模意义除法**：`a/b ≡ a × b⁻¹ (mod m)`

**组合数取模**：`C(n,k) = n! × (k!(n-k)!)⁻¹`

**中国剩余定理**：扩欧合并同余方程组

**RSA 密钥**：选 `e` 与 `φ(n)` 互质，`d = e⁻¹`

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

⚠️ 共同前提：判断或化简前确认 `gcd` 关系；逆元先查 `gcd(a,m)==1`。

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
四大应用：分数化简、互质判断、不定方程、逆元。都靠 gcd/扩欧支撑。
-->

---
layout: center
class: text-center
---

# GCD 是数论算法的地基

<div class="text-2xl mt-8 mb-12">

辗转相除 O(log) · 贝祖定理 · 扩欧求逆元

</div>

<v-click>

<div class="text-lg">

分数化简 · 互质判断 · 逆元 · 不定方程 · CRT · RSA 都建立在它之上

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/gcd" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/gcd-slide/" target="_blank" class="text-xl icon-btn">
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
掌握了辗转相除、贝祖定理和扩欧，数论算法的地基就打好了。
-->
