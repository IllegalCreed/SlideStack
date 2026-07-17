---
theme: seriph
background: https://cover.sli.dev
title: Nuxt UI Skill
info: |
  Nuxt UI 官方 usage skill：教 AI 用 Nuxt UI v4 建界面。
  nuxt/ui · skills/nuxt-ui（v4）。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Nuxt UI Skill

Nuxt UI 组件库**官方** usage skill——教 AI 用 **Nuxt UI v4** 建界面

<div class="pt-6 opacity-80">
nuxt/ui · skills/nuxt-ui · 125+ 组件 · /nuxt-ui · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/nuxt/ui/tree/v4/skills/nuxt-ui" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #00A862 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Nuxt UI Skill 是 nuxt 官方 nuxt/ui 仓库自带的 usage skill，教 AI 编码 agent 用 Nuxt UI v4 建界面。区别于批 4 的社区 Nuxt Skills。
-->

---
transition: fade-out
---

# 官方 skill，别和社区版混

`nuxt/ui` 官方 · 只管 Nuxt UI 组件库

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**Nuxt UI Skill（本叶）**

- 仓库：`nuxt/ui`（官方 org）
- 范围：**只聚焦 Nuxt UI 组件库**
- 随库同源、v4 对齐
- ★6.7k · MIT

</div>
<div v-click>

**Nuxt Skills（批 4）**

- 仓库：`onmax/nuxt-skills`（社区）
- 范围：Nuxt 全生态 21 skill
- 含一个 `nuxt-ui` skill
- 社区个人维护

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">
都遵 agentskills.io，但一个官方单库权威、一个社区全家桶。
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #00A862 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
本叶是官方 nuxt/ui 仓库的单库 usage skill，只聚焦 Nuxt UI。批 4 的 Nuxt Skills 是 onmax 社区的 21-skill 全生态，含一个 nuxt-ui skill。别混淆。
-->

---
transition: fade-out
---

# Nuxt UI v4：建在什么之上

125+ 无障碍 Vue 组件

<v-clicks>

- 基座：**Reka UI**（无障碍原语）+ **Tailwind CSS** + **Tailwind Variants**
- **125+** 个无障碍组件，随库同源演进
- 跨框架：Nuxt · Vue (Vite) · Laravel · AdonisJS（后两者 Vite + Inertia）
- 7 语义色主题 + CSS 变量 + 官方启动模板

</v-clicks>

<div v-click class="mt-6 text-center">
skill 就是教 agent 在这些环境里，把 Nuxt UI **用对、用好**。
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #00A862 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Nuxt UI v4 建在 Reka UI + Tailwind CSS + Tailwind Variants 之上，125+ 无障碍组件，可用于 Nuxt、Vue、Laravel、AdonisJS。skill 教在这些环境里用好它。
-->

---
transition: fade-out
---

# 安装 skill：一条命令，35+ agents

`npx skills add nuxt/ui`

```bash
npx skills add nuxt/ui                 # 交互挑选已装 agent
npx skills add nuxt/ui --agent cursor  # 指定 agent
npx skills add nuxt/ui --global        # 全局

# Claude Code 也可直接加 GitHub 路径
claude skill add https://github.com/nuxt/ui/tree/v4/skills/nuxt-ui
```

<div class="mt-3 text-center text-sm opacity-80">
装后对话里 <code>/nuxt-ui</code> 触发。支持 Cursor / Claude Code / Codex / Windsurf / Cline 等 35+ agent。
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #00A862 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
skills CLI 一条命令装，支持 35+ agent，可指定 agent 或全局。Claude Code 也能直接加 GitHub 路径。装后 /nuxt-ui 触发。
-->

---
transition: fade-out
---

# MCP 供 API，skill 供用法

一对分工搭档

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**Nuxt UI MCP**

- `search_components` / `search_icons`
- `get_component` / `get_example`
- 组件精确 props/slots/events
- 答「组件**接受什么**」

</div>
<div v-click>

**Nuxt UI Skill**

- 何时用哪个组件
- 怎么建得好
- 五条铁律 + 路由表
- 答「怎么**用好**」

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">
<code>claude mcp add --transport http nuxt-ui https://ui.nuxt.com/mcp</code>
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #00A862 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
skill 与 MCP 分工：MCP 供组件精确 API（接受什么 props），skill 供用法（何时用哪个、怎么建好）。两者搭配是官方推荐工作流。
-->

---
transition: fade-out
---

# usage skill 教什么

Nuxt UI 建站全链路

<div class="grid grid-cols-2 gap-x-8 gap-y-1 mt-6">
<div v-click>

- **安装** —— Nuxt/Vue/Laravel/AdonisJS
- **主题** —— 7 语义色 + CSS 变量
- **组件** —— 125+ 选型模式
- **composables** —— useToast/useOverlay

</div>
<div v-click>

- **表单** —— Standard Schema 校验
- **overlays** —— Modal/Slideover/Drawer
- **布局** —— dashboard/docs/chat/editor
- **模板** —— npx nuxi init -t ui/...

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #00A862 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
usage skill 覆盖建站全链路：安装、主题、组件选型、composables、表单、overlays、布局、官方模板。
-->

---
transition: fade-out
---

# 渐进披露：入口 + 按需拉

SKILL.md 只是入口，不一次全加载

```text
SKILL.md（五条铁律 + 路由表）
  ├── guidelines/  design-system · component-selection · conventions · forms
  ├── layouts/     landing · dashboard · docs · chat · editor
  ├── recipes/     data-tables · auth · overlays · navigation
  └── components.md（分类组件索引）
```

<div class="mt-3 text-center">
按任务只拉需要的 reference —— 这正是 skill **省 token** 的关键。
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #00A862 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
渐进披露是核心设计：SKILL.md 放五条铁律和路由表，14 个 reference 分散在 guidelines/layouts/recipes，按任务加载，省上下文。
-->

---
transition: fade-out
---

# 路由表：任务 → 加载哪些 reference

| 任务 | 加载 |
| --- | --- |
| landing 页 | design-system, conventions, landing |
| dashboard / 后台 | conventions, component-selection, dashboard |
| 登录 / 注册表单 | conventions, forms, auth |
| 表格展示数据 | conventions, component-selection, data-tables |
| 加 modal / drawer | conventions, component-selection, overlays |

<div class="mt-3 text-center text-sm opacity-80">
按表只加载需要的，别一次全拉。
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #00A862 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
SKILL.md 带一张路由表，告诉 agent 什么任务加载哪些 reference，实现按需加载。
-->

---
transition: fade-out
---

# 五条核心铁律（始终适用）

| # | 铁律 |
| --- | --- |
| 1 | `UApp` 必包（toast / tooltip / overlay / i18n 依赖它） |
| 2 | 只用语义色（`text-default`/`bg-elevated`），禁裸调色板 |
| 3 | 读生成主题文件找 slot 名（`.nuxt/ui/<c>.ts`） |
| 4 | 覆盖优先级：`ui`/`class` prop → 全局 config → 默认 |
| 5 | 图标 `i-{collection}-{name}`（默认 lucide） |

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #00A862 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
SKILL.md 开篇立五条 always-apply 铁律：UApp 必包、只用语义色、读生成文件找 slot、覆盖优先级、图标格式。
-->

---
transition: fade-out
---

# 7 语义色：组件里永远用它们

禁用 `text-gray-500` 这类裸调色板色

| 语义色 | 默认 | 用途 |
| --- | --- | --- |
| `primary` | green | 主 CTA、激活、链接 |
| `secondary` | blue | 次要动作、互补高亮 |
| `success`/`info`/`warning`/`error` | 绿/蓝/黄/红 | 状态语义 |
| `neutral` | slate | 文字/边框/背景/chrome |

<div class="mt-3 text-center text-sm opacity-80">
variants 按权重：solid &gt; outline &gt; soft &gt; subtle &gt; ghost &gt; link
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #00A862 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
7 语义色 primary/secondary/success/info/warning/error/neutral，组件里永远用它们而非裸调色板。variants 按视觉权重从 solid 到 link。
-->

---
transition: fade-out
---

# 表单：UForm + UFormField + Standard Schema

```vue
<UForm :schema="schema" :state="state" @submit="onSubmit">
  <UFormField name="email" label="Email" required>
    <UInput v-model="state.email" type="email" />
  </UFormField>
  <UButton type="submit" label="Sign in" />
</UForm>
```

<div class="mt-3 text-center text-sm opacity-80">
<code>name</code> 对齐 schema 字段挂错误；<code>@submit</code> 仅校验通过才发；支持 Zod / Valibot / Yup / Joi。
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #00A862 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
表单用 UForm + UFormField + Standard Schema。UFormField 的 name 对齐 schema 字段挂错误，@submit 仅校验通过才发，支持 Zod/Valibot/Yup/Joi。
-->

---
transition: fade-out
---

# 组件选型：决策矩阵（overlays 为例）

| 需求 | 组件 |
| --- | --- |
| 确认框、聚焦任务、表单 | `UModal` |
| 详情面板、设置、次要内容 | `USlideover` |
| 移动端底部 sheet | `UDrawer` |
| 附着触发器的上下文信息 | `UPopover` |
| 简单悬停提示 | `UTooltip`（禁放交互元素） |

<div class="mt-3 text-center text-sm opacity-80">
程序化开 overlay 用 <code>useOverlay()</code>，无需模板 v-model。
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #00A862 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
component-selection 用决策矩阵教何时用哪个。overlays 例：Modal 阻断聚焦、Slideover 详情面板、Drawer 移动端、Popover 上下文、Tooltip 悬停提示。程序化用 useOverlay。
-->

---
transition: fade-out
---

# 边界

用之前先知道它不做什么

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**不做**

- 不管 Nuxt 框架本身
- 不管其它 UI 库 / 非 Vue 栈
- 不背组件全部 API（那是 MCP）

</div>
<div v-click>

**要记住**

- 绑 Nuxt UI **v4**
- 官方非社区（≠ onmax/nuxt-skills）
- 喂正确模式，取舍仍靠人

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #00A862 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
边界：只管 Nuxt UI 组件库，不管框架本身、其它 UI 库、非 Vue 栈；API 明细归 MCP；绑 v4；官方非社区；喂模式但取舍靠人。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Nuxt UI 官方 usage skill：`npx skills add nuxt/ui` 装、`/nuxt-ui` 触发，教 AI 用 Nuxt UI v4 建界面——五条铁律 + 路由表 + 按需 references，MCP 供 API、skill 供用法。**

<div class="mt-8 opacity-80">
官方单库 · v4 · 渐进披露 · 语义色 · MCP 搭档
</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/nuxt/ui/tree/v4/skills/nuxt-ui" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://ui.nuxt.com/docs/getting-started/ai/skills" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #00DC82 10%, #00A862 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Nuxt UI 官方 usage skill：npx skills add nuxt/ui 装、/nuxt-ui 触发，教 AI 用 Nuxt UI v4 建界面，五条铁律加路由表加按需 references，MCP 供 API skill 供用法。
-->
