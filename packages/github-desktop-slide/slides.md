---
theme: seriph
background: https://cover.sli.dev
title: GitHub Desktop — GitHub 官方的可视化 Git 客户端
info: |
  Presentation GitHub Desktop — GitHub 官方出品的免费开源 Git GUI，把 commit/branch/push/pull 变成可视化点击，并与 GitHub 的 PR/Issue/Fork 工作流深度集成。

  Learn more at [https://desktop.github.com](https://desktop.github.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🖥️</span>
</div>

<br/>

## GitHub Desktop — 官方可视化 Git 客户端

免费、开源；把 Git 操作变成点击，深度集成 GitHub 协作流

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/desktop/desktop" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 GitHub Desktop：GitHub 官方出品的免费、开源 Git 图形客户端。它把 commit、branch、push、pull 这些操作变成可视化的点击，最大的特色是和 GitHub 的 PR、Issue、Fork 工作流深度集成。主线：定位 → 界面 → 克隆与 Fork → 提交 → 部分提交 → 分支 → 改写历史 → 同步 → PR/Issue → 暂存 → 能力边界 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么

<v-clicks>

- ✅ **GitHub 官方**出品的 **Git 图形客户端（GUI）**
- ✅ **免费 + 开源**（仓库 desktop/desktop）
- ✅ 把 add / commit / push / pull / branch 变成**可视化点击**
- ✅ 与 GitHub 的 **PR / Issue / Fork** 工作流深度集成
- ✅ 仅 **Windows / macOS**（macOS 12+，Win10 64 位+，无 Linux）

</v-clicks>

<!--
GitHub Desktop 的定位：GitHub 官方出品的 Git 图形客户端，免费而且开源，仓库就叫 desktop slash desktop。它把命令行那些 add、commit、push、pull、branch 操作变成可视化点击，对新手特别友好。但真正让它区别于其它 Git 客户端的，是和 GitHub 的 PR、Issue、Fork 工作流深度集成。注意它只支持 Windows 和 macOS，官方不支持 Linux。
-->

---

# 界面四象限

<v-clicks>

- **Current Branch 下拉**：分支总入口（新建/切换/合并/对比）
- **Changes 标签**：当前待提交的改动（红删 / 黄改 / 绿增）
- **History 标签**：提交历史，右键可改写
- **提交信息区**：Summary / Description / co-author + Commit 按钮
- **Push / Pull 栏**：与远程同步

</v-clicks>

<div v-click class="mt-4 text-gray-400">

记住这四块，日常操作就全覆盖了

</div>

<!--
GitHub Desktop 的界面核心就四块。顶部的 Current Branch 下拉是分支总入口，新建、切换、合并、对比都在这。左侧 Changes 标签看当前待提交的改动，文件带颜色，红删黄改绿增。History 标签看提交历史，右键能做很多改写操作。左下角是提交信息区，填 Summary、Description、共同作者，最下面是提交按钮。顶部还有 Push、Pull 栏负责和远程同步。记住这四块就够用了。
-->

---

# 拿到仓库：克隆与 Fork

<v-clicks>

- **克隆**：File ▸ Clone repository，三个标签页
  - GitHub.com / GitHub Enterprise / URL → 选本地路径
- **本地已有库**：File ▸ Add local repository
- **Fork**：向无写权限的仓库推送时自动提示
  - 问"如何使用这个 fork"：贡献上游 / 自用 → 决定 PR 默认目标

</v-clicks>

<!--
怎么把一个仓库弄到本地。克隆走 File、Clone repository，弹窗有三个标签页：GitHub.com 列你有权限的仓库，GitHub Enterprise 是企业版，URL 可以手动粘地址，选好再指定本地路径。如果本地磁盘已经有 Git 仓库，用 Add local repository 纳入管理。Fork 很有意思：当你向一个没有写权限的仓库推送时，它会自动提示 Fork，然后问你打算怎么用这个 fork，是贡献给上游还是自己用，这个选择决定了之后 PR 默认推向哪里。
-->

---

# 提交：对应 add + commit

<v-clicks>

- Changes 里勾选要提交的文件（顶部复选框默认全选）
- 填 **Summary**（必填标题）+ **Description**（选填详情）
- 点 Description 角上图标加 **co-author**（共同作者）
- 点 **Commit to 分支名** 完成（仅本地）→ 再 **Push origin**

</v-clicks>

<div v-click class="mt-4">

```text
改文件 → 勾选 → 填 Summary → Commit to main → Push origin
```

</div>

<!--
提交是日常用得最多的，对应命令行的 add 加 commit。在 Changes 里勾选要提交的文件，顶部复选框默认全选，不想要的取消勾。然后填提交信息，Summary 是必填的简短标题，Description 是选填的详细说明。点 Description 角上的图标可以加共同作者。填好点 Commit to 分支名完成提交，注意这时只在本地，要再点 Push origin 才推到远程。
-->

---

# 部分提交：可视化的 add -p

<v-clicks>

- diff 视图里**逐行点选**要提交的改动（蓝高亮=纳入）
- 点掉某行的高亮 → 把它**排除**在这次提交外
- 一团混合改动 → 拆成多个干净的小提交
- 比命令行 `git add -p` 直观得多

</v-clicks>

<div v-click class="mt-4 p-3" style="border-left: 4px solid #3b82f6; background: rgba(59,130,246,0.08)">

💡 这是 GUI 相对命令行最爽的便利之一：改动**所见即所选**

</div>

<!--
部分提交是 GitHub Desktop 一个特别爽的功能，等价于命令行里很难记的 git add -p。在 diff 视图里，被蓝色高亮的行会进入提交，你点掉某一行的高亮就把它排除在这次提交外。这样就能把一团混合在一起的改动，拆成多个干净的、各自聚焦的小提交。比起命令行逐块敲 y 和 n，这里是所见即所选，直观太多了。
-->

---

# 分支管理

<v-clicks>

- **新建**：Current Branch ▸ New Branch（建好自动切过去）
- **切换**：下拉里点目标分支
- **发布**：本地新分支点 Publish branch 才推到 GitHub
- **删除**：Branch 菜单 ▸ Delete（有 PR 的删不掉）
- **切分支带未提交改动**：弹窗选 Leave（留原地）/ Bring（带过去）

</v-clicks>

<!--
分支操作都集中在 Current Branch 下拉。新建就点 New Branch，填名字，建好自动切过去。切换就在下拉里点目标分支。本地新建的分支要点 Publish branch 才会推到 GitHub。删除走 Branch 菜单的 Delete，注意有开放 PR 的分支删不掉。一个常见场景：切分支时还有没提交的改动，会弹窗让你选，Leave 是留在当前分支，Bring 是把改动带到新分支。
-->

---

# 改写历史：右键与拖拽

<v-clicks>

- **Amend**：改最近一次提交（信息或并入新改动）
- **Revert**：生成反向提交，**安全撤销已推送的**
- **Cherry-pick**：右键选分支，或**拖到 Current Branch 下拉**
- **Reorder / Squash**：History 里**拖动**重排 / 压合

</v-clicks>

<div v-click class="mt-4 p-3" style="border-left: 4px solid #f59e0b; background: rgba(245,158,11,0.08)">

⚠️ 官方提醒：**尽量别改写已推送的历史**；要撤销已推送内容用 **Revert**

</div>

<!--
GitHub Desktop 把不少高级操作做成了右键和拖拽，主要在 History 标签里。Amend 改最近一次提交，可以改信息或并入新改动。Revert 生成一个反向提交，是安全撤销已推送提交的方式。Cherry-pick 可以右键选目标分支，也可以直接把提交拖到 Current Branch 下拉上。Reorder 和 Squash 都靠拖动，重排顺序或者把多个提交压成一个。这里有条铁律：尽量别改写已经推送的历史，否则协作者要强推救火，要撤销已推送内容请用 Revert。
-->

---

# 与远程同步

<v-clicks>

- **Push origin**：推本地提交到远程（`git push`）
- **Pull origin**：拉远程更新（`git fetch` + 合并）
- **Fetch origin**：无可推/拉时仅检查远程有无更新
- **冲突**：列出冲突文件，可"在编辑器中打开"逐处解决

</v-clicks>

<div v-click class="mt-4 text-gray-400">

复杂冲突的精细处理，往往仍要回到编辑器或命令行

</div>

<!--
和远程同步主要三个按钮。Push origin 把本地提交推到远程，等于 git push。Pull origin 拉远程更新，等于 fetch 加合并。当没有提交可推可拉时，按钮会显示成 Fetch，只检查远程有没有更新。遇到合并冲突，GitHub Desktop 会列出冲突文件，可以在编辑器中打开逐处解决，解决完回来继续。但复杂冲突的精细处理，往往还是得回到编辑器或命令行。
-->

---

# 杀手锏：GitHub 协作流

<v-clicks>

- **发 PR**：推分支后 Preview Pull Request → Create Pull Request
- ⚠️ 真正填表（标题/描述/reviewer）**跳浏览器**在 GitHub 完成
- **建 Issue**：Repository ▸ Create Issue on GitHub（也跳浏览器）
- **检出 PR**：本地拉别人的 PR 跑 CI 检查，无需开浏览器

</v-clicks>

<!--
这是 GitHub Desktop 区别于普通 Git 客户端的核心价值，但有个关键点要记住：表单在浏览器里填。发 PR 时，把分支推上去后点 Preview Pull Request 看 diff，再点 Create Pull Request，这时会跳转浏览器到 GitHub 填标题、描述、选 reviewer。建 Issue 走 Repository 菜单的 Create Issue on GitHub，同样跳浏览器。还有一个很实用的：可以直接在本地检出别人的 PR 分支，跑 CI 检查看状态，这个不用开浏览器。
-->

---

# 暂存与能力边界

<v-clicks>

- **Stash**：右键 Changes 头部 Stash All Changes；**一次只能一组**，不能命名
- **仍需命令行/其它工具**：交互式 rebase、bisect、子模块、reflog
- **平台**：无 Linux 支持
- 抽象屏蔽细节 → 复杂场景仍要懂 Git 底层模型

</v-clicks>

<div v-click class="mt-4 text-gray-400">

定位清晰：覆盖 80% 日常 + GitHub 协作，高级场景交给命令行

</div>

<!--
说说暂存和能力边界。Stash 右键 Changes 头部选 Stash All Changes，但它一次只能存一组改动，不能像命令行那样存多份、命名。有些场景 GitHub Desktop 做不了，还得靠命令行或更专业的客户端：交互式 rebase、bisect 二分查 bug、子模块精细操作、reflog 找回误删提交。平台上也没有 Linux。而且 GUI 屏蔽了底层细节，遇到复杂情况还是要懂 Git 的暂存区、HEAD、对象模型。它的定位很清晰：覆盖百分之八十的日常加上 GitHub 协作，高级场景交给命令行。
-->

---
layout: center
class: text-center
---

# 总结

GitHub Desktop = **可视化 Git** + **GitHub 协作流**

新手友好 · 部分提交直观 · PR/Issue/Fork 一键发起 · 高级操作右键拖拽

<div class="mt-8 text-gray-400">

把 80% 日常做到极简；交互式 rebase、bisect 等仍归命令行

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://docs.github.com/en/desktop" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
总结一下。GitHub Desktop 的本质是两件事：可视化的 Git，加上 GitHub 协作流。它新手友好，部分提交特别直观，PR、Issue、Fork 都能一键发起，amend、cherry-pick、squash 这些高级操作也做成了右键和拖拽。它的取舍很明确：把百分之八十的日常操作做到极简，而交互式 rebase、bisect 这些专业场景仍然归命令行。对新手入门 Git 协作，或者想少敲命令的人，它都是很好的选择。
-->
