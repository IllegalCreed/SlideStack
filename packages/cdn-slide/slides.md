---
theme: seriph
background: https://cover.sli.dev
title: CDN 完全指南
info: |
  CDN 完全指南：边缘缓存 · origin pull · purge · CDN 专属头 · Cloudflare/CloudFront 实践

  Learn more at https://web.dev/articles/content-delivery-networks
drawings:
  persist: false
transition: slide-left
mdc: true
---

## CDN 完全指南

内容分发网络 · 边缘缓存 · origin pull · CDN 专属头

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
CDN 是把内容缓存到离用户更近的边缘节点的共享缓存层，本章聚焦其工程实践。
-->

---
transition: fade-out
---

# 什么是 CDN

把内容缓存到**离用户更近的边缘节点（PoP）**的共享缓存层

- **缓存命中**：边缘直接返回，无需回源
- **未命中**：边缘代用户 origin pull 拉一份缓存下来
- **共享缓存**：同一资源被多个用户复用，与浏览器私有缓存语义不同
- **核心目标**：降 RTT、卸源、扛突发流量

> CDN 不是简单的"中间代理"，而是带缓存与协议升级的智能边缘。

<!--
与浏览器私有缓存的本质区别在于"共享"。
-->

---

# CDN 性能三要素

性能收益不只有"缓存"，是三件事的叠加

| 要素 | 含义 | 对指标的影响 |
|------|------|------|
| **更短 RTT** | 边缘节点离用户物理距离更近 | 降 TTFB → 改善 LCP/FCP |
| **连接预热/复用** | TLS 1.3 1-RTT、HTTP/2 multiplexing、HTTP/3 QUIC | 回源握手开销可忽略 |
| **缓存卸载回源** | CHR 90%+ 时绝大多数请求在边缘终结 | 源站几乎不被打 |

> 三要素缺一不可：光缓存但 RTT 长，或 RTT 短但每次回源，都打折扣。

<!--
TTFB 的下降直接传导到 LCP，这是 CDN 对前端最大的价值。
-->

---

# origin pull 与 purge

| 操作 | 触发 | 行为 |
|------|------|------|
| **origin pull** | 缓存未命中（被动） | 边缘代用户回源拉取并缓存 |
| **purge** | 用户主动（Purge API） | 让已有缓存立即失效 |
| **eviction** | 空间不足（自动） | LRU 淘汰旧条目 |
| **soft purge** | 用户主动 | 标记过期但继续服务直到新版本就绪 |

**hold-till-told caching**：长 TTL + 内容变更时调 Purge API

> 适合"动态但可短暂缓存"的内容（首页、列表 API）。

<!--
hold-till-told 是高流量动态内容的常用模式：长 TTL 提升命中率，purge 提供新鲜度。
-->

---

# cache hit ratio（CHR）

**CHR = 缓存命中请求数 / 总请求数**，目标 **≥ 90%**

**三大杀手**

- **query 参数未归一化**：`?utm_id=123` 与 `?utm_id=456` 默认是不同 cache key
- **滥用 Vary**：`Vary: User-Agent` 不归一化 → 同一资源几千份缓存
- **带 Set-Cookie 的响应**：缓存层通常不缓存，且漏加 private 会泄漏

**治理**

- 在 CDN 配置里忽略无关 query（utm/referral_id）+ 排序归一化
- 归一化 Accept-Language 等头
- 不缓存带 Set-Cookie 的响应

> 低于 90% 先排查 query 与 Vary，别先怀疑源站。

<!--
CHR 是 CDN 运营的核心 KPI，治理方法远比"加缓存"重要。
-->

---

# cache-busting 模式

让内容永不变的资源走激进缓存，让会变的入口走每次 revalidate

```text
# 静态资源（带内容 hash 的文件名）
/assets/index-a3f9c2b1.js   Cache-Control: public, max-age=31536000, immutable
/assets/logo-9e8d7c6f.webp  Cache-Control: public, max-age=31536000, immutable

# HTML 入口
/index.html                 Cache-Control: no-cache
```

- 文件名带 hash → 内容变 → URL 变 → 走新 URL，旧缓存安静过期
- `immutable` 让浏览器新鲜期内不发条件请求（Firefox/Safari 支持，Chromium 不支持）
- HTML 用 `no-cache` 每次都 revalidate → 看到新 hash 引用

> 这是替代频繁 purge 的根本解。

<!--
hash 化是新版本自然走新 URL，比 purge 大规模更优雅。
-->

---
layout: two-cols
---

# s-maxage vs max-age

```text
Cache-Control: public, max-age=600, s-maxage=86400
```

- **浏览器**：按 `max-age=600` 缓存 10 分钟
- **CDN**：按 `s-maxage=86400` 缓存 1 天
- `s-maxage` 覆盖 `max-age`，**仅对共享缓存生效**
- 浏览器忽略 `s-maxage`

把"用户感知新鲜度"与"CDN 命中率"解耦

::right::

# 三者语义辨析

| 指令 | 含义 |
|------|------|
| `no-cache` | 可存但每次复用前必 revalidate |
| `no-store` | 任何缓存都不得存储 |
| `private` | 只进浏览器私有缓存 |

**典型误用**

- 以为 no-cache=不缓存（其实仍会被存）
- 个性化响应漏加 private → 数据泄漏
- 该用 no-store 用了 no-cache

> 要完全不缓存用 no-store，要让浏览器每次校验用 no-cache。

<!--
no-cache / no-store / private 三者极易混淆，是 CDN 配置的高发错误源。
-->

---

# CDN 专属头家族

CDN 层需要管理五层独立 TTL：origin / network shared / 本 CDN / 下游 CDN / 浏览器

| 头 | 透传 | 行为 |
|------|------|------|
| `CDN-Cache-Control` | **透传**给下游 CDN | 控制本 CDN + 下游 CDN |
| `Cloudflare-CDN-Cache-Control` | **不透传**，只对本 CDN | 只想控制 Cloudflare |
| `Surrogate-Control` | 本 CDN 识别但不透传 | 覆盖 Cache-Control 决策 |
| `Cache-Control` | 全程透传（兜底） | 浏览器 + 所有共享缓存 |

```text
Cache-Control: public, max-age=600
Cloudflare-CDN-Cache-Control: public, max-age=86400
```

> `CDN-Cache-Control` 是 IETF 草案，Cloudflare 已实现，非全行业标准但被主流 CDN 跟进。

<!--
s-maxage 对所有共享缓存一视同仁，CDN 专属头才能逐层调优。
-->

---

# Surrogate-Key 分组失效

purge 粒度从粗到细

| 手段 | 粒度 | 适用 |
|------|------|------|
| **purge-all** | 全站 | 极端情况才用；CHR 瞬时归零 |
| **purge by URL** | 单 URL | 单页更新 |
| **purge by Surrogate-Key/Cache-Tag** | 按标签批量 | footer 改了 purge 所有引用它的页 |
| **soft purge** | 同上但标记过期 | 平滑过渡 |

```text
# 源站给响应打标签
Surrogate-Key: footer user123
Cache-Tag: article-list

# 内容变更时按 key 批量 purge
POST /purge_cache  { "surrogate-key": "footer" }
```

> purge-all 是最后手段——整站命中率瞬时归零、源站被 origin pull 风暴打。

<!--
分组失效是大规模 CDN 内容更新的正确解。
-->

---

# stale-while-revalidate 与 stale-if-error

```text
Cache-Control: max-age=3600, stale-while-revalidate=600, stale-if-error=86400
```

| 指令 | 行为 |
|------|------|
| `stale-while-revalidate=N` | 过期后 N 秒内先返旧值后台刷新 |
| `stale-if-error=N` | 源站 5xx / 不可达时复用旧响应 |
| `must-revalidate` | 一旦过期必须 revalidate，禁断网复用 |
| `proxy-revalidate` | 共享缓存版 must-revalidate |

**CloudFront 约束**：与 Max TTL 取较小值生效

> CDN 自带"容灾层"：源站故障时仍能服务旧值，可用性大幅提升。

<!--
这两个指令是 CDN 高可用配置的标配。
-->

---

# CloudFront TTL 矩阵

最终 TTL = clamp(源站 `max-age`, MinTTL, MaxTTL)

| 源站指令 | 行为 |
|------|------|
| 有 `max-age=N` | 夹在 [Min, Max] 区间取 N |
| 无 Cache-Control | 用 Default TTL |
| `no-cache` / `no-store` / `private` | 正常情况下不缓存 |
| **Min TTL > 0 的坑** | 覆盖 no-store；需配 `stale-if-error=0` 才强制报错 |

**关键能力**

- **Origin Shield**：边缘与源之间的中间缓存层，集中回源提升 CHR
- **Cloudflare 对应叫 Tiered Cache**：边缘未命中先查中心 PoP
- **cache key**：URL path + 选定 query + headers + cookies

<!--
Origin Shield / Tiered Cache 是把多边缘未命中合并成一次回源的关键；Min TTL > 0 还指望 no-store 生效是经典踩坑点（去底部说明合并到这里）。
-->

---

# Image CDN

```text
https://cdn.example.com/image.jpg?width=480&quality=75&format=auto&fit=cover
```

| 参数 | 作用 |
|------|------|
| `width` / `height` | 输出尺寸 |
| `quality` | 压缩质量 0–100 |
| `format=auto` | 按 `Accept` 头自动协商 AVIF/WebP/JPEG |
| `fit=contain/cover/crop` | 缩放策略 |
| `metadata=drop` | 剥离 EXIF |

**主流实现**：Cloudflare Image Resizing / imgix / Cloudinary / CloudFront Image Resizing / Optimizely DXP

> 图片占传输字节约 50%，AVIF 比 WebP/JPEG 压缩率显著更高；按需生成省存储与回源。

<!--
Image CDN 是替代本地预生成多尺寸的根本解。
-->

---

# CDN 协议性能增益

CDN 边缘节点普遍支持这些协议升级，开箱即用

| 特性 | 增益 |
|------|------|
| **Brotli 压缩** | 静态 Brotli-11、动态 Brotli-4，优于 gzip |
| **TLS 1.3** | 1-RTT 握手（vs TLS 1.2 的 2-RTT） |
| **HTTP/2** | 多路复用 + 流优先级 |
| **HTTP/3** | 基于 QUIC/UDP，消除连接级队头阻塞 |

> HTTP/3 不是换个名字，而是真正解决了 HTTP/2 在 TCP 层的队头阻塞问题。

<!--
这些是 CDN 核心产品的开箱即用提速项，常被忽略。
-->

---
layout: quote
---

# purge-all 不是失效手段

「purge-all 会让整站命中率瞬时归零，源站被 origin pull 风暴打。正确解是 Surrogate-Key 分组失效。」

---

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 把 `max-age` 当 CDN 缓存时长（应额外设 `s-maxage`）
- 误以为 `no-cache` = 不缓存（要完全不缓存用 `no-store`）
- 给带 `Set-Cookie` 的响应期望被 CDN 缓存
- 滥用 `Vary: User-Agent` 不做归一化
- query 参数未归一化（utm_id）造成缓存碎片
- 把 `immutable` 当跨浏览器万能（Chromium 不支持）
- CloudFront Min TTL > 0 还指望 no-store 生效
- 试图用客户端 `Cache-Control: no-cache` 强制 CDN 回源（被忽略）
- HTML 入口配长 max-age 不带版本/hash → 用户拿不到更新
- purge-all 当默认失效手段

<!--
先排查 query 与 Vary，再下 CHR 不达标的结论。
-->

---
layout: center
class: text-center
---

# 小结

CDN = 离用户更近的共享缓存层

三要素 · cache-busting · s-maxage · CDN 专属头 · Surrogate-Key

**CHR ≥ 90% · 静态 hash + immutable · HTML no-cache · 分组 purge**

[web.dev](https://web.dev/articles/content-delivery-networks) · [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) · [Cloudflare](https://developers.cloudflare.com/cache/about/cdn-cache-control/) · [CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html)

<!--
掌握共享缓存语义 + cache-busting + 分组 purge，就能把 CDN 用到生产水准。
-->
