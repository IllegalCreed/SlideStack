---
theme: seriph
background: https://cover.sli.dev
title: DuckDB Skills
info: |
  DuckDB 官方 Claude Code 插件：读任意数据文件、附加并查询 DuckDB 库、
  搜 DuckDB/DuckLake 文档、检索历史会话、装/更新扩展。duckdb/duckdb-skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# DuckDB Skills

DuckDB **官方** Claude Code 插件——**直读文件 + Friendly SQL** 接进 AI 对话

<div class="pt-6 opacity-80">
duckdb/duckdb-skills · read-file / query / attach-db / s3 / spatial · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/duckdb/duckdb-skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #FFF000 15%, #FDE047 70%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
DuckDB Skills 是 DuckDB 官方组织出的 Claude Code 插件，把 DuckDB 直读文件和 Friendly SQL 的能力接进 AI 对话。注意：官方 duckdb org，不是 MotherDuck。
-->

---
transition: fade-out
---

# 定位：官方出品，接进对话

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**DuckDB Skills 是什么**

- **DuckDB 官方**（`duckdb` 组织）的 **Claude Code 插件**
- 9 个 skill：读文件 / 查库 / 搜文档 / 检索会话 / 装扩展
- 底层调用本地 **DuckDB CLI**
- MIT，v0.2.4
- **不是** MotherDuck 云服务

</div>
<div v-click>

**DuckDB 是什么**

- **in-process / 嵌入式**：无需起服务
- **分析型（OLAP）列式**：为扫描聚合优化
- **直读文件**：`FROM 'x.parquet'` 不必先建表
- **Friendly SQL**：更好写的 SQL 方言
- 「分析界的 SQLite」

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #CA8A04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
左边：DuckDB Skills 是官方的 Claude Code 插件，9 个 skill，底层用本地 DuckDB CLI，不是 MotherDuck。右边：DuckDB 本身是嵌入式列式 OLAP 库，能直读文件，被称为分析界的 SQLite。
-->

---
transition: fade-out
---

# 安装：Claude Code 插件

不是 `npx skills add`，而是插件市场两步装

<div v-click>

```text
# 1. 注册插件市场（GitHub 仓库）
/plugin marketplace add duckdb/duckdb-skills

# 2. 安装插件
/plugin install duckdb-skills@duckdb-skills

# 之后 skill 变成 /duckdb-skills:<name>
/duckdb-skills:query FROM sales LIMIT 10
```

</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

**前置**：本地要有 DuckDB CLI（`brew install duckdb` / `curl -fsSL https://install.duckdb.org | sh`）；没装时 skill 引导 `install-duckdb`。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #CA8A04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
装法和别的 skill 生态不同：它是 Claude Code 插件，用 /plugin marketplace add 注册仓库、/plugin install 安装。装后 skill 以 /duckdb-skills:name 调用。前置是本地 DuckDB CLI。
-->

---
transition: fade-out
---

# 9 个 skill，三类

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**查询核心**

- `read-file` 读任意数据文件（`read_any` 宏）
- `query` 跑 SQL / 自然语言，两种模式
- `attach-db` 附加库 + 探索 schema

</div>
<div v-click>

**远程 · 格式 · 辅助**

- `s3-explore` 探 S3/R2/GCS，零下载
- `convert-file` 格式互转（→ Parquet…）
- `spatial` 空间分析 + Overture Maps
- `duckdb-docs` FTS 搜官方文档
- `read-memories` 检索历史会话
- `install-duckdb` 装/更新扩展

</div>
</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

它们**共享一个 `state.sql`**——附加的库、建的 SECRET/宏，处处可复用。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #CA8A04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
9 个 skill 分三类：查询核心（read-file、query、attach-db），远程与格式（s3-explore、convert-file、spatial），辅助（duckdb-docs、read-memories、install-duckdb）。关键：所有 skill 共享一个 state.sql。
-->

---
transition: fade-out
---

# attach-db：附加库 + 会话可复用

「探索 schema，写状态文件，后续自动恢复」

<div v-click>

```text
/duckdb-skills:attach-db my_analytics.duckdb
  ↓
1. 校验库（PRAGMA version）
2. 探索 schema：duckdb_tables() + DESCRIBE + 行数
3. 问你存哪：.duckdb-skills/  或  ~/.duckdb-skills/<id>/
4. 追加到 state.sql（ATTACH IF NOT EXISTS + USE）
```

</div>

<div v-click class="mt-3">

`state.sql` = 所有 skill 共享的初始化文件，**只追加、幂等**，`duckdb -init state.sql` 恢复。之后 `query` 自动接上，无需重复附加。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #CA8A04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
attach-db 附加一个 DuckDB 库：校验、探索 schema、问你把状态存项目还是主目录、追加到 state.sql。state.sql 是所有 skill 共享的追加式幂等初始化文件，用 duckdb -init 恢复会话。
-->

---
transition: fade-out
---

# query：两种执行模式

<div class="grid grid-cols-2 gap-5 mt-3">
<div v-click>

**ad-hoc 模式（沙箱）**

引用文件 / 无状态时，对 `:memory:` 跑：

```sql
SET allowed_paths=['x.csv'];
SET enable_external_access=false;
SET lock_configuration=true;
FROM 'x.csv' WHERE amount > 100;
```

只放行那个文件，禁外部访问

</div>
<div v-click>

**session 模式（信任库）**

已附加库时，读 `state.sql`：

```bash
duckdb -init state.sql \
  -csv -c "FROM sales LIMIT 10"
```

自动接上附加的库与宏

</div>
</div>

<div v-click class="mt-2 text-center text-sm opacity-80">

执行前**估结果规模**：源 >100 万行且无 LIMIT/聚合 → 提醒你加 `LIMIT`，防爆 token。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #CA8A04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
query 有两种模式：ad-hoc 对内存库跑并开沙箱（只放行引用文件、禁外部访问、锁配置），session 读 state.sql 查信任的附加库。执行前会估结果规模，超百万行无限制会提醒加 LIMIT 防爆 token。
-->

---
transition: fade-out
---

# query：Friendly SQL

DuckDB 更好写的 SQL 方言

```sql
FROM sales WHERE amount > 100          -- FROM 前置，隐式 SELECT *
SELECT * EXCLUDE (id, updated_at)      -- 通配里剔除列
GROUP BY ALL                            -- 按所有非聚合列自动分组
SELECT count() FILTER (WHERE x > 10)   -- 条件聚合
COLUMNS('sales_.*')                     -- 正则批量选列
SUMMARIZE sales                         -- 一键统计画像
```

<div v-click class="mt-3 text-center text-sm opacity-80">

`query` 也接**自然语言**——先取 schema，再按 Friendly SQL 生成查询。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #CA8A04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Friendly SQL 是 DuckDB 的招牌：FROM 前置、EXCLUDE 剔列、GROUP BY ALL、FILTER 条件聚合、COLUMNS 正则选列、SUMMARIZE 统计画像。query 也能接自然语言，先取 schema 再生成 SQL。
-->

---
transition: fade-out
---

# read-file：一个宏读万物

`read_any` 表宏按扩展名自动分派

| 扩展名 | 读取函数 |
| --- | --- |
| `.csv` / `.tsv` / `.txt` | `read_csv` |
| `.json` / `.jsonl` / `.geojson` | `read_json_auto` |
| `.parquet` / `.pq` | `read_parquet` |
| `.xlsx` · `.avro` | `read_xlsx` · `read_avro` |
| `.shp` / `.gpkg` / `.kml` | `st_read`（空间） |
| `.db` / `.sqlite` · `.ipynb` | `sqlite_scan` · Jupyter |

<div v-click class="text-center text-sm opacity-80">

读完自动 `DESCRIBE` + 数行数 + 取前 20 行；远程（S3/HTTPS）前置 `LOAD httpfs;` + SECRET。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #CA8A04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
read-file 的核心是 read_any 表宏，按扩展名分派到 read_csv、read_json_auto、read_parquet、read_xlsx、st_read、sqlite_scan 等。读完自动 DESCRIBE、数行数、取样本。远程文件前置 httpfs 和 SECRET。
-->

---
transition: fade-out
---

# s3-explore：远程数据，零下载

<v-clicks>

- **列桶只取元数据**——`read_blob('<url>/*')` 只选 `filename/size/last_modified`，**绝不选 `content`**（那会下载真身）
- **Parquet 行数从元数据拿**——`parquet_metadata(...)` 求和 `row_group_num_rows`，不读数据
- **谓词下推**——`WHERE` 下推进 S3 上的 Parquet，远程大集也能高效过滤

</v-clicks>

<div v-click class="mt-4">

```sql
LOAD httpfs;
CREATE SECRET (TYPE S3, PROVIDER credential_chain);
SELECT count(*) FROM 's3://bucket/data.parquet';  -- 只走元数据
```

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #CA8A04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
s3-explore 探查 S3/R2/GCS，关键是不下载：列桶只取文件名大小时间不取 content，Parquet 行数从 parquet_metadata 拿，WHERE 谓词下推进远程 Parquet。凭证走 CREATE SECRET credential_chain。
-->

---
transition: fade-out
---

# convert-file：格式互转

「转成 parquet」「导成 Excel」——AI 产不出的二进制格式交给 DuckDB

```sql
COPY (FROM 'data.csv') TO 'data.parquet';                  -- 默认 Parquet
COPY (FROM 'data.csv') TO 'out.json' (FORMAT json, ARRAY true);
COPY (FROM 'data.csv') TO 'out.xlsx' (FORMAT xlsx);        -- 需 LOAD excel
```

<div v-click class="mt-3">

- 提「按 year 分区」→ 加 `PARTITION_BY (year)`（仅 Parquet/CSV）
- 提「用 zstd」→ Parquet 加 `CODEC 'zstd'`
- 输出格式由**输出扩展名**推断；不给输出名默认转 `.parquet`

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #CA8A04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
convert-file 用一条 COPY 在格式间转换，输出格式由输出扩展名推断。CSV 转 Parquet、导 JSON、导 Excel。支持 PARTITION_BY 分区、CODEC zstd 压缩。二进制格式 AI 无法直接产出，交给 DuckDB 写。
-->

---
transition: fade-out
---

# spatial：空间分析 + Overture Maps

用空间扩展答地理问题；缺数据用 **Overture Maps**（免费全球数据，**无需 API key**）

<v-clicks>

- **`SET geometry_always_xy = true`**——按「经度, 纬度」解释坐标；不设则球面距离全错
- **bbox 先过滤**——查 Overture 先按 `bbox.*` 过滤，靠 Parquet 谓词下推避免拉全量
- **真实距离用球面函数**——`ST_Distance_Spheroid` 返回 WGS84 米，但要 `POINT_2D` 输入
- **`ST_Read`** 读 GeoJSON/Shapefile/GPX 等 50+ 格式；H3 六边形分箱

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #CA8A04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
spatial 用空间扩展答地理问题，缺数据时用 Overture Maps 免费全球数据无需 API key。三条铁律：geometry_always_xy 让坐标按经纬顺序、bbox 先过滤下推、真实距离用 ST_Distance_Spheroid 需 POINT_2D。ST_Read 读 50+ 空间格式。
-->

---
transition: fade-out
---

# 辅助三件

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**`duckdb-docs`** 搜文档

- `INSTALL httpfs; INSTALL fts;`
- `match_bm25` 全文搜索
- DuckDB 文档 + 博客 / DuckLake 两套索引
- 本地缓存，>2 天自动刷新

**`install-duckdb`** 装扩展

- `INSTALL name` / `INSTALL name FROM repo`
- `--update` 更新扩展 + 查 CLI 版本

</div>
<div v-click>

**`read-memories`** 检索会话

- `read_ndjson` 搜 `~/.claude/projects/*/*.jsonl`
- 恢复过往决策 / 模式 / 未决 TODO
- `--here` 只搜当前项目
- **静默**工作——吸收结果不复述日志

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #CA8A04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
辅助三件：duckdb-docs 用 fts 的 match_bm25 搜官方文档博客和 DuckLake，本地缓存。install-duckdb 装更新扩展、检查 CLI 版本。read-memories 用 read_ndjson 搜历史会话日志恢复上下文，静默工作不复述。
-->

---
transition: fade-out
---

# 为什么是 DuckDB

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**四个特性**

- **嵌入式**：跑在进程里，无需起服务
- **列式 OLAP**：为扫描聚合优化
- **直读文件**：CSV/Parquet/JSON 不必落库
- **扩展生态**：httpfs/spatial/fts/excel…

</div>
<div v-click>

**直读，不建表**

```sql
FROM 'sales.parquet'
WHERE region = 'APAC';

FROM 'data/part-*.parquet';   -- 通配多文件

FROM read_json_auto('events.ndjson');
```

</div>
</div>

<div v-click class="mt-2 text-center text-sm opacity-80">

正是「嵌入式 OLAP + 直读文件」，让这组 skill 能在对话里即席分析。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #CA8A04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
为什么是 DuckDB：嵌入式无需起服务、列式 OLAP、直读文件不必落库、扩展生态。右边展示直读 Parquet、通配多文件、直读 ndjson，无需 CREATE TABLE。这正是这组 skill 能即席分析的根源。
-->

---
transition: fade-out
---

# 边界与注意

<v-clicks>

- **依赖本地 DuckDB CLI**——没装时 skill 引导 `install-duckdb`（brew / curl / winget）
- **平台**——macOS / Linux 已测；**Windows 尚未完全支持**（部分 shell/路径可能异常）
- **是插件（技能集）**——9 个 skill 各有触发条件，能力上限 = DuckDB + 扩展
- **不是 MotherDuck**——纯本地开源 DuckDB 的 skill，非云端 serverless 服务
- **别覆盖 `state.sql`**——它是所有 skill 共享的追加式文件，覆盖会丢别人的 SECRET/宏

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #CA8A04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
边界：依赖本地 DuckDB CLI；macOS Linux 已测、Windows 未完全支持；是插件技能集，能力上限等于 DuckDB 加扩展；不是 MotherDuck 云服务；别手动覆盖共享的 state.sql。
-->

---
layout: center
class: text-center
---

# 一句话记住

**DuckDB 官方 Claude Code 插件：`read-file` 一个宏读万物、`query` 两模式跑 Friendly SQL、`s3-explore` 远程零下载、`spatial` 接 Overture——底层是嵌入式列式 OLAP 的 DuckDB，直读文件不落库。**

<div class="mt-8 opacity-80">

官方出品 · 直读文件 · 共享 state.sql · 沙箱防爆 · 远程零下载

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/duckdb/duckdb-skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://duckdb.org/docs/" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #CA8A04 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。DuckDB 官方 Claude Code 插件：read-file 一个宏读万物、query 两模式跑 Friendly SQL、s3-explore 远程零下载、spatial 接 Overture。底层是嵌入式列式 OLAP 的 DuckDB，直读文件不落库。
-->
