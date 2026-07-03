---
theme: seriph
background: https://cover.sli.dev
title: Flutter 深入浅出
info: |
  自绘引擎跨端，一切皆 Widget。

  基于 Flutter 3.44 / Dart 3.12 · 了解更多 [flutter.dev](https://flutter.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Flutter

用 **Dart** 自绘每一个像素，一套代码构建多端应用（基于 3.44 / Dart 3.12）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://flutter.dev/" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好，今天我们聊 Flutter —— Google 用 Dart 打造的跨端 UI 框架。它最大的特点是自带渲染引擎、自己画每一个像素，一套代码同时覆盖移动、Web、桌面。
-->

---
transition: fade-out
---

# 什么是 Flutter

一句话：自带渲染引擎、**自己画每一个像素**的完整 UI 工具包

<div grid="~ cols-2 gap-4">

<div>

**自绘，不是套壳**

- 按钮/文本/滚动全由框架用 Dart 实现，**不调系统原生控件**
- 引擎随 App 打包 → 各平台/系统版本**表现一致**
- 一套代码覆盖 **移动 / Web / 桌面 / 嵌入式**

</div>

<div>

| 维度 | Flutter | React Native |
| --- | --- | --- |
| 渲染 | **自绘像素** | 桥接原生控件 |
| 控件 | Dart 实现·一致 | 系统控件·随 OS 变 |
| 语言 | Dart | JS/TS |
| 开销 | 无桥接 | 早期 JS bridge |

</div>

</div>

<div v-click class="mt-3 text-sm">

记忆：**RN「翻译」给系统画，Flutter「自己」画**

</div>

<!--
和 React Native 最本质的区别在渲染路径：RN 把组件翻译成系统原生控件、由系统去画；Flutter 自带引擎，直接控制每一个像素。这带来了跨平台一致性和无桥接开销，代价是产物里要带上引擎。
-->

---
transition: fade-out
---

# 一切皆 Widget

UI 由不可变的 Widget **组合**而成，`UI = f(state)`

<v-clicks>

- **声明式**：`build()` 描述「UI 长什么样」，状态变了框架自动 diff 更新
- **Widget 不可变**：每个 Widget 是一段只读的 UI 声明片段
- **组合优于继承**：小 Widget 层层嵌套搭出界面，连 App 本身都是 Widget
- **StatelessWidget**：无可变状态，纯由构造参数决定
- **StatefulWidget**：Widget（不可变配置）+ State（可变数据），**State 跨 rebuild 持久存在**

</v-clicks>

<!--
Flutter 里一切皆 Widget，而且都是不可变的。你不是命令式地去改界面，而是声明式地描述当前状态下 UI 应该长什么样，框架负责 diff 和更新。无状态用 StatelessWidget，有状态用 StatefulWidget —— 注意 Widget 本身不可变，可变的是它挂着的 State 对象。
-->

---
transition: fade-out
---

# State 生命周期与 setState

`setState` 标记脏 → 框架重建该子树

```dart
class _CounterState extends State<Counter> {
  int _count = 0; // State 跨 rebuild 持久保留
  @override
  Widget build(BuildContext context) => ElevatedButton(
    onPressed: () => setState(() => _count++), // 通知框架重建
    child: Text('Count: $_count'),
  );
}
```

<v-clicks>

- 生命周期：initState（一次·初始化）→ build（每次·返回子树）→ dispose（清理）
- `initState` 只调一次；此时不能用 `context` 查 InheritedWidget（依赖未就绪）
- `dispose` **必须**释放 controller/订阅，否则内存泄漏

</v-clicks>

<!--
setState 的作用是标记当前 State 为脏，触发它的 build 重新执行。生命周期里最需要记住两头：initState 只跑一次用来初始化资源，dispose 用来释放资源防止内存泄漏。中间的 build 每次重建都会调。
-->

---
transition: fade-out
---

# 三棵树：Widget · Element · RenderObject

一份声明，三层协作

| 树 | 性质 | 职责 |
| --- | --- | --- |
| **Widget** | 不可变·频繁重建·廉价 | 配置蓝图（你写的代码） |
| **Element** | 可变·持久·跨帧缓存 | 桥梁：diff 复用，绑定 Widget↔RenderObject |
| **RenderObject** | 持久·重 | 真正的 layout / paint / hit-test |

<v-clicks>

- **BuildContext 本质就是 Element**——`build(context)` 拿到的就是节点位置句柄
- Widget 便宜可随意重建，Element 复用避免重建整棵渲染树 → 高效更新

</v-clicks>

<!--
Flutter 内部其实有三棵树。Widget 树是你写的、不可变、可频繁重建的蓝图；Element 树是可变、持久的桥梁，负责 diff 和复用，平时用的 BuildContext 本质就是 Element；RenderObject 树才真正做布局和绘制。分层的意义在于：Widget 很便宜可以随便重建，但通过 Element 复用，底层 RenderObject 不用重建，所以更新很高效。
-->

---
transition: fade-out
---

# 约束布局：约束向下·尺寸向上

黄金法则：**Constraints go down. Sizes go up. Parent sets position.**

<div grid="~ cols-2 gap-4">

<div>

**约束怎么传**

- 父传 min/max 宽高 → 子在约束内定尺寸并上报 → 父定位置，一趟 O(n)
- **紧约束** min==max，子必须服从（屏幕给根就是紧）
- **松约束** 子可自选（`Center` 给子松约束）
- 反直觉：`Container(width:100)` 单独放**铺满全屏**，包 `Center` 才 100×100

</div>

<div>

**Flex 与排错**

- `Row`/`Column` 主轴给子**无约束** → 子过大触发 **overflow 黄黑条**
- `Expanded` 强制填满剩余；`Flexible` 允许更小
- overflow → 用 `Expanded`/`ListView`；infinite 约束 → 给定尺寸/`SizedBox`

</div>

</div>

<!--
布局是 Flutter 的考点重灾区，记住这句黄金法则：约束向下传、尺寸向上报、父级定位置，整个过程一趟遍历完成。最经典的反直觉例子：单独一个带固定宽高的 Container 会铺满全屏，因为屏幕给它的是紧约束；包一层 Center 拿到松约束，它才会变成你要的尺寸。右边是 Flex 家族和最常见的两类崩溃排查。
-->

---
transition: fade-out
---

# 状态管理：先内置·按需升级

官方不钦定唯一方案：从内置起步，复杂再上包

<div grid="~ cols-2 gap-4">

<div>

**内置手段**（无需依赖）

- **setState**：局部/临时（ephemeral）状态
- **ValueNotifier + Builder**：最小响应式原语
- **InheritedWidget**：祖先→后代传递，**Provider 底层就用它**

</div>

<div>

**社区主流包**

- **provider**：InheritedWidget 友好封装，入门首选
- **Riverpod**：编译期安全、无需 context，现代推荐
- **Bloc**：事件→状态流，大型/团队协作
- **GetX / MobX / signals**：各有取舍

</div>

</div>

<div v-click class="mt-2 text-sm">

选型速记：**小 → setState；中 → Provider/Riverpod；大/团队 → Bloc/Riverpod**

</div>

<!--
Flutter 官方对状态管理是开放态度：先用内置的 setState、ValueNotifier、InheritedWidget，复杂了再上第三方包。要理解 Provider、Riverpod 这些库底层其实都是 InheritedWidget。选型上记住这条速记就够用了。
-->

---
transition: fade-out
---

# 渲染引擎：Skia → Impeller

为消除**着色器编译卡顿**（shader jank）而生

<v-clicks>

- **Skia 老问题**：运行时首遇新 shader 才编译 → 首帧/复杂动画掉帧
- **Impeller 方案**：**构建期预编译**所有 shader 与管线状态 → 运行时零编译
- 目标：可预测性能、可观测、可移植、现代并发

</v-clicks>

<div v-click>

| 平台 | 后端 | 默认起点 |
| --- | --- | --- |
| iOS | Metal | **3.10** 起默认（Skia 已移除） |
| Android | Vulkan | **3.27** 起默认（API 29+，OpenGL 回退） |
| Web | CanvasKit / Skwasm | 不支持 Impeller（仍基于 Skia） |

</div>

<!--
Impeller 是为了解决 Skia 时代著名的着色器编译卡顿：Skia 在运行时第一次遇到某个 shader 组合才去编译，导致首帧或复杂动画掉帧。Impeller 把所有 shader 和管线状态提前到构建期编译，运行时零编译，帧率可预测。落地节奏记住：iOS 从 3.10 起默认、Android 从 3.27 起默认；Web 不支持 Impeller，仍走基于 Skia 的 CanvasKit 或 Skwasm。
-->

---
transition: fade-out
---

# Dart：双编译 · Null Safety

一门语言，开发期与发布期用**两种编译方式**

<v-clicks>

- **开发 = JIT**：Dart VM 运行时编译 → 支撑 **Hot Reload**、断言、调试
- **发布 = AOT**：提前编译成原生 ARM/x64 机器码 → 快启动、小体积、无解释层
- **Sound Null Safety**：Dart 3 起强制，编译器保证非空类型永不为 null

</v-clicks>

```dart
int  x = 5;        // 非空
int? y;            // 可空（默认 null）
y!.isEven;         // ! 断言非空
late int z;        // late 延迟初始化
final a = y ?? 0;  // ?? 空合并 · y?.isEven 空安全调用
```

<!--
Dart 有个很关键的设计：同一门语言，开发期用 JIT 即时编译，所以能做 Hot Reload；发布期用 AOT 提前编译成原生机器码，启动快、体积小。另一大特性是 sound null safety，从 Dart 3 起强制，编译器层面保证非空类型不会是 null，配套问号、感叹号、late、双问号这些语法。
-->

---
transition: fade-out
---

# isolate：不阻塞 UI 的并发

`async/await` 不开线程，**CPU 密集仍会卡 UI**

<v-clicks>

- 默认单 isolate：一个事件队列顺序处理，单帧 ~16ms，超时即 **jank**
- **isolate ≠ 线程**：各自独立内存、不共享状态，**只靠消息传递**（Actor 模型）
- `Isolate.run(fn)` / `compute(fn, msg)`：一次性重计算，跑完自动退出
- **Web 无 isolate** → `compute` 退回主线程跑

</v-clicks>

```dart
final photos = await Isolate.run(() => parseJson(bigString));
```

<!--
这里有个高频误区：async/await 并不会开新线程，它只是让出事件循环，所以 CPU 密集的计算照样会卡住 UI。真正的解法是 isolate。注意 isolate 不是线程，它们内存独立、不共享状态，只能靠消息传递，是 Actor 模型。一次性的重计算用 Isolate.run 或 compute 就行。要记住 Web 上没有 isolate，compute 会退回主线程。
-->

---
transition: fade-out
---

# Hot Reload vs Hot Restart

改代码即时生效，是否**保留状态**是关键区别

| | Hot Reload | Hot Restart |
| --- | --- | --- |
| 速度 | 最快（~1s） | 较慢 |
| **状态保留** | ✅ 保留 | ❌ 丢失 |
| 重跑 `main`/`initState` | ❌ 否 | ✅ 是 |

<v-clicks>

- 仅 **debug（JIT）** 模式可用；注入源码、重建 Widget 树、保留登录/导航状态
- **失效需 Restart**：改 `main`/`initState`、全局/静态初始化器、enum↔class、泛型签名
- 改**原生代码**（Kotlin/Swift）→ 需 Full Restart

</v-clicks>

<!--
Hot Reload 是 Flutter 开发体验的招牌：改完代码一秒内生效，还保留 App 当前状态，比如登录态、导航栈。它只在 debug 也就是 JIT 模式下可用。但有几类改动它处理不了，需要 Hot Restart：改 main、initState、全局或静态初始化器、enum 和 class 互转、泛型签名变化。如果改的是原生代码，那要 Full Restart。
-->

---
transition: fade-out
---

# Material / Cupertino · 多端

一套代码，两种设计语言，多个平台

<div grid="~ cols-2 gap-4">

<div>

**两套组件库**

- **Material**：`MaterialApp`/`Scaffold`/`AppBar`/`ElevatedButton`，Material 3 默认
- **Cupertino**：iOS 风格 `CupertinoApp`/`CupertinoButton`
- 可按平台自适应选择

</div>

<div>

**多平台与交互**

- 移动 / Web / 桌面 / 嵌入式，单一代码库
- **Platform Channels**：异步消息 Dart↔原生
- **FFI** 直连 C；**Platform Views** 内嵌原生视图（如地图）

</div>

</div>

<!--
Flutter 自带两套组件库：Material 是 Google 设计语言，Cupertino 是 iOS 风格，可以按平台自适应。平台覆盖上，一套代码可以跑移动、Web、桌面、嵌入式。和原生打通有三种方式：Platform Channels 走异步消息，FFI 直连 C 更快，Platform Views 用来内嵌原生视图比如地图。
-->

---
layout: center
class: text-center
---

# 选型总结

**要跨端像素级一致、掌控每一帧** → Flutter

自绘引擎 · 一切皆 Widget · Dart 双编译 · Impeller · 多端一码

<div class="mt-8 text-sm opacity-75">

[官方文档](https://flutter.dev/) · [Dart](https://dart.dev/) · [pub.dev](https://pub.dev/)

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://flutter.dev/" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
一句话选型：如果你要跨端做到像素级一致、又想掌控每一帧的渲染，Flutter 是很有力的选择。它的关键词就是自绘引擎、一切皆 Widget、Dart 双编译、Impeller 渲染，以及一套代码多端复用。谢谢大家！
-->
