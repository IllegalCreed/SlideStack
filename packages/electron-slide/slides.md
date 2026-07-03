---
theme: seriph
background: https://cover.sli.dev
title: Electron 深入浅出
info: |
  用 Web 技术构建跨平台桌面应用。

  基于 Electron 43 · 了解更多 [electronjs.org](https://www.electronjs.org/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Electron

用 **HTML/CSS/JS + Chromium + Node.js** 构建跨平台桌面应用（基于 43）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://www.electronjs.org/" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好，今天聊 Electron —— 把一整份 Chromium 和 Node.js 打包进应用，用最熟悉的 Web 技术产出 Windows/macOS/Linux 三端一致的桌面软件。
-->

---
transition: fade-out
---

# 什么是 Electron

一句话：**内置一份 Chromium + Node.js**，一套代码三端一致渲染

<v-clicks>

- Web 技术写 **Win / mac / Linux** 桌面应用，OpenJS 基金会托管，**桌面开发事实标准**
- 自带引擎 → **渲染一致**、可独立于系统下发修复；能 Web 与原生代码混搭
- 标杆：**VS Code、Slack、Discord、Notion、Docker Desktop、ChatGPT 桌面版**
- 代价：安装包常 **>100MB**、内存 **150-300MB**；不适合低内存 IoT / 纯原生 UI / 3D 游戏
- 版本：**43 ≈ Chromium 150 + Node 24**；每 8 周一大版本、只维护**最新 3 个**

</v-clicks>

<!--
关键点：它不是 WebView 套壳，而是把浏览器和 Node 运行时一起打包，换来跨端一致，代价就是体积和内存。版本节奏跟 Chromium 走，别去背某条已 EOL 的老线。
-->

---
transition: fade-out
---

# 进程模型：四种进程

沿用 Chromium 多进程架构——**一处崩溃或被攻破，不拖垮整个应用**

<div grid="~ cols-2 gap-4">

<div>

- **main 主进程**（1 个，Node）：入口，管**窗口 / 生命周期 / 原生能力**
- **renderer 渲染进程**（N 个，Chromium）：每窗口一个，跑 UI，**默认无 Node**

</div>

<div>

- **preload 预加载**：网页加载前于渲染进程运行的**特权桥**，用 `contextBridge` 暴露 API
- **utility 工具进程**（可选，Node）：`utilityProcess.fork()` 放不受信 / CPU 密集 / 易崩的活

</div>

</div>

<div v-click class="mt-4 text-sm">

每个 `BrowserWindow` 派生一个独立渲染进程；菜单、托盘、对话框只能在主进程调用。

</div>

<!--
四进程要分清职责：主进程独占 Node 和原生 API，渲染进程默认被削权只管 UI，preload 是它俩之间唯一的合法桥梁，utility 用来隔离危险或重活。
-->

---
transition: fade-out
---

# 沙箱与三大安全默认

除主进程外，渲染 / 工具进程被 OS 限制到「只能用 CPU 和内存」

<div grid="~ cols-2 gap-4">

<div>

| 开关 | 安全默认 | 起始版本 |
| --- | --- | --- |
| `nodeIntegration` | **false** | v5 |
| `contextIsolation` | **true** | v12 |
| `sandbox` | **true** | v20 |

</div>

<div>

- 沙箱化渲染进程**无 Node 环境**，特权操作一律走 IPC 交主进程
- 关沙箱：`sandbox:false`（或 `nodeIntegration:true` 会连带关）——有安全风险
- 全局强制开：`app.enableSandbox()`（须在 ready 前）

</div>

</div>

<!--
这三个默认值是安全基线，务必记住它们各自从哪个大版本才成为默认——说「一直都是默认」是错的。沙箱把渲染进程削到只剩算力，碰系统全得委托主进程。
-->

---
transition: fade-out
---

# 上下文隔离 + contextBridge

`contextIsolation`（v12 起默认）：preload 与网页跑在**两个独立 JS 上下文**

```js
// preload —— 只暴露够用的窄接口
const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('electronAPI', {
  loadPrefs: () => ipcRenderer.invoke('load-prefs'),
  onUpdate: (cb) => ipcRenderer.on('update', (_e, v) => cb(v)) // 包一层，不泄露 event
})
```

<v-clicks>

- 隔离下**不能** `window.xxx = ...`，必须经 `contextBridge` 挂到 `window`
- 跨桥只能传**可结构化克隆**的值 / 函数；自定义原型链、Symbol 过桥会丢

</v-clicks>

<!--
上下文隔离让网页拿到的 window 和 preload 的 window 是两个对象，XSS 就碰不到你的特权 API。暴露时只给窄接口，回调一定包一层剥掉 event，否则会泄露整个 ipcRenderer。
-->

---
transition: fade-out
---

# IPC 四种通信模式

通道任意命名、双向；对象走结构化克隆，**避免 `sendSync`**

<div grid="~ cols-2 gap-4">

<div>

- **① 渲→主 单向** `send` / `on`
- **② 渲→主 双向** `invoke` / `handle` ★
- **③ 主→渲** `webContents.send` / `on`
- **④ 渲↔渲** `MessageChannelMain` 端口

</div>

<div>

```js
// ② invoke / handle 最常用
// preload
exposeInMainWorld('api', {
  open: () => ipcRenderer.invoke('open')
})
// main
ipcMain.handle('open', async () => {
  const r = await dialog.showOpenDialog()
  return r.filePaths[0]
})
```

</div>

</div>

<div v-click class="mt-2 text-sm">

坑：`ipcMain.handle` 抛错跨进程**只序列化 `message` 字段**；`sendSync` 会同步阻塞渲染进程。

</div>

<!--
四种模式对应四类需求：触发动作用 send，要结果用 invoke（最常用），主动推送用 webContents.send，窗口互通用 MessagePort。同步的 sendSync 会冻结 UI，能不用就不用。
-->

---
transition: fade-out
---

# 安全 Checklist（官方 20 条精选）

主线：**安全传输 → 关危险 API → 进程隔离 → 校验来源 → 收窄暴露**

<v-clicks>

- **只加载 HTTPS / WSS**，不给远程内容开 `nodeIntegration`
- 保持 `contextIsolation` / `sandbox` / `webSecurity` 默认开启
- **定义 CSP**（`default-src 'none'` 起步）；`setWindowOpenHandler` 拦截新窗
- **校验每个 IPC 的 sender**：比对 `event.senderFrame.url` 的 host
- `contextBridge` 只暴露窄接口，**永不透传 `ipcRenderer`**
- 用**最新版** Electron；`shell.openExternal` 不接不受信数据

</v-clicks>

<!--
安全是头号考点。大量攻击面来自「渲染进程加载了不受信内容 + 特权没关严」。记这条主线：传输安全、关掉危险开关、隔离进程、校验来源、收窄暴露面。
-->

---
transition: fade-out
---

# Electron Fuses：构建期硬化

二进制里的「魔法位」，**打包时（签名前）翻转**，之后由代码签名强制生效

<div grid="~ cols-2 gap-4">

<div>

| Fuse | 默认 | 硬化 |
| --- | --- | --- |
| `runAsNode` | 开 | **关** |
| `nodeOptions` | 开 | **关** |
| `nodeCliInspect` | 开 | **关** |
| asar 完整性校验 | 关 | **开** |
| `onlyLoadAppFromAsar` | 关 | **开** |

</div>

<div>

- 工具：`@electron/fuses`（Forge 有 fuses 插件）
- `npx @electron/fuses read --app ...` 查状态
- 目的：堵住 `ELECTRON_RUN_AS_NODE` 等「就地取材」攻击面

</div>

</div>

<!--
Fuses 是不用 fork Electron 就能硬化二进制的开关，打包时翻转、签名后不可再改。生产建议关掉 runAsNode/nodeOptions/nodeCliInspect，开启 asar 完整性校验。
-->

---
transition: fade-out
---

# 打包分发：Forge / builder / ASAR

<div grid="~ cols-2 gap-4">

<div>

**Electron Forge**（官方推荐）

- 三段式：`package` → `make` → `publish`
- Makers：Squirrel / MSI、dmg / zip、deb / rpm
- 脚手架 `npm create electron-app@latest`

**electron-builder**（社区最流行）

- 一体化打包，**自带 auto-update**

</div>

<div>

**ASAR 归档**

- 把源码拼成单个 `app.asar` 放 `resources/`
- Windows 下**改善文件读取性能**、简化分发
- 配 asar 完整性 + `onlyLoadAppFromAsar` 两 fuse 防篡改

</div>

</div>

<!--
两条主流路线：官方 Forge 把打包/制包/发布统一成三段命令；社区 electron-builder 配置集中且自带更新。ASAR 把源码打成单归档，既提速又便于配合 fuse 做完整性校验。
-->

---
transition: fade-out
---

# 代码签名 + 自动更新

<div grid="~ cols-2 gap-4">

<div>

**签名（分发必做）**

- **macOS**：Developer ID **签名 + 公证**；未签名连自动更新都会失效
- **Windows**：2023-06 起**强制 EV 证书**；首选 **Azure Trusted Signing** 消除 SmartScreen 警告

</div>

<div>

**autoUpdater**（底层 Squirrel）

```js
require('update-electron-app')()
```

- 一行接入官方免费更新服务
- 要求公开 GitHub 仓库 + Releases + 已签名
- `update-downloaded` → `quitAndInstall()`

</div>

</div>

<!--
签名是分发的硬门槛：mac 要签名加公证，否则自动更新和通知都失效；Windows 现在只有 EV 证书才免 SmartScreen 警告。更新最省事就是那一行 update-electron-app 接官方免费服务。
-->

---
transition: fade-out
---

# 生命周期 + 原生能力

<div grid="~ cols-2 gap-4">

<div>

**app 生命周期事件**

- `whenReady()`：就绪后再建窗口
- `window-all-closed`：非 mac 即退出
- `activate`：mac 无窗时重建
- `before-quit` / `second-instance`（单实例锁）

</div>

<div>

**常用原生模块**

- 窗口 UI：`BrowserWindow`、`Menu`、`Tray`、`dialog`
- 系统集成：`Notification`、`globalShortcut`、`shell`、`clipboard`、`nativeTheme`

</div>

</div>

<div v-click class="mt-2 text-sm">

原生 Node 模块须用 `@electron/rebuild` 按 Electron 的 Node ABI 重编译（Forge 内置处理）。

</div>

<!--
生命周期要记住 mac 的两个特例：关光窗口不退出、点 Dock 图标要能重建窗口。原生能力都在主进程调用，用到 C++ 原生模块时记得按 Electron 的 ABI 重编译。
-->

---
transition: fade-out
---

# 生态取舍：Electron vs Tauri

| 维度 | **Electron 43** | **Tauri v2** |
| --- | --- | --- |
| 渲染引擎 | 自带 Chromium（三端一致） | 系统原生 WebView |
| 后端语言 | Node.js（JS / TS） | Rust |
| 安装包 | 80-150MB | ~5-10MB |
| 内存 | 150-300MB | 30-50MB |
| 生态 / 分发 | **最成熟**（签名 / 更新 / 打包） | 年轻、增长快 |

<div v-click class="mt-3 text-sm">

命中**渲染一致性 / Node 生态 / 成熟分发**三条硬需求 → Electron；否则新项目可从 Tauri 起步。

</div>

<!--
Tauri 用系统 WebView 换来极小体积和低内存，但要吃各平台渲染差异、后端得写 Rust。选型看三条硬需求：像素级一致、重度依赖 Node、要成熟的签名更新链路，命中就选 Electron。
-->

---
layout: center
class: text-center
---

# 选型总结

**要用 Web 技术做三端一致的桌面应用、看重成熟分发链路** → Electron

进程隔离 · contextBridge + IPC · 安全默认 + Fuses · 桌面事实标准

<div class="mt-8 text-sm opacity-75">

[官方文档](https://www.electronjs.org/) · [安全指南](https://www.electronjs.org/docs/latest/tutorial/security) · [Electron Forge](https://www.electronforge.io/)

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://www.electronjs.org/" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
一句话收尾：团队是 JS/TS 系、要三端像素级一致、又看重成熟的签名与更新链路，Electron 就是 2026 的稳妥之选。谢谢大家！
-->
