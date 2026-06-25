---
theme: seriph
background: https://cover.sli.dev
title: HTTPS 与传输安全
info: |
  HTTPS 与传输安全 —— 安全三目标、加密原语、证书信任链、TLS 握手、MITM 与 HSTS、证书实务
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:locked class="text-8xl" />
</div>

<br/>

## HTTPS 与传输安全

让 Web 做到「看不懂、改不了、认得清」：从加密原语到证书与 TLS 握手（基于 TLS 1.3 / RFC 8446）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
HTTPS 是现代 Web 的准入门槛，却也是前端最容易"只会用、不懂原理"的一块。这一章不背 RFC，而是顺着一个问题展开：明文 HTTP 有什么风险、HTTPS 凭什么能挡住，从加密原语一路讲到证书、握手和工程落地。
-->

---
transition: fade-out
---

# 这一章讲什么

一条主线：**HTTPS 凭什么同时做到「看不懂、改不了、认得清」**

<v-click>

- **为什么需要 HTTPS**：明文三大风险、安全三目标、HTTP over TLS
- **对称与非对称加密**：两类算法 + 哈希签名 + 混合加密
- **数字证书与 CA**：X.509、信任链、验证四步、吊销与 CT
- **TLS 握手**：1.2 的 2-RTT vs 1.3 的 1-RTT、前向保密、SNI/ALPN
- **MITM 与 HSTS**：在途攻击、SSL 剥离、HSTS、HPKP 已废弃
- **证书实务**：DV/OV/EV、Let's Encrypt、混合内容、本地 HTTPS

</v-click>

<v-click>

> 看懂"加密 + 证书 + 握手"三件事，HTTPS 的全貌就在手里。

</v-click>

<!--
六块顺着一条逻辑链：先说不加密的代价，再讲加密原语，然后是"公钥归属"靠证书解决，握手把它们串起来，MITM/HSTS 讲攻防，最后落到工程实践。
-->

---
layout: section
---

# 为什么需要 HTTPS

明文传输的代价，与 HTTPS 的保护

---

# 明文 HTTP 的三大风险

报文在链路上完全裸奔，像寄明信片

<v-click>

| 风险 | 英文 | 攻击者能做什么 |
| --- | --- | --- |
| **窃听** | Eavesdropping | 被动读取链路上所有字节（Cookie、Token、密码） |
| **篡改** | Tampering | 主动改包：注入广告脚本、植入恶意代码 |
| **冒充** | Spoofing | 伪装成目标服务器，钓鱼 / DNS 劫持 |

</v-click>

<v-click>

> 公共 Wi-Fi 嗅探、运营商劫持注广告、假热点钓鱼都是真实手段；只把密码 base64 不是加密，首部 Cookie 照样裸奔。

</v-click>

<!--
请求行、首部、Cookie、表单、响应体全是可读字节，经过路由器、运营商、Wi-Fi、代理无数节点。窃听是被动的、受害者无感；篡改和冒充是主动的，会真实改变页面行为。
-->

---

# 安全三目标

HTTPS 通过 TLS 把三者全部覆盖

<v-click>

- **机密性（Confidentiality）**：数据加密，截获也读不懂 —— 反**窃听**
- **完整性（Integrity）**：带 MAC / AEAD 校验，改一个字节就被发现 —— 反**篡改**
- **身份认证（Authentication）**：用证书验证服务器身份 —— 反**冒充**

</v-click>

<v-click>

> 三件事由不同手段实现：机密性靠对称加密，身份认证靠证书与非对称，完整性靠 AEAD/MAC —— 怎么实现是后面的主题。

</v-click>

<!--
这三个目标正好一一对应前一页的三类风险。本页只需建立"HTTPS 同时保障机密性 + 完整性 + 身份认证"这个整体心智，具体密码学手段后面拆。
-->

---

# HTTPS = HTTP over TLS

不是新协议，只是 HTTP 跑在 TLS 通道里

<v-click>

```text
     明文 HTTP                  HTTPS（HTTP over TLS）
  ┌──────────┐              ┌──────────┐
  │   HTTP   │              │   HTTP   │  ← 报文完全相同
  ├──────────┤              ├──────────┤
  │   TCP    │              │ TLS 加密 │  ← 多插一层
  ├──────────┤              ├──────────┤
  │    IP    │              │   TCP/IP │
  └──────────┘              └──────────┘
```

</v-click>

<v-click>

- HTTP 的方法、状态码、首部**一字不改**，只在 TCP 与 HTTP 间插入 TLS 层
- 前端能看到的差异只有三处 ↓（下一页）

</v-click>

<!--
HTTPS 不是另起炉灶，报文语义完全是 HTTP。DevTools 之所以还能看到明文，是因为它在浏览器内部、解密之后读取，链路上真实传输的是密文。
-->

---

# HTTP 与 HTTPS 的三处差异

落到前端能直接看到的，就这三点

<v-click>

| 维度 | HTTP | HTTPS |
| --- | --- | --- |
| URL 协议头 | `http://` | `https://` |
| 默认端口 | 80 | 443 |
| 地址栏 | 标「不安全 / Not secure」 | 无警告（曾有锁图标） |

</v-click>

<v-click>

> 在 HTTP 站点抓包能看到明文请求；换 HTTPS，链路上只剩加密字节 —— 抓包看到的"乱码"正是 TLS 在起作用。

</v-click>

<!--
记住这三处差异就够了：协议头、端口、地址栏提示。其余 HTTP 的一切照旧。
-->

---

# SSL 已死，现役是 TLS

「SSL 证书」只是历史叫法

<v-click>

| 版本 | 状态（2026） | 说明 |
| --- | --- | --- |
| SSL 2.0 / 3.0 | ❌ 废弃 | 存在 POODLE 等严重漏洞 |
| TLS 1.0 / 1.1 | ❌ 已弃用 | **RFC 8996（2021）** 正式弃用 |
| TLS 1.2 | ✅ 在用 | 安全配置下可接受 |
| TLS 1.3 | ✅ 主流推荐 | RFC 8446，握手更快、默认更安全 |

</v-click>

<v-click>

> 对外说「SSL」基本都指 TLS；但任何真在用 SSL 2/3 或 TLS 1.0/1.1 的配置都是隐患，应升级到 1.2/1.3。

</v-click>

<!--
SSL 是 TLS 的前身，由 Netscape 在 1990 年代提出，2.0/3.0 已废弃。TLS 是标准化后继。口头叫"SSL"没问题，技术判断上要认 TLS 版本。
-->

---

# HTTPS 是强能力 API 的门票

Secure Context（安全上下文）= 准入门槛

<v-click>

- 判定条件：页面经 HTTPS 送达，且整条祖先链都是 HTTPS
- 下列 API 在普通 HTTP 页面**直接不可用**：
  - **Service Worker**（离线 / PWA 地基）
  - **`getUserMedia()`**（摄像头 / 麦克风）
  - **Geolocation**、**Web Crypto** `crypto.subtle`、**Push**、**WebAuthn**

</v-click>

<v-click>

```js
// 用 isSecureContext 特征检测，再决定是否启用强能力
if (window.isSecureContext) {
  navigator.serviceWorker.register("/sw.js");
}
```

</v-click>

<!--
HTTPS 早已不是锦上添花，而是大量强能力 API 的前提。除了挡攻击，它直接决定前端能用哪些能力。还带来用户信任、SEO 收益、以及 HTTP/2·3 升级红利。
-->

---

# localhost 例外与混合内容

本地开发不必为证书发愁，但要警惕混合内容

<v-click>

- **可信来源例外**：`http://localhost`、`127.0.0.1`、`*.localhost`、`file://`、`wss://` 享安全上下文待遇
- **坑**：用局域网 IP（`http://192.168.x.x`）真机调试**不算**安全上下文，这些 API 会失效

</v-click>

<v-click>

- **混合内容（Mixed Content）**：HTTPS 页面里加载 `http://` 子资源 —— 浏览器会拦截（脚本等）或自动升级（图片等），否则安全保证形同虚设（详见"证书实务"）

</v-click>

<!--
localhost 调试 Service Worker、摄像头都没问题，但真机用 IP 不行。混合内容是落地 HTTPS 的常见坑，后面证书实务会专门展开。
-->

---
layout: section
---

# 对称与非对称加密

HTTPS 底层的三种密码学原语

---

# 对称加密：一把钥匙锁与开

加密、解密用**同一把密钥**

<v-click>

- **特点**：快，适合加密海量数据（网页、视频、API 响应）
- **代表算法**：
  - **AES**：分组密码，配工作模式（GCM/CTR/CBC），现代首选 **AES-GCM**
  - **ChaCha20**：流密码，常配 Poly1305；无 AES 硬件加速的设备上更快

</v-click>

<v-click>

> **死穴 = 密钥分发**：双方必须先持有同一把密钥，但在不安全网络里怎么把这把密钥安全交过去？直接发就被截获 —— 单靠对称无解。

</v-click>

<!--
对称加密本身又快又安全，唯一的问题是"先有蛋还是先有鸡"：得先共享密钥才能通信，而共享这一步本身就不安全。这就是密钥分发难题，引出非对称。
-->

---

# 非对称加密：公钥私钥成对

一把密钥的变换，只能用另一把还原

<v-click>

- **加密方向**：**公钥加密 / 私钥解密** —— 公钥可公开，谁都能加密，只有持私钥者能解
  - → 把"共享密钥"难题转成"公开公钥"
- **签名方向**：**私钥签名 / 公钥验签** —— 只有持私钥者能签，任何人可验
  - → 带来**身份认证**与**不可否认**

</v-click>

<v-click>

> **代价 = 慢**：大数模幂 / 椭圆曲线点乘比对称慢几个数量级，只宜干"关键但量小"的事：协商密钥、验身份、签名。

</v-click>

<!--
公私钥两个方向正好相反，对应两类用途。RSA 既能加密也能签名、最常见；ECC（含 ECDH 协商、ECDSA 签名）等强度下密钥更短更快，现代 TLS 与证书正大量转向 ECC。
-->

---

# 哈希与数字摘要

SHA-256：内容的"指纹"

<v-click>

- **单向**：由输入算摘要极快，由摘要反推输入不可行
- **定长**：输入 1 字节还是 1 GB，输出恒为 256 位 / 32 字节
- **雪崩效应**：改 1 个比特，摘要面目全非

</v-click>

<v-click>

> **哈希不是加密**：没有密钥、不可逆，目的不是"保密后还原"，而是"生成可比对的指纹"。它用来校验完整性，也是数字签名的第一步。

</v-click>

<!--
把哈希和加密混为一谈是常见误区。哈希没有密钥也无法还原，它只回答"内容有没有被改过"。雪崩效应保证了改一点点指纹就完全不同。
-->

---

# 数字签名 = 哈希 + 非对称

同时证明「内容没被改」+「确实是某人发的」

<v-click>

```text
签名方（持私钥）：
  内容 ──哈希──▶ 摘要 ──私钥加密──▶ 数字签名
  发出「原始内容 + 签名」

验签方（持公钥）：
  签名 ──公钥解开──▶ 原始摘要
  内容 ──重新哈希──▶ 本地摘要
  两摘要一致 → 未篡改且出自持私钥者
```

</v-click>

<v-click>

> 先哈希再签：非对称慢，先压成 32 字节摘要再签，又快又能靠雪崩效应锁定全文。**签名 ≠ 加密**，它不隐藏内容。

</v-click>

<!--
签名保证"完整 + 来源可信"，不保证保密。保密交给加密、可信交给签名，两件事别混。为什么先哈希？因为直接签整段太慢，先压成定长摘要划算。
-->

---

# 为什么 TLS 要「混合」加密

让对称和非对称各做自己擅长的事

<v-click>

| 维度 | 对称加密 | 非对称加密 |
| --- | --- | --- |
| 速度 | **快**，适合大数据流 | **慢**，只宜小数据 |
| 密钥分发 | **难**（死穴） | 容易（公钥可公开） |
| 典型用途 | 加密应用数据 | 协商密钥 / 认证 / 签名 |

</v-click>

<v-click>

> **一句话**：用慢而安全的非对称，安全地协商出一把对称会话密钥；之后用快的对称加密传所有数据。

</v-click>

<!--
单用任何一种都不行：只用对称密钥没法安全分发，只用非对称传大量数据太慢。TLS 把两者组合，非对称负责"安全递钥匙 + 验身份"，对称负责"之后高速锁与开"。
-->

---

# 混合加密的两个阶段

握手用非对称，数据用对称

<v-click>

```text
① 握手阶段（非对称，量小）
   借服务端公钥 / 临时密钥协商
   双方各自算出 同一把会话密钥（不在网上明传）
        │
        ▼
② 数据阶段（对称，量大）
   用会话密钥做 AES-GCM / ChaCha20 加密
   网页、API、视频…全部走对称，高速且安全
```

</v-click>

<v-click>

> 每个会话重新握手、协商**全新会话密钥**，互不复用 —— 这既是安全需要，也为前向保密打基础。

</v-click>

<!--
会话密钥不在网络上明文传输，而是双方各自算出来的同一个值。每个会话一把新钥，用完即弃，这是前向保密（PFS）的前提，握手那章会细讲。
-->

---
layout: section
---

# 数字证书与 CA 信任链

公钥到底是不是对方的？

---

# 加密之外：公钥归属问题

非对称保证"只有私钥能解"，却不保证"公钥是谁的"

<v-click>

```text
你 ──「要 bank.com 的公钥」──▶ 中间人拦截
你 ◀──「这是公钥」（其实是中间人的）── 中间人
你 用它加密密码 ──▶ 直接加密给了攻击者
```

</v-click>

<v-click>

> 加密本身完好无损，崩的是**公钥的归属**。把公钥和真实身份绑定、并让绑定可被第三方验证 —— 这正是数字证书要解决的唯一问题。

</v-click>

<!--
这是非对称加密留下的致命缺口：它能保证机密，但不能保证你手里的公钥真属于 bank.com。中间人换一把自己的公钥，你就加密给了他。证书专治这个。
-->

---

# 数字证书：可验证的「公钥身份证」

X.509 格式，把三样东西打包并由 CA 背书

<v-click>

| 字段 | 含义 |
| --- | --- |
| **Subject / CN** | 证书主体（域名匹配现在看 SAN，不看 CN） |
| **SAN** | 覆盖的域名列表，含 `*.example.com` 通配符 |
| **Issuer** | 颁发者 CA 名称，串起信任链 |
| **Validity** | 有效期起止（趋向 ≤ 1 年甚至更短） |
| **Public Key** | 本主体的公钥 |
| **Signature** | CA 用**自己私钥**对证书内容的签名 |

</v-click>

<v-click>

> 证书 = **公钥 + 身份信息 + CA 数字签名**；签名只保护完整性 + 来源真实，不保密（证书本就公开）。

</v-click>

<!--
X.509 是业界标准格式。核心就是把公钥和身份绑在一起，再由 CA 用私钥签名担保。验证方用 CA 公钥验签，确认"这份绑定是该 CA 认可的、没被改过"。
-->

---

# CA 与信任链：三级角色

信任一级级往上挂，直到一个本来就信的锚点

<v-click>

```text
[根 CA 证书]  自签名 · 预装在 OS/浏览器信任库 ← 信任锚点
      │  用根私钥签发
      ▼
[中间 CA 证书]  Issuer = 根 CA
      │  用中间私钥签发
      ▼
[站点证书 bank.com]  Issuer = 中间 CA · 含公钥 + SAN
```

</v-click>

<v-click>

- **根 CA**：自签名，靠"被预装进信任库"取信；私钥离线保管
- **中间 CA**：根签发"可再签发"的证书，承担日常签发
- **叶子证书**：中间 CA 签给具体域名，即你部署的那张

</v-click>

<!--
根 CA 极其敏感，平时离线、不直接签站点证书。中间 CA 出事可单独吊销不动根。这就是为什么链是三级而不是根直接签叶子。
-->

---

# 根证书：内置的信任锚点

整条链能否成立，全看链顶根证书是否在本地信任库

<v-click>

- **根计划**：Mozilla、Apple、Microsoft、Google 各维护一份受信根 CA 列表，随 OS/浏览器分发
- 一个 CA 要被普遍信任，必须先通过审计、纳入这些根计划

</v-click>

<v-click>

- **常见现象**：企业内网自签证书报错（根不在公共库）；公司手动导入内部根 CA 后内网 HTTPS 才不报警 —— 本质是往信任库加了新锚点（也是企业中间盒能解密流量的原理）

</v-click>

<v-click>

> **服务器要发整条链**：叶子 + 中间证书（fullchain），漏中间证书会因"追不到根"而验证失败。

</v-click>

<!--
信任最终都收敛到本地那几百张内置根证书。漏配中间证书是最隐蔽的部署坑，后面验证那页会再强调。根证书无需服务器下发，它本就在客户端。
-->

---

# 浏览器如何验证一张证书

握手拿到证书链后，四步校验，任一失败即中断

<v-click>

1. **验证签名链**：从叶子沿 Issuer 上溯，每级验签，直到链顶是**受信根**
2. **检查有效期**：当前时间须在 Not Before ~ Not After 之间
3. **校验域名匹配**：主机名须命中证书 **SAN**（精确或通配符）
4. **检查是否被吊销**：CRL / OCSP / OCSP Stapling 确认未作废

</v-click>

<v-click>

> 信任链是"与"的关系：根受信、每级签名对、没过期没吊销、域名匹配，**全部成立**才可信 —— 最弱一环决定强度。

</v-click>

<!--
这四步是 HTTPS 信任的全部逻辑。任一环被攻破（如某中间 CA 被黑、误签发）都可能签出"看似合法"的证书，这正是 CT 机制要兜底的场景。
-->

---

# 验证失败 → 浏览器报错对照

前端排查 HTTPS 故障，错误码几乎都能对回某一步

<v-click>

| 报错（Chrome `NET::ERR_CERT_*`） | 失败步 | 常见原因 |
| --- | --- | --- |
| `AUTHORITY_INVALID` | ① 签名链 | 自签 / 内部 CA 未导入 / **漏配中间证书** |
| `DATE_INVALID` | ② 有效期 | 证书过期，或**本机系统时间不准** |
| `COMMON_NAME_INVALID` | ③ 域名 | 主机名不在 SAN、只配裸域没配 `www` |
| `ERR_CERT_REVOKED` | ④ 吊销 | 私钥泄露 / 误签发后被 CA 作废 |

</v-click>

<v-click>

> 本机能开、换台机器或 `curl` 报 `unknown issuer`，十有八九是只部署叶子、**漏了中间证书** —— 务必用 fullchain。

</v-click>

<!--
本机时间错乱常导致全站 HTTPS 报错，对应第二步。漏配中间证书最隐蔽：本地信任库恰好缓存过该中间 CA 能补全链，干净环境补不上。
-->

---

# 证书吊销：到期前提前作废

私钥泄露 / 误签发时需要让证书提前失效

<v-click>

| 机制 | 做法 | 痛点 |
| --- | --- | --- |
| **CRL** | CA 发布"已吊销序列号"清单，客户端下载比对 | 清单越积越大、有缓存延迟 |
| **OCSP** | 就单张证书向 CA 实时查询状态 | 多一次往返、泄露隐私、响应器宕机难处理 |
| **OCSP Stapling** | 服务器代查，把带签名应答"钉"在握手里 | **最优**：消除额外往返与隐私泄露 |

</v-click>

<v-click>

> 难点：证书已发到全世界，怎么高效通知"这张别信了"？OCSP Stapling 通过 TLS `status_request` 扩展实现，是当前推荐做法。

</v-click>

<!--
三种机制层层改进。OCSP Stapling 让服务器定期向 CA 拉取带时间戳的应答钉给客户端，客户端无需自己联系 CA，既快又不泄露隐私。
-->

---

# 证书透明度（CT）：兜底误签发

吊销解决"已知坏证书"，CT 应对"还没被发现的误签发"

<v-click>

- 每张新证书被记入公开的、**只追加的 Merkle 树日志**
- 签发时日志返回 **SCT**（签名证书时间戳）作为"已收录"凭证
- SCT 可嵌入证书 / TLS 扩展 / OCSP Stapling 下发

</v-click>

<v-click>

> 域名持有者借此**主动监控**有没有人偷偷为自己域名签证书。Chrome / Safari / Firefox 已**强制要求** CT，不合规直接不予信任。

</v-click>

<!--
误签发往往先被滥用、才被发现，吊销是事后补救。CT 让所有签发行为公开可查，把"暗中签发"变成"必然留痕"，是信任链的最后一道兜底。
-->

---
layout: section
---

# TLS 握手流程

1.2 的 2-RTT vs 1.3 的 1-RTT

---

# 握手要解决的三件事

在没有任何共享秘密的不安全信道上

<v-click>

1. **协商参数**：双方都支持哪些 TLS 版本、加密套件？取交集里最安全的
2. **验证身份**：服务端出示证书，客户端用 CA 信任链验证
3. **协商会话密钥**：窃听者也能看到全部握手报文，但双方算出同一把对称密钥、它算不出

</v-click>

<v-click>

> 为什么不全程用非对称？太慢。握手用非对称做认证与密钥协商，一完成就切到高效的对称加密 —— 这就是混合加密的落地。

</v-click>

<!--
TCP 三次握手之后紧接着就是 TLS 握手。它要在"还没有任何共享秘密"的前提下达成这三个目标。握手的全部精妙，就是为了安全地把那把对称密钥协商出来。
-->

---

# TLS 1.2 握手：约 2-RTT

两个完整往返才能发首个 HTTP 请求

<v-click>

```text
客户端                              服务端
  │ ──── ClientHello ──────────────▶ │ 版本/套件/ClientRandom
  │ ◀── ServerHello/Certificate ──── │ 选定套件/证书/ServerRandom
  │  验证证书 → 算密钥材料            │
  │ ──── ClientKeyExchange ────────▶ │
  │ ──── [CCS] Finished ───────────▶ │ 双方派生会话密钥
  │ ◀─── [CCS] Finished ──────────── │
  │ ═════ 此后用会话密钥对称加密 ════ │
```

</v-click>

<v-click>

> 叠加前面 TCP 的 1-RTT，HTTPS 首字节要等约 **3 个 RTT** —— 高延迟移动网下是实打实的首屏延迟。

</v-click>

<!--
两个 RTT：第一个交换 Hello 与证书，第二个交换密钥与 Finished。CCS = ChangeCipherSpec。这是 TLS 1.2 的固有成本，1.3 就是来砍这个的。
-->

---

# TLS 1.2 的隐患：静态 RSA 无前向保密

历史上的 RSA 密钥交换有致命弱点

<v-click>

- **RSA 密钥交换**：PreMasterSecret 用服务端证书公钥加密后**传输**
- **致命弱点**：服务端**长期私钥**日后泄露 → 攻击者可解密**历史上录下的所有流量**

</v-click>

<v-click>

- **更安全的 ECDHE**（TLS 1.2 推荐）：PreMasterSecret **不再传输**，双方用一次性临时密钥对各自独立算出同一值，临时密钥用完即弃 → 获得**前向保密**

</v-click>

<v-click>

> 这正是 TLS 1.3 彻底删除静态 RSA、只保留 (EC)DHE 的根本动机。

</v-click>

<!--
RSA 密钥交换把"会话密钥的种子"用长期私钥保护，私钥一旦泄露，所有历史流量都能被解密。ECDHE 让会话密钥只依赖一次性临时密钥，长期私钥泄露也救不回历史会话。
-->

---

# TLS 1.3 握手：精简到 1-RTT

客户端在 ClientHello 里直接捎带密钥协商参数

<v-click>

```text
客户端                              服务端
  │ ── ClientHello (+key_share,SNI,ALPN) ──▶ │ 附 ECDHE 公钥参数
  │ ◀─ ServerHello (+key_share)              │ 已能算出共享密钥
  │    {EncryptedExtensions}                 │ ← 大括号 = 已加密
  │    {Certificate}{CertificateVerify}      │
  │    {Finished} ─────────────────────────  │
  │ ── {Finished} ─────────────────────────▶ │
  │ ═══ 此后全程对称加密 ═══════════════════  │
```

</v-click>

<v-click>

> 客户端发 `ClientHello` 时就把密钥材料给齐，服务端一次回复带上证书、签名、Finished —— **一个往返**握手完毕，比 1.2 省整整一个 RTT，且 ServerHello 之后全加密。

</v-click>

<!--
1.3 的关键招数：客户端"赌"服务端会用某个主流 ECDHE 群，提前把 key_share 给出去。由于 1.3 套件列表大幅精简，这一赌几乎总是对的。配合 HTTP/3 握手还能与 QUIC 合并。
-->

---

# TLS 1.3 删除的不安全机制

精简的前提：砍掉历史包袱

<v-click>

| 被删除 / 弃用 | 原因 |
| --- | --- |
| 静态 RSA、静态 DH | 无前向保密；只保留 (EC)DHE |
| CBC 模式、RC4 | 易受 padding / 流密码攻击；只留 AEAD |
| MD5、SHA-1 | 已被攻破，不再用于签名 |
| TLS 压缩、重协商 | 引发 CRIME 等攻击 |
| Session ID、旧 Ticket | 由基于 PSK 的新恢复机制取代 |

</v-click>

<v-click>

> 删除这些"既增攻击面又拖慢握手"的机制，1.3 才能既更安全又更快。

</v-click>

<!--
RFC 8446 原话："ServerHello 之后的所有握手报文现已加密""静态 RSA 和 DH 套件已移除，所有公钥密钥交换机制现在都提供前向保密"。删繁就简是 1.3 的核心哲学。
-->

---

# ECDHE 与前向保密（PFS）

长期私钥日后泄露，也解不开历史流量

<v-click>

- **PFS 定义**：即使服务端长期私钥将来泄露，也无法解密之前录下的流量
- **ECDHE 工作直觉**：
  - 双方各生成一次性临时密钥对，互发公钥部分
  - 用"自己私钥 + 对方公钥"做椭圆曲线运算，**数学上必算出同一共享密钥**
  - 握手结束，临时私钥即丢弃、**从不落盘**

</v-click>

<v-click>

> 长期私钥在 ECDHE 里**只用来签名**"这些临时参数确出自我"，**不参与**会话密钥计算 —— 所以拿到它也还原不出任何历史会话密钥。

</v-click>

<!--
窃听者只看到两个公钥，算不出共享密钥（离散对数难题）。这是 PFS 的数学根基。长期私钥只负责"证明身份"，不负责"算密钥"，二者解耦正是关键。
-->

---

# 加密套件的构成

一组"配套使用"的算法

<v-click>

```text
TLS 1.2:  TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
           └密钥交换┘└认证┘     └对称加密┘ └哈希┘

TLS 1.3:  TLS_AES_128_GCM_SHA256   ← 只剩 AEAD + 哈希
          TLS_CHACHA20_POLY1305_SHA256
```

</v-click>

<v-click>

- **四片段**：密钥交换（ECDHE）+ 身份认证（RSA）+ 对称加密（AES-GCM）+ 摘要（SHA256）
- **1.3 简化命名**：密钥交换恒为 (EC)DHE、认证看证书类型，被单独协商，套件名只留"对称 + 哈希"

</v-click>

<!--
协商过程：ClientHello 按偏好列出支持的套件，服务端挑一个自己也支持的在 ServerHello 回告，双方就此对齐算法。1.3 把密钥交换和认证拆出去单独谈，名字才这么短。
-->

---

# 两个关键扩展：SNI 与 ALPN

ClientHello 里和前端最常打交道的两个

<v-click>

- **SNI（Server Name Indication）**：客户端在 ClientHello 里**明文携带目标域名**
  - 让一个 IP 上多个 HTTPS 站点返回正确证书（虚拟主机 / CDN 必备）
  - 传统 SNI 明文会泄露访问域名，**ECH** 把它也加密（2026 推广中）

</v-click>

<v-click>

- **ALPN（Application-Layer Protocol Negotiation）**：握手中顺便协商应用层协议
  - 客户端列 `h2` / `http/1.1` / `h3`，服务端选定回告
  - **HTTP/2 的启用就靠 ALPN 选中 `h2`**，省掉额外往返

</v-click>

<!--
SNI 解决的难题：握手要先选证书，但服务端此时还没收到 HTTP 的 Host 头（那是握手后才发的），靠 SNI 才知道该返回哪张证书。ALPN 让协议协商搭握手便车。
-->

---

# 会话恢复与 0-RTT

回头客可以更快

<v-click>

- **会话恢复**：首次握手后服务端发 `NewSessionTicket`，派生出**恢复主密钥**（PSK）；下次带票据跳过证书与完整协商
- **0-RTT**：回头客在握手**第一个包**里就捎带 HTTP 请求，零往返开始传业务数据

</v-click>

<v-click>

> **0-RTT 的代价 = 重放攻击**：早期数据在握手完成前发出，无前向保密且可被重放 —— **只有幂等请求（如 GET）能走**，绝不能放下单 / 转账。

</v-click>

<!--
0-RTT 很诱人但有安全坑：和 HTTP/3 QUIC 的 0-RTT 约束完全一致，本质是同一套 TLS 1.3 机制。写操作放进 0-RTT 一旦被重放就是重复下单/转账，规范明确禁止。
-->

---
layout: section
---

# 中间人攻击与 HSTS

攻防全景：降级攻击与强制 HTTPS

---

# 中间人攻击（MITM）

潜伏在链路中间的"会拆信的邮差"

<v-click>

- **定义**：攻击者插进通信双方之间，截获、读取、篡改、转发流量，对双方都"隐形"
- 现代术语更准确叫**在途攻击者**（on-path attacker）
- **常见手法**：
  - **公共 Wi-Fi**：伪造同名热点（Evil Twin）/ 控制路由器
  - **ARP 欺骗**：局域网内冒充网关
  - **DNS 投毒**：把 `bank.com` 指向攻击者 IP

</v-click>

<v-click>

> 浏览器弹"证书无效"很可能正撞上 MITM 或钓鱼，**别点「继续前往」**。

</v-click>

<!--
要当中间人，攻击者得先进到链路里。"中间人"一词带方位歧义，攻击者不必真在地理中间，所以现代文档更爱用"在途攻击者"。明文链路 + 被无视的告警是攻击成功的两大前提。
-->

---

# HTTPS 如何抵御 MITM

加密 + 证书验证，两层叠加缺一不可

<v-click>

- **加密**：流量全程密文，截到也读不懂，悄悄篡改会被完整性校验暴露
- **证书验证**：握手时校验域名匹配、签名有效、未过期、未吊销，**确认对端确是目标服务端** —— 专门挡"冒名"

</v-click>

<v-click>

攻击者于是只剩两个突破口，全都绕开"正常的 HTTPS"：

1. **伪造证书但无可信签名** → 浏览器直接报错（除非用户点掉告警，或被骗装了攻击者根证书）
2. **降级到明文** → 既然 HTTPS 难破，那就不让你用 HTTPS → SSL 剥离

</v-click>

<!--
两层防御正好对应安全三目标里的机密性 + 身份认证。攻击者打不动加密和证书，就转而攻击"还没用上 HTTPS"的窗口，引出下一页的 SSL 剥离。
-->

---

# SSL 剥离：把 HTTPS 偷偷降级

不硬碰加密，专攻最脆弱的"首跳"

<v-click>

```text
用户 ──HTTP（明文，可读改）──▶ 攻击者 ──HTTPS──▶ 服务端
     ◀─HTTP（攻击者剥掉 https）─        ◀──HTTPS──
```

</v-click>

<v-click>

- 用户敲 `example.com` 或点 `http://` 旧链接时，**第一下往往是明文 HTTP**，本应被 301 跳 HTTPS
- 攻击者卡在这一跳：对用户维持 HTTP、改写所有 `https://` 链接，对服务端走正常 HTTPS
- 结果：用户密码、Cookie、表单全走明文，地址栏没锁标但很多人不注意

</v-click>

<v-click>

> **根因**：只要还有一次请求走 HTTP，就有被剥离的可能 —— HSTS 正是为消灭这个窗口而生。

</v-click>

<!--
SSL 剥离是最现实的 MITM 变体，属于降级攻击。它不去破解加密，而是不让你用上加密。首次明文请求给了攻击者拦截窗口，这是它能成立的唯一原因。
-->

---

# HSTS：强制浏览器只用 HTTPS

服务端声明"本站今后只准 HTTPS"

<v-click>

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

</v-click>

<v-click>

| 指令 | 含义 |
| --- | --- |
| `max-age=<秒>` | 记住"只用 HTTPS"多久，常设 1 年（31536000） |
| `includeSubDomains` | 策略覆盖全部子域 |
| `preload` | 申请进浏览器内置预加载名单 |

</v-click>

<v-click>

> 浏览器记下后，**任何 `http://` 请求在发出前就被本地改写为 `https://`** —— 根本不给攻击者拦明文的机会。

</v-click>

<!--
HSTS 通过一个响应头让浏览器把"只用 HTTPS"记下来。一旦记住，本地就把 http 升级成 https 再发，SSL 剥离的窗口被堵死。max-age 每收到一次头就顺延。
-->

---

# HSTS 三条铁律与首访空窗

部署姿势与先天缺口

<v-click>

- **铁律**：① 头**仅在 HTTPS 响应中被采信**（HTTP 里的被无视）② 期内证书出错**无法被用户点掉** ③ **不能经 HTTP 关闭**（要解除须 HTTPS 上发 `max-age=0`）
- **正确部署**：HTTP 入口只做 301 跳转、**不带** HSTS 头；跳转后的 HTTPS 响应才发

</v-click>

<v-click>

- **首访空窗**：HSTS 靠"先收到过头"生效，**第一次访问**那一跳仍可能明文、照样能被剥离
- **HSTS preload list**：浏览器内置的强制 HTTPS 名单，在册域名**首访即用 HTTPS**；入选须 `max-age ≥ 1 年` + `includeSubDomains` + `preload`，再到 hstspreload.org 提交

</v-click>

<!--
preload 是"重承诺"：进了名单意味着该域名及全部子域被硬编码为只能 HTTPS，移出要等浏览器更新、周期很长。上 preload 前务必确认所有子域（含未来要建的）都已就绪 HTTPS。
-->

---

# 证书钉扎已废弃：HPKP / Expect-CT

更激进的方案，因风险大于收益而退场

<v-click>

- **HPKP（`Public-Key-Pins`）**：让站点声明"只认这几把公钥" —— **已废弃并从浏览器移除**
  - **HPKP 自锁**：配错（钉错 / 忘备份钉）会把用户长期锁在门外
  - **勒索钉扎**：攻击者拿一次写头机会就钉死恶意公钥
- **Expect-CT**：曾过渡式强制 CT —— 也**已废弃**（CT 已由浏览器默认强制，无需再发头）

</v-click>

<v-click>

> **今天该怎么做**：普通站点不要碰证书钉扎；现代组合 = **全站 HTTPS + HSTS（条件具备再上 preload）** + 浏览器默认的证书校验与 CT。

</v-click>

<!--
HPKP 理论上能挡"合法 CA 被滥用"式 MITM，但实践中自锁和勒索风险太大，MDN 页面已下线。极少数对供应链安全要求极高的移动 App 才在应用层自做钉扎，且需完善的轮换回退。
-->

---
layout: section
---

# 证书实务

把密码学与信任链落到真刀真枪部署

---

# 证书类型（一）：验证等级 DV/OV/EV

差异不在加密强度，而在 CA 签发前验证了什么

<v-click>

| 等级 | 验证内容 | 签发速度 | 典型场景 |
| --- | --- | --- | --- |
| **DV** | 仅验证"你控制域名" | 秒级~分钟 | 个人站、博客、绝大多数网站 |
| **OV** | 额外核验企业工商信息 | 1~3 天 | 企业官网 |
| **EV** | 最严格的法律实体审核 | 数天~数周 | 银行、大型电商（历史上） |

</v-click>

<v-click>

> **EV 绿条已成历史**：Chrome 77 / Firefox 70 起移除 EV 特殊 UI，统一显示一把锁。技术上 **DV（Let's Encrypt 免费）已完全够用**。

</v-click>

<!--
加密强度都一样，区别只是审核了什么。研究表明用户几乎不会注意绿条，钓鱼网站也能轻易申请 DV 伪装，所以浏览器移除了 EV 加成。EV 的价值如今只剩非技术层面的企业背书。
-->

---

# 证书类型（二）：覆盖范围

单域名 / 通配符 / SAN 多域名

<v-click>

- **单域名证书**：只护一个完全限定域名（`www.example.com`）
- **通配符证书** `*.example.com`：护住该域**同一层级**全部子域
- **SAN 多域名证书**：一张证书列多个**彼此不同**的域名（`example.com` + `example.org` + `blog.foo.net`）

</v-click>

<v-click>

> **通配符边界（极易踩坑）**：`*.example.com` **能**护 `api.example.com`；**不能**护裸域 `example.com`、也**不能**跨层护 `a.b.example.com`（只吃一层）。

</v-click>

<v-click>

> **CN 已死，全看 SAN**：现代浏览器完全忽略 CN，哪怕只护一个域名也必须写进 SAN，否则报 `ERR_CERT_COMMON_NAME_INVALID`。

</v-click>

<!--
裸域要单独加进 SAN，或申请 example.com + *.example.com 两个名。通配符只吃一层是最常见的踩坑点。SAN 多域名证书又叫 Multi-Domain / UCC。
-->

---

# Let's Encrypt 与 ACME

免费 DV + 全自动，HTTPS 普及率超 90% 的最大推手

<v-click>

- **90 天有效期**：远短于传统商业证书的 1 年 —— 逼你自动化，私钥泄露最多 90 天就失效
  - 注：2025-02 起推进 **6 天短期证书**，目标让续期完全无感
- **ACME 协议**（RFC 8555）：让客户端与 CA 程序化完成"证明域名控制 → 签发 → 续期"

</v-click>

<v-click>

| ACME 校验 | 怎么证明控制权 | 能否签通配符 |
| --- | --- | --- |
| **HTTP-01** | 放文件到 `/.well-known/acme-challenge/` | ❌ 不能 |
| **DNS-01** | 写 `_acme-challenge` TXT 记录 | ✅ **可以** |
| **TLS-ALPN-01** | 443 端口 TLS 层应答 | ❌ 不能 |

</v-click>

<!--
Let's Encrypt 是非营利 CA，把 HTTPS 从"要花钱、要手动"变成"免费、全自动"。短有效期的逻辑是逼自动化，把私钥泄露的风险窗口压到最小。通配符证书必须用 DNS-01。
-->

---

# certbot：签发与自动续期

EFF 维护的官方推荐 ACME 客户端

<v-click>

```bash
# 一键：签发 + 自动改写 Nginx 配置 + 配好跳转
sudo certbot --nginx -d example.com -d www.example.com

# 通配符（需 DNS 插件，以 Cloudflare 为例）
sudo certbot certonly --dns-cloudflare \
  -d "*.example.com" -d example.com

# 手动测试续期（不会真改证书）
sudo certbot renew --dry-run
```

</v-click>

<v-click>

> **自动续期是默认行为**：装好 certbot 会自动注册 systemd timer / cron **每天检查两次**，仅在剩余有效期 < 30 天时才真正续期并热加载 —— 通常无需额外配置。

</v-click>

<!--
certbot --nginx 一条命令搞定签发、改配置、配跳转。通配符自动续期需要 ACME 客户端有操作 DNS 的 API 权限。生产环境务必定期 dry-run 验证链路通畅。
-->

---

# 混合内容（Mixed Content）

HTTPS 页面里引用 `http://` 资源 = 开了明文窗口

<v-click>

| 类别 | 包含资源 | 浏览器行为（2026） |
| --- | --- | --- |
| **被动 / 可升级** | `<img>`、`<audio>`、`<video>`、CSS 背景图 | **自动升级**到 HTTPS |
| **主动 / 可拦截** | `<script>`、样式表、`<iframe>`、`fetch`、字体 | **直接拦截**，不加载 |

</v-click>

<v-click>

```html
<!-- ❌ 主动混合内容：脚本被拦截，页面可能白屏 -->
<script src="http://cdn.example.com/app.js"></script>
<!-- ✅ 正解：始终用 https -->
<script src="https://cdn.example.com/app.js"></script>
```

</v-click>

<v-click>

> 历史页面可用响应头 `Content-Security-Policy: upgrade-insecure-requests` 把所有 `http://` 子资源统一升级；纯 IP 主机会被**拦截而非升级**。

</v-click>

<!--
MDN 已把 passive/active 改称 upgradable/blockable。主动类被拦截会导致页面直接报错白屏，这是落地 HTTPS 最容易翻车的地方。upgrade-insecure-requests 是兜底历史页面的利器。
-->

---

# HTTPS 性能：让安全几乎不收费

"HTTPS 慢"早已是过时印象

<v-click>

- **会话复用（Session Ticket）**：完整握手要 1~2 RTT，复用机制让后续连接"凭票续接"、跳过完整握手（TLS 1.3 内建）
- **OCSP Stapling**：服务器预取带时间戳的吊销状态钉给客户端，省掉客户端自己查 CA 的往返（Nginx `ssl_stapling on;`）
- **HTTP/2 over TLS**：浏览器**只在 HTTPS 上启用** HTTP/2 —— 安全与性能在此正相关

</v-click>

<v-click>

> **别手写 TLS 配置**：用 [Mozilla SSL Config Generator](https://ssl-config.mozilla.org/) 选 modern / intermediate / old 档位，直接产出安全配置。

</v-click>

<!--
三件套把 TLS 开销压到可忽略。"上了 HTTPS 才能享受 HTTP/2 多路复用"是个有意思的反直觉点。TLS 套件、版本、Stapling 极易配错，交给生成器最稳。
-->

---

# 前端本地开发 HTTPS：mkcert

测 Service Worker / Secure Cookie / getUserMedia 都需要本地 HTTPS

<v-click>

```bash
mkcert -install                  # 把本地 CA 装进系统信任库（一次性）
mkcert localhost 127.0.0.1 ::1   # 生成 localhost 证书 + 私钥
# 把 .pem 喂给 Vite：server.https = { key, cert }
```

</v-click>

<v-click>

- 直接自签名会触发浏览器红色警告；mkcert 生成**被本机信任**的本地证书，免警告

</v-click>

<v-click>

> **仅限本地**：mkcert 根证书只装在你自己机器上，外网 / 他人设备不信任，**绝不能用于生产** —— 生产一律走 Let's Encrypt 等公共 CA。

</v-click>

<!--
本地开发要测安全上下文专属 API 就需要本地 HTTPS。自签名证书会红屏，mkcert 通过把本地 CA 装进系统信任库解决。但根证书只在自己机器上，绝不能上生产。
-->

---
layout: center
class: text-center
---

# 小结

HTTPS 凭三件事做到「看不懂、改不了、认得清」

<v-click>

- **加密原语**：对称（快、AES/ChaCha20）+ 非对称（慢、RSA/ECC）+ 哈希签名，TLS 用**混合加密**
- **证书与信任链**：X.509 绑定公钥↔身份，逐级验签到受信根，SAN 匹配 + 吊销 + CT 兜底
- **TLS 握手**：1.2 约 2-RTT，**1.3 压到 1-RTT、强制 (EC)DHE 前向保密**、ServerHello 后全加密
- **攻防与实务**：MITM / SSL 剥离 ↔ HSTS（HPKP 已废）；DV 够用、Let's Encrypt 90 天自动续、防混合内容

</v-click>

<v-click>

> 理解"加密 + 证书 + 握手"，再把它正确部署上线 —— HTTPS 的全貌就完整了。

</v-click>

<!--
四块收束成一句话：加密原语 + 证书信任链 + TLS 握手三者咬合，再用 HSTS、Let's Encrypt、防混合内容把它落到地，就既懂"为什么安全"又会"怎么部署"。
-->

---
layout: center
class: text-center
---

# 谢谢

HTTPS 与传输安全 · 看不懂、改不了、认得清

<div class="mt-8 text-gray-400">
基于 TLS 1.3 / RFC 8446 · 面向前端工程师
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
全章从"明文 HTTP 的代价"出发，经加密原语、数字证书、TLS 握手、MITM 与 HSTS，落到证书工程实践。感谢观看。
-->
