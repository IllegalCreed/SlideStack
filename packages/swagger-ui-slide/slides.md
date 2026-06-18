---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Swagger UI
info: |
  Presentation about Swagger UI for developers.

  Learn more at [https://swagger.io/tools/swagger-ui/](https://swagger.io/tools/swagger-ui/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Swagger UI

把 OpenAPI 规范渲染成可交互 API 文档的静态资源（基于 Swagger UI 5.32.6）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天聊 Swagger UI。一句话先记住：它只「渲染」OpenAPI 规范，不「生成」规范。
搞清这一点，才能看懂它和后端扫描器、和 Redoc / Scalar 的关系。
-->

---
transition: fade-out
---

# Swagger UI 是什么？

一套静态资源，把 OpenAPI 规范渲染成可交互文档

<v-clicks>

- 本质是 HTML / JS / CSS，把一份 **OpenAPI**（旧称 Swagger）规范渲染成可视化页面
- **只渲染 spec，不生成 spec**——生成靠后端扫描器或手写
- 内置 **Try it out**：可在文档页直接填参数、发真实请求、看响应
- 三个 npm 包均 **5.32.6**，Apache-2.0 许可

</v-clicks>

<div v-click="4" text-xs mt-6>

_Read more about_ [_Swagger UI_](https://swagger.io/tools/swagger-ui/)

</div>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Swagger UI 是什么？一句话：它是一套静态资源，把 OpenAPI 规范渲染成可交互的文档页面。

[click] 它的本质就是 HTML、JS、CSS，消费一份 OpenAPI 规范（旧称 Swagger）并渲染出来。

[click] 关键：它只渲染 spec，不生成 spec，生成是后端扫描器或人手写的事。

[click] 它内置 Try it out，可以在文档页直接填参数、发真实请求、看响应。

[click] 三个 npm 包都是 5.32.6 版本，Apache-2.0 许可。
-->

---
transition: fade-out
---

# OpenAPI ≠ Swagger

规范 vs 工具套件，别混淆

<v-clicks>

- **OpenAPI**：规范本身（formerly the Swagger Specification）
- **Swagger**：围绕该规范的一整套**工具套件**
- **Swagger UI**：工具套件里负责「展示」的那一员
- 所以「用 Swagger 格式」是含糊说法——规范叫 OpenAPI

</v-clicks>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
一个高频术语坑：OpenAPI 不等于 Swagger。

[click] OpenAPI 是规范本身，它的旧名就叫 Swagger Specification。

[click] Swagger 现在指围绕这个规范的一整套工具套件。

[click] Swagger UI 是这套工具里负责「展示」的成员。

[click] 所以说「用 Swagger 格式」是含糊的，规范的正式名字是 OpenAPI。
-->

---
transition: fade-out
---

# 谁生成、谁渲染

分工清晰，Swagger UI 永远只渲染

<v-click>

| 角色 | 由谁承担 | 职责 |
| --- | --- | --- |
| **生成 spec** | springdoc / swagger-jsdoc，或手写 | 扫描注解 / 人工编写，产出 openapi.json |
| **渲染 spec** | **Swagger UI** | 渲染成可交互页面，提供 Try it out |

</v-click>

<div v-click text-sm mt-4>

「跑通 Swagger UI 就有文档」忽略了上游产 spec——内容取决于 spec。

</div>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
生成和渲染是两件事，分工很清晰。

[click] 生成 spec 的是 springdoc、swagger-jsdoc 这类扫描器，或者人手写，产出 openapi.json。渲染 spec 的才是 Swagger UI，它把 spec 渲染成可交互页面，提供 Try it out。

[click] 所以「跑通 Swagger UI 就有完整文档」这话忽略了上游产 spec 这一步，文档内容取决于 spec 本身。
-->

---
transition: fade-out
---

# 三种交付形态

按场景选 flavor，都是 5.32.6

<v-click>

| 包 | 场景 | 关键点 |
| --- | --- | --- |
| `swagger-ui` | 有打包器项目（**首选**） | 按需 import，可摇树 |
| `swagger-ui-dist` | 服务端分发 | 全局 Bundle/Preset、`absolutePath()`；**体积大** |
| `swagger-ui-react` | React 应用 | peer `react >=16.8 <20` |

</v-click>

<div v-click text-sm mt-4>

有打包器仍硬塞 dist 会徒增包体——这是常见误用。

</div>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Swagger UI 有三种交付形态，按场景选。

[click] swagger-ui 包给有打包器的项目，官方首选，可以按需 import、摇树；swagger-ui-dist 是给服务端直接分发的预构建资源，暴露全局 Bundle 和 Preset、还有 absolutePath，但体积更大；swagger-ui-react 是 React 组件，peer 要求 react 16.8 到 20 之间。

[click] 注意：已经有打包器还硬塞 dist，会把整坨资源打进包里，是常见误用。
-->

---
transition: fade-out
---

# 最小初始化

`SwaggerUIBundle` 是浏览器侧入口

<div v-click>

```js
window.ui = SwaggerUIBundle({
  url: "/openapi.json", // 指向 spec
  dom_id: "#swagger-ui", // 挂载点（也可用 domNode）
  deepLinking: true, // 生成锚点（默认 false）
});
```

</div>

<v-clicks>

- 入口 `SwaggerUIBundle({...})`，等价于 `SwaggerUI`
- 挂载点 `dom_id`（选择器）或 `domNode`（元素），二选一必填

</v-clicks>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
最小初始化长这样。

[click] 调 SwaggerUIBundle，传 url 指向 spec、dom_id 指定挂载点，这里顺手开了 deepLinking。

[click] 入口函数是 SwaggerUIBundle，等价别名 SwaggerUI。

[click] 挂载点用 dom_id 传选择器，或 domNode 传元素，二选一必填，不给就不知道往哪渲染。
-->

---
transition: fade-out
---

# 独立完整版

带顶部地址栏，要两件事配套

<div v-click>

```js
SwaggerUIBundle({
  url: "/openapi.json",
  dom_id: "#swagger-ui",
  presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
  layout: "StandaloneLayout", // 默认是 BaseLayout
});
```

</div>

<v-clicks>

- `layout` 默认 `"BaseLayout"`（无顶部地址栏）
- 独立版需 `"StandaloneLayout"` **且**加入 `SwaggerUIStandalonePreset`

</v-clicks>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
要带顶部地址栏的独立完整版，得两件事配套。

[click] 把 SwaggerUIStandalonePreset 加进 presets，再把 layout 设成 StandaloneLayout。

[click] layout 默认是 BaseLayout，没有顶部地址栏。

[click] 独立版要 StandaloneLayout，而且必须加入 StandalonePreset，因为这个 preset 才注册了 StandaloneLayout 组件，缺它会找不到布局。
-->

---
transition: fade-out
---

# 喂 spec 的三种方式

url / spec / urls，注意优先级

<v-clicks>

- `url`：指向单份 spec 地址，最常用
- `spec`：直接内联整份 OpenAPI 对象
- `urls`：多文档下拉数组，配 `urls.primaryName` 指定默认
- **同传 `spec` 与 `url` → `url` 被忽略**（spec 优先）

</v-clicks>

<div v-click text-sm mt-4>

想用 url 远程拉，就别同时填 spec，否则远程地址静默失效。

</div>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
喂 spec 有三种方式。

[click] url 指向单份 spec 地址，最常用。

[click] spec 直接内联整份 OpenAPI 对象。

[click] urls 是多文档下拉数组，配 primaryName 指定默认选中项。

[click] 一个坑：同时传 spec 和 url，url 会被忽略，spec 优先。

[click] 所以想用 url 远程拉规范，就别同时填 spec，否则远程地址静默失效、还不报错。
-->

---
transition: fade-out
---

# 展开与显示

控制首屏密度的几个开关

<v-click>

| 配置 | 默认 | 说明 |
| --- | --- | --- |
| `docExpansion` | `"list"` | `"full"` 全展 / `"none"` 全折 |
| `defaultModelsExpandDepth` | `1` | **`-1` 隐藏 Models 区块** |
| `defaultModelRendering` | `"example"` | 示例值 / `"model"` 结构树 |
| `syntaxHighlight.theme` | `"agate"` | 高亮主题 |

</v-click>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
几个控制首屏密度的开关。

[click] docExpansion 默认 list，展开到 tag 层，可以 full 全展开或 none 全折叠；defaultModelsExpandDepth 默认 1，设成 -1 能完全隐藏底部的 Models 区块，这是很多团队想要的；defaultModelRendering 选示例值还是结构树视图；syntaxHighlight.theme 默认是 agate，超大响应体下还可以整体关掉高亮提性能。
-->

---
transition: fade-out
---

# 交互三开关

deepLinking / tryItOutEnabled / filter

<v-clicks>

- `deepLinking` 默认 **false**：开后生成 `#/{tag}/{operationId}` 锚点，可分享直达链接
- `tryItOutEnabled` 默认 **false**：开后所有操作默认进入 Try it out
- `filter` 默认 false：顶部出现过滤框，按 tag 过滤
- 三者默认都是关的，需要按需显式开启

</v-clicks>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
三个交互开关，记住它们默认都是关的。

[click] deepLinking 默认 false，开启后地址栏会生成 tag 加 operationId 的锚点，能分享直达某个接口的链接。

[click] tryItOutEnabled 默认 false，开启后所有操作默认就进入 Try it out 模式，省一次点击。

[click] filter 默认 false，开启后顶部出现过滤框，按 tag 过滤操作。

[click] 三者默认全关，要按需显式开启。
-->

---
transition: fade-out
---

# Try it out

Swagger UI 区别于只读文档的核心

<v-clicks>

- 在文档页填参数 → 点 Execute → 真实发请求 → 看实际响应
- 方法白名单 `supportedSubmitMethods` 默认含八种
- 默认：`get / put / post / delete / options / head / patch / trace`
- 想禁某方法（如 delete）真实触发，从白名单移除即可

</v-clicks>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Try it out 是 Swagger UI 区别于纯只读文档的核心。

[click] 流程就是：在文档页填参数，点 Execute，真实发起一次 HTTP 请求，看实际响应。

[click] 哪些方法能发请求由 supportedSubmitMethods 白名单决定，默认含八种。

[click] 默认这八种：get、put、post、delete、options、head、patch、trace。

[click] 想禁止某个危险方法比如 delete 被误触发，从白名单里移除就行。
-->

---
transition: fade-out
---

# CORS：最高频报错

根因在被调用方，不在 Swagger UI

<v-clicks>

- 现象：点 Execute 后控制台报 CORS、拿不到响应
- 原理：Try it out 是浏览器直接 fetch，受同源策略约束
- 根因：**目标服务端没返回 `Access-Control-Allow-Origin`**
- 解决：在被调用的后端加 CORS 响应头——改 Swagger UI 没用

</v-clicks>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Try it out 最高频的报错就是 CORS，记住根因在被调用方，不在 Swagger UI。

[click] 现象是点 Execute 后控制台报 CORS，拿不到响应。

[click] 原理是 Try it out 是浏览器直接 fetch 目标接口，受同源策略约束。

[click] 根因是目标服务端没返回 Access-Control-Allow-Origin 这些响应头。

[click] 解决方向是在被调用的后端加 CORS 头，升级 Swagger UI、改配置都没用。
-->

---
transition: fade-out
---

# 网络扩展点

拦截器 + 跨域凭据

<v-clicks>

- `requestInterceptor`：请求发出前介入（加 header / 改 URL / 签名）
- `responseInterceptor`：收到响应后、展示前介入
- `withCredentials: true`：跨域请求带凭据（cookie / 认证）
- 跨域带凭据还需服务端 `Allow-Credentials: true` 且 Origin 非通配

</v-clicks>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Swagger UI 的网络扩展点。

[click] requestInterceptor 在请求发出前介入，可以加 header、改 URL、加签名。

[click] responseInterceptor 在收到响应后、展示给用户前介入。

[click] withCredentials 设 true，让跨域请求带上 cookie 和认证信息。

[click] 但跨域带凭据还要求服务端返回 Allow-Credentials true，且 Origin 不能是通配星号。
-->

---
transition: fade-out
---

# OAuth：initOAuth

实例方法配置授权流程

<div v-click>

```js
ui.initOAuth({
  clientId: "swagger-ui-client",
  scopes: "openid profile",
  usePkceWithAuthorizationCodeGrant: true, // 公共客户端开 PKCE
});
```

</div>

<v-clicks>

- 配置走实例方法 `initOAuth(configObj)`，常在 `onComplete` 调用
- 回调地址 `oauth2RedirectUrl`，须与授权服务器登记一致

</v-clicks>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
OAuth 配置走实例方法 initOAuth。

[click] 传 clientId、scopes，还有这里很重要的 usePkceWithAuthorizationCodeGrant，公共客户端要开 PKCE。

[click] 配置通过实例方法 initOAuth 传入，通常在 onComplete 回调里调用。

[click] 回调地址用 oauth2RedirectUrl，它必须和授权服务器里登记的回调 URL 完全一致。
-->

---
transition: fade-out
---

# clientSecret 是安全红线

浏览器里必然暴露 = 泄密

<v-clicks>

- Swagger UI 跑在浏览器，任何 `clientSecret` 都对用户可见
- 这等于**把 OAuth 客户端密钥公开泄露**
- 公共客户端正解：开 `usePkceWithAuthorizationCodeGrant` 走 PKCE
- PKCE 用一次性 verifier/challenge，**前端无需存任何 secret**

</v-clicks>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
clientSecret 是一条安全红线。

[click] Swagger UI 跑在浏览器里，任何传进去的 clientSecret 都对用户可见。

[click] 这等于把 OAuth 客户端密钥公开泄露出去。

[click] 浏览器、SPA、Swagger UI 都是公共客户端，正解是开 usePkceWithAuthorizationCodeGrant 走 PKCE。

[click] PKCE 用一次性的 verifier 和 challenge，前端根本不需要存任何 secret。无论 OAS 2.0 还是 3.x 都一样。
-->

---
transition: fade-out
---

# 私有部署：关掉外网校验

validatorUrl 默认会外发 spec

<v-clicks>

- `validatorUrl` 默认指向 `https://validator.swagger.io/validator`
- 底部校验徽章会把**整份 spec** 发到公网校验服务
- 私有 / 内网：有泄露风险，且隔离网络里连不通报错
- 解决：设 `validatorUrl: "none"` 禁用在线校验

</v-clicks>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
私有部署一定要关掉外网校验。

[click] validatorUrl 默认指向 validator.swagger.io 这个公网校验服务。

[click] 页面底部那个校验徽章会把你整份 spec 发到公网去校验。

[click] 私有或内网场景，这既有信息泄露风险，在隔离网络里还会因为连不通而报错。

[click] 解决办法就是设 validatorUrl 为 none，禁用在线校验、移除徽章。
-->

---
transition: fade-out
---

# swagger-ui-react 的 mount-only 坑

props 多在挂载时生效一次

<v-clicks>

- 组件暴露近 20 个 props（`url` / `spec` / `docExpansion`…）
- 绝大多数**仅首次挂载时读取一次**
- 运行时再改这些 prop 的值，**不会传播**到已渲染实例
- 想运行时切 url：给组件加 `key` 强制重挂载

</v-clicks>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
用 swagger-ui-react 必踩的一个坑：props 多是 mount-only。

[click] 组件暴露近 20 个 props，比如 url、spec、docExpansion。

[click] 但绝大多数只在首次挂载时读取一次。

[click] 运行时再改这些 prop 的值，不会传播到已经渲染的实例。

[click] 所以想运行时切换 url，常见做法是给组件加 key，强制它重新挂载，而不是指望改 prop 生效。
-->

---
transition: fade-out
---

# 选型：UI / Redoc / Scalar

共性都只渲染不生成

<v-click>

| 工具 | 布局 | 内置调试 |
| --- | --- | --- |
| **Swagger UI** | 单栏 | Try it out（最成熟） |
| **Redoc** | 三栏只读 | 开源版无 |
| **Scalar** | 现代 UI | 更强的 API 客户端 |

</v-click>

<div v-click text-sm mt-4>

组合：对外用 Redoc（好看），内部调试挂 Swagger UI，共用同一 spec。

</div>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
选型对比：Swagger UI、Redoc、Scalar，三者共性是都只渲染不生成 spec。

[click] Swagger UI 单栏布局，Try it out 调试最成熟；Redoc 三栏只读，开源版没有在线发请求；Scalar 是现代 UI，内置功能更强的 API 客户端。

[click] 实际可以组合：对外发布用 Redoc 好看，内部调试挂 Swagger UI，两者消费同一份 spec，互不冲突。
-->

---
transition: fade-out
---

# 踩坑清单

<v-clicks>

1. 它只渲染不生成——没有 spec 页面就是空的
2. OpenAPI 是规范、Swagger 是工具套件，别混
3. Try it out 报 CORS → 目标后端没开 CORS
4. `clientSecret` 配生产前端 = 泄密，改用 PKCE
5. spec 与 url 同传 → url 被忽略；deepLinking 默认关
6. OAS 3.0 Cookie 参数浏览器发不出；私有部署关 validatorUrl

</v-clicks>

<style>
h1 {
  background-color: #85EA2D;
  background-image: linear-gradient(45deg, #85EA2D 10%, #5a9e1f 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
把容易翻车的点收成清单。

[click] 它只渲染不生成，没有上游 spec 页面就是空的。

[click] OpenAPI 是规范、Swagger 是工具套件，别混。

[click] Try it out 报 CORS，根因是目标后端没开 CORS。

[click] clientSecret 配生产前端等于泄密，改用 PKCE。

[click] spec 和 url 同传 url 被忽略；deepLinking 默认是关的。

[click] OAS 3.0 的 Cookie 参数浏览器发不出；私有部署记得把 validatorUrl 设 none。
-->

---
layout: center
class: text-center
transition: slide-up
---

# 谢谢观看

Swagger UI：让一份 OpenAPI 规范，变成可点、可试的活文档

<div class="mt-8 flex justify-center gap-6 text-sm">
  <a href="https://swagger.io/tools/swagger-ui/" target="_blank">官方文档</a>
  <a href="https://github.com/swagger-api/swagger-ui" target="_blank">GitHub</a>
  <a href="https://petstore.swagger.io/" target="_blank">Petstore Demo</a>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天就到这里。

一句话总结 Swagger UI：它让一份 OpenAPI 规范，变成可点、可试的活文档。记住它只渲染不生成，价值在可交互的调试。需要深入就看官方文档、GitHub 仓库和 Petstore Demo。谢谢大家！
-->
