---
theme: seriph
background: https://cover.sli.dev
title: AntV G2
info: |
  Presentation AntV G2 — 简洁的渐进式可视化语法。

  Learn more at [https://g2.antv.antgroup.com](https://g2.antv.antgroup.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📊</span>
</div>

<br/>

## AntV G2 — 简洁的渐进式可视化语法

蚂蚁集团 AntV 出品，理念源自《The Grammar of Graphics》：拒绝枚举图表类型，用标记与编码的组合描述一切图表。2026 年当前版本 v5.4.x

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/antvis/G2" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 AntV G2，蚂蚁集团 AntV 出品的「简洁的渐进式可视化语法」。

它的名字和设计理念都来自 Wilkinson 的《The Grammar of Graphics》，和 ggplot2、Vega-Lite 同一谱系。npm 包的官方关键词里就写着 grammar 这个词，语法是它的灵魂。

版本背景：v5 于 2023 年正式发布，是一次架构重写，与 v4 完全不兼容；当前 npm 最新版是 5.4.8，本次分享以 5.4.x 为基线。MIT 协议，底层渲染引擎是 AntV 统一的 @antv/g。

顺序：先讲图形语法理念，再上手与双 API 风格，然后过语法五要素 mark、encode、transform、coordinate、scale，接着组件、视图复合、动画、交互，最后是渲染引擎、生态、v4 到 v5 迁移和 ECharts 选型。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 图形语法：拒绝枚举图表类型

配置式图表库的心智（如 ECharts）：

<v-clicks>

- 图表是**不可分割的整体**：`series.type: 'bar'`
- 画新图 = 查文档找类型、拼配置项
- 类型清单之外的图，定制成本陡增

</v-clicks>

<div v-click class="mt-6">

G2 的图形语法心智：

- 「**拒绝图表分类**，用基本标记和可视化组件去描述可视化」
- 所有图表都由**标记（Mark）组合**而成
- 造新图 = 换一个 coordinate 或 transform

</div>

<!--
这是全篇最重要的一页：两种造图心智的对立。

配置式的代表是 ECharts：图表是一个不可分割的整体，series.type 写 bar 就是柱状图，写 pie 就是饼图。画图的过程就是查配置项文档、拼 option。好处是上手快，坏处是类型清单之外的图，比如某个组合变体，定制成本会陡增。

G2 的官方表述是：拒绝图表分类，用一些基本标记和可视化组件去描述可视化。图表不再是一个不可分割的整体，而是可以由具有不同用途的标记组合而成。

带来的差别很实际：画一个 ECharts 没有的图，在 G2 里往往只是换一个坐标系或换一个转换。代价是要先理解语法模型，上手门槛比 ECharts 略高，但组合能力和一致性远强；相较 D3 又明显更低成本。这就是「渐进式可视化语法」的定位。
-->

---

# 核心概念与心智公式

```text
一张图 ≈ data + mark(type) + encode + transform
        + scale + coordinate + 组件 + animate + interaction
```

<v-clicks>

- **Mark 标记**：最小视觉单元，图表的「积木」
- **Encode 编码**：数据列与视觉通道的绑定
- **Transform 转换**：筛选、聚合、派生通道值
- **Scale 比例尺**：抽象数据映射为视觉数据的桥梁
- **Coordinate 坐标系**：标准化位置变换为画布坐标
- **Composition 视图复合**：分面 / 重复 / 图层多视图管理
- **Animation / Interaction**：数据驱动动画 + 按需交互探索

</v-clicks>

<!--
官方在 what-is-g2 页列举了七大核心概念：Mark 标记、Transform 转换、Scale 比例尺、Coordinate 坐标系、Composition 视图复合、Animation 动画、Interaction 交互。再加上把数据列绑定到视觉通道的 Encode，就得到这个心智公式。

一张图约等于：数据，加标记类型，加编码，加转换，加比例尺，加坐标系，再加坐标轴、图例、提示这些组件，最后是动画和交互。

这个公式就是后面所有页的地图：我们会按 mark、encode、transform、coordinate、scale 的顺序逐个展开，然后是组件和复合。记住它，G2 的一切配置都能对号入座。
-->

---

# 上手：第一个图表

```js
import { Chart } from '@antv/g2'; // npm install @antv/g2

const chart = new Chart({
  container: 'container', // DOM id 或 HTMLElement
  autoFit: true,          // 自适应容器（默认 false，默认 640×480）
});
chart.options({
  type: 'interval',       // 标记类型：区间条（柱状图的本体）
  data: [{ genre: 'Sports', sold: 275 }],
  encode: { x: 'genre', y: 'sold' }, // 数据列 ↔ 视觉通道
});
await chart.render();     // 必须手动调用；异步返回 Promise
```

<div v-click class="mt-3 text-sm">

> 生命周期：`new Chart()` → `render()` → 改 options 后再 `render()` 更新 → 卸载时 `destroy()`。`clear()` 清空配置**保留实例**，`destroy()` 彻底销毁防内存泄漏。

</div>

<!--
上手四步：安装 @antv/g2，new Chart 建实例，options 声明图表，render 渲染。

构造参数里 container 可以是 DOM id 字符串或 HTMLElement，框架里推荐传 ref 元素，后面会展开。autoFit 默认是 false，默认尺寸 640 乘 480，开了 autoFit 就以容器为准，注意容器要先有实际尺寸，否则高度异常。

options 里三件事：type 定标记类型，data 给数据，encode 把 genre 列绑到 x 通道、sold 列绑到 y 通道，一个柱状图就出来了。

两个考点：第一，render 必须手动调用，而且是异步的，返回 Promise，截图或测试要 await，渲染失败可以 catch。第二，生命周期五阶段：创建、挂载、渲染、修改 options 后再次 render 更新、最后 destroy 销毁。clear 和 destroy 的区别：clear 清空画布和配置但保留实例可以重新声明；destroy 用于组件或页面卸载，React、Vue 里必调，防内存泄漏。
-->

---

# 双 API 风格：Spec 与函数式等价

```js
// ① Spec/Options 声明式（当前官方文档主推）
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
});

// ② 函数式链（Functional API）—— 基于 Spec 实现
chart.interval().data(data)
  .encode('x', 'genre').encode('y', 'sold');
```

<v-clicks>

- 官方：「两者**声明可视化的能力完全等价**」，最终都渲染 options，可混用
- Spec API 早期叫 `experimental-spec-api`，现已转正为默认风格
- 函数式方法：mark 类 `chart.line()/point()`…；容器类 `chart.view()/spaceLayer()/facetRect()`…

</v-clicks>

<!--
G2 v5 有两种 API 风格。

第一种 Spec 声明式：chart.options 直接传一个描述图表的对象，是当前官方文档的主推风格。第二种函数式链：chart.interval 创建标记节点，再链式 data、encode。

官方 API 页的原文很明确：Functional API 是基于 Spec API 实现的，它通过一系列方法去生成 options，Spec API 直接设置 options。不论哪种形式，G2 最后都是直接渲染当前的 options，所以两者声明可视化的能力完全等价，还可以混用。

一点历史：Spec API 在 v5 早期文档路径里叫 experimental-spec-api，是实验性的，现在已经转正成 quick-start 的默认风格。函数式方法分两类：mark 类比如 interval、line、point、sankey；复合容器类比如 view、spaceLayer、facetRect。本篇后面统一用 Spec 风格演示。
-->

---

# Mark 体系：没有图表，只有标记

| mark | 对应传统图表 |
|---|---|
| `interval` | 柱状 / 条形（+transpose）/ 饼（+theta）/ 玫瑰（+polar） |
| `line` / `area` / `point` | 折线 / 面积 / 散点与气泡（size 编码） |
| `cell` / `rect` | 热力日历 / 直方图（+binX） |
| `lineX` / `lineY` / `range*` | 均值线、参考区间（v4 annotation 的替代） |
| `box` / `boxplot` / `density` | 箱线图 / 小提琴图 |
| `sankey` / `treemap` / `wordCloud` / `gauge`… | 复合标记：高级图一句话绘制 |

<v-clicks>

- 官方原文：「G2 中**没有图表的概念**」，任何图表 = 一个或多个 mark 组合
- 一个 view 的 `children` 可叠多个 mark（如 line + point）；自定义复合 mark = 返回 spec 的函数

</v-clicks>

<!--
官方原文：G2 中没有图表的概念，把标记作为基本的视觉组成单元，任何一个图表都可以由一个或多个标记组合而成。

看这张对应表。最典型的是 interval 区间条：直角坐标下是柱状图，转置后是条形图，theta 坐标下是饼图，polar 坐标下是玫瑰图，一个 mark 通吃四种图，差别只在坐标系，后面坐标系那页专门拆。line、area、point 对应折线、面积、散点，size 编码一加就是气泡图。cell 做热力日历，rect 加 binX 转换就是直方图。lineX、lineY、range 系列是辅助线和区域标注，取代了 v4 的 annotation 模块，在 v5 里标注也是一等公民的 mark。box、boxplot 是箱形，boxplot 自带聚合统计；density 核密度做小提琴图。

桑基、矩形树、词云、仪表盘、水波、旭日、弦图这些高级图，v5 直接内置成复合标记，一句话绘制，多数场景不再需要上层封装库。

另外两点：每个 mark 自带一整套语法要素，type、data、encode、scale、transform、coordinate、style、animate、label 都能配；一个 view 里 children 放多个 mark 叠加，比如折线加数据点。复合标记还能自定义：写一个返回 spec 或 spec 数组的函数，就能当新 type 用，官方有 Pie 封装的示例。
-->

---

# Encode：数据列与视觉通道

```js
encode: {
  x: 'name',                       // ① 字段：字符串按字段名解析
  color: 'steelblue',              // ② 常量：数据无此列时生效，不生成图例
  size: (d) => d.gdp / 1e9,        // ③ 回调：返回「抽象数据」，再经 scale
  y: { type: 'column', value: [1, 2, 3] }, // ④ column：直接给数组
}
```

<v-clicks>

- 位置通道：`x` / `y` / `z` / `x1` / `y1`（终点：瀑布图、甘特图）
- 非空间通道：`color` / `opacity` / `shape` / `size` —— 由 scale 自动生成图例
- `series` 空间分系列；`key` / `enterDuration` 等**动画通道也是编码**
- 数组通道：`y: ['end', 'start']` 等价 `y` + `y1`
- ⚠️ 字段名拼错会被当**常量**静默处理：不报错、不出图例，图形异常先查字段名

</v-clicks>

<!--
编码的定义：把数据和视觉通道绑定，决定标记的哪些通道需要被可视化。

四种取值形式看代码：字符串默认按字段名解析；如果数据中不存在该列，就按常量处理，且不生成图例；回调函数注意，v5 里返回的是「抽象数据」，还要再走一遍比例尺，不是直接的视觉值，这是与 v4 最隐蔽的语义差异；column 形式直接给数组，适合大数据或生成的数据。也可以显式写 type 为 field、constant、transform、column 来消歧，比如 color 想给常量红色、数据里又恰好有 red 这一列时。

通道分类：位置有 x、y、z、x1、y1，x1 y1 是终点通道，瀑布图、甘特图用；数组形式 y 给两个字段等价于 y 加 y1。非空间通道 color、opacity、shape、size 会由比例尺自动生成图例。series 在空间上区分系列，没显式声明时 G2 会把 color 值自动复制给 series，画渐变单线时要用 series 回调返回 undefined 来禁用。还有一族动画通道：key、groupKey、enterDuration、enterDelay，动画属性也是编码，动画页展开。另外编码有传递性：view 层 encode 传给 children，子 mark 已定义的通道不被覆盖。

最后是最大的坑：字段名拼错，静默变常量，不报错。图形不对先核对字段名。
-->

---

# Transform：绘制期的通道加工

```js
transform: [{ type: 'stackY' }]                          // 堆叠柱
transform: [{ type: 'dodgeX' }]                          // 分组柱
transform: [{ type: 'stackY' }, { type: 'normalizeY' }]  // 百分比堆叠
transform: [{ type: 'binX', y: 'count' }]                // 直方图（配 rect）
transform: [{ type: 'groupX', y: 'mean' }]               // 均值线（配 lineY）
```

<v-clicks>

- 定义：在绘制阶段「筛选、修改、聚合、生成」**通道值**
- 防重叠/布局：`stackY` `dodgeX` `jitter` `symmetryY` `sample` `flexX`
- 聚合/统计：`bin*` `group*` `normalizeY`；筛选/排序：`select*` `sort*`
- ⚠️ **数组顺序即执行顺序**：`normalizeY` 放 `stackY` 前面结果就错
- 区别 `data.transform`：后者在数据加载期预处理**原始表**（filter / fold / join…）

</v-clicks>

<!--
标记转换是一个函数，能够筛选、修改、聚合以及生成新的通道值。注意定语：它作用在绘制阶段的通道上，比如 stackY 改的是 y 和 y1 通道，不是原始数据。

按用途三类。防重叠和布局：stackY 堆叠、dodgeX 分组错位、jitter 散点抖动、symmetryY 对称出河流图、sample 大数据采样、flexX 变宽柱。聚合统计：binX 分箱出直方图、groupX 分组聚合支持 mean、max、count、sum 这些统计量、normalizeY 归一化出百分比图。筛选排序：selectY 按 selector 选极值配 text 做峰值标注、sortX 排序、stackEnter 是给动画通道做交错入场的。

看代码里的经典组合速记：堆叠柱一个 stackY，分组柱一个 dodgeX，百分比堆叠是 stackY 加 normalizeY。重要考点：transform 是数组，数组顺序就是执行顺序，先堆叠再归一化才是百分比堆叠柱，顺序颠倒结果就错，binX 和 stackY 同理。

和 data.transform 区分开：data.transform 挂在 data 上，加载阶段预处理原始表，有 filter、map、sortBy、pick、rename、fold 宽表转长表、join、还有 custom 接 d3-regression 这类第三方库；mark transform 是绘制期改通道值。另外 transform 可以配在 view 层，会传递给没有配 transform 的子 mark。
-->

---

# Coordinate：同一 mark 的「变形金刚」

| coordinate 配置 | interval 变成 |
|---|---|
| `cartesian`（默认直角） | 柱状图 |
| `transform: [{ type: 'transpose' }]` | **条形图**（柱转条） |
| `{ type: 'polar' }` | **玫瑰图**（半径比大小） |
| `{ type: 'theta' }` + stackY | **饼图**（弧度比大小） |
| `{ type: 'radial' }` | 玉珏图 |

<v-clicks>

- 机制：x/y 先经比例尺映射到 [0, 1]，坐标系再转换为**画布坐标**
- 其他类型：`parallel` 平行坐标、`radar`、`fisheye` 鱼眼、`helix`、`cartesian3D`
- ⚠️ 「每一个视图只能拥有一个坐标系」；mark 级声明会冒泡合并，**先声明者优先**

</v-clicks>

<!--
坐标系是 G2 组合威力最直观的体现，这是重点页。

先看机制：位置属性 x、y 先经过比例尺映射到 0 到 1 的标准化区间，坐标系再把标准化位置转换成画布坐标。所以换一个坐标系，同一个 mark 的空间形态就完全变了。

看表：同一个 interval 标记，默认直角坐标是柱状图；套一个 transpose 转置变换，横竖对调变条形图；换 polar 极坐标，用半径长短比较大小，是玫瑰图；换 theta 坐标加 stackY，用弧度比较大小，是饼图；换 radial 是玉珏图。五种图，一个 mark，只换坐标系。这就是「拒绝图表分类」的落地。

还有 parallel 平行坐标系配 line 画平行坐标图，radar 是 polar 加 parallel 的混合出雷达图，fisheye 鱼眼做焦点探索，helix 螺旋，cartesian3D 配 3D。坐标系变换写在 coordinate.transform 数组里可以叠加；outerRadius、innerRadius 这些属性直接平铺在 coordinate 对象上。

层级规则考点：每一个视图只能拥有一个坐标系，mark 级的 coordinate 会冒泡到 view 合并，第一个声明的优先。想在同一画布混用极坐标和直角坐标，必须用 spaceLayer 分层。
-->

---

# 饼图的本质：interval + stackY + theta

```js
chart.options({
  type: 'interval',                      // 饼图没有专属图表类型
  data: [{ item: '事例一', count: 40 }, { item: '事例二', count: 21 }],
  encode: { y: 'count', color: 'item' }, // x 通道留空
  transform: [{ type: 'stackY' }],       // stackY 定角：扇区首尾相接
  coordinate: { type: 'theta' },         // theta 定形：半径固定只映射角度
});
// coordinate: { type: 'theta', innerRadius: 0.6 } → 环图
```

<v-clicks>

- `theta` 是**半径固定、只映射角度**的特殊极坐标
- 口诀「**theta 定形，stackY 定角**」：忘配 stackY 则扇区全从 0 起画、互相覆盖
- 对比：玫瑰图 = polar（半径比大小）；饼图 = theta（弧度比大小）

</v-clicks>

<!--
把饼图完整拆开，这一页是理解 G2 的试金石。

第一，type 依然是 interval，饼图在 G2 里没有专属类型。第二，编码只给 y 和 color，x 通道留空，因为饼图只有一个维度的占比。第三，stackY 让每个扇区首尾相接地堆起来，这一步最容易忘：不配 stackY，所有扇区都从 0 度起画，互相覆盖，图就废了，这是高频坑。第四，theta 坐标系，它是一种特殊极坐标：半径固定，只把数值映射到角度，弧度大小就是数值大小。

口诀：theta 定形，stackY 定角。再配 innerRadius 就是环图。

和玫瑰图对比着记：玫瑰图是 polar 坐标系，用半径长短比较大小；饼图是 theta 坐标系，半径固定，用弧度比较大小。一个 interval，两种极坐标，两种经典图。

面试口径：为什么说 G2 没有饼图？因为饼图等于 interval 标记加 stackY 转换加 theta 坐标系的组合，这正是图形语法的意义。
-->

---

# Scale 比例尺：决定「如何可视化」

```js
scale: { y: { type: 'log', domain: [10, 100], nice: true }, x: { padding: 0.5 } }
```

<v-clicks>

- 定义：「将抽象数据映射为视觉数据的桥梁」，**每个通道各绑一个**比例尺
- 连续：`linear`（数值默认）/ `log`（跨数量级）/ `pow` `sqrt` / `time`
- 分类：`ordinal`（颜色形状）/ `band`（等宽区间+间距）/ `point`（零宽点位）
- 离散化：`quantize` `quantile` `threshold`（颜色分段）；连续色板 `sequential`
- 推断：字符串/布尔 → 分类；Date → `time`；数值 → `linear`；连续颜色无 range → `sequential`
- **band vs point**：interval 的分类 x 默认 `band`（柱有宽度）；line/point 默认 `point`
- 同 view 同名通道默认**同步**；`independent: true` 或不同 `key` 声明独立（双轴图核心）

</v-clicks>

<!--
比例尺回答「如何可视化」：官方定义是将抽象数据映射为视觉数据的桥梁，每个通道各绑定一个比例尺。

三大家族。连续：linear 是数值默认，log 处理跨数量级数据，pow、sqrt 压缩差异常用于面积大小映射，time 时间轴。分类：ordinal 做颜色形状的一对一映射，band 给每个类别分配带间距的等宽区间，point 是 band 的 bandWidth 等于 0 特例只给点位。离散化：quantize 等宽分段、quantile 等频分段、threshold 自定义阈值，多用于颜色分段。颜色专用还有 sequential 连续色板插值。

类型自动推断的优先级：显式 type 最高；然后看 domain 或数据值，含字符串布尔推分类，此时定量通道推 point、其余推 ordinal；含 Date 推 time；数值推 linear；连续的颜色通道没配 range 推 sequential。band 和 point 的区别落到图上：interval 的分类 x 默认推成 band 所以柱子有宽度，line 和 point 的分类 x 默认推成 point 只有拐点位。

常用配置：domain 定义域、range 值域、nice 刻度取整、padding 间距、tickCount、compare 分类排序、unknown 兜底。最后一个高级考点：同一 view 下多 mark 的同名通道默认同步比例尺，这是双轴图的基础；要独立就配 independent true，或者用相同 key 分组同步。
-->

---

# 组件：Axis 与 Legend

```js
axis: { x: { title: '月份', labelFormatter: '.1%' } },  // d3-format 串或回调
legend: { color: { position: 'top', maxRows: 2 } },     // 隐藏：legend: false
slider: { x: {} },  // 缩略轴；scrollbar: { x: {} } 滚动条
```

<v-clicks>

- Axis 标签防重叠四件套：`labelAutoEllipsis` 缩略 / `labelAutoRotate` 旋转 / `labelAutoWrap` 换行 / `labelAutoHide` 抽稀
- Legend **不单独绑数据**：由非空间通道（color/opacity/size/shape）的 scale 自动生成
- 离散 → 分类图例（可分页、`defaultSelect`）；连续 → 色带 ribbon（handle 滑窗）
- ⚠️ `labelFormatter` 的 `'.1%'`、`'~s'` 是 **d3-format 语法**，不是模板字符串

</v-clicks>

<!--
组件先看坐标轴和图例。

axis 按通道配置：title 标题、labelFormatter 格式化、tickCount、grid、line、tick、position。labelFormatter 支持两种形态：d3-format 字符串，比如 '.2f' 保留两位小数、'.1%' 百分比、'~s' 千位缩写，注意这是 d3-format 语法不是模板字符串；或者直接传回调函数。隐藏统一模式：axis 传 false 全关，axis 的 y 传 false 关单轴。

分类轴标签挤在一起怎么办？防重叠四件套：labelAutoEllipsis 缩略、labelAutoRotate 旋转可配候选角度 optionalAngles、labelAutoWrap 换行、labelAutoHide 抽稀可保头保尾。

图例的生成逻辑要记：legend 不是独立绑数据的组件，它由非空间通道，也就是 color、opacity、size、shape 的比例尺自动生成。离散比例尺生成分类图例，条目多可分页 nav，defaultSelect 配默认选中；连续比例尺生成色带 ribbon 图例，带滑窗 handle。配置在 legend.color 上：position 默认 top，还有 layout、maxRows、itemMarker、labelFormatter。

数据太密需要局部浏览时，slider 缩略轴和 scrollbar 滚动条按通道声明，配套的 sliderFilter、scrollbarFilter 交互自动挂上。
-->

---

# 组件：Tooltip 两层配置与 Label

```js
tooltip: {                        // ① mark 级：管「数据内容」
  title: 'genre',
  items: [{ field: 'sold', name: '销量', valueFormatter: '~s' }],
},
interaction: {                    // ② view 级：管「渲染行为」
  tooltip: { shared: true, crosshairs: true }, // 同 x 合并 + 十字线
},
labels: [{ text: 'sold', position: 'inside' }], // 一个 mark 可挂多个标签
```

<v-clicks>

- 完全自定义渲染：`interaction.tooltip.render: (event, { title, items }) => html`
- 关闭分两层：`tooltip: false`（内容）/ `interaction: { tooltip: false }`（行为）
- Label 防重叠 transform：`overlapDodgeY` / `overlapHide` / `contrastReverse` / `overflowHide`
- 饼图标签 `position: 'spider'` 蜘蛛布局；玫瑰图 `'surround'` 环绕

</v-clicks>

<!--
Tooltip 的两层配置是高频考点，一定分清。

第一层，mark 级的 tooltip 管数据内容：title 定标题，items 定条目，可以按 channel 取通道值、按 field 取字段值，配 name、color、valueFormatter。第二层，view 级的 interaction.tooltip 管渲染行为：shared 让同一 x 的多条数据合并进一个框，crosshairs 十字辅助线，marker 样式，filter 过滤，render 回调拿到 title 和 items 返回 html 字符串或 DOM，做完全自定义面板。

关闭也对应两层：mark 上 tooltip false 是不提供内容，interaction 里 tooltip false 是关掉交互行为。运行时还能 chart.emit tooltip:disable 或 tooltip:hide 程序化控制。

Label 数据标签：注意配置项是 labels 数组，一个 mark 可以挂多个标签，比如柱内标数值、柱顶标名称。每条支持 text 字段或回调、position、style、formatter、selector 选 first、last 或回调。标签一多就重叠，用 label transform 治理：overlapDodgeY 在 Y 方向错开，overlapHide 重叠就藏，contrastReverse 对比度不足自动反色，overflowHide 超出图形隐藏，还有 exceedAdjust 超出视图回调整。view 级也能统一配 chart.labelTransform。饼图专属的 spider 蜘蛛布局把标签甩到两侧用连线牵引，玫瑰图用 surround 环绕布局。
-->

---

# 视图复合：双轴与分面

| type | 语义 | 典型场景 |
|---|---|---|
| `spaceLayer` | 多视图**重叠**同一空间，坐标系各自独立 | **双轴图**、柱+饼叠加 |
| `spaceFlex` | 水平/垂直**并排**（类 CSS flex） | 报表多图并列 |
| `facetRect` / `facetCircle` | **分面** = 分空间 + 分数据 | 小倍数图 |
| `repeatMatrix` | **重复**：数据不变，编码叉乘 | 散点相关性矩阵 SPLOM |
| `timingKeyframe` | 时间维度管理视图 | 关键帧动画叙事 |

<v-clicks>

- `children` 嵌套**可任意递归**：「通过一个单独的声明去实现一个报表」
- 双轴图：两 mark 各绑独立数据 + `axis: { y: { position: 'right' } }` + scale `independent: true`
- 辨析：空间复合只分空间；**分面 = 分空间 + 分数据**；重复 = 全量数据 × 编码组合

</v-clicks>

<!--
复合解决「一个实例装多个视图」。

五种容器。spaceLayer 让多个视图重叠在同一空间，各自坐标系独立，这是双轴图和柱图饼图叠加的载体。spaceFlex 类似 CSS flex，水平垂直并排拼报表。facetRect 分面：按字段把数据切成子集，行列排布，每个子视图只看到自己那份数据子集，就是小倍数图；facetCircle 是圆周分面。repeatMatrix 重复：数据不变，把编码组合叉乘着重复，画散点相关性矩阵。timingKeyframe 在时间维度上管理视图，做关键帧叙事，动画页细讲。

三概念辨析是考点：空间复合只分空间不动数据；分面等于分空间加分数据；重复等于全量数据乘以编码组合变化。

结构上复合节点用 children 数组嵌套，而且可以任意递归，官方的说法是「通过一个单独的声明去实现一个报表」。分面写法注意：facetRect 容器自己 encode 声明分面字段，children 里的 mark 再声明自己的 x y。

双轴图组装思路：v5 每个 mark 可以绑独立数据，这是对 v4 一个 view 一份数据的大升级；两个 mark 各自拿数据，右侧的轴配 position right，再把 y 比例尺声明 independent true，否则默认同步，量纲差异大时小量纲的折线会被压成直线，这是易错点。
-->

---

# 动画编排：动画属性也是编码

```js
animate: { enter: { type: 'scaleInY', duration: 1000 } }, // 场景级配置
encode: {                        // 数据驱动：动画通道绑字段/回调
  enterDelay: 'startTime',
  enterDuration: (d) => d.end - d.start,
},
transform: [{ type: 'stackEnter', groupBy: 'color' }],    // 分组交错入场
```

<v-clicks>

- 三场景默认：enter `fadeIn` / update `morphing` 形变 / exit `fadeOut`，时长 300ms
- 关闭：`animate: false` 全关；`{ enter: { type: false } }` 关单场景
- 动画通道可配 scale：`scale: { enterDuration: { range: [0, 3000] } }`
- 关键帧：`timingKeyframe` + encode `key` / `groupKey` 跨视图平滑 morphing

</v-clicks>

<!--
G2 的动画分三个场景：enter 入场默认 fadeIn 淡入，update 更新默认 morphing 形变过渡，exit 退场默认 fadeOut 淡出，默认时长 300 毫秒。每个场景可配 type、duration、delay、easing；animate false 全关，enter 的 type 传 false 只关入场。入场类型还有 growInX、growInY、scaleInX、scaleInY、zoomIn、pathIn、waveIn 这些。

v5 的特色是数据驱动动画，这是考点：enterDuration、enterDelay 这些动画属性本身就是编码通道，可以像 color 一样绑字段、绑回调，比如甘特图里入场时长等于工期。而且动画通道也能配比例尺，用 range 控制时长的值域。

想要柱子一根一根按组出现的交错入场效果，用 stackEnter 转换：按 groupBy 分组，对 enter 动画通道做堆叠，图形就依次登场，还能配 duration。

最高级的玩法是关键帧：timingKeyframe 容器装多个视图当关键帧，direction、iterationCount 控制播放方向和次数；跨视图的图形靠 encode 的 key 和 groupKey 关联，G2 自动做平滑 morphing，比如散点图聚合演变成条形图的数据叙事。key 通道同时也是数据更新动画的对应依据。
-->

---

# 交互与事件：状态联动 + 多图联动

```js
chart.options({
  interaction: { elementSelect: true, brushXHighlight: true },
  state: { selected: { fill: '#f4bb51' }, unselected: { opacity: 0.6 } },
});
chart.on('brush:filter', (e) => otherChart.emit('brush:filter', e.data));
chart.emit('tooltip:hide'); // 程序化触发组件行为
```

<v-clicks>

- 内置交互：`tooltip`、`element*` 高亮/选中系、`brush*` 刷选/筛选系、`legendFilter`、`fisheye`…
- **state 四状态**：`selected` / `unselected` ← elementSelect 驱动；`active` / `inactive` ← highlight 驱动
- 事件：生命周期 `beforerender` / `afterrender`；元素 `element:click`（「组件:事件名」格式）
- 多图联动（Focus & Context）= 一图 `on` 监听 → 另一图 `emit` 转发

</v-clicks>

<!--
交互按需声明在 view 或 mark 层，mark 级覆盖 view 级，关闭传 false。

内置清单分几族：tooltip 和 poptip；element 系有 elementHighlight、按颜色 byColor、按 X 的变体，以及 elementSelect 选中系；brush 系有刷选高亮 brushHighlight、单轴的 brushXHighlight，以及真正过滤数据的 brushFilter 一族，还有轴上刷选 brushAxisHighlight；组件系 legendFilter、legendHighlight、sliderFilter、scrollbarFilter；再加 fisheye 鱼眼、chartIndex、elementHoverScale。elementHighlight 还有 link 连带和 background 背景选项。

交互改变图形外观靠 state 状态样式，四个状态记成两对：elementSelect 驱动 selected 和 unselected，highlight 系驱动 active 和 inactive。声明 state 里对应状态的样式，交互发生时自动应用。

事件总线是 chart.on、off、emit。生命周期事件 beforerender、afterrender；元素事件是「组件冒号事件名」格式，比如 element:click、element:pointerover。多图联动的套路：A 图 on 监听 brush:filter 拿到 selection，emit 给 B 图同名事件，就是 Focus and Context 联动。进阶还能 register 注册 interaction 自定义交互，返回带清理函数的处理器。
-->

---

# 渲染引擎与 SSR

| 渲染器 | 特点 |
|---|---|
| `@antv/g-canvas`（**内置默认**） | 脏矩形优化，大数据量首选 |
| `@antv/g-svg` | 产出 DOM：无障碍 / 样式检查 / 矢量导出 |
| `@antv/g-webgl` | 海量数据高性能，可自动降级 |

<v-clicks>

- 底层统一渲染引擎 `@antv/g`；切换：`new Chart({ renderer: new SVGRenderer() })`
- ⚠️ SVG / WebGL 渲染器需**单独安装**：只装 `@antv/g2` 会报模块缺失
- SSR：官方 `@antv/g2-ssr` 的 `createChart` → `exportToFile`（node-canvas 出 PNG，约 400ms/张；产物**静态**，无交互无动画）
- 按需打包：`extend(Runtime, { ...corelib() })` 裁剪 library，Tree Shaking 减包体

</v-clicks>

<!--
G2 底层是 AntV 统一渲染引擎 @antv/g，上面有三个渲染器可选。

g-canvas 内置默认，带脏矩形优化，大数据量场景首选。g-svg 产出真实 DOM，利于无障碍、用 DevTools 检查样式、导出矢量图，需要对图形做 DOM 级操作或编辑时选它。g-webgl 面向海量数据的高性能渲染，还能自动降级。切换方式是构造参数里 renderer 传渲染器实例。注意坑：SVG 和 WebGL 的包要单独安装，只装 @antv/g2 时 new SVGRenderer 会报模块缺失，Canvas 才是内置的。

服务端渲染：G2 支持非浏览器环境出图，原理是 Chart 支持传入自定义 Canvas。两条路线：node-canvas 是 Canvas2D 的兼容实现，配 g-canvas 渲染器出 PNG、JPEG、PDF 流；或者 jsdom 出 SVG。官方还封装了 @antv/g2-ssr：createChart 传 imageType 和图表配置，然后 exportToFile 落盘，大约 400 毫秒一张。要说清楚：SSR 产物是静态图，没有交互没有动画，适合海报、报告、邮件这类场景。

包体优化：可视化组件按 library 组织，用 extend 加 corelib 只带核心库，Tree Shaking 生效；还有 geolib、3dlib 按需追加。
-->

---

# 框架集成与 AntV 生态

```js
// React 集成范式（Vue 对应 onMounted / onUnmounted）
useEffect(() => {
  const chart = new Chart({ container: ref.current }); // ref 传元素，别用 id 串
  chart.options(spec);
  chart.render();
  chartRef.current = chart;
  return () => chart.destroy(); // 卸载必调，防内存泄漏
}, []);
```

<v-clicks>

- 数据更新用 `changeData(newData)`（= `data()` + `render()` 语法糖），**别重建实例**
- 尺寸：`chart.changeSize(w, h)` / `forceFit()`；多实例用字符串 id 会冲突错乱
- 生态：**G2Plot 停留在 G2 4.x**；v5 的开箱封装 = **Ant Design Charts**（2.x 底层已是 v5）
- 家族分工：G6 关系图 / X6 图编辑器 / L7 地理 / F2 移动端 / S2 交叉表

</v-clicks>

<!--
框架集成三条铁律。第一，容器用 ref 传 HTMLElement 而不是字符串 id：组件复用、多实例时 id 冲突会渲染错乱，官方明确推荐传元素。第二，React 在 useEffect 里创建，清理函数里 destroy，实例存 useRef；Vue 对应 onMounted 创建、onUnmounted 销毁。忘了 destroy，SPA 路由切换后画布和事件监听残留，就是内存泄漏。第三，数据更新持有实例调 changeData，它是 data 加 render 的语法糖，自动重渲染；每次 setState 都 new Chart 性能极差，是典型反模式。也可以 getNodesByType 定位节点后 changeData。尺寸变化用 changeSize 或 forceFit 重新适配父容器，都会触发重渲染。

生态定位一句话：G2Plot 停留在 G2 4.x 时代，官方描述就是 based on G2 4.x；v5 时代「开箱即用图表」的定位由 Ant Design Charts 承接，ant-design-charts 2.x 底层已经升级为 G2 v5，React 项目直接用 @ant-design/charts 或 @ant-design/plots。

AntV 家族分工要分清：G2 管统计图表，G6 管图和网络关系可视化，X6 是图编辑器做流程图 DAG，L7 地理空间，F2 移动端可视化，S2 多维交叉表。选型题口径：G2 面向 Web 和 Node，移动端小程序场景由 F2 或社区适配承接。
-->

---

# v4 → v5：断代迁移对照

| v4 写法 | v5 写法 |
|---|---|
| `chart.interval().position('x*y').color('c')` | `options({ type, encode: { x, y, color } })` |
| `.adjust('stack')` | `transform: [{ type: 'stackY' }]` |
| `annotation().line()` | `lineX` / `lineY` / `rangeY` 等标注 mark |
| scale 绑**字段**、`values` | scale 绑**通道**、`domain` |
| 编码回调返回**视觉值** | 回调返回**抽象数据**，再经 scale |

<v-clicks>

- v5（2023）架构重写，与 v4 **完全不兼容**；v4 维护承诺止于 2023 年底
- 其余对照：`facet()` → `facetRect`；padding 数组 → `paddingLeft` 等；appear 并入 enter
- 判别老资料：见 `*` 连接字段、链上 `.position()` 即 v4，直接跳过
- v4 时间字符串自动解析；v5 需显式 `new Date`

</v-clicks>

<!--
v4 到 v5 是断代式重写，完全不兼容，v4 官网已经迁到 g2-v4.antv.vision，官方维护承诺止于 2023 年底。网上大量老教程失效，这是 G2 当前最大的使用负担，必须会判别。

对照着看：v4 的 geometry 链式 position 星号连接字段，v5 变成 options 里的 encode 按通道声明；v4 的 adjust stack、dodge，v5 是 transform 数组；v4 的 annotation 模块，v5 里标注升级为一等公民的 mark，lineX、lineY、rangeY 直接用；v4 的 scale 绑在字段名上、用 values，v5 绑在通道上、用 domain；facet 方法变 facetRect 复合节点；padding 数组拆成 paddingLeft 这些具名属性；动画的 appear 场景并入 enter。

最隐蔽的语义变化是编码回调：v4 的回调直接返回视觉值，比如返回一个颜色串就直接用这个颜色；v5 的回调返回抽象数据，还要再经过比例尺映射。迁移时不注意这条，颜色映射会莫名其妙。另一个：v4 时间字符串自动解析，v5 要显式 new Date。

判别老资料的标志：看到星号连接字段、geometry 链上调 position，一律是 v4 资料，直接跳过别照抄。
-->

---

# 高频易错点

<v-clicks>

- **v4 教程陷阱**（最大坑）：搜到 `position('x*y')`、`adjust('stack')` 一律是 v4 资料
- encode 字段名拼错 → 被当**常量**静默处理：不报错、图形异常无告警
- 饼图忘配 `stackY`：扇区全部从 0 起画、互相覆盖
- transform **顺序敏感**：`normalizeY` 放 `stackY` 前面结果错误
- SPA 卸载不调 `destroy()` → 画布与事件监听残留，内存泄漏
- 每次更新都 `new Chart` 性能极差 → 持有实例调 `changeData`
- `render()` 是异步的：截图 / 取 DOM 必须 `await` 或 `.then()`
- 双轴图量纲差异大忘配 `independent: true` → 小量纲折线被压成直线

</v-clicks>

<!--
把散在各页的坑集中串一遍，按踩坑频率排。

第一，v4 教程陷阱，再强调一次：星号连字段、链式 position、adjust，都是 v4，v5 完全不兼容。第二，encode 字段名拼错是静默失败：字符串在数据列中不存在就按常量处理，不报错、不生成图例，图形不对第一步先核对字段名。第三，饼图只配 theta 不配 stackY，扇区全从 0 起画互相覆盖，口诀 theta 定形 stackY 定角。第四，transform 数组顺序即执行顺序，normalizeY 必须在 stackY 之后，binX 和 stackY 同理。

工程侧四条。组件卸载必须 destroy，否则画布和监听残留内存泄漏。数据更新持实例 changeData 或改 options 再 render 增量更新，别重建实例。render 返回 Promise，渲染完成前取 DOM 或截图会拿到空画布，测试里必须 await。双轴图两侧量纲差异大时，比例尺默认同步，忘配 independent 小量纲那条线会被压成直线贴地。

还有几条前面讲过的：autoFit 时容器要先有实际尺寸；框架里 container 用 ref 元素别用 id 串；SVG、WebGL 渲染器要单独装包；color 想给常量但数据恰有同名列时，显式写 type constant 消歧；渐变单线要用 series 回调返回 undefined 禁掉自动分系列；labelFormatter 的百分号、波浪 s 是 d3-format 语法不是模板字符串。
-->

---

# G2 vs ECharts：选型

| 维度 | AntV G2 v5 | Apache ECharts 5 |
|---|---|---|
| 范式 | **图形语法**：组合生成图表 | **配置式**：`series.type` 枚举类型 |
| 心智 | 先学语法，造新图 = 换组合 | 上手即用，超出内置类型陡难 |
| 非常规图 | 分面 / 坐标系变换一等公民 | grid 多实例拼或 custom series |
| 数据处理 | 内置声明式统计 transform | 多在业务侧预处理 |
| 图表广度 | 统计图深；地图弱（L7 另管）、3D 有限 | 品类极广：地图 / 3D 全家桶 |
| 生态 | 蚂蚁系，中文文档好 | Apache 顶级项目，社区海量 |

<div v-click class="mt-3 text-sm">

> **ECharts 给你一柜子成品图表，G2 给你一套造图表的语法**——需求在成品清单内 ECharts 更快；需求长尾、组合多变时 G2 边际成本更低。

</div>

<!--
选型收口。

范式是根本差异：ECharts 枚举图表类型、查文档拼配置；G2 用语法组合生成。由此推出心智差异：ECharts 上手即用，但超出内置类型后 custom series 门槛陡增；G2 要先学模型，之后造新图只是换组合，边际成本低。

非常规图：G2 的分面、视图复合、坐标系变换是原生一等公民，小倍数图、散点矩阵信手拈来；ECharts 得靠 grid 多实例拼接或手写 custom series。数据处理：G2 内置 data.transform 和 mark transform，分箱、分组聚合、归一化都是声明式；ECharts 多数聚合要在业务侧先算好。动画上 G2 动画属性即编码通道，数据驱动加关键帧 morphing；ECharts 以预设动画为主，定制维度较少。

ECharts 的强项也要说足：品类极广，地图、3D、仪表盘全家桶，开箱效果丰富，Apache 顶级项目社区海量，各框架 wrapper 齐全；G2 地图弱，那是 L7 的领域，3D 有限，上层封装靠 Ant Design Charts。

结论口径：选 G2 当你做数据探索分析产品、需要统计变换、大量定制组合图、追求编码一致性、React 加 AntD 技术栈；选 ECharts 当常规大屏管理后台标准图表快速堆量、要地图 3D 炫酷预设、团队不想学语法模型。一句话：ECharts 给你一柜子成品图表，G2 给你一套造图表的语法。
-->

---
layout: intro
---

# 总结

AntV G2 v5 = **简洁的渐进式可视化语法**

- 心智公式：图 ≈ data + mark + encode + transform + scale + coordinate + 组件
- 饼图 = interval + stackY + theta；条形 = transpose；玫瑰 = polar——**没有图表，只有组合**
- 双 API 等价：`options()` 声明式 / 函数式链，可混用
- 两层心智反复出现：mark 管内容，view 管行为（tooltip / 坐标系 / 比例尺同步）
- 工程铁律：ref 容器、卸载 `destroy()`、更新 `changeData()`、`await render()`
- 文档：g2.antv.antgroup.com（v4 老资料见 `position('x*y')` 直接跳过）

<!--
总结一下。

G2 是蚂蚁 AntV 出品的简洁的渐进式可视化语法，理念源自 The Grammar of Graphics：拒绝枚举图表类型，用标记、编码、转换、比例尺、坐标系这些基本单元的组合描述一切图表。

最能代表它的一页是饼图的本质：interval 加 stackY 加 theta，没有图表，只有组合。条形图是转置，玫瑰图是极坐标，造新图等于换组合。

API 双风格等价可混用；组件配置记住分层心智：mark 级管数据内容，view 级管行为渲染。工程侧四条铁律：框架里 ref 传容器、卸载必 destroy、更新用 changeData、render 要 await。

最后再提醒一次 v4 断代：看到 position 星号写法的资料直接跳过，认准 g2.antv.antgroup.com 的 v5 文档。需求长尾、组合多变时，这套语法的边际成本最低。谢谢大家。
-->
