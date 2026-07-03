---
theme: seriph
background: https://cover.sli.dev
title: Capacitor 深入浅出
info: |
  把任意 Web 应用打包成 iOS / Android / PWA 原生 App 的现代原生运行时。

  基于 Capacitor 8 · 了解更多 [capacitorjs.com](https://capacitorjs.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Capacitor

把任意 **Web 应用**打包成 iOS / Android / PWA 原生 App（基于 v8）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://capacitorjs.com/" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好，今天聊 Capacitor —— Ionic 团队出品的现代原生运行时，把任意框架写的 Web 应用，打包成 iOS、Android 乃至 PWA 的原生 App。
-->

---
transition: fade-out
---

# 什么是 Capacitor

一句话：**cross-platform native runtime for web apps**

<v-clicks>

- 用系统 **WebView** 承载 Web 构建产物，再经**原生桥**调设备能力
- **一次编写，多端原生**：同套 Web 代码 → iOS + Android + PWA
- **框架无关**：React / Vue / Angular / Svelte / 原生 JS 都行
- **Web Native 理念**：Web 为主体，但保留对原生 SDK 的完整访问
- **Ionic 团队**出品、开源，官方自称 the modern Cordova successor

</v-clicks>

<!--
Capacitor 的本质是一个原生容器加原生桥：系统 WebView 跑你的 Web 应用，需要相机、定位这些能力时，通过插件桥接到原生。它不绑定任何前端框架，只要你能构建出静态 Web 资产。
-->

---
transition: fade-out
---

# vs Cordova：现代继任者

精神相同（WebView + 暴露原生能力），架构彻底现代化

| 维度 | Cordova（旧） | Capacitor（新） |
| --- | --- | --- |
| 原生工程 | 构建产物，不入库 | **源码，签入 Git** |
| 配置 | 全局 `config.xml` | **无 config.xml**，直改原生文件 |
| 插件安装 | 拷源码进工程 | **依赖式**（Pods / Gradle） |
| 插件 JS 注册 | 需等 `deviceready` | **自动注册，无需 deviceready** |
| CLI | 全局安装 | **本地** `npx cap`，随项目锁版本 |

<!--
两者精神相同，都是 WebView 加暴露原生能力。但 Cordova 把原生当黑盒产物、用 config.xml 抽象、把插件源码拷进工程；Capacitor 把原生当源码工程、直接改原生文件、以依赖方式装插件，而且不再需要 deviceready 事件。
-->

---
transition: fade-out
---

# vs Ionic：运行时 vs 可选 UI

**正交关系**——官方原文：Capacitor 不需要 Ionic 也能建 App

<div grid="~ cols-2 gap-4">

<div>

**Capacitor = 原生运行时层**

- 设备能力访问、原生桥
- 原生工程管理、打包发布
- 任意框架、任意 UI 库都能配

</div>

<div>

**Ionic = 可选 UI 组件库**

- 一套移动端 UI 组件（纯前端）
- 帮你更快做出精致界面
- 用它可 `ionic cap`，否则 `npx cap`

</div>

</div>

<div v-click class="mt-4 text-sm">

二者**互补但独立**：很多团队只用 Capacitor 不用 Ionic，底层原生能力完全一致

</div>

<!--
这是高频考点：Capacitor 和 Ionic 是正交的。Capacitor 是原生运行时层，管设备能力和打包；Ionic 只是一套可选的移动端 UI 组件库。你完全可以只用 Capacitor 配自研 UI 或任意 UI 库。
-->

---
transition: fade-out
---

# 架构：WebView + 原生桥

Web 层跑在 WebView，经桥调原生

```txt
 Web App（任意框架产物）→ 系统 WebView
        │  Capacitor Bridge（JS ⇄ Native）
 原生运行时 + 插件（Swift / Kotlin）
        │  调用平台原生 SDK
   ios/（源码）        android/（源码）
```

<v-clicks>

- **WebView**：iOS = WKWebView，Android = 系统 WebView（Chrome 60+）
- Web 资产从本地 `webDir` 加载（`capacitor://` / `https://`），非远程
- **桥**：JS 调用 → 原生方法 → 回传 Promise / 事件，JS hooks 自动生成

</v-clicks>

<!--
架构分三层：最上面是你的 Web 应用跑在系统 WebView 里；中间是 Capacitor 桥，负责 JS 和原生的双向通信；下面是原生运行时和插件，最终调用平台 SDK。注意 Web 资产是从本地 webDir 加载的，不是远程页面。
-->

---
transition: fade-out
---

# 原生工程是源码（vs Expo CNG）

`cap add` 生成的 `ios/` `android/` 是**你的源码**

<v-clicks>

- `npx cap add ios/android` → 标准原生工程目录，**签入版本库**
- 直接用 **Xcode / Android Studio** 打开编辑，随时写原生代码
- iOS：`ios/App/App.xcworkspace`（CocoaPods）；Android：标准 Gradle 工程
- **与 Expo CNG 相反**：CNG 把原生当按需生成的产物、不入库；Capacitor 让你**拥有并直接改**

</v-clicks>

<div v-click class="mt-4 text-sm">

加原生能力两条路：**原生工程里直接写**，或**做自定义插件**（`registerPlugin`）

</div>

<!--
这是和 Expo 最大的分野。Expo 的 CNG 是持续原生生成，原生目录是产物、进 gitignore，配置才是真源。Capacitor 反过来，原生工程就是源码、签入 Git，你可以直接用原生 IDE 改它。
-->

---
transition: fade-out
---

# 插件体系：三类插件

原生能力都经插件桥接

<div grid="~ cols-2 gap-4">

<div>

**三类来源**

- **官方** `@capacitor/*`：团队维护、高频能力
- **社区** `@capacitor-community/*`：如 sqlite
- **Cordova**：经兼容层复用旧插件

</div>

<div>

**官方插件节选**

- Camera · Geolocation · Filesystem
- Preferences（键值存储）
- Push / Local Notifications
- Device · Network · Share · Haptics

</div>

</div>

<div v-click class="mt-3 text-sm">

自写插件：JS 接口 + 原生实现（iOS 宏 / Android 注解），`registerPlugin` 注册、可挂 web 降级

</div>

<!--
插件分三类：官方的 at-capacitor 斜杠星，社区维护的，以及经兼容层复用的 Cordova 插件。官方插件覆盖了相机、定位、文件系统、键值存储、推送这些高频能力。要自己写插件，就是 JS 接口加原生实现，用 registerPlugin 注册。
-->

---
transition: fade-out
---

# 用插件：Camera 示例

装包 → sync → 调 API

```ts
import { Camera, CameraResultType } from '@capacitor/camera'

const photo = await Camera.getPhoto({
  quality: 90,
  resultType: CameraResultType.Uri, // Uri / Base64 / DataUrl
})
imageEl.src = photo.webPath // WebView 可直接渲染的路径
```

<v-clicks>

- 装：`npm i @capacitor/camera` → `npx cap sync`
- 权限**写在原生文件**：iOS `Info.plist`、Android `AndroidManifest.xml`
- v8.1.0 起新 API `takePhoto` / `chooseFromGallery`（`getPhoto` 仍可用）

</v-clicks>

<!--
用插件三步：装包、sync、调 API。这里用最经典的 getPhoto 拍照。注意权限声明写在原生文件里，这正体现了无抽象层的哲学。另外 v8.1.0 引入了新的 takePhoto 和 chooseFromGallery API，老的 getPhoto 仍然可用。
-->

---
transition: fade-out
---

# 工作流：先构建 Web，再同步

铁律：Capacitor **只搬产物，不构建 Web**

```bash
npm run build      # 1) 前端框架构建 → 产出到 webDir
npx cap sync       # 2) 拷 Web 产物 + 更新原生依赖
npx cap open ios   # 3) 打开 Xcode / Android Studio
npx cap run ios    # 或直接跑真机 / 模拟器（debug）
```

<v-clicks>

- **`webDir` 是命门**：指向含 `index.html` 的产物目录，错则找不到资产
- 必须**先 build 再 copy/sync**，否则搬的是旧产物
- 出包：`npx cap build android` 签名 AAB / APK / IPA 交商店

</v-clicks>

<!--
日常循环的核心铁律：Capacitor 不负责构建你的 Web，它只搬构建产物。所以顺序永远是先 npm run build 产出到 webDir，再 cap sync 同步进原生工程。webDir 指错就会报找不到 Web 资产。
-->

---
transition: fade-out
---

# copy vs update vs sync（高频考点）

sync = copy + update

| 命令 | 做什么 | 何时用 |
| --- | --- | --- |
| `cap copy` | 搬 **webDir 产物 + 配置**进原生 | 改了 Web 代码 / 配置后（快） |
| `cap update` | 更新**原生插件与依赖**（Pods / Gradle） | 装 / 删 / 升级插件后 |
| `cap sync` | **= copy + update**（先 copy 再 update） | 一把梭 / 拉取他人改动后 |

<div v-click class="mt-4">

记忆：**copy = 搬 Web 资产；update = 装原生依赖；sync = 两者合一**

</div>

<!--
这是最高频的考点。copy 只搬 Web 构建产物和配置，最快，日常改 Web 代码用它；update 只更新原生插件依赖，装删插件后用；sync 就是先 copy 再 update，一把梭。记住这个口诀就行。
-->

---
transition: fade-out
---

# Live Reload：热重载到真机

让 WebView **从开发服务器加载**，改码即时刷新、免重打包

<div grid="~ cols-2 gap-4">

<div>

**推荐（Ionic CLI）**

```bash
ionic cap run android \
  -l --external
```

自动写 / 清 server 配置

</div>

<div>

**手动（Capacitor CLI）**

```json
{ "server": {
  "url": "http://192.168.1.68:8100",
  "cleartext": true
} }
```

dev server 绑 `0.0.0.0`

</div>

</div>

<div v-click class="mt-3 text-sm">

前提：手机与电脑**同一 Wi-Fi**、可经局域网 IP 互访

</div>

<!--
Live Reload 的原理是让 WebView 不再加载本地 webDir，而是指向你的开发服务器，这样改 Web 代码就即时刷新，不用重打原生包。推荐用 Ionic CLI 一条命令搞定；也可以手动在 config 里配 server.url 指向本机局域网 IP。前提是手机和电脑在同一 Wi-Fi。
-->

---
transition: fade-out
---

# 性能取舍：WebView 渲染的含义

UI 由 WebView 渲染，非原生控件

<v-clicks>

- 复杂动画 / 超长列表 / 高帧率交互**不及纯原生或 RN 的原生视图**
- 重计算走 **JS 线程**，需留意阻塞
- 但业务型 App（表单 / 列表 / CRUD / 内容）**体验足够**，WebView 逐年提升
- 极致原生性能的局部，可写**自定义原生插件 / 原生视图**补足
- 对比：Capacitor 走 **WebView 渲染**；RN / Flutter 走**原生 / 自绘渲染**

</v-clicks>

<!--
性能取舍是必考点。因为 UI 是 WebView 渲染的，不是原生控件，所以复杂动画、超长列表这类场景比不上纯原生或 React Native。但对绝大多数业务型 App，体验完全够用，而且需要极致性能的局部还能写原生插件补。这就是 WebView 渲染路线和 RN、Flutter 原生渲染路线的根本区别。
-->

---
layout: center
class: text-center
---

# 选型总结

**已有 Web 技术栈、想复用同一套代码上多端** → Capacitor

现代 Cordova 继任者 · 框架无关 · 原生工程即源码 · Web/PWA 一等公民

<div class="mt-8 text-sm opacity-75">

Capacitor 8（core 8.4.1）· Node 22+ / Xcode 26+ / iOS 15+ / Android minSdk 24

</div>

<div class="mt-4 text-sm opacity-75">

[官方文档](https://capacitorjs.com/) · [插件 API](https://capacitorjs.com/docs/apis) · [Ionic](https://ionicframework.com/)

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://capacitorjs.com/" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
一句话选型：如果你团队已经是 Web 技术栈，想复用同一套代码同时上 iOS、Android 和 Web，又能接受 WebView 渲染，Capacitor 就是很顺手的选择。它是现代的 Cordova 继任者，框架无关，原生工程就是你的源码。谢谢大家！
-->
