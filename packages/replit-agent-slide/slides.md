---
theme: seriph
background: https://cover.sli.dev
title: Replit Agent
info: |
  Replit Agent —— 自然语言生成生产级全栈应用的云端 AI 构建平台。

  Learn more at [https://replit.com/](https://replit.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Replit Agent

自然语言 → 生产级全栈 app · 云端一体化 AI 构建平台

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 {
  background-color: #F26207;
  background-image: linear-gradient(45deg, #F26207 10%, #8A3408 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
大家好，今天聊 Replit Agent —— 一个用自然语言就能生成生产级全栈应用的云端 AI 平台。
它最关键的一点：Replit 已经从老牌在线 IDE / 编程教育平台，决定性地转型成了「描述需求就出应用」的 vibe coding 工具。
-->

---
transition: fade-out
---

# 什么是 Replit Agent？

云端 AI 应用生成平台 · 描述需求即可上线

<v-clicks>

- 用自然语言描述，Agent **生成 / 测试 / 修复 / 一键上线**生产级全栈 app
- 内建数据库 / 认证 / 托管 / 部署，"**no coding needed**"
- 受众含 **PM / 设计师 / 企业 / 非技术建造者**："show, not tell"

</v-clicks>

<br>

<div v-click>

```text
"Turn ideas into apps in minutes — no coding needed"
首个 prompt 免费，不扣 credit
```

</div>

<div v-click text-xs>

_Read more about_ [_Replit_](https://replit.com/)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #F26207 10%, #8A3408 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
Replit Agent 本质是一个云端的 AI 应用生成平台。

[click] 你用自然语言把需求说出来，Agent 就能生成、测试、修复，并一键把生产级全栈应用上线。
[click] 数据库、认证、托管、部署全都内建，官方口号就是 no coding needed。
[click] 它的受众明确包含产品经理、设计师、企业和非技术建造者，PM 的原话是「与其写需求等 Figma，不如直接 show, not tell」。
[click] 首页主标语是「几分钟把想法变成应用」，而且第一个 prompt 免费、不扣 credit。
-->

---
transition: fade-out
---

# Agent 4：人在回路 + 并行多 agent

2026-03 发布，把创意控制权还给人

<v-clicks>

- 理念转向：Agent 3 主打**自主**，Agent 4 转向**创意控制 / 人在回路**
- **并行任务**：多 agent 同时干 + **kanban 任务板**，自动排序与冲突合并
- 每个任务跑在**隔离副本**，apply 时才并入主版本；并行**仅 Pro / Ent**

</v-clicks>

<br>

<div v-click>

```text
Drafts(已规划) → Active(隔离副本构建) → Ready(待批准) → Done
"ship production-ready software 10x faster"
```

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #F26207 10%, #8A3408 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
当前版本是 Agent 4，2026 年 3 月发布。

[click] 它最大的理念转变是：上一代 Agent 3 主打自主性，而 Agent 4 转向创意控制、人在回路，把人放在流程中心，由你指挥设计决策、随产出 review。
[click] 旗舰能力是并行任务执行：多个 agent 同时工作，配 kanban 风格任务板，自动依赖排序、自动冲突合并。
[click] 每个任务都跑在你项目的隔离副本里，只有在你 apply 的时候才并入主版本，从多个任务 apply 时冲突也自动处理；不过并行能力只对 Pro 和企业版开放。
[click] 任务板有四个阶段：草稿、活动、就绪、完成。官方定位语是「让你交付生产级软件快 10 倍」。
-->

---
transition: fade-out
---

# 执行环境：服务端 Docker + Nix

关键区分点：不是浏览器内 WASM

<v-clicks>

- 每个 repl 由**服务端 Docker 容器**支撑，代码 / shell 全在云端容器内跑
- **Nix** 管理依赖：`replit.nix` 声明，可用 **80,000+ Linux 包**
- 跑真实运行时、**50+ 语言**，能做 DB 迁移 / 常驻进程 / 监控生产

</v-clicks>

<br>

<div v-click>

| 维度 | Replit | bolt.new (StackBlitz) |
| --- | --- | --- |
| 执行位置 | **云端服务端容器** | 浏览器内 WebContainers |
| 后端语言 | 真实多语言 50+ | 仅 Node.js / Express |

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #F26207 10%, #8A3408 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这一页是 Replit 最重要的区分点：它的执行环境。

[click] 每个 repl 背后是服务端的 Docker 容器，你的代码、shell 命令全部在云端容器里运行，是真正的服务端执行环境。
[click] 包和环境由 Nix 管理，用 replit.nix 声明系统依赖，可以用八万多个 Linux 包。
[click] 因为是真实运行时，它支持 50 多种语言，能写并执行数据库迁移、跑常驻后台进程、监控生产应用，后端是这一批工具里最深的。
[click] 这张表对比了和 bolt.new 的根本差异：bolt 用浏览器内的 WebContainers 跑 Node，反馈最快但后端只有 Node 和 Express；Replit 在自有云服务端跑真实多语言运行时。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 计费：按 checkpoint / effort，非 token

最易踩坑的一环，务必先搞清楚

::left::

<div v-click>

### 计费模型

- **Effort-Based**：按请求复杂度，简单更便宜
- 计费单位是 **checkpoint**（非 token）
- 一个 checkpoint = 一次请求完成的工作

</div>

::right::

<div v-click>

### 关键陷阱

- **所有交互都扣费**，含 **Plan Mode** 只规划不改码
- 成本梯度 **Lite < Economy < Power < Turbo**
- Turbo 最多 Power 6×（仅 Pro / Ent）

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #F26207 10%, #8A3408 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这一页讲计费，是 Replit 最容易踩坑的地方，一定要先搞清楚。

[click] 左边是计费模型：它用的是 effort-based 定价，按请求的复杂度计费，简单请求更便宜。计费单位是 checkpoint，不是 token，一个 checkpoint 就是一次请求完成的工作。
[click] 右边是关键陷阱：所有 Agent 交互都计费，连 Plan Mode 只规划、不改一行代码也照样扣费。成本有梯度，从 Lite、Economy、Power 到 Turbo 越来越贵，Turbo 最多能到 Power 的 6 倍，而且只对 Pro 和企业版开放。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 一体化（一）：数据库 + 认证

零配置接入，Agent 一句话搞定

::left::

<div v-click>

### 数据库（内建 SQL）

- 全托管 SQL，**PostgreSQL 兼容**，`DATABASE_URL` 连接
- **2025-12-04 后** Replit 自托管，之前用 Neon
- Agent 一句话加库、建 schema、配 ORM；每 App **20GB** 免费

</div>

::right::

<div v-click>

### 认证（Replit Auth）

- **"Zero setup"**——Agent 里一个 prompt 接入
- 登录：Google / GitHub / X / Apple / Email
- 备选 **Clerk**：独立品牌、账号脱离 Replit

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #F26207 10%, #8A3408 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
接下来两页讲 Replit 的一体化能力，先看数据库和认证。

[click] 数据库是内建的全托管 SQL，PostgreSQL 兼容，用 DATABASE_URL 就能连。这里有个时间点：2025 年 12 月 4 号之后创建的库托管在 Replit 自有基础设施上，之前用的是第三方 Neon。你只要让 Agent 加个数据库，它会自动建集成、建 schema、配好防注入的 ORM，每个 App 还含 20GB 免费存储。
[click] 认证用 Replit Auth，号称零配置，在 Agent 里写一句 prompt 就能接入，支持 Google、GitHub、X、Apple、邮箱登录。如果你需要独立品牌、账号脱离 Replit，可以选备选的 Clerk。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 一体化（二）：部署 + 移动端

四种部署类型，一键上线

::left::

<div v-click>

### 部署（Deployments）

- **Autoscale**：闲时缩到 0；可变负载 Web / API
- **Reserved VM**：专用 VM，常驻 bot / 持久 API
- **Static** 静态站 / **Scheduled** 定时任务

</div>

::right::

<div v-click>

### 上线 + 移动端

- 一键发布 + 内建 **Monitoring** + 自定义域名
- **100+ 集成**：OpenAI / Stripe / Google 等
- Agent 直接产出**移动 app**，与 web 共享后端

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #F26207 10%, #8A3408 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
第二页一体化，讲部署和移动端。

[click] 部署有四种类型：Autoscale 会在忙时自动加机器、闲时缩到零省钱，适合负载可变的 Web 和 API；Reserved VM 是专用虚拟机，成本性能可预测、不中断，适合常驻 bot、持久 API；另外还有静态站点 Static 和定时任务 Scheduled。
[click] 上线这块支持一键发布、内建监控、自定义域名，还有一百多个集成，比如 OpenAI、Stripe、Google Workspace。移动端方面，Agent 可以直接产出移动 app，和 web app、幻灯片在同一个项目里、共享同一个后端。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 套餐（以官方 pricing 为准）

金额功能向、随时调整

::left::

<div v-click>

### 免费 / 入门

- **Starter（免费）**：每日 Agent credits，**发布 1 个项目**
- **Core $25/月**：$25 credits，**最多 2 agent 并行**

</div>

::right::

<div v-click>

### 进阶 / 企业

- **Pro $100/月**：最强模型，**10 agent 并行**，**DB 回滚 28 天**
- **Enterprise**：定制 + **SSO / SAML** + 单租户 + 数仓连接

</div>

<div v-click text-xs mt-4>

⚠️ Agent 是 LLM 驱动、概率性，**生产前需人工 review / 测试**；金额以官方 [pricing](https://replit.com/pricing) 为准

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #F26207 10%, #8A3408 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这一页是套餐，注意金额是功能向、随时会调整，一切以官方 pricing 页为准。

[click] 免费和入门档：Starter 免费版有每日 Agent credits，可以发布 1 个项目；Core 是每月 25 美元，含 25 美元 credits，最多 2 个 agent 并行。
[click] 进阶和企业档：Pro 每月 100 美元，给最强模型、10 个 agent 并行，数据库还能回滚 28 天；Enterprise 是定制，额外有 SSO、SAML、单租户、数据仓库连接。
[click] 最后提醒一句：Agent 是大模型驱动、本质是概率性的，官方明示可能偶尔出错，生产前一定要人工 review 和测试。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 横向对比：vs bolt / v0 / Lovable

四款 AI app builder 怎么选

::left::

<div v-click>

### Replit vs bolt.new

- **Replit**：服务端容器、最深后端、50+ 语言、老牌生态
- **bolt.new**：浏览器内 WebContainers，极速但仅 Node

</div>

::right::

<div v-click>

### v0 vs Lovable

- **v0（Vercel）**：前端 / UI 顶尖，shadcn + Tailwind
- **Lovable**：chat-first，对非技术最友好，自动配 Supabase

</div>

<div v-click text-sm mt-4>

一句话：**Replit = 完整云端开发 + 部署一体机**；bolt = 浏览器极速 Node；v0 = 顶尖前端；Lovable = 可视化最友好

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #F26207 10%, #8A3408 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
最后做个横向对比，看四款 AI 应用生成器怎么选。

[click] 先看 Replit 和 bolt.new：Replit 强在自带完整云开发加部署环境，跑真实服务端运行时、50 多种语言，后端最深，还有老牌生态；bolt.new 是浏览器内的 WebContainers，反馈最快，但后端只能是 Node。
[click] 再看 v0 和 Lovable：v0 是 Vercel 系，前端和 UI 业界顶尖，生成 shadcn 加 Tailwind 组件；Lovable 是 chat-first，对非技术新手最友好，自动配好 Supabase 后端。
[click] 一句话区分：Replit 是完整的云端开发加部署一体机；bolt 是浏览器内极速 Node；v0 是顶尖前端；Lovable 是可视化、对非技术最友好。
-->

---
layout: intro
transition: fade-out
---

# 结尾

云端一体机，让"描述即上线"成为现实

- 服务端 Docker + Nix：真实多语言运行时，后端最深
- Agent 4：人在回路 + 并行多 agent，apply 时自动合并
- 一体化：DB / Auth / 部署内建；按 checkpoint 计费、非 token

<div class="abs-br m-6 text-xl">
  <a href="https://replit.com/" target="_blank" class="slidev-icon-btn">
    <carbon:launch />
  </a>
  <a href="https://docs.replit.com/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
  <a href="https://illegalcreed.github.io/zh/large-language-model/tools/app-builder/replit-agent/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #F26207 10%, #8A3408 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这就是 Replit Agent 的全景。

它是一台云端一体机：服务端 Docker 加 Nix 提供真实多语言运行时，后端最深；Agent 4 把创意控制还给人，支持并行多 agent、apply 时自动合并;数据库、认证、部署都内建，计费按 checkpoint 而不是 token。

官网、文档和笔记链接都在右下角，去探索吧！
-->

---
layout: end
---
