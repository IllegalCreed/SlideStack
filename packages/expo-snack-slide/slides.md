---
theme: seriph
background: https://cover.sli.dev
title: Expo Snack
info: |
  Expo Snack —— 浏览器里写 React Native，零安装即时三端预览。

  Learn more at [https://snack.expo.dev/](https://snack.expo.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Expo Snack

浏览器里写 React Native · 零安装即时预览

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
  background-color: #4630EB;
  background-image: linear-gradient(45deg, #6C5CE7 10%, #1B1464 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
大家好，今天聊 Expo Snack —— 官方一句话就是 "React Native in the browser"。
它是 React Native / Expo 版的 CodePen：零安装，浏览器里写 RN，即时在网页或真机上看到效果，一键保存分享嵌入。
-->

---
transition: fade-out
---

# 什么是 Snack？

React Native / Expo 版的 CodePen，零安装即时运行

<v-clicks>

- 官方标语：**"React Native in the browser"**，开源 MIT
- **浏览器里写 RN**，即时跑在 web-player 或真机，无需本地装任何工具
- 代码存为 **"Snack"** → 唯一 URL，一键分享 / 嵌入
- 2017 年由 Expo 发布（原型名 Sketch），对标 CodePen / JSFiddle

</v-clicks>

<div v-click text-xs mt-4>

_Read more about_ [_Snack_](https://snack.expo.dev/)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #1B1464 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
Snack 本质是 RN/Expo 版的 CodePen。

[click] 官方标语 "React Native in the browser"，开源、MIT 许可。
[click] 你在浏览器里写 React Native，立刻能在网页播放器或真机上跑，本地什么都不用装。
[click] 代码可以存成一个 Snack，得到唯一 URL，方便分享和嵌入文档。
[click] 它 2017 年由 Expo 发布，原型一度叫 Sketch，对标的就是 CodePen、JSFiddle。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 三端预览：核心机制

同一份代码，实时送到三个目标

::left::

<div v-click>

### 三种预览目标

- **Web（web-player）**：浏览器内跑 RN-for-web，**默认平台**，打开即运行
- **iOS / Android 模拟器**：云端 **Appetize.io**，画面流到浏览器
- **My Device 真机**：手机上的**普通 Expo Go**，扫码 / 同账号

</div>

::right::

<div v-click>

### 实时同步

- 中枢 **snack-sdk** 协调编辑器与设备
- 改动去抖后由 **SnackPub（pub/sub）** 广播
- console / 报错经同一通道回流编辑器
- 多客户端可同时连接、同时预览

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #1B1464 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
Snack 最核心的能力，是把同一份代码实时送到三个预览目标。

[click] Web 用的是 React Native Web，在浏览器里直接跑，是默认平台，一打开就运行；iOS、安卓走云端的 Appetize 远程模拟器，画面流回浏览器；My Device 则是真机预览。
[click] 同步靠 snack-sdk 做中枢，每次改动去抖后通过 SnackPub 这套发布订阅广播出去，日志和报错也从同一通道回流到编辑器；多个客户端能同时连同一个 Snack 一起看。
-->

---
transition: fade-out
---

# 真机预览 = 普通 Expo Go

最大的认知误区，也是原生能力受限的根因

<v-clicks>

- "My Device" 用的就是**普通 Expo Go**，不是什么特殊 App
- Snack 代码跑在 Expo Go 的**预置 runtime**里（web 上是 web-player）
- runtime 两形态：Expo Go 原生 runtime + 浏览器 web-player（底层 **SystemJS** 动态加载）
- 登录同一 Expo 账号 → 已连设备自动出现在列表；也可扫码

</v-clicks>

<div v-click text-xs mt-4>

> 记住这点，后面"为什么有些库跑不了"就顺理成章了

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #1B1464 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这里有个最常见的认知误区，必须先讲清楚。

[click] "My Device" 真机预览，用的就是手机上那个普通的 Expo Go，不是 Snack 专属 App。
[click] Snack 的代码，本质是跑在 Expo Go 的预置 runtime 里，网页端则是 web-player。
[click] 这个 runtime 有两种形态：Expo Go 的原生 runtime，和浏览器里的 web-player，后者底层用 SystemJS 动态加载模块。
[click] 你只要登录同一个 Expo 账号，已连接的设备就会自动出现在列表里，也可以扫码连。
[click] 记住"吃的是预置 runtime"，后面讲为什么有的库跑不了，就全通了。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 依赖：能装什么 / 不能装什么

Snackager 云端打包，但有原生边界

::left::

<div v-click>

### 能装（纯 JS + Expo 自带）

- 编辑器直接加 npm：`name` 或 `name@version`
- 版本可省略 → 按 SDK 取兼容版（类 `expo install`）
- **Snackager**（Webpack + RN preset）首次打包、之后缓存
- `react` / `react-native` / `expo` **永远外置**，由 runtime 提供

</div>

::right::

<div v-click>

### 装不了（需原生编译）

- 自定义原生模块 / config plugin / 链接原生库**都跑不了**
- 根因：Snack 不构建二进制，只能用 Expo Go 已编译的原生模块
- 官方："有些库即便 CLI 下正常，在 Snack 也不行"
- 新 NPM 版本**最多 60 分钟**才可用（缓存）

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #1B1464 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
依赖是 Snack 最容易踩坑的地方，关键是分清能装和不能装。

[click] 能装的：编辑器里直接加 npm 包，写 name 或 name@version，版本省略就按 SDK 取兼容版，行为类似 expo install；这些第三方包由 Snackager 用 Webpack 加 RN preset 首次打包、之后走缓存；而 react、react-native、expo 这三个永远外置，由 runtime 提供，不进 bundle。
[click] 不能装的：任何需要自定义原生代码、config plugin、或链接原生库的包都跑不了，因为 Snack 根本不构建二进制，只能用 Expo Go 里已经编译进去的那批原生模块；官方原话是有些库即便在 CLI 下正常，在 Snack 也会因为打包方式不同而失败。另外新发布的 NPM 版本最多要等 60 分钟才在 Snack 可用。
-->

---
transition: fade-out
---

# SDK 版本选择

跟随 Expo SDK 滚动，由 snack-content 集中管理

<v-clicks>

- 参数 `sdkVersion` 可指定（如 `54.0.0`）；**不指定则用最新已发布版本**
- 当前支持区间约 **SDK 50 ~ 55**，由 **`snack-content`** 作为单一事实来源
- 跟随 Expo：**SDK 54 已稳定**（2025-09，RN 0.81 / React 19.1），SDK 56 beta 接入中
- 切版本影响：可用 Expo 模块 API + 依赖兼容版本解析

</v-clicks>

<div v-click mt-4>

```text
# 省略版本 ≈ expo install：按所选 SDK 取兼容版，而非 latest
dependencies = react-native-paper        →  取兼容版
dependencies = react-native-paper@5.0.0  →  锁定该版本
```

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #1B1464 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
Snack 的 SDK 版本是跟着 Expo 滚动的。

[click] 你可以用 sdkVersion 参数指定具体版本，比如 54；不指定就用最新已发布的版本。
[click] 当前支持区间大概是 SDK 50 到 55，由 snack-content 这个包作为单一事实来源集中管理。
[click] 它紧跟 Expo：SDK 54 在 2025 年 9 月已经稳定，带 RN 0.81 和 React 19.1，仓库里也已经在接入 SDK 56 的 beta。
[click] 切换版本会影响两件事：能用哪些 Expo 模块 API，以及依赖按哪个 SDK 解析兼容版本。
[click] 这里再强调一次省略版本的语义：它等于 expo install，按所选 SDK 取兼容版，不是取 latest。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8 grid-rows-[100px_1fr_36px]!
---

# 嵌入法 A：embed.js 脚本

`data-snack-*` 属性，脚本自动转 iframe（推荐）

::left::

<div v-click>

```html
<div
  data-snack-id="@user/demo"
  data-snack-platform="web"
  data-snack-preview="true"
  data-snack-theme="light"
  style="height:505px;width:100%">
</div>
<script async
  src="https://snack.expo.dev/embed.js">
</script>
```

</div>

::right::

<div v-click>

- 脚本扫描 DOM，含 `data-snack-id`/`code` 的元素 → `<iframe>`
- `data-snack-id` 一旦设置，**code/dependencies 被忽略**
- `platform` **默认 `web`**；`preview` 在 embed.js **默认 `true`**
- 内联代码用 `data-snack-code`，所有值需 **URL 编码**

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_embedding Snacks_](https://github.com/expo/snack/blob/main/docs/embedding-snacks.md)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #1B1464 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
把 Snack 嵌进文档或网站，官方有两种方式，先看方式 A：embed.js 脚本。

[click] 写法是放一个带 data-snack 属性的 div，再引一个 embed.js 脚本。
[click] 脚本会扫描 DOM，把含 data-snack-id 或 data-snack-code 的元素替换成 iframe；注意 data-snack-id 一旦设置，内联的 code 和 dependencies 就被忽略；platform 默认是 web，而 preview 在 embed.js 下默认是 true；要嵌内联代码就用 data-snack-code，所有属性值都要 URL 编码。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8 grid-rows-[100px_1fr_36px]!
---

# 嵌入法 B：URL / iframe 参数

直接拼 URL，多文件用 files（JSON）

::left::

<div v-click>

```js
const files = {
  'App.tsx':
    { type: 'CODE', contents: '...' },
  'assets/img.png':
    { type: 'ASSET', contents: 'https://...' },
};
const url =
  'https://snack.expo.dev?files='
  + encodeURIComponent(
      JSON.stringify(files));
```

</div>

::right::

<div v-click>

- 极简嵌入页：`snack.expo.dev/embedded/{id}`
- 常用参数：`platform` / `theme` / `sdkVersion` / `dependencies`
- `preview` 在**嵌入页默认 `false`**（与 embed.js 相反，别记混）
- `files` JSON 三型：`CODE` 内联 / `CODE`+`url` 外链 / `ASSET` 资源

</div>

::bottom::

<div v-click text-xs text-right>

_Read more about_ [_URL query parameters_](https://github.com/expo/snack/blob/main/docs/url-query-parameters.md)

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #1B1464 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
方式 B 是直接拼 URL 或 iframe 参数。

[click] 多文件场景用 files 参数：把一个 JSON 用 encodeURIComponent 编码后塞进 URL。
[click] 极简嵌入页是 embedded 斜杠 id；常用参数有 platform、theme、sdkVersion、dependencies；这里有个高频坑：preview 在嵌入页默认是 false，跟 embed.js 的默认 true 正好相反，别记混；files 里每个文件有三种类型：CODE 内联、CODE 加 url 外链、ASSET 外链资源。React Native 官方文档的 live demo 用的就是这套。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 与 EAS / 本地的边界

Snack 是 playground，不是生产构建

::left::

<div v-click>

### Snack 适合

- demo、教学、最小复现（MCVE）
- 快速试某个 API / 库
- "零安装试玩 Expo"

</div>

::right::

<div v-click>

### 必须落本地 + EAS

- 自定义原生模块 / config plugin / prebuild
- 生产构建、签名、上架提交
- → `npx create-expo-app` + **EAS Build / dev client**

</div>

<div v-click text-xs mt-4>

> 心智模型：**Snack = 浏览器里的 Expo Go playground**；要自定义原生 / 上架，就得本地 + EAS

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #1B1464 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
要把 Snack 放对位置，得分清它和本地加 EAS 的边界。

[click] Snack 适合的是：demo、教学、做最小复现给维护者、快速试一个 API 或库，本质是零安装试玩 Expo。
[click] 必须落本地的是：自定义原生模块、config plugin、prebuild，以及生产构建、签名、上架提交，这些要用 create-expo-app 起本地项目，再配 EAS Build 或自定义 dev client。
[click] 一句话心智模型：Snack 就是浏览器里的 Expo Go playground，一旦你要自定义原生或者要上架，就必须回到本地加 EAS。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# vs StackBlitz / CodePen

垂直定位：移动端 RN 真机预览

::left::

<div v-click>

### Expo Snack（RN 垂直）

- 强绑 **React Native + Expo**
- 三端：真机 Expo Go + 云模拟器 + RN-for-web
- 内核：RN runtime + Snackager 云打包
- 局限：只能 JS + Expo 预置原生模块

</div>

::right::

<div v-click>

### StackBlitz / CodePen（通用 Web）

- 通用 Web：HTML / JS / 前端框架
- 预览以浏览器内 Web 为主
- StackBlitz 有 WebContainers 跑 Node
- 局限：**做不了真机 RN 预览**

</div>

<div v-click text-xs mt-4>

> 要在浏览器里写、在真手机上即时看 RN 效果，**Snack 几乎是唯一选择**

</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #1B1464 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
最后把 Snack 放进在线编辑器的版图里对比一下。

[click] Snack 是 RN 垂直工具：强绑 React Native 和 Expo，三端预览是真机 Expo Go、云模拟器和 RN-for-web，内核是 RN runtime 加 Snackager 云打包，局限是只能跑 JS 加 Expo 预置的原生模块。
[click] StackBlitz、CodePen 是通用 Web 工具：面向 HTML、JS、前端框架，预览以浏览器内 Web 为主，StackBlitz 还能用 WebContainers 跑 Node，但它们都做不了真机 RN 预览。
[click] 所以结论很清楚：要在浏览器里写、在真手机上即时看到 React Native 效果，Snack 几乎是唯一选择。
-->

---
layout: intro
transition: fade-out
---

# 结尾

浏览器里写 RN，真机上即时看见

- 三端预览：web-player + 云模拟器 + 真机 Expo Go，SnackPub 实时同步
- 依赖经 Snackager 打包，react/native/expo 外置；自定义原生要落 EAS
- 嵌入两法：embed.js 的 `data-snack-*` 或 URL 参数，值需 URL 编码

<div class="abs-br m-6 text-xl">
  <a href="https://snack.expo.dev/" target="_blank" class="slidev-icon-btn">
    <carbon:launch />
  </a>
  <a href="https://github.com/expo/snack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalcreed.github.io/zh/frontend-develop-tools/online-editor/expo-snack/" target="_blank" class="slidev-icon-btn">
    <ph:steam-logo />
  </a>
</div>

<style>
h1 {
  background-image: linear-gradient(45deg, #6C5CE7 10%, #1B1464 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<!--
这就是 Expo Snack 的全景。

三端预览加 SnackPub 实时同步，让你在浏览器里写、在真机上立刻看到 RN 效果；依赖经 Snackager 打包，react、native、expo 外置，要自定义原生就落到 EAS；嵌入有 embed.js 和 URL 参数两种方式，值都要 URL 编码。

官网、GitHub 和笔记链接都在右下角，去试试吧！
-->

---
layout: end
---
