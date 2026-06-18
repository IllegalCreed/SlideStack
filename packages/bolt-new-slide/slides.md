---
theme: seriph
title: bolt.new
info: |
  bolt.new —— StackBlitz 出品的 AI 全栈应用生成器，对话即可生成、即时运行、一键部署。

  Learn more at [https://bolt.new/](https://bolt.new/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# bolt.new

对话即生成的 AI 全栈应用构建器 · 基于 WebContainers

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
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #0B1E5B 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
大家好，今天聊 bolt.new —— StackBlitz 出品的 AI 全栈应用生成器。
它的玩法是：你用自然语言聊想法，它就把可运行、可部署的全栈应用做出来，而且整套环境跑在浏览器里。
受众不只是程序员，产品、创业者、设计师、学生都能上手。
-->

---
transition: fade-out
---

# 什么是 bolt.new？

用一句话描述需求，换回一个能跑的全栈应用

<v-clicks>

- StackBlitz 出品的 **AI 全栈生成器**：prompt → 可运行的 Web / 移动应用
- 建在 **WebContainers** 上，浏览器内**原生跑 Node**，无需本地搭环境
- 面向**非编码者**也友好：产品、创业者、市场、设计、学生
- 2024-10 发布；同门技术与 StackBlitz 编辑器同源

</v-clicks>

<div v-click text-xs>

_Read more about_ [_intro to Bolt_](https://support.bolt.new/building/intro-bolt)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2563EB 10%, #0B1E5B 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
bolt.new 本质是一个 AI 全栈应用生成器。

[click] 你给它一句需求，它给你一个能跑的 Web 或移动应用，这就是所谓的对话式 vibe coding。
[click] 它建在 WebContainers 上，Node 原生跑在浏览器里，所以不用在本地装任何环境就能开始。
[click] 它明确把非编码者当一等公民，产品经理、创业者、市场、设计、学生都能用。
[click] 它 2024 年 10 月发布，和 StackBlitz 在线编辑器同源同根。
-->

---
transition: fade-out
---

# 底层：WebContainers + 默认 Claude

不是"生成代码 + 预览框"，而是浏览器里的真实开发环境

<v-clicks>

- **WebContainers**：浏览器内原生跑 Node —— 可 `npm install`、起 server、开终端
- AI agent 掌控**文件系统 / 包管理器 / 终端 / 浏览器 console**
- **默认 Claude 系模型**：官方自动路由「为每个任务选合适的模型，平衡质量与成本」
- 版本会变 —— 记**默认 Claude + 自动路由**，别背具体版本号

</v-clicks>

<div v-click text-xs>

_Read more about_ [_using Bolt_](https://github.com/stackblitz/bolt.new)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2563EB 10%, #0B1E5B 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
bolt.new 的底座有两块：WebContainers 和默认 Claude。

[click] WebContainers 让 Node 原生跑在浏览器里，所以你能真的 npm install、起 server、开终端，是真实环境不是预览框。
[click] 关键是 AI agent 拿到了文件系统、包管理器、终端、浏览器 console 的控制权，能自己装包、跑命令、读报错。
[click] 默认模型是 Claude 系，官方会按任务自动路由，平衡质量和成本。
[click] 一定要注意：具体版本号会变，帮助页通常也不点名，讲课就记"默认 Claude 加自动路由"。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 两个 Agent：Standard / Max

按任务复杂度选，免费版只有 Standard

::left::

<div v-click>

### Standard

- 「日常构建的均衡选择，快且省 token」
- 适合中小应用、UI 改动、**定义清晰**的任务
- **免费版仅此一个**

</div>

::right::

<div v-click>

### Max

- 「为复杂任务做最大化推理，每步想得更多」
- 适合大代码库、复杂依赖、重构、开放式问题
- **需付费**；对详细 prompt 反应更好

</div>

<div v-click text-xs mt-4>

_v1 legacy agent 淘汰中：2026-04-13 起新项目不可选，2026-08-03 退役_

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2563EB 10%, #0B1E5B 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
2025 年 5 月起，bolt.new 把"逐个选模型"换成了两个 agent。

[click] Standard 是日常均衡档，快又省 token，适合中小应用、UI 改动、定义清晰的活，免费版只有它。
[click] Max 是最大化推理档，每一步想得更多，适合大代码库、复杂依赖、重构和开放式问题，需要付费，给它详细 prompt 效果更好。
[click] 还有个老的 v1 agent 正在淘汰：2026 年 4 月起新项目不能选，8 月退役，老项目会自动迁到默认 agent。
-->

---
transition: fade-out
---

# 核心工作流

对话生成 → 迭代 → 即时预览 → 一键部署

<v-clicks>

- **对话生成**：聊天框写想法 → Build now → 产出可运行产品
- **迭代**：继续对话即可改；支持 **diff** 查看、**版本历史可视化回滚**
- **即时预览**：跑在 WebContainers，是**真实运行**而非静态渲染
- **Enhance prompt** + Prompt Library 帮你写更好的提示
- **Plan / Discussion Mode**：先聊清楚再动代码，省 token、可联网检索

</v-clicks>

<div v-click text-xs>

_Read more about_ [_discussion mode_](https://support.bolt.new/best-practices/discussion-mode)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2563EB 10%, #0B1E5B 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
日常怎么用，记住这条主线。

[click] 第一步对话生成：聊天框写需求，点 Build now，它把能跑的产品做出来。
[click] 要改就继续对话，过程里能看 diff，也能用可视化的版本历史回滚到任意历史版本。
[click] 预览是真实运行的，因为它跑在 WebContainers，不是静态截图。
[click] 写 prompt 没把握，可以用 Enhance prompt 一键增强，还有 Prompt Library 模板库。
[click] 最省钱的习惯是先用 Plan 或 Discussion Mode 把需求聊清楚再动代码，它还能联网做实时检索。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# Bolt Cloud：补上"上生产"那一截

把"做出来"和"扛得住生产"打通，后端由 Supabase 驱动

::left::

<div v-click>

### 2025-08 · Hosting + Domains

- 整合托管与域名，一键发布
- 免费用户得 **`.bolt.host`** 子域名
- 自定义域名需付费

</div>

::right::

<div v-click>

### 2025-09-30 · Supabase 后端 GA

- Postgres 数据库 + 鉴权 + 存储
- Edge Functions + Realtime
- 「周末做出来，可扩展到百万级」

</div>

<div v-click text-xs mt-4>

_分两阶段上线 —— 别写成单一日期"全功能上线"_

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2563EB 10%, #0B1E5B 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
Bolt Cloud 解决的是 vibe coding 的致命缺陷：做得出 demo，扛不住生产。

[click] 第一阶段是 2025 年 8 月，整合了托管和域名，一键发布；免费用户能拿到 bolt.host 子域名，自定义域名要付费。
[click] 第二阶段是 9 月 30 号，Supabase 驱动的后端正式 GA，带 Postgres 数据库、鉴权、存储、Edge Functions 和 Realtime，口号是周末做出来、可扩展到百万级。
[click] 讲课务必强调它是分两阶段上线的，不要写成某一天"全功能一次上线"。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# Bolt Database vs Supabase（易混）

默认 Bolt Database，需要更强能力再切 Supabase

::left::

<div v-click>

### 两者关系

- 新项目**默认 Bolt Database**：按需自动创建，体验最简
- 想要高级能力 / 强数据掌控 → 改用 **Supabase**
- 「后期再从 Bolt Database 切到 Supabase 需额外步骤」

</div>

::right::

<div v-click>

### 关键限制

- **Supabase 连接仅支持 Vite 项目**
- **Next.js 暂不支持**
- 结论：**尽早做后端选型**，别等切换

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2563EB 10%, #0B1E5B 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这页是高频考点，也最容易混：Bolt Database 和 Supabase 到底什么关系。

[click] 新项目默认用 Bolt Database，按需自动创建，体验最省心；想要更高级的能力或更强的数据掌控，就改用 Supabase。但要记住，后期再从 Bolt Database 切到 Supabase 是要额外步骤的。
[click] 还有两条硬限制：Supabase 连接目前只支持 Vite 项目，Next.js 暂时不支持。所以结论很明确——尽早把后端选型定下来，别拖到上线再切。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 计费：token 体系（以官方为准）

token 大头来自"读取/同步整个项目文件"

::left::

<div v-click>

### token 怎么算

- LLM 处理文本的单位：短词≈1 token
- **项目越大，每条消息越贵** —— 烧得快的根因
- 对策：Plan/Discussion Mode + 保持项目精简

</div>

::right::

<div v-click>

### 四档（功能向，可能变）

- **Free** $0：每日 300K / 月 1M，仅 Standard
- **Pro** $25/月：月起 10M，可用 Max，未用滚存
- **Teams** $30/月·席：集中账单、设计系统
- **Enterprise**：定制，SSO / 审计 / 专属支持

</div>

<div v-click text-xs mt-2 text-right>

_一切金额与额度以 [bolt.new/pricing](https://bolt.new/pricing) 为准_

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2563EB 10%, #0B1E5B 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
计费用的是 token 体系，先把免责说在前面：一切金额和额度以官方 pricing 页为准，计费经常变。

[click] token 是 LLM 处理文本的单位，短词大约一个 token。它烧得快的根因是 Bolt 要读取和同步你的整个项目，项目越大每条消息越贵；对策就是先用 Plan 或 Discussion Mode 聊清楚，并保持项目精简。
[click] 四档做功能向理解：免费版每天 30 万、每月 100 万 token，只有 Standard；Pro 每月 25 美元，起步 1000 万 token，能用 Max，没用完的滚存；Teams 每席每月 30 美元，加集中账单和设计系统；Enterprise 定制，带 SSO、审计和专属支持。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# bolt.new vs bolt.diy（务必区分）

一个是托管 SaaS，一个是 MIT 开源可自托管

::left::

<div v-click>

### bolt.new（SaaS）

- StackBlitz 托管，**默认 Claude**
- 跑在 WebContainers 云端
- token 计费，开箱即用

</div>

::right::

<div v-click>

### bolt.diy（开源）

- 官方开源版，**许可证 MIT**
- 「用你想要的**任意 LLM**」：19+ 提供商
- 可**自托管 / Docker / Electron**、MCP、Supabase

</div>

<div v-click text-xs mt-4>

_二者不是同一套部署 —— 别混为一谈_

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2563EB 10%, #0B1E5B 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这页是另一个红线：bolt.new 和 bolt.diy 一定要分清。

[click] bolt.new 是 StackBlitz 托管的商业 SaaS，默认用 Claude，跑在 WebContainers 云端，token 计费，开箱即用。
[click] bolt.diy 是官方的开源版，许可证是 MIT，最大卖点是每个 prompt 都能换用任意 LLM，支持 19 家以上的提供商；它能自托管、跑 Docker、做成 Electron 桌面应用，也支持 MCP 和 Supabase。
[click] 一句话：两者不是同一套部署，讲课和出题都别混为一谈。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 部署与集成

一键发布 + 丰富的导入导出生态

::left::

<div v-click>

### 一键发布

- 右上 **Publish** → 选 hosting → 约 1 分钟出链接
- **Bolt Cloud**：自动子域名 + 自定义域名管理
- **Netlify**：随机 `netlify.app` 域名，**须首次发布前选定**

</div>

::right::

<div v-click>

### 集成

- **Supabase**：后端（数据库/鉴权/函数）
- **Figma / Google Stitch**：设计导入
- **GitHub**：导入仓库 + 版本管理
- **Expo**：React Native → iOS/Android；**MCP**

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2563EB 10%, #0B1E5B 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
部署很简单，集成生态很丰富。

[click] 部署：点右上的 Publish，选 hosting，大约一分钟出链接。选 Bolt Cloud 会给自动子域名加自定义域名管理；选 Netlify 会给随机的 netlify.app 域名，但注意——要用 Netlify 必须在首次发布前就选好。
[click] 集成这边：Supabase 提供数据库、鉴权和函数这套后端；设计可以从 Figma 或 Google Stitch 导入；代码可以从 GitHub 导入并做版本管理；移动端有 Expo，生成 React Native 再打包到 iOS 和安卓，另外还支持连接 MCP server。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# vs v0 / Lovable（选型口诀）

同是 AI 应用生成器，定位差异明显

::left::

<div v-click>

### 各自强项

- **bolt.new**：WebContainers 真环境、**多框架**、可换模型的开源版、能做移动端
- **v0（Vercel）**：高质量 **React/Next UI 组件**，偏 Vercel 生态
- **Lovable**：对**完全不会写代码**的人最友好

</div>

::right::

<div v-click>

### 怎么选

- 不会写代码、要最快验证 → **Lovable**
- 技术向 / 要控制权 / 大代码库 / 移动端 → **bolt.new**
- 高质量 React/Next UI 或在 Vercel 生态 → **v0**

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2563EB 10%, #0B1E5B 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
最后横向对比一下三个主流 AI 应用生成器。

[click] 各自强项：bolt.new 强在 WebContainers 的真环境、多框架自由、还有可换模型的开源版，也能做移动端，偏技术；v0 强在生成高质量的 React 和 Next UI 组件，偏 Vercel 生态；Lovable 则对完全不会写代码的人最友好。
[click] 选型口诀就三句：不会写代码、要最快验证就选 Lovable；技术向、要控制权、大代码库或移动端就选 bolt.new；要高质量 React/Next UI 或本来就在 Vercel 生态就选 v0。
-->

---
layout: intro
transition: fade-out
---

# 结尾

把想法变成可运行、可部署的全栈应用

- WebContainers + 默认 Claude：浏览器内对话即生成
- Bolt Cloud：托管 / 域名 + Supabase 后端（分两阶段上线）
- bolt.new(SaaS) 与 bolt.diy(MIT 开源) 严格区分

<div class="abs-br m-6 text-xl">
  <a href="https://bolt.new/" target="_blank" class="slidev-icon-btn">
    <carbon:launch />
  </a>
  <a href="https://github.com/stackblitz/bolt.new" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/large-language-model/tools/app-builder/bolt-new/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #2563EB 10%, #0B1E5B 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这就是 bolt.new 的全景。

它用 WebContainers 加默认 Claude，让你在浏览器里对话即生成全栈应用；Bolt Cloud 补上了托管、域名和 Supabase 后端，记得它是分两阶段上线的；最后别忘了 bolt.new 是托管 SaaS、bolt.diy 是 MIT 开源版，两者要严格区分。

官网、GitHub 和笔记链接都在右下角，去试试吧！
-->

---
layout: end
---
