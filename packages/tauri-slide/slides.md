---
theme: seriph
background: https://cover.sli.dev
title: Tauri 深入浅出
info: |
  用 Rust 后端 + 系统 WebView 构建轻量跨平台应用。

  基于 Tauri v2.x · 了解更多 [v2.tauri.app](https://v2.tauri.app/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Tauri

用 **Rust 后端 + 系统 WebView** 构建轻量跨平台应用（基于 v2.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/tauri-apps/tauri" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好，今天聊 Tauri —— 用 Rust 写后端、复用系统自带 WebView 渲染前端，产出比 Electron 更小更省内存的跨平台应用；v2 起还能一套代码打到手机。
-->

---
transition: fade-out
---

# 什么是 Tauri

一句话：**Rust 写后端 + 复用操作系统自带 WebView 渲染前端**

<v-clicks>

- 任意 HTML/CSS/JS 前端框架 + Rust 后端，打包成桌面与移动应用
- **不打包 Chromium/Node**，直接用系统 WebView → 安装包极小、内存低
- **前端无关**：Vue / React / Svelte / Leptos / Trunk 均有官方适配指南
- **安全**：Rust 内存安全 + 细粒度权限 ACL + 系统 WebView 由 OS 打补丁
- **v2 头号卖点**：单代码库五端 —— Win / macOS / Linux + iOS / Android

</v-clicks>

<!--
关键点：它复用系统 WebView，不像 Electron 每个 app 都塞一整个 Chromium，所以体积和内存有本质优势；前端你熟悉的框架都能用。
-->

---
transition: fade-out
---

# Tauri vs Electron

同为 Web 技术做桌面，路线相反

<div grid="~ cols-2 gap-4">

<div>

| 维度 | Tauri v2 | Electron |
| --- | --- | --- |
| 后端 | **Rust** | Node.js |
| 渲染 | **系统 WebView** | 打包 Chromium |
| 安装包 | <600KB~10MB | 100MB+ |
| 内存 | 低（~50MB 级） | 高 |
| 移动端 | **iOS / Android** | 不支持 |

</div>

<div>

**Tauri 的取舍**

- 体积与内存全面占优，源于不带浏览器引擎
- **代价**：各 OS WebView 内核不同 → 渲染一致性不如自带 Chromium，需跨平台测
- 门槛：后端复杂逻辑要懂 Rust

</div>

</div>

<!--
选型对照就记一条主线：Tauri 用体积、内存、安全，换来了「渲染一致性」的代价和「要会 Rust」的门槛。
-->

---
transition: fade-out
---

# 架构：Core + 上游 WRY / TAO

两大层：**Tauri Core（Rust）+ 上游 WebView / 窗口库**

<div grid="~ cols-2 gap-4">

<div>

**依赖链**

`tauri` → `tauri-runtime` → `tauri-runtime-wry` → **WRY** → **TAO**

- **WRY**：跨平台 WebView 渲染抽象，决定各 OS 用哪个原生 WebView
- **TAO**：窗口管理库，**fork 自 winit**，补菜单栏 / 系统托盘

</div>

<div>

| 平台 | 系统 WebView |
| --- | --- |
| Windows | WebView2 |
| macOS / iOS | WKWebView |
| Linux | WebKitGTK |
| Android | System WebView |

</div>

</div>

<div v-click class="mt-3 text-sm">

Core 还含 `tauri-build`（构建期宏）、`tauri-codegen`（内嵌资源）、`tauri-utils`（配置 / CSP 注入）

</div>

<!--
架构记两个上游库：WRY 管 WebView 渲染、TAO 管窗口（fork 自 winit）。体积小的根因就在于各平台直接用系统那颗 WebView。
-->

---
transition: fade-out
---

# 进程模型与 IPC

类浏览器的**多进程**模型，前后端只经 IPC 通信

<v-clicks>

- **Core 进程（Rust，唯一特权入口）**：编排窗口、托盘 / 通知、路由所有 IPC、持全局状态
- **WebView 进程（可多个）**：只渲染前端，跑 HTML / CSS / JS
- 多进程三理由：**响应性**（算力与 UI 分离）· **健壮性**（崩溃不连锁）· **安全**（最小权限）
- **vs Electron**：业务逻辑全留 Rust Core，前端摸不到文件系统，信任边界更硬
- IPC 基于**异步消息传递**：序列化收发，Core 可直接丢弃恶意请求

</v-clicks>

<!--
和 Electron 最大的不同：Tauri 把业务逻辑全锁在 Rust Core，前端只能通过序列化的 IPC 请求，Core 有权拒绝，信任边界比 Node 集成硬。
-->

---
transition: fade-out
---

# 命令：invoke + #[tauri::command]

前端调 Rust **并拿返回值**，打通前后端

```rust
#[tauri::command]                    // 参数默认 camelCase
fn greet(name: String) -> Result<String, String> {
    Ok(format!("Hello, {name}!"))
}
// 注册：.invoke_handler(tauri::generate_handler![greet])
```

```ts
import { invoke } from '@tauri-apps/api/core'
await invoke('greet', { name: 'Alice' }).catch(e => console.error(e))
```

<v-clicks>

- 返回 `Result<T, E>`（E 实现 `Serialize`，常用 thiserror）→ 前端进 `.catch`
- `async fn` 在独立线程跑不阻塞 UI，但**禁借用参数**（`&str` / `State<'_>`）
- **pub 规则**：`lib.rs` 内命令**不能 pub**；拆到独立模块**必须 pub**

</v-clicks>

<!--
Command 是最常用的原语：像 fetch 一样 invoke 一个命令名，Rust 侧用宏声明。三个易错点：Result 错误映射、async 不能收借用、以及 pub 规则。
-->

---
transition: fade-out
---

# 事件与 Channel

Command 之外的两种 IPC：广播式 **Event** 与流式 **Channel**

<div grid="~ cols-2 gap-4">

<div>

**Event**：一次性、fire-and-forget

```rust
use tauri::Emitter;
app.emit("progress", 50)?;         // 全局广播
app.emit_to("main", "finished", 100)?; // 定向
```

```ts
import { listen } from '@tauri-apps/api/event'
const un = await listen('progress', e => {})
// 卸载时 un()
```

</div>

<div>

**Channel**：高吞吐、有序、比 Event 快

```rust
use tauri::ipc::Channel;
#[tauri::command]
fn dl(on: Channel<u32>) { on.send(50).unwrap(); }
```

```ts
import { invoke, Channel } from '@tauri-apps/api/core'
const onEvent = new Channel()
onEvent.onmessage = m => console.log(m)
await invoke('dl', { onEvent })
```

</div>

</div>

<!--
Event 是广播、适合状态变更这类小数据；大数据或流式（下载进度）用 Channel，有序且更快，前端 new 一个 Channel 对象当参数传进去。
-->

---
transition: fade-out
---

# 状态管理 State

Core 持有全局状态，命令内按类型注入

```rust
use std::sync::Mutex;
use tauri::{Manager, State};

#[derive(Default)]
struct AppState { counter: u32 }

#[tauri::command] // 注入 State；可变状态包 Mutex
fn increase(state: State<'_, Mutex<AppState>>) -> u32 {
    let mut s = state.lock().unwrap();
    s.counter += 1;
    s.counter
}
```

<v-clicks>

- setup 里 `app.manage(Mutex::new(AppState::default()))` 注册（每类型仅一个实例）
- 可变状态包 `Mutex`；async 场景用 `tokio::sync::Mutex`
- 命令外访问：`app_handle.state::<Mutex<AppState>>()`（需 `use tauri::Manager`）

</v-clicks>

<!--
State 用 manage 注册、命令里按类型注入。可变状态记得包 Mutex；命令之外（事件处理、子线程）用 app_handle.state 拿。
-->

---
transition: fade-out
---

# 权限系统 ACL（v2 取代 v1 allowlist）

三件套细粒度授权，可按窗口 / 平台 / 来源区分

<v-clicks>

- **Permission**：某命令的显式特权，最小授予单元（含 allow / deny）
- **Scope**：权限内对路径 / 参数的允许拒绝细则（`$HOME/*` 允许、`$HOME/secret` 拒绝）
- **Capability**：把一组 permission **映射到具体窗口 / webview**，可限平台与远程 URL

</v-clicks>

<div v-click>

```json
// src-tauri/capabilities/main.json
{ "identifier": "main-capability", "windows": ["main"],
  "permissions": ["core:default", "fs:read-files", "fs:allow-mkdir"] }
```

</div>

<div v-click class="text-sm">

标识符 `<插件>:<allow|deny>-<命令>` 或 `<插件>:default`；**deny 优先于 allow**

</div>

<!--
v2 最大的迁移坑：v1 那个扁平 allowlist 没了，换成 Permission / Scope / Capability 三层。Permission 是最小单元，Scope 管路径细则，Capability 把权限绑到具体窗口。
-->

---
transition: fade-out
---

# 插件系统

v2 把大量核心 API 拆成**独立插件**，按需引入减小体积

<div grid="~ cols-2 gap-4">

<div>

**三步接入**

```bash
cargo add tauri-plugin-fs
npm i @tauri-apps/plugin-fs
```

```rust
tauri::Builder::default()
  .plugin(tauri_plugin_fs::init())
```

再给 capability 加对应权限

</div>

<div>

**官方插件（30+）**

- 文件 / 系统：`fs` `dialog` `shell` `os`
- 数据：`store` `sql` `http` `stronghold`
- 工具：`updater` `log` `global-shortcut`
- **移动专属**：`barcode-scanner` `biometric` `nfc` `haptics`

</div>

</div>

<div v-click class="mt-2 text-sm">

`core:` 命名空间是内置能力（window / event / path…），无需装插件但仍需授权

</div>

<!--
v2 把核心 API 插件化，用什么装什么。接入永远是三步：cargo add、npm i、Builder 里 plugin，最后别忘了在 capability 里授权。
-->

---
transition: fade-out
---

# 安全：CSP 与 Isolation

信任边界：**Rust Core = 全访问，WebView 前端 = 受限**

<div grid="~ cols-2 gap-4">

<div>

**CSP**（防 XSS）

- 在 `tauri.conf.json` 的 `app.security.csp` 配置
- **编译期自动加 nonce / hash**：外部脚本补 nonce，本地脚本算 hash
- Rust / WASM 前端需加 `'wasm-unsafe-eval'`

</div>

<div>

**Isolation Pattern**（官方推荐）

- 前端与 Core 间插一层**沙箱 iframe**，拦截并校验所有 IPC
- 消息经 **AES-GCM 加密**（每次运行换新密钥）
- 限制：Windows 下不支持 ES Modules，脚本须内联

</div>

</div>

<div v-click class="mt-2 text-sm">

选型：依赖多 / 要纵深防御 → **Isolation**；依赖极少、极致性能 → **Brownfield**（默认）

</div>

<!--
安全两把锁：CSP 防 XSS，好在 nonce/hash 编译期自动加；Isolation 在前端和 Core 之间插沙箱 iframe 校验 IPC，官方推荐尽量开。
-->

---
transition: fade-out
---

# Sidecar · updater · 打包分发

<div grid="~ cols-2 gap-4">

<div>

**Sidecar**（随包带外部二进制）

- `bundle.externalBin` 声明，用户免自装依赖
- 命名须带目标三元组：`名字-$TARGET_TRIPLE`
- 查三元组：`rustc --print host-tuple`

**updater**（自动更新）

- `signer generate` 出密钥对，私钥务必妥存
- 端点按 target / arch / version 取更新清单
- 前端 `check()` → `downloadAndInstall()` → 重启

</div>

<div>

**bundle**（`tauri build` 出安装包）

| 平台 | 格式 |
| --- | --- |
| Windows | MSI · NSIS |
| macOS | .app · .dmg |
| Linux | .deb · .rpm · AppImage |
| 移动 | APK / AAB · .ipa |

签名：mac 需公证，Win 装器签名，移动强制签名

</div>

</div>

<!--
分发三件事：Sidecar 把外部可执行文件随包带走（注意三元组命名）；updater 靠签名密钥做安全自动更新；bundle 一条 tauri build 出各平台安装包，别忘了代码签名。
-->

---
layout: center
class: text-center
---

# 选型总结

**要极小体积 + 低内存 + 强安全边界，团队能碰 Rust** → Tauri v2

系统 WebView · ACL 权限 · 单代码库五端 · ≈107–108k star

<div class="mt-8 text-sm opacity-75">

[官方文档](https://v2.tauri.app/) · [GitHub](https://github.com/tauri-apps/tauri) · [awesome-tauri](https://github.com/tauri-apps/awesome-tauri)

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/tauri-apps/tauri" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
一句话选型：预算体积和内存、又看重安全边界、团队愿意碰 Rust，Tauri v2 是很强的桌面 + 移动跨端方案。谢谢大家！
-->
