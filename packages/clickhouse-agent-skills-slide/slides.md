---
theme: seriph
background: https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80
title: ClickHouse Agent Skills
info: |
  ## ClickHouse Agent Skills
  ClickHouse 官方 agent 技能——31 规则 + agent 查询工作流。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# ClickHouse Agent Skills

ClickHouse 官方 agent 技能

<div class="pt-8 text-xl opacity-80">
11 skill · best-practices 31 规则 · 规则优先于直觉
</div>

<div class="abs-br m-6 text-sm opacity-60">
ClickHouse/agent-skills · Apache-2.0
</div>

---
layout: two-cols
layoutClass: gap-8
---

# 它是什么

<v-clicks>

- **ClickHouse 官方**（ClickHouse Inc.）
- 帮 LLM 用 ClickHouse + **chdb**（Python 内嵌）采用最佳实践
- 覆盖开源 ClickHouse + 托管 **Cloud**
- **11 skill**，核心 `clickhouse-best-practices`
- **31 规则 / 4 类**：schema/query/insert/agent

</v-clicks>

::right::

<div v-click="1" class="mt-16 p-6 rounded-xl bg-gradient-to-br from-yellow-500/15 to-amber-500/10 border border-yellow-400/25">

**一句话**

> 列式库有特有行为（列存/稀疏索引/MergeTree），规则优先于通用直觉。

</div>

<div v-click="2" class="mt-4 p-4 rounded-lg bg-gray-500/10 text-sm">

```bash
npx skills add clickhouse/agent-skills
# 或
clickhousectl skills
```

</div>

---
layout: default
---

# best-practices：31 规则 / 4 类

<div v-click="1" class="text-sm mt-2">

`MUST USE`——审 ClickHouse schema / query / config 时必用，回答须引用具体规则

</div>

<div class="grid grid-cols-2 gap-3 mt-4 text-sm">

<div v-click="2" class="p-4 rounded-lg bg-blue-500/10">

**schema**

引擎 / ORDER BY 排序键 / 分区 / 编解码 / 低基数 / 稀疏索引

</div>

<div v-click="3" class="p-4 rounded-lg bg-green-500/10">

**query**

命中排序键/skip index / 避免全表扫 / EXPLAIN / 聚合

</div>

<div v-click="4" class="p-4 rounded-lg bg-orange-500/10">

**insert**

批量/异步插入 / 去重 / 幂等

</div>

<div v-click="5" class="p-4 rounded-lg bg-purple-500/10">

**agent**

连接 / schema 探索 / 查询安全

</div>

</div>

<div v-click="6" class="mt-4 p-3 rounded-lg bg-amber-500/10 text-center text-sm">

铁律：先查 `rules/` → 命中就 cite「Per `rule-name`…」→ 无则用文档 → 始终标来源

</div>

---
layout: default
---

# agent 查询工作流（5 步）

<div class="grid grid-cols-5 gap-2 mt-8 text-sm text-center">

<div v-click="1" class="p-3 rounded-lg bg-blue-500/10">

**1 Connect**

MCP/CLI 建连

</div>

<div v-click="2" class="p-3 rounded-lg bg-green-500/10">

**2 Discover**

7 步 schema 探索

</div>

<div v-click="3" class="p-3 rounded-lg bg-yellow-500/10">

**3 Plan**

sort key + skip index 写 WHERE

</div>

<div v-click="4" class="p-3 rounded-lg bg-orange-500/10">

**4 Execute**

LIMIT + 超时

</div>

<div v-click="5" class="p-3 rounded-lg bg-red-500/10">

**5 Recover**

收窄过滤重试

</div>

</div>

<div v-click="6" class="mt-8 p-4 rounded-xl bg-gray-500/10">

**7 步 schema 探索**：databases → tables → columns+comments → sort keys → skip indexes → sample → EXPLAIN

</div>

---
layout: default
---

# 11 个 skill

<div class="grid grid-cols-2 gap-4 mt-6 text-sm">

<div v-click="1" class="p-4 rounded-lg bg-yellow-500/10">

**最佳实践**

`clickhouse-best-practices`（31 规则）· `clickhouse-architecture-advisor`

</div>

<div v-click="2" class="p-4 rounded-lg bg-blue-500/10">

**chdb**（Python 内嵌）

`chdb-sql` · `chdb-datastore`

</div>

<div v-click="3" class="p-4 rounded-lg bg-green-500/10">

**JS/Node**

`coding` · `rowbinary` · `troubleshooting`

</div>

<div v-click="4" class="p-4 rounded-lg bg-purple-500/10">

**clickhousectl + 运维**

`local-dev` · `cloud-deploy` · `managed-postgres-rca` · `clickstack-otel-collector`

</div>

</div>

---
layout: two-cols
layoutClass: gap-6
---

# chdb + clickhousectl

<v-clicks>

- **chdb** = in-process ClickHouse for Python
  - 无需独立服务器
  - Python 进程里跑 ClickHouse SQL
  - 适合数据科学/嵌入式分析

- **clickhousectl**
  - `local-dev`：建本地开发环境
  - `cloud-deploy`：部署到 ClickHouse Cloud
  - `clickhousectl skills` 一键装 skill

</v-clicks>

::right::

<div v-click="1" class="mt-14 p-5 rounded-xl bg-red-500/10 border-l-4 border-red-500 text-sm">

**反模式**

- 用通用 DB 直觉设计表 → 查 schema 规则
- 查询不带 LIMIT/超时 → agent-query-safety
- 跳过 schema 探索 → 先走 7 步 Discover
- 逐行小批插入 → 批量/异步

</div>

---
layout: center
class: text-center
---

# 小结

<div class="grid grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto text-left">

<div v-click="1" class="p-5 rounded-xl bg-yellow-500/10">

**核心机制**

- best-practices 31 规则 / 4 类
- 规则优先于通用直觉
- agent 5 步查询工作流
- chdb / clickhousectl / js-node

</div>

<div v-click="2" class="p-5 rounded-xl bg-blue-500/10">

**记住这些**

- 审 schema/query 先查 `rules/` 并引用
- 查询带 LIMIT + 超时
- 7 步 schema 探索（sort key/skip index）
- chdb = Python 内嵌 ClickHouse

</div>

</div>

<div v-click="3" class="mt-10 text-xl">

**ClickHouse 官方 · Apache-2.0 · OSS + Cloud**

</div>

<div v-click="4" class="abs-br m-6 text-sm opacity-60">
ClickHouse/agent-skills · npx skills add
</div>
