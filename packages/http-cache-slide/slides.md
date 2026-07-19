---
theme: seriph
background: https://cover.sli.dev
title: HTTP 缓存完全指南
info: |
  HTTP 缓存策略完全指南：强缓存 · 协商缓存 · Cache-Control · 资源提示

  Learn more at https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching
drawings:
  persist: false
transition: slide-left
mdc: true
---

# HTTP 缓存完全指南

浏览器与中间代理的响应副本机制 · 强缓存 + 协商缓存 + 资源提示

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
HTTP 缓存由 RFC 9111（2022）标准化，是性能优化性价比最高的一档——零往返。
-->

---
transition: fade-out
---

# 什么是 HTTP 缓存

浏览器与中间代理在**客户端与源站之间**保存响应副本的机制（RFC 9111, 2022）

- **协议层规范**：HTTP/1.1 引入，所有控制通过响应头表达
- **双层语义**：强缓存（直接复用）+ 协商缓存（再校验）
- **零往返**：强缓存命中时浏览器**不发请求**
- **304 兜底**：副本过期后用条件请求拿 304，几乎无 body

| 层级 | 触发条件 | 命中行为 | 发请求 |
|------|------|------|------|
| **强缓存** | 在 `max-age` 新鲜期内 | 直接用本地副本 | **不发** |
| **协商缓存** | 过期 / `no-cache` 标记 | 条件请求，命中返 304 | 发，几乎无 body |
| **未命中** | 无副本 / `no-store` | 完整下载新副本 | 发 + 完整 body |

> HTTP 缓存 ≠ Service Worker Cache Storage（JS 可编程层）。

<!--
强调 HTTP 缓存是协议层被动缓存，强缓存连请求都不发；Service Worker 是 JS 主动缓存。
-->

---
layout: two-cols
---

# Cache-Control 指令矩阵

**新鲜期**

- `max-age=<秒>`：浏览器新鲜期
- `s-maxage=<秒>`：仅共享缓存，覆盖 `max-age`
- `immutable`：跳过刷新触发的条件请求

**作用域**

- `public`：允许共享缓存（默认可省）
- `private`：仅浏览器（默认值）

**控制类**

- `no-cache`：可存但每次必校验
- `no-store`：完全不存储
- `must-revalidate`：过期必校验

::right::

# 扩展指令

**容忍过期**

- `stale-while-revalidate=<秒>`：后台异步再校验
- `stale-if-error=<秒>`：源站出错返过期副本

**其他**

- `no-transform`：禁中介转换
- `proxy-revalidate`：仅共享缓存必校验
- `must-understand`：须理解语义

**优先级**

```text
Cache-Control 覆盖 Expires
s-maxage 覆盖 max-age（共享缓存）
```

<!--
完整指令矩阵覆盖新鲜期、作用域、控制类、容忍过期四类语义。
-->

---

# 强缓存核心：immutable

```text
Cache-Control: public, max-age=31536000, immutable
```

**作用**：新鲜期内连用户刷新触发的条件请求都跳过

- 浏览器默认：未过期资源在用户刷新时**仍发条件请求**（拿 304）
- 加 `immutable`：直接复用本地副本，省一次往返
- Facebook 报告：版本化资源加 `immutable` 后**省 60% 请求量**

**只对内容永不变化的 hash 资源有意义**

- 适用：`app.a3f9b2c1.js`、`style.7c4e8d2a.css`、字体
- 不适用：HTML（每次必协商）/ 接口（短期可变）

> RFC 8246（2017）。Firefox 49+（HTTPS）支持，Chrome / Safari 历史上未完整实现，**安全忽略**——可放心加上做渐进增强。

<!--
immutable 是版本化资源的高 ROI 加成，Facebook 实测省 60% 请求量。
-->

---

# 高频陷阱：no-cache ≠ no-store

```text
Cache-Control: no-cache        # 可存储，但每次必校验
Cache-Control: no-store        # 完全不存储任何副本
```

| 指令 | 存储？ | 命中行为 |
|------|------|------|
| `no-cache` | 是 | 每次发条件请求，命中 304 |
| `no-store` | 否 | 每次完整下载 |

**最常见误解**：用 `no-cache` 表达「不缓存」

- 实际是「允许存储但每次必校验」
- 真正禁止缓存必须 `no-store`

**等价回退**

```text
Cache-Control: max-age=0, must-revalidate    # 等价 no-cache（HTTP/1.0 回退）
```

<!--
no-cache 是最高频陷阱，面试常考；务必区分「可存但校验」与「完全不存」。
-->

---

# public vs private

| 指令 | 含义 | 何时显式用 |
|------|------|------|
| `public` | 允许共享缓存存储 | 仅**带 `Authorization` 头**响应需要 |
| `private` | 仅浏览器私有缓存可存（**默认**） | 个性化 / 认证后响应显式加 |

**高频误区**

- 误以为「要被 CDN 缓存就必须写 `public`」——**普通响应默认就能**
- `public` 的真正用途：覆盖 `Authorization` 触发的「默认私有」

**漏加 private 的后果**

- 共享缓存（CDN / 代理）默认会缓存可缓存的响应
- 把一个用户的隐私数据 / 会话页**返回给另一个用户**——信息泄露

```text
# 用户个性化响应必须这样写
Cache-Control: private, no-cache
```

<!--
public 不必显式写——普通响应默认就可被 CDN 缓存；只有 Authorization 才需要。
-->

---

# 协商缓存：ETag 优于 Last-Modified

| 维度 | ETag（推荐） | Last-Modified |
|------|------|------|
| 形式 | 内容 hash（`"abc123"`） | 1 秒粒度时间戳 |
| 精度 | 内容指纹 | 1 秒粒度 |
| 「内容变 mtime 未变」 | 识别 | 漏判 |
| 「1 秒内多次改」 | 识别 | 漏判 |
| 反映内容 | 是 | 否（只反映 mtime） |

**配合条件请求头**

```text
响应：ETag: "abc123"          Last-Modified: Wed, 21 Oct 2026 07:28:00 GMT
请求：If-None-Match: "abc123" If-Modified-Since: Wed, 21 Oct 2026 07:28:00 GMT
```

> 同时设置时，客户端两个条件都发，服务端应**两个都满足**才返 304。

<!--
ETag 是内容指纹，能识别 mtime 漏判的场景；Last-Modified 只是兜底。
-->

---

# 304 协商完整流程

```text
1. 首次请求
   GET /app.js
   ← 200 OK
     Cache-Control: no-cache
     ETag: "abc123"
     Last-Modified: Wed, 21 Oct 2026 07:28:00 GMT

2. 副本过期，发条件请求
   GET /app.js
     If-None-Match: "abc123"
     If-Modified-Since: Wed, 21 Oct 2026 07:28:00 GMT

3a. 未变 → 304 Not Modified（几乎无 body），客户端复用本地副本
3b. 已变 → 200 OK + 新 body + 新 ETag / Last-Modified
```

**状态码**

- **200 OK**：资源已变 / 无缓存，返回新副本
- **304 Not Modified**：未变，复用本地副本
- **412 Precondition Failed**：`If-Match` 不匹配（乐观锁失败）

<!--
服务端必须正确响应条件请求，忽略它们直接返 200 会丢掉协商优化。
-->

---

# 生产黄金组合

```text
# 组合 A：版本化静态资源（文件名带 hash）
app.a3f9b2c1.js     →  Cache-Control: public, max-age=31536000, immutable
style.7c4e8d2a.css  →  Cache-Control: public, max-age=31536000, immutable
font.woff2          →  Cache-Control: public, max-age=31536000, immutable

# 组合 B：HTML 入口
index.html          →  Cache-Control: no-cache
```

**为什么这样配**

- 资源 hash 即版本：内容变 hash 就变 URL 就变，旧 URL 副本永久有效
- `immutable` 阻止刷新触发条件请求，省 60% 请求量
- HTML 是资源引用清单，必须每次协商拿新 hash 引用

> **用文件名 hash 而非 `?v=2`**：部分老代理 / CDN 不缓存含 `?` 的 URL。

<!--
这是 web.dev 推荐的最大值——max-age=31536000（1 年），不要给 HTML 也这么配。
-->

---

# 启发式缓存陷阱

**不写 Cache-Control ≠ 不缓存**

```text
启发式新鲜期 ≈ max(0, (date - last_modified) × 10%)
```

**例**：响应头未设 `Cache-Control`，但 `Last-Modified` 是 100 天前

- 浏览器推断「这资源 10 天没变，给 10 天新鲜期」
- 结果出乎意料地长，且不可控

**应对**

- **始终显式设置 Cache-Control**——哪怕只是 `no-cache` / `no-store`
- 别让浏览器自己猜

**反模式**

- 给 HTML 配 `max-age=31536000`：HTML 是清单，长期缓存导致部署后用户拿不到新版引用
- 给带 hash 的资源配 `no-cache`：hash 已保证内容唯一，强制每次协商是浪费往返

<!--
启发式缓存是「不设不等于不缓存」的根因，排查缓存久时先看 Cache-Control 是否缺失。
-->

---
layout: two-cols
---

# 资源提示四件

全部放在 `<head>` 内

**`<link rel="preload">`**

- 当前页关键资源
- 高优先级预拉取
- **必须配 `as`**

**`<link rel="prefetch">`**

- 未来导航可能用到
- 低优先级（空闲时下载）

::right::

# 跨源握手

**`<link rel="preconnect">`**

- 提前 DNS + TCP + TLS
- 真开连接，占 socket
- **只对最关键跨源**

**`<link rel="dns-prefetch">`**

- 仅 DNS 解析
- 开销极小
- 其他域名用这个

**Fetch Priority**

- `fetchpriority="high"`
- LCP 图片必加
- 绕过两阶段延迟

<!--
preconnect 限 3-4 个最关键跨源，滥用会挤占浏览器 socket 上限。
-->

---

# preload 的 as 与 crossorigin

```html
<!-- 字体 preload：必加 crossorigin -->
<link rel="preload" href="/font.woff2" as="font" type="font/woff2" crossorigin>

<!-- LCP 图片 preload + fetchpriority -->
<link rel="preload" href="/hero.webp" as="image" fetchpriority="high">

<!-- Google Fonts 配对 -->
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**必填搭档**

- 缺 `as`：资源**重复下载一次**，且 CSP / Accept / 优先级失效
- 字体缺 `crossorigin`：字体强制走 CORS 匿名模式，**下载两次**且第二次才可用

> LCP 图片加 `fetchpriority="high"` 让首屏图片在第一下载阶段就跑，直接改善 LCP。

<!--
preload 不写 as 是经典坑，字体不加 crossorigin 更常见——都会触发重复下载。
-->

---

# Vary 头：缓存键维度

```text
Vary: Accept-Encoding, User-Agent
```

- 声明**缓存键依赖的请求头维度**
- 同 URL 但返回不同内容时必配，否则共享缓存会**错发版本**

| 场景 | Vary | 防止的错误 |
|------|------|------|
| 压缩协商（gzip / br） | `Accept-Encoding` | br 版错发给不支持 br 的客户端 |
| 设备适配 | `User-Agent` 或 `Sec-CH-UA-Mobile` | 桌面版错发给移动用户 |
| 国际化 | `Accept-Language` | 英文版错发给中文用户 |
| 客户端提示 | `Sec-CH-UA-Viewport-Width` | 高清图错发给低端设备 |

> `Vary: User-Agent` 会让 CDN 缓存键爆炸——优先用客户端提示维度。

<!--
Vary 漏配 Accept-Encoding 是 CDN 把 br 版错发给老客户端的根因。
-->

---
layout: quote
---

# no-cache 允许存储

「真正禁止缓存用 no-store——不设 Cache-Control 也不等于不缓存，浏览器会按启发式自行推断新鲜期。」

---
layout: center
class: text-center
---

# 反模式速查

**最易踩的坑**

- 用 `no-cache` 表达「不缓存」（应是 `no-store`）
- 同时设 `no-store` 与 `max-age=0, must-revalidate`（基本等同 `no-store`，无效噪音）
- 给 HTML 配 `max-age=31536000`（部署后用户拿不到新资源引用）
- 给带 hash 资源配 `no-cache`（hash 已唯一，浪费往返）
- 个性化 / 认证响应漏加 `private`（共享缓存泄隐私）
- 无脑给所有第三方域名 `preconnect`（挤占 socket）
- `preload` 缺 `as`（资源重复下载）
- `preload` 字体缺 `crossorigin`（字体下载两次）
- 服务端忽略 `If-None-Match` 直接返 200（丢失协商优化）
- 用 `?v=2` 而非文件名 hash 做版本化

<!--
跑一遍反模式清单，对照自己项目找漏配。
-->

---
layout: center
class: text-center
---

# 小结

HTTP 缓存 = 协议层零往返的响应副本机制

强缓存 + 协商缓存 + 资源提示 · RFC 9111（2022）

**版本化资源 max-age=31536000 + immutable · HTML no-cache · LCP 图片 fetchpriority=high**

[MDN Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) · [web.dev HTTP Cache](https://web.dev/articles/http-cache) · [RFC 9111](https://www.rfc-editor.org/rfc/rfc9111)

<!--
掌握两层语义 + 黄金组合，就能把 HTTP 缓存用到生产水准。
-->
