---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Vitest
info: |
  Presentation Vitest for developers.

  Learn more at [https://vitest.dev/](https://vitest.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:vitest class="text-8xl" />
</div>

<br/>

## Vitest：Vite 原生驱动的下一代测试框架

零配置复用构建管线 · 原生 ESM + TS · 毫秒级 watch（基于 v4.1.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Vitest —— Vue / Vite 生态的事实标准测试运行器。

它不是 Jest 的 fork，而是直接复用 Vite 的转换管线，让"测试环境 == 构建环境"，彻底消灭环境漂移。
-->

---
transition: fade-out
---

# 什么是 Vitest？

Vite 原生的单元测试运行器

<v-click>

- **与构建同源**：复用 `vite.config.ts` 的 alias / plugins / define，杜绝"构建能过、测试挂"
- **原生 ESM + TS**：无需 babel / ts-jest 转译层，`import.meta`、顶层 `await` 开箱即用
- **极快 watch**：基于模块依赖图，只重跑受改动影响的测试，HMR 式体验
- **Jest 兼容**：`vi.*` 对应 `jest.*`，matchers / 快照 / `test.each` 几乎无缝迁移
- **能力完整**：内置 mock、假定时器、覆盖率、快照、类型测试

</v-click>

<div v-click text-xs>

_State of JS 满意度连年第一 ·_ [_vitest.dev_](https://vitest.dev/)

</div>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vitest 的核心价值：测试和构建用同一套管线，杜绝"在我机器上能过"。
原生 ESM 意味着不用额外配 babel-jest 或 ts-jest，TypeScript 直接跑。

[click] State of JS 满意度连年第一，说明迁移过去的开发者很少后悔。
-->

---
transition: fade-out
---

# 为什么快？三大引擎

Vite 管线 + ESM + 模块图 watch

<v-click>

**1. 复用 Vite 转换管线**

```
源码 → Vite 插件 → esbuild 转译 → 测试运行
             ↑ 和构建完全同一条管线
```

</v-click>

<v-click>

**2. 原生 ESM 按需加载**

- 测试文件在 worker 中动态 `import()`，只加载真正用到的模块
- 无需打包整个入口，启动毫秒级

</v-click>

<v-click>

**3. 模块依赖图智能 watch**

- 改了 `math.ts` → 只重跑 `math.test.ts` 及依赖它的测试
- 不改动的文件完全跳过，大项目也是秒级反馈

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vite 管线复用是核心。你在 vite.config 配置的 alias、plugin、define 在测试里自动生效。

[click] 原生 ESM 让模块按需加载，不需要像 Jest 那样在启动时转译所有文件。

[click] 模块依赖图是 watch 快的关键：改一个文件，Vitest 精确知道哪些测试受影响。
-->

---
transition: fade-out
---

# 安装与第一个测试

三步可跑

<v-click>

```bash
pnpm add -D vitest
# 测试 Vue 组件 / DOM 操作时再加
pnpm add -D jsdom      # API 完整，兼容性好
# 或 happy-dom         # 更快，部分 API 不完整
```

</v-click>

<v-click>

```ts
// src/math.test.ts
import { describe, expect, test } from "vitest";
import { add } from "./math";

describe("add", () => {
  test("两数相加", () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

</v-click>

<v-click>

```json
{ "scripts": { "test": "vitest", "test:run": "vitest run" } }
```

```bash
pnpm test        # watch 模式，改文件自动重跑
pnpm test:run    # 单次执行，CI 用
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 最小安装只需 vitest 本身，DOM 测试按需加 jsdom 或 happy-dom。

[click] 测试文件命名 *.test.ts 或 *.spec.ts，默认自动发现。
显式 import { test, expect } from "vitest" —— Vitest 默认不注入全局。

[click] 两个脚本：watch 模式开发用、run 模式 CI 用。
-->

---
transition: fade-out
---

# 常用 CLI 命令

`vitest run --coverage`

<v-click>

| 命令                          | 用途                        |
| ----------------------------- | --------------------------- |
| `vitest`                      | watch 模式（开发）          |
| `vitest run`                  | 单次执行（CI）              |
| `vitest --ui`                 | 可视化面板（需 @vitest/ui） |
| `vitest run --coverage`       | 覆盖率报告                  |
| `vitest -t "两数相加"`        | 按测试名过滤（支持正则）    |
| `vitest --changed`            | 只跑改动相关的测试          |
| `vitest run --shard=1/3`      | 分片，多机并行 CI           |

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 几个高频命令。
--changed 在大仓库里非常实用：只跑被本次改动影响的测试，反馈更快。
--shard 用于 CI 拆分任务到多台机器并行跑，显著缩短流水线时长。
-->

---
transition: fade-out
---

# 配置文件：vitest.config.ts

从 `vitest/config` 导入 `defineConfig`

<v-click>

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",        // node / jsdom / happy-dom
    globals: false,             // 是否注入全局 test/expect
    setupFiles: ["./src/test-setup.ts"],
    clearMocks: true,
    restoreMocks: true,
  },
});
```

</v-click>

<div v-click>

::: tip 从 `vitest/config` 而非 `vite` 导入
`vitest/config` 的 `defineConfig` 才有 `test` 字段的类型提示，是约定写法。
:::

</div>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 配置文件命名 vitest.config.ts，所有测试配置都在 test 字段下。
常用字段：environment 决定运行环境，setupFiles 在每个测试文件前执行。

[click] 关键区别：必须从 vitest/config 导入 defineConfig，才有 test 字段类型提示。
从 vite 导入的 defineConfig 没有 test 字段。
-->

---
transition: fade-out
---

# 配置：环境与全局 API

`environment` + `globals`

<v-click>

| 环境          | 适用场景                   | 特点                        |
| ------------- | -------------------------- | --------------------------- |
| `node`        | 纯逻辑、工具函数（默认）   | 无 DOM，最快                |
| `jsdom`       | Vue 组件、DOM 操作         | API 完整，较慢              |
| `happy-dom`   | 同上，追求速度             | 更快，部分 API 不完整       |

</v-click>

<v-click>

**单文件覆盖**（首行注释）：

```ts
// @vitest-environment jsdom
```

**开启全局 API**：

```ts
// vitest.config.ts  →  test: { globals: true }
// tsconfig.json  →  "types": ["vitest/globals"]
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 环境配置影响性能：纯逻辑测试用 node 最快；Vue 组件测试需要 jsdom 或 happy-dom。

[click] 单文件覆盖用首行注释，方便对个别文件指定不同环境。
globals: true 让你不用 import test/expect，适合从 Jest 迁移时减少改动。
-->

---
transition: fade-out
---

# 配置：复用 vite.config

`mergeConfig` 让 Vue 插件 / alias 只配一次

<v-click>

```ts
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: true,
    },
  }),
);
```

</v-click>

<div v-click>

这样 `@vitejs/plugin-vue`、`@` 路径 alias、`define` 等只写一次，测试与构建**完全同源**。

::: warning vite.config 导出函数时
若导出的是 `({ mode }) => ({...})` 函数，需在 `defineConfig((env) => mergeConfig(viteConfig(env), {...}))` 内调用后再合并。
:::

</div>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] mergeConfig 把两个配置对象深合并，是 Vue + Vite 项目的推荐写法。
所有 Vite 插件、alias 在测试里自动生效，再也不会遇到"测试环境找不到 @ 别名"。

[click] 如果 vite.config 导出函数（接收 mode 参数），要包一层 defineConfig 才能安全合并。
-->

---
transition: fade-out
---

# 配置：Mock 清理策略

`clearMocks` / `resetMocks` / `restoreMocks`

<v-click>

| 配置            | 清调用记录 | 重置实现 | 恢复原始实现   |
| --------------- | ---------- | -------- | -------------- |
| `clearMocks`    | ✅         | ❌       | ❌             |
| `resetMocks`    | ✅         | ✅       | ❌             |
| `restoreMocks`  | ✅         | ✅       | ✅（仅 spyOn） |

</v-click>

<v-click>

**推荐组合**：

```ts
test: {
  clearMocks: true,    // 清调用记录，保留实现（最常用）
  restoreMocks: true,  // 每次测试后恢复 spyOn 原始实现
}
```

测试间 mock 状态污染是高频坑，全局配置一次，免得每个用例手写 `afterEach`。

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三个配置语义层层递进：clear 只清记录，reset 还重置实现，restore 还恢复 spyOn 原始实现。

[click] 实践中最常用的是 clearMocks + restoreMocks 组合：既避免调用记录污染，又确保 spyOn 不影响下一个用例。
-->

---
transition: fade-out
---

# 测试 API：声明与修饰符

`describe` / `test` / `.skip` / `.only`

<v-click>

```ts
import { describe, test, it, expect } from "vitest";

describe("数组工具", () => {
  test("push 后长度 +1", () => {
    const arr: number[] = [];
    arr.push(1);
    expect(arr).toHaveLength(1);
  });
  it("it 是 test 的别名", () => expect(true).toBe(true));
});
```

</v-click>

<v-click>

```ts
test.skip("暂时跳过", () => {});
test.only("本文件只跑这个", () => {}); // 别提交！
test.todo("待实现，占位不报错");
test.fails("预期失败，通过反而报错", () => expect(1).toBe(2));
test.skipIf(process.env.CI)("本地跳过", () => {});
test.runIf(process.env.CI)("只在 CI 跑", () => {});
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] test 和 it 完全等价，按团队习惯选一个。describe 可嵌套，组织层级。

[click] 修饰符很实用：skipIf / runIf 让同一套测试在不同环境有不同行为。
.only 别提交进仓库——CI 里用 --allowOnly=false 强制报错防止误提交。
-->

---
transition: fade-out
---

# 测试 API：钩子

`beforeAll` / `afterAll` / `beforeEach` / `afterEach`

<v-click>

```ts
describe("生命周期", () => {
  beforeAll(async () => { /* 组内所有测试前运行一次 */ });
  afterAll(async () => { /* 组内所有测试后运行一次 */ });
  beforeEach(() => { /* 每个测试前 */ });
  afterEach(() => { /* 每个测试后 */ });
  test("...", () => {});
});
```

</v-click>

<v-click>

**Vitest 特性**：`beforeEach` 可 return 清理函数（Jest 没有）

```ts
beforeEach(() => {
  const server = startServer();
  return () => server.close(); // 自动作为 afterEach 执行
});
```

把"建立"和"销毁"写在一起，避免共享变量在两个钩子间穿梭。

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 四个钩子分两层：All 是组级一次，Each 是用例级每次。
钩子里可以 async/await。

[click] return 清理函数是 Vitest 独有特性，把"初始化 + 清理"凑在一起写，代码更内聚。
比 afterEach 里再引用变量更不容易出错。
-->

---
transition: fade-out
---

# 测试 API：参数化 test.each

同一逻辑跑多组数据

<v-click>

```ts
// 数组写法：位置占位符 %i / %s
test.each([
  [1, 1, 2],
  [2, 3, 5],
])("add(%i, %i) = %i", (a, b, expected) => {
  expect(a + b).toBe(expected);
});
```

</v-click>

<v-click>

```ts
// 对象写法：$ 命名占位符（可读性更好）
test.each([
  { a: 1, b: 1, expected: 2 },
  { a: 2, b: 3, expected: 5 },
])("add($a, $b) = $expected", ({ a, b, expected }) => {
  expect(a + b).toBe(expected);
});
```

</v-click>

<v-click>

`describe.each` 同理，可参数化整个 describe 块：适合"同一组测试跑多个环境"。

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] test.each 第一个参数是数据集，第二个是测试名模板，第三个是测试函数。

[click] 对象写法可读性更好，$a $b 直接对应字段名，一眼看出测什么数据。

[click] describe.each 适合"同一套断言对多个场景（dev/prod 环境、不同数据库）跑"。
-->

---
transition: fade-out
---

# 测试 API：test.for（v4）与并发

`test.for` + `test.concurrent`

<v-click>

**test.for（v4 新增）**：不展开数组，整组作第一参数，并能拿到测试上下文：

```ts
// 并发 + 快照：必须用 context.expect 才能正确关联
test.concurrent.for([[1], [2]])("case %i", ([n], { expect }) => {
  expect(n).toMatchSnapshot();
});
```

</v-click>

<v-click>

**并发测试**：

```ts
describe("并发组", () => {
  test("顺序", async () => {});
  test.concurrent("并行 1", async () => {});
  test.concurrent("并行 2", async () => {});
});
```

并发测试里的快照**必须**用 `({ expect })` 上下文取 `expect`，否则快照会错配。

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] test.for 是 v4 新增的，与 test.each 区别在于不自动展开数组，更适合需要拿上下文的场景。
并发快照必须用 context.expect，这是最常踩的坑。

[click] test.concurrent 让多个测试并行执行，减少总耗时。
但注意：并发测试不能共享可变状态，否则测试间互相干扰。
-->

---
transition: fade-out
---

# 测试 API：夹具（Fixtures）

`test.extend` 封装可复用的准备-注入-清理

<v-click>

```ts
const test = base.extend({
  server: async ({}, use) => {
    const srv = await startServer({ port: 3000 });
    await use(srv);    // 把值交给测试
    await srv.close(); // use 之后是清理
  },
});

test("按需启动 server", async ({ server }) => {
  expect(server.listening).toBe(true);
});
```

</v-click>

<v-click>

**作用域控制**（避免重复创建昂贵资源）：

```ts
const test = base.extend({
  db: [async ({}, use) => { /* ... */ }, { scope: "file" }],
  // scope: "file" 整个文件共享一个 db 实例
  // scope: "worker" 整个 worker 进程共享
});
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] test.extend 是 Vitest 最强大的特性之一：把"初始化 + 注入 + 清理"封装成夹具。
use() 之前是初始化，await use(值) 交给测试，use() 之后是清理，自动在测试结束后执行。

[click] scope 控制实例共享范围，"file" 级别可以避免数据库连接被重复创建和关闭，大幅提速。
-->

---
transition: fade-out
---

# 断言：相等与基础 matchers

`toBe` / `toEqual` / `toStrictEqual`

<v-click>

```ts
expect(1 + 1).toBe(2);                          // Object.is，原始值 / 同一引用
expect({ a: 1 }).toEqual({ a: 1 });             // 递归深比较，忽略 undefined 属性
expect({ a: 1, b: undefined }).toStrictEqual(   // undefined 与类型也纳入比较
  { a: 1, b: undefined }
);
```

</v-click>

<v-click>

```ts
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect("x").toBeTruthy();
expect(0).toBeFalsy();
expect(0.1 + 0.2).toBeCloseTo(0.3, 5); // 浮点数，避免精度误差

expect("hello world").toContain("world");
expect([1, 2, 3]).toHaveLength(3);
expect({ name: "Alice" }).toHaveProperty("name", "Alice");
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三个相等 matcher 语义递进：toBe 比引用/原始值，toEqual 深比较，toStrictEqual 连 undefined 和类型差异也检查。
对象比内容用 toEqual，别用 toBe。

[click] 常用 matchers 基本对齐 Jest，迁移成本极低。
toBeCloseTo 是浮点数比较的必备：0.1 + 0.2 !== 0.3。
-->

---
transition: fade-out
---

# 断言：错误、Promise 与非对称 matchers

`toThrowError` / `resolves` / `expect.objectContaining`

<v-click>

```ts
// 错误断言
expect(() => JSON.parse("{bad}")).toThrowError(SyntaxError);
expect(() => risky()).toThrowError(/timeout/);

// Promise
await expect(Promise.resolve(42)).resolves.toBe(42);
await expect(Promise.reject(new Error("fail"))).rejects.toThrow("fail");
```

</v-click>

<v-click>

```ts
// 非对称 matchers —— 只断言"部分结构"
expect({ id: 1, name: "Alice", ts: Date.now() }).toEqual(
  expect.objectContaining({ name: "Alice" })
);
expect([1, 2, 3]).toEqual(expect.arrayContaining([1, 3]));
expect(42).toEqual(expect.any(Number));
expect({}).toEqual(expect.anything()); // 非 null/undefined 即可
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Promise 断言必须 await，否则测试结束前断言还没执行，造成漏报。
resolves / rejects 是 Promise 专用语法糖，别忘了加 await。

[click] 非对称 matchers 在测 API 响应时非常实用：只关注你关心的字段，忽略 timestamp / id 等动态值。
-->

---
transition: fade-out
---

# 断言：expect.soft 与类型测试

累积断言 + 类型层面验证

<v-click>

**`expect.soft`** — 失败不停，收集所有失败后统一报告：

```ts
test("多处断言都跑完", () => {
  expect.soft(result.code).toBe(200);   // 失败也继续
  expect.soft(result.msg).toBe("ok");   // 失败也继续
  expect.soft(result.data).toBeDefined();
});
```

</v-click>

<v-click>

**类型测试** — 在类型层面断言（需 `vitest --typecheck`，不在运行时执行）：

```ts
import { expectTypeOf } from "vitest";

expectTypeOf(42).toBeNumber();
expectTypeOf({ a: 1 }).toEqualTypeOf<{ a: number }>();

function greet(name: string): string { return `Hi, ${name}`; }
expectTypeOf(greet).parameter(0).toBeString();
expectTypeOf(greet).returnType.toBeString();
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] expect.soft 适合表单校验、API 响应等"想一次看到所有问题"的场景。
普通 expect 碰到第一个失败就停；soft 全部跑完再汇总。

[click] 类型测试保护"类型契约"不被改坏，尤其适合工具类型和泛型推断。
注意：运行时不执行，纯粹是 TS 类型检查，需要 --typecheck 开关。
-->

---
transition: fade-out
---

# Mock(1)：vi.fn 与 vi.spyOn

造函数 + 监视已有方法

<v-click>

```ts
import { vi, expect, test } from "vitest";

test("vi.fn —— 记录调用 + 设定返回", () => {
  const fn = vi.fn().mockReturnValue("Hi");
  expect(fn("a", 1)).toBe("Hi");
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith("a", 1);
});

const once = vi.fn().mockReturnValueOnce("first").mockReturnValue("default");
const fetchUser = vi.fn().mockResolvedValue({ id: 1 }); // 异步
```

</v-click>

<v-click>

```ts
// vi.spyOn —— 替换已有对象的方法，保留或覆盖实现
const utils = { now: () => Date.now() };
const spy = vi.spyOn(utils, "now").mockReturnValue(1000);
expect(utils.now()).toBe(1000);
spy.mockRestore(); // 恢复原实现

// v4：using 关键字，离开作用域自动 restore
using spy2 = vi.spyOn(console, "log").mockImplementation(() => {});
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] vi.fn 是最基础的 mock：创建一个可控函数，记录调用次数和参数，并设定返回值。
Once 变体让第一次调用返回特殊值，之后恢复默认。

[click] vi.spyOn 针对已有对象的方法，适合不想完全替换而只是"监视 + 可选覆盖"的场景。
v4 的 using 关键字利用 ES 显式资源管理，离开作用域自动 restore，非常优雅。
-->

---
transition: fade-out
---

# Mock(2)：vi.mock 提升与 vi.hoisted

最容易踩坑的 mock 特性

<v-click>

`vi.mock` **会被提升到文件所有 `import` 之前执行**：

```ts
import { getUser } from "./api"; // 拿到的是 mock 后的版本

vi.mock("./api", () => ({
  getUser: vi.fn().mockResolvedValue({ id: 1 }),
}));
```

</v-click>

<v-click>

**坑**：factory 里不能直接用外部变量（提升后变量还未定义）

```ts
const MOCK = "test";
vi.mock("./mod", () => ({ value: MOCK })); // ❌ ReferenceError
```

**解法**：`vi.hoisted` 把变量也提上去：

```ts
const mocks = vi.hoisted(() => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1 }),
}));
vi.mock("./api", () => ({ fetchUser: mocks.fetchUser }));
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] vi.mock 的提升是 Vitest 最独特也最易踩坑的特性。
不管你把 vi.mock 写在文件哪一行，它都在所有 import 之前执行。
所以导入进来的 getUser 已经是 mock 版本了。

[click] 提升带来的副作用：factory 执行时文件里的变量还没初始化。
vi.hoisted 是配套解法：把需要在 factory 里用的变量也提升到同一时间点。
-->

---
transition: fade-out
---

# Mock(3)：vi.doMock、vi.mocked 与假定时器

条件 mock + 类型安全 + 时间控制

<v-click>

**vi.doMock**（不提升，配合动态 import）：

```ts
test("条件 mock", async () => {
  vi.doMock("./config", () => ({ env: "test" }));
  const { env } = await import("./config"); // 必须动态 import
  expect(env).toBe("test");
  vi.doUnmock("./config");
});
```

</v-click>

<v-click>

**假定时器**（控制 `setTimeout` / `Date`）：

```ts
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test("快进时间触发回调", () => {
  const cb = vi.fn();
  setTimeout(cb, 1000);
  vi.advanceTimersByTime(1000); // 直接快进，不必真等
  expect(cb).toHaveBeenCalledTimes(1);
});
// 另：vi.setSystemTime(new Date("2026-01-01"))
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] vi.doMock 不提升，适合"根据条件决定用哪个 mock"的场景。
但代价是必须配合动态 import，因为模块只有在 doMock 之后 import 才能拿到 mock 版本。

[click] 假定时器把 setTimeout/Date 的控制权交给 Vitest。
advanceTimersByTime 直接快进 n 毫秒，测试"3 秒后的回调"不需要真等 3 秒。
setSystemTime 可以固定当前时间，测试日期相关逻辑很实用。
-->

---
transition: fade-out
---

# 从 Jest 迁移

API 映射与关键差异

<v-click>

| Jest                      | Vitest                          | 注意                    |
| ------------------------- | ------------------------------- | ----------------------- |
| `jest.fn()` / `spyOn()`   | `vi.fn()` / `spyOn()`           | 同名                    |
| `jest.mock()`             | `vi.mock()`                     | factory 格式有差异      |
| `jest.requireActual()`    | `await vi.importActual()`       | **异步**，必须 await    |

</v-click>

<v-click>

**最易踩：factory 必须返回对象**

```ts
// ❌ Jest 可以直接返回值
jest.mock("./path", () => "hello");
// ✅ Vitest 必须返回模块对象，默认导出写 default
vi.mock("./path", () => ({ default: "hello" }));
```

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] API 映射总体很直接：全局替换 jest. → vi. 就能跑通大部分。
最大的差异是 requireActual 变成了异步的 importActual，必须 await。

[click] factory 返回格式是迁移最易错的点：Jest 可以直接返回值，Vitest 必须返回模块对象。
默认导出写在 default 键下。
-->

---
transition: fade-out
---

# 从 Jest 迁移：步骤与其他差异

5 步完成迁移

<v-click>

1. 安装 `vitest` + 按需加 `jsdom` / `@vitest/coverage-v8`
2. 新建 `vitest.config.ts`（或 `mergeConfig` 进 `vite.config.ts`）
3. 全局替换 `jest.` → `vi.`，`requireActual` → `await vi.importActual`
4. 修正 `vi.mock` factory 返回对象格式，`done` 回调改 `async/await`
5. `package.json` 脚本 `jest` → `vitest run`，CI 跑通后删 jest 依赖

</v-click>

<v-click>

**其他差异**：

- `done` 回调不支持 → 改 `async / await`
- `__mocks__` 不自动加载 → 必须显式 `vi.mock("模块名")`
- ESM 无需 `unstable_mockModule`，直接 `vi.mock` 即可

</v-click>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 5 步迁移是实践总结，按顺序来最稳。第 3 步的全局替换可以用 IDE 的 Find & Replace。

[click] done 回调是 Jest 老写法，Vitest 不支持，必须改成 async/await 或 return Promise。
__mocks__ 目录需要显式 vi.mock 激活，这点和 Jest 行为不同要注意。
ESM 场景是 Vitest 的优势：原生支持，不需要 Jest 的 unstable_mockModule 体操。
-->

---
layout: intro
transition: fade-out
---

# 总结

Vitest = Vite 管线 + Jest 兼容 + 极速 watch

- **安装即用**：复用 `vite.config`，alias / plugin 一行不用重写
- **API 熟悉**：`describe` / `test` / `expect` matchers 与 Jest 高度兼容
- **Mock 完整**：`vi.fn` / `vi.spyOn` / `vi.mock` 提升 + `vi.hoisted` 解决变量问题
- **断言增强**：`expect.soft` 累积报告 + `expectTypeOf` 类型层面验证
- **迁移简单**：5 步从 Jest 迁过来，原生 ESM 无痛

<div class="abs-br m-6 text-xl">
  <a href="https://vitest.dev" target="_blank" class="slidev-icon-btn">
    <logos:vitest />
  </a>
  <a href="https://github.com/vitest-dev/vitest" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/frontend-develop-tools/testing/unit-testing/vitest/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #729B1B;
  background-image: linear-gradient(45deg, #729B1B 10%, #ACD16A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Vitest 的全部精华浓缩在五条：
- 零配置：复用 vite.config 是最大卖点
- API 熟悉：从 Jest 迁过来几乎不用重新学
- Mock 提升是最大的概念差，vi.hoisted 是配套解法
- expect.soft 和类型测试是 Vitest 对 Jest 的超越
- 迁移成本低，5 步可完成

每个 Vue + Vite 项目都该用 Vitest 替代 Jest。
-->

---
layout: end
---
