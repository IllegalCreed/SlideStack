---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Scalar
info: |
  Presentation about Scalar for developers.

  Learn more at [https://scalar.com/](https://scalar.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Scalar

消费 OpenAPI、渲染现代交互式 API 文档（基于 @scalar/api-reference 1.60.0）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天聊 Scalar —— 它不是又一个文档生成器，而是消费 OpenAPI 规范、把它渲染成现代交互式 API 文档的工具，还内置一个能真实发请求的客户端。搞清"消费而非生成"这一点，才能看懂它和 Swagger UI、Redoc 的关系。
-->

---
transition: fade-out
---

# Scalar 是什么？

消费 OpenAPI、渲染**交互式** API 文档，**不生成** spec

<v-clicks>

- 输入是已有的 OpenAPI / Swagger **spec**，输出是可浏览、可调试的文档
- 内置一个**能真实发请求**的 API 客户端
- MIT 开源、offline-first，可完全自托管
- 常用来替换观感偏老的 Swagger UI

</v-clicks>

<div v-click="4" text-xs mt-6>

_Read more about_ [_Scalar_](https://scalar.com/)

</div>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Scalar 是什么？一句话：它消费 OpenAPI 规范，渲染成现代交互式 API 文档，但它自己不生成 spec。

[click] 它的输入是已有的 OpenAPI 或 Swagger 规范，输出是给人浏览、可直接调试的文档界面。

[click] 最大亮点是内置一个能真实发请求的 API 客户端。

[click] 它是 MIT 开源、offline-first，可以完全自托管。

[click] 实践中最常用来替换 UI 偏老的 Swagger UI。
-->

---
transition: fade-out
---

# 工具链坐标：消费 vs 生成

谁生成 spec、谁渲染，分清职责

<v-clicks>

- **生成 spec**：上游框架 / 工具（如 NestJS 的 `@nestjs/swagger` 扫描装饰器）
- **渲染文档**：**Scalar**——拿这份 spec 渲染成交互式参考
- 所以"Scalar build 通过 = spec 已生成"是伪命题
- Scalar 跑通只说明**渲染层** OK，spec 仍由上游产出

</v-clicks>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
把 Scalar 放进工具链坐标，关键是分清"谁生成、谁渲染"。

[click] 生成 spec 是上游框架的事，比如 NestJS 的 swagger 模块从装饰器扫描出规范。

[click] Scalar 是消费方，拿这份 spec 渲染成交互式文档。

[click] 所以"Scalar build 通过就等于 spec 已生成"是个伪命题。

[click] Scalar 跑通只说明渲染层没问题，spec 仍由上游产出。
-->

---
transition: fade-out
---

# 内置 API 客户端：杀手锏

可在文档里直接发**真实请求**

<v-clicks>

- 对接口发**真实网络请求**并看到响应，无需切到 Postman
- **环境变量**管理 baseURL / token，查看**请求历史**
- 复制 **25+ 种语言**的请求代码片段
- 由 `@scalar/api-client`（约 3.10.4）提供，还有桌面 app
- 这正是它远超 Swagger UI 弱版 Try it out 的代际优势

</v-clicks>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Scalar 的杀手锏是内置一个完整的 API 客户端。

[click] 读者可以在文档里直接对接口发真实请求、看到响应，无需切到 Postman。

[click] 还能用环境变量管理 baseURL、token，查看请求历史。

[click] 并能一键复制 25 种以上语言的请求代码片段。

[click] 这套客户端由 @scalar/api-client 提供，版本约 3.10.4，还有独立桌面 app。

[click] 这正是它相对 Swagger UI 那个较弱的 Try it out 的代际优势。
-->

---
transition: fade-out
---

# Scalar 不是什么

三个最常见的误解

<v-clicks>

- **不生成 spec**：只渲染已有规范，生成靠上游（如 NestJS Swagger 模块）
- **不是 Swagger Editor**：不承担在线编辑 / 创作规范的职责
- **不是只读渲染器**：与 Redoc 不同，它内置可发**真实请求**的客户端

</v-clicks>

<div v-click text-sm mt-6>

记住方向：上游**生成** spec，Scalar **消费** spec。

</div>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
反过来澄清 Scalar 不是什么。

[click] 它不生成 spec，只渲染已有规范，生成靠上游比如 NestJS swagger 模块。

[click] 它不是 Swagger Editor，不承担在线编辑、创作规范的职责。

[click] 它也不是只读渲染器，和 Redoc 不同，它内置可发真实请求的客户端。

[click] 记住这个方向：上游生成 spec，Scalar 消费 spec。
-->

---
transition: fade-out
---

# 最快接入：CDN / ESM

全局入口 `createApiReference`

<div v-click>

```html
<div id="app"></div>
<script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
<script>
  Scalar.createApiReference("#app", { url: "/openapi.json" });
</script>
```

</div>

<div v-click>

```ts
// ESM 等价写法
import { createApiReference } from "@scalar/api-reference";
createApiReference("#app", { url: "/openapi.json" });
```

</div>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
最快的接入方式是 CDN。

[click] 引入 @scalar/api-reference 脚本后，全局对象 Scalar 暴露 createApiReference，指向挂载点 #app，传入 url 即可。注意：旧的 data-url 标签写法已经弃用。

[click] ESM 写法等价，只是改成具名导入 createApiReference，再调用它。配置对象完全一样。
-->

---
transition: fade-out
---

# 四类接入方式

配置对象通用，学一次处处可用

<v-click>

| 方式 | 入口 |
| --- | --- |
| **CDN 脚本** | `Scalar.createApiReference(sel, cfg)` |
| **ESM 导入** | `import { createApiReference }` |
| **后端中间件** | `apiReference(cfg)` 挂路由 |
| **前端组件** | React / Vue 组件，props 传 cfg |

</v-click>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Scalar 有四类接入方式，妙处是它们共用同一套通用配置对象，学一次处处可用。

[click] CDN 脚本用 Scalar.createApiReference；打包项目用 ESM 具名导入同名函数；后端框架用 apiReference 中间件挂路由；前端框架用 React 或 Vue 组件，把配置作为 props 传入。无论哪种，传的都是同一组字段。
-->

---
transition: fade-out
---

# 后端框架中间件

`apiReference({ url })` 挂到路由

<div v-click>

```ts
// Express：@scalar/express-api-reference（约 0.10.4）
import { apiReference } from "@scalar/express-api-reference";
app.use("/docs", apiReference({ url: "/openapi.json" }));
```

</div>

<div v-click>

```ts
// Hono：@scalar/hono-api-reference（约 0.11.4）
import { apiReference } from "@scalar/hono-api-reference";
app.get("/docs", apiReference({ url: "/openapi.json" }));
```

</div>

<div v-click text-sm mt-2>

NestJS：`@nestjs/swagger` 生成 spec，`@scalar/nestjs-api-reference`（约 1.2.4）渲染。

</div>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
后端集成普遍是中间件挂路由的范式。

[click] Express 用 @scalar/express-api-reference，约 0.10.4 版本，apiReference 返回中间件挂到 /docs。

[click] Hono 用 @scalar/hono-api-reference，约 0.11.4，写法几乎一样。

[click] NestJS 则配合它的 swagger 模块：swagger 生成 spec，scalar 的 nestjs 包约 1.2.4 负责渲染，Scalar 只替换渲染层。
-->

---
transition: fade-out
---

# 前端框架组件

配置作为 props 传入

<div v-click>

```tsx
// React：@scalar/api-reference-react（约 0.9.47）
import { ApiReferenceReact } from "@scalar/api-reference-react";

export default function Docs() {
  return <ApiReferenceReact configuration={{ url: "/openapi.json" }} />;
}
```

</div>

<v-clicks>

- Vue 用官方 Vue 组件，同样把 `configuration` 作为 prop 传入
- 前端集成是一等公民，无需降级为原生 script

</v-clicks>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
前端框架用组件接入。

[click] React 用 @scalar/api-reference-react，约 0.9.47，渲染 ApiReferenceReact 组件，把 configuration 作为 props 传入。

[click] Vue 用官方 Vue 组件，同样把 configuration 作为 prop 传入。

[click] 这些前端集成都是一等公民，不需要降级成原生 script。
-->

---
transition: fade-out
---

# 头号坑：版本线分裂

集成包**各自独立**，别用核心版本号一概而论

<v-click>

| 包 | 版本 | 同步核心？ |
| --- | --- | --- |
| `@scalar/api-reference` | 1.60.0 | —（核心） |
| `@scalar/fastify-api-reference` | 1.60.0 | **是（唯一）** |
| `@scalar/nestjs-api-reference` | 1.2.4 | 否 |
| `@scalar/hono-api-reference` | 0.11.4 | 否 |
| `@scalar/express-api-reference` | 0.10.4 | 否 |

</v-click>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
落地最大的坑：版本线分裂。

[click] 看这张表，核心 @scalar/api-reference 是 1.60.0，但只有 fastify 集成包跟它同步到 1.60.0；nestjs 在 1.2.4，hono 在 0.11.4，express 在 0.10.4。看到核心是 1.60.0 就去装 express-api-reference 的 1.60.0 必然失败。落地时按目标框架的包名，各查各的版本。
-->

---
transition: fade-out
---

# 配置：加载 spec

`url` / `content` / `sources` 三选一

<v-click>

| 字段 | 形态 | 取舍 |
| --- | --- | --- |
| `url` | spec 地址 | **可缓存、解耦，推荐** |
| `content` | 内联对象 / 字符串 | 大文档影响性能 |
| `sources` | 多 spec 数组 | 每项 `slug` + `title` |

</v-click>

<div v-click text-sm mt-3>

默认用 `url`：spec 可缓存、与页面更新解耦。多版本 API 用 `sources`。

</div>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
配置对象里，加载 spec 有三个字段。

[click] url 指向 spec 地址，可被缓存、与页面解耦，是官方推荐的首选；content 直接内联 spec 对象或字符串，但大文档会影响性能；sources 是数组，用于同一文档挂多份 spec，每项要给 slug 和 title。

[click] 默认就用 url。要同时展示 v1、v2 多版本 API，用 sources。
-->

---
transition: fade-out
---

# 主题与布局

`theme`（配色）× `layout`（版式），正交

<div v-click>

```ts
createApiReference("#app", {
  url: "/openapi.json",
  theme: "purple", // 11 套之一 + none
  layout: "modern", // modern 默认 / classic
});
```

</div>

<v-clicks>

- 11 套主题：`default` `moon` `purple` `saturn` `kepler` `mars` `deepSpace` `laserwave`…
- `none` + `customCss` → 完全自定义外观
- `layout` 与 `theme` 是两个独立维度

</v-clicks>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
外观由 theme 和 layout 控制，两者正交。

[click] 看代码：theme 选配色，layout 选版式。

[click] 内置 11 套主题，比如 default、moon、purple、saturn、laserwave 等。

[click] 把 theme 设成 none 再配 customCss，可以完全自定义外观。

[click] layout 取 modern 默认或 classic，它和 theme 是两个独立维度。
-->

---
transition: fade-out
---

# 明暗与可见性

锁定明暗、收敛交互入口

<v-clicks>

- `darkMode`：仅设默认明暗，用户**仍可切换**
- `forceDarkModeState`（`'dark'`|`'light'`）：**锁定且隐藏**切换
- `showSidebar` / `hideModels`：隐藏侧边栏 / 模型区块
- `hideTestRequestButton` + `hideClientButton`：**逼近只读**展示

</v-clicks>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
明暗和可见性也有专门字段。

[click] darkMode 只设默认明暗，用户仍可切换。

[click] 要固定暗色不可切换，用 forceDarkModeState，取 dark 或 light，会锁定并隐藏切换按钮。

[click] showSidebar 控制侧边栏，hideModels 隐藏底部模型区块。

[click] 想做成接近只读？同时设 hideTestRequestButton 和 hideClientButton，从入口移除发请求路径。
-->

---
transition: fade-out
---

# CORS 与 proxyUrl

内置客户端从浏览器直连，会撞同源策略

<div v-click>

```ts
createApiReference("#app", {
  url: "/openapi.json",
  proxyUrl: "https://proxy.scalar.com", // 默认公共代理，绕过 CORS
});
```

</div>

<v-clicks>

- 接口未对文档站点开 CORS → 浏览器拦截请求（非 Scalar 的 bug）
- `proxyUrl` 让请求经代理转发，绕过跨域
- 报跨域**先查 `proxyUrl`** 是否配置

</v-clicks>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
内置客户端是在浏览器里直连接口，会撞上 CORS。

[click] 看配置：proxyUrl 默认指向 Scalar 的公共代理，用来绕过跨域。

[click] 如果接口没对文档站点开放 CORS，浏览器会拦截请求，这不是 Scalar 的 bug，是同源策略。

[click] proxyUrl 让请求先经代理转发，从而绕过跨域。

[click] 所以内置客户端一报跨域，第一步先查 proxyUrl 有没有配。
-->

---
transition: fade-out
---

# 生产别长期依赖公共代理

默认 `proxy.scalar.com` 是第三方转发

<v-clicks>

- 请求（可能含敏感数据）经**第三方**转发，有外泄隐患
- 可用性受制于公共代理稳定性
- 不符合很多团队"数据不出域"的合规

</v-clicks>

<div v-click text-sm mt-4>

**生产做法**：自建轻量代理，或让后端直接对文档站点开放 CORS；公共代理仅作开发期便利。

</div>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
但生产环境不要长期依赖默认的公共代理。

[click] 它是第三方转发，请求可能含敏感数据，有外泄隐患。

[click] 可用性也受制于公共代理的稳定性。

[click] 而且不符合很多团队数据不出域的合规要求。

[click] 生产做法是自建一个轻量代理，或者让后端直接对文档站点开放 CORS，公共代理只作开发期便利。
-->

---
transition: fade-out
---

# 请求相关字段

预填凭据、换服务器、定制请求

<v-click>

| 字段 | 作用 |
| --- | --- |
| `authentication` | 预填鉴权凭据，打开即可带 token 发请求 |
| `servers` | 覆盖 spec 的 servers，临时换本地 mock |
| `customFetch` | 自定义 fetch（旧 `fetch` 选项已弃用） |
| `defaultHttpClient` | 代码片段默认语言 |
| `hiddenClients` | 隐藏部分代码片段语言 |

</v-click>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
还有一组请求相关字段。

[click] authentication 预填鉴权凭据，读者打开文档就能带 token 直接发请求；servers 覆盖 spec 里声明的服务器，方便临时换成本地 mock；customFetch 传入自定义 fetch 实现来定制请求，注意旧的 fetch 选项已经弃用；defaultHttpClient 设代码片段区默认高亮哪种语言；hiddenClients 隐藏不想暴露的语言。
-->

---
layout: two-cols-header
transition: fade-out
---

# Scalar vs Swagger UI vs Redoc

::left::

**核心差异**

<v-clicks>

- Scalar：内置完整客户端，交互最强
- Swagger UI：有 Try it out，但弱、UI 偏老
- Redoc：静态**只读**，无交互
- 许可：均含 MIT（Swagger UI 为 Apache-2.0）

</v-clicks>

::right::

<div v-click="1">

| 维度 | Scalar | Swagger UI | Redoc |
| --- | --- | --- | --- |
| 发请求 | **强** | 弱 | 无 |
| UI | **现代** | 偏老 | 静态 |
| 许可 | MIT | Apache-2.0 | MIT |

</div>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
把三者横向对比。

[click] Scalar 内置完整客户端，交互最强；Swagger UI 有 Try it out 但较弱、UI 偏老；Redoc 是静态只读、没有交互；许可上 Scalar 和 Redoc 是 MIT，Swagger UI 是 Apache-2.0。

右边这张表一目了然：发请求能力 Scalar 强、Swagger UI 弱、Redoc 没有；UI Scalar 现代、Swagger UI 偏老、Redoc 静态。
-->

---
transition: fade-out
---

# 怎么选

按"要不要在文档里调接口"分流

<v-clicks>

- **要现代 UI + 真能调接口** → **Scalar**（客户端 + 环境变量 + 历史）
- **只要轻量只读静态文档** → **Redoc** 足够
- **已深绑 Swagger 生态 / 团队熟悉** → 继续 **Swagger UI**，或用 Scalar 平滑替换渲染层
- 注意：三者都**消费** spec、都**不生成**——选的是渲染与交互体验

</v-clicks>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
那怎么选？按要不要在文档里调接口来分流。

[click] 要现代 UI 又要能真正调接口，选 Scalar，它把客户端、环境变量、历史都搬进文档。

[click] 只要一份轻量、只读的静态文档，Redoc 就够了。

[click] 项目已经深绑 Swagger 生态、团队也熟悉，可以继续用 Swagger UI，或者用 Scalar 平滑替换它的渲染层。

[click] 注意：三者都是消费 spec、都不生成 spec，你选的是渲染和交互体验，不是生成能力。
-->

---
transition: fade-out
---

# 开源渲染器 vs 托管平台

两层，别混淆收费边界

<v-clicks>

- **开源（MIT）**：`@scalar/api-reference` + `@scalar/api-client`——免费、可自托管、可商用
- **托管平台（freemium）**：Registry / Dashboard / SDK 生成等增值服务
- 内置客户端属于**开源**部分，**不需要付费**
- 别因为存在托管平台，就误以为渲染 / 客户端能力收费

</v-clicks>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
最后澄清一个易混点：Scalar 分两层。

[click] 开源部分是 @scalar/api-reference 加 @scalar/api-client，MIT 许可，免费、可自托管、可商用。

[click] 托管平台是 freemium，包括 Registry、Dashboard、SDK 生成等增值服务。

[click] 内置客户端属于开源部分，不需要付费。

[click] 别因为它有个托管平台，就误以为渲染或客户端能力是收费的。
-->

---
transition: fade-out
---

# 踩坑清单

<v-clicks>

1. Scalar **消费**不生成 spec，生成靠上游（NestJS Swagger 等）
2. 集成包**版本线分裂**，仅 fastify 与核心 1.60.0 同步
3. 它**不是只读**——内置可发真实请求的客户端（≠ Redoc）
4. 忘配 `proxyUrl` 致内置客户端**跨域失败**，生产自建代理
5. 旧 API 已弃用：`data-url` 标签、`fetch` 选项（→ `customFetch`）
6. 开源渲染器（MIT）≠ 托管平台（Registry/Dashboard，freemium）

</v-clicks>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #4632a8 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
把容易翻车的点收成清单。

[click] Scalar 消费不生成 spec，生成靠上游比如 NestJS Swagger。

[click] 集成包版本线分裂，只有 fastify 跟核心 1.60.0 同步。

[click] 它不是只读，内置可发真实请求的客户端，这点和 Redoc 不同。

[click] 忘配 proxyUrl 会让内置客户端跨域失败，生产要自建代理。

[click] 旧 API 已弃用，data-url 标签写法和旧 fetch 选项都别用了，fetch 改用 customFetch。

[click] 开源渲染器是 MIT，和 freemium 的托管平台是两回事。
-->

---
layout: center
class: text-center
transition: slide-up
---

# 谢谢观看

Scalar：拿一份 OpenAPI spec，渲染成"现代、可直接调"的 API 文档

<div class="mt-8 flex justify-center gap-6 text-sm">
  <a href="https://scalar.com/" target="_blank">官网</a>
  <a href="https://guides.scalar.com/scalar/introduction" target="_blank">文档</a>
  <a href="https://github.com/scalar/scalar" target="_blank">GitHub</a>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天就到这里。

一句话总结 Scalar：它拿一份 OpenAPI spec，渲染成现代、可直接调接口的 API 文档。它消费 spec 不生成 spec，价值在于现代 UI 加上一个真能发请求的内置客户端。需要深入就看官网、文档和 GitHub。谢谢大家！
-->
