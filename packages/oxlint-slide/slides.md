---
theme: seriph
background: https://cover.sli.dev
title: Welcome to oxlint
info: |
  Presentation about oxlint for developers.

  Learn more at [https://oxc.rs/](https://oxc.rs/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# oxlint

Rust 驱动的超高速 JavaScript / TypeScript Linter（基于 v1.70.0）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/oxc-project/oxc" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天聊 oxlint —— 来自 Oxc 工具链、用 Rust 写的 Linter，主打一个"快"。
它为什么快、怎么用、和 ESLint 是什么关系？我们一起看看。
-->

---
transition: fade-out
---

# 什么是 oxlint？

来自 Oxc（JavaScript Oxidation Compiler）工具链的 Rust 实现 Linter

<v-clicks>

- 比 ESLint 快 **50–100 倍**，为大型仓库与 CI 而生
- **零配置**开箱即用，默认开启 `correctness` 类（几乎确定是 bug 的规则）
- 内置 **800+** 规则，覆盖 ESLint 核心 + TypeScript + React / Unicorn / Import 等
- 单个自包含二进制，无需再装一堆 `eslint-plugin-*`

</v-clicks>

<div v-click="'+1'" text-xs mt-4>

_Read more about_ [_oxlint overview_](https://oxc.rs/docs/guide/usage/linter)

</div>

<style>
h1 {
  background-color: #5b21b6;
  background-image: linear-gradient(45deg, #7c3aed 10%, #4c1d95 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
oxlint 是 Oxc 工具链的一员，用 Rust 写。

[click] 它最大的卖点是快，比 ESLint 快 50 到 100 倍。

[click] 而且零配置就能跑，默认只开那些"基本可以肯定是 bug"的规则，误报极低。

[click] 它内置了 800 多条规则，常见生态都覆盖了。

[click] 一个二进制搞定，不用再装一堆插件依赖。
-->

---
transition: fade-out
---

# 为什么这么快？

Rust + 多核并行 + 内置规则

<v-clicks>

- **Rust 编写**：零 GC、零运行时开销
- **多核并行**：核越多越快，充分压榨 CI 机器
- **规则内置**：省去 JS 插件加载，AST 只遍历一遍
- **单文件优先**：默认不做类型分析，换取极致速度

</v-clicks>

<div v-click mt-4>

```bash
# 百万行级仓库，全量 lint 的量级差异
eslint .    # 数十秒 ~ 几分钟
oxlint .    # 通常 < 1 秒
```

</div>

<style>
h1 {
  background-color: #5b21b6;
  background-image: linear-gradient(45deg, #7c3aed 10%, #4c1d95 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
为什么能快这么多？

[click] 首先是 Rust，没有垃圾回收、没有 JS 运行时开销。

[click] 其次是多核并行，机器核越多它越快。

[click] 再者规则是内置的，不用动态加载 JS 插件，AST 也只遍历一遍。

[click] 最后，它默认是单文件、不做类型分析，用这个取舍换极致速度。

[click] 直观感受：百万行仓库，ESLint 要几十秒到几分钟，oxlint 通常一秒内。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与运行

装好即用，无需配置

::left::

<div v-click>

- **安装**：

  ```bash
  pnpm add -D oxlint
  ```

</div>

<div v-click>

- **直接跑**（零配置）：

  ```bash
  pnpm exec oxlint
  ```

  <span text-xs text-gray>默认只开 `correctness` 类，误报极低</span>

</div>

::right::

<div v-click>

- **自动修复**：

  ```bash
  oxlint --fix
  ```

</div>

<div v-click>

- **更激进的修复**：

  ```bash
  oxlint --fix --fix-suggestions \
         --fix-dangerously
  ```

  <span text-xs text-gray>危险级修复可能改变语义，需复核</span>

</div>

<style>
h1 {
  background-color: #5b21b6;
  background-image: linear-gradient(45deg, #7c3aed 10%, #4c1d95 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
上手非常简单。

[click] 装一下：pnpm add -D oxlint，单个二进制。

[click] 直接 pnpm exec oxlint 就能跑，零配置，默认只开 correctness 类。

[click] 加 --fix 自动修复安全问题。

[click] 想更激进可以叠加 suggestions 和 dangerously，但危险级会改语义，要人工复核。
-->

---
layout: image-right
transition: fade-out
image: https://cover.sli.dev
---

# 配置 .oxlintrc.json

按需定制，`oxlint --init` 生成

<div v-click>

```json
{
  "categories": {
    "correctness": "error",
    "suspicious": "warn"
  },
  "rules": {
    "no-console": "warn",
    "typescript/no-explicit-any": "error"
  }
}
```

</div>

<v-clicks>

- `categories` 按意图批量开关
- `rules` 精确控制单条，`rules` 优先级更高
- 严重级：`off` / `warn` / `error`

</v-clicks>

<style>
h1 {
  background-color: #5b21b6;
  background-image: linear-gradient(45deg, #7c3aed 10%, #4c1d95 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
要定制就用配置文件。

[click] oxlint --init 生成 .oxlintrc.json，长这样：categories 批量开类别，rules 调单条规则。

[click] categories 按意图批量开关；rules 精确控制且优先级更高；严重级就是 off / warn / error 三档。
-->

---
transition: fade-out
---

# 规则类别（categories）

800+ 规则按"意图"分组，可整组开关

<div v-click>

| 类别          | 含义                     | 默认   |
| ------------- | ------------------------ | ------ |
| `correctness` | 几乎确定是 bug           | **on** |
| `suspicious`  | 可疑、值得怀疑           | off    |
| `pedantic`    | 严格，可能有误报         | off    |
| `perf`        | 运行时性能               | off    |
| `style`       | 风格一致性               | off    |
| `restriction` | 禁用特定写法             | off    |

</div>

<div v-click text-xs mt-2>

_还有实验性的 `nursery` 类。_ _Read more about_ [_rules_](https://oxc.rs/docs/guide/usage/linter/rules)

</div>

<style>
h1 {
  background-color: #5b21b6;
  background-image: linear-gradient(45deg, #7c3aed 10%, #4c1d95 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
800 多条规则按意图分成几类，可以整组开关。

[click] correctness 是几乎确定的 bug，默认就开；往下 suspicious、pedantic、perf、style、restriction 依次更严格或更主观，默认都关。

[click] 还有个实验性的 nursery。按需选择类别，是 oxlint 配置的核心思路。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8 grid-rows-[100px_1fr_40px]!
---

# 从 ESLint 迁移

替代，而非补充

::left::

<div v-click>

### 路线一：一键替换

```bash
npx @oxlint/migrate
# 含类型规则：
npx @oxlint/migrate --type-aware
```

<span text-xs text-gray>把 flat config 转成 `.oxlintrc.json`</span>

</div>

::right::

<div v-click>

### 路线二：增量共存

```js
// eslint.config.js
import oxlint from "eslint-plugin-oxlint";
export default [
  /* 原有配置 */
  ...oxlint.configs["flat/recommended"],
];
```

<span text-xs text-gray>oxlint 跑大头，ESLint 只留它不支持的</span>

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_migrate from ESLint_](https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint)

</div>

<style>
h1 {
  background-color: #5b21b6;
  background-image: linear-gradient(45deg, #7c3aed 10%, #4c1d95 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
oxlint 定位是 ESLint 的替代，不是补充。两条路线。

[click] 路线一彻底替换：npx @oxlint/migrate 把现有 flat config 转成 oxlint 配置，带类型规则就加 --type-aware。

[click] 路线二增量共存：在 ESLint 装 eslint-plugin-oxlint，把 oxlint 已覆盖的规则关掉，让 oxlint 跑大头、ESLint 只留它还不支持的。大项目推荐先这样过渡。
-->

---
transition: fade-out
---

# 类型感知与插件

不止单文件快速 lint

<v-clicks>

- **type-aware**：`oxlint --type-aware`，跑需类型信息的规则（如 `no-floating-promises`），底层 `oxlint-tsgolint`
- **内置插件**：`typescript` / `react` / `unicorn` / `import` / `jsx-a11y` / `jest` 等十余个
- **JS 插件**（alpha）：用 `jsPlugins` 写自定义规则
- **oxfmt**：配套格式化器，oxlint 自身不做格式化

</v-clicks>

<div v-click="'+1'" text-xs mt-2>

_Read more about_ [_type-aware linting_](https://oxc.rs/docs/guide/usage/linter/type-aware)

</div>

<style>
h1 {
  background-color: #5b21b6;
  background-image: linear-gradient(45deg, #7c3aed 10%, #4c1d95 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
oxlint 不止于单文件快速 lint。

[click] type-aware 能跑需要类型信息的规则，比如 no-floating-promises，底层用 oxlint-tsgolint，速度仍然很快。

[click] 内置十几个常用插件的规则。

[click] 还能用 JS 写自定义规则，不过这块还在 alpha。

[click] 格式化交给配套的 oxfmt，oxlint 自己只管 lint。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 集成编辑器与 CI

放进日常工作流

::left::

<div v-click>

### 编辑器

- VS Code 安装官方 **Oxc** 扩展
- 保存即时报告，支持一键 `--fix`
- 其它编辑器走内置 language server

</div>

::right::

<div v-click>

### CI / Git Hooks

```json
// package.json
"lint-staged": {
  "*.{js,ts,jsx,tsx}": "oxlint"
}
```

<span text-xs text-gray>因为快，常作 pre-commit "第一道快门"</span>

</div>

<style>
h1 {
  background-color: #5b21b6;
  background-image: linear-gradient(45deg, #7c3aed 10%, #4c1d95 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
怎么放进日常工作流？

[click] 编辑器：VS Code 装官方 Oxc 扩展，保存即时报告、一键修复，其它编辑器走内置 language server。

[click] CI 和 Git 钩子：配合 lint-staged 只查暂存文件。因为快，oxlint 特别适合做 pre-commit 的第一道快门，把慢的检查留到 CI。
-->

---
layout: intro
transition: fade-out
---

# 结尾与号召

让 lint 快到没有借口

- 零配置上手，存量项目也能秒接入
- 一个二进制覆盖大半 ESLint 生态
- 现在就 `pnpm add -D oxlint` 试试！

<div class="abs-br m-6 text-xl">
  <a href="https://oxc.rs/" target="_blank" class="slidev-icon-btn">
    <carbon:earth />
  </a>
  <a href="https://github.com/oxc-project/oxc" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/frontend-develop-tools/static-analysis/oxlint/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #5b21b6;
  background-image: linear-gradient(45deg, #7c3aed 10%, #4c1d95 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这就是 oxlint。

它零配置上手，存量项目也能秒接入；一个二进制覆盖大半 ESLint 生态；速度快到让你没有理由不做 lint。

现在就 pnpm add -D oxlint 试一试吧！文档、GitHub、笔记链接都在下面。
-->

---
layout: end
---
