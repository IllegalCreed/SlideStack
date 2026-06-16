---
theme: seriph
background: https://cover.sli.dev
title: Sourcetree — 免费的 Git / Mercurial 图形客户端
info: |
  Presentation Sourcetree — Atlassian 出品的免费 Git/Mercurial GUI，可视化暂存、提交、分支与交互式变基，与 Bitbucket 深度集成。

  Learn more at [https://www.sourcetreeapp.com](https://www.sourcetreeapp.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🌲</span>
</div>

<br/>

## Sourcetree — 免费的 Git / Mercurial 图形客户端

Atlassian 出品；可视化暂存 / 提交 / 分支 / 交互式变基，与 Bitbucket 深度集成

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://www.sourcetreeapp.com" target="_blank" class="slidev-icon-btn">
    <carbon:launch />
  </a>
</div>

<!--
今天聊 Sourcetree：Atlassian 出品的免费 Git 和 Mercurial 图形客户端。主线：定位 → 界面 → 账户与 Git → 暂存提交 → 同步合并 → 交互式变基 → 储藏拣选撤销 → 自定义操作 → 与同类对比 → 总结。它的关键词是免费、双 VCS、Bitbucket 集成、可视化交互式变基。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么

<v-clicks>

- 🌲 **Atlassian 出品的免费 GUI**：个人 / 商用都免费，无付费墙
- ✅ **同时支持 Git 与 Mercurial**：少数仍原生支持 Hg 的主流客户端
- ✅ **macOS / Windows**：注意——**不支持 Linux**
- ✅ **闭源专有**：无公开源码，遇 Bug 等官方修
- ✅ 把暂存 / 提交 / 分支 / 变基搬进可视化界面

</v-clicks>

<!--
Sourcetree 的定位：Atlassian 出品的免费图形客户端，个人和商用都免费。它同时支持 Git 和 Mercurial，是现在少数还原生支持 Mercurial 的主流 GUI。平台只有 macOS 和 Windows，不支持 Linux，这点要记住。它是闭源专有软件。核心价值是把命令行的暂存、提交、分支、变基操作搬进直观界面。
-->

---

# 三栏界面

<v-clicks>

- **书签 / 标签栏**（顶部）：在多个仓库间切换
- **工具栏**（上方）：按钮代替命令行，Commit / Pull / Push…
- **侧边栏**（左侧）：文件状态 / 分支 / 标签 / 远程 / 储藏 / 子模块
- **历史 / 差异**（主区）：提交图谱 + 逐行 diff

</v-clicks>

<div v-click class="mt-6 text-gray-400">

日常入口是侧边栏顶部的 **File Status**：勾选文件入暂存区

</div>

<!--
进了仓库是经典三栏加顶部书签布局。顶部书签栏在多个仓库之间切换，每个仓库一个标签。上方工具栏用按钮代替命令行。左侧侧边栏列出当前仓库的关键信息：文件状态、分支、标签、远程、储藏、子模块。主区域是历史图谱和代码差异。日常最常用的入口是侧边栏顶部的 File Status，在这里勾选文件进暂存区。
-->

---

# 账户与 Git 引擎

<v-clicks>

- **内置 Git（Embedded）**：开箱即用，无需系统装 Git
- **系统 Git（System）**：想统一版本时切换
- **账户托管**：可挂 Bitbucket / GitHub / GitLab，一键克隆
- 远程来源：`Clone`（git clone）/ `Create`（git init）/ `Add`（导入本地仓库）

</v-clicks>

<div v-click class="mt-4 text-gray-400">

SSH 在 Preferences 里加载密钥；Windows 默认走 PuTTY，可切 OpenSSH

</div>

<!--
Sourcetree 自带一份内置 Git，开箱即用，机器上不装 Git 也能跑。如果已经装了想统一版本，可以在偏好里切到系统 Git。要拉私有仓库，在 Accounts 里挂 Bitbucket、GitHub 或 GitLab 账户，多用 OAuth 或令牌，挂上后就能一键克隆。三种仓库来源：Clone 填 URL 克隆，Create 新建空仓库，Add 把本地已有仓库导进来管理。SSH 在偏好里加载密钥。
-->

---

# 精细暂存与提交

<v-clicks>

- 在 **File Status** 勾选文件 → 进暂存区
- 也可按 **代码块（Hunk）/ 单行** 暂存（= `git add -p`）
- 反向 `Discard` 丢弃改动（**不可逆**）
- 底部信息框写说明 → **Commit**

</v-clicks>

<div v-click class="mt-4 p-3" style="border-left: 4px solid #f59e0b; background: rgba(245,158,11,0.08)">

⚠️ `Amend last commit` = `git commit --amend`，**已推送的慎用**（改写历史）

</div>

<!--
暂存是 Sourcetree 的强项。在 File Status 里勾选文件进暂存区，更精细的是可以按代码块甚至单行暂存，对应命令行的 git add -p，让你精确构造每一次提交。反向操作是 Discard，丢弃改动，注意不可逆。然后在底部信息框写提交说明，点 Commit。提交框里有个 Amend last commit 开关，等于 git commit --amend，把改动并进上一条提交，但它改写历史，已经推送的提交要慎用。
-->

---

# 同步与合并

<v-clicks>

- **Fetch**：只下载远程更新，不动工作区（安全）
- **Pull**：= Fetch + Merge，合并进当前分支
- **Push**：弹窗勾选本地分支与目标远程分支
- **Branch**：新建分支；侧边栏 **双击** 切换
- **Merge**：checkout 目标分支 → 右键源分支合入

</v-clicks>

<div v-click class="mt-3 text-gray-400">

冲突标红 → 右键 **Resolve Conflicts**，选我方 / 对方或外部工具

</div>

<!--
同步三个按钮。Fetch 只把远程更新下载到跟踪分支，不动工作区，是安全的。Pull 等于 Fetch 加 Merge，会合并进当前分支。Push 弹窗里勾选要推的分支。分支操作用 Branch 按钮新建，侧边栏双击分支名就能切换。合并是先 checkout 到目标分支，再右键源分支选 Merge into current。如果有冲突，冲突文件会标红，右键 Resolve Conflicts，可以解决为我方、对方，或打开外部合并工具。
-->

---

# 招牌：可视化交互式变基

<v-clicks>

- 右键提交 → **Rebase children interactively**
- **Squash**：拖一行到上一行之上
- **Reword**：双击描述直接改
- **Reorder**：上下拖拽调整顺序
- **Edit / Delete**：暂停修补 / 删除提交

</v-clicks>

<div v-click class="mt-3 p-3" style="border-left: 4px solid #f59e0b; background: rgba(245,158,11,0.08)">

⚠️ 黄金法则：只对**本地、未推送**的提交做变基

</div>

<!--
这是 Sourcetree 相对命令行最直观的招牌能力。右键某条提交选 Rebase children interactively，弹出重排与修订窗口。要合并提交，把一行拖到上一行之上就是 squash。要改提交信息，双击描述直接编辑就是 reword。要调顺序，上下拖拽就是 reorder。还能 edit 暂停修补、delete 删除提交。把 rebase -i 的心智门槛降到最低。但要守黄金法则：只对本地、还没推送的提交做变基，否则会让协作者历史分叉。
-->

---

# 储藏 · 拣选 · 撤销

<v-clicks>

- **Stash**：临时收起改动切分支救火；Stashes 节点 Apply / Pop
- **Cherry Pick**：右键提交，把改动搬到当前分支
- **Reset**：右键提交回退指针，Soft / Mixed / **Hard（丢工作区）**
- **Reverse commit**：生成反向提交，安全撤销已推送的提交（= `git revert`）

</v-clicks>

<!--
几个高频操作。Stash 把没提交的改动临时收起，干活一半要切分支救火时用，之后在侧边栏 Stashes 节点 Apply 或 Pop 取回。Cherry Pick 右键某提交，把它的改动复制到当前分支。Reset 右键某提交回退分支指针，有 Soft、Mixed、Hard 三档，Hard 会丢工作区改动要小心。Reverse commit 生成一个反向提交来安全撤销已经推送的提交，对应 git revert。
-->

---

# 自定义操作 Custom Actions

<v-clicks>

- GUI 没覆盖的命令，自己包装成菜单项
- `Preferences → Custom Actions → Add`
- 填菜单名 + 脚本 + 参数（可选内置 / 系统 Git）
- 占位符：`$SHA`（选中提交）、`$REPO`（仓库路径）

</v-clicks>

<div v-click class="mt-4">

```bash
# 例：把当前提交推到备份远程
git push backup $SHA
```

</div>

<!--
Sourcetree 的可扩展点是 Custom Actions。GUI 没覆盖的命令可以自己包装成右键菜单项。在偏好的 Custom Actions 里点 Add，填菜单名、要跑的脚本和参数，脚本可选内置 Git 或系统 Git。参数支持占位符，比如 $SHA 是当前选中的提交哈希，$REPO 是仓库根路径，把上下文传给脚本。配置存在 actions.plist 里。这弥补了图形界面命令不全的短板。
-->

---

# 与同类怎么选

<v-clicks>

- **vs GitKraken**：GitKraken 图谱更炫、跨 Linux、私有仓库要付费；Sourcetree 全免费、有 Mercurial
- **vs GitHub Desktop**：GH Desktop 更简、绑 GitHub；Sourcetree 功能更全、绑 Atlassian
- **选 Sourcetree 的理由**：Bitbucket / Jira 团队、要 Mercurial、要零成本全功能

</v-clicks>

<!--
怎么在同类里选。和 GitKraken 比，GitKraken 的提交图谱更炫、支持 Linux，但私有仓库要付费；Sourcetree 完全免费，还支持 Mercurial。和 GitHub Desktop 比，GitHub Desktop 更简单、和 GitHub 绑得紧；Sourcetree 功能更全、和 Atlassian 生态绑定。所以选 Sourcetree 的典型理由是：你在 Bitbucket 或 Jira 团队、需要 Mercurial、或者想要零成本的全功能客户端。
-->

---

# 局限与短板

<v-clicks>

- ❌ **不支持 Linux**：只有 macOS / Windows
- ❌ **闭源**：社区无法贡献，Bug 只能等官方
- ⚠️ **大仓库偏卡**：历史图谱刷新不如 GitKraken / Fork
- ⚠️ **更新慢**：两平台版本号长期不一致

</v-clicks>

<div v-click class="mt-4 text-gray-400">

定位清晰：免费、易上手、Atlassian 集成，够用就是最优解

</div>

<!--
也要看短板。不支持 Linux，只有 macOS 和 Windows。闭源，社区没法贡献，遇到 Bug 只能等官方修。在巨型仓库、大量分支下历史图谱刷新会卡，性能不如 GitKraken 和 Fork。更新节奏慢，两个平台版本号长期对不齐，部分老 Bug 长期存在。但它的定位很清晰：免费、易上手、和 Atlassian 集成好，对很多团队来说够用就是最优解。
-->

---
layout: center
class: text-center
---

# 总结

Sourcetree = **免费 + 双 VCS + 可视化变基 + Atlassian 集成**

精细暂存看 File Status · 拖拽完成交互式变基 · Custom Actions 补命令

<div class="mt-8 text-gray-400">

Bitbucket / Mercurial 团队的顺手之选；要 Linux 或极致图谱看 GitKraken

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://confluence.atlassian.com/get-started-with-sourcetree" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
总结一下。Sourcetree 的核心是四件事：免费、同时支持 Git 和 Mercurial、可视化的交互式变基、和 Atlassian 生态集成。用好它，关键是 File Status 里做精细暂存，拖拽完成交互式变基，用 Custom Actions 补上 GUI 没有的命令。它是 Bitbucket 和 Mercurial 团队的顺手之选；如果你要 Linux 支持或极致的提交图谱，再考虑 GitKraken。
-->
