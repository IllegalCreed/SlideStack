---
theme: seriph
background: https://cover.sli.dev
title: Chrome DevTools 完全指南
info: |
  Chrome DevTools 完全指南：浏览器内置开发者工具集 · 调试 / 性能 / 内存 / AI assistance

  Learn more at [https://developer.chrome.com/docs/devtools](https://developer.chrome.com/docs/devtools)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Chrome DevTools 完全指南

浏览器内置开发者工具 · 调试 / 性能 / AI · Chrome 149

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Chrome DevTools 是 Chrome 内置的官方开发者工具集，2026 年深度集成了 Gemini 3 AI。
-->

---
transition: fade-out
---

# 什么是 Chrome DevTools

内置于 Chrome / Chromium 的**官方 Web 开发者工具集**

- **直连内核**：通过 CDP（Chrome DevTools Protocol）与浏览器内核通信
- **一站式**：DOM/CSS 检查、断点调试、网络、性能、内存、存储、审计
- **行业基准**：市占率最高浏览器的内置工具，调试技巧的事实标准
- **2026 演进**：Gemini 3 的 AI assistance + 面向 AI agent 的 chrome-devtools-mcp
- **跨 Chromium**：Edge / Brave / Opera 共享同一套工具

> 它是前端开发与性能优化的「主操作台」。

<!--
强调 DevTools 的定位：不只是看 DOM，而是覆盖调试全链路的集成环境。
-->

---

# 打开方式与界面

| 操作 | Mac | Win/Linux |
|------|-----|-----------|
| 打开 / 关闭 | `Cmd+Opt+I` | `F12` / `Ctrl+Shift+I` |
| 直达 Console | `Cmd+Opt+J` | `Ctrl+Shift+J` |
| 选择元素 | `Cmd+Shift+C` | `Ctrl+Shift+C` |
| 设备模式 | `Cmd+Shift+M` | `Ctrl+Shift+M` |

- 右上 `⋮` → **Dock side**：停靠右 / 下 / 左 / 独立窗口
- 底部 **Drawer**（`Esc` 切换）：叠加 Console、Rendering、Coverage

<!--
快捷键是效率基础，设备模式和停靠位置按习惯调整。
-->

---

# 命令菜单：万能入口

**`Cmd/Ctrl + Shift + P`** —— 记住这一个就够

```text
> Capture full size screenshot   # 整页截图
> Show Rendering                 # 重绘高亮 / FPS / 媒体仿真
> Show Coverage                  # 找未使用的 CSS/JS
> Disable JavaScript             # 临时禁用 JS
```

- 清空 `>` 后输文件名 → 跳转源码
- 输 `:行号` → 跳到指定行
- 输 `?` → 查看所有前缀

> 任何操作记不住菜单位置？命令菜单搜关键词直接跑。

<!--
命令菜单是新手最该先掌握的功能，避免在层层菜单里找入口。
-->

---

# 面板总览

| 面板 | 用途 |
|------|------|
| **Elements** | DOM / CSS 检查编辑、盒模型、Grid/Flex |
| **Console** | 日志、运行 JS、工具函数 |
| **Sources** | 源码、断点调试、Local Overrides |
| **Network** | 请求分析、限速、HAR |
| **Performance** | 运行时性能、火焰图、Web Vitals |
| **Memory** | 堆快照、内存泄漏 |
| **Application** | Storage / Cookie / SW / PWA |

> 另有 Security、Lighthouse、Recorder、AI assistance。

<!--
七大核心面板覆盖日常 95% 的调试需求。
-->

---

# Elements：检查与编辑 DOM

`Cmd/Ctrl+Shift+C` 点选元素，选中后 `$0` 在 Console 引用它

- **编辑**：双击标签 / 属性 / 文本即改；`F2` 当 HTML 编辑
- **快捷**：`H` 隐藏、`Delete` 删除、拖拽改顺序
- **Force state**：强制 `:hover` / `:focus` 调悬停样式
- **Store as global**：存为 `temp1` 到 Console 操作
- **DOM 断点**：右键 → Break on（子树 / 属性 / 移除）定位「谁改了它」

<!--
Elements 是最常用面板，DOM 断点能解决「元素莫名被改」的难题。
-->

---

# Styles 面板：实时调样式

改动立刻反映到页面（不写回源码）

- **数值微调**：聚焦数值 `↑/↓` 增减（`Shift`=×10，`Alt`=×0.1）
- **可视化编辑器**：颜色 / 阴影 / `cubic-bezier` / 渐变
- **`:hov`**：强制伪类；**`.cls`**：临时增删 class
- **来源标注**：每条规则标出样式表与行号，点击跳转

```css
.card {
  display: grid;
  gap: 12px; /* ↑/↓ 微调，眼见为实 */
}
```

> **Chrome 149**：Styles 接入 Gemini，复杂 CSS（渐变 / 阴影 / 网格）代码补全。

<!--
Styles 面板的实时编辑是调样式的核心工作流。
-->

---

# Computed 与盒模型

**Computed 面板**：元素最终计算值（浏览器实际采用的）

- 展开属性看由哪条规则贡献、是否被覆盖（继承链）
- 顶部**盒模型图**：直观显示 margin / border / padding / content
- 双击盒模型数字可直接改

<br>

> 调样式时分不清「我写的值」和「实际生效的值」？看 Computed。

<!--
Computed 解决样式优先级和继承的困惑。
-->

---

# Grid / Flexbox 可视化

元素是 `display:grid` / `flex` 时，标签旁出现徽章

- 点 `grid` / `flex` 徽章 → 叠加可视化
- **Layout 面板**：集中管理所有容器的叠加开关
- Grid：行列线编号、轨道尺寸、间隙、区域名
- Flex：主轴 / 交叉轴方向、对齐与间距

> Firefox 的 Grid / Flex 检查器更细致，两者可互补。

<!--
布局可视化是调 CSS 布局的利器。
-->

---

# 可访问性与对比度

Elements 右侧 **Accessibility** 标签

- **Accessibility Tree**：辅助技术「看到」的语义树（角色 / 名称 / 状态）
- **ARIA 属性**：检查 `role`、`aria-*` 是否正确
- **对比度**：颜色选择器内显示文本对比度
- **APCA**（Chrome 149 转稳定）：比旧的 WCAG 2 更贴近人眼感知

> 自动化可访问性审计（axe）属「前端测试」；这里是手动逐元素检查。

<!--
可访问性检查保证 UI 对所有用户可用。
-->

---

# Console：实用工具函数

仅在 Console 可用的「魔法变量」

| 函数 | 作用 |
|------|------|
| `$0`–`$4` | 最近选中的元素 |
| `$(s)` / `$$(s)` | querySelector / querySelectorAll |
| `copy(o)` | 复制对象到剪贴板 |
| `getEventListeners(el)` | 列出事件监听器 |
| `monitorEvents(el, "click")` | 监听并打印元素事件 |
| `queryObjects(Ctor)` | 列出某构造器所有实例 |

<!--
这些工具函数大幅提升 Console 调试效率。
-->

---

# Console API 与 Live Expression

```js
console.table([{ a: 1 }, { a: 2 }]); // 数组/对象表格化
console.group("分组"); console.log("子项"); console.groupEnd();
console.time("loop"); /* ... */ console.timeEnd("loop");
console.count("点击"); // 计数同名调用
console.dir(domEl); // 以对象展开 DOM
```

- **Live Expression**：顶部 `👁` 钉住表达式，**实时持续求值**
  - 如 `document.activeElement`、`performance.now()` 无需反复手敲

<!--
console.table 和 Live Expression 是被低估的高效功能。
-->

---

# Sources：断点类型

| 类型 | 设置 | 用途 |
|------|------|------|
| 行 / 条件 | 点 / 右键行号 | 执行到 / 条件真时暂停 |
| **Logpoint** | 右键行号 | 不暂停只打印——免改源码 |
| DOM | Elements 右键 | DOM 变动时暂停 |
| XHR / fetch | 右栏 | URL 含某串时暂停 |
| Event Listener | 右栏 | 某类事件触发时暂停 |
| 异常 | 右栏 `⏸` | 抛异常时暂停 |

> **Logpoint** 是神器：不动代码就能加日志。

<!--
丰富的断点类型覆盖各种调试场景。
-->

---

# Sources：单步与作用域

暂停后用控制条

- `F8` 继续 / `F10` 跨过 / `F11` 步入 / `Shift+F11` 步出
- **Call Stack**：调用栈
- **Scope**：当前作用域变量
- **Watch**：钉住表达式持续观察
- **Ignore list**：第三方库右键加入，跳过其栈帧（旧称 Blackbox）

<!--
单步调试配合作用域查看，精确定位逻辑问题。
-->

---

# Snippets 与 Local Overrides

**Snippets**：可复用脚本

- Sources → Snippets 新建，任意页面 `Cmd/Ctrl+Enter` 运行
- 适合存常用调试片段

**Local Overrides**：覆盖线上资源

- 指定文件夹后，可改写线上 JS / CSS / 网络响应
- 刷新仍生效（仅本机）——**无需部署验证线上改动**

> 线上有 bug 想验证修复？Overrides 直接改线上文件刷新即见效。

<!--
Local Overrides 是排查线上问题的强力武器。
-->

---

# Network：请求分析

点任一请求查看

| 标签 | 内容 |
|------|------|
| Headers | 请求 / 响应头、状态码 |
| Payload | 查询参数 / 请求体 |
| Preview / Response | 格式化 / 原始响应 |
| **Initiator** | 发起者调用栈——谁发的请求 |
| Timing | 排队 / 连接 / TTFB / 下载耗时 |

- 勾 **Disable cache**、**Preserve log**（导航后保留）

<!--
Initiator 标签能定位是哪段代码发起的请求。
-->

---

# Network：限速与导出

**限速**：模拟真实网络环境

- 选 Slow 4G / 3G / Offline，或自定义档位复现弱网

**导出 / 复用**

- 右键请求 → **Copy as cURL / fetch**
- 导出 / 导入 **HAR**（Chrome 149 起含 SSE 事件）
- 配合 Local Overrides 改写响应体

```bash
# 右键 → Copy as cURL 直接拿到可复现命令
curl 'https://api.example.com/data' -H '...'
```

<!--
HAR 和 cURL 导出方便跨工具复现请求。
-->

---

# Performance：录制与火焰图

运行时性能剖析的核心

- **Record**（`Cmd/Ctrl+E`）录交互；**Reload and record** 录加载
- 轨道：CPU、Network、Frames、**Main**（主线程火焰图）、Timings
- **Main 轨道**：函数调用火焰图，越宽越耗时
  - 右上红三角 = **Long Task**（>50ms，阻塞交互）
- 底部：Summary / Bottom-Up（热点）/ Call Tree

<!--
火焰图是定位卡顿和长任务的关键视图。
-->

---

# Performance：Core Web Vitals

**Live metrics 视图**：实时看三大核心指标

- **LCP**（最大内容绘制）/ **CLS**（布局偏移）/ **INP**（交互到下次绘制）

**Insights 侧栏**：把「测量」变「优化动作」

- 自动诊断：LCP 分解、渲染阻塞资源、布局偏移来源
- 每条都带可操作建议

- **CPU throttling** 4× / 6× 模拟低端机

<!--
Insights 侧栏的可操作建议是性能优化的直接抓手。
-->

---

# React Performance Tracks

React 19.2 在 Performance 面板注入自定义轨道

- 通过 `performance.measure` 扩展时间线
- **Scheduler 轨道**：Blocking（紧急）/ Transition / Suspense / Idle
- 显示调度更新的事件、何时渲染
- 编译器记忆化的组件标 **✨**

> 框架可自定义性能轨道——DevTools 时间线不再是黑盒。

<!--
React Performance Tracks 让 React 调度对开发者透明。
-->

---

# Memory：查内存泄漏

三种剖析类型

- **Heap snapshot**：拍堆内存快照
- **Allocation on timeline**：时间线记录分配
- **Detached elements**：列出脱离 DOM 却被 JS 引用的节点

**对比法定位泄漏**

```text
拍快照 A → 反复操作 N 次 → 拍快照 B
→ Comparison 对比 → 看 Delta 持续增长的对象
→ 展开 Retainers 引用链 → 找到谁还在引用
```

<!--
对比法是定位 JS 内存泄漏的标准流程。
-->

---

# Application：存储与 PWA

**存储管理**

- Local / Session Storage、IndexedDB、Cookies、Cache Storage
- **Clear site data**：一键清空所有存储（调试缓存必备）

**Service Worker 与 PWA**

- Service Workers：Update / Unregister / Offline / Update on reload
- Manifest：检查 PWA 清单、触发安装

> **Chrome 149**：新增实验性 WebMCP 调试工具（检查页面暴露给 AI 的工具）。

<!--
Application 面板管理一切客户端存储与 PWA 配置。
-->

---

# AI assistance（Gemini 3）

2026 年最大看点：内置 AI 助手

- **解释样式**：「为什么这个元素没居中」结合实际 CSS 诊断
- **分析性能**：可访问 Lighthouse 数据，对整页给针对性建议
- **内嵌 Widget**：回答里渲染 Web Vitals / LCP 分解卡片，可 Reveal 跳源
- **CSS 代码补全**：复杂 CSS 智能补全
- **复制到编码代理**：对话作为 prompt 喂给外部 AI

> 需登录 Google 账号并联网；输出供参考，关键结论人工核验。

<!--
AI assistance 大幅降低排错门槛，但不能盲信。
-->

---

# chrome-devtools-mcp

DevTools for Agents：把浏览器交给 AI

- 官方 **MCP 服务器**，暴露 DevTools / CDP 能力给编码代理
- 让 agent **驱动真实 Chrome**：导航、点击、读 DOM / 控制台 / 网络
- 做性能录制、截图、Lighthouse，回传 agent 分析

```bash
npx chrome-devtools-mcp@latest   # 作为 MCP server
```

> AI agent 不再只读代码，而能真正「打开页面看效果」。

<!--
chrome-devtools-mcp 是浏览器调试走向 AI 自动化的关键基础设施。
-->

---

# Recorder：录制与回放

把用户操作录成可回放流程

- **录制**：操作页面，自动记录点击 / 输入 / 导航
- **回放**：一键重放，可调速
- **Measure performance**：回放 + 性能录制结合
- **导出**：Puppeteer / Playwright Test / JSON 脚本

> Recorder 是「手动探索」到「自动化 E2E」的桥梁。

<!--
Recorder 把手动操作沉淀为自动化测试起点。
-->

---

# 设备模式（Device Mode）

`Cmd/Ctrl+Shift+M` 进入

- **响应式视口**：拖拽改尺寸或选预设机型
- **DPR / 方向**：模拟高分屏、横竖屏
- **网络 / CPU 限速**：复现弱网弱机
- **User-Agent**：随设备动态更新（Chrome 149）

> 设备模式是**近似模拟**，不替代真机；iOS WebKit 行为仍需 Safari Web Inspector。

<!--
设备模式方便快速预览响应式，但移动端真机调试不可省。
-->

---

# 三大引擎 DevTools 对比

| 维度 | Chrome | Firefox | Safari |
|------|--------|---------|--------|
| 引擎 | Blink | Gecko | WebKit |
| 性能剖析 | ★★★ | ★★ | ★★ |
| CSS 可视化 | ★★ | ★★★ | ★★ |
| 可访问性 | ★★ | ★★★ | ★★ |
| iOS 调试 | ✗ | ✗ | ✅ 唯一 |
| AI 集成 | ✅ Gemini | — | — |

> Chrome 综合最强；Firefox 精于 CSS / a11y；Safari 是 iOS 调试唯一选择。

<!--
三大引擎 DevTools 各有所长，专业前端应都会用。
-->

---
layout: center
class: text-center
---

# 小结

Chrome DevTools = 人 + AI 共用的浏览器后端

调试全链路一站式 · 性能剖析业界领先 · Gemini 3 加持

**命令菜单 + 断点体系 + Performance + AI assistance**

[文档](https://developer.chrome.com/docs/devtools) · [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) · [GitHub](https://github.com/ChromeDevTools/devtools-frontend)

<!--
掌握命令菜单、断点、性能面板和 AI assistance，就能把 DevTools 用到 2026 水准。
-->
