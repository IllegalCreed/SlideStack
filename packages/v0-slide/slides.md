---
theme: seriph
background: https://cover.sli.dev
title: v0
info: |
  v0 (by Vercel) —— 用 AI 几分钟生成可运行的全栈应用与 agent。

  Learn more at [https://v0.app/](https://v0.app/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# v0

Vercel 出品的 AI 应用生成器 · Prompt. Build. Publish.

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
  background-color: #444444;
  background-image: linear-gradient(45deg, #666666 10%, #000000 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
大家好，今天聊 v0 —— Vercel 出品的 AI 应用生成器。
它的标语是 Prompt、Build、Publish：用自然语言提示，AI 几分钟生成可运行的应用，几秒钟发布成线上网站。
注意域名：v0.dev 现在已经跳转到 v0.app，全程我们都以 v0.app 为准。
-->

---
transition: fade-out
---

# 什么是 v0？

不止生成 UI，而是会规划、建任务、连数据库的全栈 agent

<v-clicks>

- 官方定义：**帮任何人创建真实代码、全栈应用与 agent 的 AI agent**
- 演进：从「**prompt → UI 组件**」升级为 **agentic 全栈生成**
- 边构建边推进：自动**规划 → 建任务 → 连数据库**
- 面向**任何人**：PM、设计师、工程师、市场、创作者；另有 iOS App

</v-clicks>

<div v-click text-xs>

_Read more about_ [_v0 introduction_](https://v0.app/docs/introduction)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #666666 10%, #000000 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
v0 到底是什么？

[click] 官方把它定义为「一个帮任何人创建真实代码、全栈应用和 agent 的 AI agent」。
[click] 它经历了一次关键演进：早期是 prompt 生成 React/shadcn 的 UI 组件，现在升级成了 agentic 的全栈应用生成。
[click] 所谓 agentic，就是它会边构建边推进——自动规划、创建任务、连接数据库。
[click] 目标用户强调「任何人」，包括产品、设计、市场、创作者这些非纯工程角色，还提供了 iOS App 在移动端构建。
-->

---
transition: fade-out
---

# 默认技术栈

紧贴 Vercel 生态，生成物开箱即可接入

<v-clicks>

- 框架 **Next.js**，UI 用 **React + shadcn/ui** 组件
- 样式 **Tailwind CSS**，部署面向 **Vercel** 基础设施
- 含义：输出 = 标准 Next 项目，可**无缝并入**自己的 Vercel 工程

</v-clicks>

<br>

<div v-click>

| 层级 | 技术 |
| --- | --- |
| 框架 | Next.js |
| UI 库 | React + shadcn/ui |
| 样式 | Tailwind CSS |
| 部署 | Vercel |

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #666666 10%, #000000 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
v0 的默认技术栈是固定的，而且紧贴 Vercel 生态。

[click] 框架是 Next.js，UI 用 React 加 shadcn/ui 组件。
[click] 样式是 Tailwind CSS，部署面向 Vercel 基础设施。
[click] 这带来一个重要含义：因为生成物就是一个标准的 Next 项目，所以可以无缝并入你自己的 Vercel 工程——这也是它区别于竞品的关键点之一。
[click] 这张表把四层技术栈列清楚了。
-->

---
transition: fade-out
---

# 一键部署到 Vercel

点 Publish 即上线，账号天然打通

<v-clicks>

- 点 **Publish** 把某个 chat 部署到 Vercel
- 首次部署**自动创建对应 Vercel Project**，之后更新该 project
- 预览继承所连 project 的**环境变量（仅 Development）**，构建期跑通真实集成
- **v0 账号本质就是 Vercel 账号**：共享团队 / 计费 / RBAC / 自定义域名

</v-clicks>

<div v-click text-xs>

_Read more about_ [_Vercel integration_](https://v0.app/docs/vercel-integration)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #666666 10%, #000000 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
部署这块是 v0 最丝滑的地方。

[click] 你只要点 Publish，就能把某个 chat 部署到 Vercel。
[click] 首次部署会自动创建一个对应的 Vercel Project，之后每次更新就更新这个 project。
[click] 预览窗口会继承所连 project 的环境变量，注意只有 Development 环境的变量，这样在构建期就能跑通真实的第三方集成。
[click] 最关键的一句话：v0 账号本质就是 Vercel 账号，团队、计费、权限管理、自定义域名全部共享，不用两套体系。
-->

---
transition: fade-out
---

# 工作流：四段式

Prompt → Iterate → Integrate → Ship

<v-clicks>

- **Prompt**：多模态输入——文本、**截图**、文件、**Figma 设计**
- **Iterate**：代码编辑 / 终端命令 / **Design Mode** / Versions 版本
- **Integrate**：连数据库、外部 API、GitHub、MCP、预装 agent、Slack
- **Ship**：**一键 Deploy** 或 **创建 Pull Request**，含自定义域名、模板

</v-clicks>

<div v-click text-xs>

_Read more about_ [_introduction_](https://v0.app/docs/introduction)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #666666 10%, #000000 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
官方把工作流拆成四段：Prompt、Iterate、Integrate、Ship。

[click] Prompt 阶段支持多模态输入，文本、截图、文件，甚至 Figma 设计都能当作提示。
[click] Iterate 阶段可以直接编辑代码、跑终端命令、用可视化的 Design Mode，还有版本管理。
[click] Integrate 阶段连接数据库、外部 API、GitHub、MCP、预装 agent 和 Slack。
[click] 最后 Ship 阶段，要么一键 Deploy 上线，要么创建 Pull Request，还带自定义域名和模板。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 两套 API · 别混淆

调模型 vs 做平台，是完全不同的两个东西

::left::

<div v-click>

### v0 Model API

- Base：`https://api.v0.dev/v1`，**OpenAI 兼容**
- 直接调 v0 **模型**做补全 / 对话
- 鉴权 `Authorization: Bearer $V0_API_KEY`
- 可塞进 Cursor / Cline 当模型用

</div>

::right::

<div v-click>

### v0 Platform API

- SDK：`pnpm add v0-sdk`，env `V0_API_KEY`
- 面向「做 dev tools / 平台」的**基础设施 API**
- 管 chat、解析生成文件、跑 app、操作 project/deployment
- 文档：`/docs/api/platform/overview`

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #666666 10%, #000000 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这页是最容易踩坑的地方：v0 有两套 API，名字像但用途完全不同。

[click] 左边是 v0 Model API，Base URL 是 api.v0.dev 斜杠 v1，OpenAI 兼容，作用是直接调用 v0 的模型做补全或对话，用 Bearer Token 鉴权，环境变量惯例叫 V0_API_KEY，还能把它当模型塞进 Cursor、Cline 这些客户端。
[click] 右边是 v0 Platform API，是一套 SDK，装的是 v0-sdk 包，它面向的是「做开发者工具和平台」的人，提供基础设施级能力：管理 chat、解析代码生成的文件、在浏览器跑 app、操作 project 和 deployment。两者别搞混。
-->

---
transition: fade-out
---

# Model API：OpenAI 兼容 ≠ 全兼容

最高频易错点：三个常用参数不支持

<v-clicks>

- 仅支持 `messages` / `model` / `stream` / `tools` / `tool_choice`
- **不支持 `temperature` / `max_tokens` / `top_p`**（照搬 OpenAI 代码会失败）
- 多模态：文本 + 图像（图像需 **base64**）；流式走 SSE
- 访问门槛：需 **Premium 或 Team 计划** + 开启 usage-based billing

</v-clicks>

<div v-click>

```python
# 注意：删掉 temperature / max_tokens，否则报错
client.chat.completions.create(
    model="v0-1.5-md",
    messages=[{"role": "user", "content": "建个登录页"}],
    stream=True,
)
```

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #666666 10%, #000000 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
Model API 虽然标榜 OpenAI 兼容，但有个高频坑：它只兼容参数的一个子集。

[click] 它只支持 messages、model、stream、tools 和 tool_choice 这几个参数。
[click] 关键易错点：temperature、max_tokens、top_p 都不支持，你如果直接照搬 OpenAI 的代码，带了这几个参数就会失败。
[click] 能力上支持多模态，文本加图像，图像要传 base64；流式用 SSE。
[click] 还有访问门槛：Model API 需要 Premium 或 Team 计划，并开启按量计费。
[click] 右边这段示例特意去掉了 temperature 和 max_tokens，这才是能跑通的写法。
-->

---
transition: fade-out
---

# 计费：额度制 · 以官方为准

按 token 从月度 credit 余额扣费，用尽即暂停

<v-clicks>

- **Free** $0：含 $5/月 credits，可部署 / Design Mode / GitHub，**每天 7 条消息**
- **Premium** $20：含 $20 credits + Figma 导入 + API；⚠ **正 sunset，对新用户关闭**
- **Team** $30/人：共享加购 credits、集中计费、协作、API
- **Business** $100/人：上同 + **默认训练 opt-out**；Enterprise 定制 SSO/RBAC/SLA

</v-clicks>

<div v-click text-xs>

_金额 / 功能随时调整，一律_ [_以官方定价页为准_](https://v0.app/pricing)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #666666 10%, #000000 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
计费这块，前提是它采用额度制：每个计划含每月 credit，AI 生成按 token 从余额扣费，余额用尽生成就暂停。

[click] Free 免费版，含每月 5 美元 credits，能部署、能用 Design Mode、能 GitHub 同步，但有个每天 7 条消息的上限。
[click] Premium 每月 20 美元，含 20 美元 credits、Figma 导入和 API 访问；但要特别注意，Premium 正在 sunset，对新用户已经关闭了。
[click] Team 每人每月 30 美元，团队共享加购 credits、集中计费、协作和 API。
[click] Business 每人 100 美元，在 Team 基础上默认数据不用于训练；再往上 Enterprise 是定制的 SSO、RBAC 和 SLA。所有金额和功能都以官方定价页为准。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# GitHub 集成

仓库即唯一真相源，v0 不另存副本

::left::

<div v-click>

### 连接后的行为

- 仓库是**唯一真相源**，v0 **不另存代码副本**
- 自动从 `main` 切工作分支（如 `v0/main-abc123`）
- **每条改代码的消息自动产生一次 commit**

</div>

::right::

<div v-click>

### 发布与边界

- 点 **Publish** → 从工作分支向 `main` 发 **PR**
- 是 v0 读写 GitHub，**非双向实时 sync**
- 文档未承诺导入既有仓库的双向同步

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #666666 10%, #000000 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
GitHub 集成的模型和很多工具不一样，要讲清楚。

[click] 连接后，仓库就是唯一真相源，v0 不会另存一份代码副本。它会自动从 main 切一个工作分支，命名类似 v0 斜杠 main 加一串哈希；而且每一条改动代码的消息，都会自动产生一次 commit。
[click] 发布时，你点 Publish，它会从工作分支向 main 发一个 Pull Request。要强调一点：这是 v0 在读写 GitHub，不是双向实时 sync，官方文档也没承诺导入既有仓库后的双向同步，别误解。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# vs bolt.new / Lovable

记忆点：v0 = Vercel 生态 + shadcn/ui + 可调 API 的自有模型

::left::

<div v-click>

### v0 的护城河

- **Vercel 生态深度整合**：部署 / 账号 / 计费 / 域名一体
- **shadcn/ui** 高质量组件产出
- 自有模型可经 **OpenAI 兼容 API** 独立调用

</div>

::right::

<div v-click>

### 另两者

- **bolt.new**：基于 WebContainers 浏览器内跑全栈，框架不挑、不绑单一云
- **Lovable**：偏非工程产品向，强 **Supabase** 集成

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #666666 10%, #000000 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
最后做个横向对比，帮你记住 v0 的定位。

[click] v0 的护城河有三点：和 Vercel 生态深度整合，部署、账号、计费、域名一体；产出基于 shadcn/ui 的高质量组件；而且它的自有模型可以经 OpenAI 兼容的 API 独立调用，既能在网页用，也能进 Cursor 当模型。
[click] 另外两个：bolt.new 基于 WebContainers 在浏览器里跑全栈，框架更不挑、不绑单一云；Lovable 偏非工程的产品向体验，主打 Supabase 集成。一句话记忆点就是：v0 等于 Vercel 生态加 shadcn/ui 加可调 API 的自有模型。
-->

---
layout: intro
transition: fade-out
---

# 结尾

Prompt. Build. Publish. —— 让全栈应用几分钟可运行可上线

- 默认栈 Next.js + shadcn/ui + Tailwind，账号即 Vercel 账号
- 两套 API：Model API 调模型，Platform API 做平台
- GitHub 仓库即真相源，Publish 发 PR

<div class="abs-br m-6 text-xl">
  <a href="https://v0.app/" target="_blank" class="slidev-icon-btn">
    <carbon:launch />
  </a>
  <a href="https://v0.app/docs" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
  <a href="https://illegalcreed.github.io/zh/large-language-model/tools/app-builder/v0/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #666666 10%, #000000 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这就是 v0 的全景。

它的标语 Prompt、Build、Publish，核心就是让全栈应用几分钟内可运行、可上线。默认栈是 Next.js 加 shadcn/ui 加 Tailwind，账号天然就是 Vercel 账号。两套 API 别混：Model API 调模型，Platform API 做平台。GitHub 这边，仓库是真相源，发布走 PR。

官网、文档和笔记链接都在右下角，去试试吧！
-->

---
layout: end
---
