---
theme: seriph
background: https://cover.sli.dev
title: Service Worker 缓存完全指南
info: |
  Service Worker 缓存完全指南：Cache API · fetch 拦截 · 五大策略 · Workbox · 生命周期 · 导航预加载 · PWA 离线

  Learn more at https://developer.mozilla.org/en-US/docs/Web/API/Cache
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Service Worker 缓存完全指南

可编程缓存拦截层 · Cache API · 五大策略 · Workbox v7 · 导航预加载

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
SW 是浏览器在主线程之外的可编程缓存拦截层，是 PWA 离线能力的基石。
-->

---
transition: fade-out
---

# 什么是 SW 缓存

浏览器在**主线程之外**运行的**可编程缓存拦截层**

- **可编程**：缓存什么、何时过期、回退到哪全由 JS 表达
- **离线可用**：拦截 + Cache 副本让 Web 应用断网仍可访问（PWA 核心）
- **不读 HTTP 头**：`Cache-Control` / `ETag` 对 Cache API **完全无效**
- **永不过期**：缓存条目除非主动 `delete` 否则永久保留，需自实现过期
- **HTTPS 强制**：SW 是中间人代理，仅 localhost 例外
- **scope 范围**：默认 SW 脚本目录，`Service-Worker-Allowed` 扩大

> 查找顺序：**SW 缓存 → HTTP 缓存 → 网络**（CDN → 源站）

<!--
SW 是浏览器看到请求后第一个有机会处理的层。
-->

---

# SW 缓存 vs HTTP 缓存

| 维度 | HTTP 缓存（RFC 9111） | SW 缓存（Cache API） |
|------|------|------|
| **驱动** | 响应头（Cache-Control / ETag） | JS 策略（fetch 事件） |
| **自动过期** | 是（按 `max-age`） | **否**，需自实现 |
| **可编程** | 不可，只配头 | 完全可编程 |
| **作用域** | 浏览器自动管 | SW scope（脚本目录） |
| **需 JS** | 否 | 是（注册 + 事件） |
| **协议** | HTTP/1.1 RFC 9111 | Cache API Baseline 2018-04 |

> Cache API 是独立于 HTTP 缓存的高层 API，要让 SW 用更长 TTL 必须自实现，不能指望 `max-age`。

<!--
SW 缓存与 HTTP 缓存是两层互补，不是替代关系。
-->

---

# CacheStorage（caches 全局）

管命名缓存容器（与 Cache 接口管条目不同）

```js
// 容器级 API
const cache = await caches.open("app-v1");      // 打开/创建
const names = await caches.keys();              // ["app-v1", "static-v1"]
const has = await caches.has("app-v1");         // true
await caches.delete("app-v1");                  // 删整张命名缓存
const hit = await caches.match(request, opts);  // 跨所有命名缓存查
```

**版本化命名是关键**

- `app-v1` / `static-v2` 让 activate 区分新旧
- 直接叫 `'app'` → 旧条目永远残留、配额被吃光

> `caches.delete(name)` 删整张，`cache.delete(req)` 删单条，注意区别。

---

# Cache 接口（容器内条目）

```js
const hit = await cache.match("/style.css");    // Response | undefined
const hits = await cache.matchAll("/api/*");    // Response[]
await cache.put("/style.css", response);        // 写入（必须 clone）
await cache.add("/icon.png");                   // fetch + put 等价
await cache.addAll(["/", "/app.js", "/style.css"]); // 原子性批量
await cache.delete("/old.css");                 // 删单条
```

**核心特性**

- `match` 未命中 resolve **`undefined`**（非 reject）
- `addAll` **原子性**：任一 URL 失败整批 reject、SW 安装失败
- `put` 前 Response **必须 clone()**（流只能读一次）

<!--
addAll 失败会让整个 SW 安装失败，预缓存清单必须全部可访问。
-->

---

# match 三选项

| 选项 | 默认 | 作用 |
|------|------|------|
| `ignoreSearch` | `false` | `true` 时忽略 `?query` |
| `ignoreMethod` | `false` | 默认 POST/PUT/DELETE 不匹配 |
| `ignoreVary` | `false` | `true` 跳过 `Vary` 头校验 |

**陷阱**

```js
// 对 API 是灾难：/api?a=1 与 /api?a=2 共用一条缓存
cache.match(request, { ignoreSearch: true });
```

- `ignoreSearch: true` 仅用于静态资源版本号变更场景
- `ignoreMethod` 默认 false → POST 自然不命中（正确）

---

# Response 流只能读一次

底层是 `ReadableStream`，被消费一次后就锁定

```js
// 错：put 后 response 已被消费，浏览器拿到空体
const res = await fetch(request);
await cache.put(request, res);
return res;  // 空！

// 对：clone 后副本入缓存，原响应返回浏览器
const res = await fetch(request);
await cache.put(request, res.clone());
return res;
```

> `addAll` 内部已处理 clone，无需手写。

<!--
clone 是 SW 缓存最经典、最高频的坑，必须记牢。
-->

---

# fetch 事件拦截

```js
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;          // 仅缓存 GET

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));     // HTML：网络优先
  } else if (request.destination === "image") {
    event.respondWith(staleWhileRevalidate(request));
  } else if (["style", "script", "font"].includes(request.destination)) {
    event.respondWith(cacheFirst(request));       // 哈希静态：缓存优先
  }
});
```

**关键**：`respondWith` 必须始终 resolve 一个 `Response` 对象，否则 `TypeError`。

<!--
destination 比文件后缀更可靠——不依赖扩展名。
-->

---
layout: two-cols
---

# cache-first vs network-only

**cache-first**（缓存优先）

- 命中即返，未命中才网络 + 回写
- 适合**哈希命名静态资源**
- `app.[hash].js` URL 永不变 → 内容永新鲜

```js
async function cacheFirst(req) {
  const hit = await caches.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  const cache = await caches.open("rt-v1");
  cache.put(req, res.clone());
  return res;
}
```

::right::

# network-only

**network-only**（仅网络）

- 始终走网络，失败即失败
- 适合**强一致写操作 / 实时数据**
- POST/PUT/DELETE 默认走这条

```js
async function networkOnly(req) {
  return fetch(req);
}
```

**cache-only**（仅缓存）：仅查缓存，离线 app shell 用，未命中即 504。

<!--
写操作永远不要缓存——会返回脏数据。
-->

---
layout: two-cols
---

# network-first

**network-first**（网络优先）

- 网络优先，失败回退缓存
- 适合 **HTML / 关键 API**
- 兼顾新鲜度与可用性

```js
async function networkFirst(req) {
  try {
    const res = await fetch(req);
    const c = await caches.open("rt-v1");
    c.put(req, res.clone());
    return res;
  } catch {
    return (await caches.match(req))
      || new Response("Offline", { status: 504 });
  }
}
```

::right::

# stale-while-revalidate

**SWR**（旧返 + 后台更新）

- 立即返回旧副本
- 后台 fetch 更新缓存
- 适合**头像 / 字体 / 非关键图**

```js
async function swr(req) {
  const c = await caches.open("rt-v1");
  const hit = await c.match(req);
  const fp = fetch(req).then((res) => {
    c.put(req, res.clone());
    return res;
  });
  return hit || fp;
}
```

> SWR 要快又要最终一致——Facebook/Twitter 头像的标配。

<!--
SWR 平衡了新鲜度与可用性，是最常用的运行时策略之一。
-->

---

# Workbox v7

| 插件 | 作用 |
|------|------|
| **ExpirationPlugin** | 按 `maxEntries` / `maxAgeSeconds` 自动淘汰 |
| **CacheableResponsePlugin** | 按 `statuses: [0, 200]` 白名单过滤（含 opaque） |
| **BroadcastUpdatePlugin** | 缓存更新通知页面（提示「新版本可用」） |

**路由匹配**：`RegExp` / `matchCallback: ({url,request}) => bool` / `destination`

```js
registerRoute(({ request }) => request.destination === "image",
  new StaleWhileRevalidate({
    cacheName: "img-v1",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 3600 })],
  }));
```

> SW 生成：`generateSW`（配置驱动）/ `injectManifest`（自定义 SW）。

<!--
Workbox 把缓存清理、配额处理、策略组合都封装好了，别手写。
-->

---

# SW 生命周期

```text
注册 register()  →  install（预缓存 app shell，waitUntil(all)）
                →  waiting（有旧 SW 时等其退场）
                →  activate（清理旧版本缓存）
                →  controlled（开始拦截 fetch）
```

**事件 API**

| API | 用途 |
|------|------|
| `ExtendableEvent.waitUntil(p)` | install/activate 延长 SW 存活 |
| `FetchEvent.respondWith(p)` | fetch 劫持响应（必须 resolve Response） |

**紧急热修复专用**

- `self.skipWaiting()`：跳过 waiting，立即激活
- `clients.claim()`：立即控制未受控页面

> 正常更新让新 SW 自然进 waiting，更安全——避免版本不一致。

<!--
skipWaiting + clients.claim 别当常规操作，仅紧急修复用。
-->

---

# 导航预加载

SW 冷启动 50ms（移动 ~250ms，极端 >500ms）。预加载让网络请求与 SW 启动**并行**

```js
// activate 启用（feature-detect）
if (self.registration.navigationPreload) {
  await self.registration.navigationPreload.enable();
}

// fetch 里 await 预加载响应
event.respondWith(async () => {
  const preload = await event.preloadResponse;
  if (preload) return preload;
  return fetch(event.request);
});
```

**协作**：请求带 `Service-Worker-Navigation-Preload: true` 头，服务器可返不同内容（需配 `Vary: Service-Worker-Navigation-Preload`）

> 启用后不 `await preloadResponse` 也不 `waitUntil` 兜住 → 控制台报 cancel 警告。

---

# 跨域 opaque 响应

跨域 `mode: 'no-cors'` 响应是 opaque 的

- `status === 0`（不是真实状态码）
- `headers` 不可读（`get(...)` 永远返回 `null`）
- `body` 不可读（但可整体缓存）

**缓存白名单**

```js
new CacheableResponsePlugin({ statuses: [0, 200] });  // 含 opaque
```

**不要**尝试读 `headers.get('content-type')` 做分流——永远 `null`，改用 `request.destination`

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 把 `Cache-Control` 当 SW 过期依据（Cache API 不读响应头）
- `cache.put` 前 Response 不 `clone()`（流只能读一次）
- 缓存名不版本化（叫 `'app'`）→ 旧条目永远残留、配额被吃光
- `install.addAll` 清单含 404（原子性导致整批 reject）
- 对所有请求都缓存（含 POST/写操作）
- `respondWith` resolve `undefined`（必须始终返 Response）
- 缓存前不校验 `response.status`（把 4xx/5xx 也缓存）
- 缓存 opaque 后读 headers 做分流（永远 `null`）
- 不清理 `caches.keys()` 旧版本（配额超限整体清除）
- 导航走 cache-first 永不更新（用户永远看旧 HTML）
- 启用 `navigationPreload` 但不 await（控制台报 cancel 警告）
- `skipWaiting` + `clients.claim` 当常规（仅紧急修复用）

---

# 小结

SW 缓存 = 可编程的离线加速层

Cache API · 五大策略 · Workbox v7 · 生命周期 · 导航预加载

**静态用 cache-first · HTML/API 用 network-first · 头像字体用 SWR**

**版本化命名 + activate 清旧 + ExpirationPlugin 过期 + clone 入缓存**

[MDN Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) · [Workbox](https://developer.chrome.com/docs/workbox/caching-strategies-overview) · [导航预加载](https://web.dev/blog/navigation-preload)
