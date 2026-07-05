---
theme: seriph
background: https://cover.sli.dev
title: Welcome to GSAP
info: |
  Presentation GSAP — the JavaScript animation library for the modern web.

  Learn more at [https://gsap.com](https://gsap.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">⚡</span>
</div>

<br/>

## GSAP v3.15 — 动画超能力引擎

框架无关的专业级动画库，Tween + Timeline 编排一切可动属性，2025 年起全插件免费

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/greensock/GSAP" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 GSAP —— GreenSock Animation Platform。官方自我定位：a framework-agnostic JavaScript animation library that turns developers into animation superheroes，能动画 DOM/CSS/SVG/Canvas/WebGL/任意数值对象属性，跨浏览器一致。

版本基线：npm 实测 gsap@3.15.0，2026-04-13 发布。核心心智模型只有两个词：Tween（补间）+ Timeline（时间线编排）。

一个必须先讲清楚的现状：2024 年 10 月 GSAP 被 Webflow 收购，2025 年 4 月 v3.13 起 100% 免费——包括曾经付费的 Club GreenSock 插件（ScrollTrigger、SplitText、Draggable、Flip 等），含商业项目使用。这是相对旧知识的重大更新，下一页细讲。

顺序：定位 → 免费现状 → Tween 四方法 → vars 配置 → 属性简写 → 缓动 → Timeline → stagger → 控制回调 → ScrollTrigger → 插件巡礼 → React 集成 → 清理 → 性能 → 易错点 → 选型对比 → 资源 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 GSAP？

CSS `transition`/`@keyframes` 和原生 WAAPI 够用，但复杂编排很快力不从心：

<v-clicks>

- 没有真正的时间线嵌套 / 标签定位 / 中途改值
- 条件分支、动态值靠切 class 硬凑
- 跨浏览器细节差异仍需心智负担

</v-clicks>

<div v-click class="mt-6">

GSAP 是框架无关的专业级动画引擎：

- 自研渲染循环，跨浏览器行为高度一致
- Tween + Timeline 编排语法糖 + 成熟插件生态
- 命令式脚本风格，不绑定任何框架渲染模型

</div>

<!--
为什么用 GSAP？CSS transition/@keyframes 声明式、零 JS 依赖，走浏览器合成器线程，性能下限有保障；WAAPI 的 element.animate() 也能被硬件加速。但两者时序编排能力都弱：没有真正的时间线嵌套、标签定位、运行时中途改变目标值的能力，条件分支和动态值处理只能靠切 class 硬凑，跨浏览器细节差异也仍需 polyfill 心智负担。

GSAP 的差异化：自研渲染循环，不是直接依赖 CSSOM/WAAPI，历史上大量精力投入在填平浏览器差异，跨浏览器行为高度一致；Timeline/Label/位置参数体系是同类中最成熟的编排语法；插件生态成熟，ScrollTrigger 是滚动动画事实标准。代价是比纯 CSS 多一层 JS 运行时依赖。

它是命令式脚本风格，不是声明式框架绑定库——不直接输出 React 组件化 API，在 React 等框架里要靠 useGSAP/gsap.context 兜底做清理，这个后面会细讲。核心心智模型只有两个词：Tween 补间，Timeline 时间线编排。
-->

---

# 2025 起：全插件 100% 免费

| 时间 | 事件 |
|---|---|
| 2024-10-15 | GSAP 被 **Webflow** 收购 |
| 2025-04-29 | v3.13：**100% 免费**，含全部原付费插件 |
| 2025-12-08 | v3.14：MorphSVG 新增 `smooth` 平滑锚点 |
| 2026-04-13 | v3.15：新增 `easeReverse`（npm 实测最新版） |

<div v-click class="mt-4">

> "GSAP is now 100% free for all users, thanks to Webflow's support." —— 官方 pricing 页

</div>

<div v-click class="mt-3 text-sm">

ScrollTrigger、SplitText、Draggable、Flip、MotionPathPlugin、MorphSVGPlugin、Observer、ScrollSmoother、InertiaPlugin **全部插件、含商业项目使用，均免费**，无需注册 Club GreenSock 账号。

</div>

<!--
这是命题必考现状，务必更新旧认知。2024 年 10 月 15 日，GSAP 被 Webflow 收购，收购公告同时承诺「will continue to be publicly available for everyone to use on the wider web」，独立性不受影响。

2025 年 4 月 29 日 v3.13 发布，官方原话「100% FREE including ALL of the bonus plugins like SplitText, MorphSVG, and all the others that were exclusively available to Club GSAP members」。这是相对旧知识的重大更新——以前的认知是"核心免费但 ScrollTrigger/SplitText 等高级插件需付费会员"，现在不成立了。

后续 3.14（MorphSVG smooth 锚点）、3.15（easeReverse）持续迭代，插件总览页也没有任何插件标注价格或"仅限会员"字样，交叉验证无矛盾。以后看到"GSAP 高级插件要付费"的说法，直接判定过时。
-->

---

# Tween：to / from / fromTo / set

| 方法 | 语义 | immediateRender |
|---|---|---|
| `gsap.to(target, vars)` | 当前值 → 目标值（最常用） | `false` |
| `gsap.from(target, vars)` | 指定值 → 当前值（入场动画） | `true` |
| `gsap.fromTo(target, from, to)` | 显式声明起止两端 | `true` |
| `gsap.set(target, vars)` | 零时长立即设置 | — |

```js
gsap.to(".box", { x: 100, duration: 1, ease: "power2.out" });
gsap.from(".box", { opacity: 0, y: 50, duration: 1 });
gsap.fromTo(".box", { scale: 0 }, { scale: 1, duration: 0.6 });
gsap.set(".box", { transformOrigin: "50% 50%" });
```

<!--
GSAP 最基础的四个方法，Tween 即补间动画。to 是最常用的，从元素当前状态动画到 vars 指定的目标值。from 反过来，从 vars 指定值动画到当前状态，常用来做入场动画——元素本来在最终位置，from 让它"从别处飞入"。

fromTo 显式声明起止两端，最精确可控，不依赖当前 DOM 状态的不确定性，避免闪烁。set 是零时长的瞬时赋值，本质是 duration:0 的特例，常用于动画前先摆好初始状态。

注意 immediateRender 默认值的差异：to 默认 false（不会一创建就跳到目标值），而 from/fromTo 默认 true（创建瞬间立即渲染起始值）。这个默认值差异是很多"动画一开始就诡异跳变"问题的根源，后面易错点那页会再展开。

目标可以是 CSS 选择器字符串、DOM 元素、元素数组，也可以是普通 JS 对象——GSAP 不局限于 DOM。
-->

---

# vars 配置：重复、相对值与函数式

<v-clicks>

- `duration`（默认 0.5s）/ `delay` / `ease`（默认 `power1.out`）
- `repeat: -1` 无限循环，`repeatDelay`，`yoyo: true` 往返播放
- `repeatRefresh: true` 配合 `random()`，每轮重新取值
- `overwrite` 控制同目标动画冲突时的覆盖策略

</v-clicks>

```js
gsap.to(".box", { x: "+=100" });              // 相对当前值增加 100
gsap.to(".box", { x: "random(-100, 100)" });  // 随机值
gsap.to(".box", { x: (i) => i * 50, repeat: -1, repeatRefresh: true }); // 函数式 + 每轮重新随机
```

<!--
vars 配置对象是每个 Tween 的第二参数，属性很多，挑高频的讲。基础时序三件套：duration 默认 0.5 秒，delay 延迟，ease 默认 power1.out。

重复相关：repeat 设 -1 表示无限循环，repeatDelay 是每轮之间的停顿，yoyo 设 true 让动画往返播放（去程用 ease，回程默认反向镜像）。repeatRefresh 是进阶技巧，配合 x 设成 random(...) 这样的随机值语法，能让每一轮重复都重新求值，做出"每次都不一样"的随机重复效果。

特殊值语法很实用：字符串 "+=100" 表示相对当前值增加，"-=50" 减少；"random(-100,100)" 随机取值；还支持函数式写法，参数是索引，可以为每个元素算出不同的动态目标值，比数组手写方便得多。

overwrite 配置项后面易错点也会提到，控制同一目标被多个动画同时作用时怎么处理冲突。
-->

---

# transform 简写与 autoAlpha（必考）

```js
gsap.to(element, { x: 50 });                     // 而非 { transform: "translateX(50px)" }
gsap.to(element, { autoAlpha: 0, duration: 1 });  // 淡出且脱离交互
gsap.to(myObj, { value: 100, onUpdate: () => draw(myObj.value) }); // 任意对象属性
```

<v-clicks>

- `x`/`y`/`scale`/`rotation`/`skewX` 等替代 CSS `transform` 字符串
- 原因：省去字符串解析开销 + 固定变换顺序，规避书写顺序坑
- `autoAlpha` = `opacity` + `visibility` 合体，0 时自动隐藏且脱离交互
- SVG 专属属性：`attr:{ x, cx, r }`、`fill`、`stroke-dashoffset`

</v-clicks>

<!--
GSAP 的独立 transform 属性是必考重点。用 x、y、xPercent、yPercent、scale、scaleX、scaleY、rotation、rotationX、rotationY、skewX、skewY 代替原生 CSS transform 字符串，原因两点：第一，避免"写入字符串→浏览器解析生成 matrix()→再读取"的额外开销；第二，GSAP 内部固定按平移→缩放→rotationX→rotationY→倾斜→旋转的顺序应用变换，规避了原生 CSS transform 因书写顺序不同导致结果不同的坑。这个顺序不可配置更改。

autoAlpha 是 opacity 加 visibility 的合体属性，值为 0 时自动加 visibility:hidden，避免不可见元素仍可被交互或被读屏，非 0 时恢复 visibility:inherit，常用于淡入淡出场景比单独控 opacity 更完整。

GSAP 不局限于 DOM，可以直接动画普通 JS 对象的任意数值属性，比如游戏坐标、Canvas 绘制参数，配合 onUpdate 回调重绘。SVG 场景可以直接动画 attr 里的 x/cx/r 等专属属性，以及 fill、stroke-dashoffset 做描边动画。3D 变换还有 transformPerspective 或父容器 CSS perspective 配合 rotationY/rotationX。
-->

---

# 缓动 Ease（必考）

内置族：`power1~4` / `back` / `elastic` / `bounce` / `circ` / `expo` / `sine` / `steps`

修饰符：`.in`（起步慢）/ `.out`（起步快，默认族多用）/ `.inOut`（两端都缓）

```js
gsap.to(".box", { x: 300, ease: "power2.out" });
gsap.to(".box", { x: 300, ease: "back.out(1.7)" });       // 超调强度
gsap.to(".box", { x: 300, ease: "elastic.out(1, 0.3)" }); // 振幅、周期
gsap.to(".box", { x: 300, ease: "steps(6)" });            // 阶跃数
gsap.defaults({ ease: "power2.out", duration: 1 });        // 全局默认
```

<div v-click class="mt-2 text-sm">

> Ease Visualizer：官网交互式曲线编辑器，Alt+点击切换锚点平滑/尖角，生成 `CustomEase` 代码。

</div>

<!--
Ease 决定动画的"手感"，是必考重点。内置族分几类：power1 到 power4 是幂函数，力度递增；back 回弹超调；elastic 弹簧；bounce 弹跳；circ、expo、sine 是三角或指数曲线；steps 阶跃，动画像逐帧定格。EasePack 还有 rough、slow、expoScale 扩展。

每种 ease 都可以加修饰符：in 起步慢后加速，out 起步快后减速——默认族基本都用 out，因为符合"快速响应、缓慢停止"的直觉；inOut 两端都缓。

可配置参数很关键：back.out(1.7) 的 1.7 是超调强度，默认值就是 1.70158；elastic.out(1, 0.3) 两个参数分别是振幅和周期；steps(6) 的 6 是阶跃数量。ease 默认值是 power1.out，可以用 gsap.defaults 或 timeline 的 defaults 统一改全局或局部默认值。

官网提供 Ease Visualizer 交互式曲线编辑器，可视化调参、生成 CustomEase 自定义贝塞尔曲线代码，还有 CustomBounce、CustomWiggle 等自定义插件。
-->

---

# Timeline：链式编排

```js
let tl = gsap.timeline({
  repeat: 2, yoyo: true,                              // 重复 2 次，往返播放
  defaults: { duration: 1, ease: "power2.inOut" },     // 子动画默认值统一管理
  onComplete: () => console.log("done"),
});

tl.to("#a", { x: 100 })
  .to("#b", { y: 100 })       // 默认接在上一个动画结束处（sequential）
  .from(".c", { opacity: 0 })
  .add(otherTimeline(), "+=0.5"); // 嵌套子 timeline，整体复用
```

<v-clicks>

- 链式 `.to()/.from()/.set()` 默认按顺序衔接播放
- `defaults` 统一管理子动画默认值，避免重复书写
- `add()` 可嵌套整条子 timeline，整体复用/编排

</v-clicks>

<!--
Timeline 是 GSAP 最核心的编排能力，把多个 Tween 组织成一条有序的时间线。gsap.timeline() 创建容器，可以传 repeat、repeatDelay、yoyo、paused 等和普通 Tween 类似的配置，还有专属的 defaults，给所有子动画提供统一默认值，比如统一 duration 和 ease，避免每个子动画都重复写一遍。

链式调用是最常见写法：tl.to().to().from() 一路点下去，默认每个动画接在上一个动画结束的地方顺序播放，这叫 sequential。也可以 add() 一整条其他 timeline 进来做嵌套，实现复杂动画的模块化复用和整体编排。

这只是链式的默认行为——顺序播放。真正强大的是第二个位置参数，能精确控制每个动画插入的时间点，包括并行、重叠、按标签定位，这是下一页的重点。
-->

---

# Timeline 位置参数（必考重点）

| 写法（第二/三参数） | 含义 |
|---|---|
| `3`（数字） | 绝对时间：第 3 秒处插入 |
| `"+=1"` / `"-=1"` | 相对时间：接在末尾之后 / 与末尾重叠（提前） |
| `"myLabel"` / `"myLabel+=2"` | 定位到标签（`addLabel()`），或标签之后 2 秒 |
| `"<"` | 上一个动画的**起点**（制造并行同时开始） |
| `">"` | 上一个动画的**终点**（默认顺序衔接） |
| `"<1"` / `">-0.5"` | 起点/终点再做相对偏移 |

<!--
Timeline 位置参数是 GSAP 最容易被低估但面试必考的重点，决定每个动画到底插到时间线的哪个时刻。

数字是绝对时间，比如 tl.to(el, {...}, 3) 就是不管前面动画进度如何，固定在第 3 秒插入。"+=1" 是相对时间，接在当前 timeline 末尾之后 1 秒；"-=1" 反过来，与末尾重叠 1 秒，常用来做"提前一点点开始，制造衔接更紧凑的观感"。

标签系统：先用 addLabel 打标签，再用标签名定位，"myLabel+=2" 就是标签之后 2 秒。最常用的两个是尖括号写法："<" 定位到上一个动画的起点，这是制造多个动画同时开始、并行播放的标准写法；">" 是终点，等价于默认的顺序衔接。"<1"、">-0.5" 还能在起点或终点基础上再做相对偏移。

记住一条经验：想要"同时发生"用 "<"，想要"紧接着但提前一点重叠"用负的相对时间比如 "-=0.3"。这套体系是 GSAP 编排能力远超 CSS/WAAPI 的核心原因。
-->

---

# stagger 交错（必考）

```js
gsap.to(".box", { y: 100, stagger: 0.1 }); // 每个元素间隔 0.1s 依次开始

gsap.to(".box", {
  y: 100,
  stagger: { each: 0.1, from: "center", grid: "auto", ease: "power2.inOut" },
});
```

<v-clicks>

- 数字：固定间隔；负数倒序开始
- 对象：`each` 固定间隔 vs `amount` 总时长自动均分，语义不同
- 函数式：`(index, target, list) => index * 0.1` 完全自定义
- `from` 支持 `"center"`（向两侧辐射）/ `"edges"`（相反）/ `"random"`

</v-clicks>

<!--
stagger 交错是让多个目标依次错开时间开始动画的机制，数字用法最简单，比如 0.1 就是每个元素间隔 0.1 秒依次开始，负数则倒序开始。

对象写法能精细控制：each 是相邻元素固定间隔，amount 是总时长按元素数量自动均分——这两者语义不同，元素数量变化时 amount 的实际间隔会跟着变而 each 不会，是常见的混淆点。from 控制起始位置，center 从中心向两侧辐射，edges 相反从两端向中心收缩，random 随机顺序，也可以给具体索引从该索引向两侧辐射。grid 设 auto 能自动按 getBoundingClientRect 推断二维网格的行列，配合 axis 只按某一轴计算距离。

还有函数式写法，参数是 index、target、整个 list，可以完全自定义每个元素的延迟，比如做非线性的错落效果。stagger 内部还能再嵌 repeat，但那是易错点会讲的坑——写在外层和写在 stagger 对象里语义完全不同。
-->

---

# 控制方法与回调

Tween / Timeline 通用实例方法：`play()` / `pause()` / `resume()` / `reverse()` / `restart()` / `seek(time|label)` / `progress(0~1)` / `timeScale(value)` / `kill()`

```js
tl.seek("myLabel");         // 跳转到标签
tl.timeScale(2);            // 2 倍速播放
await tween.then(() => {}); // then() 返回 Promise，可 await 完成
```

<v-clicks>

- 回调族：`onStart`/`onUpdate`/`onComplete`/`onRepeat`/`onReverseComplete`
- 均有对应 `xxxParams` 传参数组，`callbackScope` 指定 `this`
- `timeScale` 本身也能被 tween，实现渐进加速/减速

</v-clicks>

<!--
播放控制方法是 Tween 和 Timeline 通用的，play、pause、resume、reverse、restart 顾名思义，seek 可以传时间数字或标签名直接跳转，progress 传 0 到 1 的比例跳转，timeScale 变速播放，数字越大越快，kill 销毁。

then() 是个容易被忽略但很实用的方法，返回一个 Promise，可以 await tween.then() 等动画真正播放完成，方便和 async/await 代码结合，不用非得写 onComplete 回调。

回调族覆盖了动画生命周期的各个节点：onStart 开始、onUpdate 每帧、onComplete 完成、onRepeat 每轮重复、onReverseComplete 反向播放完成，都有对应的 xxxParams 数组传自定义参数，callbackScope 可以指定回调里 this 指向谁。

一个进阶技巧：timeScale 本身也是可以被动画的属性，对 timeScale 做 tween 就能实现动画整体渐进加速或减速的效果，比如做一个"越转越快"的转盘。
-->

---

# ScrollTrigger：滚动驱动动画（1/2）

```js
gsap.registerPlugin(ScrollTrigger);

gsap.to(".box", {
  scrollTrigger: {
    trigger: ".box",
    start: "top bottom",   // 触发元素 top 碰到视口 bottom
    end: "bottom top",     // 触发元素 bottom 碰到视口 top
    scrub: 1,               // 数字=平滑追随；true=完全同步
    pin: true,               // 固定触发元素直至 end
    toggleActions: "play pause resume reverse",
  },
  x: 500,
});
```

<!--
ScrollTrigger 是滚动驱动动画的事实标准插件，必考重点，拆两页讲。先注册插件，然后在任意 Tween 的 vars 里加 scrollTrigger 配置对象。

start/end 决定触发区间，支持关键词组合比如 "top bottom" 表示触发元素的 top 边碰到视口的 bottom 边时开始，也支持百分比、像素、相对写法。scrub 有三态：true 是严格跟手，滚动多少动画进度就是多少；数字比如 1 是追及延迟秒数，制造平滑跟随而不是死板同步；不设置则走 toggleActions 的播放暂停语义，不跟手，是常规的"滚到就播放一次"效果。

pin:true 会固定触发元素直到 end，常用来做"滚动到某处、内容锁住、动画在原地播放完再继续滚"的效果，但要注意一个坑：不要直接给被 pin 的元素做位移动画，应该动画它内部的子元素，否则会跟 pin 本身的定位机制冲突，下一页易错点还会再强调。开发期还有 markers:true 可视化调试标记，上线要记得关掉。

toggleActions 是四段式配置，依次对应 onEnter/onLeave/onEnterBack/onLeaveBack 四个时机，每段可以取 play/pause/resume/reverse/restart/reset/complete/none。
-->

---

# ScrollTrigger：进阶能力（2/2）

<v-clicks>

- **snap 吸附**：数字（增量）/ 数组（离散点）/ `{ snapTo:"labels", duration:{min,max} }`
- **batch() 批量**：长列表逐个进入动画，合并同批触发降低开销
- **refresh 刷新**：DOM/内容尺寸变化后必须手动 `ScrollTrigger.refresh()`
- **pinReparent**：祖先 `transform`/`will-change` 会破坏 `pin`，需临时挂到 `body`
- **清理**：`ScrollTrigger.getAll()` / `trigger.kill()` / `killAll()`
- **getVelocity()**：返回像素/秒的滚动速度，可判断"快速滚动"

</v-clicks>

```js
ScrollTrigger.batch(".item", {
  onEnter: (batch) => gsap.to(batch, { opacity: 1, stagger: 0.15 }),
  interval: 0.1,
});
```

<!--
接着讲 ScrollTrigger 的进阶能力。snap 吸附让滚动结束后自动吸附到指定位置，数字是增量吸附，数组是离散点，对象形式 snapTo:"labels" 能吸附到 timeline 的标签，常配合 pin 加 scrub 做全屏分页的 story 叙事。

batch() 是长列表性能优化的关键，比如一屏几十个卡片逐个进入动画，如果每个都单独建 ScrollTrigger 开销很大，batch 把同一批次的触发合并处理，配合 stagger 做逐个进入的效果，interval 控制怎样算"同一批"。

refresh 是最容易被忽略的坑：图片异步加载、无限滚动追加内容、字体加载导致行高变化，都会让已创建的 ScrollTrigger 的 start/end 位置计算过期，必须在内容稳定后手动调用 ScrollTrigger.refresh()。pinReparent 解决另一个坑：如果 pin 元素的祖先有 transform 或 will-change，会破坏 position:fixed 的定位语义，导致 pin 错位，加 pinReparent:true 让元素固定期间临时挂到 body 上就能规避。

清理用 getAll/kill/killAll，在框架里通常交给 useGSAP 或 gsap.context 自动做。getVelocity() 能拿到滚动速度，用于判断"快速滚动"时切换不同的动画表现。
-->

---

# 插件巡礼：SplitText / Flip / MotionPath

```js
// SplitText：逐字拆分 + 交错入场
SplitText.create(".text", { type: "chars, words, lines", autoSplit: true,
  onSplit: (self) => gsap.from(self.chars, { y: 100, autoAlpha: 0, stagger: 0.03 }),
});

// Flip：First-Last-Invert-Play 布局动画
const state = Flip.getState(".item");    // First：记录当前位置
container.classList.toggle("list-view"); // Last：改变 DOM 触发新布局
Flip.from(state, { duration: 0.6, absolute: true }); // Invert+Play：自动补间差值
```

<v-clicks>

- **SplitText**：3.13 起免费重写，体积减半 + 屏幕阅读器无障碍
- **Flip**：`getState()` 记录 → 改 DOM → `Flip.from()` 补间差值
- **MotionPathPlugin**：沿 SVG 路径/坐标数组动画，`autoRotate` 沿切线转向

</v-clicks>

<!--
插件巡礼，挑三个最常考的。SplitText 拆分文字做逐字逐词动画，type 可以是 chars、words、lines 组合，autoSplit:true 让窗口尺寸变化或字体加载完成后自动重新拆分，规避响应式断行错位，3.13 起同期重写，体积减半还加了屏幕阅读器无障碍支持。

Flip 是 Paul Lewis 提出的 FLIP 技术：First-Last-Invert-Play。先用 getState 记录当前布局状态，然后正常地改 DOM 或切 class 触发新布局，最后 Flip.from 传入之前记录的状态，GSAP 自动计算差值补间播放，让"布局跳变"变成"平滑过渡"。React 等框架里因为渲染是异步的，要等新 DOM 真正渲染完成后再调用，通常用 requestAnimationFrame 包裹，并且要显式传 targets。

MotionPathPlugin 让元素沿 SVG 路径或坐标数组动画，path 支持选择器、路径字符串、坐标点数组，align 让元素贴合路径校正嵌套变换，autoRotate 沿切线方向自动转向，配套 MotionPathHelper 能在浏览器里可视化拖拽编辑路径。

这三个插件，和 Draggable、MorphSVGPlugin、Observer、ScrollSmoother、InertiaPlugin 一样，2025 年 4 月起全部免费，不用再考虑授权成本。
-->

---

# useGSAP()：React 集成（必考现代实践）

```jsx
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

function Comp() {
  const container = useRef();
  const { contextSafe } = useGSAP(() => {
    gsap.to(".box", { x: 360 }); // 选择器自动限定在 scope 内
  }, { scope: container, dependencies: [] });
  const onClick = contextSafe(() => {  // 事件处理器内的动画也需包裹
    gsap.to(".box", { rotation: 180 });
  });
  return <div ref={container}><button onClick={onClick}>go</button></div>;
}
```

<!--
useGSAP 是 React 中的现代必考实践，npm install @gsap/react 后作为插件注册。官方原话：useGSAP() is a drop-in replacement for useEffect/useLayoutEffect that automatically handles cleanup using gsap.context()。

用法上，第一个参数是回调函数，里面创建的动画会被自动收集；第二个参数是配置对象，scope 限定选择器作用域，只在 container 内查找 .box 这类选择器，避免误伤页面其他同名元素；dependencies 类似 useEffect 的依赖数组。组件卸载时自动 revert 掉内部创建的所有 Tween/Timeline/ScrollTrigger/Draggable/SplitText 实例，尤其能规避 React 18 严格模式下 Effect 双调用导致的动画冲突和重复创建。

有个容易漏掉的细节：Hook 主体执行期间创建的动画会被自动追踪，但事件处理器，比如这里的 onClick，里面临时创建的动画不在自动追踪范围内，必须用 contextSafe() 包裹一层才会被纳入清理，否则组件卸载后这个动画的引用可能还残留，导致报错或内存泄漏。

App Router/RSC 场景记得给这个组件文件加上 "use client"。
-->

---

# gsap.context()：批量清理与响应式

```js
// 非 React 场景批量清理，useGSAP 的底层机制
let ctx = gsap.context(() => gsap.to(".box", { x: 100 }), scopeEl);
ctx.revert(); // 一次性清理该上下文内创建的所有动画

// matchMedia：响应式 + 无障碍
let mm = gsap.matchMedia();
mm.add({
  isDesktop: "(min-width: 800px)",
  reduceMotion: "(prefers-reduced-motion: reduce)",
}, (ctx) => {
  let { isDesktop, reduceMotion } = ctx.conditions;
  gsap.to(".box", { rotation: isDesktop ? 360 : 180, duration: reduceMotion ? 0 : 2 });
});
```

<!--
gsap.context 是 useGSAP 的底层机制，也能直接用在非 React 场景。把创建动画的逻辑包在 context 回调里，第二参数可以限定选择器作用域，调用 ctx.revert() 就能一次性清理该上下文内创建的所有 Tween、Timeline、ScrollTrigger。SPA 路由切换、条件渲染卸载组件，都该用这一套而不是手动挨个 kill。

gsap.matchMedia() 内部就是自建了一个 gsap.context，专门用来做响应式和无障碍动画。add() 第一个参数是一组媒体查询条件的别名，第二个参数是回调，拿到 context.conditions 判断当前匹配了哪些条件。关键行为：条件不再匹配时，自动 revert 掉该分支之前创建的所有动画和 ScrollTrigger，不需要手动清理。

这里示例里的 reduceMotion 对应 prefers-reduced-motion，是做无障碍动效的官方推荐写法——检测到用户系统开启了减少动画偏好，就把 duration 设成 0，直接跳到终态，不播放动画过程。响应式断点也是同理，isDesktop 为真就转 360 度，移动端只转 180 度。

这套体系配合 useGSAP 和 ScrollTrigger 的清理方法，共同解决 SPA/框架里"动画不清理=内存泄漏或叠加错乱"这个高频问题。
-->

---

# 性能专项

```js
// quickTo：跳过单位换算/相对值解析，专为高频更新场景优化
let xTo = gsap.quickTo("#el", "x", { duration: 0.4, ease: "power3" });
window.addEventListener("mousemove", (e) => xTo(e.pageX));
```

<v-clicks>

- **transform/opacity 优先**：不触发重排，避免动画 `top`/`left`/`margin`
- **`lazy` 默认 `true`**：属性写入延迟到下一帧合并，减少强制同步布局
- **`quickTo`/`quickSetter`**：鼠标跟随、拖拽实时反馈等高频场景性能远高于每帧 `gsap.to()`
- 配合 `gsap.utils.pipe` 先 `clamp`/`snap` 处理输入值，再喂给 `quickTo`

</v-clicks>

<!--
性能专项，官方入门页强调一句话：Transforms and opacity are also very performant because they don't affect layout，所以应该优先动画 x/y/scale/rotation/opacity 这些不触发重排的属性，而不是 top/left/margin 这类会导致浏览器重新计算布局的属性。

lazy 默认是 true，GSAP 会把属性的实际写入延迟到下一帧合并处理，减少无谓的强制同步布局，这是内部默认优化，一般不需要手动关心，但了解原理有助于理解一些时序上的细节行为。

quickTo 和 quickSetter 是专门为高频更新场景准备的，比如鼠标跟随、拖拽实时反馈，每一帧都要更新位置。普通 gsap.to() 每次调用都有单位换算、相对值解析、随机值解析等便利特性的开销，quickTo 跳过这些直接写值，性能远高于每帧都新建一个 tween。

一个进阶组合：gsap.utils.pipe 可以把 clamp、snap 等函数串成管道，先处理原始输入值做范围限制和吸附，再把结果喂给 quickTo 生成的补间函数，常用来做可视化面板里带约束的高性能拖拽交互。
-->

---

# 易错点与坑

<v-clicks>

- `from()`默认`immediateRender:true`：晚加载脚本可能先闪终态再跳回起始态
- 忘记`gsap.registerPlugin()`：v3 插件必须显式注册，否则静默失效
- 祖先`transform`/`will-change`破坏`pin`定位，用`pinReparent:true`规避
- 不要直接给`pin`住的元素做位移动画，应动画其内部子元素
- Flip 在框架中过早调用：需等真实渲染完成，且显式传`targets`
- `contextSafe()`遗漏：事件处理器内创建的动画不会被自动清理追踪
- 混淆`each`（固定间隔）与`amount`（总时长自动均分）
- 误以为 ScrollTrigger/SplitText 仍需付费会员（2025-04 起已全免费）

</v-clicks>

<!--
易错点汇总，挑几个最高频的坑。第一，from/fromTo 默认 immediateRender true，如果动画脚本加载较晚或者有 SSR 水合延迟，用户可能先看到最终态闪一下，再跳回起始态开始播放，首屏关键动画建议配合服务端或 CSS 预先设置好初始态。

第二，v3 起插件必须显式 registerPlugin，忘记调用会导致对应功能静默失效或报错找不到属性，这是新手最常踩的第一个坑。第三第四都是 pin 相关：祖先元素的 transform 或 will-change 会破坏 position:fixed 定位语义，导致 pin 错位，用 pinReparent:true 规避；另外不要直接给 pin 住的元素本身做位移动画，应该动画它内部的子元素。

第五，Flip 在 React/Vue 等框架里因为渲染是异步批处理的，过早调用 Flip.from 会拿到错误的最终态，需要等一帧真实渲染完成，并且要显式传 targets，因为框架可能销毁重建了全新的元素实例。第六，contextSafe 容易被遗漏，事件处理器里临时创建的动画默认不在 useGSAP 的自动清理范围内。

第七，stagger 的 each 和 amount 语义不同，元素数量变化会影响 amount 的实际间隔，但不影响 each，容易配置反。最后也是最需要更正的旧认知：不用再以为 ScrollTrigger、SplitText 这些插件还要付费或注册 Club GreenSock 会员，2025 年 4 月起全部免费，含商业项目使用。
-->

---

# 选型对比：vs Motion / Anime.js

| 维度 | GSAP | Motion（原 Framer Motion） | Anime.js v4 |
|---|---|---|---|
| 风格 | 命令式脚本 | React 声明式（layout prop） | 框架无关，模块化 |
| 强项 | 复杂 Timeline / ScrollTrigger / SVG | 布局自动补间、手势、退场 | 轻量（≈24.5KB）、现代 ESM |
| 底层 | 自研渲染循环 | 优先走 WAAPI 硬件加速 | 可选 WAAPI 引擎 |
| 定位 | 不绑定框架，插件生态最深 | React 生态原生融合 | 轻量全能替代候选 |

<v-clicks>

- 纯 React + 列表增删重排需求 → Motion 更省心
- 复杂 scrollytelling / SVG 路径形变 / 多框架项目 → GSAP 更合适
- 极致轻量、现代 ESM 按需加载 → 可评估 Anime.js v4

</v-clicks>

<!--
选型对比，现状要用最新认知。Framer Motion 已经更名为 Motion，从 React 专属扩展为同时支持 React、纯 JavaScript、Vue 三种文档入口的框架无关库，核心亮点是硬件加速的 ScrollTimeline 滚动动画、原生手势、layout prop 布局动画、AnimatePresence 退场动画，底层优先走 WAAPI 硬件加速通道。

GSAP 是命令式脚本风格，不绑定任何框架的渲染模型，长于手工精细编排的复杂时间线和插件生态深度，ScrollTrigger 的滚动控制粒度、MotionPath/MorphSVG 等 SVG 专项能力目前仍比 Motion 更专精。两者不是互斥关系，同一个技术栈评估里经常被放在一起比较。

Anime.js v4 同样框架无关，是 all-in-one animation engine，已经具备 Timeline、三种维度的 stagger、SVG 工具集、Draggable、Scroll Observer、Spring 物理、Scope 响应式动画，模块化按需导入，完整包约 24.5KB，体积上比 GSAP 更有优势，是轻量全能替代候选，但生态成熟度和插件专精度上还没有全面反超 GSAP。

选型建议：纯 React 项目需要列表增删重排这类布局自动补间，优先 Motion 更省心；需要复杂滚动叙事、SVG 路径形变，或者项目本身多框架甚至无框架，GSAP 更合适；追求极致轻量和现代 ESM 模块化，可以评估 Anime.js。
-->

---

# 资源

<v-clicks>

- 官方文档：[gsap.com/docs/v3](https://gsap.com/docs/v3/)
- 免费声明：[gsap.com/pricing](https://gsap.com/pricing/)
- Ease Visualizer：[gsap.com/docs/v3/Eases](https://gsap.com/docs/v3/Eases)
- ScrollTrigger：[gsap.com/docs/v3/Plugins/ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- React 集成：[gsap.com/resources/React](https://gsap.com/resources/React)
- GitHub：[github.com/greensock/GSAP](https://github.com/greensock/GSAP)
- 对比信源：[motion.dev](https://motion.dev/) / [animejs.com](https://animejs.com/)

</v-clicks>

<!--
资源汇总。官方文档首页是所有内容的入口，免费声明页明确写着 GSAP is now 100% free for all users, thanks to Webflow's support，遇到"某插件要付费"的说法可以直接拿这个链接反驳。

Ease Visualizer 是交互式曲线编辑器，调 ease 手感的时候强烈建议打开实际试，比死记参数直观得多。ScrollTrigger 文档页信息量最大，pin、snap、batch 这些进阶能力的完整参数都在里面。React 集成页专门讲 useGSAP 的最佳实践。

GitHub 仓库可以看版本发布记录和 issue，对比 Motion 官网和 Anime.js 官网能直接感受两个候选库最新的 API 设计和定位差异。这些链接建议收藏，后续深入某个插件时按需回来查。
-->

---
layout: intro
---

# 总结

GSAP = **框架无关的专业级 JS 动画引擎**

- 心智模型：Tween（补间）+ Timeline（时间线编排）
- 位置参数（`"<"`/`">"`/`"+=1"`/标签）是编排能力的核心
- ScrollTrigger 是滚动驱动动画的事实标准
- React 用 `useGSAP()`，非 React 用 `gsap.context()`，自动清理
- 2025 年起：**全插件 100% 免费**，含 ScrollTrigger/SplitText 等

<!--
总结一下。GSAP 是框架无关的专业级 JavaScript 动画引擎，核心心智模型就两个词：Tween 补间加 Timeline 时间线编排，几乎能为 JS 能触及的任何东西提供高性能、跨浏览器一致的动画能力。

实践要点：Timeline 的位置参数体系，尖括号起点终点、相对时间、标签定位，是它编排能力远超 CSS/WAAPI 的核心；ScrollTrigger 是滚动驱动动画的事实标准插件，pin、scrub、snap、batch 组合能做出各种滚动叙事效果。框架集成上，React 项目用 useGSAP 自动清理，非 React 场景用 gsap.context 手动包一层，都能规避动画不清理导致的内存泄漏和状态错乱。

最后务必更新的现状：2024 年 10 月被 Webflow 收购，2025 年 4 月起全部插件 100% 免费，包括曾经的 Club GreenSock 付费插件，含商业项目使用，不用再有授权成本的顾虑。谢谢大家。
-->
