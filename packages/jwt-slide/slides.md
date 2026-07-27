---
theme: seriph
background: https://cover.sli.dev
title: JWT 完全指南
info: |
  JWT（JSON Web Token）完全指南：三段式 · 算法 · 声明 · 存储 · 轮换

  Learn more at https://jwt.io/introduction
drawings:
  persist: false
transition: slide-left
mdc: true
---

## JWT 完全指南

RFC 7519 · 三段式 · 算法 · 存储 · 轮换

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
JWT 是 RFC 7519 定义的「JSON 编码 + 密码学签名」的 claim 集合，2015 年至今核心规范稳定未废弃。
-->

---
transition: fade-out
---

# 什么是 JWT

RFC 7519 定义的**用 JSON 编码、密码学签名的 claim 集合**

- **凭证而非状态**：是授权凭证 / 信息载体，**不是** session 存储
- **签名 ≠ 加密**：标准 JWS 只签名防篡改，**不加密**；payload 仅 Base64URL 编码
- **无状态、易扩展**：服务端不存 session，多实例 / 跨域 / 跨服务只需共享密钥或公钥
- **可自包含**：claim 集直接承载用户 ID / 角色 / 过期
- **天然跨端**：Bearer 头传输不触发 CORS，SSO / 移动端友好
- **生态成熟**：jwt.io 在线解码 + auth0/node-jsonwebtoken 事实标准

> JWT ≠ 加密凭证。它防的是「篡改」而不是「泄露」——拿到 token 的人都能 decode 看到内容。

<!--
重点强调签名 ≠ 加密，payload 默认任何人可读明文。
-->

---

# 三段式结构

```text
header.payload.signature
```

| 段 | 内容 | 示例（解码后） |
|------|------|------|
| **Header** | `alg` / `typ` 等 JOSE 元数据 | `{"alg":"HS256","typ":"JWT"}` |
| **Payload** | claim 集合（iss/sub/aud/exp + 自定义） | `{"sub":"123","iat":1516239022}` |
| **Signature** | 按 `header.alg` 对前两段做的密码学校验和 | `HMACSHA256(...)` |

**Base64URL ≠ 普通 Base64**

- `+` → `-`，`/` → `_`（URL-safe）
- 去掉 `=` 填充、无换行

> 三段都只是编码（不是加密），任何人都能 decode 读 Header 和 Payload。Signature 才是密码学保护。

<!--
Base64URL 是 JWT 与普通 Base64 的关键差异，URL 中无需再编码。
-->

---

# 七个注册 claim

| claim | 含义 | 校验规则 |
|------|------|------|
| `iss` | 签发者 | 须匹配本服务预期签发方 |
| `sub` | 主体 | 应用层定义 |
| `aud` | 受众 | **必须**包含本服务 |
| `exp` | 过期 | 过期 MUST NOT 接受 |
| `nbf` | 生效前 | 之前 MUST NOT 接受 |
| `iat` | 签发时间 | 可判断 token 年龄 |
| `jti` | 唯一 ID | 防重放，需维护已用列表 |

> 七个 claim 均 OPTIONAL；NumericDate = UTC 起算的**秒数**；`exp` 过期后 MUST NOT 接受是合规要求。

<!--
强调 aud 不匹配必须拒绝、exp 是 MUST NOT 不是 SHOULD NOT。
-->

---

# 算法三族速览

| 算法族 | 算法 | 密钥模型 | 适用场景 |
|------|------|------|------|
| **HMAC（对称）** | HS256/384/512 | 共享密钥 | 单体、签发=验证 |
| **RSA（非对称）** | RS256/384/512 | 私签公验 | 多服务、跨组织、OIDC |
| **ECDSA（非对称）** | ES256/384/512 | 私签公验 | 移动端、IoT，密钥短 |
| **PSS（非对称）** | PS256/384/512 | 私签公验 | RS256 现代概率变体 |
| **none** | `none` | 无签名 | **生产禁用** |

**分布式优先 RS256/ES256**

- 私钥只在签发方、验证服务只持公钥；HS256 共享密钥扩散到每个验证方，任一泄露全盘失守

> `alg` 是 token 自报的**不可信**元数据，所有信任决策必须建立在密码学校验通过的基础上。

<!--
HS256 vs RS256 选型是面试常考、生产常错的点，重点讲。
-->

---

# alg:none 攻击

服务端若信任 token 自报的 `alg: none`，会**跳过验签**

**攻击步骤**

1. 攻击者拿到一条合法 JWT
2. header 改成 `{"alg":"none"}`，payload 改成 `{"sub":"admin","role":"superuser"}`
3. 拼成 `header.payload.`（signature 段空）
4. 服务端不传白名单 → 跳过验签 → **信任** payload
5. 攻击者以 admin 身份操作

**防御**

- `verify()` **必须**显式传 `algorithms` 白名单（如 `['RS256']`）
- 生产实现普遍在 `algorithms` 默认列表里**禁用** `none`
- 永不信任 token 自报的 `alg`

> RFC 8725 §3.1 明确反对接受 `none`，但库不一定默认禁用——白名单是契约。

<!--
alg:none 是 OWASP Top 10 级别的经典漏洞，必讲。
-->

---

# RS256→HS256 算法混淆攻击

篡改 `alg` 让服务端把 RSA 公钥当 HMAC 密钥验签

**攻击步骤**（服务端原用 RS256，公钥公开）

1. 攻击者下载服务端 RSA 公钥（JWKS 公开）
2. header 改成 `{"alg":"HS256"}`
3. 用 RSA 公钥字符串当 HMAC 的 secret 算签名
4. 服务端不传白名单 → 库按 key 类型推断 → **验签通过**
5. 攻击者以任意身份操作

**唯一可靠防御**

```ts
jwt.verify(token, publicKey, {
  algorithms: ['RS256'],  // ★ 必传白名单
});
```

> 不传 `algorithms` 是 OWASP 级别漏洞，库的「自动推断」不能依赖。

<!--
RS256→HS256 与 alg:none 是 JWT 两大经典攻击，防御手段完全一样：algorithms 白名单。
-->

---
layout: two-cols
---

# localStorage 反模式

**OWASP 明令禁止**

- 任何 XSS（哪怕一个 npm 依赖被投毒）即可 `localStorage.getItem('token')` 拖走全部凭证
- sessionStorage 同理，同样禁止

**HttpOnly Cookie（推荐 Refresh Token）**

- JS 不可读 `document.cookie`
- 配 `Secure`（仅 HTTPS）+ `SameSite=Strict`（几乎免疫 CSRF）
- `__Host-` 前缀强制 Secure + 无 Domain + Path=/

::right::

# 内存存 Access Token

**生产推荐组合**

- **Access Token** → 内存（JS 变量 / app state）
  - 短 exp（几分钟 ~ 15 分钟）
  - XSS 也拿不到持久态
- **Refresh Token** → `HttpOnly + Secure + SameSite=Strict` Cookie
  - 长 exp（小时 ~ 天）
  - 配**轮换 + 复用检测**

> 任何「把 Access Token 存 localStorage」的方案都是 OWASP 反模式。

<!--
存储位置是 JWT 实战最争议的话题，OWASP 立场非常明确。
-->

---

# Refresh Token 轮换 + 复用检测

固定不变的 Refresh Token 一旦被盗可无限续期，必须**轮换 + 复用检测**

**轮换**：每次刷新发新 + 吊销旧

**复用检测**：旧 token 被再次提交时，**立即吊销整条 token family**

```text
登录 → AT1 + RT1
AT1 过期 → RT1 换 AT2 + RT2（吊销 RT1）
AT2 过期 → RT2 换 AT3 + RT3（吊销 RT2）
攻击者用 RT1 → 服务端发现 RT1 已吊销
→ 立即吊销整个 family → 强制重新登录
```

> 「合法用户用新 token + 攻击者用旧 token」同时出现 = 必有攻击者，立即切断整条链。

<!--
轮换 + 复用检测是 RFC 9700 / Auth0 推荐的当代凭证安全标配。
-->

---

# JWT vs Session

| 维度 | JWT | Session |
|------|------|------|
| 状态 | 无状态 | 有状态（服务端存） |
| 即时吊销 | 困难（需 blocklist） | 简单（删 session） |
| 横向扩展 | 无需共享存储 | 需 Redis / sticky |
| 跨域 / 跨端 | 天然适合（SSO/移动端） | 受 Cookie 同源约束 |
| 续期 | Refresh Token 轮换 | 滑动过期 |

**生产常见混合方案**：opaque token + Redis 后端（随机串查权限）、短 exp JWT + blocklist（jti 入 Redis 黑名单）、JWT(AT) + Session 思路管 Refresh Token

> JWT 不是「session 替代品」，而是「跨信任方传输已签名 claim」的凭证。

<!--
需要即时吊销的场景应优先考虑 session 或混合方案。
-->

---

# jsonwebtoken 速查

```ts
import jwt from 'jsonwebtoken';

// 签发
const token = jwt.sign(
  { userId: 123 },
  process.env.JWT_SECRET,
  { algorithm: 'HS256', expiresIn: '15m', jwtid: crypto.randomUUID() }
);

// 验证（★ algorithms 白名单必传）
const payload = jwt.verify(token, publicKey, {
  algorithms: ['RS256'],
  audience: 'my-api',
  issuer: 'auth.example.com',
  clockTolerance: 5, // 处理时钟漂移
});

// 解码（不验签，仅不可信反向用）
const decoded = jwt.decode(token);
```

> `decode()` 不验签，不能用于不可信输入——任何来自外部的 token 必须用 `verify()`。

<!--
decode vs verify 是面试常考、生产常错的点，必须强调。
-->

---

# Bearer vs Cookie 传输

| 方式 | 优点 | 缺点 |
|------|------|------|
| **Authorization Bearer** | 不触发 CORS 复杂请求，前后端分离友好 | 前端需手动管理（存哪、怎么带） |
| **HttpOnly Cookie** | 浏览器自动随请求带 | 需防 CSRF（SameSite + CSRF token） |

```text
# 方式一：Authorization Bearer
Authorization: Bearer eyJhbGciOi...

# 方式二：HttpOnly Cookie
Set-Cookie: access_token=eyJ...; HttpOnly; Secure; SameSite=Strict
```

> Bearer 适合 SPA / 移动端；HttpOnly Cookie 适合浏览器侧 + 防 XSS。

<!--
两种传输各有取舍，现代 SPA 常用 Bearer，传统 Web 用 Cookie。
-->

---
layout: quote
---

# payload 默认不加密

「JWT payload 仅 Base64URL 编码，任何人 decode 即可读明文。放密码 / 身份证号 / 手机号等于裸奔。」

需要保密必须用 **JWE**（RFC 7516）加密，或外层 TLS 之外的额外保护。

---

layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 把 JWT 存 localStorage / sessionStorage（OWASP 明令禁用）
- `verify()` 不传 `algorithms` 白名单（alg:none + 算法混淆）
- 把 JWT 当 session 却希望「立刻吊销」（exp 前无法单方面失效）
- 误以为 payload 是加密的（仅 Base64URL 编码）
- HS256 共享密钥分发到每个微服务（任一泄露全盘沦陷）
- Refresh Token 不轮换、长期有效（被盗可无限续期）
- 长 exp Access Token 且无吊销机制
- 用 `decode()` 当作校验（不验签）
- 信任 token 自报的 `alg` / `iss` 不做白名单比对
- 权限变更（登录 / 改密 / 提权）不重新签发 token（session fixation）

<!--
反模式列表是 JWT 安全的核心 checklist，每条都对应一类真实漏洞。
-->

---
layout: center
class: text-center
---

# 小结

JWT = 用 JSON 编码、密码学签名的 claim 集合

三段式 · 七个注册 claim · 三族算法 · 轮换 + 复用检测

**verify 必传白名单 · 禁用 localStorage · 短 exp + Refresh Token 轮换**

[RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) · [RFC 8725](https://datatracker.ietf.org/doc/html/rfc8725) · [jwt.io](https://jwt.io) · [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)

<!--
掌握验签白名单 + 存储位置 + 轮换机制，就能把 JWT 用到生产水准。
-->
