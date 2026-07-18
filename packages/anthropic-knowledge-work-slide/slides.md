---
theme: seriph
background: https://cover.sli.dev
title: Anthropic Knowledge Work Plugins
info: |
  Anthropic 官方知识工作插件集市——把 Claude 变成「角色专家」。
  anthropics/knowledge-work-plugins · 18 目录 · 212 SKILL.md · 11 主推 · Apache 2.0
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Anthropic Knowledge Work Plugins

Anthropic 官方**角色插件集市**——把 Claude 变成「岗位专家」

<div class="pt-6 opacity-80">
anthropics/knowledge-work-plugins · 18 目录 / 212 SKILL.md / 11 主推 · Apache 2.0
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/anthropics/knowledge-work-plugins" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #D97757 10%, #C2410C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Anthropic 官方知识工作插件集市，把 Claude 从通用助手升级成岗位专家——销售、客服、产品、市场、法务、财务、数据、企业搜索、生物科研、插件管理、个人生产力。18 目录、212 个 SKILL.md，11 个主推。
-->

---
transition: fade-out
---

# 定位：角色插件集市

不是单个技能，是「角色全栈」

<v-clicks>

- **是谁**：Anthropic 官方工程团队出品（Apache 2.0）
- **为谁**：Claude Cowork 主场，兼容 Claude Code
- **是什么**：把一个**岗位**所需的 skills + commands + 连接器打包成插件
- **规模**：18 顶层目录 / **212 个 SKILL.md** / **11 个官方主推**

</v-clicks>

<div v-click class="mt-4 text-center text-sm opacity-80">

每个插件 = `.claude-plugin/plugin.json` + `.mcp.json` + `skills/*/SKILL.md`（+ 旧 `commands/*.md`）

</div>

<style>
h1 { background: linear-gradient(45deg, #D97757 10%, #C2410C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Knowledge Work Plugins 是 Anthropic 官方的角色插件集市。每个插件把一个岗位所需的技能、slash 命令、外部工具连接器打包。纯文件、零构建、零基础设施。
-->

---
transition: fade-out
---

# 安装

Cowork 与 Claude Code 两条路

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**Cowork**（主战场）

```text
访问 claude.com/plugins
→ 一键装
```

</div>
<div v-click>

**Claude Code**

```bash
# 1. 加集市
claude plugin marketplace add \
  anthropics/knowledge-work-plugins

# 2. 装某个插件
claude plugin install sales@knowledge-work-plugins
```

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

装后自动激活——skills 按相关性触发、commands 显式调用（`/sales:call-prep`、`/data:write-query`）

</div>

<style>
h1 { background: linear-gradient(45deg, #D97757 10%, #C2410C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
两条路：Cowork 在 claude.com/plugins 一键装；Claude Code 先 marketplace add 再 plugin install。装完自动激活。
-->

---
transition: fade-out
---

# 11 个官方主推

按角色覆盖知识工作

<div class="grid grid-cols-2 gap-4 mt-2 text-sm">

- **productivity** 任务/日历
- **sales** 客户/通话/battlecard
- **customer-support** 工单分流/KB
- **product-management** PRD/路线图
- **marketing** 内容/活动/品牌
- **legal** 合同/NDA/合规
- **finance** 凭证/对账/财报
- **data** SQL/统计/dashboard
- **enterprise-search** 跨工具搜索
- **bio-research** nf-core 流水线
- **cowork-plugin-management** 元插件

</div>

<div v-click class="mt-3 text-center text-xs opacity-80">

扩展层：partner-built（71）/ small-business（31）/ operations / human-resources / design / engineering / pdf-viewer

</div>

<style>
h1 { background: linear-gradient(45deg, #D97757 10%, #C2410C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
11 个官方主推插件按角色覆盖知识工作。partner-built / small-business / operations / human-resources / design / engineering / pdf-viewer 是仓库自带的扩展层。
-->

---
transition: fade-out
---

# 客服：ticket-triage 6 步分流

P1-P4 SLA 明确

<v-clicks>

1. **解析问题** —— 症状、客户背景、紧急度、情绪
2. **分类 + 优先级** —— 9 类 × P1-P4
3. **查重** —— 支持平台、KB、项目追踪器
4. **路由** —— Tier 1/2、Engineering、Product、Security、Billing
5. **输出 triage 报告** —— 含建议首响应模板
6. **提下一步** —— 起草回复 / 升级 / 沉淀 KB

</v-clicks>

<div v-click class="mt-3 text-center text-sm opacity-80">

P1 1h 响应 · P2 4h · P3 1 工作日 · P4 2 工作日

</div>

<style>
h1 { background: linear-gradient(45deg, #D97757 10%, #C2410C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
客服 ticket-triage 是工单分流的标准范式，6 步：解析、分类优先级、查重、路由、出报告、提下一步。P1-P4 SLA 明确：P1 一小时响应、P4 两个工作日。
-->

---
transition: fade-out
---

# 数据：SQL 跨 5 方言

PG / Snowflake / BigQuery / Redshift / Databricks

| 方言 | 时间示例 | 性能要点 |
| --- | --- | --- |
| PostgreSQL | `DATE_TRUNC('month', x)` | 索引、`EXISTS` |
| Snowflake | `DATEADD(day, 7, x)` | 聚类键、`RESULT_SCAN` |
| BigQuery | `DATE_ADD(x, INTERVAL 7 DAY)` | 分区/聚类、按字节计费 |
| Redshift | `DATEADD(day, 7, x)` | DISTKEY/SORTKEY |
| Databricks | `DATE_ADD(x, 7)`、Delta `MERGE` | `OPTIMIZE`/`ZORDER` |

<div v-click class="mt-3 text-center text-sm opacity-80">

通用模式：窗口函数 · CTE 多步 · cohort 留存 · funnel 漏斗 · `ROW_NUMBER` 去重

</div>

<style>
h1 { background: linear-gradient(45deg, #D97757 10%, #C2410C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
data 插件的 sql-queries 是跨方言纯知识技能，覆盖五大仓库的时间、字符串、JSON、性能提示，以及窗口、CTE、留存、漏斗、去重等通用模式。
-->

---
transition: fade-out
---

# 生物科研：nextflow-development

跑 nf-core 三流水线（prototype，需自验）

| 数据 | Pipeline | 版本 | 目标 |
| --- | --- | --- | --- |
| RNA-seq | `rnaseq` | 3.22.2 | 基因表达 |
| WGS/WES | `sarek` | 3.7.1 | 变异检测 |
| ATAC-seq | `atacseq` | 2.1.2 | 染色质可及性 |

<div v-click class="mt-3">

**六步**：GEO/SRA 拉数据 → 环境检查（Docker / Nextflow ≥ 23.04 / Java ≥ 11）→ 选流水线 → 跑 test profile → 配置基因组 + `-resume` → 校验 multiqc 报告

</div>

<div v-click class="mt-2 text-xs opacity-80">

面向**无生信背景**的科研人员；Anthropic 不保证输出准确性，需自验。

</div>

<style>
h1 { background: linear-gradient(45deg, #D97757 10%, #C2410C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
bio-research 的 nextflow-development 面向没有生信背景的科研人员，跑 nf-core 的 rnaseq、sarek、atacseq 三大流水线。六步从 GEO/SRA 到 multiqc 报告。仓库明确是 prototype，需自验。
-->

---
transition: fade-out
---

# 插件管理：create-cowork-plugin

5 阶段对话造一个 `.plugin`

<v-clicks>

1. **Discovery** —— 做什么、给谁、是否接外部
2. **Component Planning** —— 要哪些 skills/agents/hooks/MCP
3. **Design & Clarifying** —— 逐组件细化（触发短语、工具权限、鉴权）
4. **Implementation** —— 目录 + `plugin.json` + 各组件 + README
5. **Review & Package** —— `claude plugin validate` + 打 `.plugin`

</v-clicks>

<div v-click class="mt-3 text-center text-sm opacity-80">

**Skills 是给 Claude 的指令，不是给用户的文档**——动词开头；细节放 `references/`；路径用 `${CLAUDE_PLUGIN_ROOT}`

</div>

<style>
h1 { background: linear-gradient(45deg, #D97757 10%, #C2410C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
create-cowork-plugin 用对话引导从零造插件：发现、组件规划、设计、实现、审阅打包五阶段。Skills 写成给 Claude 的指令、动词开头、细节放 references、路径用 CLAUDE_PLUGIN_ROOT。
-->

---
transition: fade-out
---

# 反模式与边界

不要这样用

<v-clicks>

- **把插件当 prompt 模板** —— 它是角色全栈，只改 prompt 丢上下文
- **连接器不配凭据** —— `.mcp.json` 写了但没环境变量 → 连不上
- **改 commands 旧插件不迁 skills** —— 新插件应 `skills/*/SKILL.md`（支持渐进披露）
- **`~~category` 占位符不写 CONNECTORS.md** —— 对外分发才有必要用
- **把 partner-built 当 Anthropic 官方** —— 扩展层，质量与官方 11 不等
- **bio-research 直上生产** —— prototype，必须自验

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #D97757 10%, #C2410C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
反模式：把插件当 prompt 模板、连接器不配凭据、改旧 commands 不迁 skills、用占位符不写 CONNECTORS.md、把 partner-built 当官方、bio-research 直上生产。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Anthropic 官方 11 主推插件——把 Claude 变成岗位专家（客服/数据/生科/插件管理…）；纯文件 + MCP 连接器 + slash 命令；Cowork 一键装、Claude Code marketplace 装。**

<div class="mt-8 opacity-80">

官方沉淀 · 角色全栈 · 自动激活 · 跨运行时 · Apache 2.0

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/anthropics/knowledge-work-plugins" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://claude.com/plugins" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #D97757 10%, #C2410C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Anthropic 官方 11 主推插件，把 Claude 变成岗位专家；纯文件 + MCP 连接器 + slash 命令；Cowork 一键装、Claude Code marketplace 装。
-->
