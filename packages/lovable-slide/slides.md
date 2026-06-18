---
theme: seriph
background: https://cover.sli.dev
title: Lovable
info: |
  Lovable —— 用自然语言对话生成真实代码的全栈 AI 应用平台（vibe coding）。

  Learn more at [https://lovable.dev/](https://lovable.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Lovable

用对话生成全栈应用 · vibe coding 标杆

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
  background-color: #FF6B9D;
  background-image: linear-gradient(45deg, #FF6B9D 10%, #C13584 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
大家好，今天聊 Lovable —— 估值 66 亿美元的 vibe coding 标杆。
你用自然语言跟它聊，甚至直接丢一张截图，它就能生成、迭代、部署一个真实代码的全栈 Web 应用。
主打一句话：非技术用户也能造软件，同时代码所有权还在你手里。
-->

---
transition: fade-out
---

# 什么是 Lovable？

「vibe coding」赛道的 AI 全栈应用生成器

<v-clicks>

- **自然语言对话**生成真实代码，也可上传**截图 / 设计稿 / 文档**
- 一条龙：生成 → 迭代 → 部署，主打**非技术用户也能造软件**
- 官方定位：全栈 AI 开发平台，含**真实代码、安全与企业级治理**

</v-clicks>

<br>

<div v-click text-sm>

> 首页副标：_"Create apps and websites by chatting with AI"_

</div>

<div v-click text-xs>

_Read more about_ [_welcome_](https://docs.lovable.dev/introduction/welcome)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #FF6B9D 10%, #C13584 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
Lovable 属于 vibe coding，也就是「氛围编程」这个赛道。

[click] 你用自然语言描述需求，它生成真实代码；不想打字，还能直接上传截图、Figma 设计稿或文档让它照着做。
[click] 从生成、迭代到部署一条龙，核心卖点是让不会写代码的人也能做出软件。
[click] 官方把自己定位成全栈 AI 开发平台，强调三点：真实代码、安全、企业级治理——这是它区别于玩具的地方。
[click] 引用官方首页原话：用聊天的方式创建 app 和网站。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 默认技术栈

生成的就是一套标准现代全栈项目

::left::

<div v-click>

### 前端（官方核心点名 React / Tailwind）

- **React + Vite + TypeScript**
- **Tailwind CSS** + **shadcn/ui** 组件

</div>

::right::

<div v-click>

### 后端

- **Supabase**（或 Lovable Cloud 封装）
- 自动供给数据库 / 认证 / 存储

</div>

<div v-click class="col-span-2" text-sm>

记忆法：**前端 React 系，后端 Supabase 系**——区别于 v0（仅前端组件）与 Bolt（Node + 自家 DB）

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #FF6B9D 10%, #C13584 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
Lovable 生成的不是黑盒，而是一套标准的现代全栈项目。

[click] 前端默认是 React 加 Vite 加 TypeScript，样式用 Tailwind CSS，组件库是 shadcn/ui。官方文档明确点名的核心技术是 React 和 Tailwind；Vite、TS、shadcn 是生成产物和业界一致公认的默认栈。
[click] 后端默认是 Supabase，或者用它封装后的 Lovable Cloud，数据库、认证、存储都自动供给。
[click] 一句话记忆：前端 React 系，后端 Supabase 系。这正好区别于只生成前端组件的 v0，和用 Node 加自家数据库的 Bolt。
-->

---
transition: fade-out
---

# 可视化编辑的边界（易错点）

「可视化编辑全免费」是误解，只有行内改字免费

<v-clicks>

- **Edit Text Inline 行内改字**：点进文字原地改 —— **免费**，每人每天上限 **100 次**
- **Select Elements 点选元素**：选元素后用自然语言改 —— **消耗 credit**
- **Draw Annotation 涂画标注**：在预览上手绘示意 —— **消耗 credit**

</v-clicks>

<br>

<div v-click text-sm>

新版 **Preview Toolbar** 已取代旧的独立 Visual edits 面板，用上下文模式整合三种交互

</div>

<div v-click text-xs>

_Read more about_ [_preview toolbar_](https://docs.lovable.dev/features/preview-toolbar)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #FF6B9D 10%, #C13584 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这一页是高频踩坑点：别把「可视化编辑全免费」当事实。

[click] 真正免费的只有「行内改文字」：点进页面任意文字直接原地改，每人每天上限 100 次，超了也要算。
[click] 「点选元素」是选中一个或多个元素再用自然语言描述改动，这个按普通 chat 计 credit。
[click] 「涂画标注」是在预览上手绘示意，同样消耗 credit。
[click] 这三种交互现在都收进了新版 Preview Toolbar，它用上下文模式取代了旧的独立 Visual edits 面板。所以教学时一定要点明边界：免费只覆盖行内文字，且每天 100 次封顶。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# Lovable Cloud + Lovable AI

2025-09-29 发布 · 后端与 AI 开箱即用

::left::

<div v-click>

### Lovable Cloud = 内置全栈后端

- 五件套：**数据库 / 认证 / 存储 / Edge Functions / AI**
- 底层 **Supabase** 基座，**默认开启**、免单独配置

</div>

::right::

<div v-click>

### Lovable AI = 内置 AI 能力

- **免自带 API key**，默认 **Google Gemini**
- 调用**强制走 server-side edge function**，凭据不进浏览器

</div>

<div v-click class="col-span-2" text-sm>

新项目可二选一：**Lovable Cloud** 或直连 **Supabase**；已有 Supabase 项目保持不变

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #FF6B9D 10%, #C13584 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
2025 年 9 月底，Lovable 发了两个重磅：Lovable Cloud 和 Lovable AI。

[click] Lovable Cloud 是内置的全栈后端，五件套：数据库、认证、存储、Edge Functions，还有 AI。它底层用的就是 Supabase 开源基座，默认对工作区开启，开箱即用，不用你单独去 Supabase 配一遍。
[click] Lovable AI 是内置的 AI 能力，最大好处是免自带 API key，默认走 Google Gemini。关键安全点：AI 调用强制走它自动创建的服务端 edge function，绝不在浏览器直接调，凭据和 prompt 都留在服务端。
[click] 新项目可以二选一，用 Lovable Cloud 或者直连 Supabase；已经接了 Supabase 的老项目保持不变。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 计费：message 制

按条扣 credit · 复杂度决定单价

::left::

<div v-click>

### 每条 build 消息 0.5 ~ 2 credit

- 改个按钮颜色 ≈ **0.5**
- 加认证 ≈ 1.2 / 带图落地页 ≈ **2.0**
- **Plan mode 固定 1 credit/条**

</div>

::right::

<div v-click>

### 计划四档（功能向，金额以官方为准）

- **Free** $0 ｜ **Pro** ~$25/月
- **Business** ~$50/月（原 Teams，含 SSO）
- **Enterprise** 定制（SCIM / 审计日志）

</div>

<div v-click class="col-span-2" text-sm>

credit 也用于 **Cloud 托管**与 **app 内 AI 供能**；月付发放后约 2 个月过期

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #FF6B9D 10%, #C13584 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
计费是 message 制，按条扣 credit。

[click] 每条 build 消息按复杂度扣，区间大概 0.5 到 2 个 credit：改个按钮颜色大约 0.5，加认证 1.2 左右，做一个带图片的落地页大约 2。另外 Plan mode 固定每条 1 credit。
[click] 计划分四档：免费版 0 元，Pro 大约每月 25 美元，第三档现在叫 Business，大约每月 50 美元，含 SSO——注意它原来叫 Teams，是旧称；最高是 Enterprise 定制报价，带 SCIM、审计日志这些。这里功能向，具体金额一切以官方页面实时为准。
[click] 还要知道 credit 不只用于发消息，Cloud 托管和给 app 内 AI 功能供能也都扣 credit；月付方案发放后大约两个月过期，免费档每月才 30 个，很快见底。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 集成生态澄清

官方连接器 vs 常被误认的「内置」

::left::

<div v-click>

### 官方连接器（确有）

- **Supabase** · **Stripe** · **Resend**
- **GitHub** · **GitLab**
- 60+ App Connectors，admin 配一次控权限

</div>

::right::

<div v-click>

### 非官方内置连接器（易错）

- **Clerk** ⚠️ 无官方专页，认证默认走 Cloud / Supabase Auth
- **Figma** ⚠️ 是「导入设计 / 资产」，非连接器

</div>

<div v-click class="col-span-2" text-sm>

自定义 API：密钥作为 **secret** 存 Cloud 项目，**只经 Edge Functions** 访问

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #FF6B9D 10%, #C13584 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
集成生态这一页主要是澄清，别被「内置」二字带偏。

[click] 真正的官方连接器包括：后端的 Supabase、支付的 Stripe、邮件的 Resend，版本控制的 GitHub 和 GitLab，总共 60 多个 App Connectors，管理员配一次、统一控权限。
[click] 容易搞错的是 Clerk 和 Figma。Clerk 在官方文档里没有专页，Lovable 自带认证走的是 Lovable Cloud 或者 Supabase Auth，所以 Clerk 只能算可选第三方认证，别说成官方内置连接器。Figma 是「导入设计和资产」的工作流，也不是一个连接器。
[click] 还有自定义 API：任意外部 API 的密钥都作为 secret 存在 Cloud 项目里，只经 Edge Functions 访问，绝不进前端。
-->

---
transition: fade-out
---

# 安全：两个必讲的坑

vibe coding 工具早期高发问题，Lovable 做成默认门禁

<v-clicks>

- **前端硬编码密钥 = 已泄露**：`const API_KEY = "sk-..."` 用户可见，须走 **Edge Function**
- **敏感表必开 RLS**：行级安全是最后防线，**发布前**所有敏感表都要开
- 平台兜底：**发布前自动安全扫描** + Security Center + 第三方扫描集成

</v-clicks>

<br>

<div v-click text-sm>

定位：**工具帮你兜底，但开发者仍须核对 RLS 与密钥位置**

</div>

<div v-click text-xs>

_Read more about_ [_security best practices_](https://docs.lovable.dev/tips-tricks/security-best-practices)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #FF6B9D 10%, #C13584 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
安全是 vibe coding 必讲的两个坑，官方都做进了默认门禁。

[click] 第一，前端硬编码密钥等于已经泄露。像 const API_KEY 等于 sk 开头这种，写在前端代码里用户全看得见，应当视为已泄露；正确做法是密钥存后端，只经 Edge Function 访问。
[click] 第二，敏感表必须开 RLS，也就是行级安全。它是即使前后端逻辑失效也能拦住的最后一道防线，要求发布前所有敏感表都开，且有真实数据之前改更省事。
[click] 平台侧也兜底：发布前自动做安全扫描，还有 Security Center 和第三方扫描集成。
[click] 但定位要讲清楚：工具帮你兜底，开发者自己仍然必须核对 RLS 和密钥位置。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# GitHub 双向同步

代码所有权 · 可脱离 Lovable 独立开发

::left::

<div v-click>

### 真双向同步

- Lovable 改动 → 出现在 GitHub
- 推到 active 分支 → 同步回 Lovable
- 两层：Workspace 连接 + Project↔Repo 一对一

</div>

::right::

<div v-click>

### 价值

- **代码所有权**，克隆到本地用自己 IDE
- 走 **PR / 分支 / code review**
- 可脱离 Lovable 独立部署（同样支持 **GitLab**）

</div>

<div v-click class="col-span-2" text-sm>

默认发布域名 `xxx.lovable.app`（目前无法移除）；**自定义域名仅付费档**

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #FF6B9D 10%, #C13584 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
GitHub 双向同步是 Lovable 的强差异化卖点。

[click] 它是真双向：你在 Lovable 里的改动会出现在 GitHub，反过来你往 active 分支推代码，也会同步回 Lovable。结构上分两层：先是 Workspace 级别装上 Lovable 的 GitHub App 授权，再是每个 Project 和一个 Repo 一对一绑定。
[click] 价值在于代码所有权：你可以克隆到本地用自己的 IDE 改，走标准的 PR、分支、code review 流程，甚至完全脱离 Lovable 独立部署。GitLab 也同样支持。
[click] 补一个限制：默认发布域名是 xxx 点 lovable 点 app，目前没法移除这个项目 URL；想用自定义域名只有付费档才行。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# vs Bolt.new / v0

三家定位差异，选型一眼看清

::left::

<div v-click>

### 范围与默认栈

- **Lovable**：全栈，React + Supabase
- **Bolt.new**：全栈，Node + 自家 DB（浏览器内跑）
- **v0**：**仅前端** React 组件，后端自备

</div>

::right::

<div v-click>

### Lovable 三大差异化

- 可视化点选编辑（**部分免费**）
- Supabase 全栈**自动供给**
- GitHub 双向同步 + **发布前安全扫描**

</div>

<div v-click class="col-span-2" text-sm>

最适合：**想少写代码、最快上线一个全栈想法**

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #FF6B9D 10%, #C13584 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
最后做个横向对比，选型一眼看清。

[click] 先看范围和默认栈：Lovable 是全栈，React 加 Supabase；Bolt.new 也是全栈，但用 Node 加自家数据库，在浏览器 WebContainer 里跑；v0 是 Vercel 的，只生成前端 React 组件，后端要自己备。
[click] Lovable 的三大差异化记忆点：一是可视化点选编辑，部分操作免费；二是 Supabase 全栈自动供给；三是 GitHub 双向同步加发布前强制安全扫描。
[click] 一句话总结适用场景：想少写代码、最快把一个全栈想法上线，就选 Lovable。
-->

---
layout: intro
transition: fade-out
---

# 结尾

对话即开发，让全栈想法最快落地

- vibe coding：自然语言 / 截图 → 真实代码全栈 app
- Lovable Cloud + AI：后端与 AI 开箱即用
- 代码所有权：GitHub 双向同步，可独立部署

<div class="abs-br m-6 text-xl">
  <a href="https://lovable.dev/" target="_blank" class="slidev-icon-btn">
    <carbon:launch />
  </a>
  <a href="https://docs.lovable.dev/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
  <a href="https://illegalcreed.github.io/zh/large-language-model/tools/app-builder/lovable/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #FF6B9D 10%, #C13584 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这就是 Lovable 的全景。

它把 vibe coding 做到标杆：自然语言或截图就能生成真实代码的全栈 app；Lovable Cloud 加 AI 让后端和 AI 开箱即用；GitHub 双向同步保证代码所有权，随时能脱离平台独立部署。

官网、文档和笔记链接都在右下角，去探索吧！
-->

---
layout: end
---
