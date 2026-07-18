---
theme: seriph
background: https://cover.sli.dev
title: 按需引入完全指南
info: |
  前端按需引入完全指南：Element Plus / lodash-es / ECharts + unplugin 自动导入

  Learn more at [https://element-plus.org/en-US/guide/quickstart](https://element-plus.org/en-US/guide/quickstart)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 按需引入完全指南

前端按需引入 · Element Plus / lodash-es / ECharts · 2026-07

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
按需引入 = 编译期/构建期剪掉没用代码。三前提：ESM + sideEffects + bundler。
-->

---
transition: fade-out
---

# 什么是按需引入

相对**全量引入**的工程实践——只把真正用到的模块/组件/方法打包

- **削减体积**：lodash 全量 25KB gzip → 单方法几百字节
- **ESM 原生**：tree-shaking 是 ESM 静态结构的红利
- **细粒度可控**：ECharts 五件套精确到「只用 SVG + 折线」
- **三大场景**：UI 库组件 / 工具库方法 / 图表库图表类型
- **类型友好**：ComposeOption 拼接最小类型

> 不是新语法，是 ESM + tree-shaking + 工具链的综合实践。

<!--
强调按需引入的本质：构建期剪枝。
-->

---

# 全量 vs 按需：体积对比

| 库 | 全量 gzip | 按需 gzip（典型场景） |
|------|------|------|
| lodash | ≈ 25KB | `debounce` ≈ 1KB |
| lodash-es | ≈ 25KB | 命名引入即按需 |
| Element Plus | CSS 300KB+JS | 仅用到的组件（< 50KB） |
| ECharts | ≈ 330KB | 折线 + Tooltip + Canvas ≈ 200KB |

量级总是「百 KB → 几 KB / 几十 KB」

> 体积收益立竿见影，是性能优化的性价比抓手。

<!--
体积对照直观展示按需引入的价值。
-->

---

# 三前提：缺一不可

**tree-shaking 真正发生的三个条件**

- **ESM 静态结构**：`import` / `export` 是声明，编译期可静态分析
- **package.json `sideEffects`**：声明哪些文件有副作用不能剪
- **bundler 支持**：Vite / Rollup / Webpack 5+（生产模式）

```text
ESM (静态结构)  +  sideEffects (副作用声明)  +  bundler  →  tree-shaking
  编译期可分析       标记能剪/不能剪              实际剪枝
```

> CJS 的 `require` 是运行时值，无法静态分析——这是 lodash 整包不可 tree-shake 的根因。

<!--
三前提是理解所有按需引入场景的钥匙。
-->

---

# sideEffects 字段三取值

| 取值 | 含义 | bundler 行为 |
|------|------|------|
| `false` | 整包无副作用 | 所有未引用导出可剪 |
| 数组白名单 | 列出文件有副作用 | 白名单保留，其余剪 |
| 不设 | 保守有副作用 | 整包打入，不剪 |

```json
{ "name": "my-ui-lib", "sideEffects": false }
{ "name": "my-ui-lib", "sideEffects": ["*.css", "*.scss"] }
```

> 库设错会误删 CSS / polyfill；业务项目设错同理。

<!--
库作者最该重视的字段；业务项目设错会误删 polyfill。
-->

---

# Element Plus 自动按需：双插件

`unplugin-vue-components` + `unplugin-auto-import` 必须**并用**

| 插件 | 负责 | 不装后果 |
|------|------|------|
| `AutoImport` | `ElMessage` / `ElMessageBox` 命令式 API | API 缺失 |
| `Components` | `<el-button>` 组件 + 样式 | 组件不渲染、样式丢失 |

```text
AutoImport + ElementPlusResolver  →  ElMessage() 命令式 API
Components + ElementPlusResolver  →  <el-button> 组件 + 样式
```

> 同一个 ElementPlusResolver 协同：一个管 JS API、一个管组件 DOM 与 CSS。

<!--
双插件缺一不可：少装一个就缺 API 或缺组件。
-->

---

# Element Plus 配置示例

```ts
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default {
  plugins: [
    AutoImport({ resolvers: [ElementPlusResolver()], dts: true }),
    Components({ resolvers: [ElementPlusResolver()], dts: true }),
  ],
}
```

`ElementPlusResolver` 选项：

- `importStyle: 'css'`（默认）：引入预编译 CSS，**改不了** SCSS 变量
- `importStyle: 'sass'`：引入 SCSS 源码，可改主题变量（要 `additionalData` 注入）
- `importStyle: false`：不引样式，自行管理

> 主题定制用 `@forward 'element-plus/.../var.scss'`；Sass 团队将废弃 `@import`。

<!--
importStyle 三选项决定主题定制能力；改 SCSS 变量必须切 sass。
-->

---

# lodash-es 按需：ESM 命名导入

三种写法对照

| 写法 | 包类型 | tree-shake | 备注 |
|------|------|------|------|
| `import _ from 'lodash-es'` | ESM | ❌ | 默认导入聚合全部 |
| `import { debounce } from 'lodash-es'` | ESM | ✅ | **推荐** |
| `import debounce from 'lodash/debounce'` | CJS | ✅ | 子路径备选 |
| `import _ from 'lodash'` | CJS | ❌ | 整包 |

```ts
// ✅ 命名导入即按需，无需插件
import { debounce, throttle } from 'lodash-es'

// ❌ 反模式：默认导入拉整个库
import _ from 'lodash-es'
```

> `babel-plugin-lodash` 针对 CJS lodash；配 lodash-es 反而多余甚至冲突。

<!--
lodash-es 的 ESM 命名导入是 tree-shake 友好写法。
-->

---

# ECharts 按需：五件套

`echarts/core` + `charts` + `components` + `features` + `renderers`

```ts
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  BarChart, LineChart,
  TooltipComponent, GridComponent,
  LabelLayout, UniversalTransition,
  CanvasRenderer,
])
```

> 必须显式 `echarts.use([...])`——只 import 不 use 会静默失效。

<!--
五件套并用：core + charts + components + features + renderers。
-->

---

# ECharts 关键规则

- **必须显式注册渲染器**：core 不含任何 renderer，漏注册会**报错**
- **二选一**：`CanvasRenderer`（默认）或 `SVGRenderer`（移动端轻量场景）
- **v5+ 禁默认导入**：仅 named export，`import echarts from 'echarts'` 会抛错
- **v6 与 v5 tree-shaking API 完全一致**：写法不变

```ts
// ❌ 禁止
import echarts from 'echarts'

// ✅ 必须命名空间导入
import * as echarts from 'echarts/core'
```

> 纯 SVG 模式时只引 SVGRenderer 可省去 Canvas 代码——官方为此设计。

<!--
ECharts v5/v6 的 tree-shaking API 一致；渲染器漏注册直接报错。
-->

---

# ECharts TS：ComposeOption 类型拼接

按已注册组件拼接**最小 Option 类型**，编译期查「用了未注册组件」

```ts
import type { ComposeOption } from 'echarts/core'
import type { BarSeriesOption } from 'echarts/charts'
import type { GridComponentOption } from 'echarts/components'

type ECOption = ComposeOption<
  BarSeriesOption | GridComponentOption
>
```

- series 写了 `type: 'pie'` 但没注册 `PieChart` → TS 编译报错
- 运行时则**静默失效**（图表空白，不报错）

> 类型按需是按需引入的「编译期守门员」。

<!--
ComposeOption 把「用了未注册组件」变成编译期错误。
-->

---

# 反模式汇总

```ts
// ❌ 默认导入 lodash：聚合全部方法
import _ from 'lodash-es'

// ❌ 默认导入 ECharts：v5+ 仅 named export，会抛错
import echarts from 'echarts'

// ❌ 只 import 不 use：图表静默失效
import { BarChart } from 'echarts/charts'
// 忘记 echarts.use([BarChart])

// ❌ Element Plus 全量 + 按需混用：重复打包
app.use(ElementPlus) + ElementPlusResolver 同时配

// ❌ 用 importStyle:'css' 改 SCSS 变量：改不了
// ❌ 把 auto-imports.d.ts 加 .gitignore：CI/同事类型缺失
```

> 「只 import 不 use」「漏注册 renderer」是 ECharts 新手最常踩坑。

<!--
反模式一图收；尤其 ECharts 静默失效最坑。
-->

---

# 选型决策表

| 场景 | 推荐 | 原因 |
|------|------|------|
| Vue 3 + Element Plus | unplugin-auto-import + unplugin-vue-components | 自动按需 |
| 通用工具方法 | lodash-es 命名导入 | ESM 即 tree-shake |
| CJS 项目（无法切 ESM） | lodash/method 子路径 | 退而求其次 |
| ECharts 项目 | 五件套 + echarts.use | 精确控制范围 |
| 自家 UI 库 | 声明 sideEffects + ESM 导出 | 让用户能 tree-shake |

> 选型按场景，但底层都遵循「ESM + sideEffects + bundler」三前提。

<!--
选型决策把按需引入落到具体场景。
-->

---

# 总结与要点

按需引入 = **构建期剪枝**，落到三个工程动作

- **lodash**：用 `lodash-es` 命名导入，远离默认导入与 CJS lodash
- **Element Plus**：双插件（AutoImport + Components）+ ElementPlusResolver
- **ECharts**：五件套 + `echarts.use([...])`，渲染器必须注册

**核心前提**：ESM 静态结构 + `sideEffects` 字段 + bundler 支持（Vite / Rollup / Webpack 5+）

> 配套：d.ts 提交 git、`importStyle:'sass'` 改主题、`ComposeOption` 类型拼接。

<!--
总结回顾：按需引入是工程实践，遵循三前提 + 三场景。
-->
