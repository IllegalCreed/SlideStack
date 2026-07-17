---
theme: seriph
background: https://cover.sli.dev
title: Cloudflare Skills
info: |
  Cloudflare 官方 Agent Skills 集：Workers、存储、AI、安全、Zero Trust。
  检索优先，上下文自动加载。cloudflare/skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Cloudflare Skills

Cloudflare 官方 Agent Skills 集——**检索优先** + 全平台构建指引

<div class="pt-6 opacity-80">
cloudflare/skills · Workers / 存储 / AI / 安全 / Zero Trust · Apache-2.0
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/cloudflare/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #F6821F 10%, #FBAD41 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Cloudflare Skills 是 Cloudflare 官方的 Agent Skills 集，教 AI agent 如何在 Cloudflare 上构建。最大特色是检索优先：模型对平台的记忆易过时，技能让它先查官方 docs。
-->

---
transition: fade-out
---

# 是什么：官方技能集 + 检索优先

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**定位**

- Cloudflare **官方**出品
- 教 agent 在 Cloudflare 上构建
- 十余个技能，上下文自动加载
- 跨 Claude Code / Cursor / Codex / Pi

</div>
<div v-click>

**检索优先（核心理念）**

- 「你的记忆可能过时」
- reference 是起点，**docs 才是真理**
- 限额 / 定价 / API 签名先查 docs
- 冲突时信 docs

</div>
</div>

<div v-click class="mt-5 text-center text-sm opacity-80">

Apache-2.0 · 约 ★2.2k · 遵循 Agent Skills 开放标准

</div>

<style>
h1 { background: linear-gradient(45deg, #F6821F 10%, #FBAD41 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
它是 Cloudflare 官方技能集，不是单个技能。核心理念检索优先——因为 Cloudflare 平台演进快，技能反复提醒 agent：你的记忆可能过时，reference 只是起点，docs 才是真理。
-->

---
transition: fade-out
---

# 安装：四种方式

<div v-click>

```text
# Claude Code 插件市场（含命令 + MCP server）
/plugin marketplace add cloudflare/skills
/plugin install cloudflare@cloudflare

# npx skills（任意 Agent Skills 兼容 agent）
npx skills add https://github.com/cloudflare/skills

# Cursor：Settings → Rules → Remote Rule (Github) 填 cloudflare/skills
```

</div>

<div v-click class="mt-3 text-center">

Claude Code 插件方式最全——连带 `/cloudflare:build-agent`、`/cloudflare:build-mcp` 命令和 5 个官方 MCP server。

</div>

<style>
h1 { background: linear-gradient(45deg, #F6821F 10%, #FBAD41 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
四种装法：Claude Code 插件市场最全，还带命令和 MCP server；npx skills 通用；Cursor 加 Remote Rule；也可 clone 拷进技能目录。
-->

---
transition: fade-out
---

# 技能地图

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**开发者平台**

- `cloudflare` 综合平台 + 决策树
- `workers-best-practices` 代码评审
- `agents-sdk` 有状态 AI agent
- `durable-objects` 有状态协调
- `sandbox-sdk` 安全代码执行
- `wrangler` 部署与管理

</div>
<div v-click>

**性能 / 安全 / 企业**

- `web-perf` Core Web Vitals 审计
- `cloudflare-email-service` 收发邮件
- `turnstile-spin` 接入 CAPTCHA
- `cloudflare-one` Zero Trust / SASE
- `cloudflare-one-migrations` 迁移

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

对话匹配触发词就自动加载对应技能，无需手动记名字。

</div>

<style>
h1 { background: linear-gradient(45deg, #F6821F 10%, #FBAD41 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
技能分两块：开发者平台（cloudflare 综合、workers 评审、agents-sdk、durable-objects、sandbox、wrangler）和性能安全企业（web-perf、email、turnstile、cloudflare-one 系列）。
-->

---
transition: fade-out
---

# cloudflare：决策树选产品

「我该用哪个 Cloudflare 产品？」

```text
需求 → 产品
├─ 跑代码   → Workers / Pages / Durable Objects / Workflows
├─ 存数据   → KV / D1 / R2 / Queues / Vectorize
├─ 要 AI    → Workers AI / Vectorize / Agents SDK / AI Gateway
├─ 要安全   → WAF / DDoS / Bot Management / Turnstile
└─ 要 IaC   → Terraform / Pulumi / REST API
```

<div v-click class="mt-3 text-center text-sm opacity-80">

先用决策树定位产品，再加载详细 reference——把「选型」这一难题结构化。

</div>

<style>
h1 { background: linear-gradient(45deg, #F6821F 10%, #FBAD41 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
cloudflare 是综合技能，用大量决策树帮你从需求定位到正确产品：跑代码、存数据、AI、安全、IaC 各有一棵树。选对产品后再加载详细 reference。
-->

---
transition: fade-out
---

# workers-best-practices：反模式清单

当 Workers 代码评审器用

| 反模式 | 后果 |
| --- | --- |
| 无界数据 `await response.text()` | 内存耗尽（128 MB 限制） |
| `Math.random()` 做 token/ID | 可预测、非密码学安全 |
| 裸 `fetch()` 不 await/waitUntil | 悬空 Promise，错误被吞 |
| 模块级变量存请求态 | 跨请求数据泄露 |
| 解构 `ctx` | 丢 `this`，抛 Illegal invocation |

<style>
h1 { background: linear-gradient(45deg, #F6821F 10%, #FBAD41 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
workers-best-practices 把生产反模式清单化：无界数据 text 耗内存、Math.random 做密钥不安全、裸 fetch 是悬空 Promise、模块级变量泄露请求态、解构 ctx 丢 this。可当代码评审器用。
-->

---
transition: fade-out
---

# agents-sdk：有状态 AI agent

`Agent` 类 + `@callable` RPC + `setState` 自动同步

```typescript
import { Agent, callable } from "agents";

export class Counter extends Agent<Env, { count: number }> {
  initialState = { count: 0 };

  @callable()
  increment() {
    this.setState({ count: this.state.count + 1 });
    return this.state.count;
  }
}
```

<div v-click class="mt-2 text-center text-sm opacity-80">

坑：别开 `experimentalDecorators`；每 agent 一个 DO 绑定 + migration；只加新 migration 不改旧的。

</div>

<style>
h1 { background: linear-gradient(45deg, #F6821F 10%, #FBAD41 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
agents-sdk 教你用 Agent 类建有状态 agent：SQLite 持久状态、setState 自动同步、@callable RPC、schedule 调度。聊天用 AIChatAgent，MCP 用 McpAgent。坑是别开 experimentalDecorators。
-->

---
transition: fade-out
---

# durable-objects：有状态协调

聊天室 / 多人游戏 / 预订系统

<v-clicks>

- **一个协调原子一个 DO**——别用全局 DO 扛所有请求
- **`getByName()` 确定性路由**——同输入命中同实例
- **用 SQLite 存储**——migration 配 `new_sqlite_classes`
- **`blockConcurrencyWhile()` 只用于构造器初始化**——别每请求用
- **先持久化再更新内存**——崩溃/驱逐后内存态会丢
- **一 DO 一 alarm**——`setAlarm()` 替换已有

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #F6821F 10%, #FBAD41 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
durable-objects 用于需要协调和强一致的场景。关键规则：一个协调原子一个 DO、getByName 确定性路由、SQLite 存储、blockConcurrencyWhile 只用于初始化、先持久化再更新内存、一 DO 一 alarm。
-->

---
transition: fade-out
---

# sandbox-sdk：安全代码执行

给 AI 一个隔离沙箱跑代码

```typescript
export { Sandbox } from "@cloudflare/sandbox";  // 必须导出

const sandbox = getSandbox(env.Sandbox, "user-123");
const r = await sandbox.exec("python --version");
// r: { stdout, stderr, exitCode, success }
```

<div v-click class="mt-3">

- `exec()` 跑 shell 命令；`runCode()` 跑 LLM 生成代码（富输出 + 状态持久）
- 容器懒启动、10 分钟无活动休眠、`destroy()` 立即释放
- **漏掉 `export { Sandbox }` 就部署不了**

</div>

<style>
h1 { background: linear-gradient(45deg, #F6821F 10%, #FBAD41 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
sandbox-sdk 让 AI 安全执行代码：getSandbox 拿沙箱，exec 跑命令，runCode 跑 LLM 生成代码。必须 export Sandbox 否则部署失败。容器懒启动、会休眠。
-->

---
transition: fade-out
---

# web-perf：Core Web Vitals 审计

用 Chrome DevTools MCP 测真实指标

| 指标 | good 阈值 | 看什么 |
| --- | --- | --- |
| LCP | < 2.5s | 最大内容绘制，TTFB/加载/渲染拆解 |
| INP | < 200ms | 交互响应 |
| CLS | < 0.1 | 布局偏移元凶 |
| TBT | < 200ms | 总阻塞时间 |
| FCP | < 1.8s | 首次内容绘制 |

<div v-click class="mt-2 text-center text-sm opacity-80">

量化影响（「hero.png 450KB 转 WebP」），先验证再建议。

</div>

<style>
h1 { background: linear-gradient(45deg, #F6821F 10%, #FBAD41 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
web-perf 用 Chrome DevTools MCP 测 Core Web Vitals：LCP、INP、CLS、TBT、FCP 各有 good 阈值。要求量化影响、先验证某资源确实未用再建议删，别只说优化图片。
-->

---
transition: fade-out
---

# cloudflare-one：Zero Trust / SASE

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**覆盖**

- Access（应用授权）
- Gateway（流量检查/过滤）
- WARP / Tunnel / Magic WAN
- DLP / CASB / 设备 posture / 身份

</div>
<div v-click>

**护栏**

- Access 管授权，Gateway 管流量
- Access 策略**默认拒绝**
- 分屏隧道模式影响最大
- 评估先行，别直接配

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

`cloudflare-one-migrations` 专做从 Zscaler / Palo Alto / VPN·SWG / SASE 的迁移评估。

</div>

<style>
h1 { background: linear-gradient(45deg, #F6821F 10%, #FBAD41 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
cloudflare-one 面向企业 Zero Trust 和 SASE，覆盖 Access、Gateway、WARP、Tunnel、DLP、CASB。护栏：Access 管授权 Gateway 管流量、默认拒绝、分屏隧道模式最关键、评估先行。migrations 专做迁移。
-->

---
transition: fade-out
---

# turnstile-spin：端到端接 CAPTCHA

「gate，不替换」——服务端验证

```text
浏览器（嵌 widget）
   ↓ 提交 cf-turnstile-response
你的后端  ── 调用 ──▶  siteverify
   ↓ success === true 才放行
既有提交逻辑（不改）
```

<div v-click class="mt-3 text-center">

铁律：**绝不在浏览器调 siteverify**；密钥只进 env/secret store，绝不硬编码。

</div>

<style>
h1 { background: linear-gradient(45deg, #F6821F 10%, #FBAD41 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
turnstile-spin 把加 Turnstile 变成端到端流程：扫代码、建 widget、嵌表单、在既有后端接服务端 siteverify。铁律：绝不在浏览器验，密钥不硬编码，只 gate 不替换既有逻辑。
-->

---
transition: fade-out
---

# 平台覆盖面

一套技能横跨整个 Cloudflare 平台

<div class="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-sm">
<div v-click>

- **计算**：Workers · Pages · Durable Objects · Workflows
- **存储**：KV · D1 · R2 · Queues · Vectorize
- **AI**：Workers AI · Vectorize · Agents SDK · AI Gateway

</div>
<div v-click>

- **安全**：WAF · DDoS · Bot · API Shield · Turnstile
- **网络**：Tunnel · Spectrum · Magic WAN
- **IaC**：Terraform · Pulumi · REST API

</div>
</div>

<div v-click class="mt-5">

**随插件附带**：命令 `/cloudflare:build-agent`、`/cloudflare:build-mcp` + MCP server（api / docs / bindings / builds / observability）

</div>

<style>
h1 { background: linear-gradient(45deg, #F6821F 10%, #FBAD41 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
平台覆盖面：计算、存储、AI、安全、网络、IaC 六层全覆盖。装 Claude Code 插件还附带两个命令和五个官方 MCP server。
-->

---
transition: fade-out
---

# 边界与选型

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**边界**

- 官方技能集，**不是单个技能**
- 绑 Cloudflare 平台，非通用云技能
- 检索优先依赖 docs/MCP 可达
- 是「指令 + 检索指引」，非 SDK

</div>
<div v-click>

**怎么选**

- 建 agent / MCP → 命令 + `agents-sdk`
- 实时协调 → `durable-objects`
- 审 Workers 代码 → `workers-best-practices`
- 页面性能 → `web-perf`

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #F6821F 10%, #FBAD41 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
边界：是官方技能集不是单技能、绑 Cloudflare 平台、检索优先依赖 docs 可达、是指令不是 SDK。选型：建 agent 用命令加 agents-sdk、实时协调用 durable-objects、审代码用 workers-best-practices、性能用 web-perf。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Cloudflare 官方 Agent Skills 集：检索优先规避过时记忆，决策树选产品，覆盖 Workers/存储/AI/安全/Zero Trust，上下文自动加载 + 命令 + 官方 MCP server。**

<div class="mt-8 opacity-80">

官方全平台 · 检索优先 · 决策树导航 · 生产最佳实践 · 跨 agent

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/cloudflare/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://developers.cloudflare.com/agents/" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #F6821F 10%, #FBAD41 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Cloudflare 官方 Agent Skills 集：检索优先规避过时记忆、决策树选产品、覆盖全平台、上下文自动加载还带命令和官方 MCP server。官方沉淀，全平台构建指引。
-->
