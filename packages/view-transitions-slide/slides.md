---
theme: seriph
background: https://cover.sli.dev
title: 过渡动画完全指南
info: |
  过渡动画（View Transitions + CSS Transitions/Animations）完全指南：
  同文档 VT / 跨文档 VT / 伪元素 / 命名过渡 / micro-interaction / prefers-reduced-motion

  Learn more at https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 过渡动画完全指南

View Transitions + CSS Transitions/Animations · 同文档 / 跨文档 / 命名过渡

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
过渡动画解决 DOM 状态变化时的视觉连续性问题；2025-10-14 同文档 VT 进入 Baseline Newly available。
-->

---
transition: fade-out
---

# 什么是过渡动画

浏览器原生的「DOM 状态变化视觉补间」能力

- **抓快照 + 补间**：你只把 DOM 改成最终状态，浏览器抓旧/新快照自动补帧
- **不打包动画库**：原生 API，免 GSAP / Motion One 依赖
- **可访问性友好**：浏览器在转场结束原子切换 DOM，避免手写快照层的读屏混乱
- **页面级 morph**：列表↔详情、主题切换、SPA 路由切页

> 你只声明最终状态，浏览器补中间帧。

<!--
VT 的核心是「免手写中间帧」，开发者只负责把 DOM 改成最终状态。
-->

---

# 两条技术栈

| 维度 | View Transitions | CSS Transitions / Animations |
|------|------|------|
| **触发** | startViewTransition(cb) / 跨文档导航 | 属性值变化（hover/focus/class） |
| **中间帧** | 浏览器抓快照自动补 | 浏览器插值 / 你写 @keyframes |
| **适合** | 页面切换、列表↔详情、主题切换 | hover、菜单展开、骨架淡入 |
| **复杂度** | DOM 一行 + 少量 CSS | 一行 transition 或多行 keyframes |

> 经验：能用 transition 解决别用 animation，能用 animation 解决别上 VT。

<!--
VT 适合整块或整页的视觉切换；micro-interaction 用 CSS 足够。
-->

---

# View Transitions API 两种触发

**同文档（SPA）**：JS 主动触发

```text
if (!document.startViewTransition) {
  updateTheDOMSomehow();
  return;
}
document.startViewTransition(() => updateTheDOMSomehow());
```

**跨文档（MPA）**：CSS 声明，浏览器自动接管

```css
@view-transition {
  navigation: auto;
}
```

> 同文档 = 你抓快照；跨文档 = 浏览器在导航时接管，需同源 + 用户交互触发。

<!--
同文档是开发者主动调用 JS；跨文档是浏览器基于 CSS at-rule 自动接管。
-->

---
layout: two-cols
---

# 同文档 VT

- 触发：`document.startViewTransition(cb)`
- 抓旧快照 → 执行 cb 更新 DOM
- 浏览器抑制渲染直到 cb 结束
- 抓新快照 → 默认 cross-fade
- **Baseline Newly available**（2025-10-14）
- Chrome 111 / Safari 18 / Firefox 144 起

::right::

# 跨文档 VT

- 触发：CSS `@view-transition { navigation: auto }`
- 由浏览器在导航时自动接管
- **硬约束**：同源、无跨源重定向
- navigationType ∈ {traverse, push, replace}
- push/replace 必须**用户交互**触发
- **Limited availability**（Chrome 126+）

<!--
跨文档 VT 还需做特性检测 + 降级，Safari/Firefox 未完整支持。
-->

---

# ViewTransition 三个 Promise

```text
const t = document.startViewTransition(() => updateDOM());

t.updateCallbackDone.then(() => { /* cb 完成、新快照已抓 */ });
t.ready.then(() => { /* 伪元素已挂、动画即将开始 */ });
t.finished.then(() => { /* 动画结束、overlay 移除 */ });

t.skipTransition();  // 跳到末态，不留半截
```

| Promise | resolve 时机 |
|------|------|
| `updateCallbackDone` | updateCallback resolve |
| `ready` | 伪元素创建、动画可播放 |
| `finished` | 转场彻底结束 |

<!--
skipTransition 会跳到末态，不会半截卡在中间。
-->

---

# ::view-transition-* 5 个伪元素

```text
::view-transition                  overlay 根，铺满视口
  ::view-transition-group(name)    命名元素容器，承担位置/尺寸变化
    ::view-transition-image-pair(name)
      ::view-transition-old(name)  旧视图静态快照
      ::view-transition-new(name)  新视图实时表示
```

- **old** = 旧 DOM 的截图（定格）
- **new** = 新 DOM 的实时表示（截图）
- 默认 root cross-fade：old opacity 1→0、new 0→1

> 别把 new 当「未来的」就以为是动态的，两者都是截图快照。

<!--
old/new 都是截图；default 动画是 root 的 cross-fade。
-->

---

# view-transition-name 唯一约束

让元素脱离 root 独立 morph，**前后各恰好一个**：

```css
.list-item.is-active {
  view-transition-name: item-detail;  /* 点击后才赋名 */
}
.detail-panel {
  view-transition-name: item-detail;  /* 详情页同名 → 配对 morph */
}
```

- 多对一会令该 name 转场被跳过并报错
- 列表页常见坑：每项都赋名 → 详情页只能找到一项
- 模式：**点击后才赋名** 或 `view-transition-name: match-element`

<!--
列表项常见踩坑是「全部赋名」，应该点击后再赋名或用 match-element。
-->

---
layout: two-cols
---

# 方向感 types

```text
document.startViewTransition({
  update: () => updateDOM(),
  types: ['forwards'],
});
```

配合伪类按方向切 keyframes：

- `:active-view-transition-type(forwards)`
- `:active-view-transition-type(backwards)`
- 前进：从右滑入
- 后退：从左滑入

::right::

# CSS transition vs animation

**transition**

- 单次状态变化
- `transition: <p> <d> <fn> <delay>`
- 声明在**基础态**，触发态改值
- `allow-discrete` 让 display 可插值

**animation**

- 多关键帧 / 循环 / 反向
- `@keyframes name { ... }`
- `animation: <name> <d> ...`
- 可暂停 `play-state: paused`

<!--
方向感是用户认知模型的核心：前进从右、后退从左。
-->

---

# micro-interaction 性能

优先 **合成器属性**（不触发 layout，60fps 稳定）

| 推荐 | 禁用 |
|------|------|
| `transform` | `width` |
| `opacity` | `height` |
| `filter` | `top` / `left` |
| | `margin` / `padding` |

**transition 声明位置**：写在基础态

```css
.button { transition: transform 0.2s ease; }
.button:hover { transform: scale(1.05); }
```

> 写在 :hover 上 → 移入有动画、移出瞬切。

<!--
合成器属性只触发 compositor，layout 属性每帧 reflow 必掉帧。
-->

---
layout: two-cols
---

# prefers-reduced-motion

OS 级「减少动效」设置，2020-01 起 **Baseline Widely available**

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none !important;
  }
}
```

两个值：`reduce` / `no-preference`

::right::

# WCAG 两条规则

- **2.3.3 Animation from Interactions**（Level AAA）
  - 管交互触发的非必要动效
  - 点击展开、悬停放大、转场
  - 例外 = essential

- **2.2.2 Pause, Stop, Hide**（Level A）
  - 管自动播放动效
  - 轮播、自动滚动、装饰循环
  - 5 秒以下豁免

> reduce-motion ≠ 零动画，用 opacity 溶解替代大幅 scale。

<!--
WCAG 两条规则：AAA 管交互动效，A 管自动播放动效。
-->

---
layout: center
class: text-center
---

# 反模式与陷阱

- 不加特性检测直接 `startViewTransition(cb)` → 旧浏览器 TypeError
- 同一 `view-transition-name` 绑多个元素 → 转场被跳过
- 跨文档 VT 期望跨源/程序化跳转触发 → 硬约束失败
- 忽略 `prefers-reduced-motion` 硬塞视差 → 违 WCAG 2.3.3
- JS 手写「旧叠新」快照层 → 读屏混乱（VT 要解决的问题）
- transition 写在 `:hover` 上 → 移入有动画、移出瞬切
- 用 `width/height/top` 做高频动画 → 每帧 reflow 必掉帧

<!--
最常见的坑：忘记特性检测、name 重复绑定、忽略 reduce-motion。
-->

---

# 版本状态

| 特性 | Baseline | 备注 |
|------|------|------|
| **同文档 VT** | Newly available（2025-10-14） | Firefox 144 推动，Interop 2025 |
| `view-transition-name` | Newly available | 随同文档 VT |
| `view-transition-class` / `match-element` / `scope` | Newly available | 2025-10-14 |
| **跨文档 VT** | **Limited availability** | 仅 Chrome 126+ |
| `prefers-reduced-motion` | Widely available | 2020-01 |
| CSS Transitions / Animations | Widely available | 成熟 |

> 规范：CSS View Transitions Module Level 1（CR）+ Level 2（WD 进行中）。

<!--
跨文档 VT 仍需特性检测 + 降级到普通跳转。
-->

---
layout: center
class: text-center
---

# 小结

过渡动画 = 浏览器原生「DOM 状态变化视觉补间」

**同文档 VT 已 Baseline · 跨文档需降级 · reduce-motion 必尊重**

[MDN VT API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) · [web.dev Learn CSS](https://web.dev/learn/css/view-transitions-spas) · [Chrome 文档](https://developer.chrome.com/docs/web-platform/view-transitions)

<!--
把握「能 CSS 就别 VT，VT 必降级，必尊重 reduce-motion」三条原则。
-->
