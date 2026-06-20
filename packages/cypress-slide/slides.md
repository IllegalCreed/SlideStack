---
theme: seriph
background: https://cover.sli.dev
title: Cypress E2E 测试框架
info: |
  Cypress E2E 测试框架完全指南：浏览器内运行 · 自动等待 · v15.x

  Learn more at [https://docs.cypress.io](https://docs.cypress.io)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:cypress class="text-8xl" />
</div>

<br/>

## Cypress E2E 测试框架

浏览器内运行的 E2E 测试框架 · v15.x

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Cypress 是浏览器内运行的现代 E2E 测试框架，本项目 quiz-app 和 quiz-admin 均在使用。
今天讲 v15.x 的核心概念与实战用法。
-->

---
transition: fade-out
---

# 什么是 Cypress

测试代码跑在浏览器内部

<v-click>

**核心架构**

- 测试代码与被测应用运行在**同一浏览器、同一事件循环**
- 直接访问 DOM、网络请求、`window` 对象，无需跨进程通信
- 内置**自动等待 + 重试**，无需手写 `sleep`

</v-click>

<v-click>

**本项目用途**

- `quiz-app`：Cypress 6 个 spec，Mock API，约 33 个测试
- `quiz-admin`：Cypress 11 个 spec，真实后端，约 129 个测试

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Cypress 最大的架构特点是"浏览器内运行"——测试代码和被测页面在同一 JS 运行时，所以能直接访问 DOM 和网络。

[click] 本项目两个前端应用都在用 Cypress 做 E2E 测试。
-->

---
transition: fade-out
---

# vs Selenium 架构差异

| 维度 | Cypress | Selenium |
| --- | --- | --- |
| 运行位置 | 浏览器内部 | 外部 WebDriver 协议 |
| 同步模型 | 自动重试断言 | 手动写 wait/sleep |
| 调试方式 | 时间旅行截图 | 仅最终快照 |
| 语言支持 | 仅 JS / TS | Java / Python / 多语言 |
| 网络拦截 | 内置 `cy.intercept` | 需要代理工具 |

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
架构差异决定了开发体验差距：Cypress 的自动重试让测试代码简洁很多，时间旅行调试让排查问题直观。
代价是仅支持 JS/TS，且只能单浏览器实例。
-->

---
transition: fade-out
---

# 安装与配置

<v-click>

**安装**

```bash
pnpm add -D cypress
npx cypress open   # 首次启动，生成配置文件
```

</v-click>

<v-click>

**cypress.config.ts 核心配置**

```ts
import { defineConfig } from 'cypress'
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:10000',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    setupNodeEvents(on, config) { /* 插件 */ },
  },
})
```

</v-click>

<v-click>

**v15 默认值**：`video: false`、`testIsolation: true`

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] pnpm add 安装后，npx cypress open 首次启动会生成 cypress.config.ts 骨架。

[click] baseUrl 是最常用的配置，让测试里 cy.visit("/") 直接相对访问。

[click] v15 默认关闭视频录制，testIsolation 默认开启（每个 it 前自动清状态）。
-->

---
transition: fade-out
---

# 测试结构

```ts
describe('用户登录', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('正确账密登录成功', () => {
    cy.get('[data-cy="username"]').type('admin')
    cy.get('[data-cy="password"]').type('password')
    cy.get('[data-cy="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('错误账密显示错误', () => {
    cy.get('[data-cy="username"]').type('wrong')
    cy.get('[data-cy="password"]').type('wrong')
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="error"]').should('be.visible')
  })
})
```

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
测试结构和 Jest 一致：describe 分组 + it 单例 + beforeEach 共享前置。
cy.visit 是 E2E 测试的起点，之后跟各种命令链式操作。
-->

---
transition: fade-out
---

# 命令的三种类型

| 类型 | 代表命令 | 是否重试 | 说明 |
| --- | --- | --- | --- |
| **Queries** | `cy.get()` `cy.find()` `cy.contains()` | ✅ 是 | 查询 DOM，失败重试 |
| **Assertions** | `.should()` `.and()` | ✅ 是 | 断言，失败重试 |
| **Non-queries** | `.click()` `.type()` `.select()` | ❌ 否 | 动作，执行一次 |

<v-click>

**重要原则**：命令异步入队，**不是同步执行**

```ts
// ❌ btn 是 Chainable，不是 DOM 元素
const btn = cy.get('[data-cy="submit"]')
btn.click()

// ✅ 用链式调用
cy.get('[data-cy="submit"]').click()
```

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
三种命令的区分很重要：Queries 和 Assertions 有重试，动作没有。
[click] 最常见的陷阱：把 cy.get() 的返回值存到变量里，但那个值是 Chainable 不是 DOM 节点。
-->

---
transition: fade-out
---

# 重试能力 retry-ability

断言失败从链顶重跑所有 Query

<v-click>

```ts
// cy.get 和 .find 组成 Query 链
// .should 断言失败时，从 cy.get 开始整条链重新执行
cy.get('[data-cy="list"]')
  .find('li')
  .should('have.length', 3)
// 默认超时 4s，每隔约 50ms 重试一次
```

</v-click>

<v-click>

**正确姿势：动作后跟断言断开**

```ts
// ✅ click 是 Non-query，后续 should 独立重试
cy.get('[data-cy="btn"]').click()
cy.get('[data-cy="result"]').should('be.visible')

// ⚠️ .then() 打断重试链，改用 .should(callback)
cy.get('[data-cy="count"]').should(($el) => {
  expect($el.text()).to.eq('3')
})
```

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] retry-ability 是 Cypress 最核心的机制：断言失败时不立即报错，而是从 Query 链顶重新执行，直到通过或超时。

[click] then() 会打断重试链——需要可重试的回调时用 .should(callback) 替代。
-->

---
transition: fade-out
---

# 选择器策略

优先 data-cy 属性

| 优先级 | 选择器 | 说明 |
| --- | --- | --- |
| ⭐ 最佳 | `[data-cy="submit"]` | 测试专用，不受样式/文案影响 |
| ✅ 次选 | `cy.contains("button", "提交")` | 贴近用户视角 |
| ⚠️ 慎用 | `[aria-label="x"]` | 语义属性，可以用 |
| ❌ 避免 | `.btn-primary` `#submit` | 样式/ID 重构易变 |

<v-click>

```ts
// 本项目 quiz-admin 实际用法
cy.get('[data-cy="user-table"]').find('tr').should('have.length.gt', 0)
cy.get('[data-cy="create-btn"]').click()
```

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
data-cy 是 Cypress 官方推荐，与样式完全解耦，重构页面样式不影响测试。
[click] 本项目也在用这个约定，给需要测试的元素加 data-cy 属性。
-->

---
transition: fade-out
---

# 交互命令与断言

<v-click>

**常用交互**

```ts
cy.get('input').type('hello')          // 输入文字
cy.get('input').clear()                // 清空
cy.get('button').click()               // 点击
cy.get('input[type=checkbox]').check() // 勾选
cy.get('select').select('option1')     // 下拉选择
```

</v-click>

<v-click>

**断言两种写法**

```ts
// 隐式断言：自动重试
cy.get('[data-cy="msg"]').should('be.visible').and('contain', '成功')

// 显式断言：用于非 DOM 值（不重试）
cy.url().then((url) => {
  expect(url).to.include('/dashboard')
})
```

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这些是日常测试最常用的命令，type/click/check 覆盖大多数交互场景。

[click] 隐式断言 .should() 自动重试，是首选。显式 expect 用于已经拿到 JS 值的场合。
-->

---
transition: fade-out
---

# cy.intercept 三种模式

拦截并控制网络请求

<v-click>

```ts
// 模式一：stub 静态响应（Mock API）
cy.intercept('GET', '/api/users', { fixture: 'users.json' })

// 模式二：spy 只监听，不修改响应
cy.intercept('POST', '/api/login').as('loginReq')

// 模式三：动态修改请求/响应
cy.intercept('GET', '/api/data', (req) => {
  req.reply({ statusCode: 200, body: { count: 42 } })
})
```

</v-click>

<v-click>

**本项目 quiz-app**：Mock API 规避 SSE，所有接口用 `cy.intercept` stub

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] intercept 三种模式覆盖了绝大多数网络测试场景。fixture 模式最简洁，动态 req.reply 最灵活。

[click] quiz-app 因为有 SSE 流式响应，E2E 里全部 mock 掉，就是用的 stub 模式。
-->

---
transition: fade-out
---

# cy.wait 等待与断言

等待具名请求 + 验证响应

```ts
// ① 必须在 visit 前注册 intercept
cy.intercept('POST', '/api/login').as('login')

cy.visit('/login')
cy.get('[data-cy="username"]').type('admin')
cy.get('[data-cy="submit"]').click()

// ② 等待请求完成，再断言响应
cy.wait('@login')
  .its('response.statusCode')
  .should('eq', 200)

// ③ 断言请求体
cy.wait('@login').its('request.body.username').should('eq', 'admin')
```

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
cy.wait('@alias') 是等待网络请求的正确方式，比 cy.wait(固定毫秒) 可靠得多。
关键点是必须在 visit 之前注册 intercept，否则可能错过请求。
-->

---
transition: fade-out
---

# fixtures 与别名

测试数据管理

<v-click>

**fixtures**：`cypress/fixtures/users.json`

```ts
// 使用 fixture 文件作为 stub 响应
cy.intercept('GET', '/api/users', { fixture: 'users.json' })

// 或在测试中读取 fixture 数据
cy.fixture('users.json').then((users) => {
  expect(users).to.have.length(3)
})
```

</v-click>

<v-click>

**别名 `.as()`**：每个测试自动重置，放 `beforeEach`

```ts
beforeEach(() => {
  cy.fixture('users.json').as('users')
})
it('列表正确', function () {
  cy.get('@users').then((users) => { /* ... */ })
})
```

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] fixture 文件是 JSON/图片等静态数据，放 cypress/fixtures 目录，用名字引用。

[click] alias 别名用 @name 引用，每个测试自动重置。注意用普通函数 function() 才能访问 this.users。
-->

---
transition: fade-out
---

# 自定义命令

封装重复测试逻辑

<v-click>

**定义**（`cypress/support/commands.ts`）

```ts
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.get('[data-cy="username"]').type(username)
  cy.get('[data-cy="password"]').type(password)
  cy.get('[data-cy="submit"]').click()
})
```

</v-click>

<v-click>

**命令类型**：parent（默认）/ child（`prevSubject:'element'`）/ dual

**TS 类型声明**（`cypress/support/index.d.ts`）

```ts
declare namespace Cypress {
  interface Chainable {
    login(username: string, password: string): Chainable<void>
  }
}
```

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 自定义命令把重复的测试逻辑封装起来，login 是最典型的例子。
prevSubject:'element' 表示这是 child 命令，必须链式调用在元素后面。

[click] TS 声明让自定义命令有类型提示。
-->

---
transition: fade-out
---

# cy.session 缓存登录态

避免每个测试重复走 UI 登录

<v-click>

```ts
Cypress.Commands.add('loginViaSession', (user = 'admin') => {
  cy.session(
    user,  // 缓存 key
    () => {
      // 只有首次或缓存失效时才执行
      cy.visit('/login')
      cy.get('[data-cy="username"]').type(user)
      cy.get('[data-cy="submit"]').click()
      cy.url().should('include', '/dashboard')
    },
    {
      validate: () => cy.getCookie('auth_token').should('exist'),
      cacheAcrossSpecs: true,  // 跨 spec 文件复用
    }
  )
})
```

</v-click>

<v-click>

**效果**：整套测试只登录一次，其余测试复用 cookie/localStorage

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] cy.session 是 v9+ 引入的登录态缓存机制，validate 回调验证缓存是否仍有效。

[click] cacheAcrossSpecs 让多个 spec 文件共享同一登录态，大幅缩短 CI 时间。
-->

---
transition: fade-out
---

# cy.origin 跨域测试

跨超域的唯一解法

<v-click>

**背景**：Cypress 单超域限制（同协议+域名+端口）

```ts
// v14+ 默认关闭 injectDocumentDomain
// 跨 origin 必须用 cy.origin，不能直接 cy.visit

cy.visit('https://app.example.com')

cy.origin('https://auth.example.com', () => {
  // 这里是沙箱环境
  cy.get('[data-cy="oauth-btn"]').click()
})

cy.url().should('include', '/dashboard')
```

</v-click>

<v-click>

**沙箱限制**：回调内不能访问外部变量（用 `args` 传参），不能用 `cy.intercept`/`cy.session`

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] cy.origin 是 v8 引入的跨域解决方案，v14 之后默认关闭了旧的 injectDocumentDomain hack。

[click] 沙箱是关键约束：回调序列化后在另一个 origin 里执行，所以不能闭包访问外部变量。
-->

---
transition: fade-out
---

# 组件测试

直接挂载 Vue 组件测试

<v-click>

**cypress.config.ts 增加 component 配置**

```ts
component: {
  devServer: { framework: 'vue', bundler: 'vite' },
  specPattern: 'src/**/*.cy.ts',
}
```

</v-click>

<v-click>

**测试写法**

```ts
import MyButton from './MyButton.vue'

it('点击触发事件', () => {
  const onClick = cy.spy().as('clicked')
  cy.mount(MyButton, { props: { label: '提交', onClick } })

  cy.get('button').click()
  cy.get('@clicked').should('have.been.calledOnce')
})
```

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 组件测试需要额外配置 devServer，指定 framework 和 bundler。

[click] cy.mount 类似 Vue Test Utils 的 mount，cy.spy 用于验证事件是否触发。
-->

---
transition: fade-out
---

# 架构局限 Trade-offs

永久约束，非版本问题

| 局限 | 说明 |
| --- | --- |
| 仅 JS / TS | 不支持 Java、Python 等语言 |
| 单浏览器实例 | 无法同时测试多标签页交互 |
| 跨域需 origin | 跨超域必须用 `cy.origin` |
| 不能直连 DB | 须用 `cy.task` 或 API 设置数据 |
| 不适合爬虫/性能 | 定位是功能 E2E，非性能/爬虫工具 |

<v-click>

这些局限源于「浏览器内运行」的架构决策，是永久性 trade-off，不会在未来版本修复

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这些局限是选择 Cypress 前需要清楚的点。仅支持 JS/TS 是最大的限制，跨语言团队需要考虑。
[click] 这些限制来自架构设计，不是 bug，未来版本也不会改变。
-->

---
transition: fade-out
---

# vs Playwright

| 维度 | Cypress | Playwright |
| --- | --- | --- |
| 跨浏览器 | Chrome系+Safari(实验) | Chrome/Firefox/Safari 全正式 |
| 语言支持 | 仅 JS/TS | JS/TS/Python/Java/C# |
| 并行执行 | 需 Cloud 付费 | 内置免费 |
| 组件测试 | 成熟 | 较新 |
| 调试体验 | 时间旅行 GUI | Trace Viewer |
| 学习曲线 | 较平缓 | 稍陡 |

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
两者定位接近，各有优势。Cypress 的 GUI 调试体验更友好，Playwright 的跨语言和免费并行更适合大团队。
本项目选 Cypress 主要因为团队 JS/TS 背景和 GUI 调试需求。
-->

---
transition: fade-out
---

# 反模式

| 反模式 | 正确做法 |
| --- | --- |
| `cy.wait(3000)` 固定延迟 | `cy.wait('@alias')` 等具名请求 |
| CSS class / ID 选择器 | `[data-cy="x"]` 测试专用属性 |
| `const el = cy.get(...)` | 链式调用或 `.as()` 别名 |
| 测试间共享状态 | `testIsolation: true`，每测试独立 |
| UI 走登录流程 | `cy.session()` 缓存 + API 设状态 |
| 不清理 `it.only` | 提交前必须移除 `.only` |

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
六条反模式涵盖了 Cypress 测试最常见的坑。cy.wait 固定时间是最严重的反模式，会让测试又慢又不稳定。
-->

---
transition: fade-out
---

# CI 集成

GitHub Actions 标准配置

```yaml
- name: E2E Tests
  uses: cypress-io/github-action@v6
  with:
    build: pnpm run build
    start: pnpm run preview
    wait-on: 'http://localhost:4173'
    browser: chrome
```

<v-click>

**重试配置**（`cypress.config.ts`）

```ts
e2e: {
  retries: {
    runMode: 2,   // CI 运行时失败重试 2 次
    openMode: 0,  // GUI 模式不重试
  },
}
```

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
cypress-io/github-action 封装了常用 CI 场景，wait-on 等待服务起来再跑测试。
[click] runMode 重试是应对网络抖动等偶发失败的常用手段，但不要用来掩盖稳定性问题。
-->

---
layout: intro
transition: fade-out
---

# 总结

浏览器内运行 · 三类命令 · cy.intercept · cy.session

- **浏览器内运行**：直接访问 DOM，自动等待+重试，时间旅行调试
- **三类命令**：Queries（重试）/ Assertions（重试）/ Non-queries（不重试）
- **data-cy 选择器**：测试专用属性，与样式/文案解耦
- **cy.intercept**：三模式 stub/spy/动态，Mock API 首选
- **cy.session**：缓存登录态，一次登录整套复用
- **永久局限**：仅 JS/TS、单浏览器、跨域需 origin

<div class="abs-br m-6 text-xl">
  <a href="https://docs.cypress.io" target="_blank" class="slidev-icon-btn">
    <logos:cypress />
  </a>
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
六条核心记忆点：
1. 浏览器内运行是 Cypress 架构的根本
2. 三类命令的重试行为决定测试稳定性
3. data-cy 是选择器的最佳实践
4. cy.intercept 的三种模式覆盖网络测试场景
5. cy.session 大幅减少登录开销
6. 架构局限要提前知晓
-->

---
layout: end
---
