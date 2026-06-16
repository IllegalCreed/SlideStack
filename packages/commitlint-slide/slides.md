---
theme: seriph
background: https://cover.sli.dev
title: Welcome to commitlint
info: |
  Presentation about commitlint for developers.

  Learn more at [https://commitlint.js.org/](https://commitlint.js.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# commitlint

校验 Git 提交信息的 Linter，强制 Conventional Commits（基于 v21.0.2）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/conventional-changelog/commitlint" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天聊 commitlint —— 一个专门校验 Git 提交信息的 Linter。
它怎么用、规则怎么配、和 husky 是什么关系？一起看看。
-->

---
transition: fade-out
---

# 什么是 commitlint？

校验 commit message 是否符合约定格式的 Linter

<v-clicks>

- 职责单一：只判断「提交信息」是否合规，**不改代码、不管钩子、不做格式化**
- 默认对接 **Conventional Commits**：`type(scope): subject`
- 装上 `@commitlint/cli` + `config-conventional`，一行 `extends` 即可强制约定
- 让提交历史一致、可被工具消费（生成 changelog、自动升版本号）

</v-clicks>

<div v-click="'+1'" text-xs mt-4>

_Read more about_ [_commitlint_](https://commitlint.js.org/)

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #065f46 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
commitlint 是一个校验提交信息的 Linter。

[click] 它职责非常单一，只看消息合不合规，不碰代码、不管钩子、不做格式化。

[click] 默认对接 Conventional Commits 规范，格式就是 type、可选的 scope、冒号加描述。

[click] 装两个包、写一行 extends 就能强制团队按约定提交。

[click] 这样提交历史就整齐了，还能被下游工具用来生成 changelog、自动升版本。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与上手

CLI 本体 + 规则集，缺一不可

::left::

<div v-click>

- **安装**：

  ```bash
  npm i -D @commitlint/cli \
           @commitlint/config-conventional
  ```

</div>

<div v-click>

- **配置** `commitlint.config.js`：

  ```js
  export default {
    extends: ["@commitlint/config-conventional"],
  };
  ```

</div>

::right::

<div v-click>

- **试跑**（默认读 stdin）：

  ```bash
  echo 'foo: bar' | npx commitlint   # 失败
  echo 'feat: x'  | npx commitlint   # 通过
  ```

</div>

<div v-click>

<span text-sm>`@commitlint/cli` 是引擎，`config-conventional` 是规则。只装 CLI 等于有引擎没规则。</span>

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #065f46 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
上手很简单。

[click] 装两个包：CLI 本体和约定式规则集。

[click] 项目根写 commitlint.config.js，内容就一行 extends。

[click] 它默认从标准输入读消息，用管道喂一下：foo 不是合法 type 会失败，feat 通过。

[click] 记住引擎和规则要配套，只装 CLI 是不够的。
-->

---
transition: fade-out
---

# 一条合法提交长什么样

`type(scope): subject` + 可选 body / footer

<div v-click>

```text
feat(api): add login endpoint

详细说明写在 body（与 header 空一行）。

BREAKING CHANGE: auth header 格式已变更
```

</div>

<v-clicks>

- **type**：变更类别，须是枚举之一（`feat`/`fix`/`docs`/`chore`…）
- **scope**：可选，影响范围；**subject**：默认小写开头、不以句号结尾
- **破坏性变更**：type 后加 `!`（`feat!:`）或 footer 写 `BREAKING CHANGE:`

</v-clicks>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #065f46 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
一条合法提交长这样。

[click] 首行是 type 加可选 scope 加描述，下面可以有 body 和 footer，各部分空行分隔。

[click] type 必须是约定枚举之一；scope 可选；subject 默认要小写开头、不带句号。

[click] 要标记破坏性变更，type 后加感叹号，或者在 footer 写 BREAKING CHANGE，这会驱动主版本升级。
-->

---
layout: image-right
transition: fade-out
image: https://cover.sli.dev
---

# 规则三元组

`[level, applicable, value]`

<div v-click>

```js
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["feat", "fix"]],
    "header-max-length": [2, "always", 72],
    "subject-empty": [2, "never"],
  },
};
```

</div>

<v-clicks>

- `level`：`0` 关 / `1` 警告 / `2` 错误
- `applicable`：`always` 必须 / `never` 反转
- 本地 `rules` 覆盖 `extends` 继承值

</v-clicks>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #065f46 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
规则怎么写？每条都是一个三元组。

[click] 比如限制 type 枚举、首行最长 72、subject 不能为空。

[click] 第一个是 level：0 关、1 警告、2 错误。

[click] 第二个是 applicable：always 是必须满足，never 把条件反转，比如「绝不能为空」。

[click] 第三个是比较值。本地 rules 会覆盖 extends 继承来的同名规则。
-->

---
transition: fade-out
---

# config-conventional 默认规则

约定式规则集的关键默认值

<div v-click>

| 规则                | 默认                                   |
| ------------------- | -------------------------------------- |
| `type-enum`         | feat/fix/docs/style/refactor/test/…    |
| `type-empty`        | `never`（不能空）                      |
| `subject-case`      | 禁 sentence/start/pascal/upper-case    |
| `subject-full-stop` | `never '.'`（不以句号结尾）            |
| `header-max-length` | `72`                                   |

</div>

<div v-click text-xs mt-2>

_`fix(scope): Some message` 失败（句首大写）；`fix(scope): some message` 通过。_

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #065f46 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
约定式规则集里有哪些关键默认值？

[click] type 必须在枚举内、不能为空；subject 不能用句首大写或全大写，也不能以句号结尾；首行最长 72 字符。

[click] 举例：fix 加大写开头的描述会失败，小写开头才通过。这些就是你装上 config-conventional 后自动生效的约束。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 接入本地：husky

挂在 `commit-msg` 钩子

::left::

<div v-click>

### 安装（husky v9）

```bash
npm i -D husky
npx husky init
```

<span text-xs text-gray>v8 用 `husky install`</span>

</div>

::right::

<div v-click>

### `.husky/commit-msg`

```bash
npx --no -- commitlint --edit $1
```

<span text-xs text-gray>`--edit $1` 读 Git 传入的消息文件</span>

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #065f46 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
怎么在本地提交时自动校验？用 husky。

[click] husky v9 装好后跑 husky init，会建好 .husky 目录；v8 用的是 husky install。

[click] 然后让 commit-msg 钩子里跑这条命令。为什么是 commit-msg？因为它在消息写好、提交前触发，正好拿得到消息。--edit $1 就是读 Git 传进来的消息文件。
-->

---
transition: fade-out
---

# 边界：commitlint vs husky vs lint-staged

三者配合，但职责不同

<div v-click>

| 工具         | 角色           | 干什么                       |
| ------------ | -------------- | ---------------------------- |
| `commitlint` | 校验本体       | 判断 commit message 合不合规 |
| `husky`      | Git 钩子管理器 | 在某个 Git 事件触发命令      |
| `lint-staged`| 暂存文件调度器 | 只对 `git add` 的文件跑命令  |

</div>

<v-clicks>

- commitlint 只看消息、不碰文件；lint-staged 只处理文件、不看消息
- commitlint 做「校验判定」→ 归**静态分析**；husky 只触发 → 归**工程化**

</v-clicks>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #065f46 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这三个工具经常一起出现，但职责完全不同，别混。

[click] commitlint 是校验本体，判断消息合不合规；husky 是钩子管理器，只负责在某个事件触发命令；lint-staged 是暂存文件调度器，只对 add 过的文件跑命令。

[click] 一句话：commitlint 只看消息、lint-staged 只处理文件。commitlint 做校验判定，所以归静态分析；husky 只触发、不做判定，归工程化。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8 grid-rows-[100px_1fr_40px]!
---

# 接入 CI：兜底门禁

本地钩子可被 `--no-verify` 绕过

::left::

<div v-click>

### push 事件

```bash
npx commitlint --last --verbose
```

<span text-xs text-gray>只校验最后一次提交</span>

</div>

::right::

<div v-click>

### Pull Request

```bash
npx commitlint \
  --from <base> --to <head> --verbose
```

<span text-xs text-gray>校验一段提交范围</span>

</div>

::bottom::

<div v-click text-xs text-right>

_GitHub Actions 记得 `fetch-depth: 0`；想对警告也失败加 `--strict`_

</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #065f46 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
本地钩子能被 git commit --no-verify 跳过，所以一定要在 CI 兜底。

[click] push 事件用 --last 校验最后一次提交。

[click] PR 用 --from --to 校验一段范围。

[click] GitHub Actions 里 checkout 要设 fetch-depth: 0 才能拿到完整历史；想让警告也让 CI 失败，加 --strict。
-->

---
layout: intro
transition: fade-out
---

# 结尾与号召

让提交历史整齐到可被工具消费

- 两个包 + 一行 `extends`，约定式提交立即生效
- husky 管本地、CI 做兜底，双层门禁
- 现在就 `npm i -D @commitlint/cli @commitlint/config-conventional`！

<div class="abs-br m-6 text-xl">
  <a href="https://commitlint.js.org/" target="_blank" class="slidev-icon-btn">
    <carbon:earth />
  </a>
  <a href="https://github.com/conventional-changelog/commitlint" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/frontend-develop-tools/static-analysis/commitlint/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #0f766e;
  background-image: linear-gradient(45deg, #14b8a6 10%, #065f46 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这就是 commitlint。

两个包加一行 extends，约定式提交立刻生效；husky 管本地、CI 做兜底，形成双层门禁。

现在就装上试一试吧！文档、GitHub、笔记链接都在下面。
-->

---
layout: end
---
