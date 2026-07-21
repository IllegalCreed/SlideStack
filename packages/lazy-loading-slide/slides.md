---
theme: seriph
background: https://cover.sli.dev
title: 懒加载和预加载 完全指南
info: |
  前端加载时机策略：loading=lazy · Intersection Observer · 路由懒加载 · webpackPrefetch/Preload · Speculation Rules

  Learn more at https://web.dev/articles/browser-level-image-lazy-loading
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 懒加载和预加载

前端加载时机策略 · 声明式 + 编程式 · 2026-07

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
加载时机的核心问题：把带宽、CPU、内存花在用户当下最关心的内容上。
-->

---
transition: fade-out
---

# 什么是「加载时机」策略

前端性能优化里有两个互补的问题

- **加载什么**：选哪些资源、如何切 chunk（→ 代码分割章）
- **何时加载**：本叶核心——同一份资源**何时拉、何时延后、何时提前备好**

**两条互补路径**

- **懒加载（Lazy）**：把视口外/非首屏内容**推迟到需要时**再拉
- **预加载（Preload/Prefetch）**：在用户**真正点之前**就把资源提前备好

> 边界：`<link rel="preload/prefetch">` 的 `as` / CSP / HTTP 缓存细节 → 网络优化章。本叶只讲「时机策略」。

<!--
记住：本叶聚焦浏览器端可声明/可编程的加载时机决策。
-->

---

# 加载时机四象限

把资源类型与触发时机画成四象限

|  | 当前页（立即可见） | 未来页/视口外（延后） |
|------|------|------|
| **延迟（懒）** | ❌ 不应懒加载（首屏 LCP） | ✅ `loading="lazy"` / IO / `content-visibility` |
| **提前（预）** | ✅ `<link rel="preload">` / `webpackPreload` | ✅ `<link rel="prefetch">` / `webpackPrefetch` / Speculation Rules |

**关键判断**

- **首屏 / LCP 元素永远不要懒加载**
- 浏览器不知图片位置前调度懒加载反而拖慢 LCP
- web.dev 明确警告：LCP 图像懒加载会扣 Performance 分

<!--
LCP 优化的反模式之一就是给首屏图加 loading=lazy。
-->

---

# loading 属性语义

`<img>` 与 `<iframe>` 共用一个 `loading` 属性

| 值 | 行为 |
|------|------|
| `lazy` | 视口外延迟加载 |
| `eager`（默认） | 立即加载，等价于不写 |

```html
<!-- 视口外懒加载 -->
<img src="p.webp" width="800" height="600"
     alt="..." loading="lazy" />

<!-- iframe 同语义 -->
<iframe src="w.html" loading="lazy"></iframe>
```

> 仅 `<img>` / `<iframe>` 支持；**CSS 背景图不支持**。

<!--
两个值：lazy（延迟）与 eager（默认立即）。
-->

---
layout: two-cols
---

# loading=lazy 五个陷阱

1. **仅 JS 启用时才延迟**——禁用 JS 时正常加载
2. **不支持 CSS 背景图**——背景图要用 IO
3. **不支持时不报错**——优雅降级
4. **必须写 width/height**——否则 CLS 或被判 0×0 全在视口内
5. **iframe 支持较晚**——Firefox 121 / Safari 16.4

::right::

# LCP/首屏不要懒加载

```html
<!-- ❌ 错：LCP 拖慢 -->
<img src="hero.webp" loading="lazy" />

<!-- ✅ 对：preload + 不加 lazy -->
<link rel="preload" as="image"
      href="hero.webp"
      fetchpriority="high" />
<img src="hero.webp"
     width="800" height="600" />
```

> 浏览器不知图位置前无法有效调度懒加载。

<!--
五个陷阱里「仅 JS 启用时才延迟」最反直觉，常被考点。
-->

---

# Intersection Observer

为什么不是 scroll 事件？IO 把相交状态交给浏览器异步算，主线程零负担

```ts
const io = new IntersectionObserver(
  (entries, observer) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        const img = e.target;
        img.src = img.dataset.src; // 触发加载
        observer.unobserve(img); // 加载完释放
      }
    }
  },
  { root: null, rootMargin: "200px 0px", threshold: 0 }
);
io.observe(img);
```

> 惯例：`rootMargin` 正值**提前预取**，`threshold: 0` 尽快触发，加载后 `unobserve()` 释放。

<!--
unobserve 释放监听避免冗余回调与内存占用。
-->

---

# content-visibility：纯 CSS 渲染懒加载

`content-visibility: auto` 让浏览器对屏外元素**跳过布局与绘制**

```css
.card {
  content-visibility: auto;        /* 屏外跳过布局/绘制 */
  contain-intrinsic-size: 200px;   /* 预留高度防抖动 */
}
```

**做什么**：渲染开销近似为 0，长列表/画廊性能大幅提升

**不做什么**：**不阻止子元素（含 `<img>`）的网络下载**——它是渲染层懒加载，不是下载层

> 与 IO 互补而非替代：IO 控制「什么时候把图片地址塞进去」（下载层），`content-visibility` 控制「什么时候画」（渲染层）。

<!--
常见误解：把 content-visibility 当图片懒加载等价替代。错。
-->

---

# Vue Router 路由懒加载

```ts
const routes = [
  {
    path: "/about",
    // 动态 import()：首次进入该路由时拉取并缓存
    component: () => import("./views/About.vue"),
  },
  {
    path: "/dashboard",
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "./views/Dashboard.vue"),
  },
];
```

**禁止**：在路由组件上再套 `defineAsyncComponent`

> Vue Router 官方明确：路由 `component` 应直接是返回 Promise 的函数；套一层 async 组件会让加载控制混乱。

<!--
Vue Router 自己管理路由组件加载生命周期，不要套 defineAsyncComponent。
-->

---
layout: two-cols
---

# defineAsyncComponent

适用于**非路由组件**——重组件按需挂载

```ts
import { defineAsyncComponent } from "vue";

const HeavyChart = defineAsyncComponent({
  loader: () => import("./HeavyChart.vue"),
  loadingComponent: Spinner,
  delay: 200,
  timeout: 5000,
  errorComponent: Err,
});
```

::right::

# React.lazy + Suspense

React 用 `lazy + Suspense` 达到类似效果

```tsx
import { lazy, Suspense } from "react";

const HeavyChart = lazy(
  () => import("./HeavyChart")
);

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  );
}
```

<!--
defineAsyncComponent 真正的用武之地是非路由组件。
-->

---

# webpack 魔法注释

动态 `import()` 配合魔法注释注入 `<link rel="prefetch/preload">`

| 注释 | 生成 | 优先级 | 时机 | 适用 |
|------|------|------|------|------|
| `/* webpackPrefetch: true */` | `<link rel="prefetch">` | 低 | 浏览器空闲 | 未来可能跳转的 chunk |
| `/* webpackPreload: true */` | `<link rel="preload">` | 高 | 与当前 chunk 并行 | 当前页必用的晚发现 chunk |

**关键区别**

- **prefetch** 服务**未来页**，浏览器空闲时拉，不阻塞当前页
- **preload** 服务**当前页**，与当前 chunk 并行高优先级拉

> 弄反了：要么当前页变慢，要么未来预取失效。

<!--
preload 当前页 / prefetch 未来页——别混淆。
-->

---

# Speculation Rules：prefetch vs prerender

声明式预测加载 API（仅 Chromium，需特性检测）

| 动作 | 做什么 | 代价 | 适用 |
|------|------|------|------|
| `prefetch` | 仅下载**文档响应**（不含子资源） | 小 | 加速下一页 TTFB |
| `prerender` | **完整渲染**（含 JS、子资源、数据 fetch）在隐形 tab | 大 | 高概率跳转，激活近乎瞬时 |

```html
<script type="speculationrules">
  {
    "prefetch": [{ "urls": ["/about"], "eagerness": "eager" }],
    "prerender": [{ "where": { "href_matches": "/p/*" }, "eagerness": "moderate" }]
  }
</script>
```

> prerender 代价高：误触发浪费 CPU/内存/流量，撞并发上限。

<!--
prerender 是隐形 tab——完整 DOM、JS 已执行、数据已 fetch。
-->

---

# eagerness 四档

`eagerness` 决定**何时**触发规则

| 值 | 触发时机 | 默认用于 |
|------|------|------|
| `immediate` | 命中规则即拉 | `urls` 列表规则（默认） |
| `eager` | 鼠标 hover 链接 | 高概率跳转 |
| `moderate` | pointerdown 按下 | 中等概率 |
| `conservative` | pointerdown 且有犹豫 | `where(document)` 规则（默认） |

**Chrome immediate 档并发上限**

- prefetch：**50**
- prerender：**10**

> 实践：prefetch 代价小可用 `immediate`/`eager`；**prerender 默认用 `conservative`**。

<!--
并发上限防滥用——别给 prerender 全配 eager。
-->

---
layout: quote
---

# 「浏览器不知图片位置前，无法有效调度懒加载」

「永远不要给首屏、特别是 LCP 元素加 loading="lazy"。」

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 懒加载 LCP / 首屏可见图像（拖慢最大内容绘制）
- 懒加载图像不写 `width/height`（CLS 或全量加载）
- 误以为 `loading="lazy"` 在禁用 JS 时仍延迟（实际**仅 JS 启用时才延迟**）
- 用 `opacity:0` 隐藏图片以为能阻止加载（只有 `display:none` 才会跳过）
- 把 `defineAsyncComponent` 当 Vue Router 路由组件用
- 对 prerender 设 `eagerness: eager` 匹配全站链接
- 跨站 prefetch 不设 referrer policy / requires
- 把 `content-visibility: auto` 当图片懒加载等价替代（不阻止下载）

---
layout: center
class: text-center
---

# 小结

加载时机 = 把资源花在用户当下最关心的内容上

懒加载（lazy）+ 预加载（prefetch/prerender）

**首屏不懒加载 · 懒加载要写尺寸 · Speculation Rules 必检测 · 框架懒加载遵循官方语法**

[MDN Speculation Rules](https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API) · [web.dev 图像懒加载](https://web.dev/articles/browser-level-image-lazy-loading) · [Vue Router 懒加载](https://router.vuejs.org/guide/advanced/lazy-loading.html)

<!--
按场景选 API：声明式优先、编程式补充、Speculation Rules 必检测。
-->
