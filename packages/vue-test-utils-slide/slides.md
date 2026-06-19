---
theme: seriph
background: https://cover.sli.dev
title: Vue Test Utils
info: |
  Presentation Vue Test Utils for developers.

  Learn more at [https://test-utils.vuejs.org/](https://test-utils.vuejs.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:vue class="text-8xl" />
</div>

<br/>

## Vue Test Utils：Vue 官方组件测试库

挂载组件 · 查询交互 · 断言行为（基于 @vue/test-utils v2.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Vue Test Utils（VTU）—— Vue 官方维护的组件测试工具库。

它把 Vue 组件挂载到虚拟 DOM，提供 trigger / setValue 等交互 API 和 find / text / emitted 等断言入口，让你验证组件渲染、props、事件、插槽等行为。

v2.x 对应 Vue 3，v1.x 对应 Vue 2——今天讲 v2。
-->

---
transition: fade-out
---

# 什么是 Vue Test Utils？

Vue 官方组件测试工具库

<v-click>

- **Vue 官方**：与 Vue 3 同步演进，对 Composition API、`<script setup>`、Suspense、Teleport 一等支持
- **可访问内部**：`props()` / `emitted()` / `vm` 直接验证 props 契约与自定义事件
- **挂载选项强大**：`global.plugins` 一行注入 Pinia / Vue Router，`global.stubs` 精细 stub 子组件
- **运行器无关**：搭配 Vitest（推荐）或 Jest 均可，只负责"挂载与交互"
- **深浅挂载**：`mount` 集成 / `shallowMount` 隔离，按测试粒度自由选

</v-click>

<div v-click class="mt-4 text-sm text-gray-400">

注意事项：需要 DOM 环境（jsdom / happy-dom）· 异步易踩（trigger 必须 await）· v1 / v2 不通用

</div>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] VTU 的核心价值：Vue 官方出品，所有新特性（Composition API、script setup、Teleport）都有一等支持。

[click] 三个注意点：1）需要 DOM 环境，不能在纯 Node 里跑；2）异步是最高频踩坑；3）v1 和 v2 API 差异较大。
-->

---
transition: fade-out
---

# 安装与配置

三步可跑

<v-click>

```bash
pnpm add -D @vue/test-utils
```

</v-click>

<v-click>

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: { environment: "jsdom" },
});
```

</v-click>

<v-click>

- `jsdom`：DOM API 完整，兼容性好（推荐）
- `happy-dom`：更快，部分 API 不完整
- `@vitejs/plugin-vue` 让 Vitest 原生处理 `.vue` 文件，无需额外 transform

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 最小安装只需 @vue/test-utils 本身。

[click] Vitest 配置两个关键：plugins 加 vue()，test.environment 选 jsdom 或 happy-dom。

[click] 两个 DOM 环境的取舍：追求完整性选 jsdom，追求速度选 happy-dom。
-->

---
transition: fade-out
---

# 第一个测试

mount → wrapper → 断言

<v-click>

```ts
// HelloWorld.vue: <template><h1>{{ msg }}</h1></template>
import { mount } from "@vue/test-utils";
import HelloWorld from "./HelloWorld.vue";

test("渲染传入的 msg", () => {
  const wrapper = mount(HelloWorld, {
    props: { msg: "Hello Vue!" },
  });
  expect(wrapper.text()).toContain("Hello Vue!");
});
```

</v-click>

<v-click>

**mount 的三件套**：

- 第一参数：组件定义（SFC / defineComponent）
- 第二参数（可选）：挂载选项 `{ props, global, slots, ... }`
- 返回值：**wrapper** —— 包裹挂载后组件，提供查询、交互、断言的入口

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 最简单的测试：mount 组件 → 拿到 wrapper → 用 wrapper.text() 断言文本。

[click] mount 是 VTU 的核心。理解这三件套，就掌握了 VTU 的核心心智模型。
-->

---
transition: fade-out
---

# mount vs shallowMount

集成 vs 隔离

<v-click>

```ts
import { mount, shallowMount } from "@vue/test-utils";

mount(Parent);
// 完整渲染，含所有子组件 —— 最接近真实，置信度高

shallowMount(Parent);
// 子组件被替换为 <child-stub />，隔离本组件
// 等价写法：mount(Parent, { shallow: true })
```

</v-click>

<v-click>

| 方式 | 适用场景 | 特点 |
| --- | --- | --- |
| `mount` | 集成/功能测试 | 置信度高，子组件真实渲染 |
| `shallowMount` | 子组件很重、或只测本组件逻辑 | 隔离彻底，速度快 |

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] mount 和 shallowMount 是 VTU 最基础的选择。
shallowMount 把所有子组件换成 <xxx-stub />，只渲染本组件自身的模板。

[click] 经验法则：优先 mount，只有子组件带真实副作用（网络/重计算）才换 shallowMount。
-->

---
transition: fade-out
---

# Wrapper 查询 DOM

find / get / findAll

<v-click>

```ts
wrapper.find("#submit");            // CSS 选择器，返回 DOMWrapper
wrapper.find("[data-test='email']");// 推荐用 data-test 属性，抗重构
wrapper.findAll("li");              // 所有匹配，返回 DOMWrapper[]
```

</v-click>

<v-click>

**find vs get 的关键区别**：

```ts
// find：找不到返回"空 wrapper"，配合 exists() 判断
expect(wrapper.find("#admin").exists()).toBe(false);

// get：找不到直接抛错，用于"断言它一定存在"
const btn = wrapper.get("#submit"); // 不存在则测试报错
```

</v-click>

<v-click>

::: tip 优先用 data-test 选择器
`[data-test="xxx"]` 不受样式 / 结构重构打破，比 class / id 更稳定。
:::

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] CSS 选择器接受任意格式，data-test 是最稳健的约定。

[click] find vs get 语义差别很重要：find 用于"可能不存在"，get 用于"一定存在"——如果不存在 get 直接报错，让测试失败更直白。

[click] data-test 属性约定是社区最佳实践，测试和实现解耦。
-->

---
transition: fade-out
---

# Wrapper 查询组件

findComponent / findAllComponents

<v-click>

v2.x 中 `find` 只接受 CSS 选择器；查找 Vue 组件要用 `findComponent`：

```ts
import Child from "./Child.vue";

wrapper.findComponent(Child);           // 传组件定义（最推荐）
wrapper.findComponent({ name: "Child" });// 按 name 字符串
wrapper.findComponent({ ref: "childRef" });// 按 template ref
wrapper.findAllComponents(Child);       // 所有匹配
```

</v-click>

<v-click>

**配合 stub 断言**：

```ts
// 断言被 stub 的子组件存在
expect(wrapper.findComponent({ name: "HeavyChart" }).exists()).toBe(true);

// 访问未 stub 的子组件 props
const child = wrapper.findComponent(ChildComponent);
expect(child.props("label")).toBe("ok");
```

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v2 把 find 和 findComponent 职责明确分开：DOM 元素用 find，Vue 组件用 findComponent。
传组件定义是最推荐的方式，类型安全。

[click] findComponent 对 stub 也有效：子组件被 stub 成占位后，仍可用 findComponent 查到它。
-->

---
transition: fade-out
---

# Wrapper 交互与断言

trigger / setValue / text / exists / classes

<v-click>

```ts
// 触发事件（必须 await！）
await wrapper.find("button").trigger("click");
await wrapper.find("form").trigger("submit.prevent");
await wrapper.find("input").trigger("keydown.enter");

// 设置输入值
await wrapper.find("input").setValue("hello@x.com");
await wrapper.find("input[type=checkbox]").setValue(); // 勾选
```

</v-click>

<v-click>

```ts
// 断言
expect(wrapper.text()).toContain("Hello");       // 文本内容
expect(wrapper.html()).toContain("active");      // HTML 字符串
expect(wrapper.find("#user").exists()).toBe(true);// 是否存在
expect(wrapper.classes()).toContain("active");   // class 数组
expect(wrapper.attributes("disabled")).toBe("true");// 属性值
```

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] trigger 和 setValue 都是异步的，必须 await。
事件修饰符直接拼字符串，比如 "submit.prevent"、"keydown.enter"。

[click] 断言 API 很直观：text() 拿文本，exists() 判存在，classes() 检查样式类。
-->

---
transition: fade-out
---

# 为什么交互必须 await？

Vue DOM 更新是异步的

<v-click>

```ts
// ❌ 漏 await：断言时 DOM 还没更新
wrapper.find("button").trigger("click");
expect(wrapper.text()).toContain("1"); // 失败！

// ✅ 正确写法
await wrapper.find("button").trigger("click");
expect(wrapper.text()).toContain("1");
```

</v-click>

<v-click>

**三种等待方式**：

```ts
import { nextTick } from "vue";
import { flushPromises } from "@vue/test-utils";

await wrapper.trigger("click"); // 等事件引发的 DOM 更新
await nextTick();               // 手动等一次 Vue 渲染队列刷新
await flushPromises();          // 等所有挂起的 Promise（含 axios/fetch）
```

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vue 的 DOM 更新是异步批量的，而测试代码同步执行。
trigger / setValue 内部都 return nextTick()，不 await 断言就在 DOM 更新前跑，必然失败。

[click] 三种等待：trigger 已经内含一次 nextTick；需要等网络请求时用 flushPromises；
两次 DOM 更新之间插 nextTick()。
-->

---
transition: fade-out
---

# 传入 props 与 setProps

初始传入 vs 动态更新

<v-click>

```ts
// 挂载时传入 props
const wrapper = mount(Password, {
  props: { minLength: 10 },
});

// 非 prop 的 HTML 属性用 attrs
const wrapper2 = mount(Button, {
  attrs: { disabled: true, "aria-label": "Submit" },
});
```

</v-click>

<v-click>

```ts
// setProps 动态更新，必须 await
const wrapper = mount(Show, { props: { show: true } });
expect(wrapper.html()).toContain("Hello");

await wrapper.setProps({ show: false });
expect(wrapper.html()).not.toContain("Hello");

// 读取当前 props
wrapper.props("minLength"); // 10
```

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] props 选项传入组件 props；attrs 传入非 prop 的 HTML 属性（会被继承到根元素）。

[click] setProps 模拟父组件更新 props，同样是异步的，必须 await。
wrapper.props() 读取当前值，可用于验证 props 契约。
-->

---
transition: fade-out
---

# emitted 断言自定义事件

记录所有 emit

<v-click>

`emitted()` 返回 `{ 事件名: [[一次的参数...], ...] }` 结构：

```ts
const wrapper = mount(Counter);

await wrapper.find("button").trigger("click");
await wrapper.find("button").trigger("click");

const events = wrapper.emitted("increment");
expect(events).toHaveLength(2);    // 共 emit 了 2 次
expect(events[0]).toEqual([1]);    // 第 1 次参数是 [1]
expect(events[1]).toEqual([2]);    // 第 2 次参数是 [2]
```

</v-click>

<v-click>

```ts
// 无参数事件：只断言被触发
expect(wrapper.emitted("close")).toBeTruthy();

// 带 payload：取第 1 次触发的第 1 个参数
expect(wrapper.emitted("update")[0][0]).toEqual({ id: 1 });
```

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] emitted() 设计为二维数组：第一维是调用次数，第二维是每次的参数列表。
events[0] 是第一次触发，events[0][0] 是第一次触发的第一个参数。

[click] 无参数事件只断言 truthy（事件被触发过）；带 payload 精确取出参数断言。
-->

---
transition: fade-out
---

# 表单与 v-model 测试

setValue + onUpdate 回调

<v-click>

```ts
test("提交表单", async () => {
  const wrapper = mount(Form);

  await wrapper.find("input[type=email]").setValue("my@mail.com");
  await wrapper.find("select").setValue("option-1");
  await wrapper.find("input[type=checkbox]").setValue(); // 勾选
  await wrapper.find("button").trigger("click");

  expect(wrapper.emitted("submit")[0][0]).toBe("my@mail.com");
});
```

</v-click>

<v-click>

**测试 v-model**（VTU 无真实父组件，用回调 + setProps 模拟双向绑定）：

```ts
const wrapper = mount(Editor, {
  props: {
    modelValue: "initial",
    "onUpdate:modelValue": (e) => wrapper.setProps({ modelValue: e }),
  },
});
await wrapper.find("input").setValue("test");
expect(wrapper.props("modelValue")).toBe("test");
```

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 表单测试：用 setValue 逐一填值，最后 trigger submit，再断言 emitted 的 payload。

[click] v-model 测试是 VTU 里稍复杂的模式：没有真实父组件，所以要注册 onUpdate:modelValue 回调，
回调里用 setProps 把新值写回，模拟双向绑定。
-->

---
transition: fade-out
---

# 异步 HTTP 与 Suspense

flushPromises 等网络请求

<v-click>

```ts
import { flushPromises } from "@vue/test-utils";

test("加载文章列表", async () => {
  vi.spyOn(axios, "get").mockResolvedValue({ data: posts });

  const wrapper = mount(PostList);
  await wrapper.find("button").trigger("click");
  expect(wrapper.html()).toContain("Loading..."); // Promise 还 pending

  await flushPromises(); // 等 axios 的 Promise resolve
  expect(wrapper.findAll("[data-test='post']")).toHaveLength(3);
});
```

</v-click>

<v-click>

**`async setup()` 组件**需用 `<Suspense>` 包裹后再测：

```ts
const TestComponent = defineComponent({
  components: { AsyncComp },
  template: "<Suspense><AsyncComp /></Suspense>",
});
const wrapper = mount(TestComponent);
await flushPromises(); // 等 async setup 完成
```

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] flushPromises 是测试异步 HTTP 的关键：它会把所有挂起的 Promise 都 resolve 掉。
trigger 返回的 nextTick 只等一次渲染，不够等网络请求。

[click] async setup 组件（顶层 await）需要 Suspense 作为边界。
flushPromises 同样是等它完成的工具。
-->

---
transition: fade-out
---

# 插槽 slots

默认插槽 / 具名插槽 / 作用域插槽

<v-click>

```ts
import { h } from "vue";
import Header from "./Header.vue";

const wrapper = mount(Layout, {
  slots: {
    default: "Main Content",   // 字符串
    header: Header,            // SFC 组件
    sidebar: h("div", "Sidebar"), // 渲染函数
    footer: "<div>Footer</div>",  // HTML 字符串
  },
});
```

</v-click>

<v-click>

**作用域插槽**用 `<template>` 语法接收参数：

```ts
const wrapper = mount(List, {
  slots: {
    item: `<template #item="{ name }">{{ name }}</template>`,
  },
});
```

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] slots 选项支持多种格式，统一放在挂载选项的 slots 字段下。
字符串 / HTML 字符串 / SFC / 渲染函数都支持，按场景选最简便的。

[click] 作用域插槽必须用 template + # 语法接收 slot props，写 HTML 模板字符串。
-->

---
transition: fade-out
---

# global 注入选项

plugins / provide / mocks / stubs

<v-click>

```ts
const wrapper = mount(MyComponent, {
  global: {
    plugins: [createPinia(), router], // 注入插件
    provide: { "my-key": "data" },    // inject 依赖
    mocks: { $t: (k) => k },          // mock 全局属性（如 vue-i18n）
    stubs: { HeavyChart: true },       // stub 子组件
    components: { GlobalBtn: MyButton }, // 全局组件
    directives: { tooltip: { mounted() {} } }, // 全局指令
  },
});
```

</v-click>

<v-click>

**套件级默认**（避免每个测试重复写）：

```ts
// vitest.setup.ts
import { config } from "@vue/test-utils";

config.global.mocks = { $t: (k) => k };
config.global.stubs = { Teleport: true };
```

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] global 选项控制组件树的全局配置，作用于被挂载组件的所有子组件。
plugins 注入 Pinia/Router，provide 注入 inject 依赖，mocks 解决 $t 等全局属性。

[click] config.global 放在 setup 文件里做全局默认，省去每个测试重复写。
常见的 $t mock 和 Teleport stub 就适合放这里。
-->

---
transition: fade-out
---

# stub 与 shallowMount

局部 stub vs 全量 stub

<v-click>

**局部 stub**（精细控制，其余子组件正常渲染）：

```ts
const wrapper = mount(Parent, {
  global: {
    stubs: {
      ChildComponent: true, // 默认占位 stub（<child-component-stub />）
      HeavyChart: { template: "<div class='chart-stub' />" }, // 自定义模板
    },
  },
});
```

</v-click>

<v-click>

**批量 stub 数组 + shallowMount**：

```ts
// 只 stub 指定列表
global: { stubs: ["RouterLink", "RouterView"] }

// shallowMount：自动 stub 所有子组件
shallowMount(Parent);
// shallowMount 在 v2 不渲染 stub 子组件的默认插槽（v1 会渲染）
```

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 局部 stub 是 shallowMount 的精细版：只换掉特定子组件，其余保持真实渲染。
true 是默认占位；也可传自定义模板让 stub 更可控。

[click] 数组格式批量 stub 很方便。
shallowMount v2 有个行为变更：不再渲染 stub 子组件的默认插槽，需要旧行为要显式开启。
-->

---
transition: fade-out
---

# 测试 Vue Router

真实 router + createMemoryHistory

<v-click>

官方主推**真实 router + 内存历史**，置信度高：

```ts
import { createRouter, createMemoryHistory } from "vue-router";
import { routes } from "@/router";
test("点击导航到 /about", async () => {
  const router = createRouter({ history: createMemoryHistory(), routes });
  const wrapper = mount(App, { global: { plugins: [router] } });
  await router.isReady(); // 等初始导航完成（关键！）
  await wrapper.find("[data-test='about-link']").trigger("click");
  await flushPromises(); // 等路由切换

  expect(router.currentRoute.value.path).toBe("/about");
});
```

</v-click>

<v-click>

**只需 RouterLink 不报错**，用内置 `RouterLinkStub`：

```ts
import { RouterLinkStub } from "@vue/test-utils";
const wrapper = mount(NavBar, {
  global: { stubs: { RouterLink: RouterLinkStub } },
});
expect(wrapper.findComponent(RouterLinkStub).props("to")).toBe("/about");
```

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 每个测试建独立 router 实例避免污染。
router.isReady() 是最容易忘的一步：等初始导航（beforeEach 守卫）完成后才能操作。

[click] RouterLinkStub 是 VTU 内置的，只需让 RouterLink 不报错时直接用，不用 mock 整个路由。
-->

---
transition: fade-out
---

# 测试 Pinia

createTestingPinia 注入

<v-click>

`@pinia/testing` 的 `createTestingPinia()` 默认把所有 action 变成 spy：

```ts
import { createTestingPinia } from "@pinia/testing";
import { useCounterStore } from "@/stores/counter";

test("点击调用 store action", async () => {
  const wrapper = mount(Counter, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: { counter: { count: 5 } }, // 预设 state
          stubActions: false, // false = action 真正执行（默认 true 只记录）
        }),
      ],
    },
  });
  const store = useCounterStore();
  store.count = 10; // 可直接改 state

  await wrapper.find("button").trigger("click");
  expect(store.increment).toHaveBeenCalledOnce();
});
```

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
createTestingPinia 注入到 plugins 后，组件树内所有 useXxxStore() 拿到的都是测试版 store。
stubActions: true（默认）action 只记录不执行，用于断言"action 被调用"；
stubActions: false 让 action 真正执行，用于集成测试。
可以直接改 store.count = 10 绕过 action，灵活预设状态。
-->

---
transition: fade-out
---

# Teleport 与 Transition

特殊内置组件的处理

<v-click>

**Teleport**（内容渲染到组件树外）：

```ts
// Virtual DOM 引用保留，findComponent 仍可查
expect(wrapper.findComponent(Modal).exists()).toBe(true);

// 或忽略 Teleport 行为，用 stub
const wrapper = mount(MyComponent, {
  global: { stubs: { Teleport: true } },
});
```

</v-click>

<v-click>

**Transition**（VTU 默认自动 stub，过渡立即生效）：

```ts
test("点击后显示内容", async () => {
  const wrapper = mount(FadeComponent);
  await wrapper.find("button").trigger("click");
  // transition 已被 stub，DOM 立即更新，不需要等动画
  expect(wrapper.find(".content").exists()).toBe(true);
});
```

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Teleport 把 DOM 移到别处，但 VTU 的 Virtual DOM 引用不变，findComponent 依然能查到。
如果不想测 Teleport 行为，直接 stub 掉最简单。

[click] Transition 的处理 VTU 已经帮你做了：默认自动 stub，让过渡立即完成。
测试里不需要等动画时间，直接断言最终状态。
-->

---
transition: fade-out
---

# 与 Testing Library 的边界

按场景选工具

<v-click>

| 场景 | 推荐 | 原因 |
| --- | --- | --- |
| 验证 props 契约、组件内部逻辑 | Vue Test Utils | `props()` / `emitted()` / `vm` 可访问内部 |
| 模拟用户行为、关注可访问性 | Testing Library | 用 ARIA 角色查询，更贴近真实用户操作 |
| 需要 stub 子组件、精细隔离 | Vue Test Utils | `global.stubs` / `shallowMount` |
| CI 里运行快速组件冒烟测试 | 两者均可 | 按团队偏好 |

</v-click>

<v-click>

**实践中常混用**：

- Testing Library 底层调用 VTU，两者可共存
- 组件契约测试 → VTU；用户流程测试 → Testing Library

</v-click>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] VTU 和 Testing Library 不是对立关系。Testing Library for Vue 底层就是用 VTU 挂载的。
VTU 擅长"组件内部契约"；Testing Library 擅长"用户视角的行为"。

[click] 混用是常见实践：同一个组件，VTU 测 props/emits，Testing Library 测用户交互流程。
-->

---
layout: intro
transition: fade-out
---

# 总结

mount → wrapper → 查询 / 交互 / 断言

- **安装**：`pnpm add -D @vue/test-utils` + Vitest `jsdom` 环境
- **核心**：`mount` 返回 wrapper，`find/get/findComponent` 查元素
- **交互**：`trigger / setValue` 必须 `await`（Vue DOM 异步更新）
- **事件**：`emitted("name")` 返回二维数组记录所有 emit
- **注入**：`global.plugins / provide / stubs` 一键注入 Pinia/Router
- **Router**：真实 router + `createMemoryHistory` + `router.isReady()`
- **Pinia**：`createTestingPinia({ initialState, stubActions })`

<div class="abs-br m-6 text-xl">
  <a href="https://test-utils.vuejs.org" target="_blank" class="slidev-icon-btn">
    <logos:vue />
  </a>
  <a href="https://github.com/vuejs/test-utils" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/frontend-develop-tools/testing/component-testing/vue-test-utils/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #42b883;
  background-image: linear-gradient(45deg, #42b883 10%, #35495e 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Vue Test Utils 的精华浓缩在七条：
- 安装配置简单，Vitest + jsdom 就位
- mount/shallowMount 选择隔离粒度
- 所有交互都必须 await，这是最高频踩坑
- emitted 二维数组设计，第一维次数、第二维参数
- global 选项统一注入应用级依赖
- Router 真实实例 + isReady 是官方主推方案
- Pinia 用 createTestingPinia，stubActions 控制是否真执行

VTU 是 Vue 组件测试的底座，掌握它才能把组件测试做扎实。
-->

---
layout: end
---
