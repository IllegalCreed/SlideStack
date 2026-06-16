---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Knip
info: |
  Presentation about Knip for developers.

  Learn more at [https://knip.dev/](https://knip.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Knip

清理 JavaScript / TypeScript 项目中未使用的文件、导出与依赖（基于 v6.17.1）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/webpro-nl/knip" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天聊 Knip —— 一个给 JS / TS 项目"做减法"的工具。
它专门帮你找出并删掉没用的文件、没用的导出、没用的 npm 依赖。
名字 Knip 在荷兰语里就是"剪一刀"的意思，正好对应它的定位。
-->

---
transition: fade-out
---

# 什么是 Knip？

一个从入口出发、做全项目可达性分析的"死代码 + 死依赖"清理器

<v-clicks>

- 找出三类垃圾：**未使用的文件** / **未使用的导出** / **未使用的依赖**
- 从 `entry` 入口出发，按真实框架与工具链构建模块图，结果**精准可执行**
- 一个工具替代 **depcheck + ts-prune + ts-unused-exports + unimported**
- **155+ 插件**自动识别框架配置（Vite / Vitest / ESLint / Next 等），开箱低误报

</v-clicks>

<div v-click="'+1'" text-xs mt-4>

_Read more about_ [_Knip overview_](https://knip.dev/overview/getting-started)

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Knip 是什么？一句话：给项目做体检，找出没人用的东西。

[click] 它找三类垃圾：没被引用的文件、没被 import 的导出、装了却没用的 npm 包。

[click] 它的做法是从入口文件出发，顺着 import 把整个模块图走一遍，没走到的就是死代码，所以结果很准、可直接动手删。

[click] 过去这些事要 depcheck、ts-prune 几个工具分别干，Knip 一个全包。

[click] 而且它有 150 多个插件，能读懂 Vite、ESLint 这些工具的配置文件，开箱误报就很低。
-->

---
transition: fade-out
---

# 为什么用 Knip？

分散的小工具 vs 协同分析的一体化

<v-clicks>

- **协同效应**：分析依赖会发现更多入口 → 进而暴露更多死导出/死文件，互相放大
- **覆盖更广**：细粒度入口 + 自定义解析 + 配置解析器 + Shell 脚本解析 + 编译器
- **非侵入**：不靠散落代码里的私有注释，改用标准 JSDoc/TSDoc 标记，易于随时移除
- **面向 monorepo**：跨 workspace 分析，这种放大效应在大仓库尤其明显

</v-clicks>

<div v-click="'+1'" text-xs mt-4>

_Read more about_ [_why use Knip_](https://knip.dev/explanations/why-use-knip)

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
为什么不直接用那几个小工具，非得用 Knip？

[click] 关键是协同：分析依赖时会顺带发现新的入口文件，新入口又会暴露更多死导出和死文件，几件事互相放大，单跑小工具拿不到这个增益。

[click] 它的覆盖手段也更全：细粒度入口、自定义模块解析、配置文件解析、连 shell 脚本和各种编译器都能处理。

[click] 它非侵入，不用在代码里塞私有注释，用的是标准 JSDoc 标记，哪天不想用了也好移除。

[click] 在 monorepo 里这种放大效应最明显，这也是它的主场。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与运行

Node ≥ 20.19，TypeScript 与 @types/node 为 peer 依赖

::left::

<div v-click>

- **一键初始化**（推荐）：

  ```bash
  npm init @knip/config
  ```

  <span text-xs text-gray>装好依赖并写出最简配置</span>

</div>

<div v-click>

- **手动安装**：

  ```bash
  pnpm add -D knip typescript @types/node
  ```

</div>

::right::

<div v-click>

- **运行**（加进 package.json 脚本）：

  ```bash
  pnpm knip
  ```

</div>

<div v-click>

- **免安装试跑**：

  ```bash
  npx knip
  ```

  <span text-xs text-gray>开箱即报告未用的文件 / 导出 / 依赖</span>

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
上手很简单，前提是 Node 20.19 以上，TS 和 @types/node 作为 peer 依赖装上。

[click] 最快是 npm init @knip/config，它会装依赖并生成最简配置。

[click] 也可以手动 pnpm add -D knip typescript @types/node。

[click] 把 knip 加进 package.json 脚本，pnpm knip 就能跑。

[click] 或者 npx knip 免安装直接试，开箱即报三类垃圾。
-->

---
layout: image-right
transition: fade-out
image: https://cover.sli.dev
---

# 配置 knip.json

多数项目零配置即可，需要时再加 `entry` + `project`

<div v-click>

```json
{
  "$schema": "https://unpkg.com/knip@6/schema.json",
  "entry": ["src/index.ts", "scripts/*.ts"],
  "project": ["src/**/*.ts"],
  "ignoreDependencies": ["@types/*"],
  "ignoreBinaries": ["docker"]
}
```

</div>

<v-clicks>

- `entry`：分析的**起点**（默认含 `index`、`main`、`bin` 等）
- `project`：纳入分析的**全部文件**范围
- 支持 `knip.json` / `.jsonc` / `knip.ts`（`KnipConfig` 类型）

</v-clicks>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
要定制就写配置，但多数项目靠插件自动识别，零配置就够。

[click] 配置长这样：$schema 拿编辑器补全，entry 是分析起点，project 是分析范围，再加点 ignore。

[click] entry 是从哪开始走模块图，默认就包含 index、main、bin 这些。

[click] project 是要把哪些文件纳进来一起看。

[click] 配置文件可以是 json、jsonc，也可以是 knip.ts，配 KnipConfig 类型享受类型提示。
-->

---
transition: fade-out
---

# 插件：低误报的关键

155+ 内置插件，按 `package.json` 的依赖**自动启用**

<v-clicks>

- **解析配置文件**：读 `.eslintrc`、`vitest.config.ts` 等，提取里面引用的依赖
- **补充入口**：如 Vitest 插件自动加 `**/*.{test,spec}.ts` 为入口
- **解析隐式依赖**：`"extends": ["airbnb"]` 也能识别出 `eslint-config-airbnb`
- 覆盖 Vite / Jest / Next / Storybook / Playwright / Angular / Webpack 等

</v-clicks>

<div v-click="'+1'" text-xs mt-4>

_缺失或不全的插件，正是误报的主要来源。_ [_plugins_](https://knip.dev/explanations/plugins)

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
插件是 Knip 低误报的核心。150 多个插件，按你 package.json 里装了什么自动启用，不用手配。

[click] 插件干三件事。第一，读工具的配置文件，比如 ESLint、Vitest 的配置，把里面引用到的依赖挖出来。

[click] 第二，自动补入口，比如 Vitest 插件会把测试文件加成入口，省得你手写。

[click] 第三，识别隐式依赖，像 ESLint extends 里写的 airbnb，并不是 import，但插件能认出对应的包。

[click] 主流框架基本都覆盖了。

[click] 反过来，如果某个工具没插件或插件不全，那就是误报的主要来源。
-->

---
transition: fade-out
---

# 问题类型（issue types）

报告分门别类，🔧 可被 `--fix` 自动修复，另有 `enumMembers` / `nsExports` 等细类

<div v-click>

| 类型              | 含义                       | 修复 |
| ----------------- | -------------------------- | ---- |
| `files`           | 找不到对该文件的引用       | 🔧   |
| `dependencies`    | 装了却没被引用的依赖       | 🔧   |
| `unlisted`        | 用了但没写进 package.json  | 手动 |
| `binaries`        | 用了但未声明的可执行命令   | 手动 |
| `unresolved`      | 无法解析的 import 路径     | 手动 |
| `exports`/`types` | 找不到对该导出/类型的引用  | 🔧   |
| `duplicates`      | 同一处被导出多次           | 手动 |

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Knip 的报告是分类的，理解这些类型很重要。

[click] files 是没被引用的文件；dependencies 是装了没用的包；unlisted 反过来，用了但没写进 package.json；binaries 是脚本里调了却没声明的命令；unresolved 是解析不了的 import；exports 和 types 是没被引用的导出和类型；duplicates 是重复导出。带扳手的能自动修，其余像 unlisted、duplicates 要手动处理。

[click] 还有枚举成员、命名空间导出等更细的类型，按需开启。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 自动修复 --fix

删未用导出关键字、删 package.json 依赖、删未用文件

::left::

<div v-click>

```bash
# 应用可自动修复的问题
knip --fix

# 允许删除未使用的文件
knip --fix --allow-remove-files

# 修复后用本地格式化器整理
knip --fix --format
```

</div>

::right::

<div v-click>

- 可修：删 `export` 关键字、删依赖、删文件、清 catalog
- `--fix-type` 限定范围：`files,dependencies,exports,types,catalog`
- **不可自动修**：补 `unlisted` 依赖、`duplicates`
- 善后：跑 `install` + ESLint 清未用变量，并用 Git 复核

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
找到垃圾后，Knip 还能自动帮你删。

[click] knip --fix 应用所有可自动修复的问题；删文件有风险，要显式加 --allow-remove-files；改完可以加 --format 用本地的 Prettier/Biome 整理一下。

[click] 它能删 export 关键字、删 package.json 依赖、删文件、清 catalog。--fix-type 可以只修某几类。但补"用了没声明"的依赖、解决重复导出这种它不替你做。改完记得装一下依赖、用 ESLint 清掉残留的未用变量，并用 Git diff 复核。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8 grid-rows-[100px_1fr_40px]!
---

# Monorepo 与处理误报

跨 workspace 分析 + 把误报当作"配置缺口"

::left::

<div v-click>

### Monorepo

```json
{
  "workspaces": {
    ".": { "entry": "scripts/*.ts" },
    "packages/*": { "entry": "src/index.ts" }
  }
}
```

<span text-xs text-gray>自动识别 pnpm-workspace.yaml / workspaces</span>

</div>

::right::

<div v-click>

### 处理误报

- 优先用 `entry` 教会 Knip 项目结构
- 末选 `ignore*`：`ignoreDependencies` / `ignoreBinaries`
- `@public` / `@internal` 标记导出，配 `tags`
- 自上而下排查：文件 → import → 导出 → 依赖

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_handling issues_](https://knip.dev/guides/handling-issues)

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
两件进阶的事：monorepo 和误报。

[click] monorepo 上，Knip 自动识别 pnpm-workspace.yaml 或 package.json 的 workspaces，每个 workspace 在 workspaces 字段下单独配 entry/project，根目录用 "." 这个 key。

[click] 处理误报的心法是：surprising result 多半是真问题或配置缺口，不是要消音的误报。优先用 entry 把项目结构教给 Knip；实在不行才用 ignore；想保留的公共 API 用 @public 标记配 tags。排查顺序自上而下：先文件、再 import、再导出、最后依赖，避免连锁误报。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 报告器与 CI

8 种 reporter，天生适合做 CI 质量门禁

::left::

<div v-click>

### Reporters

```bash
knip --reporter compact
knip --reporter github-actions
knip --reporter json \
     --reporter markdown
```

<span text-xs text-gray>symbols(默认)/compact/json/markdown/disclosure/codeowners/codeclimate/github-actions</span>

</div>

::right::

<div v-click>

### CI / 聚焦

```bash
# 只看生产代码（排除 devDeps）
knip --production

# 只查依赖类问题
knip --dependencies
```

<span text-xs text-gray>有问题即非零退出，挡住回归</span>

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
最后是输出和 CI。

[click] Knip 有 8 种报告器：默认 symbols，还有 compact、json、markdown、disclosure、codeowners、codeclimate、github-actions。--reporter 选一个，重复传可以同时出多种，比如同时出 json 和 markdown。github-actions 能在 PR 上行内标注。

[click] CI 里常用 --production 只看生产代码、排除 devDependencies；也可以用 --dependencies 这类快捷标志只聚焦某类问题。发现问题就非零退出，正好挡住死代码和死依赖的回归。
-->

---
layout: intro
transition: fade-out
---

# 结尾与号召

让项目越用越轻，而不是越堆越沉

- 一个工具搞定死文件、死导出、死依赖
- 插件自动识别框架，开箱低误报
- 现在就 `npx knip` 给项目做一次体检！

<div class="abs-br m-6 text-xl">
  <a href="https://knip.dev/" target="_blank" class="slidev-icon-btn">
    <carbon:earth />
  </a>
  <a href="https://github.com/webpro-nl/knip" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/frontend-develop-tools/static-analysis/knip/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这就是 Knip。

一个工具搞定死文件、死导出、死依赖；插件自动识别框架，开箱误报就很低；让项目越用越轻。

现在就 npx knip，给你的项目做一次体检吧！文档、GitHub、笔记链接都在下面。
-->

---
layout: end
---
