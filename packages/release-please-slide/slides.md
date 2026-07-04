---
theme: seriph
background: https://cover.sli.dev
title: release-please
info: |
  GitHub-native 的版本发布自动化：用一个 Release PR 作发布闸门，从 Conventional Commits 推断版本，自动 changelog / tag / GitHub Release。

  基于 release-please · 核于 2026-07
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:pull-request class="text-8xl" />
</div>

<br/>

# release-please

**用 Release PR 作发布闸门的 GitHub-native 版本发布自动化**

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/googleapis/release-please" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
release-please 是 Google 开源的发布自动化工具：它不追求「合并即发版」，而是维护一个持续刷新的 Release PR 作为发布闸门——你不合它就不发版，一旦合并才真正打 tag、建 Release。本场从定位、Release PR 机制、manifest 多包、CI 接入到选型对比逐一讲清。
-->

---
transition: fade-out
---

# release-please 是什么

Google 出品、GitHub-native 的版本发布自动化工具

<v-clicks>

- **Google 出品**：由 googleapis 组织维护，Apache-2.0（非 Google 官方产品）
- **GitHub-native**：深度绑定 PR / Release / Label / Actions，只服务 GitHub 仓库
- **Release PR 作闸门**：不即时发版，维护一个持续刷新的 Release PR，**合并才发**
- **从 commit 推断版本**：遵循 Conventional Commits，无需手写版本号与 changelog
- **多语言 + monorepo**：内置 20+ release type，manifest 模式管多包

</v-clicks>

<!--
六个字概括：Google、GitHub-native、Release PR 闸门、commit 推断、多语言。它围绕 GitHub 的 PR / Release / Label 生态设计，不支持 GitLab、Bitbucket 等平台。官方推荐用 release-please-action 接入。
-->

---
transition: fade-out
---

# 决策与执行分离

把手工发布的四件琐事全自动化，只留一个人工决定

<v-clicks>

- 手工发布的四件琐事：**定版本号 · 整理 CHANGELOG · 打 tag · 建 GitHub Release**
- **决策**（什么时候发）：留给人——只剩「要不要合这个 Release PR」
- **执行**（版本号 / changelog / tag / Release）：合并后全部自动完成

</v-clicks>

<v-click>

> 它刻意选择「Release PR」而非「每次提交即发版」——既保留了完全自动的版本推断，又留了一道随时可见、可审阅、可暂缓的**人工闸门**。

</v-click>

<!--
release-please 把发布的四件琐事全自动化，关键是把「决策」和「执行」分离：版本号由提交历史推断（执行自动），而「何时发」由人决定（决策保留）。这就是它区别于 semantic-release 的根本设计。
-->

---
transition: fade-out
---

# Conventional Commits 驱动版本

提交前缀决定版本号，取本次累积提交里的**最高等级**

| 提交前缀 | 版本影响 |
| --- | --- |
| `fix: ...` | **patch**（1.2.3 → 1.2.4） |
| `feat: ...` | **minor**（1.2.3 → 1.3.0） |
| `feat!: ...` / body 含 `BREAKING CHANGE:` | **major**（1.2.3 → 2.0.0） |
| `docs` / `chore` / `refactor` / `test` / `ci` | 默认不升版本，也不进 changelog |

<v-click>

> 若自上次发布起只有 `chore` / `docs` 等提交，则**不会产生 Release PR**；某次想指定版本，可在提交 body 写 `Release-As: 2.0.0` 覆盖推断。

</v-click>

<!--
版本号完全由 Conventional Commits 推断：fix 升 patch、feat 升 minor、带感叹号或 BREAKING CHANGE 升 major。杂项类型默认既不升版本也不进 changelog——这也解释了「合了好几个 PR 却没有 Release PR」的常见困惑：那些提交都是 chore/docs。
-->

---
transition: fade-out
---

# 核心机制：Release PR

扫描主干 → 维护一个 Release PR → 合并即发布

<v-clicks>

1. **创建**：主干出现 feat / fix / 破坏性提交，打开 Release PR（标题如 `chore(main): release 1.4.0`），带 `autorelease: pending`
2. **累积 / 刷新**：主干每来新提交，**同一个 PR 原地更新**——版本号可能从 patch 抬到 minor，changelog 随之重排
3. **合并 = 发布**：合并 Release PR，下次运行识别到「已合并的 pending PR」便执行发布
4. **收尾**：标签从 `pending` → `tagged` → `published`

</v-clicks>

<v-click>

> Release PR 是「下一个版本的预览与暂存区」，**合并它才是「按下发布键」**。

</v-click>

<!--
Release PR 是 release-please 的灵魂：它是「活的」，始终代表「假如现在发布会是什么样」。今天看到 1.3.1（只有 fix），明天合入一个 feat 后自动变成 1.4.0。它把「持续自动计算版本」和「人工决定发布时机」优雅解耦。
-->

---
transition: fade-out
---

# 合并 Release PR 后发生什么

版本文件随合并入主干，tag 与 Release 由**下一次运行**补上

<v-clicks>

1. **识别**：找到刚被合并、且带 `autorelease: pending` 的 Release PR
2. **打 tag**：单包默认 `v1.4.0`，monorepo 默认 `<component>-v1.4.0`
3. **建 Release**：基于该 tag 建 GitHub Release，正文取自 CHANGELOG 本版本条目
4. **翻标签**：`autorelease: pending` → `tagged` → `published`

</v-clicks>

<v-click>

> 时序要点：版本文件（`package.json` 等）的写回**在 PR 的 diff 里就完成了**，合并即并入主干；tag 与 Release 则是合并后的那次运行才补上。

</v-click>

<!--
合并 Release PR 本身只是「提交了一堆版本文件改动」，真正的发布动作发生在合并产生的 push 事件触发的下一次运行里。理解这个时序，就能解释「合并后没发布」——通常是那次运行没被触发。
-->

---
transition: fade-out
---

# 最小接入：一个工作流

单包 Node 项目跑通一次发布，只需一个文件

```yaml
# .github/workflows/release-please.yml
on:
  push:
    branches: [main]

permissions:
  contents: write        # 打 tag / 建 Release / 写回文件
  pull-requests: write   # 建 / 更新 Release PR

jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          release-type: node
```

<v-click>

> 这个工作流**每次 push 到 main 都会跑**；没有可发布提交时它「什么也不做」，不产生噪音。

</v-click>

<!--
release-type: node 让它知道去更新 package.json 并按 Node 生态惯例生成 changelog。权限两件套：contents:write 打 tag/写文件，pull-requests:write 建 PR，权限不足会导致 PR 建不出来。合入若干 feat/fix 后就会出现 Release PR。
-->

---
transition: fade-out
---

# manifest 模式：两个文件

为 monorepo 而生（单包也推荐）：一份配置集中管理所有包

<div v-click>

- **`release-please-config.json`**（配置）：包列表、release-type、插件、组合 / 独立 PR

```json
{ "packages": {
  "packages/core": { "release-type": "node" },
  "crates/engine": { "release-type": "rust" }
} }
```

</div>

<div v-click>

- **`.release-please-manifest.json`**（状态）：各包当前版本，是「上次发布」基准，发布后写回

```json
{ "packages/core": "1.8.0", "crates/engine": "0.2.0" }
```

</div>

<!--
manifest 模式用两个源码受控的文件管理所有包：config 是配置（有哪些包、用什么语言策略），manifest 是状态（每个包当前已发布的版本，是版本推断的基准）。同一仓库可多语言混排——core 用 node、engine 用 rust。路径 "." 代表仓库根。
-->

---
transition: fade-out
---

# 组合 PR vs 每包独立 PR

monorepo 配置里最关键的一个取舍

<v-clicks>

- **组合 PR**（默认，`separate-pull-requests: false`）：所有有变更的包**共用一个 Release PR**，合并一次多包同时发。适合发布节奏一致、想「一把梭」
- **每包独立 PR**（`separate-pull-requests: true`）：**每个包一个 PR**，可只合 core 的 PR 而暂不发 cli。适合各包节奏差异大、需独立控制发布时机

</v-clicks>

<v-click>

> 组合模式下可用 `group-pull-request-title-pattern` 自定义那个合并 PR 的标题。

</v-click>

<!--
这是 monorepo 最关键的取舍：想「多包齐发」用组合 PR，想「逐包发布」用独立 PR。两种模式下每个包仍各自打各自的 tag 与 Release，区别只在「合并动作的粒度」。
-->

---
transition: fade-out
---

# tag 前缀与 workspace 插件

多包要区分 tag，包间内部依赖要联动

<v-clicks>

- **tag 前缀**：monorepo 默认带组件前缀 `<component>-v1.2.3`（如 `core-v1.8.0`）；`include-component-in-tag: false` 回到 `v1.2.3`（多包会撞车）
- **`node-workspace` / `cargo-workspace` / `maven-workspace`**：升版本时联动内部依赖的版本约束与 lockfile
- **`linked-versions`**：把一组包版本**绑定同步**（类似 lerna 的 fixed 模式）
- **`sentence-case`**：把 changelog 里提交信息首字母大写

</v-clicks>

<!--
多包共存时 tag 必须区分是哪个包发的，所以默认带包前缀，去掉前缀只适合单包。workspace 插件解决「core 升版本，依赖它的 cli 的 package.json 约束也要跟着改」这类联动，在 plugins 数组里声明。
-->

---
transition: fade-out
---

# 发布后接续发包

用 `release_created` 输出门控后续 npm publish

```yaml
steps:
  - uses: googleapis/release-please-action@v4
    id: release
    with:
      release-type: node
  # 以下步骤仅在「本次确实发布了」时执行
  - uses: actions/checkout@v4
    if: ${{ steps.release.outputs.release_created }}
  - run: npm ci
    if: ${{ steps.release.outputs.release_created }}
  - run: npm publish
    if: ${{ steps.release.outputs.release_created }}
    env:
      NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

<v-click>

> `release_created` 为 true 只发生在**合并 Release PR** 的那次 push；monorepo 用 `releases_created`。

</v-click>

<!--
action 的输出是把「发布」与「发布后动作」串起来的关键。绝大多数 push 时 release_created 为 false，发包步骤被跳过；只有合并 Release PR、打完 tag/Release 那次才置为 true。其它输出还有 tag_name、version、body、paths_released 等。
-->

---
transition: fade-out
---

# GITHUB_TOKEN 的坑

默认 token 创建的事件**不触发下游工作流**

<v-clicks>

- **现象**：用默认 `GITHUB_TOKEN` 创建的 PR / tag / Release **不会触发其它工作流**（GitHub 防循环机制）
- **后果**：① Release PR 上跑不了你配置的 CI 检查；② 监听 tag / Release 事件的独立发布流水线不被触发
- **解法**：改用 **PAT** 或 **GitHub App token**，经 `token` 输入传入

</v-clicks>

<v-click>

> 例外：同一 job 内用 `release_created` 接续 `npm publish` **不受此限**——那是步骤门控，不依赖事件再触发。

</v-click>

<!--
这是接入时最容易踩的坑。默认 token 为防止工作流无限互相触发，其创建的事件不会触发下游。要让 Release PR 跑 CI、或让 tag 事件触发别的流水线，就得换 PAT 或 App token。但同一次运行内的步骤门控不受影响。
-->

---
transition: fade-out
---

# 常见坑速查

大多数问题都落在这几类

| 现象 | 原因 / 解法 |
| --- | --- |
| 一直没有 Release PR | 自上次发布起只有 `chore` / `docs`；或提交不符合 Conventional Commits |
| Release PR 上没有 CI 检查 | 默认 `GITHUB_TOKEN` 不触发下游 → 换 PAT / App token |
| 合并后没发布 | 需再有一次运行来打 tag / 建 Release，检查工作流是否被触发 |
| 想指定版本 | 提交 body 写 `Release-As: x.y.z`，或配 `release-as`（合并后删） |
| 非 GitHub 平台想用 | 不支持；GitLab / Bitbucket 请选 semantic-release |

<!--
这几类几乎覆盖日常所有疑问。最高频的是「没有 Release PR」——多半是提交都是非发版类型；以及「Release PR 没有 CI」——默认 token 的循环防护。本地想验证配置可用 CLI --dry-run --debug 干跑。
-->

---
transition: fade-out
---

# vs semantic-release / Changesets

核心区别：**版本意图从哪来** + **发布要不要人点头**

| 维度 | release-please | semantic-release | Changesets |
| --- | --- | --- | --- |
| 版本来源 | commit 推断 | commit 推断 | **手写 changeset 声明** |
| 发布触发 | **合并 Release PR** | **CI 上直接发**（无闸门） | 合并 Version Packages PR |
| 平台 | **仅 GitHub** | 多平台 | 主要 GitHub |
| 多语言 | **20+ 语言** | JS 为主 | JS / TS 生态 |
| monorepo | manifest 模式 | 需额外方案 | **一等公民** |

<!--
三者都做版本发布自动化，但发布触发模型截然不同。release-please 与 semantic-release 都从 commit 推断，区别在有没有 PR 闸门；Changesets 则靠贡献者手写 changeset 文件显式声明变更意图。平台上 release-please 仅 GitHub，semantic-release 多平台。
-->

---
transition: fade-out
---

# 选型一句话

没有绝对优劣，看你要「意图从哪来、发布谁点头」

<v-clicks>

- **release-please**：在 GitHub，想要「自动算版本 + 一道可审阅的发布闸门」，可能涉及多语言 / monorepo
- **semantic-release**：追求「合并到主干即自动发版」的极致 CI，或需要 GitLab 等非 GitHub 平台
- **Changesets**：JS / TS monorepo，希望**贡献者在 PR 里显式声明**「改动影响哪些包、升什么版本」

</v-clicks>

<v-click>

> 两条分界线：**版本意图**（commit 推断 vs 手写声明）与**发布是否要人点头**（PR 闸门 vs 自动发）。

</v-click>

<!--
选型就看两个问题。要 GitHub 上「可审阅的发布闸门 + 多语言」选 release-please；要「合并即自动发」选 semantic-release；要「贡献者显式声明 + JS monorepo」选 Changesets。开源库多人协作时，changeset 文件也是变更意图的书面记录。
-->

---
layout: center
class: text-center
---

# 小结

release-please：把「决定发版」压缩成「点一下 Merge」

<v-clicks>

- **定位**：Google、GitHub-native，用 Release PR 作发布闸门，从 Conventional Commits 推断版本
- **Release PR**：持续累积版本 + changelog，**合并才**打 tag / 建 Release
- **manifest 多包**：config + manifest 两文件，组合 PR 或每包独立 PR
- **CI**：release-please-action，`release_created` 门控后续 npm publish；默认 token 不触发下游
- **选型**：可审闸门→它，合并即发→semantic-release，显式声明→Changesets

</v-clicks>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/googleapis/release-please" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/engineering/release/release-please/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
一图流收束：定位、Release PR 机制、manifest 多包、CI 门控、选型对比。核心心智模型是——版本推断全自动，发布时机交回人手，合并 Release PR 就是按下发布键。配套笔记见文档图标链接。感谢观看。
-->
