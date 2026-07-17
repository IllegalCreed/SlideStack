---
theme: seriph
background: https://cover.sli.dev
title: Impeccable
info: |
  Impeccable：面向 AI 编码 agent 的设计语言。
  1 skill + 23 命令 + 46 确定性检测 + live browser 迭代。
  pbakaus/impeccable（Paul Bakaus 个人出品，Apache-2.0）。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Impeccable

面向 AI 编码 agent 的**设计语言**——用命令词汇引导 AI，避开「一眼假」

<div class="pt-6 opacity-80">
pbakaus/impeccable · 1 skill + 23 命令 + 46 检测 + live · Apache-2.0
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/pbakaus/impeccable" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #b8860b 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Impeccable 是知名开发者 Paul Bakaus 个人出品的、面向 AI 编码 agent 的设计语言。用一套 steering 命令词汇与 AI 达成设计共识，把 AI 生成界面从一眼假拉到生产级。
-->

---
transition: fade-out
---

# 它是什么

一句话：让你的 AI harness 更擅长做设计

<div class="grid grid-cols-2 gap-6 mt-6">
<div v-click>

**构成**

- **1 skill**（`impeccable`）
- **23 命令**：共享设计词汇
- **46 检测**：确定性、无 LLM
- **live**：浏览器实时迭代

</div>
<div v-click>

**定位**

- Paul Bakaus 个人出品，Apache-2.0
- **个人/产品，非组织官方**
- 但作者知名、项目极流行
- 脱胎自 Anthropic frontend-design

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">
不是通用 prompt，而是把「改设计」变成可精准引导的命令词汇。
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #b8860b 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Impeccable 由四部分构成：一个 skill、23 个命令、46 条确定性检测规则、live 浏览器迭代。它是 Paul Bakaus 个人出品的产品，非组织官方，但作者知名、项目极流行。
-->

---
transition: fade-out
---

# 为什么需要它

每个模型都在同一批 SaaS 模板上训练

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**AI 生成界面的通用 tells**

- 处处 Inter 字体
- 紫到蓝的渐变
- 卡片套卡片
- 彩色底上的灰字
- 每个标题上方的圆角方块图标

</div>
<div v-click>

**Impeccable 的解法**

- 一套共享设计词汇引导 AI
- 46 条规则逐个 match-and-refuse
- register 感知（brand / product）
- 让 AI 产出过专业设计评审

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #b8860b 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
跳过设计引导，你会在每个项目得到同一撮 AI tells：Inter、紫渐变、卡套卡、灰字、图标块。Impeccable 给你和 AI 一套共享词汇，逐条拒绝这些套路。
-->

---
transition: fade-out
---

# 安装：两步

`npx impeccable install` → `/impeccable init`

```bash
# 1) 项目根目录安装（自动检测 harness，选 provider / scope）
npx impeccable install

# 2) 在 AI 编码工具里初始化项目上下文
/impeccable init      # 问 brand 还是 product，写 PRODUCT.md + DESIGN.md

# 刷新已有安装
npx impeccable update
```

<div v-click class="mt-3 text-center text-sm opacity-80">
<code>init</code> 捕获受众、品牌定位、语气、anti-references、颜色、字体——后续每条命令都读它。
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #b8860b 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
安装两步：npx impeccable install 自动检测 harness、选 provider 和 scope；再在 AI 工具里跑 /impeccable init，它会问这是 brand 还是 product，写入设计上下文，后续命令都读它。
-->

---
transition: fade-out
---

# 23 个命令，走一个 skill

`/impeccable <command> [target]`

<div class="grid grid-cols-2 gap-x-8 gap-y-1 mt-4 text-sm">
<div v-click>

**Build** `craft` `shape` `init` `document` `extract`

**Evaluate** `critique` `audit`

**Refine** `polish` `bolder` `quieter` `distill` `harden` `onboard`

</div>
<div v-click>

**Enhance** `animate` `colorize` `typeset` `layout` `delight` `overdrive`

**Fix** `clarify` `adapt` `optimize`

**Iterate** `live`

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">
管理命令 <code>pin</code> / <code>unpin</code> / <code>hooks</code>；<code>/impeccable pin audit</code> 后 <code>/audit</code> 即快捷方式。
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #b8860b 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
23 个命令都从一个 /impeccable skill 进，分 Build、Evaluate、Refine、Enhance、Fix、Iterate 六类，另有 pin/unpin/hooks 管理命令。常用命令可 pin 成独立快捷方式。
-->

---
transition: fade-out
---

# 设计维度：可引导的轴

每个维度对应一条精准命令

| 维度 | 命令 | 引导什么 |
| --- | --- | --- |
| Typography 排版 | `typeset` | 字体、层级、字号、字距、行长 |
| Color 色彩 | `colorize` | 策略性颜色、对比度 |
| Motion 动效 | `animate` | 有目的的动画与微交互 |
| Layout 布局 | `layout` | 间距、节奏、视觉层级 |
| UX writing 文案 | `clarify` | 标签、错误信息、界面文案 |

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #b8860b 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Impeccable 把界面拆成具体设计维度，每个维度对应一条命令：排版 typeset、色彩 colorize、动效 animate、布局 layout、文案 clarify。你不再说弄好看点，而是引导某个轴。
-->

---
transition: fade-out
---

# 色彩 & 排版规则

摘自 skill 的通用规则

<div class="grid grid-cols-2 gap-6 mt-4 text-sm">
<div>

**Color**

- 正文对比 ≥ 4.5:1，占位符同标准
- 彩色底别用灰字（发白）
- 新项目用 **OKLCH**
- cream / 米色底是 2026 AI 默认——避

</div>
<div>

**Typography**

- 行长封顶 **65–75ch**
- 别配「像但不同」的字体
- Hero 标题 `clamp()` max ≤ 6rem
- 字距下限 ≥ -0.04em

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #b8860b 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
色彩规则：正文对比至少 4.5 比 1，彩色底别用灰字，新项目用 OKLCH，避开 cream 米色底这个 AI 默认。排版规则：行长 65 到 75 字符，别配像但不同的字体，Hero 标题不超过 6rem，字距不低于负 0.04em。
-->

---
transition: fade-out
---

# 布局 & 动效规则

<div class="grid grid-cols-2 gap-6 mt-4 text-sm">
<div>

**Layout**

- 卡片是偷懒答案，**卡片套卡片永远错**
- 一维 Flexbox、二维 Grid
- 无断点网格：`repeat(auto-fit, minmax(280px, 1fr))`
- 语义化 z-index 阶梯，别用 `9999`

</div>
<div>

**Motion**

- 指数缓出，**不要 bounce / elastic**
- `prefers-reduced-motion` 必配降级
- 列表内错峰合法，统一反射是病
- 别把可见性绑在 class 触发的过渡上

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #b8860b 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
布局：卡片是偷懒答案、卡套卡永远错，一维用 Flexbox 二维用 Grid，无断点网格用 auto-fit minmax，z-index 用语义化阶梯别用 9999。动效：指数缓出别用 bounce，必配 reduced-motion 降级，列表错峰合法但统一反射是病。
-->

---
transition: fade-out
---

# 46 条确定性检测

无 LLM、无 API key，CLI / 扩展直接跑

<div class="grid grid-cols-2 gap-6 mt-4 text-sm">
<div v-click>

**AI slop（27 条）**

侧边彩条 · 圆角上彩边 · 过用字体 · 单字体 · 平层级 · 渐变文字 · AI 配色 · cream 底 · 卡套卡 · bounce 缓动 · 暗色发光 · 图标块叠标题 · 每段 eyebrow · `01/02/03` 编号 · em-dash 滥用 · 营销黑话…

</div>
<div v-click>

**通用质量（19 条）**

低对比 · 彩底灰字 · 坏图 · 行长过长 · 行高过紧 · 过小正文 · 正文全大写 · 局促内边距 · 文本溢出 · 跳级标题 …

+ 4 条 DESIGN.md 设计系统检查（字体 / 色 / 圆角 / 字号越界）

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #b8860b 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
46 条检测分两类：27 条 AI slop 抓一眼假的 tell，19 条通用质量抓用户看得见的问题，后者含 4 条 DESIGN.md 设计系统检查。全部确定性，CLI 和浏览器扩展不需要 LLM 和 API key 就能跑。
-->

---
transition: fade-out
---

# detect CLI：进 CI 的门禁

```bash
npx impeccable detect src/            # 扫目录（无 LLM、无 API key）
npx impeccable detect https://x.com   # 扫 URL（Puppeteer 渲染后检查）
npx impeccable detect --json .        # CI 友好 JSON；退出码 2 = 有命中

# 单值/单文件豁免
npx impeccable ignores add-value overused-font Inter --reason "Brand font"
```

<div v-click class="mt-3 text-sm">

退出码：`0` 无命中 · `2` 有命中 · `1` 失败。行内豁免（作用于整文件）：

```html
<!-- impeccable-disable overused-font: exported brand doc -->
```

</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #b8860b 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
detect CLI 可扫目录、文件、URL，输出 JSON 进 CI，退出码 2 表示有命中即失败。豁免可用 ignores 命令，或在文件里加行内 impeccable-disable 注释。同一套 detector 也驱动 audit、design hook、浏览器扩展。
-->

---
transition: fade-out
---

# 绝对禁止：match-and-refuse

正要写这些？换个结构重写

<div class="grid grid-cols-2 gap-x-8 gap-y-1 mt-4 text-sm">
<div v-click>

- 侧边彩条（>1px 彩色 border-left）
- 渐变文字（`background-clip: text`）
- 默认玻璃拟态
- hero-metric 模板（大数字陈词）

</div>
<div v-click>

- 雷同卡片网格
- 每段小号全大写 eyebrow
- `01/02/03` 编号段标
- 文本溢出容器

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">
这些是 AI 生成界面的通病——出现在 55–95% 的生成里，即「tell」的定义。
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #b8860b 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
skill 有一份硬清单：侧边彩条、渐变文字、默认玻璃拟态、hero-metric 模板、雷同卡片网格、每段 eyebrow、编号段标、文本溢出——正要写这些就换结构重写。它们出现在多数生成里，是 tell 的定义。
-->

---
layout: center
class: text-center
transition: fade-out
---

# AI slop 测试

**若有人一眼就能说「这是 AI 做的」——判失败。**

<div class="mt-6 text-left max-w-2xl mx-auto text-sm">

- **一阶反射**：光从品类就能猜出主题 + 配色 → 第一层训练反射
- **二阶反射**：从「品类 + anti-references」能猜出美学家族（「不做 SaaS-cream 的 AI 工具 → 编辑排版风」）→ 更深一层的坑

</div>

<div class="mt-6 opacity-80">
重做 scene 句子与色彩策略，直到两个答案都不显而易见。
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #b8860b 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
AI slop 测试：若有人一眼就能说这是 AI 做的，就失败。再跑类别反射二阶检查——一阶是从品类猜出主题配色，二阶是从品类加 anti-references 猜出美学家族。重做直到两个答案都不显而易见。
-->

---
transition: fade-out
---

# live：浏览器里实时迭代

`/impeccable live` 视觉变体模式

```text
选元素  →  选设计动作  →  AI 生成 3 个不同方向变体  →  HMR 热替换  →  接受 / 丢弃
```

<div class="grid grid-cols-2 gap-6 mt-6 text-sm">
<div v-click>

**前置**

- 支持 HMR 的 dev server（Vite / Next / Bun）
- 或浏览器打开的静态 HTML

</div>
<div v-click>

**默认保身份**

- DESIGN.md 赢视觉决定
- PRODUCT.md 赢策略 / 语气决定
- **web-only**（原生 app 不吃）

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #b8860b 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
live 是视觉变体模式：在浏览器里选元素、选设计动作，AI 生成三个不同方向的变体经 HMR 热替换，你边看边接受或丢弃。需要 dev server 或静态 HTML。默认保身份，DESIGN.md 赢视觉、PRODUCT.md 赢策略，web-only。
-->

---
transition: fade-out
---

# 多 agent & design hook

一条命令，装进十余种 AI 工具

<div class="grid grid-cols-2 gap-6 mt-4 text-sm">
<div v-click>

**支持的工具**

Claude Code · Cursor · GitHub Copilot · Gemini CLI · Codex CLI · Grok Build · OpenCode · Pi · Kiro · Trae · Rovo Dev · Qoder

各装到 `.{agent}/skills/impeccable/`

</div>
<div v-click>

**design hook**

- Claude / Copilot / Codex / Cursor 上自动装
- 编辑 UI 文件后跑 detector 回灌 findings
- **Cursor 在坏写入落地前拦截**，其余编辑后提示

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #b8860b 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Impeccable 跨十余种 AI 工具，各装到对应 skills 目录。在 Claude Code、Copilot、Codex、Cursor 上还装 design hook：编辑 UI 文件后自动跑 detector 回灌 findings，Cursor 甚至在坏写入落地前拦截。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Impeccable = 面向 AI agent 的设计语言：1 skill + 23 命令 + 46 确定性检测 + live 迭代，用共享词汇引导 AI 避开「一眼假」，做出生产级 UI。**

<div class="mt-8 opacity-80">
个人/产品（Paul Bakaus）· Apache-2.0 · 业界知名 · 跨多 agent · web detector 无需 LLM
</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/pbakaus/impeccable" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://impeccable.style" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #171717 10%, #b8860b 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Impeccable 是面向 AI agent 的设计语言：1 skill、23 命令、46 确定性检测、live 迭代，用共享词汇引导 AI 避开一眼假、做出生产级 UI。Paul Bakaus 个人出品，Apache-2.0，跨多 agent。
-->
