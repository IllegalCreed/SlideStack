---
theme: seriph
background: https://cover.sli.dev
title: D3.js — 数据驱动文档
info: |
  Presentation D3.js — Data-Driven Documents.

  Learn more at [https://d3js.org](https://d3js.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📊</span>
</div>

<br/>

## D3.js — 数据驱动文档

基于 Web 标准的低层级数据可视化工具集：不是图表库，用数据驱动 DOM。当前版本 v7.9

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/d3/d3" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 D3.js。全称 Data-Driven Documents，数据驱动文档，作者 Mike Bostock，ISC 协议。

一句话定位：它是基于 Web 标准的低层级数据可视化工具集，不是图表库，里面没有「图表」这个概念，而是用数据去驱动 DOM，可以是 SVG、Canvas 或 HTML，换来的是无与伦比的定制自由度。

版本背景：2026 年当前 npm 最新版 7.9.0。v7 本身是 30 个独立模块的元包，ESM 优先。

顺序：定位哲学 → 模块架构 → 选择集与数据绑定 → 比例尺 → 坐标轴 → 形状生成器 → 层级布局 → 力导向 → 过渡 → 交互三件套 → 数据处理 → 框架集成 → Canvas 路线 → 易错点 → 选型总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 不是图表库

D3 是可视化领域的「汇编语言」：

<v-clicks>

- 没有「图表」概念，用**数据驱动 DOM**
- 换取**无上限的定制自由度**
- 代价：基础柱状图也要几十行代码
- 核心创新：**data join**（enter/update/exit）
- 高层库（Plot、Recharts、ECharts 的 scale）都受其影响
- IEEE VIS 与 Information is Beautiful 双料 Test of Time Award

</v-clicks>

<div v-click class="mt-4 text-sm">

> 官方原话：Consider D3 an alternative to "doing everything yourself", not an alternative to a high-level charting library.

</div>

<!--
先讲哲学定位。D3 常被误认为图表库，其实它是低层级工具集，可视化领域的「汇编语言」与事实标准，拿过 IEEE VIS 和 Information is Beautiful 双料 Test of Time Award。

它没有「柱状图」「折线图」这种现成概念，你操作的是选择集、比例尺、路径生成器这些底层积木，用数据驱动 DOM。好处是任意视觉形式都能造，坏处是一个基础柱状图也要几十行代码。

它的核心创新是 data join，enter、update、exit 三态模型，几乎所有高层图表库都受其影响。

官方自己说得很清楚：D3 是「自己从零造」的替代品，不是高层图表库的替代品。赶时间做仪表板该用 Plot 或 ECharts；要做纽约时报级的定制交互可视化，D3 是唯一解。
-->

---

# 模块化架构：30 个模块按需引入

| 类别 | 模块 |
|---|---|
| 选择与 DOM | d3-selection |
| 比例尺 | d3-scale、d3-scale-chromatic |
| 形状 | d3-shape（line/area/arc/pie/stack） |
| 布局 | d3-hierarchy、d3-force |
| 动画 | d3-transition、d3-ease、d3-interpolate |
| 交互 | d3-zoom、d3-drag、d3-brush |
| 数据 | d3-array、d3-fetch、d3-dsv、d3-time-format |

<div v-click class="mt-3 text-sm">

> `d3` 包只是**元包**；**scale / shape / array / hierarchy 是纯数据计算、不碰 DOM**——这是与框架分工协作的基础。

</div>

<!--
架构上，v4 起 D3 从单包拆成模块化多包，v7 的 d3 包只是 30 个独立模块的元包，d3-selection、d3-scale、d3-force 各自独立发版。

引入方式：整包 import star as d3 from "d3"，或按模块只引需要的，比如从 d3-array 引 mean，还有 CDN 的 ESM 路径。TS 类型走 DefinitelyTyped 的 types/d3。

版本演进考点：v5 用 d3-fetch 取代 d3-request，回调变 Promise；v6 事件签名改成 event 加 d，d3.event 全局对象移除；v7 全面 ESM 优先。

最关键的认知在下面这句：比例尺、形状、数组、层级这些模块是纯数据计算，完全不碰 DOM。这意味着可以只用 D3 算数、让 React 或 Vue 渲染，后面框架集成会展开。另外还有 d3-geo 做地图投影，本次不展开。
-->

---

# 选择集 selection

```js
d3.select("#chart");                    // 首个匹配（也可直接传 DOM 节点）
d3.selectAll("p");                      // 全部匹配（可传 NodeList/数组）
sel.attr("r", (d, i, nodes) => i * 2)   // 值函数：this === nodes[i]
   .style("width", "3px")               // CSS 值需带单位
   .text(d => d.name)
   .on("click", (event, d) => {});      // v6+ 事件签名 (event, d)
svg.append("g").call(d3.axisBottom(x)); // call：传整个选择集，链式复用
```

<v-clicks>

- `select` 每元素选 1 个后代、**传播父数据**；`selectAll` 重新分组、**不继承数据**
- `html()` 仅 HTML 元素可用，SVG 不支持
- 箭头函数拿不到 `this`——需要 `this` 时用 `function`
- v6 变更：`d3.event` 已移除、`d3.mouse` 改为 `d3.pointer(event, target)`

</v-clicks>

<!--
一切从选择集开始。select 选第一个匹配元素，selectAll 选全部，参数可以是选择器字符串，也可以直接传 DOM 节点或数组。

修改方法都支持常量或函数，函数签名是 d、i、nodes，this 指向当前元素，等于 nodes i。注意三点：style 设 CSS 要带单位，写 3px 不能写 3；html 方法只能用于 HTML 元素，SVG 不支持；箭头函数拿不到 this，需要 this 的场合必须用 function。

call 是链式复用的关键范式：把整个选择集传给函数调用一次并返回选择集，坐标轴、brush、zoom、drag 全靠它安装。

区分 select 和 selectAll 是必考点：select 不改分组结构、会把父数据传播给子元素；selectAll 按父元素重新分组、不继承数据，子元素数据必须由 data 方法绑定。

事件这块 v6 是分水岭：监听器签名统一为 event 加 d，d3.event 全局对象删掉了，取相对坐标用 d3.pointer。
-->

---

# 数据绑定：enter / update / exit

```js
const u = svg.selectAll("circle").data(data, d => d.id); // update 选择集
u.enter().append("circle");   // enter：有数据无元素 → 占位节点实体化
u.exit().remove();            // exit：有元素无新数据 → 通常移除
```

<v-clicks>

- `data()` 返回 update 选择集，enter/exit 由其派生
- 无 key **按索引**对位；有 key 按字符串匹配——object constancy，动画正确性的关键
- key 经典写法：`function(d) { return d ? d.name : this.id; }`（旧元素与新数据各评估一次）
- 数据「粘」在元素的 `__data__` 属性上，重新选择仍在
- `datum(value)` 直接设值**不做 join**、无 enter/exit；清数据用 `datum(null)`
- enter 占位节点指向**父元素**——`selectAll` 之前必须有确定的父容器

</v-clicks>

<!--
这是 D3 最核心的一页：data join。把数据数组和元素集合做对齐，产生三种状态：都有的是 update；有数据没元素的是 enter，是占位节点，要用 append 实体化；有元素没新数据的是 exit，通常 remove。

data 方法返回的就是 update 选择集，enter 和 exit 从它派生。

第二个参数 key 函数决定怎么对齐：不传就按索引对位；传了就按 key 字符串匹配，这叫 object constancy，是更新动画正确性的关键。key 函数对已有元素和新数据各评估一次，所以有 d 判空的经典写法。

数据绑定后存在元素的 __data__ 属性上，「粘」在元素上，重新选择还在。datum 是不做 join 的直接设值，没有 enter exit，清数据只能用 datum null。

最后一个常见坑：enter 占位节点指向父元素，所以 selectAll 之前必须先有确定的父容器，否则 enter.append 挂错地方。
-->

---

# join()：现代首选范式（v5.8+）

```js
// 简写：join("circle") ≡ enter.append("circle") + update 恒等 + exit.remove()
svg.selectAll("circle").data(data).join("circle")
    .attr("cx", d => x(d.x));

// 三回调完整形式：返回 enter + update 合并选择集
svg.selectAll("circle").data(data, d => d.id).join(
  enter => enter.append("circle").attr("fill", "green"),
  update => update.attr("fill", "blue"),
  exit => exit.transition().attr("r", 0).remove()
).attr("stroke", "black");  // 作用于 enter + update
```

<v-clicks>

- 旧范式 `enter().append().merge(update)`——v4 教程遍地，要能读懂
- update/enter 按**数据顺序**返回、exit 按原 DOM 序；用 key 后需 `.order()` 重排

</v-clicks>

<!--
v5.8 引入的 join 方法是现代首选。传字符串是简写：等价于 enter append、update 恒等、exit remove 一步完成，一行搞定增删改。

需要区分对待时用三回调形式：enter、update、exit 各自处理，比如 enter 绿色、update 蓝色、exit 做缩小消失的过渡动画。join 返回 enter 和 update 的合并选择集，后面链的 attr 同时作用于两者。enter 或 update 回调若返回 transition，底层选择集仍会被合并返回；exit 的返回值不被使用。

读旧教程要认识 v4 老范式：enter 之后 append 再 merge update，merge 按索引合并两个选择集，join 内部就是用它实现的。

顺序细节：update 和 enter 按数据顺序返回，exit 保持绑定前顺序；用了 key 之后 DOM 顺序可能和数据顺序不一致，需要补 order 方法按选择集顺序重插 DOM。
-->

---

# 比例尺：domain 到 range 的映射函数

```js
const x = d3.scaleLinear([10, 130], [0, 960]); // 数据域 → 视觉域
x(20);        // 80
x.invert(80); // 20 —— 鼠标拾取的基石（range 必须是数值，否则 NaN）
```

| 类别 | API |
|---|---|
| 连续 → 连续 | scaleLinear / Pow / Sqrt / Log / Symlog / Time / Utc |
| 离散 → 离散 | scaleOrdinal（类别 → 颜色等） |
| 离散 → 连续位置 | scaleBand / scalePoint |
| 连续 → 离散 | scaleQuantize（等宽）/ Quantile（等频）/ Threshold |
| 连续 → 颜色 | scaleSequential / scaleDiverging |

<!--
比例尺的统一心智模型：scale 是一个从 domain 数据域到 range 视觉域的映射函数。scaleLinear 传 domain 10 到 130、range 0 到 960，调用 x(20) 得 80。

invert 是必考点：像素反算数据，x.invert(80) 得 20，是鼠标拾取的基石；注意 range 必须是数值，否则返回 NaN。

分类记这张表：连续到连续有 Linear、Pow、Sqrt、Log、Symlog、Time、Utc；离散到离散是 Ordinal，做分类配色；离散到连续位置是 Band 和 Point，柱状图和类目折线的坐标轴；连续到离散是 Quantize 等宽、Quantile 等频、Threshold 手动阈值三种分档；连续到颜色是 Sequential 和 Diverging，配插值器做热力色。

Quantize 还有 invertExtent 反查档位对应的数据区间，做图例交互用。
-->

---

# 比例尺细节与坑

```js
const x = d3.scaleBand(names, [0, width]).padding(0.1);
bar.attr("x", d => x(d.name)).attr("width", x.bandwidth());
```

<v-clicks>

- `nice()` 把 domain 圆整到好看边界（`extent` 零碎值必配；只作用当前 domain）；`clamp(true)` 夹紧出界值
- **scaleBand**：`bandwidth()` 条宽、`step()` 相邻起点距、`padding` 控间隙——**没有 invert**，反算用 `Math.floor((px - range[0]) / step)`
- **scaleOrdinal 隐式 domain**：未知输入按调用顺序自动加入 → 颜色漂移不确定；生产显式 domain 或 `.unknown(null)`
- **scaleTime** 的 domain 是 Date；官方建议优先 **scaleUtc**（一天恒 24h，不受浏览器时区影响）
- **scaleLog** 的 domain 严格同号、不得包含或跨越 0；跨 0 用 **scaleSymlog**

</v-clicks>

<!--
比例尺的高频细节。

scaleBand 是柱状图专用：domain 是类别数组，x 传类别返回 band 起点，bandwidth 是条宽，step 是相邻 band 起点距离，padding 系列控制间隙。最大的坑：band 没有 invert，调用就报错，hover 反算要用像素减 range 起点除以 step 取整，别照抄 linear 的套路。

nice 把 extent 算出的零碎 domain 圆整到好看的边界，注意它只作用于当前 domain，重设 domain 后要重新 nice。clamp 夹紧出界值，默认是外推的。ticks 返回人类可读的刻度值，count 只是建议值。

scaleOrdinal 的隐式 domain 是经典坑：不设 domain 时未知输入按调用顺序自动加入，结果依赖调用顺序，两次渲染颜色可能不一致，生产环境要显式 domain。range 少于 domain 时会循环复用。

时间轴官方建议优先 scaleUtc，一天恒定 24 小时，不受浏览器时区影响。log 的 domain 严格同号不得含零，跨零场景用 symlog。
-->

---

# 坐标轴与 margin convention

```js
const margin = {top: 20, right: 20, bottom: 30, left: 40};
const x = d3.scaleUtc(domain, [margin.left, width - margin.right]);
const y = d3.scaleLinear(dom, [height - margin.bottom, margin.top]); // y 反向！

svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));
svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));
```

<v-clicks>

- **轴永远渲染在原点，必须 transform 平移**；四方向 axisTop / Right / Bottom / Left
- `g.transition().call(axis)` 可动画更新轴；`ticks(count)` 是建议值、`tickValues` 显式指定
- 网格线惯用法：`tickSize(-innerWidth)`；`tickSizeOuter(0)` 去掉两端「方括号」

</v-clicks>

<!--
这是所有 D3 图表的布局骨架：margin convention。先定 margin 对象，把 margin 直接嵌进 scale 的 range。特别注意 y 轴：range 要写成 height 减 bottom 到 top，反向的，因为 SVG 的 y 向下增长，这样数据大值才在上面。

坐标轴是必考点：axisBottom 这些工厂返回的轴永远渲染在原点，它不会自己定位，必须用 transform 平移到位，比如底轴平移到 height 减 margin.bottom。用 selection.call 渲染，用 transition 的 call 可以做轴的动画更新。

轴生成的 DOM 是一条 path.domain 轴线加若干 g.tick，可以用 CSS 定制。配置项：ticks 的 count 只是建议值，band、point 比例尺不支持；要精确控制用 tickValues 显式指定。tickSizeOuter 设 0 去掉轴线两端的「方括号」变纯直线。

网格线的惯用法是 tickSize 传负的绘图区宽度，让刻度线穿过整个绘图区。
-->

---

# 形状生成器：line 与 area

```js
const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.close))
    .defined(d => !isNaN(d.close))  // 假值处断线：缺失数据留缺口
    .curve(d3.curveMonotoneX);      // 时间序列最稳的插值
path.attr("d", line(data));         // 数据 → path 的 d 字符串

const area = d3.area()
    .x(d => x(d.date))
    .y0(y(0))                       // 基线！默认 0 = SVG 顶部 → 忘设则倒挂
    .y1(d => y(d.value));
```

<v-clicks>

- shape 生成器 = **数据到 path `d` 字符串**的纯函数；`context(ctx)` 可切 Canvas 渲染
- 折线的 path 记得 `fill: none` + stroke，否则填充成色块

</v-clicks>

<!--
d3-shape 是一组纯函数生成器：吃数据，吐 path 的 d 字符串，不直接画图。

line 生成器设 x、y 访问器，调用 line(data) 得到 d 字符串。两个实用配置：defined 在假值处断线，缺失数据留缺口而不是连过去，必考；curve 设插值方式，时间序列最稳的是 curveMonotoneX，保单调防过冲。

area 是拓线加基线围成的闭合区域：y1 是顶线，y0 是基线。最大的坑是 y0 默认为 0，而 SVG 的 0 在顶部，忘设 y0 面积图直接倒挂，通常写 y(0)。area 还有 lineY1、lineY0 方法把顶线基线提取成 line 生成器，用来画描边。

给 path 设置时注意折线要 fill none 加 stroke。所有 shape 生成器都支持 context 方法切到 Canvas 上下文直接绘制，这时返回 void，后面 Canvas 路线会用到。
-->

---

# 形状生成器：pie 与 arc

```js
const arcs = d3.pie().value(d => d.sales)(data);
// 每项：{data, value, index, startAngle, endAngle, padAngle}

const arc = d3.arc().innerRadius(0).outerRadius(100);
svg.selectAll("path").data(arcs).join("path").attr("d", arc);
label.attr("transform", d => `translate(${arc.centroid(d)})`);
```

<v-clicks>

- **pie 不画图，只做数据变换**：值数组 → 带角度的对象数组
- 默认 `sortValues(d3.descending)` 值降序排扇区（图例易对不上号）；`sort(null)` 保输入序
- **角度约定**：弧度制、**0 在 12 点钟方向、顺时针为正**（与 Math 极坐标不同！）
- innerRadius 大于 0 即甜甜圈；`cornerRadius()` 圆角、`padAngle()` 扇区间隙
- `centroid(d)` 返回弧中线中点 [x, y]，放标签的标准位置

</v-clicks>

<!--
饼图两兄弟分工明确：pie 只做数据变换不画图，把值数组变成带 startAngle、endAngle 的对象数组；arc 把角度对象变成扇形 path。

pie 的默认排序是个惊喜坑：sortValues 默认按值降序分配角度，扇区顺序和输入顺序不一致，图例容易对不上号，要保持输入序就 sort null。注意返回数组的顺序永远等于输入顺序，排序只影响角度分配。

arc 的角度约定必考：用弧度制，0 在 12 点钟方向，顺时针为正，和数学极坐标不同。起止角差达到两派画整圆环。innerRadius 大于零就是甜甜圈图，cornerRadius 做圆角，padAngle 加扇区间隙，官方建议间隙只用于环形图。

放标签用 centroid：返回起止角中线与内外半径中点的坐标，不是几何质心，配 translate 把 text 挪过去。
-->

---

# 形状生成器：stack 与 curve 家族

```js
const series = d3.stack().keys(keys)(data); // 宽表 → 序列；每点 [y0, y1]
```

<v-clicks>

- **stack 同样只算数不画图**：序列带 `.key/.index`，配 area 画堆叠图
- **order** 排堆叠次序：InsideOut（大的在中间）等；**offset** 定基线：**Expand = 百分比堆叠**、**Diverging = 正负分离**、**Wiggle = streamgraph 标配**（官方推荐配 InsideOut）
- curve **过数据点**：Linear、Step、CatmullRom（alpha 0.5 通用首选）、**MonotoneX（时间序列最稳、防过冲）**
- curve **不过点**：Basis（仅过首尾）、Bundle（仅限 line、不能用于 area）
- Cardinal / CatmullRom 可能过冲造出「负值」；Closed 变体闭合成环（雷达图）

</v-clicks>

<!--
stack 把宽表或长表变成堆叠序列，同样只算数不画图：每个 key 得到一条序列，序列里每个点是 y0 到 y1 的区间，附带原数据，序列上有 key 和 index。长表要先用 d3.index 建嵌套 Map 再配 value 访问器。

两个配置轴：order 决定堆叠次序，默认按 keys 顺序，InsideOut 把大的放中间；offset 决定基线，None 是零基线，Expand 归一化到 0 到 1 就是百分比堆叠，Diverging 正上负下，Wiggle 最小化摆动是 streamgraph 标配，官方推荐配 InsideOut 一起用。

curve 家族按「过不过数据点」分类记：过点的有 Linear、Step 阶梯、CatmullRom 用 alpha 0.5 向心参数化防自交是通用首选，MonotoneX 保单调防过冲，时间序列折线最稳；不过点的有 Basis B 样条只过首尾、Bundle 只能用于 line。

选错 curve 的后果：Basis 不过数据点导致 tooltip 对不上；Cardinal 和 CatmullRom 可能过冲，在全正数据里插出负值。Closed 变体闭合成环，画雷达图用。
-->

---

# 层级布局 d3-hierarchy

```js
const root = d3.hierarchy(data).sum(d => d.value); // 布局前必须 sum！
d3.treemap().size([w, h]).padding(1)(root);        // 节点获得 x0/y0/x1/y1
```

| 布局 | 输出 |
|---|---|
| tree（tidy 算法）/ cluster（叶子等深） | 节点 `x/y` |
| treemap（tile 默认 Squarify，趋黄金比） | `x0/y0/x1/y1` |
| partition（冰柱图；转极坐标 = 旭日图） | `x0/y0/x1/y1` |
| pack（圆堆积） | `x/y/r` |

<v-clicks>

- `stratify()` 把扁平表变层级：要求**恰一个根、无环、id 唯一**，否则 throw
- `links()` 返回 source/target 数组画连线；遍历 each / eachBefore / eachAfter

</v-clicks>

<!--
层级数据两种构造方式：嵌套 JSON 用 d3.hierarchy，默认取 d.children；扁平表用 stratify 配 id 和 parentId，要求恰好一个根、无环、id 唯一，否则直接抛异常。

必考点：treemap、pack、partition 布局前必须先调 sum，后序遍历自底向上累加出每个节点的 value，忘了 sum 布局结果全是 NaN。计数场景用 count 数叶子。

各布局的输出要对应记：tree 用 Reingold-Tilford 紧凑算法输出 x y，把 x 当角度 y 当半径就是径向树；cluster 是系谱图，所有叶子等深；treemap 输出矩形四角坐标，切片算法默认 Squarify 趋近黄金比，动画场景用 Resquarify 保持拓扑稳定；partition 是冰柱图，转极坐标就是旭日图；pack 圆堆积输出圆心和半径。

tree 的 size 和 nodeSize 二选一，nodeSize 把根固定在原点。画连线用 links 方法返回 source target 对，遍历有 BFS 的 each、前序 eachBefore、后序 eachAfter。
-->

---

# 力导向 d3-force

```js
const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody())           // 默认 strength -30：排斥
    .force("center", d3.forceCenter(w / 2, h / 2))
    .on("tick", () => {                            // 每 tick 同步到 DOM
      node.attr("cx", d => d.x).attr("cy", d => d.y);
    });
```

<v-clicks>

- **仿真会改写传入数组**：node 被加上 `x/y/vx/vy`；link 的 source/target **初始化后替换为节点对象引用**
- **alpha 即「温度」**：从 1 衰减，低于 alphaMin（0.001）计时器停（默认约 300 tick）；`alphaTarget(0.3)` 可持续加热
- 静态布局：`simulation.stop()` + `tick(300)` 手动步进——**不派发 tick 事件**；大图放 Web Worker

</v-clicks>

<!--
力导向图是 D3 做网络图的招牌。forceSimulation 接节点数组，注册若干力，每 tick 回调里把算好的坐标同步到 DOM。

第一个必考点：仿真不纯，会改写传入的数组。节点被加上 index、x、y、vx、vy；link 的 source、target 可以初始是索引或 id 字符串，初始化后被替换成节点对象的引用，所以 tick 里能直接写 d.source.x。

第二个必考点是 alpha 机制：alpha 是温度，从 1 开始衰减，低于 alphaMin 默认 0.001 时计时器停止。每 tick 的流程：alpha 向 alphaTarget 衰减，衰减率约 0.0228，大约 300 tick 停；然后施力，速度乘上 1 减 velocityDecay 默认 0.4 的摩擦，位置加速度。alphaTarget 设成大于 alphaMin 的值可以让仿真持续加热不停机，拖拽时就靠它。

要静态布局就 stop 掉然后手动 tick 300 次，注意手动 tick 不派发事件，要自己取坐标；大图可以放 Web Worker 离线算。Canvas 拾取用 simulation.find 找最近节点。
-->

---

# 力的区分 + 拖拽三步范式

```js
d3.drag()
  .on("start", (e) => { simulation.alphaTarget(0.3).restart();  // ① 加热
    e.subject.fx = e.subject.x; e.subject.fy = e.subject.y; })  //   并钉住
  .on("drag",  (e) => { e.subject.fx = e.x; e.subject.fy = e.y; }) // ② 跟手
  .on("end",   (e) => { simulation.alphaTarget(0);              // ③ 降温
    e.subject.fx = null; e.subject.fy = null; });               //   解除固定
```

<v-clicks>

- **forceCenter 是整体平移**（质心归位、保持相对位置、不改速度）≠ **forceX/Y**（把每个节点弹性拉向目标，strength 0.1）
- forceManyBody：Barnes–Hut 四叉树近似 O(n log n)；`theta` 调精度、`distanceMax` 局部化提速
- forceCollide 圆碰撞防重叠；forceLink 默认 strength `1/min(count(s), count(t))` 自动弱化高连接度节点
- `fx/fy` 非空时每 tick 强制 x = fx、速度清零；置 null 解除

</v-clicks>

<!--
先区分容易混淆的三种定位力，必考：forceCenter 是把整体平移使质心到达指定点，不是弹力，保持相对位置也不改速度；forceX、forceY 才是把每个节点往目标位置拉的弹性力，默认强度 0.1；forceRadial 拉向圆环。

forceManyBody 是全局 n 体力，strength 负值排斥正值吸引，默认负 30；用 Barnes-Hut 四叉树近似把复杂度降到 n log n，theta 默认 0.9 权衡精度与性能，distanceMax 设有限值可以局部化加提速。forceCollide 做圆碰撞防重叠。forceLink 是弹簧力，默认 strength 是两端连接度较小值的倒数，自动弱化高连接度节点的边，更稳定。

拖拽结合仿真的三步范式要背下来：start 时 alphaTarget 0.3 加 restart 加热仿真，并把 fx、fy 设成当前坐标钉住节点；drag 时把 fx、fy 更新成鼠标位置；end 时 alphaTarget 归零、fx fy 置 null 解除固定。fx、fy 非空时每 tick 强制位置并清速度。忘了哪一步就出现拖不跟手或者松手僵死的 bug。
-->

---

# 过渡 d3-transition

```js
sel.transition()                  // 默认 250ms · easeCubic
   .delay((d, i) => i * 10)       // 错峰 stagger 标准惯用法
   .attr("cx", d => x(d.x));

// 饼图更新标准写法：attrTween 插值「数据」而非 path 字符串
path.transition().attrTween("d", function(d) {
  const i = d3.interpolate(this._current, d); this._current = i(0);
  return t => arc(i(t));
});
```

<v-clicks>

- 自动插值按目标值类型三分支：数字 / 颜色 / 字符串（抽出内嵌数字逐个插值）
- **同一元素上同名过渡互相取代**——「过渡被静默中断」坑的根源；不同 name 可并行
- `transition.end()` 返回 Promise；轴动画：`gx.transition().duration(750).call(axis)`

</v-clicks>

<!--
transition 的 API 镜像 selection，改的不是终值而是补间动画。默认时长 250 毫秒，缓动 easeCubic；delay 传函数按索引乘 10 毫秒做错峰 stagger 是标准惯用法。

自动插值规则必考，按目标值类型三分支：数字走 interpolateNumber；颜色或可转色的字符串走 interpolateRgb；其余字符串走 interpolateString，抽出里面的数字逐个插值。两端 path 结构不同时字符串插值会产生乱形，正确做法是 attrTween 在数据空间插值：把上一次的角度对象存在 this._current，每帧插值数据后重新调 arc 生成 path，这是饼图更新的标准写法。

生命周期是 schedule、start、每帧 tween、end。最大的坑：同一元素上同名过渡互相取代，新过渡 start 时中断旧的活动过渡、取消排队的，快速连续 hover 时动画消失就是这个原因；需要并行就用命名过渡分道，串行用 transition 链式接续。

transition.end 返回 Promise 可以 await 动画完成；exit 动画配 transition.remove，结束时删元素。
-->

---

# 缩放 d3-zoom：几何 vs 语义

```js
svg.call(d3.zoom()
    .scaleExtent([1, 8])          // 只约束交互，不约束显式 zoom.transform
    .on("zoom", (event) => {
      g.attr("transform", event.transform);  // ① 几何缩放：文字一起变粗
      gx.call(d3.axisBottom(event.transform.rescaleX(x))); // ② 语义缩放
    }));

svg.transition().call(zoom.transform, d3.zoomIdentity); // 程序化平滑归位
```

<v-clicks>

- transform 是 `{k, x, y}`：点变换 `x·k + tx`；`toString()` 可直接给 attr
- `rescaleX(x)` 返回**新 scale 不改原 scale**，拿去重绘轴与内容
- 读状态 `d3.zoomTransform(node)`；禁双击缩放 `.on("dblclick.zoom", null)`

</v-clicks>

<!--
zoom、drag、brush 三件套的共同范式：行为对象用 selection.call 安装，状态存在元素上，事件用 behavior.on 监听。

zoom 的 transform 是 k、x、y 三元组，点变换是坐标乘 k 加平移，toString 输出 translate 加 scale 可以直接给 attr。

应用 transform 有两条路线，必考：一是几何缩放，把 event.transform 直接设到 g 的 transform 上，内容整体缩放，文字和描边一起变粗；二是语义缩放，用 rescaleX 从原比例尺算出新比例尺，重绘坐标轴和内容，轴文字不变形。rescaleX 不改原 scale，返回副本。

约束项：scaleExtent 限缩放倍数、translateExtent 限平移边界，但注意 scaleExtent 只约束交互和便捷方法，不约束显式调用 zoom.transform。

程序化控制：selection.call zoom.transform 传 zoomIdentity 归位，在 transition 上调用就是平滑动画，内部走 interpolateZoom 飞行路径。读当前状态用 d3.zoomTransform 传节点。禁双击缩放的惯用法是把 dblclick.zoom 命名空间监听置 null。
-->

---

# 刷选 d3-brush（+ drag 要点）

```js
const brush = d3.brushX()                         // 一维；d3.brush() 二维
    .extent([[margin.left, margin.top], [w, h]])  // 可刷范围
    .on("end", (event) => {
      if (!event.selection) return;               // 点空白清空 → null 必判！
      const [d0, d1] = event.selection.map(x.invert); // 像素 → 数据域
    });
svg.append("g").call(brush);                      // 必须 call 在 g 上
```

<v-clicks>

- **`event.selection` 是像素坐标**：brushX 为 `[x0, x1]`、二维为两点数组、**null = 清空**
- 转数据域必须过 `scale.invert`；程序化 `g.call(brush.move, range)` 可配 transition
- 防反馈循环惯用法：`if (!event.sourceEvent) return;`
- drag 补充：`subject()` 决定被拖对象（默认 datum）；`clickDistance(n)` 区分拖拽与点击

</v-clicks>

<!--
brush 做范围选择：brush 是二维，brushX、brushY 是一维，必须 call 在 g 元素上。extent 设可刷范围，默认取 SVG 的 viewBox 或宽高。

事件有 start、brush、end 三种。event.selection 的语义必考：它是像素坐标，一维是 x0 x1 数组，二维是两个点；点击空白清空刷选时它是 null，回调里不判空直接 map invert 就崩，这是最常见的坑。转数据域必须过 scale.invert。

程序化移动用 brush.move，可以配 transition 做动画；清空用 brush.clear；读状态用 d3.brushSelection 传 g 节点。程序化触发也会走事件回调，防反馈循环的惯用法是 sourceEvent 为空直接 return。

drag 再补两点：subject 决定被拖的对象，默认返回 datum，Canvas 或 force 场景用 simulation.find 或 quadtree.find 找最近点；clickDistance 设阈值区分拖拽和点击。三件套都有 filter 过滤输入，默认忽略右键。
-->

---

# 数据处理 d3-array

```js
d3.extent(data, d => d.v);              // [min, max]：喂 domain 的标配
d3.group(data, d => d.species);         // → InternMap（键可为 Date 对象）
d3.rollup(data, D => D.length, d => d.species); // 分组 + 聚合（计数）
d3.index(data, d => d.date);            // 键唯一，否则 throw

// 折线 tooltip 标准三件套：pointer → invert → bisector.center
const i = d3.bisector(d => d.date)
    .center(data, x.invert(d3.pointer(event)[0])); // 最近点索引
```

<v-clicks>

- 统计函数（min/max/mean/median/quantile…）**均忽略 null/undefined/NaN**；`least/greatest` 返回**元素本身**
- v6 起 `group/rollup` 取代 `d3.nest`；`groupSort` 返回按聚合值排序的 key（排类目轴利器）

</v-clicks>

<!--
d3-array 是数据整形的瑞士军刀。extent 返回最小最大值二元组，直接喂给 domain 是标配。统计函数 min、max、mean、median、quantile 这些都自动忽略 null、undefined、NaN；注意 min max 不做数字强转，字符串按字典序比。least、greatest 返回的是元素本身而不是值，minIndex、maxIndex 返回索引。

分组三件套是 v6 取代 d3.nest 的现代方案：group 分组返回 InternMap，键可以是 Date 这种对象；rollup 分组加聚合，传 reduce 函数，最常见的是数组长度做计数；index 要求键唯一否则抛异常。都支持多级 key 嵌套。groups、rollups 返回数组形态；groupSort 返回按组内聚合值排好序的 key 数组，是排序类目轴的利器。

折线图 hover 提示的标准三件套要背：d3.pointer 拿鼠标相对坐标，x.invert 反算成数据值，bisector.center 在有序数组里二分出最近点的索引。bisectLeft 和 bisectRight 的区别在等值时落哪边。
-->

---

# 加载与解析 d3-fetch / autoType

```js
const raw = await d3.csv(url);      // 解析出的所有值都是字符串！
raw.columns;                        // 附 columns 属性，保序列名

await d3.csv(url, d => ({ date: new Date(d.date), value: +d.value }));
await d3.csv(url, d3.autoType);     // 或用自动转型（属 d3-dsv 模块）

d3.timeParse("%Y-%m-%d")("2024-01-02"); // 字符串 → Date；失败返回 null
d3.timeFormat("%b %d")(new Date());     // Date → 字符串
```

<v-clicks>

- autoType 规则：空串→null、"true"→布尔、数字串→number、ISO 日期→Date——**纯日期按 UTC 午夜解析**（本地时区差一天的坑）
- d3-fetch 全部返回 Promise：csv / tsv / dsv / json / text / xml / image…
- 数值格式化 `d3.format(".2s")(4200)` 得 "4.2k"；轴上直通 `ticks(10, "s")`

</v-clicks>

<!--
d3-fetch 是 v5 取代 d3-request 的加载模块，全部返回 Promise，await 使用。

最大的坑：d3.csv 解析出的所有值都是字符串，"9" 和 "10" 按字典序比较、喂给 scale 的 domain 直接 NaN。解法是第二参数传行转换函数，手写 new Date 加一元加号转数字，或者直接传 d3.autoType 自动转型。

autoType 属于 d3-dsv 模块，规则：空串变 null，true false 变布尔，NaN 字符串变 NaN，可转数字的变 number，ISO 8601 日期串变 Date。注意纯日期按 UTC 午夜解析，带时间不带时区按本地时间，和本地时区差一天的问题就出在这。含逗号或单位的比如美元、像素值保持字符串。返回的数组带 columns 属性保留列名顺序。d3.json 遇到 204、205 返回 undefined。

时间解析走 d3-time-format：timeParse 严格匹配，失败返回 null 而不是 Invalid Date；timeFormat 反向输出。高频符号大写 Y 四位年、m 月、d 日、H 二十四小时制。数值格式化用 d3.format，".2s" 输出 4.2k 这种 SI 后缀，轴上可以 ticks 直通。
-->

---

# 框架集成：两种模式

```jsx
// 模式 1（推荐默认）：D3 算数据、框架渲染 DOM —— 只用纯计算模块
<path fill="none" stroke="steelblue" d={line(data)} />

// 模式 2：axis / transition / zoom 等 DOM 行为 → 让渡 ref 给 D3
useEffect(() => {
  d3.select(gx.current).call(d3.axisBottom(x)); // Vue：onMounted + ref
}, [x]);
```

<v-clicks>

- 模式 1 享受框架声明式与虚拟 DOM diff，**避免两套 DOM 所有权打架**；动画交互需自己补（CSS/framer-motion）
- 模式 2 把某个 `g` 的所有权**完整让渡**给 D3；绕过框架 diff，**卸载时要清理**（移除监听、stop 仿真）
- 混合路线（现代主流）：**「用 D3 的数学，不用 D3 的 DOM」**——图表库之外单独引 scale/array/time-format

</v-clicks>

<!--
D3 和 React、Vue 都想拥有 DOM，处理不好就打架。官方 getting-started 原生给出 React 示例，总结成两种模式。

模式 1 是推荐默认：D3 只算数据，框架渲染 DOM。只用 scale、shape、array 这些纯计算模块，JSX 或 template 直接渲染 path 的 d 属性、map 出 circle 列表。好处是完整享受框架的声明式和虚拟 DOM diff；代价是过渡动画和交互行为要自己补，用 CSS 或 framer-motion。

模式 2 用在需要 axis、transition、zoom、brush 这些强依赖 DOM 行为的场合：通过 ref 把某个 g 元素的所有权完整让渡给 D3，React 在 useEffect 里 select 加 call，Vue 对应 onMounted 加 ref 或 watchEffect。注意它绕过了框架 diff，组件卸载时要自己清理：移除监听、停掉仿真。

现代主流其实是混合路线：即便选了 ECharts 或 Recharts，也常单独引入 d3-scale、d3-array、d3-time-format 做数据处理——用 D3 的数学，不用 D3 的 DOM。
-->

---

# Canvas 大数据路线

```js
const line = d3.line().x(d => xs(d.x)).y(d => ys(d.y)).context(ctx);
ctx.beginPath(); line(data); ctx.stroke(); // 生成器直接画 Canvas，返回 void

simulation.find(mx, my, 20);               // Canvas 拾取：找最近节点
```

<v-clicks>

- **SVG 千级元素顺滑、万级卡顿**——DOM 节点数是主要瓶颈
- 1 万+ 元素走 Canvas：force 图在每 tick **全量重绘**
- 拾取方案：`simulation.find` / quadtree / 隐藏色彩缓冲（hit-canvas）
- `d3.create("svg")` 游离构建再挂载；detached 元素可把 data join 当**纯状态机**（记录 enter/exit 后手动画 Canvas）
- 服务端 / Worker 里配 JSDOM 也能跑 selection

</v-clicks>

<!--
性能路线的分界线：SVG 在千级元素还顺滑，到万级就卡顿，主要瓶颈是 DOM 节点数量。超过一万个元素就该考虑 Canvas。

切换成本不高：所有 shape 生成器都有 context 方法，传入 Canvas 2D 上下文后调用生成器直接绘制、返回 void，不再生成 path 字符串。力导向图在每个 tick 里清屏全量重绘。

Canvas 没有 DOM 事件，拾取有三种方案：force 场景用 simulation.find 找鼠标最近的节点；通用场景用 quadtree；复杂形状用隐藏的色彩缓冲，也就是 hit-canvas 颜色哈希。

还有一组游离 DOM 技巧：d3.create 创建 detached 的 SVG 构建完再挂载；甚至可以 select 一个 detached 的自定义元素，把 data join 纯当状态机用，让它记录 enter、exit 差异，再手动画到 Canvas 上。服务端或 Worker 里配 JSDOM 也能跑 selection。
-->

---

# 易错点雷达

<v-clicks>

- **y 轴忘反转 range** → 图倒挂；area 忘设 y0 → 面积图倒挂（默认 0 = SVG 顶部）
- **selectAll 误选已有同名元素**（如轴里的 rect）→ enter 错乱；给数据元素专属 class：`rect.bar`
- **csv 不转型**：`"9" > "10"` 字典序比较；autoType 纯日期按 UTC，差一天
- **同名 transition 互掐**（快速 hover 动画消失）→ 链式接续或命名过渡分道
- **pie 默认值降序**排扇区，图例对不上 → `sort(null)`
- **v6 还写 `d3.event`** 直接崩 → 一律 `(event, d)`；要 `this` 用 `function`
- **hierarchy 忘 `sum()`** → 布局全 NaN；**force 手动 `tick()` 不派发事件**
- **拖完僵死** = end 忘清 fx/fy；**拖不跟手** = start 忘 `restart()`

</v-clicks>

<!--
把散落各页的坑集中过一遍。

第一组是坐标系：y 轴 range 必须反着写，height 减 bottom 到 top，否则大值在下图倒挂；area 的 y0 默认是 0 而 SVG 的 0 在顶部，同一个根源。

第二组是选择集：selectAll rect 会把坐标轴里的 rect 也选进来，导致数量对不上、enter 错乱，防御写法是给数据元素专属 class 再用 rect.bar 这种复合选择器。

第三组是数据：csv 出来全是字符串，9 比 10 大就是字典序害的；autoType 纯日期按 UTC 午夜解析，和本地时区差一天。

第四组是动画与交互：同名 transition 互掐是快速 hover 动画消失的根源；pie 默认按值降序，图例对不上号要 sort null；v6 之后还写 d3.event 直接崩；hierarchy 忘 sum 布局全 NaN；force 手动 tick 不派发事件；拖拽收尾忘清 fx fy 节点僵死，开头忘 restart 拖不跟手。

还有一个：log scale 的 domain 不能含零或跨零，跨零用 symlog。
-->

---

# 选型与总结

| 维度 | D3 | ECharts | Recharts |
|---|---|---|---|
| 抽象层级 | 低层工具集 | 高层配置式 | 中层 React 组件 |
| 上手成本 | 高（50+ 行/图） | 低（一个 option） | 低-中 |
| 典型场景 | 新闻级定制、力导向、创新图型 | 中后台仪表板、大屏 | React 常规图表 |

<v-clicks>

- **该用 D3**：图表库「没有现货」的视觉形式、要 enter/exit 级动画控制、**图本身是产品核心**
- **不该用**：内部仪表板、一次性分析——官方直言 overkill，推荐姊妹库 **Observable Plot**
- 混合主流：**「用 D3 的数学，不用 D3 的 DOM」**——Recharts / Nivo / Plot 本就构建在 D3 模块之上
- 核心带走：**data join 三态** + scale 映射 + 「只算数」模块与框架/Canvas 自由组合 · v7.9 · d3js.org

</v-clicks>

<!--
最后选型与总结。

对比：D3 是低层工具集，定制自由度无上限，但一张图 50 行起步还得懂 SVG；ECharts 高层配置式，一个 option 出图，适合中后台仪表板和大屏；Recharts 是 React 组件式，适合 React 项目常规图表，Visx 例外，它本质是 React 版 D3 壳。

什么时候该用 D3：需要的视觉形式在图表库里没有现货；需要 enter、update、exit 级的动画控制；图本身是产品核心，一图服务百万读者。什么时候不该用：内部仪表板、一次性分析，官方原话 overkill，推荐姊妹高层库 Observable Plot，同一个直方图 D3 约 50 行、Plot 一行。

即便不用 D3 画图，混合路线也是现代主流：单独引 d3-scale、d3-array、d3-time-format 做数据处理，用 D3 的数学不用 D3 的 DOM。Recharts、Nivo、Plot 都构建在 D3 模块之上，学 D3 等于理解整个生态的底层。

核心带走三件事：data join 三态模型、scale 的 domain 到 range 映射、以及「纯计算模块」可与框架和 Canvas 自由组合。当前版本 7.9，文档在 d3js.org。谢谢大家。
-->
