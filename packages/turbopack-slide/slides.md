---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Turbopack
info: |
  Presentation Turbopack — the Rust-powered incremental bundler built into Next.js.

  Learn more at [https://nextjs.org/docs/app/api-reference/turbopack](https://nextjs.org/docs/app/api-reference/turbopack)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">⚡</span>
</div>

<br/>

## Turbopack — 内置于 Next.js 的 Rust 增量打包器

用 Rust 编写、内置于 Next.js、针对 JS/TS 优化的增量打包器，目标替代 webpack。底层 SWC + Lightning CSS，靠函数级增量缓存与懒打包做到极快。Next.js 16 起已是默认打包器

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/vercel/next.js" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Turbopack —— Vercel 用 Rust 编写、内置于 Next.js 的增量打包器，目标是替代 Next 里的 webpack。
底层用 SWC 编译 JS/TS、Lightning CSS 处理 CSS，靠 Turbo engine 的函数级增量缓存和懒打包做到极快。
Next.js 16 起它已经成为默认打包器。

顺序：先澄清和 Turborepo 的区别 → 是什么 → 为什么快 → 现状 → 启用 → 零配置支持 → 配置 → 迁移 → 踩坑 → 总结。
-->

---

# 先澄清：Turbopack ≠ Turborepo

两个都来自 Vercel、名字像，但**完全不同**：

<div class="grid grid-cols-2 gap-4 mt-4">
<div>

**Turbopack** 📦

- **打包器**，替代 webpack
- 模块打包 / Fast Refresh / 依赖图
- 内置于 Next.js
- **没有** `turbo.json`

</div>
<div>

**Turborepo** 🚀

- **monorepo 任务编排**
- `turbo.json` / task pipeline
- 远程缓存 / `--filter`
- 独立 CLI 工具

</div>
</div>

<div v-click class="mt-4 text-sm">

> 出题最爱的干扰项：把 `turbo.json` / `--filter` / 远程缓存安到 Turbopack 头上 —— 那都是 Turborepo。

</div>

<!--
先把最容易混的事说清楚：Turbopack 和 Turborepo 是两个完全不同的东西，只是都来自 Vercel、名字像。
Turbopack 是打包器，替代 webpack，处理模块打包、Fast Refresh、依赖图，内置在 Next.js 里，没有 turbo.json。
Turborepo 是 monorepo 任务编排器，有 turbo.json、task pipeline、远程缓存、--filter。
记住：turbo.json 和 --filter 是 Turborepo 的，不属于 Turbopack。
-->

---

# Turbopack 是什么

> 官方定义：an incremental bundler optimized for JavaScript and TypeScript, written in Rust, and built into Next.js

<v-clicks>

- **Rust 编写**的增量打包器（incremental bundler）
- **内置于 Next.js**，随之分发，无独立 npm 包
- 底层：JS/TS/JSX → **SWC**；CSS → **Lightning CSS**
- 同时支持 **App Router 与 Pages Router**
- **不做类型检查** —— 需自行跑 `tsc`

</v-clicks>

<!--
官方定义就是一句话：用 Rust 编写、内置于 Next.js、针对 JS/TS 优化的增量打包器。
它随 Next.js 分发，没有独立的 npm 包。底层 JS/TS 用 SWC，CSS 用 Lightning CSS，App 和 Pages Router 都支持。
注意它不做类型检查，build 通过也不代表类型没问题，要自己跑 tsc。
-->

---

# 为什么快：Turbo engine 四大设计

<v-clicks>

- **Unified Graph 统一图**：单一图管理 client / server 多个输出环境
- **dev 期仍打包**：不裸用 native ESM —— 小应用快但大应用因海量请求变慢，Turbopack 优化后大应用也快
- **Incremental Computation 增量计算**：结果缓存到**函数级别**，做过的工作永不重复（Turbo engine 核心）
- **Lazy Bundling 懒打包**：只编译 dev server **实际请求**到的内容

</v-clicks>

<!--
Turbopack 快的秘密在底层 Turbo engine 的四大设计：统一图用单一图管理 client/server 多环境；
dev 期仍然打包而非裸用 native ESM，因为后者在大应用上会因海量网络请求变慢；
增量计算把结果缓存到函数级别，做过一次的工作永不重复，这是最核心的；懒打包只编译实际请求到的内容。
-->

---

# 现状：Next 16 起默认

| 版本 | 里程碑 |
|---|---|
| v13.0 | alpha 引入 |
| **v15.0** | **`dev` stable** |
| v15.3 / 15.5 | `build` experimental / beta |
| **v16.0** | **成为默认打包器，dev+build 均 stable** |

<div v-click class="mt-3">

**性能（Next 16 官方）**：生产构建快 **2–5×**，Fast Refresh **最多约 10×**

</div>

<!--
稳定性演进要记住两个关键节点别混淆：v15.0 是 dev 进入 stable，v16.0 才是成为默认打包器、dev 和 build 都 stable。
中间 v15.x 的 build 还是 experimental 和 beta。

性能方面 Next 16 官方数字是生产构建快 2 到 5 倍，Fast Refresh 最多约 10 倍。
-->

---

# 启用与 CLI

Next 16 **默认即用**，标准脚本无需改：

```jsonc
{ "dev": "next dev", "build": "next build" } // 默认走 Turbopack
```

```bash
next dev --turbopack   # 强制启用（默认已开），--turbo 是别名
next dev --webpack     # 退回 webpack
npm run dev -- --webpack  # npm 透传需加 --
```

<div v-click class="text-sm mt-2">

> 现在反过来了：`--turbopack` 默认已开，真正改变行为的是 `--webpack`（退回）。

</div>

<!--
Next 16 默认就是 Turbopack，标准脚本不用加任何 flag。--turbopack 是强制启用（其实默认已开），--turbo 是它的别名。
真正改变行为的反而是 --webpack，用来退回 webpack。npm run 透传 flag 要加 --，pnpm/yarn/bun 不用。
另外 FreeBSD/OpenBSD 这种无 native binding 的平台不支持 Turbopack，必须 --webpack。
-->

---

# 零配置支持清单

无需任何配置即可用：

<v-clicks>

- **语言**：JS / TS（SWC）、ESM 静态+动态 import、CommonJS
- **React**：JSX/TSX、Fast Refresh、RSC
- **CSS**：Global / CSS Modules / Nesting / `@import` / PostCSS（适配 Tailwind）/ **Sass 开箱即用**
- **资源**：图片/字体 import、JSON
- **路径**：`tsconfig.json` 的 `paths` / `baseUrl`

</v-clicks>

<!--
Turbopack 零配置支持范围很广：JS/TS 用 SWC，ESM 和 CommonJS 都支持；
React 的 JSX、Fast Refresh、Server Components 都开箱即用；
CSS 方面 Global CSS、CSS Modules、嵌套、PostCSS、Sass 全部内置，不用装 css-loader/sass-loader；
图片字体 JSON 直接 import；还会读 tsconfig 的 paths 别名。
-->

---

# 配置：`turbopack` 顶层键

```js
// next.config.js
module.exports = {
  turbopack: {                     // 不是 webpack！
    rules: {
      "*.svg": { loaders: ["@svgr/webpack"], as: "*.js" },
    },
    resolveAlias: { "@": "./src" }, // ~* → * 兼容 Sass 波浪号
    resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
};
```

<div v-click class="text-sm mt-2">

> ⚠️ `resolveExtensions` 是**覆盖**不是合并，漏默认项会解析失败；键名 v15.3 起从 `experimental.turbo` 改为 `turbopack`。

</div>

<!--
自定义配置写在 next.config 的 turbopack 顶层键下，注意不是 webpack。常用 rules 配 loader、resolveAlias 配别名、
resolveExtensions 配扩展名。两个坑：resolveExtensions 是覆盖不是合并，必须把默认扩展名都列上；
键名历史上从 experimental.turbo 改名成了 turbopack，Next 16 移除了旧名，迁移有 codemod。
-->

---

# 从 webpack 迁移要点

<v-clicks>

- **`webpack()` 改写成 `turbopack`** 配置（不生效就是不生效）
- **不支持 webpack plugins**（只支持 loaders）—— 最大坑
- **Sass `~` 波浪号失效**：`@import '~bootstrap'` → `'bootstrap'`
- **CSS Module 按 import 顺序排序** → 可能渲染微变
- **必须留 webpack**：`sassOptions.functions` / Yarn PnP / `urlImports` / `esmExternals`

</v-clicks>

<div v-click class="text-sm mt-2">

> Next 16 中有自定义 webpack 配置的项目会构建失败，须迁移或 `--webpack` 退回。

</div>

<!--
从 webpack 迁移的核心：把 webpack() 改写成 turbopack 配置；最大的坑是不支持 webpack plugins，只支持 loaders；
Sass 的波浪号导入会失效要改写；CSS Module 排序可能导致渲染微变；
sassOptions.functions、Yarn PnP、urlImports、esmExternals 这些永远不支持，必须留在 webpack。
Next 16 里如果还有自定义 webpack 配置，构建会直接失败，要么迁移要么 --webpack 退回。
-->

---

# 常见坑 & Tips

<v-clicks>

- **Turbopack ≠ Turborepo**：`turbo.json` / `--filter` 是 Turborepo 的
- **不做类型检查**：build 通过 ≠ 类型没问题，要 `tsc`
- **不支持 webpack plugins**，只支持 loaders
- **`resolveExtensions` 覆盖**须含默认项
- **`root` 外文件不解析**：link 依赖要设 `root` 为共同父目录
- **WASM 平台**（FreeBSD/OpenBSD）须 `--webpack`

</v-clicks>

<!--
踩坑汇总：别把 Turbopack 当 Turborepo，turbo.json 和 --filter 是后者的；Turbopack 不做类型检查；
不支持 webpack plugins；resolveExtensions 覆盖须含默认项；root 外文件不解析，link 依赖要调 root；
WASM 平台不支持要 --webpack。
-->

---
layout: intro
---

# 总结

Turbopack = **Rust 增量打包器 + 内置 Next.js**

- 底层 SWC + Lightning CSS，函数级增量 + 懒打包
- Next 16 起默认、零配置，dev+build 均 stable
- 生产构建快 2–5×、Fast Refresh 最多约 10×
- ⚠️ 强绑 Next、不支持 webpack plugins

<div class="mt-6 text-sm">

📖 [nextjs.org/docs/.../turbopack](https://nextjs.org/docs/app/api-reference/turbopack) ·
<carbon:logo-github /> [vercel/next.js](https://github.com/vercel/next.js)

</div>

<!--
总结：Turbopack 是 Rust 写的增量打包器，内置于 Next.js，底层 SWC 加 Lightning CSS，靠函数级增量和懒打包做到极快。
Next 16 起成为默认、零配置，dev 和 build 都 stable，生产构建快 2-5 倍。要记住它强绑 Next、不支持 webpack plugins。谢谢！
-->

---
layout: end
---

# 谢谢观看

<div class="text-xl opacity-80">⚡ Powered by Rust, built into Next.js</div>
