---
theme: seriph
background: https://cover.sli.dev
title: Neutralino 深入浅出
info: |
  用系统 WebView + 极薄 C++ 后端构建极轻量跨平台桌面应用。

  基于 Neutralino.js 6.x · 了解更多 [neutralino.js.org](https://neutralino.js.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Neutralino.js

极轻量跨平台桌面框架：**系统 WebView + 极薄 C++ 后端**，产物 **< 2MB**（基于 6.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/neutralinojs/neutralinojs" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Neutralino.js —— 一个走极简路线的跨平台桌面框架：不打包 Chromium、不带 Node/Rust/Go，用系统自带 WebView 加一个极薄的 C++ 后端，Hello World 产物不到 2MB。
-->

---
transition: fade-out
---

# 什么是 Neutralino

一句话：**系统 WebView + 极薄 C++ 后端**，前端纯 JS/HTML/CSS 的极轻量桌面框架

<div grid="~ cols-2 gap-4" class="mt-4">

<div>

**为什么这么轻**

- 用**系统自带 WebView** 渲染 UI，**不打包 Chromium**
- 后端只是一个**极薄的 C++ 二进制**（静态服务器 + 原生能力）
- **无需 Node / Rust / Go 等运行时**——开发免编译、用户免依赖

</div>

<div>

**轻到什么程度**

- Hello World 产物 **约 2MB**（压缩后 ~0.5MB）
- 平台：Linux / Windows / macOS / Web（浏览器）
- 前端**框架无关**：React / Vue / Angular / Svelte / 原生 JS

</div>

</div>

<!--
对比一下：Electron 要捆绑 Node + Chromium 动辄一两百 MB；Tauri 要 Rust、Wails 要 Go。Neutralino 把后端做成一个极薄的 C++ 内核，渲染直接用系统 WebView，所以产物能压到 2MB 以内，这是它最核心的差异点。
-->

---
transition: fade-out
---

# 架构：静态服务器 + WebSocket

前端跑在系统 WebView，原生能力在 C++ 后端，两者用**本地 WebSocket** 通信

<div grid="~ cols-2 gap-4" class="mt-4">

<div>

**两个进程**

- **系统 WebView**：加载 HTML/CSS/JS + 客户端库 `@neutralinojs/lib`
- **C++ 后端**：内嵌**静态 HTTP 服务器**（交付前端资源）+ 原生能力
- 二者经**本地 WebSocket** 传 JSON，带 `accessToken` 鉴权

</div>

<div>

**一次调用怎么走**（如 `os.getEnv()`）

- 前端调客户端库 API
- 库经 WebSocket 发 JSON（带 UUID `id` + `method`）
- C++ 后端执行原生操作，结果回传
- 库用 **UUID 任务池**配对响应，resolve 对应 Promise

</div>

</div>

<div class="mt-4 text-sm opacity-75">

入口 `Neutralino.init()` 建立连接；WebView 用系统库（Win WebView2 / macOS WebKit / Linux WebKitGTK）

</div>

<!--
架构上就是两个进程：一个是系统 WebView 跑前端，一个是极薄的 C++ 后端。C++ 后端里内嵌了一个静态服务器交付前端资源，同时提供原生能力。两者之间用本地 WebSocket 传 JSON，每个请求带一个 UUID，客户端库靠任务池把响应和请求配对，再 resolve 对应的 Promise。
-->

---
transition: fade-out
---

# `Neutralino.*` 原生 API 命名空间

前端通过统一命名空间调原生能力，无需自己写后端

<div grid="~ cols-2 gap-4" class="mt-2">

<div>

| 命名空间 | 作用 |
| --- | --- |
| `app` / `window` | 应用生命周期 / 窗口管理 |
| `filesystem` | 文件读写、目录、监视 |
| `os` | 执行命令、对话框、通知、托盘 |
| `computer` | CPU / 内存 / 显示器 / 电池 |
| `storage` | 键值持久化 |

</div>

<div>

| 命名空间 | 作用 |
| --- | --- |
| `events` | 前后端事件收发 |
| `extensions` | 向扩展发消息 / 广播 |
| `clipboard` | 剪贴板（文本 / HTML） |
| `updater` | 应用自更新 |
| `resources` | 读打包资源 · `debug.log` 日志 |

</div>

</div>

<div class="mt-3 text-sm opacity-75">

运行时另注入只读全局 `NL_OS` / `NL_ARCH` / `NL_MODE` / `NL_PORT` 等 `NL_*` 变量供前端读取

</div>

<!--
Neutralino 把原生能力按命名空间组织，前端只要 Neutralino 点相应命名空间就能调，比如 filesystem 读写文件、os 执行命令弹通知、computer 读硬件信息，都是内置的不用自己写后端。此外运行时还会注入一批 NL 开头的只读全局变量，比如当前系统、架构、运行模式和端口。
-->

---
transition: fade-out
---

# Extensions：任意语言扩展后端

C++ 内核只覆盖通用能力，缺的用**扩展**补——**不用重编框架源码**

<v-clicks>

- **本质**：基于 WebSocket 的扩展系统，独立进程与 Neutralino 后端通信
- **任意语言**：Python / Go / C++ / Node.js…… 只要能连 WebSocket 收发 JSON
- **握手**：扩展启动时经 **stdin** 拿到 port / token / 扩展 id，再主动连回后端
- **前端调用**：`Neutralino.extensions.dispatch(extId, event, data)` 向扩展发消息
- **配置**：`neutralino.config.json` 里开 `enableExtensions` + 声明各平台启动命令

</v-clicks>

<div v-click class="mt-4 text-sm">

关键差异化：**C++ 内核保持极薄，重逻辑用你最顺手的语言写在扩展里**

</div>

<!--
C++ 内核只提供通用的原生能力，遇到内核没有的、或者想用别的语言写重逻辑，就用 Extensions。它本质是个基于 WebSocket 的扩展系统：扩展是一个独立进程，可以用 Python、Go、Node 任意语言写，启动时通过标准输入拿到连接信息再连回后端，前端用 extensions.dispatch 给它发消息。内核保持极薄的同时，后端能力可以用任意语言无限扩展。
-->

---
transition: fade-out
---

# neu CLI：工程化

`npm i -g @neutralinojs/neu`，一套命令覆盖创建到打包

<div grid="~ cols-2 gap-4" class="mt-2">

<div>

| 命令 | 作用 |
| --- | --- |
| `neu create` | 从模板创建应用 |
| `neu run` | 运行，默认**改资源热重载** |
| `neu build` | 产出 `dist/` 各平台二进制 |
| `neu update` | 更新内核 + 客户端库 |
| `neu plugins` | 管理 CLI 插件 |

</div>

<div>

**常用 flag**

- `build --release`：打便携 ZIP
- `build --embed-resources`：单文件可执行
- `run --disable-auto-reload`：关热重载
- `update --latest`：拉最新版本

</div>

</div>

```bash
neu create myapp && cd myapp
neu run              # 开发（热重载）
neu build --release  # 产出便携二进制到 dist/
```

<!--
工程化靠 neu 这个 CLI。create 从模板拉项目，run 起开发模式默认带热重载，build 产出各平台二进制，release 会打成便携 ZIP，embed-resources 甚至能出单文件可执行。上手就这三行：create、run 开发、build 打包。
-->

---
transition: fade-out
---

# 配置与安全：`neutralino.config.json`

单一 JSON 管住入口、模式、权限——**安全全靠这里手动收紧**

<div grid="~ cols-2 gap-4" class="mt-4">

<div>

**主要配置**

- `applicationId` / `version`：应用标识
- `defaultMode`：默认运行模式
- `port`：`0` = 随机端口（推荐）
- `documentRoot` / `url`：资源根 / 入口
- `enableServer` / `enableNativeAPI`：服务器与原生 API 开关

</div>

<div>

**安全（重点）**

- `tokenSecurity: one-time`（**推荐**）：token 只下发一次、存 `sessionStorage`，外部浏览器无从连接
- `tokenSecurity: none`：任何新客户端都能连——**危险**
- `nativeAllowList`：**白名单**，仅列出方法可调（`"os.*"`）
- `nativeBlockList`：**黑名单**，禁用指定方法

</div>

</div>

<!--
所有配置集中在 neutralino.config.json。左边是基础项：应用 ID、默认模式、端口建议设 0 随机分配、前端资源根目录。右边是重点——安全。Neutralino 没有 Tauri 那种默认拒绝的强权限模型，安全要靠手动收紧：tokenSecurity 一定用 one-time，让 token 只下发一次存在 sessionStorage，外部浏览器就连不进来；再用 nativeAllowList 白名单只放行需要的原生方法。
-->

---
transition: fade-out
---

# 四种运行模式

`defaultMode` 一键切换应用形态

<v-clicks>

- **window**（默认）：原生 OS 窗口，跟随系统主题，桌面应用首选
- **browser**：在默认浏览器打开——「能调原生能力的 Web 应用」
- **cloud**：作为后台服务进程运行，可暴露到网络、当轻量消息 broker
- **chrome**：借用户装的 Chrome / Edge 以 app 模式运行，外观更接近原生

</v-clicks>

<div v-click class="mt-4 text-sm">

**安全提醒**：`cloud` 会把原生权限传导给 Web 端，务必用 `nativeAllowList` / `nativeBlockList` 严格收紧

</div>

<!--
同一份代码可以跑成四种形态：window 是默认的原生窗口，做桌面应用用这个；browser 直接在用户浏览器里打开，等于一个能调原生能力的 Web 应用；cloud 把它当后台服务进程跑，可以暴露到内网外网甚至当轻量消息中转；chrome 模式借用户装的 Chrome 或 Edge 的 app 模式启动，外观更接近原生。特别注意 cloud 模式会把原生权限传导给 Web 端，一定要用 allowList 或 blockList 收紧。
-->

---
transition: fade-out
---

# vs Electron / Tauri / Wails

| 维度 | **Neutralino** | Electron | Tauri | Wails |
| --- | --- | --- | --- | --- |
| 渲染 | 系统 WebView | 捆绑 Chromium | 系统 WebView | 系统 WebView |
| 运行时 | **极薄 C++ 内核** | Node + Chromium | Rust | Go |
| 典型体积 | **< 2MB** | 150–200MB | 数 MB 级 | 数 MB 级 |
| 权限模型 | allow/block 白黑名单 | 无强制 | **默认拒绝 capability** | 有 |

<div grid="~ cols-2 gap-4" class="mt-4 text-sm">

<div>

**Neutralino 强在**

- 后端最简最轻，无 Rust/Go/Node，产物最小
- 前端纯 JS 门槛低；扩展可用任意语言补后端

</div>

<div>

**代价（如实）**

- 生态 / 成熟度弱于 Electron、Tauri，社区小众（≈8.5k star）
- 权限模型弱于 Tauri；依赖系统 WebView 一致性

</div>

</div>

<!--
横向对比：渲染上除了 Electron 捆绑 Chromium，其余都用系统 WebView。运行时是 Neutralino 最大的差异——别人要 Node、Rust 或 Go，它只有一个极薄的 C++ 内核，所以体积能压到 2MB 以内。代价也要如实说：生态和成熟度不如 Electron 和 Tauri，社区比较小众；权限模型没有 Tauri 那种默认拒绝那么强；而且和所有用系统 WebView 的框架一样，要面对各平台 WebView 行为不一致的坑。
-->

---
layout: center
class: text-center
---

# 选型总结

**要极小体积、内部小工具、纯前端团队、不需要原生 UI 组件** → Neutralino

系统 WebView · 极薄 C++ 内核 · 无运行时 · 任意语言扩展

<div class="mt-8 text-sm opacity-75">

[官方文档](https://neutralino.js.org/) · [GitHub](https://github.com/neutralinojs/neutralinojs) · [neu CLI](https://neutralino.js.org/docs/cli/neu-cli)

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/neutralinojs/neutralinojs" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
一句话选型：如果你要的是极小的体积、做内部小工具、团队是纯前端、又不需要原生 UI 组件，Neutralino 是很合适的轻量选项。它的记忆点就是：系统 WebView 加极薄 C++ 内核，没有额外运行时，缺的能力用任意语言写扩展来补。2026 年新项目主流会先看 Tauri，Neutralino 是「更轻但更简」的补充选项。谢谢大家！
-->
