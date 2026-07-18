---
theme: seriph
background: https://cover.sli.dev
title: Webpack Bundle Analyzer 完全指南
info: |
  Webpack Bundle Analyzer 完全指南：Webpack 打包体积可视化 · 四模式 · 四体积档 · Treemap

  Learn more at [https://github.com/webpack-contrib/webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Webpack Bundle Analyzer 完全指南

Webpack 打包体积可视化 · 四模式 · 四体积档 · Treemap · 5.3.0

<div class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
webpack-contrib 出品，Webpack 生态体积分析的事实标准。当前稳定版 5.3.0（2026-03-25）。
-->

---
transition: fade-out
---

# 什么是 Webpack Bundle Analyzer

webpack-contrib 维护的 **Webpack 打包体积可视化工具**

- **官方背书**：webpack-contrib 组织出品，Webpack 生态事实标准
- **两种用法**：Plugin（推荐）/ CLI（先出 stats 再分析）
- **可缩放 Treemap**：矩形面积 = 模块体积，一眼看出哪段代码吃掉多少 KB
- **四档体积**：stat / parsed / gzip / brotli 一键切换
- **CI 友好**：static 模式输出单 HTML 报告归档
- **Vite 无关**：Vite 用 Rollup，对应替代是 rollup-plugin-visualizer

> 它解决「bundle 大到看不出谁吃了体积」的问题——先打包、再分析。

<!--
强调它是 Webpack 生态专属工具，Vite 项目要换工具。
-->

---

# 它解决什么问题

打包后的 bundle 是压缩混淆的一坨 JS，**肉眼看不出哪段代码占多少**

- **「bundle 怎么这么大？」**：treemap 一眼看出某 npm 包占了 60%
- **「lodash 全量引入了吗？」**：看到全量 `lodash` 矩形就知道
- **「gzip 之后到底多大？」**：切到 gzip 档看用户实际下载字节
- **「哪里 Tree-shaking 没生效？」**：stat vs parsed 对照判断

> 它是「事后分析」工具——不会改变 bundle 本身，优化还得在 webpack config 里动手。

<!--
定位：可视化诊断，不是优化器。优化动作还是在 webpack config 里。
-->

---

# 安装与最小用法

```bash
pnpm add -D webpack-bundle-analyzer
```

```js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin(), // 默认 server + 8888 + 自动开浏览器
  ],
};
```

构建后控制台打印 `Webpack Bundle Analyzer is started at http://127.0.0.1:8888`，浏览器自动打开。

> CI 千万别用默认 server 模式——HTTP server 不退出，pipeline 卡死。

<!--
最小用法一行代码，但默认值只适合本地一次性分析。
-->

---

# 四种启动模式

`analyzerMode` 决定报告以什么形态产出

| 模式 | 行为 | 适用 |
|------|------|------|
| **`server`**（默认） | 启 HTTP server | 本地一次性分析 |
| **`static`** | 生成单 HTML | CI 产物归档、团队共享 |
| **`json`** | 生成 JSON 报告 | 程序化分析 |
| **`disabled`** | 仅配合 stats 输出 | 给下游工具 |

```js
new BundleAnalyzerPlugin({
  analyzerMode: 'static',       // CI 标配
  openAnalyzer: false,
  analyzerPort: 'auto',         // 防并行 build 端口冲突
})
```

<!--
四模式记住一句话：CI 一律 static，本地 server 也行。
-->

---

# 四档体积维度

报告顶部切换按钮（默认 parsed），各档含义不同

| 档位 | 含义 | 来源 |
|------|------|------|
| **`stat`** | 输入大小，变换前 | stats 对象 |
| **`parsed`**（默认） | 输出大小，压缩后 | 读磁盘 bundle |
| **`gzip`** | 对 parsed 再 gzip | 算出 |
| **`brotli`** | 对 parsed 再 brotli | 算出 |

> 生产评估 / 定性能预算看 **gzip / brotli**——用户实际下载压缩后字节，约为 parsed 的 1/3。

<!--
parsed 是默认档，但业务汇报要切到 gzip/brotli。
-->

---

# stat vs parsed：判断优化方向

两档对照能区分「是注释多」还是「是死代码多」

| 对照 | 结论 | 动作 |
|------|------|------|
| stat 远大于 parsed | 压缩器效果好（吃掉注释 / 空白） | **无需** Tree-shaking |
| stat 与 parsed 接近 | 模块本身冗余（死代码、未用导出） | **应做** Tree-shaking / 代码分割 |

```text
例：某模块 stat=80KB / parsed=20KB  → 压缩好，跳过
    某模块 stat=80KB / parsed=78KB  → 死代码多，立即拆
```

> 别只看 parsed 就动手——先看 stat/parsed 比再决定优化方向。

<!--
这是高频面试考点：两档体积的对照含义。
-->

---

# defaultSizes vs compressionAlgorithm

两个选项**维度不同**，最易混淆

| 选项 | 作用 | 取值 |
|------|------|------|
| `defaultSizes` | 报告**初始显示哪一档** | `stat` / `parsed` / `gzip` |
| `compressionAlgorithm` | 算压缩档**用哪种算法** | `gzip` / `brotli` / `zstd` |

```js
new BundleAnalyzerPlugin({
  defaultSizes: 'gzip',            // 打开报告就显示 gzip 档
  compressionAlgorithm: 'brotli',  // 压缩档按 brotli 算
})
```

> 别搞混：defaultSizes 切档位，compressionAlgorithm 切算法。

<!--
这两个选项常被搞混，是题库高频考点。
-->

---

# 重点澄清：仅 Treemap 一种视图

Webpack Bundle Analyzer **只支持 Treemap（矩形树图）**

| 视图 | 本工具 | 竞品 |
|------|--------|------|
| **treemap** | ✅ 支持 | bundle-stats / Statoscope |
| **sunburst** | ❌ 不支持 | bundle-stats / Statoscope |
| **network** | ❌ 不支持 | bundle-stats / Statoscope |

> 社区博客常说「treemap / sunburst / network 三种视图」——**这是错的**，是高频考点也是面试坑。要换视图请换工具。

<!--
这是最重要的反模式考点：本工具仅 treemap，sunburst/network 是竞品特性。
-->

---

# Treemap 交互能力

| 操作 | 行为 |
|------|------|
| 鼠标悬停 | 显示模块名 / 三档体积 / 路径 |
| 点击矩形 | 钻入子模块（zoom in） |
| 左侧 sidebar（点 `>` 展开） | 勾选 / 取消 chunk |
| 右键 / Ctrl+click chunk | Context Menu |
| 顶部切档按钮 | 切 stat / parsed / gzip |

> Context Menu 三选项（Hide chunk / Hide all other chunks / Show all chunks）只过滤展示、**不改变 bundle**——体积优化仍在 webpack config 里处理。

<!--
交互能力让大报告也能聚焦审查重点 chunk。
-->

---

# excludeAssets：三种 pattern

过滤无关资产，让 treemap 聚焦真正需要审查的 JS chunk

```js
new BundleAnalyzerPlugin({
  excludeAssets: [
    /\.map$/,                       // RegExp：排除 sourcemap
    'LICENSE',                      // String：转 RegExp，匹配 LICENSE
    (name) => name.endsWith('.woff2'), // 函数：返回 true 即排除
  ],
})
```

> 多 pattern 是「**任一匹配即排除**」（OR 语义）。常用于过滤 sourcemap / 字体 / LICENSE。

<!--
excludeAssets 只过滤展示，bundle 不变。
-->

---

# generateStatsFile：保留原始数据

`statsOptions: { source: false }` 是 CI 防源码泄漏的关键

```js
new BundleAnalyzerPlugin({
  generateStatsFile: true,            // 额外输出 stats.json
  statsFilename: 'stats.json',
  statsOptions: { source: false },    // 不写模块源码
})
```

| 配置 | 作用 |
|------|------|
| `generateStatsFile: true` | 输出 webpack stats JSON |
| `statsOptions.source: false` | **不写源码**，CI 上传防泄漏 |

> stats JSON 默认会写入模块源码——CI 共享 / 上传产物时务必加 `{ source: false }`。

<!--
防泄漏是 CI 场景必加的选项，常被忽视。
-->

---

# CLI 用法与 stats 生成

```bash
# 1. 生成 stats JSON（Unix/macOS/Linux）
webpack --profile --json > stats.json

# Windows PowerShell 防 BOM
# webpack --profile --json | Out-file 'stats.json' -Encoding OEM

# 2. CLI 分析
webpack-bundle-analyzer stats.json
#   -m/--mode          server|static|json|disabled
#   -p/--port          8888 | auto
#   -s/--default-sizes stat|parsed|gzip
#   -O/--no-open       不自动开浏览器
#   -e/--exclude       可多次
```

> webpack-dev-server / 内存型构建下 CLI 会报 `No such file` 并退化为只有 stat size——这种场景必须用 Plugin 模式（issue #147）。

<!--
CLI 模式需要 bundle 落盘，dev-server 下要换 Plugin 模式。
-->

---

# CI 标准配置

```js
// webpack.analyze.js
new BundleAnalyzerPlugin({
  analyzerMode: 'static',          // 不挂起，输出 HTML
  reportFilename: 'report.html',
  openAnalyzer: false,             // 无头环境不开浏览器
  analyzerPort: 'auto',            // 防并行 build 端口冲突
  defaultSizes: 'gzip',            // 生产评估看 gzip
  excludeAssets: [/\.map$/, /LICENSE/],
  generateStatsFile: true,
  statsOptions: { source: false }, // 防源码泄漏
  logLevel: 'warn',
})
```

```bash
ANALYZE=1 webpack --config webpack.analyze.js
```

> 单独的分析配置 + 环境变量按需启用——常规 build 不开，避免每次拖慢构建。

<!--
CI 标准配置三件套：static + analyzerPort auto + openAnalyzer false。
-->

---

# 与 Vite / Rollup 的关系

| 项目 | 用本工具 | 推荐 |
|------|----------|------|
| Webpack 项目 | ✅ | 本工具 |
| **Vite 项目** | ❌ | `rollup-plugin-visualizer` |
| Vite 项目（零配置） | ❌ | `npx vite-bundle-visualizer` |
| 纯 Rollup 项目 | ❌ | `rollup-plugin-visualizer` |

> Vite 用 Rollup 打包，**webpack stats JSON 根本不存在**——硬塞本工具会装上一堆 webpack 依赖也跑不起来。替代品产物也是 treemap，UI 体验对齐。

<!--
生态映射考点：Vite 用 rollup-plugin-visualizer。
-->

---

# 反模式与陷阱

| 反模式 | 后果 | 正确做法 |
|--------|------|----------|
| CI 跑 `server` 模式 | pipeline 卡死 | 改 `static` |
| 固定 8888 端口并行 build | EADDRINUSE | `analyzerPort: 'auto'` |
| dev-server 下跑 CLI | No such file | 用 Plugin 模式 |
| 拿 parsed 当真实体积 | 业务结论偏差 | 看 gzip / brotli |
| 上传 stats 不去源码 | 私有代码泄漏 | `{ source: false }` |
| 当 excludeAssets 能减小体积 | bundle 没变 | 在 webpack config 里处理 |
| 对 Vite 项目硬塞 | 装不上 | 用 rollup-plugin-visualizer |

<!--
7 大反模式几乎覆盖所有常见误用（sunburst/network 视图见前页）。
-->

---
layout: center
class: text-center
---

# 小结

Webpack Bundle Analyzer = Webpack 生态体积可视化事实标准

四模式 · 四体积档 · 仅 Treemap · CI 友好

**static + gzip + analyzerPort:auto + source:false**

[GitHub](https://github.com/webpack-contrib/webpack-bundle-analyzer) · [npm](https://www.npmjs.com/package/webpack-bundle-analyzer)

<!--
掌握四模式四体积档 + CI 标准配置，就能用好这个工具。
-->
