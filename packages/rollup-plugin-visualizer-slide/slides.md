---
theme: seriph
background: https://cover.sli.dev
title: rollup-plugin-visualizer 完全指南
info: |
  rollup-plugin-visualizer 完全指南：Vite/Rollup 打包体积可视化 · 8 种模板 · btd 出品

  Learn more at https://github.com/btd/rollup-plugin-visualizer
drawings:
  persist: false
transition: slide-left
mdc: true
---

## rollup-plugin-visualizer 完全指南

Vite/Rollup 打包体积可视化插件 · btd 出品 · v7（Node >= 22）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
rollup-plugin-visualizer 是 Vite/Rollup 生态的体积可视化事实标准，btd 个人维护，长期为 Vite 官方文档推荐。
-->

---
transition: fade-out
---

# 什么是 rollup-plugin-visualizer

btd 维护、Vite 官方推荐的 **Rollup 打包体积可视化插件**

- **Rollup 钩子集成**：实现 `generateBundle`，只处理 `bundle.type === 'chunk'`
- **8 种模板**：treemap / sunburst / treemap-3d / network / flamegraph / raw-data / list / markdown
- **CI 友好**：raw-data 产 JSON、list 产 YAML、markdown 产 MD
- **压缩体积可见**：`gzipSize` / `brotliSize` 贴近线上传输
- **CLI 多份合并**：多 entry / 多配置构建合并分析
- **当前 v7**：Node.js >= 22 硬性要求

> 它解决「为什么 bundle 这么大 / 哪个依赖吃掉体积」的黑盒问题。

<!--
插件定位：Rollup/Vite 生态体积分析事实标准，与 Webpack Bundle Analyzer 隔江而治。
-->

---

# 它解决什么问题

打包工具只告诉你「build complete，dist N KB」，黑盒

- 「**lodash 全量引入了吗？**」→ treemap 一眼看到 lodash 在多个 chunk
- 「**moment 占了多少？**」→ 矩形面积 = 体积占比
- 「**这 1MB 依赖为什么被打进包？**」→ network 追引用链
- 「**PR 让 bundle 大了 30KB**」→ `list` 模板产 YAML，PR diff 直接显示

<br>

> 把体积回归检测从「人工看 dist」变成「数据可 diff」。

<!--
核心价值：可视化 + 可 diff，体积回归自动化。
-->

---

# 安装与 Node 要求

```bash
# Node.js >= 22 是 v7 的硬性要求
pnpm add -D rollup-plugin-visualizer
```

| 版本 | Node 要求 | 备注 |
|------|-----------|------|
| **v7.x（当前）** | **>= 22** | 主线维护 |
| v6.x | >= 18 | Node 18 项目停留 |
| v5.x | >= 14 | Node 14 项目停留 |

- 老项目升 Node 22 后再装 v7
- Node 18 项目可暂时停留 v6

<!--
Node 门槛是 v7 最大变更，老项目升级前先评估 Node。
-->

---

# Rollup 集成

```js
// rollup.config.js
import { visualizer } from "rollup-plugin-visualizer";

export default {
  input: "src/main.js",
  output: { dir: "dist", format: "es" },
  plugins: [
    // ...其他插件...
    visualizer(), // 必须放在 plugins 数组最后
  ],
};
```

- **具名导出** `visualizer`（也支持 default）
- **必须最后**：visualizer 需看到最终 bundle 产物
- README 原话：`Keep it last.`

<!--
"Keep it last" 是 README 明确要求，前置会被压缩插件变换导致数据失真。
-->

---

# Vite 集成

```ts
// vite.config.ts
import { defineConfig, type PluginOption } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    visualizer({
      template: "treemap",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }) as PluginOption,
  ],
});
```

- Vite 底层是 Rollup，直接调用 Rollup 插件
- **`as PluginOption`** 类型断言是 Vite + TS 标配

<!--
Vite PluginOption 与 Rollup Plugin 不完全等价，断言避免类型冲突。
-->

---

# 五种可视化模板

| 模板 | 形式 | 适合 |
|------|------|------|
| **treemap**（默认） | 矩形（面积=体积） | 日常分析 |
| **sunburst** | 同心圆环（弧长=体积） | 层级占比 |
| **treemap-3d** | 3D 矩形（高度=体积） | 演示冲击 |
| **network** | 节点+边（灰圈=摇树掉） | 追引用链 |
| **flamegraph** | 火焰图（宽条=热点） | 体积热点 |

```ts
visualizer({ template: "network" }) // 排查「为什么被打进包」
```

> 颜色：**蓝=项目源码、绿=依赖**（按 node_modules 判定）。

<!--
五种模板各有侧重，treemap 日常、network 排查引用。
-->

---

# CI 友好模板

非可视化的三种模板，适合程序化分析与体积回归

| template | 输出 | 默认 filename | 适合 |
|----------|------|---------------|------|
| **raw-data** | JSON | `stats.json` | CI 程序化分析 |
| **list** | YAML | `stats.yml` | **PR 体积 diff 首选** |
| **markdown** | Markdown | `stats.md` | 文档归档 |

```ts
visualizer({ template: "list", filename: "bundle-stats.yml" })
```

- `raw-data` 有独立 `version` 字段
- `list` 遵循 SemVer
- `markdown` 暂不版本化（随 LLM 演进）

<!--
list 模板产 YAML 提交仓库，PR diff 即体积回归，比 HTML 报告更适合 git 跟踪。
-->

---

# 核心选项速查

| 选项 | 默认 | 作用 |
|------|------|------|
| `template` | `'treemap'` | 8 种模板 |
| `filename` / `projectRoot` | 推导 / cwd | 输出路径 / 裁剪绝对路径 |
| `open` | `false` | 构建后打开浏览器 |
| `gzipSize` / `brotliSize` | `false` | 追加压缩体积 |
| `emitFile` / `sourcemap` | `false` | Rollup emit 输出 / sourcemap 体积 |
| `include` / `exclude` | — | picomatch 过滤 |

<!--
open 在 emitFile:true / template:'raw-data' 时被忽略；CI 必须关 open；include/exclude 用 'BUNDLE:FILE' 紧凑写法。
-->

---

# gzipSize / brotliSize / sourcemap

看压缩体积 vs 看源码体积，**互斥**

```ts
// 想看线上传输体积（默认 rendered 不准）
visualizer({ gzipSize: true, brotliSize: true })

// 想看压缩前真实源码占比
visualizer({ sourcemap: true }) // 同时必须开 rollup output.sourcemap
```

- 源码：`gzipSize = gzipSizeRequested && !opts.sourcemap`
- **开 sourcemap 会强制关 gzip/brotli，且无提示**
- sourcemap 必须配合 Rollup `output.sourcemap:true`

<!--
二者不要同时开；sourcemap 模式下 gzip 自动关，无额外提示。
-->

---

# emitFile 与 SvelteKit

SvelteKit 一次构建跑 2~3 次 Vite，默认配置会产生多份文件

```ts
visualizer({
  emitFile: true,         // 用 Rollup emitFile API 输出
  filename: "stats.html", // 必须纯文件名，不能含路径
}) as PluginOption,
```

- `emitFile:true` 时 `filename` 含 `./` / `../` / 绝对路径 → **直接抛 `ERR_FILENAME_EMIT`**
- `emitFile:true` 时 `open` **被忽略**

<!--
SvelteKit 场景必备；filename 必须纯文件名是硬约束。
-->

---

# 已废弃：json 选项

```ts
// ❌ 已软废弃，每次构建打印警告
visualizer({ json: true })

// ✅ 改用
visualizer({ template: "raw-data" })
```

源码 warn：

```text
Option `json` deprecated, please use template: "raw-data"
```

- **澄清**：任务摘要里提到的 `openDeprecated` **在源码中并不存在**，是误传
- 当前唯一的 `@deprecated` 选项是 `json`
- `open` 与 `openOptions` 都是有效且**非废弃**的选项

<!--
避免幻觉题：openDeprecated 不存在，废弃的是 json。
-->

---

# CLI 合并多份 JSON

多 entry / 多配置分别产 raw-data，再用 CLI 合并

```bash
# 产 raw-data JSON
visualizer({ template: "raw-data", filename: "stats-server.json" })
visualizer({ template: "raw-data", filename: "stats-client.json" })

# 合并成一张图
npx rollup-plugin-visualizer --template treemap \
  stats-server.json stats-client.json
```

- 适合 SSR（server + client 两份 bundle）
- 也适合 monorepo 多包构建合并分析

<!--
CLI 合并是处理多 entry / 多配置场景的标准做法。
-->

---

# 与 Webpack Bundle Analyzer 对比

| 维度 | rollup-plugin-visualizer | Webpack Bundle Analyzer |
|------|--------------------------|--------------------------|
| 服务于 | **Rollup / Vite** | Webpack |
| 维护方 | btd（个人） | webpack-contrib（官方） |
| 模板 | **8 种** | **仅 treemap** |
| 体积维度 | rendered/gzip/brotli | stat/parsed/gzip/brotli |
| 启动模式 | 插件 + CLI 合并 | server/static/json/disabled |
| CI 友好 | raw-data/list 可 diff | static HTML 归档 |
| Node 要求 | v7 ≥ Node 22 | 5.x ≥ Node 18 |

> Vite/Rollup → visualizer；Webpack → WBA；多模板+Webpack 换 bundle-stats/Statoscope。

<!--
两者生态边界清晰，按打包工具选。
-->

---

# 反模式速查

避开这些坑，少走弯路

- 插件**不放在最后** → 看到压缩前体积，与线上不符
- `emitFile:true` 时 filename 带路径 → **`ERR_FILENAME_EMIT`**
- `sourcemap:true` 但 Rollup output.sourcemap 未开 → warn + 数据不准
- `sourcemap:true` 时还指望 gzipSize 生效 → **静默关闭**
- 继续用 `json:true` → 每次构建打印 deprecation 警告
- CI 中 `open:true` → 尝试调起浏览器致构建卡住
- 期望模板视觉跨版本稳定 → **不保证 SemVer**
- Node < 22 装 v7 → 装不上 / 运行崩

<!--
八个反模式覆盖了 90% 的踩坑场景。
-->

---
layout: center
class: text-center
---

# 小结

rollup-plugin-visualizer = Vite/Rollup 体积可视化事实标准

8 种模板 · CI 友好 · btd 长期维护

**treemap 日常 · network 排查 · list 做 PR 体积 diff**

[文档](https://github.com/btd/rollup-plugin-visualizer) · [npm](https://www.npmjs.com/package/rollup-plugin-visualizer)

<!--
记住三个关键场景对应模板：treemap、network、list，覆盖日常 90% 需求。
-->
