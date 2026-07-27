---
theme: seriph
background: https://cover.sli.dev
title: 渲染模式选型完全指南
info: |
  前端渲染模式选型：CSR / SSR / SSG / ISR / Streaming SSR / Islands / RSC

  Learn more at https://web.dev/rendering-on-the-web/
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 渲染模式选型完全指南

CSR · SSR · SSG · ISR · Streaming SSR · Islands · RSC · React 19

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
核心问题：HTML 应该在哪里、在什么时候生成？七种模式覆盖从静态内容站到实时交互应用的全谱系。
-->

---
transition: fade-out
---

# 什么是渲染模式选型

回答核心问题：**HTML 应该在哪里、什么时候生成？**

- **生成位置**：浏览器 / 服务端 / 构建机
- **生成时机**：build 时 / 每次请求 / 浏览器运行时
- **生成形态**：HTML 字符串 / 流式 chunk / RSC Payload

七种主流模式覆盖从静态内容站到实时交互应用的全谱系

> web.dev 实测：SSG 在 TTFB / FCP / TBT 三项全优，**静态优先，按需 SSR**

<!--
没有一种模式在所有维度全优——这就是「选型」的本质。
-->

---

# 七种模式速览

| 模式 | 全称 | HTML 在哪 | 何时生成 |
|------|------|------|------|
| **CSR** | Client-Side Rendering | 浏览器 | 运行时 |
| **SSR** | Server-Side Rendering | 服务端 | 每次请求 |
| **SSG** | Static Site Generation | 构建机 | build 时 |
| **ISR** | Incremental Static Regeneration | 构建机+后台 | build+周期刷新 |
| **Streaming SSR** | 流式 SSR | 服务端 | 每次请求分块 |
| **Islands** | Islands Architecture | 构建+浏览器 | build+岛屿水合 |
| **RSC** | React Server Components | 服务端 | 输出 Payload |

> 七种模式**不互斥**：现代框架（Next.js / Astro）默认混合渲染

---

# 四维度对比（选型基础）

| 模式 | TTFB | FCP | TBT | 数据新鲜度 |
|------|------|------|------|------|
| **CSR** | 极快 | 慢 | 高 | 实时 |
| **SSR** | 慢 | 快 | 中 | 实时 |
| **SSG** | 极快 | 极快 | 极低 | build 时 |
| **ISR** | 极快 | 极快 | 极低 | 秒级延迟 |
| **Streaming SSR** | 中 | 快 | 低 | 实时 |
| **Islands** | 极快 | 极快 | 极低 | build 时 |
| **RSC** | 中 | 快 | 低 | 实时 |

> SSG / ISR / Islands 三项核心指标全优，是默认起点

<!--
SSG/ISR/Islands 都属于「静态优先」家族，服务器零成本。
-->

---
layout: two-cols
---

# CSR 与 SSR

**CSR（客户端渲染）**

- 浏览器下载空 HTML + bundle.js
- JS 在运行时渲染 DOM
- 服务器零成本
- **SEO 差 / 首屏慢 / TBT 高**

适用：后台管理、在线编辑器、SaaS 控制台

**SSR（服务端渲染）**

- 每次请求服务端生成完整 HTML
- 浏览器拿到 HTML 立刻显示
- 再下载 bundle **Hydration**
- **SEO 好 / 首屏快 / 服务器成本**

::right::

# SSG 与 ISR

**SSG（静态站点生成）**

- build 时为每个 URL 生成 HTML
- CDN 边缘缓存
- 服务器零成本
- **三项指标全优**（web.dev 实测）

适用：博客、文档、营销页

**ISR（增量静态再生）**

- Next.js 专属，SSG + 后台刷新
- `revalidate: N` 或 on-demand
- stale-while-revalidate 语义
- 缓存命中 SSG 速度 + 用户无感

<!--
SSR 全量 Rehydration 是反模式：「一个应用两倍代价」。
-->

---

# Streaming SSR（流式渲染）

React 18 + `<Suspense>` 边界，**HTML 分块流式发送**

**React 18 SSR 三大改进**

- 数据并行：各 Suspense 边界独立就绪
- 代码分割：`React.lazy` 可与 SSR 配合
- 选择性水合：多边界并行，点击优先

**API**

```ts
import { renderToPipeableStream } from "react-dom/server";

renderToPipeableStream(<App />, {
  onShellReady() { stream.pipe(res); },  // 外壳就绪立刻发
  onAllReady() { /* 全部完成 */ },
});
```

> React 18+ 生产 SSR 必须从 `renderToString` 切到流式 API

<!--
renderToString 不支持 Suspense、同步阻塞、无选择性水合。
-->

---

# Selective Hydration（选择性水合）

React 18 的核心创新——**用户点击触发优先级水合**

- 多个 Suspense 边界**并行水合**
- 用户点击未水合按钮 → capture 阶段**同步**水合父级，跳过兄弟让出主线程
- 创造「即时响应」的错觉

**renderToString vs renderToPipeableStream**

| 能力 | renderToString | renderToPipeableStream |
|------|------|------|
| Suspense 流式 | 不支持 | 支持 |
| 流式 HTML chunk | 不支持 | 支持 |
| 选择性水合 | 不支持 | 支持 |
| 背压处理 | 无 | 有 |

<!--
React 18 仍用 renderToString 做生产 SSR 是反模式。
-->

---

# Islands Architecture（Astro 群岛）

默认零 JavaScript，**仅交互组件作岛屿独立水合**

**client:\* 指令矩阵**

| 指令 | 何时水合 | 适用 |
|------|------|------|
| `client:load` | 立即 | 首屏交互（按钮、导航） |
| `client:idle` | 浏览器空闲 | 非关键（底部表单） |
| `client:visible` | 进视口 | 轮播、评论（不视达不下载） |
| `client:only` | 仅客户端 | 依赖 window 的组件 |
| `client:media` | 媒体查询匹配 | 仅移动 / 仅桌面 |

> 给所有组件加 `client:load` 等于退化成传统 SPA 全量水合

<!--
按字节计 JS 是最慢的资产，Islands 的核心价值是选择性水合。
-->

---
layout: two-cols
---

# Server Islands

Astro 4+ `server:defer` 指令

- 把昂贵服务端代码**移出主渲染流**
- 占位内容先显示
- 异步替换为真实内容

适用：用户头像、个性化优惠、实时库存

```text
<Header />
<Avatar server:defer />
<Article />
```

::right::

# RSC 概念

React Server Components（React 19）

- 服务端渲染，输出 **RSC Payload**
- 组件代码**不发到浏览器**
- **不进 client bundle**
- async 组件 + 直接读 DB

适用：Next.js App Router 默认范式

```ts
// app/page.tsx（默认 Server Component）
export default async function Page() {
  const data = await db.query();
  return <div>{data.name}</div>;
}
```

<!--
Server Islands 处理动态服务端，Client Islands 处理客户端交互。
-->

---

# RSC vs SSR（三根本区别）

| 维度 | SSR | RSC |
|------|------|------|
| 输出形态 | HTML 字符串 | RSC Payload（二进制组件树） |
| 组件代码发浏览器 | 是 | **否** |
| 进 client bundle | 是 | **否** |
| 是否水合 | 是 | **否** |
| async 组件 | 不支持 | **支持** |

**RSC 能做 / 不能做**

- 能做：`async`/await、读 DB/文件系统、传 JSX 给 Client
- 不能做：`useState`/`useEffect`/`onClick`/`window`

<!--
RSC 不发到浏览器、不进 bundle、不水合——这是与 SSR 的根本区别。
-->

---

# 'use client' 边界规则

标记后**该文件及所有 imports 进 client bundle**

```ts
// ❌ 反模式：use client 放根 Layout
"use client";
export default function RootLayout({ children }) {
  // 所有子树全部进 client bundle，丧失 RSC 收益
  return <html><body>{children}</body></html>;
}

// ✅ 正确：边界下沉到最小交互叶子
// app/Counter.tsx
"use client";
import { useState } from "react";
export default function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
```

> `'use server'` 标记的是 Server Functions，**不是 RSC 标记**

<!--
'use client' 边界放错就废——根 Layout 加了等于退化成 CSR。
-->

---

# 混合渲染：电商产品页

同一页不同部位按**变更频率 × 个性化程度**切分

| 部位 | 变更频率 | 个性化 | 模式 |
|------|------|------|------|
| 布局、商品描述 | 几乎不变 | 否 | **SSG** |
| 价格、库存 | 分钟级 | 否 | **ISR** |
| 「猜你喜欢」推荐 | 用户相关 | 是 | **SSR** |
| 加入购物车按钮 | 立即响应 | 是 | **CSR** |

Next.js App Router：路由段 `export const revalidate = 60` + `<Suspense>` 包裹 SSR + `'use client'` 下沉加购按钮

> 混合渲染是性能 / 新鲜度 / 成本三角的最优解

---

# 选型决策矩阵

| 场景 | 推荐 | 备选 |
|------|------|------|
| 博客 / 文档 / 营销页 | **SSG** | Islands |
| 电商 / 新闻 / 百万级 URL | **ISR** | Streaming SSR |
| 仪表盘 / 实时数据 | **SSR**（+WS） | Streaming SSR |
| 后台管理系统 | **CSR** | SSR |
| React 内容站 | **RSC** | App Router |
| 文档 + 交互 demo | **Islands** | RSC |

> 静态优先：先 SSG/ISR，仅在「需要那一刻的数据」时才引入 SSR

---
layout: quote
---

# 静态优先，按需 SSR

「SSR + Rehydration rarely the best option. 静态渲染 TTFB/FCP/TBT 三项全优且无需服务器计算。」

—— web.dev《Rendering on the Web》

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 全量 Rehydration（HTML + bundle 双传输）
- React 18+ 仍用 `renderToString`
- `'use client'` 放根 Layout
- Server Component 里写 `useState` / `onClick` / `window`
- 纯 SPA 做 SEO 站
- SSG 用于百万级 URL（应换 ISR）
- ISR 当 SSR 用实时数据
- Astro 给所有组件加 `client:load`
- 混淆 Prerendering 与 Static Rendering
- 跨边界传非可序列化值
- 把 `'use server'` 当 RSC 标记

---

# 小结

渲染模式选型 = HTML 在哪、何时生成的工程决策

七模式 · 决策三轴 · 混合渲染 · React 19

**静态优先 · React 18+ 必须流式 · 'use client' 下沉 · 混合按部位切分**

[web.dev](https://web.dev/rendering-on-the-web/) · [React](https://react.dev/reference/rsc/server-components) · [Astro](https://docs.astro.build/en/concepts/islands/) · [Next.js](https://nextjs.org/docs/app/getting-started/server-and-client-components)
