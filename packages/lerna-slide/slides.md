---
theme: seriph
background: https://cover.sli.dev
title: Lerna
info: |
  Lerna：JS 生态最早、最知名的 monorepo 版本发布工具，如今由 Nx 团队维护。

  基于 Lerna（9.x，由 Nx 团队维护）· 核于 2026-07
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Lerna

**Monorepo 的「版本 / 发布」层：跨包按依赖跑命令（借 Nx），把包发布到 npm**

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #A855F7 10%, #6D28D9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
大家好，今天聊 Lerna —— JavaScript / TypeScript 生态里最早、最知名的 monorepo 管理工具，诞生于 Babel 项目。

它现在的定位可以一句话记住：Lerna 管版本和发布，底层执行借用 Nx。接下来我们从现状讲起。
-->

---
transition: fade-out
---

# 什么是 Lerna

JS/TS 生态最早的 monorepo 管理工具，诞生于 Babel

<v-clicks>

- **任务运行**：跨包按依赖拓扑序、并行、可缓存地跑 `build` / `test` / `lint`
- **版本与发布**：统一或独立升版本号、生成 CHANGELOG、打 tag、发布到 npm
- 曾支撑 React、Jest、Vue CLI 等海量开源仓库
- 只管理「已由包管理器 workspaces 组织好的多包仓库」，本身不装依赖

</v-clicks>

<div v-click text-xs>

_两件核心事：跨包跑命令、管版本发 npm_

</div>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #A855F7 10%, #6D28D9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 第一件事是任务运行：在一个仓库里管理多个 npm 包，按依赖关系拓扑排序、并行、可缓存地执行 build、test、lint 这类命令。

[click] 第二件事是版本与发布：统一或独立地给各包升版本号、生成 CHANGELOG、打 git tag，最后发布到 npm。

[click] 它曾经支撑 React、Jest、Vue CLI 等大量开源仓库。

[click] 关键前提：Lerna 只管理已经被包管理器 workspaces 组织好的多包仓库，它不是包管理器，也不做依赖安装。
-->

---
transition: fade-out
---

# 2026 现状：与 Nx 的关系（必读）

当前最容易踩坑的认知差

<v-clicks>

- **维护归属**：一度濒临无人维护，**2022 年由 Nx（Nrwl）接管 stewardship**
- **底层复用 Nx**：v6 起默认把任务调度交给 Nx runner，`useNx` 默认 `true`
- **职责分工**：Lerna 管**版本/发布 + 命令界面 + 包探测入口**，Nx 管**执行 / 并行 / 缓存 / 分布式**
- **硬证据**：`lerna` 运行时依赖直接含 `nx` 与 `@nx/devkit`；npm latest 约 **9.x**
- 记忆锚点：**「Lerna 管版本发布，Nx 管执行构建，Lerna 站在 Nx 肩上」**

</v-clicks>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #A855F7 10%, #6D28D9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Lerna 曾经濒临无人维护，2022 年由 Nx 背后的公司 Nrwl 接管，官方原话是 "Nx took over stewardship of Lerna in 2022"。

[click] 从 v6 起，Lerna 默认把任务调度交给 Nx 的 task runner，配置项 useNx 默认是 true。

[click] 职责分工要记牢：Lerna 负责版本、发布、命令界面和包探测入口；Nx 负责实际的执行、并行、缓存和分布式。

[click] 这不是宣传口号 —— lerna 包的运行时依赖里直接就有 nx 和 @nx/devkit。当前 npm latest 大约是 9.x。

[click] 一句话锚点：Lerna 站在 Nx 的肩上。
-->

---
transition: fade-out
---

# bootstrap 已成历史

Lerna 不再负责安装和链接依赖

<div v-click>

依赖安装与本地 symlink 交给**包管理器的 workspaces**：

| 旧命令（已移除） | 现在改用 |
| --- | --- |
| `lerna bootstrap` | `npm install`（或 `yarn` / `pnpm install`） |
| `lerna link` | 删掉 —— `install` 自动 symlink 本地包 |
| `lerna add <dep> --scope <pkg>` | `npm install <dep> -w <pkg>` |

</div>

<div v-click text-sm>

移除时间线：**v7.0.0（2023-06）默认移除 → v9.0.0（2025-09）彻底删除**；过渡兼容包 `@lerna/legacy-package-management` 仅 v7/v8 可用。

</div>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #A855F7 10%, #6D28D9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 现代 Lerna 不安装、不链接依赖，官方原话："lerna is not responsible for installing and linking your dependencies, your package manager is much better suited to that task."

bootstrap 换成 install，link 直接删掉（install 会自动 symlink），add 换成包管理器的 -w 语法。

[click] 时间线记牢：v7 默认移除、v9 彻底删除。过渡包 legacy-package-management 只在 v7、v8 能临时恢复旧命令，v9 起消失。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 初始化与 lerna.json

`lerna init` 一步得到配好 workspaces 的仓库

::left::

<div v-click>

**初始化**

```bash
npx lerna init --dryRun      # 先预览改动
npx lerna init               # 生成配置 + git
npx lerna init --independent # 独立版本模式
```

- `--exact`：内部依赖写精确版本（非 `^` 范围）

</div>

::right::

<div v-click>

**`lerna.json` 骨架**

```json
{
  "$schema": "node_modules/lerna/schemas/lerna-schema.json",
  "version": "0.0.0",
  "npmClient": "pnpm",
  "command": {
    "version": { "conventionalCommits": true }
  }
}
```

</div>

::bottom::

<div v-click text-xs>

`useWorkspaces` 已从 schema 移除 —— 现在默认自动识别 workspaces，别再写它。

</div>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #A855F7 10%, #6D28D9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 建议先跑 lerna init --dryRun 预览，满意再真正执行。init 之后就得到一个配好 npm workspaces 的 git 仓库。加 --independent 进独立版本模式。

[click] lerna.json 的核心字段：version（fixed 填语义版本串，independent 填字面量）、npmClient（声明包管理器，pnpm 会去读 pnpm-workspace.yaml）、command（各命令的专属选项）。

[click] 注意 useWorkspaces 已经废弃移除，现在默认自动识别，不要再写。
-->

---
transition: fade-out
---

# 跑任务：run 与 exec

走 Nx 调度，自动拓扑序 + 并行 + 缓存

<div v-click>

```bash
npx lerna run build                    # 含 build 脚本的包都跑
npx lerna run test --scope=header      # 按包名过滤
npx lerna run test --since=origin/main # 只跑受影响包（CI 提速）
npx lerna exec -- rm -rf node_modules  # 跑任意 shell 命令
```

</div>

<v-clicks>

- `run <script>`：跑各包已声明的 npm 脚本，不存在该脚本的包会被跳过
- `exec -- <cmd>`：跑任意命令，注入 `LERNA_PACKAGE_NAME` / `LERNA_ROOT_PATH`
- 默认并发 **3**（`--concurrency` 调）；`--stream` 交错输出、`--parallel` 长跑不排序

</v-clicks>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #A855F7 10%, #6D28D9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 两条跑任务的命令，共享同一套过滤 flag。run 跑各包 package.json 里声明的 npm 脚本；--scope 按包名过滤；--since 只跑相对某 git ref 受影响的包，是 CI 提速核心；exec 跑任意 shell 命令。

[click] run 会跳过不含该脚本的包；exec 会注入 LERNA_PACKAGE_NAME、LERNA_ROOT_PATH 等环境变量。

[click] 默认并发是 3，用 --concurrency 调。--stream 管输出形态（交错带前缀），--parallel 管调度策略（不排序、不限并发），适合 watch 长跑。
-->

---
transition: fade-out
---

# 任务流水线（nx.json）与 ^build

任务间依赖写在 `nx.json`，没有则 `npx lerna add-caching` 生成

<div v-click>

```json
{
  "targetDefaults": {
    "build": { "dependsOn": ["^build"] },
    "test":  { "dependsOn": ["build"] }
  }
}
```

</div>

<v-clicks>

- **`^` 前缀 = 本项目的依赖们**：`^build` 表示先构建所有上游依赖，再构建自己
- **无 `^` = 同一项目内**：`test` 依赖同一个包的 `build`
- 满足约束的前提下**尽量并行**，不必等全部包 build 完才开始 test

</v-clicks>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #A855F7 10%, #6D28D9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 任务之间的依赖关系写在 nx.json 的 targetDefaults 里，没有这个文件就用 lerna add-caching 生成。

[click] 最关键的语法是 ^ 前缀：带 ^ 表示「本项目的上游依赖们」，^build 就是先构建所有依赖再构建自己；不带 ^ 指同一个包内，test 依赖同包的 build。

调度器在满足这些约束的前提下会尽量并行，不必等所有包都 build 完才开始测试。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 缓存与分布式执行

「同样的代码不构建第二次」（借 Nx）

::left::

<div v-click>

### 计算缓存

- 输入未变 → 瞬时**重放**输出（终端日志 + 产物目录）

```json
"build": {
  "cache": true,
  "outputs": ["{projectRoot}/dist"]
}
```

- `nx reset` 清缓存；`--skip-nx-cache` 单次跳过

</div>

::right::

<div v-click>

### 规模化

- **远程缓存**：Nx Cloud（`npx nx connect`）团队 / CI 共享
- **`--since`**：只跑受影响包，优化**平均**耗时
- **DTE 分布式**：任务分派多台 agent，优化**最坏**耗时（需 Nx Cloud）
- 铁律：**只有无副作用、可缓存的任务**能被缓存 / 分布式

</div>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #A855F7 10%, #6D28D9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 本地计算缓存：只要任务的输入没变，就直接重放上次的输出（日志加产物文件），不再真正执行。启用需要 nx.json，在 targetDefaults 里打开 cache 并声明 outputs。nx reset 清缓存，--skip-nx-cache 单次跳过。

[click] 规模化两条线：远程缓存用 Nx Cloud 让团队和 CI 共享；--since 只跑受影响包、优化平均耗时；改了核心底层包导致几乎全量受影响的最坏情况，靠 DTE 分布式执行 —— 把单个任务按耗时分派到多台 agent。

铁律：只有同输入必同输出的无副作用任务才能缓存和分布式，打外部 API 的 E2E 不行。
-->

---
transition: fade-out
---

# fixed vs independent

`lerna.json` 的 `version` 一个字段决定版本策略

<div v-click>

| 维度 | Fixed / Locked（默认） | Independent |
| --- | --- | --- |
| `version` 字段 | 语义版本串 `"9.0.7"` | 字面量 `"independent"` |
| 版本策略 | 全仓统一升号 | 每包各自独立升号 |
| git tag | 单个全局 `v9.0.7` | 每包一个 `pkg@1.1.0` |
| 占位符 `%s` / `%v` | 生效 | 不替换（无全局版本） |
| 初始化 | 默认 | `lerna init --independent` |

</div>

<div v-click text-sm>

fixed 想让未变更的包也一起升号：`lerna version --force-publish`。

</div>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #A855F7 10%, #6D28D9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 就一个字段的区别：version 填语义版本串就是 fixed —— 全仓统一版本线，任一包变更全体升号，单个全局 tag；填字面量 "independent" 就是独立模式 —— 每包独立升号，每包一个 pkg@version 的 tag。

占位符 %s、%v 只在 fixed 生效，independent 没有全局版本概念不替换。

[click] fixed 模式想让未变更的包也一起升号发布，用 --force-publish 跳过 changed 检测。
-->

---
transition: fade-out
---

# lerna version：升版本（不发 npm）

五步工作流，只动 git 不碰 registry

<v-clicks>

- ① 识别自上次 tag 以来有变更的包
- ② 提示选新版本（或 `--conventional-commits` 自动推断）
- ③ 改 `package.json` 版本 + 内部依赖，跑 version 生命周期脚本
- ④ commit 改动并打 git tag
- ⑤ push commit 与 tag 到 remote

</v-clicks>

<div v-click>

```bash
npx lerna version --conventional-commits --yes
```

</div>

<div v-click text-xs>

常用 flag：`--changelog-preset`（默认 angular）· `--create-release github`（须配 conventional-commits）· `--force-publish` · `--allow-branch main`

</div>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #A855F7 10%, #6D28D9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] lerna version 的五步：识别变更包 → 提示或自动推断新版本 → 改 package.json 的版本和内部依赖并跑生命周期脚本 → commit 并打 tag → push。注意它只动 git，不发 npm。

[click] 最常用的一条：--conventional-commits 按提交信息自动定 bump 幅度并生成 CHANGELOG，加 --yes 跳过确认给 CI 用。

[click] 几个高频 flag：changelog-preset 默认 angular；create-release 建 GitHub/GitLab Release，必须配 conventional-commits；allow-branch 限定只在主分支运行是最佳实践。
-->

---
transition: fade-out
---

# lerna publish：三模式

v7+ 与 version 解耦；**Lerna 永远用 npm 发布**

<div v-click>

```bash
lerna publish              # 背后先 lerna version，再发
lerna publish from-git     # 发当前 commit 已打 tag 的那批版本
lerna publish from-package # 发 registry 里缺失的版本（补发 / 重试）
```

</div>

<v-clicks>

- **`from-git`**：不再升号，复用已打 tag 版本 —— 适合 version / publish 分两个 CI job
- **`from-package`**：只补 registry 缺失的版本 —— 发布中途失败后的补发利器
- **永远用 npm**：认证写 `.npmrc` / `publishConfig`，与 `npmClient` 无关；scoped 公开需 `access: "public"`

</v-clicks>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #A855F7 10%, #6D28D9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 版本和发布在 v7 之后解耦了。lerna publish 有三种模式：默认模式背后先调 lerna version 再发；from-git 发当前 commit 已经被打过 tag 的那批版本；from-package 发 registry 里还不存在的版本。

[click] from-git 不再升号，适合把 version 和 publish 拆成两个 CI job 的流水线；from-package 是发布中途失败后的补发利器，只补缺失的版本。

关键坑：Lerna 永远用 npm 发布，即便 npmClient 设成 pnpm，认证也得写到 .npmrc 或 publishConfig；scoped 包要发公开必须配 access: public。
-->

---
transition: fade-out
---

# canary 与内部依赖联动

预览版发布 + 同仓依赖自动同步

<v-clicks>

- **canary**：`lerna publish --canary` 按 commit 发预览版 `1.1.0-alpha.0+<sha>`；**不能与 `--build-metadata` 同用**
- **dist-tag**：`--dist-tag next` 发 beta / next，避免用户误升到不稳定版
- **内部依赖联动**：包 B 升版本，依赖 B 的包 A 的依赖范围被自动更新（`--exact` 决定精确 / `^` 范围）
- **pnpm `workspace:` 协议**：`lerna version` 保留 `workspace:` 前缀，别名依赖不会被误升号

</v-clicks>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #A855F7 10%, #6D28D9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] canary 按 commit 粒度发预览版，版本形如 1.1.0-alpha.0 加 commit sha，注意它不能和 --build-metadata 同用。

[click] dist-tag 默认是 latest，发 beta 或 next 用 --dist-tag 指定，避免用户误升到不稳定版本。

[click] 内部依赖会自动联动：同仓的包 B 升版本时，依赖 B 的包 A 里对 B 的依赖范围会被 Lerna 同步更新，--exact 决定写精确版本还是 ^ 范围。

[click] pnpm 工作区下，lerna version 会保留 workspace: 协议前缀，workspace 别名依赖不会被误升号。
-->

---
transition: fade-out
---

# 高频坑：schema 保留 ≠ 命令可用

升级 Lerna 后的经典困惑点

<v-clicks>

- **schema ≠ 命令**：`lerna.json` 仍留 `command.bootstrap` / `add` / `link` 节点，但命令 v9 已删 —— **能写配置 ≠ 能跑命令**
- **发布永远用 npm**：即便 `npmClient: pnpm`，认证仍走 `.npmrc`
- **`private: true` 默认不发**；`--include-private` 才发
- **pnpm 下别在 `lerna.json` 写 `packages`** —— 只认 `pnpm-workspace.yaml`
- **GitHub 网页 UI 打的 lightweight tag 不识别** —— 手动用 `git tag -a -m`

</v-clicks>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #A855F7 10%, #6D28D9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 最坑的一条：lerna.json 的 schema 仍然保留 command.bootstrap、add、link 这些节点，编辑器不报错，但对应命令 v9 已经删了 —— 配置里能写不代表命令能跑。

[click] 发布永远走 npm，前面强调过。

[click] private 包默认不发，要加 --include-private。

[click] pnpm 下包位置只写 pnpm-workspace.yaml，别在 lerna.json 再写 packages，pnpm 只认自己的文件。

[click] GitHub 网页 UI 打的是 lightweight tag，Lerna 不识别，手动打 tag 要用 git tag -a -m 打 annotated tag。
-->

---
transition: fade-out
---

# 选型：Lerna / Nx / Turborepo / Rush

记忆锚点 —— 「Lerna 管版本发布，Nx 管执行构建」

<div v-click>

| 维度 | **Lerna** | Nx | Turborepo | Rush |
| --- | --- | --- | --- | --- |
| 归属 | Nx 团队 | Nx | Vercel | Microsoft |
| 任务执行 | 借 Nx | 自身核心 | 自研 | 自研 |
| **版本 + 发布** | **一流** | `nx release` | 不管 · 配 Changesets | `rush publish` |
| 适用 | 库 monorepo 发布 | 构建全家桶 | 应用 · 快缓存 | 超大规模强治理 |

</div>

<div v-click text-sm>

Lerna 强在**成熟的发布流水线**；想要 Turborepo 的发布能力，通常另配 Changesets。

</div>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #A855F7 10%, #6D28D9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 四个工具横向对比：归属上 Lerna 和 Nx 都是 Nx 团队，Turborepo 是 Vercel，Rush 是微软。任务执行上 Lerna 借 Nx，其余自研。

最关键那一行是版本加发布：Lerna 是一流的，Nx 靠 nx release，Turborepo 根本不管、通常配 Changesets，Rush 有 rush publish。适用场景上 Lerna 主打需要成熟发布流水线的 JS/TS 库 monorepo。

[click] 一句话选型：Lerna 强在发布流水线，想给 Turborepo 补发布能力就配 Changesets。
-->

---
layout: center
transition: fade-out
---

# 总结

Lerna = 版本 / 发布层，站在 Nx 执行层的肩上

- **现状**：2022 起由 Nx 团队维护，`useNx` 默认 `true`，`bootstrap` v9 已删
- **依赖链接**：交给包管理器 workspaces，不再是 Lerna 的活
- **强项**：内部依赖联动 + conventional changelog + canary + fixed / independent
- **选型**：需要成熟**发布流水线**的 JS/TS 库 monorepo 首选

<div class="abs-br m-6 text-xl">
  <a href="https://lerna.js.org" target="_blank" class="slidev-icon-btn">
    <carbon:tree-view-alt />
  </a>
  <a href="https://github.com/lerna/lerna" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/engineering/monorepo/lerna/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #A855F7 10%, #6D28D9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
一句话收尾：Lerna 是版本发布层，站在 Nx 执行层的肩上。

现状记牢 2022 年起 Nx 团队维护、useNx 默认 true、bootstrap v9 删除；依赖链接交给包管理器 workspaces；Lerna 的强项是内部依赖联动、conventional changelog、canary、fixed 与 independent 双模式。

需要成熟发布流水线的 JS/TS 库 monorepo，Lerna 仍是首选。下面是官网、GitHub 和笔记链接。
-->
