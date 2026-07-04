---
theme: seriph
background: https://cover.sli.dev
title: Welcome to WebGPU
info: |
  Presentation WebGPU — 浏览器原生的下一代 GPU 与计算 API。

  Learn more at [https://gpuweb.github.io/gpuweb/](https://gpuweb.github.io/gpuweb/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">⚡</span>
</div>

<br/>

## WebGPU — 浏览器原生的下一代 GPU API

浏览器原生显式 GPU API，WebGL 的继任者

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/gpuweb/gpuweb" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 WebGPU —— W3C "GPU for the Web Working Group" 制定的浏览器原生 GPU API，不是第三方库。

一句话定位：面向 Vulkan/Metal/Direct3D 12 等现代 GPU 设计的下一代显式图形与通用计算接口，是 WebGL 的继任者。

今天的顺序：是什么 → 浏览器支持现状 → 心智模型 → 初始化 → 核心对象 → WGSL → 渲染管线 → 绑定模型 → 命令录制 → Compute → 内存对齐 → 错误处理 → 性能 → 生态 → 易错点 → 与 WebGL 选型对比 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# WebGPU 是什么

**一句话**：浏览器原生、面向 Vulkan / Metal / Direct3D 12 设计的下一代显式图形与通用计算接口

<v-clicks>

- WebGL 的**继任者**，不是"WebGL 3.0"——架构哲学完全不同
- 状态机（WebGL）→ 预编译、创建后不可变的管线（WebGPU）
- 优点：编译期校验、多线程命令录制、原生 compute、WGSL 报错更清晰
- 缺点：心智负担陡增，bind group / pipeline layout / 内存对齐样板代码多
- 2026 定位：现代桌面重度图形/ML 推理场景优先，跨端仍需 WebGL2 兜底

</v-clicks>

<!--
WebGPU 官方一句话定位：面向 Vulkan、Metal、Direct3D 12 这些现代原生 GPU API 设计的下一代显式图形与通用计算接口。

关键认知：它是 WebGL 的继任者，而不是简单的"WebGL 3.0"升级版——两者架构哲学完全不同，一个是全局可变状态机，一个是预编译、创建后不可变的管线对象。

优点：管线预创建加编译期验证减少运行时状态错误，原生支持多线程命令录制降低 CPU 开销，原生通用计算是 WebGL 时代的痛点，WGSL 静态类型带来更清晰的报错。

缺点也很直接：官方教程原话"如果只是想在屏幕上画点东西，用库更好"——bind group、pipeline layout、内存对齐这些样板代码非常多。2026 年阶段性定位：现代桌面重度图形和 ML 推理场景优先选型，跨端项目仍要 WebGL2 兜底。
-->

---

# 2026 浏览器支持现状

| 浏览器 | 支持版本 | 备注 |
|---|---|---|
| Chrome / Edge | **113+**（桌面默认开启） | Windows D3D12 / macOS·ChromeOS Vulkan |
| Chrome / Edge（Android） | 121+ | 高通/ARM GPU，139+ 起支持 Imagination |
| Firefox | **141+**（Windows 默认开启） | 145+/147+ 起覆盖 macOS |
| Safari | **26+**（默认开启） | macOS Tahoe / iOS / iPadOS / visionOS |

<div v-click class="mt-3 text-sm">

> 全球可用率约 82%（桌面为主）。MDN 页面仍标注 "Limited availability"，但 GitHub 官方 wiki、Chrome 与 web.dev 官方文档均确认三大引擎桌面版已默认开启——**技术层面已达 newly available，编辑口径尚未到 Baseline**，移动端/Linux 仍在补齐。

</div>

<!--
2026 年的浏览器支持现状。Chrome/Edge 113+ 桌面默认开启，Windows 走 D3D12，macOS/ChromeOS 走 Vulkan；Android 121+ 起支持主流高通/ARM GPU。Firefox 141+ 在 Windows 默认开启，底层是 wgpu；macOS 稍晚跟进。Safari 26+ 默认开启，覆盖 macOS Tahoe、iOS、iPadOS、visionOS。

这里有个值得说的矛盾点：MDN 总览页正文自己还写着"Limited availability"，但 GitHub 官方 gpuweb wiki、Chrome 官方文档、web.dev 博客三个独立信源都确认三大浏览器桌面版已默认开启。结论：技术层面已经达到"newly available"的量级，但 MDN 编辑口径还没更新到 Baseline，移动端和 Linux 覆盖也还不完整，不宜断言"已经 widely available"。
-->

---

# 心智模型与架构分层

```text
Web 应用（WebGPU JS API）
        ↓
浏览器实现（Dawn C++ / wgpu Rust / Safari 自研）
        ↓
原生 GPU API（Vulkan / Metal / Direct3D 12）
        ↓
物理 GPU 设备
```

<v-clicks>

- 本质只做两件事：**画三角形/点/线到纹理** + **在 GPU 上跑通用计算**
- 并行安全三约束：①只读自己的输入 ②不能动态分配内存 ③读写同一目标需原子操作
- 上万个处理器核心并行调度，是 GPU 算力的根本来源

</v-clicks>

<!--
WebGPU 的心智模型自下而上分四层：Web 应用调用 WebGPU JS API，浏览器用 Dawn（Chromium，C++）或 wgpu（Firefox，Rust）或 Safari 自研实现去翻译，再映射到 Vulkan/Metal/Direct3D 12 这些原生 GPU API，最终落到物理 GPU。

webgpufundamentals 的原话：WebGPU 本质只做两件事——把三角形/点/线画到纹理上，以及在 GPU 上跑计算。

它的并行原理：着色器函数每次调用完全独立，可以任意顺序执行，所以能被上万个核心并行调度，这是 GPU 算力的根本来源。但这份自由是有代价的，三条设计约束保障安全：只能读自己的输入、不能动态分配内存、读写同一目标要用原子操作。后面 Compute 那两页会具体展开第三条。
-->

---

# 初始化链：四步拿到可用设备

```js
if (!navigator.gpu) throw new Error("不支持 WebGPU"); // 1. 入口判空
const adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" }); // 2. 可能 null
if (!adapter) throw new Error("未找到适配器");
const device = await adapter.requestDevice(); // 3. 消费 adapter，只能成功一次
const context = canvas.getContext("webgpu");
context.configure({
  device,
  format: navigator.gpu.getPreferredCanvasFormat(), // 4. 避免额外拷贝
});
```

<v-clicks>

- `requestAdapter()` 失败返回 `null` 而非抛异常，`device.lost` 是一个 `Promise`
- 整条链是 4 层 Promise，漏 `await` 或漏处理 rejection 是最基础的翻车点

</v-clicks>

<!--
标准四步链，每一步都是异步 Promise。第一步判断 navigator.gpu 是否存在，这是入口对象。第二步 requestAdapter 请求适配器，代表物理 GPU，注意它失败时返回 null 而不是抛异常，必须显式判空。第三步 requestDevice 请求逻辑设备，这一步会消费掉 adapter，同一个 adapter 只能成功调用一次 requestDevice，第二次会 reject 抛 OperationError。第四步拿到 canvas 的 webgpu 上下文并 configure，format 必须用 getPreferredCanvasFormat 拿平台最优格式，否则可能引入额外拷贝开销。

记住 device.lost 是个 Promise，设备丢失（比如驱动崩溃）时会 resolve，后面错误处理那页会展开。
-->

---

# GPUDevice：一切资源的工厂

`adapter.requestDevice()` 拿到，几乎所有 `create*` 方法都挂在它上面：

| 分类 | 方法 |
|---|---|
| 资源创建 | `createBuffer` / `createTexture` / `createSampler` / `createShaderModule` |
| 管线创建 | `createRenderPipeline(Async)` / `createComputePipeline(Async)` |
| 绑定相关 | `createBindGroupLayout` / `createBindGroup` / `createPipelineLayout` |
| 编码 | `createCommandEncoder` / `createRenderBundleEncoder` |
| 错误 | `pushErrorScope` / `popErrorScope` |

<div v-click class="mt-3 text-sm">

> 实例属性：`queue`/`features`/`limits`/`lost`/`adapterInfo`。生产代码优先用 **`*Async`** 版本——同步版本会阻塞主线程直到着色器编译完成。

</div>

<!--
GPUDevice 是 WebGPU 里"一切资源的工厂"。方法分五类：资源创建（buffer/texture/sampler/shaderModule）、管线创建（渲染和计算管线，各有同步异步两版）、绑定相关（layout/bindGroup/pipelineLayout）、编码（commandEncoder/renderBundleEncoder）、错误（push/popErrorScope）。

实例属性里 queue 是主队列，lost 是刚才提到的设备丢失 Promise。有一个生产建议要强调：createRenderPipeline/createComputePipeline 的同步版本会阻塞主线程直到着色器编译完成，MDN 和官方样例都推荐用 Async 版本，后面渲染管线和计算管线的例子都会用 Async。
-->

---

# 核心资源对象：Buffer / Texture / Sampler / Shader

```js
const buf = device.createBuffer({
  label: "顶点数据",              // 几乎所有对象都能加 label 方便调试
  size: vertices.byteLength,
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  mappedAtCreation: true,         // 创建时直接映射写入
});
new Float32Array(buf.getMappedRange()).set(vertices);
buf.unmap();
```

<v-clicks>

- `usage` 是位标志：`VERTEX`/`INDEX`/`UNIFORM`/`STORAGE`/`COPY_SRC`/`COPY_DST`/`MAP_READ`/`MAP_WRITE`
- `GPUTexture`：着色器绑定用 `texture.createView()`，不是 texture 本身
- `GPUSampler`：WebGPU **强制显式创建**，且**没有自动生成 mipmap 的 API**
- `GPUShaderModule`：`device.createShaderModule({ code })` 装载 WGSL 源码

</v-clicks>

<!--
四个核心资源对象。GPUBuffer 用 createBuffer 创建，usage 是位标志可以按位或组合；这里演示 mappedAtCreation 直接映射写入初始顶点数据，写完必须 unmap。

GPUTexture 创建时要指定 size/format/usage，注意着色器绑定用的是 texture.createView() 生成的 view，不是 texture 本身。GPUSampler 控制着色器怎么过滤寻址纹理，WebGPU 强制要求显式创建 sampler 对象，这点和 WebGL 不同——WebGL 里采样参数是纹理对象自带的隐式状态。还有一个容易漏的点：WebGPU 没有 gl.generateMipmap 那样自动生成 mipmap 的 API，需要手写。GPUShaderModule 就是装载 WGSL 源码的容器，下一页展开 WGSL 本身。
-->

---

# WGSL 着色语言基础

标量：`bool`/`i32`/`u32`/`f32`（`f16` 需开启扩展）；向量矩阵可用简写：

| 完整形式 | 简写 |
|---|---|
| `vec2<f32>` | `vec2f` |
| `vec3<i32>` | `vec3i` |
| `mat4x4<f32>` | `mat4x4f` |

```wgsl
@vertex
fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
  let pos = array(vec2f(0.0, 0.5), vec2f(-0.5, -0.5), vec2f(0.5, -0.5));
  return vec4f(pos[i], 0.0, 1.0);
}
@fragment
fn fs() -> @location(0) vec4f {
  return vec4f(1.0, 0.0, 0.0, 1.0); // 红色
}
```

<!--
WGSL 是 WebGPU 专属着色语言，静态类型、命令式语法，同时覆盖顶点、片元、计算三类着色器——这是 GLSL 时代 compute 支持薄弱的地方。

标量类型很简单：bool/i32/u32/f32，f16 要显式开扩展。向量矩阵命名可以写完整泛型形式，也可以写简写，比如 vec2<f32> 等价于 vec2f，矩阵命名规则是"列数 x 行数"。

入口点属性三选一决定着色器阶段：@vertex、@fragment、@compute。这里演示 vertex 和 fragment 一对最简单的三角形着色器。@location(n) 标注跨阶段变量位置，@builtin(name) 访问内置值比如 position、vertex_index。@group(n)@binding(m) 是资源绑定坐标，要和 JS 侧的绑定布局一一对应，下面几页会展开。WGSL 与 GLSL 的本质差异是静态类型加更严格的编译期校验，语法上更接近 Rust。
-->

---

# 渲染管线 GPURenderPipeline

```js
const pipeline = await device.createRenderPipelineAsync({
  layout: "auto", // 或显式 createPipelineLayout(...)
  vertex: {
    module: shaderModule, entryPoint: "vs",
    buffers: [{ arrayStride: 32, attributes: [
      { shaderLocation: 0, offset: 0,  format: "float32x4" },
      { shaderLocation: 1, offset: 16, format: "float32x4" },
    ]}],
  },
  primitive: { topology: "triangle-list", cullMode: "back" },
  fragment: { module: shaderModule, entryPoint: "fs",
    targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }] },
});
```

<!--
GPURenderPipeline 由 createRenderPipeline 或推荐的 createRenderPipelineAsync 创建。descriptor 里 layout 可以用 "auto" 让 WebGPU 自动推导绑定布局，也可以显式传 createPipelineLayout 的结果。

vertex 块描述顶点输入：module 和 entryPoint 指向 WGSL 里的 @vertex 函数，buffers 里 arrayStride 是每个顶点的字节跨度，attributes 里 shaderLocation 对应 WGSL 的 @location(n)。primitive 块控制图元装配方式，这里是三角形列表加背面剔除。fragment 块类似，targets 里的 format 必须匹配 canvas 的 preferred format。

还有两块可选没在代码里展开：depthStencil 做深度/模板测试，multisample 做 MSAA 抗锯齿。下一页专门讲这个描述符和 WebGL 状态机的本质区别。
-->

---

# RenderPipeline vs WebGL 状态机（高频对比题）

| 维度 | WebGL | WebGPU |
|---|---|---|
| 状态管理 | 全局可变状态机（`useProgram`/`enable`/`blendFunc`） | 管线对象**创建后不可变**，一次性打包 |
| 校验时机 | 运行时逐次校验，出错易被忽略 | 创建管线时**编译期校验**，错误更早暴露 |
| 复用方式 | 手动保存/恢复状态 | 创建多个 pipeline 直接 `setPipeline()` 切换 |
| GPU 侧优化空间 | 受限（驱动难预判后续状态） | 更大（驱动可提前编译优化） |

<div v-click class="mt-3 text-sm">

> `pipeline.getBindGroupLayout(0)` 可反查 `layout: "auto"` 时自动生成的绑定布局。

</div>

<!--
这是最高频的对比题。WebGL 是全局可变状态机，useProgram、enable、blendFunc 这些调用分散在运行时生效，校验也是运行时逐次做，出错容易被忽略。WebGPU 反过来，管线对象一旦创建就不可变，把顶点布局、光栅化、深度模板、混合、着色器一次性打包，创建时就做编译期校验，错误更早暴露。

复用方式也不同：WebGL 要手动保存恢复状态，WebGPU 是创建多个 pipeline 对象，运行时直接 setPipeline 切换。这也让驱动有更大的优化空间，因为管线创建时就能提前编译优化，不用像 WebGL 那样一直猜下一步状态。最后提一句，如果用了 layout: "auto"，可以用 getBindGroupLayout(0) 反查自动生成的绑定布局。
-->

---

# 绑定模型：Layout → BindGroup → PipelineLayout

**BindGroupLayout 定义槽位类型 → BindGroup 塞入具体资源 → PipelineLayout 打包成管线绑定方案**

```js
const bindGroupLayout = device.createBindGroupLayout({
  entries: [
    { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },
    { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
  ],
});
const bindGroup = device.createBindGroup({
  layout: bindGroupLayout,
  entries: [
    { binding: 0, resource: { buffer: storageBuffer } },
    { binding: 1, resource: sampler },
  ],
});
```

<!--
绑定模型三层关系：BindGroupLayout 只声明"这个 binding 是什么类型、哪个阶段可见"；BindGroup 把具体资源实例填进槽位；PipelineLayout 把多个 BindGroupLayout 打包成管线可用的完整绑定方案。

代码里 entries[].binding 必须和 WGSL 里的 @binding(n) 一致，bindGroupLayouts 数组下标对应 WGSL 里的 @group(n)。buffer.type 可以是 uniform、storage、read-only-storage。

有个取舍要说清楚：layout: "auto" 让 WebGPU 根据着色器代码自动推导绑定布局，写起来快，适合原型；显式 createPipelineLayout 需要手动保证和着色器完全匹配，但换来的是能跨多个 pipeline 复用同一套布局，自动模式下每个 pipeline 各自生成一套，即使内容相同也不能直接互换。
-->

---

# 命令录制与提交

```js
const commandEncoder = device.createCommandEncoder();
const pass = commandEncoder.beginRenderPass({
  colorAttachments: [{
    view: context.getCurrentTexture().createView(), // 每帧重新拿当前纹理
    clearValue: { r: 0.2, g: 0.3, b: 0.4, a: 1 },
    loadOp: "clear", storeOp: "store",
  }],
});
pass.setPipeline(renderPipeline);
pass.setBindGroup(0, bindGroup);
pass.setVertexBuffer(0, vertexBuffer);
pass.draw(3);
pass.end();
device.queue.submit([commandEncoder.finish()]); // finish() 后不可再编码
```

<!--
WebGPU 里几乎所有"发命令"的方法，实际只是往 command buffer 里追加记录，并不会立即执行。必须 encoder.finish() 打包成 GPUCommandBuffer，再交给 queue.submit() 才真正提交给 GPU。

代码流程：createCommandEncoder 拿到编码器，beginRenderPass 开始一个渲染通道，colorAttachments 里 view 每帧都要重新从 context.getCurrentTexture() 拿，clearValue 配合 loadOp: "clear" 清屏。然后 setPipeline、setBindGroup、setVertexBuffer 依次设置状态，draw(3) 发起绘制三个顶点，pass.end() 结束通道。最后 queue.submit 传入 finish() 打包好的命令缓冲，注意 finish() 之后这个 encoder 就不能再继续编码了。下一页讲这几个方法背后的语义细节。
-->

---

# 命令缓冲的语义要点

<v-clicks>

- 所有 `pass.xxx()`/`encoder.xxx()` 只是往 command buffer **追加记录**，不会立即执行
- `loadOp: "clear"` 用 `clearValue` 清屏；`"load"` 保留上一帧内容
- `storeOp: "store"` 保存结果供后续读取；`"discard"` 直接丢弃省带宽
- `GPUCommandEncoder` 还提供 `copyBufferToBuffer`/`copyTextureToTexture` 等拷贝方法
- 一个 `GPUCommandBuffer` **只能提交一次**，`submit()` 可一次传入多个
- 调试可用 `pushDebugGroup`/`popDebugGroup`/`insertDebugMarker`

</v-clicks>

<!--
把上一页代码背后的语义拆开讲。第一，也是最容易踩的坑：所有 pass/encoder 上的调用都只是往命令缓冲追加记录，不是即时执行，这和很多人对"调用即生效"的直觉不一样。

loadOp 和 storeOp 是一对容易混的参数：loadOp 的 clear 和 load 决定这个通道开始前怎么处理已有内容，storeOp 的 store 和 discard 决定通道结束后要不要保留结果，discard 多用于不需要保留的中间附件，能省带宽。

GPUCommandEncoder 除了 pass，还提供好几个拷贝方法，copyBufferToBuffer、copyTextureToTexture 等，Buffer 那页会用到。最后两条：一个 GPUCommandBuffer 只能提交一次，但 submit() 支持一次传入多个命令缓冲的数组；调试可以用 pushDebugGroup 这套 API 给命令分组打标签。
-->

---

# 计算管线与 WGSL Compute Shader

```js
const computePipeline = device.createComputePipeline({
  layout: "auto",
  compute: { module: shaderModule, entryPoint: "main" },
});
```

对应 WGSL：

```wgsl
@group(0) @binding(0) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3u) {
  data[id.x] = data[id.x] * 2.0; // 每个 invocation 独立处理一个元素
}
```

<!--
Compute 是 WebGPU 相对 WebGL 的独有能力，WebGL 时代只能用渲染管线曲线救国模拟通用计算。GPUComputePipeline 只有单一的 compute 阶段，descriptor 比渲染管线简单很多，module 和 entryPoint 指向 WGSL 里的 @compute 函数。

对应的 WGSL 代码：var<storage, read_write> 声明一个可读写的存储缓冲，绑定坐标 @group(0)@binding(0) 要和 JS 侧的 bindGroup 一致。@compute @workgroup_size(64) 声明这是计算着色器，workgroup 内 64 个并行线程。函数体很简单，每个 invocation 通过 global_invocation_id 拿到自己的下标 id.x，独立处理一个元素——这正是上面心智模型页说的"并行安全三约束"里第一条"只读自己的输入"的具体体现。下一页讲这个 workgroup_size 怎么选，以及背后的性能故事。
-->

---

# Compute 派发与 workgroup 并行设计

```js
const pass = commandEncoder.beginComputePass();
pass.setPipeline(computePipeline);
pass.setBindGroup(0, bindGroup);
pass.dispatchWorkgroups(Math.ceil(N / 64)); // CPU 侧决定发多少个 workgroup
pass.end();
```

<v-clicks>

- workgroup 是 GPU 最小调度单元，`@workgroup_size(x,y,z)` 声明其大小
- **反面案例**：`workgroup_size(1)` 单线程跑全部数据，实测比纯 JS **慢 30 倍**
- **正面案例**：提到 256 + `var<workgroup>` 共享内存局部归约，直方图从 11ms 优化到 **1ms 以下**
- 竞态条件：并行写同一地址会丢失更新，需 `atomic<u32>` + `atomicAdd`/`atomicLoad`
- 跨 invocation 同步共享内存要调用 `workgroupBarrier()`

</v-clicks>

<!--
计算通道的录制和渲染通道很像：beginComputePass、setPipeline、setBindGroup，区别是最后调用 dispatchWorkgroups 而不是 draw，参数是 x/y/z 三个方向要发多少个 workgroup。

workgroup_size 是着色器里静态声明的三维大小，dispatchWorkgroups 是 CPU 侧决定发多少个 workgroup，两者配合才决定总并行规模。webgpufundamentals 的直方图案例给了两个真实数据：反面案例，workgroup_size 设成 1 只用单线程跑全部数据，实测比纯 JS 版本还慢 30 倍——GPU 单核算力不如 CPU，优势完全来自大规模并行，划分不合理等于没用上 GPU。正面案例，把 workgroup_size 提到 256，配合 var<workgroup> 声明的工作组共享内存做局部归约，再跨 workgroup 二次汇总，把统计耗时从 11 毫秒优化到 1 毫秒以下，提升 100 多倍。

还有竞态条件：多个 invocation 并行写同一个地址会"读 3 写 4，读 3 写 4"丢失更新，必须用 atomic 类型加 atomicAdd/atomicLoad 保证原子性；workgroup 内共享内存的同步要调用 workgroupBarrier()。
-->

---

# Buffer 内存对齐与资源同步

⚠️ **`vec3<f32>`（即 `vec3f`）在 `uniform`/`storage` 布局中会被对齐到 16 字节**（逻辑上只需 12 字节），是最经典的内存布局踩坑点

| 写入方式 | 用法 | 场景 |
|---|---|---|
| `queue.writeBuffer()` | 一步写入，隐式拷贝 | 高频小块更新（每帧 uniform） |
| `mappedAtCreation` | 创建时映射写初始值 | 一次性静态数据（顶点/索引） |
| `mapAsync(READ)` | 异步映射回读 | GPU 计算结果读回 CPU |

<div v-click class="mt-3 text-sm">

> 可映射（`MAP_READ`/`WRITE`）与 `STORAGE` 用途**互斥**，回读 compute 结果需额外建 **staging buffer**，`copyBufferToBuffer` 搬运后再 `mapAsync` 读取。

</div>

<!--
WGSL 的 uniform/storage 变量内存布局有严格对齐规则。最经典的坑：vec3f 逻辑上只需要 12 字节，但在 uniform/storage 布局里会被填充到 16 字节对齐边界。struct 整体对齐等于其所有成员里最大的对齐值，数组元素按元素类型自身对齐，哪怕数组只有一个元素。手动算 struct 内偏移量极易出错，官方推荐用 webgpu-utils 这类库自动生成布局，而不是手写偏移量。

写入 buffer 有三条路径：writeBuffer 一步写入适合高频小块更新；mappedAtCreation 适合一次性初始化的静态数据；mapAsync 多用于异步回读。这里有个关键限制：可映射的 MAP_READ/MAP_WRITE 和 STORAGE 用途互斥，不能建一个既能被 compute shader 写又能直接 CPU 映射读的 buffer，必须额外建一个 staging buffer，用 copyBufferToBuffer 搬运后再 mapAsync 读取——这是资源同步的核心套路，回读 Compute 的计算结果基本都要走这条路。
-->

---

# 错误处理与设备丢失

`GPUError` 基类 → `GPUValidationError` / `GPUOutOfMemoryError` / `GPUInternalError` / `GPUPipelineError`

```js
device.pushErrorScope("validation"); // 也支持 "out-of-memory"/"internal"
const sampler = device.createSampler({ maxAnisotropy: 0 }); // 非法值示例
const error = await device.popErrorScope();
if (error) console.error(error.message);

device.addEventListener("uncapturederror", (e) => console.error(e.error.message));
device.lost.then((info) => console.log(`设备丢失: ${info.reason}`)); // destroyed | unknown
```

<div v-click class="mt-3 text-sm">

> 不可信输入（用户上传的着色器/资源）建议包 `pushErrorScope`；已充分测试的生产路径不必每次都包，成本换收益不划算。

</div>

<!--
WebGPU 错误体系以 GPUError 为基类，派生 GPUValidationError（API 参数非法）、GPUOutOfMemoryError（显存不足）、GPUInternalError（实现内部错误）、GPUPipelineError（管线编译失败）。

两种捕获方式：pushErrorScope/popErrorScope 是主动包裹一段可能出错的调用，这里演示传非法的 maxAnisotropy 值；uncapturederror 事件是全局兜底，捕获所有没被任何 scope 捕获的错误。device.lost 是设备丢失时 resolve 的 Promise，reason 区分 destroyed 和 unknown，常见触发场景是显卡驱动崩溃或标签页休眠被系统回收。

使用建议：加载用户提供的着色器代码、处理用户上传的资源配置这类不可信输入场景适合包 pushErrorScope；格式良好、已经充分测试的生产路径不需要每次都包裹，成本换收益不划算。
-->

---

# WebGPU 的性能优势

<v-clicks>

- **管线预创建 + 编译期校验**：减少运行时状态错误，驱动可提前编译优化
- **原生多线程命令录制**：降低 CPU 提交开销，缓解单线程 draw call 瓶颈
- **原生通用计算**：compute shader 是 WebGL 时代的痛点，WebGPU 原生支持
- **WGSL 静态类型**：编译期报错更清晰，调试成本更低
- **显式内存/资源管理**：更可预测的性能，代价是样板代码增多
- 实测案例：合理划分 workgroup 后直方图统计从 11ms 优化到 1ms 以下（100+ 倍）
- Chrome 官方数据：部分模型 ML 推理速度提升 3 倍以上

</v-clicks>

<!--
汇总一下 WebGPU 相对 WebGL 的性能优势。管线预创建加编译期校验，减少运行时状态错误，也给驱动留出提前编译优化的空间。原生支持多线程命令录制，降低 CPU 开销，这是 WebGL 单线程执行模型的老大难问题。原生通用计算能力，compute shader 是 WebGL 时代要曲线救国才能模拟的痛点。WGSL 静态类型系统带来更清晰的编译期报错。显式内存资源管理带来更可预测的性能，代价当然是样板代码变多，这是前面反复提到的取舍。

两个实测数字加深印象：合理划分 workgroup 后，直方图统计案例从 11 毫秒优化到 1 毫秒以下，提升 100 多倍；Chrome 官方数据显示，部分模型的 ML 推理速度用 WebGPU 能提升 3 倍以上。这些数字背后都是"原生并行计算能力"这一件事。
-->

---

# 生态与实现

<v-clicks>

- **原生实现**：Chromium 系 **Dawn**（C++）/ Firefox **wgpu**（Rust）/ Safari 自研
- **Three.js**：r171 起 `WebGPURenderer` 标榜生产可用，自动 fallback WebGL2
- **TSL**（Three Shading Language）：一份代码编译到 WGSL + GLSL 两端
- **Babylon.js**：`WebGPUEngine`，同样渐进增强、自动降级 WebGL 路线
- 官方与教程共识：WebGPU 是"低级 API"，业务开发更常见的选择是**用封装库**而非手搓

</v-clicks>

<!--
生态与实现层面。原生实现分三家：Chromium 系用 Dawn，C++ 写的；Firefox 用 wgpu，Rust 写的，也是很多 Rust 生态 native/embedded 图形项目复用的库；Safari 是自研实现。

上层库这块，Three.js 自 r171 起 WebGPURenderer 标榜"生产可用"，切换只需换一个 import，且会自动 fallback 到 WebGL2；配套的 TSL，Three Shading Language，让开发者只写一份着色器逻辑，编译期分别产出 WGSL 和 GLSL 两份产物。不过要如实说：社区和官方文档也承认这个渲染器仍会有 breaking changes，谨慎的团队会做充分验证后再上生产。Babylon.js 提供 WebGPUEngine，走的也是同样的渐进增强、自动降级路线。

官方和教程有个共识值得记住：WebGPU 定位是"低级 API"，直接手写它等价于写图形引擎的地基层，实际产品开发中更常见的是选一个封装好的库，而不是从零手搓。
-->

---

# 易错点合集

<v-clicks>

- `requestAdapter()` 失败返回 `null` 不抛异常，忘记判空是最基础的翻车点
- canvas format 不用 `getPreferredCanvasFormat()`，手写死值会引入额外拷贝开销
- bind group 与 layout 不匹配：`@group`/`@binding` 编号错位会报验证错误
- buffer usage 标志漏加：忘了给 staging buffer 加 `COPY_DST` 会导致拷贝失败
- 命令录制当"即时执行"用：所有调用只是记录，必须 `finish()` + `submit()` 才生效
- `workgroup_size` 选得过小（如 1），完全没用上 GPU 并行，反而更慢
- 并行写入未加原子操作，多个 invocation 写同一地址会竞态丢失更新
- 从 WebGL 迁移直接照搬坐标系：裁剪空间 Z 范围、视口 Y 轴方向都不同

</v-clicks>

<!--
汇总全场最容易踩的八个坑。第一，requestAdapter 失败返回 null 不抛异常，忘记判空是最基础的翻车点。第二，canvas format 不用 getPreferredCanvasFormat，手写死值会有额外拷贝开销。第三，bind group 和 layout 不匹配，@group/@binding 编号错位会报验证错误。第四，buffer usage 标志漏加，比如 staging buffer 忘了加 COPY_DST 导致拷贝失败。

第五，把命令录制当即时执行用，忘了 finish 加 submit 才会真正生效。第六，workgroup_size 选得过小，完全没用上并行反而更慢，前面直方图案例讲过。第七，并行写入不加原子操作会竞态丢失更新。第八，从 WebGL 迁移直接照搬坐标系——WebGPU 裁剪空间 Z 是 0 到 1，WebGL 是负 1 到 1；视口和帧缓冲 Y 轴方向也相反，投影矩阵和深度比较函数都要跟着调整。
-->

---

# vs WebGL：选型对比

| 维度 | WebGL(2) | WebGPU |
|---|---|---|
| 状态管理 | 全局可变状态机 | 不可变管线，编译期校验 |
| 通用计算 | 无原生支持 | 原生 `GPUComputePipeline` |
| 着色语言 | GLSL | WGSL（静态类型） |
| CPU 开销 | 单线程执行，易成瓶颈 | 多线程录制，开销更低 |
| 浏览器覆盖（2026） | 96%+，全平台 | 约 82%，现代桌面为主 |
| 生态成熟度 | 十余年积累，非常成熟 | 已产品化，官方仍提示 breaking changes |

<div v-click class="mt-3 text-sm">

> **何时选 WebGPU**：现代桌面为主、需要 compute、追求低 CPU 开销。**何时仍选 WebGL2**：需覆盖全平台/老设备、没有 compute 硬需求。折中：Three.js/Babylon.js「WebGPU 优先、自动 fallback WebGL2」。

</div>

<!--
最后做个选型对比。状态管理、通用计算、着色语言、CPU 开销、浏览器覆盖、生态成熟度六个维度逐一对比，WebGPU 在架构和计算能力上明显更现代，但覆盖率和生态积累还是 WebGL2 占优。

给个决策建议：目标用户以现代桌面浏览器为主、需要 GPU 通用计算能力、追求更低 CPU 开销和更大规模渲染物体数，选 WebGPU；需要覆盖全平台包括老设备和长尾移动端、对通用计算没有硬需求、团队没有余力应对更陡的学习曲线，仍选 WebGL2。当前生态的主流折中方案，是用 Three.js 或 Babylon.js 这类"WebGPU 优先、自动 fallback WebGL2"的封装库，兼顾未来性能上限和当下兼容性。
-->

---
layout: intro
---

# 总结

WebGPU = **浏览器原生、面向 Vulkan/Metal/D3D12 的下一代显式 GPU API**

- 心智模型：Adapter → Device → 不可变 Pipeline → Command Buffer → Queue
- WGSL 静态类型着色语言，覆盖 vertex/fragment/compute 三阶段
- 独有能力：原生 compute shader，workgroup 并行划分决定性能上限
- 2026 现状：三大浏览器桌面默认开启，WebGL2 仍是全平台兜底
- 生态：Three.js `WebGPURenderer`+TSL、Babylon.js `WebGPUEngine` 渐进增强
- 深入信源：MDN WebGPU_API、webgpufundamentals.org、gpuweb.github.io 规范

<!--
总结一下。WebGPU 是浏览器原生、面向 Vulkan/Metal/Direct3D 12 的下一代显式 GPU API。

核心心智模型：从 Adapter 到 Device，再到创建后不可变的 Pipeline，命令录制成 Command Buffer，最后交给 Queue 提交。WGSL 是静态类型着色语言，一套语法覆盖 vertex、fragment、compute 三个阶段。它相对 WebGL 最大的独有能力是原生 compute shader，workgroup 怎么划分直接决定性能是提升百倍还是慢 30 倍。

2026 年的现状：三大浏览器桌面版都已默认开启，但 WebGL2 覆盖率仍然是全平台兜底的选择。生态上 Three.js 的 WebGPURenderer 加 TSL、Babylon.js 的 WebGPUEngine，都走"WebGPU 优先、自动降级 WebGL"的产品化路线,这也是现阶段最稳妥的实践方式。想深入的话，MDN 的 WebGPU_API 总览、webgpufundamentals.org 的教程、以及 gpuweb.github.io 的官方规范都是很好的一手资料。谢谢大家。
-->
