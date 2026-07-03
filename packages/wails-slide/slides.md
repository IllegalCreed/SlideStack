---
theme: seriph
background: https://cover.sli.dev
title: Wails 深入浅出
info: |
  用 Go 写后端、系统原生 WebView 渲染前端的跨平台桌面框架。

  基于 Wails v2.12.0（v3 仍为 alpha）· 了解更多 [wails.io](https://wails.io/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Wails

用 **Go + 系统 WebView** 构建轻量跨平台桌面应用（基于 v2.12.0）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/wailsapp/wails" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Wails —— 面向 Go 开发者的桌面框架：后端用 Go，前端交给系统自带的 WebView 渲染，最终产出一个小体积的单文件可执行程序。可以先理解成「Go 版的 Tauri」。
-->

---
transition: fade-out
---

# 什么是 Wails

一句话：用 **Go 写后端**，用**系统原生 WebView** 渲染前端

<v-clicks>

- 复用系统 WebView（Win 用 WebView2 / mac 用 WebKit / Linux 用 WebKitGTK），**不打包 Chromium** → 体积小
- 思路与 **Tauri 一致**，但后端语言是 **Go 而非 Rust**——受众是 **Go 开发者**
- 核心卖点：Go 方法**自动绑定**到前端 JS、**自动生成 TypeScript** 模型
- 产物是**单一可执行文件**；Windows 无需 CGO、无需外部 DLL
- 定位「**Go 版的轻量 Electron 替代**」

</v-clicks>

<!--
Wails 的定位很清晰：如果你是 Go 团队，又想用 Web 技术做桌面 GUI，它让后端全用 Go，前端随便挑框架，最后编译成一个小巧的单文件。
-->

---
transition: fade-out
---

# 架构：Go 内核 + 系统 WebView

前端资源用 `embed.FS` 嵌进二进制，最终产出**单一文件**

<div grid="~ cols-2 gap-4">

<div>

**分层**

- 上层：**Go 应用**（业务逻辑 + Wails runtime 库）
- 中间：**绑定层 / 内存桥**（in-memory bridge）
- 下层：**系统原生 WebView** 负责渲染
- 两个交互面：① 调绑定的 **Go 方法**；② 调 **runtime**（窗口 / 对话框 / 事件…）

</div>

<div>

| 平台 | WebView 引擎 |
| --- | --- |
| Windows | WebView2 |
| macOS | WKWebView |
| Linux | WebKitGTK |

- **前端零约束**：给含 `index.html` 的 `embed.FS` 即可
- 框架任选：React / Vue / Svelte / 原生
- 生产资源全嵌入，**无外部文件**

</div>

</div>

<!--
架构分两层：上层 Go 编译进单文件，下层系统 WebView 负责渲染。前端资源通过 Go 的 embed.FS 嵌进二进制，所以最终就一个文件。注意不同平台是不同的 WebView 引擎，跨端要测兼容性。
-->

---
transition: fade-out
---

# v2 应用骨架：main.go + app.go

双文件范式：`main.go` 配置启动，`app.go` 写业务

```go
//go:embed all:frontend/dist
var assets embed.FS

func main() {
    app := NewApp()
    wails.Run(&options.App{
        Title: "My App", Width: 1024, Height: 768,
        AssetServer: &assetserver.Options{Assets: assets}, // 必填
        OnStartup:   app.startup,        // 拿到 ctx 存下来
        Bind:        []interface{}{app}, // 暴露给前端的实例
    })
}
```

<div class="text-sm mt-2">

生命周期：**OnStartup**（初始化）→ **OnDomReady**（runtime 调用建议放这里）→ **OnBeforeClose**（拦截关闭）→ **OnShutdown**

</div>

<!--
v2 是经典双文件：main.go 负责配置和启动，app.go 写业务逻辑。特别注意 runtime 调用建议放在 OnDomReady 而不是 OnStartup，因为窗口是在另一个线程初始化的。
-->

---
transition: fade-out
---

# Bind：把 Go 方法暴露给前端

最核心特性——`Bind` 传 **struct 实例**，扫描其**公开方法**生成 JS 绑定

<div grid="~ cols-2 gap-4">

<div>

```go
type App struct { ctx context.Context }

func (a *App) startup(ctx context.Context) {
    a.ctx = ctx
}
// 首字母大写 = 自动绑定
func (a *App) Greet(name string) string {
    return fmt.Sprintf("Hello %s!", name)
}
```

</div>

<div>

- 传的是**实例**（非类型），可绑**多个** struct
- 多 struct 共享 ctx：在 `OnStartup` 里各自 `SetContext(ctx)`
- 枚举用 `EnumBind` 生成到前端 `models.ts`
- **约束**：字段需合法 `json` tag 才进 TS；**不支持匿名嵌套 struct**

</div>

</div>

<!--
Bind 是 Wails 的灵魂：把一个 struct 实例交给它，它扫描首字母大写的方法，自动在前端生成对应的 JS 函数。注意几个约束：字段要有 json tag，不支持匿名嵌套 struct。
-->

---
transition: fade-out
---

# 前端调用 Go：自动生成 TS 绑定

`wails dev` 在 `frontend/wailsjs/` 生成 JS 包装 + `.d.ts` + `models.ts`

```js
import { Greet } from "../wailsjs/go/main/App";

Greet("Peter").then(result => {
  console.log(result); // "Hello Peter!"
});
```

<v-clicks>

- 调用**恒返回 Promise**：Go 首个返回值 → `resolve`
- Go 第二返回值若是非 nil 的 `error` → `reject`
- **类型全自动转换**：Go struct 在前端变成 JS class
- 底层其实是 `window["go"]["main"]["App"]["Greet"](arg)`

</v-clicks>

<!--
最爽的地方：前端不用手写接口，wails dev 自动生成绑定和 TS 类型。调用统一是 Promise，Go 返回的 error 会自动变成 reject。
-->

---
transition: fade-out
---

# 事件系统 + Runtime 库

Go 侧 `runtime.*`（首参恒为 `ctx`）与 JS 侧 `window.runtime.*` **方法对等**

<div grid="~ cols-2 gap-4">

<div>

**事件（双向）**

```go
// Go 发射
runtime.EventsEmit(ctx, "tick", 1)
```

```js
// JS 监听 / 发射
window.runtime.EventsOn("tick", cb)
window.runtime.EventsEmit("tick", 1)
```

`EventsOn` / `Once` / `OnMultiple` / `Off`

</div>

<div>

**Runtime 分类**

- **Window**：`WindowSetTitle` / `Minimise` / `Fullscreen`
- **Dialog**：`OpenFileDialog` / `MessageDialog`
- **Clipboard**：`ClipboardGetText` / `SetText`
- **Browser / Log / Menu**
- `Environment()` 返回 BuildType / Platform / Arch

</div>

</div>

<!--
事件系统是 Go 和 JS 双向对等的，方法名一一对应。Runtime 库则按窗口、对话框、剪贴板等分类，Go 侧调用第一个参数永远是 ctx。
-->

---
transition: fade-out
---

# CLI 与环境要求（v2）

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
wails init -n myapp -t vue   # 从模板建项目
wails dev                    # 热重载，devserver :34115
wails build                  # 打生产单二进制（-upx 压缩 / -nsis 安装包）
wails doctor                 # 体检环境
```

<div grid="~ cols-2 gap-4">

<div>

- **Go 版本**：v2 需 **Go 1.21+**（新版 macOS 更高）
- **Node** 15+（前端构建用）
- `wails build` 读 `wails.json` 的 `frontend:install/build`

</div>

<div>

- 内置模板：Svelte / React / Vue / Preact / Lit / 原生
- 接 Vite 等外部 devserver：`-frontenddevserverurl`
- v3 的 CLI 是**另一个命令** `wails3`（见下文）

</div>

</div>

<!--
v2 的 CLI 就叫 wails，init 建项目、dev 热重载、build 出单文件、doctor 体检。注意 Go 版本要求 1.21 以上。特别提醒：v3 用的是另一个命令 wails3，别和 wails 混。
-->

---
transition: fade-out
---

# v3 大改①：application.New + Services

<div class="text-sm opacity-80 mb-2">

**注意**：v3 **仍是 alpha、未 GA**，**生产请用 v2**。v3 把「单窗口 + 声明式」改为「多窗口 + 过程式」

</div>

```go
import "github.com/wailsapp/wails/v3/pkg/application"

app := application.New(application.Options{
    Name: "My App",
    Services: []application.Service{ // 取代 v2 的 Bind
        application.NewService(&GreetService{}),
    },
})
app.Window.NewWithOptions(application.WebviewWindowOptions{Title: "Win1"})
app.Run()
```

- **Services** 取代 `Bind`：普通 struct，公开方法自动暴露
- 生命周期：`ServiceStartup` / `ServiceShutdown`（按序启动、逆序关闭）
- 前端改从 `../bindings/<pkg>` 导入具名 service（按哈希 ID 调用）

<!--
v3 是一次大重构，但要反复强调：它现在还是 alpha，没有正式发布，生产环境请继续用 v2。入口从 wails.Run 变成 application.New，Bind 变成 Services，前端 import 路径也完全不同。
-->

---
transition: fade-out
---

# v3 大改②：多窗口 · 托盘 · 构建

<div grid="~ cols-2 gap-4">

<div>

**多窗口**（v3 头号新特性）

- `app.Window.NewWithOptions(...)` 建任意多个独立窗口
- `win.SetURL("/")` 载内嵌页或外部 URL；`win.Center()`
- v2 是单窗口，这是最大架构差异

**系统托盘**（新增）

- `app.SystemTray.New()` → `SetIcon` / `SetMenu`
- `AttachWindow(win)` 点托盘弹窗、失焦自动隐藏

</div>

<div>

**事件 Hook（可取消）**

```go
win.RegisterHook(
  events.Common.WindowClosing,
  func(e *application.WindowEvent) {
    e.Cancel() // 同步拦截关窗
  })
```

**构建改用 Taskfile**

- 用 `Taskfile.yml` 编排，可完全自定义
- `wails3 build` 只是薄封装
- 另有 **WML**（HTML 属性调 runtime，实验）

</div>

</div>

<!--
v3 最大亮点是多窗口，配套还有系统托盘、可取消的事件 Hook（比如关窗前弹确认框），以及用 Taskfile 编排的可定制构建。这些都还在 alpha 打磨中。
-->

---
transition: fade-out
---

# 选型对比：vs Tauri / Electron

| | Wails | Tauri | Electron |
| --- | --- | --- | --- |
| 后端语言 | **Go** | Rust | Node.js |
| 渲染 | 系统 WebView | 系统 WebView | **打包 Chromium** |
| 体积 | 小（数 MB 级） | 小（数 MB 级） | 大（数十~上百 MB） |
| 空闲内存 | 低 | 低 | 高 |
| 移动端 | v3 起实验支持 | v2 支持 | 无 |

<div v-click class="mt-3 text-sm opacity-80">

体积 / 内存随应用而异，只作**数量级**参考（Wails / Tauri « Electron）；Wails 与 Tauri 共用系统 WebView，需注意**各平台引擎差异**

</div>

<!--
三者对比：Wails 和 Tauri 都复用系统 WebView，体积内存都远小于打包 Chromium 的 Electron。区别主要在后端语言：Go、Rust、Node。具体数字随应用差异很大，记住数量级就好。
-->

---
layout: center
class: text-center
---

# 选型总结

**团队是 Go 系、要小体积桌面应用** → Wails

Go 后端 · 系统 WebView · 自动 TS 绑定 · 单文件分发

<div class="mt-6 text-sm opacity-75">

生产用 **v2.12.0**；**v3（多窗口 / 托盘）仍为 alpha**，可尝鲜勿上生产

</div>

<div class="mt-4 text-sm opacity-75">

[官方文档](https://wails.io/) · [v3 alpha](https://v3.wails.io/) · [GitHub](https://github.com/wailsapp/wails)

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/wailsapp/wails" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
一句话总结：如果你是 Go 团队，又要做小巧的桌面应用，Wails 是很自然的选择。生产就用 v2；v3 虽然带来多窗口和托盘，但还是 alpha，可以尝鲜但别急着上生产。谢谢大家！
-->
