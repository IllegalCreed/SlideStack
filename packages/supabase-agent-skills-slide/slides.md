---
theme: seriph
background: https://cover.sli.dev
title: Supabase Agent Skills
info: |
  Supabase 官方 agent 技能集：文档访问、安全 RLS、工具工作流、schema 管理 + Postgres 最佳实践。
  supabase/agent-skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Supabase Agent Skills

Supabase 官方技能集——**对抗训练数据过时** + 内置安全清单

<div class="pt-6 opacity-80">
supabase/agent-skills · 文档访问 / 安全 RLS / 工具工作流 / schema · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/supabase/agent-skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #3ECF8E 10%, #249361 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Supabase Agent Skills 是 Supabase 官方的 agent 技能集，把「怎样正确、安全地用 Supabase」沉淀成可按需调用的技能。核心解决两个痛点：训练数据会过时、Postgres/RLS 安全陷阱多。
-->

---
transition: fade-out
---

# 为什么需要它：两大痛点

给 AI agent 的 Supabase 说明书

<div class="grid grid-cols-2 gap-6 mt-6">
<div v-click>

**① 训练数据会过时**

Supabase 迭代快，函数签名、`config.toml`、API 约定常在版本间变。

→ 技能强制先拉 `changelog.md` 扫 `breaking-change`，再查当前文档，**别凭记忆写**。

</div>
<div v-click>

**② 安全陷阱多且静默**

建在 Postgres + RLS 上，很多坑不报错、只静默留漏洞（视图绕 RLS、`user_metadata` 可篡改）。

→ 技能内置一份 **Supabase 专属安全清单**。

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">

不是通用 prompt，而是官方沉淀的、带明确触发条件的工程规范。

</div>

<style>
h1 { background: linear-gradient(45deg, #3ECF8E 10%, #249361 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
它解决两个 AI agent 用 Supabase 的老问题：训练数据会过时，所以强制先查最新文档；安全陷阱多且静默，所以内置一份专属安全清单。
-->

---
transition: fade-out
---

# 安装 & 两个技能

一条命令装进 18+ agent

```bash
npx skills add supabase/agent-skills                      # 全部
npx skills add supabase/agent-skills --skill supabase     # 指定
claude plugin marketplace add supabase/agent-skills       # 或作插件
claude plugin install supabase@supabase-agent-skills
```

<div class="grid grid-cols-2 gap-6 mt-5">
<div v-click>

**`supabase`**（主技能 v0.1.2）

覆盖全产品线：Database / Auth / Edge Functions / Realtime / Storage / Vectors / Cron / Queues + 客户端库 + CLI/MCP + 安全审计

</div>
<div v-click>

**`supabase-postgres-best-practices`**（v1.1.1）

Postgres 性能优化 8 类规则，按影响力从 CRITICAL 到 LOW 排序，每条含错误 vs 正确 SQL

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #3ECF8E 10%, #249361 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
装一条命令，兼容 Claude Code、Copilot、Cursor 等 18+ agent，也可作 Claude 插件。仓库两个技能：supabase 主技能覆盖全产品，postgres-best-practices 专攻性能。
-->

---
transition: fade-out
---

# 主技能的四大核心域

<div class="grid grid-cols-2 gap-4 mt-6">
<div v-click class="p-3 border rounded border-green-500">

**① 文档访问**

别信训练数据——先 changelog 后当前文档，`search_docs` 优先

</div>
<div v-click class="p-3 border rounded border-green-500">

**② 安全（RLS 为核心）**

Supabase 专属陷阱清单：RLS / 视图 / 权限 / Storage

</div>
<div v-click class="p-3 border rounded border-green-500">

**③ 工具工作流**

CLI 用 `--help` 别猜；MCP Server 排障三步

</div>
<div v-click class="p-3 border rounded border-green-500">

**④ schema 管理**

声明式 vs 命令式；本地迭代用 `execute_sql`

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #3ECF8E 10%, #249361 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
主技能 supabase 的能力归为四大域：文档访问、安全、工具工作流、schema 管理。后面几页逐个展开。
-->

---
transition: fade-out
---

# 域一：文档访问——别信训练数据

实现前先核对 changelog 与当前文档

先拉 `https://supabase.com/changelog.md`（轻量索引），扫任务相关的 `breaking-change` 标签；再按优先级查文档：

| 优先级 | 方法 | 说明 |
| --- | --- | --- |
| 1 | MCP `search_docs` 工具 | 首选，直接返回相关片段 |
| 2 | 文档页当 markdown 拉 | 任意文档页 URL 后加 `.md` |
| 3 | Web 搜索 | 不知道看哪页时用 |

<div v-click class="mt-4 text-center text-sm opacity-80">

铁律：实现后必须跑测试查询验证——「没验证的修复是未完成的修复」。

</div>

<style>
h1 { background: linear-gradient(45deg, #3ECF8E 10%, #249361 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
文档访问域：Supabase 变化快，先拉 changelog 扫 breaking-change，再按优先级查文档——MCP search_docs 首选，其次文档页加 .md 拉取，最后 Web 搜索。实现后必须跑测试验证。
-->

---
layout: two-cols
transition: fade-out
---

# 域二：安全清单（上）

**Auth 与会话**

- 绝不用 `user_metadata` 做授权——用户可改，授权数据放 `app_metadata`
- 删用户**不会**让已签发 token 失效——先登出/吊销会话
- JWT 声明要等 token 刷新才更新

::right::

**API key 暴露**

- 绝不在前端暴露 `service_role` / secret key
- 前端用 publishable key
- Next.js 里 `NEXT_PUBLIC_` 前缀会发到浏览器

<div class="mt-4 text-sm opacity-80">

暴露表到 Data API ≠ RLS：前者控表是否可访问（需 `GRANT`），后者控行是否可见。

</div>

<style>
h1 { background: linear-gradient(45deg, #3ECF8E 10%, #249361 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
安全清单上半：Auth 与会话——user_metadata 用户可改不能做授权，删用户不失效 token；API key——前端绝不暴露 service_role。还要分清暴露表到 Data API 和 RLS 是两回事。
-->

---
transition: fade-out
---

# 域二：安全清单（下）——RLS & 视图

暴露 schema 每张表都开 RLS

```sql
-- TO authenticated 只认证不授权（IDOR）→ 必须配 USING 归属判断
create policy "sel" on orders for select
  to authenticated
  using ( (select auth.uid()) = user_id );

-- UPDATE 策略要同时写 USING + WITH CHECK（否则能被改归属）
create policy "upd" on orders for update
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );
```

<div v-click class="mt-3 text-sm opacity-80">

视图默认**绕过 RLS** → PG15+ 加 `security_invoker = true`；UPDATE 缺 SELECT 策略会**静默返回 0 行**。

</div>

<style>
h1 { background: linear-gradient(45deg, #3ECF8E 10%, #249361 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
RLS 与视图：TO authenticated 只是认证不是授权，必须配 USING 里的归属判断，否则就是 IDOR 越权。UPDATE 策略要同时写 USING 和 WITH CHECK。视图默认绕 RLS，PG15+ 要加 security_invoker。
-->

---
transition: fade-out
---

# 域二：SECURITY DEFINER & Storage

两个最易踩的静默坑

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**`SECURITY DEFINER` 函数**

- 以创建者权限运行，**绕过 RLS**
- `public` 里的默认对 `anon`/`authenticated` 可调 = 公开 API
- 别为解权限错乱加它 → 优先 `SECURITY INVOKER`
- 真需要：放非暴露 schema + 内部 `auth.uid()` 检查

</div>
<div v-click>

**Storage upsert**

- upsert 需 **INSERT + SELECT + UPDATE** 三个权限
- 只给 INSERT → 新上传能行，但文件替换**静默失败**

<div class="mt-4 text-sm opacity-80">

依赖供应链：装 Supabase 包务必锁版本 + 提交 lockfile。

</div>

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #3ECF8E 10%, #249361 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
两个最静默的坑：SECURITY DEFINER 绕过 RLS 且在 public 里人人可调，优先用 SECURITY INVOKER；Storage upsert 需要 INSERT SELECT UPDATE 三个权限，只给 INSERT 会静默失败。
-->

---
transition: fade-out
---

# 域三：工具工作流——CLI & MCP

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**Supabase CLI**

用 `--help` 发现命令，**别猜**（结构会变）：

```bash
supabase --help
supabase db --help
```

版本门槛：`db query` 需 v2.79.0+、`db advisors` 需 v2.81.3+，缺则回退 MCP。

</div>
<div v-click>

**MCP Server 排障（三步）**

1. 查可达：`curl` 返回 `401` = 在线（属预期）
2. 查 `.mcp.json` 指向 `mcp.supabase.com/mcp`
3. OAuth 2.1 鉴权，重载会话

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #3ECF8E 10%, #249361 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
工具工作流域：CLI 永远用 --help 发现命令别猜，注意版本门槛，缺则回退 MCP。MCP Server 连接排障三步：查可达性（401 属预期）、查 .mcp.json 配置、OAuth 鉴权。
-->

---
transition: fade-out
---

# 域四：schema 管理——声明式 vs 命令式

先判断项目用哪种工作流

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**声明式**（有 `supabase/schemas/`）

改文件里的期望 schema 状态，再**生成并审查迁移**——别一上来手写迁移。

</div>
<div v-click>

**命令式**（无声明式）

用 `execute_sql`（MCP）/ `supabase db query`（CLI）迭代。

**别用 `apply_migration`** 反复写——它每次写迁移历史，无法迭代。

</div>
</div>

<div v-click class="mt-5">

就绪提交：跑 `db advisors` → 过安全清单 → `supabase db pull <name> --local --yes` → `migration list` 验证。

</div>

<style>
h1 { background: linear-gradient(45deg, #3ECF8E 10%, #249361 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
schema 管理域：先判断声明式还是命令式。声明式改 schemas 文件再生成迁移；命令式用 execute_sql 迭代，别用 apply_migration 反复写。就绪提交时跑 advisors、过安全清单、生成迁移、验证。
-->

---
transition: fade-out
---

# Postgres 最佳实践：8 类按影响力排

第二个技能：`supabase-postgres-best-practices`

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**CRITICAL（先做）**

- 查询性能 `query-`：WHERE/JOIN 列加索引
- 连接管理 `conn-`：连接池（transaction/session 模式）
- 安全 RLS `security-`：`(select auth.uid())`

</div>
<div v-click>

**HIGH → LOW**

- Schema 设计 `schema-`（HIGH）
- 并发 & 锁 `lock-`（MED-HIGH）
- 数据访问 `data-`：消灭 N+1（MED）
- 监控 `monitor-`（LOW-MED）
- 高级特性 `advanced-`（LOW）

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #3ECF8E 10%, #249361 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
第二个技能 postgres-best-practices：8 类规则按影响力排序。三个 CRITICAL 是查询性能、连接管理、安全 RLS；其后 schema 设计 HIGH，锁 MED-HIGH，数据访问 MED，监控和高级特性最低。让 agent 先做影响大的。
-->

---
transition: fade-out
---

# 高频规则：RLS 性能——包进 SELECT

一个改动，大表 100x+ 提速

```sql
-- 错误：auth.uid() 每行调用（100 万行 = 调 100 万次）
create policy p on orders
  using (auth.uid() = user_id);

-- 正确：包进 SELECT，只调一次并缓存
create policy p on orders
  using ((select auth.uid()) = user_id);
```

<div v-click class="mt-4 text-center">

并给 RLS 策略用到的列加索引。**连接池**同理：500 并发用户可共享约 10 个真实连接。

</div>

<style>
h1 { background: linear-gradient(45deg, #3ECF8E 10%, #249361 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
最有代表性的规则：RLS 策略里把 auth.uid() 包进 (select auth.uid())，从每行调用变成调一次并缓存，大表 100 倍以上提速，还要给策略用到的列加索引。连接池同理，把几百并发收敛到十来个真实连接。
-->

---
transition: fade-out
---

# 边界与取舍

<v-clicks>

- **不是单个技能，是官方技能集**：`supabase` + `supabase-postgres-best-practices`，各有触发条件
- **绑 Supabase 生态**：主技能围绕 Supabase 产品与约定，非通用后端指南
- **需配套工具**：完整能力依赖 Supabase CLI（有版本门槛）与 MCP Server（需 OAuth）
- **是规范不是自动化**：安全清单、Postgres 规则是「输入」，SQL 与迁移仍要你写并**验证**
- **两技能各有侧重**：主技能偏产品用法与安全，postgres 偏纯性能，按需装

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #3ECF8E 10%, #249361 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
边界：它是官方技能集不是单个技能，绑 Supabase 生态，需配套 CLI 和 MCP，是规范不是自动化——清单和规则给输入，最终 SQL 和迁移仍要你写并验证。两个技能各有侧重，按需装。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Supabase 官方技能集：`supabase` 主技能对抗训练数据过时（先 changelog 后文档）+ 内置 RLS/权限安全清单，`postgres-best-practices` 8 类规则按影响力排——给 AI agent 一份正确且安全用 Supabase 的说明书。**

<div class="mt-8 opacity-80">

官方沉淀 · 别信训练数据 · 安全清单 · Postgres 分级 · 实现必验证

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/supabase/agent-skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://supabase.com/docs/guides/getting-started/ai-skills" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #3ECF8E 10%, #249361 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Supabase 官方技能集：supabase 主技能对抗训练数据过时并内置安全清单，postgres-best-practices 8 类规则按影响力排。本质是给 AI agent 一份正确且安全地用 Supabase 的说明书。
-->
