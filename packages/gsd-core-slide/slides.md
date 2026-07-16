---
theme: seriph
background: https://cover.sli.dev
title: GSD Core
info: |
  Git. Ship. Done. 治 context rot 的上下文工程 + 规范驱动开发框架。
  open-gsd/gsd-core。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# GSD Core

**Git. Ship. Done.** —— 用 fresh-context 子代理，专治 context rot

<div class="pt-6 opacity-80">
open-gsd · 上下文工程 + 规范驱动开发 · 五步阶段循环
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/open-gsd/gsd-core" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
GSD Core，Git Ship Done。它是治 context rot 的上下文工程加规范驱动开发框架，把重活丢进全新上下文的子代理，主会话保持精简。
-->

---
transition: fade-out
---

# 病：context rot

多数 AI 编码配置在规模上失败于三点

<v-clicks>

- **上下文膨胀悄悄拉低质量**——窗口越满，模型越漏越错
- **会话之间没有共享记忆**——换个会话就从零
- **没有东西验证代码真能跑**——「看起来对」就宣布完成

</v-clicks>

<div v-click class="mt-6 text-center text-xl">

**Claude Code is powerful. GSD Core makes it reliable.**

</div>

<style>
h1 { background: linear-gradient(45deg, #4338ca 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
它治的病是 context rot：上下文填满后质量退化。三个失败点——上下文膨胀拉低质量、会话间没记忆、没东西验证代码真能跑。GSD Core 让强大的 Claude Code 变可靠。
-->

---
transition: fade-out
---

# 药：fresh-context 子代理

重活隔离进全新上下文，主会话保持精简

<v-clicks>

- **重活跑 fresh 子代理**——研究/规划/执行都在全新上下文，主会话不被塞爆
- **结构化工件跨会话存活**——`STATE.md`/`CONTEXT.md` 挺过会话边界，接续不丢
- **Verify 步实走查**——诊断并生成修复计划，才宣布 phase 完成

</v-clicks>

<div v-click class="mt-6 text-center">

每个 executor 从**干净的 200k token 上下文**起步——不半途 context rot。

</div>

<style>
h1 { background: linear-gradient(45deg, #4338ca 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
药方三招：重活跑全新上下文子代理，主会话不被塞爆；STATE/CONTEXT 工件跨会话存活；Verify 步实走查。每个 executor 从干净 200k 起步，不半途 context rot。
-->

---
transition: fade-out
---

# 五步阶段循环

每个里程碑重复同一循环，一次只走一个 phase

```text
Discuss → Plan → Execute → Verify → Ship
```

| 步 | 关键动作 |
| --- | --- |
| **Discuss** | 规划前捕获实现决策 |
| **Plan** | 研究、分解，**验证计划装得下一个 fresh context** |
| **Execute** | 并行波次，每 executor 起于干净 200k |
| **Verify** | 走查已建的东西、诊断、修，才宣布完成 |
| **Ship** | 建 PR、归档 phase、下一个 |

<style>
h1 { background: linear-gradient(45deg, #4338ca 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
五步循环：Discuss 定决策、Plan 研究分解、Execute 并行执行、Verify 走查修复、Ship 发 PR。逐 phase 走，一次一个。
-->

---
transition: fade-out
---

# Plan 步最独特：验证「装得下」

如果计划装不下一个全新上下文窗口，就得再拆

<div v-click>

```text
Plan 步：
  研究 → 分解 →  ✅ 计划装得下 fresh context？
                    是 → Execute
                    否 → 再拆，直到装得下
```

</div>

<v-clicks>

- 这保证下游 Execute 的每个子代理都在**充裕上下文**里干活
- 不会半途 context rot、质量下滑
- 「装得下」是 GSD Core 区别于普通规划的关键约束

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #4338ca 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Plan 步最独特：它验证计划装得下一个全新上下文窗口，装不下就再拆。这保证 Execute 的每个子代理都在充裕上下文里干活，不半途 context rot。这是区别于普通规划的关键约束。
-->

---
transition: fade-out
---

# 装：一条命令，禁手拷

```bash
npx @opengsd/gsd-core@latest
```

<v-clicks>

- 向导选运行时（Claude Code/OpenCode/Codex/Cursor/Windsurf…）+ 全局/本地
- **起项目**：`/gsd-new-project`（绿地）·`/gsd-onboard`（已有库）
- **接续**：`/gsd-next` 读 `STATE.md` 恢复

</v-clicks>

<div v-click class="mt-4 text-center">

⚠️ **禁止直接拷 `agents/`、`commands/` 文件**——跨运行时适配靠 installer 生成，手拷会坏。

</div>

<style>
h1 { background: linear-gradient(45deg, #4338ca 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
安装一条命令 npx opengsd/gsd-core。向导选运行时和全局本地。起项目用 new-project 或 onboard，接续用 next 读 STATE 恢复。红线：禁止直接拷 agents commands 文件，跨运行时适配靠 installer 生成。
-->

---
transition: fade-out
---

# 34 个子代理 + 记忆宫殿

重活隔离进 fresh context，跨会话有记忆

<div class="grid grid-cols-2 gap-4 mt-3 text-sm">
<div v-click>

**34 个 gsd-* 子代理**

- 研究：phase/domain/project-researcher
- 规划：planner、plan-checker、roadmapper
- 执行：executor、code-fixer
- 验证：verifier、security-auditor

</div>
<div v-click>

**跨会话记忆**

- `STATE.md` — 当前状态
- `CONTEXT.md` — 项目上下文
- **mempalace** 记忆宫殿
  - `/gsd-mempalace-capture`/`recall`

</div>
</div>

<div v-click class="mt-3 text-center">

每个子代理在自己的干净上下文里干一件事、返回结果。

</div>

<style>
h1 { background: linear-gradient(45deg, #4338ca 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
34 个 gsd 子代理分工研究、规划、执行、验证，每个在干净上下文里干一件事。跨会话记忆两层：STATE/CONTEXT 工件，加记忆宫殿 mempalace 沉淀召回。
-->

---
layout: center
class: text-center
---

# 一句话记住

**GSD Core 治 context rot：重活跑 fresh-context 子代理、Plan 验证「装得下」、Verify 实走查、STATE/CONTEXT 跨会话记忆。禁手拷、用 installer。**

<div class="mt-8 opacity-80">

context rot · 五步循环 · fresh 子代理 · 跨会话记忆 · 规范驱动

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/open-gsd/gsd-core" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://www.npmjs.com/package/@opengsd/gsd-core" target="_blank" class="slidev-icon-btn"><carbon:cube /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #4338ca 10%, #7c3aed 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。GSD Core 治 context rot：重活跑全新上下文子代理、Plan 验证装得下、Verify 实走查、STATE CONTEXT 跨会话记忆。记住禁手拷、用 installer。
-->
