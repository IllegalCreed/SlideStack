---
theme: seriph
background: https://cover.sli.dev
title: OWASP Top 10 与前端防护
info: |
  OWASP Top 10:2025 前端映射 · CSP · HTTP 安全头 · Helmet.js · CORS

  Learn more at https://owasp.org/Top10/
drawings:
  persist: false
transition: slide-left
mdc: true
---

## OWASP Top 10 与前端防护

CSP · HTTP 安全头 · Helmet.js · CORS · OWASP Top 10:2025

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
前端纵深防御层：OWASP Top 10 是风险地图，CSP/HTTP 头/Helmet/CORS 是可落地的工具。
-->

---
transition: fade-out
---

# 什么是 OWASP Top 10

OWASP 基金会发布的**Web 应用十大安全风险**

- **每 3-4 年一版**：2025 是当前现行版本（2021 归档）
- **业界事实标准**：风险地图与防护优先级的通用语言
- **不是合规清单**：是「最常见」而非「全部」风险
- **对应防御**：每个类别都有 OWASP Cheat Sheet

**前端最高频踩**

- A03 Injection（含 **XSS**）— CSP 主战场
- A05 Security Misconfiguration — Helmet / HTTP 头
- A01 Broken Access Control — 前端隐藏 ≠ 鉴权

> OWASP Top 10:2025：A01 升 #1、A03 合并 XSS、新增 A04 / A08 / A10。

<!--
强调 Top 10 是风险地图而非清单，前端最直接相关的是 A03 XSS 与 A05 配置错误。
-->

---

# OWASP Top 10:2025 速览

| 编号 | 名称 | 前端相关 |
|------|------|------|
| **A01** | Broken Access Control | **高** |
| **A03** | Injection（含 **XSS**） | **高** |
| **A05** | Security Misconfiguration | **高** |
| A02 / A04 | Crypto Failures / Insecure Design | 中 |
| A06 / A07 | Vulnerable Components / Auth Failures | 中 |
| A08 / A10 | Integrity Failures（2021 新增）/ SSRF | 中-低 |

> 关键变更：XSS 从独立 A7 合入 A03；A01 从 #5 升 #1。

<!--
A03/A05 是前端可控的两大主战场，本叶内容就是这两块。
-->

---

# 前端防护四件套

| 工具 | 目标 | 关键点 |
|------|------|------|
| **CSP** | 防 XSS 执行 | nonce + strict-dynamic |
| **HTTP 安全头** | 多面防御 | X-Frame / HSTS / Referrer / Permissions |
| **Helmet.js** | Node.js 默认值 | 一行开 13 个头 |
| **CORS** | 跨域受控放宽 | 凭证时禁用 `*` |

**核心理念**：纵深防御 + 默认安全

- 不依赖单一机制：CSP 防 XSS 但不防 CSRF
- Helmet 默认不含 CORS（需独立 `npm install cors`）
- HTTP 头只走 HTTP 响应（`<meta>` 大多无效）

> 前端防护是纵深防御的一层，不是全部。

<!--
强调四件套分工互补：CSP/HTTP 头/Helmet 是「响应头侧」，CORS 是「跨域机制」。
-->

---

# CSP 工作机制

浏览器执行的**内容白名单**，防未授权脚本执行

- **HTTP 响应头**：`Content-Security-Policy: <策略>`
- **`<meta>` 也可声明**：但 Report-Only 不支持
- **核心指令**：`script-src` / `style-src` / `img-src` / `frame-ancestors`
- **上报**：`report-to` + `Reporting-Endpoints`（`report-uri` 已废弃）

**两种模式**

| 模式 | 头 | 行为 |
|------|------|------|
| Enforcing | `Content-Security-Policy` | 违反则**阻止** + 上报 |
| Report-Only | `Content-Security-Policy-Report-Only` | **仅上报**不阻止 |

> 上线策略：先 Report-Only 收集违规，再切 enforcing。

<!--
CSP 不替代输出转义，是纵深防御层。先 Report-Only 是行业共识。
-->

---

# CSP nonce + strict-dynamic

**现代姿势**：弃用域名白名单，改 nonce + strict-dynamic

- **白名单难维护**：仅集成 Google Analytics 就要加约 187 个域
- **白名单易包含不安全域**：CDN 上的任意用户上传都构成漏洞

**nonce 工作流程**

1. 服务器每响应随机生成不可预测 nonce
2. 同时写入 CSP 头与所有合法 `<script nonce>`
3. 浏览器比对一致才执行；攻击者注入的拿不到 nonce

**铁律**

- 每响应**重新生成**（Number used once）
- 用 `crypto.randomBytes`，不用 `Math.random`
- 不能给所有 `<script>` 一律加 nonce

> `'unsafe-inline'` 在有 nonce/hash 时会被忽略。

<!--
nonce 必须每响应重新生成且不可预测；strict-dynamic 让被信任的脚本继续加载子脚本。
-->

---
layout: two-cols
---

# HTTP 安全头五件

**X-Frame-Options**（防 clickjacking）

- `DENY` / `SAMEORIGIN`
- `ALLOW-FROM` 已废弃

**X-Content-Type-Options**

- `nosniff` 阻止 MIME 嗅探

**Strict-Transport-Security**

- `max-age=31536000; includeSubDomains; preload`
- 仅 HTTPS 响应生效

::right::

# Referrer / Permissions

**Referrer-Policy**

- 默认 `strict-origin-when-cross-origin`
- 跨源只发 origin，降级不发

**Permissions-Policy**

- 旧名 Feature-Policy 已废弃
- allowlist：`()` / `(self)` / `*`
- `camera=()` 全禁用、`camera=*` 等于无防护

> X-Frame-Options 与 frame-ancestors 并存时，**frame-ancestors 优先**。

<!--
HTTP 头分工清晰：每个头管一个面。Helmet 一行开默认 13 个。
-->

---

# HSTS 与 preload

**Strict-Transport-Security** 解决 SSL Strip 降级攻击

| 指令 | 作用 |
|------|------|
| `max-age=<秒>` | 浏览器记住「只用 HTTPS」的时长 |
| `includeSubDomains` | 包含所有子域 |
| `preload` | 申请加入浏览器源码列表 |

**preload 注册前提**

- `max-age` ≥ 31536000（1 年）
- **必须**含 `includeSubDomains`
- 全站 HTTPS，提交 [hstspreload.org](https://hstspreload.org)

> 解决「首次访问窗口期」——常规 HSTS 只在首次 HTTPS 响应后生效，preload 覆盖首次访问。

<!--
HSTS 写在 HTTP 响应会被浏览器忽略，必须 HTTPS 响应才生效。
-->

---
layout: two-cols
---

# Helmet.js 默认 13 个头

`app.use(helmet())` 一行开启

- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- Referrer-Policy
- Cross-Origin-Opener-Policy
- Cross-Origin-Resource-Policy
- Origin-Agent-Cluster

::right::

# Helmet 关键点

**X-XSS-Protection: 0**

- XSS Auditor 已废弃且有缺陷
- 现代替代是 **CSP**
- Helmet 主动关闭旧机制

**Helmet 不含 CORS**

- 只设响应头
- 跨域需独立 `npm install cors`
- 二者职责互补

> 默认开 X-XSS-Protection=0，不是没设——是**主动禁用**废弃机制。

<!--
Helmet 默认 X-XSS-Protection=0 是重点考题：现代替代是 CSP，Auditor 有缺陷。
-->

---

# CORS 简单 vs 预检

**简单请求**（不触发 preflight）需**同时**满足

- 方法在 `GET` / `HEAD` / `POST`
- 仅用安全列表头
- Content-Type 为三种基础类型

任一不满足即触发 **OPTIONS preflight**

```text
浏览器先发 OPTIONS:
  Origin / Request-Method / Request-Headers

服务器响应:
  Allow-Origin / Allow-Methods / Allow-Headers / Max-Age

通过后才发真正的 DELETE / PUT
```

> 简单请求不触发 preflight，是 CSRF 能绕过 CORS 的根本原因。

<!--
预检是浏览器先发的独立 OPTIONS 请求，通过后才发实际方法。
-->

---

# CORS 凭证与通配符互斥

带 Cookie / Authorization 的跨域请求

- 前端：`fetch(url, { credentials: "include" })`
- 服务端：`Access-Control-Allow-Credentials: true`

**铁律**：当 `Allow-Credentials: true` 时

| 头 | 是否禁用 `*` |
|------|------|
| Allow-Origin | **禁用**（精确回显 Origin） |
| Allow-Headers / Methods / Expose-Headers | **禁用** |

否则浏览器**直接拒绝响应**，`Set-Cookie` 不写入

> 响应应配 `Vary: Origin` 防 CDN 缓存污染。

<!--
带凭证时禁用所有通配符是 CORS 最常考的核心约束。
-->

---
layout: quote
---

# CSRF ≠ CORS

「CORS 是浏览器同源策略的**受控放宽**——
简单请求不触发 preflight，
攻击者可通过隐藏表单发起 CSRF。
**CSRF 必须用 Anti-CSRF Token 或 SameSite Cookie 独立防护。**」

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- CSP 出现 `'unsafe-inline'` / `'unsafe-eval'`（基本等于没设）
- HTTP 头写在 `<meta>`（X-Frame-Options / HSTS 完全无效）
- HSTS 写在 HTTP 响应（浏览器忽略）
- `Allow-Origin: *` 配 `Allow-Credentials: true`（浏览器拒绝）
- CSRF 防护依赖 CORS（简单请求不触发 preflight）
- 固定写死 nonce（违背 Number used once）
- 继续 `X-Frame-Options: ALLOW-FROM`（已废弃）
- `report-uri` 配置 CSP 上报（应迁移 `report-to`）
- `Permissions-Policy: camera=*`（等于无防护）
- 以为 Helmet 包含 CORS（需独立 `npm install cors`）

<!--
跑一遍反模式，每个都是高频考题与生产事故点。
-->

---
layout: center
class: text-center
---

# 小结

前端纵深防御 = OWASP Top 10 风险地图 + 四件套

CSP · HTTP 安全头 · Helmet.js · CORS

**nonce + strict-dynamic · Report-Only 先行 · CORS 凭证禁 `*` · CSRF 独立防**

[OWASP Top 10](https://owasp.org/Top10/) · [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) · [Helmet.js](https://helmet.js.org/)

<!--
掌握四件套的边界与铁律，就能把前端防护做到生产水准。
-->
