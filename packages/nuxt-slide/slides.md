---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Nuxt
info: |
  Presentation Nuxt for Vue developers.

  Learn more at [https://nuxt.com](https://nuxt.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:nuxt-icon class="text-7xl" />
</div>

<br/>

## Nuxt：Vue 圈的元框架事实标准

文件路由 + SSR + Nitro 服务引擎，把 Vue 升级成全栈应用框架

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Nuxt 4。

Vue 圈做 SSR / SSG / 全栈应用的事实标准。背后是 Vue 官方团队 + Nitro 服务引擎。
-->

---
transition: fade-out
---

# 什么是 Nuxt？

Vue 官方维护的元框架，把渲染库升级成「全栈应用框架」

<v-click>

- **文件路由**：`pages/index.vue` → `/`、`[id].vue` → `/:id`
- **自动导入**：组件 / composables / utils / Vue API 全自动
- **多渲染模式**：SSR / SSG / ISR / SWR / CSR，`routeRules` 一行切
- **Nitro 服务引擎**：内置 H3 + 中间件 + 插件，不需要 Express
- **零配置 TypeScript**：四套 tsconfig 隔离客户端 / 服务端 / 共享上下文
- **模块生态**：`@nuxt/image` / `@nuxt/content` / `@pinia/nuxt` / 30+ 官方模块
- **多端部署**：Node / Vercel / Netlify / Cloudflare / Deno / Bun 同一份代码

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Nuxt_](https://nuxt.com)

</div>

<style>
h1 {
  background-color: #00DC82;
  background-image: linear-gradient(45deg, #00DC82 10%, #002E3B 90%);
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

# Nuxt 4 vs Nuxt 3：关键变化

<v-clicks>

- **目录结构重组**：源码搬到 `app/` 目录；`server/` / `shared/` / `content/` / `layers/` 与 `app/` 平级
- **数据获取共享**：同 key 的 `useFetch` / `useAsyncData` 共享 data / error / status
- **`shallowRef` 默认**：`useFetch` data 用 shallowRef，大对象性能更好
- **模块加载顺序修正**：layer 先 / project 后（v3 反的）
- **四套 tsconfig**：app / server / node / shared 互不干扰
- **`noUncheckedIndexedAccess: true`**：数组下标推断 `T | undefined`
- **Node 22.22.1+** / Git 2.32+ 硬性要求

</v-clicks>

<v-click>

兼容性：v3 项目自动识别旧布局能跑；`pnpm dlx nuxt upgrade` 一键迁移。

</v-click>

---
transition: slide-up
---

# 目录结构

```
my-app/
├── app/                    # ← Nuxt 4 默认源码区
│   ├── pages/              # 文件路由
│   ├── components/         # 自动导入组件
│   ├── composables/        # 自动导入函数
│   ├── layouts/            # 布局
│   ├── middleware/         # 路由守卫
│   ├── plugins/            # 插件
│   └── app.vue             # 根组件
├── server/                 # Nitro 服务端
│   ├── api/                # /api/* 端点
│   ├── routes/             # 不带 /api 前缀
│   └── middleware/         # 服务端中间件
├── shared/                 # 双端共用
├── content/                # @nuxt/content 用
├── public/                 # 静态文件
└── nuxt.config.ts
```

---
transition: slide-up
---

# 第一个 Page

```vue
<!-- app/pages/index.vue -->
<template>
  <div>
    <h1>Hello Nuxt 4 👋</h1>
    <NuxtLink to="/about">About</NuxtLink>
  </div>
</template>
```

```vue
<!-- app/app.vue（根组件） -->
<template>
  <NuxtLayout>
    <NuxtPage />        <!-- 当前路由的页面渲染在这里 -->
  </NuxtLayout>
</template>
```

<v-click>

启动 `pnpm dev`，访问 `http://localhost:3000`。**SSR + HMR 默认开启**，无需任何配置。

</v-click>

---
transition: slide-up
---

# 文件路由

```
pages/
├── index.vue              → /
├── about.vue              → /about
├── users/[id].vue         → /users/:id
├── blog/[...slug].vue     → /blog/*（catch-all）
├── settings/[[tab]].vue   → /settings 和 /settings/:tab
└── (marketing)/pricing.vue → /pricing（括号不进 URL）
```

```vue
<!-- pages/users/[id].vue -->
<script setup lang="ts">
const route = useRoute();
const { data: user } = await useFetch(`/api/users/${route.params.id}`);
</script>

<template>
  <h1>{{ user?.name }}</h1>
</template>
```

---
transition: slide-up
---

# 导航 + definePageMeta

```vue
<template>
  <!-- 组件式：自动预加载 + 高亮 -->
  <NuxtLink to="/about">About</NuxtLink>
  <NuxtLink :to="{ path: '/search', query: { q: 'vue' } }">搜索</NuxtLink>
</template>

<script setup>
// 程序式
await navigateTo('/dashboard');

// 页面元数据
definePageMeta({
  layout: 'admin',                           // 用 layouts/admin.vue
  middleware: ['auth'],                       // 跑路由守卫
  keepalive: true,                            // <KeepAlive> 缓存
  pageTransition: { name: 'slide', mode: 'out-in' },
});
</script>
```

---
transition: slide-up
---

# 自动导入

```ts
// app/composables/useUser.ts
export function useUser() {
  return useState<User | null>('user', () => null);
}
```

```vue
<!-- 任何组件直接用，不需要 import！ -->
<script setup>
const user = useUser();
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
</script>
```

<v-click>

**自动导入清单**：
- `app/components/` 组件
- `app/composables/` 函数（约定 `use*`）
- `app/utils/` 纯函数
- Vue API：`ref` / `computed` / `watch` / 生命周期
- Nuxt API：`useFetch` / `useAsyncData` / `useState` 等

</v-click>

---
transition: slide-up
---

# useFetch vs useAsyncData vs $fetch

```ts
// useFetch：URL 当 key 的简写；SSR + payload + 响应式
const { data, pending, error } = await useFetch('/api/articles');

// useAsyncData：自定义 fetcher + 显式 key
const { data } = await useAsyncData('user-me', () =>
  $fetch('/api/me', { credentials: 'include' }),
);

// $fetch：底层调用，无响应式（mutation 场景用它）
async function deleteArticle(id) {
  await $fetch(`/api/articles/${id}`, { method: 'DELETE' });
}
```

<v-click>

经验：**显示数据用 useFetch / useAsyncData；写操作（POST / DELETE）用 $fetch。** 反过来会触发奇怪的重复请求 / hydration mismatch。

</v-click>

---
transition: slide-up
---

# 状态管理

**轻量：useState（SSR-safe）**

```ts
// composables/useCart.ts
export function useCart() {
  return useState<Item[]>('cart', () => []);
}
```

**复杂：Pinia（推荐）**

```ts
// stores/cart.ts
export const useCartStore = defineStore('cart', () => {
  const items = ref<Item[]>([]);
  const total = computed(() => items.value.reduce((s, i) => s + i.price, 0));
  return { items, total };
});
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
});
```

---
transition: slide-up
---

# 布局 + 中间件

```vue
<!-- layouts/admin.vue -->
<template>
  <div class="admin-shell">
    <AdminSidebar />
    <main><slot /></main>
  </div>
</template>
```

```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const user = useUser();
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login');
  }
});
```

```vue
<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
});
</script>
```

---
transition: slide-up
---

# 服务端 API（Nitro）

```ts
// server/api/articles.get.ts → GET /api/articles
export default defineEventHandler(async () => {
  return await db.articles.findMany();
});

// server/api/articles.post.ts → POST /api/articles
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await db.articles.create({ data: body });
});

// server/api/articles/[id].delete.ts → DELETE /api/articles/:id
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  return await db.articles.delete({ where: { id } });
});
```

<v-click>

文件名约定 = HTTP 方法 + 路由参数；**无需手动声明 method**。Nitro 还内置 H3 utils：`readBody` / `getQuery` / `setCookie` / `sendRedirect` / `createError`。

</v-click>

---
transition: slide-up
---

# Route Rules：渲染模式一行切

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },              // 首页 SSG 构建时生成
    '/blog': { swr: 3600 },                 // 列表 SWR 缓存 1 小时
    '/blog/**': { isr: true },              // 详情 ISR（CDN 缓存到下次部署）
    '/admin/**': { ssr: false },            // 后台纯 SPA
    '/api/**': { cors: true },              // API 自动 CORS
    '/old-page': { redirect: '/new-page' }, // 重定向
  },
});
```

<v-click>

**Hybrid 渲染** = 一份代码不同路由不同策略。Nuxt 内置实现，无需手动配 nginx / CDN。

</v-click>

---
transition: slide-up
---

# 模块生态

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',         // 状态管理
    '@nuxt/image',         // 自适应图片 + 多 provider
    '@nuxt/content',       // Markdown 内容站
    '@nuxt/ui',            // 官方 Tailwind 组件库
    '@vueuse/nuxt',        // VueUse 自动导入
    '@nuxtjs/i18n',        // 国际化
    '@nuxtjs/tailwindcss', // Tailwind
    'nuxt-auth-utils',     // session 鉴权
  ],
});
```

<v-click>

模块系统 = Nuxt 的「插件市场」。多数模块装一行配置即用，自带类型 / DevTools 面板 / runtime config 集成。

</v-click>

---
transition: slide-up
---

# Layers：项目分层

把可复用部分拆成「子项目」：

```
acme/
├── layers/
│   └── admin/                # 子 layer（含自己的 pages / api / nuxt.config）
│       ├── pages/admin/...
│       ├── server/api/admin/...
│       └── nuxt.config.ts
├── app/
└── nuxt.config.ts
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['./layers/admin'],
});
```

<v-click>

适合：**多个相似项目共用底座**（电商前台 / 后台 / 移动端各一 layer，主项目 extends 全部）。

</v-click>

---
transition: slide-up
---

# 自定义模块（modules/）

```ts
// modules/my-feature.ts
import { defineNuxtModule, addServerHandler, createResolver } from 'nuxt/kit';

export default defineNuxtModule({
  meta: { name: 'my-feature', configKey: 'myFeature' },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    addServerHandler({
      route: '/api/greet',
      handler: resolver.resolve('./runtime/greet.get.ts'),
    });

    addImports({ name: 'useGreet', from: resolver.resolve('./runtime/useGreet') });

    nuxt.hook('build:before', () => console.log('[my-feature] start'));
  },
});
```

---
transition: slide-up
---

# 部署：Nitro Preset

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'node-server',         // 默认
    // preset: 'vercel' / 'vercel-edge'
    // preset: 'netlify' / 'netlify-edge'
    // preset: 'cloudflare-pages' / 'cloudflare-workers'
    // preset: 'deno-deploy' / 'bun'
    // preset: 'aws-lambda' / 'azure' / 'firebase'
    // preset: 'static'  // 等价 nuxt generate
  },
});
```

```bash
pnpm build                   # → .output/
node .output/server/index.mjs # Node 部署

# 或 SSG
pnpm generate                # → .output/public/（纯静态文件）
```

<v-click>

**同一份代码可部署到任意目标**。Vercel / Netlify / Cloudflare 等平台**自动识别 Nitro**，零配置部署。

</v-click>

---
transition: slide-up
---

# TypeScript：四套 tsconfig

```
.nuxt/
├── tsconfig.app.json       # 客户端代码
├── tsconfig.server.json    # 服务端
├── tsconfig.node.json      # 配置文件 / 脚本
└── tsconfig.shared.json    # shared/
```

```bash
# 类型检查（vue-tsc 自动跑四套）
pnpm dlx nuxi typecheck
```

<v-clicks>

- 零配置：`useState` / `useFetch` / `definePageMeta` 全自动推导类型
- `useFetch('/api/x')` 的 data 类型自动从 server handler 的返回值推导
- `noUncheckedIndexedAccess: true` 默认开 → 数组下标 = `T | undefined`

</v-clicks>

---
transition: slide-up
---

# vs Next.js

| 维度 | Nuxt 4 | Next.js 15 |
|---|---|---|
| 基础 | Vue 3 | React 19 |
| 路由 | 文件路由 `pages/` | 文件路由 `app/` |
| 渲染 | SSR / SSG / ISR + routeRules | SSR / SSG / RSC |
| 数据 | `useFetch` / `useAsyncData` | RSC + `fetch` |
| 自动导入 | ✅ | ❌ |
| 服务端 | Nitro（任意部署） | Vercel 友好 |
| 状态 | `useState` + Pinia | Context + Zustand |

<v-click>

**选谁**：团队主语言决定 80%——写 Vue 选 Nuxt，写 React 选 Next.js。技术深度旗鼓相当。

</v-click>

---
layout: center
class: text-center
---

# 总结

适合：Vue 项目要 SSR / SSG / 全栈 / Edge 部署

不需要：纯 SPA 后台仪表盘 + 不在乎 SEO → 直接 Vue 3 + Vite 更省心

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://nuxt.com/docs" target="_blank">nuxt.com/docs</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/nuxt/nuxt" target="_blank">nuxt/nuxt</a>
</div>
