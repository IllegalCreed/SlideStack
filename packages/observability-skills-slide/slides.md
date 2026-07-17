---
theme: seriph
background: https://cover.sli.dev
title: 可观测性 Skills
info: |
  可观测性 Skills（泛化叶）：以 Grafana 官方 grafana/skills 锚定。
  LGTM 栈 + 采集三路 + Grafana Cloud + App SDK。Apache-2.0。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 可观测性 Skills

用 AI agent 落地可观测性——以 **Grafana 官方 `grafana/skills`** 锚定

<div class="pt-6 opacity-80">
LGTM 栈 · 采集三路 · Grafana Cloud · App SDK · Apache-2.0
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/grafana/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #F46800 10%, #F9A03F 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
可观测性 Skills 是个泛化叶：可观测性用指标、日志、追踪三大信号理解系统。本叶以 Grafana 官方 grafana/skills 锚定，因为它是领先的开源可观测平台，一手 skill 覆盖最广。
-->

---
transition: fade-out
---

# 定位：泛化叶 + Grafana 锚定

可观测性 = observability，本叶取 Grafana 作代表

<div class="grid grid-cols-2 gap-6 mt-6">
<div v-click>

**泛化叶**

- 可观测性 = 指标 / 日志 / 追踪三大信号
- 各家平台都在做自家的可观测 skill
- 本叶不逐一展开，取一家锚定讲透

</div>
<div v-click>

**以 Grafana 官方锚定**

- `grafana/skills`：Grafana Labs 官方
- 48 skill · 7 插件组 · Apache-2.0
- 领先开源可观测平台 + LGTM 栈

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">

生态另有 OTel（dash0hq）/ Sentry / Elastic，各自锚定自家平台。

</div>

<style>
h1 { background: linear-gradient(45deg, #F46800 10%, #F9A03F 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
可观测性是泛化概念。本叶以 Grafana 官方锚定，48 个 skill 分 7 组，Apache-2.0。生态里还有 OTel、Sentry、Elastic，各锚定自家。
-->

---
transition: fade-out
---

# 可观测生态：多家一手源

本叶取 Grafana，其余按需选

| 源 | 出品方 | 锚定平台 |
| --- | --- | --- |
| **grafana/skills**（本叶） | Grafana Labs | Grafana + LGTM 栈 |
| dash0hq/agent-skills | Dash0 | OpenTelemetry（平台中立） |
| Sentry 官方 skill | Sentry | 错误追踪 + APM |
| Elastic 官方 skill | Elastic | Elasticsearch / Kibana |

<div v-click class="mt-4 text-center text-sm opacity-80">

选型：用 Grafana/LGTM → grafana；只认 OTel → dash0hq；错误追踪为主 → Sentry；ELK 栈 → Elastic。

</div>

<style>
h1 { background: linear-gradient(45deg, #F46800 10%, #F9A03F 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
可观测性 Skills 是多家的。已用 Grafana 就用 grafana/skills；想平台中立走纯 OTel 用 dash0hq；错误追踪为主用 Sentry；已在 ELK 用 Elastic。
-->

---
transition: fade-out
---

# 安装：一条命令，跨 agent

遵 agentskills.io，兼容 Claude Code / Cursor / Codex

```bash
# 推荐：任何 Agent Skills 工具
npx skills add grafana/skills

# Claude Code：加市场 + 按插件组按需装
claude plugin marketplace add grafana/skills
claude plugin install grafana-core@grafana-skills
claude plugin install grafana-lgtm@grafana-skills
claude plugin install grafana-cloud@grafana-skills
```

<div v-click class="mt-3 text-center text-sm opacity-80">

装后 agent 检测到相关任务自动激活，也可自然语言显式触发。

</div>

<style>
h1 { background: linear-gradient(45deg, #F46800 10%, #F9A03F 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
一条 npx skills add 装进任何兼容工具。Claude Code 也可用插件市场按组装，不必全装。装后任务匹配自动激活。
-->

---
transition: fade-out
---

# LGTM 栈：三大信号

Grafana 把可观测性拆成信号，各有专技能

| 组件 | 信号 | 查询语言 | 一句话 |
| --- | --- | --- | --- |
| **L**oki | 日志 | LogQL | 只索引 label，不索引全文，便宜 |
| **G**rafana | 可视化 | — | 仪表盘 + Explore 统一门户 |
| **T**empo | 追踪 | TraceQL | 只需对象存储的追踪后端 |
| **M**imir | 指标 | PromQL | 可扩展多租户长期指标存储 |

<div v-click class="mt-3 text-center text-sm opacity-80">

外加 **Prometheus**（指标事实标准）· **Pyroscope**（持续剖析）· **k6**（负载测试）。

</div>

<style>
h1 { background: linear-gradient(45deg, #F46800 10%, #F9A03F 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
LGTM：Loki 日志、Grafana 可视化、Tempo 追踪、Mimir 指标存储。再加 Prometheus、Pyroscope 剖析、k6 负载。三大信号靠 service.name 关联。
-->

---
transition: fade-out
---

# 采集三路：数据怎么进来

从应用到存储，三种插桩方式

| 路径 | skill | 特点 |
| --- | --- | --- |
| **Alloy** | `alloy` | 一个 OTel 兼容 binary 收 metrics/logs/traces/profiles |
| **Beyla** | `beyla` | eBPF 零代码插桩，不改代码/不重启（Linux 5.8+） |
| **OpenTelemetry** | `opentelemetry` | SDK 自动插桩，OTLP gateway + env var |

<div v-click class="mt-4 text-center">

Alloy 常见管道：`otelcol.receiver.otlp` → `otelcol.exporter.otlp`；`alloy validate` 校验、UI 在 `:12345`。

</div>

<style>
h1 { background: linear-gradient(45deg, #F46800 10%, #F9A03F 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
采集三路：Alloy 是统一采集器替代 Grafana Agent；Beyla 用 eBPF 零代码插桩，适合不能重编译的服务；OpenTelemetry 是标准 SDK 插桩。
-->

---
transition: fade-out
---

# grafana-cloud：18 skill 全家桶

从采集到成本，覆盖 Cloud 全链路

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**用可观测**

- `app-observability` APM+RUM+LLM
- `infrastructure` K8s / 主机监控
- `database-observability` 慢查询
- `oncall-irm` 告警路由 + 事件

</div>
<div v-click>

**管成本与接入**

- `adaptive-metrics` 缩基数省钱
- `cost-management` 成本归因
- `assistant-mcp` AI agent 连 Grafana
- `fleet-management` 采集器集群

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #F46800 10%, #F9A03F 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
grafana-cloud 组 18 个 skill：左边是用可观测——应用/基础设施/数据库/on-call；右边是管成本与接入——adaptive-metrics 缩基数、cost-management 归因、assistant-mcp 连 agent。
-->

---
transition: fade-out
---

# app-observability：一技能三产品

共用 OTLP + LGTM 底座

<v-clicks>

- **Application Observability（APM）**——从 OTel 追踪自动生成 `traces_spanmetrics_*` 的 RED 指标（Rate/Errors/Duration）+ Service Map
- **Frontend Observability**——Faro Web SDK 做浏览器 RUM：Core Web Vitals、session replay、前端 → 后端 trace 串联
- **AI Observability**——OpenLIT 自动插桩，监控 LLM 的 token / 成本 / 延迟 + 幻觉评估

</v-clicks>

<div v-click class="mt-4 text-center text-sm opacity-80">

关联键 `service.name` 连所有信号；缺 `service.namespace` → 服务不进 Service Inventory。

</div>

<style>
h1 { background: linear-gradient(45deg, #F46800 10%, #F9A03F 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
app-observability 一个 skill 三产品：APM 从 OTel 追踪产 RED 指标和服务图；前端可观测用 Faro 做 RUM；AI 可观测用 OpenLIT 监控 LLM 成本。都靠 service.name 关联。
-->

---
transition: fade-out
---

# adaptive-metrics：缩基数省成本

Grafana Cloud 按 active-series 计费

```bash
# 拉自动推荐（按序列缩减影响排序）
curl -s -H "Authorization: Bearer <KEY>" \
  "https://adaptive-metrics.grafana.net/api/v1/recommendations" \
  | jq '.recommendations[]'

# 应用后 ~5 分钟生效；度量效果：
#   grafanacloud_instance_active_series_dropped_by_aggregation_rules
```

<div v-click class="mt-3 text-center">

聚合规则在存储前 drop 高基数 label（`pod_uid`/`version`）——通常降 **40–60%** 序列。

</div>

<style>
h1 { background: linear-gradient(45deg, #F46800 10%, #F9A03F 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
adaptive-metrics 直击账单：Cloud 按 active-series 计费，高基数 label 让序列爆炸。聚合规则在存储前预先收缩，drop 没用到的高基数 label，通常降 40 到 60%。改前确认 label 没被仪表盘用。
-->

---
transition: fade-out
---

# assistant-mcp：把 AI agent 连到 Grafana

经 mcp-grafana MCP server 查指标/仪表盘/告警

```json
// ~/.claude/settings.json → mcpServers.grafana
{
  "command": "mcp-grafana",
  "args": ["--disable-write"],
  "env": {
    "GRAFANA_URL": "https://myorg.grafana.net",
    "GRAFANA_API_KEY": "glsa_xxxx"
  }
}
```

<div v-click class="mt-2 text-center text-sm opacity-80">

`--disable-write` 是更安全的只读默认；`/mcp` 验证接通。

</div>

<style>
h1 { background: linear-gradient(45deg, #F46800 10%, #F9A03F 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
assistant-mcp 用 mcp-grafana 把 agent 连到 Grafana Cloud。go install 装、建 service-account token、写进 settings.json。--disable-write 只读起步更安全，重启后 /mcp 验证。
-->

---
transition: fade-out
---

# grafana-app-sdk：schema-centric 建 App

另一条线——建 Grafana App Platform 应用

```text
1. project init            → 模块、Makefile、kinds/
2. project kind add MyKind → CUE kind 脚手架
3. 编辑 kinds/*.cue         → schema、校验、版本
4. grafana-app-sdk generate → 生成 Go/TS 类型、CRD
5. 填 reconciler / admission 业务逻辑
```

<div v-click class="mt-3 text-center text-sm opacity-80">

三种 deployment mode：standalone operator / grafana/apps / frontend-only。别手改 `pkg/generated/`。

</div>

<style>
h1 { background: linear-gradient(45deg, #F46800 10%, #F9A03F 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
grafana-app-sdk 是另一条线，面向平台开发者。schema-centric：用 CUE 定义 kind、generate 出 Go/TS 代码、填 reconciler。三种部署模式。生成的代码别手改，改 CUE 重新 generate。
-->

---
transition: fade-out
---

# 三套查询语言：LGTM 的手感

指标、日志、追踪各有 QL

```text
# LogQL（Loki 日志）
sum(rate({app="nginx"} |= "error" [5m]))
```

```text
# PromQL（Prometheus/Mimir 指标）
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

```text
# TraceQL（Tempo 追踪）
{ resource.service.name = "api" && duration > 500ms }
```

<style>
h1 { background: linear-gradient(45deg, #F46800 10%, #F9A03F 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
LGTM 三套查询语言：LogQL 查日志、PromQL 查指标、TraceQL 查追踪。skill 教 agent 怎么写、验证、优化这三套。
-->

---
transition: fade-out
---

# 反模式：别踩这些坑

可观测性最常见的翻车

<v-clicks>

- **高基数 label 炸账单**——`user_id`/`request_id` 塞进指标 label，序列爆炸
- **无采样全量存 trace**——又贵又慢，应尾采样保留错误/慢 span
- **健康检查日志不过滤**——`GET /health` 刷屏烧配额，Alloy 里 drop
- **手改生成代码**——改 `pkg/generated/` 下次 generate 被覆盖
- **MCP 给写权限当默认**——共享环境应 `--disable-write` 只读起步

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #F46800 10%, #F9A03F 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
五个反模式：高基数 label 炸账单、无采样全量存 trace、健康检查日志不过滤、手改生成代码、MCP 默认给写权限。前三个是成本坑，用 adaptive 系列和采样解决。
-->

---
transition: fade-out
---

# 边界：本叶讲什么、不讲什么

摆正预期

<div class="grid grid-cols-2 gap-6 mt-6">
<div v-click>

**讲**

- 用 AI agent 落地可观测（LGTM/采集/成本）
- Grafana 官方 48 skill 的定位与用法
- 采集三路、三套查询语言、App SDK

</div>
<div v-click>

**不讲 / 边界**

- 不是平台本身，是「用法沉淀」
- 绑 Grafana 生态，非 Datadog/纯 OTel
- OTel/Sentry/Elastic 一手 skill 未展开

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #F46800 10%, #F9A03F 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
边界：本叶讲用 agent 落地可观测、Grafana 48 skill 的用法。不讲平台实现，绑 Grafana 生态。其它生态源未逐一展开。
-->

---
layout: center
class: text-center
---

# 一句话记住

**可观测性 Skills（泛化叶）以 Grafana 官方 `grafana/skills` 锚定：LGTM 栈（Loki/Tempo/Mimir + Prometheus/Pyroscope/k6）+ 采集三路（Alloy/Beyla/OTel）+ Cloud 全家桶（app-observability/adaptive-metrics/assistant-mcp）+ App SDK。**

<div class="mt-8 opacity-80">

三大信号 · 采集统一 · 成本可控 · AI 原生 · Apache-2.0

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/grafana/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://grafana.com/docs/" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #F46800 10%, #F9A03F 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。可观测性 Skills 以 Grafana 官方锚定：LGTM 栈、采集三路、Cloud 全家桶、App SDK。三大信号、采集统一、成本可控、AI 原生。
-->
