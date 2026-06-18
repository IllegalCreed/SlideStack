---
theme: seriph
background: https://cover.sli.dev
title: Welcome to TypeDoc
info: |
  Presentation about TypeDoc for developers.

  Learn more at [https://typedoc.org/](https://typedoc.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# TypeDoc

直读 TypeScript 类型系统，自动生成 API 文档（基于 v0.28）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天我们聊 TypeDoc —— 专为 TypeScript 打造的 API 文档生成器。
它最大的特点是直接读 TS 的类型系统，不靠注释里的类型标注，签名、参数、返回值不写注释也能生成。
-->

---
transition: fade-out
---

# TypeDoc 是什么？

TypeScript 专用的 API 文档生成器

<v-clicks>

- **直接读 TypeScript 编译器**：用真实类型（含推断、泛型约束、联合类型）
- 注释只负责「描述文字」，**类型来自 TS 本身**——不写注释也能出签名
- 从入口点出发，跟随 `export` / re-export 跨文件构建反射树
- 产出**可浏览的 HTML 站点**，或结构化 **JSON** 模型喂给其他工具

</v-clicks>

<div v-click="4" text-xs mt-6>

_Read more about_ [_TypeDoc_](https://typedoc.org/)

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
TypeDoc 是什么？它是 TypeScript 专用的 API 文档生成器。

[click] 最关键的是：它直接调用 TypeScript 编译器，拿到真实类型，包括推断出来的类型、泛型约束、联合类型。

[click] 所以注释只负责描述文字，类型来自 TS 本身，函数签名不写注释也能生成。这是它和 JSDoc 最根本的分界。

[click] 工作流上，它从入口点出发，跟随 export 和 re-export 跨文件解析，构建一棵反射树。

[click] 最后渲染成可浏览的 HTML 站点，或者序列化成 JSON 喂给别的工具。
-->

---
transition: fade-out
---

# 工具链坐标

直读 TS 类型 vs 注释驱动，各占其位

<v-clicks>

- **TypeDoc**：从 **TS 类型系统**取类型，注释只写描述，TS 项目首选
- **JSDoc**：注释驱动，类型靠 `@type` / `@param {T}` 标注，主纯 JS
- **API Extractor**：吃 `.d.ts`，做 API 报告 + 防破坏性变更
- **TSDoc**：注释**规范**（非生成器），TypeDoc 大体遵循它

</v-clicks>

<div v-click text-xs mt-4>

配合关系：**TSDoc 定语法** → **API Extractor 治理 API** → **TypeDoc 生成站点**

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
把 TypeDoc 放进工具链坐标看清边界。

[click] TypeDoc 从 TS 类型系统取类型，注释只写描述，是 TS 项目的首选。

[click] JSDoc 是注释驱动，类型靠 type、param 大括号标注，主战场是纯 JS。

[click] API Extractor 吃的是编译产物 d.ts，做 API 报告和防破坏性变更。

[click] TSDoc 是注释规范，本身不生成文档，TypeDoc 大体遵循它。

[click] 三者其实能配合：TSDoc 定语法，API Extractor 治理 API，TypeDoc 生成给人看的站点。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-12
---

# 安装与命令行

本地安装，跑命令生成文档

::left::

<div v-click>

- **安装**:

  ```bash
  npm i -D typedoc
  # typescript 是 peer 依赖
  ```

</div>

<div v-click>

- **最简用法**:

  ```bash
  # 单入口 → 默认输出 ./docs
  npx typedoc src/index.ts
  ```

  <span text-xs text-gray>

  入口默认从 package.json 的 `exports`/`main` 自动发现

  </span>

</div>

::right::

<div v-click>

- **显式入口 + 输出 + JSON**

  ```bash
  npx typedoc \
    --entryPoints src/index.ts \
    --out api \
    --json api.json
  ```

  <span text-xs text-gray>

  0.28 纯 ESM；TS peer 为 5.0 ~ 6.0

  </span>

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
安装和使用都很简单。

[click] 推荐本地安装，typescript 是它的 peer 依赖。

[click] 最简用法一行命令，单入口默认输出到 docs；入口甚至能从 package.json 的 exports 字段自动发现。

[click] 右边是显式写法：指定入口、输出目录，还能顺手出一份 JSON。注意 0.28 已是纯 ESM，TS 支持 5.0 到 6.0。
-->

---
transition: fade-out
---

# 高频 CLI 选项

命令行 flag 与配置 option 一一对应

<v-clicks>

| flag | 作用 |
| --- | --- |
| `--entryPoints <glob>` | 显式入口，可重复 |
| `--out <dir>` | HTML 输出目录 |
| `--json <file>` | 额外出 JSON（**会覆盖 `outputs`**） |
| `--tsconfig <file>` | 指定 tsconfig（默认向上找） |
| `--plugin <name>` | 加载插件，可重复；`--watch` 监听重建 |
| `--skipErrorChecking` | 跳过 TS 检查（提速慎用） |

</v-clicks>

<div v-click text-xs mt-2>

布尔选项 `--excludePrivate false` 显式关；对象选项点路径 `--validation.notDocumented true`

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这是最常用的一批命令行选项，每个都对应配置文件里的一个 option。

[click] entryPoints 显式入口可重复；out 是 HTML 输出目录；json 额外出一份 JSON，但要注意它会覆盖 outputs 数组里的设置；tsconfig 指定配置，默认向上自动找；plugin 加载插件；watch 监听重建；skipErrorChecking 跳过类型检查提速，但慎用。

[click] 补充两个语法：布尔选项加 false 显式关闭；对象选项用点路径，比如 validation 点 notDocumented。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 入口点与策略

`entryPointStrategy` 四种值，必考

::left::

<div v-click>

| 值 | 行为 |
| --- | --- |
| **`resolve`** | 默认，入口在 tsconfig 内，跟 re-export |
| **`expand`** | 目录递归展开，每文件独立成页 |
| **`packages`** | 每入口是带配置的包，**独立跑再合并** |
| **`merge`** | 入口是 `--json` 产物，合并成站点 |

</div>

::right::

<div v-click>

```jsonc
// typedoc.json
{
  "entryPoints": [
    "src/index.ts",
    "src/alt.ts"
  ],
  "entryPointStrategy": "resolve"
}
```

</div>

<div v-click text-xs mt-2 col-span-2>

`packages` 是 **monorepo 主力**；注意子包的插件**不会被加载**（只在顶层）

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
入口策略是个高频考点，一共四个值。

[click] resolve 是默认，入口必须在根 tsconfig 工程内，跟随 re-export 跨文件；expand 把目录递归展开，每个文件单独出页；packages 每个入口是带自己配置的包，各自独立跑一遍再合并；merge 入口是之前用 json 跑出的文件，合并成一个站点。

[click] 右边是 resolve 的典型写法，entryPoints 是入口 glob 数组。

[click] 重点记两条：packages 是 monorepo 的主力方案；但子包里的插件不会被加载，插件只在顶层配置生效。
-->

---
transition: fade-out
---

# 注释体系

自带极简 parser，正文支持 Markdown

<v-clicks>

- 抽取 TSDoc / JSDoc 标签，正文用 **markdown-it** 渲染，**Shiki** 高亮围栏代码
- **发现位置**：声明前、父节点、联合类型各分支前、`export` specifier 上
- 含 `@license` / `@import` 的注释**被忽略**（不当文档）
- `commentStyle`：`jsdoc`(默认，只认 `/** */`) / `block` / `line` / `triple-slash` / `all`

</v-clicks>

<div v-click>

```ts
/** 这段注释 _支持_ [Markdown](https://www.markdownguide.org/) */
export class DocumentMe {}
```

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
TypeDoc 用自带的极简 parser 抽标签。

[click] 它抽取 TSDoc 和 JSDoc 标签，正文用 markdown-it 渲染成 HTML，围栏代码块用 Shiki 高亮。

[click] 注释的发现位置有四处：声明前、父节点上、联合类型各分支前、export 说明符上。

[click] 注意含 license 或 import 的注释会被忽略，不当作文档。

[click] commentStyle 控制认哪种注释，默认 jsdoc 只认双星块注释，还有 block、line、triple-slash 和 all。

[click] 一个最小示例：注释正文里可以直接写 Markdown。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 三类标签

block / inline / modifier，核心考点

::left::

<div v-click>

| 类别 | 形式 | 例 |
| --- | --- | --- |
| **Block 块** | `@tag` 独占段落 | `@param` `@returns` `@example` |
| **Modifier 修饰** | 纯开关无内容 | `@internal` `@hidden` `@alpha` |
| **Inline 内联** | `{@tag ...}` 嵌文字 | `{@link}` `{@inheritDoc}` |

</div>

::right::

<div v-click>

- 三个白名单：`blockTags` / `inlineTags` / `modifierTags`
- `cascadedModifierTags`：级联给子反射（如 `@beta`）
- `excludeTags`：解析时直接丢
- `notRenderedTags`：保留但不渲染

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
TypeDoc 的标签分三大类，这是核心考点。

[click] block 块标签以 @ 起、独占段落，用来分节描述，比如 param、returns、example；modifier 修饰标签是纯开关没有内容，改变可见性或分类，比如 internal、hidden、alpha；inline 内联标签写在花括号里、嵌在段落文字中，比如 link、inheritDoc。

[click] 每一类都有对应的可配置白名单：blockTags、inlineTags、modifierTags，可以加自定义标签。还有几个相关项：cascadedModifierTags 会级联传给所有子反射，典型是 beta；excludeTags 解析时直接丢掉；notRenderedTags 保留元数据但不渲染。
-->

---
transition: fade-out
---

# 核心标签速记

最常用的一批，覆盖描述 / 分类 / 链接

<v-clicks>

- 描述类：`@param` `@returns` `@remarks` `@example` `@deprecated` `@see`
- 泛型：`@typeParam`（JSDoc 别名 `@template`）
- 分类：`@category` / `@group`（+ 各自 `Description` 变体）
- 链接：`{@link}` / `{@linkcode}`(等宽) / `{@linkplain}`(普通)
- 继承：`{@inheritDoc Ref}`，**只复制** summary/remarks/param/typeParam/returns
- 内联文件：`{@include}` / `{@includeCode}`（0.28 新增）

</v-clicks>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
把最常用的标签速记一遍。

[click] 描述类：param、returns、remarks 补充详述、example 示例、deprecated 弃用、see 交叉引用。

[click] 泛型用 typeParam，它的 JSDoc 别名是 template。

[click] 分类有 category 和 group 两套，各自还有 Description 变体加描述。

[click] 链接三兄弟：link 普通、linkcode 等宽字体、linkplain 普通字体。

[click] 继承用 inheritDoc，注意它只复制摘要、remarks、param、typeParam 和 returns，example、deprecated 这些不继承。

[click] 最后是 0.28 新增的 include 和 includeCode，把外部文件内容内联进注释。
-->

---
transition: fade-out
---

# `@example` 的 0.28 语义

版本差异题富矿

<v-clicks>

- **无围栏代码块**：TypeDoc 把**整段当作代码**（VSCode 也这么认）
- **有围栏代码块**：围栏外当普通文字，仅围栏内当代码
- 受 `jsDocCompatibility.exampleTag` 控制
- ⚠️ **0.28 移除了「具名示例」**（≤0.27 的第一行当标题语义没了）

</v-clicks>

<div v-click>

```ts
/**
 * @example
 * // 无代码块，整段当代码
 * factorial(1)
 *
 * @example
 * 有代码块时这行是普通文字。
 * ```ts
 * factorial(1)
 * ```
 */
```

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
example 标签在 0.28 的语义变了，是版本差异题的富矿。

[click] 没有围栏代码块时，TypeDoc 把整段内容都当作代码，VSCode 也这么认，对 JSDoc 更友好。有围栏代码块时，围栏外的文字当普通文档，只有围栏内当代码。这个行为受 jsDocCompatibility 的 exampleTag 控制。注意重点：0.28 移除了旧版的具名示例，也就是第一行当标题那个语义没了，从老项目升级会发现示例标题变成了代码注释。

[click] 看这段：第一个 example 没有围栏，整段当代码；第二个有围栏，围栏外那行就是普通文字。
-->

---
transition: fade-out
---

# 配置文件与 tsconfig

`typedoc.json` 复用 tsconfig 的编译范围

<v-clicks>

- 配置来源层级：**专用配置文件** > `package.json` 的 `typedocOptions` > `tsconfig.json` 的 `typedocOptions`
- `tsconfig`：复用其 `compilerOptions` / `include` / `exclude` 决定**编译范围**
- `compilerOptions`：**仅配置文件可用**，为生成文档选择性覆盖
- ⚠️ typedoc 的 `exclude` 只决定「哪些**不当入口**」，**不改 TS 编译范围**

</v-clicks>

<div v-click>

```jsonc
{
  "$schema": "https://typedoc.org/schema.json",
  "entryPoints": ["./src/index.ts"],
  "out": "doc"
}
```

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
讲配置文件和 tsconfig 的关系。

[click] 配置来源有三个层级：专用配置文件优先级最高，然后是 package.json 的 typedocOptions，最后是 tsconfig 的 typedocOptions。

[click] tsconfig 选项让 TypeDoc 复用 compilerOptions、include、exclude 来决定编译范围。

[click] compilerOptions 这个选项只能在配置文件里用，为生成文档选择性覆盖 TS 编译选项。

[click] 这里有个易混点：typedoc 自己的 exclude 只决定哪些文件不当入口，不改 TS 的编译范围；要彻底不编译某文件，得改 tsconfig 的 exclude。

[click] 一份最简配置长这样，schema 字段能给 JSON 智能提示。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 可见性与校验

构建期过滤 + CI 门禁

::left::

<div v-click>

**可见性**

| 选项 | 默认 |
| --- | --- |
| `excludePrivate` | **true** |
| `excludeProtected` | false |
| `excludeInternal` | 跟随 `stripInternal` |
| `excludeNotDocumented` | false |

</div>

::right::

<div v-click>

**校验** `validation`

| 子项 | 默认 |
| --- | --- |
| `notExported` | true |
| `invalidLink` | true |
| `notDocumented` | **false** |

`treatWarningsAsErrors` → CI 严格门禁

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
可见性控制和校验，一个管删、一个管告警。

[click] 左边可见性：excludePrivate 默认 true 去掉私有成员；excludeProtected 默认 false；excludeInternal 跟随 TS 的 stripInternal，没设它时是 false，所以 internal 符号可能照样出现，这是个常见坑；excludeNotDocumented 去掉无注释的符号。注意这些是构建期把成员从文档里删掉，和页面上的 visibilityFilters 勾选框不同。

[click] 右边校验：notExported 引用了未导出类型会告警；invalidLink 链接解析不到；notDocumented 默认是关的，开了能强制写注释。配 treatWarningsAsErrors，任何告警都视为致命错误，是 CI 的严格门禁。
-->

---
transition: fade-out
---

# 主题

内置一个默认主题，更多靠插件

<v-clicks>

- 默认主题名 `default`，`--theme <name>` 切换；**默认只出 HTML**
- 小改样式不必写主题：用 `customCss` / `customJs` 即可
- **`router` 选项**（0.28 新增，默认 `kind`）：决定文件夹结构与链接方式
- 社区 HTML 主题：`oxide`(Rustdoc 风) / `material`(Material 3) / DMT

</v-clicks>

<div v-click text-xs mt-4>

接 VitePress / Docusaurus 的命脉是 **`typedoc-plugin-markdown`**（默认 HTML 无法直接被 Markdown 文档站消费）

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
讲主题。

[click] TypeDoc 内置一个默认主题就叫 default，用 theme 切换，它默认只出 HTML。

[click] 想小改样式不用写主题，用 customCss 和 customJs 就行。

[click] 0.28 新增了 router 选项，默认 kind，决定 HTML 输出的文件夹结构和页面间链接方式，还能被插件扩展。

[click] 社区也有不少 HTML 主题，比如 Rustdoc 风的 oxide、Material 3 风格的 material，还有增强 UX 的 DMT。

[click] 但要接 VitePress、Docusaurus，命脉是 typedoc-plugin-markdown，因为默认的 HTML 无法直接被 Markdown 文档站消费，这点下面细说。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 插件生态

`--plugin` 加载，npm 关键词 `typedoc-plugin`

::left::

<div v-click>

| 插件 | 作用 |
| --- | --- |
| **markdown** | 输出 Markdown，接文档站 |
| **vitepress-theme** | 配套，出 sidebar.json |
| **missing-exports** | 纳入未导出但被引用的类型 |
| **coverage** | 文档覆盖率徽章 |

</div>

::right::

<div v-click>

| 插件 | 作用 |
| --- | --- |
| **mermaid** | 渲染 Mermaid 图 |
| **zod** / **valibot** | 还原 `infer` 出的真实类型 |
| **frontmatter** | 给 Markdown 加 frontmatter |
| **llms-txt** | 生成 llms.txt 供 LLM 用 |

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
插件生态很丰富，用 plugin 加载，npm 搜关键词 typedoc-plugin。

[click] 左边最重要的几个：markdown 输出 Markdown 接文档站，是命脉；vitepress-theme 是它的配套，生成 sidebar.json；missing-exports 把未导出但被引用的类型也纳入文档，专治 notExported 告警刷屏；coverage 生成文档覆盖率徽章。

[click] 右边：mermaid 渲染图表；zod 和 valibot 把 infer 推断出的真实类型还原出来；frontmatter 给 Markdown 输出加头部元信息；llms-txt 生成 llms.txt 供大模型消费。
-->

---
transition: fade-out
---

# `@group` vs `@category`

两个独立维度，最常考的辨析

<v-clicks>

- **Group**：`@group X`，不标时**自动按 TS kind 分组**（Functions/Classes…）
- **Category**：`@category X`，**不自动分**，未标的进 `defaultCategory`（默认 "Other"）
- 核心区别：group 有「按 kind 默认分组」，category 没有
- `categorizeByGroup`(默认 false)：开启后在每个 group 内**再按 category 分**
- 0.28：`@group none` / `@category none` 渲染**不出标题**（平铺）

</v-clicks>

<div v-click>

```ts
/** @category Utilities */
export function merge(): void {}
/** @group Events */
export const CLICK = "click";
```

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
group 和 category 是两个独立维度，最常考的辨析题。

[click] group 用 @group，不标的时候会自动按 TS 的 kind 分组，比如 Functions、Classes、Interfaces。

[click] category 用 @category，它不自动分类，没标的元素归到 defaultCategory，默认叫 Other。

[click] 核心区别就是：group 有按 kind 的默认分组，category 没有自动分类。

[click] categorizeByGroup 默认 false，开启后会在每个 group 内部再按 category 分，形成先 group 后 category 的两级。

[click] 0.28 起，group none 和 category none 渲染时不出标题，直接平铺。

[click] 看这段：category 把 merge 归到 Utilities，group 把 CLICK 归到 Events 组。
-->

---
transition: fade-out
---

# typedoc-plugin-markdown

把反射树渲染为 Markdown 而非 HTML

<v-clicks>

- 接 VitePress / Docusaurus / wiki 的**命脉**（4.12.0，peer `typedoc 0.28.x`）
- `entryFileName`：入口 MD 文件名（默认 `README.md`，VitePress 常改 `index.md`）
- `hideBreadcrumbs` / `hidePageHeader`：去面包屑 / 页头
- 成员格式：`parametersFormat` / `propertiesFormat` / `enumMembersFormat`（`list`/`table`）
- 配 `typedoc-plugin-frontmatter` 给每页加 frontmatter

</v-clicks>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
单独讲讲 typedoc-plugin-markdown，因为它太关键了。

[click] 它把反射树渲染成 Markdown 而不是 HTML，是接 VitePress、Docusaurus、wiki 的命脉，当前 4.12.0，peer 要求 typedoc 0.28。

[click] entryFileName 控制入口 Markdown 文件名，默认 README，VitePress 里常改成 index。

[click] hideBreadcrumbs 和 hidePageHeader 去掉面包屑和页头。

[click] 成员渲染格式有 parametersFormat、propertiesFormat、enumMembersFormat，可以选 list 或 table。

[click] 再配 typedoc-plugin-frontmatter，就能给每页加 frontmatter。
-->

---
transition: fade-out
---

# 接 VitePress 实战

先跑 typedoc 出 Markdown，再 vitepress build

<div v-click>

```jsonc
// typedoc.json
{
  "plugin": ["typedoc-plugin-markdown", "typedoc-vitepress-theme"],
  "entryPoints": ["./src/index.ts"],
  "out": "./docs/api",
  "sidebar": { "autoConfiguration": true, "format": "vitepress" }
}
```

</div>

<div v-click text-sm mt-2>

会额外吐出 `docs/api/typedoc-sidebar.json`，在 VitePress 配置里 import 进 `sidebar`

</div>

<div v-click text-xs mt-2>

脚本顺序：`"docs:build": "typedoc && vitepress build docs"`（**typedoc 必须在前**）

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
看一个接 VitePress 的完整实战。

[click] typedoc.json 里挂两个插件：markdown 和 vitepress-theme；入口指向 src/index；输出到 VitePress 的 docs/api 目录；sidebar 开自动配置、格式选 vitepress。

[click] 生成时会额外吐出一个 typedoc-sidebar.json，你在 VitePress 的配置里 import 进 sidebar 就行。

[click] 关键是脚本顺序：docs:build 里 typedoc 必须排在 vitepress build 前面，先生成 Markdown 再构建站点。
-->

---
transition: fade-out
---

# monorepo（packages 策略）

每个包独立跑一遍 TypeDoc 再合并

<div v-click>

```jsonc
// 根 typedoc.json
{
  "entryPointStrategy": "packages",
  "entryPoints": ["packages/*"],       // 每个子目录是一个包
  "packageOptions": {                  // 路径相对各包目录
    "entryPoints": ["src/index.ts"],
    "excludeInternal": true
  }
}
```

</div>

<v-clicks>

- `packageOptions`：仅 `packages` 策略生效，路径**相对各包目录**
- ⚠️ 子包里的**插件不会被加载**（只在顶层配置加载）

</v-clicks>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
monorepo 用 packages 策略，每个包独立跑一遍再合并成单一输出。

[click] 根 typedoc.json 里：策略设为 packages；entryPoints 用 glob 指向每个子目录；packageOptions 是应用到每个包内部的选项，里面的路径相对各包目录解释，比如这里给每个包指定入口和排除 internal。

[click] packageOptions 仅在 packages 策略时生效，路径相对各包目录。

[click] 还是那个坑：子包里的插件不会被加载，插件只在顶层配置加载，子包只继承 packageOptions。
-->

---
transition: fade-out
---

# JSON 输出与编程式 API

结构化数据喂给自定义管线

<v-clicks>

- `--json <file>`：输出全部反射数据；`pretty`(默认 true) 美化
- `emit`：`docs`(默认) / `both` / `none`；`outputs` 数组可一次出多种
- 结构由 `JSONOutput.ProjectReflection` 定义，插件可注册 `Serializer`
- `typedoc/browser` 入口（0.28 新增）：浏览器里反序列化 JSON 还原模型

</v-clicks>

<div v-click>

```js
import * as td from "typedoc";
const app = await td.Application.bootstrapWithPlugins({
  entryPoints: ["src/index.ts"],
});
const project = await app.convert();
if (project) await app.generateOutputs(project);
```

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
TypeDoc 也能出结构化 JSON，喂给自定义管线。

[click] json 选项输出全部反射数据，pretty 默认美化；emit 控制出不出 JS，默认 docs 只出文档，还有 both 和 none；0.28 的 outputs 数组能一次出多种输出。

[click] JSON 结构由 ProjectReflection 接口定义，插件可以注册 Serializer 加自定义属性。

[click] 0.28 还新增了 typedoc/browser 入口，能在浏览器里反序列化 JSON 还原成模型分析。

[click] 编程式 API 也很简单：bootstrapWithPlugins 会加载插件，convert 出错时可能是 undefined，所以要判空，再 generateOutputs 按配置生成所有输出。
-->

---
transition: fade-out
---

# 0.28 重大变更

版本差异题富矿

<v-clicks>

- **纯 ESM**，drop TS < 5.0；引入 **`Router`** 抽象
- `Reflection.url` / `.anchor` / `.hasOwnDocument` **被移除**（旧插件崩）
- 入口 glob **必须用 `/`**，不再接受反斜杠
- `intentionallyNotExported` 改用**包相对路径**（原绝对路径）
- 新增 **`outputs` 数组** + `router` 选项 + `typedoc/browser`
- 重命名 `namedAnchors` → **`useHTMLAnchors`**；`@example` 语义变了

</v-clicks>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
0.28 的重大变更，是版本差异题的富矿。

[click] 首先它变成了纯 ESM，drop 掉 TS 5.0 以下；引入了 Router 抽象来做 URL 生成。

[click] 反射上的 url、anchor、hasOwnDocument 三个属性被移除，依赖它们的旧插件会崩。

[click] 入口 glob 必须用斜杠分隔，不再接受反斜杠，Windows 用户要注意。

[click] intentionallyNotExported 的文件名引用改成了包相对路径，老写法的绝对路径会失效。

[click] 新增的有 outputs 数组、router 选项、typedoc/browser 入口。

[click] 还把 namedAnchors 重命名成 useHTMLAnchors；example 标签的语义也变了，前面讲过。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 工具链对比

各司其职，按项目形态选型

::left::

<div v-click>

| 工具 | 类型来源 |
| --- | --- |
| **TypeDoc** | **TS 编译器/类型系统** |
| **JSDoc** | 注释里的 `@type` 标注 |
| **API Extractor** | `.d.ts`（已是类型） |
| **TSDoc** | —（规范，非工具） |

</div>

::right::

<div v-click>

| 工具 | 主用途 |
| --- | --- |
| **TypeDoc** | 给人浏览的 API 站 / JSON |
| **JSDoc** | 纯 JS 项目文档 |
| **API Extractor** | API 治理 / 防破坏 |
| **TSDoc** | 统一注释语法 |

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
横向对比一圈，各司其职。

[click] 左边看类型来源：TypeDoc 从 TS 编译器、类型系统取，含推断、泛型、联合；JSDoc 靠注释里的 type 标注；API Extractor 吃的 d.ts 本身就是类型；TSDoc 是规范，不涉及类型来源。

[click] 右边看主用途：TypeDoc 做给人浏览的 API 站或 JSON；JSDoc 做纯 JS 项目文档；API Extractor 做 API 治理和防破坏；TSDoc 统一注释语法被前面几个参考。它们是互补，不是二选一。
-->

---
transition: fade-out
---

# 踩坑清单

容易翻车的几个点

<v-clicks>

1. `exclude` ≠ tsconfig 的 exclude，前者只管「不当入口」，不改编译
2. `@internal` 默认**不一定被过滤**——`excludeInternal` 跟随 `stripInternal`
3. `notExported` 刷屏：导出它 / 用 `missing-exports` / 列 `intentionallyNotExported`
4. 0.28 入口路径**反斜杠失效**，必须 `/`
5. 接 VitePress 却用默认主题——**必须** `typedoc-plugin-markdown`
6. `@example` 0.28 变了：无围栏整段当代码（具名示例已移除）
7. `--json` **静默覆盖** `outputs`；第三方 `.d.ts` 报错加 `skipLibCheck`

</v-clicks>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
最后把容易翻车的点收成一张清单。

[click] 第一，exclude 不等于 tsconfig 的 exclude，前者只管哪些不当入口，不改编译范围。

[click] 第二，internal 默认不一定被过滤，因为 excludeInternal 跟随 stripInternal，没设它时是 false。

[click] 第三，notExported 告警刷屏，对策是导出它、用 missing-exports 插件、或列进 intentionallyNotExported。

[click] 第四，0.28 入口路径反斜杠失效，必须用斜杠。

[click] 第五，想接 VitePress 却用默认主题没用，必须装 plugin-markdown。

[click] 第六，example 在 0.28 变了，无围栏整段当代码，具名示例已移除。

[click] 第七，json 选项会静默覆盖 outputs；第三方 d.ts 报错就加 skipLibCheck。
-->

---
layout: center
class: text-center
transition: slide-up
---

# 谢谢观看

TypeDoc：直读 TypeScript 类型，自动生成可浏览的 API 文档

<div class="mt-8 flex justify-center gap-6 text-sm">
  <a href="https://typedoc.org/" target="_blank">官方文档</a>
  <a href="https://typedoc.org/documents/Options.html" target="_blank">配置选项</a>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天就到这里。

一句话总结 TypeDoc：它直接读 TypeScript 的类型系统，自动生成可浏览的 API 文档，注释只负责描述。接文档站靠 plugin-markdown，monorepo 用 packages 策略，升级到 0.28 注意纯 ESM 和那一批破坏性变更。需要深入就看官方文档和配置选项页。谢谢大家！
-->
