---
theme: seriph
background: https://cover.sli.dev
title: Azure Skills Plugin
info: |
  Microsoft 官方 agent plugin：curated Azure skills + Azure MCP Server + Foundry MCP。
  microsoft/azure-skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Azure Skills Plugin

Microsoft 官方 agent plugin——**一装三层能力**：Azure 专家知识 + 真实执行

<div class="pt-6 opacity-80">
microsoft/azure-skills · skills + Azure MCP + Foundry MCP · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/microsoft/azure-skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #0078D4 10%, #50B0F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Azure Skills Plugin 是 Microsoft 官方的 agent plugin，一装即给 coding agent 三层能力：curated Azure skills、Azure MCP Server、Foundry MCP，让 agent 从给通用云建议升级到真正执行 Azure 工作流。
-->

---
transition: fade-out
---

# 它是什么

<div class="grid grid-cols-2 gap-6 mt-6">
<div v-click>

**定位**

- Microsoft **官方** agent plugin，MIT
- 不是 prompt 包，是**能力层**
- 自 `GitHub-Copilot-for-Azure` 同步
- 多 host：Copilot / Claude Code / Cursor / Codex / Gemini

</div>
<div v-click>

**装之前 vs 装之后**

- 之前：只会给**通用云建议**
- 之后：既懂 Azure，又能用**真实工具执行** Azure 工作流
- 27 个 skill + 200+ MCP 工具

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">

「哪个服务合适、部署前校验什么、该跑哪些工具、护栏是什么」——它把决策和执行都补上。

</div>

<style>
h1 { background: linear-gradient(45deg, #0078D4 10%, #50B0F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Azure 不只是代码问题，更是决策问题。这个 plugin 把 Azure 专家知识和 MCP 执行力打包，装之前 agent 只会给通用建议，装之后能真正做 Azure 工作。
-->

---
transition: fade-out
---

# 为什么不同：三层能力

一次安装，三层对齐

<div class="grid grid-cols-3 gap-4 mt-8">
<div v-click class="p-4 rounded-lg bg-blue-500 bg-opacity-10">

**🧠 大脑**

Azure skills

27 个策展 skill——教 agent 何时用哪个工作流、有哪些护栏

</div>
<div v-click class="p-4 rounded-lg bg-blue-500 bg-opacity-10">

**✋ 双手**

Azure MCP Server

200+ 工具跨 40+ Azure 服务——列资源、查价、看日志、驱动真实工作流

</div>
<div v-click class="p-4 rounded-lg bg-blue-500 bg-opacity-10">

**🤖 AI 专家**

Foundry MCP

Microsoft Foundry——模型发现、部署、agent 工作流

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #0078D4 10%, #50B0F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
三层：skills 是大脑教决策和护栏，Azure MCP 是双手给 200+ 工具的执行力，Foundry MCP 是 AI 专家管 Foundry 场景。plugin 把指导层和执行层对齐在一次安装里。
-->

---
transition: fade-out
---

# 安装：多 host

Claude Code 与 Copilot 装法不同

```bash
# Claude Code —— 从官方市场 claude-plugins-official
/plugin install azure@claude-plugins-official

# GitHub Copilot CLI —— 从 microsoft/azure-skills 市场
/plugin marketplace add microsoft/azure-skills
/plugin install azure@azure-skills

# APM —— 一条命令跨 Copilot / Claude Code / Cursor / Codex / Gemini
apm install microsoft/azure-skills
```

<div v-click class="mt-4 text-sm opacity-80">

前置：Azure 账号 + **Node.js 18+**（`npx` 拉起 MCP）+ Azure CLI `az login`（部署再加 `azd auth login`）。

</div>

<style>
h1 { background: linear-gradient(45deg, #0078D4 10%, #50B0F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
装法按 host 分：Claude Code 从 claude-plugins-official 市场装，Copilot CLI 从 microsoft/azure-skills 市场装，APM 一条命令跨所有 host。前置是 Azure 账号、Node 18+、Azure CLI 登录。
-->

---
transition: fade-out
---

# 大脑：27 个 Azure skill

四大类覆盖 Azure 全生命周期

| 类别 | 代表 skill |
| --- | --- |
| 构建 / 部署 / 演进 | `azure-prepare` `azure-validate` `azure-deploy` `azure-kubernetes` |
| 诊断 / 监控 / 治理 | `azure-diagnostics` `azure-compliance` `azure-quotas` `azure-messaging` |
| 架构 / 成本优化 | `azure-cost` `azure-reliability` `azure-resource-visualizer` `azure-cloud-migrate` |
| 数据 / AI / 身份 | `azure-ai` `azure-storage` `azure-rbac` `entra-app-registration` `microsoft-foundry` |

<div v-click class="mt-4 text-sm opacity-80">

每个 `SKILL.md` 都写了 `WHEN:`（触发词）+ `DO NOT USE FOR:`（边界），agent 据此自动选对 skill。

</div>

<style>
h1 { background: linear-gradient(45deg, #0078D4 10%, #50B0F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
27 个 skill 分四类：构建部署演进、诊断监控治理、架构成本优化、数据 AI 身份平台。每个 SKILL.md 有 WHEN 和 DO NOT USE FOR，让 agent 自动选对。
-->

---
transition: fade-out
---

# 双手：Azure MCP Server

真实执行层

<v-clicks>

- **`npx -y @azure/mcp@latest server start`**——`.mcp.json` 里拉起
- **200+ 结构化工具**，覆盖 **40+ Azure 服务**
- 列资源、查定价、读日志、诊断、驱动真实 Azure 工作流
- 需要 **Node.js 18+**；认证走 `az login` / `azd auth login` / 服务主体 / 托管标识

</v-clicks>

<div v-click class="mt-6 text-center">

验证：问「**List my Azure resource groups.**」应得工具背书的真实响应，而非泛泛而谈。

</div>

<style>
h1 { background: linear-gradient(45deg, #0078D4 10%, #50B0F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Azure MCP Server 是执行层，通过 npx 拉起，提供 200+ 工具跨 40+ 服务，能列资源、查价、看日志。验证时问 list my resource groups，应得真实工具响应。
-->

---
transition: slide-up
layout: two-cols
---

# AI 专家：Foundry MCP

::right::

<div class="pl-4 pt-14">

**`microsoft-foundry` skill + Foundry MCP**

- 模型发现、部署、agent 工作流
- hosted agent 脚手架 / 运行 / 部署
- 批量与持续评估、prompt 优化器
- 模型微调（SFT / DPO / RFT）

<div class="mt-4 text-sm opacity-80">

验证：问「What AI models are available in Microsoft Foundry?」

</div>

</div>

<style>
h1 { background: linear-gradient(45deg, #0078D4 10%, #50B0F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Foundry MCP 是 AI 专家层，通过 microsoft-foundry skill 接入，覆盖 Foundry agent 全生命周期：部署、评估、微调。验证时问 Foundry 里有哪些 AI 模型。
-->

---
transition: fade-out
---

# 部署工作流：带护栏的三段链

`prepare → validate → deploy`，跳步会被拦

```text
azure-prepare     生成 azure.yaml / Bicep / Dockerfile（只在用 azd 时）
      ↓
azure-validate    配置 / IaC / RBAC 校验 → 记 Validation Proof
      ↓           ⛔ 未过 STOP，不许直接 azd up
azure-deploy      执行 azd up / terraform apply（内置错误恢复）
```

<div v-click class="mt-4">

护栏：**所有校验通过前不许置 `Validated`** · **破坏性动作要 `ask_user`** · **别绕过 deploy 手动跑命令**。

</div>

<style>
h1 { background: linear-gradient(45deg, #0078D4 10%, #50B0F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
部署是带强护栏的三段链：prepare 生成 IaC、validate 校验并记 proof、deploy 执行。validate 没过就 STOP，破坏性动作要确认，不许绕过 deploy 手动跑命令。跳步 skill 会拦。
-->

---
transition: fade-out
layout: two-cols
---

# Troubleshooting：诊断类

::right::

<div class="pl-4 pt-10">

**`azure-diagnostics`**

- AppLens / Azure Monitor / KQL 分诊
- App Service 高 CPU、部署失败
- AKS：pod pending、crashloop、node not ready
- 镜像拉取失败、冷启动、健康探针

**`azure-messaging`**

- Event Hubs / Service Bus SDK 排查
- AMQP 断连、message lock lost
- dead letter、session lock expired

</div>

<style>
h1 { background: linear-gradient(45deg, #0078D4 10%, #50B0F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
诊断类两个 skill：azure-diagnostics 借 AppLens 和 Azure Monitor 排查 App Service、AKS、Functions 的线上问题；azure-messaging 专治 Event Hubs 和 Service Bus 的 SDK 疑难。
-->

---
transition: fade-out
---

# Security 与身份

三个身份 skill 各管一块

<v-clicks>

- **`azure-rbac`**——为身份找**最小权限**角色，生成 CLI + Bicep 分配代码
- **`entra-app-registration`**——Entra ID 应用注册、OAuth 2.0、MSAL 集成
- **`entra-agent-id`**——Entra Agent 身份、`fmi_path` / OBO token exchange
- **`azure-compliance`**——azqr 合规审计 + Key Vault 过期检查

</v-clicks>

<div v-click class="mt-4 text-sm opacity-80">

各有 `DO NOT USE FOR`：资源 RBAC 用 rbac、应用注册用 app-registration、agent 身份用 agent-id，互相指路。

</div>

<style>
h1 { background: linear-gradient(45deg, #0078D4 10%, #50B0F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
安全与身份：azure-rbac 找最小权限角色、entra-app-registration 管应用注册、entra-agent-id 管 agent 身份、azure-compliance 跑合规审计。三个身份 skill 用 DO NOT USE FOR 互相划界。
-->

---
transition: fade-out
---

# Architecture：架构类

从工作负载到 IaC 与架构图

| skill | 干什么 |
| --- | --- |
| `azure-enterprise-infra-planner` | 企业级 IaC（落地区 / hub-spoke / WAF 对齐） |
| `azure-resource-visualizer` | 资源组 → Mermaid 架构图 |
| `azure-kubernetes` | 生产级 AKS（SKU / 网络 / VPA） |
| `airunway-aks-setup` | AKS 上 GPU 推理（KAITO / vLLM） |
| `azure-aigateway` | APIM 作 AI 网关（语义缓存 / 限流 / 内容安全） |

<style>
h1 { background: linear-gradient(45deg, #0078D4 10%, #50B0F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
架构类：infra-planner 从描述生成企业级 IaC 并对齐 WAF、resource-visualizer 画 Mermaid 架构图、azure-kubernetes 规划生产 AKS、airunway 搭 AKS 上的 GPU 推理、aigateway 把 APIM 变 AI 网关。
-->

---
transition: fade-out
---

# 推理 + 执行：skill 与 MCP 如何配合

以 `azure-rbac` 为例

```text
用户：这个托管标识要读 blob，该给什么角色？
  ↓  azure-rbac（推理层）指导步骤：
1. azure__documentation        找匹配的最小内置角色
2. azure__extension_cli_generate  无匹配则造自定义角色 + 生成 CLI
3. azure__bicepschema + bestpractices  产 Bicep 角色分配片段
```

<div v-click class="mt-4 text-center">

**决策靠 skill，取数与生成靠 MCP 工具**——查真实资源状态不靠 skill 编。

</div>

<style>
h1 { background: linear-gradient(45deg, #0078D4 10%, #50B0F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
推理加执行的配合：azure-rbac skill 给决策树，先用 documentation 工具找最小角色，找不到再用 cli_generate 造自定义角色，最后用 bicepschema 生成分配片段。决策靠 skill，取数靠 MCP。
-->

---
transition: fade-out
---

# 多 host · 主权云 · 认证

| 维度 | 要点 |
| --- | --- |
| 多 host | Copilot（VS Code/CLI/IntelliJ）· Claude Code · Cursor · Codex · Gemini |
| 认证 | `az login`（推荐）· `azd auth login`（部署）· 服务主体 · 托管标识 |
| 主权云 | `--cloud AzureChinaCloud` / `AzureUSGovernment` |
| 遥测 | `export AZURE_MCP_COLLECT_TELEMETRY=false` 关闭 |

<div v-click class="mt-4 text-sm opacity-80">

同一份 Azure 能力在各 host 通用；主权云要先 `az cloud set` 切环境再登录。

</div>

<style>
h1 { background: linear-gradient(45deg, #0078D4 10%, #50B0F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
多 host 通用、认证走 az login 或服务主体或托管标识、主权云用 cloud 参数接中国云和美国政府云、遥测可一行关闭。
-->

---
transition: fade-out
---

# 边界与反模式

<v-clicks>

- **强绑 Azure**：只服务 Azure / Foundry，非跨云通用工具
- **执行依赖真实凭据**：未 `az login` 只剩「解释」层
- **别跳过 validate 直接部署**：所有检查必须通过，不许带失败部署
- **别混淆 prepare 与 deploy**：建新应用用 prepare，部署已备好的用 deploy
- **别让 skill「猜」资源状态**：真实清单 / 定价 / 日志要用 MCP 工具取

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #0078D4 10%, #50B0F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
边界与反模式：强绑 Azure、执行要真实凭据、别跳过 validate、别混淆 prepare 和 deploy、别让 skill 猜资源状态而要用 MCP 工具取。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Microsoft 官方 plugin，一装三层：27 个 Azure skills（大脑 + 护栏）+ Azure MCP（双手，200+ 工具/40+ 服务）+ Foundry MCP（AI 专家）——让 agent 真正执行 Azure 工作流。**

<div class="mt-8 opacity-80">

官方能力层 · 推理 + 执行 · prepare→validate→deploy 带护栏 · 多 host · MIT

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/microsoft/azure-skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://microsoft.github.io/azure-skills/" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #0078D4 10%, #50B0F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Microsoft 官方 plugin 一装三层：Azure skills 是大脑加护栏、Azure MCP 是双手 200+ 工具、Foundry MCP 是 AI 专家，让 agent 真正执行 Azure 工作流。
-->
