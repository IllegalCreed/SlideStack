---
theme: seriph
background: https://cover.sli.dev
title: AntV X6 — 图编辑引擎
info: |
  Presentation AntV X6 — 蚂蚁集团开源的图编辑引擎。

  Learn more at [https://x6.antv.antgroup.com](https://x6.antv.antgroup.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🔗</span>
</div>

<br/>

## AntV X6 — 图编辑引擎

蚂蚁集团开源，基于 HTML+SVG 的图编辑引擎，当前 v3.1.7

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/antvis/X6" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 AntV X6，蚂蚁集团开源的图编辑引擎。

官方原话：X6 是基于 HTML 和 SVG 的图编辑引擎，提供低成本的定制能力和开箱即用的内置扩展，方便快速搭建 DAG 图、ER 图、流程图、血缘图等应用。

版本背景：这次任务原计划调研对象是 X6 v2，但 npm 实测 @antv/x6 当前 latest 是 3.1.7，2026-03-18 发布，官方文档站首页和全部教程默认展示的也是 3.x API。v3 转正（3.0.1，2025-11-22）距今约 8 个月，是非常新的大版本切换，本次内容按 3.1.7 实测撰写，同时系统梳理 v2→v3 的变化点。

顺序：定位 → Graph 画布 → 节点 → 边 → 连接桩 → 连接交互 connecting（重点）→ 交互能力 → 历史/剪贴板/快捷键 → 插件 → 自定义节点 → 动画 → 序列化 → 群组嵌套 → 事件 → v2→v3 迁移 → 易错点 → 选型对比 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 定位一句话 + 评价

> "X6 是基于 HTML 和 SVG 的图编辑引擎，提供低成本的定制能力和开箱即用的内置扩展"——官方定位

<v-clicks>

- 四大特性：**极易定制**/**开箱即用**(10+ 插件)/**数据驱动**(MVC)/**事件驱动**
- 服务场景：DAG 图、ER 图、流程图、血缘图等**交互式编辑**画布
- 渲染：SVG 承载骨架 + `shape:'html'` 用 `foreignObject` 内嵌任意 HTML/Vue/React
- 代价：大图 DOM 节点数是瓶颈，几百节点起掉帧（G6 Canvas 方案数千节点仍流畅）
- 对比 **G6**：G6 是"图可视化/分析"引擎（只读展示），X6 是"图编辑"引擎（交互编辑）——**必考选型题**

</v-clicks>

<!--
先说定位。官方原话是这句引用：基于 HTML 和 SVG 的图编辑引擎，提供低成本定制能力和开箱即用的内置扩展。四大特性：极易定制——SVG/HTML/React/Vue/Angular 均可定制节点；开箱即用——10 多个内置扩展，框选、对齐线、小地图等；数据驱动——MVC 架构；事件驱动——图内任何操作皆可监听。

服务场景是 DAG 图、ER 图、流程图、血缘图这类需要用户在画布上增删改连线的交互式编辑场景。

渲染上，X6 用 SVG 承载节点和边的图形骨架，同时 shape: 'html' 节点用 foreignObject 内嵌任意 HTML，这样可以把 Vue/React 组件直接种进节点里，这是相比纯 Canvas 方案最大的差异化能力。但代价是大图场景 DOM 节点数会成为性能瓶颈，通常几百节点开始掉帧，而 G6 的 Canvas 方案在几千节点仍然流畅。

最后是本领域必考的选型题：G6 是"图可视化/分析"引擎，面向关系数据的只读展示加图算法；X6 是"图编辑"引擎，面向用户在画布上的交互式编辑。两者共享"图"这个数据结构，但服务的用户操作完全不同，后面选型页会有完整对比表。
-->

---

# Graph 画布：容器与基础配置

```javascript
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'), // 渲染挂载点
  width: 800,
  height: 600,
  autoResize: true,                    // 容器变化自动适配
  grid: { visible: true, type: 'doubleMesh', size: 10 }, // 网格
  background: { color: '#F2F7FA' },
  panning: true,                       // 3.x 默认开启，2.x 默认关闭
  mousewheel: true,                    // 滚轮缩放
})
```

<div v-click class="mt-3 text-sm">

> 常用实例方法：`resize()`/`translate()`/`zoom()`/`zoomToFit()`/`centerContent()`/`fromJSON()`/`toJSON()`

</div>

<!--
第一步，创建 Graph 实例。container 是必须的渲染挂载点，需要有明确宽高的 DOM 元素。width/height 设画布尺寸，autoResize 让画布在容器尺寸变化时自动适配。

grid 配置网格线，type 除了这里的 doubleMesh 双线网格，还有 dot、fixedDot、mesh 等取值。background 设背景色，也支持背景图片。

两个交互开关要特别注意版本差异：panning 控制鼠标拖拽平移画布，3.x 默认开启，2.x 默认是关闭的，这是 v3 交互默认值变化之一，升级后可能出现"意外可以拖拽画布"的行为差异；mousewheel 控制滚轮缩放。

创建之后常用的实例方法：resize 重设尺寸、translate 平移、zoom/zoomTo/zoomToFit 缩放系列、centerContent 内容居中、fromJSON/toJSON 做数据读写，这两个方法在后面序列化章节会展开。
-->

---

# 节点 Node：内置形状与 markup/attrs

内置形状：`rect`/`circle`/`ellipse`/`polygon`/`polyline`/`path`/`image`/`html`（`foreignObject` 渲染任意 HTML）

```javascript
graph.addNode({ shape: 'rect', x: 100, y: 40, width: 100, height: 40 })
```

<v-clicks>

- **markup**：定义节点由哪些 SVG 元素组成（如 `rect`+`text`），元素带 `selector`
- **attrs**：以 selector 为 key 映射样式，如 `{ body: { fill: '#fff' }, label: { text: 'hi' } }`
- 基础属性：`x`/`y`/`width`/`height`（默认 1）/`angle`（默认 0）/`visible`/`zIndex`
- 修改已有节点：`node.prop('size', {...})`、`node.attr('rect/fill', '#ccc')`
- 自定义形状：`Node.register()` / `Graph.registerNode()` 注册复用

</v-clicks>

<!--
节点部分，先看内置形状：矩形、圆形、椭圆、多边形、折线、路径、图片，还有 html——借助浏览器原生的 foreignObject 元素渲染任意 HTML 片段，这是 X6 定制能力的关键入口。addNode 最简单的调用只需要 shape 加位置尺寸。

真正的定制核心机制是 markup 加 attrs，类比 HTML 结构加 CSS 样式。markup 定义节点由哪些 SVG 元素组成，比如一个 rect 加一个 text，每个元素带 selector 供 attrs 定位；attrs 以 selector 为 key，把样式属性映射到对应元素，比如 body 设填充色，label 设文字内容。

基础属性：x/y 是位置，width/height 是尺寸，默认都是 1，容易忘记设置导致节点看不见；angle 旋转角度默认 0；还有 visible 和 zIndex。创建后修改用 node.prop 改整体属性、node.attr 按路径改单个样式。

自定义形状想要复用配置，用 Node.register 或者 Graph.registerNode 注册，注册后就能像内置形状一样通过 shape 字符串直接使用。
-->

---

# 边 Edge：source/target 四种写法

```javascript
// 节点引用 / 节点 ID / 坐标点 / 带 port 信息，四种写法
graph.addEdge({ source: rect1, target: rect2 })
graph.addEdge({ source: 'rect1', target: 'rect2' })
graph.addEdge({ source: 'rect1', target: { x: 100, y: 120 } })
graph.addEdge({
  source: { cell: rect1, port: 'out-port-1' },
  target: { cell: 'rect2', port: 'in-port-1' },
})

// vertices：边途经的路径点
graph.addEdge({ source: rect1, target: rect2, vertices: [{ x: 100, y: 200 }] })
```

<div v-click class="mt-3 text-sm">

> 修改已有边：`edge.prop('target', {...})`、`edge.attr('line/stroke', '#ccc')`

</div>

<!--
边的 source/target 有四种写法：直接传节点引用对象；传节点 ID 字符串；传坐标点对象，这种边不连接到任何节点，纯粹连到画布上的一个点；还有带 port 信息的写法，通过 cell 加 port 两个字段精确指定连接到哪个节点的哪个连接桩，port 的配置会在下一节展开。

这四种写法可以在 source 和 target 上自由搭配，比如 source 是节点、target 是坐标点，画一条"半连接"的边也是常见需求。

vertices 是边按顺序途经的路径点数组，配合下一页的 router 路由算法一起决定边的实际折线形状，vertices 提供"控制点"，router 决定"怎么把这些点连成线"。

修改已有边同样有 prop 和 attr 两个方法：edge.prop 改起止点这类结构性属性，edge.attr 按路径改样式，比如改线条颜色。
-->

---

# 边 Edge：router / connector / marker / labels

| 配置 | 可选值 |
|---|---|
| `router` 路由 | normal / orth / oneSide / manhattan / metro / er |
| `connector` 连接器 | normal / rounded / smooth / jumpover |
| `marker`(9种) | block/classic/diamond/cross/async/path/circle/circlePlus/ellipse |

```javascript
graph.addEdge({ router: 'orth', connector: 'smooth' })
graph.addEdge({ labels: ['edge'] })  // 简化写法，也支持完整对象数组
```

<div v-click class="mt-2 text-sm">

> marker 通过 `attrs.line.sourceMarker`/`targetMarker` 配置，支持对象自定义参数如 `{ name: 'ellipse', rx: 10, ry: 6 }`

</div>

<!--
边的视觉表现由三层机制叠加控制。router 路由算法处理 vertices 生成实际折线路径：normal 最简单、orth 走正交折线、oneSide 强制从一侧出线、manhattan 曼哈顿路由自动避障、metro 地铁图风格 45 度角、er 是 ER 图专用路由。写法上可以简写字符串，也可以写成 { name, args } 对象传参数。

connector 连接器决定 vertices 之间怎么画线：normal 直线或折线、rounded 圆角过渡、smooth 贝塞尔平滑曲线、jumpover 遇到跨越其他边时画出"跳线"缺口效果，常用于流程图里线条交叉的场景。

marker 箭头内置 9 种，通过 attrs.line.sourceMarker 和 targetMarker 分别配置起止两端，也支持对象形式自定义参数，比如指定椭圆的半径。

labels 标签支持完整对象数组写法，也支持最简化的字符串数组写法，日常场景优先用简化写法。
-->

---

# 连接桩 Port：分组与布局

**position 内置布局**：`absolute`/`left`/`right`/`top`/`bottom`(矩形四边均匀分布)/`line`(沿线分布)/`ellipse`/`ellipseSpread`(椭圆弧分布)

```javascript
graph.addNode({
  shape: 'rect', x: 40, y: 40, width: 100, height: 40,
  ports: {
    groups: { in: { position: 'top', attrs: { circle: { r: 4, fill: '#fff' } } } },
    items: [{ id: 'port1', group: 'in' }],
  },
})
```

<div v-click class="mt-3 text-sm">

> ⚠️ **易混淆**：Port 分组**不**声明连接规则——"哪些桩允许连接"由 Graph 级别的 `connecting` 统一校验，Port 只管视觉布局

</div>

<!--
连接桩 Port 用两层结构配置：groups 定义分组的通用样式和布局，items 定义每个具体的连接桩实例，实例可以覆盖分组的默认配置。

position 内置了多种布局算法：absolute 是绝对定位；left/right/top/bottom 沿矩形对应边均匀分布，这是流程图节点最常用的布局；line 沿一条指定的直线均匀分布；ellipse 和 ellipseSpread 沿椭圆弧分布或均匀分布，适合圆形节点。

这一页有个容易被问到的易混淆点：Port 分组本身不声明"哪些连接桩允许被连接"这类规则，很多新手会习惯性地去 ports.groups 里找 connectable 之类的字段，但实际上连接规则统一收敛在 Graph 级别的 connecting 配置里，下一页会展开。Port 只负责视觉呈现和坐标布局。

另外官方教程页也没有提供"仅 hover 时显示连接桩"这种交互细节的声明式配置，通常需要结合 CSS 的 opacity/visibility 和鼠标事件自己实现。
-->

---

# 连接交互 connecting（1/2）：核心配置 ★必考

```javascript
const graph = new Graph({
  connecting: {
    snap: true,              // 吸附对齐
    allowBlank: true,        // 允许连到空白处
    allowLoop: true,         // 允许自环
    allowNode: true,         // 允许连到节点本身
    allowEdge: true,         // 允许连到另一条边
    allowPort: true,         // 允许连到连接桩
    allowMulti: true,        // 同起止点可多条边
    highlight: true,         // 拖拽时高亮可用目标
  },
})
```

<div v-click class="mt-3 text-sm">

> 六个 `allow*` 布尔开关默认基本为 `true`；`allowMulti` 也可填 `'withPort'` 仅限定端口维度

</div>

<!--
connecting 是这次的重点，几乎是图编辑引擎的必考题——它是 Graph 构造配置里的一个对象字段，统一控制"拖拽创建或移动边"这整个生命周期的规则。

六个 allow 开头的布尔开关默认基本都是 true：allowBlank 允许连接到画布空白处；allowLoop 允许自环，也就是连接到自身；allowNode 允许边直接连到节点本体而不仅仅是连接桩；allowEdge 允许边连到另一条边上；allowPort 允许边连到连接桩；allowMulti 控制同一起止点之间是否允许多条边，还可以填字符串 'withPort'，表示仅在端口维度去重。

snap 控制拖拽时的吸附效果，可以是简单的布尔值，也可以写成对象形式指定吸附半径和锚点类型。highlight 控制拖拽过程中是否高亮显示可用的连接目标，具体的高亮样式在下一页的 highlighting 配置里定制。

记住这些字段都在 connecting 这一个地方统一配置，而不是分散在 Port 或者 Edge 上，这是理解 X6 连接机制的关键。
-->

---

# 连接交互 connecting（2/2）：校验时机与高亮

| 回调 | 触发时机 |
|---|---|
| `validateMagnet(...)` | 按下 magnet 时，校验能否起始新边 |
| `validateConnection(...)` | 拖动过程中，持续校验目标是否有效 |
| `validateEdge(...)` | 松手停止后最终校验，返回 `false` 则清除 |

```javascript
new Graph({ highlighting: { magnetAvailable: { name: 'stroke', args: { attrs: { stroke: 'red' } } } } })
```

<div v-click class="mt-2 text-sm">

> `connectionPoint`(默认 `boundary`) 决定线段落在元素**边框**哪点；`anchor`(默认 `center`) 决定计算方向的参照基准，两者可各自配 source/target 版本

</div>

<!--
connecting 还提供三个校验回调，触发时机完全不同，这也是常考的辨析点。validateMagnet 在按下连接桩、准备起始一条新边的那一刻触发，校验能不能从这里开始连线；validateConnection 在拖动过程中持续触发，每次移动到新的候选目标都会重新校验；validateEdge 在松手停止拖动之后触发，是最终校验，如果返回 false，这条边会被直接清除掉。三个回调分别对应"起点合法性"、"过程中目标合法性"、"最终结果合法性"三个阶段。

highlighting 顶层配置负责各阶段高亮的具体样式，可以针对 default、embedding、nodeAvailable、magnetAvailable、magnetAdsorbed 这几个阶段分别定制，内置高亮器有 stroke 描边和 className 加类名两种。

最后一组容易混淆的概念：connectionPoint 默认 boundary，决定线段最终落在元素边框上的哪一点；anchor 默认 center，决定计算连接方向时参照元素的哪个基准点。两者是两个独立的计算步骤，都可以分别给 source 和 target 配置不同的取值。
-->

---

# 交互能力：Selection / Snapline / Transform

| 插件 | 关键配置 |
|---|---|
| **Selection** 框选 | `rubberband`/`rubberNode`/`rubberEdge`/`strict`/`multiple`/`filter` |
| **Snapline** 对齐线 | `tolerance`(默认10px)/`sharp`/`resizing`/`clean` |
| **Transform** 变换 | `resizing:{minWidth,maxWidth}` / `rotating:{grid}` |

```javascript
import { Graph, Selection, Snapline, Transform } from '@antv/x6' // 3.x 起均从主包导出
graph.use(new Selection({ enabled: true, rubberband: true }))
```

<!--
交互能力这一组是画布编辑体验的三大支柱，v3 起都统一从主包导出，用法是 graph.use(new Xxx())。

Selection 框选：rubberband 开启拖拽框选，rubberNode/rubberEdge 分别控制框选是否圈中节点和边，strict 严格模式要求选框完全包裹节点才算选中，multiple 允许多选，filter 可以按条件排除某些形状参与选择，比如排除圆形节点。

Snapline 对齐线：tolerance 默认 10 像素，是触发对齐提示的距离阈值；sharp 决定用短线段还是通栏整线表示对齐；resizing 控制缩放节点时是否也计算对齐线；clean 控制对齐线多久之后自动消失，默认 3 秒。

Transform 变换：resizing 里的 minWidth/maxWidth 限制缩放范围，orthogonal 限制只能等比缩放；rotating 的 grid 参数控制每次旋转的角度步进，比如设成 15 度一档。三者都提供了对应的 enable/disable/set 系列方法做运行时动态调整。
-->

---

# 撤销重做 / 快捷键 / 剪贴板

| 插件 | 核心 API |
|---|---|
| **History** | `undo()`/`redo()`/`canUndo()`；`startBatch()`+`stopBatch()` 合并记录 |
| **Keyboard** | `bindKey()`/`unbindKey()`；`global:true` 绑定 document |
| **Clipboard** | `copy()`/`paste({offset})`；`useLocalStorage` 跨会话持久化 |

```javascript
graph.use(new History({ stackSize: 0 }))       // 0 = 不限栈深
graph.use(new Keyboard({ enabled: true }))
graph.bindKey('ctrl+z', () => graph.undo())
```

<div v-click class="mt-2 text-sm">

> 连续多次 `addNode`/`updateData` 若不包在 `startBatch`/`stopBatch`（或 `batchUpdate()`）里，`undo()` 一次只撤销最后一步

</div>

<!--
这三个插件都是提升编辑效率的生产力工具。History 撤销重做：stackSize 设 0 表示不限制撤销栈深度，undo/redo 加 canUndo/canRedo 是标准的判断加执行接口。

Keyboard 快捷键：bindKey 绑定组合键，global 设 true 会把监听绑定到 document 而不仅仅是画布容器，这样即使焦点不在画布上也能响应快捷键。

Clipboard 剪贴板：copy 和 paste 是核心方法，paste 的 offset 参数控制粘贴时相对原位置的偏移量，避免粘贴出来的内容和原内容完全重叠；useLocalStorage 决定复制的内容是否借助浏览器本地存储跨会话持久化，也就是关闭页面重新打开还能不能粘贴。

有一条常见的坑要单独强调：History 记录默认是按操作粒度的，连续多次 addNode 或者 updateData 如果不显式包在 startBatch 和 stopBatch 之间，或者用 batchUpdate 函数式写法包起来，undo 一次只会撤销最后一步操作，而不是撤销整批变更，很多人会把这个行为误认为是 bug。
-->

---

# 插件：Stencil 模具面板 / Dnd 拖拽

**Dnd** 是底层拖拽能力，**Stencil** 是基于 Dnd 封装的模具面板（侧边栏拖拽创建节点的完整 UI）

```javascript
import { Graph, Stencil, Dnd } from '@antv/x6' // v3 起插件全部整合进主包

const stencil = new Stencil({
  target: graph,
  groups: [{ name: 'group1', title: '基础图形' }],
  layoutOptions: { columns: 2, rowHeight: 'auto' },
})
stencil.load([graph.createNode({ shape: 'rect' })], 'group1')

const dnd = new Dnd({ target: graph }) // 更底层：适合自定义拖拽源
```

<!--
Stencil 和 Dnd 是一组配合关系：Dnd 是更底层的手动拖拽能力，适合自己实现自定义的拖拽源；Stencil 是在 Dnd 基础上封装的完整模具面板 UI，也就是常见的"侧边栏拖拽创建节点"组件。

Stencil 配置：target 指向要拖入的目标 Graph；groups 定义分类分组，支持 collapsable 折叠；还支持 search 关键字过滤；layoutOptions 控制面板内节点的排列方式，比如这里的两列布局。用 stencil.load 把预先创建好的节点模板加载进某个分组，拖拽到画布上就会克隆出一个新节点。

Dnd 用法更底层：手动调用 dnd.start 传入一个用 graph.createNode 创建好的节点和原生事件对象，开始一次拖拽流程，还支持 getDragNode/getDropNode 回调对拖拽中或者落地后的节点做进一步变换。

特别提醒：这次任务的一个重要发现是，v3 把 Selection/Transform/Scroller/Keyboard/History/Clipboard/Snapline/Dnd/Minimap/Stencil/Export 这 11 个独立插件包，连同 x6-common 和 x6-geometry，全部整合进了主包 @antv/x6，一个 npm install 就够了，graph.use 的用法完全不变，只是导入路径从各自的插件包改成了主包。
-->

---

# 插件：MiniMap / Export / Scroller

```javascript
graph.use(new MiniMap({ container: el, width: 300, height: 200, scalable: true }))

graph.use(new Export())
graph.exportPNG('file-name')     // 直接触发下载
graph.toPNG((dataUri) => {})     // 返回 dataURI（回调形式），toJPEG/toSVG 同理

graph.use(new Scroller({ enabled: true, pannable: true }))
```

<div v-click class="mt-3 text-sm">

> ⚠️ 启用 `Scroller` 会**默认禁用**画布原生 `panning`，需用 Scroller 自身 `pannable` 替代

</div>

<!--
MiniMap 小地图需要一个独立的 container 挂载点，和主画布分开；scalable 加 minScale/maxScale 控制小地图自身能不能缩放以及缩放范围。

Export 导出插件提供两组方法：exportPNG/exportJPEG/exportSVG 系列会直接触发浏览器下载，适合"一键导出"场景；toPNG/toJPEG/toSVG 系列是回调形式，返回的是 dataURI 字符串而不直接下载，适合需要拿到图片数据自己处理的场景，比如上传到服务器。两组方法名字很像但用途不同，容易记混。

Scroller 滚动画布适合超大画布的分页浏览场景，pageVisible 控制是否显示分页参考线。这里有个官方文档明确指出的坑：启用 Scroller 插件会默认禁用画布原生的 panning 拖拽，因为两者都想控制画布的移动，会互相冲突，所以 Scroller 内部会接管这部分逻辑，如果还想要拖拽平移的效果，需要改成配置 Scroller 自己的 pannable 选项，而不是指望 Graph 顶层的 panning 还生效。
-->

---

# 自定义节点：HTML / React / Vue shape

```javascript
// HTML 节点（主包内置）
Shape.HTML.register({ shape: 'custom-html', width: 160, height: 80,
  html() { return document.createElement('div') } })

// React 节点（独立包，需与主包版本对齐；2.0.8+ 仅支持 React 18+）
import { register } from '@antv/x6-react-shape'
register({ shape: 'custom-react', component: NodeComponent, effect: ['data'] })

// Vue 节点（独立包，需渲染 TeleportContainer，Vue3 用 Teleport 挂载）
import { register, getTeleport } from '@antv/x6-vue-shape'
register({ shape: 'custom-vue', component: ProgressVueComponent })
```

<div v-click class="mt-2 text-sm">

> HTML 最轻量无框架依赖；React/Vue 需装配套包+对齐大版本，且内部点击默认被节点拖拽捕获，常需 `stopPropagation`

</div>

<!--
自定义节点分三种技术路线。HTML 节点是主包内置的能力，Shape.HTML.register 注册，html 回调函数返回任意 DOM 元素，不依赖任何前端框架，是三种里最轻量的方案。

React 节点需要独立安装 @antv/x6-react-shape 包，并且要和主包大版本严格对齐；这里有个明确的版本限制，x6-react-shape 从 2.0.8 版本起只支持 React 18 及以上，低版本 React 项目要锁定 x6 2.x 配 x6-react-shape 2.0.8。effect 数组声明组件随哪些属性变化触发重渲染，这里的 data 表示 node.setData 之后组件会更新。

Vue 节点同样是独立包 @antv/x6-vue-shape，用法上多一个步骤：必须在应用根部渲染 getTeleport 返回的 TeleportContainer 组件，因为 Vue3 用 Teleport 机制把节点内容挂载到对应的 DOM 位置，组件内部通过 inject('getNode') 拿到当前节点实例。

三者都有一个官方文档没有系统说明、但实践中很常见的坑：节点内部的按钮点击默认会被节点自身的拖拽或者选中手势捕获，通常需要在组件内部按钮上调用 stopPropagation 阻止事件冒泡，这个需要自己动手验证摸索。
-->

---

# 动画系统 animate（v3 全新特性）

```javascript
// 命令式：属性路径用 '/' 分隔
node.animate({ 'position/x': 300 }, { duration: 1000, direction: 'alternate', iterations: Infinity })

// 声明式：随节点添加自动触发
graph.addNode({
  shape: 'rect', x: 100, y: 140, width: 100, height: 50,
  animation: [[{ 'position/x': 300 }, { duration: 1000, iterations: Infinity }]],
})
```

<v-clicks>

- 基于 **Web Animations API** 标准；播放控制：`pause()`/`play()`/`cancel()`/`finish()`/`reverse()`
- **完全替代** v2.x 的 `transition`（官方原文"移除 2.x 中的 transition 使用方式"），API 不兼容需重写

</v-clicks>

<!--
动画系统是 v3 的全新特性，官方原话是"移除 2.x 中的 transition 使用方式"，这是一个 API 不兼容的重写，升级项目里所有动画代码都要重新写。

命令式用法：node.animate 第一个参数是关键帧目标值，属性路径用斜杠分隔，比如 position/x 表示位置的 x 分量；第二个参数是配置，duration 时长、direction 设 alternate 表示往返、iterations 设 Infinity 表示无限循环。这里还有个细节，自定义的 data 字段一样可以做动画，比如某个业务上的进度比例。

声明式用法更简洁：在 addNode 的时候直接传 animation 数组，节点一添加就自动触发，不需要额外调用代码。

技术底座是浏览器标准的 Web Animations API，所以播放控制方法也是标准化的：pause/play/cancel/finish/reverse/updatePlaybackRate，这些概念熟悉 CSS 动画或者 Web Animations API 的同学会很眼熟。记住这一条：v3 项目里网上能搜到的旧 transition 相关示例已经完全失效，必须改成这里的 animate 写法。
-->

---

# 序列化与业务数据

```javascript
// 整图导出/导入
const json = graph.toJSON()                    // { cells: [...] }
graph.fromJSON({ nodes: [...], edges: [...] })  // 或直接传 cells 数组

// 单元格业务数据（区别于 attrs 视觉属性）
cell.setData({ price: 99 })                     // 默认深度合并
cell.setData(newData, { overwrite: true })      // 整体替换
cell.getData()
cell.toJSON({ diff: true })                     // 只导出与默认值的差异字段
```

<!--
整图数据的导出导入是持久化的核心。graph.toJSON 返回 { cells: [...] } 结构，节点和边分别包含 id、shape、position、size、attrs、zIndex 等字段；graph.fromJSON 可以传 { nodes, edges } 分开的形式，也可以直接传统一的 cells 数组，两种格式都支持。

单元格上还有一层业务数据的概念，用 data 字段承载，要和 attrs 视觉属性区分开——data 是自己的业务字段，比如客户 ID，attrs 是纯粹给 SVG 元素用的样式。

setData 默认是深度合并，也就是新数据会和已有数据合并而不是整体替换，这是最容易踩的坑之一：如果想清空某个字段或者整体替换，必须显式传第二个参数 { overwrite: true }，否则旧值会残留，看起来像是没生效。getData 单纯读取。

toJSON 还支持 { diff: true } 参数，只导出和默认值不同的字段，用于精简持久化的数据体积，大规模图场景下能显著减少存储和传输开销。
-->

---

# 群组嵌套 embedding

```javascript
child.setParent(parent); parent.addChild(child)
parent.getChildren(); child.getParent(); child.hasParent()
node.getAncestors(); node.getDescendants({ breadthFirst: true })
node.isDescendantOf(root); node.getCommonAncestor(node2, node3)

// 开启自动建立父子关系
new Graph({ embedding: { enabled: true, findParent({ node }) { /* 返回目标父节点 */ } } })
```

<div v-click class="mt-3 text-sm">

> 节点移动时通过 `findParent` 返回的节点自动建立父子关系；折叠展开需自定义节点类结合 `getDescendants()` 控制 `hide()`/`show()`

</div>

<!--
父子关系，也就是群组或者嵌套，是 X6 组织复杂图结构的机制。基础的增删查 API：setParent/addChild 建立关系，getChildren/getParent/hasParent 做基础查询。

进阶的树形关系查询：getAncestors 拿全部祖先节点，getDescendants 拿全部后代，支持 breadthFirst 参数控制是广度优先还是默认的深度优先遍历；isDescendantOf 判断是否是某节点的后代，getCommonAncestor 找多个节点的最近公共祖先，这些在实现"展开某个分组下的所有子孙"这类功能时很有用。

要让节点拖拽时自动建立父子关系，需要开启 embedding 配置，enabled 设 true，再实现 findParent 回调，返回值决定当前拖拽的节点应该被哪个节点收编为子节点，官方没有内置自动判断逻辑，完全靠这个回调自己实现"落入哪个容器"的判断规则。

折叠展开这类交互 X6 没有现成 API，需要自定义节点类，结合 getDescendants 拿到全部子孙节点，再调用它们的 hide/show 方法手动实现。
-->

---

# 事件系统

```javascript
graph.on('cell:click', ({ e, x, y, cell, view }) => {})
graph.on('node:click', ({ e, x, y, node, view }) => {})
graph.on('blank:click', ({ e, x, y }) => {})
graph.on('edge:connected', ({ isNew, edge, previousCell, currentCell, previousPort, currentPort }) => {})
graph.on('node:change:position', ({ current, previous }) => {}) // change:xxx 细粒度事件
graph.off('node:click', handler)
```

<div v-click class="mt-3 text-sm">

> 分类速记：交互类(`click`/`dblclick`/`mouseenter`，均有 `cell:`/`node:`/`edge:`/`blank:` 前缀)、画布类(`scale`/`resize`)、生命周期类(`node:added`/`removed`)、连接类(`edge:connected`)

</div>

<!--
事件命名遵循"目标:动作"的格式。cell:click 是节点和边的通用点击事件，node:click 专门针对节点，blank:click 专门针对画布空白处点击，同一个交互在不同目标层级上都有对应的事件名。

edge:connected 是连接生命周期的终点事件，校验通过并且连接关系确定之后触发，参数里的 isNew 区分是新建连线还是移动已有连线的端点，previousCell/currentCell 和 previousPort/currentPort 记录变更前后的状态，这个事件最常用来把最终的连线结果持久化到后端。

change:xxx 系列是细粒度的属性变更事件，比如 node:change:position 监听位置变化，也可以直接在 cell 实例上用 cell.on 监听，不一定非要通过 graph 全局监听。graph.off 取消监听，用法和 DOM 事件的 addEventListener/removeEventListener 类似。

分类速记：交互类的 click/dblclick/contextmenu/mouseenter/mouseleave 都有 cell/node/edge/blank 四种前缀变体；画布类是 scale/resize/translate；生命周期类是 added/removed/changed/embedded；连接类就是刚才说的 edge:connected。
-->

---

# v2 → v3 迁移速查

| v2.x | v3.x |
|---|---|
| `@antv/x6-plugin-*`(11个独立包) | 全部整合进主包 `@antv/x6` |
| `import {X} from 'x6-plugin-xxx'` | `import {X} from '@antv/x6'` |
| `transition` 动画 | 基于 Web Animations API 的 `animate` |
| `panning` 默认关闭 | `panning` **默认开启** |
| `Portal.getProvider()`(react-shape) | 改名 `getProvider()` |
| 无大图优化 | 新增 `virtual: true` 虚拟渲染 |

<div v-click class="mt-3 text-sm">

> ⚠️ 框架 shape 包（vue/react/angular）**未整合**，仍需单独安装且必须与主包大版本对齐

</div>

<!--
v3 距今大约 8 个月，是非常新的大版本切换，存量教程和 AI 生成代码大概率还停留在 2.x 语法，这张速查表列出最高频的几条差异。

最核心的一条：2.x 时代 Selection/Transform/Scroller 等 11 个 x6-plugin-* 独立包，加上 x6-common 和 x6-geometry，v3 全部整合进了主包，导入路径要跟着改，但 graph.use 的调用方式完全不变。

动画系统从 transition 换成基于 Web Animations API 的 animate，这是 API 层面不兼容的重写。交互默认值也变了：panning 画布拖拽从 2.x 默认关闭改成 3.x 默认开启，升级后可能出现"意外能拖拽画布"的行为差异。React shape 的 Portal.getProvider 在 3.x 改名成了 getProvider，是个不起眼但会直接报错的破坏性变更。v3.1.x 还新增了 virtual: true 大图虚拟渲染，只渲染可视区域加缓冲边距，是应对 HTML/SVG 方案 DOM 节点数受限这个固有短板的官方对策。

特别提醒这条：框架 shape 包，也就是 vue/react/angular 三个，并没有被整合进主包，依然需要单独安装，而且必须和主包大版本号对齐，这是新手升级时最容易漏掉、也最容易踩的坑。
-->

---

# 易错点与坑

<v-clicks>

- **版本认知过时**：2.x 教程（`x6-plugin-*` 独立包）直接套 3.x 项目报"模块找不到"，反之亦然
- **插件已整合但 shape 包没有**：Vue/React/Angular shape 仍要单独装且严格对齐主包大版本
- **`Scroller` 与 `panning` 隐性冲突**：启用 Scroller 会覆盖并禁用原生 `panning`
- **Port 连接规则位置误判**：规则在 `connecting.allowPort`/`validateXxx`，Port 本身只管视觉布局
- **`setData()` 默认深度合并**：不传 `{ overwrite: true }` 时是合并，清空字段场景易残留旧值
- **markup 与 attrs selector 不匹配**：样式静默不生效（不报错），排查成本高
- **`animate` 与 `transition` 不能混用**：v3 项目网上搜到的 `transition` 示例已失效
- **自定义节点内部点击事件冒泡**：需显式 `stopPropagation`，避免同时触发拖拽/选中

</v-clicks>

<!--
挑八个高频坑收尾。第一，版本认知过时是最大风险，2.x 的独立插件包导入代码直接拿到 3.x 项目里跑，会报模块找不到，反过来 3.x 的 animate 或者主包导入语法拿到 2.x 项目也会报错，写代码前一定先确认项目实际锁定的版本。

第二，插件整合了但框架 shape 包没整合，这个上一页刚说过，是新手最容易踩的升级坑。第三，Scroller 和 panning 的隐性冲突，不了解这条规则容易误判成"配置不生效"。第四，Port 的连接规则位置误判，新手常去 ports.groups 里找限制连接的字段，实际统一在 connecting 里配置。

第五，setData 默认深度合并而不是整体替换，清空字段场景容易出现旧值残留的错觉 bug。第六，markup 和 attrs 的 selector 名字对不上，样式会静默不生效，不会报错，排查成本很高，一定要仔细核对两边的命名。第七，animate 和 transition 不能混用，网上搜到的旧 transition 示例在 v3 里已经失效。第八，自定义节点内部的点击事件冒泡，官方文档没有系统说明，需要自己实践中发现并加 stopPropagation。
-->

---

# 选型对比：vs G6 / LogicFlow / React Flow / Mermaid

| 维度 | X6 | G6(v5.1.1) | LogicFlow(v2.2.3) | React Flow(v12.11.1) | Mermaid |
|---|---|---|---|---|---|
| 定位 | 图**编辑**引擎 | 图**分析**引擎 | 流程图编辑(滴滴) | React 专属编辑器 | 文本转图表 |
| 渲染 | SVG+HTML | Canvas | SVG | SVG/HTML | SVG(一次性) |
| 自动布局 | **无**，需接 dagre | 18 种内置 | 弱 | 无内置 | 内置不可调 |
| 大图性能 | 几百节点掉帧 | 数千节点流畅 | 与 X6 相近 | 与 X6 相近 | 不适用 |

<div v-click class="mt-2 text-sm">

> 拖拽编辑画布 → X6；只读关系分析 → G6；纯 React 生态 → React Flow；静态嵌图 → Mermaid

</div>

<!--
最后横向对比四个方案外加 X6 自己一共五个维度。定位上，X6 是图编辑引擎服务 DAG、ER 图、流程图这类交互式编辑场景；G6 是图分析引擎服务只读的关系数据展示；LogicFlow 是滴滴开源的流程图编辑框架，内置能力集和 X6 高度相似，是很多国内团队评估 X6 时的对照项；React Flow 也就是 xyflow，是 React 生态专属的节点编辑器组件；Mermaid 是纯文本转图表，不支持拖拽交互编辑。

渲染方式上 X6 是 SVG 加 HTML 混合，G6 默认 Canvas，LogicFlow 纯 SVG，React Flow 是 SVG/HTML，Mermaid 是一次性渲染的 SVG 不可交互。自动布局是 X6 的明显短板，官方没有内置任何自动布局算法，DAG 场景通常需要自己引入 dagre 计算好坐标再用 fromJSON 渲染；反观 G6 内置 18 种布局算法。大规模图性能上，X6 和 LogicFlow、React Flow 量级相近，都是几百节点开始有压力，G6 靠 Canvas 加 Worker/WASM 能撑到数千节点。

一句话选型：需要用户在浏览器里拖拽绘制编辑流程图、DAG、白板类应用选 X6；需要节点内嵌完整 Vue/React 组件选 X6 的 HTML/Vue/React shape 机制；纯 React 技术栈且看重生态原生融合优先看 React Flow；只是想在文档里嵌入一张静态图表不需要交互编辑，用 Mermaid 就够了；图规模上到几千节点且核心诉求是分析关系而非编辑结构，选姊妹产品 G6。
-->

---
layout: intro
---

# 总结

AntV X6 = **基于 HTML+SVG 的图编辑引擎**（v3.1.7）

- 核心机制：`markup`+`attrs` 定制外观，`connecting` 统一校验连接规则（★必考）
- 交互体系：Selection/Snapline/Transform/History/Clipboard/Keyboard，v3 起整合进主包
- 自定义节点：HTML 最轻量；React/Vue shape 复用业务组件需独立装包+对齐版本
- v3 重构：插件收编 + `animate`(Web Animations API) 替代 `transition` + `virtual` 大图优化
- 选型：拖拽编辑画布选 X6，只读关系分析选姊妹产品 G6
- 资源：官方文档 x6.antv.antgroup.com ｜ GitHub antvis/x6

<!--
总结一下。AntV X6 是蚂蚁集团开源的图编辑引擎，基于 HTML 和 SVG 渲染，当前 npm 实测最新版本 3.1.7。

核心机制记住两组：markup 加 attrs 负责节点和边的外观定制，类比 HTML 加 CSS；connecting 统一控制连接交互的全部规则，包括六个 allow 开关和三个校验回调的触发时机差异，这是图编辑引擎的必考题。

交互体系上，Selection 框选、Snapline 对齐线、Transform 变换、History 撤销重做、Clipboard 剪贴板、Keyboard 快捷键，这些插件从 v3 起全部整合进了主包，一个 npm install 就够。自定义节点三选一：HTML 最轻量无框架依赖，React/Vue shape 能直接复用业务组件库，但要装配套包并且严格对齐大版本号。

v3 是过去 8 个月内的重大重构：插件收编主包、animate 基于 Web Animations API 完全替代 transition、新增 virtual 大图虚拟渲染，整体方向是瘦身加补性能短板。选型上一句话记住：需要用户在画布上拖拽编辑选 X6，只需要只读展示分析关系数据选姊妹产品 G6。官方文档地址和 GitHub 仓库都在这页，想深入可以直接去看。谢谢大家。
-->
