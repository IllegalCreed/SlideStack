---
theme: seriph
background: https://cover.sli.dev
title: 浏览器安全
info: |
  浏览器安全 —— CSP 基础、防注入三件套（strict CSP / Trusted Types / SRI）、沙箱与隔离防御、iframe sandbox 与点击劫持、安全上下文与混合内容、Permissions Policy 与 Fetch Metadata
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:security class="text-8xl" />
</div>

<br/>

## 浏览器安全

浏览器每天执行来路不明的代码，却要守住你的密码、Cookie 和内网设备——靠的不是某一道墙，而是一组常开的防护机制

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
本章讲浏览器执行环境自带的防御工事：CSP 与 Trusted Types 把注入的脚本拦在执行之前，渲染器沙箱与 CORB 保证「就算攻破了 renderer 也拿不到别家数据」，iframe sandbox 与 frame-ancestors 管住嵌入关系，安全上下文与混合内容策略守住传输底线，Permissions Policy 与 Local Network Access 给强能力上锁，Fetch Metadata 把请求来源如实报给服务端。每个机制怎么配、配错了页面怎么坏、DevTools 里怎么看。
-->

---
transition: fade-out
---

# 这一章讲什么：六道防线全景

安全模型不押注任何单点——每一层回答一个「如果上一层失守」

<v-click>

| 防线 | 回答的问题 | 去处 |
| --- | --- | --- |
| ① 同源策略（SOP / CORS） | A 的脚本能不能读 B 的数据？ | 网络章，不重讲 |
| ② 进程隔离（沙箱 · CORB） | 渲染引擎被攻破了呢？ | 第三章 |
| ③ 内容防线（CSP · TT · SRI） | 注入脚本、被篡改的 CDN 怎么拦？ | 第一、二章 |
| ④ 嵌入防线（sandbox · frame-ancestors） | 嵌第三方与被人嵌，怎么控？ | 第四章 |
| ⑤ 传输底线（安全上下文 · 混合内容） | 中间人在场时，什么不该发生？ | 第五章 |
| ⑥ 能力防线（PP · LNA · Fetch Metadata） | 摄像头、内网，凭什么给你用？ | 第六章 |

</v-click>

<v-click>

> 分工口诀：**net-cors 管跨源读取，本章管浏览器常开防护，安全章管攻击手法与鉴权**。

</v-click>

<!--
浏览器是主动下载并执行陌生代码的程序，所以纵深布防。注意分层互不依赖：SRI 挡不住恶意内联脚本（那是 CSP 的活），CSP 挡不住 renderer 被 0day 攻破（那是沙箱的活），沙箱挡不住 Spectre 读本进程内存（那是站点隔离的活）。防线大多靠一行响应头下发、常年值守，是部署配置问题而不是业务代码问题；且防线大多以「拒绝」表达自己——配错的直接症状是页面坏了：脚本不执行、iframe 空白、摄像头拿不到，所以每章都会讲配错了怎么坏、DevTools 里怎么看。TT 即 Trusted Types，PP 即 Permissions Policy。
-->

---
layout: section
---

# 第一章：CSP 基础

一行响应头：什么代码能跑、资源能从哪来

---

# CSP 防什么：威胁模型

XSS 的本质是攻击者的代码混进了你的页面

<v-click>

- 注入代码一旦执行，**与第一方代码同权**：读改 DOM、翻 `localStorage`、带着用户 Cookie 发请求
- 注入载体无非几类：指向恶意源的 `<script src>`、内联 `<script>` 代码块、内联事件处理器（`onerror=…`）、`javascript:` URL、`eval()` 这类字符串变代码的 API
- CSP 的思路不是识别恶意代码（做不到），而是**收窄「代码能从哪来、以什么形态执行」**——注入点即使存在，注入的代码也跑不起来

</v-click>

<v-click>

> 定位摆正：CSP 是**纵深防御**的一层，不是输入过滤/输出转义的替代品——MDN 原话是它「减少注入攻击的危害」，第一道防线永远是别让注入发生。

</v-click>

<!--
CSP 全称 Content Security Policy，主防 XSS，兼防点击劫持（frame-ancestors）与混合内容（upgrade-insecure-requests）。攻击手法本身——payload 构造、过滤绕过——归安全章，本章只管防御怎么配。
-->

---

# 下发通道：响应头为主，meta 为辅

防点击劫持和收违规报告，必须能改响应头

```http
# 推荐：响应头下发——注意应对所有响应设置，而非只有 HTML 主文档
Content-Security-Policy: default-src 'self'; img-src 'self' example.com
```

<v-click>

```html
<!-- 备选：meta 标签——适合无法控制服务器响应头的纯静态托管 -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src 'self' example.com" />
```

</v-click>

<v-click>

- meta 通道是残血版，四个指令在 meta 里**不生效**：`frame-ancestors`、`sandbox`、`report-uri`、`report-to`
- `Content-Security-Policy-Report-Only` 也**没有 meta 形式**——只能走响应头

</v-click>

<!--
配错怎么坏：CSP 是白名单语义，头一旦下发，没列进的资源类型按 default-src 兜底；连 default-src 都没写的指令族则不受限。最典型事故是只写了 script-src 却忘了 object-src/base-uri，或把策略只加在 HTML 上、忘了 Worker 脚本的响应。
-->

---

# 指令体系：四类 + 杂项

`default-src` 是所有 fetch 指令的回退

<v-click>

| 类别 | 指令 | 管什么 |
| --- | --- | --- |
| **fetch** | `default-src`（回退）、`script-src`、`img-src`… | 每类资源从哪加载 |
| **document** | `base-uri`、`sandbox`、`require-trusted-types-for` | 文档自身属性与能力 |
| **navigation** | `form-action`、`frame-ancestors` | 表单去向 / 谁能嵌我 |
| **reporting** | `report-uri`（遗留）→ `report-to`（现行） | 违规往哪报 |
| 杂项 | `upgrade-insecure-requests` | 混合内容处置（第五章） |

</v-click>

<v-click>

- 先定 `default-src 'self'` 兜底再逐类放宽——连它都没写的指令族**不受限**
- 常漏配三件：`object-src 'none'` · `base-uri 'none'` · `form-action`

</v-click>

<!--
常漏配三件的理由：object/embed 是历史注入重灾区，直接关死；base-uri 'none' 阻止注入 base 标签把页面所有相对 URL 劫持到攻击者域名；form-action 限制表单提交目标，防注入表单钓鱼收集凭据。fetch 指令还有 style-src、frame-src、worker-src、font-src、media-src、manifest-src、fenced-frame-src，以及 script-src-elem/-attr、style-src-elem/-attr 细分；child-src 已废弃，由 frame-src + worker-src 接替。connect-src 管 fetch/XHR/WebSocket 的连接目标。frame-ancestors 的展开在第四章，require-trusted-types-for 在第二章。
-->

---

# 源表达式：值怎么写

多值是「或」关系，关键字必须带单引号

```http
Content-Security-Policy: object-src 'none'
# 'none'：该类资源全禁；不能与其他值同列

Content-Security-Policy: img-src 'self'
# 'self'：仅同源（同 scheme + host + port）

Content-Security-Policy: img-src 'self' *.example.org example.com
# host 表达式：具体域名或通配子域

Content-Security-Policy: img-src https: data:
# scheme 表达式：按协议放行——data: 图片常见，script 千万别
```

<v-click>

> 经典配错：不带引号的 `self` 会被当成**名为 self 的主机名**——症状是同源资源莫名被拦、Console 大片违规。

</v-click>

<!--
源表达式一览：'none'、'self'、host、scheme，再加 nonce 与 hash（下一页）以及 'strict-dynamic'、'unsafe-inline'、'unsafe-eval'。data: 放行 data URL，用在 script-src 上等于开注入后门。
-->

---

# nonce 与 hash：放行内联的正道

CSP 一旦下发，内联脚本默认全灭——inline `<script>`、`onclick=`、`javascript:` URL 全部失效

```js
// Express 示例：服务器每次响应生成不可预测的新 nonce，同时写进头与标签
app.get("/", (req, res) => {
  const nonce = crypto.randomUUID(); // 关键：每响应一次、不可预测
  res.setHeader("Content-Security-Policy", `script-src 'nonce-${nonce}'`);
  // 模板注入 nonce：攻击者拿不到本次值，注入的脚本自然不执行
  res.send(`<script nonce="${nonce}" src="/main.js"></script>`);
});
```

<v-click>

| 对比 | nonce | hash（`sha256/384/512`） |
| --- | --- | --- |
| 适用 | 服务端动态渲染 | 纯静态页 / 构建期可算哈希 |
| 要求 | 每响应重新生成、模板注入 | 对脚本**内容**算哈希，一变就得重算 |
| 内联 / 外部 | 都支持 | 都支持（外部脚本标签须带一致的 `integrity`） |

</v-click>

<!--
hash 版写法：script-src 'sha256-ex2O7MWOzfczthhKm6azheryNVoERSFrPrdvxRtP8DI='。内容不变哈希不变，所以响应头可以是静态的，适合纯静态托管。外部脚本走 hash 时，script 标签必须带 integrity 且值与策略一致。这是接入 CSP 页面最常「坏」的地方：先想好内联怎么放行再上线。
-->

---

# unsafe-inline 与 unsafe-eval：为什么危险

用它们换省事，基本抵消 CSP

<v-click>

| 洞 | 一次放行什么 | 后果 |
| --- | --- | --- |
| `'unsafe-inline'` | 内联 `<script>`、内联事件处理器、`javascript:` URL | 三类恰是 XSS 主战场——注入 `<img onerror=…>` 直接执行 |
| `'unsafe-eval'` | `eval()`、`new Function()`、字符串版 `setTimeout`/`setInterval` | 任意字符串变代码的入口 |

</v-click>

<v-click>

- 兜底共存：同指令并写 nonce/hash + `'unsafe-inline'`——现代浏览器**忽略** `'unsafe-inline'`，老浏览器按它兜底
- `'unsafe-eval'` **不会**被 nonce/hash 的存在关掉——老库逼你开它时，正解是升级依赖而不是开洞
- 改造抓手：内联事件改 `addEventListener`；`javascript:` URL 改按钮 + 监听；`eval` 多半能用 `JSON.parse` 或查表替代

</v-click>

<!--
MDN 对 unsafe-inline 的评语是它「抵消了 CSP 的大部分意义」。有 nonce/hash 时现代浏览器会忽略同指令里的 unsafe-inline，这一行为正好用来给历史包袱页面做过渡。
-->

---

# Report-Only：先观测，再收紧

所有防线共用的上线节奏

```http
# 只上报不拦截——策略试运行（只能走响应头，无 meta 形式）
Content-Security-Policy-Report-Only: default-src 'self'; report-to csp-endpoint

# 正式执行 + 继续上报
Content-Security-Policy: default-src 'self'; report-to csp-endpoint
```

<v-click>

- 标准上线路径：**Report-Only 收集真实流量违规 → 按报告修代码/改配置 → 换强制头 → 保留上报持续监控**
- 两头可同时下发——一严一宽做灰度
- 全叶通用的观测基建：CSP / Permissions Policy / Integrity-Policy 的违规观测**共用同一套 Reporting API**——报告端点在项目初期搭好，每接入一道防线都是复用

</v-click>

<!--
`*-Report-Only` 头 + report-to 这对搭档会在后面反复出现，这是刻意的设计。页内还可用 ReportingObserver 实时订阅报告。谁在违规、违在哪个文件哪一行，报告 JSON 里都有。
-->

---

# 报告换代：report-uri → report-to

`report-uri` 已废弃，现行走 Reporting API

<v-click>

| | `report-uri`（废弃） | `report-to`（现行） |
| --- | --- | --- |
| 端点声明 | 直接写 URL | 由 **`Reporting-Endpoints`** 响应头定义具名端点 |
| 传输 | POST `application/csp-report` | Reporting API 批量 POST |
| 兼容 | 老浏览器广泛支持 | 现代浏览器 |

```http
# 现代写法：先声明端点再引用；过渡期可并写（支持 report-to 的浏览器忽略前者）
Reporting-Endpoints: csp-endpoint="https://example.com/csp-reports"
Content-Security-Policy: default-src 'self'; report-uri /csp-reports; report-to csp-endpoint
```

</v-click>

<v-click>

- 报告关键字段：`blockedURL`（内联为 `"inline"`）、`effectiveDirective`（命中指令）、`sourceFile`/`lineNumber`、`sample`（前 40 字符）
- DevTools：Console 每条违规一行红字（被拦 URL + 命中指令）；Network 里被拦请求标 `(blocked:csp)`

</v-click>

<!--
报告 JSON 的 type 是 csp-violation，disposition 字段区分 enforce 还是 report。sample 字段便于判断是攻击还是自己人误伤。页面里监听 securitypolicyviolation 事件可拿到与报告同构的字段。Console 的固定格式：Refused to load/execute … because it violates the following Content Security Policy directive。
-->

---
layout: section
---

# 第二章：防注入三件套

strict CSP · Trusted Types · SRI——三层互不替代

---

# 白名单 CSP 的失败：为什么要 strict

直觉的写法是列域名白名单——实践证明几乎必然失守

```http
Content-Security-Policy: script-src 'self' https://cdn.example.com https://analytics.example.com
```

<v-click>

- 研究《CSP Is Dead, Long Live CSP!》：多数白名单**不经意混进不安全域名**——被放行的域上存在 JSONP 端点、旧版 Angular 运行时，攻击者就能借道执行任意代码
- 你信任的是**整个域**，而不是某个文件
- **维护成本失控**：第三方脚本自己还会拉脚本——完整放行 Google Analytics 链路要 **187 个 Google 域名**
- **列表会腐烂**：第三方换 CDN、加新域——白名单要么拦坏功能、要么越放越宽

</v-click>

<v-click>

> strict CSP 的答案：放弃「按来源信任」，改为**「按凭据信任」**。

</v-click>

<!--
这项研究是 MDN 直接引用的 Google 论文。白名单的问题不是理论洞，是工程现实：任一被放行的域上有可上传文件的路径，白名单就形同虚设。
-->

---

# strict CSP 配方：按凭据信任

MDN 与 web.dev 共同的官方推荐

```http
# nonce 版（动态渲染站点）——四件套齐全，不写任何域名白名单
Content-Security-Policy:
  script-src 'nonce-{每次响应随机}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none';
```

<v-click>

- **`'strict-dynamic'` = 信任传递**：被 nonce/hash 认证过的脚本，其通过 `document.createElement("script")` 动态创建的后代脚本**自动获得信任**——专治第三方脚本再拉脚本的链条
- 生效时浏览器**忽略同指令里的域名与 `'self'`**——方便与老浏览器写兼容策略
- 代价要心里有数：被信任脚本若有「拿页面可注入数据当 src 建 script」的坏习惯，信任链会被借用
- 静态站点用 hash 版：`script-src 'sha256-{脚本哈希}' 'strict-dynamic'`，其余相同

</v-click>

<!--
现代第三方脚本（统计、广告、客服挂件）普遍会再动态注入脚本，没有信任传递就会大面积拦坏——strict-dynamic 是让 strict CSP 能落地的关键。nonce/hash 的语法与生成细节在第一章已讲，这页只补配方的组装逻辑。
-->

---

# Trusted Types：DOM XSS 与注入 sink

strict CSP 挡住「注入的脚本标签」，但 DOM 型 XSS 不需要新标签

<v-click>

- 第一方代码自己把攻击者可控的字符串塞进危险 API 就够了——`el.innerHTML = location.hash.slice(1)` 即是完整漏洞
- 这类危险 API 统称**注入 sink（injection sink）**，分三族：

</v-click>

<v-click>

| Sink 族 | 代表 API | 收的类型 |
| --- | --- | --- |
| HTML 注入 | `innerHTML`、`outerHTML`、`insertAdjacentHTML()`、`document.write()`、`iframe.srcdoc` | `TrustedHTML` |
| 脚本执行 | `eval()`、`new Function()`、字符串版 `setTimeout`/`setInterval` | `TrustedScript` |
| 脚本地址 | `script.src`、`new Worker(url)`、`importScripts()` | `TrustedScriptURL` |

</v-click>

<!--
sink 清单还包括 DOMParser.parseFromString()、setHTMLUnsafe()、script.text/textContent、serviceWorker.register() 等。Trusted Types 的定位：给所有这些 sink 上一道闸，下一页看机制。
-->

---

# Trusted Types 机制：sink 只收盖过章的对象

CSP 声明后，往 sink 塞裸字符串直接抛 `TypeError`

```http
Content-Security-Policy: require-trusted-types-for 'script'; trusted-types my-policy
# require-trusted-types-for 'script'：sink 拒收裸字符串
# trusted-types my-policy：锁定允许的策略名（防攻击者自建放水策略）
```

<v-click>

```js
// 策略工厂：把净化逻辑集中到唯一入口（此处接 DOMPurify）
const policy = trustedTypes.createPolicy("my-policy", {
  createHTML: (input) => DOMPurify.sanitize(input), // 净化后返回，产出 TrustedHTML
});

el.innerHTML = policy.createHTML(userInput); // 通过：收到 TrustedHTML
el.innerHTML = userInput; // 强制模式下：TypeError，Console 与违规报告同时记录
```

</v-click>

<!--
三种 Trusted 类型对应三族 sink：TrustedHTML、TrustedScript、TrustedScriptURL。价值在于把全站散落的危险赋值逼进唯一的净化入口，审计面从「所有 sink 调用点」缩小到「策略工厂本身」。
-->

---

# 迁移与兼容：default 策略 · Baseline · tinyfill

「只有 Chrome 支持」是旧认知

<v-click>

- **default 策略**：创建名为 `"default"` 的策略后，存量裸字符串赋值**自动路由给它**——先「净化 + 记账」边跑边改，而不是一开闸全站报错；返回 `null`/`undefined` 则赋值抛 `TypeError`
- **Report-Only 灰度**：`Content-Security-Policy-Report-Only: require-trusted-types-for 'script'`——把所有裸字符串调用点摸排干净再强制
- **Baseline 2026-02 Newly available**：自 2026 年 2 月起各主流浏览器最新版全部可用（含 Web Worker），可上生产

</v-click>

<v-click>

```js
// tinyfill：不支持 Trusted Types 的浏览器里，createPolicy 退化为「返回规则对象本身」
if (typeof trustedTypes === "undefined")
  trustedTypes = { createPolicy: (n, rules) => rules };
// 支持 → TrustedHTML 对象 + CSP 强制；不支持 → 普通净化函数，同一套代码两头跑
```

</v-click>

<!--
Newly available 意味着老版本浏览器仍在存量中，所以官方给了 tinyfill：一行代码让 policy.createHTML 在老浏览器里就是普通净化函数，返回净化后的字符串，代码同构运行。
-->

---

# SRI：拿到的文件是不是没被篡改

威胁模型是供应链攻击

<v-click>

- CDN 被攻破、文件被替换——「来源」没变，你的 CSP 白名单/nonce **照常放行**，变的是内容
- SRI（Subresource Integrity）：浏览器下载后**比对哈希**，不匹配拒绝加载

</v-click>

<v-click>

```html
<!-- integrity：算法前缀-base64 哈希；跨域必须 crossorigin，否则整体失败 -->
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous"></script>
```

```bash
# 生成哈希（与 srihash.org 等价）
cat lib.js | openssl dgst -sha384 -binary | openssl base64 -A
```

</v-click>

<!--
适用元素：script 与 link（rel 为 stylesheet、preload、modulepreload）。SRI 管的是「拿到的文件对不对」，与前两件（管「执行什么」）互不替代。
-->

---

# SRI 规则清单与 Integrity-Policy

失败 = 按网络错误处理，要有监控

<v-click>

- **失败行为**：哈希不匹配 = **拒绝加载并按网络错误处理**——页面少了这个脚本该怎么坏就怎么坏
- **算法**：`sha256/384/512` 可空格并列——混用算法时只取**最强**一组；同算法多值**任一匹配即过**（可同时放行多个合法版本）
- **跨域必须走 CORS**：CDN 返回 `Access-Control-Allow-Origin`，标签写 `crossorigin="anonymous"`——若允许 no-cors 比对，攻击者可「猜哈希 + 看加载成败」探测跨源内容，所以 **no-cors + integrity 一律失败**
- **适用边界**：适合版本固定的资源；`/latest/lib.js` 滚动 URL 内容一变哈希即碎——锁版本或自托管

</v-click>

<v-click>

```http
# 头级强制：无 integrity（或 no-cors）的脚本请求直接拦下并上报；可 Report-Only 灰度
Integrity-Policy: blocked-destinations=(script), endpoints=(integrity-endpoint)
```

</v-click>

<!--
单靠标签属性无法保证每个脚本都记得写 integrity，Integrity-Policy 响应头把它变成强制项，配 Integrity-Policy-Report-Only 先观测。这是新锐头，注意浏览器支持情况。
-->

---

# 三件套怎么协同

各管一段，叠满才算把注入面收干净

<v-click>

| 攻击场景 | 谁来挡 | 怎么挡 |
| --- | --- | --- |
| 注入 `<script src=//evil>` / 内联脚本 | strict CSP | 无 nonce/hash → 不执行 |
| 第一方代码把脏字符串塞进 `innerHTML` | Trusted Types | sink 拒收裸字符串，逼流量过净化策略 |
| CDN 被黑替换 lib.js | SRI | 哈希不匹配 → 网络错误拒载 |
| 被信任脚本再拉脚本 | `'strict-dynamic'` | 信任显式传递，无需白名单 |
| 漏写 integrity 的脚本混上线 | Integrity-Policy | 头级强制 + 上报 |

</v-click>

<v-click>

> 部署顺序：Report-Only 版 strict CSP → 强制 → Trusted Types Report-Only → default 策略过渡 → 强制 → 版本固定的第三方补 SRI / Integrity-Policy——**每一步都有独立收益**。

</v-click>

<!--
三件分工再念一遍：strict CSP 管「什么脚本能执行」、Trusted Types 管「什么字符串能进 DOM XSS sink」、SRI 管「拿到的文件是不是没被篡改」。执行环境这层若被整个攻破怎么办？下一章往下看一层。
-->

---
layout: section
---

# 第三章：沙箱与隔离防御

假设 renderer 已被攻破，还守得住什么

---

# 威胁模型：renderer 迟早会被攻破

前两章预设「渲染引擎还听你的」，本章换更悲观的前提

<v-click>

- **渲染引擎漏洞是常态**：解析 HTML/CSS/JS/字体/图片的代码量巨大，Chromium 自家统计每个版本都有「潜在可利用」的 renderer 漏洞
- **UXSS（Universal XSS）**：绕过 renderer 内同源策略的漏洞类别——不用攻破进程，只要骗过检查，历史上「相当常见」
- **Spectre / Meltdown（2018）**：CPU 推测执行侧信道——**不需要浏览器有任何 bug** 就能读取本进程任意内存；软件层的同源检查在它面前失效

</v-click>

<v-click>

> Chromium 的结论：**唯一靠得住的边界是进程**——防御目标从「不被攻破」降级为「被攻破的进程里没有值得偷的东西，也干不成坏事」。

</v-click>

<!--
第三条是分水岭：同源策略是 renderer 进程内的软件检查，而 Spectre 读内存根本不走检查。这决定了本章所有机制都围绕「进程」这条边界展开。
-->

---

# 渲染器沙箱：断掉通向系统的手脚

先限制失陷进程对本机的伤害

<v-click>

- renderer 进程启动时就被套上 **OS 级沙箱**：没有直接系统调用权——不能任意打开文件、访问设备、建原始网络连接
- **一切特权操作走代理**：读文件、发网络请求都要经 IPC 向 browser 进程（或 Network Service）**提交申请**，特权进程校验后代办
- 对前端的可见后果：「网页任意读用户磁盘」从架构上不存在——文件访问全部经 `<input type="file">`、拖放、File System API 等**用户显式授权**的窄门

</v-click>

<v-click>

> 沙箱管住了「向下」（本机），管不住「向内」——同进程内存里已有的数据，Spectre 照读。所以需要下一层。

</v-click>

<!--
Chromium 文档的表述：沙箱「防止失陷的 renderer 进程访问任意本地资源（如文件、设备）」。这层解决的是失陷进程伤害本机的问题，跨站数据的问题交给站点隔离和 CORB。
-->

---

# 四层防御纵深：每层假设上一层失守

越往下，信任的代码越少

<v-click>

| 层 | 机制 | 失守时的下一层 |
| --- | --- | --- |
| ① | renderer 内 Web 安全检查（同源策略、CSP 执行…） | UXSS / 引擎漏洞 → ② |
| ② | **站点隔离**：不同 site 必进不同 renderer 进程 | 数据「被拉进」本进程 → ③④ |
| ③ | **OS 沙箱**：进程无本地资源访问权 | 失陷进程伤不到本机 |
| ④ | **browser 进程终审**：校验 renderer 的每个特权请求 | 检测到越权 → **终止该 renderer** |

</v-click>

<v-click>

- browser 进程掌握「哪个进程属于哪个 site」——某 site 的 **Cookie、保存的密码**只交给该 site 的进程
- 失陷 renderer 经 IPC 冒领他站数据会被**识破并直接杀掉进程**

</v-click>

<!--
站点隔离的进程模型本体（site 粒度、OOPIF、桌面全量隔离约 10-13% 内存、Chrome 67 起默认）在「浏览器架构」一章讲过，本章记住防御语义：同进程 = 同一失陷域，跨 site 数据绝不同进程。
-->

---

# 越权请求的死亡之旅

失陷 renderer 的四次碰壁

```text
evil.example 的 renderer 已被攻击者完全控制
 ├─ 想读 bank.example 的 DOM？
 │   └─ ② 站点隔离：对方在另一个进程，本进程内存里没有 → 无从读起
 ├─ 想发子资源请求把 bank 的 JSON「拉进」本进程？
 │   └─ CORB/ORB：响应体在进程外被没收 → 拉进来的是空的
 ├─ 想直接读磁盘上的浏览器 Cookie 数据库？
 │   └─ ③ OS 沙箱：无文件系统访问权 → 系统调用被拒
 └─ 想伪造 IPC，冒充 bank.example 向 browser 进程要 Cookie？
     └─ ④ browser 进程核对进程 ↔ site 归属：对不上 → 拒绝并可击杀进程
```

<v-click>

> 每一步的失败都**不依赖前一步成功**——这就是「纵深」的工程含义。

</v-click>

<!--
把四层串成一次具体的攻击路径最直观：读 DOM 靠站点隔离挡、拉数据靠 CORB/ORB 挡、读磁盘靠 OS 沙箱挡、伪造 IPC 靠 browser 进程终审挡。
-->

---

# Spectre：侧信道与浏览器的三板斧

机制细节归体系结构，前端只需要三个事实

<v-click>

1. 读的是**「本进程」内存** → 治本是**站点隔离**：敏感数据根本不进攻击者进程
2. 攻击要靠**高精度计时**测缓存命中的纳秒级时差 → 2018 年后浏览器统一**降低计时器精度**并加入抖动
3. **高危能力上锁**：`SharedArrayBuffer` 本质是「自带高精度计时器的共享内存」，披露后被各浏览器紧急下架

</v-click>

<v-click>

- 如今要用 SAB（以及恢复高精度计时），页面必须先用 **COOP + COEP** 达成跨源隔离——`self.crossOriginIsolated === true`
- 用「主动声明隔离」换回强能力；头的配置归网络章，此处不重讲

</v-click>

<!--
SharedArrayBuffer 的遭遇是绝佳注脚：一旦允许共享内存，就把同进程的攻击面交给了网页，于是浏览器要求页面先用 COOP/COEP 声明自我隔离——边界的每次放松都要用更强的隔离承诺赎买。
-->

---

# CORB → ORB：别让数据走进敌营

站点隔离分开了进程，但有个缺口

<v-click>

- 失陷 renderer 可**自己发起**跨站子资源请求——`<img src="https://bank.example/api/balance.json">`：图片解码失败，但没有防护的话**响应字节已进进程内存**，Spectre 接手就能读
- **CORB（Cross-Origin Read Blocking）**：跨站的 **HTML / XML / JSON（及 PDF 等）**响应不交付给发起请求的渲染进程，除非服务器经 CORS 明确放行——命中时响应体替换为空，**渲染进程从未见过那些字节**
- CORB 是**尽力而为**：Web 上大量资源 MIME 标错（JS 标成 HTML），为不拦坏正常网站只能网开一面
- 继任者 **ORB（Opaque Response Blocking）**思路反转：**默认拦下无法证明是合法子资源的不透明响应**——白名单代替黑名单，已写入 Fetch 标准、各引擎逐步落地

</v-click>

<v-click>

- 服务器配合：标准 MIME + `X-Content-Type-Options: nosniff` + `Cross-Origin-Resource-Policy` 显式声明资源归属

</v-click>

<!--
HTML/XML/JSON 几乎不可能是合法的 img/script 子资源，这是 CORB 的判定依据。DevTools 里被拦资源显示为空响应。数据接口把 MIME 标对、加 nosniff，就能与 CORB/ORB 和平共处——「CORB 拦截是玄学」是旧认知。
-->

---

# 三分钟亲手验证 + 行动清单

这层防御平时不可见，但每条都能看到实证

<v-click>

| 想验证什么 | 怎么做 | 预期看到 |
| --- | --- | --- |
| 跨站 iframe 真的分进程 | Chrome 任务管理器打开嵌第三方的页面 | 独立的「子框架」行 |
| CORB/ORB 在拦数据 | `<img src="跨站 JSON 接口">`，看 Network | 响应体为空 |
| 计时器被降精 | Console 连续跑 `performance.now()` | 明显粒度/抖动 |
| 强能力的隔离门票 | Console 看 `crossOriginIsolated` / `typeof SharedArrayBuffer` | `false` / `"undefined"` |

</v-click>

<v-click>

- 前端能做的配合：数据接口标准 MIME + `nosniff`；发 `Cross-Origin-Resource-Policy`
- 需要 SAB / 高精度计时 / WASM 多线程 → 按 COOP+COEP 做跨源隔离；服务端用 `Sec-Fetch-*` 拒跨站流量（第六章）

</v-click>

<!--
「响应体为空」正是本章防线的具象——请求发出去了、服务器也答了，但数据在进入失陷风险区之前被没收。frame 到进程的映射还可以看 chrome://process-internals 的 Frame Trees。
-->

---
layout: section
---

# 第四章：iframe sandbox 与点击劫持

嵌入的安全是双向的

---

# sandbox 属性：给嵌入内容关笼子

iframe 默认继承一整套 Web 能力——跑脚本、弹窗、提交表单、导航你的顶层

<v-click>

```html
<!-- 最严格：空 sandbox，全部限制生效——适合完全不可信的静态内容 -->
<iframe sandbox src="https://untrusted.example/page.html"></iframe>

<!-- 常见配方：允许脚本与表单，但仍是不透明源、不能动顶层 -->
<iframe sandbox="allow-scripts allow-forms" src="https://widget.example/embed"></iframe>
```

</v-click>

<v-click>

- `sandbox` 把模型反转为**默认全禁、按 token 白名单放行**
- 空值之下：脚本不执行、表单/弹窗静默失败、`alert()` 无效、不能导航 `_top`
- 且**源被替换为不透明源（opaque origin）**：同源判定永远失败——Cookie、`localStorage`、`indexedDB` 与需要源的 API 全部不可用

</v-click>

<!--
嵌第三方内容（广告、评论挂件、用户自定义页面）时，iframe 的默认能力就是攻击面。sandbox 的白名单语义：写一个 token 放开一项，什么都不写就是全禁。
-->

---

# sandbox token 全谱（上）：高频七项

写一个放开一项

<v-click>

| Token | 放行什么 |
| --- | --- |
| `allow-scripts` | 执行脚本（但不含弹窗能力） |
| `allow-same-origin` | 保留真实源——缺省则为不透明源，无存储/Cookie |
| `allow-forms` | 表单提交（缺省时能显示、能填，提交无效） |
| `allow-popups` | `window.open()`、`target="_blank"`（缺省则静默失败） |
| `allow-popups-to-escape-sandbox` | 弹出的新窗口**不继承**沙箱限制 |
| `allow-modals` | `alert()`/`confirm()`/`prompt()`/`print()`、`<dialog>` |
| `allow-downloads` | 经 `download` 属性或导航触发的文件下载 |

</v-click>

<!--
allow-popups-to-escape-sandbox 是第三方广告点击跳转的标配：落地页不该继承广告位的沙箱限制。allow-modals 还包括接收 beforeunload。
-->

---

# sandbox token 全谱（下）：导航与杂项

顶层导航是「把用户整页带走」的能力，慎给

<v-click>

| Token | 放行什么 |
| --- | --- |
| `allow-top-navigation` | 导航顶层窗口（`_top`）——慎给 |
| `allow-top-navigation-by-user-activation` | 同上，但**仅限用户手势触发**——防脚本自动劫持跳转 |
| `allow-top-navigation-to-custom-protocols` | 顶层导航到非 http 自定义协议 |
| `allow-orientation-lock` / `allow-pointer-lock` / `allow-presentation` | 锁屏幕方向 / Pointer Lock / 演示会话 |
| `allow-storage-access-by-user-activation` | 经 Storage Access API 申请非分区 Cookie |

</v-click>

<v-click>

> 摄像头、麦克风、全屏、支付这类**强能力不归 sandbox 管**——那是 `allow` 属性（Permissions Policy）的辖区，两者叠加使用（第六章）。

</v-click>

<!--
allow-popups 与 allow-top-navigation 会连带激活 allow-top-navigation-to-custom-protocols。sandbox 管的是文档基础能力，Permissions Policy 管的是强能力，两套体系并行。
-->

---

# 三个必须背下来的坑

配 sandbox 最常见的翻车点

<v-click>

- **坑一：同源逃逸**——对**同源**内容同时给 `allow-scripts` + `allow-same-origin`：内嵌文档可访问父页 DOM → 找到自己的 iframe 节点 → `removeAttribute("sandbox")` → 重载后自由身。**不可信内容必须放独立源**（哪怕是子域）
- **坑二：沙箱遗传**——沙箱 iframe 里开的弹窗/新标签**继承全部限制**：广告落地页表单集体静默失效。要么补 `allow-popups-to-escape-sandbox`，要么接受受限
- **坑三：不透明源静默白屏**——忘给 `allow-same-origin` 时界面正常加载，但 Cookie 登录态、localStorage、带凭证请求全失效——第三方挂件「白屏/加载圈但 Console 干净」

</v-click>

<v-click>

- 排查入口：DevTools → **Application → Frames** 选中该 frame，可看到生效的沙箱标志位

</v-click>

<!--
坑一是 MDN 的原警告：同源 + 双 token 的组合「安全性与完全不用 sandbox 无异」。沙箱只对独立源上的内容才有意义。
-->

---

# CSP sandbox 指令：资源给自己上沙箱

同一套限制的响应头形态——由被嵌方或资源自己声明

```http
# 该文档以沙箱方式渲染：只放行脚本，其余全禁
Content-Security-Policy: sandbox allow-scripts
```

<v-click>

- 典型用途：**用户上传内容**（HTML 附件预览、富文本渲染服务）的响应统一加 `sandbox`
- 补上属性方案的盲区：**`sandbox` 属性只在「被 iframe 嵌着」时有效**——用户新开标签直接访问资源 URL 就没了笼子；响应头版让它在哪都在沙箱里跑
- 限制：`<meta>` 里不生效；也不能用于 Report-Only 头

</v-click>

<!--
属性版是嵌入方给对方上锁，指令版是资源自己入笼。用户上传的 HTML 是典型场景：即使有人拿到直链直接打开，它也在沙箱里。
-->

---

# 点击劫持与 X-Frame-Options（遗留）

防御的本质与 sandbox 相反：控制谁能把我嵌走

<v-click>

- 点击劫持一句话：攻击者把你的页面装进**透明 iframe** 叠在诱饵界面上——用户以为在点抽奖按钮，实际点的是你页面里的「转账/授权/关注」
- 防御靠响应头声明「谁能嵌我」：

</v-click>

<v-click>

```http
X-Frame-Options: DENY        # 任何页面都不得嵌入本文档（同源也不行）
X-Frame-Options: SAMEORIGIN  # 仅当整条祖先链全部同源时可嵌
```

- **`ALLOW-FROM` 已废**：现代浏览器遇到含它的头会**完全忽略整个头**——写了等于没防护
- **meta 写法无效**：`<meta http-equiv="X-Frame-Options">` 不被执行，只认响应头
- `SAMEORIGIN` 校验**所有祖先** frame，不止直接父级

</v-click>

<!--
利用手法与变体归安全章，本章只管防御。ALLOW-FROM 的坑最狠：不是降级为 DENY，而是整头作废等于裸奔——需要来源白名单必须换 CSP frame-ancestors。
-->

---

# frame-ancestors（现行）：迁移对照

XFO 做不到的来源白名单，CSP 做得到

```http
Content-Security-Policy: frame-ancestors 'none'                          # ≈ DENY
Content-Security-Policy: frame-ancestors 'self'                          # ≈ SAMEORIGIN
Content-Security-Policy: frame-ancestors 'self' https://partner.example  # 可信嵌入方列表
```

<v-click>

| | X-Frame-Options | CSP frame-ancestors |
| --- | --- | --- |
| 全禁 / 仅同源 | `DENY` / `SAMEORIGIN` | `'none'` / `'self'` |
| 指定来源列表 | 不支持（ALLOW-FROM 已废） | 支持，多来源 + scheme/通配 |
| meta 下发 | 无效 | 同样无效（该指令仅响应头） |
| 两者并存时 | 应被忽略 | **CSP2 规定 frame-ancestors 优先** |

</v-click>

<v-click>

- 部署：新配置直接上 `frame-ancestors`，保留一条语义对齐的 XFO 给极老客户端兜底
- 默认值要记牢：**不发任何头 = 任何人都能嵌你**——后台、登录页、支付页必须显式声明

</v-click>

<!--
配错怎么坏：最常见症状是自己的页面在自己的 iframe 里白屏（把 'none' 发给了需要内嵌的页面），Console 打出 Refused to frame。Nginx 参考：add_header Content-Security-Policy "frame-ancestors 'none'" always; 外加 add_header X-Frame-Options DENY always。嵌第三方还有个现代变体 credentialless iframe，归网络章跨源隔离的配套。
-->

---
layout: section
---

# 第五章：安全上下文与混合内容

强能力的准入门槛，密文页面的明文窟窿

---

# 安全上下文：判定规则

目标是不让中间人碰到强能力 API——判定结果挂在 `window.isSecureContext`

<v-click>

| 上下文 | 安全？ | 说明 |
| --- | --- | --- |
| `https://` / `wss://` | ✅ | 正道 |
| `http://127.0.0.1` / `http://localhost` / `http://*.localhost` | ✅ | 本机投递不经网络——**potentially trustworthy origin**（Firefox 84+ 才认 localhost） |
| `file://` | ✅ | 本地文件 |
| 其余一切 `http://` | ❌ | 内网 IP 也不算：`http://192.168.1.10` ❌ |
| HTTPS iframe 嵌在 HTTP 页面里 | ❌ | **祖先链一票否决**：所有祖先都必须安全 |
| HTTP 页面 `window.open` 出的 HTTPS 窗口 | ✅ | 弹窗按**自己的顶层**判定，不看 opener |

</v-click>

<!--
动机直指中间人：HTTP 页面的每一个字节都可能被网络路径上的任何一跳篡改。如果强能力在 HTTP 下可用，「攻破咖啡馆 Wi-Fi」就等于「往任意页面注入一段调 getUserMedia 的脚本」。这张表解释了「本地开发能用 SW，一上 http 测试机就不行」。
-->

---

# isSecureContext 与两个高频踩坑

别猜，问浏览器

```js
// 特性检测（Worker 里同样有 self.isSecureContext）
if (window.isSecureContext) {
  navigator.serviceWorker.register("/sw.js"); // 安全上下文：SW 可注册
} else {
  console.warn("非安全上下文：强能力 API 不可用");
}
```

<v-click>

- **局域网联调**：手机访问 `http://192.168.1.10:5173` 时 SW/摄像头全灭（本机 localhost 好好的）——解法是 devServer 开 HTTPS（自签/mkcert）或用支持 HTTPS 的隧道
- **iframe 集成**：你的 HTTPS 应用被客户嵌进 HTTP 老门户，强能力集体失效——这是祖先链规则，不是你的 bug
- 失败形态不统一：有的 API 干脆 `undefined`（如 `navigator.serviceWorker`），有的返回拒绝的 Promise——特性检测两种都要兜

</v-click>

<!--
「安全上下文就是 HTTPS」是旧认知：localhost、127.0.0.1、*.localhost、file:// 也算（本机投递）；反过来 HTTPS iframe 嵌在 HTTP 页里不算。
-->

---

# 强能力门控清单

不在安全上下文里：直接不存在，或直接拒绝

<v-click>

| 用途 | 被门控的 API（高频节选） |
| --- | --- |
| 离线与消息 | **Service Workers**、Push、Notifications |
| 媒体采集 | **`getUserMedia()`**（摄像头/麦克风）、Screen Capture |
| 定位与传感 | **Geolocation**、Generic Sensor |
| 密码学与凭证 | **Web Crypto**（`crypto.subtle`）、**WebAuthn** |
| 硬件直连 | **WebUSB**、Web Bluetooth、WebHID、Web Serial |
| 剪贴板 / 支付 / 图形 | **异步 Clipboard**、Payment Request、**WebGPU** |

</v-click>

<v-click>

> 记忆模型：**「这个能力落到中间人手里可怕吗？」**——可怕就在清单上。

</v-click>

<!--
MDN 维护完整列表有几十项，还包括 File System API、Background Sync/Fetch、Audio Output Devices、设备方向/运动、WebOTP、Credential Management、Web NFC、Web MIDI、Web Share、Screen Wake Lock、Idle Detection、Storage API 持久化、WebCodecs、WebTransport、WebXR 等。浏览器把 API 分两档：DOM 操作、fetch、CSS 动画这类常规能力哪都能用；强能力被圈进安全上下文才开放。
-->

---

# 混合内容：可升级 vs 可阻断

HTTPS 页面里的 `http:` 子资源——可被窥探，更可被替换

<v-click>

| 类别 | 覆盖的资源 | 浏览器行为 |
| --- | --- | --- |
| **可升级 upgradable** | `<img src>`（不含 srcset）、CSS 图像、`<audio src>`、`<video src>`、`<source>` | **自动改写为 https 重试**；服务器不支持则加载失败 |
| **可阻断 blockable** | `<script>`、样式表、`<iframe>`、`fetch`/XHR、非图像类 CSS `url()`（字体等）、`srcset`/`<picture>`，以及**一切新类型** | **直接阻断，不发请求** |

</v-click>

<v-click>

> 这是一次**换代**：旧模型「主动内容拦、被动内容仅警告」已退场——**HTTPS 页面里不存在「还能明文加载」的子资源：要么被升级、要么被拦**，别再背「图片只是警告」。

</v-click>

<!--
明文资源在路上可被窥探（泄露用户在看什么），更糟的是可被替换——尤其是脚本或样式时等于把页面控制权交给中间人。新规范把旧「被动/可选阻断」清单平移成了「可升级」，所有新增资源类型一律归入可阻断。
-->

---

# 两个边界与迁移利器

IP 主机不升级、直接拦

<v-click>

- **IP 直连例外**：`http://example.com/a.png` 会升级，`http://93.184.215.14/a.png` **直接阻断**——IP 直连大概率是内网设备，盲升 https 只会换一种失败；正规出口走 **LNA 权限**（第六章）
- **混合下载**：HTTPS 页面里指向 http 的下载同样被视为风险处置

</v-click>

<v-click>

```http
# 一键升级：本页所有 http 子请求（含可阻断类：脚本、iframe、fetch…）发出前统一改写为 https
Content-Security-Policy: upgrade-insecure-requests
```

- 比默认行为更进一步——默认只升「可升级类」，该指令**连可阻断类一起升**；存量 http 链接多的老站迁移利器
- 它只管**本页面的子请求**，不管别人链到你的 http 入口（那是 HSTS 的活，归网络章）
- **`block-all-mixed-content` 已废弃**：升级语义成为默认后失去意义——存量配置见到可删

</v-click>

<!--
「混合内容要配 block-all-mixed-content」是旧认知，MDN 明确建议不再使用。IP 例外与 LNA 的联动在下一章有正式出口：权限授予后对本地目标放宽混合内容检查。
-->

---

# DevTools 排查与 HTTPS 化自查清单

老站切 HTTPS，按序过一遍

<v-click>

- **Console**：升级类打印「…has been upgraded」；阻断类打印「…has been blocked」
- **Network**：升级成功的资源 URL 已是 `https://`；被拦请求标 `(blocked:mixed-content)`

</v-click>

<v-click>

1. 全站扫 `http://` 库存：模板、数据库富文本、CSS（重点 `@font-face`、`background-image`）
2. 能改的显式改 `https://`；数量太大改不动的，上 `upgrade-insecure-requests` 兜底
3. 确认第三方资源都支持 HTTPS；IP 直连的内网/设备请求单独走 LNA
4. 用 Report-Only 型 CSP 收残余违规（报告里混着 http 的就是漏网之鱼），再收口
5. 最后配 HSTS 锁死回退路径（归网络章）

</v-click>

<!--
可升级类升不上去等于坏图，可阻断类直接功能缺失——切 HTTPS 前把第三方资源的 https 支持核一遍。地址栏锁形图标变化也是线索；上线前可用爬虫类工具全站扫 http:// 引用。
-->

---
layout: section
---

# 第六章：能力与元数据防护

Permissions Policy · Local Network Access · Fetch Metadata

---

# Permissions Policy：能力的授权目录

CSP 管「什么代码能跑」，它管「跑起来的代码能用什么能力」

<v-click>

- 由 **Feature Policy** 更名而来；核心价值有二：给自己**削权**（哪怕被 XSS，注入代码也调不动摄像头）、给嵌进来的第三方 **限权**（广告 iframe 别想读定位）

</v-click>

<v-click>

```http
# 结构：指令=(allowlist)，逗号分隔多指令
Permissions-Policy: camera=(), microphone=()
# 全站禁摄像头/麦克风：getUserMedia 直接拒绝 NotAllowedError

Permissions-Policy: geolocation=(self "https://map.partner.example")
# 定位：本源 + 指定伙伴源可用；头里的具体源要带引号

Permissions-Policy: fullscreen=*
# 全屏：任何上下文（含所有 iframe）可用
```

</v-click>

<!--
常用指令：camera、microphone、geolocation、fullscreen、autoplay、display-capture、payment、usb、web-share、picture-in-picture、screen-wake-lock 等。旧 API document.featurePolicy 仍在一些浏览器里残留。
-->

---

# allowlist 语法与隐式默认

不发头 ≠ 不设防——每个指令有隐式默认 allowlist

<v-click>

| 值 | 语义 |
| --- | --- |
| `*` | 所有文档与 iframe，无论来源 |
| `()` | 空列表 = 彻底禁用（`allow` 属性里写 `'none'`） |
| `self` | 当前文档 + 同源 iframe |
| `src` | 仅 `allow` 属性可用：与 `src` 同源即放行——**`allow` 默认值** |
| `"https://a.example.com"` | 指定源——头里带引号，`allow` 里不带 |
| `"https://*.example.com"` | 通配子域——**不匹配裸域** |

</v-click>

<v-click>

- 多数强能力默认 `self`：不发头时**同源能用、跨源 iframe 不能用**——「地图 iframe 定位失效」的由来

</v-click>

<!--
隐式默认 allowlist 是 * 还是 self 因指令而异，多数强能力是 self。头自身在 MDN 标注为 not Baseline——指令支持度参差（Chromium 最全），关键路径别只依赖它，当纵深里的一层。
-->

---

# 双通道叠加：响应头 × iframe allow 属性

跨源 iframe 要用某能力，必须两道闸都开

```html
<!-- 通道二：iframe allow 属性——把授权显式委托给这个 frame -->
<iframe src="https://trusted-ad.example/widget" allow="geolocation"></iframe>

<!-- 多能力用分号分隔 -->
<iframe src="https://player.example/embed"
        allow="fullscreen; autoplay; picture-in-picture"></iframe>
```

<v-click>

- 通道一是顶层响应头：`Permissions-Policy: geolocation=(self "https://trusted-ad.example")`——就算 `allow` 写了，头里没放行这个源照样禁，**两道闸取交集**
- 规则一句话：**每一层只能收窄、不能放大**——iframe 拿不到顶层没有的授权，孙 frame 拿不到父 frame 没委托的授权
- 配错的症状不是弹权限框，而是 API **直接拒绝**：`getUserMedia` 抛 `NotAllowedError`、`requestFullscreen` 抛 `TypeError`——用户看到「按钮点了没反应」

</v-click>

<!--
违规观测：Permissions-Policy-Report-Only 头 + report-to=端点（配 Reporting-Endpoints），报告类型 permissions-policy-violation，含 featureId/sourceFile/lineNumber；页内可用 ReportingObserver 实时订阅。
-->

---

# Local Network Access：公网页面打内网，先过权限

你的浏览器就在内网里，是天然的跳板

<v-click>

- 长期盲区：公网页面可以直接 `fetch("http://192.168.0.1/…")`
- 经典攻击链：诱导访问恶意页 → 页面向路由器管理接口发 **CSRF** 请求（默认密码常年不改）→ 改 DNS 配置 → 此后所有流量被劫持
- 打印机、NAS、IoT 设备、本机 `localhost` 调试服务同理

</v-click>

<v-click>

- 一代方案 **PNA（Private Network Access）**走 CORS 预检：目标设备用 `Access-Control-Allow-Private-Network: true` 显式同意——「要全网内网设备升级固件」不现实，**已搁置**
- 现行方案 **LNA（Local Network Access）**：把决定权交给用户——**权限提示**

</v-click>

<!--
「公网页面 fetch 内网设备，配好 CORS 就行」是旧认知。LNA 原名 Private Network Access，方案从预检换成了权限提示，名字也从 PNA 换成了 LNA。
-->

---

# LNA 现行模型

Chrome 142（2025-10）正式落地

<v-click>

| 要素 | 内容 |
| --- | --- |
| 地址三分 | **public** / **local**（RFC1918 + 链路本地 + IPv6 ULA）/ **loopback**（`127.0.0.0/8`、`::1`、localhost） |
| 触发 | 公网页面请求 local/loopback 目标（子资源、`fetch`、子 frame 导航、WebSocket…） |
| 权限 | **`local-network`** 与 **`loopback-network`** 两枚；首次触发弹**权限提示**，拒绝则请求失败 |
| 门槛 | **仅安全上下文**：http 公网页打内网**直接失败**，连提示都没有 |
| 委托 | 集成 Permissions Policy，默认 `self`；跨源 iframe 需 `allow="local-network"` |
| 落地 | Chrome 138 起 flag 试用 → **Chrome 142（2025-10）正式启用**；Firefox/Safari 跟进中 |

</v-click>

<!--
local 段包括 192.168.0.0/16、10.0.0.0/8 等 RFC1918、链路本地 169.254/16、IPv6 fc00::/7 与 fe80::/10。旧权限名 local-network-access 作兼容别名。企业可用策略预授/预禁。2026 年做跨浏览器产品仍需查 BCD/caniuse。
-->

---

# LNA：开发者侧的三个动作

升级 Chrome 142 后「突然要弹权限」不是 bug，是新常态

```js
// 1. 探测权限状态，提前引导用户（而不是等请求静默失败）
const st = await navigator.permissions.query({ name: "local-network" });
if (st.state !== "granted") showSetupGuide();

// 2. 公网域名解析到内网 IP 时，显式声明目标地址空间
//    （IP 字面量与 .local 域浏览器能在 DNS 前识别，可省略）
fetch("http://printer.corp.example/status", { targetAddressSpace: "local" });

// 3. 本机服务同理
fetch("http://localhost:8888/api", { targetAddressSpace: "loopback" });
```

<v-click>

- 混合内容联动：内网设备几乎拿不到公网可信的 TLS 证书——**权限授予后对本地目标放宽混合内容检查**，HTTPS 页面得以合法访问 `http://192.168.0.1`（补上第五章「IP 拦而不升」的正规出口）
- 受影响的典型业务：设备配网页、内网管理台、跨域打 localhost 的开发工具

</v-click>

<!--
targetAddressSpace 用于「公网域名解析到内网 IP」的场景——浏览器在 DNS 解析前无法识别这类目标，需要显式声明；IP 字面量与 .local 域可以省略。
-->

---

# Fetch Metadata：把请求来源如实告诉服务端

四个 `Sec-` 头随每个 HTTPS 请求自动附上——脚本改不了、伪造不了

<v-click>

| 头 | 取值 | 含义 |
| --- | --- | --- |
| **`Sec-Fetch-Site`** | `same-origin` / `same-site` / `cross-site` / `none` | 源关系；**`none` = 用户直接发起** |
| **`Sec-Fetch-Mode`** | `navigate` / `cors` / `no-cors`… | 请求模式；`navigate` = 页面导航 |
| **`Sec-Fetch-Dest`** | `document` / `iframe` / `script` / `empty`… | 数据的去处（`empty` ≈ fetch/XHR） |
| **`Sec-Fetch-User`** | 仅 `?1` | 仅出现在**用户手势触发**的导航上 |

</v-click>

<v-click>

- **Baseline Widely available（2023-03 起全浏览器）**——服务端可放心依赖

</v-click>

<!--
前面各章都是浏览器侧拦截，Fetch Metadata 反过来武装服务端。Sec-Fetch-Site: none 的场景是地址栏输入、书签、拖放等用户直接发起的请求；Sec-Fetch-Dest 还有 style、image 等取值。DevTools → Network → 任一请求的 Request Headers 里可直接观察这四个头。「CSRF 防御只能靠 token」是旧认知：Sec-Fetch-* 已可让服务端一个 if 拒掉跨站流量，与 token 叠加。
-->

---

# 资源隔离策略：服务端一个 if

把「不该跨站来的流量」挡在业务逻辑之前

```js
// 资源隔离策略（伪码）：跨站流量默认拒绝，白放导航类顶层请求
function isRequestAllowed(req) {
  const site = req.headers["sec-fetch-site"];
  const mode = req.headers["sec-fetch-mode"];
  const dest = req.headers["sec-fetch-dest"];

  if (site === undefined) return true; // 老客户端没有该头：放行（渐进增强）
  if (site === "same-origin" || site === "same-site" || site === "none")
    return true; // 自己人 / 用户直接输入：放行
  if (mode === "navigate" && req.method === "GET" && dest !== "object" && dest !== "embed")
    return true; // 跨站的顶层导航（别人链接到我）：放行
  return false; // 其余跨站子资源/接口请求：403
}
```

<v-click>

- 这一个 if 同时压制 **CSRF**、跨站的**资源盗链**与部分 **XS-Leaks** 探测
- 对不发头的老客户端按「放行 + 走既有 CSRF token 防线」渐进兼容

</v-click>

<!--
在框架中间件里加这一段即可整体生效。攻击原理归安全章；这里的要点是浏览器已经把请求来源如实告诉你了，别浪费。
-->

---

# 安全响应头总表：一行头换一道防线

部署清单，配齐再上线

<v-click>

| 响应头 | 一句话 |
| --- | --- |
| `Content-Security-Policy` | 代码与资源白名单；`frame-ancestors` 防点击劫持 |
| `X-Frame-Options` | 上一条的遗留兜底（DENY / SAMEORIGIN） |
| `Permissions-Policy` | 强能力授权目录 |
| `X-Content-Type-Options` | `nosniff` 禁 MIME 嗅探，助 CORB/ORB |
| `Integrity-Policy` | 强制子资源带 integrity |
| `Reporting-Endpoints` | 各类违规报告的具名端点 |
| `Referrer-Policy` · HSTS · COOP/COEP/CORP | `Referer` 泄露控制 · 强制 HTTPS · 跨源隔离（归网络章） |

</v-click>

<!--
CSP、Permissions-Policy、Integrity-Policy 均有 -Report-Only 变体，先观测再强制。HSTS 即 Strict-Transport-Security。Sec-Fetch-* 是请求头不在此列，但它是服务端隔离的依据。Referrer-Policy 一句话到此为止：控制 Referer 头泄露多少 URL，细节在网络章 HTTP 头部；COOP/COEP/CORP 是 opt-in 跨源隔离三件套，配置归网络章 SameSite 与跨源隔离。
-->

---
layout: center
class: text-center
---

# 小结

六道常开防线，大多一行响应头就常年值守

<v-click>

- **CSP 基础**：指令四类、`default-src` 兜底；nonce/hash 放行内联，拒绝 `unsafe-*`；Report-Only → 强制，`report-to` 换代 `report-uri`
- **防注入三件套**：strict CSP（nonce/hash + `'strict-dynamic'` + `object-src`/`base-uri 'none'`）· Trusted Types（Baseline 2026-02）· SRI（integrity + crossorigin）
- **沙箱与隔离**：四层纵深、唯一可靠边界是进程；Spectre 三板斧；CORB→ORB 拦数据进敌营
- **嵌入防线**：sandbox 默认全禁 + token 白名单，牢记同源逃逸组合；frame-ancestors 换代 XFO
- **传输底线**：强能力只在安全上下文开放（isSecureContext）；混合内容可升级 vs 可阻断，IP 拦而不升
- **能力与元数据**：Permissions Policy 双通道取交集；LNA（Chrome 142）权限化内网访问；`Sec-Fetch-*` 服务端一个 if

</v-click>

<v-click>

> 防线以「拒绝」表达自己——配错的症状是页面坏了，Console 与违规报告会告诉你为什么。

</v-click>

<!--
六章收束。跨源读取规则在网络章跨源与 CORS，XSS/CSRF 攻击手法与鉴权体系归安全章，站点隔离的进程模型细节在浏览器架构——本章只从防御视角接续。
-->

---
layout: center
class: text-center
---

# 谢谢

浏览器安全 · 六道常开防线

<div class="mt-8 text-gray-400">
基于 Web 现代标准 · 面向前端工程师
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/base/browser/browser-security/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
全章覆盖 CSP 基础、防注入三件套、沙箱与隔离防御、iframe sandbox 与点击劫持、安全上下文与混合内容、能力与元数据防护。配套笔记见文档图标链接。感谢观看。
-->
