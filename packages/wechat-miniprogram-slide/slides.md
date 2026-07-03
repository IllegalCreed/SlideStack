---
theme: seriph
background: https://cover.sli.dev
title: 微信小程序 深入浅出
info: |
  微信生态内的原生小程序框架 —— 双线程架构与 setData 命门。

  基于微信小程序（基础库 3.x）· 了解更多 [developers.weixin.qq.com](https://developers.weixin.qq.com/miniprogram/dev/framework/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 微信小程序

微信生态内的**原生小程序框架** · 双线程架构与 setData 命门

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://developers.weixin.qq.com/miniprogram/dev/framework/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
大家好，今天我们聊微信小程序 —— 它不是一个 npm 包，也不是独立 App，而是运行在微信客户端里的一套原生小程序框架，主打「无需安装、用完即走」。
-->

---
transition: fade-out
---

# 什么是微信小程序

一句话：微信 App 内的**原生小程序框架 + 运行平台**

<v-clicks>

- 用微信定制 DSL（**WXML/WXSS**）+ JS + JSON 编写，微信运行时承载
- **不是 npm 包、不是独立 App**；跑在微信客户端（iOS / 安卓 / PC / 鸿蒙）
- 核心体验：**无需安装、用完即走**，扫码 / 搜索 / 分享即达
- 是 **uni-app / Taro / mpvue** 等跨端框架的**编译目标底座**
- 懂原生机制（setData、双线程）＝ 懂这些框架编译产物的运行规律

</v-clicks>

<!--
它是中国移动生态里「超级 App 内应用层」的事实标准。对前端来说更关键的一点：uni-app、Taro 这些框架，最终都是把 Vue/React 编译成小程序四文件，所以理解原生机制就是理解它们的运行规律。
-->

---
transition: fade-out
---

# 四文件结构：职责分离

每个页面 / 组件由**四类文件**组成

<div grid="~ cols-2 gap-4">

<div>

| 后缀 | 类比 | 职责 |
| --- | --- | --- |
| `.wxml` | HTML | 结构（标签是**组件**） |
| `.wxss` | CSS | 样式，新增 `rpx` 单位 |
| `.js` | JS | 逻辑，Page / Component |
| `.json` | — | 配置，**纯 JSON 无注释** |

</div>

<div>

**全局文件**（根目录 3 个）

- `app.js` — 用 `App({})` 注册 + 全局生命周期
- `app.json` — 全局配置：`pages`（**首项为首页**）、`window`、`tabBar`、`subPackages`
- `app.wxss` — 全局样式
- 页面 json 可覆盖 `window`、声明组件引用

</div>

</div>

<!--
记住职责分离：结构、样式、逻辑、配置各一个文件。特别注意 json 是纯 JSON，不能写注释和逻辑；app.json 里 pages 数组的第一项就是小程序首页。
-->

---
transition: fade-out
---

# 双线程架构（核心）

逻辑层与渲染层**分离，跑在两个独立线程**

<v-clicks>

- **逻辑层 App Service**：跑开发者 JS，在 **JsCore** 线程（iOS = JavaScriptCore / 安卓 = V8 / 工具 = NW.js）
- 逻辑层**无 DOM / BOM**：没有 window、document；`eval` / `new Function` 被禁用
- **渲染层 View**：传统模式下每页一个 **WebView**，负责渲染 WXML / WXSS
- 两层通信**经微信 Native（JSBridge）中转**，且**异步、需跨线程序列化**
- 为什么：管控与安全（防 XSS / 恶意跳转），逻辑与渲染互不阻塞

</v-clicks>

<!--
这是小程序最核心的设计，也是面试高频。逻辑和渲染被拆到两个线程，中间靠微信 Native 的 JSBridge 转发，且是异步序列化的。这带来了安全和可控，代价就是下一页要讲的 setData 通信开销。
-->

---
transition: fade-out
---

# setData：跨线程通信的性能命门

唯一跨线程更新途径：逻辑层 → **JSBridge 序列化** → 渲染层重渲染

<v-clicks>

- **只放渲染相关数据进 `data`**：无关业务数据挂普通属性
- **降低调用频率**：合并连续 setData，避免毫秒级高频
- **减小单次数据量**：用 data path 局部更新
- **后台页面不 setData**：延到 `onShow` 再更新
- **高频局部封装成独立组件**：缩小重渲染范围

</v-clicks>

```js
this.setData({ 'array[2].message': 'newVal' }) // ✅ 只传变化路径
```

<!--
setData 是逻辑层和渲染层之间唯一的数据通道，它要把数据 JSON 序列化后跨线程传输。数据越大、频率越高越卡。五个优化原则里，最实用的是 data path 局部更新和降频。
-->

---
transition: fade-out
---

# 逻辑层：生命周期与路由

三大构造器注册小程序 / 页面 / 组件

<div grid="~ cols-2 gap-4">

<div>

**构造器与生命周期**

- `App({})` — `onLaunch` / `onShow` / `onHide`
- `Page({})` — `onLoad` → `onShow` → `onReady` → `onHide` → `onUnload`
- `Component({})` — `created` / `attached` / `ready` / `detached`
- `getApp()` 取实例，`getCurrentPages()` 取页面栈

</div>

<div>

**路由（页面栈）**

- `navigateTo` 压栈（**最多 10 层**）
- `redirectTo` 替换当前页
- `switchTab` 跳 tabBar 页
- `navigateBack` 出栈 / `reLaunch` 重开
- **tabBar 页必须在主包**

</div>

</div>

<!--
三大构造器分别注册小程序、页面、组件。页面生命周期的顺序要记牢：onLoad 只执行一次、拿路由参数，onReady 也只一次。路由方面注意页面栈最多 10 层，tabBar 页必须放主包且不能用 navigateTo 跳。
-->

---
transition: fade-out
---

# 视图层：WXML 与事件

数据绑定用 `双大括号`，列表条件用 `wx:` 指令

```html
<view wx:for="{{list}}" wx:key="id">{{ item.name }}</view>
<button bindtap="onTap" data-id="{{item.id}}">删除</button>
```

<div grid="~ cols-2 gap-4">

<div>

**渲染指令**

- `wx:for` + **`wx:key` 必填**（提升 diff）
- `wx:if / elif / else`（控制渲染）
- `hidden`（仅切显隐，频繁切换用它）

</div>

<div>

**事件系统**

- `bindtap` 冒泡 / `catchtap` 阻止冒泡
- 传参 `data-*` → `e.currentTarget.dataset`
- `target`（源）vs `currentTarget`（绑定者）

</div>

</div>

<!--
WXML 里最常考的：wx:for 一定要配 wx:key，否则列表 diff 性能差。事件方面，bind 会冒泡、catch 阻止冒泡，传参靠 data 短横线属性再从 dataset 里取。target 和 currentTarget 的区别也是高频题。
-->

---
transition: fade-out
---

# 自定义组件

用 `Component({})` 注册，使用方 JSON 里声明引入

<div grid="~ cols-2 gap-4">

<div>

**配置与生命周期**

- `properties` 对外属性（父传子）
- `data` / `methods` / `observers`（数据监听）
- `lifetimes`：`attached`（最常用）/ `ready` / `detached`
- 样式隔离 `styleIsolation`（默认隔离）

</div>

<div>

**通信与复用**

- 子→父：`this.triggerEvent('ev', detail)`，父 `bind:ev`
- 父调子：`this.selectComponent('#id')`
- `slot` 插槽（多插槽需开 `multipleSlots`）
- `behaviors`：类 mixin 抽取复用

</div>

</div>

<!--
自定义组件用 Component 注册，在使用方的 JSON 里声明引入。父传子用 properties，子传父用 triggerEvent 抛事件、父用 bind 监听。复用逻辑用 behaviors，类似 Vue 的 mixin。新一代组件框架是 glass-easel，配合 Skyline。
-->

---
transition: fade-out
---

# wx.* API：网络与存储

系统能力都挂在全局 `wx` 命名空间上

<div grid="~ cols-2 gap-4">

<div>

**网络** `wx.request`

- **必须 HTTPS** + 服务器域名**白名单**
- 域名需 **ICP 备案**，不能用 IP
- 超时默认 60s
- 并发：请求 / 上传 / 下载各 **10**，WebSocket 5

</div>

<div>

**存储** `wx.setStorage`

- 同步版 `wx.setStorageSync` / `getStorageSync`
- 单 key 约 **1MB**，单程序约 **10MB**
- 适合存登录态 token、少量缓存
- 大文件走云存储 / 文件系统

</div>

</div>

<!--
所有系统能力都在 wx 命名空间下。网络请求最大的坑是域名白名单：必须是 HTTPS、备案过的域名，开发时可以在工具里勾「不校验合法域名」跳过。存储适合放 token 这类小数据，注意单 key 和单程序的容量上限。
-->

---
transition: fade-out
---

# 登录：code2Session 四步

标准登录流程（高频考点）

<v-clicks>

- ① 小程序调 `wx.login()` 拿**临时凭证 code**（5 分钟一次性）
- ② 把 code 发给**开发者服务器**
- ③ 服务器用 code + AppID + AppSecret 调 `auth.code2Session`
- ④ 换回 `openid` / `session_key`（**严禁下发前端**）/ `unionid`，生成自定义登录态

</v-clicks>

<div v-click class="mt-4 text-sm">

**授权坑**：`getUserProfile` 已于 2022-10 回收（返回「微信用户」+ 灰头像）→ 改用「头像昵称填写能力」`open-type="chooseAvatar"` + 昵称 input

</div>

<!--
登录四步是最高频的考点：小程序拿 code，传给自己的服务器，服务器拿 code 去换 openid 和 session_key。特别强调 session_key 绝对不能下发到前端。授权方面，getUserProfile 在 2022 年 10 月被回收了，现在只能返回匿名信息，要真实头像昵称得用「头像昵称填写能力」让用户主动填。
-->

---
transition: fade-out
---

# 分包加载

突破主包体积、加快首屏（首屏只下主包）

<v-clicks>

- **体积**：主包 ≤ 2MB，单分包 ≤ 2MB，**总计 ≤ 20MB**
- `app.json` 里配 `subPackages`，声明 `root` / `pages`
- **tabBar 页必须在主包**；分包间**不能互相引用**（都能引主包）
- **预下载** `preloadRule`：进某页时后台预下分包
- **独立分包** `independent`：不下主包即可打开（活动页）
- **分包异步化**：`require(path, cb)` 跨分包异步引用

</v-clicks>

<!--
分包的动机是首屏只下载主包，加快启动。记住三个体积数字：主包 2MB、单分包 2MB、总共 20MB。进阶有三个特性：预下载让你提前拉分包，独立分包能脱离主包单独跑，分包异步化则绕过「分包间不能引用」的限制。
-->

---
transition: fade-out
---

# Skyline：新一代渲染引擎

微信自研，性能更接近原生（正式版起于**基础库 3.0**）

| 维度 | WebView（传统） | Skyline |
| --- | --- | --- |
| 渲染 | 每页一个 WebView | **独立渲染线程**布局合成 |
| 内存 | 每页一份 JS 引擎 | 页面共享，内存低 |
| 通信 | 有 JSBridge 开销 | 去掉框架层 JSBridge |

<div v-click class="mt-3 text-sm">

启用 `renderer: 'skyline'` + glass-easel｜新特性：**Worklet 动画**（替 WXS）、原生手势、共享元素｜**WXS 在 Skyline 下变异步**

</div>

<!--
Skyline 是微信自研的新渲染引擎，正式版从基础库 3.0 起。相比传统 WebView，它用独立渲染线程做布局合成，内存更低、去掉了框架层通信开销。启用要在 json 里配 renderer 为 skyline。迁移时最大的坑是 WXS 变成异步了，所以动画得改用 Worklet。
-->

---
transition: fade-out
---

# 云开发与微信支付

免自建服务器 + 标准支付调起

<div grid="~ cols-2 gap-4">

<div>

**云开发**（Serverless）

- `wx.cloud.init({ env })` 初始化
- **云数据库**：文档型，`db.collection().add()`
- **云存储**：带 CDN 的文件存储
- **云函数**：`wx.cloud.callFunction()`，天然鉴权

</div>

<div>

**微信支付** `wx.requestPayment`

- 后端**统一下单**拿 `prepay_id` + 签名
- 前端调起传 `package: 'prepay_id=x'`
- **v3 用 `signType: 'RSA'`**
- 结果以**后端异步回调**为准

</div>

</div>

<!--
云开发是微信加腾讯云的 Serverless 方案，不用自建服务器，前端直接调云数据库、云存储、云函数，而且天然鉴权。支付则是后端先统一下单拿 prepay_id 和签名，前端用 requestPayment 调起，注意 v3 版签名类型是 RSA，最终支付结果一定要以后端收到的异步回调为准。
-->

---
layout: center
class: text-center
---

# 选型总结

**要触达微信超级生态、主打用完即走** → 微信小程序

双线程架构 · setData 命门 · 分包提速 · Skyline 追原生

<div class="mt-8 text-sm opacity-75">

[官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/) · [云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html) · [Skyline](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/introduction.html)

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://developers.weixin.qq.com/miniprogram/dev/framework/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
一句话选型：如果你的产品要触达微信这个庞大的生态、主打即开即用，微信小程序就是绕不开的选择。理解它的双线程和 setData，就抓住了性能的关键。谢谢大家！
-->
