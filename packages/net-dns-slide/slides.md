---
theme: seriph
background: https://cover.sli.dev
title: DNS 域名系统
info: |
  DNS 域名系统 —— 域名层级、解析流程、记录类型、缓存 TTL、前端优化与加密安全
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:network-3 class="text-8xl" />
</div>

<br/>

## DNS 域名系统

互联网的「电话簿」：把人记的域名翻译成机器用的 IP，一次解析背后的层级、流程与缓存

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
DNS 是前端每天都在用、却最容易被当成黑盒的一环。这一章不背 RFC，而是顺着「输入域名→拿到 IP」这条线，讲清层级、解析、记录、缓存、前端优化和加密安全六块。
-->

---
transition: fade-out
---

# 这一章讲什么

一条主线：**从输入域名到拿到 IP，再到把它做快、做安全**

<v-click>

- **作用与层级**：DNS 是什么、域名倒树、四类服务器、注册体系
- **解析流程**：完整 8 步、递归 vs 迭代、报文结构、UDP/TCP
- **记录类型**：A/AAAA、CNAME 限制、MX/TXT、NS/SOA、PTR/CAA/SRV
- **缓存与 TTL**：四级缓存、TTL 权衡、换 IP 策略、负缓存
- **前端优化**：dns-prefetch、preconnect、crossorigin 坑、域名收敛
- **加密与安全**：DoH/DoT、DNSSEC 验真非加密、隐私边界

</v-click>

<v-click>

> 看懂一次完整解析，DNS 的全貌就在手里了。

</v-click>

<!--
六块顺着一次解析的生命周期排：先搞清角色与层级，再看怎么查，查到的记录长什么样，怎么缓存加速，前端怎么提前热身，最后怎么加密验真。
-->

---
layout: section
---

# 作用与域名层级

DNS 是什么、域名怎么分层、谁来负责

---

# DNS 是什么、为什么需要

互联网的「电话簿」：把域名翻译成 IP

<v-click>

- **DNS（Domain Name System）**：把人类可读的**域名**（`example.com`）翻译成机器用的 **IP**（`192.0.2.1`）
- **本质**：一个**分层、去中心化**的分布式命名数据库，表拆散分布在全球海量服务器
- **为什么需要**：人记名字、机器认地址；DNS 在两者间做映射
- **解耦名字与地址**：换服务器只改 DNS 映射，域名不变

</v-click>

<v-click>

> IP 像门牌号，域名像店名 —— DNS 就是把店名换成门牌号的那本地图。

</v-click>

<!--
核心价值是「解耦」：名字与地址各自独立演化。一个 IP 能承载多个域名，一个域名也能随时换 IP，全靠这层间接性。
-->

---

# 域名是一棵倒置的树

从右往左，层级递减

<v-click>

```text
www  .  example  .  com  .
 │        │         │     └─ 根域 (root)：空标签，常省略
 │        │         └─────── 顶级域 TLD
 │        └───────────────── 二级域：向注册商买的部分
 └────────────────────────── 子域 / 主机名
```

</v-click>

<v-click>

- **最右是层级最高的根**，越往左越具体 —— 与「从左读字符串」的直觉相反
- 解析顺序也从右往左：先定位根 `.`，再 `com`，再 `example`，最后 `www`
- 这正是 DNS 沿树**自顶向下**查找的顺序

</v-click>

<!--
记住「从右往左层级递减」这一点，下一节的解析流程就顺理成章 —— 查询就是沿这棵树从根往叶子下探。
-->

---

# TLD 两类 · FQDN

顶级域分通用与国家，完整域名带末尾点

<v-click>

- **gTLD（通用顶级域）**：不绑国家，如 `com`、`org`、`net`、`dev`、`io`
- **ccTLD（国家/地区顶级域）**：两字母代码，如 `cn`、`jp`、`uk`、`de`
- **二级域**：你向注册商购买、能自主支配的那段（`example.com` 的 `example`）
- **子域**：二级域下自由细分，如 `mail.`、`api.v2.`，无需再申请

</v-click>

<v-click>

- **FQDN（完全限定域名）**：从主机一路写到根、**带末尾点** `www.example.com.`
- 带点 → 绝对、无歧义；不带点 → 可能被解析器拼接本地「搜索域」补全

</v-click>

<!--
gTLD/ccTLD 是 TLD 的两大类。FQDN 的关键是那个常被忽略的末尾点 —— 它告诉系统「别再用搜索域补全了，这就是完整的」。
-->

---

# 四类域名服务器

一次无缓存解析，四类角色接力

<v-click>

| 服务器类型 | 职责 | 位置 |
| --- | --- | --- |
| 递归解析器 recursor | 替客户端跑完全程、缓存结果 | 链首 |
| 根域名服务器 root | 指向负责该 TLD 的服务器 | 第 1 跳 |
| TLD 服务器 | 指向该域的权威服务器 | 第 2 跳 |
| 权威域名服务器 | 持有真实记录、给出最终答案 | 链尾 |

</v-click>

<v-click>

> 递归解析器在链首（替你跑腿），权威服务器在链尾（给你答案）；根和 TLD 在中间逐级指路。

</v-click>

<!--
Cloudflare 用「图书馆找书」比喻：递归解析器是帮你找书的管理员，根是总索引，TLD 是具体书架，权威服务器是书架上那本字典。
-->

---

# 根服务器的「13」

不是 13 台机器，是 13 个 IP

<v-click>

- **13 个 IP 地址**（标号 A~M），是早期协议设计遗留的上限 —— **不是 13 台机器**
- 每个 IP 背后是一组服务器，靠 **Anycast（任播）** 就近分发，全球 **600+** 实例
- **谁运营**：ICANN 运营 1 个，其余 12 个委托 Verisign、NASA、马里兰大学等（Verisign 独管 2 个）

</v-click>

<v-click>

- **解析器自带根列表**：根在层级顶端无法被「指向」，每个递归解析器**内置 13 个根 IP**，查询从这里起步
- 某根 IP 临时不可用，自动改用其余 12 个重试

</v-click>

<!--
「全球只有 13 台根服务器」是经典误解。准确说是 13 个逻辑 IP，Anycast 复制成 600+ 物理实例，所以根服务器不会成为瓶颈，且就近响应。
-->

---

# 注册体系：Registry 与 Registrar

域名能全球一致解析的委派根基

<v-click>

- **注册局（Registry）**：管某个 **TLD 的权威数据库**，如 Verisign 管 `.com`/`.net`、CNNIC 管 `.cn`
- **注册商（Registrar）**：**面向用户**卖域名，如阿里云、GoDaddy，把登记**写回注册局**

</v-click>

<v-click>

```text
根 ──委派──► 注册局(Verisign 管 .com)
              │
你 ──注册商(阿里云)──► 在 Verisign 名下登记 yoursite.com
                        └─ 指定权威服务器 → 全球查询都被指引到它
```

</v-click>

<v-click>

> 「根 → TLD → 权威」的委派链，是 DNS 既去中心化又能全球一致的根本。

</v-click>

<!--
注册局管 TLD 权威数据，注册商面向用户售卖并写回注册局。你买下域名后指定权威服务器，全世界的查询最终都会被指引到那台机器上拿记录。
-->

---
layout: section
---

# 解析流程

一次查询如何在多级服务器间接力

---

# 完整解析：未命中缓存的 8 步

DNS 解析发生在 TCP/TLS 之前

<v-click>

```text
浏览器缓存 ─► OS 缓存(stub) ─► 递归解析器 ─┬─► 根(.)   ：去问 .com
   ②未命中      ③未命中        (代为追问) │     ⑤引荐
                                         ├─► TLD(.com)：去问权威
   ⑧IP ◄──────── 逐级回传 ◄──────────────┤     ⑦引荐
                                         └─► 权威：返回 A 记录(IP)
```

</v-click>

<v-click>

- 任一层**缓存命中即提前短路**，跳过后续步骤
- 拿到 IP 后才轮到 HTTP：浏览器向该 IP 发请求 → 服务器返回页面

</v-click>

<!--
这张图是全章骨架。8 步全跑是「缓存全空」的最坏情况；真实世界绝大多数请求在某层缓存就命中了。DNS 在 TCP 连接、TLS 握手之前，是最靠前的一环。
-->

---

# 8 步逐条拆解

对应上图编号

<v-click>

1. 用户输入 `example.com`，请求交给 **递归解析器**
2. 解析器向 **根服务器（`.`）** 发问
3. 根回复负责 `.com` 的 **TLD 服务器**地址
4. 解析器转向 **`.com` TLD 服务器**发问
5. TLD 回复该域名的**权威服务器**地址
6. 解析器向 **`example.com` 权威服务器**发问
7. 权威返回 `example.com` 的 IP（A 记录）
8. 解析器把最终 IP 回复给浏览器

</v-click>

<!--
逐条对应图里的编号。注意根和 TLD 都只「指路」（引荐），不给最终 IP；只有链尾的权威服务器才给出真正的 A 记录。
-->

---

# 两道本地缓存

请求离开机器前先过两关

<v-click>

- **浏览器缓存（第一道）**：发起解析时**第一个被检查**，命中则整个外部查询全省
  - Chrome 可在 `chrome://net-internals/#dns` 查看
- **OS 缓存 / stub resolver（第二道）**：浏览器未命中后交给操作系统的解析模块
  - 先查自身缓存，仍未命中才**带「递归标志 RD」把查询发出本地网络**

</v-click>

<v-click>

> stub resolver 的潜台词：「我不想自己一级级追问，你帮我把最终答案查回来。」 —— 这正是「客户端发递归查询」的起点。

</v-click>

<!--
原则是「离浏览器越近、命中越早、省的步骤越多」。stub resolver 是查询离开本机前的最后一道本地缓存，它带着 RD 标志把活儿外包给递归解析器。
-->

---

# 递归 vs 迭代：关键看立场

一次解析同时包含两种查询

<v-click>

| 维度 | 递归查询 | 迭代查询 |
| --- | --- | --- |
| 发生段 | 客户端 → 递归解析器 | 递归解析器 → 根/TLD/权威 |
| 被问方义务 | **必须**给最终答案或报错 | 只需给「下一步问谁」的引荐 |
| 典型回应 | 直接返回 IP（或 NXDOMAIN） | 返回 referral：去问下一级 |
| 谁跑腿 | 解析器替客户端跑完全程 | 解析器自己拿引荐逐级追问 |

</v-click>

<v-click>

> 递归解析器对客户端「是递归的」，对各级服务器「是迭代的」。

</v-click>

<!--
差别不在「谁发的请求」，而在「被问方有没有义务给最终答案」。客户端要求递归解析器负责到底；递归解析器对根/TLD 只问「下一步去哪」。
-->

---

# 时序图 · 非递归查询

把递归与迭代画在一起

<v-click>

```text
客户端 ──递归(要最终答案)──► 递归解析器 ──迭代──► 根 ：去问 .com
                                      ──迭代──► TLD：去问权威
                                      ──迭代──► 权威：IP=93.184.x.x
客户端 ◄──────递归响应(最终 IP)─────────┘
```

</v-click>

<v-click>

- **第三种：非递归查询（Non-recursive）** —— 被查方**自己就是权威**或**缓存已命中**时，无需向上追问，直接返回
- 命中缓存的解析大多落在这一类，这也是缓存能加速的原因

</v-click>

<v-click>

> 别把「递归查询」（请求类型）和「递归解析器」（处理它的机器）当成一回事。

</v-click>

<!--
非递归是第三种：答案就在手边（自己是权威或缓存命中）就不必再追问。递归查询是动作，递归解析器是角色，名字像但概念不同层。
-->

---

# DNS 报文：五个段

查询与响应复用同一格式（RFC 1035）

<v-click>

| 段 | 内容 |
| --- | --- |
| Header 头部 | 事务 ID、QR、标志（AA/TC/RD/RA）、各段计数 |
| Question 问题 | 查什么：域名 + 类型(QTYPE) + 类(QCLASS=IN) |
| Answer 回答 | 直接回答的资源记录（如 A 记录的 IP） |
| Authority 授权 | 指向权威服务器的 NS 记录（迭代的「引荐」装这） |
| Additional 附加 | 常含**胶水记录**：把权威服务器 IP 一并捎上 |

</v-click>

<v-click>

> 标志位 **RD**（期望递归）由客户端置位，**RA**（递归可用）由服务器置位，**TC**（截断）触发 UDP→TCP 重试。

</v-click>

<!--
查询通常只填 Header + Question，响应由服务器补齐后三段。胶水记录很实用：附带权威服务器的 IP，省去再解析一次。RD/RA/TC 这三个标志位是递归意图与传输切换的开关。
-->

---

# 传输层：默认 UDP 53

何时改走 TCP 53

<v-click>

- **默认 UDP 53**：一个请求包、一个响应包，无需握手，**开销小、延迟低** —— 绝大多数查询走这条路

</v-click>

<v-click>

| 切到 TCP 53 的场景 | 为什么必须 TCP |
| --- | --- |
| **响应过大** | UDP 传统上限 512 字节，超限置 TC=1，客户端改用 TCP 重发（DNSSEC、多记录常见） |
| **区域传送 AXFR/IXFR** | 主从同步整个区域，数据量大且要可靠有序 |

</v-click>

<v-click>

> 一句话：**查询走 UDP 图快，搬数据走 TCP 图稳**；UDP 装不下时靠 TC 位回退 TCP 兜底。

</v-click>

<!--
日常解析是小数据、要低延迟，UDP 最优。区域传送是大数据、要零丢失，必须 TCP。现代用 EDNS(0) 协商更大的 UDP 包，但仍超限照样回退 TCP。
-->

---

# 解析延迟：首次访问的隐形成本

排在 TCP/TLS 之前，全叠加在首屏

<v-click>

- 一次未命中缓存的解析 = 本地缓存查询 + 递归解析器多级迭代往返
- 高延迟网络下可能耗费**数十至上百毫秒**，全部叠加在首屏时间里
- **首次访问**（缓存全空）尤为明显：页面引用的第三方域越多，累积延迟越大

</v-click>

<v-click>

> 这正是前端要做 DNS 优化的动机 —— 用 `dns-prefetch`、`preconnect` 把这段延迟从关键路径挪走（后面专讲）。

</v-click>

<!--
DNS 解析处在首屏链路最前端，却不在 JS 代码里、性能面板上也易被忽略。页面引脚本/字体/图片的域越多，首次访问要解析的域名越多。
-->

---
layout: section
---

# 常见记录类型

权威服务器手里存的是什么

---

# 一条 DNS 记录是什么

区域文件里的一行指令

<v-click>

- **DNS 记录（Resource Record, RR）**：住在权威服务器**区域文件**里的一行纯文本指令
- 回答解析器的提问：「`example.com` 的 IP 是多少？」「邮件投到哪？」

</v-click>

<v-click>

| 字段 | 含义 |
| --- | --- |
| Name | 记录所属的名字（`@` 常表示根域本身） |
| TTL | 可被缓存的秒数（下一节专讲） |
| Class | 协议类别，互联网恒为 `IN` |
| Type | 类型 A/AAAA/CNAME/MX…，决定 RDATA 怎么解释 |
| RDATA | 真正的「答案」：IP、目标域名、文本串 |

</v-click>

<!--
五元组 Name/TTL/Class/Type/RDATA 是所有记录的统一抽象。解析器带着想要的 Type 去问，权威服务器只把对应类型那几行返回。
-->

---

# 寻址类：A 与 AAAA

域名 → IP，区别只在版本

<v-click>

- **A 记录**：域名 → **IPv4**（32 位，点分十进制），最基础的记录
- **AAAA 记录**：域名 → **IPv6**（128 位）；「四个 A」对应「比 A 长四倍」的地址
- 一个域名可**同时**有 A 和 AAAA：支持 IPv6 的客户端优先走 AAAA，否则回落 A

</v-click>

<v-click>

```text
; Name          TTL    Class  Type   RDATA
example.com.    3600   IN     A      93.184.216.34
example.com.    3600   IN     AAAA   2606:2800:220:1:248:1893:25c8:1946
```

</v-click>

<!--
A 和 AAAA 是被查得最多的两类，作用都是「域名→IP」。双栈站点同时配两条，客户端按自身能力择优。
-->

---

# 别名记录：CNAME

把一个域名指向另一个域名

<v-click>

- **CNAME（Canonical Name，规范名）**：把别名指向**另一个域名**，自身不含 IP
- 查 `blog.example.com` 命中 CNAME 后，**再触发一次对目标域名的查询**，最终由目标的 A/AAAA 给 IP
- 常见用法：`blog.`/`shop.`/`www.` 都 CNAME 到根域 → 换 IP 只改根域一条 A，别名自动跟随

</v-click>

<v-click>

```text
; blog 是 example.com 的别名，最终解析到 example.com 的 A 记录
blog.example.com.   3600   IN     CNAME  example.com.
```

</v-click>

<!--
CNAME 扮演「线索」角色，自己不给 IP，把查询接力到目标域名。把多个子域指向根域，是它最经典的用法 —— 维护点收敛到一条 A 记录。
-->

---

# CNAME 的硬限制（必考）

四条铁律，面试高频

<v-click>

1. **只能指向域名，绝不能指向 IP** —— 要绑 IP 用 A/AAAA
2. **同名下不得共存任何其他记录**：有了 CNAME 就不能再有 A、MX、TXT、SOA…
3. **根域（apex）不能用 CNAME**：根域天然带 SOA + NS，与第 2 条冲突
4. **MX、NS 不能指向 CNAME**：它们的值必须是带 A/AAAA 的主机名

</v-click>

<v-click>

> 派生坑：对一个 CNAME 名字查「其他类型」（如 TXT），权威会**返回那条 CNAME**，解析器需再去目标重查。**CNAME 链能少则少**，每跳多一次查询。

</v-click>

<!--
比喻：笔名「Mark」只指向真名「Sam」，身份证护照这些正式文件都得登记在 Sam 名下。根域禁用 CNAME 的根因就是第 2 条 —— 它和 SOA/NS 没法共存。
-->

---

# 邮件与文本：MX 与 TXT

收信路由与安全策略的载体

<v-click>

- **MX（Mail eXchange）**：指明**收信服务器** + **优先级**（**数字越小越优先**），可配多条做主备；值必须带 A/AAAA，**不可指向 CNAME**
- **TXT**：任意文本，现实中是邮件与域名安全的事实载体
  - **SPF**（允许的发信 IP）/ **DKIM**（发信签名公钥）/ **DMARC**（策略汇总）/ **域名归属验证**

</v-click>

<v-click>

```text
example.com.   3600   IN   MX    10 mail1.example.com.
example.com.   3600   IN   MX    20 mail2.example.com.
example.com.   3600   IN   TXT   "v=spf1 ip4:203.0.113.0/24 -all"
```

</v-click>

<!--
MX 的优先级是「数字越小越优先」，别记反。TXT 本是备注栏，如今扛起 SPF/DKIM/DMARC 三件套和各平台的域名归属验证。
-->

---

# 区域骨架：NS 与 SOA

「区域本身」的两类记录

<v-click>

- **NS（Name Server）**：声明**谁是本域权威服务器**，是「逐级委派」的落地 —— 父区域用 NS 把子域指给下一级；值必须指向 A/AAAA
- **SOA（Start of Authority）**：每个区域**有且仅一条**，存区域元信息

</v-click>

<v-click>

| SOA 字段 | 作用 |
| --- | --- |
| MNAME / RNAME | 主权威服务器 / 管理员邮箱 |
| Serial | 区域版本号，改记录须递增，从服务器据此判断是否同步 |
| Refresh/Retry/Expire | 从服务器多久同步、失败重试、多久判定过期 |
| Minimum | 否定应答（NXDOMAIN）的缓存时长 |

</v-click>

<!--
迭代查询正是顺着 NS 一路下探。SOA 是区域的「身份证」，每区域唯一；它的 Minimum 字段后面讲负缓存时还会出现 —— 它兼作 NXDOMAIN 的缓存时长。
-->

---

# 反向、安全、服务定位

PTR / CAA / SRV

<v-click>

- **PTR（Pointer）**：**反向解析**，IP → 域名，部署在 `in-addr.arpa`(v4) / `ip6.arpa`(v6)；邮件服务器用它校验发信方
- **CAA**：限定**哪些 CA 可为本域签证书**，**无 CAA = 任何 CA 都可签**，规则**被子域继承**
- **SRV（Service）**：服务定位，给出**优先级/权重/端口/主机**，名字形如 `_sip._tcp.example.com`

</v-click>

<v-click>

```text
1.2.0.192.in-addr.arpa.   3600  IN  PTR  example.com.
example.com.              3600  IN  CAA  0 issue "letsencrypt.org"
_sip._tcp.example.com.    3600  IN  SRV  10 60 5060 sipserver.example.com.
```

</v-click>

<!--
PTR 方向与 A 相反，反垃圾邮件常用。CAA 把「谁能给我发证」变成 DNS 里可校验的白名单。SRV 被 SIP、XMPP、AD 等大量使用。
-->

---

# 根域的「类 CNAME」：ALIAS / ANAME

绕开「根域不能用 CNAME」的限制

<v-click>

- **痛点**：常需把根域 `example.com` 指向第三方托管（CDN、PaaS），但根域禁用 CNAME
- **ALIAS / ANAME**：厂商私有记录（命名因厂商而异）
  - 对外表现为根域的 A/AAAA
  - 由 DNS 服务在后台实时解析目标域名，把 IP「**扁平化**」返回

</v-click>

<v-click>

> 选型一句话：**子域跟随别的域名 → CNAME；根域跟随别的域名 → ALIAS/ANAME；直接绑固定 IP → A/AAAA。**

</v-click>

<!--
CNAME flattening（扁平化）是底层原理：响应时把 CNAME 当 A/AAAA 直接返回最终 IP，既满足「根域只能有 A/AAAA」的规范，又获得 CNAME 般的「跟随目标」便利。
-->

---

# 记录类型速览

一张表收束

<v-click>

| 类型 | 作用 | 关键点 |
| --- | --- | --- |
| A / AAAA | 域名 → IPv4 / IPv6 | 双栈可同时配 |
| CNAME | 别名 → 另一域名 | 不指 IP、根域禁用、独占 |
| MX / TXT | 收信路由 / 文本 | 优先级数字越小越优先 |
| NS / SOA | 委派 / 区域元信息 | SOA 每区唯一 |
| PTR / CAA / SRV | 反向 / 证书白名单 / 服务定位 | CAA 被子域继承 |

</v-click>

<v-click>

> 一个域名要能正常访问，至少得有 **A/AAAA + NS + SOA**，其余按需添加。

</v-click>

<!--
这张表是记录类型的速查。落到实践：寻址靠 A/AAAA，别名靠 CNAME（牢记限制），邮件靠 MX+TXT，骨架靠 NS+SOA，外围靠 PTR/CAA/SRV。
-->

---
layout: section
---

# 缓存与 TTL

把解析结果就近存起来，加速查询

---

# 为什么需要 DNS 缓存

缓存命中 = 跳步

<v-click>

- 一次无缓存解析要走 **8 步**，每跳都是网络往返，时延可观
- 同一域名被海量用户反复访问 —— 每次重跑 8 步会**压垮** root/TLD/权威
- **缓存**把结果**就近临时保存**，下次直接命中、跳过后面的查询链

</v-click>

<v-click>

> 缓存越靠近浏览器，要走的处理步骤越少；一旦某级命中，后面全部跳过。

</v-click>

<!--
缓存是 DNS 抗压的核心。绝大多数查询根本到不了权威服务器 —— 它们在更靠前的某级缓存就命中了。这也是上一节「8 步会提前短路」的原因。
-->

---

# 四级缓存

由近及远，越靠前越快

<v-click>

| 层级 | 位置 | 谁在用 |
| --- | --- | --- |
| ① 浏览器 DNS 缓存 | 浏览器进程内 | 单个浏览器 |
| ② OS stub resolver | 本机 OS | 所有本机程序共享 |
| ③ 路由器 / 网关 | 家用/办公路由器 | 同一局域网设备 |
| ④ 递归解析器缓存 | ISP 或公共 DNS(1.1.1.1) | 该解析器全部客户端 |

</v-click>

<v-click>

- **递归解析器能「部分命中、智能跳步」**：有 NS 就直接问权威跳过 root+TLD；没 NS 才问 TLD
- 递归解析器面对**海量客户端共享**：一个域名被「焐热」后，后续所有用户都命中

</v-click>

<!--
四级缓存任一级命中即返回。递归解析器最关键：它缓存了 NS 记录就能跳过 root 和 TLD，且被大量用户共享，是 DNS 抗压的主力。
-->

---

# TTL：记录能缓存多久

权威下发的「可缓存秒数」

<v-click>

- **TTL（Time To Live）**：DNS 记录携带的**无符号 32 位整数**，单位**秒**，指「这条记录可被缓存多久」
- **谁设**：由**权威 DNS 服务器**下发（域名所有者在服务商后台配置）
- **怎么递减**：进入某级缓存后剩余 TTL **倒计时**，归零即过期，须重新查询
- **谁遵守**：链路上各级缓存（浏览器/OS/路由器/解析器）都按它决定保留时长

</v-click>

<v-click>

> 同一个词不同战场：IP 网络里 TTL 是数据包「跳数上限」；**缓存语境**里它是「**可缓存秒数**」。本节只谈后者。

</v-click>

<!--
TTL 是缓存的「保质期」。注意它在 IP 包头里指跳数（traceroute 就靠它），在 DNS/HTTP/CDN 缓存里指秒数 —— 同名不同义，别混。
-->

---

# TTL 权衡：长 vs 短

在「少查询」和「快更新」之间取舍

<v-click>

| 维度 | 长 TTL（如 86400=24h） | 短 TTL（如 30~300s） |
| --- | --- | --- |
| 查询量 / 负载 | 低（缓存久、复用多） | 高（频繁过期回源） |
| 命中时解析速度 | 高 | 略低 |
| 记录改动生效 | 慢（等全网旧缓存过期） | 快（很快拉到新值） |
| 适用场景 | 稳定记录（MX、长期 A） | 频繁变动、灰度、CDN 入口 |

</v-click>

<v-click>

> 没有「最优 TTL」，只有「**匹配变更频率**的 TTL」。

</v-click>

<!--
本质是「少查询 vs 快更新」的取舍。稳定记录用长 TTL 省负载，要灰度/切换的记录用短 TTL 换灵活。
-->

---

# 换 IP / 迁移：提前降 TTL

最怕「改了 DNS，一部分用户还在访问旧 IP」

<v-click>

1. **提前降**：迁移**前** 1~2 天，把 TTL 从长值（86400）降到很短（300 甚至 60）
   - 要等**原来的长 TTL 在全网过期**后短 TTL 才铺开 → 所以必须提前
2. **切换**：短 TTL 全网生效后再改记录指向新 IP，旧值最多残留几分钟
3. **复原**：新 IP 稳定后把 TTL 调回长值，恢复低负载

</v-click>

<v-click>

> 传播时间 ≈ **沿途各级缓存中残留 TTL 的最大值**，而非你点「保存」的瞬间。切换前若 TTL 还是 86400，最坏旧 IP 被访问近 24 小时。

</v-click>

<!--
「改 DNS 为什么不立刻生效」的标准答案：传播时间取决于残留 TTL，不是改记录那一刻。迁移三步走的核心就是「提前把 TTL 降下来」。
-->

---

# 负缓存 · hosts 文件

否定结果也缓存，hosts 直接绕过 DNS

<v-click>

- **负缓存（Negative Caching）**：`NXDOMAIN`（域名不存在）等否定响应也被缓存
  - 时长由该域 **SOA 记录的 minimum 字段**控制（RFC 2308）
  - 副作用：刚补上的记录可能因旧 `NXDOMAIN` 仍在负缓存而「暂时解析不到」
- **hosts 文件**：静态映射，**优先级高于 DNS**，命中即用、**完全绕过 DNS 查询**、无 TTL
  - 路径：`/etc/hosts`（Win 在 `C:\Windows\System32\drivers\etc\hosts`）

</v-click>

<v-click>

> hosts 是最易被忽视的「解析为什么不对」根因 —— 排查 DNS 问题先看一眼它。

</v-click>

<!--
负缓存挡住对错误/不存在域名的反复查询，但也会让刚注册的记录暂时查不到。hosts 是静态映射、优先级最高、无 TTL，本地调试常用，也是排错第一站。
-->

---

# 查看与清除缓存

逐级清，越靠前越能自己控制

<v-click>

```bash
# Windows
ipconfig /displaydns        # 查看
ipconfig /flushdns          # 清空系统 DNS 缓存
# macOS（需管理员）
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
# Linux (systemd-resolved)
sudo resolvectl flush-caches
```

</v-click>

<v-click>

- 浏览器层：`chrome://net-internals/#dns` → **Clear host cache**
- 清本机只影响①②；路由器③、递归解析器④得各自等 TTL 或单独刷新

</v-click>

<!--
排错按就近顺序清：浏览器→系统(flushdns)→路由器→递归解析器。若仍命中旧值，多半卡在你管不到的递归解析器缓存上，只能等它的 TTL 走完。
-->

---
layout: section
---

# 前端 DNS 优化

把解析延迟从关键路径上挪走

---

# DNS 是首字节前的隐形延迟

每个新域名首次访问都要解析一遍

<v-click>

```text
访问新 https 域名，连接前要经历：

  DNS 解析  →  TCP 三次握手  →  TLS 握手  →  请求 → 首字节
  (20~120ms)   (1 RTT)        (1~2 RTT)
  └ dns-prefetch 提前这段 ┘
  └──────── preconnect 提前这三段 ────────┘
```

</v-click>

<v-click>

- 隐形且靠前：排在 TCP/TLS 之前，不在业务代码里、性能面板易忽略
- 现代页面常引十几个域名（统计/广告/字体/图床/CDN），**首次**访问各付一次

</v-click>

<!--
浏览器只有在解析到 HTML 资源引用、或 JS 动态发请求那一刻才知道要连谁。资源提示的价值是让你比浏览器更早说「待会儿要用这个域名」，提前并行热身。
-->

---

# `<link rel="dns-prefetch">`

只提前解析 DNS

<v-click>

```html
<head>
  <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
  <link rel="dns-prefetch" href="https://cdn.example.com" />
  <link rel="dns-prefetch" href="https://api.analytics.com" />
</head>
```

</v-click>

<v-click>

- **只做 DNS 这一步**，不碰 TCP/TLS，开销极小，多写几条不心疼
- 适合「**可能、稍后**」用到的跨域域名（埋点、社交分享、备选图床）
- **只对跨域有意义**：同源浏览器早已在解析；老浏览器忽略而无副作用

</v-click>

<!--
dns-prefetch 是「轻量、广撒网」的提示。本质是 hint，老浏览器不识别就忽略这行 link，不报错不破坏页面，可以放心写。
-->

---

# `<link rel="preconnect">`

DNS + TCP + TLS 全提前

<v-click>

```html
<head>
  <link rel="preconnect" href="https://cdn.example.com" />
  <!-- 字体走匿名 CORS 抓取，必须带 crossorigin -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
</head>
```

</v-click>

<v-click>

- 提前建好整条「暖连接」：HTTPS 站到 TLS、HTTP 站到 TCP，实测快 **100~500ms**
- **重、精准、克制**：占用真实连接，只用于「**马上、确定**」要用的关键源
- 数量克制：未用连接约 **10 秒**被回收；一般只对 **2~4 个**最关键源用

</v-click>

<!--
preconnect 比 dns-prefetch 更进一步，把整条连接热身好，省得多但更耗资源。铺太多反而挤占带宽、延迟真正关键的资源，所以必须克制。
-->

---

# dns-prefetch vs preconnect

同一思路的轻重两档

<v-click>

| 维度 | dns-prefetch | preconnect |
| --- | --- | --- |
| 提前完成 | 仅 DNS | DNS + TCP + TLS |
| 节省量级 | ~20~120ms | ~100~500ms |
| 资源开销 | 极小，近乎免费 | 较大，占真实连接 |
| 适用 | 可能、稍后用到 | 马上、确定的关键源 |
| 数量 | 可多（广撒网） | 克制（2~4 个） |
| crossorigin | 否 | 抓 CORS 资源时需要 |

</v-click>

<v-click>

> 口诀：确定马上用且关键 → `preconnect`；只是可能用、或要覆盖很多 → `dns-prefetch`；不确定优先 `dns-prefetch`。

</v-click>

<!--
两者是轻重两档。preconnect 是 Baseline 2020、更广；dns-prefetch 是 Baseline 2025。不确定时优先 dns-prefetch，因为它代价小、副作用低。
-->

---

# 两个高频坑

crossorigin 与「绝不合并」

<v-click>

- **crossorigin 漏了等于白连**：以匿名/CORS 模式抓取的资源（最典型是**字体** `@font-face`）走带 CORS 的独立连接
  - `preconnect` 不加 `crossorigin` → 连错连接，**只省了 DNS，TCP/TLS 全白做**

</v-click>

<v-click>

```html
<!-- 回退：同域名分别写两行，新浏览器吃满 preconnect，老的吃到 dns-prefetch -->
<link rel="preconnect" href="https://cdn.example.com" />
<link rel="dns-prefetch" href="https://cdn.example.com" />
<!-- 反例：会触发 Safari bug 取消 preconnect，切忌合并 -->
<link rel="preconnect dns-prefetch" href="https://cdn.example.com" />
```

</v-click>

<!--
判断要不要 crossorigin：该源上要抓的资源是否以 CORS/匿名请求（字体、fetch/XHR 跨域、带 crossorigin 的脚本图片）。回退写两条 link，但绝不能塞进一个 rel。
-->

---

# 域名收敛 · 资源提示家族

治本与全景

<v-click>

- **域名收敛**：减少页面用到的不同域名数 = 减少解析/握手次数，比逐个加提示更治本
- 能合并到自有 CDN / 同一子域的资源尽量收敛；HTTP/2 后**域名分片是反模式**

</v-click>

<v-click>

| 关键字 | 做什么 | 何时用 |
| --- | --- | --- |
| dns-prefetch | 只解析 DNS | 可能用到的跨域域名 |
| preconnect | DNS+TCP+TLS 建连 | 确定马上用的少数关键源 |
| preload | **真正下载**本页高优资源 | 本页必用但发现得晚 |
| prefetch | 低优**下载**将来资源 | 下一步导航很可能用到 |

</v-click>

<!--
前两者只「热连接」不下载字节，preload/prefetch 才真正下载。域名收敛与资源提示互补：先收敛到少数关键源，再对它们精准 preconnect，少而准。
-->

---
layout: section
---

# DoH / DoT 与 DNS 安全

加密管隐私，DNSSEC 管真实

---

# 传统 DNS 为什么不安全

明文 UDP，像寄明信片

<v-click>

- 查询/响应默认走**明文 UDP 53**，没加密、没来源验证 —— 链路上任何人都能瞥见
- 即便网站用 HTTPS（隐藏页面内容），「**你想访问 bank.com**」这件事仍通过 DNS 泄露

</v-click>

<v-click>

- **窃听与监控**：运营商、公共 Wi-Fi、在途攻击者画出你的浏览画像
- **DNS 劫持**：把查询导向被控服务器，返回假 IP（钓鱼/挂马）
- **缓存投毒**：把伪造记录塞进解析器缓存，缓存期内对某域名持续返回假 IP
- **运营商劫持插广告**：篡改明文响应，注入广告/跳转

</v-click>

<!--
DNS 诞生时根本没考虑安全。两个独立缺陷：没加密（谁都能看能改途中流量）+ 没验真（拿不准答案是否来自真权威）。后面 DoT/DoH 治前者，DNSSEC 治后者。
-->

---

# 攻击点归类

加密与验真各管一块

<v-click>

| 攻击类型 | 攻击点 | 被谁缓解 |
| --- | --- | --- |
| 缓存投毒 / 欺骗 | 递归解析器缓存 | DNSSEC（验真） |
| DNS 劫持 | 篡改权威记录 / 改指向 | DNSSEC + 加固 |
| 在途篡改 / 窃听 | 传输链路 | DoT/DoH（加密） |
| 运营商劫持插广告 | 链路 / 解析层 | DoT/DoH（加密） |
| DNS 隧道 | 借 DNS 夹带数据 | 流量监测 / DNS 防火墙 |

</v-click>

<v-click>

> 明文 DNS 两个独立缺陷：**没加密**（谁都能看改）+ **没验真**（拿不准来源）。DoT/DoH 主治前者，DNSSEC 主治后者，别混。

</v-click>

<!--
按「攻击点」归类能看清谁管哪块：发生在链路上的（窃听/篡改/插广告）靠加密，发生在缓存/权威记录上的（投毒/劫持）靠验真。
-->

---

# DoT vs DoH

都加密，差在「藏得多深」

<v-click>

| 维度 | DoT (over TLS) | DoH (over HTTPS) |
| --- | --- | --- |
| 端口 | **853**（专用） | **443**（与 HTTPS 共用） |
| 承载 | TLS over UDP | HTTP/2 over TLS |
| 可见性 | 网管**能识别**（看不到内容） | 混入普通 HTTPS，**难识别封锁** |
| 网络管控 | 友好（可监控拦截） | 困难（不阻断全部 HTTPS 拦不住） |
| 典型立场 | 企业 / 校园网偏好 | 终端用户隐私偏好 |

</v-click>

<v-click>

> 没有绝对「更好」：安全管控视角 DoT 更受欢迎，隐私视角 DoH 更优 —— 要拦 DoH 几乎得连同所有 HTTPS 一起拦。

</v-click>

<!--
DoT/DoH 都给 DNS 查询「套上信封」，都加密、都防途中篡改。核心差异是端口与显眼程度：DoT 专用 853 易被定位，DoH 藏进 443 大流量里难封锁。
-->

---

# 浏览器对加密 DNS 的支持

应用层可绕过系统解析器

<v-click>

- **Firefox**：自 **2020 年 2 月**起为美区用户**默认启用 DoH**（解析器为 Cloudflare 或 NextDNS），其他地区可手动开
- **Chrome / Edge**：提供「**安全 DNS（Secure DNS）**」开关，默认多为「随系统」，也可手选 DoH 提供商

</v-click>

<v-click>

> 浏览器可**绕过操作系统设定的解析器**自行走 DoH —— 这是它强隐私的来源，也引发过「企业 / 家长管控被旁路」的争议。

</v-click>

<!--
DoH 在浏览器侧落地最广。关键点是应用层能绕过 OS 解析器 —— 隐私更强，但也意味着企业/家长在系统层的管控可能被旁路。
-->

---

# DNSSEC：验真，不是加密

数字签名保证「答案没被掉包」

<v-click>

- **DNSSEC**：给每一级 DNS 数据**数字签名**，解析器验证签名确认记录**确实出自真权威、未被篡改**
- 建立**逐级信任链**：根为 `.COM` 签密钥 → `.COM` 为 `google.com` 权威签密钥，层层背书直到根区
- 根区由人工**根区签名仪式**公开审计地签名，作为信任锚点
- **向后兼容**：未部署的域名仍能正常解析（只是没这层验证）

</v-click>

<v-click>

> **DNSSEC ≠ 加密**：查询内容依旧明文，旁观者照样看得到你查了什么；它只保证答案没被掉包。要「别人看不见」得靠 DoT/DoH。

</v-click>

<!--
最容易写错的点：DNSSEC 不加密任何东西。它管「真实性/完整性」（answer is authentic），DoT/DoH 管「机密性/隐私」（query is private），两者正交。
-->

---

# 加密之后，谁还看得见

隐私的边界

<v-click>

- **挡住链路旁观者**：开 DoT/DoH 后，运营商、公共 Wi-Fi、在途攻击者无法再读改你的查询
- **解析器仍知道你查什么**：所有查询都发给你选的递归解析器，它天然看得到每个域名
  - 隐私从「运营商」**转移**到「解析器提供商」 —— 并非消失
- **选解析器 = 选信任对象**：看其隐私政策（是否记录/售卖/日志留存多久）

</v-click>

<v-click>

> 加密 DNS ≠ 完全匿名：后续 TLS 握手若未启用 ECH，**SNI（目标域名）仍可能明文暴露**。理想是 **DoH/DoT 加密 + DNSSEC 验真**叠加。

</v-click>

<!--
加密 DNS 不是隐私银弹。它解决「中间链路偷窥」，不解决「你信任的解析器记录你」。Cloudflare 1.1.1.1 同时支持 DoT、DoH 与 DNSSEC，是叠加的范例。
-->

---
layout: center
class: text-center
---

# 小结

一次解析，六块拼图

<v-click>

- **作用与层级**：电话簿；倒树（根→TLD→二级→子域）；四类服务器一头一尾
- **解析流程**：8 步可短路；递归 vs 迭代看立场；UDP 53 图快、TCP 53 图稳
- **记录类型**：A/AAAA 寻址、CNAME 四限制、MX/TXT、NS/SOA、PTR/CAA/SRV
- **缓存与 TTL**：四级缓存、长短 TTL 取舍、迁移先降 TTL、负缓存与 hosts
- **前端优化**：dns-prefetch 轻、preconnect 重、crossorigin 别漏、域名收敛
- **加密安全**：DoH/DoT 管隐私、DNSSEC 验真非加密、解析器仍看得到你

</v-click>

<v-click>

> 从「输入域名→拿到 IP」读懂 DNS，再做快、做安全 —— 全章脉络在此。

</v-click>

<!--
六块收束成一句话：理清角色与层级，看懂怎么查、查到什么、怎么缓存，再用前端手段提速、用加密验真兜底，DNS 就吃透了。
-->

---
layout: center
class: text-center
---

# 谢谢

DNS 域名系统 · 从一次解析读懂互联网的电话簿

<div class="mt-8 text-gray-400">
基于 HTTP 现代标准 · 面向前端工程师
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
全章围绕「输入域名→拿到 IP」这条主线，覆盖层级、解析、记录、缓存、前端优化与加密安全六块。感谢观看。
-->
