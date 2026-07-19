---
theme: seriph
background: https://cover.sli.dev
title: 代码压缩完全指南
info: |
  代码压缩（Minification）完全指南：构建期源码压缩 · Terser/esbuild/SWC/lightningcss/cssnano · Vite/Webpack 配置

  Learn more at [https://terser.org](https://terser.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 代码压缩完全指南

构建期源码压缩 · Terser / esbuild / SWC / lightningcss / Vite 7

<div class="absolute inset-0 flex items-center justify-center" style="pointer-events:none">
  <h1 class="text-7xl font-bold" style="background:linear-gradient(135deg,#42b883 10%,#35495e 90%);-webkit-background-clip:text;background-clip:text;color:transparent">代码压缩</h1>
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
代码压缩是构建期对源码做语法等价改写以减小产物体积的过程。2026 年工具链已基本 Rust 化。
-->

---

# 什么是代码压缩

构建期对源码做**语法等价改写**减小体积

- **不改变运行时行为**，只换更短的等价写法
- **三轴收益**：去空白·缩短变量·重写语法
- **零运行时成本**：构建期一次改写，运行时不变
- **与传输压缩叠加**：100KB → 压缩 70KB → gzip 25KB

**典型压缩示例**

```text
// 源码
function add(a, b) { return a + b; }
const flag = true;

// 压缩后
function add(a,b){return a+b}const t=!0;
```

> 代码压缩 ≠ 传输压缩（gzip）。两者正交且叠加。

<!--
强调"语法等价改写"——压缩后行为不变。
-->

---

# 压缩 vs 易混淆概念

| 概念 | 阶段 | 干什么 |
|------|------|------|
| **压缩（Minification）** | 构建期 | 源码等价改写减体积 |
| **传输压缩（gzip/brotli）** | 传输层 | 字节流编码再解码 |
| **Tree shaking** | 打包期 | 删未引用的导出（DCE） |
| **格式化（Prettier）** | 开发期 | 美化代码（生产反操作） |
| **转译降级（Babel/swc）** | 编译期 | 新语法 → 旧语法 |
| **混淆（Obfuscation）** | 构建期 | 故意让人读不懂（与压缩目标不同） |

> 本叶只讲构建期源码压缩；gzip/brotli 归【网络优化】叶。

<!--
边界一定要清晰，否则容易把压缩和 tree shaking、格式化混为一谈。
-->

---

# 三大 JS 压缩器速览

| 工具 | 语言 | 默认集成 | 速度 | 压缩率 |
|------|------|------|------|------|
| **Terser** | JS | Webpack 5 | 慢 | 标杆（最高） |
| **esbuild** | Go | Vite 6 及之前 | 极快 | 略低 0.5~2% |
| **SWC** | Rust | Next.js / Rspack | 快 | 接近 Terser |
| **Oxc** | Rust | **Vite 7 默认** | 极快（30~90x terser） | 接近 esbuild |

**选型一句话**

- Vite 7+：零配置 Oxc + lightningcss
- Webpack 5：Terser（JS）+ CssMinimizer（CSS）
- Next.js / Rspack：SWC 默认
- 追求极限压缩比：Terser + `passes:2~3` + `unsafe_*`

<!--
Oxc 是新工具链代表，Vite 7 已默认采用，比 Terser 快 30~90 倍。
-->

---

layout: two-cols
---

# Terser 三大选项组

```ts
import { minify } from 'terser';

const { code } = await minify(js, {
  compress: {},   // 压缩选项，false 跳过
  mangle: true,   // 重命名标识符
  format: {},     // 输出格式
});
```

**核心子选项**

- `compress.drop_console`（默认 false）
- `compress.drop_debugger`（默认 true）
- `compress.pure_funcs`（标记无副作用）
- `compress.passes`（默认 1，建议 2~3）
- `compress.toplevel`（默认 false）
- `mangle.keep_classnames` / `keep_fnames`

::right::

# mangle 默认开

```text
// 源码
function calc(price, rate) {
  return price * (1 - rate);
}

// mangle:true 压缩后
function calc(a,b){return a*(1-b)}
```

> mangle 干扰调试栈，开发期必须关。

**Fast Minify Mode**

```ts
// 只 mangle + 去空白，跳过 compress 分析
minify(js, {
  compress: false,
  mangle: true,
});
// 拿 95% 收益，耗时降到 1/10
```

<!--
Terser 的 compress/mangle/format 三组选项是 JS 压缩器的事实标准，esbuild/SWC 都在模仿。
-->

---

# esbuild minify 三合一

```bash
esbuild input.js --minify                  # 全开
esbuild input.js --minify-whitespace       # 只去空白
esbuild input.js --minify-identifiers      # 只重命名
esbuild input.js --minify-syntax           # 只重写语法
```

`minify=true` ≡ 三个独立 flag 全开

**关键约束**

- **默认不混淆顶层声明名**（输出可能被注入到其他代码中）
- 启用 bundling 或设 `format` 才安全混淆顶层名
- 与 `target` 联动：会用 `??`、`?.` 等现代语法降级写法

```text
// 源码
a === undefined || a === null ? 1 : a;
// target=es2020
a ?? 1;
```

> 兼容老浏览器必须显式 `--target=es6`。

<!--
esbuild 默认不混淆顶层声明名是常见疑惑点——原因是不知道输出会被注入到哪里。
-->

---

layout: two-cols
---

# drop vs pure（esbuild）

```text
// 源码
console.log('debug');
console.error('real error');
console.warn('warning');
debugger;
```

**drop（删全部方法）**

```ts
esbuild.transform(code, {
  drop: ['console', 'debugger'],
});
// console.log / error / warn 全删
```

::right::

# pure（保留 error/warn）

```ts
esbuild.transform(code, {
  pure: ['console.log'],
});
// 只删 console.log
// console.error / warn 保留
```

> `drop:['console']` 一刀切；
> `pure:['console.log']` 更精细。

**keepNames 保留 .name**

```ts
esbuild.transform(code, {
  minify: true,
  keepNames: true,
});
// 等价 Terser keep_classnames + keep_fnames
```

<!--
drop 和 pure 的语义差别——pure 不会删有副作用的 console.error。
-->

---

# CSS：lightningcss vs cssnano

| 维度 | lightningcss | cssnano |
|------|------|------|
| **语言** | Rust（快 10x+） | JS（PostCSS） |
| **一体化** | 压缩 + 降级 + 前缀 | 仅压缩 |
| **Vite 默认** | ✅ Vite 7+ | ✅ Vite 6 及之前 |
| **targets** | 必配（决定前缀/降级） | 不支持 |

**lightningcss 配置**

```ts
import { transform, browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';
const { code } = transform({ code: Buffer.from(css), minify: true,
  targets: browserslistToTargets(browserslist('>= 0.25%')) });
```

> 一体化替代 autoprefixer + postcss-preset-env + cssnano 三件套。

<!--
lightningcss 是 Vite 7 CSS 默认，建议新项目优先选。
-->

---

# HTML 压缩：html-minifier-terser

最大坑：**默认所有选项全部关闭**，必须显式开启

```ts
import { minify } from 'html-minifier-terser';
const result = await minify(html, {
  collapseWhitespace: true, conservativeCollapse: true,  // 必须配对
  removeComments: true, removeEmptyAttributes: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true, removeStyleLinkTypeAttributes: true,
  useShortDoctype: true, sortAttributes: true, sortClassName: true,
  minifyCSS: true,   // 用 clean-css
  minifyJS: true,    // 用 Terser
});
```

**关键陷阱**

- `collapseWhitespace` 单独开会丢 inline 元素间空格
- 必须配 `conservativeCollapse:true` 保留单空格
- 否则 `<span>a</span> <span>b</span>` 变 `ab`

> 适合 SSG / SSR / 邮件模板 / 静态 HTML 后处理。

<!--
collapseWhitespace + conservativeCollapse 必须配合——单独开 collapseWhitespace 会让 inline 元素粘连。
-->

---

# Vite 7 配置

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: 'oxc',              // 默认（Vite 7+）
    cssMinify: 'lightningcss',  // 默认
    terserOptions: {            // 仅 minify='terser' 时生效
      compress: { drop_console: true, passes: 2 },
      mangle: { keep_classnames: true },
      format: { comments: false },
    },
    cssTarget: 'chrome61',   // 可独立于 JS target
    sourcemap: 'hidden',     // 上报错误监控不暴露源码
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true,
  },
  css: {
    transformer: 'lightningcss',
  },
});
```

> `'esbuild'` 选项已 deprecated，未来移除——升级时改 `'oxc'` 或 `'terser'`。

<!--
Vite 7 默认 Oxc + lightningcss，零配置即得 90% 收益。
-->

---

# Webpack 5 配置（含大坑）

```js
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({          // 必须！
        terserOptions: { compress: { drop_console: true } },
      }),
      new CssMinimizerPlugin(),   // 加任何 plugin 会覆盖默认 TerserPlugin
    ],
  },
};
```

**大坑**：往 `optimization.minimizer` 加任何 plugin 会**整体覆盖**内置默认 `[TerserPlugin]`

- 错误：只加 `CssMinimizerPlugin` → JS 不压缩
- 正确：必须显式 `[TerserPlugin, CssMinimizerPlugin]` 双列

> Webpack 5 内置仅 JS minimizer；CSS 不内置，必须手动加。

<!--
社区最常见的「以为加了压缩结果没生效」的坑。
-->

---

layout: quote
---

# 依赖 .name 的代码必须 keep

「AngularJS 用 toString 读参数名、MobX/styled-components 用 .name 注册——
不开 keep_classnames / keep_fnames 会运行时崩。」

::right::

| 工具 | 选项 |
|------|------|
| **Terser** | `keep_classnames` + `keep_fnames` |
| **esbuild** | `keepNames` |
| **SWC** | `mangle.keepClassNames` + `keepFnNames` |

默认全 false，依赖反射时必须开。

<!--
依赖 .name 反射的代码不开 keep 是高频运行时崩溃源。
-->

---

layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 开发期开压缩（mangle 干扰调试栈）
- 依赖 `.name` 不开 keep（AngularJS/MobX/styled-components 崩）
- `unsafe_*` 不测（可能改浮点结果）
- Webpack 加 minimizer 不显式 TerserPlugin（默认被覆盖）
- lib 模式强制 minify whitespace（破坏 `/*#__PURE__*/`）
- esbuild `mangleProps` 乱用（破坏 DOM/JSON/三方库）
- esbuild 不设 `target`（用现代语法老浏览器崩）
- lightningcss 不配 `targets`（输出冗余前缀或漏降级）
- `html-minifier-terser` 只开 `collapseWhitespace`（丢 inline 空格）
- 删 license 注释（OSS 合规风险）
- 已开 gzip 就不压缩（两层正交且叠加，缺一不可）
- 凭感觉估压缩率（用 metafile / analyzer / size-limit 量化）

<!--
反模式要逐条避免，每条都对应一类线上事故。
-->

---

layout: center
class: text-center
---

# 小结

代码压缩 = 构建期源码语法等价改写

**Terser 标杆 · esbuild/SWC/Oxc 快档 · lightningcss 一体化**

**生产开 / 开发关 · 依赖 .name 必 keep · license 必保留**

[文档](https://terser.org/docs/options/) · [esbuild](https://esbuild.github.io/api/#minify) · [SWC](https://swc.rs/docs/configuration/minification) · [lightningcss](https://lightningcss.dev/docs.html) · [Vite Build](https://vite.dev/config/build-options)

<!--
掌握三压缩器选型 + keep names + Webpack minimizer 覆盖坑，就能把压缩用到生产水准。
-->
