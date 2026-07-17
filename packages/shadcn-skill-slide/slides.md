---
theme: seriph
background: https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=1600&q=80
title: shadcn Skill
info: |
  ## shadcn Skill
  shadcn/ui 官方 agent 技能——规则内建、组合优先、项目感知。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# shadcn Skill

shadcn/ui 官方 agent 技能

<div class="pt-8 text-xl opacity-80">
规则内建 · 组合优先 · 项目感知 · 配套 MCP
</div>

<div class="abs-br m-6 text-sm opacity-60">
shadcn-ui/ui · MIT · skills/shadcn
</div>

---
layout: two-cols
layoutClass: gap-8
---

# 它是什么

<v-clicks>

- **shadcn/ui 官方**（源在 shadcn-ui/ui 主仓库，MIT）
- 管理 shadcn 组件/项目：加/搜/修/调/样式/组合
- 组件以**源码**经 CLI 加入项目
- 核心：**始终强制的 Critical Rules** + 4 原则
- 配套 **shadcn MCP**（接 registry）+ `migrate-radix-to-base`

</v-clicks>

::right::

<div v-click="1" class="mt-16 p-6 rounded-xl bg-gradient-to-br from-neutral-500/15 to-slate-500/10 border border-neutral-400/25">

**一句话**

> AI 照官方规则组合现有组件——语义色、`gap` 不用 `space-y`、表单用 `Field`。

</div>

<div v-click="2" class="mt-4 p-4 rounded-lg bg-gray-500/10 text-sm">

```bash
npx shadcn@latest info --json
npx shadcn@latest search
```

</div>

---
layout: center
class: text-center
---

# 4 条原则

<div class="grid grid-cols-2 gap-5 mt-8 max-w-4xl mx-auto text-left">

<div v-click="1" class="p-5 rounded-xl bg-blue-500/10">

**① 先用现有组件**

写自定义前 `search` registry（含社区）

</div>

<div v-click="2" class="p-5 rounded-xl bg-green-500/10">

**② 组合，别重造**

设置页 = Tabs + Card + form

</div>

<div v-click="3" class="p-5 rounded-xl bg-purple-500/10">

**③ 内建 variant 优先**

`variant="outline"`、`size="sm"`

</div>

<div v-click="4" class="p-5 rounded-xl bg-orange-500/10">

**④ 用语义色**

`bg-primary`，不用 `bg-blue-500`

</div>

</div>

---
layout: default
---

# 6 大 Critical Rules（始终强制）

<div class="grid grid-cols-3 gap-3 mt-6 text-sm">

<div v-click="1" class="p-4 rounded-lg bg-blue-500/10">

**Styling**

`gap` 非 `space-y`；`size-*` 非 `w/h`；无手写 `dark:`/`z-index`；`cn()`

</div>

<div v-click="2" class="p-4 rounded-lg bg-green-500/10">

**Forms**

`FieldGroup`+`Field`；`InputGroup`；`ToggleGroup`；`data-invalid`

</div>

<div v-click="3" class="p-4 rounded-lg bg-purple-500/10">

**Composition**

Item 在 Group 内；Dialog 必 Title；完整 Card；`TabsTrigger` 在 `TabsList`

</div>

<div v-click="4" class="p-4 rounded-lg bg-orange-500/10">

**Icons**

Button 内 `data-icon`；不加尺寸类；传对象非字符串

</div>

<div v-click="5" class="p-4 rounded-lg bg-pink-500/10">

**Chat**

`MessageScroller`/`Message`/`Bubble`；自管滚动

</div>

<div v-click="6" class="p-4 rounded-lg bg-amber-500/10">

**CLI/preset**

别手拼 URL；`preset decode/url/apply`

</div>

</div>

<div v-click="7" class="mt-6 text-center text-sm opacity-70">

每类都链到 `rules/*.md`，内含「错误 / 正确」代码对

</div>

---
layout: default
---

# 一眼看懂：正确 vs 错误

<div class="grid grid-cols-2 gap-6 mt-4">

<div v-click="1" class="p-5 rounded-xl bg-green-500/10 border border-green-400/30">

**✓ 正确**

```tsx
<div className="flex flex-col gap-4">
<Avatar className="size-10">
<Badge variant="secondary">+20%</Badge>
<FieldGroup>
  <Field><Input /></Field>
</FieldGroup>
<Button>
  <SearchIcon data-icon="inline-start" />
  Search
</Button>
```

</div>

<div v-click="2" class="p-5 rounded-xl bg-red-500/10 border border-red-400/30">

**✗ 错误**

```tsx
<div className="space-y-4">
<Avatar className="w-10 h-10">
<span className="text-emerald-600">+20%</span>
<div className="space-y-2">
  <Label /><Input />
</div>
<Button>
  <SearchIcon className="size-4" />
  Search
</Button>
```

</div>

</div>

---
layout: default
---

# 项目感知 + registry + preset

<div class="grid grid-cols-2 gap-6 mt-4">

<div v-click="1">

**项目感知 & registry**

```bash
# 项目配置 + 已装组件
npx shadcn@latest info --json
# 组件文档 + 示例
npx shadcn@latest docs button
# 查 registry（含社区）
npx shadcn@latest search
# 加组件源码
npx shadcn@latest add dialog
```

</div>

<div v-click="2">

**preset 系统（别手拼 URL）**

```bash
npx shadcn@latest preset decode <code>
npx shadcn@latest preset resolve
# 既有项目
npx shadcn@latest apply <code>
# 初始化
npx shadcn@latest init --preset <code>
```

</div>

</div>

<div v-click="3" class="mt-6 p-3 rounded-lg bg-gray-500/10 text-center text-sm">

运行器按项目 `packageManager`：`npx` / `pnpm dlx` / `bunx --bun`

</div>

---
layout: two-cols
layoutClass: gap-6
---

# shadcn MCP + 迁移

<v-clicks>

- **shadcn MCP**（ui.shadcn.com/docs/mcp）
- 一个 MCP URL 接 shadcn.io registry
- AI 直接 **search / browse / install**
- 每个 block / icon / example 都可取
- 与 skill（规则 + 上下文）**互补**

</v-clicks>

::right::

<div v-click="1" class="mt-14 p-5 rounded-xl bg-indigo-500/10 border border-indigo-400/25">

**migrate-radix-to-base**

同仓另一 skill：Radix UI → Base UI 迁移

触发用 `asChild`(radix) 还是 `render`(base)，看 `info` 的 `base` 字段

</div>

---
layout: center
class: text-center
---

# 小结

<div class="grid grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto text-left">

<div v-click="1" class="p-5 rounded-xl bg-neutral-500/10">

**核心机制**

- 4 原则（现有组件/组合/variant/语义色）
- 6 大 Critical Rules（各链 rules/*.md）
- CLI + registry + preset + MCP

</div>

<div v-click="2" class="p-5 rounded-xl bg-blue-500/10">

**记住这些**

- `gap` 非 `space-y`、`size-*` 非 `w/h`
- 表单 `FieldGroup`+`Field`
- Button 图标 `data-icon`
- 别手拼 preset URL

</div>

</div>

<div v-click="3" class="mt-10 text-xl">

**shadcn/ui 官方 · MIT · 规则内建不漂移**

</div>

<div v-click="3" class="mt-2 text-base opacity-70">

`npx shadcn@latest` · 配套 shadcn MCP

</div>

<div v-click="4" class="abs-br m-6 text-sm opacity-60">
shadcn-ui/ui · 组合优先，先 search 再造
</div>
