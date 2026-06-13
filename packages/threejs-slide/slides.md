---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Three.js
info: |
  Presentation Three.js — the cross-browser 3D library.

  Learn more at [https://threejs.org](https://threejs.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🧊</span>
</div>

<br/>

## Three.js — 浏览器里的 3D 库

封装 WebGL/WebGPU 的通用 3D 库，用「场景图 + 网格 + 材质 + 光照 + 相机」搭建可交互三维世界。2026 年当前版本 r184

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/mrdoob/three.js" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Three.js —— 官方定位：a cross-browser JavaScript library and API used to create and display animated 3D computer graphics in a web browser。

一句话：它把底层的 WebGL，以及逐步成熟的 WebGPU，封装成一套以场景图为核心的高层 API，让你不必直接写 GLSL 就能做 Web 三维。

2026 年的背景：版本号用 r 加修订号滚动迭代，当前 r184，是 2026 年 4 月发布的；包已全面 ESM 化，默认开启色彩管理，WebGLRenderer 仍是默认主流，WebGPU 加 TSL 是新一代路径。

顺序：定位 → 三大件 → 第一个场景 → 渲染循环 → 场景图 → 相机 → 几何体 → 材质 → 纹理 → 光照 → glTF → 动画 → 交互 → 性能 → 内存 → WebGPU/TSL → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 Three.js？

裸写 WebGL 极其繁琐：

<v-clicks>

- 要手写着色器、管理缓冲、矩阵运算
- 几十行才能画出一个三角形
- 加载模型、光照、相机全靠自己

</v-clicks>

<div v-click class="mt-6">

Three.js 把这些封装成积木：

- 场景图组织对象、内置几何与材质
- 内置相机、光照、加载器、后处理
- 生态最大：react-three-fiber、drei…

</div>

<!--
为什么用 Three.js？直接写 WebGL 非常底层：要手写顶点和片元着色器、自己管理缓冲区、做矩阵运算，光画一个三角形就要几十行，加载模型、布光、设相机更是全得自己来。

Three.js 把这些封装成积木：用场景图组织对象，提供内置的几何体、材质、相机、光照、加载器、后处理。再加上它生态最大，有 react-three-fiber 这类声明式封装、drei 这种现成组件库，所以成了 Web 3D 的事实标准。

注意它的边界：它专注渲染和场景组织，不内建物理引擎和关卡编辑器，那是 Babylon.js 那类全功能引擎的领域。
-->

---

# 三大件心智模型

```text
Scene（装内容）─┐
               ├─▶ Renderer.render() ─▶ <canvas>
Camera（定视角）─┘
```

<v-clicks>

- **Scene**：所有对象的根容器（网格/光/相机/组）
- **Camera**：从哪看、看多大范围（视锥）
- **Renderer**：把视锥内容光栅化到画布
- **Mesh = Geometry（形状）+ Material（外观）**

</v-clicks>

<!--
Three.js 最核心的心智模型是三大件。

Scene 是场景，装所有要渲染的内容：网格、光源、相机、组。Camera 是相机，定义从哪看、看多大范围，也就是视锥。Renderer 是渲染器，每帧把相机视锥内的场景内容光栅化到 canvas 上，调用就是 renderer.render(scene, camera)。

再补一个关键组合：一个可见物体 Mesh，等于 Geometry 几何体定形状，加 Material 材质定外观。同一个几何体配不同材质，外观可以完全不同。记住这四个词，后面全是它们的展开。
-->

---

# 第一个场景：旋转立方体

```js
import * as THREE from "three";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 100);
camera.position.z = 4;

const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshStandardMaterial({ color: 0x44aa88 });
const cube = new THREE.Mesh(geo, mat); // 网格 = 几何体 + 材质
scene.add(cube);
```

<!--
来看第一个场景的骨架。

先建渲染器 WebGLRenderer，开抗锯齿，设尺寸，把它的 canvas 加进页面。再建 Scene。然后建透视相机 PerspectiveCamera，四个参数分别是垂直视野角度 75 度、宽高比、近裁剪面 0.1、远裁剪面 100，把相机往后挪 z 等于 4 才能看到原点的物体。

最后建网格：BoxGeometry 是几何体，MeshStandardMaterial 是 PBR 材质，组合成 cube 加进场景。注意 Standard 是受光材质，下一页要加光，不然是黑的。
-->

---

# 加光 + 渲染循环

```js
const sun = new THREE.DirectionalLight(0xffffff, 3);
sun.position.set(2, 3, 4);
scene.add(sun, new THREE.AmbientLight(0xffffff, 0.4));

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  cube.rotation.y += clock.getDelta();
  renderer.render(scene, camera);
});
```

<div v-click class="mt-3 text-sm">

> `setAnimationLoop`（或 `requestAnimationFrame`）与刷新同步、后台自动暂停。用 `clock.getDelta()` 做**帧率无关**动画。

</div>

<!--
接着加光和渲染循环。

加一盏 DirectionalLight 平行光当太阳，设方向；再加一盏 AmbientLight 环境光补暗部。Standard 材质有光才正常显示。

渲染循环用 renderer.setAnimationLoop，传入回调。它和 requestAnimationFrame 一样与显示器刷新同步、切到后台自动暂停、省电。回调里用 clock.getDelta 拿到上一帧到现在的真实秒数，乘到旋转上，这样动画按真实时间推进，在 60Hz、120Hz 或掉帧时速度都一致，这叫帧率无关。最后 render 出画面。WebGPU 路径必须用 setAnimationLoop。
-->

---

# 场景图与变换

```js
const group = new THREE.Group(); // 不可见容器
scene.add(group);
wheel.position.set(2, 0, 0); // 相对父节点的局部坐标
group.add(wheel);
group.rotation.y = Math.PI / 4; // 子节点随父联动
```

<v-clicks>

- `Object3D` 是所有对象基类，承载变换 + 层级
- 世界变换 = **父链局部变换逐级相乘**
- `position`/`scale` 用 Vector3，`rotation` 用 Euler
- `lookAt(target)` 让对象朝向某点

</v-clicks>

<!--
场景图是 Three.js 组织三维世界的方式。

Object3D 是所有可放入场景对象的基类，承载局部变换和父子层级。把 wheel 加进 group 后，wheel 的 position 是相对父节点 group 的局部坐标；group 一旋转，子节点跟着联动。

核心规律：一个对象的世界变换等于它父链上所有局部变换逐级相乘。所以用嵌套的空 Group 当枢轴节点，就能不算坐标地表达轨道、关节、车轮，经典例子是太阳系。

变换三属性：position 和 scale 是 Vector3，rotation 是 Euler 欧拉角，内部和四元数自动同步。要朝向某点用 lookAt。
-->

---

# 相机：透视 vs 正交

| 维度 | Perspective | Orthographic |
|---|---|---|
| 投影 | 近大远小 | 远近同尺寸 |
| 参数 | fov, aspect, near, far | left/right/top/bottom… |
| 场景 | 3D 写实 | 2D / 等距 / CAD |

<div v-click class="mt-4 text-sm">

> ⚠️ 改了 `fov`/`aspect`/`near`/`far` 后必须 `camera.updateProjectionMatrix()`。`near` 太小 + `far` 太大会引发 **z-fighting** 深度闪烁。

</div>

<!--
两种相机。

透视相机 PerspectiveCamera 模拟人眼，近大远小，参数是垂直视野角度 fov、宽高比 aspect、近远裁剪面，是 3D 写实主用。正交相机 OrthographicCamera 没有透视收缩，远近一样大，参数是上下左右六个面，适合 2D、等距视图、工程图。

两个关键提醒。第一，改了任何相机参数，必须调 updateProjectionMatrix 重算投影矩阵，否则不生效、画面会拉伸。第二，深度缓冲精度有限且非线性分布，把 near 设得极小同时 far 极大会稀释精度，远处共面物体会闪烁，这叫 z-fighting，对策是收紧深度范围。
-->

---

# 几何体：BufferGeometry

```js
new THREE.BoxGeometry(1, 1, 1);
new THREE.SphereGeometry(1, 32, 16); // 分段控平滑度
new THREE.PlaneGeometry(2, 2);
```

<v-clicks>

- 现代几何体都继承 `BufferGeometry`（typed array 存顶点）
- 内置 primitives：Box/Sphere/Plane/Cylinder/Torus…
- ⚠️ 分段越多顶点越多、开销越大：平面盒子无需分段
- 自定义：`setAttribute('position', ...)` + `setIndex()`

</v-clicks>

<!--
几何体定义形状。

现代 Three.js 所有几何体都继承 BufferGeometry，它用紧凑的 typed array 存顶点属性，直连 GPU。早期基于对象数组的 Geometry 类因为太慢已经移除。

内置 primitives 覆盖大多数需求：盒、球、平面、圆柱、圆环等。球和圆柱用分段数控制平滑度。

一个常见误区：分段越多，顶点和三角形成倍增加、开销上升。平面盒子根本不需要分段，只有需要顶点级形变时才给平面加分段。

不够用时可以手写：用 setAttribute 设 position、normal、uv 属性，用 setIndex 复用顶点，computeVertexNormals 自动算法线。
-->

---

# 材质体系

| 材质 | 受光 | 关键 |
|---|---|---|
| Basic | ✗ | 无光显色，UI/调试 |
| Lambert / Phong | ✓ | 经验模型，含高光 |
| **Standard** | ✓ | PBR：roughness + metalness |
| Physical | ✓ | + clearcoat/transmission |

<div v-click class="mt-3 text-sm">

> PBR 用**粗糙度 + 金属度**取代 Phong 的 `shininess`。`side: DoubleSide` 双面渲染；`transparent + opacity` 做透明。

</div>

<!--
材质决定外观，按是否受光和真实感分层。

MeshBasicMaterial 不受光，直接用自身颜色显示，适合 UI、线框、调试。Lambert 和 Phong 是受光的经验模型，Phong 逐像素还有高光。MeshStandardMaterial 是 PBR 主力，用粗糙度 roughness 和金属度 metalness 这两个物理参数取代 Phong 的 shininess，配环境贴图很真实。MeshPhysicalMaterial 再加清漆、透射等，最真实也最慢。

通用属性：side 设 DoubleSide 让正反两面都渲染，平面和敞口模型必备；transparent 加 opacity 做透明。
-->

---

# 纹理与色彩管理

```js
const map = new THREE.TextureLoader().load("/brick.jpg");
map.colorSpace = THREE.SRGBColorSpace; // 颜色贴图必设
map.wrapS = map.wrapT = THREE.RepeatWrapping;
map.repeat.set(4, 2); // 平铺次数
```

<v-clicks>

- ⚠️ **颜色贴图**（map/emissive）设 `SRGBColorSpace`
- **数据贴图**（normal/roughness）保持默认，绝不设 sRGB
- 显存 ≈ 宽×高×4×1.33，由**像素尺寸**决定
- 掠射角发糊：调 `anisotropy`

</v-clicks>

<!--
纹理。

用 TextureLoader 加载图片。自 r152 默认开启色彩管理，内部线性、输出 sRGB。最关键的一条：颜色类贴图，比如基础色 map、自发光 emissiveMap，是 sRGB 编码的图片，必须设 colorSpace 等于 SRGBColorSpace，否则颜色偏暗发灰。而数据类贴图，比如法线、粗糙度、AO，存的是非颜色数据，必须保持默认，绝不能设 sRGB。

平铺要两步：先把 wrapS、wrapT 设成 RepeatWrapping，再设 repeat 次数。

性能上记住：纹理显存约等于宽乘高乘 4 乘 1.33，由像素尺寸决定，和压缩后文件大小无关，所以要控制纹理尺寸。远处掠射角发糊就调各向异性 anisotropy。
-->

---

# 光照与阴影

| 光源 | 特点 |
|---|---|
| Ambient | 均匀补光，无方向无阴影 |
| Directional | 平行光（太阳），方向性阴影 |
| Point / Spot | 点光 / 聚光锥（penumbra 控柔化） |
| Hemisphere | 天空/地面双色 |

<div v-click class="mt-3 text-sm">

> 阴影四步：`renderer.shadowMap.enabled` + `light.castShadow` + `mesh.castShadow` + `mesh.receiveShadow`。Basic 材质不受光、不接收阴影。

</div>

<!--
光照。

AmbientLight 环境光均匀补光，无方向无阴影，常作基础补光。DirectionalLight 平行光模拟太阳，方向一致、不随距离衰减，适合做大范围方向性阴影。PointLight 点光源向四周发散并衰减，SpotLight 聚光灯是带圆锥的点光，penumbra 参数控制锥体边缘的柔化。HemisphereLight 用天空和地面两种颜色按法线朝向照亮。

开启阴影要四步：渲染器 shadowMap.enabled 设 true，光源 castShadow，投影物体 castShadow，接收面 receiveShadow，缺一不可。注意只有受光材质参与光照，Basic 材质不受光也不接收阴影。
-->

---

# 加载 glTF 模型

```js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
loader.load("/robot.glb", (gltf) => {
  scene.add(gltf.scene); // 模型根 Object3D
});
```

<v-clicks>

- 官方首选 **glTF（.glb/.gltf）**：实时优化的「3D 界 JPEG」
- 自带 PBR 材质 / 场景层级 / 动画
- addons 从 `three/addons`（≡ `examples/jsm`）引入
- 压缩资源（DRACO/KTX2）需挂对应解码器

</v-clicks>

<!--
加载外部模型。

官方首选 glTF 格式，glb 或 gltf，它是为实时渲染优化的格式，号称 3D 界的 JPEG，二进制顶点数据可直接上 GPU，自带 PBR 材质、场景层级和动画。相比之下 OBJ、FBX 是编辑器交换格式，不适合。

用 GLTFLoader，注意它属于附加组件 addons，从 three/addons 引入，等价于 examples/jsm 目录，不在主包里。加载完回调里拿 gltf.scene，它是模型根 Object3D，add 进场景即可。

如果模型用 DRACO 压了几何或 KTX2 压了纹理，要额外挂 DRACOLoader、KTX2Loader 解码器，否则加载报错。
-->

---

# 动画系统

```js
const mixer = new THREE.AnimationMixer(gltf.scene);
mixer.clipAction(gltf.animations[0]).play();

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  mixer.update(clock.getDelta()); // 关键
  renderer.render(scene, camera);
});
```

<div v-click class="mt-3 text-sm">

> 三件套：`AnimationMixer`（混合器）+ `AnimationClip`（剪辑）+ `AnimationAction`（动作）。**每帧 `mixer.update(delta)`** 才会推进。

</div>

<!--
动画系统。

骨骼和关键帧动画由三件套驱动：AnimationMixer 混合器、AnimationClip 剪辑、AnimationAction 动作。流程是：用模型建 mixer，对某个 clip 调 clipAction 拿到 action，调 play 启动。

最关键的一步：每帧必须调 mixer.update，传入 clock.getDelta 的真实 delta，动画才会按真实时间推进。很多人忘了这步，结果动画不动。play 只需启动时调一次，推进全靠 mixer.update。

action 还能设循环模式、结束保持、播放速度，多个动作之间能用 crossFade 做平滑过渡。
-->

---

# Raycaster 交互拾取

```js
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
canvas.addEventListener("pointerdown", (e) => {
  const r = canvas.getBoundingClientRect();
  ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObjects(scene.children, true);
  if (hits.length) hits[0].object.material.color.set(0xff0000);
});
```

<!--
鼠标拾取用 Raycaster 射线投射。

核心是坐标换算：setFromCamera 需要归一化设备坐标 NDC，x 和 y 都在负 1 到正 1，中心是原点。所以要把鼠标的像素坐标换算成 NDC，注意 y 轴要翻转，公式就是这两行。

然后 setFromCamera 设好射线，intersectObjects 投射，返回的命中数组按距离从近到远排序，所以 hits 0 就是最靠前、最先被点到的对象，符合直觉。每个命中含距离、世界坐标交点、对象、面、UV。

局限：它是 CPU 逐三角检测，高面数对象较慢；不考虑着色器形变和贴图透明孔。海量或透明拾取可改用 GPU 拾取。
-->

---

# 性能：draw call 与 InstancedMesh

```js
const mesh = new THREE.InstancedMesh(geometry, material, 10000);
const m = new THREE.Matrix4();
for (let i = 0; i < 10000; i++) {
  m.setPosition(Math.random() * 100, 0, Math.random() * 100);
  mesh.setMatrixAt(i, m);
}
scene.add(mesh); // 一万个 → 1 次 draw call
```

<v-clicks>

- 每个 Mesh ≈ 一次 draw call，上千次瓶颈在 CPU
- 海量同物体 → `InstancedMesh` 压成一次绘制
- 其他：合并几何、纹理图集、LOD

</v-clicks>

<!--
性能优化第一抓手是降 draw call。

每渲染一个 Mesh 大致对应一次 draw call，也就是 CPU 向 GPU 提交一次绘制。上千次 draw call 时瓶颈在 CPU 提交，不在 GPU 算力。

海量外观相同、只是位置朝向不同的物体，比如森林、星空、方块阵，用 InstancedMesh：一份几何加一份材质，通过 setMatrixAt 设每个实例的变换，一次绘制渲染上万个，把上万 draw call 压成一次。如果建一万个独立 Mesh，就是一万次 draw call，会卡。

其他手段：合并静态几何、用纹理图集减少纹理切换、用 LOD 按距离换低模。用 renderer.info.render.calls 能看每帧 draw call 数。
-->

---

# 内存释放：dispose

```js
scene.remove(mesh); // 仅断开引用，不回收显存
mesh.geometry.dispose();
mesh.material.dispose();
// 材质上的贴图也要 texture.dispose()
```

<v-clicks>

- WebGL **没有自动 GC**，显存要手动释放
- `remove` ≠ 释放：还需 dispose 几何/材质/纹理
- `renderer.info.memory` 监控持有量，只增不减就是泄漏

</v-clicks>

<!--
内存释放，这是 Three.js 新手最容易踩的坑。

WebGL 没有自动垃圾回收。scene.remove 只是把对象从场景图断开引用，几何体、材质、纹理占用的 GPU 显存不会被回收。必须显式调 dispose：geometry.dispose、material.dispose，如果材质上挂了贴图，还要对每张 texture 调 dispose。

判断有没有泄漏：用 renderer.info.memory 看 geometries 和 textures 的数量，如果频繁加载卸载场景，比如 SPA 路由切换，这些数字只增不减，就是泄漏了。

记住一句话:remove 不等于释放，要配 dispose。
-->

---

# WebGPU 与 TSL（2026 新一代）

```js
import * as THREE from "three/webgpu";
import { texture, color } from "three/tsl";

const renderer = new THREE.WebGPURenderer({ antialias: true });
await renderer.init(); // 需异步初始化

const mat = new THREE.MeshStandardNodeMaterial();
mat.colorNode = texture(myTex).mul(color(0xff8800));
```

<v-clicks>

- `WebGPURenderer`（`three/webgpu`）可回退 WebGL
- **TSL**：节点式着色，一份代码编译到 WebGPU/WebGL 两端
- r184 现状：WebGL 仍是默认主流，WebGPU 持续成熟

</v-clicks>

<!--
最后看 2026 的新一代路径。

Three.js 正在向 WebGPU 演进。WebGPURenderer 从 three/webgpu 引入，需要异步初始化 await renderer.init，底层走 WebGPU，不支持时可以回退 WebGL。

配套的 TSL，Three.js Shading Language，用可组合的 JS 节点描述着色逻辑，比如这里 colorNode 用 texture 乘 color。它最大的价值是同一份 TSL 代码能编译到 WebGPU 的 WGSL 和 WebGL 的 GLSL 两种后端，类型安全、可组合，免去手写 GLSL 字符串和 onBeforeCompile 那套 hack。

现状要说清楚：截至 r184，WebGLRenderer 仍是默认、最成熟、教程最多的路径；WebGPU 加 TSL 在持续成熟，适合需要 compute shader、节点材质、前沿效果的场景，但生产主力仍多在 WebGL。不要把它当成已经取代了 WebGL。
-->

---
layout: intro
---

# 总结

Three.js = **封装 WebGL/WebGPU 的通用 3D 库**

- 三大件：Scene → Camera → Renderer，每帧 render
- Mesh = 几何体 + 材质；场景图层级叠加变换
- glTF + GLTFLoader 加载模型；AnimationMixer 放动画
- 性能靠 InstancedMesh 降 draw call；显存要手动 dispose
- 2026：r184，WebGL 默认，WebGPU + TSL 新一代

<!--
总结一下。

Three.js 是封装 WebGL 和 WebGPU 的通用 3D 库。

核心心智是三大件：Scene 装内容、Camera 定视角、Renderer 每帧出画面。一个可见物体 Mesh 等于几何体加材质；场景图用父子层级叠加变换。

实践要点：用 glTF 加 GLTFLoader 加载模型，用 AnimationMixer 三件套放动画并每帧 update；性能上用 InstancedMesh 把海量物体的 draw call 压成一次，显存必须手动 dispose 释放。

2026 现状：当前 r184，WebGLRenderer 是默认主流，WebGPURenderer 加 TSL 是逐步成熟的新一代渲染和着色路径。它轻量灵活、生态最大，是 Web 3D 的事实标准。谢谢大家。
-->
