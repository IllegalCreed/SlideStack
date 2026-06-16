---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Biome
info: |
  Presentation about Biome for developers.

  Learn more at [https://biomejs.dev/](https://biomejs.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Biome

用 Rust 写的一体化 Web 工具链：lint + format 二合一（基于 v2.5.0）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/biomejs/biome" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天聊 Biome —— 用 Rust 写的 Web 工具链，主打把 ESLint 和 Prettier 合二为一。
它到底是什么、怎么用、和老牌工具是什么关系？我们一起看看。
-->

---
transition: fade-out
---

# 什么是 Biome？

一个工具同时干 ESLint + Prettier 两件事

<v-clicks>

- 用 **Rust** 编写，lint + format **二合一**，外加整理 import 与代码助手
- 格式化与 **Prettier 约 97% 兼容**，迁移视觉差异极小
- 内置 **500+** lint 规则，来自 ESLint、typescript-eslint 等来源
- 单个 `@biomejs/biome`，零配置即可 `biome check` 跑起来

</v-clicks>

<div v-click="'+1'" text-xs mt-4>

_Read more about_ [_Biome_](https://biomejs.dev/)

</div>

<style>
h1 {
  background-color: #a855f7;
  background-image: linear-gradient(45deg, #a855f7 10%, #ec4899 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Biome 是一体化的 Web 工具链，用 Rust 写。

[click] 它最大的特点是一个工具同时做 lint 和 format，还顺带整理 import。

[click] 格式化和 Prettier 大约 97% 兼容，所以从 Prettier 切过来几乎看不出差别。

[click] 内置 500 多条 lint 规则，覆盖 ESLint、typescript-eslint 等来源。

[click] 一个包搞定，零配置就能跑 biome check。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与运行

锁版本安装，一把梭运行

::left::

<div v-click>

- **安装**（`-E` 锁精确版本）：

  ```bash
  npm i -D -E @biomejs/biome
  ```

</div>

<div v-click>

- **一把梭**（格式化 + lint + 整理 import）：

  ```bash
  npx @biomejs/biome check --write ./src
  ```

  <span text-xs text-gray>不加 `--write` 只报告、不改文件</span>

</div>

::right::

<div v-click>

- **仅格式化 / 仅检查**：

  ```bash
  biome format --write ./src
  biome lint --write ./src
  ```

</div>

<div v-click>

- **不安全修复**（可能改语义）：

  ```bash
  biome check --write --unsafe ./src
  ```

  <span text-xs text-gray>需人工复核</span>

</div>

<style>
h1 {
  background-color: #a855f7;
  background-image: linear-gradient(45deg, #a855f7 10%, #ec4899 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
上手很简单。

[click] 装一下，官方建议用 -E 锁精确版本，保证团队和 CI 结果一致。

[click] 日常最常用的是 biome check --write，一条命令做格式化、lint、整理 import；不加 --write 就只报告不改文件。

[click] 也可以只格式化或只检查。

[click] 想应用可能改变语义的修复，加 --unsafe，但要人工复核。
-->

---
layout: image-right
transition: fade-out
image: https://cover.sli.dev
---

# 配置 biome.json

`biome init` 生成，按需定制

<div v-click>

```json
{
  "formatter": {
    "indentStyle": "tab",
    "lineWidth": 80
  },
  "linter": {
    "rules": {
      "recommended": true,
      "suspicious": { "noDebugger": "error" }
    }
  }
}
```

</div>

<v-clicks>

- 顶层 `formatter` 放语言无关选项
- `javascript` / `json` / `css` 放语言专属选项
- 严重级：`off` / `info` / `warn` / `error`

</v-clicks>

<style>
h1 {
  background-color: #a855f7;
  background-image: linear-gradient(45deg, #a855f7 10%, #ec4899 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
要定制就用配置文件。

[click] biome init 生成 biome.json，长这样：formatter 调格式化，linter.rules 调规则。

[click] 顶层 formatter 放语言无关的选项；语言专属的放 javascript、json、css 等节点下；严重级比 ESLint 多了一个 info。注意 Biome 缩进默认是 tab。
-->

---
transition: fade-out
---

# lint 规则分组

500+ 规则按"意图"分成 8 组

<div v-click>

| 组              | 含义             | 组            | 含义           |
| --------------- | ---------------- | ------------- | -------------- |
| `correctness`   | 几乎确定是 bug   | `suspicious`  | 很可能有问题   |
| `complexity`    | 可简化的复杂代码 | `style`       | 一致地道的写法 |
| `accessibility` | 无障碍（a11y）   | `performance` | 运行时性能     |
| `security`      | 潜在安全隐患     | `nursery`     | 实验性规则     |

</div>

<div v-click text-xs mt-3>

_命名约定：`use*` 强制某写法，`no*` 禁止某写法。_ _Read more about_ [_rules_](https://biomejs.dev/linter/rules/)

</div>

<style>
h1 {
  background-color: #a855f7;
  background-image: linear-gradient(45deg, #a855f7 10%, #ec4899 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
500 多条规则按意图分成 8 组，可以按组开关。

[click] correctness 是几乎确定的 bug；suspicious、complexity、style、a11y、performance、security 各管一摊；nursery 是实验性的。

[click] 命名也有约定：use 开头是建议某种写法，no 开头是禁止某种写法，一眼能看出意图。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8 grid-rows-[100px_1fr_40px]!
---

# 从 ESLint / Prettier 迁移

一条命令把旧配置搬过来

::left::

<div v-click>

### ESLint

```bash
biome migrate eslint --write
```

<span text-xs text-gray>读 `.eslintrc` 与 flat config、`extends`、`.eslintignore`</span>

</div>

::right::

<div v-click>

### Prettier

```bash
biome migrate prettier --write
```

<span text-xs text-gray>读 `.prettierrc`，并自动启用 formatter / linter</span>

</div>

::bottom::

<div v-click text-xs text-right>

_注意默认值差异（如缩进默认 tab）。_ _Read more about_ [_migrate_](https://biomejs.dev/guides/migrate-eslint-prettier/)

</div>

<style>
h1 {
  background-color: #a855f7;
  background-image: linear-gradient(45deg, #a855f7 10%, #ec4899 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
从老牌工具迁移很省事。

[click] ESLint 这边：biome migrate eslint，自动读 .eslintrc 或 flat config、extends、ignore 文件，转成 biome.json。

[click] Prettier 这边：biome migrate prettier，读 .prettierrc 并自动启用格式化和 lint。

[click] 唯一要注意的是默认值差异，比如 Biome 缩进默认是 tab，迁移后留意行为变化。
-->

---
transition: fade-out
---

# v2 亮点：类型感知 lint

不依赖 tsc 的类型检查

<v-clicks>

- **首个不依赖 tsc 的类型感知 linter**，自研类型推断引擎，无需装 `typescript`
- 代表规则 `noFloatingPromises`——约覆盖 typescript-eslint 75% 场景，开销小得多
- **多文件分析**：文件扫描器支持跨文件规则（如 `noImportCycles`），按需开启
- **domains**：按框架分组规则（`react` / `test` / `next` / `solid`），依 `package.json` 自动启用

</v-clicks>

<div v-click="'+1'" text-xs mt-2>

_Read more about_ [_Biome v2_](https://biomejs.dev/blog/)

</div>

<style>
h1 {
  background-color: #a855f7;
  background-image: linear-gradient(45deg, #a855f7 10%, #ec4899 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Biome v2 最大的突破是类型感知 lint。

[click] 它是首个不依赖 TypeScript 编译器的类型感知 linter，自己实现了类型推断引擎，连 typescript 包都不用装。

[click] 代表规则是 noFloatingPromises，能覆盖 typescript-eslint 大约 75% 的场景，但性能开销小得多。

[click] 还引入了多文件分析，靠文件扫描器支持跨文件规则，比如检测循环依赖，而且是按需开启不拖慢速度。

[click] domains 按框架把规则分组，根据 package.json 自动判断该开哪些。
-->

---
transition: fade-out
---

# v2 亮点：Assist 与插件

不止 lint 和 format

<v-clicks>

- **Assist**：无诊断的代码操作——整理 import、`useSortedKeys`、`useSortedAttributes`
- 整理 import 归入 `assist.actions.source.organizeImports`（v1 是独立字段）
- **GritQL 插件**：用 `.grit` 文件写自定义规则，填补自定义规则的空白
- **CI**：`biome ci` 只读校验；`--reporter github` 出 PR 行内注解

</v-clicks>

<div v-click mt-3>

```bash
# CI：只读，不改文件，发现问题即失败
biome ci --reporter=github ./src
```

</div>

<style>
h1 {
  background-color: #a855f7;
  background-image: linear-gradient(45deg, #a855f7 10%, #ec4899 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
v2 还带来了 Assist 和插件。

[click] Assist 是"无诊断的代码操作"，它不报错，只做整理 import、排序对象键、排序 JSX 属性这类动作。

[click] 注意整理 import 在 v2 里归到了 assist 下面，v1 时是独立字段，迁移配置要留意。

[click] 插件用 GritQL 写，填补了 Biome 以前没有自定义规则机制的空白。

[click] CI 用只读的 biome ci，配合 --reporter github 还能在 PR 上直接显示问题位置。
-->

---
layout: intro
transition: fade-out
---

# 结尾与号召

一个工具，搞定 lint 与 format

- 零配置上手，`biome check` 一把梭
- 一个二进制替代 ESLint + Prettier，还快
- 现在就 `npm i -D -E @biomejs/biome` 试试！

<div class="abs-br m-6 text-xl">
  <a href="https://biomejs.dev/" target="_blank" class="slidev-icon-btn">
    <carbon:earth />
  </a>
  <a href="https://github.com/biomejs/biome" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/frontend-develop-tools/static-analysis/biome/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #a855f7;
  background-image: linear-gradient(45deg, #a855f7 10%, #ec4899 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这就是 Biome。

它零配置上手，biome check 一条命令搞定；一个二进制替代 ESLint 加 Prettier，而且更快。

现在就 npm i -D -E @biomejs/biome 试一试吧！官网、GitHub、笔记链接都在下面。
-->

---
layout: end
---
