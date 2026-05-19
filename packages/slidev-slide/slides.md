---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Slidev
info: |
  Presentation Slidev for developers.

  Learn more at [https://sli.dev/](https://sli.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center text-9xl">
  🎞
</div>

<br/>

## Slidev：用 Markdown 写演讲文稿

面向开发者的现代化幻灯片工具（基于 v52.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天讲 Slidev——一个面向开发者的现代化幻灯片工具。
有意思的是，这套讲 Slidev 的幻灯片本身就是用 Slidev 做的。

它的核心卖点是：用 Markdown 写演讲，但又可以嵌 Vue 组件、Shiki 代码高亮、动画、Twoslash 类型悬浮，全是开发者熟悉的东西。
-->

---
transition: fade-out
---

# 什么是 Slidev？

为开发者设计的 Web 幻灯片工具

<v-click>

- **Markdown 为主**：内容用 Markdown 写，所见即所得
- **Vue 组件**：直接在 Markdown 里嵌 `<MyComponent />`
- **代码块强大**：Shiki 高亮 / Monaco 可编辑 / TwoSlash 类型悬浮 / magic-move 动画
- **真正的演讲者模式**：演讲者视图 + 备注 + 拖拽 + 录屏
- **导出灵活**：PDF / PPTX / PNG / Markdown 都行
- **基于 Vite + Vue 3**：HMR 流畅，配置可编程

</v-click>

<br>

<div v-click>

```bash
pnpm create slidev   # 一条命令搞定脚手架
```

</div>

<div v-click text-xs>

_Read more about_ [_What is Slidev?_](https://sli.dev/guide/)

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #5d8392 10%, #2B90B6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Slidev 把"开发者熟悉的栈"原样搬到幻灯片：Markdown / Vue / Vite / Shiki / Twoslash / Iconify。
你写 README 怎么舒服，写 slides.md 就是一样的舒服。

[click] 脚手架一条命令就好。官方推荐 pnpm / yarn / bun 这类有缓存的包管理器，不推荐 npm（每次都重下）。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 安装与第一个 slides.md

三步起步

::left::

<v-click>

**脚手架（推荐）**

```bash
pnpm create slidev
```

询问项目名 / 主题 / 模板后生成项目。

**启动开发服务器**

```bash
pnpm dev
# 等价：slidev --open
```

</v-click>

::right::

<v-click>

**最小 `slides.md`**

```markdown
---
theme: seriph
---

# Hello

---

# 第二页
```

`---` 分隔幻灯片；头部 frontmatter（headmatter）控制整个 deck。

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Install_](https://sli.dev/guide/install)

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #5d8392 10%, #2B90B6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 脚手架最快，pnpm create slidev 一条命令完事。
注意：官方明确不推荐 npm init slidev@latest——npm 每次都重新下载所有包，pnpm/yarn/bun 有缓存复用。

[click] 写法非常熟悉：用 `---` 分隔幻灯片，每页就是一段 Markdown。
顶部的 frontmatter 叫 headmatter，控制整个 deck 的 theme/title/info 等。
-->

---
transition: fade-out
---

# Markdown 语法扩展

每页都可以有 frontmatter / 备注 / scoped CSS

<v-click>

````markdown
---
layout: cover
transition: fade-out
---

# 封面页

副标题

<!-- 备注：演讲者视图可见，支持 [click] 标记 -->

<style>
h1 { color: red }
</style>
````

</v-click>

<div v-click>

- 每页头部可以单独写 frontmatter（**层叠**于 headmatter）
- 末尾的 `<!-- -->` 注释会作为**演讲者备注**
- `<style>` 默认是 **scoped**，只影响当前页

</div>

<div v-click text-xs text-right>

_Read more about_ [_Syntax_](https://sli.dev/guide/syntax)

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #5d8392 10%, #2B90B6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 一段示例展示了三层结构：frontmatter / 内容 / 备注 / scoped 样式。

[click] 三个要点：
- frontmatter 是页级配置，覆盖 headmatter
- 末尾的 HTML 注释是备注，只在演讲者视图显示
- style 默认 scoped，不污染别的页
-->

---
transition: fade-out
---

# 代码块：Slidev 的杀手锏

Shiki + Monaco + TwoSlash + magic-move

<v-click>

````markdown
```ts {2,3|all}{maxHeight:'200px'}
function add(a: number, b: number) {
  return a + b
}
```
````

- **逐行高亮**：`{2,3|all}` —— `|` 分隔步骤，按 Space 切换
- **最大高度**：`{maxHeight:'200px'}`

</v-click>

<div v-click>

```md
[三个反引号]ts {monaco-run}    # 代码块可编辑 + 可运行
[三个反引号]ts twoslash       # 类型悬浮（IDE 同款）
```

`{monaco}` 让代码块可编辑，`{monaco-run}` 还能运行；`twoslash` 提供类型悬浮。

</div>

<div v-click text-xs text-right>

_Read more about_ [_Code Blocks_](https://sli.dev/features/shiki-magic-move)

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #5d8392 10%, #2B90B6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 单是行高亮+步骤切换这一点，就比 PPT 强一万倍。
按 Space 不切片，切的是同一段代码的不同高亮组合。
maxHeight 控制溢出，对长代码很有用。

[click] monaco / monaco-run 让代码块直接变成 IDE / REPL；twoslash 提供 IDE 同款类型悬浮。
讲技术分享时这些功能基本能取代"切到 VS Code 演示"那一步。
-->

---
transition: fade-out
---

# magic-move：代码"变形"

让代码片段之间做平滑过渡

<v-click>

用 `md magic-move` 包裹多个连续代码块，按 Space 在它们之间做"逐 token 平滑过渡"：

```md
[三个反引号]md magic-move
[三个反引号]js
const greet = (name) => { return 'Hello ' + name }
[三个反引号]

[三个反引号]ts
const greet = (name: string): string => `Hello, ${name}!`
[三个反引号]
[三个反引号]
```

</v-click>

<div v-click>

- 按 Space 在不同代码版本之间**逐 token 平滑过渡**
- 适合演示重构、类型迁移、API 变化
- 底层基于 `shiki-magic-move`

</div>

<div v-click text-xs text-right>

_Read more about_ [_Shiki Magic Move_](https://sli.dev/features/shiki-magic-move)

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #5d8392 10%, #2B90B6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] magic-move 是 Slidev 的招牌。把多个代码块用 ````md magic-move 包起来，按 Space 时不是直接切换，
而是逐 token 平滑变形——演示 JS → TS、重构前 / 后这种场景巨好用。

[click] 底层是 shiki-magic-move，Slidev 把它集成进来开箱即用。
-->

---
transition: fade-out
---

# 动画指令

`v-click` / `v-clicks` / `v-after`

<v-click>

```markdown
<div v-click>第 1 次 Space 显示</div>
<div v-click>第 2 次 Space 显示（自动递增）</div>
<div v-click="3">无论顺序，固定第 3 步显示</div>
<div v-click="'+1'">在前一个 v-click 之后再过 1 步</div>
<div v-after>与前一个 v-click 同时出现</div>
```

</v-click>

<div v-click>

**v-clicks**（复数）：列表逐项出现，每个 `<li>` 自占一次 click

```markdown
<v-clicks>

- 第一条
- 第二条

</v-clicks>
```

**数组语法 `[显示步, 隐藏步]`**（无需 `.hide` 修饰符）：

```markdown
<div v-click="[2, 4]">第 2 步显示，第 4 步隐藏</div>
```

</div>

<div v-click text-xs text-right>

_Read more about_ [_Animations_](https://sli.dev/guide/animations)

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #5d8392 10%, #2B90B6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v-click 是最常用的动画指令。可以隐式递增，也可以传绝对/相对步数。
v-after 等价于 v-click="'+0'"，让两个元素同步出现。

[click] v-clicks 是复数版本，专门用来让列表逐条出现，每个 li 自占一次点击。

[click] 数组语法表达"显示 → 隐藏"，第 2 步显示、第 4 步隐藏，无需 .hide 修饰符。
-->

---
transition: fade-out
---

# 内置布局

每页 frontmatter 用 `layout:` 选

<v-click>

| 布局                                | 用途                            |
| ----------------------------------- | ------------------------------- |
| `default` / `cover` / `intro` / `center` | 标准 / 封面 / 演讲介绍 / 居中   |
| `two-cols` / `two-cols-header`      | 左右两栏（可加 header / 底部）  |
| `image-left` / `image-right` / `iframe-right` | 图片或 iframe 占一半            |
| `quote` / `statement` / `fact`      | 大字版 / 引用                   |
| `section` / `end`                   | 章节分隔 / 演讲结束             |

</v-click>

<div v-click>

主题（如 `seriph`）会扩展更多布局；自定义只需在 `layouts/MyLayout.vue` 里实现，frontmatter 写 `layout: my-layout`。

</div>

<div v-click text-xs text-right>

_Read more about_ [_Layouts_](https://sli.dev/builtin/layouts)

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #5d8392 10%, #2B90B6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这套内置布局基本覆盖技术分享的所有场景。
新手最常踩坑：不知道有 two-cols-header，于是手动 div 套 grid——其实直接 layout: two-cols-header 就行。

[click] 主题会扩展更多布局，自定义也只是在 layouts/ 下放个 .vue。
-->

---
transition: fade-out
---

# 主题与 Addons

`headmatter` 中切换

<v-click>

```yaml
---
theme: seriph                  # 主题：包名（去掉 slidev-theme- 前缀）
addons:                        # 附加插件
  - excalidraw
  - python-runner
---
```

</v-click>

<div v-click>

- **theme** 提供整体视觉 + 自定义布局 + 字体（自动 Google Fonts）
- **addons** 添加局部功能（如 Excalidraw 绘图、Python 运行器）
- 用 `slidev theme eject` 把主题样式拉到本地，直接二次定制
- 主题 / addon 都是 npm 包，命名约定：`slidev-theme-*` / `slidev-addon-*`

</div>

<div v-click>

```bash
slidev theme eject               # 把主题样式拉到 ./theme
```

</div>

<div v-click text-xs text-right>

_Read more about_ [_Theme / Addon_](https://sli.dev/guide/theme-addon)

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #5d8392 10%, #2B90B6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 主题和 addon 都靠 npm 包。命名约定 slidev-theme-x / slidev-addon-x，写在 headmatter 里就生效。

[click] 注意 theme 控字体——seriph 主题自动从 Google Fonts 拉 Roboto / Roboto Slab，不用自己配。
eject 命令把主题样式抽到本地，方便二次定制。
-->

---
transition: fade-out
---

# 图标：Iconify 全宇宙

任意图标随手用

<v-click>

```markdown
<carbon:logo-github />
<logos:vue />
<mdi:fire class="text-red-500 text-4xl" />
```

- 内置 `unplugin-icons`：写法 `<集合名:图标名 />`
- 想用某集合先装：`pnpm add -D @iconify-json/<集合名>`
- 常用集合：`carbon` / `logos` / `mdi` / `tabler` / `ph` / `simple-icons`

</v-click>

<br>

<div v-click class="text-6xl flex gap-6 items-center">

  <logos:vue />
  <logos:typescript-icon />
  <logos:vitejs />
  <carbon:cloud />
  <mdi:fire class="text-red-500" />

</div>

<div v-click text-xs text-right>

_Read more about_ [_Icons_](https://sli.dev/features/icons)

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #5d8392 10%, #2B90B6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Slidev 集成 Iconify 全套——10 万+ 图标随手写。
集合名:图标名，搜图标用 https://icones.js.org。

[click] UnoCSS 类直接加在上面调色 / 调大小，跟普通元素一样。
-->

---
transition: fade-out
---

# 导出：PDF / PPTX / PNG / Markdown

```bash
slidev export                # 默认 pdf
slidev export --format pptx
slidev export --format png
slidev export --format md
```

<v-click>

| 选项                                       | 说明                          |
| ------------------------------------------ | ----------------------------- |
| `--with-clicks` / `--with-toc`             | 按动画步导出 / PDF 大纲       |
| `--dark` / `--range 1,4-5`                 | 暗色 / 指定页                 |
| `--timeout 60000` / `--executable-path`    | 超时 / 自定义浏览器路径       |
| `--without-notes`                          | 不含演讲者备注（`build` 也有）|

依赖 **Playwright**（首次运行会装 Chromium）；国内可设 `PLAYWRIGHT_DOWNLOAD_HOST` 走镜像。

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Exporting_](https://sli.dev/guide/exporting)

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #5d8392 10%, #2B90B6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 导出 4 种格式，--with-clicks 把每个动画步骤导成一页是技术分享发 PDF 时常用。
--with-toc 让 PDF 自带可点击大纲，给读者跳转方便。

[click] 注意 Playwright 依赖。国内第一次跑会卡，建议用 PLAYWRIGHT_DOWNLOAD_HOST 镜像。
-->

---
transition: fade-out
---

# 部署：SPA + 静态托管

```bash
slidev build --base /my-talk/
```

<v-click>

- 产物在 `dist/`，可直接传到任意静态托管
- `--base` 设置子路径（GitHub Pages / 子目录部署用）
- `--download true` 在演讲页面附加 PDF 下载按钮
- `--without-notes` 不暴露演讲者备注

</v-click>

<div v-click>

**GitHub Pages 模板**：

```yaml
# .github/workflows/deploy.yml
- uses: actions/checkout@v4
- uses: pnpm/action-setup@v4
- run: pnpm install
- run: pnpm slidev build --base /my-talk/
- uses: peaceiris/actions-gh-pages@v4
  with:
    publish_dir: ./dist
```

</div>

<div v-click text-xs text-right>

_Read more about_ [_Hosting_](https://sli.dev/guide/hosting)

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #5d8392 10%, #2B90B6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 构建产物就是一个 SPA。--base 处理子路径，--download 给观众一键下 PDF。
默认会暴露演讲者备注，--without-notes 防止外网偷看 notes。

[click] GitHub Pages 经典模板，配合 pnpm/action-setup + peaceiris/actions-gh-pages，一次写好长期复用。
-->

---
layout: intro
transition: fade-out
---

# 总结

Slidev 把"写代码的工具链"原样搬到幻灯片

- **Markdown + Vue + Vite** ⇒ 开发者熟悉的栈
- **Shiki + Twoslash + magic-move** ⇒ 代码演示天花板
- **v-click / v-clicks + 数组** ⇒ 精细的动画控制
- **PDF / PPTX / PNG / MD 全格式导出** ⇒ 适配各种分享场景

<div class="abs-br m-6 text-xl">
  <a href="https://sli.dev" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
  <a href="https://github.com/slidevjs/slidev" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/frontend-framework/ssg/slidev/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #5d8392 10%, #2B90B6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Slidev 的精髓：用写代码的方式做幻灯片。
跟 PPT / Keynote 不是同维度的产品——它是给"想把代码演示做漂亮"的人准备的。
-->

---
layout: end
---
