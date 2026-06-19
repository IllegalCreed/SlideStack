---
theme: seriph
background: https://cover.sli.dev
title: 快照测试
info: |
  快照测试完全指南：输出固化 + 回归比对 · Vitest v4 + Jest 30

  Learn more at [https://vitest.dev/guide/snapshot](https://vitest.dev/guide/snapshot)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:vitest class="text-8xl" />
</div>

<br/>

## 快照测试

输出固化 + 回归比对 · Vitest v4 + Jest 30

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
快照测试（Snapshot Testing）是一种固化输出基准、后续自动比对的测试技术。
今天讲 Vitest v4 和 Jest 30 两套快照工具链的核心用法与差异。
-->

---
transition: fade-out
---

# 什么是快照测试？

首次固化 → 后续比对 → 人工确认

<v-click>

**三步工作流**

1. **首次运行**：序列化值写入 `.snap` 文件作为基准
2. **后续运行**：重新序列化，与基准逐字符比对
3. **不一致时**：测试失败并展示 diff，由人判断是 bug 还是需要更新

</v-click>

<v-click>

**底层序列化**：Vitest 和 Jest 共用 `pretty-format` 库

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 快照测试的本质是"输出固化+回归比对"：第一次跑生成基准，以后每次都和基准对比。

[click] pretty-format 是共用的序列化核心，所以两个框架的快照格式大体相同。
-->

---
transition: fade-out
---

# 适用 / 不适用场景

<v-click>

**适合快照测试**

- UI 组件渲染输出（HTML 结构回归）
- 错误消息与格式化输出
- 大型序列化结构（配置对象、API 响应结构）
- CLI 工具输出

</v-click>

<v-click>

**不适合快照测试**

- 含动态值的输出（时间戳、随机 ID）→ 需用属性匹配器
- 可以写精确断言的逻辑 → `expect(count).toBe(5)` 更清晰
- 频繁变化的 UI → 维护成本高

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 快照测试最适合"结构稳定、内容复杂"的场景：UI 组件 HTML 结构、大型对象序列化。

[click] 动态值是快照测试的天敌，每次都不一样就每次失败。精确断言比快照更清晰可维护。
-->

---
transition: fade-out
---

# toMatchSnapshot 外部快照

存到 `__snapshots__` 目录

<v-click>

```ts
it('格式化用户名', () => {
  expect(formatName('hello')).toMatchSnapshot()
  // 首次运行 → 生成 __snapshots__/xxx.spec.ts.snap
})
```

</v-click>

<v-click>

**生成的 .snap 文件**

```
// Vitest Snapshot v1
exports[`格式化用户名 1`] = `"HELLO"`
```

</v-click>

<v-click>

**多快照用 hint 区分**

```ts
expect(light).toMatchSnapshot('light-theme')
expect(dark).toMatchSnapshot('dark-theme')
// key: `测试名 > light-theme 1`（Vitest）
```

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] toMatchSnapshot 是最常用的 API，快照存到测试文件旁边的 __snapshots__ 子目录。

[click] .snap 文件是普通文本，可以在 git diff 里看到变化。

[click] hint 参数让同一个测试里的多个快照有不同的 key，避免混淆。
-->

---
transition: fade-out
---

# toMatchInlineSnapshot 内联快照

框架自动回写到测试文件

<v-click>

```ts
it('格式化错误', () => {
  expect(formatError(404)).toMatchInlineSnapshot(`
    "错误: 404 Not Found"
  `)
})
```

</v-click>

<v-click>

**特点**

- 首次运行：框架自动把序列化结果写入测试文件的参数位置
- 审查直观：diff 和测试逻辑在同一文件
- 适合小输出（几行内），大输出用外部快照

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 内联快照的魔法：你只需写空的 toMatchInlineSnapshot()，第一次跑完，框架自动把结果填进去。

[click] 内联快照适合小而稳定的输出。大型 HTML 结构用外部快照更合适。
-->

---
transition: fade-out
---

# toMatchFileSnapshot（Vitest 独有）

整文件快照，支持 HTML/SVG

<v-click>

```ts
it('生成 HTML 报告', async () => {
  const html = generateReport()
  await expect(html).toMatchFileSnapshot('./snapshots/report.html')
})
```

</v-click>

<v-click>

**重要细节**

- 返回 Promise，**必须 `await`**
- 不 `await` 时按 `expect.soft` 处理：测试不立即失败
- **Jest 30 无此 API**，Vitest 独有

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] toMatchFileSnapshot 适合整文件比对：HTML 输出、SVG 图形、大型 JSON 等。

[click] await 是最容易忘的坑——不加 await 测试表面通过，实际没比对。
-->

---
transition: fade-out
---

# 错误快照

捕获抛出异常的格式

<v-click>

```ts
// 外部快照
expect(() => parseInput('')).toThrowErrorMatchingSnapshot()

// 内联快照
expect(() => parseInput('')).toThrowErrorMatchingInlineSnapshot(
  `[Error: 输入不能为空]`
)
```

</v-click>

<v-click>

**Vitest vs Jest 格式差异**

| | Vitest | Jest |
| --- | --- | --- |
| 快照内容 | `[Error: message]`（含类名） | `"message"`（仅消息） |

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 错误快照让你固化异常消息，防止意外改变错误提示文字。

[click] 格式差异是迁移时最容易踩的坑——从 Jest 迁到 Vitest 后错误快照全部需要重新生成。
-->

---
transition: fade-out
---

# 属性匹配器处理动态值

指定字段验类型，其余精确比对

<v-click>

```ts
it('创建用户', () => {
  expect(createUser('Alice')).toMatchSnapshot({
    id: expect.any(Number),
    createdAt: expect.any(Date),
  })
})
```

</v-click>

<v-click>

**生成的快照**

```
Object {
  "createdAt": Any<Date>,
  "id": Any<Number>,
  "name": "Alice",
}
```

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 属性匹配器是处理动态值的标准方案：id 每次不同，但我们只要验它是 Number 类型。

[click] 快照里显示 Any<Number>，name 字段还是精确比对。
-->

---
transition: fade-out
---

# 自定义序列化器

控制对象如何序列化为快照字符串

<v-click>

**运行时注册（单个测试文件）**

```ts
expect.addSnapshotSerializer({
  test(val) { return val && val.__type === 'Color' },
  serialize(val) { return `Color(${val.r}, ${val.g}, ${val.b})` },
})
```

</v-click>

<v-click>

**全局注册（vitest.config.ts）**

```ts
test: {
  snapshotSerializers: ['path/to/my-serializer.ts'],
}
```

**典型第三方序列化器**：`@emotion/jest`、`jest-serializer-html`

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 自定义序列化器让你把复杂对象转换成更易读的格式，而不是默认的 Object 结构。

[click] 全局注册适合整个项目统一使用的序列化器，比如 CSS-in-JS 库的快照格式。
-->

---
transition: fade-out
---

# snapshotFormat 输出格式

控制 pretty-format 风格

<v-click>

| 配置项 | Vitest 默认 | 说明 |
| --- | --- | --- |
| `printBasicPrototype` | `false` | 不打印 Object 原型名 |
| `escapeString` | `false` | 字符串不转义特殊字符 |
| `escapeRegex` | `true` | 正则表达式转义 |
| `printFunctionName` | `false` | 不打印函数名 |

</v-click>

<v-click>

**Jest 30 也默认 `printBasicPrototype: false`**（与 Vitest 一致）

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] snapshotFormat 让你精细控制快照的序列化格式。

[click] Jest 30 对齐了 printBasicPrototype 默认值，从 Jest 迁移时这个维度格式差异减少了。
-->

---
transition: fade-out
---

# 更新快照

三种更新方式

<v-click>

**命令行更新**

```bash
vitest -u              # 更新全部快照
vitest -u -t "用户名"  # 只更新匹配的测试

jest -u                # 同理
```

</v-click>

<v-click>

**watch 模式交互更新**

- 按 `u` 键：更新失败快照
- 按 `s` 键：跳过当前快照

</v-click>

<v-click>

> 更新前必须确认变更是预期的，不要盲目 `-u`

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] -u 是最常用的更新方式，加 -t 可以只更新特定测试的快照，避免误更新。

[click] watch 模式的交互更新很方便，可以逐个确认。

[click] 盲目 -u 是最危险的操作——可能把 bug 固化成新的快照基准。
-->

---
transition: fade-out
---

# CI 模式行为（重要）

CI 环境不写快照，差异即失败

<v-click>

当 `process.env.CI` 为真时：

- **新快照（缺失）** → 直接失败，不创建
- **不匹配快照** → 直接失败，不更新
- **过时快照** → 直接失败，不删除

</v-click>

<v-click>

**结论**：`.snap` 文件必须提交到版本库，不能进 `.gitignore`

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] CI 模式是快照测试最重要的行为特性：CI 下快照只读不写，任何差异都直接失败。

[click] 这就是为什么 .snap 必须提交——CI 上没有基准文件就永远失败。
-->

---
transition: fade-out
---

# 过时快照（Obsolete）

测试删改后的孤儿条目

<v-click>

**产生原因**：测试用例改名或删除后，`.snap` 里对应条目变为孤儿

</v-click>

<v-click>

**处理方式**

| 环境 | 行为 |
| --- | --- |
| 本地 `-u` | 自动删除过时条目 |
| CI | 导致测试失败 |

</v-click>

<v-click>

> 提交 PR 前务必在本地运行一次 `-u`，清理过时快照再提交

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 过时快照是快照测试的常见维护问题，测试改名就会产生。

[click] 本地 -u 会自动清理，但 CI 不会——所以提交前要先清理。
-->

---
transition: fade-out
---

# 快照路径自定义

Vitest 函数式 vs Jest 模块式

<v-click>

**Vitest**（`vitest.config.ts`）

```ts
test: {
  resolveSnapshotPath: (testPath, ext) =>
    testPath.replace('/src/', '/snapshots/') + ext,
}
```

</v-click>

<v-click>

**Jest**（`jest.config.ts`）

```ts
snapshotResolver: './custom-snapshot-resolver.js'
// 独立模块，必须同时导出三个函数：
// resolveSnapshotPath + resolveTestPath + testPathForConsistencyCheck
```

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vitest 的路径自定义是一个内联函数，简洁直接。

[click] Jest 需要一个独立的解析器模块，且必须同时实现三个函数——只实现一个会报错。
-->

---
transition: fade-out
---

# 组件快照（Vue）

只快照关键子结构

<v-click>

```ts
import { mount } from '@vue/test-utils'
import MyCard from './MyCard.vue'

it('卡片渲染', () => {
  const wrapper = mount(MyCard, {
    props: { title: '标题', count: 42 },
  })
  // 只快照关键子结构，避免快照膨胀
  expect(wrapper.find('.card-header').html()).toMatchSnapshot()
})
```

</v-click>

<v-click>

- `wrapper.html()` → outerHTML 字符串
- `wrapper.element` → DOM 节点（更详细）
- 用 `find/findComponent` 缩小快照范围，防止无关变更触发失败

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vue 组件快照用 vue-test-utils 的 wrapper.html() 最常见。

[click] 关键点是缩小快照范围——只快照你关心的结构，不然父组件的任何样式变化都会触发失败。
-->

---
transition: fade-out
---

# Vitest vs Jest 差异（上）

独有 API 与格式

<v-click>

| 特性 | Vitest | Jest 30 |
| --- | --- | --- |
| `toMatchFileSnapshot` | ✅ 有 | ❌ 无 |
| `toMatchAriaSnapshot` | ✅ v4.1.4+ | ❌ 无 |
| `toMatchScreenshot` | ✅ 有 | ❌ 无 |
| 错误快照格式 | `[Error: msg]` | `"msg"` |
| 快照文件头 | `Vitest Snapshot v1` | `Jest Snapshot v1` |

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vitest 在快照 API 上扩展很多：文件快照、无障碍快照、截图快照都是 Vitest 独有。
错误快照格式差异是迁移时最容易踩的坑。
-->

---
transition: fade-out
---

# Vitest vs Jest 差异（下）

配置与共同点

<v-click>

| 维度 | Vitest | Jest 30 |
| --- | --- | --- |
| 路径配置 | 内联函数 | 独立模块（3 函数） |
| hint 分隔符 | `>` | `: ` |
| 内联格式化 | AST 重写 | Prettier |

</v-click>

<v-click>

**共同点**

- 都用 `pretty-format` 序列化
- CI 模式都不写快照
- `toMatchSnapshot` / `toMatchInlineSnapshot` API 相同

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] hint 分隔符差异会导致 snap 文件里的 key 不同，迁移时需要重新生成。

[click] 两者共同点多于差异——都用 pretty-format，CI 行为一致，基础 API 相同。
-->

---
transition: fade-out
---

# 切换框架注意事项

Jest → Vitest 迁移

<v-click>

**需重新生成快照**

- 错误快照格式变化：`"msg"` → `[Error: msg]`
- hint 分隔符变化：key 不同导致旧 `.snap` 无法匹配

</v-click>

<v-click>

**不可移植的 API**

- `toMatchFileSnapshot` 仅 Vitest，迁移到 Jest 需改写

</v-click>

<v-click>

**迁移成本低的场景**

- 基础对象/组件快照（`toMatchSnapshot`）格式基本一致
- 属性匹配器用法完全相同

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 迁移时最麻烦的是错误快照和 hint key——直接删掉 .snap 文件重新生成是最省力的方案。

[click] toMatchFileSnapshot 是 Vitest 独有的，迁回 Jest 需要改写成文件读写+普通 expect。
-->

---
transition: fade-out
---

# 反模式

<v-click>

| 反模式 | 危害 |
| --- | --- |
| 快照过大（整页 HTML） | 沦为「橡皮图章」，变更无法有效审查 |
| 不审查 diff 就 `-u` | 把 bug 固化为新基准 |
| 快照含动态值 | 每次 CI 都失败 |
| 用快照替代精确断言 | 可读性差，意图不明确 |
| `.snap` 进 `.gitignore` | CI 永远失败 |

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 五大反模式各有其危害。最危险的是不审查就 -u——这让快照测试完全失去意义。
-->

---
transition: fade-out
---

# 最佳实践

<v-click>

- **`.snap` 作为 code review 对象**：每个 PR 的快照变更都要仔细审查
- **小而聚焦**：只快照关键子结构，不要整个组件树
- **内联用于小输出**：几行内用 `toMatchInlineSnapshot`，大输出用外部快照
- **动态值用属性匹配器**：`expect.any(Number)` 处理 id/时间戳
- **`.snap` 提交版本库**：不进 `.gitignore`
- **Mock 随机源**：`vi.setSystemTime()` 固定 `Date.now()`，`vi.spyOn(Math, 'random')`

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 六条最佳实践的核心是：把快照当 code review 对象，而不是让 -u 自动通过。
-->

---
transition: fade-out
---

# 优先精确断言，快照兜底

<v-click>

**精确断言更清晰**

```ts
// ✅ 意图明确，失败信息直接
expect(user.name).toBe('Alice')
expect(response.status).toBe(200)

// ⚠️ 快照版本：意图隐藏在文件里
expect(response).toMatchSnapshot()
```

</v-click>

<v-click>

**本项目实践**：quiz 仓库以精确断言为主，未广泛使用快照测试，契合「优先精确断言」原则

</v-click>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 精确断言让测试意图一目了然，失败信息也更直接。快照的价值在于结构回归，不是替代精确断言。

[click] quiz 项目也是这个取向——以精确断言为主，这是业界主流实践。
-->

---
layout: intro
transition: fade-out
---

# 总结

三种写法 · 属性匹配器 · CI 不写快照 · 精确断言优先

- **三种快照**：`toMatchSnapshot`（外部）/ `toMatchInlineSnapshot`（内联）/ `toMatchFileSnapshot`（Vitest 文件）
- **属性匹配器**：处理动态值，`expect.any(Number)` 验类型
- **CI 不写快照**：差异即失败，`.snap` 必须提交版本库
- **更新要审查**：`-u` 前确认 diff，不盲目更新
- **快照当 code review 对象**：每次变更都要仔细看
- **精确断言优先**：快照用于结构回归，不替代逻辑断言

<div class="abs-br m-6 text-xl">
  <a href="https://vitest.dev/guide/snapshot" target="_blank" class="slidev-icon-btn">
    <logos:vitest />
  </a>
  <a href="https://jestjs.io/docs/snapshot-testing" target="_blank" class="slidev-icon-btn">
    <logos:jest />
  </a>
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 {
  background-color: #2B6CB0;
  background-image: linear-gradient(45deg, #2B6CB0 10%, #63B3ED 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
六条核心记忆点：
1. 三种快照写法各有适用场景
2. 属性匹配器是动态值的标准方案
3. CI 不写快照，.snap 必须提交
4. 更新快照前必须审查 diff
5. 快照要当 code review 对象对待
6. 精确断言更清晰，快照用于结构回归
-->

---
layout: end
---
