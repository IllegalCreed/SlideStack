---
theme: seriph
background: https://cover.sli.dev
title: CodeSandbox
info: |
  CodeSandbox —— 为规模而生的云沙箱（服务端 Firecracker microVM + SDK）。

  Learn more at [https://codesandbox.io/](https://codesandbox.io/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# CodeSandbox

为规模而生的云沙箱 · 服务端 Firecracker microVM + SDK

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
  background-color: #6C5CE7;
  background-image: linear-gradient(45deg, #6C5CE7 10%, #341f97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
大家好，今天聊 CodeSandbox。很多人把它和 StackBlitz 混为一谈，其实两者底层完全不同。
CodeSandbox 的核心是服务端的 Firecracker microVM —— 把代码送到云端真虚拟机里跑，再加上一套 SDK，专门服务 AI agent 的代码执行。
这一讲就把它的本质、产品形态、SDK、Sandpack 和选型一次讲透。
-->

---
transition: fade-out
---

# 什么是 CodeSandbox？

即时云开发 + 为 AI agent 而生的代码沙箱

<v-clicks>

- 2026 官网 H1：**Sandboxes built for scale**（为规模而生的沙箱）
- 编程式拉起**隔离沙箱**，在 AI agent / playground 里**即时执行代码**
- 重心已从"前端原型 / 代码分享"转向 **AI agent 代码执行基础设施**

</v-clicks>

<br>

<div v-click text-xs>

_Read more about_ [_CodeSandbox_](https://codesandbox.io/)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #341f97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
先看定位。

[click] 2026 年官网首页大标题是 Sandboxes built for scale，为规模而生的沙箱。
[click] 它的卖点是编程式拉起隔离沙箱，在 AI agent 或代码 playground 里即时执行代码。
[click] 注意这个重心迁移：它早年是前端原型和代码分享工具，现在整体转向了 AI agent 代码执行基础设施。这是理解后面所有内容的前提。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 与 StackBlitz 的本质差异

最易考、最易混的一组对比

::left::

<div v-click>

### CodeSandbox

- **服务端** Firecracker microVM（真 Linux 虚拟机）
- 任意语言 / 任意 **Dockerfile** / 原生二进制
- 可连**真实数据库**（Postgres / Redis / Mongo）
- 算力在云端，按 VM 时长计费

</div>

::right::

<div v-click>

### StackBlitz

- **客户端** WebContainers（浏览器内 WASM）
- Node.js 为主，原生需先移植 Wasm
- 受浏览器网络限制，**连不上**外部 DB
- 算力是本地 CPU，毫秒启动、可离线

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #341f97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这是整个主题里最核心、也最容易被搞混的一组对比。

[click] CodeSandbox 是服务端，底层是 Firecracker microVM，一台真正的 Linux 虚拟机；能跑任意语言、任意 Dockerfile、原生二进制，还能连真实的 Postgres、Redis、Mongo；算力在云端，按 VM 运行时长计费。
[click] StackBlitz 正相反，是客户端，WebContainers 在浏览器里用 WASM 跑；以 Node 为主，受浏览器网络限制，连不上外部数据库；但算力是你本地 CPU，毫秒启动还能离线。
一句话：CodeSandbox 把代码送到云端真 VM 跑，StackBlitz 把 Node 搬进浏览器跑。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 两类沙箱（当前 taxonomy）

VM Sandboxes 与 Browser Sandboxes

::left::

<div v-click>

### VM Sandboxes（核心）

- 跑在 **Firecracker microVM** 上的隔离虚拟机
- 跨会话持久化、**休眠/恢复保留内存快照**
- 安全 host URL 暴露端口；广泛语言框架
- 从模板 fork → **1–3 秒就绪**

</div>

::right::

<div v-click>

### Browser Sandboxes（原型）

- 浏览器内置环境评估，**断网仍可打包**
- 自带专用 bundler，镜像框架默认 CLI
- 不是一比一实现，**不支持自定义 webpack / eject**
- 适合快速原型、分享片段

</div>

<div v-click text-xs mt-2>

注："Devbox / CDE 三产品线"是**历史叙事**，当前文档已统一为这两类

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #341f97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
当前文档把 Sandbox 分成两类。

[click] 第一类 VM Sandboxes 是核心，跑在 Firecracker microVM 上，跨会话持久化，休眠和恢复都保留完整内存快照，能用安全 host URL 暴露端口，支持广泛语言框架，从模板 fork 一到三秒就绪。
[click] 第二类 Browser Sandboxes 用于原型，在浏览器内置环境里评估，断网还能继续打包；它自带专用 bundler，只镜像框架的默认 CLI 行为，不是一比一实现，所以不支持自定义 webpack 配置或 eject。
[click] 这里要澄清一个常见误区：早年宣传的 Devbox、CDE 三条产品线是历史营销叙事，当前官方文档已经统一成这两类了，写文章别再当成独立 SKU。
-->

---
transition: fade-out
---

# 性能档：秒级拉起与恢复

为高并发与 AI 调用而优化的持久化层级

<v-clicks>

- 创建：从 Template fork → **1–3 秒**就绪
- 恢复（取决于持久化层级）：
  - 内存/磁盘快照 → **0.5–2 秒**
  - 磁盘快照 → **5–20 秒**
  - 归档 → **20–60 秒**
- 默认持久化：休眠建内存快照，磁盘**最多保留 7 天**，超期归档到长期存储（仍保完整状态）

</v-clicks>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #341f97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
既然是面向高并发和 AI 调用，性能就是卖点。

[click] 创建沙箱，从 Template fork，一到三秒就绪。
[click] 恢复速度取决于持久化层级：内存或磁盘快照恢复半秒到两秒；纯磁盘快照五到二十秒；归档恢复二十到六十秒，慢但状态完整。
[click] 默认持久化策略是：休眠时建内存快照，休眠的沙箱在磁盘最多保留七天，超期或磁盘紧张就归档到长期存储，归档恢复更慢但仍然保留完整状态。所以官方也推荐把数据托管到 Git 或数据库来降本提速。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# CodeSandbox SDK

The power of CodeSandbox in a library —— 为 AI agent 执行代码

::left::

<div v-click>

```ts
import { CodeSandbox } from "@codesandbox/sdk";

const sdk = new CodeSandbox(process.env.CSB_API_KEY);

// 从模板 fork 一个沙箱
const sandbox = await sdk.sandboxes.create();

// 连接进入，拿到 client
const client = await sandbox.connect();

// 在沙箱内执行命令
const out = await client.commands.run("echo hi");
```

</div>

::right::

<div v-click>

- 用 microVM 基础设施跑**不受信任代码**
- 目标用例：**AI agent 运行时** / 代码解释器 / 浏览器 IDE / CI·CD
- 快照恢复 **< 1s**、克隆 **< 2s**；可跑任意 Dockerfile
- 鉴权：`CSB_API_KEY` 环境变量

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_CodeSandbox SDK_](https://github.com/codesandbox/codesandbox-sdk)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #341f97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
重头戏是 CodeSandbox SDK，官方一句话是把 CodeSandbox 的能力做成一个库。

[click] 左边是核心三步：new CodeSandbox 传 API key 拿到 sdk；sandboxes.create 从模板 fork 一个沙箱；sandbox.connect 建连拿到 client；最后 client.commands.run 在沙箱里执行命令。三行就跑起来了。
[click] 它用 microVM 基础设施跑不受信任代码，目标用例是 AI agent 运行时、代码解释器、浏览器内 IDE、还有 CI/CD；快照恢复一秒内、克隆两秒内，还能跑任意 Dockerfile；鉴权就是把 token 设成 CSB_API_KEY 环境变量。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 2024-12 Together AI 收购

LLM 能生成代码，但不能执行 —— 沙箱补上这一环

::left::

<div v-click>

### 收购事实

- **2024-12-12** Together AI 完成收购 CodeSandbox BV
- 现为 "a Together AI company"，产品**继续独立运营**
- 2017 年阿姆斯特丹成立，月活 450 万+ 开发者

</div>

::right::

<div v-click>

### 两个产物

- **TCI**（Together Code Interpreter）：集成进 Together 推理平台，执行 LLM 生成的代码并回传结果
- **CodeSandbox SDK**：收购后推出，编程式创建/运行 VM 沙箱

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #341f97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
为什么会从云 IDE 转向 AI 执行？答案在这场收购。

[click] 2024 年 12 月 12 日，Together AI 完成了对 CodeSandbox BV 的收购。现在它是 a Together AI company，但产品继续独立运营。公司 2017 年在阿姆斯特丹成立，月活四百五十万开发者。
[click] 收购逻辑很清楚：大模型擅长生成代码，但不能执行代码，需要人工去测试调试。CodeSandbox 的隔离 microVM 正好补上执行这一环。于是有了两个产物：一个是 TCI，集成进 Together 推理平台，接收模型生成的代码、在隔离环境执行、再把结果回传给模型；另一个就是刚讲的 CodeSandbox SDK。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# Sandpack：可嵌入的实时代码组件

Component toolkit for live-running code · powered by CodeSandbox

::left::

<div v-click>

```tsx
import { Sandpack } from "@codesandbox/sandpack-react";

export default () => (
  <Sandpack template="react" />
);
```

- 设一个 `template` prop 即可起步
- `customSetup` 加依赖、`options` 切 UI、`theme` 换主题

</div>

::right::

<div v-click>

- 浏览器内 bundler + **Nodebox**（浏览器内 Node.js 运行时）
- 编辑器底层 **CodeMirror**；内置 npm/HMR/错误浮层
- **React 官方文档**即用 Sandpack 做内联示例
- 与 CodeSandbox 服务端 VM **不同层**（浏览器内运行）

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_Sandpack_](https://sandpack.codesandbox.io/)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #341f97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
除了服务端 SDK，CodeSandbox 还有一条嵌入组件线：Sandpack。

[click] 它是一套创建实时运行代码体验的组件工具，由 CodeSandbox 驱动。用法极简，React 包 sandpack-react，放一个 Sandpack 组件、设个 template prop 就起步了；要加依赖用 customSetup，切内置 UI 用 options，换主题用 theme。
[click] 它底层是浏览器内的 bundler 加 Nodebox —— 一个能在任意浏览器里跑服务端代码的 Node 运行时；编辑器用 CodeMirror，内置 npm 依赖、热更新和错误浮层。React 官方文档的可运行示例就是用它做的。要特别强调：Sandpack 是浏览器内运行，和 CodeSandbox 的服务端 VM 完全不是一层东西。
-->

---
transition: fade-out
---

# 定价（功能向，金额以官方为准）

VM credits 计费骨架 —— Browser Sandboxes 不耗 credits

<v-clicks>

- **Build（免费）**：每月 40 小时 VM credits；SDK lite，限 **10 并发 VM**；VM 最高 4 vCPU / 8 GiB
- **Scale（按量订阅起步）**：每月 160 小时 credits；**250 并发 VM**；完整 SDK；每小时可建 1,000 沙箱
- **Enterprise（联系销售）**：定制并发；VM 最高 64 vCPU / 128 GiB；SOC 2 Type II、SSO

</v-clicks>

<div v-click text-xs mt-2>

具体金额随官网调整，**以 [官方 pricing](https://codesandbox.io/pricing) 为准**

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #341f97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
定价我们按功能讲，金额一律以官网为准。

计费骨架是 VM credits，只对 VM Sandboxes 计费，Browser Sandboxes 不耗 credits。

[click] 免费的 Build 档：每月四十小时 VM credits，SDK 是 lite 版限十个并发 VM，机型最高四核八 G，适合学习实验。
[click] Scale 档按量订阅：每月一百六十小时 credits，二百五十个并发 VM，完整 SDK，每小时能建一千个沙箱，明显是面向规模化调用。
[click] Enterprise 联系销售：定制并发、机型最高六十四核一百二十八 G，还有 SOC 2 合规和 SSO。
[click] 再次提醒，具体金额官网随时会调，以官方 pricing 页为准。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# vs StackBlitz：怎么选

按"真后端 / AI 执行" 还是 "速度 / 零运维" 分流

::left::

<div v-click>

### 选 CodeSandbox

- 跑 AI agent / 代码解释器，**真实执行不受信任代码**
- 连真实数据库、跑原生二进制、任意 Dockerfile
- 需**高并发 VM + 编程式批量管理**、CI/CD evaluation
- 团队协作、长期持久化、从 Git 恢复

</div>

::right::

<div v-click>

### 选 StackBlitz

- 要**极致冷启动**、零服务器成本、离线可跑
- 主要是前端 / Node.js，不需真实 DB 或原生二进制
- 文档教程内嵌可运行示例，看重纯浏览器

</div>

<div v-click text-xs mt-2>

嵌入组件层：内联实时代码 → **Sandpack**；完整 IDE 直接嵌入 → StackBlitz embed

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #341f97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
最后是选型，一句话分流：真后端、AI 执行选 CodeSandbox；速度、零运维、纯前端选 StackBlitz。

[click] 具体来说，选 CodeSandbox 的场景是：要跑 AI agent 或代码解释器、需要真实执行不受信任代码；要连真实数据库、跑原生二进制、任意 Dockerfile；需要高并发 VM 加编程式批量管理、做 CI/CD 的 evaluation；以及团队协作、长期持久化、从 Git 恢复。
[click] 选 StackBlitz 的场景是：要极致冷启动、零服务器成本、离线可跑；主要做前端或 Node，不需要真实数据库和原生二进制；文档教程里内嵌可运行示例，看重纯浏览器无运维。
[click] 如果只是嵌入组件这一层：文档博客内联实时代码用 Sandpack，要完整 IDE 直接嵌入用 StackBlitz embed。
-->

---
layout: intro
transition: fade-out
---

# 结尾

服务端真 VM + SDK，把"代码执行"交给云端与 AI

- VM Sandboxes：Firecracker microVM，能跑真后端 / 数据库 / 任意 Dockerfile
- CodeSandbox SDK：为 AI agent 编程式拉起沙箱、秒级快照恢复
- Sandpack：浏览器内实时代码组件，React 官方文档采用

<div class="abs-br m-6 text-xl">
  <a href="https://codesandbox.io/" target="_blank" class="slidev-icon-btn">
    <carbon:launch />
  </a>
  <a href="https://github.com/codesandbox/sandpack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/frontend-develop-tools/online-editor/codesandbox/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #341f97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这就是 CodeSandbox 的全景。

它的核心是服务端真 VM 加一套 SDK，把代码执行交给云端和 AI。VM Sandboxes 用 Firecracker microVM，能跑真后端、数据库和任意 Dockerfile；CodeSandbox SDK 为 AI agent 编程式拉起沙箱、秒级快照恢复；Sandpack 是浏览器内的实时代码组件，React 官方文档就在用。

官网、Sandpack 仓库和笔记链接都在右下角，去探索吧！
-->

---
layout: end
---
