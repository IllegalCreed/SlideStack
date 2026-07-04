---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Leaflet
info: |
  Presentation Leaflet —— 轻量级移动友好交互地图库。

  Learn more at [https://leafletjs.com](https://leafletjs.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🍃</span>
</div>

<br/>

## Leaflet —— 轻量级交互地图库

移动友好的开源 JS 地图库，核心 42KB，v1.9.4

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/Leaflet/Leaflet" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Leaflet —— 官方定位：专为移动友好交互式地图设计的开源 JavaScript 库。

一句话：它是开源地图领域事实标准之一，核心目标是简洁、性能、易用三者兼顾。本次内容以 npm 实测的 latest 版本 1.9.4 为准——这也是 leafletjs.com 官网当前展示的稳定版本。

顺序：定位 → 上手 → 瓦片图层与坐标系 → 标记图标 → 弹窗矢量图形 → GeoJSON → 图层管理与控件 → 事件 → 性能 → 插件生态 → 易错点 → 选型对比 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# Leaflet 是什么？

<v-clicks>

- 官方定位：**专为移动友好交互地图设计**的开源 JS 库
- 目标三角：simplicity（简洁）+ performance（性能）+ usability（易用）
- 技术路线：**栅格瓦片图片** + DOM/SVG/Canvas 叠加矢量图形
- 与 Mapbox GL JS / MapLibre GL JS（矢量瓦片 + WebGL）并列三大主流选型

</v-clicks>

<div v-click class="mt-6 text-sm">

> 核心库约 **42KB**（min+gzip）、无强制依赖、配合 OSM **无需 API Key**、10 年 API 高度向后兼容，生产就绪度极高。

</div>

<!--
Leaflet 是什么？官网原话：a JavaScript library for mobile-friendly interactive maps。

三个目标：simplicity 简洁、performance 性能、usability 易用性。技术路线上，它走的是"栅格瓦片图片 + DOM/SVG/Canvas 叠加矢量图形"的传统路子，这点和后面会讲到的 Mapbox GL JS、MapLibre GL JS 这类矢量瓦片 + WebGL 的新一代路线不同，两者并列为开源地图三大主流选型。

优势很突出：核心库官方宣传约 42KB min+gzip，没有强制依赖；配合 OpenStreetMap 这类开放瓦片源不需要 API Key；API 十年来高度向后兼容。所以它是当前地图选型里最"低风险"的一个，尤其适合中小型项目和内容型网站的位置展示需求。
-->

---

# 快速上手：三行代码起步

```js
// 1. 创建地图实例并设置初始视图（中心点 + 缩放级别）
var map = L.map('map').setView([51.505, -0.09], 13);

// 2. 添加瓦片图层作为底图
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 3. 添加一个标记并绑定弹窗
L.marker([51.5, -0.09]).addTo(map)
  .bindPopup('A pretty CSS popup.<br> Easily customizable.')
  .openPopup();
```

<!--
来看最小可用骨架，三步走。

第一步，L.map 传容器 id 创建地图实例，链式调 setView 传中心点经纬度数组和缩放级别。第二步，L.tileLayer 传瓦片 URL 模板和 options，addTo 挂到地图上作为底图。第三步，L.marker 加一个标记，链式 bindPopup 绑内容、openPopup 直接打开。

这就是官方 Quick Start 教程的完整骨架，链式调用是 Leaflet API 的一贯风格。但光有这三步还不够——下一页说两个新手必踩的坑。
-->

---

# 上手两个"必踩坑"

**1. CSS 必须引入**（否则控件/图标/弹窗布局全部错乱）：

```js
// 打包工具环境（vite/webpack），对应 package.json 的 style 字段
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
```

<div v-click>

**2. 容器高度必须显式设置**（否则容器高度为 0，**地图空白不显示**）：

```css
#map { height: 400px; }
```

</div>

<div v-click class="mt-2 text-sm">

官方 Quick Start 原文强调这是**第一条注意事项**：确保地图容器具有定义的高度，父级 flex 布局链路也要把高度传到底。

</div>

<!--
两个新手最容易踩的坑。

第一个：CSS 必须引入。Leaflet 的控件、默认图标、弹窗布局全部依赖官方 CSS，package.json 里明确有个 style 字段指向 dist/leaflet.css，打包工具环境下直接 import 这个 css 文件，或者用 CDN link 标签引入。不引入的后果是控件错位、图标显示不全、弹窗布局全部损坏。

第二个，也是官方教程里第一条着重强调的注意事项：地图容器 div 必须显式设置 CSS 高度。不设置的话容器高度是 0，地图区域直接空白不显示，这是新手最高频的"地图空白"问题。特别提醒，如果容器嵌在 flex 布局里，高度要一路链式传递到底，不能断在中间某一层。
-->

---

# 常用 Map Options

| 选项 | 说明 |
|---|---|
| `center` / `zoom` | 初始中心点 / 初始缩放级别 |
| `minZoom` / `maxZoom` | 允许的最小 / 最大缩放级别 |
| `zoomControl` | 缩放控件，默认 `true` |
| `attributionControl` | 版权控件，默认 `true` |
| `maxBounds` | 限制可平移查看的地理范围 |
| `preferCanvas` | 矢量图形优先用 Canvas 而非 SVG |
| `dragging` / `scrollWheelZoom` | 拖拽 / 滚轮缩放等交互开关 |

<div v-click class="mt-4 text-sm">

常用方法：`setView` / `flyTo`（带动画飞行）/ `fitBounds` / `invalidateSize`（容器尺寸变化后必调）/ `panTo` / `getBounds`。

</div>

<!--
地图初始化除了 center 和 zoom，还有一批常用 options。

minZoom/maxZoom 限制缩放范围；zoomControl 和 attributionControl 默认都是 true，也就是默认自动加缩放按钮和版权控件；maxBounds 限制平移查看的地理范围，超出会自动弹回；preferCanvas 是性能相关选项，后面性能那页细讲；dragging、scrollWheelZoom 这类是各种交互开关。

常用方法里重点记 invalidateSize，容器尺寸变化后必须手动调用，后面易错点会展开说为什么。flyTo 是带动画的平滑飞行，比 setView 视觉效果更好。
-->

---

# 瓦片图层 TileLayer

```js
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
```

<v-clicks>

- URL 占位符：`{z}` 缩放级别、`{x}{y}` 瓦片坐标、`{s}` 子域名、`{r}` Retina 高清屏后缀
- ⚠️ **`attribution` 是法律要求**，OSM 等开放数据源明确要求署名，生产环境不可删除/隐藏
- 多个 `tileLayer` 可叠加（底图 + 路网标注层），用 `zIndex` 或添加顺序控制堆叠

</v-clicks>

<!--
瓦片图层是 Leaflet 的底图机制。L.tileLayer 传 URL 模板和 options，addTo 挂到地图。

URL 模板里几个占位符：z 是缩放级别，x y 是瓦片坐标，s 是可用子域名默认 abc 用于浏览器并行请求提速，r 是 Retina 高清屏后缀比如 @2x。

重点强调一条：attribution 版权声明是法律要求，OpenStreetMap 这类开放数据源的使用条款明确要求署名展示，生产环境删除或隐藏版权控件是违反数据源使用条款的。

另外，多个 tileLayer 可以叠加使用，比如底图加一层路网标注层，通过 zIndex 或添加顺序控制谁在上谁在下。
-->

---

# TileLayer 常用 Options

| 选项 | 默认值 | 说明 |
|---|---|---|
| `subdomains` | `'abc'` | 子域名列表，用于并行请求提速 |
| `tms` | `false` | 是否为 TMS 服务（Y 轴反转） |
| `opacity` / `zIndex` | `1.0` / `1` | 瓦片透明度 / 层级顺序 |
| `minZoom` / `maxZoom` | `0` / `18` | 该图层允许显示的缩放范围 |
| `minNativeZoom` / `maxNativeZoom` | `undefined` | **瓦片源实际提供瓦片的级别范围** |
| `bounds` | `undefined` | 仅在指定地理范围内加载瓦片 |
| `keepBuffer` | `2` | 平移时视口外预加载的瓦片行列数 |

<!--
TileLayer 的进阶 options。

前几项比较直观：subdomains 子域名、tms 是否为 TMS 服务、opacity 透明度、zIndex 层级。

重点看 minNativeZoom/maxNativeZoom 这一对，容易和 maxZoom 混淆——maxZoom 是地图允许缩放到的级别，而 maxNativeZoom 是瓦片源实际提供瓦片的级别范围，这是进阶必考点，后面易错点会展开讲两者不一致时会发生什么。

bounds 限定只在某地理范围内加载瓦片；keepBuffer 是预加载策略，平移时视口外保留的瓦片行列数，值越大预加载越多、越流畅，但请求量也越大。另外还有个 errorTileUrl 选项，瓦片加载失败时的占位图。
-->

---

# 坐标系与 LatLng（必考坑）

```js
// ⚠️ 纬度在前、经度在后——与 GeoJSON 顺序相反！
var latlng = L.latLng(51.505, -0.09);

var bounds = L.latLngBounds(southWest, northEast);
bounds.extend(anotherLatLng); // 扩展边界以包含新点
map.fitBounds(bounds);
```

⚠️ GeoJSON 标准坐标是 `[经度, 纬度]`（RFC 7946），**顺序相反**，混用时最容易踩坑——标记跑到地球另一端。

| CRS | 用途 |
|---|---|
| `EPSG3857`（默认） | Web Mercator，瓦片地图事实标准 |
| `EPSG4326` | WGS84 经纬度直接映射，对接部分 WMS |
| `Simple` | 无地理意义的笛卡尔坐标，游戏/室内图 |

<!--
坐标系是 Leaflet 最容易踩的一个坑。

L.latLng 的参数顺序是纬度在前、经度在后。而 GeoJSON 标准规定的坐标数组顺序是经度在前、纬度在后，两者完全相反。手写坐标、或者从 GeoJSON 数据转手写数组时最容易搞反，表现就是标记或图形出现在地球另一端或者海洋中央，调试起来很费劲，一定要记牢这条。

LatLngBounds 常用 extend 方法扩展边界纳入新点，配合 fitBounds 让地图自动缩放到刚好容纳这些边界。

CRS 坐标参考系，默认 EPSG3857 也就是 Web Mercator，是瓦片地图的事实标准；EPSG4326 是 WGS84 经纬度直接映射，常用于对接部分 WMS 服务；Simple 是无地理意义的简单笛卡尔坐标，用于游戏地图或室内平面图。官方文档原话是"如果不确定它的含义，不要修改这个选项"，说明这是较少需要触碰的进阶配置。
-->

---

# 标记与图标 Marker / Icon

```js
var marker = L.marker([51.5, -0.09]).addTo(map);

// 自定义图片图标
var greenIcon = L.icon({
  iconUrl: 'leaf-green.png',
  iconSize:    [38, 95],   // 图标尺寸
  iconAnchor:  [22, 94],   // 图标对应地理位置的锚点
  popupAnchor: [-3, -76]   // 弹窗相对锚点的打开位置
});
L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);
```

<v-clicks>

- 常用 options：`draggable`（可拖拽）/ `title`（hover 提示）/ `zIndexOffset` / `opacity`
- `L.divIcon()`：不依赖图片，用 HTML/CSS 渲染，适合动态徽标内容
- `L.Icon.extend({...})` 封装可复用图标类，避免重复配置共同参数

</v-clicks>

<!--
标记是地图上最常用的元素。L.marker 传经纬度数组，addTo 加到地图。

自定义图标用 L.icon，几个关键参数：iconSize 图标尺寸、iconAnchor 图标上对应地理位置的锚点、popupAnchor 弹窗相对锚点的打开位置。这几个锚点参数决定了图标视觉上"指向"的精确位置，调不好会出现标记图标和实际点位对不齐的问题。

常用 options 里 draggable 让标记可拖拽，title 是浏览器原生 hover 提示文字，zIndexOffset 用于修正层级。

divIcon 不依赖图片资源，用 html 加 className 渲染纯 DOM/CSS 标记，适合需要动态内容的场景，比如数字徽标、SVG、CSS 动画。如果多个标记要共享同一套图标配置，用 L.Icon.extend 封装成一个可复用的图标类，避免重复写配置。
-->

---

# Popup 与 Tooltip

```js
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

marker.bindTooltip("常驻提示", { permanent: true, direction: 'top' });
```

| 维度 | Popup | Tooltip |
|---|---|---|
| 触发方式 | 点击 | hover |
| 默认行为 | 常驻直到手动关闭 | 移开鼠标即消失 |
| 典型用途 | 承载更多信息/交互 | 轻量提示 |
| 关键 option | `autoPan`（自动平移使其可见） | `sticky`（跟随鼠标移动） |

<!--
Popup 和 Tooltip 都是给图层挂内容提示，但定位不同。

bindPopup 绑定弹窗内容，openPopup 主动打开；bindTooltip 绑定提示，可以设 permanent 让它常驻显示而不是只在 hover 时出现，direction 控制提示相对目标的方向。

核心区别记这张表：Popup 默认点击触发、常驻直到用户主动关闭，适合承载更多信息和交互内容；Tooltip 默认 hover 显示、移开鼠标就消失，是轻量提示。Popup 的 autoPan 会自动平移地图让弹窗完整可见；Tooltip 的 sticky 让提示框跟随鼠标移动而不是固定在锚点。两者共同方法都是 bindXxx/openXxx/closeXxx/setContent 这一套。
-->

---

# 矢量图层 Path 系列

```js
L.polyline(latlngsArray, options);                          // 折线
L.polygon([[lat1,lng1],[lat2,lng2],[lat3,lng3]], options);   // 多边形：自动闭合
L.rectangle(latLngBounds, options);                          // 矩形：传 LatLngBounds
L.circle([lat,lng], {radius: 500});                          // 圆：radius 单位【米】
L.circleMarker([lat,lng], {radius: 5});                      // 圆点：radius 单位【像素】
```

<v-clicks>

- ⚠️ `Circle.radius` 是米（随缩放保持真实地理尺寸），`CircleMarker.radius` 是像素（屏幕固定大小）——**极易混淆**
- 默认渲染器 **SVG**：每个图形是独立 DOM 节点，事件精确、可用 CSS 操作
- `preferCanvas: true` 或 `L.canvas()`：图形量大时改用单张 Canvas 绘制，性能更好但非独立 DOM 节点

</v-clicks>

<!--
矢量图层是 Path 系列，五个构造函数。polyline 折线传普通坐标数组；polygon 多边形会自动闭合首尾；rectangle 矩形传的是 LatLngBounds 而不是坐标数组，这点和前两个不一样；circle 传半径 radius，单位是米，随地图缩放保持真实地理尺寸；circleMarker 也有 radius，但单位是像素，屏幕固定大小不随缩放改变。

这两个 radius 单位不同极易混淆，选错会导致图形在不同缩放级别下表现完全不符合预期，务必记住:Circle 是地理尺寸的圆，CircleMarker 是屏幕尺寸的点。

渲染器方面，默认用 SVG，每个图形是独立 DOM 节点，事件精确、可以用 CSS 直接操作样式，但图形数量大时 DOM 开销高。设置 preferCanvas 为 true 或者显式用 L.canvas，会改用一张 Canvas 绘制所有矢量图形，大量图形场景性能更好，但每个图形不再是独立 DOM 节点，样式和事件处理方式也不同。
-->

---

# Path 通用 Options

| 选项 | 默认值 | 说明 |
|---|---|---|
| `stroke` | `true` | 是否绘制描边 |
| `color` | `'#3388ff'` | 描边颜色 |
| `weight` | `3` | 描边宽度（像素） |
| `fill` | 视形状而定 | 是否填充 |
| `fillColor` / `fillOpacity` | 同 `color` / `0.2` | 填充颜色 / 填充不透明度 |
| `dashArray` | — | 虚线样式，如 `'5, 10'` |

<div v-click class="mt-4 text-sm">

配套方法：`setStyle()` 动态改样式、`setLatLngs()` 改坐标点、`getBounds()` 取边界。这些 options 被 Polyline/Polygon/Circle/CircleMarker/Rectangle **共享**。

</div>

<!--
这张表是 Path 系列共享的通用样式 options，Polyline、Polygon、Circle、CircleMarker、Rectangle 全部共用。

stroke 控制是否画描边，color 是描边颜色默认那个标志性的 Leaflet 蓝，weight 是描边像素宽度。fill 是否填充视形状而定，fillColor 默认跟随 color，fillOpacity 默认 0.2。dashArray 设虚线样式。

动态改样式用 setStyle，比如做 hover 高亮效果；改坐标点用 setLatLngs；取边界用 getBounds，常配合 fitBounds 做视图定位。这几个 options 和方法在后面 Choropleth 分级统计图案例里会全部用上。
-->

---

# GeoJSON 基础

```js
L.geoJSON(geojsonFeature, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, { radius: 8, fillColor: "#ff7800", fillOpacity: 0.8 });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties?.popupContent) layer.bindPopup(feature.properties.popupContent);
  },
  filter: function (feature) { return feature.properties.show_on_map; }
}).addTo(map);
```

<v-clicks>

- `pointToLayer`：把 GeoJSON `Point` 要素转成自定义 Marker/CircleMarker（默认才会用普通 Marker）
- `onEachFeature`：对每个要素执行回调，典型用途是绑定 popup、绑定 hover/click 事件
- ⚠️ **坐标顺序 `[经度, 纬度]`**，Leaflet 内部自动转 `LatLng`，业务代码手写坐标时容易搞混

</v-clicks>

<!--
GeoJSON 是 Leaflet 对接地理数据最核心的能力，L.geoJSON 传数据和 options，addTo 挂到地图。

四个关键 options：pointToLayer 把 Point 类型要素转换成自定义的 Marker 或 CircleMarker，不写的话默认会用普通 Marker；onEachFeature 对每个要素执行回调，最典型的用法是绑定 popup 内容、绑定 mouseover/mouseout/click 这类交互事件；filter 控制哪些要素被渲染，返回 false 就跳过；style 下一页细讲。

再次强调坐标顺序：GeoJSON 标准坐标是经度在前纬度在后，Leaflet 内部会自动转换成 LatLng 供渲染，但业务代码手写坐标、或者从 GeoJSON 数据转手写数组时非常容易和 LatLng 的顺序搞混。

其它常用方法：addData 追加数据到已有图层，resetStyle 重置为默认样式，toGeoJSON 导出当前图层为 GeoJSON。
-->

---

# Choropleth 分级统计图（官方范式）

```js
function getColor(d) {
  return d > 500 ? '#BD0026' : d > 100 ? '#FC4E2A' : d > 20 ? '#FEB24C' : '#FFEDA0';
}
function style(feature) {
  return { fillColor: getColor(feature.properties.density), weight: 2, color: 'white', fillOpacity: 0.7 };
}
function highlightFeature(e) {
  e.target.setStyle({ weight: 5, color: '#666' });
  e.target.bringToFront();
}
function onEachFeature(feature, layer) {
  layer.on({ mouseover: highlightFeature, mouseout: (e) => geojson.resetStyle(e.target) });
}
var geojson = L.geoJson(statesData, { style, onEachFeature }).addTo(map);
```

<div v-click class="mt-2 text-sm">

三段式范式：`getColor` 阶梯函数 + `style`（属性驱动着色）+ `onEachFeature`（hover 高亮 / `resetStyle` 复位）。配套 Legend/Info 控件见下一节。

</div>

<!--
Choropleth 分级统计图是官方人口密度地图案例，也是 GeoJSON 最经典的高级用法，三段式范式。

第一段 getColor，一个阶梯函数，按数值区间返回不同颜色。第二段 style，读取 feature.properties 里的属性值调 getColor 动态返回样式对象，这是分级着色的核心机制。第三段 onEachFeature，给每个要素绑定 mouseover 触发高亮——setStyle 加粗描边、bringToFront 置顶，mouseout 时用 geojson.resetStyle 把样式恢复原状。

这套模式非常通用，任何"按属性值分级着色 + hover 交互反馈"的地图可视化场景都可以照搬。配套的自定义 Info 控件显示当前 hover 区域信息、Legend 图例控件，都是用 L.control 实现，下一节图层控件会展开讲这个模式。
-->

---

# 图层管理与图层控件

```js
var baseMaps = { "OpenStreetMap": osm, "OpenTopoMap": topo };
var overlayMaps = { "Cities": cities, "Parks": parks };
L.control.layers(baseMaps, overlayMaps).addTo(map);
```

<v-clicks>

- `L.layerGroup([...])`：打包多个图层统一增删，**不支持** `bindPopup`/事件监听
- `L.featureGroup(...)`：继承自 LayerGroup，额外支持整体 `bindPopup`/事件（因为它本身也是 Layer）
- `L.control.layers(base, overlay)`：`base` 内互斥（单选切换底图），`overlay` 内独立开关（复选叠加层）
- `collapsed`（默认 `true`）控制控件默认是否折叠

</v-clicks>

<!--
图层管理有两层：数据结构层的 LayerGroup/FeatureGroup，和 UI 层的 Control.Layers。

LayerGroup 把多个图层打包成一个整体，统一 addTo/removeFrom 地图，但它本身不支持 bindPopup 或者事件监听。FeatureGroup 继承自 LayerGroup，额外支持整体绑定 popup 和事件，因为它本身也是一个 Layer，能触发和响应事件，需要统一交互能力时要用它而不是普通 LayerGroup。

L.control.layers 接收两个对象参数，baseMaps 里的图层互斥，单选切换底图，overlayMaps 里的图层各自独立开关，复选叠加显示。控件会自动检测已经加到地图上的图层并同步勾选状态，collapsed 默认 true 控制是否默认折叠。动态追加图层用 addBaseLayer/addOverlay 方法。
-->

---

# 自定义 Control（Legend 范式）

```js
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 10, 20, 50, 100, 200, 500, 1000];
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML += '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' + grades[i];
  }
  return div;
};
legend.addTo(map);
```

<div v-click class="mt-3 text-sm">

任意自定义 Control 都遵循同一模式：`L.control(options)` 创建实例 → 重写 `onAdd(map)` 返回一个 DOM 节点 → （可选）重写 `onRemove(map)` → `.addTo(map)`。

</div>

<!--
自定义 Control 是扩展地图 UI 最常用的手段，Legend 图例是最典型案例。

先 L.control 传 position 创建实例，这里 bottomright 右下角。核心是重写 onAdd 方法，参数是 map 实例，函数体内用 L.DomUtil.create 建一个 DOM 节点，往里拼接内容——这里遍历 grades 数组，每个区间配一个颜色色块加数值文字，最后 return 这个 div。

任意自定义 Control，不管是这里的 Legend，还是 Choropleth 案例里配套的 Info 控件，都遵循同一个模式：创建实例、重写 onAdd 返回 DOM 节点、可选重写 onRemove 做清理、最后 addTo 挂到地图。官方内置的 Zoom、Attribution、Layers、Scale 四个控件也是同一套机制的具体实现。
-->

---

# 事件系统 Evented

```js
map.on('click', function (e) {
  console.log(e.latlng); // 点击处地理坐标
});
map.once('load', fn);   // 触发一次后自动移除
map.fire('customEvent', { data: 1 }); // 主动派发自定义事件
```

<v-clicks>

- `on(type, fn, context?)` / `off(type, fn?)` / `once(...)` / `fire(type, data?, propagate?)`
- **几乎所有核心类都继承自 `Evented`**：`Map` / `Marker` / 各类 `Layer` / `Control` / `Popup` / `Tooltip` / `FeatureGroup`
- 统一的事件 API 是 Leaflet 架构一致性的核心设计，所有对象都能 `.on('click', fn)` 一致地用

</v-clicks>

<!--
Leaflet 的事件系统叫 Evented，是贯穿整个库的架构基石。

四个核心方法：on 注册监听、off 移除监听、once 只触发一次后自动移除、fire 主动触发或派发自定义事件，可以带数据和是否向父级传播的参数。

关键点在于覆盖面:Map、Marker、各类 Layer 包括 Path 系列、TileLayer、GeoJSON，还有 Control、Popup、Tooltip、FeatureGroup，几乎所有核心类都继承自这个 Evented 基类。这意味着不管你在操作地图本身、一个标记、还是一个图层组，都能用同一套 on/off/once/fire API，这是 Leaflet 架构一致性的核心设计，也是它学习曲线平缓的原因之一——学会一次事件 API，到处都能用。
-->

---

# 性能与大数据量

```js
var markers = L.markerClusterGroup(); // 海量 Marker 聚合插件
markers.addLayer(L.marker([lat, lng]));
// ...全部 addLayer 到 cluster group 后再整体加入地图
map.addLayer(markers);
```

<v-clicks>

- **Leaflet.markercluster** 插件：支持 **5 万+** 点位聚合，缩放聚合/展开动画、视口外标记不渲染
- 更新单个 marker 位置需先从组里移除、改坐标、再重新添加，才能被聚合逻辑正确追踪
- `preferCanvas: true` 或 `L.canvas()`：矢量图形量大时用 Canvas 取代逐个 SVG DOM 节点
- ⚠️ `invalidateSize()`：容器尺寸变化后（Tab 切换/侧边栏折叠/flex 重排）**必须手动调用**，否则瓦片错位

</v-clicks>

<!--
性能优化在大数据量场景下是 Leaflet 生产落地的重点。

海量 Marker 用 Leaflet.markercluster 插件，官方特性描述支持 5 万以上点位。最佳实践是把全部 marker 先 addLayer 进 cluster group，再把 cluster group 整体 addLayer 到地图，而不是先把地图加好再逐个插入标记，这样能避免逐个触发聚合计算的开销。它还带缩放时的聚合展开动画、视口外标记不渲染节省资源、最低缩放级别下点击聚合点"蜘蛛化"展开重叠标记这些特性。更新单个 marker 位置有个讲究:要先从组里移除、改坐标、再重新添加，才能被聚合逻辑正确追踪，大批量更新时更推荐整体移除、批量改、整体重新加入。

矢量图形量大时同理，preferCanvas 或显式 L.canvas 把逐个 SVG DOM 节点换成一张 Canvas 绘制。

最后再强调一遍 invalidateSize，容器尺寸变化后如果不手动调用，Leaflet 内部尺寸缓存和实际 DOM 尺寸不一致，会导致瓦片错位、留白、拖拽和点击坐标偏移，这是生产环境里最容易被忽略的一个调用。
-->

---

# 插件生态（核心特色）

Leaflet 核心刻意保持精简，绝大多数进阶能力靠插件：

<v-clicks>

- **Leaflet.markercluster**：海量标记聚合（上一页）
- **Leaflet.draw**：地图上交互式绘制/编辑矢量图形（画点/线/面 + 编辑/删除）
- **Leaflet.heat**：热力图
- **Leaflet.Realtime**：实时数据源自动刷新图层
- **proj4leaflet**：对接任意自定义投影坐标系，突破 EPSG3857/4326/Simple 三选一
- **leaflet-defaulticon-compatibility**：修复 webpack/vite 等构建工具下默认图标路径丢失

</v-clicks>

<div v-click class="mt-4 text-sm">

⚠️ 插件质量参差、部分不再维护，是团队选型 Leaflet 时需要额外评估的成本项。

</div>

<!--
Leaflet 的插件生态是它的核心特色，也是它保持核心精简的原因——不内置绘制编辑、热力图这些能力，全靠插件补齐。

Leaflet.markercluster 前面讲过。Leaflet.draw 是地图上交互式绘制编辑矢量图形，画点线面加编辑删除功能。Leaflet.heat 做热力图。Leaflet.Realtime 对接实时数据源自动刷新图层。proj4leaflet 对接任意自定义投影坐标系，突破默认三选一的 CRS 限制。leaflet-defaulticon-compatibility 专门解决 webpack、Rails Asset Pipeline、Django pipeline 这类构建工具下默认图标路径丢失的问题。

要客观说明：插件质量参差不齐，部分已经不再维护，这是团队做技术选型时评估 Leaflet 的一项额外成本，需要提前调研候选插件的维护状态。
-->

---

# 易错点 Top 6

| 坑 | 表现 |
|---|---|
| 容器高度未设置 | 地图空白不显示 |
| LatLng 与 GeoJSON 坐标顺序相反 | 标记跑到地球另一端/海洋中央 |
| `invalidateSize()` 遗漏 | 容器尺寸变化后瓦片错位、坐标偏移 |
| webpack/vite 打包默认图标 404 | 需手动 `mergeOptions` 重设图标 URL |
| `maxZoom` 超过 `maxNativeZoom` | 瓦片被放大插值糊化，误认为未加载 |
| `Circle`/`CircleMarker` 半径单位混淆 | 米 vs 像素，缩放表现不符预期 |

<!--
把前面讲过的坑集中梳理一遍，六个高频问题。

容器高度未设置，地图空白，这是最高频的新手问题。LatLng 和 GeoJSON 坐标顺序相反，标记跑到地球另一端。invalidateSize 遗漏，容器尺寸变化后瓦片错位。

webpack、vite 这类打包工具下默认图标会 404，因为 Leaflet 默认图标依赖运行时拼接图片 URL 路径，构建工具的资源哈希机制会打断这个逻辑，需要手动 delete 掉 _getIconUrl 再 mergeOptions 重新指定图标 URL，或者直接用 leaflet-defaulticon-compatibility 插件。

maxZoom 超过 maxNativeZoom，瓦片源真实精度不够，超出原生级别的瓦片会被放大插值显示、图像糊化，容易被误认为是"该级别瓦片没加载出来"。最后 Circle 和 CircleMarker 半径单位混淆，前面矢量图层那页讲过，米还是像素一定要分清。
-->

---

# 选型对比：Leaflet vs Mapbox GL JS / MapLibre

| 维度 | Leaflet | Mapbox GL JS / MapLibre |
|---|---|---|
| 技术路线 | 栅格瓦片 + DOM/SVG/Canvas | 矢量瓦片 + WebGL GPU 渲染 |
| 核心体积 | 约 42KB | 数百 KB 级 |
| 3D / 倾斜 / 旋转 | 不支持（或需专门插件） | 原生支持，性能表现好 |
| 动态样式 | 无内置表达式，手写 JS 逻辑计算 | 内置 style expression，声明式插值 |
| API Key | 配合 OSM 等开放源**无需** | Mapbox 需 token；MapLibre 需自备瓦片源 |
| 许可证 | 全程 BSD-2-Clause 开源 | Mapbox v2 起转专有；MapLibre 社区 fork 延续开源 |

<div v-click class="mt-3 text-sm">

**何时选 Leaflet**：中小数据量位置展示、无 3D/旋转诉求、追求轻量与最少概念负担、规避商业地图 Token 依赖。

</div>

<!--
最后做个选型对比。

技术路线本质不同:Leaflet 是栅格瓦片图片加 DOM/SVG/Canvas 叠加矢量图形的传统路线;Mapbox GL JS 和 MapLibre GL JS 是矢量瓦片加 WebGL GPU 渲染的新一代路线。核心体积上 Leaflet 明显更小。3D、倾斜、旋转这些场景 Leaflet 原生不支持，GL JS 系原生支持且性能好。动态样式上，Leaflet 要自己写 JS 逻辑计算，比如前面 Choropleth 的 getColor 阶梯函数，GL JS 系有内置的声明式表达式系统。API Key 方面，Leaflet 配合 OSM 无需付费；Mapbox 官方瓦片需要 token，MapLibre 本身不强制但仍需自备瓦片源。许可证上 Leaflet 全程 BSD 开源，Mapbox GL JS v2 起改为非 OSI 的专有条款，MapLibre 就是社区从 Mapbox 最后一个 BSD 版本 fork 延续维护的开源分支。

什么时候选 Leaflet：需求是"放一张地图、标几个点、画几个区域、叠一层 GeoJSON"，不涉及 3D 或复杂动态样式，团队想要最小体积和最快上手，这时候 Leaflet 是最优选择。
-->

---
layout: intro
---

# 总结

Leaflet = **轻量级栅格瓦片交互地图库**

- 三行上手：`L.map().setView()` + `L.tileLayer().addTo()`；CSS 引入 + 容器高度是头号双坑
- LatLng 纬度在前，GeoJSON 经度在前——坐标顺序相反，混用最容易出错
- GeoJSON 三件套：`pointToLayer` / `onEachFeature` / `style`（驱动 Choropleth 分级着色）
- 海量数据靠 MarkerCluster + preferCanvas；插件生态覆盖绘制/热力图/实时数据
- 生产就绪度极高，是中小型项目、内容型网站位置展示的低风险选型

<div class="mt-6 text-sm opacity-75">

更多参考：leafletjs.com（官方文档）· github.com/Leaflet/Leaflet

</div>

<!--
总结一下。

Leaflet 是一个轻量级的、封装栅格瓦片渲染的交互地图库。三行代码就能上手，L.map 加 setView 定视图，L.tileLayer 加 addTo 铺底图，但 CSS 引入和容器高度这两个坑必须提前避开。

核心概念记住坐标顺序:LatLng 纬度在前，GeoJSON 经度在前，这是全程最容易踩的坑。GeoJSON 三件套 pointToLayer、onEachFeature、style，组合起来就是 Choropleth 分级统计图这类高级可视化范式。

工程实践上，海量数据用 MarkerCluster 聚合、preferCanvas 换渲染器；进阶能力大多交给插件生态，绘制编辑、热力图、实时数据都有对应插件。

整体评价:Leaflet 生产就绪度极高，是当前地图选型里最低风险的一个，尤其适合中小型项目和内容型网站的位置展示需求，也是我们今天要重点收纳的地图选型。谢谢大家。
-->
