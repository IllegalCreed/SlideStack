---
theme: seriph
background: https://cover.sli.dev
title: AntV G6 — 关系数据可视化引擎
info: |
  Presentation AntV G6 — 蚂蚁集团开源的图可视化引擎。

  Learn more at [https://g6.antv.antgroup.com](https://g6.antv.antgroup.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🕸️</span>
</div>

<br/>

## AntV G6 — 关系数据可视化引擎

蚂蚁集团开源，图可视化引擎：绘制/布局/交互/分析一体，当前 v5.1.1

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/antvis/G6" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 AntV G6，蚂蚁集团开源的图可视化引擎。

官方原话：G6 是一个图可视化引擎，提供图的绘制、布局、分析、交互、动画等能力，专注"关系数据"——点、边，以及它们的分组 Combo，服务社交网络、知识图谱、软件依赖图、组织架构图、资金链路图等场景。

版本背景：npm 实测 latest 是 5.1.1，2026-05-08 发布，历史版本 521 个，发版非常频繁。v5 是 2023 年的一次彻底架构重写，渲染层换成自研的 @antv/g，数据与样式强制分离，图与树图统一成一个 Graph 类，v4 文档已归档到独立域名。

顺序：定位 → Graph 实例与生命周期 → 数据模型 → 元素与 Shape → 状态与交互 → 布局体系（重点）→ 插件 → 主题动画 → 事件 → 图算法 → 渲染与性能 → v4 到 v5 迁移 → 易错点 → 选型对比 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 定位一句话 + 评价

> "G6 是一个图可视化引擎，它提供了图的绘制、布局、分析、交互、动画等图可视化能力"——官方定位

<v-clicks>

- 专注**关系数据**（点+边+分组 Combo），服务知识图谱/依赖图/组织架构/资金链路
- v5（2023 GA）彻底重写：渲染层换自研 `@antv/g`，数据与样式强制分离
- UMD 包体积 1.8MB → 0.96MB，减小近 50%（模块化按需打包）
- 对比裸写 D3：省去大量样板代码；对比 ECharts graph：专业度高一个量级
- 对比 X6：G6 偏「只读展示分析」，X6 偏「用户可编辑画布」

</v-clicks>

<!--
先说定位。官方原话是这句引用：图可视化引擎，提供绘制、布局、分析、交互、动画能力。注意关键词"关系数据"——点加边，以及它们的分组 Combo，这是和 ECharts、G2 这类通用图表库的根本区别，G6 不画柱状图折线图，只画关系网络。

评价维度：v5 是 2023 年的彻底重写，渲染层换成 AntV 自研的类 zrender 引擎 @antv/g，数据和样式强制分离是核心设计哲学的变化。工程上的收益很直观：UMD 包体积从 1.8MB 压到 0.96MB，减小近一半，得益于良好的模块化，用不到的布局/行为/插件不会打进产物。

横向对比先给个感觉：比裸写 D3 省样板代码；比 ECharts 的 graph series 专业度和可扩展性高一个量级；比 X6 更偏"只读的展示分析"而非"用户在画布上编辑"，后面选型页会有完整对比表。
-->

---

# Graph 实例：创建与核心配置

```js
import { Graph } from '@antv/g6';
const graph = new Graph({
  container: 'container',   // 必须有明确宽高
  width: 800,
  height: 600,
  data: {                   // 数据驱动：nodes/edges/combos
    nodes: [{ id: 'node-1' }, { id: 'node-2' }],
    edges: [{ source: 'node-1', target: 'node-2' }],
  },
  layout: { type: 'force' },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

await graph.render();       // 首次渲染，返回 Promise
```

<!--
第一步，创建 Graph 实例。这是 v5 的唯一入口类，v5 统一了图和树图，不再有独立的 TreeGraph。

container 是 DOM id 或元素，必须有明确宽高，这是最常见的坑，后面易错点会展开。width/height 设画布尺寸。data 是数据驱动的核心，一次性传入 nodes/edges/combos 三类数据。layout 指定布局算法，这里用 force。behaviors 数组配置交互，字符串形式是最简写法。

最后 render() 是异步方法，返回 Promise，必须 await 或 then，因为它要走完整的处理数据、计算布局、绘制三个阶段。
-->

---

# Graph 生命周期方法

`new Graph()` → `render()` → 数据/视图操作 → `destroy()`

| 方法 | 作用 |
|---|---|
| `render()` | 完整渲染：处理数据→计算布局→绘制（异步） |
| `draw()` | 只重绘不重新布局，性能优于 `render()` |
| `setData()`/`getData()` | 覆盖式设置/获取全部数据 |
| `addNodeData()`/`updateNodeData()` | 增量新增/更新节点数据 |
| `fitView()`/`fitCenter()` | 缩放适配 vs 仅居中 |
| `destroy()` | 销毁实例，之后不可复用 |

<div v-click class="mt-3 text-sm">

> `setData()` 之后若忘记调用 `render()`，画布**不会自动重绘**。

</div>

<!--
Graph 实例的生命周期方法很多，挑最高频的六个。

render 是完整流程，处理数据、计算布局、绘制三步都做，初次渲染、布局变化、大批量增删元素都用它。draw 只重绘不重新算布局，纯样式或状态更新用它，性能更好。setData/getData 是覆盖式的整体数据读写，替代了 v4 的 data()/changeData()/save()。addNodeData/updateNodeData 是增量操作，只需要传变化的部分，还支持传函数基于前值算新值。fitView 缩放适配、fitCenter 仅居中，两者常被混用。destroy 销毁实例释放资源，销毁后必须重新 new。

特别提醒这条坑：setData 只更新内部数据模型，不会自动触发重绘，必须显式调 render 或至少 draw，很多人忘记这一步导致"数据变了但画面没变"。
-->

---

# 数据模型：data 与 style 分离

```js
// 节点：data 装业务字段，style 装视觉属性（v5 核心设计）
{
  id: 'node-1',                          // 必须唯一
  data: { name: 'alice', role: 'admin' },
  style: { size: 32, fill: 'violet' },
  combo: 'comboA',                       // 所属分组，无则 null
}
// 边：source/target 必须；Combo：分组容器可嵌套
{ id: 'e1', source: 'node-1', target: 'node-2', style: { stroke: 'orange' } }
{ id: 'comboA', type: 'circle', style: { fill: '#eee' } }
```

<v-clicks>

- 数据驱动样式：`style` 可传回调读 `data`，按值动态算 `size`
- 避免用 `id`/`type`/`style` 作自定义业务字段名（保留字冲突）
- 优先级：数据 `style` < 全局 `node.style` < 动态 `setNode()`

</v-clicks>

<!--
v5 最核心的设计原则：数据 data 与样式 style 分离，业务字段放 data，视觉字段放 style，避免用回调函数把业务值到处翻译成视觉值。

节点结构：id 必须唯一，data 放业务数据比如姓名角色，style 放视觉属性比如大小颜色，combo 字段指向所属分组，没有就是 null。边只要求 source/target。Combo 分组容器可以嵌套，combo 字段指向父级 combo。

三个要点：第一，style 里能传回调函数读取 data，实现"值越大节点越大"这类数据驱动效果。第二，要避开用 id/type/style 这几个保留字当自己的业务字段名。第三，同一属性多处配置时的优先级，数据自带的 style 最低，全局 node.style 其次，渲染前动态调用 graph.setNode() 最高，官方 FAQ 特别提示"样式不生效"多半是被更高优先级覆盖了。
-->

---

# 元素类型与 Shape 组成

<v-clicks>

- 节点 10 种（免注册）：circle/rect/ellipse/diamond… 等
- 边 6 种：line/polyline(A*避障)/quadratic/cubic 等
- Combo 2 种（circle/rect）：分组容器，双击可折叠展开
- keyShape：决定包围盒、交互检测、状态样式默认作用对象
- 辅助 Shape：labelShape/haloShape/badgeShape/portShape
- 配置优先级（高到低）：`setNode()` 动态 > 全局配置 > 数据内嵌 style

</v-clicks>

<!--
元素分节点、边、Combo 三类。节点 10 种全部免注册直接用：圆形矩形椭圆菱形三角形六边形五角星环形图片和 HTML，圆形是默认。边 6 种：直线默认、折线支持 shortest-path 路由用 A* 算法自动避障、二次三次贝塞尔曲线，还有专供树形图的垂直水平三次贝塞尔。Combo 只有圆形矩形两种容器，双击折叠展开，折叠后外部到内部节点的连线会自动重定向连到 Combo 本身。

每个节点边 Combo 由一个或多个 Shape 组合而成，其中恰好一个是 keyShape 关键图形：决定包围盒用于算边的连接点、承担点击 hover 的交互检测、状态样式默认作用在它上面。除 keyShape 外还有 labelShape 文本、haloShape 光晕、badgeShape 角标、portShape 精确控制连入连出点的连接桩。

配置优先级从高到低：渲染前动态调用 graph.setNode()/setEdge()，然后是实例化时的全局 node/edge 配置，最后是数据里直接内嵌的 type/style。
-->

---

# 状态 State

内置 5 种状态，均自带默认样式覆盖规则：

| 状态 | 说明 |
|---|---|
| `selected` | 选中状态（用户点击选择） |
| `active` | 激活状态（当前正在交互） |
| `highlight` | 高亮状态（强调显示） |
| `inactive` | 非活跃状态（淡化非关注元素） |
| `disabled` | 禁用状态（不可交互） |

<div v-click class="mt-3 text-sm">

> 优先级（低到高）：主题默认 < 调色板 < 数据样式 < 图默认 < 主题状态 < **图状态**。用 `graph.setElementState(id, 'selected')` 动态设置。

</div>

<!--
状态是 G6 交互反馈的核心机制，内置 5 种：selected 选中、active 激活、highlight 高亮、inactive 非活跃（淡化非关注元素）、disabled 禁用。每种状态都能配对应的样式覆盖，比如 selected 时描边变粗变色。

程序化操作用 graph.setElementState(id, state)，支持传数组叠加多个状态，比如同时 selected 和 highlight；传空数组清除所有状态；getElementState 查询、getElementDataByState 按状态反查所有元素。

最容易忘的是样式优先级链条：主题默认样式最低，往上是调色板样式、数据自带样式、图的默认样式、主题的状态样式，最高是图自己配置的状态样式。自定义主题时如果发现"设置了却不生效"，先检查是不是被这条链条上更高优先级的配置覆盖了。
-->

---

# 交互 Behavior

<v-clicks>

- 画布导航：`drag-canvas`/`zoom-canvas`/`scroll-canvas`
- 选择：`click-select`/`brush-select`(框选)/`lasso-select`(套索)
- 编辑：`create-edge`(连线)/`drag-element`/`drag-element-force`
- 数据探索：`collapse-expand`/`focus-element`/`hover-activate`
- 视觉优化：`fix-element-size`/`auto-adapt-label`(防标签重叠)
- 动态管理：`setBehaviors()` 整体替换 / `updateBehavior()` 改参数

</v-clicks>

<!--
Behavior 是 G6 的交互体系，无需注册直接在 behaviors 数组里配置字符串或对象。

五大类：画布导航管拖动缩放滚动；选择类里 brush-select 框选支持 union/intersect/diff 等模式叠加逻辑，lasso-select 是自由绘制的套索；编辑类的 create-edge 交互式连线、drag-element-force 是力导向布局下拖动节点并联动模拟；数据探索类的 collapse-expand 展开收起、hover-activate 悬停高亮；视觉优化类里 auto-adapt-label 会根据节点中心性自动调整标签显隐，避免大图标签重叠。

动态管理：setBehaviors 整体替换交互配置，传空数组能卸载全部交互；updateBehavior 按 key 定位改单个交互的参数，比如把 click-select 的 state 从 selected 改成 active。自定义 Behavior 需要先 register() 注册。
-->

---

# 布局体系 (1/2)：力导向 Force

力导向系 4 种：`force`(通用)/`d3-force`(灵活)/`force-atlas2`(大规模)/`fruchterman`(GPU/WASM)

| 参数 | 说明 |
|---|---|
| `nodeStrength` | 节点斥力，默认 1000 |
| `edgeStrength` | 边拉力，默认 500 |
| `linkDistance` | 边长度，默认 200 |
| `gravity` | 向心力，默认 10 |
| `preventOverlap` | 防重叠，默认 true |
| `damping` | 阻尼系数，默认 0.9 |

<div v-click class="mt-3 text-sm">

> 预布局（dagre/circular 一次算完）vs 实时布局（force 持续迭代至收敛，可配 `maxIteration` 提前终止）。

</div>

<!--
布局是 G6 的重点能力，内置 18 种算法，先看力导向系，一共 4 种：force 是内置的通用力导向，效果自然；d3-force 基于 d3-force 库，link/many-body/center/collide/radial 五种力可以灵活组合调参；force-atlas2 是大规模复杂图的变体，视觉效果好；fruchterman 是经典算法，支持 GPU/WASM 加速。

Force 布局最常考的六个参数：nodeStrength 节点斥力默认 1000，edgeStrength 边拉力默认 500，linkDistance 边长度默认 200，gravity 向心力默认 10，preventOverlap 防重叠默认开启，damping 阻尼系数默认 0.9 控制收敛速度。

关键区分：多数布局比如 dagre、circular、grid 是预布局，render 时一次性算完坐标；力导向类默认持续迭代模拟到收敛，可以配 maxIteration、minMovement 提前终止，拖拽节点时还能用 drag-element-force 继续实时反馈。
-->

---

# 布局体系 (2/2)：层次 / 环形 / 结构化

<v-clicks>

- 层次树：`dagre`(DAG分层) / `antv-dagre`(增强版，加排序等配置)
- 树形专用：`compact-box`/`dendrogram`/`indented`/`mindmap`
- 环形辐射：`circular`(扁平网络) / `radial`(有明确中心 focusNode)
- 同心圆：`concentric`(按度数分层，重要节点居中)
- 结构化：`grid`(矩阵排列) / `random`/`snake`/`fishbone`
- 分组/降维：`combo-combined`(组内+组间双布局) / `mds`(高维降维)

</v-clicks>

<!--
第二部分是层次、环形、结构化布局。层次树系：dagre 做 DAG 有向无环图分层，典型如流程图依赖图；antv-dagre 是增强版，在 dagre 基础上加了 nodeOrder 同层顺序、edgeLabelSpace 边标签预留空间、sortByCombo 等配置，官方文档没有明确说两者性能差异或推荐取舍，按需选型即可。树形图还有专门的缩进树、谱系树、脑图等四种。

环形辐射系：circular 用于扁平非层级、地位均等的网络；radial 以某个 focusNode 为中心分层放射，和 circular 的区别就是有没有明确中心焦点；concentric 按 sortBy 通常是度数分层排布同心圆，重要节点自然居中。

结构化：grid 矩阵表格式排列，random/snake/fishbone 是随机蛇形鱼骨排列。分组用 combo-combined，组内组间各自配一个布局；mds 是高维数据降维定位，这些偏小众但要知道存在。
-->

---

# 插件 Plugin

<v-clicks>

- 视觉增强：`grid-line`(网格,父容器需具体宽高)/`background`/`hull`(轮廓)
- 导航概览：`minimap`(不兼容 React 节点)/`fullscreen`/`timebar`(时间轴)
- 交互控件：`toolbar`/`contextmenu`/`tooltip`/`legend`
- 数据探索：`fisheye`(鱼眼)/`edge-bundling`(FEDB 算法捆边)
- 高级：`history` 撤销重做，替代 v4 的 `getUndoStack`
- 概念：**Extension** 是可注册内容统称，**Plugin** 只是其中一种

</v-clicks>

<!--
插件是 G6 最灵活的扩展机制，用来"挂载额外图形组件"或实现独立功能，和 Behavior 处理交互逻辑不同。

视觉增强类：grid-line 画布参考网格，文档特别标注父容器必须有具体宽高，Graph 的 width/height 配置对它无效；hull 轮廓包围圈定一组节点，concavity 设 Infinity 是凸包。导航概览类：minimap 缩略图导航但不兼容 React 节点渲染机制；timebar 时间轴筛选适合时序数据。交互控件类：toolbar 内置 zoom-in/undo/edit/export 等按钮，contextmenu 右键菜单支持异步加载菜单项，tooltip 悬浮提示。数据探索类：fisheye 鱼眼焦点放大镜，edge-bundling 用 FEDB 力导向边绑定算法把相似走向的边捆起来减少视觉混乱。

概念层级要分清：Extension 是元素、布局、行为、插件这些所有可注册内容的统称，Plugin 只是其中一种面向功能扩展的特殊 Extension。
-->

---

# 主题 Theme 与调色板 Palette

```js
new Graph({ theme: 'light', node: { palette: 'tableau' } });
graph.setTheme('dark');

// 分组模式：按 data.category 同类同色
node: { palette: { type: 'group', field: 'category', color: 'tableau' } }
```

<v-clicks>

- 内置 2 主题：`light`(默认)/`dark`，`setTheme()`/`getTheme()` 动态切换
- 5 套离散色板：spectral/tableau/oranges/greens/blues
- 调色板对节点/Combo 作用 `fill`，对边作用 `stroke`
- **样式映射会覆盖调色板**（数据 `style` 优先级更高）

</v-clicks>

<!--
主题内置两套：light 默认白底蓝色节点，dark 黑底调整对比色，包含画布背景、节点、边、Combo 四部分配置，setTheme/getTheme 动态切换查询。

调色板分两类：离散色板是颜色数组，超出数量循环使用；连续色板是 0 到 1 的插值函数。5 套内置离散色板：spectral、tableau、oranges、greens、blues。用法三种模式：简单模式每个节点自动分配不同颜色；分组模式按 data.category 字段分组，同类别同色；数值映射模式用连续色板按数值插值。

调色板对节点和 Combo 作用在 fill 填充色，对边作用在 stroke 描边色。要注意样式映射会覆盖调色板设置，这是同一条优先级规则的体现。
-->

---

# 动画 Animation

```js
new Graph({ animation: { duration: 500 } });          // 全局配置时长
new Graph({
  node: { animation: { enter: 'fade', exit: 'fade', update: 'translate' } },
});
```

<v-clicks>

- 三类动画：进退场(`enter`/`exit`) / 更新(`update`) / 持续动画(蚂蚁线等)
- 元素级配置会覆盖全局，但全局需先启用 `animation`
- 布局切换/状态切换/`zoomTo`/`fitView` 均可配独立过渡动画

</v-clicks>

<!--
动画指元素在一段时间内的状态变化，比如位置、大小、颜色。分三类:进退场动画在元素新增移除时触发；更新动画是属性变化时的过渡；持续动画比如蚂蚁线边、呼吸效果节点，靠自定义元素的 onCreate 生命周期钩子循环触发。

配置上，全局用 animation 设 false 关闭或设 duration 时长；元素级比如 node.animation 能覆盖全局的 enter/exit/update 行为，但前提是全局层面已经启用了动画。

覆盖面很广：布局切换、状态切换比如 selected/active、视口变化比如 zoomTo/fitView 带 animation 参数，都能配独立的过渡动画，让交互显得更自然。
-->

---

# 数据转换器 Transform（v5 新概念）

在绘制前（`beforeDraw`）或布局后（`afterLayout`）处理数据的可插拔管线：

| Transform | 时机 | 作用 |
|---|---|---|
| `map-node-size` | beforeDraw | 按中心性映射节点大小 |
| `place-radial-labels` | afterLayout | 辐射布局自动调整标签角度 |
| `process-parallel-edges` | beforeDraw | 处理平行边重叠 |

```js
new Graph({ transforms: ['process-parallel-edges'] });
graph.setTransforms((prev) => [...prev, { type: 'map-node-size' }]);
```

<!--
Transform 是 v5 新引入的数据处理管线机制，官方原话是在绘制前或布局后处理数据，方便封装解耦数据处理逻辑，本质是可插拔的数据中间件，替代了 v4 时代写一堆手动预处理函数的做法。

三个内置 transform：map-node-size 在 beforeDraw 阶段按节点中心性，degree、betweenness、closeness 等，自动映射节点大小；place-radial-labels 在 afterLayout 阶段给辐射状布局自动调整标签角度位置，避免文字倒置；process-parallel-edges 在 beforeDraw 阶段处理同一对节点间的多条平行边，自动分散或合并展示，常见坑是不处理会导致多条边完全重叠看起来像一条。

配置和更新都很简单，实例化时传 transforms 数组，运行时用 setTransforms 传函数基于前值增删。
-->

---

# 事件系统 Event

<v-clicks>

- 统一 `pointer` 事件（v5 移除 v4 的 `mouse`/`touch` 分离）
- 节点/边/Combo：`node:click`/`dblclick`/`pointerenter` 等
- 画布 `CanvasEvent`：同构命名 + `canvas:wheel`
- 生命周期成对事件：`beforerender`/`afterrender` 等成对钩子

</v-clicks>

```js
graph.on('node:click', (e) => console.log(e.target.id, e.targetType));
graph.once('node:click', callback);           // 一次性监听
```

<!--
v5 统一了鼠标触摸事件为 pointer 事件，移除了 v4 的 mouse/touch 分离。命名规范是目标类型冒号动作。

节点边 Combo 三类元素事件同构：click、dblclick、pointerenter/leave/over/out/move/down/up、contextmenu，还有拖拽相关的 dragstart/drag/dragend 等。画布事件同构命名再加一个 canvas:wheel 滚轮。生命周期事件是成对出现的 before/after，比如 beforerender/afterrender、beforelayout/afterlayout、beforetransform/aftertransform 对应 v4 的 viewportchange、beforeelementstatechange/afterelementstatechange 对应 v4 的 graphstatechange。

监听用 graph.on，一次性用 graph.once。事件对象字段包括 target 触发元素、targetType 是 node/edge/combo/canvas、originalTarget、originalEvent 原始浏览器事件。
-->

---

# 图算法：@antv/algorithm + 内置中心性

<v-clicks>

- 独立包 `@antv/algorithm`（纯函数,不含渲染,npm 最新 0.1.26）
- 路径/连通：dijkstra/floydWarshall/findPath/detectCycle
- 社区发现：labelPropagation(标签传播)/louvain(模块度优化)/pageRank
- 内置节点中心性（免引入算法包）：degree/betweenness/pagerank 等
- 易混淆：`polyline` 的 `shortest-path` 路由用 **A\*** 避障，非图论最短路径

</v-clicks>

<!--
G6 官方文档站没有独立的图算法教程页，算法能力来自两处。

第一处是独立包 @antv/algorithm，npm 实测最新 0.1.26，纯函数不含渲染逻辑，需要自己把结果映射回 style。函数清单：dijkstra 单源最短路径、floydWarshall 多源最短路径、findPath 两点间路径、connectedComponent 连通分量、detectCycle 环检测、dfs 深度优先遍历，还有社区发现相关的 labelPropagation 标签传播、louvain 模块度优化、pageRank 重要性排序。

第二处是 G6 内置的节点中心性算法，在 transform 的 map-node-size 等场景直接可配，不需要单独引入算法包：degree、betweenness、closeness、eigenvector、pagerank 五种。

最后一个命题易混淆点：polyline 边类型的 shortest-path 路由用 A* 算法做正交布线自动避障，这是"两点间视觉走线最短"；而 dijkstra 是图论意义上的"节点间最短路径"，两个不同层面的概念别混了。
-->

---

# 渲染器与大规模图性能

<v-clicks>

- 三种渲染器：Canvas(默认)/SVG/WebGL；`renderer` 可按图层混合渲染
- 无独立切换 API，动态切换渲染器需整体 `setOptions()`
- Web Worker 布局：`enableWorker: true` 避免迭代计算阻塞主线程
- WASM/GPU 加速：Fruchterman/ForceAtlas2/Force/Dagre 等
- 视口裁剪 + 边聚合（`edge-bundling`）减少大图视觉与渲染密度

</v-clicks>

<!--
渲染器三选一：Canvas 默认，SVG，WebGL，实例化时传 renderer 参数切换。由于是分层 layer 架构，renderer 还能接收回调函数，按图层类型比如主画布返回不同渲染器实例，实现混合渲染。官方明确没有提供单独 API 切换渲染器,动态切换要靠 setOptions 整体更新配置。

大规模图，数千节点级别的优化手段：Web Worker 布局，几乎所有非树形布局都支持 enableWorker，把迭代计算挪出主线程防卡顿；WASM 版本，Fruchterman、ForceAtlas2、Force、Dagre 都有；GPU 加速，Fruchterman 和 GForce 支持 WebGPU。

其他手段：视口裁剪只渲染可见元素，配合 optimize-viewport-transform 行为优化视图变换性能；边聚合用 edge-bundling、process-parallel-edges 减少边的视觉密度。Canvas 大图下交互流畅度通常优于 SVG/HTML 方案，这也是 G6 相比 X6 在超大规模图上的优势来源。
-->

---

# v4 → v5 迁移 (1/2)：数据与配置

| v4 | v5 |
|---|---|
| `{ id, label, size }` 平铺 | `{ id, data, style }` 分离 |
| `fitView`/`fitCenter` 配置项 | `autoFit: 'view'\|'center'` |
| `fitViewPadding` | `padding` |
| `modes` | `behaviors` |
| `defaultNode` | `node.style` |
| `nodeStateStyles` | `node.state` |
| `minZoom`/`maxZoom` | `zoomRange: [min, max]` |

<!--
v4 到 v5 是 API 巨变，存量教程和 AI 生成代码大面积失效，必须认准版本号交叉验证。先看数据与配置层面的迁移。

最核心的一条：v4 平铺的 id/label/size 字段，v5 强制拆成 data 装业务、style 装视觉。视图适配：v4 分开的 fitView/fitCenter 配置项，合并成 v5 统一的 autoFit 枚举，取值 view 或 center；fitViewPadding 简单改名成 padding。此外 v4 的 linkCenter 配置在 v5 直接移除，边连接点自动处理。

交互配置：v4 的 modes 交互模式，改名叫 behaviors 行为数组。样式配置：defaultNode 下沉成 node.style；nodeStateStyles 重新组织成 node.state。缩放范围：minZoom/maxZoom 两个独立数字，合并成 zoomRange 数组形式。这些都是同名不同形的坑，AI 生成代码经常按 v4 语法写，一定要对照检查。
-->

---

# v4 → v5 迁移 (2/2)：API 与事件

| v4 | v5 |
|---|---|
| `data()`/`changeData()` | `setData()` |
| `save()` | `getData()` |
| `getNodes()`/`findById()` | `getNodeData()` |
| `zoom()`/`translate()`/`moveTo()` | `zoomBy()`/`translateBy()`/`translateTo()` |
| `registerNode()`/`registerLayout()`… | 统一 `register()` |
| `mouse`/`touch` 事件 | 统一 `pointer` 事件 |
| `TreeGraph` 独立类 | 统一用 `Graph` |

<!--
第二部分是方法 API 与事件的迁移。数据读写：v4 的 data()/changeData() 变成 setData()；save() 变成 getData()；getNodes()/getEdges()/findById() 这类查询方法，改成 getNodeData()/getEdgeData()，数据查询彻底 API 化。

视图操作改名：zoom()/translate()/moveTo() 变成 zoomBy()/translateBy()/translateTo()。元素增删改：v4 的 addItem()/updateItem()/removeItem() 统一的 Item 概念被移除，改成 addNodeData() 这类明确区分节点边的数据 API；setMode()/setCurrentMode() 也改成了 setBehaviors()；撤销重做从 getUndoStack()/pushStack() 迁移成了 history 插件。

扩展注册：v4 有 registerNode()、registerEdge()、registerLayout() 等一堆注册函数，v5 统一成一个 register()。事件：mouse/touch 分离的事件模型，统一成 pointer 事件。最后，v4 独立的 TreeGraph 类，在 v5 里彻底消失，图和树图统一用 Graph 一个类表达——树只是图的一种特殊拓扑，不需要单独的类。
-->

---

# 易错点与坑

<v-clicks>

- 容器无明确宽高 → 不显示/渲染异常（`grid-line` 插件尤其敏感）
- `setData()` 后忘记 `render()`，画布不会自动重绘
- 布局是异步的：`render()` 返回 `Promise`，需等 `AFTER_RENDER`
- `draw()`(只重绘) 与 `render()`(重算布局) 易混淆，按需选用
- 自定义元素/布局/行为/插件忘记先 `register()` 注册
- Vue 响应式对象直接作 `data` 源，会干扰内部 diff 逻辑
- 平行边默认完全重叠，需 `process-parallel-edges` 处理
- `minimap` 插件不兼容 React 自定义节点渲染

</v-clicks>

<!--
挑八个高频坑。第一，容器没有明确的 CSS 宽高，尤其 flex/grid 布局下高度塌陷成 0，图不显示或渲染异常，grid-line 插件文档特别强调父容器必须有具体宽高，Graph 配置的尺寸对它无效。

第二，setData() 之后忘记调 render() 或至少 draw()，只是更新了内部数据模型不会触发重绘。第三，render() 返回 Promise，力导向布局甚至持续多帧收敛，需要"渲染完之后再做事"的逻辑要 await 或监听 AFTER_RENDER/AFTER_LAYOUT。第四，draw 只重绘不重新布局性能更好，render 是完整流程，选错影响性能或者数据变了画面没变。

第五，自定义元素、布局、行为、插件都要先 register() 注册，直接写未注册的 type 字符串会报错或静默失败。第六，Vue 响应式代理或 Immer 包装对象直接当 data 源，会干扰 G6 内部的 diff 比较逻辑，建议传 toRaw() 或 JSON 序列化后的纯净对象。第七，平行边同一对节点间多条边默认完全重叠，视觉上看起来只有一条，要用 process-parallel-edges 处理。第八，minimap 插件不兼容 React 自定义节点渲染机制，用了 React 节点的话缩略图可能渲染异常。
-->

---

# 选型对比

| 维度 | G6 | ECharts graph | D3-force | X6 |
|---|---|---|---|---|
| 定位 | 专职关系图引擎 | 图表库一个 series | 物理模拟+手写渲染 | 图编辑引擎 |
| 内置交互 | 10+ 种开箱即用 | 定制成本高 | 无内置,全手写 | 编辑向高级交互 |
| 布局 | 18 种,含 WASM/GPU | 少量,可调性弱 | 需自己拼装力 | 弱,常配合 dagre |
| 大规模图 | 数千节点仍流畅 | 大图卡顿明显 | 取决自身实现 | 200+ 节点性能下降 |
| 学习曲线 | 中等 | 低 | 高 | 中等 |

<div v-click class="mt-3 text-sm">

> 展示/分析关系数据 → **选 G6**；用户需在画布上编辑图结构 → 选 **X6**。

</div>

<!--
最后横向对比四个方案。定位上 G6 是专职的关系图可视化引擎；ECharts 的 graph 只是众多 series 类型之一；裸写 D3-force 是数据驱动的物理模拟加手写渲染，不是图专用框架；X6 是面向"编辑"的图编辑引擎，流程图审批流那类场景。

内置交互 G6 有 10 多种开箱即用的 Behavior，ECharts 定制成本高，D3 全靠手写，X6 面向编辑有增删改连线、resize、对齐吸附这类高级交互。布局能力 G6 有 18 种内置且带 WASM/GPU 加速最强；ECharts 内置力导向环形桑基等少量、可调性弱；D3 需要自己拼装 d3-force 的几种力；X6 布局能力弱通常配合 dagre 手动跑一次。

大规模图性能，G6 靠 Canvas 加 Worker/WASM 数千节点仍流畅；ECharts 大图卡顿明显非其设计目标；D3 取决于自己实现质量；X6 基于 HTML/SVG DOM 节点数受限，200 以上节点性能明显下降。学习曲线 G6 中等、ECharts 最低、D3 最高、X6 中等偏"画布编辑器"心智模型。

一句话选型：需要展示分析关系数据选 G6 不选 X6；需要用户在画布上增删改连线这类编辑器场景才选 X6。
-->

---
layout: intro
---

# 总结

AntV G6 = **蚂蚁开源的关系数据可视化引擎**（v5.1.1）

- 数据模型：`data`(业务) / `style`(视觉) 强制分离，三类元素 node/edge/combo
- 布局最强项：18 种内置算法，force 系 + 层次树 + 环形辐射，含 WASM/GPU 加速
- 交互体系：`behaviors` 开箱即用 + `plugins` 扩展（minimap 等）
- 大规模图：Canvas 渲染器 + Web Worker/WASM 布局，数千节点仍流畅
- v4→v5 是彻底重写，老教程/AI 代码易过时，认准版本号交叉验证

<!--
总结一下。AntV G6 是蚂蚁集团开源的图可视化引擎，专注关系数据的绘制、布局、交互、分析、动画，当前 v5.1.1。

核心心智：数据 data 和样式 style 强制分离，三类元素节点边组合。它最强的一块是布局，18 种内置算法覆盖力导向、层次树、环形辐射各个流派，还带 WASM/GPU 加速应对大规模图。交互体系上 behaviors 数组开箱即用，plugins 插件负责缩略图工具栏提示框这类扩展组件。

大规模图场景，Canvas 渲染器配合 Web Worker 和 WASM 加速布局，数千节点仍能流畅拖拽缩放，这也是它相比 X6 这类 HTML/SVG DOM 方案的核心优势。最后提醒一句，v4 到 v5 是彻底的架构重写，网上存量教程和 AI 生成的示例代码经常还是过时的 v4 语法，动手前一定要认准版本号交叉验证。谢谢大家。
-->
