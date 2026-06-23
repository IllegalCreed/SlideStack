---
theme: seriph
background: https://cover.sli.dev
title: React DevTools 完全指南
info: |
  React DevTools 完全指南：React 官方调试扩展 · 组件树 / Profiler / 重渲染优化

  Learn more at [https://react.dev/learn/react-developer-tools](https://react.dev/learn/react-developer-tools)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## React DevTools 完全指南

React 官方调试扩展 · 组件树 / Profiler · React 19.2

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
React DevTools 是 React 生态几乎人人必装的调试扩展。
-->

---
transition: fade-out
---

# 什么是 React DevTools

Meta（React 团队）官方的 React 应用调试工具

- **两种形态**：浏览器扩展（Chrome/Firefox/Edge）+ standalone（RN/Safari）
- **组件抽象层**：看 React 组件树，而非编译后的 DOM
- **两大面板**：Components（组件树）+ Profiler（渲染性能）
- **官方同步**：支持 Hooks、Suspense、React Compiler 最新特性
- **2026**：配合 React 19.2 的 Performance Tracks

> 浏览器 DevTools 看 DOM，React DevTools 看组件。

<!--
React DevTools 补上了浏览器看不到的 React 抽象层。
-->

---

# 为什么需要它

浏览器内置 DevTools 的盲区

- Elements 面板只有编译后的 `div` / `span`，**看不到 React 组件**
- 不知道某段 UI 由哪个组件渲染、收到什么 props
- 不知道为什么组件重渲染、哪个渲染慢

React DevTools 补上这一层：**组件树 + props/state/hooks + 渲染性能**。

<!--
不用 React DevTools 调 React，等于盲调。
-->

---

# 安装

| 形态 | 方式 | 适用 |
|------|------|------|
| 浏览器扩展 | 商店搜「React Developer Tools」 | 网页 React |
| standalone | `npx react-devtools` | RN / Safari / Electron |

- 装好后 DevTools 多出 **Components ⚛** 与 **Profiler ⚛**
- 扩展图标变彩色 = 检测到 React（灰色 = 无 / 生产构建）

<!--
扩展适合网页，standalone 适合 RN 等环境。
-->

---

# 两大面板

**Components ⚛**

- 组件树，检查 / 编辑 props、state、hooks、context

**Profiler ⚛**

- 录制渲染性能，火焰图分析渲染耗时与原因

> 一个看「组件长什么样」，一个看「渲染快不快」。

<!--
Components 和 Profiler 是 React 调试的两条主线。
-->

---

# Components：组件树

展示 React 组件层级（非 DOM）

- `App > Layout > Header > Nav` 这样的组件树
- 选中组件，页面对应区域高亮
- 既有你的组件，也有库组件（Router、Provider）
- 键盘方向键导航，展开 / 折叠子树

<!--
组件树让你以 React 的视角看页面结构。
-->

---

# Components：搜索与过滤

让深层组件树可读

- **搜索框**：按组件名过滤，支持正则
- **组件过滤**（齿轮 → Components）：
  - 隐藏 host 组件（`div`/`span` 包装）
  - 隐藏 HOC 包装层
  - 按名称 / 位置过滤

> 大型应用合理过滤，树立刻清爽。

<!--
过滤掉噪音，聚焦自己的业务组件。
-->

---

# 双向定位

| 方向 | 操作 |
|------|------|
| 页面 → 组件 | 点「选择」图标 → 点页面元素 |
| 组件 → DOM | 右键 → Inspect matching DOM element |
| 组件 → 源码 | 选中 → 点 `<>` 跳 Sources |
| 组件 → Console | 右键 Log / 选中后用 `$r` |

<!--
组件、DOM、源码、Console 之间自由跳转。
-->

---

# 检查 props

选中组件，右侧看它接收的所有属性

- 对象 / 数组可展开逐层看
- 确认「父组件到底传了什么」
- 很多 bug 源于 props 与预期不符

> 第一步永远是：它收到的 props 对不对？

<!--
检查 props 是排查组件问题的起点。
-->

---

# 编辑 props / state

双击值直接改，页面实时重渲染

- 改 props 验证不同输入下的 UI
- 改 state 模拟 loading / error / 空数据
- 数字 / 字符串 / 布尔直接改，对象逐字段改

> 想看「按钮 disabled 时长什么样」？直接把 `disabled` 改成 `true`，免改代码。

<!--
免改代码快速验证 UI 是一大效率提升。
-->

---

# Hooks 列表

函数组件的 hooks 按调用顺序展示

- `State` / `Reducer`：可编辑
- `Context`：显示消费的 context
- `Memo` / `Callback` / `Ref` / `Effect`
- **自定义 hook** 按名字分组，内部嵌套展开

> 呼应「hook 调用顺序必须稳定」——能直观看到每个 hook 的当前状态。

<!--
Hooks 列表把组件的内部状态完全摊开。
-->

---

# $r：Console 操作组件

选中组件后，Console 里用 `$r`

```js
$r          // 选中的组件实例
$r.props    // props
$r.state    // state（类组件）
```

> 类似浏览器 DevTools 的 `$0`（选中 DOM），`$r` 是 React 的「选中组件」引用。

<!--
$r 让你在 Console 里编程式操作选中的组件。
-->

---

# Profiler：录制性能

- **录制交互**：点录制 → 操作页面 → 停止
- **测首屏**：Reload and start profiling
- 每次状态更新 = 一个 **commit（提交）**

录制后得到一组 commit，逐次分析渲染。

<!--
Profiler 录制是性能分析的第一步。
-->

---

# Profiler：火焰图与排名图

**Flamegraph（火焰图）**

- 组件层级 + 本次 commit 渲染耗时
- 条越宽越耗时；灰色 = 本次未渲染

**Ranked（排名图）**

- 按自身渲染耗时降序，一眼看最慢组件

<!--
火焰图看结构，排名图看热点。
-->

---

# Profiler：为什么渲染

设置开「Record why each component rendered」

录制后点组件，看它为什么渲染：

- Props changed（哪些 props 变了）
- State / Hooks changed
- Context changed
- Parent re-rendered（父组件带动）

> 先知道为什么渲染，才能对症消除多余渲染。

<!--
「为什么渲染」是优化的诊断依据。
-->

---

# React Compiler 与 ✨

React 19 起的 React Compiler 自动记忆化组件

- Profiler 里被编译器记忆化的组件标 **✨**
- 确认编译器是否如预期生效
- 优化重心：从「手写记忆化」转为「确认编译器生效」

<!--
Compiler 把记忆化自动化，DevTools 帮你确认。
-->

---

# 高亮重渲染

Profiler 设置 →「Highlight updates when components render」

- 组件重渲染时闪现**彩色边框**
- 颜色随频率变化（蓝→绿→黄→红）
- 交互时**不该变的区域却频繁闪**＝多余渲染

> 打字时整个列表都在闪？列表项没被正确记忆化。

<!--
高亮更新是发现性能问题最直观的方式。
-->

---

# 定位与消除多余渲染

1. 开高亮，发现某区域异常频繁闪烁
2. Profiler 录制该交互
3. 选中组件看「为什么渲染」
4. 多半是：父组件重渲染 / 传了新对象引用 / context 变化

> 定位 → 优化 → **重录验证**，避免凭感觉优化。

<!--
形成「发现-诊断-优化-验证」的闭环。
-->

---

# 常见优化手段

| 手段 | 适用 |
|------|------|
| `React.memo` | props 未变跳过渲染 |
| `useMemo` | 缓存计算 / 稳定引用 |
| `useCallback` | 稳定函数引用 |
| 稳定 `key` | 列表避免错误复用 |
| state 下移 | 缩小频繁变更的范围 |

> React 19 Compiler 自动记忆化，多数手动优化可省。

<!--
对症使用优化手段，再用 DevTools 验证效果。
-->

---

# standalone 与 React Native

浏览器扩展只能调网页里的 React

```bash
npm i -D react-devtools
npx react-devtools          # 独立窗口，默认端口 8097
```

- **React Native**：现代 RN 内置 React Native DevTools（基于它）
- **Safari / Electron**：用 standalone 连接

> 同一套 Components / Profiler，覆盖网页 + RN + 其他环境。

<!--
standalone 把 React 调试扩展到非浏览器环境。
-->

---

# React 19.2 Performance Tracks

在 Chrome Performance 面板注入 React 轨道

- **Scheduler 轨道**：Blocking / Transition / Suspense / Idle
- 显示调度更新的事件与渲染时机
- 与 Profiler 互补：
  - Profiler 看「组件渲染耗时」
  - Performance Tracks 看「调度与浏览器时间线的关系」

<!--
Performance Tracks 把 React 工作放进浏览器整体时间线。
-->

---
layout: center
class: text-center
---

# 小结

React DevTools = 组件树 + Profiler + 重渲染优化

Components 检查编辑 · Profiler 找性能热点 · 高亮发现多余渲染

**React 应用调试的必装工具**

[文档](https://react.dev/learn/react-developer-tools) · [Profiler](https://react.dev/reference/react/Profiler)

<!--
掌握 Components 与 Profiler，就能高效调试与优化 React 应用。
-->
