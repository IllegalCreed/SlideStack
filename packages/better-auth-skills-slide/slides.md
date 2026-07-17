---
theme: seriph
background: https://cover.sli.dev
title: Better Auth Skills
info: |
  Better Auth 官方 skills 仓：给 TS/JS 项目加认证层的 agent 指令集。
  best-practices / create-auth / emailAndPassword / organization / twoFactor / security。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Better Auth Skills

Better Auth 官方 skills 仓——**给 TS/JS 项目加认证层**的 agent 指令集

<div class="pt-6 opacity-80">
better-auth/skills · 6 skills · 邮箱密码 / OAuth / 2FA / 组织 / 安全
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/better-auth/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Better Auth Skills 是 Better Auth 官方 org 的专用 skills 仓，把「给 TypeScript/JavaScript 项目加认证层」拆成一组可按需调用的 agent 指令。
-->

---
transition: fade-out
---

# 官方 skills 仓 + TS 认证框架

技能是「怎么用」，框架是「用什么」

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**Better Auth（框架）**

- TypeScript 全栈认证框架
- server 端 `betterAuth({...})`
- client 端 `createAuthClient({...})`
- 一条 `/api/auth/*` 路由打通
- 插件扩展 2FA / 组织 / Passkey…

</div>
<div v-click>

**Better Auth Skills（技能仓）**

- 官方 org 专用仓 `better-auth/skills`
- 6 份 `SKILL.md` + 2 斜杠命令
- 配置约定 / CLI / 迁移 / 安全清单
- 遵 Agent Skills 开放格式
- 装进 Claude Code / Cursor 即用

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

不是通用 prompt——是 Better Auth 团队沉淀的、agent 可直接执行的指令。

</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0ea5e9 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
左边是框架本身：TS 全栈认证，server 一个配置、client 一个配置、一条路由打通。右边是技能仓：6 份 SKILL.md 把怎么用沉淀成 agent 指令，遵开放格式，装进 Claude Code 即用。
-->

---
transition: fade-out
---

# 6 个 skills

一份仓覆盖认证全链路

| 技能 | 覆盖 |
| --- | --- |
| `best-practices` | 集成总纲：配置、适配器、会话、插件、类型、坑 |
| `create-auth` | 脚手架：先规划后实现（新建/迁移/增量） |
| `emailAndPassword` | 邮箱验证、密码重置、密码策略、哈希 |
| `organization` | 组织、成员、邀请、角色权限、团队、RBAC |
| `twoFactor` | TOTP、邮件/短信 OTP、备份码、受信设备 |
| `security` | 限流、密钥、CSRF、受信来源、Cookie、审计 |

<div v-click class="mt-3 text-center text-sm opacity-80">

外加 `/providers`（提供方参考）·`/explain-error`（错误码解释）两个斜杠命令。

</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0ea5e9 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
6 个技能覆盖认证全链路：best-practices 总纲、create-auth 脚手架、emailAndPassword 凭据流、organization 多租户、twoFactor 多因素、security 加固。另有两个斜杠命令。
-->

---
transition: fade-out
---

# create-auth：两阶段脚手架

强制先规划后实现，不瞎生成

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**Phase 1 规划（必做）**

1. 扫项目——框架 / ORM / 已有认证 / 包管理器
2. `AskQuestion` 结构化提问——认证方式、提供方、插件、UI 风格
3. 出计划清单，**待用户确认**

</div>
<div v-click>

**Phase 2 实现**

按决策树走：

- **新建**：装 → auth.ts → client → 路由 → 迁移 → UI
- **迁移**：并存旧库 → 逐步迁 → 移除
- **增量**：融入现有页 + 加插件

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

能从扫描确定的问题就跳过——只问真正需要用户拍板的。

</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0ea5e9 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
create-auth 的铁律是先规划后实现：Phase 1 扫项目 + 结构化提问 + 出计划待确认，Phase 2 才按新建/迁移/增量决策树落地。避免不问就生成一堆代码。
-->

---
transition: fade-out
---

# best-practices：接入五步

配 server / client / DB / 会话 / 插件的总纲

```ts
// lib/auth.ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: /* pg.Pool / Prisma / Drizzle 适配器 */,
  emailAndPassword: { enabled: true },
  socialProviders: { github: { clientId, clientSecret } },
});
```

<div v-click>

装 → 配 `BETTER_AUTH_SECRET`/`BETTER_AUTH_URL` → 写 `auth.ts` → 建路由处理器 → 跑 `npx @better-auth/cli migrate` → 验 `GET /api/auth/ok` 返回 `{ status: "ok" }`

</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

坑：配置用 ORM 的 **model 名**（`user`）不是表名；**加插件后必重跑 CLI**。

</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0ea5e9 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
best-practices 是集成总纲：一个 betterAuth 配置带 database、emailAndPassword、socialProviders。接入五步：装、配 env、写 auth.ts、建路由、跑迁移、验 /api/auth/ok。两个经典坑：用 model 名不是表名，加插件后必重跑 CLI。
-->

---
transition: fade-out
---

# emailAndPassword：邮箱密码流

验证、重置、哈希都有内建安全

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**验证与重置**

- `sendVerificationEmail` 发验证信
- `requireEmailVerification` 未验证不给登录
- `sendResetPassword` + `requestPasswordReset`
- 重置令牌默认 1h、**单次使用**
- `revokeSessionsOnPasswordReset` 踢会话

</div>
<div v-click>

**哈希与防护**

- 默认 **scrypt**（Node 原生）
- 换 Argon2id 需自定义 `hash`/`verify`
- 后台发信防时序攻击
- 恒定响应防**账号枚举**
- 回调 URL 用含 origin 的**绝对地址**

</div>
</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

换哈希算法会导致旧用户登不上——必须先规划迁移。

</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0ea5e9 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
emailAndPassword 覆盖验证、重置、哈希。验证与重置：sendVerificationEmail、requireEmailVerification、重置令牌单次使用。哈希默认 scrypt，可换 Argon2id。内建后台发信防时序攻击、恒定响应防账号枚举。注意换哈希算法要迁移。
-->

---
transition: fade-out
---

# twoFactor：多因素认证

TOTP + OTP + 备份码 + 受信设备

<v-clicks>

- **开启**：`twoFactor.enable({ password })` → 返回 `totpURI`（QR 码）+ `backupCodes`
- **验证器**：`verifyTotp({ code, trustDevice })`，接受前后一个周期的码
- **OTP**：邮件/短信投递，`storeOTP` 可选 plain/encrypted/hashed
- **备份码**：单次使用，可 `generateBackupCodes` 重生成
- **登录流**：`signIn.email` 返回 `twoFactorRedirect: true` → 跳 `/2fa` 验证 → 建会话

</v-clicks>

<div v-click class="mt-4 text-center text-sm opacity-80">

TOTP 密钥用 auth secret 加密、恒定时间比对；**2FA 只能给凭据账户开**。

</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0ea5e9 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
twoFactor 覆盖 TOTP、OTP、备份码、受信设备。开启返回 totpURI 生成 QR 码加备份码，twoFactorEnabled 首次验证成功才置 true。登录流靠 twoFactorRedirect 跳转 /2fa。TOTP 密钥加密存储、恒定时间比对，只能给凭据账户开。
-->

---
transition: fade-out
---

# organization：多租户 + RBAC

组织、成员、邀请、团队、动态角色

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**组织与成员**

- 创建者自动获 `owner`
- 活跃组织存会话、划定作用域
- `inviteMember` / `getInvitationURL`
- 邀请默认 48h、只有被邀邮箱可接受
- **末位 owner 不可移除/离开**

</div>
<div v-click>

**角色与团队**

- 默认 `owner` / `admin` / `member`
- `hasPermission` 动态鉴权
- 动态访问控制：自定义 `createRole`
- `teams.enabled` 开团队
- `maximumTeams` / `maximumMembersPerTeam`

</div>
</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

删组织会连带删成员/邀请/团队——用 `disableOrganizationDeletion` 或钩子软删。

</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0ea5e9 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
organization 做多租户和 RBAC。组织与成员：创建者自动 owner，活跃组织划作用域，邀请默认 48 小时且只有被邀邮箱可接受，末位 owner 不可移除。角色与团队：默认三角色，hasPermission 动态鉴权，动态访问控制可自定义角色，teams 开团队。
-->

---
transition: fade-out
---

# security：安全加固

上线前的一整套默认防护

<div class="grid grid-cols-2 gap-4 mt-4 text-sm">
<div v-click>

**密钥**：`BETTER_AUTH_SECRET` ≥ 32 字符，生产拒占位符

</div>
<div v-click>

**限流**：生产默认开，敏感端点 3 请求/10 秒

</div>
<div v-click>

**CSRF**：多层防护，`disableCSRFCheck` 默认 false 别关

</div>
<div v-click>

**受信来源**：`trustedOrigins` 支持通配，非法 URL 返回 403

</div>
<div v-click>

**Cookie**：`secure` + `sameSite` + `httpOnly` + `__Secure-`

</div>
<div v-click>

**OAuth**：自动 PKCE，`encryptOAuthTokens` AES-256-GCM

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

账号枚举防护内建：恒定响应 + 哑操作 + 后台发信，报「凭据无效」而非「用户不存在」。

</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0ea5e9 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
security 是上线前的加固清单：密钥 32 字符起、限流默认开、CSRF 别关、受信来源校验、Cookie 安全属性、OAuth 自动 PKCE 加令牌加密。账号枚举防护内建，统一报凭据无效。
-->

---
transition: fade-out
---

# 认证能力全景

核心 + 插件，一仓覆盖

<div class="grid grid-cols-2 gap-x-8 gap-y-2 mt-6">
<div v-click>🔑 **邮箱密码** — 验证/重置/哈希</div>
<div v-click>🌐 **社交 OAuth** — Google/GitHub/Apple…</div>
<div v-click>📱 **2FA / MFA** — TOTP/OTP/备份码</div>
<div v-click>🔐 **Passkeys** — WebAuthn</div>
<div v-click>✉️ **Magic Links** — 无密码邮件登录</div>
<div v-click>🏢 **多租户组织** — 成员/邀请/团队</div>
<div v-click>🛡️ **RBAC** — owner/admin/member + 自定义</div>
<div v-click>♻️ **无状态会话** — compact/jwt/jwe</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0ea5e9 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
认证能力全景：邮箱密码、社交 OAuth、2FA、Passkeys、Magic Links、多租户组织、RBAC、无状态会话——由框架核心加插件提供，一仓覆盖。
-->

---
transition: fade-out
---

# 框架集成

一份 auth，多框架路由处理器

| 框架 | 路由处理器 |
| --- | --- |
| Next.js（App/Pages） | `toNextJsHandler(auth)` |
| Express | `toNodeHandler(auth)` |
| SvelteKit | `svelteKitHandler(auth)`（`hooks.server.ts`） |
| SolidStart | `solidStartHandler(auth)` |
| Hono | `auth.handler(c.req.raw)` |

<div v-click class="mt-3 text-center text-sm opacity-80">

client 按框架导入：`better-auth/react` · `/vue` · `/svelte` · `/solid` · `/client`；DB 支持 Kysely 内置 / Prisma / Drizzle / MongoDB / 直连。

</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0ea5e9 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
框架集成：同一份 auth 配置，各框架有对应路由处理器——Next.js、Express、SvelteKit、SolidStart、Hono。client 按框架导入 react/vue/svelte/solid。DB 支持内置 Kysely、Prisma、Drizzle、MongoDB 或直连。
-->

---
transition: fade-out
---

# 反模式与边界

照做安全，绕开就是坑

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**别踩的坑**

- 关 CSRF / origin 校验
- 用弱/占位密钥、密钥进版本库
- serverless 用 memory 限流
- 配置写表名而非 model 名
- 加插件不重跑 CLI

</div>
<div v-click>

**边界**

- 强绑 Better Auth 框架，不迁移别的方案
- SKILL.md 是指令，API 以官网为准
- 打包插件声明 2 个，仓库含 6 份
- OAuth 应用 / 部署 env 仍需人工

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0ea5e9 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
左边是反模式：关 CSRF、弱密钥、serverless 用 memory 限流、写表名、加插件不重跑。右边是边界：强绑 Better Auth，SKILL.md 是指令 API 以官网为准，打包插件声明 2 个但仓库含 6 份，OAuth 和部署 env 仍需人工。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Better Auth 官方 skills 仓：6 份 SKILL.md 把「给 TS/JS 项目加认证层」沉淀成 agent 指令——create-auth 脚手架、best-practices 集成、邮箱密码 / 2FA / 组织 / 安全，集成 Next.js / SvelteKit / Express。**

<div class="mt-8 opacity-80">

官方沉淀 · 先规划后实现 · 能力全覆盖 · 安全默认到位 · 框架无关

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/better-auth/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://www.better-auth.com/docs" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #059669 10%, #0ea5e9 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Better Auth 官方 skills 仓：6 份 SKILL.md 把给 TS/JS 项目加认证层沉淀成 agent 指令，create-auth 脚手架加 best-practices 集成，覆盖邮箱密码、2FA、组织、安全，集成主流框架。官方沉淀、先规划后实现、安全默认到位。
-->
