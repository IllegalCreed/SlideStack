---
theme: seriph
background: https://cover.sli.dev
title: Expo Skills
info: |
  Expo 官方 AI agent 技能集：构建/部署/升级/调试 Expo 应用 + EAS。
  expo/skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Expo Skills

Expo 官方 agent 技能集——**构建 / 部署 / 升级 / 调试** Expo 应用 + EAS

<div class="pt-6 opacity-80">
expo/skills · Framework（开源）+ Services（付费 EAS）· MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/expo/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Expo Skills 是 Expo 团队官方的 agent 技能集，把「何时用哪个 Expo/EAS API、工作流怎么搭、有哪些约束」打包成 agent 按任务自动选取的技能。
-->

---
transition: fade-out
---

# 官方定位：技能是「怎么用」，不是事实来源

<div class="grid grid-cols-2 gap-6 mt-6">
<div v-click>

**给 agent 聚焦的 Expo 知识**

- 什么时候用哪个 Expo API
- 常见工作流怎么组织
- Expo / EAS / RN / iOS / Android 有哪些约束

</div>
<div v-click>

**事实来源（source of truth）**

- Expo 文档
- Expo CLI
- EAS CLI

技能帮 agent **正确应用**它们

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">
Expo/EAS 演进快——技能可能滞后，具体值以官方文档与 CLI 为准。
</div>

<style>
h1 { background: linear-gradient(45deg, #000020 10%, #4630EB 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
官方反复强调：Expo 文档、Expo CLI、EAS CLI 才是事实来源，技能只是帮 agent 正确地应用它们。因为 Expo 演进快，技能可能滞后。
-->

---
transition: fade-out
---

# 三路安装，按 agent 选

<div v-click>

```bash
# Claude Code（官方插件市场，自动更新）
claude plugin install expo@claude-plugins-official

# Codex（OpenAI 精选市场）
codex plugin add expo@openai-curated

# 其它 agent：Skills CLI 一次装全部
npx skills@latest add expo/skills --skill '*'
```

</div>

<div v-click class="mt-4 text-center">

Cursor / OpenCode / Copilot / Windsurf / Gemini / Cline… 都走 Skills CLI；
装完刷新会话让 agent 发现 `SKILL.md`。

</div>

<style>
h1 { background: linear-gradient(45deg, #000020 10%, #4630EB 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Claude Code 和 Codex 用官方插件，更新走各自市场；其它 agent 用 Skills CLI 一条命令装全部。装完记得刷新会话。
-->

---
transition: fade-out
---

# 20+ 技能，两大组，边界清晰

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**Framework（开源 · 免费）14 个**

- `expo-router` 文件式路由
- `expo-native-ui` / `expo-ui` 原生 UI
- `expo-data-fetching` 网络数据
- `expo-dom` Web 代码入原生
- `expo-module` 写原生模块
- `expo-brownfield` / `expo-web-to-native`

</div>
<div v-click>

**Services & paid（用付费 EAS）6 个**

- `eas-app-stores` 上架
- `eas-hosting` 部署 Web+API
- `eas-workflows` CI/CD
- `eas-observe` 性能观测
- `eas-update-insights` OTA 健康
- `eas-simulator` 云模拟器

</div>
</div>

<div v-click class="mt-3 text-center text-sm opacity-80">
每个 EAS 技能开头都有 <code>EAS service - costs apply</code> 成本提示。
</div>

<style>
h1 { background: linear-gradient(45deg, #000020 10%, #4630EB 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
技能分两组：Framework 组全开源免费，涵盖建应用、路由、UI、原生模块；Services 组用付费 EAS，涵盖上架、托管、CI/CD、观测。免费付费边界很清楚。
-->

---
layout: two-cols
layoutClass: gap-8
---

# Framework 技能（上）

<v-clicks>

- **project-structure** 新项目目录骨架
- **router** 路由/Link/Stack/NativeTabs
- **native-ui** 语义色/SF Symbols/动画
- **ui** `@expo/ui` 真 SwiftUI/Compose

</v-clicks>

::right::

<v-clicks>

- **data-fetching** fetch/React Query/离线
- **tailwind-setup** Tailwind v4 + NativeWind v5
- **dom** `'use dom';` 跑 Web 代码
- **examples** ~70 个 `with-*` 集成范例

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #000020 10%, #4630EB 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Framework 组上半：项目结构、路由、原生 UI、Expo UI、数据获取、Tailwind、DOM、examples 范例库。
-->

---
layout: two-cols
layoutClass: gap-8
---

# Framework 技能（下）

<v-clicks>

- **web-to-native** Web 应用迁原生
- **module** Expo Modules API 原生模块
- **brownfield** 塞进已有原生 app
- **dev-client** 开发客户端

</v-clicks>

::right::

<v-clicks>

- **app-clip** iOS App Clip 目标
- **upgrade** 升 SDK / 修依赖
- **skill-feedback** 遥测反馈（默认关）

</v-clicks>

<div v-click class="mt-4 text-sm opacity-80">
本地开发免费；<b>dev-client</b> 的 EAS/TestFlight 分发是付费步骤。
</div>

<style>
h1 { background: linear-gradient(45deg, #000020 10%, #4630EB 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Framework 组下半：Web 迁原生、原生模块、brownfield、开发客户端、App Clip、升级、遥测反馈。dev-client 本地免费，云分发付费。
-->

---
transition: fade-out
---

# EAS 服务技能（付费）

| 技能 | 用来做 |
| --- | --- |
| `eas-app-stores` | 生产构建 + 上 App Store/Play/TestFlight |
| `eas-hosting` | 部署 Expo 网站 + Router API 路由 |
| `eas-workflows` | EAS Workflow YAML、CI/CD |
| `eas-observe` | 启动/导航/自定义事件性能观测 |
| `eas-update-insights` | OTA 更新健康：崩溃率、embedded/OTA |
| `eas-simulator` | 云上远程 iOS/Android 模拟器 |

<div v-click class="mt-3 text-center text-sm opacity-80">
用付费 EAS，消耗构建分钟；上架还需付费 Apple / Google 账号。
</div>

<style>
h1 { background: linear-gradient(45deg, #000020 10%, #4630EB 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Services 组六个技能：上架、托管、工作流、观测、更新健康、云模拟器。都用付费 EAS，消耗构建分钟，上架还需付费开发者账号。
-->

---
transition: fade-out
---

# eas-hosting：Web + API 路由

API 路由放 `app` 目录、`+api.ts` 后缀，按 HTTP 方法导出

<div v-click>

```ts
// app/api/hello+api.ts  →  GET /api/hello
export function GET(request: Request) {
  return Response.json({ message: "Hello from Expo!" });
}
```

</div>

<div class="grid grid-cols-2 gap-6 mt-4 text-sm">
<div v-click>

**该用 API 路由**

- 服务端密钥 / 数据库直查
- 第三方 API 代理（藏 key）
- Webhook / 服务端校验 / 限流

</div>
<div v-click>

**不该用**

- 数据已公开 → 直接 fetch
- 要实时 → WebSocket
- 简单 CRUD → Supabase/Convex

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #000020 10%, #4630EB 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
eas-hosting 部署 Web 和 API 路由到 Cloudflare Workers。API 路由用 +api.ts 后缀按方法导出。技能给了明确的该用/不该用清单：密钥、代理、Webhook 该用；数据公开、实时、简单 CRUD 不该用。
-->

---
layout: two-cols
layoutClass: gap-8
---

# eas-workflows / update-insights

**eas-workflows** CI/CD

- 放 `.eas/workflows/*.yml`
- 顶层键：`name` / `on` / `jobs`
- 表达式 <code v-pre>${{ }}</code>
- **别靠记忆**——先拉 JSON Schema 校验

::right::

**eas-update-insights** OTA 健康

```bash
eas update:insights <groupId>
eas channel:insights \
  --channel production
```

- 崩溃率、启动数、payload
- embedded vs OTA 用户分布
- `--json` 给 CI 加门禁

<style>
h1 { background: linear-gradient(45deg, #000020 10%, #4630EB 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
eas-workflows 帮写 CI/CD YAML，强调别靠记忆、先拉 JSON Schema 校验。update-insights 查 OTA 更新的崩溃率、启动数、embedded 与 OTA 分布，可给 CI 加健康门禁。
-->

---
layout: two-cols
layoutClass: gap-8
---

# expo-router / expo-native-ui

**expo-router** 导航

- 文件式路由、`Link`、native Stack
- 模态 / 表单 sheet / NativeTabs
- headers / toolbar / 搜索栏
- 反模式：`app/` 禁 co-locate 组件

::right::

**expo-native-ui** 原生观感

- 语义色、原生控件、SF Symbols
- Reanimated 动画
- blur / 液态玻璃 / 渐变
- 存储：SQLite / SecureStore
- **先试 Expo Go**，需原生代码再自定义构建

<style>
h1 { background: linear-gradient(45deg, #000020 10%, #4630EB 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
expo-router 管导航：文件式路由、Link、Stack、NativeTabs、搜索栏，强调 app 目录不能 co-locate 组件。native-ui 管原生观感样式：语义色、SF Symbols、动画、视觉效果，强调先试 Expo Go。
-->

---
transition: fade-out
---

# expo-dom：把 Web 代码带进原生

`'use dom';` 指令——Web 代码在原生 webview 里逐字运行

<div v-click>

```tsx
// components/web-chart.tsx
"use dom";
import { LineChart } from "recharts"; // Web-only 库直接用

export default function WebChart({ data }) {
  return <LineChart data={data}>{/* ... */}</LineChart>;
}
```

</div>

<div v-click class="mt-3 text-sm">

**该用**：Web-only 库（图表/高亮/富文本）、迁移 Web 组件、Canvas/WebGL
**不该用**：原生性能关键（webview 有开销）、简单 UI、`_layout` 文件不能是 DOM 组件

</div>

<style>
h1 { background: linear-gradient(45deg, #000020 10%, #4630EB 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
expo-dom 用 use dom 指令让 Web 代码在原生 webview 里逐字运行，从而直接用 recharts 等 Web-only 库。该用于 Web-only 库和迁移，不该用于原生性能关键处，且 _layout 文件不能是 DOM 组件。
-->

---
layout: center
class: text-center
---

# 技能 ≠ MCP：知识 vs 能力

<div class="grid grid-cols-2 gap-8 mt-4 text-left max-w-4xl mx-auto">
<div v-click>

**Skills（技能）= 怎么做**

聚焦知识：何时用哪个 API、工作流怎么搭、有哪些约束

</div>
<div v-click>

**Expo MCP server = 实际去做**

- 读最新 Expo 文档
- `npx expo install` 装依赖
- 触发/监控 EAS 构建与工作流
- 拉 TestFlight 崩溃数据、截图模拟器

</div>
</div>

<div v-click class="mt-6 text-sm opacity-80">
<code>expo</code> 插件捆绑 MCP 配置，Claude Code / Codex 安装时自动接线。
</div>

<style>
h1 { background: linear-gradient(45deg, #000020 10%, #4630EB 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
技能和 MCP 配套但不同：技能是知识告诉 agent 怎么做，Expo MCP server 给 agent 实际执行能力——读文档、装依赖、触发构建、拉崩溃数据、截图。expo 插件捆绑 MCP，安装自动接线。
-->

---
transition: fade-out
---

# 反模式速记

<v-clicks>

- **`app/` 目录禁 co-locate** 组件/类型/工具——只放路由
- **`_layout` 不能是 DOM 组件**
- **原生性能关键处别用 DOM/webview**——有开销
- **数据已公开别写 API 路由**——直接 fetch
- **别靠记忆写 EAS Workflow**——先拉 JSON Schema 校验
- **macOS 上别为普通「跑模拟器」触发 `eas-simulator`**——那是云/远程场景
- **数据获取避免 axios**——优先 expo/fetch

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #000020 10%, #4630EB 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
技能沉淀的反模式：app 目录不 co-locate、_layout 不能是 DOM、性能关键不用 webview、公开数据不写 API 路由、别靠记忆写 workflow、macOS 别乱触发云模拟器、数据获取避免 axios。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Expo 官方技能集：Framework 组（router/native-ui/dom/module）开源免费、Services 组（build/hosting/workflows/observe/update-insights/simulator）用付费 EAS；Expo 文档/CLI 是事实来源，配套 MCP 让 agent 实际去做。**

<div class="mt-8 opacity-80">
官方出品 · 两组分明 · 事实来源在文档 · 技能 + MCP 配套
</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/expo/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://docs.expo.dev/skills/" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #000020 10%, #4630EB 80%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Expo 官方技能集分两组：Framework 开源免费，Services 用付费 EAS。Expo 文档和 CLI 是事实来源，配套 Expo MCP server 让 agent 实际去做。
-->
