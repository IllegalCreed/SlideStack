---
theme: seriph
background: https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?w=1600&q=80
title: Svelte AI Tools
info: |
  ## Svelte AI Tools
  Svelte 官方 agent 编码工具——MCP + skills + agent + LSP 四件套，面向 Svelte 5。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Svelte AI Tools

Svelte 官方 agent 编码工具

<div class="pt-8 text-xl opacity-80">
一个插件打包 <b>MCP + skills + agent + LSP</b> · 面向 Svelte 5
</div>

<div class="abs-br m-6 text-sm opacity-60">
sveltejs/ai-tools · MIT · The official svelte MCP
</div>

---
layout: two-cols
layoutClass: gap-8
---

# 它是什么

<v-clicks>

- **Svelte 官方**（sveltejs org，MIT）
- README：「The official svelte MCP for all your agentic needs」
- 一个 Claude 插件（name `svelte`，v1.0.4）
- 打包 **MCP + 2 skills + agent + LSP**
- 面向 **Svelte 5**（runes）+ SvelteKit

</v-clicks>

::right::

<div v-click="1" class="mt-16 p-6 rounded-xl bg-gradient-to-br from-orange-500/15 to-red-500/10 border border-orange-400/25">

**一句话**

> 让 AI 用**官方最新文档**写现代 Svelte，写完自动 `svelte-autofixer` 校验。

</div>

<div v-click="2" class="mt-4 p-4 rounded-lg bg-gray-500/10 text-sm">

接入远程 MCP：

```text
https://mcp.svelte.dev
```

</div>

---
layout: default
---

# 四件套

<div class="grid grid-cols-2 gap-5 mt-6">

<div v-click="1" class="p-5 rounded-xl bg-blue-500/10 border border-blue-400/25">

**① MCP 服务器** `@sveltejs/mcp`

远程（mcp.svelte.dev），STDIO + HTTP<br/>核心工具 `svelte-autofixer`，从官方文档拉资源

</div>

<div v-click="2" class="p-5 rounded-xl bg-green-500/10 border border-green-400/25">

**② 两个 skills**

`svelte-code-writer`（CLI 查文档+分析）<br/>`svelte-core-bestpractices`（runes 最佳实践）

</div>

<div v-click="3" class="p-5 rounded-xl bg-purple-500/10 border border-purple-400/25">

**③ agent** `svelte-file-editor`

编辑 .svelte 文件的专用子代理

</div>

<div v-click="4" class="p-5 rounded-xl bg-amber-500/10 border border-amber-400/25">

**④ LSP** `svelteserver --stdio`

诊断 / 导航 / hover，真实语言智能

</div>

</div>

---
layout: default
---

# MCP 与 svelte-autofixer

<div class="grid grid-cols-2 gap-6 mt-4">

<div v-click="1">

**架构**

- `tmcp` 库 + HTTP / STDIO 双传输
- Valibot schema 校验
- 从**官方 Svelte 文档**拉 tools/prompts/resources

**分析引擎**

- `svelte-eslint-parser` + TS parser → AST
- scope 分析 + **rune 检测**

</div>

<div v-click="2" class="p-5 rounded-lg bg-pink-500/10 border-l-4 border-pink-500 self-center">

**autofixer 抓反模式**

`assign_in_effect`：检测在 `$effect` 里给 `$state` 赋值

```svelte
<script>
  let n = $state(0);
  $effect(() => {
    n = compute(); // ⚠️ 被抓
  });
</script>
```

</div>

</div>

---
layout: default
---

# svelte-code-writer：CLI 三命令

<div v-click="1" class="mt-4">

```bash
# 1. 列出所有 Svelte 5 / SvelteKit 文档段落
npx @sveltejs/mcp list-sections

# 2. 取指定段落完整文档（先 list 再 get）
npx @sveltejs/mcp get-documentation "$state,$derived,$effect"

# 3. 分析代码给修复（定稿前必跑）
npx @sveltejs/mcp svelte-autofixer ./src/lib/Component.svelte
```

</div>

<div v-click="2" class="mt-4 grid grid-cols-2 gap-4">

<div class="p-4 rounded-lg bg-blue-500/10 text-sm">

**工作流**

拿不准语法 → list + get<br/>审查/调试 → autofixer<br/>**定稿前必跑** autofixer

</div>

<div class="p-4 rounded-lg bg-amber-500/10 text-sm">

**⚠️ 转义坑**

CLI 传 runes，`$` → `\$`<br/>`'...let n = \$state(0)...'`<br/>老项目加 `--svelte-version 4`

</div>

</div>

---
layout: center
class: text-center
---

# svelte-core-bestpractices：runes 规则

<div class="grid grid-cols-2 gap-5 mt-6 max-w-4xl mx-auto text-left">

<div v-click="1" class="p-5 rounded-xl bg-orange-500/10">

**`$state`**

只给响应式变量；对象/数组深响应式（proxy 有开销）；大对象只重赋值 → `$state.raw`

</div>

<div v-click="2" class="p-5 rounded-xl bg-green-500/10">

**`$derived`**

从 state 计算**优先用它**、别用 `$effect`；可写；复杂用 `$derived.by`

</div>

<div v-click="3" class="p-5 rounded-xl bg-red-500/10">

**`$effect`**

**逃生舱，尽量避免**；别在里面改 state；别包 `if (browser)`

</div>

<div v-click="4" class="p-5 rounded-xl bg-blue-500/10">

**`$props`**

当作会变；依赖 props 的值用 `$derived`

</div>

</div>

---
layout: default
---

# $derived vs $effect

<div class="grid grid-cols-2 gap-6 mt-6">

<div v-click="1" class="p-5 rounded-xl bg-green-500/10 border border-green-400/30">

**✓ 该这样**

```js
let square = $derived(num * num);
```

派生值用 `$derived`——声明式、可追踪、自动更新

</div>

<div v-click="2" class="p-5 rounded-xl bg-red-500/10 border border-red-400/30">

**✗ 别这样**

```js
let square;
$effect(() => {
  square = num * num;
});
```

`$effect` 是逃生舱，滥用致隐式依赖 + 难追踪

</div>

</div>

<div v-click="3" class="mt-6 text-center text-lg opacity-80">

同步外部库用 `{@attach}` · 调试用 `$inspect` · 观察外部用 `createSubscriber`

</div>

---
layout: default
---

# 四件如何协同

<div v-click="1" class="mt-6">

```text
拿不准 Svelte 语法
   → svelte-code-writer：list-sections + get-documentation（官方最新文档）
写 / 改 .svelte
   → svelte-file-editor agent + LSP（svelteserver 诊断/导航/hover）
   → 遵循 svelte-core-bestpractices（runes 规则）
定稿前
   → svelte-autofixer 校验 rune 用法，有问题即修
```

</div>

<div v-click="2" class="mt-8 grid grid-cols-4 gap-3 text-center text-sm">

<div class="p-3 rounded-lg bg-blue-500/10">查文档<br/>**MCP/skill**</div>
<div class="p-3 rounded-lg bg-purple-500/10">写代码<br/>**agent+LSP**</div>
<div class="p-3 rounded-lg bg-green-500/10">守规则<br/>**bestpractices**</div>
<div class="p-3 rounded-lg bg-pink-500/10">校验<br/>**autofixer**</div>

</div>

---
layout: center
class: text-center
---

# 小结

<div class="grid grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto text-left">

<div v-click="1" class="p-5 rounded-xl bg-orange-500/10">

**四件套**

- MCP `@sveltejs/mcp`（autofixer）
- 2 skills（code-writer / bestpractices）
- agent `svelte-file-editor`
- LSP `svelteserver`

</div>

<div v-click="2" class="p-5 rounded-xl bg-blue-500/10">

**Svelte 5 runes**

- `$state` / `$state.raw`
- `$derived` 优先于 `$effect`
- `$props` 当会变
- `{@attach}` / `createSubscriber`

</div>

</div>

<div v-click="3" class="mt-10 text-xl">

**Svelte 官方 · MIT · 官方文档不漂移**

</div>

<div v-click="3" class="mt-2 text-base opacity-70">

装 `svelte` 插件 · 或接 mcp.svelte.dev

</div>

<div v-click="4" class="abs-br m-6 text-sm opacity-60">
sveltejs/ai-tools · 定稿前必跑 svelte-autofixer
</div>
