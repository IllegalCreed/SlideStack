---
theme: seriph
background: https://cover.sli.dev
title: Antfu Skills
info: |
  Anthony Fu 精选 agent 技能：git submodule 引源文档 + 三类技能 + opinionated 约定。
  antfu/skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Antfu Skills

Anthony Fu 精选技能——**submodule 引源文档**，Vite/Vue 一站集

<div class="pt-6 opacity-80">
antfu/skills · Vue/Nuxt/Vite 核心 + UnoCSS/Vitest 作者 · 三类技能 · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/antfu/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Antfu Skills 是 Anthony Fu 精选的 agent 技能集。他是 Vue Nuxt Vite 核心团队，也是 UnoCSS Vitest Slidev 的作者。最与众不同的是用 git submodule 直接引用各工具源文档。
-->

---
transition: fade-out
---

# 核心创新：submodule 引源文档

解决「技能内容会过时」的老问题

<v-clicks>

- 技能**直接引用各工具的官方源文档** submodule
- vue 引 vuejs/docs、vite 引 vitejs/vite、pinia 引 vuejs/pinia……
- 好处一：**上下文可靠**——基于真实官方文档，非二手转述
- 好处二：**随上游更新**——submodule 一 sync 就跟着新，不像手抄会过时

</v-clicks>

<div v-click class="mt-4 text-center">

与其手写很快过时的最佳实践，不如引官方文档源、自动同步。

</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #22c55e 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
核心创新：用 git submodule 直接引用各工具源文档。vue 引 vuejs docs，vite 引 vitejs vite。好处是上下文可靠、随上游更新，不像手抄的技能会过时。这解决了技能内容会过时的老问题。
-->

---
transition: fade-out
---

# 三类技能

一站覆盖 Vite/Vue 栈

<v-clicks>

- **① 手工维护（opinionated）**：`antfu`（工具约定）、`antfu-design`（UnoCSS 设计）
- **② 官方文档生成**：vue / nuxt / pinia / vite / vitepress / vitest / unocss / pnpm（随 docs submodule 同步）
- **③ vendored（同步外部）**：slidev / tsdown / turborepo / vueuse + vue-best-practices（借 vuejs-ai）+ web-design（借 vercel-labs）

</v-clicks>

<div v-click class="mt-3 text-center text-sm opacity-80">

vendored 体现生态**互相借用**——好技能不重复造。

</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #22c55e 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
三类技能：手工维护的 antfu 和 antfu-design 是 opinionated 个人偏好；官方文档生成的 vue nuxt pinia 等随 submodule 同步；vendored 的从外部仓库同步，还借用了 Vue Skills 和 Vercel 的技能。vendored 体现生态互相借用。
-->

---
transition: fade-out
---

# antfu 约定：显式、可追溯

「读者应能不跑工具就追溯每个名字从哪来」

<v-clicks>

- **显式 import**：避免 auto-import；框架提供时（Nuxt/Nitro）**新项目也关掉**
- **默认无 path alias**：用相对导入 `./foo`，只在已配置时才用 alias
- **isomorphic 优先**：Node/浏览器/worker 都能跑，环境专有加 `// @env node`
- **types.ts / constants.ts 分离** + 显式返回类型

</v-clicks>

<div v-click class="mt-3 text-center text-sm opacity-80">

「关掉 Nuxt auto-import」有争议但一致——可追溯性 > 少写几行 import。

</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #22c55e 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
antfu 技能凝练 Anthony 的 opinionated 约定，核心是显式性：读者应能不跑工具就追溯每个名字从哪来。显式 import 关掉 auto-import 连 Nuxt 新项目也关、默认无 path alias、isomorphic 优先加 @env 注释、types constants 分离。关掉 auto-import 有争议但一致——可追溯性优先。
-->

---
transition: fade-out
---

# Anthony 论 Skills vs AGENTS.md

一个实用技巧

<v-clicks>

- skills 价值 = **shareable**（跨项目复用）+ **on-demand**（按需拉取，超上下文窗口）
- 承认「AGENTS.md outperforms skills」**为真**——全量前置、agent 总遵守、无假阴性
- 但他视为**工具集成的 gap，会改善**

</v-clicks>

<div v-click class="mt-4 text-center text-xl">

技巧：**想让某技能总生效，就在 AGENTS.md 里引用它**——兼得两者之长。

</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #22c55e 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Anthony 对 Skills vs AGENTS.md 有见地：skills 价值是可分享加按需。他承认 AGENTS.md 更稳为真，全量前置总遵守无假阴性，但视为工具 gap 会改善。给了个实用技巧：想让某技能总生效，就在 AGENTS.md 里引用它，兼得两者之长。
-->

---
transition: fade-out
---

# 可 fork 作模板

生成你自己的技能集

```bash
pnpm install
# 改 meta.ts 填你的项目和技能源
pnpm start cleanup   # 清旧 submodule
pnpm start init      # clone submodule
pnpm start sync      # 同步 vendored
# 让 agent：Generate skills for <project>
```

<div v-click class="mt-4 text-center">

装本集：`pnpx skills add antfu/skills --skill='*'`（`-g` 全局）。

</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #22c55e 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Antfu Skills 设计成模板，可 fork 生成你自己的：改 meta.ts、cleanup、init、sync，然后让 agent 从源文档生成技能。装本集用 pnpx skills add antfu/skills 加 skill 星号。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Antfu Skills：Anthony Fu 精选，git submodule 引源文档自动同步；三类技能覆盖 Vite/Vue 栈；antfu 约定=显式可追溯（关 auto-import、无 alias）。**

<div class="mt-8 opacity-80">

submodule 引源 · 三类技能 · 显式可追溯 · Skills vs AGENTS.md

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/antfu/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://antfu.me/" target="_blank" class="slidev-icon-btn"><carbon:user /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #0ea5e9 10%, #22c55e 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Antfu Skills 是 Anthony Fu 精选，用 git submodule 引源文档自动同步，三类技能覆盖 Vite Vue 栈，antfu 约定是显式可追溯——关 auto-import、无 alias。
-->
