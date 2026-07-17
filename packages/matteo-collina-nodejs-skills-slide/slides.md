---
theme: seriph
background: https://cover.sli.dev
title: Matteo Collina Node.js Skills
info: |
  Matteo Collina 个人的现代 Node.js agent 技能集：Fastify、内核、TS 类型、OAuth、ESLint9、Diátaxis。
  mcollina/skills（个人权威，非 org 官方）。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Matteo Collina Node.js Skills

**个人权威**的现代 Node.js agent 技能集

<div class="pt-6 opacity-80">
mcollina/skills · Fastify / 内核 / TS 类型 / OAuth / ESLint9 · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/mcollina/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #339933 10%, #6cc24a 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Matteo Collina Node.js Skills 是 Matteo 个人维护的现代 Node.js agent 技能集，个人权威、非 org 官方，但作者身份决定了含金量极高。
-->

---
transition: fade-out
---

# 定位：个人权威，非 org 官方

要点：如实理解它的性质

<div class="grid grid-cols-2 gap-6 mt-6">
<div v-click>

**是什么**

- Matteo **个人**的 Node.js 技能集
- 「my own collection of skills」
- **不是 nodejs org 官方**产物
- MIT，无官方 SLA，更新随作者

</div>
<div v-click>

**作者 = 业界权威**

- Node.js **TSC** 技术指导委员会成员
- **Fastify** 框架作者
- **Pino** 高性能日志库作者
- **Platformatic** 联合创始人兼 CTO

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">

「造框架、进内核、开公司的人」把一手经验封装成 agent 技能。

</div>

<style>
h1 { background: linear-gradient(45deg, #339933 10%, #6cc24a 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
定位一定要如实：个人权威、非 org 官方。但作者是 Node.js TSC 成员、Fastify 和 Pino 作者、Platformatic CTO，所以这套个人集含金量远超普通 side project。
-->

---
transition: fade-out
---

# 安装 + 11 个技能

一条命令，遵开放 Agent Skills 标准

```bash
npx skills add mcollina/skills   # 进 Claude Code / Copilot / Codex
```

<div class="grid grid-cols-3 gap-4 mt-5 text-sm">
<div v-click>

**Node.js 核心**

- `fastify` 插件架构
- `node` 现代 Node.js
- `nodejs-core` V8/libuv 内核

</div>
<div v-click>

**语言 / 安全**

- `typescript-magician` 类型体操
- `oauth` OAuth 2.0/2.1
- `linting-neostandard-eslint9`

</div>
<div v-click>

**工程 / 工具**

- `documentation` Diátaxis
- `init` AGENTS.md
- `octocat` · `skill-optimizer` · `snipgrapher`

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #339933 10%, #6cc24a 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
装一条 npx skills add mcollina/skills，遵开放 Agent Skills 标准，可进 Claude Code、Copilot、Codex。11 技能分三组：Node.js 核心、语言安全、工程工具。
-->

---
transition: fade-out
---

# fastify：封装是灵魂

每个插件是**隔离上下文**，decorator 对兄弟不可见

```ts
const app = Fastify()

app.register(async function child (fastify) {
  fastify.decorate('util', () => 'private')
  fastify.get('/child', async function () {
    return this.util()        // ✅ 本上下文可用
  })
})

app.get('/parent', async () => {
  // this.util === undefined —— 不同上下文 ❌
})
```

<style>
h1 { background: linear-gradient(45deg, #339933 10%, #6cc24a 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
fastify 由框架作者亲授，核心概念是封装：每个 register 的插件是独立上下文，内部 decorator 对兄弟节点不可见。这是 Fastify 架构的灵魂。
-->

---
transition: fade-out
---

# fastify-plugin：打破封装

要跨上下文共享，用 `fp` 包裹

```ts
import fp from 'fastify-plugin'

// fp 包裹后，db 对父级和兄弟都可见
export default fp(async function (fastify, opts) {
  const db = await connect(opts.url)
  fastify.decorate('db', db)
  fastify.addHook('onClose', () => db.close())
}, { name: 'db-plugin' })
```

<div v-click class="mt-4 text-center text-sm opacity-80">

其余原则：**Schema 优先**（校验 + 序列化提速）· `inject()` 测试 · Pino 日志。

</div>

<style>
h1 { background: linear-gradient(45deg, #339933 10%, #6cc24a 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
默认封装，需要共享 decorator/hook 给父级和兄弟时用 fastify-plugin（fp）包裹。其余核心原则：Schema 优先、inject 测试、Pino 日志。
-->

---
transition: fade-out
---

# node vs nodejs-core：分工

常被混淆，一个应用层一个引擎层

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**`node`（应用层）**

- type stripping（22.6+）免构建
- 流 `pipeline()` + 背压
- 缓存 `lru-cache` / `async-cache-dedupe`
- 优雅关闭、错误分类

</div>
<div v-click>

**`nodejs-core`（引擎层）**

- V8 GC / JIT / 隐藏类
- libuv 事件循环 / 线程池
- N-API / node-addon-api
- primordials · core 贡献规范

</div>
</div>

<div v-click class="mt-5 text-center text-sm opacity-80">

铁律：改 `src/`/`lib/` 后**必先 rebuild 再测**（`lib/` 编译期嵌入二进制）。

</div>

<style>
h1 { background: linear-gradient(45deg, #339933 10%, #6cc24a 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
node 是应用层现代 Node.js：type stripping、流、缓存、优雅关闭。nodejs-core 是引擎层：V8、libuv、N-API、primordials、core 贡献。铁律：改 src/lib 后必先 rebuild 再测。
-->

---
transition: fade-out
---

# nodejs-core：内核级 debug

面向 core 贡献者与原生插件开发者

```bash
# V8 优化/去优化追踪
node --trace-opt --trace-deopt app.js

# 事件循环延迟
node --trace-event-categories v8,node app.js

# 原生插件 gdb 调试（崩溃时 bt 看栈）
gdb --args node --napi-modules ./addon.node
```

<div v-click class="mt-3 text-center text-sm opacity-80">

诊断树：段错误 → gdb `bt`；性能回归 → `--trace-deopt` 找去优化函数。

</div>

<style>
h1 { background: linear-gradient(45deg, #339933 10%, #6cc24a 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
nodejs-core 带一套内核级 debug 命令：trace-opt/deopt 追 V8 优化、trace-event 看事件循环延迟、gdb 调原生插件。诊断树系统化：段错误走 gdb bt，性能回归走 trace-deopt。
-->

---
transition: fade-out
---

# 现代 Node.js：type stripping

Node 22.6+ 直接跑 `.ts`，免 ts-node/tsx/编译

```ts
// greet.ts
const greet = (name: string): string => `Hello, ${name}!`
console.log(greet('world'))
```

```bash
node greet.ts     # 运行时剥离类型注解，无构建步骤
```

<div v-click class="mt-4 text-sm opacity-80">

兼容要点：`import type` 导入类型 · `as const` 替 `enum` · 避免 namespace/参数属性 · 导入带 `.ts`。

</div>

<style>
h1 { background: linear-gradient(45deg, #339933 10%, #6cc24a 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
node 技能核心主张之一：Node 22.6+ 原生 type stripping，node greet.ts 直接跑，无需编译。兼容要点：import type、as const 替 enum、导入带 .ts。
-->

---
transition: fade-out
---

# typescript-magician：消除 any

流程：`tsc --noEmit` → 定位根因 → 类型安全替换 → 再验

<div class="grid grid-cols-2 gap-4 mt-4">
<div v-click>

**Before**

```ts
function get(
  obj: any,
  key: string
): any {
  return obj[key]
}
```

</div>
<div v-click>

**After**

```ts
function get<T, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key]
}
```

</div>
</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

`get({ name: 'Alice' }, 'name')` → 推断为 `string` ✓　覆盖条件类型 / `infer` / 映射 / 品牌类型

</div>

<style>
h1 { background: linear-gradient(45deg, #339933 10%, #6cc24a 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
typescript-magician 消除 any 有固定流程：先 tsc --noEmit 抓全量错误，定位根因，用泛型约束替换，再验证。用 keyof 约束把返回精确到 T[K]。
-->

---
transition: fade-out
---

# oauth：带 RFC 的严谨

授权码 + PKCE 为默认，绑 Fastify

| 要求 | RFC |
| --- | --- |
| 公共客户端一律 PKCE（S256） | RFC 7636 §4.2 |
| 校验 `state` 防 CSRF | RFC 6749 §10.12 |
| 每 JWT 校验 `iss`/`aud`/`exp` | RFC 7519 §4 |
| 刷新令牌每次轮换 | RFC 6749 §10.4 |

<div v-click class="mt-3 text-sm opacity-80">

反模式：localStorage 存 token ❌ · 隐式流 ❌（2.1 已废弃）· HS256 签第三方 token ❌

</div>

<style>
h1 { background: linear-gradient(45deg, #339933 10%, #6cc24a 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
oauth 技能每条要求都标 RFC 引用：PKCE、state 防 CSRF、JWT 校验 iss/aud/exp、刷新令牌轮换。反模式：localStorage 存 token、隐式流、HS256 签第三方 token。
-->

---
transition: fade-out
---

# ESLint9 + neostandard

`neostandard` = Standard 风格的 ESLint v9 flat-config 基线

```js
// eslint.config.js
import neostandard from 'neostandard'
export default neostandard()
```

<v-clicks>

- pin 主版本保证可复现，config 极简显式
- **CI 跑非 `--fix`（当质量门禁），本地才开 `--fix`**
- 覆盖从 `standard` 迁移、从 `.eslintrc*` 迁移到 flat config

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #339933 10%, #6cc24a 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
linting 技能：neostandard 一行起 flat config。原则：pin 主版本、config 极简、CI 跑非 fix 当门禁、本地才 fix。覆盖从 standard 和旧 eslintrc 迁移。
-->

---
transition: fade-out
---

# documentation：Diátaxis 四类

每篇只做一种类型，互不混淆

| 类型 | 导向 | 用户信号 |
| --- | --- | --- |
| **教程** | 学习 | 「带我走一遍」 |
| **指南** | 问题 | 「怎么做到 X」 |
| **参考** | 信息 | 「X 的参数/语法」 |
| **解释** | 理解 | 「X 为什么这样设计」 |

<div v-click class="mt-3 text-center text-sm opacity-80">

铁律：别把教程步骤、参考表格、概念展开混在一页；类型间交叉链接。

</div>

<style>
h1 { background: linear-gradient(45deg, #339933 10%, #6cc24a 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
documentation 技能按 Diátaxis 把文档分四类：教程学习、指南问题、参考信息、解释理解。铁律：每篇只做一种类型，别混写，类型间交叉链接。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Matteo Collina 个人的现代 Node.js 技能集（个人权威，非 org 官方）：Fastify 封装、node/nodejs-core 分应用层与引擎层、typescript-magician 消 any、oauth 带 RFC、ESLint9+neostandard、Diátaxis 四类。**

<div class="mt-8 opacity-80">

作者 = TSC 成员 + Fastify/Pino 作者 + Platformatic CTO · `npx skills add mcollina/skills`

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/mcollina/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #339933 10%, #6cc24a 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。个人权威、非 org 官方，但作者是 TSC 成员、Fastify/Pino 作者、Platformatic CTO。11 技能覆盖 Fastify、内核、TS 类型、OAuth、ESLint9、Diátaxis。
-->
