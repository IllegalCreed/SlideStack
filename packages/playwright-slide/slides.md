---
theme: seriph
background: https://cover.sli.dev
title: Playwright E2E 测试框架
info: |
  Playwright E2E 测试框架完全指南：跨浏览器 · 多语言 · 进程外协议控制 · v1.61

  Learn more at [https://playwright.dev](https://playwright.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:playwright class="text-8xl" />
</div>

<br/>

## Playwright E2E 测试框架

微软出品的跨浏览器 E2E 测试框架 · v1.61

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Playwright 是微软开源的跨浏览器 E2E 测试框架，进程外通过 CDP 协议控制浏览器。
v1.61 是当前稳定版本，满意度排名第一、增长最快。
-->

---
transition: fade-out
---

# 什么是 Playwright

一套 API 驱动三大浏览器引擎

- 进程外通过 **CDP / WebSocket 协议**控制浏览器，独立于被测页面
- 正式支持 **Chromium / Firefox / WebKit**（Safari 引擎）三大引擎
- 多语言：**TypeScript / JavaScript / Python / Java / .NET**
- 满意度排名第一、增长最快（2024 State of JS）

<v-click>

**本项目关联**

- `quiz-app` 和 `quiz-admin` 目前使用 Cypress；Playwright 是评估替换方向
- `packages/ui` 使用 Playwright + Storybook 做组件 E2E（10 个 story）

</v-click>

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
进程外运行是 Playwright 与 Cypress 最大的架构差异。进程外意味着能控制多标签页、多 origin、多浏览器。
[click] 本项目 ui 包已经在用 Playwright 做 Storybook 故事测试。
-->

---
transition: fade-out
---

# vs Cypress 架构对比

| 维度 | Playwright | Cypress |
| --- | --- | --- |
| 运行位置 | 进程外 CDP/协议控制 | 浏览器内同进程 |
| 跨浏览器 | Chromium/Firefox/WebKit 全正式 | Chrome 系 + Safari 实验 |
| 多语言 | TS/JS/Python/Java/.NET | 仅 JS/TS |
| 并行执行 | 内置免费 | 需 Cloud 付费 |
| 组件测试 | 实验性 | 成熟 |
| 调试工具 | Trace Viewer | 时间旅行 GUI |

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
架构决定能力边界：进程外意味着 Playwright 能做多 origin、多标签页，这是 Cypress 架构做不到的。
免费并行是大团队选 Playwright 的重要原因。
-->

---
transition: fade-out
---

# 安装与配置

<v-click>

**初始化**

```bash
npm init playwright@latest   # 交互式初始化，生成配置 + 示例
npx playwright install       # 安装浏览器二进制
npx playwright install --with-deps  # CI 环境：含系统依赖
```

</v-click>

<v-click>

**playwright.config.ts 核心配置**

```ts
export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: { command: 'npm run dev', url: 'http://localhost:3000' },
})
```

</v-click>

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] npm init playwright 是最快的起步方式，会生成配置骨架和示例测试。
[click] projects 数组定义多浏览器矩阵，webServer 自动启停被测应用。
-->

---
transition: fade-out
---

# Browser / Context / Page 模型

三层隔离结构

```
Browser（进程，worker 级）
  └── BrowserContext（无痕会话，每 test 独立）
        └── Page（标签页）
```

<v-click>

- **Browser**：启动一次，worker 内复用，共享进程资源
- **BrowserContext**：每个 test 独立创建，拥有独立 cookie / storage，相互隔离
- **Page**：一个 BrowserContext 可以有多个 Page（标签页）

</v-click>

<v-click>

`page` fixture 由框架自动管理，测试结束自动销毁 context

</v-click>

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
BrowserContext 是 Playwright 测试隔离的核心：每个 test 有独立的 cookie 和存储，不用担心测试间污染。
[click] Browser 层面复用，Context 层面隔离——这是 Playwright 高效又干净的原因。
[click] page fixture 直接拿来用，框架负责生命周期管理。
-->

---
transition: fade-out
---

# 七大语义 Locator

优先语义，拒绝脆弱选择器

| Locator | 场景 |
| --- | --- |
| `getByRole('button', { name: '提交' })` | 首选，ARIA role + accessible name |
| `getByLabel('用户名')` | 表单 label 关联 |
| `getByPlaceholder('请输入...')` | input placeholder |
| `getByText('确认')` | 可见文本 |
| `getByTestId('submit-btn')` | data-testid 属性 |
| `getByTitle('关闭')` | title 属性 |
| `getByAltText('头像')` | img alt 属性 |

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
七种语义 Locator 覆盖绝大多数场景。getByRole 是首选——它贴近用户认知，也验证了可访问性。
避免用 CSS class 或 XPath，那类选择器脆弱、与实现耦合。
-->

---
transition: fade-out
---

# Locator 链式与过滤

缩小范围，精准定位

```ts
// filter：hasText / has 过滤
const row = page.getByRole('row').filter({ hasText: '张三' })

// and / or 组合
page.getByRole('button').and(page.getByText('提交'))

// nth / first / last 索引
page.getByRole('listitem').first()
page.getByRole('listitem').nth(2)

// 父→子链式缩范围
page.getByRole('table')
  .getByRole('row').filter({ hasText: '张三' })
  .getByRole('cell').nth(1)
```

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
filter 是最常用的缩范围手段，hasText 匹配文本，has 匹配子 Locator。
链式调用从粗到细，逐步缩小定位范围，避免用脆弱的 nth(0) 全局取第一个。
-->

---
transition: fade-out
---

# Locator 惰性 + auto-wait

执行时才查 DOM，动作前自动等

<v-click>

**惰性特性**：`page.getByRole(...)` 不立即查 DOM，**执行动作时**才解析

```ts
// locator 定义阶段不查 DOM
const btn = page.getByRole('button', { name: '提交' })

// click() 执行时才查 DOM + 等待可操作
await btn.click()
```

</v-click>

<v-click>

**auto-wait**：每次动作前自动检查可操作性条件，**无需手写 sleep 或 waitFor**

```ts
// 框架自动等待按钮可见 + 稳定 + 可点击
await page.getByRole('button', { name: '登录' }).click()
```

</v-click>

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 惰性让 Locator 可以在测试顶部声明，不影响执行，还适应动态内容。
[click] auto-wait 是 Playwright 测试稳定性的核心——框架替你等，你只管写动作。
-->

---
transition: fade-out
---

# actionability 检查

动作前必须通过的条件

| 条件 | 说明 |
| --- | --- |
| **Visible** | 元素可见（非 hidden / display:none） |
| **Stable** | 位置稳定，不在动画中 |
| **Enabled** | 未禁用（非 disabled 属性） |
| **Receives Events** | 不被其他元素遮挡 |
| **Editable** | 可编辑（非 readonly） |

<v-click>

- `click` 需通过前四项；`fill` 额外需要 **Editable**
- 超时（默认 30s）仍未通过则报错，报告哪一项未满足

</v-click>

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
五项可操作性检查是 auto-wait 背后的具体条件。Stable 检查动画很有用——等动画结束再点击。
[click] 超时报错信息会明确说哪一项没过，调试很方便。
-->

---
transition: fade-out
---

# web-first 断言

自动重试直到通过或超时

```ts
// web-first 断言：自动轮询，默认超时 5s
await expect(page.getByRole('alert')).toBeVisible()
await expect(page.getByText('成功')).toBeVisible()
await expect(page).toHaveURL(/dashboard/)
```

<v-click>

**必须 await，漏掉则静默失效**

```ts
// ❌ 漏 await：断言入队但不等结果，测试可能虚过
expect(locator).toBeVisible()

// ✅ 正确写法
await expect(locator).toBeVisible()
```

</v-click>

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
web-first 断言内置轮询重试，不需要手写等待逻辑。
[click] 漏 await 是最常见的错误，断言会静默通过，导致测试虚假成功。这是 Playwright 的头号坑。
-->

---
transition: fade-out
---

# 常用 web-first 断言

```ts
await expect(locator).toBeVisible()          // 可见
await expect(locator).toBeEnabled()          // 可用
await expect(locator).toHaveText('确认')     // 精确文本
await expect(locator).toContainText('确认')  // 包含文本
await expect(locator).toHaveValue('admin')   // 表单值
await expect(locator).toHaveCount(3)         // 数量
await expect(page).toHaveURL(/dashboard/)    // 页面 URL
```

<v-click>

**soft 断言**：失败不中断，全部收集后统一报告

```ts
await expect.soft(locator).toBeVisible()
await expect.soft(locator).toHaveText('x')
// 即使前面失败，后续断言继续执行
```

</v-click>

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这些是日常测试最常用的断言，覆盖 DOM 状态、文本内容、表单值、数量、URL。
[click] soft 断言适合批量校验页面多个元素时，不因一个失败而停止，收集全部问题。
-->

---
transition: fade-out
---

# 普通 expect vs web-first

| 维度 | 普通 expect | web-first expect |
| --- | --- | --- |
| 自动重试 | 无，一次判断 | 有，轮询到通过或超时 |
| 同步/异步 | 同步（无需 await） | 异步（必须 await） |
| 适用对象 | 纯 JS 值（number/string） | DOM Locator / Page |
| 失败时机 | 立即 | 超时后 |

```ts
// 普通 expect：纯值比较，无重试
expect(items.length).toBe(3)

// web-first：DOM 状态，自动重试
await expect(page.getByRole('listitem')).toHaveCount(3)
```

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
两种 expect 看起来相似，但行为完全不同。规则很简单：操作 DOM 用 web-first + await，操作纯值用普通 expect。
-->

---
transition: fade-out
---

# page.route 网络 mock

拦截并控制请求

```ts
// stub：直接返回固定 JSON
await page.route('/api/users', (route) =>
  route.fulfill({ json: [{ name: '张三' }] })
)

// 修改真实响应
await page.route('/api/data', async (route) => {
  const resp = await route.fetch()
  const json = await resp.json()
  json.count = 999
  await route.fulfill({ json })
})

// abort：阻止请求
await page.route('/api/track', (route) => route.abort())

// continue：透传不修改
await page.route('/api/*', (route) => route.continue())
```

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
page.route 四种模式覆盖所有网络 mock 场景。route.fetch() 获取真实响应再改动，是最灵活的用法。
-->

---
transition: fade-out
---

# 等待响应 + request fixture

```ts
// 等待特定响应
const [response] = await Promise.all([
  page.waitForResponse('/api/login'),
  page.getByRole('button', { name: '登录' }).click(),
])
expect(response.status()).toBe(200)
```

<v-click>

**request fixture**：纯 API 测试，不打开浏览器

```ts
test('API 返回用户列表', async ({ request }) => {
  const resp = await request.get('/api/users')
  expect(resp.ok()).toBeTruthy()
  const data = await resp.json()
  expect(data).toHaveLength(3)
})
```

</v-click>

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
waitForResponse 用 Promise.all 并发启动等待和点击，确保不错过响应。
[click] request fixture 是纯 HTTP 客户端，不启动浏览器，适合 API 单元测试。
-->

---
transition: fade-out
---

# 内置 Fixtures

框架预置的测试资源

| Fixture | 作用域 | 说明 |
| --- | --- | --- |
| `page` | test 级 | 独立 Page，自动销毁 |
| `context` | test 级 | 独立 BrowserContext |
| `browser` | worker 级 | Browser 实例，跨 test 复用 |
| `request` | test 级 | 纯 API HTTP 客户端 |
| `browserName` | worker 级 | 当前浏览器名称字符串 |

```ts
test('示例', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', '跳过 Firefox')
  await page.goto('/')
})
```

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
内置 fixture 是 Playwright 最优雅的设计：解构即用，框架管生命周期。
browserName 可以跳过特定浏览器的测试，处理跨浏览器差异很方便。
-->

---
transition: fade-out
---

# 自定义 Fixtures

封装登录态 / Page Object

```ts
// fixtures.ts
import { test as base } from '@playwright/test'

export const test = base.extend<{ loggedInPage: Page }>({
  loggedInPage: async ({ page }, use) => {
    // setup：登录并保存 state
    await page.goto('/login')
    await page.getByLabel('用户名').fill('admin')
    await page.getByRole('button', { name: '登录' }).click()
    await page.waitForURL('/dashboard')

    await use(page)  // yield：测试使用

    // teardown：可选清理
  },
})
```

```ts
// my.spec.ts
import { test } from './fixtures'
test('已登录页面', async ({ loggedInPage }) => {
  await expect(loggedInPage.getByText('欢迎')).toBeVisible()
})
```

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
自定义 fixture 是封装复用逻辑的标准方式。use() 之前是 setup，use() 之后是 teardown，yield 语义很清晰。
-->

---
transition: fade-out
---

# 并行模型

Worker 进程级隔离

<v-click>

- **默认**：按文件并行，每个 worker 进程处理一个文件
- **fullyParallel**：文件内 test 也并行，适合独立测试

```ts
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
})
```

</v-click>

<v-click>

- 单文件内串行：`describe.configure({ mode: 'serial' })`
- Worker 间状态完全隔离（独立 BrowserContext），无需担心冲突

</v-click>

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] fullyParallel 在资源充足时可以大幅缩短总运行时间，CI 通常限制 workers 数量节约资源。
[click] describe.configure 可以在文件内局部恢复串行，处理有顺序依赖的场景。
-->

---
transition: fade-out
---

# Sharding + 多浏览器矩阵

跨机器 + 跨引擎

<v-click>

**Sharding**：把测试切片分发到多台 CI 机器

```bash
# 机器 1/4：
npx playwright test --shard=1/4
# 机器 2/4：
npx playwright test --shard=2/4
```

</v-click>

<v-click>

**projects 多浏览器矩阵**

```ts
projects: [
  { name: 'chrome', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'safari', use: { ...devices['Desktop Safari'] } },
  {
    name: 'setup',
    testMatch: /global.setup.ts/,
  },
],
```

</v-click>

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Sharding 是免费的横向扩展，CI 四台机器理论上速度提升 4 倍。
[click] projects 里的 setup project 可以做全局登录，让其他 project 依赖它。
-->

---
transition: fade-out
---

# Trace Viewer（杀手锏）

录制 + 回放，时间旅行调试

<v-click>

**开启录制**（`playwright.config.ts`）

```ts
use: { trace: 'on-first-retry' }
// 可选值：'off' | 'on' | 'retain-on-failure' | 'on-first-retry'
```

</v-click>

<v-click>

**查看 Trace**

```bash
npx playwright show-trace test-results/trace.zip
```

包含：动作时间轴 · DOM 三态快照（before/action/after）· 网络请求 · console 日志 · 源码定位

</v-click>

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Trace Viewer 是 Playwright 最强的调试武器。on-first-retry 是 CI 的最佳实践——只在失败重试时录制，不浪费资源。
[click] DOM 三态快照是关键：动作前、动作中、动作后各一张，精准还原失败现场。
-->

---
transition: fade-out
---

# Codegen + UI Mode

提效工具

<v-click>

**Codegen**：录制操作自动生成测试代码

```bash
npx playwright codegen http://localhost:3000
# 浏览器打开，操作即录制，自动生成语义 Locator
```

</v-click>

<v-click>

**UI Mode**：可视化运行 + 时间旅行 + watch

```bash
npx playwright test --ui
# 左侧测试树，右侧 Trace 预览，文件变更自动重跑
```

</v-click>

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Codegen 是快速上手的利器，生成的代码优先使用语义 Locator，质量比手写的 CSS 选择器高很多。
[click] UI Mode 是日常开发的工作流：watch 模式 + 可视化 trace，调试效率极高。
-->

---
transition: fade-out
---

# 调试 + 组件测试

<v-click>

**调试**

```bash
# 启动 Inspector：逐步执行，查看 Locator 高亮
npx playwright test --debug

# 代码内暂停（需配合 --debug）
await page.pause()
```

</v-click>

<v-click>

**组件测试**（实验性）

```bash
npm init playwright@latest -- --ct  # 初始化组件测试
```

```ts
// Button.spec.ts
import { test, expect } from '@playwright/experimental-ct-vue'
import Button from './Button.vue'
test('渲染文字', async ({ mount }) => {
  const cmp = await mount(Button, { props: { label: '提交' } })
  await expect(cmp).toContainText('提交')
})
```

</v-click>

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Inspector 可以单步执行并高亮 Locator 匹配结果，定位问题很直观。
[click] 组件测试目前仍标注实验性，真实浏览器中跑组件，比 jsdom 更接近生产。
-->

---
transition: fade-out
---

# vs Cypress 选型

| 场景 | 选 Playwright | 选 Cypress |
| --- | --- | --- |
| 跨浏览器覆盖 | ✅ 三引擎全正式 | ⚠️ Safari 实验 |
| 多语言团队 | ✅ 多语言支持 | ❌ 仅 JS/TS |
| 免费并行 | ✅ 内置 | ❌ 需付费 Cloud |
| 调试体验 | ✅ Trace Viewer | ✅ 时间旅行 GUI |
| 组件测试 | ⚠️ 实验性 | ✅ 成熟 |
| 上手难度 | 稍陡 | 较平缓 |

<v-click>

**结论**：新项目首选 Playwright；存量 Cypress 项目无压力继续用

</v-click>

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
两者都是优秀的 E2E 工具，选型看团队语言背景和跨浏览器需求。
[click] 新项目的默认答案是 Playwright：免费并行 + 跨浏览器 + 多语言，综合优势明显。
-->

---
transition: fade-out
---

# CI 集成

GitHub Actions 标准配置

```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with: { node-version: 20 }
- run: npm ci
- run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npx playwright test

- uses: actions/upload-artifact@v4
  if: ${{ !cancelled() }}
  with:
    name: playwright-report
    path: playwright-report/
```

<v-click>

```ts
// playwright.config.ts（CI 推荐配置）
forbidOnly: !!process.env.CI,  // CI 禁止 test.only
retries: process.env.CI ? 2 : 0,
trace: 'on-first-retry',
```

</v-click>

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
--with-deps 安装系统级依赖，在干净 CI 环境必须加。
[click] forbidOnly 防止有人忘记删 test.only 导致 CI 只跑一个测试，是良好实践。
-->

---
layout: intro
transition: fade-out
---

# 总结

跨浏览器 · 免费并行 · 语义 Locator · web-first 断言

- **进程外架构**：CDP 控制，支持跨 origin / 多标签页 / 多语言
- **BrowserContext**：每 test 独立隔离，cookie/storage 互不干扰
- **语义 Locator**：`getByRole` 首选，拒绝脆弱 CSS 选择器
- **web-first 断言**：自动重试，**必须 await，漏掉静默失效**
- **page.route**：四模式 mock，`route.fulfill` / `route.fetch` 最常用
- **Trace Viewer**：DOM 三态快照，CI 失败首选调试工具
- **新项目首选**：跨浏览器 + 免费并行 + 多语言，综合优势明显

<div class="abs-br m-6 text-xl">
  <a href="https://playwright.dev" target="_blank" class="slidev-icon-btn">
    <logos:playwright />
  </a>
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 {
  background-color: #2D6A4F;
  background-image: linear-gradient(45deg, #2D6A4F 10%, #52B788 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
七条核心记忆点覆盖了 Playwright 的精髓。
最重要的两点：await expect 必须写全；新项目优先选 Playwright。
-->

---
layout: end
---
