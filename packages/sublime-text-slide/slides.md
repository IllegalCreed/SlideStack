---
theme: seriph
background: https://cover.sli.dev
title: Sublime Text — 极速原生编辑器
info: |
  Presentation Sublime Text — C++ 原生编写的极速跨平台编辑器，多光标与 Goto Anything 著称。

  Learn more at [https://www.sublimetext.com](https://www.sublimetext.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎯</span>
</div>

<br/>

## Sublime Text — 极速原生编辑器

C++ 原生编写、极快低耗的跨平台代码编辑器，以多光标与 Goto Anything 著称

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://www.sublimetext.com/docs/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
今天聊 Sublime Text：一个 C++ 原生编写、极快极省资源的跨平台代码编辑器。

在 Electron 编辑器当道的今天，它代表轻量原生这条路：启动快、大文件不卡。最著名的两个特性是多光标编辑和 Goto Anything 导航。

主线：定位 → 多光标 → Goto Anything → Command Palette 与导航 → Package Control → 配置 → 项目 → 构建 → 对比 VS Code → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么

<v-clicks>

- ✅ **C++ 原生**、极快、低资源，大文件流畅
- ✅ 多光标/多选编辑强大；Goto Anything 导航
- ✅ ST4 GPU 渲染（三端，最高 8K）

</v-clicks>

<div v-click class="mt-6">

边界：

- ❌ 商业授权（可无限期评估，持续用需 $99）
- ❌ LSP 非内置（需第三方包）；生态小于 VS Code

</div>

<!--
Sublime Text 的定位：C++ 原生编写，极快、低资源，大文件处理特别流畅，这是它相对 Electron 编辑器的核心优势。强项是多光标多选编辑和 Goto Anything 快速导航。ST4 还支持三端的 GPU 渲染，最高 8K。

边界两条：它是商业软件，可以无限期免费评估，但持续使用需要买，个人版 99 美元;LSP 语言能力不是内置的，要装第三方 LSP 包，扩展生态也比 VS Code 小很多。
-->

---

# 多光标 / 多选（核心卖点）

| 功能 | Win/Linux | 术语 |
| --- | --- | --- |
| 选下一个相同词 | `Ctrl+D` | **Quick Add Next** |
| 跳过当前匹配 | `Ctrl+K, Ctrl+D` | Quick Skip Next |
| 选全部相同 | `Alt+F3` | **Find All** |
| 拆分选区为多行光标 | `Ctrl+Shift+L` | Split into lines |

<div v-click class="mt-3 text-rose-400">

⚠️ 选下一个是 Ctrl+D；选全部是 Alt+F3（别混）

</div>

<!--
多光标是 Sublime 的招牌。Ctrl+D 选下一个相同的词，每按一次多加一个光标，这叫 Quick Add Next;如果某个匹配不想选，Ctrl+K 再 Ctrl+D 跳过它;Alt+F3 一次选中全部相同的词，叫 Find All;Ctrl+Shift+L 把一个选区拆成多行光标。

一个易错点：选下一个是 Ctrl+D，选全部是 Alt+F3，别把这两个搞混。列选择不是独立模式，而是用多重选区选中矩形区域。
-->

---

# Goto Anything

`Ctrl+P` 打开，用前缀切换模式：

<v-clicks>

- `@` → 跳转**符号**（本文件）
- `:` → 跳转**行号**
- `#` → 文件内**模糊搜索**
- 可组合：`文件名@符号`、`文件名:行号`

</v-clicks>

<!--
Goto Anything 是 Sublime 的另一招牌，Ctrl+P 打开。它用前缀切换模式：直接输文件名是模糊找文件;输 @ 跳转本文件的符号，比如函数、类;输冒号跳行号;输井号在文件内模糊搜索文本。

最强的是可以组合，比如先输文件名再接 @ 符号，就能一步跳到某个文件的某个函数。这套前缀语法记熟了，导航如飞。注意 @ 是符号、冒号是行号、井号是文件内搜索，别记混。
-->

---

# Command Palette 与导航

`Ctrl+Shift+P` 打开 Command Palette，模糊匹配执行命令

<v-clicks>

- Goto Definition：`F12` · Goto References：`Shift+F12`
- Goto Symbol（本文件）：`Ctrl+R`
- Goto Symbol in Project：`Ctrl+Shift+R`

</v-clicks>

<!--
Command Palette 是 Ctrl+Shift+P，模糊匹配执行各种命令，比如新建构建系统、切换设置。注意它和 Goto Anything 的快捷键容易搞混：Goto Anything 是 Ctrl+P，Command Palette 是 Ctrl+Shift+P。

代码导航方面，F12 跳到定义，Shift+F12 看引用，Ctrl+R 跳本文件的符号，Ctrl+Shift+R 跨项目搜符号。这些由索引引擎驱动，默认开启。
-->

---

# Package Control 与配置

**Package Control**：社区事实标准的包管理器

<div v-click class="mt-2 text-rose-400">

⚠️ Package Control 不是官方内置，需先安装

</div>

<div v-click class="mt-4">

**配置纯 JSON**：

- Default 勿改；自定义写 `Packages/User/Preferences.sublime-settings`
- 跨平台修饰键用 `primary`（Win/Linux=Ctrl，Mac=⌘）

</div>

<!--
Package Control 是 Sublime 的包管理器，但要注意它不是官方内置的，是社区事实标准，你得先装它，之后才能用 Command Palette 的 Package Control Install Package 装包。

配置是纯 JSON 文本，没有图形界面。原则是 Default 文件不要改，自定义都写到 User 目录下的 Preferences.sublime-settings。写跨平台键位时用 primary 这个修饰键，它在 Win 和 Linux 上是 Ctrl，在 Mac 上是 Command，省得分平台写两份。
-->

---

# 配置优先级（易错）

后者覆盖前者：

```text
Default → 平台特定 → User → Project
       → 语法特定(User) → buffer 特定
```

<div v-click class="mt-4 text-rose-400">

⚠️ 语法特定设置（User 级）优先级**高于** Project —— 项目设置不能覆盖语法特定设置

</div>

<!--
配置优先级是个高频易错点。顺序是后者覆盖前者：默认、平台特定、用户 User、项目 Project、语法特定、buffer 特定。

关键的坑在这里：语法特定设置，也就是 User 级的某语言设置，优先级是高于项目设置的。换句话说，项目设置不能覆盖语法特定设置。很多人以为项目设置最大，其实语法特定的还在它后面、优先级更高。记住这个顺序，配置才不会出意外。
-->

---

# 项目与构建

| 文件 | 用途 | 版本控制 |
| --- | --- | --- |
| `.sublime-project` | 项目定义 | **入** |
| `.sublime-workspace` | 个人会话状态 | **不入** |

<div v-click class="mt-4">

**构建系统** `.sublime-build`：`Ctrl+B` 运行；`shell_cmd` 优先于 `cmd`（且支持管道/重定向）

</div>

<!--
项目有两个文件，别搞反：.sublime-project 是项目定义，包含文件夹、设置、构建系统，要入版本控制、可以共享给团队;.sublime-workspace 是个人会话状态，记录你打开了哪些文件、光标在哪，不入版本控制。

构建系统写在 .sublime-build 文件里，Ctrl+B 运行，F7 也行，Ctrl+Shift+B 选变体。一个细节：里面有 shell_cmd 和 cmd 两个字段，shell_cmd 优先于 cmd，而且只有 shell_cmd 支持管道和重定向这些 shell 特性。语法定义用 .sublime-syntax，是 YAML，取代了旧的 tmLanguage。
-->

---

# vs VS Code

| 维度 | Sublime Text | VS Code |
| --- | --- | --- |
| 实现 | **C++ 原生** | Electron |
| 性能 | 极快、低耗 | 资源较高 |
| 授权 | 商业（评估免费） | 免费开源 |
| LSP | 第三方包 | 内置 |
| 生态 | 较小 | 庞大 |

<!--
和 VS Code 怎么选？实现上 Sublime 是 C++ 原生，VS Code 是 Electron;性能上 Sublime 极快、省资源，大文件优势明显;授权上 Sublime 是商业软件可免费评估，VS Code 免费开源;LSP 语言能力，Sublime 靠第三方包，VS Code 内置开箱即用;生态上 VS Code 庞大得多。

一句话：要极致速度和轻量、又不介意付费，选 Sublime;要开箱即用的语言能力和庞大生态，选 VS Code。很多人把 Sublime 当快速打开大文件、做多光标批量编辑的利器，主力 IDE 用别的。
-->

---
layout: center
class: text-center
---

# 总结

Sublime Text = C++ 原生的极速编辑器

多光标(Quick Add Next) · Goto Anything(@:#) · Command Palette · Package Control · 纯 JSON 配置

<div class="mt-8 flex justify-center gap-6 text-xl">
  <a href="https://www.sublimetext.com/docs/" target="_blank">📖 官方文档</a>
  <a href="https://www.sublimetext.com" target="_blank">⬇️ 下载</a>
</div>

<!--
总结：Sublime Text 是 C++ 原生的极速编辑器。

抓手记牢：多光标的 Quick Add Next，Ctrl+D;Goto Anything 的三个前缀 @ 符号、冒号行号、井号文件内搜;Command Palette 是 Ctrl+Shift+P;Package Control 包管理（注意是第三方）;纯 JSON 配置加优先级。它卖的是速度和轻量，是大文件和批量编辑的利器。谢谢。
-->
