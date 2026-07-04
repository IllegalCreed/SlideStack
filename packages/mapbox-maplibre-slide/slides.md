---
theme: seriph
background: https://cover.sli.dev
title: Mapbox GL JS 与 MapLibre GL JS
info: |
  Presentation of Mapbox GL JS and MapLibre GL JS — WebGL vector tile mapping libraries for the browser.

  Learn more at https://maplibre.org/maplibre-gl-js/docs/
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🗺️</span>
</div>

<br/>

## Mapbox GL JS 与 MapLibre GL JS

WebGL 矢量瓦片地图库：Mapbox 专有计费，MapLibre 开源分叉

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/maplibre/maplibre-gl-js" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊一对地图渲染库：Mapbox GL JS 和 MapLibre GL JS。

一句话定位：它们是在浏览器端用 GPU 实时渲染矢量瓦片（vector tiles）、按 JSON 格式 Style Specification 上色排版的 WebGL 地图库，能做到平滑缩放/旋转/倾斜/3D。MapLibre 是 Mapbox 转专有许可证之后，社区分叉出的开源延续版本，二者 API 高度一致，可以当成"同一套技能，两个发行版"来学。

今天的顺序：定位与分叉史 → 初始化 → Style 规范 → paint/layout → 表达式 → 交互高亮 → 相机 → 图层操作 → 事件坑 → GeoJSON/cluster → 3D/地形 → 性能 → 生态 → 易错点 → 选型定案。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么是这对库？

栅格瓦片时代的局限：

<v-clicks>

- 服务器预渲染图片瓦片，客户端直接贴图拼接
- 换一套视觉风格，就要换掉整套瓦片图源，成本高
- 旋转会糊，基本不支持真 3D 倾斜

</v-clicks>

<div v-click class="mt-6">

矢量瓦片与 WebGL 带来什么：

- 客户端 GPU 实时渲染几何数据，换 style JSON 就换肤
- 平滑缩放/旋转/倾斜，原生支持 3D
- Mapbox 与 MapLibre 同源、API 高度一致

</div>

<!--
先说这对库要解决什么问题。以 Leaflet 为代表的传统栅格瓦片方案，地图其实是服务器预先画好的一张张图片瓦片，客户端只是拼图、贴图。这带来两个硬伤：换一套视觉风格，必须换掉整套瓦片图源，成本很高；而且旋转会模糊，基本没有真正的 3D 倾斜能力。

矢量瓦片加 WebGL 这条路线不一样：瓦片里装的是几何和属性数据，真正的上色排版在客户端 GPU 里实时完成。换肤只需要换一份 style JSON，不用换瓦片源；可以平滑缩放、旋转、倾斜，原生支持 3D。这正是 Mapbox GL JS 开创、MapLibre GL JS 继承的技术路线，二者同源、API 高度一致。下一页讲清楚它们为什么会变成两个发行版。
-->

---

# 分叉史与许可证分野

<v-clicks>

- **2020 年之前**：Mapbox GL JS 是 BSD-3-Clause 开源库，一路演进到 v1.13
- **2020-12**：Mapbox 把 GL JS 转为专有许可证；社区当月从 v1.13 分叉出 **MapLibre GL JS**
- 官方原话：MapLibre v1 与 Mapbox GL JS v1 **完全向后兼容**（并保留 1.15.3 这一兼容版本在 npm 上）
- 实测现状：`mapbox-gl@3.25.0`（`SEE LICENSE IN LICENSE.txt`，专有）vs `maplibre-gl@5.24.0`（`BSD-3-Clause`）

</v-clicks>

<div v-click class="mt-6 text-sm">

> **Mapbox**：专有许可证 + 计费（每月 50,000 次免费 web map load，超额阶梯计费）
> **MapLibre**：BSD-3-Clause + 完全免费，自建瓦片服务的带宽/存储成本自理

</div>

<!--
这一页是今天的重点之一：两个库的分叉史，直接决定了后面所有选型判断的底层逻辑。

时间线很清楚：2020 年 12 月之前，Mapbox GL JS 是标准的 BSD-3-Clause 开源库，一路演进到 v1.13。2020 年 12 月，Mapbox 官方把 GL JS 换成了专有许可证，不再是 OSI 认可的开源协议；社区几乎在同一个月，就从最后一个开源版本 v1.13 分叉出了 MapLibre GL JS，作为完全开源的替代品延续下去。MapLibre 官方声明了一句很关键的话：MapLibre v1 和 Mapbox GL JS v1 的 API 完全向后兼容，这也是为什么很多老项目迁移起来成本很低。

拿今天实测的 npm 包元数据印证一下：mapbox-gl 最新 3.25.0，license 字段是"见 LICENSE.txt"，也就是专有；maplibre-gl 最新 5.24.0，license 字段就是标准的 BSD-3-Clause。这一个字段的差异，就是这条分叉史最直接的证据。

商业后果也画出来了：Mapbox 每月 5 万次免费地图加载，超了阶梯计费；MapLibre 完全免费，没有使用量限制，唯一要自己掏钱的是自建瓦片服务的带宽和存储。这个矛盾贯穿了后面几乎所有的选型考量。
-->

---

# 地图初始化：Mapbox GL JS

```js
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const map = new mapboxgl.Map({
  accessToken: 'YOUR_TOKEN', // 必需，从 Mapbox 后台获取
  container: 'map',          // 容器 DOM id 或元素
  style: 'mapbox://styles/mapbox/streets-v12', // 专有协议
  center: [-74.5, 40], // ⚠️ [经度 lng, 纬度 lat]，与 Leaflet 相反
  zoom: 9
});
```

<div v-click class="mt-3 text-sm">

> v3.x ESM 具名导出后没有全局 `mapboxgl` 对象，`accessToken` 只能放进 `Map` 的 options（老代码 `mapboxgl.accessToken = 'xxx'` 会静默失效）。

</div>

<!--
先看 Mapbox GL JS 的初始化。引入方式很直接：import 默认导出的 mapboxgl，再引入配套 CSS——这一步千万别漏，漏了控件和弹窗样式全乱。

构造 Map 时最核心的四个 option：accessToken 是 Mapbox 专属、必需的字段，要去官网账户后台拿；container 是承载地图的 DOM；style 用 mapbox:// 协议指向官方托管的专有 style；center 是中心点，注意顺序是经度在前、纬度在后，这是从 Leaflet 那种 [纬度,经度] 迁移过来最容易踩的坑，今天会反复强调。

再补一个版本坑：v3.x 的 ESM 入口改成了具名导出，已经没有 mapboxgl 这个默认导出对象可以挂载全局 accessToken 了，必须像代码里这样直接传进 Map 的 options。网上还有很多教程在用老的全局赋值写法，拿到新版本代码库里会静默不生效，查半天都找不到原因。
-->

---

# 地图初始化：MapLibre GL JS

```js
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const map = new maplibregl.Map({
  container: 'map', // 无需 accessToken
  style: 'https://tiles.openfreemap.org/styles/bright', // 免费无需 key
  center: [30.0222, -1.9596], // 顺序与 Mapbox 完全一致：[lng, lat]
  zoom: 7
});
```

<div v-click class="mt-4 text-sm">

其他常用 options：`bearing`（旋转角 0-360°）/ `pitch`（倾斜角 0-85°）/ `hash`（视图写入 URL）/ `maxBounds`（范围限制）/ `transformRequest`（请求拦截，常用于签名代理）

</div>

<!--
对比着看 MapLibre GL JS，写法几乎一模一样，但少了一整块：不需要 accessToken，直接指向一个公开可访问的 style URL 就行，这里用的是完全免费、无需 key 的社区服务 OpenFreeMap。

center 的坐标顺序两边完全一致，都是经度在前、纬度在后，这不是两者的差异点，而是两者共同的坑，从 Leaflet 迁移过来的同学尤其要注意。

顺带把两边通用的常见 options 列一下：bearing 控制旋转角、pitch 控制倾斜角、hash 会把当前视图状态写进 URL 方便分享和刷新保持、maxBounds 限制用户能平移到的地理范围、transformRequest 是自定义请求拦截钩子，常见用法是给瓦片请求统一加签名或走代理。这几个 option 两边 API 完全一致，是"高度兼容"最直观的体现。
-->

---

# Style Specification 结构总览

Style 是一份 JSON 文档，规范版本号固定为 `version: 8`：

| 根级属性 | 作用 |
|---|---|
| `version` | 规范版本，必须为 8 |
| `sources` | 数据源字典——决定"有什么数据" |
| `layers` | 图层数组——决定"怎么画"，顺序即层叠顺序 |
| `sprite` / `glyphs` | 精灵图 / 字体 URL 模板 |
| `light`/`sky`/`terrain`/`projection` | 全局光照/天空/地形/投影 |

<div v-click class="mt-3 text-sm">

两者共享同一份祖先规范；Mapbox 有专有的 `mapbox://styles/mapbox/standard`，MapLibre 侧由社区独立维护 `maplibre-style-spec`。

</div>

<!--
Style 是一份 JSON 文档，定义地图的完整视觉外观，规范版本号固定写死是 8。

根级属性里最重要的是两个：sources 决定"有什么数据"，layers 决定"这些数据怎么画"，而且 layers 数组的顺序直接就是渲染的层叠顺序，后面的图层盖在前面图层上面。剩下几个：sprite 和 glyphs 分别是小图标精灵图和文字字体的 URL 模板；light/sky/terrain/projection 管全局光照、天空盒、地形、投影这些视觉效果；center/zoom/bearing/pitch 是这份 style 自带的默认相机位置，只有 Map 构造时没显式传入才生效；transition 管属性过渡动画的默认时长。

两边的分野也提一句：这份 root 结构两家公用同一个祖先，但分叉之后 Mapbox 搞出了专有的 mapbox://styles/mapbox/standard，内置了 3D 光照大气效果；MapLibre 这边由社区独立维护一份 maplibre-style-spec 规范文本。核心结构 sources/layers/paint/layout 还是保持一致，这也是后面能"高度兼容"的规范基础。
-->

---

# Sources 六种类型

| 类型 | 用途 | 关键字段 |
|---|---|---|
| `vector` | 矢量瓦片 | `url`/`tiles`、`minzoom`/`maxzoom`、`scheme` |
| `raster` | 栅格瓦片 | `tiles`、`tileSize`（默认 512） |
| `raster-dem` | 地形高程 | `encoding`：`terrarium`/`mapbox`/自定义 |
| `geojson` | 动态 GeoJSON | `data`、`cluster`、`clusterRadius` |
| `image` | 静态图片叠加 | `url` + `coordinates`（四角坐标） |
| `video` | 视频叠加 | `urls` + `coordinates` |

<div v-click class="mt-3 text-sm">

Mapbox 侧常走 `mapbox://` 协议引用官方托管瓦片集；MapLibre 侧通常直接给 TileJSON/瓦片模板 URL（自建或 MapTiler/OpenFreeMap）——这是"是否被绑定在 Mapbox 托管服务"的直接体现。

</div>

<!--
Sources 定义"有什么数据"，一共六种类型。

vector 是矢量瓦片，最常用，关键字段是 url 或 tiles 模板、minzoom/maxzoom、scheme。raster 是栅格瓦片，比如卫星图，配 tileSize 默认 512。raster-dem 专门装地形高程数据，encoding 字段决定怎么解码高度值。geojson 是运行时动态数据，可以开 cluster 聚合。image 和 video 分别叠加静态图片和视频，用四个角的经纬度坐标定位。

选型上有个直接体现：Mapbox 那边常年习惯用 mapbox:// 协议引用官方托管的瓦片集，比如 mapbox.mapbox-streets-v8；MapLibre 这边因为没有官方托管服务，通常是直接给一个公开可访问的 TileJSON 或瓦片模板 URL，要么自建 tileserver-gl，要么用第三方比如 MapTiler、OpenFreeMap。这一条其实就是"是否被绑定在 Mapbox 生态里"的技术体现。
-->

---
layout: two-cols-header
---

# Layers 图层类型总览

图层属性分两组，语义和性能完全不同——下两页展开：

::left::

**基础类型**

<v-clicks>

- `background` 背景
- `fill` 填充多边形
- `line` 线
- `symbol` 图标/文字
- `circle` 圆点

</v-clicks>

::right::

**进阶类型**

<v-clicks>

- `heatmap` 热力图
- `fill-extrusion` 3D 挤出
- `raster` / `hillshade` 栅格/山体阴影
- `color-relief` 高程分层设色（较新，是否同步到 Mapbox 待确认）

</v-clicks>

<!--
Layers 决定"数据怎么画"。MapLibre 当前文档列出的图层类型分两组看：基础的有 background、fill、line、symbol、circle 五种，分别对应背景、填充多边形、线、图标文字、圆点；进阶一点的有 heatmap 热力图、fill-extrusion 3D 挤出建筑、raster 栅格图层、hillshade 山体阴影，以及比较新的 color-relief，基于高程做分层设色，专门用于地形着色。

最后这个 color-relief 要诚实标注一下：它是 MapLibre 分叉之后独立演进出来的较新类型，是否已经同步出现在 Mapbox 当前规范里，没有逐一核对过，先标成待确认，不当成两者差异的定论。

每种图层类型的属性又分 paint 和 layout 两组，语义和性能含义完全不同，这是下两页的重点内容。
-->

---

# paint vs layout：本质区别

| 属性组 | 例子 | 改动代价 |
|---|---|---|
| **layout**（布局） | `visibility`/`icon-image`/`text-field`/`symbol-placement` | 重算碰撞检测/文字排版，较重 |
| **paint**（绘制） | `fill-color`/`circle-radius`/`line-width`/`fill-extrusion-height` | 只触发重绘，开销小 |

<div v-click class="mt-6 text-sm">

> 性能法则：样式要**频繁动态变化**（悬停高亮、滑块调不透明度）时，优先设计成只改 `paint` 属性，避免频繁触发 layout 重算。

</div>

<!--
这一页是今天第二个重点：paint 和 layout 的本质区别，这是矢量瓦片图层最核心的性能心智模型。

layout，布局属性，决定要素的几何放置方式和是否显示，比如 visibility 控制显隐、icon-image/text-field 决定图标文字内容、symbol-placement 决定符号沿线还是沿点摆放。改动 layout 属性代价更高，因为引擎要重新计算符号碰撞检测、文字排版这些几何布局工作。

paint，绘制属性，决定最终的视觉呈现，比如 fill-color、circle-radius、line-width、fill-extrusion-height。改动 paint 属性只触发重绘，不动布局，开销小得多。

由此得出一条性能法则：如果样式要做频繁的动态变化，比如鼠标悬停高亮、拖个滑块实时调透明度，优先把交互设计成只改 paint 属性，避免频繁触发 layout 那套更贵的重算流程。下一页看具体怎么写代码。
-->

---

# paint vs layout：代码实战

```js
// layout：改内容/图标——较重，触发碰撞检测重算
map.setLayoutProperty('poi', 'text-field', ['get', 'name_en']);
// paint：只改颜色——较轻，只触发重绘
map.setPaintProperty('poi', 'text-color', '#ff0000');

// 代表性图层：circle，paint 全用表达式做数据驱动
map.addLayer({
  id: 'quakes', type: 'circle', source: 'earthquakes',
  paint: {
    'circle-radius': ['interpolate', ['linear'], ['get', 'mag'], 1, 4, 6, 20],
    'circle-color': '#f28cb1'
  }
});
```

<!--
落到代码上，setLayoutProperty 改文字内容，这是 layout 操作，较重；setPaintProperty 只改颜色，这是 paint 操作，较轻。两个 API 名字都直接对应属性组，很好记。

再看一个完整的图层定义：circle 圆点层，常用来渲染大量 GeoJSON 点，比如地震点。paint 里两个属性都值得注意：circle-radius 用 interpolate 表达式，让半径随 mag 震级属性连续插值，不是写死的固定值；circle-color 这里是写死的固定色，当然也可以换成表达式做数据驱动。整个 paint 对象里全是"根据数据怎么画"，这就是下一页表达式要展开的内容。
-->

---

# 数据驱动表达式 Expressions

Expressions 是 JSON 数组形式的公式，可引用属性/缩放级别动态计算 paint/layout 值：

```js
// get：读取属性值
'fill-color': ['get', 'temperature']

// interpolate：连续插值，常配合 zoom 做"随缩放渐变"
'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 1, 10, 5]

// match：按枚举值分类着色
'fill-color': ['match', ['get', 'type'],
  'residential', '#f00', 'commercial', '#0f0', '#000']

// step：阶跃函数，常用于聚合点按数量分级变大小
'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
```

<!--
Expressions 是今天第三个重点。它是 JSON 数组形式写的公式，可以引用 feature 的属性、当前缩放级别、地图状态，动态算出 paint 或 layout 属性的值，这是矢量瓦片相较传统栅格瓦片最核心的能力差异之一——同一份数据，靠表达式就能算出千变万化的呈现。

四个最常用的：get 最简单，直接读某个属性值；interpolate 做连续插值，最常见的搭配是随 zoom 缩放级别渐变，比如放大了图标跟着变大；match 按枚举值分类着色，像 switch-case，最后一个参数是默认值；step 是阶跃函数，不做连续插值而是分段跳变，最经典的场景是聚合点按数量分级——数量越多点越大，一档一档跳，不是渐变。

这几个表达式函数两边库完全通用，是"表达式驱动"这个心智模型能跨库复用的原因。下一页看更进阶的 case 条件分支，配合交互状态做悬停高亮。
-->

---

# feature-state 交互高亮

```js
// case：条件分支，常配合 feature-state 做悬停高亮
'circle-opacity': ['case',
  ['boolean', ['feature-state', 'hover'], false], 1, 0.5]

map.on('mousemove', 'provinces', (e) => {
  if (e.features.length > 0) {
    map.setFeatureState(
      { source: 'provinces', id: e.features[0].id },
      { hover: true }
    );
  }
});
```

<div v-click class="mt-2 text-sm">

⚠️ 依赖 `feature.id`：GeoJSON 无稳定 id 时需 `generateId: true`。过滤同样用表达式语法：`setFilter()`；legacy 写法 `['==','class','river']` 已过时。

</div>

<!--
feature-state 是无需修改源数据就能给某个 feature 挂一个临时状态的机制，最典型的场景是鼠标悬停高亮。代码里 case 表达式做条件分支：如果这个 feature 的 hover 状态是 true，透明度给 1，否则给 0.5。配合 mousemove 事件，鼠标移到某个要素上就调用 setFeatureState 把它的 hover 设成 true，不用重新拉取或修改任何数据。

有个前提容易漏：feature-state 依赖 feature.id，如果 GeoJSON 数据本身没有稳定的 id 字段，要在 addSource 时加一个 generateId: true 选项，不然状态设置会失败或者错位。

filter 用的是完全一样的表达式语法，返回布尔值决定要素是否渲染。有个历史遗留提一下：早期写法是 ["==", "class", "river"] 这种非 expression 的紧凑写法，现代统一改成 ["==", ["get", "class"], "river"]，规范里专门有 Deprecations 章节记这类过时语法。
-->

---

# 相机与交互控制

| 方法 | 用途 |
|---|---|
| `flyTo`/`easeTo`/`jumpTo` | 三种镜头过渡：弧线动画/平滑过渡/无动画跳转 |
| `fitBounds(bounds)` | 自动计算缩放/中心，使地理范围完整可见 |
| `getCenter()`/`setCenter()` | 读写中心点 |
| `getZoom()`/`setZoom()` | 读写缩放级别 |
| `getPitch()`/`setPitch()` | 读写倾斜角（0-85°） |
| `getBearing()`/`setBearing()` | 读写旋转角（0-360°） |

```js
map.flyTo({ center: [-0.1276, 51.5072], zoom: 15.5, bearing: 27, pitch: 45 });
```

<div v-click class="mt-2 text-sm">

常用控件：`NavigationControl`（缩放+指南针）、`GeolocateControl`（浏览器定位，`trackUserLocation` 持续跟踪）。

</div>

<!--
相机控制这块，三种镜头过渡方式里 flyTo 观感最好，是带弧线的动画飞行，自动组合缩放平移旋转；easeTo 是平滑过渡但没有那个抛物线效果；jumpTo 无动画立即跳转。fitBounds 很实用，给一个地理范围，自动算出合适的缩放和中心让它完整可见，常用在"定位到某个省/某个商圈"这种场景。剩下几对 get/set 方法分别读写中心点、缩放、倾斜角、旋转角。

flyTo 这行代码示例把 center/zoom/bearing/pitch 一次性传入，一步到位飞到伦敦某处并带上倾斜和旋转，视觉效果很好。

常用内置控件提两个：NavigationControl 是缩放按钮加指南针，点指南针能复位旋转角；GeolocateControl 调浏览器定位 API，trackUserLocation 设 true 会持续跟踪并显示方向锥，这是"定位到我的位置"这类功能的标准实现。
-->

---

# 图层动态操作（增删改查）

```js
map.addSource('id', { type: 'geojson', data: geojson });
map.addLayer(
  { id: 'layer-id', type: 'circle', source: 'id', paint: {} },
  'beforeId'
);
map.removeLayer('layer-id');
map.removeSource('id');
map.setPaintProperty('layer-id', 'circle-color', '#f00');
map.setLayoutProperty('layer-id', 'visibility', 'none'); // 隐藏图层标准做法
map.setFilter('layer-id', ['==', ['get', 'type'], 'a']);
map.moveLayer('layer-id', 'anotherLayerId'); // 移到 anotherLayerId 之前
const hits = map.queryRenderedFeatures(point, { layers: ['layer-id'] });
```

<div v-click class="mt-2 text-sm">

`addLayer` 第二参数 `beforeId` 决定新图层插到哪个已有图层**之前**——遗漏时默认插到最顶层。

</div>

<!--
图层的增删改查，这几个 API 是日常操作地图最高频用到的一组。addSource/addLayer 添加数据源和图层，addLayer 的第二个参数 beforeId 很关键，决定新图层插入到哪个已有图层之前，控制"新加的图层盖住谁、被谁盖住"，遗漏这个参数默认插到最顶层。removeLayer/removeSource 对应删除。

setPaintProperty/setLayoutProperty 前面已经讲过读写哪一组代价不同。setFilter 动态过滤要素显示。moveLayer 调整层叠顺序，把某图层移到另一个图层之前。最后 queryRenderedFeatures 拾取鼠标位置或某个矩形范围内渲染出来的要素，是做点击拾取、悬停高亮的基础 API，还有一个姊妹 API querySourceFeatures 查询源数据本身，不依赖是否渲染出来，今天篇幅有限先不展开。
-->

---

# Marker（DOM）vs symbol 图层（GPU）

| 维度 | Marker | symbol 图层 |
|---|---|---|
| 本质 | 真实 DOM 元素，CSS transform 定位 | WebGL 里 GPU 批量渲染 |
| 适用 | 单个/少量、需复杂 DOM 交互 | 成百上千个点位（POI/聚合点） |
| 性能 | 数量过多会有明显卡顿 | 数量再多也不会致 DOM 膨胀 |

```js
new maplibregl.Marker({ color: '#fff', draggable: true })
  .setLngLat([30.5, 50.5])
  .setPopup(new maplibregl.Popup().setHTML('<h1>Hello!</h1>'))
  .addTo(map);
```

<div v-click class="mt-2 text-sm">

`Popup.setHTML()` 直接注入 HTML（需自行防 XSS），`setText()` 纯文本安全写入。

</div>

<!--
Marker 和 symbol 图层都能在地图上放图标，但本质完全不同。Marker 是真实的 DOM 元素，地图变换时靠 CSS transform 更新位置，适合单个或少量、需要复杂 DOM 交互的场景，比如"当前用户位置"这种唯一标记，里面还能塞表单、动画。symbol 图层是在 WebGL 里由 GPU 批量渲染的图标文字，适合成百上千个点位，比如 POI 或聚合点，因为是 GPU 批渲染，数量再多也不会造成 DOM 节点膨胀导致的卡顿。这是矢量瓦片地图库通用的性能实践。

代码示例是 Marker 的典型用法：new 一个可拖拽的白色 Marker，设经纬度，挂一个 Popup 弹窗，加到地图上。Popup 有两个写入方法要分清：setHTML 直接注入 HTML 字符串，如果内容来自用户输入，自己要做好 XSS 防护；setText 是纯文本安全写入，渲染用户提交内容时应该优先用这个。
-->

---

# 事件系统 + `load` 坑

```js
map.on('load', () => {
  // 必须等 load 之后才能安全 addSource/addLayer——
  // 最高频入门坑：style 没加载完就 addLayer 会直接报错
  map.addSource('points', { type: 'geojson', data: geojson });
  map.addLayer({ id: 'points', type: 'circle', source: 'points', paint: {} });
});

map.on('click', 'points', (e) => { /* 只在点中该图层要素时触发 */ });
map.on('mouseenter', 'points', () => { map.getCanvas().style.cursor = 'pointer'; });
```

<div v-click class="mt-2 text-sm">

事件大类：**加载**（`load`/`idle`）、**鼠标**（`click`/`mousemove`/…）、**相机**（`move`/`zoom`/`rotate`/`pitch` 各带 start/end）、**数据**（`data`/`styledata`/`styleimagemissing`）。

</div>

<!--
事件系统是坑最集中的地方。第一条铁律：必须等 load 事件触发之后，才能安全地 addSource、addLayer、操作图层——这是最高频的入门坑，style 还没加载完就调用 addLayer 会直接报错。所以几乎所有初始化逻辑都要包在 map.on('load', ...) 回调里。

事件委托到图层也很常用：map.on('click', 'points', cb) 只在点中 points 这个图层的要素时才触发，不传图层 id 就是全局点击。mouseenter/mouseleave 这两个事件必须传第二个参数 layer 才有"进入/离开该图层"的语义，漏传就退化成全局的 mouseover/mouseout，光标样式或高亮逻辑就会对所有图层生效，而不是想要的那一个图层。

事件大类简单分四组：加载就绪类的 load 和 idle；鼠标触摸类；相机运动类，movestart/move/moveend 这种三段式在 zoom/rotate/pitch 上都有对应；数据样式类，包括 styleimagemissing 这个专门处理图标缺失的事件，可以在回调里 addImage 补救。
-->

---

# GeoJSON 数据源与聚合 cluster

```js
// 整体替换数据：增量更新常见做法是重新拉接口后 setData
map.getSource('points').setData(newGeoJsonObject);

// 聚合三件套：clusterRadius / clusterMaxZoom / clusterProperties
map.addSource('earthquakes', {
  type: 'geojson',
  data: './data.geojson',
  cluster: true,
  clusterRadius: 50,       // 聚合像素半径
  clusterMaxZoom: 14,      // 超过此级别不再聚合，展开成单点
  clusterProperties: { sum: ['+', ['get', 'value']] } // 自定义聚合运算
});
```

<div v-click class="mt-2 text-sm">

开启 `cluster: true` 后自动附加 `point_count` 属性，配合 `step` 表达式按数量分级变大小/变色，是最经典的聚合可视化组合拳。

</div>

<!--
GeoJSON source 支持运行时用 setData 整体替换数据，增量更新的常见做法是重新拉取接口拿到新数据后整体 setData，而不是逐个要素增删，这样心智模型简单很多。

聚合三件套记住三个字段：clusterRadius 控制聚合的像素半径，多近的点会被拢到一起；clusterMaxZoom 控制放大到多大级别之后不再聚合，展开成一个个单点；clusterProperties 可以自定义聚合时对属性做的运算，示例里是对 value 属性求和，汇总到聚合点的 sum 属性上。

开启 cluster 之后，MapLibre/Mapbox 会自动给每个聚合点附加一个 point_count 属性，记录这个簇里有多少个原始点。配合上面讲的 step 阶跃表达式，按 point_count 分级显示不同大小、不同颜色的聚合圆点，这是地图可视化里最经典的聚合展示组合拳，基本是标配。
-->

---

# 3D 与地形

```js
// fill-extrusion：3D 挤出建筑
map.addLayer({
  id: 'building-3d', type: 'fill-extrusion', source: 'buildings',
  paint: {
    'fill-extrusion-color': '#aaa',
    'fill-extrusion-height': ['get', 'height'],
    'fill-extrusion-base': ['get', 'min_height']
  }
});

// 地形：raster-dem source + setTerrain 启用起伏
map.setTerrain({ source: 'terrain-source-id', exaggeration: 1.5 });
```

<div v-click class="mt-2 text-sm">

Style 根级 `sky`/`light` 影响 3D 场景明暗与大气；Mapbox 的 `mapbox://styles/mapbox/standard` 把光照/天空/3D 地标做成专有内置配置，MapLibre 无对应托管实现。

</div>

<!--
3D 能力主要靠两个东西。fill-extrusion 图层实现 3D 挤出建筑，paint 里 fill-extrusion-height 和 fill-extrusion-base 通常都配合 get 表达式，直接从数据的 height/min_height 属性读取，这样每栋楼高度不一样，不用写死。

地形起伏靠 raster-dem 类型的 source 提供高程数据，再调用 map.setTerrain，传入 source id 和 exaggeration 夸张系数，大于 1 会把高程差视觉放大，让地形起伏看起来更明显。

Style 根级的 sky 和 light 属性分别控制大气天空盒效果和全局光照，会影响 fill-extrusion 这些 3D 图层的明暗观感。这里有个专有能力的分野：Mapbox 的 mapbox://styles/mapbox/standard，也就是 Mapbox Standard 风格，把光照、天空、3D 建筑材质这些做成了内置的专有配置项，比如白天夜晚光照预设、3D 地标；MapLibre 没有对应的托管实现，需要自己拼 style 或用社区提供的开源 3D 风格。
-->

---

# 性能与瓦片来源

| 维度 | 矢量瓦片（WebGL） | 栅格瓦片（Leaflet 常见形态） |
|---|---|---|
| 渲染方式 | 客户端 GPU 实时渲染 | 服务器预渲染图片，直接贴图 |
| 换样式成本 | 极低——换 style JSON 即可 | 高——必须切换整套瓦片图源 |
| 旋转/倾斜/3D | 原生支持且清晰不糊 | 会模糊，通常不支持真 3D |
| 兼容性要求 | 需要 WebGL | 只需 Canvas/SVG/DOM |

<div v-click class="mt-3 text-sm">

海量点位优先用 `symbol`/`circle` 图层而非成千 `Marker`。免费/自建瓦片来源：**MapLibre demotiles**、**OpenFreeMap**（免费无需 key）、MapTiler（商业）、**tileserver-gl**（自建）。

</div>

<!--
矢量瓦片相对栅格瓦片的核心优势，这张表基本是今天开场"为什么用这对库"的加强版：同一份瓦片配合任意 style 就能实时重绘换肤，不用换瓦片源；体积更小，缩放旋转不糊。代价是客户端渲染开销更高，而且依赖 WebGL，老旧设备浏览器可能不支持。

性能实践上重申一句：海量点位场景优先用 symbol 或 circle 图层，而不是成千上万个 Marker 这种 DOM 元素，前面讲过原因。

瓦片来源上给几个免费/自建的选择：MapLibre 官方演示 style demotiles；社区免费矢量瓦片服务 OpenFreeMap，完全免费不需要 key，今天示例里一直在用；商业托管服务 MapTiler；自建可以用开源的 tileserver-gl。Mapbox 一侧默认走它自己官方托管的矢量瓦片，是计费的主要来源。海量 GeoJSON 场景 MapLibre 官方还有专门的性能优化指南，感兴趣的可以去查。
-->

---

# 生态：deck.gl 与 react-map-gl

<v-clicks>

- **deck.gl**：`@deck.gl/mapbox` 模块叠加大规模数据可视化图层
  - **overlaid** 模式：独立 canvas 叠加渲染，兼容性好
  - **interleaved** 模式：直接渲染进地图 WebGL2 上下文，可与底图严格按高度排序，需 `maplibre-gl > 3` + WebGL2
- **react-map-gl**：官方推荐的 React 封装
  - v8 起拆分为 `react-map-gl/mapbox`（适配 `mapbox-gl>=3.5.0`）与 `react-map-gl/maplibre`（适配 `maplibre-gl>=4`）
  - 两个子包不能混用，按底层库分别导入

</v-clicks>

<!--
生态这块讲两个最常被问到的库。

deck.gl 提供 @deck.gl/mapbox 模块，把它自己那套大规模数据可视化图层叠加在 Mapbox 或 MapLibre 地图上。两种叠加模式要分清：overlaid 是在独立的 canvas 里叠加渲染，兼容性好，大多数场景够用；interleaved 是直接渲染进地图本身的 WebGL2 上下文，好处是可以和底图图层严格按高度插值排序，谁前谁后精确控制，但要求 maplibre-gl 版本大于 3 而且需要 WebGL2 支持，门槛更高。

react-map-gl 是官方推荐的 React 封装，v8 这个大版本起做了个明显变化：彻底拆分成两个独立子包，react-map-gl/mapbox 对应适配 mapbox-gl 3.5.0 以上，react-map-gl/maplibre 对应适配 maplibre-gl 4 以上。虽然同时支持两边，但用哪个底层库就得从对应子包导入，不能两边混用。
-->

---

# 易错点合集

<v-clicks>

- **`center` 坐标顺序**：`[lng, lat]`，与 Leaflet 的 `[lat, lng]` 完全相反
- **忘记等 `load` 事件**：回调外 `addSource`/`addLayer` 大概率报错或静默失败
- **`accessToken` 误用**：Mapbox 必需，MapLibre 完全不需要，迁移常见遗留坑
- **忘记引入 CSS**：`mapbox-gl.css`/`maplibre-gl.css` 缺失致控件/弹窗样式错乱
- **容器无显式高度**：地图区域高度为 0，表现为整个白屏
- **`mouseenter`/`mouseleave` 漏传 layer 参数**：退化为全局 `mouseover`/`mouseout`
- **`Marker` 数量过多**：DOM 标记数以百计后卡顿，应改用 `symbol` 图层
- **legacy filter 语法**：`["==", "class", "river"]` 已过时，统一改 `["==", ["get","class"], "river"]`

</v-clicks>

<!--
易错点合集，把今天讲过的和没细讲的坑收拢成一个清单，方便查漏补缺。

坐标顺序、load 事件时机、accessToken 误用，这三条前面都专门讲过，是最高频的三个。CSS 忘引入和容器无高度，这两条是最基础的"地图不显示"故障，几乎人人踩过。mouseenter/mouseleave 漏传 layer 参数、Marker 数量过多、legacy filter 语法，这三条稍微进阶一点，但也都在文档的最佳实践或 Deprecations 里明确写了。

这里没展开但值得提一句的：自建瓦片服务器 CORS 没配对，瓦片请求会被浏览器拦截，表现是地图空白但网络面板能看到请求；还有聚合数据缺稳定 id 导致 feature-state 设置失败，前面 feature-state 那页提过要加 generateId: true。这些坑基本覆盖了从入门到中级最容易摔跤的地方。
-->

---
layout: two-cols-header
---

# 选型定案：怎么选？

需要平滑缩放旋转、3D、大数据量客户端动态着色 → 上矢量瓦片；阵营内部怎么选：

::left::

**选 Mapbox GL JS**

<v-clicks>

- 需要专属底图质量（Standard style）
- 需要导航/搜索等配套 API
- 能接受按量计费

</v-clicks>

::right::

**选 MapLibre GL JS**

<v-clicks>

- 追求零许可成本、完全免费
- 需要自建/自主可控、可魔改源码
- 纯预算敏感项目

</v-clicks>

::bottom::

<div v-click class="text-sm mt-2">

迁移成本低：换包名、去 `accessToken`、换 CSS 类名前缀（`mapboxgl-ctrl` → `maplibregl-ctrl`），业务代码基本不用大改。延伸阅读：`maplibre.org/maplibre-gl-js`。

</div>

<!--
最后落到选型定案。前提先重申一句选型口诀：需要平滑缩放旋转、3D 效果、大数据量客户端动态着色，就该上矢量瓦片这条路线，Leaflet 那类栅格瓦片不用考虑了。真正要做判断的，是矢量瓦片阵营内部 Mapbox 和 MapLibre 怎么选。

选 Mapbox：如果需要它专属的底图质量，比如 Mapbox Standard 风格内置的 3D 光照大气效果；需要它配套的导航、搜索这类服务化 API；并且团队能接受按量计费，那就选 Mapbox。

选 MapLibre：如果追求零许可成本、完全免费、没有使用量限制；需要自建瓦片服务、完全自主可控甚至魔改源码；或者就是预算敏感的项目，那 MapLibre 是更合适的选择。

好消息是两边迁移成本很低：因为 API 高度兼容，从 Mapbox 换到 MapLibre 通常只需要换包名、去掉 accessToken、把自定义样式里引用的 CSS 类名前缀从 mapboxgl-ctrl 换成 maplibregl-ctrl，业务代码基本不用大改。今天的内容就到这里，想深入可以去 MapLibre 官方文档继续看，谢谢大家。
-->
