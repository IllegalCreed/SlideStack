---
theme: seriph
background: https://cover.sli.dev
title: 代码覆盖率
info: |
  前端代码覆盖率全指南：Vitest v4 + Jest 30

  Learn more at [https://vitest.dev/guide/coverage](https://vitest.dev/guide/coverage)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:vitest class="text-8xl" />
</div>

<br/>

## 代码覆盖率

测试跑到了多少代码 · Vitest v4 + Jest 30

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
代码覆盖率（Code Coverage）是衡量测试跑到了多少源代码的量化指标。
今天讲 Vitest v4 和 Jest 30 两套覆盖率工具链的核心用法。
-->

---
transition: fade-out
---

# 什么是代码覆盖率？

统计测试执行时跑到了哪些源代码

<v-click>

- **定义**：运行测试时，记录哪些代码行/分支/函数被实际执行过
- **产物**：覆盖率报告（HTML / lcov / JSON）展示被覆盖与未覆盖的代码
- **工具链**：插桩（Instrumentation）→ 执行 → 汇总 → 报告

</v-click>

<v-click>

**四个维度量化**

| 指标 | 含义 |
| --- | --- |
| Statements | 每条可执行语句是否被执行 |
| Branches | 每个判断的 true/false 两侧是否都经过 |
| Functions | 每个函数是否至少被调用一次 |
| Lines | 每个物理行是否被执行 |

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 覆盖率本质是插桩技术：在代码里注入计数器，执行时累加，最后汇总。

[click] 四个维度从粗到细：Lines 最粗，Branches 最细也最严格。
-->

---
transition: fade-out
---

# 为什么 Branches 最关键？

其他三项 100% 但分支没覆盖

<v-click>

```ts
function canAccess(user: User | null): boolean {
  if (user && user.admin) return true
  return false
}
```

</v-click>

<v-click>

**只测两个用例：`null` 和 `{ admin: true }`**

- Lines / Statements / Functions → 全部 **100%** ✅
- `user.admin === false` 分支从未执行 → **Branches 仅 67%** ⚠️

</v-click>

<v-click>

> 结论：设阈值门禁时，**Branches 是最该守的指标**；其余三项达标不代表分支完整

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 经典反例：函数只有三行，看起来很简单。

[click] 两个用例覆盖了所有行、语句、函数，但 user.admin===false 那条分支从没跑过。

[click] 这就是为什么 Branches 是最严格的指标——它要求 true 和 false 两侧都必须经过。
-->

---
transition: fade-out
---

# Vitest 快速上手

安装 + 一行命令出报告

<v-click>

**1. 安装 provider（v8 是默认）**

```bash
pnpm add -D @vitest/coverage-v8
```

</v-click>

<v-click>

**2. 运行覆盖率**

```bash
vitest run --coverage
```

</v-click>

<v-click>

**3. 查看报告**

```
----------|---------|----------|---------|---------|
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
src/      |   85.71 |    66.67 |     100 |   85.71 |
----------|---------|----------|---------|---------|
```

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v8 provider 无需额外配置，安装后即用。istanbul 需要 @vitest/coverage-istanbul。

[click] --coverage 是最简单的方式，等价于在配置里写 coverage.enabled: true。

[click] 终端 text 报告直接可读，html 报告可点击逐行查看。
-->

---
transition: fade-out
---

# Vitest 基础配置

`vitest.config.ts` coverage 字段

<v-click>

```ts
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,vue}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.spec.ts",
        "src/**/index.ts",
      ],
    },
  },
})
```

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 最小配置四个字段：provider 选 v8、reporter 出终端和 html、include 限定源码目录、exclude 过滤不需要的文件。

reportsDirectory 默认 './coverage'，可以不写。
-->

---
transition: fade-out
---

# Vitest 常用配置项

<v-click>

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `provider` | `"v8"` | 覆盖率引擎 |
| `enabled` | `false` | `--coverage` 等价于 `true` |
| `reporter` | `['text','html','clover','json']` | 报告格式 |
| `include` | glob 数组 | 参与统计的源文件 |
| `exclude` | 内置列表 | 排除文件 |
| `reportsDirectory` | `'./coverage'` | 报告输出目录 |
| `all` | `true` | 包含未被 import 的文件 |

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] all: true 很重要——默认会把未被测试 import 的文件也纳入统计，防止「只报告测了的文件」造成虚高覆盖率。
-->

---
transition: fade-out
---

# Provider：v8 vs istanbul

<v-click>

| 维度 | v8 (`@vitest/coverage-v8`) | istanbul (`@vitest/coverage-istanbul`) |
| --- | --- | --- |
| 原理 | V8 原生 profiler + AST 重映射 | Babel 插桩 |
| 速度 | 快 | 较慢 |
| 运行时 | 仅 V8（Node/Bun） | 跨运行时（Firefox/Workers） |
| ignore 注释 | `/* v8 ignore next */` | `/* istanbul ignore next */` |
| v4 精度 | 已持平（转正后） | 基准 |

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v3 时 v8 精度不如 istanbul，v4 里 experimentalAstAwareRemapping 转正为默认，精度差距消失。
默认选 v8——快且精度已达标；跨运行时场景才需要 istanbul。
-->

---
transition: fade-out
---

# Vitest v4 里程碑

精度提升 · 配置简化

<v-click>

**`experimentalAstAwareRemapping` 转正**

- v3.2：以 experimental 引入，可手动开启
- **v4.0：转为默认行为**，配置项移除
- 效果：V8 source map 重映射精度大幅提升，不再低于 istanbul

</v-click>

<v-click>

**同步移除的配置项**

```ts
// ❌ v4 已移除，写了会报警告
coverage: {
  experimentalAstAwareRemapping: true, // 已是默认
  ignoreEmptyLines: true,              // 已移除
}
```

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v4 最大的 coverage 变化就是这个精度提升默认化，从此 v8 不再是「稍微不准」的代名词。

[click] 从 v3 迁移时注意清理这两个配置项，否则会出现警告。
-->

---
transition: fade-out
---

# Vitest CLI 与点记法陷阱

<v-click>

**常用命令**

```bash
vitest run --coverage               # 最常用
vitest run --coverage --reporter=verbose
```

</v-click>

<v-click>

**点记法（dot notation）陷阱**

```bash
# ❌ 单独 --coverage 在点记法模式下不再隐式开启
vitest run --coverage.provider=istanbul

# ✅ 须显式写 enabled
vitest run --coverage.enabled --coverage.provider=istanbul
```

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] --coverage 是最简洁的写法，等价于 coverage.enabled=true + 读配置文件的 provider。

[click] 点记法陷阱是个经典坑：以为写了 --coverage.provider 就会开启覆盖率，其实不会。必须显式加 --coverage.enabled。
-->

---
transition: fade-out
---

# ignore 注释

跳过不需要统计的代码块

<v-click>

**v8 provider**

```ts
/* v8 ignore next -- @preserve */
const debugOnly = process.env.DEBUG ? heavyDebugInit() : null

/* v8 ignore next 3 */
if (process.env.NODE_ENV === 'test') {
  setupTestHook()
}
```

</v-click>

<v-click>

**istanbul provider**

```ts
/* istanbul ignore next */
function legacyFallback() { ... }
```

> TypeScript 用户：v8 注释必须加 `-- @preserve`，否则 esbuild 转译时擦除注释导致无效

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v8 的 ignore 注释格式是 /* v8 ignore next */，加数字表示跳过后续几行。

[click] TS 项目必须加 -- @preserve，不加会被 esbuild 当普通注释擦掉，导致忽略失效。istanbul 注释不受此影响。
-->

---
transition: fade-out
---

# Jest 快速上手

内置无需装包

<v-click>

**运行覆盖率**

```bash
jest --coverage
# 或别名
jest --collectCoverage
```

</v-click>

<v-click>

**注意：Jest 默认 provider 是 babel**（与 Vitest 默认 v8 不同）

</v-click>

<v-click>

**jest.config.ts 最小配置**

```ts
export default {
  collectCoverage: true,
  coverageReporters: ["text", "html", "lcov"],
  coverageDirectory: "coverage",
}
```

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Jest 内置覆盖率，不需要安装额外包，一个 --coverage 就搞定。

[click] 这是 Vitest 和 Jest 最容易混淆的默认值差异：Vitest 默认 v8，Jest 默认 babel (istanbul)。

[click] 最小配置三行：开启、指定格式、指定目录。
-->

---
transition: fade-out
---

# Jest collectCoverageFrom

精确控制参与统计的文件

<v-click>

```ts
// jest.config.ts
export default {
  collectCoverageFrom: [
    "src/**/*.{ts,vue}",   // 包含所有 ts/vue
    "!src/**/*.spec.ts",   // 排除测试文件
    "!src/main.ts",        // 排除入口
    "!src/**/*.module.ts", // 排除模块定义
    "!src/types/**",       // 排除纯类型
  ],
}
```

</v-click>

<v-click>

- 正 glob 在前、排除 glob（`!`）在后
- 不配此项则只统计测试 import 到的文件（覆盖率虚高）

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] collectCoverageFrom 是 Jest 里最重要的配置，等价于 Vitest 的 coverage.include。

[click] 排除 glob 用 ! 前缀，顺序上正 glob 在前、排除在后。
不配此项会导致覆盖率虚高——只报告测试实际 import 了的文件。
-->

---
transition: fade-out
---

# Jest coverageThreshold

阈值门禁：不达标非零退出

<v-click>

```ts
export default {
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
}
```

</v-click>

<v-click>

**负数含义**：最大允许未覆盖数（绝对值）

```ts
global: { lines: -10 }  // 最多 10 行未覆盖
```

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] coverageThreshold 设正数是最低百分比，低于则 Jest 以非零码退出，CI 步骤失败。

[click] 负数是鲜为人知的特性：-10 表示最多允许 10 行未覆盖，适合小项目或新增文件场景。
-->

---
transition: fade-out
---

# Jest provider：babel vs v8

<v-click>

| 维度 | babel（默认） | v8 |
| --- | --- | --- |
| 安装 | 内置 | `jest --coverage --coverageProvider=v8` |
| 原理 | Babel 插桩（istanbul） | V8 原生 profiler |
| ignore 注释 | `/* istanbul ignore next */` | `/* c8 ignore next */` |
| 跨运行时 | 支持 | 仅 V8 |
| 速度 | 较慢 | 快 |

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Jest 里切换到 v8 provider 只需一个命令行参数，或在配置里写 coverageProvider: "v8"。
注意 Jest 的 v8 ignore 注释用的是 c8 风格，与 Vitest 的 v8 ignore 语法不同。
-->

---
transition: fade-out
---

# Reporter 格式

按用途选择

<v-click>

| Reporter | 用途 |
| --- | --- |
| `text` / `text-summary` | 终端输出，日常快看 |
| `html` | 可点击逐行高亮，本地审查 |
| `lcov` | 推送 Codecov / Coveralls / IDE |
| `json` / `json-summary` | 程序消费 / 徽章生成 |
| `clover` / `cobertura` | XML，Jenkins / GitLab |

</v-click>

<v-click>

> 推荐组合：`["text", "html", "lcov"]`

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 推荐组合：["text", "html", "lcov"]——终端看结果、本地审查 html、CI 上传 lcov。
json-summary 适合生成 Shields.io 动态徽章，只有几 KB。
-->

---
transition: fade-out
---

# 阈值层级

越具体优先级越高

<v-click>

| 层级 | 写法 | 含义 |
| --- | --- | --- |
| `global` | `{ global: { lines: 80 } }` | 全项目汇总 |
| 目录 | `{ "./src/utils/": { ... } }` | 目录下所有文件 |
| glob | `{ "./src/**/*.vue": { ... } }` | 匹配 glob 的文件 |
| 单文件 | `{ "./src/core.ts": { ... } }` | 单个文件 |

</v-click>

<v-click>

- 匹配具体层级的文件**从 global 统计中扣除**，避免重复计算
- 可为核心文件设更高阈值（如 `branches: 90`），其余用 global

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 四个层级从粗到细，可以组合使用。

[click] "从 global 扣除"机制避免了核心文件的严格要求把 global 拉低——它们单独计算。
-->

---
transition: fade-out
---

# Vitest thresholds 进阶

autoUpdate 基线只升不降

<v-click>

```ts
coverage: {
  thresholds: {
    lines: 80,
    branches: 75,
    "100": true,        // 一键要求全部 100%
    perFile: true,      // 逐文件检查（而非汇总）
    autoUpdate: true,   // 通过后自动写回配置，只升不降
  },
}
```

</v-click>

<v-click>

**v4.1 注意**：glob 内 `perFile` 不再继承顶层，须显式写

```ts
thresholds: {
  perFile: true,
  "./src/core/**": { perFile: true, branches: 90 },
}
```

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] autoUpdate 是 Vitest 独有的好设计：每次覆盖率提升后自动更新配置里的阈值，防止回退，无需人工维护数字。

[click] v4.1 的 perFile 继承变更：glob 层的 perFile 要显式写，不再从顶层自动继承，迁移时注意。
-->

---
transition: fade-out
---

# CI 集成

GitHub Actions 示例

<v-click>

```yaml
- name: 运行测试 + 覆盖率
  run: vitest run --coverage
  # 阈值不达标此步以非零码失败，阻止合并

- name: 上传到 Codecov
  uses: codecov/codecov-action@v4
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    files: ./coverage/lcov.info
    fail_ci_if_error: true
```

</v-click>

<v-click>

- 阈值检查在本地 `vitest run` 时就触发，无需等 CI
- `fail_ci_if_error: true` 防止 Codecov 上传失败静默通过

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 两步 CI 配置：第一步跑测试并检查阈值，第二步上传 lcov 到 Codecov。

[click] 阈值失败在本地就能发现，不需要等 CI——因为 vitest run --coverage 在本地也会检查。
-->

---
transition: fade-out
---

# 覆盖率徽章

展示在 README

<v-click>

**Codecov 徽章**

```md
[![Coverage](https://codecov.io/gh/user/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/user/repo)
```

</v-click>

<v-click>

**Shields.io + json-summary（无需第三方服务）**

```bash
# 1. 生成 coverage/coverage-summary.json
reporter: ["json-summary"]

# 2. Shields.io 动态徽章
https://img.shields.io/endpoint?url=...&label=coverage
```

</v-click>

<v-click>

- PR 增量覆盖率注释：Codecov App 自动在 PR 添加 diff 覆盖率评论

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Codecov 是最常用的托管平台，一行 yaml 接入，自动生成徽章和 PR 注释。

[click] 不想用第三方服务：json-summary reporter 只输出一个小 JSON 文件，可以自己托管或用 Shields.io 读取。

[click] PR 增量覆盖率注释是 Codecov 最有价值的功能——告诉你这次 PR 新增代码的覆盖率，而非总覆盖率。
-->

---
transition: fade-out
---

# 反模式：覆盖率 ≠ 测试质量

代码被执行 ≠ 被断言

<v-click>

```ts
it("calls processPayment", () => {
  processPayment({ amount: 100 })
  // 没有任何 expect！覆盖率 100% 却无效
})
```

</v-click>

<v-click>

- 函数调用 → Statements / Lines / Functions 全绿
- 返回值、副作用**完全没断言**
- **覆盖率高 ≠ Bug 被捕获**

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是覆盖率最常见的误用：把「跑到了」当成「测好了」。

[click] 没有 expect 的测试是无效测试——它让代码被执行但不验证任何行为。覆盖率 100% 却没有捕获 Bug 的能力。
-->

---
transition: fade-out
---

# 盲目追 100% 的代价

合理排除 + 分层建议

<v-click>

**建议排除**：`*.d.ts` / `types/**` / `index.ts`（re-export）/ `*.config.*` / `__mocks__/**`

</v-click>

<v-click>

**分层覆盖率建议**

| 类型 | 建议阈值 |
| --- | --- |
| 核心业务逻辑 | 85-95% |
| 工具函数 | 70-80% |
| UI 组件（视复杂度） | 60-80% |

</v-click>

<v-click>

边际收益递减：到 95% 后每增加 1% 的测试维护成本急剧上升

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 合理排除让覆盖率数字更有意义——只统计有业务逻辑的代码。

[click] 分层阈值比全局一刀切更合理：核心路径要高，UI 组件视交互复杂度。边际收益递减，到 95% 之后每增加 1% 的测试成本急剧上升。
-->

---
transition: fade-out
---

# 把覆盖率当下限门禁

而非 KPI

<v-click>

**正确用法：防回退**
- 低于阈值 → 阻止合并（CI 非零退出）
- 关注 **Branches** + 关键业务路径
- 用 `it.each` 覆盖多个分支

</v-click>

<v-click>

**错误用法：当 KPI 冲数字**
- 团队为了 95% 而写无断言测试
- 排斥合理的 ignore 注释
- 忽略 diff 覆盖率，只看总覆盖率

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 覆盖率是安全网——它的价值在于防止已有测试覆盖的代码被回退到未覆盖状态。

[click] 当 KPI 追高数字会适得其反：无效测试泛滥，维护成本飙升，团队对测试失去信心。
-->

---
layout: intro
transition: fade-out
---

# 总结

四大指标 · 两套工具链 · 门禁而非 KPI

- **Branches 最关键**：其他 100% 不等于分支完整，设门禁优先守 Branches
- **Vitest 默认 v8**，v4 精度转正；**Jest 默认 babel**，可选 v8
- **Vitest thresholds.autoUpdate**：基线只升不降，防回退神器
- **Reporter 推荐**：`["text","html","lcov"]`，CI 上传 lcov 到 Codecov
- **覆盖率 ≠ 质量**：有 expect 的断言才算有效覆盖
- **合理分层**：核心业务 85-95%，排除纯类型/配置/re-export

<div class="abs-br m-6 text-xl">
  <a href="https://vitest.dev/guide/coverage" target="_blank" class="slidev-icon-btn">
    <logos:vitest />
  </a>
  <a href="https://jestjs.io/docs/configuration#collectcoveragefrom-array" target="_blank" class="slidev-icon-btn">
    <logos:jest />
  </a>
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
六条核心记忆点：
1. Branches 是最严格的指标，设门禁优先守它
2. Vitest v8（快+精）/ Jest babel（兼容广）
3. autoUpdate 让阈值自动维护
4. lcov 是 CI 上传的标准格式
5. 有断言才是有效覆盖
6. 分层阈值比全局一刀切更合理
-->

---
layout: end
---
