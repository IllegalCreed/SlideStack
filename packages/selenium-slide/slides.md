---
theme: seriph
background: https://cover.sli.dev
title: Selenium / WebDriver E2E 测试
info: |
  Selenium / WebDriver E2E 测试完全指南：W3C WebDriver 标准 · 跨语言跨浏览器老牌 · 4.x

  Learn more at [https://www.selenium.dev](https://www.selenium.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Selenium / WebDriver E2E 测试

W3C WebDriver 标准 · 跨语言跨浏览器老牌 · 4.x

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Selenium 是老牌跨浏览器 E2E 测试框架，W3C WebDriver 标准发起者，4.x 大幅改善 DX。
-->

---
transition: fade-out
---

# 什么是 Selenium

诞生 2004，跨浏览器测试奠基者

- **2004 年** Jason Huggins 在 ThoughtWorks 创建，原名 JavaScriptTestRunner
- **W3C WebDriver 标准**主要发起者与推动者
- 跨语言支持：**Java / Python / C# / Ruby / JavaScript / Kotlin**
- 跨浏览器：Chrome、Firefox、Edge、Safari、旧版 IE
- **Selenium Grid**：分布式并行跨机器跨浏览器执行

<!--
Selenium 是企业 QA 的基石，长达 20 年历史，推动了浏览器自动化标准化。
-->

---
transition: fade-out
---

# 2026 现状

老牌王者 + 新兴挑战

**仍是不可替代的场景**

- 企业 Java / Python QA 团队：存量测试代码量巨大
- 多语言栈：唯一多语言官方支持的 WebDriver 标准实现
- 全浏览器：Safari 真机 + 旧版 IE 仅 Selenium 覆盖
- Selenium Grid 成熟方案：无可替代的大规模分布式基础设施

**前端新项目被超越的场景**

- 前端 JS 新项目：Playwright / Cypress 速度更快、DX 更好
- 自动等待、并行、调试工具：新框架体验领先

<!--
Selenium 与新框架是互补关系，而非替代。企业遗产 + 多语言 + Safari 是三大护城河。
-->

---
transition: fade-out
---

# 架构与协议

每条命令都是一次 HTTP 往返

```
测试代码
  ↓ 语言绑定（selenium-webdriver npm）
  ↓ HTTP/JSON（W3C WebDriver 协议）
  ↓ 浏览器驱动（chromedriver / geckodriver / safaridriver）
  ↓ 浏览器进程
```

- **W3C WebDriver**：标准化的 REST API，与语言无关
- 每条命令 = 一次 HTTP 请求 → 驱动解析 → 浏览器操作 → HTTP 响应
- 驱动与浏览器版本须匹配（Selenium Manager 4.6+ 自动管理）

<!--
进程外通信是 Selenium 架构的核心，也是速度慢的根本原因。
-->

---
transition: fade-out
---

# 为何比 Playwright/Cypress 慢

三重开销叠加

**每条操作的开销链**

1. 测试进程 → HTTP 请求序列化 → 驱动进程
2. 驱动进程解析 → 调用浏览器 API
3. 浏览器返回 → 驱动 → HTTP 响应 → 测试进程

**额外代价**

- **无内置自动等待**：需手写 `driver.wait(until.xxx, timeout)`
- Playwright 在浏览器进程内通信，往返延迟低一个数量级
- Cypress 在浏览器内运行，无跨进程开销

<!--
三重进程通信 + 手写等待是 Selenium 速度慢的核心原因，新框架的架构从根本上解决了这个问题。
-->

---
transition: fade-out
---

# 安装 + Selenium Manager

4.6+ 零配置驱动管理

```bash
npm install selenium-webdriver
```

**Selenium Manager（4.6+ 内置）**

- 自动检测系统浏览器版本
- 自动下载匹配的 chromedriver / geckodriver
- 缓存到本地，无需手动管理 PATH
- 4.x 最重要的 DX 改善之一

```js
// 无需任何驱动配置，直接使用
const driver = await new Builder()
  .forBrowser(Browser.CHROME)
  .build();
```

<!--
4.6 之前需要手动安装 chromedriver 并配置 PATH，是新手最大痛点，Manager 彻底解决。
-->

---
transition: fade-out
---

# 第一个测试

try/finally 确保 quit

```js
import { Builder, Browser } from 'selenium-webdriver';

const driver = await new Builder()
  .forBrowser(Browser.CHROME)
  .build();

try {
  await driver.get('https://www.selenium.dev/');
  const title = await driver.getTitle();
  console.log('Title:', title);
} finally {
  await driver.quit(); // 必须释放，否则 driver 进程残留
}
```

- `driver.quit()` 关闭浏览器并终止 driver 进程
- **finally** 保证即使测试失败也会清理

<!--
quit 是 Selenium 的必须操作，不同于 Playwright 的自动清理，忘记会导致进程泄漏。
-->

---
transition: fade-out
---

# By 定位器（8 种）

优先 id > css，慎用 xpath

```js
By.id('submit')              // 最稳定，首选
By.css('.btn-primary')       // 简洁灵活，次选
By.xpath('//button[@type="submit"]') // 灵活但脆弱
By.name('username')          // 表单元素常用
By.className('active')       // 单 class 匹配
By.linkText('登录')           // 精确链接文本
By.partialLinkText('登')     // 部分链接文本
By.tagName('input')          // 按标签名
```

**优先级**：id > css > name > xpath（xpath 脆弱、慢）

<!--
8 种定位器覆盖各种 HTML 结构，id 最稳定，xpath 最灵活但最脆弱。
-->

---
transition: fade-out
---

# findElement vs findElements

单个 vs 多个，范围查询

```js
// 找不到抛 NoSuchElementException
const btn = await driver.findElement(By.css('#submit'));

// 找不到返回空数组（不抛错）
const items = await driver.findElements(By.css('.list-item'));
console.log('数量:', items.length);

// 父元素范围内查询（避免全局匹配）
const form = await driver.findElement(By.css('form'));
const input = await form.findElement(By.css('input[name="email"]'));
```

- `findElement`：期望唯一存在，不存在即失败
- `findElements`：用于断言数量或遍历列表

<!--
父元素范围查询是最佳实践，可避免 ID 重复或全局选择器歧义问题。
-->

---
transition: fade-out
---

# 元素交互

常用操作一览

```js
const el = await driver.findElement(By.css('input'));

await el.sendKeys('hello');         // 输入文本
await el.sendKeys(Key.RETURN);      // 特殊键（回车）
await el.click();                   // 点击（自动滚入视口）
await el.clear();                   // 清空输入框

const text = await el.getText();            // 获取 innerText
const val  = await el.getAttribute('value'); // 获取属性
const ok   = await el.isEnabled();          // 是否可交互
const vis  = await el.isDisplayed();        // 是否可见
```

- `click()` 会自动将元素滚入视口
- `Key` 来自 `selenium-webdriver`，包含所有特殊键

<!--
isDisplayed 检查可见性，isEnabled 检查可交互性，两者常用于断言 UI 状态。
-->

---
transition: fade-out
---

# 隐式等待

全局轮询，默认 0

```js
// 设置全局隐式等待（单位毫秒）
await driver.manage().setTimeouts({ implicit: 5000 });

// 之后所有 findElement 找不到时会轮询 5 秒
const el = await driver.findElement(By.id('result'));
```

**特点**

- 一次设置，全局生效
- 找不到元素时持续轮询直到超时
- 默认值为 **0**（不等待，立即报错）

> 警告：不要与显式等待混用，会导致超时行为不可预测

<!--
隐式等待是全局开关，方便但粗糙；显式等待更精准，官方推荐显式等待。
-->

---
transition: fade-out
---

# 显式等待（推荐）

精准等待特定条件

```js
import { until } from 'selenium-webdriver';

// 等待元素出现（最常用）
const el = await driver.wait(
  until.elementLocated(By.id('result')),
  5000,
  '等待 #result 超时'
);

// 等待元素可见
await driver.wait(until.elementIsVisible(el), 3000);

// 等待标题变化
await driver.wait(until.titleContains('成功'), 3000);

// 等待 URL 变化
await driver.wait(until.urlContains('/dashboard'), 3000);
```

<!--
显式等待是 Selenium 最佳实践核心，每个等待都有明确语义，远优于 sleep。
-->

---
transition: fade-out
---

# 等待注意事项

混用 = 灾难，sleep = 禁忌

**禁止混用隐式 + 显式等待**

- WebDriver 规范明确警告：混用会导致超时时间翻倍或行为不可预测
- 项目中统一选一种，推荐**只用显式等待**

**绝对禁止 sleep**

```js
// 错误做法
await new Promise(r => setTimeout(r, 2000)); // 不可靠且慢

// 正确做法
await driver.wait(until.elementLocated(By.id('x')), 5000);
```

**对比其他框架**

- Playwright：内置 auto-wait，操作前自动等可见/可用
- Cypress：命令链自动重试，无需手写等待

<!--
自动等待是新框架最大优势，Selenium 手写等待是主要痛点来源。
-->

---
transition: fade-out
---

# Selenium Grid

分布式跨浏览器并行

**Grid 4 组件架构**

| 组件 | 职责 |
|------|------|
| Router | 流量入口，路由请求 |
| Distributor | 节点分配，负载均衡 |
| Session Queue | 请求排队，容量管理 |
| Session Map | 会话注册表 |
| Node | 实际执行浏览器的机器 |

- 支持跨机器、跨操作系统、跨浏览器版本并行
- Standalone 模式：单机一键启动，适合 CI

<!--
Grid 4 将单体拆分为微服务架构，每个组件可独立扩展，是企业级测试基础设施的核心。
-->

---
transition: fade-out
---

# 连接 Selenium Grid

JS 绑定示例

```js
import { Builder, Browser } from 'selenium-webdriver';

// 连接远端 Grid Hub
const driver = await new Builder()
  .usingServer('http://selenium-hub:4444/wd/hub')
  .forBrowser(Browser.CHROME)
  .build();

// 附加 Chrome 选项
import { Options } from 'selenium-webdriver/chrome.js';
const opts = new Options().addArguments('--headless=new');

const driver2 = await new Builder()
  .usingServer('http://selenium-hub:4444/wd/hub')
  .forBrowser(Browser.CHROME)
  .setChromeOptions(opts)
  .build();
```

<!--
usingServer 指向 Grid，其余代码与本地完全一致，是 Grid 最大优势之一。
-->

---
transition: fade-out
---

# WebDriver BiDi

双向协议，告别 CDP

**WebDriver 协议对比**

- **传统 WebDriver**：HTTP/JSON，请求-响应，单向，每命令一次往返
- **WebDriver BiDi**：WebSocket，双向，支持事件推送与订阅

**BiDi 核心能力**

- 监听 Console 日志（LogInspector）
- 捕获 JS 异常与错误
- 网络拦截与修改（Network 模块）
- 基本认证处理

**路线图**

- CDP 是临时方案，Selenium 迁向 W3C BiDi 标准
- Firefox 目前 BiDi 支持最完整

<!--
BiDi 是 Selenium 追赶 Playwright CDP 能力的战略方向，基于 W3C 标准更具互操作性。
-->

---
transition: fade-out
---

# 多语言绑定优势

唯一真正多语言的框架

```
Selenium        Java / Python / C# / Ruby / JS / Kotlin
Playwright      TypeScript / JavaScript / Python / Java / .NET
Cypress         仅 JavaScript / TypeScript
WebdriverIO     JavaScript / TypeScript（基于 WebDriver 协议）
```

**实际意义**

- Java QA 团队、Python QA 团队无需切换语言
- 同一套测试协议，不同语言团队协作
- Ruby / Kotlin 测试：仅 Selenium 支持

<!--
多语言是 Selenium 最难被替代的护城河，尤其对于有历史积累的非 JS 团队。
-->

---
transition: fade-out
---

# Page Object 模式

封装定位器与操作

```js
// pages/LoginPage.js
export class LoginPage {
  constructor(driver) {
    this.driver = driver;
  }

  // 导航
  async goto() {
    await this.driver.get('https://example.com/login');
  }

  // 操作封装
  async login(user, pwd) {
    const u = await this.driver.findElement(By.id('username'));
    await u.sendKeys(user);
    const p = await this.driver.findElement(By.id('password'));
    await p.sendKeys(pwd);
    await this.driver.findElement(By.css('[type=submit]')).click();
  }
}
```

UI 变更只改 Page 类，测试逻辑不动

<!--
Page Object 是 Selenium 社区最普遍的组织模式，大幅降低 UI 变更的维护成本。
-->

---
transition: fade-out
---

# 最佳实践

六条原则

1. **显式等待优先**：`driver.wait(until.xxx, ms)` 而非 sleep
2. **绝不 sleep**：`setTimeout` 是脆弱的时间依赖
3. **定位器优先级**：id > css > name，避免 xpath
4. **每测试独立 driver**：beforeEach 创建，afterEach quit
5. **finally 防泄漏**：quit 必须在 finally 块中执行
6. **Page Object 封装**：定位器集中管理，不散落在测试里

```js
// 推荐测试结构（Jest/Mocha）
let driver;
beforeEach(async () => { driver = await new Builder()... .build(); });
afterEach(async () => { await driver?.quit(); });
```

<!--
六条原则覆盖了 Selenium 最常见的陷阱，其中独立 driver + finally 是可靠性基石。
-->

---
transition: fade-out
---

# 横向对比

四大框架关键维度

| 维度 | Selenium | Playwright | Cypress | WebdriverIO |
|------|----------|-----------|---------|-------------|
| 协议 | W3C WebDriver | CDP/BiDi | 浏览器内 | WebDriver |
| 速度 | 慢 | 快 | 最快 | 中等 |
| 语言 | 6 种 | 5 种 | JS only | JS/TS |
| 自动等待 | 需手写 | 内置 | 内置重试 | 部分内置 |
| Safari | 原生支持 | WebKit | 不支持 | 支持 |
| W3C 标准 | 是（发起者） | 部分 | 否 | 是 |

<!--
六维对比突出 Selenium 的标准性与 Safari 支持，也明确了速度和 DX 的劣势。
-->

---
transition: fade-out
---

# 适用场景 + 总结

选 Selenium 的充分理由

**选 Selenium 的场景**

- 企业 Java / Python QA 团队（存量资产不可丢）
- 需要 Safari 真机测试（唯一原生支持）
- 跨语言团队共用测试协议标准
- 大规模 Grid 分布式并行基础设施
- 旧浏览器兼容性测试（含 IE legacy）

**前端新项目**

- 纯 JS/TS 栈 + 快速反馈 → Playwright
- Vue/React 组件测试 + 可视化调试 → Cypress

**总结**：Selenium 是测试基础设施的**标准层**，新框架是**体验层**，不是非此即彼

<!--
Selenium 和新框架是互补关系。理解各自适用场景，是选型的核心能力。
-->
