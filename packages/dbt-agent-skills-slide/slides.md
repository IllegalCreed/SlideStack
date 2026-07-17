---
theme: seriph
background: https://cover.sli.dev
title: dbt Agent Skills
info: |
  dbt Labs 官方 agent 技能集：分析工程、语义层 MetricFlow、dbt Mesh、迁移到 Fusion。
  dbt-labs/dbt-agent-skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# dbt Agent Skills

dbt Labs 官方技能集——**用 dbt 干活**的专家知识，agent 自动加载

<div class="pt-6 opacity-80">
dbt-labs/dbt-agent-skills · 分析工程 / 语义层 / Mesh / 迁移 · Apache-2.0
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/dbt-labs/dbt-agent-skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #FF694A 10%, #FFB199 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
dbt Agent Skills 是 dbt Labs 官方的 agent 技能集，把用 dbt 做分析工程、语义层、Mesh 治理、迁移的专家知识打包成可按需调用的技能。
-->

---
transition: fade-out
---

# 12 技能，3 组

dbt Labs 官方沉淀，按需激活

<div class="grid grid-cols-3 gap-4 mt-6">
<div v-click>

**dbt**（9 个）

分析工程 · 单元测试 · 语义层 · Mesh · 平台运维 · MCP · 查文档

</div>
<div v-click>

**dbt-migration**（2 个）

Core → Fusion 迁移 · 跨数据平台迁移

</div>
<div v-click>

**dbt-extras**（1 个）

模型血缘 → Mermaid 图

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">

装后自动激活（多数 `user-invocable: false`）——自然语言描述需求即可。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF694A 10%, #FFB199 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
12 个技能分三组：dbt 组 9 个覆盖分析工程到运维，dbt-migration 组 2 个是一次性迁移，dbt-extras 组 1 个画血缘。装后自动激活。
-->

---
transition: fade-out
---

# 装一条命令

Claude Code 插件市场，或通用 skills CLI

<v-clicks>

- **Claude Code**：`/plugin marketplace add` + `/plugin install`
- **其它 agent**：`npx skills add`（支持 30+ agent）

</v-clicks>

<div v-click>

```bash
# Claude Code
/plugin marketplace add dbt-labs/dbt-agent-skills
/plugin install dbt@dbt-agent-marketplace

# 通用（Vercel Skills CLI）
npx skills add dbt-labs/dbt-agent-skills
```

</div>

<div v-click class="mt-2 text-center text-sm opacity-80">

技能不是 slash 命令——prompt 匹配用例时 agent 自动加载。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF694A 10%, #FFB199 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
装法两条路：Claude Code 用 plugin marketplace，其它 agent 用 npx skills add。装后自动激活，非手动 slash 命令。
-->

---
transition: fade-out
---

# 分析工程：build 而非 run

「run 一下模型」→ 技能推荐 `build`

```bash
dbt build --select stg_orders --quiet \
  --warn-error-options '{"error": ["NoNodesForSelectionCriteria"]}'

dbt show --select stg_orders --limit 10
```

<div v-click class="mt-3 text-center">

`build` = `run` + `test`，立刻抓数据质量问题；开发中 `run` 单跑几乎从不对。**总带 `--select`**，图操作符 `model+`（下游）/ `+model`（上游）。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF694A 10%, #FFB199 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
running-dbt-commands 的核心约定：即使用户说 run 也用 build，因为 build 等于 run 加 test，能立刻抓数据质量问题。总带 select，用图操作符选下游或上游。
-->

---
transition: fade-out
---

# 单元测试：Model-Inputs-Outputs

给定输入行，期望输出行

```yaml
unit_tests:
  - name: test_zero_drinks
    model: order_items_summary
    given:
      - input: ref('order_items')
        rows: [{ order_id: 76, is_drink_item: false }]
      - input: ref('stg_orders')
        rows: [{ order_id: 76 }]
    expect:
      rows: [{ order_id: 76, count_drink_items: 0 }]
```

<div v-click class="text-center text-sm opacity-80">

只测复杂逻辑（regex/窗口/多分支 case）· `dict` 默认 · 只支持 SQL 模型 · 只在 dev/CI 跑

</div>

<style>
h1 { background: linear-gradient(45deg, #FF694A 10%, #FFB199 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
单元测试在静态输入上验证 SQL 逻辑，结构是模型加 given 输入加 expect 输出。只测复杂逻辑，dict 是默认格式，只支持 SQL 模型，只在开发和 CI 跑。
-->

---
transition: fade-out
---

# 语义层：MetricFlow

4 组件 + 两种 spec

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**四组件**

- semantic model（模型→业务概念）
- entity（粒度键、支持 join）
- dimension（过滤/分组属性）
- metric（业务计算）

</div>
<div v-click>

**两种 spec**

- **latest**：Core 1.12+/Fusion，模型上的 metadata，更简单
- **legacy**：Core 1.6–1.11，顶层资源 + measures

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

验证：`dbt parse` → `mf validate-configs`（读编译后 manifest）

</div>

<style>
h1 { background: linear-gradient(45deg, #FF694A 10%, #FFB199 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
building-dbt-semantic-layer 用 MetricFlow 建四组件：语义模型、实体、维度、指标。两种 spec：latest 更简单支持新版本，legacy 用于老版本。验证先 parse 再 mf validate-configs。
-->

---
transition: fade-out
---

# 5 种 metric 类型

<div class="grid grid-cols-2 gap-x-10 gap-y-3 mt-6">
<div v-click>

**simple** — 直接聚合单列，其它类型的基石

</div>
<div v-click>

**derived** — 多 metric 数学组合（profit = rev − cost）

</div>
<div v-click>

**cumulative** — 运行/至今累计，需 time spine

</div>
<div v-click>

**ratio** — 分子 / 分母（转化率、占比）

</div>
<div v-click>

**conversion** — 漏斗：一个事件多久导向另一个

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #FF694A 10%, #FFB199 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
五种 metric 类型：simple 聚合单列是基石，derived 组合多指标，cumulative 累计需要 time spine，ratio 是比率，conversion 是漏斗转化。
-->

---
transition: fade-out
---

# dbt Mesh：4 治理特性

上游走 `ref()` 不是 `source()`

| 特性 | 作用 | 配置 |
| --- | --- | --- |
| Contracts | 构建时保证列名/类型 | `contract: {enforced: true}` |
| Groups | 按团队/域组织 | `group: finance` |
| Access | 控制谁能 ref | `public / protected / private` |
| Versions | 破坏性变更迁移窗口 | `versions:` + `latest_version` |

<div v-click class="mt-3 text-center text-sm opacity-80">

采用顺序：Groups & Access → Contracts → Versions → 跨项目 Ref（需 **dbt Cloud Enterprise**）

</div>

<style>
h1 { background: linear-gradient(45deg, #FF694A 10%, #FFB199 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
dbt Mesh 四治理特性：契约保证构建时列和类型，组按团队组织，访问控制谁能引用，版本管理破坏性变更。跨项目 ref 需要 dbt Cloud Enterprise。
-->

---
transition: fade-out
---

# 迁移到 Fusion：先修再分诊

先跑 `dbt-autofix`，再把剩余错误分 4 类

| 类 | 含义 | 处理 |
| --- | --- | --- |
| A 自动修（安全） | 高置信 | 确认后自动应用 |
| B 需批准 | 可修但先看 diff | 一次一个 diff |
| C 需用户输入 | 多种做法 | 给选项待定 |
| D 被阻塞 | 需 Fusion 引擎更新 | 附 GitHub issue、讲风险 |

<div v-click class="mt-3 text-center text-sm opacity-80">

分诊而非全自动修——成功 = 有进展 + 知道被什么卡住。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF694A 10%, #FFB199 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
migrating-dbt-core-to-fusion 是分诊助手：先跑 dbt-autofix，再把剩余错误分四类。A 自动修，B 需批准看 diff，C 需用户输入，D 被阻塞需 Fusion 更新。角色是分诊不是全自动修。
-->

---
transition: fade-out
---

# 跨平台迁移：信任 Fusion

Snowflake ↔ Databricks，Fusion 实时编译做方言转换

<v-clicks>

- **Fusion 实时编译**产精确错误日志，指出文件/行/差异
- 工作流：读错误 → 修 → 重编译 → 循环
- 迁移前在**源平台**生成单测（golden dataset）证明数据正确
- 成功：`dbtf compile` **0 错 0 警** + 单测过 + `dbtf run` 成功

</v-clicks>

<div v-click class="mt-4 text-center text-sm opacity-80">

`dbtf compile` 免费当迭代门，`run`/`test` 才花仓库钱。

</div>

<style>
h1 { background: linear-gradient(45deg, #FF694A 10%, #FFB199 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
跨平台迁移完全信任 Fusion 的实时编译做方言转换：读错误、修、重编译、循环。迁移前在源平台生成单测证明数据正确。compile 免费当迭代门。
-->

---
transition: fade-out
---

# 配 dbt MCP server

连 AI 工具到 dbt CLI / 语义层 / Discovery / Admin

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**Local**（`uvx dbt-mcp`）

- 支持 CLI 命令（run/build/test）
- 无 credit 消耗
- 不强制平台账号

</div>
<div v-click>

**Remote**（HTTP）

- 无 CLI 命令
- 耗 dbt Copilot credits
- 需 dbt 平台账号

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

Claude Code：`claude mcp add dbt -s user -- uvx dbt-mcp` · 凭据用 `${DBT_TOKEN}` 环境变量

</div>

<style>
h1 { background: linear-gradient(45deg, #FF694A 10%, #FFB199 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
configuring-dbt-mcp-server 把 AI 工具连到 dbt。local 用 uvx 含 CLI 命令无 credit，remote 走 HTTP 无 CLI 耗 credit 需平台账号。凭据用环境变量引用。
-->

---
transition: fade-out
---

# 更多技能

<div class="grid grid-cols-2 gap-x-10 gap-y-4 mt-6">
<div v-click>

**答业务问题**

语义层优先，4 级 fallback 到 manifest

</div>
<div v-click>

**排查 job 失败**

Admin API/日志/git，铁律：不为过测试改测试

</div>
<div v-click>

**查 dbt 文档**

LLM 友好 markdown，无需项目

</div>
<div v-click>

**画血缘**

Mermaid `graph LR`，按资源类型着色

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #FF694A 10%, #FFB199 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
其它技能：答业务问题语义层优先，排查 job 失败靠 Admin API 且铁律不改测试，查文档给 LLM 友好 markdown，画血缘生成 Mermaid 图。
-->

---
transition: fade-out
---

# 边界与前置

<v-clicks>

- **需 dbt 基础**：多数技能假设已装 dbt、有 `dbt_project.yml`
- **跨项目 ref 需 dbt Cloud Enterprise**
- **remote MCP** 需平台账号 + 耗 Copilot credits
- **语义层双 spec 版本敏感**：latest / legacy 语法不同
- **是知识与流程规范**，真正跑 dbt、连仓库仍要你的环境

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #FF694A 10%, #FFB199 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
边界：需 dbt 基础，跨项目 ref 需 Enterprise，remote MCP 需平台账号耗 credit，语义层双 spec 版本敏感，技能是知识规范执行仍需真实环境。
-->

---
layout: center
class: text-center
---

# 一句话记住

**dbt Labs 官方 12 技能 3 组：分析工程（build 而非 run）、语义层 MetricFlow、dbt Mesh 治理、迁移到 Fusion——agent 自动加载的 dbt 专家知识。**

<div class="mt-8 opacity-80">

官方沉淀 · 自动激活 · 强约定护栏 · 覆盖建模到迁移全链路

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/dbt-labs/dbt-agent-skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://docs.getdbt.com/" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #FF694A 10%, #FFB199 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。dbt Labs 官方 12 技能 3 组：分析工程用 build，语义层用 MetricFlow，Mesh 做治理，迁移到 Fusion。是 agent 自动加载的 dbt 专家知识，覆盖建模到迁移全链路。
-->
