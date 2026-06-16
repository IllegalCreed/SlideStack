---
theme: seriph
background: https://cover.sli.dev
title: Vim/Neovim — 模态编辑器谱系
info: |
  Presentation Vim/Neovim — 经典模态文本编辑器，Vim 与现代化 fork Neovim。

  Learn more at [https://neovim.io](https://neovim.io)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">⌨️</span>
</div>

<br/>

## Vim/Neovim — 模态编辑器谱系

Vim（vi 后裔，终端无处不在）与 Neovim（现代化 fork，Lua + 内置 LSP）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://neovim.io/doc/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
今天聊 Vim 和 Neovim 这一对模态编辑器谱系。

Vim 是 vi 的后裔，终端无处不在，SSH 远程必备;Neovim 是它 2014 年起的现代化 fork，把 Lua、内置 LSP、Treesitter 带进来。

主线：定位 → 模态编辑为何高效 → 七模式 → 编辑语法 → operators 和 text objects → 寄存器宏 → 查找替换与窗口 → vimrc → Neovim 差异 → Lua 和 LSP → Treesitter 和生态 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么

<v-clicks>

- ✅ **模态编辑** + 组合式命令语言，纯键盘高效
- ✅ 终端原生、启动极快、SSH 必备
- ✅ Neovim 现代化：Lua / 内置 LSP / Treesitter

</v-clicks>

<div v-click class="mt-6">

边界：

- ❌ 学习曲线陡（命令语言需肌肉记忆）
- ❌ 开箱弱，需大量配置才达 IDE 体验

</div>

<!--
Vim 和 Neovim 的定位：模态编辑加上组合式的命令语言，纯键盘操作，效率极高。终端原生，启动极快，SSH 远程开发必备。Neovim 在此之上做现代化，带来 Lua、内置 LSP、Treesitter。SO 2024 调查里 Neovim 的 admiration 是所有编辑器最高的。

边界也很明显：学习曲线陡峭，那套命令语言需要肌肉记忆;开箱能力弱，要大量配置才能达到现代 IDE 的体验。这是它叫好但 adoption 不算最高的原因。
-->

---

# 模态编辑：为何高效

Normal 模式下**每个键都是命令**（非输入文本），动作**可组合、可计数、可重复**

| 模式 | 进入 |
| --- | --- |
| **Normal** | `Esc`（一切轴心） |
| **Insert** | `i I a A o O` |
| **Visual** | `v` / `V` / `Ctrl-V`（块） |
| **Command-line** | `:` `/` `?` |
| **Replace** | `R` |

<!--
模态编辑为什么高效？关键在 Normal 模式下，每个键都是命令，不是输入文本，于是整套编辑动作被压进单手可及的键位，而且可以组合、可以加计数、可以重复。这套编辑语言是 Vim 的灵魂。

模式记五个核心：Normal 是默认态、一切的轴心，Esc 永远回到这里;Insert 输入文本，i、a、o 这些进入;Visual 选区，v 字符、V 整行、Ctrl-V 块;Command-line 用冒号斜杠问号进入，敲 Ex 命令和搜索;Replace 用 R，逐字符覆盖。
-->

---

# 编辑语法核心（精髓）

公式：**`[count] operator [count] motion`**，两 count 相乘

<v-clicks>

- Motions：`w/b/e`（词）·`0/^/$`（行）·`gg/G`·`f{c}`·`%`（配对）
- `2d3w` = 删 6 个词
- `dw` 删到下一词 · `d$`/`D` 删到行尾 · `dd` 删整行

</v-clicks>

<!--
编辑语法是 Vim 的精髓，记住这个公式：可选计数、操作符、可选计数、移动。两个计数会相乘，比如 2d3w 就是删 6 个词。

移动 motions 常用的：w、b、e 按词移动，0、脱字符、美元符号在行内，gg 和 G 到文件首尾，f 加字符行内查找，百分号跳到配对括号。

操作符加移动就能组合：dw 删到下一个词，d 美元符号或者大写 D 删到行尾，双写 dd 删整行。这种组合让你像说话一样编辑。
-->

---

# operators + text objects

**Operators**：`d` 删 · `c` 改 · `y` 复制 · `>` 缩进 · `gU` 大写

**Text objects**：`i` 内层 / `a` 含界定符

<v-clicks>

- `i(` `a(`（括号）· `i"` `a"`（引号）· `it` `at`（标签）
- `ci"` 改引号内 · `dap` 删一段 · `yat` 复制整个标签块

</v-clicks>

<div v-click class="mt-2 text-rose-400">

⚠️ `cw` 等同 `ce`（不含词后空白），与 `dw` 不同

</div>

<!--
操作符常用 d 删、c 改、y 复制，还有缩进和大小写转换。

文本对象是 Vim 的杀手锏，i 表示内层不含界定符，a 表示包含界定符或周围空白。比如 i 左括号选括号内，a 双引号选含引号，it、at 选 HTML 标签。组合起来非常强：ci 双引号改引号内的内容，dap 删一整段，yat 复制整个标签块，连标签带内容。

一个高频易错点：cw 在词中时其实等同 ce，不包含词后的空白，和 dw 会删掉词后空白不一样。
-->

---

# 寄存器与宏

**寄存器**（`"{reg}` 前缀）：

<v-clicks>

- `"0` 最近 yank（删除不覆盖它，`"0p` 粘最后复制）
- `"a`-`"z` 命名，大写**追加**；`"_` 黑洞；`"+` 系统剪贴板

</v-clicks>

<div v-click class="mt-3">

**宏**：`q{reg}` 录制 → 操作 → `q` 停；`@{reg}` 回放，`10@a` 回放 10 次

</div>

<!--
寄存器用引号加名字指定。一个常被忽略的点：引号 0 寄存器专存最近一次 yank 复制，删除操作不会覆盖它，所以你删了东西之后还能用引号 0 p 粘回最后一次复制的内容。a 到 z 是命名寄存器，用大写名字是追加而不是覆盖。引号下划线是黑洞寄存器，删了不污染任何寄存器。引号加号是系统剪贴板。

宏是自动化神器：q 加寄存器名开始录制，做一遍操作，再按 q 停止，然后 @ 加名字回放，10@a 就回放 10 次。把重复操作录成宏，批量处理特别爽。
-->

---

# 查找替换与窗口

**查找替换**：`/pattern` 搜索 · `:%s/a/b/g` 全文替换 · 加 `c` 逐个确认

<div v-click class="mt-2 text-rose-400">

⚠️ 漏写 `g` 只替换每行第一个

</div>

<div v-click class="mt-4">

**缓冲区/窗口/标签**：buffer 内存文本 · window 视口 · tab 窗口集合

`:sp`/`:vsp` 分屏 · `Ctrl-W h/j/k/l` 导航 · `gt` 切标签

</div>

<!--
查找用斜杠加模式，n 和 N 上下跳。替换用冒号百分号 s，斜杠分隔旧新，结尾 g 表示行内全部替换，加 c 是逐个确认。一个坑：如果漏写 g，只替换每行的第一个匹配。

窗口体系要分清三个概念：buffer 是文件在内存里的文本，window 是看 buffer 的视口，tab 是一组窗口的集合。一个 buffer 可以被多个窗口显示。冒号 sp、vsp 水平垂直分屏，Ctrl-W 加 hjkl 在窗口间导航，gt 切换标签页。
-->

---

# 配置 .vimrc

```vim
syntax on
filetype plugin indent on
set number
set ignorecase smartcase
set tabstop=4 shiftwidth=4 expandtab
nnoremap <C-s> :w<CR>
```

<div v-click class="mt-3">

`set option` 开 · `set nooption` 关 · 映射推荐 `nnoremap`（非递归）

</div>

<!--
配置写在 vimrc 里，这是一份典型配置：syntax on 开语法高亮，filetype 那行开文件类型相关的插件和缩进，set number 显示行号，ignorecase 加 smartcase 是智能大小写搜索，tabstop 那些设置缩进，最后一行是把 Ctrl-S 映射成保存。

记两点：set option 开启、set nooption 关闭、set option 等号赋值;映射推荐用 nnoremap 这种非递归映射，避免映射递归触发出问题，别直接用 map。
-->

---

# Neovim vs Vim

| 维度 | Vim | Neovim |
| --- | --- | --- |
| 配置 | Vimscript（.vimrc） | **Lua**（init.lua） |
| LSP | 需插件 | **内置** vim.lsp |
| Treesitter | 无 | **内置** |
| 架构 | 单进程 | libuv 异步、UI 解耦 |

<div v-click class="mt-2 text-rose-400">

⚠️ init.lua 与 init.vim 不能并存，否则报 E5422

</div>

<!--
Neovim 是 Vim 2014 年起的 fork，核心差异看这张表。配置语言，Vim 用 Vimscript 写 vimrc，Neovim 把 Lua 作为一等公民，写 init.lua。LSP，Vim 要装插件，Neovim 内置了 vim.lsp。Treesitter，Vim 没有，Neovim 内置。架构上，Neovim 基于 libuv 异步，UI 和核心解耦，外部插件跑独立进程。

一个高频易错点：init.lua 和 init.vim 不能同时存在，否则报 E5422 错误。另外 Neovim 默认就开了语法高亮、文件类型检测、hlsearch 这些，Vim 要手动开。
-->

---

# Neovim：Lua + 内置 LSP

```lua
vim.o.number = true
vim.keymap.set('n', '<C-s>', ':w<CR>')
vim.lsp.enable('lua_ls')   -- 0.11 现代配置法
```

<v-clicks>

- `vim.opt`（对象，支持 :append）vs `vim.o`（标量）
- LSP 默认键位：`grn` 重命名 · `grr` 引用 · `K` 悬浮
- 内置 `vim.lsp` ≠ `nvim-lspconfig`（框架 vs 配置集）

</v-clicks>

<!--
Neovim 的配置用 Lua，比如 vim.o.number 开行号，vim.keymap.set 设键位，vim.lsp.enable 启用语言服务器，这是 0.11 的现代配置法。

几个要点：vim.opt 是对象式接口支持 append remove，vim.o 是标量;LSP 有默认键位，grn 重命名、grr 引用、大写 K 悬浮文档。

一个高频混淆点：内置的 vim.lsp 是个框架，nvim-lspconfig 是社区维护的各语言 server 预设配置集合，两个不是一回事，别搞混。
-->

---

# Neovim：Treesitter + 生态

**Treesitter**：增量解析语法树，比正则高亮更上下文感知

<v-clicks>

- 内置 parser 仅 c/lua/vim/vimdoc/markdown/query，其他用 nvim-treesitter
- 插件管理：**lazy.nvim**（主流，惰性加载）；内置 **vim.pack**
- 发行版：LazyVim / NvChad / AstroNvim / kickstart.nvim

</v-clicks>

<!--
Treesitter 是增量解析，产出语法树，驱动语义高亮，比传统正则的 syntax 更懂上下文。注意内置随附的 parser 只有 c、lua、vim、vimdoc、markdown、query 这几个，其他语言要用 nvim-treesitter 插件装，nvim-treesitter 也不等于核心集成。

生态方面，插件管理现在主流是 lazy.nvim，按需惰性加载、有锁文件，packer 已经停止维护;Neovim 0.12 还内置了 vim.pack。新手不想从零配，可以用发行版：LazyVim、NvChad、AstroNvim，或者 kickstart.nvim 这个单文件入门模板边读边学。
-->

---
layout: center
class: text-center
---

# 总结

Vim/Neovim = 模态编辑的命令语言 + Neovim 的现代化

operator+motion+text object · 寄存器宏 · Lua/init.lua · 内置 LSP/Treesitter · lazy.nvim

<div class="mt-8 flex justify-center gap-6 text-xl">
  <a href="https://neovim.io/doc/" target="_blank">📖 Neovim 文档</a>
  <a href="https://vimhelp.org" target="_blank">📖 Vim 帮助</a>
</div>

<!--
总结：Vim 和 Neovim 的核心是模态编辑的那套命令语言，加上 Neovim 带来的现代化。

抓手记牢：operator 加 motion 加 text object 的组合语法、寄存器和宏、Neovim 的 Lua 配置 init.lua、内置 LSP 和 Treesitter、lazy.nvim 插件管理。学习曲线陡，但一旦掌握，编辑效率的天花板很高。谢谢。
-->
