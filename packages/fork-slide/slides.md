---
theme: seriph
background: https://cover.sli.dev
title: Fork — 原生高性能的 Git GUI 客户端
info: |
  Presentation Fork — 面向 macOS 与 Windows 的原生 Git 图形客户端：可视化交互式 rebase、内置三栏冲突解决器、图片差异对比，一次性买断授权。

  Learn more at [https://git-fork.com](https://git-fork.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🍴</span>
</div>

<br/>

## Fork — 原生高性能的 Git GUI 客户端

面向 macOS 与 Windows 的原生 Git 图形客户端；快、好用、一次买断

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://git-fork.com" target="_blank" class="slidev-icon-btn">
    <carbon:launch />
  </a>
</div>

<!--
今天聊 Fork：注意这是一款名叫 Fork 的 Git 图形客户端，和 git 里 fork 分叉这个概念无关。它面向 macOS 和 Windows，是原生应用，主打快和好用，授权是一次性买断。主线：定位 → 原生性能 → 授权 → 提交与 diff → 图片差异 → 交互式 rebase → 冲突解决 → 提交图与工具 → 远程与 PR → 取舍 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么

<v-clicks>

- 🍴 名叫 **Fork** 的 Git GUI 客户端，与 git「fork 分叉」无关
- 🖥️ 平台：**macOS 10.11+ / Windows 7+**，**无 Linux**
- ⚡ **原生应用**（非 Electron），主打快与流畅
- 💲 **一次性买断**：免费无限期试用，长期用 $59.99
- 🎯 定位：单机高效，而非云端团队协作

</v-clicks>

<!--
Fork 的定位：一款 Git 图形客户端，产品名就叫 Fork。它只支持 macOS 和 Windows，没有 Linux 版。最大特点是用平台原生技术实现，不是 Electron，所以快。授权是一次性买断：可以无限期免费评估，长期使用买一个 59.99 美元的永久许可。它的定位是单机上把 Git 用得又快又顺，而不是做云端实时协作。
-->

---

# 原生 → 大仓库依旧快

<v-clicks>

- Mac/Win 各用平台原生技术栈，**非 Electron**
- 启动近乎即时，上万提交的大仓库仍流畅
- 这是它对标 **Electron 客户端（GitKraken）** 的核心卖点
- 代价：**不支持 Linux**、无内置实时协作

</v-clicks>

<div v-click class="mt-4 text-gray-400">

「快」是定性口碑而非官方跑分；大型 monorepo 体验尤为明显

</div>

<!--
为什么强调原生？因为 Fork 在 Mac 和 Windows 上各自用平台原生技术栈实现，不是 Electron 套壳。带来的直接好处是启动几乎瞬间，面对上万提交的大仓库也保持流畅。这正是它和 Electron 系客户端比如 GitKraken 拉开差距的地方，尤其是大型 monorepo。代价是没有 Linux 版，也没有内置的实时团队协作。这个快是大量用户的定性口碑，官方没有给硬跑分。
-->

---

# 授权：一次性买断

<v-clicks>

- **免费评估**：可无限期试用（非固定 N 天）
- **永久许可 $59.99**：一次买断，非订阅
- **1 用户 / 至多 3 台机器**，Mac+Win 通用
- **含商业用途**

</v-clicks>

<div v-click class="mt-4 p-3" style="border-left: 4px solid #10b981; background: rgba(16,185,129,0.08)">

✅ 相对订阅制（如 GitKraken），长期总成本更低

</div>

<!--
授权模式很清晰：免费评估，而且是无限期的，不是常见的 N 天试用。长期使用需要买一个 59.99 美元的永久许可，一次性买断而非订阅。一个许可证支持一个用户、同时最多三台机器，Mac 和 Windows 通用，并且包含商业用途。和订阅制的 GitKraken 比，长期总成本更低，这是它的一个性价比卖点。
-->

---

# 提交与 diff

<v-clicks>

- `Changes` 视图勾选文件，或在 diff 里**逐行 / 逐块暂存**
- diff 支持语法高亮、并排 / 行内切换、in-diff 搜索
- 底部写信息 → Commit；勾 **Amend** 改最后一次提交
- **Blame / History** 逐行溯源、查单文件历史

</v-clicks>

<div v-click class="mt-4 text-gray-400">

逐行 / 逐块暂存 ≈ `git add -p`，但更直观

</div>

<!--
日常提交在 Changes 视图里完成：左侧列出改动文件，右侧是 diff。Fork 支持逐行、逐块暂存和撤销，等价于命令行的 add -p，但更直观。diff 本身有语法高亮、并排和行内两种视图、还能在 diff 里搜索。写好提交信息点 Commit；勾上 Amend 可以并入并改写最后一次提交。配合 Blame 和 History 可以逐行溯源、看单个文件的历史。
-->

---

# 招牌：图片差异对比

<v-clicks>

- 对常见图片格式提供**可视化差异**
- 三种模式：**side-by-side（并排）**
- **swipe（滑动揭示）**
- **onion skin（半透明叠加）**
- 设计资源 / 图标改动一眼可辨

</v-clicks>

<!--
这是 Fork 一个很有辨识度的功能：图片差异对比。对常见图片格式，它提供三种可视化比对模式。side-by-side 是并排看新旧两张图；swipe 是拖动一条分界线揭示前后差异；onion skin 是把两张图半透明叠加。对于经常改图标、设计资源的项目，这个功能让二进制图片的改动也能一眼看清，而不是只看到一行 binary 变化。
-->

---

# 可视化交互式 rebase

<v-clicks>

- 选区间右键 `Interactive Rebase` → 图形面板
- **拖拽重排**提交顺序
- 每条提交选动作：pick / reword / edit
- squash / fixup / drop
- 中途冲突自动转入冲突解决器

</v-clicks>

<div v-click class="mt-3 p-3" style="border-left: 4px solid #f59e0b; background: rgba(245,158,11,0.08)">

⚠️ 黄金法则：**已推送的公共提交不要 rebase**（会改 SHA）

</div>

<!--
Fork 最被称道的功能之一，是把 git rebase -i 做成了可视面板。选中要整理的提交区间，右键交互式 rebase，就进入图形界面。你可以直接拖拽重排提交顺序，给每条提交选动作：pick 保留、reword 改信息、edit 暂停修改、squash 并入上一条并合并信息、fixup 并入但丢弃本条信息、drop 删除。如果中途产生冲突，会自动转入冲突解决器。黄金法则和命令行一样：已经推送、别人可能基于它工作的公共提交不要 rebase，因为重写会改 SHA。
-->

---

# 内置合并冲突解决器

<v-clicks>

- merge / rebase 冲突时打开**三栏解决器**
- 三栏：**ours / base / theirs**，结果在下方合成
- **逐行**选择采用哪侧，或手动编辑
- 冲突位置**标在滚动条**上方便跳转
- 无需配置外置 mergetool

</v-clicks>

<!--
遇到 merge 或 rebase 冲突，Fork 会打开内置的三栏冲突解决器。三栏分别是 ours 当前分支、base 共同祖先、theirs 对方分支，合成结果在下方。你可以逐行选择采用哪一侧，也可以手动编辑。冲突的位置还会标在滚动条上，方便在大文件里快速跳转。全部解决后标记 resolved 就能继续。整个过程不需要你额外配置外置的 mergetool，开箱即用。
-->

---

# 提交图与救场工具

<v-clicks>

- **提交图**可视化分支拓扑，**stash 内联其中**
- 右键提交：Reset / Revert / **Cherry-pick** / Tag
- **Quick Launch**（⌘P / Ctrl+P）模糊搜分支/文件/命令
- **Reflog** 找回丢失提交；**Bisect** 可视化二分定位 Bug
- **内置终端**；Git LFS（含文件锁）、submodule、**worktree**

</v-clicks>

<!--
中间的提交图可视化分支拓扑，而且把 stash 直接内联在提交列表里，正式提交和临时储藏一处看全。对提交右键能做 Reset、Revert、Cherry-pick、打 Tag 等几乎所有日常操作。Quick Launch 是命令面板，用 Cmd P 或 Ctrl P 打开，模糊搜索分支、文件历史、自定义命令，还能创建 worktree。Reflog 帮你找回被误删的提交，Bisect 可视化二分定位引入 Bug 的提交。还有内置终端，以及对 Git LFS 含文件锁、submodule、worktree 的完整 UI 支持。
-->

---

# 远程协作与 PR

<v-clicks>

- **Fetch**：只下载更新，不动工作区（安全）
- **Pull**：拉取并合并（可选 rebase 保持线性）
- **Push**：推送当前分支（首推建立上游跟踪）
- 直接 **Create Pull Request**：GitHub / GitLab / Bitbucket / Azure DevOps
- 近期加入 **AI 生成提交信息 / 代码评审**（OpenAI / Claude）

</v-clicks>

<!--
远程协作三件套：Fetch 只下载远程更新、不碰工作区，最安全；Pull 拉取并合并，也可以配成 rebase 保持线性；Push 推送当前分支，首次推送自动建立上游跟踪。连接账号后，可以直接在 Fork 里对 GitHub、GitLab、Bitbucket、Azure DevOps 创建 Pull Request，不用切到网页。近期还加入了 AI 功能：用 OpenAI 或 Claude 后端生成提交信息、做代码评审，请求内容还能编辑。
-->

---
layout: center
class: text-center
---

# 总结

Fork = **原生快** + **可视化 rebase** + **冲突解决器** + **图片差异**

一次买断 · Mac/Win · 大仓流畅 · 无 Linux / 无云端协作

<div class="mt-8 text-gray-400">

要 Linux 选 GitKraken / lazygit；要免费选 Sourcetree / GitHub Desktop

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://git-fork.com" target="_blank" class="slidev-icon-btn">
    <carbon:launch />
  </a>
</div>

<!--
总结一下。Fork 的核心价值是四件事：原生带来的快、可视化的交互式 rebase、内置三栏冲突解决器、有辨识度的图片差异对比。它是一次性买断、支持 Mac 和 Windows、大仓库依旧流畅，代价是没有 Linux 版、也没有云端实时协作。选型上：需要 Linux 就看 GitKraken 或 lazygit；想完全免费就看 Sourcetree 或 GitHub Desktop；如果你在 Mac 或 Windows 上想要一个又快又顺、愿意一次付费的客户端，Fork 是很强的选择。
-->
