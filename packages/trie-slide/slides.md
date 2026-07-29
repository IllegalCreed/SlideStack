---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 前缀树（Trie）
info: |
  ## 前缀树（Trie / Prefix Tree）
  多叉树字符边 · 共享公共前缀 · O(L) 操作
  字符串前缀查询的「专家」。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 前缀树（Trie）

多叉树字符边 · O(L) 操作 · 前缀查询的独门绝技

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/trie" target="_blank" class="icon-btn">
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
Trie 是为字符串集合的前缀查询而生的多叉树。今天讲透它的结构、O(L) 操作、节点选型与工程应用。
-->

---
transition: fade-out
---

# Trie 是什么

一棵**多叉树**，每条边代表**一个字符**，从根到节点的路径 = 一个**字符串前缀**。

<v-clicks>

- **共享公共前缀**：`apple`/`apply` 共用 `a→p→p→l`，只在末尾分叉
- **核心权衡**：空间换时间，操作只随单词长度 L 变化，与词表规模 n 无关
- **`isEnd` 标志**：标记「到此是一个完整单词」，区分前缀中转点与单词结尾
- **前缀查询是独门绝技**：哈希表做不到，Trie 的 `startsWith` 只需 O(L)
- **应用主战场**：自动补全 / 词频统计 / IP 路由 / 拼写检查

</v-clicks>

<div v-click class="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：字符记在边上，路径即前缀，共享即省内存。

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
Trie 的一切特性都源于「多叉树 + 字符边」这一结构。共享前缀既省内存又支撑前缀查询。
-->

---
layout: two-cols-header
layoutClass: gap-x-12
---

# 结构与公共前缀压缩

::left::

**插入 `app`/`apple`/`bat` 后**

```
(root)
├ a
│ └ p
│   └ p ✦   ← "app"
│     └ l
│       ├ e ✦ ← "apple"
│       └ y ✦ ← "apply"
└ b
  └ a
    └ t ✦   ← "bat"
```

<div class="text-xs text-gray-500">✦ = isEnd=true（完整单词）</div>

::right::

**为什么省内存又快**

<v-clicks>

- `apple`/`apply` 共用 `appl`
- 前缀只存一份
- 前缀查询定位到子树
- 公共前缀少则费空间
- 极端退化时考虑压缩 Trie

</v-clicks>

::bottom::

<div v-click class="mt-4 text-center">

🎯 `startsWith("app")` 走 3 步定位子树，O(L) —— 哈希表做不到

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
公共前缀压缩是 Trie 的灵魂：省内存 + 支撑前缀查询。
-->

---

# 节点结构：isEnd + children

<div class="grid grid-cols-2 gap-8">
<div>

**核心两个字段**

```js
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false; // 完整单词标志
  }
}
```

- `children`：字符 → 子节点
- `isEnd`：是否完整单词结尾

</div>
<div>

**为什么 `isEnd` 不能省**

<v-clicks>

- 插入 `apple`，`app` 节点存在
- 但 `search("app")` 应返回 false
- 因为没单独插过 `app`
- 靠 `isEnd` 区分前缀 vs 单词

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm">

⚠️ `search` 漏查 `isEnd` 是最高频坑

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
节点就两个字段：children 映射 + isEnd 标志。isEnd 区分「前缀中转」和「完整单词」。
-->

---

# insert：逐字符向下，末尾置 isEnd

```js {all|1-3|4-7|8|all}
insert(word) {
  let node = this.root;          // 从根开始
  for (const ch of word) {
    if (!node.children.has(ch))  // 不存在就建
      node.children.set(ch, new TrieNode());
    node = node.children.get(ch);// 向下走
  }
  node.isEnd = true;             // 末尾标记为完整单词
}
```

<v-click>

<div class="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">

**要点**：①从根开始，根不存字符；②「不存在才建」，已存在复用；③末尾置 `isEnd`，重复插入幂等。**复杂度 O(L)**。

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
pre { font-size: 0.85em; }
</style>

<!--
insert 三步：从根走、缺则建、末尾置 isEnd。
-->

---

# search vs startsWith：差一个 isEnd

<div class="grid grid-cols-2 gap-8">
<div>

**search（完整单词）**

```js
search(word) {
  let node = this.root;
  for (const ch of word) {
    if (!node.children.has(ch))
      return false;
    node = node.children.get(ch);
  }
  return node.isEnd; // 必查
}
```

</div>
<div>

**startsWith（前缀搜索）**

```js
startsWith(pre) {
  let node = this.root;
  for (const ch of pre) {
    if (!node.children.has(ch))
      return false;
    node = node.children.get(ch);
  }
  return true; // 不查 isEnd
}
```

</div>
</div>

<div v-click class="mt-2 text-center">

🎯 两者代码几乎一样，**唯一差别**是结尾 `return node.isEnd` vs `return true`

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
search 和 startsWith 唯一区别：走完路径后是否检查 isEnd。
-->

---

# 复杂度 O(L)：与词表规模 n 无关

<div class="grid grid-cols-2 gap-8">
<div>

**Trie 操作复杂度**

| 操作 | 时间 |
| --- | --- |
| `insert` | **O(L)** |
| `search` | **O(L)** |
| `startsWith` | **O(L)** |
| `delete` | **O(L)** |

<div class="text-sm text-gray-500 mt-2">L = 单词长度，n = 词表规模</div>

</div>
<div>

**对比哈希表 / BST**

<v-clicks>

- 哈希表查找也 O(L)
- 但**无前缀查询能力**
- BST 查找是 O(L log n)
- Trie 每字符 O(1) 定位子节点
- 前缀查询是 Trie 独有优势

</v-clicks>

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**关键洞察**：词表 1 万还是 1 亿，查 `apple` 都是走 5 步——这是「空间换时间」换来的。

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
Trie 的复杂度与词表规模无关，这是它对比 BST 的核心优势。
-->

---

layout: two-cols-header
layoutClass: gap-x-12
---

# children 选型：Map 通用 vs Array[26]

::left::

**Map 版（通用）**

```js
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}
```

- 适配任意字符集
- Unicode / 中文友好
- 哈希常数大、缓存差

::right::

**Array[26] 版（纯小写字母）**

```js
class TrieNode {
  constructor() {
    this.children = new Array(26).fill(null);
    this.isEnd = false;
  }
}
// idx = ch.charCodeAt(0) - 97
```

- O(1) 下标、缓存友好
- 竞速题首选
- 只适合小字符集，空槽费空间

::bottom::

<div v-click class="mt-4 text-center">

🎯 选型：**小字符集（a-z）→ Array[26]；大/可变字符集 → Map**

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
两种实现各有适用场景。Array[26] 快但只适合小字符集，Map 通用但常数大。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# 应用：前缀查询是 Trie 独有优势

::left::

| 场景 | Trie |
| --- | --- |
| 自动补全 | ✅ |
| 词频统计 | ✅ |
| 拼写检查 | ✅ |
| IP 路由 LPM | ✅ |
| 精确查整词 | ❌ 哈希表更优 |

::right::

**为什么哈希表做不到前缀查询**

<v-clicks>

- 哈希表按整词做键
- 无法高效回答
- 「以 app 开头的单词有哪些」
- 只能遍历全部 O(n·L)
- Trie 用子树定位 O(L)

</v-clicks>

::bottom::

<div v-click class="mt-6 text-center text-lg">

🎯 一句话：**要前缀 / 字典序 / 最长前缀匹配 → Trie；只要精确查整词 → 哈希表**

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
table { font-size: 0.9em; }
</style>

<!--
前缀查询是 Trie 的独门绝技。这是它存在的根本理由。
-->

---

# 进阶：压缩 Trie / Radix Tree

普通 Trie 痛点：**单链路径费节点**（一个子节点的连续中转点）。

<div class="grid grid-cols-2 gap-8">
<div>

**压缩 Trie（Radix Tree）**

<v-clicks>

- 把单链路径压成「多字符节点」
- 节点数大幅减少
- 省内存、缓存更友好
- 插入/删除要在边上分裂合并

</v-clicks>

</div>
<div>

**工程应用**

<v-clicks>

- Linux 内核 radix tree（页缓存）
- Go `httprouter` 路由匹配
- Nginx location 路由
- AC 自动机的底座是 Trie

</v-clicks>

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

**升级路径**：空间爆炸 → 压缩 Trie（Radix Tree）；多模式匹配 → AC 自动机（Trie + fail 指针）。

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
压缩 Trie 解决空间痛点。后端路由库普遍用它做高效前缀匹配。
-->

---
layout: center
class: text-center
---

# Trie：字符串前缀查询的专家

<div class="text-2xl mt-8 mb-12">

多叉树字符边 → 共享前缀 → O(L) 操作

</div>

<v-click>

<div class="text-lg">

自动补全 · 词频统计 · IP 路由 · 拼写检查 · AC 自动机 都建在 Trie 之上

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/trie" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/trie-slide/" target="_blank" class="text-xl icon-btn">
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
Trie 是字符串前缀查询的专家。掌握它的结构、O(L) 操作和节点选型，后续 AC 自动机、路由匹配就有了根基。
-->
