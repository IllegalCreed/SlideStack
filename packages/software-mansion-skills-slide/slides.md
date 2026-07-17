---
theme: seriph
background: https://cover.sli.dev
title: Software Mansion Skills
info: |
  Software Mansion 官方 React Native 技能集：动画/手势/音频/on-device AI/实时视频。
  software-mansion-labs/skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Software Mansion Skills

Reanimated 作者出品——**生产级 React Native 范式**，打包成 Claude Code 插件

<div class="pt-6 opacity-80">
software-mansion-labs/skills · animations / gestures / audio / on-device AI / fishjam
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/software-mansion-labs/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Software Mansion Skills 是 Reanimated、Gesture Handler、Skia 绑定、Fishjam、Radon IDE 作者 Software Mansion 官方出品的一组生产级 React Native 范式，打包成 Claude Code 插件。
-->

---
transition: fade-out
---

# 谁做的？为什么是「一手」

Software Mansion = 你天天用的那些 RN 库的**作者**

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**他们写的库**

- Reanimated（动画）
- Gesture Handler（手势）
- React Native Screens（导航）
- Skia 绑定 / Worklets / Fishjam / Radon IDE

</div>
<div v-click>

**所以 skills 的价值**

- 范式来自**维护者本人**，非二手总结
- 追当前版本（animations 追 Reanimated 4）
- README：Optimized for Claude models
- 2012 年起、Core RN Contributors

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

顶层 `SKILL.md` 是目录，reference 文件**按需加载**——省 context。

</div>

<style>
h1 { background: linear-gradient(45deg, #E8503A 10%, #F5A623 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Software Mansion 是 Reanimated、Gesture Handler、Screens、Skia 绑定、Worklets、Fishjam、Radon IDE 的作者。所以这套 skills 是一手的：维护者本人写的、追当前版本、为 Claude 优化。加载上渐进式，省 context。
-->

---
transition: fade-out
---

# 安装：一条命令

作为 Claude Code 插件（推荐）

<div v-click>

```text
/plugin marketplace add software-mansion-labs/skills
/plugin install skills@swmansion
/reload-plugins
```

</div>

<div v-click class="mt-4">

更新到最新版 / 跨 agent 安装：

```bash
/plugin marketplace update swmansion    # 更新
npx skills add software-mansion-labs/skills   # Cursor / Codex 等
```

</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

触发条件：`package.json` 含 `react-native` / `expo` / `expo-router` 即适用。

</div>

<style>
h1 { background: linear-gradient(45deg, #E8503A 10%, #F5A623 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
装法：plugin marketplace add software-mansion-labs/skills，install skills@swmansion，reload。更新用 marketplace update，跨 agent 用 npx skills add。RN/Expo 项目自动适用。
-->

---
transition: fade-out
---

# skills 总览

`react-native-best-practices` 是顶层（含 8 子主题），另有 6 个独立 skill

| Skill | 干什么 |
| --- | --- |
| `fishjam` | 实时视频 / 音频 / 一对多直播（hosted WebRTC） |
| `detour` | deferred deep linking（开源 SDK） |
| `radon-mcp` | Radon IDE 的 MCP 工具调试 RN 应用 |
| `rnrepo` | 预构建产物，原生构建提速约 2×（beta） |
| `expo-horizon` | 把 Expo 应用迁移到 Meta Quest |
| `typegpu` | TypeGPU / WebGPU 类型化管线 |

<style>
h1 { background: linear-gradient(45deg, #E8503A 10%, #F5A623 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
skills 分两层：react-native-best-practices 是顶层含 8 子主题，另有 6 个独立 skill：fishjam 实时音视频、detour 深链、radon-mcp 调试、rnrepo 构建提速、expo-horizon 迁移 Quest、typegpu WebGPU。
-->

---
transition: fade-out
---

# react-native-best-practices 的 8 子主题

一个 skill 覆盖 RN 开发的八大主题

<div class="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-sm">
<div v-click>

- **animations** — Reanimated 4 / Skia / WebGPU
- **gestures** — Gesture Handler
- **svg** — React Native SVG
- **on-device-ai** — ExecuTorch 端侧 AI

</div>
<div v-click>

- **rich-text** — react-native-enriched
- **multithreading** — react-native-worklets
- **audio** — react-native-audio-api
- **jsi** — C++ ↔ JS 引擎边界

</div>
</div>

<div v-click class="mt-6 text-center opacity-80">

顶层 skill 只是目录，把任务路由到对应 `references/` 子主题——**按需加载**。

</div>

<style>
h1 { background: linear-gradient(45deg, #E8503A 10%, #F5A623 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
react-native-best-practices 一个 skill 覆盖八大主题：动画、手势、SVG、on-device AI、富文本、多线程、音频、JSI。顶层只是目录，按需路由到子主题。
-->

---
transition: fade-out
---

# 动画：按复杂度分层选型

从轻到重，选对方式

| 方式 | 用什么 | 何时用 |
| --- | --- | --- |
| CSS 过渡 / 动画 | Reanimated 4 CSS-like API | 简单属性过渡、循环 |
| shared value | `useSharedValue` + `withTiming/Spring` | 命令式、手势联动 |
| canvas | `@shopify/react-native-skia` | 复杂 2D、路径、粒子、SKSL |
| GPU shader | `react-native-wgpu` + TypeGPU | WGSL 计算、仿真、3D |
| layout | `FadeIn` / `LinearTransition` | 进入退出、列表项、共享元素 |

<style>
h1 { background: linear-gradient(45deg, #E8503A 10%, #F5A623 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
动画分层选型：CSS 过渡最轻，shared value 做交互，Skia canvas 做复杂 2D，WebGPU/TypeGPU 做 GPU shader 和 3D，layout 动画做进入退出和共享元素。按复杂度选。
-->

---
transition: fade-out
---

# Reanimated 4 的第一条硬规则

`runOnJS` 没了

<div v-click>

```tsx
// ❌ Reanimated 4 已移除 runOnJS
Gesture.Pan().onUpdate((e) => {
  handleTouch(e.absoluteX, e.absoluteY); // 崩：UI 线程调非 worklet 函数
});

// ✅ 用 react-native-worklets 的 scheduleOnRN
import { scheduleOnRN } from 'react-native-worklets';
Gesture.Pan().onUpdate((e) => {
  scheduleOnRN(handleTouch, e.absoluteX, e.absoluteY);
});
```

</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

适用**所有** worklet 上下文：滚动、手势、`useAnimatedReaction`、`useFrameCallback`。

</div>

<style>
h1 { background: linear-gradient(45deg, #E8503A 10%, #F5A623 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Reanimated 4 移除了 runOnJS。worklet 上下文里调 JS 线程函数，一律改用 react-native-worklets 的 scheduleOnRN，直接调会崩 UI 线程。适用所有 worklet 上下文。
-->

---
transition: fade-out
---

# gestures：几条会崩运行时的规则

Gesture Handler，别用 `PanResponder`（跑 JS 线程、废弃）

<v-clicks>

- **`GestureHandlerRootView` 必须在根**——缺了它 `GestureDetector` 运行时崩；嵌套的只用最外层
- **手势回调跑 UI 线程**——直接调 state setter / 导航会崩，用 `scheduleOnRN` 包裹
- **别混两套触摸系统**——RN 原生触摸 + RNGH 混用 → 双击 bug、手势冲突
- **滚动容器从 RNGH 导入**——`ScrollView` / `FlatList` 从 `react-native-gesture-handler`
- **v2 builder vs v3 hook**——v2 `Gesture.Pan()`（须 `useMemo`）；v3 `usePanGesture()`（内部 memo）

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #E8503A 10%, #F5A623 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
gestures 硬规则：GestureHandlerRootView 必须在根，手势回调跑 UI 线程调 JS 要 scheduleOnRN，别混两套触摸系统，滚动容器从 RNGH 导入，v2 builder 要 useMemo、v3 hook 内部处理。
-->

---
transition: fade-out
---

# audio 与 on-device-ai

资源纪律 + 端侧 AI

<div class="grid grid-cols-2 gap-6 mt-4 text-sm">
<div v-click>

**audio（audio-api）**

- `AudioContext` / `AudioRecorder` **单例**
- 空闲 `suspend()`（否则放静音耗电）
- `AudioBufferSourceNode` 单次使用
- 参数变化用 `AudioParam` 调度防爆音
- 可视化 `.modify()` 就地改数组

</div>
<div v-click>

**on-device-ai（ExecuTorch）**

- 先 `initExecutorch()` + adapter
- 推理前查 `isReady`
- 用 `_QUANTIZED` 变体防 OOM
- STT/VAD **16kHz 单声道**、TTS 24kHz
- **需新架构**，Expo Go 不支持

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #E8503A 10%, #F5A623 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
audio 的纪律：单例 AudioContext/Recorder、空闲 suspend、SourceNode 单次、参数用 AudioParam 调度、可视化就地改数组。on-device-ai 的 ExecuTorch：先 init、查 isReady、用量化变体、采样率对齐、需新架构。
-->

---
transition: fade-out
---

# multithreading：三种 runtime

worklets 是 Reanimated / Gesture Handler / Skia 的共同底层

| Runtime | 特点 | 干什么 |
| --- | --- | --- |
| **UI** | 主线程，一个 | 响应原生事件、同帧动画 |
| **Worker** | 自定义线程，可多个 | 重计算、后台任务 |
| **RN** | JS 线程，一个 | 访问 React state / RN API |

<div v-click class="mt-3 text-sm opacity-90">

调度：`scheduleOnUI` / `scheduleOnRN` / `scheduleOnRuntime`；runtime **不共享内存**（序列化或 `Synchronizable`）。**JSI** 则是更底层的 C++↔JS 边界：`HostObject` / 零拷贝 `ArrayBuffer` / TurboModules vs Nitro。

</div>

<style>
h1 { background: linear-gradient(45deg, #E8503A 10%, #F5A623 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
multithreading 三 runtime：UI 主线程、Worker 重计算、RN 访问 state。调度用 scheduleOnUI/RN/Runtime，不共享内存。JSI 是更底层的 C++ 与 JS 引擎边界，HostObject、零拷贝 ArrayBuffer、TurboModules vs Nitro。
-->

---
transition: fade-out
---

# fishjam：实时音视频平台

hosted WebRTC，模型 = rooms / peers / tracks

<div class="grid grid-cols-2 gap-6 mt-4 text-sm">
<div v-click>

**两级鉴权**

- **management token** 绝不出后端
- **peer token** 有效 24h，重连用 `refreshPeerToken`
- Sandbox URL 仅 dev，别进生产客户端

</div>
<div v-click>

**四个 SDK**

- Node.js / Python 服务端（含 AI 语音 agent、Gemini Live）
- React web 客户端
- React Native / Expo 客户端（CallKit、屏幕共享、画中画）

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

生产应用 = 后端（server SDK）+ 客户端（client SDK）；原型可用 Sandbox 跳后端。

</div>

<style>
h1 { background: linear-gradient(45deg, #E8503A 10%, #F5A623 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
fishjam 是托管 WebRTC，模型是房间/参与者/音视频轨。两级鉴权：management token 不出后端、peer token 24h。四个 SDK：Node/Python 服务端、React web、React Native 客户端。生产 = 后端 + 客户端。
-->

---
transition: fade-out
---

# 另外四个独立 skill

覆盖深链、调试、构建、VR

<div class="grid grid-cols-2 gap-x-8 gap-y-3 mt-6 text-sm">
<div v-click>

**detour** — deferred deep linking
确定性（Android referrer）vs 概率匹配（默认 850 分 / 15 分窗）；从 Branch / AppsFlyer 迁移

</div>
<div v-click>

**radon-mcp** — Radon IDE 调试
调试先 `view_application_logs`，再截图 / 组件树 / 网络 / reload

</div>
<div v-click>

**rnrepo** — 构建提速约 2×
Gradle/CocoaPods 插件换预构建产物；beta、仅新架构；`denyList` opt out

</div>
<div v-click>

**expo-horizon** — 迁移 Meta Quest
先装 `expo-horizon-core`；Quest 无 GPS；改配置后 `expo prebuild --clean`

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #E8503A 10%, #F5A623 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
另外四个 skill：detour 延迟深链，确定性 vs 概率匹配、从 Branch/AppsFlyer 迁移；radon-mcp 用 Radon IDE 调试，先看日志；rnrepo 预构建产物提速 2×；expo-horizon 迁移到 Meta Quest。
-->

---
transition: fade-out
---

# 边界与反模式

用之前先看清

<div class="grid grid-cols-2 gap-6 mt-4 text-sm">
<div v-click>

**边界**

- 强绑 **React Native / Expo**，非通用技能
- 多处要 **New Architecture**（老架构不支持）
- fishjam / detour 绑自家云；rnrepo 是 beta
- 许可：README + SKILL.md 标 MIT，但**根目录无 LICENSE 文件**

</div>
<div v-click>

**反模式（明确点名）**

- ❌ `runOnJS` → ✅ `scheduleOnRN`
- ❌ `PanResponder` → ✅ Gesture Handler
- ❌ 忘 `GestureHandlerRootView`
- ❌ 多个 `AudioContext` → ✅ 单例
- ❌ ExecuTorch 用全精度模型 → ✅ 量化

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #E8503A 10%, #F5A623 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
边界：强绑 RN/Expo、多处要新架构、fishjam/detour 绑云、许可 README 标 MIT 但根无 LICENSE 文件。反模式：别用 runOnJS/PanResponder、别忘 GestureHandlerRootView、别多个 AudioContext、ExecuTorch 用量化模型。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Reanimated 作者的官方 RN 技能集：一个 `react-native-best-practices` 覆盖动画/手势/音频/on-device AI/JSI 八主题，外加 fishjam 实时音视频、detour 深链、rnrepo 提速、expo-horizon 迁 Quest——追新架构，`runOnJS` 已换 `scheduleOnRN`。**

<div class="mt-8 opacity-80">

官方一手 · 按需加载 · 追 Reanimated 4 · 强绑 RN/Expo

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/software-mansion-labs/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://swmansion.com/" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #E8503A 10%, #F5A623 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Reanimated 作者的官方 RN 技能集，一个 react-native-best-practices 覆盖八主题，外加 fishjam、detour、rnrepo、expo-horizon。追新架构，runOnJS 换成 scheduleOnRN。
-->
