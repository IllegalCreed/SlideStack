---
theme: seriph
background: https://cover.sli.dev
title: 抖音小程序 深入浅出
info: |
  字节跳动小程序开发全景：抖音宿主 · tt.* API · 内容公域生态。

  基于抖音开发者工具 4.x · 了解更多 [developer.open-douyin.com](https://developer.open-douyin.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 抖音小程序

字节跳动的**内容公域**小程序：一套类微信语法，跑在抖音生态（基于 4.x 基础库）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://developer.open-douyin.com/" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好，今天聊抖音小程序。它的语法几乎照搬微信小程序，但生态基因完全相反——微信是社交私域，抖音是内容公域。会微信小程序，你已经会了它的一大半。
-->

---
transition: fade-out
---

# 什么是抖音小程序

一句话：字节跳动的「即用即走」轻应用，架构**高度类微信**

<v-clicks>

- 官方平台现名 **抖音开放平台**（`developer.open-douyin.com`），即用即走、无需安装
- 依托**字节系 App 流量**分发；范式类微信：双线程 + `setData` + 数据绑定 + 同名生命周期
- 基因却相反：微信=**社交私域**，抖音=**内容公域**（短视频/直播/评论把公域流量导入）
- 迁移微信小程序**成本低但非零**：前缀替换容易，生态 API 需逐个适配
- 版本基线：抖音开发者工具 **4.x** 线、基础库 **4.x** 线

</v-clicks>

<!--
它的技术范式和微信是一个模子刻出来的，双线程、setData、生命周期都同名；差异集中在前缀、生态 API 和流量哲学上。
-->

---
transition: fade-out
---

# 一套技术，多个名字与宿主

字节小程序 / 抖音小程序 / 头条小程序 —— 同一套栈

<div grid="~ cols-2 gap-4">

<div>

**命名关系**

- **字节（跳动）小程序**：平台统称，官方文档与工具自称
- **抖音小程序**：跑在抖音宿主时的叫法
- **头条小程序**：早期叫法（今日头条宿主），本质同一套
- 域名沿革：`developer.toutiao.com` → 现 `developer.open-douyin.com`

</div>

<div>

**宿主 App（4 端）**

- 抖音 · 今日头条
- 抖音极速版 · 今日头条极速版
- **一套代码可多宿主上线**
- 部分 API「只支持抖音宿主」，跨宿主需判端降级

</div>

</div>

<!--
一个平台好几个名字，其实是同一套开放平台。重点记：官方支持四个宿主端，代码一套但能力按宿主有差异。
-->

---
transition: fade-out
---

# 文件结构：把 wx 换成 tt

一个页面 4 个同名文件，对比微信一目了然

<div grid="~ cols-2 gap-4">

<div>

| 抖音 | 微信 | 作用 |
| --- | --- | --- |
| `.ttml` | `.wxml` | 结构/模板 |
| `.ttss` | `.wxss` | 样式 |
| `.js` | `.js` | 逻辑 |
| `.json` | `.json` | 配置 |
| `.sjs` | `.wxs` | 视图层脚本 |

</div>

<div>

- 全局：`app.json`（pages / window / tabBar / 分包）+ `app.js` + `app.ttss`
- 页面 `page.json` 覆盖全局 window；组件用 `component.json`
- 样式单位 **rpx** 响应式（同微信）；TTSS 支持 flex 与全局/局部样式
- **TTML** = Toutiao Template Markup Language（头条模板标记语言）

</div>

</div>

<!--
后缀是最直观的差异：wxml/wxss/wxs 对应 ttml/ttss/sjs。全局配置和微信一模一样，样式单位也还是 rpx。
-->

---
transition: fade-out
---

# 逻辑层：App() / Page() / Component()

与微信同名的三大注册器 + 生命周期

```js
Page({
  data: { count: 0 },              // 初始数据，setData 更新视图
  onLoad(options) {},              // 页面加载，拿路由参数
  onShow() {}, onReady() {},       // 显示 / 首次渲染完成
  onPullDownRefresh() {},          // 下拉刷新
  onShareAppMessage() {},          // 转发
  handleTap() { this.setData({ count: 1 }); }, // 事件处理
});
```

<v-clicks>

- **App()**：全局唯一，`getApp()` 取，`globalData` 跨页共享；`onLaunch`/`onShow`/`onHide`
- **Component()**：`properties`/`data`/`methods` + `created`/`attached`/`ready`/`detached`
- **`setData(obj, cb?)`**：逻辑层→视图层**唯一**通道，忌高频/大数据（性能考点）

</v-clicks>

<!--
逻辑层三个注册器和微信同名同心智。核心记住 setData 是逻辑层到视图层唯一的数据通道，别高频大数据地刷。
-->

---
transition: fade-out
---

# 视图层 TTML：指令换成 tt:

把微信 `wx:` 前缀换成 `tt:`，语法几乎一致

```html
<view tt:if="{{ ok }}">yes</view>
<view tt:else>no</view>

<view tt:for="{{ list }}" tt:key="id">
  {{ index }}: {{ item.name }}
</view>

<button bindtap="onTap" data-id="{{ id }}">点我</button>
```

<v-clicks>

- **条件** `tt:if` / `tt:elif` / `tt:else`；**列表** `tt:for` + `tt:for-item` / `tt:for-index` / `tt:key`
- **事件** `bindtap` 冒泡 / `catchtap` 阻止冒泡；`e.currentTarget.dataset` 取 `data-*`
- **复用** `<template>` / `<block>` / `<import>`；**SJS** 视图层脚本（对标微信 WXS）

</v-clicks>

<!--
视图层就是把 wx 冒号换成 tt 冒号，条件、列表、事件绑定的写法和微信完全一致，数据绑定也还是双大括号。
-->

---
transition: fade-out
---

# API：命名空间 tt.*

方法名与微信 `wx.*` 大面积同名，走 success/fail/complete 回调

<div grid="~ cols-2 gap-4">

<div>

```js
tt.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  data: { id: 1 },
  header: { 'content-type': 'application/json' },
  success(res) { console.log(res.data); },
  fail(err) {},
});
```

</div>

<div>

| 能力 | 抖音 API |
| --- | --- |
| 网络 | `tt.request` |
| 路由 | `tt.navigateTo` |
| 存储 | `tt.setStorage` |
| 交互 | `tt.showToast` |
| 媒体 | `tt.chooseImage` |

</div>

</div>

<div v-click class="mt-4 text-sm">

官方分类：基础 / 路由 / 网络 / 媒体 / 文件 / 缓存 / 位置 / 设备 / 界面 / 开放接口 / 广告；心智同微信，前缀换 `tt.`

</div>

<!--
API 命名空间是 tt，方法名和微信大面积重合，连回调风格都一样。把 wx 点换成 tt 点，绝大多数代码就能跑起来。
-->

---
transition: fade-out
---

# 登录：tt.login → code2session

与微信同构的三步登录流

<v-clicks>

- ① 客户端 **`tt.login`** 拿临时凭证 `code`（同微信 `wx.login`）
- ② 服务端 **`code2session`（OpenAPI）** 用 `code` 换 **`openid` + `session_key`**
- ③ 后端据此签发自己的登录态（token）返回客户端
- **匿名场景**：返回 `anonymous_code`，同样送去 `code2session` 换取标识
- 昵称头像用 **`tt.getUserProfile`**：**须 tap 回调内调用、每次弹授权框**；`tt.getUserInfo` 逐步废弃

</v-clicks>

<!--
登录流程和微信一模一样：客户端拿 code，服务端拿 code 换 openid 和 session_key。用户信息现在收紧了，必须在点击回调里调 getUserProfile 且每次弹框。
-->

---
transition: fade-out
---

# 支付：tt.pay 与担保支付

抖音收银台走「担保支付」，门槛在资质

<v-clicks>

- **`tt.pay`**：调起字节小程序收银台（官方自**基础库 1.19.4** 起支持）
- 模式为**「担保支付」**：平台担保交易，底层可走微信支付/支付宝
- **前置条件**：商户须先**入驻 + 开通担保支付账户**才能收款
- **主体门槛**：以**企业**为主，部分行业「定向邀请制」；**个人主体一般无法开通支付**
- 交易/行业场景还有 `tt.continueToPay` 等（交易系统 pay）

</v-clicks>

<!--
支付是抖音和微信差异最大的一块。它是担保支付模式，而且必须先入驻、开通担保支付账户，个人主体基本用不了，这点比微信门槛高。
-->

---
transition: fade-out
---

# 抖音特色：内容公域的入口

相对微信的加分项，都围绕「把公域流量导进来」

<div grid="~ cols-2 gap-4">

<div>

**公域流量入口**

- **短视频挂载**：视频页直接挂小程序
- **直播小风车**：直播间浮窗引流
- **评论区锚点**：评论直达小程序
- → 算法推荐 · **即时转化**

</div>

<div>

**生态组件 / 能力**

- **`aweme-data`**：抖音数据组件（字节特色）
- **`open-type`**：加关注 / 跳主页 / 进直播间 / IM
- **`live-player`** 竖屏秒开、`video` 能力强
- **`tt.matchMedia`** 大屏 / 媒体查询适配

</div>

</div>

<div v-click class="mt-4 text-sm">

对比微信：抖音=**内容公域·算法即时转化**，微信=**社交私域·分享裂变留存** —— 选型分水岭

</div>

<!--
抖音的杀手锏都指向一件事：把公域流量直接导进小程序。短视频挂载、直播小风车、评论锚点，加上 aweme-data 和 open-type 这些生态动作，这是微信没有的。
-->

---
transition: fade-out
---

# 与微信：语法像，物种不同

相似 ≠ 复制即用，生态强绑定 API 必须逐个适配

<div grid="~ cols-2 gap-4">

<div>

| 维度 | 抖音 | 微信 |
| --- | --- | --- |
| 前缀 | `tt.` / `tt:` | `wx.` / `wx:` |
| 后缀 | `.ttml` / `.ttss` | `.wxml` / `.wxss` |
| 支付 | `tt.pay` 担保 | `wx.requestPayment` |
| 主体 | 企业为主 | 个人 / 企业 |
| 宿主 | 抖音系 4 端 | 微信 |

</div>

<div>

- **迁移**：官方「搬家工具」/ `wx2tt`，批量换后缀 + 前缀
- 但 **支付 / 登录 / 分享 / 音视频 / 用户信息** 这类**生态强绑定 API 必须手动适配**
- **流量逻辑根本不同**：私域裂变 vs 公域即时转化，运营打法要重做

</div>

</div>

<!--
一句话总结差异：语法可以搬家工具批量转，但支付、登录、分享、音视频、用户信息这几类生态强绑定的 API 必须手动逐个适配，绝不是改前缀就完事。
-->

---
layout: center
class: text-center
---

# 选型总结

**要吃抖音内容公域流量、且有微信小程序经验** → 抖音小程序

类微信语法 · `tt.*` API · 担保支付 · 短视频/直播挂载引流

<div class="mt-8 text-sm opacity-75">

[抖音开放平台](https://developer.open-douyin.com/) · 内容公域 · 一套代码多宿主

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://developer.open-douyin.com/" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
一句话选型：如果你要吃抖音的内容公域流量、团队又有微信小程序经验，抖音小程序迁移成本低、收益直接。谢谢大家！
-->
