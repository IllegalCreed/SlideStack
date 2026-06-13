---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Yarn
info: |
  Presentation Yarn — a package manager that doubles down as project manager.

  Learn more at [https://yarnpkg.com](https://yarnpkg.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🧶</span>
</div>

<br/>

## Yarn — 既管依赖，也管项目

官方定位 a package manager that doubles down as project manager。现役主线 4.x（Berry），默认 Plug'n'Play 去 node_modules；Classic 1.x 已冻结仅安全补丁

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/yarnpkg/berry" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Yarn。官方一句话定位：a package manager that doubles down as project manager —— 一个把「项目管理」也一并做了的包管理器。它不仅装依赖，还把工作区、约束、补丁、版本工作流全纳进来。

最关键的认知有两条。第一，现役主线是 4.x，又叫 Berry 或 Modern，由全新代码库重写；老的 Classic 1.22 已经冻结，只收安全补丁，网上大量 yarn global、.yarnrc 的老教程到 4.x 都不适用。第二，Modern 默认启用 Plug'n'Play，根本不铺 node_modules，这是它和 npm、pnpm 最大的不同。

顺序：为什么重写 → 代际对比 → 安装与 Corepack → yarn.lock → PnP 原理 → 三种 linker → zero-installs → 协议 → workspaces → constraints → 迁移 → 对比 npm/pnpm → 踩坑 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么有 Berry（4.x）？

Classic 1.x 的历史包袱：

<v-clicks>

- node_modules 平铺 → 幽灵依赖、海量小文件
- 非安装命令多甩给 npm，体验不统一
- 扩展性弱，难做约束 / 插件

</v-clicks>

<div v-click class="mt-6">

Berry 一次重写解决：

- **PnP** 去 node_modules、严格解析
- **全命令自研** + 插件化
- 工程化：约束 / 补丁 / zero-installs

</div>

<!--
为什么要有 Berry？因为 Classic 1.x 背了不少历史包袱。

第一，它沿用 node_modules 平铺模型，提升带来幽灵依赖，几万个小文件也拖慢一切。第二，很多非安装命令其实是甩给 npm 的，体验不统一、不可控。第三，扩展性弱，想做约束、插件这类工程化能力很难。

Berry 用一次彻底重写来解决：用 Plug'n'Play 去掉 node_modules、做严格解析；所有命令自研、核心可插件化；并内建约束、补丁、零安装等一整套项目管理能力。这就是为什么 4.x 不是 1.x 的小升级，而是换了心智模型。
-->

---

# Classic vs Berry：心智不同

| 维度 | Classic 1.x | Berry 4.x |
|---|---|---|
| 状态 | **冻结**（仅安全补丁） | **现役主线** |
| 默认装法 | 平铺 node_modules | **PnP**（.pnp.cjs + zip） |
| 配置 | `.yarnrc`（INI） | **`.yarnrc.yml`**（YAML） |
| 命令 | `upgrade`/`global` | `up`/`dlx`（移除 global） |

<div v-click class="mt-3">

> 网上 `.yarnrc` 写 registry、`yarn global add` 多是 **Classic**，到 4.x 不适用。认准 yarnpkg.com。

</div>

<!--
Classic 和 Berry 的差别不在写法，而在心智模型，这张表是全场最该记住的对照。

状态上，Classic 已冻结只收安全补丁，Berry 是现役主线。默认装法上，Classic 平铺 node_modules，Berry 默认 PnP，用 .pnp.cjs 加 zip 缓存。配置上，Classic 是 INI 风格的 .yarnrc，Berry 是 YAML 的 .yarnrc.yml。命令上，upgrade 改名 up，global 被移除、一次性执行改用 dlx。

一个实用提醒：你在网上看到的 .yarnrc 里写 registry、yarn global add 这类，十有八九是 Classic 内容，到 4.x 不适用。文档认准 yarnpkg.com，那就是 Modern。
-->

---
layout: two-cols-header
---

# 安装：Corepack + packageManager

::left::

**启用与初始化**

```bash
corepack enable
yarn init -2
```

**锁定版本**

```bash
yarn set version 4.6.0
```

::right::

**package.json 自动写入**

```json
{
  "packageManager": "yarn@4.6.0"
}
```

> 任何人 clone 后跑 `yarn`，Corepack 自动用 4.6.0 —— 团队零版本漂移。

<!--
安装 Yarn 4 的推荐姿势是 Corepack。Corepack 是 Node 自带的包管理器版本管理器。

流程很短：先 corepack enable 开启；新项目用 yarn init -2 直接初始化成 Modern；要锁版本就 yarn set version 4.6.0。

它会在 package.json 写一行 packageManager: yarn@4.6.0。这一行是团队一致性的关键：任何人 clone 之后，只要开了 Corepack，在这个项目里跑 yarn 就会自动切到 4.6.0，不需要各自全局装特定版本，CI 也一样。这就消除了「我机器上是 Yarn 4、同事是 Yarn 1」的版本漂移。
-->

---

# yarn.lock：可重现的基石

```text
"lodash@npm:^4.17.0":
  version: 4.17.21
  resolution: "lodash@npm:4.17.21"
  checksum: 10c0/...
```

<v-clicks>

- 锁**精确版本 + 下载地址 + 校验值**（含传递依赖）
- 由 Yarn 自动维护，**别手改**，要提交进 Git
- CI 用 `yarn install --immutable`（对标 `npm ci`）

</v-clicks>

<!--
yarn.lock 是可重现安装的基石。它把 package.json 里的「范围」固化成「确定结果」。

看这个片段：对 lodash 的 ^4.17.0 范围，lock 记录了最终解析到的精确版本 4.17.21、下载来源 resolution、以及完整性校验值 checksum。注意它锁的是整棵依赖树，包含传递依赖，不只是直接依赖。

三条纪律：第一，它由 Yarn 自动维护，别手改，要变更走 yarn add、up、remove；第二，必须提交进版本库，保证团队和 CI 拿到完全相同的依赖树；第三，CI 安装用 yarn install --immutable，如果安装会改动 lock，就直接报错退出，这正是 Yarn 版的 npm ci。
-->

---

# 日常命令速记

```bash
yarn                  # = install，按 lock 还原依赖树
yarn add -D vitest    # 加依赖（-D 开发 / -P peer）
yarn up lodash        # 升级（Classic 的 upgrade）
yarn dlx create-vite  # 临时执行（对标 npx）
yarn why lodash       # 谁引入了它
yarn dedupe           # 合并范围重叠的重复依赖
```

<div v-click class="mt-2 text-sm">

> Modern 已**移除 `yarn global`**：一次性执行一律 `dlx`，用完即弃。

</div>

<!--
进 PnP 之前，先把日常命令过一遍，这些是天天用的。

裸 yarn 等于 install，按 lock 还原依赖树。yarn add 加依赖，-D 开发依赖、-P peer 依赖。yarn up 升级，是 Classic 里 upgrade 的新名字。yarn dlx 临时下载并执行一个包，对标 npx，常用来跑脚手架。yarn why 解释一个包为什么被装、被谁引入，排查依赖很有用。yarn dedupe 合并范围重叠、可以共用同一版本的重复依赖，缩小依赖图。

特别强调一句：Modern 已经移除了 yarn global，没有全局安装这个概念了，一切一次性执行都用 dlx，用完即弃、不污染项目。这是从 Classic 过来最容易愣住的一个变化。
-->

---

# Plug'n'Play 原理

```text
传统：require('x') → 沿 node_modules 逐级查找
PnP ：require('x') → 查 .pnp.cjs 映射 → 直达 .yarn/cache 的 zip
```

<v-clicks>

- 安装生成 **`.pnp.cjs`**：整棵依赖树的精确映射
- 包以 **zip** 存 `.yarn/cache`，不解压、不平铺
- 钩子劫持解析 → O(1) 定位，**省海量 I/O**
- 默认 `strict`：访问未声明包**立即报错** → 杜绝幽灵依赖

</v-clicks>

<!--
PnP 是 Yarn 4 的核心，理解它就理解了一切。

传统装法里，require 一个包要沿 node_modules 一级级往上找，文件量大、还可能命中没声明的包。PnP 换了模型：安装时生成一个 .pnp.cjs 文件，里面是整棵依赖树的精确映射——谁依赖谁、每个包在磁盘哪。包则以 zip 压缩包形式存在 .yarn/cache，不解压、不平铺。运行时 PnP 钩子劫持 require 和 import，按映射直接定位到 zip 内的路径。

收益有三：安装几乎只是写这个映射文件，省掉海量文件 I/O；解析是 O(1) 的确定查表；而且默认 strict 模式下，只允许访问显式声明的依赖，访问未声明的包会立即报错，从解析层根除了幽灵依赖。
-->

---

# 三种 nodeLinker（有退路）

| linker | 产物 | 何时用 |
|---|---|---|
| `pnp`（默认） | `.pnp.cjs` + zip | 新项目、要严格与速度 |
| `node-modules` | 传统目录 | 迁移期、RN/Expo |
| `pnpm` | 链接式目录 | 想要 pnpm 式隔离 |

```yaml
# .yarnrc.yml
nodeLinker: node-modules
```

<div v-click class="mt-2 text-sm">

> PnP 不香？一行切回 node_modules。能吃下适配成本就上 PnP。

</div>

<!--
PnP 虽好，但 Yarn 留了退路：nodeLinker 可以三选一。

pnp 是默认，产物是 .pnp.cjs 加 zip 缓存，最严格最快，适合新项目。node-modules 退回传统平铺目录，兼容性最好，适合迁移期、或者 React Native、Expo 这类还要求 node_modules 的场景。pnpm 则用符号或硬链接加全局内容寻址仓库，铺出一个链接式 node_modules，行为接近 pnpm。

切换只要在 .yarnrc.yml 写一行 nodeLinker: node-modules。所以策略很务实：新项目、能接受少量工具适配成本，就直接上 PnP；要快速接入大量历史依赖，先用 node-modules 稳住，再逐步评估。
-->

---

# Zero-Installs：缓存进 Git

<v-clicks>

- 把 **`.pnp.cjs` + `.yarn/cache`（zip）** 一起提交
- 映射各机一致 + 缓存带全部包 → 切分支**免 install**
- 对比提交 node_modules：cache 是「每包一个 zip」，diff 清爽

</v-clicks>

```text
.yarn/*
!.yarn/cache
!.yarn/releases
node_modules
```

<div v-click class="text-sm">

> ⚠️ 含**原生编译**的依赖仍需 `yarn install`。

</div>

<!--
PnP 还解锁了一个杀手锏：zero-installs，零安装。

做法是把 PnP 的映射文件 .pnp.cjs，和 .yarn/cache 里的 zip 缓存，都提交进 Git。因为映射在任何机器上内容一致，缓存又带了全部包文件，所以切分支或者 clone 之后，通常不用再跑 yarn install，开箱即跑。和提交 node_modules 比，后者是几万个小文件、diff 灾难，而 cache 是每个包一个 zip，diff 非常清爽。

gitignore 的写法是先忽略 .yarn 下全部，再用感叹号白名单放行 cache 和 releases，同时忽略 node_modules。

一个局限要记住：含原生编译的依赖，因为二进制不能直接从 zip 跑，仍然需要 yarn install。是否上 zero-installs，看团队对仓库体积和原生依赖的取舍。
-->

---

# 协议：patch / portal / link

```json
{
  "left-pad": "patch:left-pad@npm:1.3.0#./fix.patch",
  "@my/app": "link:./src",
  "plugin-foo": "portal:./pkgs/foo"
}
```

<v-clicks>

- **patch:** 给依赖打补丁（`yarn patch` → `patch-commit`）
- **portal:** 软链本地包，**解析其依赖与 peer**
- **link:** 软链纯目录，**不处理被链包依赖**

</v-clicks>

<!--
Yarn 的协议体系很强，挑三个最常用的讲。

patch 协议用来给依赖打补丁。流程是 yarn patch 把包解压到临时目录，你改完源码，再 yarn patch-commit 生成补丁文件，依赖里就会写成 patch 协议引用。它配合 resolutions 还能给深层传递依赖打补丁、强制全树使用，常用于抢修上游短期不发版的安全漏洞。比 patch-package 那种 postinstall 脚本层更内聚，还享受缓存和校验。

portal 和 link 都指向磁盘上的本地包，区别在依赖解析：portal 会解析被链接包自己的依赖、参与 peer，像一个真实安装的包；link 更轻，不处理被链接包的依赖，适合链一个无依赖的纯代码目录。记住：带依赖用 portal，纯目录用 link。
-->

---

# Workspaces：原生 monorepo

```json
{ "private": true, "workspaces": ["packages/*"] }
```

```bash
yarn workspaces foreach -A -pt run build   # 全工作区并行+拓扑序
yarn workspaces focus @org/app             # 只装该包依赖链
```

<div v-click class="mt-3">

跨工作区依赖用 **`workspace:` 协议**：

```json
{ "dependencies": { "@org/utils": "workspace:^" } }
```

</div>

<!--
Yarn 是最早提供原生 workspaces 的包管理器。声明很简单：根 package.json 写一个 workspaces 数组，支持 glob，比如 packages 星号。Yarn 会把这些目录识别为工作区，统一安装并相互链接。

两个高频命令：workspaces foreach 在所有工作区批量跑脚本，-A 是全部，-p 并行，-t 按拓扑序，保证先构建被依赖、再构建依赖方；workspaces focus 做聚焦安装，只装某个工作区的依赖链，CI 里只构建某个包、或者 Docker 分层构建时特别省。

跨工作区互相依赖，别写普通 semver，要用 workspace 协议，比如 workspace 加脱字符。开发时始终解析到本仓库的源码，发布时再自动替换成对应的版本范围。
-->

---

# Constraints：monorepo 的 ESLint

```js
// yarn.config.cjs（Yarn 4 用 JS，旧版是 Prolog）
const { defineConfig } = require('@yarnpkg/types');
module.exports = defineConfig({
  constraints: async ({ Yarn }) => {
    for (const d of Yarn.dependencies())
      for (const o of Yarn.dependencies({ ident: d.ident }))
        d.update(o.range);   // 同名依赖版本对齐
  },
});
```

<div v-click class="text-sm">

> `yarn constraints --fix` 自动改写 package.json。**声明期望状态**，非写流程。

</div>

<!--
Constraints 约束，可以理解成 monorepo 的 ESLint：声明式地强制全仓库满足某些规则。

要点是 Yarn 4 已经从早期的 Prolog 切换成 JavaScript：在项目根写 yarn.config.cjs，用 @yarnpkg/types 的 defineConfig 导出 constraints 方法，方法里拿到一个 Yarn API 对象，遍历工作区和依赖来声明规则。

这个例子做的是「所有工作区里同名依赖版本对齐」：遍历依赖，对每个 ident 找其它工作区的同名依赖，用 update 把它们对齐到同一版本。注意它是声明式的——你只描述期望状态「应当是什么」，不写 if else 流程控制。跑 yarn constraints 检查，yarn constraints --fix 自动改写各 package.json。还能强制 license、engines 等字段，或禁用某个包。
-->

---

# Classic → Berry 迁移

```bash
corepack enable
yarn set version berry      # 切到 Modern
# 旧 .yarnrc/.npmrc → .yarnrc.yml
yarn install                # 更新 lock，可保留 node_modules
```

<v-clicks>

- 命令：`upgrade`→`up`、`audit`→`npm audit`、移除 `global`
- 脚本：不再隐式跑 pre/post，需显式串联
- 切 PnP 后幽灵依赖报错 → `packageExtensions` 补声明

</v-clicks>

<!--
从 Classic 迁到 Berry，官方流程友好，关键是可以先保留 node_modules，PnP 之后再上。

步骤：corepack enable，yarn set version berry 切到 Modern，把旧的 .yarnrc 和 .npmrc 配置改写成 .yarnrc.yml，比如 registry 改成 npmRegistryServer、token 改成 npmAuthToken，然后 yarn install 更新 lock。迁移期建议先 nodeLinker: node-modules 稳住兼容。

几个必知变更：命令上 upgrade 改 up、audit 改 npm audit、global 被移除；脚本上不再隐式执行任意 pre、post 钩子，需要在脚本里显式串联，比如 start 改成 yarn prestart 加上原命令。等你真要切 PnP 时，最常见的就是历史第三方包的幽灵依赖集中报 Cannot find module，规范修法是用 packageExtensions 给那个包补上缺失的依赖声明，而不是绕过。
-->

---

# Yarn PnP vs npm vs pnpm

| 维度 | Yarn 4 PnP | pnpm | npm |
|---|---|---|---|
| node_modules | **无** | 链接式 | 平铺 |
| 幽灵依赖 | 严格杜绝 | 隔离杜绝 | 易出现 |
| 临时执行 | `dlx` | `dlx` | `npx` |
| 工程化 | 约束/补丁/零安装 | 较少 | 较少 |

<div v-click class="mt-2 text-sm">

> 2026：Yarn 主线 **4.x**；npm **11.x**（随 Node）；Node 稳定 **26.x**。

</div>

<!--
横向对比 Yarn 4、pnpm、npm。

node_modules 维度：Yarn PnP 没有，pnpm 是链接式的，npm 是平铺的。幽灵依赖维度：PnP 在解析层严格杜绝，pnpm 靠隔离杜绝，npm 因为提升最容易出现。临时执行：Yarn 和 pnpm 都叫 dlx，npm 是 npx。工程化能力：Yarn 把约束、补丁、零安装一整套都内建了，pnpm 和 npm 相对少一些。

选型上一句话：要极致严格加完整工程化加 monorepo，选 Yarn 4 PnP；要隔离省盘但仍要 node_modules 兼容性，选 pnpm；要最低门槛随大流，选 npm。

时效补一句，2026 年 6 月：Yarn 主线是 4.x，npm 已经到 11.x 随 Node 分发，Node 稳定版是 26.x。
-->

---

# 常见坑 & Tips

<v-clicks>

- 老教程多是 **Classic** → 认准 yarnpkg.com（4.x）
- PnP 下裸 `node x.js` 报错 → 用 **`yarn node`**
- 编辑器满屏红线 → `yarn dlx @yarnpkg/sdks vscode`
- 幽灵依赖报错 → `packageExtensions` 补声明，别乱关严格
- CI 安装 → `yarn install --immutable`（不是 `--force`）
- `yarn upgrade` 已改名 → `yarn up`

</v-clicks>

<!--
高频坑汇总，踩过的人都懂。

第一，网上老教程大多是 Classic，yarn global、.yarnrc 那套到 4.x 不适用，文档认准 yarnpkg.com。第二，PnP 下直接裸 node 跑脚本会报找不到模块，因为没 node_modules，要用 yarn node，它会先注入 PnP 钩子。第三，PnP 项目编辑器满屏红线，是 TS Server 不识别 PnP，跑 yarn dlx @yarnpkg/sdks vscode 生成 SDK 垫片就好，这是必做步骤。第四，幽灵依赖报错别图省事关掉 strict，用 packageExtensions 给那个包补声明才是正解。第五，CI 安装用 --immutable，不是 --force。第六，yarn upgrade 在 4.x 已经改名叫 yarn up。
-->

---
layout: intro
---

# 总结

Yarn = **包管理器 + 项目管理器，4.x 默认去 node_modules**

- 代际：Classic 1.x 冻结，**Berry 4.x** 现役、默认 **PnP**
- PnP：`.pnp.cjs` 映射 + zip 缓存，严格杜绝幽灵依赖
- 工程化：workspaces / 约束 / 补丁 / **zero-installs** / 插件
- 2026：Yarn **4.x**、npm **11.x**、Node **26.x**；Corepack 锁版本

<!--
总结一下。

Yarn 是一个把项目管理也做了的包管理器，4.x 最大的标志是默认去掉 node_modules。

代际上，Classic 1.x 已冻结，Berry 4.x 是现役主线，默认启用 PnP。PnP 用 .pnp.cjs 映射加 zip 缓存取代 node_modules，安装快、解析确定，并从根上严格杜绝幽灵依赖；不想用还能一行切回 node-modules。工程化能力是它真正的护城河：原生 workspaces、约束引擎、打补丁、zero-installs、插件，一整套。

2026 年现状：Yarn 主线 4.x，npm 已到 11.x，Node 稳定版 26.x，版本治理靠 Corepack 加 packageManager 字段锁定。一句话收口：Yarn 4 的价值不是装得快，而是这整套项目管理能力。谢谢大家。
-->
