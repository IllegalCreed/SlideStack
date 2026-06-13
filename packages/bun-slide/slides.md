---
theme: seriph
background: https://cover.sli.dev
title: Bun as a Package Manager
info: |
  Presentation Bun — the package manager (bun install / bun pm).

  Learn more at [https://bun.com/docs/pm/cli/install](https://bun.com/docs/pm/cli/install)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🥟</span>
</div>

<br/>

## Bun — 包管理器

npm / yarn / pnpm 的高速替代：全局缓存 + clonefile/hardlink，官方称比 npm 快约 25×。读写标准 package.json / node_modules，可单独用在 Node 项目

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/oven-sh/bun" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天只聊 Bun 的一个角色：包管理器，也就是 bun install 和 bun pm。Bun 本身是 all-in-one 工具箱，还有运行时、打包器、测试运行器，但那些不在今天范围内，只在对比时一笔带过。

官方一句话定位：一个兼容 Node 的包管理器，定位为 npm、yarn、pnpm 的高速替代。关键是它是独立工具——哪怕你项目还用 Node 跑、用 Vite 打包,只要有 package.json,把 npm install 换成 bun install 就能提速。

主线：为什么需要 → 为什么快 → 命令 → 锁文件 → 安装策略 → workspaces → catalog → 安全 → 配置 → 迁移 → CI → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用它装包

<v-clicks>

- npm 装依赖慢，CI 等待时间长
- 二进制锁文件 PR 里没法 review
- 幻影依赖：能 import 没声明的包
- postinstall 是供应链攻击面

</v-clicks>

<div v-click class="mt-6">

Bun 的回应：

- 全局缓存 + OS 级物化 → **快**
- 文本 `bun.lock` → **可 diff**
- isolated installs → **严格隔离**
- 默认不跑依赖脚本 → **更安全**

</div>

<!--
为什么要专门换包管理器？四个老痛点。第一,npm 装依赖慢,CI 里每次都要等很久。第二,二进制锁文件在 PR 里没法 review,合并冲突难解。第三,扁平 node_modules 带来幻影依赖,能 import 没在 package.json 声明的包。第四,依赖的 postinstall 脚本是常见的供应链攻击面。

Bun 针对性地回应:全局缓存加 OS 级文件物化做到快;文本锁文件 bun.lock 可 diff;isolated installs 做严格隔离;默认不跑依赖的生命周期脚本提升安全。这四点就是今天的主线。
-->

---

# 为什么这么快

```bash
bun install   # 官方称比 npm install 快约 25×
```

<v-clicks>

- **全局缓存** `~/.bun/install/cache`：同一个包永不重复下载
- **OS 级物化**：macOS `clonefile`（写时复制）/ Linux `hardlink`（硬链接）
- **惰性按需**：锁文件命中且 package.json 未变 → 跳过已装的包
- Zig 原生实现 + 高并发网络

</v-clicks>

<!--
速度来自几件事叠加。

第一,全局共享缓存,在 ~/.bun/install/cache,同一个包多项目复用、永不重复下载,类似 pnpm 的全局 store。第二,OS 级文件物化:把缓存里的包放进 node_modules 时,macOS 默认用 clonefile 写时复制,Linux 默认用 hardlink 硬链接,都避免逐字节拷贝,不可用时回退 copyfile。第三,惰性按需:当锁文件命中且 package.json 没变,Bun 只下缺失的、跳过 node_modules 里已经匹配 name 和 version 的包,所以二次安装近乎瞬时。再加上 Zig 原生实现和高并发网络。
-->

---
layout: two-cols-header
---

# 上手命令

::left::

**装 / 临时跑**

```bash
bun install      # 装全部依赖
bun i            # 简写
bunx cowsay hi   # 临时跑(对位 npx)
bun ci           # CI 复现安装
```

::right::

**对位 npm**

```bash
# bun install  ≈ npm install
# bunx <pkg>   ≈ npx <pkg>
# bun ci       ≈ npm ci
```

<div class="mt-2 text-sm">

> 读写标准 `package.json` / `node_modules`，不绑定 Bun 运行时。

</div>

<!--
上手命令。装依赖就是 bun install,简写 bun i,会安装 dependencies、devDependencies、optionalDependencies,并且默认也装 peerDependencies,然后写 bun.lock。

bunx 对位 npx,一次性执行某个包的可执行文件,必要时临时下载,不写进依赖。bun ci 对位 npm ci,用于 CI 复现安装。

右边给出和 npm 的对位关系。最关键的一句:Bun 的包管理器读写标准 package.json 和 node_modules,不要求你把运行时也换成 Bun。你可以 bun install 装依赖,再用 node 跑代码。
-->

---

# 增删改依赖

```bash
bun add zod              # 加生产依赖
bun add -d typescript    # 加开发依赖(--dev / -D)
bun add -g biome         # 全局安装 CLI
bun add -E react         # 精确版本(不加 ^)
bun remove zod           # 卸载(简写 bun rm)
bun update               # range 内升级
bun update react --latest  # 突破 range 升最新
bun outdated             # 列可升级项
```

<!--
增删改一组命令。bun add 加依赖并写进 package.json,默认进 dependencies;加 -d 进 devDependencies;-g 全局装 CLI 工具;-E 写精确版本不加插入符。

卸载用 bun remove,简写 bun rm,注意不是 npm 的 uninstall。

升级有讲究:bun update 默认只在 package.json 的 semver range 内升级,更可控;要突破 range 升到绝对最新、并改写 range,得加 --latest。想先看看哪些有新版,用 bun outdated,它会列出 Current、Update、Latest 三列表格。
-->

---

# 锁文件：bun.lock 文本化

<v-clicks>

- Bun **1.2 起默认** `bun.lock`（**JSONC**），取代二进制 `bun.lockb`
- PR 能看 **diff**、合并冲突好解、Dependabot 能接入
- 切到文本后缓存安装还**快了约 30%**
- 务必把 `bun.lock` **提交**进版本控制

</v-clicks>

<div v-click class="mt-3 text-sm">

```bash
# 旧 bun.lockb 升级为文本锁文件
bun install --save-text-lockfile --frozen-lockfile --lockfile-only
```

</div>

<!--
锁文件是重点。Bun 1.2 起默认锁文件从二进制 bun.lockb 换成了文本 bun.lock,格式是 JSONC,也就是带注释的 JSON,类似 tsconfig。

为什么换?二进制锁文件在 PR 里没法 review、合并冲突难解、工具读不了。换成文本后,GitHub 能渲染 diff,Dependabot 能接入,而且官方说出人意料地,缓存命中的安装还快了约 30%。

实践上务必把 bun.lock 提交进版本控制,它是可复现安装的依据。手里还有旧的 bun.lockb 的话,用底下这条命令升级:save-text-lockfile 输出文本、frozen-lockfile 保持版本、lockfile-only 不实际安装,然后删掉旧的 lockb。
-->

---

# 两种安装策略

| 维度 | hoisted（扁平） | isolated（隔离） |
|---|---|---|
| 结构 | 共享 node_modules 顶层 | .bun store + symlink |
| 风格 | 传统 npm/yarn | pnpm 式 |
| 幻影依赖 | 可能 | **杜绝** |

```bash
bun install --linker isolated   # 或 hoisted
```

<!--
Bun 支持两种安装策略,这是最该先理解的概念。

hoisted 是提升、扁平,把依赖铺到共享 node_modules 顶层,是传统 npm、yarn 的做法,缺点是可能产生幻影依赖。isolated 是隔离,在 node_modules 斜杠 .bun 建中心 store,顶层放指向 store 的符号链接,是 pnpm 式做法,好处是包只能访问自己声明过的依赖,从源头杜绝幻影依赖。

什么是幻影依赖?扁平结构下,你的包能 import 一个没在 package.json 声明、只是被提升上来的传递依赖,一旦它消失就突然报错。切换策略用 --linker isolated 或 hoisted,也能写进 bunfig.toml。
-->

---

# 默认策略：看场景

<v-clicks>

- **新建 workspaces / monorepo** → 默认 `isolated`
- **新建单包项目** → 默认 `hoisted`
- **v1.3.2 前的老项目** → 保持 `hoisted`

</v-clicks>

<div v-click class="mt-4 text-sm">

> 默认由锁文件的 `configVersion` 字段决定，可用 `--linker` 或 `bunfig.toml` 覆盖。

</div>

<!--
默认用哪种策略?官方规则按场景决定,不是一刀切。

新建的 workspaces 或 monorepo,默认 isolated,因为多包项目最怕幻影依赖。新建的单包项目,默认 hoisted,保持传统 npm 行为,兼容性最好。v1.3.2 之前创建的老项目,保持 hoisted,向后兼容,不会因为升级 Bun 就改变 node_modules 结构。

这个默认由锁文件里的 configVersion 字段控制。你随时可以用 --linker 命令行,或在 bunfig.toml 的 install 段写 linker 来显式覆盖。
-->

---

# workspaces：monorepo

```jsonc
// 根 package.json
{ "workspaces": ["packages/*"] }
```

```jsonc
// 子包互相引用
{ "dependencies": { "@my/ui": "workspace:*" } }
```

<v-clicks>

- 根目录跑一次 `bun install` → 全部工作区装好并去重
- 写法同 npm/yarn（放 package.json，不用单独 yaml）

</v-clicks>

<!--
workspaces 是 monorepo 的基础。在根 package.json 用 workspaces 数组声明,支持 glob 和负向模式。

包之间用 workspace 协议互相引用,比如 workspace 星号,也支持 workspace 插入符、workspace 波浪号。

在仓库根跑一次 bun install,就为所有工作区安装依赖并自动去重。发布时 workspace 星号会被替换成被引用包的真实版本号。

和 pnpm 不同的是,Bun 的 workspaces 写法和 npm、yarn 一致,直接放 package.json,不需要单独的 pnpm-workspace.yaml。
-->

---

# catalog：集中管版本

```jsonc
// 根 package.json
{ "workspaces": {
    "packages": ["packages/*"],
    "catalog": { "react": "^19.0.0" }
} }
```

```jsonc
// 子包引用
{ "dependencies": { "react": "catalog:" } }
```

<div v-click class="mt-2 text-sm">

> 一处定义、多处复用，升级只改根目录；从 pnpm 迁移会自动保留。

</div>

<!--
monorepo 里多个子包都依赖 react,逐个写版本容易漂移。Bun 支持 catalog,思路和 pnpm 一样。

在根 package.json 的 workspaces 下定义 catalog,也可以定义命名的 catalogs。子包用 catalog 冒号协议引用:写 catalog 冒号用默认目录的版本,写 catalog 冒号 build 用名为 build 的目录。

收益是版本一处定义、多处复用,升级只改根目录一处,彻底消除版本漂移。从 pnpm 迁移过来时,pnpm-workspace.yaml 里的 catalog 会被自动迁进根 package.json。
-->

---

# 安全：trustedDependencies

<v-clicks>

- Bun **默认不跑依赖的** `postinstall` 等脚本（供应链防护）
- 确需脚本的包，加入白名单：

</v-clicks>

<div v-click>

```jsonc
{ "trustedDependencies": ["sharp"] }
```

```bash
bun add sharp --trust    # 一步添加并放行
bun pm untrusted         # 看哪些被拦了
```

</div>

<!--
安全是 Bun 与 npm 最重要的行为差异。官方原文:不像其它 npm 客户端,Bun 默认不执行被安装依赖的任意生命周期脚本,比如 postinstall。因为执行任意脚本是供应链攻击的常见入口。

那确实需要脚本的包怎么办,比如带原生编译的 sharp?把它加入 package.json 的 trustedDependencies 数组,再重装,Bun 就会为它放行。命令行也能一步到位:bun add sharp --trust。

辅助命令:bun pm untrusted 看哪些依赖的脚本被拦了,bun pm trust 事后放行,bun pm default-trusted 看默认信任列表。注意:项目自身的脚本仍会跑,被拦的只是依赖的脚本。
-->

---

# 供应链：minimumReleaseAge

```toml
# bunfig.toml
[install]
minimumReleaseAge = 259200   # 只装发布满 3 天的版本(秒)
minimumReleaseAgeExcludes = ["typescript"]
```

<v-clicks>

- 防「恶意包刚发布就被装进来」
- 只影响**新解析**，已锁定的包不变
- 带稳定性检查，跳过扎堆刚发的版本

</v-clicks>

<!--
再讲一个供应链防护:minimumReleaseAge,最小发布时长。

针对的攻击是:恶意包被发布后,几小时内就被装进项目。设置一个最小发布时长,单位秒,就能过滤掉太新的版本,比如只装发布满 3 天的。命令行用 --minimum-release-age,或在 bunfig.toml 的 install 段配 minimumReleaseAge,还能用 minimumReleaseAgeExcludes 排除你信任的包,比如 typescript、@types/node。

机制要点:只影响新解析,已经在 bun.lock 里的包不变;直接和传递依赖都受约束;还带稳定性检查,如果多个版本扎堆在闸门外刚发布,会再往后跳过这些可能不稳的版本,最多向后找 7 天。
-->

---

# 配置与私有源

```toml
# bunfig.toml
[install]
registry = "https://registry.npmjs.org"

[install.scopes]
myorg = { token = "$npm_token", url = "https://r.myorg.com/" }
```

<v-clicks>

- 也兼容读 `.npmrc` 的 registry/scope 配置
- 命令行 `--registry` 优先级最高

</v-clicks>

<!--
配置集中在 bunfig.toml 的 install 段。默认 registry 写在 install 段的 registry 字段。按作用域配私有源,写在 install.scopes 子段,比如让 myorg 作用域走公司 registry 并带 token,token 还能用环境变量插值。

Bun 也兼容读取已有的 .npmrc 里的 registry、scope、鉴权配置,不用改写就能用。

优先级:命令行 --registry 最高,会盖过 .npmrc、bunfig.toml 和环境变量;环境变量又高于 bunfig.toml。搜索顺序是先全局 HOME 下的 .bunfig.toml,再项目根的 bunfig.toml,两者合并。
-->

---

# 从 npm / pnpm / yarn 迁移

| 来源 | 行为 |
|---|---|
| `package-lock.json` | 自动迁为 `bun.lock` |
| `yarn.lock`(v1) | 自动迁为 `bun.lock` |
| `pnpm-lock.yaml`(v7+) | 迁锁文件 + workspace/catalog |

```bash
bun install     # 无 bun.lock 时自动迁移，原文件保留
```

<!--
迁移几乎零成本。Bun 在 bun.lock 缺失时会自动迁移锁文件。

npm 的 package-lock.json、Yarn v1 的 yarn.lock,都会自动迁成 bun.lock。pnpm 的 pnpm-lock.yaml,需要 lockfile 版本 7 以上,除了迁锁文件,还会把 pnpm-workspace.yaml 里的 packages 列表和 catalog 迁进根 package.json。

操作上,直接跑 bun install 就行,检测到旧锁文件且没有 bun.lock 就自动迁移,原来的锁文件会保留供你核对。只想迁移不安装,可以用 bun pm migrate。迁移会尽量保留原锁定的版本和依赖关系,不会全部升到最新。
-->

---

# CI 实战

```yaml
# .github/workflows/ci.yml
steps:
  - uses: actions/checkout@v4
  - uses: oven-sh/setup-bun@v2
  - run: bun ci                      # 锁文件不一致即失败
  - run: bun run --filter '*' build  # 按拓扑序跑
```

<div v-click class="mt-3 text-sm">

> 前提：把 `bun.lock` 提交进版本控制。`bun ci` = `install --frozen-lockfile`。

</div>

<!--
CI 实战。用官方的 setup-bun action 装 Bun,然后关键一步是 bun ci,它等价于 install --frozen-lockfile,会按 bun.lock 装精确版本,如果 package.json 和锁文件不一致就直接失败退出,保证 CI 和本地装的是同一套版本,对位 npm ci。

monorepo 里再用 bun run --filter 星号 build,在所有工作区跑 build,而且 Bun 会按依赖拓扑排序,被依赖的包先构建。

前提是把 bun.lock 提交进版本控制,否则 bun ci 没有依据。另外把 ~/.bun/install/cache 做成 CI 缓存,能进一步加速。
-->

---
layout: intro
---

# 总结

Bun 包管理器 = **npm 的高速替代，零迁移成本**

- 快：全局缓存 + clonefile/hardlink，约 25×
- 锁文件：文本 `bun.lock`（JSONC），可 diff
- 策略：hoisted vs isolated（新 monorepo 默认隔离）
- 安全：默认不跑依赖脚本 + minimumReleaseAge
- monorepo：workspaces + catalog + `--filter`
- 边界：**包管理器 Bun ≠ 运行时 Bun**，可单用

<!--
总结一下。

Bun 的包管理器,本质是 npm、yarn、pnpm 的高速替代,几乎零迁移成本,因为它读写标准 package.json 和 node_modules。

技术要点:快,靠全局缓存加 clonefile、hardlink,官方称约 25 倍;锁文件是文本 bun.lock,JSONC 格式,能 diff 能合并;安装策略分 hoisted 和 isolated,新建 monorepo 默认隔离,杜绝幻影依赖;安全上默认不跑依赖的生命周期脚本,还有 minimumReleaseAge 时间闸门;monorepo 有 workspaces、catalog、--filter 一整套。

最后再强调今天贯穿的边界:包管理器的 Bun,不等于运行时的 Bun。你完全可以只用 bun install 装依赖,继续用 node 跑代码、用 Vite 打包。把这条记牢,就不会把装包快误解成必须整套换 Bun。谢谢大家。
-->
