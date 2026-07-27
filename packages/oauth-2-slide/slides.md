---
theme: seriph
background: https://cover.sli.dev
title: OAuth 2.0 授权框架
info: |
  OAuth 2.0 授权框架：4 种流程 · PKCE · Bearer Token · RFC 9700 BCP 284
  RFC 6749 / RFC 9700 / RFC 7636 / RFC 6750

  Learn more at https://datatracker.ietf.org/doc/html/rfc9700
drawings:
  persist: false
transition: slide-left
mdc: true
---

# OAuth 2.0 授权框架

第三方授权 · 4 种流程 · PKCE · Bearer Token · RFC 9700 安全基线

<div class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
OAuth 2.0 解决的核心问题：用户让第三方应用读自己数据，但不交出密码。
-->

---
transition: fade-out
---

# 它解决什么问题

把"存密码"换成"发令牌"——可撤销、短时效、限权

- **场景**：用户 A 想让应用 B 读自己在服务 C 上的数据
- **传统做法**：A 把在 C 的密码交给 B → B 拿到完整权限，无法限制范围
- **OAuth 做法**：A 在 C 的 AS 上点"允许 B 读"，AS 给 B 一张**短时令牌**，B 持令牌取数

> B 拿不到 A 的密码，A 也可随时撤销 B 的访问权

<!--
核心区别：凭据委托 → 令牌化委托。
-->

---
layout: two-cols
layoutClass: gap-8
---

# 四个角色

OAuth 2.0 的核心抽象

| 角色 | 含义 |
|------|------|
| **Resource Owner** | 用户（能授权者） |
| **Client** | 第三方应用 |
| **Authorization Server** | 签发 token 的 AS |
| **Resource Server** | 受保护资源（RS） |

::right::

<br>

**典型映射**

| 例子 | 角色 |
|------|------|
| 我 | RO |
| Cursor 编辑器 | Client |
| github.com/login/oauth | AS |
| api.github.com | RS |
| `repo read:user` | scope |
| Bearer JWT | Access Token |

<!--
角色映射是理解 OAuth 所有流程的基础。
-->

---

# 四种主要流程

按 RFC 9700 现行安全基线排序

| 流程 | response/grant_type | 有 user? | refresh? | 现状 |
|------|---------------------|----------|----------|------|
| **Authorization Code** | `code` / `authorization_code` | 是 | 是 | **首选** |
| **+ PKCE** | 同上 + `code_challenge` | 是 | 是 | **强制** |
| **Client Credentials** | `client_credentials` | **否** | **否** | M2M 推荐 |
| **Refresh Token** | `refresh_token` | 否（续期）| 旋转 | 推荐 |
| ~~Implicit~~ | `token` | 是 | 否 | **§2.1.2 废弃** |
| ~~Password~~ | `password` | 是 | 是 | **§2.4 MUST NOT** |

> RFC 9700（2025-01，BCP 284）：所有客户端一律 Authorization Code + PKCE

<!--
记住：Implicit 与 Password 已被 RFC 9700 正式废弃。
-->

---
layout: section
---

# Authorization Code + PKCE

所有客户端的首选 · RFC 9700 强制

<!--
端到端走一遍 PKCE 的关键步骤。
-->

---

# 端到端时序

Authorization Code Flow 的 6 步

```text
1. 客户端生成 code_verifier（43~128 unreserved，≥256 位熵）
2. 算 code_challenge = BASE64URL(SHA256(ASCII(code_verifier)))
3. GET /authorize?response_type=code&client_id=...
                &redirect_uri=...&scope=...&state=<随机>
                &code_challenge=...&code_challenge_method=S256
4. 用户登录 + 同意 → AS 回 302 ?code=xxx&state=<原值>
5. POST /token grant_type=authorization_code
              code=xxx  code_verifier=<步骤1原值>
6. AS 校验 SHA256(verifier)==challenge → 发 access_token + refresh_token?
```

> state 与 code 都经 redirect_uri 的 **query** 回传；code 一次性、短时效

<!--
关键：AS 在第 6 步用第 3 步存的 challenge 与第 5 步 verifier 比对。
-->

---
layout: two-cols
layoutClass: gap-8
---

# PKCE 的核心防御

把授权码绑死到客户端持有的 verifier

- 攻击者拿到 `code`（日志/Referer/恶意 redirect）也没用——没 verifier 无法在 /token 兑换
- 提供强于 state 的 CSRF 防护（即便攻击者能读取授权响应）

**参数约束**

- `code_verifier`: 43–128 字符
- 字符集: RFC 3986 unreserved
- 熵: ≥ 256 位
- `code_challenge_method`: **S256**（不推荐 plain）

::right::

<br>

**用 Node 算 PKCE**

```bash
node -e '
const c = require("crypto");
const v = c.randomBytes(32).toString("base64url");
const ch = c.createHash("sha256")
            .update(v).digest("base64url");
console.log({ v, ch });'
```

> **禁止降级**：客户端 MUST NOT 从 S256 退回 plain

<!--
S256 被拒只可能是 AS 故障或 MITM 降级——降级即攻击信号。
-->

---

# Client Credentials · 服务间通信

机器到机器（M2M）专用，无 user 参与

```bash
POST /token HTTP/1.1
Host: as.example.com
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0MUwzWHN3RUd5dA==
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&scope=read write
```

```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read write"
}
```

> **不签发 refresh_token**；客户端缓存到 `expires_in - buffer`，过期前重换

<!--
适用：定时任务调内部 API、微服务间互调、CI 调部署 API。
-->

---

# Refresh Token · 续期机制

避免长期保存用户凭据，让 access token 保持短 TTL

```text
POST /token
grant_type=refresh_token
&refresh_token=<之前拿到的 RT>
&scope=read            # 不得扩大原 scope，可缩小或省略
```

**Public client 必须二选一（RFC 9700 §2.2.2）**

- **Rotation**：每次刷新失效旧 RT、签发新 RT；重放旧 RT 触发告警
- **Sender-constraining**：DPoP（RFC 9449）或 mTLS（RFC 8705）

> Confidential client 推荐 `private_key_jwt` / mTLS（非对称，无需 AS 存对称密钥）

<!--
rotation 是公开客户端防 RT 重放的首选；confidential 用非对称认证。
-->

---

# 已废弃的两种 grant

| Grant | 标记 | 主要问题 |
|-------|------|----------|
| **Implicit** (`response_type=token`) | **§2.1.2 移除** | access_token 经 URI fragment 回传 → 进历史/Referer/日志；无法 sender-constrain |
| **Password** (`grant_type=password`) | **§2.4 MUST NOT** | 凭据直接交 client；无法支持 MFA/WebAuthn；助长钓鱼 |

**回传位置差异**

| 流程 | 位置 | 字段 |
|------|------|------|
| Authorization Code | **query** (`?code=xxx`) | code（需到 /token 兑换） |
| Implicit（废弃）| **fragment** (`#access_token=xxx`) | access_token（直接拿到） |

> 主流 IdP（Google/Microsoft/GitHub/Auth0）已禁用 Implicit

<!--
看到老教程推 Implicit/Password 一律跳过，跟 RFC 9700 走。
-->

---
layout: two-cols
layoutClass: gap-8
---

# Bearer Token 传递

RFC 6750 三种方式的安全级别

| 方式 | RFC | 推荐 |
|------|-----|------|
| **Authorization 头** | §2.1 | **MUST 支持** |
| 表单 body | §2.2 | SHOULD NOT |
| URI query | §2.3 | SHOULD NOT |

**为何禁 URI query**

URL 会进入：浏览器历史 / 服务器访问日志 / CDN 日志 / Referer

::right::

<br>

**正确示范**

```bash
GET /api/user HTTP/1.1
Host: api.example.com
Authorization: Bearer mF_9.B5f-4.1JqM
```

**错误码与 HTTP 状态**

| 错误码 | HTTP |
|--------|------|
| `invalid_request` | 400 |
| `invalid_token` | **401** |
| `insufficient_scope` | **403** |

> 401/403 必须带 `WWW-Authenticate: Bearer error=...`

<!--
Authorization 头是 RFC 6750 唯一 MUST 支持的方式。
-->

---

# redirect_uri 校验

精确字符串匹配，禁止前缀/通配符

- **MUST 精确字符串比对**（RFC 3986 §6.2.1）
- **MUST 绝对 URI** + **MUST NOT 含 fragment**
- 推荐 HTTPS（localhost 除外）
- 唯一例外：native app loopback (`127.0.0.1`/`::1`) 允许动态端口（RFC 8252 §7.3）

**前缀匹配攻击场景**

```text
1. AS 允许前缀 https://app.example.com/
2. 攻击者注册 https://app.example.com.evil.com/
   或利用受害者域上的开放重定向器
3. 用户的 code 被重定向到攻击者控制的域
```

> **明确禁止 AS 暴露开放重定向器**（RFC 9700 §2.1）

<!--
redirect_uri 是 OAuth 最高发的攻击面，必须严格。
-->

---

# state vs PKCE · 纵深防御

不同机制不同目标，叠加才完整

| 机制 | 主要目标 | 为何需要 |
|------|----------|----------|
| `state` | CSRF | 一次性 + 绑定 session，攻击者无法构造合法值 |
| `PKCE`（S256）| 授权码注入 + 更强 CSRF | 即便攻击者读到响应（拿到 state 与 code），没 verifier 仍无法兑换 |
| `iss`（OIDC）| mix-up attack | 多 AS 回调混淆防御 |
| `nonce`（OIDC）| token injection | `at_hash` 绑定 id_token 与 access_token |

> **PKCE 与 state 应同时使用而非二选一**——纵深防御叠加

<!--
state 与 PKCE 防御目标不同：state 防 CSRF，PKCE 防授权码注入。
-->

---

# 反模式速查

新实现一律禁用

- **使用 Implicit / Password grant**：已被 RFC 9700 废弃
- **PKCE 用 plain 或从 S256 降级到 plain**：MUST NOT 降级
- **把 access_token 放 URI query**：进日志/Referer/历史
- **redirect_uri 前缀 / 通配符匹配**：开放重定向攻击
- **state 用静态 / 可预测 / 多次复用值**：失去 CSRF 防护
- **confidential client 把 client_secret 放前端 / 移动端**：反编译即窃取
- **authorization endpoint 开 CORS**：RFC 9700 §2.1 明确禁止
- **前端 JS 把 access_token 存 localStorage 长期持有**：XSS 可窃取
- **依赖前端 JS 暴露开放重定向器**：绕过精确匹配

<!--
这些反模式在生产环境频繁出现，逐项排查。
-->

---

# 部署检查清单

新接入 OAuth 2.0 时的 10 条基线

- [ ] 所有客户端用 Authorization Code + PKCE（S256）
- [ ] `state` 一次性、绑定 session、签名防篡改
- [ ] `redirect_uri` 精确匹配、HTTPS（localhost 除外）
- [ ] Bearer Token 经 Authorization 头传递
- [ ] Access Token 短 TTL（≤1h）
- [ ] Refresh Token 启用 Rotation 或 sender-constraining
- [ ] Confidential client 用 `private_key_jwt` / mTLS
- [ ] Authorization endpoint 关 CORS（仅 token/metadata MAY 开）
- [ ] AS 防 PKCE 降级（无 challenge 却带 verifier 必须拒绝）
- [ ] IdP 已禁用 Implicit / Password grant

<!--
按清单逐项打勾，缺一不可。
-->

---
layout: center
class: text-center
---

# 小结

OAuth 2.0 = 不交密码的令牌化委托

**4 流程**：Auth Code（+PKCE）/ Client Credentials / Refresh Token / ~~Implicit~~
**3 防御**：PKCE（code 注入）+ state（CSRF）+ iss/nonce（mix-up）
**3 优先级**：Authorization 头 > body > query
**当前基线**：RFC 6749 + RFC 9700（BCP 284，2025-01）

[RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749) · [RFC 9700](https://datatracker.ietf.org/doc/html/rfc9700) · [OWASP OAuth 2.0 Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2Authentication_Cheat_Sheet.html)

<!--
记住一句话：所有客户端一律 Authorization Code + PKCE。
-->
