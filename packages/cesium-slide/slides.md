---
theme: seriph
background: https://cover.sli.dev
title: Welcome to CesiumJS
info: |
  Presentation CesiumJS —— 全球尺度地理空间三维引擎（数字地球）。

  Learn more at [https://cesium.com](https://cesium.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🌍</span>
</div>

<br/>

## CesiumJS —— 开源数字地球引擎

全球尺度地理空间三维引擎，原生打通真实地形、3D Tiles 与时间动态可视化，当前版本 v1.143

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/CesiumGS/cesium" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 CesiumJS —— 开源（Apache 2.0）的 JavaScript 全球尺度地理空间三维引擎，开发方是 Cesium GS, Inc.，商业公司加开源社区双轨维护。

npm 实测版本 1.143.0，与官方 CDN Quickstart 教程给出的 1.143 完全对齐。核心依赖做了 monorepo 拆分：@cesium/engine 是渲染引擎核心（Scene/Camera/3D Tiles/Entity 全在这），@cesium/widgets 是 Viewer 及各类 UI 控件。发布节奏是月度发布，是本系列里少见的高频稳定迭代型项目。

今天的顺序：定位 → 上手与打包坑 → Viewer/Scene → 坐标系 → 相机 → Entity API → Entity vs Primitive → 影像/地形 → 3D Tiles → 时间动态 → 性能 → Ion 生态 → 易错点 → 选型对比。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# CesiumJS 是什么？

<v-clicks>

- 开源（Apache 2.0）JS **全球尺度地理空间三维引擎**（数字地球）
- 围绕 **WGS84 椭球**：真实地形 + 3D Tiles 流式加载 + 多源影像叠加
- 业界独有：**时间动态可视化**（Entity 属性系统 + CZML + Clock）
- 对比 Three.js：通用 3D 库，无内置地理坐标系，需自行实现
- 对比 Mapbox/MapLibre：2.5D Web Mercator 投影，极地形变、非真实球体
- 典型场景：GIS / 数字孪生 / BIM / 航空航天 / 卫星轨迹仿真

</v-clicks>

<!--
CesiumJS 一句话：围绕 WGS84 椭球提供真实地形、海量倾斜摄影/BIM/点云的 3D Tiles 流式加载、多源影像图层叠加，以及业界独有的时间动态可视化，是 GIS、数字孪生、BIM、航空航天、卫星轨迹仿真等严肃地理空间场景的事实标准之一。

跟 Three.js 比：Three.js 是通用 WebGL/WebGPU 3D 库，没有内置地理坐标系统，做地球得自己拼；Cesium 反过来，非地理场景（产品展示、游戏）用它是杀鸡用牛刀。

跟 Mapbox/MapLibre 比：那类是 2.5D 矢量地图引擎，底层是 Web Mercator 投影，globe 模式只是视觉上的球体，极地严重形变，不是真三维几何；Cesium 是真实地心地固坐标，全球无缝。

配套 Cesium Ion 云平台做资产托管，但不是强制依赖，可以完全自建数据源，后面会专门讲。
-->

---

# 上手：接入方式与 Ion Token

**CDN：**
```html
<script src="https://cesium.com/downloads/cesiumjs/releases/1.143/Build/Cesium/Cesium.js"></script>
```

**npm：** `npm install cesium`

**Ion accessToken**（World Terrain / OSM Buildings 等能力依赖，需到 `ion.cesium.com/tokens` 申请）：

```javascript
// 必须在创建 Viewer 之前设置默认 token
Cesium.Ion.defaultAccessToken = "你的_access_token";

const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(), // 使用 Ion 托管的全球地形
});
```

<!--
两种接入方式：CDN script 标签直接引入 Cesium.js 和对应的 widgets.css；npm 方式就是 npm install cesium，包本身 type 是 module，自带 Source/Cesium.d.ts 类型声明，不需要额外装 @types/cesium。

很多核心能力，比如 World Terrain 全球地形、OSM Buildings、Bing 影像，默认走 Cesium Ion 云服务，需要到 ion.cesium.com/tokens 申请一个 access token。关键点：这个 token 必须在创建 Viewer 之前设置到 Cesium.Ion.defaultAccessToken，顺序反了不生效。

下一页讲一个几乎所有新手都会踩的打包配置坑。
-->

---

# 打包坑：CESIUM_BASE_URL（必考）

CesiumJS 运行时异步加载 Worker/纹理/SVG，webpack/vite 默认处理不对，必须两步：

```javascript
// 1. 用插件把 node_modules/cesium/Build/Cesium/
//    {Workers,ThirdParty,Assets,Widgets} 四个目录复制到产物目录
// 2. 在 import cesium 之前，显式声明资源根路径
window.CESIUM_BASE_URL = "/static/Cesium/";
import * as Cesium from "cesium";
```

<v-clicks>

- 四个目录少复制一个 → **运行时**才报错，编译期完全不提示
- 典型报错：Worker 加载失败 / 图标空白 / `Failed to obtain worker`
- 打包工具可用 `vite-plugin-cesium` 一类插件自动处理这一步

</v-clicks>

<!--
这是 CesiumJS 社区最高频的提问，必考。CesiumJS 在运行时要异步加载 Web Worker 脚本、纹理、SVG 等静态资源，但 webpack、vite 这类打包工具默认不知道怎么处理这些资源路径。

必须两步：第一，用插件（vite-plugin-cesium，或手动 copy-webpack-plugin）把 node_modules/cesium/Build/Cesium 下的 Workers、ThirdParty、Assets、Widgets 四个目录复制到最终产物目录；第二，在 import cesium 之前，显式设置 window.CESIUM_BASE_URL，告诉 Cesium 去哪里找这些资源。

坑在于：如果忘了这步，典型报错是 Worker 加载失败、图标空白、Failed to obtain worker 这类运行时错误，而不是编译期报错，排查成本很高——很容易被误判成别的 bug。
-->

---

# Viewer：聚合控件

`Viewer` 聚合了标准 Cesium 控件，构造 options 均为布尔开关（默认几乎全部为 `true`）：

| 选项 | 作用 |
|---|---|
| `timeline` / `animation` | 时间轴 / 播放速率表盘 |
| `baseLayerPicker` | 底图 / 地形选择器 |
| `geocoder` | 地址搜索框 |
| `sceneModePicker` | 2D / 2.5D(Columbus) / 3D 切换 |
| `selectionIndicator` / `infoBox` | 选中绿框 / 信息弹窗 |

<div v-click class="mt-3 text-sm">

> 常用属性：`viewer.entities`、`viewer.dataSources`、`viewer.clock`、`viewer.scene`、`viewer.camera`、`viewer.selectedEntity`、`viewer.trackedEntity`（相机跟随）。

</div>

<!--
Viewer 是聚合了所有标准 Cesium 控件的复合控件，构造函数的 options 基本都是布尔开关，默认几乎全部是 true。timeline 是时间轴，animation 是左下角播放速率表盘，baseLayerPicker 是右上角底图/地形选择器，geocoder 是地址搜索框，sceneModePicker 是 2D/2.5D/3D 三种模式切换，selectionIndicator 和 infoBox 是点选实体后弹出的绿色框和信息弹窗。纯静态展示场景常见做法是把这些控件都关掉。

常用属性要记住：viewer.entities 是未挂 DataSource 的实体集合，viewer.dataSources 是数据源集合，viewer.clock 是时钟，viewer.scene 是场景本体，viewer.camera 是相机，viewer.selectedEntity 是当前选中的实体，viewer.trackedEntity 是相机跟随的目标。下一页看 Scene 本体。
-->

---

# Scene：渲染场景本体

核心子对象：

<v-clicks>

- `scene.globe`：地球本体（深度测试基准）
- `scene.camera` / `scene.primitives` / `scene.groundPrimitives`（贴地图元）
- `scene.imageryLayers`：影像图层集合

</v-clicks>

核心拾取方法：

```javascript
scene.pick(windowPosition);          // 拾取顶层对象
scene.pickPosition(windowPosition);  // 从深度缓冲区反算世界坐标
scene.drillPick(windowPosition);     // 穿透拾取多个对象
```

<div v-click class="mt-2 text-sm">

> `pickPosition` 依赖深度缓冲区，需场景已渲染出几何体才可用。

</div>

<!--
Scene 是渲染场景本体。核心子对象：scene.globe 是地球本体，做深度测试的基准；scene.camera 是相机；scene.primitives 是图元集合，scene.groundPrimitives 是专门给贴地图元用的集合；scene.imageryLayers 是影像图层集合。

三个核心拾取方法：scene.pick 拾取屏幕某点最顶层的对象；scene.pickPosition 从深度缓冲区反算出这一点对应的世界坐标，注意它依赖场景已经渲染出几何体，一个空场景是拿不到有效结果的；scene.drillPick 是穿透拾取，能拿到某一点上下叠着的多个对象，而不只是最顶层那个。
-->

---

# 坐标系统与转换（必考）

<v-clicks>

- **Cartesian3**：地心地固坐标（ECEF），单位米，引擎内部真正的"世界坐标"
- **Cartographic**：经纬度弧度表示 `{longitude, latitude, height}`
- 默认椭球体是 **WGS84**（`Ellipsoid.default`），即 GPS 使用的同一套地球椭球模型

</v-clicks>

```javascript
// 经度在前、纬度在后、高度可选默认 0 —— 反直觉的高频记忆点
Cesium.Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid, result);

// 局部坐标系(ENU)：以某点为原点构造东-北-天坐标系变换矩阵
const transform = Cesium.Transforms.eastNorthUpToFixedFrame(
  Cesium.Cartesian3.fromDegrees(-100.0, 40.0)
);
```

<!--
CesiumJS 涉及三套坐标概念，是新手最容易犯迷糊的地方。Cartesian3 是地心地固笛卡尔坐标 ECEF，单位米，是引擎内部真正的世界坐标；Cartographic 是经纬度的弧度表示；人类习惯的经纬度角度需要通过工厂方法转换成 Cartesian3。默认椭球体是 WGS84，就是 GPS 用的同一套地球椭球模型。

核心转换 API 参数顺序是必考点：fromDegrees 的参数是经度在前、纬度在后、高度可选默认 0，这跟国人日常"纬度经度"的口语习惯相反，是抄错坐标最常见的原因，表现为定位到大洋中央或对跖点附近。

局部坐标系东北天 ENU，用在"以某点为原点摆放模型/图元"的场景，eastNorthUpToFixedFrame 构造这个变换矩阵，后面相机跟随会再用到它。
-->

---

# 相机：flyTo 飞行定位（必考）

```javascript
// flyTo：带缓动动画飞行过去（相较 setView 瞬移无动画，产品级应用几乎总用它）
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0),
  orientation: { heading: Cesium.Math.toRadians(20.0), pitch: Cesium.Math.toRadians(-35.0), roll: 0.0 },
  easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
  duration: 5, // 秒
});

// 缩放定位到实体/数据源范围，自动计算合适视角
viewer.flyTo(someEntityOrDataSource);
viewer.zoomTo(entity);
```

<div v-click class="mt-2 text-sm">

> `orientation` 三个欧拉角：`heading`（偏航，0 为正北）/ `pitch`（俯仰，负值向下看）/ `roll`（横滚）。`setView` 瞬移无动画，`flyTo` 带过渡且可配 `duration`/`easingFunction`。

</div>

<!--
相机的 orientation 由三个欧拉角构成：heading 偏航角，绕天顶轴，0 为正北；pitch 俯仰角，0 为水平，负值向下看；roll 横滚角。

setView 和 flyTo 的核心区别：前者立即跳转、无动画；后者带缓动动画飞行过去，可以配置 duration 时长和 easingFunction 缓动函数，产品级应用几乎总是用 flyTo。

除了直接指定 destination，还可以用 viewer.flyTo 或 viewer.zoomTo 传入一个实体或数据源，引擎会自动计算合适的视角范围，不用自己算相机参数。还有 lookAtTransform 可以锁定相机相对某个局部坐标系（比如上一页的 ENU）的位置，常用于跟随或环绕飞行。
-->

---

# Entity API（一）：点 / 标签 / 公告牌

Entity 把位置 + 图形定义打包成数据驱动对象，`viewer.entities.add()` 挂载：

```javascript
// 点 + 标签
viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(-75.166493, 39.9060534),
  point: { pixelSize: 5, color: Cesium.Color.RED, outlineColor: Cesium.Color.WHITE },
  label: { text: "Citizens Bank Park", font: "14pt monospace" },
});

// 公告牌（图片标记）
viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(-75.166493, 39.9060534),
  billboard: { image: "/path/to/icon.png", width: 64, height: 64 },
});
```

<!--
Entity API 是高级声明式接口：把位置加若干图形定义打包成一个数据驱动对象，通过 viewer.entities.add 挂载。

第一个例子是点加标签：position 给经纬度转换的 Cartesian3，point 定义像素大小、颜色、描边颜色，label 定义文本和字体。第二个例子是公告牌billboard，本质是图片标记，给 image 路径和宽高。

这两种是最常见的 POI 类展示方式。下一页看折线、多边形、模型三种。
-->

---

# Entity API（二）：折线 / 多边形 / 模型

```javascript
// 折线
viewer.entities.add({
  polyline: { positions: Cesium.Cartesian3.fromDegreesArray([-77, 35, -77.1, 35]), width: 5 },
});

// 多边形
const wyoming = viewer.entities.add({
  polygon: { hierarchy: Cesium.Cartesian3.fromDegreesArray([/* 经纬度顺序对 */]), material: Cesium.Color.RED.withAlpha(0.5) },
});

// 3D 模型（glTF/glb）
const modelEntity = viewer.entities.add({ position: Cesium.Cartesian3.fromDegrees(-123.07, 44.05), model: { uri: "model.glb" } });
viewer.trackedEntity = modelEntity; // 相机跟随
```

<div v-click class="mt-2 text-sm">

> 增删查改：`viewer.entities.getById(id)` / `.remove(e)` / `.removeAll()`。拾取选中：`scene.pick()` 返回对象，`viewer.selectedEntity = entity` 触发绿框 + infoBox。

</div>

<!--
折线 polyline 的 positions 是交替经纬度数组转出的 Cartesian3 数组；多边形 polygon 的 hierarchy 定义边界点，material 给填充色带透明度；3D 模型 model 的 uri 指向 glTF/glb 文件，配合 viewer.trackedEntity 可以让相机自动跟随这个实体移动。

EntityCollection 的增删查改：getById 按 id 查找，remove 删除单个，removeAll 清空。拾取和选中：scene.pick 传入屏幕坐标返回被点中的对象，取它的 id 属性可能拿到 Entity 实例；把 viewer.selectedEntity 设成某个 entity 会触发经典的绿色选中框和右侧 infoBox 信息面板。
-->

---

# Entity vs Primitive 选型（必考）

| 场景 | 推荐 | 原因 |
|---|---|---|
| 少量 / 频繁更新的动态对象 | Entity | API 便捷，改属性即生效 |
| 大批量静态几何体（数千+） | Primitive | 合批减少 draw call |
| 需要自定义着色器 / 渲染状态 | Primitive | 更接近底层渲染管线 |
| 快速原型 / 常规业务开发 | Entity | 抽象层级适合业务代码 |

<div v-click class="mt-4 text-sm">

> `Primitive` = `Geometry`（几何形状）+ `Appearance`（外观/材质），数千个 `GeometryInstance` 合并进一个 `Primitive` 大幅降低 draw call。Entity 的便捷是有 CPU/GPU 开销代价的。

</div>

<!--
Entity vs Primitive 选型是必考点。少量、需要频繁更新的动态对象，用 Entity，API 便捷，改属性就生效；大批量静态几何体，数千个以上，用 Primitive，合批渲染减少 draw call，GPU 利用率更高；需要自定义着色器或渲染状态，得用 Primitive，更接近底层渲染管线；快速原型和常规业务开发，Entity 的抽象层级更适合写业务代码。

Primitive 本质是 Geometry 几何形状加 Appearance 外观材质的组合，典型用法是把数千个 GeometryInstance 合并进一个 Primitive，从几千次 draw call 压缩成一次，大幅降低 CPU 提交开销。记住一句话：Entity 的便捷是有 CPU/GPU 开销代价的，大规模静态数据应该转 Primitive 合批，这是常见的性能重构路径。
-->

---

# 影像图层 Imagery

`ImageryProvider`（负责请求瓦片）与 `ImageryLayer`（已显示的图层，控制透明度/顺序）：

```javascript
// 用 Ion 托管的影像资产作为底图
const viewer = new Cesium.Viewer("cesiumContainer", {
  baseLayer: Cesium.ImageryLayer.fromProviderAsync(
    Cesium.IonImageryProvider.fromAssetId(3830183)
  ),
});

layer.alpha = 0.5;      // 透明度 0~1
layer.brightness = 2.0; // 亮度
layers.raiseToTop(layer);
```

<div v-click class="mt-2 text-sm">

> 其余常见 Provider：`BingMapsImageryProvider`、`WebMapServiceImageryProvider`(WMS)、`UrlTemplateImageryProvider`、`ArcGisMapServerImageryProvider`、`OpenStreetMapImageryProvider`。

</div>

<!--
ImageryProvider 和 ImageryLayer 是两个概念：前者负责向某个服务请求瓦片，后者代表已经显示的瓦片图层，可以控制透明度和层级顺序，实践上常常合并调用，比如 ImageryLayer.fromProviderAsync 包一层 IonImageryProvider 就能把 Ion 托管的影像资产设成 Viewer 的底图。

图层操作：alpha 控制透明度 0 到 1，brightness 控制亮度，layers.raise/lower/raiseToTop/lowerToBottom 控制层级顺序。其余常见 Provider 类型：BingMaps、WMS 标准的 WebMapService、TMS、UrlTemplate 通用模板、ArcGIS Map Server、还有开源的 OpenStreetMap。
-->

---

# 地形 Terrain

```javascript
// 现行推荐写法（v1.143 Quickstart 展示的用法）
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain({
    requestVertexNormals: true, // 请求法线数据，用于地形光照
    requestWaterMask: true,     // 请求水体掩膜，用于水面特效
  }),
});

// 地形夸张：已从 Globe 迁移到 Scene（1.143 现行 API）
scene.verticalExaggeration = 2.0;               // 地形整体夸张 2 倍
scene.verticalExaggerationRelativeHeight = 0.0; // 夸张的参照高度基准
```

<div v-click class="mt-2 text-sm">

> ⚠️ 旧写法 `createWorldTerrainAsync()` / `globe.terrainExaggeration` 已迁移，新代码以上述为准。四类 `TerrainProvider`：Cesium(quantized-mesh) / Ellipsoid(默认无起伏) / GoogleEarthEnterprise / VRTheWorld。

</div>

<!--
地形现行推荐写法是 Cesium.Terrain.fromWorldTerrain，可选 requestVertexNormals 请求法线数据用于地形光照、requestWaterMask 请求水体掩膜用于水面特效。网络上不少旧教程用的是 createWorldTerrainAsync，当前官方 Quickstart 展示的现行写法已经迁移到 Terrain.fromWorldTerrain，两者能力等价但 API 不同，写新代码要以后者为准。

地形夸张也就是垂直夸张，官方 Globe 参考文档已经不包含 terrainExaggeration 这个属性了，当前版本这个能力搬到了 Scene 上：scene.verticalExaggeration 控制整体夸张倍数，verticalExaggerationRelativeHeight 控制夸张的参照高度基准，0 表示相对椭球面。这是一处版本漂移，查旧博客要留意。

四类 TerrainProvider：CesiumTerrainProvider 是为流式传输优化的 quantized-mesh 格式，World Terrain 就是这个格式；EllipsoidTerrainProvider 是无起伏的纯椭球体，是默认值；另外两个对接 GoogleEarthEnterprise 和第三方 VRTheWorld 地形服务。
-->

---

# 3D Tiles：加载与 LOD（重点）

```javascript
// 从 Cesium Ion 资产加载（异步工厂方法，返回 Promise，注意要 await）
const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(assetId);
viewer.scene.primitives.add(tileset);

// 从任意 URL 加载自建 3D Tiles
const tileset2 = await Cesium.Cesium3DTileset.fromUrl("https://example.com/tileset.json");
```

<v-clicks>

- **`maximumScreenSpaceError`**（默认 16）：LOD 细化阈值，越小越清晰越耗性能——性能调优第一旋钮
- `skipLevelOfDetail` / `baseScreenSpaceError`：跳级加载优化，减少请求数
- `cacheBytes`（默认 512MB）：GPU 显存缓存上限
- 事件：`tileLoad` / `allTilesLoaded` / `tileFailed`

</v-clicks>

<!--
Cesium3DTileset 是海量倾斜摄影、BIM、点云的流式加载容器，核心是屏幕空间误差 SSE 驱动的 LOD 机制。加载方式：fromIonAssetId 从 Cesium Ion 资产加载，fromUrl 从任意 URL 加载自建 3D Tiles，两者都是异步工厂方法返回 Promise，一定要 await，直接当同步对象用会拿到 pending 状态。

LOD 关键参数：maximumScreenSpaceError 默认 16，tile 的屏幕空间误差超过这个值就继续细化加载子节点，数值越小细节越高但越耗性能，是 3D Tiles 性能调优的第一旋钮；skipLevelOfDetail 配合 baseScreenSpaceError 允许跳过中间 LOD 层级直接读细节瓦片，减少请求数；cacheBytes 默认 512MB，是 GPU 显存缓存上限。

四个关键事件：tileLoad 单 tile 加载完成，allTilesLoaded 当前视图所需全部加载完，initialTilesLoaded，tileFailed 加载失败，常用来做自定义加载进度 UI。
-->

---

# 3D Tiles：Style 样式语言（重点）

```javascript
tileset.style = new Cesium.Cesium3DTileStyle({
  // show：条件表达式控制显隐（按属性筛选布尔值）
  show: "${feature['building']} === 'residential'",
  // color：conditions 数组按顺序 if-else 匹配，true 兜底
  color: {
    conditions: [
      ["${Classification} === 2", "color('brown')"],
      ["true", "color('white')"],
    ],
  },
});
```

<div v-click class="mt-2 text-sm">

> ⚠️ `conditions` 是懒惰匹配的 if-else 链，从上到下，`true` 必须放最后兜底，顺序写反会导致样式全部命中第一条。`defines` 可预计算派生变量（如到某点距离）供表达式复用。

</div>

<!--
Cesium3DTileStyle 是声明式样式语言，必考。show 字段是条件表达式，控制某个 feature 是否显示，比如按 building 属性筛选只显示住宅；color 字段的 conditions 是个数组，按顺序像 if-else 一样匹配，第一个满足的条件生效，true 作为兜底放在最后。

表达式语法支持 ${property} 取属性、比较运算符、逻辑运算符 || 和 &&，可以用来按属性高亮、隐藏指定建筑，比如隐藏某栋 OSM 建筑腾出位置放新方案模型。

易错点：conditions 数组是懒惰匹配的 if-else 链，顺序写反——比如把 true 放前面——会导致样式全部命中第一条，看起来像"样式不生效"，其实是顺序错了。还有个进阶用法 defines，可以预计算派生变量，比如到某个点的距离，供 color 或 show 表达式复用，做类似距离热力图的效果。
-->

---

# 时间与时钟：JulianDate + Clock（重点）

```javascript
// JulianDate：天文儒略日，内部"整数天+秒"存储，采用国际原子时(TAI)
const start = Cesium.JulianDate.fromIso8601("2020-03-09T23:10:00Z");
const stop = Cesium.JulianDate.addSeconds(start, 3600, new Cesium.JulianDate());

viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.multiplier = 50;       // 50 倍速播放，支持负数倒放
viewer.clock.shouldAnimate = true;  // 默认 false，需手动开启
```

<div v-click class="mt-2 text-sm">

> `ClockRange`：`UNBOUNDED`（默认无限制）/ `CLAMPED`（到边界即停）/ `LOOP_STOP`（到终点循环回起点）。

</div>

<!--
时间动态可视化是 Cesium 区别于其它三维引擎最核心的能力，Entity 的几乎每个属性都可以不是固定值，而是时间到值的 Property，这一组是必考重点。

JulianDate 是天文儒略日标准，内部用整数天加秒数两个分量存储，为了保证精度并正确处理闰秒，采用国际原子时 TAI。fromIso8601 从 ISO 字符串构造，addSeconds 做时间运算。

Clock 驱动场景时间流：startTime、stopTime、currentTime 定义时间范围和当前时刻，multiplier 是播放倍速，支持负数做倒放，shouldAnimate 默认是 false，必须手动设成 true 才会真正推进。ClockRange 枚举控制到达边界后的行为：UNBOUNDED 默认无限制，CLAMPED 到边界即停，LOOP_STOP 循环回起点，常用于航班轨迹这类有限时长的回放场景。
-->

---

# 时间动态属性：SampledPositionProperty（重点）

```javascript
const positionProperty = new Cesium.SampledPositionProperty();
flightData.forEach((point, i) => {
  const t = Cesium.JulianDate.addSeconds(start, i * 30, new Cesium.JulianDate());
  positionProperty.addSample(t, Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.height));
});

const airplane = viewer.entities.add({
  availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start, stop })]),
  position: positionProperty, // 引擎在采样点之间自动插值
  orientation: new Cesium.VelocityOrientationProperty(positionProperty), // 按速度矢量算朝向
});
```

<div v-click class="mt-2 text-sm">

> `SampledPositionProperty`（预知序列，自动插值）与 `CallbackProperty`（每帧实时回调，真正动态/未知轨迹）互补；忘记设置 `availability` 是易错点——实体会一直不出现或一直显示。

</div>

<!--
SampledPositionProperty 是时间采样属性，实现平滑运动轨迹的核心工具。往里面用 addSample 加一系列时间点对应的位置采样，引擎会在采样点之间自动插值，不需要自己写插值逻辑。

配合 entity 使用：availability 用 TimeIntervalCollection 定义这个实体存在的时间段，position 直接赋值成这个 SampledPositionProperty 对象（注意是赋 Property 对象，不是赋一个固定 Cartesian3，这是完全不同的语义），orientation 可以用 VelocityOrientationProperty 按速度矢量自动计算朝向，不用手算飞机或车辆的姿态角。

两种动态属性是互补关系：SampledPositionProperty 适合预知的时间序列采样点场景；CallbackProperty 是每帧实时回调计算值，适合真正的动态、未知轨迹。易错点：忘记设置 availability，会导致实体在时间轴走到某个时刻后消失，或者从不出现，很容易被误判成"数据没加载出来"的 bug，其实是时间区间没配对。
-->

---

# CZML：时空数据交换格式

CZML 是"用 JSON 描述随时间变化的图形化场景"的格式——Entity API 的**数据端序列化**：

```json
[
  { "id": "document", "version": "1.0" },
  {
    "id": "GroundControlStation",
    "position": { "cartographicDegrees": [-75.5, 40.0, 0.0] },
    "point": { "color": { "rgba": [0, 0, 255, 255] } }
  }
]
```

<v-clicks>

- packet 图形类型与 Entity 一一对应：billboard / point / polyline / path / model / polygon 等
- 每个属性天然支持"时间→值"的动态取值
- 典型应用：多颗卫星轨道动画、大规模轨迹回放——服务端吐数据，前端零自定义代码

</v-clicks>

<!--
CZML 本质上是 Entity API 的数据端序列化，关系类似于 Google Earth 和 KML。一个 CZML 文档是一个 JSON 数组，每个数组元素是一个 packet，第一个 packet 惯例上是文档级元信息，id 是 document。

packet 支持的图形类型跟 Entity 的类型一一对应：billboard、point、polyline、path、model、box、polygon 等等，而且每个属性天然支持时间动态取值，不需要额外包装。

加载方式很简单：CzmlDataSource.load 传入 url 或者 IonResource，挂到 viewer.dataSources 上。典型应用是多颗卫星轨道动画、大规模轨迹回放——服务端只需要吐 CZML 静态或流式数据，前端零自定义代码就能呈现，这是 Cesium 时间动态生态里非常关键的一块拼图。
-->

---

# 性能优化：requestRenderMode

```javascript
const viewer = new Cesium.Viewer("cesiumContainer", {
  requestRenderMode: true,          // 只在场景变化时才渲染，而非默认每帧重绘
  maximumRenderTimeChange: Infinity, // 控制模拟时间推进允许强制刷新的间隔
});

// 手动触发一帧渲染（自己改了不会被自动感知的状态后）
viewer.scene.requestRender();
```

<v-clicks>

- ⚠️ 开启后忘记 `requestRender()` → 画面"卡住不动"，新手最易踩的坑
- 3D Tiles 调优：加大 `maximumScreenSpaceError`、开启 `skipLevelOfDetail`
- Primitive 合批：海量静态数据从 Entity 迁移到合批 Primitive
- `clampToHeightMostDetailed`：批量贴地查询用异步版，避免卡主线程

</v-clicks>

<!--
性能优化第一项：默认 Cesium 每帧都重绘，60fps 持续消耗 GPU，静态展示场景应该开启 requestRenderMode，只在场景发生变化时才渲染；配合 maximumRenderTimeChange 控制多久允许因模拟时间推进而强制刷新一帧。自己改了某个不会被自动感知的状态后，要手动调 scene.requestRender 触发一帧。

坑在这：开启 requestRenderMode 后如果忘记在数据变化时调用 requestRender，画面会卡住不动，是新手接入这项优化最容易踩的坑，容易被误判成 bug 而不是优化的副作用。

其他优化手段回顾：3D Tiles 侧加大 maximumScreenSpaceError、开 skipLevelOfDetail；海量静态数据从 Entity 迁移到合批 Primitive 是标准优化路径；批量贴地查询要用 clampToHeightMostDetailed 异步版本，避免同步版本卡住主线程。
-->

---

# Cesium Ion 与生态

<v-clicks>

- **Cesium Ion**：官方云平台——3D Tiles 瓦片化、地形/影像处理、资产托管（倾斜摄影建模、BIM/CAD 转换、点云、3D 高斯溅射）
- 免费额度可入门，商业规模使用需付费套餐；也可完全不依赖 Ion，自建瓦片服务
- **Resium**：社区维护的 React 封装，声明式组件写法，自带 TypeScript 类型
- **与 deck.gl 集成**：`@deck.gl/geo-layers` 的 `Tile3DLayer`，可在非 Cesium 宿主（Mapbox/MapLibre）渲染 3D Tiles/I3S

</v-clicks>

<!--
Cesium Ion 是官方云平台，提供 3D Tiles 瓦片化、地形处理、影像处理、资产托管，包括倾斜摄影建模结果、BIM/CAD 转换、点云、以及比较新的 3D 高斯溅射格式。免费额度可以入门，商业规模使用需要付费套餐；也完全可以不依赖 Ion，自建瓦片服务加自己的 TerrainProvider、ImageryProvider 实现。

Resium 是社区维护的 React 封装，把 Viewer、Entity 这些包装成声明式 React 组件，自带 TypeScript 类型，方便在 React 技术栈里做状态驱动的 Cesium 应用，避免手写命令式代码跟 React 生命周期打架。

跟 deck.gl 的集成：deck.gl 的 geo-layers 包提供 Tile3DLayer，可以在非 Cesium 的宿主环境，比如挂载在 Mapbox 或 MapLibre 底图上，渲染 3D Tiles 或 I3S 格式数据，是"只要 3D Tiles 数据格式、不要整个 Cesium 引擎"场景的替代路径。
-->

---

# 易错点清单

<v-clicks>

- **`CESIUM_BASE_URL`** 必须在 import cesium **之前**设置，四个资源目录少复制一个才在运行时报错
- **`fromDegrees(longitude, latitude, height)`** 经度在前——抄错坐标定位到大洋中央的头号原因
- **Entity vs Primitive 选型不当**：数千+静态对象用 Entity 会帧率骤降，应转 Primitive 合批
- **忘记 `await`** 异步工厂方法：`fromIonAssetId` / `Terrain.fromWorldTerrain` / `createGooglePhotorealistic3DTileset`
- **时间动态实体忘记 `availability`**：容易被误判成"数据没加载出来"的 bug
- **开启 `requestRenderMode` 后忘记 `requestRender()`**：画面卡住不刷新

</v-clicks>

<!--
易错点清单，快速过一遍今天讲过的高频坑。CESIUM_BASE_URL 必须在 import cesium 之前设置，四个资源目录少复制一个，编译期不会提示，只会在运行时才报错。fromDegrees 参数顺序是经度在前，跟中文口语习惯相反，是抄错坐标定位到大洋中央或对跖点的头号原因。

Entity vs Primitive 选型不当：把数千甚至上万个静态对象都用 Entity 实现，会导致场景帧率骤降，应该转成合批的 Primitive。忘记 await 异步工厂方法：fromIonAssetId、Terrain.fromWorldTerrain、createGooglePhotorealistic3DTileset 这些都返回 Promise，直接当同步对象用会拿到 pending 状态。

时间动态实体忘记设置 availability，会导致实体在某个时刻消失或从不出现，容易被误判成数据没加载出来。开启 requestRenderMode 后忘记手动调 requestRender，画面会卡住不刷新，也是新手接入性能优化最容易踩的坑。
-->

---
layout: intro
---

# 选型对比与总结

| 维度 | Cesium | Three.js | Mapbox/MapLibre |
|---|---|---|---|
| 定位 | 数字地球（全球地理三维） | 通用 3D 渲染引擎 | 2.5D 矢量地图引擎 |
| 坐标 | WGS84 椭球，全球无缝 | 无内置地理坐标 | Web Mercator 投影 |
| 时间动态 | Entity + CZML + Clock，业界独有 | 需自行实现动画系统 | 较弱，非设计重点 |

<div v-click class="mt-4 text-sm">

> 需要真实地球几何（避免 Mercator 极地形变）、真实地形/3D Tiles 海量加载、时间动态仿真（卫星轨迹/航班回放）——这些是 Cesium 不可替代的场景；非地理通用 3D 选 Three.js，常规 Web 地图选 Mapbox/MapLibre。

</div>

<!--
总结一下选型对比。定位上，Cesium 是数字地球，全球地理空间三维引擎；Three.js 是通用 3D 渲染引擎，不限定场景；Mapbox/MapLibre 是 2.5D 矢量地图引擎。坐标系统上，Cesium 是 WGS84 椭球加真实地心地固坐标，全球无缝；Three.js 没有内置地理坐标，需要自己实现或用插件；Mapbox 类是 Web Mercator 投影，globe 模式是视觉投影而非真实球体几何，极地严重形变。时间动态可视化上，Cesium 的 Entity 属性系统加 CZML 加 Clock 是业界独有的能力，另外两类都需要自行编写动画系统或非设计重点。

一句话选型：需要真实地球几何避免墨卡托投影在极地的形变、需要真实地形高程与倾斜摄影/BIM 精细模型展示、需要 3D Tiles 海量流式加载、需要时间动态仿真比如卫星轨迹或航班追踪历史回放——这些是 Cesium 不可替代的场景，选它没有疑问。非地理场景的通用 3D，产品展示、游戏，选 Three.js 更轻量灵活。常规 Web 地图应用，路线规划、POI 检索，选 Mapbox 或 MapLibre 更轻量、生态成熟。谢谢大家。
-->
