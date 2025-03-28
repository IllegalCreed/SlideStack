---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Prettier
info: |
  Presentation prettier for developers.

  Learn more at [https://prettier.io/](https://https://prettier.io/)
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
---

<LightOrDark>
  <template #light>
    <img class="mx-auto h-40" src="/prettier-wide-light.svg" alt="Light Logo" />
  </template>
  <template #dark>
    <img class="mx-auto h-40" src="/prettier-wide-dark.svg" alt="Dark Logo" />
  </template>
</LightOrDark>

<br/>

## Prettier: 让代码美得毫不费力

代码格式化的最佳伙伴

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天我们要聊的是 Prettier——一个让你的代码瞬间变美、毫不费力的工具。
它是怎么做到的？为什么值得一试？让我们马上开始！
-->

---
transition: fade-out
---

# 什么是 Prettier？

Prettier 是帮助我们按主流标准统一代码风格的格式化神器

<v-clicks>

- 「固执己见」 的风格，极简配置；自带规则；告别争论
- 支持 Web 开发常用语言：`JS`、`TS`、`CSS` 等
- 集成编辑器插件，一键格式化轻松搞定

</v-clicks>
  
<br>

<div v-click>

```js {none|1,2|4-8|}{at:5}
// 未格式化
function hello(name){console.log("Hello," + name);return name;}

// 格式化后
function hello(name) {
  console.log("Hello, " + name);
  return name;
}
```

</div>

<div v-click="'+4'" text-xs>

_Read more about_ [_What is Prettier?_](https://prettier.io/docs/)

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
Prettier 是什么？

它是一个帮我们把代码风格统一到主流标准的利器，简单又好用。

[click] 它的配置非常少，自带一套规则，开箱即用，不需要我们反复调整。

[click] 它支持 Web 开发中常见的语言，比如 JavaScript、CSS 等等。

[click] 更棒的是，搭配编辑器插件，保存一下，代码就自动变得整齐漂亮。

[click] 就像这个例子，乱糟糟的代码瞬间焕然一新。
-->

---
transition: fade-out
---

# Prettier 核心规则

美化代码，逻辑如一

<v-clicks>

- 缩进一致，层次分明
- 换行合理，长代码更清晰
- 引号统一，风格无争议
- 空格规范，细节更整齐

</v-clicks>

<br>

<div v-click>

````md magic-move {at:6}
```js
const greet=(name)=>{const words={prefix: "Hello",suffix: "welcome"};return words.prefix+name+words.suffix;};
```

```js
const greet = (name) => {
  const words = {
    prefix: "Hello",
    suffix: "welcome",
  };
  return words.prefix + 
    name + 
    words.suffix;
};
```
````

</div>

<div v-click="'+2'" text-xs>

_Read more about_ [_rationale_](https://prettier.io/docs/rationale/)

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
Prettier 的核心规则是什么？

[click] 它让代码更美观，但保证逻辑始终如一。

[click:4] 比如这段代码，输入时缩进混乱、引号混杂、空格随意，还挤在一行，

[click] Prettier 格式化后，缩进整齐、换行清晰、引号统一、空格规范， 但函数的功能一点没变，只是变得更好看。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 安装与运行 Prettier

快速上手，轻松格式化

::left::

<div v-click>

- **安装**:

  ```bash
  pnpm add -D -E prettier
  ```

  <span text-xs text-gray>

  `-E` _表示精确版本，锁定依赖, 避免依赖升级导致团队间版本不一致。_

  </span>

</div>

<div v-click>

- **运行**:

  ```bash
  pnpm exec prettier . --write
  ```

  <span text-xs>

  格式化当前目录所有文件

  </span>

</div>

::right::

<div v-click>

- **CLI 常见指令**

  - 检查格式：`--check`
  - 指定配置文件：`--config .prettierrc`
  - 忽略配置文件：`--no-config`
  - 指定文件全名：`--stdin-filepath x.js`
  - 忽略未知类型：`--ignore-unknown`

<br>

</div>

<div v-click>

- **API 调用**

```js
import * as prettier from "prettier";

prettier.format(source, options);
```

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_install_](https://prettier.io/docs/install/)

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
Prettier 的安装和运行超简单！

[click] 用 pnpm 安装，`-D` 表示开发依赖

`-E` 锁定精确版本，避免意外升级。

[click] 然后运行 `pnpm exec prettier . --write`，就能一键格式化所有文件。

[click] CLI 还支持检查格式、指定配置、忽略未知文件等实用选项。

[click] 想更灵活？可以用 API，像 `prettier.format` 直接在代码里调用！

-->

---
layout: image-right
transition: fade-out
image: https://cover.sli.dev
---

# Prettier 配置

个性化你的格式化规则

<div v-click>

<br>

- **配置文件格式**: `JSON`, `YAML`, `JS` 等

</div>

<div v-click>

- **默认配置文件**: `.prettierrc`

</div>

<div v-click>

```json
{
  "singleQuote": true,
  "semi": false,
  "tabWidth": 2,
  "printWidth": 80,
  "arrowParens": "avoid"
}
```

<span class="text-sm text-gray text-right">

_非必要不修改_

</span>

</div>

<br>
<br>

<div v-click text-xs text-right>

_Read more about_ [_options_](https://prettier.io/docs/options/)

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
Prettier 的配置让你可以个性化格式化规则。

[click] 配置文件可以用 JSON、YAML 或 JS 格式

[click] 默认是 `.prettierrc`。

[click] 这里展示了一个简单配置：用单引号、不加分号、缩进 2 个空格、行宽80，还有箭头函数括号的处理。

[click] 想了解更多？右下角有完整选项文档链接！
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[120px_1fr_40px]!
---

# 和 Linter 集成

Prettier + ESLint = 完美组合

::left::

<div v-click>

### 为什么集成？

<br>

- `Prettier` 负责代码风格，`ESLint` 负责代码质量
- 用 `eslint-config-prettier` 避免规则冲突

</div>

::right::

<div v-click>

1. **安装依赖**:

```bash
pnpm add -D eslint-config-prettier
```

</div>

<br>

<div v-click>

2. **配置 ESLint**:

```js
// eslint.config.js
import someConfig from "some-other-config-you-use";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [someConfig, eslintConfigPrettier];
```

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_ntegrating with Linters_](https://prettier.io/docs/integrating-with-linters/)

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
Prettier 和 ESLint 集成是完美的组合！ 

[click] Prettier 专注格式化，ESLint 保证代码质量，用 `eslint-config-prettier` 避免冲突。 

[click] 第一步，安装核心依赖和 `eslint-config-prettier`。

[click] 第二步，在 ESLint 配置中扩展 Prettier，关闭冲突规则。 
 
注意：不推荐用像 `eslint-plugin-prettier` 这样的插件，它们会增加复杂性和性能开销。 
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# 和 CI 集成

自动化格式化，提交更规范

::left::

<div v-click>
            
### 相关依赖

- `Husky`: Git 钩子，提交时触发
- `Lint-Staged`: 只格式化改动文件

</div>

<br>

<div v-click>

1. **安装依赖**:
```bash
pnpm add -D husky lint-staged
```

</div>

<div v-click>

2. **初始化 Husky**：
```bash
pnpm exec husky init
```

</div>

<div v-click>

3. **配置预提交脚本**：
```bash
echo "pnpm lint-staged" > .husky/pre-commit
```

</div>

::right::

<div v-click>

4. **配置 Lint-Staged**：
```json
// package.json
"lint-staged": {
  "*.{js,ts,vue}": [
    "prettier --write"
  ]
}
```

</div>

<div v-click>

5. **配置 CI 文件**：
```yaml
# .github/workflows/prettier.yml
env:
  HUSKY: 0
```

```yaml
# gitlab-ci.yml
variables:
  HUSKY: "0"
```

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_precommit_](https://prettier.io/docs/precommit/)

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
Prettier 集成到 CI 能让提交更规范，自动化格式化一步到位！

[click] 首先，安装 Husky 和 Lint-Staged，Husky 负责 Git 钩子，Lint-Staged 只处理改动文件。 

[click:2] 然后，初始化 Husky，设置 Git 钩子环境。 

[click] 接着，配置预提交脚本，告诉 Husky 在提交时运行 Lint-Staged。 

[click] 右边，在 package.json 中配置 Lint-Staged，让它对 JS、TS、Vue 文件运行 Prettier。 

[click] 最后，在 CI 文件中设置 HUSKY=0，避免 CI 环境触发钩子。 

 -->


---
layout: image-left
transition: fade-out
image: https://cover.sli.dev
---

# 和编辑器集成

VSCode 中的 Prettier 体验

<div v-click>

1. **安装扩展**:  
   - 搜索 `Prettier - Code formatter`  
   - 点击“安装”

</div>

<br>

<div v-click>

2. **设置默认格式化工具**:  
   ```json
   // settings.json
   {
     "editor.defaultFormatter": 
        "esbenp.prettier-vscode",
     "editor.formatOnSave": true
   }
   ```

  <span text-xs text-gray text-right>

  _`formatOnSave`_ _保存时自动格式化_

  </span>
</div>

<br>

<div v-click text-xs text-right>

_Read more about_ [_editors_](https://prettier.io/docs/editors/)

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
Prettier 在 VSCode 中用起来超方便！ 

[click] 第一步，在扩展市场安装 Prettier 插件，搜索并点击安装。 

[click] 第二步，在 VSCode 的 settings.json 中设置 Prettier 为默认格式化工具，并开启保存时格式化。

这样就能享受保存自动格式化，并且支持多种语言，还能无缝适配 VSCode 的其他设置。
 
-->
   

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16 grid-rows-[100px_1fr_40px]!
---

# 共享配置和插件

复用与扩展 Prettier

::left::

<div v-click>

### 引用插件

- **安装与配置**

  ```bash
  pnpm add -D prettier-plugin-foo
  ```

  <br>

  ```json
  //.prettierrc
  {
    "plugins": ["prettier-plugin-foo"]
  }
  ```
- **常用插件**
  - `prettier-plugin-tailwindcss`
  - `@prettier/plugin-xml`

</div>

::right::

<div v-click>

### 引用他人配置
- **直接引用 npm 包**

  ```bash
  pnpm add -D prettier-config-standard
  ```

  <br>

  ```json
  // .prettierrc
  "prettier-config-standard"
  ```

</div>

<br>

<div v-click text-gray>

*自己创建配置和插件？可以发布 npm 包复用！*

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_plugins_](https://prettier.io/docs/plugins/)

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
Prettier 的共享配置和插件让复用和扩展超简单！ 

[click] 插件可以扩展语言，安装后在 .prettierrc 中配置 plugins 字段。 

[click] 要用别人的配置？装个 npm 包，在 .prettierrc 中引用就行。 

[click] 想自己动手？可以创建配置或插件，发布 npm 包分享给团队或社区！
-->


---
layout: intro
transition: fade-out
---

# 结尾与号召

让 Prettier 解放你的代码！

- 统一风格，提升效率  
- 从安装到集成，一站式体验  
- 现在就试试，格式化从此无忧！

<div class="abs-br m-6 text-xl">
  <a href="https://prettier.io/" target="_blank" class="slidev-icon-btn">
    <nonicons:prettier-16 />
  </a>
  <a href="https://github.com/prettier/prettier" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/frontend-develop-tools/static-analysis/prettier/" target="_blank" class="slidev-icon-btn">
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

<!--
这就是 Prettier 的全部！  

它帮你统一代码风格，提升开发效率， 

从安装到编辑器、CI 集成，全程无压力。  

现在就行动起来，用 Prettier 让格式化变得简单又愉快！ 

官网、GitHub 和文档链接都在下面，赶紧去探索吧！
-->
---
layout: end
---

