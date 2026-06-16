---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Stylelint
info: |
  Presentation about Stylelint for developers.

  Learn more at [https://stylelint.io/](https://stylelint.io/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Stylelint

强大的样式表 Linter，帮你避免 CSS 错误、强制团队约定（基于 v17.13.0）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/stylelint/stylelint" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天聊 Stylelint —— 样式表世界里的 linter，专治 CSS / SCSS / Less 里的错误与不一致。
它能做什么、怎么配、和 Prettier 是什么关系？我们一起看看。
-->

---
transition: fade-out
---

# 什么是 Stylelint？

一款内置 100+ 规则的样式表 linter

<v-clicks>

- 检查 **CSS / SCSS / Less / CSS-in-JS**，发现错误并强制约定
- 两大类规则：**避免错误**（无效十六进制、重复属性…）+ **强制约定**（命名、标记法…）
- 默认**零规则**，靠 `extends` 共享配置起步（如 `stylelint-config-standard`）
- 丰富生态：共享配置、插件、自定义语法、官方编辑器扩展

</v-clicks>

<div v-click="'+1'" text-xs mt-4>

_Read more about_ [_Stylelint rules_](https://stylelint.io/user-guide/rules)

</div>

<style>
h1 {
  background-color: #e91e63;
  background-image: linear-gradient(45deg, #e91e63 10%, #9c27b0 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Stylelint 是样式表的 linter，内置 100 多条规则。

[click] 它检查 CSS 以及 SCSS、Less、CSS-in-JS，既找错误也强制约定。

[click] 规则分两大类：一类避免错误，一类强制约定。

[click] 注意它默认一条规则都不开，要靠 extends 一份共享配置来起步。

[click] 生态很丰富：共享配置、插件、自定义语法、官方编辑器扩展都有。
-->

---
transition: fade-out
---

# 安装与运行

脚手架一键接入

<v-clicks>

- **脚手架**：`npm create stylelint@latest`（装好依赖并生成配置）
- **手动**：`npm add -D stylelint stylelint-config-standard`
- **运行**：`npx stylelint "**/*.css"` —— glob 一定要加引号
- **自动修复**：`stylelint "**/*.css" --fix`

</v-clicks>

<div v-click mt-4>

```bash
# glob 不加引号会被 shell 提前展开！
stylelint "**/*.css"          # ✓ 交给 Stylelint 处理
stylelint **/*.css            # ✗ shell 抢先展开
```

</div>

<style>
h1 {
  background-color: #e91e63;
  background-image: linear-gradient(45deg, #e91e63 10%, #9c27b0 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
上手很简单。

[click] 推荐用官方脚手架 npm create stylelint，它会装好依赖、生成配置。

[click] 也可以手动装 stylelint 和 stylelint-config-standard。

[click] 运行就是 npx stylelint 加上文件 glob，记住 glob 一定要用引号包起来。

[click] 加 --fix 自动修复可修复的问题。

[click] 强调一下引号：不加引号 shell 会抢先展开 glob，结果可能不对，加引号才是交给 Stylelint 自己处理。
-->

---
layout: image-right
transition: fade-out
image: https://cover.sli.dev
---

# 配置 .stylelintrc

cosmiconfig 向上查找，`extends` 起步

<div v-click>

```json
{
  "extends": ["stylelint-config-standard"],
  "rules": {
    "block-no-empty": null,
    "color-no-invalid-hex": true,
    "unit-allowed-list": ["em", "rem", "%"]
  }
}
```

</div>

<v-clicks>

- 规则值：`null` 关 / `true` 默认开 / `[主, {次}]` 带选项
- 次选项：`severity` / `message` / `disableFix`
- `extends` 数组后者覆盖前者

</v-clicks>

<style>
h1 {
  background-color: #e91e63;
  background-image: linear-gradient(45deg, #e91e63 10%, #9c27b0 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
要定制就写配置文件。Stylelint 用 cosmiconfig 从当前目录向上查找。

[click] 配置长这样：extends 一份共享配置打底，再用 rules 微调。

[click] 规则值有三种：null 关闭、true 默认开启、数组带选项开启；次选项能调 severity、message、关掉单条修复；extends 数组里后面的覆盖前面的。
-->

---
transition: fade-out
---

# 规则的两大类别

100+ 规则，默认全关

<div v-click>

| 类别         | 子类                          | 代表规则                 |
| ------------ | ----------------------------- | ------------------------ |
| **避免错误** | invalid / duplicate / unknown | `color-no-invalid-hex`   |
| **避免错误** | empty / deprecated            | `block-no-empty`         |
| **强制约定** | notation / case / quotes      | `alpha-value-notation`   |
| **强制约定** | pattern（命名）               | `selector-class-pattern` |
| **强制约定** | max-min / allowed-list        | `selector-max-id`        |

</div>

<div v-click text-xs mt-2>

_默认零规则，靠共享配置起步。_ _Read more about_ [_rules_](https://stylelint.io/user-guide/rules)

</div>

<style>
h1 {
  background-color: #e91e63;
  background-image: linear-gradient(45deg, #e91e63 10%, #9c27b0 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
100 多条规则分成两大类。

[click] 避免错误这一类，专抓真实问题：无效十六进制、重复属性、未知属性、空块、过时特性等。强制约定这一类，管一致性：标记法、大小写、引号、命名模式、复杂度限制、白名单等。

[click] 再次强调，默认一条都不开，要靠共享配置起步。
-->

---
transition: fade-out
---

# 风格规则去哪了？

与 Prettier 分工：格式 vs 质量

<v-clicks>

- Stylelint **15 废弃、16 移除**了 76 条风格（排版）规则
- 原因：排版交给 **Prettier** 更合适，Stylelint 专注**避错 + 非格式约定**
- 因此 `stylelint-config-prettier` **不再需要**（已无冲突可关）
- 想保留风格规则？改装第三方 `@stylistic/stylelint-plugin`

</v-clicks>

<div v-click mt-3 text-sm>

> **分工**：Prettier 管空白/缩进/换行；Stylelint 管无效值/重复/命名约定

</div>

<style>
h1 {
  background-color: #e91e63;
  background-image: linear-gradient(45deg, #e91e63 10%, #9c27b0 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这一页很关键，理解它就理解了 Stylelint 的当下定位。

[click] Stylelint 在 15 废弃、16 彻底移除了 76 条管排版的风格规则。

[click] 原因是：排版这种事交给 Prettier 更合适，Stylelint 应该专注避错和非格式的约定。

[click] 直接结论：stylelint-config-prettier 这个用来关冲突规则的配置，因为已经没有冲突，所以不再需要了。

[click] 如果你确实想用 Stylelint 强制部分风格，可以装社区接管的 @stylistic 插件。

[click] 一句话分工：Prettier 管格式，Stylelint 管质量。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# SCSS / Less / 插件

自定义语法 + 第三方规则

::left::

<div v-click>

### 检查 SCSS

```json
{
  "extends": [
    "stylelint-config-standard-scss"
  ]
}
```

<span text-xs text-gray>内置 `postcss-scss`，14 起需显式语法</span>

</div>

::right::

<div v-click>

### 插件扩展规则

```json
{
  "plugins": ["stylelint-order"],
  "rules": {
    "order/properties-alphabetical-order": true
  }
}
```

<span text-xs text-gray>`stylelint-scss` / `stylelint-order` …</span>

</div>

<style>
h1 {
  background-color: #e91e63;
  background-image: linear-gradient(45deg, #e91e63 10%, #9c27b0 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
怎么检查 SCSS、Less，怎么扩展规则？

[click] 检查 SCSS 最省心的方式是 extends stylelint-config-standard-scss，它内置了 postcss-scss 解析器。注意 14 起 Stylelint 不再内置语言解析，必须显式指定。Vue 和 CSS-in-JS 同理，用 postcss-html、postcss-styled-syntax。

[click] 想要核心之外的规则就装插件，用 plugins 引入、再在 rules 里开启，规则名带命名空间前缀，比如 order 斜杠、scss 斜杠。
-->

---
transition: fade-out
---

# 忽略与禁用

精确到规则，写上理由

<v-clicks>

- 单行：`/* stylelint-disable-line 规则名 */`
- 下一行：`/* stylelint-disable-next-line 规则名 */`
- 区域：`/* stylelint-disable */ … /* stylelint-enable */`
- 文件：`.stylelintignore`（gitignore 风格，`node_modules` 默认忽略）

</v-clicks>

<div v-click mt-3>

```css
/* stylelint-disable-next-line color-no-invalid-hex -- 第三方覆盖 */
a { color: #ff; }
```

<span text-xs text-gray>`--` 后写理由；配合 `reportNeedlessDisables` 审计</span>

</div>

<style>
h1 {
  background-color: #e91e63;
  background-image: linear-gradient(45deg, #e91e63 10%, #9c27b0 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
需要临时关规则怎么办？

[click] 单行、下一行、成对的区域禁用，还有文件级的 .stylelintignore，它用 gitignore 风格，node_modules 默认就忽略。

[click] 最佳实践：禁用时精确到规则名，别裸 disable；用两个连字符写上理由，两侧要留空格。再配合 reportNeedlessDisables 这类选项，就能审计出过时、无用的禁用注释，保持整洁。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 集成编辑器与 CI

放进日常工作流

::left::

<div v-click>

### 编辑器

- VS Code 装官方 **stylelint** 扩展
- 保存即时报告，支持自动 `--fix`
- 关掉内置 `css.validate` 避免重复

</div>

::right::

<div v-click>

### CI / Git Hooks

```json
// package.json
"lint-staged": {
  "*.{css,scss}": "stylelint --fix"
}
```

<span text-xs text-gray>CI 加 `--max-warnings 0` 让警告也失败</span>

</div>

<style>
h1 {
  background-color: #e91e63;
  background-image: linear-gradient(45deg, #e91e63 10%, #9c27b0 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
怎么放进日常工作流？

[click] 编辑器：VS Code 装官方 stylelint 扩展，保存即时报告、自动修复；记得关掉 VS Code 内置的 CSS 校验，免得重复报错。

[click] CI 和 Git 钩子：配合 lint-staged 只查暂存的样式文件；CI 里加 --max-warnings 0，让任何警告都能让流水线失败。退出码方面注意 16 起问题打印到 stderr、用法错误退出码改成了 64。
-->

---
layout: intro
transition: fade-out
---

# 结尾与号召

让样式表既无错、又一致

- `extends` 共享配置即可起步，几分钟接入
- 避错 + 约定交给 Stylelint，格式交给 Prettier
- 现在就 `npm create stylelint@latest` 试试！

<div class="abs-br m-6 text-xl">
  <a href="https://stylelint.io/" target="_blank" class="slidev-icon-btn">
    <carbon:earth />
  </a>
  <a href="https://github.com/stylelint/stylelint" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/frontend-develop-tools/static-analysis/stylelint/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #e91e63;
  background-image: linear-gradient(45deg, #e91e63 10%, #9c27b0 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这就是 Stylelint。

extends 一份共享配置就能起步，几分钟接入；避错和约定交给它，格式化交给 Prettier，分工清晰；

现在就 npm create stylelint 试一试吧！官网、GitHub、笔记链接都在下面。
-->

---
layout: end
---
