---
theme: seriph
background: https://cover.sli.dev
title: crypto-js
info: |
  Presentation crypto-js — JavaScript implementations of standard cryptographic algorithms.

  Learn more at [https://cryptojs.gitbook.io/docs/](https://cryptojs.gitbook.io/docs/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🔐</span>
</div>

<br/>

## crypto-js

纯 JavaScript 实现的加密算法库：哈希 / HMAC / 对称加密 / 编码器 / 密钥派生。API 同步、调用极简、跨环境；适配无 Web Crypto 的旧浏览器与小程序

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/brix/crypto-js" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 crypto-js：一个用纯 JavaScript 写的加密算法库。它一行就能用，CryptoJS.SHA256 算哈希、CryptoJS.AES.encrypt 做加密，全是同步 API，没有 Promise。

最大卖点是不依赖运行环境的原生加密能力，所以能跑在没有 Web Crypto 的老浏览器、小程序、旧 webview 里。

但有一条贯穿全场的重要现状必须先说：crypto-js 官方已经停止维护了。所以今天既教你怎么正确用它，也会在安全关键处给出原生 Web Crypto 的替代建议。

主线：维护现状 → 数据结构 WordArray → 哈希与 HMAC → 对称加密两种模式 → CipherParams 与 OpenSSL → 模式与填充 → 密钥派生 KDF → 安全红线 → 与 Web Crypto 取舍 → 选型总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 先说现状：已停止维护

<v-clicks>

- 官方原文：**Active development discontinued, no longer maintained**
- 不是删库——4.2.0 仍可装、存量项目能跑
- 理由：Node / 现代浏览器已内置原生 Crypto
- 继续开发只会沦为原生 Crypto 的包装层
- 原生还自带安全随机（`Math.random` 不安全）

</v-clicks>

<div v-click class="mt-4 text-sm">

> 结论：**新项目安全场景优先原生**；crypto-js 留给受限环境与存量数据互通。

</div>

<!--
开门见山讲现状。crypto-js 官方 README 顶部明确写着：主动开发已停止，本库不再维护。

注意准确理解：这不是删库下架。包还在 npm 上，最新版 4.2.0 可以正常安装，已经在用的项目能继续跑。

官方给的理由有三点。第一，如今 Node 和现代浏览器都内置了原生 Crypto 模块。第二，继续开发 crypto-js 只会让它变成原生 Crypto 的一层包装，没必要。第三，原生模块自带密码学安全的随机数，而传统 JavaScript 的 Math.random 是不安全的。

所以结论很清楚：新项目的安全场景应该优先用原生 Web Crypto 或 Node 的 crypto。crypto-js 留给两类场景：一是运行在不支持原生加密的受限环境，二是要和历史上用 crypto-js 或 OpenSSL 加密的存量数据互通。这条会贯穿今天全场。
-->

---

# 它能做什么

```ts
import CryptoJS from "crypto-js";
CryptoJS.SHA256("msg").toString();              // 哈希
CryptoJS.HmacSHA256("msg", "key").toString();   // HMAC
CryptoJS.AES.encrypt("msg", "passphrase");       // 对称加密
CryptoJS.enc.Base64.stringify(wordArray);        // 编码
CryptoJS.PBKDF2("pwd", salt, { keySize: 8 });    // 密钥派生
```

<v-clicks>

- 哈希：MD5 / SHA1 / SHA224/256/384/512 / SHA3 / RIPEMD160
- 对称：AES / DES / TripleDES / Rabbit / RC4 / RC4Drop
- 一切都挂在 `CryptoJS` 命名空间，**同步、无 Promise**

</v-clicks>

<!--
crypto-js 能做什么？引入后所有功能都挂在 CryptoJS 这个命名空间下，而且全是同步调用，没有 Promise。

代码里列了五类典型用法：SHA256 算哈希，HmacSHA256 做带密钥的消息认证，AES.encrypt 做对称加密，enc.Base64 做编码转换，PBKDF2 从口令派生密钥。

哈希一共提供这些：MD5、SHA1、SHA224 到 SHA512、SHA3、RIPEMD160。对称加密有 AES、DES、TripleDES、流密码 Rabbit、RC4 和它的变体 RC4Drop。

记住一点：方法名是全大写的，比如 SHA256、MD5、RIPEMD160。这一点初学常写错成小写。
-->

---

# 核心数据结构：WordArray

<v-clicks>

- 不是字符串，也不是 Uint8Array，而是**32 位字的数组**
- 哈希结果、密钥、IV、salt、密文——**统统是 WordArray**
- 两个关键属性：`words`（int32 数组）、`sigBytes`（有效字节数）
- 看结果就 `.toString(编码器)`；**默认是 Hex**

</v-clicks>

<div v-click class="mt-3">

```ts
const wa = CryptoJS.enc.Utf8.parse("Hello"); // 文本 → WordArray
wa.sigBytes;                                  // 5（有效字节数）
wa.toString(CryptoJS.enc.Hex);                // 十六进制
```

</div>

<!--
要用好 crypto-js，必须先理解它的核心数据结构 WordArray。

它既不是字符串，也不是浏览器的 Uint8Array，而是一个 32 位字的数组。库里所有二进制数据——哈希结果、密钥、IV、salt、密文——全都是 WordArray。

它有两个关键属性。words 是一个 32 位整数的数组。sigBytes 是有效字节数。为什么要 sigBytes？因为数据按 32 位字存储，最后一个字可能只有部分字节有效。比如 5 个字节的数据，words 里有两个 int32、占 8 字节空间，但 sigBytes 是 5。手动构造 WordArray 时如果 sigBytes 设错，编码和拼接都会出问题。

最实用的一条：想看 WordArray 的内容，就调 toString，传一个编码器。不传参数时默认用 Hex，所以哈希结果直接 toString 就是十六进制。
-->

---

# 编码器：字符串 ↔ WordArray

| 编码器 | parse | stringify |
|---|---|---|
| `enc.Hex` | hex → WordArray | → 十六进制 |
| `enc.Utf8` | 文本 → WordArray | → UTF-8 |
| `enc.Base64` | Base64 → WordArray | → Base64 |
| `enc.Latin1` / `Utf16` | … | … |

```ts
const wa = CryptoJS.enc.Utf8.parse("Hello");
CryptoJS.enc.Base64.stringify(wa);   // "SGVsbG8="
```

<div v-click class="mt-2 text-sm">

> 编码器只搬运字节，**不保证内容是文本**——二进制按 Utf8 解码会乱码。

</div>

<!--
编码器负责字符串和 WordArray 之间的互相转换，成对提供 parse 和 stringify。parse 是字符串变 WordArray，stringify 是 WordArray 变字符串。

常用的有：enc.Hex 处理十六进制，enc.Utf8 处理文本，enc.Base64 处理 Base64，还有 Latin1、Utf16 等。

代码例子：Utf8.parse 把 Hello 变成 WordArray，再用 Base64.stringify 输出成 Base64 字符串。

有一个重要认知：编码器只是搬运字节，不保证这些字节是有效文本。所以如果你拿一段二进制——比如密文或图片字节——去按 Utf8 解码，会得到乱码甚至报错。这一点在解密排错时非常关键。
-->

---

# 哈希 vs 加密：本质区别

| | 哈希（MD5/SHA…） | 加密（AES…） |
|---|---|---|
| 方向 | **单向、不可逆** | **可逆**（持密钥可解） |
| 要密钥 | 否（HMAC 才要） | 是 |
| 输出 | 定长 | 随明文增长 |
| 用途 | 完整性 / 指纹 | 机密性 |

<v-clicks>

- **不存在「解哈希」**——想「解密 MD5」是误解
- 哈希作用于**字节**：字符串默认按 UTF-8 取字节再哈希

</v-clicks>

<!--
哈希和加密是两回事，初学最容易混。

哈希是单向、不可逆的，比如 MD5、SHA256。它不需要密钥，输出是固定长度的，用来做完整性校验和数据指纹。加密是可逆的，比如 AES，需要密钥，密文长度随明文增长，用来保护机密性。

最重要的一句：不存在解哈希这回事。经常有人问怎么解密 MD5，这是根本性的误解。哈希只能比对——把数据再哈希一遍看是否一致——不能还原出原文。

还有一个跨端常踩的坑：哈希作用于字节，不是字符。字符串默认按 UTF-8 编码成字节再哈希。所以前后端比对哈希，必须保证两边文本到字节用的是同一种编码，通常是 UTF-8，否则字节不同、哈希自然对不上。
-->

---

# 哈希与 HMAC 用法

```ts
// 一次性
CryptoJS.SHA256("Message").toString();
CryptoJS.SHA3("Message", { outputLength: 512 }).toString();

// 渐进式（大数据分块）
const sha = CryptoJS.algo.SHA256.create();
sha.update("part1"); sha.update("part2");
const hash = sha.finalize();   // 复用前要 sha.reset()

// HMAC：带密钥的消息认证
CryptoJS.HmacSHA256("Message", "Secret Key").toString();
```

<div v-click class="mt-2 text-sm">

> HMAC 比朴素的 `SHA256(key + msg)` 安全（抗长度扩展）；SHA3 用 `outputLength` 指定位数。

</div>

<!--
看具体用法。一次性哈希直接 CryptoJS.SHA256，再 toString 拿十六进制。SHA3 比较特殊，要用第二个配置参数的 outputLength 指定输出位数，可以是 224、256、384、512。

如果数据很大、要分块处理，用渐进式 API：algo.SHA256.create 拿到 hasher，多次 update 喂数据，最后 finalize。注意，如果想用同一个 hasher 实例去算下一条独立消息，finalize 之后必须先 reset 清空状态，否则会接到上一条后面，结果就错了。

HMAC 是带密钥的哈希，签名是 message 在前、key 在后。它能同时验证完整性和来源真实性，比朴素地把 key 和 message 拼起来再哈希要安全得多，能抵抗长度扩展攻击。API 签名、Webhook 校验常用它。
-->

---

# 对称加密：最简单的口令模式

```ts
// 加密：返回 CipherParams 对象，.toString() 得到 Base64
const ct = CryptoJS.AES.encrypt("my message", "secret key 123").toString();

// 解密：返回 WordArray，必须 enc.Utf8 转回原文
const bytes = CryptoJS.AES.decrypt(ct, "secret key 123");
const plain = bytes.toString(CryptoJS.enc.Utf8);
```

<v-clicks>

- encrypt 返回的是 **CipherParams**，不是字符串
- 解密漏掉 `enc.Utf8` → 得到 Hex，看着像乱码
- 默认 **CBC + Pkcs7**

</v-clicks>

<!--
对称加密最简单的写法是传字符串口令。

加密：AES.encrypt 传明文和口令。注意它返回的不是字符串，而是一个 CipherParams 对象，要再 toString 才能拿到可传输的 Base64 字符串。这是第一个坑——很多人以为直接拿到字符串。

解密：AES.decrypt 传密文和同样的口令，返回的是 WordArray，必须用 enc.Utf8 转回原文。这是第二个坑——漏掉 enc.Utf8 会得到一串十六进制，看着像乱码。

第三点，默认的分组模式是 CBC，默认填充是 Pkcs7。这些都不用你显式写。

记住这三件事，口令模式就不会出错。
-->

---

# 高频坑：口令 vs key+iv

`AES.encrypt(msg, secondArg, cfg)` 按 **secondArg 类型** 分流：

| secondArg | 当作 | 派生 | IV |
|---|---|---|---|
| **字符串** | 口令 passphrase | KDF + 随机 salt | 自动 |
| **WordArray** | 原始密钥 | 不派生 | **需显式给** |

```ts
CryptoJS.AES.encrypt("msg", "passphrase");          // 口令模式
CryptoJS.AES.encrypt("msg", keyWordArray, { iv });  // key 模式
```

<div v-click class="text-sm">

> ⚠️ 两种**不可混用**，混用通常不报错、只是悄悄解错。

</div>

<!--
这是 crypto-js 最高频的坑，一定要讲清楚。

AES.encrypt 的第二个参数，crypto-js 会根据它的类型走两条完全不同的路。

如果第二个参数是字符串，它被当作口令。crypto-js 会用 OpenSSL 的 KDF 配一个随机 salt，从口令派生出 key 和 IV，IV 是自动生成的。

如果第二个参数是 WordArray，它被当作原始密钥，直接拿来用，不做任何派生，而且不会自动生成 IV，你必须在配置里显式提供 iv。

很多人误以为传字符串就是直接把字符串字节当密钥，这是错的——字符串永远被当口令派生。

最关键的告诫：两种模式不可混用。口令加密的密文必须用同样口令解密，key 加密的必须用同样 key 加 IV 解密。混用通常不会报错,只是悄悄得到错误结果,极难排查。
-->

---

# CipherParams 与 OpenSSL 格式

```ts
const enc = CryptoJS.AES.encrypt("msg", "passphrase");
enc.ciphertext;  // 裸密文 WordArray
enc.salt;        // 随机盐
enc.iv;          // 初始向量
enc.toString();  // Base64("Salted__" + salt + 密文)
```

<v-clicks>

- 口令模式 `toString()` 走 **OpenSSL 格式化器**
- `U2FsdGVk...` 就是 `Salted__` 的 Base64
- salt 内嵌密文，解密时据此重派生 key+IV → 与 `openssl enc` 互通

</v-clicks>

<!--
深入看 CipherParams。encrypt 返回的这个对象，聚合了密文和它的元数据：ciphertext 是裸密文，salt 是随机盐，iv 是初始向量，还有 algorithm、mode、padding 等。

口令模式下,对它调 toString 会走 OpenSSL 格式化器,输出的是 Salted__ 加 salt 加密文,整体再 Base64。

你常看到密文以 U2FsdGVk 开头,这其实就是 Salted__ 这个标记被 Base64 编码后的样子,不是随机噪声,也不是 Base64 的固定头。

这个格式的好处是 salt 内嵌在密文里,解密时能据此重新派生出相同的 key 和 IV。这就让 crypto-js 能和命令行的 openssl enc 互通——命令行加密、JS 解密,反之也行。这正是口令模式存在的意义。
-->

---

# 加密模式与填充

| 模式 | IV | 填充 | 备注 |
|---|---|---|---|
| **CBC** | 是 | 是 | **默认** |
| CTR / OFB / CFB | nonce | 否 | 流式，密文等长 |
| ECB | 否 | 是 | ⚠️ 泄露模式，勿用 |

```ts
CryptoJS.AES.encrypt("msg", "pass", {
  mode: CryptoJS.mode.CTR,
  padding: CryptoJS.pad.NoPadding,
});
```

<div v-click class="text-sm">

> 默认 Pkcs7；CBC 的 IV 必须**随机唯一**；crypto-js **不支持 GCM**。

</div>

<!--
加密模式和填充。默认是 CBC 加 Pkcs7,通过第三个配置参数可以覆盖。

CBC 是默认模式,需要 IV,需要块填充。CTR、OFB、CFB 是流式模式,把分组密码当密钥流用,明文任意长、密文等长,不需要填充。ECB 不用 IV,但相同明文块会产生相同密文块,泄露数据结构,经典例子是加密图片后还能看出轮廓,千万不要用。

代码演示怎么改成 CTR 模式加 NoPadding。模式在 CryptoJS.mode 下,填充在 CryptoJS.pad 下,传的是对象引用不是字符串。

三个要点：默认填充是 Pkcs7;CBC 的 IV 必须每次随机且唯一,不能复用,否则泄露明文相似性;还有一个重要短板——crypto-js 不支持 GCM 这种带认证的模式,这是它相对 Web Crypto 的明显劣势。
-->

---

# 两个 KDF：默认值天差地别

| KDF | 默认 hasher | 默认迭代 | 谁在用 |
|---|---|---|---|
| `PBKDF2` | **SHA256** | **250000** | 你显式调用（推荐） |
| `EvpKDF` | **MD5** | **1** | **口令模式内部** |

<v-clicks>

- 口令模式底层是 **EvpKDF（MD5 + 单次）→ 抗暴力破解极弱**
- 它只为 **OpenSSL 兼容**，不是真正的口令防护
- 要安全：**显式 PBKDF2 大迭代派生 key**，再 key+IV 加密

</v-clicks>

<!--
这页很关键。crypto-js 有两个密钥派生函数,默认值天差地别,不能搞混。

PBKDF2 是你显式调用的那个,4.x 里默认用 SHA256、迭代 25 万次,是推荐的安全选择。注意早期版本曾默认 SHA1、迭代次数极低,被 CVE 诟病过,4.x 做了加固。

EvpKDF 是口令模式内部偷偷用的那个,默认 hasher 是 MD5、只迭代 1 次。

这意味着什么?你写 AES.encrypt 传字符串口令时,底层就是用 MD5 加单次迭代从口令派生 key 和 IV,对暴力破解几乎没有抵抗力。它存在的意义只是 OpenSSL 兼容,不是真正的口令防护。

所以要安全地保护口令,正确做法是:显式用 PBKDF2 配大迭代次数派生出 key,再以 WordArray key 加显式 IV 去加密。不要依赖口令模式的默认行为。
-->

---

# 安全实战：基于口令加密

```ts
const salt = CryptoJS.lib.WordArray.random(128 / 8);
const iv   = CryptoJS.lib.WordArray.random(128 / 8);
const key  = CryptoJS.PBKDF2(passphrase, salt, {
  keySize: 256 / 32,      // 单位是字：256 位 = 8
  iterations: 250000,
});
const ct = CryptoJS.AES.encrypt(plaintext, key, { iv });
// salt 与 iv 不需保密，随密文一起存
```

<div v-click class="mt-2 text-sm">

> 解密时用同样 salt 重派生 key、同样 iv 解密。

</div>

<!--
把上一页的原则落成代码。基于用户口令安全加密,标准四步。

第一,生成随机 salt 和随机 IV,用 WordArray.random,参数单位是字节,128 除以 8 就是 16 字节。

第二,用 PBKDF2 从口令加 salt 派生 key。注意 keySize 单位是 32 位的字,256 位密钥要写 256 除以 32 等于 8。迭代次数给 25 万。

第三,以这个 WordArray key 加上显式 IV 去 AES.encrypt。这样就绕开了口令模式默认的弱 EvpKDF。

第四,salt 和 IV 都不需要保密,它们的作用是让相同口令和明文每次得到不同结果,所以直接和密文一起存就行。

解密时,用同样的 salt 重新派生出相同的 key,再用同样的 IV 解密。这套流程才是 crypto-js 里真正能用于口令保护的写法。
-->

---

# 安全红线（一）：算法选择

<v-clicks>

- **MD5 / SHA1**：已不抗碰撞 → 仅校验和 / 兼容老接口，**不可签名/防篡改**
- **DES / RC4**：已不安全；**3DES** 也被淘汰 → 仅遗留互通
- 新设计的对称加密 → 选 **AES**（更佳：原生 AES-GCM）
- 它们 crypto-js 还留着，是为**兼容**，不是推荐

</v-clicks>

<div v-click class="mt-4 text-sm">

> 「保留」≠「推荐」。能用，不代表该用。

</div>

<!--
安全红线第一条,算法选择。

MD5 和 SHA1 都已经被证明不抗碰撞,可以构造出哈希相同的不同输入。所以它们只能用于非安全的校验和,或者对接只认 MD5 的老接口,绝对不能用于数字签名、证书、防篡改。

DES 密钥才 56 位早就不安全;RC4 有已知的偏置攻击被各大协议弃用;就连 3DES 安全裕度也不足,NIST 已经计划淘汰。这几个只适合和遗留系统互通。

新设计的对称加密,应该选 AES;如果环境支持,更好的是原生的 AES-GCM。

crypto-js 之所以还保留这些弱算法,纯粹是为了兼容存量系统,不是推荐你用。记住一句话：保留不等于推荐,能用不代表该用。
-->

---

# 安全红线（二）：常见误用

<v-clicks>

- **别用哈希存密码**：通用哈希太快，易被暴力/彩虹表 → 用 bcrypt/argon2/大迭代 PBKDF2 + 随机盐
- **HMAC 校验用常量时间比较**：`===` 短路可能招时序攻击（crypto-js 不内置）
- **前端加密挡不住服务器**：密钥若在前端就形同公开；传输安全交给 HTTPS
- **CBC IV 不可复用**；流式模式 **nonce 不可复用**

</v-clicks>

<!--
安全红线第二条,几个常见误用。

第一,别用通用哈希存密码。SHA256 这类哈希为速度设计,攻击者每秒能试上亿次,配合彩虹表很快反推弱口令。密码要用专为慢设计的 bcrypt、argon2,或者大迭代的 PBKDF2,再加每用户随机盐。哈希不可逆不等于抗猜测。

第二,校验 HMAC 或签名时,用常量时间比较。普通的三等号比较会短路,一发现不同就返回,比对耗时会泄露信息,理论上能被时序攻击逐位试探。crypto-js 不内置常量时间比较,要自己实现,Node 里可以直接用 crypto.timingSafeEqual。

第三,前端加密挡不住服务器。如果密钥也在前端,任何拿到前端代码或流量的人都能拿到密钥,加密就形同虚设。传输安全应该交给 HTTPS,前端加密替代不了它。

第四,CBC 的 IV、流式模式的 nonce,都绝对不能复用。
-->

---

# 与原生 Web Crypto 取舍

| 维度 | crypto-js | Web Crypto / Node |
|---|---|---|
| 实现 | 纯 JS | 原生（OpenSSL） |
| API | 同步、极简 | 异步 Promise |
| 性能 | 较慢 | 快 |
| AEAD（GCM） | ❌ | ✅ |
| 安全随机 | 较弱 | 强 |
| 维护 | ❌ 停更 | ✅ 持续 |
| 老环境 | ✅ 能跑 | 需较新环境 |

<div v-click class="text-sm">

> 新项目安全场景 → 原生；受限环境 / 存量互通 → crypto-js。

</div>

<!--
把 crypto-js 和原生 Web Crypto、Node crypto 做个对比。

实现上,crypto-js 是纯 JavaScript,原生的是 C 和 OpenSSL,常有硬件加速。API 上,crypto-js 同步极简,Web Crypto 是异步的 Promise。性能上原生明显更快。

功能上,crypto-js 不支持 GCM 这种带认证的 AEAD 模式,原生支持 AES-GCM。安全随机数,crypto-js 自实现、较弱,原生有 getRandomValues 和 randomBytes。维护状态,crypto-js 已停更,原生由平台持续维护。

但 crypto-js 有一个优势:兼容性。它能跑在不支持 Web Crypto 的老浏览器、小程序里;而 Web Crypto 需要较新环境,浏览器里还要求安全上下文也就是 HTTPS。

所以取舍很清楚:新项目的安全场景优先原生;只有受限环境或要和存量数据互通时,才选 crypto-js。
-->

---

# 排错速查

| 现象 | 原因 | 处理 |
|---|---|---|
| 解密得到 Hex/乱码 | 漏 `enc.Utf8` | 显式 Utf8 解码 |
| Malformed UTF-8 data | 解密失败 | 核对 key/IV/mode/padding |
| 口令密文 key 模式解不开 | 两模式混用 | 统一一种 |
| 末尾多奇怪字节 | padding 不一致 | 两端 padding 一致 |
| 跨端哈希对不上 | 编码不同 | 统一 UTF-8 |

<div v-click class="mt-3 text-sm">

> 「Malformed UTF-8」≈ 解密失败的信号，不是 UTF-8 本身的问题。

</div>

<!--
一页排错速查,都是高频问题。

解密得到一串十六进制或乱码,基本是漏了 toString enc.Utf8,显式按 Utf8 解码即可。

报 Malformed UTF-8 data,通常意味着解密本身就失败了——key 或口令不对、IV 不匹配、mode 或 padding 和加密端不一致、或者密文被损坏截断,得到的是随机字节,按 UTF-8 解析就报错。要去核对加解密参数是否一一对应,而不是以为是 UTF-8 的问题。

口令加密的密文用 key 模式解不开,是两种模式混用了,统一成一种。

末尾多出奇怪字节,多半是加解密两端 padding 设置不一致,比如解密端误设了 NoPadding,两端保持一致即可。

跨端哈希对不上,是两边文本到字节的编码不同,统一用 UTF-8。
-->

---
layout: intro
---

# 总结

crypto-js = **纯 JS、同步、跨环境的加密算法库**

- 数据结构：一切皆 **WordArray**，看结果就 `.toString(编码器)`
- 对称加密：**字符串=口令派生 / WordArray=原始密钥+显式 IV**，别混用
- 默认 **CBC + Pkcs7**；encrypt 返回 **CipherParams**，OpenSSL 兼容
- 安全：口令派生用 **PBKDF2 大迭代**；MD5/SHA1/DES/RC4 仅兼容
- **已停更、无 GCM** → 新项目安全场景优先**原生 Web Crypto**

<!--
总结一下今天的内容。

crypto-js 是一个纯 JavaScript、同步、跨环境的加密算法库。

技术要点四条。第一,数据结构上一切皆 WordArray,想看结果就 toString 传编码器,默认是 Hex。第二,对称加密有两种模式,第二个参数传字符串是口令派生、传 WordArray 是原始密钥需要显式 IV,这两种千万别混用,这是最高频的坑。第三,默认是 CBC 加 Pkcs7,encrypt 返回的是 CipherParams 对象,toString 默认是 OpenSSL 兼容格式。第四,安全上,口令派生要显式用 PBKDF2 大迭代,MD5、SHA1、DES、RC4 只用于兼容不要用于新设计。

最后再强调贯穿全场的一条:crypto-js 已经停止维护,而且不支持 GCM 认证加密、随机源也较弱。所以新项目的安全场景,优先用原生 Web Crypto 或 Node 的 crypto;crypto-js 留给受限环境和存量数据互通。谢谢大家。
-->
