---
theme: seriph
background: https://cover.sli.dev
title: Apache ECharts
info: |
  Presentation Apache ECharts — 声明式数据可视化图表库。

  Learn more at [https://echarts.apache.org](https://echarts.apache.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📊</span>
</div>

<br/>

## Apache ECharts — 声明式可视化图表库

基于 zrender 的配置驱动图表库：一个 option 对象描述整张图，Canvas/SVG 双渲染器，20+ 内置图表类型。2026 年当前版本 v6.1

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/apache/echarts" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Apache ECharts。它是 Apache 顶级项目，国内数据可视化的事实标准，也是前端面试图表库的第一考点。

一句话定位：基于 zrender 渲染引擎的声明式、配置驱动图表库——你不命令它怎么画，而是用一个 option 对象描述整张图长什么样。Canvas 和 SVG 双渲染器，20 多种内置图表。

版本背景：主版本 v6.0 于 2025 年 7 月 30 日发布，npm 当前最新 6.1.0，升级命令 npm install echarts@6。许可证 Apache-2.0。

顺序：定位 → 架构与渲染器 → 上手 → 按需引入 → 生命周期 → setOption 合并 → option 心智 → dataset → transform → series 巡礼 → visualMap 与主题 → tooltip → 交互组件 → 事件 → 性能 → 地图 → SSR → v6 新特性 → 升级 → 易错点 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 ECharts？

<v-clicks>

- **声明式**：不写绘图命令，写一个 option 配置
- 图表类型/交互组件/大数据方案**全场景覆盖**
- 中文文档、示例生态最好，示例即抄即用
- 性能上限高：千万级点也有官方方案

</v-clicks>

<div v-click class="mt-6">

代价与边界：

- 全量包体大 → 必须按需引入
- option 配置极深 → 学习靠查文档
- 自由绘图弱于 D3 → custom series 兜底

</div>

<!--
为什么选 ECharts？核心是声明式：你不用一笔一笔画，只需要组装一个 option 对象描述图表，剩下的布局、渲染、动画、交互全部由它接管。

它的强项是全：20 多种图表类型、tooltip、dataZoom、visualMap 这些交互组件、大数据的 large、progressive、appendData 方案，一应俱全；中文文档和官方示例库是所有图表库里最好的，示例即抄即用；性能上限也高，千万级数据点都有官方套路。

代价也要清楚：全量引入几百 KB，必须按需引入；option 配置项极深，学习方式就是查配置项手册；命令式自由绘图不如 D3，需要完全自定义时靠 custom series 和 graphic 组件兜底。

一句话：选它等于选「声明式配置 + 全场景覆盖」；不选它的理由通常是要极致轻量（Chart.js）或完全自由定制（D3）。
-->

---

# 架构：zrender 与双渲染器

```text
ECharts（图表逻辑：坐标系 / series / 组件 / 状态）
   └─▶ zrender（2D 渲染引擎，唯一运行时核心依赖）
          └─▶ Canvas 或 SVG（echarts.init 时指定）
```

| 维度 | Canvas（默认） | SVG |
|---|---|---|
| 适用 | 大数据量（>1k 点）、频繁交互、热力图特效 | 多实例页面、移动端省内存、缩放不模糊 |
| 备注 | 像素级效果强 | v5.3 起性能提升 2-10 倍；SSR 仅支持 SVG |

```js
echarts.init(dom, null, { renderer: 'svg' }); // 默认 'canvas'
```

<!--
分层架构：最上层是 ECharts 本体，管坐标系、系列、组件和状态；它底下是 zrender，一个 2D 图形渲染引擎，也是 ECharts 唯一的运行时核心依赖，统一抽象了 Canvas 和 SVG 两种后端；chart.getZr() 可以拿到底层 zrender 实例，后面讲空白区域点击会用到。

渲染器怎么选？Canvas 是默认值，适合大数据量、频繁交互、热力图轨迹特效这类像素级效果。SVG 内存占用更低，适合移动端、一个页面很多小图的场景，浏览器缩放不模糊，低端设备表现好。

两个更新认知：v5.3 起 SVG 渲染器做了虚拟 DOM 化，性能提升 2 到 10 倍，不再是「SVG 一定慢」；服务端渲染输出字符串只有 SVG 模式支持。官方建议拿不准就在真实场景实测。

指定方式就是 init 第三个参数的 renderer。注意按需引入时渲染器必须显式注册其一，后面按需引入页会讲。
-->

---

# 快速上手：四步最小示例

```js
import * as echarts from 'echarts'; // 全量引入（体积大，下页按需）

// ① 准备有宽高的容器 → ② init 实例
const chart = echarts.init(document.getElementById('chart'));

// ③ 声明式 option 描述整张图 → ④ setOption 应用
chart.setOption({
  title: { text: '销量' },
  tooltip: {},                                   // 声明才启用
  xAxis: { data: ['衬衫', '羊毛衫', '雪纺衫'] }, // 类目轴
  yAxis: {},                                     // 数值轴
  series: [{ type: 'bar', data: [5, 20, 36] }]   // type 决定图表类型
});
```

- 获取方式：npm（`npm install echarts@6`）或 CDN（jsDelivr）

<!--
快速上手四步：准备一个已经有宽高的 div、echarts.init 初始化实例、组装 option、setOption 应用。

几个细节：tooltip 不是默认开启的，要声明 tooltip 空对象才启用；xAxis 直接给 data 就是类目轴；series 的 type 决定图表类型，同一个 option 可以放多个 series 混合，比如折柱混合；饼图的 data 则是 name 加 value 的对象数组，不需要坐标轴。

获取方式两种：npm 装 echarts@6，或者 jsDelivr CDN 直接引 script。

这里用的是全量引入，import 星号 as echarts from 'echarts'，打包体积大，生产项目应该用下一页的按需引入。
-->

---

# 按需引入（v5+ 标准写法，必背）

```ts
import * as echarts from 'echarts/core';                 // 核心
import { BarChart, LineChart } from 'echarts/charts';   // 图表 XxxChart
import {
  TooltipComponent, GridComponent,
  DatasetComponent, TransformComponent
} from 'echarts/components';                             // 组件 XxxComponent
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';      // 渲染器必选其一
echarts.use([BarChart, LineChart, TooltipComponent, GridComponent,
  DatasetComponent, TransformComponent,
  LabelLayout, UniversalTransition, CanvasRenderer]);
```

- **漏注册是最高频报错**：`Component grid not exists. Load it first`
- TS 严格类型：`ComposeOption` 组合出只含所用组件的 Option 类型

<!--
按需引入是 v5 之后的标准写法，必背。五类模块：echarts/core 核心、echarts/charts 里的图表都叫 XxxChart、echarts/components 里的组件都叫 XxxComponent、echarts/features 里有 LabelLayout 标签布局和 UniversalTransition 万物过渡、echarts/renderers 里渲染器必须注册其一。全部塞进 echarts.use 数组。

最高频报错就是漏注册：比如 Component grid not exists，Load it first。典型场景：用了 tooltip 的 axis 触发但没注册 GridComponent、用了 dataset 没注册 DatasetComponent、用了 transform 没注册 TransformComponent。看到 not exists 就回来查 use 列表。

TypeScript 项目还可以用 echarts/core 导出的 ComposeOption，把 BarSeriesOption、GridComponentOption 这些类型组合成一个只包含你所用组件的严格 Option 类型，没注册的组件在类型层就报错。
-->

---

# 实例生命周期

```js
const chart = echarts.init(dom, null, {
  renderer: 'svg',      // 默认 canvas
  locale: 'ZH',         // v5+ 语言
  useDirtyRect: true,   // v5+ 脏矩形局部重绘
});
window.addEventListener('resize', () => chart.resize()); // 窗口级自适应
chart.clear();   // 清空内容，实例还能复用（可再 setOption）
chart.dispose(); // 彻底销毁：SPA 组件卸载必调，防内存泄漏
```

<v-clicks>

- **容器必须已有宽高**：`display: none` 时 init → 0 尺寸空白图；解法：先布局后 init / opts 显式 `width/height` / 显示后 `resize()`
- 同一 DOM 禁重复 init：先用 `echarts.getInstanceByDom(dom)` 查
- 容器级尺寸变化（不触发 window resize）→ **ResizeObserver** + 防抖

</v-clicks>

<!--
实例生命周期四件事：init、setOption、resize、dispose。

init 第三个参数常用项：renderer 选渲染器、locale 是 v5 加的语言配置、useDirtyRect 开脏矩形局部重绘优化。还有 v5.4 的 useCoarsePointer 扩大手指点击拾取范围、v5.3 的 ssr 后面单独讲。

三个必考细节。第一，容器必须已有宽高：display none 的 Tab、v-show 没显示、flex 没撑开时 init，实例拿到 0 尺寸，图表空白还有控制台警告；解法三选一——先布局后 init、opts 里显式传 width height、或者显示后调 resize。

第二，同一个 DOM 禁止重复 init，会告警且有拿到旧实例的风险；先用 getInstanceByDom 查有没有已存在的实例。React 严格模式 effect 双执行时尤其要注意配合 dispose 清理。

第三，resize：窗口级用 window resize 事件；但 CSS 或 JS 改容器尺寸不触发 window resize，要用 ResizeObserver 监听容器，建议加防抖。clear 和 dispose 的区别是考点：clear 只清内容、实例可复用；dispose 彻底销毁不可再用。多图联动还可以 echarts.connect 把多个实例连起来。
-->

---

# setOption 合并模式（重点）

```js
chart.setOption(option);                       // 默认：普通合并（递归 merge）
chart.setOption(option, true);                 // notMerge：丢弃旧 option 全量替换
chart.setOption(option, { replaceMerge: 'series' }); // v5+ 能删组件的合并
chart.setOption(option, { lazyUpdate: true }); // 推迟到下一帧再合并重绘
```

<v-clicks>

- **默认合并陷阱**：数组型组件（series/xAxis…）按 index 对位合并——传更少的 series 也**删不掉**旧的
- `replaceMerge: 'series'` 按 id 对齐、会删除未出现的组件——**增删 series 的正解**
- 一切数据更新都走 setOption：内部 diff + 过渡动画；系列靠 `name` 对齐，推荐显式命名
- 异步加载体验：`showLoading()` / `hideLoading()`

</v-clicks>

<!--
setOption 的合并模式是必考重点。三种语义。

默认 notMerge 为 false，普通合并：新旧 option 递归合并，数组型组件比如 series、xAxis 按数组下标对位合并。这就埋了个经典陷阱：你这次传的 series 比上次少，旧的照样在——因为按 index 合并根本不知道你想删。

notMerge 传 true：直接丢弃旧 option 全量替换，最简单粗暴，主题切换后官方也建议用它。

replaceMerge 是 v5 加的折中方案：只对指定的组件类型做替换式合并，能按 id 对齐并删除这次没出现的组件，增删 series 的正确姿势就是 replaceMerge series。

另外两个开关：lazyUpdate 不立即重绘、推迟到下一帧，适合合并多次 setOption；silent 则不触发事件。

数据更新范式记住一句：一切更新都走 setOption，不要自己diff，ECharts 内部会做差异对比和过渡动画；更新时系列靠 name 对齐，所以推荐每个 series 显式命名，别依赖顺序。异步加载数据时配 showLoading、hideLoading。
-->

---

# option 心智模型与坐标系挂载

```js
option = {
  grid: [{ bottom: '55%' }, { top: '55%' }],   // 两个绘图区（K 线 + 成交量）
  xAxis: [{ gridIndex: 0 }, { gridIndex: 1 }], // 轴挂 grid
  yAxis: [{ gridIndex: 0 }, { gridIndex: 1 }],
  series: [                                    // series 挂轴
    { type: 'candlestick', xAxisIndex: 0, yAxisIndex: 0, data: kline },
    { type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: volume }
  ]
};
```

<v-clicks>

- option = **组件声明集合**：title / legend / grid / xAxis / tooltip / dataZoom / visualMap / series…
- series 靠 `coordinateSystem` + 索引挂坐标系：cartesian2d / polar / geo / calendar / matrix
- 双 y 轴：`yAxis: [{}, {}]` + series 设 `yAxisIndex: 1`（温度/降水经典例）

</v-clicks>

<!--
option 的心智模型：它就是一个组件声明集合。title、legend、grid、xAxis、yAxis、tooltip、dataZoom、visualMap、series 各司其职，还有顶层的 color 调色盘、backgroundColor、animation 这些全局属性。v6 又加了 matrix 矩阵坐标系和 thumbnail 缩略图两个顶层组件。graphic 组件可以放水印这类不属于任何系列的装饰。

series 和坐标系的挂载关系是配置复杂图的钥匙：series 通过 coordinateSystem 加索引挂到坐标系，直角坐标系用 xAxisIndex、yAxisIndex，轴再通过 gridIndex 挂到 grid——记住这条挂载链：series 挂轴、轴挂 grid。极坐标、日历、地理坐标系同理，polarIndex、calendarIndex、geoIndex。

代码是最典型的多 grid 例子：K 线加成交量，上下两个绘图区，各自一对轴，两个 series 分别挂到各自的轴上。

双 y 轴更简单：yAxis 写成数组，第二个 series 设 yAxisIndex 为 1，官方经典例子是温度和降水量。坐标轴本身有四要素：axisLine 轴线、axisTick 刻度、axisLabel 标签、name 轴名；轴类型 value、category、time、log 四种；category 的 boundaryGap 默认留白。
-->

---

# dataset + encode（v4+ 推荐数据流）

```js
option = {
  dataset: {
    source: [
      ['product', '2015', '2016'],  // 首行 = 维度名
      ['Matcha Latte', 43.3, 85.8],
      ['Milk Tea', 83.1, 73.4]
    ]
  },
  xAxis: { type: 'category' },
  yAxis: {},
  series: [{ type: 'bar' }, { type: 'bar' }] // 默认按列映射出两个系列
};
```

- `encode` 显式映射维度到视觉通道：`{ x: 'product', y: '2016' }`；饼图用 itemName / value
- `seriesLayoutBy: 'row'` 改为按行取系列；多 dataset 用 `series.datasetIndex` 指定

<!--
dataset 是 v4 之后推荐的数据流：数据和样式配置分离，一份数据多个 series 复用。

source 支持三种格式：二维数组（首行可以是维度名，最常用）、对象数组、按列的键值对象。还可以用 dimensions 显式声明维度类型，number、ordinal、time，其中 float 和 int 会用 TypedArray 优化性能。

默认映射规则要记：不写 encode 时，有类目轴则第一列给类目轴，其余各列依次成为各个 series 的值——所以这个例子两个 bar 自动对应 2015、2016 两列。

encode 用来显式控制映射：把维度名或下标映射到视觉通道，直角坐标系是 x、y，极坐标是 radius、angle，饼图是 itemName、value，还能映射 tooltip。seriesLayoutBy 默认 column 按列取系列，设 row 就按行取。多个 dataset 时 series 用 datasetIndex 指定用哪份。

注意支持范围：line、bar、pie、scatter、candlestick、map 这些都支持 dataset，但后面讲的 appendData 增量加载和 dataset 不兼容。
-->

---

# transform 数据转换（v5+）

```js
dataset: [
  { source: rawData },
  { transform: { type: 'filter',               // 过滤
      config: { dimension: 'Year', '=': 2011 } } },
  { transform: { type: 'sort',                 // 排序
      config: { dimension: 'score', order: 'desc' } } }
]
// series 用 datasetIndex: 1 / 2 消费转换结果
```

<v-clicks>

- 声明在**第二个及之后**的 dataset 上；链式：上一个的结果是下一个的输入
- filter 运算符：`> >= < <= = != reg`，支持 and / or / not 与 `parser: 'time'`
- 外部扩展：`echarts.registerTransform` + **ecStat**（回归 / 聚类 / 直方图 / 箱线）
- 调试：transform 里加 `print: true` 控制台打印结果

</v-clicks>

<!--
transform 是 v5 加的声明式数据转换：输出数据等于函数作用于输入数据，全部写在 dataset 里。

用法：第一个 dataset 放原始数据，第二个及之后的 dataset 声明 transform，series 用 datasetIndex 指到某一级消费它的结果。转换可以链式：上一个 transform 的结果就是下一个的输入；还能用 fromDatasetIndex、fromDatasetId 显式指定输入源，多输出的 transform 用 fromTransformResult 取第 n 个结果。

内置两种：filter 过滤，条件运算符大于、大于等于、等于、不等、正则 reg，还能 and、or、not 复合，parser 可以把字符串按 time、number 解析再比较；sort 排序，支持多维度和 incomparable 处理空值。

不够用就上外部 transform：echarts.registerTransform 注册，官方生态 echarts-stat，也就是 ecStat，提供回归、聚类、直方图、箱线图这些统计转换，比如 ecStat:regression 一行配出回归线。

调试技巧：transform 里加 print: true，控制台直接打印转换结果。
-->

---

# 常用 series 巡礼 I：line / bar / pie

```js
series: [
  { type: 'line', smooth: true, areaStyle: {}, stack: 'total' },
  { type: 'bar',  stack: 'total', barMaxWidth: 24 },
  { type: 'pie',  radius: ['40%', '70%'],       // 环形图
    data: [{ name: '直接访问', value: 335 }] }
]
```

<v-clicks>

- **line**：`smooth` 平滑、`areaStyle: {}` 面积、`step` 阶梯、`connectNulls`、`sampling: 'lttb'` 降采样
- **bar**：`stack` **同名才堆叠**、`barWidth / barGap`、大数据 `large: true`（阈值默认 2000）
- **pie**：data 是 `{ name, value }`、`roseType` 玫瑰图、`avoidLabelOverlap`、占比模板变量 `{d}`
- 折柱混合 = 同一 option 多 series 不同 type；v6 堆叠可 `stackOrder` 反转顺序

</v-clicks>

<!--
三大基础系列过一遍。

折线 line：smooth 平滑曲线；areaStyle 给个空对象就变面积图；stack 堆叠，注意堆叠的规则是 stack 值相同的系列才叠在一起；step 阶梯线；connectNulls 决定空值断不断线；数据点远超像素宽度时开 sampling 降采样，推荐 lttb 算法，保形效果最好，这在性能页还会展开。

柱状 bar：同样用 stack 堆叠；barWidth、barMaxWidth、barGap 控制柱宽柱距；大数据量开 large: true，配 largeThreshold 默认 2000，超过才启用优化，代价是单点样式定制失效。v6 还加了 stackOrder 可以反转堆叠顺序。

饼图 pie：数据格式是 name 加 value 的对象数组，不需要坐标轴；radius 给数组就是环形图；roseType 是南丁格尔玫瑰图；avoidLabelOverlap 防标签重叠；label 里的模板变量 {d} 是占比百分数。

折柱混合就是同一个 option 里多个 series 用不同 type，toolbox 的 magicType 还能一键切换。
-->

---

# 常用 series 巡礼 II：更多图表

<v-clicks>

- **scatter**：`symbolSize: v => v[2] * k` → 气泡图
- **candlestick**：data 每项 **[open, close, lowest, highest]**（不是 OHLC 顺序！）；阳线 `itemStyle.color`、阴线 `color0`
- **radar**：不用 x/y 轴，配套顶层 `radar: { indicator: [{ name, max }] }`
- **graph** 关系图：`layout: 'force' | 'circular'`，nodes + links
- 层次数据：`tree` 树图 / `treemap` 矩形树图（可下钻）/ `sunburst` 旭日图
- **heatmap**：直角 / calendar / geo 三种坐标系上都可，需配 visualMap
- 其他：`gauge` 仪表盘、`funnel` 漏斗、`custom` 自定义（`renderItem` 自由绘制兜底）

</v-clicks>

<!--
再快速巡礼常用的其他系列。

散点 scatter：symbolSize 给函数、用第三维数据控制点大小，就是气泡图。v6 给散点加的蜂群抖动后面 v6 新特性页专门讲。

K 线 candlestick：数据顺序是最高频的坑——每项是 open、close、lowest、highest，开收低高，不是美式 OHLC 的开高低收！阳线颜色 itemStyle.color、阴线 color0。大数据 K 线配 progressive 渐进渲染。v6 对金融场景还有增强，markLine 这些支持 relativeTo 相对定位，官方新增了分时图、MACD、深度图示例。

雷达 radar 特殊：不用 xAxis yAxis，配套一个顶层 radar 组件声明各维度指示器和 max。

关系图 graph：layout 选力导 force 或环形 circular，数据是 nodes 加 links；v6 可以配 thumbnail 缩略图辅助漫游导航。

层次数据三兄弟：tree 树图、treemap 矩形树图支持下钻、sunburst 旭日图。热力图 heatmap 能画在直角坐标系、日历坐标系、地图上，都要配 visualMap。还有 gauge 仪表盘、funnel 漏斗，以及 custom 自定义系列，renderItem 返回图形描述，是自由绘图的兜底方案。
-->

---

# visualMap 与主题体系

```js
// v6 动态主题：不销毁实例热切换
chart.setTheme('dark');
// 跟随系统深浅色
const mq = window.matchMedia('(prefers-color-scheme: dark)');
mq.addEventListener('change', e =>
  chart.setTheme(e.matches ? 'dark' : 'default'));
```

<v-clicks>

- **visualMap**：数据值→视觉通道；`continuous` 连续 / `piecewise` 分段；`min/max` + `dimension` + `inRange: { color: [...] }`
- 主题三来源：内置 `'dark'` / `registerTheme('my', obj)` / 主题编辑器可视化生成
- **v6 新默认主题**（设计令牌重构）；回退 v5 观感：`import 'echarts/theme/v5.js'` → `init(dom, 'v5')`
- setTheme 后续 setOption 建议 `notMerge: true`（多次 merge 不受支持）

</v-clicks>

<!--
两个视觉话题：visualMap 和主题。

visualMap 做数据值到视觉通道的映射——颜色、大小、透明度。两种类型：continuous 连续型带拖拽手柄，min max 必填；piecewise 分段型用 pieces 或 splitNumber 分档。dimension 指定映射哪个维度、seriesIndex 指定作用于哪些系列，inRange 和 outOfRange 定义映射到的视觉元素。热力图必须配它。v6 还新增 unboundedRange 支持开区间。调色盘则是顶层 color 数组全局生效、series 里 color 局部覆盖。

主题三个来源：init 第二参传内置 'dark'；registerTheme 注册自定义主题对象；官方主题编辑器可视化生成。

v6 的重点：默认主题用设计令牌重构成了现代观感，想保持 v5 老观感就导入 echarts/theme/v5.js 然后 init 传 'v5'；v5 的 light 主题迁移成了 rainbow。

最大亮点是动态主题：chart.setTheme 传名字或对象，不销毁实例、没有二次初始化动画，配 matchMedia 监听系统深浅色就能自动联动。注意限制：setTheme 之后多次 merge 模式的 setOption 不受支持，官方建议后续用 notMerge: true。另外 option.darkMode 配深色背景可自动调亮文字。
-->

---

# tooltip 详解

```js
tooltip: {
  trigger: 'axis',                 // item 单点 / axis 整轴 / none
  axisPointer: { type: 'cross' },  // 指示器：line / shadow / cross
  valueFormatter: v => v + ' 万',  // v5.3+ 只格式化数值部分
  confine: true,                   // 限制在图表区域内（防被裁剪）
  formatter: '{b}: {c} ({d}%)'     // 模板：{a}系列名 {b}名 {c}值 {d}占比
}
```

<v-clicks>

- 回调 formatter：`(params) => html`；**trigger:'axis' 时 params 是数组**（高频 bug）
- 回调里别用 `this`，用形参 params；异步内容用 ticket + callback 回填
- `triggerOn: 'none'` + dispatchAction `showTip` 可完全手动控制；v6 新 `displayTransition`

</v-clicks>

<!--
tooltip 是使用频率最高的交互组件，必考。

trigger 三种：item 单点触发，散点图饼图适用；axis 整轴触发，折线柱状对比多系列时用，会把该轴刻度上所有系列一起显示；none 不触发。triggerOn 控制触发时机，mousemove、click，或者 none 之后完全用 dispatchAction 手动控制。

formatter 两种形态。字符串模板：{a} 系列名、{b} 类目名、{c} 数值、{d} 饼图百分比，多系列还能 {b0} {c0} {b1} {c1} 按序号取。回调形式拿 params 自己拼 HTML——两个高频 bug：一是 trigger axis 时 params 是数组，还按对象取值就 undefined；二是回调里用 this，应该用形参。params 里还有 marker 现成的色点 HTML。异步内容用第二三参 ticket 加 callback 回填。

v5.3 加的 valueFormatter 更轻量，只格式化数值部分不用重写整个模板。confine: true 把浮层限制在图表区域内，容器有 overflow hidden 时必开；还有 appendToBody 脱离容器渲染、position 函数自定义定位。axisPointer 轴指示器三种：直线、阴影、十字准星，配在 tooltip 里或轴上，顶层 axisPointer 还能做多图联动。v6 新增 displayTransition 控制显隐过渡。
-->

---

# legend / dataZoom / toolbox

<v-clicks>

- **legend**：图例项 = `series.name`（饼图 = data item 的 name），不一致 → 不显示、不联动（高频坑）
- 项目多用 `type: 'scroll'` 翻页；`selected: { '名': false }` 初始隐藏；`selectedMode: 'single'` 单选
- **dataZoom**：`inside`（滚轮/拖拽，藏在坐标系内）与 `slider`（可见滑条）常并用同控一轴
- `start/end` 百分比、`startValue/endValue` 绝对值、`xAxisIndex` 指定控制哪根轴
- `filterMode` 默认 `'filter'` 会**过滤数据**、联动另一轴自适应；只裁窗口用 `'none' / 'weakFilter'`
- **toolbox**：saveAsImage / restore / dataView / dataZoom / magicType（折柱、堆叠切换）
- **brush** 区域刷选 + `brushSelected` 事件 → 联动分析

</v-clicks>

<!--
三个高频交互组件。

legend 图例的核心规则一句话：图例项的名字等于 series.name，饼图这类类目型的等于 data item 的 name；对不上图例就不显示、点击也不联动，这是高频坑。项目多时 type: 'scroll' 翻页；selected 映射控制初始显隐；selectedMode 设 single 就是单选模式，点一个只亮一个。v6 还加了 triggerEvent。

dataZoom 区域缩放两种：inside 藏在坐标系里，滚轮和触摸拖拽操作；slider 是可见的滑条。实践里常常两个并用、同时控制一根轴。范围两种给法：start end 是 0 到 100 的百分比，startValue endValue 是绝对值。xAxisIndex、yAxisIndex 指定控制哪根轴。

filterMode 是个隐蔽考点：默认 filter 会真的过滤数据，导致另一根轴的范围跟着自适应变化；如果只想裁剪显示窗口不影响另一轴，用 none 或 weakFilter。

toolbox 工具栏内置五件套：保存图片、还原、数据视图、区域缩放、magicType 动态类型切换——折线柱状一键互换、堆叠切换。brush 区域刷选配 brushSelected 事件，能做选中数据的联动分析。
-->

---

# 事件与 dispatchAction

```js
chart.on('click', params => {
  // params: componentType / seriesIndex / name / dataIndex / data / value
});
chart.on('click', 'series.line', fn); // query 过滤：只听折线系列
chart.getZr().on('click', e => {      // 下探 zrender：画布空白区
  if (!e.target) { /* 点了空白处 */ }
});
chart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: 3 });
chart.dispatchAction({ type: 'showTip',   seriesIndex: 0, dataIndex: 3 });
```

<v-clicks>

- **鼠标事件**（click/mouseover/contextmenu…）vs **组件行为事件**（`legendselectchanged` / `datazoom` / `brushSelected`）
- dispatchAction 与用户交互等效、触发行为事件，但**不触发** click 等鼠标事件
- 生命周期：`rendered`（每帧）vs `finished`（全部渲染完成，截图时机）

</v-clicks>

<!--
事件系统两类要分清，这是考点。

第一类鼠标事件：click、dblclick、mouseover、mouseout、contextmenu 这些，参数 params 的结构要背：componentType 触发所在组件、seriesType、seriesIndex、seriesName、name 类目名、dataIndex 数据下标、data 原始数据项、value；关系图和弦图里还有 dataType 区分点和边。

on 的第二个参数可以做 query 过滤：字符串形式 'series.line' 只监听折线系列，对象形式可以精确到 seriesName 甚至 dataIndex，避免在回调里手写 if。

元素事件都在 chart.on 上；画布空白区域的点击要下探到 zrender：chart.getZr().on('click')，事件对象没有 target 就说明点在空白处。

第二类组件行为事件：用户操作交互组件后的状态变更，legendselectchanged 图例开关、datazoom 缩放、brushSelected 刷选，还有渲染生命周期 rendered 每帧触发、finished 全部渲染完成——要给图表截图就等 finished。

dispatchAction 用代码触发行为：highlight、downplay 高亮取消高亮做轮播、showTip 手动弹 tooltip、legendSelect 图例选中。注意它和用户交互等效、会触发对应行为事件，但不会触发 click 这类鼠标事件。v6 还新增了 expandAxisBreak、collapseAxisBreak 展开折叠断轴。
-->

---

# 大数据性能三板斧

| 手段 | 配置 | 适用 / 代价 |
|---|---|---|
| large 模式 | `large: true` + `largeThreshold`（默认 2000） | bar/scatter；单点样式定制失效 |
| 渐进渲染 | `progressive`（每帧块大小）+ `progressiveThreshold` | 分帧绘制不卡主线程 |
| 增量加载 | `chart.appendData({ seriesIndex, data })` | **仅 scatter/lines，不支持 dataset** |
| 降采样 | line 系列 `sampling: 'lttb'`（保形） | 点数远超像素宽度时 |

- 辅助：dataZoom 限初始窗口、大数据 `animation: false`、TypedArray + `dimensions` 声明 `float/int`
- init 开 `useDirtyRect: true` 局部重绘；同页多小图优先 SVG 渲染器省内存

<!--
大数据性能是必考专题，按手段记。

large 模式：bar、scatter 这些系列设 large: true，超过 largeThreshold 默认 2000 个点才启用绘制优化，代价是单个数据项的样式和交互定制失效。

渐进渲染 progressive：每帧只画一块，folding 到多帧完成，不卡主线程；progressive 是每帧块大小，折线默认十万、K 线三千；progressiveThreshold 超过才启用；progressiveChunkMode 设 'mod' 取模分块可以先出整体轮廓再逐帧填充。

增量加载 appendData：分片加载千万级数据，不清空已绘制内容，注意两个限制——只支持 scatter 和 lines 系列（GL 版还有 scatterGL），并且不支持 dataset 数据源。

降采样 sampling：折线数据点远超像素宽度时开，推荐 lttb 算法，最大程度保留视觉形状；还有 average、min、max、v5.5 的 minmax。

辅助手段：dataZoom 的 start end 限定初始窗口减少首屏绘制；大数据直接 animation: false；数据用 TypedArray 加 dimensions 声明 float int。渲染层面 init 时开 useDirtyRect 脏矩形局部重绘，适合局部频繁更新；一个页面很多小图优先 SVG 渲染器省内存。最后治理项：SPA 卸载必须 dispose、resize 监听记得解绑，v6 还专门修过 tooltip 的内存泄漏。
-->

---

# 地图与 geo

```js
echarts.registerMap('china', geoJSON); // v5+ 不内置 GeoJSON，必须先注册
option = {
  geo: { map: 'china' },                        // geo：独立坐标系组件
  series: [
    { type: 'map', map: 'china' },              // 方式一：map series 区域填色
    { type: 'scatter', coordinateSystem: 'geo', // 方式二：散点挂 geo
      data: [[116.4, 39.9, 100]] }              // [经度, 纬度, 值]
  ]
};
```

<v-clicks>

- **map series vs geo 组件**（考点）：前者自带地图 + 数据填色；后者是独立坐标系，供其他 series 挂载
- registerMap 也支持 `{ svg }` 注册 SVG 底图；`specialAreas` 微调区域
- 地图不显示第一嫌疑：**忘了 registerMap**（v5 起 GeoJSON 不随包分发）

</v-clicks>

<!--
地图可视化两条路，区别是考点。

第一步都一样：registerMap 注册地图数据。注意 v5 起 GeoJSON 不再内置在包里，必须自己获取后注册——地图不显示的第一嫌疑就是忘了这步。除了 GeoJSON 还支持传 { svg } 注册 SVG 底图，比如室内平面图；第三参 specialAreas 可以微调个别区域的位置大小。

方式一 map series：series type 设 'map'、map 指向注册名，它自带地图绘制加数据填色，做区域着色地图（choropleth）最直接，配 visualMap 按数值深浅上色。

方式二 geo 组件：它是独立的地理坐标系组件，自己不画数据，供其他系列挂载——散点上地图就是 scatter 或 effectScatter 设 coordinateSystem: 'geo'，数据格式是经度、纬度、值的三元组。热力图、lines 航线图也这么挂。

v6 的补充：geo 和 graph 都能配 thumbnail 缩略图组件，大地图漫游时有个小地图导航。
-->

---

# SSR 与跨端

```js
// 服务端：v5.3+ 零依赖 SSR（仅 SVG 模式）
const chart = echarts.init(null, null,
  { renderer: 'svg', ssr: true, width: 600, height: 400 });
chart.setOption(option);
const svgStr = chart.renderToSVGString(); // HTTP 响应直接返回
chart.dispose();                          // 服务端务必释放
```

<v-clicks>

- 初始动画以 **CSS 动画内嵌**在 SVG 字符串里——客户端不加载 JS 也有入场动画
- 水合两方案：懒加载全量 echarts 接管交互 / v5.5+ **~4KB 轻量运行时**（图例开关 + 请求服务端重渲染）
- 服务端出**图片**：node-canvas 的 canvas 对象直接传给 `echarts.init(canvas)`
- 小程序：官方 **echarts-for-weixin**；Vue/React 封装：vue-echarts / echarts-for-react

</v-clicks>

<!--
服务端渲染是 v5.3 之后的成熟能力，零外部依赖。

用法：init 第一参传 null 不要 DOM，opts 里 renderer 必须 svg、ssr: true、显式 width height；setOption 后调 renderToSVGString 拿到 SVG 字符串，HTTP 响应直接返回；服务端记得 dispose 释放。ssr 模式下不再逐帧自动渲染。

很妙的一点：初始动画以 CSS 动画的形式内嵌在 SVG 字符串里，客户端一行 JS 不加载也有入场动画。

水合两个方案：方案 A 首屏用 SVG，再懒加载完整 echarts 替换接管全部交互；方案 B 是 v5.5 提供的约 4KB 轻量客户端运行时，支持图例开关这类基础交互，交互后请求服务端重新渲染，免去下发几百 KB 的全量库，适合对首屏体积极敏感的场景。

如果目标平台不认 SVG 要出图片，走 node-canvas：把 canvas 对象传给 echarts.init。

跨端：微信小程序用官方适配仓库 echarts-for-weixin，差异核心在 DOM 和 Canvas 的获取方式。框架集成的铁律：容器 ref、挂载后 init、卸载前 dispose、容器尺寸变化 resize；现成封装 Vue 用 vue-echarts、React 用 echarts-for-react，但按需引入还是要自己 use。
-->

---

# v6 新特性 I：和弦图 + 蜂群 jitter

```js
// 和弦图 chord：关系网络中的流量/权重（金融交易、社交关系）
series: [{
  type: 'chord',
  data:  [{ name: 'A' }, { name: 'B' }],
  links: [{ source: 'A', target: 'B', value: 20 }]
}]
// 蜂群/抖动散点：jitter 配在「轴」上（非数据维度那条轴）
yAxis: { jitter: 30, jitterOverlap: false }
// false = 避让不重叠 → 蜂群图；true = 允许重叠 → 抖动散点（更快）
```

<v-clicks>

- chord 的 `links` 亦可写作 `edges`；支持用出入节点渐变色作为边颜色
- jitter 挂轴的设计：在**非数据维度**的轴向散开，任何 series 无需改动；另有 `jitterMargin`

</v-clicks>

<!--
v6 新特性上半场：两个新图表能力。

和弦图 chord 是 v6 全新的系列类型，展现关系网络中的流量和权重，比如银行间转账、社交关系强度。配置就是 data 节点列表加 links 连接列表，links 也可以写作 edges，两个字段都支持。视觉上支持用出入节点的渐变色作为边的颜色，量级一眼可见。

蜂群图和抖动散点是 v6 给散点家族的增强，设计很特别：jitter 不配在 series 上，而是配在坐标轴上——而且是非数据维度的那条轴。jitter 给非零值就开启随机偏移；jitterOverlap 是关键开关：false 表示做避让不重叠，出来就是蜂群图 beeswarm 的效果；true 允许重叠，就是普通抖动散点，性能更高。还有 jitterMargin 控制间距。

为什么挂在轴上是个好设计？因为散开发生在非数据维度的轴向，series 完全无感知，散点、气泡随便换系列类型都能直接获得抖动能力，不用每种系列各实现一遍。
-->

---

# v6 新特性 II：断轴 + 矩阵坐标系 + 自定义系列

```js
// 断轴 breaks：跳过无意义区间（撕纸效果，可交互展开/折叠）
yAxis: { breaks: [{ start: 1000, end: 50000 }] },
// 配套 action：expandAxisBreak / collapseAxisBreak

// 矩阵坐标系 matrix：图表/组件表格化编排（协方差矩阵、元素周期表）
matrix: { /* 顶层新坐标系组件 */ },
series: [{ coordinateSystem: 'matrix', matrixIndex: 0 }]
```

<v-clicks>

- `registerCustomSeries(type, renderItem)`：把自定义系列注册成内置图表般复用；官方 **echarts-custom-series** 仓库提供小提琴图、范围柱状图等 6 种（npm 可装）
- `thumbnail` 缩略图组件：graph / geo 漫游时的小地图导航
- 其他：sankey 漫游、visualMap `unboundedRange`、K 线 marker `relativeTo` 定位

</v-clicks>

<!--
v6 新特性下半场：坐标系与扩展体系。

断轴 breaks：数据里有大段无意义区间时，轴上声明 breaks 数组，start end 指定跳过的范围，视觉呈现撕纸效果；配套两个 action，expandAxisBreak 和 collapseAxisBreak，用户点击可以展开回真实比例，交互式对比很好用。

矩阵坐标系 matrix 是 v6 的新顶层组件：把图表和组件按行列表格化编排，series 设 coordinateSystem: 'matrix' 加 matrixIndex 挂进去，官方演示了协方差矩阵、元素周期表这类布局，本质是给「许多小图规整排布」提供了坐标系级别的方案。

自定义系列生态是我认为最有想象力的：v6 新 API registerCustomSeries 把 custom 系列的 renderItem 注册成一个具名类型，之后像内置图表一样 type 一指就能用。官方还开了 echarts-custom-series 仓库，提供小提琴图、轮廓图、睡眠阶段图、分段环形图、范围柱状图、范围折线图六种，npm 直接装——图表类型从此可以像插件一样分发。

再补三个：sankey 支持漫游、visualMap 支持 unboundedRange 开区间、K 线的 markPoint markLine 支持 relativeTo 相对坐标系或角落定位。
-->

---

# v5 → v6 升级要点

| 变化 | 回退开关 |
|---|---|
| 新默认主题（设计令牌重构） | `import 'echarts/theme/v5.js'` → `init(dom, 'v5')` |
| v5 的 light 主题 | 迁移为 `echarts/theme/rainbow.js` |
| 轴标签**防溢出/防重叠默认开启** | `grid.outerBoundsMode: 'none'`、轴 `nameMoveOverlap: false` |
| rich 富文本默认继承外层 label 字体 | `richInheritPlainLabel: false` |
| geo/map/graph/tree 的 center 百分比基准修正 | `legacyViewCoordSysCenterBase: true` |

- `grid.containLabel` 新等价：`{ outerBoundsMode: 'same', outerBoundsContain: 'axisLabel' }`
- 升级后视觉「跑偏」多半是主题 + 轴布局默认值变化，按表定点回退

<!--
v5 升 v6 的 breaking changes 按表记，每条都有回退开关。

第一，默认主题换了：v6 用设计令牌重构了默认外观，一升级图表气质就变。想保持 v5 观感：导入 echarts/theme/v5.js 然后 init 传 'v5'，或者手动配 v5 那套调色盘，5470c6 打头的九个色。v5 的 light 主题则迁移成了 rainbow。

第二，直角坐标系的轴标签防溢出、轴名防重叠策略默认开启了，好处是长标签不再被裁掉，代价是布局位置可能和 v5 有细微差异。关闭方式：grid.outerBoundsMode 设 'none'、轴上 nameMoveOverlap 设 false。相关的 grid.containLabel 现在等价于 outerBoundsMode 'same' 加 outerBoundsContain 'axisLabel'。

第三，rich 富文本的各样式段默认继承外层 label 的字体属性了，旧行为用 richInheritPlainLabel: false 回退。

第四，geo、map、graph、tree 这些视图的 center 百分比基准做了修正，旧算法用 legacyViewCoordSysCenterBase: true 回退。

排查心法：升级后视觉跑偏，多半就是主题加轴布局默认值这两类变化，对着表定点回退即可，不用全量锁死。
-->

---

# 易错点 TOP 8

<v-clicks>

1. **容器无宽高时 init** → 0 尺寸空白图：先布局后 init / 显式 `width/height` / 显示后 `resize()`
2. 默认 merge **删不掉 series** → `replaceMerge: 'series'` 或 `notMerge: true`
3. **Vue 用 ref/reactive 存实例** → Proxy 深层劫持内部对象、性能骤降：必须 **shallowRef** 或普通变量
4. 忘 `dispose` / 忘解绑 resize 监听 → SPA 路由切换后实例与闭包泄漏
5. tooltip 回调用 `this` 取数；`trigger:'axis'` 时 params 是**数组**还按对象取
6. legend 不亮不联动：图例项与 `series.name` 不一致
7. 按需引入漏组件：`Component xxx not exists`（dataset / transform / grid 高发）
8. candlestick 顺序是 **[open, close, lowest, highest]** 不是 OHLC；无障碍开关 v5 起是 `aria.enabled`

</v-clicks>

<!--
易错点集中过一遍，都是实战里反复出现的。

一，容器无宽高 init：display none 的 Tab、v-show 没显示时 init 拿到 0 尺寸，图表空白。三种解法前面讲过。二，setOption 默认合并按 index 对位，传更少的 series 删不掉旧的，增删用 replaceMerge。

三，Vue 专属大坑：把实例放进 ref 或 reactive，Proxy 会深层劫持 zrender 内部大对象，导致卡顿甚至报错——必须用 shallowRef 或者干脆普通变量存。四，SPA 里忘 dispose、忘解绑 resize 监听，路由切几次内存就上去了；v6 之前 tooltip 也有过泄漏案例，6.0 修复。

五，tooltip 回调里用 this 拿不到数据，用形参 params；axis 触发时 params 是数组，还按对象取值是高频 bug。六，legend 图例项和 series.name 对不上就不显示不联动。

七，按需引入漏注册组件，报 Component not exists，dataset、transform、grid 三个高发。八，K 线数据顺序开收低高，不是 OHLC；顺带记一个：无障碍开关 v4 叫 aria.show，v5 起改成 aria.enabled 总控，decal 贴花还要 aria.decal.show，给色盲用户补纹理区分。

另外 dataZoom 的 filterMode 默认会过滤数据连累另一轴、large 模式下单点样式失效，这两个前面各自页里讲过，也归这类。
-->

---
layout: intro
---

# 总结

Apache ECharts = **声明式 option 驱动**的全场景图表库

- 架构：zrender 渲染引擎 + Canvas/SVG 双渲染器（v6.1）
- 工程标配：按需引入 core + use、`replaceMerge` 管增删、`dispose` 防泄漏
- 数据流：dataset + encode + transform；大数据 large / progressive / appendData
- v6 记忆点：setTheme 动态主题、chord 和弦图、轴 jitter 蜂群、断轴、matrix
- 选型：极致轻量 Chart.js / 完全自由 D3 / 图形语法 G2 / **交付业务 ECharts**
- 资源：echarts.apache.org 的示例库 + 配置项手册 + 主题编辑器

<!--
总结。

Apache ECharts 是声明式 option 驱动的全场景图表库：底层 zrender 渲染引擎，Canvas 和 SVG 双渲染器按场景选，当前版本 v6.1。

工程实践记三件套：生产必须按需引入，echarts/core 加 use 注册；增删系列用 replaceMerge 而不是硬怼默认合并；组件卸载必须 dispose 防泄漏，Vue 里实例用 shallowRef 存。

数据侧：dataset 加 encode 做数据与样式分离，transform 做声明式过滤排序，统计增强上 ecStat；大数据按量级选 large、progressive、appendData、sampling。

v6 的记忆点：setTheme 动态主题热切换、chord 和弦图、轴级 jitter 蜂群图、断轴 breaks、matrix 矩阵坐标系，还有 registerCustomSeries 的插件化图表生态。

选型一句话：要极致轻量选 Chart.js，要完全自由造轮子选 D3，要图形语法探索式分析选 AntV G2，交付业务、大屏、地图、金融场景，ECharts 仍是第一选择。官方示例库即抄即用，配置项手册当字典查。谢谢大家。
-->
