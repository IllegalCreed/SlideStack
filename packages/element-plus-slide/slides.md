---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Element Plus
info: |
  Presentation Element Plus for Vue 3 developers.

  Learn more at [https://element-plus.org/](https://element-plus.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🌱</span>
</div>

<br/>

## Element Plus — Vue 3 UI Toolkit

60+ components for admin & enterprise，由饿了么前端团队主导，Element 的官方继任者（当前主线 v2.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Element Plus —— Vue 3 时代国内最主流的后台 UI 组件库，由饿了么前端团队主导，
是经典 Element (Vue 2) 的官方继任者。

2020 年伴随 Vue 3 正式版立项，2022 年发布 2.0 稳定版，
当前主线 v2.x（npm 上从 2.0 持续迭代到 2.14+），完全适配 Vue 3 + TypeScript + Composition API。

核心卖点：60+ 高质量组件、原生 TypeScript 支持、SCSS + CSS Variables 双层主题系统、
按需引入 + 自动注册、内置暗色模式、66+ 语言 i18n、与 Vite / Nuxt 生态深度协同。
-->

---
transition: fade-out
---

# 什么是 Element Plus？

为 Vue 3 应用提供企业级中后台 UI 组件库的事实标准

<v-click>

- **60+ 组件**：Basic / Form / Data / Navigation / Feedback / Others 六大分组
- **TypeScript 优先**：全量类型声明，Volar 智能提示开箱即用
- **双层主题系统**：SCSS 变量编译期定制 + CSS 变量运行时切换
- **按需引入**：unplugin-vue-components + ElementPlusResolver 零配置
- **暗色模式**：内置 dark CSS vars + 与 VueUse `useDark` 无缝协作
- **国际化**：66+ 语言 locale + 自定义命名空间
- **SSR 友好**：ID / z-index 注入 + 官方 Nuxt 模块
- **生态成熟**：vue-element-admin / element-plus-admin / 数百模板可参考

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Element Plus Design_](https://element-plus.org/en-US/guide/design.html)

</div>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Element Plus 的核心定位非常清晰：「Vue 3 中后台 UI 组件库的事实标准」。

它不是新概念产品 —— 而是 Vue 2 时代 Element 的官方延续：
- 60+ 组件覆盖企业后台几乎所有场景，无需四处淘组件
- 完整 TypeScript 类型，Volar 跳转 / 补全开箱即用
- 主题系统分两层：SCSS 变量给打包时定制（一套主题一次编译），CSS 变量给运行时切换（用户实时改）
- 按需引入是一行 resolver 配置的事，不需要写一堆 import
- 暗色模式、国际化、SSR —— 企业级需求全部官方覆盖
- 生态层面 vue-element-admin / element-plus-admin 等模板让团队几天起步

下面会按「定位 → 安装 → 第一个组件 → 核心场景（Form/Table/反馈/弹层）→ 主题 → 暗色 → i18n → SSR → TS → 对比 → 踩坑」顺序讲透。
-->

---
transition: fade-out
---

# Element Plus 的定位与生态

为什么国内 Vue 3 后台几乎人手一份？

<v-click>

| 维度          | Element Plus       | Vuetify 3       | Naive UI        | Ant Design Vue   | PrimeVue          |
| ------------- | ------------------ | --------------- | --------------- | ---------------- | ----------------- |
| 框架绑定      | **Vue 3**          | Vue 3           | Vue 3           | Vue 3            | Vue 3 / React     |
| 设计语言      | 中后台通用         | Material 3      | 简约现代        | Ant Design       | 多 Preset 主题    |
| 组件数量      | **60+**            | 80+             | 70+             | 60+              | 80+               |
| TS 支持       | **原生**           | 原生            | **原生**        | 原生             | 原生              |
| 主题方案      | SCSS + CSS vars    | SCSS + Theme    | JS Theme Object | LESS + Token     | CSS vars + Theme  |
| 包体积        | 中（按需 tree-shake）| 偏大          | 小              | 偏大             | 中                |
| 国际化        | 66+ 语言           | 50+ 语言        | 30+ 语言        | 20+ 语言         | 50+ 语言          |
| 主导团队      | **饿了么**         | 社区 / Vuetify  | TuSimple 团队   | **蚂蚁集团**     | PrimeTek          |
| 中国生态      | **极强**           | 一般            | 强              | 强               | 一般              |
| 大版本风险    | 低（v2 长期）      | 中（v2→v3 重写）| 低              | 低               | 中                |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Vue 3 UI Comparisons_](https://element-plus.org/en-US/)

</div>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比五大 Vue 3 UI 库，Element Plus 的护城河是「中后台通用 + 中文生态」：

- 设计语言走「中后台通用」路线 —— 不像 Material 那么张扬，适合企业内部系统
- 60+ 组件刚好覆盖业务后台 95% 的需求，没有过度堆砌
- 主题系统两层并存 —— SCSS 给设计团队编译期定制色板，CSS 变量给暗色 / 多租户运行时切
- 中文生态最强 —— 文档、issue、Stack Overflow、掘金博客几乎清一色都有
- v2 自 2022 年发布至今没有重大 break change，企业选型最看重的「稳定性」

对比 Vuetify：偏 Material Design，更适合 C 端产品
对比 Naive UI：JS theme object 形式，定制更灵活但社区资源少
对比 Ant Design Vue：蚂蚁体系，设计风格更收敛但国内重度场景下两者差异不大
对比 PrimeVue：跨框架（Vue / React 共享），多主题预设但单看 Vue 生态深度差一些

选型逻辑：国内中后台几乎默认 Element Plus，C 端产品 / 移动端再看其它。
-->

---
transition: fade-out
---

# Element → Element Plus 演进史

为什么饿了么团队彻底重写？

<v-click>

| 版本             | 时间    | 关键事件                                                       |
| ---------------- | ------- | -------------------------------------------------------------- |
| Element 1.x      | 2016    | 基于 Vue 1.x，饿了么内部孵化对外开源                           |
| Element 2.x      | 2017    | 配 Vue 2，国内中后台事实标准，30+ 万 GitHub star               |
| **Element Plus** | 2020.10 | 基于 Vue 3 Composition + TypeScript 重写，独立仓库新生         |
| Element Plus 1.x | 2021    | RC 阶段，API 与 Element 大部分兼容                             |
| Element Plus 2.0 | 2022.1  | 正式版，按需引入 + Tree-shaking 完善                           |
| Element Plus 2.5 | 2023    | 暗色模式正式版，TypeScript 类型推导加强                        |
| Element Plus 2.10+| 2024+ | 持续迭代到 2.14+，Volar 完善、a11y 增强、SSR 优化              |

</v-click>

<v-click>

文档主线长期标记为「v2」，npm 包 `element-plus` 内部持续小版本迭代 —— 一份代码贯穿多年。

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Element Plus 不是「Element 3」，而是完全独立的项目 ——

Element 1.x / 2.x 基于 Vue 1 / 2，2020 年 Vue 3 发布后，
原班团队意识到 Vue 3 + Composition API + TypeScript 的能力需要重写才能充分发挥，
于是新立 Element Plus 项目，从零搭建组件库。

为什么不直接升级？因为：
- Vue 3 的 Composition API 让组件内部逻辑组织方式完全变了
- TypeScript 优先意味着所有 props / emit / slots 都要重新设计类型
- Tree-shaking 友好意味着所有组件要重写为独立 ES Module
- 强行升级会带来无数 break change，不如另起一个干净项目

2.0 正式版发布于 2022 年初，至今三年多没有大版本变动 ——
这种稳定性是企业选型最看重的。Vuetify 3 因为 v2→v3 重写一度引发社区分裂，
Element Plus 用「新仓库新名字」的策略巧妙避开了这个陷阱。

[click] 文档主线持续标记为「v2」，npm 包从 2.0 稳定迭代到 2.14+。
对比 Vuex → Pinia 的「换名字 + 不替换」策略，Element Plus 走的是「换名字 + 平滑替换」。
-->

---
transition: fade-out
---

# Element Plus 的核心理念

四条设计原则贯穿全部组件 API

<v-click>

**1. Consistency（一致性）**

视觉与交互对齐真实世界逻辑 —— 同样的图标、间距、色阶、动效在所有组件中统一表达。

</v-click>

<v-click>

**2. Feedback（反馈）**

每个操作都有即时反馈 —— 按钮 hover / active 态、表单校验提示、Loading 加载、Message 通知，从不让用户「盲操作」。

</v-click>

<v-click>

**3. Efficiency（效率）**

简化用户认知 —— 表单一屏可填、Table 一屏可览、表格分页 + 排序 + 筛选三件套零配置启用。

</v-click>

<v-click>

**4. Controllability（可控）**

不替用户做决定 —— 删除有确认、提交有 loading、危险操作有二次校验、长操作可中止。

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 一致性是 Element 系列的灵魂 —— 60+ 组件看起来像一个团队设计的，
而不是各家组件拼凑的。这一点其实极难做到，需要严格的设计 token + code review。

[click] 反馈机制无处不在 —— button 按下去会有 ripple-like 动效，input 聚焦会有边框高亮，
表单校验失败会有红色 + shake，长操作 Loading 全屏遮罩。
这些细节让用户感受到「应用在听我说话」。

[click] 效率体现在「常用场景零配置」—— ElTable 加一个 sortable，列就能排序；
加一个 ElPagination v-model，分页就工作。
这种「合理默认」让 80% 场景不需要查文档。

[click] 可控性是企业后台最关键的 ——
ElMessageBox 的 confirm 不让你直接关掉框（必须点确认或取消），
危险操作必须有二次确认，避免运营误删数据。
这些 UX 决策都是从「饿了么内部数百中后台血泪经验」沉淀下来的。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与初始化

5 分钟接入任意 Vue 3 项目

::left::

<v-click>

**安装**

```bash
pnpm add element-plus
# 或
npm install element-plus
```

| 版本   | Vue 兼容  | 状态                 |
| ------ | --------- | -------------------- |
| v2.x   | Vue 3.0+  | **当前主线**         |
| Element 2.x | Vue 2 | 仅维护安全补丁     |

</v-click>

::right::

<v-click>

**全量引入（入口配置）**

```ts
import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";

const app = createApp(App);
app.use(ElementPlus);
app.mount("#app");
```

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Element Plus 安装一行命令搞定 —— 没有可选 peer dependency。
v2.x 是 Vue 3 项目的当前主线。Vue 2 项目继续用 Element 2.x（不同包名）。

注意：Element Plus 与 Element 是不同的 npm 包，不能并存 ——
迁移项目需要替换所有 `element-ui` 为 `element-plus`。

[click] 全量引入是最简单的方式 —— 一次 use 注册全部组件，
适合「PoC / 小型项目 / 不在乎 bundle 大小」的场景。

代价：全部 60+ 组件都进 bundle，gzipped 后约 ~400 KB。
中大型项目建议按需引入（下一页）。

tsconfig 推荐加 `"types": ["element-plus/global"]` 让 Volar 自动识别全局组件。
-->

---
transition: fade-out
---

# 按需引入：unplugin 自动注册

中大型项目推荐配置，开箱即省 ~300 KB

<v-click>

**1. 安装 unplugin 依赖**

```bash
pnpm add -D unplugin-vue-components unplugin-auto-import
```

</v-click>

<v-click>

**2. 配置 vite.config.ts**

```ts
import { defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  plugins: [
    AutoImport({ resolvers: [ElementPlusResolver()] }),
    Components({ resolvers: [ElementPlusResolver()] }),
  ],
});
```

</v-click>

<v-click>

> 💡 **效果**：模板里直接写 `<el-button>`，自动 import；脚本里直接调 `ElMessage.success()`，自动 import。

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 按需引入的核心是两个 unplugin：
- `unplugin-vue-components` 扫描模板，自动 import 用到的组件
- `unplugin-auto-import` 扫描脚本，自动 import 用到的 API（ElMessage、ElLoading）

[click] vite.config.ts 配 ElementPlusResolver 是关键 ——
它告诉 unplugin「遇到 `<el-xxx>` 就去 `element-plus` 包里找对应组件」，
路径解析 + 样式按需加载（一并引入对应的 SCSS / CSS）全自动。

[click] 实际开发体验：
模板里写 `<el-button>I am button</el-button>` —— 不用手动 import ElButton
脚本里写 `ElMessage.success('done')` —— 不用手动 import ElMessage

bundle 大小从全量 ~400 KB 降到按需 ~50-150 KB（取决于实际用了多少组件）。
这是 Tree-shaking 友好设计的胜利。
-->

---
transition: fade-out
---

# 第一个组件：ElButton

熟悉的味道，原生 TypeScript 加持

<v-click>

```vue
<script setup lang="ts">
import { ref } from "vue";

const loading = ref(false);

async function handleSubmit() {
  loading.value = true;
  try {
    await fetch("/api/submit", { method: "POST" });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <el-button type="primary" :loading="loading" @click="handleSubmit">
    提交订单
  </el-button>
  <el-button type="success">成功</el-button>
  <el-button type="warning" plain>警告</el-button>
  <el-button type="danger" round>危险</el-button>
  <el-button :icon="Edit" circle />
</template>
```

</v-click>

<v-click>

| Prop      | 取值                                   | 说明           |
| --------- | -------------------------------------- | -------------- |
| `type`    | primary / success / warning / danger / info | 颜色语义 |
| `size`    | large / default / small                | 尺寸           |
| `plain` `round` `circle` | boolean              | 形态变体       |
| `loading` `disabled`     | boolean              | 状态           |

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] ElButton 是 Element Plus 最简单的组件 —— type / size / plain / loading 几条属性就覆盖了 90% 场景。

注意 loading 是一个 boolean prop，可以直接绑响应式 ref ——
提交期间按钮自动禁用 + 显示加载小圈，无需手动控制 disabled。

icon 是 ComponentInstance 类型，从 `@element-plus/icons-vue` 包导入即可。

[click] type 的五个语义值对应组件库的颜色系统：
- primary：主操作（提交、保存）
- success：积极反馈（已完成）
- warning：提示（注意事项）
- danger：危险操作（删除、解绑）
- info：中性信息

这套 type 体系几乎所有反馈组件（Alert / Tag / Message）都共享，认知成本极低。

形态变体（plain 朴素、round 圆角、circle 圆形）满足不同 UI 场景，
组合 size 三档（large / default / small）足以覆盖几乎所有需求。
-->

---
transition: fade-out
---

# 60+ 组件分组速览

按使用场景组织，记住分组即可快速定位

<v-click>

| 分组           | 代表组件                                                     |
| -------------- | ------------------------------------------------------------ |
| **Basic**      | Button / Icon / Link / Layout / Container / Border / Color / Typography |
| **Form**       | Form / Input / Select / DatePicker / Switch / Slider / Rate / Upload |
| **Data**       | Table / Tree / Pagination / Tag / Badge / Avatar / Image / Calendar |
| **Navigation** | Menu / Tabs / Breadcrumb / Steps / Backtop / Affix / Dropdown |
| **Feedback**   | Alert / Message / MessageBox / Notification / Loading / Progress |
| **Overlay**    | Dialog / Drawer / Popover / Popconfirm / Tooltip / ConfigProvider |
| **Others**     | Card / Carousel / Collapse / Empty / Result / Descriptions / Skeleton |

</v-click>

<v-click text-xs class="mt-4">

> 💡 **设计原则**：高频组件（Button / Input / Table）API 极简，低频组件（Cascader / Transfer）功能完整。

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 60+ 组件听起来多，但按分组记忆很容易上手 ——

Basic：原子布局元素，几乎每个页面都用
Form：表单交互全套，企业后台的核心战场
Data：数据展示，Table 是其中绝对的「重头戏」
Navigation：导航骨架，配合 vue-router 用
Feedback：反馈通知，提升用户体验的关键
Overlay：弹层 / 抽屉 / 浮层，复杂交互的载体
Others：辅助展示，按需取用

[click] 设计原则上有一个有意思的现象：
高频组件 API 极简（Button 5 个核心 prop 就够用），
低频组件 API 完整（Transfer 几十个 prop / slot 覆盖各种企业场景）。

这种「按使用频次分配复杂度」是 Element 系列长期沉淀的产物。
-->

---
transition: fade-out
---

# ElForm 深度（一）：基础结构

prop / model / rules 三要素

<v-click>

```vue
<script setup lang="ts">
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";

const formRef = ref<FormInstance>();
const form = reactive({
  name: "",
  email: "",
  age: 18,
});

const rules = reactive<FormRules<typeof form>>({
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: "blur" },
  ],
  age: [{ type: "number", min: 1, max: 120, message: "1-120", trigger: "blur" }],
});
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>
  </el-form>
</template>
```

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] ElForm 是 Element Plus 最重要的组件，没有之一 ——
企业后台 80% 的页面都是「表单 + 表格」组合。

三要素：
- model：表单数据对象（必须是 reactive）
- rules：校验规则（required / type / min / max 等）
- prop：每个 ElFormItem 的字段名（连接 model + rules）

`FormRules<typeof form>` 这个泛型让 TS 能推导出每个字段的类型，
拼写错 prop 名字会立刻报错。

trigger 决定何时触发校验 —— blur（失焦）/ change（改值）/ submit（提交）。
最佳实践：blur + 提交时 validate 全表，避免输入过程中频繁红框。
-->

---
transition: fade-out
---

# ElForm 深度（二）：校验 + 提交

validate / resetFields / 自定义校验器

<v-click>

**提交 + 重置**

```ts
async function handleSubmit() {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    // 校验通过 → 调接口
    await api.createUser(form);
    ElMessage.success("创建成功");
  } catch (errors) {
    // 校验失败 → errors 是 { field: ValidationError[] }
    console.warn("校验未通过", errors);
  }
}

function handleReset() {
  formRef.value?.resetFields();   // 重置值 + 清除红框
}
```

</v-click>

<v-click>

**自定义校验器（异步可用）**

```ts
const checkUsername = async (rule: any, value: string, callback: any) => {
  if (!value) return callback(new Error("用户名必填"));
  const exists = await api.checkUserName(value);
  exists ? callback(new Error("用户名已被占用")) : callback();
};

const rules = reactive<FormRules<typeof form>>({
  name: [{ validator: checkUsername, trigger: "blur" }],
});
```

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] validate() 返回 Promise，校验通过 resolve 一个 boolean，失败 reject 一个 errors 对象。
推荐用 try/catch 写法（async/await），比 callback 风格清晰。

resetFields() 会重置所有字段到「初始值」（reactive 创建时的值），并清除所有校验红框。
注意：它「不」会清空 input —— 它只是恢复 model 字段，input 通过 v-model 自动同步。

[click] 自定义校验器适合「需要异步调接口」的场景 ——
比如检查用户名是否被占用、手机号是否已注册。

validator 函数签名：(rule, value, callback) => void
- value：当前字段的值
- callback：调用以告知校验结果。callback() 通过，callback(new Error('xxx')) 失败

底层是 async-validator 库（阿里出品），rules 还支持 pattern（正则）、enum、whitespace 等丰富类型。
-->

---
transition: fade-out
---

# ElTable 深度：声明式列定义

prop + label + sortable 三件套

<v-click>

```vue
<script setup lang="ts">
import { ref, computed } from "vue";

interface User {
  id: number;
  name: string;
  age: number;
  createdAt: string;
}

const allData = ref<User[]>([
  { id: 1, name: "Tom", age: 28, createdAt: "2024-05-01" },
  { id: 2, name: "Jerry", age: 32, createdAt: "2024-04-15" },
]);

const selection = ref<User[]>([]);
const handleSelect = (rows: User[]) => (selection.value = rows);
</script>

<template>
  <el-table :data="allData" stripe border @selection-change="handleSelect">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="id" label="ID" width="80" sortable />
    <el-table-column prop="name" label="姓名" sortable />
    <el-table-column prop="age" label="年龄" sortable />
    <el-table-column prop="createdAt" label="创建时间" sortable />
    <el-table-column label="操作" width="160">
      <template #default="{ row }">
        <el-button size="small" @click="edit(row)">编辑</el-button>
        <el-button size="small" type="danger" @click="del(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
```

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] ElTable 是 Element 系列最复杂、最强大的组件 ——
50+ props / 30+ events / 20+ slots，但 90% 场景只用最核心的几个。

核心思路：
- `<el-table>` 接 data 数组
- 每个 `<el-table-column>` 声明一列（prop 字段名 + label 表头文字）
- type="selection" 自动渲染多选框列
- type="index" 自动渲染序号列
- 加 sortable 属性，列头出现排序按钮

操作列用「默认 slot + scope 解构」拿到当前行数据 —— `<template #default="{ row }">`
然后渲染按钮 + 绑定 row 作为参数调函数。

stripe（斑马纹）+ border（边框）一行启用，无需 CSS。
-->

---
transition: fade-out
---

# ElTable 进阶：分页 + 排序 + 筛选

服务端分页 vs 客户端分页

<v-click>

**客户端分页（小数据集）**

```ts
const currentPage = ref(1);
const pageSize = ref(10);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return allData.value.slice(start, start + pageSize.value);
});
```

```vue
<el-pagination
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :page-sizes="[10, 20, 50, 100]"
  :total="allData.length"
  layout="total, sizes, prev, pager, next, jumper"
/>
```

</v-click>

<v-click>

**服务端分页（大数据集）**

```ts
async function load() {
  const { list, total } = await api.queryUsers({
    page: currentPage.value,
    pageSize: pageSize.value,
    sort: sortProp.value,
    order: sortOrder.value,
  });
  tableData.value = list;
  totalCount.value = total;
}

watch([currentPage, pageSize, sortProp, sortOrder], load, { immediate: true });
```

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 客户端分页适合「数据量小 + 一次取回」的场景 ——
比如系统配置项列表、字典管理等。

实现极其简单：currentPage / pageSize 用 ref 维护，
computed 算出当前页切片，绑给 `<el-table :data>`。

ElPagination 支持 v-model:current-page 双向绑定，
还支持 layout 配置显示哪些控件（total 总数、sizes 每页条数选择器、prev 上一页等）。

[click] 服务端分页适合「数据量大 + 需要后端处理」的场景 ——
比如订单列表、日志查询等。

模式：把 currentPage / pageSize / sortProp / sortOrder / filters 作为参数发请求，
后端返回 { list, total }，前端只渲染当前页。

watch 监听这几个状态变化触发重新查询 —— 用户点下一页 / 改排序，自动重新加载。

排序由 ElTable 的 @sort-change 事件提供，filters 由 column filter 触发 @filter-change。
-->

---
transition: fade-out
---

# 反馈组件三件套

ElMessage / ElMessageBox / ElNotification

<v-click>

**ElMessage（轻提示，顶部短暂显示）**

```ts
import { ElMessage } from "element-plus";

ElMessage.success("保存成功");
ElMessage.warning("当前网络不稳定");
ElMessage.error({ message: "请求失败", duration: 5000 });
```

</v-click>

<v-click>

**ElMessageBox（模态对话框，强制确认）**

```ts
import { ElMessageBox } from "element-plus";

await ElMessageBox.confirm("删除后不可恢复，确认删除？", "危险操作", {
  type: "warning",
  confirmButtonText: "删除",
  cancelButtonText: "取消",
});
await api.delete(id);
ElMessage.success("已删除");
```

</v-click>

<v-click>

**ElNotification（通知，右上角浮层）**

```ts
import { ElNotification } from "element-plus";

ElNotification.info({
  title: "系统消息",
  message: "您有 3 条新待办",
  position: "top-right",
  duration: 0,
});
```

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] ElMessage 是「最轻量」的反馈 —— 顶部居中、3 秒后自动消失、不阻断用户操作。
适合「保存成功 / 删除完成 / 网络异常」这种瞬时反馈。
四种 type：success / warning / error / info，颜色与图标自动匹配。

[click] ElMessageBox 是「最重」的反馈 —— 模态遮罩 + 必须点确认 / 取消才能继续。
返回 Promise，confirm resolve、cancel reject —— 用 try/catch 处理两种结果。

危险操作必用！删除、批量操作、不可逆变更 —— 没有 confirm 等于挖坑等用户踩。

[click] ElNotification 介于两者之间 —— 右上角浮层、信息更丰富（带标题 + 内容）、可手动关。
适合「待办提醒 / 系统消息 / 长文本通知」这种非紧急但需要用户注意的场景。

duration: 0 表示「不自动关闭，必须用户点 X 才消失」—— 重要通知必用。

设计原则：紧急度从低到高 → Message → Notification → MessageBox，按场景选。
-->

---
transition: fade-out
---

# 弹层三剑客

ElDialog / ElDrawer / ElPopover

<v-click>

**ElDialog（模态对话框）**

```vue
<el-dialog v-model="dialogVisible" title="编辑用户" width="500" :before-close="onClose">
  <el-form :model="form">…</el-form>
  <template #footer>
    <el-button @click="dialogVisible = false">取消</el-button>
    <el-button type="primary" @click="handleSubmit">保存</el-button>
  </template>
</el-dialog>
```

</v-click>

<v-click>

**ElDrawer（侧边抽屉）**

```vue
<el-drawer v-model="drawerVisible" title="筛选条件" direction="rtl" size="400">
  <el-form :model="filters" label-width="80px">…</el-form>
</el-drawer>
```

</v-click>

<v-click>

**ElPopover（轻量浮层，hover/click 触发）**

```vue
<el-popover placement="top" trigger="hover" width="200">
  <template #reference><el-button>悬停查看</el-button></template>
  <p>这是一段提示内容</p>
</el-popover>
```

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] ElDialog 是企业后台最常用的弹层 —— 编辑表单、详情查看、批量操作选项都靠它。

关键点：
- v-model 控制显示 / 隐藏
- title 标题
- width 宽度（可数字或字符串）
- before-close 拦截关闭（可异步检查未保存）
- #footer slot 自定义底部按钮
- #default slot（默认）放主体内容

[click] ElDrawer 是「从屏幕边缘滑入」的弹层 —— 适合长内容 / 筛选条件 / 帮助文档。
direction 四个方向：ltr（左→右）/ rtl（右→左）/ ttb（上→下）/ btt（下→上）。
企业后台常用 rtl（从右滑入）放筛选 / 编辑表单，不打断主视图。

[click] ElPopover 是「最轻」的浮层 —— hover 或 click 触发，跟随触发元素。
trigger 三种：hover（默认，悬停显示）/ click（点击切换）/ focus（聚焦）。
placement 12 个方向：top / top-start / top-end / bottom / left / right ……

ElPopconfirm 是 ElPopover + 确认按钮的预制 —— 比 MessageBox 轻量，适合「删除单条记录」这种小操作。
-->

---
transition: fade-out
---

# 主题定制（一）：SCSS 变量

编译期定制色板，全站统一品牌

<v-click>

**1. 创建主题入口 `styles/element/index.scss`**

```scss
@forward "element-plus/theme-chalk/src/common/var.scss" with (
  $colors: (
    "primary": (
      "base": #ff6b35,
    ),
    "success": (
      "base": #28a745,
    ),
  ),
  $border-radius: (
    "base": 6px,
  )
);
```

</v-click>

<v-click>

**2. 在 vite.config.ts 注入到所有 SCSS**

```ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      },
    },
  },
});
```

</v-click>

<v-click>

> 💡 **要点**：`@forward` 必须在引入 Element Plus 之前生效；按需引入时 Resolver 需配 `importStyle: 'sass'`。

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] SCSS 变量主题是 Element Plus 最经典的定制方式 ——
在打包时用 `@forward ... with` 覆盖 Element 内置的 SCSS 变量，编译出一套全新色板的样式。

$colors 是核心 —— 包含 primary / success / warning / danger / info 五大语义色，
每个色支持 base / light-3 / light-5 / light-7 / light-8 / light-9 / dark-2 七档深浅。

$border-radius / $font-size / $disabled-opacity 等几十个其它变量都能覆盖 —— 查 var.scss 源文件即可。

[click] additionalData 把主题入口注入到「所有 SCSS 文件的开头」——
确保任何用到 Element 变量的样式（包括 Element 自身的）都先读到你的覆盖值。

[click] 按需引入时有个坑 —— ElementPlusResolver 默认引 css，会绕过 SCSS 覆盖。
必须配 `ElementPlusResolver({ importStyle: 'sass' })` 强制走 SCSS 编译链路。

这套机制适合「一套主题一次编译」的场景 —— 公司品牌色一旦确定就长期使用。
如果需要「运行时切换主题」（暗色 / 多租户），下一页讲 CSS 变量方案。
-->

---
transition: fade-out
---

# 主题定制（二）：CSS 变量

运行时动态切换，无需重新编译

<v-click>

**全局覆盖**

```css
:root {
  --el-color-primary: #ff6b35;
  --el-color-success: #28a745;
  --el-border-radius-base: 6px;
}
```

</v-click>

<v-click>

**JS 动态修改（运行时切换）**

```ts
function applyTheme(primary: string) {
  document.documentElement.style.setProperty("--el-color-primary", primary);
}

applyTheme("#ff6b35");   // 立即生效，无需刷新
```

</v-click>

<v-click>

**组件级覆盖（局部）**

```vue
<el-tag style="--el-tag-bg-color: #ff6b35; --el-tag-text-color: white">
  橙色标签
</el-tag>
```

</v-click>

<v-click>

> 💡 **SCSS vs CSS 选型**：固定品牌色用 SCSS（编译期最优）；多主题切换 / 暗色模式用 CSS Variables（运行时灵活）。

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] CSS 变量是 Element Plus 的「第二层」主题机制 ——
所有组件内部都通过 var(--el-xxx) 读取颜色 / 间距 / 边框等设计 token，
覆盖这些变量就能立刻生效。

`:root` 选择器是全局根，覆盖在这里全站生效。
`html.dark` 选择器是暗色模式根，覆盖在这里只暗色模式生效。

变量命名规则：`--el-{category}-{name}-{variant}`
比如 --el-color-primary、--el-color-primary-light-3、--el-color-danger。

[click] JS 动态修改是「多主题切换」的核心 ——
读用户偏好（localStorage / API）→ 调 setProperty → 全站颜色立即切换。
不需要刷新、不需要重载样式表、不需要任何额外打包。

[click] 组件级覆盖适合「单点定制」—— 比如某个 Tag 想要橙色，
直接 inline style 覆盖该实例的 CSS var，不影响其它实例。
这是 BEM 时代「需要 !important 强权覆盖」的痛点的优雅解决方案。

[click] 选型逻辑：
- 一套主题长期使用 → SCSS（编译期 token 最优、bundle 最小）
- 暗色 / 多租户 / 用户自定义 → CSS Variables（运行时切换）
- 混用最佳实践：SCSS 定义基线 token，CSS Variables 覆盖暗色 / 用户偏好。
-->

---
transition: fade-out
---

# 暗色模式：内置 + VueUse 协同

一行 import + 一个 useDark 搞定

<v-click>

**1. 引入暗色样式**

```ts
// main.ts
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
```

</v-click>

<v-click>

**2. 用 VueUse 的 useDark 切换**

```vue
<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();          // 自动同步 html.dark class + localStorage
const toggleDark = useToggle(isDark);
</script>

<template>
  <el-switch
    v-model="isDark"
    inline-prompt
    active-text="🌙"
    inactive-text="☀️"
    @change="toggleDark"
  />
</template>
```

</v-click>

<v-click>

**3. 自定义暗色变量（可选）**

```css
html.dark {
  --el-bg-color: #1a1a1a;
  --el-bg-color-overlay: #2a2a2a;
  --el-text-color-primary: #e0e0e0;
}
```

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Element Plus 内置一套完整的暗色 CSS 变量（`dark/css-vars.css`），
只要 html 上有 `dark` class，所有组件自动切换为暗色配色。

注意顺序：先 import 浅色样式（index.css）作为基线，再 import dark/css-vars.css 提供覆盖。
不能反过来，否则 dark 变量被浅色覆盖。

[click] VueUse 的 `useDark` 是事实标准的暗色切换工具 ——
- 自动读 prefers-color-scheme: dark 跟随系统
- 自动写 localStorage 持久化用户选择
- 自动同步 html.dark class

配合 ElSwitch 一个开关组件就能让用户切换。
inline-prompt 让文字直接显示在开关里，节省空间。

[click] 默认 dark 配色已经够用，但企业可能要调成自己品牌的暗色 ——
在 `html.dark` 选择器下覆盖 --el-bg-color / --el-text-color 等几个核心变量即可。

完整的 dark 变量列表见 element-plus/theme-chalk/src/dark/var.scss。
-->

---
transition: fade-out
---

# 国际化：ElConfigProvider

切换语言 = 切换 locale 对象

<v-click>

**全局配置（app.use 方式）**

```ts
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

app.use(ElementPlus, { locale: zhCn });
```

</v-click>

<v-click>

**动态切换（ElConfigProvider 包裹）**

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";

const lang = ref<"zh" | "en">("zh");
const locale = computed(() => (lang.value === "zh" ? zhCn : en));
</script>

<template>
  <el-config-provider :locale="locale">
    <el-button @click="lang = lang === 'zh' ? 'en' : 'zh'">
      切换语言 / Switch
    </el-button>
    <el-date-picker v-model="date" type="date" placeholder="选日期" />
  </el-config-provider>
</template>
```

</v-click>

<v-click>

> 💡 Element Plus 提供 66+ 语言，与 vue-i18n 协同时把语言切换状态共享给 ConfigProvider 即可。

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 全局配置适合「单语言项目」—— 一次设定，全站组件文字（确定/取消、分页按钮、DatePicker 月份等）按 locale 显示。

zh-cn 是简体中文，文件路径 `element-plus/es/locale/lang/zh-cn`。
其它 65+ 语言（en、ja、ko、fr、de、ar、ru ……）按相同路径取。

[click] ElConfigProvider 是「动态切换」的核心 ——
把 :locale 绑成响应式 ref / computed，切换值时所有子组件自动重新读取 locale。

它还能传 :size（默认尺寸）/ :zIndex（弹层基线）/ :button（按钮全局配置）/ :namespace（CSS 前缀），
是 Element Plus 的「全局配置中心」。

[click] 与 vue-i18n 协同的标准模式：
- vue-i18n 管业务文案
- Element Plus locale 管组件内置文案
- 两者共享同一个 locale state（写在 Pinia 或 useStorage），切换时同步更新

DatePicker 还需要 dayjs locale —— `import 'dayjs/locale/zh-cn'` + `dayjs.locale('zh-cn')`，
否则月份名仍是英文。
-->

---
transition: fade-out
---

# SSR 与 Nuxt 集成

注入 ID + Z-Index 解决水合错误

<v-click>

**手动配 SSR 注入**

```ts
import { createSSRApp } from "vue";
import { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from "element-plus";

export function createApp() {
  const app = createSSRApp(App);

  app.provide(ID_INJECTION_KEY, { prefix: 1024, current: 0 });
  app.provide(ZINDEX_INJECTION_KEY, { current: 0 });

  return { app };
}
```

</v-click>

<v-click>

**Nuxt 项目：用官方模块（推荐）**

```bash
pnpm add -D @element-plus/nuxt
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@element-plus/nuxt"],
  elementPlus: {
    importStyle: "scss",
    themes: ["dark"],
  },
});
```

</v-click>

<v-click>

> 💡 ID / Z-Index 注入解决「服务端与客户端生成的 id 不一致导致水合失败」的经典问题。

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Element Plus 内部为了避免 id 冲突，会生成自增 id（比如 `el-id-1`、`el-id-2`）。
SSR 场景下服务端 / 客户端各自启动一份内部计数器，
两边生成的 id 顺序可能不一致，导致 Vue 水合时 mismatch 报错。

解决方案：在入口 provide `ID_INJECTION_KEY` 的「初始计数器对象」，
服务端和客户端共享同一个起点，id 序列就完全一致了。

z-index 同理 —— Tooltip / Dialog 等组件叠层时会自增 z-index，
SSR 需要 provide ZINDEX_INJECTION_KEY 让两端起点对齐。

Teleport 类组件（Dialog / Drawer / Tooltip / Dropdown / Select / DatePicker）
还需要包 `<ClientOnly>` 或用 `renderTeleports()` 把内容注入到 body。

[click] Nuxt 项目用官方模块（@element-plus/nuxt）一键搞定 ——
自动注入 SSR keys、自动按需引入、自动注册组件 + 自动加载 dark 样式。

importStyle: 'scss' 启用 SCSS 主题定制
themes: ['dark'] 同时加载暗色样式

[click] SSR 是 Element Plus 「企业级」标签的关键 ——
官方亲自维护 Nuxt 模块，意味着 Nuxt + Element Plus 是受官方支持的组合，
踩坑后能直接 issue 反馈，不像某些组件库对 SSR 半支持半放弃。
-->

---
transition: fade-out
---

# TypeScript 实战：组件 ref 类型

获取实例调方法 / 解构 props

<v-click>

**获取组件实例（调 validate / resetFields）**

```ts
import type { FormInstance, TableInstance, InputInstance } from "element-plus";

const formRef = ref<FormInstance>();
const tableRef = ref<TableInstance>();
const inputRef = ref<InputInstance>();

onMounted(() => {
  inputRef.value?.focus();                    // input 自动聚焦
  tableRef.value?.toggleAllSelection();       // 表格全选
});

async function submit() {
  await formRef.value?.validate();
}
```

</v-click>

<v-click>

**扩展 RouteMeta / 全局 ConfigProvider**

```ts
// types/element-plus.d.ts
declare module "element-plus" {
  interface ConfigProviderContext {
    customNamespace?: string;
  }
}
```

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Element Plus 为每个组件导出对应的 Instance 类型 ——
FormInstance、TableInstance、InputInstance、SelectInstance、DatePickerInstance ……

用法：`ref<FormInstance>()` —— 标注 ref 的类型，IDE 立刻知道实例上有哪些方法 / 属性。
然后通过 .value? 安全访问（template ref 初始 undefined）。

常用实例方法：
- FormInstance：validate / resetFields / clearValidate / validateField
- TableInstance：toggleAllSelection / clearSelection / setCurrentRow / sort
- InputInstance：focus / blur / select
- SelectInstance：focus / blur
- ScrollbarInstance：setScrollTop / setScrollLeft / scrollTo

[click] 模块扩展（module augmentation）适合「往 Element Plus 类型上加自己的字段」——
比如自定义命名空间、自己的全局配置项。

写一个 .d.ts 文件 `declare module 'element-plus'`，IDE 就能识别扩展类型。

这是 TS 项目的「优雅扩展点」—— 不污染源码、不依赖 monkey patch、纯类型层面的协议。
-->

---
transition: fade-out
---

# 生态与配套库

围绕 Element Plus 的官方 / 社区工具链

<v-click>

| 库                          | 作用                                     |
| --------------------------- | ---------------------------------------- |
| **@element-plus/icons-vue** | 250+ 官方 SVG 图标组件                   |
| **@element-plus/nuxt**      | Nuxt 3 官方集成模块                      |
| **unplugin-element-plus**   | Vite / Webpack / Rollup 按需样式插件     |
| **unplugin-vue-components** | 组件自动注册（配 ElementPlusResolver）   |
| **unplugin-auto-import**    | API 自动 import（ElMessage / ElLoading） |
| **element-plus-admin**      | 完整后台模板（社区项目）                 |
| **vue-pure-admin**          | 现代化后台模板（vbenjs 团队）            |
| **element-plus-x**          | AI 大模型 Web 端组件库（聊天 / 流式）    |

</v-click>

<v-click text-xs class="mt-4">

> 💡 中后台模板基本都基于 Element Plus + Vue Router + Pinia + Vite 的「黄金组合」。

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Element Plus 的生态分三层 ——

官方核心：
- icons-vue：250+ Material 风格图标，按 SVG 组件方式引入（tree-shake 友好）
- @element-plus/nuxt：Nuxt 一键集成（SSR / 按需 / 主题一站式）
- unplugin-element-plus：纯样式按需加载（不含组件注册）

按需引入工具链：
- unplugin-vue-components：组件自动注册（vite/webpack 通用）
- unplugin-auto-import：API 自动 import（避免到处写 import { ElMessage }）
这两个是「Element Plus 现代项目标配」。

社区中后台模板：
- element-plus-admin / vue-pure-admin / vbenjs/vben-admin：开箱即用的企业后台框架
- 几乎都包含「登录 / 权限 / 菜单 / 表格 / 表单 / 图表 / 主题切换」全套功能

[click] 中后台技术栈标配：
Vue 3 + Element Plus + Vue Router + Pinia + Vite + TypeScript + UnoCSS（或 Tailwind）+ ECharts

这套组合在国内中后台领域几乎是「不假思索的默认选择」，
团队上手成本极低，社区资源海量，遇到任何问题 Google 即可。
-->

---
transition: fade-out
---

# 常见踩坑（一）：按需引入相关

主题不生效 / 自动 import 不工作

<v-click>

**坑 1：主题 SCSS 不生效**

按需引入时 ElementPlusResolver 默认走 CSS，绕过 SCSS 编译，主题覆盖无效。

```ts
Components({
  resolvers: [ElementPlusResolver({ importStyle: "sass" })],   // ✅ 必须指定 sass
});
```

</v-click>

<v-click>

**坑 2：ElMessage 没有自动 import**

`unplugin-vue-components` 只扫描模板 `<el-xxx>`，不会处理脚本里的 `ElMessage.success()`。

```ts
// vite.config.ts
AutoImport({
  resolvers: [ElementPlusResolver()],
  imports: ["vue", "vue-router"],     // 顺便把 Vue API 也自动 import
});
```

</v-click>

<v-click>

**坑 3：自定义命名空间样式丢失**

改了 ConfigProvider 的 namespace 后，组件 class 变成 `my-button` 但 CSS 还是 `el-button`。

```scss
@forward "element-plus/theme-chalk/src/mixins/config.scss" with (
  $namespace: "my"
);
```

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 主题不生效是按需引入最高频的坑 ——

按需引入时 ElementPlusResolver 默认从 `element-plus/es/components/xxx/style/index` 引入 css，
直接绕过 SCSS 编译链路，你的 @forward 覆盖永远不生效。

解决：`importStyle: 'sass'` —— 让 resolver 改从 `style/css.mjs` 走 SCSS 路径，
你的 additionalData 注入的覆盖才能起作用。

这个坑 Element Plus 官方文档藏得比较深，新手一头雾水 ——「为什么我改了 $primary-color 没反应？」
答案 99% 是 importStyle 没配。

[click] ElMessage 不能自动 import 是「unplugin-vue-components」名字误导的结果 ——
它只管模板里的 `<el-xxx>` 组件，对脚本里的函数式 API 无能为力。

解决：再装一个 `unplugin-auto-import`，配 ElementPlusResolver，
脚本里直接写 ElMessage.success('xxx') 就能自动 import 了。

imports: ['vue', 'vue-router'] 顺便把 ref / computed / useRouter 也自动注入，
省掉 90% 的 Vue 项目里重复的 `import { ref } from 'vue'`。

[click] ConfigProvider 的 namespace 是「多个 Element Plus 实例共存」的高级特性 ——
比如微前端场景，主应用用默认 el-，子应用用 my-，避免 CSS 冲突。

但只改 ConfigProvider 是不够的 —— CSS 是编译期生成的，需要在 SCSS 层面也改命名空间。
两边一起改才能完整切换。
-->

---
transition: fade-out
---

# 常见踩坑（二）：使用层面

Dialog 嵌套 Form 校验 / Table 列宽不一致

<v-click>

**坑 4：Dialog 关闭后 Form 状态残留**

`v-model="visible"` 控制显示后，关闭再打开，input 里还有旧值。

```vue
<el-dialog v-model="visible" @closed="handleClosed">…</el-dialog>

<script setup>
function handleClosed() {
  formRef.value?.resetFields();   // 关闭后重置表单
}
</script>
```

</v-click>

<v-click>

**坑 5：Table 列宽不一致 / 表头错位**

容器宽度变化时 Table 不重新计算列宽，导致表头和 body 错位。

```ts
import { nextTick } from "vue";

watch(sidebarCollapsed, async () => {
  await nextTick();
  tableRef.value?.doLayout();    // 强制重新计算列宽
});
```

</v-click>

<v-click>

**坑 6：MessageBox 在 setup 顶层调用**

ElMessageBox.confirm() 在 setup 顶层执行会立刻弹窗，应该放事件回调。

```ts
// ❌ setup 顶层
const ok = await ElMessageBox.confirm("…");

// ✅ 事件回调
async function handleDelete() {
  await ElMessageBox.confirm("…");
}
```

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Dialog 状态残留是企业后台最高频的 UX bug ——

用户打开编辑弹窗 → 改了几个字段 → 取消关闭 → 再次打开 → 还是旧值，新人一脸懵。

原因：v-model 只控制显示 / 隐藏，不重置内部状态。
form 是 reactive 对象，不会因为 dialog 关闭而清零。

解决：监听 @closed 事件（Dialog 完全关闭后触发），手动 resetFields()。
或者用 v-if 替代 v-model：dialog 关闭后销毁整个组件，下次打开重新挂载。

[click] Table 列宽错位是「外部容器变化」时的经典 bug ——

侧边栏折叠 / 浏览器 resize / 父容器宽度变化时，
Table 不会自动监听容器宽度变化（因为这会带来 ResizeObserver 性能开销）。

解决：手动调 tableRef.value.doLayout()，强制重新计算列宽。
现代项目可以用 VueUse 的 useResizeObserver 自动触发。

也可以给 Table 加 :style="{ width: '100%' }" + 容器加 overflow: hidden 缓解。

[click] MessageBox.confirm 在 setup 顶层调用是「想当然」的坑 ——

setup 函数会在组件挂载前同步执行，写在顶层意味着「页面一打开就弹框」。
而 confirm 返回 Promise，setup 不能正确 await（除非用 setup 函数 + suspense）。

正确做法：把 confirm 调用放进事件回调（点击按钮 / 路由守卫等），用户行为驱动弹框。

类似的坑：useRouter / useRoute 在 setup 外（比如 onMounted 之外的钩子）调用会拿不到实例 ——
Element Plus 的弹层 API 同理，需要在「响应式上下文」内调用。
-->

---
transition: fade-out
---

# 最佳实践清单

来自数百企业后台的沉淀

<v-click>

**项目初始化**

- ✅ 必用按需引入 + AutoImport，bundle 减半
- ✅ 主题 SCSS 走 `importStyle: 'sass'`，别走 css 路径
- ✅ tsconfig 加 `"types": ["element-plus/global"]`，让 Volar 识别全局组件

</v-click>

<v-click>

**表单 + 表格**

- ✅ Form 配 `FormRules<typeof form>` 泛型，类型推导原生
- ✅ Dialog 关闭后 `resetFields()`，避免状态残留
- ✅ Table 服务端分页统一用 watch（page / size / sort / filter）触发 load
- ✅ 大表格用 `lazy` + `default-sort` 减少首屏渲染

</v-click>

<v-click>

**主题与暗色**

- ✅ SCSS 定义品牌色基线，CSS Variables 提供暗色 / 用户偏好
- ✅ VueUse `useDark` 一行实现暗色切换，不用造轮子
- ✅ ConfigProvider 全局配 size / locale / button，减少重复 prop

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 项目初始化阶段的几个关键决定：

按需引入 + AutoImport 几乎是「必选」—— 不然 bundle 大、import 多、维护成本高。
importStyle: 'sass' 是主题定制的前提，配错就再也改不了样式。
types 配置让 Volar 正确识别 `<el-button>` 等全局组件，不然 IDE 全是红线警告。

[click] 表单 + 表格是企业后台 70% 的工作量 ——

FormRules 泛型让校验规则与 form 对象强类型关联，prop 拼写错立刻报错。
Dialog 状态重置必须做（前面踩坑章节有讲）。
Table 服务端分页一定要把所有查询参数 watch 起来统一触发，否则状态错乱。
大表格（千行以上）必用 lazy 渲染，否则首屏卡顿。

[click] 主题层面的分工：
- SCSS：编译期 token，品牌色 / 圆角 / 字体等长期稳定的设计基线
- CSS Variables：运行时 override，暗色 / 多租户 / 用户自定义颜色

VueUse 的 useDark 是事实标准，自带 localStorage + 系统跟随，省心。

ConfigProvider 是 Element Plus 的「全局配置中心」—— size、locale、button、zIndex、namespace 都能在这里统一设置，
避免每个组件都重复传 prop。
-->

---
transition: fade-out
---

# 评价

成熟稳定 / 中文最强 / 中后台首选，但设计语言偏「中庸」

<v-clicks>

**优点**

- 60+ 组件覆盖企业后台几乎所有场景，开箱即用
- 中文社区资源极其丰富，文档 / issue / 教程 / 模板海量
- 主题系统双层（SCSS + CSS Variables）满足编译期 + 运行时双重需求
- TypeScript 原生支持，Volar 体验一流
- v2 自 2022 年发布至今稳定，企业选型放心
- Nuxt / SSR 官方支持，全栈场景可用
- 国际化 66+ 语言，超过大多数同类库

**缺点**

- 设计语言偏中后台通用风，C 端产品颜值不够
- 默认主题国内外审美差异（国内觉得稳妥，国外觉得过时）
- 部分高级组件（Tree-Select / Cascader）API 偏复杂
- Tree-shaking 后 bundle 仍偏大（依赖 lodash / dayjs / async-validator）
- 移动端适配较弱，不如 vant 等专门移动库

</v-clicks>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Element Plus 的优点很集中 —— 「企业中后台开发首选」这一句就总结了 ——

60+ 组件覆盖度可能是 Vue 3 生态最完整的，新需求几乎不需要找额外组件库。
中文生态强到「随便搜一个问题都有解答」，团队上手成本极低。
主题系统的双层设计在 Vue 3 组件库中也是少见的精巧 —— 编译期 + 运行时各取所需。
TypeScript 支持原生而非「后期补丁」，Volar 跳转 / 补全无缝衔接。

[click] 缺点也很明确：

设计语言走「中后台通用风」—— 对 B 端用户（运营 / 客服）刚好够用，
但对 C 端用户（消费者 App）显得过时。这是 Element 系列的历史包袱，不是技术问题。

Tree-Select / Cascader / Transfer 这几个高级组件的 API 真的很复杂 ——
prop 数量超过 50 个、slot 超过 10 个，新人需要花时间读文档。

bundle 大小是个老问题 —— 即使 tree-shake 后，依赖的 lodash / dayjs / async-validator 几个大库也会带进来，
gzipped 后比 Naive UI 等轻量库大一些。

移动端适配是明显短板 —— Element Plus 几乎所有组件都为桌面端优化，
移动端项目应该用 Vant / NutUI 等专门库。

选型逻辑：B 端中后台首选 Element Plus，C 端 / 移动端另选库。
-->

---
transition: fade-out
---

# 学习路径

从入门到企业级实战的 4 个阶段

<v-click>

**第 1 周：核心组件熟练**

- 通读官方文档 Basics + Form + Data 三大分组
- 跟着官方 Playground 改例子（最快入门方式）
- 写一个 CRUD 页面（Table + Form + Dialog 三件套）

</v-click>

<v-click>

**第 2 周：主题 + 交互精进**

- 跑通 SCSS 主题定制 + CSS Variables 切换
- 实现暗色模式 + 用户偏好持久化
- 实现国际化（中英切换）

</v-click>

<v-click>

**第 3-4 周：企业级整合**

- 接入 Vue Router + Pinia + Vite + UnoCSS
- 实现登录 / 权限 / 菜单 / 面包屑全套
- 接 ECharts / VxeTable 等专业图表 / 表格组件

</v-click>

<v-click>

**长期：源码 + 贡献**

- 阅读 Form / Table 等核心组件源码
- 参与 issue / PR，理解组件库设计取舍

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 第一周打基础 ——
官方文档结构清晰，Basics → Form → Data 三个分组覆盖 80% 日常组件。
Playground 是最快的学习方式 —— 改例子比看例子快 10 倍。
完成一个 CRUD 页面就算入门了 —— Table 展示数据、Form 编辑、Dialog 承载、Message 反馈。

[click] 第二周进阶 ——
主题系统是 Element Plus 的「软实力」分水岭 ——
能完整跑通 SCSS 主题覆盖的开发者，已经超过 80% 的同行。
暗色 + i18n 是企业项目的标配，必须熟练。

[click] 第三到四周企业级整合 ——
单独的 Element Plus 只是「组件库」，要变成「企业后台」需要拼接：
- 路由系统：Vue Router 4
- 状态管理：Pinia
- 构建工具：Vite
- 原子 CSS：UnoCSS（或 Tailwind）
- 表单校验：vee-validate（深度场景）或 Element 内置 rules（简单场景）
- 图表：ECharts / Apache Antv

把这些拼通就是一个完整的「企业级前端项目」。

[click] 长期投入推荐看源码 ——
Element Plus 的 Form / Table 源码是「组件库设计的优秀教材」，
读完会对「响应式 + slot + 跨组件通信」这些 Vue 3 高级模式有更深理解。
有时间还可以参与 issue / PR，理解「为什么 API 设计成这样」的取舍。
-->

---
transition: fade-out
---

# 延伸学习资源

官方 + 社区精选

<v-click>

**官方资源**

- 📖 [官方文档](https://element-plus.org/) —— 中英双语，质量第一档
- 🎮 [Playground](https://element-plus.run/) —— 在线编辑测试
- 💻 [GitHub](https://github.com/element-plus/element-plus) —— 25K+ star
- 📦 [Awesome List](https://github.com/element-plus/awesome-element-plus) —— 生态聚合

</v-click>

<v-click>

**企业后台模板**

- [vue-pure-admin](https://github.com/pure-admin/vue-pure-admin) —— 现代化方案
- [vue-vben-admin](https://github.com/vbenjs/vue-vben-admin) —— 高级方案
- [element-plus-admin](https://github.com/kailong321200875/vue-element-plus-admin) —— 经典方案

</v-click>

<v-click>

**配套技术栈**

- Vue Router 4 + Pinia + Vite + UnoCSS = 黄金组合
- VueUse + dayjs + ECharts = 实用三件套
- vee-validate / unplugin-vue-router = 进阶选配

</v-click>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 官方资源是第一手信息 ——

官方文档中文版质量极高，几乎与英文版同步更新，组件示例可以直接复制使用。
Playground 是「踩坑前先试试」的最佳工具，每个组件都能在线编辑代码 + 立即看到效果。
GitHub 仓库的 issue 区是「问题解答的金矿」—— 你的问题 90% 已经有人提过。
Awesome List 是社区资源聚合 —— 主题、插件、模板、教程全都汇总在一处。

[click] 企业后台模板选型建议：

vue-pure-admin：tailwind + Element Plus + TypeScript，代码质量高，社区活跃
vue-vben-admin：功能最完整的企业级模板，包含表单设计器 / 大屏可视化等高级功能
element-plus-admin：相对轻量，适合从零搭建中小项目

新项目推荐从 vue-pure-admin 起步 —— 现代化程度最高、代码量适中、上手友好。

[click] 配套技术栈：

「Vue Router + Pinia + Vite + UnoCSS」是 2024-2026 年 Vue 3 中后台的事实标准。
VueUse 提供 200+ 实用 composable，与 Element Plus 完美协作。
dayjs 是 Element Plus 内置的日期库，业务代码也直接用它最自然。
ECharts 是图表事实标准，配合 Element Plus 表格 / Card 做数据大屏极佳。

vee-validate 适合「复杂表单」场景（动态字段 / 跨字段联动 / 分步表单）。
unplugin-vue-router 适合「文件约定路由」场景（类似 Nuxt 自动路由）。
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 🌱

Element Plus — Vue 3 中后台 UI 的事实标准

<div class="mt-8 text-lg">

**核心心智**

- 按需引入 + AutoImport 是现代项目标配
- SCSS 编译期 token，CSS Variables 运行时 override
- ConfigProvider 是全局配置中心，size / locale / button 统一管
- TypeScript 实例类型导出齐全，FormInstance / TableInstance 不要忘
- Dialog 关闭后 resetFields，避免状态残留

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://element-plus.org/" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/element-plus/element-plus" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://element-plus.run/" target="_blank" class="slidev-icon-btn">
    <carbon:play /> Playground
  </a>
</div>

<style>
h1 {
  background-color: #409EFF;
  background-image: linear-gradient(45deg, #409EFF 10%, #67C23A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：Element Plus = Vue 3 中后台 UI 组件库的事实标准 —— 60+ 组件 + 双层主题 + 原生 TS + 中文最强生态。

核心心智五条：
1. 按需引入是现代项目标配 —— unplugin-vue-components + unplugin-auto-import + ElementPlusResolver
2. 主题分两层 —— SCSS 给编译期 token、CSS Variables 给运行时 override
3. ConfigProvider 是全局配置中心 —— 别每个组件都重复传 size / locale
4. TypeScript 实例类型记得用 —— FormInstance / TableInstance 让 IDE 智能补全
5. Dialog 关闭后 resetFields —— 90% 企业后台都有这个 UX 残留 bug

下一步建议：跟着官方文档 Form + Table 两大分组实战一个 CRUD 页面，
把 ElForm 校验 + ElTable 服务端分页 + ElDialog 编辑流程全套打通 ——
那之后再看大型中后台代码，就会有「一切尽在掌握」的感觉。

延伸学习：
- 主题 + 暗色 + i18n 三大「软实力」一定要花时间练
- 接 Vue Router + Pinia + Vite + UnoCSS 形成完整技术栈
- 阅读 vue-pure-admin / vue-vben-admin 模板代码，理解「企业项目应该长什么样」

感谢观看！
-->
