---
theme: seriph
background: https://cover.sli.dev
title: Puppeteer 浏览器自动化
info: |
  Puppeteer v25 完全指南：Google 的浏览器自动化库 · CDP 直控 · 截图/PDF/爬虫

  Learn more at [https://pptr.dev](https://pptr.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Puppeteer 浏览器自动化

Google 的浏览器自动化库 · CDP 直控 · v25

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Puppeteer 是 Google 开发的 Node.js 浏览器自动化库，通过 CDP 直接控制 Chrome/Chromium。
-->

---
transition: fade-out
---

# 什么是 Puppeteer

Google 的 Node.js 浏览器**自动化库**（不是测试框架！）

- **Google 官方出品**：Node.js API，通过 CDP 控制 Chrome/Chromium
- **也支持 Firefox**（实验性，通过 CDP/BiDi 协议）
- **无内置 runner / 断言 / 并行**——它只是一个操控浏览器的库
- **三大强项**：截图、PDF 生成、爬虫与自动化脚本

> 做 E2E 测试？别直接用 Puppeteer——它需要配合 Jest 等框架才能跑测试。

<!--
Puppeteer 是自动化库而非测试框架，这是最容易混淆的概念，需要反复强调。
-->

---

# 关键边界：自动化库 vs 测试框架

<div class="overflow-x-auto">

| 维度 | Puppeteer | Playwright / Cypress |
|------|-----------|---------------------|
| 定位 | 浏览器**自动化库** | 完整**测试框架** |
| 内置 Runner | ❌ 无 | ✅ 有 |
| 内置断言 | ❌ 无 | ✅ 有 |
| 并行执行 | ❌ 无 | ✅ 有 |
| 测试报告 | ❌ 无 | ✅ 有 |
| 适合 E2E 测试 | 需配 Jest | 直接开箱即用 |

</div>

> 新项目做 E2E 测试 → 选 Playwright 或 Cypress，**别选 Puppeteer**。

<!--
这个表格是本章核心——让学习者明白 Puppeteer 的边界。
-->

---

# 与 Playwright 的同源关系

- Playwright 是**原 Puppeteer 核心团队**转到微软后的重写
- 两者 API 设计理念非常相近（`page.goto` / `page.click` 等）
- **根本区别**：Playwright 是完整测试框架 + 真正跨浏览器

<br>

| | Puppeteer | Playwright |
|---|---|---|
| 开发者 | Google | Microsoft（原 Puppeteer 团队）|
| 类型 | 自动化库 | 完整测试框架 |
| 浏览器 | Chrome 为主 | Chromium/Firefox/WebKit |
| runner/断言 | ❌ | ✅ 内置 |

<!--
了解历史背景有助于理解两者的相似与差异。
-->

---

# 架构：CDP 直控

```
Node.js 进程
     │
     │  CDP（WebSocket）/ BiDi（双向）
     ▼
 Chrome / Chromium 进程
     │
     ├── Page 1
     ├── Page 2
     └── Page N
```

- **CDP**（Chrome DevTools Protocol）：最底层最直接的控制协议
- Puppeteer 对 CDP 控制力是所有工具中最直接的
- 支持 BiDi（WebDriver BiDi）协议（v21+ 逐步引入）

<!--
CDP 直控是 Puppeteer 的核心优势，对底层 API 的操控力无与伦比。
-->

---

# 安装：两种包的选择

**`puppeteer`（推荐新手）**

```bash
npm install puppeteer
```

- 自动下载匹配版本的 Chrome（约 170–280 MB）
- 开箱即用，无需手动配置浏览器路径

**`puppeteer-core`（CI/服务器场景）**

```bash
npm install puppeteer-core
```

- 不自动下载 Chrome，体积极小
- 需手动指定 `executablePath` 或 `channel`

<!--
puppeteer-core 适合 Docker 镜像、CI 环境等已有 Chrome 的场景。
-->

---

# 第一个脚本

```js
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

await page.goto('https://example.com');
await page.screenshot({ path: 'screenshot.png' });

await browser.close();
```

核心流程：**launch → newPage → goto → 操作 → close**

<!--
最简单的截图脚本，5 行代码展示完整流程。
-->

---

# headless 模式演进

**v21 之前**

- `headless: true` → 旧版 chrome-headless-shell（独立精简版）
- `headless: false` → 有界面模式

**v21+ 新无头（推荐）**

```js
// 新无头：完整 Chrome 内核，无界面
await puppeteer.launch({ headless: true });

// 旧无头 shell（兼容保留）
await puppeteer.launch({ headless: 'shell' });
```

> 新无头 = 完整 Chrome 同内核，渲染行为与有界面模式一致，**推荐使用**。

<!--
headless 模式的演进是 v21 的重要变化，新无头与旧版行为有差异。
-->

---

# Browser / BrowserContext / Page 模型

```
Browser
  ├── BrowserContext（默认，共享 cookie）
  │     ├── Page 1
  │     └── Page 2
  └── BrowserContext（隔离，独立 cookie/storage）
        ├── Page 3（账号 A）
        └── Page 4（账号 B）
```

```js
// 创建隔离上下文（多账号场景）
const ctx = await browser.createBrowserContext();
const page = await ctx.newPage();
await ctx.close(); // 关闭上下文
```

<!--
BrowserContext 隔离是多账号并发场景的关键模式。
-->

---

# 页面导航

```js
// 基础导航
await page.goto('https://example.com', {
  waitUntil: 'networkidle2', // 等待网络基本空闲
});
```

`waitUntil` 选项：

- `load` — 等 load 事件
- `domcontentloaded` — 等 DOMContentLoaded
- `networkidle0` — 0 个网络请求保持 500ms
- `networkidle2` — ≤2 个网络请求保持 500ms

```js
// 等待导航 + 点击（避免竞态）
await Promise.all([
  page.waitForNavigation(),
  page.click('a#submit'),
]);
```

<!--
networkidle2 是 SPA 最常用的等待策略。
-->

---

# $ / $$ 选择器

```js
// 单个元素（ElementHandle）
const btn = await page.$('button.submit');

// 多个元素
const items = await page.$$('ul > li');

// 在页面上下文中取值
const text = await page.$eval('h1', el => el.textContent);

// 批量取值
const hrefs = await page.$$eval('a', els =>
  els.map(el => el.href)
);
```

> `$eval` / `$$eval` 的回调在**浏览器上下文**执行，结果序列化回 Node。

<!--
$eval/$$eval 是最常用的批量数据提取方式，注意上下文隔离。
-->

---

# 扩展选择器

Puppeteer 提供多种超越 CSS 的选择器语法：

```js
// XPath
await page.$('::-p-xpath(//button[@type="submit"])');

// 文本匹配
await page.$('::-p-text(提交)');

// ARIA 角色
await page.$('::-p-aria(Submit Button)');

// Shadow DOM 穿透
await page.$('custom-element >>> button.inner');
```

> 语法前缀 `::-p-` 是 Puppeteer 私有扩展，仅在 Puppeteer API 中有效。

<!--
扩展选择器让 Puppeteer 也能处理复杂的 Shadow DOM 和无障碍场景。
-->

---

# page.evaluate：核心 API

```js
// 在浏览器上下文执行 JS，结果序列化回 Node
const title = await page.evaluate(() => document.title);

// 传参（不能直接闭包引用 Node 变量！）
const url = 'https://example.com';
const result = await page.evaluate((u) => {
  return fetch(u).then(r => r.status);
}, url);
```

**两个上下文完全隔离：**
- Node.js 上下文（你写的代码）
- 浏览器上下文（`evaluate` 里的代码）
- 不能在 evaluate 回调中直接使用 Node 变量，只能通过参数传入

<!--
两上下文隔离是新手最常踩的坑，必须通过参数传递数据。
-->

---

# Locator API（v20+ 推荐）

```js
// 自动等待：可见 + enabled + 位置稳定
await page.locator('button.submit').click();
await page.locator('input#name').fill('张三');
await page.locator('img.hero').hover();

// 等待条件满足
await page.locator('.toast').wait();
```

**优于低层 API 的原因：**
- 自动重试，无需手写 `waitForSelector`
- 自动等待元素可见、可交互、位置稳定
- 减少竞态条件

<!--
Locator API 是现代 Puppeteer 的推荐用法，类似 Playwright 的 locator。
-->

---

# Locator 进阶

```js
// 函数 locator：等待任意条件
await page.locator(() =>
  document.querySelector('.status')?.textContent === '完成'
    ? document.querySelector('.status')
    : null
).wait();

// 过滤
await page
  .locator('li')
  .filter(el => el.textContent.includes('Vue'))
  .click();

// 自定义超时
await page.locator('.slow-element').setTimeout(10_000).wait();
```

<!--
函数 locator 可等待任意动态条件，是处理复杂异步场景的利器。
-->

---

# 截图（强项）

```js
// 基础截图
await page.screenshot({ path: 'page.png' });

// 全页截图
await page.screenshot({
  path: 'full.png',
  fullPage: true,
});

// 指定区域
await page.screenshot({
  clip: { x: 0, y: 0, width: 800, height: 400 },
});

// WebP 格式（更小体积）
await page.screenshot({ type: 'webp', quality: 80 });
```

<!--
截图是 Puppeteer 最经典的使用场景，支持全页、区域裁剪、多格式。
-->

---

# PDF 生成（强项）

```js
// 保留网页颜色（关键！）
await page.emulateMediaType('screen');

// 生成 PDF
await page.pdf({
  path: 'report.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '20mm', bottom: '20mm' },
});
```

> `emulateMediaType('screen')` 确保 CSS 中 `@media print` 不覆盖网页颜色。

**企业场景**：发票生成、报表导出、合同打印 —— Puppeteer 是首选方案。

<!--
PDF 生成是 Puppeteer 的杀手级功能，广泛用于企业报表和发票系统。
-->

---

# 网络拦截

```js
await page.setRequestInterception(true);

page.on('request', (request) => {
  // 拦截图片请求（节省带宽）
  if (request.resourceType() === 'image') {
    request.abort();
    return;
  }
  // Mock API 响应
  if (request.url().includes('/api/user')) {
    request.respond({
      status: 200,
      body: JSON.stringify({ name: '张三' }),
    });
    return;
  }
  request.continue();
});
```

<!--
网络拦截可用于屏蔽资源、Mock API、性能测试等场景。
-->

---

# 配合 jest-puppeteer 做测试

```bash
npm install jest-puppeteer jest
```

```js
// jest.config.js
module.exports = { preset: 'jest-puppeteer' };

// 测试文件：page / browser 自动注入为全局变量
describe('登录页', () => {
  it('标题正确', async () => {
    await page.goto('http://localhost:3000');
    const title = await page.title();
    expect(title).toBe('登录');  // Jest 断言
  });
});
```

> **印证边界**：Puppeteer（操控浏览器）+ Jest（runner + 断言）= 完整测试方案。

<!--
jest-puppeteer 是最常见的 Puppeteer 测试组合，清晰展示了"库+框架"分工。
-->

---

# vs Playwright / Cypress / Selenium

<div class="text-sm">

| | Puppeteer | Playwright | Cypress | Selenium |
|---|---|---|---|---|
| 类型 | 自动化库 | 测试框架 | 测试框架 | 自动化库 |
| runner/断言 | ❌ | ✅ | ✅ | ❌ |
| 浏览器 | Chrome主 | 全三大 | Chrome主 | 全部 |
| CDP控制力 | ★★★ | ★★ | ★ | ★ |
| 适合E2E | 需配Jest | 直接用 | 直接用 | 需配框架 |

</div>

<!--
横向对比让学习者快速定位各工具的适用场景。
-->

---

# 适用场景 + 总结

**选 Puppeteer 的场景：**
- Chrome 爬虫 / 数据采集
- 截图服务 / 可视化回归
- PDF 发票 / 报表生成
- 最小依赖的一次性自动化脚本
- 需要直接操控 CDP 底层 API

**不选 Puppeteer 的场景：**
- E2E 自动化测试 → 选 **Playwright** 或 **Cypress**
- 需要 Safari/WebKit 支持 → 选 **Playwright**
- 需要多浏览器并行 → 选 **Playwright**

> 核心记忆：Puppeteer = 自动化库；测试需配框架。

<!--
最终总结强化核心边界概念，给出清晰的选型建议。
-->
