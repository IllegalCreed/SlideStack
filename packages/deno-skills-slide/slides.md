---
theme: seriph
background: https://cover.sli.dev
title: Deno Skills
info: |
  Deno 官方 AI 编码助手技能集：JSR 导入、deno.json、Fresh 2.x、Deno Deploy、@deno/sandbox。
  denoland/skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Deno Skills

Deno 官方技能集——把**现代 Deno 开发**教给 AI 助手

<div class="pt-6 opacity-80">
denoland/skills · guidance / deploy / frontend / expert / templates / sandbox · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/denoland/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Deno Skills 是 Deno 官方（denoland org）出品的 AI 编码助手技能集，6 个技能覆盖从 runtime、前端到部署、沙箱的现代 Deno 开发。
-->

---
transition: fade-out
---

# 官方出品，6 个技能

denoland org 本身，不是社区二手总结

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**定位**

- 出自 **denoland org**（Deno 团队）
- 遵 agentskills.io 开放规范
- 全栈覆盖：runtime → 前端 → 部署 → 沙箱
- MIT 开源

</div>
<div v-click>

**三大原则**

- **JSR（`jsr:`）优先**于旧 URL 导入（废弃）
- **`npm:`** 作后备
- **内建工具** `deno fmt` / `lint` / `test` / `doc`

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

核心价值：**纠正 LLM 过时习惯**——默认 JSR、Fresh 2.x、`deno deploy`。

</div>

<style>
h1 { background: linear-gradient(45deg, #0a0a0a 10%, #70FFAF 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
它出自 denoland org，遵循开放规范，覆盖全栈。三大原则：JSR 优先、npm 后备、内建工具。最大价值是把 AI 从旧 URL 导入、Fresh 1.x、deployctl 这些过时习惯拉回现代写法。
-->

---
transition: fade-out
---

# 安装

插件一条命令，或手动 clone

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**方式一：插件（Claude Code）**

```bash
/plugin marketplace add denoland/skills
/plugin install deno-skills@denoland-skills
```

</div>
<div v-click>

**方式二：clone + 拷贝**

```bash
git clone \
  https://github.com/denoland/skills.git
cp -r skills/* ~/.claude/skills/
```

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

Cursor → `~/.cursor/skills/`；VS Code Copilot → `.github/skills/`。装后自动生效。

</div>

<style>
h1 { background: linear-gradient(45deg, #0a0a0a 10%, #70FFAF 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
两种装法：插件方式两条命令；手动 clone 后把 skills 拷进技能目录。Cursor 和 VS Code Copilot 各有目录。装后 AI 在相关任务自动应用。
-->

---
transition: fade-out
---

# 6 个技能一览

| 技能 | 何时用 | 覆盖 |
| --- | --- | --- |
| `deno-guidance` | 起项目、选包、配 `deno.json` | JSR、权限、CLI 工具 |
| `deno-deploy` | 部署到 Deno Deploy | `deno deploy`、env、KV、tunnel |
| `deno-frontend` | 建 Fresh 前端 | Fresh 2.x、island、Preact、Tailwind |
| `deno-expert` | 审查 / 调试代码 | checklist、反模式、`deno.lock` |
| `deno-project-templates` | 脚手架新项目 | Fresh / CLI / 库 / API |
| `deno-sandbox` | 跑不可信 / AI 代码 | `@deno/sandbox` microVM 隔离 |

<style>
h1 { background: linear-gradient(45deg, #0a0a0a 10%, #70FFAF 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
6 个技能：guidance 打地基，deploy 管部署，frontend 建 Fresh，expert 做审查，templates 出脚手架，sandbox 隔离执行。各有明确触发条件。
-->

---
transition: fade-out
---

# deno-guidance：JSR 优先

标准库走 `jsr:@std/*`，import map 写进 `deno.json`

```jsonc
// deno.json
{
  "imports": {
    "@std/http": "jsr:@std/http@1",
    "@std/path": "jsr:@std/path@1"
  }
}
```

<div v-click class="mt-3 text-sm opacity-80">

优先级：**`jsr:`（首选）→ `npm:`（无替代）→ 避免旧 URL 导入（废弃）**。用 `deno add jsr:@std/http` 加包，保持 lockfile 同步。

</div>

<style>
h1 { background: linear-gradient(45deg, #0a0a0a 10%, #70FFAF 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
deno-guidance 是地基。包管理优先级 JSR、npm、避免废弃 URL。标准库在 @std，import map 写进 deno.json，用 deno add 加包保持 lockfile 同步。
-->

---
transition: fade-out
---

# `deno update` ≠ `deno upgrade`

一个更新依赖，一个更新 runtime

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**`deno update`**

- 更新 `deno.json` 里的**项目依赖**
- 遵守 semver 范围
- 保持依赖最新

</div>
<div v-click>

**`deno upgrade`**

- 更新 **Deno runtime 本身**
- 与项目依赖无关

</div>
</div>

<div v-click class="mt-6 text-center">

改完代码常跑：`deno fmt && deno lint && deno test`；CI 里用 `deno fmt --check`。

</div>

<style>
h1 { background: linear-gradient(45deg, #0a0a0a 10%, #70FFAF 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
高频混淆点：deno update 更新项目依赖，deno upgrade 更新 Deno 本身。改完代码跑 fmt/lint/test，CI 用 fmt --check 只检查不改。
-->

---
transition: fade-out
---

# deno-deploy：用 `deno deploy`，不是 `deployctl`

<v-clicks>

- `deployctl` 是 Deno Deploy **Classic**（已弃用）
- `deno deploy` 是**内建于 Deno CLI 的现代命令**
- 需 **Deno ≥ 2.4.2**（子命令在 2.4 引入）
- 核心：`deno deploy --prod`（生产）/ `deno deploy`（预览）
- 拿不准 flag 先跑 `deno deploy --help`，别猜

</v-clicks>

<div v-click class="mt-4 text-center text-sm opacity-80">

流程：定位 app 目录 → 查版本 → 查启动依赖 → 部署。

</div>

<style>
h1 { background: linear-gradient(45deg, #0a0a0a 10%, #70FFAF 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
最重要的纠偏点：部署用 deno deploy 不用 deployctl。deployctl 是 Classic 弃用，deno deploy 内建现代，需 Deno 2.4.2 以上。核心命令 deno deploy --prod。不确定 flag 先跑 --help。
-->

---
transition: fade-out
---

# env 三 context + Deno KV

内建 KV 零配置，每个环境自动隔离

```typescript
const kv = await Deno.openKv();
await kv.set(["users", "alice"], { name: "Alice" });
const user = await kv.get(["users", "alice"]);
console.log(user.value); // { name: "Alice" }
```

<div v-click class="mt-3 text-sm opacity-80">

env 三 context：**Production / Development / Build**；`deno deploy env add KEY val --secret` 存密钥；`deno task --tunnel dev` 本地联调（同步 env、连开发库）。

</div>

<style>
h1 { background: linear-gradient(45deg, #0a0a0a 10%, #70FFAF 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Deno KV 零配置，Deno.openKv 直接用，每个环境自动隔离独立库。环境变量分三个 context，密钥用 --secret。tunnel 让本地连上托管的开发库并同步环境变量。
-->

---
transition: fade-out
---

# deno-frontend：Fresh 2.x island 架构

页面服务端渲染，只有交互部分发 JavaScript

<v-clicks>

- **`islands/`**——交互组件，客户端 hydrate，props 须可序列化（不能传函数）
- **`components/`**——纯服务端组件，不发 JS
- **Fresh 2.x**：`import { App } from "fresh"`、无 manifest、`vite.config.ts`、单 `(ctx)` 参数、统一 `_error.tsx`
- 建项目：`deno run -Ar jsr:@fresh/init`，dev 端口 **5173**

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #0a0a0a 10%, #70FFAF 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Fresh 用 island 架构：整页 SSR，只有 islands 目录里的交互组件发 JS，props 必须可序列化。components 目录是纯服务端组件。务必 Fresh 2.x：from fresh、无 manifest、vite.config、单 ctx、统一 _error。
-->

---
transition: fade-out
---

# Fresh 数据获取：handler + `{ data }`

不能用 `ctx.render()` 传数据——这是最常见的 LLM 错误

```tsx
export const handler = define.handlers(async (ctx) => {
  const posts = await (await fetch("/api/posts")).json();
  return { data: { posts } };          // 返回 { data: {...} }
});

export default define.page<typeof handler>(({ data }) => (
  <ul>{data.posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
));
```

<style>
h1 { background: linear-gradient(45deg, #0a0a0a 10%, #70FFAF 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Fresh 2.x 数据获取：handler 返回带 data 属性的对象，页面用 define.page typeof handler 关联类型拿到 data。绝不能用 ctx.render 传数据——这是高频踩坑点。简单查询也可用 async 服务端组件。
-->

---
transition: fade-out
---

# Preact + Tailwind

Fresh 用 Preact（3KB），不是 React

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**Preact**

- `class` 直接可用（不必 `className`）
- `@preact/signals` 替代 `useState`
- 3KB vs React ~40KB
- hooks 用法相同

</div>
<div v-click>

**Tailwind（可选）**

装**两个包**：

```bash
deno add npm:@tailwindcss/vite \
  npm:tailwindcss
```

只装插件会报 `Can't resolve 'tailwindcss'`。

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #0a0a0a 10%, #70FFAF 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Preact 是 3KB 的 React 替代：class 直接用，signals 替代 useState，hooks 相同。Tailwind 可选，但必须装两个包——Vite 插件加核心库，只装插件会报错。
-->

---
transition: fade-out
---

# deno-sandbox：隔离执行

Firecracker microVM，与 AWS Lambda 同技术

```typescript
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();   // 自动释放
const child = await sandbox.spawn("deno", {
  args: ["run", "--allow-none", "user.ts"],     // 最小权限
  stdout: "piped",
});
const output = await child.output();
```

<div v-click class="text-sm opacity-80">

纪律：**永远 `await using`**、跑不可信代码用 `--allow-none`、pipe 输出、设超时、输出当数据校验。

</div>

<style>
h1 { background: linear-gradient(45deg, #0a0a0a 10%, #70FFAF 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
deno-sandbox 用 Firecracker microVM 隔离，跑用户代码、AI 生成代码。关键纪律：永远用 await using 自动释放，最小权限 allow-none，pipe 输出，设超时，把输出当数据校验绝不当代码执行。
-->

---
transition: fade-out
---

# 审查 + 脚手架

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**deno-expert（审查）**

- 每次涉 Deno 代码都提 `fmt`/`lint`/`test`
- checklist：导入 / 配置 / Fresh / 质量
- 反模式：内联 specifier、整页当 island
- commit `deno.lock` 保 CI 可复现

</div>
<div v-click>

**deno-project-templates（脚手架）**

- **Fresh Web**（端口 5173）
- **CLI**：`@std/cli` + `deno compile`
- **库**：`mod.ts` + `deno publish`
- **API server**：`@std/http`（端口 8000）

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #0a0a0a 10%, #70FFAF 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
deno-expert 当审查器：每次涉 Deno 代码都提内建工具，按 checklist 审导入配置 Fresh 质量，建议 commit deno.lock。deno-project-templates 给四类脚手架：Fresh Web、CLI、库、API server。
-->

---
transition: fade-out
---

# 作用域：只在 Deno 语境激活

技能很克制，不见谁都推 Deno

<v-clicks>

- 问 **Node.js / Bun / Python / Go** → 直接用那门技术答，**不掺 Deno**
- 纯 TS/JS 通用问题 → 不预设 Deno
- 只在**明确问 Deno / 身处 Deno 项目**时应用
- Deploy / Sandbox 部分**绑 Deno Deploy 平台**
- 审查给**输入**，取舍靠**你**

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #0a0a0a 10%, #70FFAF 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
每个技能都有 Scope Boundaries：问其它 runtime 直接答不掺 Deno，纯 JS 问题不预设 Deno，只在明确问 Deno 或身处 Deno 项目才应用。Deploy 和 Sandbox 绑平台，审查给输入取舍靠人。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Deno 官方 6 技能：guidance（JSR/deno.json）、deploy（新 `deno deploy` 非 `deployctl`）、frontend（Fresh 2.x island）、expert（审查）、templates（脚手架）、sandbox（microVM 隔离）。**

<div class="mt-8 opacity-80">

官方权威 · 纠偏 LLM · JSR 优先 · Fresh 2.x · `deno deploy` · 全栈覆盖

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/denoland/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://docs.deno.com" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #0a0a0a 10%, #70FFAF 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Deno 官方 6 技能：guidance 打地基、deploy 新命令、frontend Fresh 2.x、expert 审查、templates 脚手架、sandbox 隔离。官方权威，纠正 LLM 过时习惯，全栈覆盖现代 Deno 开发。
-->
