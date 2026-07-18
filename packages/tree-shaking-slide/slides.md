---
theme: seriph
background: https://cover.sli.dev
title: Tree Shaking 完全指南
info: |
  前端 Tree Shaking 完全指南：构建期死代码消除 · ESM 前提 · sideEffects · Webpack/Rollup/Vite

  Learn more at https://webpack.js.org/guides/tree-shaking/
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Tree Shaking 完全指南

构建期死代码消除 · ESM 前提 · sideEffects 三态 · Webpack/Rollup/Vite 8

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Tree Shaking 是构建期死代码消除：扫 ESM 静态依赖图、标记未引用导出、压缩期真正删除。
-->

---
transition: fade-out
---

# 什么是 Tree Shaking

构建期的**死代码消除**（dead code elimination）

- **构建期、零运行期**：所有分析在打包阶段完成
- **ESM 前提**：依赖顶层 `import/export` 的静态可分析性
- **三步链路**：静态分析 → 标记 unused → 压缩期删除
- **跨工具标准**：Webpack / Rollup / Rolldown / esbuild 都支持

> Tree Shaking ≠ 代码压缩。压缩删空白长名，shaking 删「整段没人用」的导出。

<!--
死代码真正删除发生在 minify 阶段；只标 usedExports 不开 minimize 则死代码仍在 bundle。
-->

---

# Tree Shaking vs 代码分割

两者**正交**，配合使用

| 维度 | Tree Shaking | 代码分割 |
|------|------|------|
| **解决的问题** | 「下了没用」 | 「下太多」 |
| **发生时机** | 构建期 | 运行期 |
| **API** | `sideEffects` / `usedExports` | `import()` / `defineAsyncComponent` |

- **Tree Shaking**：决定哪些死代码**不进** bundle
- **代码分割**：决定哪些活代码**延迟加载**
- **标准两段式**：先 shaking 收口、再分割切 chunk

> 本叶只讲静态依赖图剪枝；动态 import / 异步组件 API 归代码分割叶。

<!--
两者正交是核心边界：动态 import() 既触发分割，也保护被引用代码不被 shake。
-->

---

# ESM 是 tree shaking 的前提

| 模块系统 | 静态可分析 | 能否 shake |
|------|------|------|
| **ESM** | ✅ | ✅ |
| **CommonJS** | ❌ | ❌ |
| **UMD / AMD** | ❌ | ❌ |

**根本原因**

- ESM 顶层 `import/export` 在**编译期**确定
- CJS `require()` 是**运行期**值，可在 if / 循环里动态调

**经典等价物**

- `lodash`→`lodash-es`、`moment`→`date-fns`/`dayjs`、`classnames`→`clsx`

<!--
ESM 的 import 必须在顶层、字面量、不能放 if 里——这些「限制」正是 tree shaking 的基础。
-->

---

# 三步原理：分析 → 标记 → 删除

```text
[1] 静态分析   打包器扫一遍 ESM 的 import/export，构建依赖图
[2] 标记       沿图反向传播，标记「未被任何 import 命中」的导出为 unused
              package.json sideEffects 字段决定整模块是否可跳过
[3] 删除       Terser / esbuild 在压缩阶段把 unused 导出真正删除
              Webpack mode=production → minimize: true 才执行
```

**关键时序**

- `sideEffects` 决定「模块级」跳过
- `usedExports` 决定「导出级」标记
- `minimize` 决定「真正删除」

> 只标 `usedExports` 不开 `minimize`：死代码**仍在 bundle**，体积无变化。

<!--
ESM 静态分析的「编译期可确定依赖图」是根本；CJS 必须运行起来才能确定。
-->

---
layout: two-cols
---

# sideEffects 三态

**`false`：整包可 shake**

- 纯 ESM 工具库
- 组件库的 JS 部分

**`Array<string>` 白名单**

- 含 CSS / polyfill 的包
- 保留有真实副作用的文件

```json
{
  "sideEffects": ["*.css", "./src/polyfills.js"]
}
```

::right::

# 缺省 = 保守保留

**不写 `sideEffects` 字段**

- 等价于「整模块保留」
- **不做任何 shake 决策**
- 仅 `usedExports` 单导出级剪枝

**何时用 `false`**

- 包内确认无 CSS / 无 polyfill
- 无 `Array.prototype` 扩展
- 无顶层 `console.log` / IIFE

> 缺省 ≠ false。库作者必须显式声明。

<!--
sideEffects 三态的核心区别：false=整包可shake、白名单=保留副作用文件、缺省=保守保留。
-->

---

# Webpack 五开关

```ts
// webpack.config.ts
export default {
  mode: 'production',                  // 一键启用下列全部
  optimization: {
    usedExports: true,                 // 标记每个导出被使用情况
    sideEffects: true,                 // 按 package.json 字段跳过整模块
    innerGraph: true,                  // Webpack 5：内部依赖图分析
    concatenateModules: true,          // Scope Hoisting
    mangleExports: 'deterministic',    // 短名压缩导出标识符
    minimize: true,                    // 真正执行删除（Terser）
  },
};
```

> Webpack 5 起 `usedExports` / `sideEffects` / `innerGraph` 在所有 mode 默认开。

<!--
mode=production 一键启用全部；minimize 是真正删除的环节，不能省。
-->

---
layout: two-cols
---

# usedExports vs sideEffects

**usedExports**

- 粒度：**单个导出**
- 动作：标记 unused 的导出
- 让 Terser 在 minify 时删除
- 任何模块自动分析

**sideEffects**

- 粒度：**整模块**
- 动作：**跳过整模块**解析
- 更彻底（模块级剪枝）
- 需 package.json 字段配合

::right::

# 配合使用

**顺序**

```text
sideEffects 先跳过整模块
       ↓
usedExports 标记剩余导出
       ↓
minimize 真正删除
```

> sideEffects 决定「模块级」、usedExports 决定「导出级」。

<!--
二者不是二选一，是配合关系：模块级先用 sideEffects 跳过、再用 usedExports 标剩余。
-->

---

# mode: 'production' 一键全开

**production 自动启用清单**

| 开关 | 作用 |
|------|------|
| `usedExports` | 标记未引用导出 |
| `sideEffects` | 按 package.json 跳过整模块 |
| `innerGraph` | 未使用导出内部图分析 |
| `concatenateModules` | Scope Hoisting 合并作用域 |
| `mangleExports` | 短名压缩导出标识符 |
| `minimize` | Terser 真正删除死代码 |

> dev 模式默认禁用 `minimize` 与 `concatenateModules`，shaking 标记存在但**不删除**。

<!--
dev 验证 tree shaking 无效；必须 production build 后比较 bundle 体积。
-->

---

# Rollup treeshake 三预设

| 预设 | 行为 |
|------|------|
| `'smallest'` | 最激进，体积最小（有正确性风险） |
| `'safest'` | 最保守，保留更多代码 |
| `'recommended'`（默认） | 平衡选择，大多数项目应使用 |

**关键子选项**

- `moduleSideEffects` / `propertyReadSideEffects`：模块级与属性读副作用（默认 `true`）
- `annotations`：尊重 `#__PURE__` 注解（默认 `true`）
- `manualPureFunctions`：自定义纯函数清单
- `tryCatchDeoptimization`：try 内代码不被 shake（默认 `true`）

> polyfill 特性检测写在 `try{}` 内会因 `tryCatchDeoptimization: true` 被 Rollup 保留。

<!--
Rollup 是 ESM 库事实标准打包器；三预设按体积 vs 正确性权衡选。
-->

---
layout: two-cols
---

# 注解：精确声明副作用

**`/*#__PURE__*/`（通用）**

- 标记**单次调用**为无副作用
- Rollup / Webpack / Terser / esbuild 通用
- 用法：IIFE / 工厂调用 / class extends 表达式

```ts
const r = /*#__PURE__*/ (function () {
  return computeStuff();
})();
class A extends /*#__PURE__*/ mixin(Base) {}
```

::right::

# 整函数声明（Rollup 专属）

**`/*@__NO_SIDE_EFFECTS__*/`**

- 标记**整函数声明**为无副作用
- 一次注解覆盖**所有调用点**
- 比 `#__PURE__` 更省事

```ts
/*@__NO_SIDE_EFFECTS__*/
function makeStyle(opts) {
  return compute(opts);
}
```

> Vue/React 编译器自动给 `h()` / `createElement()` 加 `#__PURE__`。

<!--
库作者对一组工厂函数优先用 NO_SIDE_EFFECTS；业务代码通常不用手动加。
-->

---

# Vite 8 Rolldown 迁移

Vite 8（2026）起 Rolldown（Rust 实现，10–30× 更快）成为**唯一打包器**

| Vite 7（Rollup） | Vite 8（Rolldown） |
|------|------|
| `build.rollupOptions` | `build.rolldownOptions` |
| `output.manualChunks`（对象） | **已移除**（静默不生效） |
| `output.manualChunks`（函数） | `output.codeSplitting`（弃用警告） |

**编译期常量在 prod build 静态替换**

- `import.meta.env.DEV` → `false`
- `import.meta.env.PROD` → `true`
- `if (import.meta.env.DEV) {...}` → 整段被死代码消除

> 改成 `const isDev = ...` 运行期变量会失去静态可分析性，prod build 不会 tree-shake。

<!--
Vite 7 用 rolldown-vite 包做过渡；Vite 8 正式替换 Rollup。
-->

---
layout: two-cols
---

# CSS 按需生成

**Tailwind v4（默认开启）**

```css
/* 入口 CSS */
@import "tailwindcss";
@source "../src/**/*.{vue,js,ts}";
```

- CSS-first 配置
- 默认 tree-shaking
- 按扫描结果生成类名

**Tailwind v3**

```ts
// tailwind.config.js
export default {
  content: ['./src/**/*.{vue,js,ts}'],
};
```

::right::

# PurgeCSS（独立工具）

**跨方案通用**

- 不绑定 Tailwind
- 接 Webpack / PostCSS 插件
- 需配 `content` 扫描路径

```js
// purgecss.config.js
export default {
  content: ['./src/**/*.html',
            './src/**/*.vue'],
};
```

> 动态拼接类名（如 `bg-${color}-500`）扫不到，类名被误删——用完整类名 + safelist。

<!--
Tailwind v4 默认开 tree-shaking；PurgeCSS 须显式接入；两者都靠扫描源码保留用到的类名。
-->

---

# 失效场景速查

| 场景 | 解法 |
|------|------|
| CJS 库（lodash/moment） | 改用 ESM 等价物 |
| barrel 缺 `sideEffects` / `false` 误伤 polyfill | 标 `false`、白名单 `["*.css"]` 或深路径 |
| try-catch polyfill 检测 | 重写为显式 if 或 `manualPureFunctions` |
| `const isDev = ...` 运行期判断 | 直接用 `import.meta.env.DEV` |
| 只标 `usedExports` 不开 `minimize` / dev 验证 | 开 `minimize: true`、prod build 看 stats |
| 动态拼接 Tailwind 类名 | 完整类名 + safelist |
| Vite 8 仍写 `manualChunks` | 改 `output.codeSplitting` |

<!--
几乎所有 shaking 失效都来自这九个场景之一；遇到问题逐项排查。
-->

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 在 CJS 上期待 tree shaking（动态 `require` 不可分析）
- `sideEffects: false` 设过头误伤 polyfill / CSS
- 用 barrel 文件且不设 sideEffects
- 只在 dev 模式验证（dev 不删代码）
- Webpack 开了 usedExports 却不开 minimize
- IIFE / `new Class()` 未加 `#__PURE__`
- 把 `import.meta.env.DEV` 改成运行期变量
- Vite 升 8 后仍写 `manualChunks`

> 库作者：声明 `sideEffects`、加 `#__PURE__` 注解、保持 ESM 双入口。

<!--
库作者一次声明 sideEffects + 注解，业务侧只需 production build 即可受益。
-->

---
layout: center
class: text-center
---

# 小结

Tree Shaking = 构建期死代码消除

ESM 前提 · sideEffects 三态 · Webpack 五开关 · 注解声明

**先 shaking 收口 · 再代码分割 · production build 验证**

[Webpack 文档](https://webpack.js.org/guides/tree-shaking/) · [Rollup 文档](https://rollupjs.org/configuration-options/) · [Vite 8 公告](https://vite.dev/blog/announcing-vite8)

<!--
记住三件套：ESM 前提、库声明 sideEffects、production build 验证。
-->
