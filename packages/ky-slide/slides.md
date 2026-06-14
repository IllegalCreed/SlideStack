---
theme: seriph
background: https://cover.sli.dev
title: ky — Tiny HTTP Client based on Fetch
info: |
  Presentation of ky — a tiny and elegant HTTP client based on the Fetch API.

  Learn more at [https://github.com/sindresorhus/ky](https://github.com/sindresorhus/ky)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🌐</span>
</div>

<br/>

## ky — 基于 Fetch 的极简 HTTP 客户端

sindresorhus 出品，对原生 fetch 的薄封装：方法快捷、非 2xx 自动抛错、内置重试与超时、hooks。零依赖、体积极小、**ESM-only**

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/sindresorhus/ky" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 ky，sindresorhus 出品的一个 HTTP 客户端。它的定位很清楚：基于 Fetch API 的、轻量优雅的 HTTP 客户端。注意它不是另起炉灶的网络库，而是对浏览器原生 fetch 的一层极简封装，复用平台的 Request、Response、AbortController。

它在 fetch 之上补齐了日常最需要的东西：方法快捷方式、把非 2xx 状态码当错误自动抛、内置重试、超时、还有覆盖整条生命周期的 hooks。卖点是零依赖、体积极小。

有一个硬约束今天会反复提：ky 是纯 ESM 包，只能 import，不能 require。

主线：为什么用它 → 上手 → 发 JSON 与查询参数 → 错误语义 → 重试 → 超时 → hooks → 实例 → 错误体系 → 进阶能力 → 1.x 迁移 → 选型 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用它

<v-clicks>

- 原生 fetch 对 404/500 不抛错，每次得手写 `if (!res.ok)`
- fetch 从不重试，瞬时网络抖动直接失败
- fetch 没有超时，请求可能永久挂起
- 发 JSON 要手动 stringify + 设 header

</v-clicks>

<div v-click class="mt-6">

ky 的回应：

- **非 2xx 自动抛 HTTPError** → 错误走异常通道
- **内置重试** → 幂等方法默认重试 2 次
- **内置超时** → 默认每次尝试 10s
- **json 选项** → 自动序列化 + 设头

</div>

<!--
为什么要在 fetch 之上再包一层？看四个老痛点。

第一，原生 fetch 对 404、500 这种收到了响应的情况仍然 resolve，你每次都得手写 if not res.ok 去判断，很啰嗦。第二，fetch 从不重试，一次瞬时的网络抖动或者 503 就直接失败了。第三，fetch 没有超时机制，请求可能永久挂起，得自己配 AbortController。第四，发个 JSON 要手动 JSON.stringify，还要手动设 Content-Type。

ky 针对性地回应：非 2xx 自动抛 HTTPError，让 HTTP 错误也走异常通道，符合直觉；内置重试，对幂等方法默认重试 2 次；内置超时，默认每次尝试 10 秒；json 选项自动序列化并设头。这四点就是 ky 最核心的价值。
-->

---

# 上手：第一条请求

```bash
npm install ky      # 或 pnpm add ky / bun add ky
```

```ts
import ky from "ky";

// GET 并解析 JSON —— 典型的 ky 一行式
const user = await ky.get("https://api.example.com/users/1").json();
```

<v-clicks>

- `ky.get(url)` 返回 **ResponsePromise**：可链式 `.json()`
- 对比 fetch 两段式（`await fetch` 再 `await res.json`）压成一行
- ⚠️ 纯 ESM：必须 `import`，不能 `require`

</v-clicks>

<!--
上手。安装就是 npm install ky，pnpm、bun 都行。

引入用 import ky from 'ky'。发一个 GET 并解析 JSON，就是 await ky.get(url).json() 一行。

关键在于 ky.get(url) 返回的是一个 ResponsePromise，它既能直接 await 拿到增强过的 Response，也能链式调用 .json() 一步拿到解析后的数据。对比原生 fetch 的两段式——先 await fetch，再 await res.json——ky 把它压成了一行。

最后强调那个硬约束：ky 是纯 ESM 包，必须用 import，不能 require。CommonJS 项目怎么接入，后面专门讲。
-->

---

# 发 JSON 与查询参数

```ts
// 发 JSON：用 json 选项（自动 stringify + 设 Content-Type）
await ky.post("https://api.example.com/users", {
  json: { name: "Ada", role: "admin" },
}).json();

// 查询参数：searchParams 自动拼成 ?page=2&size=10
await ky.get("https://api.example.com/users", {
  searchParams: { page: 2, size: 10 },
}).json();
```

<div v-click class="mt-2 text-sm">

> ⚠️ 发 JSON 用 `json` 不是 `body`；查询参数用 `searchParams` 不是 axios 的 `params`。

</div>

<!--
两个最常用的选项。

发 JSON 体用 json 选项：传一个对象，ky 会自动用 JSON.stringify 序列化，并自动设置 Content-Type 为 application/json。注意一定要用 json，不要用 body——body 沿用原生 fetch 语义，传对象不会自动 JSON 化。

加查询参数用 searchParams：传对象，ky 自动拼成问号 page 等于 2、size 等于 10，并且会和 URL 里已有的参数合并。它接受对象、字符串、数组、URLSearchParams 多种形式。

对比 axios：axios 发 JSON 用 data、查询参数用 params；ky 用 json 和 searchParams，命名更贴近 Web 标准。
-->

---

# 核心差异：错误语义

```ts
import ky, { HTTPError } from "ky";

try {
  await ky.get("https://api.example.com/missing").json();
} catch (error) {
  if (error instanceof HTTPError) {
    console.log(error.response.status); // 如 404
    console.log(error.data);            // 2.x：错误体在 error.data
  }
}
```

<v-clicks>

- ky 默认 `throwHttpErrors: true` → **非 2xx 抛 HTTPError**
- 原生 fetch 对 404/500 仍 resolve（需自查 `res.ok`）
- 关掉：`throwHttpErrors: false`（此时也不重试）

</v-clicks>

<!--
这是 ky 和原生 fetch 最重要的差异，单独一页讲。

ky 默认 throwHttpErrors 为 true，意思是跟随重定向之后，如果响应状态码非 2xx，就抛出 HTTPError，直接进 catch。HTTPError 暴露 response、request、options、data 四个属性，状态码在 error.response.status。

而原生 fetch 对 404、500 这种仍然 resolve，res.ok 是 false 但不抛错，需要你手动判断。

如果你的场景本就预期错误响应，比如探测资源是否存在，可以把 throwHttpErrors 设为 false，这时非 2xx 正常 resolve，你自己查 res.ok，但注意这时候它也不会重试了。

还有一个 2.x 的细节先剧透：读错误响应体要用 error.data，后面错误体系那页细讲。
-->

---

# 内置重试

```ts
await ky(url, {
  retry: {
    limit: 2,                                  // 默认 2
    methods: ["get", "put", "head", "delete"], // 默认含 options/trace
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
});
// 简写：retry: 5  等价 retry: { limit: 5 }
```

<v-clicks>

- 默认对**幂等方法**重试，**POST / PATCH 默认不重试**
- 默认只对一组状态码重试（普通 4xx 不重试）
- 延迟默认**指数退避** `0.3 * 2^(n-1) * 1000` ms

</v-clicks>

<!--
内置重试是 ky 的招牌能力，但不是任何失败都重试。

默认 limit 是 2，首次失败后最多再重试 2 次。retry 可以直接传一个数字当 limit，retry 等于 5 就等价于 retry 大括号 limit 5。

两个白名单决定是否重试。第一，方法白名单：默认是六个幂等方法，get、put、head、delete、options、trace。注意 POST 和 PATCH 默认不重试，因为它们通常非幂等，盲目重发可能重复创建或修改。第二，状态码白名单：默认是 408、413、429，加一组 5xx。普通的 4xx 比如 400、401、404 默认不重试，因为重发同样的错误请求没意义。

延迟默认是指数退避，公式是 0.3 乘以 2 的 n 减 1 次方乘以 1000 毫秒，大概 300、600、1200 毫秒这样涨。
-->

---

# 超时：两个维度

```ts
await ky(url, {
  timeout: 5000,        // 每次尝试 5s（默认 10000）
  totalTimeout: 30000,  // 整个操作含重试的总上限（默认 false）
  retry: { limit: 3, retryOnTimeout: true }, // 超时默认不重试！
});
```

<v-clicks>

- `timeout`：**每次尝试**的超时，超过抛 `TimeoutError`
- `totalTimeout`（2.x）：含重试与延迟的**总时长**上限
- `retryOnTimeout` 默认 **false** —— 超时默认不触发重试

</v-clicks>

<!--
超时在 ky 2.x 里分两个维度，别搞混。

timeout 是每次尝试的超时，默认 10000 毫秒，也就是 10 秒，超过就抛 TimeoutError。设成 false 可以关闭。

totalTimeout 是 2.x 新增的，是整个操作的总超时，涵盖所有重试和重试之间的延迟。它解决的问题是：单次超时设得不大，但配了重试，累计起来可能拖很久。默认是 false，也就是没有总超时。比如 timeout 5 秒、totalTimeout 30 秒，意思是每次尝试给 5 秒，但整体必须 30 秒内完成。

还有一个容易踩的默认：retryOnTimeout 默认是 false，也就是超时默认不会触发重试。要让超时也重试，得显式设成 true，通常配合 totalTimeout 一起用。
-->

---

# hooks：五件套

| hook | 时机 | 用途 |
|---|---|---|
| `init` | 构造前（同步） | 改 options |
| `beforeRequest` | 发出前 | 改 request / 短路返回 Response |
| `beforeRetry` | 重试前 | 刷 token / 返回 `ky.stop` |
| `beforeError` | 抛错前 | 改写错误 |
| `afterResponse` | 响应后 | 改响应 / 返回 `ky.retry()` |

<div v-click class="mt-3 text-sm">

> 每类是**函数数组、按序串行**；除 `init` 同步外都可 **async**。

</div>

<!--
ky 通过 hooks 选项开放整条请求生命周期，一共五件套。

init，在构造 request 之前运行，唯一的同步 hook，用来改 options，比如统一注入 searchParams。beforeRequest，请求发出前，改 request.headers 比如鉴权 token，还能返回一个 Response 直接短路、跳过真实请求，用于 mock 或读缓存。beforeRetry，每次重试前，可以刷新 token、改 URL，也可以返回 ky.stop 静默停止重试。beforeError，抛错前统一改写或替换错误，比如把后端的 message 拼进 error.message。afterResponse，拿到响应后，可以改响应，也可以返回 ky.retry 基于响应体内容强制重试。

两个特性：每一类 hook 都是一个函数数组，按数组顺序串行执行；除了 init 是同步的，其余四个都可以是 async 函数，ky 会 await 它们，所以你能在 hook 里做异步操作。
-->

---

# hooks 实战：401 自动续期

```ts
const api = ky.create({
  hooks: {
    afterResponse: [
      async ({ request, response, retryCount }) => {
        if (response.status === 401 && retryCount === 0) {
          const { token } = await refresh();
          const headers = new Headers(request.headers);
          headers.set("Authorization", `Bearer ${token}`);
          return ky.retry({ request: new Request(request, { headers }) });
        }
      },
    ],
  },
});
```

<!--
hooks 最经典的实战场景：401 自动续期。

在 afterResponse 里判断，如果响应状态码是 401，并且 retryCount 等于 0，也就是只在首次 401 时续期。这个 retryCount 等于 0 的判断很重要，用来防止无限循环刷新。

满足条件就去刷新 token，拿到新 token 后，基于原 request 造一个带新 Authorization 头的新 Request，然后返回 ky.retry，把这个新请求传进去，触发一次带新凭据的重试。

为什么放在 afterResponse？因为续期是基于响应状态码 401 来决定的，这时候已经拿到了 401 响应，放这里最自然。这也是官方文档给出的范式。
-->

---

# ky.retry()：基于响应体重试

```ts
afterResponse: [
  async ({ response }) => {
    if (response.status === 200) {
      const data = await response.json();
      if (data.error?.code === "RATE_LIMIT") {
        return ky.retry({ delay: data.error.retryAfter * 1000 });
      }
    }
  },
];
```

<v-clicks>

- 状态码 2xx，但响应体藏着业务错误码 → 也能重试
- 可带 `delay` / `code` / `cause` / `request`
- 遵守 `retry.limit`，跳过 `shouldRetry`

</v-clicks>

<!--
ky.retry 注意是个函数，不是 retry 选项，专门解决一类场景：状态码是 200 成功的，但响应体里藏着业务错误码，比如限流 RATE_LIMIT，这时候也需要重试。

做法是在 afterResponse 里，解析响应体，发现 error.code 是 RATE_LIMIT，就返回 ky.retry，还可以从响应里取自定义的延迟。

ky.retry 可以带几个参数：delay 自定义延迟，会绕过 jitter 和 backoffLimit；code 是机器可读标识，会出现在 beforeRetry 的 ForceRetryError 里；cause 保留错误链；request 用自定义请求重试，比如切到备用端点。

它遵守 retry.limit 的次数上限，但会跳过 shouldRetry 检查。
-->

---

# 实例：create vs extend

```ts
// create：全新实例，不继承父默认
const api = ky.create({ baseUrl: "https://api.example.com/", retry: 1 });

// extend：继承父默认并深合并（hooks 追加、headers 合并）
const authed = api.extend({
  hooks: { beforeRequest: [({ request }) => request.headers.set("Authorization", token)] },
});
```

<v-clicks>

- **create** 不继承（从干净状态开）
- **extend** 继承父默认并深合并（在现有实例上叠一层）
- extend 返回新实例，**不改父实例**；设 `undefined` 移除继承项

</v-clicks>

<!--
把共享配置固化成子客户端，是组织 API 调用的常用手法。ky 给了两个工厂方法。

create 创建一个全新实例，完全不继承调用它的那个 ky 的默认，相当于从干净状态重开。extend 创建一个继承父实例默认、并和它深合并的新实例：hooks 是数组追加，父级在前、新增在后；headers、searchParams、context 是合并。

核心区别就一句话：create 不继承，extend 继承并深合并。想从零开一个独立实例用 create，想在现有实例上再叠一层配置用 extend。

注意 extend 返回的是新实例，不会修改父实例。如果想移除从父实例继承来的某个 header，在 extend 的 headers 里把它的值设为 undefined；移除继承的某类 hook，把那一类设为 undefined。
-->

---

# 错误体系：三种分清楚

| 错误 | 何时抛 | 关键属性 |
|---|---|---|
| `HTTPError` | 收到非 2xx 响应 | `response` / `data` |
| `NetworkError` | 网络失败（无响应） | `cause`（无 response） |
| `TimeoutError` | 超时 | `request` |

```ts
import { isHTTPError, isNetworkError } from "ky";
if (isHTTPError(error)) { /* error.response.status */ }
```

<div v-click class="mt-2 text-sm">

> 优先用类型守卫 `isHTTPError()` 而非 `instanceof`，更稳健、能收窄类型。

</div>

<!--
ky 2.x 把失败分成不同类型，应该分别处理。

HTTPError，收到了非 2xx 响应才抛，带 response 和 data。NetworkError，网络层失败时抛，比如 DNS 失败、连接被拒、离线，这种情况根本没收到响应，所以它带 cause 原始错误，但没有 response 属性。TimeoutError，超时时抛。

判断类型时，2.x 导出了一组类型守卫：isHTTPError、isNetworkError、isTimeoutError 等等。强烈建议用这些守卫，而不是 instanceof。因为在跨打包、多实例、不同模块副本的场景下，instanceof 可能因为类标识不一致而失效，类型守卫更稳健，同时也能正确收窄 TypeScript 类型。
-->

---

# 2.x 读错误体的陷阱

```ts
catch (error) {
  if (isHTTPError(error)) {
    // ❌ 2.x 会失败：body 已被消费
    // const body = await error.response.json();

    // ✅ 直接读预解析的 error.data
    console.log(error.data);
  }
}
```

<v-clicks>

- 2.x 抛错前已把响应体预解析进 `error.data`
- 为此**消费了** `error.response` 的 body
- 填充受 `timeout` 与 **10 MiB** 上限约束

</v-clicks>

<!--
这是 2.x 一个很容易踩的陷阱，单独一页。

2.x 为了方便，会在抛错之前就把响应体预解析进 error.data。JSON 类型的按 Content-Type 自动解析，其他类型存成文本，空或解析失败就是 undefined。

但代价是：为了填充 error.data，ky 已经消费了 error.response 的 body。所以你再去调 error.response.json 会失败，因为 body 已经被读过了。正确做法是直接读 error.data。

为了避免在填充 error.data 时无限缓冲超大响应体、或者卡住，这个填充有双重边界：受请求 timeout 约束，还有一个 10 MiB 的响应体大小上限。error.data 在 beforeError hooks 运行之前就填好了，方便 hook 读取。
-->

---

# 进阶能力一览

<v-clicks>

- **shouldRetry**：完全接管「是否重试」的判断
- **jitter**：给延迟加随机，对抗惊群效应
- **Retry-After**：自动尊重服务端限流节奏
- **context**：向 hooks 传上下文，不污染 request
- **parseJson**：换 `@hapi/bourne` 防原型污染
- **fetch 选项**：替换底层实现（SSR / 埋点）
- **.json(schema)**：Standard Schema 运行时校验 + 推断类型

</v-clicks>

<!--
ky 还有一批进阶能力，快速过一遍。

shouldRetry，一个函数，完全接管是否重试的判断，优先于默认的状态码和超时检查，返回 true 强制重试、false 阻止、undefined 回退默认。它和 beforeRetry 分工不同：shouldRetry 决定是否重试，beforeRetry 是确定重试后改请求。

jitter，给重试延迟加随机抖动，对抗大量客户端同时重试压垮服务器的惊群效应。注意服务端给了 Retry-After 时不施加抖动。

Retry-After，对 429、503 这类状态码，ky 会自动等待响应头 Retry-After 指定的时间再重试，尊重服务端的限流节奏。

context，向所有 hook 传上下文数据，比如 token，而不污染 request，并且保证始终是对象。parseJson，可以换成 hapi 的 bourne 防原型污染。fetch 选项，替换底层 fetch 实现，用于 SSR 框架或全局埋点。最后 .json 可以传一个 Standard Schema，比如 Zod，做运行时校验加类型推断。
-->

---

# ESM-only 与 CommonJS 接入

```ts
// ❌ CJS 里不可行：ERR_REQUIRE_ESM
// const ky = require("ky");

// ✅ 动态 import（CJS 里允许）
const { default: ky } = await import("ky");

// ✅ 浏览器：ESM CDN
// <script type="module">import ky from "https://esm.sh/ky"</script>
```

<v-clicks>

- ky 是**纯 ESM**：`type: module`，只暴露 ESM 入口
- CJS 项目用动态 `import()`，或迁移到 ESM
- **无 UMD/全局**，浏览器走 `type=module` + CDN

</v-clicks>

<!--
ESM-only 这个硬约束，单独讲清楚怎么接入。

ky 是纯 ESM 包，package.json 里 type 是 module，exports 只暴露 ESM 入口。在 CommonJS 项目里，直接 require ky 会报 ERR_REQUIRE_ESM 这类错误。

两个可行方案：第一，用动态 import，const 大括号 default ky 等于 await import ky，在 CJS 里动态 import 是允许的。第二，把项目或者该文件迁移到 ESM，package.json 加 type module，或者用 .mjs 扩展名。注意装 @types/ky 这种类型包不能让 require 生效，模块格式和类型声明是两回事。

浏览器里不打包直接用，要走 ESM CDN，用 script type module，从 esm.sh、jsDelivr、unpkg 这些 CDN import。ky 不提供 UMD 或全局构建，没有 window.ky。
-->

---

# 从 1.x 迁移到 2.x

| 变更 | 1.x | 2.x |
|---|---|---|
| URL 前缀 | `prefixUrl` | `baseUrl` + `prefix` |
| Node 门槛 | 18+ | **22+** |
| `init` hook | 无 | 新增 |
| `totalTimeout` | 无 | 新增 |
| 读错误体 | `response.json()` | `error.data` |

<div v-click class="mt-3 text-sm">

> `baseUrl` 走标准 URL 解析；`prefix` 纯拼接、剥 input 前导 `/`（最接近旧 `prefixUrl`）。

</div>

<!--
当前 ky 的 latest 已经是 2.x，从 1.x 升级有几个破坏性变更要知道。

最主要的是 URL 前缀：1.x 用 prefixUrl 一个选项；2.x 把它拆成了两个语义更清晰的选项，baseUrl 和 prefix。baseUrl 遵循标准 URL 解析规则，等价于 new URL input 逗号 baseUrl，input 的前导斜杠表示站点根、会覆盖 base 的路径。prefix 是纯字符串拼接，会剥掉 input 的前导斜杠，总是追加在 prefix 后面，这个行为最接近旧的 prefixUrl。

其他变更：Node 门槛从 18 提到了 22；新增了 init hook 和 totalTimeout；读错误响应体从 error.response.json 改成直接读 error.data，因为 body 已经被消费了。

升级时主要就是把 prefixUrl 改成 baseUrl 或 prefix，再确认运行时是 Node 22 以上。
-->

---

# 选型：ky vs axios vs ofetch

| 维度 | ky | axios | ofetch |
|---|---|---|---|
| 底层 | fetch | XHR | fetch |
| 模块 | ESM-only | CJS+ESM | ESM |
| 体积 | 极小 | 较大 | 小 |
| 老浏览器 | 不支持 | **支持** | 不支持 |

<v-clicks>

- **选 ky**：轻量、零依赖、贴近 Web 标准、现代运行时
- **改选 axios**：要兼容 IE、必须用 CommonJS、重度依赖其生态
- **ofetch**：Nuxt / 服务端，要 fetch 又要好的 CJS 兼容

</v-clicks>

<!--
最后讲选型，ky、axios、ofetch 三者怎么选。

从底层看，ky 和 ofetch 基于 fetch，axios 在浏览器端基于 XHR。模块格式上，ky 是纯 ESM，axios 同时提供 CJS 和 ESM，ofetch 是 ESM 但 CJS 兼容做得好。体积上 ky 极小、零依赖，axios 较大，ofetch 小。老浏览器兼容是 axios 的独门优势，因为它用 XHR，ky 和 ofetch 基于 fetch 都不支持 IE。

所以什么时候选 ky：追求轻量、零依赖、贴近 Web 标准、现代运行时。什么时候改选 axios：需要兼容 IE 等老浏览器、或者项目必须用 CommonJS、或者重度依赖 axios 成熟的拦截器和第三方生态。ofetch 则在 Nuxt 或服务端、既要 fetch 又要好的 CJS 兼容时更顺手，它是 UnJS 系的。

没有银弹，按约束选。
-->

---
layout: intro
---

# 总结

ky = **基于 fetch 的极简 HTTP 客户端，零依赖、ESM-only**

- 错误：非 2xx 自动抛 `HTTPError`（读体用 `error.data`）
- 重试：幂等方法默认重试 2 次，指数退避 + `jitter`
- 超时：每次尝试 `timeout` + 整体 `totalTimeout`
- hooks：`init` / `beforeRequest` / `beforeRetry` / `beforeError` / `afterResponse`
- 实例：`create`（全新）vs `extend`（继承深合并）
- 取舍：要轻量+fetch 选 ky；要老浏览器/CJS 选 axios

<!--
总结一下。

ky 的本质是基于原生 fetch 的一层极简封装，零依赖、体积极小、纯 ESM。

技术要点回顾。错误语义：默认把非 2xx 当错误抛 HTTPError，2.x 里读错误体要用 error.data 而不是 response.json。重试：对幂等方法默认重试 2 次，POST、PATCH 默认不重试，延迟是指数退避，可以加 jitter 抖动。超时分两个维度：timeout 管每次尝试，totalTimeout 管含重试的整体时长，而且 retryOnTimeout 默认是 false。hooks 五件套覆盖整条生命周期。实例体系：create 建全新的、extend 继承父默认深合并。

选型上记住一句：要轻量、贴近 fetch 标准就选 ky；需要兼容老浏览器或者必须用 CommonJS，就选 axios。

最后别忘了那个最容易踩的坑：ky 是 ESM-only，不能 require。谢谢大家。
-->
