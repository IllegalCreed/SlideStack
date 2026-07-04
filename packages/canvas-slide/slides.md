---
theme: seriph
background: https://cover.sli.dev
title: Canvas 2D
info: |
  Presentation of the HTML Canvas 2D API.

  Learn more at MDN Canvas API
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎨</span>
</div>

<br/>

## Canvas 2D —— 浏览器原生位图绘图 API

立即模式绘图:路径/样式/文本/图像/像素/合成。核心 API 2015 起 Baseline;roundRect、OffscreenCanvas 等 2023 起全面可用

<div @click="$slidev.nav.next" class="mt-8 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API" target="_blank" class="slidev-icon-btn">
    <carbon:book />
  </a>
</div>

<!--
今天聊 HTML Canvas 2D API。一句话定位:它是浏览器原生的立即模式位图绘图 API,JS 逐条命令把像素画进 canvas 的位图缓冲,是数据可视化、游戏、图像处理、图形编辑器的底层基座。

2026 年的基线背景:核心 2D API 从 2015 年 7 月起就是 Baseline Widely;近几年补齐的增量是 roundRect 和 createConicGradient 2023 年 4 月全浏览器支持,ctx.reset 2023 年 12 月,OffscreenCanvas 2023 年 3 月起全支持;willReadFrequently 2024 年 9 月 Safari 18 补齐属于 Newly;而 ctx.filter 至今非 Baseline。

顺序:心智模型 → 上手 → 高清屏适配 → 路径 → 样式 → 文本 → 变换与状态栈 → 合成裁剪 → 图像 → 像素与跨域 → 动画 → 拾取 → 性能 → 基线速览 → 易错点 → 选型。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 定位与心智模型

Canvas 2D = **立即模式**位图绘图:

<v-clicks>

- JS 逐条命令把像素画进 `<canvas>` 位图,**画完即忘**、不保留对象
- SVG/DOM 是**保留模式**:浏览器持有对象树,改属性自动重渲染、天然有事件
- 推论:「移动一个圆」= 清屏 → 以新坐标重画;命中、拖拽全要自建模型
- ECharts / Konva / Fabric / Excalidraw 都建在其上
- 能力面全、性能上限高;但无场景图、无内建事件、无障碍支持差

</v-clicks>

<!--
先建立心智模型。Canvas 是立即模式:调用 fillRect 之后只剩像素,浏览器不记得"这里有个矩形";而 SVG 和 DOM 是保留模式,浏览器持有对象树,改属性就自动重渲染,每个图形天然能绑事件。

由此推论:在 Canvas 里"移动一个圆",实际动作是清屏、然后以新坐标重画一帧;所有交互,点击命中、拖拽,都要自己建模型。

它是 ECharts、Konva、Fabric、Excalidraw 这些库的底层基座。能力面很全:路径、文本、图像、像素、合成、导出都有;性能上限高。代价是抽象层级低:无场景图、无内建事件、无障碍差,状态机全靠自己管理。面试考察的重点也不是背 API,而是状态机、双坐标系、像素管线这三条底层主线。
-->

---

# 上手:canvas 元素与 getContext

```html
<!-- 结束标签必需;标签内是不支持时的替代内容(也是无障碍出口) -->
<canvas id="tutorial" width="150" height="150">
  <img src="clock.png" alt="时钟" />
</canvas>
```

```js
const canvas = document.getElementById("tutorial");
if (canvas.getContext) {                  // 支持性检测
  const ctx = canvas.getContext("2d");    // 可带第二参:{ alpha, willReadFrequently … }
}
```

<v-clicks>

- 不写 width/height 默认 **300×150**;属性 = 位图缓冲,CSS 宽高 = 显示拉伸,比例不一致必失真
- contextType 还有 `webgl` / `webgl2` / `webgpu` / `bitmaprenderer`;同类型二次调用返回**同一实例**
- 重设 `canvas.width`(即使同值)= 清空位图 + **重置全部上下文状态**

</v-clicks>

<!--
上手三件事。第一,canvas 是普通元素但结束标签必需,标签内部放不支持时的替代内容,这也是无障碍出口。第二,用 getContext 拿 2d 上下文,老派的 if canvas.getContext 就是支持性检测;第二参数能传上下文属性,比如 alpha 设 false 声明不透明背景加速绘制,willReadFrequently 后面像素那页细说。

三个关键事实:不写宽高属性,默认 300 乘 150;宽高属性决定位图缓冲尺寸,CSS 宽高只负责显示拉伸,两者比例不一致图像就失真发糊。contextType 除了 2d 还有 webgl、webgpu、bitmaprenderer;同一个 canvas 同类型重复调用返回同一个实例,已设为其他模式就返回 null,已移交 OffscreenCanvas 再调会抛 InvalidStateError。

最后一个坑:给 canvas.width 赋值,哪怕赋同样的值,都会清空位图并把变换、样式等全部上下文状态重置。
-->

---

# 高清屏适配:devicePixelRatio 三步法

```js
const size = 200;                        // 期望的 CSS 逻辑尺寸
const dpr = window.devicePixelRatio;     // 物理像素 / CSS 像素,Retina 常为 2

canvas.style.width = `${size}px`;        // ① CSS 显示尺寸(逻辑像素)
canvas.style.height = `${size}px`;

canvas.width = Math.floor(size * dpr);   // ② 位图缓冲 = 逻辑尺寸 × dpr(物理像素)
canvas.height = Math.floor(size * dpr);

ctx.scale(dpr, dpr);                     // ③ 坐标系放大 dpr 倍,绘制照旧用 CSS 坐标
```

<div v-click class="mt-3 text-sm">

> 缓冲尺寸 = CSS 尺寸时,1 个画布像素被拉伸到 dpr² 个物理像素 → **模糊**。dpr 会变(拖到别的屏 / 缩放):用 `matchMedia("(resolution: …dppx)")` 监听变化重跑三步。

</div>

<!--
重点页:高清屏适配,面试必考。devicePixelRatio 是物理像素比 CSS 像素,Retina 屏常为 2。如果位图缓冲尺寸等于 CSS 尺寸,1 个画布像素要被拉伸去填 dpr 平方个物理像素,画面必然模糊。

修正就是三步法。第一步,CSS 宽高设成期望的逻辑尺寸,管显示。第二步,width、height 属性设成逻辑尺寸乘 dpr,让缓冲按物理像素分配。第三步,ctx.scale 把坐标系放大 dpr 倍,这样后续绘制代码照旧用 CSS 像素坐标写,不用到处乘 dpr。

还有一个细节:dpr 不是常量,窗口拖到另一块屏或用户缩放页面都会变,用 matchMedia 的 resolution 查询监听 change 事件,变了就重跑三步。
-->

---

# 路径系统:四步范式

```js
ctx.beginPath();            // 清空子路径列表,开新路径(不调则旧路径越积越多)
ctx.moveTo(75, 50);         // 提笔移动(不画)
ctx.lineTo(100, 75);        // 画直线段
ctx.lineTo(100, 25);
ctx.closePath();            // 画一条回到子路径起点的直线闭合(可选)
ctx.stroke();               // 描边:不会自动闭合
// ctx.fill()               // 填充:未闭合的子路径会被【自动闭合】
```

<v-clicks>

- 坐标原点在**左上角**,x 向右 y 向下;角度一律**弧度**:`rad = deg * Math.PI / 180`
- 矩形三件套 `fillRect / strokeRect / clearRect` 立即绘制、**不入路径**;`rect()` 才入路径
- 忘 `beginPath()` = 历史路径被再次描一遍(还带上新样式)——头号新手坑

</v-clicks>

<!--
路径是 Canvas 绘图的主干,固定四步:beginPath 清空子路径开新路径;moveTo 提笔移动不画线,lineTo 画直线段;closePath 可选,画一条回到子路径起点的直线;最后 stroke 描边或 fill 填充落地。

两个语义差别要记牢:stroke 不会自动闭合路径,三角形想闭合必须显式 closePath;而 fill 会把未闭合的子路径自动闭合。

坐标系:原点在左上角,x 向右,y 向下;所有角度参数一律用弧度,度数乘 PI 除 180。矩形有两族 API:fillRect、strokeRect、clearRect 三件套是立即绘制、不进路径;rect 才是往当前路径里添加矩形子路径。

头号新手坑:忘了 beginPath,旧子路径一直残留,下次 stroke 或 fill 会把历史路径用新样式再画一遍,画面越来越乱。
-->

---

# 路径家族:圆弧、贝塞尔与填充规则

```js
ctx.arc(x, y, r, 0, Math.PI * 2);               // 圆弧:角差 ≥ 2π 即整圆
ctx.arcTo(x1, y1, x2, y2, r);                   // 切线圆角
ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); // 椭圆(可旋转)
ctx.quadraticCurveTo(cpx, cpy, x, y);           // 二次贝塞尔:1 个控制点
ctx.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);    // 三次贝塞尔:2 个控制点

ctx.beginPath();                                // 填充规则示例:圆环
ctx.arc(50, 50, 30, 0, Math.PI * 2, true);
ctx.arc(50, 50, 15, 0, Math.PI * 2, true);
ctx.fill("evenodd");                            // 奇偶规则:内圆挖空
```

<v-clicks>

- `arc` 第 6 参 anticlockwise 默认 false(顺时针);传 90 期望直角是经典事故(90 弧度 ≈ 14.3 圈)
- 填充规则:`nonzero`(默认,非零环绕)vs `evenodd`(奇偶)——同心双圆 + evenodd = 挖洞

</v-clicks>

<!--
路径家族的成员。arc 画圆弧,起止角差大于等于 2π 就是整圆,第六个参数逆时针标志默认 false 顺时针;arcTo 用两条切线加半径画圆角;ellipse 是可旋转椭圆。贝塞尔两兄弟:quadraticCurveTo 二次曲线一个控制点,bezierCurveTo 三次曲线两个控制点。

角度事故重提一次:arc 和 rotate 都收弧度,传 90 期望直角,实际是 90 弧度约等于十四圈半。

fill 可以传填充规则:默认 nonzero 非零环绕,另一个是 evenodd 奇偶规则。经典应用是同心双圆配 evenodd,内圆被挖空,一次 fill 得到圆环。
-->

---

# Path2D 与 roundRect

```js
const rect = new Path2D();
rect.rect(10, 10, 50, 50);
const circle = new Path2D();
circle.arc(100, 35, 25, 0, 2 * Math.PI);
const logo = new Path2D("M10 10 h 80 v 80 h -80 Z"); // 直接吃 SVG path 语法
ctx.stroke(rect);
ctx.fill(circle);            // fill / stroke / clip / isPointInPath 都接受 Path2D

ctx.roundRect(20, 20, 200, 100, [12]);  // 圆角矩形入路径(2023-04 起 Baseline)
```

<v-clicks>

- Path2D:可保存、复用、组合(`addPath`)的路径对象,交互拾取配 `isPointInPath` 最顺
- `roundRect` 的 radii 同 CSS border-radius(1/2/3/4 值顺时针分配);负半径抛 RangeError

</v-clicks>

<!--
两个现代路径利器。Path2D 把路径变成可保存、可复用、可组合的对象,还能直接用 SVG path 字符串构造;fill、stroke、clip、isPointInPath 全都接受它。这解决了立即模式"路径用完即丢"的痛点,交互拾取时配 isPointInPath 是最顺的一条路;addPath 还能合并多条路径。

roundRect 是 2023 年 4 月起 Baseline 的圆角矩形,radii 参数完全对齐 CSS border-radius 的语义,一个值全角,二、三、四个值按顺时针分配;负半径抛 RangeError,负宽高则水平垂直翻转。注意老的 MDN 中文教程页还说"不存在原生 roundRect",那是过时信息,以参考页的 Baseline 标注为准。
-->

---

# 样式状态机:线型与虚线

<v-clicks>

- `fillStyle / strokeStyle`:CSS 颜色 / 渐变 / 图案,默认黑;**一经设置对后续绘制持续生效**
- `globalAlpha` 全局透明度(默认 1.0);单个图形的透明用 rgba 颜色更细粒度
- `lineWidth` 默认 1.0,以路径为**中心**向两侧各展一半 → 1px 线落整数坐标发糊,**0.5 偏移**修正
- `lineCap`:butt(默认)/ round / square;`lineJoin`:miter(默认)/ round / bevel;`miterLimit` 默认 10

</v-clicks>

```js
ctx.setLineDash([4, 2]);          // 虚线模式:[实, 空]
ctx.lineDashOffset = -offset;     // 每帧递增 offset → 蚂蚁线动画
ctx.strokeRect(10, 10, 100, 100);
```

<!--
样式是典型的状态机:fillStyle、strokeStyle 接受 CSS 颜色字符串、渐变对象或图案对象,默认黑色;关键是一经设置,对后续所有绘制持续生效,这就是"样式残留"问题的根源。globalAlpha 影响之后的一切绘制,单个图形要透明,用 rgba 颜色更细。

线型四件:lineWidth 默认 1,而且是以路径为中心向两侧各展一半,所以一条 1 像素的线落在整数坐标上会跨两列像素各染一半,发糊;修正办法是坐标偏移 0.5,或者用偶数线宽。lineCap 端点样式默认 butt,lineJoin 拐角默认 miter,尖角超过 miterLimit 默认 10 就退化成 bevel。

虚线用 setLineDash 传实、空交替的数组,再配 lineDashOffset 每帧递增,就是选区边缘那种蚂蚁线动画。
-->

---

# 渐变、图案与阴影

```js
const lin = ctx.createLinearGradient(0, 0, 0, 150);       // 起点 → 终点
lin.addColorStop(0, "#00ABEB");                           // 0~1 偏移加色标
lin.addColorStop(1, "#fff");
const rad = ctx.createRadialGradient(45, 45, 10, 52, 50, 30); // 圆1 → 圆2
const conic = ctx.createConicGradient(0, 100, 100);       // 起始角(弧度) + 中心
ctx.fillStyle = lin;                 // 渐变坐标是【画布全局坐标】,不随形状走
```

<v-clicks>

- `createPattern(image, repetition)`:repeat / repeat-x / repeat-y / no-repeat;image 可为 img、另一 canvas、video,必须等加载完成
- 阴影:`shadowOffsetX/Y`、`shadowBlur`、`shadowColor` **默认全透明黑——不设颜色永远看不见影子**;shadowBlur 渲染昂贵,动画慎用
- `ctx.filter`(CSS filter 同语法)**至今非 Baseline**:Safari 稳定版不支持,生产须特性检测 + 降级

</v-clicks>

<!--
渐变三种,套路一致:先创建对象,再 addColorStop 用 0 到 1 的偏移加色标,最后赋给 fillStyle 或 strokeStyle。createLinearGradient 四个参数是起点到终点;createRadialGradient 六个参数是两个圆;createConicGradient 锥形渐变传起始角加圆心,2023 年 4 月起 Baseline。一个易错点:渐变坐标是画布全局坐标系,不随形状走,形状画在别处就取不到想要的色段。

图案 createPattern,重复方式四选一,图像源可以是 img、另一个 canvas 甚至 video,必须等加载完成。

阴影四属性里最阴的坑:shadowColor 默认全透明黑,只设 shadowBlur 不设颜色,影子永远看不见。而且 shadowBlur 渲染昂贵,动画里慎用。ctx.filter 语法和 CSS filter 一样,但至今非 Baseline,Safari 稳定版不支持,生产要特性检测加降级。
-->

---

# 文本

```js
ctx.font = "48px serif";          // CSS font 语法,默认 "10px sans-serif"
ctx.textAlign = "center";         // start(默认)/ end / left / right / center
ctx.textBaseline = "middle";      // alphabetic(默认)/ top / middle / bottom …
ctx.fillText("你好世界", 75, 75);  // 第 4 参可选 maxWidth:超宽整体压缩
ctx.strokeText("你好世界", 75, 75);

const m = ctx.measureText("foo");  // TextMetrics:m.width 是布局宽度
m.actualBoundingBoxAscent + m.actualBoundingBoxDescent; // 实际墨迹高度用这对
```

<v-clicks>

- textAlign 是相对锚点 x 的对齐,start/end 语义受 `direction` 影响;垂直居中用 `textBaseline = "middle"`
- canvas 文本**不进无障碍树、放大即糊**:正文/可交互文本用 HTML/SVG,canvas 只做图形标注

</v-clicks>

<!--
文本三属性:font 用 CSS font 语法,默认 10px sans-serif,这就是为什么不设 font 时文字特别小;textAlign 是相对锚点 x 的水平对齐,默认 start,start 和 end 的语义受 direction 影响;textBaseline 默认 alphabetic,做垂直居中就设 middle。fillText 填充、strokeText 描边,第四个可选参数 maxWidth,超宽时整体压缩字形。

测量用 measureText,返回 TextMetrics:width 是布局宽度;要测真实高度,用 actualBoundingBoxAscent 加 actualBoundingBoxDescent 这对墨迹指标,fontBoundingBox 系列测的则是字体框。letterSpacing、wordSpacing 这些扩展约 2024 年 9 月起三家才齐,属于 Newly。

最后是 MDN 明确的建议:canvas 文本不进无障碍树、不可选中、放大就糊,正文和可交互文本尽量用 HTML 或 SVG,canvas 里的文字只用于图形标注。
-->

---

# 变换:改的是坐标系,顺序敏感

```js
ctx.translate(x, y);      // 原点平移
ctx.rotate(angle);        // 绕【当前原点】顺时针旋转(弧度)
ctx.scale(sx, sy);        // 缩放;负值 = 镜像:scale(-1, 1) 水平翻转
ctx.transform(a, b, c, d, e, f);    // 当前矩阵 × 新矩阵(叠加)
ctx.setTransform(a, b, c, d, e, f); // 先重置为单位矩阵再设(绝对)

ctx.translate(cx, cy);    // 绕图形中心旋转三步:① 原点移到中心
ctx.rotate(Math.PI / 4);  // ② 旋转
ctx.translate(-cx, -cy);  // ③ 移回
```

<v-clicks>

- 变换改变的是**坐标系**,只影响之后的绘制;矩阵依次叠乘,**顺序敏感**(先移后转 ≠ 先转后移)
- 六参:a/d 缩放、b/c 倾斜、e/f 位移;`resetTransform()` 回单位矩阵,`getTransform()` 返回 DOMMatrix

</v-clicks>

<!--
变换这页最重要的一句话:变换改变的是坐标系,不是已画的图形,只影响之后的绘制。translate 平移原点,rotate 绕当前原点顺时针转、收弧度,scale 缩放且负值是镜像,scale 负一逗一就是水平翻转。

矩阵依次叠乘,所以顺序敏感,先 translate 再 rotate 和反过来结果完全不同。transform 是在当前矩阵上叠乘,setTransform 是先重置成单位矩阵再设,一个相对一个绝对;六个参数 a、d 是缩放,b、c 是倾斜,e、f 是位移。

高频面试题"绕图形中心旋转":rotate 永远绕原点转,所以三步走——translate 把原点移到图形中心,rotate 旋转,再 translate 负值移回,然后照常画。
-->

---

# save / restore 状态栈

```js
ctx.fillRect(0, 0, 150, 150);   // 默认黑
ctx.save();                      // 压栈:默认态
ctx.fillStyle = "#09F";
ctx.save();                      // 压栈:蓝色态
ctx.fillStyle = "#FFF";
ctx.globalAlpha = 0.5;
ctx.fillRect(30, 30, 90, 90);    // 半透明白
ctx.restore();                   // 弹栈:回到蓝色态
ctx.fillRect(45, 45, 60, 60);    // 蓝
ctx.restore();                   // 弹栈:回到默认态 → 再画就是黑
```

<div v-click class="mt-2 text-sm">

> 快照内容:变换矩阵、fill/stroke 样式、globalAlpha、line 系、shadow 系、gCO、文本系、图像平滑、**裁剪路径**;**当前路径不在其中**(与 beginPath 互不相干)。循环范式:每轮 save → 变换 → 画 → restore,防累积偏移。

</div>

<!--
save 和 restore 是状态机的核心:save 把当前状态快照压栈,restore 弹栈恢复,严格的栈式嵌套。示例里两次 save 两次 restore,颜色和透明度层层恢复。

快照里有什么,MDN 给了完整清单:变换矩阵、fillStyle、strokeStyle、globalAlpha、line 系列、shadow 四件、globalCompositeOperation、font 等文本系、imageSmoothing,以及裁剪路径。必须强调:当前路径不属于状态,save 不保存它,和 beginPath 互不相干,这是高频考点。

实战范式:循环里要改变换或样式,每轮 save、变换、画、restore,否则 translate 累积偏移,图形飞出画布。save 和 restore 必须配对,多 save 少 restore,裁剪和变换会泄漏到后续所有绘制。
-->

---

# 合成与裁剪

| 值 | 效果 | 典型用途 |
| --- | --- | --- |
| `source-over` | 新画在旧上(默认) | 常规绘制 |
| `destination-over` | 新图垫到旧图**后面** | 补背景 |
| `destination-out` | 旧图重叠处被抠掉 | **橡皮擦 / 刮刮卡** |
| `source-in` | 只留新旧重叠部分 | 蒙版填充 |
| `lighter` | 颜色相加 | 发光粒子 |
| `multiply` / `screen` … | PS 混合模式 | 滤镜合成 |

<div v-click class="mt-2 text-sm">

> `globalCompositeOperation` 共 **26 值**(Porter-Duff + blend modes)。裁剪:`clip()` 把当前路径变为裁剪区,之后绘制只在区内可见;多次 clip 取**交集**、**无法单独撤销 → 必用 save/restore 包裹**;支持 `clip(path, fillRule)`。

</div>

<!--
globalCompositeOperation 决定新像素和已有像素怎么合成,默认 source-over 新画在旧上,一共 26 个值,Porter-Duff 合成加 PS 那套混合模式。高频记这几个:destination-over 把新图垫到旧图后面,适合补背景,MDN 太阳系例子就用它;destination-out 把旧图和新图重叠的部分抠掉,就是橡皮擦、刮刮卡的原理;source-in 只留重叠部分做蒙版填充;lighter 颜色相加做发光粒子;multiply、screen 这些就是 PS 混合模式。

裁剪:clip 把当前路径变成裁剪区,之后的绘制只在区内可见。它和 source-in 效果近似,但 clip 本身不画任何东西。三个规则:默认裁剪区是整个画布;多次 clip 取交集;裁剪路径属于状态但无法单独撤销,所以必须用 save、restore 包裹,这是标准姿势。
-->

---

# 图像 drawImage

```js
ctx.drawImage(image, dx, dy);                          // ① 原尺寸画到 (dx,dy)
ctx.drawImage(image, dx, dy, dW, dH);                  // ② 缩放到目标宽高
ctx.drawImage(image, sx, sy, sW, sH, dx, dy, dW, dH);  // ③ 切片:源在前,目标在后

const img = new Image();
img.onload = () => ctx.drawImage(img, 0, 0);  // onload 先挂再赋 src
img.src = "myImage.png";                      // 没等加载完就画 = 静默画空白
```

<v-clicks>

- 图像源:img / video(取当前帧)/ 另一 canvas / ImageBitmap / OffscreenCanvas / SVG image
- `imageSmoothingEnabled = false` 关插值 → 像素画放大保持锐利(配 `imageSmoothingQuality`)
- 九参口诀「**s**ource 先行」;性能:别每帧现场缩放大图,预先离屏缓存目标尺寸

</v-clicks>

<!--
drawImage 三种签名:三参把图原尺寸画到目标点;五参缩放到目标宽高;九参是切片,从源图裁一块矩形画到目标矩形——记口诀 source 先行,源矩形四个参数在前,目标矩形在后,写反了就切错区域。

图像源很宽:img 元素、video 取当前帧、另一个 canvas、ImageBitmap、OffscreenCanvas 都行。最经典的坑:图片没加载完就 drawImage,不报错,静默画空白;所以 onload 先挂再赋 src,多图用 Promise.all 或 img.decode。

imageSmoothingEnabled 默认开启插值,做像素画或放大镜时设 false 关掉,放大保持马赛克的锐利感,配套 imageSmoothingQuality 三档。性能提醒:不要每帧用 drawImage 现场缩放大图,各尺寸预先缓存到离屏画布。
-->

---

# 像素操作:ImageData

```js
const d = ctx.getImageData(0, 0, w, h);  // 读(画布外区域为透明黑)
d.data;   // Uint8ClampedArray,RGBA 连续存储,长度 = w * h * 4
// 像素 (row, col) 的通道 c(0=R,1=G,2=B,3=A):d.data[(row * w + col) * 4 + c]

for (let i = 0; i < d.data.length; i += 4) {           // 灰度滤镜
  const avg = (d.data[i] + d.data[i + 1] + d.data[i + 2]) / 3;
  d.data[i] = d.data[i + 1] = d.data[i + 2] = avg;     // 反色则 255 - 原值
}
ctx.putImageData(d, 0, 0);   // 写回:无视变换 / globalAlpha / 合成模式
```

<v-clicks>

- `createImageData(w, h)` 预填**透明黑**;putImageData 可带脏区六参只写局部
- **getImageData 昂贵**(GPU→CPU 同步回读):高频读取在 getContext 时声明 `willReadFrequently: true` 切软件渲染;取色器 = `getImageData(x, y, 1, 1).data`

</v-clicks>

<!--
像素级操作围绕 ImageData。getImageData 读出一块区域,画布外的部分补透明黑;data 是 Uint8ClampedArray,RGBA 四通道连续存储,长度是宽乘高乘 4,定位某像素某通道的索引公式是 row 乘宽加 col、整体乘 4、再加通道号。

灰度滤镜就是每四个一组遍历,三通道求平均写回;反色就是 255 减原值。改完 putImageData 写回,注意它无视变换、globalAlpha 和合成模式,是裸写像素,还能带脏区参数只写局部。createImageData 新建的是全透明黑。

性能要点:getImageData 是 GPU 到 CPU 的同步回读,昂贵;高频读取的场景,比如取色器、视频逐帧处理,创建上下文时声明 willReadFrequently true,强制软件渲染,省去回读反而更快。单像素取色就是 getImageData 一乘一区域看 data 四元组。
-->

---

# 跨域污染(taint):画时不报错,导出才炸

<v-clicks>

- 未经 CORS 允许的跨域图(含 `file://` 本地图)一旦画入 → canvas **永久污染**
- 污染后 `getImageData` / `toDataURL` / `toBlob` / `captureStream` 一律抛 **SecurityError**
- **drawImage 那一刻不报错**——问题延迟到读取/导出才爆,极难排查
- 同源图 / dataURL 图不污染;本地调试走 http 服务,别用 file://

</v-clicks>

```js
const img = new Image();
img.crossOrigin = "anonymous";                // ① 请求声明匿名跨域
img.src = "https://cdn.example.com/pic.png";  // ② 服务器须回 Access-Control-Allow-Origin
```

<div v-click class="mt-2 text-sm">

> 导出一家:`toDataURL("image/jpeg", 0.9)` 同步 base64;`toBlob` 异步二进制,大图优先;`captureStream(fps)` 出 MediaStream 接 MediaRecorder 录制 / WebRTC 推流。

</div>

<!--
必考坑:跨域污染。未经 CORS 允许的跨域图像,包括 file 协议的本地图,一旦 drawImage 画进画布,canvas 就被永久污染;之后 getImageData、toDataURL、toBlob、captureStream 全部抛 SecurityError。最阴险的是 drawImage 那一刻完全不报错,问题延迟到读取或导出才爆,离事发点很远,极难排查。

解法两步:图像请求时设 crossOrigin anonymous,同时服务器必须返回 Access-Control-Allow-Origin 响应头,两者缺一不可。同源图和 dataURL 图不污染;本地调试起个 http 服务,别直接开 file 协议。

顺带把导出一家讲完:toDataURL 同步返回 base64 字符串,大图会卡主线程;toBlob 异步出二进制,大图优先;captureStream 输出 MediaStream,能接 MediaRecorder 录屏或 WebRTC 推流,污染画布同样被禁。
-->

---

# rAF 动画范式:基于时间,不是基于帧

```js
let last = performance.now(), x = 0;
function frame(now) {              // rAF 回调收到高精度时间戳
  const dt = (now - last) / 1000;  // 距上一帧的秒数
  last = now;
  x += 120 * dt;                   // 【基于时间】:120px/秒,与帧率无关
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(x, 20, 40, 40);
  requestAnimationFrame(frame);    // 忘了这句动画只走一帧
}
requestAnimationFrame(frame);
```

<v-clicks>

- 每帧四步:**清屏 → save → 绘制 → restore**;rAF 与显示器刷新同步、后台标签页自动暂停
- `x += 2` 这类按帧递增在 120Hz 高刷屏上**速度翻倍**——必须用 delta time

</v-clicks>

<!--
动画的标准范式。MDN 给的每帧四步:清空 canvas、save 状态、绘制、restore。驱动优先 requestAnimationFrame:它和显示器刷新同步,通常 60 帧,后台标签页自动暂停省电;setInterval、setTimeout 不与渲染对齐,可能掉帧或空转。

代码是最小骨架:rAF 回调收到高精度时间戳,和上一帧相减得 delta 秒数,位移按"每秒 120 像素"乘 delta 推进——这叫基于时间的动画。如果写 x 加等于 2 这种按帧递增,120 赫兹高刷屏上速度直接翻倍,必须用 delta time。两个断链点:回调尾部忘了再调 rAF,动画只走一帧;忘了 clearRect,拖影满屏。

带变换时还有个清屏坑,后面易错点页展开:translate 之后 clearRect 清的是变换后的矩形,要先 setTransform 回单位矩阵再清。
-->

---

# 交互拾取:canvas 里没有 DOM 事件

```js
const circle = new Path2D();
circle.arc(150, 75, 50, 0, 2 * Math.PI);
canvas.addEventListener("mousemove", (e) => {
  const hit = ctx.isPointInPath(circle, e.offsetX, e.offsetY);
  ctx.fillStyle = hit ? "green" : "red";  // 传入坐标不受当前变换影响
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fill(circle);
});
```

<v-clicks>

- 事件只落在 `<canvas>` 元素上,拾取三条路:**isPointInPath / 数学命中检测 / hit-canvas**
- hit-canvas:每对象以唯一纯色画进隐藏画布,`getImageData(x, y, 1, 1)` 反查对象——任意形状 O(1)(Konva 方案)
- 缓冲 ≠ CSS 尺寸时(dpr 适配后必现)事件坐标必须换算:`x = (clientX - rect.left) * (canvas.width / rect.width)`

</v-clicks>

<!--
立即模式的直接代价:canvas 内部图形没有 DOM 事件,事件只落在 canvas 元素本身,拾取要自己做,三条路。

第一,isPointInPath,配 Path2D 最顺,四种重载,还有 isPointInStroke 测描边命中;注意传入的坐标是未经变换的画布坐标,不受当前 transform 影响。第二,数学命中检测:圆算距离、矩形判区间,自绘场景图就是对象数组倒序遍历,命中最上层。第三,hit-canvas 颜色拾取:每个对象用唯一纯色画到同尺寸的隐藏画布,点击时 getImageData 取一个像素反查颜色到对象的映射,任意形状都是 O(1),Konva 内部就是这个方案。

最后是坐标换算的坑:事件给的是 CSS 像素,dpr 适配后缓冲尺寸不等于 CSS 尺寸,必须乘 canvas.width 除以 rect.width 换算,否则命中区错位一倍。
-->

---

# 性能优化(上):画得更少、切换更少

<v-clicks>

- **离屏 canvas 预渲染**:重复的复杂图形先画到离屏画布,每帧 `drawImage` 拷贝;离屏尺寸**必须紧贴内容**
- **分层 canvas**:静背景与动前景拆成多张绝对定位叠放的画布,各自独立重绘频率
- **脏矩形**:只清除/重绘变化区域,不整屏刷
- **批量绘制**:多条线段并入一条 path 一次 stroke;按 fillStyle **分组绘制**——状态切换本身有开销
- **整数坐标**:非整坐标触发亚像素抗锯齿,`Math.floor()` 取整(海量图元时仍有效)
- **静态大背景交给 CSS** background;整屏缩放用 CSS transform(走 GPU)
- `{ alpha: false }` 声明不透明画布,跳过 alpha 合成
- **规避昂贵特性**:`shadowBlur`、大量 `fillText`、每帧 `getImageData`

</v-clicks>

<!--
性能优化上篇,渲染侧清单,核心思想是画得更少、切换更少。

第一,离屏预渲染:重复出现的复杂图形先画到 document.createElement 出来的离屏画布上,每帧只 drawImage 拷贝;web.dev 特别强调离屏画布尺寸必须紧贴内容,松散的大画布拷贝开销会把收益吃掉。第二,分层:静态背景和高频前景拆成多张叠放的 canvas,各自独立重绘。第三,脏矩形,只重绘变化区域。

第四,批量绘制:多条线段并进一条 path 一次 stroke;按 fillStyle 分组画,因为改样式是状态机开销,不要每个对象设一次色。然后是整数坐标避免亚像素抗锯齿;静态大背景直接交给 CSS;整屏缩放用 CSS transform 走 GPU;alpha false 声明不透明画布跳过合成;最后规避 shadowBlur、大量 fillText、每帧 getImageData 这些昂贵操作。
-->

---

# 性能优化(下):OffscreenCanvas + Worker

```js
const off = canvas.transferControlToOffscreen();  // main.js:移交后原 canvas 不能再 getContext
const worker = new Worker("render.worker.js");
worker.postMessage({ canvas: off }, [off]);  // transfer:零拷贝移交所有权
// render.worker.js —— Worker 里也有 rAF,主线程卡死也不掉帧
onmessage = (evt) => {
  const ctx = evt.data.canvas.getContext("2d");
  function render() { /* …绘制… */ requestAnimationFrame(render); }
  requestAnimationFrame(render);
};
```

<div v-click class="mt-2 text-sm">

> 2023-03 起 Baseline。模式 B(同步显示):`new OffscreenCanvas(w, h)` 绘制 → `transferToImageBitmap()` → `bitmaprenderer` 上下文 `transferFromImageBitmap()` 上屏;导出用 `convertToBlob()`。老示例的 `gl.commit()` 已从规范移除。

</div>

<!--
性能的终极手段:把渲染彻底移出主线程。OffscreenCanvas 是和 DOM 解耦的画布,2023 年 3 月起 Baseline,窗口和 Worker 里都能用。

最常用的模式 A:主线程对 canvas 调 transferControlToOffscreen 拿到离屏句柄,postMessage 发给 Worker,注意第二个参数 transfer 列表,零拷贝移交所有权;移交后原 canvas 再 getContext 会抛 InvalidStateError。Worker 里也有 requestAnimationFrame,可以跑完整渲染循环,主线程卡死也不影响动画,图表、地图、游戏把渲染放 Worker,长任务不再掉帧。

模式 B 是同步显示:new OffscreenCanvas 独立画布绘制,transferToImageBitmap 零拷贝取出位图,交给 bitmaprenderer 上下文上屏;导出用 convertToBlob。提醒一点:MDN 老示例里的 gl.commit 已经从规范移除,现行做法就是 Worker 内 rAF 循环。
-->

---

# 2026 基线速览:新 API 状态

| 能力 | 基线状态(2026-07) |
| --- | --- |
| 核心 2D API(路径/文本/像素/合成) | Widely,2015-07 起 |
| `roundRect` / `createConicGradient` | Widely,2023-04 |
| OffscreenCanvas + 控制权移交 | Widely,2023-03 起 |
| `ctx.reset()` | Baseline 2023-12 |
| `willReadFrequently` | Newly 2024-09(Safari 18 补齐),Widely 预计 2027-03 |
| `ctx.filter` | **非 Baseline**:Safari 稳定版至今未上线 |

<div v-click class="mt-2 text-sm">

> 清屏三法:`clearRect`(只清像素,最快)vs 重设 `width`(清像素 + 状态,重分配缓冲)vs `ctx.reset()`(标准化"回到全新上下文":位图 + 状态栈 + 路径 + 变换 + 裁剪全重置)。

</div>

<!--
2026 年 7 月的基线快照。核心 2D API 从 2015 年就 Widely;roundRect 和锥形渐变 2023 年 4 月起 Widely;OffscreenCanvas 连同控制权移交 2023 年 3 月起,到 2026 已属 Widely;ctx.reset 2023 年 12 月 Baseline;willReadFrequently 是 Newly,2024 年 9 月 Safari 18 补齐,Widely 预计 2027 年 3 月。

两个反例:ctx.filter 至今非 Baseline,Safari 稳定版没上线,生产必须特性检测加降级,可用 SVG 滤镜预处理或手写像素滤镜替代;desynchronized 是 Blink 专属的降延迟提示,手写笔场景用,其他引擎忽略;display-p3 广色域约 2023 年起三大浏览器可用。

底部对比清屏三法:clearRect 只清像素、保留状态,常规最优;重设 width 清像素加状态还重新分配缓冲,慢;ctx.reset 是标准化的"回到全新上下文",位图、状态栈、路径、变换、裁剪一步全重置。
-->

---

# 易错点急救清单

<v-clicks>

- 只用 CSS 设大小 → 默认 300×150 缓冲被拉糊;高清屏必走 **dpr 三步法**
- 忘 `beginPath` → 历史路径重描;`stroke` 不自动闭合,要 `closePath`(`fill` 才自动闭合)
- `save/restore` 不配对 → clip / 变换**泄漏**到后续所有绘制
- 角度传了度数:`rotate(90)` ≈ 14.3 圈;一律 `deg * Math.PI / 180`
- 图片没等 `onload` 就 drawImage → **静默画空白**
- 带变换清屏清不净 → `save` + `setTransform(1,0,0,1,0,0)` + `clearRect` + `restore`(或 `ctx.reset()`)
- `canvas.width = canvas.width` 清屏副作用:dpr 适配 / 样式全被重置
- 大图 `toDataURL` 同步生成超长 base64,内存 + 主线程双杀 → 用异步 `toBlob` / `convertToBlob`

</v-clicks>

<!--
易错点急救清单,按出镜率排。

尺寸类:只用 CSS 设大小,默认 300 乘 150 的缓冲被拉伸发糊,高清屏必须走 dpr 三步法。路径类:忘 beginPath 历史路径重描;stroke 不自动闭合,期待三角形闭合要 closePath,fill 才自动闭合。状态类:save、restore 不配对,裁剪和变换泄漏到后面所有绘制,栈还越积越深。

数值类:角度传度数,rotate 90 是 90 弧度约十四圈半。时序类:图片没等 onload 就画,静默空白。清屏类:带变换时 clearRect 清的是变换后的矩形,残影,标准姿势 save、setTransform 单位矩阵、clearRect、restore,或者直接 ctx.reset;还有 canvas.width 赋值清屏的副作用,dpr 适配和样式全被重置。导出类:大图 toDataURL 同步生成超长 base64,内存和主线程双杀,改异步 toBlob 或 convertToBlob。
-->

---

# 选型:Canvas 2D vs SVG vs WebGL

| 维度 | Canvas 2D | SVG | WebGL |
| --- | --- | --- | --- |
| 渲染模型 | 立即模式·位图 | 保留模式·矢量 DOM | 立即模式·GPU |
| 图形是对象? | 否,画完即忘 | 是,可直接改属性 | 否(顶点/着色器) |
| 事件 | 元素级,自建拾取 | 天然每图形可绑 | 自建 |
| 缩放 | 位图,放大糊 | 矢量,无限清晰 | 位图 |
| 无障碍 / SEO | 差(需 fallback) | 好 | 差 |
| 首选数据量级 | 数千~数万图元 | 数百~数千节点 | 数万~百万级 |

<div v-click class="mt-2 text-sm">

> 面试口径:节点少、交互富、要无障碍 → **SVG**;上万点散点 / 实时 K 线 → **Canvas**(SVG 的 DOM 数量先崩);十万级以上或 3D → **WebGL**。佐证:ECharts 默认 canvas、D3 大数据量官方建议切 canvas、Mapbox GL 直接 WebGL;混合:底层海量 canvas/WebGL + 顶层交互控件 SVG/HTML。

</div>

<!--
选型对比。渲染模型:Canvas 立即模式位图,SVG 保留模式矢量 DOM,WebGL 立即模式走 GPU。图形是不是对象决定了开发体验:SVG 的图形是节点,CSS、JS 直接改,天然每图形可绑事件;Canvas 和 WebGL 画完即忘,事件和编辑都要自建。缩放上 SVG 矢量无限清晰,位图放大就糊。无障碍和 SEO 也是 SVG 好。数据量级:SVG 数百到数千节点后 DOM 开销先崩;Canvas 撑数千到数万图元;十万级以上或 3D 上 WebGL。

面试口径一句话:节点少、交互富、要无障碍选 SVG;上万点的散点图、实时刷新的 K 线选 Canvas;再往上或 3D 选 WebGL,通常借 Three.js 或 PixiJS。业界佐证:ECharts 默认 canvas 渲染、可选 svg,D3 大数据量官方建议切 canvas,Mapbox GL 直接 WebGL。混合策略很常见:底层海量数据用 canvas 或 WebGL,顶层少量交互控件用 SVG 或 HTML 叠加。
-->

---
layout: intro
---

# 总结

Canvas 2D = **立即模式位图绘图 API**

- 双坐标系:属性定缓冲、CSS 定显示;高清屏 **dpr 三步法**
- 状态机:样式持续生效;**save/restore 栈**,当前路径不在快照里
- 像素管线:getImageData 昂贵、**跨域污染**导出才炸、willReadFrequently
- 动画:**rAF + delta time**,每帧清屏 → save → 画 → restore
- 性能:离屏预渲染 / 分层 / 脏矩形 → **OffscreenCanvas + Worker**
- 2026:roundRect / conic / reset / Offscreen 已 Widely,`filter` 仍非 Baseline

<!--
总结。Canvas 2D 是浏览器原生的立即模式位图绘图 API,画完即忘,一切交互与编辑都建立在"自建模型加重画"之上。

五条主线带走:第一,双坐标系,width、height 属性定位图缓冲,CSS 定显示,高清屏用 dpr 三步法对齐。第二,状态机,样式一经设置持续生效,save、restore 栈管理状态,记住当前路径不在快照里。第三,像素管线,getImageData 是昂贵的 GPU 回读,跨域图会污染画布且导出才报错,高频读取声明 willReadFrequently。第四,动画范式,rAF 驱动加 delta time,每帧清屏、save、画、restore。第五,性能阶梯,离屏预渲染、分层、脏矩形,一路到 OffscreenCanvas 加 Worker 把渲染移出主线程。

2026 年的基线:roundRect、锥形渐变、reset、OffscreenCanvas 都已 Widely,filter 仍非 Baseline。谢谢大家。
-->
