---
theme: seriph
background: https://cover.sli.dev
title: Welcome to npm
info: |
  Presentation npm — the default package manager for Node.js.

  Learn more at [https://docs.npmjs.com](https://docs.npmjs.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📦</span>
</div>

<br/>

## npm — Node.js 的默认包管理器

声明、安装、锁定、发布依赖的事实基线。随 Node 分发、零安装即用，一词三义：CLI + 公共 registry + 包格式。2026 基线 npm 10/11

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/npm/cli" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 npm —— Node.js 的默认包管理器，也是整个 JS 生态的事实基线。它随每个 Node 一起分发，零安装就能用，是任何项目都能假定存在的最低公分母。

npm 一词三义：命令行工具、世界上最大的公共 registry、以及包的格式约定。核心职责是声明、安装、锁定、发布依赖。

2026 年的基线是 npm 10 到 11，随 Node 20 以上分发。pnpm、yarn、bun 在速度和磁盘上各有超越，但 npm 靠零安装即用稳坐基本盘。

顺序：什么是 npm → 三件事 → package.json → 四类依赖 → SemVer → lockfile → install vs ci → 扁平化与幽灵依赖 → scripts → npx → workspaces → overrides → 安全 → 发布 → Corepack 时效 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么需要 npm？

JS 项目离不开第三方代码：

<v-clicks>

- 依赖成百上千、还层层嵌套
- 版本要可控、安装要可复现
- 团队/CI 要装出一致结果

</v-clicks>

<div v-click class="mt-6">

npm 一套机制解决：

- `package.json` **声明**依赖范围
- `package-lock.json` **锁定**精确树
- `npm ci` **复现**干净安装

</div>

<!--
为什么需要 npm？现代 JS 项目离不开第三方代码：依赖动辄成百上千，还层层嵌套；你需要版本可控、安装可复现；团队和 CI 必须装出完全一致的结果，否则就是「在我机器上没问题」。

npm 用一套机制解决：package.json 声明你要哪些依赖、什么版本范围；package-lock.json 把范围解析成精确的依赖树锁定下来；npm ci 则按锁文件做冻结式的干净安装，保证处处一致。

这三件事——声明、锁定、复现——是理解 npm 的主线。
-->

---

# npm 一词三义

<v-clicks>

- **CLI 工具**：随 Node 装好的 `npm` 命令
- **公共 registry**：`registry.npmjs.org`，全球最大软件仓库
- **包格式**：含 `package.json` 的目录，发布为 `.tgz`

</v-clicks>

<div v-click class="mt-6">

```bash
node -v && npm -v   # npm 随 Node 一起就位
npm config get registry
# https://registry.npmjs.org/
```

</div>

<!--
npm 不是单一工具，而是三件事的合称。

第一，CLI 命令行工具：随 Node.js 一起装好的 npm 命令，负责安装、跑脚本、发布。第二，公共 registry：默认指向 registry.npmjs.org，世界上最大的开源软件仓库，绝大多数 JS 包都发在这里。第三，包格式约定：一个包就是含 package.json 的目录，发布时打成 tgz 上传。

下面这两行命令能验证：装好 Node 就有 npm，默认 registry 指向官方源。记住 npm 是事实基线，文档、CI 模板、教程几乎都以它为准。
-->

---
layout: two-cols-header
---

# 初始化与 package.json

::left::

**初始化**

```bash
npm init -y
```

用默认值生成，跳过交互式提问。

::right::

**最小 package.json**

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": { "dev": "vite" }
}
```

<div v-click class="mt-4">

> 发布到 registry 时，**`name` 与 `version` 必填**；不发布的应用也建议写。

</div>

<!--
开始一个项目用 npm init -y，用默认值一次性生成 package.json，跳过逐项提问。

package.json 是项目的元数据清单。右边是最小形态：name 和 version，type 设 module 让 .js 按 ES Module 解析，scripts 把常用命令固化成 npm run 入口。

划重点：如果你要把包发布到 registry，name 和 version 是必填字段——官方原文说它们是 package.json 里最重要的两项。name 须是 URL 安全的小写串，version 须符合语义化版本。即使是不发布的应用，也建议写上，方便用 npm version 自增。
-->

---

# 四类依赖：分清楚

| 字段 | 语义 | 下游是否传递 |
|---|---|---|
| `dependencies` | 运行时必需 | **是** |
| `devDependencies` | 仅开发/构建期 | 否 |
| `peerDependencies` | 与宿主共享 | 由使用方装 |
| `optionalDependencies` | 可选、失败不阻断 | 是 |

<div v-click class="mt-3 text-sm">

```bash
npm i axios       # → dependencies（默认 --save）
npm i -D vitest   # → devDependencies
```

</div>

<!--
npm 有四类依赖，分清楚才不踩坑。

dependencies 是运行时必需的生产依赖，会随下游安装传递；devDependencies 只在开发、测试、构建期需要，下游不会装，比如打包器、测试框架、类型定义；peerDependencies 表达「我要和宿主共享某个库」，由使用方提供，典型是插件对 React 的要求；optionalDependencies 是可选依赖，装失败也不阻断，常用于平台相关的原生包。

命令上，npm i 默认带 save，写进 dependencies；加 -D 写进 devDependencies。判断标准很简单：用户装了我的包，运行时还需要它吗——需要就是 dependencies。
-->

---

# 语义化版本范围

| 写法 | 等价范围 | 锁住 |
|---|---|---|
| `^1.2.3` | `>=1.2.3 <2.0.0` | 主版本（默认） |
| `~1.2.3` | `>=1.2.3 <1.3.0` | 次版本 |
| `1.2.3` | `=1.2.3` | 精确 |
| `^0.2.3` | `>=0.2.3 <0.3.0` | **0.x 更保守** |

<div v-click class="mt-3 text-sm">

> ⚠️ `^` 锁「最左非零位」：`^0.2.3` 把 minor 当 major 看，不跨 0.3.0。

</div>

<!--
版本号是 MAJOR.MINOR.PATCH：破坏性变更升主版本，向后兼容新功能升次版本，向后兼容修复升补丁。

范围符决定 npm 能自动升到哪。脱字符 ^ 锁主版本，是 npm 默认写入的，^1.2.3 等于大于等于 1.2.3 小于 2.0.0。波浪号 ~ 更保守，只放行补丁，~1.2.3 上界是 1.3.0。不带符号就是精确锁死。

一个反直觉但常考的点：^ 锁的是最左边的非零位。所以对 0.x 它更保守——^0.2.3 等于大于等于 0.2.3 小于 0.3.0，把次版本当主版本看。原因是 SemVer 把 0.x 视为不稳定阶段，随时可能破坏。这解释了为什么有些 0.x 依赖发了新版 npm 却不帮你升。
-->

---

# package-lock.json：可复现的关键

`^19.0.0` 是**范围**，不同时间装可能解析到不同版本 → lockfile 锁死精确结果：

```json
"node_modules/axios": {
  "version": "1.7.9",
  "resolved": "https://registry.npmjs.org/...",
  "integrity": "sha512-..."
}
```

<div v-click class="mt-3 text-sm">

> `version` 精确版本 · `resolved` 来源 · `integrity` 防篡改哈希。**必须提交**，`node_modules` 则忽略。

</div>

<!--
只有 package.json 不够。^19.0.0 是个范围，不同时间、不同人安装，可能解析到 19.0.0、19.1.2 等不同版本，这就是版本漂移、是「在我机器上没问题」的根源。

package-lock.json 锁定精确结果：每个包记录三样东西。version 是解析到的确切版本，不再是范围；resolved 是下载来源 URL；integrity 是 SRI 完整性哈希，安装时比对内容防篡改，是供应链安全的一道防线。

规则：package-lock.json 必须提交，它让团队、CI、部署装出完全一致的依赖树。node_modules 则永远不提交，因为它体积大、可由 package.json 加锁文件完整重建。
-->

---

# install vs ci

| 维度 | `npm install` | `npm ci` |
|---|---|---|
| 用途 | 开发 | **CI / 部署** |
| 改 lockfile | 会按需改 | **绝不写** |
| node_modules | 增量 | **先删再装** |
| 锁不一致 | 更新锁 | **直接报错** |

<div v-click class="mt-3 text-sm">

> 记法：**install 会改锁、ci 只读锁**。要稳定可复现就用 `npm ci`。

</div>

<!--
两条安装命令，用途不同。

npm install 是开发用的：会读写 package-lock.json，范围内可解析到新版本，灵活，但结果可能漂移。npm ci 是 CI 和部署用的：要求 lockfile 必须存在；开始前先删掉 node_modules 做干净安装；lockfile 与 package.json 不一致就直接报错，而不是悄悄更新；而且绝不写 lockfile，安装是冻结的。

一句话记法：install 会改锁，ci 只读锁。本地开发、加依赖用 install；CI 流水线、生产部署一律用 npm ci，这正是它为可复现而设计的理由。
-->

---

# 扁平化与幽灵依赖

npm 把依赖**提升到顶层**去重，副作用是「幽灵依赖」：

```js
// accepts 只是 express 的间接依赖，没写进 package.json
const accepts = require("accepts"); // 现在能跑，将来可能崩
```

<div v-click class="mt-2 text-sm">

> 提升路径一变（express 升级/不再依赖它），代码无预警崩溃。pnpm 用符号链接**杜绝**幽灵依赖。

</div>

<!--
npm 从 v3 起把依赖尽量提升到 node_modules 顶层去重，结构简单、兼容性好。但有个副作用叫幽灵依赖。

看这个例子：accepts 只是 express 的间接依赖，你没在自己的 package.json 里声明它，但因为它被提升到了顶层，你的代码 require accepts 居然也能跑通。

危险就在这里：哪天 express 升级不再依赖 accepts，或者它不再被提升，你这行代码就毫无预警地崩溃。

防御办法：只 import 你显式声明过的包；用 depcheck、knip 这类工具扫未声明依赖。对比之下，pnpm 用内容寻址加符号链接，顶层只暴露直接依赖，从结构上杜绝了幽灵依赖——这也是很多团队从 npm 迁到 pnpm 的原因之一。
-->

---

# scripts 与生命周期

```json
{
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "vite build",
    "postbuild": "echo done"
  }
}
```

<div v-click class="mt-3">

`npm run build` 自动按 **prebuild → build → postbuild** 执行。

</div>

<div v-click class="mt-2 text-sm">

> `node_modules/.bin` 自动入 `PATH`，故能直接写 `vite`；还注入 `npm_package_version` 等环境变量。

</div>

<!--
scripts 把常用命令固化成 npm run 入口。这里定义了 prebuild、build、postbuild。

运行 npm run build 时，npm 会自动按 prebuild、build、postbuild 的顺序执行——这是 pre/post 自动包裹约定，对任意脚本名都生效，比如 prestart、poststart、pretest、posttest。你只要按命名规则写，npm 就自动串起来。

两个细节：脚本运行时，node_modules/.bin 会被加进 PATH，所以你能直接写 vite、vitest，而不必写完整的 ./node_modules/.bin/vite。npm 还注入一批环境变量，比如 npm_package_version 是当前包版本、npm_lifecycle_event 是当前脚本名，脚本里可以读。
-->

---

# npx：免装即用

```bash
npx create-vite@latest my-app
npx eslint .
```

<v-clicks>

- 先找本地 `node_modules/.bin`
- 找不到再**临时拉取**到缓存执行
- 免全局安装，适合一次性命令

</v-clicks>

<div v-click class="mt-3 text-sm">

> 跑脚手架的首选方式：`npx create-vite@latest` 总是拉最新模板。

</div>

<!--
npx 让你免全局安装就能跑包的命令。比如 npx create-vite 拉最新脚手架，npx eslint 跑本地的 eslint。

它的解析顺序是：先找当前项目的 node_modules/.bin，本地有就用本地的；本地找不到，再把包临时拉取到缓存里执行，跑完不长期保留。

这特别适合一次性命令和脚手架。比如 npx create-vite at latest，每次都能拉到最新的模板，不用在全局装一堆很快过时的脚手架包。新版 npx 总是优先本地二进制，保证项目内版本一致。npm exec 是它的等价命令。
-->

---

# workspaces：原生 monorepo

```json
{
  "private": true,
  "workspaces": ["packages/*", "apps/*"]
}
```

<div v-click>

```bash
npm i                                # 一次装好整个 monorepo
npm run build -w @app/web            # 指定 workspace 跑脚本
npm run build --workspaces --if-present
```

</div>

<div v-click class="mt-2 text-sm">

> 子包被符号链接进顶层 node_modules，可直接互相 import。`--if-present` 让缺脚本的子包跳过。

</div>

<!--
npm 原生支持 monorepo。在根 package.json 声明 workspaces，给一组子包的 glob，再设 private true 防误发。

根目录跑一次 npm i，就装好整个 monorepo——每个子包会被符号链接进顶层 node_modules，子包之间可以直接 import，无需发布。

跑脚本用 -w 指定 workspace，比如 npm run build -w @app/web。加 --workspaces 是所有子包都跑一遍。--if-present 很关键：异构 monorepo 里不是每个包都有 build 脚本，加它能让缺脚本的子包被跳过而不是报错。

需要注意：复杂的任务编排，比如依赖图调度、增量缓存，workspaces 本身不做，要靠 Turborepo 或 Nx 在它之上补位。
-->

---

# overrides：钉死间接依赖

间接依赖有漏洞、父包还没修，强制替换：

```json
{
  "overrides": {
    "lodash": "4.17.21"
  }
}
```

<div v-click class="mt-3 text-sm">

> 官方约束：**只有根 package.json 的 overrides 生效**，依赖包里的会被忽略。典型场景：`npm audit fix` 修不掉的漏洞手动钉版本。

</div>

<!--
overrides 用来钉死依赖树里的某个版本。常见场景：某个间接依赖有安全漏洞或 bug，但它的直接父包还没发修复版，你又不想等。

写法很简单：在根 package.json 的 overrides 里，把 lodash 钉到安全版本，整棵树所有 lodash 都会用这个版本。还能用嵌套语法只覆盖某个父包下的子依赖，或者用美元符号引用根的直接依赖版本。

一个必须记住的官方约束：overrides 只有根 package.json 的生效，被你安装为依赖的那些包里写的 overrides 会被忽略。

最典型的用途：npm audit 报某个间接依赖有漏洞、npm audit fix 又修不掉时，手动 override 到安全版本。
-->

---

# 安全：audit 与生命周期脚本

```bash
npm audit              # 扫描依赖树漏洞
npm audit fix          # 修兼容补丁
npm audit fix --force  # ⚠️ 允许破坏性主版本升级
```

<div v-click class="mt-3 text-sm">

> `postinstall` 会**自动执行任意代码**，是供应链攻击高发点。CI 可设 `ignore-scripts=true` 或 `npm i --ignore-scripts` 防护。

</div>

<!--
两块安全要点。

第一是 npm audit。它把你的依赖树提交给 registry，换回已知漏洞报告，分 info、low、moderate、high、critical 五级。npm audit fix 自动安装兼容当前 semver 范围的补丁版本，不破坏现有约束。注意 audit fix --force 会允许超出范围、含主版本的破坏性升级来修漏洞，可能引入不兼容，用完必须回归测试。

第二是生命周期脚本的攻击面。postinstall 这类脚本会在安装依赖时自动执行任意代码，是近年供应链投毒的高发入口——恶意包借此窃取你的 token、环境变量。默认 npm 不沙箱脚本，它们以你的用户权限运行。防御：CI 里设 ignore-scripts true，或单次用 npm i --ignore-scripts，再配合人工审计关键依赖。
-->

---

# 发布与 dist-tag

```bash
npm version minor          # 升版本 + git commit + tag
npm publish                # 发布，latest 指向新版
npm publish --tag beta     # 只更新 beta，latest 不动
```

<div v-click class="mt-3 text-sm">

> `latest` 是特殊标签：`npm i pkg` 默认装它。预发布用 `--tag beta`，用户须 `npm i pkg@beta` 才拿到。CI 发布加 `--provenance` 附来源证明。

</div>

<!--
发布流程。npm version minor 把版本号按语义化递增，并自动创建 git commit 和打 tag。然后 npm publish 打包上传，默认会把 latest 标签指向这个新版本。

dist-tag 是指向版本的命名指针。latest 是特殊的那个：用户 npm i pkg 不带版本号时，默认就装 latest 所指的版本。

所以发预发布版要小心别污染 latest：用 npm publish --tag beta，只更新 beta 标签，latest 维持原稳定版，用户必须显式写 npm i pkg@beta 才会拿到预发布。

最后强调一个现代安全实践：在 CI 里发布时加 --provenance，给发布物附上可验证的来源证明，把包绑定到源码仓库、commit 和流水线，登记到透明日志，让使用方能验证这个包确实由该仓库构建，对抗依赖投毒。
-->

---

# Corepack：务必记准的时效

`packageManager` 字段配合 **Corepack** 锁定 PM 版本：

```json
{ "packageManager": "pnpm@9.0.0" }
```

<v-clicks>

- Corepack 由 Node 16.9 引入，**实验性**
- **2025-03 TSC 投票：停止随发行版分发**
- **Node 25+ 不再内置；Node 24 及前仍内置**
- Corepack 不消失 → `npm i -g corepack` 独立装

</v-clicks>

<!--
一个 2026 年务必记准的时效点：Corepack 与 Node 的关系。

package.json 的 packageManager 字段，比如 pnpm at 9.0.0，原本配合 Corepack 使用——Corepack 读这个字段，自动准备并调用指定版本的包管理器，让项目锁定 PM 版本开箱即用。

关键事实，以官方为准：Corepack 由 Node 16.9 引入，长期是实验性。Node.js 的 TSC 在 2025 年 3 月 19 号投票通过，停止随 Node 发行版分发 Corepack。结果是：Node 25 及以后不再内置 Corepack，Node 26 LTS 也不含；但 Node 24 及之前，包括它的 LTS，仍然内置，只是保持实验性。

Corepack 本身不会消失——它会作为可独立安装的包继续存在，用 npm i -g corepack 单独装。实务影响是：依赖 Node 自带 corepack 的 CI 脚本，升级到 Node 25 以上会失效，要显式安装。
-->

---

# npm 家族对比

| 维度 | **npm** | pnpm | yarn | bun |
|---|---|---|---|---|
| 随 Node 自带 | **是** | 否 | 否 | 否 |
| 幽灵依赖 | 有 | **无** | 有 | 有 |
| 速度/磁盘 | 一般 | **最优** | 较快 | **极快** |

<div v-click class="mt-3 text-sm">

> npm 守「零安装即用」的基线；pnpm 省盘杜绝幽灵依赖；bun 极速带运行时。性能敏感的大 monorepo 多迁 pnpm。

</div>

<!--
横向对比 npm 家族四个成员。

是否随 Node 自带：只有 npm 是，这是它最大的优势——零安装即用；pnpm、yarn、bun 都得单独装，bun 还自带运行时。幽灵依赖：npm 和 yarn 默认有，pnpm 用符号链接杜绝。速度和磁盘：pnpm 靠硬链接加内容寻址最优，bun 极快，npm 一般。

定位上：npm 不追求最快最省，它守住最低公分母——任何 Node 环境都能直接用，文档、CI 模板、教程默认以它为准。性能敏感、大型 monorepo 的团队多迁到 pnpm；但库作者发布、最小化依赖的工具、教学示例，仍偏好 npm 的零安装即用。选型看场景，不是越新越好。
-->

---
layout: intro
---

# 总结

npm = **声明 + 锁定 + 复现 + 发布**的依赖管理基线

- package.json 声明范围（^/~）→ lockfile 锁精确树 → node_modules
- 开发用 install、CI 用 **ci**；扁平化带来幽灵依赖
- workspaces 管 monorepo、overrides 钉版本、audit 查漏洞
- 2026：Corepack 自 **Node 25+ 移出发行版**，需独立安装

<!--
总结一下。

npm 是声明、锁定、复现、发布依赖的管理基线。主线是：package.json 用 ^、~ 范围声明依赖，package-lock.json 把范围解析成精确树锁定，node_modules 承载实际文件——开发用 npm install 会改锁，CI 和部署用 npm ci 只读锁、保证可复现。

要记住 npm 的扁平化提升带来幽灵依赖这个坑。工程能力上：workspaces 原生管 monorepo，overrides 在根包钉死间接依赖修漏洞，audit 扫描并修复已知漏洞，生命周期脚本是供应链攻击面要防护。

2026 年最该记准的时效点：Corepack 自 Node 25 起被移出发行版，Node 24 及之前仍内置，未来需要独立安装。

npm 不是最快最省的，但它是零安装即用、生态默认的基线，是每个 JS 开发者绕不开的起点。谢谢大家。
-->
