---
theme: seriph
background: https://cover.sli.dev
title: Welcome to lint-staged
info: |
  Presentation lint-staged for developers.

  Learn more at [https://github.com/lint-staged/lint-staged](https://github.com/lint-staged/lint-staged)
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

<span class="text-32">🎯</span>

<br/>

## lint-staged: 只检查该检查的 <sup>v17.x</sup>

对暂存文件运行 lint，让每次提交又快又干净

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天聊聊 lint-staged —— 一个让你的 git commit 更快、更干净的工具。

为什么需要它？怎么用？马上开始！
-->

---
layout: image-right
transition: fade-out
image: https://cover.sli.dev
---

# 为什么需要 lint-staged?

全量 lint 太慢？只检查改动的文件！

<v-clicks>

- 痛点：项目越大，`eslint .` 越慢，提交前等得心焦
- 解决方案：lint-staged 只对 **git 暂存区**的文件执行检查
- 优势：速度快、配置简单、与 Husky 完美配合

</v-clicks>

<br>

<div v-click text-xs text-right>

_Read more about_ [_lint-staged_](https://github.com/lint-staged/lint-staged)

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
有没有遇到过提交前跑 lint，等了几分钟，结果只改了一个文件？

lint-staged 就是来拯救你的！只检查你改动的文件，速度飞快！
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# 安装与快速上手

几步让 lint-staged 跑起来

::left::

<div v-click>

- **安装**

  ```bash
  pnpm add -D lint-staged
  ```

</div>

<div v-click>

- **添加配置**（package.json）

  ```json
  {
    "lint-staged": {
      "*.{js,ts}": "eslint --fix"
    }
  }
  ```

</div>

::right::

<div v-click>

- **手动测试**

  ```bash
  pnpm exec lint-staged
  ```

</div>

<div v-click>

- **与 Husky 集成**

  ```bash
  echo "pnpm exec lint-staged" > .husky/pre-commit
  ```

  <div class="text-xs text-gray">

  _提交时自动运行，无需手动触发_

  </div>

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_Getting Started_](https://github.com/lint-staged/lint-staged#installation-and-setup)

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
安装很简单，pnpm add -D 就行。

配置写在 package.json 里就好，跟 Husky 一搭配，提交自动检查！
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# 配置文件格式

支持多种方式，按需选择

::left::

<div v-click>

- **package.json**
 
  ```json
  { "lint-staged": { "*.js": "eslint" } }
  ```

</div>

<div v-click>

- **.lintstagedrc.json**

  ```json
  { "*.js": "eslint" }
  ```

</div>

<div v-click>

- **lint-staged.config.mjs**

  ```js
  export default {
    '*.js': 'eslint --fix'
  }
  ```

</div>

::right::

<div v-click>

- **TypeScript** ✨

  ```ts
  // lint-staged.config.ts
  import type { Configuration } from 'lint-staged'

  const config: Configuration = {
    '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
    '*.css': ['stylelint --fix', 'prettier --write'],
  }
  export default config
  ```

  <div class="text-xs text-gray">

  _Node.js ≥ 22.6.0 支持原生执行 TS_

  </div>

</div>

::bottom::

<div v-click text-xs text-right>

_还支持 .lintstagedrc.yaml、.lintstagedrc.cjs、lint-staged.config.cjs 等格式_

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
配置方式很多。推荐用 TypeScript 配置，类型安全又好用。

Node 22.6+ 直接跑 TS，低版本需要加 --experimental-strip-types。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# Glob 匹配与文件筛选

精确控制哪些文件需要检查

::left::

<div v-click>

- **不含 `/`** — 只匹配文件名

  ```json
  {
    "*.js": "eslint",
    "!(*test).js": "eslint"
  }
  ```

</div>

<div v-click>

- **含 `/`** — 匹配完整路径

  ```json
  {
    "src/**/*.{ts,vue}": "eslint --fix",
    "./*.js": "eslint"
  }
  ```

</div>

<div v-click text-xs text-gray mt-4>

_使用 picomatch 进行 glob 匹配，支持否定模式_

</div>

::right::

<div v-click>

- **函数式配置**（高级）

  ```js
  export default {
    '*.{js,ts}': (files) => [
      `eslint --fix ${files.join(' ')}`
    ]
  }
  ```

  <div class="text-xs text-gray">

  _函数签名：`(filenames: string[]) => string | string[]`_

  </div>

</div>

<div v-click>

- **文件过滤流程**

  1. 自动解析 Git 根目录
  2. 获取暂存区文件
  3. 应用 Glob 过滤
  4. 传递**绝对路径**给任务

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-text-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
glob 匹配让你精确控制哪些文件需要检查。

不含斜杠只看文件名，含斜杠看完整路径。函数式配置更强大！
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# 与 Husky 联动实战

pre-commit 自动检查的完整流程

::left::

<div v-click>

- **第一步：初始化 Husky**

  ```bash
  pnpm add -D husky
  pnpm exec husky init
  ```

</div>

<div v-click>

- **第二步：配置 pre-commit**

  ```bash
  # .husky/pre-commit
  pnpm exec lint-staged
  ```

</div>

::right::

<div v-click>

- **第三步：提交代码**

  ```bash
  git add .
  git commit -m "feat: add login"
  ```

  lint-staged 自动运行 ✅

</div>

<div v-click>

- **完整流程**

  ```
  git commit
    → Husky 触发 pre-commit
      → lint-staged 读取配置
        → 只检查暂存文件
          → 通过 ✅ / 失败 ❌
  ```

</div>

::bottom::

<div v-click text-xs text-right>

_三步搞定：安装 Husky → 配置钩子 → 提交时自动检查_

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-text-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
来看看实际怎么配合 Husky 使用的。

装好 Husky，配好 pre-commit 钩子，提交时自动跑 lint-staged。搞定！
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# 常见用例

不同工具的最佳搭配

::left::

<div v-click>

- **ESLint + Prettier**

  ```json
  {
    "*.{js,ts,vue}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
  ```

</div>

<div v-click>

- **Stylelint**

  ```json
  {
    "*.{css,scss}": [
      "postcss --replace",
      "stylelint --fix"
    ]
  }
  ```

</div>

::right::

<div v-click>

- **TypeScript 类型检查**

  ```json
  {
    "*.{ts,tsx}": [
      "() => tsc --noEmit",
      "eslint --fix"
    ]
  }
  ```

  <div class="text-xs text-gray">

  _用函数阻止传递文件参数给 tsc，避免忽略 tsconfig_

  </div>

</div>

<div v-click>

- **图片压缩**

  ```json
  {
    "*.{png,jpg,gif,svg}": "imagemin-lint-staged"
  }
  ```

</div>

::bottom::

<div v-click text-xs text-right>

_先 lint 后 format，修改后 lint-staged 自动 git add_

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-text-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
常见工具的搭配示例。注意 tsc 要用函数包裹，防止 lint-staged 传文件参数导致忽略 tsconfig。

执行完 lint-staged 会自动 git add 修改后的文件。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# 并发与性能

任务执行策略

::left::

<v-clicks>

- **默认并发执行**

  不同 glob 模式的任务同时运行

- **数组 = 顺序执行**

  ```json
  {
    "*.ts": ["prettier --write", "eslint"]
  }
  ```

- **限制并发数**

  ```bash
  lint-staged --concurrent 2
  ```

- **完全禁用并发**

  ```bash
  lint-staged --concurrent false
  ```

</v-clicks>

::right::

<div v-click>

- **⚠️ 规避规则重叠**

  ```json
  // ❌ 可能竞争：* 和 *.ts 都匹配 .ts 文件
  {
    "*": "prettier --write",
    "*.ts": "eslint --fix"
  }

  // ✅ 方案1：否定模式
  {
    "!(*.ts)": "prettier --write",
    "*.ts": ["eslint --fix", "prettier --write"]
  }

  // ✅ 方案2：限制并发
  // lint-staged --concurrent false
  ```

</div>

<div v-click text-xs text-gray mt-2>

_当 glob 模式重叠且任务会修改文件时，注意竞争条件_

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-text-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
lint-staged 默认并发执行，速度快。但要注意 glob 重叠时的文件竞争问题。

用否定模式或者限制并发来解决。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# 进阶用法

函数配置的强大之处

::left::

<div v-click>

- **大量文件时切换全量检查**

  ```js
  export default {
    '**/*.js': (files) =>
      files.length > 10
        ? 'eslint .'
        : `eslint ${files.join(' ')}`
  }
  ```

</div>

<div v-click>

- **函数式导出整个配置**

  ```js
  export default (allStagedFiles) => {
    const tsFiles = allStagedFiles
      .filter(f => f.endsWith('.ts'))
    return [`eslint ${tsFiles.join(' ')}`]
  }
  ```

  <div class="text-xs text-gray">

  _接收全部暂存文件，自由处理_

  </div>

</div>

::right::

<div v-click>

- **对象格式任务**（v16+）

  ```js
  export default {
    '*.js': {
      title: '🔍 Checking JS files',
      task: async (files) => {
        return `eslint ${files.join(' ')}`
      }
    }
  }
  ```

  <div class="text-xs text-gray">

  _自定义任务标题，输出更友好_

  </div>

</div>

<div v-click text-xs text-gray mt-2>

_函数签名：`(filenames: string[]) => string | string[] | Promise<string | string[]>`_

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-text-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
函数配置非常灵活：文件多就全量检查，还可以自定义任务标题。

v16+ 的对象格式让输出更美观。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# Monorepo 中使用

每个包独立配置

::left::

<div v-click>

- **目录结构**

  ```
  monorepo/
  ├── packages/
  │   ├── frontend/
  │   │   └── .lintstagedrc.json
  │   └── backend/
  │       └── .lintstagedrc.json
  ├── .lintstagedrc.json
  └── package.json
  ```

</div>

<div v-click>

- **就近匹配原则**

  提交 `packages/frontend/index.js` → 只使用 frontend 的配置

</div>

::right::

<div v-click>

- **⚠️ Monorepo 注意事项**

  - 使用离文件**最近的配置文件**
  - 不会回退到父级配置
  - 空匹配 = 跳过执行
  - 根配置的 `"*.md"` 不会在子包生效

</div>

<div v-click text-xs text-gray mt-2>

_pnpm workspace 中每个包独立配置，互不干扰_

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-text-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
monorepo 中 lint-staged 用就近匹配原则，每个包独立配置。

注意不会回退到父级，空匹配直接跳过。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# 忽略文件

交给工具本身处理

::left::

<div v-click>

- **忽略文件原则**

  lint-staged **不负责忽略**，交给工具本身：
  - ESLint → `eslint.config.js` 的 `ignores`
  - Prettier → `.prettierignore`

</div>

<div v-click>

- **ESLint Flat Config 推荐**

  ```json
  {
    "*.{js,ts}": "eslint --no-warn-ignored"
  }
  ```

  <div class="text-xs text-gray">

  _Flat Config 下 `--no-warn-ignored` 最简洁_

  </div>

</div>

::right::

<div v-click>

- **ESLint 传统配置（v7+）**

  ```js
  import { ESLint } from 'eslint'

  const removeIgnored = async (files) => {
    const eslint = new ESLint()
    const ignored = await Promise.all(
      files.map(f => eslint.isPathIgnored(f))
    )
    return files.filter((_, i) => !ignored[i])
  }

  export default {
    '**/*.{js,ts}': async (files) => {
      const toLint = await removeIgnored(files)
      return toLint.length
        ? [`eslint ${toLint.join(' ')}`]
        : []
    }
  }
  ```

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-text-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
忽略文件不应该在 lint-staged 里做，交给 ESLint 和 Prettier 自己处理。

Flat Config 用 --no-warn-ignored 最简单。传统配置需要用 isPathIgnored 过滤。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# CLI 参数

调试与控制

::left::

<div v-click>

- **常用 CLI 参数**

  <div class="text-xs leading-tight">

  | 参数 | 说明 |
  |------|------|
  | `--debug` | 打印调试信息 |
  | `--verbose` | 显示成功任务输出 |
  | `--concurrent` | 控制并发 |
  | `--allow-empty` | 允许空提交 |
  | `--relative` | 传递相对路径 |
  | `--diff` | CI 中指定差异范围 |

  </div>

</div>

::right::

<div v-click>

- **跳过检查**

  ```bash
  git commit --no-verify
  ```

</div>

<div v-click>

- **调试模式**

  ```bash
  DEBUG=lint-staged* pnpm exec lint-staged
  ```

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-text-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
CLI 参数不多但实用。--diff 在 CI 中常用，--debug 调试时必用。

跳过检查用 --no-verify，但尽量少用。
-->

---
layout: image-left
transition: fade-out
image: https://cover.sli.dev
---

# CI 中的使用

不在 pre-commit，而在 CI 流水线中检查

<div v-click>

- **检查分支差异**

  ```bash
  npx lint-staged --diff="origin/main...HEAD"
  ```

</div>

<div v-click>

- **使用 merge-base**

  ```bash
  npx lint-staged --diff="$(git merge-base main HEAD)"
  ```

</div>

<div v-click>

- **`--fail-on-changes`**

  ```bash
  npx lint-staged --fail-on-changes
  ```

  <div class="text-xs text-gray">

  _任务修改文件后以退出码 1 失败，配合 `--no-revert` 保留修改_

  </div>

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-text-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
lint-staged 不只是 pre-commit 工具，CI 里也能用。

--diff 指定检查范围，--fail-on-changes 确保代码格式一致。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# Node.js API

在代码中直接调用 lint-staged

::left::

<div v-click>

```typescript
import lintStaged from 'lint-staged'

const success = await lintStaged({
  allowEmpty: false,
  concurrent: true,
  configPath: './lint-staged.config.ts',
  cwd: process.cwd(),
  debug: false,
  quiet: false,
  verbose: false,
})

console.log(
  success ? '✅ Passed!' : '❌ Failed!'
)
```

</div>

::right::

<div v-click>

- **直接传配置对象**

  ```typescript
  await lintStaged({
    config: {
      '*.js': 'eslint --fix'
    }
  })
  ```

</div>

<div v-click>

- **适用场景**

  - 自定义构建工具集成
  - 编写项目脚手架
  - 程序化控制 lint 流程

</div>

::bottom::

<div v-click text-xs text-right>

_API 支持所有 CLI 参数，灵活度更高_

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-text-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
lint-staged 还有 Node.js API，可以在代码里直接调用。

适合做自定义工具集成或者脚手架。
-->

---
transition: fade-out
---

# v17 升级要点

v16 → v17 的破坏性变更

<v-clicks>

- **Node.js ≥ 22.22.1**（v16 还兼容 Node 20）—— 升级前先把 CI 镜像 + 同事机器升上去
- **Git ≥ 2.32.0**（2021 年版本，基本不会卡住）
- **`yaml` 依赖改为可选**：用 `.lintstagedrc.yaml` 的项目要 `pnpm add yaml`
- **新增 `--hide-all` flag**：隐藏未暂存改动 + 未跟踪文件，给 Knip / depcheck 用
- **CLI 解析器从 `commander` 换原生 `node:util.parseArgs`**：bundle 更小
- **改用 `git update-index --again`** 替代 `git add <files>`：对 worktree / 自定义 index 更稳
- **Bun runtime 全测试通过**：`bunx lint-staged` 可放心用

</v-clicks>

<div v-click text-xs class="mt-4">

_配置里有手动 `git add` 的会触发 warning—— v17 起 lint-staged 自动入暂存，删掉即可_

</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
v17 是个 major bump，要看清楚再升。

最硬的限制是 Node 必须 22.22.1+，不少 CI 镜像还在 Node 20，得先升。

最有用的新功能是 --hide-all，专门给扫死代码工具用。
-->

---
layout: intro
transition: fade-out
---

# 总结与推荐

让 lint-staged 成为你的提交守门员

- ⚡ 只检查暂存文件，提交快如闪电
- 🔧 灵活配置，适配任何工具链
- 🐶 与 Husky 完美搭档，自动化无感
- 🏗️ Monorepo 就近匹配，按包独立配置
- 🚀 CI 中 `--diff` 检查分支差异

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/lint-staged/lint-staged" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/engineering/devops/lint-staged/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-text-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一下：lint-staged 让你的提交检查又快又准。

配上 Husky，用起来完全无感。推荐所有项目都用起来！
-->

---
layout: end
---
