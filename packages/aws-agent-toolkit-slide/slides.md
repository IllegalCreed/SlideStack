---
theme: seriph
background: https://cover.sli.dev
title: AWS Agent Toolkit
info: |
  AWS 官方的 AI 编码 agent 工具箱：Plugins + Skills + Rules + AWS MCP Server。
  aws/agent-toolkit-for-aws（GA，Apache-2.0）。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# AWS Agent Toolkit

AWS 官方的 **AI 编码 agent 工具箱**——工具 + 知识 + 护栏

<div class="pt-6 opacity-80">
aws/agent-toolkit-for-aws · Plugins / Skills / Rules / MCP Server · GA · Apache-2.0
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/aws/agent-toolkit-for-aws" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #FF9900 10%, #EC7211 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
AWS Agent Toolkit 是 AWS 官方出品的、给 AI 编码 agent 用的 AWS 工具箱：把在 AWS 上构建部署运维所需的工具、知识、护栏打包，让 Claude Code、Codex、Cursor、Kiro 安全操作 AWS。
-->

---
transition: fade-out
---

# 是什么：官方 GA，替代社区 awslabs

<div class="grid grid-cols-2 gap-6 mt-6">
<div v-click>

**定位**

- AWS **官方**支持，状态 **GA**
- 给 Claude Code / Codex / Cursor / Kiro 用
- 工具 + 知识 + **护栏（guardrails）**

</div>
<div v-click>

**替代 awslabs**（多三样）

- IAM condition keys **区分 agent/人类动作**
- 每请求 CloudWatch 指标 + CloudTrail 审计
- 技能经**端到端评测**

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">

社区 awslabs 仍维护，官方会逐步把最好的迁进 Toolkit。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF9900 10%, #EC7211 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
2025 年 AWS 以 awslabs 名义发过一批 MCP/skills/plugins，Toolkit 是它们的官方继任者，多了三样护栏能力：区分 agent 与人类动作的 IAM 条件键、每请求监控审计、技能端到端评测。
-->

---
transition: fade-out
---

# 四位一体

<div class="grid grid-cols-2 gap-4 mt-6">
<div v-click class="p-3 rounded border border-orange-300">

**Plugins（4 个）**
一键装 = MCP 配置 + 技能。Claude Code / Codex / Cursor

</div>
<div v-click class="p-3 rounded border border-orange-300">

**Skills（≈83 个）**
按需加载的指令 + 参考资料包，只取相关的

</div>
<div v-click class="p-3 rounded border border-orange-300">

**Rules files**
项目级规则：优先 MCP / 先发现技能 / 先查文档

</div>
<div v-click class="p-3 rounded border border-orange-300">

**AWS MCP Server**
托管网关，300+ 服务 + 沙箱脚本 + 文档搜索

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #FF9900 10%, #EC7211 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Toolkit 是四位一体：Plugins 一键装、Skills 按需加载的技能库、Rules 项目级规则、AWS MCP Server 托管的 AWS API 网关。四部分各自可独立用。
-->

---
transition: fade-out
---

# 安装：跨 agent

一件事装技能，可选配 MCP Server：

```bash
aws configure agent-toolkit                             # AWS CLI
/plugin install aws-core@claude-plugins-official         # Claude Code
codex plugin marketplace add aws/agent-toolkit-for-aws   # Codex
npx skills add aws/agent-toolkit-for-aws/skills          # 跨 agent 装技能
```

<v-clicks>

- **Claude Code**：官方市场 `claude-plugins-official` 默认已加，**从 aws-core 开始**
- **Kiro**：`.kiro/settings/mcp.json` 配 MCP Server + `npx skills add`（两步独立）
- **前提**：装 `uv`；调 API/跑脚本需 AWS 凭据（文档搜索、技能发现不需要）

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #FF9900 10%, #EC7211 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
安装核心两件事：装 Plugin/Skills，可选配 AWS MCP Server。Claude Code 官方市场默认已加，从 aws-core 开始。Kiro 两步独立。前提是 uv + AWS 凭据（但文档搜索、技能发现不需要凭据）。
-->

---
transition: fade-out
---

# 技能库：≈83 个，12 组

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**core-skills（18）**

aws-blocks 选型 · aws-cdk · aws-cloudformation · aws-serverless · aws-containers · aws-database · aws-iam · aws-observability · amazon-bedrock · aws-sdk-* · launch-with-aws

</div>
<div v-click>

**specialized-skills（11 组，65）**

database 14 · networking 13 · analytics 10 · serverless 9 · storage 5 · operations 4 · ec2 3 · system-table 3 · migration 2 · security 1 · web-mobile 1

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

**按需加载**：agent 只检索当前任务相关的技能，不塞满上下文。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF9900 10%, #EC7211 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
技能库分两层：core-skills 18 个核心、specialized-skills 11 组 65 个专项，合计约 83 个。核心思想是按需加载——agent 只检索相关技能。注意实际数量会随官方新增增长。
-->

---
transition: fade-out
---

# 4 个 Plugin

| Plugin | 覆盖 |
| --- | --- |
| **aws-core**（start here） | 服务选型、CDK/CFN、serverless、容器、存储、可观测、账单、SDK、部署 |
| **aws-agents** | Bedrock AgentCore 建 agent：Strands/LangGraph、Gateway+MCP、memory、Cedar |
| **aws-data-analytics** | 数据湖/ETL：S3 Tables、Glue、Athena、S3 Vectors 语义搜索 |
| **aws-agents-for-devsecops** | 事件调查、发布评审、漏洞扫描、渗透测试（依赖 DevOps/Security Agent） |

<div v-click class="mt-4 text-center text-sm opacity-80">

Plugin = MCP Server 配置 + 技能，一键装；目前面向 Claude Code / Codex / Cursor。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF9900 10%, #EC7211 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
四个插件：aws-core 核心从它开始、aws-agents 在 Bedrock AgentCore 上建 AI agent、aws-data-analytics 数据湖分析、aws-agents-for-devsecops 安全运维。插件把 MCP 配置和技能打包一键装。
-->

---
transition: fade-out
---

# 架构决策表：aws-containers

「需求 → 推荐服务 → 关键命令」，把架构经验固化成护栏：

| 需求 | 推荐 | 关键 CLI / CDK |
| --- | --- | --- |
| 最简单 HTTP 部署（新用户） | ECS Express Mode | `create-express-gateway-service` |
| Web/worker/批/定时 | ECS on Fargate | `ApplicationLoadBalancedFargateService` |
| GPU 或 >16 vCPU | ECS on EC2 | `ecs.Ec2Service` |
| 调试运行中容器 | ECS Exec | `ecs execute-command` |

<div v-click class="mt-3 text-center text-sm opacity-80">

规则写死：没点名 Kubernetes，**绝不推 EKS**。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF9900 10%, #EC7211 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
架构决策表是技能的一大形态。aws-containers 开头就是一张需求到推荐服务的映射表：简单 HTTP 推 ECS Express Mode，其余推 Fargate，GPU 推 EC2。还写死了一条规则——没点名 Kubernetes 绝不推 EKS。
-->

---
transition: fade-out
---

# 服务对比 / 路由：aws-database

硬护栏 **「STOP — 别用训练知识答」**，改按 registry 路由：

| 子技能 | 触发 | 去哪 |
| --- | --- | --- |
| `select` 选型 | 「用哪个数据库」「我在做…」 | 选完交 `handoff` |
| `handoff` 交接 | 点名服务 + 操作问题 | 加载该服务技能 |
| `report-issue` | 「你选错了」 | 路由报告，不辩护 |

<div v-click class="mt-3 text-sm opacity-80">

覆盖关系型/键值/文档/宽列/图/时序/内存 **15+ 引擎**；每请求只加载 2–3 张知识卡。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF9900 10%, #EC7211 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
aws-database 是服务对比与路由的范例：开头就是 STOP 别用训练知识答，改按子技能 registry 路由——选型走 select、点名服务走 handoff、说选错走 report-issue。覆盖 15+ 数据库引擎，每请求只加载 2 到 3 张知识卡。
-->

---
transition: fade-out
---

# 部署工作流：aws-deployment

**CodeConnections → CodeBuild → CodeDeploy，由 CodePipeline 编排**

| 层 | 服务 | 职责 |
| --- | --- | --- |
| Source | CodeConnections | 鉴权 Git 源、投递代码 |
| Build | CodeBuild | 编译、测试、打包 |
| Deploy | CodeDeploy | 蓝绿/金丝雀/线性流量切换 |
| 编排 | CodePipeline | 串联阶段、审批门 |

<div v-click class="mt-3 text-sm opacity-80">

**Critical 坑**：CodeConnections 必须去控制台完成 OAuth（否则永远 PENDING）；跨账号需 KMS+S3+IAM 三件缺一不可。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF9900 10%, #EC7211 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
部署工作流技能讲服务怎么编排：CodeConnections 到 CodeBuild 到 CodeDeploy，由 CodePipeline 编排。并前置 Critical Warning——CodeConnections 经 CLI 建会一直 PENDING 必须去控制台 OAuth，跨账号需要 KMS、S3、IAM 三件缺一不可。
-->

---
transition: fade-out
---

# 排障：debugging-lambda-timeouts

给**系统化流程**，不是零散提示：

<v-clicks>

- 按固定顺序收集：函数配置 → CloudWatch 指标/日志 → VPC/网络
- → 冷启动模式 → 内存约束 → 下游依赖（有代码再审代码）
- → 编成**带优先级排序的排障报告**

</v-clicks>

<div v-click class="mt-4 text-sm opacity-80">

同类：`troubleshooting-s3-files` · `troubleshooting-efs` · `troubleshooting-application-failures`

</div>

<style>
h1 { background: linear-gradient(45deg, #FF9900 10%, #EC7211 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
排障类技能给的是系统化流程。debugging-lambda-timeouts 按固定顺序收集配置、日志指标、VPC、冷启动、内存、下游依赖，最后编成带优先级排序的报告。同类还有 S3、EFS、应用失败排障。
-->

---
transition: fade-out
---

# AWS MCP Server 能力

<div class="grid grid-cols-2 gap-4 mt-6">
<div v-click class="p-3 rounded border border-orange-300">

**全 API 覆盖**
单一鉴权端点触达 300+ 服务

</div>
<div v-click class="p-3 rounded border border-orange-300">

**沙箱脚本执行**
隔离环境跑 Python 多步操作

</div>
<div v-click class="p-3 rounded border border-orange-300">

**实时文档访问**
搜最新文档/API，**免鉴权**

</div>
<div v-click class="p-3 rounded border border-orange-300">

**企业控制**
CloudWatch + IAM context keys + CloudTrail

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #FF9900 10%, #EC7211 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
AWS MCP Server 提供四样：单一鉴权端点覆盖 300+ 服务、沙箱化 Python 脚本执行、免鉴权的实时文档访问、以及 CloudWatch/IAM/CloudTrail 企业控制。
-->

---
transition: fade-out
---

# 反模式与边界

<v-clicks>

- **别用训练知识答易变事实**：配额/GA/限额/错误码要查文档（STOP 护栏）
- **别沉默产非法配置**：如非法 Fargate CPU/内存组合要告知并纠正
- **优先 IaC**（CDK/CFN），资源名用连字符不用 em dash
- **秘密不直接取值**：先加载 secrets 技能，用运行时解析引用
- **边界**：Plugins 目前限 Claude Code/Codex/Cursor；需 AWS 账号凭据；devsecops 需另设

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #FF9900 10%, #EC7211 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
技能刻意纠正的反模式：别用训练知识答易变的 AWS 事实、别沉默产出非法配置、优先 IaC、资源名不用 em dash、秘密走运行时解析不直接取值。边界：插件限三个 agent、需 AWS 凭据、devsecops 插件需另设。
-->

---
layout: center
class: text-center
---

# 一句话记住

**AWS 官方 agent 工具箱：Plugins + Skills（≈83，按需加载）+ Rules + MCP Server（300+ 服务）；技能内置架构决策表/对比矩阵/部署/排障，带 IAM 区分 + 审计护栏，替代社区 awslabs。**

<div class="mt-8 opacity-80">

官方 GA · 四位一体 · 按需加载 · 决策表护栏 · 企业审计

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/aws/agent-toolkit-for-aws" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://docs.aws.amazon.com/agent-toolkit/latest/userguide/" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #FF9900 10%, #EC7211 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。AWS 官方 agent 工具箱：四位一体，技能约 83 个按需加载，内置架构决策表、对比矩阵、部署、排障，带 IAM 区分 agent 动作和审计护栏，是社区 awslabs 的官方继任者。
-->
