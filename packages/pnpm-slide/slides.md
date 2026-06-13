---
theme: seriph
background: https://cover.sli.dev
title: Welcome to pnpm
info: |
  Presentation pnpm — fast, disk space efficient package manager.

  Learn more at [https://pnpm.io](https://pnpm.io)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📦</span>
</div>

<br/>

## pnpm — 快、省盘的包管理器

内容寻址 store + 硬链接省盘，符号链接式 node_modules 防幽灵依赖，为 monorepo 而生。2026 年主线 11.x，安全默认拦截构建脚本

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/pnpm/pnpm" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 pnpm。官方标语一句话：Fast, disk space efficient package manager —— 快、省盘的包管理器。

它和 npm、Yarn 一样装包、跑脚本、管 monorepo，但底层有两套独特机制：第一，内容寻址 store 加硬链接，跨项目复用同一份文件，极致省盘；第二，符号链接式的非扁平 node_modules，顶层只放直接依赖，从结构上防住幽灵依赖。

2026 年现状：pnpm 主线在 11.x，沿用并强化了 v10 的安全默认 —— 默认拦截依赖的构建脚本，防恶意 postinstall。同期 npm 也到了 11.x。

今天的顺序：为什么需要 → store 与硬链接 → node_modules 结构 → 幽灵依赖 → 安装与命令 → 锁文件与 CI → dlx → monorepo → filter → catalog → 依赖治理 → 安全默认 → patch → deploy 与 Docker → 对比 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么需要 pnpm？

npm/Yarn Classic 的两个老问题：

<v-clicks>

- 每个项目各拷一份依赖 → **磁盘爆炸**
- 扁平 node_modules → **幽灵依赖**（用了没声明的包）

</v-clicks>

<div v-click class="mt-6">

pnpm 的两把钥匙：

- 全局 **store + 硬链接** → 只存一份、跨项目复用
- **符号链接非扁平** → 顶层只暴露直接依赖

</div>

<!--
为什么需要 pnpm？因为 npm 和 Yarn Classic 有两个老问题。

第一，磁盘爆炸。它们的模型是每个项目各拷一份依赖，一百个项目用同一个库，磁盘上就有一百份拷贝，node_modules 黑洞名副其实。

第二，幽灵依赖。它们的 node_modules 是扁平的，大量传递依赖被提升到顶层，于是你能 import 一个根本没写进 package.json 的包，代码看似能跑，哪天那个传递依赖换了版本或不再被提升，就毫无征兆地崩。

pnpm 用两把钥匙解决：第一，全局内容寻址 store 加硬链接，文件只存一份，各项目复用，省盘又省时。第二，符号链接式的非扁平布局，顶层只放你声明的直接依赖，未声明的访问不到。这两点就是 pnpm 的立身之本。
-->

---

# 内容寻址 store + 硬链接

```text
全局 store（按内容哈希，只存一份）
   ▲ 硬链接              ▲ 硬链接
项目 A/node_modules   项目 B/node_modules
```

<v-clicks>

- 文件存一份，各项目**硬链接**复用 → 不占额外空间
- 更新只增量写**改动的文件**，不整包重拷
- 命中 store 时安装≈建链接，**不复制、不重下**

</v-clicks>

<div v-click class="mt-3 text-sm">

> `pnpm store path` 看位置 ｜ `pnpm store prune` 清孤儿包

</div>

<!--
先看省盘的核心：内容寻址 store 加硬链接。

所有包文件按内容哈希存进一个全局 store，只存一份。安装时，项目 node_modules 里的文件不是拷贝，而是指向 store 的硬链接。官方原话：files are hard-linked from that single place, consuming no additional disk space —— 从那个单一位置硬链接过来，不占额外空间。

好处有三个。第一，省盘：一百个项目共用一份 store。第二，更新高效：一个包一百个文件只改了一个，pnpm 只往 store 加一个新文件，不克隆整包。第三，安装快：包已在 store 里时，安装阶段几乎只是创建硬链接，不复制内容、不重新下载，二次安装和 CI 缓存命中极快。

常用命令：pnpm store path 看 store 实际位置，pnpm store prune 清理不再被任何项目引用的孤儿包，需要时会重新下载，很安全。一个约束：store 和项目要在同一文件系统，跨盘会退化成复制。
-->

---

# 符号链接式 node_modules

```text
node_modules
├── foo -> ./.pnpm/foo@1.0.0/.../foo   # 顶层：直接依赖的软链
└── .pnpm/                             # 虚拟 store：平铺所有包
    └── foo@1.0.0/node_modules
        ├── foo  -> <store 硬链接>
        └── bar  -> ../../bar@1.0.0/.../bar  # foo 的依赖在同级
```

<v-clicks>

- 顶层**只放直接依赖**的符号链接
- 所有包平铺在 `.pnpm/`，文件硬链接自 store
- 每个包的依赖在**它同级** → 强隔离

</v-clicks>

<!--
再看严格的核心：符号链接式的 node_modules，pnpm 默认布局。

三个要点。第一，顶层 node_modules 只放直接依赖的符号链接，你 package.json 写了什么，顶层才有什么的软链。第二，所有包，包括传递依赖，平铺在 node_modules 斜杠 .pnpm 这个虚拟 store 里，按 名字@版本 的规律存放，文件全是全局 store 的硬链接。第三，每个包自己的依赖，被符号链接到它的同级目录下。

看这个例子：foo 是直接依赖，顶层有它的软链；foo 的依赖 bar，被链接到 foo 的 node_modules 同级。这样 foo 只能访问到自己声明的 bar，访问不到别的包。

这层 .pnpm 斜杠 名字@版本 斜杠 node_modules 的嵌套结构有两个目的：一是让包能 require 自身，读自己的 package.json；二是把依赖放同级避免循环软链，实现强隔离。这个隔离正是下一页防幽灵依赖的基础。
-->

---

# 幽灵依赖：pnpm 怎么防住

```js
// package.json 只声明了 axios，没声明 lodash
import _ from "lodash";
// npm：可能「恰好可用」(被提升到顶层)
// pnpm：直接报 Cannot find module
```

<v-clicks>

- 幽灵依赖 = **用了没声明的包**，靠扁平提升才偶然能跑
- pnpm 顶层只暴露直接依赖 → 未声明的**访问不到**
- 迁移后报错？多半是它**帮你揪出**了幽灵依赖

</v-clicks>

<!--
幽灵依赖是 pnpm 最重要的卖点，单独讲清楚。

定义：幽灵依赖就是代码 import 了一个并没有写进自己 package.json 的包。在 npm 的扁平 node_modules 里，大量传递依赖被提升到顶层，于是这种未声明的包恰好能 require 到，代码看似能跑。隐患在于：哪天那个传递依赖被移除、换版本或不再被提升，代码就崩，而且很难排查。

看这个例子：你只声明了 axios，没声明 lodash，却 import 了 lodash。npm 下，如果 axios 的某个传递依赖是 lodash 并被提升，这行恰好能跑；pnpm 下，顶层根本没有 lodash 的软链，直接报 Cannot find module。

所以一个常见现象：从 npm 迁到 pnpm 后,突然报一堆找不到模块。这不是 pnpm 的 bug，恰恰是它把你原来被扁平布局掩盖的幽灵依赖揪出来了。正解是把这些包补进 package.json 的 dependencies，补完项目反而更健壮、更可复现。
-->

---
layout: two-cols-header
---

# 安装与常用命令

::left::

**安装 pnpm**

```bash
npm i -g pnpm@latest-11
# 或 Corepack
corepack enable pnpm
```

**日常**

```bash
pnpm add <pkg>      # 加依赖(-D/-g/-E)
pnpm install        # 装齐全部
pnpm <script>       # 跑脚本
```

::right::

**对照 npm**

| pnpm | npm |
|---|---|
| `pnpm add` | `npm i` |
| `pnpm install` | `npm install` |
| `pnpm dlx` | `npx` |
| `--frozen-lockfile` | `npm ci` |

<!--
安装与命令，和 npm 几乎一一对应，迁移成本很低。

安装 pnpm 有几种方式：最直接是 npm i -g pnpm@latest-11 全局装；也可以用 Node 自带的 Corepack，corepack enable pnpm，配合 package.json 的 packageManager 字段按项目锁版本。注意 2025 年起 Corepack 有签名问题，用之前先 npm i -g corepack@latest 更新一下。

日常命令：加依赖用 pnpm add，加 -D 进开发依赖、-g 全局、-E 锁精确版本；装齐 package.json 全部依赖用 pnpm install 无参；跑脚本 pnpm 加脚本名，run 可以省略。

右边是和 npm 的对照表：pnpm add 对应 npm i，pnpm install 对应 npm install，pnpm dlx 对应 npx，frozen-lockfile 对应 npm ci。有一点和 npm 不同：pnpm 会校验所有选项，写错的 flag 直接报错，不会被悄悄忽略。
-->

---

# 锁文件与 CI

<v-clicks>

- 锁文件是 **`pnpm-lock.yaml`**（YAML），**必须提交**
- 本地 `pnpm install`：按 package.json 装，必要时更新锁
- CI 一律 **`--frozen-lockfile`**

</v-clicks>

<div v-click class="mt-4">

```bash
pnpm install --frozen-lockfile
# 严格按锁文件装、不改锁文件
# 锁文件与 package.json 不一致 → 直接失败
```

</div>

<!--
锁文件与 CI，保证可复现安装。

pnpm 的锁文件是 pnpm-lock.yaml，YAML 格式，记录精确版本和完整性哈希，必须提交到版本库。

本地开发跑 pnpm install 无参，会按 package.json 安装，必要时更新锁文件。

CI 里一律加 frozen-lockfile，语义接近 npm ci。它做三件事：严格按 pnpm-lock.yaml 安装、绝不修改锁文件、如果锁文件和 package.json 不一致就直接报错退出。

这正是它在 CI 的价值：强制锁文件和清单同步提交。如果有人改了 package.json 却忘了更新锁文件，CI 会当场失败，而不是偷偷帮他改锁、把不一致带进生产。这样杜绝了本地能装、CI 偷偷改锁的情况。
-->

---

# dlx：临时执行，即用即走

```bash
pnpm dlx create-vue my-app       # = npx create-vue
pnpm dlx create-vue@next my-app  # 指定版本

# 包名 ≠ bin 名时用 --package
pnpm dlx --package=@pnpm/meta-updater meta-updater
```

<v-clicks>

- 从 registry 临时拉取执行，**不写入依赖**
- v11 起别名 **`pnx`**，并尊重 trust 策略
- 区别：`pnpm exec` 跑**已装**的二进制

</v-clicks>

<!--
dlx，临时执行一次性命令。

不想把一个一次性的 CLI 装进项目时，用 pnpm dlx，它从 registry 临时拉取、执行、即用即走，不写入项目依赖，完全对应 npx。比如 pnpm dlx create-vue my-app 跑脚手架，也能用 @next 指定版本或 tag。

有个细节：当包名和它暴露的 bin 名不一致时，用 --package 显式指定要安装的包，再写要跑的命令。比如包叫 @pnpm/meta-updater，bin 叫 meta-updater。

v11 起 dlx 有个简写别名 pnx，而且会尊重项目级的安全和 trust 策略，对信任不足或刚发布的包会拒绝执行。

注意区别 pnpm exec：exec 是运行项目里已经安装好的二进制，dlx 才是临时下载执行未安装的包。
-->

---

# monorepo：workspace

```yaml
# pnpm-workspace.yaml（独立文件，非 package.json）
packages:
  - "packages/*"
  - "apps/*"
  - "!**/test/**"
```

<v-clicks>

- 工作区成员写在**独立**的 `pnpm-workspace.yaml`
- 本地依赖用 `workspace:*` 协议 → 强制用本地包
- 发布时 `workspace:^` → `^1.5.0`（自动替换）

</v-clicks>

<!--
进入 monorepo。pnpm 的 monorepo 支持是一流的，先看工作区定义。

和 npm、Yarn 把 workspaces 写在根 package.json 不同，pnpm 的工作区成员写在一个独立的文件 pnpm-workspace.yaml，用 packages 字段加 glob 声明。比如 packages 斜杠星号、apps 斜杠星号，再用感叹号排除 test 目录。配好后在根目录 pnpm install，所有成员一次性安装，共享一个根锁文件。

子包之间互相依赖，用 workspace 协议。比如 web 依赖 utils，就写 utils 是 workspace 星号。官方说：用了这个协议，pnpm 会拒绝解析到任何非本地工作区的包 —— 也就是强制用本地包，绝不去 registry 拉同名包。

发布时很贴心：workspace 协议会被自动替换成真实版本范围。假设当前版本都是 1.5.0，workspace 星号变成 1.5.0、workspace 脱字号变成 脱字号 1.5.0、workspace 波浪号变成 波浪号 1.5.0。这样开发期链接本地，发布后能被 registry 正常解析。
-->

---

# --filter：选择性执行

```bash
pnpm --filter @app/web build      # 只对它
pnpm --filter "@app/*" test       # glob
pnpm --filter @app/web... build   # 它 + 上游(它依赖谁)
pnpm --filter ...@app/web test    # 它 + 下游(谁依赖它)
pnpm --filter "...[origin/main]" build  # 改动+下游
```

<div v-click class="mt-4">

> 口诀：**`...` 在前带下游，在后带上游**；`[ref]` = git 变更集。对全体递归用 `pnpm -r`

</div>

<!--
monorepo 里不想对所有包跑命令，用 filter 选子集，这是 monorepo CI 的核心能力。

最基础：pnpm --filter 加包名，只对这个包跑命令；也能用 glob，比如 @app 斜杠星号匹配一组；还能按目录 ./packages 斜杠斜杠。

按依赖图扩展，关键看三个点 ... 的位置。放在包名后面，比如 @app/web...，是这个包加上它依赖的包，也就是上游。放在包名前面，比如 ...@app/web，是这个包加上依赖它的包，也就是下游 dependents。

最实用的是 git 变更过滤：方括号里写 git 引用，选自该引用以来改动过的包；前面加 ...，连受影响的下游一起带上。所以 ...方括号 origin/main，意思是 main 以来改动的包加上受它们影响的下游，CI 里只测这些就够了，省时间。

口诀记牢：... 在前带下游，谁依赖我；... 在后带上游，我依赖谁。要对工作区全体递归执行，用 pnpm -r。
-->

---

# catalog：版本目录

```yaml
# pnpm-workspace.yaml
catalog:               # 默认目录
  react: ^18.2.0
catalogs:              # 命名目录(可并存)
  react17:
    react: ^17.0.2
```

```json
{ "dependencies": { "react": "catalog:" } }
```

<div v-click class="mt-2 text-sm">

> 单一来源、升级改一处、减少冲突。发布时 `catalog:` → 真实版本

</div>

<!--
catalog，版本目录，pnpm 首创、特别适合 monorepo 的能力。

痛点：monorepo 里同一个库被很多包以不同范围声明，很容易解析出多个版本，既占空间又可能引发诡异 bug。

catalog 让你集中声明一次。在 pnpm-workspace.yaml 里，默认目录用单数 catalog 冒号，比如 react 是 脱字号 18.2.0；命名目录用复数 catalogs，下面挂名字，比如 react17。两者可以并存。

子包里就不写具体版本了，直接写 react 是 catalog 冒号，引用默认目录；命名目录就写 catalog 冒号 react17。

收益官方总结三条：版本一致，一个工作区通常只该有一个版本；升级简单，只改目录这一处，不用动一堆 package.json；减少冲突，因为 package.json 不再因为升级而改动，git 合并冲突自然少了。发布时 catalog 协议同样会被替换成目录里的真实版本，对外可正常解析。
-->

---

# 依赖治理三件套

| 场景 | 用哪个 |
|---|---|
| 强制某依赖(含传递)版本 | `overrides` |
| peer 声明过窄想消告警 | `peerDependencyRules` |
| 破损包漏声明依赖/peer | `packageExtensions` |
| 改依赖源码 | `pnpm patch` |

<div v-click class="mt-4">

```yaml
overrides:
  lodash: ^4.17.21   # 安全修复：钉死所有层级
```

</div>

<!--
依赖治理三件套，加上补丁，对号入座，别用混。

第一个场景：某个传递依赖有漏洞，想把所有层级的它统一钉到安全版本，用 overrides。比如 overrides 里写 lodash 是 脱字号 4.17.21，不管它在依赖树多深，都被强制到这个版本，这是安全修复最常用的手段。

第二个场景：某个包的 peerDependencies 声明得过窄，比如只允许 react 17，但你确认它在 react 18 下能用，想消除安装告警，用 peerDependencyRules，里面的 allowedVersions 放宽允许的版本，ignoreMissing 忽略缺失 peer 的告警。

第三个场景：某个破损的包自己漏声明了它运行时实际需要的依赖或 peer，导致在 pnpm 严格布局下报错，用 packageExtensions 给它补上缺失的声明，相当于给破损包打清单补丁，不用等上游修。

第四个场景留到下一页：要改依赖的源码，用 pnpm patch。记住：overrides 改版本、peerDependencyRules 调 peer 校验、packageExtensions 补缺失声明，三者职责不重叠。
-->

---

# 安全默认：拦截构建脚本

<v-clicks>

- **v10 起默认拦截**依赖的 install/postinstall 脚本
- 防恶意 postinstall 投毒（供应链攻击）
- 放行：`pnpm approve-builds` 或 `allowBuilds`

</v-clicks>

<div v-click class="mt-3">

```yaml
# v10.26/v11：allowBuilds 取代 onlyBuiltDependencies
allowBuilds:
  esbuild: true
  core-js: false
```

</div>

<!--
安全默认，pnpm 近年最重要的演进，面试高频。

背景：供应链攻击常借依赖的 postinstall 脚本投毒，一装就中招。pnpm v10.0 起做了个重要的安全默认：默认禁止依赖自动执行生命周期脚本，也就是 preinstall、install、postinstall 都不自动跑。

所以从 v10 开始，首次安装常看到提示：某些包的 build 脚本被忽略、需要批准。这不是装坏了，是安全机制在起作用。

放行可信包有两种方式：一是交互式的 pnpm approve-builds，勾选要放行的包，自动写入配置；二是在 pnpm-workspace.yaml 里显式声明。

这里要分清版本演进：v10.0 用 onlyBuiltDependencies、neverBuiltDependencies 这些字段列白黑名单；v10.26 和 v11 引入了统一的 allowBuilds，是个 map，包名映射到 true 或 false，可以精确到版本，取代了那些旧字段。比如 esbuild 设 true 允许，core-js 设 false 禁止。要全局放开很不推荐，那才用 dangerouslyAllowAllBuilds。
-->

---

# patch：给依赖打补丁

```bash
pnpm patch express@4.18.1      # 解压到临时目录
# —— 编辑源码 ——
pnpm patch-commit <临时目录>   # 生成补丁并登记
```

<div v-click class="mt-3">

```yaml
# 自动写入 patchedDependencies，此后安装自动应用
patchedDependencies:
  express@4.18.1: patches/express@4.18.1.patch
```

</div>

<div v-click class="mt-2 text-sm">

> 内置流程，无需第三方 patch-package

</div>

<!--
patch，给依赖打补丁，pnpm 内置，替代第三方 patch-package。

场景：第三方包有个 bug，上游短期不会修，你想就地改它源码里的一行并让补丁持久生效。

流程两步。第一步，pnpm patch 加 包名@版本，pnpm 会把这个包解压到一个临时目录，并输出可编辑的路径，你在那个目录里改源码。第二步，pnpm patch-commit 加临时目录路径，pnpm 把你的改动生成一个 .patch 文件。

登记信息会自动写进 patchedDependencies 字段，在 pnpm-workspace.yaml 或 package.json 里，键是 包名@版本，值是补丁文件路径。此后每次安装都会自动应用这个补丁，不用你操心。

它支持按版本范围匹配，优先级是精确版本大于范围大于仅包名。对比直接改 node_modules：那种改法不持久，重装就丢；fork 整个包重发布又太重。pnpm patch 是最轻量、可提交、可复现的方案。
-->

---
layout: two-cols-header
---

# 部署：deploy + fetch

::left::

**deploy：自包含目录**

```bash
pnpm --filter=@app/api \
  --prod deploy ./out
```

> 展开 workspace 依赖，
> 适合 Docker 生产镜像

::right::

**fetch：优化层缓存**

```dockerfile
COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY . .
RUN pnpm install --offline
```

> 依赖层与源码解耦

<!--
部署，两个生产链路的利器：deploy 和 fetch。

先看 deploy。在 monorepo 里把某个子服务连同它的依赖产出成一个自包含目录，命令是 pnpm --filter 选包 --prod deploy 加目标目录。它会把 workspace 本地依赖也展开成真实的 node_modules，产出的目录可以直接 node 运行，不含整个 monorepo。--prod 跳过 devDependencies 瘦身。这特别适合 Docker：多阶段构建里先 build，再 deploy 到精简基础镜像比如 node:24-alpine，镜像更小、启动更快。

再看 fetch，解决 Docker 层缓存问题。痛点是改一行业务代码就重装全部依赖。做法：Dockerfile 里先只 COPY 锁文件，跑 pnpm fetch，它只依据锁文件把依赖拉进虚拟 store，不需要 package.json，和源码完全解耦。这一层只在锁文件变化时才失效，缓存命中率极高。然后再 COPY 源码，pnpm install --offline 从本地 store 离线装齐，不再触网。这样业务代码改动不会击穿依赖层缓存。
-->

---

# pnpm vs npm vs Yarn

| 维度 | npm | pnpm | Yarn PnP |
|---|---|---|---|
| 磁盘 | 各拷一份 | **store+硬链接** | zip 缓存 |
| node_modules | 扁平 | **软链非扁平** | 无 |
| 幽灵依赖 | 易暴露 | **杜绝** | 杜绝 |
| 工作区定义 | package.json | **workspace.yaml** | package.json |

<div v-click class="mt-4 text-sm">

> pnpm 也有 `nodeLinker: pnp` 可选；但默认软链 node_modules，走标准解析、兼容性最好

</div>

<!--
横向对比 npm、pnpm 和 Yarn Berry 的 PnP，看清各自的取舍。

磁盘：npm 每个项目各拷一份；pnpm 全局 store 加硬链接复用，最省；Yarn PnP 用 zip 缓存，还能 zero-install 把缓存提交进仓库。

node_modules 布局：npm 扁平提升；pnpm 符号链接非扁平；Yarn PnP 干脆不生成 node_modules，用一个 .pnp.cjs 文件接管模块解析。

幽灵依赖：npm 容易暴露；pnpm 和 Yarn PnP 都从结构上杜绝。

工作区定义：npm 和 Yarn 写在 package.json 的 workspaces；pnpm 写在独立的 pnpm-workspace.yaml。

一个补充：pnpm 也提供 nodeLinker pnp 这种无 node_modules 的可选模式，但它默认是符号链接式的真实 node_modules，走 Node 标准模块解析，兼容性最好。这就是 pnpm 相对 Yarn PnP 的优势 —— 同样严格防幽灵，但不需要工具额外适配。
-->

---
layout: intro
---

# 总结

pnpm = **省盘 + 严格 + monorepo 友好**的包管理器

- store + 硬链接省盘；符号链接非扁平**防幽灵依赖**
- monorepo：`workspace:` 协议 + `--filter` + **catalog 版本目录**
- 安全默认：v10+ 拦截构建脚本，`allowBuilds`/`approve-builds`
- 工程化：`overrides` / `patch` / `deploy` / `fetch`
- 2026：主线 11.x，新项目首选之一

<!--
总结一下。

pnpm 是一个省盘、严格、对 monorepo 友好的包管理器，三块护城河。

技术核心两点：内容寻址 store 加硬链接带来极致省盘，命中即快；符号链接式的非扁平 node_modules 从结构上防住幽灵依赖，这是它和 npm 最本质的区别。

monorepo 能力一流：独立的 pnpm-workspace.yaml 定义工作区，workspace 协议引用本地包，--filter 做选择性执行还支持 git 变更过滤，catalog 版本目录统一依赖版本。

安全上，v10 起默认拦截依赖构建脚本防供应链投毒，用 allowBuilds 和 approve-builds 显式放行。工程化齐备：overrides 强制版本、patch 打补丁、deploy 出自包含部署目录、fetch 优化 Docker 缓存。

2026 年现状：主线在 11.x，凭省盘、严格、monorepo 友好，已是新项目选型的主流首选之一。迁移时记住：pnpm 报的错大多是在帮你发现 npm 掩盖的隐患，补全声明后项目更健壮。谢谢大家。
-->
