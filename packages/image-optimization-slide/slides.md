---
theme: seriph
background: https://cover.sli.dev
title: 前端图片优化完全指南
info: |
  前端图片优化完全指南：格式 · 响应式 · 压缩 · CDN · 防 CLS

  Learn more at https://web.dev/articles/choose-the-right-image-format
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 前端图片优化完全指南

格式 · 响应式 · 压缩 · CDN · 防 CLS · 2026-07 AVIF Baseline

<div @click="$slidev.nav.next" class="mt-12 py-1 hover:bg-white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
图片占整页字节 50%+，是性能优化最高性价比的杠杆。
-->

---
transition: fade-out
---

# 什么是图片优化

用尽量少的字节传输视觉无损的图，并尽量快地完成加载

- **占字节大头**：HTTP Archive 长期统计图片占整页字节 **50% 以上**
- **杠杆最大**：单点改动可获 **25–80%** 字节下降
- **影响多项指标**：LCP（首屏 hero）、CLS（布局抖动）、流量成本
- **未优化三症状**：加载慢 / CLS 高 / LCP 拖慢

> 桌面图喂手机会浪费 **2–4 倍流量**；超大图靠 CSS 缩放下载字节远超所需。

<!--
图片优化 = 字节更小 + 加载更快 + 视觉无损。
-->

---

# 四条主线

| 主线 | 关键 API | 核心目标 |
|------|------|------|
| **格式选型** | WebP / AVIF / JPEG / PNG / SVG | 同等视觉质量下字节更小 |
| **响应式图片** | `srcset` + `sizes` + `<picture>` | 不同设备 / 视口喂不同尺寸 |
| **压缩与解码** | quality 调参 / 剥元数据 / `decoding` / `width·height` | 字节更小 + 加载更不卡 |
| **图片 CDN** | URL 变换 / auto 模式 / `Vary: Accept` | 自动按需生成最优变体 |

> 优先用矢量格式（SVG），光栅图首选 AVIF/WebP。

<!--
四条主线覆盖 90% 的图片优化场景。
-->

---

# 格式对比表

| 格式 | 类型 | 节省 | 备注 |
|------|------|------|------|
| **AVIF** | 光栅 · 有损/无损 | 比 JPEG **−50%** | Baseline 2026 |
| **WebP** | 光栅 · 有损/无损 | 比 JPEG **−25~35%** | 现代但已稳定 |
| **JPEG** | 光栅 · 有损 | 基准 | 兜底首选 |
| **PNG** | 光栅 · 无损 | 偏大 | 透明 / UI |
| **SVG** | 矢量 | SVGO 后省 **58%** | 图标 / Logo |

**优先级**：AVIF → WebP → JPEG/PNG → SVG（矢量优先）

> GIF 做动画体积远大于 `<video>`，改用 MP4/WebM。

<!--
光栅图选 AVIF/WebP，老格式仅做兜底。
-->

---

# AVIF vs WebP

**AVIF**：压缩率最高

- 比 JPEG 小约 **50%**、比 WebP 小 **20–30%**
- **Baseline 2026 newly available**（全球约 96%）
- Chrome 85+ / Edge 90+ / Firefox 93+ / Safari 16+
- 支持有损 + 无损 + 透明 + 动画 + 12-bit 色深

**WebP**：普及最广

- 比 JPEG 省 **25–35%**
- Chrome 32+ / Firefox 65+ / Safari 14+ / Edge 18+
- 现代但已稳定可用

> 编码 AVIF 比 WebP 慢，但解码速度相当；批量压需考虑机器预算。

<!--
AVIF 是 2026 起的新基准，WebP 仍是兼容回退。
-->

---

# 响应式图片：srcset

让浏览器根据设备能力从候选列表里选最合适的图

```html
<!-- 分辨率切换：w 描述符 + sizes -->
<img
  src="hero-800.jpg"
  srcset="hero-480.jpg 480w, hero-800.jpg 800w, hero-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="hero"
>
```

- **w 描述符**：须配 `sizes`，用于「同一张图不同尺寸」
- **x 描述符**：无需 `sizes`，用于「图标按 DPR 切换」

> 用 `srcset` 而非 CSS/JS——浏览器在解析 HTML 时就开始预加载图片。

<!--
srcset 存在的根本原因：预加载早于 CSS/JS。
-->

---
layout: two-cols
---

# srcset 两类描述符

**宽度描述符（w）**：`URL 宽度w`，**必须配 `sizes`**，`src` 作 1x 候选；适用「同图不同尺寸」

**像素密度描述符（x）**：`URL 密度x`，**无需 `sizes`**，1x 可省略；适用「图标按 DPR 切换」

**铁律**

- w 与 x **不可混用**（`a.jpg 480w, b.jpg 2x` 非法）
- 同描述符不可重复

::right::

# 漏写 sizes = 整个 srcset 被忽略

**反模式**

- 用 w 漏写 `sizes`：srcset 被忽略、退回只加载 `src`
- 同 srcset 出现两个 `2x`：也无效
- JS 检测视口改 `src`：多下一次原图、**这就是 srcset 存在的根本原因**

```html
<!-- 错误：会失效 -->
<img src="a.jpg"
  srcset="a.jpg 480w, b.jpg 800w">
```

<!--
混用 / 漏 sizes 是最常见的 srcset 错误。
-->

---

# sizes 规则

```text
sizes="media-condition slot, media-condition slot, default-slot"
```

- **媒体条件描述视口不是图片**（如 `(max-width: 600px)`）
- **取第一个为真的条件、其后全忽略**
- **槽宽禁止百分比**；可用 px / vw / calc / em
- **最后一项省略媒体条件**作默认

```html
<img src="hero-800.jpg"
  srcset="hero-480.jpg 480w, hero-800.jpg 800w, hero-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="hero">
```

> 偏大选浪费带宽、偏小选模糊图——必须贴近真实 CSS 显示宽度。

<!--
sizes 决定浏览器从 srcset 里选哪张。
-->

---
layout: two-cols
---

# `<picture>` 两种用途

**Art direction（media）**

不同视口换不同裁切图

```html
<picture>
  <source media="(max-width: 600px)"
    srcset="hero-mobile.jpg">
  <source media="(min-width: 601px)"
    srcset="hero-desktop.jpg">
  <img src="hero.jpg" alt="hero">
</picture>
```

手机看竖裁切，桌面看横构图。

::right::

# 格式协商（type）

写 MIME 选最优格式

```html
<picture>
  <source type="image/avif"
    srcset="hero.avif">
  <source type="image/webp"
    srcset="hero.webp">
  <img src="hero.jpg" alt="hero">
</picture>
```

回退链：**AVIF → WebP → JPEG**

**铁律**

- `<img>` 必须放最后
- `<img>` 必须用 JPEG/PNG 兜底

<!--
picture = art direction + 格式协商；img 必须最后兜底。
-->

---

# 压缩工具链

```bash
# WebP（cwebp）—— quality 50-70 区间视觉差异小
cwebp -q 65 input.jpg -o output.webp

# AVIF（avifenc / libavif）
avifenc --min 30 --max 50 input.jpg output.avif

# ImageMagick（resize）
convert input.jpg -resize 33% output.jpg

# Node（sharp）
node -e "require('sharp')('in.jpg').resize(800).webp({quality:65}).toFile('out.webp')"

# SVG（SVGO）—— 去编辑器元数据 + 服务器 GZIP
svgo icon.svg -o icon.min.svg
```

> 别怕调低 quality：50–70 区间视觉差异小但字节节省显著；用 Butteraugli/SSIM 防过度压缩。

<!--
人眼对质量损失不敏感，大胆调低。
-->

---
layout: two-cols
---

# decoding 防 CLS

**`decoding` 三值**

- **`async`**：下次绘制不等解码
  - 对 **JS 动态插入的图** 效果最明显
- **`sync`**：与 DOM 一起渲染
- **`auto`**（默认）：浏览器自决

```html
<img src="hero.jpg" decoding="async" alt="hero">
```

> 首屏静态 `<img>` 上 `async` 几乎无感——别滥用。

::right::

# `width/height` 防 CLS

写明固有宽高让浏览器算出 `aspect-ratio`

```html
<img src="hero.jpg" width="800" height="600" alt="hero">
```

- 与 `srcset/sizes` 配合使用
- 图片真实显示尺寸由 CSS 控制
- `width/height` 仅提供比例

**`HTMLImageElement.decode()`**

```js
const img = new Image();
img.src = "hero.jpg";
await img.decode();
document.body.appendChild(img);
```

返回 Promise，避免「先空图再跳变」。

<!--
decoding=async 给动态插入的图；width/height 防抖动。
-->

---

# 图片 CDN

通过 URL 按需生成变体，配合 auto 模式自动选最优格式 + 尺寸

```text
https://cdn.example.com/image/secure-key/hero.jpg?width=800&quality=65&format=auto

        origin          /image/security-key/file   ?transformations
```

**URL 四要素**

- **origin**：自有域名（避免换 CDN 改 URL）
- **image**：源图
- **security-key**：防他人生成新变体
- **transformations**：`auto` 由 CDN 按信号自动选

**auto 模式依据**：Client Hints · Save-Data · User-Agent · Network Information API

> 切换 CDN 通常省 **40–80% 图片字节**；跨源 CDN 务必 `preconnect` + LCP 图加 `fetchpriority="high"`。

<!--
CDN 把「手写大量 source」自动化。
-->

---

# HTTP Accept 头协商

服务端读 `Accept: image/webp,image/avif…` 选最优格式返回

```apache
# Apache mod_rewrite 示例（web.dev）
RewriteCond %{HTTP_ACCEPT} image/webp
RewriteCond %{HTTP_ACCEPT} !image/avif
RewriteRule (.*)\.(jpg|png)$ $1.webp [L]
Header append Vary Accept
```

- 服务端协商比 `<picture>` 客户端协商**更省 HTML 结构**
- **必须设 `Vary: Accept`**——否则缓存把 WebP 给到不支持 AVIF/WebP 的浏览器（**串味**）

> 推荐做法：`<picture>` 客户端协商 + CDN 服务端协商 二选一或并用。

<!--
Vary: Accept 是服务端协商的必选项。
-->

---
layout: quote
---

# 图片 ≠ 真相

「桌面图喂手机会浪费 2–4 倍流量——这就是 `srcset` 存在的根本原因。」

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- srcset 混用 w 和 x 描述符（非法，浏览器未定义）
- 用 w 漏写 sizes（整个 srcset 被忽略、退回 src）
- sizes 用百分比（规范禁止）
- `<picture>` 漏 `<img>` 或 `<img>` 用 WebP 兜底（老浏览器破图）
- JS 检测视口改 `src`（多下一次原图）
- 用 GIF 做动画（改用 `<video>`）
- 文字烘进图片（改用 web font）
- 滥用 `decoding="async"`（首屏静态图几乎无感）
- 跨源 CDN 不 preconnect、LCP 图不加 `fetchpriority="high"`
- 只生成 1 张超大图靠 CSS 缩放（2–4x 流量浪费）

<!--
把这 10 条反模式刻在脑子里。
-->

---
layout: center
class: text-center
---

# 小结

前端图片优化 = 字节更小 + 加载更快 + 视觉无损

格式 · 响应式 · 压缩 · CDN · 防 CLS

**AVIF → WebP → JPEG · srcset+sizes · decoding+width/height · 图片 CDN auto**

[web.dev 图片优化](https://web.dev/articles/choose-the-right-image-format) · [MDN 响应式图片](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images) · [caniuse AVIF](https://caniuse.com/AVIF)

<!--
四条主线 + 防 CLS + CDN 自动化，图片优化到生产水准。
-->
