---
theme: seriph
background: https://cover.sli.dev
title: NestJS Best Practices
info: |
  NestJS Best Practices（Kadajett/agent-nestjs-skills）：社区第三方的 NestJS
  最佳实践 Agent Skill，40 规则 / 10 类，按严重度分级。非 NestJS 官方。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# NestJS Best Practices

社区第三方 Agent Skill —— **40 规则 / 10 类**，按严重度分级

<div class="pt-6 opacity-80">
Kadajett/agent-nestjs-skills · 架构 / DI / 安全 / 性能 / 数据库 · MIT · 非官方
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/Kadajett/agent-nestjs-skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #E0234E 10%, #ff7a95 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
NestJS Best Practices 是社区作者 Kadajett 的 agent-nestjs-skills，把 NestJS 生产级最佳实践整理成 40 条规则 10 大类的 Agent Skill，按影响力分级。重要：这是社区第三方，不是 NestJS 官方。
-->

---
transition: fade-out
---

# 定位：社区第三方（非官方）

一份为 agent 优化的 NestJS 规范，不是框架也不是官方

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**是什么**

- **40 规则 / 10 类**的 NestJS 最佳实践
- 每条含**严重度 + 反模式 + 正例**
- 装进 agent 当「随身规范」写/审/重构
- `npx skills add Kadajett/agent-nestjs-skills`

</div>
<div v-click>

**归属（须说清）**

- 作者 **Kadajett**，MIT，v1.1.0
- **不是 NestJS 官方**
- nestjs org **无官方 skill 仓**
- 以 docs.nestjs.com 为最终裁决

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

支持 Claude Code · OpenCode · Codex · Cursor · Antigravity · Roo Code

</div>

<style>
h1 { background: linear-gradient(45deg, #E0234E 10%, #ff7a95 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
定位要点：40 规则 10 类，每条含严重度、反模式、正例。核心是它是社区第三方，非 NestJS 官方，官方没有同类 skill 仓，用时以官方文档为准。
-->

---
transition: fade-out
---

# 40 规则，10 类，按影响力排

前面的类更关键 —— 让 agent「先修影响大的」

<div class="grid grid-cols-2 gap-6 mt-6">
<div v-click>

- **1. 架构** — CRITICAL
- **2. 依赖注入** — CRITICAL
- **3. 错误处理** — HIGH
- **4. 安全** — HIGH
- **5. 性能** — HIGH

</div>
<div v-click>

- **6. 测试** — MEDIUM-HIGH
- **7. 数据库 / ORM** — MEDIUM-HIGH
- **8. API 设计** — MEDIUM
- **9. 微服务** — MEDIUM
- **10. DevOps** — LOW-MEDIUM

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">

优先级排序是关键设计：架构 / DI 的崩溃比 DevOps 的润色更该先修。

</div>

<style>
h1 { background: linear-gradient(45deg, #E0234E 10%, #ff7a95 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
40 条规则分 10 类，按影响力优先级排。架构和依赖注入是 CRITICAL，最该先修；DevOps 是 LOW-MEDIUM。优先级让 agent 不平均用力。
-->

---
transition: fade-out
---

# 严重度：5 档分级

每条规则 frontmatter 都带 impact

| 档位 | 含义 |
| --- | --- |
| **CRITICAL** | 运行时崩溃 / 安全漏洞 / 架构崩坏 |
| **HIGH** | 显著影响可靠性、安全、可维护性 |
| **MEDIUM-HIGH** | 明显影响质量与开发体验 |
| **MEDIUM** | 中等影响代码质量与最佳实践 |
| **LOW-MEDIUM** | 一致性与可维护性的次要改进 |

<div v-click class="mt-4 text-center text-sm opacity-80">

条级可 ≠ 类级：安全类整体 HIGH，但 JWT 鉴权条级是 **CRITICAL**。

</div>

<style>
h1 { background: linear-gradient(45deg, #E0234E 10%, #ff7a95 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
严重度 5 档，从 CRITICAL 到 LOW-MEDIUM。注意条级严重度可能和类级不同：安全类整体 HIGH，但其中 JWT 鉴权这一条是 CRITICAL。
-->

---
transition: fade-out
---

# 架构（CRITICAL）：头两大杀手

循环依赖 & god service

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**避免循环依赖**

- A 导入 B、B 又导入 A → **#1 崩溃源**
- 解法 1：抽第三方 `SharedModule`
- 解法 2：用**事件**解耦

</div>
<div v-click>

**单一职责**

- 拒 `UserAndOrderService` god service
- 名字带「And」多半违规
- 编排放 controller / orchestrator

</div>
</div>

<div v-click class="mt-4">

还有：**按特性模块组织**（`users/` 装齐 controller/service/dto，非技术分层）、模块共享、事件驱动、仓储模式。

</div>

<style>
h1 { background: linear-gradient(45deg, #E0234E 10%, #ff7a95 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
架构类 CRITICAL。两大杀手：循环依赖（#1 崩溃源，用共享模块或事件解耦）和 god service（违反单一职责）。还要求按特性模块组织而非技术分层。
-->

---
transition: fade-out
---

# 循环依赖：反模式 → 事件解耦

```typescript
// A 依赖 B、B 又依赖 A → 运行时崩溃（#1 崩溃源）
// 正解：发事件，两个模块互不直接 import
@Injectable()
export class UsersService {
  constructor(private events: EventEmitter2) {}
  async create(dto: CreateUserDto) {
    const user = await this.repo.save(dto);
    this.events.emit('user.created', user); // Orders 侧 @OnEvent 监听
    return user;
  }
}
```

<div class="mt-3 text-center text-sm opacity-80">

`OrdersService` 用 `@OnEvent('user.created')` 响应，无需直接依赖 `UsersService`。

</div>

<style>
h1 { background: linear-gradient(45deg, #E0234E 10%, #ff7a95 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
循环依赖的正解之一是事件解耦：UsersService 发 user.created 事件，OrdersService 用 @OnEvent 监听响应，两者不再互相 import，打破循环。
-->

---
transition: fade-out
---

# 依赖注入（CRITICAL）

IoC 容器强大但易误用

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**3 种 scope**

- `DEFAULT` 单例（最常用）
- `REQUEST` 每请求一实例
- `TRANSIENT` 每次注入新实例
- ⚠️ 单例存请求态 → **并发串号**

</div>
<div v-click>

**接口注入令牌**

- `interface` 运行时被**擦除**
- 不能直接当注入令牌
- 用 `Symbol` 令牌 + `@Inject()`
- 或用**抽象类**（携带类型）

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

还要求：**构造函数注入优于属性注入**（显式、可测试）；避免 service locator；守 ISP / LSP。

</div>

<style>
h1 { background: linear-gradient(45deg, #E0234E 10%, #ff7a95 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
DI 类 CRITICAL。三个 scope：单例、请求、瞬态，单例里存请求态会并发串号。接口在运行时被擦除，要用 Symbol 令牌或抽象类注入。优先构造函数注入。
-->

---
transition: fade-out
---

# 安全：守卫做鉴权 / RBAC

取代每个 handler 手写 `if (!req.user)`

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>('roles',
      [ctx.getHandler(), ctx.getClass()]);
    if (!roles) return true;
    const { user } = ctx.switchToHttp().getRequest();
    return roles.some((r) => user.roles?.includes(r));
  }
}
```

<div class="mt-2 text-center text-sm opacity-80">

配 `@Roles(Role.Admin)` 装饰器 + `APP_GUARD` 全局注册 + `@Public()` 放行。

</div>

<style>
h1 { background: linear-gradient(45deg, #E0234E 10%, #ff7a95 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
安全类：用守卫做鉴权和 RBAC。RolesGuard 读 @Roles 元数据判断角色，配 APP_GUARD 全局注册、@Public 放行个别路由，取代在每个 handler 里手写鉴权检查。
-->

---
transition: fade-out
---

# 安全：JWT 鉴权（条级 CRITICAL）

`@nestjs/jwt` + `@nestjs/passport`

<v-clicks>

- **密钥从 `ConfigService` 读**，绝不硬编码进代码
- **access token 短命**（如 `15m`），配 **refresh token**
- **payload 只放必要非敏感字段**（`sub`/`roles`）——绝不放 password / ssn
- `JwtStrategy.validate` 校验用户**仍存在且未在改密后失效**
- 配合限流 `@nestjs/throttler`：登录端点收紧到「每分钟 N 次」

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #E0234E 10%, #ff7a95 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
JWT 鉴权是安全类里条级 CRITICAL 的规则。要点：密钥从 Config 读不硬编码、access 短命配 refresh、payload 不放敏感字段、validate 里校验用户有效性、登录端点配限流防爆破。
-->

---
transition: fade-out
---

# 安全：全局校验输入

DTO + class-validator + 全局 ValidationPipe

```typescript
// main.ts —— 别信任任何用户输入
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,            // 剥离未声明属性
  forbidNonWhitelisted: true, // 出现未知属性直接报错
  transform: true,            // 自动转成 DTO 类型
}));
```

<div class="mt-3 text-center text-sm opacity-80">

DTO 用 `@IsEmail()` `@IsInt()` `@Min()` `@Matches()` 等；配 `ParseUUIDPipe`/`ParseIntPipe` 管道；`sanitize-html` 防 XSS。

</div>

<style>
h1 { background: linear-gradient(45deg, #E0234E 10%, #ff7a95 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
校验一切输入：DTO 加 class-validator 装饰器，main.ts 开全局 ValidationPipe，whitelist 剥离未声明属性、forbidNonWhitelisted 报错、transform 自动转类型。配合管道和 sanitize-html。
-->

---
transition: fade-out
---

# 错误处理 & API 设计

集中错误 + 稳定 API 契约

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**错误（HIGH）**

- 异常过滤器**集中**处理，别 controller 里 `try/catch` 手拼
- service 直接抛 `NotFoundException`
- `APP_FILTER` 全局统一格式

</div>
<div v-click>

**API（MEDIUM）**

- DTO + `@Exclude()` 序列化，别裸返回实体
- 拦截器管横切（日志/包装/超时）
- 管道转换、内置版本化

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

`@Exclude()` 标 `passwordHash`/`ssn` + 全局 `ClassSerializerInterceptor` = 自动不泄露敏感字段。

</div>

<style>
h1 { background: linear-gradient(45deg, #E0234E 10%, #ff7a95 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
错误处理用异常过滤器集中，service 直接抛 HttpException，APP_FILTER 全局统一格式。API 设计用 DTO 和 @Exclude 序列化防泄露、拦截器管横切、内置版本化。
-->

---
transition: fade-out
---

# 数据库（TypeORM）：3 大关切

示例基于 **TypeORM**，非 Prisma

<v-clicks>

- **事务**：`dataSource.transaction(async (manager) => {...})` 自动回滚；复杂场景用 `QueryRunner` 手控 commit/rollback/release
- **避免 N+1**：`relations: ['items']` 预加载、`QueryBuilder.leftJoinAndSelect`、GraphQL 用 `DataLoader` 批处理
- **迁移**：生产**禁 `synchronize: true`**（会丢列/表/数据）；用 `MigrationInterface` 的 `up`/`down`，`migrationsRun: true` 启动跑

</v-clicks>

<div v-click class="mt-4 text-center text-sm opacity-80">

⚠️ 数据库层绑 TypeORM —— 用 Prisma / Mongoose 需自行迁移这些模式。

</div>

<style>
h1 { background: linear-gradient(45deg, #E0234E 10%, #ff7a95 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
数据库类基于 TypeORM。三大关切：事务用 DataSource.transaction 自动回滚；避免 N+1 用 relations 预加载或 DataLoader；迁移禁生产 synchronize，用 MigrationInterface。注意示例绑 TypeORM 非 Prisma。
-->

---
transition: fade-out
---

# 性能 · 微服务 · DevOps

上生产的收尾关切

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**性能（HIGH）**

- `CacheModule` 策略缓存 + 失效
- async 生命周期钩子**要 `await`**
- 优化 DB 查询、大模块懒加载

**微服务（MEDIUM）**

- `terminus` liveness / readiness 探针
- BullMQ 后台任务 + 重试

</div>
<div v-click>

**DevOps（LOW-MEDIUM）**

- `@nestjs/config` + **Joi 启动校验**（缺 `JWT_SECRET` 直接 fail-fast）
- 结构化 JSON 日志（别 `console.log`）
- **优雅关闭** `enableShutdownHooks()`

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #E0234E 10%, #ff7a95 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
性能：缓存、async 钩子 await、DB 优化、懒加载。微服务：terminus 健康检查、BullMQ 队列。DevOps：config + Joi 启动校验 fail-fast、结构化日志、优雅关闭零停机。
-->

---
transition: fade-out
---

# 边界与版本背景

用之前要知道的

<v-clicks>

- **社区第三方、非官方**：分级是作者观点，以 docs.nestjs.com 为准
- **数据库绑 TypeORM**：`db-*` 不含 Prisma，用别的 ORM 需替换示例
- **规则是输入、判断靠人**：40 条是清单，项目取舍仍需工程师
- **版本无关**：不锁 NestJS 大版本；如 **NestJS 11 → Express 5**，通配路由需命名（`@Get('*splat')`）属框架迁移，非本 skill 规则

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #E0234E 10%, #ff7a95 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
边界：社区非官方以官方文档为准；数据库绑 TypeORM 非 Prisma；规则是输入判断靠人；版本无关，NestJS 11 升 Express 5 的命名通配路由属框架迁移事项，不是本 skill 的规则。
-->

---
layout: center
class: text-center
---

# 一句话记住

**社区第三方 Agent Skill：40 规则 / 10 类，按 5 档严重度分级，架构 / DI 是 CRITICAL；覆盖 DI、守卫 RBAC、JWT、TypeORM 事务与迁移、缓存限流、优雅关闭。非 NestJS 官方。**

<div class="mt-8 opacity-80">

40 规则 · 10 类 · 严重度分级 · 反模式+正例 · TypeORM · 非官方

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/Kadajett/agent-nestjs-skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://docs.nestjs.com" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #E0234E 10%, #ff7a95 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。社区第三方 skill，40 规则 10 类按严重度分级，架构 DI 是 CRITICAL。覆盖 DI、守卫 RBAC、JWT、TypeORM 事务迁移、缓存限流、优雅关闭。记住它非 NestJS 官方，以官方文档为准。
-->
