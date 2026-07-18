---
theme: seriph
background: https://cover.sli.dev
title: 代码分割完全指南
info: |
  前端代码分割（Code Splitting）完全指南：动态 import() · 路由懒加载 · 构建器 chunk 配置 · preload/prefetch · 部署兜底

  Learn more at https://vite.dev/guide/build
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 代码分割完全指南

动态 import() · 路由懒加载 · 构建器 chunk 治理 · Vite 8 / Webpack 5

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
代码分割是把单一首屏全量 bundle 按路由/依赖/业务模块切成独立 chunk 的优化手段。
-->

---
transition: fade-out
---

# 什么是代码分割

把单一首屏全量 bundle **按需切成多个独立 chunk**

- **唯一原语**：动态 <code v-pre>import('./X')</code>（ES2020 标准、Baseline Widely Available）
- **效果**：首屏只下当前路由代码，其余 chunk 访问时才拉
- **构建器原生支持**：Webpack / Vite / Rollup / esbuild 全部识别动态 import 为分割点
- **缓存红利**：vendor（node_modules）低频变，单独拆后业务改动不会让 vendor hash 失效
- **配套**：preload/prefetch 资源提示 + hash + HTML no-cache + ChunkLoadError 兜底

> 代码分割治「下太多」，tree-shaking 治「下了没用」，两者正交。

<!--
核心定位：唯一分割原语 + 构建器配置面 + 资源提示 + 部署兜底四件套。
-->

---

# 为什么需要分割

| 问题 | 分割手段 | 效果 |
|------|------|------|
| 首屏下整站 | 路由级 `import()` | 首屏只下当前路由代码 |
| 第三方库随业务失效 | vendor 单独拆 chunk | 库不变则 vendor hash 不变 |
| 低频代码污染首屏 | 条件性 `import()` | 设置面板 / 大库按需加载 |
| 大 chunk 拖慢首屏 | `maxSize` + HTTP/2 | 切成更小块并行下载 |

> 先用 `sideEffects: false` + `usedExports` 收口死代码，再谈分割。

<!--
分割与 tree-shaking 正交：分割治「下太多」，tree-shaking 治「下了没用」。
-->

---

# 动态 import() 核心语义

ES2020 操作符（非函数），返回 `Promise<模块命名空间对象>`

- **模块仅求值一次**，结果被缓存，后续命中缓存
- **永不抛同步错误**——失败走 Promise reject
- 是所有打包器共同识别的**分割点**

```ts
// 静态 import：加载期全求值，不产生分割点
import { heavy } from "./heavy-lib";

// 动态 import()：按需求值，产生分割点
document.querySelector("#btn").addEventListener("click", async () => {
  const { heavy } = await import("./heavy-lib");
  heavy();
});
```

> 模块只求值一次：首次访问某路由会下载 + 解析 chunk，第二次访问几乎零成本。

<!--
强调静态 vs 动态的求值时机差异是分割能降低首屏体积的根本机制。
-->

---
layout: two-cols
---

# 静态 vs 动态

| 维度 | 静态 import |
|------|------|
| 求值时机 | 加载期 |
| 分割点 | 否 |
| 返回值 | 命名空间对象 |
| 错误 | 抛同步错误 |
| 模块标识 | 字符串字面量 |
| 标准 | ES2015 |

::right::

# 

| 维度 | 动态 import() |
|------|------|
| 求值时机 | 调用时（按需） |
| 分割点 | **是**（所有打包器） |
| 返回值 | Promise<模块命名空间> |
| 错误 | Promise reject |
| 模块标识 | 表达式可用 |
| 标准 | ES2020（Baseline） |

> 用表达式做模块标识（`import(variable)`）需用 `webpackInclude` 收口，否则会把整个目录全打进来。

<!--
错误永不抛同步：动态 import 的错误一律走 Promise reject，与静态 import 不同。
-->

---

# 路由级分割：Vue Router

「always use dynamic imports for all your routes」（官方建议）

```ts
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 路由组件就是「返回 Promise 的函数」
    { path: "/", component: () => import("./views/Home.vue") },
    { path: "/about", component: () => import("./views/About.vue") },
  ],
});
```

**反模式**：不要把路由组件包进 <code>defineAsyncComponent</code>——Vue Router 官方明确禁止。路由懒加载应直接用动态 `import()`，异步组件可用于路由组件内部。

<!--
路由组件必须是个返回 Promise 的函数；defineAsyncComponent 用在路由组件内部而非路由本身。
-->

---

# 路由级分割：React Router v7

v6.4+ 函数式 → v7.5（2025-04）对象式逐属性并行下载

```ts
// v6.4+ 函数式（模块具名导出 Component/loader/action）
{ path: "/projects", lazy: () => import("./routes/projects") }

// v7.5+ 对象式：逐属性并行下载
{
  path: "/projects",
  lazy: {
    Component: () => import("./routes/projects/component").then(m => m.default),
    loader: () => import("./routes/projects/loader").then(m => m.default),
    action: () => import("./routes/projects/action").then(m => m.default),
  },
}
```

> 对象式把 Component/loader/action 各拆独立 chunk 并行下载，比单个大 chunk 更快。

<!--
对象式 lazy 的核心收益：并行下载，避免「单个大 chunk 卡住整条流水线」。
-->

---

# Webpack splitChunks 默认

`SplitChunksPlugin` 自 v4 替代 `CommonsChunkPlugin`，默认已能处理大部分场景

```js
splitChunks: {
  chunks: "async",        // 仅异步 chunk（默认）
  minSize: 20000,         // 20kb 防过度拆分
  maxAsyncRequests: 30,   // 按需加载最大并行
  maxInitialRequests: 30, // 入口最大并行
  cacheGroups: {
    defaultVendors: { test: /[\\/]node_modules[\\/]/, priority: -10 },
    default: { minChunks: 2, priority: -20 },
  },
}
```

**触发条件**：来自 node_modules 或被 ≥2 chunk 共享 + >20kb + 并行 ≤30

> `chunks: 'all'` 是消除「同一份 lodash 多入口各打一次」的标配。

<!--
默认 chunks:async + minSize:20000 就是为防过度拆分。
-->

---

# cacheGroups 自定义组

按变动节奏 / 体量细分 vendor，配合 HTTP/2 并行下载

```js
cacheGroups: {
  react: { test: /[\\/]node_modules[\\/](react|react-dom)/,
           name: "react-vendor", chunks: "all", priority: 10 },
  ui: { test: /(element-plus|ant-design-vue)/,
        name: "ui-vendor", chunks: "all", priority: 8 },
  viz: { test: /(echarts|monaco-editor|d3)/,
         name: "viz-vendor", chunks: "all", priority: 9 },
}
```

- **priority 高者胜出**：默认组 -10/-20 让自定义组默认占优
- **`name: false`（生产推荐）**：固定 name 会合并所有公共模块，初始下载变大
- **`enforce: true`**：忽略 minSize/minChunks 强制创建

> 反模式：`test:node_modules + name:'vendors' + chunks:'all'` 把所有依赖塞一个文件，react 和巨型库同生死。

<!--
priority 是「我的 vendor 配置没生效」最常见的解法：priority 没写或写低被默认 vendor 抢了。
-->

---

# Vite 8 / Rolldown：codeSplitting.groups

Vite 8（2026-03）Rolldown 成唯一默认打包器，提速 10-30x

```ts
// ❌ Rollup 写法（Vite 8 下报错或被忽略）
build: { rollupOptions: { output: { manualChunks: { react: ["react"] } } } }

// ✓ Rolldown 写法
build: {
  rolldownOptions: {
    output: {
      codeSplitting: {
        groups: [
          { name: "react-vendor", test: /node_modules[\\/](react|react-dom)/ },
          { name: "viz-vendor", test: /node_modules[\\/](echarts|monaco-editor)/ },
        ],
      },
    },
  },
}
```

> 手工列模块 ID 易产生循环依赖（Vite issue #12209），改用 `test` 正则匹配业务路径。

<!--
manualChunks 在 Rolldown 下不再支持，迁移到 codeSplitting.groups 时优先用正则。
-->

---
layout: two-cols
---

# 魔法注释（Webpack）

`/* webpackChunkName: "x" */` —— 命名

`/* webpackMode: "lazy" */` —— 默认按需

`/* webpackMode: "lazy-once" */` —— 单 chunk 缓存

`/* webpackMode: "eager" */` —— 不产出独立 chunk

`/* webpackExports: ["a"] */` —— 助 tree-shake

`/* webpackInclude: /re/ */` —— 收口动态路径

::right::

# 

**资源提示魔法注释**

`/* webpackPreload: true */` —— 高优先级（当前导航必用）

`/* webpackPrefetch: true */` —— 低优先级（未来导航投机）

```ts
// 同名 chunk 聚合多个 import
import(/* webpackChunkName: "group-dash" */ "./Dashboard");
import(/* webpackChunkName: "group-dash" */ "./Stats");
```

> Babel/TS 编译时若不保留 comments，所有魔法注释会被剥掉，chunk 命名失效。

<!--
魔法注释被剥掉是常见坑：Babel/TS 需显式保留 comments。
-->

---
layout: two-cols
---

# preload vs prefetch

**preload**

- 当前导航**必用**
- 高优先级（与 document 同级）
- 必须带 `as`（script/font/style）
- 关键字体、关键 CSS、hero 图

**误用代价**

- 抢当前页关键资源带宽

::right::

# 

**prefetch**

- 未来导航**投机**
- 低优先级（浏览器空闲时）
- 不强制 `as`
- 下一页路由 chunk

**误用代价**

- 移动端/弱网白烧流量

> preload 是「这页一定要用」的高优先级声明；prefetch 是「下页可能用」的低优先级投机。

<!--
误用 preload 反而让 LCP 变慢，是常见 Lighthouse 失分项。
-->

---
layout: two-cols
---

# 部署兜底三件套

新部署让旧 hash chunk 失效，老用户报 `ChunkLoadError`

**1. HTML no-cache**

每次拿最新 HTML（含最新 chunk 清单）

**2. 资源带 hash**

chunk 不变则永久缓存

::right::

# 

**3. vite:preloadError 兜底**

```ts
window.addEventListener(
  "vite:preloadError",
  (e) => {
    e.preventDefault();
    location.reload();
  }
);
```

**部署侧**

- 静态 chunk：`max-age=31536000, immutable`
- CDN 保留 1-2 个历史版本

> 监听 preloadError 后用户体感是「卡一下又好了」，而不是白屏硬刷。

<!--
ChunkLoadError 是 SPA 长生命周期部署的标配坑，必须配 HTML no-cache + hash + preloadError 三件套。
-->

---
layout: quote
---

# preload ≠ prefetch

「preload 是这页一定要用的高优先级声明，prefetch 是下页可能用的低优先级投机。误用 preload 反而让 LCP 变慢。」

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 路由组件包 `defineAsyncComponent`（Vue Router 明确禁止）
- `manualChunks` 手工分组制造循环依赖（Vite #12209）
- 过度拆分致单 chunk < 20kb、请求数爆炸
- `splitChunks.name` 写固定字符串（合并所有公共模块）
- preload 当 prefetch 用 / 反之
- 旧 chunk 失效不兜底，用户卡白屏
- Babel/TS 剥掉魔法注释致 chunk 命名失效
- `test:node_modules + name:'vendors' + chunks:'all'` 把所有依赖塞一个文件

<!--
按反模式清单逐条自查，能避免分割实践 80% 的坑。
-->

---
layout: center
class: text-center
---

# 小结

代码分割 = 让浏览器只在需要某段代码时才下载它

唯一原语 `import()` · 路由级分割 · 构建器 chunk 治理 · 资源提示 · 部署兜底

**首屏只下必需 · vendor 长缓存 · preload/prefetch 按语义选 · vite:preloadError 兜底**

[MDN import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) · [Vite Build](https://vite.dev/guide/build) · [Webpack splitChunks](https://webpack.js.org/plugins/split-chunks-plugin/)

<!--
掌握分割原语 + 构建器配置面 + 资源提示 + 部署兜底四件套，就能把代码分割用到生产水准。
-->
