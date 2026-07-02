---
theme: seriph
background: https://cover.sli.dev
title: 浏览器架构与进程模型
info: |
  浏览器架构与进程模型 —— 进程线程与 IPC、多进程架构三笔账、各进程内的线程、站点隔离 OOPIF、导航六步接力、beforeunload 与 Service Worker 交接
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:application-web class="text-8xl" />
</div>

<br/>

## 浏览器架构与进程模型

浏览器不是「一个程序」：browser / renderer / Viz / Network Service 如何分工，一次导航如何在进程间接力

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
现代浏览器（以 Chromium 为代表）是一组分工明确、彼此隔离的进程。这套架构决定了前端日常的许多「为什么」：为什么一个 tab 崩了别的没事、为什么 iframe 多的页面内存高、为什么 beforeunload 会拖慢导航。
-->

---
transition: fade-out
---

# 这一章讲什么

一条主线：**浏览器为什么是一组进程，一次导航如何在它们之间接力**

<v-click>

- **进程、线程与 IPC**：CPU/GPU、私有内存、崩溃半径、消息传递
- **多进程架构**：browser / renderer / Viz / Network Service 分工，稳定、安全、内存三笔账
- **各进程内的线程**：browser 的 UI/network/storage，renderer 的 main/compositor/raster，Viz 上屏
- **站点隔离**：site 粒度进程、OOPIF、Spectre 背景与内存代价
- **一次导航的全流程**：判定输入 → 请求 → 安检 → commit → onload 六步接力
- **导航交接与复用**：beforeunload、跨站双 renderer 并存、SW 介入与 Navigation Preload

</v-click>

<v-click>

> **进程 = 崩溃边界 = 权限边界 = 内存账单单位** —— 一条原理贯穿全章。

</v-click>

<!--
六个主题顺序推进：先打进程/线程/IPC 的地基，再看多进程分工与代价，深入各进程内的线程，然后是站点隔离，最后完整走一遍导航流程与交接细节。
-->

---
layout: section
---

# 进程、线程与 IPC

一切架构讨论的地基

---

# CPU 与 GPU：两块硬件，两种性格

理解浏览器架构，先从脚下的硬件说起

<v-click>

- **CPU**：计算机的大脑，全能工人——什么任务都能接，但**一次一件、按顺序来**；现代 CPU 多核，可多位工人并行
- **GPU**：单核「笨」、只擅长简单任务，胜在**数量极多、同时开工**——为图形而生（百万像素各自算色值）
- 浏览器把活拆给两者：解析、布局、跑 JS 主要在 **CPU**；把画好的图层**合成上屏**交给 **GPU**

</v-click>

<v-click>

```js
// 逻辑核心数：给 Worker 池定容量的常用依据（注意含超线程）
console.log(navigator.hardwareConcurrency); // 例如 8
// 设备内存档位（GB，刻意粗化为 0.25/0.5/1/2/4/8）
// Chrome 决定进程数上限时看的正是这类硬件水位
console.log(navigator.deviceMemory); // 例如 8
```

</v-click>

<!--
CPU 擅长顺序通用计算，GPU 擅长海量并行的简单任务。这是后面 compositor 线程 / Viz 进程的硬件背景，也是 transform/opacity 动画便宜的底层原因。两个 JS 接口能直接摸到硬件水位。
-->

---

# 进程与线程：一块私有内存和里面的执行者

OS 视角看应用：进程是容器，线程是干活的

<v-click>

```text
┌─ 进程 A ──────────────┐      ┌─ 进程 B ──────────────┐
│  私有内存（互不可见）    │      │  私有内存              │
│  ├─ 线程 1 ──┐         │ IPC  │  ├─ 线程 1             │
│  ├─ 线程 2 ──┼─ 共享 A  │◄────►│  └─ 线程 2             │
│  └─ 线程 3 ──┘ 的内存   │      │                        │
└───────────────────────┘      └───────────────────────┘
```

</v-click>

<v-click>

- **进程** = 正在执行的程序：OS 启动时划给一块**私有内存**存放一切状态；进程结束，OS 整块回收
- **线程**住在进程里，执行程序的任意片段；**同进程内的线程共享内存**

</v-click>

<v-click>

> 进程之间内存互不可见 —— 协作必须走 **IPC** 传消息。

</v-click>

<!--
启动一个应用等于 OS 创建一个进程并划出私有内存。线程可以有一条也可以有很多条，同进程内随手互读互写，跨进程只能传消息。
-->

---

# 崩溃半径：多线程 vs 多进程

最关键的差异是内存归属与崩溃半径

<v-click>

| 维度 | 同进程内的多线程 | 多个进程 |
| --- | --- | --- |
| 内存 | 共享进程私有内存，互读互写 | 彼此不可见，各有一块 |
| 通信成本 | 低（直接读写共享状态） | 高（必须走 IPC 传消息） |
| 一处崩溃 | **整个进程一起死** | 只死自己，其他进程照常 |
| 资源回收 | — | 进程关闭时 OS 整块回收 |

</v-click>

<v-click>

> 一条线程把内存写坏，同进程所有线程都不可信，OS 只能整个收掉；进程之间互不牵连 —— **这是浏览器选择多进程的全部理由的种子**。

</v-click>

<!--
线程崩导致进程崩，是因为共享同一块内存。把「容易崩、不可信」的网页代码圈进独立进程，崩溃和恶意行为都被圈在墙内——多进程架构的立足点。
-->

---

# 程序如何被 OS 执行

启动 → 派生 → 代价 → 回收，外加调度

<v-click>

1. **启动**：双击图标 → OS 创建 browser 进程、分配私有内存，程序在其线程上执行
2. **派生**：进程可请求 OS **再启动新进程**分担工作——browser 为每个 tab 拉起 renderer
3. **代价**：内存不共享 → 公共基础设施**每进程一份拷贝**（最典型：V8）
4. **回收**：进程退出（正常或崩溃），OS 把私有内存整块收回

</v-click>

<v-click>

- 就绪线程远多于核心：OS 按**时间片**轮流分派，切换有**上下文切换**成本
- 几十个进程 ≠ 几十个核心在烧——多数线程在**等**（网络/IPC/vsync）；JS 主线程再忙也只占一个核，想吃多核只能开 **Worker**

</v-click>

<!--
新进程拿到自己的内存，共用数据只能复制或传消息。调度层面记住两点：大多数线程在等待；同进程的线程可被调度到不同核心真正并行，raster 线程 ×N 正是为了吃满多核。
-->

---

# IPC：隔离之后，怎么协作

地址栏在 browser，内容在 renderer，上屏在 Viz —— 必须传消息

<v-click>

| 消息 | 方向 | 时机 |
| --- | --- | --- |
| commit navigation | browser → renderer | 响应就绪，通知接管导航并随附数据流 |
| commit 确认 | renderer → browser | 确认接管，browser 才更新地址栏与会话历史 |
| onload 完成 | renderer → browser | 所有 frame 的 `onload` 跑完，停 spinner |
| compositor frame 提交 | renderer → Viz | 合成器产出一帧，交 Viz 聚合上屏 |
| 导航请求 | renderer → browser | 页内点链接 / JS 改 `window.location` |

</v-click>

<v-click>

> 消息比共享内存慢，换来**边界显式、可审计**：沙箱里的 renderer 想做特权操作，只能「打报告」请 browser/服务进程代办。

</v-click>

<!--
IPC 是进程间通过 OS 通道互发消息而不是共享变量。这五条消息会贯穿全章，导航一节会反复见到 commit navigation 和 onload 通知。
-->

---

# 前端视角：你早就在写「多进程风格」的代码

Web 平台的通信原语，完整复刻了「共享 or 传消息」的取舍

<v-click>

- **JS 单线程**的真意：你的代码默认只跑在**某个 renderer 进程的主线程**上
- Worker 与页面**不共享内存**、靠 `postMessage`——与 IPC 同一种世界观；站点隔离下跨站 iframe 的 `postMessage` 就是真·跨进程 IPC

</v-click>

<v-click>

| 原语 | 模型 | 备注 |
| --- | --- | --- |
| `postMessage` + 结构化克隆 | 传消息（数据**复制**） | 大对象复制有成本 |
| `Transferable` | 传消息（所有权**转移**） | 零拷贝，转移后原持有方不可再用 |
| `SharedArrayBuffer` | 真·共享内存 | Spectre 后要求 COOP+COEP **跨源隔离**才开放 |
| `BroadcastChannel` | 传消息（一对多） | 同源多 tab/Worker 广播 |

</v-click>

<!--
SharedArrayBuffer 的遭遇是绝佳注脚：一旦允许共享内存，就把「同进程」的攻击面交给了网页，于是浏览器要求页面先用 COOP/COEP 声明自我隔离——边界的每次放松都要用更强的隔离承诺赎买。
-->

---
layout: section
---

# 多进程架构

一个浏览器，一组进程

---

# Chrome 把浏览器拆成了哪些进程

任务管理器里的核心成员

<v-click>

| 进程 | 数量 | 职责 |
| --- | --- | --- |
| **browser** | 1 | 地址栏/书签/前进后退等「chrome」界面；网络、文件等特权编排 |
| **renderer** | 多个 | tab 内一切：解析 HTML/CSS、执行 JS、渲染页面；沙箱化 |
| **GPU（Viz）** | 1 | GPU 任务隔离处理；多来源请求画到同一表面 |
| **Network Service** | 1（可回退） | 网络栈：DNS、连接、请求响应 |
| **plugin** | 按需 | 站点插件（如当年的 Flash） |
| **extension** | 按需 | 扩展程序（本质多是特殊的 renderer） |
| **utility** | 按需 | 音频、数据解码等杂项服务 |

</v-click>

<!--
「chrome」一词双关：小写 chrome 泛指应用中非网页内容的界面外框。browser 进程管的正是这层外框，加上所有需要特权的幕后工作。
-->

---

# 总调度与公共服务部门

一张图看清进程关系

<v-click>

```text
        ┌────────────────────────────────────────────┐
        │              browser 进程（总调度）           │
        │   UI（地址栏/书签/按钮） · 特权编排 · 会话历史   │
        └───────┬────────────┬────────────┬──────────┘
             IPC│         IPC│         IPC│
   ┌────────────▼──┐  ┌──────▼────────┐  ┌▼─────────────────┐
   │ renderer ×N   │  │ Viz（GPU）×1   │  │ Network Service ×1│
   │ tab/site 内容  │  │ 合成+上屏      │  │ DNS/连接/请求      │
   └───────────────┘  └───────────────┘  └──────────────────┘
```

</v-click>

<v-click>

> 直觉模型：browser 进程是「总调度」，renderer 是「一间间隔离的工作室」，Viz / 网络服务是「公共服务部门」。

</v-click>

<!--
browser 进程全浏览器仅一个，renderer 每 tab（站点隔离下每 site）一个，Viz 和 Network Service 也是全局服务。进程之间全部靠 IPC 协作。
-->

---

# 单进程 vs 多进程

技术上完全可以塞进一个进程 —— 早期浏览器正是如此

<v-click>

| 维度 | 单进程多线程 | 多进程 |
| --- | --- | --- |
| 一个页面崩溃 | 线程崩 → **整个浏览器崩** | 只崩自己的 renderer，其余无恙 |
| 一个页面卡死 | 可能拖住关键线程 → 全体无响应 | 只有该 tab 无响应，关掉即可 |
| 恶意代码越权 | 与特权代码同一内存，一破全破 | 被沙箱圈住，还得突破 IPC 这道关 |
| 内存 | 共享，省 | 各进程一份拷贝，贵 |
| 通信 | 直接读写共享内存，快 | IPC 消息，慢但边界显式 |

</v-click>

<v-click>

> Chrome 自 2008 年发布起就押注多进程 —— **用内存换稳定与安全**。

</v-click>

<!--
早期单进程浏览器里一段死循环 JS 就能冻住整个浏览器。多进程把三笔账摆上台面：稳定、安全是收益，内存是代价。下面逐笔算清。
-->

---

# 两笔收益：稳定与安全

崩溃被圈在 tab 里，恶意代码被圈在沙箱里

<v-click>

- **稳定性**：某页面死循环、内存写坏、渲染引擎触发 bug——最坏结果是该 tab 变「Aw, Snap!」，关掉继续
- 你写出的死循环只冻自己的页面；用户手里其他 tab、地址栏、书签一切照常——**那些属于别的进程**

</v-click>

<v-click>

- **安全性**：OS 可按进程限权 → renderer 天天执行任意来路的代码，被**沙箱（sandbox）**限得最死：**没有任意文件读写权**
- 恶意代码即使攻破渲染引擎，直接能碰的也只有这个被阉割的进程；想读磁盘、发任意请求，必须再突破 **IPC 边界**骗过 browser/系统服务

</v-click>

<v-click>

> **进程是权限的边界** —— 沙箱实现与 CORB 等配套防线，深挖归「浏览器安全」。

</v-click>

<!--
稳定性收益对前端的体感：你的 bug 半径最多是自己的 tab。安全性收益的关键词是沙箱：renderer 无任意文件访问，特权操作只能经 IPC 请示。
-->

---

# 第三笔账：内存——每个进程都揣着一份拷贝

多进程形态天然比单进程吃更多内存

<v-click>

- 进程间内存不共享：最典型的是**每个 renderer 里都有一份 V8**
- 对策一：**给进程数封顶**——上限依设备内存与 CPU 能力而定
- 对策二：达到上限后，**同一站点的多个 tab 共享一个 renderer 进程**
- 推论：「每 tab 必有独立进程」并不严格成立——偶尔一个 tab 崩溃**连带同站的另一个 tab**，正是共享了进程

</v-click>

<v-click>

> 这也是「iframe 多、tab 多 → 内存高」的架构根源。

</v-click>

<!--
弱机器上超限共享尤其常见。想知道「谁跟谁一起死」，看任务管理器里谁共享进程。内存账单按进程算，这条原理后面站点隔离还会再放大。
-->

---

# Servicification：按硬件伸缩的架构

三笔账没有静态最优解

<v-click>

- 强机器不在乎内存、在乎稳定与安全；弱机器反过来
- **服务化**：把浏览器每块功能改写成「服务」，**服务与进程解耦**
- **硬件充裕** → 每个服务拆成独立进程：隔离更彻底，更稳、更安全
- **资源受限** → 多个服务合并进同一进程：少几份拷贝，省内存
- 标志案例：网络栈从 browser 进程里的 network 线程，服务化为独立的 **Network Service** 进程（必要时仍可跑回进程内）

</v-click>

<v-click>

> Android 系统也用类似思路伸缩其服务 —— 移动端正是这套设计最大的受益者。

</v-click>

<!--
Servicification 让同一套代码在强弱硬件上呈现不同的进程形态。存储、音频也走了同样的路。所以别按「进程数 × 均值」估内存——同一页面在不同设备上进程形态可能完全不同。
-->

---

# 任务管理器：进程模型的实景版

菜单 → 更多工具 → 任务管理器（macOS 在「窗口」菜单）

<v-click>

```text
任务                          内存      进程 ID
浏览器                        280 MB    4321   ← browser 进程（仅一个）
GPU 进程                      190 MB    4335   ← Viz
网络服务                       45 MB    4340   ← Network Service
标签页: news.example          160 MB    4402   ← renderer
  子框架: https://ads.example  60 MB    4407   ← OOPIF：跨站 iframe 独立进程
扩展程序: xxx                  80 MB    4410   ← 扩展进程
```

</v-click>

<v-click>

- 「浏览器」「GPU 进程」各只有一行（**全局唯一**）；「子框架」行是**站点隔离的直接证据**
- 选中某「标签页」点「结束进程」→ 只有那个 tab 崩；更细归属看 `chrome://process-internals`

</v-click>

<!--
每一行就是一个进程。制造一次隔离的崩溃：结束某个标签页进程，该 tab 变崩溃页、其余照旧——多进程的稳定性收益眼见为实。
-->

---
layout: section
---

# 各进程内的线程

进程解决「谁和谁隔离」，线程解决进程内分工

---

# browser 进程：UI、网络、存储三条线

导航一节的主角就是这几位

<v-click>

| 线程 | 职责 |
| --- | --- |
| **UI 线程** | 绘制浏览器自身界面（地址栏/按钮/tab 条）；判定地址栏输入；编排导航 |
| **network 线程** | 跑网络栈，从互联网收发数据（DNS、连接、响应） |
| **storage 线程** | 控制文件访问与各类存储 |

</v-click>

<v-click>

- 演进注记：「network 线程」是 2018 年 inside-browser 系列的描述——网络栈现已移入独立的 **Network Service** 进程（资源受限设备可回退为进程内线程）
- RenderingNG 视角：browser 进程自身 UI 也要布局绘制，并把输入事件**路由**给正确的 renderer

</v-click>

<!--
本章叙述导航时仍沿用「network 线程/网络侧」的说法，读者对号入座即可。browser 进程的 UI 渲染因无性能隔离需求，由单一线程配少量 helper 承担。
-->

---

# renderer 进程：主线程和它的帮手们

tab 内的整个世界，每 tab（每 site）一个

<v-click>

```text
renderer 进程
├─ main thread（主线程）×1
│    解析 HTML → DOM · 样式计算 · 布局树 · 绘制记录
│    执行你的 JS · 事件命中测试与派发
├─ compositor thread（合成器线程）×1
│    分层（layerization）· 滚动/部分动画 · 产出 compositor frame
├─ raster threads（光栅化线程）×N
│    把 tile 变成位图，写入 GPU 内存
└─ worker threads ×N
     Web Worker / Service Worker 的 JS
```

</v-click>

<v-click>

> 这张图是前端性能话题的**核心地图**。

</v-click>

<!--
renderer 内部四类线程各司其职：主线程一人扛下解析、样式、布局、JS 与事件；compositor 管分层合成；raster 切块光栅化；worker 收留后台 JS。
-->

---

# 主线程：唯一跑你 JS 的地方

一人分饰全部关键角色

<v-click>

- 包揽渲染管线关键环节：**HTML→DOM、样式计算、布局树、绘制记录、分层信息**并提交给 compositor
- 外加**执行你的所有 JS** 与派发输入事件
- 推论：这么多活挤一条线程，**一个长任务就能让解析、渲染、交互全部排队**
- Web Worker / Service Worker 存在的意义：把可挪的 JS 挪去 worker 线程

</v-click>

<v-click>

> 各环节细节属「浏览器渲染原理」—— 这里只需看清「全挤在一条线程上」这件事。

</v-click>

<!--
JS 的单线程指的就是这条主线程。它是性能优化章节反复出现的主角：主线程忙，解析、布局、事件响应全部排队。
-->

---

# compositor 与 raster：不等主线程

滚动与图层动画的独立跑道

<v-click>

- **合成（compositing）**：把页面拆成多个**图层（layer）**、各自光栅化、再拼成一帧，由 compositor 线程主持
- 独立价值：**输入滚动、图层级动画可以完全不等主线程**——主线程哪怕被 JS 卡住，页面照样滚

</v-click>

<v-click>

- 图层可能很大 → compositor 把它切成**图块（tile）**分发给多条 raster 线程，**视口附近优先**
- raster 把 tile 光栅化成位图存进 GPU 内存；compositor 把「哪些 tile、放哪、怎么拼」封装成 **draw quad**，聚合为一张 **compositor frame**，经 IPC 提交出去

</v-click>

<v-click>

> 只改 `transform`/`opacity` 的动画可在 compositor 线程独立推进 —— 主线程卡死也不掉帧。

</v-click>

<!--
滚动默认由 compositor 线程处理，这是「滚动不容易卡」的原理；但注册非 passive 的 touchmove/wheel 监听会迫使合成器等主线程确认。
-->

---

# Viz 进程：全浏览器只有一个的「上屏部门」

原「GPU 进程」在现代 Chromium 重构为 Viz（取自 Visuals）

<v-click>

| 线程 | 职责 |
| --- | --- |
| **display compositor 线程** | 把各进程的合成帧**聚合**、优化成一张全局帧 |
| **GPU main 线程** | 光栅化显示列表与视频帧；把合成帧真正**绘制到屏幕** |

</v-click>

<v-click>

- 全浏览器**仅一个** Viz 进程——理由朴素：「通常只有一块 GPU」
- 两条线程分开的理由：display compositor **必须时刻保持响应**，不能被 GPU 上的慢操作阻塞——掉帧风险被隔离在 GPU main 一侧

</v-click>

<!--
Viz 接收所有 renderer 进程和 browser 进程各自提交的 compositor frame，聚合后画上屏幕。聚合调度与真正画图解耦。
-->

---

# 一帧的旅程与名词演进

站点隔离下一个页面可能由多个 renderer 拼成 —— 聚合正是 Viz 的价值

<v-click>

```text
renderer A（主文档）────── compositor frame ─┐
renderer B（跨站 iframe）── compositor frame ─┼─► Viz：display compositor 聚合
browser 进程（浏览器 UI）── compositor frame ─┘        └─► GPU main 绘制上屏
```

</v-click>

<v-click>

| 2018 年说法 | 现代 Chromium |
| --- | --- |
| browser 进程内的 network 线程 | 独立 **Network Service** 进程（服务化） |
| GPU 进程 | **Viz** 进程（display compositor + GPU main） |
| 合成帧先提交 browser 再转 GPU | renderer **直接**把合成帧提交给 Viz 聚合 |

</v-click>

<v-click>

> 架构在演进，分工哲学未变：**每条线程只守一类职责，跨线程/跨进程只传消息**。

</v-click>

<!--
读 2018 年的 inside-browser 系列和 2021+ 的 RenderingNG 文档时，按这张表对齐名词就不会错乱。
-->

---

# 在 DevTools 里认出这些线程

Performance 面板的泳道与线程一一对应

<v-click>

| Performance 泳道 | 对应线程 | 常看什么 |
| --- | --- | --- |
| Main | renderer 主线程 | 长任务（红角标）、Parse HTML、Layout、Paint |
| Compositor | compositor 线程 | 滚动/合成是否独立推进 |
| Raster（Rasterizer ×N） | raster 线程 | 光栅化耗时、tile 任务分布 |
| Thread pool / Worker | worker 线程 | 你的 Worker JS 是否真把活挪出去了 |
| GPU | Viz 侧工作 | 上屏是否成为瓶颈 |

</v-click>

<v-click>

> 常用判读：页面**滚动流畅但点击无响应** —— Compositor 泳道在动、Main 被长任务塞满，正是「合成器独立于主线程」的教科书现场。

</v-click>

<!--
这是把抽象架构落到日常调试的桥：录一段 trace，泳道里的 Main / Compositor / Raster / GPU 正是本节讲的这几位。
-->

---
layout: section
---

# 站点隔离

进程边界从 tab 细化到 site

---

# 为什么「每 tab 一进程」还不够

页面里嵌着跨站 iframe（广告、支付、第三方登录）

<v-click>

1. **renderer 漏洞是常态而非例外**：M69 含 10 个「潜在可利用」的 renderer 漏洞，M70-M73 各 5/13/13/15 个——「哪怕 1 字节的缓冲区溢出也可能被做成利用链」
2. **UXSS**：直接绕过 renderer 进程内实施的同源策略，且「相当常见」
3. **Spectre / Meltdown（2018 年公开）**：CPU 推测执行的侧信道攻击，**不需要 Chrome 有任何漏洞**，就能读取本进程内存的任意内容

</v-click>

<v-click>

> 结论：**同进程 = 同一失陷域** —— 不可信站点的代码，绝不能与其他站点的数据共享进程。软件层面的同源检查，在硬件侧信道面前形同虚设。

</v-click>

<!--
2018 年以前跨站 iframe 与父页面同进程。三类威胁汇成一个结论：进程是唯一靠得住的边界。站点隔离由此而来。
-->

---

# site 的定义：为什么不是 origin

隔离粒度是 site，不是前端更熟悉的 origin

<v-click>

| 概念 | 组成 | `https://foo.example.com:8080` 的归属 |
| --- | --- | --- |
| **origin** | scheme + host + port | `https://foo.example.com:8080` |
| **site** | scheme + 注册域名（**eTLD+1**） | `https://example.com` |

</v-click>

<v-click>

- **eTLD+1** = 有效顶级域 + 1 级：`example.github.io` 因 `github.io` 在**公共后缀列表**中，本身就是一个 site；子域、端口、路径都不参与判定
- 弃 origin 的原因：老网页改 `document.domain` 实现跨子域互访 DOM——按 origin 分进程会把它们拆坏
- 该 setter 已被 MDN 标记**弃用**：跨源通信用 `postMessage()`；页面可用 `Origin-Agent-Cluster` 头主动申请按 origin 隔离

</v-click>

<!--
安全边界的粒度被一个上古 API 拖住了：为兼容 document.domain，Chromium 退一步按 site 隔离。
-->

---

# 同 site 判定练习

scheme 与 eTLD+1 都相同才算同 site

<v-click>

| A | B | 同 site？ | 判定依据 |
| --- | --- | --- | --- |
| `https://a.example.com` | `https://b.example.com` | **是** | 子域不参与 site 判定 |
| `https://example.com:8080` | `https://example.com` | **是** | 端口不参与 site 判定 |
| `http://example.com` | `https://example.com` | **否** | scheme 参与判定 |
| `https://a.github.io` | `https://b.github.io` | **否** | `github.io` 在公共后缀列表 |

</v-click>

<v-click>

> 注意：以上四对全部**不同 origin** —— origin 粒度比 site 细得多。

</v-click>

<!--
四道判定题覆盖了子域、端口、scheme、公共后缀四个易错点。github.io 这类公共后缀域名，每个用户子域本身就是一个 site。
-->

---

# OOPIF：一个页面 = 多个进程拼合

跨站文档永远进不同进程

<v-click>

```text
tab: https://news.example        （一个页面，进程视角是拼图）
├─ 主文档 news.example           → renderer 进程 A
├─ iframe: ads.example           → 进程 B（OOPIF）
├─ iframe: pay.example           → 进程 C（OOPIF）
└─ iframe: sub.news.example      → 与主文档同 site，仍在进程 A
```

</v-click>

<v-click>

- 分配规则一句话：**跨站文档必然不同进程**——本 tab 导航、新 tab、iframe 一视同仁
- 多年大工程：帧树横跨进程后，DevTools、页内查找、布局、输入路由都得跨进程协作；**整页布局不再是跨进程同步的**

</v-click>

<v-click>

> 数据防线 **CORB**：跨站 HTML/XML/JSON/PDF 响应不交付给「不该拿到它」的进程（除非 CORS 放行）—— 尽力而为。

</v-click>

<!--
OOPIF = Out-of-Process iframe。进程分开后攻击者仍可在自己进程里发跨站请求把数据拉进来，CORB 负责拦截，受「资源标错 MIME 也得兼容」掣肘。
-->

---

# 代价与铺开：一场明码标价的交易

进程更多 = 每进程一份拷贝 + 更多管理开销

<v-click>

| 版本 | 策略 | 内存开销 |
| --- | --- | --- |
| **Chrome 67**（2018） | 桌面**全站点**隔离默认（Win/Mac/Linux/ChromeOS） | 约 **10-13%**（多 tab 场景） |
| **Chrome 77** | Android ≥2GB RAM：只隔离「**用户登录过的站点**」 | 约 **3-5%** |
| **Chrome 92** | 追加 OAuth 登录站点、发 **COOP** 头的站点；隔离扩展页 | —— |
| **Chrome 110** | 支持 `<webview>` 标签 | —— |
| 未覆盖 | **Android WebView**、RAM < 2GB 的 Android | —— |

</v-click>

<v-click>

> 移动端的取舍很有代表性：只为「值得保护的站点」开隔离，把全量账单砍到 3-5%；站点可发 COOP 头**主动**把自己列入被隔离名单。

</v-click>

<!--
安全与内存又一次明码标价。桌面 2018 年起全量默认；Android 内存吃紧，只隔离用户输入过密码/登录过的站点。
-->

---

# 亲手验证与手动控制

两分钟看到隔离在工作

<v-click>

- **Chrome 任务管理器**：嵌跨站 iframe 的页面会出现独立「子框架: https://ads.example」行，有自己的进程 ID 与内存计数；同 site 的 iframe 不单列
- **`chrome://process-internals`**：首页显示当前隔离模式（如 Site Per Process）；Frame Trees 一栏看每个 frame → 进程的映射
- **对照实验**：用 `--disable-site-isolation-trials` 启动测试用 Chrome——子框架行消失，跨站 iframe 缩回父页进程（仅供测试环境）

</v-click>

<v-click>

- 按需**加严**：flags `#enable-site-per-process` / `#isolate-origins`；企业策略 `SitePerProcess` / `IsolateOrigins`；命令行 `--isolate-origins=...`

</v-click>

<!--
任务管理器的「子框架」行是站点隔离最直观的证据。process-internals 能看到 OOPIF 的进程归属，一目了然。
-->

---

# 站点隔离对前端的实际影响

不只是「安全团队的事」

<v-click>

- **iframe 多的页面内存显著更高**：每个跨站 iframe 都是独立进程，账单按进程数累加
- **unload 系列更不可靠**：站点隔离下 unload **不保证执行**（其中 `postMessage` 可能失败）→ 离场上报改用 `visibilitychange` + `sendBeacon`
- **`document.domain` 别再碰**：跨源通信一律 `postMessage`——OOPIF 下它就是真·跨进程 IPC，但对你的代码**透明**
- **本地调试的坑**：`--disable-web-security` 只关 renderer 内的同源检查，进程边界还在——需连带 `--disable-features=IsolateOrigins,site-per-process`
- **强力 API 以隔离为门票**：`SharedArrayBuffer`、高精度计时要求 COOP+COEP 达成**跨源隔离**；Android 上发 COOP 头还是「值得隔离」的信号（Chrome 92 起）

</v-click>

<!--
这五条把站点隔离落到日常：内存、埋点可靠性、跨源通信、调试参数、强力 API 的门票。COOP/CORP/Sec-Fetch-* 让服务器主动声明隔离意愿。
-->

---
layout: section
---

# 一次导航的全流程

从回车到 spinner 停止的六步接力

---

# Step 1-2：判定输入，开始导航

导航的第一棒由 browser 进程执飞

<v-click>

- 导航定义很宽（MDN）：地址栏输入、点链接、提交表单都算——目标是让用户盯着白屏的时间尽可能短
- **Step 1 判定输入**（UI 线程）：地址栏是「URL + 搜索框」二合一——`example.com` 当 URL 导航，带空格的词拼成搜索查询；启发式每次输入都在跑
- **Step 2 开始导航**：回车 → UI 线程发起网络调用，tab 角落转起 **spinner**——此刻显示的还是旧页面/空白
- 网络侧跑网络栈：**DNS 解析 → 建 TLS 连接 → 发请求**；遇 **HTTP 301/302** 则通知 UI 线程对新 URL 再来一轮

</v-click>

<v-click>

> 成本账（MDN 口径）：首字节前 DNS + TCP 三次握手 + TLS 协商可累计约 **8 次往返**；响应首块约 **14KB**（TCP 慢启动）。

</v-click>

<!--
第一件事是判定「搜索词还是 URL」。开始导航后页面八字没一撇，spinner 转的这段时间全是网络侧的天下。
-->

---

# Step 3：读响应——先验明正身，再过安检

响应数据到达后，网络侧不会闷头转发

<v-click>

- **验明正身**：看响应头 **`Content-Type`**；缺失或错误则 **MIME 类型嗅探**——读开头几个字节猜类型，官方称「tricky business」，各浏览器猜法不同
- 分流由此决定：**HTML → 渲染流程**交给 renderer；**zip/其他文件 → 下载管理器**

</v-click>

<v-click>

- **SafeBrowsing**：域名或响应数据命中已知恶意站点库 → 直接展示警告页，导航到此为止
- **CORB**：确保敏感的跨站数据（HTML/XML/JSON 等）不被送进不该拿到它的 renderer 进程——站点隔离的数据侧防线

</v-click>

<!--
两类动作同步进行：先看 Content-Type 决定分流，再过 SafeBrowsing 与 CORB 两道安检。CORB 机理深挖归浏览器安全叶。
-->

---

# Step 4：找 renderer——其实早就备好了

网络请求动辄数百毫秒，干等太浪费

<v-click>

```text
串行想象：  [───网络请求 300ms───][─renderer 启动 100ms─][commit...]
实际编排：  [───网络请求 300ms───][commit...]
            [renderer 启动 100ms]      ▲
            （Step 2 时已并行预启动）────┘
```

</v-click>

<v-click>

- **UI 线程早在 Step 2 发起网络请求的同时，就已并行预启动了一个 renderer**——数据一到立即可用，两段耗时重叠掉
- 变数是重定向：若跳去了**另一个站点**（站点隔离要求跨站换进程），预启动的进程用不上、得另起一个——**跨站重定向比同站重定向更贵**的原因之一

</v-click>

<!--
这是导航流程里的关键优化：把 renderer 启动藏进网络等待里。跨站重定向会让预热白做。
-->

---

# Step 5：commit navigation——一手交数据，一手改门牌

数据与 renderer 双双就绪

<v-click>

- browser 进程向 renderer 发送 **IPC：commit navigation（提交导航）**，随附**数据流**让 renderer 持续接收 HTML
- renderer 回执确认后，导航正式「已提交」——browser 这边立刻换门牌：
- **地址栏更新**：URL、**安全指示器**（锁标）、站点设置 UI 全部反映新站点
- **会话历史（session history）更新**：本 tab 的前进/后退栈入册新条目；为支持关闭后恢复，还会**写入磁盘**（storage 线程的地盘）
- 从这一刻起，tab 的内容主导权移交 renderer，进入**文档加载**阶段

</v-click>

<!--
commit 是导航的所有权交接点。地址栏 URL 和锁标在这一刻才变——「回车后地址栏没变」说明导航还没走到 Step 5。
-->

---

# Step 6：加载完成——spinner 何时停

「完成」被官方打了引号

<v-click>

- renderer 接管后解析 HTML、加载子资源、渲染页面——整条管线属「浏览器渲染原理」的地盘
- 当页面**所有 frame** 的 **`onload`** 事件执行完毕，renderer 向 browser 发送 IPC，UI 线程**停掉 spinner**
- 客户端 JS 完全可以在这之后继续拉数据、改视图——「spinner 停了」只意味着初始加载告一段落，**不等于页面不再变化**

</v-click>

<v-click>

> 对前端的暗示：把 `onload` 当「页面就绪」的唯一信号并不可靠 —— 度量真实体验要看 **LCP / INP** 这类以用户为中心的指标。

</v-click>

<!--
所有 frame 的 onload 跑完才停 spinner。SPA 时代大量内容在 onload 之后才出现，这正是用户中心指标存在的理由。
-->

---

# 全景时序：一图串起六步

UI 线程 · 网络侧 · renderer · 浏览器界面

<v-click>

```text
 UI 线程        网络侧              renderer               浏览器界面
    │              │                   │                     │
 ①判定输入         │                   │                （旧页/空白）
 ②发起导航 ───────►│ DNS→TCP→TLS→请求   │                  spinner 转起
    ├─②'并行预启动──┼──────────────────►│（启动待命）           │
    │              │ ③响应：MIME 分流    │                     │
    │              │   SafeBrowsing/CORB│                     │
 ④数据就绪 ◄───────┘                   │                     │
 ⑤commit（IPC+数据流）────────────────►│ 确认接管          地址栏/锁标/
    │                                  │ 解析·渲染…        session history 更新
    │◄────────⑥所有 frame onload 完────┘                  spinner 停止
```

</v-click>

<!--
六步接力全景：判定输入、发起导航并行预启动、响应检查、数据就绪、commit 交接、onload 停 spinner。看懂每步归属，就知道白屏时间该找谁算账。
-->

---

# 导航流程对前端的实际影响

白屏时间该找谁算账

<v-click>

- **白屏 ≠ 你的代码慢**：spinner 转起到首字节之间是判定、DNS、TLS、重定向、安检的天下——`dns-prefetch`/`preconnect`、砍重定向链优化的正是这段
- **重定向格外贵**：每跳一次重来一轮请求；跨站跳还可能作废预启动的 renderer
- **`Content-Type` 要写对**：写错触发 MIME 嗅探、行为因浏览器而异；该 `text/html` 的回成 `application/octet-stream`，用户会收到下载框
- **地址栏在 commit 时才变**；**spinner ≠ 加载进度条**——SPA 内部路由切换不触发导航，spinner 根本不会动
- **同 URL 不同结局**：服务器改 `Content-Disposition: attachment` 或非 HTML 类型，Step 3 就分流去下载——「点了链接却弹下载」多半是响应头的事

</v-click>

<!--
这五条把六步流程翻译成日常排查语言：优化「前端代码尚未登场」的时间、少跳重定向、写对响应头。
-->

---
layout: section
---

# 导航交接与复用

从一个页面跳向另一个页面时的细节

---

# beforeunload：再导航先过这一关

真实场景更多是「从一个页面跳向另一个」

<v-click>

```text
无 beforeunload：回车 ─────────────────────────────► 立刻开始网络请求
有 beforeunload：回车 ──IPC──► 旧 renderer 执行 handler ──放行──► 才开始网络请求
                               （若弹框，还要等用户点「离开」）
```

</v-click>

<v-click>

- 为什么要问：**tab 内的一切——包括 JS——都是 renderer 进程的地盘**，browser 根本不知道页面有没有注册监听
- 代价：handler 在导航**开始之前**执行——哪怕它什么都不做，这趟往返 + 执行时间也计入**每一次**离开本页的导航

</v-click>

<v-click>

> 官方明确警告：**不要无条件添加 beforeunload**。

</v-click>

<!--
每当用户发起新导航，browser 进程必须先向当前 renderer 确认「在乎 beforeunload 吗」。这道确认的代价直接落在导航延迟上。
-->

---

# beforeunload 正确姿势：按需注册，用完即摘

只在真有未保存数据时才拦截离开

<v-click>

```js
function onBeforeUnload(event) {
  event.preventDefault(); // 触发「离开此页？」原生确认框（文案不可定制）
}
// 表单变脏时才注册——干净页面的导航不背 beforeunload 的账
form.addEventListener("input", () => {
  window.addEventListener("beforeunload", onBeforeUnload);
});
// 保存成功后立刻移除：还导航一个「秒开跑道」
async function save() {
  await submitForm();
  window.removeEventListener("beforeunload", onBeforeUnload);
}
```

</v-click>

<v-click>

- renderer 内发起的导航（点链接 / `window.location = ...`）流程对称：renderer **先自查** beforeunload，再把导航请求提交给 browser 进程

</v-click>

<!--
「进页面就注册」的挽留弹窗是导航变慢的常见元凶。按需注册、用完即摘。renderer 发起的导航之后走的仍是那套「请求→安检→commit」流程。
-->

---

# 跨站导航：新旧 renderer 并存的瞬间

确认可以离开后，若目标是另一个站点

<v-click>

```text
时间 ──────────────────────────────────────────►
旧 renderer：显示旧页面 ──► 执行 unload ──► 退场
新 renderer：      └─ 并行构建/加载新页面 ──► commit ──► 显示
```

</v-click>

<v-click>

- browser 不会复用当前 renderer（站点隔离也不允许）→ **另起一个 renderer**；**两个 renderer 短暂并存**
- 旧页「看起来已经关了」，收尾代码却可能还在另一个进程里跑——这段并行属**页面生命周期（Page Lifecycle）**范畴
- **unload 靠不住**：站点隔离下不保证执行、bfcache 命中时整段跳过 → 用 `visibilitychange`/`pagehide` + `sendBeacon`
- **别在 unload 里做重活**：挤占「旧 renderer 退场」的时间窗，只会延长进程回收

</v-click>

<!--
新 renderer 构建新页的同时，旧 renderer 留守执行 unload。这解释了一些灵异现象：旧页面的定时器在新页面已显示后仍多跑一拍。
-->

---

# Service Worker：导航请求的「应用层拦路人」

可编程决定「读缓存还是走网络」

<v-click>

```text
导航请求
   ▼
网络侧：URL 落在某个已注册的 SW scope 里吗？（注册时 scope 已被记录）
   ├─ 否 ──► 照常发网络请求（上一节流程）
   └─ 是 ──► 通知 UI 线程 ──► 找一个 renderer 进程，启动并执行 SW 代码
                 ├─ SW 决定读缓存 ──► 不发网络请求
                 └─ SW 决定走网络 ──► 由 SW 发起 fetch
```

</v-click>

<v-click>

- 关键认知：**SW 是跑在 renderer 进程里的 JS**——不是浏览器内核的神秘组件，而是一段被特殊调度的应用代码
- 启动顺序的含义：**必须先唤起 renderer、跑起 SW，才知道要不要发网络请求**——超能力插进了导航关键路径

</v-click>

<!--
SW 是你用 JS 写的网络代理。它给了前端拦截导航的能力，也在关键路径上插入了「进程唤起 + JS 冷启动」的成本。
-->

---

# Navigation Preload：别让 SW 启动挡住网络

最坏情形：冷启动跑完，结论却是「走网络吧」

<v-click>

```text
无预载：   [SW 启动][SW 决策][─────网络请求─────]  ← 串行相加
有预载：   [SW 启动][SW 决策]
           [─────网络请求（并行已在路上）─────]    ← 取较长者
```

</v-click>

<v-click>

- SW 冷启动可能花几十上百毫秒——若没有 SW，请求早就在路上了
- **Navigation Preload**：导航时**并行**做两件事——启动 SW、同时把网络请求发出去
- 预载请求带专门标头 **`Service-Worker-Navigation-Preload`**：服务器识别后可定制响应，比如只回**增量数据**而非完整文档

</v-click>

<!--
两段耗时从相加变成取最大值。SW 启动完成后在 fetch 事件里等待并直接使用这份预载响应。
-->

---

# Navigation Preload 接入：两小段 SW 代码

激活时开启，fetch 里取用

<v-click>

```js
// sw.js —— 激活时开启 Navigation Preload
self.addEventListener("activate", (event) => {
  event.waitUntil(self.registration.navigationPreload?.enable());
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return; // 只处理导航请求
  event.respondWith((async () => {
    const preloaded = await event.preloadResponse; // 并行预载的那次响应
    if (preloaded) return preloaded;
    return fetch(event.request); // 未开启/未命中时回退为普通网络请求
  })());
});
```

</v-click>

<!--
activate 里 enable，fetch 里先等 event.preloadResponse、命中直接用、未命中回退普通 fetch。就这两小段。
-->

---

# 导航交接对前端的实际影响

三层交接，各有一笔账

<v-click>

- **「进页面就注册 beforeunload」的挽留弹窗**是导航变慢的常见元凶：让用户离开你站点的每次导航都先绕道旧 renderer——按需注册、用完即摘
- **收尾逻辑迁移**：`unload` → `pagehide`/`visibilitychange` + `sendBeacon`；既是站点隔离下的可靠性要求，也为 bfcache 让路
- **SW 不是零成本缓存层**：命中缓存快如本地，miss 时多付一次冷启动——记得开 **Navigation Preload** 兜底
- **双 renderer 并存**解释「灵异现象」：旧页面的定时器/日志在新页面已显示后仍多跑了一拍——那是旧 renderer 还在收尾

</v-click>

<!--
再导航比首次导航多三层交接：beforeunload 询问、双 renderer 并存、SW 介入。每层都可能给导航加税，也都有对应的正确姿势。
-->

---
layout: center
class: text-center
---

# 小结

一个 tab 背后，是一组分工明确的进程

<v-click>

- **进程模型**：进程 = 私有内存 + 崩溃边界 + 权限边界；协作靠 IPC 传消息
- **多进程**：browser 总调度 · renderer 每 tab/site · Viz 上屏 · Network Service——内存换稳定与安全
- **线程分工**：你的 JS 只跑 renderer 主线程；compositor 不等主线程也能滚
- **站点隔离**：site = scheme + eTLD+1，跨站 iframe 独立进程（OOPIF）；桌面 +10-13%、Android +3-5%
- **导航六步**：判定输入 → 请求 → 安检 → 预启动 renderer → commit → onload 停 spinner
- **交接**：beforeunload 先问旧页 · 跨站双 renderer 并存 · SW 介入 + Navigation Preload

</v-click>

<v-click>

> tab 崩了为什么没事、iframe 多为什么费内存、beforeunload 为什么拖慢导航 —— 答案都在进程模型里。

</v-click>

<!--
六个主题收束：进程线程地基、多进程三笔账、线程分工、site 粒度隔离、导航六步接力、交接细节。renderer 拿到 HTML 之后的故事在「浏览器渲染原理」继续。
-->

---
layout: center
class: text-center
---

# 谢谢

浏览器架构与进程模型 · 一个 tab 背后的一组进程

<div class="mt-8 text-gray-400">
基于 Chromium 现代架构 · 面向前端工程师
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/base/browser/browser-architecture/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
全章覆盖进程线程与 IPC、多进程架构、各进程内的线程、站点隔离、导航全流程与交接。配套笔记见文档图标链接。感谢观看。
-->
