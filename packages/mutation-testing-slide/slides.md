---
theme: seriph
background: https://cover.sli.dev
title: 变异测试
info: |
  前端变异测试全指南：StrykerJS 9 + Vitest

  Learn more at [https://stryker-mutator.io/docs/stryker-js/introduction/](https://stryker-mutator.io/docs/stryker-js/introduction/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:chemistry class="text-8xl" />
</div>

<br/>

## 变异测试

测试你的测试 · StrykerJS 9 + Vitest

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
变异测试（Mutation Testing）是一种衡量「测试套件本身够不够好」的技术。
今天讲 StrykerJS 9.6 在 Vite + Vitest + TS 前端项目里的核心用法。
Stryker 这个名字取自 X 战警里专门「变异」的反派 William Stryker，呼应 mutation 主题。
-->

---
transition: fade-out
---

# 什么是变异测试？

自动把代码改坏，看测试能不能发现

<v-click>

- **变异体（mutant）**：往源码注入一个微小缺陷，如 `+`→`-`、`<`→`<=`、`true`→`false`
- **跑现有测试**：用你已经写好的测试套件去跑这份被改坏的代码
- **killed**：至少一个测试失败 → 测试「抓到了」这个缺陷
- **survived**：所有测试依旧通过 → 测试有盲区，缺陷被放过了

</v-click>

<v-click>

> 存活的变异体 = 你的测试套件的「漏洞清单」，逐条提示哪里缺断言

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 变异测试的机制：自动在源码里植入一个个微小的人为缺陷，每个缺陷叫一个 mutant（变异体），然后用你现有的测试去跑。

如果某个变异体让至少一个测试失败，说明测试抓到了它，叫 killed；如果所有测试还是绿的，说明测试没发现，叫 survived。

[click] 存活的变异体就是测试盲区的清单——它精确告诉你哪些代码改坏了测试也不报警。
-->

---
transition: fade-out
---

# 「测试你的测试」

Who's testing the tests?

<v-click>

- 普通测试在测**业务代码**对不对
- 变异测试在测**你的测试本身**够不够好——它故意把代码改坏，看测试能否发现

</v-click>

<v-click>

```text
普通测试：  测试  ──验证──▶  业务代码
变异测试：  Stryker ──改坏──▶ 业务代码 ──再跑──▶ 测试
                                              ▲
                                     测试能不能发现？
```

</v-click>

<v-click>

> StrykerJS 的社区口号：**"Who's testing the tests?"**（谁来测试这些测试？）

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-text-fill-color: transparent;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
}
</style>

<!--
[click] 关键区别：普通单元测试在校验业务代码对不对；变异测试更上一层，校验你写的那些测试本身够不够强。

[click] 它的做法是反过来——主动把业务代码改坏，再看测试能不能察觉。

[click] 所以社区口号是「谁来测试这些测试」。变异测试就是那个测试测试的人。
-->

---
transition: fade-out
---

# 变异分数 vs 覆盖率

两个指标衡量的根本不是同一件事

<v-click>

| 维度 | 代码覆盖率 | 变异分数 |
| --- | --- | --- |
| 衡量 | 代码**有没有被执行到** | 测试**能不能抓到注入的缺陷** |
| 空断言测试 | 照样拿高覆盖率 | 拿不到高分（改坏也不报错） |
| 本质 | 「跑没跑到」 | 「测得准不准 / 断言够不够强」 |

</v-click>

<v-click>

> **覆盖率 100% ≠ 测试强**：代码每行都跑过，但断言可能根本没校验返回值

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 覆盖率和变异分数衡量的是两件事。覆盖率只看代码有没有被执行到；变异分数看测试能不能抓到被注入的缺陷。

一个连 expect 都没有的空断言测试，照样能拿满覆盖率（因为代码确实跑过了），但变异分数会很低——因为把代码改坏它也不报错。

[click] 这就是核心结论：覆盖率 100% 不等于测试强。变异测试专门揪出这种「假绿」测试。
-->

---
transition: fade-out
---

# 反例：高覆盖率，低变异分数

代码被执行 ≠ 被断言

<v-click>

```ts
export function add(a: number, b: number) {
  return a + b
}
// 测试：只调用，断言很弱
it("add", () => {
  expect(add(2, 3)).toBeTypeOf("number") // 没校验是 5
})
```

</v-click>

<v-click>

- Lines / Statements / Functions → **100%** ✅（代码跑过了）
- 把 `a + b` 改成 `a - b`，`toBeTypeOf("number")` 依旧通过 → 变异体 **survived** ⚠️

</v-click>

<v-click>

> 覆盖率看不出这个漏洞，变异测试一眼揪出「有覆盖、没断言」

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 一个最小例子：add 函数加测试，但断言只校验「返回的是数字」，没校验「等于 5」。

[click] 这个测试覆盖率三项都是 100%，代码确实跑过了。但把加号改成减号，返回 -1 仍然是数字，toBeTypeOf 还是通过——这个变异体存活了。

[click] 覆盖率工具完全看不出问题，变异测试一跑就把这个「有覆盖、没断言」的盲区标出来。
-->

---
transition: fade-out
---

# 变异分数公式

官方精确口径，不是只数 killed

<v-click>

```text
detected   = killed + timeout            被检测到 = 杀死 + 超时
undetected = survived + no coverage      未检测到 = 存活 + 无覆盖
valid      = detected + undetected       有效变异体（剔除 invalid）

mutation score = detected / valid * 100
```

</v-click>

<v-click>

- 分子是 **detected**（含 timeout），不是只有 killed
- 分母 **valid 包含 no coverage**，但剔除 runtime / compile error / ignored
- 简化直觉版 `killed/(killed+survived)` 仅在无 timeout、无 no coverage 时成立

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 官方精确公式：分子叫 detected，等于 killed 加 timeout；undetected 等于 survived 加 no coverage；valid 是两者之和，也就是有效变异体。变异分数 = detected 除以 valid 乘 100。

[click] 三个易错点：一，分子含 timeout，不是只数 killed；二，分母 valid 把 no coverage 也算进去（无覆盖会拖低分数），但剔除运行时错误、编译错误和被忽略的；三，常见的简化版 killed 除以 killed 加 survived，只有在没有 timeout 和 no coverage 时才等价。
-->

---
transition: fade-out
---

# 还有一个：基于覆盖代码的分数

把 no coverage 从分母剔除

<v-click>

```text
covered = detected + survived       （= killed + timeout + survived）
mutation score (covered) = detected / covered * 100
```

</v-click>

<v-click>

| 口径 | 分母 | 含 no coverage？ | 数值 |
| --- | --- | --- | --- |
| 标准分数 | valid | ✅ 含（拖低） | 偏低 |
| 基于覆盖代码 | covered | ❌ 不含 | 通常偏高 |

</v-click>

<v-click>

> 「基于覆盖代码」只衡量**被测试覆盖到的那部分**的质量，两个数不一样别混用

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 报告里还有第二个分数：基于覆盖代码的变异分数。它的分母 covered 等于 detected 加 survived，也就是不含 no coverage。

[click] 对比一下：标准分数分母是 valid，含 no coverage，会被无覆盖的部分拖低；基于覆盖代码的分母不含 no coverage，数值通常更高。

[click] 后者只衡量「被测试覆盖到的那部分代码」的测试质量。两个数不一样，看报告时别搞混。
-->

---
transition: fade-out
---

# mutant 状态机

8 种状态，归三类

<v-click>

| 状态 | 含义 | 归属 |
| --- | --- | --- |
| **Killed** | 激活时至少一个测试失败 | detected（进分子） |
| **Timeout** | 触发超时（死循环等） | detected（进分子） |
| **Survived** | 激活时所有测试都通过 | undetected（进分母） |
| **No coverage** | 没有任何测试覆盖它 | undetected（进分母） |
| **Runtime / Compile error** | 跑/编译时报错 | invalid（不计分） |
| **Ignored / Pending** | 被忽略 / 待运行 | 不计分 |

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 八种状态归三类。进分子的是 detected：Killed（至少一个测试失败）和 Timeout（跑测试时触发超时）。

进分母的是 undetected：Survived（所有测试都通过）和 No coverage（没有任何测试覆盖它，所以注定存活）。

不计分的两组：Runtime error 和 Compile error 属 invalid（跑或编译时报错，而不是测试失败）；Ignored 和 Pending 也不计入。
-->

---
transition: fade-out
---

# 高频陷阱：Timeout 算 killed 吗？

算「被检测到」，但状态名不叫 Killed

<v-click>

- 变异体导致死循环 / 卡死 → 触发超时 → 等于「测试以某种方式察觉了异常」
- 所以归入 **detected**，和 killed 一样**进分子、对分数有正贡献**

</v-click>

<v-click>

```text
timeoutForRun = netTime * timeoutFactor + timeoutMS + overhead
                          （默认 1.5）        （默认 5000ms）
```

</v-click>

<v-click>

> 出题区分：Timeout **计为 detected** ≠ 它的**状态名是 Killed**（是独立的 Timeout）

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 一个高频陷阱：Timeout 到底算不算被杀？答案是算「被检测到」。直觉是变异体让测试死循环或卡死触发了超时，相当于测试以某种方式察觉了异常，所以和 killed 一样进分子、对分数有正贡献。

[click] 超时时间不是固定的：等于净运行时间乘以 timeoutFactor（默认 1.5）加 timeoutMS（默认 5000 毫秒）再加开销。

[click] 出题要区分：「计为 detected」和「状态名叫 Killed」是两回事——它是独立的 Timeout 状态。
-->

---
transition: fade-out
---

# 变异算子举例

Stryker 内置 15 类，挑常见的记

<v-click>

| 算子 | before → after |
| --- | --- |
| Arithmetic 算术 | `a + b` → `a - b` |
| Equality 边界 | `a < b` → `a <= b`；`===` → `!==` |
| Boolean 布尔 | `true` → `false` |
| Logical 逻辑 | `a && b` → `a \|\| b` |
| Block 块语句 | `{ doSth() }` → `{}`（清空函数体） |
| Optional Chaining | `foo?.bar` → `foo.bar` |
| String 字符串 | `""` → `"Stryker was here!"` |

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Stryker 内置 15 类算子，挑最常考的记。算术：加变减。边界（Equality Operator）：小于变小于等于、三等变三不等——这类专抓边界条件。布尔：true 变 false。逻辑：与变或。块语句：直接清空函数体变成空大括号。可选链：去掉问号点。字符串有个标志性彩蛋——空字符串会被填成 "Stryker was here!"。

记住边界变异属 Equality Operator、清空函数体属 Block Statement，这两个最容易考。
-->

---
transition: fade-out
---

# StrykerJS 安装

Vitest + TS 前端项目

<v-click>

```bash
# 交互式初始化，生成 stryker.config.mjs
npm init stryker@latest

# 或手动装（需自带 vitest，peer: vitest >= 2.0.0）
npm i -D @stryker-mutator/core @stryker-mutator/vitest-runner
```

</v-click>

<v-click>

- **最新 9.6.1**（2026-04），要求 **Node >= 20**（v9 起放弃 Node 18）
- vitest-runner 不内置 vitest，peer 为 **vitest >= 2.0.0**（v9.4+ 支持到 Vitest v4）
- 包名带 `@stryker-mutator/` scope，是连字符 `vitest-runner` 不是驼峰

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 安装两条路：npm init stryker@latest 走交互式，自动生成 stryker.config.mjs；或手动装 core 加 vitest-runner，但要自带 vitest。

[click] 三个要点：最新版 9.6.1，要求 Node 20 以上（v9 起放弃了 Node 18）；vitest-runner 不内置 vitest，peer 写的是 vitest 大于等于 2，v9.4 以后能支持到 Vitest v4；包名带 @stryker-mutator scope，runner 是连字符不是驼峰，容易写错。
-->

---
transition: fade-out
---

# 最小配置

`stryker.config.json`

<v-click>

```json
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "testRunner": "vitest",
  "plugins": ["@stryker-mutator/vitest-runner"],
  "mutate": ["src/**/*.ts", "!src/**/*.{spec,test}.ts"],
  "coverageAnalysis": "perTest",
  "thresholds": { "high": 80, "low": 60, "break": 60 },
  "reporters": ["html", "clear-text", "progress"]
}
```

</v-click>

<v-click>

- `$schema` 头让 IDE 给配置项智能提示
- `mutate` 选「要被变异的源文件」，默认排除测试文件

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 一份能跑的最小配置：schema 头、testRunner 选 vitest、plugins 加 vitest-runner、mutate 圈定 src 下的 ts 但排除测试文件、coverageAnalysis 给 perTest、thresholds 三个值、reporters 三个。

[click] schema 头能让 IDE 对每个配置项给智能提示；mutate 选的是「要被变异的源文件」，默认就排除测试文件。
-->

---
transition: fade-out
---

# coverageAnalysis 三档

性能核心，Vitest 下有特例

<v-click>

| 值 | 行为 | 性能 |
| --- | --- | --- |
| `off` | 每个变异体都跑**全部测试** | 最慢 |
| `all` | 无覆盖的变异体直接标 NoCoverage 不跑 | 中等 |
| **`perTest`**（默认） | 每个变异体**只跑覆盖它的那些测试** | 最快 |

</v-click>

<v-click>

- `perTest` 前提：测试必须**相互独立**，无共享状态泄漏，否则漏跑
- ⚠️ **Vitest runner 特例**：`coverageAnalysis` 被**忽略**，恒为 `perTest`（写 `off`/`all` 无效）

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] coverageAnalysis 三档，是性能核心。off 最慢，每个变异体都跑全部测试；all 居中，先收集覆盖、没被覆盖的变异体直接标 NoCoverage 不再跑；perTest 最快也是默认，每个变异体只跑覆盖它的那几个测试。

[click] perTest 的前提是测试相互独立，有状态泄漏会漏跑。一个高频陷阱：Vitest runner 下这个字段被忽略，恒为 perTest，你写 off 或 all 都无效。
-->

---
transition: fade-out
---

# thresholds：只有 break 卡 CI

high / low 仅染色

<v-click>

```json
"thresholds": { "high": 80, "low": 60, "break": null }
```

| 字段 | 作用 |
| --- | --- |
| `high` | 分数 ≥ high → 报告绿色（**仅配色**） |
| `low` | low ≤ 分数 < high → 黄/橙（**仅配色**） |
| **`break`** | 分数 < break → **退出码 1（CI fail）** |

</v-click>

<v-click>

> ⚠️ 默认 `break: null` = **永不让构建失败**。要 CI 门禁必须显式设 `break`（如 60）

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] thresholds 三个值，但只有 break 卡 CI。high 决定报告什么时候变绿、low 决定黄橙警告区——这俩只控制配色，不影响退出码。只有 break 决定 CI 是否失败：分数低于 break 就退出码 1。

[click] 最大的陷阱：默认 break 是 null，意味着永远不会让构建失败。想做 CI 门禁，必须显式把 break 设成一个值，比如 60。光设 high low 没用。
-->

---
transition: fade-out
---

# 其他关键配置项

v9.6.1 默认值

<v-click>

| 字段 | 默认 | 说明 |
| --- | --- | --- |
| `testRunner` | `command` | 应换 `vitest`/`jest`，default 仅看退出码 |
| `disableTypeChecks` | `true` | 插 `// @ts-nocheck` 防变异引发 TS 错 |
| `concurrency` | ≈CPU 核数 | v9.6 起支持百分比 `"50%"` |
| `incremental` | `false` | 只重测变化部分，存增量文件 |
| `checkers` | `[]` | 配 `["typescript"]` 测试前剔编译错变异 |

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 几个常用配置和默认值。testRunner 默认是 command，只看退出码、性能差，前端项目一定换成 vitest 或 jest。disableTypeChecks 默认 true，会自动插 @ts-nocheck，防止变异触发 TS 编译错误。concurrency 默认约等于 CPU 核数，v9.6 起支持写百分比像 "50%"。incremental 默认关，开了只重测变化部分。checkers 配 ["typescript"] 加上 typescript-checker 插件，能在跑测试前先剔除会编译错的变异体，减少 invalid。
-->

---
transition: fade-out
---

# 运行与报告

`npx stryker run`

<v-click>

```bash
npx stryker run                  # 命令带 run 子命令，不是裸跑 stryker
npx stryker run --incremental    # 增量
npx stryker run --logLevel trace # 调试
```

</v-click>

<v-click>

**终端 clear-text 报告**

```text
File         | % score | # killed | # timeout | # survived | # no cov
-------------|---------|----------|-----------|------------|---------
src/clamp.ts |   62.50 |        5 |         0 |          3 |        0
```

</v-click>

<v-click>

> HTML 报告产物在 `reports/mutation/`，把 **survived / no coverage 定位到行列**

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 运行命令是 npx stryker run，注意带 run 子命令，不是裸跑 stryker。加 --incremental 走增量，--logLevel trace 调试。

[click] 终端的 clear-text 报告按文件列出分数和各状态计数。

[click] HTML 报告产物在 reports/mutation 目录，最有用的是它把 survived 和 no coverage 精确定位到具体行列，点开能看「原代码变成了什么」——解读报告就盯这两类。
-->

---
transition: fade-out
---

# survived 实战

补断言把它杀掉

<v-click>

```ts
// src/utils/clamp.ts —— 把 value 限制在 [min, max]
export function clamp(v: number, min: number, max: number) {
  if (v < min) return min
  if (v > max) return max
  return v
}
// 断言不足：只测了「区间内」
it("in range", () => { expect(clamp(5, 0, 10)).toBe(5) })
```

</v-click>

<v-click>

- `v < min`、`v > max` 两个边界变异 **survived**（测试从没触发这俩分支）
- **补边界用例 → 杀死**：

```ts
expect(clamp(-3, 0, 10)).toBe(0)   // 命中 v < min
expect(clamp(99, 0, 10)).toBe(10)  // 命中 v > max
```

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 实战：clamp 函数把值限制在区间内，但测试只测了「区间内」这一条路径。

[click] 结果 v 小于 min、v 大于 max 这两个边界变异体存活了——因为测试从没触发过这两条分支。处理 survived 的首选是补断言：加两个边界用例，一个命中下界一个命中上界，变异体就被杀死了。这正是变异测试比覆盖率多抓到的：缺边界断言。
-->

---
transition: fade-out
---

# 等价变异体

理论上杀不死，正确做法是标注

<v-click>

```ts
// 求 max：把 < 换成 <= 是等价变异体
export function max(a: number, b: number) {
  return a < b ? b : a   // a===b 时，< 和 <= 结果都返回 a
}
```

</v-click>

<v-click>

- **等价变异体**：变异后行为与原码**完全等价**，任何测试都无法区分
- 它是变异分数**到不了 100% 的根因之一**
- 正确处理：用注释标注并写原因，而非硬写无意义测试

```ts
// Stryker disable next-line EqualityOperator: 等价变异体，无法区分
```

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 但不是所有 survived 都该补测试。求 max 的写法 a 小于 b 问号 b 冒号 a，把小于换成小于等于：当 a 等于 b 时两者都返回 a，对所有输入输出完全相同。

[click] 这叫等价变异体——行为和原码完全等价，任何测试都无法区分，是变异分数到不了 100% 的根本原因之一。正确处理不是硬写无意义测试，而是用 Stryker disable next-line 注释标注，并写明原因。注释必须以大写 Stryker 开头，可加 next-line 只作用下一行。
-->

---
transition: fade-out
---

# 性能现实与提速

慢的根因：N 个变异体 × 测试套件

<v-click>

- 一个文件可能生成几十上百个变异体，每个都要跑一遍测试
- 比普通测试慢一两个数量级

</v-click>

<v-click>

**四板斧降本**

| 手段 | 做法 |
| --- | --- |
| perTest | 每个变异体只跑相关测试（Vitest 已强制） |
| incremental | `--incremental` 只重测变化部分 |
| 缩小 mutate | 只圈核心逻辑/工具/校验，别全仓扫 |
| concurrency | 并行，v9.6 可设 `"50%"` |

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 变异测试慢的根因是 N 个变异体乘测试套件：一个文件可能生成几十上百个变异体，每个都要把相关测试跑一遍，比普通测试慢一两个数量级。

[click] 四板斧降本：perTest 让每个变异体只跑相关测试（Vitest runner 已强制）；incremental 只重测变化部分；缩小 mutate 范围只圈核心逻辑别全仓扫；concurrency 并行，v9.6 能设百分比。
-->

---
transition: fade-out
---

# 与覆盖率互补

广度 → 深度，先覆盖率后变异

<v-click>

```text
①  覆盖率（便宜、快）   ──▶  保证「代码被执行」（广度）
②  变异测试（贵、慢）   ──▶  保证「断言够强」（深度）
```

</v-click>

<v-click>

- 先用覆盖率补齐「跑到」，再用变异测试检验「测准」
- 跳过覆盖率直接上变异 → 在大量 no coverage 上**浪费算力**

</v-click>

<v-click>

> 两者不是替代关系：覆盖率是地基，变异测试是质检

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 覆盖率和变异测试是互补的，顺序是先覆盖率后变异，本质是广度到深度的递进：覆盖率便宜又快，保证代码被执行；变异测试贵又慢，保证断言够强。

[click] 实操上先用覆盖率把「跑到」补齐，再用变异测试检验「测准」。如果跳过覆盖率直接上变异，会在大量没覆盖的代码上白白浪费算力。

[click] 所以它俩不是替代关系：覆盖率是地基，变异测试是质检。
-->

---
transition: fade-out
---

# 最佳实践与反模式

变异分数当信号，不当 KPI

<v-click>

**✅ 实践**

- 挑**核心逻辑 / 工具函数 / 校验器**跑，用 `mutate` 圈定
- CI 用 `thresholds.break` 做门禁，本地探索可不设
- 等价变异体显式 `disable` + 写 reason

</v-click>

<v-click>

**❌ 反模式**

- 全仓无差别跑 → 慢到没人用、噪音淹没真问题
- 把分数当硬 KPI 追 100% → 逼出无意义测试（等价变异体令 100% 常不可达）
- 默认 `break: null` 还以为 CI 会卡 → 永远不 fail

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 实践三条：只挑核心逻辑、工具函数、校验器跑，用 mutate 圈定，UI 和样板不值得；CI 用 break 做门禁，本地探索可以不设；等价变异体显式 disable 并写原因，保持可追溯。

[click] 反模式三条，都是高频出题点：全仓无差别跑，慢到没人愿意用、噪音淹没真问题；把分数当硬 KPI 追 100%，会逼出无意义测试，何况等价变异体让 100% 常常不可达；最后还是那个 break null 陷阱——不设 break 还以为 CI 会卡，其实永远不会失败。
-->

---
transition: fade-out
---

# UI / 样板代码：别跑变异

低价值噪音的来源

<v-click>

- UI 组件、纯展示层、自动生成代码跑变异 → 产出大量低价值 survived
  （样式、字符串字面量这类改了也无所谓的变异）
- ❌ **把自己没写好的测试当等价变异体 disable** → 掩盖真实测试缺陷

</v-click>

<v-click>

```json
// 用 mutate 把变异范围收窄到值得测的地方
"mutate": [
  "src/utils/**/*.ts",
  "src/validators/**/*.ts",
  "!src/**/*.{spec,test}.ts"
]
```

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 一个常见误区：对 UI 组件、纯展示层、自动生成的代码跑变异，会产出大量低价值的 survived——比如样式、字符串字面量这种改了也无所谓的变异，噪音很大。还有一个更糟的反模式：把自己没写好的测试当等价变异体随手 disable，这是在掩盖真实的测试缺陷，只有真正功能等价才该忽略。

[click] 做法是用 mutate 把变异范围收窄到工具函数、校验器这些真正值得测的地方。
-->

---
layout: intro
transition: fade-out
---

# 总结

测试你的测试 · detected/valid · break 才卡 CI

- **本质**：把代码改坏看测试能否发现，覆盖率 100% ≠ 测试强
- **公式**：`detected/valid`，detected = killed + **timeout**（超时也进分子）
- **状态**：killed/timeout 进分子，survived/no coverage 进分母，error 不计分
- **配置**：Vitest 下 coverageAnalysis 恒 perTest；TS 默认插 `@ts-nocheck`
- **门禁**：只有 `thresholds.break` 卡 CI，默认 null 永不 fail
- **定位**：挑核心逻辑跑、当信号不当 KPI、等价变异体标注 disable

<div class="abs-br m-6 text-xl">
  <a href="https://stryker-mutator.io/docs/stryker-js/introduction/" target="_blank" class="slidev-icon-btn">
    <carbon:chemistry />
  </a>
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #C084FC 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
六条核心记忆点：
1. 变异测试的本质是把代码改坏看测试能否发现，覆盖率 100% 不等于测试强
2. 公式 detected 除以 valid，detected 含 timeout——超时也进分子
3. 状态归属：killed timeout 进分子，survived no coverage 进分母，各类 error 不计分
4. Vitest runner 下 coverageAnalysis 恒为 perTest，TS 项目默认插 @ts-nocheck
5. 只有 thresholds.break 卡 CI，默认 null 永不失败
6. 挑核心逻辑跑，把分数当质量信号而非 KPI，等价变异体显式 disable 写原因
-->

---
layout: end
---
