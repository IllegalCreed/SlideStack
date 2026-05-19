---
theme: seriph
background: https://cover.sli.dev
title: Welcome to React Navigation
info: |
  Presentation React Navigation for React Native developers.

  Learn more at [https://reactnavigation.org](https://reactnavigation.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:react class="text-7xl" />
</div>

<br/>

## React Navigation — Routing for React Native

React Native 主流路由库，由社区主导维护，当前主线 v7.x（2024.11 发布）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 React Navigation —— React Native 生态最主流的路由方案，由 Satyajit Sahoo、Michał Pierzchała 等社区核心成员维护。

它和 React Router 不是一个东西 —— React Router 服务于 Web，React Navigation 服务于 React Native（iOS / Android / Web 通过 react-native-web）。

2017 年初发布，经历 v1 ~ v4 的 createXxxNavigator 高阶组件时代、v5 ~ v6 的组件式 API 重写、2024.11 发布 v7 —— 引入静态配置、屏幕预加载、类型自动推导等大特性。

核心卖点：5 种 Navigator 全覆盖（Native Stack / JS Stack / Bottom Tabs / Drawer / Material Top Tabs）、Type-safe routes、Deep Linking、Auth Flow 范式、State Persistence、与 Expo Router 关系紧密。
-->

---
transition: fade-out
---

# 什么是 React Navigation？

React Native 应用的路由与导航库，与 React Router 是两个完全独立的项目

<v-click>

- **社区维护**：Satyajit Sahoo / Michał Pierzchała 等 Callstack 团队主导
- **专为 RN 设计**：iOS / Android / Web（via react-native-web）三端统一 API
- **5 种 Navigator**：Native Stack / JS Stack / Bottom Tabs / Drawer / Material Top Tabs
- **类型安全**：v7 自动推导 navigation / route 类型，无需手动声明
- **Deep Linking 一等公民**：URI Scheme / Universal Link / Web URL 配置即用
- **Auth Flow 标配模式**：条件渲染不同 navigator，告别复杂权限守卫
- **State Persistence**：AsyncStorage 持久化导航状态，杀进程后回到原地
- **Static + Dynamic 双 API**：v7 起支持静态配置（类似 React Router）

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_React Navigation Getting Started_](https://reactnavigation.org/docs/getting-started)

</div>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] React Navigation 定位非常明确：React Native 平台的路由解决方案。

它和 React Router 名字相似，但其实是两个独立项目：
- React Router 服务于 Web（DOM / SSR / 文件路由），由 Remix 团队维护
- React Navigation 服务于 React Native（iOS / Android / RN Web），由 Callstack 团队维护

5 种 Navigator 覆盖了移动端 99% 的导航模式：
- Native Stack：调用原生 UINavigationController / Fragment，性能最好
- JS Stack：纯 JS 渲染，跨平台一致，可定制度高
- Bottom Tabs：底部 Tab 栏（iOS Tab Bar / Android Bottom Nav）
- Drawer：侧滑抽屉
- Material Top Tabs：顶部 Tab（Material Design 风格）

v7 在类型安全上做了巨大改进 —— 静态配置下 useNavigation / useRoute 完全自动推导，
不再需要手写 RootStackParamList 这类样板。
-->

---
transition: slide-up
level: 2
---

# 评价

成熟稳定、文档完备、生态健全，但 Native Stack vs JS Stack 选型仍是新手的常见坑

<v-clicks>

**优点**
- API 设计成熟，9 年沉淀，几乎覆盖所有移动端导航场景
- 5 种 Navigator 全面，原生 + JS 双轨可选
- Type-safe 类型推导优秀（v7 起自动化）
- 文档质量第一档，含完整 Auth Flow / Deep Linking 食谱
- Expo / 非 Expo 都能用，社区与官方文档充分
- 生态完整：drawer / tabs / native-stack / material-top-tabs 全官方维护
- v7 静态 API 让 SSR / 工具链友好度大幅提升

**缺点**
- Native Stack vs JS Stack 选型新人容易混淆
- 配置文件 + 多个 peer dep 让初次安装显复杂
- v6 → v7 有较多破坏性变更（navigate 行为变化、theme 必填 fonts）
- 与 React Router 同名导致 SEO 干扰，搜索时常出现误判
- Web 端支持有但不如原生流畅（推荐 Web 用 React Router）

</v-clicks>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---
transition: slide-up
---

# 定位与生态

React Navigation 在 React Native 路由版图里的位置

<v-clicks>

- **谁在做**：Callstack 团队（Satyajit Sahoo、Michał Pierzchała）+ 社区贡献者
- **历史脉络**：2017 v1 高阶组件 → 2020 v5 组件式 API 重写 → 2024.11 v7 发布
- **官方定位**：React Native 应用的「默认路由方案」，Expo Router 也基于它
- **核心理念**：导航即组件 —— navigator 是组件，screen 是组件，导航状态就是 React state
- **与 Expo Router 关系**：Expo Router 是基于 React Navigation 的 file-based 上层封装
- **与 React Router 区别**：React Router 服务 Web，React Navigation 服务 RN，无 API 重叠
- **与 wix/react-native-navigation 对比**：后者全原生，前者 JS + Native 混合，更灵活
- **学习路径**：装包 → 选 navigator → 配 routes → 类型化 → Deep Linking → Auth Flow

</v-clicks>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] React Navigation 由 Callstack 团队主导维护 —— Satyajit Sahoo 是 RN 生态的核心贡献者之一，
同时是 react-native-paper / react-native-builder-bob 的作者。

[click] 演进路线值得了解 ——
- v1-v4：createXxxNavigator(routeConfig) 高阶组件模式，类似 React Router v4 前的写法
- v5：完全重写为组件式 API（<Stack.Navigator>），与 React 现代风格对齐
- v6：API 稳定 + 内置 native-stack + 删除 v5 兼容层
- v7：静态配置 + 自动类型推导 + 屏幕预加载

[click] 与 Expo Router 关系特别重要 ——
Expo Router 不是 React Navigation 的「竞争对手」，而是它的「文件路由层」。
Expo Router 内部仍然是 React Navigation，只是把路由配置从代码挪到了文件系统。
-->

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 关键事件 |
|---|---|---|
| **v1.x** | 2017 | `StackNavigator()` HOC 时代首发 |
| **v3.x** | 2018 | 嵌套 navigator + 独立包发布 |
| **v4.x** | 2019 | createXxxNavigator 拆分到独立包 |
| **v5.x** | 2020 | 组件式 API 重写（`&lt;Stack.Navigator&gt;`）|
| **v6.x** | 2021.7 | 内置 native-stack + 文档大改 |
| **v6.x** 后期 | 2023 | TypeScript 增强、unmountOnBlur 等 |
| **v7.x** | 2024.11 | 静态 API、自动类型推导、屏幕预加载 |
| **v7.x** 当前 | 2025 | 修复 + middleware / preload 完善 |

<v-click>

v7 是过去 4 年里最大的一次 API 升级，引入了「静态配置」与「类型自动推导」两条新心智。

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
v5 是历史拐点 —— 从 HOC 风格切到组件式 API，与现代 React 写法接轨。
v6 在 v5 基础上把 native-stack 从社区包合并到官方，奠定「Native + JS 双 Stack」格局。
v7 是过去 4 年最大动作 —— 静态配置让 TypeScript 推导终于不再依赖手写 ParamList。
-->

---
transition: slide-up
---

# 与 React Router / Expo Router 对比

<v-click>

| 维度          | React Navigation 7    | Expo Router 4         | React Router v7       |
| ------------- | --------------------- | --------------------- | --------------------- |
| 平台          | **React Native**      | **React Native**      | Web (React)           |
| 路由配置      | 代码声明 navigator    | **文件即路由**        | 代码 + 文件均可       |
| 底层          | 自研                  | **基于 RN**           | Remix 合并版          |
| 类型安全      | v7 自动推导           | 自动 + ts-plugin      | `+types/` 生成        |
| Deep Linking  | 配置式 linking 对象   | 文件路径即 Deep Link  | 仅 Web URL            |
| SSR / SSG     | 弱（RN 主导）         | 部分（含 Web）        | **一等公民**          |
| 学习曲线      | 中（5 种 navigator）  | 低（写文件即可）      | 中等                  |
| 适用场景      | 通用 RN 应用          | Expo 项目首选         | Web 应用              |

</v-click>

<div v-click text-xs text-right>

如果用 Expo 推荐 Expo Router；如果非 Expo 或需自定义 navigator 复杂结构，用 React Navigation 直配。

</div>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三者关系一句话：

- React Router → Web 路由（React 生态）
- React Navigation → React Native 路由（核心库）
- Expo Router → 基于 React Navigation 的文件路由（Expo 推出的上层方案）

Expo Router 不是 React Navigation 的替代品，而是「写法更简洁的包装层」——
新建 app/users/[id].tsx，就自动生成一条 /users/:id 路由，
但底下跑的仍是 React Navigation 的 NavigationContainer + Stack.Navigator。

选型建议：
- 用 Expo + 喜欢文件路由 → Expo Router（最省心）
- 不用 Expo / 需要复杂自定义 navigator → 直接 React Navigation
- 纯 Web（含 RN Web）→ 用 React Router 而非 React Navigation
-->

---
transition: fade-out
---

# 安装与初始化

5 分钟接入任意 React Native 项目

<div class="grid grid-cols-2 gap-x-8">

<div>

<v-click>

**核心包 + 同级依赖**

```bash
# 1. 核心 + 通用 UI
npm install @react-navigation/native

# 2. RN peer deps
npm install react-native-screens \
  react-native-safe-area-context

# 3. 至少装一个 navigator
npm install @react-navigation/native-stack
```

| 包                         | 用途                |
| -------------------------- | ------------------- |
| `@react-navigation/native` | NavigationContainer |
| native-stack               | 原生平台 Stack      |
| bottom-tabs                | 底部 Tab            |
| drawer                     | 侧滑抽屉            |
| material-top-tabs          | Material 顶部 Tab   |

</v-click>

</div>

<div>

<v-click>

**入口配置**

```tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator }
  from "@react-navigation/native-stack";
import HomeScreen from "./screens/Home";
import DetailsScreen from "./screens/Details";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

</v-click>

</div>

</div>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 安装结构是「核心 + peer deps + 选 navigator」三步：

1. @react-navigation/native：所有 navigator 共用的 NavigationContainer / useNavigation 等
2. peer deps：react-native-screens（管理原生 view 栈）+ safe-area-context（避开刘海/底栏）
3. 按需装 navigator 包：Native Stack / Bottom Tabs / Drawer / Material Top Tabs

Expo 项目直接 npx expo install，会自动选兼容版本。
非 Expo 项目 npm install 后，iOS 需要 cd ios && pod install。

[click] 入口配置三个关键组件：
- NavigationContainer：整个导航树的根（必须在最外层，且全应用只能有一个）
- createNativeStackNavigator()：返回 Navigator + Screen 两个组件
- Screen 配置 name + component，name 就是后续 navigate 时用的标识
-->

---
transition: fade-out
---

# 5 种 Navigator 全景

每种适配不同的导航模式

<v-click>

| Navigator          | 包                                    | 视觉                | 典型场景               |
| ------------------ | ------------------------------------- | ------------------- | ---------------------- |
| **Native Stack**   | `@react-navigation/native-stack`      | 原生平台导航控制器  | 99% 应用首选           |
| **JS Stack**       | `@react-navigation/stack`             | RN 渲染的栈         | 高度定制动画 / 手势    |
| **Bottom Tabs**    | `@react-navigation/bottom-tabs`       | 底部 Tab 栏         | 主要 Tab 导航          |
| **Drawer**         | `@react-navigation/drawer`            | 侧滑抽屉            | 多模块切换 / 设置      |
| **Material Top Tabs** | `@react-navigation/material-top-tabs` | 顶部 Tab（可滑动）  | 分类内容 / Twitter Tab |

</v-click>

<v-click>

**典型组合模式**

```
NavigationContainer
└── BottomTabs (主框架)
    ├── Tab: HomeStack       → NativeStack (首页流程)
    ├── Tab: SearchStack     → NativeStack (搜索流程)
    ├── Tab: NotificationStack → NativeStack
    └── Tab: ProfileStack    → NativeStack + Drawer
```

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 五种 Navigator 都是独立 npm 包，按需安装：

- Native Stack：基于 react-native-screens，调用 iOS UINavigationController / Android Fragment
- JS Stack：纯 JS 实现，跨平台一致，自定义自由度高，性能略弱
- Bottom Tabs：底部 Tab，可换位（v7 起支持顶部/侧边）
- Drawer：侧滑抽屉，基于 Reanimated（v7 强制要求 Reanimated 2/3）
- Material Top Tabs：顶部 Tab，可滑动切换，常见于 Twitter / 微信钱包

[click] 实际项目几乎都是组合使用 ——
最外层是 Bottom Tabs（主框架），每个 Tab 内嵌一个 Native Stack（页面流程）。
某些 Tab 可能再嵌 Drawer 或 Material Top Tabs。

最深嵌套通常不超过 3 层，超过就要考虑用 Modal Stack 替代部分嵌套。
-->

---
transition: fade-out
---

# Native Stack vs JS Stack 选型

最常被问的选型问题

<v-click>

| 维度           | Native Stack                          | JS Stack                       |
| -------------- | ------------------------------------- | ------------------------------ |
| 渲染层         | 原生平台导航控制器                    | RN View + Reanimated           |
| 性能           | **极佳**（原生过渡）                  | 中等（JS 线程）                |
| 动画自定义     | 受限（平台默认 + 几个预设）           | **完全自由**                   |
| 手势返回       | 平台原生（iOS swipe）                 | 可配置                         |
| Header         | 平台原生外观                          | 完全 RN 自绘                   |
| Modal 行为     | 原生 modal 表现                       | 自定义                         |
| iOS Large Title| 原生支持                              | 不支持                         |
| Web 兼容       | 弱                                    | 较好                           |
| 包大小         | 略大（含 native-screens）             | 略小                           |

</v-click>

<v-click>

> 💡 **经验法则**：99% 的 RN 应用应该用 **Native Stack** —— 性能与原生体验都最好。
> 只有「需要深度自定义页面切换动画」时才用 JS Stack。

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Native Stack 与 JS Stack 是 React Navigation 最让新人困惑的设计 ——
两个都叫 Stack，名字相似但底层完全不同。

Native Stack（@react-navigation/native-stack）：
- 调用平台原生导航控制器（iOS UINavigationController / Android Fragment）
- 过渡动画走 60 fps 原生路径，永远不掉帧
- iOS 上能用 Large Title、Search Bar 等原生外观
- 缺点：动画自定义能力弱，只能用平台预设几种

JS Stack（@react-navigation/stack）：
- 完全 JS 实现，所有 View 都是 RN 组件
- 动画走 Reanimated，可以完全自定义（比如 3D 翻转、视差）
- 缺点：所有动画都跑在 JS 线程（或 UI 线程的 worklet 里），复杂场景容易掉帧

[click] 99% 的新项目用 Native Stack 就对了 ——
RN 应用追求「像原生 App 一样的体验」，Native Stack 是唯一选择。

只有以下情况才考虑 JS Stack：
- 需要完全自定义页面切换动画（如视差、3D）
- 需要支持很老的 RN 版本（< 0.66）
- 极简自定义 Header（不要平台默认外观）
-->

---
transition: fade-out
---

# NavigationContainer 顶层包装

整个导航树的根容器

<v-click>

```tsx
import { NavigationContainer } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import {
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

export default function App() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer
      theme={scheme === "dark" ? DarkTheme : DefaultTheme}
      onReady={() => console.log("Navigator ready")}
      onStateChange={(state) => analytics.track("navigation", state)}
      linking={{ prefixes: ["myapp://", "https://app.example.com"] }}
      fallback={<Loading />}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}
```

</v-click>

<v-click>

> 💡 **v7 重要变更**：自定义 theme 必须包含 `fonts` 属性。直接 spread `DefaultTheme` 最简单。

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NavigationContainer 是整个应用导航的根 ——
- 必须在所有 navigator 之外
- 整个应用只能有一个（嵌套 navigator 不需要额外的 NavigationContainer）
- 提供 theme / linking / onReady / onStateChange 等顶层配置

theme：颜色主题，传 DarkTheme 自动暗色，传 DefaultTheme 亮色。
v7 起 theme 必须包含 fonts 字段（之前只需要 colors），
所以自定义 theme 时推荐 spread DefaultTheme 再覆盖部分字段。

onReady：导航器渲染完成的回调，常用于关闭 splash screen。
v7 修复了 v6 onReady 触发时机不准的 bug。

onStateChange：每次导航状态变化触发，最常用于埋点上报。
拿到 state 后用 state.routes[state.index] 找到当前活跃的路由。

linking：Deep Linking 配置入口，下面专题讲。

fallback：linking 解析过程中显示的 loading（如 AsyncStorage 读取持久化状态时）。

[click] v6 → v7 升级最常踩的坑：自定义 theme 没加 fonts 字段，运行时报错。
-->

---
transition: fade-out
---

# 第一个 Stack Navigator

最小可运行示例

<v-click>

```tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Button } from "react-native";

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Details", { itemId: 42 })}
      />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  const { itemId } = route.params;
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Item ID: {itemId}</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 React Navigation 的「Hello World」——

关键概念：
- Stack：通过 createNativeStackNavigator() 返回的 { Navigator, Screen } 对
- name：Screen 的唯一标识，后续 navigate("Home") 用这个名字
- component：屏幕组件，会被传入 { navigation, route } 两个 prop
- initialRouteName：决定初始路由是哪个（不写默认第一个 Screen）

navigation prop 提供导航操作：
- navigate(name, params)：跳转到某个屏幕（智能行为）
- push(name, params)：永远新增栈帧
- goBack()：弹出当前栈
- replace(name, params)：替换当前栈帧

route prop 提供当前路由信息：
- route.name：当前路由名
- route.params：navigate 时传入的参数
- route.key：每次进入的唯一标识

这套 API 是 v5 之后的标准 —— 与 v4 之前的 HOC 差异较大，
看老教程时注意鉴别版本。
-->

---
transition: fade-out
---

# navigate / push / replace / goBack 区别

四个最常用的导航方法

<v-click>

**navigate：智能跳转（推荐）**

```tsx
// 如果栈里没有 Profile：push 新栈帧
// 如果栈里已有 Profile：直接切到那一帧（v7 不再 popTo，行为变化）
navigation.navigate("Profile", { userId: 42 });
```

</v-click>

<v-click>

**push：永远新增栈帧**

```tsx
// 即使栈里已有 Profile，仍然 push 一个新的
navigation.push("Profile", { userId: 42 });
// 栈深度：Home → Profile(1) → Profile(2)
```

</v-click>

<v-click>

**replace：替换当前栈帧**

```tsx
// 登录成功后跳首页，不让用户回退到登录页
navigation.replace("Home");
```

</v-click>

<v-click>

**goBack / popTo：弹出栈帧**

```tsx
navigation.goBack();             // 弹出 1 帧
navigation.popTo("Home");        // v7 新增：弹到指定屏幕
navigation.popToTop();           // 弹到栈底（保留首屏）
```

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] navigate 是最常用的方法 ——
v6 中 navigate 如果栈里已有同名路由，会自动 popTo 过去（弹出中间帧）。
v7 改变了这个行为：navigate 不再自动 popTo，而是 push 或切换。
如果想要老的 popTo 行为，要显式调用 navigation.popTo("Profile")。

[click] push 是「无脑新增栈帧」——
适合「商品详情 → 推荐商品 → 推荐商品」这种链式深入的场景。
每次 push 一个新的，goBack 时一层层返回。

[click] replace 用于「不希望用户回退到当前页」的场景：
- 登录成功 → 跳首页（回退不应该回登录页）
- 启动页 → 跳主界面（回退不应该回启动页）
- 表单完成 → 跳结果页（回退不应该回半完成的表单）

[click] popTo（v7 新增）补全了「弹到指定屏幕」的缺失 ——
之前要写一个 popX 次的循环。
popToTop 是常见操作，比如 Tab 切回原 Tab 时回到栈底。

注意：v7 的 navigate 行为变化是最大的破坏性改动之一，
v6 升级时要全局搜 navigate，确认是否需要改成 popTo。
-->

---
transition: fade-out
---

# 传参与接收

navigate 时传 params，screen 内通过 route.params 读取

<v-click>

**发送参数**

```tsx
navigation.navigate("Details", {
  itemId: 42,
  title: "React Navigation 7",
  fromHome: true,
});
```

</v-click>

<v-click>

**接收参数**

```tsx
function DetailsScreen({ route }) {
  const { itemId, title, fromHome } = route.params;
  return <Text>{title}</Text>;
}

// 或用 hook（推荐）
import { useRoute } from "@react-navigation/native";

function DetailsScreen() {
  const route = useRoute();
  const { itemId } = route.params;
  return <Text>{itemId}</Text>;
}
```

</v-click>

<v-click>

**设置默认参数**

```tsx
<Stack.Screen
  name="Details"
  component={DetailsScreen}
  initialParams={{ fromHome: false }}  // 没传 params 时的默认值
/>
```

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] params 是 React Navigation 的「跨屏幕传参」机制 ——
任何可序列化的值都能传，但官方强烈建议只传简单值（id、字符串、布尔），
复杂对象建议放 store（Redux / Zustand / Jotai）。

为什么？
- params 会被序列化到导航 state（用于 Deep Linking / 状态持久化）
- 复杂对象序列化后失去原型方法
- 大对象会导致 state.json 膨胀，影响性能与持久化

[click] 接收 params 有两种风格：
- 老风格：从 props 解构 route，常见于 class 组件
- Hook 风格：useRoute()，setup 体验更顺

useRoute 在嵌套组件里也能拿到 —— 不用一层层透传 props。

[click] initialParams 解决「screen 期望某些 params 但调用方没传」的问题 ——
比如 SettingsScreen 默认 tab="general"，
没传时 route.params.tab === "general"，避免 undefined。
-->

---
transition: fade-out
---

# 嵌套 Navigator 模式

底部 Tab + 每个 Tab 内嵌 Stack 是 RN 最常见的结构

<v-click>

**Tabs 套 Stack**

```tsx
const HomeStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Details" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="Profile" component={ProfileScreen} />
    </SettingsStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="HomeTab" component={HomeStackScreen} />
        <Tab.Screen name="SettingsTab" component={SettingsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 嵌套 navigator 的核心规则：

1. 整个应用只有一个 NavigationContainer（最外层）
2. 嵌套 navigator 不再需要额外 Container
3. 每个 navigator 独立维护自己的栈
4. 跨 navigator 跳转用「子 screen 路径」语法

跨 navigator 跳转示例：
```tsx
// 在 SettingsTab 里跳到 HomeTab 的 Details
navigation.navigate("HomeTab", {
  screen: "Details",
  params: { itemId: 42 },
});
```

v7 起这种「screen + params」的跨 navigator 写法是必须的 —— 
v6 时直接 navigate("Details") 在嵌套场景能找到，v7 移除了这种「猜测查找」。

实战中这种嵌套结构能很好地处理：
- 每个 Tab 有自己的栈历史（切回 Tab 保持原来的页面深度）
- 跨 Tab 跳转保留 Tab 状态
- 全局 Modal 通过 root Stack 覆盖所有 Tab
-->

---
transition: fade-out
---

# Type-safe routes（一）：声明 ParamList

让 TypeScript 知道每个屏幕需要什么参数

<v-click>

```tsx
// types/navigation.ts
export type RootStackParamList = {
  Home: undefined;                          // 无参数
  Details: { itemId: number; title?: string };
  Profile: { userId: string };
  Settings: { tab?: "general" | "privacy" };
};
```

</v-click>

<v-click>

```tsx
// 在 navigator 上声明
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

// 这样使用时 Stack.Screen name 会自动提示 + 校验
<Stack.Screen name="Home" component={HomeScreen} />
<Stack.Screen name="Details" component={DetailsScreen} />
```

</v-click>

<v-click>

**好处**

- `navigate("Detial")` 拼写错误编译期报错
- `navigate("Details", {})` 缺 itemId 编译期报错
- `route.params.itemId` 自动是 number 类型，不用断言

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] ParamList 是 React Navigation 类型系统的核心 ——
它是一个 type 映射：屏幕名 → 该屏幕期望的 params 类型。

约定：
- 不需要参数的 screen 写 `undefined`（注意是 type 不是 null）
- 可选参数用 `?`
- 字面量联合类型可以约束参数取值（如 tab 字段）

[click] 把这个 type 传给 createNativeStackNavigator 作为泛型 ——
之后 Stack.Screen 的 name、navigate 的第二参、route.params 都会用这个 type 约束。

实际项目里每个 navigator 都应该有对应的 ParamList：
- RootStackParamList
- HomeStackParamList
- SettingsStackParamList
- TabParamList

跨 navigator 类型组合通过 NestedNavigatorParams / CompositeScreenProps 实现。

[click] 这套类型化的收益巨大：
- 拼写错误编译期发现
- 参数缺失编译期发现
- 重构改 param 字段名 IDE 自动跟踪所有调用方
- IDE 自动补全所有可跳转的 screen 名
-->

---
transition: fade-out
---

# Type-safe routes（二）：v7 自动推导

v7 起静态配置可以省略 ParamList

<v-click>

**Static API 自动推导**

```tsx
import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Details: {
      screen: DetailsScreen,
      // 这里写默认 params 与 options
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

</v-click>

<v-click>

**Hook 不用写泛型，类型自动跟随**

```tsx
import { useNavigation, useRoute } from "@react-navigation/native";

function DetailsScreen() {
  const navigation = useNavigation();    // 自动推导为 RootStack
  const route = useRoute();              // 自动推导为 Details

  navigation.navigate("Home");           // 自动补全
  return <Text>{route.params.itemId}</Text>;
}
```

</v-click>

<v-click>

> 💡 **v7 杀手锏**：静态 API 让 ParamList 完全自动生成，TypeScript 体验直追 Expo Router / TanStack Router。

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v7 的最大新特性之一：Static API。

之前的 Dynamic API 要写 <Stack.Navigator><Stack.Screen /></Stack.Navigator> JSX；
Static API 直接传 screens 对象给 createNativeStackNavigator()，
然后 createStaticNavigation() 包一层。

好处不仅是 JSX 减少，更重要的是：
- TypeScript 直接从 screens 对象推导出 ParamList
- 不需要手写 RootStackParamList
- 不需要 declare global { namespace ReactNavigation }

[click] useNavigation / useRoute 不用传泛型 ——
之前要写 useNavigation<NativeStackNavigationProp<RootStackParamList>>()，
现在就 useNavigation()，类型完全自动。

[click] 这是 v7 让 React Navigation TypeScript 体验与 Expo Router / TanStack Router 看齐的关键 ——
之前 RN 路由库类型化最大痛点是「样板代码」，Static API 解决了。

注意：Static / Dynamic 两套 API 可以混用 ——
顶层用 Static，某个嵌套 navigator 可以用 Dynamic，反之亦然。
-->

---
transition: fade-out
---

# Deep Linking（一）：基础配置

通过 URL 唤起 App 到指定屏幕

<v-click>

```tsx
const linking = {
  prefixes: [
    "myapp://",                         // URI Scheme
    "https://app.example.com",          // Universal Link / App Link
  ],
  config: {
    screens: {
      Home: "",
      Details: "items/:itemId",         // myapp://items/42
      Profile: "users/:userId",
      Settings: {
        path: "settings",
        screens: {
          General: "general",
          Privacy: "privacy",
        },
      },
      NotFound: "*",                    // 兜底
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking} fallback={<Loading />}>
      <RootNavigator />
    </NavigationContainer>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Deep Linking 是 React Navigation 的杀手特性 —— 配置式而非命令式。

linking 对象两个核心字段：
- prefixes：能匹配的 URL 前缀（URI Scheme + Universal Link）
- config.screens：URL path 到 screen 的映射

URI Scheme 形如 myapp://、tiktok://，安装即生效，但用户没装时无能为力。
Universal Link / App Link 形如 https://app.example.com/items/42，
用户没装时 fallback 到网页，安装后系统自动唤起 App。

嵌套 screen 用嵌套 path：
- Settings: { path: 'settings', screens: { General: 'general' } }
- 对应 URL: myapp://settings/general

NotFound: '*' 是 catch-all 路径，匹配所有未声明的 URL，用于 404 处理。

fallback 是 linking 解析中（异步操作）显示的 loading 组件 —— 
推荐显示与启动页一致的图片，避免视觉跳动。
-->

---
transition: fade-out
---

# Deep Linking（二）：参数与原生配置

iOS / Android 需要额外的平台配置

<v-click>

**iOS：Info.plist 配 URL Scheme**

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>myapp</string>
    </array>
  </dict>
</array>
```

</v-click>

<v-click>

**Android：AndroidManifest.xml 配 intent-filter**

```xml
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="myapp" />
  <data android:scheme="https" android:host="app.example.com" />
</intent-filter>
```

</v-click>

<v-click>

**测试 Deep Link**

```bash
# iOS Simulator
xcrun simctl openurl booted "myapp://items/42"

# Android Emulator
adb shell am start -a android.intent.action.VIEW \
  -d "myapp://items/42"
```

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] iOS 的 URL Scheme 配置在 Info.plist 中 ——
Expo 项目可以在 app.json 的 ios.scheme 字段配置，自动写入 Info.plist。

Universal Link（不带 scheme）需要服务端配合 ——
在 https://app.example.com/.well-known/apple-app-site-association 上传 JSON，
声明 App 能处理哪些路径。

[click] Android 同时支持两种：
- URL Scheme：myapp://（任何 App 都能注册，可能冲突）
- App Link：https://...（带 autoVerify 后能独占）

App Link 同样需要 /.well-known/assetlinks.json 配合。

[click] 测试时不需要重新打包 ——
模拟器 / 真机用 xcrun simctl 或 adb shell 直接打开 URL 即可。

实战中建议：
- 开发时用 URI Scheme（简单快速）
- 上线前补 Universal Link / App Link（专业）
- 用 react-native-deep-linking-test 之类工具自动化测试

注意：deep link 拉起 App 时 state 不一定全部按 URL 还原，
config 里的嵌套结构必须与 navigator 完全一致才能精准还原栈。
-->

---
transition: fade-out
---

# Authentication Flow

条件渲染不同 navigator，告别复杂权限守卫

<v-click>

```tsx
import { useAuth } from "./auth";

export default function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Splash />;

  return (
    <NavigationContainer>
      {user ? <AuthenticatedStack /> : <UnauthenticatedStack />}
    </NavigationContainer>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function UnauthenticatedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}
```

</v-click>

<v-click>

> 💡 **核心心智**：登录状态切换 = 切换不同的 navigator 树，导航栈自动重置，无需守卫拦截。

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Authentication Flow 是 React Navigation 文档反复推荐的「正道」——
不写守卫（v4 时代的常见做法），而是在 NavigationContainer 内部根据登录状态条件渲染。

原理：
- 登录后 user 有值 → 渲染 AuthenticatedStack（包含 Home / Profile / Settings 等）
- 未登录 user 为 null → 渲染 UnauthenticatedStack（只有 Login / Signup）
- 切换时 React Navigation 自动重置栈，不需要 reset() 调用

这种模式的好处：
- 登录态变化时 UI 自动跟随（不用全局守卫）
- 未登录用户在物理上无法 navigate 到登录页之外的页面
- 代码逻辑直观，没有「守卫被跳过」的边界 bug
- 与 Redux / Zustand / Jotai 等 store 完美配合

[click] 这是 RN 路由的「条件渲染」思维 ——
不同于 Web 路由的「URL → 守卫 → 组件」管道，
React Navigation 把权限当作组件树的一部分，符合 React 心智。

实战中通常配合 SecureStore / Keychain 保存 token，
启动时读出 token → 调用 /me → set user state → 进入 AuthenticatedStack。
-->

---
transition: fade-out
---

# State Persistence

杀进程后回到原来的屏幕

<v-click>

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";

const PERSISTENCE_KEY = "NAVIGATION_STATE_V1";

export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    const restore = async () => {
      try {
        const saved = await AsyncStorage.getItem(PERSISTENCE_KEY);
        if (saved) setInitialState(JSON.parse(saved));
      } finally {
        setIsReady(true);
      }
    };
    restore();
  }, []);

  if (!isReady) return <Splash />;

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      <RootNavigator />
    </NavigationContainer>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] State Persistence 让用户「杀进程后回到原来位置」——
极大提升体验，特别是用户在深层级（比如商品详情 → 评论 → 用户主页）时。

原理：
- onStateChange 监听导航状态变化，写入 AsyncStorage
- 启动时从 AsyncStorage 读出 saved state，作为 initialState 传入
- React Navigation 把 state 还原成栈结构

关键约束：
- 只有可序列化的 params 才能持久化（函数 / class 实例不行）
- 跨版本的 navigator 结构变化可能让旧 state 解析失败，建议 key 带版本号
- 持久化的 state 可能包含敏感信息（params 里的 token），慎重选 storage

[click] 实战建议：
- 开发模式禁用持久化（reload 时永远进首屏，方便调试）
  if (__DEV__) setInitialState(undefined);
- 生产模式根据用户偏好（设置里给个开关）
- 关键页面避免持久化（密码输入、支付页等敏感场景）

[click] 与 Auth Flow 配合时要小心：
- 持久化的是「已登录后的栈」
- 未登录时 NavigationContainer 渲染的是 UnauthenticatedStack
- saved state 不会匹配 UnauthenticatedStack，会被忽略
- 这是符合直觉的行为（不会因恢复栈而绕过登录）
-->

---
transition: fade-out
---

# Modal Stack

用 presentation 模式实现模态弹层

<v-click>

```tsx
const RootStack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {/* 主栈（正常 push 行为） */}
        <RootStack.Group>
          <RootStack.Screen name="Home" component={HomeScreen} />
          <RootStack.Screen name="Details" component={DetailsScreen} />
        </RootStack.Group>

        {/* Modal 栈：从底部弹出 */}
        <RootStack.Group screenOptions={{ presentation: "modal" }}>
          <RootStack.Screen name="HelpModal" component={HelpModalScreen} />
          <RootStack.Screen name="CreatePost" component={CreatePostScreen} />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

// 触发 modal
navigation.navigate("CreatePost");
```

</v-click>

<v-click>

**Presentation 类型**

| 值                            | 表现                                |
| ----------------------------- | ----------------------------------- |
| `card`（默认）                | 从右侧滑入（iOS）/ 淡入（Android）  |
| `modal`                       | 从底部上滑                          |
| `transparentModal`            | 透明背景模态                        |
| `fullScreenModal` (iOS)       | 全屏 modal                          |
| `containedModal` (iOS 13+)    | iOS 系统 sheet 风格                 |

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Modal 在 React Navigation 里不是独立 API，而是 Stack Navigator 的一种 presentation 模式。

实现方式：
- 在 RootStack 里放普通 Group + Modal Group
- Modal Group 通过 screenOptions={{ presentation: 'modal' }} 配置
- navigate 到 modal screen 时自动以模态方式弹出
- goBack 时模态消失

[click] presentation 几个常用值：
- card：默认，平台原生滑动过渡
- modal：从底部上滑（iOS 13+ 是 sheet 风格）
- transparentModal：背景半透明，常用于「确认对话框」
- fullScreenModal（iOS 专属）：覆盖整个屏幕，包括状态栏
- containedModal（iOS 13+）：sheet 风格的 modal

注意：JS Stack（@react-navigation/stack）的 presentation 选项与 Native Stack 略有差异，
JS Stack 也支持 modal / transparentModal 但底层动画完全 JS 实现。

实战建议：
- 「新建 / 编辑」类操作 → modal
- 「确认 / 取消」类操作 → transparentModal
- 「全屏沉浸内容」（如视频播放） → fullScreenModal
- 「分享 / 设置」短交互 → containedModal（iOS sheet）

Group 还可以叠加 screenOptions，整组共享 options 不用每个 Screen 写一遍。
-->

---
transition: fade-out
---

# Headers + Header Buttons

平台原生 Header 与自定义按钮

<v-click>

**基础 Header 配置**

```tsx
<Stack.Screen
  name="Details"
  component={DetailsScreen}
  options={{
    title: "商品详情",
    headerStyle: { backgroundColor: "#FF6B6B" },
    headerTintColor: "#fff",
    headerTitleStyle: { fontWeight: "bold" },
    headerBackTitle: "返回",            // iOS 返回按钮文案
    headerShown: true,                  // false 隐藏
  }}
/>
```

</v-click>

<v-click>

**自定义 Header 按钮**

```tsx
<Stack.Screen
  name="Settings"
  component={SettingsScreen}
  options={({ navigation }) => ({
    headerRight: () => (
      <HeaderButton
        onPress={() => navigation.navigate("Help")}
      >
        Help
      </HeaderButton>
    ),
    headerLeft: () => (
      <HeaderButton onPress={() => navigation.goBack()}>
        Close
      </HeaderButton>
    ),
  })}
/>
```

</v-click>

<v-click>

**动态 Header（从组件内部设置）**

```tsx
function EditScreen({ navigation, route }) {
  const [title, setTitle] = useState(route.params.title);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title || "新文章",
      headerRight: () => <SaveButton onPress={save} />,
    });
  }, [navigation, title]);
}
```

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Header 是 Stack Navigator 的核心 UI 元素 —— 
Native Stack 走平台原生 Header（iOS Large Title / Android Toolbar），
JS Stack 完全 RN 自绘。

options 是 Screen 的配置入口：
- title：标题（默认从 name 派生）
- headerStyle：背景色等
- headerTintColor：返回按钮 + 标题颜色
- headerShown：false 隐藏整个 Header
- headerBackTitle：iOS 上返回按钮的文字（默认显示上一页 title）

[click] headerLeft / headerRight 接收一个返回 ReactNode 的函数 ——
不是直接传 JSX 而是函数，目的是延迟实例化（避免 Screen 渲染前就创建）。

v7 引入了 @react-navigation/elements 的 HeaderButton 组件 —— 
统一了 iOS / Android 的按钮外观，建议优先用它而非自己写 TouchableOpacity。

[click] 从组件内部动态设置 Header 用 navigation.setOptions ——
必须包在 useLayoutEffect（不是 useEffect）里，
否则 Header 会先渲染默认值再切换，造成视觉闪烁。

dependencies 数组要包含所有读到的变量（title 等），否则 Header 不会跟随更新。
-->

---
transition: fade-out
---

# useNavigation / useRoute / useFocusEffect

最常用的三个 hook

<v-click>

**useNavigation：拿 navigation 对象**

```tsx
import { useNavigation } from "@react-navigation/native";

function MyButton() {
  const navigation = useNavigation();
  return (
    <Button onPress={() => navigation.navigate("Profile")} />
  );
}
```

</v-click>

<v-click>

**useRoute：读当前路由信息**

```tsx
import { useRoute } from "@react-navigation/native";

function MyBreadcrumb() {
  const route = useRoute();
  return <Text>当前：{route.name}</Text>;
}
```

</v-click>

<v-click>

**useFocusEffect：屏幕获得焦点时执行**

```tsx
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

function ProfileScreen() {
  useFocusEffect(
    useCallback(() => {
      // 每次屏幕进入焦点时执行（首次 + Tab 切回 + 返回）
      refetchData();

      return () => {
        // 离开焦点时清理（订阅、计时器等）
        cancelRequest();
      };
    }, [])
  );
}
```

</v-click>

<v-click>

> 💡 **useFocusEffect vs useEffect**：useEffect 只在挂载 / 卸载时跑，useFocusEffect 在每次「焦点变化」跑（包括 Tab 切回时）。

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] useNavigation 是「在任意组件里拿 navigation 对象」的官方方式 ——
不需要从 props 一层层透传，子孙组件也能直接拿到。

v7 起 useNavigation 自动推导类型（Static API 下）。
Dynamic API 下需要 useNavigation<NativeStackNavigationProp<RootStackParamList>>。

[click] useRoute 类似但拿到的是 route 对象 ——
route.name / route.params / route.key 都能访问。

[click] useFocusEffect 是 React Navigation 独有 hook，与 useEffect 行为不同：

useEffect：
- 组件挂载时跑
- 组件卸载时清理
- Tab 切走 → 切回：组件不卸载，useEffect 不重跑

useFocusEffect：
- 屏幕「获得焦点」时跑
- 屏幕「失去焦点」时清理
- Tab 切走 → 切回：每次都重跑

典型场景：
- 数据刷新（Tab 切回时拉最新数据）
- Subscription（关注 socket 事件，离开时取消）
- 埋点（屏幕曝光统计）
- 退出确认（hasUnsavedChanges 检测）

注意：useFocusEffect 接收的 callback 必须用 useCallback 包裹 —— 
否则每次 render 都会重新订阅，性能损耗大。
-->

---
transition: fade-out
---

# Bottom Tabs 深入

底部 Tab 栏的完整配置

<v-click>

```tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: "home",
            Search: "search",
            Profile: "person",
          };
          return <Icon name={icons[route.name]} color={color} size={size} />;
        },
        tabBarActiveTintColor: "#FF6B6B",
        tabBarInactiveTintColor: "gray",
        tabBarPosition: "bottom",        // v7: 'bottom' | 'top' | 'left' | 'right'
        tabBarVariant: "uikit",          // v7: 'uikit' | 'material'
        animation: "fade",               // v7: Tab 切换动画
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{ tabBarBadge: 3 }}    // 角标
      />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Bottom Tabs 的核心配置项：

- tabBarIcon：函数式 icon 配置，接收 color / size / focused
  常用 react-native-vector-icons 或 @expo/vector-icons
- tabBarActiveTintColor / tabBarInactiveTintColor：激活/未激活颜色
- tabBarStyle：tab 栏样式（背景、边框等）
- tabBarBadge：角标数字（不限于数字，也可以是字符串）
- tabBarLabel：tab 文字（默认 = route name）

v7 新增能力：
- tabBarPosition：把 tab 放到顶部 / 左侧 / 右侧（iPad 横屏适配）
- tabBarVariant：uikit（iOS 风格）vs material（Material 风格）
- animation：切换 Tab 时的动画（'none' | 'fade' | 'shift'）

screenOptions 可以是函数 ({ route, navigation }) => options，
方便基于 route.name 给每个 tab 不同的图标。

实战中常见模式：
- 5 个 Tab 是上限（iOS HIG / Material 建议）
- 每个 Tab 包一个独立 Stack（保持各 Tab 历史栈）
- Tab 切换走 navigation.navigate("HomeTab")，不需要 tabBarOnPress
-->

---
transition: fade-out
---

# Drawer 深入

侧滑抽屉的核心配置

<v-click>

```tsx
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: "left",         // 'left' | 'right'
        drawerType: "front",            // 'front' | 'back' | 'slide' | 'permanent'
        drawerStyle: { width: 280 },
        overlayColor: "rgba(0,0,0,0.5)",
        swipeEdgeWidth: 20,
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

// 触发打开
navigation.openDrawer();
navigation.closeDrawer();
navigation.toggleDrawer();
```

</v-click>

<v-click>

> 💡 **v7 要求**：Drawer 必须配合 react-native-reanimated 2 或 3 使用。

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Drawer Navigator 用于侧滑抽屉式导航 —— 
在 Gmail / Reddit / Slack 等应用里常见，
适合「多模块切换 + 不需要 Tab 始终可见」的场景。

drawerType 四种：
- front：默认，抽屉浮在内容上方
- back：抽屉在内容后方，内容滑出来
- slide：抽屉与内容一起滑（类似 iOS 系统）
- permanent：抽屉常驻不可关闭（适合 iPad 横屏）

drawerContent 接受一个函数返回自定义抽屉 UI ——
默认抽屉用 DrawerItemList 渲染所有 Screen，
自定义时常加用户头像、退出按钮等。

v7 强制要求 Reanimated 2/3 ——
v6 时可以禁用 Reanimated 用 Animated，v7 移除了 fallback。
注意 react-native-reanimated 需要修改 babel.config.js + cd ios && pod install。

navigation.openDrawer / closeDrawer / toggleDrawer 是 Drawer Navigator 提供的方法 —— 
其他 Navigator 没有这些方法，跨 navigator 调用时要先找到 Drawer 的 navigation。

Tab + Drawer 混合时通常 Drawer 在外层，Tab 在内层 ——
反过来 Tab 在外 Drawer 在内的话，Tab 一直可见、Drawer 只对某个 Tab 生效，
这种结构罕见但 Slack 这类 App 用得到。
-->

---
transition: fade-out
---

# Material Top Tabs

顶部可滑动 Tab，Material Design 风格

<v-click>

```tsx
import { createMaterialTopTabNavigator }
  from "@react-navigation/material-top-tabs";

const TopTab = createMaterialTopTabNavigator();

function CategoryTabs() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#FF6B6B",
        tabBarIndicatorStyle: { backgroundColor: "#FF6B6B" },
        tabBarLabelStyle: { fontSize: 14 },
        tabBarScrollEnabled: true,         // 启用横向滚动（适合 Tab 数量多）
        swipeEnabled: true,                // 手势滑动切换
        lazy: true,                        // 懒加载未访问的 Tab
      }}
    >
      <TopTab.Screen name="推荐" component={RecommendList} />
      <TopTab.Screen name="热门" component={HotList} />
      <TopTab.Screen name="关注" component={FollowList} />
      <TopTab.Screen name="同城" component={LocalList} />
    </TopTab.Navigator>
  );
}
```

</v-click>

<v-click>

> 💡 **依赖**：Material Top Tabs 需要额外安装 `react-native-pager-view`（用于手势滑动）。

</v-click>

<v-click>

**典型场景**

- Twitter / X 的「为你 / 关注」顶部 Tab
- 微信钱包的「消费 / 转账 / 红包」分类
- 视频 App 的「推荐 / 热门 / 同城」频道
- 商品分类的子分类切换

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Material Top Tabs 与 Bottom Tabs 的核心差异：
- 位置：顶部 vs 底部
- 切换：手势滑动 vs 点击
- 视觉：Material 指示条 vs iOS 风格图标
- 适用：内容子分类 vs 主功能导航

tabBarScrollEnabled 让 Tab 横向滚动 —— 
适合 6+ 个 Tab 的场景（视频 App 频道）。
不开启时所有 Tab 平均分配宽度（4 个以下推荐）。

swipeEnabled 让用户手指左右滑动切换内容 —— 
这是 Material 风格的标志能力，Bottom Tabs 默认不开（不符合 iOS 习惯）。

lazy: true 让未访问的 Tab 不渲染 ——
默认是 false（所有 Tab 都立即渲染好）。
对内容重的 Tab（图片列表 / 视频列表）必开 lazy，否则首次进入慢。

[click] 必须额外装 react-native-pager-view ——
这是 Material Top Tabs 的底层翻页组件，
不像 Native Stack 已经在 native-screens 里包好。

[click] 实战中 Material Top Tabs 常嵌套在 Bottom Tab 的某个 Tab 内 —— 
比如「首页 Tab」内嵌「推荐 / 热门 / 关注」三个 Material Top Tab。
-->

---
transition: fade-out
---

# JS Stack 的高级动画

需要自定义页面切换时的逃生口

<v-click>

```tsx
import { createStackNavigator, TransitionPresets }
  from "@react-navigation/stack";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        // 内置预设
        ...TransitionPresets.ModalSlideFromBottomIOS,

        // 或完全自定义
        cardStyleInterpolator: ({ current, next, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
          overlayStyle: {
            opacity: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
            }),
          },
        }),
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Custom" component={CustomScreen} />
    </Stack.Navigator>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
JS Stack 的最大卖点：完全自定义页面切换动画。

TransitionPresets 提供常用预设：
- SlideFromRightIOS / SlideFromLeftIOS
- ModalSlideFromBottomIOS / ModalPresentationIOS
- FadeFromBottomAndroid / RevealFromBottomAndroid
- ScaleFromCenterAndroid
- DefaultTransition / BottomSheetAndroid

完全自定义用 cardStyleInterpolator：
- 接收 { current, next, layouts } 三个 animated 值
- 返回 { cardStyle, overlayStyle } 两个样式对象
- interpolate 把 0~1 进度映射到具体 transform / opacity

实战中常见自定义：
- 视差效果（前页轻微移出 + 新页全速进入）
- 缩放效果（前页缩小 + 新页放大进入）
- 翻页效果（3D 旋转）
- 自定义 modal（带回弹的弹簧动画）

注意：自定义动画跑在 JS 线程（除非用 Reanimated worklet），
复杂动画在低端 Android 上容易卡顿 —— 
如果只是平台默认风格，永远优先 Native Stack。

JS Stack 还提供 transitionSpec：
- 控制动画的 timing（duration / easing）
- 类似 CSS transition-duration / transition-timing-function
- 适合微调动画感觉
-->

---
transition: fade-out
---

# 屏幕预加载（v7 新特性）

提前渲染下一屏，切换时秒开

<v-click>

```tsx
import { useNavigation } from "@react-navigation/native";

function HomeScreen() {
  const navigation = useNavigation();

  // 鼠标悬停 / 滚动到推荐位时预加载
  const handleHoverProduct = (id) => {
    navigation.preload("ProductDetails", { id });
  };

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <Pressable
          onHoverIn={() => handleHoverProduct(item.id)}
          onPress={() => navigation.navigate("ProductDetails", { id: item.id })}
        >
          <ProductCard {...item} />
        </Pressable>
      )}
    />
  );
}
```

</v-click>

<v-click>

**工作原理**

- `navigation.preload(name, params)` 触发 screen 提前渲染
- 渲染在内存中完成，不立即显示
- 真实 navigate 时，已渲染的 screen 直接显示，无加载延迟
- 适合「用户可预测的下一步」场景

</v-click>

<v-click>

> 💡 **v7 限制**：预加载的 screen 必须能从当前位置 navigate 到。preload 后未 navigate 会被 GC 回收（不是无限缓存）。

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
preload 是 v7 引入的性能优化能力 —— 类似 Web 的 <link rel="preload">。

工作原理：
- React 在内存中渲染 screen 组件
- screen 内的 useEffect / 数据请求都已触发
- 真实 navigate 时直接挂到屏幕上，无白屏
- 用户感知：「秒开」效果

典型场景：
- 商品列表：滚动到某个商品时 preload 详情页
- Hover 卡片（Web / iPad 鼠标）：悬停时 preload
- 路径预测：用户大概率会去的下一页（结账流程的下一步）

注意事项：
- preload 不应过度 —— 太多 preload 占内存
- 应该有节流（throttle/debounce）—— 快速滚动不要每个商品都 preload
- 没用上的 preload 浪费请求 —— 优先 hover / 可见时触发，不要无脑 preload
- 服务端要支持 —— 数据请求多了一倍

useNavigation().preload 与 useLinkBuilder 配合可以做「web link 预取」——
RN Web 项目里把 mobile 经验带到 Web 端。
-->

---
transition: fade-out
---

# usePreventRemove

阻止用户离开当前屏幕（替代 beforeRemove）

<v-click>

```tsx
import { usePreventRemove } from "@react-navigation/native";
import { Alert } from "react-native";

function EditPostScreen({ navigation, route }) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 当 hasUnsavedChanges 为 true 时阻止离开
  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    Alert.alert(
      "丢弃修改？",
      "你有未保存的修改，确定离开吗？",
      [
        { text: "继续编辑", style: "cancel" },
        {
          text: "丢弃",
          style: "destructive",
          // 用户确认后手动 dispatch 原本被阻止的操作
          onPress: () => navigation.dispatch(data.action),
        },
      ]
    );
  });

  return (
    <View>
      <TextInput
        onChangeText={(text) => {
          setHasUnsavedChanges(true);
          setText(text);
        }}
      />
    </View>
  );
}
```

</v-click>

<v-click>

> 💡 **v7 推荐**：usePreventRemove 替代了 v6 的 `addListener('beforeRemove')`，更符合 React hooks 心智。

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
usePreventRemove 是 v7 推荐的「阻止离开」hook —— 
替代 v6 时代的 navigation.addListener('beforeRemove')。

工作原理：
- 第一个参数 hasUnsavedChanges：true 时阻止离开
- 第二个参数 callback：被阻止时调用，提供 data.action
- 用户确认离开后，调 navigation.dispatch(data.action) 重新执行原导航

典型场景：
- 表单未保存提醒
- 视频未上传完成提醒
- 离开支付页前确认

注意：
- usePreventRemove 只能阻止 React Navigation 内的导航（navigate / goBack）
- 物理返回键（Android）/ 手势返回（iOS）都能阻止
- 杀进程 / app 切到后台不能阻止 —— 需要单独用 AppState
- 阻止后的 data.action 是原始 NavigationAction 对象，dispatch 后行为完全一致

与 useFocusEffect 配合使用：
- useFocusEffect：监听焦点变化（用于刷新数据）
- usePreventRemove：监听离开尝试（用于提醒确认）
- 两者目标不同，不要混用

v7 还保留了 navigation.addListener('beforeRemove')，
但官方建议新代码用 usePreventRemove —— 类型更准、hook 写法更顺手。
-->

---
transition: fade-out
---

# Screen Layout（v7 新特性）

每个 screen 都可以包一层「布局」

<v-click>

```tsx
// 配置层
<Stack.Navigator
  screenLayout={({ children }) => (
    <ErrorBoundary fallback={<ErrorScreen />}>
      <Suspense fallback={<LoadingScreen />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )}
>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Details" component={DetailsScreen} />
</Stack.Navigator>
```

</v-click>

<v-click>

**或在单个 screen 上**

```tsx
<Stack.Screen
  name="ProtectedPage"
  component={ProtectedPage}
  options={{
    layout: ({ children }) => (
      <PermissionGuard>{children}</PermissionGuard>
    ),
  }}
/>
```

</v-click>

<v-click>

**典型应用**

- ErrorBoundary：捕获 screen 内部异常
- Suspense：等待异步加载
- Permission 守卫：包装权限检查
- Analytics：自动埋点曝光
- Theme Provider：每个 screen 独立 theme

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
screenLayout 与 layout 是 v7 引入的新 prop —— 
让每个 screen 都能包一层共享的「布局组件」。

之前要给所有 screen 加 ErrorBoundary，得手动在每个 screen 组件里 wrap，
或者用 HOC。screenLayout 让这件事一次配完。

navigator 的 screenLayout vs screen 的 layout：
- screenLayout：navigator 下所有 screen 共享
- layout：单个 screen 独享
- 都设置时 layout 在内层（先于 screenLayout 渲染）

与 React 19 / Suspense 配合特别好 ——
loader 用 use(promise) 抛出 Promise，
screenLayout 的 Suspense 接住 fallback 显示 loading。

实战中常见组合：
1. ErrorBoundary：catch 任何 screen 渲染错误
2. Suspense：等待 use(promise) / lazy 加载
3. Analytics provider：自动上报 screen view
4. Theme provider：单 screen 独立 theme（如 dark detail）
5. PermissionGuard：跳到无权限页（也可用 Auth Flow）

注意：screenLayout 在每次 screen 渲染时执行 ——
所以里面尽量是纯组件，不要做副作用。
-->

---
transition: fade-out
---

# 与 Expo Router 关系

Expo Router 是基于 React Navigation 的文件路由层

<v-click>

**Expo Router 文件结构**

```
app/
├── _layout.tsx              # 根 Stack
├── index.tsx                # /
├── (tabs)/                  # 分组（不影响 URL）
│   ├── _layout.tsx          # Tabs Navigator
│   ├── home.tsx             # /home
│   ├── search.tsx           # /search
│   └── profile.tsx          # /profile
├── posts/
│   └── [id].tsx             # /posts/:id
└── modal.tsx                # 全局 modal
```

</v-click>

<v-click>

**底层仍是 React Navigation**

```tsx
// _layout.tsx 编译后实际生成
<NavigationContainer>
  <Stack.Navigator>
    {/* Expo Router 自动生成 */}
  </Stack.Navigator>
</NavigationContainer>
```

</v-click>

<v-click>

**选型建议**

| 场景                            | 推荐                |
| ------------------------------- | ------------------- |
| 用 Expo + 喜欢文件路由          | **Expo Router**     |
| 不用 Expo / 需自定义 navigator  | React Navigation    |
| 已有 RN 项目升级                | React Navigation v7 |
| 需要 Web 渲染 + 文件路由        | Expo Router         |

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Expo Router 是 Expo 团队 2023 年推出的「文件即路由」方案 —— 
类似 Next.js 的 app router 但用于 React Native。

文件约定：
- app/ 目录下的文件自动映射为路由
- _layout.tsx 定义当前层级的 navigator
- (group)/ 用于分组但不影响 URL
- [param].tsx 动态参数
- [...slug].tsx catch-all

Expo Router 底层完全是 React Navigation —— 
所有 useNavigation / useRoute / linking 概念都通用。
只是路由配置从「写代码」变成「建文件」。

[click] 选型建议核心：
- 用 Expo 就用 Expo Router（最省心）
- 不用 Expo 或要复杂自定义 navigator → 直接 React Navigation
- 已有项目升级 → React Navigation（迁移成本最低）

Expo Router 的优势：
- 文件路由 + Deep Linking 自动一致
- TypeScript 端到端推导（与 React Router v7 类似）
- 内置 Web 支持（Expo 全平台一份代码）

但也有限制：
- 必须用 Expo 工具链（虽然可以 prebuild eject）
- 复杂嵌套结构在文件系统里表达较绕
- 老项目迁移成本不低
-->

---
transition: fade-out
---

# 生态对比：v.s. wix/react-native-navigation

另一个 RN 路由库的对比

<v-click>

| 维度              | React Navigation 7        | wix/react-native-navigation 7 |
| ----------------- | ------------------------- | ----------------------------- |
| 实现层            | JS + Native（混合）       | **完全原生**                  |
| 安装复杂度        | 较低（JS 配置即可）       | 较高（必须改原生工程）        |
| 自定义自由度      | **高**（JS 可改）         | 低（受平台 SDK 限制）         |
| 性能              | 中等（Native Stack 接近） | **最佳**                      |
| 跨平台一致        | 一致                      | 平台差异较大                  |
| 与 Expo           | 完美兼容                  | 不兼容                        |
| Web 支持          | 部分支持                  | 不支持                        |
| 维护              | Callstack 团队            | Wix 团队                      |
| 社区              | **巨大**                  | 较小                          |

</v-click>

<v-click>

> 💡 **结论**：99% 项目选 React Navigation。只有「极致追求原生性能 + 不用 Expo + 团队懂原生」时才考虑 wix/react-native-navigation。

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
wix/react-native-navigation 是 Wix 团队 2017 年推出的另一个 RN 路由方案 —— 
理念是「100% 原生导航」，不用 React 组件树管理导航状态。

它与 React Navigation 的最大差异：
- React Navigation：导航是 React 组件，setState 切换 screen
- wix/RNN：导航是原生 controller，JS 只是配置层

wix/RNN 的优势：
- 性能极佳（所有过渡都是原生）
- 不依赖 react-native-screens
- 内存占用较低（screen 由原生管理）

但也有重大限制：
- 必须修改原生工程（android/MainActivity.java、ios/AppDelegate.m）
- 与 Expo 不兼容（Expo managed 用不了，bare workflow 也很折腾）
- 自定义 UI 受平台 SDK 限制
- 调试不直观（导航状态在原生层）
- Web 完全不支持（没有 RN Web 适配）

[click] 实战建议：
- 99% 项目选 React Navigation
  - 文档好、社区大、Expo 兼容、Web 可用
  - Native Stack 模式下性能已经足够好
- 只在以下情况考虑 wix/RNN：
  - 大型 App 对性能极致追求
  - 团队有原生开发能力
  - 不用 Expo
  - 已经在用 wix/RNN（迁移成本高）

近年来随着 React Navigation 的 Native Stack 成熟，
wix/RNN 的「性能优势」差距缩小，市场份额持续下滑。
-->

---
transition: fade-out
---

# v6 → v7 迁移要点（一）

破坏性变更逐项核对

<v-click>

**1. navigate 行为变化**

```tsx
// v6: 如果栈里已有 Profile，会自动 popTo 回去
navigation.navigate("Profile");

// v7: 不再自动 popTo，行为变成 push 或切换
// 想要 popTo 行为：
navigation.popTo("Profile");
```

</v-click>

<v-click>

**2. 嵌套 navigator 跳转必须显式**

```tsx
// v6: navigate("Details") 能在嵌套场景找到
// v7: 必须显式
navigation.navigate("HomeTab", {
  screen: "Details",
  params: { id: 42 },
});
```

</v-click>

<v-click>

**3. theme 必须包含 fonts**

```tsx
// v6: 只需 colors
const theme = { colors: { ...DefaultTheme.colors, primary: 'red' } };

// v7: 必须含 fonts
const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: 'red' },
};
```

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
v7 是过去 4 年最大的破坏性升级 —— 必须读官方 migration guide 不能盲升。

[click] 1. navigate 行为变化是最容易踩坑的 —— 
v6 时 navigate("Profile") 会查找栈中是否已有 Profile，
有就 popTo 过去，没有就 push。
v7 移除了这个隐式 popTo —— 如果要 popTo 必须显式 popTo()。

迁移时全局搜 navigation.navigate，确认是否依赖了 popTo 行为。

[click] 2. 嵌套 navigator 跳转更严格 —— 
v6 时如果 SettingsTab 想跳到 HomeTab 的 Details，可以直接 navigate("Details")，
React Navigation 会全局搜 screen 名。
v7 不再支持这种「猜测查找」，必须 navigate("HomeTab", { screen: "Details" })。

迁移时关注 console warning，v7 会提示哪些调用属于 deprecated 用法。

[click] 3. theme 字段补全 —— 
v6 的 theme 只需要 colors 对象。
v7 要求 colors + fonts，方便统一字体管理。
直接 spread DefaultTheme 或 DarkTheme 是最快的修复方式。
-->

---
transition: fade-out
---

# v6 → v7 迁移要点（二）

继续核对其它变更

<v-click>

**4. Native Stack 需要 react-native-screens 4+**

```bash
npm install react-native-screens@^4.0.0
cd ios && pod install
```

</v-click>

<v-click>

**5. Drawer 强制要求 Reanimated 2/3**

```bash
npm install react-native-reanimated@^3.0.0
# 修改 babel.config.js 添加 'react-native-reanimated/plugin'
```

</v-click>

<v-click>

**6. unmountOnBlur 改名为 popToTopOnBlur**

```tsx
// v6
<Tab.Screen options={{ unmountOnBlur: true }} />

// v7
<Tab.Screen options={{ popToTopOnBlur: true }} />
```

</v-click>

<v-click>

**7. NavigationContainer.independent 改 NavigationIndependentTree**

```tsx
// v6
<NavigationContainer independent>...</NavigationContainer>

// v7
<NavigationIndependentTree>
  <NavigationContainer>...</NavigationContainer>
</NavigationIndependentTree>
```

</v-click>

<v-click>

**8. Material Bottom Tabs 迁出**

```tsx
// v6
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

// v7: 包已迁到 react-native-paper
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
```

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 4. react-native-screens 4+ 是 Native Stack 的依赖 —— 
3.x 不兼容 v7 的 API（多了一些 worklet）。
升级后 iOS 必须重新 pod install。

[click] 5. Drawer 强制 Reanimated 2/3 —— 
v6 时可以禁用 Reanimated，用 Animated 兜底。
v7 移除了 fallback，无 Reanimated 直接报错。

Reanimated 3 需要 babel plugin —— 
忘记加 plugin 会出现「reanimated v3 plugin not configured」错误。

[click] 6. unmountOnBlur 改名 popToTopOnBlur —— 
仅 Bottom Tabs / Material Top Tabs 受影响。
新名字更准确（Tab 切走时弹回栈底，而不是真的卸载组件）。

[click] 7. NavigationContainer.independent 拆出 —— 
之前 independent prop 控制「这是不是独立子树」，
v7 改成包一层 NavigationIndependentTree 组件，
语义更清晰，且避免与其他 prop 混淆。

[click] 8. Material Bottom Tabs 迁出 React Navigation —— 
现在是 react-native-paper 的子模块（@react-navigation/material-bottom-tabs 包被删除）。
v6 项目要么改用 Bottom Tabs（v7 的 tabBarVariant 支持 Material 风格），
要么装 react-native-paper 完整库（package 较大）。

完整 migration guide 见：
https://reactnavigation.org/docs/upgrading-from-6.x
官方有 8+ 条变更列表，老项目升级前必读。
-->

---
transition: fade-out
---

# 常见踩坑（一）：嵌套 navigator 找不到 screen

错误调用 navigate 跨树跳转

<v-click>

```tsx
// ❌ 错：v7 不支持跨 navigator 隐式查找
function HomeScreen({ navigation }) {
  // 当前在 HomeTab > Home
  // 想跳到 SettingsTab > Profile
  navigation.navigate("Profile");  // v7 报错：找不到 Profile
}
```

</v-click>

<v-click>

```tsx
// ✅ 对：显式声明嵌套结构
function HomeScreen({ navigation }) {
  navigation.navigate("SettingsTab", {
    screen: "Profile",
    params: { userId: 42 },
  });
}
```

</v-click>

<v-click>

```tsx
// ✅ 或：嵌套多层 navigator
navigation.navigate("Root", {
  screen: "SettingsTab",
  params: {
    screen: "Profile",
    params: { userId: 42 },
  },
});
```

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
跨 navigator 跳转是新人最常踩的坑 —— 
v6 时 React Navigation 会自动全局搜索 screen 名，
v7 移除了这个「魔法」，强制要求显式路径。

正确写法是 screen + params 嵌套：
- 一层嵌套：navigate("TabName", { screen: "ScreenInTab" })
- 多层嵌套：navigate("RootName", { screen: "TabName", params: { screen: "..." } })

这个变化的目的：
- 显式优于隐式 —— 看代码就知道跳到哪里
- 嵌套大型 App 时性能更好（不用全局搜）
- TypeScript 类型推导更准确

为了避免这种深嵌套：
- 把 modal screen 放到 RootStack 顶层（避免 TabStack 内嵌 modal）
- 用 navigation.getParent() 一层层向上找父 navigator
- 用 useNavigationState 拿到当前完整 state，再分析路径

如果实在要跨 navigator 操作，可以借助 useNavigationContainerRef ——
拿到 NavigationContainer 的 ref，在容器外触发导航。
-->

---
transition: fade-out
---

# 常见踩坑（二）：useFocusEffect 忘记 useCallback

性能杀手

<v-click>

```tsx
// ❌ 错：每次 render 都重新订阅
function ProfileScreen() {
  useFocusEffect(() => {
    const subscription = subscribeToData();
    return () => subscription.unsubscribe();
  });
  // 每次 render，useFocusEffect 重跑 effect，
  // 订阅 + 取消订阅，性能损耗大
}
```

</v-click>

<v-click>

```tsx
// ✅ 对：用 useCallback 稳定 effect 引用
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

function ProfileScreen() {
  useFocusEffect(
    useCallback(() => {
      const subscription = subscribeToData();
      return () => subscription.unsubscribe();
    }, [])  // 依赖数组：什么变化时重新订阅
  );
}
```

</v-click>

<v-click>

> 💡 **强制约定**：useFocusEffect 的 callback 必须用 useCallback 包裹 —— 
> 否则每次组件 render 都会触发新的订阅 + 清理，性能浪费极大。

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
useFocusEffect 的「必须 useCallback」是官方反复强调的规则。

原因：
- useFocusEffect 内部用 useEffect 监听 callback 变化
- 不包 useCallback 的话，每次 render callback 都是新函数引用
- React 认为「依赖变了」，触发新的 effect
- 每次 render = 取消订阅 + 重新订阅 = 性能浪费

正确做法：
- 用 useCallback 包裹 callback
- 依赖数组写「effect 内部读到的所有变量」
- 没有外部依赖时传 []

新手常见错误：
- 直接传 lambda：useFocusEffect(() => { ... })
- 把 useCallback 包错位置：useFocusEffect(useCallback(() => { ... }, []))
- 依赖数组漏写变量

ESLint 配 eslint-plugin-react-hooks 可以自动检测依赖数组问题 —— 
React Native 工程必装。

也可以用 useFocusEffect 的简化变体 useFocusVisible（社区方案）—— 
只返回布尔值，调用者自己写 useEffect，避免 useCallback 痛点。
但官方推荐还是 useFocusEffect + useCallback 组合。
-->

---
transition: fade-out
---

# 常见踩坑（三）：解构 navigation 失去类型

TypeScript 项目易遇

<v-click>

```tsx
// ❌ 错：解构后类型变弱
function MyScreen() {
  const { navigate } = useNavigation();  // navigate 类型变成 union
  navigate("Home");  // TS 不报错，但运行时可能错
}
```

</v-click>

<v-click>

```tsx
// ✅ 对：保留 navigation 完整引用
function MyScreen() {
  const navigation = useNavigation();
  navigation.navigate("Home");  // 类型完整，IDE 自动补全
}
```

</v-click>

<v-click>

**原理**

- `useNavigation()` 返回的对象是 union type（多个 navigator 类型的并集）
- 解构出 navigate 后 TS 退化为最宽松的类型
- 保留完整 navigation 对象 + 调用方法时，TS 能根据上下文收窄

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这个坑 TypeScript 项目特别容易踩 —— 
解构 navigation 对象会让类型推导失效，但又不会报错。

useNavigation 的返回值类型是个复杂联合：
- 默认是 NavigationProp<ReactNavigation.RootParamList>
- 不同 navigator 各自有不同的方法（push 只在 stack 上，openDrawer 只在 drawer 上）

直接调用 navigation.navigate("X") 时：
- TypeScript 能查 ParamList，自动校验 X 是合法路由
- 自动校验 params 类型
- 自动补全可跳转路由

解构 navigate 后：
- navigate 变量类型变成「所有可能的 navigate 函数」联合
- TS 失去上下文收窄能力
- 仍然类型安全（不会接受非法参数），但 IDE 体验差

建议：
- 永远不要解构 useNavigation 返回值
- 多次调用同一方法时，保留 navigation 对象更清晰
- 写工具函数时显式标注类型：
  function gotoProfile(navigation: NavigationProp<RootParamList>) { ... }
-->

---
transition: fade-out
---

# 常见踩坑（四）：在 Web 上 Stack 表现异常

React Navigation 不是 Web 路由

<v-click>

```tsx
// ❌ 错：直接在 React Native Web 项目上用 React Navigation
// Stack 行为：
// - 浏览器后退按钮 → 可能不工作
// - 刷新页面 → 回到首页（state 不持久化）
// - URL 与 screen 不同步
```

</v-click>

<v-click>

**Web 工作流的选择**

| 场景                            | 推荐                |
| ------------------------------- | ------------------- |
| 纯 Web 应用                     | **React Router**    |
| Web 是次要平台（RN 主）         | RN + linking 配置   |
| Web 是一等公民                  | **Expo Router**     |
| 已有 Web 想加 RN                | 分两个项目          |

</v-click>

<v-click>

> 💡 **核心心智**：React Navigation 服务移动端，Web 是「附赠能力」而非主要场景。Web 优先用 React Router 或 Expo Router。

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
React Navigation 对 Web 的支持是「能用但不优」—— 
它的核心抽象是「Stack / Tab / Drawer」这种移动端模式，
Web 上能用 react-native-web 渲染，但浏览器历史 / URL 同步等需要额外配置。

linking 对象能让 URL 与 screen 同步，但实践中常遇到：
- 后退按钮行为不一致
- 刷新页面后 state 丢失（需手动 persistence）
- 锚点跳转 / 滚动恢复不智能
- SEO meta 难以管理

[click] Web 选型建议：
- 纯 Web 应用：选 React Router（DOM 路由的事交给专门工具）
- Web 是次要平台（80% RN + 20% Web）：可以接受 React Navigation 的局限
- Web 一等公民（与 RN 同等重要）：考虑 Expo Router（专门为多平台设计）

Expo Router 在 Web 上的体验最好 —— 
它内部用 react-native-web 渲染，但额外做了 URL 同步、SSR 支持、SEO 等。
比裸的 React Navigation + react-native-web 体验好得多。

实战中很多团队选择「两个独立项目」——
RN 项目用 React Navigation（移动端体验最佳），
Web 项目用 React Router 或 Next.js（Web 体验最佳），
共享业务组件库。
-->

---
transition: fade-out
---

# 经验法则

<v-clicks>

- **99% 项目用 Native Stack** → 性能 + 原生体验最佳
- **优先 Static API（v7+）** → TypeScript 自动推导，无样板
- **Bottom Tabs 外 + Native Stack 内** → 移动端标准结构
- **每个 Tab 有自己的 Stack** → 保留各 Tab 历史栈
- **Auth Flow 用条件渲染** → 不写守卫，切换 navigator 子树
- **State Persistence + dev 模式禁用** → 生产体验好 + 开发顺畅
- **useFocusEffect 必须 useCallback** → 否则性能浪费
- **跨 navigator 必须显式 screen + params** → v7 移除了隐式查找
- **Modal 用 presentation: 'modal'** → 不是独立 API
- **永远不解构 navigation** → 保留类型推导能力
- **Drawer 配 Reanimated 2/3** → v7 强制要求
- **v6 升级跑完 8 项 migration checklist** → 一个都不能漏

</v-clicks>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
这是 React Navigation 项目里反复打磨的经验法则 —— 
新项目都遵循前 7 条，老项目升级关注后 5 条。

最容易踩的两个坑：
1. v6 → v7 的 navigate 行为变化（隐式 popTo 移除）
2. 跨 navigator 跳转必须显式 screen + params

记住这两条，能避开 80% 的迁移问题。
-->

---
transition: fade-out
---

# 不适合 React Navigation 的场景

<v-clicks>

- **纯 Web 应用** → 用 React Router（Web 一等公民）
- **极致原生性能 + 不用 Expo** → 考虑 wix/react-native-navigation
- **Expo 项目 + 喜欢文件路由** → Expo Router 更省心
- **导航极简（1-2 屏）** → React state + 显隐组件即可
- **多平台共享路由（Web + 移动）** → Expo Router 或分两个项目
- **需要 RSC 心智** → React Navigation 没有 RSC 概念
- **小程序 / Mini App** → 各家有自己的路由 API

</v-clicks>

<v-click>

> 经验：React Navigation 7 是「中型到大型 RN 应用」的最佳搭档 ——
> Native Stack 性能接近原生，社区与文档都是第一档。

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
不是「React Navigation 不好」，而是「特定场景有更合适的工具」。

纯 Web 项目用 React Router —— 
React Navigation 的 Web 支持是附赠能力，不如专门工具。

极致原生性能可以考虑 wix/RNN —— 
但要权衡：维护成本、Expo 兼容、跨平台一致性等。

Expo 项目优先 Expo Router —— 
文件路由 + URL 同步 + Web 适配都更自然，
底层仍是 React Navigation，知识可迁移。
-->

---
transition: fade-out
---

# 学习路径

```
入门（1-2 天）
├── 跑通 React Native + React Navigation 默认模板
├── 读完官方 Fundamentals 章节（前 8 节）
├── 写一个 Todo App：列表 / 详情 / 新建 三屏
└── 理解 NavigationContainer / Stack / navigate / params

进阶（3-5 天）
├── 5 种 Navigator 各实现一遍
├── TypeScript ParamList 完整类型化（或 Static API）
├── Auth Flow + State Persistence 实战
├── Modal Stack + presentation 模式
└── useFocusEffect + usePreventRemove 应用

实战（1-2 周）
├── 写一个完整 RN 应用：登录 + Tabs + Stack + Drawer
├── 配 Deep Linking（URI Scheme + Universal Link）
├── 接 Analytics（onStateChange + screenLayout）
└── 性能调优 + 屏幕预加载

延伸（持续）
├── 尝试 Expo Router（文件路由 + 多平台）
├── 跟进 React Navigation 8 路线图（middleware / RSC bridge）
├── 集成动画库（Reanimated / Moti / react-native-skia）
└── 微前端 / Web 适配等特殊场景
```

<v-click>

**官方资源**

- 文档：[reactnavigation.org](https://reactnavigation.org)
- GitHub：[github.com/react-navigation/react-navigation](https://github.com/react-navigation/react-navigation)
- 示例：[github.com/react-navigation/react-navigation/tree/main/example](https://github.com/react-navigation/react-navigation/tree/main/example)
- Expo Router：[docs.expo.dev/router/introduction](https://docs.expo.dev/router/introduction)

</v-click>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
React Navigation 学习曲线比 React Router / Vue Router 略陡 —— 
原因是 5 种 navigator + 移动端特有概念（Deep Linking / 平台差异 / Native vs JS Stack）。

入门阶段重点：
- 先把 Native Stack 玩明白（最常用）
- 体会「navigate + params」的传值模式
- 理解嵌套 navigator 的渲染规则

进阶阶段重点：
- TypeScript 类型化是大型项目的分水岭
- Auth Flow + State Persistence 是企业 App 标配
- 5 种 navigator 都过一遍才能选型自如

实战阶段：
- 完整 App = Tabs + Stack + Drawer + Modal 组合
- Deep Linking 必须配（推广 / 召回的关键）
- Analytics 不能漏（onStateChange + screenLayout 自动埋点）

延伸：
- Expo Router 是必学的下一步（文件路由 + Web 适配）
- React Navigation 8 路线图值得跟（middleware 等新概念）
- 动画库集成（Reanimated 是 RN 动画的事实标准）
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看

React Navigation — React Native 应用的路由标准

<div class="mt-8 text-lg">

**核心心智**

- 导航即组件 —— navigator 是组件，screen 是组件
- 5 种 Navigator 全覆盖 —— Native Stack / JS Stack / Bottom Tabs / Drawer / Material Top Tabs
- 99% 选 Native Stack —— 性能与原生体验最佳
- Auth Flow 用条件渲染 —— 切换 navigator 子树而非守卫
- v7 Static API + 自动类型推导 —— TypeScript 体验追平 Expo Router

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://reactnavigation.org/" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/react-navigation/react-navigation" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://reactnavigation.org/docs/getting-started" target="_blank" class="slidev-icon-btn">
    <carbon:play /> Quick Start
  </a>
</div>

<style>
h1 {
  background-color: #FF6B6B;
  background-image: linear-gradient(45deg, #FF6B6B 10%, #61DAFB 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：React Navigation 7 = React Native 路由标准答案 —— 
9 年沉淀 + 5 种 Navigator + Static API 类型推导 + 与 Expo Router 同源生态。

核心心智五条：
1. 导航即组件 —— navigator / screen 都是 React 组件，状态就是 React state
2. 5 种 Navigator 全覆盖 —— Native Stack / JS Stack / Bottom Tabs / Drawer / Material Top Tabs
3. 99% 项目选 Native Stack —— 性能接近原生，体验最佳
4. Auth Flow 用条件渲染 —— 切换 navigator 子树，不写守卫
5. v7 Static API + 自动类型推导 —— TypeScript 体验追平 Expo Router

下一步建议：
- 跟着 reactnavigation.org/docs/getting-started 跑一个完整示例
- 实战写一个 Tabs + Stack 嵌套的 App
- 接入 Deep Linking + State Persistence
- 评估是否升级到 Expo Router（文件路由 + Web 适配）

感谢观看！
-->
