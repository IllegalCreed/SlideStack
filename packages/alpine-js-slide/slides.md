---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Alpine.js
info: |
  Presentation Alpine.js 3 for frontend developers.

  Learn more at [https://alpinejs.dev](https://alpinejs.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:alpinejs-icon class="text-7xl" />
</div>

<br/>

## Alpine.js 3：Sprinkle JS，HTML 上的 jQuery

15 个指令 + 9 魔术属性，让 SSR 页面零构建获得响应式交互

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Alpine.js 3。

Caleb Porzio 创建的极轻量框架，自我定位「Sprinkle JS——HTML 上的 jQuery」。
给服务端渲染页面加交互，与 Laravel / Rails / Django / WordPress 生态深度配合。
-->

---
transition: fade-out
---

# 什么是 Alpine.js？

Caleb Porzio 主导的极轻量 JS 框架，~16KB（gzip ~7KB），HTML-first

<v-click>

- **Sprinkle JS 定位**：给 SSR 页面「撒点」客户端交互——不是写 SPA
- **15 个指令 + 9 魔术属性**：与 Vue 早期一脉相承，把 `v-` 换成 `x-`
- **零构建可用**：一行 `<script defer src=".../alpine.min.js">` 就能用全部能力
- **响应式底层**：用 Vue 3 同款 `@vue/reactivity`，体验丝滑
- **9 个官方插件**：Persist / Intersect / Mask / Morph / Focus / Anchor / Sort / Collapse / Resize
- **与后端框架配合佳**：Laravel + Livewire + Tailwind = TALL Stack 标配
- **与 HTMX 互补**：HTMX 换 HTML，Alpine 处理客户端交互

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_alpinejs.dev_](https://alpinejs.dev/)

</div>

<style>
h1 {
  background-color: #2D3441;
  background-image: linear-gradient(45deg, #2D3441 10%, #77C1D2 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---
transition: slide-up
level: 2
---

# 评价

包体极小、零构建可用，但不是 SPA 框架

<v-clicks>

**优点**
- 包体 ~7KB（gzip），首屏几乎零开销
- 零构建工具：CDN 一行就用，不需要 webpack / Vite
- 学习曲线极平缓，15 指令 + 9 magic 看一遍就会
- 与后端框架完美配合（Laravel / Rails / Django）
- 响应式底层用 Vue 3 reactivity，体验可靠
- 9 个官方插件覆盖常见 SPA 交互

**缺点**
- 不适合 SPA（没有路由 / SSR / 数据流方案）
- HTML 模板能力有限，复杂表达式难读
- 无 SFC / 无 props 类型推导，TS 支持是编辑器插件级
- 调试体验弱，没有 Vue DevTools 那样的专属工具
- 性能边界：1000+ 列表 + 频繁更新场景吃力
- 生态规模远小于 React / Vue

</v-clicks>

---
transition: slide-up
---

# Caleb Porzio 与 Laravel 生态

Alpine + Livewire 同一作者，TALL Stack 创立者

<v-click>

- **Caleb Porzio**：Laravel 社区知名开发者，前 Tighten 工程师
- **2019.11**：发布 Alpine 1.0，对标「HTML 友好版 Vue」
- **2020.7**：Alpine 2.0 + Livewire 1.0 双双发布
- **2021.5**：Alpine 3.0 重写为 ESM 架构
- **2024.1**：Alpine 3.14，当前主流稳定版

</v-click>

<v-click>

**TALL Stack** = **T**ailwind + **A**lpine + **L**aravel + **L**ivewire

| 角色 | 工具 |
|---|---|
| 样式 | Tailwind CSS |
| 前端交互 | Alpine.js |
| 后端 | Laravel |
| 实时 UI | Livewire |

</v-click>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 关键特性 |
|---|---|---|
| **1.0** | 2019.11 | Caleb Porzio 首次发布；10 个指令 |
| **2.0** | 2020.7 | `$store` 引入；性能优化 |
| **3.0** | 2021.5 | 重写 ESM 架构；魔术属性 / 插件系统 |
| **3.4** | 2021.10 | x-modelable / x-teleport |
| **3.10** | 2022.5 | x-effect / Morph 改进 |
| **3.13** | 2023.10 | Sort 插件 / Anchor 插件 |
| **3.14** | 2024.1 | Morph 算法 / x-bind 性能提升 |

<v-click>

**今天主要讲 3.14**。生产环境推荐锁版本 `@3.14.1`，新项目用 `@3.x.x`。

</v-click>

---
transition: slide-up
---

# Alpine vs Vue vs jQuery vs HTMX

定位差异决定选型

| 维度 | Alpine 3 | Vue 3 | jQuery | HTMX |
|---|---|---|---|---|
| 自我定位 | Sprinkle JS | UI 框架 | DOM 库 | HATEOAS |
| 适合场景 | SSR 加交互 | SPA / SFC | 老网页 | 后端换片段 |
| 包体（gzip） | **~7KB** | ~25KB | ~30KB | ~10KB |
| 响应式 | **有** | 有 | 无 | 无 |
| 模板系统 | HTML 属性 | SFC | 字符串 | 服务端模板 |
| 构建工具 | **不需要** | Vite | 不需要 | 不需要 |
| SPA 路由 | 无 | Vue Router | 无 | 无 |

<v-click>

**经验**：

- 新项目纯前端 SPA → Vue / React / Solid
- 后端框架 + 想加点客户端交互 → **Alpine.js**
- Rails 7 默认栈 / Hotwire → Stimulus
- HTMX 项目 → Alpine.js（互补搭档）

</v-click>

---
transition: slide-up
---

# 安装：方法 A —— CDN（90% 场景）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <!-- 必须有 defer -->
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body>
  <div x-data="{ count: 0 }">
    <button @click="count++">Clicked <span x-text="count"></span></button>
  </div>
</body>
</html>
```

<v-click>

**关键点**：

- `defer` 必须加——让 Alpine 在 HTML 解析完后启动
- CDN 版会自动 `Alpine.start()`，不要手动调
- 生产环境锁版本：`@3.14.1` 而不是 `@3.x.x`

</v-click>

---
transition: slide-up
---

# 安装：方法 B —— NPM + 打包器

```bash
pnpm add alpinejs
```

```js
// src/main.js
import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'
import intersect from '@alpinejs/intersect'

// 注册插件
Alpine.plugin(persist)
Alpine.plugin(intersect)

// 注册 data / store
Alpine.data('counter', () => ({ count: 0, increment() { this.count++ } }))
Alpine.store('cart', { items: [] })

// 暴露 + 启动
window.Alpine = Alpine
Alpine.start()
```

<v-click>

::: tip
所有扩展（data / store / plugin）必须在 `Alpine.start()` **之前**注册。
:::

</v-click>

---
transition: slide-up
---

# 最小示例：3 个指令打天下

```html
<!-- 计数器 -->
<div x-data="{ count: 0 }">
  <button @click="count++">+1</button>
  <span x-text="count"></span>
</div>

<!-- 下拉 -->
<div x-data="{ open: false }" @click.outside="open = false">
  <button @click="open = !open">Menu</button>
  <div x-show="open" x-transition>
    <a>About</a>
    <a>Contact</a>
  </div>
</div>
```

<v-click>

3 个核心：

- `x-data="{ ... }"` —— 响应式 scope
- `@click="..."` —— 事件监听（`x-on:click` 简写）
- `x-text="..."` —— 文本绑定

</v-click>

---
transition: slide-up
---

# 15 个指令：概览

<div class="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">

<div><b>x-data</b><br/>响应式 scope</div>
<div><b>x-init</b><br/>初始化逻辑</div>
<div><b>x-show</b><br/>切换显示</div>

<div><b>x-bind / :</b><br/>属性绑定</div>
<div><b>x-on / @</b><br/>事件监听</div>
<div><b>x-text</b><br/>渲染文本</div>

<div><b>x-html</b><br/>渲染 HTML</div>
<div><b>x-model</b><br/>双向绑定</div>
<div><b>x-modelable</b><br/>暴露给 x-model</div>

<div><b>x-for</b><br/>列表渲染</div>
<div><b>x-transition</b><br/>过渡动画</div>
<div><b>x-effect</b><br/>响应式副作用</div>

<div><b>x-ignore</b><br/>跳过初始化</div>
<div><b>x-ref</b><br/>引用 DOM</div>
<div><b>x-cloak</b><br/>隐藏未初始化</div>

<div><b>x-teleport</b><br/>DOM 传送</div>
<div><b>x-if</b><br/>条件渲染</div>
<div><b>x-id</b><br/>唯一 ID</div>

</div>

<v-click>

**3 个必须配 `<template>`**：`x-for` / `x-if` / `x-teleport`

</v-click>

---
transition: slide-up
---

# x-data：响应式作用域

```html
<!-- 内联对象 -->
<div x-data="{ open: false, count: 0 }">
  <button @click="open = !open">Toggle</button>
</div>

<!-- 空作用域（仅启用指令） -->
<button x-data @click="alert('Hi')">Click</button>

<!-- 引用 Alpine.data() 注册的组件 -->
<div x-data="dropdown">
  <button @click="toggle">Menu</button>
  <div x-show="open">...</div>
</div>
```

<v-click>

```js
Alpine.data('dropdown', () => ({
  open: false,
  init() { console.log('mounted') },      // 自动调用
  destroy() { console.log('cleanup') },   // 自动调用
  toggle() { this.open = !this.open },
}))
```

</v-click>

---
transition: slide-up
---

# x-bind / `:`：属性绑定

```html
<!-- 简写 -->
<input :placeholder="placeholderText">

<!-- 布尔属性 -->
<button :disabled="loading">Save</button>

<!-- class 对象 -->
<div :class="{ 'active': isActive, 'error': hasError }">

<!-- class 三元 -->
<div :class="isActive ? 'active' : ''">

<!-- 与已有 class 合并 -->
<div class="opacity-50" :class="hide && 'hidden'">

<!-- style 对象 -->
<div :style="{ color: 'red', fontSize: '14px' }">

<!-- 批量绑定 -->
<button x-bind="commonButtonProps">Click</button>
```

---
transition: slide-up
---

# x-on / `@`：事件监听 + 修饰符

```html
<!-- 基础 -->
<button @click="count++">+1</button>

<!-- 事件修饰符 -->
<form @submit.prevent="save">                <!-- preventDefault -->
<button @click.stop="...">                   <!-- stopPropagation -->
<div @click.outside="close">                 <!-- 元素外触发 -->
<div @keyup.escape.window="closeAll">        <!-- window 监听 -->
<button @click.once="init">                  <!-- 仅一次 -->
<input @input.debounce.500ms="search">       <!-- 防抖 -->
<div @scroll.throttle.100ms="onScroll">      <!-- 节流 -->

<!-- 键盘修饰符 -->
<input @keyup.enter="submit">
<input @keyup.shift.enter="submitNewline">
<input @keyup.cmd.k="openSearch">
```

<v-click>

**`.outside`** 是 Alpine 杀手锏——点击元素外部触发，不需要手动写 document click + 比较 target。

</v-click>

---
transition: slide-up
---

# x-model：双向绑定

```html
<input x-model="message">
<textarea x-model="description"></textarea>

<!-- 复选框：布尔 / 数组 -->
<input type="checkbox" x-model="agreed">
<input type="checkbox" value="apple" x-model="fruits">
<input type="checkbox" value="banana" x-model="fruits">

<!-- select 单选 / 多选 -->
<select x-model="country">...</select>
<select multiple x-model="tags">...</select>

<!-- range（带数字转换） -->
<input type="range" min="0" max="100" x-model.number="volume">
```

<v-click>

**修饰符**：

- `.lazy` —— change 而非 input
- `.number` —— 转数字
- `.boolean` —— 转布尔
- `.debounce.500ms` / `.throttle.500ms`
- `.fill` —— 用 value 属性回填空 state

</v-click>

---
transition: slide-up
---

# x-for：列表渲染

```html
<!-- 数组 + key -->
<template x-for="item in items" :key="item.id">
  <li x-text="item.name"></li>
</template>

<!-- 带索引 -->
<template x-for="(item, index) in items" :key="item.id">
  <li>
    <span x-text="index + 1"></span>. <span x-text="item.name"></span>
  </li>
</template>

<!-- 对象 -->
<template x-for="(value, key) in user" :key="key">
  <li><b x-text="key"></b>: <span x-text="value"></span></li>
</template>

<!-- 范围 -->
<template x-for="i in 10">
  <span x-text="i"></span>
</template>
```

<v-click>

**两条铁律**：

- 必须用 `<template>` 包裹
- 内部只能有**一个根元素**

</v-click>

---
transition: slide-up
---

# x-show vs x-if

```html
<!-- x-show：CSS display: none，元素保留 -->
<div x-show="open">Content</div>

<!-- x-if：DOM 增删（必须 template） -->
<template x-if="open">
  <div>Content</div>
</template>
```

<v-click>

| 维度 | `x-show` | `x-if` |
|---|---|---|
| 实现 | `display: none` | DOM 增删 |
| 元素存在 | 始终在 DOM | 切换新建/移除 |
| 性能 | 切换快 | 销毁重建有成本 |
| 适合 | 频繁切换 | 不常切换 / 重内容 |
| 容器要求 | 任意 | 必须 `<template>` |

</v-click>

<v-click>

**经验**：频繁切换的 modal / dropdown 用 `x-show`；不常出现的复杂面板用 `x-if`。

</v-click>

---
transition: slide-up
---

# x-transition：过渡动画

```html
<!-- 默认（fade + scale） -->
<div x-show="open" x-transition>Content</div>

<!-- 时长 -->
<div x-show="open" x-transition.duration.500ms>...</div>

<!-- 分别控制 enter / leave -->
<div x-show="open"
  x-transition:enter.duration.500ms
  x-transition:leave.duration.300ms>...</div>

<!-- 仅淡入淡出 -->
<div x-show="open" x-transition.opacity>...</div>

<!-- 自定义 scale -->
<div x-show="open" x-transition.scale.80>...</div>
```

<v-click>

```html
<!-- 与 Tailwind 配合：自定义类 -->
<div x-show="open"
  x-transition:enter="transition ease-out duration-300"
  x-transition:enter-start="opacity-0 scale-90"
  x-transition:enter-end="opacity-100 scale-100"
  x-transition:leave="transition ease-in duration-200"
  x-transition:leave-start="opacity-100 scale-100"
  x-transition:leave-end="opacity-0 scale-90">
  ...
</div>
```

</v-click>

---
transition: slide-up
---

# x-effect vs $watch

```html
<!-- x-effect：自动追踪表达式中的依赖 -->
<div x-data="{ a: 1, b: 2 }"
     x-effect="document.title = `${a} + ${b} = ${a + b}`">
  <button @click="a++">a++</button>
  <button @click="b++">b++</button>
</div>
```

<v-click>

```html
<!-- $watch：显式指定属性 + 拿新旧值 -->
<div x-data="{
  search: '',
  init() {
    this.$watch('search', (value, oldValue) => {
      console.log(`${oldValue} → ${value}`)
    })
  }
}">
  <input x-model="search">
</div>
```

</v-click>

<v-click>

| 维度 | `x-effect` | `$watch` |
|---|---|---|
| 依赖 | 自动追踪 | 显式指定 |
| 触发 | 首次 + 依赖变化 | 仅依赖变化 |
| 旧值 | 无 | 有 `(new, old)` |

</v-click>

---
transition: slide-up
---

# x-ref + $refs：引用 DOM

```html
<div x-data>
  <input x-ref="email" type="email">
  <button @click="$refs.email.focus()">Focus</button>
</div>
```

<v-click>

```html
<div x-data="{
  items: [],
  async load() {
    this.items = await fetch('/items').then(r => r.json())
    await this.$nextTick()                       <!-- 等 DOM 更新完 -->
    this.$refs.list.scrollTop = 0                <!-- 滚到顶部 -->
  }
}">
  <button @click="load()">Refresh</button>
  <ul x-ref="list">
    <template x-for="i in items"><li x-text="i"></li></template>
  </ul>
</div>
```

</v-click>

---
transition: slide-up
---

# x-teleport：DOM 传送

```html
<!-- modal 渲染到 body 末尾，避开 z-index / overflow 问题 -->
<div x-data="{ open: false }">
  <button @click="open = true">Open</button>

  <template x-teleport="body">
    <div x-show="open" class="modal" @click.outside="open = false">
      <p>Modal content</p>
      <button @click="open = false">Close</button>
    </div>
  </template>
</div>
```

<v-click>

**使用场景**：modal / popover / tooltip / 全屏 overlay——任何「需要逃离父容器 stacking context」的场景。

</v-click>

---
transition: slide-up
---

# x-cloak：防止初始化闪烁

```css
/* 必须有这条 CSS */
[x-cloak] { display: none !important; }
```

```html
<div x-cloak x-data="{ open: false }">
  <!-- 初始化前隐藏，Alpine 启动后自动移除 x-cloak 属性 -->
  <span x-text="message"></span>
</div>
```

<v-click>

::: warning SSR 场景必备
服务端渲染输出时 `x-show="false"` 不生效（Alpine 还没启动）。`x-cloak` + CSS 是必备搭档。
:::

</v-click>

---
transition: slide-up
---

# x-id + $id：唯一 ID

```html
<!-- 同 $id 多次调用 → 同一个生成 ID -->
<div x-data x-id="['email-input']">
  <label :for="$id('email-input')">Email</label>
  <input :id="$id('email-input')" type="email">
</div>

<!-- 多个 input 互不冲突 -->
<div x-data x-id="['email']">
  <label :for="$id('email')">Email 1</label>
  <input :id="$id('email')">
</div>
<div x-data x-id="['email']">
  <label :for="$id('email')">Email 2</label>
  <input :id="$id('email')">
</div>
```

<v-click>

**用途**：写可复用组件（如 form field）时避免不同实例 ID 冲突。

</v-click>

---
transition: slide-up
---

# 9 个魔术属性

| Magic | 用途 |
|---|---|
| `$el` | 当前 DOM 元素 |
| `$refs` | `x-ref` 集合 |
| `$store` | 全局 store |
| `$watch` | 监听属性 |
| `$dispatch` | 派发事件 |
| `$nextTick` | 等 DOM 更新完 |
| `$root` | 最近 x-data 根 |
| `$data` | 当前 scope 整体 |
| `$id` | 生成唯一 ID |

<v-click>

```html
<div x-data="{ count: 0 }">
  <button @click="$dispatch('counter-changed', { count })">+1</button>
  <span x-ref="display" x-text="count"></span>
  <span x-text="$store.cart.total"></span>
  <label :for="$id('input')">...</label>
</div>
```

</v-click>

---
transition: slide-up
---

# $dispatch：自定义事件

```html
<!-- 派发 -->
<button @click="$dispatch('saved', { id: 42 })">Save</button>

<!-- 监听（必须 .window 才能跨组件） -->
<div @saved.window="onSaved($event.detail.id)">...</div>

<!-- 事件命名约定：kebab-case + 业务前缀 -->
<button @click="$dispatch('user:login', { id: 1 })">Login</button>
<button @click="$dispatch('cart:add', item)">Add</button>
<button @click="$dispatch('modal:close')">Close</button>
```

<v-click>

::: warning .window 是关键
$dispatch 默认只冒泡到父节点。跨组件通信**必须** `@event.window="..."`。
:::

</v-click>

---
transition: slide-up
---

# Alpine.data()：可复用组件

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('dropdown', () => ({
    open: false,

    init() {
      // 自动调用（替代 x-init）
      this.$watch('open', v => console.log('open =', v))
    },

    toggle() {
      this.open = !this.open
    },

    destroy() {
      // 元素移除时自动调用
      console.log('cleanup')
    },
  }))
})
```

```html
<!-- 多处复用同一组件 -->
<div x-data="dropdown">
  <button @click="toggle">Menu</button>
  <div x-show="open">...</div>
</div>
```

---
transition: slide-up
---

# Alpine.data()：带参数

```js
Alpine.data('counter', (start = 0, step = 1) => ({
  count: start,
  step,
  increment() { this.count += this.step },
  decrement() { this.count -= this.step },
}))
```

```html
<div x-data="counter(10, 2)">
  <button @click="decrement">-</button>
  <span x-text="count"></span>     <!-- 初始 10 -->
  <button @click="increment">+</button>  <!-- 每次 +2 -->
</div>

<div x-data="counter()">
  <!-- 用默认值：0, 1 -->
</div>
```

---
transition: slide-up
---

# Alpine.store()：全局 store

```js
Alpine.store('cart', {
  items: [],

  init() {
    this.items = JSON.parse(localStorage.getItem('cart') || '[]')
  },

  get total() {
    return this.items.reduce((sum, i) => sum + i.price, 0)
  },

  add(item) {
    this.items.push(item)
    localStorage.setItem('cart', JSON.stringify(this.items))
  },
})
```

```html
<!-- 任意组件访问 -->
<header x-data>
  <span>Items: <span x-text="$store.cart.items.length"></span></span>
  <span>Total: $<span x-text="$store.cart.total"></span></span>
</header>
```

---
transition: slide-up
---

# 9 个官方插件：概览

| 插件 | 主要 API | 场景 |
|---|---|---|
| **Persist** | `$persist(value)` | 状态持久化（localStorage） |
| **Intersect** | `x-intersect` | 视口检测（无限滚动 / 懒加载） |
| **Mask** | `x-mask` | 输入掩码（电话 / 卡号 / 日期） |
| **Morph** | `Alpine.morph()` | DOM 差量更新（Livewire 核心） |
| **Focus** | `x-trap` / `$focus` | 焦点陷阱（modal） |
| **Collapse** | `x-collapse` | 折叠动画 |
| **Anchor** | `x-anchor` | 浮动定位（Floating UI 内核） |
| **Sort** | `x-sort` | 拖拽排序（SortableJS） |
| **Resize** | `x-resize` | 尺寸监听（ResizeObserver） |

---
transition: slide-up
---

# Persist：状态持久化

```html
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/persist@3.x.x/dist/cdn.min.js"></script>
```

```html
<div x-data="{
  count: $persist(0),                          // localStorage（默认）
  open: $persist(false).as('sidebar-open'),    // 自定义 key
  draft: $persist('').using(sessionStorage),   // sessionStorage
}">
  <button @click="count++">+1 <span x-text="count"></span></button>
</div>
```

<v-click>

```js
// 配合 store
Alpine.store('settings', {
  theme: Alpine.$persist('light').as('theme'),
  fontSize: Alpine.$persist(14).as('fontSize'),
})
```

</v-click>

---
transition: slide-up
---

# Intersect：视口检测

```html
<div x-data="{ shown: false }">
  <!-- 进入视口 -->
  <div x-intersect="shown = true">
    <span x-show="shown">Hello!</span>
  </div>

  <!-- 仅进入 / 仅离开 -->
  <div x-intersect:enter="loadMore()"></div>
  <div x-intersect:leave="pause()"></div>

  <!-- 只触发一次 -->
  <div x-intersect.once="trackView()"></div>

  <!-- 阈值 -->
  <div x-intersect.half="visible50 = true"></div>     <!-- 50% -->
  <div x-intersect.full="visible99 = true"></div>     <!-- 99% -->
  <div x-intersect.threshold.30="..."></div>

  <!-- 视口边距 -->
  <div x-intersect.margin.200px="..."></div>
</div>
```

<v-click>

**典型场景**：无限滚动 / 懒加载图片 / 滚动统计 / 进入视口动画。

</v-click>

---
transition: slide-up
---

# Mask：输入掩码

```html
<!-- 占位符：9 数字 / a 字母 / * 任意 -->
<input x-mask="99/99/9999" placeholder="MM/DD/YYYY">
<input x-mask="(999) 999-9999">
<input x-mask="aaa-9999">
<input x-mask="****-****">

<!-- 动态 mask -->
<input x-mask:dynamic="
  ['34', '37'].includes($input.slice(0, 2))
    ? '9999 999999 99999'    // Amex
    : '9999 9999 9999 9999'  // 标准卡
">

<!-- 货币 -->
<input x-mask:dynamic="$money($input, '.', ',', 2)">
```

---
transition: slide-up
---

# Morph：DOM 差量更新

```js
import morph from '@alpinejs/morph'
Alpine.plugin(morph)

const el = document.querySelector('#list')
const newHtml = await fetch('/list').then(r => r.text())

Alpine.morph(el, newHtml, {
  key(el) { return el.id },
  updating(from, to, childrenOnly, skip) { },
  updated(from, to) { },
  removing(el, skip) { },
  added(el) { },
})
```

<v-click>

**Morph 的妙处**：用新 HTML 替换旧 DOM 时，**保留所有 Alpine state**——open / count / form input 不会丢。

这是 **Livewire / Hotwire / HTMX** 「换 HTML 片段后不打断客户端交互」的底层。

</v-click>

---
transition: slide-up
---

# Focus：焦点管理

```html
<div x-data="{ open: false }">
  <button @click="open = true">Open Modal</button>

  <!-- 基础 trap -->
  <div x-show="open" x-trap="open">
    <input>
    <button @click="open = false">Close</button>
  </div>

  <!-- + .inert（其他元素 aria-hidden） -->
  <div x-show="open" x-trap.inert="open">...</div>

  <!-- + .noscroll（锁页面滚动） -->
  <div x-show="open" x-trap.inert.noscroll="open">...</div>

  <!-- + .noreturn / .noautofocus -->
  <div x-show="open" x-trap.noreturn.noautofocus="open">...</div>
</div>
```

<v-click>

**$focus magic**：`focus(el)` / `first()` / `last()` / `next()` / `previous()` / `wrap()` / `within(el)`

</v-click>

---
transition: slide-up
---

# Anchor：浮动 UI 定位

基于 Floating UI 的智能定位

```html
<div x-data="{ open: false }">
  <button @click="open = !open" x-ref="button">Menu</button>

  <!-- 12 个位置：bottom / top / left / right × start / center / end -->
  <div x-show="open" x-anchor.bottom-start="$refs.button">
    Dropdown
  </div>

  <!-- 偏移 -->
  <div x-show="open" x-anchor.offset.10="$refs.button">...</div>

  <!-- 不自动翻转 -->
  <div x-show="open" x-anchor.noflip="$refs.button">...</div>

  <!-- 自己控制样式 -->
  <div x-show="open" x-anchor.no-style="$refs.button" :style="$anchor">
    Dropdown
  </div>
</div>
```

---
transition: slide-up
---

# Sort：拖拽排序

基于 SortableJS

```html
<div x-data="{ items: [{id:1,n:'A'}, {id:2,n:'B'}, {id:3,n:'C'}] }">
  <ul x-sort="(key, position) => reorder(key, position)">
    <template x-for="item in items" :key="item.id">
      <li x-sort:item="item.id">
        <span x-sort:handle class="cursor-move">⋮⋮</span>
        <span x-text="item.n"></span>
        <button x-sort:ignore @click="del(item.id)">×</button>
      </li>
    </template>
  </ul>

  <!-- 多容器拖拽 -->
  <ul x-sort x-sort:group="todos">...</ul>
  <ul x-sort x-sort:group="todos">...</ul>
</div>
```

---
transition: slide-up
---

# Collapse + Resize

```html
<!-- Collapse：折叠动画 -->
<div x-data="{ open: false }">
  <button @click="open = !open">Toggle</button>

  <div x-show="open" x-collapse.duration.500ms>
    Content with smooth height animation
  </div>

  <!-- 露出预览（最小 50px） -->
  <div x-show="open" x-collapse.min.50px>...</div>
</div>
```

<v-click>

```html
<!-- Resize：尺寸监听 -->
<div x-data="{ width: 0, height: 0 }">
  <div x-resize="width = $width; height = $height">
    <p x-text="`${width} × ${height}`"></p>
  </div>

  <!-- 整个 document -->
  <div x-resize.document="docW = $width">...</div>
</div>
```

</v-click>

---
transition: slide-up
---

# Livewire 集成：TALL Stack 核心

```php
<?php
// app/Livewire/Counter.php
class Counter extends Component
{
    public int $count = 0;
    public function increment() { $this->count++; }
    public function render() { return view('livewire.counter'); }
}
```

```blade
{{-- counter.blade.php --}}
<div x-data="{ animating: false }">
  <button wire:click="increment" @click="animating = true">+1</button>
  <span :class="{ 'animate-pulse': animating }" @animationend="animating = false">
    {{ $count }}
  </span>
</div>
```

<v-click>

**协作机制**：

- `wire:click` → 发请求到 PHP `increment()` 方法
- Livewire 拿到新 HTML，用 **Morph 算法**替换 DOM
- Morph 时保留所有 Alpine state（`animating` 不丢）

</v-click>

---
transition: slide-up
---

# 与 HTMX 配合：互补不冲突

```html
<div x-data="{ loading: false, error: null }">
  <button
    hx-get="/api/users"
    hx-target="#user-list"
    @htmx:before-request="loading = true; error = null"
    @htmx:after-request="loading = false"
    @htmx:response-error="error = $event.detail.xhr.statusText"
  >
    Load users
  </button>

  <!-- Alpine 处理 UI 反馈 -->
  <div x-show="loading" class="spinner"></div>
  <div x-show="error" x-text="error" class="alert"></div>

  <ul id="user-list"></ul>
</div>
```

<v-click>

**职责清晰**：HTMX 处理「点按钮 → 发请求 → 换 HTML」，Alpine 处理「客户端 UI 反应」。

</v-click>

---
transition: slide-up
---

# 配合 SSR 框架：Laravel + Blade

```blade
{{-- resources/views/products/index.blade.php --}}
@extends('layouts.app')

@section('content')
<div x-data="{ filter: 'all' }">
  <div class="filters">
    <button @click="filter = 'all'" :class="{ active: filter === 'all' }">All</button>
    <button @click="filter = 'new'" :class="{ active: filter === 'new' }">New</button>
  </div>

  @foreach ($products as $product)
    <article x-show="filter === 'all' || filter === '{{ $product->status }}'">
      <h3>{{ $product->name }}</h3>
      <p>${{ $product->price }}</p>
    </article>
  @endforeach
</div>
@endsection
```

<v-click>

服务端 Blade 渲染列表，Alpine 处理客户端筛选——**零 AJAX 零 API**。

</v-click>

---
transition: slide-up
---

# 配合 SSR：Rails 7 + ERB

```erb
<%# app/views/posts/show.html.erb %>
<div x-data="{ commentsOpen: false }">
  <%= render @post %>

  <button @click="commentsOpen = !commentsOpen">
    <span x-text="commentsOpen ? 'Hide' : 'Show'"></span> Comments
  </button>

  <div x-show="commentsOpen" x-collapse>
    <%= render @comments %>
  </div>
</div>
```

<v-click>

```erb
<%# Turbo Frame 内的 Alpine 组件 %>
<turbo-frame id="todos">
  <div x-data="todoList">
    <!-- Turbo 替换 frame 时 Alpine 自动重初始化 -->
  </div>
</turbo-frame>
```

</v-click>

---
transition: slide-up
---

# 配合 SSR：Django + WordPress

```html
{# Django template #}
<div x-data="{ cart: $persist([]) }">
  {% for product in products %}
    <div>
      <h3>{{ product.name }}</h3>
      <button @click="cart.push({{ product.id }})">Add</button>
    </div>
  {% endfor %}
  <p>Cart: <span x-text="cart.length"></span></p>
</div>
```

<v-click>

```php
<?php
// WordPress functions.php
function enqueue_alpine() {
  wp_enqueue_script(
    'alpine',
    'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js',
    [], null, true
  );
}
add_action('wp_enqueue_scripts', 'enqueue_alpine');
?>
```

</v-click>

---
transition: slide-up
---

# CSP 友好版

```html
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/csp@3.x.x/dist/cdn.min.js"></script>
```

<v-clicks>

**不能用**：
- 任意 JS 表达式（eval / Function 禁用）
- 箭头函数 / 解构 / 扩展 / 模板字符串
- 属性赋值：`user.name = 'John'`
- `console` / `document` / `window` / `Math`

**能用**：
- 对象 / 数组字面量
- 算术 / 比较 / 自增
- 方法调用：`items.push(x)`
- 三元 / 逻辑：`a ? b : c`

</v-clicks>

<v-click>

::: tip 最佳实践
复杂逻辑挪到 `Alpine.data()` 注册的 JS 中，HTML 属性只放简单方法调用。
:::

</v-click>

---
transition: slide-up
---

# 与 Vue / Stimulus 对比

| 维度 | Alpine 3 | Vue 3 | Stimulus 3 |
|---|---|---|---|
| 创作者 | Caleb Porzio | Evan You | Basecamp / DHH |
| 包体（gzip） | ~7KB | ~25KB | ~10KB |
| 模板 | HTML 属性 | SFC / `<template>` | HTML data 属性 |
| 响应式 | `@vue/reactivity` | Proxy | 无（手动） |
| 状态 | x-data / store | ref / Pinia | controller properties |
| 适合 | SSR + 轻交互 | SPA / 全栈 | Rails Hotwire |
| 学习曲线 | 极平缓 | 中等 | 平缓 |

<v-click>

**经验**：

- 新项目 SPA → Vue / React / Solid
- Laravel / Rails / Django + 加交互 → **Alpine**
- Rails 7 默认栈 → Stimulus

</v-click>

---
transition: slide-up
---

# 与 jQuery 迁移

| jQuery | Alpine |
|---|---|
| `$('.x').on('click', ...)` | `@click="..."` |
| `$('.x').toggle()` | `x-show="state"` |
| `$('.x').html(...)` | `x-html="..."` |
| `$('.x').addClass('a')` | `:class="{ a: cond }"` |
| `$('.x').val(v)` | `x-model="value"` |
| `$('form').submit(e => e.preventDefault())` | `@submit.prevent="..."` |
| `$.ajax(...)` | `fetch(...)` |
| `$(window).on('resize', ...)` | `@resize.window="..."` |

<v-click>

**核心差异**：jQuery 是**命令式**（手动操作 DOM），Alpine 是**声明式**（数据驱动 DOM）。

</v-click>

---
transition: slide-up
---

# 实战：完整 Todo App

```html
<div x-cloak x-data="todoApp">
  <form @submit.prevent="add">
    <input x-model="newTodo" x-ref="input" placeholder="Add...">
    <button :disabled="!newTodo.trim()">Add</button>
  </form>

  <ul>
    <template x-for="todo in todos" :key="todo.id">
      <li>
        <input type="checkbox" x-model="todo.done">
        <span :class="{ 'line-through': todo.done }" x-text="todo.text"></span>
        <button @click="remove(todo.id)">×</button>
      </li>
    </template>
  </ul>

  <p>Remaining: <span x-text="remaining"></span></p>
</div>
```

---
transition: slide-up
---

# 实战 Todo：JS 部分

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('todoApp', () => ({
    todos: Alpine.$persist([]).as('todos'),   // localStorage
    newTodo: '',

    get remaining() {
      return this.todos.filter(t => !t.done).length
    },

    add() {
      if (!this.newTodo.trim()) return
      this.todos.push({
        id: crypto.randomUUID(),
        text: this.newTodo.trim(),
        done: false,
      })
      this.newTodo = ''
      this.$refs.input.focus()
    },

    remove(id) {
      this.todos = this.todos.filter(t => t.id !== id)
    },
  }))
})
```

---
transition: slide-up
---

# 测试：Cypress E2E

```js
// cypress/e2e/counter.cy.js
describe('Counter Component', () => {
  beforeEach(() => cy.visit('/'))

  it('increments on click', () => {
    cy.get('[data-test=count]').should('contain', '0')
    cy.get('[data-test=plus]').click()
    cy.get('[data-test=count]').should('contain', '1')
  })

  it('persists count after reload', () => {
    cy.get('[data-test=plus]').click().click()
    cy.reload()
    cy.get('[data-test=count]').should('contain', '2')
  })
})
```

<v-click>

```html
<div x-data="{ count: $persist(0) }">
  <span data-test="count" x-text="count"></span>
  <button data-test="plus" @click="count++">+</button>
</div>
```

</v-click>

---
transition: slide-up
---

# 调试技巧

<v-clicks>

**1. `_x_dataStack`**：浏览器选中元素后

```js
$0._x_dataStack[0]   // 当前 scope
Alpine.$data($0)     // 同义 API
```

**2. `x-effect` 当 logger**

```html
<div x-effect="console.log('state', a, b)">...</div>
```

**3. `$watch` + 日志**

```html
<div x-init="$watch('count', v => console.log(v))">...</div>
```

**4. Alpine 全局 API**

```js
Alpine.store('cart').items     // 控制台直接查 store
Alpine.raw(reactiveObj)        // 去响应式
```

</v-clicks>

---
transition: slide-up
---

# 性能优化

<v-clicks>

- **减少 x-data 嵌套**：每个 x-data 创建独立 scope，扁平化更好
- **频繁切换用 x-show**：display 比 DOM 增删快
- **不常切换用 x-if**：节省内存
- **@input 加 .debounce**：搜索框必备
- **`x-model.lazy`**：大表单 change 才更新
- **用 Alpine.data() 替代 inline**：表达式不重复 parse
- **1000+ 列表用 x-intersect**：视口可见才挂载真实内容
- **避免 `x-effect` 内重计算**：用 `$watch` + getter

</v-clicks>

---
transition: slide-up
---

# 不要选 Alpine 的场景

<v-clicks>

- **SPA 项目（路由 + 状态管理 + SSR）** → Vue / React / Solid
- **重客户端交互（拖拽编辑器 / 复杂表格 / 图表）** → Vue / Svelte
- **React Native / 跨端** → React Native / Capacitor
- **企业中后台（依赖 Element Plus / Ant Design）** → Vue / React
- **强 TypeScript 要求** → Vue + SFC + Volar
- **团队全是 React / Vue 老手** → 用熟悉的栈

</v-clicks>

<v-click>

> **经验**：Alpine 是「**SSR 页面加交互**」的最佳方案，不是「轻量 Vue」。

</v-click>

---
transition: slide-up
---

# 经验法则

<v-clicks>

- **小型 + 增强 SSR 页面** → Alpine 完美选择
- **优先用 `Alpine.data()`** → 可复用 + 可测试
- **`x-show` vs `x-if`** → 看切换频率选
- **`x-cloak` + CSS** → SSR 场景必备
- **`$persist` 配 `.as()`** → 避免 key 冲突
- **`.window` 是跨组件 `$dispatch` 关键**
- **`<template>` 包 x-for / x-if / x-teleport** → 三处必须
- **CSP 模式优先 `Alpine.data()`** → 复杂逻辑挪 JS
- **测试 E2E 优先** → Cypress / Playwright 成本最低

</v-clicks>

---
layout: center
class: text-center
---

# 总结

适合：SSR 框架（Laravel / Rails / Django）+ 轻交互 / TALL Stack / HTMX 搭档

少做：大型 SPA / 重客户端 / 跨端

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://alpinejs.dev/" target="_blank">alpinejs.dev</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/alpinejs/alpine" target="_blank">alpinejs/alpine</a>
</div>

<div class="mt-4">
  <carbon:application-web /> <a href="https://livewire.laravel.com/" target="_blank">Livewire（TALL Stack 核心）</a>
</div>

<style>
h1 {
  background-color: #2D3441;
  background-image: linear-gradient(45deg, #2D3441 10%, #77C1D2 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>
