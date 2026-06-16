---
theme: seriph
background: https://cover.sli.dev
title: GitKraken — 可视化的商业旗舰 Git 客户端
info: |
  Presentation GitKraken — Axosoft 出品的跨平台商业 Git GUI，标志性可视化提交图、拖拽操作、内置冲突编辑器、集成终端与 Undo/Redo。

  Learn more at [https://www.gitkraken.com](https://www.gitkraken.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🦑</span>
</div>

<br/>

## GitKraken — 可视化的商业旗舰 Git 客户端

可视化提交图 · 拖拽即操作 · 内置冲突编辑器 · 集成终端 · 一键 Undo

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://help.gitkraken.com/gitkraken-desktop/gitkraken-desktop-home/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
今天聊 GitKraken：Axosoft 出品的跨平台商业 Git GUI 客户端。它的招牌是把仓库画成可视化提交图，合并、变基都靠拖拽完成，还内置冲突编辑器、集成终端和一键 Undo。主线：定位 → 界面三区 → 提交图拖拽 → 交互式变基 → 暂存提交 → 冲突与 Undo → 集成与团队 → Profiles 与跨平台 → 付费与 AI → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么

<v-clicks>

- 🦑 **商业旗舰 GUI**：Axosoft 出品，付费 / 团队定位
- 🎨 **可视化提交图**：把仓库画成清晰的 DAG
- 🖱️ **拖拽即操作**：合并 / rebase 全靠拖
- 🌍 **真全平台**：Win / macOS / Linux 原生
- 🔌 深度集成 GitHub / GitLab / Bitbucket / Jira

</v-clicks>

<!--
GitKraken 的定位很清晰：它是一个商业的旗舰级图形客户端，由 Axosoft 出品，走付费和团队路线。区别于命令行的核心卖点有四个：把仓库画成可视化的提交图；合并、变基这些操作靠拖拽完成；它是真正的全平台，连 Linux 都有原生包，这点压过不上 Linux 的 GitHub Desktop；以及深度集成各大托管平台和 Jira。
-->

---

# 界面三大区

<v-clicks>

- **左侧面板**：Local / Remote / PR / Issues / Tags / Stashes / Worktrees
- **中央提交图**：DAG —— 提交为行、分支为列、连线表父子关系
- **右侧提交面板**：Unstaged → Staged → 提交信息

</v-clicks>

<div v-click class="mt-6 text-gray-400">

顶部工具栏：Undo · Redo · Pull · Push · Branch · Stash · Pop

</div>

<!--
界面分三大区，理解它就理解了 GitKraken 的工作方式。左侧面板列出本地分支、远程、PR、issue、标签、stash、worktree。中央是灵魂——提交图，把仓库画成有向无环图，提交是行，分支是列，连线表示父子和合并关系。右侧是提交面板，从上到下是未暂存、已暂存、提交信息。顶部工具栏放高频按钮，Undo、Redo、拉取、推送、建分支、stash 这些。
-->

---

# 提交图：拖拽即操作

<v-clicks>

- **建分支**：右键提交 →「Create branch here」
- **检出**：双击分支标签
- **合并 / rebase**：把源分支**拖到**目标分支，松手选 ff / merge / rebase
- 右键游离提交可「Rebase onto this commit」

</v-clicks>

<div v-click class="mt-4 p-3" style="border-left: 4px solid #f59e0b; background: rgba(245,158,11,0.08)">

⚠️ 拖拽虽便捷，底层仍是真实 Git——公共提交别 rebase 的黄金法则依旧适用

</div>

<!--
提交图本身就是交互面。建分支就右键某个提交，选 Create branch here。检出分支双击标签就行。最有特色的是合并和变基：把源分支直接拖到目标分支上，松手会弹出菜单，按两个分支的关系给你 fast-forward、merge 或 rebase 选项。右键一个游离的提交还能 rebase onto this commit。但要提醒：拖拽只是换了操作方式，底层依然是真实的 Git，合并会产生合并提交、rebase 会改写历史，已推送的公共提交不要 rebase 这条黄金法则依然适用。
-->

---

# 交互式变基：图形化 rebase -i

<v-clicks>

- 命令行要在文本编辑器改 `pick/squash`，这里**拖拽重排**
- 四种动作：**Pick(P)** · **Reword(R)** · **Squash(S)** · **Drop(D)**
- **Reset 按钮**：放弃 setup 改动重来

</v-clicks>

<div v-click class="mt-4 text-gray-400">

限制：合并提交不支持；GitKraken 里启动的 rebase 必须在 GitKraken 里收尾

</div>

<!--
交互式变基是 GitKraken 把命令行体验图形化的典型。命令行的 git rebase -i 要在文本编辑器里改 pick、squash 这些关键字，GitKraken 让你直接拖拽提交行重排。四种动作都有快捷键：Pick 保持原样，Reword 改提交信息，Squash 并入父提交，Drop 删除。还有个 Reset 按钮可以放弃整个 setup 重来。两个限制要记住：源分支上的合并提交不支持交互式变基；而且在 GitKraken 里启动的 rebase 必须在 GitKraken 里完成，不能切到命令行收尾。
-->

---

# 暂存、提交与 diff

<v-clicks>

- **行级 / 块级暂存**：diff 里右键「Stage selected lines」或对 hunk 操作
- **//WIP 节点**：提交图里访问当前未提交改动
- **协作者**：`Co-authored-by: Name <email>` 多行署名
- **diff 三模式**：Hunk / Inline / Split，外加 History + Blame

</v-clicks>

<!--
暂存和提交也很精细。除了整文件暂存，还能在 diff 里高亮几行右键做行级暂存，或对单个 hunk 块级暂存，把混合改动拆成干净提交。提交图里那个 //WIP 节点代表当前未提交的改动。提交信息支持 Co-authored-by 多行写法标注协作者。diff 视图有三种模式：Hunk 只看变更块、Inline 在完整文件里看、Split 左右并排，还配了文件历史和 Blame 逐行着色。
-->

---

# 招牌：内置冲突编辑器 + Undo

<v-clicks>

- **内置 Merge Tool**：复选框逐行从两侧挑选，免外部工具
- **Auto-resolve with AI**：带置信度的冲突解决方案（付费）
- **Undo/Redo** (`Ctrl/Cmd+Z`)：撤销 commit / checkout / 删分支 / reset / rebase

</v-clicks>

<div v-click class="mt-4 p-3" style="border-left: 4px solid #ef4444; background: rgba(239,68,68,0.08)">

❌ Push / Pull / Fetch **不可** Undo——网络操作仍需 reflog / 远程层面处理

</div>

<!--
这两个是 GitKraken 的招牌。一是内置的合并冲突编辑器，出冲突时点冲突文件打开 Merge Tool，用复选框逐行从我方和对方挑选，不用配外部 mergetool；付费版还能 Auto-resolve with AI 给带置信度的方案。二是 Undo/Redo，一键 Ctrl 加 Z 就能撤销最近一个本地操作——提交、切分支、删分支、reset、rebase 都能回退，这是命令行需要 reflog 手动救场、多数免费 GUI 都没有的安全网。但注意一条红线：push、pull、fetch 这些网络操作不能用 Undo 撤销，得靠 reflog 或远程层面处理。
-->

---

# 集成、Workspaces 与 Launchpad

<v-clicks>

- **托管集成**：GitHub / GitLab（MR）/ Bitbucket / Azure DevOps
- **issue**：Jira / Trello / 各平台 Issues
- **PR**：拖分支即可创建，合并支持 merge / squash / rebase
- **Workspaces**：多仓库分组（Cloud 跨设备共享 vs Local）
- **Launchpad**：跨仓库统一看 PR / Issue / WIP

</v-clicks>

<!--
GitKraken 的集成很深。Git 托管支持 GitHub、GitLab、Bitbucket、Azure DevOps，GitLab 的合并请求叫 MR。issue 追踪支持 Jira、Trello 和各平台自己的 Issues。PR 可以直接拖一个分支到另一个分支来创建，合并时支持普通 merge、squash 和 rebase 三种方式。再往上是团队能力：Workspaces 把多个仓库分组管理，Cloud Workspace 能跨设备同步和团队共享，Local 只在本机；Launchpad 则跨仓库把 PR、issue、进行中的工作汇总到一处看。
-->

---

# Profiles 与真全平台

<v-clicks>

- **Profiles**：一键切换「工作 / 个人」身份
- 隔离 name/email · 集成账号 · UI 主题 · 标签页（**付费**）
- **Linux 全格式**：`.deb` / `.rpm` / `.tar.gz` / Snap / Flatpak
- 还支持 **WSL 2**；集成终端带 Git 命令自动补全

</v-clicks>

<!--
两个差异化点。Profiles 解决多身份问题：一个 Profile 隔离 Git 身份、集成账号、UI 主题和打开的标签页，右上角一键切换工作和个人身份，命令行得手改 gitconfig，不过多 Profile 是付费功能。另一个是真正的全平台，尤其 Linux 提供 deb、rpm、tar.gz、Snap、Flatpak 全套格式包，还支持 WSL 2，这是它压过 GitHub Desktop 这类不上 Linux 客户端的地方；内置的集成终端跑 git 命令时还带自动补全，提交图实时刷新。
-->

---

# 付费边界与 GitKraken AI

<v-clicks>

- **免费版仅本地 + 公共远程**——**私有仓库需 Pro+**
- 付费才有：多 Profile · Cloud Workspace · 自托管集成 · 完整 AI
- **AI**：生成 commit message / PR、Explain Commits、冲突 Auto-resolve

</v-clicks>

<div v-click class="mt-4 text-gray-400">

与「完全免费」的 GitHub Desktop / Sourcetree 的最大商业差异

</div>

<!--
最后说商业边界，这是 GitKraken 区别于免费客户端的关键。免费版只能连本地仓库和公共远程仓库，私有仓库必须 Pro 及以上才能用，这是最大的付费墙。其他付费功能还有多 Profile、Cloud Workspace、自托管平台集成、完整的 AI。AI 能力包括生成提交信息和 PR 描述、Explain Commits 用自然语言解释改动、以及冲突的 Auto-resolve。这个付费模式正是它和完全免费的 GitHub Desktop、Sourcetree 最大的商业差异。
-->

---
layout: center
class: text-center
---

# 总结

GitKraken = **可视化提交图 + 拖拽操作 + 商业团队定位**

内置冲突编辑器 · 一键 Undo · 集成终端 · 真 Linux 原生

<div class="mt-8 text-gray-400">

便捷强大但有付费墙；私有仓库与团队协作要 Pro+

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://www.gitkraken.com" target="_blank" class="slidev-icon-btn">
    <carbon:launch />
  </a>
</div>

<!--
总结一下。GitKraken 的核心是三件事：可视化提交图、拖拽操作、商业团队定位。它的差异化亮点是内置合并冲突编辑器、一键 Undo、集成终端，以及真正的 Linux 原生支持。它确实便捷强大，把很多 Git 操作的心智负担降下来了，但有明显的付费墙——私有仓库和团队协作功能都需要 Pro 及以上订阅。如果你做开源、或者愿意为顺手的 GUI 付费，它是很强的选择。
-->
