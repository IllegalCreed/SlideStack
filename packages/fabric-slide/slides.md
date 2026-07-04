---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Fabric.js
info: |
  Presentation Fabric.js —— Canvas 之上的交互式对象模型库。

  Learn more at [http://fabricjs.com](http://fabricjs.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎨</span>
</div>

<br/>

## Fabric.js —— Canvas 上的交互对象模型库

把裸 Canvas 变成可选中拖拽缩放旋转的对象树，2026 年当前版本 v7.4.0

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/fabricjs/fabric.js" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Fabric.js——一个构建在 HTML5 Canvas 之上的交互式对象模型库。

一句话：它把裸 Canvas 变成一棵可选中、可拖拽、可缩放旋转、可序列化的对象树，本质是给 Canvas 补上一层类似浏览器 DOM 的对象模型加事件系统，是浏览器端做图形编辑器、白板、海报设计工具、签名板的老牌事实标准之一。

版本背景要先澄清：很多人以为 v6 是当前最新版，其实 npm 实测最新是 7.4.0，发布于 2026 年 5 月 18 日。Fabric 已经在 2025 年 12 月 22 日发布了 v7.0.0，v6 系列停在 6.9.1。好消息是 v6 那次 ESM 加 TypeScript 重写是地基级变化，v7 只是装修级调整，语法基本不变，所以 v6 的知识点在 v7 下依然完全有效。

今天的顺序：定位评价、安装引入、Canvas 体系、对象模型、内置形状、坐标变换、文本、图片滤镜、群组多选、控件锁定、事件系统、自由绘制、序列化、自定义属性、性能缓存、版本演进、易错点、选型对比、总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 Fabric.js？

<v-clicks>

- 给 Canvas 补一层类似浏览器 DOM 的**对象模型 + 事件系统**
- 对象可选中、拖拽、缩放旋转、序列化——不再是"画完就忘"的像素
- 图形编辑器 / 白板 / 海报设计工具 / 签名板的老牌事实标准

</v-clicks>

<div v-click class="mt-8 text-sm">

**优点**：API 覆盖面极广、十余年生态案例多、v6 起 TS 原生重写 DX 大增

</div>

<div v-click class="mt-4 text-sm">

**缺点**：中等对象数量场景（非海量/粒子）、无官方 React/Vue 绑定、`toSVG()` 历史上有安全 CVE

</div>

<!--
为什么用 Fabric.js？

它的核心价值是给 Canvas 补上一层类似浏览器 DOM 的对象模型加事件系统。裸 Canvas 只是一块像素画布，画完就是死的位图；Fabric 把每个图形变成一个可选中、可拖拽、可缩放旋转、可序列化的对象，这一层对象树是它区别于原生 Canvas API 最本质的地方。

这也是为什么它是浏览器端做图形编辑器、白板、海报设计工具、签名板的老牌事实标准——十余年历史，生态案例非常多。

优点：API 覆盖面极广，对象模型、事件、动画、滤镜、SVG 双向转换、序列化都是一等公民；v6 起原生 TypeScript 重写后开发体验显著提升；Node 端配合 node-canvas 可以做无头渲染、服务端出图。

缺点：性能定位是中等数量、属性丰富的对象，不是海量对象或粒子场景，那是 PixiJS 的地盘；没有官方 React/Vue 绑定，集成需要自己手写生命周期同步；历史上出现过 SVG 导出相关的 XSS、CSS 注入安全问题，近两个大版本各修复了一次。
-->

---

# 安装与引入（ESM 命名导出）

`npm i --save fabric` 之后，引入方式是 v6 起最大的语法断层：

```javascript
// 浏览器 / 打包器环境：具名导出，取代 v5 的 fabric.xxx 命名空间写法
import { Canvas, Rect, Circle } from 'fabric'

// Node.js 环境：走 fabric/node 子路径，依赖 node-canvas 无头渲染
import { Canvas, Rect } from 'fabric/node'

// 精简子集，官方标注"谨慎使用"（安全边界未必覆盖 loadFromJSON/SVG）
import { StaticCanvas, Rect } from 'fabric/es'
```

<div v-click>

> ⚠️ v5 语法 `fabric.Canvas` 命名空间写法 v6 起彻底失效；`fabric.Object`/`fabric.Text`/`fabric.Image` 改名为 `FabricObject`/`FabricText`/`FabricImage`（其余类名不变）

</div>

<div v-click class="mt-2 text-sm">

CDN 生产环境需锁定具体版本号（如 `@7.4.0`）而非 `@latest`，并自行生成 `integrity` 校验防篡改。

</div>

<!--
安装与引入，这是 v6 起最大的语法断层，务必讲清楚。

npm 安装就是普通的 npm i fabric。但引入方式发生了根本变化：v5 时代 fabric 是一个全局命名空间对象，写 fabric.Canvas、fabric.Object；v6 起改成了具名导出，浏览器和打包器环境写 import { Canvas, Rect } from 'fabric'。Node 环境要走 fabric/node 子路径，底层依赖 node-canvas 做无头渲染。还有一个 fabric/es 精简子集，官方特别标注要谨慎使用，因为它未必覆盖 loadFromJSON、SVG 加载这些地方的安全处理。

最大的坑：网上大量老教程、Stack Overflow 代码还是 v5 的 fabric.Canvas 命名空间写法，v6 起彻底失效，必须改成具名导出。同时有三个类名做了特殊改名，为了避开 JS 保留字和全局对象命名冲突：fabric.Object 变成 FabricObject，fabric.Text 变成 FabricText，fabric.Image 变成 FabricImage，其余类名比如 Canvas、Rect、Circle、Group 基本不变，只是从命名空间属性变成了具名导出。批量替换脚本最容易漏掉这三个特殊改名。

CDN 引入的话，生产环境务必把 @latest 换成锁定的具体版本号，并自己生成 integrity 校验值，防止 CDN 被劫持后静默篡改脚本内容。
-->

---

# Canvas vs StaticCanvas

```javascript
import { Canvas, StaticCanvas } from 'fabric'

// 交互式画布：支持选中/拖拽/缩放/旋转/事件
const canvas = new Canvas('canvas-el-id', {
  width: 800, height: 600, backgroundColor: '#f0f0f0',
})

// 纯渲染画布：无交互，用于展示/缩略图/服务端出图
const staticCanvas = new StaticCanvas('canvas-el-id')
```

<v-clicks>

- 继承链（官方实测）：`Canvas extends SelectableCanvas extends StaticCanvas`
- `StaticCanvas` 只管渲染栈；`SelectableCanvas` 叠加选中/多选；`Canvas` 再叠加鼠标事件与绘图模式
- `renderAll()` 立即同步渲染；`requestRenderAll()` 合并到下一帧，日常业务优先用后者

</v-clicks>

<!--
Canvas 和 StaticCanvas 的区别。

交互式画布 Canvas 支持选中、拖拽、缩放、旋转、完整事件系统；纯渲染画布 StaticCanvas 没有交互，适合展示、缩略图、服务端出图这类只读场景。

容易被小看的实现细节：官方 API 文档实测的继承链是三层，不是简单的两层——Canvas extends SelectableCanvas extends StaticCanvas。StaticCanvas 只负责渲染栈管理；SelectableCanvas 叠加选中和多选能力；Canvas 再叠加鼠标事件、绘图模式等完整交互。

渲染方法有两个：renderAll 立即同步渲染整棵对象树；requestRenderAll 用 requestAnimationFrame 把多次修改合并到下一帧渲染。日常业务优先用 requestRenderAll，避免频繁同步渲染掉帧。

还有几个关键属性要知道：isDrawingMode 自由绘制开关、freeDrawingBrush 当前画笔实例、selection 是否允许框选、viewportTransform 缩放平移矩阵、enableRetinaScaling 高分屏适配，后面几页会陆续用到。
-->

---

# 对象模型：FabricObject 基类

```javascript
import { Canvas, Rect } from 'fabric'

const rect = new Rect({
  left: 100, top: 100, width: 120, height: 80,
  fill: 'rgba(255,0,0,0.6)', stroke: '#333', strokeWidth: 2,
  angle: 15,                          // 旋转角度（度）
  originX: 'left', originY: 'top',    // 变换原点（v7 默认改 'center'）
})

canvas.add(rect)   // 一次可传多个对象；canvas.remove(rect) 移除
```

<v-clicks>

- 所有可视对象（`Rect`/`Circle`/`Path`/`FabricText`……）都继承自 `FabricObject`（v6 前称 `fabric.Object`）
- 常用方法：`set(props)`/`get(key)`、`scale(v)`、`rotate(angle)`、`clone()`、`scaleToWidth/Height(px)`
- `setCoords()` 刷新包围盒/控制点；`calcTransformMatrix()` 计算含父级的完整变换矩阵

</v-clicks>

<!--
对象模型是 Fabric 的核心。所有可视对象都继承自 FabricObject，v6 前叫 fabric.Object。

看这个 Rect 示例：left/top 定位，width/height 是原始尺寸，fill/stroke/strokeWidth 控制填充描边，angle 是旋转角度，originX/originY 是变换原点，决定对象以哪一点作为定位和旋转基准，v6 默认是 left/top，v7 默认改成了 center，这是后面版本迁移要重点讲的坑。canvas.add 可以一次传多个对象，remove 移除。

常用方法：set/get 读写属性，scale 等比缩放，rotate 旋转，clone 克隆；scaleToWidth/Height 按目标像素反推缩放比很实用，不用自己算比例。setCoords 用来刷新包围盒和控制点坐标，手动改了 left/top/scaleX 这些属性后如果没有触发内部同步，视觉和包围盒可能不一致，就需要它。calcTransformMatrix 计算包含父级 Group 或 clipPath 平面的完整变换矩阵，calcOwnTransform 则只算自身、不含父级，下一页坐标系会展开讲这两者的区别。
-->

---

# 内置形状清单

| 形状 | 说明 |
|---|---|
| `Rect` / `Circle` / `Ellipse` | 基础矩形 / 圆 / 椭圆 |
| `Triangle` / `Line` | 三角形 / 直线 |
| `Polygon` / `Polyline` | 多边形（闭合 / 不闭合） |
| `Path` | 接收 SVG path 字符串或坐标数组 |

```javascript
import { Path, Circle } from 'fabric'

const path = new Path('M 0 0 L 200 100 L 170 200 z', { fill: 'green' })
const circle = new Circle({ left: 260, top: 100, radius: 50, fill: 'blue' })
```

<div v-click class="mt-2 text-sm">

所有形状构造参数都共享 `FabricObject` 通用属性，差异只在形状特有参数（如 `radius`）。

</div>

<!--
内置形状清单。Fabric 提供了一套基础几何形状：Rect 矩形、Circle 圆、Ellipse 椭圆、Triangle 三角形、Line 直线、Polygon 闭合多边形、Polyline 不闭合折线，还有最灵活的 Path，接收标准 SVG path 字符串或坐标数组，能画任意复杂路径。

代码示例：Path 直接传一段 SVG path 语法画一个三角形；Circle 传 left/top/radius/fill 画一个圆。

关键点是所有这些形状的构造参数都共享 FabricObject 的通用属性，比如 left、fill、stroke 这些定位和外观属性都是一致的，差异只在形状特有的参数上，比如 Circle 独有 radius，Rect 独有 width/height。这个一致性是 Fabric API 好学的原因之一，学会一个形状的属性系统，其他形状举一反三。
-->

---

# 坐标系与变换矩阵

Fabric 内部用标准 2D 变换矩阵 `[a, b, c, d, e, f]` 描述每个对象，`angle`/`scaleX`/`scaleY` 是从矩阵分解出的"人类可读"表现值：

```javascript
obj.calcOwnTransform()      // 只计算对象自身矩阵，不含父级
obj.calcTransformMatrix()   // 计算包含父 Group/clipPath 的完整矩阵
obj.setCenterPoint(point)          // 按画布坐标系设置中心
obj.setRelativeCenterPoint(point)  // 按所在父平面坐标系设置中心

canvas.zoomToPoint(new Point(x, y), zoomLevel) // 画布整体缩放
```

<div v-click>

> ⚠️ 对象若处于 `Group`/`clipPath` 等父平面中，`left`/`top` 是相对父平面而非画布坐标——嵌套结构下最容易读错坐标的地方。

</div>

<!--
坐标系与变换矩阵。

Fabric 内部用标准的 2D 变换矩阵 a b c d e f 描述每一个对象：a b 和 c d 是变换后的两个基向量，e f 是对象中心相对父平面原点的偏移。我们平时用的 angle、scaleX、scaleY、skewX、skewY 都是从这个矩阵反解出来的人类可读的表现值。

两个计算方法的区别：calcOwnTransform 只算对象自身矩阵，不含父级或画布的变换；calcTransformMatrix 计算包含父 Group 或 clipPath 平面的完整矩阵。setCenterPoint 和 setRelativeCenterPoint 分别按画布坐标系和父平面坐标系设置对象中心。

viewport 变换是画布整体的缩放平移，和单个对象的变换是分层的，canvas.zoomToPoint 传入一个 Point 和缩放级别，围绕该点整体缩放；canvas.viewportTransform 能读到当前视口矩阵。

最容易读错坐标的地方：对象一旦处于 Group 或 clipPath 这类父平面中，它的 left/top 就变成相对父平面的坐标，而不是相对画布的绝对坐标了，这是嵌套结构调试时最容易踩的坑，下下页讲 Group 时还会再提一次。
-->

---

# 文本三兄弟：Text / IText / Textbox

```javascript
import { FabricText, IText, Textbox } from 'fabric'

const label = new FabricText('只读标题', { fontSize: 24, fontFamily: 'Arial' })

const editable = new IText('点击我可编辑', { fontSize: 18 })
editable.enterEditing()   // 进入编辑态（也可由用户双击触发）

const wrapped = new Textbox('这是一段会自动换行的正文……', {
  width: 200,       // 唯一可由用户拖拽改变的维度
})
```

<div v-click class="mt-2 text-sm">

`FabricText`（静态渲染）→ `IText` 叠加可编辑（`selectionStart`/字符级 `styles`）→ `Textbox` 继承 `IText` 再叠加自动换行（高度随内容自增，只有宽度可手动缩放）

</div>

<!--
文本三兄弟：Text、IText、Textbox。

FabricText 是最基础的静态渲染文本，v6 之前叫 fabric.Text，只读展示用，比如标题。

IText 在 FabricText 基础上叠加了可编辑能力：editable、isEditing 状态、selectionStart/selectionEnd 选区、styles 支持字符级别的样式（比如同一段文字里某几个字加粗变色）、enterEditing 和 exitEditing 进出编辑态，也可以由用户双击触发，还有 selectAll、selectWord 这些辅助方法。

Textbox 继承 IText，再叠加自动换行能力：改 width 会触发重排，Y 方向的缩放被锁死，高度随内容自动变化，只有宽度这一个维度可以被用户手动拖拽缩放，这是它和普通 IText 最大的区别。
-->

---

# 图片与滤镜

```javascript
import { FabricImage } from 'fabric'
import { Grayscale, Brightness } from 'fabric/filters'

// v6 起 fromURL 是异步 Promise（v5 回调）；跨域图片须设 crossOrigin
const img = await FabricImage.fromURL('/assets/photo.jpg', { crossOrigin: 'anonymous' })
canvas.add(img)

img.filters.push(new Grayscale(), new Brightness({ brightness: 0.1 }))
img.applyFilters()
canvas.renderAll()
```

<v-clicks>

- 不设 `crossOrigin: 'anonymous'`，后续 `toDataURL()`/滤镜会因画布"被污染"抛异常
- 滤镜以 **WebGL** 为主渲染后端（v7 起 `Blur` 的 Canvas2D 兜底已移除）；内置含 Grayscale/Brightness/Blur/Contrast 等

</v-clicks>

<!--
图片与滤镜。

FabricImage.fromURL 是异步 Promise API，v6 起才这样，v5 是回调式。跨域图片必须设置 crossOrigin 为 anonymous，否则后续调用 toDataURL 或应用滤镜时会因为画布被污染而抛安全异常。加载完 canvas.add 加进画布。

应用滤镜的固定流程：先把滤镜实例 push 进对象的 filters 数组，这里演示了 Grayscale 灰度和 Brightness 亮度调整一次性 push 两个，然后显式调用 applyFilters 让它真正生效，最后 renderAll 渲染出来。注意 push 只是把滤镜放进队列，applyFilters 才会真正执行处理。

滤镜以 WebGL 为主渲染后端，性能更好；部分滤镜历史上有 Canvas2D 兜底实现，比如 Blur，但 v7 起 Blur 的 drawImage 兜底实现已经被移除，统一走 WebGL 了。内置滤镜覆盖灰度、亮度、模糊、对比度、饱和度、鲜艳度、反色、像素化、颜色矩阵等常见需求。
-->

---

# 群组与多选：Group / ActiveSelection

```javascript
import { Group, ActiveSelection } from 'fabric'

// Group：通用容器对象，把多个对象打包成一个可整体操作的复合对象
const group = new Group([rect, circle], { left: 50, top: 50 })
canvas.add(group)

group.forEachObject(obj => console.log(obj.type))
group.removeAll()   // 清空成员
```

<v-clicks>

- `ActiveSelection extends Group`：专用于框选/shift 多选产生的**临时选中态**，由 Canvas 内部管理
- `multiSelectionStacking`：`'canvas-stacking'`（遵循画布堆叠顺序）或 `'selection-order'`（按选择先后）
- 嵌套：Group 内可再放 Group，子对象 `parent` 指向父级，`layoutManager` 控制布局策略

</v-clicks>

<!--
群组与多选。

Group 是通用容器对象，把多个对象打包成一个可以整体移动、缩放、旋转的复合对象。forEachObject 遍历成员，removeAll 清空。

ActiveSelection 继承自 Group，专门用于 canvas 框选或者 shift 多选产生的临时选中态，业务代码一般不需要手动 new 它，Fabric 会在用户框选或 shift 点选时自动创建，需要自定义多选行为时才继承覆写。它由 Canvas 内部管理，使用专门的 ActiveSelectionLayoutManager 保证多选操作不破坏各对象原有布局。它的 multiSelectionStacking 属性控制多选对象的层级排序策略，canvas-stacking 遵循画布本身的堆叠顺序，selection-order 按用户选择的先后顺序。

嵌套方面，Group 内可以再放 Group，子对象的 parent 属性指向父级，layoutManager 控制布局策略，比如自动包围盒或者固定尺寸。也提醒一下，上一页讲过 Group 内对象的 left/top 是相对父级坐标，这里再强调一次，是最容易踩的坐标坑。
-->

---

# 控件与锁定

```javascript
rect.set({
  cornerSize: 10, touchCornerSize: 24, transparentCorners: false, // 控制点外观
  cornerColor: '#2b6cb0', borderColor: '#2b6cb0',
  lockMovementX: true, lockRotation: true, lockScalingFlip: true, // 锁定类
  selectable: false,   // 完全禁止被选中
  evented: false,      // 完全不响应鼠标事件（连 hover 都不触发）
  hasControls: false,  // 隐藏控制点，但仍可移动（若 selectable 为 true）
})
```

<div v-click class="mt-4 text-sm">

自定义控件三级手段：**单实例传参** → **类默认值**（构造函数改默认属性）→ **全局共享**（改类的静态 `createControls`）。每个实例的 `controls` 对象构造时独立创建，避免多实例互相污染。

</div>

<!--
控件与锁定。

控制点相关属性：cornerSize 控制点像素大小默认 13，touchCornerSize 触屏下热区更大默认 24，transparentCorners、cornerColor、borderColor 控制外观。

锁定类属性：lockMovementX、lockRotation、lockScalingFlip 这些禁止对应交互，但对象仍然可见、可能仍可选中。

三个完全不同的开关容易混淆：selectable 是完全禁止被选中；evented 是完全不响应鼠标事件，连 hover 都不触发；hasControls 只是隐藏控制点，但如果 selectable 还是 true，对象依然可以被移动，这三者是正交的，不要以为设一个就等于设了全部。

自定义控件有三级手段：单实例传参最简单；类默认值是在构造函数里改默认属性，影响这个类新建的所有实例；全局共享是改类的静态 createControls 方法，影响该类所有实例。官方特别强调每个实例的 controls 对象是构造时独立创建的，避免多个实例共享同一份控件配置导致互相污染。
-->

---

# 事件系统

```javascript
// 对象级事件
const off = circle.on('mousedown', (opt) => {
  console.log(opt.scenePoint)     // 画布坐标系下的事件点（v7 命名）
  console.log(opt.viewportPoint)  // 视口坐标系下的事件点
})

// 画布级事件
canvas.on('mouse:down', (opt) => { /* opt.target 为命中对象，可能为 null */ })
canvas.on('object:modified', (opt) => { /* 完成一次变换操作后触发 */ })
canvas.on('selection:created', (opt) => console.log(opt.selected))
```

<div v-click>

> ⚠️ 官方文档明确声明"没有人工维护的完整事件清单"，务必通过 `/demos/events-inspector/` 或 TS 自动补全交叉核实。v7 起事件对象删除 `pointer`/`absolutePointer`，只保留 `viewportPoint`/`scenePoint`。

</div>

<!--
事件系统。分对象级和画布级两类。

对象级事件用 on/off 绑定解绑，也可以直接调用 on 返回的 disposer 函数来解绑。事件对象上有 scenePoint 画布坐标系下的点、viewportPoint 视口坐标系下的点，这是 v7 的命名。

画布级事件常用的有：mouse:down 鼠标按下，opt.target 是命中的对象，可能是 null；object:modified 用户完成一次变换操作后触发，比如拖拽或缩放结束；selection:created 选中创建时触发，能拿到 opt.selected 数组；还有 path:created，自由绘制生成一条新路径后触发，下一页自由绘制会再用到。

一个很重要的提醒：官方文档自己声明没有一份人工维护、带完整参数说明的事件清单，建议通过 demos/events-inspector 这个演示页面在浏览器里实时打印所有触发的事件名，或者依赖 TypeScript 编辑器自动补全来发现 on 支持的事件名全集。这是文档里少数几处官方承认不完整的地方，不要凭记忆默写一份完整事件列表去出题。

v7 变化：事件对象上的 pointer 和 absolutePointer 属性已经删除，只保留 viewportPoint 和 scenePoint，语义不变，纯改名。
-->

---

# 自由绘制

```javascript
import { PencilBrush, CircleBrush, SprayBrush, PatternBrush } from 'fabric'

canvas.isDrawingMode = true
canvas.freeDrawingBrush = new PencilBrush(canvas)
canvas.freeDrawingBrush.width = 30
canvas.freeDrawingBrush.color = '#ff0000'

// 切换笔刷类型
canvas.freeDrawingBrush = new CircleBrush(canvas)
```

<v-clicks>

- 内置笔刷：`PencilBrush`（铅笔线）/ `CircleBrush`（圆点喷绘）/ `SprayBrush`（喷雾）/ `PatternBrush`（图案填充）
- 每画完一笔会在 canvas 触发 `path:created` 事件，生成一个 `Path` 对象

</v-clicks>

<!--
自由绘制。把 canvas.isDrawingMode 设为 true 就进入自由绘制模式，给 canvas.freeDrawingBrush 赋值一个笔刷实例，设置宽度和颜色。切换笔刷类型直接重新赋值 freeDrawingBrush 就行。

内置四种笔刷：PencilBrush 普通铅笔线是最常用的；CircleBrush 圆点喷绘效果；SprayBrush 喷雾效果；PatternBrush 用图案填充笔触，可以做出很特别的画笔效果。

每次用户画完一笔，会在 canvas 上触发 path:created 事件，生成一个 Path 对象，这个事件在上一页事件系统里也提到过，是自由绘制和事件系统的交汇点，业务里常用它来监听用户画完一笔后做自动保存或者历史记录。
-->

---

# 序列化与导出

```javascript
const json = canvas.toObject()       // 同步，纯对象
const jsonWithMeta = canvas.toJSON() // 同步，含版本号等元信息，可直接 JSON.stringify
const svgString = canvas.toSVG()     // 同步，导出 SVG 字符串
const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 2 }) // 同步，导出位图

canvas.loadFromJSON(json).then((canvas) => canvas.requestRenderAll()) // v6 起 Promise
```

<div v-click>

> ⚠️ 历史上 `toSVG()` 出现过两次安全 CVE：CVE-2026-27013（7.2.0 修复的 stored XSS）、CVE-2026-44311（7.4.0 修复的 CSS 注入），均涉及对不可信内容的处理。

</div>

<!--
序列化与导出是 Fabric 的一等公民能力，四个导出方法都是同步的：toObject 导出纯对象；toJSON 在 toObject 基础上加了版本号等元信息，可以直接 JSON.stringify 存起来；toSVG 导出 SVG 字符串，能和其他矢量工具互通；toDataURL 导出位图，可以传 format 和 multiplier 控制格式和倍率导出高清图。

导入用 loadFromJSON，v6 起是 Promise-based 异步 API，v5 是回调式，拿到 canvas 之后记得调 requestRenderAll 触发渲染。

一个安全提醒：toSVG 历史上出现过两次 CVE，7.2.0 修复了一个存储型 XSS，7.4.0 修复了一个 CSS 注入，都是涉及对不可信内容的处理，如果业务场景里 SVG 内容来自用户输入，要留意升级到修复版本之后。下一页讲自定义属性时，会讲导出时另一个容易踩的坑。
-->

---

# 自定义属性持久化

自定义属性要"入库"必须显式登记，否则 `toObject()`/`toJSON()` 会**静默丢弃且不报错**：

```typescript
// 运行时登记：决定序列化时是否带出该字段（TS 项目还需 declare module 'fabric' 做类型合并）
FabricObject.customProperties = ['id', 'name']

// 子类化场景更推荐直接覆写 toObject，而非依赖 customProperties
class PathPlus extends Path {
  toObject(propertiesToInclude = []) {
    return super.toObject([...propertiesToInclude, 'id'])
  }
}
classRegistry.setClass(PathPlus, 'path') // 注册后 loadFromJSON 才能正确还原成 PathPlus
```

<!--
自定义属性持久化，这是序列化里最容易踩的坑，单独拿出来讲。

业务代码里经常会给对象直接赋值一个自定义属性，比如 obj.id = 'xxx'。但如果不做登记，调用 toObject 或 toJSON 导出的时候，这个字段会被静默丢弃，不会报任何错误或警告，排查起来很痛苦。

正确做法：运行时登记，给 FabricObject.customProperties 这个静态数组里加上字段名，这一步才真正决定序列化时会不会带出这两个字段。如果是 TypeScript 项目，还需要额外通过 declare module 'fabric' 给 FabricObject 接口和 SerializedObjectProps 接口做类型合并，但那一步只影响类型检查，不影响运行时序列化，两件事要分清楚。

如果是子类化场景，比如自己扩展了一个 Path 的子类，更推荐直接覆写 toObject 方法，在 super.toObject 的基础上把自定义字段拼进去；同时要用 classRegistry.setClass 注册这个子类，注册之后 loadFromJSON 才能正确把 JSON 还原成这个子类的实例，而不是还原成基类 Path。
-->

---

# 性能与缓存：objectCaching

```javascript
obj.objectCaching = false     // 关闭该对象的离屏缓存（简单形状收益本就很低）
obj.noScaleCache = true       // 缩放时不重建缓存（用旧缓存位图拉伸换性能）
obj.dirty = true              // 手动标记缓存过期，强制下次渲染重建

import { config } from 'fabric'
config.perfLimitSizeTotal = 4096 * 1024  // 缓存位图总像素上限
config.maxCacheSideLimit = 8192          // 单个缓存位图边长上限
```

<v-clicks>

- 开启后对象预渲染到离屏 canvas，交互时 `drawImage` 搬运，复杂 `Path`/长文本/大 `Group` 收益明显
- ⚠️ viewport 整体缩放会让**所有对象缓存同时失效**；导出高质量 PNG 前建议临时关闭缓存
- 改属性优先走 `set()`——Fabric 靠它感知 `cacheProperties` 变化来自动置位 `dirty`

</v-clicks>

<!--
性能与缓存，核心是 objectCaching 机制。

开启之后 Fabric 会把对象预渲染到一个离屏 canvas，交互的时候，比如拖拽、旋转、缩放，直接 drawImage 搬运这张缓存位图，而不是重新走一遍完整的绘制路径，对复杂 Path、长文本、大量子对象的 Group 收益非常明显。但简单形状比如 Rect、Circle 收益很低，可以考虑关掉。

几个相关属性：noScaleCache 设 true 表示缩放的时候不重建缓存，直接用旧缓存位图拉伸，牺牲一点清晰度换性能；dirty 手动标记缓存过期，强制下次渲染重建；config.perfLimitSizeTotal 和 config.maxCacheSideLimit 分别控制缓存位图的总像素上限和单个缓存位图的边长上限，这是全局配置。

两个坑：第一，viewport 整体缩放会让所有对象的缓存同时失效，因为缓存是按屏幕像素密度生成的，这可能反而制造卡顿，需要针对性调大缓存上限；导出高质量 PNG 之前建议临时关闭缓存，避免位图降采样导致模糊。第二，改属性的时候优先走 set 方法，而不是直接赋值，因为 Fabric 是通过 set 方法感知 cacheProperties 里的字段变化来自动置位 dirty 的，直接赋值可能不会正确触发缓存失效，画面就不会更新。
-->

---

# v5 → v6 → v7 版本演进

| 版本 | 时间 | 关键变化 |
|---|---|---|
| v5.x | — | `fabric` 全局命名空间对象，纯 JS，无类型声明 |
| **v6.0.0** | 地基重写 | ESM + TS 重写、具名导出、回调→Promise、`class extends` |
| v6.1~6.9.1 | 至 2025-12-15 | 稳定迭代 + 安全补丁 |
| **v7.0.0** | 2025-12-22 | Node ≥20；`origin` 默认值反转；移除部分 Canvas 方法 |
| v7.1~7.4.0 | 至 2026-05-18 | 裁剪/渐变控件、SVG CVE 修复、Rollup→Rolldown |

<div v-click class="text-sm">

v7 相对 v6 是"装修级"调整——ESM/具名导出/TS 重写这套地基语法完全延续，只是默认值反转 + 少量方法改名删除。

</div>

<!--
版本演进这一页把时间线理清楚，很多人还停留在 v6 是最新版的印象。

v5 时代 fabric 是全局命名空间对象，纯 JS 编写，没有类型声明。v6.0.0 是历史上最大的一次架构重写：ES Modules 化、TypeScript 原生重写、具名导出取代命名空间、大量回调 API 改成 Promise、子类化改为标准 class extends，这是奠定至今语法基座的地基级变化。v6.1 到 6.9.1 是稳定迭代期，含安全补丁，6.9.1 发布于 2025 年 12 月 15 日之后就没再更新了。

v7.0.0 在 2025 年 12 月 22 日发布，Node 最低版本提到 20，originX/originY 默认值从 left/top 改成 center，鼠标右键中键事件默认开启，移除了 getCenter、getPointer、setWidth、setHeight 等方法。v7.1 到当前的 7.4.0，2026 年 5 月 18 日发布，是功能性小版本加两次 SVG 导出安全 CVE 修复，构建工具也从 Rollup 切到了 Rolldown。

关键结论：v7 相对 v6 只是装修级调整，ESM、具名导出、TS 重写这套地基语法完全延续没有变化，只是默认值反转和少量方法改名删除，所以 v6 的知识点在 v7 下依然完全有效，这也是为什么今天的内容大部分代码示例在 v6 和 v7 下都成立。
-->

---

# 易错点合集（上）

<v-clicks>

1. v5 语法照抄报错：`fabric.Canvas` 命名空间写法 v6 起彻底失效
2. 类名改名漏改：`fabric.Object`/`Text`/`Image` → `Fabric` 前缀三兄弟
3. 异步 API 当同步用：`loadFromJSON`/`fromURL` 等返回 Promise，需 `await`
4. **v7 origin 默认值坑**：`'left'/'top'` 改 `'center'`，旧代码对象会跑出画布
5. `objectCaching` 与视觉不同步：改属性不走 `set()` 可能不触发 `dirty`
6. 忘记 `setCoords()`：手动改坐标后包围盒/控制点可能与外观错位

</v-clicks>

<!--
易错点合集上半部分，六条最高频的坑。

第一，v5 语法照抄报错：网上大量老教程还是 fabric.Canvas 命名空间写法，v6 起彻底失效。第二，类名改名漏改：fabric.Object、fabric.Text、fabric.Image 这三个特殊改名，批量替换脚本最容易漏掉。第三，异步 API 当同步用：v6 起 loadFromJSON、loadSVGFromString、FabricImage.fromURL 大量返回 Promise，v5 遗留的回调式写法不会报类型错但语义不对，必须 await 或 then。

第四是升级重灾区：v7 把 originX/originY 默认值从 left/top 改成了 center，沿用旧代码把对象放在 0,0 会导致对象四分之三跑到画布外，升级到 v7 必须显式设置 originX left originY top，或者调用官方提供的 positionByLeftTop 迁移辅助。

第五，objectCaching 与实时视觉不同步：直接改对象属性而不走 set 方法可能不会正确标记 dirty，导致缓存没有失效、画面没更新。第六，忘记 setCoords：手动改了 left top scaleX 这些属性且没有触发内部同步逻辑时，对象的包围盒与控制点位置可能与视觉外观不同步，需要手动调用 setCoords 刷新。
-->

---

# 易错点合集（下）

<v-clicks>

7. 跨域图片"画布污染"：不设 `crossOrigin: 'anonymous'` 会致 `toDataURL()` 抛异常
8. Group 内坐标陷阱：加入 Group 后 `left`/`top` 变为相对父级坐标，非画布绝对坐标
9. v7 鼠标事件默认反转：`fireRightClick`/`fireMiddleClick` 默认改为 `true`
10. Node 依赖坑：需走 `fabric/node` 子路径，`node-canvas` 需系统级 Cairo 工具链
11. 自定义属性静默丢失：不登记 `customProperties`，`toJSON()` 悄悄丢弃
12. 事件清单无官方权威版本：勿凭记忆默写，用 TS 提示 / demo 交叉核实
13. 方法链风格不推荐：`obj.set({...}).rotate(90)` 官方建议拆成独立语句

</v-clicks>

<!--
易错点合集下半部分，剩下七条。

第七，跨域图片画布污染：FabricImage.fromURL 加载跨域图片不设置 crossOrigin anonymous，后续调用 toDataURL 或应用滤镜时会触发浏览器的 canvas tainted 安全异常。第八，Group 内坐标系陷阱：对象一旦被加入 Group，其 left top 变为相对父 Group 的坐标而非画布绝对坐标，ungroup 之后 Fabric 会自动换算回绝对坐标，但自定义逻辑里直接读取子对象坐标要注意判断是否处于 Group 内。

第九，v7 鼠标事件默认反转埋雷：fireRightClick、fireMiddleClick 从 v7 起默认 true，如果旧代码给这两类事件挂了处理器但没有按 event.button 做过滤，升级后可能出现意料之外的触发。第十，Node 环境依赖坑：Node 端要走 fabric/node 子路径导入，底层依赖 node-canvas 原生编译，需要系统级 Cairo 等依赖，CI 或 Docker 镜像里没装对应编译工具链会导致 npm install 直接失败。

第十一，自定义属性静默丢失，前面单独讲过，这里再强调一次它有多隐蔽。第十二，事件清单没有官方权威版本，不要凭记忆或旧笔记默写一份完整事件列表去出题。第十三，方法链风格已不推荐：v5 时代的链式写法在 v6+ 仍可能可用，但官方不再推荐，新代码应该拆成独立语句，避免依赖未文档化的返回值行为。
-->

---

# 选型对比：vs 原生 Canvas / Konva / PixiJS

| 维度 | Fabric.js | 原生 Canvas | Konva | PixiJS |
|---|---|---|---|---|
| 定位 | 交互对象模型 | 底层绘图指令 | 相似对象模型 | WebGL 渲染引擎 |
| 序列化 | 官方一等公民 | 需自建 | 内置支持 | 需自建 |
| React 绑定 | 无，需手动 | 手动 | `react-konva` | `@pixi/react` |

<div v-click class="mt-4 text-sm">

**口诀**：Fabric/Konva 是"每个对象都有属性面板"的编辑器思路，性能定位中等对象数量；PixiJS 是"渲染吞吐量优先"的引擎思路，万级以上对象/粒子有明显优势。团队栈是 React 时 Konva 略有优势。

</div>

<!--
选型对比，横向比较原生 Canvas、Konva、PixiJS。

定位上，Fabric 和 Konva 高度相似，都是 Canvas 之上的交互对象模型，选中拖拽缩放旋转开箱即用；原生 Canvas 只是底层绘图指令集，没有对象概念，需要自己实现命中检测和变换矩阵；PixiJS 是 WebGL 优先的高性能渲染引擎，没有内置交互层，需要自己搭或者接 pixi-viewport。

序列化上，Fabric 的 toObject、toJSON、loadFromJSON 是官方一等公民能力；原生 Canvas 没有，需要自建；Konva 也有内置的 toJSON 支持；PixiJS 没有内置场景序列化，需要自己搭。React 生态上，Fabric 没有官方绑定，需要自己手动同步生命周期；原生 Canvas 也要手动集成；Konva 有 react-konva 官方绑定，和 React 结合非常顺滑；PixiJS 也有 @pixi/react 官方绑定。

选型口诀：需要图形编辑器、白板、设计工具，看重序列化和成熟度，Fabric 和 Konva 二选一，两者定位几乎重叠，性能定位都是中等对象数量、属性丰富的场景，团队技术栈是 React 时 Konva 略有优势；面对上万对象、粒子特效、游戏级帧率场景，选 PixiJS，它在这个量级有明显优势，但要自己搭一层交互拾取逻辑。核心区分口诀：Fabric、Konva 是每个对象都有属性面板的编辑器思路，PixiJS 是渲染吞吐量优先的引擎思路；只需要画出来看、不要求对象级交互，原生 Canvas 足够，减少依赖体积。
-->

---
layout: intro
---

# 总结

Fabric.js = **Canvas 之上的交互式对象模型库**

- 定位：给 Canvas 补 DOM 般的对象模型 + 事件系统，图形编辑器/白板老牌标准
- 核心链路：`FabricObject` 基类 → 内置形状/文本/图片 → `Group`/`ActiveSelection` 打包
- 序列化 `toObject`/`toJSON`/`toSVG` 一等公民；自定义属性需显式登记才不丢失
- 性能靠 `objectCaching` 离屏缓存；v7 起 `origin` 默认值反转是升级重灾区
- 2026：v7.4.0，ESM 具名导出地基自 v6 延续，海量对象场景让位 PixiJS

<!--
总结一下。

Fabric.js 是构建在 Canvas 之上的交互式对象模型库。核心定位是给裸 Canvas 补上一层类似浏览器 DOM 的对象模型加事件系统，让每个图形都可以选中、拖拽、缩放旋转、序列化，是图形编辑器、白板、海报设计工具、签名板的老牌事实标准。

核心链路：所有可视对象继承自 FabricObject 基类，内置形状、文本三兄弟、图片滤镜都在这套体系下，需要整体操作时用 Group 或者 ActiveSelection 打包成复合对象。序列化能力是一等公民，toObject、toJSON、toSVG 官方支持得很完整，但自定义属性必须显式登记 customProperties 或覆写 toObject，否则会静默丢失。

性能上核心抓手是 objectCaching 离屏缓存机制。版本上要记住 v7 起 originX/originY 默认值从 left top 反转成了 center，这是从 v6 升级到 v7 最容易踩的坑。

2026 年现状：当前版本 v7.4.0，v6 那次 ESM 加具名导出的地基级重写语法一直延续到今天。如果场景是海量对象、粒子特效、游戏级帧率，那应该让位给 PixiJS，选 Fabric 还是 Konva 更多是团队技术栈的选择。今天的内容就到这里，谢谢大家。
-->
