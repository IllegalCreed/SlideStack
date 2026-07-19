---
theme: seriph
background: https://cover.sli.dev
title: HTTP 传输压缩完全指南
info: |
  HTTP 传输压缩完全指南：gzip / deflate / brotli / zstd · Content-Encoding · Accept-Encoding · Vary · Nginx

  Learn more at [https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Compression](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Compression)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## HTTP 传输压缩完全指南

gzip · deflate · brotli · zstd · Content-Encoding · Vary

<div class="absolute inset-0 flex items-center justify-center" style="pointer-events:none">
  <h1 class="text-7xl font-bold" style="background:linear-gradient(135deg,#42b883 10%,#35495e 90%);-webkit-background-clip:text;background-clip:text;color:transparent">传输压缩</h1>
</div>

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
传输压缩是 HTTP 响应字节流的无损编码，与构建期 Minification 正交叠加。
-->

---

# 什么是传输压缩

HTTP 响应送出网络前对**字节流**做无损编码减字节数

- **零客户端逻辑**：浏览器原生解压，开发者只配服务器
- **典型收益**：JS/CSS/HTML/SVG/JSON 可压 70% 以上
- **三大协议头**：`Accept-Encoding` / `Content-Encoding` / `Vary: Accept-Encoding`
- **服务器协商**：按客户端 q 值选最优算法，不强发未声明算法

**典型协商流程**

```text
请求：Accept-Encoding: br;q=1.0, gzip;q=0.8, *;q=0
响应：Content-Encoding: br + Vary: Accept-Encoding
浏览器按 Content-Encoding 自动解压
```

> 传输压缩 ≠ Minification（构建期源码改造）。两者**叠加**：100KB → 压缩 70KB → gzip 25KB。

<!--
强调"字节流无损编码"——解压后精确还原原字节。
-->

---

# 四大算法深度对比

| 算法 | RFC / 年 | 底层 | level | 覆盖 | 关键特性 |
|------|------|------|------|------|------|
| **gzip** | 1952 / 1996 | LZ77+Huffman | 1-9 | 100% | 兜底标准，甜点 6 |
| **deflate** | 1950·1951 / 1996 | raw / zlib | 1-9 | 全平台但**歧义** | 新项目弃用 |
| **brotli** | 7932 / 2016 | + Web 静态字典 | 0-11 | Chrome 50+ 等 | 文本主流，**仅 HTTPS** |
| **zstd** | 8478 / 2018 | FSE | -到 22 | Chrome 124+ 等 | 解压 >1GB/s |

**deflate 的坑**：RFC 2616 说 deflate = zlib（1950），但实际服务器常发 raw deflate（1951），浏览器只能试错兜底——新项目跳过

**brotli 的 HTTPS 约束**：`Accept-Encoding: br` 只出现在 HTTPS 请求里，避免 BREACH/CRIME 在加密通道上利用压缩比推断明文

**zstd 现状**：2026-02 进 Baseline，Safari 26 才追上，生产可用但需保留 br/gzip 兜底

<!--
解压速度与压缩级别基本无关——所以静态资源宁可用高级别离线压。
-->

---

# 三大协议头与协商

| 头部 | 方向 | 作用 |
|------|------|------|
| `Accept-Encoding` | 请求 | 客户端声明支持的算法 |
| `Content-Encoding` | 响应 | 服务器告知应用的算法 |
| `Vary: Accept-Encoding` | 响应 | 缓存键必须包含 Accept-Encoding |

```http
GET /app.js HTTP/2
Accept-Encoding: br;q=1.0, zstd;q=0.9, gzip;q=0.8, identity;q=0
```

```http
HTTP/2 200
Content-Encoding: br
Content-Length: 25301
Vary: Accept-Encoding
Cache-Control: public, max-age=31536000, immutable
```

- 浏览器未配 zstd → 服务器降级选 br（q=1.0）
- 服务器**不得强发**客户端未声明算法

<!--
q 值表达优先级，服务器在算法集合里挑最高 q 且自己支持的。
-->

---
layout: two-cols
---

# Content-Encoding 叠加

`Content-Encoding` 可多个值叠加，按**列出顺序**应用

```http
Content-Encoding: deflate, gzip
```

**编码方向**：先 deflate 再 gzip 包外层
**解码方向**：先解 gzip 再解 deflate（反向剥层）

实际生产**极少叠加**

- 单一 brotli 或 gzip 已是最佳点
- 叠加只增 CPU 开销与复杂度
- 常作为面试题而非生产实践

> `identity` 表示未编码（默认值，常省略）。

::right::

# Vary 的必要性

同一 URL 因 Accept-Encoding 返回不同字节

```text
URL: /app.js
  br      → 25KB br 字节
  gzip    → 30KB gzip 字节
  identity → 100KB 原字节
```

CDN 不把 Accept-Encoding 纳入缓存键 → 缓存中毒

1. Chrome 请求 → CDN 缓存 br 字节
2. 老爬虫请求 identity
3. CDN 命中 → **返回 br 字节**
4. 爬虫解不开 → **乱码**

> Vary: Accept-Encoding 把 Accept-Encoding 纳入缓存键。

<!--
Vary: Accept-Encoding 是 HTTP 压缩与缓存联动的关键。
-->

---

# Nginx gzip 配置（运行期）

```nginx
http {
  gzip on;               # 默认 off，必须显式
  gzip_comp_level 6;     # 默认 1，甜点 6
  gzip_vary on;          # 默认 off，必须显式（输出 Vary）
  gzip_proxied any;      # 默认 off
  gzip_min_length 1024;  # < 1KB 不压
  gzip_http_version 1.1; # 默认 1.1
  gzip_types
    text/plain text/css text/javascript
    application/javascript application/json
    application/xml image/svg+xml;
  gzip_disable "MSIE [1-6]\\.";
}
```

**默认值全是坑**：`gzip` off / `gzip_vary` off / `gzip_proxied` off / `gzip_comp_level` 1 / `gzip_types` 仅 text/html

<!--
最常见事故：开启 gzip 但忘开 gzip_vary，CDN 把压缩版串给不支持客户端。
-->

---
layout: two-cols
---

# Nginx brotli 配置

Google `ngx_brotli` 动态模块，配置与 gzip 同构

```nginx
http {
  brotli on;
  brotli_comp_level 6;   # 默认 6
  brotli_min_length 1024;
  brotli_types
    text/plain text/css text/javascript
    application/javascript application/json
    application/xml image/svg+xml;
  brotli_static on;      # 优先发 .br
}
```

brotli 默认 `brotli_comp_level` 6，`brotli_types` 仅 text/html。

::right::

# 静态预压缩（推荐）

构建期生成 `.br` + `.gz`，nginx 直发文件

```bash
# 批量生成 .br（level 11）
find dist -type f \( -name "*.js" \
  -o -name "*.css" -o -name "*.html" \) \
  -exec brotli -q 11 -k {} \;

# 批量生成 .gz（level 9）
find dist -type f \( -name "*.js" \
  -o -name "*.css" -o -name "*.html" \) \
  -exec gzip -9 -k {} \;
```

**优先级**：`brotli_static` > `gzip_static` > on-the-fly

> 零运行期 CPU，级别可拉满到 11/9。

<!--
静态预压缩是生产最佳实践——构建期付一次压缩成本，运行期直发文件。
-->

---
layout: two-cols
---

# 压缩级别甜点

| 算法 | 动态 | 离线 | 备注 |
|------|------|------|------|
| **gzip** | 6 | 9 | 9 仅多省 1-3% |
| **brotli** | 4-6 | 11 | 4-5 已胜 gzip 6 |
| **zstd** | 3-9 | 19-22 | 极限需 unlock |

**关键性质**：解压速度与级别基本无关

- 压缩耗时随级别近似**指数增长**
- 解压仍按算法本身的吞吐

**结论**：静态资源宁可用高级别离线压

::right::

# 不该压的二进制

下列已用更贴近数据特征的算法压过，再压**无效甚至变大**

- **图片**：JPEG / PNG / WebP / AVIF / GIF
- **视频**：MP4 / WebM
- **字体**：**WOFF2 已 brotli 压过**
- **档案**：`.tar.gz` / `.zip` / `.7z`

**Nginx 默认 `gzip_types` 不含这些 MIME 是有道理的**。

**压缩 vs Minification**：构建期源码（Terser，不可逆） vs 传输层字节流（gzip/brotli，**可逆**），两层独立、乘性叠加，缺一不可。

<!--
解压速度与级别无关——这是离线预压缩可以放心拉高级别的根本原因。
-->

---
layout: quote
---

# gzip_vary 默认 off 是大坑

「忘开 `gzip_vary on`，CDN 把 brotli 版本缓存给不支持 brotli 的爬虫，整站爬虫索引乱码——这是 HTTP 压缩最常见的生产事故。」

**`Vary: Accept-Encoding` 必开 · 缓存键必须包含它。**

---

# 反模式与陷阱

**最易踩的坑**

- 无脑 `gzip_comp_level 9` 用于动态响应（TTFB 飙升）
- 开 gzip 但忘开 `gzip_vary on`（**默认 off**，缓存中毒）
- 对图片/视频/WOFF2 也开压缩（二次压缩无效甚至变大）
- 不看 Accept-Encoding 强发 br（违反内容协商）
- 信任 `Content-Encoding: deflate` 跨平台互通（zlib/raw 歧义）
- 把传输压缩当 Minification（或反之，二者叠加）
- 以为开了 brotli 就不用 gzip（老 Safari/IE 不支持 br）
- 本地 `http://localhost` 调试看不到 brotli 误以为配错（明文 HTTP 不声明 br）

<!--
本地调试 brotli 必须 HTTPS，否则浏览器不发 Accept-Encoding: br。
-->

---
layout: center
class: text-center
---

# 小结

HTTP 传输压缩 = 字节流无损编码 · 浏览器自动解压

gzip（兜底） · brotli（HTTPS 文本主流） · zstd（2026 Baseline）

**zstd > br > gzip 优先级 · Vary:Accept-Encoding 必开 · 静态预压缩零 CPU**

[MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Encoding) · [web.dev](https://web.dev/articles/optimizing-content-efficiency-optimize-encoding-and-transfer) · [nginx gzip](https://nginx.org/en/docs/http/ngx_http_gzip_module.html) · [RFC 7932](https://www.rfc-editor.org/rfc/rfc7932) · [RFC 8478](https://www.rfc-editor.org/rfc/rfc8478)

<!--
掌握算法协商 + Vary 必要性 + 静态预压缩三件，传输压缩就到生产水准。
-->
