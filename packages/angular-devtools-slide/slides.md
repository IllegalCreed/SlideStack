---
theme: seriph
background: https://cover.sli.dev
title: Angular DevTools 完全指南
info: |
  Angular DevTools 完全指南：Angular 官方调试扩展 · 组件 / 变更检测 / 注入树 / Signals

  Learn more at [https://angular.dev/tools/devtools](https://angular.dev/tools/devtools)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Angular DevTools 完全指南

Angular 官方调试扩展 · 变更检测 / 注入树 / Signals

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Angular DevTools 围绕变更检测和依赖注入这两个 Angular 特有机制设计。
-->

---
transition: fade-out
---

# 什么是 Angular DevTools

Angular 官方浏览器扩展（Chrome / Firefox）

- **三大面板**：Components（组件/指令树）+ Profiler（变更检测）+ Injector Tree（DI）
- **变更检测可视化**：Profiler 诊断 CD 性能瓶颈
- **Injector Tree**：DI 层级可视化（Angular 17+）
- **Signals 调试**：追踪 signal 依赖（Angular 18+）
- **仅扩展形态**：无 standalone（不像 React/Vue）

> 围绕 Angular 特有的「变更检测 + 依赖注入」设计。

<!--
Angular DevTools 的视角与 React/Vue 工具不同。
-->

---

# Angular 调试的特殊性

核心围绕两个 Angular 特有机制

- **变更检测（Change Detection）**：检测数据变化、更新视图的机制
  - 性能问题多源于「CD 跑得太频繁/太重」→ Profiler 诊断
- **依赖注入（DI）**：Angular 的核心架构
  - 服务注入在哪层、解析路径如何 → Injector Tree 可视化

> 理解 CD 与 DI，才能用好 Angular DevTools。

<!--
这是 Angular 调试区别于 React/Vue 的根本。
-->

---

# 安装

```text
Chrome / Firefox 商店搜「Angular DevTools」
```

- **仅浏览器扩展**（无 standalone）
- 打开 Angular 应用（**开发模式**）后，DevTools 多出 Angular 标签
- 生产构建隐藏调试信息，建议开发环境调试

<!--
Angular DevTools 只有扩展形态。
-->

---

# 三大面板

| 面板 | 用途 |
|------|------|
| **Components** | 组件 / 指令树，检查修改状态 |
| **Profiler** | 变更检测周期、生命周期钩子 |
| **Injector Tree** | DI 层级与解析路径（17+） |

> 外加 Signals 调试（18+）追踪响应式依赖。

<!--
三大面板各对应 Angular 的一个核心维度。
-->

---

# Components：组件与指令树

- 展示组件**与指令**层级（非 DOM）
- Angular 特色：**指令也在树里**显示
- 选中节点，页面对应元素高亮
- 搜索框按名过滤

> 可看到某元素上挂了哪些指令——React/Vue 工具没有的视角。

<!--
指令是一等公民，这是 Angular 树的特点。
-->

---

# 检查 / 修改状态

选中组件 / 指令，右侧看并改其属性

```ts
@Component({ selector: "app-card" })
export class CardComponent {
  @Input() title = "";
  expanded = false; // 改成 true 看展开态
}
```

- @Input / @Output / 实例字段
- 改值后视图按变更检测更新

> 修改状态快速验证 UI，注意需 CD 才刷新。

<!--
检查修改状态是组件调试的基础。
-->

---

# Profiler：什么是变更检测

Angular 通过变更检测检查数据变化、更新视图

- 默认（Zone.js）：异步事件（点击/定时器/HTTP）触发 CD
- CD 遍历组件树检查变化
- **性能问题多源于 CD 太频繁或太重**

> Profiler 正是诊断变更检测性能的工具。

<!--
理解变更检测是看懂 Profiler 的前提。
-->

---

# Profiler：录制与读图

- **录制**：点按钮 → 交互 → 停止
- **柱状视图**：每根柱 = 一个 CD 周期，**柱越高越耗时**
- **flame graph**：展开周期看组件层级耗时
- **tree map**：面积表示耗时占比

> 找最高的柱 = 最重的 CD 周期，重点排查。

<!--
柱状图快速定位最重的变更检测周期。
-->

---

# Profiler：捕获的事件

录制期间捕获

- **变更检测**：每个 CD 周期的执行
- **生命周期钩子**：`ngOnInit` / `ngOnChanges` / `ngDoCheck` / `ngAfterViewInit` 等

> 某组件 `ngDoCheck` 频繁且耗时高，往往是性能瓶颈线索。

<!--
生命周期钩子的执行也被 Profiler 记录。
-->

---

# Profiler：定位 CD 问题

1. 录制卡顿的交互
2. 找最高的柱（最重的 CD 周期）
3. 展开 flame graph，看哪个组件 CD 最久
4. 分析：整棵树都在 CD？某组件 `ngDoCheck` 过重？

> 定位后用 OnPush / Signals 优化，再重录验证。

<!--
形成「定位-优化-验证」闭环。
-->

---

# Injector Tree：DI 层级

Angular DevTools 独有（Angular 17+）

- Angular 的 DI 是**分层**的
- 同一服务在不同层级可能是不同实例
- Injector Tree 可视化「服务注入在哪层」

> React/Vue 工具没有的能力。

<!--
DI 层级可视化是 Angular DevTools 的独家功能。
-->

---

# Injector Tree：两棵树 + 解析路径

| 树 | 含义 |
|----|------|
| Environment | 环境注入器（root / 模块 / providedIn） |
| Element | 元素注入器（组件 providers） |

- 选中注入器 → **高亮 DI 从它到根的解析路径**
- 排查「为什么拿到这个实例 / NullInjectorError」

<!--
解析路径高亮是诊断 DI 问题的利器。
-->

---

# Signals 调试

Angular 18+ 的细粒度响应式

```ts
const count = signal(0);
const double = computed(() => count() * 2); // 依赖 count
```

- 追踪 signal **依赖与变化传播**
- 查看哪些 computed / effect 依赖某 signal
- DevTools 可视化 signal 依赖关系

<!--
Signals 依赖在 DevTools 里可视化，便于调试。
-->

---

# 变更检测优化三档

| 档位 | 做法 |
|------|------|
| **OnPush** | `ChangeDetectionStrategy.OnPush` |
| **Signals** | signal 管理状态，细粒度更新 |
| **zoneless** | 去 Zone.js，signal 驱动 CD |

> 从「组件级跳过」→「signal 级精确」→「去全局触发」，逐步细化。

<!--
三档优化是 Angular 现代性能方向。
-->

---

# 用 Profiler 验证优化

优化变更检测后回 Profiler 重录

1. 优化前录一次，记下重的 CD 周期
2. 应用 OnPush / Signals
3. 优化后重录，对比 CD 是否变少变轻

> 优化不能凭感觉——用 CD 周期柱状图量化前后差异。

<!--
量化验证避免「假优化」。
-->

---

# vs React / Vue DevTools

| | Angular | React/Vue |
|---|---------|-----------|
| 核心 | 变更检测 + DI | 组件 + 状态 |
| 独有 | Injector Tree、CD Profiler | — |
| 形态 | 仅扩展 | 扩展 + standalone |

> Angular 工具围绕其独特架构（CD/DI）设计。

<!--
不同框架的 DevTools 反映各自的架构哲学。
-->

---
layout: center
class: text-center
---

# 小结

Angular DevTools = 组件/指令 + 变更检测 + 注入树 + Signals

Profiler 诊断 CD · Injector Tree 看 DI · Signals 追踪依赖

**围绕 Angular 特有机制的官方调试工具**

[文档](https://angular.dev/tools/devtools) · [Profiler](https://angular.dev/tools/devtools/profiler)

<!--
掌握变更检测与 DI，才能把 Angular DevTools 用到位。
-->
