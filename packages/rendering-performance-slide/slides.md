---
theme: seriph
background: https://cover.sli.dev
title: 渲染性能完全指南
info: |
  运行时单帧渲染性能 · 像素流水线 5 阶段 · reflow/repaint · 强制同步布局与布局抖动 · 合成层 · will-change · CSS contain · requestAnimationFrame

  Learn more at [https://web.dev/articles/rendering-performance](https://web.dev/articles/rendering-performance)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 渲染性能完全指南

运行时单帧渲染 · 像素流水线 5 阶段 · 16.6ms 预算

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
渲染性能研究的是页面已加载之后，单帧从代码触发到像素上屏的全过程。
-->

---
transition: fade-out
---

# 什么是渲染性能

研究**已加载页面在运行时单帧内的开销**

- **核心问题**：怎么把每一帧压进刷新率允许的预算内
- **60Hz**：约 **16.6ms/帧**，开发者实际可用约 **10ms**
- **120Hz**：约 8.3ms；**240Hz**：约 4.16ms
- **超出预算**：丢帧（jank）、卡顿、滚动掉帧、INP 受影响
- **心智模型**：像素流水线 5 阶段——决定每个 CSS 属性的代价

> 渲染性能 ≠ 加载性能。代码分割、资源压缩、缓存属加载性能。

<!--
渲染性能是机制层；Core Web Vitals 的 INP 是它的下游度量。
-->

---

# 像素流水线五阶段

```
JavaScript  →  Style  →  Layout  →  Paint  →  Composite
改 DOM/样式   匹配选择器   计算几何    栅格化像素   合成图层上屏
```

- **JavaScript**：跑 JS 改 DOM/属性/样式（声明式 CSS 动画可让浏览器在合成器线程跑）
- **Style**：重新计算每个元素的匹配规则
- **Layout**（reflow）：计算几何（位置/大小）
- **Paint**（repaint）：栅格化填充像素
- **Composite**：把各图层合成上屏（必走）

> Layout 必引发 Paint，Paint 必引发 Composite——但反过来不成立。

<!--
某些阶段可整段跳过：动画只改 transform/opacity 时跳过 Layout+Paint，是最廉价路径。
-->

---

# 16.6ms 帧预算去哪了（60Hz）

| 段 | 工作 | 估算 |
|---|---|---|
| Input | 处理输入回调 | ~1ms |
| **JS** | 跑你的脚本 | **~5ms** |
| Style | 重算匹配规则 | ~1ms |
| **Layout** | 重排 | **~3ms** |
| **Paint** | 栅格化 | **~3ms** |
| Composite | 合成上屏 | ~1ms |
| 浏览器自身 | GPU 同步、调度 | ~2ms |

> 工程目标：**JS ≤ 5ms，Layout + Paint ≤ 5ms**，留余量给浏览器自身。

<!--
高刷屏把预算压到 8.3ms / 4.16ms，任何低效方案都会被放大。
-->

---

# reflow vs repaint

| 概念 | 别名 | 触发 | 关系 |
|---|---|---|--- |
| **Layout** | reflow | 几何属性（`width`/`top`/`display` 等） | **必然引发 Paint** |
| **Paint** | repaint | 视觉属性（`color`/`background` 等） | **不一定引发 Layout** |

**口诀**：reflow 必引发 repaint，但 repaint 不一定 reflow

- 改 `color` → 只 Paint（跳过 Layout）
- 改 `width` → Layout + Paint（无法跳过）
- 改 `transform` → 都跳过，只 Composite

> `visibility: hidden` 不引发 reflow（保留几何）；`display: none` 引发 reflow（移出渲染树）。

<!--
核心结论：能用 transform 替代的几何属性，就别动 width/top/left。
-->

---
layout: two-cols
---

# 触发 Layout 的属性

**几何属性**

- `width` / `height` / `min-*` / `max-*`
- `padding` / `margin` / `border-width`
- `top` / `right` / `bottom` / `left`

**布局属性**

- `display` / `position` / `float` / `clear`
- `overflow` / `flex` / `grid` / `table-layout`

**文本相关**

- `font-size` / `font-family` / `line-height`
- `white-space` / `word-break`

::right::

# 触发 Paint 的属性

**视觉属性**

- `color` / `background-color`
- `background-image` / `box-shadow` / `text-shadow`
- `border-radius` / `outline` / `text-decoration`
- `visibility`（保留几何）

**仅 Composite**（最廉价）

- `transform` / `opacity` / `filter`（部分场景）
- `translate` / `rotate` / `scale`

<!--
记住这张表就能预判每个 CSS 属性的代价，无需猜测。
-->

---

# 强制同步布局

**成因**：改完样式后立即读取几何属性，浏览器被迫同步算布局

```ts
// 反模式：先写后读
element.classList.add('big');
console.log(element.offsetHeight); // 强制同步布局
```

**强制布局的几何 API**（高频踩坑）

- `offsetWidth/Height/Top/Left`
- `clientWidth/Height/Top/Left`
- `scrollTop/Left/Width/Height`
- `getBoundingClientRect()`
- `getClientRects()`
- `getComputedStyle()`（查几何属性时）
- `scrollIntoView()` / `scrollTo()`

> 检测：DevTools **Forced Reflow insight**、LoAF `forcedStyleAndLayoutDuration`

<!--
查 color 等非几何属性不触发，查 height/top 才触发。
-->

---

# 布局抖动（layout thrashing）

**单帧/单任务内多次 read-write-read-write 交替**，每次 read 触发一次强制布局

```ts
// 反模式：循环里读写交替
const items = document.querySelectorAll('.item');
for (let i = 0; i < items.length; i++) {
  // 读 → 写 → 读 → 写，N 次强制布局
  items[i].style.width = container.offsetWidth + 'px';
}
```

N 个元素 → N 次强制同步布局，**性能从 O(N) 退化到 O(N²)**

> 这是 web.dev 列举的最经典反模式。

<!--
这种代码看起来人畜无害，却是性能杀手。
-->

---

# 正解：read-then-write

**先把所有读取挪到写入之前**

```ts
// 正解：批量读、再批量写
const items = document.querySelectorAll('.item');
const width = container.offsetWidth;          // 一次性读
for (let i = 0; i < items.length; i++) {
  items[i].style.width = width + 'px';        // 只写不读
}
```

**核心模式**

- 测量阶段：把所有几何读取完成（此时复用上一帧布局）
- 变更阶段：再做所有样式写入
- 严格遵循 web.dev 原话：**read then write**

> 也可用 FastDOM 模式：把读放进 measure 队列、写放进 mutate 队列，浏览器交替执行。

<!--
不用 FastDOM 也行，关键是把读和写分开成两个阶段。
-->

---

# 合成层与 transform/opacity

**只有这两个 CSS 属性**能在合成器线程独立处理

```
改 transform/opacity:  Style → Composite           （合成器线程，~1ms）
改 color/background:   Style → Paint → Composite   （主线程，含栅格化）
改 width/top/margin:   Style → Layout → Paint → Composite（最贵）
```

**关键性质**

- **合成器线程独立**：主线程跑 JS 时仍能继续动画
- **不占主线程预算**：动画走 `transform` 时主线程可处理其他交互
- **CSS 独立 transform 属性**（`translate`/`rotate`/`scale`）：2023 Baseline widely available

> 动画驱动 `left` → 改用 `transform: translateX()`

<!--
transform/opacity 是动画首选，本质上是因为它们在合成器线程跑。
-->

---
layout: two-cols
---

# will-change 正确用法

**MDN 官方建议**

1. **作为最后手段**：先用 `transform`/`opacity` 优化，仍卡才上 `will-change`
2. **脚本动态开关**：hover 时设、animationEnd 置 `auto`
3. **给浏览器优化时间**：变化发生前设置，让它提前优化
4. **绝不全局常驻**：`* { will-change: transform; }` → 层爆炸
5. **绝不「预防性」优化**：只在出现真实问题后用

```ts
el.addEventListener('mouseenter', () => {
  el.style.willChange = 'transform';
});
el.addEventListener('transitionend', () => {
  el.style.willChange = 'auto';
});
```

::right::

# 取值与禁忌

**取值清单**

- `auto`：默认，无提示
- `scroll-position`：即将改滚动位置
- `contents`：即将改内容
- `<custom-ident>`：如 `transform` / `opacity`

**禁忌**（不能填）

- `unset` / `initial` / `inherit`
- `will-change` / `auto`
- `scroll-position` / `contents` 作为 ident

**`translateZ(0)` hack**

- 旧浏览器（不支持 `will-change`）的层提升 hack
- 现代浏览器优先用 `will-change`

<!--
will-change 是双刃剑：用对锦上添花，用错层爆炸。
-->

---

# CSS containment（contain）

**把 DOM 子树与外部隔离**，让浏览器跳过被隔离子树的工作

| 取值 | 等价展开 | 用途 |
|---|---|---|
| `strict` | `size layout paint style` | 全隔离（**慎用**，含 size 易塌陷） |
| `content` | `layout paint style` | **最常用安全值** |
| `paint` | 仅 paint | 后代不绘制到容器外（离屏可跳过子树） |
| `size`/`layout`/`style` | 单值 | size 须配 `contain-intrinsic-size`；layout/style 隔离布局/计数器 |

```css
.card { contain: content; }
.offscreen-section { contain: paint; }
.scroll-item { content-visibility: auto; contain-intrinsic-size: 0 200px; }
```

> `contain: paint` 会创建新的堆叠上下文与包含块，可能改 `position: fixed` 锚点。

<!--
content 是日常最常用的安全值；strict 含 size 易塌陷，要配 contain-intrinsic-size。
-->

---

# requestAnimationFrame

**与刷新率对齐**，主线程下一帧重绘前调用回调

```ts
const id = requestAnimationFrame((timestamp: DOMHighResTimeStamp) => {
  // 与 performance.now() 同时间基
  // 同一帧多个回调共享同一 timestamp
});
cancelAnimationFrame(id);
```

**为什么不用 setTimeout/setInterval**

| 方式 | 问题 |
|---|--- |
| `setTimeout(fn, 16)` | 不与刷新率同步，回调可能落在两帧之间丢帧 |
| `setInterval(fn, 16)` | 同上，且会堆积、后台仍跑 |
| `requestAnimationFrame` | 对齐刷新率；**页面不可见时浏览器自动暂停** |

> 滚动/resize 等高频事件：回调里只读必要值 + rAF 调度真正的写

<!--
后台标签会自动暂停 rAF，节电不浪费主线程。
-->

---
layout: quote
---

# 反模式与陷阱

「`* { will-change: transform; transform: translateZ(0); }`——层爆炸。」

---

# DevTools 测量与调试

| 面板 | 用途 |
|---|---|
| **Performance** → Layers | 看合成层数量与创建原因 |
| **Performance** → Paint profiler / Forced Reflow | Paint 栅格化耗时 / 强制同步布局定位 |
| **Rendering** → Paint Flashing | 高亮被重绘的区域 |
| **Rendering** → Layer Borders / Layout Shift Regions | 每层边界 / 布局偏移区域 |
| **Rendering** → Frame Rendering Stats | 每帧 FPS 与 GPU 内存 |

**LoAF API**

```ts
observer.observe({ type: 'long-animation-frame', buffered: true }); // forcedStyleAndLayoutDuration
```

<!--
Paint Flashing 是最直观的定位工具，强制重绘区会高亮闪烁。
-->

---
layout: center
class: text-center
---

# 小结

渲染性能 = 把每帧压进 16.6ms 预算

像素流水线 · reflow/repaint · 合成器属性 · will-change · CSS contain · rAF

**动画只用 transform/opacity · 读写分离 · will-change 最后手段 · contain 隔离子树**

[文档](https://web.dev/articles/rendering-performance) · [合成层](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count) · [布局抖动](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)

<!--
掌握像素流水线 + 合成器属性优先 + 读写分离，就能稳定压住 60fps。
-->
