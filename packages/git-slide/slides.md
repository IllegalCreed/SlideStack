---
theme: seriph
background: https://cover.sli.dev
title: Git — 分布式版本控制的事实标准
info: |
  Presentation Git — 由 Linus Torvalds 为 Linux 内核创建的分布式版本控制系统，快照模型、本地操作、廉价分支。

  Learn more at [https://git-scm.com](https://git-scm.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🌿</span>
</div>

<br/>

## Git — 分布式版本控制的事实标准

由 Linus Torvalds 为 Linux 内核创建；快照模型、本地操作、廉价分支

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/git/git" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Git：由 Linus Torvalds 为 Linux 内核创建的分布式版本控制系统，今天近 94% 的开发者在用。主线：定位 → 三区模型 → 快照 → 分支 → 合并与变基 → 撤销 → 远程 → 内部原理 → 工具 → 工作流 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么

<v-clicks>

- ✅ **分布式（DVCS）**：每个克隆都是完整仓库，离线可提交 / 查史 / 切分支
- ✅ **快照而非差异**：每次提交是一整棵文件树的快照
- ✅ **近乎全本地**：提交 / 分支 / 历史无需联网
- ✅ Stack Overflow 2025：约 **94%** 开发者在用

</v-clicks>

<!--
Git 的定位：分布式版本控制。和集中式的 SVN 最大的区别是，每个克隆都是一个完整仓库，带全部历史，离线就能提交、查历史、切分支。它记录的是快照而不是差异。绝大多数操作都在本地完成，所以快。SO 2025 调查里约 94% 的人在用，是绝对的事实标准。
-->

---

# 三区模型

<v-clicks>

- **工作区** Working Directory：你正在改的文件
- **暂存区** Staging / Index：下一次提交的草稿快照
- **仓库** Repository：已落盘的提交历史

</v-clicks>

<div v-click class="mt-6">

```bash
git add <file>       # 工作区 → 暂存区
git commit -m "..."  # 暂存区 → 仓库
```

</div>

<div v-click class="mt-4 text-gray-400">

暂存区让你精确构造每一次提交——`git add -p` 可分块暂存

</div>

<!--
理解 Git 的钥匙是三个区域：工作区是你正在改的真实文件；暂存区是下一次提交的草稿；仓库是已经落盘的历史。add 把改动放进暂存区，commit 把暂存区固化成一次提交。暂存区的存在，让你能精确挑选这次提交包含哪些改动，add -p 可以逐块选择。
-->

---

# 快照，而非差异

<v-clicks>

- 每次提交 = 一整棵文件树的**快照**（未变的文件指向旧对象，不重复存）
- 对象名 = 内容的 **SHA 哈希**（内容寻址）
- 同内容必同名 → 天然去重；任何改动都改变哈希 → 历史可校验、难篡改

</v-clicks>

<!--
很多版本系统存的是"每个文件相对上一版的差异"。Git 不一样，它存的是快照：每次提交记录整棵文件树的样子，没变的文件就直接指向上一次的对象，不重复存。每个对象用它内容的 SHA 哈希命名，这叫内容寻址。带来两个特性：相同内容只存一份，天然去重；任何改动都会改变哈希，所以历史可以校验、很难被偷偷篡改。
-->

---

# 分支：廉价的指针

<v-clicks>

- 分支只是一个**指向提交的可变指针**（41 字节文件）
- 新建 / 切换 / 合并几乎零成本
- `HEAD` = "我现在在哪个分支"

</v-clicks>

<div v-click class="mt-6">

```bash
git switch -c feature   # 新建并切换
git switch main         # 切回
git branch -d feature   # 删除
```

</div>

<!--
Git 的分支为什么便宜？因为一个分支本质就是一个 41 字节的文件，里面存一个提交的哈希，是个可变指针。所以新建、切换、合并都几乎零成本。HEAD 是一个特殊指针，表示你现在在哪个分支上。2.23 之后推荐用语义更清晰的 switch 来切分支。
-->

---

# 合并 vs 变基

<v-clicks>

- **merge**：保留真实分叉历史，生成有两个父的合并提交
- **rebase**：把提交摘下重放到目标顶端，得到**线性历史**

</v-clicks>

<div v-click class="mt-4 p-3" style="border-left: 4px solid #f59e0b; background: rgba(245,158,11,0.08)">

⚠️ **黄金法则**：已推送、别人可能基于它工作的公共提交，**绝不要 rebase**

</div>

<!--
把两条分支并到一起有两种思路。merge 保留真实的分叉历史，生成一个有两个父提交的合并节点，可追溯。rebase 则把你的提交摘下来，重新播放到目标分支顶端，得到干净的线性历史，代价是重写了提交。这里有条黄金法则：已经推送、别人可能基于它工作的公共提交，绝对不要 rebase，否则会让协作者的历史分叉、被迫强推救火。
-->

---

# 撤销三档

<v-clicks>

- `git restore <file>`：丢弃工作区改动
- `git restore --staged <file>`：取消暂存（保留改动）
- `git reset --soft｜--mixed｜--hard`：回退指针（保留暂存 / 保留工作区 / **全丢**）
- `git revert <commit>`：生成反向提交，**安全撤销已推送的提交**

</v-clicks>

<div v-click class="mt-4 text-gray-400">

reset 改写历史只用于本地未推送；已推送用 revert

</div>

<!--
撤销按影响范围分档。restore 丢弃工作区改动；加 --staged 是取消暂存、保留改动。reset 移动分支指针，soft 保留暂存和工作区，mixed 只保留工作区，hard 全部丢弃、不可逆。revert 不一样，它新增一个反向提交，不改写历史，所以是撤销已推送提交的安全方式。记住：reset 只用于本地没推送的，推送过的用 revert。
-->

---

# 远程协作

<v-clicks>

- `git fetch`：只下载远程更新，不动工作区（安全）
- `git pull`：= fetch + merge（可配 `--rebase`）
- `git push -u origin main`：首推 + 建立上游跟踪

</v-clicks>

<div v-click class="mt-6 text-gray-400">

`fetch` 只更新 `origin/main` 跟踪分支；`pull` 会顺带合并到本地

</div>

<!--
远程协作三个核心命令。fetch 是安全的，只把远程的更新下载到 origin/main 这种跟踪分支，不碰你的工作区。pull 等于 fetch 加 merge，会顺带合并到本地，也可以配成 rebase 保持线性。push -u 是首次推送并建立上游跟踪关系，之后裸 push、pull 就知道推拉哪里。
-->

---

# 内部原理：四种对象

<v-clicks>

- **blob**：一个文件的内容
- **tree**：一个目录（名字 → blob/tree）
- **commit**：一棵 tree 的快照 + 父提交 + 作者 + 信息
- **tag**：附注标签对象

</v-clicks>

<div v-click class="mt-6">

```bash
git cat-file -p HEAD   # 看 commit：tree / parent / author
```

</div>

<!--
往下挖一层，Git 本质是个内容寻址的键值库，只有四种对象。blob 存一个文件的内容，不含文件名。tree 存一个目录，是一组名字到对象的映射。commit 是一棵 tree 的快照，加上父提交、作者和提交信息。tag 是附注标签对象。用 cat-file -p 可以直接把这些对象打印出来看。理解了这四种对象，就理解了 Git 的本质。
-->

---

# 实用工具

<v-clicks>

- `git stash`：临时收起改动，切分支救火
- `git bisect`：二分定位引入 Bug 的提交（可 `bisect run` 全自动）
- `git worktree`：同仓库多分支检出到不同目录
- `git cherry-pick`：把某提交搬到当前分支
- `git reflog`：HEAD 移动史，误删提交的"后悔药"

</v-clicks>

<!--
几个高频实用工具。stash 把没提交的改动临时收起，干活干一半要切分支时用。bisect 用二分法定位是哪个提交引入了 Bug，还能配脚本全自动跑。worktree 让同一个仓库的多个分支同时检出到不同目录，免去反复切换。cherry-pick 把某个提交复制到当前分支。reflog 记录 HEAD 的每次移动，是误删提交后找回的总后悔药。
-->

---

# 分支工作流

<v-clicks>

- **Git Flow**：main / develop + feature / release / hotfix，适合版本化产品
- **GitHub Flow**：main + 短命 feature 分支，靠 PR，合并即部署
- **Trunk-Based**：频繁合进单一主干，feature flag 控未完成功能

</v-clicks>

<div v-click class="mt-6 text-gray-400">

现代前端多用 GitHub Flow / Trunk-Based：主干常绿、分支短命

</div>

<!--
团队怎么用分支，有几种成熟模式。Git Flow 有 main、develop 加上 feature、release、hotfix 多条长期分支，适合有明确发布周期的产品。GitHub Flow 简单，只有 main 加短命的 feature 分支，靠 PR 合并，合并即部署。Trunk-Based 是所有人频繁合进单一主干，用 feature flag 控制没做完的功能。现代前端项目多用后两种，强调主干常绿、分支短命。
-->

---
layout: center
class: text-center
---

# 总结

Git = **快照模型 + 廉价分支 + 分布式**

三区模型理解暂存区 · merge/rebase 取舍 · reset/revert 撤销 · 对象模型看本质

<div class="mt-8 text-gray-400">

学习曲线陡，但理解了三区与对象模型就豁然开朗

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://git-scm.com/doc" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
总结一下。Git 的核心是三件事：快照模型、廉价分支、分布式。掌握 Git，关键是理解三区模型搞懂暂存区，分清 merge 和 rebase 的取舍，会用 reset 和 revert 撤销，再往下看懂对象模型就理解了本质。它学习曲线确实陡，但一旦理解了三区和对象模型，很多东西就豁然开朗了。
-->
