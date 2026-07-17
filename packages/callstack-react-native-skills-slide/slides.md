---
theme: seriph
background: https://cover.sli.dev
title: Callstack React Native Skills
info: |
  Callstack 官方 React Native Agent Skills：性能优化（JS/Native/Bundling）、
  迁移评估、建库、CI 产物。callstackincubator/agent-skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Callstack React Native Skills

Callstack 官方 —— React Native 性能优化 **Agent Skills**

<div class="pt-6 opacity-80">
callstackincubator/agent-skills · js / native / bundling · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/callstackincubator/agent-skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Callstack 是 React Native 核心贡献机构，这套 Agent Skills 把它的性能优化经验（源自 Ultimate Guide to React Native Optimization 电子书）沉淀成可被 AI agent 调用的技能。
-->

---
transition: fade-out
---

# 是什么 · 什么来头

<div class="grid grid-cols-2 gap-6 mt-6">
<div v-click>

**出品方**

- **Callstack**：React / React Native 专家团队，核心贡献机构
- 源自《The Ultimate Guide to React Native Optimization》电子书
- MIT，遵 agentskills.io 开放格式，跨 agent 可移植

</div>
<div v-click>

**与 Web 端互补**

- 本套：React Native 原生侧（Hermes / Turbo Modules / R8 / TTI）
- Web 端 React/Next.js 优化在 Vercel Agent Skills
- README 明确建议两者搭配用

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">

核心理念：**先测量再优化**，优化项按影响力（Impact）分级。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Callstack 是 RN 生态核心贡献者。这套技能专注原生侧，与 Vercel 的 Web 端 React 优化互补。核心理念是先测量再优化，按影响力分级。
-->

---
transition: fade-out
---

# 技能清单

<div class="grid grid-cols-2 gap-x-8 gap-y-2 mt-6 text-sm">
<div v-click>

**性能核心**

- `react-native-best-practices`
  JS / Native / Bundling 三大类 29 篇

</div>
<div v-click>

**迁移与升级**

- `assess-react-native-migration` 迁移评估
- `react-native-brownfield-migration` 嵌入
- `upgrading-react-native` 升级

</div>
<div v-click>

**工程脚手架**

- `create-react-native-library` 建库
- `github-actions` CI 云构建产物

</div>
<div v-click>

**协作**

- `github` PR / 评审 / 分支工作流

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
技能集分四组：性能核心（重点）、迁移与升级、工程脚手架、协作。核心是 react-native-best-practices。
-->

---
transition: fade-out
---

# 核心：按影响力分级

`react-native-best-practices` 的 29 篇优化指南

| 优先级 | 类别 | Impact | 前缀 |
| --- | --- | --- | --- |
| 1 | FPS 与重渲染 | **CRITICAL** | `js-*` |
| 2 | Bundle 体积 | **CRITICAL** | `bundle-*` |
| 3 | TTI 优化 | HIGH | `native-*` `bundle-*` |
| 4 | 原生性能 | HIGH | `native-*` |
| 5 | 内存管理 | MEDIUM-HIGH | `js-*` `native-*` |
| 6 | 动画 | MEDIUM | `js-*` |

<div v-click class="mt-3 text-center text-sm opacity-80">

CRITICAL 先做，HIGH 次之，MEDIUM 在证据指向时再做。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
29 篇指南按影响力分 6 类。FlashList、bundle 是 CRITICAL，动画是 MEDIUM。分级让 agent 先做影响大的。
-->

---
transition: slide-up
layout: center
class: text-center
---

# 优化工作流

<div class="text-2xl mt-8 leading-relaxed">

测量 <carbon:arrow-right class="inline opacity-60"/> 优化 <carbon:arrow-right class="inline opacity-60"/> 再测量 <carbon:arrow-right class="inline opacity-60"/> 验证

</div>

<div class="mt-8 text-left max-w-2xl mx-auto opacity-90">

- **测量**：改前抓基线（提交时间线、重渲染数、慢组件、TTI）
- **优化**：从对应 reference 应用针对性修复
- **再测量 + 验证**：FPS 45→60、TTI 3.2s→1.8s、bundle 2.1→1.6MB
- 没改善就**回滚**，试下一个

</div>

<div class="mt-6 text-sm opacity-70">

纪律：没度量到问题，不推荐 memoization / 原子状态 / 编译器改造。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
任何性能问题都走 Measure-Optimize-Re-measure-Validate 闭环。关键是有证据才动手，不做无度量的优化。
-->

---
transition: fade-out
---

# JS ① 列表虚拟化（CRITICAL）

长列表别用 `ScrollView`——会一次性挂载全部行

```jsx
// ❌ ScrollView 一次渲染所有 item，撑爆 JS/内存
<ScrollView>{items.map((i) => <Item key={i.id} {...i} />)}</ScrollView>

// ✅ 虚拟化列表：只渲染可视区 + 缓冲
<FlashList data={items} keyExtractor={(i) => i.id}
  renderItem={({ item }) => <Item {...item} />} />
```

<div v-click class="mt-3 text-sm">

选型：小静态 `ScrollView` → 量大 `FlatList` → 大而复杂 `FlashList` / `Legend List`

**版本护栏**：FlashList v1 才需 `estimatedItemSize`；**v2 已弃用**（自动测算）

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
最高频的坑：长列表用 ScrollView。改虚拟化列表。注意 FlashList v2 弃用了 estimatedItemSize，别当缺失项报。
-->

---
transition: fade-out
---

# JS ② 重渲染治理（CRITICAL）

先 profile 确认，**再**选方案

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**React Compiler**（RN 0.76+）

- 自动 memo，省手写 `memo`/`useMemo`/`useCallback`
- 先跑 `react-compiler-healthcheck`
- 只优化好代码，`"use no memo"` 局部退出

</div>
<div v-click>

**原子状态**（Jotai / Zustand）

- 广播式 Context 更新致无关订阅者重渲染时用
- 细粒度 atom / 带 selector 的 store
- 只订阅相关状态才重渲染

</div>
</div>

<div v-click class="mt-5 text-center text-sm opacity-80">

⚠️ 没度量到渲染问题，别上；也别拿组件树深度当证据。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
重渲染治理两条路：React Compiler 自动 memo，或原子状态减订阅范围。但都要先 profile 确认，别无证据地上。
-->

---
transition: fade-out
---

# Native ① Turbo Modules（HIGH）

原生模块核心：**别阻塞 JS 线程**，重活丢后台

```swift
// ❌ 同步方法阻塞 JS 2 秒
@objc func heavyWork() -> NSNumber {
  Thread.sleep(forTimeInterval: 2); return 42 }

// ✅ 异步 + 后台队列
@objc func heavyWork(resolve: @escaping RCTPromiseResolveBlock, ...) {
  DispatchQueue.global().async { resolve(self.compute()) } }
```

<div v-click class="mt-3 text-sm">

Android：模块自持 `CoroutineScope`，`invalidate()` 里 `cancel()` 防泄漏 · **C++ Turbo Module** 经 JSI 直连、运行时免 JNI

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Turbo Module 别用同步方法做重活，会阻塞 JS 线程。丢后台线程，异步优于同步。C++ 模块经 JSI 免 JNI。
-->

---
transition: fade-out
---

# Native ② 原生 SDK & TTI（HIGH）

<div class="grid grid-cols-2 gap-6 mt-4 text-sm">
<div v-click>

**原生 SDK 优于 JS polyfill**

- JS polyfill 常吃 430+ KB
- Intl 按 Hermes 实际支持精简
- crypto → `react-native-quick-crypto`
- 导航 → `native-stack` + `react-native-screens`

</div>
<div v-click>

**TTI（启动时间）**

- 只测**冷启动**（warm/hot/prewarm 全过滤）
- `react-native-performance` 打 marker
- `screenInteractive` 才是 TTI
- 2~4s 只是粗略启发式，非硬指标

</div>
</div>

<div v-click class="mt-5 text-center text-sm opacity-80">

原生导航/SDK：卸 JS 线程负担、原生动画、iOS 大标题、更省内存。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
原生 SDK 替 JS polyfill 能省包体、卸 JS 线程。TTI 只测冷启动，用 react-native-performance 打 marker。
-->

---
transition: fade-out
---

# Bundling ① barrel & tree shaking

```tsx
import { Button } from './components';    // ❌ 全部 re-export 都求值
import Button from './components/Button';  // ✅ 只加载 Button
```

<div v-click class="mt-3 text-sm">

**Expo SDK 52+ 摇树**（仅生产、须 ESM）：

```bash
EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1
EXPO_UNSTABLE_TREE_SHAKING=1
```

</div>

<div v-click class="mt-3 text-sm opacity-80">

Platform 摇树须直接 `import { Platform } from 'react-native'`；预期减 10~15% 包体。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
避免 barrel 导入，直接路径导入。Expo SDK 52+ 有实验性摇树，仅生产、须 ESM。Platform 摇树要直接导入 Platform。
-->

---
transition: fade-out
---

# Bundling ② R8 & 16KB 对齐

| 优化 | 要点 | 收益 |
| --- | --- | --- |
| **R8 收缩** | `minifyEnabled true` + `shrinkResources` | 减 20~33% 包体 |
| **16KB 页对齐** | Android 15+ 上架 Google Play 必须 | 避免打回 |
| **Hermes mmap** | RN ≤0.78 关 bundle 压缩 | TTI -16% |

<div v-click class="mt-4 text-sm">

16KB 对齐：RN 0.79+ 官方二进制已对齐，但**第三方 `.so` 仍要查**

```bash
zipalign -c -P 16 -v 4 app-release.apk   # 缺 -P 16 只查 4KB！
```

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
R8 减包 20-33%。Android 15+ 上架必须 16KB 页对齐，第三方 so 要用 zipalign -P 16 查，别只查 4KB。
-->

---
transition: fade-out
---

# 迁移评估：只读诊断

`assess-react-native-migration`——出决策报告，**不执行迁移**

<div class="mt-4 text-sm">

| 路径 | 何时推荐 |
| --- | --- |
| **Path A brownfield** | 存量用户连续性压倒一切、原生耦合深 |
| **Path B greenfield** | 行为可复原、原生依赖有可信替代 |
| **Path C checkpoint** | 先在原生宿主证明代表性 RN 流程再规模化 |

</div>

<div v-click class="mt-4 text-sm opacity-80">

证据驱动、**一次只问一个问题**；只算 RN 相对现有原生的**边际价值**，别把双平台验证当省掉的活。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
迁移评估是只读诊断。三条路径 brownfield/greenfield/checkpoint。证据驱动、一次一问，只算边际价值。
-->

---
transition: fade-out
---

# 建库 & CI 产物

<div class="grid grid-cols-2 gap-6 mt-6">
<div v-click>

**create-react-native-library**

```bash
npx create-react-native-library@latest \
  awesome-lib --type turbo-module \
  --languages kotlin-objc --example expo
```

产即发布库：iOS/Android + TS + Codegen

</div>
<div v-click>

**github-actions**

- iOS 模拟器 → `.app.tar.gz`
- Android 模拟器 → `.apk`
- `upload-artifact@v4` 捕获 `artifact-id`
- `gh run download` / REST 拉取

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
create-react-native-library 用 Builder Bob 脚手架建库。github-actions 云端构建模拟器产物，gh 可下载。
-->

---
transition: fade-out
---

# 边界

<v-clicks>

- **偏 React Native / Expo**：不是通用前端优化，强绑原生侧
- **需真机 / Profiler**：依赖 agent-device、React DevTools、Instruments，火焰图分析或需人工
- **审计给输入，取舍靠人**：给规则命中与优先级，改不改要工程判断 + 度量
- **迁移评估只诊断**：决策与实施分离，不执行迁移
- **性能建议须有度量**：先 profile 再优化，拒绝无证据的 memoization

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
边界：偏 RN、需真机验证、审计取舍靠人、迁移只诊断、性能建议须有度量。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Callstack 官方 RN Skills：react-native-best-practices 三大类（JS/Native/Bundling）29 篇按影响力分级，强制「测量→优化→再测量→验证」；外加迁移评估、建库、CI 产物。**

<div class="mt-8 opacity-80">

官方权威 · 先测量再优化 · 影响力分级 · 版本护栏 · 只读迁移诊断

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/callstackincubator/agent-skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://www.callstack.com/blog/announcing-react-native-best-practices-for-ai-agents" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Callstack 官方 RN 技能：核心是 29 篇分级优化指南，强制测量优化闭环，外加迁移评估、建库、CI。官方权威，非泛泛而谈。
-->
