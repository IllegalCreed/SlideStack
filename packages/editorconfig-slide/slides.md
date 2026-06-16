---
theme: seriph
background: https://cover.sli.dev
title: Welcome to EditorConfig
info: |
  Presentation about EditorConfig for developers.

  Learn more at [https://editorconfig.org/](https://editorconfig.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# EditorConfig

跨编辑器统一基础代码风格的配置规范（基于官方 spec）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/editorconfig/editorconfig" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天聊 EditorConfig —— 它不是 linter，也不是格式化器，而是一份"跨编辑器"的配置规范。
解决的就是同一个项目里，不同人用不同编辑器，缩进、换行、编码各搞各的这个老问题。
-->

---
transition: fade-out
---

# 什么是 EditorConfig？

一份文件格式 + 一组编辑器插件，统一团队的基础代码风格

<v-clicks>

- 不是 linter、不是格式化器，而是**跨编辑器配置规范**
- 在项目放一个 `.editorconfig`，约束缩进 / 换行 / 编码等基础行为
- 很多编辑器**原生支持**（VS Code、JetBrains、Vim/Neovim…），其余装插件
- 无单一软件版本，npm 包 `editorconfig` 只是其官方解析器库

</v-clicks>

<div v-click="'+1'" text-xs mt-4>

_Read more about_ [_EditorConfig overview_](https://editorconfig.org/)

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
EditorConfig 由两部分组成：一份文件格式，和一堆编辑器插件。

[click] 关键认知：它不是 linter 也不是格式化器，而是统一编辑器基础行为的规范。

[click] 用法就是在项目放一个 .editorconfig 文件，约束缩进、换行、编码这些最基础的东西。

[click] 好消息是很多主流编辑器原生就支持，不支持的装个插件即可。

[click] 它没有"软件版本"一说，你在 npm 看到的 editorconfig 包只是官方提供的解析器库。
-->

---
transition: fade-out
---

# 一个 `.editorconfig` 示例

放在项目根，`root = true` 标记为顶层

<div v-click>

```ini
# 顶层文件，停止向上查找
root = true

[*]                          # 匹配所有文件
end_of_line = lf
insert_final_newline = true
charset = utf-8
trim_trailing_whitespace = true

[*.py]                       # 仅 Python
indent_style = space
indent_size = 4

[Makefile]                   # Make 必须用真 Tab
indent_style = tab
```

</div>

<div v-click text-xs mt-2>

INI 风格：`[glob]` 段 + `key = value` 对；`#` 或 `;` 注释独占一行；UTF-8 编码

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
看一个真实的例子。

[click] 文件放项目根。第一行 root = true 表示这是顶层配置，往上找到这里就停。
然后用方括号写 glob 段：[*] 匹配所有文件，设统一换行、末尾空行、编码、去尾随空格；
[*.py] 单独给 Python 设 4 空格；[Makefile] 必须用真正的 Tab，否则 make 报错。

[click] 格式本质是 INI：方括号段 + 键值对，井号或分号注释独占一行，文件用 UTF-8。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 文件查找与 root

就近覆盖，逐级向上

::left::

<div v-click>

- 打开文件时，从**所在目录逐级向上**找 `.editorconfig`
- 遇到 `root = true` 或到达根目录就**停止**
- 越**靠近**目标文件的配置，优先级越高

</div>

<div v-click mt-2>

```bash
project/.editorconfig   # root = true
project/src/.editorconfig
project/src/app.ts      # ← 打开它
# 生效顺序：root → src，src 覆盖 root
```

</div>

::right::

<div v-click>

- 同一文件内，**靠后的段**覆盖靠前的段
- 不写 `root`，会继续向上查找父目录
- 子目录放各自的 `.editorconfig`，天然适配 monorepo

</div>

<div v-click mt-2>

<span text-xs text-gray>多个 `.editorconfig` 自顶向下读取，后读到的键值对取胜</span>

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
EditorConfig 怎么决定用哪份配置？

[click] 打开一个文件，插件从它所在目录开始逐级往上找 .editorconfig。

[click] 遇到 root = true，或者到了文件系统根，就停。越靠近目标文件的配置优先级越高。

[click] 同一个文件里，写在后面的段会覆盖前面的段。

[click] 如果不写 root，就会一直往上找父目录。子目录放各自的配置，正好适配 monorepo。
-->

---
transition: fade-out
---

# 通用属性

跨编辑器广泛支持的一组（键名/取值**大小写不敏感**，`unset` 可取消某属性）

<div v-click>

| 属性                       | 取值                                          |
| -------------------------- | --------------------------------------------- |
| `indent_style`             | `tab` / `space`                               |
| `indent_size`              | 整数（软 tab 宽度）                           |
| `tab_width`                | 整数（默认取 `indent_size`）                  |
| `end_of_line`              | `lf` / `cr` / `crlf`                          |
| `charset`                  | `utf-8` / `utf-8-bom` / `latin1` / `utf-16le` |
| `trim_trailing_whitespace` | `true` / `false`                              |
| `insert_final_newline`     | `true` / `false`                              |

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这是跨编辑器广泛支持的通用属性集。

[click] 缩进风格 tab 还是 space；缩进宽度 indent_size；tab_width 默认跟随 indent_size；
换行 lf/cr/crlf；编码 charset 一组；去尾随空格、文件末尾留空行，都是布尔。

[click] 两个细节：所有键名和取值大小写不敏感，解析时会被小写化；任意属性都能用 unset 取消之前的设置。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# glob 段匹配

段名是 glob，规则类似 .gitignore

::left::

<div v-click>

- `*` 匹配任意字符，但**不跨** `/`
- `**` 匹配任意字符，**可跨**目录
- `?` 匹配单个字符
- `[name]` / `[!name]` 字符集（取反）

</div>

::right::

<div v-click>

- `{s1,s2}` 匹配其中任一字符串
- `{num1..num2}` 匹配范围内整数
- 段名**不含** `/`：在任意层级匹配
- 段名**含** `/`：相对该 `.editorconfig` 目录

</div>

::bottom::

<div v-click mt-3>

```ini
[*.{js,ts,jsx}]        # 多扩展名
[lib/**.js]            # lib 下任意深度的 .js
[{package.json,.travis.yml}]   # 精确匹配若干文件
```

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
方括号里的段名是 glob 模式，规则和 gitignore 很像。

[click] 单星号匹配任意字符但不跨斜杠；双星号可以跨目录；问号匹配单个字符；方括号是字符集，叹号取反。

[click] 大括号逗号是"任选其一"；两个点是整数范围。还有个关键点：段名不含斜杠时在任意层级匹配，
含斜杠时则相对当前 .editorconfig 所在目录。

[click] 例子：花括号匹配多扩展名；lib 双星号匹配任意深度的 js；花括号也能精确点名几个文件。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# indent_size 与 tab_width

容易被忽视的细节

::left::

<div v-click>

- `tab_width` **默认等于** `indent_size`，通常无需单独写
- `indent_size = tab` 时：缩进宽度取 `tab_width`（未设则取编辑器默认）

</div>

<div v-click mt-2>

```ini
[*.go]
indent_style = tab
indent_size = tab    # 跟随用户的 tab 宽度
```

</div>

::right::

<div v-click>

- 用 `tab` 缩进时，**留空** `indent_size`，让每个人自选可视宽度
- 项目里某属性没共识，不如**直接不写**——交给编辑器默认

</div>

<div v-click mt-2>

<span text-xs text-gray>"少即是多"：只声明团队真正达成一致的属性</span>

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
indent_size 和 tab_width 有个容易踩的细节。

[click] tab_width 默认就等于 indent_size，一般不用单独写。而 indent_size 设成字面量 tab 时，
缩进宽度取 tab_width，没设就取编辑器默认。

[click] Go 这种用 Tab 缩进的语言，配 indent_style = tab、indent_size = tab，就能跟随每个人的 tab 宽度。

[click] 反过来，用 Tab 缩进时干脆留空 indent_size，让大家自选可视宽度。

[click] 一个属性团队没共识，不如不写，交给编辑器默认。少即是多。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 编辑器支持

原生支持 vs 需要插件

::left::

<div v-click>

### 原生支持（开箱即用）

- VS Code、GitHub / GitLab
- JetBrains 全家桶（IDEA / WebStorm…）
- Vim / Neovim、Emacs、BBEdit

</div>

::right::

<div v-click>

### 需要插件

- Sublime Text、Atom
- Notepad++、Eclipse、Brackets

</div>

<div v-click mt-2>

<span text-xs text-gray>`max_line_length` 等属性仅部分编辑器（Vim/Emacs/JetBrains/Prettier 等）支持</span>

</div>

::bottom::

<div v-click mt-3 text-sm>

约定：装好支持后，把 `.editorconfig` 提交进仓库即可对全团队生效。

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
编辑器支持分两类。

[click] 一类原生支持，开箱即用：VS Code、GitHub、GitLab、JetBrains 全家桶、Vim、Neovim、Emacs 等。

[click] 另一类需要装插件：Sublime、Atom、Notepad++、Eclipse、Brackets 等。

[click] 注意 max_line_length 这类属性只有部分编辑器支持，不是人人都认。

[click] 用法很简单：装好支持，把 .editorconfig 提交进仓库，全团队就都生效了。
-->

---
transition: fade-out
---

# 和 Prettier / Stylelint 的关系

互补，而非替代

<v-clicks>

- EditorConfig 管**编辑器基础行为**：缩进、换行、编码、末尾空行
- 格式化器（Prettier）管**更细的代码风格**：引号、分号、换行折叠…
- **Prettier 会读取** `.editorconfig`，缺省时以它为基线（如 `tab_width`）
- 两者职责不重叠，常**搭配使用**：EditorConfig 兜底 + 格式化器精修

</v-clicks>

<div v-click="'+1'" text-xs mt-4>

_Read more about_ [_EditorConfig properties_](https://github.com/editorconfig/editorconfig/wiki/EditorConfig-Properties)

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
经常有人问它和 Prettier 冲不冲突。

[click] EditorConfig 管的是编辑器基础行为：缩进、换行、编码、末尾空行。

[click] Prettier 这类格式化器管更细的风格：引号、分号、换行折叠。

[click] 而且 Prettier 会主动读取 .editorconfig，自己没配的项就以它为基线，比如 tab_width。

[click] 所以两者职责不重叠，是搭配关系：EditorConfig 兜底，格式化器精修。
-->

---
layout: intro
transition: fade-out
---

# 结尾与号召

五分钟统一全队的基础风格

- 一个 `.editorconfig` 文件，跨编辑器、零运行时
- 别和格式化器抢活，专注缩进 / 换行 / 编码
- 现在就在项目根加上 `.editorconfig`，提交进仓库！

<div class="abs-br m-6 text-xl">
  <a href="https://editorconfig.org/" target="_blank" class="slidev-icon-btn">
    <carbon:earth />
  </a>
  <a href="https://github.com/editorconfig/editorconfig" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/frontend-develop-tools/static-analysis/editorconfig/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这就是 EditorConfig。

一个文件，跨编辑器、零运行时；别和格式化器抢活，专注最基础的缩进、换行、编码。

现在就在你的项目根加一个 .editorconfig，提交进仓库，全队的基础风格立刻统一。文档、GitHub、笔记都在下面。
-->

---
layout: end
---
