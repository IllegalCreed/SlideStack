---
theme: seriph
background: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80
title: LangChain & LangGraph Skills
info: |
  ## LangChain & LangGraph Skills
  LangChain 官方 agent 技能——三层栈 + 14 skill，Claude Code 任务 29%→95%。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# LangChain & LangGraph Skills

LangChain 官方 agent 技能

<div class="pt-8 text-xl opacity-80">
三层栈 · 14 skill · 渐进披露 · 任务通过率 29% → 95%
</div>

<div class="abs-br m-6 text-sm opacity-60">
langchain-ai/langchain-skills · 官方
</div>

---
layout: two-cols
layoutClass: gap-8
---

# 它是什么

<v-clicks>

- **LangChain 官方**（langchain-ai org）
- 教 agent 用 **LangChain / LangGraph / Deep Agents** 建 agent
- **14 skill**，渐进披露
- 入口 `ecosystem-primer`（**INVOKE FIRST** 选型）
- 实测 Claude Code LangChain 任务 **29%→95%**

</v-clicks>

::right::

<div v-click="1" class="mt-16 p-6 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border border-emerald-400/25">

**一句话**

> 先读 ecosystem-primer 选层，再按需加载对应 skill，用最新正确 API 建 agent。

</div>

<div v-click="2" class="mt-4 p-4 rounded-lg bg-gray-500/10 text-sm">

```bash
npx skills add \
  langchain-ai/langchain-skills \
  --skill '*' --yes
```

</div>

---
layout: default
---

# 三层栈（+ LangSmith）

<div class="text-sm mt-1 opacity-80">高层依赖低层，但不必直接用低层</div>

<div class="grid grid-cols-1 gap-2 mt-2">

<div v-click="1" class="p-3 rounded-lg bg-purple-500/10 border-l-4 border-purple-500">

**Deep Agents**（顶层 · harness）—— batteries-included：规划 / 文件 / 子代理 / 记忆开箱即用 · `create_deep_agent()`

</div>

<div v-click="2" class="p-3 rounded-lg bg-blue-500/10 border-l-4 border-blue-500">

**LangGraph**（中层 · runtime）—— durable 执行、自定义控制流、有状态工作流 · `StateGraph`

</div>

<div v-click="3" class="p-3 rounded-lg bg-emerald-500/10 border-l-4 border-emerald-500">

**LangChain**（底层 · framework）—— 模型 / 工具 / agent 循环，provider 无关、最易上手 · `create_agent()`

</div>

<div v-click="4" class="p-2 rounded-lg bg-amber-500/10 text-center text-sm">

**LangSmith**（横切）—— 可观测 + 评测，框架无关，始终推荐搭配

</div>

</div>

---
layout: default
---

# LangChain：create_agent()

<div v-click="1" class="text-sm mt-2">

硬规矩：**建 LangChain agent 必须用 `create_agent()`**（处理 agent 循环/工具执行/状态），旧写法都过时。

</div>

<div v-click="2" class="mt-3">

| 参数 | 用途 | 例 |
| --- | --- | --- |
| `model` | LLM | `"anthropic:claude-sonnet-4-5"` |
| `tools` | 工具列表 | `[search, calculator]` |
| `system_prompt` | 指令 | `"You are..."` |
| `checkpointer` | 状态持久化 | `MemorySaver()` |

</div>

<div v-click="3" class="mt-3 p-3 rounded-lg bg-gray-500/10 text-sm">

工具用 `@tool` / `tool()`；自定义流程（human-in-the-loop / 错误处理）用 **middleware**

</div>

---
layout: two-cols
layoutClass: gap-6
---

# LangGraph：StateGraph

<v-clicks>

- **StateGraph**：建有状态图主类
- **Nodes**：做工作 + 更新 state
- **Edges**：执行顺序（静态/条件）
- **START / END**：入口/出口
- **State + Reducers**：合并规则
- **Command / Send**：控制流 / 扇出
- 执行前**必须 `compile()`**

</v-clicks>

::right::

<div v-click="1" class="mt-8 p-5 rounded-xl bg-purple-500/10">

**Deep Agents：create_deep_agent()**

内建 middleware 开箱即用：

- TodoList 任务规划
- 文件系统上下文管理
- SubAgent 任务委派
- Store 长期记忆
- human-in-the-loop 审批
- Skills 按需加载

**「配置，而非实现」**

</div>

---
layout: default
---

# 何时用哪层

<div class="grid grid-cols-3 gap-4 mt-8 text-sm">

<div v-click="1" class="p-5 rounded-xl bg-emerald-500/10 text-center">

**LangChain**
`create_agent()`

轻量、易上手<br/>工具调用 agent

</div>

<div v-click="2" class="p-5 rounded-xl bg-blue-500/10 text-center">

**LangGraph**
`StateGraph`

完全自定义控制流<br/>durable 状态机

</div>

<div v-click="3" class="p-5 rounded-xl bg-purple-500/10 text-center">

**Deep Agents**
`create_deep_agent()`

batteries-included<br/>复杂长任务多步编排

</div>

</div>

<div v-click="4" class="mt-8 text-center text-lg opacity-80">

不确定选哪个？先 **INVOKE `ecosystem-primer`** 做选型

</div>

---
layout: center
class: text-center
---

# 小结

<div class="grid grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto text-left">

<div v-click="1" class="p-5 rounded-xl bg-emerald-500/10">

**核心机制**

- 三层栈 + LangSmith
- 14 skill 渐进披露
- ecosystem-primer 先行选型
- 导向最新正确 API

</div>

<div v-click="2" class="p-5 rounded-xl bg-blue-500/10">

**记住这些**

- LangChain `create_agent()`（旧写法都过时）
- LangGraph `StateGraph` 执行前 `compile()`
- Deep Agents `create_deep_agent()` 配置而非实现
- 早期开发、对照最新文档

</div>

</div>

<div v-click="3" class="mt-10 text-xl">

**LangChain 官方 · 任务通过率 29% → 95%**

</div>

<div v-click="4" class="abs-br m-6 text-sm opacity-60">
langchain-ai/langchain-skills · npx skills add
</div>
