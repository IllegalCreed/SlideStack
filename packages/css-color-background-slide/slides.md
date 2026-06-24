---
theme: seriph
background: https://cover.sli.dev
title: CSS 颜色与背景
info: |
  CSS 上色全谱 —— 颜色表示法、现代色彩空间、混色派生、背景、边框、阴影、渐变
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:css-3 class="text-8xl" />
</div>

<br/>

## CSS 颜色与背景

从「机器友好」到「感知均匀」的上色全谱（基于 CSS 现代标准）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
颜色看似简单，但从怎么写、怎么混、怎么铺到怎么渐变，现代 CSS 已经把它做成一整套自洽的系统。
-->

---
transition: fade-out
---

# 这一章讲什么

把一个品牌色，长成整套自洽的视觉

<v-click>

- **怎么写**：关键字 / hex / `rgb` / `hsl` / `hwb` + 现代 `oklch` / `lab` / `color()`
- **怎么混**：`color-mix()`、相对颜色、`light-dark()`
- **怎么铺**：`background-*` 多层背景、`background-clip: text`
- **怎么框**：`border` / `border-radius` / `border-image`、`box-shadow` 分层阴影
- **怎么渐**：`linear` / `radial` / `conic` 渐变 + `in oklch` 插值

</v-click>

<v-click>

> 主线：现代色彩空间（`oklch`）+ 四件混色工具，让「上色」从手调变成可推导。

</v-click>

---
layout: section
---

# 颜色怎么写

四种主流写法，从机器友好到人眼友好

---

# 关键字与三个特殊值

CSS 共 148 个具名颜色，外加必记的三个特殊值：

```css
color: tomato;
color: rebeccapurple;
```

| 值 | 含义 |
| --- | --- |
| `transparent` | 完全透明，等价 `rgb(0 0 0 / 0)` |
| `currentColor` | 取当前 `color` 计算值 |
| 系统色 | `Canvas` / `ButtonText`，跟随 OS 主题 |

<v-click>

`currentColor` 让边框 / 图标「跟着文字色走」，换主题一处改、处处跟。

</v-click>

---

# 十六进制：最常见的写法

```css
color: #b71540;   /* 6 位 RGB */
color: #00000080; /* 8 位 RGBA，末两位 80 ≈ 50% 透明 */
color: #a4e;      /* 3 位简写，等价 #aa44ee */
```

<v-click>

- 每位是 `0–9` 或 `A–F`
- 3/4 位是 6/8 位的简写（**每位翻倍**）
- 末两位（8 位）/ 末一位（4 位）是 **alpha**
- `80` ≈ 50%、`BF` ≈ 75%、`FF` = 不透明

</v-click>

---

# `rgb()` / `hsl()`：现代空格语法

CSS Color 4 起统一推荐**空格分隔通道、`/` 接 alpha**：

```css
color: rgb(255 0 153 / 80%);
color: hsl(150 30% 60% / 0.8);
color: rgba(255, 0, 153, 0.8); /* 旧式逗号仍有效 */
```

<v-click>

- `rgb()` 通道：`0–255` 或 `0%–100%`
- `hsl()`：色相 `0–360`（可带 `deg` / `turn`），饱和 + 亮度用 `%`
- 不再需要 `rgba()` / `hsla()`——它们只是合法别名

</v-click>

---

# `hwb()`：掺白掺黑的直觉

```css
color: hwb(12 50% 0%);       /* 色相 12，掺 50% 白 */
color: hwb(194 0% 0% / 0.5); /* 纯色，半透明 */
```

<v-click>

`hwb()`（Hue-Whiteness-Blackness）和 `hsl()` 同属 sRGB 极坐标，但用「往里掺多少白、多少黑」描述——调浅色 / 灰调更顺手。

</v-click>

---
layout: section
---

# 现代色彩空间

`oklch` / `lab` / `color()`，Baseline 2023 广泛可用

---

# `hsl()` 的硬伤：亮度不是亮度

```css
/* 亮度值都是 50%，但黄看起来远比蓝亮 */
color: hsl(60 100% 50%);  /* 黄 */
color: hsl(240 100% 50%); /* 蓝 */
```

<v-click>

`hsl()` 的 `lightness` 不等于**人眼感知的亮度**。这让「按固定步长生成色阶」变得不可靠——忽深忽浅。

</v-click>

<v-click>

> 现代色彩空间（`oklch` / `lab`）就是来修正这件事的。

</v-click>

---

# `oklch()`：做设计系统的首选

```css
color: oklch(70% 0.15 30);  /* 红 */
color: oklch(70% 0.15 250); /* 蓝，看起来一样亮 */
```

| 分量 | 含义 | 取值 |
| --- | --- | --- |
| L | 感知亮度 | `0–1` 或 `0%–100%` |
| C | 彩度 | `0–0.4`，越大越艳 |
| H | 色相角 | `0–360`（红约 `41deg`） |

<v-click>

杀手锏**亮度所见即所得**：固定 L 改 H，得到「一样亮、不同色相」的一组色。

</v-click>

---

# `oklab` / `lab` / `lch`

```css
color: oklab(59% 0.1 0.1);  /* L + a/b 直角坐标 */
color: lab(50% 40 59.5);    /* CIE Lab，a 绿↔红，b 蓝↔黄 */
color: lch(52.2% 72.2 50);  /* CIE Lab 极坐标 */
```

<v-click>

- 直角（`oklab` / `lab`）：适合「感知均匀的过渡」
- 极坐标（`oklch` / `lch`）：适合「按色相调色」
- **`ok` 前缀更新、感知更均匀，优先选 `oklch()`**

</v-click>

---

# `color()`：跨色彩空间与广色域

```css
color: color(srgb 0.9 0.2 0.4);       /* sRGB，通道 0–1 */
color: color(display-p3 0.9 0.2 0.4); /* 广色域，多约 50% 颜色 */
```

<v-click>

`display-p3` 在支持广色域的屏幕（近年多数手机 / Mac）上能显示 sRGB 表达不出的鲜艳色。配 `@supports` 渐进增强：

```css
@supports (color: color(display-p3 1 1 1)) {
  .vivid { color: color(display-p3 0.95 0.1 0.42); }
}
```

</v-click>

---

# 选哪种写法

<v-click>

| 场景 | 推荐 |
| --- | --- |
| 静态、团队熟悉 | 十六进制 / `rgb()` |
| 要人肉调色 | `hsl()` / `hwb()` |
| 设计系统、批量生成色阶 | **`oklch()`** |
| 追求屏幕极限鲜艳 | `color(display-p3)` + `@supports` |

</v-click>

<v-click>

> 一句话：现代项目的新默认是 `oklch()`，因为它的亮度可预测。

</v-click>

---
layout: section
---

# 混色与派生

一个品牌色，长出整套设计令牌

---

# `color-mix()`：按比例调和两色

::: tip Baseline
`color-mix()` 自 **2023-05** 起 Baseline 广泛可用，可放心用于生产。
:::

```css
/* 在 oklch 空间，品牌色 25% + 白 75% → 浅色调 */
background: color-mix(in oklch, var(--brand) 25%, white);
```

<v-click>

完整语法：`color-mix(in <空间> <hue方法>?, <色1> <比例>?, <色2> <比例>?)`

</v-click>

---

# `color-mix()` 比例怎么算

<v-click>

| 情况 | 结果 |
| --- | --- |
| 都省略 | 各 `50%` |
| 只给 `p1` | `p2 = 100% - p1` |
| 和 ≠ 100% | 按 `p1/(p1+p2)` 归一化 |
| 和 `< 100%` | 归一化后，再乘 `p1+p2` 的 alpha |

</v-click>

<v-click>

```css
color-mix(in oklab, #a71e14 25%, white); /* 25% 红 + 75% 白 */
color-mix(in oklab, #a71e14, white);     /* 省略 → 各 50% */
```

</v-click>

---

# 选哪个插值空间（关键）

这是 `color-mix()` 用好用坏的分水岭：

<v-click>

- **`oklch` / `oklab`**：感知均匀，**不发灰**，彩度保持好——色阶 / 渐变首选
- **`lab` / `xyz`**：物理 / 感知均匀，适合科学混光
- **`srgb`**：仅在复刻设计软件混色时用，**中段易发灰发暗**

</v-click>

<v-click>

```css
.a { background: color-mix(in srgb, red, blue); }  /* 中段发灰 */
.b { background: color-mix(in oklch, red, blue); } /* 中段鲜亮 */
```

</v-click>

---

# `color-mix()` 三个高频配方

```css
/* 1. tint / shade：浅色与深色变体 */
--c-tint: color-mix(in oklch, var(--c) 80%, white);
--c-shade: color-mix(in oklch, var(--c) 80%, black);

/* 2. 半透明：和 transparent 混 = 改不透明度 */
--c-50: color-mix(in srgb, var(--c) 50%, transparent);

/* 3. 悬停加深：和 black 混一点点 */
.btn:hover { background: color-mix(in oklch, var(--c), black 12%); }
```

---

# 色相绕行方向

极坐标空间（`hsl` / `hwb` / `lch` / `oklch`）里，两色相可走短弧或长弧：

```css
color-mix(in oklch shorter hue, red, blue); /* 默认：最短路 */
color-mix(in oklch longer hue, red, blue);  /* 绕远，经过更多色相 */
```

<v-click>

- `shorter`（默认）/ `longer`
- `increasing` / `decreasing`：强制色相角递增 / 递减

</v-click>

---

# 相对颜色：拆通道精修

::: warning Baseline
相对颜色是 **Baseline 2024 新近可用**，建议作渐进增强、配 `@supports` 回退。
:::

用 `from` 把源色拆成通道关键字，再重新组装：

```css
oklch(from var(--brand) calc(l + 0.1) c h); /* 只抬亮度 */
oklch(from var(--brand) l c h / 25%);       /* 只改 alpha */
```

<v-click>

通道关键字：`rgb→r g b`、`hsl→h s l`、`oklch→l c h`，alpha 一律 `alpha`。

</v-click>

---

# 相对颜色：一个色派生一族

通道值都解析成纯数，能直接喂给 `calc()`：

```css
:root { --brand: oklch(62% 0.19 264); }
.theme {
  --accent: oklch(from var(--brand) l c calc(h + 180)); /* 互补 */
  --surface: oklch(from var(--brand) 97% 0.02 h);       /* 浅背景 */
  --border: oklch(from var(--brand) l c h / 20%);       /* 半透明描边 */
}
```

<v-click>

> 分工：`color-mix()` 按比例「往某色靠」；相对颜色「单独动某个通道」。

</v-click>

---

# `light-dark()`：一行给明暗两套

```css
:root { color-scheme: light dark; } /* 前提：声明支持两套 */
.surface {
  color: light-dark(#1a1a1a, #e8e8e8); /* 亮取前、暗取后 */
  background: light-dark(white, #0d1117);
}
```

<v-click>

省去为暗色写整套 `prefers-color-scheme` 媒体查询。**前提**是 `:root` 上声明了 `color-scheme: light dark`，否则只取第一个值。Baseline 2024。

</v-click>

---

# 四件工具配 `oklch` 自洽闭环

<v-click>

- **`color-mix()`**：按比例调和（掺白掺黑、混两色）
- **相对颜色**：拆通道精修（只抬亮度、只转色相、只改透明）
- **`light-dark()`**：明暗二选一
- **`currentColor`**：跟随文字色

</v-click>

<v-click>

> 配合 `oklch()`，一个品牌色就能长出整套自洽的设计令牌。`color-mix()` 已广泛可用，相对颜色 / `light-dark()` 属 2024 新近，按渐进增强落地。

</v-click>

---
layout: section
---

# 背景

一组各管一摊的属性

---

# `background-color` 与 `background-image`

```css
background-color: oklch(97% 0.02 264); /* 纯色，永远在最底层 */
background-image: url("/hero.jpg");
background-image: linear-gradient(to right, #6a11cb, #2575fc);
```

<v-click>

- `background-color` 初始值 `transparent`，透出父级
- `background-image` 接 `url()` / 渐变 / `image-set()`
- 渐变本质是「按需生成的图」，会被拉伸铺满

</v-click>

---

# 多层背景：逗号叠加

逗号分隔可叠任意多层，**写在前面的层在上面**：

```css
.hero {
  background:
    linear-gradient(rgb(0 0 0 / 45%), rgb(0 0 0 / 45%)), /* 上层：压暗蒙版 */
    url("/hero.jpg") center / cover no-repeat;           /* 下层：照片 */
}
```

<v-click>

这是「图片上压一层渐变蒙版让文字可读」的标准做法。每个背景属性都能给一组逗号值，逐层对应。

</v-click>

---

# repeat / position / size

```css
background-repeat: space;  /* 整数次铺、不裁、均分缝隙 */
background-position: bottom 20% right 30%; /* 带边偏移 */
background-size: cover;    /* 铺满容器、超出裁掉 */
```

<v-click>

| 属性 | 关键取值 |
| --- | --- |
| `repeat` | `no-repeat` / `space`(留缝) / `round`(缩放整铺) |
| `position` | 关键字 / 长度 / `%`，三四值可带边偏移 |
| `size` | `cover`(铺满裁) / `contain`(完整留白) |

</v-click>

---

# origin / clip：坐标系与裁剪

两者都用 `border-box` / `padding-box` / `content-box`，但管的事不同：

```css
.card {
  border: 8px dashed rgb(0 0 0 / 30%);
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  background-origin: padding-box; /* 从内边距盒开始铺 */
  background-clip: padding-box;   /* 不画到边框下面 */
}
```

<v-click>

- `origin`：背景**定位起点**（`position: 0 0` 从哪算）
- `clip`：背景**最终绘制 / 裁剪到哪个盒子**

</v-click>

---

# `background-clip: text`：渐变文字

```css
.gradient-text {
  background: linear-gradient(90deg, #6a11cb, #2575fc);
  background-clip: text;
  color: transparent; /* 让背景透过文字显示 */
}
```

<v-click>

把背景裁切到**文字形状** + `color: transparent` = 经典渐变文字。早期需 `-webkit-` 前缀，现代已普遍支持标准写法（保留前缀更稳）。

</v-click>

---

# `background` 简写的两个坑

```css
background: #fff url("/bg.png") center / cover no-repeat;
/*          ↑色  ↑图          ↑位置 / ↑尺寸  ↑重复 */
```

<v-click>

- **`/` 分隔 position 与 size**（最易错）
- 多层逗号叠时，**颜色只能写在最后一层**

</v-click>

<v-click>

::: warning 简写会重置未列出的属性
之前单独设的 `background-attachment: fixed`，被不含它的 `background` 简写**悄悄重置**回 `scroll`。
:::

</v-click>

---
layout: section
---

# 边框与阴影

盒子的「边」与「浮起来」

---

# `border`：宽、样式、颜色

```css
border: 2px #ccc;       /* ❌ 没 style，看不见 */
border: 2px solid #ccc; /* ✅ */
```

<v-click>

`border-style` **默认是 `none`**——只写宽度和颜色、漏了样式，边框根本不显示。这是边框最容易栽的坑。

</v-click>

<v-click>

取值：`solid` / `dashed` / `dotted` / `double` / `groove` / `ridge` / `inset` / `outset` / `none`

</v-click>

---

# `border-radius`：圆角

```css
border-radius: 10px;     /* 四角统一 */
border-radius: 10px 5%;  /* 左上&右下 | 右上&左下 */
border-radius: 10px / 20px; /* 斜杠：水平半径 / 垂直半径（椭圆角） */
```

<v-click>

- 1–4 值按「顺时针从左上角」展开
- `50%`：正方形 → 正圆
- `9999px`：任意宽高 → 两端半圆的药丸

</v-click>

<v-click>

::: tip 圆角裁背景，但默认不裁内容
溢出的子内容要配 `overflow: hidden` 才跟着圆角裁。
:::

</v-click>

---

# `border-image`：图片 / 渐变做边框

把图按**九宫格**切开铺到边框上：

```css
.fancy {
  border: 4px solid; /* 必须有 style 与宽度 */
  border-image: linear-gradient(45deg, #f6b73c, #4d9f0c) 1;
}
```

<v-click>

- 四角原样、四边按 `repeat` 拉伸 / 平铺、中心默认丢弃（`fill` 保留）
- ⚠️ **不吃 `border-radius`**——要圆角渐变边框改用背景 + `clip` 或 `mask`

</v-click>

---

# `box-shadow`：五个值

```css
box-shadow: 10px 5px 5px 1px rgb(0 0 0 / 20%);
/*          ↑x  ↑y  ↑模糊 ↑扩展 ↑颜色 */
```

<v-click>

| 值 | 说明 |
| --- | --- |
| `offset-x / y` | 偏移，正右 / 正下 |
| `blur` | 模糊，**不可负**，默认 0（硬边） |
| `spread` | 扩展，**可负**（收缩） |
| `<color>` | 可省（取元素 `color`） |

</v-click>

---

# `inset`：内阴影

```css
box-shadow: inset 0 2px 4px rgb(0 0 0 / 25%); /* 顶部内凹感 */
```

<v-click>

加 `inset` 后阴影画在元素**内部**：裁到 padding-box，绘制在背景之上、内容之下，营造「内容被压进盒子」的凹陷观感。

</v-click>

<v-click>

> 常用于输入框聚焦、按钮按下、内嵌凹槽。

</v-click>

---

# 分层阴影：质感的关键

真实影子不是一团死黑。单道阴影显「假」，叠**近实 + 远柔**才真实：

```css
.elevated {
  box-shadow:
    0 1px 2px rgb(0 0 0 / 8%),
    0 4px 8px rgb(0 0 0 / 8%),
    0 8px 24px rgb(0 0 0 / 10%);
}
```

<v-click>

层数越多、模糊越大、透明度越低 → 元素「浮」得越高。这是 Material elevation 阴影的通用做法。

</v-click>

---

# 阴影两个关键行为

<v-click>

```css
.ring { box-shadow: 0 0 0 2px white, 0 0 0 4px #66ccff; } /* 实心环描边 */
```

零偏移零模糊、只留扩展 = 均匀实心描边，可叠多道，**不占布局**。

</v-click>

<v-click>

- **不影响布局**：不参与盒模型、不引发回流，需留位用 `margin`
- **跟随圆角**：自动套用 `border-radius`
- 给透明 PNG / 不规则图投影，改用 `filter: drop-shadow()`（沿轮廓）

</v-click>

---
layout: section
---

# 渐变

能画过渡、条纹、饼图、色轮的「图」

---

# 渐变是「按需生成的图」

```css
background-image: linear-gradient(black, white); /* ✅ */
background-color: linear-gradient(black, white); /* ❌ 非法 */
```

<v-click>

渐变函数返回一张 `<image>`，用在所有接受图片处（`background-image` / `border-image` / `mask-image`…），但**不能**用于 `background-color`（那只收纯色）。

</v-click>

---

# `linear-gradient()`：直线渐变

```css
background: linear-gradient(to right, black, white);    /* 关键字方向 */
background: linear-gradient(45deg, darkred 30%, crimson); /* 角度 + 色标位置 */
```

<v-click>

- 方向：角度（`0deg` 向上、`90deg` 向右、顺时针）或关键字（`to bottom right`）
- 色标可带位置（`%` / 长度），控制在哪儿、何处混合
- **硬色标做条纹**：同位置连写两色，过渡区长度为 0

</v-click>

---

# `radial-gradient()`：放射渐变

```css
background: radial-gradient(circle at top left, white, black);
background: radial-gradient(ellipse closest-side at 60% 40%, gold, transparent);
```

参数是「**形状 尺寸 `at` 位置**」：

<v-click>

- **形状**：`circle`（正圆）/ `ellipse`（椭圆，默认）
- **尺寸**：`closest-side`…`farthest-corner`（默认）
- 常用于聚光灯、球体高光、径向遮罩

</v-click>

---

# `conic-gradient()`：画饼图与色轮

::: tip Baseline
`conic-gradient()` 自 **2020-11** 起 Baseline 广泛可用。
:::

颜色绕中心**旋转**，色标用**角度**而非距离：

```css
/* 饼图：同角度连写两色做硬分块 */
.pie { background: conic-gradient(red 36deg, orange 36deg 170deg, yellow 170deg); }
/* 色轮：色相绕一整圈 */
.wheel { background: conic-gradient(in hsl longer hue, hsl(0 100% 50%), hsl(360 100% 50%)); }
```

---

# 重复渐变与多层叠加

```css
/* 重复线性：45 度条纹 */
background: repeating-linear-gradient(45deg, red, red 30px, white 30px, white 60px);
/* 多层 mesh：半透明色标叠复杂纹理 */
background:
  radial-gradient(at 20% 30%, rgb(255 0 128 / 50%), transparent 50%),
  #101020;
```

<v-click>

- `repeating-*` 做条纹、网格、棋盘、扇形
- 逗号叠多个渐变，**先写的在上**

</v-click>

---

# `in oklch`：让渐变不发灰

默认在 sRGB 插值，红→绿、蓝→黄中段常**发灰发暗**：

```css
.a { background: linear-gradient(to right, deeppink, yellow); }          /* 偏灰 */
.b { background: linear-gradient(in oklch to right, deeppink, yellow); } /* 鲜亮 */
```

<v-click>

- 在方向 / 形状参数处加 `in <空间>`，改在感知均匀空间插值
- 极坐标空间加 `longer hue` 走满色轮，做彩虹 / 多彩条带

</v-click>

---

# 最佳实践小结

<v-click>

- 现代默认用 **`oklch()`**——亮度可预测，批量生成色阶 / 暗色都靠谱
- 一个品牌色 + 四件工具（`color-mix` / 相对颜色 / `light-dark` / `currentColor`）长出整套令牌
- 多层背景 + 简写 `/` 分隔、颜色只在末层，是两个最易错点
- `border` 别漏 `border-style`；`border-image` 不吃圆角
- 阴影做质感靠**分层**（近实 + 远柔）；渐变加 `in oklch` 防发灰

</v-click>

---
layout: center
class: text-center
---

# 谢谢

把颜色写在感知均匀的空间里，「上色」就从手调变成了可推导

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>
