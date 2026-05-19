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
- `app/components/` 组件、`app/composables/` 函数、`app/utils/` 纯函数
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
transition: slide-up
---

# useFetch 完整选项

```ts
const { data, pending, error, refresh, status, execute, clear } = await useFetch(
  "/api/articles",
  {
    // ─── 请求行为 ───
    method: "GET",
    query: { page: 1, size: 20 },
    headers: { "X-Token": token.value },

    // ─── 响应处理 ───
    transform: (res) => res.data.map((x) => ({ ...x, slug: slugify(x.title) })),
    pick: ["id", "title"],          // 仅保留这些字段（payload 瘦身）
    default: () => [],              // 加载中的占位

    // ─── 调度策略 ───
    lazy: false,                    // true：不阻塞导航
    immediate: true,                // false：手动 execute()
    watch: [page, size],            // 依赖变更自动 refresh

    // ─── 缓存 ───
    key: "articles",                // 跨组件共享
  },
);
```

---
transition: slide-up
---

# useAsyncData：自定义 fetcher

```ts
const route = useRoute();

const { data: user } = await useAsyncData(
  () => `user-${route.params.id}`,  // 动态 key（依赖响应式时用函数）
  async () => {
    const [profile, orders] = await Promise.all([
      $fetch(`/api/users/${route.params.id}`),
      $fetch(`/api/users/${route.params.id}/orders`),
    ]);
    return { profile, orders };
  },
  { watch: [() => route.params.id] }, // params 变化自动重新拉
);
```

<v-click>

`useFetch` 是 `useAsyncData` 的 URL 简写——单个端点用 `useFetch`，多并发 / 自定义逻辑用 `useAsyncData`。

</v-click>

---
transition: slide-up
---

# Hydration 与 Payload

```ts
// 服务端拉的数据序列化到 HTML（payload），客户端复用避免重发请求
const { data } = await useFetch("/api/articles");
//                                   ↑
// SSR 阶段：服务端发请求 → 拿数据 → 注入 HTML
// CSR 阶段：客户端从 payload 复用 → 不再请求
```

<v-click>

**陷阱**：

- 数据含 `Date` / `Map` / `Set` 等非 JSON 类型 → 序列化失败
- 数据 > 50KB → 用 `pick` 瘦身 / 改 `lazy` 减小 payload
- 同一 key 的 `useFetch` 跨组件共享数据，**避免重复请求**

</v-click>

---
transition: slide-up
---

# 错误处理：error.vue + useError

```vue
<!-- app/error.vue：覆盖所有错误页 -->
<script setup lang="ts">
const props = defineProps<{
  error: { statusCode: number; statusMessage: string };
}>();

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <div>
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusMessage }}</p>
    <button @click="handleError">回到首页</button>
  </div>
</template>
```

```ts
// 任意位置抛出
throw createError({
  statusCode: 404,
  statusMessage: "文章不存在",
  fatal: true, // 触发 error.vue（否则只是页面级错误）
});
```

---
transition: slide-up
---

# Plugins

```ts
// app/plugins/api.ts → 客户端 + 服务端都跑
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      const token = useCookie("token");
      if (token.value) options.headers.set("Authorization", `Bearer ${token.value}`);
    },
    onResponseError({ response }) {
      if (response.status === 401) navigateTo("/login");
    },
  });

  return { provide: { api } };
});
```

```vue
<script setup>
const { $api } = useNuxtApp();
const data = await $api("/me");
</script>
```

---
transition: slide-up
---

# Plugin 命名规则

```
app/plugins/
├── 01.firstPlugin.ts          # 先跑（数字前缀控顺序）
├── 02.secondPlugin.ts
├── auth.client.ts             # 仅客户端
├── analytics.server.ts        # 仅服务端
├── tracking.client.ts         # 仅 CSR
└── pinia-extension.ts         # 双端
```

<v-clicks>

- 数字前缀：`01.`/`02.` 控制启动顺序
- `.client` / `.server` 后缀：单端运行
- `parallel: true`：与其它 plugin 并行启动（非默认）
- `dependsOn: ['pinia-extension']`：声明依赖

</v-clicks>

---
transition: slide-up
---

# AppConfig vs RuntimeConfig

```ts
// app/app.config.ts → 构建期常量（前端可访问）
export default defineAppConfig({ theme: { primary: "#00DC82" } });

// nuxt.config.ts → 运行期环境变量
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: "",                       // 仅服务端，从 NUXT_API_SECRET
    public: { apiBase: "" },             // 客户端，从 NUXT_PUBLIC_API_BASE
  },
});

// 使用
const appConfig = useAppConfig();         // 构建期
const runtimeConfig = useRuntimeConfig(); // 运行期，env 可覆盖
```

| 场景 | 选 |
| --- | --- |
| Feature flag / 主题色 / 不变常量 | AppConfig |
| API 地址 / Secret / 多环境差异 | RuntimeConfig |

---
transition: slide-up
---

# useState：SSR-safe 全局状态

```ts
// app/composables/useCart.ts
export function useCart() {
  return useState<Item[]>("cart", () => []);
}
```

```vue
<!-- 任意组件 -->
<script setup>
const cart = useCart();
cart.value.push({ id: 1, name: "Widget", price: 99 });
</script>
```

<v-click>

**关键特性**：

- **SSR-safe**：服务端创建 → 序列化进 payload → 客户端 hydration 时复用，不会出现两端 state 不同步
- **跨组件共享**：同 key 的 `useState` 返回同一引用
- 比 `ref` 在 setup 外创建更安全（避免请求间串数据）

</v-click>

---
transition: slide-up
---

# Pinia Store 进阶

```ts
// stores/user.ts
export const useUserStore = defineStore("user", () => {
  const profile = ref<User | null>(null);

  // Getter
  const isAdmin = computed(() => profile.value?.role === "admin");

  // Action
  async function load() {
    profile.value = await $fetch("/api/me");
  }

  // 监听
  watch(profile, (val) => {
    if (val) localStorage.setItem("user", JSON.stringify(val));
  });

  return { profile, isAdmin, load };
});
```

```ts
// nuxt.config.ts
modules: ["@pinia/nuxt"],

// pinia.config.ts → 启用 storeToRefs 自动导入等
```

---
transition: slide-up
---

# SEO：useHead + useSeoMeta

```ts
// 单页面定制
useHead({
  title: "文章详情",
  meta: [
    { name: "description", content: article.excerpt },
    { property: "og:image", content: article.cover },
  ],
  link: [{ rel: "canonical", href: `https://x.com/blog/${slug}` }],
  script: [{ src: "https://cdn.example.com/analytics.js", async: true }],
});

// 或更类型友好
useSeoMeta({
  title: "文章详情",
  description: article.excerpt,
  ogImage: article.cover,
  ogType: "article",
  twitterCard: "summary_large_image",
});
```

<v-click>

`useSeoMeta` 自动展开成 og:* / twitter:* 等具体标签，类型友好（IDE 补全所有合法字段）。

</v-click>

---
transition: slide-up
---

# Nitro Caching

```ts
// server/api/articles.get.ts
export default defineCachedEventHandler(
  async (event) => {
    return await db.articles.findMany();
  },
  {
    maxAge: 60 * 10,             // 10 分钟
    name: "articles-list",       // cache key 前缀
    getKey: (event) => `lang-${getQuery(event).lang || "en"}`, // 自定义 key
    swr: true,                   // SWR：返旧值同时后台 revalidate
    base: "redis",               // 走 Nitro storage 的 redis driver
  },
);
```

```ts
// nuxt.config.ts：配 redis storage
nitro: {
  storage: {
    redis: { driver: "redis", url: process.env.REDIS_URL },
  },
}
```

---
transition: slide-up
---

# defineCachedFunction

```ts
// server/utils/get-weather.ts
export const getWeather = defineCachedFunction(
  async (city: string) => {
    return await $fetch(`https://api.weather.com/${city}`);
  },
  {
    maxAge: 60 * 30,   // 缓存 30 分钟
    name: "weather",
    getKey: (city) => city.toLowerCase(),
  },
);

// server/api/weather/[city].get.ts
export default defineEventHandler(async (event) => {
  const city = getRouterParam(event, "city")!;
  return await getWeather(city); // 自动走缓存
});
```

<v-click>

适合：第三方 API 调用结果缓存——同 city 短时间内多次访问共享一次外部请求。

</v-click>

---
transition: slide-up
---

# Server Routes Plugins

```ts
// server/plugins/db.ts → Nitro 启动时调用一次
export default defineNitroPlugin((nitroApp) => {
  const db = new PrismaClient();
  nitroApp.hooks.hook("close", async () => {
    await db.$disconnect();
  });

  // 挂到 useStorage('db') 让 handlers 取
  useStorage("db").setItem("client", db);
});
```

```ts
// server/api/articles.get.ts
export default defineEventHandler(async (event) => {
  const db = await useStorage("db").getItem<PrismaClient>("client");
  return await db.articles.findMany();
});
```

---
transition: slide-up
---

# @nuxt/image：自适应图片

```vue
<template>
  <!-- 自动 srcset + 懒加载 + WebP / AVIF 转换 -->
  <NuxtImg
    src="/products/hero.jpg"
    sizes="sm:100vw md:50vw lg:400px"
    format="webp"
    loading="lazy"
  />

  <!-- 占位 + 渐进显示 -->
  <NuxtPicture
    src="/products/hero.jpg"
    placeholder
    densities="x1 x2 x3"
  />
</template>
```

```ts
// nuxt.config.ts
image: {
  provider: "ipx",          // 内置；也可 cloudinary / vercel / netlify
  domains: ["cdn.example.com"],
  presets: { avatar: { modifiers: { format: "webp", width: 96, height: 96 } } },
}
```

---
transition: slide-up
---

# @nuxt/content：Markdown 站

```ts
// content/blog/2026/hello.md
---
title: Hello
date: 2026-05-15
tags: [intro, nuxt]
---

# 内容

支持 Vue 组件嵌入 + frontmatter + MDC 语法。
```

```vue
<!-- pages/blog/[...slug].vue -->
<script setup>
const route = useRoute();
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection("blog").path(route.path).first(),
);
</script>

<template>
  <ContentRenderer :value="page" />
</template>
```

<v-click>

类 VitePress 但与 Nuxt 应用合体：Markdown 内容 + 动态页面 + API 共一份代码。

</v-click>

---
transition: slide-up
---

# 测试：@nuxt/test-utils

```ts
// tests/example.spec.ts
import { describe, it, expect } from "vitest";
import { setup, $fetch, createPage } from "@nuxt/test-utils/e2e";

describe("Articles API", async () => {
  await setup({
    server: true,
    rootDir: fileURLToPath(new URL("..", import.meta.url)),
  });

  it("GET /api/articles 返回列表", async () => {
    const articles = await $fetch("/api/articles");
    expect(Array.isArray(articles)).toBe(true);
  });

  it("访问 /blog 渲染", async () => {
    const page = await createPage("/blog");
    expect(await page.textContent("h1")).toBe("Blog");
  });
});
```

---
transition: slide-up
---

# DevTools

```bash
pnpm dev  # 启动后 dev server 自带 DevTools
```

按 `Shift+Alt+D` 展开面板：

<v-clicks>

- **Routes**：当前路由表 + 文件位置 + 一键跳源码
- **Components**：组件树 + props / state 实时检查
- **Composables**：所有自动导入函数列表 + 用量统计
- **Modules**：已启用模块状态 + 配置
- **Hooks**：生命周期钩子执行时序
- **Plugins**：plugin 执行顺序 + 时长
- **Payload**：SSR 注入的数据
- **Server**：API 路由 + 测试请求面板
- **Tailwind / UnoCSS**：原子类匹配面板

</v-clicks>

---
transition: slide-up
---

# Hooks：扩展点

```ts
// app/plugins/track.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("page:start", () => console.log("页面开始加载"));
  nuxtApp.hook("page:finish", () => console.log("页面加载完成"));
  nuxtApp.hook("app:error", (err) => reportToSentry(err));
});
```

```ts
// server/plugins/db.ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("request", (event) => { /* ... */ });
  nitroApp.hooks.hook("close", async () => { /* cleanup */ });
});
```

常用 hooks：`app:created` / `app:mounted` / `app:error` / `page:start` / `page:finish` / `vue:setup` / `vue:error` / `link:prefetch`。

---
transition: slide-up
---

# Edge Deployment

```ts
// nuxt.config.ts
nitro: {
  preset: "cloudflare-workers", // 或 vercel-edge / deno-deploy
}
```

```bash
pnpm build
# .output/server/index.mjs → 兼容 Workers / Edge Functions
```

<v-click>

**Edge 限制**：

- 单实例内存通常 ≤ 128MB
- 单请求执行 ≤ 30s（部分平台更短）
- 不支持 Node 内置（fs / child_process）
- 全部用 Web API（fetch / crypto.subtle / Streams）

适合：API gateway / SSR 渲染 / Auth 验证；不适合：大计算 / 数据库连接池（需用 RESTful DB 代理）。

</v-click>

---
transition: slide-up
---

# 性能优化清单

<v-clicks>

- **组件懒加载**：`<LazyHeavy />` 而非 `<Heavy />`，仅当 mount 才加载 chunk
- **Payload 瘦身**：`useFetch('/api/x', { pick: ['id', 'title'] })`
- **路由级缓存**：`routeRules` 配 `swr` / `isr`
- **图片优化**：`<NuxtImg>` 自动 srcset / 格式转换 / 懒加载
- **预取链接**：`<NuxtLink prefetch>` 视口可见时预取目标 chunk
- **关闭无用模块**：dev 加 `--no-clear`，prod 移除 DevTools 模块
- **拆 layer**：管理后台单独 layer + `routeRules: { ssr: false }` 走 SPA
- **Edge 部署**：把 SSR 推到 edge node 降全球延迟

</v-clicks>

---
transition: slide-up
---

# 环境变量 + Runtime Config

```bash
# .env
NUXT_API_SECRET=server-only-secret
NUXT_PUBLIC_API_BASE=https://api.example.com
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: "",                       // 自动读 NUXT_API_SECRET
    public: { apiBase: "" },             // 自动读 NUXT_PUBLIC_API_BASE
  },
});
```

```ts
// 服务端
const { apiSecret } = useRuntimeConfig();

// 客户端
const { public: { apiBase } } = useRuntimeConfig();
```

<v-click>

**约定**：`runtimeConfig.public.*` 客户端可见；其它字段仅服务端。**自动 env 映射**：字段 camelCase ↔ env SCREAMING_SNAKE_CASE 加 `NUXT_` 前缀。

</v-click>

---
transition: slide-up
---

# Server Components（实验）

```vue
<!-- app/components/AsyncList.server.vue：仅在服务端渲染 -->
<script setup>
const { data } = await useFetch("/api/heavy");
</script>

<template>
  <ul><li v-for="x in data">{{ x.title }}</li></ul>
</template>
```

```ts
// nuxt.config.ts
experimental: {
  componentIslands: true, // 启用 Server Components / Islands
}
```

<v-click>

特点：

- 服务端渲染后**只发 HTML** 到客户端（无 JS 水合）
- 用 `<NuxtIsland>` 注入交互区域
- 类似 React Server Components / Astro Islands
- v4 仍实验中，生产慎用

</v-click>

---
transition: slide-up
---

# 监控 + 日志

```ts
// app/plugins/monitor.client.ts
import * as Sentry from "@sentry/vue";

export default defineNuxtPlugin((nuxtApp) => {
  Sentry.init({
    app: nuxtApp.vueApp,
    dsn: useRuntimeConfig().public.sentryDsn,
    integrations: [
      Sentry.browserTracingIntegration({ router: useRouter() }),
    ],
  });

  nuxtApp.hook("app:error", (error) => Sentry.captureException(error));
});
```

```ts
// server/plugins/log.ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("error", (error, ctx) => {
    console.error("[Nitro Error]", { url: ctx.event?.path, error });
  });
});
```

---
transition: slide-up
---

# Layer 实战：多端共享

```
acme-monorepo/
├── layers/
│   ├── base/                  # 全部端共用：UI 组件 / utils / theme
│   ├── auth/                  # 鉴权：login / session / middleware
│   └── billing/               # 计费：套餐 / 支付 / API
├── apps/
│   ├── web/                   # 主站（extends: base, auth, billing）
│   ├── admin/                 # 后台（extends: base, auth）
│   └── mobile/                # 移动端（extends: base, auth）
└── ...
```

```ts
// apps/web/nuxt.config.ts
export default defineNuxtConfig({
  extends: ["../../layers/base", "../../layers/auth", "../../layers/billing"],
});
```

<v-click>

**适合**：电商 / SaaS 等「多端共用基础设施 + 各端独有业务」。比 monorepo + 共享包灵活——layer 可以含 pages / api / 配置。

</v-click>

---
transition: slide-up
---

# 升级：Nuxt 3 → 4

```bash
pnpm dlx nuxt upgrade
```

主要变更：

<v-clicks>

- **源码搬到 `app/`**：旧 `pages/` 改 `app/pages/`（也可保持兼容模式）
- **`shallowRef` 默认**：`useFetch` data 是 `shallowRef`，深嵌套更新需 `.value = newVal`
- **`useFetch` key 共享**：同 key 跨组件返同一 data ref
- **模块加载顺序**：layer 先 / project 后（v3 反的）
- **四套 tsconfig**：自动隔离 app / server / node / shared
- **Node ≥ 22.22.1**：v3 时代 18 / 20 已不支持
- **`noUncheckedIndexedAccess`**：所有数组下标推断 `T | undefined`

</v-clicks>

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
