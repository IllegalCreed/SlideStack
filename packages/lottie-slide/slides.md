---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Lottie
info: |
  Presentation Lottie — AE 动画导出为 JSON 的运行时方案，及新一代 dotLottie。

  Learn more at [https://lottie.airbnb.tech/](https://lottie.airbnb.tech/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎬</span>
</div>

<br/>

## Lottie — AE 动画到 Web/移动的 JSON 运行时方案

AE 导出 JSON，运行时原生渲染，体积小、可编程控制

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/airbnb/lottie-web" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Lottie —— 一句话定位：Adobe After Effects 里做的动画，经 Bodymovin 插件导出成 JSON，再由跨平台运行时原生解析渲染，本质是设计师在 AE 里做动画，导出即交付，工程师不用手工用 CSS 或代码重新实现一遍。

2026 年的背景：经典的 lottie-web 已经到 5.13，装机量仍是最大；但 LottieFiles 官方研发重心已经转向新一代的 dotLottie 生态，两代方案会长期并存。

顺序：定位 → 工作流 → lottie-web 核心 API → 渲染器选型 → 播放控制 → 事件与片段 → dotLottie 格式 → 播放器 API → 状态机 → Web Component → 框架集成 → 交互库 → 性能 → 易错点 → 选型对比 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# Lottie 是什么？

**一句话**：AE 里做动画 → Bodymovin 插件导出 JSON → 运行时（lottie-web 等）原生解析渲染

<v-clicks>

- 矢量：任意缩放不失真，非逐帧位图
- 跨平台像素级一致：Web / iOS / Android / RN 同一份 JSON
- 体积远小于同等复杂度的视频/GIF
- 运行时可编程：改颜色、控速度、监听事件、跳段播放

</v-clicks>

<div v-click class="mt-4 text-sm">

> `lottie-web`（经典，装机量最大）与 `dotLottie`（LottieFiles 主推新一代）两代并存：2026 年新项目官方推荐 dotLottie 生态，但存量项目/教程仍大量基于 lottie-web，两套 API 都要掌握

</div>

<!--
Lottie 是什么，一句话：AE 里做动画，装 Bodymovin 或新版 Lottie 插件导出 JSON，前端用运行时原生解析渲染，不是录屏也不是让工程师照着图重新写一遍代码。

它解决的是设计到工程的保真度加效率问题：矢量意味着任意缩放不失真；同一份 JSON 在 Web、iOS、Android、React Native 上渲染出来像素级一致；体积比同等复杂度的视频或 GIF 小得多；而且运行时是可编程的，能改颜色、控制速度、监听事件、只播放某个片段。

代价是 JSON 里塞的是图层树加关键帧，不是声明式描述，AE 的部分高级特性比如表达式、3D 图层、某些蒙版混合模式，并非所有平台和渲染器都等价支持。

最后强调一下代际关系：lottie-web 是成熟期的经典库，dotLottie 是官方主推的下一代方案，2026 年官方建议新项目走 dotLottie，但两套 API 都要懂，因为网上教程和存量项目大量还是 lottie-web。
-->

---

# 工作流与生态

```text
After Effects 设计动画 ──▶ Bodymovin/Lottie 插件导出 .json ──▶ lottie-web 加载播放
                                                    │
                                                    └──▶ 打包为 .lottie（dotLottie 容器）
```

<v-clicks>

- **LottieFiles** 平台三块能力：Creator（在线编辑切图层级）、动画市场（海量免费/付费现成动画）、Integrations（Figma/Webflow/Framer 插件）
- `lottie.host`：LottieFiles 提供的 `.lottie`/`.json` 文件托管 CDN
- 历史小知识：lottie-web 早期就叫 **bodymovin**，`bodymovin.loadAnimation()` 是遗留别名，现统一用 `lottie.loadAnimation()`

</v-clicks>

<!--
工作流：设计师在 After Effects 里做动画，装 Bodymovin（或新版 Lottie）插件导出 .json，前端用 lottie-web 加载播放；也可以用 LottieFiles 工具链把 json 进一步打包成 .lottie 压缩容器，这是下一代格式，后面会专门讲。

生态方面，LottieFiles 平台提供三块能力：Creator 在线编辑器可以切图层级，动画市场有海量现成动画可以直接搜索下载，Integrations 提供 Figma、Webflow、Framer 等设计工具插件。lottie.host 是他们提供的文件托管 CDN，官方示例经常直接引用上面的地址。

一个历史小知识：lottie-web 早期项目名就叫 bodymovin，所以 bodymovin.loadAnimation 是遗留下来的别名，现在统一用 lottie.loadAnimation，两者等价但推荐用新名字。
-->

---

# lottie-web 核心 API：loadAnimation

```js
import lottie from "lottie-web";

const animation = lottie.loadAnimation({
  container: document.getElementById("box"), // 必需，DOM 容器
  renderer: "svg", // 'svg' | 'canvas' | 'html'，默认 svg
  loop: true, // true / false / 数字
  autoplay: true, // 加载完立即播放
  path: "data.json", // 与 animationData 二选一、互斥
  name: "myAnimation", // 可选命名，便于多实例管理
});
```

<v-clicks>

- `container` 须提前用 CSS 设好宽高，否则容器塌陷、动画不可见（最高频"不显示"问题）
- `path` 与 `animationData` 互斥，同时传只有一个生效
- 含 repeater 且复用同一份 `animationData` 多次调用时必须**深克隆**
- 返回 `AnimationItem` 实例，后续播放控制都在它上面调用

</v-clicks>

<!--
lottie-web 的核心入口是 loadAnimation。container 是必需参数，是承载动画的 DOM 容器；renderer 三选一，默认 svg；loop 支持布尔值或数字次数；path 和 animationData 二选一传动画数据源，两者互斥。

四个易错提醒：第一，container 必须提前用 CSS 设好宽高，这是最高频的"为什么不显示"问题，因为容器没尺寸就直接塌陷了。第二，path 和 animationData 不能同时传。第三，如果动画里含 repeater，且要用同一份 animationData 对象多次调用 loadAnimation，必须先深克隆，否则多个实例会互相污染状态。第四，loadAnimation 返回的 AnimationItem 实例，是后面所有播放控制方法调用的对象。
-->

---

# 渲染器选型：svg / canvas / html（重点）

| 维度 | svg（默认） | canvas | html |
|---|---|---|---|
| 渲染方式 | SVG DOM 节点树 | 位图绘制 | DOM 元素拼接 |
| 可 CSS 控制 | 是，可选中子节点改样式 | 否 | 部分 |
| 复杂动画性能 | 节点多时下降 | 更好（无节点树） | 最差 |
| track matte / expanded masks | **仅 svg 支持** | 不支持 | 不支持 |
| text as font（真实字体） | 支持 | **不支持**（只能字形轮廓） | 支持 |
| 3D 图层 | 不支持 | 不支持 | 部分支持 |

<div v-click class="mt-3 text-sm">

> 选型口径：默认用 **svg**（图标级/需 CSS 联动）；图层多、纯展示切 **canvas** 换性能；**html** 用得最少，仅特殊字体排版场景考虑

</div>

<!--
渲染器选型是 Lottie 里最重要的性能决策，三选项：svg、canvas、html。

svg 是默认渲染器，生成真正的 SVG DOM 节点树，好处是可以直接用 CSS 选中子节点改样式，缺点是图层形状一多，DOM 节点暴涨，性能下降。canvas 是纯位图绘制，不生成节点树，复杂动画性能更好，但没法用 CSS 控制，而且文字层只能走字形轮廓渲染，不能用真实字体排版。html 用 DOM 元素拼接，性能最差，用得最少。

两个渲染器专属能力要记住：track matte 和 expanded masks 这两种蒙版技巧只有 svg 渲染器支持；3D 图层三个渲染器基本都不支持，html 只部分支持。

选型口径：图标级、需要 CSS 联动或无障碍场景用 svg；图层多、纯展示不需要 CSS 交互，切 canvas 换性能；html 渲染器只在需要真实字体排版文字层等特殊场景才考虑。
-->

---

# rendererSettings 与体积优化

```js
lottie.loadAnimation({
  container,
  renderer: "svg",
  rendererSettings: {
    preserveAspectRatio: "xMidYMid meet", // SVG 视口对齐方式
    progressiveLoad: true, // 仅 svg：按需创建 DOM 节点，加快首次渲染
    hideOnTransparent: true, // 仅 svg：透明度为 0 时直接隐藏
    className: "my-anim", // 附加到根节点的 class
  },
});
```

<v-clicks>

- 仅 canvas 生效：`context`（外部传入 2D context）、`clearCanvas`（每帧是否清空）
- 体积优化：**light 构建**（`lottie_light.min.js`，去 Expressions 插件）体积更小，**full 构建**含表达式支持
- rollup 产物覆盖 UMD/ESM/CJS，按需选 full/light/svg-only/canvas-only 变体

</v-clicks>

<!--
rendererSettings 是渲染器的细粒度配置。preserveAspectRatio 控制 SVG 视口对齐方式；progressiveLoad 和 hideOnTransparent 是仅 svg 渲染器生效的性能配置，前者按需创建 DOM 节点加快首次渲染，后者透明元素直接隐藏不占渲染开销。canvas 渲染器则有自己专属的 context 和 clearCanvas 配置。

体积优化这条线是格式层面之外的另一个维度：lottie-web 提供 light 构建和 full 构建两套产物，light 版去掉了 Expressions 插件和部分特效解释器，体积更小；rollup 产物还覆盖 UMD、ESM、CJS 格式，可以按需选 full、light、svg-only、canvas-only 各种变体来控制最终打包体积。dotLottie 那边的体积优化思路不一样，是格式层面的 zip 压缩加资源共享，下面会讲到。
-->

---

# 播放控制方法

| 方法 | 参数 | 作用 |
|---|---|---|
| `play()` / `pause()` / `stop()` | — | 基础播放控制 |
| `setSpeed(speed)` | 1 = 正常速度 | 调整播放速度 |
| `setDirection(dir)` | 1 正向 / -1 反向 | 播放方向 |
| `goToAndStop(v, isFrame)` / `goToAndPlay(v, isFrame)` | isFrame 决定时间/帧号 | 跳转 |
| `getDuration(inFrames)` | true=帧数 / false=秒数 | 查询总时长 |
| `destroy()` | — | 释放资源，必须调用 |

<div v-click class="mt-3 text-sm">

> `setSubframe(useSubFrames)`：默认 true 每帧平滑；false 严格贴 AE 原始帧率。全局还有 `lottie.setQuality()`/`freeze()`/`unfreeze()`/`resize()` 管理所有实例

</div>

<!--
播放控制方法都挂在 loadAnimation 返回的 AnimationItem 实例上。基础三件套 play、pause、stop；setSpeed 的 1 是正常速度；setDirection 传 1 正向、-1 反向；goToAndStop 和 goToAndPlay 的第二个参数 isFrame 决定第一个值是按时间算还是按帧号算；getDuration 传 true 返回总帧数、false 返回秒数；destroy 用于释放资源，组件卸载时必须调用，下面易错点还会再强调一次。

还有个 setSubframe，默认 true 表示每个 rAF 都更新、动画更平滑，设 false 会严格遵循 AE 原始帧率，是性能和平滑度的取舍。全局层面 lottie 对象还有 setQuality 调渲染质量、freeze/unfreeze 一次性挂起或恢复所有实例、resize 手动触发重新计算尺寸，配合 window.onresize 使用。
-->

---

# 事件系统 + playSegments 片段播放

```js
animation.addEventListener("complete", () => {});
animation.addEventListener("segmentStart", () => {});
animation.playSegments([20, 50], true); // 只播 20~50 帧，立即生效
animation.playSegments([[0, 20], [50, 100]], true); // 多段顺序连播
```

<v-clicks>

- 完整事件：`complete`/`loopComplete`/`enterFrame`/`drawnFrame`/`DOMLoaded`/`data_ready`/`data_failed`/`destroy`
- 也可用回调属性形式：`onComplete`/`onLoopComplete`/`onEnterFrame`
- `playSegments` 的 `forceFlag`：true 立即切换到新片段，false 等当前片段播完再切
- 常用于「hover 播放一段」「点击后跳到指定片段」，结合 `segmentStart` 事件感知切换时机

</v-clicks>

<!--
事件系统用标准的 addEventListener/removeEventListener。常用事件有 complete 播放完成、loopComplete 一轮循环完成、enterFrame 每帧触发、segmentStart 片段开始、DOMLoaded 已挂载到 DOM；加载相关的还有 data_ready、data_failed；也可以用 onComplete 这类回调属性形式，效果等价。

playSegments 是片段播放的核心方法，第一个参数是帧区间，可以是单段 [start, end]，也可以是多段数组顺序连播；第二个参数 forceFlag 决定是立即切换到新片段，还是等当前片段自然播完再切，这个参数在做 hover 播放一段、点击跳到指定片段这类交互时很关键，配合 segmentStart 事件可以感知每个片段真正开始的时机。
-->

---

# dotLottie：新一代容器格式

`.lottie` 是一个 **zip 压缩容器**，把 Lottie JSON 包装为更完整的产物

<v-clicks>

- **体积**：压缩 + 多动画共享资源，远小于内联 base64 的原始 JSON
- **多动画打包**：一个文件装多个动画/场景/图标集
- **主题**：不用重新导出即可深色模式/品牌换色/本地化
- **状态机**：点击/悬停/完成事件的交互无需自己写胶水代码
- **渲染一致性**：所有官方运行时统一走 **ThorVG** 引擎绘制

</v-clicks>

<div v-click class="mt-3 text-sm">

> `.lottie` 与传统 `.json` 不互斥——dotLottie 运行时**两种格式都能加载**；`@lottiefiles/dotlottie-web` 当前 0.76.0，GitHub 高频活跃开发

</div>

<!--
dotLottie 是 LottieFiles 主推的下一代容器格式，.lottie 本质是一个 zip 压缩包，把原始的 Lottie JSON 包装成更完整的产物。

相比老 JSON 格式的五大优势：体积上因为压缩加资源共享，比内联 base64 的原始 JSON 小很多；支持多动画打包，一个文件能装下多个动画、场景或整套图标集，共享资源；支持主题，不用重新导出就能做深色模式、品牌换色、本地化；原生支持状态机，点击悬停这类交互不用自己写胶水代码；渲染一致性上，所有官方运行时统一走 ThorVG 引擎绘制，不再是每个平台各自实现一遍。

注意 .lottie 和传统 .json 不是互斥关系，dotLottie 运行时两种格式都能加载，只是新项目官方更推荐 .lottie。这条生态目前是活跃开发状态，@lottiefiles/dotlottie-web 当前版本 0.76.0，最近几天就有更新推送，对比经典 lottie-web 两年才发一个版本，研发重心的转移非常明显。
-->

---

# .lottie 内部结构与 manifest.json

```text
my-animation.lottie
├── manifest.json     # 必需，元数据 + 索引
├── a/                # 动画目录：a/{id}.json
├── i/                # 可选：图片等共享资源
├── t/                # 可选：主题 t/{id}.json
└── s/                # 可选：状态机 s/{id}.json
```

```json
{
  "version": "2",
  "initial": { "animation": "main" },
  "animations": [{ "id": "main", "themes": ["light", "dark"] }],
  "stateMachines": [{ "id": "button-states" }]
}
```

<div v-click class="mt-2 text-sm">

> `animations[].id` 必须与 `a/` 目录下文件名（去掉 `.json`）一致，否则播放器找不到对应动画

</div>

<!--
展开看 .lottie 的内部目录结构：根目录必须有 manifest.json 做元数据和索引；a 目录放动画本体，一个 id 对应一个 json 文件；i、t、s 三个目录分别是可选的图片资源、主题、状态机定义。

manifest.json 的关键字段，以 v2 规范为准：version 标版本号，initial 指定默认播放哪个动画，animations 数组声明每个动画及其可用主题，themes 和 stateMachines 数组分别声明可用主题和状态机。

有个容易踩的坑要提前说：animations 里每一项的 id，必须跟 a 目录下实际的文件名对应，比如 id 是 main，文件就得是 a/main.json，如果手工拼这个 zip 容易对不上，官方建议用 SDK 生成，避免手工出错。
-->

---

# dotlottie-web 播放器 API

```js
import { DotLottie } from "@lottiefiles/dotlottie-web";

const dotLottie = new DotLottie({
  canvas: document.getElementById("canvas"), // 注意：canvas 元素，不是 container div
  src: "https://lottie.host/xxx.lottie",
  autoplay: true,
  loop: true,
  mode: "forward", // forward | reverse | bounce | reverse-bounce
  layout: { fit: "contain", align: [0.5, 0.5] },
});

dotLottie.addEventListener("load", () => dotLottie.play());
```

<v-clicks>

- 方法：`play/pause/stop/setFrame/setSpeed/setLayout/setMarker/setSegment/setTheme/destroy`
- 事件新增：`load`/`loadError`/`ready`/`render`/`freeze`
- ⚠️ 构造参数是 `canvas`（HTMLCanvasElement），lottie-web 是 `container`（HTMLDivElement）——两套 API 不通用

</v-clicks>

<!--
dotlottie-web 是 dotLottie 生态的核心播放器库，API 形状和 lottie-web 有相似也有明显不同。构造函数最关键的参数变化：这里传的是 canvas，一个 HTMLCanvasElement，而不是 lottie-web 的 container div，这是两套 API 混用时最容易报错的地方。src 可以直接指向 .lottie 或 .json 地址，mode 对应 lottie-web 的 setDirection 但多了 bounce 和 reverse-bounce 两种模式，layout.fit 对应 lottie-web 的 preserveAspectRatio 但用的是 contain/cover/fill 这套更直观的语义。

方法和事件基本延续 lottie-web 的心智，但新增了 load、loadError、ready、render、freeze 这些和加载状态、离屏冻结相关的事件。再强调一次那个易错点：canvas 和 container 类型不同，混用两套 API 会直接报错，选型时务必确认自己在用哪一套。
-->

---

# Worker 渲染与三种渲染后端

```js
import { DotLottieWorker } from "@lottiefiles/dotlottie-web";

const player = new DotLottieWorker({
  canvas,
  src: "animation.lottie",
  autoplay: true,
  loop: true,
  workerId: "shared-pool", // 指定共享 worker 池
});
```

<v-clicks>

- `DotLottieWorker` 把渲染彻底移出主线程，避免复杂动画卡主线程交互
- 内核：Rust + WASM 的 `dotlottie-rs`，渲染引擎 **ThorVG**（C/C++ 矢量图形库）
- 三种渲染后端按子路径切换：默认 Software/Canvas2D、`/webgl`（WebGL2）、`/webgpu`（前沿）

</v-clicks>

<!--
性能进阶方案是 DotLottieWorker，构造参数和 DotLottie 几乎一样，只多了一个 workerId 用来指定共享 worker 池，作用是把渲染彻底挪到 Web Worker 里，脱离主线程，避免复杂动画卡住页面的交互响应。

底层内核是 Rust 加 WASM 写的 dotlottie-rs，渲染引擎叫 ThorVG，是个 C/C++ 矢量图形库，iOS、Android、Web 官方运行时共用同一套引擎，这也是前面说的"渲染一致性"的技术根基。

渲染后端还能通过子路径切换，默认走 Software/Canvas2D，想要硬件加速可以引入 /webgl 走 WebGL2，或者更前沿的 /webgpu 走 WebGPU，三选一按目标浏览器和性能需求决定。
-->

---

# Web Component 播放器：三代命名演进

| 标签 | 包 | 状态 |
|---|---|---|
| `<lottie-player>` | `@lottiefiles/lottie-player` | **已废弃** |
| `<dotlottie-player>` | `@dotlottie/player-component` | **已废弃**（npm 标注 superceded） |
| `<dotlottie-wc>` | `@lottiefiles/dotlottie-wc` | **当前推荐**（0.9.19） |

```html
<script type="module" src="https://unpkg.com/@lottiefiles/dotlottie-wc@latest/dist/dotlottie-wc.js"></script>
<dotlottie-wc src="https://lottie.host/xxx.lottie" autoplay loop></dotlottie-wc>
```

<div v-click class="mt-2 text-sm">

> 已确认属性：`src`（`.lottie`/`.json` 均可）、`autoplay`、`loop`；更多属性以官方 API Reference 为准，不要照搬旧组件属性表

</div>

<!--
Web Component 播放器是 Lottie 生态里命名最容易混淆的地方，前后有三代。第一代 lottie-player，包是 @lottiefiles/lottie-player，已经废弃，包装的是经典 lottie-web。第二代 dotlottie-player，包是 @dotlottie/player-component，npm 上明确写着被 dotlottie-wc 取代，也已经废弃。第三代也就是当前推荐的 dotlottie-wc，包是 @lottiefiles/dotlottie-wc，版本 0.9.19，包装的是 dotlottie-web，底层走 ThorVG。

用法很简单，一个 script 标签引入模块，然后像原生 HTML 标签一样直接写 dotlottie-wc 元素，配上 src、autoplay、loop 属性。这三个属性是逐字段从 GitHub README 核实过的，更多细粒度属性建议查官方最新的 API Reference，不要拿旧版组件的属性表直接套，两代产品实现细节可能有出入。
-->

---

# 状态机 State Machine（dotLottie 原生交互）

四个核心概念，对标 **Rive** 的交互模型：

| 概念 | 作用 |
|---|---|
| **Inputs** | 数值/字符串/布尔变量 + 事件信号，guard 读取、action 写入 |
| **States** | 命名的播放配置，机器任意时刻恰好处于一个状态 |
| **Transitions** | 挂在状态上的规则，guard 通过则迁移，可配 Tweened 过渡 |
| **Interactions** | 把手势（`PointerDown`）/生命周期事件（`OnComplete`）绑定到 action |

<div v-click class="mt-4 text-sm">

> 不用写 JS 胶水代码就能做"点击变色""悬停播放""评分表情"级别的交互，这是 dotLottie 对标 **Rive** 交互模型的核心能力

</div>

<!--
状态机是 dotLottie 相比传统 Lottie JSON 最大的能力跃升，四个核心概念。Inputs 是变量和事件信号，数值、字符串、布尔类型都支持，guard 条件读取它们，action 可以写入它们。States 是命名的播放配置，机器在任意时刻恰好处于一个状态，常见类型有 PlaybackState、GlobalState。Transitions 挂在状态上，guard 条件通过就触发迁移到另一个状态，还能配 Tweened 类型做过渡动画的时长和缓动。Interactions 把用户手势比如 PointerDown，或者动画生命周期事件比如 OnComplete，绑定到具体的 action 上。

这套模型对标的直接竞品是 Rive，Rive 的核心设计理念就是状态机是一等公民。dotLottie 补上这一课之后，不用写 JS 胶水代码，就能做出点击变色、悬停播放、评分表情这类交互，下一页看具体代码长什么样。
-->

---

# 状态机代码示例

```js
const machine = {
  initial: "laughing",
  states: [{ name: "global", type: "GlobalState", transitions: [
    { type: "Tweened", toState: "angry", duration: 0.5,
      guards: [{ type: "Numeric", inputName: "rating", conditionType: "Equal", compareTo: 1 }] },
  ]}],
  inputs: [{ type: "Numeric", name: "rating", value: 5 }],
};
dotLottie.addEventListener("load", () => {
  dotLottie.stateMachineLoadData(JSON.stringify(machine));
  dotLottie.stateMachineStart(); // 必须显式 start，加载 ≠ 激活
});
dotLottie.stateMachineFireEvent("click");
```

<div v-click class="mt-2 text-sm">

> 其他输入 API：`stateMachineSetNumericInput`/`SetBooleanInput`/`SetStringInput`；事件：`stateMachineTransition`/`stateMachineStateEntered`

</div>

<!--
落到代码层面，状态机定义是一份 JSON：initial 指定初始状态，states 数组里每个状态可以挂 transitions，这里的例子是 rating 这个数值输入等于 1 时，用 0.5 秒的 Tweened 过渡迁移到 angry 状态；inputs 声明初始变量值。

运行时消费分两步：先用 stateMachineLoadData 把定义传进去（也可以用 stateMachineLoad 加载文件内置的状态机），这一步只是加载，机器还没激活，必须再显式调用 stateMachineStart 才会真正跑起来，这是个高频踩坑点，下面易错点还会提。之后可以用 stateMachineFireEvent 触发自定义事件，或者用 stateMachineSetNumericInput 这类方法从外部直接修改输入变量的值。
-->

---

# lottie-react 框架集成

```jsx
import Lottie, { useLottie } from "lottie-react";
import animationData from "./anim.json";

// 组件式
const lottieRef = useRef();
<Lottie
  lottieRef={lottieRef}
  animationData={animationData}
  loop
  autoplay
  onComplete={() => {}}
/>;
lottieRef.current.pause(); // 与 lottie-web AnimationItem 方法一致
```

<v-clicks>

- Hook 式：`useLottie({ animationData, loop, autoplay }, style)` 返回 `{ View, play, pause, setSpeed, ... }`
- 方法名与 lottie-web `AnimationItem` 完全对应，本质是薄封装

</v-clicks>

<!--
lottie-react 是 Gamote 维护的官方推荐 React 封装，当前版本 2.4.1，包装的是 lottie-web。提供两种用法：组件式直接用 Lottie 组件，传 animationData、loop、autoplay 这些 props，配合 lottieRef 拿到底层实例，之后可以像原生 lottie-web 一样调 pause、play 这些方法；onComplete 这类事件也直接变成了 props。

Hook 式是 useLottie，传配置对象和样式，返回一个对象，里面有 View 用来渲染、还有 play、pause、setSpeed、goToAndStop、destroy 这些方法，方法名和 lottie-web 的 AnimationItem 完全对应，本质上就是一层薄封装，学过 lottie-web 原生 API 之后上手 lottie-react 几乎没有额外成本。
-->

---

# 其他框架集成（易混坑）

⚠️ 三个相似命名的 React 封装包，**互相独立**，选型前务必核实：

| 包 | 特点 |
|---|---|
| `lottie-react`（Gamote） | 组件 + hook，上一页示例即此包 |
| `react-lottie-player`（mifi） | 声明式 `play` 布尔控制，内置自动深克隆 |
| `@lottiefiles/react-lottie-player` | 同名异库，指向 `LottieFiles/lottie-react` |

<v-clicks>

- Vue（社区）：`Vue3Lottie` 组件传 `animationData`/`height`/`width`，包装 lottie-web
- Vue（官方）：`DotLottieVue` 组件传 `src`/`loop`/`autoplay`，`ref.value?.getDotLottieInstance()` 拿底层实例

</v-clicks>

<!--
选型或读源码前先核实包名，这里有三个命名高度相似但互相独立的 React 封装：lottie-react 是 Gamote 维护的，组件加 hook 两种用法，上一页刚讲过；react-lottie-player 是 mifi 维护的另一套，走声明式 props，用布尔值 play 控制播放而不是调方法，内置自动深克隆规避 repeater 内存泄漏；@lottiefiles/react-lottie-player 名字里带 lottiefiles 前缀，容易被误认成官方对 lottie-react 的镜像，但它其实是同名异库，指向 LottieFiles 自己维护的 lottie-react 仓库，三者 API 形状都不一样，用错文档抄代码是最容易踩的坑。

Vue 这边两个选择：vue3-lottie 是社区维护，包装经典 lottie-web；DotLottieVue 是官方对 dotLottie 生态的 Vue 封装，命令式控制要通过 ref 拿到底层 DotLottie 实例。
-->

---

# lottie-interactivity：经典滚动/悬停交互

```js
import { create } from "@lottiefiles/lottie-interactivity";

create({
  mode: "scroll", // 'scroll' | 'cursor' | 'chain'
  player: "#firstLottie", // lottie-player 组件或 lottie-web 容器选择器
  actions: [
    { visibility: [0, 1], type: "seek", frames: [0, 100] }, // 滚动进度映射到帧区间
  ],
});
```

<v-clicks>

- `type` 可选 `seek`/`play`/`stop`/`loop`；`mode: 'cursor'` 用鼠标位置驱动进度（光标跟随）
- 诞生早于状态机，服务经典 `lottie-web`；简单"滚动进度条式播放"仍然轻量够用
- 复杂交互（多输入变量、guard 条件组合）推荐用 dotLottie 状态机，二者是**能力代差**而非替代

</v-clicks>

<!--
lottie-interactivity 是一套更早期的交互库，独立于 dotLottie 状态机存在。核心 API 是 create，mode 三选一：scroll 按滚动位置驱动，cursor 按鼠标位置驱动，chain 顺序串联多个动画。actions 数组里配 visibility 容器可见区间，映射到 frames 帧区间，type 常见取值有 seek、play、stop、loop。

这套库服务的对象是经典 lottie-web 或者旧版 lottie-player，诞生时间早于 dotLottie 状态机。两者不是替代关系而是能力代差：lottie-interactivity 只做滚动或光标位置到帧的线性映射，做简单的"滚动进度条式播放"仍然轻量够用；但涉及多输入变量、guard 条件组合、跨状态过渡动画这类复杂交互，新项目应该直接上状态机。
-->

---

# 性能优化

<v-clicks>

- **渲染器选型**是最大杠杆：图层多、不需要 CSS 联动用 canvas；dotLottie 侧可进一步切 WebGL2/WebGPU
- `useFrameInterpolation: false`（dotLottie）/ `setSubframe(false)`（lottie-web）：放弃平滑插值，减少计算
- `renderConfig.freezeOnOffscreen`（默认 true）：canvas 滚出可视区自动暂停渲染
- `lottie.freeze()`/`unfreeze()`：一次性挂起页面上所有 lottie-web 实例
- 体积：格式选 `.lottie`（压缩 + 资源共享）；导出前用 Creator 清理隐藏图层/精简路径点
- Worker 化：`DotLottieWorker` 把渲染彻底移出主线程

</v-clicks>

<div v-click class="mt-2 text-sm">

> ThorVG 宣称的具体性能倍数来自 LottieFiles 官方/合作方宣传材料，非独立第三方基准，选型时参考方向、不作为承诺引用

</div>

<!--
性能优化六个抓手。第一也是最大的杠杆是渲染器选型，前面反复强调过。第二是关掉子帧插值，dotLottie 叫 useFrameInterpolation，lottie-web 叫 setSubframe，都是放弃逐帧平滑、减少计算量。第三是 dotLottie 默认开启的 freezeOnOffscreen，canvas 滚出可视区就自动暂停渲染，配合懒加载思路很自然。第四是 lottie.freeze/unfreeze，一次性挂起页面上所有 lottie-web 实例，适合切到后台标签页这类场景。第五是体积优化，格式选 .lottie，导出前用 Creator 工具清理隐藏图层、精简路径点。第六是 Worker 化，把渲染彻底移出主线程。

最后提醒一句：ThorVG 官方宣传的具体性能倍数，比如百分之多少的内存降低，都是厂商或合作案例的口径，没有独立第三方基准报告佐证，选型时可以参考方向，不建议直接当承诺来做容量规划，真要验证就自己拿目标动画和目标设备实测。
-->

---

# 易错点清单

<v-clicks>

1. 容器没设尺寸：`container`/`canvas` 没有显式宽高 → 动画区域塌陷不可见
2. `path`/`animationData` 互斥混传，同时传只有一个生效
3. repeater + 复用同一份 JSON 不深克隆 → 实例间状态互相污染
4. 忘记 `destroy()` → canvas/rAF/事件监听持续占用，内存泄漏
5. canvas 渲染器丢文字排版：真实字体需求应走 svg/html 渲染器
6. 三个相似命名的 React 包搞混：先确认 `package.json` 里装的是哪一个
7. 状态机没显式 `stateMachineStart()` 就指望它工作：加载 ≠ 激活

</v-clicks>

<!--
过一遍高频易错点。容器没设尺寸是最高频的"为什么不显示"问题。path 和 animationData 混传，两者互斥。repeater 加复用同一份 JSON 不深克隆，会导致实例间状态互相污染，react-lottie-player 已经内置自动处理，原生 lottie-web 要自己做。忘记 destroy 是内存泄漏的头号原因，React 用 useEffect 清理函数、Vue 用 onUnmounted 手动调用。canvas 渲染器换了性能但丢了真实字体排版，这是很多人以为纯粹是性能提升结果踩的坑。三个相似命名的 React 包前面讲过，选型或读源码前先确认到底装的是哪个。最后，状态机加载数据之后不会自动激活，必须显式调用 stateMachineStart，这也是个高频遗漏。
-->

---

# 选型对比：Lottie vs GIF / 视频 / CSS / Rive

| 维度 | Lottie | GIF/视频 | CSS/SVG | Rive |
|---|---|---|---|---|
| 图形模型 | 矢量 | 位图 | 矢量/DOM | 矢量 + 自有运行时 |
| 透明通道 | 原生支持 | 有限/需特殊编码 | 原生支持 | 原生支持 |
| 运行时可控性 | 高（速度/分段/事件/状态机） | 低/中 | 高 | 高（原生状态机） |
| 交互性 | dotLottie 状态机 | 无 | 原生 hover/JS | **原生一等公民** |

<div v-click class="mt-4 text-sm">

> 简单过渡用 CSS；复杂矢量动效/跨端一致选 Lottie；写实内容用视频；重交互状态机诉求评估 **Rive**

</div>

<!--
最后做个横向选型对比。图形模型上 Lottie 和 CSS/SVG 都是矢量、Rive 也是矢量加自有运行时，GIF 和视频是位图；透明通道 Lottie 原生支持，GIF 只有 1-bit 透明、视频需要特殊编码；运行时可控性 Lottie 很高，速度、分段、事件、状态机都能控，GIF 基本是黑盒；交互性上 Rive 是原生一等公民，状态机是它的核心设计理念，dotLottie 的状态机是后补追赶但已经够用。

选型口径一句话：能用几行 CSS 搞定的简单过渡不需要上 Lottie；复杂多图层矢量动效、要求跨端一致用 Lottie；真实拍摄内容用视频，Lottie 替代不了；如果项目从头设计且交互状态机是核心诉求，值得评估更年轻但交互原生的 Rive。
-->

---
layout: intro
---

# 总结

Lottie = **AE 导出 JSON，运行时原生解析渲染的矢量动画方案**

- `lottie-web`（经典，5.13）用 `loadAnimation` + svg/canvas/html 三渲染器
- `dotLottie`（新一代）：`.lottie` 容器 + Rust/WASM + ThorVG + 原生状态机
- Web Component 播放器认准 `dotlottie-wc`，旧版 `lottie-player` 已废弃
- 简单过渡用 CSS，复杂矢量动效/跨端一致选 Lottie，重交互评估 Rive

<!--
今天梳理了 Lottie 全景：从 AE 导出工作流，到 lottie-web 的 loadAnimation、播放控制、事件、渲染器选型，再到新一代 dotLottie 格式、状态机交互、Web Component 播放器的三代演进，最后是框架集成、性能优化和高频易错点。

记住核心判断：lottie-web 仍是装机量最大的事实标准，dotLottie 是官方研发重心所在的下一代方案，两者会长期并存。新项目建议优先掌握 dotLottie 生态，但也要认识 lottie-web 的经典 API，因为存量项目和教程大量还基于它。谢谢大家。
-->
