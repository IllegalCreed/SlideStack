---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Redoc
info: |
  Presentation about Redoc for developers.

  Learn more at [https://redocly.com/redoc](https://redocly.com/redoc)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Redoc

把 OpenAPI 渲染成漂亮三栏只读文档的开源渲染器（基于 Redoc 2.5.3）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天聊 Redoc —— Redocly 出品的开源 OpenAPI 文档渲染器。
一句话先记住：它消费 spec、不生成 spec，把 OpenAPI 画成漂亮的三栏只读文档。
-->

---
transition: fade-out
---

# Redoc 是什么？

一个「OpenAPI 文档渲染器」，**消费 spec、不生成 spec**

<v-clicks>

- Redocly 出品的**开源（MIT）**OpenAPI 文档渲染器
- 把已有的 `openapi.yaml` 渲染成**响应式三栏只读**文档
- 关键：**先有 spec 才能渲染**，它不帮你从代码反推 spec
- 是 Redocly 商业平台的**社区版**

</v-clicks>

<div v-click="4" text-xs mt-6>

_Read more about_ [_Redoc_](https://redocly.com/redoc)

</div>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Redoc 是什么？一句话：它是一个 OpenAPI 文档渲染器，消费 spec、不生成 spec。

[click] 它是 Redocly 出品的开源 MIT 库。

[click] 把你已有的 openapi.yaml 渲染成响应式三栏只读文档。

[click] 关键认知：得先有 spec，它不从代码反推 spec。

[click] 它是 Redocly 商业平台的社区版。
-->

---
transition: fade-out
---

# 三栏只读布局

Redoc 的招牌版面

<v-clicks>

- **左栏**：可滚动的导航菜单
- **中栏**：接口与 schema 的正文内容
- **右栏**：请求 / 响应的代码样例
- 菜单与内容**滚动同步**（scroll-spy）：翻到哪、左侧高亮到哪
- 默认**只读**——不内置「点按钮发请求」的交互

</v-clicks>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Redoc 的招牌就是三栏只读布局。

[click] 左栏是导航菜单。

[click] 中栏是接口和 schema 正文。

[click] 右栏是请求响应的代码样例。

[click] 菜单和内容滚动同步，翻到哪里左侧就高亮到哪里。

[click] 而且默认是只读的，不内置发请求的交互。
-->

---
transition: fade-out
---

# Redoc 不是什么

三个最常见的误解

<v-clicks>

- **不生成 spec**：它只渲染你写好的 OpenAPI，生成 spec 是别的工具的事
- **开源版不带 Try-it-out**：默认只读，交互调用属商业版 / Replay
- **不等于 Swagger UI**：都吃 OpenAPI，但定位、版面都不同

</v-clicks>

<div v-click text-sm mt-6>

把 Redoc 当成「喂代码就吐 spec 的全栈工具」，是方向性的认知错误。

</div>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
反过来澄清 Redoc 不是什么。

[click] 它不生成 spec，只渲染你写好的 OpenAPI。

[click] 开源版不带 Try-it-out，交互调用在商业版。

[click] 它不等于 Swagger UI，定位和版面都不同。

[click] 把它当成喂代码就吐 spec 的全栈工具，是方向性错误。
-->

---
transition: fade-out
---

# Redoc vs Redocly

别把开源库和公司 / 商业产品混为一谈

<v-clicks>

- **Redoc**：开源（MIT）的 OpenAPI 渲染**库**
- **Redocly**：出品 Redoc 的**公司**，及其商业产品线
- 商业产品：Reunite / Realm / Revel / Reef 等门户 / 平台方案
- 交互式 Try-it-out / Replay 属**商业范畴**——库 MIT ≠ 所有能力免费

</v-clicks>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
一个高频混淆点：Redoc 和 Redocly。

[click] Redoc 是那个开源 MIT 的渲染库。

[click] Redocly 是出品它的公司，及其商业产品线。

[click] 商业产品有 Reunite、Realm、Revel、Reef 这些门户和平台方案。

[click] 交互式 Try-it-out 和 Replay 属于商业范畴。注意：库是 MIT，不等于所有能力都免费。
-->

---
transition: fade-out
---

# 四种接入方式

按场景任选一条路径

<v-click>

| 方式 | 适用场景 |
| --- | --- |
| **HTML 自定义元素** | 往任意静态页面快速嵌入 |
| **`Redoc.init` JS API** | 非 React、手动控制挂载时机 |
| **React 组件** | React / Next.js 应用内嵌 |
| **CLI `build-docs`** | CI 里出可部署静态 HTML |

</v-click>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Redoc 有四种接入方式，按场景任选。

[click] HTML 自定义元素适合往任意静态页面快速嵌；Redoc.init 适合非 React、要手动控制挂载时机；React 组件适合 React 或 Next 应用内嵌；CLI 的 build-docs 适合在 CI 里产出可部署的静态 HTML。
-->

---
transition: fade-out
---

# 接入一：HTML 自定义元素

最快嵌入：一个元素 + 一个脚本

<div v-click>

```html
<redoc spec-url="https://redocly.github.io/redoc/openapi.yaml"></redoc>
<script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
```

</div>

<v-clicks>

- `spec-url` 指向你的 OpenAPI 文件
- standalone 脚本自包含运行时，无需另引 React
- 生产环境把 `latest` 换成**固定版本号**

</v-clicks>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
接入方式一，HTML 自定义元素，最快。

[click] 就这两行：一个 redoc 元素加一个 standalone 脚本。

[click] spec-url 指向你的 OpenAPI 文件。

[click] standalone 脚本是自包含的，无需另外引 React。

[click] 生产环境记得把 latest 换成固定版本号，避免无意升级。
-->

---
transition: fade-out
---

# 接入二：`Redoc.init` JS API

命令式挂载到指定 DOM

<div v-click>

```js
Redoc.init(
  "openapi.yaml",                        // ① spec 或其 URL
  { jsonSamplesExpandLevel: "all" },     // ② options 配置对象
  document.getElementById("redoc"),      // ③ 挂载的 DOM 容器
  (err) => { if (!err) console.log("done"); } // ④ 完成回调
);
```

</div>

<div v-click text-sm mt-2>

签名：`Redoc.init(specOrSpecUrl, options, element, callback)`。第三个参数是挂载容器，别和 spec 搞混。

</div>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
接入方式二，Redoc.init 这个 JS API，命令式挂载。

[click] 四个参数依次是：spec 或其 URL、options 配置对象、要挂载进去的 DOM 容器、完成回调。

[click] 记住签名，第三个参数是挂载容器，别和第一个 spec 参数搞混。
-->

---
transition: fade-out
---

# 接入三：React 组件

`RedocStandalone`，`options` 用 camelCase 对象

<div v-click>

```tsx
import { RedocStandalone } from "redoc";

<RedocStandalone
  specUrl="openapi.yaml"
  options={{ scrollYOffset: 50, hideDownloadButtons: true }}
/>;
```

</div>

<v-clicks>

- `specUrl` 指向 OpenAPI 文件（也可用 `spec` 直接给对象）
- `options` 是普通 JS 对象，**camelCase** 键名，嵌套直接写对象

</v-clicks>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
接入方式三，React 组件 RedocStandalone。

[click] 从 redoc 包导入 RedocStandalone，传 specUrl 和 options。

[click] specUrl 指向文件，也可以用 spec 直接给对象；options 是普通 JS 对象，键名用 camelCase，嵌套对象直接写，不用 JSON 字符串。
-->

---
transition: fade-out
---

# 接入四：CLI 出静态文档

`@redocly/cli build-docs`，CI 友好

<div v-click>

```bash
# 默认输出自包含的 redoc-static.html
npx @redocly/cli build-docs apis/openapi.yaml

# -o 改名 / 改路径
npx @redocly/cli build-docs apis/openapi.yaml -o dist/api.html
```

</div>

<v-clicks>

- 默认产物文件名是 **`redoc-static.html`**（自包含单文件）
- 用 **`-o`** 自定义输出文件名 / 路径

</v-clicks>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
接入方式四，用 CLI 出静态文档，最适合 CI。

[click] 命令是 @redocly/cli build-docs 加上你的 spec 路径；用 -o 改输出。

[click] 默认产物是自包含的 redoc-static.html。

[click] 想改文件名或路径就用 -o。
-->

---
transition: fade-out
---

# redoc-cli 已弃用

迁移到 `@redocly/cli`

<v-clicks>

- 独立的 `redoc-cli`（0.13.21）已于 **2023-03 弃用停更**
- 能力并入 **`@redocly/cli`**（约 2.34.0）
- 还在脚本里写 `redoc-cli` 是典型的过时坑

</v-clicks>

<div v-click>

| 旧（已弃用） | 新（@redocly/cli） |
| --- | --- |
| `redoc-cli build` | `redocly build-docs` |
| `redoc-cli bundle` | `redocly bundle` |

</div>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
特别提醒：redoc-cli 已经弃用了。

[click] 独立的 redoc-cli，最后版本 0.13.21，2023 年 3 月就停更了。

[click] 能力并入了 @redocly/cli。

[click] 还在脚本里写 redoc-cli 是典型的过时坑。

[click] 迁移对照：build 对应 redocly build-docs，bundle 对应 redocly bundle。注意 bundle 是合并 spec，不是出文档。
-->

---
transition: fade-out
---

# 配置怎么传

两套命名，别用错

<v-click>

| 接入方式 | 命名风格 | 嵌套 theme |
| --- | --- | --- |
| HTML 元素 | **kebab-case** 属性 | JSON 字符串 |
| `Redoc.init` | **camelCase** 对象 | 直接写对象 |
| React `options` | **camelCase** 对象 | 直接写对象 |

</v-click>

<div v-click text-sm mt-3>

例：`scrollYOffset`（JS）→ HTML 元素上写 `scroll-y-offset`。

</div>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
配置传递有两套命名，别用错。

[click] HTML 元素上配置走 kebab-case 属性，嵌套的 theme 要序列化成 JSON 字符串；而 Redoc.init 和 React 的 options 用 camelCase 对象，嵌套直接写对象。

[click] 举例：JS 里的 scrollYOffset，到 HTML 元素上要写成连字符式的 scroll-y-offset。
-->

---
transition: fade-out
---

# HTML 属性命名坑

camelCase 在 HTML 属性上**不生效**

<div v-click>

```html
<!-- ❌ HTML 属性误用 camelCase -->
<redoc spec-url="openapi.yaml" scrollYOffset="50"></redoc>

<!-- ✅ HTML 属性须 kebab-case -->
<redoc spec-url="openapi.yaml" scroll-y-offset="50"></redoc>
```

</div>

<div v-click text-sm mt-2>

只有 `Redoc.init` / React 的 `options` 对象才用 camelCase。

</div>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
HTML 属性命名是个常见坑。

[click] 上面那行在 HTML 属性上用了 camelCase 的 scrollYOffset，不生效；下面用连字符式的 scroll-y-offset 才对。

[click] 只有 Redoc.init 和 React 的 options 对象才用 camelCase。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-12
---

# 常用配置项（2.x）

布尔开关与展开层级

::left::

<div v-click>

- **布尔开关**

  | 项 | 作用 |
  | --- | --- |
  | `disableSearch` | 关搜索 |
  | `hideDownloadButtons` | 隐藏下载按钮 |
  | `sortRequiredPropsFirst` | 必填排前 |
  | `showExtensions` | 显示 `x-` 扩展 |

</div>

::right::

<div v-click>

- **展开 / 偏移**

  | 项 | 作用 |
  | --- | --- |
  | `jsonSamplesExpandLevel` | JSON 样例展开（默认 2） |
  | `schemasExpansionLevel` | schema 展开层级 |
  | `scrollYOffset` | 锚点跳转偏移 |
  | `theme.*` | 主题颜色 / 字体 |

</div>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
2.x 常用配置项分两组。

[click] 左边是布尔开关：disableSearch 关搜索、hideDownloadButtons 隐藏下载按钮、hideSchemaTitles 隐藏 schema 标题、sortRequiredPropsFirst 必填排前、showExtensions 显示 x- 扩展。

[click] 右边是展开和偏移：jsonSamplesExpandLevel 控制 JSON 样例展开层级默认 2、schemasExpansionLevel 控制 schema 展开层级、onlyRequiredInSamples 让样例只含必填、scrollYOffset 控制锚点跳转偏移、theme 定制颜色字体。
-->

---
transition: fade-out
---

# 已废弃旧选项名

照搬老文档 = 不报错但不生效

<v-click>

| 旧名（已废弃） | 现行替代 |
| --- | --- |
| `hideDownloadButton` | `hideDownloadButtons` |
| `requiredPropsFirst` | `sortRequiredPropsFirst` |
| `jsonSampleExpandLevel` | `jsonSamplesExpandLevel` |
| `expandResponses` | （已弃用） |
| `nativeScrollbars` | （已弃用） |

</v-click>

<div v-click text-sm mt-3>

配置静默失效时，第一怀疑就是用了废弃旧名。

</div>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Redoc 2.x 改了一批选项名，照搬老文档的旧名通常不报错但不生效。

[click] 比如旧的 hideDownloadButton 单数要改成复数；requiredPropsFirst 改成 sortRequiredPropsFirst；jsonSampleExpandLevel 改成复数的 jsonSamplesExpandLevel；expandResponses、nativeScrollbars 已弃用。

[click] 配置静默失效时，第一个怀疑对象就是用了废弃的旧名。
-->

---
transition: fade-out
---

# Vendor Extensions

Redoc 特有的 `x-` 增强字段

<v-clicks>

- **`x-tagGroups`**：把多个 tag 归成带标题的**分组导航**（二级结构）
- **`x-logo`**：放 `info` 下，文档展示**品牌 Logo**
- **`x-codeSamples`**：operation 下提供**多语言请求示例**（右栏展示）
- 这些是 Redoc 增强，不识别的工具会忽略 `x-` 字段

</v-clicks>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Redoc 支持几个特有的 vendor extension，x- 开头的增强字段。

[click] x-tagGroups 把多个 tag 归成带标题的分组导航，做出二级结构；x-logo 放在 info 下，让文档展示品牌 Logo；x-codeSamples 写在 operation 下，提供多语言的请求示例，展示在右栏。

[click] 这些是 Redoc 的增强，不识别它们的工具会直接忽略 x- 字段，不影响 spec 合法性。
-->

---
transition: fade-out
---

# x-codeSamples 示例

为接口提供多语言调用范例

<div v-click>

```yaml
paths:
  /users/{id}:
    get:
      x-codeSamples:
        - lang: cURL
          source: curl https://api.example.com/users/1
        - lang: JavaScript
          source: await fetch("/users/1")
```

</div>

<div v-click text-sm mt-2>

注意：这是**写死的示例片段**，供复制参考，**不是**能发请求的 Try-it-out。

</div>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
看一个 x-codeSamples 的例子。

[click] 在某个接口下用数组给出多种语言的调用示例，比如 cURL 和 JavaScript，会展示在右栏。

[click] 注意：这只是写死的示例片段，供读者复制参考，不是能真正发请求的 Try-it-out。
-->

---
transition: fade-out
---

# 开源版没有 Try-it-out

最高频的误解

<v-clicks>

- 开源 Redoc **默认是只读三栏参考文档**
- 「点按钮真正发请求调接口」属**商业版 / Replay**
- 要交互调用：选 Swagger UI / Scalar，或上 Redocly 商业版
- 没有 `try-it-out="true"` 这种开关能让开源版变可调

</v-clicks>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这是最高频的误解，单独强调一页。

[click] 开源 Redoc 默认是只读的三栏参考文档。

[click] 能点按钮真正发请求调接口的能力，属于商业版或 Replay。

[click] 要交互调用，选 Swagger UI 或 Scalar，或者上 Redocly 商业版。

[click] 没有什么 try-it-out 等于 true 的开关能让开源版变成可调。
-->

---
transition: fade-out
---

# Redoc vs Swagger UI vs Scalar

| 工具 | 版面 | 内置交互调用 |
| --- | --- | --- |
| **Redoc** | 三栏 | 开源版**无**（商业版有） |
| **Swagger UI** | 单栏 | **有**（try-it-out） |
| **Scalar** | 现代三栏 | **有**（API 客户端） |

<div v-click text-sm mt-3>

三者都消费 OpenAPI，差异集中在**版面**与**是否内置交互调用**。

</div>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
把三个工具拉直对比。

Redoc 三栏，开源版无交互调用；Swagger UI 单栏，内置 try-it-out；Scalar 现代三栏，内置 API 客户端。

[click] 三者都消费 OpenAPI，差异集中在版面和是否内置交互调用。Scalar 和 Redoc 都三栏，但 Scalar 默认能调接口。
-->

---
transition: fade-out
---

# 怎么选

一句话判据

<v-clicks>

- 要**能点着调接口** → Swagger UI / Scalar
- 要**漂亮的只读三栏参考文档** → Redoc
- 复杂 schema 多（`oneOf` / `discriminator`）→ Redoc 渲染强是加分
- 有遗留 Swagger 2.0 → Redoc 也支持，可直接渲染
- 要品牌化 → Redoc 的 `x-logo` / `x-tagGroups` / `x-codeSamples`

</v-clicks>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
怎么选，一句话判据。

[click] 要能点着调接口，选 Swagger UI 或 Scalar。

[click] 要漂亮的只读三栏参考文档，选 Redoc。

[click] 复杂 schema 多，比如 oneOf、discriminator，Redoc 渲染强是加分项。

[click] 有遗留的 Swagger 2.0，Redoc 也支持，可直接渲染。

[click] 要品牌化，Redoc 的 x-logo、x-tagGroups、x-codeSamples 很好用。
-->

---
transition: fade-out
---

# 本地预览的同源策略坑

`file://` 直开会加载失败

<v-clicks>

- `file://` 双击打开 HTML、再 `fetch` 本地 spec → 被同源策略 / CORS 拦下
- 正确做法：起一个本地 **HTTP server**
- 通过 `http://localhost:...` 访问页面与 spec

</v-clicks>

<div v-click>

```bash
npx serve .          # 或 python -m http.server
```

</div>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
本地预览有个同源策略坑。

[click] 直接 file 协议双击打开 HTML、再去 fetch 本地 spec，会被浏览器的同源策略或 CORS 拦下，加载失败。

[click] 正确做法是起一个本地 HTTP server。

[click] 通过 http localhost 访问页面和 spec。

[click] 命令很简单，npx serve 点，或者 python 的 http.server。
-->

---
transition: fade-out
---

# 踩坑清单

<v-clicks>

1. 以为开源 Redoc **自带 Try-it-out**（错，商业版才有）
2. 还在用 **`redoc-cli`**（已弃用，改 `@redocly/cli build-docs`）
3. 照搬**老选项名**（`hideDownloadButton` / `expandResponses` 等已废弃）
4. **`file://` 直开**加载本地 spec 失败（需 HTTP server）
5. HTML 属性误用 **camelCase**（须 kebab-case）；混淆 **Redoc / Redocly**

</v-clicks>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
把容易翻车的点收成清单。

[click] 以为开源 Redoc 自带 Try-it-out，错，商业版才有。

[click] 还在用 redoc-cli，已弃用，改 @redocly/cli build-docs。

[click] 照搬老选项名，比如 hideDownloadButton、expandResponses 都废弃了。

[click] file 协议直开加载本地 spec 失败，需要 HTTP server。

[click] HTML 属性误用 camelCase 必须 kebab-case；以及混淆 Redoc 开源库和 Redocly 公司及商业产品。
-->

---
transition: fade-out
---

# 版本与生态

| 项 | 版本 | 说明 |
| --- | --- | --- |
| `redoc` | **2.5.3** | 稳定线，另有 next `3.0.0-rc.0` |
| `@redocly/cli` | **2.34.0** | 现行 CLI，含 `build-docs` |
| `redoc-cli` | 0.13.21 | **已弃用停更**（2023-03） |

<div v-click text-sm mt-3>

许可证 **MIT**；支持 **OpenAPI 3.1 / 3.0 / Swagger 2.0**。

</div>

<style>
h1 {
  background-color: #119DA4;
  background-image: linear-gradient(45deg, #119DA4 10%, #0b6e73 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Redoc 的版本与生态。

redoc 稳定线是 2.5.3，另有 next 的 3.0.0-rc.0；现行 CLI 是 @redocly/cli 2.34.0，含 build-docs；老的 redoc-cli 0.13.21 已弃用停更。

[click] 许可证是 MIT，支持 OpenAPI 3.1、3.0 和 Swagger 2.0。
-->

---
layout: center
class: text-center
transition: slide-up
---

# 谢谢观看

Redoc：把一份 OpenAPI，渲染成漂亮的三栏只读文档

<div class="mt-8 flex justify-center gap-6 text-sm">
  <a href="https://redocly.com/redoc" target="_blank">产品页</a>
  <a href="https://redocly.com/docs/redoc" target="_blank">文档</a>
  <a href="https://github.com/Redocly/redoc" target="_blank">GitHub</a>
  <a href="https://redocly.github.io/redoc/" target="_blank">Demo</a>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天就到这里。

一句话总结 Redoc：它把一份 OpenAPI 渲染成漂亮的三栏只读文档。它消费 spec、不生成 spec，开源版只读、交互调用在商业版。要深入就看产品页、文档、GitHub 和官方 Demo。谢谢大家！
-->
