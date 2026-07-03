---
theme: seriph
background: https://cover.sli.dev
title: 支付宝小程序 深入浅出
info: |
  蚂蚁集团在支付宝 App 内的原生小程序平台。

  类微信范式 · my.* API · 仅企业注册 · 了解更多 [opendocs.alipay.com/mini](https://opendocs.alipay.com/mini)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 支付宝小程序

蚂蚁集团在**支付宝 App 内**的原生小程序平台（Alipay Mini Program）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://opendocs.alipay.com/mini" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好，今天聊支付宝小程序。它是蚂蚁集团在支付宝 App 内的原生小程序平台，范式很像微信小程序，但从文件后缀到 API 前缀处处不同，会微信小程序的同学能快速迁移，但有一堆细节要换。
-->

---
transition: fade-out
---

# 什么是支付宝小程序

蚂蚁集团在**支付宝 App 内**的原生小程序平台，隶属支付宝开放平台

<v-clicks>

- 范式**类微信小程序**：双线程（渲染层 AXML/ACSS + 逻辑层 JS）、数据驱动
- 但**文件后缀、标签指令、API 前缀、事件命名均不同**，迁移低成本、非零成本
- 运行环境**非浏览器**：无 `document` / `window` / `XMLHttpRequest`
- 生态偏**电商 / 支付 / 金融 / 生活服务**（相对微信偏社交）
- **注册仅企业**：会员、支付等能力须企业开放平台账号

</v-clicks>

<!--
一句话：它跟微信小程序是同一类东西，双线程加数据驱动。差异集中在语法与 API 命名上。要特别记住两点：运行环境不是浏览器，没有 DOM；注册主体只能是企业。
-->

---
transition: fade-out
---

# 与微信小程序：核心对照

范式类微信（双线程 + `setData` 数据驱动），但**后缀/指令/前缀/事件全不同**

| 维度 | 支付宝小程序 | 微信小程序 |
| --- | --- | --- |
| 四文件 | `.axml` / `.acss` | `.wxml` / `.wxss` |
| API 前缀 | `my.*` | `wx.*` |
| 事件绑定 | `onTap` / `catchTap` | `bindtap` / `catchtap` |
| 模板指令 | `a:if` / `a:for` | `wx:if` / `wx:for` |
| 异步 Promise | 默认无（须回调） | 省略 success 自动返回 |

<div v-click class="mt-3 text-sm">

`.js` / `.json` 两端相同；**注册仅企业**（微信个人/企业皆可）；迁移成本低但非零

</div>

<!--
这张表是整个课的地图，后面每一页都在展开其中一行。记忆锚点：宝家四文件是 a 开头，API 是 my 点，事件是驼峰的 onTap，指令是 a 冒号，而且 my 默认不给你 Promise。
-->

---
transition: fade-out
---

# 四文件结构

同目录同名，逻辑层 `setData` 改数据 → 视图层自动更新（无需操作 DOM）

<div grid="~ cols-2 gap-4">

<div>

**页面级**（每个页面）

- `.js` 页面逻辑（必需）
- `.axml` 页面结构（必需，≈ wxml）
- `.json` 页面配置（必需）
- `.acss` 页面样式（可选，≈ wxss）

</div>

<div>

**应用级**（项目根）

- `app.js` 应用逻辑（必需）
- `app.json` 全局配置：`pages` / `window` / `tabBar`
- `app.acss` 全局样式（可选）
- 运行环境非浏览器：无 `window` / `document`

</div>

</div>

<!--
页面级四件套同名同目录，把微信的 wxml/wxss 换成 axml/acss 就是了。应用级三件套在项目根，app.json 里配路由 pages 和全局 window。响应式跟微信一样靠 setData。
-->

---
transition: fade-out
---

# 逻辑层：App / Page / Component

三个构造器注册（与微信同名，签名有别）

<div grid="~ cols-2 gap-4">

<div>

```js
Page({
  data: { text: 'init' },
  onLoad(query) {}, // 加载一次
  onShow() {},      // 每次显示
  onReady() {},     // 首渲染完成
  change() {
    this.setData({ text: 'new' });
  },
});
```

</div>

<div>

<v-clicks>

- **App**：`onLaunch` / `onShow` / `onHide`，`globalData` 全局共享
- **Page**：`onLoad` → `onShow` → `onReady` → `onHide` → `onUnload`
- **Component**：支付宝用 `props` + `didMount`
- 对比微信组件：`properties` + `lifetimes.attached` + `observers`

</v-clicks>

</div>

</div>

<!--
构造器名字跟微信一样：App、Page、Component。Page 生命周期顺序要背下来。最大坑在组件：支付宝传统写法用 props 和 didMount，微信用 properties 和 lifetimes.attached，别混。
-->

---
transition: fade-out
---

# 视图层 AXML：指令 a: 前缀

对应微信 WXML，控制指令前缀 **`a:`**（微信 `wx:`），数据绑定沿用 Mustache

```html
<!-- 条件渲染 a:if / a:elif / a:else -->
<view a:if="{{len > 5}}">A</view>
<view a:elif="{{len > 2}}">B</view>
<view a:else>C</view>

<!-- 列表渲染 a:for，默认变量 index / item -->
<view a:for="{{list}}" a:key="id">{{index}}: {{item.name}}</view>
```

<v-clicks>

- `a:if` 惰性渲染（切换时增删节点）；`hidden` 始终渲染、CSS 控显隐，频繁切换用后者
- `a:for-item` / `a:for-index` 自定义别名，`a:key` 提升列表复用
- `<block a:if>` 批量包裹、不渲染真实节点
- 内联脚本用 **SJS**（`<import-sjs>`），对应微信 WXS（`<wxs>`）

</v-clicks>

<!--
把微信的 wx 冒号换成 a 冒号就对了。数据绑定的双大括号跟微信完全一样。a:if 是惰性渲染、真的增删节点，频繁切换应该用 hidden。内联脚本这边叫 SJS，用 import-sjs 引入。
-->

---
transition: fade-out
---

# 事件系统：onTap / catchTap（重点差异）

绑定 = **`on` + 驼峰事件名**（冒泡）/ **`catch` + 驼峰**（阻止冒泡），值为方法名字符串

<div grid="~ cols-2 gap-4">

<div>

```html
<view onTap="handleTap">冒泡</view>
<view catchTap="handleTap">阻止冒泡</view>
<view
  data-user-id="123"
  onTap="handleAction"
>提交</view>
```

</div>

<div>

```js
Page({
  handleAction(e) {
    // data-* → dataset（驼峰化）
    console.log(e.target.dataset.userId);
  },
});
```

</div>

</div>

<div v-click class="mt-2 text-sm">

最直观差异：支付宝 **`onTap`（驼峰）** vs 微信 **`bindtap`（bind + 全小写）**

</div>

<!--
事件是宝信差异最扎眼的地方。支付宝是 on 加驼峰事件名，catch 加驼峰阻止冒泡；微信是 bindtap、catchtap 全小写。自定义数据用 data 短横线，到 JS 里通过 dataset 驼峰化读取。
-->

---
transition: fade-out
---

# API my.*：默认无 Promise（关键差异）

统一前缀 **`my.*`**；异步 API 靠 `success` / `fail` / `complete` 回调

<div grid="~ cols-2 gap-4">

<div>

```js
my.request({
  url: 'https://api.example.com',
  method: 'POST',
  data: { id: 1 },
  success: res => console.log(res.data),
  fail: err => console.error(err),
});
```

</div>

<div>

<v-clicks>

- **默认不返回 Promise**，须回调或自行 promisify
- 微信 `wx.*` 省略 `success` 时**自动返回 Promise**
- 同步 API 以 **`Sync`** 结尾，直接返回、失败抛异常
- 旧版 `my.httpRequest` 已弃用 → 统一 `my.request`
- `my.canIUse` 做能力检测

</v-clicks>

</div>

</div>

<!--
所有 API 前缀是 my 点。这里最重要的差异：支付宝的 my 系列默认不返回 Promise，你必须写 success/fail 回调，或者自己封装 promisify；而微信省略 success 就自动给 Promise。另外网络请求统一用 my.request，httpRequest 已经弃用。
-->

---
transition: fade-out
---

# 授权登录：my.getAuthCode → user_id

前端拿 authCode → 服务端换 **user_id**（支付宝会员唯一标识）

```js
my.getAuthCode({
  scopes: 'auth_base', // 静默，仅换 user_id
  success: res => {
    // res.authCode 发给服务端换 user_id
  },
});
```

<v-clicks>

- **`auth_base`**（默认）静默授权、无弹窗，仅换 user_id
- **`auth_user`** 主动授权、弹窗，可取会员信息（须企业开通能力）
- 服务端用 authCode 调 `alipay.system.oauth.token` 换 user_id + token
- 对比微信：`wx.login` + code2session → openid（概念对应、接口全不同）

</v-clicks>

<!--
登录流程：前端 getAuthCode 拿到 authCode，发给服务端，服务端调 oauth.token 换 user_id。scopes 两档，auth_base 静默只换 user_id，auth_user 会弹窗、能拿会员信息但要企业开通能力。跟微信的 wx.login 换 openid 是对应关系，但接口和字段完全不同。
-->

---
transition: fade-out
---

# 支付：my.tradePay（resultCode 9000）

支付宝生态核心优势：收银台原生，直连支付宝 / 花呗 / 信用体系

```js
my.tradePay({
  tradeNO: '2017...792', // 服务端下单得到
  success: res => {
    if (res.resultCode === '9000') {
      // 成功，再走服务端查询对账
    }
  },
});
```

<v-clicks>

- 流程：服务端 `alipay.trade.create` 下单 → 前端 `my.tradePay` 唤起收银台
- resultCode：**9000 成功** / 8000 处理中 / 6001 用户取消 / 4000 失败
- **勿只信同步返回**，须服务端 `alipay.trade.query` 或异步通知对账
- 对比微信：`wx.requestPayment`（走微信支付）

</v-clicks>

<!--
支付是支付宝小程序相对微信的天然优势。服务端先 trade.create 下单拿交易号，前端 tradePay 唤起收银台。结果码只背一个：9000 是成功。切记不能只信前端同步返回，一定要服务端 trade.query 或异步通知做最终对账。
-->

---
transition: fade-out
---

# 生态与跨端 · 注册主体

<div grid="~ cols-2 gap-4">

<div>

**平台生态**

- **仅企业注册**（会员/支付能力须企业账号），微信个人/企业皆可
- 偏电商 / 支付 / 金融 / 生活服务
- **mPaaS**：把小程序容器输出到企业自有 App
- 官方云开发：云函数 / 云存储 / 云数据库

</div>

<div>

**跨端框架**

- **Taro**：React/Vue 写法，一码编译微信/支付宝/百度/字节 + H5
- **uni-app**：Vue 写法，覆盖十余小程序平台 + App/H5
- 2026 多端主流：Taro / uni-app 双寡头
- 官方 IDE：支付宝小程序开发者工具

</div>

</div>

<!--
生态上再强调一次：注册只能企业。mPaaS 能把小程序容器搬到企业自己的 App 里跑。真要一套代码多端投放，业界主流是 Taro 和 uni-app 这两家，用它们编译到微信、支付宝等多个平台。
-->

---
layout: center
class: text-center
---

# 选型总结

**已有微信小程序、要覆盖支付宝支付/金融场景** → 支付宝小程序

四文件 `.axml`/`.acss` · 指令 `a:` · 事件驼峰 `onTap` · API `my.*`（无 Promise） · 仅企业

<div class="mt-8 text-sm opacity-75">

[官方文档](https://opendocs.alipay.com/mini) · 迁移成本低但非零：后缀 / 指令 / 前缀 / 事件逐一映射

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://opendocs.alipay.com/mini" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
一句话选型：如果业务要覆盖支付宝的支付和金融场景，或者已经有微信小程序想再上一个支付宝端，就选它。把这五个差异点记牢，迁移就顺了。谢谢大家！
-->
