---
theme: seriph
background: https://cover.sli.dev
title: QQ 小程序 深入浅出
info: |
  腾讯 QQ 客户端内的小程序平台，与微信小程序高度同源。

  基于基础库 v1.60.0（2022）· 了解更多 [q.qq.com/wiki](https://q.qq.com/wiki/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# QQ 小程序

腾讯 QQ 内的小程序平台，与微信小程序**高度同源**（基于基础库 v1.60.0）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://q.qq.com/wiki/" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 QQ 小程序。一句话：它是微信小程序的「近亲分支」——框架、组件、API 形态几乎一一对应，主要差异只在前缀命名和登录态体系。但要提前说明：这个平台目前基础库已冻结在 2022 年、生态明显边缘化，我们更多是把它当作理解「微信小程序同源分支」的案例来讲。
-->

---
transition: fade-out
---

# 什么是 QQ 小程序

一句话：跑在**手机 QQ 客户端内**的小程序，与微信同构

<v-clicks>

- 归属**腾讯 QQ 开放平台**（q.qq.com），轻应用，用户免下载即用
- 架构同微信：**视图层（View）+ 逻辑层（App Service）**，响应式数据绑定
- 逻辑层改数据 → 视图自动更新，心智与微信完全一致
- **2019-07-23** 开放注册，有独立开发者工具（可直接打开微信工程）
- 现状：基础库**冻结在 v1.60.0（2022）**、生态边缘化（末页详述）

</v-clicks>

<!--
QQ 小程序运行在手机 QQ 里，免安装即用。架构和微信同构：分视图层和逻辑层，逻辑层改数据视图自动刷新。2019 年 7 月开放注册。最后一点先埋个伏笔——基础库停在 2022 年，末页会展开讲现状。
-->

---
transition: fade-out
---

# 与微信高度同源

会微信小程序，就已经会了 QQ 小程序的大半

<div grid="~ cols-2 gap-4">

<div>

```js
// App / Page 注册与微信完全相同
App({ onLaunch() {}, globalData: {} })

Page({
  data: { name: 'QQ' },
  onLoad() {}, onShow() {},
  tap() { this.setData({ name: 'MINA' }) },
})
```

</div>

<div>

- 逻辑注册 **`App()` / `Page()` / `Component()`** 一致
- 生命周期 `onLoad / onReady / onShow / onHide / onUnload` 同名
- **`setData`** 改数据触发视图刷新，`getApp()` 取实例
- 事件 **`bindtap` / `catchtap`**（catch 阻止冒泡）同名
- 组件同名同结构（view/text/button…），`.js` / `.json` 与微信一致

</div>

</div>

<!--
这页是重点：QQ 小程序的逻辑层和微信几乎逐行对应。App、Page、Component 三个注册函数一样，生命周期钩子名一样，setData 一样，事件绑定 bindtap、catchtap 也一样。所以微信开发者上手 QQ 几乎零成本。
-->

---
transition: fade-out
---

# 差异一：只是「换前缀」

同源之上，主要差异是命名前缀与文件后缀

<div grid="~ cols-2 gap-4">

<div>

| 维度 | 微信 | QQ |
| --- | --- | --- |
| 视图 | WXML | **QML** `.qml` |
| 样式 | WXSS | **QSS** `.qss` |
| 列表 | `wx:for` | **`qq:for`** |
| 条件 | `wx:if` | **`qq:if`** |
| API | `wx.*` | **`qq.*`** |

</div>

<div>

```qml
<view qq:for="{{list}}" qq:key="id">
  {{item.name}}
</view>
<view qq:if="{{ok}}">Y</view>
<view qq:else>N</view>
```

- 页面四件套同名：`.js` / `.qml` / `.json` / `.qss`
- QML **兼容 WXML**、QSS **兼容 WXSS**（迁移友好）

</div>

</div>

<!--
差异其实很表层。视图语言微信叫 WXML，QQ 叫 QML、后缀 .qml；样式微信 WXSS，QQ 叫 QSS。指令就是把 wx 前缀换成 qq：wx:for 变 qq:for，wx:if 变 qq:if；API 命名空间 wx. 换成 qq.。关键是 QML 同时兼容 WXML 写法，迁移很友好。
-->

---
transition: fade-out
---

# 差异二：独立登录态

流程与微信一致，但账号体系**互不相通**

```js
qq.login({
  success(res) {
    // res.code：临时登录凭证，5 分钟有效
    // 送到开发者服务器换 openid / session_key
  },
})
```

<v-clicks>

- 服务端用 code 调 **`code2Session`**（QQ 的 `api.q.qq.com` 域接口）
- 拿到的 **openid / session_key 属 QQ 体系**，与微信不互通
- `qq.checkSession()` 校验登录态，过期则重新 `qq.login()`
- 安全：`api.q.qq.com` **不能配为服务器域名**，只能服务端调

</v-clicks>

<!--
登录是另一个主要差异。流程和微信一模一样：客户端 qq.login 拿到 code，五分钟有效，送到你的服务器换 openid 和 session_key。差别在于——这套登录态完全独立于微信，openid 是 QQ 体系的，两边不通用。服务端换取走 QQ 的 code2Session 接口。注意 api.q.qq.com 不能配成小程序的服务器域名，只能在后端调。
-->

---
transition: fade-out
---

# 兼容 wx 写法 · 判端

一套代码多端跑：QQ 直接吃 wx 写法

<div grid="~ cols-2 gap-4">

<div>

**兼容微信写法**

- 官方支持 `.wxml` / `.wxss` / `wx.` 语法直接运行
- 微信工程可几乎原样在 QQ 工具打开
- 无需全量改前缀即可跑起来

</div>

<div>

**运行时判端**

```js
const p = qq.getSystemInfoSync()
  .AppPlatform
if (p === 'qq') {
  // QQ 端专属逻辑
}
```

</div>

</div>

<!--
除了同源，QQ 还刻意兼容微信写法：.wxml、.wxss、wx. 前缀都能直接跑，微信工程几乎原样打开就能用，不用把前缀全改一遍。要在同一套代码里区分运行端时，用 qq.getSystemInfoSync 取 AppPlatform，等于 'qq' 就是跑在 QQ 里。
-->

---
transition: fade-out
---

# 迁移：微信 → QQ

低成本，几步即可跑通

<v-clicks>

- 注册 QQ 小程序账号，拿 **QQ AppID**
- `project.config.json` 填 QQ AppID（或加 `qqappid` 字段）
- 用 **QQ 开发者工具**打开工程（`.wxml` / `wx.` 直接兼容）
- 登录改接 QQ **`code2Session`**；处理 QQ 缺失/差异的 API
- 用 **`AppPlatform`** 在同一套代码区分运行端

</v-clicks>

<div v-click class="mt-4 text-sm">

真正「一套代码多端」多走 **uni-app / Taro / MPX** 等跨端框架，QQ 只是其一个输出端

</div>

<!--
迁移成本很低：注册拿 AppID，配到 project.config.json，用 QQ 开发者工具打开——因为兼容 wx 写法，基本能直接跑。需要单独处理的就两件：登录换成 QQ 的 code2Session，以及少数 QQ 不支持或行为不同的 API 做降级。补充一句，工业界真要多端复用，通常还是用 uni-app、Taro 这类跨端框架编译，QQ 只是它们的一个输出目标。
-->

---
transition: fade-out
---

# 现状：冻结与边缘化

如实评估，别当活跃主力平台

<v-clicks>

- 基础库 changelog 停在 **v1.60.0（2022-12-22）**，之后无新版本记录
- 官方新动作与生态推广稀少，一手资料多为 2019–2022 旧内容
- **纠偏**：2026「AI 小程序成长计划」、AI Agent 均属**微信**，**非 QQ**
- 定位建议：视为**「微信小程序的同源分支、现已边缘化」**
- 学习重点放在**「与微信的关系与差异」**，而非当活跃平台

</v-clicks>

<div v-click class="mt-3 text-sm opacity-75">

腾讯小程序在 2026 的投入与 AI 化几乎全集中在微信侧

</div>

<!--
必须如实说现状。QQ 小程序的基础库更新停在 2022 年底的 1.60.0，之后官方没有新版本记录，生态推广也很少见，网上能找到的一手资料大多是 2019 到 2022 的。特别要纠一个常见误区：2026 年的「AI 小程序成长计划」、内置 AI Agent 这些都是微信小程序的动作，不是 QQ 的，别张冠李戴。建议把 QQ 小程序当成微信的同源分支来理解，学习重点是它和微信的关系与差异，而不是把它当活跃主力平台。
-->

---
layout: center
class: text-center
---

# 一句话总结

**QQ 小程序 = 微信小程序的同源分支**：换前缀 + 独立登录态

同源省心 · 兼容 wx · 判端迁移 · 但基础库已冻结、生态边缘化

<div class="mt-8 text-sm opacity-75">

[QQ 开放平台文档](https://q.qq.com/wiki/) · 定位：理解「同源分支」的案例

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://q.qq.com/wiki/" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
总结一句话：QQ 小程序就是微信小程序的同源分支，记住两点差异——换前缀（qml、qss、qq: 指令、qq. API）以及独立的登录态。它同源省心、兼容 wx、能判端迁移，但要清醒认识到基础库已冻结、生态边缘化。实际项目里，建议把它当作理解「同源分支」的一个案例，而不是新项目的主力平台。谢谢大家！
-->
