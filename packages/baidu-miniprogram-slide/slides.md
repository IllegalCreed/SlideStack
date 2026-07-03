---
theme: seriph
background: https://cover.sli.dev
title: 百度智能小程序 深入浅出
info: |
  百度 App 内的小程序平台，自研 SWAN 框架，靠搜索 / 信息流分发。

  基于 SWAN 框架 · 了解更多 [smartprogram.baidu.com](https://smartprogram.baidu.com/docs/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

# 百度智能小程序

跑在**百度 App 内**、自研 **SWAN 框架**、靠**搜索 / 信息流**分发的小程序平台

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://smartprogram.baidu.com/docs/" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊百度智能小程序。它整体高度类微信，但框架换成了百度自研的 SWAN，最大差异化在于靠百度搜索和信息流分发，并深度集成百度 AI 能力。
-->

---
transition: fade-out
---

# 什么是百度智能小程序

一句话：百度旗下、**跑在百度 App 内**的小程序，采用自研 **SWAN 框架**

<v-clicks>

- **SWAN 框架**：模板语言源自百度自研 **San.js**，指令前缀 `s-`
- 结构**高度类微信**：三段式文件、`App/Page/Component`、`bind` 事件、生命周期同名
- 核心差异化：依托**百度搜索 / 信息流**分发（搜索直达、语音直达、寻址单卡）
- 深度集成**百度 AI**（OCR / 人脸 / 语音），命名空间 `swan.ai.*`
- 2018-07 上线 → 2020-09 MAU 峰值 **5 亿**；2024 后随百度 all-in AI **收缩淡出头部**
- 对微信开发者迁移**几乎零门槛**：换前缀、换后缀即可

</v-clicks>

<!--
记住定位：跑在百度 App 里、SWAN 框架、靠搜索分发、集成 AI。开发心智几乎照搬微信。
-->

---
transition: fade-out
---

# SWAN 文件结构 · 对比微信

三段四文件，与微信一一对应，只是**后缀不同**

<div grid="~ cols-2 gap-4">

<div>

```text
project/
├─ app.js            # 全局逻辑 App()
├─ app.json          # 路由 / window / tabBar
├─ app.css           # 全局样式
├─ project.swan.json # 项目配置
└─ pages/index/
   ├─ index.swan     # 页面模板
   ├─ index.js       # 页面逻辑 Page()
   ├─ index.json     # 页面配置
   └─ index.css      # 页面样式
```

</div>

<div>

| 用途 | 百度 SWAN | 微信 |
| --- | --- | --- |
| 模板 | `.swan` | `.wxml` |
| 样式 | `.css` | `.wxss` |
| 逻辑 / 配置 | `.js` / `.json` | 同 |
| 响应单位 | `rpx` | `rpx` |

<div class="mt-3 text-sm op-75">

官方框架页确认支持 `rpx` 与 `s-for`；第三方旧称「不支持」已过时。

</div>

</div>

</div>

<!--
文件结构和微信几乎一模一样，把 wxml 换成 swan、wxss 换成 css 就懂了。rpx 响应单位也照样支持。
-->

---
transition: fade-out
---

# 逻辑层：App / Page / 生命周期

构造器与生命周期钩子**与微信同名**，`this.setData` 更新数据

<div grid="~ cols-2 gap-4">

<div>

```js
// app.js · 全局单例
App({
  onLaunch() {},  // 启动，仅一次
  onShow() {},    // 前台展现
  onHide() {},    // 切后台
  globalData: {}
});
```

</div>

<div>

```js
// index.js · 页面
Page({
  data: { name: 'swan' },
  onLoad(opt) {           // 接路由参数
    this.setData({ q: opt.q });
  },
  onReady() {}, onShow() {}, onUnload() {}
});
```

</div>

</div>

<!--
逻辑层没有新东西：App 全局单例、Page 页面构造器、setData 更新数据，钩子名和微信完全一致。
-->

---
transition: fade-out
---

# SWAN 模板语法：指令前缀 `s-`

与微信 WXML 最直观的差异——`wx:` 换成 `s-`（源自 San.js）

```html
<view>Hello {{ name }}</view>          <!-- 插值 -->

<view s-if="ok">A</view>               <!-- 条件 s-if/s-elif/s-else -->
<view s-else>B</view>

<view s-for="item in list" s-key="id"> <!-- 列表 s-for + s-key -->
  {{ item.text }}
</view>
<view bind:tap="onTap">Tap</view>      <!-- 事件 bind/catch，全小写 -->
```

<div class="mt-2 text-sm op-75">

完整指令：`s-if` / `s-elif` / `s-else`、`s-for` / `s-for-item` / `s-for-index`、`s-key`。

</div>

<!--
模板层唯一要重新记的就是指令前缀：wx: 全部换成 s-，因为它源自百度自研的 San.js。事件绑定 bind/catch 和微信一样。
-->

---
transition: fade-out
---

# API：`swan.*`

命名空间 `wx` → `swan`，方法名 / 签名**基本对齐微信**（回调式 success/fail）

<div grid="~ cols-2 gap-4">

<div>

- 网络：`request` / `uploadFile` / `downloadFile` / `connectSocket`
- 导航：`navigateTo` / `switchTab` / `reLaunch`
- 存储：`setStorage(Sync)` / `getStorage(Sync)`
- 设备 / 界面：`getSystemInfo` / `showToast` / `showModal`
- 媒体 / 位置：`chooseImage` / `getLocation`

</div>

<div>

```js
swan.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  success: res => console.log(res.data),
  fail: err => console.error(err)
});
```

</div>

</div>

<!--
API 就是把 wx 换成 swan，方法名、参数、success/fail/complete 回调形态基本照搬，会微信就会用。
-->

---
transition: fade-out
---

# 登录授权：`swan.login` → code

流程与微信同构：端拿临时 `code` → 传后端换 `session_key`

```js
swan.login({
  success: res => myBackend.exchange(res.code), // code 一次性、10 分钟有效
  fail: err => console.log(err)
});
swan.checkSession({
  success: () => {},         // 会话有效
  fail: () => swan.login()   // 失效则重登
});
```

<v-clicks>

- 其他：`swan.getUserInfo` / `swan.authorize` / `swan.openSetting`
- **与微信差异**：百度需显式 `checkSession` 校验会话
- **Web 态坑**：H5 / 开源联盟环境首次登录会跳授权页再返回，`success` 不触发 → 须用 `onLogin()` 钩子拿 code

</v-clicks>

<!--
登录三步走和微信一样，端拿 code 后端换 session。要额外记两点：需要显式 checkSession；Web 态首次登录 success 不回调，得用 onLogin 钩子，这是百度特有的坑。
-->

---
transition: fade-out
---

# 两大卖点：AI 能力 + 搜索分发

区别于微信「社交裂变」的核心差异化

<div grid="~ cols-2 gap-4">

<div>

**AI 能力 · `swan.ai.*`**

- OCR：`ocrIdCard` / `ocrBankCard`
- 图像：`advancedGeneralIdentify` / `carClassify`
- 人脸：`faceDetect` / `faceMatch`
- 语音 `textToAudio`；审核 `textReview`

</div>

<div>

**搜索 / 信息流分发**

- 搜索完整名 → **寻址单卡**
- 被收录 → 关键词**自然结果**
- 语音「名称 + 小程序」→ **语音直达**
- 多入口：搜索 / 信息流 / 固定入口

</div>

</div>

<!--
这页是百度最大的两个卖点：一是开箱即用的 AI 能力，OCR、人脸、语音都在 swan.ai 下；二是靠搜索和信息流分发流量，而不是微信的社交裂变。
-->

---
transition: fade-out
---

# 从微信迁移：`wx2swan`

官方系工具，自动把 `wx.*` → `swan.*`、`.wxml` → `.swan`；但**常无法开箱即跑**

<v-clicks>

- 自动转换：API 前缀、模板后缀、目录结构
- 坑：`require('utils.js')` 不支持 → 须改为 `./utils.js`
- 坑：不支持**动态 require**、不支持 `miniprogram_npm`
- 坑：须移除 `usingComponents` 里声明的插件
- 遇不支持的 API **直接删除** → 生成 error/info/warning.json，**需人工过一遍**

</v-clicks>

<!--
迁移有官方工具 wx2swan，能自动换前缀和后缀，但基本不能直接跑，动态 require、npm 组件、插件都要手动处理，还得逐条看它生成的报告。
-->

---
transition: fade-out
---

# 与微信关键差异（重点考点）

记忆口诀——**后缀 swan、指令 s-、API swan.、靠搜索分发**

| 维度 | 百度 SWAN | 微信 |
| --- | --- | --- |
| 框架 / 模板 | **SWAN**（San.js） · `.swan` | 自研 · `.wxml` |
| 样式 / API | `.css` · `swan.*` | `.wxss` · `wx.*` |
| 条件 / 列表 | `s-if` · `s-for` `s-key` | `wx:if` · `wx:for` |
| 事件 / 生命周期 | `bind/catch`、同名（**同微信**） | 同左 |
| 主分发入口 | **搜索 / 信息流** | **社交裂变** |
| 生态投入 | 收缩、淡出头部 | 主导、高投入 |

<!--
这张表是最高频的考点。四个字记住区别：后缀 swan、指令 s-、API swan.、靠搜索分发。事件和生命周期反而和微信完全一样。
-->

---
transition: fade-out
---

# 现状与选型：收缩淡出，但未停运

（2026 如实）仍在线可注册，但投入远不及微信

<v-clicks>

- 曲线：2018-07 上线 → 2020-09 **MAU 峰值 5 亿** → 2024-06 约 **3.97 亿，行业第三**
- 收缩信号：百度全面 **all-in AI**（文心 / 智能云），C 端产品整体承压
- `swan-team` GitHub 低活跃、公开 API 文档更新疑似停滞在 2020 前后
- 口径：**非官方停运**，官方渠道仍可注册开发 → 说「投入收缩 / 淡出头部」，别说「已停运」
- 选型：作为**微信之外的第二 / 三平台** + **SWAN 差异考点**，不建议做主战场

</v-clicks>

<div class="abs-br m-6 text-xl">
  <a href="https://smartprogram.baidu.com/docs/" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
最后说现状：它经历过 5 亿 MAU 的高峰，现在随百度转向 AI 而收缩，跌到行业第三。注意口径——是投入收缩、淡出头部，不是官方停运，仍可注册。选型上把它当微信之外的第二三平台和差异化考点即可。谢谢大家。
-->
