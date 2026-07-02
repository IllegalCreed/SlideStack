---
theme: seriph
background: https://cover.sli.dev
title: 浏览器存储
info: |
  浏览器存储 —— 六机制选型矩阵、Cookie 的浏览器侧、Web Storage 隔离模型、IndexedDB 与 OPFS、配额与驱逐、存储分区与 Storage Buckets
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:data-base class="text-8xl" />
</div>

<br/>

## 浏览器存储

Cookie、Web Storage、IndexedDB、Cache API、OPFS 六机制并存：数据放哪、能存多大、何时被清、谁看得见

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
前端的数据从来不是「存进 localStorage」一句话的事：六种机制并存，容量从单条 4KB 到数百 GB 差着五六个数量级，生命周期从「关标签页即焚」到「用户手动清除才消失」，有的还要随每个 HTTP 请求上行。本章讲浏览器视角下的存储模型，回答「这份数据该放哪」的选型题，而不是逐个教 API。
-->

---
transition: fade-out
---

# 这一章讲什么

一条主线：**数据存在哪、能存多大、什么时候会被清、源与站点之间如何隔离**

<v-click>

- **存储全景与选型矩阵**：六机制五维对比、web.dev 三首选立场、决策清单与反模式
- **Cookie 的浏览器侧**：document.cookie 怪癖、单条 ~4KB、随请求发送的代价、HttpOnly
- **Web Storage 存储模型**：源隔离 vs 标签页 + 源、同步阻塞、storage 事件、无痕退化
- **IndexedDB 定位与 OPFS**：事务型对象库、结构化克隆、同步访问句柄与 SQLite-wasm
- **配额与驱逐**：estimate()/persist()、各浏览器配额数值、LRU 整源驱逐、Safari ITP 7 天
- **存储分区与 Storage Buckets**：双键分区、嵌入组件影响、一源多桶独立驱逐

</v-click>

<v-click>

> **配额（能存多大）· 驱逐（何时被清）· 隔离（谁看得见）** —— 三条硬约束贯穿全章。

</v-click>

<!--
本章讲存储模型而不是 API 教程：localStorage/IndexedDB 的完整用法归 Web API 章，Set-Cookie 协议语义归网络章，Cache API 与 Service Worker 实战归浏览器缓存叶。六个主题依次推进，每条硬约束都能让「能跑的代码」变成线上事故。
-->

---
layout: section
---

# 存储全景与选型矩阵

六种机制，一套心智

---

# 六种机制：先认脸，再深交

浏览器能持久化数据的地方一字排开

<v-click>

| 机制 | 一句话定位 | 典型容量 |
| --- | --- | --- |
| **Cookie** | 服务端要看的小段状态，随请求自动回传 | 单条 ~4KB |
| **localStorage** | 按源持久的同步键值串 | ~5 MiB/源 |
| **sessionStorage** | 按「标签页 + 源」的一次性键值串 | ~5 MiB/源 |
| **IndexedDB** | 异步事务型对象数据库，存结构化大数据 | 共享源配额（GB 级） |
| **Cache API** | 按请求/响应对缓存网络资源 | 共享源配额 |
| **OPFS** | 源私有文件系统，字节级读写 | 共享源配额 |

</v-click>

<v-click>

> 六种机制不是演进替代，而是**分工关系** —— 一个应用同时用上四五种是常态。

</v-click>

<!--
Cookie 解决「服务端识别状态」，Web Storage 解决「页面级少量键值」，后三者是客户端真正的数据层。物理上它们全部落在浏览器接管的用户资料目录里，由浏览器统一记账、统一回收——页面代码永远只面对逻辑接口，摸不到真实文件。
-->

---

# 三个高频误会，先破为敬

名字像，不等于是一回事

<v-click>

- **session Cookie ≠ sessionStorage**：前者是「不设过期时间的 Cookie」，随**浏览器会话**；后者随**单个标签页**的页面会话——隔离单位完全不同
- **无痕模式 ≠ 没有存储**：六种 API 全部可用，只是配额缩水、关窗全清——离线功能要检测并降级，而不是假设它不存在
- **「两个标签页数据不同步」**：十有八九是把 sessionStorage 当成了 localStorage——前者每个标签页各一份，天生不同步

</v-click>

<v-click>

> 页面只见逻辑接口、摸不到真实文件 —— **配额**与**驱逐**因此都是浏览器说了算。

</v-click>

<!--
这三个误会全都来自命名与直觉的错位。数据都在浏览器接管的 profile 目录里，Firefox 的配额甚至按 profile 所在磁盘计算。这个设计决定了本章的两大主题：配额是浏览器记的账，驱逐是浏览器行使的回收权。
-->

---

# 五维对比（一）：数据形态与生命周期

存什么形状的数据、活多久

<v-click>

| 机制 | 数据形态 | 生命周期 |
| --- | --- | --- |
| Cookie | 字符串（名=值） | 到期时间 / 会话 Cookie |
| localStorage | 仅字符串 | 持久（手动清除/驱逐前） |
| sessionStorage | 仅字符串 | **标签页会话**（关标签页即清） |
| IndexedDB | **结构化克隆**支持的任意对象 | 持久（受驱逐） |
| Cache API | Request/Response 对 | 持久（受驱逐） |
| OPFS | 文件（字节流） | 持久（受驱逐） |

</v-click>

<v-click>

> 没有一种是「永久」：**「持久」只是「没到期时间」，不是「保证不丢」** —— 想要承诺得调 `navigator.storage.persist()`。

</v-click>

<!--
sessionStorage 最短命：关标签页即销毁，但刷新与恢复不算关闭。Cookie 由 Expires/Max-Age 决定。名义持久的四种都排在浏览器的驱逐队列里：存储压力下按 LRU 整源清除，Safari 还有 7 天 ITP 清库。
-->

---

# 五维对比（二）：同步、随请求、Worker

选型第一刀切在同步/异步

<v-click>

| 机制 | 同步/异步 | 随请求发送 | Worker 可达 |
| --- | --- | --- | --- |
| Cookie | 同步（`document.cookie`） | **是（自动上行）** | 否 ① |
| localStorage | **同步阻塞** | 否 | **否** |
| sessionStorage | **同步阻塞** | 否 | **否** |
| IndexedDB | 异步 | 否 | **是** |
| Cache API | 异步（Promise） | 否 | **是**（SW 核心） |
| OPFS | 异步 + Worker 内**同步句柄** | 否 | **是** |

</v-click>

<v-click>

- ① 异步的 Cookie Store API 可在 SW 读写 Cookie（Baseline newly available，用前特性检测）
- 「随请求发送」只属于 Cookie：**存进去的每个字节都要乘以请求数**——这是它不当存储用的原罪

</v-click>

<!--
同步 API 调用期间主线程停摆：数据小无感，数据一大就是实打实的卡顿。异步阵营读写不挡渲染，还能整体搬进 Worker。容量列藏着两套账本：Web Storage 独立 5 MiB 小池子，IndexedDB/Cache/OPFS 共用源级大配额——「localStorage 满了」不等于「这个源没空间了」。
-->

---

# web.dev 官方立场：三首选，两别用

《Storage for the web》给出的现代选型基线

<v-click>

| 数据 | 官方推荐 | 理由 |
| --- | --- | --- |
| 加载应用所需的网络资源 | **Cache API** | Service Worker 离线体系一部分，异步 |
| 文件类内容 | **OPFS** | 字节级高性能读写，异步 + Worker 同步句柄 |
| 其余数据 | **IndexedDB**（配 `idb` 包装） | 异步、容量大、Worker 可用 |

</v-click>

<v-click>

- **localStorage / sessionStorage**：同步阻塞、~5 MiB、仅字符串——「应避免」（legacy 小偏好除外）
- **Cookie**：随请求发送，**不当存储用**
- **File System Access API**（带选择器弹窗那套）：**仅 Chromium**，不作跨浏览器存储方案——注意与 Baseline 的 OPFS 区分

</v-click>

<v-click>

> 三首选全是**异步阵营**：不阻塞主线程，window / Worker / Service Worker 全可用。

</v-click>

<!--
这是本章采用的基线立场。三首选都异步、都走共享源配额、Worker 全可达。用户可见的 File System Access API 是「替用户管他的文件」，与源私有的 OPFS 是两回事，后面 OPFS 一节还会对比。
-->

---

# 日常工程决策清单

这份数据该放哪，一行一个答案

<v-click>

| 你要存的 | 放哪 | 一句话理由 |
| --- | --- | --- |
| 会话凭证 | **HttpOnly Cookie** | 唯一 JS 读不到的存储，XSS 偷不走 |
| 主题、语言、折叠状态 | localStorage | 小、简单、够用 |
| 当前标签页的向导步骤/草稿 | sessionStorage | 「关页即焚」+ 多标签互不干扰 |
| 接口数据缓存、离线业务数据 | IndexedDB | 结构化、量大、异步 |
| 静态资源/页面离线 | Cache API | 与 Service Worker 配套 |
| 用户导出文件、wasm 数据库 | OPFS | 文件语义 + 高性能句柄 |

</v-click>

<v-click>

> 第三方 iframe 里的状态：任选，但**预期被分区** —— 同一 widget 嵌不同宿主站互不相通。

</v-click>

<!--
判断 Cookie 的标准只有一条：这份数据服务端每次请求都需要看吗？是，才配进 Cookie，通常就是一个会话标识。其余按数据形状与生命周期对号入座。分区的细节在最后一章展开。
-->

---

# 反模式对照：矩阵反着用就是事故清单

症状你多半见过

<v-click>

| 反模式 | 症状 | 纠正 |
| --- | --- | --- |
| token 放 localStorage | 一次 XSS 整锅端走 | HttpOnly Cookie |
| 接口缓存塞 localStorage | 主线程卡顿 + 5 MiB 天花板 | IndexedDB（异步、GB 级） |
| 用户偏好塞 Cookie | 全站每个请求变胖 | localStorage |
| 跨标签页同步靠轮询 localStorage | 白耗 CPU | storage 事件 |
| 把本地存储当唯一副本 | Safari 7 天清库后数据蒸发 | 服务端为源、本地当缓存 |
| sessionStorage 存跨标签页共享态 | 登录态「时有时无」 | localStorage（或服务端会话） |

</v-click>

<v-click>

> 超限没接住 = 保存静默失败：**写本地存储要按「可能失败的 I/O」对待，不是内存赋值。**

</v-click>

<!--
每条反模式都是选型矩阵的某一列被无视的结果。补一条：离线静态资源存 IndexedDB 是手搓 Cache API 已有的能力，应交给 Cache API + Service Worker。超限报错三张脸在配额一章展开：Web Storage 同步抛、IndexedDB 事务 onabort、Cache API reject。
-->

---
layout: section
---

# Cookie 的浏览器侧

六机制里最老的那位，怪癖也最多

---

# document.cookie：伪装成字符串的访问器

长得像普通属性，实际是原生 getter/setter

<v-click>

```js
// 读：拿到的是「当前文档可见的所有 Cookie」拼成的一根字符串
console.log(document.cookie);
// "theme=dark; lang=zh-CN"（分号+空格分隔的名值对）

// 写：一次赋值 = 新增/更新【一条】Cookie，不会覆盖其他条
document.cookie = "theme=light; max-age=31536000; path=/";
// 再读，theme 变了，lang 还在
```

</v-click>

<v-click>

- 读和写走的是**两条完全不同的路**——写进去的格式和读出来的格式不一样
- 这个访问器设定，解释了它几乎所有的怪癖

</v-click>

<!--
document.cookie 是原生 getter/setter：读返回所有匹配 Cookie 的名值对拼串，写则是「新增或更新一条」。属性怎么填（path/domain/max-age/samesite）属于 Set-Cookie 语义，归网络章的 Cookie 与会话管理。
-->

---

# 读的三个坑

`document.cookie` 返回的比你以为的少得多

<v-click>

- **只有名和值**：Domain、Path、Expires、Secure……任何属性都读不出来——想知道「这条什么时候过期」？浏览器侧没有 API 能回答（DevTools 才看得到）
- **HttpOnly 完全隐身**：带 `HttpOnly` 的 Cookie 不出现在返回值里——不是缺陷而是设计，让会话凭证对 XSS 注入的脚本不可见
- **解析要自己来**：拿到一根 `"a=1; b=2"`，取单个值得自己 `split("; ")` 再找——这门「祖传手艺」是 Cookie 作为存储体验糟糕的日常注脚

</v-click>

<!--
读出来的是一整根字符串，所有匹配 Cookie 的名值对。任何属性一概不可见，HttpOnly 的连名值都不出现。想看全貌只有 DevTools 的 Application 面板。
-->

---

# 写的三个坑

写失败不报错，是 Cookie 排查难的根源

<v-click>

- **一次一条**：想设三条 Cookie 就要赋值三次；把多条拼进一次赋值，后面的会被当成第一条的属性
- **静默失败**：给非当前文档域写 Cookie、`http:` 页面写 `Secure` Cookie、违反 `__Host-` 前缀约束——统统**不抛错、不生效**
- **编码自理**：值里的分号、逗号、空白会破坏整根字符串格式——规范做法 `document.cookie = "k=" + encodeURIComponent(value)`

</v-click>

<v-click>

> 删除 = 写一条同名、过期时间在过去的 Cookie（`max-age=0`）——属性 path/domain 要与原 Cookie 一致才能命中。

</v-click>

<!--
线上「Cookie 怎么没写进去」的排查，第一步永远是打开 DevTools 看真相——因为写入失败静默无报错。删除也是「写」的一种：同名、过期时间设为过去。
-->

---

# 名字里的约束：Cookie 前缀

由浏览器在写入时强制校验，不满足同样静默失败

<v-click>

| 前缀 | 浏览器强制的写入约束 |
| --- | --- |
| `__Secure-` | 必须 HTTPS 且带 `Secure` |
| `__Host-` | 必须 HTTPS + `Secure`，**不得设 `Domain`**、`Path` 必须 `/`——锁死单主机 |
| `__Http-` | 必须 `HttpOnly`——从名字宣告「JS 写不了」（较新，注意兼容性） |
| `__Host-Http-` | 上两者约束合体 |

</v-click>

<v-click>

- 对前端的实际意义：看到 `__Http-` 开头的名字**连试都不用试**——它只可能来自服务端 `Set-Cookie`
- 前缀的安全语义归网络章，这里只记「写入约束由浏览器侧执行」

</v-click>

<!--
前缀校验发生在浏览器写入时，所以它属于浏览器侧知识。__Http- 前缀的 Cookie，document.cookie 与 Cookie Store API 都设不动。
-->

---

# 容量与条数：全场最低的天花板

RFC 6265 §6.1 对实现的最低要求

<v-click>

| 限制 | RFC 6265 下限 | 工程记忆 |
| --- | --- | --- |
| 单条大小 | 至少 **4096 字节**（名+值+属性合计） | 单条 ~4KB |
| 每域条数 | 至少 **50 条** | 每域几十条起步 |
| 总条数 | 至少 **3000 条** | —— |

</v-click>

<v-click>

- 各浏览器实际上限围绕这些下限浮动（每域几十到几百条不等）
- 超限行为同样不友好：新 Cookie 被丢弃或挤掉旧的，**静默无报错**

</v-click>

<!--
单条 4KB、每域几十条——这是六种存储机制里最小的天花板。它只该装「服务端每个请求都要看的最小状态」。
-->

---

# 随请求自动发送：每个字节都乘以请求数

Cookie 是发给服务器的信头，不是存给自己的数据

<v-click>

- 每个匹配 Domain/Path/SameSite 规则的 HTTP 请求——HTML、JS、CSS、图片、XHR/fetch——都自动带上 `Cookie` 请求头
- 算笔账：Cookie 总量 4KB × 页面加载 50 个同源请求 = 仅上行就多出 **200KB**——且上行带宽通常远小于下行

</v-click>

<v-click>

> web.dev 的立场很干脆：「存的东西一多，每个 Web 请求的体积都会显著增大」—— **Cookie 不当存储用**。

</v-click>

<v-click>

- 判断标准只有一条：**这份数据服务端每次请求都需要看吗？** 是，才配进 Cookie——通常就是一个会话标识

</v-click>

<!--
随请求自动发送是 Cookie 与其他五种存储的本质区别：既是它作为会话凭证载体的价值，也是它作为存储的原罪。
-->

---

# HttpOnly：唯一 JS 读不到的存储位

把六种机制当候选存储位横向看

<v-click>

| 存储位 | 页面里的 JS 能读吗 | XSS 后果 |
| --- | --- | --- |
| localStorage / sessionStorage | 能 | 注入脚本同样能读 |
| IndexedDB / Cache API / OPFS | 能 | 同上 |
| **HttpOnly Cookie** | **不能**（Cookie Store API 也拿不到） | 偷不走，浏览器照常随请求回传 |

</v-click>

<v-click>

> 「token 别放 localStorage」的存储视角解释就一句话：**放得进 JS 读得到的地方，就偷得走** —— 会话凭证应放 HttpOnly Cookie（配 `Secure` + `SameSite`）。

</v-click>

<!--
一旦有 XSS，注入脚本与你的代码同权：五种 JS 可读的存储全部沦陷。HttpOnly Cookie 是唯一对 JS 不可见、又能随请求回传服务端的存储位。攻防细节归安全主题与网络章，此处只立结论。
-->

---

# Cookie Store API 与排查姿势

同步的 document.cookie，有一个迟到的异步替代

<v-click>

- `document.cookie` 的隐性成本：**同步**——Cookie 由浏览器统一管理，同步读取可能意味着跨进程等待
- **Cookie Store API**：`cookieStore.get()/set()/delete()`，Promise 风格，**Service Worker 里也能用**（`document.cookie` 在 Worker 里根本不存在）
- 方向是对的，但各引擎支持进度不一——跨浏览器项目**用前查兼容性表**

</v-click>

<v-click>

排查主场是 DevTools（Application → Cookies）——JS 读不到属性、写失败又不报错：

- 「写了没生效」→ 面板里根本没出现：域不匹配、`http:` 页面写 `Secure`、违反前缀约束
- 「JS 读不到但请求里有」→ 该条的 **HttpOnly 列打了勾**：一切正常，本来就不该读到

</v-click>

<!--
DevTools 是 Cookie 的唯一全知视角：Domain/Path/Expires/Secure/HttpOnly/SameSite/Partitioned 全部可见，还能单条删除、按域过滤。Cookie Store API 的完整用法属 Web API 章。
-->

---

# 浏览器侧小抄

读、写、删三件套

<v-click>

```js
/** 读单个 Cookie（祖传手艺版） */
function getCookie(name) {
  // document.cookie 形如 "a=1; b=2"，按分隔符拆开逐条匹配
  const hit = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : undefined;
}

/** 写：值编码 + 常用属性；一次只能写一条 */
const v = encodeURIComponent("你好; world");
document.cookie = `draft=${v}; max-age=86400; path=/; samesite=lax`;

/** 删：同名 + 过期时间设为过去 */
document.cookie = "draft=; max-age=0; path=/";
```

</v-click>

<!--
三段小抄对应读的坑（解析自己来）、写的坑（编码自理、一次一条）、删的姿势（max-age=0，path/domain 与原 Cookie 一致）。
-->

---
layout: section
---

# Web Storage 存储模型

一套 API，两种隔离

---

# 一套 API，两种隔离模型

方法完全一致（getItem/setItem/removeItem/clear），要背的是这张表

<v-click>

| | localStorage | sessionStorage |
| --- | --- | --- |
| **隔离键** | 源（scheme + host + port） | **标签页 + 源** |
| **同源两个标签页** | 共享同一份 | **各一份，互不可见** |
| **生命周期** | 持久（手动清除/驱逐前一直在） | 页面会话：关标签页/窗口即清 |
| **刷新 / 恢复标签页** | 在 | **在**（页面会话跨刷新与恢复存活） |
| **浏览器重启** | 在 | 不在 |

</v-click>

<v-click>

> **页面会话（page session）**比直觉更顽强：刷新不清、崩溃恢复不清——适合存「防误刷新丢失」的表单草稿；但关标签页必清。

</v-click>

<!--
MDN 对页面会话的定义：文档加载进某个标签页时创建、只对该标签页可见。「两个标签页数据不同步」的排查，第一步就是确认用的是哪兄弟。
-->

---

# sessionStorage 的复制规则：与 noopener 的纠缠

新标签页的 sessionStorage 并非必然空白

<v-click>

- MDN 规则：**若新页面拥有 `opener`，其 sessionStorage 初始是 opener 那份的拷贝**——拷贝完成后两份完全独立，互改不影响
- 想阻止这次拷贝：任何断开 opener 的手段——`rel="noopener"`、`window.open(url, "_blank", "noopener")`

</v-click>

<v-click>

工程含义：

- 把敏感临时态放 sessionStorage、又允许页面开新窗 → 要意识到**数据会被带进新标签页**
- 指望「新标签页自动继承会话态」的设计，在 noopener 链接下**会失灵**——这也是它与会话 Cookie 的行为差异点

</v-click>

<!--
从页面 A 点开新标签页 B 时，若 B 拥有 opener，B 的 sessionStorage 初始是 A 那份的拷贝。这条规则双向都有坑：敏感数据会被带走，继承依赖会被 noopener 打断。
-->

---

# 同步 + 仅字符串：两条先天限制

每次 getItem/setItem 都在主线程上同步执行

<v-click>

```js
// 写：对象必须手动序列化
localStorage.setItem("prefs", JSON.stringify({ theme: "dark", fontSize: 14 }));

// 读：手动反序列化 + 防御空值
const prefs = JSON.parse(localStorage.getItem("prefs") ?? "{}");
```

</v-click>

<v-click>

- JSON 的语义损耗：`Date` 变字符串、`Map`/`Set` 变空对象、`undefined` 丢失、`Blob`/`ArrayBuffer` 根本存不了——保形数据归 IndexedDB 的结构化克隆管
- 大数据 + 同步读写 + `JSON.parse` = 主线程实打实的卡顿——MDN 明示：大数据量、性能敏感，改用**异步的 IndexedDB**

</v-click>

<v-click>

> 省钱姿势：启动时**一次读入内存**、改动再写回；多个键按需读写，**别塞成单个巨型 JSON 键**。

</v-click>

<!--
存个主题偏好无所谓；把几 MB 的接口缓存 JSON 塞进去，每次读写都是主线程上的一次卡顿，低端机上肉眼可见。巨型 JSON 键的问题是每次小改动都要整串重序列化、重解析。
-->

---

# 容量 ~5 MiB 与 QuotaExceededError

localStorage 与 sessionStorage 各 ~5 MiB/源，两个池子独立计

<v-click>

```js
try {
  localStorage.setItem("cache", bigString);
} catch (e) {
  if (e.name === "QuotaExceededError") {
    // 池子满了：清理旧键，或把这类数据迁去 IndexedDB
  }
}
```

</v-click>

<v-click>

- 超限时 `setItem` **同步抛出** `QuotaExceededError`——严谨的写法永远带 try/catch
- 划清边界：**这 5 MiB 与 `navigator.storage.estimate()` 报告的配额是两套体系**——后者管 IndexedDB/Cache API/OPFS 的共享大池子

</v-click>

<!--
MDN 配额页给出的现状：主流浏览器给两兄弟各约 5 MiB。别以为超限是小概率——无痕模式下配额骤减，低磁盘设备上驱逐与超限都是日常。
-->

---

# storage 事件：免费的跨标签页同步

改动会通知同源的其他文档——发起者自己收不到

<v-click>

```js
// 标签页 A：改主题
localStorage.setItem("theme", "dark");

// 标签页 B：收到通知（A 自己不会触发）
window.addEventListener("storage", (e) => {
  // e.key / e.oldValue / e.newValue / e.url / e.storageArea
  if (e.key === "theme") applyTheme(e.newValue);
});
```

</v-click>

<v-click>

- 典型用法：多标签页登出同步（一处 `removeItem("token")`，处处跳登录页）、主题即时生效
- sessionStorage 按标签页隔离 → 它的 storage 事件只可能来自**同一标签页内的其他文档**（如同源 iframe）——跨标签页同步是 localStorage 的专利
- 只想广播、不想真存数据？**`BroadcastChannel` 语义更对**（不用编造键值、不占存储）

</v-click>

<!--
事件对象带全改动上下文：key（clear 时为 null）、oldValue/newValue（新增/删除时相应为 null）、url、storageArea。事件挂在改动的「副作用」上，纯消息广播用 BroadcastChannel。
-->

---

# 退化与拒绝：API 在、数据不在

四种「怎么突然不灵了」的场景

<v-click>

- **无痕/隐私模式**：API 完全可用，但 **localStorage 被当作 sessionStorage 对待**——关无痕窗口全清；别在无痕下承诺任何持久化
- **不透明源**：`data:`/沙箱 iframe 下访问**必抛 `SecurityError`**；`file:` 主流浏览器实测可读写（MDN 措辞「可能」抛）；用户禁站点数据同抛
- **第三方 iframe**：访问的是 **iframe 自己源**的 storage；用户禁三方 Cookie 时**连带被拒**；且现代浏览器已按**顶级站点分区**
- **`<script>` 引入的三方代码**：跑在宿主页面的上下文里，读写的就是**宿主源**的 storage——审计三方脚本要看它碰不碰 storage

</v-click>

<!--
script 与 iframe 的区别值得强调：script 引入的第三方代码从浏览器视角看根本没有「第三方」可言，写的就是宿主源的 storage；iframe 里的代码才是另一个源，而且现代浏览器还会对它分区——最后一章展开。
-->

---
layout: section
---

# IndexedDB 定位与 OPFS

异步大容量阵营

---

# IndexedDB：把「数据库」三个字当真

与 Web Storage 的差距不是容量，是整个范式

<v-click>

| | Web Storage | IndexedDB |
| --- | --- | --- |
| 数据模型 | 扁平键值（仅字符串） | **对象存储 + 索引** |
| 一致性 | 无 | **事务**（readonly / readwrite） |
| 调用方式 | 同步 | **异步**（事件/请求对象） |
| 查询 | 按键取值 | 键、键范围、索引、游标 |
| 容量 | ~5 MiB/源 | 共享源配额（GB 级） |
| Worker | 不可用 | **可用** |

</v-click>

<v-click>

> 三个模型级要点：**异步是底线**（同步版 API 已从规范移除）· **版本化 schema**（库结构在版本升级事件里定义）· **严格同源隔离**。

</v-click>

<!--
IndexedDB 是浏览器里真正意义上的数据库：事务型、按键索引、面向对象存储。「同步用 IndexedDB」这条路根本不存在——规范早期的同步 API 已被移除。
-->

---

# 能存什么：结构化克隆的边界

不需要 JSON，也不丢形——对 Web Storage 的降维打击

<v-click>

| 能直接存（保形） | 存不了 |
| --- | --- |
| 原始值、普通对象、数组 | **函数**（抛 `DataCloneError`） |
| `Date`、`RegExp` | **DOM 节点**（抛 `DataCloneError`） |
| `Map`、`Set` | getter/setter、属性描述符（不保留） |
| `Blob`、`File` | 原型链（类实例取出来是普通对象） |
| `ArrayBuffer`、TypedArray | |

</v-click>

<v-click>

> 工程直觉：接口返回的大数组、含 `Date` 的记录、用户上传的 `File`、二进制缓冲 —— **直接整个丢进去，取出来还是原来的形状**。

</v-click>

<!--
IndexedDB 存值用结构化克隆算法。这正是「结构化数据放 IndexedDB」的底气：不需要 JSON 序列化，Date/Map/Blob 都保形。边界在函数与 DOM 节点，会抛 DataCloneError。
-->

---

# 容量、Worker 与工程姿势

「几 MB 就发愁」的时代到此为止

<v-click>

- **容量**：走 IndexedDB/Cache API/OPFS 共享的**源级配额**——Chrome 单源可达磁盘 60%，动辄几十 GB
- **Worker 全可用**：window、Web Worker、Service Worker 里都有 `indexedDB`——重查询、批量写入、导入导出整体放进 Worker，主线程只收结果
- **API 人体工学**：原生 API 是事件驱动的请求-回调风格，事务、版本、游标全要手写样板——web.dev 建议配 **Promise 包装库 `idb`**

</v-click>

<v-click>

```js
// 同步：这行执行完之前，主线程什么都干不了（含渲染）
localStorage.setItem("bigList", JSON.stringify(hugeArray));

// 异步：读写在后台进行，主线程继续响应用户（idb 包装后的 IndexedDB）
await db.put("lists", hugeArray, "bigList");
```

</v-click>

<!--
方法签名、事务规则、游标细节这些实操内容归 Web API 章，本章点到定位为止。对比代码来自选型矩阵一节：同步写大数据挡渲染，异步阵营不挡。
-->

---

# OPFS：给源一块私有磁盘

Origin Private File System——对用户不可见、无权限弹窗

<v-click>

```js
// OPFS 根目录（FileSystemDirectoryHandle）；需要安全上下文（HTTPS）
const opfsRoot = await navigator.storage.getDirectory();
```

</v-click>

<v-click>

| | File System Access API（用户可见） | **OPFS** |
| --- | --- | --- |
| 用户可见性 | 真实文件系统，用户选文件 | **源私有**，用户看不见 |
| 权限 | `showOpenFilePicker()` + 权限弹窗 | **无任何弹窗** |
| 写入路径 | 临时文件 + 安全检查（慢） | **原地写入（快）** |
| 兼容性 | 仅 Chromium（web.dev 不推荐） | **Baseline**：2023-03 起全浏览器 |

</v-click>

<v-click>

> 两者共用 `FileSystemFileHandle` 这套句柄类型，定位完全不同：前者「替用户管他的文件」，OPFS「给应用一块高性能私有盘」。

</v-click>

<!--
OPFS 是 File System API 里「私有」的那一半：每个源一棵对用户不可见的文件树，入口一行 getDirectory()。别把它与带选择器弹窗的用户可见 API 混为一谈。
-->

---

# 同步访问句柄：Worker 里的高性能王牌

主线程走异步；杀手锏仅 Web Worker 可用

<v-click>

```js
// 仅 Worker 内：创建同步访问句柄（创建这一步本身是异步的）
const handle = await fileHandle.createSyncAccessHandle();

// 之后 read / write / flush / truncate / getSize 全是【同步】调用
const size = handle.getSize();
handle.write(new TextEncoder().encode("追加内容"), { at: size });
handle.flush(); // 确保落盘
handle.close();
```

</v-click>

<v-click>

- 「在 Worker 里同步」正是设计点：**同步调用的低开销 + Worker 隔离保证不卡主线程**
- 这让 OPFS 成为把传统文件型软件搬上 Web 的地基——**SQLite-wasm 官方把 OPFS 当持久化后端**：数据库引擎要的就是高频、小块、随机的同步 I/O

</v-click>

<!--
主线程上 OPFS 走异步：getFile() 读、createWritable() 写。同步句柄只在 Worker 里开放，无 Promise 开销、字节级随机读写——这是 SQLite-wasm 级性能的来源。
-->

---

# 归属、清理与选型落锤

OPFS 不是法外之地

<v-click>

- **用量算入源配额**（`estimate()` 的 usage 包含它）、受同一套驱逐规则管、用户「清除站点数据」连它一起删
- 文件不与真实磁盘一一对应——别指望在 Finder/资源管理器里找到它们

</v-click>

<v-click>

| 数据长相 | 去处 |
| --- | --- |
| 结构化记录（列表、缓存、需索引查询） | **IndexedDB** |
| 文件语义（大二进制、字节级随机读写、wasm 数据库） | **OPFS** |
| 三五个偏好字段 | 仍是 localStorage——开数据库是杀鸡用牛刀 |

</v-click>

<v-click>

> 两者互补而非竞争；配合 Worker 都能把重 I/O 移出主线程——但「持久」依旧不等于「保证不丢」。

</v-click>

<!--
选型再落一锤：结构化记录归 IndexedDB，文件语义归 OPFS，小偏好别过度设计。两者的数据都在共享源配额与驱逐规则的管辖内——下一章展开。
-->

---
layout: section
---

# 配额与驱逐

能存多大，什么时候会被清

---

# 先分清两个「Storage API」

命名事故现场：名字像，完全两个东西

<v-click>

| | Web Storage API | **Storage API** |
| --- | --- | --- |
| 入口 | `window.localStorage` / `sessionStorage` | **`navigator.storage`**（StorageManager） |
| 职责 | 存键值串 | **管配额、持久化、OPFS 入口** |
| 方法 | `getItem` / `setItem`… | `estimate()` / `persist()` / `persisted()` / `getDirectory()` |
| 环境 | 仅 window | window + Worker；需安全上下文 |

</v-click>

<v-click>

> Storage API 背后是 WHATWG Storage 标准的统一模型：**每个源一个「站点存储单元」（桶）** —— IndexedDB、Cache API、OPFS 的数据都记在这个桶上，配额按桶算、驱逐按桶清。

</v-click>

<!--
这是本章第一个命名陷阱：navigator.storage 属于 Storage API，与 localStorage 所属的 Web Storage API 重名不同物，名字像纯属历史巧合。
-->

---

# estimate()：查账

查询当前源的存储用量与配额（单位：字节）

<v-click>

```js
const { usage, quota } = await navigator.storage.estimate();

console.log(`已用 ${(usage / 1024 / 1024).toFixed(1)} MiB`);
console.log(`配额 ${(quota / 1024 / 1024 / 1024).toFixed(1)} GiB`);
console.log(`占比 ${((usage / quota) * 100).toFixed(2)}%`);
```

</v-click>

<v-click>

- **quota 是保守估算**——比设备真实可用空间小，防止写爆磁盘
- **usage 是模糊值**——反指纹混淆 + 去重/压缩，「写入字节数」与「实际占用」对不上
- **别拿它做精确账本**，做「快满了该清理」的阈值判断刚好
- 排查入口：Chrome DevTools「Application → Storage」看分项用量，还能**模拟自定义配额**测试超限路径

</v-click>

<!--
两个「估」字要当真。DevTools 的 Simulate custom storage quota 能把配额调小，专门测试超限路径——超限处理代码值得这样练一遍。
-->

---

# 谁在共享配额：两套账本

「配额还剩 40 GB」与「localStorage 满了」可以同时为真

<v-click>

| 存储 | 记入共享源配额？ |
| --- | --- |
| IndexedDB | **是** |
| Cache API | **是** |
| OPFS | **是** |
| WebAssembly 代码缓存 | **是** |
| localStorage / sessionStorage | 否——独立小池，各 ~5 MiB/源 |
| Cookie | 否——独立限制（单条 ~4KB），不该拿来存数据 |

</v-click>

<!--
共享配额覆盖 IndexedDB、Cache API、OPFS、wasm 代码缓存四类；Web Storage 另立小池，Cookie 完全不在配额体系内。两套账本是理解「满了」的关键。
-->

---

# 配额数值：各浏览器现状

MDN 当前口径；运行时判断永远以 `estimate()` 为准

<v-click>

| 浏览器 | best-effort（默认） | persistent |
| --- | --- | --- |
| **Chrome / Edge** | 单源 ≤ **磁盘 60%**；无痕 ~**5%**、「关窗清数据」~**300 MB** | 同 60% |
| **Firefox** | **min(磁盘 10%, 10 GiB)**——10 GiB 按 **eTLD+1 组**计 | 磁盘 **50%**（≤ 8 TiB） |
| **Safari（macOS 14 / iOS 17+）** | 浏览器内单源 ~**60%**；WKWebView 内 ~**15%** | 同左 |
| **Safari（旧版）** | 起步 **1 GiB**，用满弹窗按 **200 MB** 递增 | —— |

</v-click>

<v-click>

- 配额按**源**算；只有 Firefox 组限按 **eTLD+1** 聚合多子域；Safari 跨源 iframe ≈ 父配额 1/10

</v-click>

<!--
web.dev 文章年代更早，个别数字已过时：无痕 5%、关窗清数据 300 MB、旧 Safari 1 GiB 递增都是 web.dev 补充口径。数字会随版本调整，表格只用于建立量级直觉。
-->

---

# 两种桶：best-effort vs persistent

WHATWG 模型里每个源的桶有两种模式

<v-click>

- **best-effort**（默认）：浏览器尽力保留；存储压力来了**不打招呼直接清**
- **persistent**：`persist()` 申请成功后，LRU 驱逐**跳过**该源；「清缓存」不动它，仅用户显式针对性操作才清

</v-click>

<v-click>

```js
const persisted = await navigator.storage.persisted(); // 当前是否已持久
if (!persisted) {
  const granted = await navigator.storage.persist(); // 申请（可能被拒）
  console.log(granted ? "已获持久承诺" : "仍是 best-effort，可能被驱逐");
}
```

</v-click>

<v-click>

> 裁决方式各家不同：**Firefox 弹权限窗**问用户；**Chrome/Edge/Safari 不弹窗**，按交互历史自动批/拒 —— `persist()` 返回 `false` 不是 bug，是拒签。

</v-click>

<!--
Chromium/Safari 看的是交互历史信号：是否常用、是否加书签、是否装 PWA。代码必须兼容「永远拿不到持久承诺」的路径。
-->

---

# 驱逐：数据怎么消失的

触发条件是存储压力

<v-click>

- **触发**：设备磁盘吃紧，或浏览器总占用触到自身上限（如 Chrome/Safari 的 80%）
- **策略**：按 **LRU** 找出**最久未使用**的 best-effort 源
- **范围**：**整源删除**——IndexedDB、Cache API、OPFS 一起走，不做部分删除
- **豁免**：persistent 源被跳过

</v-click>

<v-click>

> 为什么整源清除？**半删会给应用留下无法自愈的不一致状态** —— 宁可全清，不留残局。

</v-click>

<!--
LRU 整源驱逐是所有浏览器的通用规则。对应用的含义：要么数据都在，要么整个源被清空重来——设计恢复逻辑时按「全量重建」考虑。
-->

---

# Safari ITP：7 天铁律

通用规则之外，Safari 多一条主动清除

<v-click>

- 开启反跨站追踪（默认开启）时：**连续 7 个「Safari 使用日」未与站点交互 → 该站全部脚本可写存储被清空**
- 范围：IndexedDB、Cache API、Service Worker 注册、localStorage……全在内
- **服务端 `Set-Cookie` 下发的 Cookie 不在清除之列**——「登录态活着、离线数据没了」的成因
- 一次点击/触摸等交互即可**重置 7 天计时**；**加到主屏幕的已安装 PWA 豁免**

</v-click>

<v-click>

> 工程对策：面向 Safari 的应用，把本地存储当**缓存**而非**唯一副本** —— 关键数据必须有服务端源头；或引导用户安装 PWA。

</v-click>

<!--
精心做的离线笔记应用，在 Safari 上就是「两周没打开 = 数据没了」。7 天按 Safari 使用日计，不是自然日。这条铁律决定了 Safari 用户的本地数据只能当缓存设计。
-->

---

# 超限的三张错误脸

驱逐之外，写入超限是另一条失败路径

<v-click>

| 存储 | 超限表现 |
| --- | --- |
| Web Storage | `setItem` **同步抛** `QuotaExceededError` |
| IndexedDB | 事务中止，**`onabort`** 回调收到 `QuotaExceededError` |
| Cache API | 写入 Promise **reject** `QuotaExceededError` |

</v-click>

<v-click>

- 三条失败路径只要有一条没兜住，用户看到的就是「点了保存、什么都没发生」
- 统一处理思路：捕获 → 清理可再生数据（旧缓存先删）→ 重试；不可再生数据提示用户
- 别以为超限是小概率：无痕配额骤减、低磁盘设备上，驱逐与超限都是日常

</v-click>

<!--
同一个 QuotaExceededError，三种存储的报错通道完全不同：同步 throw、事务 onabort、Promise reject。写本地存储要按「可能失败的 I/O」对待。
-->

---
layout: section
---

# 存储分区与 Storage Buckets

隔离在收紧：源之上再加一把刀

---

# 双键分区：源 + 顶级站点

传统「按源隔离」是跨站追踪的温床——浏览器的答案：不封杀，改隔离

<v-click>

```text
分区前：(tracker.example)             ——全网唯一一份：A 站写用户 ID、B 站原样读回
分区后：(siteA.com, tracker.example)  ——一份
        (siteB.com, tracker.example)  ——另一份
        (tracker.example 顶级访问)     ——第三份
```

</v-click>

<v-click>

- 两种旧对策都不理想：**全面封杀三方存储**砸坏 SSO/支付/客服挂件；**按追踪者名单封杀**依赖分类准确
- **Chrome 115 起全量默认**；嵌套再加**祖先位（ancestor bit）**——中间隔着跨站文档，首尾同站也分区，堵住「跳板 iframe」
- **Firefox 103 起默认**动态分区（网络状态自 85 起**永久分区且不可解除**）
- 分区**没有退出开关**、没有「是否被分区」的查询 API——把「嵌入上下文 = 独立小仓库」当默认世界观

</v-click>

<!--
传统模型里 tracker.example 的 iframe 无论嵌在哪个网站，读写的都是同一份存储——在 A 站写入用户 ID、在 B 站原样读回，行为就被串起来了。分区把存储键升级为「(顶级站点, 源)」双键。
-->

---

# 被分区的远不止 localStorage

存储 + 通信 + 配额，一并切分

<v-click>

- **存储**：Web Storage、IndexedDB、Cache API、OPFS、Storage Buckets、三方上下文注册的 Service Worker
- **通信 API 同样分区**：**BroadcastChannel、SharedWorker、Web Locks**——跨分区直接切断（Chrome 137 起 Blob URL 除顶级导航外也分区）
- `Clear-Site-Data` 也只清当前分区
- **配额按分区记账**：每个分区是独立的桶——三方 iframe 能用的配额远小于顶级上下文（Safari 给跨源 frame ≈ 父配额 1/10）

</v-click>

<v-click>

> 排查线索：Firefox 会在控制台打印「Partitioned cookie or storage access was provided to …」，标明当前上下文拿到的是分区存储还是解分区授权。

</v-click>

<!--
Chrome 口径的分区清单覆盖存储与通信两大类，Firefox 同理。通信 API 被切断意味着「iframe 与你站顶级页/弹窗之间的 BroadcastChannel」不再互通。
-->

---

# 对嵌入式组件的实际影响

做「被别人嵌」的产品时，旧心智全部作废

<v-click>

| 旧预期 | 分区后的现实 |
| --- | --- |
| 用户在 A 站 widget 里设的偏好，B 站的同一 widget 记得 | **不记得**——两个分区两份数据 |
| 登录过 `sso.example`，任何站的 SSO iframe 都能读到会话 | **读不到**——iframe 分区里没有顶级会话 |
| iframe 与打开的弹窗共享 BroadcastChannel | **切断**——通信 API 同样分区 |
| iframe 里的配额与主站共享 | **独立记账**，且往往更小 |

</v-click>

<v-click>

自查清单：是否假设 iframe 能读到顶级访问写的数据？跨分区通信？三方 SW 共享缓存？配额阈值按大配额设？登录态是否只压在 Cookie 上？

</v-click>

<!--
评论区、客服窗、播放器、SSO 都在此列。自查清单最后一条是关键：跨浏览器可靠的解分区通道只有 Cookie——下一页展开。
-->

---

# 逃生门：Storage Access API

经用户许可，拿回非分区 Cookie

<v-click>

- 三方 iframe 调 `document.requestStorageAccess()`——经用户许可后拿回**非分区 Cookie**（用户顶级访问该站时的那份）
- **跨浏览器基线只救 Cookie**：Firefox/Safari 仅 Cookie 可动态解分区（Chromium 125+ StorageAccessHandle 非 Cookie 扩展系实验性、勿依赖）
- Firefox 授权一次有效 **30 天**；配套的 opener/导航**过渡期启发式**是兼容性权宜——**别把产品逻辑押在启发式上**
- Chrome 侧另有临时的解分区**弃用试验**（deprecation trial）供迁移期使用

</v-click>

<v-click>

> 收束背景：第三方 Cookie 默认淘汰已于 **2024-07 由 Google 官宣反转**、不再单方面默认淘汰 —— 但分区与隔离收紧的大方向未变（细节归网络章）。

</v-click>

<!--
Storage Access API 救的是 Cookie 型会话：SSO iframe 拿回用户顶级访问时的登录态。启发式自动授权是过渡期兼容性权宜，官方原话不建议依赖。
-->

---

# Storage Buckets API：一个源，多个桶

分区是浏览器替用户切；Buckets 让开发者自己切

<v-click>

```js
// 草稿桶：申请持久化 + 严格落盘（丢了不可原谅的数据）
const drafts = await navigator.storageBuckets.open("drafts", {
  persisted: true,      // 申请免驱逐（默认 false）
  durability: "strict", // 断电也尽量不丢；默认 "relaxed"
});
// 缓存桶：默认 best-effort，压力下先被清掉的就是它
const cache = await navigator.storageBuckets.open("cache");
const db = drafts.indexedDB.open("notes"); // 桶内 IndexedDB 端点
```

</v-click>

<v-click>

- 动机是 `persist()` 的粗粒度：对整个源「全有或全无」——真实应用里**草稿丢了不可原谅，上周的列表缓存丢了无所谓**
- 驱逐时浏览器**逐桶清除**：先清 best-effort 的 cache 桶，drafts 桶因 persisted 幸存——**独立驱逐优先级**

</v-click>

<!--
每个桶内是一套独立的存储端点：bucket.indexedDB、bucket.caches。按数据重要性分桶，各桶单独设持久化与驱逐优先级。
-->

---

# Buckets 要点：正交、权衡与现状

分桶不是分区的替代品

<v-click>

- **分区与分桶正交**：分区是浏览器**按顶级站点**替用户切，分桶是开发者**按数据重要性**替自己切——三方 iframe 里开的桶照样按分区各记各账
- `durability: "strict"` 买**断电落盘**的可靠、付**写性能**的账——只给「丢了不可原谅」的桶；缓存类保持默认 `"relaxed"`
- **兼容性现状**：Chromium **122** 起正式可用；仍是 **WICG 提案**（Mozilla 立场评估中）——跨浏览器只能渐进增强

</v-click>

<v-click>

```js
// 特性检测：不支持就回落到默认桶（普通 navigator.storage 世界）
if ("storageBuckets" in navigator) {
  /* 分桶策略 */
} else {
  /* 单桶 + persist() 兜底 */
}
```

</v-click>

<!--
Chrome 的分区清单里明确包含 Storage Buckets。规范仍在 WICG 阶段，TAG 评审与 Mozilla 立场评估中，Firefox/Safari 未跟进——生产代码必须做特性检测。
-->

---
layout: center
class: text-center
---

# 小结

存储模型三条硬约束：配额、驱逐、隔离

<v-click>

- **全景**：六机制是分工不是替代；web.dev 三首选 Cache API / OPFS / IndexedDB（全异步）
- **Cookie**：访问器怪癖、单条 ~4KB、随请求上行；HttpOnly 是唯一 JS 读不到的存储位
- **Web Storage**：源隔离 vs 标签页 + 源；同步阻塞；storage 事件跨标签页广播；无痕退化
- **IndexedDB / OPFS**：结构化克隆保形存储；Worker 同步句柄撑起 SQLite-wasm
- **配额与驱逐**：两套账本、estimate()/persist()、LRU 整源清除、Safari ITP 7 天
- **分区与分桶**：三方 iframe 按「源 + 顶级站点」双键；Buckets 一源多桶独立驱逐

</v-click>

<v-click>

> 数据放哪、能存多大、何时被清、谁看得见 —— 答案都在存储模型里。

</v-click>

<!--
六个主题收束：选型矩阵定去处，Cookie 只装服务端要看的最小状态，Web Storage 管页面级小键值，IndexedDB/OPFS 是真正的数据层，配额与驱逐决定可靠性设计，分区与分桶是隔离的新维度。API 细节等 Web API 章。
-->

---
layout: center
class: text-center
---

# 谢谢

浏览器存储 · 数据放哪、多大、多久、谁可见

<div class="mt-8 text-gray-400">
基于 Web 现代标准 · 面向前端工程师
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/base/browser/browser-storage/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
全章覆盖存储全景与选型矩阵、Cookie 浏览器侧、Web Storage 隔离模型、IndexedDB 与 OPFS、配额与驱逐、存储分区与 Storage Buckets。配套笔记见文档图标链接。感谢观看。
-->
