---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Vue Router
info: |
  Presentation Vue Router for Vue 3 developers.

  Learn more at [https://router.vuejs.org/](https://router.vuejs.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:vue class="text-7xl" />
</div>

<br/>

## Vue Router — Vue.js Official Router

Client-side routing for Vue 3，由 Vue 团队官方维护（当前主线 v4.x，npm 已发布 5.0.7 增量版）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Vue Router —— Vue 生态的官方路由库，由 Vue 团队成员 Eduardo San Martin Morote 主导。

2014 年随 Vue.js 一同诞生，最初是 Vue 2 时代的 vue-router 3.x；2020 年配合 Vue 3 重写为 4.x 系列。
当前文档主线版本号 4.x，npm 包从 4.6.x 经 5.0.x 持续迭代（仍是同一代 API）。

核心卖点：声明式与编程式 API 并存、嵌套路由 / 命名视图、全套导航守卫、滚动行为可控、
TypeScript 类型推导友好、与 Composition API 深度协同。
-->

---
transition: fade-out
---

# 什么是 Vue Router？

Vue 官方客户端路由库，让 SPA 像传统多页应用一样切换 URL

<v-click>

- **官方维护**：与 Vue 核心团队同源，跟随 Vue 3 生命周期演进
- **声明式 + 编程式**：`&lt;RouterLink&gt;` / `&lt;RouterView&gt;` + `router.push()` 双轨
- **嵌套路由**：树形 `children` + 父级 `&lt;RouterView&gt;` outlet
- **三种 History 模式**：HTML5 / Hash / Memory，按场景选择
- **导航守卫体系**：全局 / 路由级 / 组件内，三层颗粒度
- **路由匹配语法**：动态段 / 可选 / 重复 / catch-all / 自定义正则
- **Composition API**：`useRouter()` / `useRoute()` 与 `<script setup>` 天作之合
- **TypeScript 友好**：路径推导、`RouteMeta` 扩展、`unplugin-vue-router` 加持

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Vue Router Introduction_](https://router.vuejs.org/introduction.html)

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

<!--
[click] Vue Router 的定位非常清晰：Vue 3 官方推荐的路由解决方案。

它的核心价值是「让单页应用具备多页应用的导航语义」——
URL 变化、浏览器前进/后退、深链接、SEO meta —— 这些原本是 MPA 的能力，
SPA 通过 Vue Router 统一接管。

声明式 API 写起来像普通模板，编程式 API 适合在事件回调里跳转。
两套 API 共享同一个底层 history 抽象，能力对等。

嵌套路由是 Vue Router 的杀手锏 —— 父组件嵌一个 <RouterView>，子组件就插进来，
天然适配「左侧导航 + 右侧详情」「卡片列表 + 详情抽屉」这类布局。

三种 history 模式覆盖了几乎所有场景：
- WebHistory：生产推荐，需要服务端 fallback
- WebHashHistory：纯静态托管首选（GitHub Pages / OSS）
- MemoryHistory：SSR / 测试 / Electron 等无 URL 场景

导航守卫是企业项目的命脉 —— 权限校验、未保存提醒、埋点上报都靠它。
-->

---
transition: slide-up
level: 2
---

# 评价

成熟稳定、文档完备、生态健全，但相比 React 生态在「数据路由」侧探索更慢

<v-clicks>

**优点**
- API 设计成熟，14 年沉淀，几乎没有「踩坑」未解的角落
- 与 Vue 3 Composition API 完美融合，`useRoute` 响应式自动追踪
- 嵌套路由 + 命名视图组合能力极强，复杂布局轻松表达
- TypeScript 类型推导优秀（配合 `unplugin-vue-router`）
- 文档质量第一档，与 Pinia / Nuxt / VueUse 等生态深度协同
- bundle 体积小，~10 KB gzipped，按需 tree-shake

**缺点**
- 缺少类似 Remix `loader` / `action` 的官方数据路由范式
- 类型推导端到端不如 TanStack Router 激进
- 文件约定路由需第三方 `unplugin-vue-router`（即将官方化）

</v-clicks>

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
---

# 定位与生态

Vue Router 在前端路由版图里的位置

<v-clicks>

- **谁在做**：Eduardo San Martin Morote（Vue 核心团队）+ Evan You 总督
- **历史脉络**：2014 与 Vue 1.x 同生 → 2017 v3 配 Vue 2 → 2020 v4 配 Vue 3 → 2024 v4.x 持续迭代到 npm 5.x
- **官方定位**：Vue 3 项目「开箱即推荐」的路由方案，`create-vue` 默认勾选
- **核心理念**：「URL 是应用的状态」—— 让导航逻辑显式而非藏在组件里
- **与 Pinia 关系**：Pinia 管「内存状态」，Router 管「URL 状态」，互不重叠
- **与 Nuxt 关系**：Nuxt 内部基于 Vue Router 构建文件约定 + SSR 数据加载
- **关键竞争对手**：React Router、TanStack Router、SvelteKit 路由
- **学习路径**：装包 → 配 routes → `&lt;RouterLink&gt;` / `&lt;RouterView&gt;` → 守卫 → 高级特性

</v-clicks>

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
---

# 版本里程碑

| 版本 | 时间 | 关键事件 |
|---|---|---|
| **1.x** | 2014 | 配 Vue 1.x 时代首发 |
| **3.x** | 2017 | 配 Vue 2，长期维护版 |
| **4.0** | 2020.12 | Vue 3 重写，`createRouter` + Composition API |
| **4.1–4.2** | 2022–23 | 组合 meta + guard 更灵活，`definePage` 集成 |
| **4.5–4.6** | 2024 | 加固类型推导，修复 popstate 时序，安全补丁 |
| **5.0** | 2025.Q1 | 实验性 Data Loaders、整合 unplugin-vue-router |
| **5.0.7** | 2025 | 当前 npm `latest`，Babel 8、prototype pollution 防护 |

<v-click>

文档主线仍标记为「Vue Router 4」（API 兼容），版本号在 npm 走到了 5.x —— 一份代码贯穿两个号段。

</v-click>

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
---

# 与 React Router / TanStack Router 对比

<v-click>

| 维度 | Vue Router 4 | React Router v7 | TanStack Router |
| --- | --- | --- | --- |
| 框架绑定 | **Vue 3 官方** | React 18+ | React 18+ |
| API 风格 | 声明式 + 编程式 | Routes + Data router | Route object 类型化 |
| 数据加载 | 守卫 + 组件内自管 | `loader` / `action` | `loader` + react-query |
| SSR | 通过 Nuxt | Framework 模式一等公民 | TanStack Start |
| 文件约定 | `unplugin-vue-router` | `flatRoutes()` | 自动扫描 `routes/` |
| 类型安全 | 良好（手动 + 插件） | `+types/` 自动生成 | **编译期路径校验** |
| 包体积 | ~10 KB | ~17 KB | ~13 KB |

</v-click>

<div v-click text-xs text-right>

Vue Router 强项：声明式 API + 嵌套路由 + 与 Vue 生态深度融合

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

<!--
[click] 横向对比 ——

Vue Router 没有 React Router 那种「Framework 模式」野心，
它专注做好「客户端路由」这一件事，SSR 留给 Nuxt 这层来封装。

数据加载是它与 React 生态的最大差异 ——
React Router / TanStack 都把 `loader` 写进路由配置，框架自动并行加载、缓存、重验证；
Vue Router 把这层留给了用户（用守卫 + composable + Pinia 自由组合）。
这既是缺点（缺少官方范式），也是优点（不绑架业务架构）。

类型推导方面，`unplugin-vue-router` 让 Vue Router 也能做到「路径补全 + params 类型推导」，
即将合并进核心（v5 实验性功能）。

包体积 / DevTools / 历史包袱方面，Vue Router 都在第一档。
-->

---
transition: fade-out
---

# 安装与初始化

5 分钟接入任意 Vue 3 项目

<div class="grid grid-cols-2 gap-x-8">

<div>

<v-click>

**安装**

```bash
pnpm add vue-router
# 或
npm install vue-router
# 或
yarn add vue-router
```

| 版本   | Vue 兼容  | 状态                  |
| ------ | --------- | --------------------- |
| 4.x / 5.x | Vue 3.0+  | **当前主线**       |
| 3.x    | Vue 2     | 仅维护安全补丁        |
| 1.x    | Vue 1     | 已废弃                |

</v-click>

</div>

<div>

<v-click>

**入口配置**

```ts
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import HomeView from "./views/HomeView.vue";
import AboutView from "./views/AboutView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomeView },
    { path: "/about", component: AboutView },
  ],
});

createApp(App).use(router).mount("#app");
```

</v-click>

</div>

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

<!--
[click] Vue Router 安装极简 —— 一个包，没有可选 peer dependency（除 Vue 本身）。
v4.x / v5.x 都是 Vue 3 项目主线（命名虽换号，API 兼容）。

[click] 入口配置三步：
1. createRouter() 创建实例
2. routes 数组声明所有路径 → 组件映射
3. app.use(router) 注册插件

注册顺序必须在 mount() 之前，否则首次 useRouter 拿不到实例。
create-vue 脚手架勾选「Vue Router」后会自动生成 src/router/index.ts，开箱即用。
-->

---
transition: fade-out
---

# 三种 History 模式

不同部署场景选不同的 history 工厂

<v-click>

```ts
import { createWebHistory, createWebHashHistory, createMemoryHistory } from "vue-router";

const router = createRouter({
  // 1. HTML5 模式（推荐）：URL 像传统站点，需要服务端 fallback
  history: createWebHistory(),
  // 2. Hash 模式：URL 带 #，纯静态托管首选
  // history: createWebHashHistory(),
  // 3. Memory 模式：SSR / 测试 / Electron
  // history: createMemoryHistory(),
  routes: [],
});
```

</v-click>

<v-click>

| 模式 | URL 形如 | 适用场景 | 服务端要求 |
|---|---|---|---|
| WebHistory | `/users/42` | 生产 SPA / SSR | fallback 到 `index.html` |
| WebHashHistory | `/#/users/42` | GitHub Pages / OSS 等静态托管 | 无 |
| MemoryHistory | （不可见） | SSR / 单元测试 / 桌面应用 | 无 |

</v-click>

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

<!--
[click] 三种模式底层共享同一套 history 抽象，切换成本极低 —— 只换一个工厂函数。

WebHistory 是生产首选，URL 干净没多余符号；
但服务端必须把所有路由 fallback 到 index.html，否则刷新会 404。
Nginx 配 `try_files $uri $uri/ /index.html;`，Netlify / Vercel 自动处理。

Hash 模式 URL 多个 `#`，看起来不够正式，但好处是无需服务端配合 ——
GitHub Pages、OSS、CDN 都能直接托管，刷新永远工作。

Memory 模式没有 URL 概念 —— 主要用在 SSR（服务端不需要操作浏览器历史）、
单元测试（隔离每个 test 的导航）、Electron 主进程等场景。

base 参数走进工厂函数：`createWebHistory('/SlideStack/')`，
不再像 v3 那样作为 router 选项。
-->

---
transition: fade-out
---

# RouterLink 与 RouterView

两个核心组件支撑整个声明式导航

<div class="grid grid-cols-2 gap-x-8">

<div>

<v-click>

**RouterLink：声明式导航**

```vue
<template>
  <nav>
    <RouterLink to="/">首页</RouterLink>
    <RouterLink to="/about">关于</RouterLink>
    <RouterLink
      :to="{ name: 'user', params: { id: 42 } }"
    >
      用户 42
    </RouterLink>
  </nav>
</template>
```

底层渲染 `<a>` 标签，拦截点击事件 + 走 `router.push`。

</v-click>

</div>

<div>

<v-click>

**RouterView：路由出口**

```vue
<template>
  <header>...</header>

  <main>
    <RouterView />
    <!-- 当前路由匹配到的组件在这里渲染 -->
  </main>

  <footer>...</footer>
</template>
```

每个 `&lt;RouterView&gt;` 对应路由树的一层。

</v-click>

</div>

</div>

<v-click>

> 💡 **PascalCase vs kebab-case**：组件名两种写法等价。`&lt;RouterLink&gt;` 与 `&lt;router-link&gt;` 都可用，本幻灯统一用 PascalCase。

</v-click>

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

<!--
[click] RouterLink 是 Vue Router 的声明式入口 ——
渲染 a 标签 + 拦截 click + 走 history API，整个过程对用户无感知。

它支持三种 to 写法：
- 字符串：`to="/about"`
- 对象（含 path）：`:to="{ path: '/about' }"`
- 对象（含 name + params）：`:to="{ name: 'user', params: { id: 42 } }"`

注意：用 path 时 params 会被忽略，必须用 name 才能传 params —— 这是 v4 的一个易错点。

[click] RouterView 是路由的「渲染插槽」——
它告诉 Vue Router「请把当前匹配到的组件渲染到这里」。

一个应用至少有一个根级 RouterView（通常在 App.vue 里），
嵌套路由则每层父组件都包含自己的 RouterView。
-->

---
transition: fade-out
---

# 路由匹配语法（一）：动态段与可选

URL pattern 写法

<v-click>

**动态段：用 `:` 前缀**

```ts
{ path: "/users/:id", component: User }
// 匹配 /users/42、/users/john 等
```

```vue
<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
console.log(route.params.id);  // "42" or "john"
</script>
```

</v-click>

<v-click>

**可选段：用 `?` 后缀**

```ts
{ path: "/users/:id?", component: User }
// 匹配 /users 和 /users/42 两种
```

</v-click>

<v-click>

**多个参数嵌套**

```ts
{ path: "/users/:userId/posts/:postId", component: Post }
// route.params: { userId: '1', postId: '2' }
```

</v-click>

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

<!--
[click] 动态段是路由匹配最高频的能力 ——
冒号前缀表示「这一段是参数」，参数名 = `route.params` 的 key。

读取时通过 `useRoute()` 拿到响应式 route 对象，访问 `route.params.id`。
注意 params 永远是字符串 / 字符串数组，需要数值时自己 `Number(...)`。

[click] 可选段 `?` 后缀让一个路径处理「有/没有」两种情况。
对应 `/users` 时 `params.id` 是 undefined。

[click] 多个动态段可以嵌套，每个都是独立的 param。
URL 越深，能传的信息越多 —— 但深路径不利于 SEO 与分享，3 层是大多数项目的上限。
-->

---
transition: fade-out
---

# 路由匹配语法（二）：重复段与 catch-all

更高级的 URL pattern

<v-click>

**重复段：`+` 一次或多次，`*` 零次或多次**

```ts
{ path: "/chapters/:section+", component: Chapter }
// 匹配 /chapters/intro、/chapters/intro/setup、/chapters/intro/setup/install
// route.params.section: ['intro', 'setup', 'install']  ← 是数组！

{ path: "/optional/:tags*", component: Tags }
// 匹配 /optional、/optional/a、/optional/a/b 等
```

</v-click>

<v-click>

**Catch-all（404 兜底）**

```ts
{
  path: "/:pathMatch(.*)*",
  name: "NotFound",
  component: NotFound,
}
// 任何未匹配的 URL 都走这里
// route.params.pathMatch: ['unmatched', 'path']
```

</v-click>

<v-click>

> 💡 **v3 → v4 迁移**：v3 的 `path: '*'` 已被废弃，必须改成 `:pathMatch(.*)*`。

</v-click>

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

<!--
[click] 重复段对「面包屑式」URL 很有用 ——
`/docs/guide/install` 这种深层路径，可以用 `:path+` 一次性接住，
路由组件再根据 segments 数组渲染对应内容。

`+` 至少一段，`*` 允许零段（路径仅根）。
`route.params` 拿到的是字符串数组而非单个字符串。

[click] Catch-all 是 404 页面的标准写法 ——
Vue Router 4 不再支持 v3 的 `*` 通配符，必须显式声明 `:pathMatch(.*)*`。

注意末尾的 `*` 修饰符让 pathMatch 变成数组，
比如 `/foo/bar` 会得到 `params.pathMatch: ['foo', 'bar']`。
如果改成 `:pathMatch(.*)`（无尾 `*`），就变成单个字符串 `"foo/bar"`。

[click] 这是 v3 → v4 最常见的迁移修改之一 —— 老项目升级一定要搜全局 `path: '*'` 改掉。
-->

---
transition: fade-out
---

# 路由匹配语法（三）：自定义正则

更精确的段匹配

<v-click>

**带正则约束**

```ts
{ path: "/users/:id(\\d+)", component: User }
// 仅匹配 /users/42（纯数字）
// /users/john 不匹配，落到下一条路由

{ path: "/users/:id", component: UserByName }
// 接住非数字 id（必须放在数字版之后）
```

</v-click>

<v-click>

**sensitive + strict 选项**

```ts
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/users", component: User, sensitive: true, strict: true },
  ],
  sensitive: false,   // 默认大小写不敏感
  strict: false,      // 默认允许 /users/ 与 /users 等价
});
```

</v-click>

<v-click>

> 💡 **性能警告**：避免在路径中间用 `(.*)` 等贪婪正则 —— 引擎会回溯多次，路由表大时性能问题严重。catch-all 永远只放最后。

</v-click>

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

<!--
[click] 自定义正则让一个 path 模板能区分多种格式 ——
比如 `/users/:id(\\d+)` 只接数字 id，配合后面一条 `/users/:id` 接 username，
就实现了「数字 ID 走详情、字符串走个人主页」的路由分流。

注意正则要双反斜杠转义：`\\d+` 在字符串里实际是 `\d+`。

[click] sensitive + strict 控制大小写与尾斜杠 ——
默认两者都是 false（大小写不敏感、允许尾斜杠）。
SEO 严格的项目可以全局开 strict + sensitive，强制规范化 URL。

[click] 性能踩坑：贪婪 `.*` 放在路径中间会让正则引擎来回回溯，
路由数量增长后性能急剧下降。catch-all 永远只能在路由表最后一项。
-->

---
transition: fade-out
---

# 嵌套路由

children 数组 + 父级 RouterView outlet

<div class="grid grid-cols-2 gap-x-4">

<div>

<v-click>

**路由配置**

```ts
const routes = [
  {
    path: "/user/:id",
    component: UserLayout,
    children: [
      // 默认子路由（命中 /user/:id）
      { path: "", component: UserProfile },
      // /user/:id/posts
      { path: "posts", component: UserPosts },
      // /user/:id/settings
      { path: "settings", component: UserSettings },
    ],
  },
];
```

</v-click>

</div>

<div>

<v-click>

**父组件挂 RouterView**

```vue
<!-- UserLayout.vue -->
<template>
  <div class="user-layout">
    <aside><UserSidebar /></aside>
    <main>
      <RouterView />
      <!-- 子路由组件插这里 -->
    </main>
  </div>
</template>
```

</v-click>

</div>

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

<!--
[click] 嵌套路由的核心是 children 数组 ——
父路由配 path，子路由的 path 自动拼接到父路径之后（不用写完整路径）。

空 path 子路由代表「访问父路径时的默认渲染」——
访问 /user/42 时显示 UserProfile，等价于 /user/42/。

[click] 父组件必须自己包含一个 RouterView，否则子路由组件无处可渲染。
这是 Vue Router 与 React Router 的设计差异 ——
React Router 是 <Outlet />，Vue Router 是 <RouterView />，本质一样。

实战中嵌套层级建议不超过 3 层：
- 第一层：全局布局（Header + Sidebar + 内容区）
- 第二层：模块布局（用户中心 / 商品管理 等）
- 第三层：具体页面

超过 3 层就要考虑用 tab + state 代替嵌套路由。
-->

---
transition: fade-out
---

# Named Routes 命名路由

避免硬编码路径

<div class="grid grid-cols-2 gap-x-4">

<div>

<v-click>

**为路由起名**

```ts
const routes = [
  {
    path: "/user/:id",
    name: "user",
    component: User,
  },
  {
    path: "/products/:category/:id",
    name: "product",
    component: Product,
  },
];
```

</v-click>

</div>

<div>

<v-click>

**用 name 跳转（推荐）**

```ts
// ❌ 硬编码字符串
router.push("/user/42");

// ✅ name + params
router.push({ name: "user", params: { id: 42 } });

// ✅ RouterLink 同款
<RouterLink :to="{ name: 'user', params: { id: 42 } }">
  Profile
</RouterLink>
```

</v-click>

</div>

</div>

<v-click>

> 💡 **TS 增强**：配合 `unplugin-vue-router`，name 与 params 都能编译期检查。

</v-click>

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

<!--
[click] 命名路由的目的是「解耦调用方与 URL 模板」——
组件 A 想跳转到「用户详情页」，不需要知道详情页 URL 是 /user/:id 还是 /profile/:id；
只要约定一个 name = 'user' 即可。

后期 URL 重构（比如把 /user/:id 改成 /u/:id）只改路由配置，调用方零修改。

[click] router.push 接受 string 或 location object。
传 path 时 params 被忽略，必须用 name 才能 params 生效 —— 这是 v4 的硬约束。

如果想在 path 里拼 params，自己 `path: \`/user/${id}\`` 拼接，
但这就回到了硬编码路径的老路。

[click] unplugin-vue-router 让路由名 + params 都进入 TS 类型系统，
拼错 name 或漏传 params 直接报错 —— 大型项目强烈推荐。
-->

---
transition: fade-out
---

# Named Views 命名视图

一个路由渲染多个组件到不同位置

<div class="grid grid-cols-2 gap-x-4">

<div>

<v-click>

**多个 RouterView 用 name 区分**

```vue
<!-- App.vue -->
<template>
  <RouterView name="sidebar" />
  <RouterView />
  <RouterView name="footer" />
</template>
```

</v-click>

<v-click>

**路由用 components（复数）映射**

```ts
const routes = [{
  path: "/dashboard",
  components: {
    default: DashboardMain,
    sidebar: DashboardNav,
    footer: DashboardActions,
  },
}];
```

</v-click>

</div>

<div>

<v-click>

**适用场景**

- 后台管理：侧边栏 + 主内容 + 操作栏，三块独立切换
- 邮件应用：邮件列表 + 详情 + 工具栏
- IDE 风格布局：导航 + 编辑器 + 控制台

</v-click>

</div>

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

<!--
[click] 命名视图解决「同一路由同时切换多块 UI」的问题 ——
传统嵌套路由是「父子层级」，命名视图是「同级并行」。

App.vue 里写三个 RouterView，分别 name="sidebar" / 默认 / name="footer"。
默认（不写 name 的）等价于 name="default"。

[click] 路由配置改用 components（复数）—— 一个 object 映射多个组件。
key 必须与 RouterView 的 name 严格一致，default 对应未命名的那个。

[click] 命名视图适合「整块 UI 跟随路由变化但又不是嵌套关系」的场景 ——
比如后台管理的侧边导航、邮件应用的三栏布局、IDE 风格的面板。

如果只是「父子布局」，仍然用嵌套路由（children + 父级 RouterView）更直观。
-->

---
transition: fade-out
---

# 编程式导航

router.push / replace / go / back / forward

<div class="grid grid-cols-2 gap-x-4">

<div>

<v-click>

**router.push：新增历史记录**

```ts
import { useRouter } from "vue-router";
const router = useRouter();

// 字符串路径
router.push("/users/eduardo");

// 对象 + name + params
router.push({ name: "user", params: { id: 42 } });

// 加 query 与 hash
router.push({
  path: "/register",
  query: { plan: "private" },
  hash: "#team",
});
```

</v-click>

</div>

<div>

<v-click>

**router.replace：替换当前记录（不新增历史）**

```ts
router.replace({ path: "/home" });
// 等价于
router.push({ path: "/home", replace: true });
```

</v-click>

</div>

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

<!--
[click] router.push 是最高频的编程式 API ——
- 简单跳转用字符串
- 需要 query / hash / params 用对象形式
- params 必须配 name 使用（path 形式会忽略 params）

push 会在浏览器历史栈新增一条记录，用户点「后退」能回到来源页。

[click] router.replace 适用于「不希望用户回退」的场景 ——
比如登录成功后跳首页，回退不应该回到登录页。

注意：replace 不是 push 的「优化版本」，而是语义不同。
误用 replace 会破坏浏览器后退栈，影响 UX。
-->

---
transition: fade-out
---

# 编程式导航：历史栈控制

go / back / forward

<v-click>

```ts
// 在历史栈中前进 / 后退 N 步
router.go(1);    // 前进 1
router.go(-1);   // 后退 1（等价于 back()）
router.back();      // 后退 1
router.forward();   // 前进 1

// 越界时静默失败，不抛异常
router.go(99);   // 历史没那么多记录，无事发生
```

</v-click>

<v-click>

**所有导航方法都返回 Promise**

```ts
// 等待导航完成
await router.push("/users/42");
// 这里 useRoute() 的 path 已经是 /users/42

// 检查导航是否被守卫拦截
const failure = await router.push("/admin");
if (failure?.type === NavigationFailureType.aborted) {
  console.log("被守卫挡住了");
}
```

</v-click>

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

<!--
[click] go / back / forward 操作浏览器历史栈本身 ——
与 push / replace 的区别：后两者是「我决定去哪里」，前三者是「按浏览器历史走」。

go(n) 接受正负整数，正数前进负数后退。
越界（比如刚打开就 back()）静默失败，不会抛异常 —— 设计上为了避免组件无谓崩溃。

[click] v4 的所有导航方法都是 Promise，可以 await 等待完成。

这个特性在 e2e 测试和「跳转后做事」的场景特别有用：
- 测试：await push 后再断言 DOM
- 业务：跳转完成后再发起埋点

返回的 failure 对象可以判断是「被守卫挡住」「被新的导航打断」还是「重复导航」，
对应 NavigationFailureType 的三种枚举值。
-->

---
transition: fade-out
---

# useRoute：读取当前路由

响应式访问 params / query / meta

<v-click>

```vue
<script setup lang="ts">
import { useRoute } from "vue-router";
import { watch } from "vue";

const route = useRoute();

// 读字段（自动响应路由变化）
console.log(route.params.id, route.query.q, route.hash);
console.log(route.fullPath, route.meta.requiresAuth);

// 监听变化
watch(() => route.params.id, (newId) => {
  console.log("ID 变了：", newId);
});
</script>

<template>
  <p>当前 ID：{{ route.params.id }}</p>
</template>
```

</v-click>

<v-click>

> 💡 **不要解构 route**：`const { params } = route` 会丢失响应性。用 `toRefs(route)` 或直接 `route.params.x`。

</v-click>

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

<!--
[click] useRoute() 返回一个响应式 route 对象，
里面所有字段（params / query / hash / meta / matched 等）都会随导航更新。

它的设计与 Pinia store 一致 —— 拿到 reactive proxy，直接 `.` 访问即可。
template 里就能用 `route.params.id`，不需要 ref / unwrap。

watch 监听 params 变化是「同组件不同参数」的标准模式 ——
比如 /user/1 → /user/2，组件实例会被复用（性能好），
但 params 变了 setup 不会重跑，必须用 watch 主动响应。

[click] 解构 route 是新手常见错误 ——
`const { params } = route` 拿到的 params 是普通 object，路由切换后不会更新。

正确做法：
- 模板里直接 route.params.x
- 计算属性：const id = computed(() => route.params.id)
- VueUse 帮手：useRouteParams() / useRouteQuery()
-->

---
transition: fade-out
---

# useRouter：操作导航

获取 router 实例

<v-click>

```vue
<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function goToProfile() {
  router.push({ name: "profile" });
}

function logout() {
  // 清登录态后跳登录页（不留历史）
  localStorage.removeItem("token");
  router.replace({ name: "login" });
}
</script>

<template>
  <button @click="goToProfile">个人主页</button>
  <button @click="logout">退出</button>
</template>
```

</v-click>

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

<!--
[click] useRouter() 与 useRoute() 是两个最重要的 composable —— 一个用来「操作」，一个用来「读取」。

router 主要用于：
- push / replace / go / back / forward
- addRoute / removeRoute（动态路由）
- beforeEach / beforeResolve / afterEach（运行时注册守卫）
- resolve（解析路径，不导航）

route 主要用于：
- 读 params / query / hash / meta
- watch 监听路由变化
- 配合 keep-alive 缓存场景

logout 场景特别提一下：用 replace 而非 push，
否则用户点「后退」会回到已经无权限的页面 —— 体验差且潜在安全风险。
-->

---
transition: fade-out
---

# Query 与 Hash

URL 中携带的额外信息

<div class="grid grid-cols-2 gap-x-4">

<div>

<v-click>

**Query：?key=value 形式**

```ts
// 跳转：/search?q=vue&page=2
router.push({
  path: "/search",
  query: { q: "vue", page: 2 },
});

// 读取
route.query.q;     // 'vue'
route.query.page;  // '2'（注意是字符串）
```

</v-click>

<v-click>

**Hash：#section 形式**

```ts
// 跳转：/about#team
router.push({ path: "/about", hash: "#team" });
route.hash;  // '#team'
```

</v-click>

</div>

<div>

<v-click>

**Query vs Params 选择**

- **Params**：定义路径的语义部分（`/user/:id`）—— 路径必填，影响 SEO
- **Query**：携带附加状态（`?sort=desc&page=2`）—— 可选，不影响匹配

</v-click>

</div>

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

<!--
[click] query 适合「不影响路由匹配但需要持久化在 URL」的状态 ——
搜索词、分页号、排序、筛选条件，刷新 / 分享链接都能保持。

注意：query 与 params 都是字符串（数字类型也会被自动 toString）。
读出后需要数字处理：`Number(route.query.page) || 1`。

数组形式：`?tags=vue&tags=react` → `route.query.tags === ['vue', 'react']`。

[click] hash 主要用于「页内锚点定位」，配合 scrollBehavior 实现平滑滚动到 #section。

[click] params vs query 是一道经典选择题：
- 「这个参数是这个页面的核心标识吗？」是 → params
- 「换一个值会让 URL 看起来像同一个页面的另一种视图吗？」是 → query

例如：商品详情用 params（每个商品是独立页面），
商品列表筛选用 query（同一个页面的不同视图）。
-->

---
transition: fade-out
---

# 全局守卫：beforeEach

最常用的导航拦截

<v-click>

```ts
router.beforeEach(async (to, from) => {
  // 1. undefined / true → 放行
  // 2. return false → 取消导航
  // 3. return RouteLocationRaw → 重定向

  // 例：未登录用户访问需要登录的页面
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: "login", query: { redirect: to.fullPath } };
  }
});
```

</v-click>

<v-click>

| 参数 | 类型 | 含义 |
|---|---|---|
| `to` | RouteLocation | 即将进入的路由 |
| `from` | RouteLocation | 即将离开的路由 |
| `next` | function | 旧版回调（**v4 推荐用返回值替代**） |

</v-click>

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

<!--
[click] beforeEach 是全局前置守卫 —— 每次导航开始时调用，能拦能转能放行。

v4 推荐用返回值语法：
- return false → 取消
- return { name: 'x' } → 重定向
- return undefined / 不写 return → 放行

老的 next() 回调仍然支持，但官方建议用返回值（更易理解、更少错误）。

[click] to / from 是 RouteLocation 对象，包含 path / params / query / meta / matched 等完整信息。

登录拦截是 beforeEach 的最经典用例 ——
- 配置：路由 meta.requiresAuth = true 标记
- 守卫：检查 token + 重定向到 /login?redirect=...
- 登录后：read redirect 然后 router.push 过去

避免在守卫里写过重逻辑（API 调用），否则每次导航都等很久。
权限校验可以缓存一份在 Pinia store。
-->

---
transition: fade-out
---

# 路由级守卫：beforeEnter

只在进入特定路由时触发

<v-click>

```ts
const routes = [
  {
    path: "/admin",
    component: Admin,
    beforeEnter: (to, from) => {
      if (!isAdmin()) return { name: "forbidden" };
    },
  },
  // 数组形式：多个守卫按顺序执行（v4.2+）
  { path: "/dashboard", component: Dashboard, beforeEnter: [requireAuth, requireSub] },
];
```

</v-click>

<v-click>

**特点**

- 仅在「**首次进入该路由**」时触发，params/query 变化不重跑
- 嵌套路由：父路由的 beforeEnter 仅在跨父级时触发
- 全局：跨多个路由的通用规则；路由级：仅关心一个路由的细致规则

</v-click>

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

<!--
[click] beforeEnter 是路由级别的前置守卫 —— 只挂在某一个路由上。

它的执行时机比 beforeEach 更晚，但比组件内 beforeRouteEnter 早：
beforeEach → beforeEnter → 组件加载 → beforeRouteEnter

[click] 重要特性：beforeEnter 在「params/query 变化但仍在同一路由」时不会重跑。
这与 beforeEach 不同 —— 后者每次导航都触发。

如果想在 /user/1 → /user/2 时也跑一次守卫，要用组件内 beforeRouteUpdate，或写在 beforeEach。

v4.2 起 beforeEnter 支持数组形式，多个守卫按顺序执行，便于复用 ——
比如 [requireAuth, requireRole('admin'), checkSubscription]。

[click] 选型建议：
- 「所有需要登录的页面」→ 全局 beforeEach + meta.requiresAuth
- 「只有管理员后台」→ beforeEnter 写在 /admin 路由上
- 「这个具体页面要先 confirm 才能离开」→ 组件内 beforeRouteLeave
-->

---
transition: fade-out
---

# 组件内守卫

onBeforeRouteEnter / Update / Leave

<v-click>

**Composition API 风格（推荐）**

```vue
<script setup lang="ts">
import { onBeforeRouteUpdate, onBeforeRouteLeave } from "vue-router";

// 同一组件 + params 变化时触发
onBeforeRouteUpdate(async (to) => {
  await fetchUser(to.params.id);
});

// 离开本组件时触发（适合「未保存提醒」）
onBeforeRouteLeave(() => {
  if (hasUnsavedChanges()) {
    if (!window.confirm("有未保存改动，确定离开？")) return false;
  }
});
</script>
```

</v-click>

<v-click>

> 💡 **没有 onBeforeRouteEnter**：进入组件前组件还未创建，setup 不会跑。要做「进入前」逻辑，请用 beforeEnter（路由级）。

</v-click>

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

<!--
[click] 组件内守卫的 Composition API 写法是 v4 的标志特性。

onBeforeRouteUpdate：同组件不同 params/query 时触发。
最经典场景：/user/1 → /user/2，组件被复用，需要重新拉数据。
传统写法是 watch route.params，更新守卫是同一目的的更显式 API。

onBeforeRouteLeave：用户即将离开本组件时触发。
最典型场景：表单未保存提醒。返回 false 阻止离开。

注意：浏览器原生的 confirm 弹窗在某些 SSR / 自动化测试场景不可用，
生产环境建议用自己的 Dialog 组件 + 异步守卫。

[click] 没有 onBeforeRouteEnter —— 这是个常见误解。
进入组件前，组件实例还没创建，setup() 还没跑，自然没法在内部注册「进入前」守卫。

需要「进入前」逻辑：
- 全局：beforeEach
- 路由级：beforeEnter
- Options API：beforeRouteEnter（但不能访问 this）
-->

---
transition: fade-out
---

# 完整导航解析流程

12 步走完一次路由切换

<v-click>

```
1.  触发 router.push / 链接点击
2.  调用旧组件的 beforeRouteLeave (组件内)
3.  调用全局 beforeEach
4.  调用复用组件的 beforeRouteUpdate (组件内)
5.  调用路由配置里的 beforeEnter
6.  解析异步路由组件（import() 加载）
7.  调用新组件的 beforeRouteEnter (组件内)
8.  调用全局 beforeResolve  ← 异步数据加载好时机
9.  导航确认（更新 history、URL）
10. 调用全局 afterEach
11. DOM 更新（渲染新组件）
12. 调用 beforeRouteEnter 内的 next(vm => ...) 回调
```

</v-click>

<v-click>

**关键观察**

- **beforeResolve** 在导航确认前，异步组件已加载 —— 适合做「数据预取」
- **afterEach** 在导航确认后调用，无法取消 —— 只能做日志 / 埋点
- 任何步骤返回 `false` 或抛错都会取消整个流程

</v-click>

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

<!--
[click] 这 12 步是 Vue Router 4 的导航生命周期，理解它能解决 90% 的「守卫顺序」疑惑。

关键节点：
- 第 2 步：旧组件 leave 先于其他守卫触发（早期取消可以省下后续工作）
- 第 6 步：异步路由组件在这一步才真正加载（lazy load 的关键点）
- 第 8 步：beforeResolve 是「最后一道异步关」—— 此时所有组件都加载完了，
            适合做数据预取、骨架屏决定等

[click] beforeResolve 与 beforeEach 的差异：
- beforeEach 在异步组件加载前
- beforeResolve 在异步组件加载后（确认前）

需要确保「跳转到的页面所有组件都加载完毕」再放行 → beforeResolve。
比如要在 loading 状态下不让用户继续点击 —— beforeResolve 是最佳锚点。

afterEach 仅做「副作用」用途 ——
埋点上报、loading 关闭、document.title 更新、滚动重置等。
-->

---
transition: fade-out
---

# afterEach：导航后副作用

不能阻止导航，只能做副作用

<v-click>

```ts
// 1. 自动更新页面标题
router.afterEach((to) => {
  document.title = `${to.meta.title ?? "Default"} | My App`;
});

// 2. 埋点上报
router.afterEach((to, from) => {
  analytics.track("page_view", { path: to.path, referrer: from.path });
});

// 3. 关闭全局 loading 条
router.afterEach(() => nProgress.done());

// 4. 滚动到顶部（也可用 scrollBehavior）
router.afterEach(() => window.scrollTo({ top: 0 }));
```

</v-click>

<v-click>

> 💡 **失败导航**：afterEach 也会在导航失败时触发，第三个参数 `failure` 标记失败类型。

</v-click>

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

<!--
[click] afterEach 是「副作用专用」hook —— 它无法取消导航，参数也只有 to / from / failure。

四个最常见用例：

1. 页面标题 —— 配合 meta.title 实现「每个页面独立 title」，
   有些项目还会做面包屑导航，from + to 配合 router.matched 拼接路径。

2. 埋点 —— GA / Mixpanel / 自建数据平台都靠 page_view 事件，afterEach 是最干净的接入点。
   注意要在 SPA 路由切换时手动触发（页面初始加载用 hash router 不会触发 onload）。

3. NProgress / loading 条 —— beforeEach 启动 + afterEach 关闭，是大型管理后台的标配。

4. 滚动复位 —— scrollBehavior 更优雅，但 el-main / iframe 内嵌等场景 scrollBehavior 不工作，
   只能用 afterEach 手动 scrollTop = 0。

[click] failure 参数是 v4 新增 ——
- aborted：守卫主动取消
- cancelled：被新导航打断
- duplicated：相同路由重复导航
有些埋点会想区分「真实跳转」vs「拦截 / 重复」。
-->

---
transition: fade-out
---

# Route Meta 路由元信息

为路由附加任意自定义数据

<div class="grid grid-cols-2 gap-x-4">

<div>

<v-click>

**定义 + 使用**

```ts
const routes = [
  {
    path: "/admin",
    meta: {
      requiresAuth: true,
      roles: ["admin"],
      title: "管理后台",
      keepAlive: true,
    },
  },
];

router.beforeEach((to) => {
  // meta 自动合并匹配链
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return "/login";
  }
});
```

</v-click>

</div>

<div>

<v-click>

**TypeScript 类型扩展**

```ts
// types/vue-router.d.ts
import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    roles?: string[];
    title?: string;
    keepAlive?: boolean;
  }
}
```

</v-click>

</div>

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

<!--
[click] meta 字段是路由配置的「自由水槽」—— 你可以塞任何业务字段进去。

常见的 meta 用途：
- requiresAuth：守卫据此判断是否需要登录
- roles / permissions：权限校验细化
- title：页面标题（afterEach 写入 document.title）
- breadcrumb：面包屑文案
- transition：过渡动画名（配合 RouterView v-slot）
- keepAlive：是否在 KeepAlive 内缓存
- icon：菜单图标
- order：菜单排序

meta 自动合并匹配链 —— 父路由的 meta + 子路由的 meta 都会出现在 route.meta 上。

[click] 强烈推荐扩展 RouteMeta 接口，让 IDE 自动补全字段。

声明文件放 src/types/vue-router.d.ts（或 tsconfig include 内任意 .d.ts）。
declare module 'vue-router' { interface RouteMeta { ... } } 即可全局生效。

没有这一步 TS 会把 meta 当作 unknown，每次访问都得断言 —— 很难受。
-->

---
transition: fade-out
---

# 路由过渡动画

v-slot 解构 Component + 包 Transition

<div class="grid grid-cols-2 gap-x-4">

<div>

<v-click>

**全局统一过渡**

```vue
<!-- App.vue -->
<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
```

</v-click>

</div>

<div>

<v-click>

**按路由 meta 切换不同动画**

```vue
<template>
  <RouterView v-slot="{ Component, route }">
    <Transition :name="(route.meta.transition as string) ?? 'fade'">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>
```

</v-click>

</div>

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

<!--
[click] v4 不再支持「直接在 RouterView 外面包 Transition」的老写法 ——
必须用 v-slot 拿到 Component 再包，否则路由切换不会触发动画。

mode="out-in" 表示「旧组件先离开，新组件再进入」（默认是同时进行）。
对全屏切换的场景，out-in 视觉更稳定，但耗时翻倍。

[click] 给 Component 加 :key="route.path" 强制每次路由切换都重新创建实例 ——
否则相同组件不同 params 不会触发 transition。

更精细的策略：用 route.meta.transition 控制不同路由的动画。
- 进入「向前」类页面用 slide-left
- 进入「向后」类页面用 slide-right
- 模态弹出用 fade

实战中可以在 afterEach 里根据 from / to 的层级关系动态决定 transition，
配合 setup 中 useTransitionRouter 等 composable 实现路由级方向动画。
-->

---
transition: fade-out
---

# Scroll Behavior 滚动行为

控制页面切换后的滚动位置

<div class="grid grid-cols-2 gap-x-4">

<div>

<v-click>

**回到顶部 + 后退恢复**

```ts
createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 前进 / 后退：恢复历史位置
    if (savedPosition) return savedPosition;
    // 新路由含 hash：滚到锚点
    if (to.hash) {
      return { el: to.hash, behavior: "smooth", top: 80 };
    }
    // 默认：回到顶部
    return { top: 0 };
  },
});
```

</v-click>

</div>

<div>

<v-click>

**异步滚动（等待 transition 完成）**

```ts
scrollBehavior(to, from, savedPosition) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ top: 0, behavior: "smooth" });
    }, 500);
  });
}
```

</v-click>

</div>

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

<!--
[click] scrollBehavior 三步走：
1. savedPosition 存在（前进 / 后退按钮）→ 恢复历史位置
2. 有 hash → 滚到锚点（配合 behavior: 'smooth' 实现平滑滚动）
3. 否则 → 滚到顶部

这套逻辑模仿了浏览器原生「多页应用」行为 —— SPA 用户体验对齐 MPA。

注意：scrollBehavior 默认操作 window 滚动条。
如果你的页面用 el-main / iframe / overflow 容器自己处理滚动，
scrollBehavior 不工作 —— 这时改用 afterEach 手动设置元素的 scrollTop = 0。

[click] 异步滚动适合「等过渡动画完成再滚动」的场景 ——
返回 Promise，resolve 一个位置对象即可。

实战中如果用了 page transition（500ms），不延迟滚动会出现「旧页面已滚到顶但新页面闪了一下」的视觉 bug，
delay 500ms 后再滚动就丝滑了。

behavior: 'smooth' 是浏览器原生 API，所有现代浏览器都支持，禁用 motion 偏好的用户会自动退化为瞬时跳转。
-->

---
transition: fade-out
---

# Lazy Loading 路由懒加载

代码分割让首屏更轻

<div class="grid grid-cols-2 gap-x-4">

<div>

<v-click>

**动态 import 替代静态 import**

```ts
// ❌ 静态：全打进首屏 bundle
import UserDetails from "./views/UserDetails.vue";
const routes = [
  { path: "/user/:id", component: UserDetails },
];

// ✅ 动态：访问时才下载 chunk
const routes = [
  {
    path: "/user/:id",
    component: () => import("./views/UserDetails.vue"),
  },
];
```

</v-click>

</div>

<div>

<v-click>

**手动分组（Vite manualChunks）**

```ts
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "user-group": [
            "./src/views/UserDetails.vue",
            "./src/views/UserDashboard.vue",
          ],
        },
      },
    },
  },
});
```

</v-click>

</div>

</div>

<v-click>

> 💡 **不要用 defineAsyncComponent**：路由组件直接用 `() => import()` 即可。

</v-click>

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

<!--
[click] 懒加载是 Vue Router 提供的「免费性能优化」——
- 静态 import：所有路由组件打成一个 bundle，首屏要下载 3 MB
- 动态 import：每个路由独立 chunk，访问时再下载

实际项目里建议「所有非首页路由都用动态 import」——
首屏 bundle 控制在 200 KB 以内，TTI 显著降低。

[click] Vite 默认会为每个 dynamic import 生成独立 chunk。
如果发现 chunk 太碎（比如 user 模块的 5 个页面各自一个小 chunk），
可以用 manualChunks 合并。

webpack 用户改用 magic comment：
```ts
import(/* webpackChunkName: "user-group" */ './UserDetails.vue')
```

[click] defineAsyncComponent 是 Vue 3 的异步组件 API，
但 Vue Router 已经原生支持「component 返回 Promise」，无需额外包装。

错误写法：`component: defineAsyncComponent(() => import('./x.vue'))`
正确写法：`component: () => import('./x.vue')`

把 defineAsyncComponent 留给「在模板里异步加载普通组件」的场景。
-->

---
transition: fade-out
---

# Dynamic Routing 动态路由

运行时新增 / 移除 / 替换路由

<v-click>

**addRoute / removeRoute / hasRoute / getRoutes**

```ts
// 1. 添加顶层路由
router.addRoute({ path: "/about", name: "about", component: () => import("./About.vue") });

// 2. 添加嵌套路由（指定父路由名）
router.addRoute("admin", { path: "settings", component: () => import("./AdminSettings.vue") });

// 3. 替换：相同 name 自动覆盖
router.addRoute({ name: "user", path: "/u/:id", component: UserNew });

// 4. 移除 / 检查 / 列出
router.removeRoute("about");
router.hasRoute("user");      // true / false
console.log(router.getRoutes());
```

</v-click>

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

<!--
[click] 动态路由 API 让你能在运行时改变路由表 —— 这对「权限路由」场景特别有用。

典型流程：
1. 应用启动时，路由表只有公开页面（登录、404 等）
2. 用户登录后，根据返回的权限列表，动态 addRoute 把对应模块路由加进来
3. 退出登录时，removeRoute 清掉所有受保护路由

注意：addRoute 之后，如果当前 URL 正好匹配新路由，不会自动跳转 —— 需要手动 router.push 触发渲染。

[click] addRoute 的第一参数是父路由 name 时，新路由作为它的 children 添加。
等价于在 routes 配置里嵌套写 children: [ ... ]。

[click] 移除会连带子路由 + 别名一起清掉，干净但要确认顺序：
先 removeRoute('admin') 再切换路径，否则可能出现「先切走再删」的竞态。

实战经验：
- 把动态路由配置存在 Pinia store 里
- 通过 watch 监听用户登录态，自动 add / remove
- 守卫里返回新位置可避免「双导航」
-->

---
transition: fade-out
---

# 异步数据加载模式（一）

「先导航后取数」：进入组件再 fetch

<v-click>

```vue
<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const post = ref<Post | null>(null);
const loading = ref(false);

async function fetchPost(id: string) {
  loading.value = true;
  try { post.value = await api.getPost(id); }
  finally { loading.value = false; }
}

// 首次 + params 变化时拉数据
watch(() => route.params.id, (id) => fetchPost(id as string), { immediate: true });
</script>

<template>
  <p v-if="loading">Loading...</p>
  <article v-else-if="post">{{ post.title }}</article>
</template>
```

</v-click>

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

<!--
[click] 「先导航后取数」是 Vue Router 最常见的数据模式 ——
路由立即切换，组件先渲染骨架 / loading，数据在 setup 内异步拉取。

watch + immediate: true 是「初次进入 + params 变化」的统一处理 ——
- 首次访问 /post/1：watch 立即执行，fetch
- 同组件切到 /post/2：watch 触发，fetch

不要在 onMounted 里 fetch ——
组件复用时 onMounted 只跑一次，params 变化检测不到。

这种模式的优缺点：
+ 用户感知导航立即完成，UI 响应快
+ Loading 状态显式可控
- 旧页面立即消失，新页面短暂空白（需要骨架屏弥补）

适合：数据量小 / 接口响应快 / 用户对「跳转感」敏感的场景。
-->

---
transition: fade-out
---

# 异步数据加载模式（二）

「先取数后导航」：守卫里 await

<div class="grid grid-cols-2 gap-x-4">

<div>

<v-click>

```ts
// beforeEnter 里预拉数据
{
  path: "/post/:id",
  component: Post,
  async beforeEnter(to) {
    try {
      const post = await api.getPost(to.params.id as string);
      (to.meta as any).preloadedPost = post;
    } catch (e) {
      return { name: "not-found" };
    }
  },
}

// 组件内读取
const route = useRoute();
const post = computed(() => (route.meta as any).preloadedPost as Post);
```

</v-click>

</div>

<div>

<v-click>

**Suspense + async setup（Vue 3 原生）**

```vue
<!-- App.vue -->
<template>
  <RouterView v-slot="{ Component }">
    <Suspense>
      <component :is="Component" />
      <template #fallback>
        <Skeleton />
      </template>
    </Suspense>
  </RouterView>
</template>
```

</v-click>

</div>

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

<!--
[click] 「先取数后导航」让用户停留在原页面直到新页面数据 ready ——
适合数据是「页面核心」、空白没意义的场景（详情页、报表页）。

实现方式有两种：
1. beforeEnter / beforeEach 里 await，结果存 meta 或 store
2. 组件 async setup() + Suspense

beforeEnter 方案的优势：
- 数据失败可以直接返回新位置（重定向 / 404）
- 数据存 meta 与路由生命周期对齐，自动清理

[click] Suspense 是 Vue 3 原生方案 ——
组件 setup() 可以是 async，等 setup 完成（拿到数据）再插入 DOM。

它的好处是「数据加载语义就在组件里」，无需路由层介入。
但缺点是 Suspense 仍是实验性 API，错误边界等细节还在打磨。

[click] 选型：
- 简单页面、用户期望快响应 → 模式（一）
- 数据加载失败可能导致组件无法渲染 → 模式（二）
- 全站统一框架 → 引入 unplugin-vue-router 的 data loaders（v5 实验）
-->

---
transition: fade-out
---

# RouterLink 高级用法

active class、自定义渲染、外部链接

<div class="grid grid-cols-2 gap-x-4">

<div>

<v-click>

**自定义激活样式**

```vue
<RouterLink to="/"
  active-class="is-active"
  exact-active-class="is-current">
  首页
</RouterLink>

<!-- 全局配置 -->
<script setup lang="ts">
const router = createRouter({
  linkActiveClass: "router-active",
  linkExactActiveClass: "router-exact-active",
});
</script>
```

</v-click>

</div>

<div>

<v-click>

**v-slot 自定义渲染**

```vue
<RouterLink to="/products" custom
  v-slot="{ href, navigate, isActive }">
  <li :class="{ active: isActive }">
    <a :href="href" @click="navigate">
      <ProductIcon /> 商品中心
    </a>
  </li>
</RouterLink>
```

</v-click>

</div>

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

<!--
[click] active class 是导航高亮的核心 ——
- active-class：匹配子路由也算激活（/products 与 /products/42 都激活 /products 链接）
- exact-active-class：仅精确匹配时激活

默认 class 名是 `router-link-active` 和 `router-link-exact-active`，
但实际项目里都会改成自己的命名（与 UI 组件库对齐，比如 Element Plus 的 is-active）。

[click] custom + v-slot 是「完全自定义 RouterLink 外观」的逃生口 ——
当默认 a 标签不够用时（要包 li、要加图标、要支持 disabled 等），
custom 模式让你拿到 href / navigate / isActive 等原始数据，自己组装 DOM。

navigate 是个 function，调用即可触发 router.push。
isActive / isExactActive 反映当前路由是否匹配。

这套 API 让 Vue Router 能完美适配各种 UI 组件库的菜单组件，
比如 Element Plus 的 el-menu-item、Ant Design Vue 的 a-menu-item。
-->

---
transition: fade-out
---

# 与 Pinia / VueUse 协同

路由 + 状态管理的最佳实践

<div class="grid grid-cols-2 gap-x-4">

<div>

<v-click>

**Pinia：缓存路由数据**

```ts
// stores/posts.ts
import { defineStore } from "pinia";

export const usePostStore = defineStore("posts", () => {
  const cache = new Map<string, Post>();

  async function load(id: string) {
    if (cache.has(id)) return cache.get(id)!;
    const post = await api.getPost(id);
    cache.set(id, post);
    return post;
  }

  return { load };
});
```

</v-click>

</div>

<div>

<v-click>

**VueUse：路由参数双向绑定**

```vue
<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";

// 双向绑定 URL ?page=2
const page = useRouteQuery<number>(
  "page", 1, { transform: Number },
);
const search = useRouteQuery<string>("q", "");
</script>

<template>
  <input v-model="search" />
  <span>第 {{ page }} 页</span>
</template>
```

</v-click>

</div>

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

<!--
[click] Pinia + Vue Router 的边界划分：
- URL 中的状态（params / query）→ route（Vue Router 管）
- 跨页面的内存状态（用户、购物车、token）→ Pinia store
- 单页面临时状态（表单、loading） → 组件本地 ref

数据缓存放 Pinia 是常见做法 —— 用户从 /post/1 → /post/2 → /post/1，
第二次访问 /post/1 直接读 cache，体感即时返回。

[click] useRouteQuery / useRouteParams 是 VueUse 提供的 query / params 双向绑定 composable ——
让 URL 像 ref 一样可读可写。

经典场景：搜索页 + 翻页 + 排序，用户操作直接反映到 URL，
刷新页面不丢状态、分享链接能还原视图。

注意 useRouteQuery 的 transform 选项可以做类型转换 —— 
URL 里都是 string，转 Number / Boolean / Date 必须显式声明。
-->

---
transition: fade-out
---

# SSR 与 Nuxt 集成

服务端渲染时的特别考虑

<div class="grid grid-cols-2 gap-x-4">

<div>

<v-click>

**SSR 关键差异**

```ts
// 服务端 entry-server.ts
import { createMemoryHistory, createRouter } from "vue-router";

export async function render(url: string) {
  const router = createRouter({
    history: createMemoryHistory(),  // 服务端必须
    routes,
  });
  await router.push(url);
  await router.isReady();
  // ...renderToString(app)
}
```

</v-click>

</div>

<div>

<v-click>

**Nuxt 已经全部封装**

```vue
<!-- pages/users/[id].vue -->
<script setup lang="ts">
const route = useRoute();
const { data } = await useFetch(`/api/users/${route.params.id}`);
</script>
```

Nuxt = Vue Router + 文件约定 + SSR：
- `pages/` 自动转 routes
- `definePageMeta` 配 meta
- `navigateTo` 替代 router.push

</v-click>

</div>

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

<!--
[click] SSR 与 SPA 的核心差异是「服务端没有 history API」——
必须用 createMemoryHistory，所有导航都在内存中模拟。

每个请求需要创建独立 router 实例（避免跨请求状态污染）。

router.push(url) 触发匹配后，必须 await router.isReady() —— 
确保所有异步守卫、异步组件都加载完成，否则 renderToString 输出会缺失内容。

[click] 自己撸 SSR 工作量极大，绝大多数项目直接用 Nuxt。

Nuxt 把 Vue Router 包了一层：
- pages/ 文件夹结构自动生成 routes
- middleware/ 替代守卫
- definePageMeta 替代 meta 字段
- navigateTo 替代 router.push

但底层仍是 Vue Router —— 你学的所有 Vue Router 知识在 Nuxt 里都通用。
useRoute / useRouter 这两个 composable 在 Nuxt 与 SPA 用法完全一致。
-->

---
transition: fade-out
---

# unplugin-vue-router 文件约定

未来官方化的「文件即路由」

<div class="grid grid-cols-2 gap-x-4">

<div>

<v-click>

**安装与配置**

```bash
pnpm add -D unplugin-vue-router
```

```ts
// vite.config.ts
import VueRouter from "unplugin-vue-router/vite";

export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: "src/pages",
      dts: "src/typed-router.d.ts",
    }),
    vue(),
  ],
});
```

</v-click>

</div>

<div>

<v-click>

**文件约定示例**

```
src/pages/
├── index.vue              # /
├── about.vue              # /about
├── users/
│   ├── index.vue          # /users
│   └── [id].vue           # /users/:id
├── posts/[id]/
│   ├── index.vue          # /posts/:id
│   └── edit.vue           # /posts/:id/edit
└── [...path].vue          # catch-all 404
```

</v-click>

<v-click>

> 💡 v5 正在把这个插件合并进 vue-router 核心。

</v-click>

</div>

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

<!--
[click] unplugin-vue-router 是 Eduardo 主导的另一个项目 ——
为 Vue Router 补上「文件即路由 + 端到端类型推导」两大能力。

文件约定借鉴了 Nuxt / Next.js / Remix：
- pages/ 目录映射 routes
- [id] 表示动态段
- [...path] 表示 catch-all

[click] 类型推导是最大杀手锏 ——
- router.push({ name: '/users/[id]' }) 自动补全所有路由名
- params 类型自动从 URL pattern 推导
- 写错 name 编译期报错

[click] v5 实验性把 unplugin 合并进核心 ——
未来 vue-router 5.x 装包后就可以选「传统手写 routes」或「自动文件约定」，
不再需要额外装插件。

目前过渡期，新项目强烈推荐 unplugin —— 跑通了无痛升级到 v5 核心版。
-->

---
transition: fade-out
---

# 从 Vue Router 3 迁移到 4

老 Vue 2 项目升级 Vue 3 时的路由调整

<v-click>

**8 大核心改动**

```ts
// 1. 构造器：new VueRouter → createRouter
import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(),    // 2. mode → history 工厂
  routes,
});

// 3. base 选项移入工厂函数
createWebHistory("/my-app/");
// 4. catch-all：path: '*' → path: '/:pathMatch(.*)*'
// 5. 异步组件：() => import('./Home.vue')（无需 require.ensure）

// 6. 守卫 next 回调 → 返回值
router.beforeEach((to) => { if (!loggedIn) return "/login"; });

// 7. push / replace 返回 Promise（无 onComplete / onAbort）
// 8. RouterLink 移除：append / event / tag / exact 四个 prop
```

</v-click>

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

<!--
[click] v3 → v4 是 Vue 2 → Vue 3 升级时必走的一步。

最影响业务的 8 个变化：

1. 构造器：new VueRouter() 改成 createRouter() —— Vue 3 全面拥抱函数式 API
2. mode: 'history' 改成 history: createWebHistory() —— 三种模式独立工厂
3. base 从 router 选项移到工厂函数参数 —— 与 history 绑在一起更合理
4. * 通配符废弃 —— 必须明确写 :pathMatch(.*)*
5. require.ensure / require() 废弃 —— 直接用 ESM 动态 import
6. next 回调改返回值 —— 更直观，更少回调地狱
7. push / replace 返回 Promise —— 错误处理用 .catch 或 try / await
8. RouterLink 简化 prop —— 用 v-slot custom 模式替代

迁移实操：
- 跑一遍 router 配置改 createRouter / createWebHistory（30 分钟）
- 全局搜索 path: '*' 改成 catch-all 写法
- 全局搜索 next( 改成 return
- 全局搜索 RouterLink 的 tag / event 等老 prop 改 v-slot custom

平均一个中等规模项目迁移 1-2 天搞定。
-->

---
transition: fade-out
---

# 常见踩坑（一）：解构 route 失去响应

<div class="grid grid-cols-2 gap-x-4">

<div>

```vue
<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();

// ❌ 失去响应性
const { params, query } = route;
console.log(params.id);  // 切换后仍是旧值

// ❌ 同样错
const id = route.params.id;
</script>
```

</div>

<div>

<v-click>

```vue
<script setup lang="ts">
import { computed, toRefs } from "vue";
const route = useRoute();

// ✅ 用 computed
const id = computed(() => route.params.id);

// ✅ 用 toRefs
const { params, query } = toRefs(route);

// ✅ 模板里直接用（不解构）
</script>
```

</v-click>

</div>

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

<!--
这是 Vue Router 4 最高频的踩坑之一 ——

useRoute() 返回的是 reactive proxy，
解构出来的字段就是普通值，路由变化后不会更新。

正确的几种姿势：
- 模板里直接用 route.params.x（最简洁）
- 用 computed 包一层（如果需要派生）
- 用 toRefs 解构（保持响应性）
- watch 监听变化（如果要做副作用）

这个坑与 Pinia 的「解构 store 丢响应」是同一类问题 ——
Vue 3 reactive proxy 不能解构，要么用 ref / refs 包裹，要么直接访问。
-->

---
transition: fade-out
---

# 常见踩坑（二）：用 path 传 params 无效

```ts
// ❌ params 被忽略 —— path 模式不解析 params
router.push({
  path: "/user/42",
  params: { id: 42, type: "vip" },  // 完全无效
});

// 实际 URL：/user/42（type 没传过去）
```

<v-click>

```ts
// ✅ 方案 1：用 name + params（推荐）
router.push({
  name: "user",
  params: { id: 42 },
  query: { type: "vip" },
});

// ✅ 方案 2：手动拼 path
router.push({
  path: `/user/42`,
  query: { type: "vip" },
});
```

</v-click>

<v-click>

> 💡 **官方建议**：编程式导航尽量用 name，避免硬编码路径与重构成本。

</v-click>

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

<!--
v3 时代允许 path + params 混用，path 里没用到的 params 会被附加为 query；
v4 改成了严格模式 —— path 与 params 互斥。

这个变化让 API 语义更清晰：
- 给 path：完整路径已经包含所有信息，params 无用
- 给 name + params：让 router 用 name 找 path 模板，把 params 填进去

实战中如果不小心写了 path + params 不报错也不报 warning（v4 默认不警告），
排查会很痛苦 —— 是 v3 → v4 迁移的隐形坑。

推荐永远用 name + params，配合 unplugin-vue-router 的类型推导，
拼错 name 立刻编译期报错。
-->

---
transition: fade-out
---

# 常见踩坑（三）：守卫里访问 store

<div class="grid grid-cols-2 gap-x-4">

<div>

```ts
// ❌ module 顶层直接 import store 实例
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();  // pinia 未注册，崩

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return "/login";
  }
});
```

</div>

<div>

<v-click>

```ts
// ✅ 守卫内调用 useStore
router.beforeEach((to) => {
  const userStore = useUserStore();  // 函数体内
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return "/login";
  }
});
```

</v-click>

<v-click>

**根因**：守卫在 `app.use(pinia)` 之前 import，Pinia 实例未注册。

```ts
app.use(pinia);     // ← 必须在 router 之前
app.use(router);
```

</v-click>

</div>

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

<!--
这是 Vue Router + Pinia 配合时的经典「时序错误」——

useStore 的内部依赖一个全局 active pinia 实例，
而 active pinia 是 app.use(pinia) 时设置的。

如果 router 文件 import 了 store，且在 main.ts 里 router 比 pinia 早注册，
顶层调用 useStore 时就拿不到实例 —— 报错「no active pinia found」。

修复有两个方向：
1. 守卫内 useStore（推荐，灵活）
2. 调整 main.ts 顺序，确保 pinia 先注册

实战中前者更稳健 —— 哪怕未来加了 SSR / 测试 / micro-frontend，时序都不脆弱。
-->

---
transition: fade-out
---

# 常见踩坑（四）：滚动行为不工作

<div class="grid grid-cols-2 gap-x-4">

<div>

```ts
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    return { top: 0 };
  },
});
```

<v-click>

**症状**：返回 `{ top: 0 }` 但不滚动。

**原因**：scrollBehavior 只操作 `window`。如果页面用 `overflow: auto` 容器（如 el-main）自己滚动，window 早就不滚了。

</v-click>

</div>

<div>

<v-click>

```ts
// ✅ 方案：afterEach 手动操作容器
router.afterEach(() => {
  const main = document.querySelector(".el-main") as HTMLElement;
  if (main) main.scrollTop = 0;
});

// ✅ 或：scrollBehavior 返回 el 选择器
scrollBehavior(to) {
  return { el: ".el-main", top: 0 };
}
```

</v-click>

</div>

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

<!--
这是企业级管理后台最常踩的坑 ——

Element Plus 的 el-container / el-main、Ant Design Vue 的 a-layout-content，
这些组件都自己包了一层 overflow 容器处理滚动，
window 的滚动条早就被「内层滚动」吃掉了。

scrollBehavior 默认操作 window，自然没用。

修复方案：
- afterEach 里 querySelector 拿到容器，手动 scrollTop = 0
- 或 scrollBehavior 用 el 选择器（v4.1+ 支持，会自动找元素）

推荐用 afterEach —— 更显式、不会被 scrollBehavior 的细节绊倒。

类似的坑还有 iframe / Modal 内的路由，都是「window 不是真正滚动源」的变种。
-->

---
transition: fade-out
---

# 常见踩坑（五）：keep-alive 缓存失效

<div class="grid grid-cols-2 gap-x-4">

<div>

```vue
<!-- App.vue：错误用法 -->
<template>
  <RouterView v-slot="{ Component }">
    <KeepAlive>
      <component :is="Component" />
      <!-- 没 :key，相同 Component 不刷新 -->
    </KeepAlive>
  </RouterView>
</template>
```

<v-click>

**症状**：/post/1 → /post/2 组件不刷新；不希望缓存的页面被缓存。

</v-click>

</div>

<div>

<v-click>

```vue
<!-- ✅ 用 meta.keepAlive 精确控制 -->
<template>
  <RouterView v-slot="{ Component, route }">
    <KeepAlive :include="cachedViews">
      <component :is="Component" :key="route.fullPath" />
    </KeepAlive>
  </RouterView>
</template>

<script setup lang="ts">
const cachedViews = ["UserList", "ProductList"];
</script>
```

</v-click>

</div>

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

<!--
keep-alive 与 RouterView 的搭配是企业级应用的高频需求 ——
列表页缓存（保留滚动位置 / 已选筛选），详情页不缓存（每次都拉新数据）。

但有几个细节常踩坑：

1. 不加 :key —— 同一组件不同 params 不刷新（如 /post/1 → /post/2 内容不变）
   解决：:key="route.fullPath"

2. KeepAlive include / exclude 用「组件名」匹配 ——
   组件必须显式 `defineOptions({ name: 'UserList' })`，否则 include 找不到。

3. 详情页不希望缓存但其他都希望 ——
   用 meta.keepAlive 字段配置，include 列表从 router.getRoutes 动态生成。

实战中通常封装个 useKeepAlive composable，
读 meta + 维护 include 列表 + 提供 reset 接口。
-->

---
transition: fade-out
---

# 常见踩坑（六）：异步守卫忘记 return

```ts
// ❌ 守卫没有 return，导航默认放行
router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const user = await fetchCurrentUser();
    if (!user) {
      // 没有 return，下面的代码继续执行，导航也放行了！
      router.push("/login");
    }
  }
});
```

<v-click>

```ts
// ✅ 守卫返回值控制导航
router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const user = await fetchCurrentUser();
    if (!user) {
      return { name: "login", query: { redirect: to.fullPath } };
    }
  }
  // 无 return 等价于 return undefined → 放行
});
```

</v-click>

<v-click>

> 💡 **核心心智**：v4 守卫已不再用 next 回调 —— 「返回什么 = 路由怎么走」，这一点要刻在脑子里。

</v-click>

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

<!--
v3 时代的 next() 回调有个隐藏好处：必须显式调用 next() 才会放行。
v4 的返回值模式则相反 —— 不写 return 默认放行。

这种「显式调用 vs 隐式放行」的语义差异，让 v3 用户迁移时容易写出 bug：
- 异步流程里用了 router.push 当作「重定向」（v3 习惯）
- 忘记 return，原来的导航继续走
- 用户体验：先看到登录页一瞬间，又被原页面接管

正确做法：
- return 一个 RouteLocationRaw 表示重定向
- return false 表示取消
- 不写 return 表示放行

千万不要在守卫里 router.push —— 那会引发「在导航中触发导航」，
Vue Router 会自动取消旧导航走新的，但很容易写出无限循环或竞态。
-->

---
transition: fade-out
---

# 经验法则

<v-clicks>

- **新项目用 createRouter + createWebHistory** → SPA 标配
- **永远用 name 而非 path 跳转** → 解耦调用方与 URL 模板
- **守卫内 useStore** → 避免 Pinia / Router 时序坑
- **meta 扩展 RouteMeta 接口** → TS 自动补全 + 编译期校验
- **scrollBehavior + savedPosition** → 让 SPA 体感对齐 MPA
- **所有非首页路由用 `() => import()` 懒加载** → 首屏 bundle 控制在 200 KB
- **catch-all 路由放最后** → 否则会拦截后续所有路由
- **解构 route 用 toRefs / computed** → 否则失去响应性
- **`&lt;RouterView v-slot&gt;` 包 Transition / KeepAlive** → v4 强制要求
- **守卫返回值控制导航** → 别再用 next 回调
- **从 v3 升级时跑迁移 checklist** → 8 个改动一个都不能漏

</v-clicks>

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

<!--
这是 Vue Router 4 项目里反复打磨出的「经验法则」——

新项目几乎都遵循前 5 条；
v3 迁移项目会重点关注后 6 条。

最容易出问题的两个边界：
1. 守卫语义（v3 next vs v4 return）
2. reactive 解构（route 与 store 同款坑）

记住这两个，能避开 80% 的 Vue Router 新手坑。
-->

---
transition: fade-out
---

# 不适合 Vue Router 的场景

<v-clicks>

- **强类型路径推导优先** → TanStack Router（编译期路径校验更激进）
- **重 SSR + 数据加载范式** → 直接用 Nuxt（已封装 router + loader + SSR）
- **极简静态页面（不超过 3 个路由）** → 不需要路由库，原生 location + 显隐组件足够
- **微前端子应用** → 配合 qiankun / Module Federation 需特殊处理 base
- **桌面应用（Electron / Tauri）** → 用 MemoryHistory，部分 Web 特性需替换
- **支持「服务端框架」的 BFF SPA** → Inertia.js / Hotwire 等可能更合适
- **React 团队** → 没有 vue-router 适用性，请看 React Router 篇

</v-clicks>

<v-click>

> 经验：Vue Router 4 是「中型到大型 Vue 3 SPA / Nuxt SSR」的最佳搭档 ——
> 既不会被框架强绑架（vs Next.js），也不会因为生态小而无人维护（vs 小众路由库）。

</v-click>

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

<!--
不是「Vue Router 不好」，而是「特定场景有更合适的工具」。

桌面应用尤其要注意：
- 文件系统访问、原生菜单等不属于路由职责
- 用 MemoryHistory 替代 WebHistory
- pushState 在 Electron / Tauri 都有特殊行为

微前端场景需要 base 动态化：
- qiankun 子应用在父应用挂载时确定 base
- 创建 router 时 base 通过工厂参数传入
- 跨应用导航走父应用，不直接走 router.push

如果你的项目需要「极致类型推导」+「编译期路径校验」，
TanStack Router（虽然是 React 生态）的设计哲学值得借鉴，
Vue 生态里 unplugin-vue-router 是相对接近的方案。
-->

---
transition: fade-out
---

# 学习路径

<div class="grid grid-cols-2 gap-x-4">

<div>

```
入门（1-2 天）
├── 跑通 create-vue 默认模板（含 router）
├── 读完官方 Essentials 章节（前 8 节）
├── 写一个 Todo App：列表 / 详情 / 新建
└── 理解 createRouter / RouterLink / RouterView

进阶（3-5 天）
├── 嵌套路由 + 命名视图实战
├── 全局 + 路由级 + 组件内三层守卫
├── meta 扩展 + TS 类型强化
└── lazy load + Suspense 数据加载
```

</div>

<div>

```
实战（1-2 周）
├── 管理后台：登录 + 动态路由 + 权限
├── 配合 Pinia 做用户态与缓存
├── 配合 VueUse 做 useRouteQuery
└── 性能调优 + bundle 分析

延伸（持续）
├── 学 Nuxt（基于 Vue Router 的元框架）
├── 试 unplugin-vue-router
└── 跟进 v5 实验性 Data Loaders
```

<v-click>

**官方资源**

- [router.vuejs.org](https://router.vuejs.org)
- [github.com/vuejs/router](https://github.com/vuejs/router)
- Vue Mastery — Vue Router 4 Fundamentals

</v-click>

</div>

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

<!--
Vue Router 学习曲线相比 React Router / TanStack Router 平缓不少 ——
官方文档质量极高，结构线性，3-5 天能过完核心概念。

入门阶段重点：
- 不要急着上嵌套 / 守卫
- 先把 RouterLink / RouterView / 基本 routes 配置玩明白
- 体会「URL 即状态」的设计哲学

进阶阶段重点：
- 嵌套路由 + 命名视图是 Vue Router 的「武功秘籍」，多花时间练
- 守卫体系 12 步流程一定要默写一遍
- meta + RouteMeta 接口扩展是 TS 项目质量的分水岭

实战阶段建议直接「写一个管理后台」——
登录、权限、动态路由、面包屑、KeepAlive、滚动、过渡，全套技术一遍打通。
有了这套底子，再看 Nuxt / Quasar / VueAdmin 这些上层产品就顺多了。

延伸学习中，Nuxt 是必不可少的下一站 ——
它把 Vue Router 与 SSR / 数据加载 / 文件约定打包成一套元框架，
是 Vue 生态对标 Next.js / Remix 的官方答案。
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看

Vue Router — Vue 3 时代的官方路由标准

<div class="mt-8 text-lg">

**核心心智**

- URL 是应用的状态 —— 让导航逻辑显式
- 声明式 + 编程式 API 双轨 —— 各取所需
- 嵌套路由 + 命名视图 —— 复杂布局的杀手锏
- 三层守卫体系 —— 权限 / 数据 / 提醒一网打尽
- 与 Pinia / Nuxt / VueUse 协同 —— Vue 生态最强配合

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://router.vuejs.org/" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/vuejs/router" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://router.vuejs.org/guide/" target="_blank" class="slidev-icon-btn">
    <carbon:play /> Quick Start
  </a>
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

<!--
总结一句话：Vue Router = Vue 3 的官方路由 SSO —— 14 年沉淀 + Composition API 加持 + 生态最强协同。

核心心智五条：
1. URL 是应用的状态，让导航逻辑显式而非隐藏在组件内部
2. 声明式（RouterLink / RouterView）+ 编程式（router.push）双轨，按场景选
3. 嵌套路由 + 命名视图是 Vue Router 的「武功秘籍」，复杂布局轻松搞定
4. 全局 / 路由级 / 组件内三层守卫，权限校验与数据预取一网打尽
5. 与 Pinia / Nuxt / VueUse 协同极佳 —— URL 状态、内存状态、composable 各司其职

下一步建议：跟着官方 Essentials 章节实战一个小项目，
把 createRouter / 嵌套 / 守卫 / lazy load / scrollBehavior 都用一遍 ——
那时再回头看大型 Vue 项目里的路由代码，就会有「一切尽在掌握」的感觉。

感谢观看！
-->
