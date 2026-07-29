---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 回文与 Z 函数（Manacher / Z）
info: |
  ## 回文与 Z 函数（Manacher / Z）
  最长回文子串 O(n) · 扩展 KMP O(n)
  字符串两大线性算法。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 回文与 Z 函数

Manacher · Z 函数（扩展 KMP） · 两大 O(n) 字符串算法

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/manacher" target="_blank" class="icon-btn">
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
回文与 Z 函数是字符串两大线性算法。今天我们讲透 Manacher 和 Z 函数共用的「单调右端点+镜像借用」加速思想。
-->

---
transition: fade-out
---

# 回文与中心扩展 O(n²)

**回文**：正读反读都相同的子串，分奇偶两类。

<v-clicks>

- **奇长度**：中心一个字符，如 `aba`、`abcba`
- **偶长度**：中心两字符之间，如 `abba`、`abccba`
- **最长回文子串**：朴素「中心扩展」枚举 `2n-1` 个中心，每个向两侧扩展 O(n)
- **复杂度 O(n²)**：每个中心都从 0 重新扩展，不借用已算结果

</v-clicks>

<div v-click class="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**痛点**：回文有对称性，却没用上——Manacher 用「镜像借用」把它降到 O(n)。

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
中心扩展朴素就朴素在「每个中心从 0 起步」。回文天然对称，这是 Manacher 加速的切入点。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# Manacher 思想：对称性加速

::left::

**朴素**：每个中心从 0 扩展

```
abaabba  ← 每个位置都重头来
```

**Manacher**：维护最右回文 `[L,R]`，中心 `C`

<v-clicks>

- 算 `C` 右侧的 `i`（`i<R`）
- 镜像点 `j=2C-i` 已算过
- `p[i]` 至少 = `min(p[j], R-i)`
- 不必从 0 起步

</v-clicks>

::right::

<div class="text-center text-sm text-gray-500 mb-2">

预处理后以 `C` 为中心的大回文 `[L,R]`

</div>

```
下标  L        C        R
      [ . . . . . . . ]
            ↑i  (镜像 j)
```

<v-clicks>

- `i` 的半径可借 `j` 的半径
- 超过 `R` 的部分才老实扩展
- 这就是「复用已算信息」

</v-clicks>

::bottom::

<div v-click class="mt-4 text-center">

🎯 核心：**单调右端点 R + 镜像借用 + 摊还** → O(n)

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
Manacher 的核心：已算大回文内部的位置，半径可从镜像点借用初值，超过最右端 R 才真正扩展。
-->

---

# 预处理：插入分隔符统一奇偶

奇偶长度回文合并为「一个位置作中心」。

<div class="grid grid-cols-2 gap-8">
<div>

**原串**：`aba`

**预处理**（插 `#`+哨兵）：

```
^ # a # b # a # $
0 1 2 3 4 5 6 7 8
```

<v-clicks>

- `#` 隔开字符，奇偶统一
- `#` 中心 ↔ 原串偶长度回文
- 字符中心 ↔ 奇长度回文
- 哨兵 `^$` 防扩展越界

</v-clicks>

</div>
<div>

**p 数组（回文半径）**

```
p[4] = 4  (中心 b)
覆盖 #a#b#a#，半径 4
```

<v-clicks>

- `p[i]` 含中心的最长半径
- **原串回文长度 = p[i] - 1**
- `p[4]-1 = 3` = `"aba"` 长度
- 答案 = `max(p) - 1`

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ 还原原串长度别忘了 `-1`

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
插入 # 让奇偶统一，p[i]-1 还原回原串长度。这是 Manacher 最容易踩的换算坑。
-->

---

# Manacher 代码与 O(n)

<div class="grid grid-cols-2 gap-6">
<div>

```js
function manacher(s) {
  const t = ['^','#'];
  for (const c of s){t.push(c);t.push('#');}
  t.push('$');
  let C=0,R=0; const p=Array(t.length).fill(0);
  for(let i=1;i<t.length-1;i++){
    p[i]= i<R ? Math.min(p[2*C-i],R-i):1;
    while(t[i+p[i]]===t[i-p[i]]) p[i]++;
    if(i+p[i]-1>R){C=i;R=i+p[i]-1;}
  }
}
```

</div>
<div>

**O(n) 摊还分析**

<v-clicks>

- 维护最右回文右端 `R`
- `R` 单调右移，总推进 ≤ n
- 每次成功比较都让 `R` 右移
- 成功比较 ≤ n，失败 ≤ n
- 总比较 ≤ 2n → **O(n)**

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-green-50 dark:bg-green-900/20 text-sm">

✅ 借初值 `min(p[2C-i], R-i)` 省去重复比较

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
R 单调右移是线性的根源。和 Z 函数、KMP 是同一个摊还模板。
-->

---

# Z 函数：定义与示例

**z[i]** = `s` 与 `s[i:]` 的最长公共前缀长度；`z[0]` 约定 0。

<div class="grid grid-cols-2 gap-8">
<div>

**例 1**：`s = "aabaa"`

```
下标: 0 1 2 3 4
  s : a a b a a
  z : 0 1 0 2 1
```

<v-clicks>

- `z[1]=1`：`"abaa"` 与 `s` 公共前缀 `"a"`
- `z[3]=2`：`"aa"` 与 `s` 公共前缀 `"aa"`

</v-clicks>

</div>
<div>

**例 2**：`s = "ababa"`

```
下标: 0 1 2 3 4
  s : a b a b a
  z : 0 0 3 0 1
```

<v-clicks>

- `z[2]=3`：`"aba"` 与 `s="ababa"` 公共前缀 `"aba"`
- `z[4]=1`：`"a"` 与 `s` 公共前缀 `"a"`

</v-clicks>

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

又称**扩展 KMP**：比 KMP 的 `next` 更直观，直接给出「每个后缀与前缀的匹配长度」。

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
Z 函数定义：每个后缀与整串前缀的最长匹配。z[0] 约定 0 避免特判。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# Z-box 加速 O(n)

::left::

**维护 Z-box** `[l, r)`：已知 `s[l..r)===s[0..r-l)`

```js
function zFn(s) {
  const n=s.length, z=Array(n).fill(0);
  let l=0,r=0;
  for(let i=1;i<n;i++){
    if(i<r) z[i]=Math.min(z[i-l],r-i);
    while(i+z[i]<n && s[z[i]]===s[i+z[i]]) z[i]++;
    if(i+z[i]>r){l=i;r=i+z[i];}
  }
  return z;
}
```

::right::

**借初值三步**

<v-clicks>

- `i<r`：`z[i]=min(z[i-l], r-i)`
- `i>=r`：从 `0` 起步
- `while` 扩展，更新 `[l,r)`

</v-clicks>

**O(n) 摊还**

<v-clicks>

- `r` 单调右移，总推进 ≤ n
- 成功比较都让 `r` 右移
- 总比较 ≤ 2n

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ `r-i` 是「Z-box 余量」，不可漏

</div>

::bottom::

<div v-click class="mt-3 text-center">

🎯 与 Manacher 同构：**单调右端点 r + 镜像借用 + 摊还**

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
Z-box 是当前触及最右的匹配段。i 落在 r 内时从镜像位置 z[i-l] 借初值，余量 r-i 封顶。
-->

---

# Z 函数应用：匹配与周期

<div class="grid grid-cols-2 gap-8">
<div>

**① 字符串匹配**（O(n+m)）

```
pat + '#' + txt  →  求 Z
z[i] == |pat| 处即匹配
```

<v-clicks>

- 分隔符 `#` 不在字符集内
- 不需要像 KMP 维护 `next`
- 代码更短、推导更直观

</v-clicks>

</div>
<div>

**② 最小周期**

```
找最小 p 使 z[p] == n-p
（完全周期加 n%p == 0）
```

<v-clicks>

- `p` 是循环节长度
- `z[i]==n-i` → 后缀是前缀（border）
- 可判「是否由子串重复构成」

</v-clicks>

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500">

**一句话**：Z 数组 = 字符串的「自匹配雷达」，匹配 / 周期 / border 一网打尽。

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
Z 函数求匹配只需拼接加分隔符；求周期只需找 z[p]==n-p。应用面广。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# Manacher vs Z 函数

::left::

<div class="text-center text-2xl font-bold mb-3 text-blue-600">Manacher</div>

| 维度 | 内容 |
| --- | --- |
| 问题 | 最长回文子串 |
| 数组 | `p[i]` 回文半径 |
| 预处理 | 插 `#`+哨兵 |
| 借初值 | `min(p[2C-i],R-i)` |
| 右端点 | 回文右端 `R` |

::right::

<div class="text-center text-2xl font-bold mb-3 text-purple-600">Z 函数</div>

| 维度 | 内容 |
| --- | --- |
| 问题 | 前缀匹配/周期 |
| 数组 | `z[i]` 与后缀 LCP |
| 预处理 | 无（匹配拼接） |
| 借初值 | `min(z[i-l],r-i)` |
| 右端点 | Z-box 右端 `r` |

::bottom::

<div v-click class="mt-4 text-center text-lg">

🎯 共用模板：**单调右端点 + 镜像借用 + 摊还 O(n)** —— 思想完全同构

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
两者一表对照：解决的问题不同，但加速结构和线性证明完全同构。
-->

---
layout: center
class: text-center
---

# 两大线性字符串算法

<div class="text-2xl mt-8 mb-12">

复用已算信息 · 单调右端点摊还 · O(n)

</div>

<v-click>

<div class="text-lg">

Manacher 用**对称性** · Z 函数用**前缀匹配段** —— 同一个加速思想

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/manacher" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/palindrome-z-function-slide/" target="_blank" class="text-xl icon-btn">
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
掌握「单调右端点+镜像借用」的摊还模板，就理解了字符串线性算法的精髓，也是 KMP、AC 自动机的基础。
-->
