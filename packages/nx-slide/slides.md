---
theme: seriph
background: https://cover.sli.dev
title: Nx
info: |
  Presentation Nx for developers.

  基于 Nx（20/21.x）· 核于 2026-07
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Nx

**智能 monorepo 构建平台：Rust 任务运行器 + 计算缓存 + affected 增量 + 分布式 CI**

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Nx —— 一个技术无关的智能 monorepo 构建平台，底座是一个用 Rust 写的任务运行器。

它的目标只有一句话：把"从编辑器写下一行代码到 CI 变绿"这条链路上的重复劳动降到最低。做法是先分析仓库得到项目图，再按每次调用派生任务图，拓扑排序并行执行，叠加计算缓存与 affected 增量。
-->

---
transition: fade-out
---

# 什么是 Nx？

技术无关的构建平台，核心是一个 Rust 实现的任务运行器

<v-clicks>

- 分析仓库得到**项目图**，每次调用派生**任务图**，拓扑排序**并行执行**
- **计算缓存**：输入哈希命中即还原产物与终端输出
- **affected 增量**：只跑受本次改动影响的项目
- **渐进式采用**：Core（本地）→ Plugins → Nx Cloud（远程/分布式）→ Console

</v-clicks>

<div v-click text-xs>

_Read more about_ [_Mental Model_](https://nx.dev/concepts/mental-model)

</div>

<style>
h1 {
  background-color: #3B82F6;
  background-image: linear-gradient(45deg, #1D4ED8 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Nx 先扫描文件系统构建项目图（识别项目、推导依赖），再在你每次运行命令时派生任务图，按依赖顺序尽量并行地执行、缓存结果。

[click][click] 计算缓存让相同输入的任务不再重跑；affected 让大仓 CI 只处理真正受影响的项目。

[click] 关键在渐进式采用：只用 Nx Core 就能拿到任务编排 + 本地缓存，需要更多能力再逐层叠加插件、Nx Cloud 与编辑器集成。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 两层配置：nx.json 与 project.json

工作区级默认 + 项目级覆盖，任务来自"scripts + targets + 推断"三处合并

::left::

<div v-click>

**`nx.json`（工作区级）**

```json
{
  "plugins": ["@nx/eslint/plugin"],
  "targetDefaults": {
    "build": { "dependsOn": ["^build"], "cache": true }
  },
  "defaultBase": "main"
}
```

</div>

::right::

<div v-click>

**`project.json`（项目级）**

```json
{
  "name": "mylib",
  "targets": {
    "build": { "command": "tsc -p tsconfig.lib.json" }
  }
}
```

优先级：**插件推断 < `targetDefaults` < 项目级**

</div>

::bottom::

<div v-click text-xs text-right>

_查最终生效配置_：`nx show project mylib --web` · [_nx.json 参考_](https://nx.dev/reference/nx-json)

</div>

<style>
h1 {
  background-color: #3B82F6;
  background-image: linear-gradient(45deg, #1D4ED8 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 工作区级的 nx.json 注册插件、设定跨项目默认（targetDefaults）、defaultBase 等。

[click] 项目级用 project.json 或 package.json 的 nx 字段，二者等价。任务有三个来源——package.json 的 scripts、project.json 的 targets、插件推断，三者合并。

[click] 记住优先级：插件推断最低，targetDefaults 居中，项目级最高、最具体。想知道某 target 最终长什么样、每项来自哪，跑 nx show project --web。
-->

---
transition: fade-out
---

# 项目图 vs 任务图

项目图分析一次、增量缓存；任务图每次调用按需派生——二者不同构

<v-clicks>

- **项目图**：扫描源码 import、`package.json`/`project.json`、TS 路径推导，含外部依赖
- **任务图**：一次调用 = 一张图；`nx test lib` 只是单节点
- 即使 `app` 依赖 `lib`，**`test app` 不必依赖 `test lib`**——三个 test 可并行
- 但 `build` 通常配 `dependsOn: ["^build"]`，任务图才加"先构建依赖"的边

</v-clicks>

<div v-click text-xs>

_查看_：`nx graph`（项目图） · `nx run-many -t build --graph`（任务图）

</div>

<style>
h1 {
  background-color: #3B82F6;
  background-image: linear-gradient(45deg, #1D4ED8 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click][click] 项目图反映你仓库里的项目 + 外部依赖，多数依赖由 Nx 从 import、TS 配置自动推导，并做增量缓存——只重新分析你改过的文件。任务图则是每次运行命令时从项目图派生出来的。

[click] 二者的关键差异：即便 app 依赖 lib，"测试 app"并不依赖"测试 lib"，所以多个 test 任务可以并行。

[click] 只有当你给 build 配了 ^build，任务图里才会加上"先构建依赖"的边。
-->

---
transition: fade-out
---

# 任务编排：dependsOn 与 ^build

用任务图表达先后顺序，**只排序、不强制重跑**

<v-click>

```json
{
  "targetDefaults": {
    "build": { "dependsOn": ["^build"] },
    "test":  { "dependsOn": ["build"] }
  }
}
```

| 写法 | 含义 |
| --- | --- |
| `^build` | 先在**所有依赖项目**上跑 build |
| `build` | 先跑**本项目**的另一个 target |
| `{ projects, target, params }` | 对象语法：控制作用范围与参数转发 |

</v-click>

<div v-click text-xs text-right>

_产物已在位或可从缓存取回则直接跳过_ · [_Run Tasks_](https://nx.dev/features/run-tasks)

</div>

<style>
h1 {
  background-color: #3B82F6;
  background-image: linear-gradient(45deg, #1D4ED8 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 最常见的场景是"构建本项目前先构建它的依赖"，写在 targetDefaults 里对全仓生效。

^build（带尖号）= 先在所有依赖项目上跑 build；build（不带）= 先跑本项目的另一个 target，比如 test 依赖 build。对象语法可以把 projects 设为 dependencies/self/具体数组，并控制 params 是 forward 还是 ignore。

关键：dependsOn 只保证顺序，不等于重跑——依赖产物已在位就什么都不做，缓存里有就恢复。
-->

---
transition: fade-out
---

# 计算缓存：哈希命中即 replay

缓存单位是 task（一个 target 的一次调用），运行前先算哈希

<v-clicks>

- **computation hash** = 本项目及依赖的源文件 + 全局配置 + 外部依赖版本 + 运行时值 + CLI 参数
- **命中**：还原 `outputs` 产物 + 原样打印终端输出（快得多，体验无差别）
- **未命中**：真正执行，完成后把产物与输出存入本地（按需存远程）
- 开启：target 上 `"cache": true`，通常写在 `targetDefaults`

</v-clicks>

<div v-click text-xs>

_正确性第一原则：宁可多算，不可算错_ · [_Cache Task Results_](https://nx.dev/features/cache-task-results)

</div>

<style>
h1 {
  background-color: #3B82F6;
  background-image: linear-gradient(45deg, #1D4ED8 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 只要哈希相同，运行结果就一定相同——这是缓存正确性的基石。哈希由源文件、全局配置、外部依赖版本、运行时值和 CLI 参数共同决定。

[click][click] 命中时 Nx 把产物放回目录、原样打印终端输出，从用户视角看命令照常跑了，只是快得多；未命中才真正执行并存入缓存。

[click] 缓存正确性的第一原则：宁可多算、不可算错——不确定就把更多东西纳入 inputs，再逐步收窄提命中率。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# inputs / outputs / namedInputs

inputs 决定何时失效，outputs 决定缓存什么

::left::

<div v-click>

**inputs**（文件集 + 高级输入）

```json
{
  "inputs": [
    "{projectRoot}/**/*",
    "!{projectRoot}/**/*.spec.ts",
    { "externalDependencies": ["eslint"] },
    { "runtime": "node --version" }
  ]
}
```

`^` 前缀作用于依赖项目；`!` 排除

</div>

::right::

<div v-click>

**namedInputs**（约定 default / production / sharedGlobals）

```json
{
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": ["default", "!{projectRoot}/**/*.spec.ts"]
  }
}
```

**namedInputs 合并，inputs 替换**

</div>

::bottom::

<div v-click text-xs text-right>

_outputs 默认含 `dist`/`build`；漏声明 = 假命中_ · [_Inputs_](https://nx.dev/reference/inputs)

</div>

<style>
h1 {
  background-color: #3B82F6;
  background-image: linear-gradient(45deg, #1D4ED8 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] inputs 是一组文件集 + 运行时输入 + 环境变量，任一变化就让缓存失效。文件 glob 须以 projectRoot 或 workspaceRoot 开头；感叹号排除、尖号作用于依赖项目。高级输入还有 env、runtime、externalDependencies、dependentTasksOutputFiles。

[click] namedInputs 把常用输入集命名后当变量引用，默认三个约定：default、production、sharedGlobals。易错点——namedInputs 在 nx.json 与项目间是合并，而某 target 的 inputs 一旦在项目里定义就整体替换。

[click] outputs 多数无需手写，默认已含 dist、build 等；产物落在非默认目录却没声明，命中时不会被恢复，就是"假命中"。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 本地缓存 + 远程缓存（Nx Replay）

本地开箱即用，跨团队 / CI 共享交给 Nx Cloud

::left::

<div v-click>

### 本地缓存

- 默认目录 `.nx/cache`
- `maxCacheSize` 默认"磁盘 10%，≤10GB"
- 超 **7 天**未访问即清理
- 清空 `nx reset`；临时跳过 `--skip-nx-cache`

</div>

::right::

<div v-click>

### 远程缓存 = Nx Replay

- Nx Cloud 提供，`nx connect` 接入
- 存三样：**终端输出 + outputs 产物 + 输入哈希**
- 安全：**不可变 + 令牌读写权限 + 端到端加密**（SOC 1/2）
- 官方观测 CI 提速 **30–70%**

</div>

::bottom::

<div v-click text-xs text-right>

_禁用某 target 的缓存会连带禁用其分布式执行_ · [_Nx Cloud_](https://nx.dev/nx-cloud)

</div>

<style>
h1 {
  background-color: #3B82F6;
  background-image: linear-gradient(45deg, #1D4ED8 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Nx Core 自带本地计算缓存，落在 .nx/cache。容量默认是磁盘 10%、上限 10GB，超限按最近最少使用清理；无论容量，超 7 天未访问的条目都会被移除。nx reset 清空，--skip-nx-cache 临时跳过。

[click] 最大收益来自把缓存跨团队、跨 CI 共享——这就是 Nx Replay，由 Nx Cloud 提供。远程存三样：终端输出、outputs 产物、输入哈希（注意只存哈希不存原始输入）。安全模型面向银行政府设计：缓存不可变、令牌控制读写、端到端加密、SOC 1/2 认证。官方观测 CI 提速三到七成。
-->

---
transition: fade-out
---

# affected：只做必要的工作

按 Git 变更算出最小项目集，再等价于对它们 run-many

<v-click>

```bash
# 默认相对 defaultBase（通常 main）
nx affected -t lint test build

# CI 中显式指定比较范围
nx affected -t test --base=origin/main --head=HEAD
```

</v-click>

<v-clicks>

- 会分析**改动性质**：只改 `package.json` 里某依赖版本，就只重测真正相关的 app
- `--files=...` 可假设"这些文件变了"；`defaultBase` 在 `nx.json` 配置
- CI 关键组合：**affected + 远程缓存 + 分布式**三者叠加

</v-clicks>

<div v-click text-xs text-right>

[_Affected_](https://nx.dev/ci/features/affected)

</div>

<style>
h1 {
  background-color: #3B82F6;
  background-image: linear-gradient(45deg, #1D4ED8 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 仓库一大，"每次全量重测"就太慢。affected 通过代码变更分析得到"本次改动可能影响的最小项目集"，再对该集合执行 run-many。默认相对 defaultBase（通常 main），CI 里常显式给 --base/--head。

[click] 它不只看改了哪些文件，还看改动的性质：改了 lib，依赖它的 app 都受影响；只在 package.json 改了某依赖版本，就只重测真正相关的 app。

[click] 大仓压低 CI 时间的关键，是 affected（少排任务）+ 远程缓存（跳过未变）+ 分布式（多机并行）三者叠加。
-->

---
transition: fade-out
---

# 插件与任务推断（Project Crystal）

插件把"某工具怎么配 Nx"固化下来，供整个社区复用

<v-clicks>

- 插件四类能力：**推断任务 · 生成代码 · 维护依赖（migrations）· executor 增强**
- **Project Crystal（Nx 18+）**：读 `vite.config.ts`、`webpack.config.js` 等，自动推断 target 的命令/缓存/输入输出/依赖
- 注册在 `nx.json` 的 `plugins`；**同名 target 靠后的插件胜出**
- 推断看不见显式配置——排查一律 `nx show project <p> --web`
- 关闭推断：`useInferencePlugins: false`

</v-clicks>

<div v-click text-xs>

_Read more about_ [_Inferred Tasks_](https://nx.dev/concepts/inferred-tasks)

</div>

<style>
h1 {
  background-color: #3B82F6;
  background-image: linear-gradient(45deg, #1D4ED8 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 一个插件通常提供四类能力：依据工具配置推断任务、生成代码、升级时维护配置（migrations）、以及用 executor 增强工具（如 @nx/js:tsc 的 batch mode）。分官方 @nx/* 与社区两类。

[click] Project Crystal 是 Nx 18 起的任务推断：很多工具的配置文件已定义了"做什么"，Nx 复用它来推断"该怎么跑、怎么缓存"，手写配置骤降。

[click][click][click] 插件写在 plugins 数组，同名 target 靠后的胜出；推断的任务没有显式文件，排查一律 nx show project --web；想彻底关掉推断就设 useInferencePlugins false。
-->

---
transition: fade-out
---

# executor vs generator

插件里两种扩展点：一个负责"跑"，一个负责"改"

<v-click>

| 维度 | executor（执行器） | generator（生成器） |
| --- | --- | --- |
| 阶段 | **运行**任务（run） | **生成/修改**文件（write） |
| 目的 | 用命令行做不到的方式跑工具 | 脚手架、批量重构、保持同步 |
| 触发 | 运行 target 时（`nx build app`） | `nx g @nx/react:library mylib` |
| 例子 | `@nx/js:tsc`、`nx:run-commands` | `@nx/react:component` |

</v-click>

<v-click>

内置 executor：`nx:run-commands` · `nx:run-script` · `nx:noop`；另有 **sync generator**（`nx sync` 触发），让配置与项目图保持一致

</v-click>

<div v-click text-xs text-right>

[_Executors_](https://nx.dev/concepts/executors-and-configurations) · [_Generators_](https://nx.dev/features/generate-code)

</div>

<style>
h1 {
  background-color: #3B82F6;
  background-image: linear-gradient(45deg, #1D4ED8 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 一句话区分：executor 执行任务、generator 改文件，两者都来自插件。executor 在你运行某个 target 时被调用，用命令行做不到的高级方式跑工具；generator 是手动或组合调用，做脚手架、批量重构、保持配置同步。

[click] 内置通用 executor 有 run-commands（包裹任意命令）、run-script、noop。此外还有 sync generator——由 nx sync 或 target 的 syncGenerators 触发，让配置文件与项目图保持一致。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# integrated vs package-based

两种采用风格，区别在"让 Nx / 插件托管多少"

::left::

<div v-click>

### package-based（包为中心）

- 贴近手写 `package.json` + workspaces
- 工具自己配，Nx 主要给**编排 + 缓存**
- 按需逐步引入，改动最小
- 适合从 npm/yarn/pnpm workspaces 平滑迁入

</div>

::right::

<div v-click>

### integrated（集成式）

- 插件深度托管：**推断 + 生成 + 迁移**
- 配合 `index.ts` 公共 API + module boundaries
- 自动化程度最高
- 适合强约束、统一 DX 的大团队

</div>

::bottom::

<div v-click text-xs text-right>

_Project Crystal 让 package-based 也享受精确缓存，两者差距在缩小_

</div>

<style>
h1 {
  background-color: #3B82F6;
  background-image: linear-gradient(45deg, #1D4ED8 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] package-based 更接近你手写的 package.json + workspaces：工具由你自己配置，Nx 主要提供任务编排与缓存，按需逐步引入，改动最小，适合从 npm/yarn/pnpm workspaces 平滑迁入。

[click] integrated 让插件深度参与——推断任务、代码生成、nx migrate 自动升级，配合 index.ts 公共 API 与 module boundaries，自动化程度最高，适合追求统一 DX、强约束的大团队。

Project Crystal 的任务推断，让保留原生工具配置的 package-based 仓库也能享受精确缓存与任务依赖，缩小了两种风格的差距。
-->

---
transition: fade-out
---

# module boundaries：架构约束落地

代码分析 + 声明式约束，管住"谁能依赖谁"

<v-click>

```js
// eslint.config.mjs — @nx/enforce-module-boundaries
'@nx/enforce-module-boundaries': ['error', {
  depConstraints: [
    { sourceTag: 'scope:shared', onlyDependOnLibsWithTags: ['scope:shared'] },
    { sourceTag: 'type:feature', onlyDependOnLibsWithTags: ['type:ui', 'type:util'] }
  ]
}]
```

</v-click>

<v-clicks>

- 公共 API：每个项目用 `index.ts` 暴露；深引用内部文件 lint 报错
- 常用**双维度打 tag**：`scope:*` 管归属、`type:*` 管层次
- **无 tag 的项目不能依赖任何项目**（除非显式 `*`）

</v-clicks>

<div v-click text-xs text-right>

[_Enforce Module Boundaries_](https://nx.dev/features/enforce-module-boundaries)

</div>

<style>
h1 {
  background-color: #3B82F6;
  background-image: linear-gradient(45deg, #1D4ED8 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 项目一多、彼此随意依赖，仓库很快失控。Nx 用代码分析 + 声明式约束保证项目只能依赖别人的公共 API。第一步给项目打 tag，第二步在根 ESLint 里用 @nx/enforce-module-boundaries 的 depConstraints 写约束。

[click][click] 公共 API 指每个项目用 index.ts 暴露对外接口，别人深引用内部文件会在 lint 时报错。常见做法是双维度打 tag：scope 管归属、type 管层次。

[click] 一条重要规则：没有任何 tag 的项目不能依赖任何项目，除非显式用星号放开。
-->

---
transition: fade-out
---

# nx release：版本 / changelog / 发布

三段式，一条命令跑完，也可分段定制

<v-click>

```bash
nx release --dry-run                   # 发布难撤销，强烈建议先 dry-run
nx release --first-release --dry-run   # 首次无历史可比，加 --first-release
```

</v-click>

<v-clicks>

- 三段：**Versioning（定版）→ Changelog → Publishing（发到 registry）**
- `projectsRelationship`：`fixed`（锁步同版本）/ `independent`（各自发版）
- `version.conventionalCommits: true` 按 commit 类型自动定版
- **Nx 21 破坏性变更**：版本逻辑重写、`generatorOptions` 上提顶层；过渡期 `useLegacyVersioning: true`（v22 移除）

</v-clicks>

<div v-click text-xs text-right>

[_Manage Releases_](https://nx.dev/features/manage-releases)

</div>

<style>
h1 {
  background-color: #3B82F6;
  background-image: linear-gradient(45deg, #1D4ED8 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] nx release 把发布拆成三段：定版、生成 changelog、发布到 registry（npm / crates.io / Docker 等）。发布难以撤销，强烈建议先 --dry-run；首次没有历史可比，要加 --first-release。

[click][click][click] 配置写在 nx.json 的 release：projectsRelationship 决定锁步同版本还是各自独立发版；conventionalCommits 按 commit 类型自动定版。

[click] 注意 Nx 21 重写了版本逻辑，generatorOptions 上提到顶层、packageRoot 被 manifestRootsToUpdate 取代；nx migrate 会自动迁移，过渡期可临时开 useLegacyVersioning，但它将在 v22 移除。
-->

---
transition: fade-out
---

# nx migrate：自动升级不再痛苦

更新依赖 + 迁移配置 + 按插件脚本改源码，三步走

<v-click>

```bash
# 1. 更新 package.json 并生成 migrations.json（暂不改其它文件）
nx migrate latest

# 2. 执行代码/配置迁移（改动保持 unstaged，供 review）
nx migrate --run-migrations

# 3. 检查无误后清理 migrations.json 并提交
```

</v-click>

<v-clicks>

- `migrations.json` 可保留到旧分支都合并完，同事合并后跑同一批迁移
- `nx` 与所有 `@nx/*` 会被升到**同一版本**——保持同版本至关重要
- 新增插件用 `nx add <plugin>` 自动匹配版本，勿手改版本号

</v-clicks>

<div v-click text-xs text-right>

[_Automate Updating Dependencies_](https://nx.dev/features/automate-updating-dependencies)

</div>

<style>
h1 {
  background-color: #3B82F6;
  background-image: linear-gradient(45deg, #1D4ED8 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] nx migrate 让升级 Nx 和插件不再痛苦：它能更新 package.json、迁移配置文件、还能按插件提供的脚本改动源码以适配 breaking change。三步走——先 migrate latest 生成 migrations.json，检查后 --run-migrations 执行迁移（改动保持 unstaged 供你 review），最后清理提交。

[click][click][click] migrations.json 可保留到旧分支都合并完，让同事也能应用同一批迁移。运行时 nx 与所有 @nx/* 会被升到同一版本——保持同版本至关重要；加插件走 nx add 自动匹配版本，别手改版本号。
-->

---
transition: fade-out
---

# Nx Agents：分布式任务执行（DTE）

声明式把任务铺到多台机器，Nx Cloud 自动分派

<v-click>

```yaml
# CI 里加一行，收集随后的 Nx 命令并分发
- run: pnpm dlx nx-cloud start-ci-run --distribute-on="3 linux-medium-js"
- run: pnpm exec nx affected -t lint test build
```

</v-click>

<v-clicks>

- **声明式**：只报"几台 + 什么规格"，谁跑哪个任务由 Nx Cloud 决定
- **任务中心**（非机器中心）：按历史耗时 + 图依赖动态派发，某台挂了别台接手
- **以缓存为传输**：产物经 Nx Replay 跨机器搬运，每个任务只跑一次
- 组合拳：**affected（少排）+ Replay（跳过）+ Agents（多机并行）**

</v-clicks>

<div v-click text-xs text-right>

[_Distribute Task Execution_](https://nx.dev/ci/features/distribute-task-execution)

</div>

<style>
h1 {
  background-color: #3B82F6;
  background-image: linear-gradient(45deg, #1D4ED8 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] affected + 远程缓存能大幅加速 CI，但仓库继续变大仍会遇到瓶颈——这时把任务分布到多台机器。启用只需两步：连接 Nx Cloud，然后在 CI 里加一行 start-ci-run，声明用几台什么规格的 agent。

[click][click][click] 为什么高效：声明式——你只报几台 + 什么规格，具体哪个任务在哪台由 Nx Cloud 决定，代码演进无需改配置；任务中心而非机器中心，按历史耗时和图依赖动态派发，某台启动失败别台能接手；以远程缓存为传输机制，跨 agent 的产物无缝搬运，每个任务只跑一次。

[click] 组合拳：affected 少排、Replay 跳过、Agents 多机并行，这才是大仓低 CI 时间的关键。
-->

---
transition: fade-out
---

# Nx vs Turborepo

同为 monorepo 任务编排 + 缓存，定位与"体量"不同

<v-click>

| 维度 | Nx | Turborepo |
| --- | --- | --- |
| 核心 | Rust 任务运行器 + 项目图/任务图 | Rust 任务调度 + 任务依赖图 |
| 缓存 | 计算缓存 + Nx Replay 远程缓存 | 输入哈希缓存 + Remote Cache |
| 增量 | `nx affected` | `--affected` / `--filter` |
| 生态 | 插件 + 生成器 + migrate + release | 轻量，聚焦编排 + 缓存 |
| 分布式 | **Nx Agents（内建 DTE）** | 无（仅远程缓存共享） |

</v-click>

<v-click>

一句话：**Turborepo 轻、专注编排缓存；Nx 重、是端到端的构建平台**

</v-click>

<div v-click text-xs text-right>

[_Nx 官方文档_](https://nx.dev) · 详见各自笔记

</div>

<style>
h1 {
  background-color: #3B82F6;
  background-image: linear-gradient(45deg, #1D4ED8 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 两者同属 monorepo 任务编排 + 缓存这一赛道，核心都用 Rust。缓存上 Nx 是计算缓存 + Nx Replay，Turborepo 是输入哈希缓存 + Remote Cache；增量 Nx 用 affected，Turborepo 用 affected/filter。

[click] 最大区别在体量与生态：Nx 自带插件、生成器、migrate、release、内建分布式 Agents，是端到端的构建平台；Turborepo 更轻、聚焦编排与缓存，分布式只靠远程缓存共享。选型看团队——要全家桶和强约束选 Nx，要轻量少心智负担选 Turborepo。
-->

---
layout: center
transition: fade-out
---

# 小结：把重复劳动降到最低

<div class="text-left max-w-2xl mx-auto leading-relaxed">

- **项目图 → 任务图**：拓扑排序、尽量并行
- **计算缓存 + affected**：输入没变就 replay，改动无关就跳过
- **Project Crystal**：插件推断任务，手写配置骤降
- **Nx Cloud**：Nx Replay 远程缓存 + Nx Agents 分布式 CI
- **治理三件套**：module boundaries + nx release + nx migrate

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://nx.dev" target="_blank" class="slidev-icon-btn">
    <logos:nx />
  </a>
  <a href="https://github.com/nrwl/nx" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/engineering/monorepo/nx/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #3B82F6;
  background-image: linear-gradient(45deg, #1D4ED8 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Nx 的一切归结成一句：把"从编辑器写下一行代码到 CI 变绿"这条链路上的重复劳动降到最低。

项目图派生任务图并行执行，计算缓存 + affected 跳过无谓工作，Project Crystal 让配置自动化，Nx Cloud 把这一切扩展到整个团队与多机 CI，再用 module boundaries、release、migrate 管住规模化与升级。就到这里，谢谢大家！
-->
