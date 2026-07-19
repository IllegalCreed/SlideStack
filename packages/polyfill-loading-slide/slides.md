---
theme: seriph
background: https://cover.sli.dev
title: Polyfill 按需加载
info: |
  前端 Polyfill 按需加载完全指南：useBuiltIns · core-js · browserslist · @vitejs/plugin-legacy

  Learn more at [https://babeljs.io/docs/babel-preset-env](https://babeljs.io/docs/babel-preset-env)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Polyfill 按需加载

前端兼容性工程核心抓手 · Babel 7 · core-js 3

<div class="bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
  <h1 style="font-size:1px;display:inline-block;">按需注入，避免全量污染</h1>
</div>

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Polyfill 按需加载 = useBuiltIns（怎么注入）+ core-js（注入什么）+ browserslist targets（为谁注入）。
-->

---
transition: fade-out
---

# 什么是 Polyfill

补齐**老浏览器缺失的运行时 API**的代码

- `Promise` / `Array.includes` / `Object.fromEntries` / `queueMicrotask`
- 等价 ES5 代码补回现代浏览器才有的「**运行时 API**」
- 由 `core-js` 提供，Babel 自动注入

**与语法降级是两件事**

| 维度 | 语法降级 | Polyfill |
|------|------|------|
| 处理对象 | `class` / 箭头 / `?.` 等语法 | `Promise` 等运行时 API |
| 由谁负责 | Babel syntax transform | `core-js` 注入 |

> `@babel/preset-env` 同时做这两件事，本章只取 polyfill 维度。

<!--
注意：Proxy / WeakRef 等需要底层引擎的特性无法 polyfill。
-->

---

# 为什么必须按需

最暴力做法：入口 `import "core-js"` 全量加载

- **体积爆炸**：core-js@3 全量压缩后数百 KB
- **现代浏览器白付**：Chrome 120 已原生支持 `Object.fromEntries`
- **重复 polyfill 风险**：应用 + 依赖各自 import 全局碰撞
- **维护性差**：浏览器升级后多余 polyfill 不会被自动剔除

**按需加载的两个核心思路**

- 按 targets 裁剪：只补「目标浏览器真正缺的」
- 按实际使用注入：只补「你的代码真正用到的」

> 同一应用：全量约 120KB → usage 约 15–30KB gzipped，差几十倍。

<!--
现代浏览器不应为老浏览器的兼容性付出代价。
-->

---
layout: two-cols
---

# 按需三要素

**`useBuiltIns`（怎么注入）**

- `'usage'`：每文件按实际使用注入（最精细）
- `'entry'`：替换入口 `import "core-js/stable"`
- `false`：不注入（库默认）

**`corejs`（注入什么版本）**

- 写实际装的 minor：`'3.33'`
- 写 `'3'` 或漏写 → 按默认 core-js@2 处理并告警

::right::

# 三要素

**`targets`（为谁注入）**

- 来自 `.browserslistrc` 或 `package.json.browserslist`
- 与 Autoprefixer / eslint-plugin-compat 共享
- `preset-env` 的 `targets` 选项可直接覆盖

**应用配方**

```json
[["@babel/preset-env",
  { "useBuiltIns": "usage",
    "corejs": "3.33" }]]
```

> 三者协作 = 一份按 targets 精确裁剪的 polyfill 集合。

---

# useBuiltIns 三模式对比

| 模式 | 注入位置 | 粒度 | 适用 |
|------|------|------|------|
| **`'usage'`** | 每个文件顶部 | **最精细** | **应用默认** |
| **`'entry'`** | 入口 import 整行替换 | 入口级 | 整项目一次性 |
| **`false`** | 不注入 | 无 | **库默认** |

**关键差异**

- `usage`：Babel 静态扫描每文件实际使用的 API
- `entry`：按 targets 一刀切，覆盖所有依赖隐式需求
- `false`：完全不注入，留给消费者自己处理

> `usage` 与 `entry` **互斥**，只能取其一。

---

# 'usage' 模式：最精细

Babel 扫描每个文件，按实际使用的 API 注入 `core-js/modules/es.xxx`

**源码**：

```ts
const arr = [1, 2, 3];
arr.includes(2);
Object.fromEntries([["a", 1]]);
```

**编译后**：

```ts
import "core-js/modules/es.array.includes";
import "core-js/modules/es.object.from-entries";

const arr = [1, 2, 3];
arr.includes(2);
```

> 优点：粒度最细，bundler 能 tree-shake。陷阱：依赖内部隐式使用需 `include` 兜底。

---

# 'entry' 模式：入口替换

把入口的 `import "core-js/stable"` 整行替换为按 targets 拆解的具体模块清单

**源码**：

```ts
import "core-js/stable";
```

**编译后（targets = ie 11，伪代码）**：

```ts
import "core-js/modules/es.array.includes";
import "core-js/modules/es.array.from";
import "core-js/modules/es.object.assign";
import "core-js/modules/es.promise";
// ... 还有几十个，全部按 targets 算出
```

> 优点：覆盖所有依赖隐式需求。陷阱：粒度比 usage 粗，入口只能一处。

---

# 'false' 模式：库的默认

不注入任何 polyfill，也不转换 `core-js` 入口

**库为什么用 `false`**：

- 库被各种消费者引用，消费者有自己的 polyfill 策略
- 库把 polyfill 打进产物会**污染消费者全局**
- 库只负责语法降级，polyfill 留给应用层

**配套方案**：

```json
{
  "presets": [["@babel/preset-env", { "useBuiltIns": false }]],
  "plugins": [["@babel/plugin-transform-runtime", { "corejs": 3 }]]
}
```

> `@babel/runtime-corejs3` 底层走 `core-js-pure`，不修改原生原型。

---

# corejs 选项：必填且要写对

**正确写法**（写实际装的 minor 版本）：

```json
{
  "useBuiltIns": "usage",
  "corejs": "3.33"
}
```

**陷阱**：

- 漏写 → 按默认 core-js@2 处理并告警
- 写 `'3'` → Babel 不知道该版本可用 polyfill，漏注入新 feature
- 写 `'2'` → 与实际装的 3 冲突，注入重复或错误版本

**对象形式**（启用提案）：

```json
{
  "corejs": { "version": "3.33", "proposals": true }
}
```

> `proposals: true` 引入全部未稳定提案，体积与 spec 变更风险大，仅在确实需要时开。

---

# core-js 2 vs core-js 3

| 维度 | core-js@2 | core-js@3 |
|------|------|------|
| **状态** | feature freeze（2018） | **唯一活跃主版本** |
| **新增 API** | 无 | URL / queueMicrotask / flat / fromEntries |
| **模块前缀** | `es6.` / `es7.` | `es.` / `esnext.` |
| **入口点数量** | ~200 | ~500+ |
| **数据源** | compat-table | core-js-compat |

**混装陷阱**：core-js@2 与 core-js@3 混装让 preset-env 注入重复或错误版本

```bash
npm ls core-js        # 检查混装
npm i core-js@3       # 统一升到 3
```

> 新项目必须用 core-js@3，core-js@2 仅维护老项目。

---
layout: two-cols
---

# core-js vs core-js-pure

**core-js（修改全局，polyfill）**

- 应用环境用
- 修改全局与原生原型
- `arr.includes(x)` 直接调用

```ts
import "core-js/modules/es.array.includes";
[1, 2, 3].includes(2);
```

::right::

# 应用 vs 库

**core-js-pure（不污染，ponyfill）**

- 库（npm 包）用
- 不修改全局与原型
- 显式传 receiver

```ts
import includes from "core-js-pure/features/array/includes";
includes([1, 2, 3], 2);
```

> 库用 pure + transform-runtime，把 polyfill 从「修改全局」变成「从 `@babel/runtime-corejs3` 引入」。

---

# browserslist：targets 单一事实源

`.browserslistrc` 同时被 preset-env / autoprefixer / eslint-plugin-compat 共享

```text
# .browserslistrc
> 0.5%
last 2 versions
not dead
Firefox ESR
```

**调试解析结果**：

```bash
npx browserslist
npx browserslist "> 1%, last 2 versions"
```

**preset-env 覆盖选项**：

- `targets`：直接指定（如 `{ chrome: "80" }`）
- `ignoreBrowserslistConfig`：忽略外部配置
- `configPath` / `browserslistEnv`：指定配置路径与 env

> 详细查询语法（`> 0.25%` / `last 2 versions` / `not dead`）属 browserslist 独立章节。

---

# @vitejs/plugin-legacy：差异化打包

产出 modern + legacy 双 bundle，浏览器自选

```ts
import legacy from "@vitejs/plugin-legacy";

legacy({
  targets: ["defaults", "not ie 11"],
  renderLegacyChunks: true,
});
```

**机制**：

- modern：`<script type="module">`，现代浏览器下载，polyfill 极少
- legacy：`<script nomodule>`，老浏览器下载，完整 core-js polyfill
- Safari 10.1 / iOS 10.3 的 module/nomodule bug 已内置修复

> 现代浏览器不再为 IE11 才需要的 polyfill 付费。

---

# @babel/polyfill 弃用与替代

`@babel/polyfill` 自 Babel 7.4（2019）**弃用**

**替代方案**：

```bash
npm uninstall @babel/polyfill
npm i core-js regenerator-runtime
```

```ts
// 入口 src/main.ts
import "core-js/stable";
import "regenerator-runtime/runtime";
```

配合 `useBuiltIns: 'entry'`，`import "core-js/stable"` 会被替换成按 targets 拆解的具体模块。

> 用 `usage` 模式时这两行可以删（Babel 会按需自动注入）。

---
layout: quote
---

# polyfill.io 不再用

「2024-02 该域名被中国公司 Funnull 收购后发生供应链攻击事件，注入恶意代码。Cloudflare 已在其网络层自动重写该域名的链接。」

**替代**：自托管 core-js（`core-js-builder`）或 `cdnjs.cloudflare.com/polyfill` / `polyfill-fastly.io` 镜像

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 继续用 `@babel/polyfill`（Babel 7.4 起弃用）
- 入口直接 `import "core-js"`（全量）却没配 `useBuiltIns: 'entry'`
- 多入口各自 `import "core-js"` → 全局碰撞
- core-js@2 与 core-js@3 混装 → 注入重复或错误版本
- 库构建用 `core-js` 或 `useBuiltIns: 'usage'` → 污染消费者全局
- 设了 `useBuiltIns` 却漏配 `corejs` → 按默认 core-js@2 处理并告警
- 生产仍引用 `polyfill.io` CDN → 供应链风险
- 现代浏览器也加载 IE11 polyfill（单 bundle）→ 未差异化打包
- 无脑开 `proposals: true` → 体积与 spec 变更风险大
- 依赖 `usage` 静态分析却不验证 → dynamic import / 第三方依赖内部可能漏注入

> 用 `debug: true` 核对实际注入清单与触发它的 target。

---
layout: center
class: text-center
---

# 小结

Polyfill 按需加载 = 给老浏览器补齐 + 不让现代浏览器白付

**应用配方**：`useBuiltIns: 'usage'` + `corejs: '3.33'` + `.browserslistrc`
**库配方**：`useBuiltIns: false` + `transform-runtime` 的 `corejs: 3`

[文档](https://babeljs.io/docs/babel-preset-env) · [core-js](https://github.com/zloirock/core-js) · [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

<!--
掌握按需三要素 + 库/应用差异化方案，就能把 polyfill 控制在生产水准。
-->
