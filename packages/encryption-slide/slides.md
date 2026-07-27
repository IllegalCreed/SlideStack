---
theme: seriph
background: https://cover.sli.dev
title: 加密完全指南
info: |
  前端加密完全指南：对称(AES-GCM) · 非对称(RSA/ECC) · 哈希(SHA-2) · 密码哈希(argon2/bcrypt) · PKI · Web Crypto API

  Learn more at [https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 加密完全指南

对称 AES-GCM · 非对称 RSA/ECC · 哈希 SHA-2 · 密码哈希 · PKI · Web Crypto API

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
加密是密码学的核心，前端可触及 Web Crypto API + crypto-js 历史 + TLS/X.509 证书链。
-->

---
transition: fade-out
---

# 什么是加密

把可读明文通过算法与密钥转换成不可读密文

- **机密性**：明文只能被授权方读懂——靠加密
- **完整性**：数据没被篡改——靠 MAC / AEAD（AES-GCM）
- **真实性**：数据确实来自声称的发送方——靠签名
- **不可否认性**：发送方事后不能抵赖——靠数字签名

**前端可触及的四个层次**

- **传输加密**：浏览器与服务器（TLS）负责，前端不能关闭
- **客户端加密**：浏览器内 AES-GCM 文件加密、SHA-256 摘要
- **静态加密**：数据库列加密，KMS / HSM / Vault（后端层）
- **密码哈希**：Argon2id / bcrypt（后端层）

> 前端加密**无法替代 HTTPS**，也**无法替代后端密码哈希**。

<!--
四个层次务必分清，避免选错算法。
-->

---

# 三类算法速览

| 类型 | 密钥 | 可逆 | 代表算法 |
|------|------|------|------|
| **对称加密** | 1 个（共享） | 是 | AES-GCM、ChaCha20 |
| **非对称加密** | 2 个（公钥 + 私钥） | 是 | RSA-OAEP、ECDH、Ed25519 |
| **哈希（摘要）** | 无 | 否（单向） | SHA-256 / 512 |
| **密码哈希** | 通常无（带盐） | 否（单向 + 慢） | Argon2id、bcrypt、scrypt |
| **MAC** | 1 个（共享） | 否（标签） | HMAC-SHA256 |
| **签名** | 2 个 | 否（签名值） | ECDSA、Ed25519、RSA-PSS |

> 对称适合**大数据**（性能高、硬件加速），非对称适合**密钥协商**（性能低、长度受限）。

<!--
记住这张表是入门的核心，避免选错算法类型。
-->

---

# 对称加密：AES-GCM

**AEAD（加密 + 认证一体）**，前端首选

- 密钥长度：**128 / 192 / 256 位**，推荐 256
- IV：**96 位（12 字节）CSPRNG 随机，每次不重用**
- tagLength：**128**（推荐）· AAD：可选（纳入认证）

**模式对比**

| 模式 | 认证 | 推荐度 |
|------|------|------|
| **AES-GCM** | 是（AEAD） | **首选** |
| AES-CBC / CTR | 否（需另配 MAC） | 不推荐 |
| **AES-ECB** | — | **禁用**（泄露明文模式） |

> ECB 因「相同明文块 → 相同密文块」泄露模式，有经典反例 ECB 企鹅图。

<!--
GCM 的核心优势是 AEAD：加密与认证一体，无需另配 MAC。
-->

---

# AES-GCM IV 一次性铁律

**同一 key 下 IV 重用 = 灾难**

- 机密性破坏：可恢复明文
- 认证性破坏：可伪造 GCM tag

**正确做法**

```ts
// 每次加密前重新生成 IV
const iv = crypto.getRandomValues(new Uint8Array(12));
// IV 与密文一起传输（IV 不需保密）
```

**错误做法**

- IV 硬编码进源码或固定为 `0x00...00`
- IV 用计数器实现但单点重启
- 用 `Math.random()` 生成 IV

> **CSPRNG**：浏览器 `crypto.getRandomValues`，Node `crypto.randomBytes`。`Math.random()` **不安全**。

<!--
GCM 的 IV 重用是密码学最严重的灾难之一，必须每次随机生成。
-->

---

# 非对称加密：RSA-OAEP

**禁用 PKCS1-v1.5**（Bleichenbacher 攻击）

- 密钥：**≥ 3072 位**（2048 仅遗留）
- 哈希：**SHA-256**（SHA-1 已弱）
- 用途：加密小块数据、密钥包装

**明文长度上限**（2048 + SHA-256 ≈ 190 字节）

| RSA | SHA-256 |
|------|------|
| 2048 | 190 B |
| **3072** | **318 B** |
| 4096 | 446 B |

> 大数据**不能**直接用 RSA——用**混合加密**（AES 加密数据 + RSA 包裹 AES 密钥）。

<!--
RSA-OAEP 是 RSA 加密的唯一安全填充模式，PKCS1-v1.5 已被实战攻破。
-->

---
layout: two-cols
---

# ECC 与 Ed25519

**256 位 ECC ≈ 3072 位 RSA**，密钥短得多

**算法选型**

- 密钥协商：**X25519**（现代首选）
- 签名：**Ed25519**（确定性、性能优）
- ECDSA：P-256 / P-384
- 加密：用 RSA-OAEP 或混合加密

**Node 18+ / 现代浏览器**原生支持 Ed25519 / X25519

::right::

<br>

# 密钥长度等价

| 对称 | RSA | ECC |
|------|------|------|
| 80 | 1024 | 160 |
| 112 | 2048 | 224 |
| **128** | **3072** | **256** |
| 192 | 7680 | 384 |
| 256 | 15360 | 512 |

> ECC 256 位 ≈ RSA 3072 位 ≈ 对称 128 位。

<!--
ECC 现代首选，密钥短、性能优、安全性高。
-->

---

# 哈希：SHA-2 系

**单向不可逆**、固定长度、抗碰撞

- **SHA-256 / 384 / 512**：Web Crypto `digest` 支持
- SHA-1 / MD5：**禁用于安全用途**
- 用途：完整性、签名摘要、HMAC、内容寻址

**SHA-256 摘要**

```ts
const digest = await crypto.subtle.digest(
  "SHA-256",
  new TextEncoder().encode("hello")
);
```

> **绝不用 SHA 直接存密码**——设计目标是「快」，GPU 每秒可算数十亿次。

<!--
哈希与密码哈希是两类东西，密码哈希需要慢且可调。
-->

---

# 密码哈希：慢哈希

**OWASP 推荐优先级**

| 算法 | 参数 | 浏览器原生 |
|------|------|------|
| **Argon2id** | m=19456, t=2, p=1 | 否（需 WASM） |
| scrypt | N=2^17, r=8, p=1 | 否 |
| bcrypt | work ≥ 10 | 否 |
| **PBKDF2** | 600000 次 SHA-256 | **是** |

**为什么不能用 MD5 / SHA 存密码**

- 设计目标「快」、无内存硬度，GPU/ASIC 可大规模并行
- 每秒可暴力数十亿次

> **pepper**（HMAC 后哈希）做纵深防御，与 hash 分库存。

<!--
密码哈希永远在后端做，浏览器原生只支持 PBKDF2。
-->

---
layout: two-cols
---

# Web Crypto API

**入口**：`window.crypto.subtle`

- 仅安全上下文（HTTPS / localhost）
- 所有方法**返回 Promise**
- 操作 **ArrayBuffer / TypedArray**
- 命名为 "subtle" = 易误用

**方法清单**

- `encrypt / decrypt`
- `digest`（SHA-1/256/384/512）
- `sign / verify`
- `generateKey`
- `deriveKey / deriveBits`
- `importKey / exportKey`
- `wrapKey / unwrapKey`

::right::

<br>

# 算法支持矩阵

| 操作 | 支持 |
|------|------|
| encrypt | AES-CBC/GCM/CTR、RSA-OAEP |
| sign | ECDSA、Ed25519、HMAC、RSA-PSS |
| deriveKey | PBKDF2、HKDF、ECDH、X25519 |
| digest | SHA-1/256/384/512 |

> **没有** `getKeyLength` 方法。

<!--
Web Crypto 是当前前端加密的官方推荐方案。
-->

---

# AES-GCM 完整代码

```ts
// 1. 生成 256 位 AES-GCM 密钥（一次性，长期保存）
const key = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt", "decrypt"]
);

// 2. 每次加密：生成新 IV（12 字节，CSPRNG）
const iv = crypto.getRandomValues(new Uint8Array(12));
const cipher = await crypto.subtle.encrypt(
  { name: "AES-GCM", iv, tagLength: 128 },
  key,
  new TextEncoder().encode("hello")
);

// 3. IV + cipher 拼接传输；解密时拆出
```

> `decrypt` 自动验 GCM tag，tag 不匹配抛 `OperationError`。

<!--
完整工作流的精髓：每次新 IV + IV 与密文一起传输 + extractable=false。
-->

---

# 混合加密（信封加密）

**大数据加密的标准模式**

```text
1. 生成 AES-256-GCM 数据密钥 DEK
2. 用 DEK 加密大数据（AES-GCM 性能优）
3. 导出 DEK，用对方公钥 RSA-OAEP 包裹 DEK
4. 传输：wrappedDek + IV + ciphertext
5. 接收方：私钥解开 wrappedDek → DEK → 解密
```

**为何需要混合加密**

- RSA 加密有长度限制（3072 + SHA-256 ≈ 318 B）
- RSA 性能远低于 AES
- 大数据必须用 AES，密钥用 RSA 包裹

> 现代变体：用 **ECDH + HKDF** 协商 AES 密钥（TLS 1.3 模式）。

<!--
混合加密是工业标准，所有端到端加密系统都用这个模式。
-->

---

# PKI：X.509 证书链

```
Root CA（自签名信任锚，预置信任库）
   │ 签发
Intermediate CA（中间 CA）
   │ 签发
Leaf（叶子证书，服务器实际使用）
```

**逐层验证**

1. 用上级 CA 公钥验本级证书签名
2. 当前时间在 `notBefore` / `notAfter` 之间
3. **SAN** 匹配请求域名（含通配符）
4. 查吊销状态（CRL / OCSP）

> 现代证书主体名常为空，**SAN 标记 critical**——浏览器只看 SAN 不看 CN。

<!--
前端代码不能关闭或绕过证书校验，TLS 握手由浏览器与网络层完成。
-->

---
layout: quote
---

# crypto-js 已停更

「Active development of CryptoJS has been **discontinued**. This library is **no longer maintained**.」

— [brix/crypto-js](https://github.com/brix/crypto-js) 官方仓库

**新项目替代方案**

- 浏览器：`window.crypto.subtle`
- Node：`node:crypto`

> crypto-js 仍含 MD5 / SHA1 等弱算法，新项目误用风险高。

<!--
crypto-js 的核心坑是自带 EVP_BytesToKey KDF 与 Web Crypto 工作流不兼容，迁移不是简单替换。
-->

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 用 **AES-ECB**（泄露明文模式）
- AES-GCM **IV 重用**（灾难性破坏）
- 用 **SHA-256 / MD5 存密码**（设计目标是快）
- RSA **PKCS1-v1.5** 填充（Bleichenbacher 攻击）
- `Math.random()` 做密钥 / IV / 盐（非 CSPRNG）
- 硬编码密钥进前端 bundle（任何人 F12 提取）
- **前端加密替代 HTTPS**（密钥可被提取）
- 浏览器端 hash 密码认为就安全（后端仍需 Argon2id）
- 新项目继续选 **crypto-js**（已 Discontinued）
- 混淆「传输 / 静态 / 客户端 / 密码哈希」四个场景

<!--
反模式的核心是分清四个场景、选对算法、不偷懒。
-->

---
layout: center
class: text-center
---

# 小结

加密 = 机密性 + 完整性 + 真实性 + 不可否认性

AES-GCM · RSA-OAEP · ECC · SHA-2 · Argon2id · Web Crypto API

**AES-GCM IV 一次性 · RSA ≥ 3072 · 密码用慢哈希 · 前端不持机密**

[MDN SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) · [W3C WebCrypto](https://www.w3.org/TR/webcrypto-2/) · [OWASP Crypto Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)

<!--
掌握四类算法选型 + Web Crypto API 工作流 + 安全边界，就能把加密用到生产水准。
-->
