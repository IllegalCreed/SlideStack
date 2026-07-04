---
theme: seriph
background: https://cover.sli.dev
title: SVG 可缩放矢量图形
info: |
  Presentation on SVG — Scalable Vector Graphics.

  Learn more at [MDN SVG](https://developer.mozilla.org/zh-CN/docs/Web/SVG)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🖌️</span>
</div>

<br/>

## SVG — 可缩放矢量图形

基于 XML 的二维矢量图形语言，W3C 开放标准（1999 年起）。图形即 DOM 节点：可被 CSS 样式化、JS 操作、无限缩放不失真——「SVG 之于图形，如同 HTML 之于文本」

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://developer.mozilla.org/zh-CN/docs/Web/SVG" target="_blank" class="slidev-icon-btn">
    <carbon:launch />
  </a>
</div>

<!--
今天聊 SVG，可缩放矢量图形。它是基于 XML 的二维矢量图形语言，1999 年起就是 W3C 开放标准。核心气质一句话：SVG 之于图形，如同 HTML 之于文本——每个图形都是真实的 DOM 节点。

版本基线先说清：SVG 1.1 Second Edition（2011）是最后一个正式 Recommendation，仍是浏览器实现的公共基线；SVG 2 长期停在候选推荐 CR（现行 2018-10-04），编辑草案还在更新，但没有升 Rec 的时间表。浏览器按特性零散落地 SVG 2 增量，比如 href 取代 xlink:href、几何属性可用 CSS 控制。所以别说「SVG 2 已发布、已全面支持」。

顺序：定位 → 对比 Canvas → 引入方式 → 坐标系统 → 形状与 path → 填充描边与描边动画 → 渐变图案 → 复用 → 裁剪遮罩 → 滤镜 → 三路动画 → transform → 脚本 → 优化与无障碍 → 易错点 → 总结。
-->

---

# 定位：保留模式的矢量 DOM

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
  <rect width="100%" height="100%" fill="red"/>
  <circle cx="150" cy="100" r="80" fill="green"/>
  <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>
</svg>
```

<v-clicks>

- **保留模式**：浏览器保留整棵图形对象树（DOM），改属性即改画面；Canvas 是**立即模式**——画完即像素，改动要自己重画
- 天然获得：每个图形独立 DOM 事件、CSS 选择器与动画、无障碍树、文本可选中可索引
- 渲染顺序「**后来居上**」：源码越靠后画在越上层，**没有 z-index**，调层级只能移动节点
- 独立 `.svg` 文件必须带 xmlns；服务器 MIME 必须 `image/svg+xml`

</v-clicks>

<!--
这是一份最小可运行的 SVG 文档：矩形铺底、圆、居中文字，五行画完。

关键心智是渲染模型：SVG 是保留模式，浏览器在内存里保留整棵图形对象树，也就是 DOM，你改属性它就重绘；Canvas 是立即模式，画完就成了像素，没有对象记忆，改动全靠自己重画。

因为图形就是 DOM，所以每个图形能独立响应 click、hover，能被 CSS 选择器命中、被无障碍树读到，文本还能被选中和搜索引擎索引。

两个规则要记：一，渲染顺序后来居上，源码里越靠后的元素画在越上层，SVG 没有 z-index，调层级只能移动节点顺序。二，独立 .svg 文件必须带 xmlns 命名空间声明，服务器必须以 image/svg+xml 这个 MIME 返回，配置错是加载失败的常见原因。SVG 2 里 version 和 baseProfile 属性已废弃，可以不写。
-->

---

# SVG vs Canvas：怎么选

<div class="text-sm">

| 维度 | SVG | Canvas 2D |
|---|---|---|
| 渲染模型 | 保留模式（DOM 对象树） | 立即模式（像素缓冲） |
| 缩放 | 矢量无损、随容器响应式 | 位图放大糊，需按 DPR 重绘 |
| 事件 | 每个图形原生 DOM 事件 | 整块画布，命中检测自实现 |
| 样式/动画 | CSS / SMIL / WAAPI 全套 | 全靠 JS 逐帧重绘 |
| 无障碍/SEO | 真实节点，文本可索引 | 黑盒（需 fallback DOM） |
| 性能特征 | 随 DOM 节点数恶化（3k~5k 阈值） | 与对象数解耦，10 万点无压力 |
| 典型场景 | 图标 / LOGO / 中小图表（D3 默认） | 大数据散点 / 游戏 / 图像处理 |

</div>

<div v-click class="mt-3 text-sm">

> 口诀：**要交互到「每个图形」、要无障碍、要响应式 → SVG；要画的「东西数量」大 → Canvas**。混合方案常见：Canvas 画数据层 + SVG 画轴 / 标注层。

</div>

<!--
和 Canvas 的选型对比是必考题。

SVG 是保留模式的 DOM 对象树，矢量无损缩放、每个图形有原生事件、CSS 和声明式动画全套可用、无障碍和 SEO 友好；代价是每个图形都是 DOM 节点，节点数千级后样式计算、布局、绘制全线变慢，经验阈值 3k 到 5k 节点开始卡。

Canvas 是立即模式的像素缓冲，性能与对象数量解耦、只随像素面积变化，十万个散点无压力；代价是位图放大会糊、事件只有整块画布、命中检测和动画都要自己实现。

决策口诀：要交互到每个图形、要无障碍、要响应式，用 SVG；要画的东西数量大，用 Canvas。实践里常先用 SVG 快速迭代，量测到瓶颈再迁移，或者混合：Canvas 画海量数据层，SVG 画坐标轴和标注层。
-->

---

# 引入方式对比 ★必考

<div class="text-sm">

| 方式 | JS 操作内部 | CSS 级联进内部 | 内部脚本 | 独立缓存 |
|---|---|---|---|---|
| inline `<svg>` | ✓ 完全 | ✓ 完全（含伪类） | ✓ 页面脚本 | ✗ 随 HTML |
| `<img src>` | ✗ | ✗ 仅整体 filter/size | ✗ 禁用 | ✓ |
| CSS background | ✗ | ✗ | ✗ 禁用 | ✓ |
| `<object>` / `<iframe>` | 同源 contentDocument ✓ | ✗ 不级联（文档边界） | ✓ | ✓ |
| `<use>` 外部 sprite | 宿主可、克隆树 ✗ | 继承值/CSS 变量穿透 | ✗ | ✓ sprite |
| canvas drawImage | ✗ 已光栅化 | ✗ | ✗ | 跨域污染画布 |

</div>

<div v-click class="mt-2 text-sm">

> 记忆轴：**可控性 inline > object > use > img ≈ background，缓存性正好反过来**。img / background 是「图像上下文」安全沙箱：禁脚本、禁外部资源、无交互，但 SMIL / 内嵌 CSS 动画可自动播放。

</div>

<!--
SVG 进页面有六条路，可控性和缓存性此消彼长。

inline 内联可控性最强：页面 JS 能摸到每个节点，页面 CSS 完整级联进去，伪类、变量都好使，是交互和换肤的首选；代价是增大 HTML、无法独立缓存，还有 id 全局冲突风险。

img 和 CSS background 是另一个极端，叫图像上下文：脚本禁用、外部资源不加载、没有交互，但可以独立缓存；注意 SMIL 和内嵌 CSS 动画仍能自动播放。img 必须给 alt。

object、iframe 是完整文档上下文，同源时可以通过 contentDocument 操作内部，内部脚本能跑、能加载外部资源，但页面 CSS 不级联进去，内部要自带样式。

use 引外部 sprite 居中：克隆树 JS 摸不到，但继承值和 CSS 变量能穿透；严格同源，没有 CORS 开关。canvas drawImage 画上去就光栅化了，跨域图会污染画布，之后 toDataURL、getImageData 会抛错。
-->

---

# 坐标系统 ①：viewport 与 viewBox ★必考

```xml
<svg width="200" height="200" viewBox="0 0 100 100">
  <!-- 缩放比 = viewport/viewBox = 200/100 = 2 倍 -->
  <!-- 用户坐标 (50,50) 落在设备 (100,100) -->
</svg>
```

<v-clicks>

- 原点**左上角**，x 向右、y 向下（与 Canvas 一致，与数学坐标系相反）
- **viewport**：`width` / `height` 决定的实际显示窗口
- **viewBox="min-x min-y width height"**：定义**用户坐标系**，把这块逻辑区域映射进 viewport
- min-x/min-y = 把用户坐标系的哪个点对到视口左上角：`viewBox="50 0 100 100"` 内容视觉**左移** 50 用户单位（平移的是裁切窗口，不是内容坐标）
- 无单位数值走用户坐标系，默认 1 用户单位 = 1px

</v-clicks>

<!--
坐标系统是 SVG 面试考察密度最高的区块，先分清两个概念。

viewport 视口，是 svg 元素的 width、height 决定的实际显示窗口。viewBox 是四个值：min-x、min-y、width、height，它定义用户坐标系，把这块逻辑区域映射进 viewport。缩放比等于 viewport 尺寸除以 viewBox 尺寸：viewBox 一百、viewport 两百，内容放大两倍，用户坐标五十五十落在设备一百一百。

min-x、min-y 是新手最容易猜反的：它表示把用户坐标系的哪个点对到视口左上角。min-x 设为 50，视觉效果是内容左移 50 个用户单位——相当于平移裁切窗口，而不是平移内容。

还要记住：原点在左上角，y 轴向下，跟 Canvas 一致、跟数学坐标系相反。无单位数值走用户坐标系，默认一个用户单位等于一像素；也可以写 cm、pt 这类绝对单位，按物理尺寸呈现。
-->

---

# 坐标系统 ②：preserveAspectRatio

| 值 | 行为 | CSS 类比 |
|---|---|---|
| `meet`（默认） | 等比缩放，viewBox **完整可见**，可能留白 | `object-fit: contain` |
| `slice` | 等比缩放**填满 viewport**，超出被裁 | `object-fit: cover` |
| `none` | 非等比拉伸填满，宽高比不保留 | 拉伸变形 |

<v-clicks>

- 默认 **`xMidYMid meet`**；仅当 viewBox 与 viewport **宽高比不一致**时才起作用
- align 九宫格：xMin / xMid / xMax × YMin / YMid / YMax（**x 小写、Y 大写**），如 `xMinYMax slice` = 左下对齐裁切
- ⚠️ **没写 viewBox 时该属性被忽略**（`<image>` 例外——它控制外部图像与自身矩形的适配）
- 嵌套 `<svg>` 可建立全新 viewport + 坐标系，比 `g` + transform 多了独立裁切与比例控制

</v-clicks>

<!--
viewBox 和 viewport 宽高比不一致时怎么办？preserveAspectRatio 说了算。

它由对齐值加缩放策略组成。meet 是默认策略：等比缩放，保证 viewBox 完整可见，可能留白，类比 CSS 的 object-fit contain。slice：等比缩放填满 viewport，超出部分裁掉，类比 cover。none：不保持宽高比直接拉伸填满，此时对齐值被忽略。

对齐值是九宫格：xMin、xMid、xMax 乘 YMin、YMid、YMax，注意大小写，x 小写 Y 大写，默认 xMidYMid meet 居中适配，xMinYMax slice 就是左下对齐裁切。

两个坑：一，没写 viewBox 时这个属性直接被忽略，这是「为什么设置了不生效」的高频来源，image 元素例外，它管外部图像和自身矩形的适配。二，嵌套 svg 可以在内部建立全新的 viewport 和坐标系，比 g 加 transform 多了独立裁切和比例控制。
-->

---

# 基本形状六元素

```xml
<rect x="10" y="10" width="30" height="30" rx="6"/> <!-- 只给 rx 则 ry=rx -->
<circle cx="25" cy="75" r="20"/>
<ellipse cx="75" cy="75" rx="20" ry="5"/>
<line x1="10" y1="110" x2="50" y2="150"/>      <!-- 无 fill 概念，必须 stroke 才可见 -->
<polyline points="60,110 65,120 70,115"/>      <!-- 不闭合 -->
<polygon points="50,160 55,180 70,180"/>       <!-- 末点自动连回首点 -->
```

<v-clicks>

- polyline 与 polygon 唯一区别 = **是否自动闭合**——影响 stroke 端点外观与 fill 结果（未闭合形状 fill 按首尾相连区域填充）
- `points` 用空格或逗号分隔
- 所有形状本质都能用 `<path>` 表达，基本形状是**语义化快捷方式**

</v-clicks>

<!--
六个基本形状元素过一遍。

rect 矩形用 x、y、width、height 定位定形，rx、ry 是圆角，只给 rx 时 ry 自动等于 rx。circle 用圆心加半径 r。ellipse 是两个半径 rx、ry。line 线段用两个端点，注意线没有 fill 的概念，必须给 stroke 才看得见。

polyline 折线和 polygon 多边形都用 points 列表，空格或逗号分隔，两者唯一区别是 polygon 会把最后一个点自动连回第一个点闭合。闭合与否影响 stroke 端点外观，也影响 fill：未闭合形状填充时按首尾相连的区域算。

最后一句话：所有基本形状本质上都能用 path 表达，它们只是语义化的快捷方式，可读性更好。真正的万能选手是 path，下面两页展开。
-->

---

# path ①：d 命令全表 ★必考

**大写 = 绝对坐标；小写 = 相对当前点位移**（Z/z 无参数、不分大小写）

<div class="text-sm">

| 命令 | 参数 | 语义 |
|---|---|---|
| `M/m` | x y | 移动画笔不画线；后续坐标隐含按 L/l 处理 |
| `L/l` · `H/h` · `V/v` | x y · x · y | 直线 · 水平线 · 垂直线 |
| `C/c` | x1 y1 x2 y2 x y | 三次贝塞尔：双控制点 + 终点 |
| `S/s` | x2 y2 x y | 平滑三次：控制点 = 前一 C/S 第二控制点的**中心对称反射** |
| `Q/q` | x1 y1 x y | 二次贝塞尔：单控制点 + 终点 |
| `T/t` | x y | 平滑二次：控制点反射推断；单独使用退化为直线 |
| `A/a` | 7 参数 | 椭圆弧 → 下页详解 |
| `Z/z` | — | 直线连回本子路径起点闭合 |

</div>

<!--
path 的 d 属性是一串命令。第一规则：大写命令用绝对坐标，小写命令用相对当前点的位移，Z 闭合无参数、不分大小写。

M 移动画笔不画线；m 后面如果跟多组坐标，第一组是移动，后续隐含按 L 直线处理。L 直线，H、V 是水平线和垂直线的省参数版。

贝塞尔两兄弟：C 三次贝塞尔，参数是起点控制点、终点控制点、终点；Q 二次贝塞尔只有一个控制点。S 和 T 是平滑版：S 的第一控制点自动取前一条 C 或 S 的第二控制点关于当前点的中心对称反射，前面不是 C、S 时取当前点自身；T 同理反推 Q 的控制点，单独用会退化成直线。

A 椭圆弧七个参数是最高频考点，下一页专门讲。另外语法宽松是坑：分隔符可以省略，flag 能和后面数字连写，人眼极易读错，手写建议全部用空格分隔。
-->

---

# path ②：A 椭圆弧 7 参数 ★最高频

```xml
<!-- 四分之一圆：从 (100,50) 顺时针小弧到 (50,100)，圆心 (50,50) r=50 -->
<path d="M 100 50 A 50 50 0 0 1 50 100" fill="none" stroke="black"/>
<!-- 饼图扇形：圆心 → 弧起点 → 弧 → 闭合 -->
<path d="M 50 50 L 100 50 A 50 50 0 0 1 50 100 Z" fill="orange"/>
```

<v-clicks>

- `rx ry`：椭圆两半径（画圆弧则相等）——**太小会被自动放大**到能连接两点，而非报错
- `x-axis-rotation`：椭圆 x 轴相对水平方向的旋转角（度）
- `large-arc-flag`：`1` 走**大弧**（≥180°），`0` 走小弧
- `sweep-flag`：`1` 沿**正角度方向**（y 向下的屏幕坐标系里呈顺时针），`0` 反向
- 终点 `x y`：起点隐含为当前点——两点 + 两半径确定 **4 条候选弧**，两个 flag 从中四选一
- 紧凑语法 flag 可与坐标连写（`0 0140 20` 人眼易读错）——**手写全用空格**

</v-clicks>

<!--
A 命令七个参数，按顺序背：rx、ry 两半径；x-axis-rotation 椭圆 x 轴旋转角；large-arc-flag；sweep-flag；最后是终点 x、y。

理解模型：起点隐含为当前画笔位置，起点、终点两个点加上两个半径，几何上能确定四条候选弧——大弧小弧乘以两个方向。large-arc-flag 等于 1 走大于等于 180 度的大弧；sweep-flag 等于 1 沿正角度方向，在 y 向下的屏幕坐标系里呈顺时针。两个 flag 就从四条弧里选出一条。

细节坑：半径给得太小连不上两点时，浏览器会自动放大半径而不是报错。flag 只能是 0 或 1，紧凑语法里 flag 能和坐标连写，比如 0 0140 20，人眼很难拆，手写全用空格。

代码里第一条是四分之一圆弧；第二条从圆心出发画线到弧起点、走弧、Z 闭合，就是饼图扇形的标准画法。
-->

---

# 填充与描边

<v-clicks>

- `fill` / `stroke` 可取：颜色、`none`、`currentColor`、`url(#渐变或图案)`
- 元素级 `opacity` 是**先合成再整体变透明**，视觉上 ≠ 分别设 `fill-opacity` / `stroke-opacity`
- **stroke 以路径为中心线**：一半在内一半在外，线越粗内容被「吃掉」越多
- 缩放时不想线变粗：`vector-effect="non-scaling-stroke"`（地图 / 图表刚需）
- 端点 `stroke-linecap`：butt（默认齐平）/ square（外扩方头）/ round（半圆头）
- 拐角 `stroke-linejoin`：miter（默认尖角，受 `stroke-miterlimit` 限制）/ round / bevel（斜切）
- `fill-rule`：nonzero（默认，非零环绕）vs evenodd（奇偶射线）——自交路径 / 镂空（甜甜圈）图形结果不同
- `stroke-dasharray` 奇数个值**整组复制**补成偶数：`5,10,5` 实际是 `5,10,5,5,10,5`

</v-clicks>

<!--
填充和描边这组属性，逐条都有考点。

fill 和 stroke 除了颜色，还能取 none、currentColor 跟随文字色、以及 url 引用渐变或图案。透明度注意区分：元素级 opacity 是先把填充和描边合成完再整体变透明，和分别设置 fill-opacity、stroke-opacity 视觉效果不同。

stroke 以路径为中心线，一半画在路径里面、一半在外面，线越粗图形内容被吃掉越多；缩放场景想保持线宽不变，用 vector-effect 的 non-scaling-stroke。

端点样式 linecap 三个值：butt 齐平截断是默认，square 外扩半个线宽的方头，round 半圆头。拐角 linejoin：miter 尖角默认、受 miterlimit 限制，round 圆角，bevel 斜切。

fill-rule 决定「内部」的判定算法：默认 nonzero 非零环绕数，evenodd 奇偶射线法，自交路径和镂空图形两者结果不同；clipPath 里对应的是 clip-rule。最后一个冷知识：dasharray 给奇数个值时，整组会被复制一遍补成偶数。
-->

---

# 描边动画：dasharray 画线 ★必考

```html
<path class="line" d="M10 80 Q 95 10 180 80" pathLength="100"
      fill="none" stroke="#333" stroke-width="4"/>
<style>
.line {
  stroke-dasharray: 100;   /* 一实一空各 = 全长（pathLength 归一化成 100） */
  stroke-dashoffset: 100;  /* 实段完全移出可见区 */
  animation: draw 2s ease forwards;
}
@keyframes draw { to { stroke-dashoffset: 0; } }
</style>
```

<v-clicks>

- 原理：dasharray = dashoffset = **路径全长 L** → 动画 offset 从 L 归零，路径像被一笔画出来
- 真实长度用 JS `path.getTotalLength()`；纯 CSS 用 `pathLength` 属性归一化免测长
- `getPointAtLength(len)` 可做沿路径取点

</v-clicks>

<!--
经典的 line drawing 描边动画，面试常让你讲原理。

三步：第一，把 stroke-dasharray 设成整条路径的长度 L，这样虚线序列就是一段长 L 的实线加一段长 L 的空白。第二，把 stroke-dashoffset 也设成 L，虚线起点被平移整整一个实段，可见区域里全是空白段，路径看起来消失了。第三，动画让 offset 从 L 回到 0，实段逐渐滑回可见区，路径就像被一笔画出来。forwards 保住终态。

路径真实长度怎么拿？JS 调 path.getTotalLength()。纯 CSS 方案更优雅：给 path 加 pathLength 等于 100，把任意路径长度归一化成 100，免测长。配套的 getPointAtLength 能沿路径取点坐标，做路径跟随效果。
-->

---

# 渐变：linearGradient / radialGradient

```xml
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"> <!-- 默认水平，这样写变垂直 -->
    <stop offset="0" stop-color="tomato"/>
    <stop offset="1" stop-color="gold" stop-opacity=".5"/>
  </linearGradient>
</defs>
<rect width="100" height="60" fill="url(#g)"/>
```

<v-clicks>

- `radialGradient` 的 `fx/fy` 是**焦点**（渐变 0% 的发射点），默认与圆心重合；焦点出圈会被拉回圈内
- `spreadMethod`：pad（默认端色延伸）/ reflect（镜像往返）/ repeat（循环）
- `gradientUnits` 默认 **objectBoundingBox**（0~1 相对包围盒，随对象自适应）；跨多图形共享同一渐变用 **userSpaceOnUse**
- 渐变可 `href="#另一渐变"` 继承其色标只改几何（旧写法 xlink:href）

</v-clicks>

<!--
渐变三件套：defs 里定义、stop 定色标、fill 或 stroke 用 url 井号 id 引用。

linearGradient 默认从 (0,0) 到 (1,0) 水平方向；把 x2 归零、y2 设 1 就变垂直。stop 上是 offset、stop-color、stop-opacity。

radialGradient 径向渐变多了焦点概念：fx、fy 是渐变 0% 的发射点，默认与圆心重合，故意偏移能做高光效果；焦点跑出圆外会被拉回圈内。

spreadMethod 管色标区间外怎么铺：pad 默认端色延伸，reflect 镜像往返，repeat 循环。

gradientUnits 是坐标系考点：默认 objectBoundingBox，坐标 0 到 1 相对被填充对象的包围盒，对象变大渐变跟着自适应；想让多个图形共享同一条渐变，切 userSpaceOnUse 用绝对用户坐标。渐变还能用 href 引用另一条渐变，继承色标只改几何。
-->

---

# pattern 平铺图案：双坐标系坑

```xml
<pattern id="p" width=".25" height=".25">   <!-- tile：相对包围盒 → 横向铺 4 次 -->
  <circle cx="10" cy="10" r="8"/>           <!-- 内容：用户坐标（绝对） -->
</pattern>
<rect width="200" height="200" fill="url(#p)"/>
```

<v-clicks>

- **双坐标系是招牌坑**：`patternUnits`（tile 的 x/y/width/height）默认 **objectBoundingBox**，`patternContentUnits`（tile 内部内容）默认 **userSpaceOnUse**——两个默认值**不一致**，内容坐标与 tile 坐标脱节
- objectBoundingBox：对象变大 → tile 跟着变大，**铺的个数不变**
- userSpaceOnUse：tile 尺寸固定 → 对象变大**铺更多次**
- 不显式统一必然对不上——写 pattern 前先把两套 units 想清楚

</v-clicks>

<!--
pattern 平铺图案，招牌坑是双坐标系。

它有两个 units 属性，管两套东西：patternUnits 管 tile 本身的 x、y、width、height，默认 objectBoundingBox，也就是相对被填充对象包围盒的 0 到 1——width 0.25 表示横向铺四次。patternContentUnits 管 tile 内部图形的坐标，默认却是 userSpaceOnUse 绝对用户坐标。

两个默认值不一致：tile 用相对坐标、内容用绝对坐标，内容和格子天然脱节，不显式统一或者心里有数，画出来必然对不上，这是 pattern 调不出来的第一原因。

两种 units 的缩放行为也不同：objectBoundingBox 下对象变大 tile 跟着变大、个数不变；userSpaceOnUse 下 tile 尺寸固定、对象变大就铺更多次。按需求选。
-->

---

# 结构复用：defs / symbol / use ★必考

```html
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  <symbol id="icon-ok" viewBox="0 0 24 24">
    <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2"/>
  </symbol>
</svg>
<svg class="icon" width="24" height="24"><use href="#icon-ok"/></svg>
<style>.icon { color: teal; } /* currentColor 穿透影子树 → 图标随文字色 */</style>
```

<v-clicks>

- `<defs>` 只定义不渲染；`<symbol>` 专为复用设计——自带 viewBox、永不直接渲染、内置 title 随引用带出，比裸 `<g>` 更适合图标
- `<use>` 把目标**深克隆进封闭影子树**：克隆内容 JS 摸不到（querySelector 选不中）
- CSS **继承值 / currentColor / 自定义属性可穿透**；被引元素**显式写死的属性外部覆盖不了**
- 外部 sprite `href="sprite.svg#icon"` 可缓存、一次请求 N 图标，但**严格同源**（无 CORS 开关）

</v-clicks>

<!--
复用体系三兄弟。g 是分组加属性继承；defs 是只定义不渲染的资源库；symbol 是专为复用设计的模板——自带 viewBox 和 preserveAspectRatio、永不直接渲染、内置的 title 会随引用带出，做图标比裸 g 合适得多。

use 是引用方，机制必考：它把目标节点深克隆进一棵封闭影子树渲染，DevTools 里显示 shadow-root。三条规则：一，克隆内容 JS 摸不到，querySelector 选不中；二，CSS 继承可以穿透——currentColor、字体、CSS 自定义属性都能传进去，所以示例里外部 color 一改图标就变色；三，被引元素显式写死的属性和样式，外部怎么设都覆盖不了，所以图标源文件里不要硬编码颜色。

use 上只有 x、y、width、height、href 有特殊语义，width、height 还只在引用 svg 或 symbol 时生效。外部 sprite 文件可缓存、一次请求拿全部图标，但严格同源，没有 CORS 开关，放跨域 CDN 直接不显示。

顺带一提 marker：给路径顶点挂箭头圆点用的，markerUnits 默认 strokeWidth 随线宽缩放，orient 用 auto-start-reverse 能做双向箭头，context-stroke 可继承宿主线条色。
-->

---

# clipPath vs mask ★必考

| | clipPath | mask |
|---|---|---|
| 判定 | **纯几何**：点在路径内/外，二值 | **像素级**：亮度 × alpha → 目标透明度 |
| 半透明/软边 | 不可能（fill 色、透明度全被忽略） | 白显黑隐灰半透，渐变可做淡出 |
| 性能 | 更好 | 更贵 |
| 典型 | 头像裁圆、异形窗口 | 渐隐、羽化、镂空效果 |

<v-clicks>

- 默认坐标系不同：`clipPathUnits` 默认 userSpaceOnUse；`maskUnits` 默认 objectBoundingBox（`maskContentUnits` 默认 userSpaceOnUse）
- 渐变遮罩一例：`<mask>` 内放一个 `fill="url(#白到黑渐变)"` 的矩形 → 目标左实右透渐隐
- CSS 的 `clip-path` / `mask` 属性可引用 SVG 定义（`clip-path: url(#cut)`），并能作用于 **HTML 元素**

</v-clicks>

<!--
裁剪和遮罩的本质区别，一句话就能答到点上：clipPath 是纯几何判定，一个点要么在路径内要么在外，二值切割，裁剪形状上的 fill 颜色、透明度全被忽略；mask 是像素级判定，用遮罩内容的亮度乘以 alpha 决定目标每个像素的透明度，白显黑隐、灰是半透明。

推论：clipPath 做不出半透明和羽化软边，要淡出效果只能 mask，比如 mask 里放一个白到黑渐变填充的矩形，目标就左实右透渐隐。代价是 mask 逐像素计算，性能比 clipPath 贵。

坐标系默认值要背：clipPathUnits 默认 userSpaceOnUse；maskUnits 默认 objectBoundingBox，maskContentUnits 默认 userSpaceOnUse。

另外 CSS 的 clip-path 和 mask 属性可以直接引用 SVG 里的定义，而且能作用于 HTML 元素，异形卡片、图文遮罩都是这么做的。
-->

---

# 滤镜：`fe*` 原语管道 ★高频

```xml
<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
  <feOffset in="blur" dx="4" dy="4" result="off"/>
  <feMerge><feMergeNode in="off"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<!-- SVG 2 / Filter Effects 快捷原语，一条顶三条 -->
<filter id="ds"><feDropShadow dx="4" dy="4" stdDeviation="3"/></filter>
```

<v-clicks>

- 管道模型：每个 `fe*` 原语一进（`in`，部分有 `in2`）一出（`result` 命名中间结果），不写 `in` 默认吃上一个原语的输出
- 内置输入：`SourceGraphic`（原图）/ `SourceAlpha`（原图 alpha 通道，做阴影的原料）
- ⚠️ **滤镜区域默认只比元素大 10%**（-10% ~ 120%）：大模糊、长阴影会被切边——手动扩 region（如上）
- CSS `filter: url(#id)` 可把 SVG 滤镜套在 **HTML 元素**上；CSS 的 `blur()` 等函数本质是原语速记

</v-clicks>

<!--
SVG 滤镜是一条原语管道：filter 元素里排若干 fe 开头的原语，每个原语从 in（有的还有 in2）拿输入、处理后可用 result 给中间结果命名，下一个原语再引用；不写 in 就默认吃上一个原语的输出。内置输入关键字：SourceGraphic 是原图，SourceAlpha 是原图的 alpha 通道，做阴影的标准原料。

经典投影管道三步：SourceAlpha 先 feGaussianBlur 高斯模糊，再 feOffset 偏移，最后 feMerge 把阴影和原图叠起来，先列的在下。现在有快捷原语 feDropShadow，一条顶三条。

大坑：滤镜区域默认只比元素大 10%，即 x、y 是负 10%，宽高 120%。大模糊、长距离阴影会被这个框切边，要手动扩大 region，示例里扩到了负 20%、140%。

其他常用原语点个名：feColorMatrix 做灰度变色，feTurbulence 加 feDisplacementMap 做噪声水波，还有 feFlood、feComposite、feComponentTransfer 和光照原语。CSS 的 filter 属性能用 url 把 SVG 滤镜套在 HTML 元素上，CSS 那些 blur、drop-shadow 函数本质就是这些原语的速记。
-->

---

# 动画 ①：SMIL 声明式动画

```xml
<circle cx="0" cy="50" r="15" fill="blue">
  <animate attributeName="cx" from="0" to="300" dur="5s"
           repeatCount="indefinite"/>
</circle>
<rect width="20" height="20">
  <animateMotion dur="3s" rotate="auto" path="M 0 0 H 300 Z"/>
</rect>
```

<v-clicks>

- 四元素：`<animate>` / `<animateTransform>` / `<animateMotion>`（`rotate="auto"` 随路径切线转向，`<mpath>` 引既有路径）/ `<set>`
- 关键属性：`fill="freeze"` 保终态；`begin` 支持事件（`click`）与同步（`otherId.end+0.5s`）；`keySplines` + `calcMode="spline"` 做缓动
- **2026 现状：未被标准废弃**——Chrome 45 曾宣布弃用、后官方**撤回**；三大浏览器持续支持，定位「维护模式」
- 独有能力：`<img>` 内自动播、跨浏览器路径 morph（`d` 值插值）、无脚本沿路径运动

</v-clicks>

<!--
SVG 动画三条路线，先看写在 SVG 内部的声明式方案 SMIL。

四个元素分工：animate 动一般属性；animateTransform 动变换；animateMotion 让元素沿路径运动，rotate 设 auto 会随切线转向，路径可以内联 path 也可以用 mpath 引用已有路径；set 是无过渡的定时赋值。

关键属性：from、to、values 定值域，dur 时长，repeatCount 设 indefinite 无限循环，fill freeze 保住终态。begin 很强：除了时间还支持事件触发比如 click，以及跨元素同步，比如另一个动画结束后半秒开始。缓动用 keyTimes 加 keySplines 配 calcMode spline。

现状必须说准：SMIL 没有被标准废弃。Chrome 45 在 2015 年宣布过弃用、随后官方撤回了；Chrome、Firefox、Safari 都持续支持。定位是维护模式：不再扩展新能力，但它仍是唯一能在 img 引用里自动播放、且无脚本实现路径变形和沿路径运动的方案。面试和写作都别说死「已弃用」。
-->

---

# 动画 ②：CSS 与 JS（WAAPI / GSAP）

<v-clicks>

- CSS 可动画范围 = **presentation properties**：fill / stroke / opacity / stroke-dasharray / dashoffset / transform / filter…
- SVG 2 起**几何属性也开放给 CSS**（cx、cy、r、x、y、width、height…），Chromium / Firefox / Safari 已支持
- ⚠️ `d: path("…")` 例外：仅 **Chromium 52+ / Firefox 97+**，**Safari 至今不支持**；且插值要求两条路径**命令数量与类型完全一致**——跨浏览器路径变形回 SMIL 或 JS 库
- inline SVG 语境下 hover 伪类、媒体查询、CSS 变量全部可用
- JS：WAAPI `svgEl.animate(keyframes, options)`（只能动 CSS 可控属性）；rAF + `setAttribute` 可动**任意属性**
- 库一句话：**GSAP 事实标准**（MorphSVG / DrawSVG 插件）、Snap.svg、anime.js、Framer Motion

</v-clicks>

<div v-click class="mt-3 text-sm">

> 选型口诀：**UI 微动效 → CSS；路径变形 / 沿路径 / `<img>` 内自动播 → SMIL；复杂时间线 / 交互驱动 → JS**

</div>

<!--
第二条路 CSS。可动画范围是 presentation properties：fill、stroke、opacity、dasharray、dashoffset、transform、filter 这些。SVG 2 之后几何属性也开放给了 CSS，cx、r、x、width 等等，三大内核都已支持，这让「用 CSS 过渡改半径」成为可能。

但 d 属性是著名例外：CSS 里写 d: path() 做路径变形，只有 Chromium 52 以上和 Firefox 97 以上支持，Safari 至今不支持，MDN 标注非 Baseline；而且插值要求两条路径命令数量和类型完全一致。所以跨浏览器的路径 morph 要回退到 SMIL 或者 JS 库。

第三条路 JS：Web Animations API 直接对 SVG 元素调 animate，不过只能动 CSS 可控的属性；requestAnimationFrame 手撸加 setAttribute 则什么属性都能动。库层面 GSAP 是事实标准，MorphSVG、DrawSVG 插件专攻路径变形和描边动画，其他还有 Snap.svg、anime.js、Framer Motion。

选型口诀收尾：UI 微动效用 CSS；路径变形、沿路径运动、img 里自动播用 SMIL；复杂时间线和交互驱动用 JS。
-->

---

# transform 的三个坑 ★必考

```css
.gear {
  transform-box: fill-box;   /* 参考框改为自身几何包围盒 */
  transform-origin: center;  /* 此时 center 才是「自身中心」 */
  animation: spin 4s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg) } }
```

<v-clicks>

- ① 旋转中心：属性 `rotate(a)` **默认绕用户坐标系原点 (0,0)**，写 `rotate(a,cx,cy)` 才绕指定点；CSS transform 默认参考框是 **view-box** 而非自身——绕自身中心必须如上 `fill-box + center`
- ② 顺序敏感：多变换**从左到右**依次应用、每步建立**新坐标系**——`translate(30) scale(2)` ≠ `scale(2) translate(30)`（后者位移也被放大成 60）
- ③ `scale()` 连 `stroke-width` 一起缩放——图放大线变粗，解法 `vector-effect="non-scaling-stroke"`
- 单位差异：属性写 `rotate(45)` 裸数字（度），CSS 必须 `rotate(45deg)`

</v-clicks>

<!--
transform 在 SVG 里有三个著名的坑。

第一，旋转中心。transform 属性的 rotate 默认绕用户坐标系原点 (0,0) 转，不是绕图形自己，想绕指定点要写三参数版本。SVG 2 之后 CSS transform 也能作用于 SVG 元素，但 CSS 的默认参考框是 view-box 也就是最近的 SVG 视口，还是不是自身中心。想绕自身中心转，标准修正法就是代码里这两行：transform-box 设 fill-box 把参考框改成自身几何包围盒，再 transform-origin center。齿轮原地转全靠它。

第二，顺序敏感。多个变换从左到右依次应用，而且每一步都建立新坐标系：先平移再缩放，和先缩放再平移不等价——后者连位移都被放大成 60。

第三，scale 连描边宽度一起缩放，图放大线跟着变粗，地图图表用 vector-effect non-scaling-stroke 保持线宽。

还有单位差异：属性里 rotate(45) 裸数字是度，CSS 里必须带 deg 单位。matrix 六参数的公式是 newX = a·x + c·y + e，newY = b·x + d·y + f，a、d 管缩放，b、c 管斜切，e、f 管平移。
-->

---

# 脚本操作：createElementNS 与专有 API ★必考

```js
const NS = "http://www.w3.org/2000/svg";
const rect = document.createElementNS(NS, "rect"); // createElement 造的不渲染！
rect.setAttribute("width", "100"); // 无前缀属性用 setAttribute 即可
svg.appendChild(rect);
use.setAttribute("href", "#id");   // SVG 2 推荐；xlink:href 已废弃
```

<v-clicks>

- HTML 解析器对内联 `<svg>` **自动切入 SVG 命名空间**（xmlns 可省）；`document.createElement("rect")` 造出的是 HTML 命名空间的无意义元素——**不渲染**，是「JS 动态画 SVG 失败」第一原因
- 专有 API：`getTotalLength()` / `getPointAtLength()` / `getBBox()`（几何包围盒，不含 stroke）/ `getScreenCTM()`（屏幕 ↔ SVG 坐标换算，图表交互刚需）
- 命中判定 `pointer-events` 默认 **visiblePainted**：指针落在「实际着色」处才命中——`fill="none"` 的镂空区域**点不中**
- 透明热区：`pointer-events="all"` 或 `fill="transparent"`；装饰层穿透用 `pointer-events: none`

</v-clicks>

<!--
JS 操作 SVG，第一关是命名空间。HTML 解析器遇到内联 svg 会自动切换到 SVG 命名空间，所以标签上 xmlns 可以省；但 JS 动态创建没有这个待遇：document.createElement 造出来的 rect 是 HTML 命名空间里的无意义元素，压根不渲染——这是「JS 动态画 SVG 失败」的第一原因。必须 createElementNS 带上 SVG 命名空间 URI。属性方面，无前缀属性直接 setAttribute 就行，等价于 setAttributeNS 传 null；href 在 SVG 2 里已经取代 xlink:href，现代浏览器直接 setAttribute href，只有兼容旧 Safari 才需要 xlink 的 NS 版本。innerHTML 在 HTML 文档里插 svg 片段没问题，解析器会处理命名空间。

SVG DOM 有一批专有 API：getTotalLength 测路径长，getPointAtLength 沿路径取点，getBBox 拿几何包围盒、注意不含 stroke，getScreenCTM 拿坐标系矩阵，配 DOMPoint 的 matrixTransform 做屏幕坐标到 SVG 坐标的换算，图表交互刚需。

事件命中方面，pointer-events 默认 visiblePainted：指针落在实际着色的地方才命中，fill 为 none 的镂空区域点不中。想让透明区域可点，设 pointer-events all 或者 fill transparent；想让装饰层穿透给下层交互，设 none。
-->

---

# 性能与 SVGO 优化

<v-clicks>

- **瓶颈本质 = DOM 节点数**：几百~3k 节点舒适区，3k–5k 开始卡，上万节点（10 万散点）必须换 Canvas/WebGL
- 高成本特性：filter（尤其大 stdDeviation）、mask、大面积半透明叠加、textPath
- 动画尽量用 transform / opacity，别逐帧改几何属性
- **SVGO**（Node 库 + CLI）：删编辑器元数据 / 注释 / 默认值、路径精度压缩——`svgo icon.svg`，配置 `svgo.config.mjs`；在线 GUI = SVGOMG
- ⚠️ **v4（2025）才把 `removeViewBox` / `removeTitle` 移出 preset-default**——v3 及更早必须手动禁用 removeViewBox，否则产物图标无法响应式缩放（历史第一大坑）
- 工程链路：设计稿导出 → SVGO → sprite 合并（symbol）或组件化（SVGR → React / vite-svg-loader → Vue）
- 静态大图退化为 `<img>`：浏览器按普通图片光栅化 + 缓存

</v-clicks>

<!--
性能问题的本质是 DOM 节点数：每个图形都要参与样式计算、布局、绘制。经验阈值：几百到三千节点是舒适区，三千到五千开始卡，上万节点比如十万个散点，必须换 Canvas 或 WebGL。高成本特性点名：filter 尤其是大模糊半径、mask、大面积半透明叠加、textPath。动画尽量只动 transform 和 opacity，别逐帧改几何属性。

产物优化靠 SVGO：删编辑器元数据、注释、隐藏元素、默认值，压缩路径精度。命令行 svgo 直接跑，配置写 svgo.config.mjs，不想装工具用在线版 SVGOMG。

历史第一大坑必须讲：SVGO 直到 2025 年的 v4 才把 removeViewBox 和 removeTitle 移出默认预设。用 v3 及更早版本，必须手动禁用 removeViewBox——viewBox 被删掉的图标失去固有宽高比，无法响应式缩放；removeTitle 同理伤无障碍。

工程链路：设计稿导出，过 SVGO，然后要么 symbol 合并成 sprite，要么组件化，React 用 SVGR、Vue 用 vite-svg-loader。纯静态大图可以退化成 img 引用，浏览器当普通图片光栅化加缓存，反而更快。
-->

---

# 无障碍与响应式

```html
<svg role="img" aria-labelledby="t d" viewBox="0 0 100 100">
  <title id="t">月度销量趋势</title> <!-- 必须是第一个子元素 -->
  <desc id="d">3 月起持续上升，6 月达到峰值。</desc>
</svg>
```

<v-clicks>

- `role="img"` 防止被读成一堆 group；`aria-labelledby` 指向 title（+desc）比 describedby 兼容更好；无 title 时直接 `aria-label`
- `<img>` 方式必须给 `alt`；纯装饰：`alt=""`，inline 则 `aria-hidden="true"`（老 IE/Edge 另加 `focusable="false"` 防 Tab 焦点落入）
- `<title>` 兼提供鼠标 tooltip；`<symbol>` 内置 title 会随 `<use>` 带出
- 响应式金律：**保留 viewBox、去掉硬编码 width/height**，CSS 控尺寸（viewBox 提供固有宽高比）
- `fill="currentColor"` 图标随文字色；**CSS 变量穿透 use 影子树** = 多色图标唯一外控通道

</v-clicks>

<!--
无障碍的标准姿势看代码：svg 上 role 设 img，防止读屏器把它读成一堆无意义的 group；title 必须是第一个子元素，desc 补充细节；用 aria-labelledby 同时指向两者的 id，这比 aria-describedby 兼容性好；没有 title 的简单图标直接 aria-label。title 还免费提供鼠标悬停 tooltip，symbol 里内置的 title 会随 use 引用一起带出，sprite 图标的无障碍就靠它。

img 方式引用必须给 alt；纯装饰图 alt 留空，inline 的纯装饰 SVG 设 aria-hidden true，老 IE 和旧版 Edge 还要加 focusable false，防止 Tab 键焦点落进去。复杂图表还可以用 role list、listitem 组织数据项，role presentation 隐藏纯装饰的轴线。

响应式金律一句话：保留 viewBox、去掉硬编码的 width 和 height，尺寸交给 CSS——viewBox 提供固有宽高比，容器多宽图形就等比多大。

主题适配两件套：fill 用 currentColor，图标颜色跟随文字色，暗色模式零成本；多色图标想从外部控制，唯一通道是 CSS 自定义属性穿透 use 影子树，symbol 内部写 var 加默认值，外部按实例改变量。
-->

---

# 易错点雷区

<v-clicks>

- 无固有尺寸的 SVG 被 `img`/`object` 引用 → 回退 **300×150**（经典「SVG 怎么变 300×150 了」）
- `<img>` 引用 = 安全沙箱：**脚本不执行、外部资源不加载**——「本地打开正常、当图片引用就坏」多半是它
- **id 是页面级全局**：多个 inline SVG 共用 `#gradient` 这类通用 id 互相串——组件化时给 id 加前缀 / hash
- 服务器 MIME 配错（须 `image/svg+xml`）是 SVG 加载失败常见原因
- presentation attribute **优先级最低**：任何 CSS 规则都能覆盖 `fill="red"`；行内 style 最高——别指望属性赢过 CSS
- SVG 文本**不自动换行**：`tspan` 逐行重定位手动换行，或 `foreignObject` 嵌 HTML
- stroke 骑在路径中心线：1px 描边落在半像素处**发虚**；贴边图形的描边一半溢出 viewBox 被裁
- 「SMIL 已弃用」是**误传**——Chrome 弃用令已撤回，面试与写作都别说死

</v-clicks>

<!--
收尾前把高频雷区排一遍。

尺寸类：没有固有尺寸的 SVG 被 img 或 object 引用时，按替换元素规则回退成 300 乘 150，解法还是那条金律——文件带 viewBox，尺寸交给 CSS。img 引用是安全沙箱，脚本不执行、外部图片外链样式都不加载，「本地打开正常、当图片引用就坏」多半是这个。

工程类：id 在页面里是全局的，多个内联 SVG 都叫 gradient 就互相串色，组件化时给 id 加前缀或 hash。服务器 MIME 必须 image/svg+xml。样式优先级：presentation attribute 优先级最低，任何 CSS 规则都能覆盖 fill 等于 red 这种属性写法，行内 style 最高。

渲染类：SVG 文本不自动换行，要么 tspan 逐行重定位，要么 foreignObject 嵌 HTML，顺带一提 foreignObject 也是 html2canvas 截图原理的依赖。stroke 骑在路径中心线上，一像素描边落在半像素处会发虚，贴着边缘的图形描边有一半溢出 viewBox 被裁。

最后再强调一次：SMIL 已弃用是误传，Chrome 的弃用令官方撤回了，三大浏览器都还支持。
-->

---
layout: intro
---

# 总结

SVG = **保留模式的矢量图形 DOM**

- 坐标：viewBox 定义用户坐标系，preserveAspectRatio 管适配（meet / slice / none）
- path 万能：大小写 = 绝对/相对，A 弧 7 参数；dasharray + offset 玩出描边动画
- 复用 defs / symbol / use（封闭影子树）；裁剪 clipPath（几何二值）vs mask（像素亮度）
- 动画三路：CSS 微动效、SMIL 路径 morph 与 `<img>` 内自动播、JS(GSAP) 复杂时间线
- 优化：SVGO 留住 viewBox、控节点数（3k~5k 阈值换 Canvas）、title/desc 无障碍
- 深入：MDN SVG 教程 · CSS-Tricks · svgo.dev

<!--
总结一下。

SVG 是保留模式的矢量图形 DOM：图形即节点，CSS 能样式化、JS 能操作、读屏器能读，无限缩放不失真；节点数上到几千就让位 Canvas。

坐标系统记 viewBox 定义用户坐标系、preserveAspectRatio 管宽高比适配。path 是万能形状，大小写分绝对相对，A 弧七参数最高频；dasharray 加 offset 是描边动画的原理题。复用靠 defs、symbol、use，use 的封闭影子树规则要背；裁剪 clipPath 几何二值、mask 像素亮度。动画三路线按场景选：CSS 微动效、SMIL 管路径变形和 img 内自动播、JS 管复杂时间线。工程上 SVGO 压缩但留住 viewBox，无障碍给 role img 加 title、desc。

想深入，MDN 的 SVG 教程逐页过一遍，CSS-Tricks 的描边动画和无障碍两篇经典，SVGO 官方文档看默认预设。谢谢大家。
-->
