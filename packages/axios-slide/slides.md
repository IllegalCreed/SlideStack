---
theme: seriph
background: https://cover.sli.dev
title: axios — Promise based HTTP client
info: |
  Presentation axios — a promise-based HTTP client for the browser and node.js.

  Learn more at [https://axios-http.com/docs/intro](https://axios-http.com/docs/intro)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🔌</span>
</div>

<br/>

## axios — HTTP 客户端

同时跑在浏览器与 Node.js 的、基于 Promise 的 HTTP 客户端。一套 API、底层自动切换（浏览器 XHR / Node http），把 JSON、超时、拦截器等便利层做成开箱即用

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/axios/axios" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 axios。一句话定位：一个基于 Promise 的 HTTP 客户端，同时运行在浏览器和 Node.js。版本基线是 axios 1.x，v1 引入了 AxiosHeaders、fetch 适配器、用 signal 取代 CancelToken 等。

它最大的卖点是同构：同一套 API，浏览器底层用 XMLHttpRequest，Node 底层用 http 模块，对外都是统一的 Promise 接口。相比原生 fetch，它把开发中反复要写的便利层做成开箱即用——JSON 自动序列化解析、内置 timeout、非 2xx 自动 reject、请求响应拦截器、上传下载进度、XSRF 防护。

主线：定位 → 请求与响应配置 → 实例 create 与默认 → 拦截器 → 错误处理 → 取消 → 与原生 fetch 取舍。它和 ky、ofetch 同属 HTTP 请求选型方向，今天对比时一笔带过那两者。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用它发请求

<v-clicks>

- 原生 `fetch` 要自己写「便利层」
- 非 2xx 不 reject，得手动判 `res.ok`
- 没有内置超时，要配 `AbortController` + 定时器
- 拿数据还要再 `await res.json()`

</v-clicks>

<div v-click class="mt-6">

axios 的回应：

- JSON **双向自动**转换 → 数据直接在 `res.data`
- 非 2xx **自动 reject** → 错误统一进 `catch`
- 内置 `timeout`（毫秒）→ 一个配置项搞定
- **拦截器** → 鉴权 / 全局错误集中处理

</div>

<!--
为什么要专门用 axios 而不是原生 fetch？fetch 有几个老痛点。

第一，fetch 只提供最底层能力，开发中反复要写的便利层都得自己封。第二，fetch 对非 2xx 状态码不会 reject，4xx、5xx 都算成功，你得手动判断 res.ok，很容易漏。第三，fetch 没有内置超时，要配合 AbortController 加定时器自己实现。第四，fetch 拿到响应后还要再 await res.json 才能拿到数据。

axios 针对性地回应：JSON 双向自动转换，请求对象自动 stringify、响应自动 parse 到 res.data；非 2xx 默认 reject，错误统一进 catch；内置 timeout，一个配置项就行；还有拦截器，把鉴权注入和全局错误处理集中起来。这四点就是它存在的理由。
-->

---

# 三种发请求的写法

```js
import axios from "axios";

// ① 别名形式（最常用）
axios.get("/users");

// ② 通用 config 形式
axios({ method: "get", url: "/users" });

// ③ url + 可选 config 形式
axios("/users");
```

<v-clicks>

- 别名：`get` / `post` / `put` / `patch` / `delete` / `head` / `options`
- 所有方法都返回 **Promise**，可 `await` 也可 `.then().catch()`
- 自带 TS 类型，**无需** `@types/axios`

</v-clicks>

<!--
发请求有三种等价写法。第一种是别名形式，最常用，比如 axios.get、axios.post，按 HTTP 方法各有一个别名，除了增删改查还有 head、options。第二种是通用 config 形式，把 method 和 url 都写进一个配置对象，适合方法是动态的场景。第三种是直接传 url 加可选 config。

不管哪种写法，所有方法都返回 Promise，既能 await，也能 then catch 链式。

安装就是 npm install axios，pnpm、yarn、bun 同理。要特别说的是，axios 自带 TypeScript 类型声明，不需要再装 @types/axios，装了反而可能冲突。
-->

---

# 响应对象：数据在 res.data

```js
const res = await axios.get("/user/12345");
// res 是 AxiosResponse：
// {
//   data,        // 响应体（JSON 已自动解析）← 业务数据在这
//   status,      // 状态码 200
//   statusText,  // 'OK'
//   headers,     // 响应头（小写键；v1 为 AxiosHeaders）
//   config,      // 本次请求配置
//   request,     // 底层请求对象（XHR / ClientRequest）
// }
```

<div v-click class="mt-2 text-sm">

> ⚠️ `await axios.get(...)` 拿到的是**完整响应对象**，业务数据要从 `res.data` 取——不像 fetch 还要再 `await res.json()`。读响应头用小写键，或 `headers.get('Content-Type')`（大小写不敏感）。

</div>

<!--
拿到响应后，要记住最关键的一点：await axios.get 拿到的不是数据本身，而是一个完整的响应对象 AxiosResponse。

它的结构里，data 是服务端返回的响应体，JSON 已经自动解析好了，业务数据就在这里。status 是状态码，statusText 是状态文本，headers 是响应头，config 是本次请求用的配置，request 是底层请求对象。

这是初学者最容易踩的坑：很多人直接拿 res 当数据用，其实数据在 res.data。这一点和 fetch 不同，fetch 拿到 Response 后还要再 await res.json。

读响应头时别假设原始大小写，用小写键比如 content-type，或者用 AxiosHeaders 的 get 方法，它大小写不敏感。
-->

---

# 查询参数与请求体

```js
// 查询串：用 params 对象，自动序列化并编码
axios.get("/list", { params: { page: 2, q: "hello world" } });
//=> GET /list?page=2&q=hello%20world

// 请求体：post(url, data, config) 第二参数即 body
axios.post("/users", { name: "Tom", age: 18 });
//=> 自动 JSON.stringify + Content-Type: application/json
```

<div v-click>

```js
// ⚠️ DELETE 没有 data 参数位，带 body 要放进 config
axios.delete("/items/1", { data: { reason: "expired" } });
```

</div>

<!--
传参数分两类。查询串用 config 的 params 对象，axios 会自动序列化并做 URL 编码拼到地址上，比如 page 等于 2、q 等于 hello world，会被正确编码。不要手动拼字符串，容易漏编码。params 也能传 URLSearchParams 实例。

请求体看方法。post、put、patch 的第二个参数就是 body，传一个普通对象，axios 会自动 JSON.stringify 并带上 application/json 的 Content-Type。

有个高频坑是 DELETE。axios.delete 的签名是 url 加 config，没有独立的 data 参数位。要带请求体必须放进 config 的 data 字段，像底下这样写。如果像 post 那样把第二参数直接当 body 传是错的。
-->

---

# 用 axios.create 封装实例

```js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
  headers: { "X-Client": "web" },
});

api.get("/users"); // → GET https://api.example.com/users
```

<div v-click class="mt-2 text-sm">

> 真实项目几乎不裸用全局 `axios`，而是按服务/模块建实例：每个实例有**独立的** `defaults` 与 `interceptors`，互不影响。

</div>

<!--
真实项目里几乎不会裸用全局 axios，而是用 axios.create 按服务或模块建实例，把公共配置集中起来。

比如建一个 api 实例，设 baseURL、timeout、公共 headers。之后所有请求复用这些默认，写相对路径就会自动拼到 baseURL 后面。

为什么优先用实例？两个原因。第一是隔离：每个实例有独立的 defaults 和 interceptors，互不影响，一个后端服务一个实例，配置不会串。第二个原因下一页讲安全，这里先记住——按服务建实例是 axios 的标准封装姿势。
-->

---

# 配置三级合并

axios 把配置按优先级**从低到高**合并，后者覆盖前者：

```text
① 库内置默认 (lib/defaults)
        ↓ 被覆盖
② 实例的 defaults 属性
        ↓ 被覆盖
③ 单次请求传入的 config
```

```js
const api = axios.create();        // timeout 是库默认 0
api.defaults.timeout = 2500;       // 实例默认：所有请求 2.5s
api.get("/slow", { timeout: 5000 }); // 单次覆盖：这一次 5s
```

<!--
配置是怎么生效的？axios 把配置按优先级从低到高三级合并，后者覆盖前者。

第一级是库内置默认，比如 timeout 默认是 0。第二级是实例的 defaults 属性，覆盖库默认。第三级是单次请求传入的 config，优先级最高。

看例子：create 出来时 timeout 是库默认 0；给实例的 defaults.timeout 设 2500，这个实例所有请求都是 2.5 秒；某一次请求又传 timeout 5000，这一次就是 5 秒，盖过实例默认。

记忆口诀：越靠近这一次请求的配置，优先级越高。headers 的合并更细致一些，会按 common、具体方法、单次分层合并。
-->

---

# 全局默认易踩的坑

```js
// ❌ 全局默认：发给所有域名（含第三方）
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

// ✅ 实例默认：鉴权限定在该服务内
const api = axios.create({
  baseURL: "https://api.example.com",
});
api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
```

<div v-click class="mt-3 text-sm">

> 在全局 `axios.defaults` 上设鉴权头，会发给**所有域名**的请求——包括你调用的第三方接口，可能把 token 泄漏出去。用实例默认隔离。

</div>

<!--
承接上一页，讲一个最容易泄密的坑。

很多人图方便，在全局 axios.defaults.headers.common.Authorization 上设鉴权头。问题是：全局默认会作用于所有用这个 axios 发的请求，包括你调用的第三方接口。也就是说，你的 token 会被原样发给第三方域名，这是实打实的凭据泄漏。

正确做法是用实例默认。建一个绑定 baseURL 的实例，把 Authorization 设在这个实例的 defaults 上，鉴权头就只发给自己的后端，不会外泄。

这就是上一页说的第二个原因：实例不只是组织代码，更是安全边界。一个外部服务一个实例，鉴权各管各的。
-->

---

# 请求拦截器：统一注入

请求拦截器在请求真正发出**前**执行——注入鉴权、加时间戳、开 loading 的标准位置：

```js
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config; // 必须返回 config
  },
  (error) => Promise.reject(error)
);
```

<div v-click class="mt-2 text-sm">

> `use(onFulfilled, onRejected)` 返回一个数字 id，可 `eject(id)` 移除，或 `clear()` 清空该类全部拦截器。

</div>

<!--
拦截器是 axios 最有价值的能力之一，分请求和响应两类。

请求拦截器在请求真正发出之前执行，是注入鉴权头、统一加时间戳、打开 loading 的标准位置。用 interceptors.request.use 注册，第一个回调拿到 config，做完修改后必须返回 config，否则请求就发不出去了；第二个回调处理这一阶段的错误。

例子里从 localStorage 取 token，有就写进 Authorization 头，然后 return config。

use 会返回一个数字 id，需要时用 eject 按 id 移除某个拦截器，或者 clear 清空这一类的全部拦截器。这在动态增删拦截器、或测试清理时有用。
-->

---

# 响应拦截器：统一收口

响应拦截器在 `then/catch` **前**执行，第一个回调处理成功、第二个处理失败：

```js
api.interceptors.response.use(
  (response) => {
    return response.data; // 可在此精简，只回传 data
  },
  (error) => {
    if (error.response?.status === 401) {
      // redirectToLogin();  401 统一跳登录
    }
    return Promise.reject(error); // 把错误继续抛给业务
  }
);
```

<!--
响应拦截器在业务的 then、catch 之前执行，用来统一收口。同样两个回调：第一个处理成功响应，第二个处理失败。

成功回调里常做的是精简数据，比如直接 return response.data，这样业务侧 await 拿到的就是数据本身，不用每次写 .data。要不要这么做看团队约定，好处是简洁，代价是丢了 status、headers 这些元信息。

失败回调是全局错误处理的黄金位置：比如统一判断 401 就跳登录，或者统一弹错误提示。处理完记得 return Promise.reject(error)，把错误继续抛给业务的 catch，否则错误会被吞掉。
-->

---

# 拦截器执行顺序（高频考点）

| 拦截器 | 顺序 | 记忆 |
|---|---|---|
| **请求**拦截器 | 逆序 LIFO（后注册先执行） | 像入栈，越晚加越先跑 |
| **响应**拦截器 | 顺序 FIFO（先注册先执行） | 像出队，按注册次序加工 |

```js
// 请求拦截器专属选项
api.interceptors.request.use(fn, errFn, {
  synchronous: true,                           // 同步执行，减少延迟
  runWhen: (config) => config.method === "get", // false 则跳过
});
```

<!--
这是 axios 面试最容易答错的点：多个拦截器的执行顺序。

请求拦截器是逆序，LIFO，后注册的先执行。响应拦截器是顺序，FIFO，先注册的先执行。

怎么记？把请求拦截器想成入栈：越晚加的越贴近真正发请求那一刻，所以越先执行。响应回来后像出队：按注册顺序逐个加工。一句话——请求像栈、响应像队。

另外请求拦截器还有两个专属选项。synchronous 设 true 让它同步执行，减少异步包装带来的微小延迟。runWhen 是条件函数，返回 false 就跳过这个拦截器，比如只对 GET 生效。这两个选项只有请求拦截器支持。
-->

---

# 错误处理：三分支

axios 默认把状态码**不在 2xx** 的响应当错误 reject（4xx、5xx 都进 catch）：

```js
try {
  await axios.get("/user/12345");
} catch (error) {
  if (error.response) {
    // ① 服务器有响应，但状态码非 2xx
    console.log(error.response.status, error.response.data);
  } else if (error.request) {
    // ② 请求已发出，但没收到响应（断网、超时）
    console.log(error.request);
  } else {
    // ③ 设置请求时就出错了
    console.log("Error", error.message);
  }
}
```

<!--
错误处理是 axios 比 fetch 更顺手的地方。axios 默认把状态码不在 2xx 范围的响应当错误 reject，4xx、5xx 都会进 catch，不用像 fetch 那样手动判 res.ok。

catch 里的 error 分三个分支。第一，error.response 存在：服务器有响应但状态码非 2xx，这时能拿到 response.status 和 response.data，这是最常见的业务错误。第二，error.request 存在但没有 response：请求已经发出去了，但没收到响应，典型是断网、超时。第三，前两个都没有：在设置请求阶段就出错了，比如配置写错，看 error.message。

这个三分支模型很清晰，比 fetch 的错误处理直观得多。
-->

---

# 错误码与类型守卫

```js
import axios from "axios";
try {
  await axios.get("/user/1");
} catch (e) {
  if (axios.isAxiosError(e)) {
    // e 被收窄为 AxiosError，可安全取 code / response
    console.log(e.code, e.response?.status);
  }
}
```

| `error.code` | 含义 |
|---|---|
| `ERR_BAD_REQUEST` / `ERR_BAD_RESPONSE` | 4xx / 5xx 响应 |
| `ERR_NETWORK` | 网络 / CORS 错误 |
| `ECONNABORTED` / `ETIMEDOUT` | 超时（默认 / 需 clarifyTimeoutError） |
| `ERR_CANCELED` | 请求被取消 |

<!--
判断错误类型有两个要点。

第一是类型守卫。用 axios.isAxiosError 包一层，TypeScript 下它会把 error 从 unknown 收窄为 AxiosError，之后取 code、response 就是类型安全的。比 instanceof 在多实例、打包场景更可靠，也有具名导出的 isAxiosError 可用。

第二是认识常见错误码。ERR_BAD_REQUEST 是 4xx 响应，ERR_BAD_RESPONSE 是 5xx；ERR_NETWORK 是网络或 CORS 错误；超时默认报 ECONNABORTED，如果想区分出更明确的 ETIMEDOUT，要开 transitional 的 clarifyTimeoutError；ERR_CANCELED 是请求被主动取消。

把这几个码记住，错误分类、埋点上报、用户提示就都能精确处理。
-->

---

# 超时

```js
// 单位毫秒；默认 0 表示「不限时」
const res = await axios.get("/slow", { timeout: 5000 });
```

<v-clicks>

- 默认 `timeout: 0` —— **不限时**，卡住的请求会一直挂着
- **生产环境强烈建议显式设** timeout
- 超时默认抛 `ECONNABORTED`
- 想拿到 `ETIMEDOUT`：设 `transitional.clarifyTimeoutError: true`

</v-clicks>

<!--
超时单独拿一页强调，因为它有个危险的默认值。

timeout 单位是毫秒，写在 config 里。但它的默认值是 0，0 表示不限时——也就是说，如果后端卡住、网络半死不活，这个请求会永远挂着，既不成功也不失败，连带占着连接和内存。

所以生产环境强烈建议每个请求都显式设 timeout，可以在实例 defaults 上统一设一个合理值，比如 10 秒。

超时触发时，默认抛的错误码是 ECONNABORTED，它和浏览器主动中止共用这个码。如果想在超时时拿到更明确的 ETIMEDOUT，设 transitional 的 clarifyTimeoutError 为 true。
-->

---

# 取消请求：AbortController

v0.22.0 起用 fetch 风格的 `AbortController`——把 `signal` 传进 config，调 `abort()` 即取消：

```js
const controller = new AbortController();

axios
  .get("/foo/bar", { signal: controller.signal })
  .catch((err) => {
    if (axios.isCancel(err)) {
      console.log("已取消"); // 主动取消：静默处理
    }
  });

controller.abort(); // 组件卸载 / 用户切走时取消
```

<!--
取消请求是 axios 现代化的重点。v0.22.0 起，axios 用 fetch 风格的 AbortController 取消请求。

用法三步：new 一个 AbortController，把它的 signal 传给请求 config 的 signal 字段，需要取消时调 controller.abort。

被取消的请求会 reject 一个 CanceledError，错误码是 ERR_CANCELED。在 catch 里用 axios.isCancel 判断，如果是主动取消就静默处理，别当成真实错误去弹提示——用户切走页面时弹一堆报错体验很差。

典型场景就是组件卸载、用户切走、或者搜索框快速输入时取消上一次请求。
-->

---

# 一个 signal 取消多个 + 弃用提醒

```js
const controller = new AbortController();

// 同一个 signal 传给多个并发请求
axios.get("/a", { signal: controller.signal });
axios.get("/b", { signal: controller.signal });

controller.abort(); // 一次性取消「该页所有在途请求」
```

<div v-click class="mt-3 text-sm">

> ⚠️ 旧的 `CancelToken`（`CancelToken.source()`）**自 v0.22.0 起已弃用**，新代码不要再用——它基于已被撤回的 TC39 提案。若 signal 在请求开始前就已 aborted，请求会立即取消、不发出。

</div>

<!--
AbortController 还有个很实用的能力：一个 signal 可以取消多个请求。

把同一个 controller.signal 传给多个并发请求，调用一次 controller.abort，会同时取消全部。这正是离开页面时一次性取消该页所有在途请求的常用模式，特别干净。补充一点：如果 signal 在请求开始前就已经 aborted，请求会被立即取消、根本不会真正发出。

最后一个重要提醒：旧的取消方式 CancelToken，也就是 CancelToken.source 那一套，自 v0.22.0 起已经弃用了。它基于一个已经被撤回的 TC39 cancellable promises 提案。老代码里可能还见得到，但新代码一律用 AbortController，别再写 CancelToken。
-->

---

# AxiosHeaders：v1 的头操作

v1 引入 `AxiosHeaders` 类，大小写不敏感，**取代**直接给 headers 对象赋值的旧写法：

```js
import axios from "axios";

const headers = new axios.AxiosHeaders();
headers.set("Content-Type", "application/json");
headers.setAuthorization("Bearer xxx");
headers.get("content-type"); // 大小写不敏感
headers.has("Authorization"); // true
headers.delete("X-Temp");
```

<div v-click class="mt-2 text-sm">

> ⚠️ **规范化时机陷阱**：`config.headers` 真正变成 AxiosHeaders 发生在**适配器内部**，即请求拦截器**之后**。拦截器里它可能还是普通对象，过早调 `setContentType()` 会报「不是函数」。

</div>

<!--
v1 引入了 AxiosHeaders 类，统一头操作，提供 set、get、setContentType、setAuthorization、has、delete 等方法，而且大小写不敏感。它取代了直接给 headers 普通对象赋值的旧写法，旧写法已被标注弃用。

但这里有个隐蔽的陷阱，很多人栽过：在请求拦截器里调 config.headers.setContentType 报错说不是函数。原因是——config.headers 真正被规范化成 AxiosHeaders 实例，是发生在适配器内部，也就是请求拦截器执行之后。所以在拦截器里，config.headers 可能还是个普通对象，过早调实例方法就会失败。

稳妥做法有几种：用 axios.AxiosHeaders.from 在拦截器里显式转一次再调方法；或者轻量场景直接用属性赋值 config.headers 中括号 Content-Type；或者把头配在实例 defaults 上，那里已经被规范化了。
-->

---

# 表单与文件上传

```js
// 表单编码 application/x-www-form-urlencoded
const params = new URLSearchParams();
params.append("username", "tom");
axios.post("/login", params);

// 文件上传 multipart/form-data
const fd = new FormData();
fd.append("file", fileInput.files[0]);
axios.post("/upload", fd);
// ❌ 不要手动设 Content-Type！自动推断的才带正确 boundary
```

<div v-click class="mt-2 text-sm">

> 默认发 JSON。表单编码用 `URLSearchParams`；文件用 `FormData`，axios 自动设带 `boundary` 的头。也有 `postForm` / `getForm` 快捷方法自动序列化。

</div>

<!--
axios 默认发 JSON，但常常要发别的格式。

发表单编码，也就是 x-www-form-urlencoded，最简单的方式是用 URLSearchParams，append 字段后直接 post，axios 会自动带上对应的 Content-Type。

上传文件用 multipart/form-data：把字段塞进 FormData 实例后直接 post。关键一点——千万不要手动设 Content-Type。多部分表单的头里需要一个 boundary 分隔符，只有 axios 自动推断的才带正确的 boundary，你手写一个不含 boundary 的字符串会破坏边界，导致服务端解析失败。

另外还有 postForm、getForm 这类快捷方法，能把普通对象自动序列化成 FormData 或 urlencoded，省去手动构造。
-->

---

# 上传 / 下载进度

```js
axios.post("/upload", fd, {
  onUploadProgress: (e) => {
    if (e.total) {
      const percent = Math.round((e.loaded / e.total) * 100);
      console.log(`上传 ${percent}%`);
    }
  },
});

axios.get("/big-file", {
  responseType: "blob", // 浏览器下载二进制
  onDownloadProgress: (e) => console.log("已下载：", e.loaded),
});
```

<div v-click class="mt-2 text-sm">

> 进度事件含 `loaded` / `total` / `progress` / `rate`（速度）/ `estimated`（预计剩余）。下载二进制记得设 `responseType`：浏览器用 `blob`，Node 用 `arraybuffer` / `stream`。

</div>

<!--
进度是 axios 相比 fetch 又一个开箱即用的便利。

上传进度用 onUploadProgress 回调，事件对象里 loaded 是已传字节、total 是总字节，注意 total 可能为空要先判断，算出百分比就能驱动进度条。

下载进度用 onDownloadProgress，同理。下载二进制文件时记得设 responseType：浏览器用 blob，Node 端用 arraybuffer 或 stream。

进度事件除了 loaded、total，还带 progress 进度比例、rate 速度、estimated 预计剩余时间等字段，做一个完整的上传体验完全够用。这些用原生 fetch 实现起来相当麻烦。
-->

---

# 与原生 fetch 怎么选

| 场景 | 更合适 |
|---|---|
| 极度在意打包体积、只发简单请求 | **fetch**（原生零体积） |
| 只暴露 fetch 的运行时（Workers / edge / Deno） | **fetch** 或 axios fetch 适配器 |
| 需要拦截器集中注入 token / 全局错误 | **axios** |
| 内置超时、自动 JSON、非 2xx 自动 reject | **axios** |
| 上传 / 下载进度、带宽限速 | **axios** |
| 团队已有大量 axios 封装与约定 | **axios** |

<!--
那到底什么时候该用 axios、什么时候该用原生 fetch？看这张表。

适合 fetch 的：第一，极度在意打包体积、又只发几个简单请求，fetch 是浏览器原生、零体积。第二，运行在只暴露 fetch 没有 XHR 的环境，比如 Service Worker、Cloudflare Workers、Deno、edge runtime——不过这种情况也可以用 axios 的 fetch 适配器，后面会讲。

适合 axios 的：需要拦截器集中注入 token 或做全局错误处理；需要内置超时、自动 JSON、非 2xx 自动 reject 这些便利层；需要上传下载进度、Node 端带宽限速；以及团队已经有大量 axios 封装和约定时，没必要为省一点体积重写。

按体积敏感度、运行环境、所需便利层三个维度权衡就行。
-->

---

# fetch 适配器：兼容性兜底

v1 起底层可切，`adapter` 接受字符串、函数或数组（按优先级回退）：

```js
import axios from "axios";

// 在只有 fetch 的运行时里沿用 axios 全套
axios.get("/x", { adapter: "fetch" });

// 数组：取第一个可用的
axios.get("/x", { adapter: ["fetch", "xhr", "http"] });
```

| 取值 | 底层 | 典型场景 |
|---|---|---|
| `'xhr'` | XMLHttpRequest | 浏览器（默认） |
| `'http'` | Node http/https | 服务端（默认） |
| `'fetch'` | 原生 fetch | Workers / Deno / edge |

<!--
接着上一页的伏笔，讲 fetch 适配器。v1 起 axios 的底层实现可以切换，通过 adapter 配置项，它接受字符串、函数，也可以传一个数组按优先级回退。

三个内置取值：xhr 走 XMLHttpRequest，是浏览器默认；http 走 Node 的 http、https 模块，是服务端默认；fetch 走原生 fetch。

fetch 适配器的价值在于环境兼容：在只暴露 fetch、没有 XHR 的运行时里，你依然能用 axios 的拦截器、配置、错误模型这一整套，而不用换库。传数组比如 fetch、xhr、http，就是取第一个可用的，做优雅降级。

要强调的是，fetch 适配器是为了兼容，不保证比 XHR 更快。你也可以传一个自定义函数当适配器，用来做 mock 或特殊传输。
-->

---

# 安全护栏

```js
// ① XSRF：v1 跨域发 XSRF 头要显式开 withXSRFToken
axios.get("/u", { withCredentials: true, withXSRFToken: true });

// ② 日志脱敏：redact 防 error.toJSON() 明文打印密钥
axios.get("/u", {
  headers: { Authorization: "Bearer secret" },
  redact: ["authorization"], // → '[REDACTED ****]'
});
```

<v-clicks>

- 默认读 `XSRF-TOKEN` cookie → 写 `X-XSRF-TOKEN` 头（同源才发）
- `formSerializer.maxDepth`（默认 100）防深层嵌套**爆栈 / DoS**

</v-clicks>

<!--
axios 内置了几道安全护栏，值得了解。

第一是 XSRF，也就是 CSRF 防护。浏览器端默认读 XSRF-TOKEN 这个 cookie，写到 X-XSRF-TOKEN 请求头。要注意 v1 的一个行为变化：v0.x 时只要 withCredentials 为 true，跨域也会隐式发 XSRF 头；v1 起跨域发 XSRF 头需要显式开 withXSRFToken。默认值下只有同源请求才发。

第二是日志脱敏 redact。把敏感 key 比如 authorization 列进去，error.toJSON 时这些字段会被打码成 REDACTED，避免密钥在错误日志里明文泄漏，大小写不敏感、任意深度匹配。

第三是 formSerializer.maxDepth，把对象序列化成 FormData 时限制最大嵌套深度，默认 100，超限抛错。这是防止深层嵌套的 payload 触发递归爆栈，本质是一道 DoS 护栏。
-->

---

# 核心不内置：重试与缓存

axios **核心不含**自动重试与响应缓存，靠生态插件补：

```js
import axios from "axios";
import axiosRetry from "axios-retry";

const api = axios.create();
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay, // 指数退避
  retryCondition: (err) =>
    axiosRetry.isNetworkOrIdempotentRequestError(err),
});
```

<div v-click class="mt-2 text-sm">

> 响应缓存用 `axios-cache-interceptor`。也可在响应拦截器 `onRejected` 里自实现重试（带次数上限 + 退避）。

</div>

<!--
有两个能力 axios 核心是不内置的，要靠生态，常被误以为自带。

第一是自动重试。axios 本体没有，主流补法是 axios-retry 插件：把它套在实例上，配 retries 重试次数、retryDelay 用内置的指数退避、retryCondition 决定哪些错误该重试，比如内置的判断网络错误或幂等请求错误。这样网络抖动时能自动重发。

第二是响应缓存，用 axios-cache-interceptor 插件。

如果不想引插件，也能自己实现：在响应拦截器的 onRejected 回调里判断是可重试的错误，就用相同的 config 重发，记得加次数上限和退避，否则可能无限重试打垮后端。

记住这条边界：重试、缓存不在 axios 本体内，是社区插件。
-->

---
layout: intro
---

# 总结

axios = **同构、Promise、便利层开箱即用**的 HTTP 客户端

- 请求：三种写法，数据在 `res.data`，`params` 传查询串
- 实例：`create` 隔离 `defaults` / `interceptors`，鉴权别上全局
- 拦截器：请求 LIFO、响应 FIFO（高频考点）
- 错误：非 2xx 自动 reject，`response`/`request`/setup 三分支
- 取消：`AbortController` + `signal`（`CancelToken` 已弃用）
- 取舍：体积敏感 / 纯 fetch 环境用 fetch，要便利层用 axios

<!--
最后总结。

axios 的本质是一个同构、基于 Promise、便利层开箱即用的 HTTP 客户端。

发请求三种写法，记住数据在 res.data，查询串用 params。封装上用 create 建实例隔离 defaults 和 interceptors，鉴权头一定别上全局默认，会泄漏给第三方。

拦截器是高频考点：请求拦截器逆序 LIFO，响应拦截器顺序 FIFO，请求像栈、响应像队。错误处理上，非 2xx 自动 reject，catch 里分 response、request、setup 三个分支，配合 isAxiosError 做类型守卫。取消请求用 AbortController 加 signal，旧的 CancelToken 已弃用。

最后的取舍：极度在意体积或运行在纯 fetch 环境，用原生 fetch；需要拦截器、内置超时、自动 JSON、进度这些便利层，用 axios。重试和缓存记得靠 axios-retry、axios-cache-interceptor 等插件。谢谢大家。
-->
