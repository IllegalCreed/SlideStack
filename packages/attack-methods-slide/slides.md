---
theme: seriph
background: https://cover.sli.dev
title: 攻击方式 完全指南
info: |
  Web 安全攻击方式完全指南：XSS / CSRF / SQL 注入 / SSRF / DDoS / MITM · OWASP Top 10:2025

  Learn more at [https://cheatsheetseries.owasp.org/](https://cheatsheetseries.owasp.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 攻击方式 完全指南

Web 安全 · XSS / CSRF / SQL 注入 / SSRF / DDoS / MITM · OWASP Top 10:2025

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Web 安全是攻防对应面，本篇系统梳理六类常见攻击及其官方防御手段。
-->

---
transition: fade-out
---

# 什么是攻击方式

Web 安全的**攻防对应面**

- **攻防对应**：不单讲攻击，也不单讲防御，把「攻击机制 + 对应防御」成对呈现
- **纵深防御**：单层都不够——CSP 不替代输入消毒，编码挡不住 DOM 型 XSS
- **官方信源**：OWASP Cheat Sheet Series + MDN Web Docs + OWASP Top 10:2025 + RFC 6797
- **覆盖六类**：XSS / CSRF / SQL 注入 / SSRF / DDoS / MITM
- **不展开**：认证授权、加密算法、依赖供应链（独立类别）
- **现代浏览器原生防御**：Trusted Types / Sanitizer / Sec-Fetch-Site / SameSite=Lax 默认

> XSS 与 CSRF 不是独立问题——XSS 可读取 CSRF Token 使所有 CSRF 防护失效。

<!--
强调 XSS 防御是 CSRF 防御的前提。
-->

---

# 六类攻击速览

| 攻击 | OWASP | 机制 | 主防御 |
|------|------|------|------|
| **XSS** | A03 | 注入恶意脚本执行 | 编码 + CSP + Trusted Types + Sanitizer |
| **CSRF** | A01 | 滥用已登录身份发请求 | SameSite + Token + Sec-Fetch-Site |
| **SQL 注入** | A03 | 拼接 SQL 改结构 | 参数化查询 / ORM 默认接口 |
| **SSRF** | A10→主流 | 服务器发指定 URL | 白名单 + 禁重定向 + IMDSv2 |
| **DDoS** | Availability | 耗尽带宽/CPU/内存 | L7 速率限制 / L3-4 云清洗 |
| **MITM** | A02 | 中间人窃听/篡改 | HSTS + TLS 证书链校验 |

> 单层防御都不够，纵深防御是核心原则。

<!--
每类攻击对应 OWASP Top 10:2025 不同编号，A03 Injection 包含 XSS 和 SQL 注入。
-->

---

# OWASP Top 10:2025 映射

| 编号 | 类别 | 本篇覆盖 |
|------|------|------|
| **A01** | Broken Access Control | CSRF、SSRF |
| **A02** | Cryptographic Failures | MITM（TLS / HSTS） |
| **A03** | Injection | XSS、SQL 注入 |
| **A05** | Security Misconfiguration | CSP 配置、HSTS 缺失 |
| **A06** | Vulnerable Components | 不展开（依赖安全篇） |
| **A07** | Auth Failures | 不展开（会话/认证篇） |
| **A10** | SSRF（2021） | **2025 已并入主流讨论** |

> A01 仍居 #1，A05 升至 #2，引用 OWASP 时应优先用 2025 版编号。

<!--
OWASP Top 10:2025 已发布为现行版本，2021 版归档仍可访问。
-->

---

# XSS 三类型

按持久化与触发链路区分

| 类型 | 持久化 | 触发 | 危害 | WAF 可见 |
|------|------|------|------|------|
| **存储型** | 持久化 DB | 访问即触发 | **最大** | 可见 |
| **反射型** | 不持久 | 响应反射，钓鱼触发 | 中 | 可见 |
| **DOM 型** | 不持久 | **纯客户端** sink 触发 | 中 | **不可见** |

> DOM 型 XSS 完全不经过服务器响应，载荷在客户端 sink 执行，**WAF 挡不住**。

<!--
DOM 型 XSS 的本质区别：服务器日志中看不到载荷，必须靠前端 sink 防护与 Trusted Types。
-->

---

# XSS 三类注入 sink

Trusted Types API 把 DOM 注入点分为三类

| sink 类型 | 危险 API | 可信类型 |
|------|------|------|
| **HTML sink** | `innerHTML` / `document.write` | TrustedHTML |
| **JS sink** | `eval` / `Function` | TrustedScript |
| **JS URL sink** | `script.src` / `location.href` | TrustedScriptURL |

`window.trustedTypes.createPolicy(name, {createHTML, createScript, createScriptURL})` 创建 policy，传字符串进 sink 抛 `TypeError`。

> CSP `'require-trusted-types-for "script"'` 强制启用，是 DOM sink 的最后闸门。

<!--
Trusted Types 是 DOM 型 XSS 的最后闸门，即使前几层漏掉，policy 不通过就抛 TypeError。
-->

---

# XSS 纵深防御四件套

单层都不够，必须组合

1. **输出编码**（服务端 / 模板自动转义）— 第一道闸门
2. **CSP**（nonce-based Strict CSP）— 阻断内联与未授权脚本
3. **Trusted Types**（DOM sink 强制 policy）— DOM 型 XSS 最后闸门
4. **Sanitizer API / DOMPurify**（富文本消毒）— 富文本场景必备

> CSP 不替代输入消毒，编码挡不住 DOM 型 XSS，Trusted Types 是 DOM sink 的最后闸门。

<!--
为什么单层都不够：CSP 不替代输入消毒（编码是输入侧），输出编码挡不住 DOM 型 XSS（DOM 型不经服务器）。
-->

---
layout: two-cols
---

# CSP nonce-based Strict CSP

**最佳实践**

- 用 nonce-based，不用 allowlist
- 仅集成 GA 就要加 187 个域名
- nonce 每响应重新生成且不可预测

```text
Content-Security-Policy:
  script-src 'nonce-{RANDOM}'
    'strict-dynamic';
  object-src 'none';
  base-uri 'none';
  report-to csp-endpoint;
```

::right::

# 关键约束

**nonce 关键点**

- 必须每 HTTP 响应都重新生成
- 不可预测（CSPRNG）
- 含 nonce/hash 时 `'unsafe-inline'` 被忽略

**反模式**

- 含 `'unsafe-inline'` 或 `'unsafe-eval'` = 等于没防 XSS
- 白名单过宽（允许 `*.cdn.com`）
- 用 `report-uri`（已废弃，用 `report-to`）

<!--
allowlist CSP 难维护且常无意中白名单不安全域名，nonce 方式根本不依赖域名白名单。
-->

---

# Sanitizer API

```ts
// 安全方法：setHTML 默认用默认消毒配置
element.setHTML(userInput);

// 危险方法：默认不消毒，必须显式传 Sanitizer
const sanitizer = new Sanitizer({
  elements: ['b', 'i', 'em', 'strong', 'a'],
  allowAttributes: { href: ['a'] },
});
element.setHTMLUnsafe(userInput, { sanitizer });
```

| API | 默认行为 |
|------|------|
| `setHTML()` | **默认安全**，自动消毒 |
| `setHTMLUnsafe()` | **默认不消毒**，必须传 Sanitizer |

> 常考陷阱：以为 `setHTMLUnsafe` 也自动消毒——它**默认不消毒**。

<!--
Sanitizer API 浏览器支持有限（Limited Availability），生产环境常用 DOMPurify 兜底。
-->

---

# CSRF 三层防御

| 层 | 机制 | 性质 |
|------|------|------|
| **第 1 层** | SameSite=Lax（默认） | 纵深防御 |
| **第 2 层** | Synchronizer Token / Signed Double-Submit | **主防御** |
| **第 3 层** | Sec-Fetch-Site（Fetch Metadata） | 现代化兜底 |

**Token 选型**

- **Synchronizer Token**（有状态）：服务端存，传统 Web
- **Signed Double-Submit HMAC**（无状态）：JWT / 微服务
- **Naive Double-Submit**：**禁止**——易被子域 Cookie 注入绕过

> SameSite=Lax 仅当纵深防御，不作为主防御。

<!--
Sec-Fetch-Site 浏览器自动发送、JS 无法伪造，覆盖率 > 98%，是现代化 CSRF 兜底。
-->

---
layout: two-cols
---

# SameSite=Lax 默认

**Lax 是现代浏览器默认值**

- 自 Chrome 84（2020）起
- 未显式设置即默认 Lax

**Lax 的边界**

- 仅阻止不安全方法（POST/PUT/DELETE）
- **GET 顶层导航仍带 Cookie**
- 若有 GET 状态变更端点则失效
- 对客户端 CSRF（同源 JS）无效
- 旧浏览器不执行

::right::

# Token vs Signed Double-Submit

**Synchronizer Token**

- 有状态，服务端存
- CSPRNG 生成
- `constantTimeEquals` 比较
- 适用：传统 Web

**Signed Double-Submit**

- 无状态
- HMAC-SHA256 签名
- 适用：JWT / 微服务

> 比较必须用 `constantTimeEquals`，防时序侧信道逐字节爆破。

<!--
CSRF Token 生成必须用 CSPRNG 且每会话/每请求唯一。
-->

---

# SQL 注入与 SSRF

**SQL 注入防御**：参数化查询（占位符 `?` / `:name`）· ORM 默认接口安全 · raw 必须用占位符

**ORM 安全边界**

| 接口 | 是否安全 |
|------|------|
| Prisma `$queryRaw` 模板 / TypeORM QueryBuilder | ✅ 安全（自动参数化） |
| Prisma `$queryRawUnsafe` / TypeORM `query()` 拼接 | ⚠️ **危险** |

**SSRF 铁律**

- 白名单校验（URL + 域名 + IP + 协议 + 端口）· 禁重定向（`followRedirect=false`）
- 查 A/AAAA 记录防 DNS Rebinding · 云环境用 IMDSv2

> 仅校验入口 URL 没用——攻击者用 302 跳到 `169.254.169.254` 绕过。

<!--
Prisma $queryRawUnsafe 是注入入口，必须用 $queryRaw 模板字符串让 ORM 自动参数化。
-->

---
layout: two-cols
---

# DDoS 分层

**L7 应用层**

- 速率限制（令牌桶 / 滑动窗口）
- 连接超时 + 并发上限
- 文件 / 请求体大小限制
- 优雅降级
- Bulkhead 隔离
- 高消耗验证后置

**L3/4 网络层**

- 云清洗（Cloudflare / AWS Shield）
- ISP 边缘过滤
- Anycast 分散
- 带宽冗余

::right::

# MITM 与 HSTS

**HSTS 两层机制**

- 浏览器自动 HTTP → HTTPS
- 不允许绕过证书错误

**preload 指令**

- 解决「首次访问前 HSTS 不生效」
- 浏览器出厂内置 HSTS 列表
- 前提：`max-age≥31536000` 且含 `includeSubDomains`

```text
Strict-Transport-Security:
  max-age=31536000;
  includeSubDomains; preload
```

> HSTS 必须只通过 HTTPS 响应下发，HTTP 响应会被忽略。

<!--
L7 攻击不耗带宽而耗 CPU/内存/连接，WAF 速率规则只能识别已知模式。
-->

---
layout: quote
---

# XSS 防御是 CSRF 防御的前提

「XSS 可在受害者浏览器内读取 CSRF Token 或直接发请求，使所有 CSRF 防护失效。」

—— OWASP 反复强调

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- CSP 含 `'unsafe-inline'` / `'unsafe-eval'` = 等于没防 XSS
- `element.innerHTML = userInput` 未消毒 = DOM 型 XSS
- 字符串拼接 SQL = 经典 SQL 注入
- Naive Double-Submit Cookie = 子域 Cookie 注入绕过
- SSRF 只黑名单 + 不禁重定向 = 302 跳内网
- `setHTMLUnsafe` 忘传 Sanitizer = 默认不消毒
- HTTP 响应下发 HSTS = 被浏览器忽略
- 仅靠 Referer 防 CSRF = 1-2% 流量缺失
- CAPTCHA 防 CSRF = 设计目的不符
- 认为 HTTPS 能防 CSRF = 只是前提不直接防

<!--
跑分波动先排查环境因素，再下回归结论。
-->

---
layout: center
class: text-center
---

# 小结

攻击方式 = 攻防对应面 · 纵深防御

XSS · CSRF · SQL · SSRF · DDoS · MITM · OWASP Top 10:2025

**XSS 防御是 CSRF 防御的前提 · 纵深防御四件套 · nonce-based Strict CSP**

[OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/) · [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) · [OWASP Top 10](https://owasp.org/Top10/)

<!--
掌握六类攻击的攻防对应关系 + 纵深防御原则，就能把 Web 安全用到生产水准。
-->
