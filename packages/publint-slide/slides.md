---
theme: seriph
background: https://cover.sli.dev
title: Welcome to publint
info: |
  Presentation about publint for developers.

  Learn more at [https://publint.dev/](https://publint.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# publint

校验 npm 包「发布正确性」的 Linter（基于 v0.3.21）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/publint/publint" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天聊 publint —— 一个专门给「库作者」用的工具。
它不查你的业务代码，而是查你发布出去的 npm 包「打包得对不对、别人能不能正确用」。
为什么需要它、查什么、怎么用，我们一起看看。
-->

---
transition: fade-out
---

# 什么是 publint？

校验 npm 包能否在尽可能广的环境下被正确解析

<v-clicks>

- 检查 `package.json` 的 `exports` / `main` / `module` / `types` 等**入口字段**
- 验证文件**真实存在**、**ESM/CJS 互操作**、**类型能被 TS 找到**
- 目标环境：**Vite / Webpack / Rollup / Node.js** 等主流生态
- 面向**库/包作者的发布前检查**，不是业务代码的 lint

</v-clicks>

<div v-click="'+1'" text-xs mt-4>

_Read more about_ [_publint docs_](https://publint.dev/docs/)

</div>

<style>
h1 {
  background-color: #0d9488;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
publint 是一个 npm 包的 linter。

[click] 它查的是 package.json 里那些决定「包怎么被解析」的入口字段。

[click] 具体看三件事：字段指向的文件存不存在、ESM 和 CJS 能不能互通、类型能不能被 TypeScript 找到。

[click] 目标是让你的包在 Vite、Webpack、Rollup、Node 这些主流环境下都能用。

[click] 注意它的定位：给库作者发布前用，跟 ESLint 查业务代码是两回事。
-->

---
transition: fade-out
---

# 为什么需要它？

「本地能用」不等于「别人装下来能用」

<v-clicks>

- `exports` 条件顺序错 → 某些打包器/TS 拿不到正确入口或类型
- 字段指向的文件没 build / 漏进 `files` → 用户装下来缺文件
- `"type": "module"` 却混入 CJS 语法 → Node 原生 ESM 直接报错
- 类型文件格式不对（ESM/CJS 伪装）→ 类型在某些解析模式下错位

</v-clicks>

<div v-click mt-4>

publint 把这些「发布事故」**拦在 publish 之前**。

</div>

<style>
h1 {
  background-color: #0d9488;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
为什么需要这么个工具？因为「你本地能用」和「别人 npm install 装下来能用」是两回事。

[click] exports 条件顺序写错，支持某些条件的打包器或 TS 就拿不到对的入口或类型。

[click] 字段指向的文件忘了 build、或者漏进 files 白名单，用户装下来就缺文件。

[click] 标了 type module 却混进 CommonJS 语法，Node 原生 ESM 会直接报错。

[click] 类型文件格式不对，会出现 ESM/CJS 类型伪装，在某些解析模式下错位。

这些都是发布事故，publint 把它们拦在 publish 之前。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 上手方式

零安装网页版，或本地 CLI

::left::

<div v-click>

- **网页版**（零安装）：

  打开 [publint.dev](https://publint.dev)，粘贴包名 / npm 链接

  <span text-xs text-gray>浏览器 Web Worker 下载 tarball 就地分析</span>

</div>

<div v-click>

- **本地安装**：

  ```bash
  npm install --save-dev publint
  ```

</div>

::right::

<div v-click>

- **直接跑**（库目录下）：

  ```bash
  npx publint
  ```

</div>

<div v-click>

- **指定目录 / tarball**：

  ```bash
  npx publint ./packages/my-lib
  npx publint ./my-lib-1.0.0.tgz
  ```

</div>

<style>
h1 {
  background-color: #0d9488;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
上手有两条路。

[click] 最快是网页版，打开 publint.dev 粘贴包名就行，它在浏览器里下载 tarball 就地分析，零安装，特别适合体检第三方包。

[click] 要接进项目就本地装：npm install --save-dev publint。

[click] 在库根目录直接 npx publint 就能跑。

[click] 也能指定子目录，或者直接喂一个 npm pack 出来的 tgz 压缩包。
-->

---
transition: fade-out
---

# 关键：先 build 再 publint

publint 检查的是「将要发布的产物」

<div v-click>

```bash
# 正确顺序：先构建，再检查
npm run build && npx publint
```

</div>

<v-clicks>

- 检查对象是「用户 `npm install` 实际拿到的文件」
- 没 build 就跑 → `exports`/`main` 指向的 `dist` 还不存在
- 结果误报 `FILE_DOES_NOT_EXIST`
- 实践：放进 `prepublishOnly`，确保「构建后、发布前」体检

</v-clicks>

<style>
h1 {
  background-color: #0d9488;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
有个最容易踩的坑：一定要先 build 再 publint。

[click] 正确顺序是先构建再检查。

[click] 因为它查的是用户实际会拿到的文件。

[click] 你要是没 build 就跑，exports 和 main 指向的 dist 根本还没生成。

[click] 那就会误报 FILE_DOES_NOT_EXIST，以为文件缺了。

[click] 所以实践上把它放进 prepublishOnly，保证构建之后、发布之前一定体检一遍。
-->

---
layout: image-right
transition: fade-out
image: https://cover.sli.dev
---

# 报告的三个级别

从严重到温和

<div v-click>

| 级别         | 含义                     |
| ------------ | ------------------------ |
| `error`      | 很可能无法解析，须修     |
| `warning`    | 潜在兼容问题 / 不推荐    |
| `suggestion` | 最佳实践提示             |

</div>

<v-clicks>

- `--level warning`：只看 warning 与 error
- `--strict`：把 warning 也当 error（CI 门禁）
- 默认仅 `error` 致失败

</v-clicks>

<style>
h1 {
  background-color: #0d9488;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
报告分三档。

[click] error 是很可能导致无法解析、必须修的；warning 是潜在兼容问题或不推荐写法；suggestion 是最佳实践提示，比如补 license。

[click] level warning 可以只看警告和错误，把建议过滤掉。

[click] strict 会把警告也当错误，适合 CI 卡门禁。

[click] 默认情况下只有 error 会让 publint 失败退出。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# exports 条件顺序

最常见的 error：条件按书写顺序匹配

::left::

<div v-click>

```json
{
  "exports": {
    ".": {
      "types": "./d.ts",
      "module": "./m.js",
      "require": "./r.cjs",
      "default": "./d.js"
    }
  }
}
```

</div>

::right::

<v-clicks>

- `types` 放**最前**——否则 TS 拿不到类型
- `default` 放**最后**——兜底，放前会抢先命中
- `module` 在 `require` **之前**——优先给 ESM
- 值必须以 `./` 开头

</v-clicks>

<div v-click text-xs mt-2>

_imports（`#` 开头）有一组镜像规则_

</div>

<style>
h1 {
  background-color: #0d9488;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
publint 最常报的就是 exports 条件顺序。关键认知：条件是按你写的顺序去匹配的。

[click] 左边这个 exports 长这样。

[click] types 要放最前，否则 TypeScript 可能先命中 JS 条件、拿不到类型；default 要放最后当兜底；module 要排在 require 前面，让支持 module 的打包器优先拿 ESM；所有值都得以点斜杠开头。

[click] imports 字段，就是 # 开头的内部导入，有一组对称的镜像规则。
-->

---
transition: fade-out
---

# 还会查什么？

不止 package.json

<v-clicks>

- **文件存在性**：`FILE_DOES_NOT_EXIST`、`bin` 缺 shebang
- **发布形态**：文件漏进 `files` → `FILE_NOT_PUBLISHED`
- **模块格式**：`.js` 内容与 `"type"` 声明的 ESM/CJS 不符
- **类型导出**：有 `exports` 时类型须经 `types` 条件导出（TS 5.0+）
- **类型格式**：ESM/CJS 应分别 `.d.mts` / `.d.cts`
- **废弃字段**：`jsnext:main` → 建议改用 `module` / `exports`

</v-clicks>

<style>
h1 {
  background-color: #0d9488;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
publint 的检查面不止 package.json 字段本身。

[click] 文件存在性，比如字段指向的文件不存在、bin 脚本缺 shebang。

[click] 发布形态，文件漏进 files 白名单，发布时进不了 tarball。

[click] 模块格式，一个 .js 的实际内容跟它 type 声明的 ESM 或 CJS 对不上。

[click] 类型导出，TS 5.0 以后，有 exports 时类型也要经 types 条件导出。

[click] 类型格式，ESM 和 CJS 应该分别用 d.mts 和 d.cts，否则会类型伪装。

[click] 还有废弃字段，比如 jsnext:main，建议迁到 module 或 exports。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 搭档：are-the-types-wrong

互补，发布前两个都跑

::left::

<div v-click>

### publint

- 自有**静态分析**
- 查发布形态 / 文件 / 模块格式
- 覆盖面**不止** `package.json`

</div>

::right::

<div v-click>

### attw

- 用 **TS 编译器**检查
- 各 `moduleResolution` 下的类型解析
- 抓 publint 抓不到的类型问题

</div>

<div v-click text-xs mt-4>

```bash
npx publint && npx @arethetypeswrong/cli --pack
```

</div>

<style>
h1 {
  background-color: #0d9488;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
publint 有个常搭配的工具：are the types wrong，简称 attw。两者互补。

[click] publint 用自己的静态分析，查发布形态、文件、模块格式，覆盖面不止 package.json。

[click] attw 借助 TypeScript 编译器，在各种 moduleResolution 下实际解析你的包，专查类型问题，能抓出 publint 抓不到的那些。

[click] 官方建议发布前两个都跑：publint 接 attw --pack，一条命令串起来。
-->

---
layout: intro
transition: fade-out
---

# 结尾与号召

发布前，先让 publint 体检一遍

- 网页版零安装，粘贴包名即可体检任意包
- `npm run build && npx publint --strict` 接进发布流程
- 配合 attw 抓全类型问题，再放心 `npm publish`

<div class="abs-br m-6 text-xl">
  <a href="https://publint.dev/" target="_blank" class="slidev-icon-btn">
    <carbon:earth />
  </a>
  <a href="https://github.com/publint/publint" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/frontend-develop-tools/static-analysis/publint/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-color: #0d9488;
  background-image: linear-gradient(45deg, #14b8a6 10%, #0e7490 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这就是 publint。

它网页版零安装，粘贴包名就能体检任意已发布的包；接进发布流程就是 build 之后 publint --strict；再配合 attw 把类型问题也抓全，然后就能放心 npm publish。

文档、GitHub、笔记链接都在下面。
-->

---
layout: end
---
