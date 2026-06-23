---
theme: seriph
background: https://cover.sli.dev
title: Safari Web Inspector 完全指南
info: |
  Safari Web Inspector 完全指南：WebKit 引擎调试 · iOS / iPadOS 远程调试唯一选择

  Learn more at [https://developer.apple.com/safari/tools/](https://developer.apple.com/safari/tools/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Safari Web Inspector

WebKit 引擎调试 · iOS / iPadOS 远程调试唯一选择

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Safari Web Inspector 是调试 iOS WebKit 的唯一官方工具。
-->

---
transition: fade-out
---

# 什么是 Safari Web Inspector

Apple Safari（**WebKit 引擎**）内置的开发者工具

- **面板熟悉**：Elements / Console / Sources / Network / Storage 同 Chromium 习惯
- **WebKit 真实行为**：渲染 / 字体 / GPU / ITP 只能在此还原
- **核心价值**：调试 iOS / iPadOS 上的 Safari 与 WebView
- **三引擎之一**：Blink / Gecko / **WebKit** 的唯一调试入口
- **需先启用**：默认隐藏，要在设置里打开「开发」菜单

> 做移动端 Web，它是绕不开的最后一站。

<!--
Safari 的不可替代性在于 iOS 调试和 WebKit 真实行为。
-->

---

# 为什么不可替代

iOS / iPadOS 上**所有浏览器都强制使用 WebKit**

- iOS 版 Chrome、Firefox 底层也是 WebKit
- WebKit 的渲染、字体回退、`-webkit-` 行为、GPU 合成无法在别处复现
- **ITP（智能防跟踪）** 对 Cookie / 存储的限制是 WebKit 特有
- 只在 iOS Safari 出现的兼容性 bug，只能用真机 Web Inspector 定位

> Chrome 设备模式是「模拟」，Safari 真机调试是「真实」。

<!--
这一页解释为什么 Safari 必须单独成为一个工具。
-->

---

# 启用开发菜单（第一步）

Safari 默认隐藏开发者功能

1. Safari 菜单 → **设置**（`Cmd+,`）
2. 切到 **高级（Advanced）** 标签
3. 勾选 **「显示网页开发者功能」**（旧版「显示开发菜单」）

启用后菜单栏出现 **开发（Develop）** 菜单，所有调试入口都在这里。

<!--
不启用开发菜单就找不到任何调试入口，这是新手第一个坑。
-->

---

# 打开方式与快捷键

| 操作 | 快捷键 |
|------|--------|
| 打开网页检查器 | `Cmd+Opt+I` |
| 直达 Console | `Cmd+Opt+C` |
| 选择元素 | `Cmd+Shift+C` |
| 响应式设计模式 | `Cmd+Opt+R` |

也可在网页右键 →「检查元素」打开。

<!--
快捷键与其他浏览器相近，唯独需要先启用开发菜单。
-->

---

# 面板总览

| 面板 | 用途 |
|------|------|
| **Elements** | DOM 与 WebKit 样式 |
| **Console** | 日志、运行 JS |
| **Sources** | 源码、断点调试 |
| **Network** | 请求分析 |
| **Timelines** | 性能时间线 |
| **Storage** | Cookie / 存储 / SW |
| **Audit / Graphics** | 审计 / Canvas 图层 |

<!--
通用面板与 Chrome 对应，Timelines 是 Safari 的性能分析。
-->

---

# iOS 真机调试：步骤

调试 iPhone 上的真实页面

**1. iPhone 端**：设置 → Apps → Safari → 高级 → 开「网页检查器」

**2. Mac 端**：

- 数据线连 iPhone，信任设备
- Mac Safari 开发菜单出现设备名
- 展开设备 → 选标签页 / Web App
- 弹出 Inspector，操作同桌面

> Mac 里选元素 / 改样式，iPhone 页面**实时响应**。

<!--
真机调试是 Safari 最核心的工作流。
-->

---

# 模拟器调试

无真机时用 Xcode iOS Simulator

- 在 Simulator 里用 Safari 打开页面
- Mac Safari 开发菜单出现 **Simulator** 项
- 选标签页即可调试

> 模拟器跑的也是 WebKit，比 Chrome 设备模式更接近真机；但硬件相关行为仍以真机为准。

<!--
模拟器是没有真机时的次优选择。
-->

---

# 可调试的目标

| 目标 | 说明 |
|------|------|
| Safari 标签页 | iOS Safari 打开的网页 |
| 主屏 Web App | 添加到主屏的 PWA |
| WKWebView | 原生 App 内嵌网页 |
| SFSafariViewController | App 内 Safari 视图 |
| Service Worker | 后台 SW 脚本 |

<!--
不只是网页，App 内的 WebView 也能调试。
-->

---

# 调试 App 内的 WebView

iOS 16.4 / macOS 13.3 起需显式开启

```swift
// Swift：让 WebView 可被 Web Inspector 检查
if #available(iOS 16.4, *) {
  webView.isInspectable = true
}
```

> 未设 `isInspectable` 的 WebView **不会出现**在开发菜单——「连了真机却看不到页面」的常见原因。

<!--
isInspectable 是混合 App 调试的关键开关。
-->

---

# 不能用 Chrome 设备模式替代

| | Chrome 设备模式 | Safari 真机 |
|---|---------------|------------|
| 引擎 | Blink（模拟） | WebKit（真实） |
| 字体 / 渲染 | 桌面近似 | iOS 真实 |
| ITP 防跟踪 | ✗ | ✅ |
| GPU 合成 | 桌面 | iOS GPU |

> 移动端兼容 bug 只能用真机 Web Inspector 定位。

<!--
强调模拟与真实的本质区别。
-->

---

# Elements 与样式

- **DOM 树**：完整可编辑，双击改标签 / 属性 / 文本
- **Styles**：实时编辑，按 **WebKit 的层叠规则**解析
- **强制伪类**：`:hover` / `:active` 调悬停样式
- **盒模型 / Computed**：尺寸与最终计算值

> 价值在于展示 **WebKit 的真实样式行为**——某 CSS 只在 Safari 出问题时来这里查。

<!--
Elements 用法与 Chrome 类似，关键是反映 WebKit 行为。
-->

---

# Console

与 Chrome 用法基本一致

- 工具函数：`$0`、`$(sel)` / `$$(sel)`、`copy(obj)`
- console API：`log` / `table` / `group` / `time` / `dir`

```js
console.table($$("a").map((a) => ({ href: a.href })));
```

> 远程调试时，Console 直接在 **iPhone 页面上下文**执行——在 Mac 上敲命令操作 iOS 页面。

<!--
Console 在真机上下文执行是远程调试的强大之处。
-->

---

# Sources：断点调试

完整的 JavaScript 调试器

- **断点**：行 / 条件 / 事件 / 异常断点
- **单步**：继续 / 跨过 / 步入 / 步出
- **Call Stack / Scope / Watch**：调用栈、作用域、监视
- **Pretty print**：格式化压缩代码

> 桌面与 iOS 远程调试操作完全一致——学一次，两端通用。

<!--
断点体系与其他浏览器对等。
-->

---

# Network

请求分析

- 请求列表：按类型过滤，列可定制
- 详情：Headers / Cookies / 内容 / Timing / Sizes
- HAR 导出；限速（档位较 Chrome 简单）

> 远程调试时观察 **iPhone 真实网络请求**——排查移动端接口、跨域、缓存。

<!--
真机网络观察是排查移动端接口问题的关键。
-->

---

# Timelines：性能分析

对应 Chrome 的 Performance

| 时间线 | 内容 |
|--------|------|
| Network Requests | 请求时间分布 |
| Layout & Rendering | 重排 / 绘制 / 合成 |
| JavaScript & Events | 脚本 / 事件 |
| CPU / Memory | 占用与内存 |

> 在 iOS 真机录制，发现只在移动端出现的性能瓶颈。

<!--
Timelines 分析 iOS 真实性能，是设备模式给不了的。
-->

---

# Storage 与 ITP

集中管理客户端存储

- Cookies / Local / Session / IndexedDB / Cache / Service Workers

**ITP（智能防跟踪）**

- WebKit 特有：限制第三方 Cookie 与存储寿命
- 第三方登录 / 跟踪在 iOS 失效？用 Storage 面板排查 ITP 影响

<!--
ITP 是 WebKit 特有行为，只能在 Safari 调试。
-->

---

# Audit 与 Graphics

**Audit**：对页面执行审计

- 内置可访问性 / 代码审计
- **支持自写审计脚本**（用 JS 写团队规范检查）

**Graphics / Layers**

- Canvas / WebGL 绘制调用录制回放
- 动画关键帧预览
- 合成图层可视化（排查「图层爆炸」）

<!--
Audit 可自定义；Layers 对移动端 GPU 内存排查重要。
-->

---

# 响应式设计模式

开发菜单 →「进入响应式设计模式」（`Cmd+Opt+R`）

- 预设 Apple 机型（iPhone / iPad）尺寸与 DPR
- 切换方向、User-Agent
- 快速预览不同视口

> 这是桌面 Safari 的**近似模拟**；测 iOS 真实行为仍需真机远程调试。

<!--
响应式模式方便预览，但不替代真机。
-->

---

# 三大引擎调试入口

| 引擎 | 浏览器 | 调试工具 |
|------|--------|----------|
| Blink | Chrome / Edge | Chrome DevTools |
| Gecko | Firefox | Firefox DevTools |
| **WebKit** | **Safari / iOS** | **Safari Web Inspector** |

> 三引擎都覆盖，才能保证跨浏览器兼容性。

<!--
Safari 补齐了 WebKit 这一引擎的调试，三足鼎立。
-->

---
layout: center
class: text-center
---

# 小结

Safari Web Inspector = WebKit 调试 + iOS 真机唯一入口

通用面板对等 Chrome · Timelines 性能 · ITP / WebView 调试

**做移动端 Web，绕不开的最后一站**

[开发者工具](https://developer.apple.com/safari/tools/) · [检查 iOS/iPadOS](https://developer.apple.com/documentation/safari-developer-tools/inspecting-ios)

<!--
掌握 iOS 远程调试，才算真正能调移动端 Web。
-->
