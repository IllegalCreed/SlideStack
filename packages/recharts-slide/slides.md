---
theme: seriph
background: https://cover.sli.dev
title: Recharts — React 声明式图表库
info: |
  Presentation Recharts — React 声明式 SVG 图表库。

  Learn more at [https://recharts.github.io](https://recharts.github.io)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📊</span>
</div>

<br/>

## Recharts — React 声明式图表库

用 React 组件组合声明图表的 SVG 图表库，图表即 JSX 组件树。2026 年当前版本 v3.9

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/recharts/recharts" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Recharts。一句话定位：用 React 组件组合来声明图表的 SVG 图表库——一张图就是一棵 JSX 组件树，LineChart 里放 XAxis、Tooltip、Line，D3 只在底层做 scale、shape 这类计算，渲染完全交给 React 和原生 SVG。

2026 年的背景：当前版本 3.9.2，v3 是 2025 年发布的当前唯一主线；周下载量 5150 万，大约是 chart.js 的 4 倍、echarts 的 14 倍，是 React 生态下载量第一的图表库。注意官方文档已经从 recharts.org 迁到 recharts.github.io，老域名已经 404。

顺序：定位 → 上手 → 响应式容器 → 数据模型 → 各图型 → 坐标轴 → 混合图 → Tooltip → Legend → 参考系 → 自定义 → 动画 → 性能 → v3 迁移 → 易错点 → 选型。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么 Recharts？

命令式 / 配置式的痛点：

<v-clicks>

- Chart.js：拿 canvas 上下文命令式 `new Chart(ctx, config)`
- ECharts：一个大 option 对象，与 React 状态两套心智
- 改图 = 改配置对象，和组件树割裂

</v-clicks>

<div v-click class="mt-6">

Recharts：图表即组件树

- 加图例 = 加一行 `<Legend />`，删网格 = 删 `<CartesianGrid />`
- D3 只做计算（scale/shape），渲染交给 React + SVG
- 周下载 51.5M：React 生态图表第一

</div>

<!--
为什么选 Recharts？先看另外两条路的痛点。Chart.js 是 Canvas 命令式：拿到 canvas 上下文，new Chart 传配置对象；ECharts 是一个巨大的 option 对象声明。这两者在 React 里都要靠包装层，改图等于改配置对象，跟组件树的心智是割裂的。

Recharts 的答案是：图表本身就是组件树。想加图例，就在树里加一行 Legend；想删网格，删掉 CartesianGrid 那一行。配置就是子组件和 props，状态联动就是普通的 React 状态。

官方三大设计原则：简单部署、SVG 原生轻依赖、声明式组件。SVG 还有个附带好处：DOM 可以被 CSS 和 DevTools 直接检查操作。下载量上它是 React 生态第一：周下载 5150 万。
-->

---

# 上手：一张折线图 = 一棵组件树

```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { name: 'Page A', uv: 4000, pv: 2400 }, // 数据 = 对象数组
  { name: 'Page B', uv: 3000, pv: 1398 },
];
<LineChart width={700} height={400} data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />  {/* 零配置即用 */}
  <Line type="monotone" dataKey="pv" stroke="#8884d8" />
</LineChart>
```

<div v-click class="mt-2 text-sm">

> 安装：`npm install recharts react-is`——**react-is 版本须与 react 一致**（`Cell` 是最后一处依赖，v4 移除）

</div>

<!--
最小可用折线图。数据是对象数组，图表根组件 LineChart 给宽高和 data，子组件依次是：CartesianGrid 虚线网格、XAxis 取 name 字段、YAxis 默认数值轴、Tooltip 零配置即用，最后 Line 声明一条 series，dataKey 指定取哪个字段，type monotone 平滑曲线。

margin 默认上下左右各 5。想要图例，再加一行 Legend 就行——这就是组合心智。

安装注意：npm install recharts 还要装 react-is，而且 react-is 版本必须跟 react 一致。这是因为 Cell 组件依赖它，v4 移除 Cell 后这个依赖会取消。环境要求 v3 起是 React 16.8 以上、TS 5、Node 18、产物 ES6。
-->

---

# 尺寸与响应式：先有宽高，才有图表

- **图表必须有确定 width/height 才渲染**——高度为 0 ⇒ 页面空白，新手第一坑

```jsx
<div style={{ height: 300 }}>   {/* 父容器必须有确定高度 */}
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>…</LineChart>
  </ResponsiveContainer>
</div>
```

- 基于 ResizeObserver；父级 auto 高度测得 0 ⇒ 不渲染。解法：固定 height / flex 链传高 / `aspect`

<div class="mt-2">

v3.3+ 新推荐：根组件 `responsive` prop（免包裹，兼容 flex/grid）

```jsx
<AreaChart responsive data={data}
  style={{ width: '100%', maxWidth: 700, aspectRatio: 1.618 }}>
```

</div>

<!--
这一页是本库最高频的坑：尺寸。铁律是图表必须有确定的宽高才会渲染，高度是 0 或没指定，页面就是一片空白。

经典方案 ResponsiveContainer：width、height 默认百分之百，跟随父容器。但它基于 ResizeObserver 去量父容器，所以父容器必须有确定尺寸——如果父级高度是 auto、靠内容撑，量出来就是 0，图直接不渲染。解法三选一：父 div 给固定 height；用 flex 链把高度传下来；或者用 aspect 宽高比让高度由宽度算出。它还有 debounce 防抖、onResize、initialDimension 这些 props，v3 还修了 v2 嵌套 ref 的问题。

v3.3 之后官方新推荐：直接在图表根组件上加 responsive 布尔 prop，配 style 的 aspectRatio，监听容器尺寸自动重渲，官方新示例已统一这种写法。

顺带提 SSR：这套响应式依赖浏览器测量，服务端量不到尺寸，Next.js 里常用 dynamic 加 ssr false 包图表组件，或给固定宽高加 initialDimension。
-->

---

# 数据模型：对象数组 + dataKey

```jsx
const data = [{ date: '07-01', stats: { uv: 400 }, pv: 2400 }];

<Line dataKey="stats.uv" name="访问量" unit="次" />  {/* 'a.b' 路径 */}
<Line dataKey={(d) => d.pv / 1000} />                {/* 函数取值 */}
<Line dataKey="amt" hide />                          {/* 隐藏但留在 Legend */}
```

- `dataKey` 三态：字符串（支持 `'a.b'` 路径）/ 数字索引 / 函数 `(entry) => value`
- 函数 dataKey **必须引用稳定**（useCallback）——内联新建 ⇒ 每次渲染全量重算
- `name`（Tooltip/Legend 显示名）、`unit`（数值单位）、`hide`（图例显隐切换的基础）
- 分层认知：Tooltip / Legend 是 **HTML** 层，其余全部是 **SVG**
- v3 起任意 SVG 兼容的自定义组件可直接放进图表树

<!--
数据模型只有两件事：数据是对象数组，每条 series 用 dataKey 从对象里取值。

dataKey 有三种形态：字符串——支持 a 点 b 的嵌套路径；数字索引；以及函数，对每行数据算出一个值。函数形态有个重要约束：引用必须稳定，用 useCallback 固定，如果每次渲染都新建一个内联函数，Recharts 会认为取值逻辑变了，全量重算，这是大数据场景的头号隐形性能杀手。

series 还有几个通用 props：name 决定 Tooltip 和 Legend 里的显示名，unit 是数值单位，hide 隐藏这条 series 但保留在 Legend 里——这是后面做图例点击切换显隐的基础。

再记一个分层认知：Tooltip 和 Legend 是 HTML 元素，其余全是 SVG——后面自定义渲染时返回 HTML 还是 SVG 全看这个。v3 起 SVG 兼容的自定义组件可以直接扔进图表树，不再必须 Customized 包裹。
-->

---

# Line：折线的关键 props

```jsx
<Line
  type="monotone"       // 插值：默认 linear；monotone 平滑不过冲
  dataKey="uv"
  stroke="#8884d8" strokeWidth={2}
  dot={false}           // 千点级折线：关 dot 是性能大头
  activeDot={{ r: 8 }}  // hover 态放大圆点
  connectNulls          // null 断点连过去（默认 false = 断线）
/>
```

- `type` 还有 step / basis / natural；`strokeDasharray` 画虚线
- `dot` / `activeDot` / `label` 都是四态 prop：boolean / 对象 / 元素 / 函数
- 每个 dot 都是一个真实 SVG 节点——大数据先关 `dot`

<!--
Line 的关键 props。type 是曲线插值方式：默认 linear 直线，最常用 monotone——平滑且不过冲，还有 step 阶梯、basis、natural。

dot 控制数据点圆点，activeDot 控制 hover 时的高亮点。注意它们是"四态 prop"：可以传 boolean 开关、对象改样式、React 元素或函数完全自定义——这个四态约定贯穿整个库，后面自定义渲染还会讲。

connectNulls 决定数据里的 null 是断线还是连过去，默认 false 断线。strokeWidth 默认 1，strokeDasharray 画虚线。

性能提示：每个 dot 都是一个真实的 SVG DOM 节点，千点级折线里 dot 是 DOM 数量的大头，大数据先把 dot 关掉。
-->

---

# Area：渐变填充与堆叠

```jsx
<defs>
  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
  </linearGradient>
</defs>
<Area type="monotone" dataKey="uv" stroke="#8884d8" fill="url(#colorUv)" />
```

- 渐变填充经典模式：SVG `<defs>` + `<linearGradient>` + `fill="url(#id)"`（官方示例原样）
- `stackId` 相同 ⇒ 堆叠面积图（规则同 Bar）
- `baseValue`：`"dataMin"` / `"dataMax"` / 数字
- v3 行为变化：`connectNulls` 下 Area 的 null 点按 0 处理

<!--
Area 面积图。最经典的视觉模式是渐变填充：因为渲染是原生 SVG，可以直接用 SVG 的 defs 定义一个 linearGradient，从上到下透明度 0.8 渐变到 0，然后 Area 的 fill 引用 url 井号 id。这段是官方示例原样，面试和实战都高频。

堆叠规则跟 Bar 一致：多条 Area 给相同的 stackId 就自动堆叠成堆叠面积图。baseValue 控制面积的基线，可以是 dataMin、dataMax 或具体数字。

一个 v3 行为变化要知道：开 connectNulls 时，Area 的 null 点按 0 处理，跟 v2 不一样。
-->

---

# Bar：堆叠与布局

```jsx
<BarChart data={data} stackOffset="expand">        {/* 100% 堆叠 */}
  <Bar dataKey="uv" stackId="a" fill="#8884d8" />
  <Bar dataKey="pv" stackId="a" fill="#82ca9d" />  {/* 同 stackId ⇒ 堆叠 */}
</BarChart>
```

- **忘写 `stackId` ⇒ 柱子重叠遮挡**，视觉像只剩一个 series（高频坑）
- `stackOffset`：`"none"` 默认 / `"expand"` 归一化 100% / `"sign"` 正负分堆
- 尺寸：`barSize` 定宽、`maxBarSize`、`minPointSize`；间距 `barGap` / `barCategoryGap`
- 圆角 `radius`：数字或 `[TL,TR,BR,BL]` 四元组；堆叠整摞圆角用 `BarStack`
- 横向条形图三件套：`layout="vertical"` + `<XAxis type="number"/>` + `<YAxis type="category" dataKey="name"/>`

<!--
Bar 柱状图，重点是堆叠。规则一句话：相同 stackId 且同轴的 Bar 自动堆叠。高频坑是忘写 stackId——多个 Bar 会直接重叠遮挡，视觉上像只剩一个 series，而不是堆叠。

stackOffset 是图表级 prop：expand 把每摞归一化成 100% 堆叠，sign 按正负分堆。

尺寸和间距：barSize 定柱宽，不给就按可用空间自动算；barGap 是同类目内柱间距默认 4，barCategoryGap 类目间距默认 10%，本质是 band scale 的 padding 快捷方式。radius 做圆角，四元组分别是左上、右上、右下、左下；堆叠图要对整摞做圆角用 BarStack 组件，避免小段小于半径的畸形。还有 background 柱背景、activeBar 控制 hover 态。

横向条形图必考三件套：layout vertical，加 XAxis 显式 number，加 YAxis 显式 category 并给 dataKey，三者缺一不可。
-->

---

# Pie：自带数据与着色

```jsx
<PieChart width={400} height={300}>
  <Pie data={pieData} dataKey="value" nameKey="name"
       innerRadius={60} outerRadius="80%" label />  {/* innerRadius>0 ⇒ 环形 */}
</PieChart>
```

- **Pie 吃自己的 `data` prop**，不读图表根 data（与其他 series 不同，必考）
- `cx`/`cy` 默认 "50%"；`startAngle` 180 → `endAngle` 0 = 半圆仪表盘
- `paddingAngle` 扇区间隙、`cornerRadius` 圆角、`minAngle` 保底角
- `label` 传函数可自绘：收 `name / value / percent / midAngle` 等
- 逐扇区着色老写法：`<Cell fill={COLORS[i]} />` 列表——**已废弃，v4 将移除**
- 新写法：`shape` 函数按 entry 返回带 fill 的 `<Sector>`

<!--
Pie 饼图有个特殊点必须记住：它吃自己的 data prop，不读图表根组件的 data，跟其他 series 不一样。dataKey 默认 value，nameKey 默认 name。

形状控制：cx、cy 圆心默认百分之五十居中；innerRadius 默认 0，给正值就变成环形图 Donut；startAngle 180 到 endAngle 0 就是半圆仪表盘。paddingAngle 扇区间隙、cornerRadius 圆角、minAngle 保证小值扇区也可见。label 可以传函数自绘标签，参数里有 name、value、percent、midAngle 以及各种坐标，做百分比标签、外引线标签都靠它。

逐扇区着色的老写法是 data map 出一列 Cell 组件各给 fill——注意官方已标记 Cell 废弃，v4 移除；新写法是 shape 函数按数据返回带 fill 的 Sector。两种都要认识：存量代码全是 Cell，新代码写 shape。
-->

---

# 坐标轴 Ⅰ：number vs category

| prop | XAxis 默认 | YAxis 默认 |
|---|---|---|
| `type` | **"category"** | **"number"** |
| `orientation` | "bottom" | "left"（双轴可 "right"） |
| `width` | — | 60（v3 支持 "auto"） |
| `interval` | "preserveEnd" 抽稀 | — |

- category = 离散字符串（类目间无插值）；number = 连续数轴（自动外扩"好看"刻度）
- **坑：数字数据落在默认 category 的 XAxis** ⇒ 被当不重复分类、间距失真——散点 / 时间序列必须显式 `type="number"`
- `domain`：`[0, 100]` / `['dataMin', 'dataMax']` / 函数元素，仅 number 轴生效
- `allowDataOverflow` 阻止自动扩域并裁剪出界图形（配 Brush 做缩放）

<!--
坐标轴第一页，先记一个必考默认值差异：XAxis 默认 type 是 category 分类轴，YAxis 默认是 number 数值轴。

两种轴的语义完全不同：category 把值当离散字符串，相邻类目之间没有插值；number 当连续数轴，还会为了刻度好看自动外扩。于是有一个高频坑：数字数据落在默认 category 的 XAxis 上，会被当成一个个不重复的分类——间距失真、顺序按出现顺序排。散点图、时间序列必须给 XAxis 显式 type number。

domain 控制数值轴范围：可以写具体数、dataMin dataMax 字符串，甚至函数元素做加减扩展。默认 domain 会自动扩到容下所有数据，allowDataOverflow 设 true 就阻止扩域、并把出界图形裁掉——配合 Brush 做缩放场景的标配。YAxis 宽度默认 60，v3 支持 auto 自适应长标签。
-->

---

# 坐标轴 Ⅱ：刻度与双 Y 轴

```jsx
<YAxis yAxisId="left" orientation="left" />
<YAxis yAxisId="right" orientation="right" />
<Line yAxisId="left"  dataKey="uv" />
<Bar  yAxisId="right" dataKey="pv" />  {/* series 用 yAxisId 配对 */}
```

- 刻度：`ticks` 手工指定、`tickFormatter` 格式化、`tickCount`（默认 5）、`interval`（数字或 `"preserveStartEnd"` 等）
- `niceTicks`（v3 新）：`'auto' / 'adaptive' / 'snap125'` 刻度取整策略
- `scale`：`"log"`（**必须显式 domain 且不能含 0**）、`"sqrt"`、v3 新 `"symlog"`
- v3 行为：多 Y 轴按 `yAxisId` **字母序**排布；轴没有 ticks 也画轴线
- **`CartesianGrid` 需匹配 `xAxisId`/`yAxisId`**——不匹配则网格不渲染（多轴暗坑）

<!--
坐标轴第二页。双 Y 轴是必考模式：声明两个 YAxis 各给 yAxisId，一个 left 一个 right，然后每条 series 用相同的 yAxisId 跟轴配对。量级差异大的两组数据，比如访问量和转化率，就靠这个。

刻度定制：ticks 完全手工指定；tickFormatter 函数格式化显示；tickCount 默认 5；interval 控制抽稀，可以是数字 n——每 n 加 1 个显示一个，也可以是 preserveStartEnd 这类策略字符串；tick 本身也是四态 prop 可以完全自定义。v3 新增 niceTicks 控制好看刻度的取整策略，官方示例常见 snap125。

scale 默认 auto，可以换 log、sqrt，v3 新增 symlog。注意 log 轴必须显式给 domain，而且不能含 0，否则直接异常。

两个 v3 行为变化：多 Y 轴按 yAxisId 字母序排布，不按渲染顺序；CartesianGrid 新增了轴 ID 匹配——多轴图表里网格突然消失，八成是 ID 没对上。
-->

---

# ComposedChart：混合图表

```jsx
<ComposedChart data={data}>
  <XAxis dataKey="name" />
  <YAxis yAxisId="left" />
  <YAxis yAxisId="right" orientation="right" />
  <Bar  yAxisId="left"  dataKey="pv" barSize={20} fill="#413ea0" />
  <Line yAxisId="right" dataKey="uv" type="monotone" stroke="#ff7300" />
</ComposedChart>
```

- 同图混合 `<Area>` + `<Bar>` + `<Line>` + `<Scatter>`
- **单类型图表只接受自己的 series**：`<LineChart>` 里塞 `<Bar>` 无效——混合必须换 `ComposedChart`
- 经典组合：柱 + 线 + 双 Y 轴（量 vs 率）
- 图型家族：RadarChart / RadialBarChart 极坐标族；Treemap / Sankey / Funnel / v3 新 SunburstChart

<!--
混合图表用 ComposedChart。规则：单类型图表只接受自己的 series 类型——往 LineChart 里塞 Bar 是无效的，要混合必须换成 ComposedChart，它可以同时放 Area、Bar、Line、Scatter。

最经典的组合是柱加线加双 Y 轴：柱子挂左轴表示量，折线挂右轴表示率，就是上面这段代码的形态。

图型家族顺带过一眼：极坐标族有 RadarChart 雷达图——PolarGrid 加 PolarAngleAxis 加 Radar 组合，RadialBarChart 环形进度条族，v3 极坐标也支持多轴；层级和关系图有 Treemap 嵌套矩形、Sankey 桑基图——data 传 nodes 和 links、FunnelChart 漏斗，v3 还新增了 SunburstChart 旭日图。Scatter 散点图记一点：X、Y 都是 number 轴各给 dataKey，ZAxis 映射点大小。
-->

---

# Tooltip 自定义：content 与 payload

```tsx
const CustomTooltip = ({ active, payload, label }: TooltipContentProps) => {
  if (!active || !payload?.length) return null;  // 必须先判非激活态
  return (
    <div>
      <p>{label}</p>
      {payload.map((it) => (
        <p key={it.dataKey} style={{ color: it.color }}>{it.name}: {it.value}</p>
      ))}
    </div>
  );
};
<Tooltip content={<CustomTooltip />} />
```

<div class="mt-1 text-sm">

- v3 类型名 **`TooltipContentProps`**（v2 `TooltipProps` 已改名，迁移必改）
- payload 每项：`name / value / dataKey / color / unit / payload`——最后的 `payload` 是**原始数据行**
- 取未画上图的字段走 `it.payload.xxx`——与外层数组两层同名，经典坑

</div>

<!--
Tooltip 自定义是最高频的定制需求。content 传自定义组件，收 active、payload、label 三个关键 props。标准写法头一行必须先判非激活态：active 为假或 payload 为空就返回 null——payload 可能是 undefined 或空数组，直接解构取值会崩。

payload 数组每一项的结构必须背下来：name、value、dataKey、color、unit，以及最后一个也叫 payload 的字段——它是这个数据点的原始数据对象。想显示没画到图上的字段，比如订单号、环比，就走 item.payload.xxx。外层数组叫 payload，每项里还有个 payload，两层同名是经典坑。

类型注意：v3 的类型名是 TooltipContentProps，v2 叫 TooltipProps，沿用旧名会类型报错。其他常用 props：formatter 逐项格式化，cursor false 关悬停指示，trigger 可改 click，defaultIndex 首渲即高亮——v3 交互受控的官方入口，shared 控制轴共享还是单点模式，v3 新增 portal 可以把 tooltip 渲染到图表外任意 DOM。只想留高亮不要框，content 返回 null 即可。
-->

---

# Legend 与显隐切换

```jsx
const [hidden, setHidden] = useState({});
<Legend onClick={(e) => setHidden(h => ({ ...h, [e.dataKey]: !h[e.dataKey] }))} />
<Line dataKey="uv" hide={hidden['uv']} />  {/* hide：不画但留在图例 */}
```

- 定位三 props：`layout`（horizontal）/ `align`（center）/ `verticalAlign`（bottom）
- 贴边摆放会挤压绘图区；middle / center 则悬浮在图上
- `iconType`（circle / rect / line…）、`iconSize`、`inactiveColor`（灰显 "#ccc"）
- 自定义 `content` **必须返回 HTML**（Legend 是 HTML 层）；v3 支持 `portal` 渲染到图表外
- v3 变更：`payload` 覆盖 prop 已移除；默认排序不再保证与 series 顺序一致
- 多图联动：图表根 `syncId` 相同即共享 Tooltip / Brush（`syncMethod`：index / value / 函数）

<!--
Legend 图例。最实用的模式是点击图例切换 series 显隐：Legend 的 onClick 回调收 entry，里面有 dataKey，配一个 state，把对应 series 的 hide 打开或关闭。hide 的 series 不画，但仍然留在图例里，配 inactiveColor 显示成灰色——这就是前面 dataKey 页说 hide 是显隐切换基础的原因。

定位靠三个 props：layout 排列方向、align 水平、verticalAlign 垂直，默认水平居中放底部。放上下左右会挤压绘图区，middle、center 是悬浮在图上。

自定义 content 必须返回 HTML——Legend 是 HTML 层，返回 SVG 就错了。v3 两个变更：v2 可以用 payload prop 整体伪造图例项，已移除；默认排序不再保证跟 series 顺序一致。

顺带讲多图联动：多个图表根组件给相同的 syncId，就共享 Tooltip 和 Brush，syncMethod 控制按索引还是按值对齐，也可以传函数。
-->

---

# 参考系组件与 Brush 缩放

```jsx
<ReferenceLine y={4000} stroke="red" label="目标" ifOverflow="extendDomain" />
<ReferenceArea y1={3000} y2={4000} />  {/* 省略 x1/x2 ⇒ 全宽横带 */}
<Brush dataKey="name" height={40} startIndex={2} onChange={onZoom} />
```

- **坐标用数据域**：`y={4000}` 画横线、`x="Page C"` 画竖线；`segment` 两点画斜线
- **`ifOverflow` 默认 "discard"**：目标值在 domain 外直接不画——出界必给 `"extendDomain"` 撑轴
- v2 的 `alwaysShow` / `isFront` 已移除 → 用 `ifOverflow` + `zIndex`
- `ReferenceDot` 单点标注；ReferenceArea 省略的坐标顺延到图表边界
- Brush：`startIndex` / `endIndex` / `onChange`；children 可内嵌迷你缩略图；受 `syncId` 联动
- 真"放大"：**Brush + `allowDataOverflow`**——否则选区外数据仍参与 domain 计算

<!--
参考系三兄弟：ReferenceLine、ReferenceArea、ReferenceDot，坐标全部用数据域——y 等于 4000 就是在数值 4000 处画横线，x 等于 Page C 在那个类目画竖线，segment 给两个点画斜线。

必考的是 ifOverflow：默认 discard，目标值落在 domain 外时这条线直接被丢弃不画——比如数据最大 3000、目标线 4000，默认就看不见。要给 extendDomain，把轴撑大到容下参考线。v2 的 alwaysShow、isFront 已移除，分别用 ifOverflow 和 zIndex 替代，ReferenceLine 默认 zIndex 400。

ReferenceArea 的坐标可以任意省略，省略的边顺延到图表边界——只给 y1、y2 就是一条全宽横带高亮。

Brush 是缩放选区：拖动选择数据范围，onChange 拿 startIndex、endIndex，children 里还能内嵌一个迷你折线图当缩略图。注意想要真正的放大效果要配 allowDataOverflow，否则选区外的数据仍参与 domain 自动计算，放大不彻底。
-->

---

# 自定义渲染：四态 prop 与扩展点

```jsx
<Bar dataKey="uv" shape={(p) => (          // shape 函数收几何 + 数据
  <rect x={p.x} y={p.y} width={p.width} height={p.height}
        fill={p.payload.uv > 3000 ? '#e5484d' : '#8884d8'} />
)} />
```

- 统一约定：`dot` / `tick` / `label` / `shape` / `content` / `cursor` 接受 **boolean / 对象 / 元素 / 函数**
- **SVG/HTML 边界**：tick / label / shape 必须返回 SVG（`<text>` / `<g>`），塞 `<div>` 不渲染
- Bar `shape` 收 x / y / width / height / payload 及动画参数；Pie 另有 `activeShape` + `isActive`
- `LabelList`：`dataKey` + `position`（20 余种）批量打标；`content` 自定义 SVG
- v3 公开 hooks：`useActiveTooltipLabel` / `usePlotArea` / `useXAxisScale`（数据→像素）等
- zIndex（v3.4+）：组件传 `zIndex` 或包 `<ZIndexLayer>`；仅单图表内有效

<!--
自定义渲染贯穿一个统一约定：dot、tick、label、shape、content、cursor 这些扩展点 prop 全部接受四态——boolean 开关、对象改 props、React 元素、或函数完全自定义。函数收带坐标和数据的 props，比如 Bar 的 shape 函数收 x、y、width、height、payload，还有动画参数，示例里按数据值条件着色——这也是 Cell 废弃后逐柱、逐扇区着色的推荐写法。

最容易踩的边界：自定义 tick、label、shape 在 SVG 上下文里，必须返回 SVG 标签，text 或 g，塞 div 进去不渲染或报错；反过来 Legend、Tooltip 的 content 是 HTML 层，要返回 HTML。

LabelList 给整条 series 批量打标，position 有 20 多种，content 可以完全自定义 SVG。v3 还公开了一批 hooks：useActiveTooltipLabel 读激活态，usePlotArea 拿绘图区，useXAxisScale 做数据到像素的换算，加上逆变换 hooks，覆盖数据域、图表像素、鼠标原生三套坐标系。

最后是层级：SVG 没有 z-index，v3.4 提供 zIndex prop 和 ZIndexLayer 包裹组件做分层，注意只在单个图表内生效，条件渲染会改插入顺序，层级要显式声明。
-->

---

# 动画：默认尊重系统偏好

```jsx
<Line dataKey="uv"
  isAnimationActive="auto"  // v3 默认：跟随 prefers-reduced-motion
  animationBegin={300}      // 首渲延迟 ms
  animationDuration={400} animationEasing="spring"
  onAnimationEnd={done} />
```

- `animationEasing`：ease（默认）/ ease-in(-out) / linear / **spring** / `cubic-bezier(…)` / 自定义函数
- **v3.9 新 `animationMatchBy`**：数据更新时新旧点的配对方式（按索引 / dataKey / 自定义函数），决定过渡动画形态
- SSR、截图、测试断言场景：置 `isAnimationActive={false}`——**动画中间态的 DOM 量值不可信**

<!--
动画四件套：isAnimationActive 开关——v3 默认值是 auto，尊重系统的 prefers-reduced-motion 设置，用户系统开了减少动效就不放动画，true 强开、false 关闭；animationBegin 首渲延迟；animationDuration 默认 400 毫秒；animationEasing 除了常规缓动还支持 spring 弹簧、cubic-bezier 字符串、甚至自定义的 0 到 1 函数。回调有 onAnimationStart 和 onAnimationEnd。

v3.9 的新特性 animationMatchBy：数据更新时决定新旧数据点怎么配对——按索引、按追加、按 dataKey 还是自定义函数，配对方式不同，过渡动画的形态完全不同，比如时间序列滚动追加时用它做平滑推移。

实践提醒：SSR 想稳定首帧输出、E2E 截图、测试断言 DOM 量值，都要把 isAnimationActive 关掉——动画进行中路径和柱高都是中间态，断言必然抖动。
-->

---

# 性能：SVG 的能力边界

- 瓶颈本质：**每个数据点 = 一个 SVG DOM 节点**，大数据 + 高频 mousemove ⇒ 全图重渲
- ① 引用稳定：data / 函数 dataKey / 自定义组件用 `useMemo` / `useCallback` 固定（**内联 dataKey 是头号隐形杀手**）
- ② 组件隔离：频繁变化的部分拆成独立 memo 组件，静态图形不跟着渲
- ③ 关动画 + 关 dot：`isAnimationActive={false}`、`dot={false}`（千点折线 dot 是 DOM 大头）
- ④ 降采样 / 聚合：官方直问"5 万个点用户真的读得懂吗"——先分箱 / 抽稀再画
- ⑤ mousemove 处理器 debounce；React DevTools Profiler + 火焰图定位
- **经验阈值：几千点内可用；万级+点、实时高刷 ⇒ 换 Canvas 系**（ECharts / Chart.js）或 WebGL

<!--
性能这页决定你什么时候能用 Recharts。瓶颈本质一句话：每个数据点都是真实的 SVG DOM 节点——dot、柱子的 rect、路径上的点，数据量大时 DOM 线性膨胀，再叠加高频 mousemove 触发全图重渲，就卡了。

官方性能指南的优化清单：第一，引用稳定——data、函数 dataKey、自定义组件都用 useMemo、useCallback 固定，内联 dataKey 每次渲染都是新引用，导致全量重算，是头号隐形杀手，可以上 eslint-plugin-react-perf 兜底；第二，组件隔离，频繁变化的部分拆成独立 memo 组件，静态图形不跟着渲染；第三，关动画、关 dot；第四，降采样——官方文档原话反问"5 万个点用户真的读得懂吗"，先用 d3.bin 之类分箱聚合再画；第五，mousemove 防抖，配 React DevTools Profiler 和火焰图定位热点。

经验阈值：几千点以内 Recharts 没问题；万级以上数据点、行情监控这类实时高刷场景，SVG 模型撑不住，换 Canvas 系的 ECharts、Chart.js 或 WebGL 方案。
-->

---

# v2 → v3 迁移要点

<div class="text-sm">

- 状态管理整体重写：去 class、内部 store、+3500 单测——**`CategoricalChartState` 彻底移除**（事件回调与 `Customized` 不再注入）
- **defaultProps 警告根治**：React 18.3+ 刷屏警告（issue #3615）在 v3 消失
- `accessibilityLayer` 默认 **true**：方向键在数据点间导航、支持屏幕阅读器
- 移除 props：series `activeIndex` → Tooltip `defaultIndex` / `active` 受控；`alwaysShow` / `isFront` → `ifOverflow` + `zIndex`；Legend `payload`
- 类型改名：`TooltipProps` → **`TooltipContentProps`**
- `Cell` 标记废弃（v4 移除；最后一处 react-is 依赖）→ 改用 `shape` / `content`
- 新能力：Tooltip / Legend `portal`、YAxis `width="auto"`、symlog、SunburstChart、公开 hooks
- 环境：React 16.8+ / TS 5+ / Node 18+ / ES6 产物；删 recharts-scale、react-smooth

</div>

<!--
v2 到 v3 是一次大版本重写，迁移要点按重要性过一遍。

第一，内部状态管理整体重写：去 class 化、引入内部 store，新增约 3500 个单测。最大的破坏性变化是 CategoricalChartState 彻底移除——v2 里事件回调能拿到 activeTooltipIndex、activePayload，Customized 组件能注入内部状态，这些全没了，读激活态改用 Tooltip 的受控 props 和新 hooks，靠它的自定义组件是迁移重灾区。

第二，defaultProps 警告根治：React 18.3 之后控制台被"Support for defaultProps will be removed"刷屏，就是著名的 issue 3615，v3 改成 JS 默认参数后消失——升 v3 的最直接动力之一。

第三，可及性默认开启：accessibilityLayer 默认 true，方向键能在数据点之间移动 Tooltip，支持屏幕阅读器。

其余对着清单核对：activeIndex 受控高亮收敛到 Tooltip；参考系的 alwaysShow、isFront 换 ifOverflow 加 zIndex；自定义 Tooltip 类型改名 TooltipContentProps；Cell 标废弃。环境要求 React 16.8、TS 5、Node 18 起步，产物 ES6 不再带 ES5 polyfill。
-->

---

# 易错点 Top 8

<div class="text-sm">

1. **ResponsiveContainer 父高度 0 ⇒ 整图不渲染**（最高频）——固定 height / flex 传高 / `responsive` + aspectRatio
2. 数字数据落 category 轴 ⇒ 等距失真、按出现序排——显式 `type="number"`
3. 堆叠忘 `stackId` ⇒ 柱子 / 面积重叠遮挡
4. 自定义 Tooltip 不判 `active` / `payload` ⇒ 空数组解构直接崩
5. `payload[0].payload` 才是原始数据行——两层同名混淆取错值
6. SVG/HTML 混淆：tick / shape 返回 `<div>` 不渲染；Legend content 返回 SVG 同样错
7. log 轴不给 domain 或含 0 ⇒ 异常；ReferenceLine 出界默认 discard 不画
8. 内联函数 `dataKey` ⇒ 每次渲染全量重算，大数据卡顿首因

</div>

<!--
易错点集中放送，全是实战里真会撞上的。

第一名毫无悬念：ResponsiveContainer 的父容器高度是 0，整张图不渲染，页面一片空白。第二：数字数据落在默认 category 的 X 轴上，点与点等距、按出现顺序排，图形完全失真。第三：堆叠忘写 stackId，柱子互相遮挡，看起来像只有一个 series。

第四和第五都在自定义 Tooltip 里：不先判 active 和 payload 非空，空数组解构直接崩；payload 数组每项里还有个同名 payload 字段才是原始数据行，两层搞混就取错值。

第六是 SVG 和 HTML 的边界：tick、shape 属于 SVG 上下文，返回 div 不渲染；Legend 的 content 反过来必须返回 HTML。第七：log 轴必须显式 domain 且不能含 0；ReferenceLine 目标值出界默认被 discard 丢弃，要 extendDomain。第八回到性能：内联函数 dataKey 每次渲染都是新引用，大数据卡顿的第一嫌疑人。
-->

---

# 选型：React 项目怎么挑

| 维度 | Recharts | Chart.js | ECharts | visx |
|---|---|---|---|---|
| 范式 | **JSX 组合声明** | Canvas 命令式 | option 大对象 | D3 原语自拼 |
| 渲染 | SVG | Canvas | Canvas / SVG | SVG |
| 大数据 / 高刷 | 弱 | 强 | 强（内建降采样） | 看实现 |
| React 契合 | **最高** | 低（包装层） | 低（两套心智） | 高（样板多） |
| 周下载 | **51.5M** | 12.8M | 3.7M | 量级更小 |

- 常规 Dashboard / 千点内 / 要与组件状态深度联动 ⇒ **Recharts 默认首选**
- 万级+点、实时高刷（行情 / 监控）⇒ Canvas 系；地图 / 3D / 复杂大屏 ⇒ ECharts
- 设计系统级完全定制 ⇒ visx / D3 手写；**非 React 技术栈 ⇒ Recharts 直接出局**（强绑 React）

<!--
选型收尾。四个候选放一起看：Recharts 是 JSX 组合声明加 SVG；Chart.js 是 Canvas 命令式，React 里要靠 react-chartjs-2 包装；ECharts 是 option 大对象，功能最广——3D、地图、dataZoom 都内建，但跟 React 状态是两套心智；visx 是 D3 原语级的积木，自由度无上限、样板代码也最多。

决策路径：React 项目做常规 Dashboard、后台报表，数据千点以内，要快速交付、要跟组件状态深度联动——Recharts 默认首选，5150 万周下载也说明这是主流共识。万级以上数据点、行情监控类实时高刷，上 Canvas 系。要地图、3D、复杂大屏，ECharts 功能广度无敌。设计系统级的完全定制视觉，visx 或 D3 手写。

最后一条边界别忘：Recharts 强绑 React，Vue、Svelte 或原生项目直接出局。
-->

---
layout: intro
---

# 总结

Recharts = **React 组件组合声明图表的 SVG 库**（v3.9）

- 图表即 JSX 树：加部件 = 加子组件；混合用 `ComposedChart`；双轴 `yAxisId` 配对
- 两大铁律：容器要有确定宽高才渲染；数字数据显式 `type="number"`
- 定制三板斧：Tooltip `content`（`payload.payload` 原始行）、`shape` 自绘（`Cell` 已废弃）、v3 hooks
- 性能边界：千点内首选；万级+ / 实时高刷换 Canvas 系
- 文档：recharts.github.io（recharts.org 已 404）

<!--
总结。Recharts 是用 React 组件组合声明图表的 SVG 库，当前 v3.9。

核心心智：图表就是 JSX 组件树，加图例、加网格都是加一行子组件；混合图表换 ComposedChart，双轴用 yAxisId 配对。

两大铁律防翻车：图表必须有确定宽高才渲染——ResponsiveContainer 的父容器坑；数字数据要给显式 number 轴，别落进默认 category。

定制三板斧：Tooltip 自定义 content 记住 payload 结构和两层同名；逐项着色用 shape 替代已废弃的 Cell；深度定制上 v3 公开 hooks。

性能上认清 SVG 边界：千点内它是 React 项目最顺手的选择，万级以上换 Canvas 系。文档在 recharts.github.io，老域名已 404。谢谢大家。
-->
