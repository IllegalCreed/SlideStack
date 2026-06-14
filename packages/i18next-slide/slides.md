---
theme: seriph
background: https://cover.sli.dev
title: i18next — JavaScript 国际化框架
info: |
  Presentation i18next — the framework-agnostic i18n engine (init / t / plurals / namespaces).

  Learn more at [https://www.i18next.com/](https://www.i18next.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🌍</span>
</div>

<br/>

## i18next — JavaScript 国际化框架

框架无关的 i18n 核心引擎：`init()` 初始化、`t()` 取词、resources 资源、命名空间、插值、复数、回退。浏览器 / Node 通吃，react-i18next、i18next-vue 都建立在它之上

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/i18next/i18next" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 i18next，一个用 JavaScript 写、给 JavaScript 用的国际化框架。官方定位就是这句：an internationalization-framework written in and for JavaScript。

最关键的一点：它的核心是框架无关的。浏览器、Node、移动端、桌面端任何 JS 环境都能跑，正因如此，react-i18next、i18next-vue、Angular 的绑定都建立在它之上。注意 vue-i18n 是 Vue 生态另一套独立方案，不是 i18next 的绑定，今天只在对比时一笔带过。

主线：为什么需要 → 三层资源结构 → init 与 t → 插值 → 复数 → 上下文 → 嵌套 → 格式化 → 命名空间 → 回退 → 语言检测 → 懒加载 → 多实例与类型 → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 为什么用 i18next

<v-clicks>

- 多语言文案散落代码里，难维护
- 复数规则各语言不同，手写易错
- 文案要插值、要按性别/状态变措辞
- 大体量翻译想按需加载、控制首屏

</v-clicks>

<div v-click class="mt-6">

i18next 的回应：

- 集中式 `resources` + `t()` 取词
- 复数对齐 `Intl.PluralRules`
- 插值 / 上下文 / 嵌套一应俱全
- 命名空间 + backend 懒加载

</div>

<!--
为什么需要一个国际化框架？几个老痛点。

第一，多语言文案散落在各个组件里，硬编码，难以维护和复用。第二，复数规则每种语言都不一样，英语单复数两形，阿拉伯语六形，手写规则极易出错。第三，文案不只是静态字符串，要插入变量，还要按性别、状态等上下文给出不同措辞。第四，大型应用翻译体量大，想按页面、按模块懒加载，控制首屏体积。

i18next 针对性地回应：用集中式的 resources 加 t 函数取词；复数直接对齐浏览器的 Intl.PluralRules；插值、上下文、嵌套这些能力都内置；命名空间配合 backend 插件做懒加载。这就是今天的主线。
-->

---

# 三层资源结构

```js
const resources = {
  en: {                              // ① 语言
    translation: {                   // ② 命名空间（默认）
      greeting: "Hello {{name}}",    // ③ key: 值
      nav: { home: "Home" },         // 可嵌套，t('nav.home')
    },
  },
  de: { translation: { greeting: "Hallo {{name}}" } },
};
```

<v-clicks>

- 最外层**语言码** → 第二层**命名空间** → 第三层 **key/value**
- 默认命名空间是 `translation`
- 嵌套对象用点号访问（`keySeparator` 默认 `.`）

</v-clicks>

<!--
先看数据长什么样。resources 是三层结构。

最外层是语言码，比如 en、de。第二层是命名空间，默认就叫 translation。第三层才是真正的 key 和值。值里可以带插值占位，比如 Hello 花括号 name 花括号。

key 还能嵌套成对象，比如 nav 下面有 home，取词时用点号 t 括号 nav 点 home，因为 keySeparator 默认是点号。

记住这个三层心智：语言、命名空间、键值。后面所有功能都围绕它展开。默认命名空间叫 translation，这是个高频考点。
-->

---

# init 与 t

```js
import i18next from "i18next";

await i18next.init({          // 返回 Promise，异步！
  lng: "en",
  fallbackLng: "en",
  resources,
});

i18next.t("greeting", { name: "Jed" }); // -> "Hello Jed"
```

<v-clicks>

- `init()` 是**异步**的（`initAsync` 默认 true），返回 Promise
- 用 backend 懒加载时，**先 await 再用 t**
- `t(key, options?)` 是核心取词函数

</v-clicks>

<!--
初始化入口是 i18next.init，接收一个配置对象：lng 当前语言，fallbackLng 回退语言，resources 翻译数据。

特别强调：init 是异步的，initAsync 默认 true，它返回一个 Promise。内联 resources 时可能很快就绪，但统一按异步处理最稳——尤其后面接 backend 从服务器懒加载翻译时，没等加载完就调 t，可能拿到没翻译的结果。所以惯用法是 await init，或者在回调、在 initialized 事件里再用 t。

取词就用 t，核心函数。t 括号 greeting 逗号一个对象，里面 name 是 Jed，渲染出 Hello Jed。t 接收 key 和一个 options 对象，插值、复数、上下文、命名空间都通过这个 options 传。
-->

---

# 插值：默认 \{\{var\}\} + 默认转义

```js
i18next.t("greeting", { name: "Jed" });        // {{name}} 双大括号
i18next.t("msg", { name: "<b>x</b>" });          // -> &lt;b&gt;x&lt;/b&gt;
```

<v-clicks>

- 默认语法**双大括号** `{{var}}`
- **默认 HTML 转义**（`escapeValue: true`）缓解 XSS
- 关闭：`{{- var}}` 或传 `interpolation: { escapeValue: false }`

</v-clicks>

<div v-click class="mt-3 text-sm">

> ⚠️ 关闭转义后插入用户输入，**必须自己先转义**，否则 XSS。

</div>

<!--
插值是把变量嵌进文案。默认语法是双大括号，花括号花括号 name。

这里有个非常重要的安全默认：插值的值默认会被 HTML 转义，escapeValue 默认是 true，目的是缓解 XSS 攻击。比如你传一段 b 标签进去，输出会变成转义后的实体字符，不会被当成真的 HTML 渲染。

确实需要原样输出 HTML 怎么办？两种方式：文案里用连字符前缀，花括号短横 name；或者该次调用传 interpolation escapeValue false。

但记住底下这条警告：一旦关闭转义，i18next 就不替你转义了，如果这里插的是用户输入，你必须自己先转义，否则就把 XSS 的口子开回来了。
-->

---

# 复数：对齐 Intl.PluralRules

```json
{
  "item_one": "{{count}} item",
  "item_other": "{{count}} items"
}
```

```js
i18next.t("item", { count: 1 });   // -> "1 item"
i18next.t("item", { count: 5 });   // -> "5 items"
```

<v-clicks>

- v21（JSON v4）起复数走 **`Intl.PluralRules`**
- 后缀：`_zero/_one/_two/_few/_many/_other`
- **必须传 `count`**，不传不回退到裸 key

</v-clicks>

<!--
复数是国际化最容易踩坑的地方，i18next 处理得很优雅。

从 v21、也就是 JSON format v4 起，复数判定对齐到浏览器的 Intl.PluralRules，由它决定某个 count 在当前语言落到哪个类别。英语通常只用 _one 和 _other 两个后缀，你在资源里写 item_one 和 item_other，调用时传 count，i18next 自动选。

完整的后缀集是 _zero、_one、_two、_few、_many、_other，但具体语言用哪几个由 Intl 规则决定，比如阿拉伯语会用满六个。

一个关键考点：必须传 count 才触发复数选择，而且不传 count 不会回退到没有后缀的裸 key。另外 _zero 还能给 count 为 0 时一个更自然的措辞。
-->

---

# 上下文：按场景选措辞

```json
{
  "friend": "A friend",
  "friend_male": "A boyfriend",
  "friend_female": "A girlfriend"
}
```

```js
i18next.t("friend", { context: "male" }); // -> "A boyfriend"
```

<v-clicks>

- context 在 key 后拼 `_<context>` 后缀
- 找不到带后缀的，回落到裸 `friend`
- 与复数叠加：`key_<context>_<pluralForm>`

</v-clicks>

<!--
上下文 context，用于同一个 key 在不同语境下给不同措辞，最典型是按性别。

你传 context male，i18next 就在 key 后面拼下划线 male 这个后缀，去找 friend_male。找不到带后缀的，再回落到裸 key friend。contextSeparator 默认是下划线。

context 还能和复数叠加，顺序是 key 下划线 context 下划线 复数类别，比如 friend_male_one、friend_male_other。调用时同时传 context male 和 count 100，命中 friend_male_other。注意顺序是 context 在前、复数在后，这是个细节考点。

要分清：context 是用来选 key 的，不是普通插值，它拼的是后缀。
-->

---

# 嵌套：一条文案引用另一条

```json
{
  "nesting1": "1 $t(nesting2)",
  "nesting2": "2 $t(nesting3)",
  "nesting3": "3"
}
```

```js
i18next.t("nesting1"); // -> "1 2 3"
```

<v-clicks>

- 语法 `$t(key)`，可跨命名空间 `$t(common:key)`
- 可传 options（合法 JSON）：`$t(items, {"count": 1})`
- ⚠️ 默认 `skipOnVariables: true`，含变量的嵌套默认跳过

</v-clicks>

<!--
嵌套 nesting，是在一条翻译里引用另一条翻译，用美元符 t 括号 key 这个语法。

比如 nesting1 的值是 1 空格 美元 t 括号 nesting2，渲染时会把 nesting2 的翻译嵌进来，层层展开得到 1 2 3。对应配置 nestingPrefix 是美元 t 括号，nestingSuffix 是右括号。还能跨命名空间引用，美元 t 括号 common 冒号 key。

进阶用法是给被嵌套的 key 传参数，比如传 count 做复数，参数部分必须是合法 JSON。

但这里有个 v21 起的安全坑：interpolation 的 skipOnVariables 默认是 true，含有插值变量的嵌套默认会被跳过，防止用户输入混进嵌套的 JSON 造成注入。需要这种用法时得显式把它设成 false，并自己注意 XSS。
-->

---

# 格式化：内置走 Intl

```js
const en = {
  num: "Some {{val, number}}",          // Intl.NumberFormat
  cur: "Cost {{val, currency(USD)}}",   // Intl.NumberFormat
  date: "On {{val, datetime}}",         // Intl.DateTimeFormat
};

i18next.t("num", { val: 1000 }); // -> "Some 1,000"
```

| 格式器 | 底层 API | 格式器 | 底层 API |
| --- | --- | --- | --- |
| `number` | NumberFormat | `relativetime` | RelativeTimeFormat |
| `currency` | NumberFormat | `list` | ListFormat |
| `datetime` | DateTimeFormat | | |

<!--
格式化，把数字、货币、日期按当前语言本地化。文案语法是花括号 val 逗号 格式器名，逗号是 formatSeparator。

比如 val 逗号 number，底层用 Intl.NumberFormat，1000 渲染成带千位分隔的 1 逗号 000。val 逗号 currency 括号 USD 用 NumberFormat 的货币模式。val 逗号 datetime 用 Intl.DateTimeFormat。

下面这张表是五个内置格式器和它们的底层 Intl API：number 和 currency 都走 NumberFormat，datetime 走 DateTimeFormat，relativetime 走 RelativeTimeFormat，list 走 ListFormat。全部基于 Intl，不依赖 day.js 或 moment 这些第三方库。

传选项可以写在文案里、放 options 根级、或者用 formatParams 按变量精确传，这是最细粒度的方式。自定义格式器用 i18next services formatter add 注册。
-->

---

# 命名空间：拆分翻译

```js
await i18next.init({
  ns: ["translation", "common"],
  defaultNS: "translation",
  resources: {
    en: {
      translation: { title: "Home" },
      common: { save: "Save" },
    },
  },
});

i18next.t("save", { ns: "common" }); // 或 t('common:save')
```

<v-clicks>

- 按领域组织：公共 / 校验 / 各业务模块
- 支持**按命名空间懒加载**，控制首屏体积

</v-clicks>

<!--
命名空间 namespace，把翻译拆成多份而不是堆在一个大文件里。

在 init 里用 ns 数组声明要加载哪些命名空间，defaultNS 指定默认用哪个。resources 里每个语言下面就可以有 translation、common 等多个命名空间。

跨命名空间取 key 有两种等价写法：t 括号 save 逗号 对象 ns common，或者前缀写法 t 括号 common 冒号 save，冒号是 nsSeparator。官方更推荐 ns 选项，TS 下类型更友好。

为什么要拆？两个收益：一是按领域组织文案，公共文案、校验消息、各业务模块各一份，可读可维护;二是支持按命名空间懒加载，单页应用只加载当前页需要的那份，控制首屏体积。注意命名空间是组织和加载手段,不会自动翻译,也不会显著加快查表。
-->

---

# 回退：语言 vs 命名空间

```js
await i18next.init({
  lng: "de-CH",
  fallbackLng: "en",      // 语言回退：de-CH → de → en
  defaultNS: "app",
  fallbackNS: "common",   // 命名空间回退：app → common
});
```

<v-clicks>

- `fallbackLng`：缺 key 换**语言**找（自动 `de-CH`→`de`）
- `fallbackNS`：缺 key 换**命名空间**找
- 缺一切且无 defaultValue → **返回 key 本身**

</v-clicks>

<!--
回退机制有两个维度，别混。

fallbackLng 是语言回退：目标语言缺某个 key 时，换到别的语言找。而且语言码会自动从具体回退到宽泛，de-CH 先回退到 de，再到 fallbackLng en。fallbackLng 还支持对象形式按语言定制各自的回退链，加一个 default 兜底。

fallbackNS 是命名空间回退：当前命名空间缺 key 时，换到别的命名空间找，比如 defaultNS 是 app，缺了去 fallbackNS common 找。

一个语言一个命名空间，维度完全不同。

最后兜底：如果目标语言、回退语言、命名空间都找不到，又没给 defaultValue，t 默认返回 key 本身这个字符串，而不是 undefined 或空串，保证 t 永远返回字符串。
-->

---

# 语言检测插件

```js
import LanguageDetector from "i18next-browser-languagedetector";

await i18next.use(LanguageDetector).init({
  fallbackLng: "en",
  detection: {
    order: ["cookie", "localStorage", "navigator"],
    caches: ["localStorage"],
  },
});
```

<v-clicks>

- `i18next-browser-languagedetector` 检测用户语言
- `detection.order` 配检测优先级，`caches` 配缓存位置
- ⚠️ 用检测器时**别再硬写 `lng`**（lng 覆盖检测）

</v-clicks>

<!--
浏览器里怎么自动识别用户语言？用官方插件 i18next-browser-languagedetector，通过 use 接入。

detection.order 配置检测的优先级顺序，比如先看 cookie、再看 localStorage、最后看 navigator.language。detection.caches 配置把检测结果缓存到哪，比如 localStorage，下次直接用。

这里有个高频考点：插件通过 use 方法接入，可以链式串联多个 use 最后 init。每类插件靠自身的 type 字段声明角色，语言检测器的 type 是 languageDetector。

还有个坑：用检测器时不要再硬写 lng。因为官方规定 lng 会覆盖语言检测，你一旦写了 lng，检测器就形同虚设了。
-->

---

# 懒加载：HTTP backend

```js
import HttpBackend from "i18next-http-backend";

await i18next.use(HttpBackend).init({
  fallbackLng: "en",
  ns: ["translation", "common"],
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json",
  },
});
```

<v-clicks>

- `loadPath` 里 `{{lng}}`/`{{ns}}` 替换成实际值去请求
- Node 文件系统用 `i18next-fs-backend`
- 内联 `resources` 与 backend **不互为 fallback**

</v-clicks>

<!--
不想把翻译全打进 bundle，想运行时按需从服务器拉，用 i18next-http-backend，同样 use 接入，它的 type 是 backend。

核心配置是 backend.loadPath，路径模板里的花括号 lng 和花括号 ns，会被替换成实际的语言和命名空间去请求对应的 JSON 文件。比如切到德语加载 common 命名空间，就请求 locales 斜杠 de 斜杠 common 点 json。

Node 服务端从文件系统读用 i18next-fs-backend；想用 import 动态导入用 i18next-resources-to-backend。

一个容易错的点：如果你同时给了内联 resources 和 backend，官方明确二者不会互为 fallback，不会自动拿内联当兜底。要实现链式回退，得用 i18next-chained-backend 把多个来源串起来。
-->

---

# 切语言与事件

```js
await i18next.changeLanguage("de"); // 返回 Promise

i18next.on("languageChanged", (lng) => {
  // 刷新自定义 UI
});
```

<v-clicks>

- `changeLanguage(lng)` 切语言、按需加载、返回 Promise
- 完成后触发 `languageChanged` 事件
- 其它事件：`initialized` / `loaded` / `missingKey`

</v-clicks>

<div v-click class="mt-2 text-sm">

> 用 `on` / `off`，不是 DOM 的 `addEventListener`。

</div>

<!--
运行时切换语言，调用 changeLanguage，传目标语言码。它会切换当前语言、按需加载所需翻译，并返回一个 Promise。

切换完成后会触发 languageChanged 事件，你监听它来刷新自定义 UI。绑定层比如 react-i18next，正是靠监听这个事件来自动重渲染组件的。

i18next 是个事件发射器，常用事件有：initialized 初始化完成、loaded 资源加载完成、languageChanged 语言切换完成、missingKey 命中缺失 key。

注意监听用 on，取消用 off，这是 i18next 自己的事件接口，不是 DOM 的 addEventListener，写错了不生效。直接给 language 属性赋值也不会触发加载和事件，切语言必须用 changeLanguage。
-->

---

# 进阶：多实例与类型

```js
// SSR：每请求一个独立实例，避免状态串味
const inst = i18next.createInstance();
await inst.init({ lng: req.language, fallbackLng: "en", resources });
```

```ts
// TypeScript：模块增强让 t() 有 key 补全
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: { translation: typeof en };
  }
}
```

<!--
两个进阶能力，实战很重要。

第一，多实例。在并发的服务端，比如 SSR，每个请求语言不同，如果共用全局单例并 changeLanguage，并发下语言状态会相互串味。正确做法是用 createInstance 创建全新的独立实例，每请求一个，互不共享状态。另外还有 cloneInstance 创建克隆实例，默认共享 store、plugins 和初始配置。配合 getFixedT 还能生成固定语言和命名空间的 t，省去每次传参。

第二，TypeScript 类型安全。用模块增强声明 CustomTypeOptions，把 resources 和 defaultNS 的类型喂给 i18next，这样 t 括号 引号 就能获得 key 的自动补全和类型校验，拼错 key 直接报类型错。i18next 还提供 selector 形式，t 括号 美元 箭头 美元 点 key，类型更稳。
-->

---

# 几个易混点

<v-clicks>

- **核心 ≠ 绑定层**：i18next 是引擎，react-i18next / i18next-vue 是封装，依赖它；vue-i18n 是另一套独立方案
- **init 异步**：用 backend 时先 await 再用 t
- **插值默认转义**：`escapeValue: true`，关掉要自己防 XSS
- **复数必须传 count**：不传不回退裸 key
- **lng 覆盖检测**：用检测器别硬写 lng
- **缺 key 兜底**：默认返回 key 本身，不是 undefined

</v-clicks>

<!--
把今天的高频易混点集中过一遍，这些都是考点。

第一，核心和绑定层要分清。i18next 是框架无关的核心引擎，react-i18next 和 i18next-vue 是建立在它之上的绑定层，依赖它。而 vue-i18n 是 Vue 生态另一套独立方案，不是 i18next 的绑定。

第二，init 是异步的，用 backend 懒加载时一定先 await 再用 t。

第三，插值默认 HTML 转义，escapeValue 默认 true；关掉之后插用户输入要自己防 XSS。

第四，复数必须传 count 才生效，不传不会回退到裸 key。

第五，显式 lng 会覆盖语言检测，用检测器时别再硬写 lng。

第六，所有翻译都查不到又没给 defaultValue 时，t 默认返回 key 本身这个字符串，不是 undefined 也不是空串。
-->

---
layout: intro
---

# 总结

i18next = **框架无关的 JS 国际化核心引擎**

- 数据：`resources` 三层（语言 → 命名空间 → key/值）
- 取词：`t(key, options)`，`init` 异步返回 Promise
- 插值：默认 `{{var}}` + 默认 HTML 转义
- 复数：对齐 `Intl.PluralRules`，传 `count`
- 上下文 / 嵌套 / 格式化 / 命名空间 / 回退一应俱全
- 插件：语言检测 + HTTP 懒加载，经 `.use()` 接入
- 边界：**核心引擎 ≠ react-i18next / vue-i18n**

<!--
总结一下。

i18next 本质是一个框架无关的 JavaScript 国际化核心引擎，浏览器和 Node 都能跑。

数据模型是 resources 三层结构：语言、命名空间、键值。取词用 t，传 key 和 options；init 是异步的，返回 Promise。插值默认双大括号、默认 HTML 转义防 XSS。复数对齐 Intl.PluralRules，必须传 count。上下文、嵌套、格式化、命名空间、回退这些能力一应俱全，覆盖真实国际化的各种需求。需要语言检测和按需加载，用 i18next-browser-languagedetector 和 i18next-http-backend 这些插件，经 use 接入。

最后再强调今天贯穿的边界:i18next 核心引擎,不等于 react-i18next、也不等于 vue-i18n。前者是引擎,react-i18next 是它的 React 封装,vue-i18n 是 Vue 生态另一套独立方案。把这条理清,就掌握了 i18next 的全貌。谢谢大家。
-->
