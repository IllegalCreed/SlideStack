---
theme: seriph
background: https://cover.sli.dev
title: Sapling SCM
info: |
  Sapling —— Meta 出品、Git 兼容的可扩展源码控制系统（命令行 sl）。

  Learn more at [https://sapling-scm.com/](https://sapling-scm.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Sapling

Meta 出品 · Git 兼容 · 可扩展的源码控制系统（命令是 <code>sl</code>）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/facebook/sapling" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 {
  background-color: #2EA043;
  background-image: linear-gradient(45deg, #2EA043 10%, #116329 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
大家好，今天聊 Sapling —— Meta 开源的源码控制系统，命令行工具叫 sl。
它最大的标签有三个：Git 兼容、脱胎自 Mercurial、为 Meta 那种数千万文件的超大 monorepo 而生。
接下来十页，从「无暂存区」「smartlog」「栈式开发」一路讲到 ISL 图形界面和 GitHub 集成。
-->

---
transition: fade-out
---

# 什么是 Sapling？

「A Scalable, User-Friendly Source Control System」

<v-clicks>

- **Meta 出品**：约十年前为应对其超大 monorepo 而自研，命令行是 `sl`
- **Git 兼容**：能直接 clone / 操作 GitHub 上的 Git 仓库，可渐进式引入
- **脱胎 Mercurial**：CLI 基于 Mercurial 改造（源码在 `eden/scm`），融合 Git 概念
- 核心理念：版本控制的 **UX 与扩展性**，可与**仓库格式**解耦

</v-clicks>

<div v-click text-xs mt-4>

_Read more about_ [_Sapling introduction_](https://sapling-scm.com/docs/introduction/)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2EA043 10%, #116329 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
Sapling 的官方定位是「可扩展、用户友好的源码控制系统」。

[click] 它是 Meta 出品，大约十年前为了对付自家数千万文件的 monorepo 而自研，命令行工具就叫 sl。
[click] 它和 Git 兼容，能直接 clone 和操作 GitHub 上的 Git 仓库，团队可以渐进式引入。
[click] 它的 CLI 脱胎自 Mercurial，在 eden/scm 目录里改造而来，同时融合了 Git 的概念。
[click] 它最核心的设计理念，是把版本控制的易用性和扩展性，跟底层仓库格式解耦。
-->

---
transition: fade-out
---

# 无暂存区：最大的心智反差

In Sapling, there is no staging area

<v-clicks>

- Sapling **没有暂存区 / index**，`sl commit` 默认提交所有改动（≈ `git commit -a`）
- `sl add` 仅表示「**开始跟踪新文件**」，**不是**把改动加入暂存区
- 想分批提交：用 `sl commit -i` / `sl amend -i` 交互式选 hunk（≈ `git add -p`）
- 配合**分支可选**：官方甚至不鼓励日常用 bookmark，靠 hash + smartlog 工作

</v-clicks>

<div v-click text-xs mt-4>

_Read more about_ [_differences from Git_](https://sapling-scm.com/docs/introduction/differences-git)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2EA043 10%, #116329 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
和 Git 心智最大的反差，是 Sapling 没有暂存区。

[click] 官方原话：Sapling 里没有 staging area。所以 sl commit 默认就把所有改动提交，约等于 git commit -a。
[click] 这里有个高频坑：sl add 只是告诉 Sapling 开始跟踪一个新文件，它不是 Git 那种把改动加入暂存区的语义。
[click] 那想分批提交怎么办？用 sl commit -i 或 amend -i，交互式地挑 hunk，约等于 git add -p。
[click] 再加上分支也是可选的，官方甚至不鼓励日常用 bookmark，大家主要靠 commit hash 加 smartlog 来工作。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-12
---

# Smartlog：看懂仓库状态

裸命令 `sl`（或 `sl smartlog`）显示与你相关的提交图

::left::

<div v-click>

### 显示什么

- 你尚未推送的 commits + 它们的图关系
- `main` 等重要分支位置（左侧**虚线**省略无关 commit）
- `@` 你在这里 · `o` 普通 commit
- `x` 已落地 / 已废弃，并标「Landed as …」

</div>

::right::

<div v-click>

### 两个关键命令

- `sl ssl`：**Super Smartlog**，额外抓 GitHub PR 状态、评审、CI
- `sl goto <commit>`：**切换**到某 commit（注意是 goto，不是 checkout）
- 交互版经 `sl web`（ISL）提供，自动刷新 + 拖拽 rebase

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2EA043 10%, #116329 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
要用好 Sapling，先得看懂 smartlog。直接敲 sl，或者 sl smartlog，就能显示和你相关的提交图。

[click] 它会显示你还没推送的 commit 和它们之间的图关系，main 等重要分支的位置；左侧那条虚线代表 main，会省略掉成千上万个无关 commit。符号上，@ 是你当前所在，o 是普通 commit，x 表示已经落地或废弃，还会标 Landed as。
[click] 两个关键命令记住：sl ssl 是 super smartlog，会额外抓 GitHub 的 PR 状态、评审和 CI；切换到某个 commit 用 sl goto，注意是 goto 不是 checkout；想要交互式的图形版，就用 sl web 启动 ISL。
-->

---
transition: fade-out
---

# 栈式开发：一等公民

Stack your work —— 把一组相关 commit 当整体处理

<v-clicks>

- Sapling 对「编辑、操作 commit 栈」提供 **first-class 支持**，官方不鼓励用分支
- 建栈即「`sl add` 新文件 → `sl ci -m`」，逐个堆叠，靠 hash / smartlog 访问
- 改栈：`sl goto` 到目标 → 改 → `sl amend`，Sapling **自动 restack** 上方 commit
- `sl fold` 合并 · `sl split` 拆分 · `sl absorb` 自动把改动吸收进对应 commit

</v-clicks>

```bash
echo foo > foo.txt ; sl add foo.txt ; sl ci -m 'adding foo'
echo bar > bar.txt ; sl add bar.txt ; sl ci -m 'adding bar'
```

<style>
h1 {
  background-image: linear-gradient(45deg, #2EA043 10%, #116329 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
栈式开发是 Sapling 的招牌卖点。

[click] 它对编辑和操作 commit 栈提供一等支持，把一组相关 commit 当成整体；也正因此，官方不鼓励用分支。
[click] 建栈很朴素：sl add 一个新文件，sl ci 提交，再 add 再 ci，一层层堆，全靠 hash 或 smartlog 来访问，不需要起分支名。
[click] 改栈中间某个 commit：sl goto 过去，改，然后 sl amend，Sapling 会自动 restack，把上面依赖它的 commit 重新堆好。
[click] 还有三个独门武器：fold 合并、split 拆分、absorb 自动把工作区改动吸收进引入对应行的那个 commit。
下面这段就是建一个两层栈的最小示例，注意全程没有 git add 到暂存区那一套。
-->

---
transition: fade-out
---

# Undo / Redo：一等公民

回退是专用命令，比 Git 的 reflog/reset 友好得多

<v-clicks>

- `sl undo` / `sl redo`：撤销 / 重做上一步操作（≈ `git reset --hard HEAD@{1}`）
- `sl undo -i`：**可视化预览**，用左右方向键浏览各历史状态再确认
- 细分命令：`sl uncommit`（拆开提交）· `sl unamend` · `sl unhide`（找回隐藏 commit）
- 底层靠 **commit mutation 记录**（旧版→新版映射），支持自动 restack 与跨机一致

</v-clicks>

<div v-click text-xs mt-4>

对照 Git：`sl journal` ≈ `git reflog` · `sl backout` ≈ `git revert`

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2EA043 10%, #116329 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
Sapling 把 undo 做成了一等公民，比 Git 那套 reflog 加 reset 友好太多。

[click] 最常用的是 sl undo 和 sl redo，撤销和重做上一步操作，大致相当于 git reset --hard 到 reflog 的上一个状态。
[click] 更贴心的是 sl undo -i，会给你一个可视化预览，按左右方向键浏览各个历史状态，看准了再确认。
[click] 还有一组细分命令：uncommit 把提交拆开、unamend 撤销 amend、unhide 找回被隐藏的 commit。
[click] 这一切的底层，是 Sapling 维护的 commit mutation 记录，也就是旧版本到新版本的映射，它支撑了自动 restack 和跨机器协作时栈的一致。
对照 Git 的话，sl journal 约等于 reflog，sl backout 约等于 revert。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-12
---

# ISL：内置 Web 图形界面

`sl web` 启动，把提交图渲染成可交互的树

::left::

<div v-click>

### 核心操作

- 启动命令是 **`sl web`**（不是 `sl isl`）
- 树状查看 commit，含「You are here」
- **拖拽 rebase**（需无未提交改动）
- `Goto` 按钮切换 · 点击创建新 commit 建栈

</div>

::right::

<div v-click>

### 评审 & 编辑器

- `Commit` / `Amend` 按钮，可写详细信息
- 「Commit and Submit」直接提交 GitHub PR
- PR badge 显示状态 / CI / 评论，点击跳转
- 另有独立 **VS Code / Visual Studio 扩展**

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2EA043 10%, #116329 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
Sapling 自带一个 Web 图形界面，叫 ISL，Interactive Smartlog。

[click] 它的启动命令是 sl web，注意不是 sl isl。它把提交图渲染成一棵可交互的树，有 You are here 指示，可以拖拽来 rebase，前提是没有未提交改动；用 Goto 按钮在 commit 间切换，点一下就能创建新 commit 来建栈。
[click] 它也覆盖评审和编辑：有 Commit、Amend 按钮，可以写详细信息；Commit and Submit 能直接提交 GitHub PR；PR badge 会显示状态、CI 结果和评论数，点击跳到 GitHub。此外 Sapling 还有独立的 VS Code 和 Visual Studio 扩展，把 ISL 嵌进编辑器。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-12
---

# Git / GitHub 集成 · 三种 PR 路径

先 `gh auth login`，再按需选提交方式

::left::

<div v-click>

### 前提与 clone

- 装 **GitHub CLI（`gh`）** 并认证
- 改 `.github/workflows/` 需补 `workflow` scope
- `sl clone https://github.com/…` 直接克隆

</div>

::right::

<div v-click>

### 三种 PR 路径

- `sl pr submit`：**重叠** PR，配 **ReviewStack** 评审
- `sl ghstack`：**非重叠** PR（ISL 中可选）
- `sl push --to remote/feat`：单分支单 PR，网页建

</div>

<div v-click text-xs mt-3 col-span-2>

ReviewStack（域名 `reviewstack.dev`）：只显示每个 PR 真正要评审的那个 commit

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2EA043 10%, #116329 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
Sapling 和 Git、GitHub 的集成很完整。

[click] 前提是先装 GitHub CLI 并认证；如果你的 PR 要改 .github/workflows 下的文件，还得给令牌补上 workflow 这个 scope，否则提交会报未授权。克隆直接 sl clone 一个 GitHub 地址就行。
[click] 提交 PR 有三条路径，别混：sl pr submit 创建重叠 PR，配合 ReviewStack 来评审；sl ghstack 创建非重叠 PR，在 ISL 里也能选；sl push --to 则是每个分支对应一个 PR，再去网页建。
ReviewStack 的域名是 reviewstack.dev，它专为重叠 PR 设计，只显示每个 PR 真正要评审的那个 commit，过滤掉下方堆叠的部分。
-->

---
transition: fade-out
---

# EdenFS 边界：开源用户没有

扩展性杀手锏目前主要在 Meta 内部

<v-clicks>

- **EdenFS**（虚拟文件系统，按需拉取文件）：源码有，但**未进公开发布版**
- **Mononoke**（Rust 分布式服务端，clone/pull ≈ O(merges)）：**尚未公开支持**
- 开源用户实际享受的是：**CLI + ISL 的易用性 + Git 兼容**那部分
- `brew install sapling` 后**不会**自动获得虚拟文件系统与 Sapling 服务端

</v-clicks>

<div v-click text-xs mt-4>

`.git` 模式（git/sl 共存）vs `.sl` 模式（解锁扩展特性，但无原生 git 命令）

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2EA043 10%, #116329 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
讲扩展性，必须先把边界说清楚，这是最容易被误导的地方。

[click] EdenFS 是按需拉取文件的虚拟文件系统，源码在仓库里有，但没有进公开发布版。
[click] Mononoke 是 Rust 写的分布式服务端，能把 clone、pull 的开销压到接近 O(merges)，但目前尚未公开支持。
[click] 所以开源用户实际能享受的，是 CLI 加 ISL 的易用性，再加上 Git 兼容这部分。
[click] 千万别以为 brew install sapling 之后就能用上虚拟文件系统和 Sapling 服务端，那两者目前主要在 Meta 内部。
底部补一句：Sapling 有两种模式，.git 模式让 git 和 sl 共存，.sl 模式解锁扩展特性但不支持原生 git 命令。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-12
---

# vs Git / Jujutsu

措辞稳健 —— 官方未直接对比 jj

::left::

<div v-click>

### vs Git

- Git 生态 / 工具链 / 团队熟悉度仍无可比拟
- Sapling 偏「企业级、始终在线、单 master、rebase 为主、monorepo」
- 强项：栈式开发 + 友好 undo + smartlog + 内置 GUI

</div>

::right::

<div v-click>

### vs Jujutsu（jj）

- 都是 Git 兼容、无暂存区思路、可变历史友好的新一代 VCS
- Sapling：Mercurial 血统、为超大 monorepo、内置 ISL + ReviewStack
- jj：后端可插拔、首类冲突；**官方未直接对比**，勿绝对化

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2EA043 10%, #116329 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
最后做个取舍对比，措辞我会保守一些。

[click] 先看和 Git 的对比：Git 的生态、工具链、团队熟悉度，依然无可比拟。Sapling 的设计取向偏向企业级、始终在线、单 master、以 rebase 为中心、monorepo，在这些场景最成熟；它的强项是栈式开发、友好的 undo、smartlog 和内置 GUI。
[click] 再看和 Jujutsu 的对比：两者都是 Git 兼容、无暂存区思路、对可变历史友好的新一代 VCS。Sapling 是 Mercurial 血统、为超大 monorepo 而生，内置 ISL 和 ReviewStack；jj 则后端可插拔、有首类冲突存储。要强调的是，Sapling 官方并没有直接对比 jj，所以谁更强这种话我们不绝对化。
-->

---
transition: fade-out
---

# 结尾

无暂存区 + 栈式开发 + 友好 undo，Git 兼容渐进引入

<v-clicks>

- **定位**：Meta 出品、脱胎 Mercurial、为超大 monorepo 而生
- **易用**：无暂存区、分支可选、smartlog 一眼看懂、`sl undo` 安心回退
- **协作**：`sl web`（ISL）拖拽操作 + 三种 GitHub PR 路径
- **边界**：EdenFS / Mononoke 未公开，开源用户用 CLI + ISL + Git 兼容

</v-clicks>

<div class="abs-br m-6 text-xl">
  <a href="https://sapling-scm.com/" target="_blank" class="slidev-icon-btn">
    <carbon:launch />
  </a>
  <a href="https://github.com/facebook/sapling" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/frontend-develop-tools/version-control/sapling/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2EA043 10%, #116329 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这就是 Sapling 的全景。

[click] 定位上，它是 Meta 出品、脱胎 Mercurial、为超大 monorepo 而生。
[click] 易用性上，无暂存区、分支可选、smartlog 让仓库状态一眼看懂、sl undo 让你安心回退。
[click] 协作上，sl web 启动的 ISL 支持拖拽操作，加上三种 GitHub PR 路径。
[click] 边界上记住一句：EdenFS 和 Mononoke 没有公开，开源用户用的是 CLI 加 ISL 加 Git 兼容那部分。
官网、GitHub 和笔记链接都在右下角，去探索吧！
-->

---
layout: end
---
