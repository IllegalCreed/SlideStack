---
theme: seriph
background: https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80
title: Stripe Skills
info: |
  ## Stripe Skills
  Stripe 官方 agent 技能——5 skills 覆盖 Connect/best-practices/directory/projects/upgrade。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Stripe Skills

Stripe 官方 agent 技能

<div class="pt-8 text-xl opacity-80">
5 skills · 官方插件自动更新 · 配套 MCP + AI SDK
</div>

<div class="abs-br m-6 text-sm opacity-60">
stripe/ai（原 agent-toolkit）· MIT
</div>

---
layout: two-cols
layoutClass: gap-8
---

# 它是什么

<v-clicks>

- **Stripe 官方**：源在 `stripe/ai`（原 `stripe/agent-toolkit` 改名）
- 让 AI 用 Stripe **最新最佳实践**做支付集成
- 属「在 Stripe 上建 AI 产品的一站式仓库」
- **5 skills** + 远程 MCP + `@stripe/ai-sdk` + `token-meter`
- 多 provider：Claude / Codex / Cursor / Grok

</v-clicks>

::right::

<div v-click="1" class="mt-16 p-6 rounded-xl bg-gradient-to-br from-indigo-500/15 to-violet-500/10 border border-indigo-400/25">

**一句话**

> 装官方插件（自动更新），AI 就懂 Checkout/Connect/税/安全的官方套路。

</div>

<div v-click="2" class="mt-4 p-4 rounded-lg bg-gray-500/10 text-sm">

```bash
claude plugin install \
  stripe@claude-plugins-official
```

</div>

---
layout: default
---

# 5 个 skills

<div class="grid grid-cols-2 gap-4 mt-6">

<div v-click="1" class="p-4 rounded-xl bg-indigo-500/10 border border-indigo-400/25">

**connect-recommend**

从公司 URL/描述**荐 Connect 集成形态**（marketplace/分账/打款/KYC）

</div>

<div v-click="2" class="p-4 rounded-xl bg-blue-500/10 border border-blue-400/25">

**stripe-best-practices**

API 选型 / Connect / billing / 税 / Treasury / 安全 / 迁移

</div>

<div v-click="3" class="p-4 rounded-xl bg-green-500/10 border border-green-400/25">

**stripe-directory**

找（并可**程序化购买**）某能力的服务商

</div>

<div v-click="4" class="p-4 rounded-xl bg-orange-500/10 border border-orange-400/25">

**stripe-projects**

用 Stripe Projects 供给基础设施（DB/auth/LLM…）

</div>

<div v-click="5" class="col-span-2 p-4 rounded-xl bg-pink-500/10 border border-pink-400/25 text-center">

**upgrade-stripe** —— 升级 Stripe API 版本 + SDK

</div>

</div>

---
layout: default
---

# connect-recommend：交互式决策

<div class="grid grid-cols-2 gap-6 mt-4">

<div v-click="1">

**设计原则（很有代表性）**

- **AskUserQuestion 为主**：每个决策点清晰编号选项，一次一个问题
- **低成本动作自动执行**：生成方案/扫代码/读 reference **不问许可**
- **绝不被动收尾**：每个停顿点给具体下一步

</div>

<div v-click="2" class="p-5 rounded-lg bg-indigo-500/10 self-center">

**从 URL 到方案**

用户只给公司 URL / 业务描述<br/>→ skill 搞定其余

references：<br/>account-types · charge-patterns<br/>compatibility-matrix · **decision-matrix**

</div>

</div>

<div v-click="3" class="mt-6 p-3 rounded-lg bg-gray-500/10 text-center text-sm">

触发：marketplace / 平台 / 分账 / 给卖家打款 / 商户 KYC / 嵌入式支付

</div>

---
layout: default
---

# stripe-best-practices 覆盖面

<div v-click="1" class="mt-4">

| 领域 | 决策点 |
| --- | --- |
| **API 选型** | Checkout Sessions vs PaymentIntents |
| **Connect** | 平台搭建（Accounts v2、controller properties） |
| **billing** | 订阅、计费 |
| **税** | Stripe Tax、`automatic_tax`、product tax codes |
| **集成** | Checkout、Payment Element、Treasury |
| **安全** | API key 管理、restricted keys、webhooks、OAuth |
| **迁移** | 从弃用的 Stripe API 迁移 |

</div>

<div v-click="2" class="mt-4 text-center text-lg opacity-80">

写 / 改 / 审查任何 Stripe 集成时用

</div>

---
layout: two-cols
layoutClass: gap-6
---

# directory + projects

<v-clicks>

- **stripe-directory**
  - 找某行业/能力的商家/软件/服务商
  - 建简短 shortlist
  - 也可**程序化购买/消费**服务
  - `stripe directory *`

- **stripe-projects**
  - 用 Stripe Projects 供给基础设施
  - DB/auth/缓存/Postgres/Redis/hosting
  - vector DB/LLM provider/邮件/搜索…
  - `stripe *`，projects.dev

</v-clicks>

::right::

<div v-click="1" class="mt-14 p-5 rounded-xl bg-amber-500/10 border-l-4 border-amber-500">

💡 用户问「怎么拿某第三方服务的 API key」

→ stripe-projects 要求**先查 Projects catalog**，别叫用户手动注册

</div>

---
layout: default
---

# 配套：MCP + AI SDK

<div class="grid grid-cols-3 gap-4 mt-6">

<div v-click="1" class="p-5 rounded-xl bg-violet-500/10 border border-violet-400/25 text-center">

**远程 MCP**

`mcp.stripe.com`<br/>OAuth 安全接入<br/>可建自主 agent

</div>

<div v-click="2" class="p-5 rounded-xl bg-blue-500/10 border border-blue-400/25 text-center">

**@stripe/ai-sdk**

接 Vercel `ai`<br/>/ `@ai-sdk`<br/>计费基础设施

</div>

<div v-click="3" class="p-5 rounded-xl bg-green-500/10 border border-green-400/25 text-center">

**@stripe/token-meter**

接 OpenAI/Anthropic<br/>/Gemini 原生 SDK<br/>无框架依赖

</div>

</div>

<div v-click="4" class="mt-8 text-center text-lg opacity-80">

`stripe/ai` = 在 Stripe 上建 AI 产品的**一站式仓库**

</div>

---
layout: center
class: text-center
---

# 小结

<div class="grid grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto text-left">

<div v-click="1" class="p-5 rounded-xl bg-indigo-500/10">

**5 skills**

- connect-recommend（交互决策）
- stripe-best-practices（集成决策）
- directory / projects（服务/基建）
- upgrade-stripe（版本升级）

</div>

<div v-click="2" class="p-5 rounded-xl bg-blue-500/10">

**记住这些**

- 装官方插件 = 自动更新 + 额外工具
- 多 provider（Claude/Codex/Cursor/Grok）
- 配套 MCP + AI SDK + token-meter
- 安全：restricted keys / webhooks

</div>

</div>

<div v-click="3" class="mt-10 text-xl">

**Stripe 官方 · MIT · 随 Stripe API 演进不漂移**

</div>

<div v-click="3" class="mt-2 text-base opacity-70">

`claude plugin install stripe@claude-plugins-official`

</div>

<div v-click="4" class="abs-br m-6 text-sm opacity-60">
stripe/ai · docs.stripe.com/skills
</div>
