---
theme: seriph
layout: cover
title: Three.js 入门
info: |
  从真实可交互场景出发，理解 Three.js 的场景图、渲染循环、材质光照与性能边界。

  Learn more at [https://threejs.org](https://threejs.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-axis" aria-hidden="true">
  <span class="axis-x">X</span>
  <span class="axis-y">Y</span>
  <span class="axis-z">Z</span>
  <div class="wire-cube"><i></i><b></b></div>
</div>

# Three.js

## 用场景、相机与材质构建浏览器 3D

<div class="cover-meta">
  <span>r185</span>
  <span>WebGL · WebGPU · glTF · TSL</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://threejs.org/docs/" target="_blank" class="slidev-icon-btn" aria-label="Three.js 文档">
    <carbon:document />
  </a>
  <a href="https://github.com/mrdoob/three.js" target="_blank" class="slidev-icon-btn" aria-label="Three.js GitHub">
    <carbon:logo-github />
  </a>
</div>

<!--
Three.js 不是“把模型放进网页”这么简单，它是一套实时渲染系统。我们会先操作真实场景，再把屏幕上的每个结果映射回场景图、相机、材质、光照和渲染循环。

本内容基于 r185，WebGLRenderer 仍是成熟主线，WebGPURenderer 与 TSL 是需要逐步理解的新路线。
-->

---
layout: default
---

# Three.js 替你管理了哪一层复杂度

<div class="abstraction mt-6">
  <div class="layer app">
    <span>你的应用</span>
    <strong>场景交互 · 数据 · UI</strong>
  </div>
  <carbon:arrow-down />
  <div v-click class="layer three">
    <span>Three.js</span>
    <strong>Scene · Camera · Mesh · Material · Loader</strong>
  </div>
  <carbon:arrow-down />
  <div v-click class="layer gpu">
    <span>浏览器图形 API</span>
    <strong>WebGL / WebGPU</strong>
  </div>
  <carbon:arrow-down />
  <div v-click class="layer hardware">
    <span>GPU</span>
    <strong>缓冲、着色器、光栅化</strong>
  </div>
</div>

<div class="grid grid-cols-3 gap-4 mt-7">
  <div v-click class="fact"><strong>它是渲染库</strong><span>不内建完整物理、关卡与联网系统</span></div>
  <div v-click class="fact"><strong>它保留底层入口</strong><span>需要时仍可写 shader 与后处理</span></div>
  <div v-click class="fact"><strong>它以场景图组织对象</strong><span>父子变换沿树传播</span></div>
</div>

<!--
裸 WebGL 要自己管理缓冲、矩阵、着色器和资源生命周期。Three.js 把这些能力组织成场景图和可组合对象，同时保留自定义 shader 的出口。

[click:3] 但它仍然是渲染库，不是包含物理、关卡编辑器和游戏规则的全功能引擎。理解边界有助于正确选型。
-->

---
layout: default
class: scene-lab
---

# 先动手：每个控件都对应一个渲染概念

<ThreeSceneDemo />

<!--
请先拖动模型、滚轮缩放，再依次改变速度、粗糙度、主光、颜色与线框。暂停按钮只停止模型旋转，OrbitControls 仍可操作。

底栏显示 renderer.info 的真实 draw call 与三角形数量。后面的所有概念都会回到这个场景中解释，而不是停留在 API 名词。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[86px_1fr]
---

# 最小场景：五个对象完成第一帧

::left::

```ts {1-2|4-5|7-8|10-12|14|all}
import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: "#4fd1c5" });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.render(scene, camera);
```

::right::

<div class="first-frame mt-1">
  <div v-click class="frame-node scene"><carbon:folder /> Scene<span>装什么</span></div>
  <div v-click class="frame-node camera"><carbon:view /> Camera<span>从哪里看</span></div>
  <div v-click class="frame-node mesh"><carbon:3d-cursor /> Mesh<span>形状 + 外观</span></div>
  <div v-click class="frame-node renderer"><carbon:screen /> Renderer<span>画到 canvas</span></div>
  <div v-click class="frame-output">第一帧像素</div>
</div>

<!--
最小场景只有五个角色：Scene 是容器，Camera 定义视锥，Geometry 存顶点，Material 决定表面如何响应光，Mesh 把前两者组合，Renderer 最后生成像素。

[click:5] 注意 MeshStandardMaterial 需要光照才能看见。这个最小片段为了聚焦结构省略了光，真实项目应加灯或暂用 MeshBasicMaterial。
-->

---
layout: default
---

# 场景图：局部坐标沿父子关系传播

<div class="scene-graph mt-4">
  <div class="graph-node root"><carbon:network-3 /> Scene</div>
  <div class="graph-rail"></div>
  <div class="graph-children">
    <div class="graph-branch">
      <div v-click class="graph-node group">Group: car</div>
      <div class="branch-line"></div>
      <div class="leaf-row">
        <div v-click class="graph-node leaf">body</div>
        <div v-click class="graph-node leaf">wheel FL</div>
        <div v-click class="graph-node leaf">wheel FR</div>
      </div>
    </div>
    <div class="graph-branch compact">
      <div v-click class="graph-node camera">Camera</div>
    </div>
    <div class="graph-branch compact">
      <div v-click class="graph-node light">Light</div>
    </div>
  </div>
</div>

<div class="grid grid-cols-3 gap-4 mt-7">
  <div v-click class="fact"><strong>局部变换</strong><span>子节点 position 相对父节点</span></div>
  <div v-click class="fact"><strong>整体控制</strong><span>移动 car，车身与车轮一起走</span></div>
  <div v-click class="fact"><strong>世界坐标</strong><span>需要时用 `getWorldPosition()` 查询</span></div>
</div>

<!--
场景图不是普通数组，而是一棵变换树。车轮的位置相对于 car 组；移动或旋转 car，所有子节点一起变化。

[click:5] Camera 和 Light 同样是 Object3D，可以加入任意层级。
[click:3] 组织层级时按“谁应该一起运动”分组。要读取最终坐标，用世界矩阵相关 API，而不是只看局部 position。
-->

---
layout: default
---

# 渲染循环：用时间推进，而不是用帧数猜速度

````md magic-move {at:1}
```ts
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
```

```ts
const clock = new THREE.Clock();

renderer.setAnimationLoop(() => {
  const delta = Math.min(clock.getDelta(), 0.05);
  cube.rotation.y += delta * radiansPerSecond;
  controls.update();
  renderer.render(scene, camera);
});
```
````

<div class="grid grid-cols-3 gap-4 mt-6">
  <div v-click class="fact"><strong>`delta`</strong><span>不同刷新率保持相同运动速度</span></div>
  <div v-click class="fact"><strong>上限截断</strong><span>标签页恢复时避免一步跳太远</span></div>
  <div v-click class="fact"><strong>`setAnimationLoop`</strong><span>统一普通渲染与 WebXR 会话</span></div>
</div>

<!--
每帧加固定角度会让 144Hz 屏幕比 60Hz 屏幕转得更快。正确做法是用 delta 乘以每秒速度。

[click:3] delta 做合理上限可以防止页面暂停后恢复时模型瞬移。Three.js 推荐使用 renderer.setAnimationLoop，尤其是考虑 WebXR 的应用。
-->

---
layout: two-cols-header
layoutClass: gap-x-10 grid-rows-[86px_1fr]
---

# 两种相机，两种空间叙事

::left::

<div class="camera-demo perspective">
  <div class="camera-icon"><carbon:view /></div>
  <div class="frustum"></div>
  <div class="objects"><i></i><i></i><i></i></div>
</div>

### PerspectiveCamera

- 近大远小，有真实纵深
- 核心参数：`fov`、`aspect`、`near`、`far`
- 适合产品 3D、游戏、空间漫游

::right::

<div class="camera-demo orthographic">
  <div class="camera-icon"><carbon:view /></div>
  <div class="frustum"></div>
  <div class="objects"><i></i><i></i><i></i></div>
</div>

### OrthographicCamera

- 远近尺寸不变，没有透视缩小
- 核心参数：`left/right/top/bottom`
- 适合 CAD、地图、2.5D 与 UI 覆盖层

<div v-click class="col-span-2 callout mt-3">调整画布尺寸后，两种相机都要更新投影参数并调用 `updateProjectionMatrix()`。</div>

<!--
透视相机模拟眼睛和摄影机，正交相机保持平行投影。两者不是画质等级，而是不同空间表达。

[click] 响应式页面必须同步相机和 renderer 尺寸。只改 canvas CSS 会拉伸像素；要更新相机投影矩阵并调用 renderer.setSize。
-->

---
layout: default
---

# `Mesh = Geometry + Material`

<div class="mesh-equation mt-5">
  <div class="equation-term geometry">
    <carbon:3d-curve-auto-vessels />
    <strong>Geometry</strong>
    <span>顶点、法线、UV、索引</span>
  </div>
  <b>+</b>
  <div class="equation-term material">
    <carbon:color-palette />
    <strong>Material</strong>
    <span>颜色、粗糙度、贴图、着色</span>
  </div>
  <b>=</b>
  <div class="equation-term mesh">
    <carbon:cube />
    <strong>Mesh</strong>
    <span>可放进场景图的对象</span>
  </div>
</div>

<table class="material-table mt-7">
  <thead><tr><th>材质</th><th>光照</th><th>典型用途</th><th>成本</th></tr></thead>
  <tbody>
    <tr v-click><td><code>MeshBasicMaterial</code></td><td>不需要</td><td>标记、调试、纯色 UI</td><td>低</td></tr>
    <tr v-click><td><code>MeshStandardMaterial</code></td><td>需要</td><td>通用 PBR，推荐默认</td><td>中</td></tr>
    <tr v-click><td><code>MeshPhysicalMaterial</code></td><td>需要</td><td>清漆、透射、虹彩等高级外观</td><td>高</td></tr>
  </tbody>
</table>

<!--
Geometry 决定表面在哪里，Material 决定表面如何着色，Mesh 把二者组合后才是场景对象。

[click:3] Basic 不参与光照，适合调试；Standard 是性能和真实感平衡较好的 PBR 默认材质；Physical 增加高级光学效果，也增加 shader 成本。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[86px_1fr]
---

# 光照与阴影：阴影需要三处同时开启

::left::

```ts {1|3-4|6-7|9-10|all}
renderer.shadowMap.enabled = true;

keyLight.castShadow = true;
scene.add(keyLight);

mesh.castShadow = true;
scene.add(mesh);

floor.receiveShadow = true;
scene.add(floor);
```

<div v-click class="signal signal-warn mt-4">
  <carbon:warning-alt />
  <span>扩大 shadow camera 或提高贴图尺寸都会增加成本。</span>
</div>

::right::

<div class="light-stage">
  <div class="light-source"><carbon:light /> DirectionalLight</div>
  <div class="light-rays"><i></i><i></i><i></i></div>
  <div class="lit-object">Mesh</div>
  <div class="shadow-shape"></div>
  <div class="floor-line">receiveShadow</div>
</div>

<div class="grid grid-cols-2 gap-3 mt-4">
  <div v-click class="mini-rule"><strong>环境基底</strong><span>HemisphereLight / IBL</span></div>
  <div v-click class="mini-rule"><strong>方向与层次</strong><span>Directional / Point / Spot</span></div>
</div>

<!--
阴影不是灯光的自动副产品。renderer 要开启 shadowMap，光源和投影对象设置 castShadow，接收表面设置 receiveShadow，少一处都看不到。

[click:3] 实践中先用环境光或环境贴图建立基底，再用方向光塑造层次。阴影相机范围越大，有效分辨率越低；只覆盖真正需要的区域。
-->

---
layout: default
---

# 纹理最常见的 bug，不在图片，而在色彩语义

<div class="texture-pipeline mt-5">
  <div class="texture-file color"><span>baseColor.jpg</span><strong>sRGB 数据</strong></div>
  <carbon:arrow-right />
  <div v-click class="texture-setting"><code>texture.colorSpace = THREE.SRGBColorSpace</code></div>
  <carbon:arrow-right />
  <div v-click class="texture-render">线性空间参与光照<br><strong>正确显示</strong></div>
</div>

<div class="texture-pipeline mt-5">
  <div class="texture-file data"><span>normal.png</span><strong>非颜色数据</strong></div>
  <carbon:arrow-right />
  <div v-click class="texture-setting"><code>默认 NoColorSpace</code></div>
  <carbon:arrow-right />
  <div v-click class="texture-render">直接作为向量 / 数值<br><strong>不要做 sRGB 转换</strong></div>
</div>

<div class="grid grid-cols-3 gap-4 mt-7">
  <div v-click class="fact"><strong>颜色贴图</strong><span>baseColor、emissive 标记 sRGB</span></div>
  <div v-click class="fact"><strong>数据贴图</strong><span>normal、roughness、metalness 保持默认</span></div>
  <div v-click class="fact"><strong>glTF</strong><span>GLTFLoader 会按规范配置颜色空间</span></div>
</div>

<!--
颜色贴图存的是给人看的 sRGB 数据，进入光照计算前要转换到线性空间。法线、粗糙度等数据贴图则保存数值，不能做颜色转换。

[click:6] 手工加载纹理时要显式标记颜色贴图。使用 GLTFLoader 时，加载器会按 glTF 规范完成相应设置，不要再次随意覆盖。
-->

---
layout: default
---

# glTF 管线：模型进入浏览器前，优化已经开始

<div class="asset-pipeline mt-6">
  <div class="asset-step"><span>01</span><strong>DCC</strong><small>Blender / Maya</small></div>
  <carbon:arrow-right />
  <div v-click class="asset-step"><span>02</span><strong>glTF / GLB</strong><small>PBR、骨骼、动画</small></div>
  <carbon:arrow-right />
  <div v-click class="asset-step"><span>03</span><strong>压缩</strong><small>Draco / Meshopt / KTX2</small></div>
  <carbon:arrow-right />
  <div v-click class="asset-step"><span>04</span><strong>GLTFLoader</strong><small>异步加载与解码</small></div>
  <carbon:arrow-right />
  <div v-click class="asset-step"><span>05</span><strong>Scene</strong><small>复用、动画、交互</small></div>
</div>

```ts {1-2|4-7|9-10|all}
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
const gltf = await loader.loadAsync("/models/robot.glb");
scene.add(gltf.scene);

const mixer = new THREE.AnimationMixer(gltf.scene);
const clip = gltf.animations[0];
mixer.clipAction(clip).play();
```

<!--
Web 端优先 glTF/GLB，因为它围绕实时 PBR、骨骼与动画设计。几何压缩减少传输，KTX2 降低 GPU 纹理内存，优化应在资产管线中完成。

[click:4] GLTFLoader 返回场景和动画等资源。动画还需要 AnimationMixer，并在每帧用 delta 更新。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[86px_1fr]
---

# 拾取：把屏幕坐标变成场景中的射线

::left::

<div class="raycast-diagram mt-2">
  <div class="screen-plane"><i class="pointer"></i><span>pointer</span></div>
  <div class="ray-line"></div>
  <div class="ray-camera"><carbon:view /> Camera</div>
  <div class="ray-world">
    <i></i><i class="hit"></i><i></i>
  </div>
</div>

::right::

```ts {1-4|6-7|9-12|all}
const pointer = new THREE.Vector2(
  (event.clientX / width) * 2 - 1,
  -(event.clientY / height) * 2 + 1,
);

raycaster.setFromCamera(pointer, camera);
const [hit] = raycaster.intersectObjects(targets, true);

if (hit) {
  selected.value = hit.object;
  hit.object.getWorldPosition(worldPosition);
}
```

<div v-click class="callout mt-4">坐标必须相对 canvas 边界计算；页面滚动或非全屏画布时不能直接除以窗口尺寸。</div>

<!--
Raycaster 把指针坐标从像素转换到标准化设备坐标，再从相机穿过该点发射射线。

[click:3] intersectObjects 返回按距离排序的交点，可读取对象、面、UV 和世界坐标。
[click] 生产代码应根据 canvas.getBoundingClientRect 计算坐标，否则嵌入布局或滚动后会选错位置。
-->

---
layout: default
---

# 性能第一问：这一帧提交了多少次绘制

<div class="perf-hero mt-5">
  <div class="perf-before"><strong>10,000</strong><span>独立 Mesh</span><small>可能接近 10,000 draw calls</small></div>
  <carbon:arrow-right />
  <div v-click class="perf-after"><strong>1</strong><span>InstancedMesh</span><small>共享 geometry + material</small></div>
</div>

<div class="grid grid-cols-4 gap-3 mt-7">
  <div v-click class="metric"><span>CPU</span><strong>draw calls</strong><small>`renderer.info.render.calls`</small></div>
  <div v-click class="metric"><span>GPU</span><strong>triangles</strong><small>可见几何复杂度</small></div>
  <div v-click class="metric"><span>Memory</span><strong>textures</strong><small>尺寸、格式、mipmap</small></div>
  <div v-click class="metric"><span>Frame</span><strong>ms</strong><small>16.7ms ≈ 60fps</small></div>
</div>

<div v-click class="callout mt-6">先用 `renderer.info`、Performance 面板与 GPU 工具定位瓶颈，再决定合批、实例化、LOD 或压缩。</div>

<!--
大量相同对象最适合解释 draw call。每个独立 Mesh 通常需要一次提交，InstancedMesh 可以用一次绘制表达许多不同变换。

[click:4] 性能不能只看帧率：同时看 CPU 提交、GPU 几何量、纹理内存和每帧耗时。
[click] 优化从测量开始。三角形多不一定是主因，昂贵 shader、透明混合、后处理和纹理带宽也可能主导。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[86px_1fr]
---

# 离开页面时，GPU 资源不会替你自动回收

::left::

```ts {1-2|4-11|13-15|all}
renderer.setAnimationLoop(null);
controls.dispose();

scene.traverse((object) => {
  if (!(object instanceof THREE.Mesh)) return;

  object.geometry.dispose();
  const materials = Array.isArray(object.material)
    ? object.material
    : [object.material];

  materials.forEach(disposeMaterial);
});

renderer.dispose();
renderer.forceContextLoss();
```

::right::

<div class="lifecycle mt-2">
  <div v-click><carbon:play /><strong>创建</strong><span>geometry、material、texture、target</span></div>
  <carbon:arrow-down />
  <div v-click><carbon:renew /><strong>使用</strong><span>动画循环、监听器、controls</span></div>
  <carbon:arrow-down />
  <div v-click><carbon:trash-can /><strong>释放</strong><span>`dispose()` + 停循环 + 移除监听</span></div>
</div>

<div v-click class="signal signal-warn mt-5">
  <carbon:warning-alt />
  <span>共享资源要有所有权策略；不要在一个 Mesh 卸载时误删仍被其他对象使用的材质。</span>
</div>

<!--
JavaScript 对象被垃圾回收，不代表对应 GPU 缓冲和纹理立刻释放。geometry、material、texture、render target 需要显式 dispose。

[click:3] 同时停止动画循环、移除事件和销毁 controls。单页应用反复进出 3D 页面时，这一步尤其关键。
[click] 共享材质和纹理要明确所有权，可以用资源管理器或引用计数，避免提前释放。
-->

---
layout: default
---

# WebGL、WebGPU 与 TSL：先按能力选路线

<table class="route-table mt-5">
  <thead><tr><th>路线</th><th>成熟度与能力</th><th>适合现在做什么</th></tr></thead>
  <tbody>
    <tr v-click><td><strong>WebGLRenderer</strong></td><td>覆盖广、生态成熟、示例丰富</td><td>大多数生产项目与渐进学习</td></tr>
    <tr v-click><td><strong>WebGPURenderer</strong></td><td>现代 GPU API；可在不支持时回退 WebGL 2</td><td>计算、节点材质、新渲染能力试点</td></tr>
    <tr v-click><td><strong>TSL</strong></td><td>用 JavaScript/TypeScript 节点组合 shader 逻辑</td><td>跨后端材质、后处理与计算表达</td></tr>
  </tbody>
</table>

```ts {1-2|4-5|7-10|all}
import * as THREE from "three/webgpu";
import { color, positionLocal, sin, time } from "three/tsl";

const renderer = new THREE.WebGPURenderer({ antialias: true });
await renderer.init();

const material = new THREE.MeshBasicNodeMaterial();
material.colorNode = color("#4fd1c5");
material.positionNode = positionLocal.add(sin(time).mul(0.1));
```

<div v-click class="callout mt-4">不要为了 API 新而迁移；先验证目标浏览器、材质兼容、后处理、性能与团队调试能力。</div>

<!--
WebGLRenderer 仍是覆盖最广、生态最成熟的生产选择。WebGPURenderer 提供现代 GPU 路径，并可在不支持 WebGPU 时使用 WebGL 2 后端。

[click:2] TSL 用节点表达 shader 逻辑，让同一材质图跨后端工作。
[click] 新项目是否采用要看能力需求和兼容性，不应只因为接口更新。先做针对目标设备的原型和性能验证。
-->

---
layout: center
class: summary-slide
---

# 从第一帧到可维护场景

<div class="summary-grid mt-7">
  <div><span>01</span><strong>场景图组织空间</strong><small>按共同运动关系建立父子层级</small></div>
  <div><span>02</span><strong>时间驱动动画</strong><small>用 delta 与 `setAnimationLoop`</small></div>
  <div><span>03</span><strong>材质、光照、色彩配套</strong><small>颜色贴图与数据贴图区分语义</small></div>
  <div><span>04</span><strong>测量并释放</strong><small>观察 draw call，明确 GPU 资源所有权</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://threejs.org/manual/" target="_blank"><carbon:book /> Manual</a>
  <a href="https://threejs.org/examples/" target="_blank"><carbon:application-web /> Examples</a>
  <a href="https://github.com/mrdoob/three.js/wiki/Migration-Guide" target="_blank"><carbon:roadmap /> r185 Migration</a>
</div>

<!--
最后复盘四条：用场景图管理空间关系；用真实时间推进动画；把几何、材质、光照与色彩管理作为一套系统；上线前测量性能，卸载时释放 GPU 资源。

下一步最有效的练习，是用 GLB 模型替换演示几何体，加一个 Raycaster 选择状态，再记录 renderer.info 的变化。
-->
