---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Vue I18n
info: |
  Presentation Vue I18n for developers.

  Learn more at [https://vue-i18n.intlify.dev/](https://vue-i18n.intlify.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:vue class="text-7xl" />
  <span class="text-7xl">🌐</span>
</div>

<br/>

## Vue I18n：Vue 官方国际化插件

让 SPA 一行 t('key') 跨越语言、复数与本地化（基于 v11）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Vue I18n —— Vue 官方维护的国际化插件。

不仅是翻译，复数、日期、数字、链接消息一站式解决。
-->

---
transition: fade-out
---

# 什么是 Vue I18n？

为 Vue 3 应用提供运行时多语言切换的官方插件

<v-click>

- **翻译**：`t('key')` 根据 `locale` 查字典渲染文本
- **复数**：`'apple | apples | {count} apples'` 自动选支
- **日期 / 数字**：`d(date, 'long')` / `n(num, 'currency')` 走 `Intl` API
- **链接消息**：`@:another.key` 跨条目复用
- **作用域分离**：全局字典 vs 组件局部字典
- **SFC 内联**：`<i18n>` 块就近放翻译

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Vue I18n_](https://vue-i18n.intlify.dev/)

</div>

<style>
h1 {
  background-color: #35495E;
  background-image: linear-gradient(45deg, #35495E 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vue I18n 的核心能力可以一句话概括：把模板里的字符串都换成 t('key')，然后挂上多语言字典。

但它远不止翻译——复数、日期、数字这些"看似简单"的本地化点，自己写很容易出错；Vue I18n 把它们一并解决了。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与配置

一份最小可跑配置 ≤ 20 行

::left::

<v-click>

**安装（Vue 3 选 v11）**

```bash
pnpm add vue-i18n@11
```

| 版本   | Vue 兼容  | 状态                 |
| ------ | --------- | -------------------- |
| v11.x  | Vue 3.0+  | **当前主线**         |
| v10.x  | Vue 3.0+  | 仍可用，建议升 v11   |
| v9.x   | Vue 3.0+  | 停更                 |
| v8.x   | Vue 2.x   | 停更                 |

</v-click>

::right::

<v-click>

**入口配置**

```ts
import { createI18n } from "vue-i18n";

export const i18n = createI18n({
  legacy: false,         // 必须！启用 Composition API
  locale: "zh",
  fallbackLocale: "en",
  messages: {
    zh: { hello: "你好" },
    en: { hello: "hello" },
  },
});

createApp(App).use(i18n).mount("#app");
```

</v-click>

<style>
h1 {
  background-color: #35495E;
  background-image: linear-gradient(45deg, #35495E 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v11 是当前主线，v9/v10 已停更或建议升级。Vue 3 项目直接选 v11。

[click] 最小配置 = createI18n + app.use(i18n)。
注意 legacy: false 是 Composition API 的开关，必须显式写——v12 后这个选项默认就是 false。
-->

---
transition: fade-out
---

# createI18n 常用配置

按需开关，避免上线后控制台噪声

<v-click>

| 字段                  | 默认值    | 说明                                                    |
| --------------------- | --------- | ------------------------------------------------------- |
| `legacy`              | `true`    | **`false` 启用 Composition API**，强烈建议显式设       |
| `locale`              | `'en-US'` | 当前语言                                                |
| `fallbackLocale`      | —         | 兜底语言；支持字符串 / 数组 / fallback 链对象           |
| `messages`            | `{}`      | 嵌套字典 `{ locale: { key: 'value' } }`                 |
| `globalInjection`     | `true`    | 注入 `$t / $d / $n` 到模板                              |
| `missingWarn` / `fallbackWarn` | `true` | 缺失 / 回退告警；生产建议关                       |

</v-click>

<style>
h1 {
  background-color: #35495E;
  background-image: linear-gradient(45deg, #35495E 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] createI18n 配置项不多但每个都有用。

legacy: false 是开关，不传默认 true，useI18n 会抛错。
missingWarn / fallbackWarn 在开发阶段帮忙找漏翻，但上线后一定要关——否则每次回退都打 console。
-->

---
transition: fade-out
---

# 模板 vs Composition API

两种取值方式，新项目用 Composition

<v-click>

**模板里（`globalInjection: true` 时直接可用）**

```vue
<template>
  <p>{{ $t("hello") }}</p>
  <p>{{ $d(new Date(), "long") }}</p>
  <p>{{ $n(1234.5, "currency") }}</p>
</template>
```

</v-click>

<v-click>

**`<script setup>` 里（推荐）**

```vue
<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t, d, n, locale, availableLocales } = useI18n();
</script>

<template>
  <p>{{ t("hello") }}</p>
</template>
```

</v-click>

<style>
h1 {
  background-color: #35495E;
  background-image: linear-gradient(45deg, #35495E 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 模板里 $t / $d / $n 是全局注入的简写，零侵入。

[click] 但脚本里要用就得 useI18n() 解构。两套 API 并存是历史包袱——v12 会把 $t 这套也移除。
新项目直接走 Composition，避免后期再迁。
-->

---
transition: fade-out
---

# 切换语言：响应式的力量

`locale.value` 是 ref，赋值即重渲染

<v-click>

```ts
import { useI18n } from "vue-i18n";

const { locale } = useI18n({ useScope: "global" });

function switchTo(lang: string) {
  locale.value = lang;          // 所有用 t() 的组件自动重渲染
  localStorage.setItem("lang", lang);
}
```

</v-click>

<v-click>

**启动时恢复用户偏好**

```ts
const saved =
  localStorage.getItem("lang") ??
  navigator.language.split("-")[0];

i18n.global.locale.value = saved;
```

</v-click>

<div v-click text-xs class="mt-3">

::: warning
切语言改 `locale.value`，**不要**重建 `createI18n` 实例——会丢失全局字典 + 触发整树卸载。
:::

</div>

<style>
h1 {
  background-color: #35495E;
  background-image: linear-gradient(45deg, #35495E 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] locale 是响应式 ref，赋值会触发所有用到 t() 的组件重渲染——非常 Vue。

[click] 用户偏好持久化常用模式：localStorage 优先，回退到浏览器语言。

[click] 易错点：不要重建 createI18n。改 locale 就够了。
-->

---
transition: fade-out
---

# 消息语法（一）：插值

命名插值 vs 列表插值

<v-click>

**命名插值** —— 第二参传对象

```ts
// messages.zh
{ welcome: "你好 {name}！" }

t("welcome", { name: "Vue" })   // → 你好 Vue！
```

</v-click>

<v-click>

**列表插值** —— 第二参传数组

```ts
{ order: "第 {0} 件商品 {1} 元" }

t("order", [1, 99])             // → 第 1 件商品 99 元
```

</v-click>

<v-click>

**字面量** —— 单引号包裹保留字符

```ts
{ email: "{user}{'@'}{domain}" }

t("email", { user: "a", domain: "b.com" })   // → a@b.com
```

</v-click>

<style>
h1 {
  background-color: #35495E;
  background-image: linear-gradient(45deg, #35495E 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 命名插值是最常用的形式——可读性最好。

[click] 列表插值靠位置，调用时是数组——适合参数无意义命名的场景。

[click] 字面量是为了在消息里嵌 @ { } | 这些保留字符。
也可以用反斜杠转义：'\\@' / '\\{' / '\\}' / '\\|'。
-->

---
transition: fade-out
---

# 消息语法（二）：链接消息

`@:` 引用 + 修饰符

<v-click>

```ts
{
  the_world: "整个世界",
  hello: "你好，@:the_world！",         // → 你好，整个世界！
  greeting: "@.upper:hello 又见面了",   // → 你好，整个世界！ 又见面了
}
```

</v-click>

<v-click>

**修饰符**

| 修饰符             | 效果                       |
| ------------------ | -------------------------- |
| `@.lower:key`      | 引用结果全小写             |
| `@.upper:key`      | 引用结果全大写             |
| `@.capitalize:key` | 引用结果首字母大写         |

</v-click>

<style>
h1 {
  background-color: #35495E;
  background-image: linear-gradient(45deg, #35495E 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 链接消息让你不必在每个条目里重复"整个世界"这种名词。
@.upper 这类修饰符在英语里很有用——比如句首要大写。

[click] 三种修饰符覆盖了大小写常见需求，中文一般用不到。

实际项目里链接消息最有价值的场景：品牌名、产品名、通用短语跨条目复用。
-->

---
transition: fade-out
---

# 复数：`|` 分隔分支

按数值自动选支

<v-click>

```ts
{
  car: "汽车 | 多辆汽车",
  apple: "没有苹果 | 一个苹果 | {count} 个苹果",
}

t("car", 1)        // → 汽车
t("car", 2)        // → 多辆汽车
t("apple", 0)      // → 没有苹果
t("apple", 10)     // → 10 个苹果
```

</v-click>

<v-click>

**自定义规则（俄语 / 阿拉伯语等）**

```ts
createI18n({
  pluralizationRules: {
    ru: (n) => (n === 1 ? 1 : n > 1 && n < 5 ? 2 : 3),
  },
});
```

</v-click>

<div v-click text-xs class="mt-3">

::: warning
v11 已移除 Legacy 模式下的 `$tc` / `tc`，直接用 `t('key', count)` 即可。
:::

</div>

<style>
h1 {
  background-color: #35495E;
  background-image: linear-gradient(45deg, #35495E 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 复数是 i18n 的难点之一。Vue I18n 用 | 分隔，分支数 = 复数形态数。

count / n 是内置变量，对应传入的数值。

[click] 默认规则覆盖英语 / 中文这种 1-2 形态。
俄语、阿拉伯语等多形态语言要写自定义函数。

[click] 旧代码里的 $tc 在 v11 已经被砍掉，直接 t('key', count) 即可。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 日期与数字格式化

底层走 `Intl`，按命名预设调用

::left::

<v-click>

**配置 `datetimeFormats`**

```ts
createI18n({
  datetimeFormats: {
    zh: {
      short: { dateStyle: "short" },
      long: { dateStyle: "full", timeStyle: "short" },
    },
    en: {
      short: { dateStyle: "short" },
      long: { dateStyle: "full", timeStyle: "short" },
    },
  },
});
```

```vue
<p>{{ $d(new Date(), "long") }}</p>
```

</v-click>

::right::

<v-click>

**配置 `numberFormats`**

```ts
createI18n({
  numberFormats: {
    zh: {
      currency: { style: "currency", currency: "CNY" },
      percent: { style: "percent" },
    },
    en: {
      currency: { style: "currency", currency: "USD" },
      percent: { style: "percent" },
    },
  },
});
```

```vue
<p>{{ $n(1234.5, "currency") }}</p>
```

</v-click>

<style>
h1 {
  background-color: #35495E;
  background-image: linear-gradient(45deg, #35495E 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] datetime 走的是 Intl.DateTimeFormat，所有 Intl 选项都能用。

[click] number 同样走 Intl.NumberFormat。
currency / percent / decimal 都是标准 style 值。

预设的好处：业务代码只引用名字 'long' / 'currency'，本地化策略集中维护。
-->

---
transition: fade-out
---

# SFC 翻译块：i18n 块就近放翻译

需配合 @intlify/unplugin-vue-i18n

<v-click>

```vue
<template><p>{{ t("hello") }}</p></template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();   // 默认 local，能取到本块的 messages
</script>

<i18n>
{ "en": { "hello": "Hello" }, "zh": { "hello": "你好" } }
</i18n>
```

</v-click>

<v-click>

**Vite 配置**

```ts
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

export default defineConfig({
  plugins: [vue(), VueI18nPlugin({ include: ["src/locales/**"] })],
});
```

</v-click>

<style>
h1 {
  background-color: #35495E;
  background-image: linear-gradient(45deg, #35495E 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] <i18n> 块让组件和翻译放在同一文件，重构搬家更方便。
默认 lang="json"，也可以用 "yaml"。

[click] Vite 项目需要 @intlify/unplugin-vue-i18n。
include 指向 locales 目录可启用预编译，比 runtime 快很多。

常见组合：组件内简短翻译用 <i18n> 块，跨组件公共翻译走全局字典。
-->

---
transition: fade-out
---

# 懒加载语言包

首屏只下载当前语言

<v-click>

启动时 `messages: { zh }` 只装当前语言，其它语言按需异步注入：

```ts
export async function loadLocale(locale: string) {
  if (i18n.global.availableLocales.includes(locale)) {
    i18n.global.locale.value = locale;
    return;
  }
  const messages = await import(`./locales/${locale}.json`);
  i18n.global.setLocaleMessage(locale, messages.default);
  i18n.global.locale.value = locale;
}
```

</v-click>

<v-click>

**配合路由守卫**

```ts
router.beforeEach(async (to) => {
  const lang = to.params.lang as string;
  if (lang) await loadLocale(lang);
});
```

</v-click>

<style>
h1 {
  background-color: #35495E;
  background-image: linear-gradient(45deg, #35495E 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] setLocaleMessage 是懒加载的核心 API。
动态 import() 让 Vite / Webpack 自动拆 chunk，按需加载。

availableLocales 是已加载语言的清单，避免重复请求。

[click] 配合路由守卫是最常见的集成方式：URL 里带语言参数，进入路由前异步加载。
-->

---
transition: fade-out
---

# TypeScript 字面量补全

让 `t('a.b.c')` 写错就报错

<v-click>

```ts
// src/i18n/types.ts
import zh from "./locales/zh.json";

type MessageSchema = typeof zh;

declare module "vue-i18n" {
  export interface DefineLocaleMessage extends MessageSchema {}
}
```

</v-click>

<v-click>

```ts
const { t } = useI18n();

t("hello");              // ✅
t("nonexistent.key");    // ❌ TS 编译错误
```

</v-click>

<div v-click text-xs class="mt-3">

::: tip
多语言文件 key 不一致时，把 `MessageSchema` 改成 `typeof zh & typeof en` 取并集，或开 `unplugin-vue-i18n` 的 `strictMessage: true` 在构建时校验。
:::

</div>

<style>
h1 {
  background-color: #35495E;
  background-image: linear-gradient(45deg, #35495E 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 把 messages 的类型注入 vue-i18n 模块，t() 就有了字面量补全和编译检查。

[click] 重构语言文件时这个能救命——key 写错或漏翻 IDE 立刻告诉你。

[click] 多语言 key 不齐怎么办？取并集类型，或交给 strictMessage 在 build 阶段校验。
-->

---
transition: fade-out
---

# v11 迁移要点

向 v12 全 Composition API 收口

<v-click>

| 弃用 / 移除项             | 替代                            |
| ------------------------- | ------------------------------- |
| `legacy: true` Options API | `legacy: false` + `useI18n()`   |
| `v-t` 自定义指令           | 普通模板插值 `t('key')`         |
| `tc / $tc`（v11 已移除）   | `t('key', count)` 直接用        |
| `$i18n.t` 等实例 API       | 模板用 `$t`；脚本改 `useI18n`   |

</v-click>

<v-click>

**迁移辅助**

- ESLint 规则 `@intlify/vue-i18n/no-deprecated-v-t` 自动扫描残留
- v11 期间 Legacy 模式仍可用，给改造留一个版本周期
- v12 时间表见 [Vue I18n CHANGELOG](https://github.com/intlify/vue-i18n/blob/master/CHANGELOG.md)

</v-click>

<style>
h1 {
  background-color: #35495E;
  background-image: linear-gradient(45deg, #35495E 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v11 把 Vue 2 时代留下的 API 标记弃用，但还能用一个版本周期。
真正移除的是 Legacy 模式下的 tc / $tc。

[click] ESLint 规则可以帮你扫到所有要改的地方。
v12 没有明确发布日期，但 v11 期间就应该完成迁移，避免到时被推着走。
-->

---
layout: center
class: text-center
transition: fade-out
---

# 总结

Vue I18n 是 Vue 3 项目国际化的事实标准

- **Composition API + `legacy: false`** ⇒ 现代写法，v12 前完成迁移
- **`t / d / n` + 命名预设** ⇒ 翻译 + 日期 + 数字一站搞定
- **链接消息 + 复数 + 自定义规则** ⇒ 覆盖各语言复杂场景
- **`setLocaleMessage` + 动态 import** ⇒ 按需懒加载
- **`DefineLocaleMessage` 类型注入** ⇒ key 字面量补全

<div class="abs-br m-6 text-xl">
  <a href="https://vue-i18n.intlify.dev/" target="_blank" class="slidev-icon-btn">
    <logos:vue />
  </a>
  <a href="https://github.com/intlify/vue-i18n" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/frontend-framework/others/vue-i18n/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #35495E;
  background-image: linear-gradient(45deg, #35495E 10%, #41B883 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
全部精华浓缩到几条：
- legacy: false 现在就开，未来 v12 不痛
- t/d/n + 命名预设让本地化策略集中维护
- 链接消息 + 复数规则解决重复和多形态
- 懒加载 + 类型注入是大型项目的两个必备

Vue 3 项目几乎没有理由不用 Vue I18n。
-->

---
layout: end
---
