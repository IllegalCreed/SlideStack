---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Husky
info: |
  Presentation Husky for developers.

  Learn more at [https://typicode.github.io/husky/](https://typicode.github.io/husky/)
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

<span class="text-32">🐶</span>

<br/>

## Husky: 提升你的提交代码体验 <sup>v9.x</sup>

自动检查您的提交信息、代码，并在提交或推送时运行测试

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天我们要聊的是 Husky —— 一个可以提升你的提交代码体验的工具。

它是怎么做到的？为什么值得一试？让我们马上开始！
-->

---
layout: image-right
transition: fade-out
image: https://cover.sli.dev
---

# 为什么选择 Husky?

Git 提交的智能助手

<v-clicks>

- 痛点：手动检查代码和提交信息费时又易出错
- 解决方案：Husky 自动化 `pre-commit` 和 `pre-push` 钩子
- 优势：轻量、易集成、跨平台支持

</v-clicks>

<br>

<div v-click text-xs text-right>

_Read more about_ [_Introduction_](https://typicode.github.io/husky/)

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
手动检查代码和提交信息是不是很头疼？

Husky 帮你自动搞定 pre-commit 和 pre-push，省时又可靠！

想知道怎么用？一起来看看吧！
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# 安装与配置 Husky

几个步骤让 Husky 跑起来

::left::

<div v-click>

- **安装**:

  ```bash
  pnpm add -D husky
  ```

</div>

<div v-click>

- **初始化**

  ```bash
  pnpm exec husky init
  ```

</div>

::right::

<div v-click>

- **验证**

  ```bash
  git commit -m "Keep calm and commit"
  ```

</div>

<div v-click>

- **临时禁用 Husky**

  ```bash
  HUSKY=0 git commit -m "test"
  ```

  <div class="text-xs text-gray">

  _如果想要临时禁用 Husky 的钩子，可以设置环境变量_ `HUSKY=0`

  </div>

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_Get Started_](https://typicode.github.io/husky/get-started.html)

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
准备好让 Husky 上场了吗？

用 pnpm 三步搞定：安装、初始化、添加测试钩子，提交就能自动检查！ 

简单又高效！
-->


---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# 集成 lint-staged

只对暂存文件运行钩子脚本，让提交更高效

::left::

<div v-click>

- **安装**:

  ```bash
  pnpm add -D lint-staged
  ```

</div>

<div v-click>

- **配置**:

  ```json
  // package.json
  "lint-staged": {
    "*.{js,ts,vue}": [
      "eslint --fix",
      "prettier --write",
    ]
  }
  ```

  <div class="text-xs text-gray">

  _先执行 Lint，后执行格式化_

  </div>

</div>

::right::

<div v-click>

- **与 Husky 搭配**

  ```bash
  echo "pnpm lint-staged" >> .husky/pre-commit
  ```

  <div class="text-xs text-gray">

  _确保编码为_ `UTF-8`

  </div>

</div>

::bottom::

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
想让提交代码更规范？

lint-staged 只检查暂存文件，配合 Husky 自动运行 ESLint 和 Prettier！  

几行配置，效率翻倍！
-->


---
layout: image-left
transition: fade-out
image: https://cover.sli.dev
---

# 配合 CI 使用

CI 设置 `HUSKY=0` 禁用 Husky 钩子

<div v-click>

- **GitLab CI**

  ``` yaml
  variables:
    HUSKY: "0"
  ```

</div>

<div v-click>

- **GitHub Actions**

  ``` yaml
  # https://docs.github.com/en/actions/learn-github-actions/variables
  env:
    HUSKY: 0
  ```
</div>

<br>

<div v-click text-xs text-right>

_Read more about_ [_CI server and Docker_](https://typicode.github.io/husky/how-to.html#ci-server-and-docker)

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
不想让 Husky 干扰 CI 构建？

CI 设置 `HUSKY=0` 禁用 Husky 钩子！

让 CI 更安全，更高效！
-->


---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# 更多 Git 钩子

支持多种 Git 钩子，灵活定制流程

::left::

<div v-click>

- **常见钩子**

  - pre-commit：提交前检查
  - commit-msg：验证消息
  - pre-push：推送前校验

</div>

<br>

<div v-click>

更多：请参阅 [https://git-scm.com/docs/githooks](https://git-scm.com/docs/githooks)

</div>

::right::

<div v-click>

- **添加新钩子**

  ```bash
  echo "npm test" > .husky/pre-commit
  ```

</div>

::bottom::

<div v-click text-xs text-right>

 _Read more about_ [_Adding a New Hook_](https://typicode.github.io/husky/how-to.html#adding-a-new-hook)

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
想定制 Git 流程？

Husky 支持十几种钩子，像 pre-commit、commit-msg 随便加！

添加新钩子，一行命令搞定！
-->


---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# 最佳实践

让 Husky 用得更顺手

::left::

<div v-click>

- **启动文件**

  ```bash
  ~/.config/husky/init.sh
  ```

  <div class="text-xs text-gray">

  _Husky 允许你在运行钩子之前执行本地命令_

  </div>

</div>

<div v-click>

- **非 shell 钩子**

  ```bash
  # .husky/pre-commit

  node .husky/pre-commit.js
  ```

  <div class="text-xs text-gray">

  _Husky 允许你用 Python、Node.js 写钩子，灵活扩展_

  </div>

</div>
 
::right::

<div v-click>

- **中断提交**

  ```bash
  # .husky/pre-commit

  # Your WIP script
  # ...

  exit 1
  ```

  <div class="text-xs text-gray">

  _将 exit 1 添加到钩子脚本中以中止 Git 命令，用于测试_

  </div>

</div>

::bottom::

<div v-click text-xs text-right>

 _Read more about_ [_how-to_](https://typicode.github.io/husky/how-to.html)

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
想让 Husky 更高效？

Husky 支持启动文件、中断提交、非 shell 钩子等多种用法。

让 Husky 用得更顺手！
-->


---
layout: intro
transition: fade-out
---

# 结尾与号召

让 Husky 守护你的提交！

- 自动化检查，提升代码质量
- 简单集成，适配各种项目
- 现在就试试，提交从此省心！

<div class="abs-br m-6 text-xl">
  <a href="https://typicode.github.io/" target="_blank" class="slidev-icon-btn">
    🐶
  </a>
  <a href="https://github.com/typicode/husky" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/engineering/devops/husky/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
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


---
layout: end
---
