---
theme: seriph
background: https://cover.sli.dev
title: Jujutsu — Git 兼容的新一代版本控制
info: |
  Presentation Jujutsu (jj) — 以 Git 为后端、却重构了工作流的新一代 VCS：工作区即提交、无暂存区、自动快照、一等冲突、operation log。

  Learn more at [https://jj-vcs.github.io/jj/latest/](https://jj-vcs.github.io/jj/latest/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🥋</span>
</div>

<br/>

## Jujutsu — Git 兼容的新一代版本控制

命令行叫 jj：以 Git 为后端，却重构了工作流——工作区即提交、无暂存区、一等冲突

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/jj-vcs/jj" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Jujutsu，命令行工具叫 jj。它由 Google 的 Martin von Zweigbergk 发起，默认以 Git 仓库为后端存储，能直接操作现有 Git 仓库、和 Git 用户无缝协作，但用一套全新心智重构了工作流。主线：定位 → 工作区即提交 → change-id → 新建与编辑历史 → 自动 rebase → operation log → 一等冲突 → bookmark 与协作 → revsets → 对照 Git → 总结。它不是换皮的 Git。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么

<v-clicks>

- ✅ **新一代 VCS**：Google 发起，命令行叫 **jj**
- ✅ **默认以 Git 为后端**：直接操作现有 Git 仓库
- ✅ **与 Git 用户无缝协作**：对方甚至感知不到
- ✅ 重构工作流：无暂存区 · 自动快照 · 一等冲突
- ✅ **不是换皮 Git**：心智模型全新

</v-clicks>

<!--
jj 的定位是新一代版本控制系统。它默认把 Git 仓库当后端来存提交，所以能直接操作现有 Git 仓库，团队其他人继续用 git 也完全没问题，对方甚至不知道你没在用 git。但它不是给 git 换个皮：它把 git 的几个核心痛点系统性地重新设计了——没有暂存区、自动快照、冲突是一等公民、所有操作可一键撤销。下面逐个看。
-->

---

# 工作区即提交：没有暂存区

<v-clicks>

- 当前工作区 = 一个真实提交，记作 **@**
- **没有暂存区**：改文件就是改 @ 这个提交
- **自动快照**：几乎每条 jj 命令前自动把改动并入 @

</v-clicks>

<div v-click class="mt-6">

```bash
jj st        # 看 @ 的改动（无需先 add）
# ……改文件……
jj st        # 改动已自动算进 @
```

</div>

<div v-click class="mt-4 text-gray-400">

`git add` 不存在了；想精挑改动用 `jj split -i` / `jj squash -i`

</div>

<!--
这是和 Git 最根本的差异。Git 是工作区、暂存区、仓库三段式，要 git add 才能提交。jj 没有暂存区：当前工作区直接对应一个真实提交，用 @ 表示，你改文件就是在改 @ 这个提交。而且几乎每条 jj 命令运行前都会自动把工作区快照进 @，不用手动 add。所以 git add 这个动作没有了。想要 git add -p 那种精挑改动，用 jj split -i 或 jj squash -i。
-->

---

# change-id 与 commit-id

<v-clicks>

- **change-id**：一个改动的**逻辑身份**，贯穿全部演化 → **稳定**
- **commit-id**：当前内容的 Git 哈希（SHA）→ 内容一变就变
- 反复 describe / squash / rebase：commit-id 变，**change-id 不变**

</v-clicks>

<div v-click class="mt-4 p-3" style="border-left: 4px solid #10b981; background: rgba(16,185,129,0.08)">

🥋 始终能用稳定的 change-id 指代「同一件事」——天然适配反复打磨/评审的工作流

</div>

<!--
jj 给每个提交两个标识符。change-id 是一个改动的逻辑身份，类似 Gerrit 的 Change-Id，贯穿它整个演化过程，是稳定的。commit-id 是该提交当前内容的 Git 哈希，内容一变就是新哈希。所以你对同一个 change 反复 describe、squash、rebase，commit-id 不断变，但 change-id 始终如一。这意味着你永远能用稳定的 change-id 指代「同一件事」，天然适配那种一个改动在评审里反复更新的工作流。
-->

---

# 新建提交、编辑历史

<v-clicks>

- `jj new`：在 @ 之上开一个**新空提交**（封存当前、开始下一个）
- `jj describe`：给 @ 写/改提交信息（随时可改）
- `jj edit <rev>`：直接「站到」某历史提交上就地编辑
- `jj squash`：把 @ 改动并入父提交（≈ `git commit --amend`）
- `jj split -i`：把一个提交拆成多个

</v-clicks>

<!--
jj 把「开始新提交」和「编辑历史提交」做成对称的命令。jj new 在 @ 之上开一个新的空提交，相当于封存当前、开始下一个。jj describe 给 @ 写或改提交信息，随时能改。jj edit 让你直接站到某个历史提交上就地编辑它。jj squash 把 @ 的改动并入父提交，相当于 git commit --amend。jj split -i 把一个提交拆成多个，精挑哪些改动归哪个提交。注意编辑历史在 jj 里是日常操作，不像 git 那么沉重。
-->

---

# 自动 rebase

<v-clicks>

- 改写某提交 → 它的**所有后代自动重新落到新版本上**
- 你几乎不用手动维护下游分支
- `-r` 甚至能把提交 rebase 到它自己的后代（空洞自动回填）

</v-clicks>

<div v-click class="mt-6">

```bash
# 选哪些：-s 源含后代 / -b 整支 / -r 仅这些
# 放哪里：-d(--destination) / -A 之后 / -B 之前
jj rebase -s <源> -d <目标>
jj rebase -r X -A L        # 把 X 插到 L 之后（重排）
```

</div>

<!--
jj 的杀手锏是自动 rebase。当你改写某个提交，不管是 describe、squash、edit 还是 rebase，它的所有后代会自动重新落到新版本上，你几乎不用手动去维护下游分支。rebase 命令用三组选哪些、放哪里的标志：选哪些是 -s 源加后代、-b 整支、-r 仅指定提交；放哪里是 -d 目标、-A 插到之后、-B 插到之前，不指定默认 -b @。-r 甚至允许把提交 rebase 到它自己的后代上，留下的空洞自动回填，这是 git 做不到的。
-->

---

# operation log 与撤销

<v-clicks>

- **每一次仓库状态变更**都进 operation log（不只是提交）
- `jj op log`：整库级别的统一操作时间线
- `jj undo`：撤销上一次操作（**任意操作皆可**）
- `jj op restore <op-id>`：整库回到某次操作后的状态
- 比 Git reflog 更完整；底层**无锁并发**安全

</v-clicks>

<div v-click class="mt-3 text-gray-400">

放手去 rebase / squash / abandon，搞砸了 `jj undo` 即可

</div>

<!--
jj 把每一次改变仓库状态的操作都记进 operation log，不只是提交，还包括 rebase、abandon、bookmark 移动、git import 等。jj op log 看到的是整库级别的统一时间线。jj undo 能撤销上一次操作，注意是任意操作，不限于提交。jj op restore 把整个仓库回到某次操作结束的状态。它比 git reflog 更完整：reflog 按引用分散记录引用移动，而 operation log 是整库统一时间线，能一键撤销一次搞砸的 rebase 或误删。底层还支持无锁并发。所以你可以放手改写历史，搞砸了 undo 就行。
-->

---

# 一等冲突（first-class conflicts）

<v-clicks>

- 冲突可以**被记录进提交**，操作**照常成功**
- rebase 一串提交中途冲突也**不中断** → 告别 `--continue`
- 冲突会**传播给后代**，可**稍后任意时刻**再解
- `jj resolve` 调外部工具，或直接编辑工作区冲突标记

</v-clicks>

<div v-click class="mt-4 p-3" style="border-left: 4px solid #f59e0b; background: rgba(245,158,11,0.08)">

⚠️ 解冲突从「中途卡死」变成一件可延后、可拆分的独立事情

</div>

<!--
Git 里冲突会阻塞操作，逼你当场解完再 --continue。jj 把冲突当作一等公民：rebase 或 merge 产生的冲突会被记录进提交，操作照常一步成功；rebase 一串提交即使中途冲突也不会中断。冲突会传播给后代，但你可以稍后任意时刻再解，全程不打断。解决方式是 jj resolve 调外部合并工具，或直接编辑工作区里物化出的冲突标记。提交里存的是冲突的逻辑表示而非裸标记，所以 rebase 冲突不会套娃。这从根本上消除了 git 那套 rebase/merge/cherry-pick --continue 的卡死体验。
-->

---

# bookmark 与 Git 协作

<v-clicks>

- **bookmark ≈ 分支**，但**不自动跟随**——提交后需手动 `set`/`move`
- 日常匿名工作线无需起名（@ 一路 `jj new`）
- `jj git fetch` / `jj git push --bookmark <名>` / `-c @` 自动建并推

</v-clicks>

<div v-click class="mt-4">

**co-located 仓库** `jj git init --colocate`：`.jj` 与 `.git` 共处，`jj`/`git` 命令混用，团队无感

</div>

<div v-click class="mt-3 text-gray-400">

未支持：submodule · LFS · hooks · `.gitattributes`（详见官方）

</div>

<!--
jj 的 bookmark 约等于 Git 分支，是命名的提交指针，但关键区别是它不会像 Git 分支那样自动跟随 HEAD 前进，jj 没有当前分支概念，提交后 bookmark 不会自动移动，要手动 set 或 move。日常的匿名工作线无需起名，@ 一路 new 下去就行。和 Git 协作用 jj git fetch、jj git push --bookmark，-c @ 能自动建 bookmark 并推。co-located 仓库让 jj 和 git 共处一目录、命令混用，团队完全无感。注意 submodule、LFS、hooks、gitattributes 等还不支持，细节看官方 git-compatibility 页。
-->

---

# revsets：选取提交的查询语言

<v-clicks>

- 借鉴 Mercurial 的**函数式**语言，表达力远超 `A..B`
- 符号：`@`（工作区提交）· `@-`（父）· `root()`
- 操作符：`x-` 父 · `x+` 子 · `::x` 祖先 · `x::y` 区间 · `|` `&` `~`
- 函数：`heads()` · `bookmarks()` · `mine()` · `empty()` · `all()`

</v-clicks>

<div v-click class="mt-4">

```bash
jj log -r ::@            # @ 的祖先（≈ git log）
jj rebase -s 'mine() & description("wip")' -d main
```

</div>

<!--
jj 借鉴 Mercurial 的 revset，一种函数式的提交选取语言，表达力远超 Git 的 A..B。符号方面 @ 是工作区提交，@- 是它的父，root() 是虚拟根。操作符有 x- 取父、x+ 取子、::x 取祖先、x::y 取区间，再加并集 |、交集 &、差集 ~。函数有 heads、bookmarks、mine、empty、all 等。比如 jj log -r ::@ 看 @ 的祖先约等于 git log；jj rebase 配 mine() 和 description 过滤能精确选中我写的、描述含 wip 的提交批量搬走。这套查询能力是 jj 日常高效的关键。
-->

---

# 对照 Git：命令速查

<v-clicks>

- `git add` → 无需（直接改文件，自动快照）
- `git commit -a` → `jj commit` ｜ `git commit --amend` → `jj squash`
- `git add -p` → `jj split -i` / `jj squash -i`
- `git checkout -b X` → `jj new X` ｜ `git branch` → `jj bookmark`
- `git reset --hard` → `jj abandon` ｜ `git reflog` → `jj op log`

</v-clicks>

<!--
和 Git 的命令做个对照。git add 在 jj 里不存在，直接改文件自动快照。git commit -a 对应 jj commit，git commit --amend 对应 jj squash。git add -p 那种精挑改动用 jj split -i 或 jj squash -i。git checkout -b 新建工作线用 jj new，git branch 管理对应 jj bookmark。git reset --hard 丢弃用 jj abandon，git reflog 这个总后悔药对应更强的 jj op log。可以看到很多概念是重映射而非照搬，所以别用 Git 的肌肉记忆硬套。
-->

---
layout: center
class: text-center
---

# 总结

Jujutsu = **Git 后端 + 全新工作流**

工作区即提交（无暂存区）· change-id 稳定 · 自动 rebase · operation log 一键撤销 · 一等冲突

<div class="mt-8 text-gray-400">

不是换皮的 Git——它把暂存区负担、冲突阻塞、reflog 难用系统性重做

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://jj-vcs.github.io/jj/latest/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
总结一下。Jujutsu 是 Git 后端加一套全新工作流。核心是几件事：工作区即提交、没有暂存区；change-id 稳定，适配反复打磨；自动 rebase，改写历史后代自动跟上；operation log 让任意操作可一键 undo；冲突是一等公民，操作不再被阻塞。它不是换皮的 Git，而是把暂存区认知负担、冲突阻塞流程、reflog 难用这些痛点系统性地重新设计。如果你被 Git 的这些点折磨过，jj 值得一试。
-->
