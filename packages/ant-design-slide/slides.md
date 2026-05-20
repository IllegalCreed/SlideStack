---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Ant Design
info: |
  Presentation Ant Design for React developers.

  Learn more at [https://ant.design/](https://ant.design/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🐜</span>
</div>

<br/>

## Ant Design — React UI for Enterprise

70+ 组件 / Design Token / 算法主题 —— 蚂蚁集团出品的 React 企业级 UI 事实标准

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Ant Design —— 蚂蚁集团出品的 React 企业级 UI 组件库，
2015 年 1 月发布 1.0，至今十年迭代，是中国设计语言走向世界的代表作。

当前主线 v5.x（CSS-in-JS + Design Token + 算法主题），70+ 组件覆盖企业全场景。
v6 已发布但 v5 仍是社区主流稳定版本，本次内容聚焦 v5。

核心卖点：
- Design Token 三层架构（Seed / Map / Alias），CSS-in-JS 运行时主题
- algorithm 函数式主题（defaultAlgorithm / darkAlgorithm / compactAlgorithm）
- ConfigProvider 全局配置 + 嵌套主题
- 原生 TypeScript 类型，70+ 语言 i18n
- @ant-design/pro-components 企业级套件 + Ant Design Pro 完整模板
- React 生态最深的中后台资源（vue-element-admin 的 React 版本对标）
-->

---
transition: fade-out
---

# 什么是 Ant Design？

蚂蚁集团出品的 React 企业级 UI 体系，70+ 组件 + 设计语言

<v-click>

- **70+ 组件**：General / Layout / Navigation / Data Entry / Data Display / Feedback 六大分组
- **Design Token**：Seed / Map / Alias 三层，CSS-in-JS 运行时切换
- **algorithm 主题**：函数式生成色板 —— default / dark / compact 三套预设可组合
- **ConfigProvider**：全局配置中心，主题 / locale / 组件 size 嵌套覆盖
- **TypeScript 优先**：全量类型导出，ColumnsType / FormInstance / ProColumns
- **国际化**：70+ 语言 locale + dayjs locale 联动
- **生态成熟**：Ant Design Pro / pro-components / Ant Design Charts / X / Mini
- **多端覆盖**：React Web + Mobile + Mini Program + Charts + 设计资源

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Ant Design Values_](https://ant.design/docs/spec/values)

</div>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Ant Design 的核心定位非常清晰：「React 企业级 UI 体系」——

不是单纯的「组件库」，是「设计语言 + 组件实现 + 工程套件」三位一体：
- 设计语言：自然 / 确定性 / 意义感 / 生长性四大价值观，配套色板 / 字体 / 间距 / 动效完整体系
- 组件实现：70+ 高质量 React 组件，覆盖企业后台全部场景
- 工程套件：pro-components 高级组件 + Ant Design Pro 项目脚手架 + 设计资源（Figma / Sketch / Axure）

Design Token 三层架构是 v5 最大的革新：
- Seed Token：根色板（colorPrimary / colorSuccess 等），用户主要改这一层
- Map Token：算法派生（colorPrimaryHover / colorPrimaryActive 等），自动计算
- Alias Token：语义别名（colorBgContainer / colorBorder），组件实际消费

algorithm 是 v5 的「黑科技」—— 主题不再是写死的 CSS，而是一个 (seed) => map 的纯函数，
切换暗色就是换一个 algorithm 函数，紧凑模式同理。

下面会按「定位 → 安装 → ConfigProvider → 组件分组 → Form/Table → 反馈四件套 → 主题/暗色 → i18n → Next.js → TS → 迁移 → 对比 → 踩坑 → 学习路径」顺序讲透。
-->

---
transition: fade-out
---

# 定位与生态对比

为什么 React 企业后台默认选 Ant Design？

<v-click>

| 维度       | Ant Design       | MUI         | Mantine    | Chakra UI |
| ---------- | ---------------- | ----------- | ---------- | --------- |
| 设计语言   | **企业中后台**   | Material 3  | 现代实用   | 友好简洁  |
| 组件数量   | **70+**          | 60+         | 100+       | 50+       |
| 主题方案   | **Token + algo** | sx + Theme  | CSS vars   | Theme 对象 |
| 样式底层   | CSS-in-JS        | Emotion     | CSS vars   | Emotion   |
| 国际化     | 70+ 语言         | 50+         | 20+        | 一般      |
| 主导团队   | **蚂蚁集团**     | MUI 公司    | 社区       | Adobe     |
| 中国生态   | **极强**         | 一般        | 弱         | 弱        |

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比 React 生态四大主流 UI 库，Ant Design 的护城河是「企业中后台 + 设计体系」：

设计语言：
- Ant Design 走「企业中后台通用」路线，不像 Material 那么张扬，适合 B 端运营 / 客服 / 数据系统
- 中文 + 西文都做了字体调优，色板包含完整的功能色（成功 / 警告 / 错误 / 信息）
- 70+ 组件覆盖企业后台 99% 场景，包括稀有的 Tour / QRCode / Watermark / Result

主题方案：
- Token + algorithm 是 React 生态独一份的设计 —— 纯函数式主题生成
- MUI 是 sx + Theme 对象，灵活但运行时开销更大
- Mantine 用 CSS vars，性能好但定制层级浅
- Chakra UI 是 Theme 对象，体验介于两者之间

中国生态：
- 蚂蚁集团十年深耕，文档 / issue / 教程 / 模板中文资源极其丰富
- Ant Design Pro / pro-components 提供「企业项目级」脚手架，几天起步一个完整后台
- Ant Design X（AGI 时代 UI）/ Charts / Mini Program 形成完整产品矩阵

选型逻辑：
- React + B 端中后台 → Ant Design（默认选项）
- React + C 端 / 移动端 → MUI / Chakra UI（颜值更现代）
- React + 重度定制 → Mantine（hooks + 实用功能最完整）
- React + 大组件 + 数据密集 → Ant Design Pro（开箱企业级）
-->

---
transition: fade-out
---

# 演进史

从 1.0 到 v5 / v6 的十年

<v-click>

| 版本      | 时间    | 关键事件                                          |
| --------- | ------- | ------------------------------------------------- |
| 1.0       | 2015.1  | 蚂蚁中后台体验技术部首发，配 React 0.14          |
| 3.x       | 2018    | 全面 TypeScript 重写，与 Less 主题系统成熟        |
| 4.x       | 2020.2  | 按需引入 + Tree-shaking 完善，组件量稳定 60+      |
| **5.x**   | 2022.12 | **CSS-in-JS + Design Token + algorithm 革新**     |
| 5.10+     | 2023-24 | App 组件 / pro-components 联动 / Next.js Registry |
| 6.x       | 2025+   | 新增 zeroRuntime 模式，主题编译期生成 CSS         |

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Ant Design 的演进有几个里程碑值得记住：

1.0（2015）：React 0.14 时代蚂蚁内部孵化，最初只是为了统一蚂蚁内部的 B 端系统体验。
没想到开源后火遍全球，成为 React 生态最受欢迎的企业 UI 库之一。

3.x（2018）：全面 TypeScript 重写，这是奠定「企业级口碑」的关键 —— 类型完整、文档清晰、版本稳定。

4.x（2020）：按需引入 + Tree-shaking 真正成熟，bundle 大小大幅下降。
也是 5.x 之前最广泛使用的版本，至今仍有大量项目在用。

5.x（2022.12）：最大的一次架构革新 ——
- 抛弃 Less 主题系统，转用 CSS-in-JS（@ant-design/cssinjs）
- 引入 Design Token 三层架构
- 用 algorithm 函数生成主题色板
- 暗色 / 紧凑 / 自定义主题全部统一到一个 API

革新的代价是 v4 → v5 不少 API 变化（特别是主题系统），有专门的迁移指南。
好处是「主题切换、多主题、动画启停」这些之前难做的事变得一行代码。

6.x（2025）：新增 zeroRuntime 模式 —— 用构建时生成 CSS 替代运行时，
首屏性能更好，代价是失去运行时主题切换能力。
v5 仍是当前社区主流，本次内容聚焦 v5。
-->

---
transition: fade-out
---

# 设计价值观

自然 / 确定性 / 意义感 / 生长性 —— Ant Design 的灵魂

<v-click>

**自然（Natural）** —— 降低用户认知负担，符合直觉

</v-click>

<v-click>

**确定性（Certain）** —— 设计师可遵循，用户感知一致，"完美不是没什么可加，而是没什么可减"

</v-click>

<v-click>

**意义感（Meaningful）** —— 目标清晰、反馈及时，让用户在工作中获得心流

</v-click>

<v-click>

**生长性（Growing）** —— 产品与用户共生演化，承载人机共生关系

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 自然 —— Ant Design 一切设计的出发点。
体现在交互上：按钮 hover / active 反馈瞬时、表单错误位置贴近字段、危险操作必须二次确认。
体现在视觉上：色板对应人对色彩的天然认知（红=危险 / 绿=成功 / 蓝=主要 / 黄=警告）。

[click] 确定性 —— B 端产品的核心命脉。
B 端用户不像 C 端用户能容忍「惊喜」—— 他们要的是「同样的操作产生同样的结果」。
这就是为什么 Ant Design 的 Button / Form / Table 在所有产品里看起来都「一个模子」。
"perfection is achieved, not when there is nothing more to add,
but when there is nothing left to take away" —— 这句引自圣埃克苏佩里（小王子作者）
的话被 Ant Design 反复强调，体现「减法美学」的极致。

[click] 意义感 —— 让用户在工作中获得心流。
B 端用户每天面对系统 8 小时以上，如果每一步操作都让人疲惫，
那不仅 UX 烂，业务效率也低。Ant Design 的「适度挑战 + 即时反馈」
就是借鉴心流理论 —— 让运营 / 客服 / 数据分析师在长时间使用中保持专注。

[click] 生长性 —— 产品与用户共同演化。
功能可以慢慢解锁、个性化可以渐进沉淀、用户习惯可以被产品记住。
这一点在 v5 的「algorithm 主题」上体现得很好 —— 同一套设计语言可以衍生出无限种品牌方案。

四个价值观对工程师的指导：
- 写新组件先问「自然吗」（用户能不能一眼看懂）
- 写新流程先问「确定吗」（操作结果可不可预期）
- 写新功能先问「有意义吗」（解决什么业务痛点）
- 写新系统先问「能生长吗」（未来 3 年怎么扩展）
-->

---
transition: fade-out
---

# 核心理念：v5 三大革新

CSS-in-JS / Design Token / algorithm

<v-click>

**1. CSS-in-JS（@ant-design/cssinjs）**

抛弃 Less，转向运行时生成样式 —— 解决多主题、按需打包、SSR 注入难题

</v-click>

<v-click>

**2. Design Token 三层架构**

Seed / Map / Alias —— 改一个根色板，整套 UI 自动派生，组件层精确控制

</v-click>

<v-click>

**3. algorithm 函数式主题**

defaultAlgorithm / darkAlgorithm / compactAlgorithm —— 主题不是数据，是一个 (seed)=&gt;map 的纯函数

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] CSS-in-JS 是 v5 的根本性转向 ——

v4 及之前依赖 Less 编译期主题：
- 改一个变量要 webpack 重新构建
- 多主题切换难（除非引入 less-loader 运行时编译，性能差）
- SSR 时 Less 变量难以动态注入

v5 用 @ant-design/cssinjs（蚂蚁自研，基于 emotion 思路）：
- 主题切换 = 重新生成一份 CSS，毫秒级
- 多主题 = 多个 ConfigProvider 嵌套
- 按需 = 用到的组件才注入 CSS，未用的 0 体积
- 缺点 = 运行时开销（v6 zeroRuntime 模式解决）

[click] Design Token 三层架构是 v5 的灵魂 ——

Seed Token（种子）：用户主改的层，比如 colorPrimary（主色）/ colorSuccess / borderRadius / fontSize
Map Token（映射）：algorithm 自动派生，比如 colorPrimaryHover（主色 + 亮度变化）/ colorPrimaryActive
Alias Token（别名）：语义层，组件实际消费，比如 colorBgContainer / colorBorder / colorText

用户只改 Seed，algorithm 自动算出 Map，组件消费 Alias —— 改一个色板，整套 UI 自动派生。

[click] algorithm 是 v5 的「黑科技」——

主题不是 JSON 数据，而是一个函数：(seedToken) =&gt; mapToken
- defaultAlgorithm：标准亮色，hover 加 10% 亮度，active 减 10%
- darkAlgorithm：标准暗色，相同 seedToken 派生出深色背景 + 浅色文字
- compactAlgorithm：紧凑模式，缩小间距 / 字号 / 控件高度

最妙的是 algorithm 可以「数组叠加」—— [darkAlgorithm, compactAlgorithm] = 紧凑暗色，
任意组合无需写新主题。这是 React 函数式美学在 UI 库上的完美体现。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 安装与第一个组件

3 分钟接入任意 React 项目

::left::

<v-click>

**安装**

```bash
pnpm add antd
# 或
npm install antd
```

| 版本 | React 兼容 | 状态           |
| ---- | ---------- | -------------- |
| v5.x | React 16.9+ | **当前主线**   |
| v6.x | React 18+  | 新版（zeroRuntime） |
| v4.x | React 16+  | LTS 维护       |

</v-click>

::right::

<v-click>

**直接使用（无需 use 注册）**

```tsx
import { Button, DatePicker } from "antd";

export default function App() {
  return (
    <>
      <Button type="primary">提交</Button>
      <DatePicker
        onChange={(d) =&gt; console.log(d)} />
    </>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Ant Design 安装一行命令搞定 —— 没有可选 peer dependency。

v5.x 是当前社区主流稳定版本，要求 React 16.9+（hooks 时代）。
v6.x 是新版本，新增 zeroRuntime 模式（构建期生成 CSS，无运行时开销）。
v4.x 进入 LTS 阶段，仅维护严重安全补丁，不再新增功能。

新项目推荐：
- 通用企业后台：v5（社区资料最多）
- 性能敏感场景：v6（zeroRuntime）
- 大量已有 v4 项目：保持 v4，按需迁移 v5

注意：antd 包名稳定，不像 element-ui → element-plus 那样换名字。
直接 `import { Button } from 'antd'` 即可，Tree-shaking 自动剔除未使用组件。

[click] 与 Vue 生态最大的区别：

Vue（Element Plus / Naive UI）需要 app.use() 全局注册 + ConfigProvider 包裹。
React（Ant Design）直接 import 组件用 —— 没有「全局注册」概念。

CSS 不需要手动 import！v5 的 CSS-in-JS 会自动注入样式到 DOM，
不像 v4 还要写 `import 'antd/dist/antd.css'`，这是 v5 的便利之一。

第一个组件就是这么简单 —— Button 一行、DatePicker 一行，立刻可用。
TypeScript 类型自动推导，onChange 回调里的 d 是 Dayjs 对象（v5 默认日期库）。
-->

---
transition: fade-out
---

# ConfigProvider：全局配置中心

主题 / 语言 / 组件 size 在一个组件里搞定

<v-click>

```tsx
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");

export default function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: { colorPrimary: "#1677ff", borderRadius: 8 },
      }}
      componentSize="middle"
    >
      <YourApp />
    </ConfigProvider>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] ConfigProvider 是 Ant Design 的「全局配置中心」，承担三大职责：

1. **i18n locale** —— 所有组件的内置文案（如 Table 的「暂无数据」/ DatePicker 的月份名）通过 locale 切换
2. **theme** —— Design Token + algorithm 设置整站主题
3. **组件默认行为** —— componentSize（小 / 中 / 大）/ getPopupContainer / direction（RTL）等

注意要点：

- ConfigProvider 通常包裹整个 App，放在 createRoot 渲染的最外层
- locale 单独的 dayjs 也要同步（dayjs.locale('zh-cn')），否则 DatePicker 仍显示英文月份
- theme.token 是 Seed Token 入口，改这里就改全站主色 / 圆角等
- algorithm 是函数引用（不是字符串！）—— theme.defaultAlgorithm

ConfigProvider 可嵌套 —— 内层覆盖外层。常见模式：
- 整站 light + 后台局部 dark
- 整站默认 size + 表单页 small（更紧凑）
- 整站中文 + 国际化页面 en-US

第一个项目这一段照抄就行，不用想太复杂。
-->

---
transition: fade-out
---

# 70+ 组件分组速览

按使用场景组织，记住分组即可快速定位

<v-click>

| 分组             | 代表组件                                                |
| ---------------- | ------------------------------------------------------- |
| **General**      | Button / Icon / Typography / FloatButton                |
| **Layout**       | Grid / Layout / Space / Flex / Divider                  |
| **Navigation**   | Menu / Tabs / Breadcrumb / Steps / Pagination           |
| **Data Entry**   | Form / Input / Select / DatePicker / Upload             |
| **Data Display** | Table / Tree / Card / Tag / Statistic / Tour            |
| **Feedback**     | Message / Modal / Notification / Drawer / Spin          |
| **Other**        | ConfigProvider / App / Affix / Watermark                |

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 70+ 组件听起来多，按分组记忆很容易上手：

**General（4 个）**：原子元素，每个页面都用
- Button（按钮）/ FloatButton（悬浮按钮）/ Icon（图标）/ Typography（排版）

**Layout（7 个）**：布局骨架
- Grid（24 栅格）/ Layout（Header/Sider/Content）/ Space（间距）/ Flex（v5.10+，封装 flex）
- Divider（分割线）/ Splitter（v5.21+，可拖拽分屏）

**Navigation（7 个）**：导航
- Menu（菜单）/ Tabs（标签页）/ Breadcrumb（面包屑）/ Steps（步骤条）
- Pagination（分页）/ Dropdown（下拉）/ Anchor（锚点）

**Data Entry（18 个）**：表单交互，企业后台的核心战场
- Form / Input / Select / DatePicker / TimePicker / Upload / Cascader / TreeSelect
- Radio / Checkbox / Switch / Slider / Rate / ColorPicker / Transfer / Mentions
- InputNumber / AutoComplete

**Data Display（20 个）**：数据展示
- Table（重头戏）/ Tree / List / Card / Statistic / Descriptions / Tag / Badge
- Avatar / Calendar / Carousel / Collapse / Empty / Image / Popover / QRCode
- Segmented / Timeline / Tooltip / Tour

**Feedback（11 个）**：反馈通知
- Message / Modal / Notification / Drawer / Popconfirm / Alert / Progress / Skeleton / Spin / Result / Watermark

**Other（5 个）**：辅助
- ConfigProvider / App / Affix / Util / BorderBeam

这套分组与官网完全一致，记住分组就能在文档里快速定位。
-->

---
transition: fade-out
---

# Form 深度（一）：基础结构

Form / Form.Item / Form.useForm() 三要素

<v-click>

```tsx
import { Form, Input, Button } from "antd";

interface Values { name: string; email: string }

export default function Demo() {
  const [form] = Form.useForm<Values>();
  const onFinish = (v: Values) =&gt; console.log("submit:", v);
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item label="姓名" name="name" rules={[{ required: true, message: "请输入姓名" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="邮箱" name="email" rules={[{ type: "email", message: "邮箱格式不正确" }]}>
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">提交</Button>
    </Form>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Ant Design Form 是 React 生态最强表单方案，没有之一 ——
企业后台 80% 的页面都是「表单 + 表格」组合。

核心三件套：

- **Form** 容器：layout（horizontal/vertical/inline）+ onFinish（提交回调）+ initialValues（初始值）
- **Form.Item**：name（字段名）+ rules（校验规则）+ label（标签）
- **Form.useForm()**：返回 form 实例，提供 setFieldsValue / getFieldsValue / validateFields / resetFields 等方法

跟 React Hook Form / Formik 最大的区别：

Ant Design Form 是「非受控 + 集中管理」—— 不需要每个 Input 写 value + onChange，
Form.Item 通过 cloneElement 注入 value 与 onChange 到子组件，
表单状态全部由 form 实例集中维护。

好处：
- 写法极简（不用每个字段写 useState）
- 性能好（单字段变化不触发整个 Form rerender）
- 校验集中（rules 写在 Form.Item 上，validateFields 一把全验）

注意：rules 是数组，每条 rule 是 { required, type, min, max, validator, message } 对象。
type 支持 string / email / url / number / regexp / array 等。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-6
---

# Form 深度（二）：校验 + 提交

validateFields / 自定义校验器 / 异步校验

::left::

<v-click>

**手动校验 + 提交**

```tsx
async function handleSubmit() {
  try {
    await form.validateFields();
    await api.createUser(form.getFieldsValue());
  } catch (e) {
    console.warn("校验未通过", e);
  }
}
```

</v-click>

::right::

<v-click>

**异步校验器（检查唯一性）**

```tsx
const usernameRule = {
  validator: async (_, v: string) =&gt; {
    if (v && await api.checkUsername(v))
      throw new Error("用户名已被占用");
  },
};

<Form.Item name="username"
  rules={[{ required: true }, usernameRule]}>
  <Input />
</Form.Item>
```

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] validateFields() 是核心 API，返回 Promise：
- 通过：resolve 一个 values 对象（已收集所有字段值）
- 失败：reject 一个 errorInfo（包含 errorFields / outOfDate / values）

推荐 try/await 写法，比 onFinish 回调更灵活（可以在 try 里串接多个异步操作）。

但官方推荐写法其实是用 onFinish prop —— Form 内部已经做了 validateFields，
onFinish 只在验证通过时触发，回调参数就是 values。
两种写法都对，看团队风格。

[click] 异步校验器是「检查后端唯一性」的标配 ——

validator 函数签名：(rule, value) =&gt; Promise
- 通过：return（或不写 return）
- 失败：throw new Error('错误信息')

注意 v5 用 Promise 而非 v3/4 时代的 callback(error)，这是迁移点之一。
async-validator（蚂蚁自研，与 Element Plus 共用）作为底层校验引擎，
支持 pattern（正则）/ enum / whitespace / len / max / min 等丰富类型。

性能注意点：
- 异步校验默认 onChange 触发，频繁请求后端 —— 加 Form 的 validateDebounce={500} 防抖
- 或改 validateTrigger='onBlur' 改为失焦校验

最佳实践：
- 简单校验（required / email）放 rules
- 复杂业务校验（跨字段 / 异步）写 validator
- 表单提交统一走 onFinish，不要手动 validateFields
-->

---
transition: fade-out
---

# Form 深度（三）：联动与 Watch

dependencies / useWatch / shouldUpdate

<v-click>

**dependencies：依赖字段变更触发重算**

```tsx
<Form.Item name="password" rules={[{ required: true }]}>
  <Input.Password />
</Form.Item>
<Form.Item name="confirm" dependencies={["password"]} rules={[
  ({ getFieldValue }) =&gt; ({
    validator(_, v) {
      if (!v || getFieldValue("password") === v) return Promise.resolve();
      return Promise.reject(new Error("两次密码不一致"));
    },
  }),
]}>
  <Input.Password />
</Form.Item>
```

</v-click>

<v-click>

**useWatch：监听字段变化（v5 新增）**

```tsx
const role = Form.useWatch("role", form);
useEffect(() =&gt; { if (role === "admin") form.setFieldValue("perms", []); }, [role]);
```

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] dependencies 用于「字段联动校验」最经典场景 ——

确认密码必须跟密码一致 —— 但 password 改了之后 confirm 不会主动重算，
通过 dependencies 声明依赖关系，让 confirm 在 password 变化时重新校验。

rules 写成函数 `({ getFieldValue }) =&gt; ({ validator })` 可以拿到 form 实例，
通过 getFieldValue 读取其他字段的值进行比较 —— 这是「跨字段校验」的标准模式。

shouldUpdate 是另一个相关概念 —— 它控制 Form.Item 何时重新渲染，
true = 任何字段变化都重渲染（性能差），函数 = 精细控制（推荐）。

[click] useWatch 是 v5 新增的 Hook，监听单个字段变化触发副作用 ——

跟 dependencies 的区别：
- dependencies：影响校验，只在「校验时」读取依赖字段
- useWatch：影响业务逻辑，字段每次变化都触发 hook

useWatch 适合「字段联动业务」场景 ——
比如选了「管理员」角色后清空权限选择，或者根据国家 + 省份动态加载城市列表。

useWatch 性能极好（只订阅该字段，其他字段变化不触发），
比传统 Formik 的「整体 values」订阅效率高一个量级。

ProForm 还提供 ProFormDependency 高级组件，更适合复杂联动场景，
但需要引入 @ant-design/pro-components。
-->

---
transition: fade-out
---

# Table 深度（一）：列定义与数据

ColumnsType + dataSource + rowKey

<v-click>

```tsx
import { Table } from "antd";
import type { TableColumnsType } from "antd";

interface User { id: number; name: string; age: number; status: "on" | "off" }

const columns: TableColumnsType<User> = [
  { title: "ID", dataIndex: "id", key: "id", width: 80, sorter: (a, b) =&gt; a.id - b.id },
  { title: "姓名", dataIndex: "name", key: "name" },
  { title: "年龄", dataIndex: "age", key: "age", sorter: (a, b) =&gt; a.age - b.age },
  {
    title: "操作", key: "action", width: 160,
    render: (_, row) =&gt; <Button size="small" onClick={() =&gt; edit(row)}>编辑</Button>,
  },
];

<Table<User>
  rowKey="id"
  columns={columns}
  dataSource={data}
  bordered
  pagination={{ pageSize: 20 }}
/>
```

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Ant Design Table 是 React 生态最强表格，没有之一 —— 50+ props / 30+ slots / 完整 TS 类型。

核心三要素：

- **columns**：列定义数组，ColumnsType&lt;T&gt; 泛型让 dataIndex 强类型校验
- **dataSource**：数据数组，元素类型即 T
- **rowKey**：唯一标识，可以是字段名（"id"）或函数 `(record) =&gt; record.uid`

列定义关键属性：
- title：列头文字
- dataIndex：对应数据字段名（支持嵌套 ['user', 'name']）
- key：唯一 key（一般跟 dataIndex 一致）
- width：列宽（数字 = px，字符串 = 其他单位）
- sorter：排序函数（客户端）或 true（服务端）
- render：自定义渲染（参数：value, row, index）

最常见的列：
- ID / 序号列（width 80）
- 文字列（dataIndex 即可）
- 状态列（render 渲染 Tag）
- 时间列（render 调 dayjs.format）
- 操作列（render 渲染 Button + Popconfirm）

rowKey 务必设置！否则 React 会报「each child needs a unique key」警告，
而且选择 / 展开 / 排序状态都会乱。

bordered 加边框（B 端推荐），无 bordered 更现代（C 端推荐）。
-->

---
transition: fade-out
---

# Table 深度（二）：分页 + 排序 + 筛选

服务端分页统一通过 onChange 触发

<v-click>

**服务端分页模式（大数据集首选）**

```tsx
const [params, setParams] = useState({ page: 1, pageSize: 20, sortField: "", sortOrder: "" });
const { data, loading } = useQuery(params);

const handleChange = (pagination, filters, sorter) =&gt; {
  setParams({
    page: pagination.current,
    pageSize: pagination.pageSize,
    sortField: sorter.field,
    sortOrder: sorter.order,   // 'ascend' / 'descend' / undefined
  });
};

<Table
  loading={loading}
  columns={columns}
  dataSource={data.list}
  rowKey="id"
  pagination={{ current: params.page, pageSize: params.pageSize, total: data.total }}
  onChange={handleChange}
/>
```

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 服务端分页是企业后台的核心场景 —— 数据量从几千到几百万，必须后端处理。

核心 API：onChange(pagination, filters, sorter)
- pagination：当前页码 + 每页条数
- filters：当前激活的列筛选
- sorter：当前排序字段 + 方向

设计精妙之处：所有「需要后端处理」的状态变化都走一个 onChange 回调，
我们只需要把这些参数封装到查询参数里，扔给 API 即可。

比对 Element Plus / Naive UI：
- 它们的分页 / 排序 / 筛选事件是分开的（@page-change, @sort-change, @filter-change）
- Ant Design Table 统一到 onChange，更适合「参数化查询」的思维

服务端模式注意：
- pagination 对象的 current / total 必须传（不传则当成客户端分页）
- columns 里的 sorter 必须改为 true（不是函数）—— 表示「服务端排序」
- filters 同样 —— 加 `filters: []` + `onFilter: undefined` 表示服务端筛选

客户端分页（小数据集）更简单 —— 不传 onChange，让 Table 内部自动处理排序 / 分页。

useQuery 这里用 TanStack Query / SWR / 自定义 fetch hook 都行，
关键是把 params 作为 cache key，params 变了自动重新请求。
-->

---
transition: fade-out
---

# Table 进阶：rowSelection + 行操作

选择列 / 批量操作 / 展开行

<v-click>

```tsx
const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

<Table<User>
  rowKey="id"
  rowSelection={{
    selectedRowKeys: selectedKeys,
    onChange: (keys) =&gt; setSelectedKeys(keys),
    type: "checkbox",
  }}
  expandable={{
    expandedRowRender: (row) =&gt; <p>{row.bio}</p>,
    rowExpandable: (row) =&gt; row.bio != null,
  }}
  columns={columns}
  dataSource={data}
/>

<Button danger disabled={!selectedKeys.length} onClick={batchDelete}>
  批量删除（已选 {selectedKeys.length}）
</Button>
```

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] rowSelection 是「批量操作」的标准实现 ——

关键点：
- selectedRowKeys 必须受控（自己用 useState 维护）
- onChange 回调里更新 keys，外部 Button 根据 keys 长度判断启用
- type 区分 checkbox（多选）和 radio（单选）
- preserveSelectedRowKeys：true 让翻页不丢选择（跨页选择场景）

业务模式：选中 N 条 → 显示「批量删除（已选 N）」按钮 → 点击 Popconfirm 确认 → 调 API → 清空 selectedKeys + 重新加载。

expandable 用于「行展开详情」场景 ——
- expandedRowRender(row)：渲染展开内容
- rowExpandable(row)：判断行是否可展开（无详情的行隐藏展开图标）
- defaultExpandedRowKeys / expandedRowKeys：默认 / 受控展开
- expandRowByClick：点击行任意位置展开（提升 UX）

注意 expandedRowRender 返回的 ReactNode 会插入到下一行，
不要在里面再嵌套 Table（性能差，UX 也乱）—— 推荐用 Descriptions / Card。

虚拟滚动：v5 加 `virtual={true}` + `scroll={{ y: 500 }}` 一键启用 —— 1 万行也丝滑。
-->

---
transition: fade-out
---

# 反馈四件套（一）：Message + Notification

轻量提示（顶部） vs 详细通知（右上）

<v-click>

```tsx
import { App } from "antd";

function Demo() {
  const { message, notification } = App.useApp();
  return (
    <>
      <Button onClick={() =&gt; message.success("保存成功")}>Toast</Button>
      <Button onClick={() =&gt; notification.open({
        message: "新订单", description: "订单 #12345，¥199", placement: "topRight",
      })}>详细通知</Button>
    </>
  );
}

// 入口：ConfigProvider &gt; App &gt; Demo
```

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v5 强烈推荐用 App 组件 + useApp() 替代静态方法 ——

为什么？
- 静态方法 `message.success()` 拿不到 ConfigProvider 的 theme / locale
- 静态方法在 React 18 strict mode 下警告
- useApp() 返回的 message 自动消费 context，主题 / 语言完美继承

App 组件用法：
- 在 ConfigProvider 内、业务组件外包一层 <App>
- 业务里 const { message, notification, modal } = App.useApp()
- 然后正常调用 message.success() / notification.open() / modal.confirm()

Message 适合「成功 / 失败」的轻量提示：
- success / error / warning / info / loading
- 默认 3 秒自动消失，可改 duration
- 顶部居中显示，多条会堆叠

Notification 适合「需要更多信息」的通知：
- message（标题）+ description（描述）
- placement：topRight（默认）/ topLeft / bottomRight / bottomLeft
- 默认 4.5 秒，可改 duration: 0 永不消失
- 支持自定义 icon / btn / actions（适合「查看详情」类需求）

业务区分：操作反馈用 message，系统消息 / 长内容用 notification。
-->

---
transition: fade-out
---

# 反馈四件套（二）：Modal + Drawer

弹层（中央） vs 抽屉（侧边）

<v-click>

**Modal：命令式 + 声明式两种用法**

```tsx
const { modal } = App.useApp();
modal.confirm({ title: "确认删除？", okType: "danger",
  onOk: async () =&gt; { await api.deleteUser(id); } });

<Modal open={open} title="编辑用户" onOk={save} onCancel={close} confirmLoading={loading}>
  <UserForm />
</Modal>
```

</v-click>

<v-click>

**Drawer：侧边抽屉（适合大表单 / 详情）**

```tsx
<Drawer open={open} title="用户详情" width={520} onClose={close}>
  <Descriptions column={1}>
    <Descriptions.Item label="姓名">{user.name}</Descriptions.Item>
  </Descriptions>
</Drawer>
```

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Modal 两种用法：

**命令式（useApp().modal）**：适合「确认 / 警告 / 信息」类一次性弹层
- modal.confirm / modal.info / modal.warning / modal.error / modal.success
- 不需要 JSX，参数对象描述即可
- 适合危险操作前的二次确认

**声明式（&lt;Modal&gt;）**：适合「需要表单 / 复杂交互」的弹层
- open 受控显隐
- confirmLoading：onOk 期间按钮转圈
- destroyOnHidden（v5 新增）：关闭后销毁 children（避免状态残留）
- footer={null}：自定义底部（或不要底部）

[click] Drawer 是「大表单 / 详情」的最佳载体 ——

为什么不用 Modal？
- Modal 居中显示，弹层尺寸有限（最大约屏幕 80%）
- Drawer 从侧边滑入，高度顶天立地，可承载长表单
- Drawer 不会遮挡用户阅读「外面」的内容（如左侧列表）

业务模式：
- 列表 → 点击查看 → Drawer 显示详情（保留列表上下文）
- 列表 → 点击编辑 → Drawer 显示表单（保留列表上下文）
- 列表 → 点击新增 → Drawer 显示空表单
- 危险操作 → Modal.confirm 二次确认

Drawer width 推荐 520-720px，过窄表单挤压，过宽遮挡列表。
推荐用 destroyOnClose 关闭后销毁表单（避免下次打开看到旧值）。
-->

---
transition: fade-out
---

# Design Token 深度

Seed / Map / Alias 三层架构详解

<v-click>

```tsx
<ConfigProvider
  theme={{
    token: {
      // Seed Token —— 用户主改的根色板
      colorPrimary: "#722ed1",      // 主色
      colorSuccess: "#52c41a",      // 成功色
      colorWarning: "#faad14",      // 警告色
      colorError: "#ff4d4f",        // 错误色
      borderRadius: 8,              // 圆角
      fontSize: 14,                 // 基础字号
    },
    components: {
      // 组件级 override，仅影响 Button
      Button: { colorPrimary: "#13c2c2", borderRadius: 4 },
    },
  }}
>
  <App />
</ConfigProvider>
```

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Design Token 三层架构是 v5 的核心 ——

**Seed Token（种子层）**：用户主改的 ~30 个根变量
- 色：colorPrimary / colorSuccess / colorWarning / colorError / colorInfo
- 尺寸：borderRadius / fontSize / sizeUnit / sizeStep
- 动效：motionDurationFast / motionDurationMid / motionDurationSlow
- 字体：fontFamily / lineHeight

**Map Token（映射层）**：algorithm 自动派生的 ~200 个变量
- colorPrimaryBg / colorPrimaryBgHover / colorPrimaryBorder / colorPrimaryHover / colorPrimaryActive
- 用户基本不直接改，由 algorithm 计算
- 改 algorithm 就改了整套派生规则

**Alias Token（别名层）**：组件实际消费的 ~150 个语义变量
- colorBgContainer（容器背景）/ colorBgElevated（浮层背景）
- colorText / colorTextSecondary / colorTextTertiary
- colorBorder / colorBorderSecondary
- 改 Alias 影响所有用到该语义的组件

**组件级 override**：theme.components.Button.colorPrimary 只改 Button
- 适合「整站绿色但 Button 紫色」这类局部需求
- 优先级：组件级 &gt; 全局 token &gt; algorithm 默认

实战策略：
- 整站品牌色：改 token.colorPrimary
- 圆角紧凑风：改 token.borderRadius
- 单组件特殊化：改 components.{ComponentName}
- 完全自定义主题：自己写 algorithm 函数（高级）
-->

---
transition: fade-out
---

# algorithm 三套预设

defaultAlgorithm / darkAlgorithm / compactAlgorithm

<v-click>

```tsx
import { theme } from "antd";

<ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }} />   // 标准亮色
<ConfigProvider theme={{ algorithm: theme.darkAlgorithm }} />      // 标准暗色
<ConfigProvider theme={{ algorithm: theme.compactAlgorithm }} />   // 紧凑亮色
<ConfigProvider theme={{ algorithm: [theme.darkAlgorithm, theme.compactAlgorithm] }} />
```

</v-click>

<v-click>

| algorithm           | 用途                    | 适用场景               |
| ------------------- | ----------------------- | ---------------------- |
| `defaultAlgorithm`  | 标准亮色                | 默认 PC 端             |
| `darkAlgorithm`     | 标准暗色                | 夜间 / 监控大屏        |
| `compactAlgorithm`  | 紧凑（行高 / 间距缩小） | 数据密集后台 / 小屏    |

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] algorithm 是 v5 最巧妙的设计 ——

它本质是一个纯函数：(seedToken) =&gt; mapToken
- 输入：30 个 seed 变量
- 输出：200 个 map 变量

三套预设：

**defaultAlgorithm**：
- hover 色 = 主色亮 10%
- active 色 = 主色暗 10%
- disabled 色 = 主色 40% 透明
- 适合默认 PC 端

**darkAlgorithm**：
- 自动反转背景 + 文字
- hover / active 派生规则适配暗色
- 不是简单的「文字白色背景黑色」—— 而是完整的暗色系派生

**compactAlgorithm**：
- 行高从 32px → 28px
- 间距从 16px → 12px
- 字体微调，padding 缩小
- 适合数据密集场景（财务报表 / 监控大屏）

**叠加使用**：algorithm 接受数组，依次执行 ——
[darkAlgorithm, compactAlgorithm] = 紧凑暗色（最适合监控大屏）
[compactAlgorithm, defaultAlgorithm] = 紧凑亮色（最适合密集后台）

实战：根据用户偏好切换
```tsx
const [dark, setDark] = useState(false);
<ConfigProvider theme={{ algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
```

切换是「毫秒级」的 —— CSS-in-JS 重新生成样式注入 DOM，远比 Less 重新编译快。
-->

---
transition: fade-out
---

# 暗色模式 + 紧凑模式

useState + algorithm 数组叠加

<v-click>

```tsx
import { ConfigProvider, theme, Switch } from "antd";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [compact, setCompact] = useState(false);

  const algorithms = [
    dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    compact && theme.compactAlgorithm,
  ].filter(Boolean);

  return (
    <ConfigProvider theme={{ algorithm: algorithms as never }}>
      <Switch checked={dark} onChange={setDark} checkedChildren="🌙" />
      <Switch checked={compact} onChange={setCompact} checkedChildren="紧凑" />
      {children}
    </ConfigProvider>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 暗色 + 紧凑联合切换是企业后台标配 ——

实现要点：
- 两个 useState：dark / compact
- algorithm 数组：根据状态动态构造数组
- .filter(Boolean) 去除 false（compact 为 false 时不加 compactAlgorithm）

切换体验：
- 切换暗色：毫秒级，所有组件背景 / 文字 / 边框瞬时变化
- 切换紧凑：行高 + padding 同步变小，列表能看到更多行
- 持久化：useLocalStorage / cookie 保存用户偏好

注意细节：

- 切换主题时，第三方库（如 ECharts / antv）不会自动跟随 —— 需要监听主题变化重新渲染图表
- 自定义 token 与 algorithm 叠加 —— token 是「最终覆盖」，algorithm 在 token 之前执行
- 主题切换不影响 localStorage / cookie / 路由 —— 纯 UI 层切换，业务状态保留

useToken Hook：
```tsx
const { token } = theme.useToken();
return <div style={{ background: token.colorBgContainer, color: token.colorText }} />
```

useToken 让自定义组件也能消费 Design Token —— 实现「跟随主题的自定义组件」。
不要写硬编码颜色（#fff / #000），永远用 token 变量。
-->

---
transition: fade-out
---

# i18n 国际化

ConfigProvider + locale + dayjs

<v-click>

```tsx
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

export default function App() {
  const [lang, setLang] = useState<"zh" | "en">("zh");
  dayjs.locale(lang === "zh" ? "zh-cn" : "en");

  return (
    <ConfigProvider locale={lang === "zh" ? zhCN : enUS}>
      <Select value={lang} onChange={setLang}
        options={[{ value: "zh", label: "中文" }, { value: "en", label: "English" }]} />
      <YourApp />
    </ConfigProvider>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Ant Design 支持 70+ 语言 locale —— 全球化项目开箱即用 ——

locale 切换关键点：

- 单文件导入：`antd/locale/zh_CN` 或 `antd/locale/en_US`
- ConfigProvider 的 locale prop 接受 locale 对象
- 切换 locale 立即影响所有组件内置文案（Table 的「暂无数据」/ Calendar 月份名 / Pagination「上一页」/ DatePicker 占位等）

**dayjs locale 必须同步**（容易忘）：

Ant Design 5 默认日期库是 dayjs（v4 是 moment），DatePicker / Calendar 内部用 dayjs.format 显示日期。
如果 ConfigProvider 切到中文但 dayjs 仍是默认（en），DatePicker 的月份会显示「January / February」而非「一月 / 二月」。

正确做法：切换语言时同时 dayjs.locale('zh-cn')。

i18n 业务文案（如菜单 / 按钮 / 表单 label）：
- 用 react-i18next / formatjs 等独立方案
- Ant Design 的 locale 只管「组件内置文案」，不管业务文案

常见 locale：
- zh_CN：简体中文
- zh_TW：繁体中文（台湾）
- en_US：英语（美国）
- en_GB：英语（英国）
- ja_JP：日语
- ko_KR：韩语
- ar_EG：阿拉伯语（RTL 自动启用）

ConfigProvider direction="rtl" 可强制启用从右到左布局（阿拉伯 / 希伯来语场景）。
-->

---
transition: fade-out
---

# @ant-design/pro-components

企业级套件：ProTable / ProForm / ProLayout

<v-click>

```bash
pnpm add @ant-design/pro-components
```

**ProTable：查询 + 表格 + 分页一体化**

```tsx
import { ProTable, type ProColumns } from "@ant-design/pro-components";

const columns: ProColumns<User>[] = [
  { title: "ID", dataIndex: "id", search: false },
  { title: "姓名", dataIndex: "name" },
  { title: "状态", dataIndex: "status", valueType: "select",
    valueEnum: { on: { text: "启用", status: "Success" }, off: { text: "禁用", status: "Error" } } },
];

<ProTable<User> columns={columns} rowKey="id"
  request={async (p) =&gt; ({ data: await api.list(p), success: true })} />
```

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] pro-components 是 Ant Design 官方出品的「上层封装库」——

定位：把企业后台 80% 的重复代码（搜索 + 分页 + 表格 + 表单）封装成「业务级组件」。

核心组件：

- **ProTable**：搜索栏 + 表格 + 分页一体化，写一份 columns 解决「查询表单 + 数据展示」
- **ProForm**：高级表单，BetaSchemaForm / ModalForm / DrawerForm / StepsForm / QueryFilter 多种变体
- **ProLayout**：后台框架（顶栏 + 侧边栏 + 面包屑 + 多页签），Ant Design Pro 同款
- **ProDescriptions**：详情展示（支持编辑态）
- **ProList**：列表组件（卡片 / 列表两种形态）
- **ProCard**：增强版 Card（支持嵌套 / 标签页 / 折叠）

ProTable 的妙处：

- 一份 columns 同时定义「查询表单」和「数据列」——
  search: true 字段进入查询栏，search: false 字段只在表格显示
- valueType 自动识别字段类型：select / date / dateRange / digit / money
- valueEnum 自动渲染状态 Tag（status: Success / Error / Processing / Default）
- request 函数返回 `{ data, success, total }`，自动接管分页 / 排序 / 筛选

写一个企业级查询列表，传统方式需要 200 行（Form + Table + 分页 + 联动），
ProTable 大约 30 行就能搞定。

代价：bundle 较大（首次接入约 +200KB），适合「全站使用」而非「单页使用」。
推荐企业项目全员用 pro-components，C 端 / 轻量项目用原生 antd。
-->

---
transition: fade-out
---

# Next.js App Router + cssinjs SSR

@ant-design/nextjs-registry 一键搞定

<v-click>

```bash
pnpm add @ant-design/nextjs-registry
```

**app/layout.tsx**

```tsx
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          <ConfigProvider theme={{ token: { colorPrimary: "#1677ff" } }}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Next.js App Router + Ant Design 是「现代 React 全栈」的常见组合 ——

为什么需要 nextjs-registry？

Ant Design v5 用 CSS-in-JS 运行时生成样式 ——
传统 SSR 下，服务端渲染时样式没生成（HTML 是空的），
客户端 hydration 后才生成样式，导致首屏「闪一下」（flash of unstyled content / FOUC）。

@ant-design/nextjs-registry 解决方案：
- 服务端：收集所有用到的样式
- 注入到 HTML &lt;head&gt;
- 客户端 hydration：复用服务端样式，无闪烁

App Router 限制：

- 不能用 `&lt;Select.Option&gt;` 等「点语法」子组件（RSC 序列化问题）
- 解决：换成 options prop 写法 —— `&lt;Select options={[{ value, label }]} /&gt;`
- 或者：标记 'use client'，把组件改成客户端组件

服务端组件 vs 客户端组件：
- Ant Design 组件本身都是「客户端组件」（用到 React state / hooks）
- 业务页面如果用了 antd 组件 → 必须 'use client'
- 纯展示数据的页面可以保持服务端组件，单点用 antd 包装

Pages Router（旧版）的 SSR 配置不同 ——
要用 createCache + extractStyle 手动注入到 \_document.tsx。
新项目推荐直接 App Router + nextjs-registry。

Vite / Rsbuild / Umi 等不需要 SSR 的场景：不需要 nextjs-registry，直接用 antd 即可。
-->

---
transition: fade-out
---

# TypeScript 完整类型

ColumnsType / FormInstance / ConfigProviderProps

<v-click>

```tsx
import type {
  TableColumnsType,
  FormInstance,
  ConfigProviderProps,
  TableProps,
  ButtonProps,
} from "antd";

interface User { id: number; name: string }

const columns: TableColumnsType<User> = [
  { title: "ID", dataIndex: "id" },   // dataIndex 'id' 强类型校验
  { title: "姓名", dataIndex: "name" },
];

const onFinish: FormInstance<User>["validateFields"] = async () =&gt; ({} as User);

const tableProps: TableProps<User> = { columns, rowKey: "id", bordered: true };
```

</v-click>

<v-click>

> 💡 **提示**：Ant Design v5 全量 TS 重写，所有 props / event / refs 都有完整类型，
> Volar / VSCode 跳转 + 补全无缝衔接，dataIndex 拼错立刻报错。

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Ant Design v5 的 TypeScript 支持是「业界标杆」级别的 ——

完整类型导出清单：

- **数据类型**：TableColumnsType / FormInstance / SelectProps / MenuProps
- **组件 Props**：ButtonProps / TableProps / FormItemProps / ModalProps
- **事件类型**：TablePaginationConfig / SorterResult / FilterValue
- **主题类型**：ThemeConfig / ConfigProviderProps / AliasToken / SeedToken

泛型表格：

```tsx
const columns: TableColumnsType&lt;User&gt; = [...];
&lt;Table&lt;User&gt; columns={columns} dataSource={data} /&gt;
```

dataIndex 是 keyof User 的子集 —— 拼错字段名立刻 TS 报错。
render(value, row, index) 的 value 类型也自动推导（依赖 dataIndex）。

[click] FormInstance 是表单实例类型 ——

```tsx
const [form] = Form.useForm&lt;User&gt;();
form.setFieldsValue({ name: "Alice" });   // ok
form.setFieldsValue({ age: 18 });          // TS 报错：age 不在 User 上
```

业务代码可以做到「字段级别」的类型安全。

实战建议：
- 所有 interface 单独定义在 types.ts，复用到 columns / Form / API
- 复杂表单用 BetaSchemaForm + ProFormField，schema 自动推导类型
- 永远不要用 any，否则 TS 优势全部丢失

pro-components 提供的 ProColumns&lt;T&gt; 比 TableColumnsType&lt;T&gt; 更强 ——
支持 valueType / valueEnum 等扩展属性，类型更精细。
-->

---
transition: fade-out
---

# v4 → v5 迁移要点

CSS-in-JS / message API / locale / less 移除

<v-click>

| 变更             | v4                          | v5                       |
| ---------------- | --------------------------- | ------------------------ |
| **样式底层**     | Less 编译期                 | **CSS-in-JS 运行时**     |
| **CSS 导入**     | antd/dist/antd.css          | **不需要导入**           |
| **主题定制**     | modifyVars + Less 变量      | **Design Token + theme** |
| **暗色模式**     | dark.css 文件               | **darkAlgorithm 函数**   |
| **message 静态** | message.success(...)        | **App.useApp() Hook**    |
| **日期库**       | moment                      | **dayjs**                |
| **locale 路径**  | antd/lib/locale/zh\_CN      | **antd/locale/zh\_CN**   |

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v4 → v5 迁移是 Ant Design 历史上最大的一次 break change ——

核心变更：

**1. 样式底层革命**：
- v4 用 Less 编译期变量 + babel-plugin-import 按需引入
- v5 用 CSS-in-JS 运行时生成 —— 不需要 import CSS，不需要 babel 插件
- 主题定制从「修改 Less 变量」转向「Design Token + theme.algorithm」

**2. 日期库切换**：
- v4 内置 moment.js（~70KB gzipped）
- v5 切换到 dayjs（~7KB gzipped），bundle 大幅缩小
- DatePicker 接口从 moment 改为 dayjs，旧代码需要适配

**3. message / notification / modal**：
- v4 静态方法工作良好，但 ConfigProvider 主题 / locale 拿不到
- v5 仍支持静态方法，但推荐 App.useApp() 方式
- 入口必须包 &lt;App&gt; 才能用 useApp() Hook

**4. locale 路径变化**：
- v4 `import zhCN from 'antd/lib/locale/zh_CN'`
- v5 `import zhCN from 'antd/locale/zh_CN'`（去掉 lib/）
- IDE 自动重构基本能搞定

**5. 组件移除 / 合并**：
- Mentions 独立组件 → Input.Mentions（输入框扩展）
- Comment 组件移除 → 用 List + Card 自己组合
- BackTop 移除 → FloatButton.BackTop

迁移工具：
- antd 官方提供 codemod 工具 —— `npx @antd/codemod-v5 src`
- 自动重写 import 路径、CSS import 移除、API 替换
- 配合手动 check 跑通完整 e2e 测试

时间预估：中型项目（~5 万行）大约 1-2 周完成迁移 + 回归测试。
-->

---
transition: fade-out
---

# Ant Design 生态全景

X / Charts / Mobile / Mini / Pro

<v-click>

| 子项目                  | 用途                                  | 适用场景               |
| ----------------------- | ------------------------------------- | ---------------------- |
| **antd**                | 桌面 React UI 库                      | 企业后台 / Web 应用    |
| **@ant-design/pro-components** | 上层封装（ProTable / ProForm）       | 企业级中后台           |
| **Ant Design Pro**      | 完整脚手架（Umi + antd + pro）        | 一键搭建中后台         |
| **Ant Design X**        | AGI 时代 UI（Chat / Sender / Bubble） | AI 对话产品            |
| **Ant Design Charts**   | 数据可视化（G2 封装）                 | 图表 / 大屏            |
| **Ant Design Mobile**   | 移动端 React 组件库                   | 移动 Web 应用          |
| **Ant Design Mini**     | 小程序组件库                          | 支付宝 / 微信小程序    |

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Ant Design 已经从「单一 UI 库」演变成「全平台 React UI 体系」——

桌面端：
- antd：核心，企业后台首选
- @ant-design/pro-components：上层封装，企业项目效率工具
- Ant Design Pro：完整脚手架，几小时搭一个完整后台

AI 产品：
- Ant Design X：2024 年新推出，专门针对 AI 对话产品的 UI 库
- Chat / Sender / Bubble / Suggestion / Conversations 等 AI 特有组件
- ChatGPT-like 界面的开箱方案

数据可视化：
- Ant Design Charts：G2 / G6 / L7 封装，React-friendly API
- 提供 30+ 图表（折线 / 柱状 / 饼图 / 桑基 / 网络图等）

移动端：
- Ant Design Mobile：移动 Web 组件库（不是 React Native）
- 适合 H5 应用，相对 Vant 在 React 生态独占鳌头

小程序：
- Ant Design Mini：支付宝 / 微信小程序统一组件库
- 设计语言与 Ant Design 桌面端保持一致

设计资源：
- Figma / Sketch / Axure 完整设计稿
- 字体（汉仪文黑 / Inter）+ 图标库（@ant-design/icons）
- 设计原则（spec / values）+ 模式（patterns）

这一套体系让「设计师 → 开发 → 运营」全链路统一，是 B 端产品组织的最大价值。
-->

---
transition: fade-out
---

# 生态对比 / 选型矩阵

什么场景选 Ant Design？什么场景不选？

<v-click>

| 场景                       | 推荐                  | 原因                          |
| -------------------------- | --------------------- | ----------------------------- |
| React 企业后台             | **Ant Design**        | 组件最全 / 生态最深           |
| React 中后台 + 快速搭建    | **Ant Design Pro**    | Umi + pro 全家桶              |
| React C 端产品（颜值优先） | **MUI / Chakra UI**   | Material 风更现代             |
| React 重度定制 / 设计感强  | **Mantine / Radix**   | hooks 完整 / 无样式可深定制   |
| React 性能极致 / 小体积    | **Mantine / Chakra**  | Ant Design bundle 偏大        |
| React + AI 对话产品        | **Ant Design X**      | AI 特化组件                   |
| React Native               | **NativeBase / Tamagui** | Ant Design 不支持 RN       |

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 选型不是「哪个最好」，而是「哪个适合你的场景」——

**Ant Design 的核心优势场景**：
- 企业 B 端后台（运营 / 客服 / 数据系统）：默认选 Ant Design
- 中后台 + 快速搭建：Ant Design Pro 几小时起步
- 设计师团队已经熟悉 Ant Design：复用设计资源 / Figma
- 中文团队 / 国内业务：中文社区 + 资料最丰富

**Ant Design 不太适合的场景**：

- **C 端产品**：颜值偏 B 端中庸，年轻用户群更喜欢 Material Design 的张扬
  → 推荐 MUI（Google 美学）或 Chakra UI（友好简洁）

- **重度设计定制**：Ant Design 的组件已经「设计死」，深度定制需要覆盖 CSS
  → 推荐 Mantine（hooks 完整，组件可深度组合）或 Radix UI（无样式，完全自己写）

- **极致性能 / 小体积**：Ant Design bundle 较大（gzipped 全量 ~400KB）
  → 推荐 Mantine（~250KB）或自己拼 Radix + Tailwind（~50KB）

- **React Native**：Ant Design 不支持 RN（曾有 @ant-design/react-native 但已停更）
  → 推荐 NativeBase / Tamagui / Gluestack UI

- **小程序**：用 Ant Design Mini（不是 antd 本身）

选型小结：
- 不知道选什么 + B 端 → Ant Design
- 已经熟悉 Tailwind → 选 Radix UI / shadcn/ui（自行拼装）
- 设计师重度参与 → 跟设计师对齐选型
- 团队曾用过 Element Plus / Naive UI（Vue）→ Ant Design 心智模型最接近
-->

---
transition: fade-out
---

# 常见踩坑（一）：dayjs locale 不同步

DatePicker 月份显示英文的诡异问题

<v-click>

**症状**：ConfigProvider locale={zhCN} 设了，但 DatePicker 的「Jan / Feb」仍然英文

</v-click>

<v-click>

**原因**：Ant Design v5 底层是 dayjs，dayjs 自己的 locale 没切

</v-click>

<v-click>

**解法**：同时切 dayjs locale

```tsx
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");
```

</v-click>

<v-click>

**v5 + dayjs + locale 标准三件套**

```tsx
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");  // 必须！
<ConfigProvider locale={zhCN}>...</ConfigProvider>
```

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 v5 用户问得最多的「奇怪问题」之一 —— ConfigProvider 设了中文，DatePicker 还是英文。

[click] 原因：ConfigProvider 的 locale 只管「Ant Design 内置文案」——
比如 Table 的「暂无数据」/ Pagination 的「上一页」/ DatePicker 的「请选择日期」等。

但 DatePicker 显示的「月份名」/「星期名」是 dayjs 内部根据 dayjs.locale() 渲染的，
跟 Ant Design 的 locale 是「两个独立系统」。

v4 时代用 moment，moment 默认就是英文，需要手动 import 'moment/locale/zh-cn'。
v5 切到 dayjs，行为一样 —— dayjs 默认英文，需要手动设。

[click] 正确做法：把 dayjs.locale() 跟 ConfigProvider.locale 同步设置。

dayjs 的 locale 文件需要单独 import 才会注册：
- `import 'dayjs/locale/zh-cn'` 注册 zh-cn 包
- `dayjs.locale('zh-cn')` 切换到 zh-cn

如果不 import，调 dayjs.locale('zh-cn') 不报错但也不生效。

[click] 这套「双 locale 同步」是 v5 项目的标准模板 ——
任何用到 DatePicker / RangePicker / Calendar / TimePicker 的项目都必须这么写。

i18n 切换语言时，记得 dayjs.locale() 也要同步切：
```tsx
function setLanguage(lang) {
  dayjs.locale(lang === 'zh' ? 'zh-cn' : 'en');
  setAntdLocale(lang === 'zh' ? zhCN : enUS);
}
```

CHANGELOG 提示：v6 进一步把日期库做成可插拔，可换成 date-fns / luxon，但 v5 暂时只能 dayjs。
-->

---
transition: fade-out
---

# 常见踩坑（二）：SSR cssinjs 闪烁

Next.js / Remix 服务端首屏 FOUC

<v-click>

**症状**：Next.js App Router 下，首屏先看到无样式的 DOM，hydration 后样式才出现（闪一下）

</v-click>

<v-click>

**原因**：CSS-in-JS 运行时生成样式 —— 服务端 HTML 不带样式

</v-click>

<v-click>

**解法**：用 `@ant-design/nextjs-registry` 包根 + 同步 dayjs

```tsx
// app/layout.tsx
import { AntdRegistry } from "@ant-design/nextjs-registry";

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
```

</v-click>

<v-click>

> 💡 **注意**：App Router 不支持 `<Select.Option>` 点语法子组件，换成 `options` prop。

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] CSS-in-JS 的 SSR 是 v5 的「最大工程难题」——

[click] CSS-in-JS 的工作原理：
- 客户端：组件 render → 生成 CSS 字符串 → 注入 &lt;style&gt; 到 head
- 服务端：组件 render → 生成 CSS 字符串 → 但没有「注入到 head」的能力

结果：
- 服务端 HTML 不含 antd 样式（CSS 字符串生成了但没用上）
- 客户端 hydration 后，CSS 才注入到 head
- 用户看到「无样式 → 有样式」的瞬间闪烁（FOUC）

[click] @ant-design/nextjs-registry 的解决方案：

- 服务端渲染：收集所有 CSS 字符串到 registry
- next.js 的 useServerInsertedHTML hook：把收集到的 CSS 字符串注入到 HTML &lt;head&gt;
- 客户端：直接复用 HTML 里的 &lt;style&gt;，hydration 无闪烁

注意事项：

1. **&lt;AntdRegistry&gt; 必须在 RootLayout** —— 而不是某个子页面的 layout
2. **必须在 'use client' 之外** —— Registry 本身是 RSC 兼容的
3. **ConfigProvider 通常嵌套在 Registry 内部** —— 顺序：html → body → AntdRegistry → ConfigProvider → children

[click] App Router 的额外限制：

`&lt;Select.Option&gt;` / `&lt;Typography.Text&gt;` 等「点语法子组件」在 RSC 序列化中无法识别，
解决方案：
- 用 options prop：`&lt;Select options={[{ value, label }]} /&gt;`
- 或标记 'use client'，把页面整体作为客户端组件

新项目推荐直接用 options prop，避免 RSC 兼容性问题。

Pages Router 旧版（getServerSideProps / getStaticProps）：
不需要 nextjs-registry，但要写 createCache + extractStyle 手动注入 _document.tsx。
迁移到 App Router 后这套逻辑就废弃了。
-->

---
transition: fade-out
---

# 常见踩坑（三）：按需 + Tree-shaking

v5 默认即 tree-shake，无需 babel-plugin-import

<v-click>

**v4 时代需要 babel-plugin-import；v5 完全不需要 —— 直接 import 自动 tree-shake**

```tsx
import { Button, Table } from "antd";   // 只打包 Button + Table
```

</v-click>

<v-click>

| 写法                                     | 结果                       |
| ---------------------------------------- | -------------------------- |
| `import * as antd from "antd"`           | 全量打包（破坏 tree-shake） |
| `import "antd/dist/antd.css"`            | v5 不需要 CSS 文件         |
| `import { Button } from "antd/lib/..."`  | v5 内部路径已废弃          |
| `import { Button } from "antd"`          | 标准用法                   |

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v4 时代必须配 babel-plugin-import 才能按需引入 —— 否则 `import { Button } from 'antd'` 会把整个 antd 打进去。

[click] v5 完全不需要这个插件！

原因：v5 的 npm 包结构改造，每个组件单独打包成 ESM Module，
现代打包工具（Vite / webpack 5 / Rspack）能自动 tree-shake。
直接写 `import { Button } from 'antd'` 即可，未使用的组件不进 bundle。

[click] 常见错误：

**错误 1：`import * as antd`** —— 命名空间导入破坏 tree-shaking，
所有组件被打包，bundle 暴增。改用解构 import。

**错误 2：`import "antd/dist/antd.css"`** —— v5 用 CSS-in-JS，
不需要导入 CSS 文件。这个老习惯从 v4 项目迁移过来时容易残留。
如果代码里有这一行，删掉它（CSS 文件 v5 已经不存在了）。

**错误 3：`import { Button } from "antd/lib/button"`** —— v5 的内部路径变了，
直接从 `antd` 顶层 import 即可。如果想精确控制，用 `antd/es/button`（ESM 路径）。

**错误 4：错误的 dynamic import**：
```tsx
const Button = lazy(() =&gt; import("antd").then((m) =&gt; ({ default: m.Button })));
```
看起来按需，实际上 lazy 是 React 层级的代码分割，bundle 大小不一定改善。
正常 import + Vite/webpack 自动 split chunks 更靠谱。

实战验证 bundle：
- `pnpm build` 后看 dist/ 文件夹
- 用 `rollup-plugin-visualizer` 或 `webpack-bundle-analyzer` 看分组
- 单个组件如果出现在 bundle 里，可能是「样式 token 共享」（正常）

预期 bundle：
- 仅用 5-10 组件：gzipped ~80-120KB
- 中型项目（30+ 组件）：gzipped ~200-300KB
- 全量用：gzipped ~400KB
-->

---
transition: fade-out
---

# 常见踩坑（四）：static method 警告

React 18 strict mode 下的最佳实践

<v-click>

**症状**：开发环境控制台出现 `Warning: [antd: message] Static function can not consume context`

</v-click>

<v-click>

**原因**：静态方法 `message.success(...)` 无法访问 ConfigProvider 提供的 theme / locale

</v-click>

<v-click>

**解法**：包 &lt;App&gt; + useApp() Hook

```tsx
import { App, ConfigProvider } from "antd";

// 入口
<ConfigProvider>
  <App>
    <YourApp />
  </App>
</ConfigProvider>

// 业务
function MyButton() {
  const { message } = App.useApp();
  return <Button onClick={() =&gt; message.success("ok")}>提交</Button>;
}
```

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这个警告是 v5.1+ 加入的，提醒用户「静态方法不再是最佳实践」。

[click] 为什么静态方法有问题？

静态方法（如 `message.success()` / `notification.open()` / `Modal.confirm()`）
直接渲染到 document.body，绕过了 React 组件树 ——
- 拿不到 ConfigProvider 的 theme（暗色 / 主题色等不会跟随）
- 拿不到 locale（i18n 切换不影响）
- 拿不到 ErrorBoundary（异常无法被组件树捕获）
- React 18 strict mode 下警告说「静态方法不能消费 context」

[click] App 组件 + useApp() 是 v5 的官方解法 ——

工作原理：
- &lt;App&gt; 组件内部用 message.useMessage() / Modal.useModal() / notification.useNotification()
  各创建一个 contextHolder + 实例
- 通过 React context 暴露这三个实例
- useApp() Hook 消费 context，业务代码直接拿到能用的 message / modal / notification

优势：
- 主题 / locale 自动跟随 ConfigProvider
- ErrorBoundary 能捕获 modal / notification 内的异常
- 性能更好（contextHolder 仅渲染一次）
- 类型完整

旧代码迁移：
```tsx
// v4 / v5 旧写法
import { message } from 'antd';
message.success('ok');

// v5 推荐
const { message } = App.useApp();
message.success('ok');
```

迁移成本：
- 只在「需要正确响应主题 / locale 的场景」必须迁移
- 静态方法依然能用，只是不能消费 context
- 普通 PoC / 临时项目继续用静态方法没问题

App.useApp() 不能在 ConfigProvider / App 外部使用 —— 必须在组件树内部调用。
-->

---
transition: fade-out
---

# 评价

成熟稳定 / 设计体系 / 企业首选，但 bundle 偏大

<v-clicks>

**优点**

- 70+ 组件覆盖企业后台几乎所有场景
- Design Token + algorithm 是 React 生态最优雅的主题系统
- TypeScript 原生支持，类型完整
- 蚂蚁集团十年深耕，文档 / issue / 教程 / 模板中文资源极其丰富
- pro-components + Ant Design Pro 提供企业级脚手架

**缺点**

- 设计语言偏中后台通用风，C 端产品颜值不够
- bundle 大小较大（gzipped 全量 ~400KB），重度移动端不友好
- v4 → v5 迁移有不少 break change（CSS-in-JS / dayjs / locale 路径）
- 高级组件（Transfer / Tree / Cascader）API 偏复杂
- App Router 不支持点语法子组件需要适配

</v-clicks>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Ant Design 的优点高度集中 —— 「React 企业后台首选」一句话就总结 ——

70+ 组件覆盖度可能是 React 生态最完整的，新需求几乎不需要找额外组件库。
Design Token + algorithm 是 React UI 库中最精巧的主题系统 —— 函数式 + 三层架构。
TypeScript 支持「原生」级别 —— 不是后期补丁，是从设计之初就考虑。

蚂蚁集团十年深耕带来的「中文生态护城河」：
- 文档中英文并重，更新快
- issue 区中文回复率高，问题响应快
- 中文教程 / 视频 / 模板海量
- 国内大厂（蚂蚁 / 阿里 / 字节 / 滴滴 / 美团）几乎都在用

pro-components + Ant Design Pro 是「企业项目快速搭建」的核武器 ——
从 0 到「完整的中后台」只需要几天，省下数月的样板代码工作。

[click] 缺点也很明确：

**设计语言偏中后台通用风** ——
对 B 端用户（运营 / 客服）刚好够用，
但对 C 端用户（App 用户 / 消费者）显得「严肃 / 中庸」。
这是 Ant Design 的「历史包袱」，不是技术问题 ——
不修「企业 B 端审美」反而是它的定位。

**bundle 大小** ——
即使 tree-shake，CSS-in-JS 运行时本身就有开销，
依赖的 dayjs / react-rcomp 等也会带进来。
gzipped 全量约 400KB，比 Mantine（~250KB）/ Chakra（~300KB）大一些。
v6 zeroRuntime 模式可以改善，但牺牲了运行时主题切换能力。

**v4 → v5 迁移成本** ——
CSS-in-JS / dayjs / locale 路径都变了，
中型项目（5 万行）迁移大约 1-2 周 + 完整回归测试。

**高级组件 API 复杂** ——
Transfer（穿梭框）/ Cascader（级联选择）/ Tree（树形）的 prop 各有 30+，
slot / event 加起来超过 50 —— 新人需要查文档。

**App Router 适配** ——
点语法子组件（Select.Option / Typography.Text）在 RSC 下不能直接用，
需要重构成 options prop 写法。

选型逻辑：B 端 + 企业后台 = 默认 Ant Design，
C 端 + 移动端 = MUI / Chakra / 自己用 Tailwind + Radix。
-->

---
transition: fade-out
---

# 学习路径

从入门到企业级实战的 4 个阶段

<v-click>

**第 1 周：核心组件熟练**

- 通读官方文档 Data Entry + Data Display + Feedback 三大分组
- 写一个 CRUD 页面（Table + Form + Modal 三件套）

</v-click>

<v-click>

**第 2 周：主题 + i18n 精进**

- 跑通 Design Token + algorithm 切换暗色 / 紧凑
- 实现 i18n（中英切换）+ dayjs locale 同步

</v-click>

<v-click>

**第 3-4 周：企业级整合**

- 引入 pro-components 重构 CRUD 页面
- 接入 Ant Design Pro 脚手架 / Next.js App Router

</v-click>

<v-click>

**长期：源码 + 贡献** —— 阅读 Form / Table 核心源码，参与 issue / PR 贡献新组件。

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 第一周打基础 ——

官方文档结构清晰，按「Data Entry → Data Display → Feedback」顺序读最高效：
- Data Entry：Form / Input / Select / DatePicker 等输入组件
- Data Display：Table / Tree / Card / Tag 等展示组件
- Feedback：Message / Modal / Notification / Drawer 等反馈组件

每个组件页面都有 CodeSandbox playground，改例子比看例子快 10 倍。
完成一个 CRUD 页面就算入门：Table 展示 / Form 编辑 / Modal 承载 / message 反馈。

[click] 第二周进阶 ——

Design Token + algorithm 是 v5 的「软实力」分水岭 ——
能完整跑通 token 自定义 + algorithm 切换的开发者，已经超过 80% 同行。
暗色 / 紧凑 / i18n 是企业项目的标配，必须熟练。

dayjs locale 同步是「最容易忽略的细节」，必须养成肌肉记忆。

[click] 第三到四周企业级整合 ——

单独的 antd 只是「组件库」，要变成「企业后台」需要拼接：
- 路由：React Router 6 / Tanstack Router / Next.js App Router
- 状态：Zustand / Jotai / Redux Toolkit / Tanstack Query
- 构建：Vite / Rsbuild / Next.js
- 样式：Tailwind / CSS Modules / styled-components
- 表单：Ant Design Form（足够强大，不需要额外的 react-hook-form）
- 图表：Ant Design Charts / ECharts / Recharts

pro-components 把这套「组合」打包好了 —— 直接用 ProTable / ProForm / ProLayout，
省下数月的样板代码工作。

Ant Design Pro 更进一步，提供「完整的后台脚手架」——
登录 / 权限 / 菜单 / 多页签 / 国际化 全部预设好。

[click] 长期投入推荐看源码 ——

antd 的 Form / Table 源码是「React 组件库设计的优秀教材」，
读完会对「rc-field-form / 受控组件 / Context 优化」这些 React 高级模式有更深理解。
参与 issue / PR 是理解「为什么 API 这样设计」的最好方式 ——
组件库的演进逻辑通常体现在 Pull Request 的讨论里。
-->

---
transition: fade-out
---

# 延伸学习资源

官方 + 社区精选

<v-click>

**官方资源**

- 📖 [官方文档](https://ant.design/) —— 中英双语，质量第一档
- 💻 [GitHub](https://github.com/ant-design/ant-design) —— 90K+ star
- 🛍️ [Ant Design Pro](https://pro.ant.design/) —— 完整后台脚手架
- 🎨 [Pro Components](https://procomponents.ant.design/) —— 高级业务组件

</v-click>

<v-click>

**企业后台模板** —— [Ant Design Pro](https://pro.ant.design/)（官方 Umi 全家桶）/ [react-admin](https://marmelab.com/react-admin/)（第三方）

</v-click>

<v-click>

**配套技术栈**

- React Router 6 + Zustand + Vite + Tailwind = 黄金组合
- TanStack Query + dayjs + Ant Design Charts = 实用三件套

</v-click>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 官方资源是第一手信息 ——

官方文档中英文同步更新，每个组件都有完整 API 表 + CodeSandbox 示例。
GitHub 仓库的 issue 区是「问题解答的金矿」—— 你的问题 90% 已经有人提过。
Ant Design Pro 是「完整后台脚手架」—— 几小时起步一个完整中后台。
pro-components 文档单独成站，详细到「每个 prop 的用法」。

[click] 企业后台模板：

**Ant Design Pro**：
- 官方出品，蚂蚁内部数千项目同款脚手架
- 内置 Umi（蚂蚁出品的全家桶框架）+ antd + pro-components
- 提供登录 / 权限 / 多页签 / 国际化 / 主题切换全套
- 适合「快速搭建中大型后台」

**react-admin**：
- 第三方流行方案，基于 Material UI 但也支持 Ant Design
- 围绕「数据驱动」设计，CRUD 极快
- 适合「数据密集型后台」（CMS / ERP / 数据看板）

新项目推荐 Ant Design Pro 起步 —— 官方维护、文档完整、社区活跃。

[click] 配套技术栈：

「React Router 6 + Zustand + Vite + Tailwind」是 2024-2026 年 React 中后台主流。
- React Router 6：现代路由（v6 与 Tanstack Router 各有所好）
- Zustand：轻量状态管理（Redux 替代）
- Vite：现代构建工具
- Tailwind：原子 CSS（与 antd Token 系统正交配合）

TanStack Query（react-query）：服务端状态管理，配合 antd Form / Table 极佳
dayjs：日期处理事实标准（antd 内置）
Ant Design Charts：图表事实标准（基于 G2 / G6 / L7）

进阶选项：
- Next.js App Router（SSR + RSC）：Ant Design Pro 也支持
- Umi（蚂蚁全家桶）：路由 + 状态 + 构建一站式，但学习曲线陡
- Rsbuild（字节出品）：webpack 5 + Rspack 内核，构建速度极快
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 🐜

Ant Design — React 企业级 UI 的事实标准

<div class="mt-8 text-lg">

**核心心智**

- ConfigProvider 是全局配置中心，theme / locale / size 统一管
- Design Token 三层（Seed / Map / Alias）改 Seed 即可全站派生
- algorithm 是函数式主题，darkAlgorithm / compactAlgorithm 可数组叠加
- v5 用 dayjs，DatePicker 中文必须 dayjs.locale 同步
- App.useApp() 替代静态 message，能消费 ConfigProvider context

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://ant.design/" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/ant-design/ant-design" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://pro.ant.design/" target="_blank" class="slidev-icon-btn">
    <carbon:play /> Pro 脚手架
  </a>
</div>

<style>
h1 {
  background-color: #1677ff;
  background-image: linear-gradient(45deg, #1677ff 10%, #722ed1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：Ant Design = React 企业后台 UI 组件库的事实标准 —— 70+ 组件 + Design Token + 原生 TS + 中文最强生态。

核心心智五条：
1. ConfigProvider 是全局配置中心 —— theme / locale / componentSize 统一在此设置
2. Design Token 三层架构 —— 用户改 Seed Token，algorithm 自动派生 Map，组件消费 Alias
3. algorithm 函数式主题 —— defaultAlgorithm / darkAlgorithm / compactAlgorithm 可数组叠加
4. v5 默认日期库 dayjs —— DatePicker 中文展示必须 dayjs.locale('zh-cn') 同步
5. App.useApp() 替代静态 message —— 才能消费 ConfigProvider 提供的 theme / locale

下一步建议：
- 跟着官方文档 Form + Table 两大组件实战一个 CRUD 页面
- 把 Form 校验 + Table 服务端分页 + Modal 编辑全套打通
- 然后接入 pro-components 重构，体验「企业级开发」效率
- 最后用 Ant Design Pro 脚手架搭一个完整后台，对标蚂蚁内部产品

延伸学习：
- Design Token + algorithm 主题定制是「软实力」分水岭，必须练熟
- pro-components / Ant Design Pro 是「企业级开发效率」必备
- Next.js App Router + nextjs-registry 是「现代 React 全栈」标配
- Ant Design Charts / X / Mobile 等子生态按需取用

感谢观看！
-->
