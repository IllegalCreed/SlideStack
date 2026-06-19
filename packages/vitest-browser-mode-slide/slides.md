---
theme: seriph
background: https://cover.sli.dev
title: Vitest Browser Mode
info: |
  Presentation Vitest Browser Mode for developers.

  Learn more at [https://vitest.dev/guide/browser/](https://vitest.dev/guide/browser/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:vitest class="text-8xl" />
</div>

<br/>

## Vitest Browser Mode：真实浏览器跑组件测试

v4 转正 · Playwright 驱动 · 语义 Locator · 内置重试断言（基于 v4.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天讲 Vitest Browser Mode——Vitest v4 正式转正的「在真实浏览器里跑组件测试」能力。

它用 Playwright / WebdriverIO 驱动真实的 Chromium / Firefox / WebKit，取代 jsdom 的 DOM 模拟，让组件测试的置信度大幅提升。
-->

---
transition: fade-out
---

# 什么是 Browser Mode？

在真实浏览器里跑 Vitest 测试

<v-click>

- **v4 正式转正**：脱离 experimental，成为一等功能
- **真实浏览器驱动**：Playwright / WebdriverIO 驱动 Chromium / Firefox / WebKit
- **取代 DOM 模拟**：不再依赖 jsdom / happy-dom 在 Node 里模拟
- **与 Vite 同源**：复用 `vite.config.ts`，零额外配置负担

</v-click>

<div v-click text-xs mt-8>

_[vitest.dev/guide/browser](https://vitest.dev/guide/browser/)_

</div>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Browser Mode 的四个核心要点。

v4 之前它是 experimental，v4 起正式转正，API 稳定可放心使用。

[click] 官方文档地址，文档很完整。
-->

---
transition: fade-out
---

# 为什么真实浏览器优于 jsdom？

置信度 vs 速度的权衡

<v-click>

| 维度 | jsdom / happy-dom | Browser Mode |
| --- | --- | --- |
| 环境 | Node 内模拟 DOM | 真实浏览器 |
| CSS 布局 | 不支持 | 完整支持 |
| 速度 | 快 | 慢（启动浏览器） |
| 误报风险 | 较高 | 低 |
| 浏览器 API | 部分不一致 | 原生支持 |

</v-click>

<v-click>

> 二者不是替代关系——**纯逻辑用 jsdom（快），组件交互 / CSS 关键路径用 Browser Mode（准）**

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 对比表列清楚了两者的差异。jsdom 快但有误报风险，Browser Mode 准但要启动真实浏览器。

[click] 关键结论：并存，分层使用，不是二选一。
纯逻辑单测继续用 jsdom；组件交互、CSS、浏览器 API 才升级到 Browser Mode。
-->

---
transition: fade-out
---

# 安装：脚手架与手动安装

两种方式选其一

<v-click>

**方式一：脚手架（最快）**

```bash
npx vitest init browser
```

</v-click>

<v-click>

**方式二：手动安装 Playwright provider**

```bash
pnpm add -D @vitest/browser-playwright
# 测 Vue 组件还需要
pnpm add -D vitest-browser-vue
```

</v-click>

<v-click>

**装完后安装浏览器**（Playwright 需要）

```bash
npx playwright install chromium
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 脚手架一行搞定，会帮你选 provider 并生成配置，新项目首选。

[click] 手动安装更灵活，可精细控制。vitest-browser-vue 是 Vue 组件测试的适配包。

[click] Playwright provider 需要单独安装浏览器二进制，这步不能漏。
-->

---
transition: fade-out
---

# 基础配置

`vitest.config.ts` 核心字段

<v-click>

```ts
export default defineConfig({
  plugins: [vue()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
});
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 最小配置四个字段：enabled 开关、provider 选用 playwright、headless CI 无头、instances 至少一个浏览器实例。

注意：v4 的 provider 从字符串改成了函数调用——`playwright()`，不是 `"playwright"`。
headless 必须写在 test.browser.headless，写在 provider 的 launchOptions 里会被 Vitest 忽略。
-->

---
transition: fade-out
---

# Provider 对比

<v-click>

| provider | 安装包 | 浏览器 | 适用 |
| --- | --- | --- | --- |
| `playwright`（推荐） | `@vitest/browser-playwright` | chromium / firefox / webkit | 主流，CDP 支持 |
| `webdriverio` | `@vitest/browser-webdriverio` | chrome / firefox / safari | Selenium 兼容 / 真机 |
| `preview` | `@vitest/browser-preview` | Vite iframe | 仅本地预览，不适合 CI |

</v-click>

<v-click>

**Playwright provider 进阶配置**

```ts
provider: playwright({
  launchOptions: { slowMo: 50 },
  actionTimeout: 5000,
})
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三个 provider 定位清楚：Playwright 是主流选择，支持 CDP 和 frameLocator；webdriverio 适合需要 Selenium 兼容或真机测试；preview 只能本地看看，CI 里不能用。

[click] Playwright 的 slowMo 在调试时很实用，可以放慢操作速度，便于观察。
-->

---
transition: fade-out
---

# 多浏览器：browser.instances

v4 核心特性，共享单个 Vite server

<v-click>

```ts
browser: {
  instances: [
    { browser: "chromium" },
    { browser: "firefox" },
    { browser: "webkit" },
  ],
}
```

</v-click>

<v-click>

**同一浏览器多配置（需指定 name）**

```ts
instances: [
  { browser: "chromium", name: "ratio-1",
    provide: { ratio: 1 } },
  { browser: "chromium", name: "ratio-2",
    provide: { ratio: 2 } },
]
```

</v-click>

<v-click>

```bash
vitest --project=chromium   # 只跑指定实例
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] instances 是 v4 取代旧 projects 的多浏览器写法，共享同一 Vite server，比多个 projects 启动快。

[click] provide 字段可以向测试注入不同值，适合测「同一组件在不同配置下」的行为。

[click] --project 过滤让你只跑某个浏览器，调试时省时间。
-->

---
transition: fade-out
---

# Vue 组件测试配置

`vitest-browser-vue` + setupFiles

<v-click>

```ts
export default defineConfig({
  plugins: [vue()],
  test: {
    setupFiles: ["vitest-browser-vue"],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
});
```

</v-click>

<v-click>

- `setupFiles` 注册 `vitest-browser-vue` 会自动挂载**测试后清理钩子**
- 每个测试结束后自动卸载组件、清理 DOM
- 无需手写 `afterEach(() => cleanup())`

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] vitest-browser-vue 写在 setupFiles 里，会在每个测试文件前加载，注册 afterEach 清理钩子。

[click] 自动清理是避免测试间 DOM 污染的关键。以前用 Vue Test Utils 要手动 cleanup，这里开箱即得。
-->

---
transition: fade-out
---

# 第一个组件测试

render + locator + 断言

<v-click>

```ts
import { render } from "vitest-browser-vue";
import Counter from "./Counter.vue";

test("点击递增", async () => {
  const screen = render(Counter, { props: { initialCount: 1 } });

  // 语义查询 + 真实点击
  await screen.getByRole("button", { name: "Increment" }).click();

  // 内置重试断言
  await expect.element(screen.getByText("Count is 2")).toBeVisible();
});
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三步走：render 渲染组件、getByRole 语义查询、expect.element 带重试断言。

和 Vue Test Utils + jsdom 的三大差别：
1. 用 getByRole 等语义 locator，而非 wrapper.find(".class")
2. 用 await .click() 触发真实浏览器事件
3. 用 expect.element() 而非 expect()，内置重试不用 nextTick
-->

---
transition: fade-out
---

# Locators 语义查询

优先级从高到低

<v-click>

```ts
import { page } from "vitest/browser";
// ARIA 角色（首选，语义最强）
page.getByRole("button", { name: /submit/i });
page.getByRole("textbox", { name: "用户名" });
page.getByRole("heading", { level: 1 });
// 表单 / 文本 / placeholder
page.getByLabelText("邮箱");
page.getByText("Hello", { exact: true });
page.getByPlaceholder("请输入姓名");
page.getByAltText(/logo/i);
// data-testid（兜底）
page.getByTestId("submit-btn");
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 优先级和 Testing Library 一致：getByRole 语义最强放第一，getByTestId 是兜底。

为什么优先 getByRole？它反映用户真正看到和操作的东西，测试更贴近用户视角，重构时 class 名改了但 role 没变，测试不会误报。

注意 v4 的 import 路径从 @vitest/browser/context 改成了 vitest/browser。
-->

---
transition: fade-out
---

# Locators 三大特性

惰性 · 自动重试 · 可链式

<v-click>

**1. 惰性（lazy）**：创建时不立即查 DOM，只在交互 / 断言时查找，避免竞态

**2. 自动重试**：交互和断言在超时前不断重试，无需手写 `nextTick` / `waitFor`

**3. 可链式**：组合查询精确定位

```ts
// 链式：列表中第一项
page.getByRole("list").getByRole("listitem").nth(0);
page.getByRole("listitem").first();
page.getByRole("listitem").last();

// filter：范围缩小（类似 within）
page
  .getByRole("article")
  .filter({ hasText: "Vitest" })
  .getByRole("button", { name: "Edit" });
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三大特性相互配合：惰性避免了"元素还没渲染就查"的竞态；自动重试替代了手写 nextTick；链式让复杂 DOM 结构也能精准定位。

filter 相当于 Testing Library 的 within，可以把查询范围限定在某个容器内。
-->

---
transition: fade-out
---

# Locators 组合与 DOM 访问

and / or / elements

<v-click>

**逻辑组合**

```ts
// 同时满足两个条件
page.getByRole("button").and(page.getByText("Submit"));

// 满足任一条件
page.getByRole("textbox").or(page.getByRole("searchbox"));
```

</v-click>

<v-click>

**直接访问 DOM 元素**（需要原生元素时）

```ts
const el = locator.element();        // 同步，无匹配抛错
const maybe = locator.query();       // 同步，无匹配返回 null
const all = locator.elements();      // 同步，返回数组
const found = await locator.findElement(); // 异步，等待出现
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] and / or 让你用语义 API 组合条件，而不是写 CSS 选择器。

[click] 有时需要原生 DOM 元素（传给第三方库等场景），element() / query() / elements() 都是同步的，findElement() 异步等待出现。
element() 和 query() 的区别：找不到时前者抛错、后者返回 null。
-->

---
transition: fade-out
---

# userEvent 真实交互

CDP / WebDriver 驱动，不是模拟事件

<v-click>

```ts
import { page, userEvent } from "vitest/browser";

// 两种等价风格（推荐链式）
await userEvent.click(page.getByRole("button", { name: "Submit" }));
await page.getByRole("button", { name: "Submit" }).click();
```

</v-click>

<v-click>

**常用 API**

```ts
await userEvent.dblClick(el);
await userEvent.tripleClick(el);   // 三连击全选文本

// fill 快速设值 / type 逐键模拟
await userEvent.fill(input, "hello");
await userEvent.type(input, "{Shift}Hello");
await userEvent.clear(input);

await userEvent.tab();
await userEvent.selectOptions(select, ["选项1"]);
await userEvent.hover(el);
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] userEvent 底层是真实浏览器驱动，不是 @testing-library/user-event 那种在 JS 层模拟。事件冒泡、focus 顺序、输入法行为都和用户真实操作一致。

[click] fill 和 type 的区别：fill 直接设值，适合填表格；type 逐键触发，支持 {Shift} 等特殊键，适合测键盘交互逻辑。
-->

---
transition: fade-out
---

# expect.element 内置重试断言

异步 · 自动等待 · 超时才失败

<v-click>

```ts
// ✅ 带重试（推荐）
await expect.element(locator).toBeVisible();

// 配置超时和轮询间隔
await expect.element(locator, {
  timeout: 3000,
  interval: 100,
}).toBeVisible();

// ⚠️ 不加 await 则立即判断，无重试
```

</v-click>

<v-click>

**TypeScript 类型提示**

```ts
/// <reference types="vitest/browser" />
// 在测试文件顶部加这行，获得 expect.element 的 matcher 类型
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] expect.element 是 Browser Mode 断言的核心——它不是立即判断，而是在超时前不断重试，直到条件满足或超时失败。
这替代了以前手写 waitFor / nextTick 的模板代码。
务必加 await，否则断言在测试结束前还没执行，会漏报。

[click] TypeScript 用户需要加三斜线引用，才能拿到 expect.element 的 matcher 类型提示。
-->

---
transition: fade-out
---

# 常用 Matcher（上）

可见性 · 表单状态

<v-click>

**可见性 / 视口**

```ts
await expect.element(el).toBeVisible();
await expect.element(el).toBeInViewport();     // 支持 ratio 参数
await expect.element(el).toBeInTheDocument();
```

</v-click>

<v-click>

**表单状态**

```ts
await expect.element(el).toBeDisabled();
await expect.element(el).toBeChecked();
await expect.element(el).toHaveFocus();
await expect.element(el).toBeRequired();
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 可见性 matcher 区别：toBeVisible 检查是否在视觉上可见（不含 display:none / visibility:hidden）；toBeInViewport 检查是否在视口内（可传 ratio 参数，如 0.5 表示至少 50% 在视口）；toBeInTheDocument 只检查是否在 DOM 里。

[click] 表单 matcher 覆盖了常见的 disabled / checked / focus / required 状态，全部带内置重试。
-->

---
transition: fade-out
---

# 常用 Matcher（下）

内容 · 属性 · 无障碍

<v-click>

**内容 / 属性**

```ts
await expect.element(el).toHaveTextContent(/hello/i);
await expect.element(el).toHaveValue("Alice");
await expect.element(el).toHaveClass("btn", "btn--primary");
await expect.element(el).toHaveAttribute("href", "/about");
```

</v-click>

<v-click>

**无障碍**

```ts
await expect.element(el).toHaveRole("button");
await expect.element(el).toHaveAccessibleName("提交");
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 内容和属性 matcher 都支持字符串或正则，toHaveClass 可以传多个类名。

[click] 无障碍 matcher 是亮点：用 toHaveAccessibleName 断言 aria-label / aria-labelledby，保证组件对屏幕阅读器友好。

[click] emitted() 读事件，rerender 和 unmount 控制组件生命周期，和 Vue Test Utils 的 API 概念一致，迁移成本低。
-->

---
transition: fade-out
---

# 视觉回归 toMatchScreenshot

<v-click>

```ts
import { page } from "vitest/browser";

test("hero 外观回归", async () => {
  await expect.element(page.getByTestId("hero")).toMatchScreenshot("hero");
});
```

</v-click>

<v-click>

**工作流**

1. **首次**：生成基准图（存 `__screenshots__/`）
2. **后续**：与基准对比，超阈值失败并生成 diff 图
3. **更新基准**：`vitest --update`

</v-click>

<v-click>

**全局配阈值**

```ts
browser: {
  expect: {
    toMatchScreenshot: { comparatorOptions: { allowedMismatchedPixelRatio: 0.01 } },
  },
}
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] toMatchScreenshot 是 v4 新增的视觉回归 API，直接在组件测试里做截图对比，不需要另起一套工具。

[click] 三步工作流很直觉：首次生成基准，后续对比，更新就加 --update。
Vitest 会自动多次截图直到稳定，防止动画未结束就截图导致误判。

[click] 阈值配置让你容忍 1% 以内的像素差异，避免字体渲染细微差别引起误报。
注意：browser.screenshotFailures 是另一回事——测试失败时自动截图用于调试，不是视觉回归。
-->

---
transition: fade-out
---

# vs jsdom：取舍指南

并存，分层，不是二选一

<v-click>

| 场景 | 推荐 | 理由 |
| --- | --- | --- |
| 纯逻辑 / 工具函数 | jsdom | 快，不需要浏览器 |
| 组件交互 / 事件 | Browser Mode | 真实事件，置信度高 |
| CSS 布局 / 视觉 | Browser Mode | jsdom 无布局引擎 |
| 浏览器 API（Web API） | Browser Mode | jsdom 部分不一致 |
| 简单渲染 / Props 测试 | jsdom | 速度优先 |

</v-click>

<v-click>

同一项目 `vitest.config.ts` 里可同时配 node/jsdom pool 和 browser pool，按文件路径分流：

```ts
// 测试文件命名约定：*.browser.test.ts → browser pool
// 其余 → jsdom pool
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 决策矩阵。核心原则：纯逻辑不需要浏览器，用 jsdom 最快；涉及真实交互、CSS、浏览器 API 才升级到 Browser Mode。

[click] 实际项目里两套可以共存，用文件命名约定分流，CI 里两个 pool 并行跑，速度和置信度都兼顾。
-->

---
transition: fade-out
---

# vs Playwright CT：边界划分

单组件 vs 页面级流程

<v-click>

| 维度 | Vitest Browser Mode | Playwright CT |
| --- | --- | --- |
| 框架 | Vitest（Vite 原生） | Playwright（独立） |
| 配置 | 复用 vite.config，轻 | 独立 config，重 |
| 与单测整合 | 同一 vitest 命令 | 独立运行 |
| 适合 | 单组件行为 / 视觉回归 | 多组件 / 页面级流程 |

</v-click>

<v-click>

**推荐分层策略**

- **纯逻辑** → jsdom 单测（快）
- **单组件交互** → Vitest Browser Mode（轻、与单测同命令）
- **多页面流程** → Playwright E2E（完整场景）

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vitest Browser Mode 和 Playwright CT 都是「真实浏览器跑组件测试」，但定位不同。
Browser Mode 轻，复用 Vite 配置，和单元测试同一套命令；Playwright CT 独立，适合更复杂的页面级场景。

[click] 三层分层是当前社区推荐的最佳实践。大部分项目不需要同时用 Browser Mode 和 Playwright CT，按场景选一个即可。
-->

---
transition: fade-out
---

# Headless 与调试

CI 无头 · 本地有头 · VSCode 断点

<v-click>

**headless 控制**

```bash
# CI：自动无头（browser.headless 默认 = process.env.CI）

# 本地调试：有头，看到浏览器窗口
vitest --browser.headless=false
```

</v-click>

<v-click>

**v4 新增：VSCode Debug Test 按钮**

- 自动以 **headed + pause** 启动
- 可在浏览器 DevTools 里设断点
- 无需手动改配置

</v-click>

<v-click>

**失败自动截图**（调试辅助）

```ts
browser: { screenshotFailures: true }
// 失败时自动截图，保存在 __screenshots__/
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] headless 默认跟随 CI 环境变量，本地调试时加 --browser.headless=false 就能看到真实浏览器窗口，非常直观。

[click] VSCode 的 Debug Test 按钮是 v4 新增体验，一键打开有头浏览器并暂停，可以直接在 DevTools 里调试，比以前方便很多。

[click] screenshotFailures 在 CI 里非常实用：测试失败时自动截图，可以下载 CI artifacts 看到失败现场。
-->

---
transition: fade-out
---

# v4 Import 路径变更

统一从 `vitest/browser` 导入

<v-click>

```ts
// ✅ v4：统一从 vitest/browser 导入
import { page, userEvent, commands, cdp, server } from "vitest/browser";

// ❌ 旧：@vitest/browser/context 已废弃
import { page } from "@vitest/browser/context";
```

</v-click>

<v-click>

**v4 其他破坏性变更**

- `provider` 从字符串改为函数调用：`playwright()` 不是 `"playwright"`
- 每个 provider 拆分成独立包：`@vitest/browser-playwright` / `@vitest/browser-webdriverio`
- `browser.instances` 取代旧的多 `projects` 写法

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v4 的 import 路径统一了，之前分散在不同地方的 page / userEvent 都集中到 vitest/browser，更整洁。
旧的 @vitest/browser/context 已经废弃，迁移时搜一下替换掉。

[click] v4 三个破坏性变更汇总在这里，从 v3 迁移时需要逐项检查。最容易漏的是 provider 从字符串改成函数调用。
-->

---
layout: intro
transition: fade-out
---

# 总结

真实浏览器 · 语义查询 · 内置重试 · 视觉回归

- **Browser Mode v4 转正**：API 稳定，Playwright 驱动真实浏览器
- **语义 Locator**：`getByRole` 优先，惰性 + 自动重试，可链式
- **userEvent 真实事件**：`fill` 填表、`type` 逐键、`click` 真实驱动
- **expect.element 重试断言**：替代手写 `nextTick`，务必 `await`
- **视觉回归 toMatchScreenshot**：v4 新增，截图对比，自动防动画误判
- **并存分层**：逻辑 → jsdom / 组件 → Browser Mode / 页面 → Playwright E2E

<div class="abs-br m-6 text-xl">
  <a href="https://vitest.dev/guide/browser/" target="_blank" class="slidev-icon-btn">
    <logos:vitest />
  </a>
  <a href="https://github.com/vitest-dev/vitest" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/frontend-develop-tools/testing/component-testing/vitest-browser-mode/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
六条精华总结：

1. v4 转正，API 稳定可放心用
2. Locator 语义查询是核心思维转变，从 CSS 选择器转向用户视角
3. userEvent 真实事件，fill / type / click 各有适用场景
4. expect.element 必须 await，内置重试是最大便利
5. toMatchScreenshot 是 v4 送的视觉回归，不需要额外工具
6. 分层使用，不要把所有测试都迁到 Browser Mode，按需选择
-->

---
layout: end
---
