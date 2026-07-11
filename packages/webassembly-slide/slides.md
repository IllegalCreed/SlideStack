---
theme: seriph
layout: cover
title: Web Assembly
info: |
  从性能叙事出发，建立 WebAssembly 的模块模型、线性内存、边界成本与工具链决策心智。

  Learn more at [https://developer.mozilla.org/en-US/docs/WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="cover-mark wasm">WA</div>

# Web Assembly

## 给浏览器一个接近原生性能的计算内核

<div class="cover-meta">
  <span>Wasm 3.0 · 2025-09 定稿</span>
  <span>模块模型 · 线性内存 · 工具链 · 前沿</span>
</div>

<div class="abs-br m-6 flex gap-3 text-xl">
  <a href="https://developer.mozilla.org/en-US/docs/WebAssembly" target="_blank" class="slidev-icon-btn" aria-label="MDN WebAssembly 文档">
    <carbon:document />
  </a>
  <a href="https://github.com/WebAssembly/spec" target="_blank" class="slidev-icon-btn" aria-label="WebAssembly 规范仓库">
    <carbon:logo-github />
  </a>
</div>

<!--
WebAssembly 是一种在浏览器中以接近原生性能运行的低层类汇编语言：紧凑二进制格式，为 C/C++、Rust 等语言提供 Web 编译目标。

时间坐标先立住两点：核心 JS API 自 2017-10 起就是 Baseline Widely available，四大浏览器全支持；规范侧 Wasm 3.0 于 2025-09-17 正式定稿，官方公告原话"已在多数主流浏览器 shipping"。

这一小时我们不背 API 目录，而是回答四个问题：浏览器为什么需要第二种语言、代码和数据怎么进出、什么时候值得用、3.0 之后它还要去哪。
-->

---
layout: default
---

# 为什么浏览器需要第二种语言

<div class="pipeline mt-5">
  <div class="pipeline-step tone-amber">
    <span class="step-no">JavaScript 路径</span>
    <strong>解析文本源码</strong>
    <span>体积大、启动慢</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-amber">
    <strong>解释执行 + JIT 预热</strong>
    <span>热点函数才被优化</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-red">
    <strong>随时可能去优化</strong>
    <span>类型假设破裂，性能回摆</span>
  </div>
</div>

<div v-click class="pipeline mt-3">
  <div class="pipeline-step tone-blue">
    <span class="step-no">WebAssembly 路径</span>
    <strong>紧凑二进制</strong>
    <span>下载体积小、解码快</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-blue">
    <strong>流式编译</strong>
    <span>边下载边编译成机器码</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-green">
    <strong>性能平直可预期</strong>
    <span>接近原生，无去优化回摆</span>
  </div>
</div>

<div class="grid grid-cols-4 gap-3 mt-5">
  <div v-click class="fact"><strong>FFmpeg.wasm</strong><span>浏览器里转码音视频</span></div>
  <div v-click class="fact"><strong>Photoshop Web</strong><span>C++ 图像内核上 Web</span></div>
  <div v-click class="fact"><strong>Figma</strong><span>C++ 渲染与文档引擎</span></div>
  <div v-click class="fact"><strong>Google Earth</strong><span>C++ 地球渲染引擎</span></div>
</div>

<!--
JS 引擎的性能问题不是"慢"，而是"不确定"：先解析大体积文本，再解释执行，热点才被 JIT 优化，而一旦类型假设破裂还会去优化回摆——性能曲线是抖的。

[click] Wasm 换了一条流水线：紧凑二进制在下载过程中就被流式编译成机器码，性能曲线平直可预期。这不是"更快的 JS"，是绕开了 JS 引擎的不确定性。

[click:4] 四个真实落地都遵循同一范式：重活来自久经考验的存量 C/C++ 代码，编译成 Wasm 上 Web——FFmpeg 转码、Photoshop 图像内核、Figma 渲染引擎、Google Earth。JS 做壳、Wasm 做核。
-->

---
layout: default
---

# 不是 JS 替代品："complement and run alongside JavaScript"

<div class="duo mt-6">
  <div class="duo-side tone-blue">
    <em>做壳</em>
    <strong>JavaScript</strong>
    <span>表达力 · DOM · 事件 · 网络请求 · 生态胶水——这些 Wasm 一概做不了</span>
  </div>
  <div class="duo-bridge">
    <span>instance.exports →</span>
    <small>双向调用</small>
    <span>← importObject</span>
  </div>
  <div class="duo-side tone-green">
    <em>做核</em>
    <strong>WebAssembly</strong>
    <span>编解码 · 图像卷积 · 物理求解 · 加密哈希——CPU 密集的纯计算</span>
  </div>
</div>

<div class="grid grid-cols-3 gap-4 mt-6">
  <div v-click class="fact"><strong>沙箱</strong><span>没有任何默认能力，一切经 importObject 显式授予</span></div>
  <div v-click class="fact"><strong>双向</strong><span>JS 调 Wasm 导出，Wasm 调 JS 导入</span></div>
  <div v-click class="fact"><strong>有价</strong><span>每次穿越边界都有成本——后面展开</span></div>
</div>

<div v-click class="takeaway mt-5">MDN："在同一个应用里同时享受 Wasm 的性能与 JS 的表达力——即使你根本不会手写 WebAssembly。"</div>

<!--
官方设计文档的原话是 designed to complement and run alongside JavaScript——互补、并肩运行，从设计之初就不打算取代 JS。

分工非常清晰：JS 负责 DOM、事件、网络和胶水逻辑，Wasm 只负责 CPU 密集的纯计算。注意中间这条边界：JS 通过 instance.exports 调用 Wasm，Wasm 通过 importObject 注入的函数调用 JS。

[click] 沙箱是根基：Wasm 不能碰 DOM、发请求、甚至读不到时间，一切能力都要 JS 显式授予——这也是它能安全运行不可信编译产物的原因，同时解释了为什么"纯 Wasm 网页应用"不成立。

[click] 边界是双向的。
[click] 也是有价的——这是后面成本模型的伏笔。
[click] MDN 这句总结值得整句记住。
-->

---
layout: default
---

# 四大概念：一条编译到实例化的流水线

<div class="pipeline mt-5">
  <div class="pipeline-step tone-blue">
    <span class="step-no">01 · 字节码</span>
    <strong>.wasm</strong>
    <span>紧凑二进制，可流式下载</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-amber">
    <span class="step-no">02 · compile</span>
    <strong>Module</strong>
    <span>无状态：可缓存、postMessage 给 Worker、多次实例化</span>
  </div>
  <carbon:arrow-right class="pipeline-arrow" />
  <div class="pipeline-step tone-green">
    <span class="step-no">03 · instantiate + importObject</span>
    <strong>Instance</strong>
    <span>有状态：一切出口在冻结的 exports 上</span>
  </div>
</div>

<div class="grid grid-cols-2 gap-4 mt-5">
  <div v-click class="type-cell tone-red">
    <code>Memory</code>
    <span>线性内存：buffer 就是 ArrayBuffer，页 = 64KiB，可 grow——Wasm 唯一能读写的数据世界</span>
  </div>
  <div v-click class="type-cell tone-blue">
    <code>Table</code>
    <span>存 funcref 等不透明引用的可增长数组：把"函数指针"关进笼子，支撑间接调用</span>
  </div>
</div>

<div v-click class="takeaway mt-4">类比：Module 是类 / 可执行文件，Instance 是进程——一次编译，多份互相隔离的状态。</div>

<!--
把对象模型读成一条流水线：字节码经 compile 变成 Module，Module 绑定 importObject 后实例化成 Instance。

Module 是无状态的已编译代码，MDN 强调三点：stateless、可经 postMessage 与 Worker 高效共享、可多次实例化。Instance 是有状态的执行实例，所有导出都收在冻结的 exports 对象上。

[click] Memory 是一条从地址 0 开始的连续字节数组，以 64KiB 的页为单位分配增长，JS 侧看到的就是一个 ArrayBuffer。
[click] Table 存函数引用：C/C++ 的函数指针不能把真实地址暴露进内存，只能按索引取引用调用，调用处还校验签名。

[click] 一次 instantiateStreaming 同时产出 module 和 instance：日常只用 instance，module 留着缓存与跨线程复用。还有第五个对象 Global——跨 JS/Wasm、跨模块共享的全局变量，多模块动态链接的枢纽，本页先记四个主角。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 第一次加载运行：一行 instantiateStreaming

::left::

### Wasm 侧（WAT 文本格式）

```wasm
(module
  (import "console" "log" (func $log (param i32)))

  (func (export "add") (param $a i32) (param $b i32) (result i32)
    local.get $a   ;; 压栈
    local.get $b   ;; 压栈
    i32.add)       ;; 弹两值、压入和——栈机模型

  (func (export "logIt")
    i32.const 42
    call $log))    ;; Wasm 调 JS
```

<div v-click class="mini-note mt-3">WAT 与二进制一一对应（wabt 的 wat2wasm 互转）；日常由工具链生成，读懂它 = 能调试产物。</div>

::right::

### JS 侧

```js {1-3|5-8|10-11|all}
const importObject = {
  console: { log: (n) => console.log("Wasm:", n) },
};

const { instance } = await WebAssembly.instantiateStreaming(
  fetch("./add.wasm"), // 边下载边编译
  importObject,
);

instance.exports.add(1, 2); // 3 —— JS 调 Wasm
instance.exports.logIt();   // 42 —— Wasm 调 JS
```

<div v-click class="signal signal-bad mt-3">
  <carbon:warning-alt />
  <span>MIME 必须 application/wasm，否则直接 TypeError——老服务器/CDN 配置是重灾区</span>
</div>

<!--
左边是人类可读的 WAT 文本格式：模块声明一条两级命名空间的导入 console.log，导出 add 和 logIt 两个函数。注意 add 的三条指令——压参、压参、相加，Wasm 是栈机模型。

[click:3] 右边 JS 侧三步：importObject 的结构必须对齐两级命名空间；instantiateStreaming 接受 fetch 的 Promise 直接传入，对下载中的字节流边收边编译；最后从 exports 调用——数值参数直通边界，无需任何转换。

[click] WAT 平时不用手写，但 DevTools 反汇编视图展示的就是它。
[click] 第一个坑现在就记住：流式 API 要求响应头 Content-Type: application/wasm，不满足直接抛 TypeError。另外目前不能用 import 语句直接加载 wasm——ESM 集成还在提案阶段，最后会讲。
-->

---
layout: default
---

# 四个加载入口一张表，错误三兄弟一条线

<table class="decision-table mt-4">
  <thead><tr><th>输入</th><th>只编译 → Module</th><th>编译 + 实例化</th></tr></thead>
  <tbody>
    <tr><td>BufferSource 字节</td><td><code>compile(bytes)</code></td><td><code>instantiate(bytes, imports)</code></td></tr>
    <tr><td>Response 流</td><td><code>compileStreaming(res)</code></td><td><code>instantiateStreaming(res, imports)</code> ← <strong>首选</strong></td></tr>
  </tbody>
</table>

<div v-click class="signal signal-bad mt-4">
  <carbon:warning-alt />
  <span><code>instantiate</code> 双重载陷阱：传字节 resolve 出 <code>{ module, instance }</code>；传已编译 Module resolve 出裸 Instance——对后者解构 <code>.instance</code> 得 undefined</span>
</div>

<div class="grid grid-cols-3 gap-4 mt-4">
  <div v-click class="rule tone-amber"><strong>CompileError</strong><span>解码/验证期：字节损坏、不支持的指令</span></div>
  <div v-click class="rule tone-red"><strong>LinkError</strong><span>实例化/链接期：importObject 缺项、种类/签名不符</span></div>
  <div v-click class="rule tone-blue"><strong>RuntimeError</strong><span>运行期 trap：越界、除零、unreachable、间接调用签名不符</span></div>
</div>

<div v-click class="mini-note mt-4">两个例外：start 函数在实例化时 trap 抛的是 RuntimeError（不是 LinkError）；流式 MIME 不符抛普通 TypeError——错误家族之外的第四种高频失败。</div>

<!--
加载 API 本质是一张 2×2 的表：流式与否、是否顺带实例化。选择逻辑很简单——能流式就流式，不需要分离编译就直接 instantiate；只有"编译一次、多次或跨线程实例化"才值得单独 compileStreaming。

[click] 本页最容易踩的 API 设计坑：instantiate 有双重载，传字节拿 ResultObject，传 Module 拿裸实例，返回结构不同。

[click:3] 三个错误构造器各绑定生命周期的一个阶段，看到错误类型就能定位问题出在哪一环：编译期 CompileError、链接期 LinkError、运行期 trap 是 RuntimeError。trap 的语义是"违反安全模型立即终止"，它不可能被 Wasm 内部吞掉，必然浮到 JS。

[click] 例外要记两个：start 函数的 trap 虽然发生在实例化期，抛的是 RuntimeError；MIME 错抛的是普通 TypeError。另外还有个同步的 validate(bytes)，只验不编译，适合前置检查不可信字节。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 线性内存：一块内存，两个世界的视图

::left::

<div class="boundary-stack mt-2">
  <div class="boundary tone-amber"><carbon:chip /> Wasm 侧：i32.load / i32.store 按字节地址读写</div>
  <carbon:arrow-down />
  <div class="boundary tone-blue"><carbon:data-base /> 线性内存：从 0 开始的连续字节，页 = 64KiB</div>
  <carbon:arrow-down />
  <div v-click class="boundary tone-green"><carbon:code /> JS 侧：memory.buffer 上套 TypedArray / DataView</div>
</div>

<div v-click class="mini-note mt-4">Wasm 没有对象、没有 GC 堆（WasmGC 类型除外）——数值以外的一切数据都走这条内存通道。内存可由 JS new 出来经导入注入，也可由模块声明后导出。</div>

::right::

### 把字符串传给 Wasm 的标准三步

```js {1|3-4|6-7|9-10|all}
const bytes = new TextEncoder().encode("你好，Wasm");

// 1. 在线性内存里"要一块地"（模块导出的分配器）
const ptr = instance.exports.alloc(bytes.length);

// 2. 现建视图，把编码结果复制进线性内存
new Uint8Array(memory.buffer, ptr, bytes.length).set(bytes);

// 3. 只把"指针 + 长度"两个数字传过边界
instance.exports.process(ptr, bytes.length);
```

<div v-click class="mini-note mt-3">反向读回对称：按指针 + 长度建视图，TextDecoder 解码。每一趟都是"编码 + 复制 + 解码"三重成本。</div>

<!--
线性内存是 Wasm 唯一能读写的数据世界。同一块字节，两个世界各有视图：Wasm 侧用 load/store 指令按地址读写，JS 侧对 memory.buffer 这个 ArrayBuffer 套 TypedArray 或 DataView。

[click] JS 侧视图是我们跟 Wasm 交换大块数据的唯一正道。

[click:4] 右边是字符串进 Wasm 的标准三步：TextEncoder 编码成 UTF-8 字节；向模块导出的分配器要一块地；套 Uint8Array 视图复制进去；最后只把指针和长度两个数字传过边界。

[click] 注意成本结构：每一趟字符串传递都是编码、复制、解码三重成本——这是后面"跨边界成本"页的微观来源。实际项目里这套封送多由 wasm-bindgen、Emscripten 胶水自动生成，但成本本身不消失。
-->

---
layout: default
---

# 头号坑：memory.grow 之后，旧视图全部作废

````md magic-move {at:1}
```js
// 缓存了一个视图……
const u8 = new Uint8Array(memory.buffer);

memory.grow(1); // 引擎可能整体搬迁内存

u8[0]; // ❌ 旧 buffer 已 detach（长度归零），视图作废
```

```js
memory.grow(1); // 旧 ArrayBuffer 被 detach

// ✅ 增长后重取 buffer、重建视图（视图创建本身很廉价）
const fresh = new Uint8Array(memory.buffer);

fresh[0]; // 正常读写
```
````

<div class="grid grid-cols-3 gap-4 mt-6">
  <div v-click class="fact"><strong>用时现建</strong><span>不要长期缓存 TypedArray 视图</span></div>
  <div v-click class="fact"><strong>统一刷新</strong><span>每个可能触发增长的调用之后重建</span></div>
  <div v-click class="fact"><strong>更隐蔽的形态</strong><span>Wasm 代码内部的 memory.grow 同样触发失效</span></div>
</div>

<div v-click class="takeaway mt-5">非 shared 内存 grow 必 detach 旧 buffer——"缓存旧视图"是 Wasm 应用的头号崩溃源。</div>

<!--
线性内存可以 grow，但非 shared 的内存增长时，引擎可能把整块内存搬到新地址——旧的 ArrayBuffer 会被 detach，长度归零，基于它创建的所有 TypedArray 视图随之作废。

[click] 修复姿势：增长之后重新读取 memory.buffer、重建视图。视图创建本身非常廉价，所以工程守则是"用时现建"。

[click:3] 三条守则里最后一条最阴险：JS 侧一行 grow 都没写，但 Wasm 代码内部执行了 grow 指令，你缓存的视图照样失效——排查时想不到这一层。

[click] 一句话带走：不要长期缓存视图。顺带一提，shared: true 的共享内存 buffer 是 SharedArrayBuffer，配合原子指令支撑多线程，那是另一个话题。
-->

---
layout: default
class: lab-slide
---

# 交互实验：52 字节，真实的 WebAssembly

<WasmLab />

<div class="mini-note mt-3">没有模拟：进入本页时 <code>WebAssembly.instantiate</code> 编译并实例化了一个手工汇编的 52 字节模块——上面的状态栏就是它的 Module/Instance 真实状态。</div>

<!--
这个组件里没有任何模拟：页面加载时，一个手工逐字节汇编的 52 字节 Wasm 模块被真实地编译和实例化——状态栏显示实例化耗时、导出清单和一页 64KiB 的线性内存。

现场演示两件事。左边：改两个数字点"调用 Wasm"，走的是 instance.exports.add，数值直通边界——让观众输入 2147483647 加 1，返回 -2147483648，这是 i32 溢出回绕的真实语义，顺带证明这不是 JS 在算。

右边：输入一段中文点"写入"，TextEncoder 编码后经 Uint8Array 视图写进线性内存地址 0，再读回十六进制和解码结果——上一页说的"一块内存两个视图"就是这几行代码。注意组件内部每次都是现建视图，实践了 grow 那页的守则。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 边界的两份契约：importObject 进，exports 出

::left::

### 进：两级命名空间，四种实体

```js {2-4|5-8|all}
const importObject = {
  env: {
    // 函数：Wasm 内 call 时同步调入 JS
    log: (n) => console.log(n),
    // Memory / Table / Global 同样可注入
    memory: new WebAssembly.Memory({ initial: 10 }),
    table: new WebAssembly.Table({ initial: 2, element: "anyfunc" }),
    counter: new WebAssembly.Global({ value: "i32", mutable: true }, 0),
  },
};
```

<div v-click class="mini-note mt-3">匹配逐条严格核对：声明 <code>(import "env" "log" …)</code> 就必须有 <code>importObject.env.log</code>，且种类/签名匹配——缺给或给错 LinkError，多给忽略。</div>

::right::

### 出：exports 三种形态 + 反射

```js {1-4|6-8|all}
instance.exports.add(1, 2);          // 函数：真正的 JS 函数
new DataView(instance.exports.memory.buffer); // 内存：套视图
instance.exports.table.get(0)();     // 表：取引用再调用
// exports 是冻结对象，名字由 Wasm 侧 (export "…") 决定

// 陌生模块先"看"再动手——不实例化即可反射声明
WebAssembly.Module.imports(mod); // [{ module:"env", name:"log", … }]
WebAssembly.Module.exports(mod); // [{ name:"add", kind:"function" }]
```

<div v-click class="signal signal-good mt-3">
  <carbon:security />
  <span>沙箱本质：importObject 就是 Wasm 的全部世界——连时间都要经导入注入</span>
</div>

<!--
边界由两份契约构成。进的一侧：模块的每条导入都是两级名字，importObject 按这两级组织；能注入的不只函数——Memory、Table、Global 四种实体都可以。

[click] 实际工程中 importObject 几乎都由工具链胶水生成（Emscripten 的 env、wasm-bindgen 的 __wbindgen 一族），手写主要在教学与自定义嵌入。

[click:2] 出的一侧：导出函数在 JS 里是真正的函数对象，可以存变量传回调；导出内存套视图；导出表按索引取引用。类型映射记一条特例——i64 对应 BigInt，传 Number 抛 TypeError。

[click] 拿到陌生模块先用 Module.imports/exports 反射看清单，再写 importObject。
[click] 回扣沙箱：这份显式注入的清单就是模块能力的全集，最小权限天然成立。
-->

---
layout: default
---

# 跨边界成本：收益的天花板

<table class="decision-table mt-4">
  <thead><tr><th>数据</th><th>传递方式</th><th>成本</th></tr></thead>
  <tbody>
    <tr><td><code>i32</code> / <code>f32</code> / <code>f64</code></td><td>直通</td><td>≈ 0，一次装箱都没有</td></tr>
    <tr v-click><td><code>i64</code></td><td>↔ BigInt</td><td>低（BigInt 装箱）</td></tr>
    <tr v-click><td>字符串</td><td>编码 → 复制进线性内存 → 解码</td><td><strong>三重成本</strong>，随长度线性</td></tr>
    <tr v-click><td>对象 / 结构体</td><td>序列化传值，或句柄传引用</td><td>最高；句柄每次操作都回跨一次</td></tr>
    <tr v-click><td>大块二进制</td><td>TypedArray 视图直写线性内存</td><td>一次复制——最优批量路径</td></tr>
  </tbody>
</table>

<div v-click class="takeaway mt-4">收益公式：收益 = 计算加速赚到的时间 − 跨边界调用与数据复制花掉的时间</div>

<div v-click class="signal signal-bad mt-3">
  <carbon:warning-alt />
  <span>同一个功能："传 10MB 进去、算完传回"（2 次复制）与"循环十万次传小字符串"（十万次编解码）差几个数量级——边界要粗粒度、批量化</span>
</div>

<!--
边界不是免费的，价格分档：数值直通几乎零成本；i64 有 BigInt 装箱；字符串每趟都是编码、复制、解码三重成本；对象最贵——要么序列化双向复制，要么句柄传引用、每次实际操作都再跨一次边界；大块二进制走视图直写，一次复制就是最优批量路径。

[click:5] 由此得出 Wasm 的收益公式：计算加速赚到的时间，减去边界调用与数据复制花掉的时间。计算密集加边界交互少，才是正收益场景。

[click] 接口设计决定成败：同样的功能，粗粒度批量化与高频细粒度能差几个数量级——"用了 WASM 反而更慢"的头号原因就在这。wasm-bindgen 的句柄对象还有生命周期责任：JS 长期持有要记得调 free()，FinalizationRegistry 只是兜底。
-->

---
layout: default
---

# 工具链三主线：.wasm 从哪来

<table class="decision-table mt-4">
  <thead><tr><th>维度</th><th>Emscripten</th><th>wasm-bindgen + wasm-pack</th><th>AssemblyScript</th></tr></thead>
  <tbody>
    <tr><td>源语言</td><td>C / C++</td><td>Rust</td><td>TS 语法子集（不是 TS）</td></tr>
    <tr v-click><td>JS 调用面</td><td>胶水 <code>Module.ccall</code> / <code>cwrap</code></td><td>npm 包：<code>import init</code> 后必须 <code>await init()</code></td><td>ESM 导出 + loader</td></tr>
    <tr v-click><td>强项</td><td>POSIX/OpenGL 模拟层，存量库"原样"上 Web</td><td>npm 产物 + 类型声明，<strong>前端生态融合最好</strong></td><td>零新语言门槛，产物小</td></tr>
    <tr v-click><td>弱项</td><td>胶水体积与风格自成一派</td><td>需要团队 Rust 储备</td><td>性能与生态弱于前两者</td></tr>
    <tr v-click><td>选它当</td><td>FFmpeg / OpenCV / SQLite 移植</td><td>新写解析器、加密、图像模块</td><td>前端团队小步试水</td></tr>
  </tbody>
</table>

<div v-click class="mini-note mt-4">Kotlin / Dart（Flutter Web）等 GC 语言不在此表——它们踩着 WasmGC 落地，框架把加载封送全包（下两页展开）。</div>

<div v-click class="takeaway mt-3">决策：C/C++ 存量库 → Emscripten；新写高性能模块 → Rust；试水 → AssemblyScript。</div>

<!--
手写 WAT 只是教学姿势，生产中的 .wasm 全部来自编译器。三条主线按"你手里是什么代码"选。

[click] 调用面差异很实操：Emscripten 不直接碰 exports，走胶水的 ccall/cwrap，字符串封送自动完成；wasm-pack 的产物是规范 npm 包——web 目标必须先 await init()，target 选错是"函数是 undefined"的头号原因；AssemblyScript 是 npm 原生工作流。

[click] Emscripten 比 Wasm 标准还老，POSIX 模拟层（虚拟文件系统、OpenGL 转 WebGL、pthread 映射 Worker）无可替代——FFmpeg、SQLite 能"原样"上 Web 靠的就是它。Rust 路线产物带 .d.ts、使用方完全无感知 Rust 存在。

[click] AssemblyScript 要做预期管理：它是带 i32/f64 标注的 TS 语法子集，闭包、union、JS 内建大量不可用，存量 TS 业务代码不能直接拿来编。

[click:3] 决策一句话收束；GC 语言阵营下两页展开。
-->

---
layout: default
---

# Wasm 3.0：十年来最大的一次版本

<div class="release-grid mt-5">
  <div class="release-hero">
    <span class="release-label">2025-09-17 · W3C CG/WG 定稿</span>
    <strong>3.0</strong>
    <span>官方公告："已在多数主流浏览器 shipping"——十大特性一次定稿收编</span>
  </div>
  <div v-click class="release-detail tone-blue">
    <carbon:chip />
    <strong>内存与数据</strong>
    <span>GC 托管堆 · memory64 · 多内存</span>
  </div>
  <div v-click class="release-detail tone-green">
    <carbon:flow />
    <strong>控制流与类型</strong>
    <span>尾调用 · 异常处理（try_table + exnref，JS 侧 Tag/Exception 双向抛接）· 类型化引用 call_ref</span>
  </div>
  <div v-click class="release-detail tone-amber">
    <carbon:calculator />
    <strong>数值与工程</strong>
    <span>relaxed SIMD · 确定性 profile · 自定义注解 · JS String Builtins（Wasm 直操作 JS 字符串）</span>
  </div>
</div>

<div v-click class="takeaway mt-5">正确姿势：3.0 是对已陆续发货提案的"定稿收编"——GC 早在 2023-10 就上了 Chrome；规范追认实现是 Wasm 的一贯节奏。</div>

<!--
2025 年 9 月 17 日，Wasm 3.0 正式定稿。这不是预览或草案——公告原话"已在多数主流浏览器 shipping"，Wasmtime 等独立引擎也接近完成。

[click] 十大特性按三组记：内存与数据——托管堆入场、4GB 天花板打破、单模块多地址空间。
[click] 控制流与类型——尾调用让栈不增长（函数式语言与解释器 dispatch 的刚需，Chrome 112 / Firefox 121 / Safari 18.2 已齐）；异常处理原生化，JS 侧 Tag 和 Exception 双向抛接，JSTag 让 Wasm 能识别 JS 异常；类型化引用让 call_ref 免运行时签名检查。注意 trap 不是异常——try_table 不捕获 trap。
[click] 数值与工程——relaxed SIMD 用确定性换性能；确定性 profile 服务可复现计算；JS String Builtins 让 WasmGC 语言直接操作 JS 字符串，省一趟编解码。

[click] 理解节奏：规范追认实现。2.0 也是 2025-03 才走完流程。3.0 还是第一个用 SpecTec 机器可检查形式化规范产出的版本——规范本身的正确性也工程化了。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# WasmGC：GC 语言上 Web 的转折点

::left::

<div class="rule-stack mt-2">
  <div class="rule tone-red"><strong>过去</strong><span>GC 语言上 Wasm 要自带整个 GC 运行时——几 MB 起步，且与 JS 堆互不知情，跨堆循环引用可能泄漏</span></div>
  <div v-click class="rule tone-green"><strong>现在</strong><span>struct/array 直接分配在引擎托管堆，浏览器久经调优的 GC 替你收垃圾——体积、性能、正确性三重收益</span></div>
  <div v-click class="rule tone-blue"><strong>刻意低层</strong><span>只有"形状"（struct/array + 子类型），没有类/接口/虚表——高层语义留给编译器</span></div>
</div>

<div v-click class="takeaway mt-4">不是"Wasm 里写 Java"，而是"Java 编译器多了一个高质量后端"。</div>

::right::

### 谁在用

<div class="rule-stack mt-2">
  <div v-click class="fact"><strong>Kotlin/Wasm</strong><span>Compose Multiplatform 的 Web 目标，KMP 共享逻辑直达浏览器</span></div>
  <div v-click class="fact"><strong>Dart · Flutter Web</strong><span>Wasm 渲染模式替代"编译成 JS"路线，性能与一致性显著改善</span></div>
</div>

<div v-click class="mini-note mt-3">官方公告点名受益语言：Java · OCaml · Scala · Kotlin · Scheme · Dart</div>

<div v-click class="flex items-center gap-2 mt-4">
  <div class="state-node">Chrome 119<br>2023-10</div>
  <carbon:arrow-right class="text-gray-400" />
  <div class="state-node">Firefox 120</div>
  <carbon:arrow-right class="text-gray-400" />
  <div class="state-node success">Safari 18.2<br>2024-12</div>
</div>

<div v-click class="mini-note mt-3">约 2024 末达跨浏览器 Baseline——今天可按"可用"设计。</div>

<!--
3.0 里对语言格局影响最大的就是 GC。它给 Wasm 增加了与线性内存并列的第二种存储：引擎托管堆。

[click] 过去 Kotlin、Dart 上 Wasm 要么把整个 GC 运行时编译进产物，体积几 MB 起步，还有跨堆循环引用泄漏的风险；现在分配与回收全交给浏览器的 GC。
[click] 注意它刻意保持低层：只有 struct、array 和子类型这些"形状"，类、接口、虚表这些语言语义留给编译器。配套的类型化引用让 call_ref 做免检间接调用，是 GC 语言虚调用的性能底座。
[click] 所以正确理解是：Java 编译器多了一个高质量后端。

[click:2] 前端能直接感知的两个落地：Kotlin/Wasm 和 Flutter Web 的 Wasm 渲染模式。这些框架用户不直接操作 WebAssembly API，但判断"靠不靠谱"时你现在知道底层支柱是什么。
[click] 官方点名六门语言。
[click:2] 落地节奏：Chrome 119 抢跑，Safari 18.2 收尾，约 2024 年末达成 Baseline。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 地址空间两次扩容：memory64 与多内存

::left::

### memory64：打破 4GB 天花板

<div class="rule-stack mt-2">
  <div class="rule tone-blue"><strong>i32 → i64</strong><span>内存与表的地址类型升级，理论地址空间 16EB</span></div>
  <div v-click class="rule tone-amber"><strong>Web 端上限 16GB</strong><span>浏览器场景的真实叙事是 4GB → 16GB：视频编辑、CAD、科学数据集有了余量</span></div>
</div>

<div v-click class="mini-note mt-3">64 位内存的地址在 JS 边界以 BigInt 表达；完整大地址红利属于服务端/独立运行时。</div>

::right::

### 多内存：单模块多块地址空间

```wasm
(module
  (import "js" "mem0" (memory 1))  ;; 第 0 块：导入
  (memory $mem1 1)                 ;; 第 1 块：自声明
  (data (memory 1) (i32.const 0) "私有数据"))
```

<div class="grid grid-cols-3 gap-2 mt-3">
  <div v-click class="fact"><strong>安全分区</strong><span>敏感数据物理隔离</span></div>
  <div v-click class="fact"><strong>静态链接</strong><span>多模块合并各留内存</span></div>
  <div v-click class="fact"><strong>插桩检测</strong><span>观测数据不污染被测对象</span></div>
</div>

<!--
两个 2025-09 随 3.0 定稿的内存能力，改写了"一个模块恰好一块 32 位内存"的旧世界。

memory64 把地址类型从 i32 升到 i64。[click] 但注意公告里的关键限定：Web 实现把 64 位内存上限定在 16GB——浏览器场景的真实叙事不是 16EB，而是打破此前 4GB 的天花板。
[click] 使用侧记一条：64 位地址在 JS 边界以 BigInt 表达。

右边多内存：单模块可以声明或导入多块内存，data、load、store 指令都带内存索引，还能跨内存直接复制。
[click:3] 公告点名三类用途：安全分区、工具链静态链接、插桩检测。此前想要"两块内存"只能拆成两个模块绕行，成本高昂。
-->

---
layout: default
---

# JSPI：同步风格的代码，异步地跑

```js {1-4|6-8|10-11|all}
// 1. 返回 Promise 的 JS 函数 → 包成"可挂起导入"
const httpGet = new WebAssembly.Suspending(async (ptr, len) => {
  return (await fetch(readString(ptr, len))).status;
});

// 2. 注入后，Wasm 以同步姿势调用——引擎在边界挂起整个 Wasm 栈
const { instance } = await WebAssembly
  .instantiateStreaming(fetch("app.wasm"), { env: { http_get: httpGet } });

// 3. 导出包成 promising → 返回 Promise 的普通 JS 异步函数
await WebAssembly.promising(instance.exports.main)(); // 主线程不阻塞
```

<div v-click class="takeaway mt-4">心智模型：写起来是同步的，跑起来是异步的——C/C++/Rust 存量同步代码零改造对接 Promise 世界（旧方案 Asyncify 全量代码变换，体积 +50% 起）。</div>

<div v-click class="signal signal-bad mt-3">
  <carbon:warning-alt />
  <span>Chrome 137+ / Firefox 139+ 已发货；<strong>Safari 未支持</strong>——Interop 2026 重点项；覆盖 Safari 需保留 Asyncify 退路或特性检测降级</span>
</div>

<!--
JSPI 解决一个工具链级的老大难：C/C++/Rust 存量代码是同步风格——读、阻塞、返回；而 Web 的 IO 全是 Promise 异步。

[click:3] 三件套分步看：Suspending 把返回 Promise 的 JS 函数包成"可挂起导入"——Wasm 内部以同步姿势调用它时，引擎挂起整个 Wasm 栈，Promise 落定后恢复；promising 反向把 Wasm 导出包成返回 Promise 的普通异步函数。还有个 JSTag 用于在 Wasm 内识别 JS 异常。

[click] 心智模型一句话：写起来同步、跑起来异步，源语言零改造。对"把 SQLite、语言解释器、游戏引擎搬上 Web 还要做 IO"是质变级能力——旧方案 Asyncify 靠 Emscripten 全量代码变换，体积加 50% 起步。

[click] 支持现状务必记住：Chrome 和 Firefox 已正式发货，Safari 还没有——它是 Interop 2026 重点项，预期年内补齐；在那之前跨浏览器产品仍需 Asyncify 退路。
-->

---
layout: two-cols-header
layoutClass: gap-x-8 grid-rows-[88px_1fr]
---

# 还在路上：ESM 集成与浏览器外的野心

::left::

### ESM 集成（提案推进中）

```js
// 目标：.wasm 成为模块图的一等公民
import { fn } from "./mod.wasm";

// source phase：只拿编译好的 Module，导入自己注入
import source mod from "./mod.wasm";
```

<div v-click class="signal signal-bad mt-3">
  <carbon:warning-alt />
  <span>Chrome/Firefox 仅原型；MDN 原话 "not yet integrated"——生产路径仍是 fetch + instantiateStreaming</span>
</div>

<div v-click class="mini-note mt-3">打包器的 wasm import（webpack asyncWebAssembly 等）是打包器私有能力，别当平台标准。</div>

::right::

### 浏览器之外

<div class="rule-stack mt-2">
  <div v-click class="fact"><strong>WASI</strong><span>标准系统接口（文件/网络/时钟），能力安全——"没有浏览器也能跑"的官方答案</span></div>
  <div v-click class="fact"><strong>组件模型</strong><span>跨语言组件的接口类型与组合，WASI 0.2+ 的地基——Rust 组件调 Go 组件不再手工对齐内存布局</span></div>
  <div v-click class="fact"><strong>Branch Hinting</strong><span>给引擎标注分支冷热、摆布热路径——2026 进入 Baseline</span></div>
</div>

<div v-click class="mini-note mt-3">边缘函数、插件系统（Envoy / Figma 式架构）、Serverless 冷启动——你部署的可能已经是 Wasm。</div>

<!--
平台缝合还有未竟事项。ESM 集成的目标是让 .wasm 成为模块图一等公民：直接 import，浏览器接管 fetch、编译、链接；配套的 source phase imports 只拿编译好的 Module，importObject 留给你自己注入。

[click] 现状要冷静：Chrome/Firefox 只有原型，MDN 至今写着 not yet integrated——生产路径仍是 fetch 加 instantiateStreaming。
[click] 打包器的 wasm import 是私有能力，别误当平台标准。

[click:3] 浏览器之外的两块地基：WASI 标准化系统接口，让 Wasm 在 Wasmtime 等独立运行时里以能力安全的方式跑；组件模型定义跨语言组件的接口类型。都不属于浏览器 3.0 范畴，但边缘函数、插件系统、Serverless 里你部署的可能已经是 Wasm。Branch Hinting 则是 3.0 定稿后第一批完成收敛的小提案，2026 进 Baseline。

[click] 浏览器学到的对象模型与边界思维，在这些场景原样适用。
-->

---
layout: default
---

# 用不用 WASM：一张决策图

<div class="transform-source mx-auto mt-4" style="max-width: 480px;">
  <span>第一问</span>
  <code>先 profile：瓶颈真的在 CPU 计算吗？</code>
</div>

<div class="flex justify-center my-2">
  <carbon:arrow-down class="text-gray-400" />
</div>

<div class="grid grid-cols-3 gap-4">
  <div v-click class="rule tone-green"><strong>是：CPU 密集</strong><span>存量 C/C++/Rust 库 → Emscripten 移植；新写模块 → Rust；小步试水 → AssemblyScript</span></div>
  <div v-click class="rule tone-red"><strong>否：DOM / 网络 / 首屏</strong><span>Wasm 碰不到 DOM，提速的不是你的瓶颈——继续 JS + 架构优化</span></div>
  <div v-click class="rule tone-amber"><strong>否：GPU 并行渲染</strong><span>大规模并行图形 / GPGPU 是 WebGPU 的地盘——CPU 加速器解决不了 GPU 问题</span></div>
</div>

<div v-click class="takeaway mt-5">两大正当理由：<strong>复用存量原生库</strong>；<strong>大块数据 + 长计算 + 少交互</strong>。几十行 JS 热点先试算法优化——现代 JIT 对数值循环非常强，"觉得 JS 慢"不是证据。</div>

<!--
收束成一张决策图。第一问不是"要不要用 Wasm"，而是"瓶颈在哪"——先 profile，感觉不算证据。

[click] 瓶颈确实在 CPU 计算：手里有存量 C/C++/Rust 库就 Emscripten 移植——不用 Wasm 的替代方案是整库重写；新写高性能模块选 Rust；前端团队试水选 AssemblyScript。

[click] 瓶颈在 DOM、网络、首屏：Wasm 一个都救不了，每次 DOM 更新还要跨回 JS——框架渲染逻辑放 Wasm 是负优化，Figma 也只把渲染引擎放 Wasm，UI 层是 TS。

[click] GPU 并行是 WebGPU 的地盘，别拿 CPU 加速器硬扛。

[click] 两大正当理由收束：复用存量原生库；profile 实证的大块数据长计算。团队语言储备也是成本——为 20% 的性能引入整条 Rust 工具链，多数业务不划算。
-->

---
layout: default
---

# 易错点 TOP：一眼识别的翻车现场

<div class="grid grid-cols-3 gap-3 mt-5">
  <div class="fact"><strong>流式加载 TypeError</strong><span>MIME 非 application/wasm——回退 arrayBuffer + instantiate</span></div>
  <div v-click class="fact"><strong>解构出 undefined</strong><span>instantiate 传 Module 拿裸 Instance，没有 .instance 包装</span></div>
  <div v-click class="fact"><strong>旧视图突然作废</strong><span>grow() detach 旧 buffer——视图用时现建</span></div>
  <div v-click class="fact"><strong>i64 传了 Number</strong><span>跨边界一律 BigInt：fn(42n) 不是 fn(42)</span></div>
  <div v-click class="fact"><strong>Wasm 反而更慢</strong><span>高频小调用 + 字符串进出——边界要粗粒度、批量化</span></div>
  <div v-click class="fact"><strong>Worker 传不过去</strong><span>只有 Module 可结构化克隆；Instance 与非 shared Memory 不可</span></div>
</div>

<div v-click class="signal signal-bad mt-5">
  <carbon:warning-alt />
  <span>还有一个不是 bug 的"bug"：模块里拿不到 console / fetch / 时间——Wasm 没有任何默认能力，这是沙箱模型本身</span>
</div>

<!--
临走前把高频翻车现场排成一排，见到症状直接对号入座。

流式加载抛 TypeError，先查响应头 MIME。
[click] 解构 .instance 得 undefined，是 instantiate 双重载踩混了。
[click] 视图突然读写报错，查最近有没有 grow——包括 Wasm 内部的。
[click] i64 参数一律 BigInt，42n 不是 42。
[click] "用了 Wasm 更慢"几乎都是接口设计问题：高频细粒度调用加字符串进出，边界成本吃光收益。
[click] 跨线程只有 Module 能传，正确姿势是传 Module 各自实例化，或用 shared memory。

[click] 最后这条最常被当成 bug 报：模块里拿不到 console、fetch、时间——不是坏了，是沙箱模型本身。一切能力都要经 importObject 显式注入。
-->

---
layout: center
class: summary-slide
---

# 带走四个判断

<div class="summary-grid mt-8">
  <div><span>01</span><strong>配套加速器，不是替代品</strong><small>JS 做壳、Wasm 做核——分工由沙箱与能力模型决定</small></div>
  <div><span>02</span><strong>边界有价</strong><small>数值直通，其余走线性内存——粗粒度、批量化是第一架构原则</small></div>
  <div><span>03</span><strong>一次编译，多份状态</strong><small>Module 无状态可共享缓存；Instance 有状态互相隔离</small></div>
  <div><span>04</span><strong>按阶段判错</strong><small>CompileError / LinkError / RuntimeError，外加 MIME 的 TypeError</small></div>
</div>

<div class="resource-row mt-8">
  <a href="https://developer.mozilla.org/en-US/docs/WebAssembly" target="_blank"><carbon:book /> MDN WebAssembly</a>
  <a href="https://webassembly.org/news/2025-09-17-wasm-3.0/" target="_blank"><carbon:rocket /> Wasm 3.0 公告</a>
  <a href="https://webassembly.org/features/" target="_blank"><carbon:table /> 特性支持活表</a>
  <a href="https://github.com/WebAssembly/spec" target="_blank"><carbon:logo-github /> 规范仓库</a>
</div>

<!--
四句话复盘：它是 JS 的配套加速器，分工由沙箱决定；边界有价，接口要粗粒度批量化；Module 与 Instance 是"类与进程"的关系，一次编译多份隔离状态；报错先看类型，阶段自然浮现。

资源四个入口：MDN 是概念与 JS API 的主信源；3.0 公告是十大特性的一手描述；特性活表查逐浏览器支持（配合 wasm-feature-detect 做运行时检测）；规范仓库看提案演进。

下一步动手建议：用 Emscripten 或 wasm-pack 把一个真实的小库编上 Web，亲手量一次边界成本——收益公式会从幻灯片变成你的直觉。
-->
