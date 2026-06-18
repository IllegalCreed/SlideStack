---
theme: seriph
background: https://cover.sli.dev
title: Welcome to TSDoc
info: |
  Presentation about TSDoc for developers.

  Learn more at [https://tsdoc.org/](https://tsdoc.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# TSDoc

TypeScript 文档注释的标准化规范（基于 @microsoft/tsdoc 0.16.0）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天聊 TSDoc —— 它不是又一个文档生成器，而是 TypeScript 文档注释的"标准"。
搞清这一点，才能看懂它和 TypeDoc、API Extractor 的关系。
-->

---
transition: fade-out
---

# TSDoc 是什么？

一套「注释语法标准」，**不是**文档生成器

<v-clicks>

- 官方定义：“a proposal to standardize the doc comments used in TypeScript code”
- 本身**不产出**任何 HTML / Markdown 文档
- 解决"同一份 `/** */` 注释被多种工具**无歧义解析**"的互操作问题
- 微软发起、社区驱动；参考解析器是 `@microsoft/tsdoc`

</v-clicks>

<div v-click="4" text-xs mt-6>

_Read more about_ [_TSDoc_](https://tsdoc.org/)

</div>

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
TSDoc 是什么？一句话：它是一套注释语法标准，不是文档生成器。

[click] 官方原话就是"标准化 TypeScript 代码里的文档注释"。

[click] 它本身不产出任何文档。

[click] 它解决的是互操作：同一份注释，能被多种工具一致地、无歧义地解析。

[click] 它的参考解析器叫 @microsoft/tsdoc。
-->

---
transition: fade-out
---

# 工具链坐标

规范 ↔ 实现，不是互相替代

<v-clicks>

- **TSDoc**：规定"注释怎么写"的**标准**
- **TypeDoc / API Extractor**：拿注释产出文档 / 报告的**工具**
- **JSDoc**：更老的注释约定，TSDoc 在 TS 场景下对其重新设计、严格化
- **API Extractor**（微软）是 TSDoc 标准的主要**推动者 / 参考实现**

</v-clicks>

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
把 TSDoc 放进工具链坐标。

[click] TSDoc 是"注释怎么写"的标准。

[click] TypeDoc、API Extractor 才是拿这份注释去产出文档和报告的工具。

[click] JSDoc 是更老的注释约定，TSDoc 在 TypeScript 场景下把它重新设计、严格化了。

[click] 而 API Extractor 正是 TSDoc 标准的主要推动者和参考实现。它们是规范和实现的关系，不互相替代。
-->

---
transition: fade-out
---

# 谁在消费 TSDoc

四类下游，各取所需

<v-click>

| 消费方 | 拿 TSDoc 注释做什么 |
| --- | --- |
| **TypeDoc** | 读注释 + TS 类型 → 生成 HTML 文档站 |
| **API Extractor** | API 报告、`.d.ts` rollup、破坏性变更门禁 |
| **eslint-plugin-tsdoc** | 在 ESLint 里校验注释是否合规 |
| **VS Code / TS 语言服务** | 悬浮提示渲染注释（**无需插件**） |

</v-click>

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
谁在消费 TSDoc？主要四类。

[click] TypeDoc 读注释加类型生成 HTML 文档站；API Extractor 产出 API 报告、d.ts rollup 和破坏性变更门禁；eslint-plugin-tsdoc 在 lint 阶段校验注释合规；而 VS Code 无需任何插件，就会在悬浮提示里渲染这些注释。
-->

---
transition: fade-out
---

# TSDoc 不是什么

三个最常见的误解

<v-clicks>

- **不产出文档**：出 HTML 站的是 TypeDoc，出 API 报告的是 API Extractor
- **不是 `tsc` 的子命令**：它是独立的开源标准 + 一个 npm 解析器
- **不替代 `.d.ts`**：`.d.ts` 是类型声明，TSDoc 管的是"注释里的描述文字"

</v-clicks>

<div v-click text-sm mt-6>

所以"跑了 TSDoc 就有文档"是个伪命题——它根本没有 build 这一步。

</div>

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
反过来澄清 TSDoc 不是什么。

[click] 它不产出文档，出文档的是 TypeDoc 和 API Extractor。

[click] 它不是 tsc 的子命令，是独立标准加一个 npm 解析器。

[click] 它也不替代 d.ts，d.ts 是类型声明，TSDoc 管的是注释里的描述文字。

[click] 所以"跑了 TSDoc 就有文档"是个伪命题，它压根没有 build 这一步。
-->

---
transition: fade-out
---

# 标签的三种类型

block / modifier / inline，写法各不同

<v-clicks>

- **块标签**：独占一行、`@` 起首，其后文本都是它的内容
- **修饰标签**：标记 API 的某种性质，内容应为空，集中排在末尾
- **内联标签**：用 `{ }` 包裹、嵌在描述里，标准内联标签**仅 3 个**
- 25 个标准标签 = 块 **11** + 修饰 **11** + 内联 **3**

</v-clicks>

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
TSDoc 把标签分成三类。

[click] 块标签独占一行，其后文本都是它的内容。

[click] 修饰标签标记 API 的性质，内容应为空，集中放在注释末尾。

[click] 内联标签用花括号包裹、嵌在描述里，标准的只有三个。

[click] 25 个标准标签里，块标签 11 个、修饰 11 个、内联 3 个。
-->

---
transition: fade-out
---

# 块标签（Block tags）

独占一行，"吃掉"后续内容

<div v-click>

```ts
/**
 * 摘要写在最前，不带标签。
 *
 * @remarks
 * 这一整段（含 Markdown 与 {@link x}）都属于 @remarks，
 * 直到遇到下一个块 / 修饰标签才结束。
 *
 * @param name - 用户名
 * @returns 问候语
 */
```

</div>

<div v-click text-sm mt-2>

官方：“Block tags should always appear as the first element on a line.”

</div>

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
先看块标签。

[click] 看这段：摘要在最前不带标签；@remarks 之后那一整段，含 Markdown 和内联标签，都属于 @remarks，直到遇到下一个块或修饰标签才结束。@param、@returns 也是块标签。

[click] 官方定义：块标签始终是一行的第一个元素。
-->

---
transition: fade-out
---

# 修饰标签（Modifier tags）

标记 API 性质，内容应为空

<div v-click>

```ts
/**
 * 冻结的配置对象，禁止子类覆盖。
 *
 * @public @sealed @readonly
 */
```

</div>

<v-clicks>

- 解析方式同块标签，但**期望内容为空**，规范化后排在注释**底部**
- 发布标签 `@public` / `@beta` / `@alpha` / `@internal` / `@experimental` 都是修饰标签

</v-clicks>

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
再看修饰标签。

[click] 它标记 API 的某种性质，比如这里 public、sealed、readonly 集中写在末尾一行。

[click] 解析方式和块标签类似，但期望内容为空，规范化后排在注释底部。

[click] 特别注意：发布标签 public、beta、alpha、internal、experimental 都属于修饰标签。
-->

---
transition: fade-out
---

# 内联标签（Inline tags）

`{ }` 包裹，标准内联标签仅 3 个

<div v-click>

| 内联标签 | 作用 |
| --- | --- |
| `{@link}` | 链接到 API 声明或 URL |
| `{@inheritDoc}` | 继承文档内容（**不含**类型签名） |
| `{@label}` | 给声明打标签，供 `{@link}` 定位 |

</div>

<div v-click>

```ts
/** 详见 {@link Button.onClick} 与 {@link https://tsdoc.org | 官网}。 */
```

</div>

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
内联标签用花括号包裹，标准的只有三个。

[click] link 链接到声明或 URL；inheritDoc 继承文档内容，但不含类型签名；label 给声明打标签，配合 link 定位。

[click] 写法就是嵌在描述文本里，竖线后可以给显示文本。
-->

---
transition: fade-out
---

# 一眼区分三类

| 特征 | 块标签 | 修饰标签 | 内联标签 |
| --- | --- | --- | --- |
| `{}` 包裹 | 否 | 否 | **是** |
| 位置 | 行首独占 | 注释末尾 | 嵌在文本中 |
| 带内容 | **带** | 空 | 带（目标） |
| 例 | `@param` | `@public` | `{@link}` |

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
把三类放一张表里对比，一眼区分：见花括号就是内联；行首独占带内容是块；末尾单独一行、内容为空是修饰。
-->

---
transition: fade-out
---

# `@param`：强制连字符

与 JSDoc 最常见的差异

<div v-click>

```ts
/**
 * @param x - 第一个加数      // ✅ 名后有连字符
 * @param y 第二个加数         // ❌ 缺连字符，tsdoc/syntax 报错
 * @typeParam T - 元素类型     // 泛型参数
 * @returns x 与 y 的和
 */
```

</div>

<v-clicks>

- 连字符是 TSDoc 的语法约定（JSDoc 里仅可读性、可选）
- 类型来自 **TS 签名**，注释**不写** `{type}`

</v-clicks>

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
@param 是和 JSDoc 最常见的差异点。

[click] 看这段：TSDoc 要求参数名后带连字符，x 那行正确，y 那行缺连字符会被 tsdoc/syntax 报错；泛型参数用 @typeParam。

[click] 连字符在 TSDoc 是语法约定，而 JSDoc 里只是可读性、可选的。

[click] 还有：类型来自 TS 签名，TSDoc 注释里不写花括号类型。
-->

---
transition: fade-out
---

# 摘要 / @remarks / @privateRemarks

三者分工不同，是否进公开文档也不同

<v-click>

| 部分 | 写法 | 进公开文档？ |
| --- | --- | --- |
| **摘要** | 注释开头第一段，无标签 | 是（核心一句话） |
| `@remarks` | 块标签，详细说明 | 是 |
| `@privateRemarks` | 块标签，内部备注 | **否** |

</v-click>

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
摘要、remarks、privateRemarks 三者分工不同。

[click] 摘要是注释开头第一段，不带标签，是核心一句话，进公开文档；@remarks 写详细说明，也进文档；而 @privateRemarks 是给维护者看的内部备注，工具不会输出到公开文档。
-->

---
transition: fade-out
---

# `{@inheritDoc}`：继承文档不含类型

<v-clicks>

- 复制：summary、`@remarks`、`@param`、`@typeParam`、`@returns`
- **类型签名从不复制**——类型永远来自当前声明自己的 TS 签名

</v-clicks>

<div v-click>

```ts
/** {@inheritDoc Animal.move} */
override move(): void {}
```

</div>

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
inheritDoc 是个容易误解的内联标签。

[click] 它复制 summary、remarks、param、typeParam、returns；但类型签名从不复制，类型永远来自当前声明自己的 TS 签名。

[click] 写法就这么简单，引用一个目标，把它的文字描述搬过来。
-->

---
transition: fade-out
---

# 三级标准化分组

工具该多大程度支持一个标签

<v-click>

| 分组 | 含义 | 跨工具可靠性 |
| --- | --- | --- |
| **Core** | 必备，所有工具都应支持 | 最高 |
| **Extended** | 可选；实现了就须合规 | 中 |
| **Discretionary** | 可选；语义因实现而异 | 低 |

</v-click>

<div v-click text-sm mt-3>

跨多工具协作（TypeDoc + API Extractor 共用注释）→ 优先用 **Core** 档最稳。

</div>

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
TSDoc 还给每个标签标了"标准化分组"，表达工具该多大程度支持它。

[click] Core 是必备，所有工具都应支持，跨工具最可靠；Extended 可选，但工具实现了就得按标准语义；Discretionary 也可选，但语义可以因实现而异，最不可靠。

[click] 所以做跨工具协作时，优先用 Core 档标签最稳妥。
-->

---
transition: fade-out
---

# 分组 ≠ 种类

两个**正交**维度，别混淆

<v-clicks>

- **种类（kind）**：决定**写法**——块 / 修饰 / 内联
- **分组（group）**：决定**跨工具标准化程度**——Core / Extended / Discretionary
- 同一标签同时拥有两者：`@param` 是"块标签 + Core"；`{@link}` 是"内联 + Core"

</v-clicks>

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
一个高频混淆点：分组不等于种类。

[click] 种类决定写法，是块、修饰还是内联。

[click] 分组决定跨工具的标准化程度，是 Core、Extended 还是 Discretionary。

[click] 同一个标签同时拥有这两个属性，比如 @param 是块标签且属 Core，link 是内联且属 Core。
-->

---
transition: fade-out
---

# tsdoc.json 配置

声明自定义标签，由 `@microsoft/tsdoc-config` 加载

<div v-click>

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/tsdoc/v0/tsdoc.schema.json",
  "extends": ["./base/tsdoc.json"],
  "tagDefinitions": [
    { "tagName": "@myTag", "syntaxKind": "modifier" }
  ],
  "supportForTags": { "@myTag": true }
}
```

</div>

<div v-click text-sm mt-2>

`syntaxKind` 取值就是三类标签：`block` / `modifier` / `inline`。

</div>

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
要用自定义标签，就写 tsdoc.json，由 @microsoft/tsdoc-config 加载。

[click] 四个核心字段：$schema 指向官方 schema 供编辑器校验；extends 继承另一份配置；tagDefinitions 定义自定义标签；supportForTags 启用或禁用已定义标签。

[click] 注意 tagDefinitions 里的 syntaxKind，取值正是三类标签：block、modifier、inline。
-->

---
transition: fade-out
---

# 生态三件套

| 包 | 版本 | 角色 |
| --- | --- | --- |
| `@microsoft/tsdoc` | 0.16.0 | 参考解析器（注释 → AST） |
| `@microsoft/tsdoc-config` | 0.18.1 | 加载 `tsdoc.json` |
| `eslint-plugin-tsdoc` | 0.5.2 | `tsdoc/syntax` 合规校验 |

<div v-click text-sm mt-3>

三包均为 **0.x**——TSDoc 规范尚未发布 1.0，仍在演进。

</div>

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
TSDoc 生态三个包：tsdoc 是参考解析器，把注释解析成 AST；tsdoc-config 负责加载 tsdoc.json；eslint-plugin-tsdoc 提供 tsdoc/syntax 规则做合规校验。

[click] 注意三个包都还在 0.x，TSDoc 规范至今没发 1.0，仍在演进。
-->

---
transition: fade-out
---

# CI 门禁：eslint-plugin-tsdoc

强制"注释合规否则报错"

<div v-click>

```js
// eslint.config.js（Flat Config）
import tsdoc from "eslint-plugin-tsdoc";

export default [
  {
    plugins: { tsdoc },
    rules: { "tsdoc/syntax": "warn" }, // 也可设 "error" 卡 CI
  },
];
```

</div>

<div v-click text-sm mt-2>

挑出"`@param` 缺连字符""未在 `tsdoc.json` 登记的未知标签"等问题。

</div>

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
想在 CI 强制注释合规，用 eslint-plugin-tsdoc。

[click] Flat Config 里挂上插件，开 tsdoc/syntax 规则，warn 告警或 error 卡 CI 都行。

[click] 它会挑出比如 @param 缺连字符、用了未在 tsdoc.json 登记的未知标签这类问题。
-->

---
transition: fade-out
---

# TSDoc vs JSDoc

| 维度 | JSDoc | TSDoc |
| --- | --- | --- |
| 定位 | 约定 + 生成器 | **标准 / 规范** |
| 类型 | 写进注释 `{type}` | 来自 TS 签名 |
| `@param` 连字符 | 可选 | **强制** |
| 标签种类 | 块 / 内联 | **块 / 修饰 / 内联** |
| 标准化 | 无 | Core/Extended/Discretionary |

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
最后把 TSDoc 和 JSDoc 拉直对比：JSDoc 是约定加生成器，TSDoc 是标准规范；JSDoc 类型写进注释，TSDoc 类型来自 TS 签名；param 连字符 JSDoc 可选、TSDoc 强制；JSDoc 标签两类、TSDoc 三类；JSDoc 没有标准化分级，TSDoc 有三档。
-->

---
transition: fade-out
---

# 踩坑清单

<v-clicks>

1. TSDoc 是规范不是生成器，没有 build 步骤
2. `@param 名 - 描述`：连字符**强制**；注释不写 `{type}`
3. 发布标签 `@public`/`@beta` 等是**修饰标签**，不是块标签
4. `{@inheritDoc}` 只搬文字，**不搬类型**
5. 自定义标签要先在 `tsdoc.json` 的 `tagDefinitions` 登记
6. 三包均 0.x，规范未定稿；版本 0.16.0 / 0.18.1 / 0.5.2

</v-clicks>

<style>
h1 {
  background-color: #3178C6;
  background-image: linear-gradient(45deg, #3178C6 10%, #1e4f87 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
把容易翻车的点收成清单。

[click] TSDoc 是规范不是生成器，没有 build。

[click] param 连字符强制，注释不写类型。

[click] 发布标签是修饰标签不是块标签。

[click] inheritDoc 只搬文字不搬类型。

[click] 自定义标签要先在 tsdoc.json 登记。

[click] 三个包都还在 0.x，规范没定稿。
-->

---
layout: center
class: text-center
transition: slide-up
---

# 谢谢观看

TSDoc：让一份注释，被整条工具链"听懂同一种话"

<div class="mt-8 flex justify-center gap-6 text-sm">
  <a href="https://tsdoc.org/" target="_blank">官方文档</a>
  <a href="https://github.com/microsoft/tsdoc" target="_blank">GitHub</a>
  <a href="https://tsdoc.org/play/" target="_blank">Playground</a>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天就到这里。

一句话总结 TSDoc：它让一份注释，被 TypeDoc、API Extractor、ESLint、VS Code 整条工具链"听懂同一种话"。它是规范不是生成器，价值在互操作。需要深入就看官方文档、仓库和 Playground。谢谢大家！
-->
