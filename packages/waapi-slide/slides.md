---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Web Animations API
info: |
  Presentation Web Animations API（WAAPI）—— 浏览器原生 JavaScript 动画编程接口。

  Learn more at [https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center">
  <carbon:play-filled-alt class="text-8xl" />
</div>

<br/>

## Web Animations API —— 浏览器原生动画引擎

`element.animate()` 一行创建可编程动画，与 CSS 动画同源

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Web Animations API，简称 WAAPI。

一句话定位：它是浏览器原生的 JavaScript 动画编程接口——element.animate(keyframes, options) 一行代码创建动画，立刻拿到一个可编程控制的 Animation 对象。

全场最关键的一个认知：CSS 的 @keyframes 加 animation 属性写的动画，浏览器底层同样是这套引擎驱动的。WAAPI 不是和 CSS 动画平行的另一套系统，而是它的原生实现层，可以理解成 CSS 动画的超集，两者共享同一份底层引擎。

今天顺序：定位 → 心智模型 → animate() 上手 → 关键帧格式 → 动画选项和 fill 坑 → Animation 播放控制 → 变速跳转 → Promise 生命周期 → commitStyles 收尾范式 → KeyframeEffect 复用 → Timeline 家族和 scroll-driven → CSS 互操作 → 性能 → 高频易错点 → 和 GSAP/CSS 的选型对比 → 资源与总结。
-->

---

# WAAPI 是什么：原生 JS 动画编程接口

**一句话**：`element.animate(keyframes, options)` 一行代码创建动画，拿到可编程控制的 `Animation` 对象。

<v-clicks>

- **关键认知**：CSS `@keyframes`/`animation` 底层同样由这套引擎驱动——WAAPI 不是与 CSS 平行的另一套系统，而是其原生实现层
- **心智定位**：介于「声明式 CSS 动画」与「手写 `requestAnimationFrame`」之间
- 比 CSS 动画更可编程：暴露 JS 对象、Promise、运行时改写关键帧/timing 的能力
- 比 rAF 手写更省心：浏览器负责插值计算，能跑在合成器线程
- 核心部分是 **Baseline 广泛可用**特性（自 2020 年起），无需 polyfill，可放心生产使用

</v-clicks>

<!--
先给 WAAPI 一个准确定位。

一句话：element.animate(keyframes, options)，一行代码创建动画，拿到的是一个可编程控制的 Animation 对象。

最关键的认知贯穿今天全场：CSS 写的动画，浏览器底层同样是这套引擎在跑，WAAPI 不是平行于 CSS 的另一套系统，而是它的原生实现层。

心智定位上，它介于声明式 CSS 动画和手写 requestAnimationFrame 之间：比 CSS 更可编程，暴露 JS 对象、Promise、运行时改写能力；比 rAF 更省心，浏览器负责插值、能上合成器线程，性能通常和 CSS 动画一致。

现状：核心 API 自 2020 年起就是 Baseline 广泛可用，四大引擎口径一致，可以放心用在生产环境，不需要 polyfill。
-->

---

# 心智模型：DVD 播放器比喻

```text
Timeline（时间轴，document.timeline）
   → Animation（播放器：play/pause/reverse/currentTime/playbackRate）
       → AnimationEffect / KeyframeEffect（光盘：关键帧 + duration + timing）
```

<v-clicks>

- **Timeline**：提供 `currentTime`/`duration`（只读），默认子类是 `DocumentTimeline`
- **Animation**：相当于播放器，负责 `play/pause/reverse/seek`，本身不含关键帧内容
- **AnimationEffect**（现唯一具体子类 `KeyframeEffect`）：相当于光盘，只是数据，可被多个 `Animation` 复用
- Effect timing 三阶段：`delay`（播放前延迟）→ `active`（真正播放）→ `endDelay`（结束后延迟）

</v-clicks>

<!--
理解 WAAPI 全靠这一个比喻：DVD 播放器。

三层对象关系：最外层 Timeline 时间轴，默认就是 document.timeline，从页面打开持续到窗口关闭；中间层 Animation 相当于播放器本身，负责播放控制——play、pause、reverse、调速、跳转，但它自己不含关键帧数据；最内层 AnimationEffect，目前唯一实现是 KeyframeEffect，相当于光盘，只是数据——关键帧集合加 duration 加 timing，可以被多个 Animation 复用，就像一张光盘能在多个播放器里放。

再加一层时间细节：effect 的 timing 分三阶段，delay 是播放前的等待，active 是真正播放的活跃区间，endDelay 是播放完之后的延迟——finished 这个 Promise 要等 endDelay 也结束才会 resolve，这个细节后面讲 Promise 时会用到。
-->

---

# Element.animate()：一行创建动画 ★必考

```js
const anim = document.querySelector(".box").animate(
  [
    { transform: "translateX(0)", opacity: 1 },
    { transform: "translateX(300px)", opacity: 0 },
  ],
  { duration: 2000, easing: "ease-in-out", fill: "forwards" }, // 毫秒
);
anim.pause(); // 返回值是 Animation，立刻可控
```

<div v-click>

- `options` 可直接传数字，等价只设置 `duration`：`el.animate(kf, 2000)`
- 只写一帧时浏览器自动补"当前计算样式"作为隐式起始帧
- 等价手工三步：`new KeyframeEffect()` → `new Animation()` → `.play()`（语法糖关系）

</div>

<!--
上手第一步，Element.animate()。

调用签名是 animate(keyframes, options)：关键帧数组两帧，从透明不偏移到偏移 300px 半透明；options 里 duration 2000 毫秒、缓动 ease-in-out、fill forwards 让它停在终态。返回值立刻是一个 Animation 对象，可以马上 pause。

三个补充点：options 可以直接传一个数字，等价于只设置 duration；关键帧数组如果只写一帧，浏览器会自动拿当前计算样式补一个隐式起始帧，这样能省略"从哪开始"；最后，animate() 本质是语法糖，等价的手工三步是先 new KeyframeEffect，再 new Animation 把 effect 挂到 timeline 上，最后调 play，理解这三步对后面 KeyframeEffect 复用那页很关键。
-->

---

# 关键帧格式：数组形式 ★必考

```js
el.animate(
  [
    { opacity: 1, easing: "ease-out" }, // from，帧级 easing
    { opacity: 0.1, offset: 0.7, easing: "ease-in" }, // offset 0~1
    { opacity: 0 }, // to
  ],
  2000,
);
```

<v-clicks>

- 至少 2 帧；不写 `offset` 时相邻帧间**均匀分布**（3 帧则为 0 / 0.5 / 1）
- `offset` 必须单调递增，取值 0~1，对应 CSS `@keyframes` 里的百分比
- 帧级 `easing` 只作用于"这一帧到下一帧"，与整体 `options.easing` 含义不同
- `composite` 也可以逐帧指定，覆盖效果级的默认值

</v-clicks>

<!--
关键帧有两种写法，先看数组形式，这也是规范型写法，getKeyframes() 返回的就是这种格式。

每个元素是一帧，至少要 2 帧。不写 offset 时，浏览器在相邻帧之间均匀分布，比如这里 3 帧不写 offset 就是 0、0.5、1；写了的话必须单调递增，取值在 0 到 1 之间，对应 CSS 里写的百分比。

注意帧级 easing 和整体 easing 是两回事：写在某一帧上的 easing，只管"这一帧到下一帧"这一段的过渡，作用域很局部；而 options 里的 easing 才是整体默认缓动。composite 合成方式也能逐帧指定，覆盖效果级别的默认设置。
-->

---

# 关键帧格式：object 形式（隐式关键帧）

```js
el.animate(
  {
    opacity: [0, 0.9, 1],
    backgroundColor: ["red", "yellow", "green"],
    offset: [0, 0.8], // 隐式补 1 → [0, 0.8, 1]
    easing: ["ease-in", "ease-out"], // 不够时循环复用
  },
  2000,
);
```

<v-clicks>

- **隐式关键帧**：不同属性的数组长度可以不一致，各属性独立均匀分布 offset
- CSS 属性名要转驼峰：`background-color` → `backgroundColor`
- 保留字要改名：`float`/`offset` → `cssFloat`/`cssOffset`
- 两种格式无能力差异，纯粹书写习惯：数组贴近 CSS 逐帧直觉，object 写简单补间更紧凑

</v-clicks>

<!--
第二种是 object 形式：属性名对应一个值数组。

这里 opacity 给了 3 个值，backgroundColor 给了 3 个颜色，offset 只给了 2 个，会隐式补 1，变成 0、0.8、1。关键概念是隐式关键帧：不同属性的数组长度可以不一致，各自独立均匀分布自己的 offset，互不影响——比如 opacity 想要更多过渡点，backgroundColor 只想要首尾两色，完全可以并存。

书写上要注意两点：CSS 属性名要转成驼峰，background-color 变成 backgroundColor；有两个保留字要改名，float 写成 cssFloat，offset 写成 cssOffset，因为 offset 这个词本身就是关键帧的属性名，会冲突。

两种格式能力上完全等价，选哪个纯粹看书写习惯。
-->

---

# 动画选项（EffectTiming）★必考

```js
{
  duration: 3000,       // 毫秒！规范默认 "auto"（不设时长动画不播）
  easing: "linear",     // 默认 linear（CSS animation 默认是 ease，不同！）
  iterations: 1,        // 默认 1，Infinity 表示无限循环
  direction: "normal",  // normal/reverse/alternate/alternate-reverse
  fill: "none",         // none/forwards/backwards/both（下一页详解）
  delay: 0,             // 开始前延迟，毫秒
  endDelay: 0,          // 结束后延迟，finished Promise 要等它结束
  composite: "replace", // replace/add/accumulate
}
```

<div v-click class="mt-2 text-sm">

⚠️ **单位是毫秒**，CSS 是秒，两者不通用，是最常见的笔误来源。

</div>

<!--
动画选项，规范名叫 EffectTiming，八个字段一次看全。

duration 单位是毫秒，规范默认值是字符串 auto，意味着不设置时长动画根本不播；easing 默认是 linear，注意 CSS animation 的默认是 ease，两边不一样，从 CSS 迁移过来不显式设置的话，手感会不同；iterations 默认 1，无限循环用 Infinity；direction 四个值；fill 默认 none，下一页专门讲，这是全场最高频的坑；delay 和 endDelay 都是毫秒，endDelay 结束后 finished 这个 Promise 才会 resolve；composite 三选一。

最容易犯的错：duration 单位是毫秒，CSS 是秒，从 CSS 动画迁移过来的人常把 2 秒直接写成 duration: 2，正确应该是 2000。
-->

---

# `fill`：全场最高频坑 ⚠️

**默认值是 `"none"`**——动画一结束，元素瞬间跳回"无动画时的原始样式"，视觉上像"闪一下又弹回去"。

| 取值 | 行为 |
|---|---|
| `none`（默认） | 动画前后都不应用样式 |
| `forwards` | 结束后保持终态 |
| `backwards` | 开始前应用首帧 |
| `both` | 两者都要 |

<div v-click class="mt-4">

很多初学者以为动画会"停在最后一帧"，实际必须显式声明 `fill: "forwards"`（或 `"both"`）才会保持终态。

</div>

<!--
单独拎出来讲 fill，因为它是 WAAPI 里出现频率最高的坑，没有之一。

默认值是 none，意味着动画一结束，元素立刻跳回"没有动画时"的原始样式——视觉上就是"闪一下又弹回去"。很多初学者第一次写完动画，发现"动画播完东西又消失了/弹回原位了"，十有八九就是没设 fill。

四个取值：none 前后都不应用样式；forwards 结束后保持终态；backwards 开始前提前应用首帧样式，配合 delay 用得较多；both 是两者都要。

记住一句话：想要动画"停在最后一帧"，必须显式写 fill: forwards 或 both，浏览器不会替你默认这么做。
-->

---

# Animation 对象：播放控制 ★必考

```js
anim.play();      // 播放/继续
anim.pause();     // 暂停
anim.reverse();   // 反向播放（playbackRate 取负后 play）
anim.finish();    // 跳到结束态，触发 finish 事件
anim.cancel();    // 取消（回到无动画态），触发 cancel 事件

anim.playState;   // idle | running | paused | finished（另有 pending 过渡态）
anim.id = "myAnim"; // 自定义标识，配合 getAnimations() 按 id 筛选
```

<div v-click class="mt-2 text-sm">

⚠️ `reverse()` 不是"从当前进度往回倒"：已 `finished` 或未播放时调用，会从终点完整倒放到起点。

</div>

<!--
Animation 对象本身的播放控制方法，回到 DVD 播放器的比喻，这些就是播放器面板上的按钮。

play、pause 很直观。reverse 等价于把 playbackRate 取负之后 play，注意后面提醒的坑：它不是"从当前进度往回倒"这种直觉行为，如果动画已经播完或者还没播放就调 reverse，它会从终点重新完整倒放到起点，而不是从当前进度反向。

finish 直接跳到结束态并触发 finish 事件；cancel 是取消，回到无动画状态并触发 cancel 事件，这两个的区别下一页 Promise 部分还会再强调。playState 是只读状态查询，四个值之外规范还有一个 pending 过渡态。id 是自定义标识，方便之后用 getAnimations() 抓出来再按 id 筛选。
-->

---

# 变速与跳转（Scrubbing）

```js
anim.playbackRate = 2;          // 2 倍速；负数 = 倒放
anim.updatePlaybackRate(0.5);   // 比直接赋值更平滑地过渡到新速率
anim.currentTime = 1500;        // 跳到第 1500ms（单位 ms！可用于拖拽进度条）
```

<v-clicks>

- `currentTime` 可读可写，赋值即"跳转/scrubbing"——常见坑：容易和"百分比进度"混淆
- 需要按百分比跳转时，先用 `getComputedTiming().activeDuration` 换算出实际毫秒数
- `updatePlaybackRate()` vs 直接赋值 `playbackRate`：前者过渡更平滑，避免瞬时跳变
- 典型场景：拖拽进度条驱动 `currentTime`、悬停暂停、滚轮控速

</v-clicks>

<!--
这一页是 WAAPI 相比 CSS 动画最大的加分项：能被"当作数据"一样操控。

playbackRate 直接赋值控速，2 就是两倍速，负数就是倒放；updatePlaybackRate 是升级版，赋值会有个平滑过渡到新速率的过程，避免瞬时跳变，适合"手柄式"渐进调速的场景。currentTime 可读可写，直接赋值就是跳转，单位是毫秒，这就是所谓的 scrubbing，很像拖拽视频进度条。

一个常见坑：currentTime 的单位是毫秒，不是百分比，如果要按百分比跳转，得先用 effect.getComputedTiming().activeDuration 拿到实际总时长再换算。典型应用场景：拖拽进度条驱动 currentTime、鼠标悬停暂停、滚轮控制播放速度，这些交互驱动的动画正是 WAAPI 相比纯 CSS 动画的核心优势场景。
-->

---

# `finished` / `ready`：Promise 化生命周期 ★必考

```js
anim.ready.then(() => {
  // 动画真正开始播放前 resolve（等合成器准备好）
});

anim.finished
  .then(() => {
    anim.commitStyles(); // 自然播完 / 被 finish() 时 resolve
  })
  .catch(() => {}); // 被 cancel() 时 reject

anim.onfinish = () => {}; // 事件等价写法
```

<div v-click class="mt-2 text-sm">

⚠️ 别在动画一创建就同步读 `playState`——应等 `ready` resolve 后再读，避免 `pending` 过渡态干扰判断。

</div>

<!--
WAAPI 天然支持 Promise，这是它比 CSS 动画的 animationend 事件更好用的地方——可以 await，可以链式。

ready 在动画真正开始播放前 resolve，也就是等浏览器合成器排布好、真正可以播放的那一刻；finished 在动画自然播完，或者被 finish() 提前结束时 resolve，常见写法是在这里调 commitStyles 把最终态写死。注意 finished 在动画被 cancel() 时会 reject，用 catch 接住，别漏掉。

也有等价的事件写法 onfinish、oncancel，效果一样，看代码风格选。

一个容易踩的坑：动画刚创建出来就同步读 playState，可能读到 pending 这个过渡态，干扰判断——应该等 ready 这个 Promise resolve 之后再读，才是真正开始播放后的状态。
-->

---

# `commitStyles()` + `persist()`：保留终态范式 ★必考

```js
anim.finished.then(() => {
  anim.commitStyles(); // 把当前计算样式写死成内联 style
  anim.cancel();       // 再清掉动画本身，释放合成层资源
});

anim.persist(); // 阻止 finished 后被自动回收（replaceState 钉在 active）
```

<v-clicks>

- 默认动画 `finished` 后 `replaceState` 变 `"removed"`，浏览器会自动清理释放资源
- `commitStyles()` 有前提：目标元素须在渲染树中（`display:none`/未挂载会报错）
- 推荐范式：`commitStyles()` 保留视觉效果 → `cancel()` 清掉动画，避免持续占用合成层
- 直接用 `fill:"forwards"` 也能保终态，但会让动画对象与合成层一直驻留内存

</v-clicks>

<!--
这一页解决"fill 默认不保留终态"这个坑的推荐姿势，也是进阶实践里很重要的一个范式。

默认情况下，动画 finished 之后，它的 replaceState 会变成 removed，浏览器自动清理释放资源——这本身是好事，省资源。但如果你需要保留视觉终态，两个工具配合用：commitStyles 把当前计算出来的样式写死成元素的内联 style，视觉上等价于 fill forwards 的效果；紧接着调 cancel 把动画对象本身清掉，这样既保留了画面，又不会让动画和它占用的合成层资源一直驻留内存。

commitStyles 有个前提容易忽略：目标元素必须在渲染树里、有可计算样式上下文，如果元素 display none 或者根本没挂载到文档树，调用会报错。

persist 是配套的另一个方法：如果你还需要在动画完成之后继续读它的 effect、currentTime 这些信息，就要显式调 persist，把 replaceState 钉在 active，防止被自动回收。
-->

---

# KeyframeEffect：可复用的动画效果

```js
// 不指定 target（传 null），之后复用给多个元素
const effect = new KeyframeEffect(null, [{ opacity: 0 }, { opacity: 1 }], {
  duration: 1000,
  easing: "ease-in-out",
});

const anim1 = new Animation(effect, document.timeline);
anim1.effect.target = document.querySelector("#a");
anim1.play();
```

<v-clicks>

- 实例属性：`target`、`pseudoElement`（可作用于 `::before`/`::after` 等伪元素）、`iterationComposite`
- `getKeyframes()` / `setKeyframes()`：运行时读写关键帧（如错误态 → 成功态热替换）
- `getTiming()` vs `getComputedTiming()`：原始设置值 vs 计算后的值（如 `activeDuration`）
- 运行时改 timing：`anim.effect.updateTiming({ iterations: 4 })`

</v-clicks>

<!--
回到 DVD 光盘的比喻，KeyframeEffect 就是那张盘，可以脱离播放器单独存在、被复用。

这里构造时故意把 target 传 null，先不绑定元素，之后拿它去建两个不同的 Animation，各自把 effect.target 指向不同元素再播放——一份关键帧定义，多处复用，是构建动画库时避免重复定义的常见模式。

实例属性除了 target，还有 pseudoElement，可以作用在 before、after 这类伪元素上；iterationComposite 控制"同一个动画的多次迭代之间"怎么合成，下一部分易错点会展开这个概念。方法上，getKeyframes 和 setKeyframes 是运行时读写关键帧，典型场景是错误态到成功态的关键帧热替换；getTiming 拿到的是原始设置值，getComputedTiming 拿到的是浏览器计算后的值，比如 activeDuration 这种衍生值；updateTiming 可以运行时改 timing，比如游戏里"临时多播几轮"就调 iterations。
-->

---

# Timeline 家族

`AnimationTimeline` 是基类：只读属性 `currentTime`（毫秒/`null`）、`duration`。

| 子类 | 驱动方式 | Baseline 现状（2026） |
|---|---|---|
| `DocumentTimeline` | 页面打开时长（默认） | 自 2020-07 |
| `ScrollTimeline` | 滚动容器 0~100% 进度 | 仍非 Baseline |
| `ViewTimeline` | 元素可见性 0~100% | 仍非 Baseline |

<div v-click class="mt-4 text-sm">

`document.timeline` 是省略时的默认值；`ScrollTimeline`/`ViewTimeline` 没有 `duration` 概念，进度完全由滚动位置/可见性决定。

</div>

<!--
时间轴家族。AnimationTimeline 是基类，只暴露两个只读属性，currentTime 和 duration。

三个具体子类：DocumentTimeline 是默认时间轴，currentTime 就是页面已经打开的毫秒数，自 2020 年 7 月就是 Baseline；ScrollTimeline 滚动驱动，进度由滚动容器的 0% 到 100% 决定；ViewTimeline 可见性驱动，进度由元素从"刚进入视口"到"完全离开"决定。这两个截至 2026 年 7 月，直接查 MDN 活页仍标注非 Baseline，下一页会展开浏览器现状细节。

有一点很关键：new Animation(effect, document.timeline) 里省略 timeline 参数时，默认值就是 document.timeline；而滚动/可见性驱动的两个时间轴没有 duration 这个概念，因为它们的"进度"完全由外部滚动位置或可见性决定，不是由时间流逝决定。
-->

---

# 滚动驱动：ScrollTimeline / ViewTimeline

```js
// 滚动位置驱动整个动画进度
const st = new ScrollTimeline({ source: document.documentElement, axis: "block" });
box.animate({ rotate: ["0deg", "720deg"] }, { timeline: st });

// 元素可见性驱动（0%=进入 → 100%=完全离开）
const vt = new ViewTimeline({ subject: el, axis: "block" });
el.animate({ opacity: [0, 1] }, { fill: "both", timeline: vt });
```

<v-clicks>

- `ScrollTimeline.source`：哪个滚动容器驱动进度；`axis`：`block`(纵向) / `inline`(横向)
- `ViewTimeline.subject`：被追踪可见性的元素；`inset` 可收紧/放宽"可见"判定区间
- 二者都没有 `duration` 概念，进度完全由滚动位置/可见性的 0%~100% 决定
- 生产建议：`@supports not (animation-timeline: scroll())` 特性检测降级 + `prefers-reduced-motion` 兜底

</v-clicks>

<!--
用 timeline 选项替代 duration，就能把一个普通动画接到滚动或可见性上。

ScrollTimeline 构造时传 source，指定哪个滚动容器驱动进度，axis 选纵向 block 还是横向 inline；animate 的 options 里用 timeline 字段传进去，替代原来的 duration/时间驱动。ViewTimeline 构造时传 subject，就是被追踪可见性的元素，从刚进入视口的 0% 到完全离开的 100% 映射成动画进度，inset 参数可以收紧或放宽这个"可见"的判定区间。

生产环境用这两个要留一个心眼：截至 2026 年 7 月，Chrome/Edge 可以放心用，但 Firefox 历史上需要在 Nightly 开 flag，且要求 animation-duration 非零才生效，Safari 原生还不支持，需要 polyfill 兜底。所以核心交互建议做 @supports not 特性检测降级，同时别忘了配 prefers-reduced-motion 的无障碍开关。
-->

---

# CSS 等价写法：`animation-timeline`

```css
.scroller { scroll-timeline-name: --rotate; scroll-timeline-axis: block; }
.item {
  animation: spin 1ms linear;
  animation-timeline: --rotate; /* 必须写在 animation 简写之后 */
}
.item2 { animation: spin 1ms linear; animation-timeline: scroll(nearest inline); }
```

<div v-click>

⚠️ **坑**：`animation-timeline` 是 `animation` 简写的 **reset-only** 值——写了 `animation: xxx` 简写会把它重置为 `auto`，必须声明在简写**之后**才生效。

</div>

<div v-click class="mt-2 text-sm">

`duration` 常填 `1ms`（Firefox 历史上要求非零时长才生效）；必配 `@media (prefers-reduced-motion: reduce) { animation-timeline: none; }` 兜底。

</div>

<!--
不写 JS，纯 CSS 也能用滚动/视图时间轴，这是给不需要精细 JS 控制场景的声明式写法。

具名写法：给滚动容器起个时间轴名字 --rotate，元素用 animation-timeline 引用它；匿名写法更省事，直接写 animation-timeline: scroll(nearest inline) 或 view()，不用单独命名。

这里有 CSS 端最隐蔽的坑：animation-timeline 是 animation 简写属性的 reset-only 值，意思是只要你写了 animation: xxx 这个简写，animation-timeline 就会被重置回 auto——所以必须把 animation-timeline 声明放在 animation 简写之后，顺序反了就完全不生效，调试起来很容易摸不着头脑。

两个实践细节：duration 随手填 1ms 就行，这是因为历史上 Firefox 要求非零时长才触发，同时也给不支持的浏览器一个"看起来没动画"的优雅降级；另外必须配 prefers-reduced-motion 媒体查询做无障碍降级，这是滚动驱动动画的标配。
-->

---

# 组合与互操作：`getAnimations()`

```js
// 拿到文档/元素上当前生效的所有 Animation
// 含 CSS animation、CSS transition、纯 WAAPI 动画
document.getAnimations().forEach((a) => (a.playbackRate *= 0.5)); // 全局减速一半
element.getAnimations(); // 只看这个元素（默认含子树后代）
```

<v-clicks>

- 关键入口：哪怕动画是纯 CSS `@keyframes` 写的，也能被抓出来当 `Animation` 对象操控
- 典型用法：全局"暂停所有动画"调试面板；`Promise.all(getAnimations().map(a => a.finished))`
- CSS 动画对象可以调速/暂停/监听完成，但 `setKeyframes()` 对其通常**不生效**
- 纯 JS `animate()` 创建的动画不出现在 DevTools「CSS animation」面板，但会出现在 `getAnimations()` 结果中

</v-clicks>

<!--
getAnimations 是 WAAPI 里"反向操控一切动画"的入口，也是它和 CSS 动画不是竞争关系、而是同一引擎两种外壳这个论点的最有力证据。

不管动画是用 CSS 的 @keyframes 加 animation 属性写的，还是纯 JS 用 animate() 创建的，document.getAnimations() 或者 element.getAnimations() 都能把它们统一抓成 Animation 对象，然后调速、暂停、监听 finished，一视同仁。典型用法：写一个全局调试面板，一键暂停页面所有动画；或者页面切换时，用 Promise.all 等所有出场动画的 finished 都 resolve 了再卸载 DOM。

但要注意边界：CSS 来源的动画对象，关键帧的定义权还在 CSS 的 @keyframes 里，调用 setKeyframes() 对它通常不生效，能改的是播放层面的东西，不是内容层面。反过来，纯 JS 创建的动画不会出现在 DevTools 的 CSS animation 分类面板里，但一样能被 getAnimations() 查到。element.getAnimations() 默认包含子树后代的动画，如果只想看这个元素自己，需要额外过滤。
-->

---

# 性能：合成器线程

<v-clicks>

- WAAPI 与 CSS 动画**同源同性能**：只动 `transform`/`opacity` 时能跑在**合成器线程**，不占主线程
- 对比 rAF 手写：主线程 JS 逐帧计算，更容易失手写成布局属性（如 `top`/`width`）触发重排
- Scroll-driven animations 天然不产生主线程 `scroll` 监听/`IntersectionObserver` 开销，是相对 JS 手写滚动动画的核心性能优势
- 播放期间元素行为类似隐式声明 `will-change`，可能触发新的层叠上下文（stacking context）
- `fill:"forwards"` / `persist()` 会让动画对象与合成层持续驻留内存，需要 `commitStyles()+cancel()` 收尾

</v-clicks>

<!--
性能这一页把前面几个知识点串起来。

WAAPI 和 CSS 动画同源，只要动的是 transform 和 opacity 这类可以合成的属性，就能跑在合成器线程上，不占用主线程，这是它俩共同的性能优势，也是为什么 WAAPI 不会比 CSS 动画慢。对比手写 requestAnimationFrame：那是主线程 JS 每帧计算，而且更容易一不小心改了 top、width 这类布局属性，触发重排，性能反而更差。

Scroll-driven animations 有个专属的性能优势：它天然不需要主线程监听 scroll 事件或者用 IntersectionObserver，这是它相对 JS 手写滚动动画的核心卖点。另外一个容易被忽略的细节：动画播放期间，元素的行为有点像隐式声明了 will-change，可能会触发新的层叠上下文。

最后回扣一下前面 commitStyles 那页：如果只图省事一直用 fill forwards 让终态保留，动画对象和它占的合成层会一直驻留内存，规范的做法还是 commitStyles 加 cancel 收尾。
-->

---

# 易错点合集（一）

<v-clicks>

- **`iterations` 无限循环用 `Infinity`**（JS 值），CSS 的 `infinite` 是字符串关键字，两边语法不通用
- **`composite` ≠ `iterationComposite`**：前者管"不同动画效果之间"如何合成，后者管"同一动画多次迭代之间"如何合成
- **object 关键帧 `offset` 少写会补 1**，但乱填不递增会直接报错/被规范化，不是静默忽略
- **多个动画同时作用一个属性会按 `composite` 叠加**（如三个 transform 动画相加），不是简单覆盖

</v-clicks>

<!--
进入高频易错点合集，这一组是关于"数值/合成"维度的坑，之前部分内容点到但没展开。

第一条，iterations 的无限循环必须用 JS 的 Infinity 这个值，而不是字符串 "infinite"——CSS animation-iteration-count 的 infinite 才是字符串关键字，两边语法不通用，写错了会直接报错或不生效。

第二条也是最容易混淆的概念：composite 和 iterationComposite 维度完全不同。composite 管的是"不同动画效果之间"怎么合成，取值 replace、add、accumulate；iterationComposite 管的是"同一个动画自己的多次迭代之间"怎么合成，取值只有 replace 和 accumulate 两种，二者互不替代。

第三条，object 格式关键帧的 offset 数组允许比属性值数组少写一个，隐式补 1，但如果你乱填一个不递增的 offset，浏览器不会当没看见，而是直接报错或者做规范化处理。第四条呼应性能那页，多个动画同时作用在同一个属性上时，会按 composite 规则真正做数值合成，比如三个 transform 动画相加，而不是后面的简单覆盖前面的。
-->

---

# 易错点合集（二）

<v-clicks>

- **`fill:"auto"` 计算结果等价于 `"none"`**：`getTiming().fill` 可能显示 `auto`，`getComputedTiming().fill` 才是实际生效值
- **`reverse()` 不是"从当前进度倒放"**：已播完/未播放时调用，会从终点完整倒放到起点
- **`getAnimations()` 默认含子树**：局部性能排查优先用 `Element.getAnimations()` 而非 `Document.getAnimations()`
- **Scroll-driven 2026 仍非全浏览器 Baseline**（Safari 无原生支持），核心交互必须做特性检测，不能假设全量可用

</v-clicks>

<!--
第二组易错点，偏"进阶认知偏差"这一类。

第一条比较隐蔽：EffectTiming 规范层面 fill 的默认值其实是字符串 auto，所以 effect.getTiming().fill 可能显示出 auto；但 auto 对 KeyframeEffect 的计算结果等价于 none，真正生效的值要看 getComputedTiming().fill，这一层"设置值"和"计算值"的区别很容易让人误判。

第二条前面播放控制那页提过，这里再强调一次作为收尾：reverse() 不是"从当前播放进度往回倒"，动画已经播完或者根本没播放时调用它，会从终点完整倒放回起点。

第三条，getAnimations() 默认会包含子树里所有后代元素的动画，如果只是想做局部的性能隔离或者调试，用 element.getAnimations() 比 document.getAnimations() 更精确、开销更小。第四条是今天反复强调的现状：scroll-driven animations 2026 年仍不是全浏览器 Baseline，Safari 没有原生支持，只要是核心交互，就必须做特性检测加静态兜底，不能像核心 WAAPI 那样默认全量可用。
-->

---

# 选型对比：CSS 动画 / WAAPI / GSAP

<div class="text-sm">

| 维度 | CSS 动画 | WAAPI | GSAP |
|---|---|---|---|
| 播放控制 | 弱：改 class 间接控制 | 强：原生 `play/pause/reverse` | 最强：`timeline`/`stagger` |
| 完成通知 | `animationend` 事件 | `finished` Promise（可 `await`） | 内置 Promise/callback |
| 性能 | 合成线程 | 与 CSS 同源同性能 | 接近原生（常走 WAAPI/CSS） |
| 复杂编排 | 弱 | 一般，需自拼多个 `Animation` | 强项：`ScrollTrigger` 生态 |
| 依赖/场景 | 无，简单循环最省事 | 无，交互驱动播放控制 | 需引第三方库，专业编排 |

</div>

<div v-click class="mt-4 text-sm">

**选型结论**：纯展示不需要 JS 干预 → CSS；需要播放控制/进度条 scrubbing 又不想引库 → **WAAPI**；专业时间轴编排、大量 stagger → GSAP。

</div>

<!--
最后做个选型对比，横向摆开 CSS 动画、WAAPI、GSAP 三个选项。

播放控制上 CSS 最弱，只能靠切 class 间接控制；WAAPI 原生就有 play/pause/reverse 这些方法；GSAP 最强，有完整的 timeline、stagger、label 编排能力。完成通知，CSS 靠 animationend 事件，WAAPI 是 Promise 可以 await，GSAP 内置 Promise 或 callback。性能上 WAAPI 和 CSS 同源同性能，GSAP 底层通常也走 WAAPI 或 CSS，接近原生。依赖上只有 GSAP 需要引入第三方库，有体积成本。复杂编排是 GSAP 最大的护城河，WAAPI 只能自己拼多个 Animation 对象，算是够用不豪华。

选型结论一句话带过：纯展示不需要 JS 干预，CSS 最省事；需要 JS 层面播放控制又不想引第三方库，WAAPI 是最佳选择，尤其是悬停暂停、拖拽跳转这类交互驱动场景；如果是专业级的时间轴编排，比如大量元素 stagger、复杂依赖时序，或者需要 ScrollTrigger 这样成熟插件生态，还是 GSAP 更稳妥。
-->

---
layout: intro
---

# 总结与延伸阅读

WAAPI = **浏览器原生的可编程动画引擎**，与 CSS 动画同源

- `element.animate(keyframes, options)` 一行创建，返回可控的 `Animation` 对象
- `fill`（重点坑）/`easing`/`duration` 默认值都和 CSS 不同，迁移时务必留意
- `finished`/`ready` 是 Promise；`commitStyles()` + `cancel()` 是保留终态又释放资源的推荐范式
- Scroll-driven（`ScrollTimeline`/`ViewTimeline`）2026 现状：Chrome/Edge 领先，Safari 需 polyfill

<div class="mt-6 text-sm opacity-80">

延伸阅读：<a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API" target="_blank">MDN · Web Animations API</a> · <a href="https://css-tricks.com/css-animations-vs-web-animations-api/" target="_blank">CSS-Tricks · CSS Animations vs WAAPI</a>

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
最后总结一下今天的内容。

WAAPI 是浏览器原生的可编程动画引擎，和 CSS 动画同源，不是竞争关系。核心用法：element.animate(keyframes, options) 一行创建，拿到的 Animation 对象可以播放控制、变速、跳转。几个默认值的坑今天反复强调：fill 默认 none 不保留终态，是全场最高频坑；easing 默认 linear，duration 单位是毫秒，都和 CSS 不一样，迁移时务必留意。

生命周期上，finished 和 ready 是 Promise，配合 commitStyles 加 cancel 是保留终态又释放合成层资源的推荐范式。滚动驱动动画 2026 年现状是 Chrome、Edge 领先，Firefox 历史上要开 flag，Safari 需要 polyfill，核心交互一定要做特性检测。

延伸阅读放了 MDN 官方文档和 CSS-Tricks 的对比文章，感兴趣可以再深入看看。谢谢大家。
-->
