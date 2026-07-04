---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Babylon.js
info: |
  Presentation Babylon.js — 微软支持的全功能 Web 3D/游戏引擎。

  Learn more at [https://babylonjs.com](https://babylonjs.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎮</span>
</div>

<br/>

## Babylon.js — 开箱即用的 Web 3D 引擎

微软支持的全功能 Web 3D 游戏引擎，v9.15.0

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/BabylonJS/Babylon.js" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Babylon.js —— 微软支持的开箱即用全功能 Web 3D/游戏引擎。

一句话定位：内置物理、GUI、粒子、资产管线、可视化调试器（Inspector）、在线 IDE（Playground）、节点式可视化编辑器（材质/几何体/粒子）等一整套"游戏引擎级"配套，TypeScript 编写、TypeScript 优先，目标是让开发者"少拼装、多创作"。

版本背景：核心包 @babylonjs/core 当前 latest 是 9.15.0（2026-07 npm 实测），发布节奏很快，近 6 周内出了 6 个 minor 版本。

顺序：定位对比 → Engine/Scene/渲染循环 → 相机 → 光照阴影 → Mesh → 材质（重点）→ 纹理 → 动画 → 物理 Havok（特色）→ GUI（特色）→ glTF → 粒子后处理 → 调试工具 → 左手系坑 → 对比 Three.js → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# Babylon.js 是什么？

<v-clicks>

- **全功能引擎**：微软支持，物理·GUI·粒子·资产管线·调试器·在线 IDE 官方一体化
- TypeScript 编写、TypeScript 优先，目标"少拼装、多创作"
- 对照 Three.js："精简渲染库 + 自由拼生态" —— 引擎 vs 库的哲学分野

</v-clicks>

<div v-click class="mt-6">

适合场景 vs 代价：

- 物理交互、复杂 3D/2D UI 叠加、快速原型 → 游戏/可视化配置器/教育/数字孪生
- 代价：包体积天然更大、概念面更广、学习曲线覆盖更宽

</div>

<!--
Babylon.js 把"游戏引擎"的完整配套一次性给你：物理、GUI、粒子、资产管线、可视化调试器、在线 IDE、节点式可视化编辑器,一应俱全。TypeScript 编写、TypeScript 优先,类型定义完善。

和 Three.js 对照:Three.js 是"精简渲染库 + 自由拼生态"的哲学,Babylon 是"全家桶引擎"哲学。这个对比会贯穿今天,最后一页还会有完整对比表。

适合场景:需要物理交互、复杂 UI 叠加、快速原型的项目——游戏、可视化配置器、教育应用、数字孪生。代价也很直接:包体积天然更大,概念面更广,学习曲线覆盖范围更宽。
-->

---

# 最小场景四要素

```javascript
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true); // antialias=true
const scene = new BABYLON.Scene(engine);
const camera = new BABYLON.ArcRotateCamera(
  "camera", -Math.PI / 2, Math.PI / 2.5, 15, BABYLON.Vector3.Zero()
);
camera.attachControl(canvas, true);
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
BABYLON.MeshBuilder.CreateBox("box", {});
engine.runRenderLoop(() => scene.render()); // 每帧渲染
window.addEventListener("resize", () => engine.resize());
```

<div v-click class="mt-3 text-sm">

> Engine 对接 WebGL/WebGPU；Scene 是承载网格/相机/灯光的"舞台"。Playground 环境可省略末尾 `scene` 参数——新对象自动挂到当前场景。

</div>

<!--
最小可运行场景,四要素:Engine、Scene、Camera、Light,再加一个 Mesh。

Engine 负责对接底层图形 API,构造传 canvas 和 antialias。Scene 是场景容器,官方原话是"the scene is somewhat like the stage on which all the meshes are placed to be seen"。相机用 ArcRotateCamera,轨道环绕;attachControl 必须调用才能接收输入。光用 HemisphericLight 模拟环境光。MeshBuilder.CreateBox 建一个盒子。

最后两行是关键:runRenderLoop 每帧调用 scene.render 才会画面刷新;resize 监听让画布跟着窗口变化。Playground 环境下很多对象可以省略末尾 scene 参数,会自动挂到当前场景,写 demo 更简洁。
-->

---

# 相机 Camera

三大常用相机 + 若干专用相机，全部需 `camera.attachControl(canvas, true)` 才能接收输入。

| 相机 | 定位 | 关键参数 |
|---|---|---|
| `ArcRotateCamera` | 轨道相机，环绕目标旋转（产品展示首选） | alpha/beta/radius/target |
| `UniversalCamera` | FPS 第一人称，官方推荐替代 FreeCamera | position |
| `FollowCamera` | 跟随指定 mesh 移动 | target mesh |

<v-clicks>

- `FreeCamera` 是 Universal 前身，仍可用但官方建议迁移
- 专用相机：`DeviceOrientationCamera`（陀螺仪）、`WebXRCamera`（VR/AR）
- 多相机切换：`scene.activeCamera = camera2`；分屏用 `camera.viewport` + `scene.activeCameras`

</v-clicks>

<!--
相机部分,三大常用相机加若干专用相机,共同点是必须调用 attachControl 才能接收输入,这是最容易漏的一步。

ArcRotateCamera 是轨道相机,alpha 是经度角、beta 是纬度角、radius 是距目标距离、target 是环绕中心,产品展示看模型首选。UniversalCamera 是第一人称视角,v2.3 引入,自动识别键盘鼠标触摸手柄输入,官方推荐用它替代老的 FreeCamera。FollowCamera 跟随指定 mesh 移动。

专用相机还有响应陀螺仪倾斜的 DeviceOrientationCamera,以及 WebXR 会话管理的 WebXRCamera。多相机切换直接赋值 activeCamera 即可;要分屏多视口用 camera.viewport 配合 scene.activeCameras。
-->

---

# 光照 Light 与阴影

| 光源 | 构造要点 | 特点 |
|---|---|---|
| Hemispheric | (name, dir, scene) | 模拟环境光，dir 为主色+反向 groundColor |
| Directional | (name, dir, scene) | 平行光/太阳，无限范围 |
| Point | (name, pos, scene) | 点光源四散，类比灯泡 |
| Spot | (name,pos,dir,angle,exp,scene) | 聚光灯，多锥角+衰减指数参数 |

```javascript
const shadowGenerator = new BABYLON.ShadowGenerator(1024, light); // 1024=贴图尺寸
shadowGenerator.getShadowMap().renderList.push(castingMesh);
ground.receiveShadows = true; // 三者缺一不可
```

<div v-click class="mt-2 text-sm">

> 质量选项（互斥、逐档更贵）：Poisson 柔化 / Blur ESM 最慢最佳 / PCF 硬件优化 / Contact Hardening 真实软阴影。材质默认最多同时响应 **4 盏光**（`maxSimultaneousLights` 可调）。

</div>

<!--
光照四种基础光源,构造签名统一是 name、方向或位置、scene。Hemispheric 模拟环境光,方向是主色、反方向是地面色;Directional 是平行光模拟太阳,无限范围不衰减;Point 点光源向四周发射;Spot 聚光灯比前两者多锥角和衰减指数两个参数。

阴影只有 point、directional、spot 光支持投影,point 光走 cubemap 渲染代价最高。开启阴影三步:建 ShadowGenerator、把投影物体加入 renderList、接收面设 receiveShadows,三者缺一不可。

质量选项是互斥的,逐档更贵:Poisson 采样柔化边缘但性能一般,Blur Exponential Shadow Map 质量最好但最慢,PCF 是 WebGL2 硬件优化过滤,Contact Hardening 是基于距离的真实软阴影。另外材质默认最多同时响应 4 盏光,场景光源超过 4 盏又没调 maxSimultaneousLights,多余的灯会被忽略。
-->

---

# 网格 Mesh：创建与批量渲染

```javascript
const box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
```

`MeshBuilder` 是现代统一入口，替代旧版 `BABYLON.Mesh.CreateXxx`。批量渲染优化——性能/灵活性递减、数量级递增：

| 技术 | API | 特点 |
|---|---|---|
| Clone | `mesh.clone("name")` | 完全独立副本，最贵最灵活 |
| Instance | `mesh.createInstance("name")` | 共享几何+材质，GPU instancing |
| Thin Instance | `mesh.thinInstanceAdd(matrix)` | 矩阵缓冲驱动，最轻量 |
| SPS | `new BABYLON.SolidParticleSystem(...)` | 焊成一个 mesh，适合极限数量 |

<!--
Mesh 创建,MeshBuilder 是现代统一入口,替代旧版 Mesh.CreateXxx。options 对象可以为空,scene 参数可省略默认当前场景。除了预制形状,还有参数化形状、多面体、自定义顶点数据几类创建方式。

批量渲染是高频考点,四种技术性能和灵活性递减、数量级递增:Clone 是完全独立副本,自己的顶点缓冲,最贵但最灵活;Instance 共享几何体和材质,靠 GPU instancing 降 draw call,仍可独立变换和拾取;Thin Instance 是矩阵缓冲驱动,最轻量,但牺牲部分独立拾取能力,适合成千上万重复物体;Solid Particle System 把大量小网格焊成一个 mesh,配合逐粒子行为,适合极限数量场景。选型时按这个梯度来,不是无脑上最轻量的方案。
-->

---

# LOD 细节层次

```javascript
mainMesh.addLODLevel(15, mediumDetailMesh);
mainMesh.addLODLevel(30, lowDetailMesh);
mainMesh.addLODLevel(55, null); // 超过 55 单位距离不渲染

// 也可切换为"屏幕占比"模式（数值语义相反：越大越精细）
mainMesh.useLODScreenCoverage = true;
mainMesh.addLODLevel(0.7, mediumDetailMesh); // 占屏 70% 时切中模型
```

<v-clicks>

- 默认模式：距离越大越粗糙；`useLODScreenCoverage` 模式：数值越大越精细（语义相反）
- `mergeMeshes()` 合并减少 draw call；`mesh.dispose()` 释放资源

</v-clicks>

<!--
LOD 细节层次。addLODLevel 第一个参数是距离,第二个是对应距离下要渲染的替身网格,传 null 表示超过该距离直接不渲染。

坑在这:也可以切换成屏幕占比模式,useLODScreenCoverage 设 true 之后,数值语义直接反过来——默认距离模式是数字越大越远越粗糙,屏幕占比模式反而是数字越大越精细,占屏 70% 时才切到中模型。混着记很容易搞反。

另外 mergeMeshes 合并网格能减少 draw call,mesh.dispose 记得释放资源,这两个是配合 LOD 常用的性能收尾手段。
-->

---

# 材质：StandardMaterial

```javascript
const mat = new BABYLON.StandardMaterial("mat", scene);
mat.diffuseColor = new BABYLON.Color3(1, 0, 1);     // 基础色（受光后表现色）
mat.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87); // 高光
mat.emissiveColor = new BABYLON.Color3(1, 1, 1);    // 自发光，不受光照影响
mat.diffuseTexture = new BABYLON.Texture("path/to.png", scene);
mat.alpha = 0.5;              // 0 全透明 ~ 1 不透明
mat.wireframe = true;         // 线框模式
mat.backFaceCulling = false;  // 背面剔除开关（透明物体常需关闭）
mesh.material = mat;
```

<div v-click class="mt-2 text-sm">

> 四种光照反应通道：diffuse（基础色）/ specular（高光）/ emissive（自发光）+ ambient（场景环境光响应）。

</div>

<!--
材质是必考重点,先看 StandardMaterial。它有四种光照反应通道:diffuseColor 是基础色,也就是受光后的表现色;specularColor 是高光;emissiveColor 是自发光,不受光照影响,常用来做发光效果;还有一个 ambientColor 响应场景环境光。

贴图挂在 diffuseTexture。alpha 控制透明度,0 到 1;wireframe 开线框模式方便调试;backFaceCulling 是背面剔除开关,做透明物体、平面或敞口模型时常需要关掉,不然背面看不见。material 赋给 mesh.material 才生效。
-->

---

# 材质：PBRMaterial（基于物理渲染）

```javascript
// 推荐：Metallic-Roughness 工作流
const pbr = new BABYLON.PBRMetallicRoughnessMaterial("pbr", scene);
pbr.baseColor = new BABYLON.Color3(1, 1, 1);
pbr.metallic = 0.8;   // 0~1：越大越像金属
pbr.roughness = 0.3;  // 0~1：越大越粗糙（漫反射越强）
pbr.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("env.env", scene);
```

<v-clicks>

- 另一路 `PBRSpecularGlossinessMaterial`（diffuse+specular+glossiness），二选一不混用
- 光强单位是本质差异：point/spot 用坎德拉（candela），directional/hemispheric 用 nit——真实物理单位
- `environmentTexture`（CubeTexture）是 PBR 反射的主要来源

</v-clicks>

<!--
PBRMaterial,基于物理的渲染,不追求单一"正确"算法,而是尽量模拟真实光照。推荐用 Metallic-Roughness 工作流:PBRMetallicRoughnessMaterial,metallic 越大越像金属,roughness 越大越粗糙、漫反射越强。

另一路是 PBRSpecularGlossinessMaterial,diffuse 加 specular 加 glossiness 参数化,两路二选一不能混用。

一个容易忽略的本质差异:PBR 用的是真实物理光强单位,点光源和聚光灯用坎德拉,方向光和半球光用 nit,这和 Standard 材质的经验化参数完全不是一回事。environmentTexture 挂 CubeTexture 是 PBR 反射的主要来源,CreateFromPrefilteredData 专门用于加载预过滤的 IBL 环境贴图。
-->

---

# NodeMaterial 节点材质（必考特色）

<v-clicks>

- 通过连接 `NodeMaterialBlock` 节点搭建 shader，免写 GLSL/WGSL
- 配套图形化编辑器 **NME**（Node Material Editor）
- 三种使用路径：代码手连节点 / NME 可视化编辑 / 从已保存文件加载
- 同时支持 WebGL 与 WebGPU 两种后端
- 官方示例：约 12 个节点块完整复刻 StandardMaterial 全部光照分量（ambient/diffuse/specular/reflection/emissive）
- 支持着色器自动提升优化（片段→顶点）与循环
- `MultiMaterial`：一个 mesh 按子网格分区使用不同材质

</v-clicks>

<!--
NodeMaterial,节点材质,是材质体系里的必考特色。原理是用连线的方式搭 NodeMaterialBlock 节点来组装 shader 逻辑,不用手写 GLSL 或 WGSL 字符串。

配套有图形化编辑器 NME,Node Material Editor。用法上有三条路径:直接写代码手动连节点、在 NME 里可视化拖拽编辑、或者加载已经保存好的节点文件。它同时支持 WebGL 和 WebGPU 两种后端,不用为不同后端重写。

官方一个很能说明能力的示例:用大约 12 个节点块,就完整复刻出了 StandardMaterial 的全部光照分量,包括环境光、漫反射、高光、反射、自发光。底层还支持着色器自动提升优化,把片段着色器的计算提到顶点着色器去做,以及循环支持。

顺带提一句 MultiMaterial,和 NodeMaterial 不是一回事,它是让一个 mesh 按子网格分区使用不同材质,常见于"一个物体不同面不同贴图"的场景。
-->

---

# 纹理 Texture 与环境贴图

| 类型 | 用途 |
|---|---|
| `Texture` | 基础图片纹理：`hasAlpha`/`uScale`/`wrapU` 等 |
| `CubeTexture` | 环境贴图/天空盒，PBR 反射主要来源 |
| `DynamicTexture` | 2D Canvas API 实时绘制（GUI 底层机制之一） |
| `ProceduralTexture` | 着色器程序化生成，无需美术贴图文件 |

```javascript
mat.diffuseTexture = new BABYLON.Texture("path/to.png", scene);
const env = BABYLON.CubeTexture.CreateFromPrefilteredData("env.env", scene);
```

<!--
纹理四种类型。Texture 是最基础的图片纹理,hasAlpha 控制透明通道,uScale/vScale 控制平铺次数,wrapU/wrapV 控制包裹模式。CubeTexture 是环境贴图或天空盒,PBR 材质反射效果主要靠它。DynamicTexture 可以用 2D Canvas API 实时绘制内容,GUI 系统底层机制之一就是它。ProceduralTexture 是用着色器程序化生成纹理,不需要美术出贴图文件。

代码上很简单:贴图直接赋给材质的 diffuseTexture;环境贴图常用 CreateFromPrefilteredData 加载预过滤好的 IBL 环境贴图,配合 PBR 材质的 environmentTexture 使用。
-->

---

# 动画基础 Animation

```javascript
const anim = new BABYLON.Animation(
  "myAnim", "position.x", 30, // fps
  BABYLON.Animation.ANIMATIONTYPE_FLOAT,
  BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
);
anim.setKeys([{ frame: 0, value: 0 }, { frame: 30, value: 5 }]);
mesh.animations.push(anim);
scene.beginAnimation(mesh, 0, 30, true); // target,from,to,loop
```

<v-clicks>

- `Animatable`（`beginAnimation` 返回值）支持 `pause`/`restart`/`stop`/`reset`
- 属性类型覆盖 `FLOAT`/`VECTOR3`/`QUATERNION`/`COLOR3`/`MATRIX`
- 循环模式：`CYCLE`/`CONSTANT`/`RELATIVE`/`YOYO`；缓动用 `EasingFunction`（如 `CubicEase`）

</v-clicks>

<!--
底层动画对象是 Animation,构造参数是名字、要驱动的属性路径(这里是 position.x)、fps、动画类型、循环模式。setKeys 设关键帧数组,frame 是帧号、value 是对应值。挂到 mesh.animations 数组里,再调用 scene.beginAnimation 播放,参数是目标、起始帧、结束帧、是否循环,返回一个 Animatable。也可以不挂 mesh.animations,直接用 beginDirectAnimation。

Animatable 支持 pause、restart、stop、reset 控制。属性类型覆盖 FLOAT、VECTOR3、QUATERNION、COLOR3、MATRIX 这几种;循环模式除了 CYCLE 循环、CONSTANT 停在终值,还有 RELATIVE 相对叠加和 YOYO 来回摆动。要做缓动效果用 EasingFunction 系列,比如 CubicEase,配合 setEasingFunction 使用。
-->

---

# AnimationGroup 与骨骼动画

```javascript
const walkGroup = new BABYLON.AnimationGroup("walk");
walkGroup.addTargetedAnimation(anim1, mesh1);
walkGroup.normalize(0, 100); // 统一不同动画的帧区间
walkGroup.play(true);        // loop
walkGroup.speedRatio = 1.5;
walkGroup.onAnimationEndObservable.add(() => {/* ... */});
```

<v-clicks>

- 把多条动画 + 目标打包统一控制，角色动画标配
- 骨骼/蒙皮动画：`Skeleton` + `Bone`，glTF/导入模型自带
- 变形目标 `MorphTarget`（表情/口型常用）
- `AnimationGroupMask`（Include/Exclude）对分组内动画做精细遮罩

</v-clicks>

<!--
AnimationGroup 是把多条动画加目标打包统一控制,角色动画的标配写法。addTargetedAnimation 把某条 animation 和它要驱动的目标网格绑到一起;normalize 统一不同来源动画的帧区间,因为不同动画剪辑长度可能不一致;play(true) 循环播放;speedRatio 调速;onAnimationEndObservable 监听播放结束。

骨骼蒙皮动画由 Skeleton 加 Bone 构成,glTF 或其他格式导入的模型通常自带,不用手搭。表情口型常用变形目标 MorphTarget。更精细的场景,AnimationGroupMask 支持 Include 或 Exclude 两种模式,对分组内的动画做遮罩控制,决定哪些子动画实际生效。
-->

---

# 物理引擎：V1 vs V2（必考特色）

官方原话：**"We strongly recommend using V2 over V1"**

| 维度 | V1（legacy） | V2（推荐） |
|---|---|---|
| 核心概念 | `PhysicsImpostor` | `PhysicsBody` + `PhysicsShape` 分离，可复用 Shape |
| 支持插件 | CannonJS/OimoJS/AmmoJS（Bullet 移植） | **HavokPlugin**（AAA 级，WASM，MIT 免费） |
| 便捷封装 | – | `PhysicsAggregate`（对标 V1 Impostor 的简化写法） |

<div v-click class="mt-3 text-sm">

> 关键区别：物理引擎模拟真实碰撞反弹动力学，**不等于**简单碰撞检测（`mesh.intersectsMesh`/`ActionManager` 的 `OnIntersectionEnterTrigger` 更轻量）。

</div>

<!--
物理引擎是必考特色,先看架构演进。官方原话很明确:强烈建议用 V2 而不是 V1。

V1 也就是 legacy 版本,核心概念是 PhysicsImpostor,把一个"简单对象"贴到复杂网格上去模拟物理;支持的插件是纯 JS 的 CannonJS、OimoJS,以及 Bullet 移植版 AmmoJS。V2 是当前推荐架构,把 PhysicsBody 和 PhysicsShape 拆分开,Shape 可以复用;插件是 HavokPlugin,AAA 级质量、WASM 编译、MIT 免费授权,还多了一个便捷封装 PhysicsAggregate,对标 V1 Impostor 的简化写法。

一个容易混淆的概念区别:物理引擎模拟的是真实碰撞反弹动力学,这和简单的碰撞检测不是一回事——mesh.intersectsMesh 或者 ActionManager 的 OnIntersectionEnterTrigger 只是轻量级的相交判断,不涉及真实物理响应。选型前先想清楚需要哪一种。
-->

---

# Havok 物理实战

```javascript
// Havok 异步初始化（WASM 模块）
const havokInstance = await HavokPhysics();
const havokPlugin = new BABYLON.HavokPlugin(true, havokInstance);
scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), havokPlugin);

// 简化写法：一次性绑定 Body+Shape
const aggregate = new BABYLON.PhysicsAggregate(
  mesh, BABYLON.PhysicsShapeType.BOX, { mass: 1, restitution: 0.75 }, scene
);
aggregate.body.setMassProperties({ mass: 10 }); // 组件仍可单独访问微调
```

<v-clicks>

- 调试可视化：`new BABYLON.PhysicsViewer()` 或 Inspector 的 Debug 面板勾选 physics viewer
- `aggregate.dispose()`：内部创建的 shape 自动释放，外部传入的 shape 不会被误删

</v-clicks>

<!--
实战代码。Havok 是 WASM 模块,要异步初始化:先 await HavokPhysics() 拿到实例,再 new HavokPlugin 包装,最后 scene.enablePhysics 传入重力向量和插件,默认重力是沿 Y 轴负 9.81。

简化写法用 PhysicsAggregate,一次性把 Body 和 Shape 绑定好,传入网格、形状类型、质量和弹性系数这些选项。绑定之后底层组件比如 aggregate.body 仍然可以单独访问微调,比如重新设置质量属性。

调试时用 PhysicsViewer,或者直接在 Inspector 的 Debug 面板勾选 physics viewer,能看到"物理引擎眼中的世界",常用来排查物理形状和视觉网格对不上的问题。dispose 有个细节:PhysicsAggregate 内部创建的 shape 会自动释放,但如果是外部传进来复用的 shape,不会被误删,这样才能安全复用 Shape。
-->

---

# GUI：AdvancedDynamicTexture（必考特色）

```javascript
// 模式一：全屏 UI（每场景仅允许 1 个）
const ui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");

// 模式二：贴到某个 mesh 表面（常用于 VR 面板）
const ui2 = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(planeMesh, 1024, 1024);

const button = BABYLON.GUI.Button.CreateSimpleButton("btn", "Click Me");
button.onPointerClickObservable.add(() => console.log("clicked"));
ui.addControl(button);
```

<v-clicks>

- 常用控件：`TextBlock`/`Button`/`StackPanel`/`Rectangle`/`Image`（`NINE_PATCH` 等拉伸模式）
- **坑**：非 Button 控件默认不拦截指针事件，需手动 `control.isPointerBlocker = true`
- 3D GUI 是另一套独立体系：`GUI3DManager` + `Control3D`（`HolographicButton` 等 XR 空间交互）

</v-clicks>

<!--
GUI 是 2D 加 3D 两套体系,今天重点看 2D 的 AdvancedDynamicTexture,底层基于 DynamicTexture 渲染。两种创建模式:CreateFullscreenUI 是全屏 UI,每个场景只允许一个;CreateForMesh 是贴到某个 mesh 表面,常用于 VR 空间面板。

控件用法很直观,比如 Button.CreateSimpleButton 建按钮,onPointerClickObservable 绑点击回调,addControl 加进 UI 树。常用控件还有 TextBlock 文本、StackPanel 堆叠容器、Rectangle 矩形(常用来做圆角容器)、Image 图片,Image 有几种拉伸模式包括 NINE_PATCH 九宫格拉伸。

一个高频坑:非 Button 类控件,比如拿 Rectangle 当点击热区用,默认是不拦截指针事件的,点击会穿透到下层,必须手动设 isPointerBlocker 等于 true。

最后提一句 3D GUI,是完全独立的另一套体系,GUI3DManager 加 Control3D 家族,HolographicButton 这类控件支持手部追踪,做 XR 空间交互专用。
-->

---

# 资产加载：glTF

```typescript
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";
registerBuiltInLoaders(); // 首次遇到某类型模型才按需加载对应 loader

import { LoadAssetContainerAsync, AppendSceneAsync, ImportMeshAsync } from "@babylonjs/core";
const container = await LoadAssetContainerAsync("model.glb", scene); // 不直接加入场景
await AppendSceneAsync("model.glb", scene);        // 直接并入现有场景
const result = await ImportMeshAsync("model.glb", scene); // 只导入网格
```

<v-clicks>

- 支持格式：`.gltf`/`.glb`（首选）、`.obj`、`.stl`、`.ply`/`.splat`/`.spz`（Gaussian Splatting）
- 压缩扩展：Draco（`KHR_draco_mesh_compression`）/ Meshopt / KTX2(Basis)，需额外配置解码器
- 旧版 `SceneLoader.ImportMesh/Append`（回调风格）仍可用，新代码建议用上面的 Async 函数

</v-clicks>

<!--
资产加载,glTF 是官方首选格式。现代推荐用法来自 @babylonjs/loaders/dynamic 包,registerBuiltInLoaders 注册后,第一次遇到某种类型的模型才按需动态加载对应 loader,tree-shaking 更友好。

三个 Async 模块函数分工不同:LoadAssetContainerAsync 加载但不直接加入场景,适合先检查再决定;AppendSceneAsync 直接并入现有场景;ImportMeshAsync 只导入网格。旧版 SceneLoader.ImportMesh/Append/LoadAssetContainer 是回调风格,仍然可用,但新代码官方建议用这几个 Async 函数,配置更简单。

支持格式里 glTF 的 gltf/glb 是首选,1.0 版本已弃用;还支持 obj、stl,以及做 Gaussian Splatting 的 ply/splat/spz。如果模型用了 Draco 几何压缩、Meshopt 压缩或者 KTX2/Basis 纹理压缩这几种扩展,要额外配置对应的解码器,可以从 CDN 拉取也可以自托管。
-->

---

# 粒子系统与后处理

<v-clicks>

- `ParticleSystem`（CPU）：`emitter`/`minSize`~`maxSize`/`emitRate`/`direction1-2`/`color1-2`
- `GPUParticleSystem`：动画渲染都放 GPU，单系统可达百万级；**不支持** mesh 发射器/子发射器/手动指定数量
- `ps.stop()` 只停止新发射，已存在粒子仍渲染完生命周期；立即清空用 `ps.reset()`

</v-clicks>

```javascript
const pipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera]);
pipeline.samples = 4;                   // MSAA
pipeline.fxaaEnabled = true;
pipeline.bloomEnabled = true;
pipeline.depthOfFieldEnabled = true;    // focalLength/fStop/focusDistance
pipeline.imageProcessingEnabled = true; // 色彩分级/曝光/色调映射/晕影
if (!pipeline.isSupported) { /* 降级处理 */ }
```

<!--
粒子和后处理放一起看。ParticleSystem 是 CPU 版粒子,核心属性是发射源 emitter(可以是 mesh、AbstractMesh 或 Vector3)、粒子大小范围 minSize maxSize、发射速率 emitRate、方向范围 direction1 到 2、颜色范围 color1 到 2。

GPUParticleSystem 把动画和渲染计算都挪到 GPU 上,单系统官方示例能到百万级粒子,但有明确能力边界:不支持手动指定发射数量、不支持 mesh 作为发射器、不支持子发射器。这是设计限制,选型前先看这个清单,别当成 bug 排查。stop 只是停止新粒子发射,已经存在的粒子还会正常渲染完剩余生命周期,要立刻清空得用 reset。

后处理用 DefaultRenderingPipeline 一站式集成常用效果:samples 做 MSAA、fxaaEnabled 或者 FXAA、bloomEnabled 泛光、depthOfFieldEnabled 景深、imageProcessingEnabled 打开色彩分级曝光色调映射晕影这一整套。用之前记得判断 pipeline.isSupported,不支持要做降级处理。
-->

---

# 调试与开发工具

<v-clicks>

- **Inspector**：`scene.debugLayer.show()` 一行打开；两大面板 Scene Explorer（层级大纲）+ Inspector Pane（属性/Debug/统计/工具）
- ES Module 按需引入：`import { Inspector } from "@babylonjs/inspector"`，再 `Inspector.Show(scene, {})`
- 内建骨骼/物理/法线/纹理等专项可视化；支持 default/embedded/popup 三种显示模式
- **Playground**（playground.babylonjs.com）：浏览器端在线 IDE，`createScene`/`delayCreateScene`/`createEngine` 三种模板函数
- Save 生成带版本号 URL（如 `#6F0LKI#1`），Download 导出项目 zip，可 iframe 嵌入
- 其他节点编辑器：**NME**（材质）/ **NGE**（几何体）/ **NPE**（粒子）

</v-clicks>

<!--
调试工具,Inspector 最简单用法一行代码 scene.debugLayer.show() 打开。ES Module 项目按需引入 @babylonjs/inspector,调用 Inspector.Show。两大面板:Scene Explorer 是层级大纲,支持按名过滤、gizmo 和可见性快捷操作;Inspector Pane 有属性网格、Debug、统计、工具四个 tab。还内建了骨骼、物理、法线、纹理等专项可视化工具,支持默认、内嵌、弹窗三种显示模式,也能挂自定义调试项比如复选框滑块。

Playground 是浏览器端在线 IDE,支持 JS 和 TS,三种模板函数对应不同场景:createScene 是最常见的、delayCreateScene 用于异步加载场景、createEngine 用于自定义引擎配置。Save 会生成带版本号的唯一 URL,方便分享和回溯历史版本;Download 导出完整项目 zip;还能 iframe 嵌入论坛帖子,是官方文档、论坛答疑、bug 复现的通用载体。

另外三个节点编辑器分别覆盖材质、几何体、粒子三大可编程系统,都是"可视化搭节点生成资源"的思路。
-->

---

# 左手系与易错点

<v-clicks>

- **左手系陷阱**：Babylon 默认左手系，glTF/Three.js/多数 DCC 工具默认右手系；`scene.useRightHandedSystem` 可整体切换，但会影响内置假设左手系的逻辑（如 WebXR 骨骼数据转换）
- **ES6 副作用导入缺失**：`import { MeshBuilder }` 后仍需 `import "@babylonjs/core/Meshes/meshBuilder.js"` 才能用 `CreateBox`，PBR/贴图 loader/物理组件同理
- **WebGPUEngine 忘记 await**：`new WebGPUEngine()` 后必须 `await engine.initAsync()`，建议先 `await WebGPUEngine.IsSupportedAsync` 探测
- **物理 V1→V2 API 断层**：`PhysicsImpostor` 与 `PhysicsBody`/`PhysicsShape` 不是同一套 API，老教程别混抄
- **GUI 默认不拦截指针**：非 Button 控件需手动 `isPointerBlocker = true`
- **材质光源上限**：默认最多同时响应 4 盏光，超出需调 `maxSimultaneousLights`

</v-clicks>

<!--
最后梳理易错点,坐标系是专家级必考点。Babylon 默认左手坐标系,而 glTF、Three.js、大多数 DCC 工具比如 3ds Max、Blender 导出默认右手系。混用或者导入导出时最容易在旋转方向、法线方向上踩坑。useRightHandedSystem 可以整体切换,但要清楚这会影响所有默认假设左手系的内置逻辑,比如 WebXR 骨骼数据转换会因此跳过坐标翻转,不是切一个开关就万事大吉。

ES6 按需引入漏掉副作用导入是第二大坑:只 import MeshBuilder,调用 CreateBox 可能仍然报错,因为具体 builder 逻辑要靠额外的副作用导入才会挂载到类上,PBR 材质、贴图 loader、物理组件同理。WebGPUEngine 容易忘记 await initAsync,建议先探测 IsSupportedAsync 再决定走哪条路径。

物理 V1 到 V2 是 API 断层,不是同一套东西,老教程代码大量还停留在 V1,混着抄容易踩版本不对口的坑。GUI 非 Button 控件默认不拦截指针事件前面提过,再强调一次。材质默认最多同时响应 4 盏光,这也是"加了灯但没变亮"最常见的排查点。
-->

---

# 选型对比：Babylon.js vs Three.js

| 维度 | Babylon.js | Three.js |
|---|---|---|
| 定位 | 全功能引擎：物理/GUI/粒子/调试器一体化 | 轻量渲染库：核心只管渲染 |
| 坐标系 | 默认**左手系** | 默认**右手系**（与 glTF 一致） |
| 物理引擎 | 内置 Havok，`enablePhysics()` 开箱即用 | 不内置，需自行接入 Cannon-es/Rapier |
| GUI | 内置 2D+3D 两套完整体系 | 无内置，DOM 覆盖层或三方方案 |
| 调试工具 | 官方 Inspector + Playground 在线 IDE | 依赖社区方案，无官方同等工具 |

<div v-click class="mt-3 text-sm">

> 开箱即用物理/复杂 UI/正式调试工具链 → **Babylon.js**（概念面更广，子系统内聚）；最小依赖、R3F 生态深度集成 → **Three.js**（核心更精简，集成决策成本转嫁开发者）。

</div>

<!--
最后对比 Babylon.js 和 Three.js,这是前端可视化选型的必考落脚点。

定位上一个是全功能引擎,物理、GUI、粒子、调试器官方一体化;一个是轻量渲染库,核心只管渲染,其他都靠第三方拼装。坐标系上 Babylon 默认左手系,Three.js 默认右手系,和 glTF、多数 DCC 工具一致,导入摩擦更小。物理引擎 Babylon 内置官方集成 Havok,一行 enablePhysics 开箱即用;Three.js 官方不内置,要自己接入 Cannon-es 或 Rapier,胶水代码自己写。GUI 上 Babylon 有内置 2D 加 3D 两套完整体系,Three.js 没有内置,只能用 DOM 覆盖层或者三方库。调试工具 Babylon 有官方 Inspector 和 Playground,Three.js 依赖社区方案。材质体系 Babylon 多一个 NodeMaterial 可视化节点编辑器。

两者渲染性能量级相近,选型核心矛盾是引擎全家桶的便利与体积心智开销,对比库的精简与自由拼装的灵活性和额外集成成本。需要开箱即用物理交互、复杂 UI、正式调试工具链,选 Babylon,概念面更广但子系统内聚;追求最小依赖、和 React 生态深度集成、自由拼装,选 Three.js,核心更精简但集成决策成本转嫁给开发者。
-->

---
layout: intro
---

# 总结

Babylon.js = **微软支持的全功能 Web 3D/游戏引擎**

- Engine/Scene 渲染循环 + 三大相机 + 光照阴影，最小场景四要素起步
- 材质三件套：StandardMaterial / PBRMaterial / NodeMaterial 可视化节点编辑器
- 特色：Physics V2 Havok 物理 + AdvancedDynamicTexture GUI，开箱即用
- glTF 资产管线 + 粒子/后处理 + Inspector/Playground 调试链路
- 左手系是与 Three.js/glTF 互操作的第一坑
- 资源：babylonjs.com 文档 / playground.babylonjs.com / Discourse 论坛 / GitHub BabylonJS

<!--
总结一下。

Babylon.js 是微软支持的开箱即用全功能 Web 3D/游戏引擎。今天走了一遍核心地图:Engine 加 Scene 加渲染循环是起点,配合三大相机、四种光源和阴影;Mesh 创建有 MeshBuilder,批量渲染按 Clone、Instance、Thin Instance、SPS 的性能梯度选;材质三件套是重点,StandardMaterial 经验模型、PBRMaterial 物理渲染、NodeMaterial 可视化节点编辑器免写 shader。

两大特色一定要记住:Physics V2 配 Havok,一行 enablePhysics 开箱即用的 AAA 级物理;GUI 的 AdvancedDynamicTexture,2D 加 3D 两套完整体系。资产管线首选 glTF,配 registerBuiltInLoaders 按需加载。粒子和后处理、Inspector 和 Playground 这套调试链路,是 Babylon 作为"全功能引擎"心智的具体体现。

最容易踩的坑是左手坐标系,和 Three.js、glTF 这些右手系生态互操作时第一个要留意。资源上官方文档 babylonjs.com、在线 IDE playground.babylonjs.com、Discourse 论坛、GitHub BabylonJS 仓库,都是继续深入的起点。谢谢大家。
-->
