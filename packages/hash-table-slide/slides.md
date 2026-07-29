---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 哈希表
info: |
  ## 哈希表（Hash Table）
  键值映射 · 平均 O(1) · 空间换时间
  数据结构里的「字典」。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 哈希表

键值映射 · 平均 O(1) 查找 · 空间换时间

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/hash" target="_blank" class="icon-btn">
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
哈希表是把「按 key 查找」做到平均 O(1) 的数据结构，今天讲透它的映射模型、冲突解决与工程实现。
-->

---
transition: fade-out
---

# 哈希表是什么

一个**键值对映射**容器，用**哈希函数**把 key 算成桶数组下标，从而按 key O(1) 存取。

<v-clicks>

- **两步走**：`index = hash(key) % capacity` → 在 `bucket[index]` 存取 value
- **核心权衡**：平均 O(1) 查/插/删 ✅  vs  最坏 O(n) 全冲突 ❌
- **空间换时间**：桶数组有空槽，用内存换 O(1) 速度
- **万物之字典**：Python dict / Java HashMap / JS Map / C++ unordered_map 都是它

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：哈希函数把「按 key 查」翻译成「按下标查」，继承数组的 O(1)。

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
哈希表的精髓在于用哈希函数把任意 key 压缩成数组下标，复用数组的 O(1) 随机访问。
-->

---

# 核心操作：平均 O(1)

```
key ──hash()──> 整数 ──% capacity──> 桶下标 ──> bucket[index] 存 value
```

<div class="grid grid-cols-2 gap-8">
<div>

```js {all|1-3|5-12|all}
class HashTable {
  put(key, value) {
    const i = this._index(key);
    const chain = this.buckets[i];
    for (const n of chain) {
      if (n.key === key) {
        n.value = value; return;
      }
    }
    chain.push({ key, value });
    this.size++;
  }
}
```

</div>
<div>

**复杂度**

| 操作 | 平均 | 最坏 |
| --- | --- | --- |
| 查找 | **O(1)** | O(n) |
| 插入 | **O(1)** | O(n) |
| 删除 | **O(1)** | O(n) |

<v-click>

<div class="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm">

⚠️ 最坏 O(n)：全冲突退化链表

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
pre { font-size: 0.72em; }
table { font-size: 0.85em; }
</style>

<!--
平均 O(1) 的前提是哈希均匀 + 负载因子低。最坏 O(n) 在全冲突时发生。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 哈希函数与桶数组

::left::

**好哈希函数四标准**

<v-clicks>

- **确定性**：同 key 永远同结果
- **均匀分布**：key 散满所有桶
- **高效**：计算 O(1)
- **雪崩效应**：1 bit 变 → 半数 bit 翻转

</v-clicks>

::right::

**经典构造法**

```js
// 除留余数法（m 取素数）
hash(key) = key % m

// 字符串哈希（Java hashCode）
h = 31 * h + char   // base = 31

// 乘法哈希（A ≈ 0.618）
hash = m × ((key×A) mod 1)
```

::bottom::

<div v-click class="mt-4 text-center">

⚠️ 除留余数 `m` 必须取**素数**——取 2 的幂会丢高位，产生聚集

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
哈希函数质量决定冲突频率。除留余数要素数、字符串用多项式 31。
-->

---

# 冲突必然性：鸽巢原理

<v-clicks>

- **鸽巢原理**：n+1 只鸽子进 n 个巢，必有 ≥1 巢挤 ≥2 只

</v-clicks>

<v-clicks>

- key 取值空间 ≫ 桶数 → **冲突不可避免**
- 好哈希只能「减少」冲突，不能「消灭」
- 解决两大流派：**链地址法** / **开放寻址法**

</v-clicks>

<div v-click class="mt-6 p-4 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">

**冲突解决决定哈希表的性能下限**：链地址法挂链表/红黑树，开放寻址法探测空槽。

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
鸽巢原理是哈希表绕不开的数学事实。冲突只能解决，不能消灭。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 链地址法 vs 开放寻址法

::left::

**链地址法**

每桶挂一条链表

```
[0] -> (k1) -> (k2)
[1] -> (k3)
[2] -> null
```

<v-clicks>

- 负载因子可 >1
- 删除直接摘节点
- 链表长 → 转红黑树

</v-clicks>

::right::

**开放寻址法**

冲突时在数组里探测空槽

```
线性: +1, +2, +3 ...
二次: +1², +2² ...
双重哈希: +i×h2(key)
```

<v-clicks>

- 负载因子必须 <1
- 删除用墓碑标记
- 线性探测有聚集问题

</v-clicks>

::bottom::

<div v-click class="mt-4 text-center">

🎯 Java HashMap / C++ unordered_map 用**链地址**；Python dict 用**开放寻址**

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
两大冲突解决流派。链地址法实现简单抗冲突强，开放寻址缓存友好。
-->

---

# 负载因子与 rehash

**负载因子** = 元素数 / 桶数 ——衡量桶有多满。

<div class="grid grid-cols-2 gap-8">
<div>

```js
// 超阈值就 rehash
if (size / buckets.length > loadFactor) {
  rehash();  // 桶 ×2 + 重新哈希
}
```

<v-clicks>

- Java HashMap：0.75
- Python dict：~0.66
- C++ unordered_map：1.0
- 开放寻址必须 <1

</v-clicks>

</div>
<div>

**为什么 rehash 要重新哈希**

<v-clicks>

- 下标 = `hash % capacity`
- capacity 变了 → 下标全变
- 不能拷贝，必须重算

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-blue-50 dark:bg-blue-900/20 text-sm">

⚡ 单次 rehash O(n)，几何扩容下**摊还 O(1)**（同动态数组）

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
负载因子是冲突的温度计。超阈值翻倍桶 + 重新哈希，摊还 O(1)。
-->

---

# 工程实现：Java HashMap 红黑树

链地址法兜底：链表过长就转红黑树，把最坏从 O(n) 压到 O(log n)。

| 条件 | 动作 |
| --- | --- |
| 链表 **≥ 8** 且桶数 **≥ 64** | 链表 → 红黑树 |
| 链表 **≥ 8** 但桶数 **< 64** | 触发 rehash（不转树） |
| 红黑树节点 **≤ 6** | 红黑树 → 链表 |

<div v-click class="mt-6 p-4 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">

**为什么是 8**：泊松分布下，负载因子 0.75 且哈希均匀时，单桶 8 节点的概率约 `6×10⁻⁸`——几乎只在哈希碰撞攻击时触发，红黑树是「防线」。

</div>

<div v-click class="mt-2 text-center text-sm">

防御哈希碰撞 DoS 攻击：恶意构造大量冲突 key 让链表变长

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
Java 8 HashMap 的红黑树转换是面试高频考点。阈值 8 源于泊松分布。
-->

---

# 应用：两数之和 O(n²) → O(n)

边遍历边把 `值 → 下标` 存哈希表，查 `target - 当前值`。

<div class="grid grid-cols-2 gap-8">
<div>

```js {all|1-2|3-7|all}
function twoSum(nums, target) {
  const m = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (m.has(need)) {
      return [m.get(need), i];
    }
    m.set(nums[i], i);  // 边查边存
  }
  return [];
}
```

</div>
<div>

**哈希表六大应用**

<v-clicks>

- **去重**（Set）
- **计数**（key → 次数）
- **两数之和**（空间换时间）
- **缓存**（LRU 哈希+链表）
- **一致性哈希**（分布式路由）
- **布隆过滤器**（防缓存穿透）

</v-clicks>

</div>
</div>

<div v-click class="mt-2 text-center text-sm">

⚠️ JS 做哈希表优先用 `Map`（任意类型 key、保序、无原型污染）而非 `Object`

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
两数之和是哈希表最经典的应用——把暴力双循环 O(n²) 优化到 O(n)。
-->

---
layout: center
class: text-center
---

# 哈希表是按 key 查找的极致

<div class="text-2xl mt-8 mb-12">

哈希函数映射 → 平均 O(1) → 空间换时间

</div>

<v-click>

<div class="text-lg">

去重 · 计数 · 两数之和 · 缓存 · 一致性哈希 都靠它

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/hash" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/hash-table-slide/" target="_blank" class="text-xl icon-btn">
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
掌握了哈希表的映射模型、冲突解决与工程应用，就有了把 O(n²) 优化到 O(n) 的核心武器。
-->
