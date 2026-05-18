---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Analog
info: |
  Presentation Analog for frontend developers.

  Learn more at [https://analogjs.org](https://analogjs.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:angular-icon class="text-7xl" />
</div>

<br/>

## Analog — Angular Meta-Framework

Vite + Nitro for Angular：在 Angular 之上补齐文件路由 / SSR / Server Routes / Server Data Fetching 的全栈元框架

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Analog。

Angular 世界等了很久的元框架——由 Brandon Roberts（前 Angular 团队成员、NgRx
作者之一）主导，社区项目正式进入 Angular 官方推荐生态。

定位：Angular 版本的 Next.js / Nuxt / SolidStart——文件路由 + SSR/SSG +
Server Routes + 服务端数据获取，构建工具直接是 Vite，Server 层是 Nitro。

是 Angular 社区少有的"反 Webpack / 拥抱 Vite"的现代化项目，与 Angular Signals /
Standalone API 完美契合。
-->

---
transition: fade-out
---

# 什么是 Analog？

Angular 官方推荐生态的元框架，把响应式 UI 框架扩展成全栈应用框架

<v-click>

- **Vite 驱动**：抛弃 Webpack，直接使用 Vite 做开发服务器与构建（Vitest 配套）
- **Nitro 后端**：底层是 UnJS 的 Nitro（与 Nuxt 同源），跨平台部署能力开箱即用
- **File-Based Routing**：`.page.ts` 后缀的文件自动成路由，含动态段 / 路由组 / catch-all
- **Server Routes / API Routes**：`src/server/routes/api/*.get.ts` 命名约定即 API endpoint
- **Server-Side Data Fetching**：`load` 函数 + `injectLoad`，类型贯穿服务端到组件
- **Hybrid SSR / SSG**：默认 SSR，`routeRules` 切换 client-only / prerender 混合策略
- **Markdown 集成**：`@analogjs/content` 提供 `provideContent` + `injectContent`
- **完美兼容 Angular**：Signals / Standalone API / Angular CLI 项目可逐步迁移

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Analog_](https://analogjs.org)

</div>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
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

填补了 Angular 元框架的空白，但生态规模仍在追赶 Next.js / Nuxt

<v-clicks>

**优点**
- Angular 官方背书，与 Signals / Standalone API / 新控制流 (`@if` / `@for`) 完美契合
- Vite 替代 Webpack，开发服务器秒级启动，HMR 极快
- Nitro 后端体系成熟（与 Nuxt 共享），部署 preset 覆盖 Vercel / Netlify / Cloudflare / Node
- 与现有 Angular CLI 项目兼容，可逐步迁移
- 文件路由直觉，告别 `app-routing.module.ts` 集中式声明
- `@analogjs/content` 提供原生 Markdown 支持（博客 / 文档场景友好）
- Vitest 一站式单元测试（不再用 Karma / Jasmine）

**缺点**
- 仍在快速发展（v2 beta + Angular 21 同步演进），minor 版本偶有 API 调整
- 生态规模远小于 Next.js / Nuxt，UI 模板 / Admin 套件稀缺
- 招聘候选人少，主要靠从 Angular CLI 迁移
- 部分 Angular 库 SSR 兼容性需手动处理（`ssr.noExternal`）
- 文档体量仍在快速补齐中

</v-clicks>

---
transition: slide-up
---

# Angular 与元框架现状

Angular 元框架的演进路径

```
2010 — AngularJS（1.x，无 SSR 概念）
2016 — Angular 2 + Universal（官方 SSR 包，配置繁琐）
2019 — Scully（Angular 静态站点生成器，单一用途）
2021 — Nx（monorepo 工具，非元框架）
2023 — Analog 出世（Brandon Roberts 主导，社区项目）
2024 — Analog 进入 Angular 官方 awesome 推荐
2025 — Analog 1.x + Angular 20 配套
2026 — Analog 2.x beta + Angular 21（Signals 一等公民）
```

<v-click>

**核心痛点**：Angular 官方一直没有"开箱即用"的元框架——`@nguniversal/express-engine` 配置门槛高，且仍捆绑 Webpack。Analog 是社区第一个提供完整 Vite + Nitro + 文件路由方案的项目。

</v-click>

<v-click>

> 💡 **类比**
>
> Analog 之于 Angular ≈ Next.js 之于 React ≈ Nuxt 之于 Vue ≈ SolidStart 之于 SolidJS。

</v-click>

---
transition: slide-up
---

# 定位与生态

Analog 在元框架版图里的位置

<v-clicks>

- **谁在做**：Brandon Roberts（前 Angular 团队、NgRx 作者之一）+ 社区核心组
- **基于什么**：Vite（dev / build）+ Nitro（server）+ Angular Router（路由内核）
- **状态**：1.x 稳定线生产可用，2.x beta 与 Angular 21 配套演进
- **与 Next.js 类比**：定位重合，但 Angular UI 模型 + Nitro 后端 + Vite 构建
- **与 Nuxt 类比**：底层都用 Nitro，但 UI 一个 Angular 一个 Vue
- **与 SolidStart / SvelteKit 类比**：同代元框架，都拥抱 Vite + 文件路由 + Server 函数
- **关键卖点**：Angular CLI 项目可平滑迁移，零字节服务端代码进 client
- **学习路径**：Angular 基础 → 项目结构 → 文件路由 → `load` 函数 → API Routes → 部署

</v-clicks>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 关键事件 |
|---|---|---|
| **0.1.x** | 2023 | 首版预览，验证 Vite + Angular 可行性 |
| **0.2.x** | 2023.下半 | 文件路由稳定，Nitro 集成完成 |
| **1.0** | 2024 | 首个稳定版，API 冻结，配套 Angular 17+ |
| **1.x** | 2024-2025 | Server-Side Data Fetching、`injectLoad`、Content 完善 |
| **2.0 beta** | 2025-2026 | Angular 20+ / Signals 优先 / `@analogjs/router` 重构 |
| **未来** | 2026+ | 与 Angular 21+ 同步演进，Nitro v3 / Vite 8 跟进 |

<v-click>

今天主要讲 **Analog 1.x 稳定线**——API 已 freeze，生产可用。2.x beta 兼容 Angular 21，可关注但生产建议跟 1.x。

</v-click>

---
transition: slide-up
---

# 核心理念

Analog 与传统 Angular CLI 项目的根本区别

<v-clicks>

- **Vite 替代 Webpack/Esbuild Builder**：Angular CLI 默认用 esbuild，Analog 用 Vite。HMR 更快、生态插件更丰富
- **Nitro 替代自建 Express Server**：Universal 要自己写 server.ts，Analog 用 Nitro 抽象，部署平台无感切换
- **文件路由替代 RouterModule**：不再集中声明 `routes`，约定大于配置
- **Server / Client 边界清晰**：`.server.ts` 文件**永远不会**进入 client bundle，零字节服务端代码泄漏
- **与 Vitest 一体**：Karma / Jasmine 退场，Vitest 提供更快测试 + Vite 共享配置
- **Signals 优先**：与 Angular Signals + Standalone API 设计契合，无 NgModule 包袱

</v-clicks>

<v-click>

> 💡 **共存策略**
>
> Analog 不强制全量迁移——可以在 Angular CLI 项目中**逐步引入**：先用 Analog 跑 SSR，渐进改造路由文件。

</v-click>

---
transition: slide-up
---

# 创建项目

```bash
# 官方脚手架（推荐）
npm create analog@latest
# → 询问：项目名 / 模板（blog / full-stack / minimal）
# → 是否启用 Tailwind / Vitest / Trpc / Drizzle 等

# 或者用其它包管理器
pnpm create analog
yarn create analog
bunx create-analog
```

<v-click>

要求 Node 18.13+ / Angular 15+（推荐 Node 20 LTS + Angular 20）。生产构建：

```bash
cd my-app
npm install
npm run start          # http://localhost:5173 （Vite 默认端口）

npm run build          # 产物：dist/analog/public + dist/analog/server
node dist/analog/server/index.mjs   # 默认 Node preset 启动方式
```

</v-click>

<v-click>

> 💡 **提示**
>
> 也可以用 Nx 生成 Analog 应用：`pnpm dlx create-nx-workspace --preset=@analogjs/platform`，适合 monorepo。

</v-click>

---
transition: slide-up
---

# 项目结构

```
my-app/
├── src/
│   ├── app/
│   │   ├── pages/                       # ← 文件路由根
│   │   │   ├── (home).page.ts           # → /
│   │   │   ├── about.page.ts            # → /about
│   │   │   ├── products.page.ts         # → /products（layout）
│   │   │   ├── products/
│   │   │   │   ├── (product-list).page.ts   # → /products
│   │   │   │   └── [productId].page.ts      # → /products/:productId
│   │   │   └── [...not-found].page.ts   # 404 catch-all
│   │   ├── app.component.ts             # 根组件（<router-outlet />）
│   │   └── app.config.ts                # 应用配置（provideFileRouter 等）
│   ├── server/
│   │   ├── routes/
│   │   │   └── api/
│   │   │       └── v1/users.get.ts      # → /api/v1/users (GET)
│   │   └── middleware/
│   │       └── auth.ts                  # 自动注册的服务端中间件
│   ├── main.ts                          # client entry
│   ├── main.server.ts                   # server entry（含 provideServerContext）
│   └── index.html
├── public/
├── vite.config.ts                       # analog() 插件
├── tsconfig.json
└── package.json
```

<v-click>

**关键约定**：所有 `.page.ts` 文件**必须用 default export** 导出组件类，会被自动 lazy-load。

</v-click>

---
transition: slide-up
---

# vite.config.ts

```ts
import { defineConfig } from 'vite';
import analog from '@analogjs/platform';

export default defineConfig(({ mode }) => ({
  publicDir: 'src/public',
  build: {
    target: ['es2020'],
  },
  plugins: [
    analog({
      // SSR 行为（默认开启）
      ssr: true,

      // 预渲染特定路由
      prerender: {
        routes: ['/', '/about', '/blog'],
      },

      // Nitro 部署 preset（不填则 Node）
      nitro: {
        preset: 'vercel',
      },

      // 内容支持（@analogjs/content）
      content: {
        highlighter: 'prism',
      },
    }),
  ],
}));
```

<v-click>

**`analog()` 插件做了什么**：扫描 `pages/` 生成 Angular Router 配置；注入 Nitro server entry；配置 Vitest preset；处理 `.server.ts` 与 client bundle 边界分离。

</v-click>

---
transition: slide-up
---

# 文件路由约定

```
src/app/pages/
├── (home).page.ts                # → /          （括号 = 仅作 index 标识）
├── index.page.ts                 # → /          （等价写法）
├── about.page.ts                 # → /about
├── about.team.page.ts            # → /about/team（点号语法）
├── products.page.ts              # → /products  父布局（含 router-outlet）
├── products/
│   ├── (product-list).page.ts    # → /products
│   └── [productId].page.ts       # → /products/:productId
├── (auth).page.ts                # 路由组布局（URL 无 /auth 前缀）
├── (auth)/
│   ├── login.page.ts             # → /login
│   └── signup.page.ts            # → /signup
└── [...not-found].page.ts        # catch-all（404）
```

<v-click>

| 文件名约定 | 含义 |
|---|---|
| `(name).page.ts` | 标记当前目录的 index 路径 |
| `[param].page.ts` | 动态段，参数名 `param` |
| `[...slug].page.ts` | catch-all 通配（用于 404） |
| `(group).page.ts` + 同名文件夹 | 路由组（pathless layout） |
| `a.b.page.ts` | 等价 `a/b.page.ts` 嵌套 |

</v-click>

---
transition: slide-up
---

# 页面组件：基础

```ts
// src/app/pages/about.page.ts
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <h1>About</h1>
    <p>Analog 是 Angular 元框架</p>
  `,
})
export default class AboutPageComponent {}
```

<v-click>

**两条约束**：

- 必须用 `export default class`（默认导出）——文件路由依赖此约定
- 必须 `standalone: true`——Analog 拥抱 Standalone API，不需要 NgModule

</v-click>

<v-click>

```ts
// src/app/pages/products/[productId].page.ts
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  template: `<h1>Product {{ productId }}</h1>`,
})
export default class ProductPageComponent {
  @Input() productId!: string;  // 通过 withComponentInputBinding() 注入路由参数
}
```

</v-click>

---
transition: slide-up
---

# app.config.ts：应用配置

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    // 文件路由（替代 provideRouter(routes)）
    provideFileRouter(withComponentInputBinding()),

    // HTTP Client（SSR 必须用 withFetch）
    provideHttpClient(
      withFetch(),
      withInterceptors([requestContextInterceptor]),
    ),

    // SSR 客户端 hydration
    provideClientHydration(),
  ],
};
```

<v-click>

**关键 provider 解释**：

- `provideFileRouter()` — 替代 Angular Router `provideRouter(routes)`，自动从 `pages/` 生成路由
- `withComponentInputBinding()` — 路由参数自动注入到组件 `@Input()`
- `requestContextInterceptor` — 把 `/api/x` 相对 URL 在服务端自动转完整 URL

</v-click>

---
transition: slide-up
---

# Page Metadata + SEO

```ts
// src/app/pages/about.page.ts
import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'About Analog',
  canActivate: [() => true],
  meta: [
    { name: 'description', content: 'Analog 是 Angular 的元框架' },
    { property: 'og:title', content: 'About Analog' },
    { property: 'og:image', content: '/og.png' },
  ],
};

@Component({
  standalone: true,
  template: `<h1>About</h1>`,
})
export default class AboutPageComponent {}
```

<v-click>

**`RouteMeta` 支持**：

- `title` — 页面标题（自动写入 `<title>`）
- `meta` — 标准 / OpenGraph 标签数组
- `canActivate` / `canMatch` — Angular Router 守卫
- `providers` — 路由级 provider（服务隔离）
- `redirectTo` + `pathMatch: 'full'` — 静默重定向，不渲染组件

</v-click>

---
transition: slide-up
---

# Server-Side Data Fetching：load 函数

服务端获取数据，**永远不进 client bundle**

```ts
// src/app/pages/products/[productId].server.ts
import { PageServerLoad } from '@analogjs/router';

export const load = async ({
  params,    // 路由参数
  req,       // h3 Request
  res,       // h3 Response
  fetch,     // 同构 fetch
  event,     // h3 event
}: PageServerLoad) => {
  const product = await fetch(`/api/v1/products/${params['productId']}`)
    .then((r) => r.json());

  return { product, loadedAt: Date.now() };
};
```

<v-click>

**核心特性**：

- 文件命名 `[name].server.ts`——和 `[name].page.ts` 配对
- 函数体**仅服务端执行**，client bundle 零字节
- 返回值自动序列化后通过 SSR transfer state 传给组件
- 客户端导航时变为 fetch 调用，无需手写 contract

</v-click>

---
transition: slide-up
---

# injectLoad：消费 load 数据

```ts
// src/app/pages/products/[productId].page.ts
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectLoad } from '@analogjs/router';

import { load } from './[productId].server';

@Component({
  standalone: true,
  template: `
    <h1>{{ data().product.name }}</h1>
    <p>价格：¥{{ data().product.price }}</p>
  `,
})
export default class ProductPageComponent {
  // 服务端首屏直接同步可用；客户端导航返回 observable，toSignal 转 Signal
  data = toSignal(injectLoad<typeof load>(), { requireSync: true });
}
```

<v-click>

**类型推导**：`injectLoad<typeof load>()` 把 server 的 `load` 函数返回类型推到组件——同构数据流，端到端类型安全。

</v-click>

<v-click>

> 💡 **配合 RouteMeta resolver**
>
> 用 `getLoadResolver(route)` 在 `routeMeta.resolve` 中读取 load 数据，做二次组合。

</v-click>

---
transition: slide-up
---

# Server Routes / API Routes

文件即 endpoint，由 Nitro 接管

```ts
// src/server/routes/api/v1/users.get.ts → GET /api/v1/users
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  // 仅服务端代码
  return [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];
});
```

```ts
// src/server/routes/api/v1/users/[id].get.ts → GET /api/v1/users/:id
import { defineEventHandler, getRouterParam } from 'h3';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  return { id, name: `User ${id}` };
});
```

```ts
// src/server/routes/api/v1/users.post.ts → POST /api/v1/users
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  // ... 写入数据库
  return { ok: true, body };
});
```

---
transition: slide-up
---

# h3 工具函数速查

```ts
import {
  defineEventHandler,
  getRouterParam,         // 路由参数：/users/[id] → getRouterParam(event, 'id')
  getQuery,               // ?page=2 → getQuery(event)
  readBody,               // POST/PUT 请求体
  parseCookies,           // 读 cookies
  setCookie,              // 设 cookies
  setHeaders,             // 设响应头
  sendRedirect,           // 重定向
  createError,            // 抛错误响应（status + message）
} from 'h3';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'id required' });
  }
  return { id };
});
```

<v-click>

**Nitro / h3 工具集**与 Nuxt 共享——熟悉 Nuxt server routes 的开发者无缝过渡。

</v-click>

---
transition: slide-up
---

# Server Middleware

放在 `src/server/middleware/` 即自动注册

```ts
// src/server/middleware/auth.ts
import {
  defineEventHandler,
  getRequestURL,
  parseCookies,
  sendRedirect,
} from 'h3';

export default defineEventHandler(async (event) => {
  // 仅作用于 /admin/** 路径
  if (getRequestURL(event).pathname.startsWith('/admin')) {
    const cookies = parseCookies(event);
    const isLoggedIn = cookies['authToken'];

    if (!isLoggedIn) {
      sendRedirect(event, '/login', 401);
    }
  }
});
```

<v-click>

**特点**：

- 自动注册，无需手动 wire-up
- 按文件名字典序执行
- 接到 h3 event，与 server routes 共享 API
- 可读 `process.env` 服务端变量（无需 `VITE_` 前缀）

</v-click>

---
transition: slide-up
---

# SSR / SSG / Hybrid 渲染

`vite.config.ts` 中通过 `analog()` 配置

```ts
analog({
  // 默认全 SSR
  ssr: true,

  // 关闭 SSR → 纯 SPA 模式
  // ssr: false,

  // SSG：构建时预渲染指定路由
  prerender: {
    routes: [
      '/',
      '/about',
      '/blog',
      async () => {
        // 动态生成路由列表（如博客文章）
        const posts = await fetch('https://cms.example.com/posts').then((r) => r.json());
        return posts.map((p: any) => `/blog/${p.slug}`);
      },
    ],
  },

  // 混合渲染：特定路由跳过 SSR
  nitro: {
    routeRules: {
      '/admin/**': { ssr: false },
      '/api/**': { cors: true, headers: { 'Access-Control-Allow-Origin': '*' } },
    },
  },
}),
```

<v-click>

| 模式 | 配置 | 适合 |
|---|---|---|
| **SSR** | 默认 | 动态内容、个性化（最常见） |
| **SPA** | `ssr: false` | 后台 / SaaS / 不需要 SEO |
| **SSG** | `prerender.routes` | 博客 / 文档 / Marketing |
| **混合** | `routeRules` | 部分预渲染 + 部分 SSR + 部分 SPA |

</v-click>

---
transition: slide-up
---

# Nitro 部署 Preset

Analog 部署能力来自 Nitro，**改一行 preset 即可换平台**

```ts
analog({
  nitro: {
    preset: 'vercel',   // ← 改这里切换平台
  },
}),
```

<v-click>

| 平台 | preset | 备注 |
|---|---|---|
| **Node.js** | `node-server`（默认） | `node dist/analog/server/index.mjs` |
| **Vercel** | `vercel` | 自动检测 `.vercel/output/` |
| **Netlify** | `netlify` | Netlify Functions / Edge |
| **Cloudflare Pages** | `cloudflare-pages` | Workers 运行时 |
| **Firebase** | `firebase` | Cloud Functions |
| **Render** | `render-com` | Web Service |
| **Static** | `static` | 纯静态产物（配合 `prerender`） |

</v-click>

<v-click>

```bash
# 也可以通过环境变量临时切换，不改 vite.config.ts
BUILD_PRESET=vercel npm run build
BUILD_PRESET=cloudflare-pages npm run build
```

</v-click>

---
transition: slide-up
---

# 数据获取的另一种：HttpClient

Angular 原生 `HttpClient` 仍然是 Analog 推荐的客户端数据方案

```ts
// src/app/services/todos.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TodosService {
  private http = inject(HttpClient);

  getAll() {
    // 相对 URL，requestContextInterceptor 会自动转完整 URL（SSR / client / prerender）
    return this.http.get<Todo[]>('/api/v1/todos');
  }
}
```

<v-click>

**配合 `provideClientHydration()`**：SSR 期请求结果通过 `TransferState` 序列化进 HTML，client hydration 时直接命中，**避免双次请求**。

</v-click>

<v-click>

> 💡 **load 函数 vs HttpClient**
>
> `load` 用于路由级首屏数据（SSR 必拉），`HttpClient` 用于组件内动态请求（用户交互触发）。

</v-click>

---
transition: slide-up
---

# Markdown 集成：@analogjs/content

文档站、博客等内容场景的官方解决方案

```ts
// src/app/app.config.ts
import { provideContent, withMarkdownRenderer } from '@analogjs/content';

export const appConfig: ApplicationConfig = {
  providers: [
    provideContent(withMarkdownRenderer()),
    // ... 其它 provider
  ],
};
```

```ts
// vite.config.ts
analog({
  content: {
    highlighter: 'prism',   // 或 'shiki'
  },
}),
```

<v-click>

**目录约定**：内容文件放在 `src/content/`，支持 Markdown + Frontmatter。

```
src/content/
├── blog/
│   ├── hello-world.md
│   └── analog-1.0.md
└── projects/
    └── my-project.md
```

</v-click>

---
transition: slide-up
---

# injectContent：单文件读取

```ts
// src/app/pages/blog/[slug].page.ts
import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { injectContent, MarkdownComponent } from '@analogjs/content';

export interface PostAttributes {
  title: string;
  slug: string;
  description: string;
}

@Component({
  standalone: true,
  imports: [MarkdownComponent, AsyncPipe],
  template: `
    @if (post$ | async; as post) {
      <h1>{{ post.attributes.title }}</h1>
      <p>{{ post.attributes.description }}</p>
      <analog-markdown [content]="post.content" />
    }
  `,
})
export default class BlogPostComponent {
  readonly post$ = injectContent<PostAttributes>();   // 自动从路由 :slug 读取
}
```

<v-click>

`injectContent` 默认读 `:slug` 路由参数，匹配 `src/content/<slug>.md`。可用 `{ subdirectory: 'projects' }` 或 `{ customFilename: '...' }` 改路径。

</v-click>

---
transition: slide-up
---

# injectContentFiles：列表读取

```ts
// src/app/pages/blog/(blog-list).page.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectContentFiles } from '@analogjs/content';

export interface PostAttributes {
  title: string;
  slug: string;
  description: string;
}

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Blog</h1>
    <ul>
      @for (post of posts; track post.slug) {
        <li>
          <a [routerLink]="['/blog', post.slug]">
            {{ post.attributes.title }}
          </a>
        </li>
      }
    </ul>
  `,
})
export default class BlogListComponent {
  readonly posts = injectContentFiles<PostAttributes>(
    (file) => file.filename.includes('/src/content/blog/'),
  );
}
```

---
transition: slide-up
---

# Angular Signals 配合

Analog 完全拥抱 Angular Signals + 新控制流

```ts
import { Component, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectLoad } from '@analogjs/router';
import { load } from './index.server';

@Component({
  standalone: true,
  template: `
    <h1>Hello {{ name() }}</h1>
    <p>Count: {{ count() }}</p>
    <p>Double: {{ double() }}</p>
    <button (click)="increment()">+1</button>

    @if (data().loaded) {
      <p>服务端数据已加载</p>
    }
  `,
})
export default class HomeComponent {
  name = signal('Analog');
  count = signal(0);
  double = computed(() => this.count() * 2);

  // load 数据作为 Signal 暴露
  data = toSignal(injectLoad<typeof load>(), { requireSync: true });

  increment() { this.count.update((n) => n + 1); }
}
```

<v-click>

**关键**：`@if` / `@for` 是 Angular 17+ 新控制流（替代 `*ngIf` / `*ngFor`），与 Signals 性能最优。

</v-click>

---
transition: slide-up
---

# Forms：Reactive Forms + 服务端校验

```ts
// src/app/pages/contact.page.ts
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="email" placeholder="Email" />
      <input formControlName="message" placeholder="Message" />
      <button type="submit" [disabled]="form.invalid">提交</button>
      @if (success()) { <p>提交成功</p> }
    </form>
  `,
})
export default class ContactPageComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  success = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required],
  });

  submit() {
    this.http.post('/api/v1/contact', this.form.value)
      .subscribe(() => this.success.set(true));
  }
}
```

---
transition: slide-up
---

# 服务端响应表单（API Route）

```ts
// src/server/routes/api/v1/contact.post.ts
import { defineEventHandler, readBody, createError } from 'h3';
import { z } from 'zod';

const ContactSchema = z.object({
  email: z.string().email(),
  message: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // 服务端二次校验（前端 Validators 不可信）
  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid form data',
      data: parsed.error.flatten(),
    });
  }

  // 写入数据库 / 发邮件 / ...
  return { ok: true };
});
```

<v-click>

> 💡 **校验双层**：客户端 `Validators` 改善 UX，服务端 Zod 保证安全——never trust the client。

</v-click>

---
transition: slide-up
---

# vs Next.js (React)

| 维度 | Analog | Next.js 16 |
|---|---|---|
| UI 框架 | Angular（Signals / Standalone） | React（含 RSC） |
| 路由 | 文件路由（`.page.ts`） | 文件路由（App Router） |
| 数据加载 | `load` + `injectLoad` | RSC async component |
| 数据变更 | API Routes + HttpClient | Server Actions |
| 构建工具 | Vite | Turbopack / Webpack |
| Server 层 | Nitro | Next.js 自研 |
| 部署 | 任意平台（Nitro preset） | Vercel 最优 |

<v-click>

**何时选 Analog**：

- 团队已用 Angular，但想拥抱 Vite + 文件路由
- 需要 SSR / SSG 但不想踩 `@nguniversal` 配置坑
- 希望部署平台无锁定（Nitro 多 preset）
- 已经熟悉 Nuxt / Nitro 心智，想在 Angular 项目复用

</v-click>

---
transition: slide-up
---

# vs Nuxt (Vue) / SvelteKit / SolidStart

| 维度 | Analog | Nuxt 4 | SvelteKit | SolidStart |
|---|---|---|---|---|
| UI 框架 | Angular | Vue | Svelte | SolidJS |
| Server 层 | Nitro | Nitro | 自研（adapter） | Vinxi |
| 数据加载 | `load` 函数 | `useFetch` / `defineLoader` | `+page.server.ts` `load` | `query` + `"use server"` |
| Markdown | `@analogjs/content` | `@nuxt/content` | mdsvex | 第三方 |
| 状态成熟度 | 1.x（生产可用） | 4.x 稳定 | 2.x 稳定 | 1.x 稳定 |

<v-click>

**共同点**：

- 全部拥抱 Vite + 文件路由 + 服务端数据获取
- 部署都基于 Nitro 或类似抽象，跨平台一致
- 都是"反 Webpack / 反 Vercel 锁定"同盟

**Analog 独特**：唯一的 Angular 生态元框架，与 Signals / RxJS / Standalone API 配套。

</v-click>

---
transition: slide-up
---

# 常见踩坑（一）：默认必须 default export

```ts
// src/app/pages/about.page.ts

// ❌ 命名导出 — 路由不会被注册
export class AboutPageComponent { }

// ✅ 必须 default export
export default class AboutPageComponent { }
```

<v-click>

**根因**：Analog 文件路由扫描 `.page.ts`，只识别默认导出。

</v-click>

<v-click>

**配套约定**：

- 必须 `standalone: true`（NgModule 不支持）
- 类名可自取，但建议 `XxxPageComponent` 风格
- 需要 import 的 directive / pipe 放在 `imports: [...]`

</v-click>

---
transition: slide-up
---

# 常见踩坑（二）：.server.ts 边界

```
src/app/pages/
├── products/
│   ├── [productId].page.ts        # ← client + server 都进
│   └── [productId].server.ts      # ← 仅 server，client bundle 不包含
```

<v-click>

**`.server.ts` 文件的硬约束**：

- **永远不会** 进入 client bundle（即使 import 也不行）
- 可以安全用 Node API：`fs` / `path` / `process.env.SECRET_KEY` / 数据库 client
- 在 `.page.ts` 里只能 `import { load } from './[productId].server'` 用于类型
- 实际执行：SSR 期同进程直调，client 导航期变 fetch

</v-click>

<v-click>

> 💡 **类似机制**
>
> 与 SolidStart `"use server"` / TanStack `createServerFn` 同源——服务端代码零字节进 client 是元框架核心卖点。

</v-click>

---
transition: slide-up
---

# 常见踩坑（三）：SSR 兼容性

```
❌ npm 包在 SSR 环境报 window is not defined / document is not defined

→ 包内部用了 browser-only API（如 localStorage / window）
```

<v-click>

**解决方案 1**：让 Vite 转译该包（适合 ESM 包）：

```ts
// vite.config.ts
export default defineConfig({
  ssr: {
    noExternal: ['some-package', /^another-package-/],
  },
});
```

**解决方案 2**：在组件里用 `isPlatformBrowser` 守卫：

```ts
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const platformId = inject(PLATFORM_ID);
if (isPlatformBrowser(platformId)) {
  window.localStorage.getItem('key');
}
```

</v-click>

<v-click>

**经验**：Angular Material / PrimeNG 等大库通常 OK；冷门 UI 库或 chart 库需手动处理。

</v-click>

---
transition: slide-up
---

# 常见踩坑（四）：与 Angular CLI 共存

```
现有 Angular CLI 项目 → 想引入 Analog 做 SSR
```

<v-click>

**两条路径**：

**路径 A：完全切换**（推荐新项目）

```bash
npm create analog@latest
# 把现有组件 / 服务 copy 进去
# 把 routes 改成 .page.ts 约定
```

**路径 B：渐进迁移**

- 保留 `angular.json`，在 `package.json` 加 Analog 脚本
- 共存 `app/pages/` 与原 routing module，逐路由迁移
- 仅替换构建工具（Vite vs Angular CLI esbuild）

</v-click>

<v-click>

> 💡 **真相**：路径 B 的 friction 比想象中大——`angular.json` 与 `vite.config.ts` 双套配置容易冲突。建议中小项目直接走路径 A。

</v-click>

---
transition: slide-up
---

# 常见踩坑（五）：环境变量

```ts
// ❌ 客户端代码读不到 process.env.SECRET_KEY
@Component({ ... })
export default class FooComponent {
  key = process.env.SECRET_KEY;   // client bundle 里是 undefined
}
```

<v-click>

**Vite 约定**：

- `VITE_` 前缀的变量 → 注入 client（**禁止存放密钥**）
- 无前缀变量 → 仅服务端（`.server.ts` / middleware / API route 可读）

```ts
// .env
VITE_API_URL=https://api.example.com       # client 可读
DATABASE_URL=postgres://...                # 仅 server
SECRET_KEY=sk_...                          # 仅 server
```

```ts
// src/app/pages/index.page.ts （client）
const url = import.meta.env.VITE_API_URL;        // ✅

// src/server/routes/api/users.get.ts
const dbUrl = process.env['DATABASE_URL'];       // ✅
const secret = process.env['SECRET_KEY'];        // ✅
```

</v-click>

---
transition: slide-up
---

# 常见踩坑（六）：HttpClient SSR

```ts
// ❌ 默认 HttpClient 在 SSR 期会报 XMLHttpRequest is not defined
provideHttpClient()
```

<v-click>

**必须配 `withFetch()`**——让 HttpClient 用 native fetch 替代 XHR：

```ts
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { requestContextInterceptor } from '@analogjs/router';

providers: [
  provideHttpClient(
    withFetch(),                                  // ✅ SSR 必须
    withInterceptors([requestContextInterceptor]) // ✅ 相对 URL 自动补全 baseURL
  ),
]
```

</v-click>

<v-click>

**`requestContextInterceptor` 的作用**：

- SSR 期：`/api/users` → `http://localhost:5173/api/users`（同进程直调）
- Client：保持相对 URL（浏览器自动处理）
- Prerender：把相对 URL 转完整 URL 给 Nitro

</v-click>

---
transition: slide-up
---

# 经验法则

<v-clicks>

- **新项目走 `npm create analog@latest`** → 模板配置最准，不要从 scratch 搭
- **`.page.ts` 必须 default export + standalone** → 文件路由前置条件
- **路由数据在 `.server.ts`，组件 `injectLoad`** → 类型贯穿、零字节泄漏
- **`provideHttpClient(withFetch())` 必加** → SSR 环境无 XHR
- **`requestContextInterceptor` 必加** → 解决相对 URL 跨环境一致性
- **环境变量遵守 Vite 约定** → `VITE_` 前缀才进 client，密钥永远无前缀
- **混合渲染用 `routeRules`** → admin 后台跳 SSR，blog 走 prerender
- **服务端表单二次校验** → 客户端 Validators 不可信，server 用 Zod
- **冷门包 SSR 不兼容** → 配 `ssr.noExternal` 或 `isPlatformBrowser` 守卫
- **跟进 Angular 21 + Analog 2.x** → Signals 一等公民是未来方向

</v-clicks>

---
transition: slide-up
---

# 不适合 Analog 的场景

<v-clicks>

- **企业重 Angular Material Admin 模板** → 这些默认 Angular CLI，迁移成本高
- **依赖 NgModule 的旧大型项目** → Analog 拥抱 Standalone，需先做 NgModule 拆解
- **追求最大社区资源** → 文档 / 教程 / Stack Overflow 远小于 Nuxt / Next.js
- **不需要 SSR 的 SPA** → Angular CLI + vite + SPA 模式可能更简单
- **依赖 Karma + Protractor 的测试套件** → Analog 强烈推 Vitest + Playwright
- **团队不愿放弃 Webpack** → Analog 是 Vite-only，无 Webpack 退路
- **生产稳定性高于一切的金融 / 医疗等场景** → 1.x 已稳，但生态广度仍弱

</v-clicks>

<v-click>

> **经验**：Analog 最强场景是"**新建 Angular 项目 / 重视 SSR + SEO / 团队愿意拥抱 Vite + Signals + Standalone 现代心智**"。

</v-click>

---
transition: slide-up
---

# 下一步学习路径

```
入门
├── 跑通 npm create analog@latest 默认模板
├── 读 Getting Started + Routing Overview
├── 写一个 CRUD：Products 列表 + 详情 + 新建
└── 理解 .page.ts default export + Standalone API

进阶
├── load 函数 + injectLoad（Server-Side Data Fetching）
├── Server Routes：API 端点（GET / POST / 动态参数）
├── Server Middleware：auth / logging / cors
├── RouteMeta + canActivate（路由守卫 + SEO）
└── Angular Signals + 新控制流配合

实战
├── 混合渲染：routeRules + prerender + ssr: false
├── @analogjs/content：博客 / 文档站
├── Nitro Preset 切换：Vercel / Netlify / Cloudflare
├── 表单：Reactive Forms + 服务端 Zod 校验
└── SSR 兼容性调优：ssr.noExternal + isPlatformBrowser

延伸
├── 从 Angular CLI 项目迁移实操
├── 跟进 Analog 2.x beta + Angular 21
├── Vitest + Playwright 测试组合
└── Nx workspace 中托管 Analog 应用
```

<v-click>

**官方资源**：

- 文档：[analogjs.org](https://analogjs.org)
- GitHub：[analogjs/analog](https://github.com/analogjs/analog)
- Examples：[analogjs/analog/tree/main/apps](https://github.com/analogjs/analog/tree/main/apps)
- Discord：Analog 官方社区

</v-click>

---
layout: center
class: text-center
---

# 总结

适合：新 Angular 项目 / 重视 SSR + SEO / 拥抱 Vite + Signals + Standalone

少做：依赖 NgModule 的大型旧项目 / 追求最大社区 / 不想换 Webpack

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://analogjs.org" target="_blank">analogjs.org</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/analogjs/analog" target="_blank">analogjs/analog</a>
</div>

<div class="mt-4">
  <carbon:play /> <a href="https://analogjs.org/docs/getting-started" target="_blank">Getting Started</a>
</div>
