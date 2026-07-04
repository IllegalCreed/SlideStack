---
theme: seriph
background: https://cover.sli.dev
title: Changesets
info: |
  monorepo 版本发布工具：把变更意图落成文件，跟着 PR 一起评审。

  基于 Changesets（@changesets/cli）· 核于 2026-07
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Changesets

**monorepo 版本发布：显式声明变更意图，跟着 PR 一起评审**

以 `.changeset/*.md` 声明「改了哪些包 + 升哪级 + 写什么 changelog」，发版时统一消费

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/changesets/changesets" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Changesets：一个以 monorepo 为核心的版本管理和 changelog 生成工具。

它的核心理念一句话：把「发布意图」落成一个文件，跟着 PR 一起走 review。开发者改代码时顺手声明这次动了哪些包、各升哪级、changelog 写什么；发版时统一消费。

它原生为多包仓库设计，配 pnpm / yarn / npm workspaces 开箱即用，是当下开源 monorepo 发布流程的事实标准之一。当前版本 @changesets/cli 2.31.0。
-->

---
transition: fade-out
---

# 什么是 Changesets

以 monorepo 为核心的版本管理 + changelog 生成工具

<v-clicks>

- 把「发布」拆两段：先**声明意图**，后发版时**统一消费**
- 开发者随手写 `.changeset/*.md`：动了哪些包、各升哪级、changelog 说什么
- **monorepo 原生**：自动处理包间依赖联动，配 pnpm / yarn / npm workspaces 开箱即用
- 意图落成**可评审、可编辑、可累积**的 Markdown，跟 PR 一起 review
- Vue、Astro、Turborepo 等开源多包库的事实标准之一

</v-clicks>

<!--
Changesets 是什么？一个以 monorepo 为核心的版本管理加 changelog 生成工具。

它把发布拆成前后两段：开发时先声明意图，发版时再统一消费。这就是它区别于其它工具的关键。

它原生理解包间依赖联动，配三大包管理器的 workspaces 都开箱即用。意图不是藏在 commit message 里，而是落成可评审、可编辑、可累积的 Markdown 文件，跟 PR 一起走 review。

Vue、Astro、Turborepo、Emotion 这些开源多包库清一色在用，是事实标准之一。
-->

---
transition: fade-out
---

# 解决什么问题

monorepo 手工发版的三个痛点

<v-clicks>

- 改了底层包，得记得把**所有依赖它的包**也升版本
- 多个 PR 累积后，发版时要**回忆每个包**该升 major 还是 patch
- CHANGELOG 靠人肉整理，**容易漏、容易错**

</v-clicks>

<div v-click class="mt-6">

**Changesets 的答案：把决策前移到写代码的当下**——谁改的谁最清楚该怎么发版，就让他顺手写个 changeset。发版时机器汇总、算版本、补依赖、生成 changelog。**人做决策，机器做计算。**

</div>

<!--
先看它解决什么问题。monorepo 里手工发版有三个痛点。

第一，改了一个底层包，得记得把所有依赖它的包也升个版本，漏一个下游就配到旧依赖。

第二，多个 PR 累积后，发版时要回忆每个包该升 major 还是 patch，很容易记错。

第三，CHANGELOG 靠人肉整理，容易漏、容易错。

Changesets 的答案是把决策前移到写代码的当下：谁改的谁最清楚这次该怎么发版，就让他在 PR 里顺手写一个 changeset。发版时机器汇总、算版本号、补齐依赖联动、生成 changelog。人只做决策，机器做计算。
-->

---
transition: fade-out
---

# 安装与初始化

装在仓库根，一条命令生成配置骨架

```bash
pnpm add -Dw @changesets/cli   # -w 装到 workspace 根
pnpm changeset init            # 初始化
```

<v-clicks>

- `init` 在仓库根生成 `.changeset/` 目录
- 内含 `config.json`（配置）+ `README.md`（协作说明）
- 调用随包管理器：`pnpm changeset` / `yarn changeset` / `npx @changesets/cli`

</v-clicks>

<!--
安装很简单，装在仓库根。pnpm add 加 -D 加 -w，-w 表示装到 workspace 根。然后跑 changeset init 初始化。

init 会在仓库根生成一个 .changeset 目录，里面有两个文件：config.json 是配置文件，README.md 是给协作者看的说明。

调用方式随包管理器：pnpm 用 pnpm changeset，yarn 用 yarn changeset，npm 用 npx @changesets/cli。下文统一写 pnpm changeset。
-->

---
transition: fade-out
---

# changeset 文件长什么样

`.changeset/` 下一个随机命名的 Markdown（如 `tricky-lions-cry.md`）

```md
---
"@myorg/core": minor
"@myorg/cli": patch
---

新增 parse() 流式模式；修复 CLI 在 Windows 下的路径解析。
```

<v-clicks>

- **frontmatter**：每行一个「`包名: 级别`」，级别是 `major` / `minor` / `patch`
- **正文**：changelog 条目，原样搬进对应包的 `CHANGELOG.md`
- 一个 PR 可含多个 changeset；把它连同代码一起提交

</v-clicks>

<!--
一个 changeset 就是 .changeset 下的一个 Markdown 文件，文件名随机，比如 tricky-lions-cry.md。

它承载三条信息：要发哪些包、各按什么 semver 级别发、以及给用户看的 changelog 说明。

frontmatter 里每行一个「包名冒号级别」，级别是 major、minor、patch 三选一。正文就是这次变更的 changelog 条目，会被原样搬进对应包的 CHANGELOG。

一个 PR 可以有多个 changeset，比如两处互不相关的改动各写一个。写好后把它连同代码一起提交。官方建议 changelog 说明围绕做了什么、为什么、使用方怎么跟进来写，一句 fix bug 对下游毫无价值。
-->

---
transition: fade-out
---

# 三步工作流

add 声明意图 → version 消费升版 → publish 发布

```bash
changeset add      # 声明意图，随代码提交
changeset version  # 升版本 + 联动 + changelog + 删 changeset
changeset publish  # 幂等发布 + 打 tag
```

<v-clicks>

- **两阶段解耦**：`add` 贴着改动随时写，`version` + `publish` 发版时统一消费
- 多个 PR 的 changeset 自然**累积**成一次 release，中间隔着 review

</v-clicks>

<!--
整条工作流就三步。

add：声明变更意图，生成 changeset 文件，随代码一起提交。

version：消费全部 changeset，升版本号、联动内部依赖、写 CHANGELOG、删掉已消费的 changeset。

publish：发布到 npm，只发比 npm 新的包，幂等，然后打 git tag。

关键是两阶段解耦：add 贴着改动随时写，version 和 publish 发版时统一消费。这样多个 PR 的 changeset 会自然累积成一次 release，中间隔着一次 review。
-->

---
transition: fade-out
---

# Step 1 · changeset add

交互式声明变更意图

```bash
pnpm changeset     # 等价 changeset add
```

<v-clicks>

- 交互流程：**空格勾选受影响的包 → 各选 bump 级别 → 输入 changelog 说明**
- 完成后在 `.changeset/` 生成 `.md` 文件，**连同代码一起提交**

</v-clicks>

<div v-click class="mt-4">

```bash
changeset --empty              # 空 changeset：不发任何包，给 CI 卡点放行
changeset add -m "修复登录态过期"   # 直接从命令行给说明
changeset add --open           # 在外部编辑器里打开
```

</div>

<!--
第一步，changeset add。直接跑 pnpm changeset 就等价于 changeset add。

交互流程：方向键加空格勾选受影响的包，为每个包选 major、minor 还是 patch，最后输入 changelog 说明。完成后在 .changeset 生成一个 md 文件，把它连同代码一起提交。

三个常用参数：--empty 建一个不含任何包的空 changeset，专给 CI 卡点放行用；-m 直接从命令行给说明，不进交互；--open 在外部编辑器里打开新建的 changeset。
-->

---
transition: fade-out
---

# Step 2 · changeset version

发版前执行（或交给 CI），最「重」的一步

<v-clicks>

- 收集全部 changeset，为每个包取**命中它的最高 bump**，按 semver 递增
- **联动内部依赖**：被依赖包升级 → 依赖方自动补 bump 并更新依赖范围
- 把 changeset 正文归并进各包 `CHANGELOG.md`
- **删除**已消费的 `.changeset/*.md`
- 产出只是一批 diff——**还没发布**，先 review 再 publish

</v-clicks>

<div v-click class="mt-2">

`patch + patch + minor` → 取最高 `minor`（不累加）；含 `major` 则升 `major`

</div>

<!--
第二步，changeset version，通常由维护者在发版前执行，或交给 CI。这是整个流程里最重的一步。

它一次性做五件事：一，收集全部 changeset，为每个包取命中它的最高 bump 级别，按 semver 递增。二，联动内部依赖，被依赖的包升级了，依赖它的包自动补一个 bump 并更新依赖范围。三，把每个 changeset 的正文归并进对应包的 CHANGELOG。四，删除已消费的 changeset 文件。

第五点最重要：version 跑完，产出只是一批 package.json 和 CHANGELOG 的 diff，什么都还没发布。强烈建议把这批 diff 当成一次正常提交去 review，确认版本号和 changelog 无误再 publish。

补充合并规则：同一个包被 patch、patch、minor 三个 changeset 命中，取最高的 minor，不累加，不是两个 patch 等于一个 minor。有 major 就升 major。
-->

---
transition: fade-out
---

# Step 3 · changeset publish

只发「本地版本 > npm 版本」的包——幂等、可安全重跑

```bash
pnpm changeset publish
git push --follow-tags   # publish 打了 tag 但不会自动 push
```

<v-clicks>

- **幂等**：判据是「本地比 npm 新」，中途失败可直接重跑，已发的自动跳过
- **拓扑排序**发布，保证被依赖包先上 npm
- 每个成功发布的包打 `包名@版本` 形式的 git tag
- 发 scoped 公开包**必须**在 `config.json` 设 `"access": "public"`

</v-clicks>

<!--
第三步，changeset publish。它的逻辑很克制：逐个包比较本地 package.json 的版本和该包在 npm 上的最新版本，只有本地更新的才 npm publish。

正因为判据是本地比 npm 新，这条命令是幂等的。发布中途网络断了发了一半，直接重跑，已发的自动跳过。

多个包按依赖拓扑排序发布，保证被依赖的包先上 npm，避免下游装不到依赖。每个成功发布的包打一个「包名 at 版本」形式的 git tag，但注意 publish 不会自动 push tag，随后要 git push --follow-tags。

一个最容易踩的坑：scoped 公开包在 npm 上默认按私有处理，直接发会失败，必须在 config.json 里设 access 为 public。
-->

---
transition: fade-out
---

# config.json 关键字段

`.changeset/config.json`，由 `init` 生成

| 字段 | 默认 | 说明 |
| --- | --- | --- |
| `access` | `restricted` | 发公开包**必须**改 `public` |
| `baseBranch` | `master` | 主干叫 `main` 要改成 `main` |
| `changelog` | 内置简单格式 | 可换 `changelog-github` 出带链接的富格式 |
| `updateInternalDependencies` | `patch` | 内部依赖联动补 bump 的地板级 |
| `fixed` / `linked` | `[]` | 一组包齐发 / 版本看齐（见下页） |

<!--
config.json 是配置文件，由 init 生成。抓五个关键字段。

access，默认 restricted 按私有处理，发公开包必须改成 public，最容易踩。

baseBranch，变更检测的比较基线，默认还是历史遗留的 master，你主干叫 main 就一定要改成 main，否则变更检测错乱。

changelog，默认内置简单格式，想要带 PR 链接、作者提及的富 changelog，换成 @changesets/changelog-github 并配好 repo。

updateInternalDependencies，内部依赖联动补 bump 的地板级，默认 patch。

fixed 和 linked，控制一组包齐发或版本看齐，下一页专门讲。
-->

---
transition: fade-out
---

# fixed vs linked

两者都让一组包**共享版本号**，区别在「是否齐发」

| | `fixed` | `linked` |
| --- | --- | --- |
| 齐发 | **是**：组内一个改了全组一起升一起发 | **否**：只发实际有 changeset 的包 |
| 版本号 | 始终一致（取全组最高 bump） | 看齐（从全组当前最高版本起跳） |
| 场景 | 强绑定、必同版本的套件 | 版本想看齐、又不想每次全量发 |

<div v-click class="mt-4">

写法都是「数组的数组」`[["@myorg/a", "@myorg/b"]]`，均支持 glob。**`fixed` 保证没人掉队，`linked` 只保证版本号不各说各话。**

</div>

<!--
fixed 和 linked 是最容易混的一对。两者都让一组包共享同一个版本号，区别只在是否齐发。

fixed 是强绑定：组内任意一个包改了，全组一起升、一起发，版本号取全组所需的最高 bump。适合必须严格同版本同节奏发布的紧耦合套件，比如一个框架的 core、runtime、compiler。

linked 是版本看齐但按需发布：只有实际有 changeset 的包才升、才发，但升的时候从全组当前最高版本起跳，让版本号看起来同步。

一句话总结：fixed 保证谁都不会掉队全发，linked 只保证版本号不各说各话按需发但看齐。写法都是数组的数组，可以多组，也都支持 glob。
-->

---
transition: fade-out
---

# 预发布模式（pre）

发一串 `1.0.0-beta.0/.1/.2` 让用户提前试用——有状态

```bash
pnpm changeset pre enter next   # 进入，生成 .changeset/pre.json（要提交）
# …正常 add / version / publish，版本追加 -next.N，重跑计数器 +1…
pnpm changeset pre exit         # 退出，回到正常版本号
```

<v-clicks>

- **为何「很复杂」**：prerelease 版本不满足普通 range（`^5.0.0` 不被 `5.1.0-next.0` 满足）→ 依赖方连锁强制 bump
- **别在默认分支跑**：`pre exit` 前会阻塞其他人的正常发布

</v-clicks>

<!--
预发布模式，用来在正式发版前先发一串 beta 让用户提前试用。它是一个有状态的模式，靠 enter 和 exit 一对命令切换。

pre enter 加一个 tag，比如 next 或 beta，会生成一个 pre.json 记录预发布状态，这个文件要提交进仓库，它是当前处于预发布模式的唯一凭据。进入后正常 add、version、publish，version 会给版本追加 -next.N 后缀，重跑时计数器加一。pre exit 退出，下次 version 回到正常版本号。

官方反复强调预发布很复杂，核心原因是 prerelease 版本不满足普通 semver range，比如脱字号 5.0.0 不被 5.1.0-next.0 满足，于是一个包进预发布，所有依赖它的包都被强制一起 bump，产生连锁反应。

还有个坑：在默认分支跑预发布，pre exit 之前会阻塞其他人的正常发布，所以预发布只在非默认分支做。
-->

---
transition: fade-out
---

# snapshot 快照发布

让人立刻装上某个 PR / commit 的构建产物，不动正式版本线

```bash
pnpm changeset version --snapshot canary  # → 0.0.0-canary-<时间戳>
pnpm changeset publish --tag canary        # 发到非 latest 的 dist-tag
```

<v-clicks>

- **`--tag` 必不可少**：否则用户 `npm install` 会装到快照版而非稳定版
- 常配 `--no-git-tag`，不给临时版本打 git tag
- **改动不要合并回主干**：在专用分支跑，快照版本号不代表正式状态

</v-clicks>

<!--
snapshot 快照发布，用于让别人立刻装上某个 PR 或 commit 的构建产物来试，同时完全不动正式版本线。

两步：先 changeset version --snapshot 加个 tag，生成形如 0.0.0-canary-时间戳的一次性版本；再 changeset publish --tag canary 发到一个非 latest 的 dist-tag。

--tag 这个参数必不可少，是关键。如果不加，用户 npm install 会装到你的快照版而不是稳定版，这是灾难。通常还配 --no-git-tag，不给这些临时版本打 git tag。

最后一条纪律：snapshot 版本号只是给人临时安装用的，不代表正式的已发布状态，请在专用分支跑，version --snapshot 产生的改动不要合并回主干。
-->

---
transition: fade-out
---

# changesets/action：合并即发布

CI 里维护一个「Version Packages」PR

<v-clicks>

- 有新 changeset 合进主干 → action 跑 `version`，把结果做成 PR 并持续更新
- 你 review 这个 PR（版本号 + changelog）
- **合并该 PR** → action 检测到无待处理 changeset、有新版本 → 执行 `publish`
- 凭据：`GITHUB_TOKEN`（建 PR / Release，自动注入）+ `NPM_TOKEN`（发 npm，存 secret）

</v-clicks>

<div v-click class="mt-2">

一句话：**平时改动照常 add changeset；发版 = 点一下 merge。** 用稳定的 `changesets/action@v1`。

</div>

<!--
手工 version、review、publish 的流程，在 CI 里通常交给官方的 changesets/action。它的核心行为是维护一个叫 Version Packages 的 PR。

流程是这样：有新 changeset 合进主干后，action 自动跑 changeset version，把结果做成一个 PR，并持续保持它最新。你 review 这个 PR，看版本号和 changelog。合并这个 PR 后，action 再次触发，检测到没有待处理 changeset、但有可发布的新版本，就执行你的 publish 脚本发到 npm，默认还创建 GitHub Release。

两个凭据：GITHUB_TOKEN 用于建 PR 和 Release，GitHub 自动注入；NPM_TOKEN 用于发 npm，存成仓库 secret。

一句话：平时改动照常 add changeset，发版就是点一下 merge。注意用稳定的 v1，别抄到未发布的 v2。
-->

---
transition: fade-out
---

# 对比：意图从哪来

三者都做「自动版本 + changelog + 发布」，差在意图来源与发布触发

| 维度 | Changesets | semantic-release | release-please |
| --- | --- | --- | --- |
| 意图来源 | **显式 changeset 文件** | commit message 推断 | commit message 推断 |
| 发布触发 | 合并 Version PR | push 主干即发 | 合并 Release PR |
| monorepo | **原生**（联动 / fixed / linked） | 弱（需外挂） | 支持（manifest） |
| 语言 | JS / npm 为主 | JS 为主 | **语言无关** |

<div v-click class="mt-3">

多包库、发版决策要可评审 → **Changesets**；单包全自动「提交即发布」→ semantic-release；多语言 + Release PR → release-please。

</div>

<!--
最后横向对比 Changesets、semantic-release、release-please。三者都做自动版本、changelog、发布，但意图来源和发布触发方式不同。

意图来源：Changesets 用显式的 changeset 文件，人工选 bump；另两者从 Conventional Commit message 里推断。这是最本质的区别。

发布触发：Changesets 合并 Version PR 才发；semantic-release 最激进，push 到主干就发，没有中间 PR；release-please 也是合并 Release PR 才发。

monorepo：Changesets 原生支持依赖联动、fixed、linked；semantic-release 弱，得靠外挂；release-please 靠 manifest 模式支持。语言上 release-please 语言无关，Google 出品。

选型直觉：多包库、发版决策要可评审选 Changesets；单包、严格遵守 Conventional Commits、要提交即发布选 semantic-release；多语言仓库、想要 Release PR 又不想手写 changeset 选 release-please。
-->

---
layout: center
---

# 小结

Changesets = **显式声明意图 + monorepo 原生**的版本发布方案

<v-clicks>

- 三步：`add`（写意图）→ `version`（升版本 + 联动 + changelog + 删 changeset）→ `publish`（幂等发布 + tag）
- changeset 是 `.changeset/*.md`，跟 PR 一起评审——区别于 semantic-release 的根
- 配置抓四个：`access: public`、`baseBranch: main`、`updateInternalDependencies`、`fixed` vs `linked`
- 预发布 `pre`、快照 `snapshot`、`changesets/action` 合并即发布
- 当前 `@changesets/cli` 2.31.0 / `changesets/action` v1.9.0（2026-07）

</v-clicks>

<!--
小结一下。

Changesets 是一个显式声明意图加 monorepo 原生的版本发布方案。

核心三步：add 写意图，version 升版本、联动内部依赖、写 changelog、删 changeset，publish 幂等发布并打 tag。

它的根：changeset 就是 .changeset 下的 md 文件，跟 PR 一起评审，这是区别于 semantic-release 从 commit 推断的根本。

配置抓四个：access 设 public、baseBranch 设 main、updateInternalDependencies 控制联动地板级、fixed 和 linked 管齐发与版本看齐。

高级能力有预发布 pre、快照 snapshot、以及 changesets/action 的合并即发布。

当前版本 @changesets/cli 2.31.0，changesets/action v1.9.0。对开源 monorepo 几乎是首选，谢谢大家。
-->
