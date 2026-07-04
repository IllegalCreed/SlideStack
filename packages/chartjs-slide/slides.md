---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Chart.js
info: |
  Presentation Chart.js — the simple yet flexible JavaScript charting library.

  Learn more at [https://www.chartjs.org](https://www.chartjs.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📊</span>
</div>

<br/>

## Chart.js — 简单灵活的 Canvas 图表库

最流行的开源 JavaScript 图表库：HTML5 Canvas 渲染、8 种内置图表类型、合理默认值开箱即用、可 tree-shaking。当前版本 4.5.x

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/chartjs/Chart.js" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Chart.js —— 最流行的开源 JavaScript 图表库，约 6 万 star、周下载 240 万。

一句话定位：HTML5 Canvas 渲染、8 种内置图表类型、合理默认值开箱即用、默认带动画、可 tree-shaking、TypeScript 类型内置，走「简单常用图表快速出活」路线。npm 最新版 4.5.1，注意它是 ESM-only 包，type 是 module。

顺序：选型 → 上手 → 注册 → 数据结构 → parsing → options → 响应式 → 坐标轴 → 交互 → tooltip → legend → 图表类型 → 插件 → 实例 API → 性能 → 易错点 → 总结。
-->

---

# 为什么选 Chart.js？

| 维度 | Chart.js | ECharts | D3 |
|---|---|---|---|
| 渲染 | Canvas | Canvas/SVG 双引擎 | 任意（常 SVG），绘图原语 |
| 类型 | 8 内置 + 插件/自定义 | 20+（地图/桑基/3D 生态） | 无上限（全手写） |
| 上手 | 一个 config 即出图 | option 大而全，学习面广 | 陡峭 |
| 体量 | 核心小 + tree-shaking | 全量大 | 模块化 |
| 适用 | 管理后台/常规仪表盘 | 大屏/地理/复杂交互 | 非标创意可视化 |

<div v-click class="mt-4 text-sm">

> 要快要轻选 **Chart.js**；要全要炫（地图/大屏/关系图）选 ECharts；非标定制选 D3。Canvas 对大数据集优于 SVG 方案（DOM 节点不随数据涨），但 Canvas 内元素无 DOM 可访问性。

</div>

<!--
先回答选型。Chart.js 不追求 ECharts 的大而全，也不像 D3 提供底层绘图原语，胜在上手 5 分钟、默认好看、包体可裁剪：配套 scriptable options、插件钩子、自定义 controller 三级扩展体系，中等复杂度需求都能覆盖。

Canvas 渲染对大数据集比 SVG 方案更高效，因为 DOM 节点数不随数据增长；代价是 Canvas 内部没有 DOM，无障碍要自己补 role 和 aria-label。

短板：图表类型少，桑基、关系图这类要靠社区插件；复杂联动要自己写。React 生态另有 Recharts；vue-chartjs、react-chartjs-2 只是 Chart.js 的薄封装，本体框架无关。
-->

---

# 上手：一个 config 出图

```js
// <div><canvas id="myChart"></canvas></div> ← canvas 外裹专属容器
new Chart(document.getElementById('myChart'), {
  type: 'bar',                                       // 图表类型
  data: {                                            // labels + datasets
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [{ label: '# of Votes', data: [12, 19, 3] }]
  },
  options: { scales: { y: { beginAtZero: true } } }  // 配置
});
```

<v-clicks>

- config 恒为 `{ type, data, options }` 三件套
- 第一参数三种合法形式：canvas 元素 / 2d context / canvas id 字符串
- 安装：`npm install chart.js`；script 标签 / CDN 场景全量内置、无需注册

</v-clicks>

<!--
上手只要一个 config 对象，恒为 type、data、options 三件套：type 定图表类型，data 装 labels 和 datasets，options 放所有配置。这一页是官方 quick-start 原样。

第一参数可以传 canvas 元素、2d context，或 canvas 的 id 字符串。官方建议 canvas 外包一层专属 div 容器，这是响应式必需，后面响应式一页细说。

安装走 npm install chart.js；CDN 用 jsDelivr，生产环境建议锁版本并加 SRI 完整性校验，防 CDN 被篡改；GitHub 不再提供预构建产物。script 标签场景全量内置，不需要注册组件。beginAtZero 是 y 轴最常见的第一个配置，强制从 0 开始。
-->

---

# 注册机制与 tree-shaking

```js
// 路线 A：全量自动注册（快速上手，包体大）—— default import
import Chart from 'chart.js/auto';

// 路线 B：按需注册（生产推荐，官方实测省约 56 KB / -25%）
import { Chart, BarController, BarElement,
         CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(BarController, BarElement,
               CategoryScale, LinearScale, Tooltip, Legend);

// 等价 auto 的显式写法：Chart.register(...registerables)
```

<div v-click class="mt-3 text-sm">

> v3+ 全组件化：controller / element / scale / plugin **用什么注册什么**。bar 图最少要 BarController + BarElement + CategoryScale + LinearScale；漏注册报 `"category" is not a registered scale`。

</div>

<!--
v3 起 Chart.js 可 tree-shaking：控制器、元素、坐标轴、插件全部组件化，用什么注册什么。

两条路线。路线 A 从 chart.js/auto 做 default import，全量自动注册，快速上手但包体大。路线 B 从 chart.js 主入口做 named import，再 Chart.register 按需注册，官方 Step-by-step guide 实测比 auto 省约 56 KB，示例应用约减 25%。还有个折中：import registerables 一把梭注册全部，是 auto 的显式等价写法。

各图表所需组件要记典型：bar 要 BarController、BarElement、CategoryScale、LinearScale；line 要 LineController、LineElement、PointElement 加两个 scale；pie 和 doughnut 只要对应 Controller 加 ArcElement，不需要 scale。漏注册的报错很有辨识度：某某 is not a registered scale 或 controller。
-->

---

# 数据结构：dataset.data 四种格式

```js
data: [20, 10]                          // ① primitive 数组，配 labels 按索引对齐
data: [[10, 20], [15, null]]            // ② [x, y] 元组
data: [{ x: 10, y: 20 }]                // ③ 对象数组（scatter/bubble 标配，bubble 加 r）
data: { January: 10, February: 20 }     // ④ 键值对对象（键作索引）
```

<v-clicks>

- `data = { labels?, datasets: [...] }`；labels 服务于**索引轴**（category 轴）
- dataset 通用属性：`label`（图例/tooltip 文案）/ `order` / `stack` / `hidden` / `clip`
- `null` 表示跳过的点：line 图断线，配 `spanGaps` 连接
- labels 长度须匹配最大 dataset 长度，短了尾部点无标签

</v-clicks>

<!--
data 恒为 labels 加 datasets。labels 服务于索引轴，也就是 category 轴。

dataset.data 支持四种格式：一是 primitive 数组，配 labels 按索引对齐，最常见；二是 x y 元组数组；三是对象数组，scatter 和 bubble 的标配，bubble 再加 r；四是键值对对象，键直接作索引。对象数组里的 x 还可以是日期字符串，配 time 轴用。

几个通用属性：label 是图例和 tooltip 里的系列文案；order 是绘制权重；stack 做堆叠分组；hidden、clip 控制显隐和裁剪。

两个细节：null 表示跳过的点，line 图会在那里断线，想连上配 spanGaps；labels 长度要匹配最大的 dataset 长度，短了尾部点就没标签。
-->

---

# parsing：字段映射与关闭解析

```js
// 对象数组配非 x/y 属性名：parsing 映射字段（支持点号嵌套路径）
data: { datasets: [{ data: [
  { id: 'Sales', nested: { value: 1500 } },
  { id: 'Purchases', nested: { value: 500 } }
] }] },
options: { parsing: { xAxisKey: 'id', yAxisKey: 'nested.value' } }
```

<v-clicks>

- pie/doughnut/radar 单值类用 `parsing: { key: 'nested.value' }`
- 属性名本身含点号：写成 `'data\\.key'` 转义
- `parsing: false`（chart 或 dataset 级）跳过解析：数据必须**已排序且符合内部格式**——大数据性能路线

</v-clicks>

<!--
真实业务数据往往不叫 x 和 y。对象数组配 parsing 就能直接喂原始结构：xAxisKey、yAxisKey 指定字段名，支持点号嵌套路径，比如 nested.value。

pie、doughnut、radar 这类单值图表用 key 而不是 xAxisKey、yAxisKey。属性名本身含点号时用双反斜杠转义。

反方向的用法是 parsing false：完全跳过解析，chart 级或 dataset 级都能设。代价是数据必须已排序、且符合各 scale 的内部格式，比如 category 轴的内部格式是整数索引。这是大数据量的性能路线，后面性能页的 decimation 也依赖它。
-->

---

# options：scriptable 与 indexable

```js
// Scriptable：绝大多数样式项可给函数，按上下文动态求值
backgroundColor: (ctx) => {
  const v = ctx.dataset.data[ctx.dataIndex];
  return v < 0 ? 'red' : 'green';           // 负值红、正值绿
},
// Indexable：给数组按数据索引循环取用（pie 每扇区一色即此机制）
borderColor: ['red', 'blue', 'green']
```

<v-clicks>

- 解析优先级（高 → 低）：`options` → `overrides[type]` → `Chart.defaults`（全局）
- 改全局默认：`Chart.defaults.font.size = 16`、`Chart.defaults.backgroundColor = '#9BD0F5'`
- scriptable 签名 `(context, options)`；context 按调用位置分 7 类，通用函数应判 `context.type`

</v-clicks>

<!--
options 体系两大招牌。

Scriptable options：绝大多数样式项可以直接给函数，按上下文动态求值。比如 backgroundColor 给函数，从 ctx.dataset.data 取当前值，负值红正值绿，一行搞定条件着色。context 按调用位置分七类：chart、dataset、data、scale、tick、pointLabel、tooltip，各自带不同字段，比如 data 级有 dataIndex、parsed、raw；写通用函数要判断 context.type。

Indexable options：样式项给数组，按数据索引循环取用，pie 每个扇区一种颜色就是这个机制。

解析优先级从高到低：实例 options、overrides 按图表类型的默认、Chart.defaults 全局默认。改全局就直接赋值 Chart.defaults，比如统一字号 16。
-->

---

# 响应式与容器坑

```html
<!-- 容器三要素：相对定位 + 专属（只放这一个 canvas）+ 宽高设在容器上 -->
<div class="chart-container" style="position: relative; height:40vh; width:80vw">
  <canvas id="chart"></canvas>
</div>
```

| 选项 | 默认 | 含义 |
|---|---|---|
| `responsive` | `true` | 跟随**容器**尺寸变化重绘 |
| `maintainAspectRatio` | `true` | resize 时锁定宽高比 |
| `aspectRatio` | `2`（radial 类为 `1`） | 宽/高比 |

<div v-click class="mt-3 text-sm">

> canvas 的 render size 不能用相对单位、自身尺寸变化无法侦测——Chart.js **监听的是父容器**。JS 手改容器高度须先 `maintainAspectRatio: false`。

</div>

<!--
响应式默认开启，但机制要懂：canvas 的 render size，也就是 width、height 属性，不能用相对单位；而且 canvas 自身尺寸变化没法直接侦测，所以 Chart.js 监听的是父容器。

容器三要素：相对定位、专属（这个 div 里只放这一个 canvas）、宽高设在容器上而不是 canvas 上。少一条就可能出现高度塌陷或无限增高。

想用 JS 手动改容器高度，必须先把 maintainAspectRatio 关掉，否则宽高比锁死不生效。另外两个补充：打印场景 resize 事件不触发，要挂 onbeforeprint 遍历 Chart.instances 手动 resize；responsive 设 false 时用 chart.resize 手动控制尺寸。还有 onResize 回调和 resizeDelay 防抖可用。
-->

---

# 坐标轴：对象式 scales 与双 y 轴

```js
options: {
  scales: {                        // v3+：以轴 id 为键的对象（v2 xAxes/yAxes 数组已废弃）
    x: { type: 'time', time: { unit: 'day' } },
    y: { position: 'left' },
    y1: {                          // 双 y 轴：自定义轴 id
      position: 'right',
      grid: { drawOnChartArea: false }   // 右轴不画网格，避免与左轴重叠
    }
  }
}
// dataset 关联：{ yAxisID: 'y1' }（另有 xAxisID / rAxisID）
```

<v-clicks>

- 轴 id **首字母**推断方向（`x*` / `y*` / `r*`），建议显式给 `axis` / `position`
- 堆叠：`x.stacked` + `y.stacked` 都 `true` 得堆叠柱；只设 y 得堆叠面积图

</v-clicks>

<!--
v2 到 v3 最大的破坏性变更就在这里：scales 从 xAxes、yAxes 数组改成了以轴 id 为键的对象。老代码带数组写法的直接失效。

轴 id 靠首字母推断方向：x 开头横轴、y 开头纵轴、r 开头径向，建议显式写 axis 和 position 不靠猜。

双 y 轴：再定义一个自定义 id 的轴，比如 y1 放右边，dataset 用 yAxisID 关联到它；右轴通常关掉 drawOnChartArea，避免两套网格线重叠。

堆叠图规则：x 和 y 都设 stacked true 得堆叠柱状图；只设 y.stacked 得堆叠面积图；stack 值相同的 dataset 堆同一栈。
-->

---

# 轴类型速览与 time adapter

| 类型 | 用途 |
|---|---|
| `category` | labels 索引（line/bar 默认索引轴） |
| `linear` | 数值轴（scatter 的 x 默认） |
| `logarithmic` | 跨数量级数据；0/负数无法落在对数刻度 |
| `time` / `timeseries` | 真实时间距离 / 数据点**等距**排布（K 线场景） |
| `radialLinear` | radar / polarArea 的 `scales.r` |

```js
import 'chartjs-adapter-date-fns';  // time 轴必须装 date 适配器（-luxon/-moment/-dayjs 均可）
x: { type: 'time', time: { unit: 'day', tooltipFormat: 'MMM d' } }
```

<div v-click class="mt-3 text-sm">

> 裸用 `type: 'time'` 直接报错：time scale 要求 date library + 对应 adapter——v3 起 moment 不再捆绑。

</div>

<!--
笛卡尔轴五类：category 按 labels 索引，是 line、bar 的默认索引轴；linear 数值轴，scatter 的 x 默认就是它；logarithmic 适合跨数量级数据，注意 0 和负数在实数域没有对数，落不到对数刻度上；time 按真实时间距离排布；timeseries 让数据点等距，股票 K 线这类场景用它。径向的 radialLinear 服务 radar 和 polarArea 的 scales.r。

time 轴有个必踩的坑：必须额外装 date 适配器，chartjs-adapter-date-fns、luxon、moment、dayjs 社区版任选其一，v3 起 moment 不再捆绑。不装直接报错：The time scale requires both a date library and a corresponding adapter。

time 配置常用 unit、minUnit、displayFormats、tooltipFormat；ticks.source 可选 auto、data、labels。
-->

---

# 范围与刻度：min/max、ticks

```js
scales: { y: {
  min: 0, max: 100,          // 硬边界：覆盖数据算出的范围，超出的数据被裁掉
  // suggestedMin/suggestedMax：软建议，数据超过时轴仍会扩展
  ticks: {
    callback: (value) => value + ' 万',  // 自定义刻度文案；返回 null 隐藏该刻度
    stepSize: 20             // 固定步长；另有 count / precision / format
  }
}}
```

<v-clicks>

- `beginAtZero` 强制范围含 0；`grace: '5%'` 上下各留 5% 呼吸空间
- category 轴 callback 里 value 是**索引**：用 `this.getLabelForValue(value)` 取标签
- `autoSkip`（默认 `true`）空间不足自动抽稀；`maxRotation` / `sampleSize` 控旋转与测量

</v-clicks>

<!--
范围控制两组 API，语义完全不同。min、max 是硬边界，直接覆盖数据算出的范围，超出的数据被裁掉不显示。suggestedMin、suggestedMax 只是参与自动范围计算的建议值，数据超过时轴仍会扩展。把 suggestedMax 当 max 用，会觉得「没生效」，这是高频误会。

辅助两个：beginAtZero 强制范围含 0；grace 百分比给上下留呼吸空间。

刻度定制走 ticks.callback，签名 value、index、ticks，返回加工后的文案，返回 null 或 undefined 隐藏该刻度。注意 category 轴里 value 是索引不是标签，要用 this.getLabelForValue 换回标签。

密度控制：autoSkip 默认开启，空间不足自动抽稀；stepSize 固定步长、count 固定个数；maxRotation 控旋转；sampleSize 只测量子集加速。
-->

---

# 交互：interaction 六种 mode

| mode | 行为 |
|---|---|
| `point` | 与指针相交的**所有**元素 |
| `nearest` | 距指针最近的元素（默认） |
| `index` | 同一索引的所有 dataset 元素（多系列对齐提示标配） |
| `dataset` | 命中元素所在的整个 dataset |
| `x` / `y` | 仅按 x（或 y）坐标相交（做垂直/水平游标） |

<div v-click class="mt-3 text-sm">

> `intersect: true`（默认）须指针与图形相交才触发；多系列折线标配 `{ mode: 'index', intersect: false }`。`options.interaction` 是 hover 与 tooltip 的**共同基线**，两者可分别覆盖；v3 起折线默认交互由 index 改为 nearest。

</div>

<!--
交互配置集中在 options.interaction：mode 定命中策略，intersect 定是否必须相交，axis 定距离计算方向。

六种 mode：point 取与指针相交的所有元素；nearest 取最近的，是默认值，intersect 为 false 时不相交也取最近；index 取同一索引的所有 dataset 元素，多系列对齐提示的标配；dataset 取命中元素所在的整个系列；x 和 y 只按单方向坐标相交，适合做垂直或水平游标。

最常用组合背下来：mode index 加 intersect false，多系列折线图 tooltip 的标准配置，鼠标不用精确压线就能出全系列提示。

继承链要清楚：options.interaction 是 hover 和 tooltip 的共同基线，options.hover 和 options.plugins.tooltip 可以分别覆盖。v3 起折线默认交互从 v2 的 index 改成了 nearest。
-->

---

# 事件处理与命中检测

```js
options: {
  onClick(e, activeEls, chart) {        // onHover 同签名
    const hits = chart.getElementsAtEventForMode(
      e, 'nearest', { intersect: true }, true
    );                                  // 命中：[{ datasetIndex, index, element }]
    if (hits.length) {
      const { datasetIndex, index } = hits[0];
      console.log(chart.data.datasets[datasetIndex].data[index]);
    }
  }
}
```

<div v-click class="mt-3 text-sm">

> 像素 → 数值：`getRelativePosition(e, chart)`（`chart.js/helpers`）+ `chart.scales.x.getValueForPixel(pos.x)`；`events` 数组可裁剪要监听的事件类型。

</div>

<!--
事件处理两个入口：onClick 和 onHover，签名相同，收事件、命中元素数组、chart 实例。

命中检测用 getElementsAtEventForMode，四个参数：原生事件、mode（复用 interaction 那六种）、选项对象、useFinalPosition。返回数组，每项含 datasetIndex、index、element，再回查 chart.data 就能拿到业务数据。

另一个常见需求是把点击位置换算成轴上的数值，比如点空白处加标注：用 helpers 里的 getRelativePosition 拿相对坐标，再用 chart.scales.x.getValueForPixel 换算成数值，y 轴同理。

events 默认监听 mousemove、mouseout、click、touchstart、touchmove 五种，可以裁剪；插件还能用 options.plugins 下自己的 events 单独定制。
-->

---

# Tooltip 定制

```js
plugins: { tooltip: {              // v3 起从 options 根移入 plugins
  callbacks: {
    label: (ctx) => {
      const name = ctx.dataset.label ? ctx.dataset.label + ': ' : '';
      return name + new Intl.NumberFormat('zh-CN',
        { style: 'currency', currency: 'CNY' }).format(ctx.parsed.y);
    }
  }
}}
```

<v-clicks>

- callbacks 全家桶：`title` / `label` / `footer` + before/after 系列，返回 string / string[]
- TooltipItem：`parsed`（解析后）/ `raw`（原始）/ `formattedValue` / `dataIndex`
- 完全自定义样式：`enabled: false` + `external(context)` 自建 DOM（`tooltip.opacity` 为 0 即隐藏）

</v-clicks>

<!--
tooltip 的命名空间是 options.plugins.tooltip，v3 起从 options 根移进 plugins，老代码的 options.tooltips 复数写法失效。

格式化走 callbacks 全家桶：title、label、footer，以及各自的 before、after 系列，返回 string 或 string 数组，数组即多行。最常用的 label 回调收单个 TooltipItem，关键字段：parsed 是解析后的数值（取 parsed.y），raw 是原始数据，formattedValue 是默认格式化结果，还有 dataset、datasetIndex、dataIndex。这个例子拼上系列名再用 Intl.NumberFormat 格式化成货币。

内置 tooltip 画在 canvas 里，样式定制有限。想完全自定义就走 external HTML tooltip：enabled false 关掉内置，external 函数收 context，从 context.tooltip 取 opacity（0 表示该隐藏）、title、body、labelColors、caretX、caretY，自建 DOM 定位。mode 和 intersect 默认继承 interaction。
-->

---

# Legend 与 Title

```js
plugins: {
  legend: { position: 'bottom', labels: { usePointStyle: true } },
  title: { display: true, text: ['主标题', '第二行'] }   // text 数组 = 多行
}
```

<v-clicks>

- legend `position`：top / left / bottom / right / chartArea；`labels.generateLabels` 完全自定义图例项
- **onClick 默认行为**：普通图表 toggle 整个 dataset；pie/doughnut/polarArea toggle **单条数据**（图例项来自 labels）
- title `display` 默认 `false`；subtitle 选项与 title 完全一致（`plugins.subtitle`）
- **Colors 插件**（v4 内置）自动循环 7 种品牌色：`Chart.register(Colors)`

</v-clicks>

<!--
legend 和 title 都在 plugins 命名空间下。

legend 的 position 五个值，chartArea 是画进图表区内。labels.usePointStyle 让图例标记跟随点样式；filter、sort 筛选排序；generateLabels 完全自定义图例项，是做 HTML 自定义图例的基础，配 setDatasetVisibility 联动。

必考区别：图例点击的默认行为。普通图表 toggle 整个 dataset，内部调 chart 的 hide、show；但 pie、doughnut、polarArea 的图例项来自 labels 而不是 datasets，点击 toggle 的是单条数据，内部是 toggleDataVisibility。onClick、onHover、onLeave 签名统一收 event、legendItem、legend。

title 的 display 默认 false 要手动开；text 传数组就是多行；subtitle 与 title 选项完全一致。v4 还内置了 Colors 插件，自动循环 7 种品牌色给 dataset 配色，按需注册要手动 register，UMD 版默认启用，动态数据集配 forceOverride。
-->

---

# 八种内置图表类型

| type | 要点 |
|---|---|
| `line` | `tension: 0` 默认直线；`spanGaps` 跨 null；`fill` 即面积图 |
| `bar` | `indexAxis: 'y'` 即水平条形；浮动条 `[start, end]` |
| `pie` / `doughnut` | 唯一区别 `cutout`：`0` vs `'50%'`；半环仪表盘靠 rotation |
| `scatter` / `bubble` | data 必须 `{x, y}`；bubble 的 `r` 是**像素半径**不随缩放 |
| `radar` / `polarArea` | 径向单轴 `scales.r`（radialLinear） |
| mixed | dataset 级 `type` 覆盖顶层；`order` 大的先画（沉底层） |

<div v-click class="mt-3 text-sm">

> 面积图不是独立 type：line/radar 设 `fill`（`'origin'` / 索引 / `'-1'` 相对），由 **Filler 插件**实现——按需注册时别漏。

</div>

<!--
八种内置类型过一遍。line：tension 默认 0 画直线，大于 0 走贝塞尔；spanGaps 跨 null 连线；设 fill 就是面积图。bar：indexAxis 设 y 即水平条形图，v3 起替代了 horizontalBar 类型；数据给 start、end 元组是浮动条；宽度靠 barPercentage、categoryPercentage。

pie 和 doughnut 是同一实现，唯一区别是 cutout：pie 是 0，doughnut 是百分之五十；rotation 加 circumference 能做半环仪表盘，比如 rotation 270、circumference 180。scatter 是 line 变体，x 轴默认 linear、showLine 默认 false；bubble 的 r 是原始像素半径，不随图表缩放，想按数值映射面积要用 scriptable radius 自己换算。

radar 和 polarArea 用径向单轴 scales.r；polarArea 是等角扇区、半径映数值，跟 pie 的角度映数值相对。mixed 图顶层 type 加 dataset 级 type 覆盖；层叠规则：数组第 0 个画在最上，order 越大越先画越沉底，常给 line 小 order 让线浮在柱子上。面积填充由 Filler 插件实现，按需注册别漏。
-->

---

# 插件体系：钩子与注册

```js
const bgPlugin = {
  id: 'bg',                            // id 须符合 npm 包名规范
  beforeDraw(chart, args, opts) {      // 第三参 = options.plugins.bg
    const { ctx, width, height } = chart;
    ctx.globalCompositeOperation = 'destination-over';  // 铺到最底层
    ctx.fillStyle = opts.color ?? '#fff';
    ctx.fillRect(0, 0, width, height); // 经典用法：给导出图铺白底
  }
};
Chart.register(bgPlugin);              // 全局生效；放 config.plugins: [...] 则仅该实例
```

<v-clicks>

- 钩子覆盖全生命周期；多数 `before*` 返回 `false` 可取消对应阶段（如取消渲染）
- `options.plugins.bg: false` 禁单个插件；`options.plugins: false` 全禁
- 社区三板斧：`chartjs-plugin-zoom` / `-datalabels` / `-annotation`

</v-clicks>

<!--
插件两种用法：Chart.register 全局注册，所有图表生效；写进 config 的 plugins 数组是 inline 插件，只对该实例生效，且不能再拿去注册。要配 options 或全局注册就必须有 id，id 须符合 npm 包名规范，发布约定 chartjs-plugin- 前缀。

钩子覆盖全生命周期：安装态 install、start、stop、uninstall；初始化 beforeInit、afterInit；更新 beforeUpdate、afterUpdate 和布局、dataset 系列；渲染 beforeRender、beforeDraw、afterDraw 以及 datasetsDraw、tooltipDraw；事件 beforeEvent、afterEvent；还有 resize、reset、destroy 系列，注意 v4 移除了 destroy 钩子，用 afterDestroy。多数 before 钩子返回 false 能取消对应阶段。

插件配置从 options.plugins 点 id 传入，就是钩子第三参；设 false 禁单个，plugins 整体 false 全禁。这页例子是经典的画布背景插件：destination-over 铺白底，顺手解决导出 PNG 透明底的问题。社区三板斧：zoom 缩放平移、datalabels 图上标数值、annotation 参考线标注。
-->

---

# 实例 API 与 destroy

```js
chart.data.datasets[0].data.push(42);  // 官方范式：直接改 data，再 update()
chart.update('none');                  // 'none' 跳过动画（高频刷新）
Chart.getChart('myChart')?.destroy();  // 复用 canvas 前必须 destroy
```

| 方法 | 要点 |
|---|---|
| `update(mode?)` | none/reset/show/hide/active；可传函数定制 |
| `destroy()` | 清理引用与监听；SPA 卸载必做，防泄漏防报错 |
| `resize()` / `toBase64Image()` | 手动尺寸 / 导出图片（png 默认透明底） |
| `hide(i)` / `show(i)` | dataset 级显隐；`toggleDataVisibility` 为条目级 |
| `Chart.getChart(key)` | 按 canvas 反查实例；`Chart.instances` 全实例表 |

<!--
数据更新的官方范式：直接 push、pop chart.data.labels 和 datasets 里的 data，然后调 update。update 可以带 mode：none 跳过动画适合高频刷新，还有 reset、resize、show、hide、active，甚至传函数按 dataset 定制。整对象替换 options 也支持，注意换了轴 id 或 type 后旧的 chart.scales 引用会失效。

destroy 是 SPA 必修课：复用 canvas 前必须调用，清理引用和事件监听，组件卸载钩子里必做，否则内存泄漏加重建报错。静态方法 Chart.getChart 按 canvas 的 id、元素或 context 反查实例，找不到返回 undefined，是重建前防重复 new 的钥匙；Chart.instances 是全部实例注册表，打印场景遍历 resize 用它。

其他常用：reset 回初始动画前状态；stop 停动画；resize 无参就适配容器；toBase64Image 导出图片，png 默认透明底，要白底配上一页的背景插件；getDatasetMeta 取元素级元数据；setActiveElements 程序触发高亮。
-->

---

# 性能优化组合拳

<v-clicks>

- **禁动画**：`animation: false` → 单次渲染 + 自动启用 Path2D 缓存
- **decimation 降采样**（line 专用插件，默认 disabled）：`lttb` 保趋势 / `min-max` 保峰值
- 启用前提**五条件缺一不可**：line 类型、`indexAxis: 'x'`、x 轴 linear/time、`parsing: false`、点数超 threshold
- **`parsing: false`** 喂内部格式 + `normalized: true`（数据唯一、已排序、索引一致）
- **指定轴 `min/max`** 免全量扫描算范围；`ticks.sampleSize` 只测量部分标签
- line 专项：保持 `tension: 0` 走自动路径抽稀、`spanGaps: true` 省分段、`pointRadius: 0` 只画线
- **Web Worker + OffscreenCanvas**：配置不能带函数、worker 无 DOM、resize 需手动

</v-clicks>

<!--
性能优化按官方 Performance 页整理成组合拳。

第一招禁动画：animation false，只渲染一次，还自动启用 Path2D 缓存。第二招 decimation 降采样插件，line 专用、默认关闭：lttb 算法保趋势大幅减点，min-max 保峰值适合噪声信号，每像素最多留 4 点。注意启用前提五条件缺一不可：dataset 的 indexAxis 是 x、line 类型、x 轴是 linear 或 time、parsing false、数据点数超过 threshold（默认画布宽的 4 倍）。配了没生效，多半是忘了 parsing false。

第三招 parsing false 直接喂内部格式，再加 normalized true 声明数据唯一、已排序、各 dataset 索引一致。第四招指定轴 min max，免去全量扫描算范围；ticks.sampleSize 只测量部分标签；minRotation 等于 maxRotation 能跳过旋转计算。

line 专项：tension 保持 0 走自动路径抽稀（tension、stepped、borderDash 全默认时生效）；spanGaps true 省分段开销；pointRadius 0 只画线。终极方案：transferControlToOffscreen 把 canvas 移交 Web Worker 里 new Chart，三个限制——配置里不能带函数、worker 没有 DOM、resize 要手动。
-->

---

# 易错点（上）：运行时

<v-clicks>

- **「Canvas is already in use」**：同一 canvas 重复 `new Chart` 必炸——先 `Chart.getChart(canvas)?.destroy()`（Vue/React 热更新最高频）
- **漏注册**：报 `"category" is not a registered scale`——补齐组件，或图省事用 `chart.js/auto`
- **time 轴裸奔**：不装 date adapter 直接报错——装 `chartjs-adapter-date-fns` 等任一
- **高度塌陷/无限增高**：canvas 没裹专属相对定位容器；JS 控高须关 `maintainAspectRatio`
- **`suggestedMax` 当 `max` 用**：suggested 只是建议值，数据超过轴仍扩展；硬边界用 `min/max`（会裁数据）
- **bubble 半径误会**：`r` 是画布像素、不随缩放；按数值映射面积需 scriptable radius 换算

</v-clicks>

<!--
运行时六个高频坑。

第一，Canvas is already in use：同一个 canvas 重复 new Chart 必炸，Vue、React 的热更新和组件重挂最高频。解法：先 Chart.getChart 反查再 destroy，或组件卸载钩子里 destroy。

第二，tree-shaking 漏注册：报某某 is not a registered scale 或 controller，按需引入时把组件补齐，bar 至少四件；图省事就 chart.js/auto。第三，time 轴不装 date adapter 直接报错，装 date-fns、luxon、moment、dayjs 适配器任一。

第四，响应式高度塌陷或无限增高：canvas 没裹专属相对定位 div，或想 JS 控高却没关 maintainAspectRatio，记住高度设在容器上。第五，把 suggestedMax 当 max 用，数据一超就觉得没生效——suggested 是软建议，硬边界用 min max，但 min max 会裁掉超出的数据。第六，bubble 的 r 是画布像素，responsive 缩放也不会变，想按数值映射面积要用 scriptable radius 自己开方换算。
-->

---

# 易错点（下）：迁移与生态

<v-clicks>

- **v2 老代码全失效**：`xAxes/yAxes` 数组 → 对象键 scales；`options.tooltips` → `plugins.tooltip`；horizontalBar → `indexAxis: 'y'`
- **v4 grid 边框样式失效**：拆进独立命名空间——`grid.drawBorder → border.display`、`grid.borderColor → border.color`
- **ESM-only**：CJS 只能 `await import('chart.js')`；Jest 需开 ESM（官方建议 Vitest）；RequireJS 用 `dist/chart.umd.min.js`
- **pie 图例点击预期错**：不是隐藏 dataset，而是 toggle 单个扇区（`toggleDataVisibility`）
- **`toBase64Image` 透明底**：canvas 默认透明——`beforeDraw` 插件 `destination-over` 铺白底
- **null 断线**：默认行为；连上用 `spanGaps: true`（数字 = 最大可跨毫秒距离），性能反而更好

</v-clicks>

<!--
迁移和生态六个坑。

v2 老代码三件套全失效：scales 的 xAxes、yAxes 数组写法改对象键；options.tooltips 复数改 plugins.tooltip；horizontalBar 类型没了，用 bar 加 indexAxis y。v4 又把轴线从 grid 拆到独立 border 命名空间：drawBorder 变 border.display，borderColor、borderWidth、borderDash 同理搬家，升级后边框样式突然失效多半是这个。

ESM-only 是 v4 的工程坑：package.json 声明 type module，CommonJS 里 require 直接失败，只能动态 await import；Jest 要开 ESM 支持，官方建议迁 Vitest；RequireJS 只能用 UMD 构建。

pie 的图例点击预期错位：以为隐藏 dataset，实际 toggle 单个扇区数据。toBase64Image 导出 PNG 默认透明底，配 beforeDraw 插件 destination-over 铺白底。最后 null 断线是默认行为，连上用 spanGaps true 或最大毫秒间隔，而且 spanGaps 在性能上反而更快。
-->

---
layout: intro
---

# 总结

Chart.js = **简单灵活的 Canvas 图表库**（v4.5.x）

- 一个 config 出图：`{ type, data, options }`；`chart.js/auto` 全量 vs 按需注册省约 25%
- options 解析链 defaults → overrides → options；scriptable + indexable 动态样式
- 响应式监听**父容器**（专属 div + 相对定位）；time 轴必须 date adapter
- 交互标配 `{ mode: 'index', intersect: false }`；插件钩子覆盖全生命周期
- SPA 三必记：改数据 `update()`、卸载 `destroy()`、大数据 decimation + `parsing: false`

<!--
总结一下。

Chart.js 是最流行的开源 JavaScript 图表库，当前 4.5.x：Canvas 渲染、8 种内置类型、合理默认值开箱即用。一个 config 对象就出图，恒为 type、data、options 三件套；工程上 chart.js/auto 快速上手，生产按需注册能省约 25% 包体。

配置体系记三层解析链加两大招牌：scriptable options 给函数动态求值、indexable 给数组循环取用。响应式监听的是父容器，专属 div 加相对定位；time 轴必须装 date adapter。交互层 mode index 加 intersect false 是多系列 tooltip 标配；再往深走有插件钩子和自定义 controller。

SPA 三必记：改完数据调 update、组件卸载调 destroy 防泄漏防重建报错、大数据量上 decimation 配 parsing false。要快要轻选 Chart.js，要全要炫选 ECharts，非标定制选 D3。谢谢大家。
-->
