---
theme: seriph
background: https://cover.sli.dev
title: Prisma Skills
info: |
  Prisma 官方 agent 技能集：CLI、Client API、建库、Prisma 7 升级、driver adapter、Prisma Postgres、Compute。
  prisma/skills · MIT。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Prisma Skills

Prisma 官方技能集——把 **Prisma 7 新范式**喂给 AI agent

<div class="pt-6 opacity-80">
prisma/skills · cli / client / 建库 / 升级 / adapter / postgres / compute · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/prisma/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #818CF8 10%, #5A67D8 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Prisma Skills 是 Prisma 官方出品的 agent 技能集，9 个技能覆盖 Prisma ORM 全流程，重点把 Prisma 7 的 driver adapter、prisma-client 生成器、prisma.config.ts 等新范式喂给 AI agent。
-->

---
transition: fade-out
---

# 是什么：官方 9 技能，一条命令装

Prisma 团队出品 · agentskills.io 格式 · MIT

<v-clicks>

- **9 个技能**——覆盖 CLI、查询、建库、升级、adapter、Postgres、部署
- **渐进披露**——启动只加载技能名+描述，`SKILL.md` 按需载入，省 token
- **精准触发**——每技能 description 写「Use when…」+ 触发词，agent 自动激活
- **锁 Prisma 7**——ORM 技能对准 7.6.x，把新范式当默认写法

</v-clicks>

<div v-click class="mt-4 text-center">

```bash
npx skills add prisma/skills
```

</div>

<style>
h1 { background: linear-gradient(45deg, #5A67D8 10%, #2C5282 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Prisma Skills 是官方出品的 9 个技能，遵循 agentskills.io 开放格式。渐进披露让启动只加载名字和描述，用到才载入完整 SKILL.md。锁定 Prisma 7.6.x，把新范式当默认。
-->

---
transition: fade-out
---

# 9 个技能，四组分工

<div class="grid grid-cols-2 gap-5 mt-6">
<div v-click>

**日常两把**

- `prisma-cli` 命令全参考
- `prisma-client-api` 查询/事务

</div>
<div v-click>

**建库三件**

- `prisma-database-setup` 选库配 adapter
- `prisma-postgres` / `prisma-postgres-setup`

</div>
<div v-click>

**进阶两件**

- `prisma-driver-adapter-implementation`
- `prisma-upgrade-v7` v6→v7

</div>
<div v-click>

**决策 + 部署**

- `prisma-mongodb-upgrade` Mongo 决策
- `prisma-compute` 应用部署

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #5A67D8 10%, #2C5282 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
9 个技能分四组：日常写代码用 cli 和 client-api；建库用 database-setup 加两个 postgres 技能；进阶是写 adapter 和升级 v7；最后是 MongoDB 决策和 Compute 部署。
-->

---
transition: fade-out
---

# 日常两把：cli + client-api

写 Prisma 代码的主力

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**`prisma-cli`**

`init` · `generate` · `dev` · `migrate` · `db` · `studio` · `mcp`

迁移类为 CRITICAL；Bun 要带 `--bun`

</div>
<div v-click>

**`prisma-client-api`**

`findMany` · `create` · `upsert` · `$transaction` · `$queryRaw`

`select`/`include`/`where` + 关系过滤 `some`/`every`/`none`

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">

边界：应用**部署**命令不在 cli，走 `prisma-compute`。

</div>

<style>
h1 { background: linear-gradient(45deg, #5A67D8 10%, #2C5282 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
日常两把：prisma-cli 是命令全参考，从建项目到迁移到 studio；prisma-client-api 是查询全参考，CRUD、事务、原始 SQL、过滤关系。注意部署命令不在 cli，走 compute。
-->

---
transition: fade-out
---

# client-api：查询长这样

类型安全的 CRUD + 事务

<div v-click>

```typescript
// 查询 + 关系 + 分页
const users = await prisma.user.findMany({
  where: { role: 'ADMIN' },
  include: { posts: true },
  take: 10,
})

// 数组式事务
await prisma.$transaction([
  prisma.user.create({ data: { email: 'a@b.co' } }),
  prisma.post.create({ data: { title: 'Hi' } }),
])
```

</div>

<style>
h1 { background: linear-gradient(45deg, #5A67D8 10%, #2C5282 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
prisma-client-api 的查询是类型安全的：findMany 加 where、include 关系、take 分页；事务用 $transaction 传数组，全部成功或全部回滚。这些都是 client-api 技能覆盖的日常写法。
-->

---
transition: fade-out
---

# 建库：选 provider + 配 adapter

`prisma-database-setup` 的核心

| 数据库 | Adapter | JS 驱动 |
| --- | --- | --- |
| PostgreSQL / CockroachDB | `@prisma/adapter-pg` | `pg` |
| MySQL / MariaDB | `@prisma/adapter-mariadb` | `mariadb` |
| SQLite | `@prisma/adapter-better-sqlite3` | `better-sqlite3` |
| SQL Server | `@prisma/adapter-mssql` | `node-mssql` |

<div v-click class="mt-3 text-center text-sm opacity-80">

**MongoDB 例外**：不走 SQL adapter，留 Prisma 6.x，schema 保留 `url = env(...)`。

</div>

<style>
h1 { background: linear-gradient(45deg, #5A67D8 10%, #2C5282 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
prisma-database-setup 支持 6 种以上数据库。核心是每个 SQL 库配对应的 driver adapter 加 JS 驱动。MongoDB 是例外，不走 SQL adapter，留在 Prisma 6.x。
-->

---
transition: fade-out
---

# Prisma 7：五大破坏性变更

`prisma-upgrade-v7` 的核心

| 变更 | v6 | v7 |
| --- | --- | --- |
| 生成器 | `prisma-client-js` | `prisma-client`（新默认） |
| 输出路径 | 自动 | **必须显式** `output` |
| Driver adapter | 可选 | **SQL 库必需** |
| 配置 | `.env` + schema | `prisma.config.ts` |
| env 加载 | 自动 | **手动** dotenv |

<div v-click class="mt-3 text-center text-sm opacity-80">

外加：ESM 优先 · `Prisma.validator()` → `satisfies` · `$use()` → Client Extensions

</div>

<style>
h1 { background: linear-gradient(45deg, #5A67D8 10%, #2C5282 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Prisma 7 五大破坏性变更：生成器换成 prisma-client、输出路径必须显式、SQL 库必须装 driver adapter、配置搬到 prisma.config.ts、env 要手动加载。外加 ESM 优先、validator 换 satisfies、中间件换扩展。
-->

---
transition: fade-out
---

# v6 → v7：升级一条龙

`prisma-upgrade-v7` 的快捷命令

<div v-click>

```bash
# 1. 升级包
npm install @prisma/client@7
npm install -D prisma@7

# 2. 装 driver adapter（PostgreSQL 为例）
npm install @prisma/adapter-pg pg

# 3. 重新生成客户端
npx prisma generate
```

</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

再改 schema 生成器为 `prisma-client`、建 `prisma.config.ts`、换客户端实例化。

</div>

<style>
h1 { background: linear-gradient(45deg, #5A67D8 10%, #2C5282 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
v6 到 v7 升级一条龙：先升级 @prisma/client 和 prisma 到 7，再装 driver adapter，最后重新 generate。命令跑完还要改 schema 生成器、建 prisma.config.ts、换客户端实例化。
-->

---
transition: fade-out
---

# v7 客户端：adapter 是必需的

不再是 `new PrismaClient()`

<div v-click>

```typescript
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter })
```

</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

本站 quiz-monorepo 自身就是 **Prisma 7 + MariaDB adapter** 的实例。

</div>

<style>
h1 { background: linear-gradient(45deg, #5A67D8 10%, #2C5282 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
v7 里客户端实例化必须传 adapter，不再是空的 new PrismaClient。先建 PrismaPg adapter 传连接串，再传给 PrismaClient。本项目自己就用 Prisma 7 加 MariaDB adapter。
-->

---
transition: fade-out
---

# 写 adapter：最坑的事务契约

`prisma-driver-adapter-implementation`

<div v-click>

```typescript
commit(): Promise<void> {
  // 不要发 COMMIT！Prisma 用 executeRaw 自己发
  this.release()          // 只释放连接
  return Promise.resolve()
}
```

</div>

<v-clicks>

- `commit()`/`rollback()` **只是钩子，绝不发 SQL**
- 嵌套事务：depth 1 → `BEGIN`；depth > 1 → `SAVEPOINT`
- 列类型映射到 `ColumnTypeEnum`；错误转 `DriverAdapterError`

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #5A67D8 10%, #2C5282 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
写 driver adapter 最容易踩的契约：commit 和 rollback 只是生命周期钩子，绝不能发 SQL，Prisma 会自己用 executeRaw 发 COMMIT 和 ROLLBACK。嵌套事务用 savepoint，列类型映射 ColumnTypeEnum，错误转 DriverAdapterError。
-->

---
transition: fade-out
---

# Prisma Postgres：秒建 + 编程式

`prisma-postgres`

<v-clicks>

- **秒建临时库**——`npx create-db@latest`（别名 `create-pg`/`create-postgres`），约 24h 后自动删
- **Console**——`console.prisma.io` 建项目、Studio 看数据
- **接现有库**——`prisma postgres link` 更新本地 `.env`
- **编程式**——Management API（`api.prisma.io/v1`）+ 类型 SDK `@prisma/management-api-sdk`

</v-clicks>

<div v-click class="mt-4 text-center">

```bash
npx create-db@latest
```

</div>

<style>
h1 { background: linear-gradient(45deg, #5A67D8 10%, #2C5282 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Prisma Postgres 多种接入：create-db 秒建临时库 24 小时自动删；Console 手动建；postgres link 接现有库更新 .env；编程式用 Management API 加类型化 SDK。
-->

---
layout: two-cols
transition: fade-out
---

# MongoDB：唯一没有 v7 路

`prisma-mongodb-upgrade`

拦一个错误计划——

**MongoDB 不能升 Prisma 7**

铁律：

- 绝不建议 Mongo「升 v7」
- 绝不为版本问题改写到 SQL

::right::

<div class="mt-16 pl-4">

| 版本 | Mongo 状态 |
| --- | --- |
| v6 | 完整支持（维护线） |
| v7 | **永无连接器** |
| Next | Early Access |

<div class="mt-4 text-sm opacity-80">

真正的决策：迁 **Prisma Next** 还是守 **最新 v6**。

</div>

</div>

<style>
h1 { background: linear-gradient(45deg, #5A67D8 10%, #2C5282 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
MongoDB 是唯一没有 v7 路的队列：v6 完整支持是维护线，v7 永远不出 Mongo 连接器，Prisma Next 处于 Early Access。铁律是绝不建议升 v7、绝不为版本问题改写到 SQL。真正的决策是迁 Next 还是守 v6。
-->

---
transition: fade-out
---

# 部署 + 反模式

`prisma-compute` 与常见坑

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**部署（Compute）**

- `@prisma/cli app deploy`
- `compute:deploy` 脚本
- `create-prisma --deploy`
- 先核对当前命令面再动手

</div>
<div v-click>

**反模式**

- Mongo 升 v7 ❌
- SQL 库忘装 adapter ❌
- `commit()` 里发 SQL ❌
- 拿 cli 干部署 ❌

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #5A67D8 10%, #2C5282 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
部署走 prisma-compute：app deploy、compute:deploy、create-prisma --deploy，但要先核对当前命令面。反模式：Mongo 升 v7、SQL 库忘装 adapter、commit 里发 SQL、拿 cli 干部署。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Prisma 官方 9 技能：cli + client-api 写代码、database-setup 配 adapter、upgrade-v7 升级（SQL 必须 driver adapter）、postgres 秒建库、Mongo 无 v7 路、compute 部署。渐进披露省 token。**

<div class="mt-8 opacity-80">

官方出品 · Prisma 7 范式 · driver adapter 必需 · 渐进披露

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/prisma/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://www.prisma.io/docs" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #5A67D8 10%, #2C5282 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Prisma 官方 9 技能：cli 和 client-api 写代码、database-setup 配 adapter、upgrade-v7 升级、postgres 秒建库、Mongo 无 v7 路、compute 部署。渐进披露省 token，把 Prisma 7 新范式喂给 agent。
-->
