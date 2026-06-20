---
theme: seriph
background: https://cover.sli.dev
title: WebdriverIO E2E 测试框架
info: |
  WebdriverIO v9 完全指南：Node.js 现代 WebDriver/BiDi 测试 · Web+Mobile 一体

  Learn more at [https://webdriver.io](https://webdriver.io)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## WebdriverIO E2E 测试框架

Node.js 现代 WebDriver/BiDi 测试 · Web+Mobile 一体 · v9

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
WebdriverIO 是 Node.js 生态中最完整的 WebDriver/BiDi 测试框架，v9 全面拥抱 BiDi，Web+Mobile 统一测试。
-->

---
transition: fade-out
---

# 什么是 WebdriverIO

Node.js 生态 WebDriver/BiDi 框架

- **Node.js 原生**：TypeScript 优先，现代 async/await API
- **OpenJS 基金会**托管，社区中立治理
- **Web + Mobile 一体**：同框架测 Web / 移动原生 / Electron / 组件
- **v9 全面开启 WebDriver BiDi**：双向实时通信协议

**能测的目标**：浏览器 E2E（WebDriver+BiDi）· 移动原生 App（Appium）· Electron 桌面 · 前端组件（Browser Runner）

<!--
WebdriverIO 是"一套框架打通全端"的代表，OpenJS 基金会托管保证长期维护。
-->

---
transition: fade-out
---

# 协议架构

W3C WebDriver Classic + BiDi 双协议

**两种协议**

- **WebDriver Classic**：HTTP/JSON，请求-响应，命令式
- **WebDriver BiDi**（v8 引入，v9 默认开启）：WebSocket 双向，支持事件推送

```ts
// 检查是否运行在 BiDi 模式
console.log(browser.isBidi); // v9 默认 true

// CDP 通过 getPuppeteer 仍可用（非主路）
const puppeteer = await browser.getPuppeteer();
```

**BiDi 核心能力**

- Console 日志监听、JS 异常捕获
- 网络拦截与跨浏览器 Mock（v9 新增）
- 设备模拟（v9 新增 `browser.emulate`）

<!--
BiDi 是 W3C 标准化的双向协议，v9 默认开启是最重大变化，CDP 退居辅助位置。
-->

---
transition: fade-out
---

# vs 主流框架对比

四框架关键维度

| 维度 | WebdriverIO | Selenium | Playwright | Cypress |
|------|-------------|----------|-----------|---------|
| 协议 | WebDriver+BiDi | WebDriver | CDP/BiDi | 专有 |
| 自动等待 | 内置 | 手写 | 内置 | 内置重试 |
| 移动端 | Appium 一体 | 分离 | 无 | 无 |
| 治理 | OpenJS 基金会 | 委员会 | 微软 | 商业 |
| 语言 | JS/TS | 6 种 | 5 种 | JS only |
| 组件测试 | Browser Runner | 无 | 实验性 | 成熟 |

<!--
WebdriverIO 的差异化在于：W3C 标准 + Appium 一体 + OpenJS 中立治理，是唯一"Web+Mobile 统一"方案。
-->

---
transition: fade-out
---

# 安装与初始化

向导一键生成配置

```bash
# Node >= 18.20 必须
npm init wdio@latest .
```

**向导交互选项**

- 测试环境：浏览器 / 移动 / 桌面 / 组件
- 框架：Mocha / Jasmine / Cucumber
- 浏览器：Chrome / Firefox / Safari / Edge
- Reporter：spec / allure / junit
- TypeScript：自动配置 tsx 编译

```bash
# 直接运行（向导后）
npx wdio run wdio.conf.ts
```

<!--
`npm init wdio@latest` 是官方推荐入口，向导生成完整的 wdio.conf.ts，比手写配置高效得多。
-->

---
transition: fade-out
---

# 配置 wdio.conf.ts

核心字段一览

```ts
export const config: Options.Testrunner = {
  specs: ['./test/specs/**/*.ts'],
  baseUrl: 'http://localhost:3000',
  waitforTimeout: 10000,       // 默认自动等待超时
  framework: 'mocha',
  reporters: ['spec'],
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['--headless']
    }
  }],
  services: ['chromedriver'],
}
```

**常用字段**：specs / baseUrl / waitforTimeout / framework / reporters / capabilities / services

<!--
wdio.conf.ts 是一切的中心，capabilities 控制浏览器/设备，services 管理驱动，waitforTimeout 控制全局等待。
-->

---
transition: fade-out
---

# $/$$ 查询元素

单个 / 多个 / 链式

```ts
// 单个元素（找不到不立即报错，交互时才检查）
const btn = await $('aria/提交');

// 多个元素
const items = await $$('.list-item');
console.log(items.length);

// 链式查询（父->子）
const row = await $('table').$('tbody tr:first-child');

// 所有查询均需 await
await btn.click();
```

- `$` → 单个 `ChainablePromiseElement`
- `$$` → 多个 `ChainablePromiseArray`
- 链式：`$(a).$(b)` 限定范围查询

<!--
$/$$ 是 WebdriverIO 的核心 API，所有命令均为 async，链式查询可避免全局选择器歧义。
-->

---
transition: fade-out
---

# 选择器类型

推荐优先级（首选 → 末选）

| 类型 | 示例 |
|------|------|
| **ARIA**（首选） | `aria/提交按钮` |
| 文本精确 / 部分 | `button=登录` / `button*=登` |
| data-testid | `[data-testid=btn]` |
| CSS | `.btn-primary` |
| XPath（脆弱） | `//button[@type]` |
| 移动 AccId | `~login_button` |
| React/Vue 组件 | `browser.react$('MyBtn')` |

<!--
aria/ 前缀是 WebdriverIO 的推荐首选，模拟真实用户交互视角，比 CSS 选择器更稳定。
-->

---
transition: fade-out
---

# v9 Shadow DOM 穿透

业界首个自动穿透 Shadow DOM 的框架

```ts
// open / closed Shadow DOM 均自动穿透
// 无需任何特殊处理
const el = await $('my-component').$('#inner-btn');
await el.click();

// 传统框架需要手动 pierce
// Playwright: page.locator('my-component >> #inner-btn')
// Selenium:   需 JavaScript executeScript
```

**v9 的差异化优势**

- open 和 **closed** Shadow DOM 均支持
- 自动递归穿透，无需配置
- 首个实现此能力的 E2E 框架

<!--
Shadow DOM 自动穿透是 v9 最显著的技术亮点，closed Shadow DOM 穿透是其他框架做不到的能力。
-->

---
transition: fade-out
---

# 常用交互命令

browser + element 操作

```ts
// 页面导航
await browser.url('/login');

// 元素交互
await $('input[name=user]').setValue('admin');
await $('input[name=pwd]').addValue('extra');
await $('button[type=submit]').click();

// 下拉选择
await $('select').selectByVisibleText('选项A');

// 读取状态
const text = await $('.msg').getText();
const val  = await $('input').getValue();
const attr = await $('a').getAttribute('href');
```

<!--
setValue 会先清空再输入，addValue 追加输入；getText/getValue/getAttribute 是最常用的状态读取 API。
-->

---
transition: fade-out
---

# 自动等待（v9 内置）

交互前自动轮询，无需手写

**v9 自动等待机制**

- 执行 `click()` 前：自动等元素**可见** + **可滚入** + **未禁用**
- 执行 `setValue()` 前：自动等元素**可编辑**
- 默认超时 `waitforTimeout: 10000`（10 秒）

```ts
// 直接点击，框架自动等待元素就绪
await $('button#submit').click();

// 等价于 Playwright 的 locator.click()（内置 auto-wait）
// 不同于 Selenium 需手写 driver.wait(until.xxx, 5000)
```

**无需手写的场景**：页面跳转后的按钮、异步加载的表单元素

<!--
自动等待是 WebdriverIO v9 对新手最友好的特性，彻底消除了最常见的 "element not interactable" 错误。
-->

---
transition: fade-out
---

# 显式等待补充

自动等待覆盖不到的场景

```ts
// 等待元素出现（自定义超时）
await $('[data-loaded]').waitForDisplayed({ timeout: 15000 });

// 等待元素可点击
await $('button').waitForClickable({ timeout: 5000 });

// 等待自定义条件
await browser.waitUntil(
  async () => {
    const count = (await $$('.item')).length;
    return count >= 3;
  },
  { timeout: 8000, timeoutMsg: '列表未加载足够条目' }
);
```

**常用方法**：waitForDisplayed / waitForClickable / waitForEnabled / waitUntil

<!--
waitUntil 是最灵活的显式等待，可以等待任意异步条件，配合 timeoutMsg 方便调试。
-->

---
transition: fade-out
---

# expect-webdriverio 断言

Web-first 自动重试断言

```ts
// 元素断言（自动重试直到通过或超时）
await expect($('.alert')).toBeDisplayed();
await expect($('button')).toBeEnabled();
await expect($('h1')).toHaveText('欢迎');
await expect($('input')).toHaveValue('admin');
await expect($('a')).toHaveAttribute('href', '/home');
await expect($('.modal')).toExist();
```

**Element 断言**：toExist / toBeDisplayed / toBeEnabled / toHaveText / toHaveValue / toHaveAttribute

<!--
expect-webdriverio 基于 jest/expect，所有断言均有自动重试机制，失败前会持续轮询，避免竞态问题。
-->

---
transition: fade-out
---

# 断言：Browser + 列表 + 网络

更多断言能力

```ts
// Browser 断言
await expect(browser).toHaveUrl('/dashboard');
await expect(browser).toHaveTitle('首页');

// 列表断言
const items = await $$('ul li');
await expect(items).toBeElementsArrayOfSize(5);
await expect(items).toHaveText(['A', 'B', 'C', 'D', 'E']);

// 网络 Mock 断言
const mock = await browser.mock('**/api/user');
await browser.url('/profile');
await expect(mock).toBeRequested();
await expect(mock).toBeRequestedWith({ method: 'GET' });
```

<!--
网络 Mock 断言是 v9 新增的跨浏览器能力，不依赖 CDP，在任何 BiDi 浏览器上均可用。
-->

---
transition: fade-out
---

# services 生态

驱动 + 云平台 + 扩展能力

**官方 services**

| service | 用途 |
|---------|------|
| chromedriver / geckodriver | 本地浏览器驱动 |
| @wdio/appium-service | 移动端 Appium 自动启停 |
| @wdio/visual-service | 视觉回归截图对比 |
| @wdio/lighthouse-service | 性能分析（v9 从 devtools 拆出）|

**云平台 services**

- BrowserStack / Sauce Labs / LambdaTest
- 换 service 即可切换到云端真实设备

<!--
services 是 WebdriverIO 的插件层，chrome/appium 驱动的启停都交给 service 管理，测试代码无需感知底层驱动细节。
-->

---
transition: fade-out
---

# Reporters + Hooks

测试报告与生命周期

**常用 Reporters**

```ts
reporters: ['spec', 'allure', 'junit']
```

**Hooks 执行顺序**

```
onPrepare        → 整个测试套件开始前（全局一次）
before           → 每个 worker 启动后
beforeTest       → 每个 test case 开始前
afterTest        → 每个 test case 结束后（含失败截图）
after            → 每个 worker 结束
onComplete       → 整个测试套件结束后（生成报告）
```

<!--
Hooks 覆盖了从全局到单个用例的完整生命周期，afterTest 是截图保存失败现场的最佳位置。
-->

---
transition: fade-out
---

# Appium 移动端集成

同框架测 iOS/Android 原生

```ts
// wdio.conf.ts capabilities（移动端）
capabilities: [{
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:app': './app/MyApp.apk',
  'appium:deviceName': 'emulator-5554',
}]
```

**WebdriverIO + Appium 一体化优势**

- 同一套 `$` / `$$` / `expect` API
- Web 测试代码可复用大量逻辑
- `@wdio/appium-service` 自动启停 Appium Server

<!--
WebdriverIO 是官方 Appium 推荐的 JS 绑定，一套框架覆盖 Web 和移动，是其核心差异化竞争力。
-->

---
transition: fade-out
---

# 移动端选择器 + Context 切换

跨平台选择器策略

```ts
// ~accId：iOS/Android 跨平台首选（Accessibility ID）
await $('~login_button').click();

// Android UiSelector
await $('android=new UiSelector().text("登录")').click();

// iOS Predicate String
await $('-ios predicate string:label == "登录"').click();

// 混合 App：切换 WebView context
const contexts = await browser.getContexts();
await browser.switchContext(contexts[1]); // 切到 WebView
await $('input').setValue('test');
await browser.switchContext('NATIVE_APP'); // 切回原生
```

<!--
~accId 是移动端最稳定的选择器，跨 iOS/Android 平台一致；getContexts/switchContext 是混合 App 测试的必备 API。
-->

---
transition: fade-out
---

# 组件测试：Browser Runner

真实浏览器中跑组件

```ts
// wdio.conf.ts
runner: ['browser', { preset: 'vue' }]

// 测试文件
import { mount } from '@wdio/browser-runner/stencil';
import MyButton from '../src/MyButton.vue';

it('renders correctly', async () => {
  mount(MyButton, { props: { label: 'Click me' } });
  await expect($('button')).toHaveText('Click me');
});
```

**Browser Runner 特点**

- 用 **Vite** 打包，在真实浏览器中运行（非 JSDOM 模拟）
- 支持 preset：vue / react / svelte / solid
- 集成 Testing Library；目前仅 Mocha 框架

<!--
Browser Runner 是 WebdriverIO 独特的组件测试方案，真实浏览器环境避免了 JSDOM 的 DOM 模拟误差。
-->

---
transition: fade-out
---

# v9 新特性总览

2024 年重大升级

- **BiDi 默认开启**：`browser.isBidi === true`，WebSocket 双向通信
- **自动等待增强**：交互前自动轮询，无需手写 waitFor
- **Shadow DOM 自动穿透**：open + closed 均支持，业界首个
- **跨浏览器网络 Mock**：`browser.mock()` 不再依赖 CDP
- **设备模拟**：`browser.emulate("device", "iPhone 15")`
- **假时钟**：`browser.emulate("clock", { now: new Date(...) })`
- **tsx 支持**：TypeScript 配置文件零编译

<!--
v9 的核心主题是"拥抱 BiDi 标准"，自动等待 + Shadow DOM + 跨浏览器网络 Mock 三者都建立在 BiDi 基础上。
-->

---
transition: fade-out
---

# vs Selenium 专项对比

升级视角

| 维度 | WebdriverIO v9 | Selenium 4 |
|------|---------------|------------|
| 协议 | WebDriver + BiDi（默认） | WebDriver Classic |
| 自动等待 | 内置，交互前自动轮询 | 需手写 `driver.wait(until.xxx)` |
| Appium | 一体框架，同 API | 分离项目，独立绑定 |
| Shadow DOM | 自动穿透 open+closed | 需 JS executeScript |
| 网络 Mock | 跨浏览器（BiDi） | CDP 绑定 Chrome |
| API 风格 | 现代 async/await | 底层命令式 |

<!--
从 Selenium 迁移到 WebdriverIO 的团队，最大收益是：自动等待消除手写 wait、Appium 统一框架、BiDi 能力解锁。
-->

---
transition: fade-out
---

# 适用场景 + 总结

何时选 WebdriverIO

**最佳适用场景**

- 需要 **Web + Mobile 统一测试框架**（唯一完整方案）
- 企业多平台：浏览器 / iOS / Android / Electron 同测
- 重视 **W3C BiDi 标准**，不想绑定 CDP
- 从 Selenium 迁移 JS/TS 团队

**次选场景（其他框架更成熟）**

- 纯 Web 前端 → Playwright / Cypress 社区更活跃
- 组件单元测试 → Vitest + Testing Library

**总结**：WebdriverIO = **W3C 标准 + 全端覆盖 + OpenJS 中立治理**，是跨平台测试团队的首选框架

<!--
选型时的关键问题：是否需要移动端？是否在意 W3C 标准中立？是否有 Selenium 迁移需求？三个 Yes 即选 WebdriverIO。
-->
