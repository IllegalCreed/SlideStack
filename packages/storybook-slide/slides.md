---
theme: seriph
background: https://cover.sli.dev
title: Storybook 完全指南
info: |
  Storybook 完全指南：组件隔离开发 · CSF 3 · Controls/Addons · 视觉回归 · 设计系统

  Learn more at [https://storybook.js.org/docs](https://storybook.js.org/docs)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Storybook 完全指南

组件隔离开发 · CSF 3 · Controls / Addons · Storybook 10

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Storybook 是业界事实标准的组件开发环境，本仓库 packages/ui 已使用 @storybook/vue3-vite ^10.3.6。
-->

---
transition: fade-out
---

# 什么是 Storybook

业界事实标准的**组件开发环境**

- **隔离开发**：组件脱离应用路由 / 真实 API / 全局状态在 Canvas 单独渲染
- **状态即用例**：每个状态（loading / error / 满足边界值）都是 story
- **CSF 开放标准**：基于 ES Module，可移植到 Storybook 之外
- **自动文档**：`tags:['autodocs']` 给所有组件生成文档页
- **多 addon 集成**：a11y / Viewport / Actions / Backgrounds / Docs
- **视觉回归闭环**：Chromatic 把每个 story 转为像素级测试用例

> Storybook 不是构建工具，也不是单元测试框架。

<!--
强调：消费已有组件源码，围绕组件构建文档+控件+测试+视觉回归工作流。
-->

---

# 三配置文件 · 三作用域

| 文件 | 作用 |
|------|------|
| `.storybook/main.ts` | 项目级行为：stories / addons / framework / builder |
| `.storybook/preview.ts` | Canvas 全局：decorators / parameters / globalTypes |
| `.storybook/manager.ts` | UI 主题：addons.setConfig |

**三层作用域**（下层覆盖上层）

- global（preview.ts）→ component（meta）→ story
- 公共包装放 preview，组件特有放 meta，个别 story 覆盖放 story 对象

> 框架 framework 必须是 `{ name, options }` 对象，不能写成字符串。

<!--
避免在每个 story 重复样板，是 Storybook 配置的核心思路。
-->

---

# CSF 3 速览

```ts
import type { Meta, StoryObj } from "@storybook/vue3";
import Button from "./Button.vue";

const meta = {
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: "md", label: "Button" },
};
export const Large: Story = {
  args: { ...Default.args, size: "lg" }, // 展开复用
};
```

> CSF3 对象式 + `satisfies Meta` + 自动 title 推断，取代 CSF2 的 Template.bind({})。

<!--
CSF3 的核心：default export meta + 多个 named export story + 类型 API。
-->

---

# CSF 2 vs CSF 3

| 维度 | CSF 2（旧） | CSF 3（推荐） |
|------|------|------|
| Story 写法 | 函数式 + Template | 对象式 `{ args: {...} }` |
| 复用 | `Template.bind({})` | 展开 `{ ...Default.args }` |
| 类型 API | `ComponentMeta` | `Meta` / `StoryObj` |
| title | 必须手写 | 自动按文件路径推断 |

**升级 codemod**

```bash
npx storybook migrate csf-2-to-3 --glob="**/*.stories.tsx"
```

> CSF 1/2/3 不会被废弃，可与新写法共存于同一项目（同一文件不能混用）。

<!--
CSF3 不是「重写」，是用对象+展开简化函数式样板。
-->

---
layout: two-cols
---

# args / ArgTypes

**args**：story 动态输入（修改 → Controls 实时改；多 story 用 `...Default.args` 复用）

**ArgTypes**：args 元数据

- `control` 类型（select/radio/color/number...）+ `options` 枚举值
- `description` 文档描述
- `table.disable` 完全移除 / `control:false` 仅关控件

::right::

# Control 类型族

| 类型 | 用途 |
|------|------|
| boolean | 开关 |
| number / range | 数字 / 滑块 |
| text | 文本 |
| select / radio / check | 单选 / 多选 |
| color / date | 颜色 / 日期 |
| object / file | JSON / 文件 |

> `presetColors` / `min` / `max` / `step` / `accept` 配置可选。

<!--
控件类型直接根据 prop 类型自动推断，可手动覆盖。
-->

---

# Essentials 八件套

`@storybook/addon-essentials` 一包八个（亦可单装 a11y/docs/interactions）

| 插件 | 作用 |
|------|------|
| **Actions** | 捕获事件回调（onClick 等） |
| **Controls** | 自动参数控件 |
| **Backgrounds** | 切换 Canvas 背景色 |
| **Viewport** | 响应式视口预设 |
| **Measure / Outline / Highlight** | 测量 / 轮廓 / 高亮 DOM |
| **Toolbars** | 全局工具栏 |

**禁用单个**：`features: { backgrounds: false, measure: false, outline: false }`

<!--
Essentials 装一次拿八个最常用插件，是 Storybook 项目的标配。
-->

---

# Actions 三种回调注入

| 方式 | 来源 | play 函数 spy | 用途 |
|------|------|------|------|
| **`fn()`** | `storybook/test` | ✅ **可用** | 推荐 |
| `action()` | `@storybook/addon-actions` | ❌ | 仅日志 |
| `argTypesRegex: /^on.*/` | 自动匹配 | ❌ **不可用** | 已不推荐 |

**推荐写法**

```ts
import { fn } from "storybook/test";
export const Default: Story = {
  args: { onClick: fn() }, // 既记录日志又能 spy
  play: async ({ args }) => {
    expect(args.onClick).toHaveBeenCalled();
  },
};
```

> 自动注入的 args 官方明确「are not available as spies in your play function」。

<!--
fn() 是兼容 jest 的 spy，能在 play 函数里 expect，是现代标准写法。
-->

---
layout: two-cols
---

# addon-a11y

底层 axe-core，约 57% WCAG 自动覆盖

- 面板分 **Violations / Passes / Incomplete**
- `parameters.a11y.test` 三档：
  - `off` 完全关
  - `todo`（默认）仅展示
  - `error` CI 失败

**局部禁用规则**

```ts
parameters: {
  a11y: {
    config: {
      rules: [
        { id: "color-contrast", enabled: false },
      ],
    },
  },
}
```

::right::

# 视觉回归（Chromatic）

每个 story = 一个视觉测试用例

- 首次跑 = baseline 快照
- 后续 = **像素级比对**
- 支持**跨浏览器 / 视口 / 主题**

**vs HTML 快照**

| 维度 | jest snapshot | Chromatic |
|------|------|------|
| 比对对象 | HTML 标记 | 用户看到像素 |
| 重构误报 | 高 | 低 |
| 信噪比 | 低 | 高 |

> 视觉比的是「用户看到的」而非「代码」。

<!--
a11y 渐进式：todo 默认 → 修复存量 → 改 error 防回归。
-->

---

# play 函数交互测试

```ts
import { expect, fn, userEvent, within } from "@storybook/test";

export const FormSubmit: Story = {
  args: { onSubmit: fn() },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step("输入邮箱", async () => {
      await userEvent.type(
        canvas.getByLabelText("邮箱"), "a@b.com"
      );
    });
    await userEvent.click(
      canvas.getByRole("button", { name: /提交/i })
    );
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};
```

**CI 自动化**：`test-runner`（独立进程）或 `addon-vitest`（Vitest 集成）

> play 函数聚焦组件交互断言；纯函数测试仍归 Vitest/Jest。

<!--
play 函数是 Testing Library 风格的 DOM 断言，但跑在 Storybook Canvas 里。
-->

---
layout: quote
---

# 「Storybook 不是单元测试框架」

play 函数 + test-runner/addon-vitest 才进入自动化测试范畴；
纯函数 / reducer / util 的测试仍归 Vitest / Jest——职责混淆两边都慢。

---

# 设计系统集成

Storybook 作为设计系统**统一门户**

- **tokens**（colors / typography / spacing）→ 各自 .stories.ts 展示
- **primitives**（Button / Input / Card）→ 每组件一 .stories.ts
- **patterns**（Form / DataTable）→ 复合模式 stories
- **pages**（整页 demo）→ 真实业务场景

**主题切换**：globalTypes.theme + decorator 注入 ThemeProvider

**Figma 集成**：`storybook-addon-designs` 在 Docs 嵌入设计稿

**跨项目复合**：main.ts 的 `refs` 聚合多库 Storybook

> autodocs 让组件一多文档与 props 不漂移。

<!--
Storybook 不只是开发工具，也是设计系统的对外展示门户。
-->

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 继续用 CSF2 函数式不升级（用 codemod 迁移）
- mock 数据命名导出不配 `excludeStories`（污染侧边栏）
- 用 `argTypesRegex` 还指望在 play 里 spy（改用 `fn()`）
- 为消 a11y 告警全局关掉检查（按 rule id 局部禁用）
- 在 story 写真实 API 调用（破坏视觉回归稳定性）
- `framework` 写成字符串、漏 `viteFinal`（样式在 Canvas 走样）
- 把纯逻辑单元测试塞进 Storybook（归 Vitest/Jest）

<!--
七条都是生产中最常见的反模式，按 rule id 局部禁用是关键。
-->

---
layout: center
class: text-center
---

# Storybook 10 与下一代

**Storybook 10**（2025-10，当前主线）

- **ESM-only 包分发**（v9 已减 50%，10 再降 29%）
- CSF 3 仍是默认推荐
- Angular-vite 框架（preview）

**CSF Factories**（下一代实验性）

- `defineMain` → `definePreview` → `preview.meta` → `meta.story`
- 端到端类型安全（含 addon parameters/globals）
- subpath imports（`#.storybook/preview`）
- React 完整支持，Vue/Angular/Svelte 推进中

> CSF 1/2/3 不会被废弃，可与 Factories 分文件混用。

<!--
本仓库 packages/ui 已使用 @storybook/vue3-vite ^10.3.6。
-->

---
layout: center
class: text-center
---

# 小结

Storybook = 组件隔离开发环境

CSF 3 · Controls / Addons · 视觉回归 · Storybook 10

**autodocs 一键文档 · fn() 用于 play · Chromatic 像素级回归**

[文档](https://storybook.js.org/docs) · [CSF 规范](https://storybook.js.org/docs/api/csf) · [GitHub](https://github.com/storybookjs/storybook)

<!--
掌握三配置 + 三作用域 + fn() + autodocs，就能把 Storybook 用到生产水准。
-->
