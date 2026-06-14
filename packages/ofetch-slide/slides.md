---
theme: seriph
background: https://cover.sli.dev
title: ofetch — A Better Fetch API
info: |
  Presentation ofetch — unjs 出品、基于原生 fetch 的同构 HTTP 封装，Nuxt $fetch 的底层。

  Learn more at [https://github.com/unjs/ofetch](https://github.com/unjs/ofetch)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🐢</span>
</div>

<br/>

## ofetch — A Better Fetch API

基于原生 `fetch` 的**同构**封装：自动解析、自动序列化、非 2xx 抛错、内置重试与拦截器。Nuxt 的全局 `$fetch` 就是它

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/unjs/ofetch" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 ofetch，unjs 团队出品的 HTTP 请求库。官方定位一句话：A better fetch API，works on node、browser and workers。

关键认知：它不是另起炉灶的网络栈，底层就是原生 fetch，只是把 fetch 难用的地方补齐了——自动解析响应、自动序列化 body、非 2xx 自动抛错、内置重试和拦截器。

还有一个身份很重要：Nuxt 里到处用的全局 $fetch，就是 ofetch。学会它约等于学会 Nuxt 数据请求的底座。

主线：fetch 的痛点 → 自动解析 → 自动序列化 → 抛错 → query/baseURL → create → 重试 → 超时 → 拦截器 → 与 axios/ky 取舍 → Nuxt → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 原生 fetch 的痛点

<v-clicks>

- 取数据要两步：`fetch().then(r => r.json())`
- 404 / 500 **不报错**，得自己查 `response.ok`
- POST 对象要手动 `JSON.stringify` + 设头
- 没有内置 retry / timeout
- 没有拦截器，鉴权逻辑到处复制

</v-clicks>

<div v-click class="mt-6">

ofetch 的回应：

- 自动解析 → **一步拿数据**
- 非 2xx → **自动抛 FetchError**
- 对象 body → **自动序列化**
- 内置 **retry / timeout / 拦截器**

</div>

<!--
为什么需要 ofetch？因为原生 fetch 虽然是标准，但用起来有不少痛点。

第一，取数据要两步，先 await fetch 再 await r.json。第二，最反直觉的——404、500 这种 HTTP 错误，fetch 不会进 catch，它认为请求成功了，你必须自己查 response.ok。第三，POST 一个对象，得自己 JSON.stringify，还要手动设 content-type。第四，没有内置的重试和超时。第五，没有拦截器，注入 token、统一错误处理这些逻辑只能到处复制。

ofetch 针对性地回应这五点：自动解析一步拿数据；非 2xx 自动抛 FetchError；对象 body 自动序列化；内置 retry、timeout、拦截器。这就是今天的主线。
-->

---

# 自动解析：一步拿数据

```js
import { ofetch } from 'ofetch'

// 原生 fetch：两步
const data1 = await fetch('/api/user').then(r => r.json())

// ofetch：一步，自动按 content-type 解析
const data2 = await ofetch('/api/user')   // 直接是对象
```

<v-clicks>

- 默认按响应 `content-type` 智能判断：JSON → 对象、text → 字符串
- 解析器是 `destr`：非法 JSON **不抛错**，退回原始字符串
- 要原始 `Response` → `ofetch.raw(url)`，数据在 `_data`

</v-clicks>

<!--
第一个核心能力，自动解析。

看代码对比。原生 fetch 要两步：await fetch 拿到 Response，再 await r.json 解析。ofetch 一步，await ofetch 直接拿到解析后的对象，不用再 .json。

它默认按响应的 content-type 智能判断解析方式：application 斜杠 json 解析成对象，text 开头解析成字符串，其它走 blob。

解析器用的是 destr，比 JSON.parse 鲁棒：遇到非法 JSON 不会抛 SyntaxError，而是原样返回字符串，所以不会因为后端返回个空字符串就崩。

如果你既要数据又要状态码和响应头，用 ofetch.raw，它返回完整 Response，解析后的数据在 _data 字段。
-->

---

# 自动序列化 body

```js
// POST 传普通对象 → 自动 JSON.stringify + 补头
await ofetch('/api/user', {
  method: 'POST',
  body: { name: 'foo', age: 18 },
})
// 自动设 content-type: application/json
//        accept:       application/json
```

<v-clicks>

- 只有**可序列化对象 / 数组**才自动 JSON 化
- `FormData` / `URLSearchParams` / `Blob` / 流 → **原样发送**
- 流 body 还会自动设 `duplex: 'half'`（规范要求）

</v-clicks>

<!--
第二个核心能力，自动序列化 body。

POST 传一个普通对象，ofetch 自动帮你 JSON.stringify，并且在你没设 content-type 时，自动补上 content-type 等于 application 斜杠 json，同时补 accept 等于 application 斜杠 json，既声明我发的是 JSON，也声明我想要 JSON。

注意边界：只有可 JSON 序列化的对象和数组才会被自动 JSON 化。如果你传的是 FormData、URLSearchParams、Blob 或者流，ofetch 不会动它们，原样发送，由运行时去设 multipart 边界这些。

特别地，如果 body 是 ReadableStream 或 Node 流，ofetch 还会自动设 duplex 等于 half，这是 Fetch 规范对流式请求体的要求，不设部分运行时会报错。
-->

---

# 非 2xx 自动抛错

```js
import { ofetch, FetchError } from 'ofetch'

try {
  await ofetch('/api/not-found')
} catch (err) {
  err.message     // [GET] "/api/not-found": 404 Not Found
  err.data        // 服务端错误体（已解析）
  err.status      // 404
}
```

<div v-click class="mt-2 text-sm">

> 修正了 fetch「404/500 也算成功」的反直觉。错误体在 `err.data`，**不是** `err.response.data`（axios 习惯）。

</div>

<!--
第三个核心能力，也是最能体现 better 的一点，非 2xx 自动抛错。

原生 fetch 只在网络层失败才 reject，HTTP 4xx、5xx 仍然 resolve。ofetch 改掉了这个反直觉行为：状态码落在 400 到 599，自动抛出 FetchError，于是能被 try catch 捕获。

FetchError 信息很友好：message 形如方括号 GET，引号 URL，冒号 404 Not Found，把方法、URL、状态码、状态文本拼成一句，一眼定位。

更重要的是结构化信息：err.data 是服务端返回的错误体，已经解析好；err.status 是状态码；还有 err.statusText 等。

这里给从 axios 迁移的同学一个提醒：错误体在 err.data，不是 axios 习惯的 err.response.data，别找错地方。
-->

---

# query 与 baseURL

```js
// query：对象形式，底层 ufo 拼接
await ofetch('/api/list', { query: { page: 2, size: 10 } })
// → /api/list?page=2&size=10

// 与 URL 已有 query 合并（不是覆盖）
await ofetch('/api/list?b=2', { query: { a: 1 } })
// → /api/list?b=2&a=1
```

<v-clicks>

- `params` 是 `query` 的**已废弃别名**，推荐用 `query`
- `baseURL` 同样由 ufo 智能拼接，不会出现双斜杠

</v-clicks>

<!--
第四个能力，query 和 baseURL。

加查询串不用自己拼字符串，用 query 选项传对象，底层用 unjs 的 ufo 库拼接并编码。比如 query 传 page 2、size 10，得到问号 page=2&size=10。

而且是合并语义：如果 URL 上本身写了 b=2，再用 query 传 a=1，结果是 b=2&a=1 两个都在，不是互相覆盖。这让你能在 URL 写死一部分、再动态补充。

提一句，params 是 query 的已废弃别名，老代码可能还在用，新代码推荐 query。

baseURL 也是 ufo 智能拼接，会正确处理斜杠，不会因为 baseURL 结尾和路径开头都有斜杠就拼出双斜杠。
-->

---

# create：实例化复用

```js
const api = ofetch.create({
  baseURL: 'https://x.com/api',
  headers: { 'X-App': 'demo' },
  retry: 2,
  timeout: 10000,
})

await api('/users')        // → https://x.com/api/users，套用全部默认
await api('/users/1', { method: 'DELETE' })
```

<div v-click class="mt-3 text-sm">

> 类似 `axios.create`。返回的实例还能再 `.create()` 派生子实例，**继承并合并**父默认值与拦截器。

</div>

<!--
第五，实例化复用 create。

给一组 API 统一加 baseURL、公共头、重试、超时，不用每次重复传，用 ofetch.create 建一个预配置实例。之后用这个 api 发请求，自动套用所有默认值。比如 api 斜杠 users，实际请求 baseURL 加 users。

这和 axios 的 axios.create 一个思路。

而且 create 返回的实例本身还带 .create，可以做分层：基础实例放公共 baseURL 和鉴权，再派生一个子实例叠加专用头。子实例会继承父的默认值，同名普通选项子覆盖父，拦截器则合并保留，不会把父的拦截器弄丢。
-->

---

# 内置重试 retry

```js
await ofetch('/api/data')                         // GET 默认重试 1 次
await ofetch('/api/create', { method: 'POST' })   // POST 默认 0 次

await ofetch('/api/flaky', {
  retry: 3,
  retryDelay: 500,
  retryStatusCodes: [429, 503],
})
```

<v-clicks>

- 默认 `retryStatusCodes`：`408 409 425 429 500 502 503 504`
- **写方法默认不重试**（防重复提交）；显式 `retry: n` 则所有方法都按 n

</v-clicks>

<!--
第六，内置重试。

ofetch 自带 retry。默认次数有讲究：GET、HEAD 这类读方法默认重试 1 次；POST、PUT、PATCH、DELETE 这类写方法默认 0 次，因为它们往往非幂等，自动重试可能导致重复下单、重复扣款。

你可以显式配：retry 3 次，retryDelay 间隔 500 毫秒，retryStatusCodes 指定只对哪些状态码重试。

默认会触发重试的状态码是 408、409、425、429、500、502、503、504，覆盖超时、冲突、限流、5xx 网关错误这些重试可能有救的场景。注意 404、401、400 不在默认列表，语义明确的客户端错误重试没意义。

关键一点：一旦你显式给 retry 等于某个数字，就对所有方法一视同仁，POST 也会按这个次数重试，这时你得自己保证幂等。
-->

---

# retryDelay：指数退避

```js
await ofetch('/api/rate-limited', {
  retry: 5,
  retryDelay: (context) => {
    // 1s, 2s, 4s, 8s, 16s
    const attempt = 5 - (context.options.retry || 0)
    return Math.pow(2, attempt) * 1000
  },
})
```

<div v-click class="mt-3 text-sm">

> `retryDelay` 可为数字或 `(context) => number`。重试是**完整重走流程**，每次都会重新触发拦截器。

</div>

<!--
retryDelay 单独说一下，因为它能做指数退避。

retryDelay 除了给固定数字，还能给一个函数，签名是接收 context、返回毫秒数。利用 context.options.retry 这个剩余次数，可以算出当前是第几次重试，返回 2 的 attempt 次方乘以 1000，就实现了 1 秒、2 秒、4 秒、8 秒、16 秒的指数退避，对付限流接口很有用。

这里有个容易忽略的实现细节：ofetch 的重试是把 retry 减 1，然后完整重走一遍请求流程。也就是说，每次重试都会重新触发 onRequest、onResponse 这些拦截器。所以如果你的拦截器里有副作用，比如打日志、生成带时间戳的 token，要考虑这种重复执行。
-->

---

# 内置超时 timeout

```js
try {
  await ofetch('/api/slow', { timeout: 5000 })  // 5 秒（毫秒！）
} catch (err) {
  // 超时表现为 abort
}
```

<v-clicks>

- 单位**毫秒**，内部用 `AbortController` 到时中断
- 原生 fetch 没有 timeout，得自己搭 controller + setTimeout
- 也可同时传自己的 `signal` 做手动中断

</v-clicks>

<!--
第七，内置超时 timeout。

原生 fetch 没有超时选项，想做超时得自己搭 AbortController 加 setTimeout，挺繁琐。ofetch 把这套封装好了：传 timeout 5000，5 秒后自动中断请求。

强调一遍单位是毫秒，写 5000 是 5 秒，别写成 5，那是 5 毫秒，几乎必然立即超时。

内部实现就是一个 AbortController，到时调用 abort。你也可以同时传自己的 signal，做手动中断，两者可以并存。

有个进阶的边界：因为 timeout 设了，timeout 触发的中断在重试逻辑里仍会被重试；而你纯手动 abort、没设 timeout 的，会被识别为用户主动取消，不重试。
-->

---

# 拦截器：四个钩子

```js
const api = ofetch.create({
  onRequest({ options }) {       // 发出前
    options.headers.set('Authorization', token())
  },
  onResponse({ response }) {     // 收到响应并解析后
    log(response.status, response._data)
  },
  onResponseError({ response }) {// 响应非 2xx
    if (response.status === 401) logout()
  },
  onRequestError({ error }) {    // 连响应都没拿到
    report(error)
  },
})
```

<!--
第八，重头戏拦截器。ofetch 有四个钩子，都接收一个 context 对象。

onRequest，请求发出前，最常用来注入 token、改 query。onResponse，收到任意响应并解析后触发，能拿到 response 和 response._data。onResponseError，响应回来但状态非 2xx 时触发，是统一处理 401、全局错误提示的标准位置。onRequestError，连响应都没拿到、网络层就失败时触发，比如断网、DNS 失败。

记两组区分。第一组：onRequestError 和 onResponseError，区别是有没有响应——前者连服务器都没连上，后者连上了但返回错误状态。第二组：每个钩子都支持单个函数或函数数组，而且 create 默认拦截器和单次调用的同名拦截器会合并成数组依次执行，不是覆盖。
-->

---

# 拦截器：一个高频坑

```js
onRequest({ options }) {
  options.headers.set('Authorization', token)  // ✅
  // options.headers.Authorization = token      // ❌ 无效
}
```

<v-clicks>

- 进入 `onRequest` 时 `headers` 已是 **Headers 实例**
- 改头要用 `.set()` / `.append()`，直接赋属性不写入
- 想**中止请求** → 在 `onRequest` 里 `throw`（没有 return false 约定）

</v-clicks>

<!--
拦截器有个高频坑，单独拎出来讲。

很多人在 onRequest 里这样写：options.headers.Authorization 等于 token，直接点属性赋值。这是无效的。因为进入 onRequest 时，ofetch 已经把 headers 规整成了 Headers 实例，对 Headers 实例直接赋属性不会写入头部。正确写法是 options.headers.set，多值用 append。

还有一个常见疑问：怎么在拦截器里取消这次请求？ofetch 没有 return false 取消的约定，标准做法是在 onRequest 里抛出一个错误，请求就不会真正发出，会走错误流程被 catch 捕获。删 context.request 这种都不是受支持的方式。
-->

---

# 实战：401 自动刷新 token

```js
let refreshing = null
const api = ofetch.create({
  async onResponseError({ request, response, options }) {
    if (response.status === 401 && !options._retried) {
      refreshing ??= refreshToken()
        .finally(() => { refreshing = null })
      await refreshing
      return api(request, { ...options, _retried: true })
    }
  },
})
```

<div v-click class="mt-2 text-sm">

> 两个必处理点：① 加 `_retried` 标记防**死循环**；② 并发 401 只刷新一次（**去重**）。

</div>

<!--
拦截器最经典的实战，就是 401 自动刷新 token 并重发请求。看着简单，但有两个必须处理的坑，不处理线上会出事。

第一个坑，死循环。如果刷新后仍然 401，比如 refresh token 也失效了，又进 onResponseError、又刷新、又重发，无限循环。解决办法是加一个重试标记，比如 options 下划线 retried，重发时带上，进来先判断没标记才刷新。

第二个坑，并发去重。多个请求同时 401，会同时触发刷新，刷新好几次。解决办法是用一个模块级的 refreshing 变量缓存这个 Promise，用空值合并赋值，保证只刷一次，其余请求都 await 同一个 Promise，刷完再各自重发。

这段是 ofetch 封装 HTTP 层的标准模板，建议记住。
-->

---

# responseType 与 SSE

```js
const blob = await ofetch('/file.pdf', { responseType: 'blob' })
const buf  = await ofetch('/x.bin', { responseType: 'arrayBuffer' })

// SSE：text/event-stream 默认就识别为 stream
const stream = await ofetch('/sse', { responseType: 'stream' })
```

| content-type | 默认识别 |
|---|---|
| `application/...json` | json |
| `text/event-stream` | **stream**（SSE） |
| `text/*` | text |
| 其它 | blob |

<!--
说一下 responseType 和流式场景。

默认按 content-type 智能判断，但你可以强制：responseType 给 blob 拿二进制下载图片、PDF；给 arrayBuffer 拿缓冲；给 text 拿纯文本；给 stream 拿流。取值就这五种：json、text、blob、arrayBuffer、stream。

下面这张表是 ofetch 内部的识别规则，值得记。application 斜杠 json 识别为 json；特别注意 text 斜杠 event-stream，也就是 SSE，虽然是 text 开头，但被优先特判为 stream，方便你逐块消费服务端推送；其它 text 开头识别为 text；剩下的识别为 blob。

所以做 SSE 流式接收时，ofetch 默认就给你 ReadableStream，拿 reader 逐块读就行。
-->

---

# 与 axios / ky 取舍

| 维度 | ofetch | axios | ky |
|---|---|---|---|
| 底座 | fetch | XHR | fetch |
| 同构 | node/浏览器/worker | 主浏览器+node | 多环境 |
| 体积 | 极小 | 较大 | 小 |
| 重试 | 内置 | 需插件 | 内置 |
| 进度回调 | ❌ | ✅ | ❌ |
| 错误体 | `error.data` | `error.response.data` | 需自取 |

<div v-click class="mt-2 text-sm">

> ofetch 仅依赖 `destr` / `node-fetch-native` / `ufo`，是 unjs 生态默认。

</div>

<!--
选型对比，ofetch、axios、ky。

底座：ofetch 和 ky 都基于原生 fetch，axios 在浏览器端基于 XHR。同构：ofetch 强调 node、浏览器、worker 一套代码，axios 主要浏览器加 node，ky 也支持多环境。体积：ofetch 极小，只依赖 destr、node-fetch-native、ufo 三个小库，axios 较大，ky 也小。

重试：ofetch 和 ky 内置，axios 要装插件。进度回调：这是 ofetch 的短板，它没有 axios 那种 onUploadProgress、onDownloadProgress，要进度得自己用流算；axios 有。错误体位置：ofetch 在 error.data，axios 在 error.response.data，ky 要自己从 response 取。

一句话选型：吃 fetch 底座、要同构和轻量、在 Nuxt 或 unjs 生态里，选 ofetch；要上传进度、要庞大生态，选 axios；纯前端、喜欢 ky 风格，选 ky。
-->

---

# ofetch 与 Nuxt $fetch

<v-clicks>

- Nuxt 把 ofetch **自动导入为全局 `$fetch`** 别名
- `useFetch` 在 `$fetch` 之上封装 **SSR 安全获取**（去重 + 水合）
- 依赖链：**ofetch → $fetch → useFetch / useAsyncData**

</v-clicks>

<div v-click class="mt-4 text-sm">

```js
// setup 取数 → useFetch（SSR 安全）
const { data } = await useFetch('/api/list')
// 事件处理 / 提交 → $fetch（即 ofetch）
async function submit() { await $fetch('/api/save', { method: 'POST', body }) }
```

</div>

<!--
最后讲 ofetch 和 Nuxt 的关系，这是它最重要的应用场景。

Nuxt 官方文档原话：Nuxt 包含 ofetch 库，并自动导入为全局 $fetch 别名。所以你在 Nuxt 里用的 $fetch，就是 ofetch 本身。

在 $fetch 之上，Nuxt 又封装了 useFetch，用来做 SSR 安全的数据获取：它会去重，在服务端取数后随 payload 水合到客户端，避免客户端重复请求。useFetch 本身又是 useAsyncData 加 $fetch 的封装。

所以依赖链是 ofetch 到 $fetch 到 useFetch、useAsyncData，每层加一点能力。

实践规则：组件 setup 里取数用 useFetch，享受 SSR 安全和去重；事件处理、表单提交这种客户端动作用 $fetch，也就是直接用 ofetch。别在 setup 顶层裸用 $fetch 取数，会导致服务端客户端各请求一次。
-->

---
layout: intro
---

# 总结

ofetch = **更好用的 fetch，同构 + 轻量**

- 自动解析：`await ofetch(url)` 直接拿数据
- 自动序列化：对象 body 自动 JSON 化 + 补头
- 非 2xx 抛 `FetchError`，错误体在 `error.data`
- 内置 retry（写方法默认 0）/ timeout / 四个拦截器
- 复用：`ofetch.create({ baseURL, ... })`
- 身份：**Nuxt `$fetch` 就是 ofetch**

<!--
总结一下。

ofetch 本质是更好用的 fetch，核心标签是同构加轻量，底层就是原生 fetch。

技术要点：自动解析，await ofetch 直接拿解析后的数据，不用 .json；自动序列化，对象 body 自动 JSON 化并补 content-type 和 accept；非 2xx 自动抛 FetchError，记住错误体在 error.data，不是 axios 的 error.response.data；内置 retry，注意写方法默认 0 次防重复提交，还有 timeout 和四个拦截器 onRequest、onResponse、onRequestError、onResponseError；复用配置用 ofetch.create 设 baseURL 等。

最后再强调那条身份：Nuxt 的全局 $fetch 就是 ofetch，useFetch 在它之上做 SSR 安全获取。把这条记牢，学 ofetch 就等于打通了 Nuxt 数据请求的底座。谢谢大家。
-->
