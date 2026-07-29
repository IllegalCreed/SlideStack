---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 字符串匹配
info: |
  ## 字符串匹配（KMP / Rabin-Karp / Boyer-Moore）
  主串找模式串 · 从朴素 O(nm) 到线性 / 亚线性
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 字符串匹配

主串找模式串 · 从朴素 O(nm) 到线性 / 亚线性

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/kmp" target="_blank" class="icon-btn">
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
字符串匹配是文本搜索的核心。今天讲透朴素法的 O(nm) 症结，与 KMP/RK/BM 三种线性解法。
-->

---
transition: fade-out
---

# 字符串匹配是什么

在**主串** `s`（长 `n`）里找**模式串** `p`（长 `m`）的所有出现位置。

<v-clicks>

- **朴素法**：逐起点逐字符比对，最坏 **O(n·m)**
- **症结**：失配后丢弃「已匹配的字符信息」、主串回退
- **KMP**：`next` 数组复用已匹配前缀，**主串不回退**，严格 O(n+m)
- **Rabin-Karp**：滚动哈希比窗口，平均 O(n+m)，**多模式**王者
- **Boyer-Moore**：从后向前 + 坏字符/好后缀，**实际最快**

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：所有进阶算法都在「利用已匹配信息，避免主串回溯或跳跃前进」。

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
朴素法丢信息导致 O(nm)。三种进阶算法的本质都是复用已匹配信息。
-->

---

# 朴素法：直观但最坏 O(nm)

```js {all|1-2|4-6|all}
function naive(s, p) {
  for (let i = 0; i <= s.length - p.length; i++) {
    let j = 0;
    while (j < p.length && s[i+j] === p[j]) j++;
    if (j === p.length) res.push(i);   // 命中
  }
}
```

<div class="grid grid-cols-2 gap-8 mt-4">
<div>

**最坏退化场景**

`aaaa...aab` 找 `aaa...ab`

- 每个起点都比到末位才失配
- 比较次数 ≈ `n·m`

</div>
<div>

<v-click>

<div class="p-3 rounded bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-sm">

⚠️ **症结**：失配后 `i++` 回到起点几乎重比，已匹配的 `j` 个字符全被丢弃。

</div>

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
</style>

<!--
朴素法随机文本尚可，但重复主串 + 后缀失配模式会退化到 O(nm)。
-->

---

# KMP 核心：主串不回溯

利用模式串自身的「前缀 = 后缀」结构，失配后**主串指针原地不动**。

<div class="grid grid-cols-2 gap-8">
<div>

**失配时怎么移**

```
s:  ... a b c a b c a b d ...
p:      a b c a b d
              ↑ j=5 失配
p[0..4]="abcab" 的
LPS = "ab"(长2)
→ p 右移 5-2=3
```

</div>
<div>

<v-clicks>

- `p[0..j-1]` 已匹配 = `s[i-j..i-1]`
- 若 `p` 前缀 = `p[0..j-1]` 后缀
- 把前缀对齐到后缀位置
- 复用 `next[j]` 个已匹配字符
- 主串 `i` **一步不退**

</v-clicks>

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-sm">

💡 `j = next[j]`：模式串右移，主串 `i` 原地，从 `p[next[j]]` 续比。

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
KMP 的精髓：失配后主串不回退，只移动模式串指针 j。
-->

---

# next 数组：最长公共前后缀

`next[j]` = `p[0..j-1]` 的**真前缀**与**真后缀**最长公共串长度。

<div class="grid grid-cols-2 gap-6">
<div>

**构造 = 模式串自匹配**

```js
let i = 1, len = 0;
while (i < m) {
  if (p[i] === p[len]) next[++i] = ++len;
  else if (len > 0) len = next[len];
  else next[++i] = 0;
}
```

</div>
<div>

**示例** `p = "abcabd"` → `next=[0,0,0,0,1,2,0]`

| `j` | 前缀 | `next` |
| --- | --- | --- |
| 0 | ``(空) | 0 |
| 3 | `abc` | 0 |
| 4 | `abca` | 1 |
| 5 | `abcab` | 2 |

</div>
</div>

<div class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

⚠️ 「真」前/后缀不能是整个串，故 `next[0]=0`；`len=next[len]` 沿链回退。

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
table { font-size: 0.68em; }
</style>

<!--
next 数组是 KMP 全部难点。构造过程就是模式串跟自己做 KMP。
-->

---

# KMP 匹配：O(n+m)

主串 `i` 单调扫，模式串 `j` 前进或回跳。

```js {all|1-3|5-7|all}
let i = 0, j = 0;
while (i < n) {
  if (s[i] === p[j]) { i++; j++; }
  else if (j > 0) j = next[j];   // 失配：j 回跳，i 不动
  else i++;                       // j=0 还失配：i 前进
  if (j === m) { res.push(i-m); j = next[j]; } // 命中续找
}
```

<v-clicks>

- `i` 始终单调递增，**绝不回退**
- `j` 回跳次数受 `i` 增加约束（≤ n）
- 预处理 `O(m)` + 匹配 `O(n)` = **O(n+m)**
- 适合**流式数据**（主串不可回退）

</v-clicks>

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
主串指针单调递增是 KMP 严格线性的根本原因。
-->

---

# Rabin-Karp：滚动哈希

不比字符串相等，比**长度 m 窗口的哈希值**是否相等。

<div class="grid grid-cols-2 gap-8">
<div>

**滚动哈希（O(1) 滑动）**

```
hash(l..l+m-1) = (c0·b^(m-1)+...+c_(m-1)) mod M
滑到下一窗：
hash_new =
  ((hash_old - c_左·b^(m-1))
   ·b + c_右) mod M
```

</div>
<div>

<v-clicks>

- 平均 **O(n+m)**，哈希比相等
- 哈希相等须**二次逐字符校验**
- 选大素数 / 双哈希防冲突
- 最坏 O(n·m)（恶意冲突）
- **多模式**：哈希入集合一次扫描

</v-clicks>

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

⚠️ 漏二次校验 → **假阳性**；减法后须 `+mod` 消负数。

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
RK 换视角比哈希。多模式是它独有优势——哈希入集合一次扫。
-->

---

# Boyer-Moore：从后向前，实际最快

**从右端 `p[m-1]` 往左比**，失配靠坏字符/好后缀**大幅右移**，常**亚线性**。

<div class="grid grid-cols-2 gap-8">
<div>

**坏字符规则**

```
失配字符 bad=s[i+j]
若 bad 在 p[k] (k<j):
  右移 j-k，让 p[k] 对齐
若 bad 不在 p 中:
  右移 j+1，整段跳过
```

</div>
<div>

**好后缀规则**

```
已匹配后缀 U=p[j+1..m-1]
若 p 别处再现 U：对齐
否则 p 前缀 = U 的后缀
两规则取较大跳跃
```

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-sm">

⚡ **BM-Horspool** 只保留坏字符、用窗口最右字符位移——实现简、常数小，是 grep / 编辑器查找的常用内核。

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
BM 从后向前，获得坏字符信息就能大幅跳跃，实际比较次数常小于 n。
-->

---

# 四算法对比

<div class="text-center">

| 算法 | 平均 | 最坏 | 主串指针 | 适用 |
| --- | --- | --- | --- | --- |
| 朴素 | O(n+m) | **O(n·m)** | 回退 | 小模式 / 随机文本 |
| **KMP** | O(n) | **O(n+m)** | 不回退 | 严格线性 / 流式 |
| **Rabin-Karp** | O(n) | O(n·m) | 单调 | **多模式** |
| **Boyer-Moore** | **亚线性** | O(n+m) | 跳跃 | **工程最快** |

</div>

<div v-click class="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

🎯 **选型口诀**：严格线性/主串不可退 → **KMP**；多模式/哈希视角 → **RK**；工程实测最快 → **BM**

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
</style>

<!--
四算法各有定位，按场景选型。KMP 最稳、RK 多模式、BM 实测最快。
-->

---

# 应用场景

<v-clicks>

- **文本编辑器查找/替换**：`Ctrl+F` 高亮、IDE 全局搜索（BM-Horspool 内核）
- **命令行工具**：`grep` / `ag` 特征串扫描
- **正则引擎**：前缀字面量子串的快速定位（BM 思想）
- **生物信息**：DNA 序列里找 motif / 基因片段（多模式 RK）
- **入侵检测 / 反垃圾**：流量特征串、关键词命中
- **语言标准库**：`indexOf` / `str.find` 的底层实现

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">

💡 工程里很少手写——标准库多已用 BM/Sunday 等优化变体，但理解原理是面试与调优的根基。

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
工程里标准库多已用 BM 变体，但原理是面试与调优根基。
-->

---
layout: center
class: text-center
---

# 字符串匹配：复用信息，避免回溯

<div class="text-2xl mt-8 mb-12">

朴素 O(nm) → KMP / RK / BM 线性 / 亚线性

</div>

<v-click>

<div class="text-lg">

KMP 严格线性 · RK 多模式 · BM 工程最快

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/kmp" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/string-matching-slide/" target="_blank" class="text-xl icon-btn">
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
掌握三种匹配算法，就掌握了字符串查找的核心。按场景选型即可。
-->
