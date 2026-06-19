---
theme: seriph
background: https://cover.sli.dev
title: '@pinia/testing'
info: |
  Presentation @pinia/testing for developers.

  Learn more at [https://pinia.vuejs.org/cookbook/testing.html](https://pinia.vuejs.org/cookbook/testing.html)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:pinia class="text-8xl" />
</div>

<br/>

## @pinia/testing：Pinia 官方测试工具

`createTestingPinia()` · action spy · state 可控 · getter 可覆盖（基于 v1.x / Pinia v3）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 @pinia/testing —— Pinia 官方出品的组件集成测试工具。

核心就一个函数：createTestingPinia()。把它作为 global.plugins 注入，
就能让 store 的 action 自动变成 spy、state 随意预设、getter 随意覆盖。
-->

---
transition: fade-out
---

# 什么是 @pinia/testing？

Pinia 官方组件集成测试工具

<v-click>

- **官方出品**：与 Pinia 同仓库，随 Pinia v3 同步发布，无额外依赖
- **一行注入**：`global.plugins: [createTestingPinia()]`，与 VTU / Testing Library 无缝配合
- **action 自动 spy**：默认把所有 action 替换为 spy，只记录调用、不执行真实逻辑
- **state 可控**：`initialState` 预设初始值；测试中直接改 `store.x` 或 `$patch`
- **getter 可覆盖**：测试里直接给 getter 赋值，免去复杂状态构造

</v-click>

<v-click>

**核心定位**：测「组件如何与 store 交互」，隔离组件与 store 实现

</v-click>

<style>
h1 {
  background-color: #f5a623;
  background-image: linear-gradient(45deg, #f5a623 10%, #f7c36b 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @pinia/testing 的五大特点：官方、一行注入、action spy、state 可控、getter 可覆盖。

[click] 定位很清晰：它不是用来测 store 内部逻辑的，而是测"组件有没有正确地调用 store"。
纯 store 逻辑测试应该用 setActivePinia(createPinia())，后面会讲边界区分。
-->

---
transition: fade-out
---

# 安装

一个包，零额外依赖

<v-click>

```bash
pnpm add -D @pinia/testing
```

</v-click>

<v-click>

**前置依赖**（已有则无需重装）：

```bash
pnpm add pinia           # 运行时依赖
pnpm add -D vitest       # 测试运行器
pnpm add -D @vue/test-utils  # VTU（或用 @testing-library/vue）
```

</v-click>

<v-click>

**不需要**单独安装 `@pinia/testing` 的 Pinia 插件；它内部创建独立的 testing pinia 实例，与项目正式 pinia 互不干扰。

</v-click>

<style>
h1 {
  background-color: #f5a623;
  background-image: linear-gradient(45deg, #f5a623 10%, #f7c36b 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 安装非常简单，只需一个包。

[click] 前置依赖：pinia 本身、测试运行器、VTU 或 Testing Library。

[click] 关键点：testing pinia 是独立实例，测试里的 store 和应用里的 store 完全隔离，互不污染。
-->

---
transition: fade-out
---

# 注入方式

`createTestingPinia()` 作为 `global.plugins`

<v-click>

**Vue Test Utils**：

```ts
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";
import Counter from "@/components/Counter.vue";

const wrapper = mount(Counter, {
  global: {
    plugins: [createTestingPinia({ createSpy: vi.fn })],
  },
});
```

</v-click>

<v-click>

**Testing Library**（完全相同的 `global` 选项）：

```ts
import { render } from "@testing-library/vue";

render(Counter, {
  global: { plugins: [createTestingPinia({ createSpy: vi.fn })] },
});
```

</v-click>

<style>
h1 {
  background-color: #f5a623;
  background-image: linear-gradient(45deg, #f5a623 10%, #f7c36b 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] VTU 的标准写法：把 createTestingPinia 放进 global.plugins 数组。
这里显式传 createSpy: vi.fn，因为 Vitest 未开 globals 时不自动检测。

[click] Testing Library 的写法完全一样，因为 render 的 global 选项就是透传给底层 VTU 的。
两个框架切换成本为零。
-->

---
transition: fade-out
---

# 第一个测试

注入 → 取 store → 触发 → 断言

<v-click>

**导入**（`@vue/test-utils` + `vitest` + `@pinia/testing` + store + 组件）

```ts
test("点击按钮调用 increment", async () => {
  const wrapper = mount(Counter, {
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })],
    },
  });

  const store = useCounterStore();
  await wrapper.find("button").trigger("click");

  expect(store.increment).toHaveBeenCalledTimes(1);
});
```

</v-click>

<style>
h1 {
  background-color: #f5a623;
  background-image: linear-gradient(45deg, #f5a623 10%, #f7c36b 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这是最典型的 @pinia/testing 使用模式，四步走：
1. mount 时注入 createTestingPinia
2. mount 后调用 useCounterStore()，自动拿到 testing pinia 的 store 实例
3. 触发组件交互（点击按钮）
4. 断言 action 被调用

关键：默认 stubActions: true，所以 increment 不会真正执行，只会被记录调用。
state 不会因为点击而改变，测试只验证"组件是否调用了正确的 action"。
-->

---
transition: fade-out
---

# stubActions：四种模式

控制哪些 action 被 spy 替换

<v-click>

```ts
// 1) true（默认）：全部变 spy，只记录不执行
createTestingPinia();
// 2) false：真正执行 + spy 包裹
createTestingPinia({ stubActions: false });
// 3) 数组：只 stub 指定 action
createTestingPinia({ stubActions: ["increment", "reset"] });
// 4) 函数：按名称动态决定
createTestingPinia({
  stubActions: (name) => name.startsWith("set"),
});
```

</v-click>

<v-click>

**选哪个**：只关心「有没有调用」→ `true`；想跑真实逻辑 + 断言 → `false`；混合需求 → 数组或函数

</v-click>

<style>
h1 {
  background-color: #f5a623;
  background-image: linear-gradient(45deg, #f5a623 10%, #f7c36b 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] stubActions 四种写法覆盖了所有场景：
- true：纯组件交互测试，action 当黑盒
- false：需要验证 action 副作用（比如 state 真的改变了）
- 数组：精细控制，部分 stub 部分真跑
- 函数：最灵活，可按命名规范批量决定

[click] 选择原则很简单：只断言"调用了没有"就用默认 true；要断言"调用后 state 怎么变"就用 false。
-->

---
transition: fade-out
---

# initialState：预设初始 state

key 是 store 的 `id`，值是 partial 覆盖

<v-click>

```ts
createTestingPinia({
  initialState: {
    counter: { n: 20 },        // counter store 的 n 从 20 开始
    user: { name: "Alice" },   // user store 的 name 预设为 Alice
  },
});
```

</v-click>

<v-click>

- key 对应 `defineStore` 第一个参数（store 的 id）
- 未提供的字段保持 `state()` 定义的默认值
- 内部通过 `$patch` 应用，是安全的部分覆盖

</v-click>

<v-click>

**场景**：测"用户已登录时的组件行为"，`initialState: { user: { loggedIn: true } }` 比手动 `store.loggedIn = true` 更早生效（mount 之前）

</v-click>

<style>
h1 {
  background-color: #f5a623;
  background-image: linear-gradient(45deg, #f5a623 10%, #f7c36b 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] initialState 的写法很直观，key 就是 defineStore 的第一个参数，value 是你想覆盖的部分。

[click] 三点记住：key 是 store id，只需提供要改的字段，内部用 $patch 应用。

[click] 关键优势：initialState 在组件 mount 之前生效，所以组件一挂载就能读到预设的 state。
如果你在 mount 之后才改 store.x，组件的 onMounted 钩子已经运行过了，可能错过初始渲染。
-->

---
transition: fade-out
---

# 直接修改 state

mount 之后随时改，testing pinia 下 state 可写

<v-click>

```ts
const wrapper = mount(Counter, {
  global: { plugins: [createTestingPinia({ createSpy: vi.fn })] },
});

const store = useCounterStore();

store.n = 42;                      // 直接赋值
store.$patch({ n: 42 });          // 或 $patch 批量改

expect(store.n).toBe(42);
```

</v-click>

<v-click>

- 无需绕过任何 setter 或 readonly 限制
- `$patch` 接受对象或函数两种形式
- 改完后触发组件重新渲染，`await nextTick()` 后可断言 DOM

</v-click>

<style>
h1 {
  background-color: #f5a623;
  background-image: linear-gradient(45deg, #f5a623 10%, #f7c36b 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] testing pinia 解除了 state 的只读限制，可以直接赋值。
这在普通 pinia 里是不允许的（strict 模式），但在测试里非常方便。

[click] 三点补充：
- 无限制：想改哪个字段直接改
- $patch 两种形式：对象或 mutator 函数
- 改了 state 后组件会重渲染，用 await nextTick() 等渲染完成再断言 DOM
-->

---
transition: fade-out
---

# 覆盖 getter

测试环境 getter 可写，直接赋值即 mock

<v-click>

```ts
const store = useCounterStore();

// 直接赋值覆盖 getter 返回值
store.double = 3;

// 断言组件用到了 getter 的覆盖值
expect(wrapper.text()).toContain("3");
```

</v-click>

<v-click>

```ts
// 恢复默认计算：赋 undefined（类型上需 @ts-expect-error）
// @ts-expect-error 恢复 getter 到正常计算
store.double = undefined;
store.double; // 回到正常的 n * 2 计算
```

</v-click>

<v-click>

**用途**：隔离 getter 的复杂依赖，直接给组件喂一个固定返回值，测试逻辑更聚焦

</v-click>

<style>
h1 {
  background-color: #f5a623;
  background-image: linear-gradient(45deg, #f5a623 10%, #f7c36b 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] testing pinia 把 getter 也变成可写的，赋值就是 mock 返回值。
不用再构造复杂的 state 来让 getter 计算出你想要的值。

[click] 恢复的方法：赋 undefined 会让 getter 重新计算。
TypeScript 类型上 getter 是只读的，赋 undefined 需要 @ts-expect-error 压制。

[click] 这个特性的价值：比如 getter 依赖多个 store 或复杂计算，你只想测"组件显示了 getter 的值"，
直接给一个固定值就能聚焦在组件渲染逻辑上。
-->

---
transition: fade-out
---

# createSpy：spy 工厂配置

Vitest 未开 globals 时必须显式传

<v-click>

**自动检测规则**：
- Jest 环境 → 自动用 `jest.fn`
- Vitest + `globals: true` → 自动用 `vi.fn`
- 其他情况 → **action 不是 spy，断言会报错**

</v-click>

<v-click>

**推荐写法**（Vitest 项目统一显式传）：

```ts
import { vi } from "vitest";

createTestingPinia({ createSpy: vi.fn });
```

</v-click>

<v-click>

也可以用 Sinon 或其他框架的 spy：

```ts
import sinon from "sinon";
createTestingPinia({ createSpy: sinon.spy });
```

</v-click>

<style>
h1 {
  background-color: #f5a623;
  background-image: linear-gradient(45deg, #f5a623 10%, #f7c36b 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] createSpy 的自动检测有盲区：Vitest 不开 globals 时检测不到，action 就不是真正的 spy，
断言 toHaveBeenCalledTimes 会因为没有 spy 方法而报错。

[click] 推荐在 Vitest 项目里统一显式传 vi.fn，避免依赖检测逻辑，明确且安全。

[click] 也支持 Sinon 等其他框架，传对应的 spy 工厂就行，具有良好的框架无关性。
-->

---
transition: fade-out
---

# 断言 action 被调用

标准 spy 断言语法

<v-click>

```ts
const store = useSomeStore();

// 调用次数
expect(store.someAction).toHaveBeenCalledTimes(1);
// 参数匹配
expect(store.someAction).toHaveBeenCalledWith(arg1, arg2);
// 最后一次参数
expect(store.someAction).toHaveBeenLastCalledWith(arg1);
// Vitest 语义化（等同于 CalledTimes(1)）
expect(store.someAction).toHaveBeenCalledOnce();
```

</v-click>

<v-click>

action 是 `vi.fn()` 的 spy，所有 Vitest mock 断言均可用

</v-click>

<style>
h1 {
  background-color: #f5a623;
  background-image: linear-gradient(45deg, #f5a623 10%, #f7c36b 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 断言 API 就是标准的 Vitest spy 断言，没有任何学习成本。
最常用的四个：CalledTimes 计次、CalledWith 验参数、LastCalledWith 验最后一次参数、CalledOnce 语义化。

[click] 底层原理：action 就是 vi.fn() 返回的 spy 函数，所有 Vitest mock 相关的断言 matcher 都可以用。
-->

---
transition: fade-out
---

# mockedStore：类型工具

让 action 的类型变成 Mock，解锁 `.mockResolvedValue` 等

<v-click>

**问题**：TS 类型上 action 仍是普通函数，调用 `.mockResolvedValue()` 会报类型错误

</v-click>

<v-click>

**解法**：用 `mockedStore` 包装，运行时等同于 `useStore()`，只是类型变成了 Mock 类型

```ts
import { mockedStore } from "@pinia/testing";
import { useSomeStore } from "@/stores/some";

const store = mockedStore(useSomeStore);

// 现在类型安全，可以用所有 mock API
store.someAction.mockResolvedValue("mocked result");
store.someAction.mockImplementation(() => "sync result");
store.someAction.mockReturnValue("value");
```

</v-click>

<v-click>

`mockedStore` 是纯类型工具函数，运行时开销为零

</v-click>

<style>
h1 {
  background-color: #f5a623;
  background-image: linear-gradient(45deg, #f5a623 10%, #f7c36b 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 问题根源：action 在 TypeScript 类型层面仍是普通函数类型，
虽然运行时已经是 spy，但 TS 不知道，调用 .mockResolvedValue 会报类型错误。

[click] mockedStore 只做一件事：把 store 的类型从"普通函数"转换成"Mock 函数"，
这样 .mockResolvedValue / .mockImplementation 等都能通过类型检查。

[click] 重要：mockedStore 在运行时只是 useStore()，没有任何包装逻辑，类型体操而已。
-->

---
transition: fade-out
---

# 其他选项：stubPatch / stubReset / plugins / fakeApp

更细粒度的控制

<v-click>

```ts
createTestingPinia({
  stubPatch: true,        // $patch 被 spy 但不改 state
  stubReset: true,        // $reset 被 spy 但不重置
  plugins: [somePlugin],  // 注入应用层 Pinia 插件
  fakeApp: true,          // 创建空 Vue App 并 app.use(pinia)
});
```

</v-click>

<v-click>

- `plugins` 必须用此选项传，不要在返回实例上 `.use()`
- `fakeApp` 适合插件依赖真实 App 上下文的情况

</v-click>

<style>
h1 {
  background-color: #f5a623;
  background-image: linear-gradient(45deg, #f5a623 10%, #f7c36b 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这四个选项偏进阶，大多数项目用不到：
- stubPatch / stubReset：当你想验证"组件有没有调用 $patch / $reset"而不是让它真正生效
- plugins：持久化等应用层插件需要通过这里传，直接 .use() 不会生效
- fakeApp：某些插件需要 app 实例才能初始化

[click] 最需要记住的是 plugins 选项：别踩"在返回实例上 .use()"的坑，那里是错误用法。
-->

---
transition: fade-out
---

# 边界：createTestingPinia vs setActivePinia

两个场景，不要混用

<v-click>

| 场景 | 工具 | 目的 |
| --- | --- | --- |
| **组件 + store 集成测试** | `createTestingPinia()` | mock/spy store，验证组件与 store 的交互 |
| **纯 store 单元测试** | `setActivePinia(createPinia())` | 真正执行 action，验证 store 自身逻辑 |

</v-click>

<v-click>

**纯 store 单元测试**（不需要 @pinia/testing）：

```ts
import { setActivePinia, createPinia } from "pinia";
beforeEach(() => {
  setActivePinia(createPinia()); // 每个测试用全新 pinia
});

it("increment 真实执行", () => {
  const counter = useCounterStore();
  counter.increment();
  expect(counter.n).toBe(1); // action 真正运行
});
```

</v-click>

<style>
h1 {
  background-color: #f5a623;
  background-image: linear-gradient(45deg, #f5a623 10%, #f7c36b 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是最容易混淆的地方：两个工具的场景完全不同。
createTestingPinia 是组件集成测试专用，关注"组件有没有正确调用 store"。
setActivePinia 是纯 store 单元测试，关注"store 内部逻辑对不对"。

[click] 纯 store 测试完全不需要 @pinia/testing，直接 setActivePinia(createPinia()) 就够了。
在 beforeEach 里每次创建新的 pinia 保证测试隔离，action 真正执行，断言 state 变化。
-->

---
transition: fade-out
---

# 完整集成示例

组合所有核心特性的测试用例

<v-click>

**① 注入 + 预设 state**

```ts
const wrapper = mount(CartButton, {
  global: {
    plugins: [createTestingPinia({
      createSpy: vi.fn,
      initialState: { cart: { items: [], isLoading: false } },
    })],
  },
});
```

</v-click>

<v-click>

**② 取 store → mock action → 触发 → 断言**

```ts
const store = mockedStore(useCartStore);
store.addItem.mockResolvedValue(undefined);

await wrapper.find("[data-test='add-btn']").trigger("click");

expect(store.addItem).toHaveBeenCalledOnce();
```

</v-click>

<style>
h1 {
  background-color: #f5a623;
  background-image: linear-gradient(45deg, #f5a623 10%, #f7c36b 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这个示例把几个核心特性都用上了：
1. createTestingPinia 注入，显式传 createSpy: vi.fn
2. initialState 预设购物车初始状态
3. mockedStore 获取类型安全的 store，能调用 mockResolvedValue
4. 触发按钮点击
5. 断言 addItem 被调用了一次

这就是 @pinia/testing 的完整使用模式，四步：注入 → 预设状态 → 触发交互 → 断言调用。
-->

---
layout: intro
transition: fade-out
---

# 总结

`createTestingPinia()` 让组件 + store 集成测试极简

- **一行注入**：`global.plugins: [createTestingPinia({ createSpy: vi.fn })]`
- **action spy**：默认全 stub，或用 `stubActions` 精细控制
- **state 预设**：`initialState` 在 mount 前生效；mount 后直接改或 `$patch`
- **getter 覆盖**：直接赋值 mock 返回，赋 `undefined` 恢复
- **类型安全**：`mockedStore(useStore)` 解锁 `.mockResolvedValue` 等 API
- **边界清晰**：组件集成 → `createTestingPinia`，纯 store 单测 → `setActivePinia`

<div class="abs-br m-6 text-xl">
  <a href="https://pinia.vuejs.org/cookbook/testing.html" target="_blank" class="slidev-icon-btn">
    <logos:pinia />
  </a>
  <a href="https://github.com/vuejs/pinia" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/frontend-develop-tools/testing/component-testing/pinia-testing/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #f5a623;
  background-image: linear-gradient(45deg, #f5a623 10%, #f7c36b 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
@pinia/testing 的核心就是这六条，每条对应一个使用场景。

最重要的两点：
1. createSpy: vi.fn 要显式传，不要依赖自动检测
2. 边界清晰：组件测试用 createTestingPinia，纯 store 测试用 setActivePinia

掌握这些，Vue 3 + Pinia 的组件集成测试就没有门槛了。
-->

---
layout: end
---
