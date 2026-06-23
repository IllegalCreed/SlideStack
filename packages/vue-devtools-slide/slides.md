---
theme: seriph
background: https://cover.sli.dev
title: Vue DevTools 完全指南
info: |
  Vue DevTools 完全指南：Vue 官方调试工具 · 组件 / Pinia / 路由 / Timeline / Inspector

  Learn more at [https://devtools.vuejs.org/](https://devtools.vuejs.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Vue DevTools 完全指南

Vue 官方调试工具 · 组件 / Pinia / Timeline · Vue 3

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Vue DevTools 是 Vue 3 + Vite + Pinia 项目的原生调试工具。
-->

---
transition: fade-out
---

# 什么是 Vue DevTools

Vue 官方维护的 Vue 应用调试工具（仅 Vue 3）

- **三种形态**：Vite 插件（推荐）/ 浏览器扩展 / Standalone
- **组件抽象层**：组件树 + props/setup/data/computed 状态
- **深度集成**：Pinia（time-travel）、Vue Router、Timeline
- **Inspector**：点选页面元素直达编辑器源码行
- **本项目原生**：Vue 3 + Vite + Pinia 装上 Vite 插件即用

> 浏览器 DevTools 看 DOM，Vue DevTools 看组件 + 响应式状态。

<!--
Vue DevTools 提供 Vue 抽象层的完整调试视图。
-->

---

# 三种形态

| 形态 | 安装 | 适用 |
|------|------|------|
| **Vite 插件**（推荐） | `vite-plugin-vue-devtools` | Vite 项目，功能最全 |
| 浏览器扩展 | 商店「Vue.js devtools」 | 任意 Vue 3 站点 |
| Standalone | `npx vue-devtools` | 不支持扩展的环境 |

> Vite 插件功能最全（含 Inspector / Inspect / Graph），需 Vite 6+。

<!--
三形态覆盖开发、线上调试、特殊环境。
-->

---

# Vite 插件安装（推荐）

```bash
npm i -D vite-plugin-vue-devtools
```

```ts
// vite.config.ts
import VueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [
    vue(),
    VueDevTools({
      componentInspector: true,
      launchEditor: "code",
    }),
  ],
});
```

> dev 启动后页面角落出现悬浮按钮，点开即 DevTools。

<!--
Vite 插件是本项目的首选形态。
-->

---

# 面板总览

| 面板 | 用途 |
|------|------|
| **Components** | 组件树、状态检查编辑 |
| **Pinia** | store 状态、time-travel |
| **Routing** | 路由调试 |
| **Timeline** | 事件、actions、性能 |
| **Graph** | 组件关系图 |
| **Inspector** | 点选跳源码 |

<!--
面板覆盖组件、状态、路由、性能全维度。
-->

---

# Components：组件树

展示 Vue 组件层级（非 DOM）

- `App > Layout > Sidebar > Menu` 组件树
- 选中组件，页面对应区域高亮
- 搜索框按组件名过滤
- 你的 `.vue` 组件 + 库组件都在树里

<!--
组件树以 Vue 的视角看页面结构。
-->

---

# Components：状态分类

选中组件，按类别看响应式状态

| 类别 | 来源 |
|------|------|
| **props** | 父组件传入 |
| **setup** | `<script setup>` 的 ref/reactive/computed |
| **data** | Options API data() |
| **computed** | 计算属性 |
| **injected** | inject 注入 |

<!--
Vue 3 script setup 的响应式数据归在 setup 分类。
-->

---

# 编辑状态：免改代码验证 UI

双击状态值直接改，响应式实时更新视图

```vue
<script setup>
const count = ref(0);
const user = reactive({ name: "Ada", vip: false });
</script>
```

- 把 `count` 改成 99，视图立即变
- 把 `user.vip` 改成 `true`，看 vip 用户界面

> 想看某状态下的 UI？直接改值，免改代码。

<!--
编辑状态是快速验证 UI 的利器。
-->

---

# Pinia：store 检查编辑

显示所有 Pinia store

- **store 列表**：每个 store 的 id 与状态
- **state**：可双击编辑，视图实时更新
- **getters**：派生值及当前结果
- **actions**：配合 Timeline 看调用

> 本项目用 Pinia，store 调试走 Vue DevTools，无需 Redux DevTools。

<!--
Pinia 面板直接管理全局状态。
-->

---

# Pinia time-travel（时间旅行）

Pinia DevTools 集成最强大的能力

- 每次 action / state 变更记为时间线事件
- 事件**按 action 分组**：看一个 action 内的所有 state 变化
- 可回溯到任意历史状态

> 状态错乱？沿时间线回放，找到出错的那一步 action。

<!--
time-travel 是 Pinia 状态调试的杀手锏。
-->

---

# Routing：路由调试

集成 Vue Router

- **当前路由**：path / name / params / query / meta / matched
- **history**：导航历史
- **所有路由**：注册的全部路由及配置

> 排查「参数没拿到 / 守卫没生效 / meta 没传对」，直接看真实路由状态。

<!--
Routing 面板让路由问题一目了然。
-->

---

# Timeline：统一时间线

各类事件按时间轴统一呈现

| 层 | 记录 |
|-----|------|
| Component events | 组件 emit |
| Pinia | mutations / actions |
| Router | 路由导航 |
| Performance | 渲染耗时 |
| Mouse / Keyboard | 输入事件 |

<!--
Timeline 把运行期所有事件汇总到一条时间轴。
-->

---

# Timeline：验证组件事件

确认 emit 是否如预期触发

```vue
<script setup>
const emit = defineEmits(["submit"]);
function onClick() {
  emit("submit", { id: 1 });
}
</script>
```

> 「点了按钮父组件没反应」：先看 Timeline 是否真 emit 了、参数对不对——快速区分「没触发」还是「没接住」。

<!--
Timeline 帮助排查事件触发问题。
-->

---

# Inspector：点选跳源码

集成 vite-plugin-vue-inspector

- 点选页面元素 → DevTools 高亮渲染它的组件
- 点击直接**跳到编辑器中该组件的源码行**

```ts
VueDevTools({
  componentInspector: true,
  launchEditor: "code", // 或 webstorm
});
```

> 从界面定位代码最快的方式：看到哪不对，一点就到 `.vue` 对应位置。

<!--
Inspector 打通了「界面 → 源码」的最短路径。
-->

---

# Graph 与 Inspect

**Graph：组件关系图**

- 可视化组件 / 模块依赖关系
- 理解大型应用结构与耦合

**Inspect：Vite 转换检查**

- 集成 vite-plugin-inspect
- 看模块经各 Vite 插件转换的步骤

<!--
Graph 看结构，Inspect 看构建转换。
-->

---

# 三形态对比

| 形态 | 功能 | 适用 |
|------|------|------|
| Vite 插件 | 最全 | Vite 项目开发 |
| 浏览器扩展 | 核心齐全 | 任意 Vue 3 站点 / 线上 |
| Standalone | 核心 | 不支持扩展的环境 |

> 开发用 Vite 插件，线上调试用浏览器扩展。

<!--
按场景选形态，三者可共存。
-->

---

# 与 Redux DevTools 的边界

| | Vue DevTools | Redux DevTools |
|---|---|---|
| 状态库 | Pinia / Vuex | Redux / Zustand |
| time-travel | ✅ Pinia 集成 | ✅ |
| 生态 | Vue | React 为主 |

> 本项目用 Pinia → 状态调试走 Vue DevTools，无需 Redux DevTools。

<!--
区分两个工具的适用生态。
-->

---
layout: center
class: text-center
---

# 小结

Vue DevTools = 组件 + Pinia + 路由 + Timeline 一体化

Vite 插件功能最全 · Pinia time-travel · 点选跳源码

**Vue 3 + Vite + Pinia 项目的原生标配**

[文档](https://devtools.vuejs.org/) · [Vite 插件](https://devtools.vuejs.org/guide/vite-plugin)

<!--
掌握 Vue DevTools，Vue 应用的调试与状态管理事半功倍。
-->
