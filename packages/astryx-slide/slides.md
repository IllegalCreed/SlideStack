---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Astryx
info: |
  Presentation Astryx —— Meta 开源、AI 原生的 React 设计系统（基于 StyleX）。

  Learn more at [https://astryx.atmeta.com](https://astryx.atmeta.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🌟</span>
</div>

<br/>

## Astryx —— Meta 开源、AI 原生的 React 设计系统

基于 StyleX 编译期原子化 CSS · 150+ 无障碍组件 · 托管 MCP · 当前 v0.1.3（Beta）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/facebook/astryx" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Astryx —— Meta 于 2026 年 6 月开源的 React 设计系统。它在 Meta 内部沉淀了约 8 年、驱动 13000 多个应用后才对外开源，样式引擎是同门的 StyleX，走编译期原子化 CSS 路线。

三个记忆锚点：一，它是真正的 npm 受管依赖，不是 shadcn 那种复制源码；二，样式在构建期编译成原子 CSS，运行时零开销；三，它从底层为 AI agent 设计，自带托管 MCP server 和机器可读的命令契约。当前版本 0.1.3，还是 Beta，MIT 许可。

今天的顺序：定位与出身 → 三条主线 → 安装与第一个组件 → StyleX 关系 → 组件与布局 → 主题系统 → CLI 全命令 → manifest 契约与 MCP → 模板与升级 → 选型对比 → 常见坑与采用策略 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 Astryx？

<v-clicks>

- **StyleX 编译期原子 CSS**：运行时零开销、SSR 友好
- **受管 npm 依赖 + 一体化 CLI**：装查注迁诊全覆盖
- **AI 原生**：托管 MCP + `manifest` 契约 + `--dense`
- **品牌 token 主题 + 内建暗色**：150+ 无障碍组件

</v-clicks>

<div v-click class="mt-4">

但要认清边界：

- **0.1.x Beta（2026-06 开源）**：API 演进、文档偏薄
- **仅 React 系**：无 Vue / Svelte 版本

</div>

<!--
为什么用 Astryx？先看优势。第一，样式基于 StyleX 编译期原子化 CSS，运行时不做样式序列化，SSR 天然友好，相同声明整站只落一份；第二，它是受管 npm 依赖，配一整套 CLI，覆盖初始化、查文档、注模板、版本迁移、配置诊断；第三，AI 原生，自带托管 MCP server、机器可读的 manifest 命令契约、还有 dense 压缩输出，专为喂给 agent；第四，品牌级 token 主题加内建暗色，150 多个无障碍组件开箱即用。

但边界也要讲清楚：它 2026 年 6 月才开源，还是 0.1.x Beta，API 在变、官方文档偏薄、周边生态很新，生产采用要谨慎；而且只有 React 版本，没有 Vue、Svelte。所以适用信号是：你在做 React 项目、看重编译期样式和受管依赖、想要原生 AI 工作流，并且能接受早期状态、愿意小范围试点。
-->

---

# Astryx 是什么：定位与出身

<div class="grid grid-cols-2 gap-4 mt-4">

<div>

**身份**

- 出品：**Meta**（`facebook/astryx`）
- 样式引擎：**StyleX**（编译期原子 CSS）
- 许可：**MIT**
- 版本：**v0.1.3（Beta）**，2026-06 开源

</div>

<div>

**规模背书**

- 内部沉淀 **约 8 年**
- 驱动 **13000+ 应用**
- **150+ 无障碍组件**（首页称 160+）
- 品牌级主题 + 内建暗色 + 开箱模板

</div>

</div>

<div v-click class="mt-4 text-sm">

> 与 React、StyleX 同源同许可。样式引擎细节归 StyleX 专题，本次只讲 Astryx 组件层与其关系。

</div>

<!--
Astryx 的身份：Meta 出品，仓库在 facebook/astryx；样式引擎是 StyleX，走编译期原子化 CSS；MIT 许可；当前 0.1.3、Beta，2026 年 6 月开源。

规模背书是它区别于一般新库的关键：在 Meta 内部沉淀了大约 8 年，驱动一万三千多个应用，提供 150 多个无障碍组件——官网首页写的是 Over 160，量级一致；还有品牌级主题系统、内建暗色、开箱即用的页面模板。

它和 React、StyleX 同出 Meta、同为 MIT。StyleX 本身的语法和编译细节属于样式引擎层，我们今天不展开，只讲 Astryx 组件层怎么用、以及它和 StyleX 的关系边界。
-->

---

# 三条主线拧成一股

Astryx 的独特不在「又一个组件库」，而在把三件事合一：

<v-clicks>

1. **StyleX 编译期样式** —— 构建期编译成原子 CSS，运行时零开销；且**对使用者不可见**，覆盖样式用 `className`
2. **受管依赖 + 一体化 CLI** —— 组件来自 `@astryxdesign/core`，升级走 `upgrade` 的 codemod，深改才 `swizzle`
3. **AI 原生** —— `--json` 类型化信封 + `manifest` 契约（命令行的 OpenAPI）+ 托管 **MCP server**

</v-clicks>

<div v-click class="mt-6 text-sm">

> 对照：vs shadcn（复制源码）· vs MUI（Emotion 运行时）· vs Radix（无头无样式）· vs Chakra（运行时 style props）。

</div>

<!--
Astryx 真正的独特之处，是把三条线拧成一股。

第一条，StyleX 编译期样式：组件样式在构建期就被编译成原子化 CSS，运行时不做任何样式计算；而且这层 StyleX 对使用者完全不可见，你要覆盖样式时用 className 就行，可以是 Tailwind、CSS Modules 或纯 CSS。

第二条，受管依赖加一体化 CLI：组件来自真正的 npm 包 core，不是复制粘贴；升级有 upgrade 命令跑 codemod 自动迁移，只有需要深度定制时才用 swizzle 把源码换出来。

第三条，AI 原生：CLI 全局 json 输出类型化信封，manifest 命令返回机器可读的完整命令契约，相当于命令行版的 OpenAPI，还配一个托管的 MCP server。

记住这三条对照的坐标：相对 shadcn 是受管依赖对复制源码，相对 MUI 是编译期对 Emotion 运行时，相对 Radix 是带样式对无头，相对 Chakra 是编译期对运行时 style props。
-->

---

# 安装：核心 + 主题 + CLI

```bash
# 三件套：核心包 + 一个主题包（提供 token）+ CLI
npm install @astryxdesign/core @astryxdesign/theme-neutral @astryxdesign/cli

# 初始化：装包 + 配主题 + 写入 AI agent 文档
npx astryx init

# 配置出问题时自检
npx astryx doctor
```

<v-clicks>

- **主题包必装**：组件 token（颜色/间距/圆角/字体）来自主题的 `theme.css`
- CLI 也可挂 scripts：`"astryx": "node node_modules/@astryxdesign/cli/bin/astryx.mjs"`

</v-clicks>

<!--
安装是三件套：核心包 core、一个主题包 theme-neutral、还有 CLI。然后 npx astryx init 一键初始化，它会装包、配主题、写入 AI agent 文档。如果配置出问题，npx astryx doctor 自检并给修复建议。

有个坑要强调：主题包是必需的，不是可选。组件样式的 token 值——颜色、间距、圆角、字体——都来自主题的 theme.css，只装 core 会缺 token。

CLI 也可以挂到 package.json 的 scripts 里长期用，就是那行 node 指向 cli 的 bin，之后 npm run astryx 双横线传参就能调。
-->

---

# 三行 CSS 导入（顺序固定）

```css
/* 1) 重置浏览器默认样式 */
@import '@astryxdesign/core/reset.css';
/* 2) Astryx 组件基础样式 */
@import '@astryxdesign/core/astryx.css';
/* 3) 主题 token（换这一行即换主题） */
@import '@astryxdesign/theme-neutral/theme.css';
```

<v-clicks>

- 顺序：**reset → 基础 → 主题**，主题变量放最后正确生效
- **换主题只改第 3 行**的主题包名
- 常见坑：只导入一行 → 缺 reset 或基础样式

</v-clicks>

<!--
全局样式入口按顺序导入三个文件：先 reset 抹平浏览器默认样式，再 astryx.css 组件基础样式，最后主题的 theme.css 提供 token 变量。

顺序很重要：reset、基础、主题，主题变量放最后，才能正确覆盖生效。

换主题非常简单，只改第三行的主题包名就行，比如从 neutral 换成 matcha。

最常见的坑是只导入了一行，结果缺了 reset 或者基础样式，页面看起来不对——三行都要导入。
-->

---

# 第一个组件

```tsx
import {Button} from '@astryxdesign/core/Button';
import {VStack} from '@astryxdesign/core/Layout';

export default function Page() {
  return (
    <VStack gap={2}>
      <Button label="Hello Astryx" onClick={() => alert('Hi!')} />
    </VStack>
  );
}
```

<div v-click class="mt-3 text-sm">

- 组件从 `@astryxdesign/core/<Name>` **子路径按名导入**（利于 tree-shaking）
- `VStack` 来自 `Layout`，用 `gap` 控间距；⚠️ Beta 期 props 会变，**以 `npx astryx component Button` 为准**

</div>

<!--
第一个组件的最小示例。从 core 的子路径按名导入 Button，从 Layout 导入 VStack，子路径导入利于 tree-shaking。

VStack 是纵向堆叠布局，用 gap 控制子元素间距，这里是 token 化的间距标度 gap 等于 2。Button 官方入门示例用的是 label 加 onClick 的形态。

要提醒的是，Beta 期组件的 props 仍在演进，官方 blog 里也出现过 variant 加 children 的写法。所以别凭记忆猜 props，权威来源是你安装版本的 CLI，npx astryx component Button 会打印它的完整 props、用法和源码。
-->

---

# StyleX 关系：编译期原子化 CSS

<div class="grid grid-cols-2 gap-4 mt-2">

<div>

**三个关键事实**

- **编译期**编译成原子类，运行时**零样式计算**
- 对使用者**不可见**：无需写 StyleX，覆盖用 `className`
- 原子化 → **同值去重**，体积随「不同声明数」增长

</div>

<div>

**抽象在哪泄漏**

- 接打包器配 `@astryxdesign/build`
- `swizzle` 换出源码后见 StyleX
- 排查原子类冲突 / 深度定制主题

</div>

</div>

<div v-click class="mt-3 text-sm">

> **SSR/RSC 友好**：编译期静态 CSS → 无运行时注入、无样式 hydration 闪烁；交互组件仍按惯例标 `"use client"`。

</div>

<!--
StyleX 关系，讲三个关键事实。第一，编译期，不是运行时：StyleX 在构建期把样式编译成原子化 CSS 类，运行时不再做样式序列化，对比 Emotion 或 Chakra 这类运行时方案，Astryx 运行时零样式开销。第二，对使用者不可见：你用组件无需写一行 StyleX，覆盖样式用 className 就行。第三，原子化带来同值去重，相同声明整站只落一份，CSS 体积随不同声明数增长，而不是随组件数乘用法数，这是它支撑一万三千应用的关键工程理由。

那抽象在哪里会泄漏、需要你感知底层？三处：接打包器时要配 build 这个 StyleX 构建插件；swizzle 换出组件源码后会看到里面的 StyleX 写法；排查原子类优先级冲突或做深度主题定制时也要懂编译期机制。

还有 SSR、RSC：样式编译期已经是静态 CSS，服务端就是普通样式表，没有运行时注入、没有样式 hydration 闪烁；RSC 下样式层不冲突，交互组件按 React 惯例标 use client，这块官方还在完善，属待观察。
-->

---

# 组件与 Layout 体系

```tsx
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {VStack, HStack} from '@astryxdesign/core/Layout';

<VStack gap={2}>
  <Card>
    <HStack gap={1}>
      <Button label="保存" />
      <Button label="取消" />
    </HStack>
  </Card>
</VStack>
```

<div v-click class="mt-2 text-sm">

- `Layout` 提供 `VStack` / `HStack` / `Stack`，用 token 化 `gap`，免裸写 flex/margin
- **无障碍是默认**：150+ 组件内建键盘可达 + ARIA 语义
- 查组件：`npx astryx component --list` / `component <Name>`

</div>

<!--
组件与布局体系。组件统一从 core 子路径按名导入，比如 Button、Card。布局用 Layout 模块的 VStack 纵向、HStack 横向、Stack 通用堆叠，间距都用 token 化的 gap 表达，避免你裸写 flex 和 margin。

这个例子里，外层 VStack 纵向排，里面 Card 卡片，卡片里 HStack 横向放保存和取消两个按钮，结构清晰。

两点补充：一，无障碍是默认属性，150 多个组件内建键盘可达和 ARIA 语义，不用你额外接 a11y 逻辑；二，组件清单随版本演进，用 component --list 列全部，component 加组件名看单个，别凭记忆。
-->

---

# 主题系统（一）：开箱主题 + token

<v-clicks>

- **7 个开箱主题**：`neutral` · `butter` · `chocolate` · `matcha` · `stone` · `gothic` · `y2k`
- **切主题** = 装包 + 换 CSS 第 3 行：

```css
@import '@astryxdesign/theme-gothic/theme.css';
```

- **foundations token** 用 CLI 直接查：

```bash
npx astryx docs tokens      # 全部 token
npx astryx docs color       # 颜色
npx astryx docs spacing     # 间距
```

- **暗色内建**，随 token 生效，无需第三方暗色库

</v-clicks>

<!--
主题系统第一部分，开箱主题加 token。官方有 7 个开箱主题：neutral、butter、chocolate、matcha、stone、gothic、y2k。

切换主题非常轻：装上目标主题包，把全局 CSS 第三行换掉，比如换成 gothic 的 theme.css。

主题由一组设计 token 组成，你可以直接用 CLI 查：docs tokens 看全部，docs color 看颜色，docs spacing 看间距，还有 typography、elevation 等。

暗色是内建的，随 token 生效，不需要额外接 next-themes 之类的第三方暗色库。
-->

---

# 主题系统（二）：品牌级定制

<v-clicks>

- 官方 7 主题之外做**企业品牌**：用 `defineTheme` 写主题定义文件
- 编译为生产资源：

```bash
npx astryx theme build   # defineTheme 文件 → 生产 CSS/JS
```

- **改一组 token 即让全部 150+ 组件统一换肤**，保留无障碍与交互行为
- 走**编译期产物**，不牺牲运行时性能

</v-clicks>

<div v-click class="mt-4 text-sm">

> foundations 覆盖：Color · Elevation · Icons · Illustrations · Motion · Shape · Spacing · Typography。

</div>

<!--
主题系统第二部分，品牌级定制。如果官方 7 个主题不够，你要做企业自己的品牌，就用 defineTheme 写一个主题定义文件，然后 npx astryx theme build 把它编译成生产可用的 CSS 和 JS。

这套的价值在于：改一组 token，就让全部 150 多个组件统一换肤，而且保留了无障碍和交互行为——相比复制组件再逐个改样式，你以极小的改动获得品牌一致性，升级也不会被本地魔改阻断。而且它走编译期产物，不牺牲运行时性能。

foundations 的设计基础覆盖这些维度：颜色、层级阴影、图标、插画、动效、形状、间距、排版，都能用 docs 命令查到。
-->

---

# CLI 全命令（一）：装 · 查 · 注

| 命令 | 作用 |
| --- | --- |
| `init` | 装包 + 配主题 + 写 agent 文档 |
| `component` | 列组件 / 打印组件文档（props·用法·源码） |
| `search` | 跨组件·hooks·文档·模板统一检索（**发现入口**） |
| `docs` | 打印参考文档（tokens/color/typography…） |
| `template` | 注入页面/区块模板（`--list` / `--skeleton`） |
| `hook` | 列 hooks / 打印 hook 文档 |

<!--
CLI 全命令第一组，装、查、注模板。

init 初始化，装包配主题写 agent 文档。component 是列出所有组件，或者打印某个组件的完整文档，包括 props、用法示例和源码。search 是发现入口，跨组件、hooks、文档、模板做统一排序检索，适合你不确定东西叫什么的时候先搜。docs 打印参考文档，比如 tokens、color、typography。template 把页面或区块模板注入你的项目，list 列表，skeleton 只取骨架。hook 列出 hooks 并打印文档。

这一组的心智是：不确定叫什么先 search 发现，拿到名字用 component、docs、hook 取详情。
-->

---

# CLI 全命令（二）：改 · 迁 · 诊

| 命令 | 作用 |
| --- | --- |
| `swizzle` | 复制组件源码做**深度定制**（opt-in） |
| `upgrade` | 运行 **codemods** 版本迁移 |
| `theme build` | `defineTheme` → 生产 CSS/JS |
| `discover` | 发现外部包与组件 |
| `doctor` | 诊断安装/配置并给修复建议 |

<div v-click class="mt-4 text-sm">

> **心智模型**：`search` 发现 → `component`/`docs`/`hook` 取详情 → `template`/`swizzle` 落地 → `upgrade`/`doctor` 维护。

</div>

<!--
CLI 全命令第二组，改、迁、诊。

swizzle 是把组件源码复制进项目做深度定制，注意是 opt-in、按需的。upgrade 运行 codemods 在版本间自动迁移代码，对还在 0.1.x 快速演进的项目很关键。theme build 把 defineTheme 文件编译成生产 CSS 和 JS。discover 发现外部包和组件。doctor 诊断安装配置问题并给修复建议。

把整套 CLI 串起来的心智模型是四步：search 发现，component、docs、hook 取详情，template、swizzle 落地，upgrade、doctor 维护。装、查、注模板、迁移、诊断，一个 CLI 全包了。
-->

---

# 全局 flag 与 manifest 契约

<div class="grid grid-cols-2 gap-4">

<div>

**全局选项**

- `--json`：类型化信封 `{ type, data }`
- `--detail`：`brief`/`compact`/`full`
- `--zh`：简体中文文档
- `--dense`：压缩、token 高效（喂 AI）

</div>

<div>

**manifest = 命令行的 OpenAPI**

```bash
npx astryx manifest --json
```

自描述每命令/参数/flag（类型·choices·默认值）

</div>

</div>

<div v-click class="mt-3 text-sm">

> 对 agent：可**自举调用、按类型校验、随版本自适应**，免抓文档、免猜 API——把语言理解的不确定换成读契约的确定。

</div>

<!--
全局 flag 和 manifest 契约，这是 AI 原生的核心。

全局选项：json 输出类型化信封，形如 type 加 data 的结构，便于程序消费；detail 控制详略，brief、compact、full 三档；zh 输出简体中文文档；dense 是压缩、token 高效的格式，专为喂给 AI 省上下文。

manifest 是重点：一次调用返回一个自描述的 manifest，列出每一条命令、每个参数、每个 flag 的类型、可选值 choices、默认值，以及是否支持 json。这相当于命令行版的 OpenAPI。

对 AI agent 的价值：它可以在运行时读取全部命令契约，自举出正确调用、按类型和 choices 校验参数、随版本变化自适应，不用抓 HTML 文档、不用从散文里猜 API 形状——把自然语言理解的不确定性，换成读结构化契约的确定性。
-->

---

# AI 原生（一）：托管 MCP server

```json
{
  "mcpServers": {
    "xds": {
      "type": "url",
      "url": "https://astryx.atmeta.com/mcp"
    }
  }
}
```

<v-clicks>

- 服务名 `xds`、**`type: url`（远程托管）**，支持 Claude Desktop / Cursor / Windsurf / Cline
- 两个工具：`search(query)` 发现 · `get(name)` 取完整文档
- ⚠️ 需联网；强隔离/离线环境改用 CLI `--dense`

</v-clicks>

<!--
AI 原生第一条路径，托管 MCP server。配置对所有 MCP 工具是一致的，就这一份：服务名 xds，type 是 url，指向 astryx.atmeta.com 斜杠 mcp。

注意它是 url 类型的远程托管服务，不是本地 stdio 进程，所以接入极简、零安装、内容随官方更新，支持 Claude Desktop、Cursor、Windsurf、Cline 等。

它暴露两个工具：search 用自然语言发现组件、文档主题、模板；get 取回带 props、用法、示例的完整文档。

代价是需要联网：对强隔离、数据不出网、离线的环境不适用，这类场景就退回离线 CLI，用 component dense、docs dense 这样的压缩输出。
-->

---

# AI 原生（二）：CLI 路径 + agent 文档

<v-clicks>

- **路径 B（可脚本化）**：`--json` 信封 + `manifest` 契约 + `--dense`，适合 CI/批量生成

```bash
npx astryx component Dialog --dense   # 压缩组件文档
npx astryx docs styling --dense       # 压缩样式文档
```

- **agent 约定文档**：

```bash
npx astryx init --features agents --agent claude   # CLAUDE.md
npx astryx init --features agents --agent cursor   # .cursorrules
npx astryx init --features agents --agent codex    # AGENTS.md
```

- 两条路径是**同一契约的两种投影**，按场景并用

</v-clicks>

<!--
AI 原生第二部分，CLI 路径加 agent 文档。

路径 B 是可脚本化的确定性自动化：json 类型化信封、manifest 契约、dense 压缩输出，适合 CI 和批量生成场景。比如 component Dialog dense 拿压缩的组件文档，docs styling dense 拿压缩的样式文档，一次能塞更多进 prompt。

还有 agent 约定文档：init features agents 加 agent 参数，claude 生成 CLAUDE.md，cursor 生成 .cursorrules，codex 生成 AGENTS.md，让 coding agent 一进项目就带上 Astryx 的使用规范。

关键理解：MCP 和 CLI 这两条路径，是同一套设计系统表面的两种投影，不是二选一。交互式 IDE 顺手用 MCP，CI 批量生成用 CLI 加 manifest，dense 在大规模一次塞多个组件契约时收益随规模放大。
-->

---

# 模板系统：ready to ship

```bash
npx astryx template --list             # 列出可用模板
npx astryx template dashboard          # 注入 dashboard 页面
npx astryx template kanban-board       # Kanban 看板（0.1.3 新增）
npx astryx template <name> --skeleton  # 只取骨架结构
```

<v-clicks>

- 注入的是**整段页面/区块**，不是单个组件——给你整段业务场景的起点
- 配合 token 主题即可快速换成品牌视觉

</v-clicks>

<!--
模板系统，主打 ready to ship。template list 列出可用模板，template dashboard 注入一个 dashboard 页面的源码，template kanban-board 注入 Kanban 看板页面——这是 0.1.3 changelog 里新增的模板，skeleton 参数只取骨架结构。

和单个组件不同，模板注入的是整段页面或区块，包含布局和组合，给你的是整段业务场景的起点，而不是一个孤零零的按钮。

注入之后配合 token 主题，就能快速把它换成你自己的品牌视觉。这就是官方讲的 ready to ship，开箱即可发布。
-->

---

# 升级 · 诊断 · swizzle

受管依赖带来「复制粘贴组件没有的升级路径」：

<v-clicks>

- **`astryx upgrade`**：codemods 自动迁移，破坏性变更手工成本降到最低
- **`astryx doctor`**：诊断主题未导入/版本不匹配/构建插件缺失
- **`astryx swizzle`**：深度定制时才复制源码（opt-in，例外逃生口）

</v-clicks>

<div v-click class="mt-4 text-sm">

> ⚠️ **swizzle 的代价**：被换出的组件脱离版本管理，`upgrade` 不再自动覆盖它——**能用 token/className 就别 swizzle**。

</div>

<!--
升级、诊断、swizzle，这是受管依赖相对复制粘贴组件的价值所在。

upgrade 运行 codemods 自动迁移代码，对一个仍在 0.1.x 快速演进的项目，codemod 化升级把破坏性变更的手工成本降到最低。doctor 诊断配置问题，比如主题没导入、包版本不匹配、构建插件缺失，并给出修复建议。swizzle 是需要超出 className 和 token 的深度定制时，才把组件源码复制进项目，是 opt-in 的例外逃生口。

但 swizzle 有代价要记住：被换出的组件就脱离了包的版本管理，upgrade 的 codemod 不再自动覆盖它，过度 swizzle 会阻断升级。原则是：能用 token 或 className 解决的，就别 swizzle，把它控制到最少。
-->

---

# 选型对比：Astryx vs 主流方案

| 维度 | Astryx | shadcn/ui | 经典 MUI | Radix |
| --- | --- | --- | --- | --- |
| 分发 | **npm 依赖**（swizzle 才复制） | 复制源码 | npm | npm |
| 样式 | **StyleX 编译期原子** | Tailwind | Emotion 运行时 | 无样式 |
| 带样式 | ✅ | ✅ | ✅ | ❌ 无头 |
| AI 原生 | **MCP+manifest+dense** | CLI+MCP | ❌ | ❌ |
| 出身 | Meta 8y/13k 应用 | 独立(Vercel) | 独立公司 | WorkOS |

<div v-click class="mt-3 text-sm">

> Chakra 类同 MUI（运行时 style props）。**Astryx 甜蜜区**：Meta 背书 + 编译期零运行时 + 受管升级 + 原生 AI，且能接受 Beta。

</div>

<!--
选型对比，把 Astryx 和主流方案放一起。

分发方式：Astryx 是 npm 受管依赖、swizzle 才复制，shadcn 默认复制源码，MUI 和 Radix 都是 npm 包。样式：Astryx 是 StyleX 编译期原子 CSS，shadcn 用 Tailwind，MUI 用 Emotion 运行时，Radix 无样式。是否带样式：Astryx、shadcn、MUI 都带，Radix 是无头只给行为。AI 原生：Astryx 有 MCP 加 manifest 加 dense，shadcn 有 CLI 加 MCP，MUI 和 Radix 没有原生 AI 工作流。出身：Astryx 是 Meta，8 年一万三千应用，shadcn 是独立作者 Vercel 背书，MUI 独立公司，Radix 是 WorkOS。

Chakra 没列进去，它和 MUI 类似，运行时 style props 加 Emotion。Astryx 的甜蜜区是：想要 Meta 长期背书、编译期零运行时样式、受管依赖版本化升级、原生 AI 工作流，并且能接受它 0.1.x Beta 的早期状态。
-->

---

# 常见坑 + Beta 采用策略

<div class="grid grid-cols-2 gap-4 mt-2">

<div>

**常见坑**

- 只装 core 没装主题 → 缺 token
- CSS 只导入一行 → 缺 reset/基础
- 凭记忆猜 props → 用 `component <Name>`
- 改 `node_modules` 源码 → 用 `className`/`swizzle`
- 过度 swizzle → 阻断 `upgrade`

</div>

<div>

**Beta 采用策略**

- 小范围试点，非核心先行
- **锁版本** + 跟踪 changelog
- 善用 `upgrade` codemod + `doctor`
- swizzle 控制到最少
- 核心生产线**等 API 收敛**

</div>

</div>

<!--
常见坑和 Beta 采用策略，一起讲。

常见坑五个：只装了 core 没装主题包，组件缺 token 样式异常；CSS 只导入一行，缺了 reset 或基础样式；凭记忆猜组件 props，Beta 期会变，要用 component 加组件名取权威 props；去改 node_modules 里的源码，不可维护，局部覆盖用 className、深改用 swizzle；过度 swizzle，会阻断 upgrade 的 codemod 升级。

Beta 采用策略：它才 0.1.x，求稳的团队应该小范围试点，非核心或新项目先行，享受它的 AI 工作流和设计系统能力；同时锁定版本、密切跟踪 changelog 和破坏性变更；善用 upgrade 的 codemod 和 doctor 自检；把 swizzle 控制到最少以免阻断升级；对强稳定性诉求的核心生产线，等 API 收敛或用成熟替代。既不盲目全量押注，也不因为早期就一票否决它的独特价值。
-->

---
layout: intro
---

# 总结

Astryx = **Meta 开源、基于 StyleX、AI 原生的 React 设计系统**

- 身份：Meta 出品 · MIT · v0.1.3 Beta · 8 年内部 / 13000+ 应用 / 150+ 组件
- 样式：**StyleX 编译期原子 CSS**，运行时零开销，SSR 友好，对用户不可见
- 分发：**受管 npm 依赖** + 一体化 CLI，`upgrade` codemod，`swizzle` 深改
- AI 原生：托管 **MCP**（`search`/`get`）+ `manifest` 契约 + `--dense`/`--json`
- 主题：7 开箱主题 + `defineTheme` + 内建暗色；模板 ready to ship
- 现状：**0.1.x Beta**——小范围试点 + 锁版本 + 跟踪破坏性变更

<div class="mt-6 text-sm opacity-75">

官网 astryx.atmeta.com · GitHub facebook/astryx · 托管 MCP astryx.atmeta.com/mcp

</div>

<!--
总结一下。Astryx 是 Meta 开源、基于 StyleX、AI 原生的 React 设计系统。

身份：Meta 出品，MIT 许可，当前 0.1.3 Beta，内部沉淀 8 年、驱动一万三千应用、150 多个无障碍组件。样式：StyleX 编译期原子 CSS，运行时零开销，SSR 友好，而且对使用者不可见，覆盖用 className。分发：受管 npm 依赖加一体化 CLI，升级走 upgrade 的 codemod，深度定制才 swizzle。AI 原生：托管 MCP server 暴露 search 和 get，manifest 命令契约相当于命令行的 OpenAPI，加上 dense 和 json 输出。主题：7 个开箱主题，defineTheme 自定义，内建暗色，模板 ready to ship。

现状要清醒：它还是 0.1.x Beta，2026 年 6 月才开源。建议小范围试点、锁版本、跟踪破坏性变更，核心生产线等 API 收敛。想深入就去官网 astryx.atmeta.com，仓库 facebook/astryx，托管 MCP 在 astryx.atmeta.com 斜杠 mcp。谢谢大家。
-->
