---
theme: seriph
background: https://cover.sli.dev
title: SAML 2.0 完全指南
info: |
  SAML 2.0（OASIS 2005）完全指南：IdP/SP/Principal · Assertion · Bindings · XML 签名 · XSW/Replay 防御 · vs OIDC

  Learn more at https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html
drawings:
  persist: false
transition: slide-left
mdc: true
---

## SAML 2.0 完全指南

OASIS 2005 · IdP / SP / Principal · Assertion · Bindings · XML 签名 · vs OIDC

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
SAML 2.0 是 OASIS 2005 年发布、基于 XML 的身份联邦 + SSO 协议，企业 SSO 事实标准。
-->

---

# 什么是 SAML 2.0

OASIS 2005 年发布的、基于 **XML** 的身份联邦与单点登录协议

- **身份联邦而非授权**：解决「我是谁、我在 IdP 认证过、我有这些属性」的跨信任方传递，**无 Access Token、不定义 API 授权**
- **XML + 表单 POST**：协议本质是 IdP ↔ SP 后端 + 浏览器重定向，与 JWT 的 `Bearer` 头是两种范式
- **企业 SSO 事实标准**：与 Salesforce/ServiceNow/Azure AD/Okta/ADFS/政府联邦原生兼容
- **签名核心**：XMLDSig（enveloped + C14N）+ 强制 TLS 1.2+
- **场景边界**：传统企业浏览器用 SAML；SPA/移动端/API-first 优先 OIDC

> SAML ≠ OAuth 2.0/OIDC。SAML 解决企业浏览器 SSO；OIDC 是 OAuth 2.0 之上的身份层。

<!--
SAML 与 OAuth/OIDC 是不同时代、不同范式、不同场景的身份协议。
-->

---

# 三角色：IdP / SP / Principal

| 角色 | 全称 | 职责 | 典型实现 |
|------|------|------|------|
| **IdP** | Identity Provider | 认证用户、签发已签名 Assertion | Azure AD / Okta / ADFS / Keycloak |
| **SP** | Service Provider | 消费 Assertion、授予业务访问 | Salesforce / ServiceNow / 自建 Node SP |
| **Principal** | 被认证主体 | 通常为终端用户 | 浏览器中的用户 |

**信任方向**

- SP **信任** IdP 签发的断言（通过预共享 IdP 签名证书）
- IdP **不**信任 SP
- 用户身份信息**单向**从 IdP 流向 SP

> IdP ≠ OAuth 2.0 的 Authorization Server。IdP 只发身份断言，Authorization Server 发 Access Token。

<!--
角色三件套是 SAML 协议的基础。SP 信任 IdP，用户身份单向流动。
-->

---

# Assertion 结构：身份信息的 XML 容器

```xml
<saml:Assertion ID="_abc" Version="2.0" IssueInstant="2026-07-27T08:00:00Z">
  <saml:Issuer>https://idp.example.com</saml:Issuer>
  <ds:Signature>...</ds:Signature>
  <saml:Subject>
    <saml:NameID Format="...:transient">user-abc</saml:NameID>
    <saml:SubjectConfirmation Method="...:cm:bearer">
      <saml:SubjectConfirmationData InResponseTo="_req"
        NotOnOrAfter="2026-07-27T08:01:00Z" Recipient="https://sp.example.com/acs"/>
    </saml:SubjectConfirmation>
  </saml:Subject>
  <saml:Conditions NotBefore="..." NotOnOrAfter="...">
    <saml:AudienceRestriction><saml:Audience>https://sp.example.com</saml:Audience></saml:AudienceRestriction>
  </saml:Conditions>
  <saml:AuthnStatement AuthnInstant="...">...</saml:AuthnStatement>
  <saml:AttributeStatement><saml:Attribute Name="email">...</saml:Attribute></saml:AttributeStatement>
</saml:Assertion>
```

三类 Statement：Authentication（认证方式）/ Attribute（属性）/ Authorization Decision（少用）

<!--
Assertion 是 IdP 签发的 XML 容器，三类 Statement 承载认证 + 属性 + 授权决策。
-->

---
layout: two-cols
---

# NameID Format

| Format | 隐私 | 适用 |
|------|------|------|
| **transient** | 最高（每次新假名） | IdP-Initiated |
| **persistent** | 高（按 SP 隔离） | 跨会话关联 |
| email-address | 低（可复用） | 简单内部 |
| X509SubjectName | 中（依赖 PKI） | 证书身份 |
| entity | N/A | 服务间 |

**推荐**：persistent 或 transient

::right::

# SubjectConfirmation Method

| Method | 强度 | 适用 |
|------|------|------|
| **bearer** | 中 | 浏览器 SSO（95%） |
| holder-of-key | **最高** | 高敏感 + ECP |
| sender-vouches | 低 | 代理场景，少用 |

**生产事实标准**：bearer + TLS + 极短时间窗口 + Assertion ID 去重缓存

> holder-of-key 在 ECP/PAOS 等非浏览器场景才有意义

<!--
NameID 决定用户标识的隐私强度；SubjectConfirmation 决定主体确认方式。
-->

---

# Bindings：消息如何传输

| Binding | 编码 | 传递 | 签名 | 用途 |
|------|------|------|------|------|
| **HTTP Redirect** | DEFLATE + URL query | 302 重定向 | URL 可单独签名 | 短消息（AuthnRequest） |
| **HTTP POST** | Base64 + 表单字段 | 浏览器自动 POST | **断言必须签名** | 含签名 Assertion 的 Response |
| **HTTP Artifact** | 固定长度 artifact | GET/POST | 后端 SOAP 独立签名 | 极敏感场景 |
| **SAML SOAP / PAOS / ECP** | SOAP 信封 / 反向 SOAP | HTTP SOAP | 整条 SOAP 签名 | 后端直连 / 非浏览器客户端 |

**典型组合**：SP→IdP 用 Redirect（短），IdP→SP 用 POST（长，断言必须签名）

<!--
Redirect 编码：DEFLATE + Base64 + URL query；POST 编码：Base64 + 表单字段。
-->

---

# SP-Initiated SSO 流程

```text
1. 用户访问 SP → 未登录
2. SP 生成 AuthnRequest（ID + ACS URL + NameIDPolicy），HTTP Redirect 到 IdP
3. 浏览器 GET idp/SSO?SAMLRequest=...&RelayState=origin
4. IdP 检查会话：无 → 登录页（含 MFA）；有 → 跳过
5. IdP 构造 Response（含已签名 Assertion、InResponseTo=步骤2 ID、Destination=ACS）
6. 浏览器自动 POST 表单到 sp/acs（SAMLResponse + RelayState）
7. SP 验证：Response 签名 + Assertion 签名 + InResponseTo + Destination
            + Audience + Recipient + 时间窗口 + Assertion ID 去重
8. SP 提取 NameID + Attributes，建业务会话
9. 重定向到 RelayState 原始 URL
```

**IdP-Initiated 变体**：少 InResponseTo 关联，是 Replay 高发场景，需更严格 Destination/Audience 校验

<!--
SP-Initiated 是最常见流程，9 步完整覆盖 SAML 通信全貌。
-->

---
layout: two-cols
---

# HTTP Redirect 编码

```text
1. SAML XML → UTF-8 字节
2. DEFLATE 压缩（zlib 无头）
3. Base64 编码
4. URL 编码（percent-encoding）
5. URL query：?SAMLRequest=...
6. 浏览器 302 重定向
```

- 受 URL 长度限制（~2000-8000 字节）
- 用于 AuthnRequest、LogoutRequest
- **不适合**含签名 Assertion 的长 Response

::right::

# HTTP POST 编码

```text
1. SAML XML → UTF-8 字节
2. Base64 编码（不 DEFLATE）
3. 放入 HTML 表单隐藏字段
4. 浏览器自动 POST
```

```html
<form method="POST" action="https://sp.example.com/acs">
  <input type="hidden" name="SAMLResponse" value="..."/>
  <input type="hidden" name="RelayState" value="/dashboard"/>
</form>
```

- 不受 URL 长度限制
- **断言必须签名**

<!--
两种 Binding 的编码差异：Redirect 多了 DEFLATE，POST 不压缩但放在表单。
-->

---

# XML 签名结构（Enveloped）

```xml
<saml:Assertion ID="_abc">
  <ds:Signature>
    <ds:SignedInfo>
      <ds:CanonicalizationMethod Algorithm="...xml-exc-c14n#"/>
      <ds:SignatureMethod Algorithm="...rsa-sha256"/>
      <ds:Reference URI="#_abc">
        <ds:Transforms>
          <ds:Transform Algorithm="...enveloped-signature"/>
          <ds:Transform Algorithm="...xml-exc-c14n#"/>
        </ds:Transforms>
        <ds:DigestMethod Algorithm="...sha256"/>
        <ds:DigestValue>...</ds:DigestValue>
      </ds:Reference>
    </ds:SignedInfo>
    <ds:SignatureValue>...</ds:SignatureValue>
    <ds:KeyInfo>...</ds:KeyInfo>
  </ds:Signature>
  <!-- Assertion 实际内容 -->
</saml:Assertion>
```

**关键**：`URI="#_abc"` 必须指向业务读取的同一节点（防 XSW）；禁用 SHA-1

<!--
Enveloped 签名：签名节点嵌入被签元素内部；C14N 保证签名可复现。
-->

---

# 两阶段签名验证

**阶段一：Digest 验证（Reference 完整性）**

```text
1. 解析 <Reference URI="#_abc">，找 ID=_abc 的 Assertion
2. 应用 Transforms：
   a. enveloped-signature：移除 <ds:Signature> 子节点
   b. xml-exc-c14n：C14N 规范化
3. SHA-256 哈希 → 比对 <DigestValue>
```

**阶段二：SignatureValue 验证**

```text
1. 对 <SignedInfo> 应用 CanonicalizationMethod（C14N）
2. 用 IdP 公钥按 SignatureMethod（RSA-SHA256）验签
3. 比对 <SignatureValue>
```

> **两阶段都通过 = 签名有效**。任一失败必须拒绝。许多 XSW 漏洞根因是只做阶段二跳过阶段一。

<!--
两阶段验证是 XMLDSig 的核心，缺一不可。XSW 攻击就是利用阶段一的缺失。
-->

---

# XSW（XML Signature Wrapping）攻击

**根因**：签名验证库与应用数据提取使用**不同节点集**

```text
攻击者构造的 Response：
<Response>
  <Signature><Reference URI="#original">...</Reference></Signature>
  <Assertion ID="original">合法内容</Assertion>  ← 签名验证这个 ✅
  <Assertion ID="evil"><NameID>admin@attacker</NameID></Assertion>  ← 应用读这个 ❌
</Response>

签名库验签通过；应用用 getElementsByTagName 读到 evil-assertion → 攻击者以 admin 登录
```

**防御组合拳**

- `wantAssertionsSigned=true` + `wantAuthnResponseSigned=true`
- 应用从签名库返回的**已验证节点集**读数据
- 绝对 XPath / 基于 ID 的引用，禁用 `getElementsByTagName`
- 同一组件签名验证 + 数据提取

<!--
XSW 是 SAML 最经典的安全漏洞，根因是签名验证与数据提取的节点集不一致。
-->

---

# Replay 与跨 SP 重放防御

**Replay 防御组合拳**

| 防御 | 作用 |
|------|------|
| **InResponseTo 关联** | Response 须引用 AuthnRequest ID（Google SSO 历史漏洞缺失项） |
| **Assertion ID 去重缓存** | Redis TTL 缓存近期已消费 ID |
| **极短 NotOnOrAfter** | 典型 1 分钟，缩小窗口 |

**跨 SP 重放三字段**（任一不匹配即拒）：Destination=ACS URL · Audience=EntityID · Recipient=ACS URL

> OneTimeUse 由 IdP 声明、SP 应尊重；SP-A 截获断言提交 SP-B 由三字段阻断

<!--
Replay 防御是 InResponseTo + Assertion ID 去重 + 极短时间窗口的组合拳。
-->

---

# 签名证书与算法要求

**算法（NIST SP 800-131A Rev.2）**

| 算法 | 状态 |
|------|------|
| **RSA-SHA-256** | **推荐**（samlify 默认） |
| RSA-SHA-384 / ECDSA-SHA-256 | 接受 |
| **RSA-SHA-1** | **禁用**（2030 退役） |

**签名证书**：独立于 TLS · 最长 2 年 · HSM · EKU=documentSigning · KU=digitalSignature · metadata URL 发布（禁邮件交换）

<!--
NIST 已宣布 2030-12-31 前全面退役 SHA-1，现代 SAML 实现强制 RSA-SHA-256。
-->

---

# SAML vs OIDC 六维对比

| 维度 | SAML 2.0（2005） | OIDC（2014） |
|------|------|------|
| 数据格式 | XML Assertion | JSON + JWT |
| 协议范围 | 纯身份认证 + 属性（无 Access Token） | OAuth 2.0 之上含授权 |
| 元数据 | XML 互换 | .well-known/openid-configuration |
| 传输 | 表单 POST + 浏览器重定向 | Authorization Code Flow |
| 主战场 | 企业浏览器（Salesforce / 政府） | SPA + 移动端 + API-first |
| 吊销 | 难（短时效，SLO 不保证传播） | Refresh Token 轮换（RFC 9700） |

**选型**：传统企业应用 → SAML；新建项目 / SPA / 移动端 → OIDC；混合 → IdP 同时支持两者

<!--
新建项目优先 OIDC，传统企业应用继续 SAML，混合场景 IdP 可同时支持。
-->

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 仅验 Response 级签名，断言未独立签名（XSW）
- 用 `getElementsByTagName` 提取业务数据
- 使用 SHA-1 签名算法（NIST 已禁）
- 信任 XML 文档内 `<ds:KeyInfo>` 选公钥
- 跳过 InResponseTo / Destination / Audience / Recipient 校验
- 不维护 Assertion ID 去重缓存（Replay）
- TLS 证书兼任 SAML 签名证书
- 通过电子邮件交换证书
- XML 解析器未禁用 DTD（XXE）
- IdP-Initiated 未对 RelayState 做 allowlist（Open Redirect）
- 在 SPA / 移动端硬上 SAML（应换 OIDC）
- 极长 NotOnOrAfter 时间窗口（扩大 Replay 窗口）

<!--
反模式列表是 SAML 安全的核心 checklist，每条对应一类真实漏洞。
-->

---
layout: center
class: text-center
---

# 小结

SAML 2.0 = 基于 XML 的身份联邦 + SSO 协议（OASIS 2005）

IdP / SP / Principal · Assertion 三类 Statement · 五种 Binding · XML Enveloped 签名

**wantAssertionsSigned + wantAuthnResponseSigned + RSA-SHA-256 + InResponseTo + Assertion ID 去重**

[OASIS Tech Overview](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html) · [OWASP SAML Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html) · [samlify](https://github.com/tngan/samlify) · [passport-saml](https://github.com/node-saml/passport-saml)

<!--
掌握双签名校验 + Replay 防御 + 算法底线，就能把 SAML 用到生产水准。
-->
