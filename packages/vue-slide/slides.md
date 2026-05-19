---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Vue
info: |
  Presentation Vue 3 for frontend developers.

  Learn more at [https://cn.vuejs.org](https://cn.vuejs.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:vue class="text-7xl" />
</div>

<br/>

## Vue 3.5：编译时优化 + 运行时小核

模板编译期就把 diff 量压到最小，运行时只负责响应式追踪

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Vue 3.5。

Evan You 的渐进式框架，响应式 + SFC 起家，Composition API 之后已经是一线团队的主流选择。
-->

---
transition: fade-out
---

# 什么是 Vue？

Evan You 主导的渐进式 JS 框架，模板 + 响应式 + 单文件组件三件套

<v-click>

- **心智模型简单**：SFC 三段式（template / script / style），一天上手
- **编译时优化重**：patchFlag / 静态提升 / cacheHandlers，运行时 diff 量比 React 少一档
- **响应式优雅**：Proxy 自动追踪依赖，无依赖数组，无 Rules of Hooks 噪声
- **渐进式**：从一个 script 标签到 Nuxt 全栈，新老项目都好上手
- **生态完整**：Vue Router / Pinia / Vite / VueUse / Nuxt 全官方背书
- **UI 库选择多**：Element Plus / Naive UI / Vuetify / Ant Design Vue / Vant / Quasar

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Vue_](https://cn.vuejs.org/)

</div>

<style>
h1 {
  background-color: #41B883;
  background-image: linear-gradient(45deg, #41B883 10%, #34495E 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---
transition: slide-up
level: 2
---

# 评价

优点压倒缺点，但有「天花板」要注意

<v-clicks>

**优点**
- 学习曲线平缓，模板语法接近 HTML
- 编译期优化 + Proxy 响应式 → 同等业务 bundle / 运行时领先 React
- Composition API + script setup + TypeScript 一线 DX
- 国内生态尤其完善，UI 库百花齐放

**缺点**
- 国际人才市场比 React 小一个数量级
- Vapor Mode 长期 alpha，Solid / Qwik 已稳定
- SSR / 元框架几乎只有 Nuxt 一条路
- 老项目 Options API + mixed 风格 TS 推导吃力

</v-clicks>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 关键特性 |
|---|---|---|
| **2.0** | 2016.9 | Virtual DOM、SSR |
| **3.0** | 2020.9 | Proxy / Fragments / Teleport / Suspense |
| **3.2** | 2021.8 | `<script setup>` 稳定 |
| **3.3** | 2023.5 | Generic Components |
| **3.4** | 2023.12 | `defineModel` 稳定 |
| **3.5** | 2024.9 | 响应式 props 解构 / `useId` / Lazy Hydration |
| **Vapor** | 孵化中 | 跳过 VDOM 编译输出 |

<v-click>

**今天主要讲 3.5**。Vapor 仍在 alpha，生产请用标准 `<script setup>`。

</v-click>

---
transition: slide-up
---

# 心智模型：一句话总结

**编译时把模板转成最优渲染函数，运行时只负责响应式追踪与 DOM 更新**

```
*.vue 文件
  ↓ @vitejs/plugin-vue
  ├ <template>  → render function（含 patchFlag / hoisting）
  ├ <script setup> → setup() + 自动暴露
  └ <style scoped> → 加 data-v-xxx + CSS rewrite
  ↓
最终产物：经过 patchFlag 标记的 vnode + Proxy reactive
```

<v-click>

对比 React：

| 维度 | Vue 3 | React 19 |
|---|---|---|
| 模板 | 编译时优化（patchFlag / block） | 全运行时（JSX 直译） |
| 响应式 | Proxy 自动追踪 | useState + 手动依赖 |
| 更新粒度 | 组件内只 diff 动态部分 | 整组件函数重跑 |

</v-click>

---
transition: slide-up
---

# 快速开始

```bash
# 官方脚手架（推荐）：Vite + 交互式选 TS / Router / Pinia / Vitest
pnpm create vue@latest

# 极简：仅 Vue + Vite
pnpm create vite@latest my-app -- --template vue-ts

cd my-app && pnpm install && pnpm dev
```

<v-click>

```
my-app/
├── src/
│   ├── components/         # 可复用组件
│   ├── composables/        # 自定义 useXxx
│   ├── views/              # 路由对应页面
│   ├── router/index.ts
│   ├── stores/             # Pinia
│   ├── App.vue
│   └── main.ts             # createApp + mount
├── index.html              # Vite SPA 入口（根目录！）
└── vite.config.ts
```

</v-click>

<v-click>

要求 Node 20.19+ / 22.12+（Vite 7 限制）。HMR 默认开启，浏览器打开 `http://localhost:5173`。

</v-click>

---
transition: slide-up
---

# 第一个 SFC

```vue
<!-- HelloButton.vue -->
<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ label: string }>()
const emit = defineEmits<{ click: [ts: number] }>()
const count = ref(0)
function onClick() {
  count.value++
  emit('click', Date.now())
}
</script>

<template>
  <button @click="onClick">{{ label }} ({{ count }})</button>
</template>

<style scoped>
button { padding: 8px 16px; background: #41b883; color: white; }
</style>
```

<v-click>

三段式：`<template>` + `<script setup>` + `<style scoped>`。`scoped` 给 DOM 加 `data-v-xxx`，CSS 只影响当前组件。

</v-click>

---
transition: slide-up
---

# `<script setup>` 编译器宏

宏在编译期被替换成实际代码，运行时不存在；直接用，不需要 import。

```vue
<script setup lang="ts">
// Props / Emits
const props = defineProps<{ title: string }>()
const emit = defineEmits<{ close: [] }>()

// 暴露给父组件 / 选项 / 类型化 slots
defineExpose({ greet })
defineOptions({ name: 'MyComponent', inheritAttrs: false })
defineSlots<{ default(props: { item: Item }): any }>()

// 双向绑定（3.4+） / 3.5+ 模板 ref + 唯一 id
const model = defineModel<string>({ required: true })
const input = useTemplateRef<HTMLInputElement>('input')
const id = useId()
</script>
```

---
transition: slide-up
---

# 模板语法核心

```vue
<template>
  <!-- 文本插值（仅表达式，不能 if / for） -->
  <span>Message: {{ msg }}</span>
  <span>{{ ok ? 'YES' : 'NO' }}</span>

  <!-- 属性绑定（: 是 v-bind 简写） -->
  <a :href="url" :class="{ active: isActive }">link</a>

  <!-- 事件绑定（@ 是 v-on 简写） -->
  <button @click="onClick">Click</button>
  <button @click="count++">+1</button>

  <!-- 双向绑定 -->
  <input v-model="text" />

  <!-- 条件渲染 -->
  <div v-if="user.role === 'admin'">Admin</div>
  <div v-else-if="user.role === 'editor'">Editor</div>
  <div v-else>Viewer</div>

  <!-- 列表渲染（key 必填） -->
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>
</template>
```

---
transition: slide-up
---

# `v-if` vs `v-show`

| 维度 | `v-if` | `v-show` |
|---|---|---|
| DOM 存在 | true 才挂 | 始终存在 |
| 切换开销 | 高（mount/unmount） | 低（CSS toggle） |
| 适合 | 不频繁切换 | 频繁切换 |

<v-click>

```vue
<!-- ❌ v-for + v-if 同元素：Vue 3 中 v-if 优先 -->
<li v-for="item in items" v-if="item.active" :key="item.id" />

<!-- ✅ 推荐：computed 过滤 -->
<script setup>
const activeItems = computed(() => items.value.filter(i => i.active))
</script>
<template>
  <li v-for="item in activeItems" :key="item.id" />
</template>
```

</v-click>

---
transition: slide-up
---

# 响应式：ref vs reactive

```ts
// ref：单值 + 对象都用
const count = ref(0)
const user = ref<{ name: string }>({ name: 'Alice' })
count.value++                    // 修改要 .value（模板内自动 unwrap）

// reactive：对象深响应（Proxy）
const state = reactive({ count: 0, user: { age: 30 } })
state.count++
```

<v-click>

**官方推荐优先用 `ref`**：

```ts
// ❌ reactive 解构 / 替换整体都失去响应
const { count } = reactive({ count: 0 })
let s = reactive({ a: 1 }); s = reactive({ a: 2 })

// ✅ ref 永远安全：解构、跨函数、替换都不出问题
const count = ref(0)
```

</v-click>

---
transition: slide-up
---

# computed 派生值

```ts
import { ref, computed } from 'vue'

const items = ref([{ price: 5 }, { price: 3 }])
const tax = ref(0.1)

// 自动追踪依赖、缓存结果
const total = computed(() =>
  items.value.reduce((s, i) => s + i.price, 0) * (1 + tax.value),
)

// 可写 computed（不常用）
const firstName = ref('Alice'), lastName = ref('Smith')
const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (v) => { [firstName.value, lastName.value] = v.split(' ') },
})
```

<v-click>

**关键特性**：

- **带缓存**：依赖未变多次访问只算一次；对比 method 调用每次都跑
- **必须纯函数**：不要在 computed 内做 fetch / 改其它 state
- **不要返回 reactive 对象**：会破坏响应链

</v-click>

---
transition: slide-up
---

# watch vs watchEffect

```ts
// watch：显式指定源 + 拿到 oldValue
watch(count, (newVal, oldVal) => console.log(oldVal, '→', newVal))
// 监听 getter（reactive 内部字段必须用）
watch(() => state.user.age, (age) => console.log('age', age))

// 选项：immediate / deep / flush 'pre'|'post'|'sync' / once (3.4+)
watch(count, fn, { immediate: true, flush: 'post' })

// watchEffect：自动追踪
watchEffect(() => console.log(count.value, userId.value))
```

<v-click>

| 维度 | `watch` | `watchEffect` |
|---|---|---|
| 依赖 | 显式 | 自动追踪 |
| 首次执行 | 默认懒 | 立即 |
| oldValue | 有 | 没有 |

</v-click>

---
transition: slide-up
---

# 3.5+ onWatcherCleanup

```ts
import { watch, onWatcherCleanup } from 'vue'

const userId = ref(1)

watch(userId, async (newId) => {
  const controller = new AbortController()

  // 注册清理：下次触发前 / watcher 停止前会跑
  onWatcherCleanup(() => controller.abort())

  const data = await fetch(`/api/users/${newId}`, {
    signal: controller.signal,
  })
})
```

<v-click>

> 3.5 前要把清理函数当第三参传入。3.5 用顶层 `onWatcherCleanup` 更优雅，**多个清理可以并列注册**。

</v-click>

<v-click>

```ts
// 旧风格（仍可用）
watch(userId, (newId, oldId, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())
})
```

</v-click>

---
transition: slide-up
---

# 生命周期钩子

```vue
<script setup lang="ts">
import {
  onBeforeMount, onMounted,
  onBeforeUpdate, onUpdated,
  onBeforeUnmount, onUnmounted,
  onErrorCaptured,
  onActivated, onDeactivated,    // KeepAlive
  onServerPrefetch,              // SSR
} from 'vue'

onMounted(() => { /* DOM 已渲染，可访问 ref 元素 */ })
onUnmounted(() => { /* 清理：定时器 / 事件 / WebSocket */ })
onErrorCaptured((err) => { console.error(err); return false })
</script>
```

<v-click>

**调用顺序**：父 setup → 父 beforeMount → 子 setup → 子 mounted → 父 mounted

</v-click>

---
transition: slide-up
---

# 模板 ref：3.5+ useTemplateRef

```vue
<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue'
const input = useTemplateRef<HTMLInputElement>('input-el')
onMounted(() => input.value?.focus())
</script>

<template>
  <input ref="input-el" />
</template>
```

<v-click>

```vue
<!-- 3.0~3.4 旧风格仍可用 -->
<script setup>
const inputEl = ref<HTMLInputElement | null>(null)
</script>
<template>
  <input ref="inputEl" />

  <!-- v-for 内多个 ref → 数组 -->
  <li v-for="item in items" :key="item.id" ref="itemRefs" />
</template>
```

`useTemplateRef` 解决了 dynamic ref 名字、字符串与变量名解耦。

</v-click>

---
transition: slide-up
---

# 父子通信：Props + Emits

```vue
<!-- 子组件 UserCard.vue -->
<script setup lang="ts">
const props = defineProps<{
  user: { name: string; age: number }
  showAge?: boolean
}>()

const emit = defineEmits<{
  submit: [data: { id: number }]
  cancel: []
}>()
</script>
```

```vue
<!-- 父组件 -->
<template>
  <!-- 注意：模板里 kebab-case，脚本里 camelCase -->
  <UserCard :user="userData" :show-age="true" @submit="onSubmit" />
</template>
```

<v-click>

```ts
// withDefaults：给 defineProps 加默认值
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  items: () => [],   // 数组 / 对象用工厂函数
})
```

</v-click>

---
transition: slide-up
---

# 3.5+ 响应式 Props 解构

```vue
<script setup lang="ts">
// 解构后仍响应式（3.5 默认稳定）
const { title, count = 0 } = defineProps<{
  title: string
  count?: number
}>()
</script>

<template>
  <h1>{{ title }} ({{ count }})</h1>   <!-- 模板内自动响应 -->
</template>
```

<v-click>

> 警告：模板和 setup 顶层 / computed / watch 自动响应；**JS 函数闭包内不响应**。

```ts
const { count = 0 } = defineProps<{ count?: number }>()

// ❌ setTimeout 1 秒后读到的可能是旧值
function logIt() {
  setTimeout(() => console.log(count), 1000)
}

// ✅ watch / computed 自动追踪
watchEffect(() => console.log(count))
```

</v-click>

---
transition: slide-up
---

# v-model：父子双向绑定

```vue
<!-- 子组件 NumberInput.vue（3.4+ defineModel） -->
<script setup lang="ts">
const model = defineModel<number>({ required: true })
</script>

<template>
  <input type="number" v-model="model" />
</template>
```

```vue
<!-- 父组件 -->
<NumberInput v-model="count" />
```

<v-click>

**多个 v-model**：

```vue
<!-- 子组件 -->
<script setup>
const firstName = defineModel<string>('firstName')
const lastName = defineModel<string>('lastName')
const age = defineModel<number>('age', { default: 0 })
</script>

<!-- 父组件 -->
<UserForm v-model:first-name="first" v-model:last-name="last" v-model:age="age" />
```

</v-click>

---
transition: slide-up
---

# 表单 v-model 修饰符

```vue
<template>
  <input v-model.lazy="text" />        <!-- blur 时才同步 -->
  <input v-model.number="age" />       <!-- 自动转 number -->
  <input v-model.trim="username" />    <!-- 去首尾空格 -->
  <input v-model.lazy.trim="username" /> <!-- 组合 -->
</template>
```

<v-click>

```vue
<!-- checkbox 多选 → 数组 -->
<input type="checkbox" value="apple" v-model="fruits" />
<!-- fruits = ['apple', ...] -->
```

```ts
// 自定义 defineModel 修饰符（3.4+）
const [model, modifiers] = defineModel<string>({
  set: (v) => modifiers.capitalize ? v[0].toUpperCase() + v.slice(1) : v,
})
```

</v-click>

---
transition: slide-up
---

# Provide / Inject

跨层级传递数据，不必一层层 props 透传：

```vue
<!-- 顶层 -->
<script setup lang="ts">
const theme = ref<'light' | 'dark'>('light')
provide('theme', readonly(theme))   // 套 readonly 强制单向
provide('toggleTheme', () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
})

<!-- 任意后代 -->
const theme = inject<Ref<'light' | 'dark'>>('theme')
const toggle = inject<() => void>('toggleTheme')
</script>
```

<v-click>

**类型化 InjectionKey** 自动推导：

```ts
const ThemeKey: InjectionKey<Ref<'light' | 'dark'>> = Symbol('theme')
provide(ThemeKey, theme)
const theme = inject(ThemeKey)   // 自动 Ref<'light' | 'dark'>
```

</v-click>

---
transition: slide-up
---

# 插槽 slots

```vue
<!-- Layout.vue：定义 -->
<template>
  <div class="layout">
    <header><slot name="header" /></header>
    <main><slot /></main>           <!-- 默认 slot -->
    <footer><slot name="footer" /></footer>
  </div>
</template>
```

```vue
<!-- 使用 -->
<Layout>
  <template #header>
    <h1>Page Title</h1>
  </template>

  <p>Main content</p>     <!-- 进默认 slot -->

  <template #footer>
    <p>© 2026</p>
  </template>
</Layout>
```

<v-click>

`#name` 是 `v-slot:name` 简写。多元素默认 slot 会直接合并到无名 `<slot />`。

</v-click>

---
transition: slide-up
---

# 作用域插槽

子组件向父组件 slot 传递数据：

```vue
<!-- TodoList.vue -->
<template>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      <slot :todo="todo" :index="todo.id">{{ todo.text }}</slot>
    </li>
  </ul>
</template>
```

```vue
<!-- 父组件解构 slotProps -->
<TodoList :todos="list">
  <template #default="{ todo, index }">
    <span :class="{ done: todo.done }">{{ index }}. {{ todo.text }}</span>
  </template>
</TodoList>
```

<v-click>

经典场景：表格 / 列表的「每一行如何渲染」交给使用方决定，复用率最高。

</v-click>

---
transition: slide-up
---

# Class 与 Style 绑定

```vue
<template>
  <!-- Class：对象 / 数组 / 与静态共存 -->
  <div :class="{ active: isActive, error: hasError }" />
  <div :class="['base', cls, { active: isActive }]" />
  <div class="static" :class="dynamic" />

  <!-- Style：camelCase / CSS 变量 / 多对象 -->
  <p :style="{ color: 'red', fontSize: '16px' }">Hello</p>
  <div :style="{ '--primary': color }" />
  <p :style="[baseStyle, override]" />
</template>
```

<v-click>

scoped 样式深度选择器：

```vue
<style scoped>
.card :deep(.child)   { color: red; }   /* 穿透子组件 */
.card :slotted(.x)    { margin: 8px; }  /* slot 内容 */
:global(body)         { font: sans-serif; }
</style>
```

</v-click>

---
transition: slide-up
---

# CSS Modules + v-bind in CSS

```vue
<!-- CSS Modules：hash 处理避免冲突 -->
<template><div :class="$style.card">Card</div></template>
<style module>
.card { padding: 16px; }
</style>
```

```vue
<!-- v-bind 在 CSS 中（3.2+）：响应式样式 -->
<script setup>
const color = ref('red')
</script>
<template><p class="text">Hello</p></template>
<style scoped>
.text { color: v-bind(color); }
</style>
```

<v-click>

`v-bind()` 编译期生成 CSS 自定义属性，运行时通过 inline style 推到 DOM。改 `color.value` 自动更新。

</v-click>

---
transition: slide-up
---

# Composables 设计

把可复用逻辑封装成 `useXxx` 函数：

```ts
// composables/useCounter.ts
export function useCounter(initial = 0) {
  const count = ref(initial)
  const doubled = computed(() => count.value * 2)
  function increment() { count.value++ }
  function reset() { count.value = initial }
  return { count, doubled, increment, reset }
}

// 使用
const { count, doubled, increment, reset } = useCounter(10)
```

<v-click>

**约定**：函数名以 `use` 开头 / 返回响应式 ref + 操作函数 / 资源清理用 `onUnmounted` / `onWatcherCleanup`。

</v-click>

---
transition: slide-up
---

# Composable：异步 + 自动清理

```ts
export function useFetchData<T>(url: () => string) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  watch(url, async (currentUrl) => {
    const controller = new AbortController()
    onWatcherCleanup(() => controller.abort())
    loading.value = true
    try {
      const res = await fetch(currentUrl, { signal: controller.signal })
      data.value = await res.json()
    } catch (e) {
      if ((e as Error).name !== 'AbortError') error.value = e as Error
    } finally {
      loading.value = false
    }
  }, { immediate: true })

  return { data, loading, error }
}
```

<v-click>

`url` 变化时自动重新拉，**上次请求自动 abort**。

</v-click>

---
transition: slide-up
---

# 共享 state 的 composable

```ts
// composables/useGlobalCounter.ts
// 模块级 ref → 跨组件共享
const count = ref(0)

export function useGlobalCounter() {
  function increment() { count.value++ }
  function decrement() { count.value-- }
  return { count, increment, decrement }
}
```

<v-click>

任何组件调 `useGlobalCounter()` 拿到**同一个 count ref**。适合：购物车、当前主题、登录状态。

</v-click>

<v-click>

> 警告：**模块级 state 不能在 SSR 用**。SSR 时多个请求共享同一 Node 进程，模块级变量会跨用户污染。SSR 项目要用 Pinia / Nuxt useState（按请求隔离）。

</v-click>

---
transition: slide-up
---

# Pinia：推荐状态管理

```ts
// stores/auth.ts —— Setup Store 风格（推荐）
export const useAuthStore = defineStore('auth', () => {
  // state
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  // getters
  const isLoggedIn = computed(() => user.value !== null)
  const userName = computed(() => user.value?.name ?? 'Guest')

  // actions
  async function login(email: string, password: string) {
    const data = await $fetch('/api/login', { method: 'POST', body: { email, password } })
    user.value = data.user
    token.value = data.token
    localStorage.setItem('token', data.token)
  }
  function logout() { user.value = null; token.value = null }

  return { user, token, isLoggedIn, userName, login, logout }
})
```

---
transition: slide-up
---

# 使用 Pinia Store

```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const auth = useAuthStore()

// state / getter 解构必须用 storeToRefs 保留响应性
const { user, isLoggedIn, userName } = storeToRefs(auth)

// actions 直接解构
const { login, logout } = auth
</script>

<template>
  <div v-if="isLoggedIn">
    Welcome, {{ userName }}
    <button @click="logout">Logout</button>
  </div>
  <LoginForm v-else @submit="login" />
</template>
```

<v-click>

> 不要这么解构：`const { count } = useStore()` —— 失去响应性。必须 `storeToRefs`。

</v-click>

---
transition: slide-up
---

# Pinia 进阶 API

```ts
const counter = useCounterStore()

// 批量修改（避免多次触发 watcher）
counter.$patch({ count: 10, name: 'New' })
counter.$patch((state) => { state.count++; state.items.push({}) })

// 替换 / 重置
counter.$state = { count: 100, name: 'Reset' }
counter.$reset()
```

<v-click>

**监听 action / state**：

```ts
cart.$onAction(({ name, args, after, onError }) => {
  after((result) => console.log(`${name} returned:`, result))
  onError((err) => console.error(`${name} failed:`, err))
})

cart.$subscribe((mutation, state) => {
  localStorage.setItem('cart', JSON.stringify(state))
})
```

</v-click>

---
transition: slide-up
---

# Pinia 持久化插件

```bash
pnpm add pinia-plugin-persistedstate
```

```ts
// main.ts
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

```ts
// stores/preferences.ts —— 简单声明
export const usePreferencesStore = defineStore('prefs', () => {
  const theme = ref<'light' | 'dark'>('light')
  return { theme }
}, {
  persist: true,    // 默认 localStorage
})

// 自定义存储 + 字段筛选
export const useCartStore = defineStore('cart', /* ... */, {
  persist: {
    storage: sessionStorage,
    pick: ['items'],
    key: 'app:cart',
  },
})
```

---
transition: slide-up
---

# Vue Router 4

```ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // 三种 history mode：webHistory（推荐）/ webHashHistory / memoryHistory
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', component: () => import('@/views/AboutView.vue') },
    { path: '/users/:id', name: 'user', component: UserView },
    { path: '/:pathMatch(.*)*', component: NotFoundView },
  ],
})
```

```vue
<!-- App.vue -->
<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink :to="{ name: 'user', params: { id: 42 } }">User 42</RouterLink>
  </nav>
  <RouterView />
</template>
```

---
transition: slide-up
---

# Vue Router：动态 / 嵌套 / 命名

```ts
const routes = [
  { path: '/users/:id', component: UserView },           // 单参数
  { path: '/users/:id?', component: UsersView },          // 可选参数
  { path: '/:pathMatch(.*)*', component: NotFoundView },  // 通配
  { path: '/users/:id(\\d+)', component: UserView },      // 正则约束

  // 嵌套
  {
    path: '/user/:id', component: UserLayout,
    children: [
      { path: 'profile', component: UserProfile },        // /user/:id/profile
      { path: 'posts', component: UserPosts },
      { path: '', component: UserHome },                  // 默认子路由
    ],
  },
]
```

<v-click>

嵌套路由要在父组件用 `<RouterView />` 占位，否则子路由不渲染。

</v-click>

---
transition: slide-up
---

# 路由守卫

```ts
// 全局前置（return: false 取消 / '/login' 重定向 / true 放行）
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

// 全局解析（组件守卫之后） / 全局后置（不影响导航）
router.beforeResolve(async (to) => {
  if (to.meta.permissions) await checkPermissions(to.meta.permissions)
})
router.afterEach((to, from, failure) => {
  if (!failure) sendAnalytics({ to: to.fullPath })
})
```

```vue
<!-- 组件内守卫 -->
<script setup>
import { onBeforeRouteLeave } from 'vue-router'
onBeforeRouteLeave((to) => hasUnsavedChanges.value ? confirm('Discard?') : true)
</script>
```

---
transition: slide-up
---

# 路由 meta + 懒加载

```ts
// 类型扩展让 to.meta 类型推导生效
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    permissions?: string[]
    title?: string
  }
}

const routes = [
  {
    path: '/admin',
    component: () => import('@/views/AdminView.vue'),   // 懒加载
    meta: { requiresAuth: true, title: 'Admin Panel' },
  },
]

router.beforeEach((to) => { document.title = to.meta.title ?? 'App' })
```

<v-click>

> 懒加载是最容易拿到的性能优化——大型项目首屏 bundle 通常能砍一半。

</v-click>

---
transition: slide-up
---

# 滚动行为 + 过渡

```ts
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition         // 前进/后退恢复
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})
```

```vue
<!-- App.vue：路由过渡 -->
<template>
  <RouterView v-slot="{ Component, route }">
    <Transition :name="route.meta.transition ?? 'fade'" mode="out-in">
      <component :is="Component" :key="route.fullPath" />
    </Transition>
  </RouterView>
</template>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
```

---
transition: slide-up
---

# Transition：进出动画

`<Transition>` 在元素进入 / 离开时自动加 6 个 class（`v-enter-from/active/to`、`v-leave-from/active/to`）：

```vue
<template>
  <Transition name="fade">
    <p v-if="show">Hello</p>
  </Transition>
</template>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
```

<v-click>

**关键 props**：`name` 类名前缀 / `mode='out-in'` 路由切换推荐 / `appear` 首次也触发 / `:css="false"` 纯 JS hooks。

</v-click>

---
transition: slide-up
---

# Transition：JS Hooks

```vue
<template>
  <Transition @enter="onEnter" @leave="onLeave" :css="false">
    <div v-if="show" ref="el">Hello</div>
  </Transition>
</template>

<script setup>
function onEnter(el, done) {
  gsap.from(el, { opacity: 0, y: 20, duration: 0.3, onComplete: done })
}
function onLeave(el, done) {
  gsap.to(el, { opacity: 0, y: -20, duration: 0.3, onComplete: done })
}
</script>
```

<v-click>

`:css="false"` 告诉 Vue 跳过 CSS 类检测，直接用 JS 动画库（GSAP / anime.js）。**必须调 `done`** 通知 Vue。

</v-click>

---
transition: slide-up
---

# TransitionGroup：列表动画

```vue
<template>
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item.id">{{ item.text }}</li>
  </TransitionGroup>
</template>

<style>
.list-enter-active, .list-leave-active {
  transition: all 0.5s;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* FLIP move：已存在项目重新排序的平滑过渡 */
.list-move { transition: transform 0.5s; }

/* 离开时绝对定位避免占位 */
.list-leave-active { position: absolute; }
</style>
```

<v-click>

`tag="ul"` 指定外层元素（默认 fragment）。**`list-move` 是 FLIP 动画的关键**——已存在项目位置变化时用。

</v-click>

---
transition: slide-up
---

# Teleport：传送门

把内部 DOM「传送」到任意 DOM 节点（常用 `body`）：

```vue
<template>
  <button @click="show = true">Open Modal</button>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay">
      <div class="modal" @click.stop>...</div>
    </div>
  </Teleport>
</template>
```

<v-click>

适合 **Modal / Toast / Tooltip / Dropdown**——避免父容器 `overflow:hidden` / `z-index` / `transform` 影响层级。

```vue
<!-- 完整选项 -->
<Teleport to="#modal-root" :disabled="isMobile" :defer="true" />
<!-- :defer 3.5+ 推迟到当前渲染周期之后 -->
```

</v-click>

---
transition: slide-up
---

# KeepAlive：组件缓存

```vue
<template>
  <!-- 与路由配合 -->
  <RouterView v-slot="{ Component }">
    <KeepAlive :include="['HomeView', 'ListView']" :max="10">
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>
```

<v-click>

**生命周期变化**（缓存切换不重新 mount）：

```
首次：setup → mounted → activated
切走：deactivated；切回：activated
真销毁：beforeUnmount → unmounted
```

```vue
<script setup>
onActivated(() => console.log('entered cache view'))
onDeactivated(() => console.log('left but cached'))
</script>
```

适合：**列表 + 详情**来回切换，列表页保留滚动 / 表单状态。

</v-click>

---
transition: slide-up
---

# Suspense（实验性）

```vue
<!-- 子组件：async setup -->
<script setup lang="ts">
const data = await $fetch('/api/x')
</script>
```

```vue
<!-- 父组件 -->
<template>
  <Suspense>
    <template #default>
      <UserProfile />
    </template>
    <template #fallback>
      <SkeletonLoader />
    </template>
  </Suspense>
</template>
```

<v-click>

`Suspense` 等待内部所有 async setup 完成才显示 default slot，否则显示 fallback。

</v-click>

<v-click>

> 警告：**Suspense 仍标记实验性**。API 在未来版本可能调整。Nuxt 内部用了，但官方不推荐直接用在生产组件——尤其与 `<KeepAlive>` / `<Transition>` 组合时有 edge case。

</v-click>

---
transition: slide-up
---

# 自定义指令

```vue
<script setup lang="ts">
import type { Directive } from 'vue'
// 自动聚焦
const vFocus: Directive<HTMLInputElement> = { mounted: el => el.focus() }
</script>

<template><input v-focus /></template>
```

<v-click>

**完整生命周期 hooks**：`created` → `beforeMount` → `mounted` → `beforeUpdate` → `updated` → `beforeUnmount` → `unmounted`

```ts
const myDirective: Directive = {
  mounted(el, binding) {
    binding.value        // 表达式的值
    binding.arg          // v-my-directive:arg → 'arg'
    binding.modifiers    // .mod → { mod: true }
  },
}
```

</v-click>

---
transition: slide-up
---

# 实战指令：v-permission / v-clickoutside

```ts
// directives/permission.ts
export const vPermission: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    const required = Array.isArray(binding.value) ? binding.value : [binding.value]
    const ok = required.every(p => useAuthStore().permissions.includes(p))
    if (!ok) el.parentNode?.removeChild(el)
  },
}

// directives/clickOutside.ts
export const vClickOutside: Directive<HTMLElement, (e: MouseEvent) => void> = {
  mounted(el, binding) {
    el._handler = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) binding.value(e)
    }
    document.addEventListener('click', el._handler)
  },
  unmounted(el) { document.removeEventListener('click', el._handler) },
}
```

```vue
<button v-permission="'user:delete'">Delete</button>
<div v-click-outside="closeMenu">Menu</div>
```

---
transition: slide-up
---

# 异步组件

```ts
import { defineAsyncComponent } from 'vue'

// 基础：v-if true 时才下载 chunk
const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'))

// 完整选项
const AsyncChart = defineAsyncComponent({
  loader: () => import('./Chart.vue'),
  loadingComponent: LoadingSpinner,
  delay: 200,                     // 等多久才显示 loading
  errorComponent: ErrorView,
  timeout: 10000,
  suspensible: false,
  onError(error, retry, fail, attempts) {
    if (attempts < 3) retry()
    else fail()
  },
})
```

```vue
<template>
  <HeavyChart v-if="showChart" />
</template>
```

<v-click>

适合：**Modal / Chart / Markdown 编辑器**等首屏不需要的重组件，按需加载减小初始 bundle。

</v-click>

---
transition: slide-up
---

# TypeScript 集成

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  status: 'idle' | 'loading' | 'done'
}
const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [data: FormData]
  'update:value': [value: string]
}>()
</script>
```

<v-click>

**Generic Component（3.3+）**：

```vue
<script setup lang="ts" generic="T extends { id: number }">
defineProps<{ items: T[]; onSelect: (item: T) => void }>()
</script>
<template>
  <li v-for="item in items" :key="item.id" @click="onSelect(item)">
    <slot :item="item" />
  </li>
</template>
```

</v-click>

---
transition: slide-up
---

# TS 工具类型

| 类型 | 用途 |
|---|---|
| `Ref<T>` / `ComputedRef<T>` | ref / computed 返回类型 |
| `MaybeRef<T>` | `T \| Ref<T>` |
| `MaybeRefOrGetter<T>` | `T \| Ref<T> \| (() => T)` |
| `InjectionKey<T>` | 类型化 inject key |
| `Directive<El, Val>` | 自定义指令类型 |

<v-click>

```ts
// MaybeRef：函数同时接受值和 ref
function useDouble(input: MaybeRef<number>) {
  return computed(() => unref(input) * 2)
}
```

</v-click>

---
transition: slide-up
---

# vue-tsc + Volar

```bash
pnpm add -D vue-tsc
```

```json
// package.json
{
  "scripts": {
    "type-check": "vue-tsc --noEmit"
  }
}
```

<v-click>

`vue-tsc` 是 Vue SFC 的 TypeScript 检查器，普通 `tsc` 不认 `.vue` 文件。

</v-click>

<v-click>

**VSCode 工具链**：

- ✅ **Vue (Volar) 扩展** —— Vue 3 时代官方推荐
- ❌ **不要装 Vetur** —— Vue 2 时代遗留

</v-click>

<v-click>

> Take Over Mode：让 Volar 接管 TS 服务（关闭 VSCode 内置 TS），减少 30%+ 内存 + 加速。
> Command Palette → "TypeScript: Disable TypeScript and JavaScript Language Features (Workspace)"

</v-click>

---
transition: slide-up
---

# 响应式底层：Proxy + Reflect

Vue 3 用 ES6 Proxy 替代 Vue 2 的 `Object.defineProperty`：

```ts
// 简化版 reactive 实现
const targetMap = new WeakMap()
let activeEffect = null

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)
      return result
    },
  })
}
```

---
transition: slide-up
---

# Vue 2 vs Vue 3 响应式

| 维度 | Vue 2 `defineProperty` | Vue 3 `Proxy` |
|---|---|---|
| 新增 / 删除字段 | 要 `Vue.set/delete` | 自动 |
| 数组下标 / length | 不响应 | 自动 |
| Map / Set | 不支持 | 支持 |
| 性能 | 递归初始化 | 惰性代理 |

<v-click>

**@vue/reactivity 可独立使用**（适合 Node CLI / Tauri / Electron / Worker）：

```ts
import { ref, computed, effect } from '@vue/reactivity'
const count = ref(0)
const doubled = computed(() => count.value * 2)
effect(() => console.log(doubled.value))
count.value++   // 自动 log
```

</v-click>

---
transition: slide-up
---

# 编译时优化：patchFlag

```vue
<template>
  <div>
    <span>静态文本</span>
    <span>{{ dynamicText }}</span>
    <button :class="cls" @click="handler">Click</button>
  </div>
</template>
```

编译成：

```ts
function render() {
  return createElementBlock('div', null, [
    createElementVNode('span', null, '静态文本'),                       // 无 patchFlag
    createElementVNode('span', null, ctx.dynamicText, 1 /* TEXT */),
    createElementVNode('button', { class: normalizeClass(ctx.cls) },
      'Click', 2 /* CLASS */),
  ])
}
```

<v-click>

patchFlag 告诉运行时 **只需要 diff 这种属性**。这是 Vue 性能优于 React 的核心原因之一。

</v-click>

---
transition: slide-up
---

# Block + 静态提升

```vue
<template>
  <div>
    <span class="title">My App</span>
    <span>{{ msg }}</span>
  </div>
</template>
```

编译成：

```ts
// 静态 vnode 提到模块顶层，所有 render 复用同一份
const _hoisted_1 = createElementVNode('span', { class: 'title' }, 'My App')

function render() {
  return (openBlock(), createElementBlock('div', null, [
    _hoisted_1,                                              // 复用
    createElementVNode('span', null, ctx.msg, 1 /* TEXT */),
  ]))
}
```

<v-click>

**Block 优化**：外层 block 收集所有动态子节点到 `block.dynamicChildren`，运行时只跑这数组，跳过静态子树。`v-if` / `v-for` / `Suspense` / `Teleport` 都创建新 block。

</v-click>

---
transition: slide-up
---

# v-once / v-memo

```vue
<template>
  <!-- v-once：只渲染一次，永不更新 -->
  <div v-once>
    <h1>{{ initialTitle }}</h1>
    <p>{{ initialDescription }}</p>
  </div>

  <!-- v-memo：依赖数组未变跳过子树 diff -->
  <div v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
    <img :src="item.cover" />
    <h3>{{ item.name }}</h3>
    <span :class="{ active: item.selected }">{{ item.status }}</span>
  </div>
</template>
```

<v-click>

适合：

- **`v-once`**：博客文章正文 / Markdown 渲染结果（数据来源不变）
- **`v-memo`**：大列表 + 单项更新很少（性能关键场景）

</v-click>

<v-click>

> 警告：`v-memo` 把责任移到开发者，**漏一个依赖 → 该更新时不更新 → bug 极难调试**。只在 profiled 后确认有性能问题再用。

</v-click>

---
transition: slide-up
---

# Vapor Mode 现状（重点）

Vapor 是 Vue 团队孵化的「**跳过 Virtual DOM**」编译目标——把模板直接编译成最高效的 DOM 操作。

```
传统 Vue 编译：
  <template> → render() → vnode → patch(prev, next) → DOM

Vapor 编译：
  <template> → 直接生成 DOM 操作代码 → 无 vnode 中间层
```

<v-click>

**当前状态（2026.5）**：

- **未进入稳定版**：3.5 稳定版尚未包含 Vapor 编译输出
- **开发分支**：`vuejs/core` 的 `vapor-alpha-branch` 持续迭代
- **试玩**：[Vapor Playground](https://vapor-repl.netlify.app/) / [Vapor Template Explorer](https://vapor-template-explorer.netlify.app/)

</v-click>

<v-click>

> **现在能做什么**：继续用标准 `<script setup>`。Vapor 上线时迁移成本会很小——同一份 SFC，按 mode 编译输出不同代码。**正式生产前不要押注**。

</v-click>

---
transition: slide-up
---

# Vue 3.5 新特性总览

3.5 主要是「**生态稳定 + 小工具补齐**」，没有大破坏性变更：

<v-clicks>

- **响应式 Props 解构**默认稳定 → 不再需要 `withDefaults` 也能用 JS 默认值
- **`useId()`** → SSR-safe 唯一 id，配合表单 label / aria 用
- **`useTemplateRef()`** → 模板 ref 的字符串名 API，支持 dynamic ref
- **`onWatcherCleanup()`** → 顶层注册 watch 清理函数，多个清理可并列
- **Lazy Hydration** → `defineAsyncComponent` 加 `hydrate` 选项控制激活时机
- **`<Teleport defer>`** → 推迟到目标 DOM 后续渲染时挂载

</v-clicks>

<v-click>

**未含**：Vapor Mode（仍在 alpha 分支）。

</v-click>

---
transition: slide-up
---

# 3.5+ useId

SSR-safe 的唯一 id 生成，主要解决服务端 / 客户端 hydration mismatch：

```vue
<script setup>
import { useId } from 'vue'

const id = useId()
</script>

<template>
  <label :for="id">姓名</label>
  <input :id="id" type="text" />
</template>
```

<v-click>

**为什么需要**：自己写 `crypto.randomUUID()` 在 SSR 时服务端 / 客户端结果不一致，会触发 hydration mismatch 警告。`useId()` 内部用确定性算法，两端结果一致。

</v-click>

<v-click>

适合：
- 表单 label + input 关联
- aria-labelledby / aria-describedby
- 弹窗 / Tooltip 内的 id 引用

</v-click>

---
transition: slide-up
---

# 3.5+ Lazy Hydration

**首屏 SSR + 非关键组件延后激活**：

```ts
import {
  defineAsyncComponent,
  hydrateOnVisible, hydrateOnIdle, hydrateOnInteraction,
} from 'vue'

// 视口可见时
const ChartAsync = defineAsyncComponent({
  loader: () => import('./Chart.vue'),
  hydrate: hydrateOnVisible(),
})

// 浏览器空闲时 / 用户交互时
defineAsyncComponent({ loader, hydrate: hydrateOnIdle(2000) })
defineAsyncComponent({ loader, hydrate: hydrateOnInteraction(['click']) })
```

<v-click>

参考 React Server Components / Astro Islands 的思路，通过 `defineAsyncComponent` 集成。

</v-click>

---
transition: slide-up
---

# SSR 基础

```bash
pnpm add @vue/server-renderer
```

```ts
// entry-server.ts
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import App from './App.vue'

export async function render() {
  const app = createSSRApp(App)    // 用 createSSRApp 而非 createApp
  const html = await renderToString(app)
  return html
}
```

```ts
// entry-client.ts
import { createSSRApp } from 'vue'
import App from './App.vue'

const app = createSSRApp(App)
app.mount('#app')   // SSR 标记下自动 hydrate（不重新创建 DOM）
```

<v-click>

> 实际项目用 **Nuxt**——开箱即用的文件路由 / SSR / SSG / Edge 部署。手写 SSR 痛苦。

</v-click>

---
transition: slide-up
---

# Hydration mismatch

服务端 HTML 与客户端首次渲染不一致时 Vue 会警告：

```vue
<!-- ❌ 常见原因 -->
<span>{{ Date.now() }}</span>             <!-- 每次结果不同 -->
<span>{{ Math.random() }}</span>
<span>{{ window.innerWidth }}</span>       <!-- 服务端报错 -->
<span>{{ isLoggedIn ? 'Y' : 'N' }}</span>  <!-- cookie 不同步 -->
```

<v-click>

**修复方案**：

```vue
<!-- 1. ClientOnly 包裹 -->
<ClientOnly>
  <span>{{ window.innerWidth }}</span>
</ClientOnly>

<!-- 2. 延后到 onMounted -->
<script setup>
const width = ref(0)
onMounted(() => { width.value = window.innerWidth })
</script>
```

</v-click>

---
transition: slide-up
---

# 性能优化清单

<v-clicks>

- **路由懒加载** → `component: () => import('@/views/X.vue')`
- **异步组件** → 大组件 `defineAsyncComponent` 按需下载
- **shallowRef 大对象** → 表格 / Chart instance / Quill editor 等第三方实例
- **markRaw** → 大型固定数据（数千行配置）不被代理
- **v-memo** → 大列表单项更新少的场景
- **虚拟滚动** → `vue-virtual-scroller` / `@tanstack/vue-virtual` 只渲染可视区
- **防抖 watch** → 搜索框等输入频繁场景
- **Bundle 分析** → `rollup-plugin-visualizer` 找出大依赖

</v-clicks>

```ts
// shallowRef + markRaw 例子
const tableData = shallowRef(largeDataset)   // 不递归 proxy
tableData.value = [...largeDataset, newRow]  // 替换整体触发更新

const config = markRaw({ /* 数千行配置 */ })
const state = reactive({ config })           // config 不被代理
```

---
transition: slide-up
---

# 测试：Vitest + @vue/test-utils

```ts
// vitest.config.ts
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',   // 比 jsdom 快 2-3 倍
    globals: true,
  },
})

// tests/Counter.spec.ts
describe('Counter', () => {
  it('increments on click', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button').trigger('click')
    expect(wrapper.get('[data-testid=count]').text()).toBe('1')
  })
})
```

---
transition: slide-up
---

# 测试：mount vs shallowMount / mocks

```ts
const fullTree = mount(Parent)        // 完整渲染所有子组件
const isolated = shallowMount(Parent) // 子组件被 stub 成 <child-stub />

// Mock 全局
const wrapper = mount(Component, {
  global: {
    stubs: { ChildComponent: true },
    mocks: { $route: { params: { id: 1 } }, $router: { push: vi.fn() } },
    provide: { apiClient: mockApiClient },
    plugins: [createPinia()],
  },
})
```

<v-click>

**Composable 测试更简单**：

```ts
it('starts at initial value', () => {
  const { count } = useCounter(10)
  expect(count.value).toBe(10)
})
```

</v-click>

---
transition: slide-up
---

# Pinia + Router 测试

```ts
// Pinia store
describe('Counter Store', () => {
  beforeEach(() => setActivePinia(createPinia()))
  it('increments', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
  })
})

// Vue Router
const router = createRouter({
  history: createMemoryHistory(),    // 内存模式
  routes,
})
const wrapper = mount(App, { global: { plugins: [router] } })
await router.push('/users/42')
await router.isReady()
```

---
transition: slide-up
---

# E2E：Cypress vs Playwright

```ts
// Cypress（链式 jQuery 风）
cy.visit('/'); cy.contains('About').click()
cy.url().should('include', '/about')

// Playwright（async / await）
test('navigation', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await page.click('text=About')
  await expect(page).toHaveURL(/.*about/)
})
```

<v-click>

| 维度 | Cypress | Playwright |
|---|---|---|
| 浏览器 | Chromium / Firefox | + WebKit |
| Trace | 时间旅行 | Trace Viewer 强大 |
| 适合 | 单一 SPA | 跨浏览器 / 多端 |

</v-click>

---
transition: slide-up
---

# VueUse：必装工具库

```ts
import {
  useEventListener,        // 自动 onUnmounted 清理
  useStorage,              // localStorage 响应式
  useFetch, useDark, useMouse, useWindowSize,
  useDebouncedRef, useThrottleFn, useEventBus,
  useClipboard, useIntersectionObserver,
  useColorMode, useTitle,
} from '@vueuse/core'
```

<v-click>

```ts
// 自动清理的事件监听
useEventListener(window, 'resize', () => console.log('resized'))

// 跨组件事件总线（适合 keep-alive 详情 → 列表刷新）
const bus = useEventBus<{ source: string }>('refresh-list')
```

</v-click>

---
transition: slide-up
---

# 组件库选型

| 库 | 适合 |
|---|---|
| **Element Plus** | 中国企业后台 |
| **Naive UI** | 创业 / 个人项目 |
| **Ant Design Vue** | 大型管理系统 |
| **Vuetify** | Material 跨设备 |
| **Vant / Quasar** | 移动端 / 跨平台 |
| **shadcn-vue / Reka UI** | Tailwind 完全定制 |

<v-click>

**经验**：中国后台 → Element Plus；Tailwind 定制 → shadcn-vue + Reka UI。

</v-click>

---
transition: slide-up
---

# Vue 2 → Vue 3 迁移

| 维度 | Vue 2 | Vue 3 |
|---|---|---|
| 响应式 | `defineProperty` | `Proxy` |
| 入口 | `new Vue(...)` | `createApp(...)` |
| `v-model` | 单值 | 多值 + `modelValue` |
| `v-if` + `v-for` | `v-for` 优先 | `v-if` 优先 |
| Filter / `$on` | 有 | 移除（用 mitt） |
| Mixins | 主流 | Composables |
| Vuex | v3/v4 | Pinia |

<v-click>

**迁移路径**：直接重写 / Vue 2.7 → Vue 3 / `@vue/compat` 兼容层 / `@vue/codemod` 自动改写。

</v-click>

---
transition: slide-up
---

# Web Components（defineCustomElement）

把 Vue 组件编译成原生 Custom Element：

```vue
<!-- MyButton.ce.vue（`.ce.vue` 自动 Shadow DOM 模式） -->
<script setup>
defineProps<{ label: string }>()
</script>
<template><button>{{ label }}</button></template>
```

```ts
// main.ts
import { defineCustomElement } from 'vue'
import MyButton from './MyButton.ce.vue'
customElements.define('my-button', defineCustomElement(MyButton))
```

```html
<my-button label="Click me"></my-button>
```

<v-click>

适合 **微前端 / Embed Widget / Cross-framework Library**。局限：Shadow DOM 中 Tailwind / UnoCSS 等需要特殊配置。

</v-click>

---
transition: slide-up
---

# 微前端方案

| 方案 | 隔离原理 | Vite 友好 |
|---|---|---|
| **qiankun** | iframe-less + JS sandbox | 需插件 |
| **wujie** | iframe + Web Component | 原生 |
| **micro-app** | Web Components + 沙箱 | 是 |

<v-click>

```ts
// wujie 主应用（推荐 Vite 项目）
import { startApp } from 'wujie'
startApp({ name: 'vue-app', url: 'http://localhost:5174', el: '#sub' })
```

**经验**：新项目首选 wujie / micro-app（对 Vite 友好）；老项目延续 qiankun。

</v-click>

---
transition: slide-up
---

# vs React

| 维度 | Vue 3.5 | React 19 |
|---|---|---|
| 模板 | SFC + 编译优化 | JSX + 运行时 |
| 响应式 | Proxy 自动追踪 | useState + 手动 |
| 更新粒度 | patchFlag 动态部分 | 整组件重跑 |
| 状态管理 | Pinia | Zustand / Redux |
| 元框架 | Nuxt | Next / Remix |
| RSC | 暂无 | 有（实验性） |
| 招聘 | 国内多 | 国际多 |

<v-click>

> 团队主语言决定 80%——写 Vue 选 Vue，写 React 选 React。技术深度旗鼓相当。

</v-click>

---
transition: slide-up
---

# vs Svelte / Solid

| 维度 | Vue 3 | Svelte 5 | Solid |
|---|---|---|---|
| 编译策略 | vnode + patchFlag | 编译消失 + 直接 DOM | JSX 细粒度信号 |
| 响应式 | Proxy 自动 | runes `$state` | Signal |
| 运行时 | 小核 | 极小（KB 级） | 中等 |
| 生态 | 大 | 中 (SvelteKit) | 小 (SolidStart) |

<v-click>

**怎么选**：Vue → 团队主流 / 国内多人才；Svelte → DX 极佳 / bundle 小；Solid → 信号最纯粹 / 性能最强。

</v-click>

---
transition: slide-up
---

# vs Angular

| 维度 | Vue 3 | Angular 17+ |
|---|---|---|
| 范式 | SFC + Composition | DI + RxJS |
| 响应式 | Proxy + signal | RxJS + Signal |
| TypeScript | 可选 | 强制 |
| Bundle | 小 | 较大 |
| 学习曲线 | 平缓 | 陡峭 |
| 适合 | 中小 / 国内 | 大企业 / 后端思维 |

<v-click>

**选 Vue**：中小项目 / 前端思维团队 / 国内招聘。
**选 Angular**：大型企业（金融 / 政府）/ OOP 团队 / 强 DI 需求。

</v-click>

---
transition: slide-up
---

# 常见陷阱速查

<v-clicks>

- **解构 reactive 失去响应** → 用 `toRefs(state)` 或直接 `ref`
- **`v-for` + `v-if` 同元素** → Vue 3 中 `v-if` 优先级高，循环未生效；用 computed 过滤
- **模板 ref 在 `onMounted` 之前为 null** → DOM 还没挂，要在 mounted 内访问
- **Composition API 必须 setup 顶层调用** → `setTimeout` / 普通函数内调 `useRoute()` 报错
- **SSR 时 window 不存在** → 用 `onMounted` 或 `<ClientOnly>` 包裹
- **Pinia 解构丢响应** → 必须 `storeToRefs(store)` 解构 state / getter
- **`<script setup>` 默认不暴露** → 父组件 ref 看不到内部，必须 `defineExpose`
- **3.5 解构 props 在函数闭包不响应** → 模板 / computed / watch 自动响应；普通函数闭包不行

</v-clicks>

---
transition: slide-up
---

# 开发工具：Vue DevTools 6

```bash
# Vite Plugin 集成（推荐）
pnpm add -D vite-plugin-vue-devtools
```

```ts
// vite.config.ts
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
})
```

<v-clicks>

启动开发服务器后，页面右下角浮一个 V 按钮：

- **Inspector**：组件树 + props / state 实时检查
- **Routes**：当前路由表 + 文件位置 + 一键跳源码
- **Pinia**：store state + actions 历史
- **Timeline**：组件 mount / event / fetch 时序
- **Components**：组件实例 + props 编辑
- **Performance**：渲染时间统计

</v-clicks>

---
transition: slide-up
---

# 完整 main.ts 模板

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('[global]', err, info)
  reportToSentry(err)
}

// 全局属性（Options API 用 this.$xxx）
app.config.globalProperties.$apiBase = import.meta.env.VITE_API_BASE

app.use(createPinia()).use(router).mount('#app')
```

<v-click>

```ts
// 类型扩展全局属性
declare module 'vue' {
  interface ComponentCustomProperties { $apiBase: string }
}
```

</v-click>

---
transition: slide-up
---

# 经验法则

<v-clicks>

- **优先用 `ref`**，除非真的有理由用 `reactive`（且作用域不离开当前函数）
- **模板有 `<script setup>`，没有 Options API** —— 类型推导 / DX 都最好
- **`computed` 缓存派生值**，不要在模板里写复杂表达式
- **`watch` 显式依赖**，`watchEffect` 自动追踪当前状态副作用
- **路由懒加载**是性能优化里最容易拿到的——只改 `component: () => import(...)`
- **Pinia 解构必须 `storeToRefs`** —— 这是踩坑率最高的之一
- **使用 VueUse**，别自己实现 useStorage / useEventBus / useFetch
- **Vapor Mode 别押注** —— 仍 alpha，正式生产请用标准 `<script setup>`

</v-clicks>

---
transition: slide-up
---

# 不要选 Vue 的场景

<v-clicks>

- **团队全是 React 老手** → 人才 / 生态切换成本太大
- **依赖 React 生态某个库**（React Native / 某 SaaS SDK 只有 React 版本）
- **需要 React Server Components 等先发实验性特性** → Vue 暂无对应
- **大型 Vue 2 老项目重写顾虑大** → Vue 3 与 Vue 2 兼容差，Options → Composition 重写不少
- **微前端基础设施已建在 React 上** → 子应用同栈成本最低
- **要 RSC + Edge Streaming** → Next.js 15 + React 19 更前沿

</v-clicks>

<v-click>

> **经验**：新项目 + 团队中立或 Vue 优势 → 选 Vue；其它先评估迁移 / 招聘成本。

</v-click>

---
layout: center
class: text-center
---

# 总结

适合：新项目 + Vite 内核 + 国内团队 / 渐进式落地 / 后台 + 移动端覆盖

少做：纯 React 团队 / 已重度押注 React Server Components 的项目

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://cn.vuejs.org/" target="_blank">cn.vuejs.org</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/vuejs/core" target="_blank">vuejs/core</a>
</div>

<div class="mt-4">
  <carbon:play /> <a href="https://play.vuejs.org/" target="_blank">SFC Playground</a>
</div>
