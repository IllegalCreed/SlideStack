---
theme: seriph
background: https://cover.sli.dev
title: Firebase Agent Skills
info: |
  Firebase（Google）官方 AI agent 技能集：setup / auth / Firestore / Hosting /
  AI Logic（Gemini）/ SQL Connect / 安全规则审计。firebase/agent-skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Firebase Agent Skills

Firebase 官方技能集——让 agent **照官方来**用 Firebase

<div class="pt-6 opacity-80">
firebase/agent-skills · 11 skills · setup / auth / Firestore / AI Logic · Apache-2.0
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/firebase/agent-skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #FFA000 10%, #FFCA28 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Firebase Agent Skills 是 Firebase（Google）官方出品的一组 AI agent 技能，把「如何正确地用 Firebase」写成 agent 可读的官方工作流，Apache-2.0。
-->

---
transition: fade-out
---

# 它解决什么问题

agent 对 Firebase 的「内部记忆」常过时或含糊

<v-clicks>

- 用已下线的 Gemini 模型名（`gemini-2.0-flash`）
- 建议裸 `firebase` 命令、版本漂移
- 写出不安全的 Firestore 规则

</v-clicks>

<div v-click class="mt-6 text-center">

**Firebase Agent Skills** 把官方的**工作流（CUJ）+ 安全规则 + 最佳实践**打包成 11 个技能——agent「照官方来」而非「凭印象猜」。

</div>

<style>
h1 { background: linear-gradient(45deg, #FFA000 10%, #FFCA28 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
痛点：agent 凭记忆用 Firebase 容易过时出错。这组官方技能把 CUJ、安全规则、最佳实践打包，让 agent 照官方来。
-->

---
transition: fade-out
---

# 安装：一条命令，跨 agent

```bash
npx skills add firebase/agent-skills

# 或按 agent 环境安装
gemini extensions install https://github.com/firebase/agent-skills
claude plugin marketplace add firebase/agent-skills
codex plugin marketplace add firebase/agent-skills
```

<div v-click class="mt-4 text-center text-sm opacity-80">

跨 Claude Code / Cursor / Codex / Gemini CLI / Antigravity / Android Studio。装后任务匹配**自动激活**。

</div>

<style>
h1 { background: linear-gradient(45deg, #FFA000 10%, #FFCA28 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
一条 npx skills add firebase/agent-skills 装好，也支持 Gemini/Claude/Codex 各自的插件方式，跨多种 agent，装后自动激活。
-->

---
transition: fade-out
---

# 11 个技能，两条主线

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**搭建型（10 个）**

- `firebase-basics` 入口/CLI 原则
- `auth-basics` 认证
- `firestore` · `data-connect` 数据
- `hosting` · `app-hosting` 部署
- `ai-logic-basics` Gemini AI
- `crashlytics` · `remote-config`
- `xcode-project-setup` iOS

</div>
<div v-click>

**审计型（1 个）**

- `security-rules-auditor`

<div class="mt-2 text-sm opacity-80">

不写代码，当「安全评审器」——红队视角审 Firestore 规则，1–5 评分产 JSON。

</div>

</div>
</div>

<div v-click class="mt-3 text-center text-sm opacity-70">

装：`npx skills add firebase/agent-skills`

</div>

<style>
h1 { background: linear-gradient(45deg, #FFA000 10%, #FFCA28 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
11 技能分两类：搭建型 10 个覆盖 setup/auth/数据/部署/AI/iOS，审计型 1 个是安全规则评审器。
-->

---
transition: fade-out
---

# firebase-basics：一切的起点

套件入口——定义贯穿所有技能的原则

<v-clicks>

- **CLI 一律 `npx`**：`npx -y firebase-tools@latest`，永远最新，绝不用裸 `firebase`
- **优先官方知识**：先查 `developerknowledge_search_documents` MCP
- **用 MCP 工具**：读日志/跑查询用 Firebase MCP Server，而非直接 API
- **程序化拉配置**：`apps:sdkconfig` 取 `google-services.json`，不让用户去 Console

</v-clicks>

<div v-click>

```bash
npx -y firebase-tools@latest login             # 无浏览器加 --no-localhost
npx -y firebase-tools@latest use <PROJECT_ID>  # 设活动项目
```

</div>

<style>
h1 { background: linear-gradient(45deg, #FFA000 10%, #FFCA28 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
firebase-basics 是入口，定了四条原则：CLI 一律 npx、优先官方知识、用 MCP 工具、程序化拉配置文件。
-->

---
transition: fade-out
---

# firebase-auth-basics：认证

<div class="grid grid-cols-2 gap-6 mt-2">
<div>

**身份提供商**

- 邮箱密码 · 匿名
- 联合：Google / GitHub / Apple…
- 电话短信 · 自定义

<div class="text-sm opacity-80 mt-1">Google Sign In 是推荐默认</div>

**令牌**

- ID Token（JWT，1h）
- Refresh Token（长期换新）

</div>
<div v-click>

**关键工作流**

CLI 只能启 Google / 匿名 / 邮箱密码，其它去 Console。配 `firebase.json` 后**必须部署**：

```bash
deploy --only auth
```

<div class="text-sm opacity-80 mt-2">

⚠️ 不部署 → OAuth 客户端不生成，Google 登录失败

</div>

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #FFA000 10%, #FFCA28 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
认证：多种提供商，Google Sign In 推荐默认；ID Token + Refresh Token。CLI 只能启三种，改 firebase.json 后必须 deploy --only auth。
-->

---
transition: fade-out
---

# firebase-firestore：先识别 edition

动数据模型/规则前，**必须先识别实例 edition**

```bash
npx -y firebase-tools@latest firestore:databases:list
npx -y firebase-tools@latest firestore:databases:get <database-id>
```

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**STANDARD**

→ 走 `references/standard/`

</div>
<div v-click>

**ENTERPRISE / native**

→ 走 `references/enterprise/`
原生全文搜索 + 关系 join

</div>
</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

没实例 / 要新建 → 默认建 Enterprise 版，先 `firestore:locations` 选位置

</div>

<style>
h1 { background: linear-gradient(45deg, #FFA000 10%, #FFCA28 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Firestore 第一铁律：动手前先 list/get 识别 edition，STANDARD 与 Enterprise 走不同 references。要新建默认建 Enterprise。
-->

---
transition: fade-out
---

# firebase-ai-logic-basics：客户端直连 Gemini

无需自建后端，客户端 SDK 直接调 Gemini（前身 Vertex AI for Firebase）

| Provider | 定位 | 计费 |
| --- | --- | --- |
| **Gemini Developer API** | 原型 / **默认** | 免费层 + 按量 |
| **Vertex AI Gemini API** | 企业级规模化 | 需 Blaze |

<div v-click class="mt-3">

**能力**：多模态（图/音/视频/PDF）· 流式 `generateContentStream` · 多轮 `startChat` · 结构化输出 JSON · Nano Banana 出图 · Search Grounding

</div>

<style>
h1 { background: linear-gradient(45deg, #FFA000 10%, #FFCA28 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
AI Logic 让客户端直连 Gemini，默认 Gemini Developer API（免费层），企业规模用 Vertex AI（需 Blaze）。能力涵盖多模态、流式、多轮、结构化输出、出图、搜索接地。
-->

---
transition: fade-out
---

# AI Logic：两个必做动作

```bash
npx -y firebase-tools@latest init ailogic
# ↑ 供给后端，自动启用 Gemini Developer API
```

<v-clicks>

- ⚠️ **必须 `init ailogic`**：不跑它，各平台都 `PERMISSION_DENIED`（`flutterfire configure` 只配客户端）
- ⚠️ **必配 App Check**：否则未授权客户端盗用你的 API 配额
- 用 **Remote Config 动态改模型名**，别硬编码——旧模型会被下线

</v-clicks>

<div v-click class="mt-3 text-center text-sm opacity-70">

平台：Android(Kotlin/Java) · iOS(Swift) · Web(JS) · Flutter(Dart) · Unity(C#)

</div>

<style>
h1 { background: linear-gradient(45deg, #FFA000 10%, #FFCA28 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
AI Logic 两个必做：必须 init ailogic 供给后端否则 PERMISSION_DENIED；必配 App Check 防盗用配额。模型名用 Remote Config 动态管理。
-->

---
transition: fade-out
---

# firebase-data-connect：SQL Connect

关系型后端 = Cloud SQL for PostgreSQL + GraphQL + 类型安全 SDK（原名 Data Connect）

| 策略 | 何时 | 类型安全 |
| --- | --- | --- |
| **Native GraphQL** | 默认，几乎所有场景 | ✅ schema 强约束 |
| **Native SQL** | PostGIS/窗口函数等高级 | ❌ 原始 SQL |

```bash
init dataconnect          # 初始化
dataconnect:compile        # 校验 schema/operations
dataconnect:sdk:generate   # 生成 JS/Kotlin/Swift/Dart SDK
```

<div v-click class="text-sm opacity-80">

授权 secure by default：`@auth(level:)`（PUBLIC/USER/NO_ACCESS）+ `@check` / `@redact`

</div>

<style>
h1 { background: linear-gradient(45deg, #FFA000 10%, #FFCA28 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
SQL Connect（原 Data Connect）：PostgreSQL + GraphQL + 类型安全 SDK。默认 Native GraphQL 类型安全，高级才用 Native SQL。授权 secure by default 用 @auth。
-->

---
transition: fade-out
---

# security-rules-auditor：红队审计

扮演渗透测试者，主动找「墙上的洞」

<v-clicks>

- **更新绕过**：能否先建合法文档再 update 成恶意状态（改 role）？
- **权威来源**：敏感字段（`role`/`isAdmin`）是否依赖用户提供的 `request.resource.data`？
- **存储滥用**：无长度/大小限制 = DoS 风险
- **字段级 ≠ 身份级**：`hasOnly()`/`diff()` 只限「改哪些」，不限「谁能改」

</v-clicks>

<div v-click class="mt-3 text-center text-sm opacity-80">

评分 **1（严重越权）→ 5（严格归属+类型校验）**，返回 `{ score, summary, findings }` JSON

</div>

<style>
h1 { background: linear-gradient(45deg, #FFA000 10%, #FFCA28 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
唯一的纯审计技能，红队视角查更新绕过、权威来源、DoS、字段级 vs 身份级安全，1-5 评分产 JSON 报告。
-->

---
transition: fade-out
---

# Hosting vs App Hosting

| 维度 | Hosting（Classic） | App Hosting |
| --- | --- | --- |
| 适合 | 静态站 / 简单 SPA | Next.js / Angular |
| 渲染 | 无 SSR | SSR / ISR |
| 流程 | CLI 掌控 | git push to deploy |
| 计费 | 免费可用 | 需 **Blaze** |

<div v-click class="mt-4 text-center">

```bash
npx -y firebase-tools@latest emulators:start --only hosting   # localhost:5000
```

</div>

<style>
h1 { background: linear-gradient(45deg, #FFA000 10%, #FFCA28 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
两种托管：静态/SPA 用 Classic Hosting，Next.js/Angular SSR 用 App Hosting（需 Blaze）。本地 emulators:start 调试。
-->

---
transition: fade-out
---

# Genkit 与 Firebase MCP Server

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**Genkit（AI 框架）**

- SDK：**dart / go / js**
- 更复杂的 AI 编排
- 独立仓库，按需装：

```bash
npx skills add genkit-ai/skills
```

</div>
<div v-click>

**Firebase MCP Server**

- `firebase_get_environment` 看项目
- `firebase_read_resources` 读 `firebase://`
- `developerknowledge_search_documents`
- 启动 `firebase-tools@latest mcp`

</div>
</div>

<div v-click class="mt-3 text-center text-sm opacity-70">

技能反复强调：**用 MCP Server 工具，而非直接 API 调用**

</div>

<style>
h1 { background: linear-gradient(45deg, #FFA000 10%, #FFCA28 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Genkit 是 Firebase 的 AI 框架 SDK 覆盖 dart/go/js，独立仓库按需装。Firebase MCP Server 提供环境/资源/知识工具，技能强调用 MCP 而非直接 API。
-->

---
transition: fade-out
---

# 边界与反模式

<v-clicks>

- ❌ 裸 `firebase` 命令 → ✅ 一律 `npx -y firebase-tools@latest`
- ❌ AI Logic 只 `flutterfire configure` → ✅ 必须 `init ailogic`
- ❌ 改 auth 不部署 → ✅ `deploy --only auth`
- ❌ Firestore 规则只 `hasOnly()` → ✅ 加 `resource.data.uid == request.auth.uid`
- ❌ iOS 手改 `.pbxproj` / 用 Ruby → ✅ 文件夹同步 + Swift + Firebase `-ObjC`

</v-clicks>

<div v-click class="mt-3 text-center text-sm opacity-70">

它是**指令集**，不是运行时——干活仍靠 CLI + MCP + 你的 Google 账号；部分能力需 Blaze。

</div>

<style>
h1 { background: linear-gradient(45deg, #FFA000 10%, #FFCA28 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
反模式清单：裸 firebase、AI Logic 不 init、auth 不部署、Firestore 只限字段不限身份、iOS 手改 pbxproj。它是指令集不是运行时。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Firebase（Google）官方 11 技能：`firebase-basics` 定 npx 原则、auth/firestore/hosting 搭建、`ai-logic` 直连 Gemini（Genkit 补 AI 编排）、`security-rules-auditor` 红队审 Firestore——让 agent 照官方来。**

<div class="mt-8 opacity-80">

Google 官方 · 11 技能 · CLI 铁律 · AI Logic · 安全审计 · Apache-2.0

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/firebase/agent-skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://firebase.google.com/docs" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #FFA000 10%, #FFCA28 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Firebase 官方 11 技能：basics 定原则、auth/firestore/hosting 搭建、ai-logic 直连 Gemini、security-rules-auditor 红队审计，让 agent 照官方来，Apache-2.0。
-->
