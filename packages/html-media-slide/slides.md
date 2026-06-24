---
theme: seriph
background: https://cover.sli.dev
title: HTML 图片与多媒体
info: |
  HTML 媒体元素 —— img / picture / audio / video / iframe / SVG，从防抖到安全
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:html-5 class="text-8xl" />
</div>

<br/>

## HTML 图片与多媒体

让图片不抖、视频可控、嵌入安全（基于 HTML Living Standard）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
媒体是网页里最占流量、也最容易写错的部分：图片抖动、视频外放、iframe 漏洞，全在这一章解决。
-->

---
transition: fade-out
---

# 这一章讲什么

把「图片、音视频、嵌入」三类媒体写「正确且现代」

<v-click>

- **图片**：`<img>` 防抖 + 懒加载 → 响应式 → `<picture>` 换图换格式
- **音视频**：`<audio>` / `<video>` 控件、封面、自动播放、字幕
- **嵌入**：`<iframe>` 安全沙箱、`<object>` / `<embed>`、SVG / MathML

</v-click>

<v-click>

> 媒体写错的代价很直观：首屏抖动、流量爆炸、视频突然外放、第三方脚本越权——大多**不报错**，却伤体验与安全。

</v-click>

---

# 位图还是矢量：先分清

选错类型，后面怎么优化都事倍功半

| 类型 | 代表格式 | 适合 |
| --- | --- | --- |
| **位图（光栅）** | JPEG / PNG / WebP / AVIF | 照片、复杂渐变、真实场景 |
| **矢量** | SVG | 图标、Logo、插画、图表 |

<v-click>

经验法则：**照片用位图**（优先 AVIF / WebP，JPEG 兜底）；**图标 / Logo 用 SVG**（无限缩放都清晰，还能用 CSS 改色）。

</v-click>

---
layout: section
---

# 第一部分：`<img>` 基础

最小写法、`alt`、防抖、性能

---

# `<img>`：最小写法

`<img>` 是**空元素**（无闭合标签），最少两个属性

```html
<img src="cat.jpg" alt="一只橘猫趴在键盘上睡觉" />
```

<v-click>

- `src`：图片地址，**必填**——浏览器据此下载渲染
- `alt`：替代文字，**必写**——读屏朗读、加载失败时显示、SEO 据它理解图意

</v-click>

<v-click>

::: tip `src` 与 `srcset` 至少有一个
日常都写 `src`（也是旧浏览器兜底）；`srcset` 是在它之上做响应式的增强。
:::

</v-click>

---

# `alt`：写「信息」不写「长相」

原则只有一条：写图**传达的信息 / 作用**，而非外观

| 场景 | ❌ 别写 | ✅ 应该写 |
| --- | --- | --- |
| 搜索按钮图标 | `放大镜图片` | `搜索` |
| 折线图 | `一张折线图` | `销售额逐年增长，2025 达 1.2 亿` |
| 纯装饰分隔线 | `装饰线条` | `""`（空值，读屏跳过） |

<v-click>

别写「一张图片 / 截图 / 照片」——`<img>` 本身已告诉读屏「这是图」，再念是噪音。

</v-click>

---

# 装饰图：`alt=""` 而非省略

空 `alt` 与「没有 `alt` 属性」是**两回事**

```html
<!-- ✅ 装饰图：空 alt，读屏直接跳过 -->
<img src="divider.svg" alt="" />

<!-- ❌ 省略 alt：部分读屏会去念文件名 "divider.svg" -->
<img src="divider.svg" />
```

<v-click>

- 空 `alt=""`：明确告诉读屏「无信息，跳过」
- 缺 `alt` 属性：某些读屏退而念出文件名 / URL
- 纯装饰图更建议用 CSS `background-image`，内容图才进 HTML

</v-click>

---

# `width` / `height`：一行属性消灭抖动

性能上最划算的一笔投资

```html
<img src="hero.jpg" alt="产品主视觉" width="1200" height="630" />
```

<v-click>

值是**整数、无单位**（固有像素），不是 `1200px`。浏览器在图**还没下载完**时就据此算出宽高比、提前占住空白格子——图到位直接填入，不挤跑下方内容。

</v-click>

<v-click>

这就避免了**累积布局偏移（CLS）**——Core Web Vitals 三大指标之一，漏写尺寸是它最常见的成因。

</v-click>

---

# 防抖 + 响应式不冲突

现代 CSS 改写显示宽度，HTML 尺寸仍提供**宽高比**

```css
img {
  height: auto;     /* 高度按宽高比自动算，避免变形 */
  max-width: 100%;  /* 不超出容器 */
}
```

<v-click>

- 写死 `width` / `height` → 提供宽高比、防抖
- CSS `max-width: 100%` → 自适应容器
- CSS `height: auto` → 按比例算高，不变形

两者配合：既响应式又不抖动。

</v-click>

---

# `loading`：原生懒加载

控制图片**何时**开始下载

| 取值 | 行为 |
| --- | --- |
| `eager` | 立即下载，不管在不在视口（**默认**） |
| `lazy` | 延迟到接近视口再下载，省流量、快首屏 |

<v-click>

- **首屏外的图用 `lazy`**：中段插图、靠下卡片
- **首屏主图别用 `lazy`**：它常是 LCP 元素，懒加载反拖慢首屏
- **懒加载图必须写死尺寸**：未加载时是 0×0，否则抖得更狠

</v-click>

---

# 懒加载与 JS 的关系

::: warning 反追踪设计
原生懒加载**只在启用 JavaScript 时生效**——否则禁脚本也懒加载，站点就能靠请求时机反推用户滚动位置。
:::

<v-click>

另一个易踩点：视口内的懒加载图在 `load` 事件触发时**可能尚未加载完**，别在 `load` 里假设所有图都就绪。

</v-click>

---

# `decoding` 与 `fetchpriority`

两个微优化，给动态大图与 LCP 主图

```html
<img src="hero.jpg" alt="主视觉" width="1200" height="630"
     fetchpriority="high" decoding="async" />
```

<v-click>

- `decoding`：`sync` / `async` / `auto`（默认）——JS 动态插大图时 `async` 避免解码阻塞主线程
- `fetchpriority`：给首屏 LCP 主图加 `high` 抢优先级；新近能力，老浏览器忽略，锦上添花

</v-click>

---

# 一份「认真写」的 `<img>`

各属性各司其职

```html
<img
  src="photo-800.jpg"
  srcset="photo-480.jpg 480w, photo-800.jpg 800w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="工程师在白板上画系统架构"
  width="1200" height="800"
  loading="lazy" decoding="async" />
```

<v-click>

`src` 兜底、`srcset`/`sizes` 响应式、`width`/`height` 防抖、`loading`/`decoding` 性能。其中挑图逻辑，是下一部分的主题。

</v-click>

---
layout: section
---

# 第二部分：响应式图片

`srcset` + `sizes`，让浏览器自己挑

---

# 为什么需要响应式图片

设备从 320px 手机到 4K 屏，密度 1×～3×

<v-click>

只发一张大图的代价：

- **手机白下大图**：流量、电量浪费，慢网首屏卡很久
- **位图放大变糊**：480px 拉到 1200px 显示会发虚

</v-click>

<v-click>

理想：浏览器**按当前设备自动挑最划算的那份**。`<img>` 的 `srcset` / `sizes` 负责「同图、不同尺寸 / 清晰度」。

</v-click>

---

# 为什么不能用 JS 换图

::: warning 预加载扫描器抢跑
浏览器在主解析器处理 CSS / JS **之前**，就抢先把图片请求发出去了（为了加速）。
:::

<v-click>

后果：你没法「先放 `<img>`、JS 测视口、再换小图」——等 JS 跑起来原图早下完，再换只会**下两张**，更糟。

所以响应式图片**必须由 HTML 声明、交给浏览器决策**。

</v-click>

---

# 宽度描述符 + `sizes`（最常用）

`srcset` 给候选图 + 固有宽度，`sizes` 给显示宽度

```html
<img
  srcset="photo-480.jpg 480w, photo-800.jpg 800w, photo-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  src="photo-800.jpg" alt="风景照"
  width="1200" height="800" />
```

<v-click>

- `480w` = 图**本身**就是 480 像素宽（固有宽度，非显示宽度）
- 用了 `w` 描述符，就**必须**搭配 `sizes`

</v-click>

---

# `sizes`：在各条件下占多宽

每项 =「媒体条件 + 空格 + 槽位宽度」

```text
sizes="(max-width: 600px) 100vw, 50vw"
```

<v-click>

- `(max-width: 600px) 100vw`：视口 ≤ 600px 时占满整宽
- `50vw`：**最后一项不带条件**，作默认（其余情况占一半）

</v-click>

<v-click>

硬规则：可用 `vw` / `px` 但**不能用百分比**；浏览器只认**第一个匹配**的条件，从窄到宽排好。

</v-click>

---

# 浏览器到底怎么挑

四步算出「理想图宽」再选图

<v-click>

1. 评估屏幕尺寸、像素密度、缩放、方向、网络
2. 找 `sizes` 里**第一个为真**的条件 → 得到槽位宽度
3. 槽位宽 × 设备像素比 → 理想图宽
4. 在 `srcset` 里挑**最接近、且通常不小于**理想宽的那张

</v-click>

<v-click>

例：1000px 视口（槽位 50vw=500px），普通屏选 `photo-800.jpg`（比 500 大的第一张）。手机因此不白下 1200px。

</v-click>

---

# 像素密度描述符（换清晰度）

显示尺寸**固定**、只想视网膜更清晰——**不需要 `sizes`**

```html
<img
  srcset="avatar-320.jpg, avatar-480.jpg 1.5x, avatar-640.jpg 2x"
  src="avatar-640.jpg" alt="用户头像"
  width="320" height="320" />
```

<v-click>

- 第一项不写描述符 = 隐含 `1x`
- `2x` = 「2 设备像素对 1 CSS 像素」的高 DPI 屏用这张
- 配 CSS 把显示宽度定死（如 `width: 320px`）

</v-click>

---

# `w` 与 `x` 怎么选

::: tip 二选一，绝不混写
- **显示宽度随布局变**（响应式占位）→ 用 `w` + `sizes`
- **显示尺寸固定、只换清晰度**（头像 / Logo）→ 用 `x`
- 同一个 `srcset` 里**绝不混写** `w` 与 `x`
:::

<v-click>

优先考虑 `w` + `sizes`：更灵活，且省流量模式下浏览器能自行降级。`src` 始终留着，作不支持 `srcset` 的旧浏览器兜底。

</v-click>

---

# 手写还是交给框架 / CDN

挑图逻辑简单，**生成多份尺寸**很烦

<v-click>

- **图片 CDN**（Cloudinary / imgix / 又拍云）：按 URL 参数实时生成各尺寸 / 各格式
- **构建期插件**（`vite-imagetools` / Next.js `<Image>` / Astro `<Image>`）：打包时自动产出 `srcset` 与 AVIF / WebP

</v-click>

<v-click>

无论用哪种，背后产出的仍是这套 `srcset` / `sizes` 标记——理解原理才能调参、排查「为什么挑错图」。

</v-click>

---
layout: section
---

# 第三部分：`<picture>`

换裁切（art direction）与换格式

---

# `<picture>` 的工作方式

单个 `<img>` 只能换尺寸；换**裁切 / 格式**请出 `<picture>`

```html
<picture>
  <source srcset="..." media="..." />
  <source srcset="..." type="..." />
  <img src="fallback.jpg" alt="..." />
</picture>
```

<v-click>

`<picture>` 不渲染任何东西，它是个「**选择器**」：自上而下挑**第一个匹配**的 `<source>`；都不匹配就回落到末尾 `<img>`。

</v-click>

---

# `<img>` 兜底必须写

::: warning 漏写 `<img>`，整个 `<picture>` 不显示
里面的 `<img>` 不是可选项，它有双重身份：
- 给所有 `<source>` 不匹配、以及不支持 `<picture>` 的旧浏览器兜底
- 承载图片的 `alt`、`width` / `height` 等属性
:::

<v-click>

它必须放在**所有 `<source>` 之后**、`</picture>` 之前。

</v-click>

---

# 用法一：art direction（换裁切）

横构图缩到手机成「中央一个小人」→ 窄屏换竖图

```html
<picture>
  <source media="(max-width: 600px)" srcset="hero-portrait.jpg" />
  <source media="(min-width: 601px)" srcset="hero-landscape.jpg" />
  <img src="hero-landscape.jpg" alt="团队山顶合影"
       width="1200" height="800" />
</picture>
```

<v-click>

`media` 选**第一个为真**的 source：窄屏竖图、宽屏横图。这里换的是**不同裁切的图**，而非同图的大小。

</v-click>

---

# `media` 也能按主题换图

亮暗模式各用一张 Logo

```html
<picture>
  <source srcset="logo-dark.png" media="(prefers-color-scheme: dark)" />
  <source srcset="logo-light.png" media="(prefers-color-scheme: light)" />
  <img src="logo-light.png" alt="产品 Logo" width="160" height="40" />
</picture>
```

<v-click>

::: tip `media` 与 `sizes` 不要同时上
官方明确：用了 `media`（art direction）就别在 `sizes` 里再写媒体条件，两者都想「按视口选」会打架。
:::

</v-click>

---

# 用法二：格式回退（AVIF / WebP）

现代格式同画质比 JPEG / PNG 小得多

```html
<picture>
  <source type="image/avif" srcset="photo.avif" />
  <source type="image/webp" srcset="photo.webp" />
  <img src="photo.jpg" alt="产品照片" width="1000" height="600" />
</picture>
```

<v-click>

`type` 是 MIME 类型。浏览器从上往下：支持 AVIF 就下，不支持跳过看 WebP，再不支持用 `<img>` 的 JPEG。**铁律：最现代的格式放最前**。

</v-click>

---

# 为什么 `type` 比「直接给 .webp」省

::: tip 决策发生在请求之前
只写 `<img src="photo.webp">` → **所有**浏览器都去请求它（不支持的请求后才失败）。
:::

<v-click>

而 `<picture type>` 让浏览器**仅凭格式支持就决定要不要发请求**——不支持的格式直接跳过、零浪费。这正是 `<picture>` 相比 JS 方案的关键优势。

</v-click>

---

# 合体：换格式 + 换尺寸

每种格式各给多个尺寸，`<source>` 也能写 `srcset` + `sizes`

```html
<picture>
  <source type="image/avif"
    srcset="p-480.avif 480w, p-800.avif 800w" sizes="50vw" />
  <source type="image/webp"
    srcset="p-480.webp 480w, p-800.webp 800w" sizes="50vw" />
  <img src="p-800.jpg"
    srcset="p-480.jpg 480w, p-800.jpg 800w" sizes="50vw"
    alt="照片" width="1200" height="800" />
</picture>
```

<v-click>

先按 `type` 选格式分支，再在该分支按视口挑尺寸——「认真做优化」的完全体，通常由工具自动产出。

</v-click>

---

# 别用错工具：四象限

换什么，决定用 `<img>` 还是 `<picture>`

| 需求 | 用什么 | 关键属性 |
| --- | --- | --- |
| 不同**尺寸**（省流量） | `<img>` | `srcset` `w` + `sizes` |
| 不同**清晰度**（视网膜） | `<img>` | `srcset` `2x` |
| 不同**裁切 / 图** | `<picture>` | `<source media>` |
| 不同**格式**（AVIF / WebP） | `<picture>` | `<source type>` |

<v-click>

视网膜屏**别滥用** `<picture media>`——用 `<img srcset>` 的 `x` 即可，省流量模式还能自动降级。

</v-click>

---

# `object-fit` 写在 `<img>` 上

各 source 比例不一、想统一显示框时

```css
picture img {
  width: 100%;
  height: 240px;
  object-fit: cover;       /* 填满框、超出裁掉，比例不变形 */
  object-position: center;
}
```

<v-click>

`<picture>` 自身只是逻辑容器，真正被渲染、被 CSS 作用的是里面那个 `<img>`——所以 `object-fit` / `object-position` 要写在**子 `<img>`** 上。

</v-click>

---
layout: section
---

# 第四部分：音频与视频

控件、封面、自动播放、字幕

---

# `<video>`：可控、带封面、多格式

最实用的视频写法

```html
<video controls poster="poster.jpg" preload="metadata"
       width="640" height="360">
  <source src="movie.webm" type="video/webm" />
  <source src="movie.mp4" type="video/mp4" />
  <track default kind="captions" srclang="zh"
         label="中文" src="captions.vtt" />
  你的浏览器不支持视频，请 <a href="movie.mp4">下载观看</a>。
</video>
```

<v-click>

子 `<source>` 列多格式（选**第一个能播的**），开闭标签间文字是不支持时的兜底。

</v-click>

---

# `<video>` 关键属性

| 属性 | 作用 |
| --- | --- |
| `controls` | 显示播放 / 音量 / 进度控件——**几乎总要写** |
| `poster` | 加载 / 未播时的封面图；不写用首帧 |
| `preload` | 预加载策略（见下页） |
| `muted` / `loop` | 初始静音（自动播放前提）/ 循环重播 |
| `playsinline` | 移动端内联播放、不强制全屏 |

---

# `preload`：先下多少

权衡「秒播体验」与「流量浪费」（仅是提示）

| 取值 | 行为 |
| --- | --- |
| `none` | 不预载——最省流量，起播慢 |
| `metadata` | 只取时长 / 尺寸——**常用折中** |
| `auto` | 可下整片——起播最快，最费流量 |

<v-click>

准则：**列表 / 长页里的视频用 `none` 或 `metadata`**，避免一进页面就吃流量。注意 `autoplay` 会**压过** `preload`。

</v-click>

---

# 自动播放：为什么必须 `muted`

最容易踩的坑——浏览器默认**拦截带声音的自动播放**

```html
<!-- ✅ 能自动播：静音 -->
<video autoplay muted loop playsinline width="640" height="360">
  <source src="bg.webm" type="video/webm" />
</video>

<!-- ❌ 大概率被拦：带声音的自动播放 -->
<video autoplay>...</video>
```

<v-click>

「无声背景视频」四件套：`autoplay muted loop playsinline`。但别让关键信息只靠背景视频传达。

</v-click>

---

# 布尔属性的反直觉点

::: warning 关掉布尔属性要「删掉」，不是设 false
- `autoplay="false"` **无效**——属性只要**存在**就为真，要关掉得把整个 `autoplay` 删掉
- `muted="false"` 同样无法「取消静音」，删掉才有声
:::

<v-click>

`controls`、`loop`、`playsinline` 等都是布尔属性，遵循同一规则：**有即真，删才假**。

</v-click>

---

# `<audio>`：和 `<video>` 几乎一致

**但没有** `poster` / `width` / `height` / `playsinline`（无画面）

```html
<audio controls preload="metadata">
  <source src="song.opus" type="audio/ogg; codecs=opus" />
  <source src="song.mp3" type="audio/mpeg" />
  请 <a href="song.mp3" download>下载音频</a>。
</audio>
```

<v-click>

同样支持 `controls` / `autoplay` / `muted` / `loop` / `preload` / `crossorigin`，自动播放受同样的静音策略约束。

</v-click>

---

# 多格式回退：`<source>` 挑选规则

浏览器对编解码支持不一，一次列多份由它挑

<v-click>

- 浏览器**自上而下**尝试，用**第一个能解码**的 `<source>`
- `type` 让浏览器**不下载就预判**能否播，可带 `codecs` 进一步声明
- 全部失败时，`error` 事件在 `<video>` / `<audio>` 上触发（**不在**单个 `<source>`）

</v-click>

<v-click>

「双发」最稳：视频 **WebM（VP9 / AV1）+ MP4（H.264）**，音频 **Opus + MP3**。

</v-click>

---

# 字幕与文本轨：`<track>`

无障碍的关键，指向 **WebVTT**（`.vtt`）文件

```html
<video controls width="640" height="360">
  <source src="movie.mp4" type="video/mp4" />
  <track default kind="captions" srclang="zh"
         label="中文" src="captions-zh.vtt" />
  <track kind="captions" srclang="en"
         label="English" src="captions-en.vtt" />
</video>
```

<v-click>

`src` 必填、`srclang` 是 BCP 47 语言、`label` 显示在控件菜单、`default` 标默认轨（**每种 `kind` 只能标一个**）。

</v-click>

---

# `<track>` 的 `kind` 取值

字幕 vs 闭合字幕，区别在「是否含音效」

| `kind` | 用途 |
| --- | --- |
| `subtitles` | 字幕：对白转写 / 翻译（外语，默认值） |
| `captions` | 闭合字幕：对白 + 音效 + 音乐（听障 / 静音） |
| `descriptions` | 视觉描述：画面转可朗读文本（视障） |
| `chapters` | 章节标题：供导航跳转 |
| `metadata` | 脚本用，不直接展示 |

<v-click>

跨域 `.vtt` 需给父 `<video>` 加 `crossorigin`，否则字幕加载被拦。

</v-click>

---

# 一个最小 WebVTT 文件

首行固定 `WEBVTT`，每条「时间轴 + 文本 + 空行」

```text
WEBVTT

00:00:00.000 --> 00:00:03.000
大家好，欢迎收看本期内容。

00:00:03.500 --> 00:00:07.000
今天我们聊聊 HTML 多媒体。
```

<v-click>

`-->` 两侧是 `时:分:秒.毫秒`。比贴图字幕更可访问、可搜索、可随窗口缩放。

</v-click>

---

# `controlslist`：收敛控件项

显示了 `controls`、又想藏某些按钮时用

```html
<video controls controlslist="nodownload nofullscreen"
       width="640" height="360">
  <source src="movie.mp4" type="video/mp4" />
</video>
```

<v-click>

可选 token：`nodownload`（去下载）/ `nofullscreen`（去全屏）/ `noremoteplayback`（去投屏）。

</v-click>

<v-click>

::: warning 只是视觉收敛
它不构成真正的访问控制——用户仍可能通过其他途径拿到资源。
:::

</v-click>

---
layout: section
---

# 第五部分：`<iframe>` 与安全

沙箱、权限策略、最小授权

---

# `<iframe>`：嵌入一整个文档

代价不小，能不用就不用、要用就最小授权

```html
<iframe
  src="https://example.com/widget"
  title="第三方小工具"
  sandbox="allow-scripts"
  allow="fullscreen"
  loading="lazy"
  referrerpolicy="strict-origin"
  width="600" height="400"></iframe>
```

<v-click>

每个 iframe 都是一套完整文档环境、吃额外内存。`title` **必写**——读屏靠它说明框内容，缺了等于无名黑框。

</v-click>

---

# `src` vs `srcdoc`

`srcdoc` 直接内联 HTML，**优先级高于 `src`**

```html
<!-- 加载外部地址 -->
<iframe src="https://example.com/" title="示例站"></iframe>

<!-- 直接内联一段 HTML，配空 sandbox 渲染不可信片段 -->
<iframe sandbox srcdoc="<p>被完全沙箱化的内容</p>"
        title="内联片段"></iframe>
```

<v-click>

`srcdoc` 特别适合「渲染用户生成 / 不可信的 HTML 片段」——配合空 `sandbox` 把它彻底关进笼子。

</v-click>

---

# `sandbox`：默认全禁、按需放开

iframe 安全的核心

```html
<!-- 空 sandbox：最严——禁脚本 / 表单 / 弹窗 / 同源身份… -->
<iframe sandbox src="untrusted.html" title="不可信内容"></iframe>

<!-- 只放开「跑脚本」，仍不保留源身份 -->
<iframe sandbox="allow-scripts" src="untrusted.html"
        title="不可信内容"></iframe>
```

<v-click>

- **空值 = 施加所有限制**，安全级别最高
- **加 token = 逐项解除**，给多少权限放多少 token

</v-click>

---

# 常用 sandbox token

给多少权限放多少 token

| token | 解除的限制 |
| --- | --- |
| `allow-scripts` | 允许跑脚本 |
| `allow-forms` | 允许提交表单 |
| `allow-popups` | 允许弹窗 / `target="_blank"` |
| `allow-same-origin` | 保留源身份（**慎用**） |
| `allow-top-navigation-by-user-activation` | 用户手势才能跳顶层 |

---

# 安全红线：两个 token 不可同源共用

`<iframe>` 安全最关键的一条

::: warning 同源时绝不同开
**同源**时绝不同时给 `allow-scripts` 和 `allow-same-origin`——这会让框内文档**有能力删掉自己的 `sandbox`**，沙箱形同虚设，等于完全没加沙箱。
:::

<v-click>

```html
<!-- ✅ 给脚本、不给同源身份 -->
<iframe sandbox="allow-scripts" src="https://untrusted.example/app"></iframe>
```

一句话：**给脚本权限，就别给同源身份**（或确保嵌的是异源内容）。

</v-click>

---

# `allow`：权限策略，授予设备能力

`sandbox` 管文档级行为；`allow` 管**设备能力**

```html
<iframe
  src="https://meet.example.com/room"
  title="视频会议"
  allow="camera; microphone; fullscreen"></iframe>
```

<v-click>

常见 token：`camera` / `microphone` / `geolocation` / `fullscreen` / `autoplay` / `payment` / `usb`，后面还能限来源（`geolocation 'self'`）。

</v-click>

---

# `allow` 是「再收紧」不是「放开」

它在父页 `Permissions-Policy` 头**之上再加限制**

::: tip 默认最小授权
- 父页头里没授予的能力，`allow` 也给不了框
- 未列入 `allow` 的能力，在跨域 iframe 里默认是被禁的
:::

<v-click>

两个历史属性已被取代：`allowfullscreen` → `allow="fullscreen"`，`allowpaymentrequest` → `allow="payment"`，新代码直接用 `allow`。

</v-click>

---

# `loading` 与 `referrerpolicy`

省资源 + 控信息泄露

```html
<iframe src="https://maps.example.com/embed" title="地图"
        loading="lazy" referrerpolicy="strict-origin"
        width="600" height="400"></iframe>
```

<v-click>

- `loading="lazy"`：iframe 往往很重，首屏外延后加载（仅启用 JS 时生效）
- `referrerpolicy`：跨域嵌入第三方时，常用 `strict-origin` 或更严的 `no-referrer` 减少信息泄露

</v-click>

---

# 尺寸：CSS 盖过 HTML 属性

`width` / `height` 默认 300×150，实战用 CSS 控

```css
iframe {
  border: 0;             /* 去掉默认边框 */
  width: 100%;           /* 盖过 HTML width 属性 */
  aspect-ratio: 16 / 9;  /* 保持比例，避免抖动 */
}
```

<v-click>

**默认安全模板**回顾：`title` 必写、`sandbox` 从严起步、`allow` 精确授权、`loading="lazy"` 省资源、`referrerpolicy` 控泄露，且牢记**同源别同开两个 token**。

</v-click>

---
layout: section
---

# 第六部分：映射、object / embed、SVG

热区、资源嵌入、矢量与公式

---

# 图像映射：一张图、多个热区

`<img usemap>` 关联 `<map>`，内含多个 `<area>`

```html
<map name="infographic">
  <area shape="circle" coords="75,75,40"
        href="/css" alt="CSS 部分" />
  <area shape="rect" coords="10,10,90,50"
        href="/js" alt="JavaScript 部分" />
</map>
<img usemap="#infographic" src="info.png"
     alt="三大语言信息图" width="260" height="240" />
```

<v-click>

`<map name>` 起名，`<img usemap="#名字">` 引用（`#` 必带）。`<area>` 有 `href` 时 `alt` **必写**。

</v-click>

---

# `<area>` 的 `coords` 格式

坐标单位为图内像素，原点在左上角

| `shape` | `coords` 格式 | 含义 |
| --- | --- | --- |
| `rect` | `x1,y1,x2,y2` | 左上角、右下角两点 |
| `circle` | `x,y,r` | 圆心坐标 + 半径 |
| `poly` | `x1,y1,x2,y2,…` | 依次连接的各顶点 |
| `default` | 无 | 整张图（兜底） |

<v-click>

::: warning 可用性短板
键盘 / 读屏支持弱，坐标写死、图一缩放就错位。现代推荐**绝对定位的 `<a>` 叠层**或 **SVG 内的 `<a>` 链接**替代。
:::

</v-click>

---

# `<object>`：带兜底的资源嵌入

标签之间的内容会在资源**加载失败时兜底**

```html
<object type="application/pdf" data="report.pdf"
        width="100%" height="600">
  <p>无法显示 PDF，请 <a href="report.pdf">下载查看</a>。</p>
</object>
```

<v-click>

- `data`：资源地址；`data` 与 `type` **至少有一个**
- `type`：MIME 类型
- 可嵌 PDF / SVG / 视频 / 图片等

</v-click>

---

# `<embed>`：空元素、无兜底

最初为浏览器**插件**设计

```html
<embed type="image/jpeg" src="photo.jpg" width="250" height="200" />
```

<v-click>

- **空元素**（无闭合标签），因此**不能写兜底内容**（与 `<object>` 相反）
- 现代浏览器普遍移除插件支持，基本属于**历史遗留**
- 新项目改用 `<video>` / `<audio>` / `<img>` / `<iframe>`

</v-click>

---

# `<iframe>` / `<object>` / `<embed>` 怎么选

按「嵌什么 + 要不要兜底」三选一

| 元素 | 用途 | 兜底 |
| --- | --- | --- |
| `<iframe>` | 嵌完整 HTML 文档 / 跨域内容 | 标签间文字 |
| `<object>` | 嵌外部资源（PDF / SVG…） | **支持** |
| `<embed>` | 嵌插件 / 外部内容 | **不支持** |

<v-click>

一句话：**嵌页面用 `<iframe>`，嵌带兜底的资源用 `<object>`，`<embed>` 几乎不再需要**。

</v-click>

---

# 内联 SVG：图标与可交互图形

直接把 `<svg>` 写进 HTML，成为文档的一部分

```html
<svg width="120" height="120" viewBox="0 0 120 120">
  <rect width="100%" height="100%" fill="#e0f2fe" />
  <circle cx="60" cy="60" r="40" fill="#0284c7" />
  <text x="60" y="68" text-anchor="middle" fill="#fff">SVG</text>
</svg>
```

<v-click>

`viewBox` 定义内部坐标系（按比例缩放）。内联后**可被 CSS 改色、被 JS 操作**（绑事件、改形状），适合图标系统。

</v-click>

---

# SVG 的四种用法

按「是否需要 CSS / JS 操作内部」选

| 用法 | 写法 | 特点 |
| --- | --- | --- |
| 当图片 | `<img src="icon.svg">` | 简单可缓存，不能改内部 |
| CSS 背景 | `background-image: url(...)` | 纯装饰 |
| `<object>` | `<object data="icon.svg">` | 可独立交互、带兜底 |
| **内联 `<svg>`** | 直接写 `<svg>…</svg>` | **可被 CSS / JS 操作** |

<v-click>

图标系统 / 可交互图形优先**内联**；纯展示用 `<img>` 更省事、可缓存。

</v-click>

---

# 内联 MathML：排版数学公式

用 `<math>` 内联，现代浏览器**原生支持**，无需图片

```html
<math>
  <mfrac>
    <mrow>
      <mo>-</mo><mi>b</mi><mo>±</mo>
      <msqrt>…</msqrt>
    </mrow>
    <mrow><mn>2</mn><mi>a</mi></mrow>
  </mfrac>
</math>
```

<v-click>

`<mi>` 标识符、`<mo>` 运算符、`<mn>` 数字、`<mfrac>` 分式、`<msqrt>` 根号、`<msup>` 上标——比贴图更可访问、可选中、可缩放。

</v-click>

---
layout: section
---

# 收尾：格式、Baseline、无障碍

选格式、查兼容、守红线

---

# 图片格式对照

照片选 AVIF / WebP，图标选 SVG

| 格式 | MIME | 适合 / 现状 |
| --- | --- | --- |
| **AVIF** | `image/avif` | 照片，压缩率最高，优先 |
| **WebP** | `image/webp` | 照片 / 透明，AVIF 之后回退 |
| **JPEG** | `image/jpeg` | 照片万能兜底 |
| **PNG** | `image/png` | 透明 / 锐利边缘 / 截图 |
| **SVG** | `image/svg+xml` | 图标 / Logo，矢量无限缩放 |

<v-click>

简单动图别再用 GIF——改用 `<video>`（`autoplay muted loop`）更省。

</v-click>

---

# 现代特性 Baseline 状态

2026-06 核：哪些放心用、哪些渐进增强

| 特性 | 状态 |
| --- | --- |
| `<picture>` / `srcset` / `sizes` | ✅ 广泛可用（2016 起） |
| `loading="lazy"`、`decoding`、WebP / AVIF | ✅ 广泛可用 |
| `<track>` / WebVTT、`iframe sandbox` | ✅ 广泛可用 |
| `fetchpriority` | 🟡 新近可用（2024），锦上添花 |
| MathML / `<embed>` 插件 | 🟡 渐进增强 / 历史遗留 |

---

# 无障碍红线

媒体可访问性的硬底线

<v-click>

- 内容图**必写有意义的 `alt`**，装饰图 `alt=""`，别省略属性
- `<video>` / `<audio>` 提供 `controls`，视频配 `<track>` 字幕
- 别让关键信息只靠背景视频 / 纯装饰图传达
- `<iframe>` 必写 `title`；`<area>` 有 `href` 时必写 `alt`
- 自动播放别外放声音（`autoplay` 必配 `muted`）

</v-click>

---

# 一页速记：全章要点

<v-click>

- **图片**：`<img src alt width height>`——`alt` 必写、尺寸防 CLS
- **性能**：首屏外 `loading="lazy"`，主图 `fetchpriority="high"`
- **响应式**：`srcset`+`sizes`（`w`）或 `2x`（不配 `sizes`），不混用
- **换图换格式**：`<picture>` 的 `media` / `type`，`<img>` 兜底必写
- **音视频**：`controls` 必给、`autoplay` 必配 `muted`、字幕用 `<track>`
- **iframe**：`sandbox` 默认全禁、同源别同开 `allow-scripts`+`allow-same-origin`

</v-click>

---
layout: center
class: text-center
---

# 谢谢

图片不抖、视频可控、嵌入安全——媒体写对，页面又快又稳又无障碍

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
