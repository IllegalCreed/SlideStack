---
theme: seriph
background: https://cover.sli.dev
title: 框架官方 Playground
info: |
  框架官方 Playground —— TypeScript / Vue SFC / Svelte 官方出品的纯客户端在线 Playground。

  Learn more at [https://illegalcreed.github.io/](https://illegalcreed.github.io/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 框架官方 Playground

浏览器里跑、强绑单一框架、看编译产物、用 URL 分享最小可复现

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 {
  background-color: #3178c6;
  background-image: linear-gradient(45deg, #3178c6 10%, #235a97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
今天聊「框架官方 Playground」这一类工具，代表是 TypeScript Playground、Vue SFC Playground、Svelte Playground。
它们都由框架或语言的核心团队官方出品，共享一套很清晰的范式：编译器在浏览器里跑、强绑单一框架、核心价值是看编译产物、用一条 URL 分享最小可复现。
-->

---
transition: fade-out
---

# 什么是「框架官方 Playground」

框架/语言核心团队出品的纯客户端在线 Playground

<v-clicks>

- **官方出品**：跟随官方版本，是该技术的「真理来源」
- **纯客户端编译**：编译器在**浏览器里**直接跑，**无后端**、无需 npm install
- **强绑单一框架**：只服务一种技术，不是通用编辑器
- **看编译产物**：实时看到「你写的 → 编译成什么」（核心教学价值）
- **URL 分享 repro**：代码压进 URL，一条链接复现完整环境

</v-clicks>

<div v-click text-xs mt-2>

_定位：**学习 + bug 最小复现** 工具，而非全栈编辑器_

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #3178c6 10%, #235a97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
先讲这一类的共性，这是主线。
[click] 第一，官方出品，跟随官方版本，是该语言/框架的真理来源。
[click] 第二，纯客户端编译——编译器在浏览器里直接跑，没有后端，打开页面就能编译，不用 npm install。
[click] 第三，强绑单一框架，只服务一种技术，TS 只编 TS、Vue 只编 SFC，它不是通用编辑器。
[click] 第四，核心价值是看编译产物，能实时看到你写的代码被编译成什么。
[click] 第五，代码状态压进 URL，一条链接就能复现完整环境，是 issue repro 的标准工具。
[click] 一句话：它定位是学习加最小复现，不是用来开发完整应用。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# 与通用在线编辑器的区别

官方 Playground vs StackBlitz / CodePen / CodeSandbox

::left::

<div v-click>

### 官方 Playground

- **强绑**单一框架/语言
- **不跑后端、不部署**（纯前端编译）
- 浏览器内官方编译器，**看产物**为核心
- 依赖受限（导类型 / import-map）
- 框架核心团队维护

</div>

::right::

<div v-click>

### 通用在线编辑器

- 任意技术栈、任意依赖
- WebContainers / 云容器**可跑后端**
- 真实构建工具链（Vite / webpack）
- 完整 npm 生态
- 第三方平台维护

</div>

<div v-click text-xs mt-3 col-span-2>

_TS Playground 甚至直接提供 **Open in CodeSandbox / StackBlitz** 出口_

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #3178c6 10%, #235a97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
那它和 StackBlitz、CodePen 这类通用在线编辑器有什么本质区别？
[click] 官方 Playground 强绑单一框架，不跑后端不部署，浏览器内用官方编译器，核心是看产物，依赖受限，由框架核心团队维护。
[click] 通用编辑器则是任意技术栈、任意依赖，能跑后端，用真实构建工具链，完整 npm 生态，由第三方平台维护。
[click] 两者还有衔接：当你需要完整项目时，TS Playground 直接给了一键跳 CodeSandbox/StackBlitz 的出口。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-12
---

# TypeScript Playground · 配置与产物

Monaco + 浏览器内 tsc · typescriptlang.org/play

::left::

<div v-click>

### TS Config 面板

- 可视化勾选 `target` / `strict` / `jsx` …
- **Lang 下拉**：TS / `.d.ts` / JS 切换
- 改动的 flag 自动写进分享 URL

</div>

::right::

<div v-click>

### 右侧 Sidebar 标签

- **`.JS`**：转译后 JS（看降级语法）
- **`.D.TS`**：生成的声明文件
- **Errors / Logs**：错误 + `console`（配 Run）
- **Plugins**：可装 npm 发布的插件

</div>

<div v-click text-xs mt-3 col-span-2>

_还有 Examples 面板（`#example/xxx` 直达）+ Export 菜单（AST / Bug Workbench / CodeSandbox）_

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #3178c6 10%, #235a97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
先看 TypeScript Playground，底层是 Monaco 编辑器加浏览器里的 tsc。
[click] 左上 TS Config 面板能可视化勾选编译选项，比如 target、strict、jsx；Lang 下拉可以在 TS、声明文件、JS 之间切；你改的 flag 会自动记进分享 URL，别人打开就是同样配置。
[click] 右侧 Sidebar 是看产物的地方：.JS 看转译后的 JavaScript，能看到降级语法；.D.TS 看生成的声明文件；Errors 和 Logs 看错误和 console，配合工具栏 Run 运行；Plugins 可以装 npm 发布的第三方插件。
[click] 此外还有 Examples 面板，能用 #example 直达；Export 菜单能跳 AST Viewer、Bug Workbench，以及 CodeSandbox。
-->

---
transition: fade-out
---

# TypeScript Playground · 多文件与分享

`// @filename:` 切分文件 · hash 装代码 / query 装配置

<v-clicks>

- **多文件靠 twoslash 注释 `// @filename: foo.ts`**（不是多文件标签页）
- 其他 twoslash 标记同样输入即生效、随 URL 分享

</v-clicks>

<div v-click>

```ts
// @filename: utils.ts
export const add = (a: number, b: number) => a + b;
// @filename: main.ts
import { add } from "./utils";
add(1, 2);
//  ^?  ← 行内实时显示类型
```

</div>

<div v-click mt-2>

- **Hash（`#`）= 代码状态**：`#code/…`（lz-string gzip 压缩）
- **Query（`?`）= 环境配置**：`?ts=5.x` 版本、`?flag=value` 编译选项

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #3178c6 10%, #235a97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
TS Playground 的多文件和分享有两个容易记错的点。
[click] 第一，多文件不是开多个文件标签页，而是在同一个编辑器里用 twoslash 注释 // @filename 切分虚拟文件；其他 twoslash 标记也是输入即生效、随 URL 分享。
[click] 看这段代码：用两个 @filename 切出 utils 和 main 两个文件，最后那行的 ^? 还能行内实时显示某个变量的类型。
[click] 第二，分享 URL 是两套：代码状态在 hash 里，用 lz-string gzip 压缩；版本和编译 flag 在 query 里，比如 ?ts= 切版本、?flag=value 设选项。别笼统说成都在 hash 里。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-12
---

# Vue SFC Playground

引擎 vuejs/repl · `@vue/compiler-sfc` 浏览器内编译 · play.vuejs.org

::left::

<div v-click>

### 浏览器内编译 SFC

- `.vue` 必须先编译成标准 JS + CSS
- Playground 用 **`@vue/compiler-sfc`** 在浏览器里实时编译
- 引擎是开源仓库 **vuejs/repl**（一个可复用 Vue 3 组件）

</div>

::right::

<div v-click>

### 左编辑器 / 右产物

- 左：`App.vue` + `import-map.json` + `tsconfig.json` 标签
- 右：**Preview**，可切**render 函数 / SSR / CSS**
- 编辑器：CodeMirror 或 **Monaco**（Volar 智能提示）

</div>

<div v-click text-xs mt-3 col-span-2>

_版本切换 + **Import Map** 可改 CDN（jsdelivr / npmmirror 便于国内）· 状态序列化进 URL hash_

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #3178c6 10%, #235a97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
第二个是 Vue SFC Playground，地址 play.vuejs.org。
[click] .vue 这种单文件组件必须先编译成标准 JS 和 CSS，生产里交给 Vite，而 Playground 在浏览器里用 @vue/compiler-sfc 实时编译。它的引擎是开源仓库 vuejs/repl，本质是一个可复用的 Vue 3 组件，play.vuejs.org 是它的官方部署。
[click] 注意这里 repl 是 Vue 的仓库名，跟 Svelte 旧名 REPL 是两码事。界面左边是多文件标签，有 App.vue、import-map.json、tsconfig.json；右边默认 Preview，可以切到 render 函数、SSR 产物、CSS；编辑器可选 CodeMirror 或带 Volar 智能提示的 Monaco。
[click] 它还能切 Vue 版本，Import Map 可改 CDN，切到 npmmirror 方便国内访问；状态同样序列化进 URL hash。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-12
---

# Svelte Playground（原名 REPL）

实时编译看 JS / CSS · 默认 Svelte 5 · svelte.dev/playground

::left::

<div v-click>

### REPL → Playground 改名

- 历史上叫 **REPL**，已正式更名 **Playground**
- 旧链接 `/repl/` **重定向**到 `/playground/`
- 合并了原 REPL 与 Examples 页

</div>

::right::

<div v-click>

### 客户端编译 + 输出

- Svelte 编译器在**浏览器里实时编译** `.svelte`
- 输出：**Result** 预览 / **JS** / **CSS**
- 多文件多组件（顶部文件标签）

</div>

<div v-click text-xs mt-3 col-span-2>

_版本切换走 `?version=`（现网**默认 Svelte 5**，注意 runes 语法）· 保存生成 `/playground/{id}` 短链_

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #3178c6 10%, #235a97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
第三个是 Svelte Playground，这里最容易混淆。
[click] 它历史上叫 REPL，现在已经正式更名为 Playground，旧的 /repl/ 链接会重定向到 /playground/，并且把原来的 REPL 和 Examples 页合并了。讲的时候点明 REPL 就是 Playground 的前身。
[click] 它同样是客户端编译：Svelte 编译器在浏览器里实时编译 .svelte，输出有 Result 预览、JS、CSS——Svelte 是编译型框架，看 JS/CSS 产物尤其有意义；也支持多文件多组件。
[click] 版本切换走 ?version= 查询参数，现网默认是 Svelte 5，写示例注意 runes 这些新语法；保存后会生成 /playground/{id} 短链。
-->

---
transition: fade-out
---

# 三者横向对比

同一范式，细节各有差异

<div v-click>

| 维度 | TS Playground | Vue SFC Playground | Svelte Playground |
| --- | --- | --- | --- |
| 编译什么 | TS/JS（tsc） | `.vue`（compiler-sfc） | `.svelte`（编译器） |
| 编辑器 | Monaco | CodeMirror / Monaco | CodeMirror 6 |
| 看产物 | `.JS` / `.D.TS` | render / SSR / CSS | JS / CSS |
| 多文件 | `// @filename:` 注释 | 文件标签 | 文件标签 |
| 版本切换 | `?ts=` | 顶栏切 | `?version=` |
| 分享 | hash + query | URL hash | `/playground/{id}` |

</div>

<div v-click text-xs mt-2>

_差异点：TS 多文件靠注释（其余靠标签）；TS 分享分 hash / query 两套；Svelte 默认 Svelte 5_

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #3178c6 10%, #235a97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
把三者放一起对比。
[click] 编译对象分别是 TS/JS、.vue、.svelte；编辑器 TS 用 Monaco，Vue 可选 CodeMirror 或 Monaco，Svelte 用 CodeMirror 6；看产物 TS 是 .JS/.D.TS，Vue 是 render/SSR/CSS，Svelte 是 JS/CSS；多文件 TS 靠 @filename 注释，Vue/Svelte 靠文件标签；版本切换 TS 用 ?ts=、Svelte 用 ?version=、Vue 在顶栏切；分享 TS 是 hash 加 query，Vue 是 URL hash，Svelte 是短链。
[click] 重点记三个差异：TS 多文件靠注释而别人靠标签；TS 分享分 hash 和 query 两套；Svelte 现在默认 Svelte 5。
-->

---
transition: fade-out
---

# 共性总结：一类工具的统一心智

什么时候用 Playground，什么时候转向通用编辑器

<v-clicks>

- **本质一致**：浏览器内官方编译器 + 强绑框架 + 看产物 + URL 复现
- **用 Playground**：演示语言/框架特性、看编译产物、做最小可复现、分享片段
- **转向通用编辑器**：需要完整项目、真实构建、后端、完整 npm 时
- **别混两个「REPL」**：Svelte 旧名 REPL vs Vue 仓库名 vuejs/repl
- **都是纯客户端**：别误以为「运行在服务器上 / 需要部署」

</v-clicks>

<style>
h1 {
  background-image: linear-gradient(45deg, #3178c6 10%, #235a97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
最后做共性总结，建立一类工具的统一心智。
[click] 本质一致：浏览器内的官方编译器、强绑框架、看产物、用 URL 复现。
[click] 什么时候用 Playground？演示语言或框架特性、看编译产物、做最小可复现、分享代码片段。
[click] 什么时候转向通用编辑器？当你需要完整项目、真实构建、后端、完整 npm 生态时。
[click] 两个容易混的点再强调：Svelte 旧名叫 REPL，Vue 的引擎仓库名也叫 repl，这是两码事别混。
[click] 还有，三者都是纯客户端编译，别误以为运行在服务器上或者需要部署。
-->

---
layout: end
transition: fade-out
---

# 结尾

官方 Playground —— 浏览器里的「编译可视化 + 最小复现」工具

- 纯客户端编译，强绑框架，核心是看编译产物
- 一条 URL 承载代码 + 配置，做精确 repro
- 需要完整项目时再转向 StackBlitz / CodeSandbox

<div class="abs-br m-6 text-xl flex gap-2">
  <a href="https://www.typescriptlang.org/play" target="_blank" class="slidev-icon-btn">
    <logos:typescript-icon />
  </a>
  <a href="https://play.vuejs.org/" target="_blank" class="slidev-icon-btn">
    <logos:vue />
  </a>
  <a href="https://svelte.dev/playground" target="_blank" class="slidev-icon-btn">
    <logos:svelte-icon />
  </a>
  <a href="https://illegalcreed.github.io/zh/frontend-develop-tools/online-editor/framework-playground/" target="_blank" class="slidev-icon-btn">
    <carbon:launch />
  </a>
</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #3178c6 10%, #235a97 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这就是「框架官方 Playground」的全景。
它们是浏览器里的编译可视化加最小复现工具：纯客户端编译、强绑框架、核心看产物；一条 URL 承载代码和配置做精确 repro；当你需要完整项目时再转向 StackBlitz 或 CodeSandbox。
右下角是 TypeScript、Vue、Svelte 三个 Playground 入口和笔记链接，去试试吧。
-->

---
layout: end
---
