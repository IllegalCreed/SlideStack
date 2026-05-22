---
theme: seriph
background: https://cover.sli.dev
title: Welcome to VueUse
info: |
  Presentation VueUse for Vue 3 developers.

  Learn more at [https://vueuse.org](https://vueuse.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🧰</span>
</div>

<br/>

## VueUse — Vue 3 组合式工具函数集合

200+ composables / 12 大分类 / Tree-shakeable + SSR 友好 —— Anthony Fu 与社区维护，Vue 3 项目的事实标准工具库（当前主线 v14.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 VueUse —— Anthony Fu 发起、社区共同维护的 Vue 3 组合式函数库，
是当今 Vue 生态中最流行的工具型 composable 库。

核心定位先说清楚：VueUse 不是 UI 组件库、不渲染任何视觉元素。
它做的事情是把「鼠标位置 / 元素尺寸 / 暗色模式 / 本地存储 / 网络请求 / 防抖节流 / 剪贴板 / 媒体查询」
这些「与浏览器交互的有状态逻辑」封装成一个个可直接 import 的 composable。

核心卖点：
- 200+ composables，覆盖 State / Elements / Browser / Sensors / Network / Animation /
  Component / Watch / Reactivity / Array / Time / Utilities 共 12 大分类
- 100% TypeScript 编写，类型完备，无需额外 @types
- 完全 Tree-shakeable —— 按需打包，没用到的函数零体积
- SSR 友好 —— 服务端渲染不报错
- 副作用自动清理 —— 事件监听 / 定时器随组件 unmount 自动移除
- 可直接 CDN 引入，挂在 window.VueUse

版本说明：最新稳定版 v14.3.0（2026 年发布），要求 Vue 3.5+。
Vue 3 专用 —— 自 v12.0 起不再支持 Vue 2（Vue 2 项目需停留在 v11.x）。

下面会按「定位 → 作者 → 设计哲学 → 安装 → 基本用法 → 响应式参数 → 12 大分类 →
旗舰函数深度 → add-on → SSR → 踩坑 → 评价 → 学习路径」顺序展开。
-->

---
transition: fade-out
---

# 什么是 VueUse？

把「与浏览器交互的有状态逻辑」封装成可直接 import 的组合式函数

<v-click>

- **逻辑库，不是 UI 库**：提供 `useMouse` / `useDark` / `useFetch` 这类逻辑积木，不渲染按钮、表格、对话框
- **深度绑定 Vue 响应式**：返回的都是 ref / computed，参数也能接受 ref，天然与 watch、模板联动
- **副作用自动清理**：内部的事件监听、定时器随组件 unmount 自动移除，消除最常见的内存泄漏 Bug
- **200+ composable**：覆盖 12 大分类，日常 Vue 业务 80% 的「监听 + 清理」样板代码都能替代
- **完全 Tree-shakeable**：基于 ESM 按需 import，没用到的 composable 零打包体积
- **100% TypeScript**：源码全量 TS 编写，所有返回值与选项类型完备，无需 `@types/*`
- **SSR 友好**：Nuxt / Vite SSR 环境下不会因访问 window / document 而崩溃
- **成熟稳定期**：GitHub 22k+ Star、npm 周下载数百万，Vue 3 项目的事实标准工具库

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_VueUse Get Started_](https://vueuse.org/guide/)

</div>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] VueUse 的核心定位一句话说清：
「把与浏览器交互的有状态逻辑封装成可直接 import 的组合式函数」。

最容易误解的一点 —— VueUse 不是 UI 库。
你要按钮、表格、对话框，仍然要搭配 Element Plus / Naive UI / Arco Design Vue。
VueUse 提供的是「逻辑积木」—— useMouse 给你响应式鼠标坐标，
useDark 给你暗色模式开关，useFetch 给你响应式 HTTP。

它最大的价值在「消除样板代码」：
传统 Vue 业务里到处是 addEventListener + onUnmounted removeEventListener、
setInterval + clearInterval、ResizeObserver + disconnect ——
这些「监听 + 清理」的成对代码，VueUse 用一个函数就解决，且自动清理。

「副作用自动清理」是它最实在的好处 ——
忘记在 onUnmounted 里清理监听导致内存泄漏，是 Vue 项目最常见的 Bug 之一，
VueUse 默认帮你代办。

「深度绑定 Vue 响应式系统」是它区别于 lodash 的根本 ——
返回值是 ref / computed，参数也能接受 ref，天然能和 watch、模板联动。

200+ composable 听起来吓人，但记住分类就好定位 —— 后面会专门讲 12 大分类。

截至 2026 年 v14.x，VueUse 处于成熟稳定期 —— GitHub 22k+ Star、npm 周下载数百万。
绝大多数 Vue 3 应用都会装它，连 Element Plus / Naive UI 这些 UI 库本身也大量内部依赖 VueUse。
-->

---
transition: fade-out
---

# VueUse 的定位与生态

它和 lodash、React Hooks 库到底是什么关系？

<v-click>

| 维度       | VueUse              | lodash          | react-use / ahooks   |
| ---------- | ------------------- | --------------- | -------------------- |
| 所属生态   | **Vue 3**           | 框架无关        | React                |
| 核心能力   | **响应式 composable** | 纯数据工具函数  | React Hook 集合      |
| 是否响应式 | **是**（ref/computed） | 否（纯函数）   | 是（React 状态）     |
| 副作用清理 | **随组件卸载自动**  | 无副作用        | useEffect 返回函数   |
| 典型函数   | `useMouse` `useDark` | `debounce` `cloneDeep` | `useMount` `useRequest` |
| 在 Vue 项目 | **首选**            | 纯数据处理仍可用 | 不适用               |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_VueUse vs lodash / RxJS_](https://vueuse.org/guide/)

</div>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] VueUse 经常被拿来跟 lodash、RxJS、React Hooks 库比较，
但它们的定位完全不同 —— 理解这点能帮你判断什么时候用什么。

VueUse vs lodash：
- lodash 是「无响应式的纯数据工具」—— debounce、cloneDeep、groupBy、集合操作，
  与框架无关、无状态、无副作用
- VueUse 是「深度绑定 Vue 响应式系统的工具」—— 返回 ref，随组件清理
- 结论：Vue 项目里 VueUse 是首选，但纯数据处理（深拷贝、复杂集合操作）仍可能用到 lodash

VueUse vs RxJS：
- RxJS 是「通用响应式流」—— Observable，需要手动 unsubscribe，适合复杂事件流编排
- VueUse 更轻、更贴合 Vue —— 而且 VueUse 还提供 @vueuse/rxjs add-on 做两者桥接

VueUse vs React Hooks 库：
- react-use 和 VueUse 的 @vueuse/core 是「同类定位」—— 都是框架核心团队风格的 Hook / composable 集合
- ahooks 是企业级 Hook 集合，也是同类
- 关键差异：React Hook 受「Hook 规则」约束（不能在条件 / 循环里调用），
  Vue composable 没有这类规则，但必须在 setup / script setup 同步执行期调用才能挂上生命周期

很多 React 转 Vue 的同学会问「Vue 有没有 react-use」—— 答案就是 VueUse，
而且因为同源 Anthony Fu，命名风格也很接近（useDebounce、useLocalStorage 几乎一致）。
-->

---
transition: fade-out
---

# Anthony Fu 与 VueUse

为什么这个库值得信任？

<v-click>

| 维度       | 说明                                                            |
| ---------- | --------------------------------------------------------------- |
| 作者       | **Anthony Fu（antfu）** —— Vue / Vite / Nuxt 核心团队成员       |
| 同源生态   | 同时是 `unplugin` / `unocss` / `slidev` / `vitest` 等明星项目作者 |
| 维护方式   | Anthony Fu 发起 + 社区 contributors 共同维护，高频迭代          |
| 协议       | **MIT** —— 主仓库 `vueuse/vueuse`，22k+ GitHub Star             |
| 设计同源   | 与 Vue 响应式系统、Vite 构建生态高度同源，跟随 Vue 演进最有保障 |
| 当前状态   | 截至 2026 年 v14.x，成熟稳定期，npm 周下载数百万               |

</v-click>

<v-click>

> 💡 **冷知识**：你现在看的这份幻灯片就是用 Slidev 做的 —— Slidev 也是 Anthony Fu 的作品。VueUse、Slidev、UnoCSS、Vitest 出自同一人之手。

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 选一个工具库，最关心的是「它会不会跟着框架一起死」。
VueUse 在这一点上几乎是 Vue 生态里最有保障的。

作者 Anthony Fu（GitHub ID antfu）—— 这个名字在前端圈分量很重：
- 他是 Vue 核心团队成员
- 也是 Vite 核心团队成员
- 还是 Nuxt 核心团队成员

也就是说，VueUse 的设计与 Vue 响应式系统、Vite 构建生态是「高度同源」的 ——
Vue 怎么演进，VueUse 第一时间跟上，这种可靠性是其他第三方库给不了的。

Anthony Fu 的「明星项目谱系」非常惊人：
- unplugin —— 跨构建工具的插件系统
- unocss —— 即时原子化 CSS 引擎
- slidev —— 面向开发者的演示文稿工具
- vitest —— 现代单元测试框架
- vue-router、nuxt 等也都有他的贡献

VueUse 不是他一个人写 —— 是他发起 + 社区 contributors 共同维护，
GitHub 22k+ Star、MIT 协议、高频迭代。

[click] 冷知识收尾 —— 你现在看的这份幻灯片就是 Slidev 做的，
而 Slidev 也是 Anthony Fu 的作品。
VueUse、Slidev、UnoCSS、Vitest 出自同一人 —— 这个生态的连贯性是它的隐性优势。

所以选型时，VueUse 的「维护风险」基本可以不用担心 —— 它是 Vue 3 生态保养最好的工具库之一。
-->

---
transition: fade-out
---

# 七条核心设计哲学

学会这套约定，比记住单个函数更重要

<v-clicks>

- **① 返回 ref 对象**：`const { x, y } = useMouse()` 解构，或 `reactive(useMouse())` 一次性去 `.value`
- **② 副作用自动清理**：事件监听 / 定时器 / Observer 随组件 unmount 自动移除，部分函数返回 `stop` 句柄
- **③ 响应式参数统一**：参数普遍接受 `MaybeRef` / `MaybeRefOrGetter`，内部用 `toValue()` 统一解包
- **④ `controls` 选项**：`useTimestamp()` 返回 ref，`useTimestamp({ controls: true })` 多返回 `pause` / `resume`
- **⑤ `isSupported` 模式**：实验性浏览器 API 的函数返回 `isSupported` ref，用前先判断降级
- **⑥ `configurableWindow` / `configurableDocument`**：可注入自定义 window / document，便于 iframe 与单测
- **⑦ 异步 composable 返回 PromiseLike**：如 `useFetch` 可直接 `await`，配合 `<Suspense>`

</v-clicks>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这一页是整场的「纲领」—— VueUse 200+ 函数能保持一致体验，
靠的就是这七条贯穿全库的设计约定。学会它们，任何新函数拿来就会用。

[click] 约定一 —— 返回 ref 对象。
大部分 use* 函数返回一个普通对象，对象每个属性都是 ref。
这样既能 ES6 解构（你只关心 x 就只解构 x），又保持响应性。
不想到处写 .value？用 Vue 的 reactive() 包裹，内部 ref 自动解包。
注意少数函数返回单个 ref（useStorage / useTitle），还有的返回数组（useToggle）。

[click] 约定二 —— 副作用自动清理。
VueUse 内部的 addEventListener / setInterval / IntersectionObserver
都会在组件 unmount 时自动清理，你不用手写 onUnmounted。
部分函数还返回 stop 句柄，让你在组件卸载前就主动停止。

[click] 约定三 —— 响应式参数统一，这是 VueUse 的精髓，后面有专页详讲。
参数普遍接受 MaybeRef（值或 ref）/ MaybeRefOrGetter（值、ref、或 getter），
内部用 Vue 3.3+ 的 toValue() 统一解包。

[click] 约定四 —— controls 选项。
同一个函数两种返回模式：默认返回单个 ref（用着简单），
传 { controls: true } 返回带控制方法的对象（pause / resume）。
TypeScript 会根据 controls 的值自动推导返回类型。

[click] 约定五 —— isSupported 模式。
涉及实验性 / 兼容性差的浏览器 API（navigator.share、EyeDropper、vibrate），
VueUse 额外返回一个 isSupported ref，用前必须判断、做降级。

[click] 约定六 —— configurableWindow / configurableDocument。
访问全局对象的函数允许传入自定义 window / document，
主要服务于多窗口（iframe / 弹窗）和 SSR / 单元测试场景。

[click] 约定七 —— 异步 composable 返回 PromiseLike。
useFetch 这类异步函数返回的对象是「类 Promise」的，
可以直接 await，配合 Suspense 使用。

记住这七条 —— 后面所有函数都是这七条的具体体现。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与包结构

主包 + 10 个 add-on + 无渲染组件 + Nuxt 模块

::left::

<v-click>

**安装主包（200+ composable 都在这里）**

```bash
pnpm add @vueuse/core
```

**Vue 版本要求**

| Vue 版本     | VueUse 版本       |
| ------------ | ----------------- |
| Vue 3.5+     | **v14.x（推荐）** |
| Vue 3.0–3.4  | v12.x – v13.x     |
| Vue 2.x      | v11.x（已停更）   |

</v-click>

::right::

<v-click>

**包结构总览**

```bash
@vueuse/core          # 主包，必需
@vueuse/router        # 路由参数响应式
@vueuse/integrations  # axios/jwt/fuse 等集成
@vueuse/math          # 响应式数学计算
@vueuse/motion        # 声明式动画
@vueuse/components    # 无渲染组件
@vueuse/nuxt          # Nuxt 模块，全自动导入
# 还有 rxjs/firebase/electron/
# sound/gesture/schema-org
```

> 💡 add-on 必须单独安装，装 core 不会带上。

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 安装非常简单 —— pnpm add @vueuse/core 一行命令。
VueUse 不是组件库、不需要 app.use() 注册 —— 它就是一组纯函数，
在 script setup 里直接 import 调用即可。

版本对照很关键，升级前一定要核对：
- Vue 3.5+ 用 VueUse v14.x（最新，推荐）
- Vue 3.0 到 3.4 用 v12.x 到 v13.x
- Vue 2.x 只能停在 v11.x —— 自 v12.0 起 VueUse 不再支持 Vue 2，不再获得新特性

这是 VueUse 选型时的头号注意事项 —— 老项目想升级，先看 Vue 版本。

[click] 包结构 —— VueUse 是个 monorepo：
- @vueuse/core 是主包，200+ composable 都在里面，必需
- 然后是一组 add-on，独立发布，按需安装：
  - @vueuse/router —— useRouteQuery / useRouteParams，把路由参数当响应式 ref
  - @vueuse/integrations —— 封装 axios / cookie-es / fuse.js / jwt-decode / qrcode 等第三方库
  - @vueuse/math —— useClamp / useSum / useMax 等响应式数学计算
  - @vueuse/motion —— 声明式动画与过渡（独立大型库）
  - 还有 rxjs / firebase / electron / sound / gesture / schema-org
- @vueuse/components —— 把 composable 包成无渲染组件，模板里用
- @vueuse/nuxt —— Nuxt 模块，全应用自动导入

最容易踩的坑：以为装了 core 就有 useRouteQuery —— 不是的，
@vueuse/router 是独立的包，必须单独 pnpm add，否则报 Cannot find module。
这个坑后面踩坑章节还会再讲。
-->

---
transition: fade-out
---

# 基本用法：解构 ref 与 reactive

VueUse 用法极简 —— import 一个函数、调用、用返回值

<v-click>

**约定一：返回 ref 对象，可解构**

```vue
<script setup lang="ts">
import { useMouse } from '@vueuse/core'

// 解构出来的 x / y 都是 Ref<number>
const { x, y } = useMouse()
console.log(x.value, y.value) // script 里访问需要 .value
</script>

<template>
  <p>鼠标位置：{{ x }}, {{ y }}</p>  <!-- 模板自动解包 -->
</template>
```

</v-click>

<v-click>

**约定二：用 reactive() 一次性去掉 .value**

```ts
import { reactive } from 'vue'
const mouse = reactive(useMouse())
console.log(mouse.x, mouse.y) // 直接访问，无 .value
```

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] VueUse 的用法极简 —— import 一个函数、调用它、用返回值。
但有两个核心约定必须先掌握。

约定一 —— 函数返回 ref 对象，可解构：
useMouse() 返回一个对象 { x, y }，里面的 x、y 都是 Ref<number>。
用 ES6 解构语法取出来 —— 注意，解构出来的 x、y 仍然是 ref，保持响应性。
这一点和解构 props 完全不同 —— 解构 props 会丢响应性，解构 VueUse 返回值不会。

为什么解构后还是 ref？因为 VueUse 返回的是「普通对象 + 每个属性是 ref」，
不是 reactive 对象 —— reactive 对象解构才会丢响应性。

在 script 里访问 ref 要写 .value（x.value）；
在模板里 ref 自动解包，直接写 {{ x }} 即可。

[click] 约定二 —— 用 reactive() 一次性去 .value：
如果觉得到处写 .value 麻烦，用 Vue 的 reactive() 包裹返回对象，
内部所有 ref 会被自动解包，之后访问属性不再需要 .value。

选哪种？
- 解构（const { x, y }）适合只用其中几个值的场景
- reactive() 包裹适合把整组状态当一个对象传递的场景
两种都对，看习惯。

但注意一个陷阱：reactive(useMouse()) 是对的，
但你又去解构这个 reactive 对象 const { x } = mouse —— 这就丢响应性了。
reactive 包裹后就保留 mouse.x 访问，不要再解构。这个坑踩坑章节会讲。
-->

---
transition: fade-out
---

# 副作用自动清理 + effectScope

VueUse 帮你代办「监听 + 清理」，组件外用 effectScope 兜底

<v-click>

**组件内：自动清理，无需手写 onUnmounted**

```ts
import { useEventListener, useIntervalFn } from '@vueuse/core'

useEventListener(window, 'resize', () => {})  // 卸载自动 removeEventListener
useIntervalFn(() => {}, 1000)                 // 卸载自动 clearInterval
const stop = useEventListener(document, 'keydown', onKey)
stop()  // 部分函数返回 stop 句柄，可提前停止
```

</v-click>

<v-click>

**组件外：effectScope 提供脱离组件的清理边界**

```ts
import { effectScope } from 'vue'
const scope = effectScope()
scope.run(() => {
  useEventListener(window, 'click', () => {})
  useIntervalFn(() => {}, 1000)
})
scope.stop()  // 一次性清理作用域内全部副作用
```

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 副作用自动清理是 VueUse 最实在的好处 —— 也是它消除 Bug 的核心机制。

组件内调用 VueUse 函数：
- useEventListener(window, 'resize', ...) —— 组件卸载时自动 removeEventListener
- useIntervalFn(() => {}, 1000) —— 组件卸载时自动 clearInterval
你不用写一行 onUnmounted —— VueUse 全部代办。

这解决的是 Vue 最常见的内存泄漏 Bug ——
传统写法 addEventListener 后忘了在 onUnmounted removeEventListener，
组件反复挂载卸载，监听越积越多，最后内存泄漏 / 回调重复执行。

部分函数还返回 stop 句柄 —— 让你在组件卸载前就主动停止。
比如「监听一次按键，按下后就解绑」—— const stop = useEventListener(...)，
回调里 stop() 即可。

[click] 但「自动清理」有个前提 —— 它依赖「当前组件实例」来注册 onUnmounted。
如果你在「没有组件上下文」的地方调用 VueUse 函数 ——
比如普通 JS 模块顶层、Pinia store（非 setup store）、setTimeout 回调 ——
自动清理机制就失效了，会造成内存泄漏。

解决方案是 Vue 的 effectScope() —— 它提供「脱离组件的清理边界」：
- effectScope() 创建一个作用域
- scope.run(() => {...}) 里创建的所有副作用都归这个 scope 管
- scope.stop() 一次性清理作用域内的全部副作用

effectScope 也正是 Pinia setup store 内部的实现机制 ——
所以在 Pinia setup store 里用 VueUse 函数是安全的（Pinia 帮你管了 scope）。

记住这个原则：VueUse 函数要么在 script setup / 其他 composable 内调用，
要么自己用 effectScope 包起来管理 —— 不要裸调在模块顶层。
-->

---
transition: fade-out
---

# 响应式参数：MaybeRef·MaybeRefOrGetter·toValue

理解这一点 = 理解 VueUse 的精髓

<v-click>

VueUse 函数的参数**几乎都能接收三种形态** —— 静态值、ref、getter 函数：

```ts
type MaybeRef<T> = T | Ref<T>
type MaybeRefOrGetter<T> = T | Ref<T> | (() => T)
```

</v-click>

<v-click>

以 `useTitle`（控制 `document.title`）为例，三种传参都合法：

```ts
import { useTitle } from '@vueuse/core'

useTitle('我的页面')                       // 1. 静态值
const t = ref('首页'); useTitle(t)          // 2. 传 ref，改 ref 即改标题
useTitle(() => `${route.meta.title} - 站点`) // 3. 传 getter（推荐，自动追踪依赖）
```

</v-click>

<v-click>

VueUse 内部用 Vue 3.3+ 的 `toValue()` 统一解包这三种形态：

```ts
toValue(1)        // → 1   （普通值原样返回）
toValue(ref(2))   // → 2   （ref 取 .value）
toValue(() => 3)  // → 3   （getter 调用取返回值）
```

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这一页是 VueUse 最强大、也是新人最容易困惑的设计 —— 响应式参数约定。

VueUse 文档里你会经常看到参数类型标 MaybeRef 或 MaybeRefOrGetter：
- MaybeRef<T> = T | Ref<T> —— 普通值或 ref 都行
- MaybeRefOrGetter<T> = T | Ref<T> | (() => T) —— 普通值、ref、或 getter 函数都行

看到这两个类型，你就知道「这个参数可以随便传」。

[click] 以 useTitle 为例，它控制 document.title，三种传参都合法：
- 形态一：传静态字符串 useTitle('我的页面')
- 形态二：传 ref useTitle(titleRef) —— 之后改 titleRef.value，document.title 同步更新
- 形态三：传 getter useTitle(() => `${route.meta.title} - 站点`) —— 推荐！

为什么推荐 getter 形态？
因为 getter 能让 VueUse 自动追踪响应式依赖 ——
() => route.meta.title 里只要 route 变化，标题就自动更新，无需任何额外代码。
这是最灵活的写法。

[click] VueUse 内部之所以能「随便你传什么」，靠的是 Vue 3.3 内置的 toValue() ——
它把「值 / ref / getter」统一解包成普通值：
- toValue(1) → 1，普通值原样返回
- toValue(ref(2)) → 2，ref 取 .value
- toValue(() => 3) → 3，getter 调用取返回值

注意 toValue 和早期的 unref 区别 —— unref 不解包 getter，toValue 解包。

最佳实践：你自己写 composable 时，参数也声明成 MaybeRefOrGetter<T>，
内部用 toValue() 解包 —— 这样你的 composable 就能无缝融入 VueUse 生态，
调用方传值、传 ref、传 getter 都行。

理解了这一点，你就理解了 VueUse —— 这套约定贯穿全库 200+ 函数。
-->

---
transition: fade-out
---

# 自动导入：免写 import

200+ 函数手写 import 太繁琐 —— 让插件代办

<v-click>

**Vite / Webpack 项目：unplugin-auto-import**

```ts
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vue', '@vueuse/core'],  // VueUse 全部函数自动导入
      dts: 'src/auto-imports.d.ts',      // 生成 TS 类型声明
    }),
  ],
})
```

</v-click>

<v-click>

**Nuxt 项目：@vueuse/nuxt 官方模块，零配置**

```ts
// nuxt.config.ts —— npx nuxt module add vueuse
export default defineNuxtConfig({ modules: ['@vueuse/nuxt'] })
```

```vue
<script setup lang="ts">
const isDark = useDark()        // 无需 import，直接用
</script>
```

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] VueUse 有 200+ 函数，每个文件都手写
import { useMouse, useDark, useStorage } from '@vueuse/core' 会很啰嗦。
VueUse 提供 preset 配合自动导入插件，写下函数名就能直接用。

Vite / Webpack 项目用 unplugin-auto-import：
- 先 pnpm add -D unplugin-auto-import
- 在 vite.config.ts 里配 AutoImport 插件
- imports 数组里写 'vue' 和 '@vueuse/core' ——
  这样 Vue 的 ref/computed/watch 和 VueUse 的所有 composable 都自动导入
- dts 选项生成类型声明文件 src/auto-imports.d.ts，让 Volar / TypeScript 识别这些全局函数

注意两个细节：
- 生成的 auto-imports.d.ts 建议提交到仓库 —— 避免 CI 首次构建报 TS 错误
- 记得把它加进 tsconfig.json 的 include，并在 ESLint 配置里配好，
  否则 ESLint 会报 no-undef（因为它看不到 import）

add-on 也可以加进 imports 数组，比如 '@vueuse/math'。

[click] Nuxt 项目更简单 —— 用官方的 @vueuse/nuxt 模块，零配置：
- pnpm add -D @vueuse/nuxt @vueuse/core
- 或者直接 npx nuxt module add vueuse —— 它会自动写入 nuxt.config.ts
- 在 nuxt.config.ts 的 modules 数组加 '@vueuse/nuxt'

配好后，整个 Nuxt 应用的 .vue 文件和 composables/ 目录里，
都能直接写 useDark()、useMouse() —— 完全无需 import，零样板。

这是 Nuxt 项目用 VueUse 的标准做法 —— 体验非常顺滑。
-->

---
transition: fade-out
---

# 12 大分类速览

200+ 函数按场景分 12 类 —— 记住分类就能快速定位

<v-click>

| 分类           | 用途             | 代表函数                                   |
| -------------- | ---------------- | ------------------------------------------ |
| **State**      | 持久化 / 共享状态 | `useStorage` `createGlobalState` `useRefHistory` |
| **Elements**   | DOM 元素观察操作 | `useElementSize` `useIntersectionObserver` `useDraggable` |
| **Browser**    | 浏览器 API 封装  | `useDark` `useClipboard` `useEventListener` |
| **Sensors**    | 用户输入 / 传感   | `useMouse` `useScroll` `onClickOutside`     |
| **Network**    | 网络请求         | `useFetch` `useWebSocket` `useEventSource`  |

</v-click>

<v-click text-xs class="mt-1">

> 💡 另有 Watch / Reactivity / Utilities / Animation / Component / Array / Time 七类。命名规律：`use*` 返回状态、`on*` 注册事件回调、`create*` 工厂函数。

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 200+ 函数听起来吓人，但 VueUse 把它们分成 12 大类 ——
熟悉分类，你就能快速定位需要的工具。

表格里列了 8 个最常用的分类：
- State：跨组件 / 持久化状态 —— useStorage 本地存储、createGlobalState 全局共享、
  useRefHistory 撤销重做、useAsyncState 异步状态
- Elements：DOM 元素观察与操作 —— useElementSize 尺寸、useIntersectionObserver 视口检测、
  useDraggable 拖拽
- Browser：浏览器 API 封装，这是最大的一类（41 个）—— useDark 暗色、useClipboard 剪贴板、
  useEventListener 事件监听、useBreakpoints 断点
- Sensors：用户输入 / 设备传感，函数最多的一类（52 个）—— useMouse 鼠标、useScroll 滚动、
  onClickOutside 点击外部、useMagicKeys 快捷键
- Network：网络请求，只有 3 个但都很强 —— useFetch、useWebSocket、useEventSource
- Watch：增强的 watch（11 个）—— watchDebounced 防抖、until 异步等待、whenever 值为真触发
- Reactivity：响应式工具（16 个）—— refDebounced、computedAsync 异步计算、syncRef 同步
- Utilities：通用工具（20 个）—— useToggle 切换、useDebounceFn 防抖、useEventBus 事件总线

[click] 此外还有四类没列进表格 ——
Animation（动画定时）、Component（组件辅助）、Array（响应式数组）、Time（日期时间）。

最后讲命名规律 —— 记住这个比记函数名更有用：
- use* 开头：返回响应式状态的 composable，生命周期内有效，如 useMouse
- on* 开头：注册事件型回调，如 onClickOutside、onKeyStroke、onLongPress
- create* 开头：工厂函数，返回另一个可复用的函数 / state，如 createGlobalState、createFetch
- try* 开头：在「可能没有组件上下文」的场景下安全调用，如 tryOnMounted

看到函数名前缀，就大致知道它的行为模式。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# State：useStorage·useLocalStorage

把 ref 与 localStorage 双向绑定 —— 刷新不丢、跨标签页同步

::left::

<v-click>

**类型按默认值自动推断**

```ts
import { useStorage } from '@vueuse/core'

// 字符串 → string
const name = useStorage('name', 'Tom')
// 数字 → number，自动 parseFloat
const count = useStorage('count', 0)
// 对象 → 自动 JSON 序列化
const cfg = useStorage('cfg', {
  theme: 'light', fontSize: 14,
})
cfg.value.fontSize = 16  // 自动写入
name.value = null        // null = 删除该 key
```

</v-click>

::right::

<v-click>

**预设简写 + 关键选项**

```ts
import {
  useLocalStorage, useSessionStorage,
} from '@vueuse/core'

const token = useLocalStorage('token', '')
const draft = useSessionStorage('draft', {})

useStorage('cfg', { theme: 'light' },
  localStorage, {
  mergeDefaults: true,   // 新字段合并进旧数据
  deep: true,            // 深度监听
  listenToStorageChanges: true, // 跨标签同步
})
```

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] useStorage 是 VueUse 的旗舰函数之一 ——
它把一个 ref 与 localStorage / sessionStorage 双向绑定：
值变化自动写入存储、刷新页面自动读回、跨标签页自动同步。

它最贴心的地方是「类型按默认值自动推断」：
- 传字符串，推断 string，原样存
- 传数字，推断 number，读回时自动 parseFloat
- 传布尔，推断 boolean
- 传对象，推断 object，自动 JSON 序列化
- 连 Map / Set / Date 都能正确序列化

读写就像普通 ref：cfg.value.fontSize = 16 自动写入 localStorage。
特殊点：name.value = null 表示从 storage 中删除该 key（RemovableRef 的语义）。

[click] useLocalStorage 和 useSessionStorage 是预设了 storage 参数的简写 ——
useLocalStorage('token', '') 等价于 useStorage('token', '', localStorage)。

关键选项里，mergeDefaults 最重要 ——
假设你上线时默认值是 { theme }，用户 localStorage 里存了旧数据；
下个版本你加了 fontSize 字段。
不开 mergeDefaults，老用户读出来的对象没有 fontSize；
开了之后 VueUse 会把新默认值浅合并进旧数据 —— 升级配置结构时这个选项是救命的。

其他选项：
- deep：深度监听对象 / 数组内部变化（默认 true）
- listenToStorageChanges：监听 storage 事件，跨标签页同步（默认 true）—— 
  一个标签页改了，另一个标签页自动更新

还有个陷阱：默认值是 null 时 TS 推断不出类型 ——
要显式传泛型 useStorage<User | null>('user', null)，
必要时用 StorageSerializers.object 指定序列化器。这个坑后面会再讲。
-->

---
transition: fade-out
---

# State：createGlobalState·useRefHistory

跨组件共享状态 + 撤销重做

<v-click>

**createGlobalState —— 把 composable 变全局单例**

```ts
import { createGlobalState, useStorage } from '@vueuse/core'

export const useGlobalUser = createGlobalState(() => {
  // 这段逻辑只执行一次，结果被所有调用方共享
  const token = useStorage('token', '')
  const isLoggedIn = computed(() => !!token.value)
  return { token, isLoggedIn }
})
```

</v-click>

<v-click>

**useRefHistory —— 追踪 ref 变更，自带 undo / redo**

```ts
const text = ref('')
const { undo, redo, canUndo, canRedo, history } = useRefHistory(text, {
  deep: true, capacity: 50,  // 深度追踪 + 最多 50 条历史
})
```

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] createGlobalState 解决的是「跨组件共享状态」——
它把一个 composable 变成「全局单例」，所有组件拿到的是同一份状态。

用法：把你的状态逻辑写在 createGlobalState(() => {...}) 的回调里。
这段回调只执行一次，结果被所有调用方共享 ——
第一个组件调用 useGlobalUser() 时初始化，后面所有组件拿到的都是同一份。

它是「不想引入 Pinia」时的轻量方案 —— 适合小项目、或简单的全局状态。
配合 useStorage 还能让全局状态天然持久化。

什么时候还是用 Pinia？需要 devtools 调试、需要插件、需要模块化时 —— Pinia 更专业。
createGlobalState 是「够用就好」的轻量选择。

相关函数 createSharedComposable —— 和 createGlobalState 类似，
但当所有引用方都卸载后会自动销毁并清理副作用，下次再调用重新初始化。
适合包裹 useMouse 这类带副作用的函数，避免重复注册监听。

还有 createInjectionState —— 把 provide / inject 封装成一对类型安全的 hook，
用于「父组件提供、后代组件消费」的场景。

[click] useRefHistory 解决「撤销 / 重做」—— 做编辑器、表单草稿很方便。
它追踪一个 ref 的变更历史，返回 undo / redo / canUndo / canRedo / history / clear。
- deep: true 深度追踪对象 / 数组内部变化
- capacity: 50 最多保留 50 条历史，防止内存膨胀

衍生函数：
- useDebouncedRefHistory —— 防抖记录，连续输入只记一次（适合文本框）
- useThrottledRefHistory —— 节流记录
- useManualRefHistory —— 手动调 commit() 才记录

做一个带撤销功能的富文本编辑器，useRefHistory 几乎是开箱即用。
-->

---
transition: fade-out
---

# Network：useFetch（一）基础 + 链式方法

对原生 fetch 的响应式封装 —— URL 可响应式、可取消、链式 API

<v-click>

**基础用法 —— data / error 都是响应式 ref**

```vue
<script setup lang="ts">
import { useFetch } from '@vueuse/core'
const { data, error, isFetching, isFinished, statusCode } = useFetch(
  'https://api.example.com/users',
)
</script>

<template>
  <p v-if="isFetching">请求中...</p>
  <pre v-else>{{ data }}</pre>
</template>
```

</v-click>

<v-click>

**链式 API —— 指定 HTTP 方法 + 响应解析方式**

```ts
const { data } = useFetch('/api/users').get().json<User[]>()
const r = useFetch('/api/users').post({ name: 'Anthony' }).json()
useFetch(`/api/users/${id}`).put({ name: 'New' }).json()
useFetch(`/api/users/${id}`).delete()
// 解析方式：.json() / .text() / .blob() / .arrayBuffer()
```

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] useFetch 是 VueUse 最强大的函数之一 ——
对原生 fetch 的响应式封装：URL 可响应式、支持自动重发、拦截器、可取消、链式 API。

基础用法 —— 一调用就立即发起请求，返回的全是响应式 ref：
- data：响应体（按解析方式解出来的数据）
- error：请求错误
- isFetching：是否请求中
- isFinished：是否已结束
- statusCode：HTTP 状态码
还有 response（原始 Response）、canAbort、aborted、abort、execute 等。

模板里直接用这些 ref 做状态展示 —— v-if="isFetching" 显示加载、
v-else 显示 data。

注意一个关键点：data 在请求完成前是 null ——
模板里务必判空，或配合 isFetching 一起用，否则会渲染出 null。

[click] 链式 API 是 useFetch 的特色写法 —— 指定 HTTP 方法 + 响应解析方式：
- .get().json<User[]>() —— GET 请求 + JSON 解析，泛型标注 data 类型
- .post({ name: 'Anthony' }).json() —— POST 携带请求体
- .put(...).json() / .delete() —— PUT / DELETE / PATCH
- 响应解析方式：.json() / .text() / .blob() / .arrayBuffer() / .formData()

这种链式写法可读性很好 —— useFetch(url).post(body).json() 一眼看懂是
「POST 这个 url，带 body，期望 JSON 响应」。

泛型在链式末尾传 —— .json<User[]>()，这样 data 就被推导成 Ref<User[] | null>。

useFetch 适合中小项目 —— 复杂数据层（缓存、依赖、SWR）建议上 TanStack Query。
但日常 80% 的接口请求场景，useFetch 完全够用。
-->

---
transition: fade-out
---

# Network：useFetch（二）createFetch + 钩子

创建带预设的实例 + 拦截器钩子

<v-click>

**createFetch —— 项目统一配置的 fetch 实例（类似封装 axios）**

```ts
// utils/request.ts
import { createFetch } from '@vueuse/core'

export const useApi = createFetch({
  baseUrl: 'https://api.example.com',
  options: {
    beforeFetch({ options }) {  // 自动注入鉴权头
      const token = localStorage.getItem('token')
      if (token) options.headers = {
        ...options.headers, Authorization: `Bearer ${token}`,
      }
      return { options }
    },
  },
})
// 业务里：baseUrl 与鉴权头已自动带上
const { data } = useApi('/users').get().json<User[]>()
```

</v-click>

<v-click>

> 💡 三个拦截钩子：`beforeFetch`（请求前改 options）/ `afterFetch`（响应后解包数据）/ `onFetchError`（出错改写 error）。响应式 URL 自动重发需开 `refetch: true`。

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 实际项目里你不会每个接口都裸用 useFetch ——
而是用 createFetch 创建一个「带预设的实例」，类似封装 axios 实例。

createFetch 配置：
- baseUrl：基础 URL，业务里只写相对路径
- options.beforeFetch：请求前的钩子，最常见的用途是注入鉴权头 ——
  从 localStorage 取 token，塞进 Authorization header
- fetchOptions：默认的 fetch 选项，比如统一的 Content-Type
- combination：'chain'（默认，实例钩子和调用处钩子都执行）
  或 'overwrite'（调用处覆盖实例钩子）

配好后，业务里用 useApi('/users').get().json() ——
baseUrl 和鉴权头都自动带上，干净利落。

这是 VueUse 项目里 HTTP 层的标准封装模式 —— 一处配置、全局复用。

[click] 三个拦截钩子的分工：
- beforeFetch({ url, options, cancel }) —— 请求前。
  改写 options（注入 header）、甚至 cancel() 直接取消请求（比如没 token 就别发了）
- afterFetch(ctx) —— 响应成功后。
  最常见用途是解包后端统一结构 —— 后端返回 { code, data }，
  在 afterFetch 里把 ctx.data 改成 ctx.data.data，业务层只拿到纯数据
- onFetchError(ctx) —— 出错时。可以改写 ctx.error / ctx.data，统一错误提示

还有几个能力补充：
- 响应式 URL：URL 传 ref / computed 时，URL 变化「不会自动重发」——
  必须显式开 refetch: true 才会。这是高频踩坑点。
- 手动触发：传 immediate: false，然后手动调 execute()
- 取消与超时：传 timeout: 5000 五秒自动取消，或手动 abort()
- 可 await：在 Suspense 包裹的组件里可直接 await useFetch(...).get().json()
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 元素：useElementSize·useIntersectionObserver

DOM 元素的尺寸观察与视口检测

::left::

<v-click>

**useElementSize —— 响应式元素尺寸**

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useElementSize } from '@vueuse/core'

const box = useTemplateRef('box')
// 基于 ResizeObserver
const { width, height } = useElementSize(box)
</script>

<template>
  <div ref="box">
    {{ width }} × {{ height }}
  </div>
</template>
```

</v-click>

::right::

<v-click>

**useIntersectionObserver —— 进入/离开视口**

```ts
const target = useTemplateRef('target')
const isVisible = ref(false)

useIntersectionObserver(
  target,
  ([entry]) => {
    isVisible.value =
      entry?.isIntersecting ?? false
  },
  { threshold: 0.5,
    rootMargin: '0px 0px 100px 0px' },
)
```

> 💡 上层封装 `useElementVisibility` 直接返回 `isVisible`。

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Elements 分类的函数都围绕「观察 DOM 元素」——
传入一个元素 ref，返回响应式的尺寸 / 位置 / 可见性。

useElementSize 给你元素的响应式尺寸 —— width、height。
它底层基于 ResizeObserver，元素尺寸一变，width / height 自动更新。

注意元素 ref 的拿法 —— 用 Vue 3.5 的 useTemplateRef('box')，
模板里写 ref="box"。
（早期写法是 ref(null) + ref="box"，3.5 后推荐 useTemplateRef。）

典型场景：响应式布局、根据容器尺寸动态调整内容、画布自适应。

相关函数 useElementBounding —— 给你元素相对视口的位置
（top、left、right、bottom、x、y），是 getBoundingClientRect 的响应式版。

[click] useIntersectionObserver 检测元素「进入 / 离开视口」——
这是懒加载、滚动曝光埋点、无限滚动的底层能力。

用法：传入目标元素 ref、一个回调、和选项。
回调的参数是 IntersectionObserver 的 entries，
entry.isIntersecting 表示元素是否在视口内。

两个关键选项：
- threshold: 0.5 —— 元素 50% 可见时才触发回调
- rootMargin: '0px 0px 100px 0px' —— 提前 100px 触发，
  常用于「图片提前预加载」—— 元素还没真正进视口就开始加载

如果你只想要一个「是否可见」的布尔值，不想写回调 ——
用上层封装 useElementVisibility，它直接返回 isVisible ref。

同类还有 useResizeObserver（尺寸变化，useElementSize 的底层）
和 useMutationObserver（监听 DOM 属性 / 子节点变化）。
-->

---
transition: fade-out
---

# 传感器：useMouse·useScroll·onClickOutside

捕捉用户输入 —— 鼠标坐标、滚动状态、点击外部

<v-click>

**useMouse / useScroll —— 鼠标坐标 + 滚动状态（可读可写）**

```ts
const { x, y, sourceType } = useMouse()  // 全局鼠标坐标

const el = useTemplateRef('scroller')
const { x: sx, y: sy, isScrolling, arrivedState, directions }
  = useScroll(el, { behavior: 'smooth' })
sy.value = 0  // 写入即触发滚动（双向）
```

</v-click>

<v-click>

**onClickOutside —— 点击元素外部（下拉菜单/弹层关闭标配）**

```ts
const dropdown = useTemplateRef('dropdown')
const open = ref(false)
onClickOutside(dropdown, () => { open.value = false }, {
  ignore: ['.toggle-button'],  // 忽略某些元素，点它们不算「外部」
})
```

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Sensors 是 VueUse 函数最多的一类（52 个）——
专门捕捉「用户输入 / 设备传感」。这页讲三个最常用的。

useMouse 给你全局鼠标坐标 —— x、y，还有 sourceType（mouse / touch / pen）。
内部的 mousemove 监听随组件卸载自动清理。
典型场景：自定义光标效果、跟随鼠标的提示、画布交互。

useScroll 给你元素的滚动状态，而且是「双向」的 —— 可读可写：
- x、y：当前滚动位置
- isScrolling：是否正在滚动中
- arrivedState：{ left, right, top, bottom } —— 是否滚到了边界（做「回到顶部」按钮很有用）
- directions：当前滚动方向（向上还是向下，做「下滑隐藏导航栏」）
写入 sy.value = 0 即触发滚动 —— 配合 behavior: 'smooth' 平滑滚动。

[click] onClickOutside 是「点击元素外部」—— 下拉菜单、弹层、抽屉
「点外面就关闭」的标准方案。

用法：传入元素 ref 和回调，点击该元素外部时回调触发。
关键选项 ignore —— 传入选择器数组，点这些元素不算「外部」。
经典场景：你有个「切换按钮」控制下拉菜单显隐，
如果不 ignore 这个按钮，点按钮会同时触发「打开」和「点外部关闭」——
菜单永远打不开。把按钮加进 ignore 就解决了。

注意 onClickOutside 是 on* 前缀 —— 它是「注册事件回调」型函数，不返回状态。

Sensors 里还有很多好东西：
useMagicKeys（快捷键组合，比如 Ctrl+S）、useInfiniteScroll（无限滚动）、
useGeolocation（地理位置）、onKeyStroke（按键监听）、onLongPress（长按）。
-->

---
transition: fade-out
---

# 拖拽：useDraggable

让任意元素可拖拽 —— 一个函数搞定

<v-click>

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useDraggable } from '@vueuse/core'

const el = useTemplateRef('el')
const handle = useTemplateRef('handle')

const { x, y, style, isDragging } = useDraggable(el, {
  initialValue: { x: 40, y: 40 },
  handle,             // 只有拖 handle 才能移动
  // axis: 'x' / 'y' / 'both'  限制拖拽方向
})
</script>

<template>
  <div ref="el" :style="style" class="card">
    <div ref="handle" class="card__handle">⠿ 拖我</div>
    内容（{{ isDragging ? '拖拽中' : '静止' }}）
  </div>
</template>
```

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] useDraggable 是 Elements 分类里一个特别实用的函数 ——
让任意元素变得可拖拽，一个函数搞定，不需要引入专门的拖拽库。

用法：
- 传入要拖拽的元素 ref
- 返回 x、y（当前位置）、style（可直接绑到元素的 style）、isDragging（是否拖拽中）

关键选项：
- initialValue: { x: 40, y: 40 } —— 初始位置
- handle —— 传入一个「拖拽手柄」元素 ref，只有拖这个 handle 才能移动整个元素。
  这是做「对话框只能拖标题栏」「卡片只能拖某个角」的标准做法
- axis —— 限制拖拽方向，'x' 只能水平拖、'y' 只能垂直拖、'both' 任意方向

模板里把返回的 style 绑到元素上 —— :style="style" ——
VueUse 帮你算好 position / transform，元素就跟着鼠标走。

isDragging 可以用来做拖拽时的视觉反馈 —— 比如拖拽中加阴影、变半透明。

典型场景：
- 可拖拽的浮窗 / 对话框
- 看板（Kanban）卡片
- 自定义播放器的进度条 / 音量条
- 可调整位置的工具面板

相关配套函数：
- useDropZone —— 拖放区域，可接收拖入的文件
- useElementHover —— 元素 hover 状态
- useSortable（在 @vueuse/integrations）—— 列表排序拖拽

useDraggable 的好处是「零依赖、自动清理」—— 比自己手写
mousedown + mousemove + mouseup 干净太多，也不会漏清理监听。
-->

---
transition: fade-out
---

# 浏览器：useDark·useColorMode

做暗黑模式的首选 —— 尊重系统偏好、持久化、自动切 class

<v-click>

**useDark —— 布尔 ref，读系统偏好、写持久化、切 html class**

```ts
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark({
  selector: 'html',                  // class 挂在哪个元素
  valueDark: 'dark', valueLight: '', // 暗/亮时的 class 值
  storageKey: 'vueuse-color-scheme', // localStorage key
})
const toggleDark = useToggle(isDark)
```

</v-click>

<v-click>

**useColorMode —— 进阶版，支持 auto / light / dark 三态 + 自定义主题**

```ts
const mode = useColorMode({
  modes: { cafe: 'theme-cafe', ocean: 'theme-ocean' },  // 扩展自定义主题
})
mode.value = 'dark'  // 'auto' | 'light' | 'dark' | 'cafe' | 'ocean'
```

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] useDark 是做暗黑模式的首选 —— 几乎所有 Vue 3 项目的暗色切换都用它。

它返回一个布尔 ref，但这个 ref 不只是个开关 —— 它做了三件事：
- 读取时尊重系统偏好（prefers-color-scheme）
- 写入时持久化到 localStorage
- 自动切换 <html> 元素上的 class（默认加 / 去 'dark' class）

也就是说，你的 CSS 只要写 .dark { ... } 选择器，
isDark 切到 true，VueUse 自动给 html 加 'dark' class，整站暗色生效。

选项：
- selector：class 挂在哪个元素，默认 'html'
- attribute：用 class 还是 data 属性
- valueDark / valueLight：暗色 / 亮色时的值
- storageKey：localStorage 的 key，默认 'vueuse-color-scheme'

配合 useToggle 包成切换函数 —— const toggleDark = useToggle(isDark)，
按钮 @click="toggleDark()" 就能切。

[click] useColorMode 是 useDark 的进阶版 ——
useDark 只有亮 / 暗两态，useColorMode 支持 auto / light / dark 三态，
甚至能扩展自定义主题。

modes 选项里可以加自定义主题 —— cafe、ocean 等，
每个对应一个 class 名。mode.value 就能是这些值之一。

useColorMode 还区分两个概念：
- store：用户的选择（含 auto）
- state：实际生效的模式（auto 被解析成 light 或 dark）

什么时候用哪个？
- 只要亮 / 暗切换 → useDark
- 要「跟随系统」选项（auto），或要多套主题 → useColorMode

注意一个高频坑 —— useDark 首屏闪烁（FOUC）：
刷新页面瞬间先显示亮色再跳暗色，因为 JS 执行在首屏渲染之后。
解决方法是在 index.html 的 head 里加一段内联脚本，
在框架加载前就同步把 class 设好。这个踩坑章节会再讲。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 浏览器：useClipboard·useBreakpoints·useEventListener

剪贴板 / 响应式断点 / 自动清理的事件监听

::left::

<v-click>

**useClipboard —— 剪贴板读写**

```ts
const source = ref('要复制的文本')
const { text, copy, copied, isSupported }
  = useClipboard({ source, copiedDuring: 1500 })
// copy() 复制，copied 短暂为 true
```

**useEventListener —— 自动清理监听**

```ts
useEventListener(window, 'resize', onResize)
// 卸载自动 removeEventListener
const stop = useEventListener(
  document, 'keydown', onKey,
)
```

</v-click>

::right::

<v-click>

**useBreakpoints —— 响应式断点**

```ts
import {
  useBreakpoints, breakpointsTailwind,
} from '@vueuse/core'

const bp = useBreakpoints(breakpointsTailwind)

const isMobile = bp.smaller('md')
const isDesktop = bp.greaterOrEqual('lg')
const current = bp.active()

// 自定义断点
const cbp = useBreakpoints({
  mobile: 0, tablet: 640, desktop: 1024,
})
```

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这页讲 Browser 分类的另外三个高频函数。

useClipboard —— 剪贴板读写：
- 传入 source（要复制的内容）
- 返回 copy（复制方法）、copied（复制后短暂为 true 的状态）、
  text（剪贴板当前内容）、isSupported（能力探测）
- copiedDuring 选项控制 copied 状态保持多久（毫秒）

典型用法：「复制链接」按钮，点击后按钮文字变成「已复制!」，1.5 秒后变回。
copied 这个状态就是为这个体验设计的。
isSupported 是 isSupported 模式的典型 —— 剪贴板 API 不是所有环境都支持，用前判断。

useEventListener —— 自动清理的事件监听：
比手写 addEventListener + onUnmounted removeEventListener 干净太多。
- 可以监听 window、document、或元素 ref
- 监听元素 ref 时，元素变化会自动重新绑定
- 组件卸载时自动 removeEventListener
- 返回 stop 句柄，可提前解绑

这是 VueUse 最基础、也最常用的函数之一 ——
很多其他 VueUse 函数内部也是用它实现的。

[click] useBreakpoints —— 响应式断点，做响应式布局的利器：
- 内置预设：breakpointsTailwind、breakpointsBootstrapV5、breakpointsAntDesign 等
- 传入预设后，返回一个断点对象，提供查询方法：
  - smaller('md') —— 小于 md 断点（返回响应式布尔 ref）
  - greaterOrEqual('lg') —— 大于等于 lg
  - active() —— 当前激活的断点名
- 也可以传自定义断点对象 { mobile: 0, tablet: 640, desktop: 1024 }

返回的都是响应式 ref —— 窗口大小变化时自动更新，
你在模板里 v-if="isMobile" 就能做响应式渲染，比手写 matchMedia 干净。

为什么用 useBreakpoints 而不是纯 CSS 媒体查询？
CSS 媒体查询只能控制样式，useBreakpoints 能在 JS 逻辑里用 ——
比如「移动端加载简化版组件」「桌面端才初始化某个功能」。
-->

---
transition: fade-out
---

# Watch 增强：watchDebounced·until·whenever

在原生 watch 之上加防抖、节流、异步等待能力

<v-click>

**watchDebounced / watchThrottled —— 防抖 / 节流的 watch**

```ts
// 搜索框停止输入 500ms 后才触发，maxWait 防止一直输入永不触发
watchDebounced(searchText, (v) => fetchResults(v),
  { debounce: 500, maxWait: 2000 })

watchThrottled(scrollY, (v) => updateBar(v), { throttle: 300 })
```

</v-click>

<v-click>

**until —— 把「等待响应式条件成立」变成可 await 的 Promise**

```ts
await until(isLoading).toBe(false)        // 等 isLoading 变 false
await until(count).toMatch((n) => n > 10, { timeout: 5000 })
```

</v-click>

<v-click>

**whenever —— 值为真时才执行（watch 的简写）**

```ts
whenever(isReady, () => { console.log('就绪，开始初始化') })
```

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Watch 分类有 11 个增强版 watch —— 在 Vue 原生 watch 之上
加了防抖、节流、暂停、异步等待等能力。它们的签名和原生 watch 基本一致，
但都返回 stop 函数。

watchDebounced —— 防抖的 watch：
最经典场景就是搜索框 —— 用户连续打字时不发请求，
停止输入 500ms 后才触发回调。
debounce 选项是延迟时间，maxWait 是「最长等待」——
防止用户一直输入永不停顿导致回调永不触发。

watchThrottled —— 节流的 watch：
滚动、resize 这类高频事件，每 300ms 最多触发一次。

注意一个踩坑点 —— watchDebounced 的 options 在原生 watch 的
{ immediate, deep, flush } 之外，多了 debounce / maxWait。
如果你漏传 debounce，watchDebounced 就退化成普通 watch 了 ——
一定要明确传入增强选项。

[click] until —— 把「等待响应式条件成立」变成可 await 的 Promise。
这个函数非常优雅 —— 它把「轮询等待某个状态」这种丑陋的逻辑变成一行 await。

- await until(isLoading).toBe(false) —— 等 isLoading 变成 false 再继续
- 还支持 toBeTruthy / toBeNull / toMatch / changed
- toMatch 可以传自定义判断函数，还能传 timeout 超时

典型场景：「等某个异步初始化完成再执行下一步」——
传统写法要写轮询或回调嵌套，until 一行 await 搞定。

[click] whenever —— 「值为真时才执行」的 watch 简写。
等价于 watch(source, (v) => { if (v) {...} })，
但写起来更简洁 —— whenever(isReady, () => {...})。
只在 isReady 变成真值时触发回调。

其他 Watch 增强：
- watchPausable —— 可暂停 / 恢复的 watch
- watchIgnorable —— 程序内部改值时可忽略，避免 watch 回环
- watchOnce —— 只触发一次后自动 stop
- watchAtMost —— 最多触发 N 次
- watchTriggerable —— 返回 trigger() 可手动触发
-->

---
transition: fade-out
---

# Reactivity：refDebounced·computedAsync·syncRef

响应式工具 —— 产出新 ref、异步计算、ref 同步

<v-click>

**refDebounced —— 产出一个防抖的 ref 副本**

```ts
const input = ref('')
const debounced = refDebounced(input, 500)  // 滞后 input 500ms
watchEffect(() => fetchResults(debounced.value))
```

</v-click>

<v-click>

**computedAsync —— 异步计算属性（computed 不能用异步函数）**

```ts
const user = computedAsync(async () => {
  const res = await fetch(`/api/users/${userId.value}`)
  return res.json()
}, null)  // 第二参数是计算完成前的初始值
```

</v-click>

<v-click>

**syncRef —— 双向 / 单向同步两个 ref**

```ts
syncRef(a, b, { direction: 'both' })  // 也可 'ltr' / 'rtl'
```

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Reactivity 分类有 16 个「响应式工具」——
它们不是封装浏览器 API，而是「操作响应式数据本身」。

refDebounced —— 注意它和 watchDebounced 的区别：
- watchDebounced 是「防抖地执行一个回调」
- refDebounced 是「产出一个新的 ref」，这个 ref 的值是源 ref 的防抖副本

用法：const debounced = refDebounced(input, 500) ——
debounced 这个 ref 会滞后 input 500ms 更新。
然后你可以把 debounced 当作搜索条件的依赖 ——
watchEffect 里用 debounced.value，或直接绑到 computed。

什么时候用 refDebounced 而不是 watchDebounced？
当你想要一个「防抖后的值」可以被多处复用时 —— refDebounced 产出值，更灵活。
对应还有 refThrottled（节流的 ref）。

[click] computedAsync —— 异步计算属性。
Vue 原生的 computed 不能用异步函数 —— getter 必须同步返回。
computedAsync 突破了这个限制：
- 传入一个 async 函数
- 第二个参数是「计算完成前的初始值」
- 函数里用到的响应式数据变化时，自动重新计算

典型场景：「根据某个 id 异步查详情」——
userId 变了，user 自动重新请求。比手写 watch + ref 干净。

[click] syncRef —— 同步两个 ref 的值：
- direction: 'both' 双向同步，改任意一个另一个跟着变
- 'ltr' 左到右，'rtl' 右到左 —— 单向同步
对应 syncRefs 可以「单源同步到多个目标」。

其他 Reactivity 工具：
- refAutoReset —— 一段时间后自动恢复默认值（适合「复制成功」提示这种临时状态）
- refDefault —— 值为 null 时返回默认值
- toReactive —— 把 ref<对象> 转成 reactive 对象
- reactify —— 把普通函数变成「参数 / 返回值都响应式」的函数
- reactivePick / reactiveOmit —— 响应式地挑选 / 排除对象字段
-->

---
transition: fade-out
---

# Utilities：useToggle·useDebounceFn·useEventBus·useCycleList

通用工具 —— 切换、防抖函数、事件总线、循环列表

<v-click>

```ts
import {
  useToggle, useDebounceFn, useEventBus, useCycleList,
} from '@vueuse/core'

// useToggle —— 布尔切换，返回 [值, 切换函数]
const [isOpen, toggleOpen] = useToggle(false)
toggleOpen()       // 取反
toggleOpen(true)   // 指定值

// useDebounceFn —— 防抖「函数」（不是 watch）
const debouncedSave = useDebounceFn(() => save(), 1000)

// useEventBus —— 类型安全的全局事件总线
const bus = useEventBus<string>('notification')
bus.on((msg) => console.log(msg))  // 订阅（卸载自动取消）
bus.emit('hello')                  // 发布

// useCycleList —— 在列表中循环切换
const { state, next, prev } = useCycleList(['light', 'dark', 'auto'])
next()  // 切到下一个，到末尾回开头
```

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Utilities 是「通用工具」类（20 个）—— 不属于浏览器 API、不属于响应式工具，
就是日常开发的实用小函数。这页讲四个最常用的。

useToggle —— 布尔切换：
返回一个数组 [值, 切换函数] —— 这是按 React 习惯设计的，方便重命名。
- const [isOpen, toggleOpen] = useToggle(false)
- toggleOpen() 取反
- toggleOpen(true) 指定值
做对话框开关、折叠面板、显隐控制 —— 比手写 ref + 函数省事。
前面 useDark 配合的 useToggle(isDark) 就是它。

useDebounceFn —— 防抖「函数」：
注意它和 watchDebounced / refDebounced 的区别 ——
useDebounceFn 是包装一个「函数」，让这个函数被防抖调用。
const debouncedSave = useDebounceFn(() => save(), 1000) ——
debouncedSave 被频繁调用时，只有最后一次在 1 秒后真正执行 save。
对应还有 useThrottleFn（节流函数）。

什么时候用哪个防抖？
- 防抖一个「函数调用」（按钮点击、输入框 input 事件）→ useDebounceFn
- 防抖地「响应数据变化」→ watchDebounced
- 想要一个「防抖后的值」→ refDebounced

useEventBus —— 类型安全的全局事件总线：
- useEventBus<string>('notification') 创建一个 bus
- bus.on(callback) 订阅 —— 组件卸载时自动取消订阅
- bus.emit(payload) 发布
泛型保证 emit 和 on 的 payload 类型一致。
适合「跨组件通信但不值得上 Pinia」的轻量场景 ——
比如「详情页保存成功后，通知列表页刷新」。

useCycleList —— 在列表中循环切换：
- useCycleList(['light', 'dark', 'auto'])
- next() 切下一个，到末尾自动回开头；prev() 切上一个
- state 是当前值
做轮播、主题循环切换很方便。

其他 Utilities：useCounter（带边界的计数器）、useStepper（多步表单 / 向导）、
useMemoize（结果缓存）、useCloned（深克隆 ref）、useConfirmDialog（确认对话框状态机）。
-->

---
transition: fade-out
---

# Component：useVModel·createReusableTemplate·useVirtualList

组件辅助 —— 双向绑定、模板复用、虚拟列表

<v-click>

**createReusableTemplate —— 同组件内复用模板片段**

```vue
<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'
const [DefineTemplate, ReuseTemplate]
  = createReusableTemplate<{ label: string }>()
</script>

<template>
  <DefineTemplate v-slot="{ label }">      <!-- 定义一次 -->
    <span class="badge">{{ label }}</span>
  </DefineTemplate>
  <ReuseTemplate label="新功能" />          <!-- 多处复用 -->
  <ReuseTemplate label="热门" />
</template>
```

</v-click>

<v-click>

> 💡 `useVModel` 封装 `v-model` 的 props + emit（Vue 3.4 有 `defineModel` 后主要给库作者用）；`useVirtualList` 万级数据流畅渲染，传 `itemHeight` + `overscan`。

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Component 分类（14 个）是「组件辅助」——
专门解决组件开发中的一些重复模式。

createReusableTemplate 解决一个很实际的问题 ——
你想在同一个组件内复用一段模板，但又不想为它单独抽一个 .vue 文件。

用法：
- createReusableTemplate() 返回一对组件 [DefineTemplate, ReuseTemplate]
- 用 DefineTemplate 定义一次模板片段（通过 v-slot 接收参数）
- 用 ReuseTemplate 在多处复用，传入不同的 props

例子里定义了一个 badge 模板，然后 ReuseTemplate label="新功能" 和
label="热门" 复用两次 —— 不用抽组件、不用写 v-for。

适合「同一个组件里有几处长得一样的局部结构」——
抽组件太重，复制粘贴又难维护，createReusableTemplate 刚刚好。
泛型 <{ label: string }> 保证传参类型安全。

[click] 另外两个常用的 Component 函数：

useVModel —— 封装 v-model 的 props + emit 模板代码。
传统写自定义 v-model 组件要写 props.modelValue + emit('update:modelValue')，
useVModel 包成一个可读写的 ref。
不过 Vue 3.4 有了 defineModel 宏之后，业务组件直接用 defineModel 更简单 ——
useVModel 现在主要是「库作者」在用（要兼容老版本 Vue 时）。

useVirtualList —— 虚拟列表，万级数据流畅渲染。
传入完整数据数组 + 选项（itemHeight 固定行高、overscan 缓冲行数），
返回 list（当前可见的子集）、containerProps、wrapperProps。
模板里把 props 绑上去，只渲染可视区域的 DOM —— 10 万条数据也丝滑。
做长列表、大表格、日志查看器时用它。

其他 Component 函数：templateRef / useTemplateRef（模板引用）、
unrefElement（从 ref / 组件实例取真实 DOM）、useMounted（是否已挂载）、
tryOnMounted / tryOnScopeDispose（无组件上下文也能安全调用的生命周期钩子）。
-->

---
transition: fade-out
---

# controls 选项与 isSupported 模式

两条贯穿全库的约定 —— 再深挖一层

<v-click>

**controls —— 按需返回控制句柄（TS 自动推导返回类型）**

```ts
const timestamp = useTimestamp()              // 默认：返回 ref
const { timestamp: ts, pause, resume }
  = useTimestamp({ controls: true })          // controls：返回对象
const { counter, reset } = useInterval(1000, { controls: true })
```

</v-click>

<v-click>

**isSupported —— 实验性 Web API 必须先判断**

```vue
<script setup lang="ts">
import { useShare } from '@vueuse/core'
const { share, isSupported } = useShare()
function onShare() {
  if (!isSupported.value) return  // 不支持就降级
  share({ title: 'VueUse', url: location.href })
}
</script>

<template>
  <button :disabled="!isSupported" @click="onShare">分享</button>
</template>
```

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 前面设计哲学一页提到过 controls 和 isSupported ——
这页再深挖一层，因为它们贯穿全库、值得专门讲。

controls 选项 —— 按需返回控制句柄：
很多和「定时 / 动画」相关的函数有两种返回模式。
- 不传 controls：直接返回那个核心 ref，用着简单。
  useTimestamp() 返回时间戳 ref。
- 传 { controls: true }：返回一个带控制方法的对象。
  useTimestamp({ controls: true }) 返回 { timestamp, pause, resume } ——
  你能暂停 / 恢复时间戳更新。
- useInterval 同理：默认返回计数 ref，controls 模式返回 { counter, reset, pause, resume }。

设计意图很明确 —— 80% 的场景只需要那个核心 ref，
不想被一堆控制方法干扰；需要精细控制时再开 controls。

最妙的是 TypeScript 会根据 controls 的值「自动推导」返回类型 ——
传 true 推导成对象、不传推导成 ref。你不用手动标注，类型完全正确。

[click] isSupported 模式 —— 实验性 Web API 必须先判断：
有些浏览器 API 是实验性的、或兼容性差的 ——
navigator.share（Web Share）、EyeDropper（取色器）、navigator.vibrate（震动）。

VueUse 封装这些 API 的函数会额外返回一个 isSupported ref。
用前必须判断 —— 例子里 onShare 函数先检查 isSupported.value，
不支持就直接 return 降级。

模板里也常用 isSupported 控制 UI ——
:disabled="!isSupported" 让不支持的按钮变灰，或者干脆 v-if 隐藏。

为什么重要？因为不判断的话，在不支持的浏览器上调用这些 API 会静默失效 ——
用户点了按钮没反应，还不知道为什么。
isSupported 让你能优雅降级 —— 要么禁用功能，要么给个提示。

涉及 isSupported 的函数还有 useWakeLock（屏幕常亮）、useBattery（电量）、
useNetwork（网络状态）、useDeviceMotion（设备运动）等。
-->

---
transition: fade-out
---

# @vueuse/components 无渲染组件

不方便写 script 的场景 —— 用组件形态

<v-click>

`@vueuse/components` 把部分 composable 包成**无渲染组件**，通过作用域插槽暴露状态：

```vue
<script setup lang="ts">
import { UseMouse, OnClickOutside, UseDark } from '@vueuse/components'
</script>

<template>
  <UseMouse v-slot="{ x, y }">
    鼠标位置：{{ x }}, {{ y }}
  </UseMouse>

  <OnClickOutside :options="{ ignore: [] }" @trigger="open = false">
    <div class="modal">弹层内容</div>
  </OnClickOutside>

  <UseDark v-slot="{ isDark, toggleDark }">
    <button @click="toggleDark()">{{ isDark ? '暗色' : '亮色' }}</button>
  </UseDark>
</template>
```

</v-click>

<v-click>

> 💡 何时用：组件形态适合「只在模板里用一次、不想引入额外 script 逻辑」；常规情况优先用函数形态 —— 更灵活、tree-shaking 更好。

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @vueuse/components 是一个独立的 add-on ——
它把部分 composable 包装成「无渲染组件」（renderless component）。

什么是无渲染组件？它本身不渲染任何 DOM ——
它只是「提供逻辑 / 状态」，通过作用域插槽（v-slot）把状态暴露给你。

例子里：
- UseMouse —— useMouse 的组件形态，v-slot="{ x, y }" 拿到鼠标坐标
- OnClickOutside —— onClickOutside 的组件形态，包裹一个元素，
  点击外部时触发 @trigger 事件
- UseDark —— useDark 的组件形态，v-slot 拿到 isDark 和 toggleDark

所以同一个能力，VueUse 提供两种形态：
- 函数形态：const { x, y } = useMouse()，写在 script 里
- 组件形态：<UseMouse v-slot="{ x, y }">，写在模板里

[click] 什么时候用组件形态？
- 你只在模板里用一次某个能力，不想为它在 script 里加逻辑
- 你的团队 / 项目偏好「模板优先」的写法
- 某些场景下组件形态确实更直观（比如 OnClickOutside 直接包裹要监听的元素）

但官方的建议是 —— 常规情况优先用函数形态：
- 函数形态更灵活，能和其他逻辑组合
- 函数形态 tree-shaking 更好
- 组件形态多了一层组件实例的开销

所以把 @vueuse/components 当成「补充选项」——
大部分时候用函数，少数模板优先的场景用组件。

注意 @vueuse/components 是独立包，要单独 pnpm add @vueuse/components。
-->

---
transition: fade-out
---

# 10 个 add-on 概览

core 之外的扩展包 —— 按需安装，避免给核心包塞重依赖

<v-click>

| Add-on           | 安装包                  | 用途                                       |
| ---------------- | ----------------------- | ------------------------------------------ |
| **Router**       | `@vueuse/router`        | `useRouteQuery` / `useRouteParams` 路由参数响应式 |
| **Integrations** | `@vueuse/integrations`  | `useAxios` / `useJwt` / `useFuse` / `useQRCode` 等 |
| **Math**         | `@vueuse/math`          | `useClamp` / `useSum` / `useMax` 响应式数学 |
| **Motion**       | `@vueuse/motion`        | 声明式动画与过渡                           |

</v-click>

<v-click text-xs class="mt-1">

> 💡 还有 `@vueuse/rxjs` `@vueuse/firebase` `@vueuse/electron` `@vueuse/sound` `@vueuse/gesture` `@vueuse/schema-org`。**add-on 必须单独安装**，装 core 不会带上，漏装报 `Cannot find module`。

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @vueuse/core 之外，VueUse 还有一组独立发布的 add-on ——
它们「按需安装」，目的是避免给核心包塞入重依赖。

最常用的几个：

@vueuse/router —— 把路由参数当响应式 ref：
useRouteQuery('page', '1') 把 URL 的 ?page=xxx 变成可读写的 ref，
改 page.value 自动更新 URL，刷新页面从 URL 读回。
做分页、筛选条件持久化到 URL 时非常好用。

@vueuse/integrations —— 集成第三方库，这个 add-on 内容最丰富：
- useAxios —— axios 的响应式封装
- useJwt —— 解析 JWT token
- useFuse —— fuse.js 模糊搜索
- useQRCode —— 生成二维码
- 还有 useCookies、useNProgress、useFocusTrap、useSortable、
  useChangeCase、useIDBKeyval、useAsyncValidator 等
注意它的导入路径是带子路径的，比如 import { useAxios } from '@vueuse/integrations/useAxios'。

@vueuse/math —— 响应式数学计算：useClamp 限制范围、useSum 求和、
useMax / useMin、useRound、useProjection 等。

@vueuse/motion —— 声明式动画与过渡，是个独立的大型库。

其他：
- @vueuse/rxjs —— RxJS 和 Vue 响应式互转，做 RxJS 桥接
- @vueuse/firebase —— Firebase 响应式绑定
- @vueuse/electron —— Electron 渲染进程工具
- @vueuse/sound —— 基于 Howler.js 的音效播放
- @vueuse/gesture —— 手势识别
- @vueuse/schema-org —— Schema.org 结构化数据，做 SEO

[click] 最重要的提醒 —— add-on 必须单独安装！
pnpm add @vueuse/core 不会带上 @vueuse/router。
最常见的坑：以为装了 core 就有 useRouteQuery，结果报
Cannot find module '@vueuse/router'。
用到哪个 add-on 就单独 pnpm add 哪个。
-->

---
transition: fade-out
---

# SSR + Nuxt

VueUse 对服务端渲染友好 —— 但有几个原则要守

<v-click>

**SSR 安全原则**

```vue
<script setup lang="ts">
import { useWindowSize, useLocalStorage } from '@vueuse/core'

// ✅ SSR 安全：服务端返回默认值，客户端 hydration 后取真实值
const { width, height } = useWindowSize()
const theme = useLocalStorage('theme', 'light')
</script>
```

</v-click>

<v-click>

**initOnMounted —— 规避 hydration mismatch**

```ts
// 挂载后才从 storage 初始化，首帧与服务端保持一致
const theme = useStorage('theme', 'light', undefined, {
  initOnMounted: true,
})
```

</v-click>

<v-click>

> 💡 在 setup 顶层裸访问 `window` 仍会崩 —— 这不是 VueUse 的锅，用封装函数或包进 `onMounted`。Nuxt 项目用 `@vueuse/nuxt` + `ClientOnly`。

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] VueUse 对 SSR 是友好的 —— 大部分函数在服务端能安全调用，
不会因为 window 未定义而崩溃。访问浏览器 API 的部分会在客户端激活后才真正生效。

SSR 安全原则：
- useWindowSize() —— 服务端返回默认值（如 width 是 Infinity），
  客户端 hydration 后取真实值
- useLocalStorage('theme', 'light') —— 服务端读不到 localStorage，
  返回 defaults；客户端再同步

VueUse 内部做了环境判断和降级 —— 这是它「SSR 友好」的含义。

[click] 但 SSR 有个经典问题 —— hydration mismatch（水合不匹配）。
useStorage 在服务端渲染时用 defaults，
客户端首帧如果立刻读到 localStorage 里的不同值，
服务端 HTML 和客户端首帧就对不上 —— Vue 会报 hydration mismatch 警告。

解决方案是 initOnMounted 选项 ——
开启后，useStorage 等组件挂载后才从 storage 初始化，
首帧保持和服务端一致，hydration 后再更新。这样就没有 mismatch 警告。

[click] 但要分清楚 —— 有一种崩溃不是 VueUse 的锅：
如果你在 setup 顶层「裸访问」浏览器对象 ——
const w = window.innerWidth —— 服务端没有 window，直接报错。

解决：
- 优先用 VueUse 的封装函数代替裸 API（useWindowSize 而非 window.innerWidth）——
  它们 SSR 安全
- 必须用裸 API 时，包进 onMounted（onMounted 只在客户端执行）

Nuxt 项目：
- 用 @vueuse/nuxt 模块，SSR 兼容已内置处理
- 依赖暗色状态等浏览器特性的 UI，包进 <ClientOnly> 避免首屏闪烁
- useColorMode 在 app.vue 顶层调用一次，整站共享

总结：VueUse SSR 友好，但「裸访问浏览器对象」和「hydration mismatch」
这两个坑要靠开发者自己注意。
-->

---
transition: fade-out
---

# 常见踩坑

VueUse 项目里最容易栽的几个坑

<v-clicks>

- **解构后丢响应性**：`reactive(useMouse())` 是对的，但再 `const { x } = mouse` 解构 reactive 就丢响应性 —— 保留 `mouse.x`
- **组件外调用无法自动清理**：模块顶层 / 路由守卫里调 `useMouse` 副作用不清理 —— 用 `effectScope()` 或 `try*` 函数
- **useStorage 类型陷阱**：`useStorage('user', null)` 推断成 `null` —— 显式传泛型 + `StorageSerializers.object`
- **add-on 未单独安装**：`@vueuse/router` 报 `Cannot find module` —— 它是独立包，要单独 `pnpm add`
- **refetch 没开**：`useFetch` 的响应式 URL 改了不重发 —— 必须显式 `{ refetch: true }`
- **useDark 首屏闪烁**：刷新先亮后暗 —— `index.html` 的 `<head>` 加内联脚本，框架加载前就设好 class
- **watchDebounced 退化**：漏传 `debounce` 选项就退化成普通 watch —— 明确传 `{ debounce: 500 }`
- **SSR 裸访问 window**：setup 顶层访问 `window` 崩溃 —— 用封装函数或包进 `onMounted`

</v-clicks>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这页把前面散落的踩坑点集中起来 —— VueUse 项目里最容易栽的 8 个坑。

[click] 坑一 —— 解构后丢响应性。
VueUse 返回值解构本身不丢响应性（属性是 ref）。
但 reactive(useMouse()) 之后，你又去解构这个 reactive 对象 ——
const { x } = mouse —— 这就丢响应性了，因为解构 reactive 对象会丢。
正确做法：reactive 包裹后保留 mouse.x 访问，不要再解构。

[click] 坑二 —— 组件外调用无法自动清理。
在模块顶层、路由守卫、setTimeout 回调里调 useMouse ——
没有组件上下文，onUnmounted 注册不上，副作用不清理、内存泄漏。
解决：在 script setup / 其他 composable 内调用，
或包进 effectScope() 自己管，或用 tryOnMounted 这类 try* 函数（无上下文时静默跳过）。

[click] 坑三 —— useStorage 类型陷阱。
useStorage('user', null) 后 user.value 类型是 null，没法赋值对象 ——
因为默认值是 null，TS 推断不出类型。
解决：显式传泛型 useStorage<User | null>('user', null)，
必要时第四参数传 serializer: StorageSerializers.object。

[click] 坑四 —— add-on 未单独安装。
import from '@vueuse/router' 报 Cannot find module ——
@vueuse/router、@vueuse/integrations 是独立包，
装 @vueuse/core 不会带上，要单独 pnpm add。

[click] 坑五 —— refetch 没开。
useFetch 的 URL 传 ref，改了 URL 但没重新请求 ——
useFetch 默认不会因 URL 变化自动重发，要显式开 { refetch: true }。

[click] 坑六 —— useDark 首屏闪烁 FOUC。
刷新页面先显示亮色再跳暗色 —— 因为 JS（VueUse 读 localStorage 切 class）
执行在首屏渲染之后。
解决：在 index.html 的 head 里加一段内联脚本，
在框架加载前就同步把 dark class 设好。

[click] 坑七 —— watchDebounced 退化。
以为 watchDebounced 第三参数和 watch 一样，漏传 debounce ——
它就退化成普通 watch 了。要明确传 { debounce: 500, maxWait: 2000 }。

[click] 坑八 —— SSR 裸访问 window。
setup 顶层 const w = window.innerWidth —— 服务端没 window，崩。
用 useWindowSize 这类封装函数（SSR 安全），或包进 onMounted。

这 8 个坑覆盖了 VueUse 实战中 90% 的「为什么不工作」。
-->

---
transition: fade-out
---

# 评价

200+ composable 消除样板代码，但不是 UI 库

<v-clicks>

**优点**

- Vue / Vite / Nuxt 核心成员 Anthony Fu 领衔，与 Vue 响应式系统高度同源、演进可靠
- 200+ composable 覆盖 12 大分类，80% 的「监听 + 清理」样板代码一个函数替代
- 完全 Tree-shakeable + 100% TypeScript + SSR 友好，没用到的函数零体积
- 副作用自动清理，彻底消除「忘记 onUnmounted 清理」的内存泄漏 Bug
- `MaybeRef` / `toValue` 响应式参数约定 + `controls` / `isSupported` 一致约定，学会一个触类旁通

**缺点**

- Vue 3 专用，v12 起弃 Vue 2、v14 要求 Vue 3.5+ —— 老项目升级前先核对版本
- 不是 UI 库，按钮 / 表格 / 对话框仍要搭配组件库
- 200+ 函数易选择困难，功能相近的多（`useStorage` vs `useLocalStorage`、几种防抖）
- 过度封装风险 —— 极简单的一次性逻辑直接用原生 API 反而更清晰
- add-on 需单独安装，响应式参数约定对新人有学习成本

</v-clicks>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 客观评价 VueUse —— 先说优点。

[click] 优点一 —— 作者背书。
Anthony Fu 是 Vue / Vite / Nuxt 三个核心团队成员，
VueUse 与 Vue 响应式系统、Vite 生态高度同源，跟随 Vue 演进的可靠性最有保障。
这是其他第三方工具库给不了的。

[click] 优点二 —— 覆盖面。
200+ composable 覆盖 12 大分类，
日常 Vue 业务里 80% 的「监听 + 清理」样板代码都能用一个函数替代。

[click] 优点三 —— 工程化。
完全 Tree-shakeable（没用到的零体积）、100% TypeScript（类型完备无需 @types）、
SSR 友好（服务端不崩）。

[click] 优点四 —— 副作用自动清理。
彻底消除「忘记在 onUnmounted 清理导致内存泄漏」这个最常见的 Vue Bug。

[click] 优点五 —— 一致的设计约定。
MaybeRef / toValue 响应式参数、controls / isSupported / configurableWindow ——
所有 composable 遵循同一套约定，学会一个，其余触类旁通。

[click] 再说缺点 —— 选型时要清楚。

[click] 缺点一 —— Vue 3 专用。
v12 起弃 Vue 2、v14 要求 Vue 3.5+，老项目升级前必须先核对 Vue 版本。

[click] 缺点二 —— 不是 UI 库。
VueUse 只提供逻辑、不渲染视觉，按钮 / 表格 / 对话框仍要搭配
Element Plus / Naive UI / Arco Design Vue。两者职责不同、互补而非替代。

[click] 缺点三 —— 选择困难。
200+ 函数里不少功能相近 —— useStorage vs useLocalStorage vs useSessionStorage、
useDebounceFn vs watchDebounced vs refDebounced。
新人需要先理解分类与命名约定才能快速定位。

[click] 缺点四 —— 过度封装风险。
极简单的一次性逻辑（一个 addEventListener），直接用原生 API 反而更清晰。
不要「为了用 VueUse 而 VueUse」—— 按「是否真的需要响应式 + 自动清理」来决定。

[click] 缺点五 —— add-on 需单独装，响应式参数约定（MaybeRef / toValue）
对没吃透 Vue 响应式基础的新人有学习成本。

总体结论：VueUse 是 Vue 3 项目的事实标准工具库 —— 强烈推荐，
但要清楚它的边界（不是 UI 库、不替代业务封装），按需使用、避免过度抽象。
-->

---
transition: fade-out
---

# 学习路径

从入门到熟练应用的 4 个阶段

<v-click>

**第 1 阶段：上手 + 核心约定**

- `pnpm add @vueuse/core`，跑通 `useMouse` / `useDark` / `useStorage` / `useClipboard` 综合示例
- 吃透四大约定：解构 ref / `reactive()` 去 `.value` / 副作用自动清理 / 响应式参数

</v-click>

<v-click>

**第 2 阶段：12 大分类 + 旗舰函数**

- 通读分类速览，重点练 `useStorage` / `useFetch` / `useDark` / `useElementSize`

</v-click>

<v-click>

**第 3 阶段：工程化整合**

- 配 `unplugin-auto-import` 自动导入；Nuxt 项目接 `@vueuse/nuxt`；按需引入 add-on

</v-click>

<v-click>

**长期**：吃透 `MaybeRef` / `toValue` 约定，用 VueUse 风格写自己的业务 composable

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 第一阶段 —— 上手 + 核心约定。
pnpm add @vueuse/core 装好，
跑通一个综合示例 —— useMouse + useDark + useStorage + useClipboard 放一个 .vue 里，
感受「一行 import 就拿到响应式能力 + 自动清理」。

然后吃透四大约定：
- 解构出来仍是 ref
- reactive() 包裹去 .value
- 副作用自动清理（不用写 onUnmounted）
- 响应式参数（值 / ref / getter 都能传）
这四条吃透，VueUse 就入门了。

[click] 第二阶段 —— 12 大分类 + 旗舰函数。
通读分类速览，知道「想做某件事该去哪一类找函数」。
重点练四个旗舰函数：
- useStorage —— 响应式本地存储
- useFetch —— 响应式 HTTP
- useDark —— 暗色模式
- useElementSize —— 元素尺寸观察
这四个覆盖了 80% 的日常需求，练熟它们就能解决大部分问题。

VueUse 官网每个函数都有可交互的在线 Demo —— 边看边试是最快的学习方式。

[click] 第三阶段 —— 工程化整合。
- 配 unplugin-auto-import 自动导入，免写 import
- Nuxt 项目接 @vueuse/nuxt 模块
- 按需引入 add-on —— 用到路由参数装 @vueuse/router，用到 axios 装 @vueuse/integrations
- 注意 SSR 项目的 initOnMounted、FOUC 处理

[click] 长期投入 —— 吃透 MaybeRef / toValue 这套响应式参数约定，
然后用 VueUse 的风格写自己的业务 composable ——
参数声明成 MaybeRefOrGetter、内部 toValue 解包、副作用注意清理。

VueUse 不只是个工具库 —— 它是「如何写好 composable」的最佳范本。
读它的源码、模仿它的设计，你写出的业务 composable 质量会上一个台阶。

记住：VueUse 解决的是「与浏览器 / 通用模式相关」的重复劳动，
业务专属逻辑（订单状态机这种）仍然自己写 —— 两者是互补的。
-->

---
transition: fade-out
---

# 延伸学习资源

官方 + 社区精选

<v-click>

**官方资源**

- 📖 [VueUse 官网](https://vueuse.org/) —— 每个函数都有可交互在线 Demo + Type Declarations
- 💻 [GitHub vueuse/vueuse](https://github.com/vueuse/vueuse) —— 22k+ Star，MIT 协议
- 📋 [函数总览（200+）](https://vueuse.org/functions) —— 按分类速查全部 composable

</v-click>

<v-click>

**关键链接**

- [Get Started 入门](https://vueuse.org/guide/) / [Best Practice 最佳实践](https://vueuse.org/guide/best-practice)
- [Add-ons 扩展包](https://vueuse.org/add-ons) —— 10 个 add-on 的文档入口
- [Anthony Fu](https://github.com/antfu) —— 作者，Vue / Vite / Nuxt 核心团队成员

</v-click>

<v-click>

**配套技术栈**

- Vue Router + Pinia + Vite + UnoCSS = 黄金组合
- VueUse + 任意 UI 库（Element Plus / Naive UI）= 逻辑与视觉互补

</v-click>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #42D392 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 官方资源是第一手信息 ——

VueUse 官网 vueuse.org 的文档质量极高 ——
每个函数都有可交互的在线 Demo（直接在文档里改参数看效果）、
Type Declarations（完整类型声明）、Source 链接（直接看源码）。
这是学 VueUse 最好的地方 —— 边看边试。

GitHub 仓库 vueuse/vueuse —— 22k+ Star、MIT 协议。
issue 和 discussions 区是问题解答的金矿。

函数总览页面 vueuse.org/functions —— 按 12 大分类列出全部 200+ composable，
忘了某个函数叫什么、想找做某事的函数，来这里速查。

[click] 几个关键链接：
- Get Started 入门指南 / Best Practice 最佳实践
- Add-ons 页面 —— 10 个 add-on 的文档入口
- Anthony Fu 的 GitHub —— 作者主页，能看到他的其他项目

[click] 配套技术栈：
「Vue Router + Pinia + Vite + UnoCSS」是 2024-2026 年 Vue 3 现代项目的黄金组合。

VueUse 和任意 UI 库是「逻辑与视觉互补」的关系 ——
- VueUse 负责逻辑：状态、副作用、浏览器 API
- UI 库（Element Plus / Naive UI / Arco Design Vue）负责视觉：按钮、表格、对话框
两者职责不同，一起用零冲突。

实际上很多 UI 库本身就内部依赖 VueUse —— 它已经是 Vue 3 生态的基础设施。

学习建议：不要试图一次记住 200+ 函数 ——
记住 12 大分类 + 七条设计约定 + 四个旗舰函数，
剩下的「用到再查官网」，效率最高。
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 🧰

VueUse — Vue 3 组合式工具函数集合

<div class="mt-8 text-lg">

**核心心智**

- 逻辑库不是 UI 库，把「浏览器交互逻辑」封装成可 import 的 composable
- 七条设计约定贯穿全库：返回 ref / 自动清理 / MaybeRef·toValue / controls / isSupported
- 200+ 函数分 12 大类，记住分类与命名前缀就能快速定位
- 副作用自动清理消除内存泄漏，组件外用 effectScope 兜底
- Vue 3 专用、Tree-shakeable、SSR 友好，add-on 必须单独安装

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://vueuse.org/" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/vueuse/vueuse" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://vueuse.org/functions" target="_blank" class="slidev-icon-btn">
    <carbon:list /> 函数总览
  </a>
</div>
