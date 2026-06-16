---
theme: seriph
background: https://cover.sli.dev
title: lazygit — 终端里的 Git TUI
info: |
  Presentation lazygit — 由 Jesse Duffield 开发的终端 Git TUI，五大面板、纯键盘驱动、可视化分行暂存、交互式 rebase。

  Learn more at https://github.com/jesseduffield/lazygit
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🦥</span>
</div>

<br/>

## lazygit — 终端里的 Git TUI

由 Jesse Duffield 开发；五大面板、纯键盘驱动、可视化分行暂存

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/jesseduffield/lazygit" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 lazygit：一个在终端里运行的 Git TUI，由 Jesse Duffield 开发。它把 Git 仓库状态铺成五个面板，所有操作靠键盘按键完成。主线：定位 → 五大面板 → 暂存与提交 → 分行暂存 → 推拉分支 → 交互式 rebase → fixup → cherry-pick → 撤销 → 自定义命令 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么

<v-clicks>

- 🦥 **终端 Git TUI**：在终端运行 `lazygit`，仓库状态铺成面板
- ⌨️ **纯键盘驱动**：所有操作靠按键，手不离键盘
- 🧩 不取代 Git，而是 Git 的**高效可视化前端**
- 🚀 Go 编写、单文件、启动快、跨平台

</v-clicks>

<!--
lazygit 的定位：一个终端里的 Git TUI。它不是要取代 Git，而是给 Git 套一个高效的可视化前端。你在终端敲 lazygit，它就把当前仓库的状态铺成几个面板，所有操作都靠键盘按键触发。它用 Go 写成，单个二进制，启动很快，三大平台都能跑。一句话：把敲长命令、记参数、手编 rebase 文件，换成按几个键。
-->

---

# 五大面板

<v-clicks>

- `1` **Status**：仓库状态、按 `e` 编辑配置
- `2` **Files**：工作区改动，暂存提交主战场
- `3` **Branches**：本地/远程分支
- `4` **Commits**：提交历史，交互式 rebase 主战场
- `5` **Stash**：储藏的 work-in-progress

</v-clicks>

<div v-click class="mt-4 text-gray-400">

数字键直达面板 · `<tab>` / `h` `l` 切换 · `<enter>` 进入 · `<esc>` 返回 · `?` 查键位

</div>

<!--
界面左侧是五个侧边面板，右侧主视图显示 diff 和日志。数字键一到五直接跳到对应面板：Status 看状态、Files 管改动、Branches 管分支、Commits 管历史、Stash 管储藏。面板之间用 tab 或者 h l 切换，回车进入下一层，esc 逐层返回。最重要的一招：记不住键就按问号，它会弹出当前面板的完整键位菜单。
-->

---

# 暂存与提交

<v-clicks>

- `空格`：暂存 / 取消暂存选中文件
- `a`：暂存 / 取消**全部**
- `c` 提交 · `C` 用编辑器写信息 · `w` 跳过钩子
- `A`：amend 到上一次提交

</v-clicks>

<div v-click class="mt-4 text-gray-400">

大小写区分：小写多为常规动作，大写常是"加强版"

</div>

<!--
在 Files 面板，空格切换选中文件的暂存状态，a 一次性暂存或取消全部。提交用 c，弹出输入框写一行信息回车确认；要写多行就用大写 C 调编辑器；w 是跳过 pre-commit 钩子提交；大写 A 把当前暂存内容补进上一次提交。这里有个贯穿全局的规律：小写键往往是常规动作，大写键常常是它的加强版或变体，记键位时可以这样归类。
-->

---

# 可视化分行暂存 🦥

<v-clicks>

- 在文件上 `<enter>` 进入 diff
- `空格`：暂存当前行 / 当前块
- `v`：范围选择，`↑` `↓` 扩选连续行
- `a`：切换「整块」/「逐行」模式
- 等价 `git add -p`，但**所见即所选**

</v-clicks>

<div v-click class="mt-4 p-3" style="border-left: 4px solid #f59e0b; background: rgba(245,158,11,0.08)">

把一团混合改动干净拆进不同提交，无需手编补丁

</div>

<!--
这是 lazygit 最招牌的能力。在某个文件上按回车，进入它的 diff，然后逐块浏览：空格暂存当前行或当前块；按 v 开启范围选择，用上下键扩选一段连续的行，再空格暂存这一段；a 在逐行和整块两种模式间切换。这等价于命令行的 git add -p 逐块交互，但它是可视化的，所见即所选。好处是能把一团混在一起的改动，干净地拆进多个不同的提交，完全不用手写补丁。
-->

---

# 推、拉、分支

<v-clicks>

- `P` 推送 · `p` 拉取 · `f` 抓取 · `R` 刷新
- Branches：`空格` 检出 · `n` 新建 · `c` 按名检出
- `r` rebase 到选中分支 · `M` 合并进当前分支
- `f` 从上游快进 · `o` 创建 PR · `G` 浏览器打开 PR

</v-clicks>

<!--
推拉用大小写区分：大写 P 推送，小写 p 拉取，f 抓取，R 只刷新状态不联网。在 Branches 面板，空格检出选中分支，n 新建分支，c 按名字检出，输入框里输一个减号还能切回上一个分支。r 是把当前分支 rebase 到选中分支，大写 M 把选中分支合并进当前分支。f 从上游快进。o 创建 Pull Request，大写 G 在浏览器里打开它。
-->

---

# 交互式 rebase

<v-clicks>

- `i` 启动交互式 rebase · `e` 从选中提交开始
- `s` squash · `f` fixup · `d` drop · `r` reword · `p` pick
- `<c-j>` / `<c-k>`：下移 / 上移提交
- `m`：continue / abort / skip 菜单

</v-clicks>

<div v-click class="mt-4 text-gray-400">

无需手编 rebase TODO 文件，按键当场标记

</div>

<!--
Commits 面板是整理历史的主战场，关键是不用手编 rebase 的 TODO 文件。小写 i 启动交互式 rebase，e 则从选中的那条提交开始。然后直接按键标记动作：s 把它 squash 到下一条，f 是 fixup 也就是并入下条但丢弃信息，d 删除，r 改信息，p 保留。ctrl j 和 ctrl k 把提交上下移动调整顺序。整个过程中按 m 打开选项菜单，里面是继续、中止、跳过。所有这些在命令行里都得编辑一个文本文件，这里全是按键。
-->

---

# fixup 与 cherry-pick

<v-clicks>

- `F`：为选中提交建 `fixup!` 提交（注意 ≠ 小写 `f`）
- `S`：autosquash 所有 `fixup!`
- `<c-f>`（Files）：自动定位要 fixup 的基提交
- `C` 复制提交 → 切分支 → `V` 粘贴（cherry-pick）

</v-clicks>

<!--
两个高频进阶动作。先说 fixup：PR 评审后要把修改并回某个旧提交、又想让评审看到，就用 fixup 提交。选中目标提交按大写 F 创建一个 fixup 感叹号提交，注意别和小写 f 搞混，小写 f 是直接 squash。要合并时选中分支首个提交按大写 S，一键把所有 fixup 提交自动归并。不确定该 fixup 哪条？在 Files 面板按 ctrl f 自动定位。再说 cherry-pick：在 Commits 面板按大写 C 标记复制，切到目标分支按大写 V 粘贴，就完成了跨分支搬运。
-->

---

# 撤销、重做与 stash

<v-clicks>

- `z` 撤销 · `Z` 重做（基于 **reflog** 回放）
- 连命令行外的操作也能撤
- ⚠️ 只覆盖提交/分支；**工作区、stash、已推送**不可撤
- Stash：`s` 储藏全部 · `空格` apply · `g` pop · `d` 丢弃

</v-clicks>

<!--
撤销重做是 lazygit 很贴心的一点。z 撤销上一步，大写 Z 重做。它的原理是读 reflog 回放，所以连你在 lazygit 之外、在命令行里做的操作也能撤。但要记住边界：它只覆盖 reflog 记录的提交和分支变化，工作区改动、stash 改动、以及已经推送到远程的操作，都没法撤；rebase 中途也不支持撤销，想退出就用 m 里的 abort。储藏方面：Files 面板 s 一键 stash 全部，到 Stash 面板空格 apply、g pop、d 丢弃。
-->

---

# 自定义命令

<v-clicks>

- 写在 `config.yml` 的 `customCommands`（Status 按 `e` 打开）
- 字段：`key` / `context` / `command` / `output`
- `prompts` 弹 menu / input / confirm 收集参数
- 占位符：`SelectedFile`、`SelectedCommit` …

</v-clicks>

<div v-click class="mt-4">

```yaml
- key: "<c-v>"
  context: "files"
  command: "git cz"
  output: terminal
```

</div>

<!--
lazygit 可以把任意命令绑到你自己的键位，写在配置文件的 customCommands 下，在 Status 面板按 e 就能打开配置。每条命令指定触发键 key、生效的面板 context、要跑的 command、以及输出去向 output，比如 terminal 会挂起 lazygit 在终端里跑。还能用 prompts 弹出菜单、输入框、确认框来交互式收集参数。命令里用 Go 模板占位符访问当前选中的对象，比如 SelectedFile、SelectedCommit。这让你能把团队的提交规范、发布脚本都做成一个按键。
-->

---
layout: center
class: text-center
---

# 总结 🦥

lazygit = **五大面板 + 键盘驱动 + 可视化 Git**

分行暂存拆提交 · 交互式 rebase 免手编 · reflog 撤销兜底 · 自定义命令扩展

<div class="mt-8 text-gray-400">

它是 Git 的高效前端，底层概念仍需懂；记不住键就按 `?`

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/jesseduffield/lazygit/tree/master/docs" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
总结一下。lazygit 的核心是三件事：五大面板组织一切、纯键盘驱动、把 Git 操作可视化。最值得用的几招：可视化分行暂存把改动拆成干净提交，交互式 rebase 不用手编文件，基于 reflog 的撤销给你兜底，自定义命令让你扩展任意工作流。但它终究是 Git 的高效前端，rebase、reset 这些底层概念还是得懂。最后那句老话：记不住键,就按问号。
-->
