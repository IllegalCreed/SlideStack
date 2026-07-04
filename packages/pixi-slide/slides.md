---
theme: seriph
background: https://cover.sli.dev
title: Welcome to PixiJS
info: |
  Presentation PixiJS —— 网页端高性能 2D 渲染引擎。

  Learn more at [https://pixijs.com](https://pixijs.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🐰</span>
</div>

<br/>

## PixiJS —— 浏览器里的高性能 2D 渲染引擎

WebGL/WebGPU 双后端的 2D 场景图渲染引擎，专为游戏与可视化打造，当前 v8.19

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/pixijs/pixijs" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 PixiJS —— 网页端最快、最轻量的 2D 渲染引擎，基于 WebGL（默认）与 WebGPU（可选）双后端，专为游戏、交互式应用与数据可视化等需要大量图形对象、高帧率渲染的场景设计。

版本背景：npm 实测最新 8.19.0，v8 是一次架构级重写（非渐进式升级），核心动机是原生支持 WebGPU，模块系统也全面转向纯 ES Module，移除了 v7 时代 @pixi/app、@pixi/sprite 这类子包各自引入的模式。

今天的顺序：定位 → 架构总览 → Application 异步 init → 场景图 → Sprite → 纹理与 Assets → Graphics → 文本系统 → Ticker → 事件系统（两页）→ 滤镜 → 性能优化（两页）→ 生态 → v7→v8 迁移 → 易错点 → 选型对比 → 资源与总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 PixiJS？

网页端最快、最轻量的 2D 渲染引擎，基于 WebGL（默认）与 WebGPU（可选）双后端：

<v-clicks>

- GPU 批处理 + 纹理图集 + `ParticleContainer`，为"海量精灵"而生
- 场景图模型清晰，贴近游戏引擎心智
- 滤镜 / 事件 / 资源加载体系完整自成一体
- DevTools 浏览器插件可视化调试场景图

</v-clicks>

<div v-click class="mt-6">

但它不是图表库/UI 框架：

- 不提供图表/UI 组件，图形逻辑需自己在其上层搭建
- v8 相对 v7 是破坏性重写，历史项目升级成本高

</div>

<!--
为什么用 PixiJS？它是网页端最快、最轻量的 2D 渲染引擎，基于 WebGL 默认与 WebGPU 可选双后端。

优势：渲染性能是第一卖点，GPU 批处理、纹理图集、ParticleContainer 等机制专为"海量精灵"设计；场景图模型清晰，贴近游戏引擎心智；滤镜、事件、资源加载体系完整自成一体；还有 DevTools 浏览器插件可视化调试场景图层级。

但要认清边界：它不提供图表、UI 组件，是渲染引擎而非图表库，做可视化需要自己在其上层搭建图形逻辑，这也是它区别于 ECharts、Chart.js 这类"开箱即用图表库"的地方。而且 v8 相对 v7 是一次几乎全部核心 API 都变了的破坏性重写，历史项目升级成本不低。

适用信号：需要 60fps 动画、成百上千可交互对象、WebGL/WebGPU 级别性能、Canvas 2D 力不从心的场景。后面会有专门一页对比 Canvas 2D / Konva / Fabric / Three.js。
-->

---

# 架构总览：双后端 + 扩展系统

PixiJS 完全围绕「扩展 extensions」构建：渲染管线、资源加载、Application 插件都是可注册/替换模块。核心渲染器三选一：

| 渲染器 | 定位 |
| --- | --- |
| `WebGLRenderer` | 默认，稳定成熟，生产首选 |
| `WebGPURenderer` | 功能完整，但浏览器实现有差异 |
| `CanvasRenderer` | 2D 兜底渲染器，仍在完善中 |

<div v-click class="mt-4 text-sm">

> ⚠️ `Application.init()` 的 `preference` 默认值是 **`'webgl'`**——"自动选择"指探测/降级兜底，并非默认优先 WebGPU。

</div>

<!--
PixiJS v8 完全围绕"扩展"概念构建：渲染管线、资源加载、Application 插件等每个模块都是可注册/替换的扩展，比如自定义一个 LoadParser 用 extensions.add 注册进去。

核心渲染器三选一：WebGLRenderer 默认、稳定成熟，是生产首选；WebGPURenderer 功能完整但浏览器实现有差异，官方仍建议生产环境优先 WebGL；CanvasRenderer 是 2D 兜底，还在完善中。autoDetectRenderer 或 Application.init 会根据 preference 选项加环境支持情况选择具体渲染器。

一个常见误读要澄清：官方架构总览页笼统地说"自动选择 WebGPU 或 WebGL"，容易让人以为 v8 默认优先 WebGPU。但 Application.init 的 preference 选项官方默认值明确是 'webgl'——"自动选择"说的是探测和降级兜底机制，不是"默认优先 WebGPU"。要用 WebGPU 必须显式配置 preference: 'webgpu'。
-->

---

# Application：v8 异步 init（重点坑）

```js
import { Application } from 'pixi.js';

const app = new Application();
await app.init({
  width: 800,
  height: 600,
  resizeTo: window,       // 自动跟随容器尺寸
  preference: 'webgl',    // 'webgl' | 'webgpu'
  resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.canvas); // v7 是 app.view
```

<div v-click class="mt-3 text-sm">

> ⚠️ 构造函数不接受参数，必须先 `new` 再 `await app.init()`——WebGPU 上下文异步取得。init 完成前 `app.stage`/`app.canvas` 均为 `undefined`，是 v7→v8 最常见踩坑。

</div>

<!--
v8 中 Application 构造函数不再接受参数，必须先 new 再 await app.init(options)，因为 WebGPU 上下文获取是异步的。

关键属性：app.stage 根 Container、app.canvas（原 app.view）、app.ticker、app.renderer、app.screen。可为 webgl/webgpu 分别传专属配置，比如 webgl: { antialias: true }, webgpu: { antialias: false }。

内置插件：Ticker Plugin 驱动渲染循环、Resize Plugin 响应式尺寸、Culler Plugin 可选需手动注册。也支持自定义 ApplicationPlugin 扩展应用生命周期。

最常见的坑：忘记 await，直接在下一行访问 app.stage 或 app.canvas，会拿到 undefined，这是 v7 迁移过来的开发者最容易踩的第一个坑。
-->

---

# 场景图：Container 与 Transform

```js
import { Container } from 'pixi.js';

const container = new Container();
const child = new Container({ label: 'enemy' }); // label 原 name

container.addChild(child);
child.zIndex = 1;
container.sortableChildren = true; // 按 zIndex 排序
```

<v-clicks>

- 每帧从根 `app.stage` 遍历，累积 `worldTransform`/`worldAlpha`（父子相乘）
- `position`/`scale`/`rotation`/`pivot`/`skew` 控制变换
- `addChildAt`/`removeChild`/`swapChildren`/`reparentChild`（换父保留世界坐标）
- ⚠️ 叶子节点（Sprite/Graphics/Mesh）**不可再 `addChild`**，须与子对象一起挂在 Container 下

</v-clicks>

<!--
场景图是一棵树，根节点是 app.stage；每帧 PixiJS 从根遍历到所有叶子节点，累积计算 worldTransform 位置旋转缩放和 worldAlpha 透明度，父子相乘，比如父 0.5 加子 0.5 最终是 0.25。

变换相关：position、scale、rotation、pivot、skew，可见性 visible、alpha。坐标换算用 obj.toGlobal 把本地坐标转全局坐标。

v8 有个关键限制必须强调：叶子节点，也就是 Sprite、Graphics、Mesh 这些可渲染对象，不再允许 addChild 了，容器职责和可渲染对象职责彻底分离，必须都挂在 Container 下面。另外 container.name 已经重命名成 container.label。查找子节点可以用 getChildByLabel 或 getChildrenByLabel 配合正则。
-->

---

# Sprite：纹理化的可视对象

```js
import { Assets, Sprite } from 'pixi.js';

const texture = await Assets.load('path/to/bunny.png');
const bunny = new Sprite(texture);

bunny.anchor.set(0.5);       // 锚点：旋转/缩放中心
bunny.position.set(100, 100);
bunny.scale.set(2);          // 百分比缩放
bunny.rotation = Math.PI / 4;
bunny.tint = 0xff0000;       // 着色（乘色）
```

<div v-click class="mt-3 text-sm">

> Sprite 是最基础的可视元素，代表屏幕上的一张图片。换纹理（`sprite.texture = newTexture`）时 PixiJS 会自动重新绑定监听、按需重算宽高保持视觉尺寸。

</div>

<!--
Sprite 是最基础的可视元素，代表屏幕上的一张图片，PixiJS 官方经典示例就是这只 bunny。

先用 Assets.load 拿到纹理，再 new Sprite(texture)。anchor 是锚点，控制旋转缩放的中心点，0.5 就是居中；position 设位置；scale 是百分比缩放，也可以直接设 width/height 让内部换算 scale；rotation 是弧度制旋转；tint 是着色，本质是乘色而不是覆盖色。

换纹理场景也很常见，比如换装、换皮肤：直接赋值 sprite.texture = newTexture，PixiJS 内部会自动重新绑定纹理更新监听、按需重算宽高保持视觉尺寸不跳变、并触发一次视觉更新，不需要手动处理这些细节。
-->

---

# 纹理与 Assets 加载系统（必考）

`TextureSource`（原始像素 + GPU 上传）→ `Texture`（裁剪/UV 元数据）→ `Sprite`，多个 `Texture` 可共享一个 `TextureSource`（精灵图集）。

```js
import { Assets } from 'pixi.js';

const texture = await Assets.load('bunny.png');
await Assets.load({ alias: 'bunny', src: 'path/to/bunny.png' });
const t = Assets.get('bunny'); // 别名取值

const p1 = await Assets.load('bunny.png'); // 二次 load 命中缓存，p1 === p2
await Assets.unload('bunny.png');          // 彻底释放
```

<div v-click class="mt-2 text-sm">

> Manifest + Bundle 可分组懒加载（`Assets.loadBundle('load-screen')`）；Resolver 按平台能力从通配符（`bunny@{1,2}x.png`）解析最优 URL。

</div>

<!--
纹理链路：源文件先变成 TextureSource，也就是原始像素数据加 GPU 上传，支持 ImageSource、CanvasSource、VideoSource 等多种来源；再变成 Texture，是轻量视图，含裁剪、UV、变换等元数据；多个 Texture 可以共享一个 TextureSource，这就是精灵图集的原理。v7 的 BaseTexture 在 v8 已经拆分成这些不同的 Source。

Assets 是 v8 的现代资源管理单例，基于 Promise、带缓存感知。基础用法：Assets.load 单个或批量加载，可以传别名 alias 方便后续用 Assets.get 取值。缓存机制是同一个 URL 二次 load 会返回同一个对象，不会重复发请求。卸载用 Assets.unload 彻底释放，如果只想清 GPU 显存保留 JS 引用可以用 texture.source.unload()。

更大规模的项目会用 Manifest 加 Bundle 做分组懒加载，比如加载画面一组资源、游戏画面另一组资源；Resolver 走四阶段解析，可以处理多分辨率多格式的通配符，配合 AssetPack 工具自动生成清单。
-->

---

# Graphics：v8 全新链式 API（必考）

v8 从"先填充→画形状→结束填充"改为"先画形状、再 fill/stroke"，且不立即绘制——可复用/克隆/遮罩。

```js
import { Graphics, GraphicsContext } from 'pixi.js';

const g = new Graphics()
  .rect(50, 50, 100, 100).fill(0xff0000)
  .circle(200, 200, 50).stroke({ width: 5, color: 0x00ff00 });

const ctx = new GraphicsContext().circle(100, 100, 50).fill('red');
const shapeA = new Graphics(ctx);
const shapeB = new Graphics(ctx); // 共享同一份几何，切换开销低
```

<div v-click class="mt-2 text-sm">

> 旧 API 已移除：`beginFill()/drawRect()/endFill()/lineStyle()` → `rect().fill()`、`stroke({width,color})`；挖洞 `beginHole()/endHole()` → `.cut()`。

</div>

<!--
v8 彻底重写了 Graphics API：从 v7 的"开始填充、画形状、结束填充"改成"先画形状、再 fill 或 stroke"的链式调用，而且不是立即绘制，而是构建几何图元列表，加入场景后才真正渲染，因此对象可以被复用、克隆、当遮罩用。

支持基础图元矩形圆角矩形圆椭圆弧形贝塞尔曲线，也支持高级图元倒角矩形圆角多边形正多边形星形。fill 和 stroke 支持颜色、纹理、FillGradient 渐变，但渐变不能和纹理或矩阵同时用。

GraphicsContext 是个重要的性能优化点，替代 v7 的 GraphicsGeometry，可以让多个 Graphics 实例共享同一份几何数据，切换 context 开销很低，官方性能建议是避免每帧清空重建 Graphics，改用预构建的 GraphicsContext 切换。另外 pixelLine 属性能画恒定 1px 不随缩放变化的线，适合像素画风格或 UI 分隔线。
-->

---

# 文本系统：Text / BitmapText / HTMLText

| 类型 | 原理 | 适合 |
| --- | --- | --- |
| `Text` | Canvas 文本 API 光栅化成纹理 | 精细样式、文本不频繁变化 |
| `BitmapText` | 预生成位图字形集拼字符 | 大量动态文本，可达数万实例 |
| `HTMLText` | SVG foreignObject 内嵌真实 HTML | 富文本标签、CSS 排版 |

<div v-click class="mt-3 text-sm">

> ⚠️ `BitmapText` 的 `resolution` 运行时不可改；`HTMLText` 渲染是异步的，创建后不会立即可见，动画首帧对齐容易踩坑。

</div>

<!--
三种文本渲染方案各有取舍。Text 用浏览器 Canvas 文本 API 把文字光栅化成纹理，能精细控制 CSS 级样式，但每帧变化文本或成百上千实例会性能吃紧。BitmapText 预先生成位图字形集，直接拼字符，适合 HUD、计分板、计时器这类大量动态文本，可以达到数万实例，但分辨率运行时不可改，也不适合 CJK、emoji 这种大字符集，会受纹理尺寸限制。HTMLText 通过 SVG foreignObject 内嵌真实 HTML，能用标签和 Unicode、emoji、text-shadow 这类 CSS 排版，但渲染是异步的，创建后不会立刻可见，通常要下一帧才渲染完成，不适合像素级性能场景或成百实例。

配置上 TextStyle 常用 fontFamily、fontSize、fill、stroke、dropShadow，v8 里 dropShadow 改成对象形式，可以只改字段不用重建整个 style。BitmapText 要先 Assets.load 加载 fnt 字体文件。
-->

---

# Ticker 与渲染循环

渲染循环三步：**Ticker 回调 → 场景图更新 → GPU 渲染**，`Ticker` 用 `requestAnimationFrame` 驱动。

```js
app.ticker.add((ticker) => {
  bunny.rotation += ticker.deltaTime * 0.1; // 回调参数是 Ticker 实例，非裸数字
});

const ticker = new Ticker();
ticker.minFPS = 30; // 钳制 deltaTime 下限
ticker.maxFPS = 60; // 0 表示不限制
ticker.add(fnA, null, UPDATE_PRIORITY.HIGH); // HIGH(50) > NORMAL(0) > LOW(-50)
```

<div v-click class="mt-2 text-sm">

> `deltaTime` 是缩放后帧时差（动画用），`elapsedMS` 是原始毫秒值；`app.stop()`/`app.start()` 手动暂停恢复循环。

</div>

<!--
渲染循环三步：Ticker 回调、场景图更新世界矩阵和剔除、GPU 渲染。Ticker 底层用 requestAnimationFrame 驱动。

v8 一个重点坑：回调参数是 Ticker 实例，不是 v7 那种裸 delta 数字，要用 ticker.deltaTime，如果直接把参数当数字用会得到 NaN 或 [object Object]。

可以创建多个独立 Ticker 实例获得更新顺序的完全控制，minFPS、maxFPS 钳制帧率范围，UPDATE_PRIORITY 控制多个回调的执行顺序，HIGH 大于 NORMAL 大于 LOW。deltaTime 是缩放后适合做动画位移的帧时差，elapsedMS 是原始毫秒值。app.stop、app.start 可以手动暂停恢复循环，切页或游戏暂停常用。
-->

---

# 事件系统：eventMode（重点）

v8 用"联合事件模型"替代 v7 `InteractionManager`，DOM 风格 API。核心是 `eventMode`：

| 取值 | 行为 |
| --- | --- |
| `none` | 完全忽略交互，子元素也不响应，性能最优 |
| `passive`（默认） | 自身不响应，但可交互子元素正常工作 |
| `auto` | 仅当父级可交互才参与命中测试 |
| `static` | 标准交互：接收 pointer/mouse/touch 事件 |
| `dynamic` | 同 static，额外每帧做合成命中检测 |

<div v-click class="mt-2 text-sm">

> ⚠️ 默认值是 `'passive'` 不是 `'auto'`——v7 默认行为等价 `'auto'`，直接迁移代码可能导致对象不响应事件，需显式设 `static`/`dynamic`。

</div>

<!--
v8 用"联合事件模型" Federated Events 替代 v7 的 InteractionManager，是 DOM 风格 API。核心是 eventMode 这个属性，五个取值。

none 完全忽略交互事件，子元素也不响应，性能最优。passive 是默认值，自身不响应点击，但可交互子元素仍正常工作。auto 仅当父级可交互时才参与命中测试，自身不主动触发。static 是标准交互，接收 pointer、mouse、touch 事件，适合按钮这类静止元素。dynamic 同 static，额外在指针静止时每帧做合成命中检测，适合会动的对象。

最容易踩的坑：v7 默认交互行为等价于 auto，v8 默认值却是 passive，直接迁移代码可能导致原本能响应事件的对象在 v8 下不响应了，需要显式设成 static 或 dynamic。
-->

---

# 事件用法与命中测试

```js
sprite.eventMode = 'static';
sprite.on('pointerdown', () => console.log('clicked'));
sprite.addEventListener('click', (e) => {}, { once: true }); // DOM 风格

sprite.hitArea = new Rectangle(0, 0, 100, 100); // 自定义命中区域
sprite.cursor = 'pointer';
```

<v-clicks>

- 事件三类：指针（推荐，`pointerdown/pointertap` 等）/ 鼠标（`click/wheel`）/ 触摸（`touchstart/tap`）
- 命中测试沿显示树查找指针下最上层可交互元素
- `interactiveChildren = false` 跳过子树遍历，优化大场景性能
- `interactive = true` 仍可用，是 `eventMode = 'static'` 的别名（新代码推荐直接用 `eventMode`）

</v-clicks>

<!--
用法上，先把 eventMode 设成 static 或 dynamic 让对象可交互，然后用 on 绑定事件，比如 pointerdown；也支持 addEventListener 这种 DOM 风格写法，包括 once 这样的选项；还支持 onclick 这种回调属性写法。hitArea 可以自定义命中区域，跳过实际形状测试，性能更好也更好控制；cursor 设鼠标悬停样式。

事件类型分三类：指针事件是官方推荐的，pointerdown、pointerup、pointermove、pointertap、globalpointermove 等；鼠标事件 click、rightclick、wheel；触摸事件 touchstart、tap。命中测试沿显示树查找指针下最上层的可交互元素，interactiveChildren 设 false 可以跳过子树遍历，对大场景是个有效的性能优化点。

最后提一句兼容性：v7 的 sprite.interactive = true 在 v8 仍然可用，它只是 eventMode = 'static' 的别名，但官方 API 已经以 eventMode 为准，新代码应该直接用 eventMode。
-->

---

# Filters 滤镜

```js
import { BlurFilter, NoiseFilter } from 'pixi.js';

sprite.filters = [new BlurFilter({ strength: 8 })];
sprite.filters = [new BlurFilter({ strength: 4 }), new NoiseFilter({ noise: 0.2 })]; // 数组=链式叠加

import 'pixi.js/advanced-blend-modes'; // 高级混合模式需按需 import
```

<v-clicks>

- 内置滤镜：`AlphaFilter`/`BlurFilter`/`ColorMatrixFilter`/`DisplacementFilter`/`NoiseFilter`
- 自定义滤镜需同时提供 WebGL（`GlProgram`）与 WebGPU 着色器程序
- 不用时 `container.filters = null` 释放；设 `filterArea` 避免每帧自动测量包围盒
- ⚠️ 滤镜数量越多、不同混合模式越多，越容易打断批处理、拉低性能

</v-clicks>

<!--
滤镜用法很直观：给 sprite.filters 赋一个滤镜数组，数组代表链式叠加，按顺序处理，比如先模糊再加噪点。高级混合模式滤镜需要单独 import 'pixi.js/advanced-blend-modes' 才能用，这是 v8 按需加载体系的一部分，漏 import 不会报错，只是效果不生效，容易被误判成"文档写错了"。

内置滤镜有 AlphaFilter、BlurFilter、ColorMatrixFilter、DisplacementFilter、NoiseFilter。自定义滤镜要同时想清楚 WebGL 和 WebGPU 双后端着色器，用 GlProgram 定义程序，resources 传 uniform，比如传时间变量做动画滤镜。

性能提醒：不用的时候把 container.filters 设 null 释放；设置 filterArea 避免每帧自动测量包围盒；不同混合模式会打断批处理；滤镜数量越多性能下降越明显。社区滤镜包 pixi-filters 在 v8 按子路径导入，比如 pixi-filters/adjustment，不再是 v7 的 @pixi/filter-adjustment。
-->

---

# 性能优化①：Render Groups / Layers / cacheAsTexture

```js
// Render Groups：子树当独立场景图，变换/透明度计算下放 GPU
const world = new Container({ isRenderGroup: true });

// cacheAsTexture：整体渲染进一张纹理复用（替代 v7 cacheAsBitmap）
panel.cacheAsTexture({ resolution: 2 });
panel.updateCacheTexture();
```

<v-clicks>

- Render Groups 适合结构不常变的静态子树（游戏世界层/HUD 层分离），官方强调"不要滥用"
- Render Layers：视觉绘制顺序与逻辑父子关系解耦，`layer.attach(obj)`/`layer.detach(obj)`
- cacheAsTexture 限制：容器超约 4096×4096px 可能缓存失败；频繁开关比不缓存更慢

</v-clicks>

<!--
Render Groups 是 v8 新增的性能特性，把子树标记为自包含的小场景图，将变换、着色、透明度计算下放到 GPU，减少 CPU 负担，适合结构不常变的静态子树，比如游戏世界层和 HUD 层分离。官方特别强调不要滥用，Render Group 太多反而更慢，需要实测。

Render Layers 是视觉向的新特性，把渲染顺序和场景图父子逻辑关系解耦：对象仍然保留逻辑父级的变换继承，但可以按需插到别的绘制层，比如角色血条永远显示在世界之上，不受角色所在子树限制。用 layer.attach 显式挂载，注意如果对象被重新 addChild 到别的父节点，不会自动保留在 layer 中。

cacheAsTexture 替代 v7 的 cacheAsBitmap，把容器及子元素整体渲染进一张纹理复用，适合不常更新的静态 UI 面板。限制：会增加显存占用，超大容器超过约 4096×4096px 可能缓存失败，频繁开关反而比不缓存更慢。
-->

---

# 性能优化②：Culling 与 ParticleContainer

```js
// v8 默认关闭自动裁剪，需显式设置 + 手动调用
container.cullable = true;
container.cullArea = new Rectangle(0, 0, 400, 400);
Culler.shared.cull(container, app.screen);

// ParticleContainer：海量精灵专用，Particle 无子节点/事件/滤镜
const particles = new ParticleContainer({ boundsArea: new Rectangle(0, 0, 500, 500) });
particles.addParticle(new Particle({ texture, x: 100, y: 100 })); // 注意不是 addChild
```

<v-clicks>

- 或注册 `CullerPlugin` 扩展找回接近 v7 的自动裁剪行为
- `dynamicProperties`（position/rotation 等）区分每帧上传 vs 仅 `update()` 时上传，可渲染数十万粒子

</v-clicks>

<!--
Culling 剔除机制在 v8 有重要变化：默认关闭，且不再像 v7 那样渲染时自动裁剪视口外对象，需要显式设置 cullable、cullArea，并手动调用 Culler.shared.cull(container, view)，或者注册 CullerPlugin 扩展找回接近 v7 的自动行为。cullableChildren 设 false 可以在大场景递归优化，跳过子树的剔除判断。

ParticleContainer 是 v8 重构过的海量精灵专用容器，专为几十万粒子设计。它不再接受 Sprite，改用更轻量的 Particle，没有子节点、事件、滤镜这些开销。注意用 addParticle 而不是 addChild，粒子存在 particleChildren 而不是 children 里，boundsArea 需要手动设置，v8 不再自动计算包围盒。

dynamicProperties 精细控制哪些属性每帧上传 GPU（比如 position、rotation），哪些是静态属性只在调用 update() 时才上传（比如 color），这个取舍是压榨大规模粒子性能的关键设计。

其他性能建议：精灵图集减少纹理切换，绘制顺序影响批处理效率，轴对齐矩形遮罩最快、图形遮罩次之、精灵遮罩最慢，纹理默认 3600 帧未用自动 GC。
-->

---

# 生态 Ecosystem

<v-clicks>

- **@pixi/react**：React 声明式管理 PixiJS 对象（要求 React 19+）
- **DevTools**：浏览器扩展，实时查看渲染性能/场景图/纹理管理
- **Layout**：基于 Yoga 引擎的 CSS 风格 flexbox 布局
- **pixi-filters**：高性能滤镜合集，v8 起按子路径导入
- **pixi-sound**：基于 WebAudio 的音频播放（含音频滤镜）
- **pixi-spine**：Spine 骨骼动画集成
- **UI**：预制按钮/滑块/进度条/复选框等交互组件库
- **AssetPack**：资源打包/清单自动生成工具

</v-clicks>

<!--
PixiJS 生态相当完整。@pixi/react 用 React 声明式方式管理 PixiJS 对象，要求 React 19+。DevTools 是浏览器扩展，能实时查看渲染性能、场景图层级、纹理管理，调试利器。Layout 是基于 Facebook Yoga 引擎的 CSS 风格 flexbox 布局，解决游戏 UI 排版问题。

pixi-filters 是高性能滤镜合集，模糊发光这些效果都有，v8 起按子路径导入。pixi-sound 基于 WebAudio 做音频播放，含音频滤镜。pixi-spine 是 Spine 骨骼动画集成，2D 骨骼动画常用。UI 是预制的按钮滑块进度条复选框这类交互组件库，AssetPack 是资源打包清单自动生成工具，配合 Assets、Manifest、Resolver 使用。

社区还有 pixi-viewport，做相机视口缩放平移控件，常用于地图类或无限画布场景，这个是社区生态但也很常用。
-->

---

# v7 → v8 迁移速览（重点）

| v7 | v8 |
| --- | --- |
| `app.view` | `app.canvas` |
| `beginFill()/drawRect()/endFill()` | `.rect().fill()` 链式 |
| `sprite.interactive = true` | `eventMode = 'static'`（默认 `'passive'`） |
| Ticker 回调裸 `delta` 数字 | 回调参数是 `Ticker` 实例 |
| `SCALE_MODES.NEAREST` 等数字枚举 | `'nearest'` 等字符串常量 |
| `NineSlicePlane`/`SimpleMesh`/`SimpleRope` | `NineSliceSprite`/`MeshSimple`/`MeshRope` |

<div v-click class="mt-2 text-sm">

> 叶子节点（Sprite 等）**不可再 `addChild`**；`getBounds()` 返回 `Bounds` 需 `.rectangle` 取值；`settings` 全局对象已移除，改用 `DOMAdapter.set()`。

</div>

<!--
v8 是一次架构级重写，几乎所有核心 API 都变了，这里挑最高频的几组对照。

app.view 改名 app.canvas；Graphics 的 beginFill、drawRect、endFill、lineStyle 全部替换成链式的 rect().fill()、stroke({width, color})；sprite.interactive = true 虽然还能用，但新代码应该用 eventMode = 'static'，而且默认值从等价 auto 变成了 passive；Ticker 回调参数从裸 delta 数字变成 Ticker 实例；枚举全部从数字变成字符串常量，比如 SCALE_MODES.NEAREST 变成 'nearest'；还有一批类改名，NineSlicePlane、SimpleMesh、SimpleRope 分别变成 NineSliceSprite、MeshSimple、MeshRope。

另外三个容易漏的点：叶子节点不能再 addChild 了；getBounds() 在 v7 直接返回 Rectangle，v8 返回 Bounds 对象需要 .rectangle 才能拿到传统矩形字段；v7 的全局 settings 对象，比如 settings.RESOLUTION、settings.ADAPTER，在 v8 已经移除，要改用 AbstractRenderer.defaultOptions.resolution 和 DOMAdapter.set()。完整清单看官方迁移指南 migrations/v8 页面。
-->

---

# 易错点 Top 8

<v-clicks>

- 忘记 `await app.init()`：`new Application()` 后立即访问 `app.stage` 会拿到 `undefined`
- `eventMode` 默认值是 `'passive'` 不是 `'auto'`，迁移代码可能导致对象不响应事件
- 叶子节点不能再 `addChild`：Sprite/Graphics/Mesh 必须和子对象一起挂外层 Container
- `ParticleContainer` 用 `addParticle` 不是 `addChild`，`boundsArea` 需手动设置
- Ticker 回调参数是 `Ticker` 实例，当裸数字用会得到 `NaN`
- `Texture.from(url)` 不再直接联网加载，须先 `await Assets.load(url)` 进缓存
- `getBounds()` 返回 `Bounds` 对象，需要 `.rectangle` 才能拿到传统矩形字段
- 子包按需 import：高级混合模式/accessibility 等漏 import 不报错，只是静默无效

</v-clicks>

<!--
过一遍最高频的踩坑点。第一，忘记 await app.init()，new Application() 后立即访问 app.stage 会拿到 undefined，这是最常见的第一个坑。第二，eventMode 默认值是 passive 不是 auto，迁移代码可能导致原本能响应事件的对象不响应了。第三，叶子节点不能再 addChild，Sprite、Graphics、Mesh 必须和子对象一起挂外层 Container。第四，ParticleContainer 要用 addParticle 不是 addChild，boundsArea 需要手动设置。

第五，Ticker 回调参数是 Ticker 实例，当裸数字用会得到 NaN 或 [object Object]。第六，Texture.from(url) 在 v8 不再直接从网络加载，必须先 await Assets.load(url) 让资源进缓存，它是同步方法，找不到会直接报错而不是发请求。第七，getBounds() 返回值结构变了，直接当 Rectangle 用比如取 .width 会拿到 undefined。第八，子包按需 import 这件事很容易踩，高级混合模式、accessibility、WebWorker 适配这些都从默认包含改成按需 import，漏了不会报错，只是静默无效，容易误判成"文档写错了"而不是自己漏了 import。
-->

---

# 选型对比

| 维度 | PixiJS | Canvas 2D | Konva / Fabric | Three.js |
| --- | --- | --- | --- | --- |
| 渲染后端 | WebGL/WebGPU | CPU 光栅化 | 封装 Canvas 2D | WebGL/WebGPU，面向 3D |
| 性能定位 | 海量对象/高帧率首选 | 几百+复杂图形掉帧 | 量大慢于 PixiJS | 强但 2D 是"杀鸡用牛刀" |
| 交互能力 | Federated Events 需自建拖拽 | 需手写命中检测 | 内建拖拽/选择手柄 | 2D 拾取非强项 |
| 学习曲线 | 中等 | 低 | 低-中 | 高（3D 概念负担重） |

<div v-click class="mt-3 text-sm">

> 选型速记：静态图表 → Canvas 2D；图形编辑器/白板 → Konva（轻量）或 Fabric（选择手柄）；60fps 动画/海量交互对象/游戏 → **PixiJS**；真三维 → Three.js（2D UI 叠加可与 PixiJS 混用）。

</div>

<!--
选型对比四个维度。渲染后端上 PixiJS 是 WebGL 默认加 WebGPU 可选，Canvas 2D 是纯 CPU 光栅化，Konva 和 Fabric 都是封装 Canvas 2D，Three.js 也是 WebGL/WebGPU 但面向 3D。

性能定位上，PixiJS 靠批处理、纹理图集、ParticleContainer 专为海量对象高帧率设计；Canvas 2D 对象一多，几百个复杂图形就掉帧明显；Konva、Fabric 量级和 Canvas 2D 接近，量大会慢于 PixiJS；Three.js GPU 渲染能力强，但拿来做纯 2D 是杀鸡用牛刀，心智成本也高。

交互能力上，PixiJS 的 Federated Events 需要自己实现拖拽选中逻辑；Canvas 2D 要手写命中检测；Konva、Fabric 内建拖拽和选择手柄，编辑器体验开箱即用，这也是它们在"图形编辑器"场景更省心的原因；Three.js 2D 交互不是强项。学习曲线上 PixiJS 中等，需要理解 Container、Texture、Assets 异步加载、事件模式这些概念；Canvas 2D 最低；Konva、Fabric 低到中；Three.js 最高，3D 数学、相机、光照概念负担重。

选型速记：只想画个静态图表，Canvas 2D 原生就够；要做图形编辑器或白板，Konva 更省心，Fabric 编辑器体验更开箱即用；要 60fps 动画、成百上千交互对象、游戏级性能，选 PixiJS；要做真三维，选 Three.js，2D UI 叠加层也可以和 PixiJS 混用。
-->

---

# 资源与延伸阅读

<v-clicks>

- 官方文档：https://pixijs.com/8.x
- GitHub：https://github.com/pixijs/pixijs
- npm：`pixi.js`（8.19.0，MIT，PixiJS Team）
- v7→v8 迁移指南：pixijs.com/8.x/guides/migrations/v8
- DevTools 浏览器扩展：场景图/性能可视化调试
- 生态：@pixi/react · pixi-spine · pixi-sound · pixi-viewport

</v-clicks>

<!--
资源汇总：官方文档 pixijs.com/8.x 是最权威的一手信源；GitHub 仓库 pixijs/pixijs 可以看源码和 issue；npm 包名 pixi.js，当前 8.19.0，MIT 协议，PixiJS Team 维护；专门的 v7→v8 迁移指南页面前面提过，是升级时最该先读的一页；DevTools 浏览器扩展装上以后能可视化调试场景图和性能；生态里 @pixi/react、pixi-spine、pixi-sound、pixi-viewport 都是常用的补充库，按需加装。
-->

---
layout: intro
---

# 总结

PixiJS = **WebGL/WebGPU 双后端的高性能 2D 场景图渲染引擎**

- 双后端：`preference` 默认 `'webgl'`，`Application` 需 `await app.init()`
- 场景图：Container 树 + Transform 继承，叶子节点不可 `addChild`
- Graphics v8 链式 `fill()/stroke()`；Assets 异步资源管理 + 缓存
- `eventMode` 精细交互控制，默认 `'passive'`
- 性能：Render Groups / cacheAsTexture / Culling / ParticleContainer
- v8.19：破坏性重写但性能与 DX 双提升，游戏与海量可视化首选

<!--
总结一下。PixiJS 是封装 WebGL 和 WebGPU 双后端的高性能 2D 场景图渲染引擎。

核心心智：preference 默认走 WebGL，Application 必须先 new 再 await init；场景图是 Container 树加 Transform 继承，叶子节点不能再 addChild；Graphics v8 是链式的 fill、stroke API，Assets 是基于 Promise 的异步资源管理加缓存；eventMode 提供精细的交互控制，默认值是 passive 而不是 auto；性能优化有 Render Groups、cacheAsTexture、Culling、ParticleContainer 这几套手段，各有适用边界，不要滥用。

2026 年现状：v8.19，相对 v7 是一次几乎全部核心 API 都变了的破坏性重写，但换来了性能和开发体验的双提升，WebGPU 原生支持、扩展系统、场景图与可渲染对象职责分离，是游戏和海量数据可视化场景的首选 2D 渲染引擎。谢谢大家。
-->
