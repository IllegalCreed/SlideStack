---
theme: seriph
background: https://cover.sli.dev
title: Welcome to API Extractor
info: |
  Presentation about API Extractor for developers.

  Learn more at [https://api-extractor.com/](https://api-extractor.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# API Extractor

面向 TypeScript 库作者的 API 分析工具（基于 @microsoft/api-extractor 7.58.9）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天聊微软的 API Extractor。它不是又一个文档站工具，而是面向 TypeScript 库作者的 API 分析工具——产 API 报告、d.ts rollup 和文档模型。
-->

---
transition: fade-out
---

# API Extractor 是什么？

面向**库作者**的 API 分析工具，**不是**应用打包器

<v-clicks>

- 官方定义：它 “produces three different output types”——三类输出
- **API 报告**（`.api.md`）：公共 API 快照，进 Git 做评审门禁
- **`.d.ts` rollup**：把多文件声明合并成单个发布声明
- **文档模型**（`.api.json`）：喂给 `api-documenter` 出文档
- 读 **TSDoc** 注释，靠发布标签裁剪——AE 是 TSDoc 标准的主要推动者

</v-clicks>

<div v-click="5" text-xs mt-6>

_Read more about_ [_API Extractor_](https://api-extractor.com/)

</div>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
API Extractor 是什么？一句话：面向库作者的 API 分析工具。

[click] 官方说它产出三类输出。

[click] 第一类，API 报告 .api.md，把公共 API 序列化成快照，进 Git 做评审门禁。

[click] 第二类，d.ts rollup，把多文件声明合并成单个发布声明。

[click] 第三类，文档模型 .api.json，喂给 api-documenter 出文档。

[click] 它读 TSDoc 注释，靠发布标签裁剪，本身就是 TSDoc 标准的主要推动者。
-->

---
transition: fade-out
---

# 三类输出一览

API Extractor 的主线，三者相互独立、按需开关

<v-click>

| 输出 | 产物 | 用途 |
| --- | --- | --- |
| **API 报告** | `.api.md` | 公共 API 快照，PR 出 diff 做评审门禁 |
| **`.d.ts` rollup** | 单个 `.d.ts` | 合并声明、按发布标签裁剪 |
| **文档模型** | `.api.json` | 喂 `api-documenter` 出 Markdown/DocFX |

</v-click>

<div v-click text-sm mt-4>

三者**共用同一次分析**（同一入口 `.d.ts`、同一份 TSDoc 解析），产物互不强制。

</div>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
把三类输出放一张表里。

[click] API 报告 .api.md 做评审门禁；d.ts rollup 合并声明、按标签裁剪；文档模型 .api.json 喂 api-documenter 出文档。

[click] 注意它们共用同一次分析，但产物相互独立，你可以只开其中一个。
-->

---
transition: fade-out
---

# 工具链坐标

规范 → 分析 → 渲染，各司其职

<v-clicks>

- **TSDoc**：注释语法**标准**——规定怎么写，本身不产出
- **API Extractor**：库作者向 API 分析——报告 / rollup / 文档模型
- **api-documenter**：消费 `.api.json` 出 Markdown / DocFX
- **TypeDoc**：端到端文档站生成器（一键出 HTML）
- 要一键 HTML 站选 TypeDoc；要契约门禁 + 单一声明选 API Extractor

</v-clicks>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
把 API Extractor 放进工具链坐标。

[click] TSDoc 是注释标准，规定怎么写注释，本身不产出。

[click] API Extractor 是库作者向的 API 分析工具，产报告、rollup、文档模型。

[click] api-documenter 消费 .api.json 出 Markdown 或 DocFX。

[click] TypeDoc 是端到端文档站生成器，一键出 HTML。

[click] 选型上，要一键 HTML 站选 TypeDoc，要 API 契约门禁加单一声明文件选 API Extractor。
-->

---
transition: fade-out
---

# API Extractor 不是什么

三个最常见的误解

<v-clicks>

- **不是应用打包器**：它分析 `.d.ts`，不打包运行时 JS（那是 Vite/Webpack）
- **不直接出 HTML 站**：它产 `.api.json`，HTML 由 `api-documenter`/DocFX 渲染
- **不是 `tsc` 的子命令**：独立 npm 包，且**内置自带一份 TS 编译器**

</v-clicks>

<div v-click text-sm mt-6>

判断要不要上 AE：**你是否在向外发布带类型契约的库？** 纯应用基本用不到。

</div>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
反过来澄清它不是什么。

[click] 它不是应用打包器，分析的是 d.ts，不打包运行时 JS。

[click] 它不直接出 HTML 站，产的是 .api.json，HTML 由 api-documenter 或 DocFX 渲染。

[click] 它不是 tsc 子命令，是独立 npm 包，而且内置自带一份 TypeScript 编译器。

[click] 判断要不要用它，看你是否在向外发布带类型契约的库，纯应用基本用不到。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与两步流水线

先编译产声明，再抽取分析

::left::

<div v-click>

- **安装 + 初始化**

  ```bash
  pnpm add -D @microsoft/api-extractor
  api-extractor init
  ```

</div>

<div v-click>

- **两步构建**

  ```bash
  tsc                       # 产 .d.ts
  api-extractor run --local
  ```

</div>

::right::

<div v-click>

- **tsconfig 必开**

  | 选项 | 作用 |
  | --- | --- |
  | `declaration` | 产供分析的 `.d.ts` |
  | `declarationMap` | 报错映射回源码行号 |

</div>

<div v-click text-xs mt-3>

入口必填字段 `mainEntryPointFilePath` 指向编译产物 `.d.ts`。

</div>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
怎么装、怎么跑。

[click] 装 @microsoft/api-extractor，再 api-extractor init 生成带注释的配置。

[click] 两步构建：先 tsc 产 d.ts，再 api-extractor run。顺序不能反，因为它分析的是编译产物。

[click] tsconfig 必须开两项：declaration 产出供分析的 d.ts，declarationMap 让报错能映射回源码行号。

[click] 入口必填字段 mainEntryPointFilePath，指向编译后的 d.ts，不是源码 ts。
-->

---
transition: fade-out
---

# ① API 报告（`.api.md`）

公共 API 的可读快照

<div v-click>

```md
## API Report File for "my-library"

> Do not edit this file. It is a report generated by API Extractor.

// @public
export class Widget {
    draw(): void;
    // (undocumented)
    id: string;
}
```

</div>

<v-clicks>

- `// @public` 标发布等级；`// (undocumented)` = 缺 TSDoc 文档
- 它是**机器生成产物**——改代码后重新生成，别手改

</v-clicks>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
第一类输出，API 报告 .api.md。

[click] 看这个样例：顶部固定有 API Report File for 和 Do not edit this file；用伪代码列出每个公共导出。

[click] 注释里 @public 标发布等级，undocumented 表示这个成员缺 TSDoc 文档。

[click] 它是机器生成的产物，要改就改代码重新生成，别手动编辑，否则下次构建被覆盖。
-->

---
transition: fade-out
---

# API 报告做评审门禁

把公共 API 变成 Git diff

<v-clicks>

- 官方：报告应被 Git 跟踪，API 一变 PR 里就 “appear as diffs”
- 评审者看 diff 判断：变更可接受吗？要不要升 major？
- 治理的是**源码契约**，靠快照 + diff + 人审，**与运行时无关**
- rushstack 用 `CODEOWNERS` 要求 API 变更由指定人审批

</v-clicks>

<div v-click text-sm mt-4>

所以 API 报告本质是「一次 Git diff 的评审」，不是运行时检查。

</div>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
API 报告怎么做门禁？

[click] 官方说报告应被 Git 跟踪，这样 API 一变，PR 里就以 diff 形式出现。

[click] 评审者看这个 diff，判断变更是否可接受、是否要升 major 版本。

[click] 它治理的是源码层面的契约，靠快照加 diff 加人审，和运行时毫无关系。

[click] rushstack 仓库用 CODEOWNERS 要求 API 变更由指定人员审批，把评审制度化。

[click] 所以本质是一次 Git diff 的评审，不是运行时检查。
-->

---
transition: fade-out
---

# ② `.d.ts` rollup

像 Webpack 打包 JS 那样合并声明

<v-clicks>

- 官方类比：像 Webpack roll up JS 那样，把多个 `.d.ts` 合并成单个 `.d.ts`
- 价值：编译后散落的声明 → 一个发布用声明文件，简化分发
- 还能按发布标签产**多档裁剪**（public/beta/alpha/untrimmed）
- `bundledPackages`：把指定依赖的类型**内联**进 rollup

</v-clicks>

<div v-click>

```jsonc
"dtsRollup": {
  "enabled": true,
  "publicTrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>-public.d.ts"
}
```

</div>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
第二类输出，d.ts rollup。

[click] 官方拿 Webpack 作类比：像 Webpack roll up JS 那样，把多个 d.ts 合并成单个 d.ts。

[click] 价值是把编译后散落的声明合并成一个发布用声明文件，简化分发。

[click] 它还能按发布标签产多档裁剪，public、beta、alpha、untrimmed。

[click] bundledPackages 字段能把指定依赖的类型内联进 rollup。

[click] 配置就这么简单，开 enabled，给个 publicTrimmedFilePath 输出路径。
-->

---
transition: fade-out
---

# ③ 文档模型（`.api.json`）

给程序消费的结构化 API 模型

<v-clicks>

- 开 `docModel.enabled` → 默认产 `temp/<unscopedPackageName>.api.json`
- 含每个成员的签名 + TSDoc 文档，**给程序消费**，不是给人读
- 下游：`api-documenter` 出 Markdown/DocFX
- 也可用 `@microsoft/api-extractor-model` 编程读取（`ApiPackage` 等）

</v-clicks>

<div v-click>

```jsonc
"docModel": {
  "enabled": true,
  "apiJsonFilePath": "<projectFolder>/temp/<unscopedPackageName>.api.json"
}
```

</div>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
第三类输出，文档模型 .api.json。

[click] 开 docModel.enabled，默认产到 temp 目录下的 .api.json。

[click] 它含每个成员的签名加 TSDoc 文档，是给程序消费的中间数据，不是给人直接读的。

[click] 下游是 api-documenter，把它出成 Markdown 或 DocFX。

[click] 也可以用 @microsoft/api-extractor-model 编程读取，反序列化成 ApiPackage 等对象模型。

[click] 配置就是开 enabled，可选自定义 apiJsonFilePath。
-->

---
transition: fade-out
---

# 配置文件 `api-extractor.json`

`api-extractor init` 生成带注释模板

<div v-click>

```jsonc
{
  "mainEntryPointFilePath": "<projectFolder>/dist/index.d.ts",
  "apiReport": { "enabled": true },
  "docModel":  { "enabled": true },
  "dtsRollup": { "enabled": true }
}
```

</div>

<v-clicks>

- **必填** `mainEntryPointFilePath`：入口 `.d.ts`（编译产物）
- `extends` 跨项目复用；token `<projectFolder>`/`<packageName>`/`<unscopedPackageName>`
- `newlineKind`(lf/crlf/os)：跨平台固定 `lf` 避免 `.api.md` 假 diff

</v-clicks>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
配置文件 api-extractor.json，用 api-extractor init 生成带注释模板。

[click] 最小配置：填入口，按需开 apiReport、docModel、dtsRollup 三个功能节。

[click] mainEntryPointFilePath 必填，指向入口 d.ts，是编译产物。

[click] extends 跨项目复用配置；路径支持三个 token。

[click] newlineKind 控制换行符，跨平台团队固定 lf，避免 .api.md 出现整文件假 diff。
-->

---
transition: fade-out
---

# 发布标签

`@public` / `@beta` / `@alpha` / `@internal`

<v-clicks>

- 是 TSDoc **修饰标签**，标记单个 API 成员的**支持级别**
- 官方：beta 描述 _个别 API 成员_ 的级别，不是整个发布分支成熟度
- AE 据此裁剪 rollup、给报告分级
- 缺标签 → `ae-missing-release-tag`；标多个 → `ae-extra-release-tag`

</v-clicks>

<div v-click>

```ts
/** @param x - 输入 @public */
export function draw(x: Ctx): void {}
/** @internal 内部，不对外承诺 */
export function _cache(): void {}
```

</div>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
发布标签：public、beta、alpha、internal 四个。

[click] 它们是 TSDoc 修饰标签，标记单个 API 成员的支持级别。

[click] 官方强调，这里的 beta 描述个别成员的级别，不是整个发布分支的成熟度。

[click] AE 据此裁剪 rollup、给报告分级。

[click] 缺标签报 ae-missing-release-tag，标多个报 ae-extra-release-tag。

[click] 看这段：draw 标 public 对外，_cache 标 internal 不对外承诺。
-->

---
transition: fade-out
---

# rollup 裁剪四档

累积关系：public ⊂ beta ⊂ alpha ⊂ untrimmed

<v-click>

| 字段 | 含哪些标签 |
| --- | --- |
| `publicTrimmedFilePath` | 仅 `@public` |
| `betaTrimmedFilePath` | `@public` + `@beta` |
| `alphaTrimmedFilePath` | `@public` + `@beta` + `@alpha` |
| `untrimmedFilePath` | 全部（含 `@internal`） |

</v-click>

<div v-click text-sm mt-4>

`@internal` 在 public/beta/alpha 档都被**裁掉**，只对外暴露你愿意承诺的公共面。

</div>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
rollup 按标签裁剪，四档是累积关系。

[click] public 档只含 public；beta 档加上 beta；alpha 档再加上 alpha；untrimmed 含全部，连 internal 都在。

[click] 所以 internal 成员在 public、beta、alpha 档里都被裁掉，对外只暴露你愿意承诺的公共面。
-->

---
transition: fade-out
---

# `--local`：本地 vs CI 的命门

最容易翻车的一处

<v-clicks>

- **`--local`（本地）**：关部分发布校验 + **自动覆写 `.api.md`**
- **CI（不带 `--local`）**：报告与代码不一致 → 构建**失败**
- CI 误加 `--local` = 关门禁 + 自动改报告 → 破坏性变更检测失效
- 本地改完 API：跑 `--local` 自动更新报告，再连代码一起提交

</v-clicks>

<div v-click text-sm mt-3 text-amber5>

⚠️ 「build 成功 ≠ 没有破坏性变更」——门禁靠提交 `.api.md` + CI 不带 `--local`。

</div>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
--local 是最容易翻车的地方。

[click] 带 --local 的本地构建，会关掉部分发布校验，并自动覆写 .api.md。

[click] 而 CI 不带 --local，报告和代码不一致就直接构建失败。

[click] 所以 CI 误加 --local，等于关掉门禁加自动改报告，破坏性变更检测就失效了。

[click] 正确做法：本地改完 API 跑 --local 自动更新报告，再连代码一起提交。

[click] 记住，build 成功不等于没有破坏性变更，门禁靠提交 .api.md 加 CI 不带 --local。
-->

---
transition: fade-out
---

# 诊断消息三类

按来源分，前缀不同

<v-click>

| 类别 | 前缀 | 来源 |
| --- | --- | --- |
| 编译器 | `TS`（如 `TS2551`） | TypeScript 编译器 |
| Extractor | `ae-`（如 `ae-forgotten-export`） | AE 分析自身 |
| TSDoc | `tsdoc-` | TSDoc 解析器 |

</v-click>

<v-clicks>

- 在 `messages` 节配：`logLevel`（error/warning/none）+ `addToApiReportFile`
- `warning`：**生产构建失败**、本地仅告警——严格与体验兼顾

</v-clicks>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
AE 的诊断消息按来源分三类。

[click] 编译器消息 TS 前缀，来自 TypeScript；Extractor 消息 ae- 前缀，是 AE 分析自身报的；TSDoc 消息 tsdoc- 前缀，是 TSDoc 解析器报的。

[click] 在 messages 节配两项：logLevel 和 addToApiReportFile。

[click] 特别说一下 warning：它在生产构建失败、本地仅告警，兼顾严格和开发体验。
-->

---
transition: fade-out
---

# `ae-forgotten-export`

最常见的 Extractor 消息

<v-clicks>

- 含义：公共 API 引用了**未从入口导出**的符号
- 默认用 `addToApiReportFile`——写进 `.api.md` 报告，**不中断构建**
- 修法一：给该符号加 `export` 真正导出
- 修法二：用 `includeForgottenExports` 把它纳入

</v-clicks>

<div v-click>

```ts
// .api.md 里会出现：
// Warning: (ae-forgotten-export) The symbol "IWidget"
// needs to be exported by the entry point index.d.ts
```

</div>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
最常见的 Extractor 消息，ae-forgotten-export。

[click] 含义是：公共 API 引用了一个没从入口导出的符号。

[click] 它默认用 addToApiReportFile，写进 .api.md 报告，不中断构建。

[click] 修法一，给那个符号加 export 真正导出。

[click] 修法二，用 includeForgottenExports 把它纳入。

[click] 报告里会出现这样一行警告，提示某符号需要被入口导出。
-->

---
transition: fade-out
---

# 配合 TSDoc + api-documenter

从 `.api.json` 到 Markdown

<v-clicks>

- AE 读 **TSDoc** 注释（内置 `@microsoft/tsdoc` ~0.16.0）
- 链路：源码 TSDoc → AE 产 `.api.json` → `api-documenter` 出文档
- `@param`/`@remarks` 等文字流入文档；发布标签驱动裁剪

</v-clicks>

<div v-click>

```bash
pnpm add -D @microsoft/api-documenter
api-documenter markdown -i temp -o docs/api  # Markdown
api-documenter yaml     -i temp -o docs/yaml # DocFX
```

</div>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
怎么配合 TSDoc 和 api-documenter 出 Markdown。

[click] AE 读 TSDoc 注释，内置 @microsoft/tsdoc 解析。

[click] 链路是：源码里的 TSDoc，AE 产 .api.json，api-documenter 出文档。

[click] @param、@remarks 这些文字会流入文档，发布标签则驱动裁剪。

[click] 命令上，装 api-documenter，markdown 子命令出 Markdown，yaml 子命令出 DocFX 用的 YAML。
-->

---
transition: fade-out
---

# 多包聚合的杀手锏

各包独立产 `.api.json`，汇成一个站

<v-clicks>

- 官方：各包可在不同仓库 / 工具链下独立构建各自的 `.api.json`
- 管线汇总成「single website, complete with cross-package hyperlinks」
- 带**跨包超链接 + 统一导航树**——单包文档工具难做到
- 想要专业级站点：走 `api-documenter yaml` + DocFX

</v-clicks>

<div v-click text-sm mt-4>

DocFX 被官方比作 “space shuttle”——更重但功能完整，曾驱动 docs.microsoft.com。

</div>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
多包聚合是 AE 加 api-documenter 的杀手锏。

[click] 官方说，各包可以在不同仓库、不同工具链下独立构建各自的 .api.json。

[click] 管线再把它们汇总成一个单一网站。

[click] 这个站带跨包超链接和统一导航树，这是单包文档工具很难做到的。

[click] 想要专业级站点，走 api-documenter yaml 加 DocFX。

[click] DocFX 被官方比作太空梭，更重但功能完整，曾经驱动 docs.microsoft.com。
-->

---
transition: fade-out
---

# 版本与生态

截至 2026-06-18（npm latest）

<v-click>

| 包 | 版本 |
| --- | --- |
| `@microsoft/api-extractor` | 7.58.9 |
| `@microsoft/api-documenter` | 7.30.7 |
| `@microsoft/api-extractor-model` | 7.33.8 |
| 内置 `typescript` | 5.9.3 |

</v-click>

<v-clicks>

- AE **自带**锁定版 TS；与项目 TS 差异大时用 `--typescript-compiler-folder` 对齐
- 属 **Rush Stack**（`microsoft/rushstack`），与 Rush、Heft 同源

</v-clicks>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
版本与生态，取数日期 2026 年 6 月 18 日。

[click] api-extractor 7.58.9，api-documenter 7.30.7，api-extractor-model 7.33.8，内置 TypeScript 锁在 5.9.3。

[click] AE 自带一份锁定版 TS，和项目 TS 差异大时用 --typescript-compiler-folder 对齐。

[click] 它属于微软的 Rush Stack 生态，源码在 rushstack 仓库，和 Rush、Heft 同源。
-->

---
transition: fade-out
---

# 踩坑清单

<v-clicks>

1. AE 是库作者向工具，纯应用基本用不到
2. 先 `tsc` 后 `api-extractor run`，tsconfig 开 `declaration`/`declarationMap`
3. **CI 不要加 `--local`**，否则破坏性变更门禁失效
4. `.api.md` 是生成物 + 要进 Git，改代码后重新生成；别手改
5. 一个成员只一个发布标签；`@internal` 不进对外 rollup；TS 版本错配用 `--typescript-compiler-folder`

</v-clicks>

<style>
h1 {
  background-color: #0078D4;
  background-image: linear-gradient(45deg, #0078D4 10%, #004e8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
把容易翻车的点收成清单。

[click] AE 是库作者向工具，纯应用基本用不到。

[click] 先 tsc 后 api-extractor run，tsconfig 开 declaration 和 declarationMap。

[click] CI 不要加 --local，否则门禁失效。

[click] .api.md 是生成物又要进 Git，改代码后重新生成。

[click] 一个成员只能有一个发布标签，internal 不进对外 rollup。

[click] AE 自带 TS，版本错配用 --typescript-compiler-folder 对齐。
-->

---
layout: center
class: text-center
transition: slide-up
---

# 谢谢观看

API Extractor：把库的「公共 API 契约」管起来

<div class="mt-8 flex justify-center gap-6 text-sm">
  <a href="https://api-extractor.com/" target="_blank">官方文档</a>
  <a href="https://github.com/microsoft/rushstack" target="_blank">GitHub</a>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天就到这里。

一句话总结 API Extractor：它把库的公共 API 契约管起来——API 报告做评审门禁、d.ts rollup 做声明分发、文档模型喂 api-documenter 出文档。它是库作者向工具，读 TSDoc，靠发布标签裁剪。需要深入就看官方文档和 rushstack 仓库。谢谢大家！
-->
