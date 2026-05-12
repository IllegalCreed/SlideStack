---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Turborepo
info: |
  Presentation Turborepo for developers.

  Learn more at [https://turborepo.com/](https://turborepo.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:turborepo-icon class="text-8xl" />
</div>

<br/>

## Turborepo：让 monorepo 任务跑得飞快

基于依赖图的并行执行 + 输入哈希缓存（基于 v2.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天我们要聊 Turborepo——一个为 JavaScript / TypeScript monorepo 服务的任务编排和缓存系统。

它的核心卖点只有一句话：把同样的活只干一次，从此再也不重复构建。
-->

---
transition: fade-out
---

# 什么是 Turborepo？

为 monorepo 提供"任务编排 + 缓存"的工具，不替代包管理器

<v-click>

- 基于**任务依赖图**并行调度，把无依赖关系的活同时跑
- **输入哈希缓存**：源码、配置、env 没变就直接用上一次的产物
- **Remote Cache**：缓存可跨机器共享（Vercel 托管或自托管）
- 与 pnpm / npm / yarn / bun 解耦，仅依赖各自的 workspace 能力

</v-click>

<br>

<div v-click>

```bash
pnpm turbo run build       # 第一次：FULL CACHE MISS
pnpm turbo run build       # 第二次：FULL TURBO（毫秒级）
```

</div>

<div v-click text-xs>

_Read more about_ [_Why Turborepo?_](https://turborepo.com/docs)

</div>

<style>
h1 {
  background-color: #4C00FF;
  background-image: linear-gradient(45deg, #4C00FF 10%, #FF1E56 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Turborepo 的依赖图驱动让 lint、build、test 这种本来要排队的活，能在不同包之间并行。

[click] 它会对每个任务的"输入"算哈希——源码、配置、声明的 env 变量任一变化都会让缓存失效，反之直接复用。

[click] 缓存可以放到云端（Vercel Remote Cache）或自托管，团队成员、CI 之间共享。

[click] 它不安装依赖，需要包管理器自己的 workspace 能力配合。
-->

---
transition: fade-out
---

# 标准目录结构

Turborepo 期望一个干净的"两层"workspace 布局

<v-click>

```text
my-monorepo/
├── apps/
│   ├── web/                # Next.js 应用
│   └── api/                # NestJS 后端
├── packages/
│   ├── ui/                 # 组件库
│   └── utils/              # 工具库
├── package.json            # private + scripts + packageManager
├── pnpm-workspace.yaml
└── turbo.json              # 任务定义入口
```

</v-click>

<br>

<div v-click>

::: warning
不支持 `apps/**` / `packages/**` 这类**递归 glob**（包嵌套包）；分组可用并列单层 glob 如 `packages/group/*`。
:::

</div>

<div v-click="'+4'" text-xs>

_Read more about_ [_Structuring a repository_](https://turborepo.com/docs/crafting-your-repository/structuring-a-repository)

</div>

<style>
h1 {
  background-color: #4C00FF;
  background-image: linear-gradient(45deg, #4C00FF 10%, #FF1E56 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 标准布局：apps/ 放可独立部署的应用，packages/ 放可被复用的库。

[click] 不要尝试 packages/** 这种 recursive glob——会带来"包里又有包"的歧义，官方明确不支持。
真要分组，写两条 glob 就行：packages/* + packages/group/*。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 安装与第一个 turbo.json

从零起步，三步就能跑起来

::left::

<div v-click>

**新项目脚手架**

```bash
pnpm dlx create-turbo@latest
```

**已有 monorepo 加装**

```bash
pnpm add -Dw turbo
```

</div>

<br>

<div v-click>

**根 `package.json`**

```json
{
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev"
  }
}
```

</div>

::right::

<div v-click>

**`turbo.json`**

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_Configuring tasks_](https://turborepo.com/docs/crafting-your-repository/configuring-tasks)

</div>

<style>
h1 {
  background-color: #4C00FF;
  background-image: linear-gradient(45deg, #4C00FF 10%, #FF1E56 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 新项目直接 create-turbo，已有 monorepo 在根目录装 turbo 即可。

[click] 注意：根 package.json 不要直接拼任务，所有脚本都通过 turbo run xxx 委派出去。packageManager 字段在 v2 是必填的。

[click] turbo.json 用 v2 的 tasks 字段（v1 的 pipeline 在 v2 已改名）。$schema 用 turborepo.dev 而不是 .com。
-->

---
transition: fade-out
---

# dependsOn：任务图的核心语法

四种依赖写法，覆盖绝大多数场景

<v-click>

```json
{
  "tasks": {
    "build":  { "dependsOn": ["^build"] },
    "test":   { "dependsOn": ["build"] },
    "deploy": { "dependsOn": ["@acme/web#build"] },
    "lint":   { "dependsOn": [] }
  }
}
```

| 语法              | 含义                                                  |
| ----------------- | ----------------------------------------------------- |
| `^build`          | **上游依赖包**（dependencies 中的内部包）的 `build` 先跑 |
| `build`           | **同一包**的 `build` 先跑（同包内串接任务）           |
| `@acme/web#build` | 特定包的特定任务（仅可写在根 `turbo.json`）           |
| `[]`              | 无依赖，可与上游完全并行                              |

</v-click>

<br>

<div v-click text-xs text-right>

_Read more about_ [_Configuring tasks_](https://turborepo.com/docs/crafting-your-repository/configuring-tasks)

</div>

<style>
h1 {
  background-color: #4C00FF;
  background-image: linear-gradient(45deg, #4C00FF 10%, #FF1E56 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Turborepo 最高频也最容易混淆的语法。

[click] ^build（带尖号）是"上游依赖包"，build（不带）是"同包"。
@acme/web#build 是"特定包的特定任务"，但只能写在根 turbo.json。
[]（空数组）表示"不依赖任何东西"，可以和上游完全并行——常用于 lint、test 这类不需要构建产物的任务。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 缓存：Turborepo 的灵魂

输入哈希命中就跳过执行，仅回放日志

::left::

<div v-click>

### 哈希组成

**全局**：task 定义 / 根 lockfile / 根 `package.json` 的 `engines` / `globalDependencies` / `globalEnv` / 行为相关 flags

**包级**：包配置 / 受 `inputs` 控制的源码 / `env` 中声明的变量值 / 上游包的输出哈希

任一项变化即 MISS

</div>

::right::

<div v-click>

### 关键配置

```json
{
  "tasks": {
    "build": {
      "outputs": ["dist/**"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "env":    ["API_URL", "DATABASE_URL"]
    }
  }
}
```

**未声明 `outputs` ⇒ 不缓存任何产物**

只缓存日志，下次照样得重新跑。

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_Caching_](https://turborepo.com/docs/crafting-your-repository/caching)

</div>

<style>
h1 {
  background-color: #4C00FF;
  background-image: linear-gradient(45deg, #4C00FF 10%, #FF1E56 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 缓存命中是"全局哈希 + 包级哈希"两层匹配。任一项变化就 miss。
v2 起根 package.json 的 engines 也进入全局哈希——升级时容易忽略这点。

[click] outputs 必须声明，不然只缓存日志、不缓存文件。env 要把所有影响产物的变量声明上，否则会出现"缓存命中但产物用了旧的 env 值"这种灾难。
inputs 用 $TURBO_DEFAULT$ 表示"默认行为之上再追加"。
-->

---
transition: fade-out
---

# Strict 环境变量模式（v2 默认）

未声明的 env 在任务里**不可见**——v2 最容易踩坑的破坏性变更

<v-click>

```json
{
  "globalEnv": ["NODE_ENV"],
  "tasks": {
    "build": {
      "env":            ["API_URL", "VITE_*"],
      "passThroughEnv": ["GITHUB_TOKEN"]
    }
  }
}
```

| 字段             | 进入哈希？ | 任务运行时可见？ |
| ---------------- | --------- | ---------------- |
| `globalEnv`      | ✅ 所有任务 | ✅ 所有任务       |
| `env`            | ✅ 当前任务 | ✅ 当前任务       |
| `passThroughEnv` | ❌         | ✅ 当前任务       |

- 支持通配符前缀 `MY_API_*`；`NEXT_PUBLIC_*` / `VITE_*` 等框架前缀由 Framework Inference 自动包含

</v-click>

<br>

<div v-click text-xs text-right>

_Read more about_ [_Environment variables_](https://turborepo.com/docs/crafting-your-repository/using-environment-variables)

</div>

<style>
h1 {
  background-color: #4C00FF;
  background-image: linear-gradient(45deg, #4C00FF 10%, #FF1E56 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v2 把 Strict 设为默认。意思是：你没声明的 env 变量，任务里根本读不到。
从 v1 升级上来时最容易因此爆 CI。

[click] env 既进 hash 也能读；passThroughEnv 不进 hash 但能读，专门用来传 CI token 之类"不应该影响产物哈希"的东西。
通配符前缀和框架推断都支持，不用一条条手写 NEXT_PUBLIC_FOO/BAR/BAZ。
-->

---
transition: fade-out
---

# Filter：精确选包

按包名 / 目录 / 依赖图 / Git 范围，组合任意精细的执行子集

<v-click>

```bash
# 按包名
pnpm turbo run build --filter=@acme/web

# 按目录 glob
pnpm turbo run build --filter=./packages/utilities/*

# web 及所有 dependencies
pnpm turbo run build --filter=web...

# ui 及所有依赖 ui 的包（dependents）
pnpm turbo run build --filter=...ui

# 按 git 范围（基于变更的差异集）
pnpm turbo run build --filter=[HEAD^1]
pnpm turbo run build --filter=[main...my-feature]

# 否定模式
pnpm turbo run build --filter=!@acme/legacy
```

</v-click>

<br>

<div v-click text-xs text-right>

_Read more about_ [_Running tasks_](https://turborepo.com/docs/crafting-your-repository/running-tasks)

</div>

<style>
h1 {
  background-color: #4C00FF;
  background-image: linear-gradient(45deg, #4C00FF 10%, #FF1E56 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] --filter 是 Turborepo 表达力最强的 flag。包名、目录、依赖图（前向/后向）、Git 范围、否定都能写。

可以组合：`--filter=web... --filter=!@acme/legacy` 表示"web 及其依赖，但排除 legacy"。

v2 起 --filter 不再做"模糊推断"——名字写错直接报错，少了一些隐式 bug。
-->

---
transition: fade-out
---

# --affected：CI 必杀

一行命令，仅跑本次变更影响到的包

<v-click>

```bash
pnpm turbo run build test lint --affected
```

- 默认等价于 `--filter=...[main...HEAD]`，对比当前默认分支
- 自定义基准/HEAD：环境变量 `TURBO_SCM_BASE` / `TURBO_SCM_HEAD`
- 经验上比手写 `--filter=...[origin/main]` 在 shallow clone 场景更鲁棒

</v-click>

<br>

<div v-click>

::: tip 对比手写 filter
- 简洁：`--affected` vs `--filter=...[main...HEAD]`
- 自动包含 dependents（间接影响的包）
- 在没有完整 git 历史的 CI runner 上处理更友好
:::

</div>

<div v-click text-xs text-right>

_Read more about_ [_run reference_](https://turborepo.com/docs/reference/run)

</div>

<style>
h1 {
  background-color: #4C00FF;
  background-image: linear-gradient(45deg, #4C00FF 10%, #FF1E56 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 大型 monorepo 的 CI 神器。每次 push 不必跑全量，只跑变更影响到的包及其 dependents。

[click] vs 手写 filter：更短、自动包含 dependents、在 GitHub Actions 这种默认 shallow checkout 的环境里出错更少。
搭配 actions/checkout 的 fetch-depth: 0 才能正确判断基准。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# Remote Cache

让缓存跨机器共享：本地、同事、CI 互相复用

::left::

<div v-click>

### Vercel 托管（最快上手）

```bash
turbo login
turbo link
turbo run build
```

CI 里通过环境变量启用：

```yaml
env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

</div>

::right::

<div v-click>

### 自托管 + 签名

```bash
turbo login --manual
```

```json
{
  "remoteCache": { "signature": true }
}
```

需要 `TURBO_REMOTE_CACHE_SIGNATURE_KEY`（HMAC-SHA256）做密钥。

社区实现（**非官方**）：
- `ducktors/turborepo-remote-cache`
- `brunojppb/turbo-cache-server`

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_Remote Caching_](https://turborepo.com/docs/core-concepts/remote-caching)

</div>

<style>
h1 {
  background-color: #4C00FF;
  background-image: linear-gradient(45deg, #4C00FF 10%, #FF1E56 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vercel Remote Cache 是最快路径：login + link 两条命令完事。CI 里靠 TURBO_TOKEN + TURBO_TEAM 两个环境变量自动启用。

[click] 不想用 Vercel 也行。turbo login --manual 指向自建 API。开启 signature 后，每个缓存条目会带 HMAC 签名，防篡改。
注意：列出来的 ducktors / brunojppb 是社区实现，不是官方背书的——上生产前自己 review。
-->

---
transition: fade-out
---

# Package Configurations：包内差异化

包级 `turbo.json` 处理"绝大多数任务同根配置，但少数任务要不一样"

<v-click>

```json
// packages/web/turbo.json
{
  "extends": ["//"],
  "tasks": {
    "build": {
      "env": ["$TURBO_EXTENDS$", "NEXT_PUBLIC_FOO"]
    },
    "test": {
      "outputs": ["coverage/**"]
    }
  }
}
```

- 继承根：`extends` 数组必须以 `"//"` 起始
- 数组字段（`dependsOn` / `env` / `inputs` / `outputs` / `passThroughEnv` / `with`）默认**整体替换**
- 想"在根的基础上追加"，用 `$TURBO_EXTENDS$` 作**数组首元素**
- **不能**覆盖 `globalEnv` / `globalDependencies`
- **不能**使用 `pkg#task` 语法（那只能写在根）

</v-click>

<br>

<div v-click text-xs text-right>

_Read more about_ [_Package Configurations_](https://turborepo.com/docs/reference/package-configurations)

</div>

<style>
h1 {
  background-color: #4C00FF;
  background-image: linear-gradient(45deg, #4C00FF 10%, #FF1E56 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 把"全局共享 + 个别覆盖"分到两份配置里：根 turbo.json 写共性，包级 turbo.json 写差异。比在根里堆一堆 pkg#task 干净。

数组字段默认是"替换"不是"合并"，记得 $TURBO_EXTENDS$ 必须放数组首位。

包级 turbo.json 有两条硬限制：不能改 globalEnv / globalDependencies，也不能用 pkg#task。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# 部署：turbo prune

为单个 app 生成"部分 monorepo"，配合 Docker layer 缓存

::left::

<div v-click>

```bash
turbo prune @acme/web --docker
```

输出：

```text
out/
├── json/              # 仅 package.json
├── full/              # 完整源码
└── pnpm-lock.yaml     # 修剪过的 lockfile
```

</div>

::right::

<div v-click>

```dockerfile
FROM node:22 AS pruner
WORKDIR /app
COPY . .
RUN pnpm dlx turbo prune @acme/web --docker

FROM node:22 AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=@acme/web
```

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_prune reference_](https://turborepo.com/docs/reference/prune)

</div>

<style>
h1 {
  background-color: #4C00FF;
  background-image: linear-gradient(45deg, #4C00FF 10%, #FF1E56 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] turbo prune 把一个 app 需要的"子集"裁出来，给 Docker、Serverless 等"只要装这个 app"的场景用。

[click] --docker 会拆成 json/ 和 full/ 两个目录：先 COPY json/ 跑 install，再 COPY full/ 跑 build——install 这一层只在 package.json 变化时才失效，build 层会被频繁触发，layer 缓存效果拉满。
-->

---
transition: fade-out
---

# v1 → v2 升级要点

升级前最值得知道的几条破坏性变更

<v-click>

```bash
pnpm dlx @turbo/codemod migrate
# 或显式指定：pnpm dlx @turbo/codemod migrate 2.0.0
```

1. **`pipeline` 改名 `tasks`**：schema URL 为 `https://turborepo.dev/schema.json`
2. **Strict env 模式成为默认**：未声明的 env 任务读不到
3. **根 `package.json` 的 `engines` 字段进入哈希**
4. **`packageManager` 字段成为必填**
5. **`--ignore` 移除**：用 `--filter` 否定模式替代
6. **`--scope` 移除**（v1.2 起 deprecated）：用 `--filter`
7. **`--filter` 不再推断包命名空间**：写错直接报错
8. **`--only` 限制任务依赖图**，而非包依赖图

</v-click>

<br>

<div v-click text-xs text-right>

_Read more about_ [_Upgrading_](https://turborepo.com/docs/crafting-your-repository/upgrading)

</div>

<style>
h1 {
  background-color: #4C00FF;
  background-image: linear-gradient(45deg, #4C00FF 10%, #FF1E56 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 升级有 codemod，但跑完后还得手工 review 一遍。
不带版本参数时它会交互式问你目标版本，加 2.0.0 就直接迁。

[click] 八条变更里最坑的两条：Strict env 让 CI 上变量"莫名其妙不见了"；engines 进哈希意味着任何 Node 版本改动都会让全量缓存失效。
-->

---
layout: intro
transition: fade-out
---

# 总结

让重复劳动只发生一次

- **依赖图 + 输入哈希** ⇒ 自动并行、自动跳过
- **`--affected` + Remote Cache** ⇒ CI 时间从分钟级压到秒级
- **包级 `turbo.json` + `$TURBO_EXTENDS$`** ⇒ 配置层次清晰
- **`turbo prune --docker`** ⇒ 单 app 部署不背全 monorepo 负担

<div class="abs-br m-6 text-xl">
  <a href="https://turborepo.com" target="_blank" class="slidev-icon-btn">
    <logos:turborepo-icon />
  </a>
  <a href="https://github.com/vercel/turborepo" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/engineering/monorepo/turborepo/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #4C00FF;
  background-image: linear-gradient(45deg, #4C00FF 10%, #FF1E56 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Turborepo 的所有花活总结成一句：让重复劳动只发生一次。

把这套配齐之后，你的 monorepo 不论多大，build/test/lint 都会变得"近乎瞬时"。
-->

---
layout: end
---
