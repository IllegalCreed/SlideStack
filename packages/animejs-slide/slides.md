---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Anime.js
info: |
  Presentation Anime.js —— 轻量模块化的 JavaScript 动画引擎（v4.5）。

  Learn more at [https://animejs.com](https://animejs.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🪄</span>
</div>

<br/>

## Anime.js —— 轻量级 JavaScript 动画引擎

轻量模块化、ESM-first 具名导出，v4 全新重写（当前 v4.5）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/juliangarnier/anime" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Anime.js。npm registry 实测：animejs@4.5.0，type module，MIT 协议，作者 Julian Garnier。

一句话定位，官网首页原句：A fast and flexible JavaScript library to animate the web，快速灵活的网页动画库。

今天的重点背景：2025 年 4 月发布的 v4.0.0 是一次完全重写——模块化、ESM-first API，与 v3 不兼容。我们会花大量篇幅讲这次重写改了什么、怎么迁移，然后过一遍 v4 的核心能力：animate 补间、Timeline 编排、缓动、stagger 交错、keyframes、SVG 特色动画、Draggable 拖拽、ScrollObserver 滚动联动，最后讲性能、易错点和选型对比。

顺序：定位 → v3→v4 重写（两页）→ animate 上手 → 参数 → 缓动 → Timeline（两页）→ stagger → keyframes → SVG（三页）→ Draggable → ScrollObserver → utils → 回调控制 → 性能 → 易错点 → 选型对比 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 Anime.js？

官网原句：**"A fast and flexible JavaScript library to animate the web."**

<v-clicks>

- 轻量、模块化、ESM-first、tree-shakeable、框架无关
- 核心心智：`animate(targets, params)`，接近原生 DOM 操作
- MIT 完全免费开源，作者 Julian Garnier + 社区维护

</v-clicks>

<div v-click class="mt-6">

v4 时代功能广度已追近 GSAP：

- Timeline / Draggable / ScrollObserver / SVG / Text / Layout 全家桶
- 局限：v3 教程在 v4 下**完全失效**，边缘案例仍在快速迭代

</div>

<!--
定位一句话，官网首页原句：A fast and flexible JavaScript library to animate the web。npm description 更直接：JavaScript animation engine。

关键词：轻量、模块化、ESM-first、tree-shakeable、框架无关——vanilla JS 是核心心智，官方文档另外给了 React 接入范式（createScope + useEffect）。

不要把它想成"只是补间动画库"。v4 时代已经扩展成一整套动画引擎家族：Timer 计时器、Animation 补间、Timeline 编排、Draggable 拖拽物理、ScrollObserver 滚动联动、SVG 变形描边路径运动、Text 拆字、Layout 类 FLIP 自动布局。功能广度已经追近 GSAP 生态。体积上，waapi.animate 轻量版本官方标注约 3KB，完整 JS 版 animate 大约 10KB，功能更全（composition/modifier/frameRate/keyframes）。

局限也要讲清楚：文档虽然完整，但历史包袱重，网上大量基于 v3 的教程和 StackOverflow 答案在 v4 下完全失效；相较 GSAP 插件生态多年积淀，Anime.js 的 Draggable、ScrollObserver、Layout 是 v4 才补齐的新模块，边缘案例覆盖还在快速迭代。
-->

---

# v3 → v4：一次彻底重写

<v-clicks>

- **v4.0.0**（2025-04-03）：官方 release note 原话"完全重写，模块化 ESM-first API"
- v4 内部也有 breaking change：v4.4.0（2026-04）仍变过行为
- 心智重启：v3 默认导出 `anime` 对象 → v4 **具名导出**，无全局对象
- `targets` 类型不变：只是从配置字段挪到第一个位置参数

</v-clicks>

```js
// v3（旧，已完全失效）
import anime from 'animejs';
anime({ targets: '.sq', translateX: 250, easing: 'easeInOutQuad' });

// v4（新，具名导出）
import { animate } from 'animejs';
animate('.sq', { translateX: 250, ease: 'inOutQuad' });
```

<!--
先讲重写的时间线事实：GitHub Releases 实测，v3.2.2 是 2023 年 11 月 v3 系列最后一版；v4.0.0 在 2025 年 4 月 3 日发布，release note 原话是"a complete rewrite ... modular, ESM-first API"。

结论要立住：v4 不是发布即定型，即便在 v4 内部，2026 年 4 月的 v4.4.0 仍然发生了 breaking change（transform 渲染顺序、函数式取值回调参数从 total 变 targets），写代码看清版本号、看清 changelog 再升级。

最核心的心智重启：v3 只有一个默认导出 anime 对象，什么都挂在它上面；v4 是彻底的具名导出，没有这个万能对象了，任何裸 anime(...) 调用在 v4 环境下直接报 anime is not a function。

但有一点很多人会搞混：targets 的类型系统本身没有重写，CSS 选择器、DOM 元素、JS 对象、数组这四种目标类型是延续的，只是位置从"配置对象里的 targets 字段"挪到了"函数的第一个位置参数"。对比这两段代码，targets 和第二个参数配置对象的关系没变，变的是外层怎么调用。
-->

---

# v3 → v4 API 速查对照表

| v3（旧） | v4（新） |
|---|---|
| `anime({targets, ...})` | `animate(targets, {...})` |
| `anime.timeline()` | `createTimeline()` |
| `anime.stagger()` | `stagger()`（须显式 import） |
| `anime.remove/get/set/random()` | `utils.remove/get/set/random()` |
| `anime.path()` | `svg.createMotionPath()` |
| `anime.setDashoffset()` | `svg.createDrawable()` |
| `easing:'easeInOutQuad'` | `ease:'inOutQuad'` |

<!--
这张表是今天的核心速查表，把高频 API 一一对应，建议截图收藏。

补间入口 anime 变 animate，timeline 变 createTimeline，stagger 现在要显式具名导入而不是挂在全局对象上随手调。工具函数原来是 anime.remove/get/set/random，现在统一搬到 utils 命名空间下。SVG 相关，v3 手工的 anime.path 变成 svg.createMotionPath，v3 的 setDashoffset 变成更声明式的 svg.createDrawable。

easing 改名是双重坑：字段名从 easing 变成 ease，值的写法也从 easeInOutQuad 简化成 inOutQuad，去掉 ease 前缀、首字母小写。

direction 拆分：v3 一个 direction 字段管 reverse/alternate/normal 三态，v4 拆成两个独立布尔 reversed 和 alternate，两者理论上可以同时为 true，语义要重新想一遍。

补充两条不在表里但同样重要的坑：v3 的 easing:'spring(mass,stiffness,damping,velocity)' 字符串写法在 v4 变成对象式 spring({mass,stiffness,damping,velocity})——早期 v4.0.0 前后的官方迁移向导写的是 createSpring()，但当前 v4.5.0 文档站与 context7 收录用法均已统一为 spring()，出题/写代码以当前 spring() 为准；另外 v3 的 endDelay 概念在 v4 对应到 loopDelay。
-->

---

# animate() 上手：第一个动画

```js
import { animate } from 'animejs';

const animation = animate('.square', {
  translateX: '17rem',
  scale: [1, 1.5, 1],          // 数组 = 补间值关键帧
  backgroundColor: '#FF4B4B',
  duration: 1000,
  ease: 'outElastic(1, .6)',
  loop: true,
  onComplete: () => console.log('done'),
});
```

<v-clicks>

- 第一个参数 **targets**：CSS 选择器 / DOM 元素 / JS 对象 / 数组
- 第二个参数是配置对象：属性 + 播放参数 + 回调混写
- 返回一个**动画实例**，可 `.pause()`/`.play()`/`.reverse()` 控制

</v-clicks>

<!--
上手第一个 animate 调用。targets 是第一个参数，这里传的是 CSS 选择器字符串 .square；也可以传 DOM 元素、纯 JS 对象比如 {value:0}，或者这些类型的数组组合。

第二个参数是配置对象，属性、播放参数、回调全部混写在一起：translateX 是 CSS transform；scale 传数组 [1, 1.5, 1] 表示补间值关键帧——先放大到 1.5 倍再缩回 1 倍；backgroundColor 是普通 CSS 属性；duration、ease、loop 是播放参数；onComplete 是完成回调。颜色、带单位的值、相对值 +=50 这些都可以直接写在属性值位置，Anime.js 自动识别类型。

animate 调用会返回一个动画实例，可以调用 pause、play、reverse 等方法手动控制播放，这个实例在后面回调控制的内容里还会用到。
-->

---

# 核心参数：duration / delay / loop / ease

| 参数 | 默认值 | 说明 |
|---|---|---|
| `duration` | 1000（毫秒） | 单次播放时长 |
| `delay` | 0 | 开始前延迟，可传 `stagger()` |
| `loop` | 0（不循环） | `true` = 无限循环，或传具体数字 |
| `autoplay` | true | 创建即自动播放 |
| `ease` | —— | 取代 v3 的 `easing`，如 `'outQuad'` |
| `alternate` / `reversed` | false / false | 两个独立布尔，可同时为 true |

<v-clicks>

- **改名坑**：字段 `easing`→`ease`，值 `'easeInOutQuad'`→`'inOutQuad'`
- 每条属性可单独传对象 `{ to, from, ease, duration }` 覆盖全局参数

</v-clicks>

<!--
六个最基础的播放参数，也是入门必背清单。duration 默认 1000 毫秒；delay 默认 0，常见写法是塞一个 stagger() 函数值实现交错延迟；loop 默认 0 即不循环，true 是无限循环，也可以传具体次数；autoplay 默认 true，创建即播放。ease 取代了 v3 的 easing，是重写里最高频的改名坑，字段名变了、值的写法也变了。alternate 和 reversed 是两个独立布尔，对应 v3 被拆开的 direction 字段，理论上可以同时为 true。

再补一句：每条属性可以单独传对象覆盖全局参数，写成 {to, from, ease, duration} 这样的形式；三个最常用的回调 onComplete、onUpdate、onBegin 都是直接写进配置对象里的函数，下面会专门讲一页回调与播放控制。
-->

---

# 缓动 eases 与 spring() 弹簧

```js
animate(el, { x: 100, ease: 'outExpo' });                // 字符串写法
animate(el, { x: 100, ease: 'outElastic(.8, 1.2)' });    // 带参数字符串
animate(el, { x: 100, ease: spring({ bounce: .5 }) });   // 弹簧缓动
animate(el, { x: 100, ease: steps(4) });                  // 阶梯
```

<v-clicks>

- 内置全家族（各带 `in/out/inOut/outIn` 四态）：`Quad/Cubic/Sine/Expo/Bounce/Back/Elastic`
- **`spring()`** 两套参数二选一：感知参数 `bounce`+`duration`；物理参数 `mass/stiffness/damping/velocity`
- ⚠️ spring 的 `duration` 会**覆盖** animate 自身的 duration
- `steps(n, fromStart)`：`fromStart` 默认 false，变化在每步**末尾**跳变

</v-clicks>

<!--
缓动函数决定动画节奏。写法上，字符串最常见，'outExpo' 这种是预设好的；也可以带参数字符串 outElastic(.8, 1.2)；或者用具名导入的函数式写法，比如 spring、steps、cubicBezier、linear、irregular。

内置 easing 全家族每种都有 in/out/inOut/outIn 四态，命名规律固定：Quad、Cubic、Quart、Quint、Sine、Expo、Circ、Bounce、Back（可带 overshoot 参数）、Elastic（可带 amplitude/period 参数），此外还有参数化的通用幂函数 in(power)/out(power)/inOut(power)。

重点讲 spring 物理弹簧缓动。两套参数体系二选一：感知参数是 bounce 加 duration，bounce 范围 -1~1 默认 0.5，duration 是感知完成时间默认 628 毫秒；物理参数是 mass/stiffness/damping/velocity，默认 1/100/10/0。注意一个坑：spring 自己的 duration 会覆盖 animate 外层设置的 duration，两者选一套别混用。spring 还自带独立的 onComplete，视觉稳定时才触发，跟动画本身的 onComplete 是两回事。

最后 steps 阶梯缓动，n 是步数，fromStart 默认 false 表示变化发生在每一步末尾而不是开头，WAAPI 版写法是字符串 'steps(8, end)'。cubicBezier(x1,y1,x2,y2) 的 x 分量限定 0~1，y 分量任意可做回弹超冲；irregular(steps, randomness) 用随机点线性插值制造抖动效果。
-->

---

# Timeline 编排：createTimeline()

```js
import { createTimeline } from 'animejs';

const tl = createTimeline({ defaults: { duration: 750 } });

tl.label('start', 0)
  .add('.square',   { x: '15rem' }, 500)      // 绝对时间 500ms
  .add('.circle',   { x: '15rem' }, 'start')  // 标签引用
  .add('.triangle', { x: '15rem' }, '<-=250'); // 上一个开头前 250ms
```

<v-clicks>

- **position 语法**：数值 / 标签 / `'<'` `'<<'` / 相对运算 `+=` `-=` `*=`，可组合
- 方法：`add/set/sync/label/call/remove`
- 播放控制：`play/pause/resume/restart/reverse/seek/stretch`

</v-clicks>

<!--
Timeline 用来编排多个动画的先后顺序。createTimeline 建实例，defaults 给整条时间轴一个默认时长。

label 给某个时间点起名字方便复用。add 挂载动画，三个参数：目标、配置、position 位置。这里三次 add 分别演示了绝对时间 500、标签引用 start、以及相对运算 '<-=250' 表示上一个动画开头往前 250 毫秒。

position 完整语法要记全：数值是绝对时间点；标签是具名复用；'<' 和 '<<' 是相对上一个动画的特殊符号（下一页专门讲）；还可以叠加相对运算 +=、-=、*=，甚至组合起来写成 '<<+=250'。不写 position 参数就默认接在时间轴末尾。stagger() 的返回值也可以直接作为 position 参数使用。

除了 add，Timeline 还有 set 瞬间设置属性、sync 同步外部时间轴或 WAAPI 动画、label 打标签、call 在时间点触发回调、remove 移除。播放控制方法跟 Animation/Timer 高度一致，因为三者共享同一个 Timer 基类。Timeline 子项的 loop/方向参数现在会被正确计入总时长，可以 seek 穿越不同循环轮次，这是 v3 做不到的。
-->

---

# Timeline 位置符号：`<` 与 `<<`

**`<`** = 上一个动画的**结束**处，**`<<`** = 上一个动画的**开始**处

```js
tl.add('.a', { x: 100 }, 0)          // 0ms 开始，假设时长 500ms → 500ms 结束
  .add('.b', { x: 100 }, '<')        // 从 .a 的结束点 500ms 开始（顺序衔接）
  .add('.c', { x: 100 }, '<<')       // 回到 .a 的开始点 0ms（与 .a 同时开始）
  .add('.d', { x: 100 }, '<<+=250'); // .a 开始点 + 250ms
```

<div v-click class="mt-4 text-sm">

> ⚠️ **高频考点**：直觉上"更多尖括号=更靠后"，实际 `<<` 是回到**更前面**（开头）。多数人第一次都会记反。

</div>

<!--
这一页专门拎出来讲 Timeline 里最容易记反的两个符号，因为在高频考点清单里它反复出现。

小于号 < 指的是上一个动画的结束点，两个连续小于号 << 指的是上一个动画的开始点。看代码：a 从 0 毫秒开始，假设时长 500 毫秒，500 毫秒结束；b 用 '<' 就是接着 a 结束的地方，也就是 500 毫秒开始，这是顺序衔接的直觉写法；c 用 '<<' 反而回到了 a 的开始点，也就是 0 毫秒，跟 a 同时开始；d 在 '<<' 基础上再加 250 毫秒相对运算，组合写法完全支持。

这是全场最容易踩的坑：直觉上会觉得符号越多、位置应该越靠后，实际上恰恰相反，'<<' 是回到更前面的开头。记忆方法：'<' 只有一个尖括号，指向离当前最近的"结束"；'<<' 两个尖括号，要"跨过"结束点，回到更早的"开始"。
-->

---

# stagger() —— 交错动画

```js
import { animate, stagger } from 'animejs';

animate('.square', {
  scale: stagger([0.1, 1]),        // 值域交错
  delay: stagger(100, {
    from: 'center',                 // 交错锚点
    grid: [7, 4], axis: 'x',        // 二维网格交错
    jitter: [0, 200],               // v4.4.0+：随机偏移
  }),
});
```

<v-clicks>

- **必须显式 `import { stagger }`**——不是自动生效的语法糖
- 返回"函数值"，可塞进 `delay`/属性值/**Timeline 的 position 参数**
- `stagger(100)` = 时间交错；`stagger([0,1])` = 值域交错

</v-clicks>

<!--
stagger 交错动画，让多个匹配目标不是同时动，而是依次错开。

第一个关键提醒：stagger 不是自动生效的语法糖，必须显式从 animejs 具名导入，这是新手期最高频的报错来源，忘记导入直接报错。

用法上，stagger() 返回的是一个"函数值"，可以塞进任意 tween 参数位置，delay、duration、属性值都行，甚至可以直接作为 Timeline 的 position 参数使用。

两种最常用形态：stagger(100) 是纯时间交错，每个目标依次延迟加 100 毫秒；stagger([0.1, 1]) 是值域交错，把 0.1 到 1 这个区间按元素数量均匀分布成每个元素的起始值。

配置项里，from 控制交错的锚点，可以是 first、last、center、具体索引或 random；grid 加 axis 组合能做二维网格交错，v4.5 起还支持三维（{x,y,z} 坐标或 grid:[cols,rows,depth]）；jitter 是 v4.4.0 新增的随机扰动幅度，seed 是 v4.5.0 新增的可复现随机种子；还有 v4.1.0 新增的 total/use 自定义交错顺序。v4.4.0 有个 breaking change：use 回调第三参数从 total(数字) 改成了 targets(数组)。
-->

---

# keyframes：属性级 vs 顶层级

```js
// 属性级：单属性数组，按顺序流转
animate('.sq', { x: [0, 100, 50], duration: 3000 });

// 顶层级：animate() 顶层 keyframes，多属性同步
animate('.sq', {
  keyframes: [
    { y: '-2.5rem', duration: 400 },
    { x: '17rem', scale: .5, duration: 800 },
    { y: 0 },                    // 不写 duration = 总时长/帧数
  ],
  duration: 3000,
});
```

<v-clicks>

- **属性级**：挂在具体属性下，数组值 / 对象数组
- **顶层级**：挂在 `keyframes` 字段，数组 / 百分比对象 `{'0%':{...}}`
- 两层缓动：逐帧 `ease` 管"这帧到下帧"，`playbackEase` 管"整条链再包一层"

</v-clicks>

<!--
keyframes 关键帧一共有四种写法，今天用两个代表演示，分清"属性级"和"顶层级"这个最容易混的区分。

属性级①是单属性数组，比如 x 传 [0, 100, 50]，按顺序流转；属性级②（没在代码里展示）是单属性的对象数组，逐帧自定义 ease/duration/delay。这两种都是挂在"具体属性下面"的写法。

顶层级③是挂在 animate 顶层的 keyframes 字段，一个对象数组，可以多属性同步，按时长顺序播放；某一帧不写 duration 时默认是总 duration 除以关键帧总数。顶层级④是百分比写法，用 '0%'/'50%'/'100%' 对象精确控制每帧在总时长里的位置，这里没展开代码但很常用。

两层缓动概念也要分清：逐帧 ease 管的是"这一帧到下一帧怎么过渡"，顶层的 playbackEase 管的是"整条关键帧链条的节奏再包一层"，二者不是一回事，playbackEase 常配合 loop 做整体节奏的二次调整。
-->

---

# SVG 动画：v4 特色能力 + createMotionPath

<v-clicks>

- v4 已扩展成动画引擎家族：Timer/Timeline/Draggable/ScrollObserver/**SVG**/Text/Layout
- SVG 三招：`createMotionPath`（路径运动）/ `morphTo`（形状变形）/ `createDrawable`（描边）

</v-clicks>

```js
import { animate, svg } from 'animejs';

const carAnim = animate('.car', {
  ease: 'linear',
  duration: 5000,
  loop: true,
  ...svg.createMotionPath('path'),   // 展开 {translateX, translateY, rotate}
});
```

<v-click>

- `createMotionPath(path, offset=0)` 返回 `{translateX, translateY, rotate}`，用 `...` 铺进配置对象

</v-click>

<!--
SVG 动画是 Anime.js v4 的特色能力，也是相比原生 WAAPI、甚至相比 GSAP 免费开源之前的一大差异化优势。

先定位：v4 时代 Anime.js 已经从单纯的补间动画库扩展成一整套引擎家族，Timer 计时器、Timeline 编排、Draggable 拖拽、ScrollObserver 滚动联动，加上今天要讲的 SVG，以及 Text 拆字、Layout 自动布局。SVG 模块三个招式：createMotionPath 路径运动、morphTo 形状变形、createDrawable 描边绘制，接下来逐个看。

先看 createMotionPath，让元素沿着一条 SVG path 路径运动，经典场景是让一辆车沿蜿蜒道路移动。接收一个路径选择器，第二参数 offset 默认 0，返回对象包含 translateX、translateY、rotate 三个映射属性。用扩展运算符 ... 直接把这三个属性铺进 animate 配置对象里，和 duration、ease、loop 这些播放参数混写。

效果上，元素不仅沿路径坐标运动，rotate 还会自动跟随路径切线方向旋转对齐，车头始终朝向前进方向，不用自己算角度。这个函数是 v3 anime.path() 的 v4 对应物，命名和调用方式都变了，但解决的问题是一样的。
-->

---

# SVG：morphTo 形状变形

```js
import { animate, svg, utils } from 'animejs';

// morphTo：形状变形（path 的 d / polygon,polyline 的 points）
const [$path1, $path2] = utils.$('polygon');
animate($path1, {
  points: svg.morphTo($path2),
  ease: 'inOutCirc',
  duration: 500,
});
```

<v-clicks>

- 目标类型限定：`SVGPathElement`/`SVGPolylineElement`/`SVGPolygonElement`
- `morphTo(shapeTarget, precision=0.33)`：precision 为 0 时不做点外推
- 返回值直接赋给 `points`（或 `d`）属性做动画

</v-clicks>

<!--
第二招 morphTo，做形状变形，让一个形状渐变成另一个形状。

接收目标形状，类型限定 SVGPathElement、SVGPolylineElement、SVGPolygonElement；第二参数 precision 默认 0.33，控制过渡平滑度，值为 0 时不做点外推，数值越大过渡越平滑。返回值直接赋给 points 或 d 属性做动画，这里用 utils.$ 选出两个 polygon，让第一个变形成第二个的形状。

这类形状渐变在 v3 时代要么做不到、要么得手写插值算法，v4 一个 morphTo 调用就搞定，是 SVG 模块里最"视觉炫技"的一招，常见于 icon 之间的切换过渡。
-->

---

# SVG：createDrawable 描边绘制

```js
import { animate, svg } from 'animejs';

animate(svg.createDrawable('.line'), {
  draw: ['0 0', '0 1', '1 1'],   // "start end"，两个 0~1 的值
  ease: 'inOutQuad',
  duration: 2000,
});
```

<v-clicks>

- 目标类型：`SVGLineElement`/`SVGPathElement`/`SVGPolylineElement`/`SVGRectElement`
- 返回代理元素，暴露虚拟属性 `draw`：`'0 1'` 完整显示，`'1 1'` 完全隐藏
- ⚠️ `vector-effect: non-scaling-stroke` 会拖慢性能（每帧重算缩放系数）

</v-clicks>

<!--
第三招 createDrawable，做描边线条绘制动画，常见于 logo 手绘、路径引导这类效果。

它接收目标选择器，类型限定 SVGLineElement、SVGPathElement、SVGPolylineElement、SVGRectElement，返回一个代理元素数组，这个代理暴露出一个额外的虚拟属性叫 draw，语法是"start end"两个 0 到 1 的数值。比 v3 手工读 getTotalLength 再算 stroke-dashoffset 直观太多，思路更接近声明式：直接说"画到哪儿"。

draw 的值怎么读：'0 1' 就是完整显示这条线，'1 1' 是完全隐藏，代码里从 '0 0' 到 '0 1' 再到 '1 1'，就是先画出整条线，再让线头开始追上收尾、直到完全消失，一个典型的"画出再擦除"效果。

有个性能提醒：如果这个 SVG 元素设置了 vector-effect: non-scaling-stroke，会拖慢性能，因为每一帧都要重新计算路径的缩放系数，大量元素同时描边动画时要留意这一点。
-->

---

# Draggable —— createDraggable() 拖拽

```js
import { createDraggable } from 'animejs';

createDraggable('.square', {
  container: '.stage',
  containerFriction: 0.8,          // 拖拽时越界的粘滞感
  releaseContainerFriction: 0.8,   // 松手后越界回弹的粘滞感
  releaseStiffness: 100,
  x: { snap: 50 },                  // 每 50px 吸附一次
  onGrab: () => {},
  onRelease: () => {},
});
```

<v-clicks>

- **Axes**（x/y 独立配置）：`snap` 吸附、`modifier` 加工、`mapTo` 映射到别的属性
- ⚠️ `containerFriction`（拖拽中摩擦）vs `releaseContainerFriction`（释放后回弹摩擦）
- 方法：`disable/enable/setX/setY/animateInView/stop/reset`

</v-clicks>

<!--
Draggable 拖拽物理，createDraggable 一行代码就能让元素可拖拽，默认无约束容器。

参数上，container 加 containerPadding 做边界约束；x、y 各自独立配置 Axes 参数，snap 是吸附点或间隔，这里每 50 像素吸附一次；modifier 对拖拽值再加工；mapTo 把拖拽量映射到别的属性，比如映射到 rotate 实现拖拽转盘的效果。

今天的踩坑高发点：containerFriction 和 releaseContainerFriction，命名非常相似但生效时机完全不同——前者作用于拖拽过程中越界时的阻尼手感，后者作用于松手后越界回弹的阻尼手感，一个在"拖的时候"，一个在"放手之后"，容易混淆。releaseStiffness/releaseDamping/releaseMass 是松手后弹簧回弹的物理参数。

回调有 onGrab、onDrag、onUpdate、onRelease、onSnap、onSettle、onResize 等；方法有 disable、enable、setX、setY、animateInView、scrollInView、stop、reset、revert、refresh。velocityMultiplier/minVelocity/maxVelocity 管惯性速度换算与钳制，scrollThreshold/scrollSpeed 管拖到容器边缘自动滚动。
-->

---

# ScrollObserver —— onScroll() 滚动联动

```js
import { animate, onScroll } from 'animejs';

animate('.reveal', {
  opacity: [0, 1],
  y: [50, 0],
  autoplay: onScroll({
    target: '.reveal',
    enter: 'bottom top',   // 目标底部 碰到 视口顶部 时触发
    sync: true,             // 播放进度与滚动进度同步
  }),
});
```

<v-clicks>

- 核心用法：把 `onScroll(...)` 塞进动画的 **`autoplay` 字段**（不是独立监听器）
- **Thresholds 四种写法**：像素 / 位置简写 / 相对偏移 `'top+100'` / `{min,max}` 区间
- 回调细分方向：`onEnter`/`onEnterForward`/`onEnterBackward`/`onLeave`…

</v-clicks>

<!--
ScrollObserver 滚动联动，核心用法是把 onScroll(...) 塞进动画的 autoplay 字段，而不是 true/false，本质是"用滚动位置驱动播放或进度"。

Settings 里，target 是被观察的目标元素默认是被动画元素本身，container 可以指定自定义滚动容器而不是 window，enter/leave 定义进入离开的判定位置，这里用的是位置简写，"bottom top" 表示目标底部碰到视口顶部时触发，leave 同理用 'top bottom'。sync true 表示播放进度和滚动进度同步，是"划过式"动画的常用写法；除此之外还有方法名模式（滚到点直接调用 play/pause 等方法）、平滑滚动模式、缓动滚动模式共四种同步模式。

Thresholds 有四种写法：数值像素、位置简写像这里的 bottom top、相对偏移比如 top+100、还有 min max 区间写法。

回调细分方向是个常考点：进入离开各自还分正向滚动和反向滚动，onEnter、onEnterForward、onEnterBackward、onLeave、onLeaveForward、onLeaveBackward，粒度比想象的更细，还有 onUpdate/onSyncComplete/onResize。方法上 link() 能把一个已有动画挂到 observer 上。
-->

---

# utils 工具函数速查

```js
import { utils } from 'animejs';

const [$el] = utils.$('.box');       // 选择器 → 元素数组
utils.set('.box', { x: 100 });        // 立即设置（无动画）
utils.get('.box', 'x');               // 读取当前值
utils.random(0, 100);                 // 随机数
utils.clamp(150, 0, 100);             // 钳制
utils.snap(53, 10);                   // 吸附到最近的 10 的倍数
utils.mapRange(5, 0, 10, 0, 100);     // 值域映射
utils.lerp(0, 100, 0.5);              // 线性插值
```

<v-clicks>

- 对应 v3 `anime.set/get/random()`，统一搬到 `utils` 命名空间
- 部分函数可直接当 **`modifier` 回调**塞进 animate 参数（如 `utils.round(2)`）
- `utils.keepTime()`：媒体查询等重建场景下保留原播放进度

</v-clicks>

<!--
utils 工具函数速查，这些是日常写动画之外的辅助函数。

utils.$ 是选择器转元素数组的简写；set/get 无动画地立即设置或读取属性值，对应 v3 的 anime.set/anime.get；random 生成随机数（还有 createSeededRandom 可复现版本、randomPick、shuffle）；clamp 钳制数值范围；snap 吸附到最近的倍数，比如 53 吸附到 10 的倍数就是 50；mapRange 做值域映射；lerp 做线性插值，还有 damp 阻尼插值、degToRad/radToDeg 角度弧度互转。这些都是从 v3 anime 全局对象搬到 v4 utils 命名空间下的。

有意思的一点：这些函数里相当一部分本身可以直接当 modifier 回调塞进 animate 参数里，比如 modifier: utils.round(2) 做数值取整显示，是 v3 round 参数在 v4 里的替代写法。

再提一个 v4.1.0 新增的：utils.keepTime()，包装一个 Timer/Animation/Timeline 构造函数，在比如媒体查询触发的重建场景下保留原有播放进度，常与 createScope 的 mediaQueries 参数搭配使用，这是给 React/Vue 等框架组件重建场景准备的能力。
-->

---

# 回调与播放控制

<v-clicks>

- 三个基础回调：`onComplete`/`onUpdate`/`onBegin`，直接写进配置对象
- ⚠️ **`.play()`/`.reverse()` 语义变了**：v3 是"切换"，v4 恒定正向/反向
- 想恢复暂停状态，v4 要用 **`.resume()`**（不是再点一次 `.play()`）
- 方法家族：`play/pause/resume/restart/reverse/alternate/seek/cancel/revert`

</v-clicks>

```js
const anim = animate('.sq', { x: 100, autoplay: false });

anim.play();     // 恒定正向播放（v3 是切换语义）
anim.pause();
anim.resume();    // 从暂停处继续（v4 新语义，别用 play()）
anim.reverse();   // 恒定反向播放
```

<!--
回调与播放控制。最基础三个回调 onComplete、onUpdate、onBegin，直接写进配置对象。

重点讲一个专家级考点：v3 的 play/reverse 是"切换"语义，再调一次可能会反向；v4 里 play 恒定正向播放、reverse 恒定反向播放，语义变成"确定性"的了。这带来一个直接后果：v4 想要恢复一个被暂停的动画，不能再指望调 play() 简单切换回去，要用专门的 resume() 方法。

代码演示：创建时 autoplay 设 false 先不播；play 是恒定正向；pause 暂停；resume 从暂停的地方继续，这是 v4 新语义、容易被按 v3 习惯误用成 play()；reverse 是恒定反向播放。

播放控制方法家族在 Timer/Animation/Timeline 三者间高度一致，因为它们共享同一个 Timer 基类，这是刻意设计的继承体系而非巧合，意味着学会一套方法名就能操作全部三种实例。
-->

---

# 性能与体积：tree-shaking

```js
// 主入口（走 tree-shaking，推荐）
import { animate, createTimeline, stagger } from 'animejs';

// 子路径导入（无 bundler / 极限体积场景）
import { animate } from 'animejs/animation';
import { createDraggable } from 'animejs/draggable';
```

<v-clicks>

- `exports` 暴露十余个独立子路径：`./animation` `./draggable` `./svg` `./waapi`…
- 无 bundler 也能零构建：浏览器原生 `importmap` 映射子路径到 `node_modules`
- `waapi.animate()` 约 **3KB** vs 完整版 `animate()` 约 **10KB**（换取原生硬件加速）
- 性能三兄弟：`fps`/`frameRate`、`precision`、`pauseOnDocumentHidden`（默认切后台自动暂停）

</v-clicks>

<!--
性能与体积。v4 是彻底的 ESM-first 模块化架构，package.json 的 exports 字段暴露了十几个可以独立按需引入的子路径，每个都有自己的 d.ts 和 esm/cjs 产物——这是"模块化架构"最直接的证据。

主入口走 tree-shaking，用不到的模块打包时会被摇掉；极限体积场景还可以直接用子路径导入，一个函数只加载自身代码。更进一步，v4 是 type module 包，没有 bundler 的环境下也能用浏览器原生 script type importmap 把这些子路径映射到 node_modules 文件，实现零构建按需加载。

体积对比这个数字值得记住：waapi.animate() 轻量版本官方标注约 3KB，完整 JS 版 animate() 约 10KB，换来的是原生硬件加速，但代价是砍掉了 composition、modifier、playbackEase、frameRate、stretch()、refresh() 这些 JS 版独占的能力。

Engine 全局配置里性能相关三兄弟：fps/frameRate 限制刷新频率省 CPU，precision 控制数值精度影响计算量，pauseOnDocumentHidden 默认就是 true，切到后台标签自动暂停省电。engine.defaults 还能给全部动画一个统一兜底默认值。
-->

---

# 易错点合集

<v-clicks>

- **心智重启**：v4 无 `anime` 默认导出，裸调用报 `anime is not a function`
- **easing 改名**：`easing`→`ease`，值也简化（去掉 easeIn 前缀、首字母小写）
- **stagger 忘记导入**：新手期最高频报错来源
- **`<`/`<<` 反着记**：`<` 是结束点，`<<` 是开始点，直觉恰好相反
- **v4.4.0 仍有 breaking change**：transform 渲染顺序、回调第三参数变了
- **WAAPI 版不是加参数切换**：`waapi.animate()` 是独立入口，功能子集不同
- **Draggable 两个摩擦参数**：`containerFriction` 拖拽中，`release-` 释放后

</v-clicks>

<!--
易错点合集，把前面散落各页的坑集中过一遍，方便查漏。

第一，整包心智要重启，v4 没有 v3 那个万能默认导出 anime 对象了，任何裸 anime(...) 调用直接判定是 v3 写法，v4 环境下报 anime is not a function。

第二，easing 改名是双重坑，字段名从 easing 变 ease，值的写法也从 easeInOutQuad 简化成 inOutQuad。

第三，stagger 必须显式具名导入，不是挂在全局对象上随手调，忘记导入是新手期最高频的报错来源。

第四，Timeline 的 '<' 和 '<<' 反着记，直觉上尖括号越多应该越靠后，实际上 '<<' 是回到更前面的开头。

第五，不要以为过了 v3→v4 这道坎就一劳永逸，v4.4.0 内部也发生过 breaking change，transform 渲染顺序被固定为 perspective>translate>rotate>scale>skew、函数式取值回调第三参数从 total 数字改成 targets 数组。

第六，waapi.animate() 是完全独立的命名空间入口，不是给原生 animate 加个参数就能切换过去，功能子集也不一样，没有 composition/modifier/frameRate/playbackEase。

第七，Draggable 的 containerFriction 和 releaseContainerFriction，命名相似但生效时机完全不同，前者拖拽中、后者释放后回弹，出题踩坑高发点。另外无 bundler 环境下裸 script 标签写 import 若不搭配 type="module" 也会报错，想要老式全局变量体验要换 UMD 构建产物。
-->

---

# 选型对比：vs GSAP / WAAPI / Motion

| 维度 | Anime.js v4 | GSAP | 原生 WAAPI | Motion |
|---|---|---|---|---|
| 许可 | MIT 完全免费 | 2024 起 100% 免费（自有协议） | 浏览器标准，免费 | 核心免费+付费 Motion+ |
| 体积 | 模块化按需，3~10KB | 相对更大，插件可按需 | 零额外体积 | 官网强调极小包体积 |
| 功能广度 | 追平 GSAP：Timeline/SVG/Draggable/Scroll | 插件生态最悠久、边缘案例打磨多年 | 仅基础补间，无编排能力 | 侧重 React/Vue 声明式 |
| 心智模型 | 命令式，接近原生 DOM | 命令式，与 Anime.js 接近 | 命令式，更底层 | 声明式：props/variants 驱动 |

<div v-click class="mt-4 text-sm">

> **选型建议**：轻量 + 免费 + 非框架绑定 + SVG 特色效果 → Anime.js；极致边缘案例稳定性 + 大型商业项目 → GSAP；已是 React/Vue 技术栈 + 声明式 → Motion。

</div>

<!--
最后做个选型对比。许可上，Anime.js 一直 MIT 完全免费开源；GSAP 2024 年被 Webflow 收购后官网原话"现在对所有用户 100% 免费"，含原本付费的 ScrollTrigger、MorphSVG、DrawSVG、SplitText 等插件，但许可条款是 GSAP 自有协议，不是标准 MIT；原生 WAAPI 是浏览器标准天然免费；Motion（原 Framer Motion，2024 年更名并从 React 独占扩展到 React/JavaScript/Vue 三端）核心免费加付费 Motion+ 解锁高级组件。

体积上 Anime.js 模块化按需引入，3 到 10KB 区间；GSAP 相对更大但插件也支持按需；原生 WAAPI 零额外体积；Motion 官网强调极小包体积。

功能广度，Anime.js v4 时代基本追平 GSAP 覆盖面；GSAP 插件生态历史最悠久，ScrollTrigger、Flip、MorphSVG、Physics2D 等边缘案例打磨多年；原生 WAAPI 仅基础补间，没有内置 timeline/stagger/draggable/scroll 编排能力；Motion 侧重 React/Vue 声明式动画，拖拽滚动联动作为 hooks 提供。

心智模型上，Anime.js 和 GSAP 都是命令式，API 设计哲学接近（时间轴、tween、ease 字符串）；WAAPI 更底层，el.animate(keyframes, options)；Motion 是声明式，组件 props/variants 驱动，天然贴合 React/Vue 数据驱动范式，layout animation 用 FLIP 技术做了大量优化。

选型建议：需要轻量、免费、非框架绑定、又要 SVG 形变描边路径运动这类特色效果时优先 Anime.js；需要极致边缘案例稳定性、大型商业项目、插件生态成熟度优先时选 GSAP，现在也免费了成本顾虑没了；已经是 React/Vue 技术栈希望动画状态和组件状态强绑定时选 Motion。
-->

---
layout: intro
---

# 总结

Anime.js = **轻量模块化的 JavaScript 动画引擎**（v4.5）

- v3→v4 彻底重写：具名导出 `animate()`，`easing`→`ease`，`direction` 拆两个布尔
- Timeline 位置语法：`<` 结束 / `<<` 开始；`stagger()` 交错必须显式导入
- SVG 特色三招：`createMotionPath` 路径运动 / `morphTo` 变形 / `createDrawable` 描边
- Draggable 拖拽 + ScrollObserver 滚动联动，性能靠 tree-shaking 按需引入
- 选型：轻量免费 + SVG 特色效果优先 Anime.js；边缘案例稳定性优先选 GSAP

<div class="abs-br m-6 text-sm">
  <a href="https://animejs.com" target="_blank" class="slidev-icon-btn">animejs.com</a>
  ·
  <a href="https://github.com/juliangarnier/anime" target="_blank" class="slidev-icon-btn">GitHub</a>
</div>

<!--
总结一下。

Anime.js 是一个轻量模块化的 JavaScript 动画引擎，当前 v4.5。

今天最核心的一条线是 v3→v4 的彻底重写：具名导出 animate()，easing 改名 ease，direction 拆成 reversed 和 alternate 两个独立布尔——这道坎迈过去，后面的 API 才看得懂。

Timeline 编排要记住位置语法，尤其是 '<' 是结束、'<<' 是开始这个反直觉的点；stagger() 交错必须显式具名导入，这是最高频的新手报错。

SVG 是 v4 的特色能力，三招 createMotionPath 路径运动、morphTo 形状变形、createDrawable 描边绘制，把 v3 时代手算 dashoffset 的老套路变成了声明式 API。

再加上 Draggable 拖拽物理和 ScrollObserver 滚动联动，功能广度已经追近 GSAP。性能上靠彻底的 ESM 模块化和 tree-shaking，按需引入把体积压到最小。

选型一句话：要轻量、免费、非框架绑定，又想要 SVG 这类特色效果，优先 Anime.js；要极致的边缘案例稳定性和大型商业项目积淀，选 GSAP，而且现在也完全免费了。谢谢大家。
-->
