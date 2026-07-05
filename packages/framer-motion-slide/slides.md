---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Motion (Framer Motion)
info: |
  Presentation Motion（原 Framer Motion）—— React / 独立 JS / Vue 的生产级动画库。

  Learn more at [https://motion.dev](https://motion.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🪄</span>
</div>

<br/>

## Motion 12.x —— 原 Framer Motion

React 声明式动画库，2024 年更名 Motion

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://motion.dev" target="_blank" class="slidev-icon-btn">
    <carbon:link />
  </a>
</div>

<!--
今天聊 Motion，很多人更熟悉它的老名字 Framer Motion。

版本基线：npm 上 motion 包和 framer-motion 包目前版本号都是 12.42.2，自 12.x 起完全同步，是同一套源码双包名并行发布的过渡期策略。真正的血统包是 framer-motion，2019 年就开始发布；motion 这个包名早在 2013 年就存在过，是个完全无关的运动侦测库，Motion 团队后来接手了这个闲置包名才发布现在这套动画库代码，这段考古史后面会细说。

今天的内容顺序：定位 → 更名史与安装 → motion 组件 → 三态模型 → transition → variants → 手势 → 视口触发 → 退场动画 → 布局动画 → MotionValue → 滚动动画 → 独立 JS 版 → 性能优化 → 易错点 → 对比总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 定位一句话 + 评价

**混合引擎（hybrid engine）**：优先调度浏览器原生 Web Animations API + ScrollTimeline 硬件加速，遇到弹簧物理、可中断关键帧、手势追踪等原生覆盖不了的场景，无缝回退到 JS 驱动的 `requestAnimationFrame`。

<v-clicks>

- React 生态事实标准，Framer/Figma 赞助，MIT 完全开源
- 声明式 API 贴合 React 心智模型，避免 GSAP「ref + 命令式」的违和感
- `layout`/`layoutId` 是杀手级差异化能力，FLIP 技术的高度封装
- 手势/退场/滚动动画内置同一套体系，覆盖面广于 react-spring
- 短板：完整包体积较大，复杂时间线灵活度不如 GSAP

</v-clicks>

<!--
先给一句话定位：Motion 是面向 React、独立 JavaScript、Vue 的生产级动画库，核心架构是混合引擎——能用原生 WAAPI 和 ScrollTimeline 硬件加速就用，覆盖不了的场景才回退到 JS 的 rAF 驱动。

评价五点：第一，它是 React 动画的事实标准，背后有 Framer、Figma 等公司赞助，MIT 协议完全开源没有商业限制。第二，声明式 props API 天然贴合 React，不像 GSAP 那样要 ref 加命令式调用，在 React 里显得别扭还要额外样板代码。第三，layout 和 layoutId 是杀手级能力，把只能手写 JS 计算的布局变化自动转成流畅过渡，背后是 FLIP 技术的高度封装，业界少有方案做到这么开箱即用。第四，手势、退场、滚动动画全部内置在同一套 API 体系下，比单纯做数值插值的 react-spring 覆盖面广得多。第五个是短板：完整版组件包体积比纯手写 WAAPI 方案大，虽然有 LazyMotion 可以优化，但复杂可视化时间线的运行时灵活度不如 GSAP 的可变链式 timeline。
-->

---

# 更名史与安装

<v-clicks>

- 血统包是 `framer-motion`（2019 年至今）；`motion` 包名 2013 年曾是无关的运动侦测库，2024-11-22 起被接手发布同一套动画库代码
- npm 现状：两包版本号自 12.x 起完全同步（当前 **12.42.2**），同源代码双包名并行发布
- 迁移：卸载 `framer-motion` 装 `motion`；import 路径 `"framer-motion"` → `"motion/react"`（旧路径仍有效，只是不推荐）
- 12.0 对 React API **无 breaking changes**，只是包名和 import 路径变了
- 安装：`npm install motion`（yarn/pnpm 同理）；版本要求 **React 18.2+**
- Vue 支持是独立包 `motion-v`，不是 `motion` 自带

</v-clicks>

<!--
更名史是个容易踩坑的考古点。真正的血统包是 framer-motion，2019 年发布 0.0.1 一路线性演进。而 motion 这个 npm 包名，早在 2013 年就已经存在，最初是个跟动画完全无关的 node 运动侦测库，长期无人维护，Motion 团队后来接手了这个闲置包名，从 2024 年 11 月的 12.0.0-alpha.2 开始在上面发布现在这套代码。如果只看 npm 页面的首次发布时间，会误以为 motion 包创建于 2013 年，实际动画库的血统应该以 framer-motion 包 2019 年的历史为准。

现状是两个包版本号自 12.x 起完全同步，当前都是 12.42.2，说明这是同一套源码的双包名并行发布策略，不是新旧分叉。迁移路径官方给得很清楚：卸载 framer-motion 装 motion，import 路径从 framer-motion 改成 motion/react。但官方特别说明旧路径目前仍然有效，很多 AI 代码生成工具因为训练数据陈旧还在生成旧路径，这不算错。12.0 这次改名对 React 版 API 没有 breaking changes，纯粹是包名和路径变化。

安装很直接，npm install motion，React 版本要求 18.2 及以上。最后提醒一个命名坑：Vue 支持是完全独立的包 motion-v，不能类比 React 版假设装 motion 就自带 Vue 绑定。
-->

---

# motion 组件

```jsx
import { motion } from "motion/react"

// 基础动画组件——HTML/SVG 元素的直接替换品
<motion.div animate={{ opacity: 1 }} />

// 自定义组件包装（React 18 需转发 ref，React 19 可直接拿 ref）
const MotionCustom = motion.create(MyComponent)
```

<v-clicks>

- 动画：`initial` / `animate` / `exit` / `transition` / `variants` / `style`
- 手势：`whileHover` / `whileTap` / `whileFocus` / `whileDrag` / `whileInView`
- 拖拽：`drag` / `dragConstraints` / `dragElastic` / `dragMomentum`
- 布局：`layout` / `layoutId` / `layoutDependency` / `layoutScroll`
- 性能关键点：动画走浏览器原生渲染管线，**不会触发 React 重渲染**

</v-clicks>

<!--
motion 组件是 HTML/SVG 元素的直接替换品，覆盖每个标准标签，motion.div、motion.circle、motion.svg 等等。自定义字符串标签用 motion.create 传字符串，自定义 React 组件用 motion.create 包装，组件需要转发 ref，React 18 要用 forwardRef，React 19 可以直接从 props 拿 ref。

props 分为几组：动画相关的 initial/animate/exit/transition/variants/style；手势相关的 whileHover/whileTap/whileFocus/whileDrag/whileInView，以及对应的回调；拖拽相关的 drag 系列；布局相关的 layout 系列。还有一些高级 props，比如 custom 用来传给动态 variants 函数的数据。

最关键的性能点：这些动画更新走的是浏览器原生渲染管线，不会触发 React 组件重渲染，这也是 Motion 性能好的核心原因之一。
-->

---

# initial / animate / exit 三态模型

```jsx
// 进入动画：从 initial 到 animate
<motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} />

// 跳过进入动画（首屏常用优化，避免"闪一下"）
<motion.div initial={false} animate={{ y: 100 }} />

// 退场动画必须配合 AnimatePresence（下节详解）
<AnimatePresence>
  {isVisible && (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
  )}
</AnimatePresence>
```

<div v-click class="mt-2 text-sm">

> `animate` 目标值变化会自动补间到新值，无需手写关键帧；`initial` 设为 `false` 是常见首屏优化手法，跳过组件挂载时的进入动画。

</div>

<!--
Motion 动画的三态模型：initial 定义起始状态，animate 定义目标状态，exit 定义卸载时的退场状态。

进入动画很直接，从 initial 到 animate 自动补间。有个常见优化手法：initial 设为 false，跳过组件挂载时的进入动画，避免首屏"闪一下"。

exit 必须配合 AnimatePresence 才会生效，这是下一节的重点。这里先建立心智模型：animate 目标值发生变化时会自动补间到新值，不需要手动重新触发，这也是声明式 API 的核心便利之处。
-->

---

# transition：tween vs spring（必考）

```jsx
// tween：时长 + 缓动曲线驱动
<motion.div animate={{ opacity: 1 }} transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }} />

// spring：物理参数驱动
<motion.div animate={{ x: 100 }} transition={{ type: "spring", stiffness: 300, damping: 20, mass: 1 }} />
```

<div v-click class="mt-2 text-sm">

> ⚠️ spring 默认值（官方 `/docs/react-transitions` 与 `/docs/spring` 两页一致）：`stiffness` 默认 **1**（很多人凭旧印象记成 100）、`damping` 默认 **10**、`mass` 默认 **1**。

</div>

<v-clicks>

- 简化写法：`duration` + `bounce`（0~1，0 无回弹 1 最大回弹）比调三参数更直观，文档更推荐
- inertia 类型：根据初始速度做减速滑行，常用于甩动/惯性滚动收尾

</v-clicks>

<!--
transition 的 type 有三种。tween 是时长加缓动曲线驱动，duration 默认 0.3 秒，多关键帧时默认 0.8 秒，ease 支持一堆预设名或三次贝塞尔数组。spring 是物理参数驱动。

这里有个必考的易错点：spring 的默认值，官方文档 react-transitions 和 spring 两个页面交叉确认一致，stiffness 默认是 1，damping 默认 10，mass 默认 1。很多人凭旧印象记成 stiffness 默认 100，这是错的，现在官方文档写的就是 1，数值很小，几乎不怎么动，所以实践中几乎总是显式传参。面试如果考默认值，要以现行文档为准。

还有个更直觉的简化写法，用 duration 加 bounce 两个参数配置弹簧，bounce 在 0 到 1 之间，0 是无回弹，1 是最大回弹，文档更推荐这种写法而不是直接调 stiffness/damping/mass。第三种 type 是 inertia，根据初始速度做减速滑行，常用于甩动或者惯性滚动收尾这类场景。
-->

---

# transition：keyframes + 编排参数

```jsx
<motion.div animate={{ x: [0, 100, 0] }} />                 // 顺序播放三个值
<motion.div animate={{ x: [null, 100, 0] }} />               // null = 当前值占位
<motion.circle
  animate={{ cx: [null, 100, 200] }}
  transition={{ duration: 3, times: [0, 0.2, 1] }}           // times 精确控制每帧时间点
/>
```

<v-clicks>

- 编排类公共参数：`delay` / `repeat`（含 `Infinity`）/ `repeatType`（loop/reverse/mirror）/ `repeatDelay`
- 父子编排：`delayChildren` + `when`（beforeChildren/afterChildren）
- keyframes 数组即顺序播放；`null` 通配符表示"当前值"，常用于"从当前位置出发再回到目标"

</v-clicks>

<!--
animate 的值可以直接写数组，表示顺序播放多个关键帧，比如 x 从 0 到 100 再回到 0。数组里的 null 是个通配符，表示"当前值"，常用于"从当前位置出发再回到目标"这种场景，配合 times 数组精确控制每一帧出现的时间点，times 是 0 到 1 之间的相对位置。

编排类公共参数：delay 延迟、repeat 重复次数（可以传 Infinity 无限循环）、repeatType 控制重复方式是 loop 循环、reverse 反向还是 mirror 镜像、repeatDelay 每次重复之间的延迟。父子编排相关的是 delayChildren 和 when，when 设 beforeChildren 或 afterChildren 控制父子动画的播放顺序，这个下一节 variants 编排会具体展开。
-->

---

# variants（必考·1/2）：命名态 + 父子传播

```jsx
const variants = { visible: { opacity: 1 }, hidden: { opacity: 0 } }

<motion.div variants={variants} initial="hidden" whileInView="visible" exit="hidden" />

// 父子传播：子组件不写 initial/animate，声明匹配的 variant 名即可
const list = { visible: { opacity: 1 }, hidden: { opacity: 0 } }
const item = { visible: { opacity: 1, x: 0 }, hidden: { opacity: 0, x: -100 } }

<motion.ul initial="hidden" whileInView="visible" variants={list}>
  <motion.li variants={item} />
</motion.ul>
```

<v-clicks>

- variants：命名动画态 + 父子编排，是 Motion 最具"框架感"的能力
- 传播（propagation）：子组件不必重复声明 `initial`/`animate`，自动从父级继承

</v-clicks>

<!--
variants 是命名动画态加父子编排，是 Motion 最具"框架感"的能力。先定义一个 variants 对象，把状态名映射到具体的动画目标，然后 initial、animate、whileInView、exit 这些 prop 直接传状态名字符串，而不是内联对象。

最有价值的是传播机制：父组件声明了 variants 和 initial/whileInView 之后，子组件只需要声明匹配的 variant 名字，不需要重复写 initial 和 animate，会自动从父级继承触发时机。这在做列表整体进场动画时特别有用，比如一个 ul 触发 visible，里面所有 li 只要声明同名的 variants，就会跟着联动，不需要每个子项单独配置触发逻辑。
-->

---

# variants（必考·2/2）：编排控制 + 动态 variants

```jsx
import { stagger } from "motion/react"

const list = {
  visible: { opacity: 1, transition: { when: "beforeChildren", delayChildren: stagger(0.3) } },
  hidden: { opacity: 0, transition: { when: "afterChildren" } },
}
// 动态 variants：函数形式 + custom prop 传入索引等数据
const variants = {
  hidden: { opacity: 0 },
  visible: (index) => ({ opacity: 1, transition: { delay: index * 0.3 } }),
}
items.map((item, i) => <motion.div key={item.id} custom={i} variants={variants} />)
```

<div v-click class="mt-2 text-sm">

> `stagger()` 生成递增延迟，配合 `delayChildren` 实现子元素错列出场；动态 variants 用函数形式接收 `custom` prop 传入的数据（如索引）返回不同目标态。

</div>

<!--
编排控制靠 when 加 delayChildren 加 stagger 函数组合。when 设 beforeChildren 表示父节点动画先播完，delayChildren 再触发子节点；stagger 函数生成一个随子节点索引递增的延迟值，实现经典的错列出场效果，比如列表项依次淡入。

动态 variants 是函数形式，可以接收每个组件通过 custom prop 传入的不同数据，这里用索引乘以固定间隔实现延迟错列，效果上类似 stagger，但更灵活，可以传任意自定义数据而不只是索引。渲染时用 map 遍历数组，每个元素传不同的 custom 值。
-->

---

# gesture 手势基础

```jsx
<motion.button
  whileHover={{ scale: 1.2 }}
  whileTap={{ scale: 0.9, rotate: 3 }}
  whileFocus={{ scale: 1.2 }}
  onHoverStart={(e) => {}}
/>

// 用 variants 名字驱动手势，可复用同一套 variants 给多种触发条件
<motion.button whileTap="tap" whileHover="hover" variants={buttonVariants} />

// pan 手势：平移追踪，区别于 drag（不会移动元素本身）
<motion.div onPan={(e, info) => {}} />
```

<v-clicks>

- `whileHover` / `whileTap` / `whileFocus` 是最基础的三种手势状态，也能直接用 variant 名字驱动
- `whileInView` 滚动进视口触发，留到滚动动画一节详解

</v-clicks>

<!--
手势系统是 Motion 内置能力的重要一环。最基础的三个：whileHover 悬停、whileTap 点击按下、whileFocus 聚焦，值可以直接写内联对象，也可以传 variant 名字字符串，复用同一套 variants 定义给多种触发条件，减少重复代码。

pan 是平移追踪手势，通过 onPan 回调拿到移动信息，但它本身不会移动元素，区别于下一页要讲的 drag——drag 是真的把元素拖着走，pan 只是追踪手指或鼠标的移动轨迹用于自定义逻辑。whileInView 也算手势范畴的一种，元素滚动进视口时触发，这个留到后面滚动动画一节和 useScroll 放在一起细讲。
-->

---

# drag 拖拽详解

```jsx
<motion.div drag />                                    // 双轴自由拖拽
<motion.div drag="x" dragDirectionLock />              // 轴锁定 + 方向锁定

<motion.div
  drag
  dragConstraints={{ left: 0, right: 300 }}             // 约束范围（或传容器 ref）
  dragElastic={0.1}                                     // 越界弹性系数
  dragMomentum={false}                                  // 关闭松手后惯性滑行
  whileDrag={{ scale: 1.1 }}
  onDrag={(e, info) => console.log(info.offset, info.velocity)}
/>
```

<v-clicks>

- 约束二选一：像素对象 `dragConstraints`，或传容器 `ref`
- `useDragControls` 手动控制拖拽起始，常用于专门的"拖拽把手"元素

</v-clicks>

<!--
drag 基础用法就是加一个 drag prop，双轴自由拖拽；传 "x" 或 "y" 锁定单轴，dragDirectionLock 进一步做方向锁定，配合 onDirectionLock 回调知道锁定了哪个轴。

约束范围二选一：直接传像素对象指定上下左右边界，或者传一个容器的 ref，让拖拽被限制在容器内部。dragElastic 控制越界之后的弹性系数，dragMomentum 设 false 可以关闭松手后的惯性滑行，whileDrag 定义拖拽过程中的视觉反馈，onDrag 回调里能拿到 offset 偏移量和 velocity 速度等信息。dragTransition 还能单独配置回弹的弹簧参数。

更高级的场景，比如想要从一个专门的"拖拽把手"图标发起拖拽而不是整个卡片都能拖，用 useDragControls 拿到控制器，在把手的事件里手动调用 start 方法。
-->

---

# whileInView 视口触发 + useInView

```jsx
<motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} />
```

| 配置项 | 说明 |
|---|---|
| once | 只触发一次，默认 false |
| amount | some / all / 0~1，默认 some |
| margin | 检测区域偏移，默认 0px |
| root | 自定义滚动容器 |

<div v-click class="mt-2 text-sm">

> `useInView` 是独立 hook，返回布尔 state，区别于声明式的 `whileInView`；命令式/副作用场景（需要拿到布尔状态自己处理逻辑）选它。

</div>

<!--
whileInView 是滚动触发类动画，元素进入视口时触发一次性动画，跟 whileHover 这些手势 prop 是同一套写法。viewport 配置里最常用的是 once，设 true 表示只触发一次，不设的话滚出去再滚进来会反复触发；amount 控制多大比例可见才算触发，可以是 some、all，或者 0 到 1 的具体数字；margin 可以调整检测区域，往外扩或往里缩；root 可以指定一个自定义的滚动容器而不是默认的视口。

useInView 是独立的 hook，跟 whileInView 这个声明式 prop 的区别在于它返回的是一个布尔值的 state，适合命令式场景，比如你需要在业务逻辑里判断"现在是否可见"来做一些跟动画无关的副作用，这时候用 useInView 而不是 whileInView。
-->

---

# AnimatePresence（必考·1/2）：结构要求

```jsx
// 错误：条件在外层，AnimatePresence 侦测不到"移除"事件
isVisible && (
  <AnimatePresence>
    <Component />
  </AnimatePresence>
)

// 正确：条件写在 AnimatePresence 内部
<AnimatePresence>
  {isVisible && <motion.div key="modal" exit={{ opacity: 0 }} />}
</AnimatePresence>
```

<v-clicks>

- 作用：组件从 React 树移除时先播放 `exit` 动画，再真正卸载
- 所有直接子元素必须有**唯一且稳定**的 `key`；条件判断必须写在 `AnimatePresence` **内部**

</v-clicks>

<!--
AnimatePresence 的作用是：包裹 motion 组件后，组件从 React 树移除时能先播放 exit 动画再真正卸载，本质是检测直接子元素何时被移除，延迟真实 DOM 移除的时机。

两条强制要求，也是最容易踩的坑。第一，条件判断必须写在 AnimatePresence 内部，作为它的 children，而不是把整个 AnimatePresence 包在条件外层——如果包在外层，组件根本不会经历"移除"这个过程，退场动画完全不会触发，这是新手最常犯的错误。第二，所有直接子元素必须有唯一且稳定的 key，不要用数组 index，尤其是列表可能重新排序或者删除的情况，用 index 当 key 会导致错误匹配元素，退场动画播在错误的项上。
-->

---

# AnimatePresence（必考·2/2）：mode + 坑点

| mode | 行为 | 场景 |
|---|---|---|
| sync（默认） | 新旧元素同时进出 | 一般场景 |
| wait | 等旧元素完全退场才进入 | 轮播图、逐项切换 |
| popLayout | 退场元素立即脱离文档流 | 配合 layout 的列表删除 |

```jsx
<AnimatePresence mode="popLayout">
  {items.map(item => <motion.li layout key={item.id} exit={{ opacity: 0 }} />)}
</AnimatePresence>
```

<v-clicks>

- 坑点：`popLayout` 要求父元素 position **非 static**，否则周围元素不会正确重排
- 嵌套 `AnimatePresence` 默认阻止子级退场动画向上传播，需显式设置 `propagate`

</v-clicks>

<!--
mode 属性三个值。sync 是默认值，新旧元素同时进出，没有先后顺序，适合一般场景。wait 会等旧元素完全退场之后新元素才进入，同一时刻只渲染一个子元素，适合轮播图、逐项切换这类场景。popLayout 让退场元素立即脱离文档流，周围元素同步重排，专门配合 layout prop 做列表删除动画，比如从一个列表里删掉一项，其他项能流畅地填补空隙。

两个坑点。第一，popLayout 模式要求父元素的 position 不能是默认的 static，否则退场元素脱离文档流之后，周围元素不会按预期正确重排。第二，嵌套使用 AnimatePresence 时，内层默认会阻止子元素的退场动画向上传播给外层感知，需要显式设置 propagate 为 true 才会传播。
-->

---

# layout 动画（必考特色·1/2）

```jsx
// 自动为尺寸/位置变化设置过渡，哪怕是通常不可动画的 CSS 属性
<motion.div layout style={{ justifyContent: isOn ? "flex-start" : "flex-end" }} />

// layoutId：共享元素动画（Magic Motion）——新组件挂载会自动从旧组件"飞"过去
{isSelected && <motion.div layoutId="underline" />}

// 配合 AnimatePresence 让共享元素保留到退场动画播完
<AnimatePresence>{isOpen && <motion.div layoutId="modal" />}</AnimatePresence>
```

<v-clicks>

- `layout` prop：自动为布局变化设置过渡，业界少有方案做到这么开箱即用
- `layoutId`：相同 ID 的新旧组件自动产生"飞跃"过渡，背后是 FLIP 技术的高度封装（5.0 前需 `AnimateSharedLayout` 包裹，现已不需要）

</v-clicks>

<!--
layout 动画是 Motion 的杀手级特色能力。加一个 layout prop，就能自动为尺寸和位置的变化设置过渡，哪怕是像 justifyContent 这种通常完全不可动画的 CSS 属性，切换的时候也能顺滑过渡，这在业界是很少见的开箱即用体验。

layoutId 是共享元素动画，官方给它起了个名字叫 Magic Motion。新组件挂载的时候，如果 layoutId 跟旧组件相同，会自动从旧组件的位置"飞"过去，做出共享元素跨组件过渡的效果，经典场景是 tab 切换下划线、列表项展开成详情页。配合 AnimatePresence 可以让共享元素保留到退场动画播完再消失。

历史注记：Framer Motion 5.0 之前需要用 AnimateSharedLayout 组件包裹才能实现共享元素动画，5.0 起改成了全局单一测量树，layoutId 直接生效，不再需要包裹组件——但这也带来了下一页要讲的全局作用域问题。
-->

---

# LayoutGroup + 失真修正（必考特色·2/2）

```jsx
import { LayoutGroup } from "motion/react"

// 让多个独立组件的布局变化互相感知；id 建命名空间避免多实例冲突
function TabRow({ id, items }) {
  return <LayoutGroup id={id}>{items.map(i => <Tab {...i} />)}</LayoutGroup>
}

// layout="position"：只动画位置，尺寸瞬间切换（纵横比会变的图片类元素适用）
<motion.img layout="position" />
```

<v-clicks>

- layout 动画全部通过 transform 实现，会带来子元素/圆角/阴影"挤压失真"，Motion 会自动修正（子元素同样加 `layout`；圆角阴影自动逆向补偿）
- 5.0 起 `layoutId` 默认全局共享作用域，多实例同名会"抢跑"，需 `LayoutGroup` 的 `id` 隔离

</v-clicks>

<!--
LayoutGroup 让多个独立组件的布局变化互相感知、同步触发，比如页面里有好几个手风琴组件，用 LayoutGroup 包裹能让它们的展开收起联动。传 id 属性可以给内部的 layoutId 建立命名空间，避免多个组件实例之间冲突。

layout="position" 是个变体：只动画位置，尺寸瞬间切换不做过渡，适合纵横比会发生变化的元素，比如图片，因为图片如果尺寸也跟着做拉伸过渡通常会很难看。

性能与视觉修正要点：Motion 的 layout 动画全部通过 transform 实现以保证性能，但这种实现方式会带来子元素、圆角、阴影的"挤压失真"问题。Motion 的自动修正机制是：子元素只要同样加上 layout prop 就能避免失真；borderRadius 和 boxShadow 写在 style 里，Motion 会自动做逆向补偿计算。最后回到上一页提到的历史变化：5.0 起 layoutId 默认是全局单一测量树共享作用域，如果多个列表或多个组件实例意外用了相同的 layoutId，会互相"抢跑"产生错误的共享动画，这时候就需要 LayoutGroup 的 id 属性来隔离出局部作用域。
-->

---

# MotionValue 与 hooks

```jsx
import { useMotionValue, useTransform, useSpring, useVelocity } from "motion/react"

const x = useMotionValue(0)
x.set(100); x.get()                                  // 命令式设置/读取，不是 React state

const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0])   // 数值区间映射
const springX = useSpring(x, { stiffness: 300 })              // 弹簧跟随另一个值
springX.jump(50)                                     // 立即跳变，不经过动画

const xVelocity = useVelocity(x)                     // 追踪速度
```

<v-clicks>

- MotionValue 更新不经过 React state、不触发组件重渲染，批处理到下一帧直接写 DOM
- `useMotionValueEvent` 订阅变化事件；`useVelocity(useVelocity(x))` 可进一步算出加速度

</v-clicks>

<!--
MotionValue 是"可组合的、类信号的动画值"，核心卖点是更新时不经过 React 状态、不触发组件重渲染，变更会批处理到下一帧直接写入 DOM，这是 Motion 性能优势的另一个来源。

useMotionValue 创建一个值，set 命令式设置、get 同步读取当前值，注意这不是 React state，读写不会引发重渲染。useTransform 把一个 MotionValue 按数值区间映射到另一个区间，比如这里 x 从 -200 到 200 映射到透明度 0 到 1 再到 0。useSpring 让一个值以弹簧方式跟随另一个值或固定目标，它返回的对象上有个 jump 方法，可以立即跳变到某个值而不经过动画，这一点区别于普通 set 仍然会走 transition。

想响应 MotionValue 的变化，不能指望组件重渲染读到最新值，必须用 useMotionValueEvent 订阅 change 等事件。useVelocity 追踪速度，把 useVelocity 的结果再套一层 useVelocity 可以算出加速度，这是个进阶技巧。
-->

---

# useScroll 滚动动画

```jsx
// 滚动链接：顶部进度条
const { scrollYProgress } = useScroll()
<motion.div style={{ scaleX: scrollYProgress, originX: 0 }} />

// 跟踪特定元素 + 映射到任意 CSS 值
const ref = useRef(null)
const { scrollYProgress: p2 } = useScroll({ target: ref, offset: ["start end", "end start"] })
const filter = useTransform(p2, [0, 1], ["blur(0px)", "blur(10px)"])
```

<v-clicks>

- 两种模式：滚动触发（`whileInView`，一次性）vs 滚动链接（`useScroll`，连续跟手）
- `offset` 默认监听整页；传 `target` 可改为跟踪指定元素；再套一层 `useSpring` 能让滚动值更平滑

</v-clicks>

<!--
滚动动画分两种模式，一定要分清楚。滚动触发是元素进出视口时触发一次性动画，前面讲过的 whileInView 就是这种。滚动链接是动画值直接绑定滚动位置，连续跟手，滚多少动多少，这一页的 useScroll 就是做这个的。

最经典的例子是顶部进度条：useScroll 不传参数默认监听整个页面的滚动进度，拿到 scrollYProgress 这个 MotionValue，绑定到某个元素的 scaleX 上，originX 设 0 保证从左往右伸长。

更进阶的用法是传 target 跟踪特定元素而不是整页，offset 数组定义"起点 终点"这种关系，比如 start end 表示目标元素顶部碰到视口底部时算作 0%，end start 表示目标元素底部碰到视口顶部算作 100%。拿到这个进度值之后可以用 useTransform 映射到任意 CSS 值，这里映射到模糊滤镜的强度。如果希望滚动值更平滑不生硬，可以再套一层 useSpring 包一下。
-->

---

# 独立 JS 版（Motion vanilla）

```js
import { animate, scroll, stagger } from "motion"     // 从根导入，而非 motion/react

animate(".box", { rotate: 360 })
animate(element, { scale: [0.4, 1] }, { ease: "circInOut", duration: 1.2 })
animate("li", { y: 0, opacity: 1 }, { delay: stagger(0.1) })   // 错列

scroll(animate("div", { transform: ["none", "rotate(90deg)"] }))  // 绑定滚动
```

<v-clicks>

- 体积：mini 版 `animate()` 仅 **2.3kb**；hybrid 完整版 **18kb**（对比 GSAP 23.5kb）
- 播放控制：`pause` / `play` / `complete`（跳终态）/ `cancel`（回初值）/ `stop`（保留当前状态，不可重启）
- 时间线数组语法的 `at` 支持相对时间：同时 / 延后 / 提前 / 标签引用

</v-clicks>

<!--
Motion 除了 React 版，还有一个不依赖任何框架的独立 JS 版，安装用同一个包 npm install motion，但导入路径不同，是从根路径导入而不是 motion/react。

animate 函数很灵活，目标可以是 CSS 选择器字符串、单个元素、元素数组、MotionValue、纯对象甚至纯数字。体积上 mini 版的 animate 函数只有 2.3kb，功能完整的 hybrid 版是 18kb，对比同类的 GSAP 的 animate 体积 23.5kb 更小。stagger 函数一样能实现错列播放。

scroll 函数做滚动链接，基于浏览器原生 ScrollTimeline 硬件加速，可以传回调模式，也可以直接绑定到一个 animate 调用上。播放控制对象上有 pause、play、complete 立即跳到终态、cancel 取消并回到初始值、stop 把当前值提交到 style 后停止且不可重启，这几个方法容易混淆，要分清区别。时间线还支持数组语法做多段序列，at 参数支持相对时间语法，同时、延后、提前，或者引用一个字符串标签。
-->

---

# 性能：LazyMotion / m 组件

```jsx
import { LazyMotion, domAnimation } from "motion/react"
import * as m from "motion/react-m"

function App({ children }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>
}
// 用 <m.div> 替代 <motion.div>
```

<v-clicks>

- 体积对比：`motion` 组件预加载全部功能 **34kb**（无法树摇）；`m` 组件基础 **4.6kb** + 按需特性包
- `domAnimation`（+15kb）覆盖动画/变体/退场/手势；`domMax`（+25kb）再加拖拽和布局动画
- `strict` 模式：混用了完整版 `motion.div` 会直接抛错，防止误用导致体积膨胀

</v-clicks>

<!--
性能优化的主要手段是 LazyMotion 加 m 组件。默认的 motion 组件预加载了全部功能，34kb，没法进一步树摇。m 组件是基础版，只要 4.6kb，具体功能靠 LazyMotion 包裹时传入的 features 按需加载。

两档特性包：domAnimation 加 15kb，覆盖动画、变体、退场、点击悬停聚焦这些手势；domMax 在 domAnimation 基础上再加 25kb，把拖拽和布局动画也加进来。用法是把整个应用用 LazyMotion 包一层，传 features，内部把 motion.div 全部换成 m.div。还能进一步动态 import 特性包，延迟加载做到极致按需。

strict 模式是个防误用的保险栓：开启之后如果代码里不小心混用了完整版的 motion.div 而不是 m.div，会直接抛错，提醒你体积可能意外膨胀了，而不是悄悄地把整个包体积拉大却没人发现。
-->

---

# 易错点清单

<v-clicks>

- `AnimatePresence` 条件位置写反：必须写在内部作为 children，包在外层侦测不到"移除"
- key 用了数组 index：列表重排/删除时会错误匹配元素，应使用元素自身稳定的 ID
- 误以为 MotionValue 更新会触发重渲染：需 `useMotionValueEvent` 订阅才能响应变化
- 凭旧印象记错 spring 默认值：`stiffness` 现行文档默认是 **1**，不是很多人以为的 100
- import 路径纠结：`"framer-motion"` 仍可正常工作，只是非推荐写法，功能完全一致
- `popLayout` 缺少定位上下文：父元素若是默认 `static`，退场重排不会正确生效
- Vue 版包名搞混：独立包 `motion-v`，手势 prop 名是 `whilePress` 而非 `whileTap`
- `reducedMotion` 理解片面：只禁用 transform/layout 动画，opacity 等属性仍会播放

</v-clicks>

<!--
汇总八个最容易踩的坑。第一，AnimatePresence 条件位置写反，条件必须写在内部当 children，包在外层根本侦测不到组件被移除。第二，key 用数组 index，列表重排或删除时会错误匹配到别的元素，退场动画播错地方，应该用元素自身稳定的 ID。第三，MotionValue 更新走的是绕过 React state 的旁路，不会触发重渲染，业务逻辑要响应变化必须显式订阅 useMotionValueEvent。

第四，spring 默认值很多人凭旧教程记成 stiffness 100，现行官方文档写的是 1，这个反直觉的数字面试常考。第五，import 路径纠结，用旧的 framer-motion 路径完全没问题，只是不是最新推荐写法。第六，popLayout 模式如果父元素还是默认的 static 定位，退场后周围元素不会正确重排。第七，Vue 版是完全独立的 motion-v 包，而且手势 prop 名字跟 React 版不一样，是 whilePress 不是 whileTap，不能直接照搬。第八，reducedMotion 只是禁用 transform 和 layout 类动画，不代表所有动画效果都消失，opacity 和背景色这类属性动画依然会播放。
-->

---

# vs GSAP 选型对比

| 维度 | Motion | GSAP |
|---|---|---|
| 许可证 | MIT 完全开源 | 现归 Webflow 所有 |
| API 风格 | 声明式（props） | 命令式（ref + 方法） |
| 体积 | animate() 18kb | 23.5kb |
| 时间线 | 数组声明式 | 可变链式，运行时更灵活 |
| 布局动画 | 内置 layout 引擎 | 依赖手动 FLIP |

<div v-click class="mt-4 text-sm">

> 选型建议（官方口径）：追求整体性能、更小体积、现代 React/Vue 开发体验选 **Motion**；需要复杂时间线编排（尤其非 React 项目）**GSAP** 仍有独特价值。

</div>

<div v-click class="mt-2 text-sm">

资源：官方文档 motion.dev；React / 独立 JS / Vue（`motion-v`）三端同源，共享同一套混合引擎。

</div>

<!--
最后做个选型对比，依据官方 gsap-vs-motion 页面的原文观点。许可证上，Motion 是完全独立的 MIT 开源，GSAP 目前归 Webflow 所有；API 风格上 Motion 是第一类声明式，GSAP 是命令式需要配合 ref 和 useGSAP hook；体积上 Motion 的 animate 函数 18kb 比 GSAP 的 23.5kb 更小，而且 GSAP 引入任何一部分就会打包全部代码，Motion 的模块化架构更利于按需裁剪；时间线编排上 GSAP 的可变链式时间线运行时能动态插删轨道，这点更成熟灵活，是官方也承认的 GSAP 优势；布局动画上 Motion 内置的引擎被认为领先于 GSAP 依赖手动 FLIP 实现的方案。

选型建议：追求整体性能、更小包体积、现代 React 或 Vue 开发体验，优先选 Motion；需要复杂时间线编排，尤其是非 React 项目，GSAP 仍然有独特价值。资源上官方文档在 motion.dev，记住 React、独立 JS、Vue 版是同源共享一套混合引擎的三端实现，不是三个不同的产品。今天的分享就到这里，谢谢大家。
-->
