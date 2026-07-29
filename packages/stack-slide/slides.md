---
theme: seriph
background: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2048
title: 栈
info: |
  ## 栈（Stack）
  后进先出 · 单端操作 O(1) · 回溯与嵌套的载体
  数据结构里的「控制中枢」。
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 栈

后进先出 · 单端 O(1) · 回溯与嵌套的载体

<div class="abs-br m-6 text-xl">
  <a href="https://algo.illegalscreed.cn/docs/stack" target="_blank" class="icon-btn">
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
栈是后进先出的受限线性表，今天我们讲透它的LIFO本质、两大实现、经典应用和单调栈套路。
-->

---
transition: fade-out
---

# 栈是什么

一种**后进先出（LIFO）**的受限线性表，只允许在**栈顶**一端 push/pop。

<v-clicks>

- **核心规则**：最后压入的最先弹出（入 1,2,3 → 出 3,2,1）
- **操作全部 O(1)**：push / pop / peek 只碰栈顶
- **访问受限**：想看栈顶下方，必须先弹掉上面的
- **语义载体**：回溯、撤销、嵌套的天然抽象

</v-clicks>

<div v-click class="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500">

**一句话**：LIFO ⇒ 只动栈顶 ⇒ 操作 O(1)，但牺牲了随机访问。

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
栈的一切源于LIFO约束。单端操作换来O(1)效率，代价是失去随机访问。
-->

---
layout: two-cols-header
layoutClass: gap-x-16
---

# 顺序栈 vs 链式栈

::left::

<div class="text-center text-2xl font-bold mb-4 text-blue-600">顺序栈（数组）</div>

- **栈顶**：数组尾部 + `top` 指针
- push：`a[++top] = x`
- pop：`return a[top--]`
- **缓存友好**（连续内存）
- 固定容量会**栈溢出**
- 动态扩容摊还 O(1)

::right::

<div class="text-center text-2xl font-bold mb-4 text-purple-600">链式栈（链表）</div>

- **栈顶**：链表头结点
- push：头插（新节点→头）
- pop：头删（头改为 head.next）
- **无容量上限**（受内存）
- 无扩容开销
- 每节点多一个指针

::bottom::

<div v-click class="mt-6 text-center text-lg">

🎯 选型：日常用顺序栈（简单+缓存友好）；频繁扩容敏感用链式栈

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
顺序栈用数组尾部+top指针，链式栈用链表头。两种实现都O(1)，工程多用顺序栈。
-->

---

# 核心操作：push / pop / peek

全部 O(1)，只动栈顶一个位置。

<div class="grid grid-cols-2 gap-8">
<div>

```js
class ArrayStack {
  constructor() { this.data = []; this.top = -1; }
  push(x) { this.data[++this.top] = x; }
  pop()   { return this.data[this.top--]; }
  peek()  { return this.data[this.top]; }
  empty() { return this.top === -1; }
}
```

</div>
<div>

**操作复杂度**

| 操作 | 复杂度 |
| --- | --- |
| push | **O(1)** |
| pop | **O(1)** |
| peek | **O(1)** |
| 访问第k个 | O(k) |

<v-click>

JS 数组当栈：`push`/`pop` 即栈操作

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
pre { font-size: 0.78em; }
table { font-size: 0.85em; }
</style>

<!--
栈API极简：push/pop/peek都是O(1)。JS直接用数组的push/pop。
-->

---

# 括号匹配：栈的「最近配对」

遇左括号入栈，遇右括号弹栈顶检查配对。

<div class="grid grid-cols-2 gap-8">
<div>

```js
function isValid(s) {
  const pair = {')':'(',']':'[','}':'{'};
  const st = [];
  for (const ch of s) {
    if ('([{'.includes(ch)) st.push(ch);
    else if (st.pop() !== pair[ch])
      return false;
  }
  return st.length === 0;
}
```

</div>
<div>

**为什么用栈**

<v-clicks>

- 括号要配**最近**的左括号
- 嵌套越深越晚匹配 = LIFO
- 两种不合法：
  - 类型不匹配 `(]`
  - 末尾栈非空 `(()`

</v-clicks>

</div>
</div>

<div v-click class="mt-4 text-center text-sm">

**多种括号必须用栈**；单一括号 `()` 可用计数器代替

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
括号匹配是LIFO的典型：最近的左括号先配对。末尾必须判栈空。
-->

---

# 后缀表达式（逆波兰）求值

运算符在操作数后面，无需括号、无需优先级，O(n) 算完。

<div class="grid grid-cols-2 gap-8">
<div>

```js
function evalRPN(tokens) {
  const st = [];
  for (const t of tokens) {
    if ('+-*/'.includes(t)) {
      const b = st.pop(); // 右操作数
      const a = st.pop(); // 左操作数
      st.push(calc(a, b, t));
    } else st.push(+t);
  }
  return st.pop();
}
```

</div>
<div>

**核心规则**

<v-clicks>

- 数字 → 入栈
- 运算符 → 弹两个算完压回
- 栈中唯一元素 = 结果
- ⚠️ 先弹是 b，后弹是 a
- 减法/除法顺序不能反

</v-clicks>

</div>
</div>

<div v-click class="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm">

**两步求值**：中缀 → 后缀（调度场算法）→ RPN 求值，全程 O(n)

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
后缀求值：数字入栈，运算符弹两操作数。弹栈顺序是易错点：先b后a。
-->

---

# 单调栈：找下一个更大元素

栈内保持单调，把「下一个更大」从 O(n²) 降到 **O(n)**。

<div class="grid grid-cols-2 gap-8">
<div>

```js
function nextGreater(nums) {
  const ans = new Array(nums.length).fill(-1);
  const st = []; // 存下标
  for (let i = 0; i < nums.length; i++) {
    while (st.length && nums[i] > nums[at(st)])
      ans[st.pop()] = nums[i];
    st.push(i);
  }
  return ans;
}
const at = st => st[st.length - 1];
```

</div>
<div>

**原理**

<v-clicks>

- 栈维护「还没找到更大的」元素
- 当前 x 比栈顶大 → 栈顶找到了
- 弹出并记录，保持**单调递减**
- 每元素入出各一次 → O(n)

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm">

⚠️ 找更大用**递减**栈；求距离存**下标**

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
单调栈核心：找更大用递减栈，当前更大时弹栈顶结算。每元素入出各一次=O(n)。
-->

---

# 柱状图最大矩形

对每根柱子，找左右第一个更矮的，宽 × 高 = 面积。单调递增栈。

<div class="grid grid-cols-2 gap-6">
<div>

```js
function largestRA(h) {
  const st = []; let max = 0;
  for (let i = 0; i <= h.length; i++) {
    const cur = i === h.length ? 0 : h[i];
    while (st.length && cur < h[at(st)]) {
      const height = h[st.pop()];
      const left = st.length ? at(st) : -1;
      max = Math.max(max, height * (i - left - 1));
    }
    st.push(i);
  }
  return max;
}
const at = st => st[st.length - 1];
```

</div>
<div>

**关键点**

<v-clicks>

- 用**递增**栈（找更矮）
- 弹出柱的右界 = 当前 i
- 弹出后的新栈顶 = 左界
- 宽 = `i - left - 1`
- **哨兵**：i 走到 n（高 0）强制清栈

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
pre { font-size: 0.68em; }
</style>

<!--
柱状图矩形：递增栈找左右更矮，宽=i-left-1。哨兵技巧避免结尾单独清栈。
-->

---

# 函数调用栈：递归的物理基础

每次调用压栈帧（参数/局部变量/返回地址），返回弹栈。

<div class="grid grid-cols-2 gap-8">
<div>

```js
// 递归 = 隐式用调用栈
function fact(n) {
  if (n <= 1) return 1;     // 基线
  return n * fact(n - 1);   // 压栈
}
// fact(3) 栈演化：
//   调用: fact(3)→fact(2)→fact(1)
//   栈顶: [fact(1)]
//   归:  1 → 2*1=2 → 3*2=6
```

</div>
<div>

**三个推论**

<v-clicks>

- 递归深度 = 调用栈深度（受栈大小限制）
- 无终止条件 → **栈溢出**
- 任何递归可改 **迭代+显式栈**
- DFS 天然用栈

</v-clicks>

<div v-click class="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">

⚠️ 递归太深（如 10⁶ 层）→ 改迭代用堆上栈

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
递归的「递」是压栈，「归」是弹栈。深度受调用栈大小限制，可改迭代+显式栈。
-->

---
layout: center
class: text-center
---

# 栈：回溯与嵌套的载体

<div class="text-2xl mt-8 mb-12">

LIFO → 单端 O(1) → 承载回溯语义

</div>

<v-click>

<div class="text-lg">

括号匹配 · 表达式求值 · 函数调用栈 · 单调栈 · 撤销/浏览器

</div>

</v-click>

<div class="abs-br m-6 flex gap-3">
  <a href="https://algo.illegalscreed.cn/docs/stack" target="_blank" class="text-xl icon-btn">
    <carbon:dashboard /> 可视化
  </a>
  <a href="/SlideStack/stack-slide/" target="_blank" class="text-xl icon-btn">
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
栈是回溯与嵌套的语义载体。掌握LIFO本质+单调栈套路，后续递归/DFS/表达式都有了根基。
-->
