---
theme: seriph
background: https://cover.sli.dev
title: React Native 深入浅出
info: |
  用 JS/React 构建真正的原生应用。

  基于 React Native 0.86 · 了解更多 [reactnative.dev](https://reactnative.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# React Native

用 JavaScript + React 构建**真正的原生**应用（基于 0.86）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://reactnative.dev/" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好，今天我们聊 React Native —— 用前端最熟悉的 JavaScript 和 React，产出观感与性能都接近原生的 iOS/Android App。
-->

---
transition: fade-out
---

# 什么是 React Native

一句话：用 JS/React 写、**运行时渲染成真实原生控件**

<v-clicks>

- `<Text>` → iOS `UITextView` / Android `TextView`，是**真原生视图**
- **不是** WebView 套壳（Cordova/Capacitor），**不是** Flutter 那种自绘像素
- 口号 **「Learn once, write anywhere」**——复用技能，允许平台特定代码
- 由 **Meta 主导 + 社区驱动**，全球第二大跨端框架
- 2026：新架构专属 + Expo 默认工作流（RN 0.86 / React 19.2）

</v-clicks>

<!--
它的关键在于：你写的组件在运行时映射为真实的原生控件，所以天然继承平台观感、无障碍与手感，而不是模拟。
-->

---
transition: fade-out
---

# 与 React 的关系 · 核心组件

会 React Web，就已经会了 RN 的一大半

<div grid="~ cols-2 gap-4">

<div>

**心智相同**：组件、Props/State、Hooks、JSX 全一样，只是换了个渲染到**原生视图**（而非 DOM）的 renderer

</div>

<div>

| RN | 原生 |
| --- | --- |
| `View` | UIView / ViewGroup |
| `Text` | UITextView / TextView |
| `Image` | UIImageView / ImageView |
| `FlatList` | 虚拟化长列表 |

</div>

</div>

<!--
差异集中在两处：组件集合（没有 div/p，改用 View/Text），以及样式系统。
-->

---
transition: fade-out
---

# 新架构：为什么弃 Bridge

旧架构靠**异步 Bridge** 传**序列化 JSON**，三大痛点

<v-clicks>

- **序列化开销**：每次 JS↔原生都要 JSON 编解码
- **强制全异步**：无法同步读布局 → 「布局跳变」
- **高频瓶颈**：相机每帧数十 MB、每秒上 GB，扛不住

</v-clicks>

<div v-click class="mt-4">

解法：**JSI** 直接内存互引替代 Bridge，重建渲染器与原生模块

</div>

<!--
新架构的整体思路，就是用 JSI 的直接内存互引，替代又慢又异步的序列化 Bridge。
-->

---
transition: fade-out
---

# 新架构四大件

<v-clicks>

- **JSI**：JS↔C++ 直接互相持有引用、**同步调用**，消除序列化
- **Fabric**：C++ 统一新渲染器，**同步布局** + React 18/19 并发
- **TurboModules**：JSI 原生模块，**类型安全 + 懒加载**
- **Codegen**：构建期从 TS/Flow spec 生成原生胶水，保类型安全

</v-clicks>

<div v-click class="mt-4 text-sm">

配角：**Bridgeless**（彻底不建桥）· **Yoga**（Flexbox 布局引擎）· **Hermes**（默认引擎）

</div>

<!--
JSI 是地基；Fabric 是新渲染器带来同步布局；TurboModules 是新原生模块；Codegen 保证类型安全。
-->

---
transition: fade-out
---

# 新架构版本时间线

记忆口诀：**0.76 默认，0.82 强制（不可退）**

| 版本 | 里程碑 |
| --- | --- |
| 0.74 | Bridgeless 成新架构下默认 |
| **0.76** | 新架构成所有项目默认、production-ready |
| **0.82** | 首个完全运行在新架构上；开关移除、不可关 |
| 0.86 | 新架构专属时代，持续清理 legacy |

<div v-click class="mt-3 text-sm">

可关新架构的最后版本 = **0.81**（Expo SDK 54）；SDK 55 起强制

</div>

<!--
关键节点记两个：0.76 变默认，0.82 变强制、不能再关。
-->

---
transition: fade-out
---

# Hermes 与样式系统

<div grid="~ cols-2 gap-4">

<div>

**Hermes**（默认引擎）

- **AOT 把 JS 预编译成字节码**（.hbc）
- 更快启动、更低内存、更小包体
- `global.HermesInternal` 判断；性能看 release build

</div>

<div>

**样式**（用 JS 写）

- 无 CSS 文件，属性 **camelCase**
- `StyleSheet.create({...})`
- 数组样式后者覆盖前者
- **无级联**，继承仅在 `<Text>` 内

</div>

</div>

<!--
Hermes 靠构建期预编译字节码提速启动；样式则是纯 JS 对象、camelCase、几乎没有 CSS 那套继承级联。
-->

---
transition: fade-out
---

# Flexbox 差异 · Text 规则（高频坑）

<div grid="~ cols-2 gap-4">

<div>

| 属性 | RN | Web |
| --- | --- | --- |
| `flexDirection` | **column** | row |
| `flexShrink` | **0** | 1 |
| `flex` | 单数字 | 简写 |

</div>

<div>

- **所有文本必须包在 `<Text>`**，裸串放 `<View>` **报错**
- `TextInput` 用 **`onChangeText`**（直接给字符串）
- 单位无单位 **dp**；Android 不支持负 margin

</div>

</div>

<!--
最常见的「布局怎么反了」，就是忘了 RN 默认 column。还有文本必须包在 Text 里。
-->

---
transition: fade-out
---

# 列表与性能

<v-clicks>

- 长列表用**虚拟化 `FlatList`**（只渲染可视项），**别用 `ScrollView`**（全量渲染）
- 等高项给 **`getItemLayout`** 跳过异步测量，最有效；更强用 **FlashList**
- 目标 **60 FPS** = 每帧 **16.67ms** 预算，超时即掉帧
- **两线程**：JS 线程（逻辑）+ UI 主线程（原生动画/滚动，不被 JS 掉帧阻塞）
- 纪律：**测 release build**、生产移除 `console.log`

</v-clicks>

<!--
列表的核心是虚拟化；性能的核心是理解两条线程与每帧 16 毫秒的预算。
-->

---
transition: fade-out
---

# 动画：useNativeDriver

```ts
Animated.timing(opacity, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // 在 UI 线程跑，JS 阻塞也不卡
}).start();
```

<v-clicks>

- **仅支持 `transform` 与 `opacity`**，不支持宽高等布局属性
- `Animated.event` 的 native driver **对 `PanResponder` 无效**
- 社区事实标准 **Reanimated**：worklet 直接跑 UI 线程

</v-clicks>

<!--
useNativeDriver 把动画搬到 UI 线程，但代价是只支持 transform 和 opacity。
-->

---
transition: fade-out
---

# Expo：2026 官方默认工作流

起步：`npx create-expo-app@latest`

<v-clicks>

- **Expo Router**：文件路由，`app/` 下加文件即成路由（建于 React Navigation）
- **Dev Build vs Expo Go**：Expo Go 固定内置库、**装不了自定义原生**；用到就得 **Development Build**
- **CNG / prebuild**：`ios/`、`android/` 当**构建产物**（`.gitignore`），配置为真源
- **Config Plugins**：prebuild 期声明式改原生工程（`with<Name>`）

</v-clicks>

<!--
官方现在明确推荐用框架起步，Expo 开箱给你路由、原生模块、云构建。
-->

---
transition: fade-out
---

# EAS 与发布 · 工具链

<div grid="~ cols-2 gap-4">

<div>

**EAS**（云服务）

- **Build**：云端出包、自动签名
- **Submit**：自动上架
- **Update（OTA）**：只发 JS/资源，**不发原生/权限/SDK**

</div>

<div>

**工具链**

- **Metro** 打包器（解析→转译→打包）
- **RN DevTools**（0.76 起，取代 Flipper，需 Hermes）
- **Fast Refresh**：保留函数组件 state
- 导航：**React Navigation**

</div>

</div>

<!--
发布走 EAS 三件套；OTA 有边界：只能下发 JS 和资源，原生改动仍需过审。
-->

---
layout: center
class: text-center
---

# 选型总结

**要真原生级跨端、团队是 JS/React 系** → React Native

新架构专属 · Expo 默认 · Hermes 引擎 · 全球第二

<div class="mt-8 text-sm opacity-75">

[官方文档](https://reactnative.dev/) · [Expo](https://docs.expo.dev/) · [React Navigation](https://reactnavigation.org/)

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://reactnative.dev/" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
一句话选型：如果你的团队是 JS/React 系、又要真原生级体验，React Native 是 2026 的首选之一。谢谢大家！
-->
