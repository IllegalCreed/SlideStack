---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Pinia
info: |
  Presentation Pinia for developers.

  Learn more at [https://pinia.vuejs.org/](https://pinia.vuejs.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-9xl">🍍</span>
</div>

<br/>

## Pinia — The Vue Store

Official Vue state management，Composition-first，~1.5 KB，Vue 团队官方维护（基于 v3.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Pinia —— Vue 生态当前的官方状态管理库，由 Vue 团队成员 Eduardo San Martin Morote 主导。

2019 年作为「Vuex 5 提案」的实验诞生，2021 年正式独立发布，2023 年取代 Vuex 成为 Vue 官方推荐。
当前主线 v3.x（2024 年发布），完全为 Vue 3 + Composition API 优化。

核心卖点：~1.5 KB 极致轻量、TypeScript 友好、Composition / Options 双语法、DevTools 深度集成。
-->

---
transition: fade-out
---

# 什么是 Pinia？

为 Vue 3 应用提供共享状态管理的官方 Store 库

<v-click>

- **直觉式 API**：Store 像组件一样熟悉，无 mutations 概念
- **TypeScript 优先**：原生类型推导，无需复杂泛型包装
- **Composition Store**：支持 Composition API 风格定义 Store
- **DevTools 集成**：时间旅行、HMR、状态快照、action 追踪
- **极致轻量**：~1.5 KB gzipped，按需打包
- **SSR 安全**：天生支持 Nuxt + 服务端渲染
- **插件生态**：persistedstate / debounce / undo 等社区插件

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Pinia Introduction_](https://pinia.vuejs.org/introduction.html)

</div>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Pinia 的核心定位是「替代 Vuex 的现代 Vue 状态管理」。

它的设计目标很明确：
- 直接用响应式原语（ref / computed）定义 Store，不引入新概念
- 完全摆脱 Vuex 时代繁琐的 mutations 与 namespaced modules
- 类型推导开箱即用，TS 用户写一行解构就有完整提示
- ~1.5 KB 极致体积，按需 tree-shake 单个 store
- DevTools 显示每个 Store 的状态变化、action 调用、time-travel

下面会按照「定位 → 核心理念 → 第一个 Store → state/getters/actions → 进阶」的顺序讲透。
-->

---
transition: fade-out
---

# Pinia 的定位与生态

为什么 Vue 团队选 Pinia 接班 Vuex？

<v-click>

| 维度       | Pinia 3               | Vuex 4             | Zustand        | Redux Toolkit  |
| ---------- | --------------------- | ------------------ | -------------- | -------------- |
| 框架绑定   | **Vue 3 官方**        | Vue 2/3            | React          | React          |
| API 风格   | Composition / Options | Vuex 模式          | Hook 风格      | Slice + Hook   |
| Mutations  | **无**                | 必须               | 无             | 内部 Immer     |
| TS 支持    | **原生推导**          | 弱                 | 优             | 优             |
| 包体积     | **~1.5 KB**           | ~10 KB             | ~1 KB          | ~10 KB         |
| SSR        | **官方支持**          | 支持               | 中等           | 中等           |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Why Pinia_](https://pinia.vuejs.org/introduction.html)

</div>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比五大状态库一目了然 ——

Pinia 的护城河是「Vue 官方 + Composition + 无 mutations」：
- Vue 团队直接维护，与 Vue 3 / Nuxt / DevTools 深度协同
- Composition API 风格让 Store 看起来像 `<script setup>`
- 砍掉 mutations，直接 `state.x = y` 修改，DevTools 仍能记录变更

对比 Vuex 4：API 更简洁、TS 推导原生、包体积小一个数量级。
对比 Zustand：Pinia 在 Vue 生态的官方地位 = Zustand 在 React 生态。
对比 Redux Toolkit：Pinia 没有 reducer / action type 这层心智负担。
对比 Jotai：Pinia 是「store」粒度，Jotai 是「atom」粒度，两种哲学。

选型逻辑：Vue 3 项目几乎默认选 Pinia，除非维护老 Vuex 项目。
-->

---
transition: fade-out
---

# Vuex 时代的痛点 → Pinia 的解答

为什么 Vue 团队彻底重做状态管理？

<v-click>

**Vuex 4 的历史负担**

- **Mutations 形式主义**：必须 `commit('SET_COUNT', n)` 才能改 state，重复劳动
- **TypeScript 弱支持**：getters / actions 类型需手写复杂泛型才能推导
- **Namespaced Modules 复杂**：`store.dispatch('user/profile/update')` 字符串路径易错
- **mapState / mapGetters 模板魔法**：Options API 时代写法，Composition 下重复
- **学习曲线陡**：state / mutations / actions / getters / modules / namespaces 五层概念

</v-click>

<v-click>

**Pinia 的彻底简化**

- 砍掉 mutations，直接 `store.count++`
- 砍掉 namespaced，每个 Store 自带唯一 ID（namespace）
- 原生 TS 推导，零配置自动补全
- Setup Store 写法 = `<script setup>` 风格

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vuex 4 在 Vue 3 时代显得「水土不服」——

Mutations 在 Flux 架构里有其历史意义（保证状态可追踪），
但代价是每次改 state 都要写一个 `SET_xxx` mutation，重复劳动。
Pinia 时代 DevTools 直接 patch state 变更，不再需要 mutations 作为中介。

TypeScript 是 Vuex 4 最大的痛点 —— 必须手写 `Store<RootState>` 这种泛型，
而 Pinia 完全交给 TS 推导，写 store 像写一个普通的 composable。

Namespaced modules 字符串路径在大型项目里极其难维护，
比如 `store.dispatch('user/profile/security/changePassword')` 写错一个字母就静默失败。
Pinia 每个 Store 就是一个独立的 `useXxxStore`，IDE 直接跳转。

[click] Pinia 的「减法」是哲学层面的 ——
不是优化 Vuex，而是重新思考 Vue 3 时代状态管理应该长什么样。
Composition API 已经提供了 ref / computed / watch，Pinia 只需要在此基础上「组织」起来。
-->

---
transition: fade-out
---

# Pinia 的核心理念

四个设计哲学贯穿全部 API

<v-click>

**1. Composition API 优先**

Store 本质上是一个 composable —— 用 `ref` / `computed` / `function` 定义状态、派生、行为。Options 风格仅作向后兼容。

</v-click>

<v-click>

**2. 模块化无需 namespace**

每个 Store 通过 `defineStore('uniqueId', ...)` 自带唯一 ID。多个 Store 各自独立，互相引用直接 `import { useXxxStore } from './xxx'`，零字符串路径。

</v-click>

<v-click>

**3. 类型推导原生**

无需任何泛型包装，TS 自动从 `state()` 返回值、`getters` 返回类型、`actions` 签名推导出完整 Store 类型。

</v-click>

<v-click>

**4. DevTools 深度集成**

Vue DevTools 显示每个 Store 的 state 树、actions 调用日志、time-travel、HMR 热更新。

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Composition 优先的含义：Pinia 的 Setup Store 看起来就是一个 composable。
ref 定义 state、computed 定义 getter、function 定义 action —— 完全复用 Vue 3 已有心智。

[click] 模块化的妙处：每个 Store 就是一个文件 + 一个 `useXxxStore` 函数。
没有 namespace，没有 module path，IDE 跳转 + 重命名都直接工作。

[click] TS 推导让 Pinia 在大型项目里特别舒服：
解构 `const { count, name } = storeToRefs(store)`，IDE 立刻知道每个字段的类型。
对比 Vuex 4 需要手写 `interface RootState` 然后 `Store<RootState>` 包一层，差距巨大。

[click] DevTools 集成是日常开发最直观的收益 ——
- 每次 state 变更显示 diff
- actions 调用按时间排列
- time-travel 可以倒带到任意时刻
- 修改 store 代码后 HMR 保留状态
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与初始化

5 分钟接入任意 Vue 3 项目

::left::

<v-click>

**安装**

```bash
pnpm add pinia
# 或
npm install pinia
```

| 版本   | Vue 兼容  | 状态                 |
| ------ | --------- | -------------------- |
| v3.x   | Vue 3.0+  | **当前主线**         |
| v2.x   | Vue 2/3   | 仍可用，建议升 v3    |

</v-click>

::right::

<v-click>

**入口配置**

```ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount("#app");
```

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Pinia 安装极简 —— 一个包，没有可选 peer dependency。
v3.x 是 Vue 3 项目的当前主线，v2.x 兼容 Vue 2 + Vue 3，新项目直接用 v3。

[click] 入口配置 = `createPinia()` + `app.use()`。
顺序需要在 `mount()` 之前，否则首次 useStore 时拿不到实例。

Nuxt 项目通过 `@pinia/nuxt` 模块自动完成这一步，无需手写。
-->

---
transition: fade-out
---

# 第一个 Store：Setup vs Option

两种写法功能完全等价，新项目推荐 Setup

<v-click>

**Setup Store 风格（推荐，Composition 优先）**

```ts
// stores/counter.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  const name = ref("Eduardo");

  const doubleCount = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  return { count, name, doubleCount, increment };
});
```

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Setup Store 是 Pinia v2.1+ 引入的写法 ——
defineStore 第二参传一个函数（类似 `<script setup>` 内部），
ref / computed / function 分别对应 state / getter / action。

最后 return 出来的字段就是 Store 的公开 API。
未 return 的变量是 Store 内部「私有状态」，外部无法访问。

这种写法的核心优势：
- 与 Composition API 风格一致，迁移成本低
- 可以直接调用其他 composable（useRoute / useFetch / VueUse 全家桶）
- TS 推导无需任何手动标注
-->

---
transition: fade-out
---

# Option Store 写法（兼容 Vuex 风格）

熟悉 Options API 的开发者可以选这种写法

<v-click>

```ts
// stores/counter.ts
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({ count: 0, name: "Eduardo" }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() { this.count++ },
  },
});
```

</v-click>

<v-click>

**对照映射**：`ref()` ↔ `state()` | `computed()` ↔ `getters` | `function()` ↔ `actions`

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Option Store 看起来很像 Vuex —— 这是有意为之，方便 Vuex 用户无缝迁移。

注意几点差异：
- 没有 mutations，state 改动直接在 actions 里 `this.count++`
- 没有 modules / namespaced，每个 defineStore 就是一个独立 Store
- state 必须是函数返回对象（SSR 需要每次拿到新实例）
- actions 不能用箭头函数，否则 `this` 丢失

[click] 三个写法的等价对照：
ref 对应 state，computed 对应 getter，普通 function 对应 action。
Setup Store 把它们「平铺」起来，Option Store 把它们「分类」放置。

新项目直接走 Setup，老 Vuex 迁移过来可以先用 Option 风格平滑过渡。
-->

---
transition: fade-out
---

# 在组件中使用 Store

useXxxStore() 调用即可，但要避开解构陷阱

<v-click>

```vue
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCounterStore } from "@/stores/counter";

const counter = useCounterStore();

// 直接访问字段（响应式）
counter.count++;
counter.increment();

// 解构 state / getters 必须用 storeToRefs，否则响应性丢失
const { count, doubleCount } = storeToRefs(counter);

// actions 可以直接解构（不需要响应性）
const { increment } = counter;
</script>

<template>
  <p>当前计数：{{ count }}</p>
  <p>双倍：{{ doubleCount }}</p>
  <button @click="increment">+1</button>
</template>
```

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Pinia 最经典的使用模式 ——

直接访问 `counter.count` 是响应式的，因为 store 本身是个 reactive proxy。
但如果你 `const { count } = counter`，count 就变成普通值，失去响应性 —— 这是新手最常踩的坑。

解决方案是 `storeToRefs(store)` ——
它把 state + getters 都包装成 ref，让你可以解构且保持响应性。
actions 不需要响应性，直接解构原 store 即可。

这个模式在 SFC 里非常高频，建议把 `import { storeToRefs } from 'pinia'` 加到 ESLint auto-import 配置里。
-->

---
transition: fade-out
---

# state：响应式状态

定义、读写、批量修改、订阅四件套

<v-click>

**1. 定义 state**

```ts
// Setup Store
const items = ref<CartItem[]>([]);
const user = ref<User | null>(null);

// Option Store
state: () => ({
  items: [] as CartItem[],
  user: null as User | null,
});
```

</v-click>

<v-click>

**2. 读 / 写 state**

```ts
const store = useCartStore();

console.log(store.items);           // 读
store.items.push({ id: 1, qty: 2 }); // 写：直接赋值/方法调用
store.user = { id: 1, name: "Ed" }; // 写：替换整个值
```

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] state 的定义有两种风格：
- Setup Store 里就是 `ref()` —— 类型由初始值或显式标注推导
- Option Store 里在 `state()` 函数返回值 —— 用 `as Type` 断言初始空数组的类型

state() 必须是函数 —— SSR 场景下每个请求需要拿到独立的初始值，
如果直接写成对象，所有请求会共享同一份引用，导致状态泄漏。

[click] 读写完全直接：`store.x` 读、`store.x = y` 写。
对象 / 数组也是响应式的 —— push / splice / 直接赋值都会触发更新。

这种「直接修改」的简洁性是 Pinia 相比 Vuex 最大的体验提升。
-->

---
transition: fade-out
---

# $patch：批量更新 state

一次操作多个字段，DevTools 显示为单次变更

<v-click>

**对象形式（适合简单赋值）**

```ts
store.$patch({
  count: store.count + 1,
  age: 120,
  name: "DIO",
});
```

</v-click>

<v-click>

**函数形式（适合数组操作 / 复杂逻辑）**

```ts
store.$patch((state) => {
  state.items.push({ id: 1, qty: 2 });
  state.hasChanged = true;
  state.lastUpdated = Date.now();
});
```

</v-click>

<v-click>

**对比**：逐个赋值 → DevTools 显示 3 条记录；`$patch` 合并为 1 条，便于 time-travel 回滚。

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] $patch 的对象形式适合「同步一批字段」—— 表单提交后写回多个属性。
DevTools 把它显示为一次 patch object 变更，便于追踪。

[click] 函数形式适合需要读取旧值 + 复杂数组操作的场景。
函数内的 `state` 参数已经是响应式 proxy，所有修改都会被批量收集。

[click] 与逐个赋值的区别在 DevTools 里非常直观 ——
$patch 让多个相关变更在 time-travel 里作为「一步」回滚 / 重放。

实际项目中，「表单批量保存」「初始化默认值」「重置部分字段」这些场景都建议用 $patch。
-->

---
transition: fade-out
---

# $reset：重置到初始状态

Option Store 自带，Setup Store 需自实现

<v-click>

**Option Store：内置 $reset()**

```ts
export const useCounterStore = defineStore("counter", {
  state: () => ({ count: 0, name: "Eduardo" }),
});

const store = useCounterStore();
store.count = 99;
store.$reset();   // count 回到 0, name 回到 "Eduardo"
```

</v-click>

<v-click>

**Setup Store：手动实现**

```ts
export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  const name = ref("Eduardo");
  function $reset() { count.value = 0; name.value = "Eduardo"; }
  return { count, name, $reset };
});
```

</v-click>

<div v-click text-xs class="mt-3">

> 💡 Setup Store 的 ref 初值对外不可见 → Pinia 无法自动生成 $reset；通用方案见后续插件章节。

</div>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Option Store 的 $reset 是 Pinia 自动实现的 ——
因为 `state()` 是个工厂函数，Pinia 可以再调一次拿到初始值，整体覆盖即可。

[click] Setup Store 的「初始值」隐藏在闭包里，Pinia 无从知晓 —— 所以需要你自己写 $reset。
约定俗成把它命名为 `$reset` 并 return 出来，调用方仍然能用 `store.$reset()`。

[click] 实际项目里如果大量 Store 需要 $reset，建议写一个 Pinia 插件：
在 Store 初始化时记录初值快照，统一注入 `$reset` 方法 —— 后面的「插件系统」章节会讲。
-->

---
transition: fade-out
---

# $subscribe：监听 state 变化

订阅 state 变更，做持久化 / 日志 / 同步

<v-click>

**基本用法**

```ts
const cart = useCartStore();

cart.$subscribe((mutation, state) => {
  console.log(mutation.type);    // 'direct' | 'patch object' | 'patch function'
  console.log(mutation.storeId); // 'cart'
  console.log(mutation.payload); // $patch 时为传入的对象

  // 简单的本地持久化
  localStorage.setItem("cart", JSON.stringify(state));
});
```

</v-click>

<v-click>

**配置项**

```ts
cart.$subscribe(callback, {
  flush: "sync",   // 同步触发（默认是组件更新后批量触发）
  detached: true,  // 组件卸载后仍保留订阅
});
```

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] $subscribe 是 Pinia 的 state 变更监听器，相当于 Vuex 的 store.subscribe。

`mutation.type` 告诉你这次变更的来源：
- direct：直接赋值 `store.x = y`
- patch object：调用 `$patch({...})`
- patch function：调用 `$patch(state => {...})`

最经典的应用就是手写持久化 —— 每次 state 变就 localStorage.setItem。
但更推荐用 `pinia-plugin-persistedstate` 插件（后面会讲）。

[click] flush: 'sync' 让回调在 state 变更的瞬间同步执行，
默认是异步（next tick），等组件批量更新后再触发，性能更好。

detached: true 让订阅脱离当前组件生命周期，常用于全局监听（路由 / 持久化 / 日志）。
-->

---
transition: fade-out
---

# getters：派生状态

类似 computed，自动缓存，自动追踪依赖

<v-click>

**基本用法**

```ts
// Setup Store
const doubleCount = computed(() => count.value * 2);

// Option Store
getters: {
  doubleCount: (state) => state.count * 2,
  doublePlusOne(): number {
    return this.doubleCount + 1;       // 通过 this 访问其他 getter
  },
}
```

</v-click>

<v-click>

**带参数的 getter（返回函数，不被缓存）**

```ts
getters: {
  getUserById: (state) => (id: number) => state.users.find((u) => u.id === id),
}
store.getUserById(42);   // 每次调用重新计算
```

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Setup Store 里 getter 就是普通的 `computed()` —— 完全复用 Vue 心智。
Option Store 里写在 `getters` 选项下，每个函数收 state 作为第一参数。

跨 getter 访问需要用 `this`，而 `this` 在箭头函数里不可用 ——
所以涉及 `this.xxx` 的 getter 必须用普通函数写法 + 显式标注返回类型（TS）。

[click] getter 本身不能收参数（因为是 computed），
但可以「返回一个函数」实现参数化访问。

代价：返回的函数不会被缓存 —— 每次调用都重新计算。
高频场景下建议在 action 里做查询并把结果存进 state，而不是依赖 getter 函数。
-->

---
transition: fade-out
---

# 跨 Store 引用 getters

直接调用其他 useXxxStore() 即可

<v-click>

**Option Store**：在 getter **内部**实例化

```ts
export const useCartStore = defineStore("cart", {
  state: () => ({ items: [] as CartItem[] }),
  getters: {
    summary(state) {
      const user = useUserStore();   // 调用时点实例化
      return `Hi ${user.name}, ${state.items.length} items`;
    },
  },
});
```

</v-click>

<v-click>

**Setup Store**：在 setup 开头直接调用

```ts
export const useCartStore = defineStore("cart", () => {
  const user = useUserStore();
  const items = ref<CartItem[]>([]);
  const summary = computed(() => `Hi ${user.name}, ${items.value.length} items`);
  return { items, summary };
});
```

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Option Store 里的 getter 必须在调用时（而非 module 顶层）实例化其他 Store，
否则在 Pinia 还没初始化时执行会报错。

写在 getter 函数内部最安全 —— 每次访问该 getter 时才取最新引用。

[click] Setup Store 更直观 —— 直接在 setup 函数开头调用 `useXxxStore()`，
Pinia 内部保证此时实例已就绪（因为 useCartStore 本身只能在 setup 上下文里调用）。

跨 Store 引用的循环依赖问题需要小心：
A Store 的 getter 用 B Store 的 state，B Store 的 getter 也用 A Store 的 state ——
Pinia 不会自动检测，需要开发者保证不产生死循环。
-->

---
transition: fade-out
---

# actions：业务逻辑入口

同步 / 异步 / 副作用，全部放这里

<v-click>

**同步 action**

```ts
actions: {
  increment() { this.count++ },
  randomize() { this.count = Math.round(Math.random() * 100) },
}
```

</v-click>

<v-click>

**异步 action（推荐 async/await）**

```ts
actions: {
  async loadUser(id: number) {
    this.loading = true;
    try { this.user = await fetchUser(id); }
    catch (e) { this.error = (e as Error).message; }
    finally { this.loading = false; }
  },
}
```

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] action 是 Pinia 里「写业务逻辑」的标准位置 ——
所有 state 变更（除了简单赋值）建议封装为 action，便于测试 + DevTools 追踪。

注意 actions 不能用箭头函数，因为 `this` 在箭头函数里指向外部作用域，
而 Pinia 通过 `this` 绑定 Store 实例。

[click] 异步 action 直接用 async/await，没有 Vuex 时代 dispatch + commit 的两层调度。
错误处理放在 action 内部，状态字段（loading / error）也在 state 里维护，
让组件层只关心「调 action + 渲染 state」。

实际项目里建议 action 名字用动词开头：
`loadUser` / `saveCart` / `submitForm` / `logout` —— 一眼看出是行为。
-->

---
transition: fade-out
---

# 在 actions 中调用其他 Store

跨域协作 / 鉴权 / 联动更新

<v-click>

```ts
import { useAuthStore } from "./auth";

export const useSettingsStore = defineStore("settings", {
  state: () => ({ preferences: null as Preferences | null }),
  actions: {
    async fetchPreferences() {
      const auth = useAuthStore();   // 在 action 内实例化
      if (!auth.isAuthenticated) throw new Error("Not authenticated");
      this.preferences = await api.getPreferences(auth.token);
    },
  },
});
```

</v-click>

<v-click>

**典型场景**：鉴权（`useAuthStore`）/ 用户偏好 / 通知推送 / 路由跳转（建议组件层）

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] action 内引用其他 Store 是大型项目最常见的模式 ——
认证、权限、通知这些「横切关注点」自然以 Store 形式存在，
业务 Store 在 action 里读它们。

注意时机：`useAuthStore()` 必须在 action 函数体内调用，不能在 module 顶层调用，
否则 Pinia 实例还没绑定到 app 上，会抛错。

[click] 这些跨 Store 协作场景在 Vuex 时代往往需要 namespaced module 互相 dispatch，
字符串路径 + 双层 commit/dispatch 调度，心智负担大。
Pinia 让它退化成「普通的函数调用」—— 这是它最大的简化点之一。
-->

---
transition: fade-out
---

# $onAction：监听 action 调用

做日志 / 性能监控 / 错误追踪

<v-click>

```ts
const cart = useCartStore();

const unsubscribe = cart.$onAction(({ name, args, after, onError }) => {
  const start = Date.now();
  after((result) => console.log(`✓ ${name} ${Date.now() - start}ms`));
  onError((err) => console.warn(`✗ ${name}`, err));
});
```

</v-click>

<v-click>

**回调参数**：`name` / `store` / `args` / `after`（成功）/ `onError`（失败）

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] $onAction 是 Pinia 的 action 调用拦截器 ——
所有 action 调用前都会先触发这个回调，让你做日志、监控、性能埋点。

`after` 和 `onError` 是两个回调注册函数：
- after(result)：action 成功 resolve 后执行，参数是返回值
- onError(err)：action 抛错或 Promise reject 后执行

[click] 典型应用：
- 性能监控：埋点每个 action 的耗时分布
- 错误追踪：把 onError 接到 Sentry / 日志服务
- 调试日志：开发环境打印每个 action 的入参/出参
- 全局 loading：action 开始时 loading++，after / onError 时 loading--

unsubscribe() 用于取消订阅 —— 全局监听通常不取消，组件内监听通常在 onUnmounted 取消。
-->

---
transition: fade-out
---

# storeToRefs：解构而不丢响应性

90% 项目都会用到的辅助函数

<v-click>

**问题：直接解构丢响应性**

```ts
const store = useCounterStore();
const { count } = store;        // count 是普通 number，与 store 解绑
store.count++;                  // 修改 store.count 不会影响 count
```

</v-click>

<v-click>

**解决：storeToRefs() 把 state/getters 包成 ref**

```ts
import { storeToRefs } from "pinia";

const store = useCounterStore();
const { count, doubleCount } = storeToRefs(store);  // 都是 ref
const { increment } = store;                         // actions 直接解构

store.count++;
console.log(count.value);  // 同步更新

// 模板里仍可写 {{ count }}（Vue 自动 unref）
```

</v-click>

<v-click>

> 💡 **规则**：state + getters 走 `storeToRefs`，actions 直接从 store 解构。

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Pinia 新手最常踩的坑 ——
Store 是个 reactive proxy，访问 `store.count` 是响应式的，
但 `const { count } = store` 是「值拷贝」，count 变成普通 number。

后续 `store.count++` 只更新 store 内部的响应式属性，不会通知到 count。

[click] storeToRefs 是 Pinia 提供的辅助函数 ——
它遍历 store 的 state + getters，把每个字段包装成 `toRef(store, key)`，
解构出来后是 ref，访问 .value 仍走 proxy，响应性保留。

actions 是函数，不需要响应性，直接从 store 解构即可。

[click] 这条规则建议刻进肌肉记忆：
- state / getters → storeToRefs(store)
- actions → store 解构（或不解构直接 store.xxx）
-->

---
transition: fade-out
---

# 在组件外使用 Store

Router guards / service 模块 / VueUse 集成

<v-click>

**❌ 错误：在 module 顶层调用**

```ts
import { useAuthStore } from "./auth";
const auth = useAuthStore();   // 报错：pinia 还未注册
```

</v-click>

<v-click>

**✅ 正确：在调用时点动态调用**

```ts
router.beforeEach((to) => {
  const auth = useAuthStore();   // ✅ 此时 pinia 已注册
  if (to.meta.requiresAuth && !auth.isLoggedIn) return "/login";
});
```

</v-click>

<v-click>

**也可以显式传 pinia 实例（SSR 必备）**

```ts
import { pinia } from "@/main";
const auth = useAuthStore(pinia);
```

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Pinia 的 useStore 依赖一个「activePinia」实例 ——
默认通过 Vue 的 inject 注入，必须等 `app.use(pinia)` 之后才可用。

如果你在 module 顶层（import 阶段）调用 useXxxStore，
此时 Vue app 还没创建，pinia 没注册，直接报错。

[click] 正确做法：把调用包到「调用时点」—— 函数体内、生命周期钩子内、事件回调内。
路由守卫是最典型的「组件外用法」—— 把 useStore 写到 beforeEach 函数体内即可。

[click] 当你确实需要在更早的时机（比如 service 模块）使用 Store，
可以从入口文件 export pinia 实例，然后 `useStore(pinia)` 显式传入。

SSR 场景必须显式传 —— 否则会拿到上一个请求的 pinia，造成状态泄漏。
-->

---
transition: fade-out
---

# TypeScript 进阶（一）：state 类型

为初始空数组 / null 字段标注类型

<v-click>

**Setup Store：直接用 ref 泛型**

```ts
interface User { id: number; name: string }
const user = ref<User | null>(null);
const userList = ref<User[]>([]);
```

</v-click>

<v-click>

**Option Store：用 as 断言初值**

```ts
export const useUserStore = defineStore("user", {
  state: () => ({
    userList: [] as User[],
    user: null as User | null,
  }),
});
```

</v-click>

<v-click>

> 💡 tsconfig 需开 `strict` 或 `noImplicitThis`，否则 Option Store 的 `this` 推导不到。

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Setup Store 的类型最简单 —— 直接用 ref 的泛型参数。
TS 自动从 ref<T>(initial) 推导后续 .value 的类型。

[click] Option Store 比较 tricky —— 空数组默认推导为 `never[]`，null 默认推导为 `null`，
都不是你想要的类型。所以必须用 `as Type` 断言初值。

这是个常见 TS 模式，不只 Pinia 有，写普通 Vue ref 也一样。

[click] tsconfig 的 `strict` 模式很重要 —— Pinia 内部依赖 `this` 推导
（getters 跨引用 / actions 内调用 this.xxx），noImplicitThis 关掉的话 TS 给不出提示。
-->

---
transition: fade-out
---

# TypeScript 进阶（二）：getter 推导

跨 getter 引用必须显式标注返回类型

<v-click>

**简单 getter：自动推导**

```ts
getters: {
  doubleCount: (state) => state.count * 2,   // 推导为 number
  upperName: (state) => state.name.toUpperCase(),
}
```

</v-click>

<v-click>

**跨 getter 引用：必须显式返回类型**

```ts
getters: {
  doubleCount(state): number {
    return state.count * 2;
  },
  doublePlusOne(): number {           // 必须标注，否则 this 推导失败
    return this.doubleCount + 1;
  },
}
```

</v-click>

<v-click>

> 💡 **原因**：TS 推导 getter 返回类型时无法解析 `this.xxx`（循环依赖），必须靠开发者「显式契约」断开循环。

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 普通 getter 只用 `state` 参数，TS 能直接推导返回值类型 —— 不用写任何标注。

[click] 但跨 getter 引用就麻烦了 —— `this.doubleCount` 的类型依赖于 doubleCount 的返回类型，
而 doubleCount 的返回类型又依赖于 state ——
这条推导链 TS 无法静态解析，会报 `any` 或循环错误。

解决方案：把跨引用 getter 的返回类型「显式写死」，TS 拿到契约后就能继续推导。

[click] 这是 TS 在面对「闭包内引用自身」时的通用限制，不只 Pinia ——
普通 class 写 getter 引用其他 getter 也会遇到。

实践建议：默认用 setup store + computed —— 完全规避这个问题，
computed 的类型推导是 Vue 自己做的，没有 this 困境。
-->

---
transition: fade-out
---

# 持久化：pinia-plugin-persistedstate

社区最流行插件，localStorage / cookies / 自定义 storage

<v-click>

**安装 + 注册**

```bash
pnpm add pinia-plugin-persistedstate
```

```ts
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
```

</v-click>

<v-click>

**Store 启用持久化**

```ts
export const useUserStore = defineStore(
  "user",
  () => {
    const token = ref("");
    const profile = ref<User | null>(null);
    return { token, profile };
  },
  { persist: true },   // 整个 Store 持久化到 localStorage
);
```

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] persistedstate 是 Pinia 生态最流行的插件 —— ~2KB 体积，
默认持久化整个 store 到 localStorage，开箱即用。

注册方式很标准：`pinia.use(plugin)` 一行，然后所有 Store 都可以加 persist 选项。

[click] persist: true 是最简单的「整个 Store 全持久化」。
也可以传对象指定细粒度：
- storage：换成 sessionStorage / cookies
- paths：只持久化部分字段（如不持久化 loading 状态）
- key：自定义 storage key

刷新页面后，Store 初始化时会自动从 storage 读回上次的 state —— 体验类似 React 的 redux-persist。
-->

---
transition: fade-out
---

# persistedstate 进阶配置

按需控制 storage / paths / serializer

<v-click>

```ts
export const useCartStore = defineStore(
  "cart",
  () => {
    const items = ref<CartItem[]>([]);
    const draft = ref("");
    const sessionFlag = ref(false);
    return { items, draft, sessionFlag };
  },
  {
    persist: [
      // 长期持久化到 localStorage
      { key: "cart-items", storage: localStorage, paths: ["items"] },
      // 会话级持久化到 sessionStorage
      { key: "cart-session", storage: sessionStorage, paths: ["sessionFlag"] },
    ],
  },
);
```

</v-click>

<v-click>

> 💡 `draft` 不在任何 paths 里，刷新页面后会丢失（仍为初始值）—— 适合「不该持久化」的瞬时状态。

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] persist 字段也可以传数组 —— 同一个 Store 的不同字段使用不同 storage 策略。

实际项目里常见的「拆分持久化」需求：
- 购物车列表 → localStorage（跨标签页共享 + 长期保留）
- 会话标志 → sessionStorage（关闭标签页即清除）
- UI 草稿（搜索框输入）→ 不持久化（刷新即清）
- 用户偏好（深色模式）→ localStorage

[click] 不在 paths 里的字段每次刷新都会回到初始值 —— 适合用作「瞬时状态」。

更高级的配置还包括：
- serializer：换成 JSON 之外的格式（如 superjson 支持 Date / Map / Set）
- beforeRestore / afterRestore：恢复前后钩子，做数据迁移
- afterHydrate：所有字段恢复完成后的回调
-->

---
transition: fade-out
---

# SSR：服务端渲染基础

按请求隔离 pinia 实例，避免状态泄漏

<v-click>

**入口区分 server / client**

```ts
// app.ts
export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  app.use(pinia);
  return { app, pinia };
}
```

</v-click>

<v-click>

**服务端：序列化 state**

```ts
const { app, pinia } = createApp();
const html = await renderToString(app);
const state = devalue(pinia.state.value);
return `<div id="app">${html}</div><script>window.__PINIA__=${state}</script>`;
```

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] SSR 场景下，多个请求会共享同一个 Node.js 进程 ——
如果直接用全局 pinia 实例，请求 A 的用户数据会泄漏到请求 B。

正确做法：每个请求 createApp() 时新建一个 pinia 实例，request-scoped。

[click] 服务端渲染完成后，需要把 pinia 的 state 序列化注入 HTML，
客户端 hydrate 时读回来 —— 否则客户端会从 0 重新加载所有数据。

devalue 是 Rich Harris 写的「比 JSON.stringify 更强大」的序列化库 ——
支持 Date / Map / Set / 循环引用，对 Pinia 状态足够安全。

注意：服务端序列化时要做 XSS 转义，避免 store 字段里的用户输入注入脚本。
-->

---
transition: fade-out
---

# SSR：客户端 hydrate

刷新初始 state，避免重复请求

<v-click>

```ts
// entry-client.ts
const { app, pinia } = createApp();

if (window.__PINIA__) {
  pinia.state.value = JSON.parse(window.__PINIA__);
}

app.mount("#app");
```

</v-click>

<v-click>

**SSR 注意事项**

- `useStore()` 仅在 `setup()` / action / getter 内调用，禁止在 `<script setup>` 外的 module 顶层调用
- 跨 Store 引用需在 await 之前完成（避免上下文丢失）
- 异步 action 在服务端要等待完成，否则首屏渲染拿不到数据
- 客户端 hydrate 必须在 `useStore()` 之前完成赋值

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 客户端 hydrate 步骤：
1. 读 window.__PINIA__（服务端注入的序列化 state）
2. 赋值给 pinia.state.value
3. 才能 app.mount() —— 此时 useStore 拿到的就是服务端预填好的数据

如果跳过这一步，首屏组件会从 useStore 拿到 store 的初始值（空数组 / null），
然后再次发起 API 请求 —— 浪费了服务端的渲染成果，且会闪一下空白。

[click] SSR 易错点都和「上下文」有关 ——
useStore() 必须在 setup 上下文里运行才能拿到对应请求的 pinia 实例。

跨 Store 引用要在 await 之前完成 —— 因为 await 之后异步上下文可能丢失。
Vue 3.4+ 引入了 effectScope 改善这个限制，但仍建议遵循约定。
-->

---
transition: fade-out
---

# Nuxt 集成：@pinia/nuxt

Nuxt 3+ 默认状态库，零配置自动导入

<v-click>

**安装 + 注册**

```bash
npx nuxi@latest module add pinia      # 或 pnpm add pinia @pinia/nuxt
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({ modules: ["@pinia/nuxt"] });
```

</v-click>

<v-click>

**Store 自动注册（无需 import）**

```ts
// stores/counter.ts  (Nuxt 3) 或 app/stores/counter.ts (Nuxt 4)
export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  function increment() { count.value++ }
  return { count, increment };
});
```

```vue
<script setup>
const counter = useCounterStore();  // 无需 import
</script>
```

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @pinia/nuxt 是官方 Nuxt 模块 —— 一行 `nuxi module add` 完成安装 + 配置。

[click] 注册模块即可，无需手动 createPinia / app.use —— Nuxt 自动接管。
SSR 状态隔离、状态序列化注入也都自动完成。

[click] Nuxt 3 的 stores/ 目录（Nuxt 4 是 app/stores/）会被自动扫描，
所有 `defineStore` + `useXxxStore` 函数自动注入到自动导入清单。

组件里直接写 `useCounterStore()` 即可，不用 import —— 体验类似 Vue 3 + auto-import 插件。

这种自动导入对小型项目很爽，但大型项目建议显式 import 以保持可追踪性。
-->

---
transition: fade-out
---

# Plugin 系统：扩展所有 Store

通用功能注入 / 调试 / 持久化

<v-click>

**最简插件：返回字段挂到 store**

```ts
function secretPlugin() {
  return { secret: "the cake is a lie" };
}

const pinia = createPinia();
pinia.use(secretPlugin);
console.log(useAnyStore().secret);   // "the cake is a lie"
```

</v-click>

<v-click>

**context 四件套**：`pinia`（实例）/ `app`（Vue app）/ `store`（被增强的 Store）/ `options`（定义时的选项）

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Pinia 插件就是个函数，可选返回一个对象 —— 返回的字段会被合并到每个 Store。

DevTools 会自动跟踪插件注入的字段，hover 时显示来源。

[click] context 让你访问当前正在创建的 store 与其元信息：
- store：可以直接 `store.$subscribe` / 添加方法
- options：读 defineStore 的第二参（state / actions / getters）
- pinia：访问全局 pinia 实例，比如 pinia.state.value 全局快照
- app：访问 Vue app 实例（很少用到）

写 plugin 的典型场景：
- 给所有 Store 统一注入 logger（$onAction 包装）
- 给所有 Store 统一 $reset（保存初值快照）
- 给所有 Store 统一持久化（persistedstate 就是这么实现的）
- 给所有 Store 注入 i18n / 路由实例
-->

---
transition: fade-out
---

# Plugin 实战：通用 $reset for Setup Store

补全 Setup Store 缺失的 $reset 能力

<v-click>

```ts
import type { PiniaPluginContext } from "pinia";
import { cloneDeep } from "lodash-es";

export function resetPlugin({ store }: PiniaPluginContext) {
  // 保存初始 state 快照（store.$state 已包含所有 ref 解包后的值）
  const initialState = cloneDeep(store.$state);

  store.$reset = () => {
    store.$patch(($state) => {
      Object.assign($state, cloneDeep(initialState));
    });
  };
}

// main.ts
pinia.use(resetPlugin);

// 现在所有 Setup Store 都能 store.$reset() 了
```

</v-click>

<v-click>

> 💡 **思路**：在每个 Store 首次创建时记录初值快照，注入 `$reset` 方法将 `$state` 整体覆盖回快照。

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Pinia 插件最常见的实战案例 —— 补全 Setup Store 缺失的 $reset。

实现思路：
1. 在 store 初始化时（plugin 函数被调用时），用 cloneDeep 保存 $state 快照
2. 注入 $reset 方法 —— 调用 $patch(state => Object.assign(state, snapshot))
3. cloneDeep 第二次 —— 防止 reset 后 state 与 snapshot 共享引用

[click] 这种「快照式 reset」对大多数业务 Store 够用了。
更进阶的版本可以监听特定字段不重置（如认证 token），
或支持 `store.$reset(['count', 'name'])` 这种局部 reset 参数 —— 留作练习。

类似思路可以扩展到：
- undo / redo（保存历史快照栈）
- diff（计算当前 state 与上次的差异）
- replay（重放 action 序列复现 bug）
-->

---
transition: fade-out
---

# HMR：保持热更新时的状态

Vite 默认支持，每个 store 加一行模板代码

<v-click>

```ts
// stores/counter.ts
import { defineStore, acceptHMRUpdate } from "pinia";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  function increment() { count.value++ }
  return { count, increment };
});

// HMR：修改本文件时保留 state，不刷新页面
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot));
}
```

</v-click>

<v-click>

**效果**：改 action 立即生效保 state / 增删字段自动同步 / DevTools 显示已热更新

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] acceptHMRUpdate 是 Pinia 提供的 HMR 桥接器 ——
在 Vite 检测到 store 文件变更时调用，diff 新旧定义，仅替换变化部分。

代价：每个 store 文件末尾要写一行（可以用 ESLint snippet / Vite 插件自动注入）。
收益：开发体验质变 —— 改 store 不丢已有状态，调试时不用每次重置数据。

[click] 实际表现：
- 改 action：state 保留，新 action 立刻可用 —— 调试体验最佳
- 改 state 初值：旧字段保留，新字段按新值初始化
- 改 getter 公式：立即生效，下次访问重算

Webpack 用 `import.meta.webpackHot` 而不是 `import.meta.hot`，
但 Vite 已是 Vue 生态主流，绝大多数项目能直接吃到。
-->

---
transition: fade-out
---

# 测试：单元测试 Store

setActivePinia + createPinia 隔离每个测试

<v-click>

```ts
import { setActivePinia, createPinia } from "pinia";

describe("Counter Store", () => {
  beforeEach(() => setActivePinia(createPinia()));   // 每测试一个干净实例

  it("increments", () => {
    const counter = useCounterStore();
    counter.increment();
    expect(counter.count).toBe(1);
  });

  it("doubles correctly", () => {
    const counter = useCounterStore();
    counter.count = 3;
    expect(counter.doubleCount).toBe(6);
  });
});
```

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Store 单元测试比 Vuex 时代简单很多 ——
不需要 mock store、不需要 inject、直接调用 useXxxStore() 就能拿实例。

setActivePinia(createPinia()) 是关键 ——
它让 Pinia 知道「当前活跃的 pinia 实例」，后续 useStore 才能拿到。
每个测试用例 beforeEach 重新创建，保证测试间隔离。

测试 store 的常见场景：
- 验证 action 逻辑（初值 → 调用 action → 断言新值）
- 验证 getter 派生（设置 state → 读 getter → 断言结果）
- 验证错误处理（mock api 抛错 → 断言 error 字段）
- 验证副作用（mock $subscribe / 监听 localStorage）

不需要任何专门的 mock 框架，普通 Vitest / Jest 就够。
-->

---
transition: fade-out
---

# 测试：组件中的 Store

createTestingPinia mock actions / initialState

<v-click>

```ts
import { createTestingPinia } from "@pinia/testing";

it("calls increment on click", () => {
  const wrapper = mount(CounterButton, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,                         // Vitest 配合
          initialState: { counter: { count: 99 } }, // 注入初始 state
        }),
      ],
    },
  });

  const store = useCounterStore();
  wrapper.find("button").trigger("click");
  expect(store.increment).toHaveBeenCalled();   // actions 默认被 stub
});
```

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @pinia/testing 是官方测试工具包 —— 提供 createTestingPinia 简化组件测试。

关键能力：
- actions 默认被 stub 成 spy 函数（可断言调用次数与参数）
- initialState 注入测试需要的初始数据
- stubActions: false 切换到「调用真实 action」模式

createSpy 配置告诉 testing-pinia 用哪个测试框架的 spy 实现 ——
Vitest 传 vi.fn，Jest 传 jest.fn。

这套工具让「组件 + store 协作」的单元测试非常顺手 ——
传统做法需要 mock 整个 Vuex store，Pinia 一行 plugins 搞定。
-->

---
transition: fade-out
---

# 从 Vuex 4 迁移到 Pinia

API 对照表 + 渐进迁移策略

<v-click>

| Vuex 4                             | Pinia                                  |
| ---------------------------------- | -------------------------------------- |
| `Vuex.Store({ modules })`          | `createPinia()`                        |
| `module.mutations`                 | **无**（actions 直接改 state）         |
| `module.actions` / `getters`       | `defineStore.actions` / `getters`      |
| `store.commit('user/SET_NAME', n)` | `store.name = n` 或 `store.setName(n)` |
| `store.dispatch('user/login')`     | `store.login()`                        |
| `mapState` / `mapActions`          | `storeToRefs(store)` / 直接解构        |

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Vuex 4 → Pinia 的核心对照表 ——

最大的变化是「mutations 消失」：所有 state 变更走 action 或直接赋值。
原来 `mutations: { SET_NAME(state, name) { state.name = name } }` + `commit('SET_NAME', x)` 这一套，
现在变成 `actions: { setName(name) { this.name = name } }` 或干脆直接 `store.name = x`。

第二大变化是「namespaced 消失」：
原来 `dispatch('user/profile/security/changePassword', payload)`
现在 `useSecurityStore().changePassword(payload)`

第三大变化是「mapState / mapActions 简化」：
mapState 直接被 storeToRefs 取代，mapActions 直接被解构取代。

实际迁移路径：
1. 安装 Pinia 并 createPinia()，与 Vuex 共存
2. 逐个 module 转 defineStore（先迁简单的，再迁带 module 依赖的）
3. 全部迁完后卸载 Vuex
-->

---
transition: fade-out
---

# 常见踩坑（一）：解构丢响应性

Top 1 新手错误

<v-click>

**❌ 错误**

```ts
const { count, doubleCount } = useCounterStore();   // 失去响应性
```

</v-click>

<v-click>

**✅ 正确**

```ts
import { storeToRefs } from "pinia";

const counter = useCounterStore();
const { count, doubleCount } = storeToRefs(counter);   // state + getters
const { increment } = counter;                          // actions 直接解构
```

</v-click>

<v-click>

**判别原则**

- 字段类型是 ref / computed → `storeToRefs`
- 字段类型是 function → 直接解构
- 直接 `store.x` 始终响应式（最保险）

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Pinia 新手 80% 都会踩的坑 —— 看到 store 是个 object 就习惯性解构。
但解构出来的是「值快照」，不是 reactive ref。

[click] 修复方法很简单 —— state + getters 走 storeToRefs，actions 走普通解构。

实际开发中建议把这两行写进 IDE snippet：
```
const xxx = useXxxStore();
const { ... } = storeToRefs(xxx);
```

[click] 判别原则记住「函数 vs 数据」—— 
函数（action）不需要响应性，数据（state / getter）需要响应性。

最保险的写法：不解构，全程用 `store.xxx` 访问 —— 性能没差，可读性也不差。
团队规范里可以直接禁止「在模板用解构变量」，强制全部走 store.x。
-->

---
transition: fade-out
---

# 常见踩坑（二）：在 module 顶层调用 useStore

时机问题，pinia 还没注册

<v-click>

**❌ 错误：import 阶段执行**

```ts
import { useAuthStore } from "@/stores/auth";
const auth = useAuthStore();   // ❌ getActivePinia() called before...
export const apiClient = axios.create({
  headers: { Authorization: `Bearer ${auth.token}` },
});
```

</v-click>

<v-click>

**✅ 正确：调用时延迟到函数体内**

```ts
export function getAuthHeader() {
  const auth = useAuthStore();   // ✅ 调用时 pinia 已就绪
  return { Authorization: `Bearer ${auth.token}` };
}
```

</v-click>

<v-click>

> 💡 **规则**：useXxxStore 不能在 import 阶段（module 顶层）调用，必须延迟到函数体或生命周期钩子内。

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这个坑的本质：useStore 依赖一个「activePinia」实例，
该实例在 `app.use(pinia)` 时才被注入到 Vue app 上。

如果你在 module 顶层调用 useStore，import 解析阶段 pinia 还不存在，直接报错：
```
Error: [🍍]: "getActivePinia()" was called but there was no active Pinia.
```

[click] 修复方法：把 useStore 调用包到函数体里，确保运行时 pinia 已注册。
组件的 setup() 自动满足这条件，所以 Vue SFC 内调用没问题。

非组件场景（axios 拦截器、router guard、service 模块）必须用「函数包裹」模式。

[click] 另一个解法：从 main.ts 导出 pinia 实例，然后 `useAuthStore(pinia)` 显式传入 ——
SSR 场景必须这么做（每个请求一个 pinia）。
-->

---
transition: fade-out
---

# 常见踩坑（三）：循环依赖

A → B → A 的 getter 链路

<v-click>

**❌ 危险模式**

```ts
export const useCartStore = defineStore("cart", () => {
  const user = useUserStore();
  const total = computed(() => user.creditLimit - 100);
  return { total };
});
export const useUserStore = defineStore("user", () => {
  const cart = useCartStore();
  const remainingCredit = computed(() => cart.total + 50);  // ⚠️ 死循环
  return { remainingCredit };
});
```

</v-click>

<v-click>

**✅ 避免方案**

- 抽出共享层：放第三方 Store（如 `useAccountStore`）持有两边都需要的字段
- 单向依赖：约定「下层 Store 不引用上层」
- 调用时引用：在 action 内 `useXxxStore()` 而非 setup 开头

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 循环依赖在大型 Pinia 项目里偶尔出现 ——
当两个 Store 互相引用对方的派生字段，computed 链就会变成 A.x → B.y → A.x 的死循环。

Pinia 不会自动检测这种情况 —— 表现为「无限递归 / 栈溢出」或「state 卡住」。

[click] 三种避免方案：

第一种最干净 —— 把共享数据抽到第三方 Store，两边都引用它，但它不引用任何一边。
这等同于「依赖反转」，让两个 Store 都依赖一个稳定的下层。

第二种是约定 —— 团队规范里规定「业务 Store 可以引用通用 Store，反之不行」，
类似 Domain-Driven Design 的「层次清晰」原则。

第三种最实用 —— 在 action 内引用对方（运行时），而非 setup 开头（构造时）。
action 调用是事件触发的，不会形成 computed 依赖链。
-->

---
transition: fade-out
---

# 常见踩坑（四）：SSR hydration mismatch

服务端 / 客户端状态不一致

<v-click>

**典型现象**：控制台 `Hydration mismatch` 警告 / 首屏闪烁 / 数据丢失（客户端拿到初始值）

</v-click>

<v-click>

**常见根因**

| 根因                                | 解决方案                                       |
| ----------------------------------- | ---------------------------------------------- |
| 忘记 hydrate `pinia.state.value`    | mount 前 `JSON.parse(window.__PINIA__)`        |
| 服务端调用 `Date.now()` / 随机数    | 用固定值，或仅在 onMounted 调用                |
| 客户端 store 又发了一次 API 请求    | action 内判断 `if (this.data) return;`         |
| 持久化 plugin 覆盖了服务端预填      | persist 配 `clientOnly: true`                  |

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] hydration mismatch 是 SSR 项目最难调试的问题 ——
表面是 Vue warning，根因往往是 Pinia state 在服务端 / 客户端「初值不一致」。

最常见的现象是首屏闪烁 —— 用户先看到服务端渲染的列表，0.5 秒后被客户端的空列表替换。

[click] 四种典型根因 + 修复：

1. 没 hydrate：服务端把 state 写进 window.__PINIA__，但客户端没 JSON.parse 回去。
   修复：mount 前赋值给 pinia.state.value。

2. 非确定性数据：Date.now() / Math.random() / 时区敏感格式化 ——
   服务端拿到 A 值，客户端拿到 B 值，必然 mismatch。
   修复：用预定值，或 onMounted 内更新（仅客户端执行）。

3. 重复请求：组件 mount 时无脑发 API，覆盖了服务端预填。
   修复：action 开头判断「已有数据则跳过」，或用 useAsyncData 这种 Nuxt 工具。

4. persistedstate 反向覆盖：客户端读 localStorage 覆盖了服务端的 fresh data。
   修复：plugin 配 `clientOnly`，或 hydrate 后再启用 persist。
-->

---
transition: fade-out
---

# 实战：构建一个 Cart Store

完整示例覆盖 state / getters / actions / 跨 Store

<v-click>

```ts
// stores/cart.ts
import { defineStore, acceptHMRUpdate } from "pinia";

interface CartItem { id: number; name: string; price: number; qty: number }

export const useCartStore = defineStore("cart", () => {
  const auth = useAuthStore();
  const items = ref<CartItem[]>([]);
  const loading = ref(false);
  const total = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0));
  const itemCount = computed(() => items.value.reduce((n, i) => n + i.qty, 0));

  async function load() {
    if (!auth.isAuthenticated) return;
    loading.value = true;
    try { items.value = await fetchCart(auth.token); }
    finally { loading.value = false; }
  }
  return { items, loading, total, itemCount, load };
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
```

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是一个生产级 Cart Store 的完整示例，覆盖：

- TypeScript 类型（CartItem interface）
- 跨 Store 引用（useAuthStore）
- 异步 action（load）+ loading 标志
- 错误处理（try / finally）
- 派生 getter（total / itemCount）
- HMR 支持（acceptHMRUpdate）

实际项目可以再加：
- $subscribe 持久化（或用 persistedstate 插件）
- $onAction 日志埋点
- 防抖 / 节流（用 VueUse 的 useDebounceFn）
- 乐观更新 + 回滚（addItem 立即修改 state，失败时回滚）
- 错误状态（error ref + 组件层显示 toast）

这是真实生产代码的最小模板 —— 你可以基于此扩展到购物车、订单、用户、评论等业务 Store。
-->

---
transition: fade-out
---

# Pinia vs 其他 Vue 状态方案

什么时候 Pinia 不是最佳选择？

<v-click>

| 场景                       | 推荐方案               | 原因                          |
| -------------------------- | ---------------------- | ----------------------------- |
| Vue 3 + 跨组件共享         | **Pinia**              | 官方推荐，DevTools 集成       |
| 单组件 / 父子组件          | `ref` + `provide`      | Pinia 是 overkill             |
| 小项目（< 3 个 Store）     | `ref` 模块 + import    | 不必引入 Pinia                |
| 异步数据 / 缓存 / 请求     | **TanStack Query**     | Pinia 不是数据缓存层，需配合  |
| 表单状态                   | VeeValidate / 本地 ref | Pinia 全局存表单 = 状态泄漏   |
| URL query 同步             | Vue Router + 本地 ref  | Pinia 不是路由状态层          |

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Pinia 强大，但不是所有状态都该塞进 Pinia ——

「单组件状态」用 ref / reactive 即可，扔进 Pinia 反而增加心智负担。
「父子组件共享」用 provide / inject + ref，更轻量。
「小项目」根本不需要状态管理库 —— 几个 composable 模块就够。

「异步数据 / 缓存」是 TanStack Query 的强项 —— 它解决了「服务端状态」的去重、缓存、失效、重试问题。
Pinia 适合管「客户端状态」（用户登录、UI 状态、表单草稿）。
最佳实践是两者配合：TanStack Query 负责 API 缓存，Pinia 负责跨页面共享状态。

「表单状态」尤其不该用 Pinia —— 多个表单字段、校验状态、错误信息塞进全局 Store 会污染。
用 VeeValidate / FormKit 或干脆组件本地 ref。

「URL query」（如分页、筛选、搜索词）应该是 Router 的职责，
用 `useRouteQuery`（VueUse）双向绑定，刷新 / 分享 / 回退都自动同步。

记住：状态管理库不是「万能存储桶」，每种状态有它合适的位置。
-->

---
transition: fade-out
---

# 性能优化技巧

大型 Store / 高频更新场景

<v-click>

**1. 避免 store 内重型对象**

```ts
// ❌ 大对象做 state（每次访问都触发响应式追踪）
const cache = ref(new Map<string, BigData>());

// ✅ 用 shallowRef + markRaw（仅追踪顶层引用）
import { shallowRef, markRaw } from "vue";
const cache = shallowRef(markRaw(new Map<string, BigData>()));
```

</v-click>

<v-click>

**2. 高频更新用 $patch 合并**

```ts
// ✅ 批量 patch 减少响应式触发
store.$patch((state) => state.items.forEach((i) => (i.selected = true)));
```

</v-click>

<v-click>

**3. 派生状态懒计算**：用 `computed` 缓存，依赖未变不重算（`computed(() => heavyCalc(items.value))`）

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 大型应用里 Pinia Store 的性能瓶颈通常来自三个方向：

第一是「响应式追踪开销」—— 大对象（>10MB 数据 / 上万节点的树）放进 ref，
Vue 会深度代理每个属性，访问 / 修改都有性能损耗。
解决方案：shallowRef 只代理顶层，markRaw 彻底跳过代理（适合不需要响应式的缓存数据）。

[click] 第二是「批量更新」—— 一帧内多次修改 state，每次都触发 effect / 渲染。
$patch 把多次变更合并成一次响应式触发，性能提升明显（特别是循环修改大数组）。

[click] 第三是「派生状态重复计算」——
如果 getter 涉及复杂计算（排序、过滤、聚合），用 computed 缓存依赖，
依赖未变就不重算。

这些技巧不是「日常都要用」，而是「性能 profiler 显示瓶颈时再针对优化」——
过早优化是万恶之源，Pinia 默认就够快。
-->

---
transition: fade-out
---

# 调试技巧：Vue DevTools

Pinia 集成是 Vue DevTools 最强大的功能之一

<v-click>

**Vue DevTools 中的 Pinia 面板**

- **State 树**：每个 Store 的 state 实时显示，支持就地编辑
- **Actions 日志**：每次 action 调用记录时间、参数、返回值
- **Time Travel**：回到任意历史时刻的 state 快照
- **Edit State**：直接修改 state 值，应用立即响应
- **Trigger Action**：UI 上点击触发任意 action
- **Filter by Store**：多 Store 项目里筛选只看某个

</v-click>

<v-click>

**调试模式**

```ts
// 在 plugin 中给 store 加调试信息
pinia.use(({ store }) => {
  store._customProperties.add("hello");
  store.hello = "DevTools will see this label";
});
```

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vue DevTools 的 Pinia 面板是 Pinia 相对其他状态库的最大优势之一 ——

State 树就地编辑：你可以在 DevTools 里直接改 store.count = 100，组件立即响应。
这对调试边界条件超级好用 —— 不用写测试，直接改值试 UI。

Actions 日志按时间排列：每次调用显示「from → to」的 state diff，
配合 time-travel 可以倒退到任意时刻，调试复现 bug 神器。

[click] 给 plugin 注入的字段，可以通过 `store._customProperties.add(key)` 让 DevTools 跟踪。
显示效果：DevTools 把它标记为「Plugin」来源，区别于普通 state。

实战建议：开发环境务必装 Vue DevTools 扩展，Pinia 调试体验天差地别。
-->

---
transition: fade-out
---

# 项目结构最佳实践

stores/ 目录组织建议

<v-click>

**按业务领域划分**

```
src/stores/
├── index.ts         # pinia 实例 + plugin 注册
├── auth.ts          # 认证 / 当前用户 / token
├── user.ts          # 用户列表 / profile
├── cart.ts          # 购物车
├── ui.ts            # 全局 UI 状态（侧边栏 / 主题）
└── plugins/
    ├── reset.ts     # 通用 $reset 插件
    └── logger.ts    # action 日志插件
```

</v-click>

<v-click>

**命名约定**

- 文件名小写：`cart.ts` / `user-profile.ts`
- 函数 PascalCase + `use` 前缀：`useCartStore` / `useUserProfileStore`
- Store ID 与文件名一致：`defineStore("cart", ...)`

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 推荐的目录结构：

stores/index.ts —— 集中创建 pinia 实例 + 注册插件 + 导出。
main.ts 里只需 `app.use(pinia)`。

按业务划分：auth / user / cart / product —— 每个文件对应一个 defineStore。
不要按技术分（state.ts / actions.ts / getters.ts），Pinia 已经把这些合并了。

plugins/ 目录放自定义 Pinia 插件 —— $reset / logger / persist 等通用扩展。

[click] 命名约定：
- 文件名小写 kebab-case 或单词 —— 与 Vue / React 生态一致
- 函数 useXxxStore —— 与 composable 命名一致（IDE 自动导入工作良好）
- Store ID 与文件名保持一致 —— DevTools 显示直观

避免命名：
- userStore / cartStore（缺少 use 前缀，看起来不像 composable）
- $store / mainStore（语义模糊）
- root / global（Pinia 没有 root concept）
-->

---
transition: fade-out
---

# 生产部署清单

发布前检查项

<v-click>

- ✅ 所有 store 加 `acceptHMRUpdate`（开发体验）
- ✅ 关键 store 单元测试覆盖（`setActivePinia` + `createPinia`）
- ✅ 持久化 store 用 `persistedstate` 插件（避免手写 $subscribe）
- ✅ SSR 项目检查 hydration（无 mismatch 警告）
- ✅ DevTools 集成验证（生产构建仍可访问）
- ✅ TypeScript strict 模式（类型推导完整）
- ✅ 跨 store 引用无循环（用第三方 store 解耦）
- ✅ 大型 state 用 `shallowRef` / `markRaw` 优化
- ✅ 路由守卫内 useStore 写在函数体（非 module 顶层）
- ✅ 表单 / URL query 不放 Pinia（用本地 ref / VueUse）

</v-click>

<v-click>

> 💡 **打包配置**：Pinia 自动 tree-shake，未使用的 Store 不会进 bundle。Vite 默认就好。

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是一份 Pinia 项目上线前的「健康检查清单」——

开发体验类（HMR / DevTools / TS strict）建议项目脚手架就开启，免得后期补。

测试覆盖建议覆盖：
- action 逻辑（success / error 分支）
- getter 派生（边界条件）
- 跨 Store 协作（mock 一边的 state，断言另一边的派生）

SSR 项目额外检查 hydration mismatch —— 控制台 warning 不能有。

[click] Pinia 的 tree-shaking 是自动的 —— 
defineStore 是 lazy 注册，只在 useXxxStore() 被调用时才进 bundle。
未用 store 即使 import 了也会被 Rollup / Vite 标记为 dead code 移除。

发布前用 `vite build` + `pnpm dlx vite-bundle-visualizer` 查看 bundle 组成，
确认 Pinia 占用 ~1.5 KB，未引用的 Store 已被剔除。
-->

---
transition: fade-out
---

# 学习路径

从入门到精通的资源地图

<v-click>

**官方资源**

- [Pinia 官方文档](https://pinia.vuejs.org/) — 必读，结构清晰
- [Pinia GitHub](https://github.com/vuejs/pinia) — 源码 + Issue + Discussions
- [Vue Mastery 课程](https://www.vuemastery.com/courses/pinia-fundamentals/) — Eduardo 亲自录制

</v-click>

<v-click>

**生态插件**

- [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/) — 持久化
- [@pinia/testing](https://www.npmjs.com/package/@pinia/testing) — 测试工具
- [@pinia/nuxt](https://nuxt.com/modules/pinia) — Nuxt 集成
- [pinia-undo](https://www.npmjs.com/package/pinia-undo) / [pinia-shared-state](https://www.npmjs.com/package/pinia-shared-state) — 撤销 / 跨标签页同步

</v-click>

<v-click>

**实战项目参考**：VueUse / Nuxt 官方示例 / Vue Mastery 项目案例

</v-click>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Pinia 学习路径推荐：

1. 官方文档先看一遍 —— 比想象中短，3 小时能过完核心概念
2. 跟着写一个 Todo / Cart 项目 —— Setup Store + storeToRefs + 跨 Store 引用全用上
3. Vue Mastery 的 Pinia Fundamentals 课程是 Eduardo 亲自讲的，原作者视角最纯正

[click] 生态插件按需选用：
- 持久化几乎所有项目都要用 → persistedstate
- 单元测试必装 → @pinia/testing
- Nuxt 项目 → @pinia/nuxt（一键集成）
- 高级需求 → undo / shared-state 等

[click] 实战参考：
VueUse 是 Pinia 生态最好的伙伴 —— useStorage / useDebounceFn / useEventBus 与 Pinia 完美配合。
Nuxt 官方示例展示了「Nuxt + Pinia + SSR」的标准模式。

Pinia 文档不算长但每页都有干货，建议「读完文档 + 写一个项目 + 翻一遍源码」三步走，
一周时间就能从入门到能 hold 住大型项目。
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 🍍

Pinia — Vue 3 时代的官方状态管理标准

<div class="mt-8 text-lg">

**核心心智**

- Composition Store 是未来 —— 写 Store 像写 composable
- storeToRefs 是必备 —— 解构 state / getters 不丢响应性
- DevTools 是利器 —— time-travel + HMR 让调试质变
- 不要把所有状态塞进 Pinia —— 表单 / URL 各有其位

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://pinia.vuejs.org/" target="_blank" class="slidev-icon-btn">
    📖 官方文档
  </a>
  <a href="https://github.com/vuejs/pinia" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
</div>

<style>
h1 {
  background-color: #FFD859;
  background-image: linear-gradient(45deg, #FFD859 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：Pinia = Composition API 时代的 Vuex —— 砍掉 mutations、扁平化 store、原生 TS 推导。

核心心智四条：
1. Setup Store 写法贴合 Vue 3 生态，Option Store 仅作向后兼容
2. 解构必走 storeToRefs，否则响应性丢失（80% 新手坑都在这）
3. DevTools 集成无可替代，调试效率质变
4. 状态管理不是万能桶 —— 表单用 VeeValidate，缓存用 TanStack Query，URL 用 Router

下一步建议：跟着官方文档实战一个小项目，把今天讲的所有 API 都用一遍 ——
那时再回头看 Vuex 项目，就会有「再也回不去了」的感觉。

感谢观看！
-->
