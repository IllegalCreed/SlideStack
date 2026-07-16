---
theme: seriph
background: https://cover.sli.dev
title: Vue Skills
info: |
  Vue 3 开发 agent 技能：Capability/Efficiency 分类 + eval 驱动筛选。社区项目。
  vuejs-ai/skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Vue Skills

Vue 3 开发 agent 技能——**eval 驱动**筛选，只留真正有增量的规则

<div class="pt-6 opacity-80">
vuejs-ai/skills · 社区项目（非官方，Evan 表态可能转正式）· 8 技能 · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/vuejs-ai/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Vue Skills 是面向 Vue 3 开发的 agent 技能。它最有价值的不只是内容，而是方法论：技能分类 + eval 驱动筛选。注意它是社区项目，非 Vue 官方。
-->

---
transition: fade-out
---

# 先说清楚：状态

如实呈现，不夸大

<v-clicks>

- GitHub 组织 `vuejs-ai` 明确标 **"(Unofficial)"**——非官方
- 作者计划成熟后**提议转交 Vue 官方**
- **Evan You 表态**：更成熟、测试更充分后**可能转正式**
- README 诚实警告：源自真实 issue，**可能因幻觉不完整**

</v-clicks>

<div v-click class="mt-4 text-center">

把它当「高质量、有官方转正路径的**社区** Vue 技能」——别说成官方。

</div>

<style>
h1 { background: linear-gradient(45deg, #16a34a 10%, #0891b2 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
先说清楚状态：vuejs-ai 组织明确标 Unofficial，是社区项目。作者计划成熟后提议转交 Vue 官方，Evan You 也表态可能转正式，但现在不是。README 自承可能因幻觉不完整。把它当社区技能，别说成官方。
-->

---
transition: fade-out
---

# 方法论：Capability vs Efficiency

这个分类帮你判断技能价值

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**Capability**

AI 没它就**解不了**

- 版本专有问题
- 未文档化的行为
- 近期新特性
- 训练数据外的边界

→ 非装不可

</div>
<div v-click>

**Efficiency**

AI 能解但**不够好**

- 最优模式
- 最佳实践
- 一致的做法

→ 装了更好

</div>
</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

理解一个技能的价值到底在「让 AI 从不会到会」还是「从能到更好」。

</div>

<style>
h1 { background: linear-gradient(45deg, #16a34a 10%, #0891b2 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
方法论第一层：技能分两类。Capability 是 AI 没它解不了的——版本专有、未文档化、新特性、训练外边界，非装不可。Efficiency 是能解但不够好的——最优模式，装了更好。这个分类帮你判断技能价值。
-->

---
transition: fade-out
---

# eval 驱动筛选：证据驱动策展

每条规则都跑 eval 验证，不是拍脑袋

```text
1. Baseline    → 不装技能跑一遍
2. With-skill  → 装技能跑一遍
```

| Baseline | With Skill | 处理 |
| --- | --- | --- |
| **Fail** | **Pass** | ✅ 保留（从不会到会） |
| Pass | Pass | ⚪ 考虑移除（本来就会） |

<div v-click class="mt-3 text-center">

规则**只有让模型解决原本解决不了的才保留**——避免堆无用规则。

</div>

<style>
h1 { background: linear-gradient(45deg, #16a34a 10%, #0891b2 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
方法论第二层最硬核：eval 驱动筛选。每条规则跑 Baseline 无技能和 With-skill 有技能两遍。Fail 变 Pass 才保留，Pass 变 Pass 考虑移除。规则只有让模型从不会到会才留，避免堆一堆本来就会的无用规则。
-->

---
transition: fade-out
---

# 8 个技能：Vue 3 主栈

| 技能 | 覆盖 |
| --- | --- |
| `vue-best-practices` | Composition API + TS、常见坑、SSR、性能 |
| `vue-options-api` | Options API、`this` 上下文、生命周期 |
| `vue-router` | Vue Router 4、导航守卫、路由参数 |
| `vue-pinia` | store 设置、响应式、状态模式 |
| `vue-testing` | Vitest、Vue Test Utils、Playwright |
| `vue-jsx` / `vue-debug-guides` | JSX 差异 / 运行时错误、hydration |
| `create-adaptable-composable` | `MaybeRef`/`MaybeRefOrGetter` 输入 |

<style>
h1 { background: linear-gradient(45deg, #16a34a 10%, #0891b2 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
8 个技能覆盖 Vue 3 主栈：best-practices、options-api、router、pinia、testing、jsx、debug、可复用 composable。其中 create-adaptable-composable 教用 MaybeRef 和 MaybeRefOrGetter 让 composable 输入更灵活。
-->

---
transition: fade-out
---

# 触发：Use vue skill 前缀

显式触发最稳

<div v-click>

```text
Use vue skill, create a todo app
```

</div>

<v-clicks>

- 前缀 `Use vue skill` **显式触发**，确保 AI 遵循文档化模式
- 不加前缀时，触发取决于 prompt 与描述关键词的匹配度——可能不一致
- 装：`npx skills add vuejs-ai/skills` 或 Claude Code 插件市场

</v-clicks>

<div v-click class="mt-3 text-center text-sm opacity-80">

装技能后 demo：状态入 composable、组件拆分、原始数据用 shallowRef。

</div>

<style>
h1 { background: linear-gradient(45deg, #16a34a 10%, #0891b2 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
触发建议加前缀 Use vue skill 显式触发，确保 AI 遵循文档化模式。不加前缀时触发取决于匹配度可能不一致。装技能后的 demo 显示：状态移进 composable、组件合理拆分、原始响应式数据用 shallowRef。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Vue Skills（社区，非官方）：8 个 Vue 3 技能，Capability/Efficiency 分类 + eval 驱动筛选（只留让模型从不会到会的规则），`Use vue skill` 前缀触发。**

<div class="mt-8 opacity-80">

社区项目 · Capability/Efficiency · eval 驱动 · Vue 3 主栈

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/vuejs-ai/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://github.com/orgs/vuejs/discussions/14334" target="_blank" class="slidev-icon-btn"><carbon:chat /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #16a34a 10%, #0891b2 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Vue Skills 是社区项目非官方，8 个 Vue 3 技能，方法论是 Capability/Efficiency 分类加 eval 驱动筛选，只留让模型从不会到会的规则。触发加 Use vue skill 前缀。
-->
