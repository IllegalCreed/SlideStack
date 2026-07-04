---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Konva
info: |
  Presentation Konva — 交互式 2D Canvas 场景图库。

  Learn more at [https://konvajs.org](https://konvajs.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎨</span>
</div>

<br/>

## Konva — 交互式 2D Canvas 场景图库

把「DOM 树 + 事件模型」搬进 Canvas 的声明式 2D 场景图框架，当前版本 v10.3

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/konvajs/konva" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Konva —— 一个把 DOM 树和事件模型搬进 HTML5 Canvas 的声明式 2D 场景图框架。

一句话定位：用 Stage、Layer、Group、Shape 的节点树代替裸 Canvas 的命令式绘制，开箱即带事件系统、拖拽、变换器、补间动画、滤镜与序列化，让"可交互的 2D 图形应用"——设计器、白板、图表编辑、地图标注——不必从零手撸命中检测和状态管理。

版本背景：npm 实测，2026 年 4 月 30 日发布的 10.3.0 是当前最新版，v10 主线迭代活跃。v9 到 v10 的核心差异主要在 Node.js 服务端渲染方式，日常业务 API 心智模型是一致的。

顺序：定位评价 → 架构总览 → Stage/Layer/Group → 形状与自定义 → 节点操作 → 事件 → 拖拽 → Transformer → 动画 → 滤镜 → 序列化 → react-konva → vue-konva → 性能 → 易错点 → 选型对比 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 Konva？

原生 Canvas 命令式绘制的痛点：

<v-clicks>

- "画完就忘"（立即模式），无法后续单独修改某个已画图形
- 命中检测、拖拽、变换全靠手写坐标数学
- 没有节点树，状态管理只能自己攒

</v-clicks>

<div v-click class="mt-6">

Konva 用**保留模式**场景图补齐这些能力：

- Stage→Layer→Group→Shape 节点树，像操作 DOM 一样操作图形
- 开箱即带事件、拖拽、Transformer、动画、滤镜、序列化
- React/Vue/Svelte/Angular 官方绑定齐全，TS 类型内置

</div>

<!--
为什么用 Konva？原生 Canvas 2D API 是立即模式：画完就忘，没法针对某个已经画出来的图形单独做后续修改，命中检测、拖拽、变换全部要自己写坐标数学，也没有节点树，状态全靠自己维护。

Konva 把这些封装成保留模式的场景图：节点持续存在于树里，可以反复查询、修改、监听事件，就像操作 DOM 节点一样操作图形节点。开箱即带事件系统、拖拽、Transformer 变换器、补间动画、滤镜和序列化。官方框架绑定覆盖 React/Vue/Svelte/Angular，TypeScript 类型内置不用装 @types，这对选型评估非常友好。官方 About 页还列出了 Meta、Microsoft、Labelbox、Polotno 等生产使用者，作者 2014 年基于自己更早的 KineticJS 项目重写，持续维护到现在。

适用边界：需要点击、拖拽、缩放、旋转这类 UI 级交互的 2D 图形场景是首选——设计器、白板、标注工具、图表编辑器。纯展示或者游戏粒子高帧率场景，后面选型对比会详细讲。
-->

---

# 架构总览：四层场景树

```text
Stage（舞台，对应 DOM 容器）
 └─ Layer（图层 = 一个独立 <canvas> 元素）
     └─ Group（分组容器，不渲染，只批量管理/变换）
         └─ Shape（具体图形：Rect/Circle/Text/自定义…）
```

<v-clicks>

- 每个 **Layer** 内部两张画布：可见 canvas + 隐藏 hit canvas（命中检测专用）
- 多 Layer 拆分：背景/内容分层，更新只重绘变化的 Layer
- **保留模式**（retained mode）：节点持续存在，可反复查询/修改/监听
- 区别于原生 Canvas 的立即模式——画完即忘，无法二次修改单个图形

</v-clicks>

<!--
Konva 的场景树是一棵四层节点树，类比 DOM：Stage 舞台对应一个 DOM 容器，可含多个 Layer；每个 Layer 是一个独立的 canvas 元素；Layer 下面是 Group 分组容器，本身不渲染像素，只用来批量管理和变换子节点；最底层是 Shape，具体的图形。

关键细节：每个 Layer 内部其实维护两张画布，一张正常显示场景，一张隐藏的 hit graph 命中检测图，专门用来快速判断事件命中哪个节点，避免每次事件都做几何运算。

为什么要多 Layer：把很少变化的背景和频繁移动的元素分到不同 Layer，更新时只需要重绘变化的那个 Layer，不用重绘整个场景，这是 Konva 性能优化的第一原则，但代价是每个 Layer 都是真实 DOM canvas，数量本身也是开销，后面性能优化那页会展开。

这就是保留模式：节点持续存在于树中，可以反复查询、变换、监听事件、二次修改，而不用重新绘制整个画面，这跟原生 Canvas 画完就忘的立即模式是本质区别。
-->

---

# Stage 与 Layer：最小可用代码

```js
import Konva from 'konva';

const stage = new Konva.Stage({
  container: 'container', // DOM 容器 id
  width: 500,
  height: 500,
});

const layer = new Konva.Layer();
stage.add(layer);

const circle = new Konva.Circle({ x: 250, y: 250, radius: 70, fill: 'red' });
layer.add(circle); // 下一帧自动重绘
```

<div v-click class="mt-3 text-sm">

> Stage 浏览器端**必须**绑定 DOM 容器；点击坐标用 `stage.getPointerPosition()`（已处理 DPR/缩放），比手算 `clientX - rect.left` 更可靠。

</div>

<!--
来看第一个场景的骨架。先建 Stage，传入 container 也就是 DOM 元素 id 或引用、宽高；再建一个 Layer，用 stage.add 挂上去；然后创建一个 Circle 形状，设置位置、半径、填充，用 layer.add 加进 Layer。

add 之后 Konva 会在下一帧自动重绘，这是隐式的，但如果要手动多次修改属性，后面性能那页会讲到应该用 batchDraw 合批，而不是让它每次都触发一次重绘。

有两个记忆点。第一，Stage 在浏览器端场景下必须绑定一个 DOM 容器，不能省略，只有 Node.js 服务端渲染才不需要。第二，拿鼠标或触摸相对 Stage 的坐标，标准做法是 stage.getPointerPosition()，它已经处理好了设备像素比和缩放的换算，比自己算 clientX 减 canvas 的 boundingClientRect 更可靠。Konva.pixelRatio 还可以全局设置像素比，Retina 屏默认按设备像素比放大画布，设成 1 可以换性能。
-->

---

# Layer 与 Group

```js
const group = new Konva.Group({ draggable: true });
group.add(rect1, rect2); // 可一次性 add 多个节点
layer.add(group);

rect1.moveToTop();          // 只在其父容器内调整层级
shape.moveTo(anotherLayer); // 跨容器：Stage/Layer/Group 皆可
```

<v-clicks>

- **Layer**：独立 canvas，按"更新频率/渲染层次"切分场景（背景/内容/UI 层）
- **Group**：纯容器不渲染像素，统一 `draggable`/整组变换/`visible`
- 层级顺序：`zIndex()`、`moveToTop/Bottom()`、`moveUp/Down()`

</v-clicks>

<!--
Layer 和 Group 都是容器，但角色不同。

Layer 通过 stage.add 挂载，每个 Layer 都是独立的 canvas，适合按更新频率或者渲染层次切分场景，比如背景层、内容层、UI 覆盖层分开。

Group 本身不渲染任何像素，只是个容器，可以对整组节点统一设置 draggable、统一做旋转缩放变换、统一控制 visible 和 opacity。可以一次性 add 多个节点进去。

跨容器移动节点用 node.moveTo(newContainer)，容器可以是另一个 Stage、Layer 或者 Group，用来重组场景结构。

层级顺序也就是同一容器内的绘制顺序，用 zIndex、moveToTop、moveToBottom、moveUp、moveDown 控制，先绘制的在下层。
-->

---

# 内置形状与通用属性

官方 19 种内置形状（Shapes 分类）：

| 类别 | 形状 |
|---|---|
| 基础 | Rect / Circle / Ellipse / Line / Path |
| 文本图像 | Text / TextPath / Image / Sprite / Label |
| 几何 | RegularPolygon / Star / Ring / Arc / Wedge / Arrow |

<div v-click class="mt-3 text-sm">

通用属性：`x/y` `width/height` `fill/stroke/strokeWidth` `rotation` `scaleX/scaleY` `offsetX/offsetY` `opacity` `draggable` `visible/listening` `name/id`

</div>

<div v-click class="mt-2 text-sm">

Text 专属：`fontSize/fontFamily/align/wrap/ellipsis/lineHeight/padding` + 通用 `shadow*` 系列

</div>

<!--
Konva 内置了 19 种官方形状，分三类记：基础图形 Rect、Circle、Ellipse、Line、Path；文本和图像相关的 Text、TextPath、Image、Sprite、Label（带背景的文本标签）；还有一堆几何形状 RegularPolygon、Star、Ring、Arc、Wedge、Arrow。Rect 还支持 cornerRadius，可以传单个数字或者左上右上右下左下四个角分别设置的数组。

几乎所有 Shape 都共享一套通用属性：位置 x y，尺寸 width height（部分形状用专属属性比如 Circle 用 radius），填充描边，旋转角度，缩放，变换原点偏移 offsetX offsetY（这个后面易错点会细讲），透明度，是否可拖拽，显隐和是否参与事件，以及 name id 供选择器查找。

Text 形状还有一组扩展属性：字号字体对齐方式、换行、省略号、行高、内边距，再加上通用的阴影系列属性 shadowColor blur offset opacity。
-->

---

# 自定义 Shape：sceneFunc

```js
const triangle = new Konva.Shape({
  fill: '#00D2FF',
  stroke: 'black',
  strokeWidth: 4,
  sceneFunc(context, shape) {
    context.beginPath();
    context.moveTo(0, 50);
    context.lineTo(100, 50);
    context.lineTo(50, 0);
    context.closePath();
    context.fillStrokeShape(shape); // 委托样式，而非手动 fill()/stroke()
  },
});
```

<div v-click class="mt-2 text-sm">

官方五条最佳实践：① `sceneFunc` 高频调用逻辑要快 ② 不要产生副作用 ③ 复杂命中检测另定义 `hitFunc` ④ 位置变换交给 Konva ⑤ 样式统一走 `fillStrokeShape`

</div>

<!--
内置形状不够用时，用 Konva.Shape 加自定义绘制函数 sceneFunc。

代码里用原生 Canvas API 画一个三角形路径，beginPath、moveTo、lineTo、closePath 这套跟裸 Canvas 一样。关键的最后一行：用 context.fillStrokeShape(shape) 代替手动调 fill() 和 stroke()，这样 shape 的 fill、stroke、shadow 这些属性才会自动生效，如果自己调原生的 fill()，后续改 fill 属性就不生效了，这是后面易错点会提到的一个坑。

官方给了五条最佳实践：第一，sceneFunc 每秒可能被调用很多次，逻辑要够快；第二，避免在里面产生副作用比如修改外部状态；第三，命中检测复杂形状的时候应该额外定义一个独立的 hitFunc；第四，不要手动处理位置变换，交给 Konva 内部处理；第五，样式统一通过 fillStrokeShape 委托，不要自己调 context.fill()。
-->

---

# 节点操作与选择器

```js
layer.findOne('#myRect');        // 按 id（# 前缀），返回单个节点
layer.find('.myCircle');         // 按 name（. 前缀），返回数组
layer.find('Circle');            // 按类型名，返回该类型所有节点

node.clone({ x: 100 });          // 克隆并覆盖部分属性
node.destroy();                  // 销毁：从父容器移除并释放
node.getAttrs();                 // 读取全部配置属性
node.setAttrs({ x: 10, y: 20 }); // 批量设置属性
```

<div v-click class="mt-3 text-sm">

`find`/`findOne` 常用于"点击后批量操作同类节点"场景（如批量做动画）。

</div>

<!--
节点操作和选择器是 Konva 里"像操作 DOM 一样操作图形"这个心智模型最直接的体现。

findOne 按 id 查找，id 前面加井号，返回单个节点；find 按 name 查找，name 前面加点号，返回节点数组，可以批量操作；find 也支持直接传类型名不加前缀，比如 layer.find('Circle') 返回该 Layer 下所有 Circle 类型的节点。

节点还支持 clone 克隆，可以传参数覆盖部分属性；destroy 销毁节点，从父容器移除并释放，但注意如果这个节点还绑定在某个 Transformer 上，要先解绑，这是后面易错点会提到的坑；getAttrs 读取全部配置属性，setAttrs 批量设置。

find 和 findOne 最常见的用法场景是：用户点击之后，要对一批同类节点做统一操作，比如批量触发动画或者批量隐藏。
-->

---

# 事件系统

```js
circle.on('click', (evt) => {
  console.log('clicked', evt.target);
});
circle.on('mouseover mouseout', (evt) => { /* 空格分隔多事件同绑 */ });
```

<v-clicks>

- **鼠标**：click/dblclick/mouseover/mouseout/mousedown/mouseup/wheel…
- **触摸**（移动端自动支持）：tap/dbltap/touchstart/touchmove/touchend
- **指针**：pointerdown/pointermove/pointerup/pointerover…
- **拖拽/变换**：dragstart/dragmove/dragend、transformstart/transform/transformend
- 默认冒泡（子→父容器），`evt.cancelBubble = true` 阻止；`node.off('click')` 解绑

</v-clicks>

<!--
事件绑定用 node.on，支持空格分隔同时绑定多个事件类型，比如 mouseover mouseout 一次性绑两个。

事件族分四类。鼠标事件覆盖点击、双击、悬浮、按下抬起、滚轮。触摸事件在移动端自动支持，tap、双击 tap、触摸开始移动结束。指针事件是更现代统一的一套，pointerdown、pointermove 等。拖拽和变换事件是 Konva 特色，dragstart dragmove dragend，以及配合 Transformer 的 transformstart transform transformend。

事件默认从子节点冒泡到父容器，比如 Circle 冒泡到 Layer，想阻止就设 evt.cancelBubble 等于 true。解绑用 node.off，也支持事件委托，在 Layer 或 Stage 上监听，通过 evt.target 判断具体点击的是哪个子节点，这样不用给每个节点单独绑定事件。
-->

---

# 拖拽 Drag and Drop

```js
const rect = new Konva.Rect({ x: 50, y: 50, width: 100, height: 100, draggable: true });
rect.on('dragmove', () => console.log(rect.x(), rect.y()));

// 限制单方向拖拽——教程写法：dragmove 里直接改坐标
horizontalOnly.on('dragmove', function () { this.y(50); }); // 锁 y，只能水平拖

// 限制单方向拖拽——API 写法：dragBoundFunc（返回约束后的绝对坐标）
node.dragBoundFunc(function (pos) {
  return { x: this.absolutePosition().x, y: pos.y }; // 只允许垂直移动
});
```

<div v-click class="mt-2 text-sm">

`draggable: true` 自动同时开启桌面鼠标 + 移动端触摸拖拽，无需手写状态机。复杂约束（圆形/多边形区域、Stage 边界）都是在这两种回调里做数学判断。

</div>

<!--
拖拽是 Konva 的招牌能力之一。给节点设 draggable 为 true，就自动同时支持桌面鼠标拖拽和移动端触摸拖拽，不需要自己手写 mousedown mousemove mouseup 那套状态机。

限制拖拽方向有两种写法。教程页倾向的写法是在 dragmove 事件里直接改坐标，比如锁定 y 只能水平拖、锁定 x 只能垂直拖，这种更直观。API 参考页提供的是 dragBoundFunc，这是 Node 和 Stage 官方 API，专门为拖拽约束设计，它接收试图到达的绝对坐标，返回被约束后的绝对坐标，示例里只允许垂直移动。这两种方式文档里都有，复杂约束比如限制在圆形区域内、限制在 Stage 边界内，都是在这两种回调里做数学判断。
-->

---

# 变换器 Transformer：基础用法

```js
const tr = new Konva.Transformer({
  nodes: [rect],           // 绑定要变换的节点，也可 tr.nodes([rect]) 动态设置
  rotateEnabled: true,
  enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
});
layer.add(tr);
// 官方推荐的选中/取消/多选范式
stage.on('click tap', (e) => {
  if (e.target === stage) { tr.nodes([]); return; }         // 点空白取消选中
  const isSelected = tr.nodes().includes(e.target);
  const metaPressed = e.evt.shiftKey || e.evt.ctrlKey;
  if (metaPressed && !isSelected) tr.nodes([...tr.nodes(), e.target]); // 多选
  else if (!metaPressed) tr.nodes([e.target]);
});
```

<!--
Transformer 是 Konva 同类库里最省心的一块能力，开箱即用的缩放旋转交互。用法很简单：new Konva.Transformer，传 nodes 数组绑定要变换的节点，也可以之后动态调 tr.nodes() 重新设置。rotateEnabled 开关旋转手柄，enabledAnchors 可以只显示部分控制点，比如只要四个角不要边中点。

下半部分是官方推荐的选中交互范式，设计器类应用的标准写法：在 Stage 上监听 click 和 tap，如果点击目标就是 Stage 本身，说明点了空白处，清空选中数组；否则判断当前点击的节点是不是已经在选中集合里；再判断有没有按住 Shift 或者 Ctrl，如果按住且未选中就往选中数组里追加，实现多选；如果没按住修饰键就直接替换选中集合为当前这一个节点。这套 target===stage 判空白、shiftKey/ctrlKey 判多选的组合，是 Konva 设计器类应用的标准选中交互模型。
-->

---

# Transformer 必考坑：scale 不是 size

<div class="text-lg font-bold text-red-500 mb-2">

关键机制：Transformer 缩放改变的是 `scaleX`/`scaleY`，不是 `width`/`height`！

</div>

```js
// 业务依赖真实像素宽高时，需在 transformend 里手动换算并重置 scale
rect.on('transformend', () => {
  rect.width(rect.width() * rect.scaleX());
  rect.height(rect.height() * rect.scaleY());
  rect.scaleX(1);
  rect.scaleY(1);
});
```

<v-clicks>

- `boundBoxFunc(oldBox, newBox)`：限制缩放/旋转后的边界框，返回 `oldBox` 即拒绝本次变换
- `anchorDragBoundFunc`：锚点吸附对齐（如设计器辅助线）；`rotationSnaps`：旋转角度吸附数组
- `centeredScaling`：居中缩放（双侧同时变化），或按住 ALT 临时触发

</v-clicks>

<!--
这是 Transformer 最容易踩的坑，也是高频考点。拖拽 Transformer 手柄缩放之后，width 和 height 的值是不变的，变化的是 scaleX 和 scaleY。如果业务逻辑直接读 width 去计算布局，会拿到错误的视觉尺寸。

解决方式是在 transformend 事件里手动换算：真实宽度等于 width 乘以 scaleX，真实高度等于 height 乘以 scaleY，换算完之后把 scaleX 和 scaleY 都重置回 1，这样下次再读 width/height 就是准确的像素值了。

Transformer 还有几个进阶能力。boundBoxFunc 接收旧的和新的边界框，可以限制缩放或者旋转之后的边界框范围，比如限制最大最小尺寸，返回 oldBox 就等于拒绝这次变换。anchorDragBoundFunc 用来做锚点吸附对齐，比如靠近参考线 10 像素内自动吸附，这是设计器辅助线的实现方式。rotationSnaps 设置一个角度数组，让旋转的时候自动吸附到这些角度，比如 0、90、180、270。centeredScaling 打开后是居中缩放，双侧同时变化，或者按住 ALT 临时启用这个效果。
-->

---

# 动画：Animation 与 Tween

```js
// Konva.Animation：帧循环，适合复杂计算（轨迹/物理）
const anim = new Konva.Animation((frame) => {
  const angle = (frame.time * 2 * Math.PI) / 4000; // frame.time 毫秒数
  rect.x(200 + 100 * Math.cos(angle));
}, layer); // 第二参数传 layer，自动重绘
anim.start();

// Konva.Tween：声明式补间，适合"到某个状态"的过渡
const tween = new Konva.Tween({ node: circle, duration: 2, x: 300, easing: Konva.Easings.EaseInOut });
tween.play();
circle.to({ x: 300, duration: 1 }); // 单属性快捷动画，内部基于 Tween
```

<div v-click class="mt-2 text-sm">

`Konva.Easings`：Linear/EaseIn·Out·InOut/Back/Elastic/Bounce。Tween 还支持 `pause/reverse/seek/finish/reset`。update 回调**只应改属性**，不要手动调 `layer.draw()`。

</div>

<!--
Konva 提供两套动画机制。Konva.Animation 是帧循环，适合需要每帧自己算复杂轨迹或者物理效果的场景，回调参数 frame 带 time 总经过毫秒数、timeDiff 距上一帧毫秒数、frameRate 当前帧率，第二个参数传 layer 或者 layer 数组，动画引擎会自动重绘它们，start 和 stop 控制启停。官方强调 update 函数只应该修改节点属性，重绘交给动画引擎自动处理，不要在回调里手动调 layer.draw()。

Konva.Tween 是声明式补间，更适合"从当前状态过渡到某个目标状态"这种场景，传 node、duration（单位秒）、要变化的属性、easing 缓动函数，play 播放，还支持 pause 暂停、reverse 反向、seek 跳到某个进度、finish 直接跳到结束、reset 重置。node.to() 是基于 Tween 的单属性快捷写法。

Konva.Easings 提供线性、缓入缓出缓入缓出、回弹 Back、弹性 Elastic、弹跳 Bounce 这些常用缓动族。
-->

---

# 滤镜 Filters

```js
image.cache();                          // 第一步：必须先 cache
image.filters([Konva.Filters.Blur]);    // 第二步：应用滤镜数组
image.blurRadius(10);
```

<v-clicks>

- 可用滤镜：Blur/Brighten/Contrast/Grayscale/Invert/HSL/HSV/RGB/Emboss/Sepia/Solarize/Kaleidoscope/Pixelate/Noise/Threshold + Custom/Mask，支持多滤镜叠加
- 滤镜是**像素级操作**，开销大，务必配合 `cache()`
- 参数频繁变化可用 Tween 做平滑过渡（Filter Tweening）

</v-clicks>

<!--
滤镜使用固定两步。第一步必须先调 cache()，把节点缓存成位图，不 cache 直接设 filters 不会生效或者报错。第二步用 filters 传入一个滤镜数组，可以叠加多个，比如这里是 Blur，再配合 blurRadius 设置模糊半径。

官方滤镜列表覆盖模糊、提亮、对比度、灰度、反色、HSL、HSV、RGB、浮雕、复古棕褐、曝光过度、万花筒、像素化、噪点、阈值，还有自定义滤镜和遮罩，支持在数组里叠加多个一起用。

关键提醒：滤镜是像素级操作，性能开销大，一定要配合 cache() 使用。如果 cache 之后又改了影响视觉的属性，比如换了图片源，需要先 clearCache() 再重新 cache()。如果滤镜参数需要频繁变化又想要平滑效果，可以用 Tween 对滤镜参数做补间过渡，文档里叫 Filter Tweening。
-->

---

# 序列化与导出

```js
const json = stage.toJSON();                              // 序列化整棵场景树
const stage2 = Konva.Node.create(json, 'container-id');    // 反序列化重建

const dataURL = stage.toDataURL({ pixelRatio: 2 });        // 导出图片
stage.toImage({ callback(img) { /* 拿到 HTMLImageElement */ } });
```

<div v-click class="mt-3 text-sm">

> **官方明确不建议**用 `toJSON`/`Node.create` 做复杂应用的存档方案（视觉与业务数据强耦合，难做版本迁移）。推荐"业务状态驱动"：只存必要数据，写 `create(state)` 全量重建 + `update(state)` 增量更新两个函数。`toDataURL`/`toImage` 则是导出图片的正规方法，与存档是两回事。

</div>

<!--
序列化 API 很直接。stage.toJSON() 序列化整棵场景树成字符串，Konva.Node.create 传入这个 json 和容器 id 可以反序列化重建整个场景。导出图片用 toDataURL，可以传 pixelRatio 提升导出分辨率，或者 toImage 拿到一个 HTMLImageElement 对象，回调里处理。

但是官方 Best Practices 页明确不推荐大型应用直接依赖 toJSON 和 Node.create 做存档方案，理由是这样容易把视觉细节和业务数据耦合在一起，难以做版本迁移。推荐的模式是应用状态驱动：只持久化必要的业务数据，比如一组坐标，然后写两个函数分层处理，create(state) 从状态重建整棵树、加载图片、绑定事件，update(state) 只更新属性，只有数量变化的时候才重建节点。

要分清楚两个场景：toDataURL 和 toImage 是导出图片场景的正规方法，跟做存档是两回事，不要混为一谈。
-->

---

# React 集成：react-konva

安装：`npm install react-konva konva --save`

```jsx
import { Stage, Layer, Rect } from 'react-konva';
function App() {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  return (
    <Stage width={800} height={600}>
      <Layer>
        <Rect
          x={pos.x} y={pos.y} width={100} height={100} draggable
          onDragEnd={(e) => setPos({ x: e.target.x(), y: e.target.y() })} // 必须同步回 state
        />
      </Layer>
    </Stage>
  );
}
```

<!--
react-konva 官方称自己是"最流行的 React canvas 图形库"。所有内置形状都映射成同名 React 组件，Rect、Circle、Line、Text、Image、Star 等等，props 就是 Konva 属性，完整支持事件 props 比如 onClick、onDragEnd。

代码示例：从 react-konva 引入 Stage、Layer、Rect，用 State 管理位置，draggable 打开拖拽。用 useRef 还能拿到节点的真实 Konva 实例，ref.current 就是原生 Konva.Rect 对象，可以直接调用原生方法。

关键点在最后一行：onDragEnd 里必须把新坐标同步回 state，下一页会展开说为什么，这是新手最容易踩的坑之一。react-konva 只支持浏览器环境，官方声明不支持 React Native。
-->

---

# react-konva 坑与 Strict Mode

<div class="text-base font-bold text-red-500 mb-2">

draggable + 受控 x/y props，却不写 onDragEnd/onDragMove → 拖拽后被"弹回"

</div>

<v-clicks>

- 拖拽只改了 Konva 内部节点位置，React state 并不知情
- 下次渲染会把节点强制拉回 props 指定的旧坐标
- react-konva 官方会在控制台打印明确警告

</v-clicks>

```jsx
import { useStrictMode } from 'react-konva';
useStrictMode(true); // 每次渲染强制把节点属性同步为 render 函数给出的值
```

<div v-click class="mt-2 text-sm">

用于排查"命令式改节点 vs 声明式 props"混用时的不同步问题；内部非 `autoDrawEnabled` 场景靠 `batchDraw()` 合并多次更新。

</div>

<!--
这一页专门讲 react-konva 最高频的坑。如果 Rect 同时设置了 draggable 和受控的 x、y props，却没有绑定 onDragEnd 或者 onDragMove 去更新 state，拖拽结束之后下一次 React 渲染，会把节点强制拉回 props 里指定的旧坐标，因为拖拽只改变了 Konva 内部节点的实际位置，React state 并不知道这件事发生过。react-konva 官方会在控制台打印明确的警告文案提示这个问题，这是新手最容易踩的坑。解决办法上一页已经看到了，onDragEnd 里把新坐标同步回 state。

另外一个进阶开关是 useStrictMode，从 react-konva 引入，调用 useStrictMode(true) 之后，每次渲染都会强制把 Konva 节点的属性同步为 render 函数给出的值，用来在命令式修改节点和声明式 props 混用的场景下，排查节点状态和 React state 不一致的问题。

内部性能优化上，react-konva 在非 autoDrawEnabled 场景下也是靠 batchDraw() 把多次属性更新合并成一次重绘，减少 Layer 和 Stage 的重复绘制次数。
-->

---

# Vue 集成：vue-konva

```vue
<template>
  <v-stage :config="stageSize">
    <v-layer>
      <v-rect :config="rectConfig" @dragend="onDragEnd" />
    </v-layer>
  </v-stage>
</template>

<script setup>
const rectConfig = ref({ x: 50, y: 50, width: 100, draggable: true });
function onDragEnd(e) { rectConfig.value.x = e.target.x(); rectConfig.value.y = e.target.y(); }
</script>
```

<v-clicks>

- 组件前缀统一 `v-`：`v-stage`/`v-layer`/`v-rect`/`v-transformer`… 仅支持 **Vue 3**
- 配置走单一 `:config` 对象（非拆分 props），事件用原生 `@事件名`
- `vue-konva@3.4.0`（当前 npm 实测），peer 要求 `vue: ^3`

</v-clicks>

<!--
本仓库技术栈是 Vue 3，所以也看一下 Vue 官方绑定 vue-konva。

模板部分组件前缀统一是 v-，v-stage、v-layer、v-rect、v-circle 等等，只支持 Vue 3，不支持 Vue 2。跟 React 版本不一样，vue-konva 的配置是通过单一的 :config 对象传入，而不是把每个属性拆成独立的 prop；事件绑定用 Vue 原生的 @事件名语法，比如这里的 @dragend，回调参数就是原生 Konva 事件对象。

脚本部分跟 react-konva 逻辑一样，拖拽结束要把新坐标同步回响应式的 rectConfig，不然也会有状态不同步的问题。

版本上，当前 npm 实测 vue-konva 是 3.4.0，peerDependencies 要求 konva 大于 7、vue 3 主线。注册方式有两种，全局注册用插件形式 app.use(VueKonva) 上手快，或者按需引入单个组件减小包体积。
-->

---

# 性能优化

官方总纲：**尽量少计算、尽量少绘制**

<v-clicks>

- **Stage 级**：控制尺寸；Retina 屏 `Konva.pixelRatio = 1` 换性能
- **Layer 级**：**尽量减少数量**（每个都是独立 canvas，本身有开销）；`listening(false)`
- **Shape 级**：复杂形状 `cache()`；不可见 `visible(false)`；`perfectDrawEnabled(false)`；`hitStrokeWidth` 单独控制命中描边宽度
- **缓存四原则**：简单无滤镜形状不缓存 / 勿滥用吃内存 / 优先缓存 Group 整体 / 务必实测帧率
- **批量绘制** `layer.batchDraw()`；**内存**主动 `destroy()` 释放

</v-clicks>

<!--
Konva 性能优化官方两条总纲：尽量少计算、尽量少绘制。分几个层级记。

Stage 级：控制 Stage 尺寸不要过大，Retina 屏可以把 Konva.pixelRatio 设成 1 换性能，代价是清晰度下降。

Layer 级：核心是尽量减少 Layer 数量，因为每个 Layer 都是独立 canvas DOM 元素，本身就有创建和内存开销，不需要交互的 Layer 调 listening(false)。拖拽时还可以把当前拖拽的节点临时移到专用 Layer，结束再移回，避免拖拽期间重绘整个复杂场景。

Shape 级：复杂形状用 shape.cache() 缓存成位图；视口外或者不可见的直接 visible(false)；有 fill 加 stroke 加 opacity 组合的可以关掉 perfectDrawEnabled 换性能；hitStrokeWidth 可以单独设置命中检测用的描边宽度，默认跟 strokeWidth 一致。

缓存有四条官方原则：没有滤镜的简单形状不要缓存，直接画可能更快；缓存会为每个节点多开辟一块 canvas 缓冲区，滥用吃内存；优先对一组形状整体 cache 一个 Group，而不是逐个 cache；一定要实测启用和禁用缓存的帧率差异，不能凭感觉优化。

最后，批量修改属性后统一调 layer.batchDraw() 合批重绘；不再使用的节点和 Tween 要主动 destroy()，避免长期运行的页面内存泄漏。
-->

---

# 易错点合集（未尽坑）

<v-clicks>

- **Offset 与位置耦合**：`offsetX/offsetY` 决定旋转/缩放原点，但改动会连带改变显示位置——不是"只影响旋转中心"
- **Stage 缩放后取坐标**：`getPointerPosition()` 是相对 Stage 的坐标；Stage 本身 `scale()` 过时，子节点真实坐标要用 `getRelativePointerPosition()`
- **v9→v10 Node.js 不兼容**：v10 移除自动后端探测，升级后必须显式 `import 'konva/canvas-backend'`
- **Transformer 未解绑就销毁**：`node.destroy()` 前若仍在 `tr.nodes()` 里，需先 `tr.nodes([])`
- **细线难点中**：`hitStrokeWidth` 默认等于 `strokeWidth`，交互场景常需手动调大（如设为 20）

</v-clicks>

<!--
最后汇总几个前面没有展开讲的高频坑。

第一，offset 和位置是耦合的。offsetX offsetY 本意是决定旋转和缩放的原点，但是改动 offset 之后节点的视觉位置也会跟着变，因为绘制起点变了。常见误解是以为 offset 只影响旋转中心不影响显示位置，实际上调完 offset 往往需要连带调整 x y。

第二，getPointerPosition 拿到的是相对 Stage 的坐标，已经处理好缩放。但如果 Stage 本身做过 scale，比如白板类应用做整体视口缩放平移，子节点的真实坐标需要再做一次逆变换，这时候要用 getRelativePointerPosition，直接拿 getPointerPosition 当作已缩放场景内的坐标会错位。

第三，v9 升级到 v10 的项目，原本 Node.js 环境下 npm install konva 后端直接可用的代码，原样升级会报错或者静默失效，因为 v10 移除了自动后端探测，必须显式导入 canvas-backend 或者 skia-backend。

第四，node.destroy() 之前，如果这个节点还绑定在某个 Transformer 的 nodes 数组里，需要先 tr.nodes([]) 清空或者移除，否则 Transformer 可能引用到已销毁的节点导致报错。

第五，细线条默认很难点中，因为 hitStrokeWidth 默认是 auto 也就是等于 strokeWidth，图表连线类交互常常需要手动调大，比如设成 20，让细线也容易点中，这个很容易被忽略。
-->

---

# 选型对比：vs Fabric / PixiJS / 原生 Canvas

| 维度 | Konva | Fabric.js | PixiJS | 原生 Canvas |
|---|---|---|---|---|
| 底层渲染 | 2D Canvas | 2D Canvas | WebGL(可回退) | 2D Canvas |
| 渲染模式 | 保留模式 | 保留模式 | 保留模式 | 立即模式 |
| 变换交互 | Transformer 开箱即用 | 内置控制点 | 需自行实现 | 需完全手写 |
| 性能上限 | 中（数千形状） | 中，与 Konva 接近 | 高（GPU 海量精灵） | 视实现而定 |
| 官方定位 | 交互式 UI/编辑器 | 图像处理更强 | 游戏/高帧率动画 | 最大自由度 |

<div v-click class="mt-3 text-sm">

**决策速览**：设计器/白板/标注工具（点选拖拽缩放）→ **Konva**；图像合成/滤镜编辑 → Fabric；海量精灵/游戏/GPU 特效 → PixiJS；一次性静态绘制无需交互 → 原生 API。

</div>

<!--
最后做个选型对比，综合官方 FAQ 页的观点。

底层渲染上，Konva、Fabric、原生 Canvas 都是 2D Canvas API，PixiJS 是 WebGL，可以回退 Canvas。渲染模式上，Konva、Fabric、PixiJS 都是保留模式，节点持久存在可以反复查改；原生 Canvas 是立即模式，画完就忘。

变换交互是 Konva 最大的差异化优势，Transformer 开箱即用覆盖缩放旋转多选；Fabric 也有内置控制点，交互模型类似但定制性不同；PixiJS 没有内置，需要自己实现或者用第三方插件；原生 Canvas 需要完全手写。

性能上限上，Konva 是中等水平，数千形状级别，靠分层加缓存优化；Fabric 和 Konva 量级接近；PixiJS 因为是 GPU 加速，适合海量精灵和粒子，性能上限最高；原生 Canvas 取决于手写实现质量。

选型建议记一句话：需要设计器、白板、标注工具这类用户要点选拖拽缩放旋转已有图形的场景，选 Konva，Transformer 是这条路上最省心的差异化能力；需要做图像合成滤镜这种偏 Photoshop 式操作，Fabric 也是同量级候选；需要成百上千高频动画精灵、游戏渲染、GPU 特效，选 PixiJS；只是画一次性静态图表不需要后续交互，原生 Canvas API 足够，引入 Konva 反而是不必要的抽象开销。
-->

---
layout: intro
---

# 总结

Konva = **把 DOM 树 + 事件模型搬进 Canvas 的声明式 2D 场景图框架**

- 四层树：Stage → Layer → Group → Shape，保留模式可反复查改
- 开箱即带：事件/拖拽/`Transformer`（scale≠size）/Tween/滤镜/序列化
- react-konva / vue-konva 官方绑定；性能靠少 Layer + 合理 cache
- 选型：UI 交互编辑首选 Konva；游戏海量精灵选 PixiJS；一次性绘制用原生 API
- 2026：v10.3，Node.js 渲染需显式 `canvas-backend`/`skia-backend`

<!--
总结一下。

Konva 是把 DOM 树和事件模型搬进 Canvas 的声明式 2D 场景图框架。核心心智是四层树：Stage、Layer、Group、Shape，保留模式让节点持续存在、可以反复查询修改，这是它跟原生 Canvas 立即模式的根本区别。

开箱即带一整套交互能力：事件系统、拖拽、Transformer 变换器——记住它缩放改的是 scale 不是 size 这个必考坑、Tween 补间动画、滤镜、序列化。

框架集成上，react-konva 是最流行的 React canvas 图形库；vue-konva 对应本仓库的 Vue 3 技术栈。性能优化两条纲领是尽量少计算尽量少绘制，具体抓手是控制 Layer 数量和合理使用 cache。

选型上记一句话：需要点选拖拽缩放这类 UI 级交互的编辑器场景首选 Konva；游戏海量精灵高帧率选 PixiJS；一次性静态绘制不需要交互用原生 Canvas API 就够了。

版本现状：2026 年当前是 v10.3，Node.js 服务端渲染从 v10 起需要显式导入 canvas-backend 或者 skia-backend，不再自动探测。谢谢大家。
-->
