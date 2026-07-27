---
theme: seriph
background: https://cover.sli.dev
title: Styleguidist 完全指南
info: |
  react-styleguidist 完全指南：Markdown 驱动 · Props 表自动生成 · 隔离渲染

  Learn more at [https://react-styleguidist.js.org](https://react-styleguidist.js.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Styleguidist 完全指南

Markdown 驱动的 React 组件文档工具 · 13.1.4

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Styleguidist 由 Artem Sapegin 长期维护，是 React 生态 Markdown 驱动的组件文档工具。
-->

---
transition: fade-out
---

# 什么是 Styleguidist

Markdown 驱动的 **React 组件文档工具**

- **本质**：示例即文档，fenced ```jsx 渲染为可交互可编辑组件
- **官方定位**：Isolated React component development environment with a living style guide
- **核心能力**：Markdown 写示例 + Props 表自动生成 + 隔离渲染
- **React 专用**：不支持 Vue / Angular / Svelte
- **CRA 零配置**：开箱即用扫 `src/components/**/*.{js,jsx,ts,tsx}`
- **类比**：商店橱窗（storefront），重文档可读性

> 示例即文档，文档与代码零距离。

<!--
核心定位三件事：Markdown 驱动、风格指南、React 专用。
-->

---

# 三大核心能力

| 能力 | 机制 |
|------|------|
| **示例即文档** | fenced ```jsx 编译成可交互真实组件 + 浏览器内联编辑器 |
| **Props 表自动生成** | `react-docgen` 静态分析 propTypes + JSDoc 注释 |
| **隔离渲染** | 每个示例在浏览器独立编译（Bublé 转译），互不污染 |

**附加能力**

- 通过 `styleguideComponents.Wrapper` 注入 Redux / Theme / Intl Provider
- 大型库用 `sections` 分组 + `pagePerSection` 拆页
- 支持 TypeScript（配 `react-docgen-typescript`）

<!--
react-docgen 是静态分析器，不执行 JS——这是它无法穿透 HOC 的根本原因。
-->

---

# 安装与启动

```bash
# 安装
npm install --save-dev react-styleguidist

# CRA 项目零配置启动（默认 http://localhost:6060）
npx styleguidist server

# 构建静态文档站（输出到 styleguide 目录）
npx styleguidist build
```

**package.json 脚本**

```json
{
  "scripts": {
    "styleguide": "styleguidist server",
    "styleguide:build": "styleguidist build"
  }
}
```

> CRA 零配置前提：组件位于 `src/components/`，扩展名 `.js` / `.jsx`。

<!--
非 CRA 项目需要一份 styleguide.config.js。
-->

---

# styleguide.config.js

配置入口（CommonJS 导出对象）

```js
module.exports = {
  // 组件 glob（默认 CRA 兼容）
  components: "src/components/**/[A-Z]*.{js,jsx,ts,tsx}",

  // 跳过无示例文件的组件（建议开启）
  skipComponentsWithoutExample: true,

  // 示例代码与 Props 表初始展开状态
  exampleMode: "collapse",
  usageMode: "collapse",

  // 大型库按 section 拆页
  pagePerSection: true,
};
```

> 一旦显式设置 `webpackConfig`，**不再自动读项目根 webpack.config.js**。

<!--
显式设了 webpackConfig 就要手动 require 合并项目配置。
-->

---

# Markdown 写法

在组件同目录放 `Readme.md`：

````text
```jsx
<Button kind="primary">点击我</Button>
```
````

**代码块语言语义**

- ` ```jsx ` / ` ```js ` → 交互式可编辑示例
- ` ```bash ` / ` ```json ` → 仅高亮源码
- 无语言标签 → 交互式（向后兼容）

**修饰符**

- `padded`：示例间增加内边距
- `noeditor`：仅渲染不显示编辑器
- `static`：仅高亮源码

<!--
代码块语言标签决定渲染行为，是最易混淆的点。
-->

---

# 代码示例自动生成

Markdown 示例被编译成可交互的真实 React 组件

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>点击 {count}</button>;
}

<Counter />;
```

**支持 Hooks**：每个示例相当于一个函数组件

**关键限制**

- `import` **仅能在 Markdown 源文件**里写
- 浏览器内联编辑器**不支持** `import`
- 复杂 helper 用 `require` 全局注入

<!--
浏览器编辑器里改代码只能调 props / JSX，不能加新的 import。
-->

---
layout: two-cols
---

# Props 表自动生成

`react-docgen` 静态分析

- **prop 名称、类型**：从 propTypes
- **是否必填**：从 isRequired
- **默认值**：从 defaultProps
- **描述**：从 JSDoc `/** */`

**TypeScript 支持**

默认 `react-docgen` 不解析 node_modules 的 TS 类型注解

- 装 `react-docgen-typescript`
- 配 `propsParser` 替换默认解析器

::right::

# JSDoc 标签

| 标签 | 作用 |
|------|------|
| `@ignore` | 隐藏 prop |
| `@public` | 公开方法 |
| `@component` | **styled 标记** |
| `@visibleName` | 自定义显示名 |
| `@example` | 关联示例文件 |

> styled-components **必须加** `/** @component */` 才能被 docgen 识别。

<!--
@component 是 styled-components 进入文档的唯一开关。
-->

---
layout: two-cols
---

# 隔离渲染

每个示例在浏览器独立编译

- **Bublé 转译**：浏览器端 ES6+ 转换
- **独立作用域**：示例互不污染
- **支持 Hooks**：useState / useEffect

**Wrapper 注入 Provider**

通过 `styleguideComponents.Wrapper` 统一注入：

- Redux Provider
- ThemeProvider
- IntlProvider

::right::

# 双重导出

HOC / styled 包裹无法被 docgen 识别

```jsx
// 命名导出：基础组件（生成文档）
export function Link({ to, children }) {
  return <a href={to}>{children}</a>;
}

Link.propTypes = { /* ... */ };

// 默认导出：增强组件（供渲染）
export default withRouter(Link);
```

> 单文件仅 1 个 default 或 1 个 named export。

<!--
多 named export 官方警告「不可靠」。
-->

---

# Styleguidist vs Storybook

| 维度 | Styleguidist | Storybook |
|------|------|------|
| **驱动** | Markdown | CSF |
| **展示·受众** | 多组件变体同页 / 开发·设计·产品 | 一次一个变体 / 主要开发者 |
| **强项** | 文档可读性（storefront） | addon / 视觉回归（workshop） |
| **测试·框架** | 无 / React 专用 | stories + play / 多框架 |

**何时选 Styleguidist**：重视文档可读性、Markdown 习惯、CRA 零配置

**何时选 Storybook**：需要 addon / 视觉回归 / 跨框架

> 二者并非二选一——可同时用。

<!--
storefront vs workshop 是官方类比，便于记忆。
-->

---
layout: quote
---

# 示例即文档

「把示例写在 Markdown 里，它就是你的文档、你的演示、你的设计稿、你的测试用例。」

—— Styleguidist 核心理念

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 单文件多 named 组件（行为不可靠）
- 浏览器编辑器写 `import`（不支持）
- HOC 不双重导出（docgen 不识别）
- styled 用对象写法漏 `@component`
- 设 `webpackConfig` 后指望自动读项目根 webpack
- `webpackConfig` 里放 HtmlWebpackPlugin（会被忽略）
- 示例里 `require.context`（无访问权）
- 不开 `skipComponentsWithoutExample`
- 指望它做视觉回归 / addon / 组件测试

<!--
这些反模式都来自官方文档明确警告。
-->

---
layout: center
class: text-center
---

# 小结

Styleguidist = Markdown 驱动的 React 组件文档工具

三大能力 · 配置灵活 · 与 Storybook 互补 · 13.1.4

**Markdown 即文档 · Props 表自动 · 隔离渲染**

[文档](https://react-styleguidist.js.org) · [GitHub](https://github.com/styleguidist/react-styleguidist)

<!--
掌握 Markdown 驱动 + Wrapper 注入 + 双重导出，就能把 Styleguidist 用到生产水准。
-->
