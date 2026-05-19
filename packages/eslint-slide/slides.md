---
theme: seriph
background: https://cover.sli.dev
title: Welcome to ESLint
info: |
  Presentation ESLint for developers.

  Learn more at [https://eslint.org/](https://eslint.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <logos:eslint class="text-8xl" />
</div>

<br/>

## ESLint：JavaScript 静态分析的事实标准

可插拔规则 + flat config + 庞大插件生态（基于 v10.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 ESLint —— JS / TS 生态最主流的静态分析工具。

它不负责"长得好看"（那是 Prettier 的事），负责"代码有没有逻辑/质量问题"。
-->

---
transition: fade-out
---

# 什么是 ESLint？

可插拔的 JavaScript / TypeScript 静态分析器

<v-click>

- **代码质量层**：找出未使用变量、潜在 bug、不符合规范的写法
- **可配置规则**：每条规则可独立开 / 关 / 设严重级
- **插件生态**：React / Vue / TypeScript / Tailwind 等专属规则
- **`--fix` 自动修复**：可修复的规则一键改正
- **与 Prettier 互补**：Prettier 管"格式"，ESLint 管"质量"

</v-click>

<br>

<div v-click>

```js
// 典型违规示例
const x = 1;                     // x 已声明
const x = 2;                     // ❌ no-redeclare

if (foo == null) {}              // ❌ eqeqeq（应该用 ===）
[1, 2, 3].map(x => x)            // ❌ arrow-parens（应该用括号）
```

</div>

<div v-click text-xs>

_Read more about_ [_What is ESLint?_](https://eslint.org/docs/latest/)

</div>

<style>
h1 {
  background-color: #4B32C3;
  background-image: linear-gradient(45deg, #4B32C3 10%, #8080F2 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] ESLint 的核心是"代码质量检查"，不是"格式化"。
和 Prettier 不重叠：ESLint 抓未使用变量、`==` 这种类型隐式转换，Prettier 管缩进引号。

[click] 典型违规：变量重复声明、用 `==`、箭头函数参数不加括号——这些都是规则可抓的事。
-->

---
transition: fade-out
---

# Flat Config：v9 起的默认

`eslint.config.js` 取代了 `.eslintrc.*`

<v-click>

```js
// eslint.config.js
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: { globals: { ...globals.node } },
    rules: { "no-console": "warn", "eqeqeq": "error" },
  },
];
```

</v-click>

<div v-click>

- 文件名：`eslint.config.{js,mjs,cjs,ts,mts,cts}`，放项目根
- 导出**配置对象数组**；后者覆盖前者
- v10 起 `.eslintrc.*` 完全停止支持

</div>

<div v-click text-xs text-right>

_Read more about_ [_Configuration Files_](https://eslint.org/docs/latest/use/configure/configuration-files)

</div>

<style>
h1 {
  background-color: #4B32C3;
  background-image: linear-gradient(45deg, #4B32C3 10%, #8080F2 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v9 起 flat config 成为默认，配置文件就是一个 JS 模块——可以条件分支、可以拼装、可以 import。

注意必须用 `@eslint/js` 显式 import 预设，字符串 `"eslint:recommended"` 在 flat config 里不工作了。

[click] flat config 的核心特征：扁平数组 + 后者覆盖前者。
v10 进一步把 `.eslintrc.*` 完全移除，老配置必须迁过来。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 安装与第一个 config

最快路径用脚手架，三步可跑

::left::

<v-click>

**脚手架（推荐）**

```bash
pnpm create @eslint/config@latest
```

会询问语言、模块系统、框架，然后写出基础配置。

**手动安装**

```bash
pnpm add -D eslint @eslint/js
```

`@eslint/js` 必装（v9 起 `"eslint:recommended"` 已废弃）

</v-click>

::right::

<v-click>

**运行**

```bash
pnpm exec eslint .                  # 检查所有文件
pnpm exec eslint . --fix            # 自动修复
pnpm exec eslint . --max-warnings=0 # CI 严格模式
```

**退出码**

- `0` 全部通过
- `1` 有 error 或超过 max-warnings
- `2` 配置错误或内部异常

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_Getting Started_](https://eslint.org/docs/latest/use/getting-started)

</div>

<style>
h1 {
  background-color: #4B32C3;
  background-image: linear-gradient(45deg, #4B32C3 10%, #8080F2 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 别全局装 ESLint。插件 / 共享 config 都得装在项目里，不一致就 CI 翻车。
脚手架最快——`pnpm create @eslint/config@latest` 一路 Enter 就能跑。

[click] 三个核心命令：检查、--fix 修复、--max-warnings=0 在 CI 把 warn 也变阻塞。
-->

---
transition: fade-out
---

# 规则严重级

字符串或数字都行

<v-click>

| 取值             | 行为                       |
| ---------------- | -------------------------- |
| `"off"` / `0`    | 关闭                       |
| `"warn"` / `1`   | 警告，不影响退出码         |
| `"error"` / `2`  | 报错，退出码为 1           |

```js
rules: {
  "eqeqeq": ["error", "always"],  // 带选项用数组
}
```

</v-click>

<div v-click>

**行内豁免**（优先级最高，**必须**写理由）：

```js
// eslint-disable-next-line no-console -- 临时调试
```

</div>

<div v-click text-xs text-right>

_Read more about_ [_Configure Rules_](https://eslint.org/docs/latest/use/configure/rules)

</div>

<style>
h1 {
  background-color: #4B32C3;
  background-image: linear-gradient(45deg, #4B32C3 10%, #8080F2 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] off / warn / error 三档，数字写法等价。

[click] 带选项时用数组形式，第一位是严重级，后面是选项。

[click] 行内 disable 优先级最高，但必须写理由（`--` 后的文字）。
代码 review 时遇到没写理由的 disable 直接打回。
-->

---
transition: fade-out
---

# Language Options 与 globals

控制 ESLint 怎么解析代码 + 谁是全局变量

<v-click>

```js
import globals from "globals";

languageOptions: {
  ecmaVersion: "latest",   // 默认 "latest"
  sourceType: "module",    // 默认 "module"
  globals: { ...globals.browser, ...globals.node, myCustom: "readonly" },
}
```

**globals 取值**：`"readonly"` / `"writable"` / `"off"`（旧值 `true`/`false` 已 deprecated）

</v-click>

<div v-click>

::: warning
v10 起 `/* eslint-env browser */` 注释**报错**，必须改用 `globals` 包在 `languageOptions.globals` 里注入。
:::

</div>

<div v-click text-xs text-right>

_Read more about_ [_Language Options_](https://eslint.org/docs/latest/use/configure/language-options)

</div>

<style>
h1 {
  background-color: #4B32C3;
  background-image: linear-gradient(45deg, #4B32C3 10%, #8080F2 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] languageOptions 决定 ESLint 怎么"读懂"你的代码。
默认 ecmaVersion: "latest" + sourceType: "module" 适合现代 ESM 项目。
globals 推荐用 npm 上的 `globals` 包，里面已经预定义了 browser / node / jest 等环境。

[click] 三档取值，写新代码请用字符串而不是 true / false。

[click] v10 后再写 `/* eslint-env browser */` 直接报错，必须改 config。
-->

---
transition: fade-out
---

# Plugins：扩展规则集

`plugins` 是对象：`{ 命名空间: 插件对象 }`

<v-click>

```js
import tseslint from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";

export default [
  ...tseslint.configs.recommended,    // 展开整套预设
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { jsdoc },               // 命名空间 jsdoc
    rules: {
      "jsdoc/require-description": "error",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
```

</v-click>

<div v-click>

- 命名空间约定：去掉 `eslint-plugin-` 前缀；规则引用形如 `命名空间/规则名`
- 预设：插件常带 `recommended` / `strict` 配置组，spread 或 `extends` 加入

</div>

<div v-click text-xs text-right>

_Read more about_ [_Plugins_](https://eslint.org/docs/latest/use/configure/plugins)

</div>

<style>
h1 {
  background-color: #4B32C3;
  background-image: linear-gradient(45deg, #4B32C3 10%, #8080F2 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] plugins 是个对象，key 是命名空间，value 是插件对象。
TypeScript / React / Vue 都通过插件接入。

[click] 命名空间不用纠结，跟着 npm 包名（去掉 eslint-plugin- 前缀）就行——文档里都这么写。
规则引用必须带命名空间前缀，否则跟内置规则冲突。
-->

---
transition: fade-out
---

# 配置合并行为

按数组顺序，每个命中文件的对象都合并，**后者覆盖前者**

<v-click>

```js
export default [
  js.configs.recommended,                          // ① 全局基线
  { files: ["**/*.js"], rules: { "no-console": "warn" } },   // ② 警告
  { files: ["src/server/**/*.js"], rules: { "no-console": "off" } }, // ③ 关闭
];
```

`src/server/a.js` 命中 ①②③，合并后 `no-console` 最终为 `"off"`（③ 覆盖 ②）

</v-click>

<div v-click>

**`extends` 字段**：把多个预设绑定到特定 files

```js
{ files: ["**/*.ts"], extends: [...tseslint.configs.recommended] }
```

**调试**：`pnpm exec eslint --print-config src/server/a.js`

</div>

<style>
h1 {
  background-color: #4B32C3;
  background-image: linear-gradient(45deg, #4B32C3 10%, #8080F2 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 数组顺序就是优先级。所有命中文件的对象按顺序合并，后面的覆盖前面的。

[click] 这里 server 目录的代码允许 console.log，因为第三个对象覆盖了第二个。

[click] extends 字段让我们把"对某类文件生效的多个预设"绑在一起，比把它们摊到顶级数组里更紧凑。

[click] 写完配置不知道实际生效啥？`--print-config <file>` 直接打印合并结果。
-->

---
transition: fade-out
---

# 全局 ignores

只含 `ignores`（+ 可选 `name`）的对象 = 全局 ignores

<v-click>

```js
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist/**", "coverage/**", "**/*.generated.ts"]),
  js.configs.recommended,
]);
```

</v-click>

<div v-click>

- **全局**：单独的 `globalIgnores([...])` 或 `{ ignores: [...] }`，对所有对象生效，可匹配目录
- **局部**：与 `files` / `rules` 同处一个对象，仅当前对象、只匹配文件
- 默认已忽略 `["**/node_modules/", ".git/"]`；`.gitignore` 通过 `@eslint/compat` 的 `includeIgnoreFile()` 集成

</div>

<div v-click text-xs text-right>

_Read more about_ [_Ignore Files_](https://eslint.org/docs/latest/use/configure/ignore)

</div>

<style>
h1 {
  background-color: #4B32C3;
  background-image: linear-gradient(45deg, #4B32C3 10%, #8080F2 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 推荐用 `globalIgnores` helper 让意图清晰。

[click] 关键区别：全局 ignores 能匹配目录、对所有对象生效；局部 ignores 只能匹配文件、仅当前对象。

[click] node_modules 和 .git 已经内置忽略，不用自己加。
.gitignore 可以一键继承，避免规则重复维护。
-->

---
transition: fade-out
---

# 常用 CLI 参数

`eslint . --fix --max-warnings=0`

<v-click>

| 参数                                 | 说明                                          |
| ------------------------------------ | --------------------------------------------- |
| `--fix` / `--fix-dry-run`            | 自动修复（dry-run 不写文件）                  |
| `--max-warnings=0`                   | warn 也阻塞 CI                                |
| `--quiet`                            | v9 起：跳过执行 warn 规则                     |
| `--cache` / `--cache-strategy`       | 启用缓存；默认 `metadata`（Prettier 默认 `content`） |
| `--print-config <file>`              | 打印某文件的最终合并配置                      |
| `--inspect-config`                   | 启动 Config Inspector 可视化                  |

</v-click>

<div v-click text-xs text-right>

_Read more about_ [_CLI Reference_](https://eslint.org/docs/latest/use/command-line-interface)

</div>

<style>
h1 {
  background-color: #4B32C3;
  background-image: linear-gradient(45deg, #4B32C3 10%, #8080F2 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 几个高频参数。
注意 `--quiet` 在 v9 起不只是过滤输出——warn 规则**根本不执行**，性能更好但 CI 行为会变。
缓存策略默认 metadata（按时间戳），Prettier 默认是 content（按内容），别搞混。
`--print-config` 调试合并问题是神器。
-->

---
transition: fade-out
---

# Bulk Suppressions：冻结存量违规

存量代码大、想引入新规则但不想一次性修完，怎么办？

<v-click>

```bash
# 第一次：把当前所有违规快照到文件
pnpm exec eslint . --suppress-all
git add eslint-suppressions.json && git commit
```

</v-click>

<div v-click>

```bash
# 日常 CI：只检查新增违规
pnpm exec eslint .
```

存量违规不再阻塞 CI；任何**新增**的同类违规仍会报错。

</div>

<div v-click>

```bash
# 定期清理：移除"已被修掉"的 suppression 条目
pnpm exec eslint . --prune-suppressions
```

</div>

<div v-click>

- 也可针对特定规则：`--suppress-rule <rule>`
- 自定义位置：`--suppressions-location <path>`（默认 `eslint-suppressions.json`）

</div>

<div v-click text-xs text-right>

_Read more about_ [_Suppressing Violations_](https://eslint.org/docs/latest/use/suppressions)

</div>

<style>
h1 {
  background-color: #4B32C3;
  background-image: linear-gradient(45deg, #4B32C3 10%, #8080F2 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 升级 ESLint 时新规则突然冒几百条违规，是常见痛点。
--suppress-all 把当前违规快照写入 suppressions 文件，相当于"冻结"。

[click] 之后 CI 只检查新增违规，老代码慢慢清。

[click] 修完老代码后用 --prune-suppressions 清理过期条目，避免文件膨胀。
-->

---
transition: fade-out
---

# v9 → v10 升级要点

升级前必看的几条破坏性变更

<v-click>

```bash
# 升级工具（v8 → v9 适用）
pnpm dlx @eslint/migrate-config .eslintrc.json

# 冻结存量违规（避免新规则阻塞）
pnpm exec eslint . --suppress-all
```

</v-click>

<div v-click>

**Node 最低版本**：`^20.19.0` / `^22.13.0` / `>=24`

**`.eslintrc.*` 完全移除**：`ESLINT_USE_FLAT_CONFIG=false` 不再工作

**`eslint:recommended` 新增 3 条**：`no-unassigned-vars` / `no-useless-assignment` / `preserve-caught-error`

**`/* eslint-env */` 注释报错**：改用 `globals` 包

**JSX 引用现在被自动追踪**：`<Card />` 算 `Card` 的引用，消解 `no-unused-vars` 误报

**API 移除**：`context.getCwd()` / `getFilename()` → 用属性 `context.cwd` / `context.filename`

</div>

<div v-click text-xs text-right>

_Read more about_ [_Migrate to v10_](https://eslint.org/docs/latest/use/migrate-to-10.0.0)

</div>

<style>
h1 {
  background-color: #4B32C3;
  background-image: linear-gradient(45deg, #4B32C3 10%, #8080F2 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 升级有 codemod，但跑完还是要手工 review。
冻结存量违规几乎是必备步骤。

[click] 6 条关键变更。最容易踩的是前三条：
- Node 版本要求又抬高
- .eslintrc.* 这次是真没了
- recommended 新增的 3 条规则会让现有代码立刻冒新违规
- /* eslint-env */ 不再忍着报 warn，直接 error
- JSX 自动追踪好事但插件作者要注意
- API 收紧主要影响插件开发者
-->

---
layout: intro
transition: fade-out
---

# 总结

ESLint 是 JS 生态最稳定的"代码质量底座"

- **Flat Config + `defineConfig`** ⇒ 配置可类型化、可组合、易维护
- **规则 + 插件 + `--fix`** ⇒ 覆盖几乎所有主流栈，可自动修复
- **`--print-config` + Config Inspector** ⇒ 复杂项目可调试
- **Bulk Suppressions + `--max-warnings`** ⇒ 渐进式引入、CI 严格

<div class="abs-br m-6 text-xl">
  <a href="https://eslint.org" target="_blank" class="slidev-icon-btn">
    <logos:eslint />
  </a>
  <a href="https://github.com/eslint/eslint" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/frontend-develop-tools/static-analysis/eslint/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #4B32C3;
  background-image: linear-gradient(45deg, #4B32C3 10%, #8080F2 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
ESLint 的全部精华浓缩到几条：
- flat config 让配置写法变得舒服
- 插件生态让你不必从零造规则
- bulk suppressions 让升级变得可行

每个 JS 项目都该有一份 ESLint config。
-->

---
layout: end
---
