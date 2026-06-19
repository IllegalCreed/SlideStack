---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Jest
info: |
  Presentation Jest for developers.

  Learn more at [https://jestjs.io/](https://jestjs.io/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:jest class="text-8xl" />
</div>

<br/>

## Jest：开箱即用的老牌测试框架

一体集成 · CJS-first · 快照鼻祖 · RN 事实标准（基于 v30.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Jest —— Facebook 出品的老牌测试框架，也是整个 JS 测试生态的奠基者之一。

它开箱即用：运行器、断言、mock、快照、覆盖率全打包在一起，安装即可用，无需拼装。
Jest 30（2025-06）带来了 Rust 解析器加持，大型 TS 项目耗时 -37%、内存 -77%。
-->

---
transition: fade-out
---

# 什么是 Jest？

开箱即用的 JavaScript 测试框架

<v-click>

- **一体集成**：运行器 + `expect` 断言 + mock + 快照 + 覆盖率，安装即用无需拼装
- **CJS-first**：每个测试文件跑在独立 VM context，`jest.mock` 由 Babel 自动提升
- **快照鼻祖**：`toMatchSnapshot` 的 `.snap` 格式被 Vitest 等框架沿用至今
- **RN 标杆**：React Native 官方 preset 基于 Jest，Metro 生态首选

</v-click>

<v-click>

- **Jest 30 提速**：Rust 模块解析（unrs-resolver），大型 TS 项目 -37% 耗时、-77% 内存

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Jest 的核心卖点是"一体"——你不用单独选测试运行器、再选断言库、再配 mock 工具。
这套组合在 CRA、webpack、React Native 项目里几乎是默认标配。

[click] Jest 30 是 2025 年 6 月发布的重大版本，Rust 解析器让大型项目的内存占用大幅下降。
-->

---
transition: fade-out
---

# Jest vs Vitest：何时选谁？

适用场景对比

<v-click>

| 维度              | Jest 30                        | Vitest                       |
| ----------------- | ------------------------------ | ---------------------------- |
| Vite 项目         | **不支持**（官方明确）         | 原生，复用 vite.config       |
| ESM               | experimental，需 flag          | 原生支持                     |
| React Native      | **官方首选**，RN preset 内置   | 不适用                       |
| 存量 Jest 套件    | 直接用，Jest 30 已大幅提速     | 迁移有成本                   |
| 非 Vite 项目      | webpack / CRA 首选             | 优势不明显                   |

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 选型原则很简单：Vite 项目用 Vitest，React Native 用 Jest，存量 Jest 套件不急迁移。
本场景里你会写 Vue 3 + Vite，所以 Vitest 是首选；Jest 的价值在于理解历史和存量维护。
-->

---
transition: fade-out
---

# 安装与第一个测试

三步可跑

<v-click>

```bash
pnpm add -D jest
# DOM 测试需单独安装（自 Jest 28 起不再内置）
pnpm add -D jest-environment-jsdom
```

</v-click>

<v-click>

```ts
// src/math.test.ts
import { describe, expect, test } from "@jest/globals";
import { add } from "./math";

describe("add", () => {
  test("两数相加", () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

</v-click>

<v-click>

```bash
jest              # 跑全部测试
jest --watch      # 监听模式（只跑变更相关）
jest --coverage   # 覆盖率
jest -u           # 更新快照
```

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] jest-environment-jsdom 自 v28 起从 Jest 核心包中拆出，需单独安装，新手常忘。

[click] 推荐从 @jest/globals 显式导入，类型随 Jest 版本同步更新，比 @types/jest 第三方包更准。

[click] 两个常用模式：watch 给开发用，--coverage 给 CI 门禁用。-u 更新快照，变更预期后跑一次。
-->

---
transition: fade-out
---

# TypeScript：ts-jest vs babel-jest

两种转换方案，二选一

<v-click>

**方案 A：ts-jest（带类型检查，慢一点）**

```ts
// jest.config.ts
import { defineConfig } from "jest";
export default defineConfig({
  preset: "ts-jest",
  testEnvironment: "node",
});
```

</v-click>

<v-click>

**方案 B：babel-jest（只剥类型，更快）**

```js
// babel.config.js
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
};
```

类型错误不会让测试失败，交给 `tsc` / IDE 处理。

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] ts-jest 会在跑测试时做 TS 类型检查，类型错误直接让测试失败——更安全但更慢。
追求稳健用 ts-jest，追求速度用 babel-jest。

[click] babel-jest 是 Jest 的默认 transform，只把 TS 语法转成 JS、不校验类型。
速度快，但类型问题要靠 tsc 单独发现。
-->

---
transition: fade-out
---

# 配置文件：jest.config.ts

Jest 30 原生支持 TS 配置

<v-click>

```ts
import { defineConfig } from "jest";

export default defineConfig({
  testEnvironment: "jsdom",         // node（默认）/ jsdom
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // 对应 tsconfig paths
    "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js",
  },
  clearMocks: true,
  restoreMocks: true,
});
```

</v-click>

<v-click>

- `setupFilesAfterEnv`：框架就绪后、每个测试文件前运行（可 async）
- `moduleNameMapper`：路径别名 + 静态文件 mock
- Jest 30 起 `setupFilesAfterEnv` 支持顶层 `await`

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] defineConfig 从 "jest" 包直接导入，带完整类型提示，Jest 30 原生支持，不需要额外工具。
moduleNameMapper 用正则映射路径别名，对应 tsconfig 的 paths，避免"找不到 @/ 模块"。

[click] setupFilesAfterEnv 是配置 @testing-library/jest-dom 等断言扩展的地方。
Jest 30 支持顶层 await，可以在 setup 文件里做异步初始化。
-->

---
transition: fade-out
---

# 配置：Mock 清理与覆盖率

`clearMocks` / `restoreMocks` + 覆盖率引擎

<v-click>

| 配置             | 清调用记录 | 移除实现 | 恢复原始实现   |
| ---------------- | ---------- | -------- | -------------- |
| `clearMocks`     | ✅         | ❌       | ❌             |
| `resetMocks`     | ✅         | ✅       | ❌             |
| `restoreMocks`   | ✅         | ✅       | ✅（仅 spyOn） |

</v-click>

<v-click>

```ts
export default defineConfig({
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
  coverageProvider: "v8", // 或 "babel"（默认）
  testEnvironmentOptions: {
    globalsCleanup: "on", // Jest 30 新增，大幅省内存
  },
});
```

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三个 mock 清理策略语义层层递进。推荐 clearMocks + restoreMocks 组合：清记录 + 恢复 spyOn。
避免每个 afterEach 手写 mockRestore，全局配置一次搞定。

[click] globalsCleanup: "on" 是 Jest 30 的新开关，对大型项目内存效果显著，配上就对了。
覆盖率引擎 v8 直接使用 Node 内置插桩，babel 兼容性更好但速度稍慢。
-->

---
transition: fade-out
---

# 测试 API：声明与修饰符

`describe` / `test` / `.skip` / `.only`

<v-click>

```ts
import { describe, test, it, expect } from "@jest/globals";

describe("Calculator", () => {
  test("加法正确", () => {
    expect(1 + 2).toBe(3);
  });
  it("it 是 test 的别名", () => expect(true).toBe(true));
});
```

</v-click>

<v-click>

```ts
test.skip("暂时跳过", () => {});
test.only("本文件只跑这个", () => {}); // 别提交！
test.todo("待实现，仅占位显示为 todo");
```

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] test 和 it 完全等价，按团队风格选一个统一使用，describe 可嵌套组织层级。
推荐从 @jest/globals 显式导入，不依赖注入全局。

[click] .only 是调试利器但严禁提交——它会静默跳过同文件其他用例，CI 配 --ci 强制报错防止误入。
.todo 只是占位，不会报错，适合"打算写但还没写"的用例。
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

Jest 30 新增 `%$` 注入序号，便于定位第几条失败用例：`"Case %$ 通过"`

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] test.each 避免重复写相同断言逻辑，第一个参数是数据集，第二个是测试名模板。

[click] 对象写法 $name 可读性更好，一眼看出测什么数据，推荐日常优先用对象写法。

[click] Jest 30 新增 %$，报错时能看到"Case 3 失败"，比"Case [object Object] 失败"有用多了。
describe.each 同理可参数化整个 describe 块。
-->

---
transition: fade-out
---

# 测试 API：钩子执行顺序

面试高频点

<v-click>

```ts
beforeAll(() => console.log("1 - beforeAll"));
afterAll(() => console.log("1 - afterAll"));
beforeEach(() => console.log("1 - beforeEach"));
afterEach(() => console.log("1 - afterEach"));

test("外层", () => console.log("1 - test"));

describe("内层", () => {
  beforeAll(() => console.log("2 - beforeAll"));
  beforeEach(() => console.log("2 - beforeEach"));
  test("内层 test", () => console.log("2 - test"));
});
```

</v-click>

<v-click>

执行顺序：`1-beforeAll` → `1-beforeEach` → `1-test` → `1-afterEach` → `2-beforeAll` → `1-beforeEach` → `2-beforeEach` → `2-test` → `1-afterEach` → `2-afterAll` → `1-afterAll`

**要点**：内层 `test` 也会触发外层 `beforeEach` / `afterEach`

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 钩子嵌套顺序是面试常考点，记住规则：外层 beforeEach 先于内层，外层 afterEach 后于内层。

[click] 内层 test 会触发所有外层的 beforeEach/afterEach，这点和直觉一致但容易忘。
beforeAll 从外到内，afterAll 从内到外——对称的。
-->

---
transition: fade-out
---

# 断言：基础 matchers

`toBe` / `toEqual` / `toStrictEqual`

<v-click>

```ts
expect(1 + 1).toBe(2);                           // Object.is，原始值 / 同一引用
expect({ a: 1 }).toEqual({ a: 1 });              // 深比较，忽略 undefined 属性
expect({ a: 1, b: undefined }).toStrictEqual(
  { a: 1, b: undefined }                         // undefined 与类型纳入比较
);
```

</v-click>

<v-click>

```ts
expect(null).toBeNull();
expect("hello world").toContain("world");
expect("hello").toMatch(/ell/);
expect(0.1 + 0.2).toBeCloseTo(0.3, 5);          // 浮点数专用
expect([{ id: 1 }]).toContainEqual({ id: 1 });   // 深度包含
expect(obj).toHaveProperty("a.b", 1);            // 嵌套属性
expect(obj).toMatchObject({ a: 1 });             // 部分匹配
```

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三个相等 matcher 语义递进：toBe 比引用，toEqual 深比较，toStrictEqual 更严格。
对象比内容永远用 toEqual，不要用 toBe。

[click] toBeCloseTo 是浮点数必备，0.1 + 0.2 !== 0.3 在 JS 里是真实存在的问题。
toMatchObject 做部分匹配，只关心你指定的字段，其余忽略。
-->

---
transition: fade-out
---

# 断言：错误、Promise 与非对称

`toThrow` / `resolves` / `expect.objectContaining`

<v-click>

```ts
// 错误断言
expect(() => JSON.parse("{bad}")).toThrow(SyntaxError);
expect(() => risky()).toThrow("timeout");

// Promise
await expect(Promise.resolve("ok")).resolves.toBe("ok");
await expect(Promise.reject(new Error("fail"))).rejects.toThrow("fail");
```

</v-click>

<v-click>

```ts
// 非对称 matchers —— 只断言"部分结构"
expect(user).toEqual(
  expect.objectContaining({
    name: expect.any(String),
    tags: expect.arrayContaining(["admin"]),
  })
);
// Jest 30 新增：验证数组每个元素满足条件
expect([1, 2, 3]).toEqual(expect.arrayOf(expect.any(Number)));
```

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Promise 断言必须 await，否则测试结束前断言还没执行，造成漏报——这是高频坑。

[click] 非对称 matchers 测 API 响应时非常实用：只断言关心的字段，时间戳 / id 等动态字段直接跳过。
Jest 30 新增 arrayOf，可以一行断言数组所有元素的类型，比 forEach 写法简洁。
-->

---
transition: fade-out
---

# 快照测试

Jest 是快照的鼻祖

<v-click>

**外部快照**：首次运行生成 `.snap` 文件并提交 git，之后每次比对

```ts
it("渲染正确", () => {
  const tree = render(<Component />);
  expect(tree.container.firstChild).toMatchSnapshot();
});
```

</v-click>

<v-click>

**内联快照**：自动写入调用处，代码和快照在同一文件

```ts
expect(value).toMatchInlineSnapshot();
// 首次运行后，Jest 自动把快照填进括号里
```

</v-click>

<v-click>

**处理动态字段**：用非对称 matcher 跳过时间戳 / id

```ts
expect(user).toMatchSnapshot({
  createdAt: expect.any(Date),
  id: expect.any(Number),
});
```

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 快照测试适合"结构稳定、内容复杂"的输出——组件 HTML、序列化对象。
.snap 文件要提交 git，review 时能看到快照变化，是有意义的 diff。

[click] 内联快照把值写在代码旁边，小型测试用更直观，不用跳到 .snap 文件去看。

[click] 动态字段是快照的常见挑战：每次跑都不同的时间戳、id 会导致快照失败。
用非对称 matcher 声明"这个字段是 Date 类型就行"，绕过动态值。
-->

---
transition: fade-out
---

# Mock（1）：jest.fn 与 jest.spyOn

造函数 + 监视已有方法

<v-click>

```ts
import { jest, expect, test } from "@jest/globals";

const fn = jest.fn().mockReturnValue("Hi");
fn("a", 1);
expect(fn).toHaveBeenCalledWith("a", 1);
expect(fn.mock.calls).toEqual([["a", 1]]);

const once = jest.fn().mockReturnValueOnce("first").mockReturnValue("def");
const fetchUser = jest.fn().mockResolvedValue({ id: 1 }); // 异步
```

</v-click>

<v-click>

```ts
// jest.spyOn：监视已有对象方法，默认仍调用原实现
const spy = jest.spyOn(video, "play");
video.play();
expect(spy).toHaveBeenCalled();

// Jest 30：using 关键字，块结束自动 restore
test("自动恢复", () => {
  using spy = jest.spyOn(console, "warn");
  // ...
}); // 自动 restore，无需 afterEach
```

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] jest.fn 是最基础的 mock：创建可控函数、记录调用、设定返回值。
.mock.calls 是个数组，每次调用的参数列表都存在里面，可以用来断言调用历史。

[click] jest.spyOn 针对已有对象方法，默认不改变实现只是监视。
Jest 30 支持 using 关键字（ES 显式资源管理），代码块结束自动 restore，比 afterEach 更内聚。
-->

---
transition: fade-out
---

# Mock（2）：jest.mock 提升

CJS 下 Babel 自动提升到 import 之前

<v-click>

`jest.mock` 被 Babel 插件**提升到文件所有 `import` 之前**执行：

```ts
import axios from "axios"; // 拿到的已是 mock 版本

jest.mock("axios"); // automock：所有方法变 jest.fn()

test("拦截请求", async () => {
  axios.get.mockResolvedValue({ data: [{ name: "Bob" }] });
  // ...
});
```

</v-click>

<v-click>

`jest.requireActual`：在 factory 内同步取回原始模块（**无需 await**）

```ts
jest.mock("../myModule", () => {
  const original = jest.requireActual("../myModule"); // 同步！
  return {
    __esModule: true,
    ...original,
    getRandom: jest.fn(() => 10), // 只覆盖这一个
  };
});
```

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] jest.mock 提升是 Jest 最重要的特性：无论写在文件哪一行，都在所有 import 之前执行。
所以 import 进来的 axios 已经是 mock 后的版本，这就是它的魔法。

[click] requireActual 是 Jest 的同步 API——这与 Vitest 的 await vi.importActual 是关键差异。
在 factory 里可以直接 const x = jest.requireActual(...)，不需要 async/await。
-->

---
transition: fade-out
---

# Mock（3）：`__mocks__` 自动加载

Jest 独有的手动 mock 机制

<v-click>

```
project/
├── __mocks__/
│   ├── lodash.js     # node_modules 包 → 自动加载，无需 jest.mock
│   └── fs.js         # Node 内置 → 仍需 jest.mock("fs")
└── models/
    ├── __mocks__/
    │   └── user.js   # 用户模块 → 需显式 jest.mock("./user")
    └── user.js
```

</v-click>

<v-click>

- `node_modules` 旁的 `__mocks__`：第三方包**自动加载**，无需 `jest.mock("lodash")`
- 用户模块旁的 `__mocks__`：仍需显式 `jest.mock("./user")` 启用
- Node 内置（`fs` / `path`）：有 mock 文件也要显式 `jest.mock("fs")`
- **Vitest 无此机制**，全部需要显式 `vi.mock`

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] __mocks__ 目录是 Jest 独有的手动 mock 机制，Vitest 没有。
第三方包的 mock 文件放在根目录 __mocks__ 旁边 node_modules，会自动生效。

[click] 规则要记清：自动加载只对 node_modules 旁的第三方包生效。
Node 内置和用户模块的 mock 文件需要显式 jest.mock 触发。
从 Jest 迁到 Vitest 时，这个差异最容易踩坑——Vitest 里一切都要显式。
-->

---
transition: fade-out
---

# Mock（4）：假定时器

控制 `setTimeout` / `Date`

<v-click>

```ts
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test("1 秒后触发回调", () => {
  const cb = jest.fn();
  setTimeout(cb, 1000);
  jest.advanceTimersByTime(1000); // 精确推进
  expect(cb).toHaveBeenCalledTimes(1);
});
```

</v-click>

<v-click>

```ts
// 固定初始时间 + 排除特定 API
jest.useFakeTimers({
  now: new Date("2026-01-01"),
  doNotFake: ["performance"],
});

// Jest 30 新增：推进到下一 requestAnimationFrame 帧（约 16ms）
jest.advanceTimersToNextFrame();
```

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 假定时器让时间控制权交给 Jest，不用真等 setTimeout。
advanceTimersByTime(1000) 直接跳过 1 秒，测试瞬间完成。

[click] 固定时间对测试日期逻辑很实用：把 new Date() 锁到 2026-01-01，确保测试结果稳定。
Jest 30 新增 advanceTimersToNextFrame，测 rAF 动画很方便。
-->

---
transition: fade-out
---

# ESM 支持（experimental）

CJS 是默认，ESM 需额外配置

<v-click>

**启用 ESM**：

```bash
# 禁用代码转换（或让 transformer 输出 ESM）
# jest.config.mjs → export default { transform: {} }

NODE_OPTIONS="--experimental-vm-modules" npx jest
```

</v-click>

<v-click>

**ESM 下 mock 必须改写**（`jest.mock` 不提升）：

```ts
import { jest } from "@jest/globals";

jest.unstable_mockModule("node:child_process", () => ({
  execSync: jest.fn(),
}));

// 必须动态 import，且在 unstable_mockModule 之后
const { execSync } = await import("node:child_process");
```

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Jest 的 ESM 支持至今仍是 experimental，需要 Node flag。这是 Vitest 对 Jest 最大的优势之一。

[click] ESM 下 jest.mock 的提升不生效，必须改用 unstable_mockModule，并且必须配合动态 import。
工厂函数变成了必填（CJS 下可省略），factory 也支持 async 了。
-->

---
transition: fade-out
---

# 对照 Vitest：关键差异速查

迁移必看

<v-click>

| 维度                | Jest 30                         | Vitest                          |
| ------------------- | ------------------------------- | ------------------------------- |
| `requireActual`     | **同步** `jest.requireActual`   | **异步** `await vi.importActual` |
| `__mocks__` 自动    | node_modules 旁**自动加载**     | **无**，全部显式 `vi.mock`      |
| ESM mock            | `jest.unstable_mockModule`      | 直接 `vi.mock`                  |
| 假定时器            | `jest.useFakeTimers`            | `vi.useFakeTimers`（同名）      |
| 快照                | `.snap`（鼻祖）                 | 兼容同格式                      |
| Vite 集成           | **不支持**                      | 原生                            |

</v-click>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 迁移最容易踩的三个坑：
1. requireActual 同步 vs 异步——Jest 里直接调，Vitest 里要 await
2. __mocks__ 自动加载——Vitest 里全部显式触发
3. ESM 场景——Vitest 直接支持，Jest 需要 unstable_mockModule 体操

大部分 API 同名（假定时器、断言 matchers），全局替换 jest. → vi. 能跑通大部分。
-->

---
layout: intro
transition: fade-out
---

# 总结

Jest = 一体集成 · CJS-first · 快照鼻祖 · RN 标杆

- **开箱即用**：运行器 + 断言 + mock + 快照 + 覆盖率全打包，安装即用
- **快照鼻祖**：`toMatchSnapshot` 设计被全生态沿用，`.snap` 格式是事实标准
- **Mock 核心**：`jest.fn` / `jest.mock` 自动提升 / `__mocks__` 自动加载 / `requireActual` 同步
- **Jest 30**：Rust 解析 + `using` 自动恢复 + `advanceTimersToNextFrame`
- **选型**：Vite 项目用 Vitest；React Native / 非 Vite / 存量套件 → Jest

<div class="abs-br m-6 text-xl">
  <a href="https://jestjs.io" target="_blank" class="slidev-icon-btn">
    <logos:jest />
  </a>
  <a href="https://github.com/jestjs/jest" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/frontend-develop-tools/testing/unit-testing/jest/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #C21325;
  background-image: linear-gradient(45deg, #C21325 10%, #FF6B6B 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Jest 的全部精华浓缩在五条：
- 一体集成是最大卖点，新手不用拼工具链
- 快照测试是 Jest 发明的，理解它对理解整个测试生态很有价值
- Mock 三件套：jest.fn 造函数、jest.mock 提升模块、__mocks__ 自动加载——这是 Jest 区别于 Vitest 的独特机制
- Jest 30 的性能改进让存量项目继续留下有了更充分的理由
- 选型要清醒：Vite 项目别用 Jest，RN 项目别换 Vitest

学好 Jest 也是理解 Vitest 的基础——Vitest 的很多 API 就是从 Jest 抄过来的。
-->

---
layout: end
---
