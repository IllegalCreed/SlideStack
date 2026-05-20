---
theme: seriph
background: https://cover.sli.dev
title: Welcome to NG-ZORRO
info: |
  Presentation NG-ZORRO for Angular developers.

  Learn more at [https://ng.ant.design/](https://ng.ant.design/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-9xl">🐜</span>
</div>

<br/>

## NG-ZORRO — Ant Design for Angular

阿里出品的 Angular 企业级 UI 组件库（v21+），70+ 组件 + Less 主题 + Standalone-first + Zoneless 友好

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 NG-ZORRO —— Ant Design 的 Angular 实现，阿里集团 NG-ZORRO 团队出品，
2017 年起步至今九年迭代，是 Angular 生态中国出海的代表作。

当前主线 v21+，与 @angular/core 保持大版本同步：v21 对应 Angular 21。
70+ 高质量组件 + Less 主题系统 + Standalone-first + Zoneless / OnPush 高性能模式 + 完整 i18n。

核心卖点：
- 与 Ant Design React 1:1 同步设计语言（蚂蚁国际化设计体系）
- 阿里出品 + 中国生态最深的 Angular UI 库
- 4 套预编译主题（default / dark / compact / aliyun）+ 400+ Less 变量
- Standalone Components 默认 + Zoneless / OnPush 全面支持
- NzConfigService 全局配置 + i18n / locale 完整
- Schematic ng add 一键接入
-->

---
transition: fade-out
---

# 什么是 NG-ZORRO？

Ant Design 的 Angular 实现 —— 阿里出品的企业级 UI 组件库

<v-click>

- **70+ 组件**：General / Layout / Navigation / Data Entry / Data Display / Feedback / Other 七大分组
- **与 Angular 同步**：主版本号与 @angular/core 一致，v21 对应 Angular 21
- **Ant Design 同源**：与 antd 共享设计语言，跨端落地一致
- **Less 主题**：400+ Less 变量 + 4 套预设（default / dark / compact / aliyun）
- **Standalone-first**：v17+ 全面 Standalone，Module 与 Standalone 双轨可用
- **Zoneless / OnPush**：所有组件默认 OnPush，原生 Zoneless 兼容
- **NzConfigService**：全局组件默认值集中配置
- **完整 i18n**：70+ 语言 locale + dayjs locale 联动

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_NG-ZORRO_](https://ng.ant.design/)

</div>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NG-ZORRO 的核心定位非常清晰：「Ant Design 的 Angular 实现」——

不是简单的样式移植，而是设计语言 + 组件实现 + 工程套件的完整体系：
- 与 Ant Design React 同设计语言：色板 / 间距 / 字号 / 动效统一，跨端 1:1
- 70+ 高质量 Angular 组件，覆盖企业后台全部场景
- Standalone-first + Zoneless / OnPush 默认，符合现代 Angular 风格

为什么 Angular 生态需要 NG-ZORRO？
- Angular Material：Google 官方 Material 3，但中国 B 端用户习惯 Ant Design 风格
- PrimeNG：组件量大但风格不统一，设计语言较弱
- NG-ZORRO：填补「Angular + 中国 B 端 + Ant Design 设计语言」的空白

主版本号与 @angular/core 同步是 NG-ZORRO 的传统：
- v21 对应 Angular 21
- v20 对应 Angular 20
- 直观便于选版本，不再像 v8 / v9 那样要查兼容矩阵

下面会按「定位 → 演进 → 安装 → 第一个按钮 → 70+ 组件分组 → Form / Table / Modal → 主题 / i18n → 常见踩坑 → 学习路径」顺序讲透。
-->

---
transition: fade-out
---

# 定位与生态对比

Angular 生态四大 UI 库的横向对比

<v-click>

| 维度       | NG-ZORRO         | Angular Material | PrimeNG          | Ant Design React |
| ---------- | ---------------- | ---------------- | ---------------- | ---------------- |
| 设计语言   | **Ant Design**   | Material 3       | 多套主题         | Ant Design       |
| 框架       | **Angular**      | Angular          | Angular          | React            |
| 主导团队   | **阿里 NG-ZORRO**| Google 官方      | PrimeFaces       | 蚂蚁集团         |
| 组件数量   | 70+              | 60+              | 90+              | 70+              |
| 主题方案   | **Less 变量**    | design tokens    | CSS vars         | Token + algorithm|
| Standalone | **默认支持**     | 默认支持         | 默认支持         | -                |
| 中国生态   | **极强**         | 一般             | 一般             | 极强             |

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比 Angular 生态主流 UI 库 + Ant Design React，NG-ZORRO 的护城河是「Angular + Ant Design + 中国生态」三位一体。

设计语言：
- NG-ZORRO 走 Ant Design 企业中后台路线，与 antd 1:1 同步
- Angular Material：Google Material 3，国际化通用但中国 B 端味道不浓
- PrimeNG：组件量大但设计不统一，自由度高
- Ant Design React：同样的设计语言，但框架不同

主题方案：
- NG-ZORRO 仍用 Less 变量（与 antd v4 同源），400+ 变量精细控制
- Angular Material v17+ 转 design tokens（--mat-sys-* CSS 变量）
- PrimeNG v17+ 转 CSS vars（与 Tailwind 友好）
- antd v5 革新到 Token + algorithm 函数式主题（NG-ZORRO 仍是 Less，没跟进 v5 架构）

中国生态：
- NG-ZORRO 文档 / issue / 教程 / 模板中文资料极其丰富
- 阿里内部大量 Angular 项目背书，工程化沉淀深
- ng-alain 提供「企业项目级」中后台脚手架

选型逻辑：
- Angular + 中国 B 端 / Ant Design 风格 → NG-ZORRO（默认选项）
- Angular + 全球项目 / C 端 / 移动端 → Angular Material
- Angular + 富组件需求（DataTable / Chart） → PrimeNG
- React + Ant Design 风格 → Ant Design（antd）
-->

---
transition: fade-out
---

# 演进史

从 v0.5 到 v21 的九年

<v-click>

| 版本      | 时间    | 关键事件                                |
| --------- | ------- | --------------------------------------- |
| 0.5       | 2017    | 阿里 NG-ZORRO 团队首发，对标 antd v3    |
| 8.x       | 2019    | **跟随 Angular 版本号**，vX 对应 NgX    |
| 13.x      | 2021    | Ivy + 严格模式深度优化                  |
| 15.x      | 2022    | **Standalone Components 全面支持**      |
| 17.x      | 2023    | Standalone 默认 + provideNzIcons API    |
| 18.x      | 2024    | **Zoneless 实验性支持**                 |
| **21.x**  | 2025    | **当前主线**，与 Angular 21 同步发布    |

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NG-ZORRO 九年演进，几个里程碑值得记住：

0.5（2017）：阿里 NG-ZORRO 团队首发，对标 antd v3 设计语言。
最初是阿里内部 Angular 项目「Ant Design 移植版」，开源后填补 Angular 生态空白。

8.x（2019）：跟随 Angular 主版本号 —— 从此 v8 对应 Angular 8，v9 对应 Angular 9，简单直观。
之前还要查兼容矩阵的痛点彻底解决。

9.x（2020）：全面适配 Angular Ivy 渲染器，按需引入 + Tree-shaking 完善。

13.x（2021）：严格模式 + 严格类型检查，TypeScript 完整类型导出。

15.x（2022）：Standalone Components 全面支持 —— 不再强制 NgModule.declarations，
组件直接 imports: [NzButtonModule] 即可，与 Angular Material 同步演进。

17.x（2023）：Standalone 默认风格 + provideNzIcons / provideNzI18n 等 functional providers。

18.x（2024）：Zoneless 实验性支持 —— Angular v18 引入 ZoneJS-free 模式，
NG-ZORRO 所有组件默认 OnPush，零 Zone 兼容性良好。

21.x（2025）：当前主线版本，与 Angular 21 同步发布。
70+ 组件保持稳定，重心在性能优化 + 类型完善 + Zoneless 完整适配。
-->

---
transition: fade-out
---

# 与 Ant Design React 的关系

同设计语言，不同框架实现

<v-click>

| 维度       | NG-ZORRO         | Ant Design React  |
| ---------- | ---------------- | ----------------- |
| 框架       | Angular          | React             |
| 设计语言   | **Ant Design**   | **Ant Design**    |
| 主题       | Less 变量        | Token + algorithm |
| 当前架构   | Less 编译期      | CSS-in-JS 运行时  |
| 组件 API   | nz- 前缀指令     | React Component   |

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NG-ZORRO 与 Ant Design React 的关系：「同设计语言，不同框架实现」。

设计语言完全同源：
- 色板 / 字号 / 间距 / 圆角 / 阴影 / 动效 1:1 对齐
- 组件结构 / 交互行为高度一致（Button / Form / Table / Modal）
- API 命名风格类似（type / size / status / disabled）

实现层差异：
- NG-ZORRO 仍用 Less 变量（与 antd v4 同源架构）
- antd v5 已转 Token + algorithm，CSS-in-JS 运行时主题
- NG-ZORRO 没有跟进 v5 的 algorithm 架构，主题仍是 Less 编译期

API 风格差异：
- React：<Button type="primary">提交</Button>，组件式
- NG-ZORRO：button nz-button nzType="primary"，指令属性式
- 这是 Angular 模板系统的特色（HTML 优先 + 指令增强）

团队独立：
- 蚂蚁中后台体验技术部维护 antd
- 阿里 NG-ZORRO 团队（独立团队）维护 NG-ZORRO
- 设计稿在 antd 团队，NG-ZORRO 团队跟随实现

实战经验：
- 团队前端 React 用 antd，Angular 用 NG-ZORRO，设计稿可复用，无需重新画
- 跨技术栈项目（H5 + 中后台）设计风格统一
- NG-ZORRO 文档可参考 antd 文档作为补充（属性多数同名同义）
-->

---
transition: fade-out
layoutClass: gap-x-8
layout: two-cols-header
---

# 安装与初始化

ng add 一键接入，自动配置主题 + 图标 + i18n

::left::

<v-click>

**安装（推荐）**

```bash
ng add ng-zorro-antd
```

Schematic 询问：
1. 启用图标动态加载？
2. 选择主题（default / dark / compact / aliyun）
3. 选择默认语言（zh_CN / en_US / ...）

**手动安装**

```bash
npm install ng-zorro-antd
```

</v-click>

::right::

<v-click>

**自动配置**

- angular.json 引入主题 CSS
- app.config.ts 注入 provideNzI18n
- 默认图标集预注册

**版本要求（v21）**

- Angular ^21.0.0
- TypeScript 5.5+ / Node.js 20+

**升级**

```bash
ng update ng-zorro-antd
```

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NG-ZORRO 强烈推荐用 ng add 命令安装 —— schematics 自动完成所有配置。

ng add 一键流程：
1. 自动装 ng-zorro-antd + 必要 peer dependencies
2. 让你选图标加载策略（动态推荐，bundle 更小）
3. 让你选主题（default 是最常用）
4. 让你选默认 i18n（zh_CN / en_US 等 70+ 语言）
5. 可选引入 ng-alain 企业级模板

手动安装：npm install ng-zorro-antd 装好后需要：
- 手动 import 主题 CSS（@import "ng-zorro-antd/style.css"）
- 手动注入 provideNzI18n
- 手动注册图标
比 ng add 麻烦很多，新项目优先用 ng add。

[click] ng add 自动配置项：
- angular.json：styles 数组加入主题 CSS（或 Less 入口）
- app.config.ts：providers 加入 provideNzI18n(zh_CN) / provideNzIcons(icons)
- styles.less：根入口 import Less 变量
- 默认图标集：常用 50+ 图标静态预注册

版本要求（v21）：
- Angular ^21.0.0（主版本号一致）
- TypeScript 5.5+（与 Angular 21 同步）
- Node.js 20+（LTS）

ng update 升级：
- 升级到下个大版本：ng update ng-zorro-antd
- 自动跑 migration schematics 修正 breaking changes
- v17 → v18 → v19 → v20 → v21 逐版升级稳妥

注意事项：
- 升级建议跟 Angular 主版本同步，不要跨 3 个版本以上
- 升级前看 CHANGELOG，主版本可能有 breaking changes
- 严格模式（strict）配合 ng-zorro 表现最佳
-->

---
transition: fade-out
---

# 第一个 NzButton

最常用的按钮组件，5 种类型 + 3 种尺寸

<v-click>

```ts
import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-button-demo',
  imports: [NzButtonModule, NzIconModule],
  template: `
    <button nz-button nzType="primary">主按钮</button>
    <button nz-button nzType="default">次按钮</button>
    <button nz-button nzType="dashed">虚线按钮</button>
    <button nz-button nzType="text">文字按钮</button>
    <button nz-button nzType="primary" nzDanger>危险按钮</button>
    <button nz-button nzType="primary" nzLoading>加载中</button>
    <button nz-button nzType="primary" nzShape="circle">
      <nz-icon nzType="search" />
    </button>
  `,
})
export class ButtonDemoComponent {}
```

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NzButton 是 NG-ZORRO 最常用的组件，5 种类型 + 3 种尺寸 + 多种状态。

API 风格：button 元素 + nz-button 指令 + nzType / nzSize / nzShape 配置属性。
这是 Angular 「指令属性式」的典型设计 —— HTML 优先 + 指令增强，不像 React 的组件式。

5 种 type：
- primary：主操作（CTA 蓝色）
- default：次操作（白底带边框）
- dashed：虚线按钮（次次操作）
- text：文字按钮（最弱）
- link：链接按钮（蓝色文字）

状态：
- nzLoading：加载中（图标 spin + 禁用）
- nzDanger：危险（红色，配合 type）
- nzGhost：幽灵模式（透明背景）
- nzBlock：撑满宽度

尺寸：
- nzSize="large" / "default" / "small"

形状：
- nzShape="default" / "circle" / "round"

实战经验：
- 主操作用 nzType="primary"
- 次操作用 nzType="default"
- 弱操作用 nzType="text"
- 风险用 nzDanger
- 图标按钮用 nzShape="circle" + 内部 nz-icon
- 长按提交用 nzLoading 反馈

OnPush 友好：所有 NG-ZORRO 组件都是 OnPush 模式，性能优秀。
Zoneless 兼容：不依赖 Zone.js，Angular v18+ 可直接 Zoneless 模式。
-->

---
transition: fade-out
---

# 70+ 组件分类速览

按功能分七大组的完整矩阵

<v-click>

| 分组         | 组件                                                              |
| ------------ | ----------------------------------------------------------------- |
| **General**  | Button / Icon / Typography                                        |
| **Layout**   | Divider / Grid / Layout / Space                                   |
| **Nav**      | Breadcrumb / Dropdown / Menu / Pagination / Steps / Tabs          |
| **Entry**    | Checkbox / DatePicker / Form / Input / Select / Slider / Switch   |
| **Entry**    | AutoComplete / Cascader / Radio / Rate / TreeSelect / Upload      |
| **Display**  | Avatar / Badge / Card / Carousel / List / Statistic / Table       |
| **Feedback** | Alert / Drawer / Message / Modal / Notification / Spin            |

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NG-ZORRO 组件按功能分七大组，70+ 组件覆盖企业后台全部场景。

General 通用：Button / Icon / Typography —— 基础展示元素，所有页面都会用。

Layout 布局：Divider / Grid / Layout / Space —— 页面骨架。
- Layout：header / sider / content / footer 组合
- Grid：24 栅格响应式（与 antd 同源）
- Space：组件间距统一

Navigation 导航：Affix / Breadcrumb / Dropdown / Menu / Pagination / Steps / Tabs。

Data Entry 数据录入：AutoComplete / Cascader / Checkbox / DatePicker / Form / Input / InputNumber / Mention / Radio / Rate / Select / Slider / Switch / TimePicker / Transfer / TreeSelect / Upload。

Data Display 数据展示：Avatar / Badge / Calendar / Card / Carousel / Collapse / Comment / Descriptions / Empty / Image / List / Popover / Statistic / Table / Tag / Timeline / Tooltip / Tree。

Feedback 反馈：Alert / Drawer / Message / Modal / Notification / Popconfirm / Progress / Result / Skeleton / Spin。

Other 其他：Anchor / BackTop / ConfigProvider。

总计 70+ 组件，覆盖企业级应用 95% 场景，剩下 5% 通过 @angular/cdk 或第三方库补充。

每个组件都有完整：
- 中英文文档
- TypeScript 类型导出
- OnPush + Zoneless 兼容
- i18n locale 支持
- 单元测试覆盖
-->

---
transition: fade-out
---

# NzForm + Reactive Forms

表单三件套：nz-form-item / nz-form-label / nz-form-control

<v-click>

```ts
@Component({
  imports: [NzFormModule, NzInputModule, NzButtonModule, ReactiveFormsModule],
  template: `
    <form nz-form [formGroup]="form">
      <nz-form-item>
        <nz-form-label nzRequired>用户名</nz-form-label>
        <nz-form-control nzErrorTip="请输入用户名">
          <input nz-input formControlName="username" />
        </nz-form-control>
      </nz-form-item>
      <button nz-button nzType="primary" [disabled]="form.invalid">登录</button>
    </form>
  `,
})
export class LoginFormComponent {
  form = inject(FormBuilder).group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
}
```

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NzForm 是 NG-ZORRO 最常用的复合组件，与 Angular Reactive Forms 完美集成。

表单三件套结构：
- form nz-form [formGroup]：表单根容器
- nz-form-item：每一行表单项（label + control）
- nz-form-label：标签区（左侧固定宽度）
- nz-form-control：控件区（包裹实际 input）

布局方案：
- nzLayout="horizontal" 默认（label + control 横排）
- nzLayout="vertical"（label 在上 control 在下）
- nzLayout="inline"（一行多个 form-item）

栅格：
- nz-form-label [nzSpan]="6"：标签占 6 格
- nz-form-control [nzSpan]="14"：控件占 14 格
- 总和 24 与 nz-grid 一致

验证反馈：
- nzErrorTip：错误时显示的提示文字
- nzExtra：额外说明文字
- nzRequired：标签前红星
- nz-form-control 自动监听 FormControl 状态显示 success / warning / error / validating

与 Reactive Forms 集成：
- FormBuilder + FormGroup + FormControl
- formControlName 绑定（不是 ngModel）
- 内置 Validators.required / minLength / pattern / email

无障碍：
- 自动 ARIA labelledby
- 错误信息 ARIA describedby
- 键盘焦点正确

实战经验：
- 复杂表单一律用 Reactive Forms（不要混 Template Forms）
- 错误显示用 nzErrorTip（短文字）+ nzValidateStatus（控制状态）
- 联动校验用 FormGroup.setValidators / updateOn
- 动态表单用 FormArray
-->

---
transition: fade-out
---

# NzInput + 高级输入

文本框、输入数字、自动完成、级联选择

<v-click>

```ts
@Component({
  imports: [NzInputModule, NzInputNumberModule,
    NzAutocompleteModule, NzCascaderModule, FormsModule],
  template: `
    <input nz-input placeholder="基础" [(ngModel)]="text" />
    <nz-input-group nzPrefixIcon="user">
      <input nz-input [(ngModel)]="text" />
    </nz-input-group>
    <nz-input-number [(ngModel)]="count" [nzMin]="0" [nzMax]="100" />
    <input nz-input [nzAutocomplete]="ac" [(ngModel)]="search" />
    <nz-autocomplete #ac>
      @for (opt of options; track opt) {
        <nz-auto-option [nzValue]="opt">{{ opt }}</nz-auto-option>
      }
    </nz-autocomplete>
    <nz-cascader [nzOptions]="cascaderOptions" [(ngModel)]="addr" />
  `,
})
export class InputDemoComponent {
  text = ''; count = 1; search = ''; addr: string[] = [];
  options = ['Apple', 'Banana']; cascaderOptions = [];
}
```

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NG-ZORRO 输入类组件矩阵丰富，覆盖企业表单常见场景。

NzInput：基础文本框
- input nz-input 指令式
- 大小：nzSize="large" / "default" / "small"
- 状态：nzStatus="error" / "warning"
- 与 ngModel / FormControl 双向绑定

NzInputGroup：输入框组合（前缀 / 后缀 / 圆角分隔）
- nzPrefix / nzSuffix 前缀后缀
- nzPrefixIcon 前缀图标快捷
- nzAddOnBefore / nzAddOnAfter 边贴边附加

NzInputNumber：数字输入框
- nzMin / nzMax 范围
- nzStep 步长
- nzPrecision 精度
- nzFormatter / nzParser 自定义显示

NzAutoComplete：自动完成
- 输入触发候选列表
- nz-autocomplete + nz-auto-option
- nzDataSource 简化数据源

NzCascader：级联选择
- 适合省市区 / 分类树
- nzOptions 树形数据
- nzChangeOn / nzShowSearch 高级配置

NzSelect：下拉选择
- 单选 / 多选 / 标签 / 远程搜索
- 配合 nz-option / nz-option-group
- 与 ngModel / FormControl 集成

NzDatePicker / NzTimePicker：日期时间
- 基于 dayjs（v15+）
- 区间选择 / 周 / 月 / 季 / 年模式
- i18n locale 自动联动

实战经验：
- 输入框统一用 nz-input + ngModel / formControlName
- 复合输入用 nz-input-group 包裹（不要手动拼 CSS）
- 数字 / 货币用 nz-input-number + nzPrecision
- 日期一律用 nz-date-picker（不用原生 input[type=date]）
-->

---
transition: fade-out
---

# NzTable 完整方案

数据表格 + 分页 + 排序 + 过滤

<v-click>

```ts
@Component({
  imports: [NzTableModule, NzButtonModule],
  template: `
    <nz-table #t [nzData]="data" [nzLoading]="loading"
      [nzPageSize]="10" (nzQueryParams)="onQuery($event)">
      <thead><tr>
        <th nzColumnKey="name" [nzSortFn]="true">姓名</th>
        <th [nzFilters]="filters" [nzFilterFn]="true">地址</th>
      </tr></thead>
      <tbody>
        @for (row of t.data; track row.id) {
          <tr><td>{{ row.name }}</td><td>{{ row.addr }}</td></tr>
        }
      </tbody>
    </nz-table>
  `,
})
export class TableDemoComponent {
  data: any[] = []; loading = false;
  filters = [{ text: '北京', value: 'Beijing' }];
  onQuery(p: NzTableQueryParams) {}
}
```

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NzTable 是 NG-ZORRO 最复杂、最常用的数据展示组件。

核心结构：与原生 W3C table 标准一致：
- nz-table 容器
- thead / tbody
- th / td 完整保留
- @for / @if 控制流（v17+）

这是 NG-ZORRO 设计哲学的体现：「不重新发明 table」，直接增强原生标签。

数据绑定：
- [nzData] 数据源（前端分页时用）
- table.data 表格内部分页 / 排序 / 过滤后的数据（用于 tbody）

分页：
- [nzFrontPagination]="false" 服务端分页
- [nzTotal] 总数
- [nzPageIndex] 当前页
- [nzPageSize] 每页大小
- nzShowSizeChanger / nzShowQuickJumper UI 配置

排序：
- [nzSortFn]="true" 服务端排序（不在前端排）
- [nzSortFn]="fn" 前端排序函数
- nzSortOrder 受控排序

过滤：
- [nzFilters] 过滤选项数组
- [nzFilterFn]="true" 服务端过滤

服务端模式（重点）：
- (nzQueryParams)="onQueryParams($event)" 监听变化
- 一次性给所有 pageIndex / pageSize / sort / filter
- 服务端返回数据，前端用 [nzData] + [nzTotal] 绑定

高级特性：
- 固定列 nzWidth + nzLeft / nzRight
- 固定表头 [nzScroll]="{ y: '400px' }"
- 行选择 nz-table-checkbox-cell
- 行展开 nzExpand
- 拖拽排序（配合 @angular/cdk/drag-drop）

性能：
- 所有组件 OnPush，trackBy 必填（@for track 强制）
- 万条数据用 NzTable + CDK Virtual Scroll（下页讲）
-->

---
transition: fade-out
---

# NzTable 虚拟滚动

万行数据流畅渲染，配合 @angular/cdk/scrolling

<v-click>

```ts
@Component({
  imports: [NzTableModule, ScrollingModule],
  template: `
    <nz-table [nzData]="bigData" [nzScroll]="{ y: '400px' }"
      [nzVirtualItemSize]="48"
      [nzVirtualForTrackBy]="trackById"
      [nzShowPagination]="false">
      <thead><tr><th>ID</th><th>姓名</th><th>地址</th></tr></thead>
      <tbody>
        <ng-template nz-virtual-scroll let-row>
          <tr><td>{{ row.id }}</td><td>{{ row.name }}</td><td>{{ row.addr }}</td></tr>
        </ng-template>
      </tbody>
    </nz-table>
  `,
})
export class VirtualTableComponent {
  bigData = Array.from({ length: 10000 }, (_, i) =>
    ({ id: i, name: `用户${i}`, addr: `地址${i}` }));
  trackById = (_: number, row: any) => row.id;
}
```

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NzTable 虚拟滚动方案 —— 配合 @angular/cdk/scrolling 实现万行数据流畅渲染。

为什么需要虚拟滚动？
- 前端一次渲染 10000 行 DOM 节点，浏览器卡死
- 服务端分页 + 虚拟滚动结合，无限滚动体验

关键配置：
- [nzVirtualItemSize]="48"：每行固定高度 48px（必填！）
- [nzVirtualMinBufferPx]：滚动缓冲区下限
- [nzVirtualMaxBufferPx]：滚动缓冲区上限
- [nzVirtualForTrackBy]：trackBy 函数（必填！）

特殊语法：
- tbody 内用 ng-template nz-virtual-scroll
- let-row let-index="index" 取数据

限制：
- 行高必须固定（虚拟滚动算法依赖固定高度）
- 不支持表头粘性 + 多级表头同用
- 不支持行展开（cdk virtual scroll 不支持动态高度）

性能优化：
- trackBy 必填（不写 trackBy 等于没用虚拟滚动）
- 列宽 nzWidth 固定（避免 reflow）
- 行内组件全 OnPush

实战经验：
- 1000 行以下不用虚拟滚动（直接服务端分页）
- 1000-10000 行考虑虚拟滚动 + 服务端分页混用
- 10000+ 行必须虚拟滚动 + 滚动加载

替代方案：
- 服务端分页（nzFrontPagination=false）—— 最常用
- 虚拟滚动 —— 大数据 + 客户端处理
- 无限滚动 —— 移动端模式

vs Angular Material：
- Material 用 cdk-virtual-scroll-viewport 独立组件
- NG-ZORRO 用 nz-virtual-scroll 集成在表格内
- NG-ZORRO 更简洁，但灵活度略低
-->

---
transition: fade-out
---

# nzQueryParams 服务端分页

一个事件处理分页 + 排序 + 过滤

<v-click>

```ts
// NzTableQueryParams 结构
interface NzTableQueryParams {
  pageIndex: number; pageSize: number;
  sort: { key: string; value: 'ascend' | 'descend' | null }[];
  filter: { key: string; value: any[] }[];
}

// 服务端模式：一个回调统一处理
export class ServerTableComponent {
  list: any[] = []; total = 0; loading = false;
  http = inject(HttpClient);
  onQuery(p: NzTableQueryParams) {
    const sort = p.sort.find(s => s.value !== null);
    this.loading = true;
    this.http.get<any>('/api/users', { params: {
      page: p.pageIndex, size: p.pageSize,
      sortField: sort?.key ?? '', sortOrder: sort?.value ?? '',
    } }).subscribe(res => {
      this.list = res.data; this.total = res.total; this.loading = false;
    });
  }
}
```

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] nzQueryParams 是 NG-ZORRO Table 的「服务端模式入口」——
一个事件回调统一处理分页、排序、过滤变化。

NzTableQueryParams 结构：
- pageIndex: number（当前页）
- pageSize: number（每页大小）
- sort: { key: string; value: 'ascend' | 'descend' | null }[]（排序数组）
- filter: { key: string; value: any[] }[]（过滤数组）

为什么是数组？
- 支持多列同时排序 / 过滤
- 每列状态独立
- 业务可自行决定单选 / 多选模式

服务端模式必备配置：
1. [nzFrontPagination]="false" 关闭前端分页
2. [nzTotal]="total" 给后端返回的总数
3. [nzPageIndex] / [nzPageSize] 受控
4. [nzData] 给当前页数据
5. (nzQueryParams) 监听变化
6. [nzSortFn]="true" 每列开启服务端排序
7. [nzFilterFn]="true" 每列开启服务端过滤

陷阱：
- 初次渲染会触发一次 nzQueryParams（pageIndex=1）
- 防止重复请求：用 debounceTime / distinctUntilChanged
- 排序状态变化时 pageIndex 自动回到 1

实战经验：
- 用 RxJS BehaviorSubject 收集 query 状态
- combineLatest 合并多个查询条件
- switchMap 切换请求（自动取消上次请求）
- 错误处理：catchError + retry

对比 antd（React）：
- antd Table 用 onChange(pagination, filters, sorter)
- NG-ZORRO 用 (nzQueryParams)="onQuery($event)"
- 一个事件 vs 多个参数，本质相同

代码组织建议：
- 状态用 signal / BehaviorSubject 集中管理
- 抽 useTable composable 复用查询逻辑
- 错误状态 + loading 状态用 ResourceState 模式
-->

---
transition: fade-out
---

# 反馈四件套

Modal / Drawer / Notification / Message

<v-click>

```ts
@Component({
  imports: [NzButtonModule],
  template: `
    <button nz-button (click)="confirm()">确认</button>
    <button nz-button (click)="doNotify()">通知</button>
    <button nz-button (click)="doMessage()">消息</button>
    <button nz-button (click)="doDrawer()">抽屉</button>
  `,
})
export class FeedbackDemo {
  modal = inject(NzModalService);
  notification = inject(NzNotificationService);
  message = inject(NzMessageService);
  drawerSvc = inject(NzDrawerService);

  confirm = () => this.modal.confirm({ nzTitle: '确认删除？' });
  doNotify = () => this.notification.success('成功', '已保存');
  doMessage = () => this.message.info('提示');
  doDrawer = () => this.drawerSvc.create({
    nzTitle: '标题', nzContent: '内容', nzPlacement: 'right' });
}
```

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NG-ZORRO 反馈四件套 —— 企业后台最常用的浮层组件，覆盖所有反馈场景。

四件套各司其职：

NzModal（模态对话框）：
- 强反馈，需用户决策
- 适合：确认操作 / 表单弹窗 / 详情查看
- API：NzModalService.create / .confirm / .info / .success / .error / .warning
- 配置：nzTitle / nzContent（可传 string / Template / Component）/ nzFooter / nzWidth

NzDrawer（抽屉）：
- 侧边滑出，承载较多内容
- 适合：详情面板 / 表单编辑 / 多步流程
- 四方向：top / right（默认）/ bottom / left
- API：NzDrawerService.create({ nzContent, nzPlacement })

NzNotification（通知）：
- 右上角浮窗，自动消失
- 适合：异步操作完成 / 系统通知
- 四种语义：success / info / warning / error
- API：NzNotificationService.success(title, content, options)

NzMessage（轻量消息）：
- 顶部短提示，自动消失
- 适合：简单反馈（保存成功 / 删除完成）
- 文字短 + 无标题
- API：NzMessageService.success / .info / .warning / .error / .loading

如何选？
- 需要确认 → Modal
- 详细信息 → Drawer
- 异步完成（带标题）→ Notification
- 简单反馈 → Message

调用方式：
- 全部用 inject() 服务式调用
- 不用模板里写组件
- 服务式更解耦，与业务逻辑融合

Component 模式（高级）：
- nzContent 可传组件 Component 类
- nzData 传入 props
- 组件内 inject(NzModalRef) 控制关闭 + 返回值

实战经验：
- 二次确认一律 Modal.confirm
- 表单弹窗用 Modal + Component 模式
- 复杂详情用 Drawer
- 简单反馈用 Message（轻量）
- 异步成功 / 错误用 Notification（不打断流程）
-->

---
transition: fade-out
---

# NzIcon 静态 vs 动态

图标系统：静态注册 + Lazy patch + 动态加载

<v-click>

```ts
// 静态注册（常用图标）
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { SearchOutline, EditOutline } from '@ant-design/icons-angular/icons';

export const appConfig: ApplicationConfig = {
  providers: [provideNzIcons([SearchOutline, EditOutline])],
};

// Lazy 模块单独 patch 图标
import { provideNzIconsPatch } from 'ng-zorro-antd/icon';
import { UserOutline } from '@ant-design/icons-angular/icons';

export const userRoutes: Route[] = [{
  path: 'users',
  providers: [provideNzIconsPatch([UserOutline])],
  loadComponent: () => import('./user-page'),
}];

// 模板使用
@Component({ imports: [NzIconModule],
  template: `<nz-icon nzType="search" /><nz-icon nzType="loading" nzSpin />`,
}) export class IconDemo {}
```

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NG-ZORRO 图标系统基于 SVG，提供三种加载策略。

策略 1：静态注册（recommended for small icon set）
- 用 provideNzIcons([...icons]) 显式列举要用的图标
- 图标 SVG 编译进 bundle，无 HTTP 请求
- 适合：图标数少（小于 30 个）/ 离线应用
- 缺点：bundle 体积增加

策略 2：动态加载（recommended for large icon set）
- angular.json 配置 assets，将 ng-zorro 图标目录复制到静态资源
- 用到时按需 fetch SVG 文件
- 适合：图标多 / 在线应用
- 优势：bundle 小，按需加载

策略 3：Lazy Module Patch（推荐路由懒加载场景）
- 用 provideNzIconsPatch([...icons]) 在 lazy module 内补充图标
- 不影响主 bundle，只在懒加载时加载
- 适合：路由级图标按页面拆分

NzIcon API：
- nzType="search"：图标名
- nzTheme="outline" / "fill" / "twotone"：主题
- nzSpin：旋转动画（loading 场景）
- nzTwotoneColor：双色图标主色

图标命名规范：
- {name}Outline / {name}Fill / {name}Twotone
- 对应 nzType + nzTheme

自定义图标：
- 直接在 <nz-icon>...</nz-icon> 内嵌 SVG
- 或 NzIconService.addIcon(SvgDef)
- 或 fetchFromIconfont() 集成 iconfont.cn

实战经验：
- 项目初期统计常用图标列表（30-50 个）
- 用 provideNzIcons 静态注册（最简单）
- 项目扩大后改动态加载（bundle 优化）
- 路由懒加载用 provideNzIconsPatch 拆分
- 业务图标自定义 + iconfont.cn 集中管理

陷阱：
- 不注册的图标用了报 warning（控制台 [NG-ZORRO] icon-name not found）
- ng add 默认注册一批常用图标，可在 app.config.ts 查看
- v17+ 用 functional providers（provideNzIcons），不再用 NgModule.forRoot
-->

---
transition: fade-out
---

# 4 套预编译主题

default / dark / compact / aliyun —— 一行 CSS 切换

<v-click>

```css
/* 方案 1：单一主题（最简单） */
@import 'ng-zorro-antd/ng-zorro-antd.css';        /* default */
/* ng-zorro-antd.dark.css / .compact.css / .aliyun.css */
```

```json
// 方案 2：运行时切换 —— angular.json 多 bundle
{
  "styles": [
    { "input": "node_modules/ng-zorro-antd/ng-zorro-antd.css",
      "bundleName": "theme-default", "inject": false },
    { "input": "node_modules/ng-zorro-antd/ng-zorro-antd.dark.css",
      "bundleName": "theme-dark", "inject": false }
  ]
}
```

```ts
// 运行时切换
function switchTheme(name: 'default' | 'dark') {
  (document.getElementById('theme-link') as HTMLLinkElement)
    .href = `${name}.css`;
}
```

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NG-ZORRO 提供 4 套预编译主题，开箱即用。

4 套主题：
- default：默认蓝色主题（Ant Design 标准）
- dark：暗色主题（黑底白字）
- compact：紧凑模式（间距 / 字号 / 控件高度变小）
- aliyun：阿里云风格（橙色系，更商务）

方案 1：单一主题切换
- 在 styles.css / styles.less 中 import 对应文件
- 编译期确定，无法运行时切换
- 适合：固定主题项目
- 最简单，0 配置

方案 2：运行时切换
- angular.json 配置多个 bundle，inject: false
- 运行时改 link.href 切换 CSS 文件
- 注意：需要等 CSS 加载完再切 HTML class（防止视觉断裂）

方案 3：CSS Variables（实验性）
- 部分新组件支持 --ant-* CSS 变量
- 直接改变量即可
- 不是所有组件都支持（v21 仍在推进）

方案 4：Less 变量自定义编译
- 创建 custom-theme.less，@import "ng-zorro-antd/less"
- 覆盖 Less 变量（@primary-color: #f5222d）
- 编译期生成自定义 CSS
- 需要 @angular-builders/custom-webpack
- 最强的定制能力（400+ 变量）

实战经验：
- 单一主题项目：方案 1（最简单）
- 用户可切换主题：方案 2（多 bundle）
- 品牌色定制：方案 4（Less 变量）
- 完全设计自由：方案 4 + ng-alain 主题集成

注意：
- NG-ZORRO 没有 antd v5 的 algorithm 函数式主题
- 主题系统仍是 Less 编译期为主
- v18+ 实验性引入 CSS Variables，但覆盖不全
- antd v5 那种「darkAlgorithm + compactAlgorithm」组合在 NG-ZORRO 用 dark + compact 两个 CSS 文件实现
-->

---
transition: fade-out
---

# Less 变量定制

400+ 变量精细化控制每一个设计 token

<v-click>

```less
// custom-theme.less
@import "ng-zorro-antd/style/themes/default.less";

// 主色 + 功能色
@primary-color: #f5222d;        // 主色（默认 #1890ff）
@success-color: #52c41a;
@warning-color: #faad14;
@error-color: #ff4d4f;

// 圆角 + 字号
@border-radius-base: 8px;       // 默认 2px
@font-size-base: 14px;

// 间距
@padding-lg: 24px;
@padding-md: 16px;

// 组件级覆盖
@btn-primary-bg: @primary-color;
@table-header-bg: #fafafa;

@import "ng-zorro-antd/style/components.less";
```

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Less 变量是 NG-ZORRO 主题定制的核心方案 —— 400+ 变量精细化控制。

变量分类：

1. Color 颜色（最常改）：
- @primary-color：主色（CTA / 链接 / 主要操作）
- @success-color / @warning-color / @error-color / @info-color
- @text-color / @heading-color / @disabled-color
- @body-background / @component-background

2. Typography 字体：
- @font-family / @code-family
- @font-size-base（14px 默认）
- @line-height-base / @heading-1-size ~ @heading-5-size

3. Spacing 间距：
- @padding-xs / @padding-sm / @padding-md / @padding-lg
- @margin-xs ~ @margin-lg

4. Border 边框：
- @border-radius-base（2px 默认）
- @border-color-base / @border-color-split
- @border-width-base

5. Animation 动效：
- @animation-duration-base
- @ease-in-out-circ / @ease-out-circ

6. 组件级变量（每个组件有自己的）：
- @btn-* / @input-* / @table-* / @modal-*
- 例如 @btn-primary-bg / @table-header-bg

配置编译：
- 需要 @angular-builders/custom-webpack
- angular.json 配置 customWebpackConfig
- less-loader 加 modifyVars + javascriptEnabled

实战经验：
- 改主色：@primary-color（最常用）
- 改圆角：@border-radius-base（统一感）
- 改字号：@font-size-base
- 暗色定制：基于 dark.less import + 覆盖
- 组件粒度定制：@btn-* / @table-* 精细控制

vs antd v5：
- antd v5：Token + algorithm 函数式（运行时切换）
- NG-ZORRO：Less 编译期（构建时确定）
- antd v5 更灵活但运行时开销大
- NG-ZORRO 更轻量但定制需重新编译

参考资源：
- ng.ant.design/docs/customize-theme 主题文档
- node_modules/ng-zorro-antd/style/themes/default.less 完整变量
- ng-alain 提供企业级主题模板
-->

---
transition: fade-out
---

# CSS Variables 实验

NG-ZORRO v18+ 实验性 CSS 变量支持

<v-click>

```ts
// 启用 CSS Variables（v18+）
import { NzConfigService } from 'ng-zorro-antd/core/config';

@Component({ template: `<router-outlet />` })
export class AppComponent {
  configSvc = inject(NzConfigService);
  ngOnInit() {
    this.configSvc.set('theme', { primaryColor: '#f5222d' });
  }
}
```

```css
/* 运行时改 CSS 变量 */
:root {
  --ant-primary-color: #f5222d;
  --ant-border-radius-base: 8px;
}
[data-theme="dark"] {
  --ant-body-background: #141414;
}
```

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NG-ZORRO v18+ 开始引入 CSS Variables 实验性支持，正在逐步覆盖。

为什么需要 CSS Variables？
- 运行时切换主题（不需要编译）
- 多主题嵌套（不同区域不同色）
- 与 Tailwind / 自定义 CSS 友好

当前状态（v21）：
- 主色 / 功能色（4 个语义色）已支持
- 圆角 / 字号 部分组件支持
- 字体 / 间距 仍是 Less 编译时
- 不是所有组件覆盖完整

启用方式：
1. NzConfigService.set('theme', { primaryColor })：运行时设置
2. :root 中改 --ant-* 变量（与 Less 编译产物配合）
3. [data-theme="dark"] 切换暗色

对比 antd v5 / Material 3：
- antd v5：Token + algorithm 全面 CSS-in-JS，最灵活
- Material 3：完整 --mat-sys-* tokens 体系，最先进
- NG-ZORRO：仍以 Less 为主 + CSS Variables 实验，最保守

为什么 NG-ZORRO 不全面转 CSS Variables？
- Less 主题系统稳定，社区积累深
- 大量企业项目依赖 Less 定制
- 完全切换破坏向后兼容
- 渐进式策略：保留 Less + 部分组件加 CSS Variables

实战建议：
- 现阶段：Less 变量定制（最稳定）
- 实验场景：CSS Variables 测试（主色 / 圆角）
- 期待未来：v22+ 可能完整 CSS Variables 体系
- 不要完全依赖 CSS Variables（覆盖率不够）

迁移路径：
- 老项目：保持 Less，无需迁移
- 新项目：Less 为主 + CSS Variables 辅助
- 关注 v22 / v23 的主题系统改进
-->

---
transition: fade-out
---

# NzConfigService 全局配置

集中管理组件默认值

<v-click>

```ts
// app.config.ts —— Standalone 模式
import { provideNzConfig, NzConfig } from 'ng-zorro-antd/core/config';

const ngZorroConfig: NzConfig = {
  theme: { primaryColor: '#1677ff' },
  message: { nzDuration: 3000 },
  modal: { nzCentered: true, nzMaskClosable: false },
  table: { nzBordered: true, nzSize: 'middle' },
};

export const appConfig: ApplicationConfig = {
  providers: [provideNzConfig(ngZorroConfig)],
};

// 运行时动态修改
export class SettingsComponent {
  configSvc = inject(NzConfigService);
  toggleSize() {
    this.configSvc.set('button', { nzSize: 'small' });
  }
}
```

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NzConfigService 是 NG-ZORRO 的全局配置中心 —— 集中管理所有组件的默认值。

为什么需要 NzConfigService？
- 避免每个组件重复传相同属性（nzSize / nzMaskClosable 等）
- 统一管理全局风格
- 业务模块可覆盖默认值

配置方式：
- 静态：provideNzConfig(config) 在 app.config.ts 注入
- 动态：inject(NzConfigService).set(key, value) 运行时修改

可配置项（覆盖几乎所有组件）：
- theme：主色（CSS Variables 模式）
- message / notification / modal / drawer：弹层默认值
- button / input / select / table / form：基础组件默认 size
- card / avatar / tag / progress：展示类默认值
- empty / spin / skeleton：状态类默认值
- backTop / anchor / affix：浮动类配置

优先级：
- 组件 Input 属性 > NzConfigService > 组件内置默认值
- 也就是说，模板里写明的属性永远优先

实战经验：
- 项目初始化时一次性配置所有默认值
- 用户偏好（紧凑模式）用 NzConfigService.set 动态切换
- 业务模块需要不同默认值时，子模块单独 provideNzConfig
- 表单大量用 nzSize="small"？设置 form / button 默认即可

注意：
- 部分配置可能涉及组件 OnChanges 重新计算（性能考虑）
- 频繁动态切换不推荐（影响整页 changeDetection）
- 主题切换用 NzConfigService.set('theme', { primaryColor })，CSS Variables 模式才生效

对比 antd ConfigProvider：
- antd（React）：ConfigProvider 组件包裹 + theme 属性
- NG-ZORRO：NzConfigService 服务式 + provideNzConfig 注入
- React 是嵌套覆盖，Angular 是 DI 树覆盖
- 本质相同：全局配置中心
-->

---
transition: fade-out
---

# Locale i18n

70+ 语言 + dayjs locale 联动

<v-click>

```ts
// app.config.ts —— 注入默认语言
import { provideNzI18n, zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

registerLocaleData(zh);

export const appConfig: ApplicationConfig = {
  providers: [provideNzI18n(zh_CN),
    { provide: LOCALE_ID, useValue: 'zh-Hans' }],
};

// 运行时切换语言
export class LangSwitcher {
  i18n = inject(NzI18nService);
  async switchToEn() {
    const { en_US } = await import('ng-zorro-antd/i18n');
    this.i18n.setLocale(en_US);
    (await import('dayjs')).locale('en');
  }
}
```

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NG-ZORRO 提供 70+ 语言的完整 i18n 支持，与 dayjs locale 联动。

i18n 配置三层：

1. Angular 通用 locale（@angular/common）：
- registerLocaleData(zh) 注册数据
- LOCALE_ID 设置默认语言
- DatePipe / CurrencyPipe 等内置 pipe 用

2. NG-ZORRO i18n：
- provideNzI18n(zh_CN) 注入组件文案
- DatePicker / Table / Pagination 等组件的文字（"上一页" "确定" "取消"）
- 70+ 语言：zh_CN / en_US / ja_JP / ko_KR / de_DE / fr_FR / es_ES ...

3. dayjs locale（日期组件依赖）：
- v15+ NG-ZORRO 用 dayjs 替代 Moment
- dayjs.locale('zh-cn') 同步切换
- DatePicker / Calendar 日期显示

完整切换流程：
1. NzI18nService.setLocale(zh_CN)
2. dayjs.locale('zh-cn')
3. LOCALE_ID 改（需重启 / 重新 bootstrap）

运行时切换难点：
- LOCALE_ID 是 Angular DI 注入，运行时切换需要重新引导
- 实际项目：刷新整个 App 或单独动态导入 locale 包
- 用户偏好存 localStorage，启动时读取设置

ngx-translate vs NG-ZORRO i18n：
- ngx-translate：业务文案（菜单 / 错误信息）
- NG-ZORRO i18n：组件内部文案（DatePicker 周名 / Pagination 提示）
- 两者并存，业务和组件分开管理

支持的语言（部分）：
- 简体中文 zh_CN / 繁体中文 zh_TW / 香港 zh_HK
- 英语 en_US / en_GB
- 日语 ja_JP / 韩语 ko_KR
- 法语 fr_FR / 德语 de_DE / 西班牙语 es_ES / 葡萄牙语 pt_PT
- 俄语 ru_RU / 阿拉伯语 ar_EG / 印地语 hi_IN
- 等 70+ 语言

实战经验：
- 单语言项目：app.config.ts 注入一次即可
- 多语言项目：动态导入 + setLocale + dayjs.locale 三件套
- SSR 项目：服务端读取 Accept-Language，预注入 locale
- locale 包按需懒加载（避免主 bundle 加 70 个 locale）
-->

---
transition: fade-out
---

# Angular SSR 适配

@angular/ssr + NG-ZORRO SSR 友好

<v-click>

```bash
# 一键启用 SSR
ng add @angular/ssr
```

```ts
// app.config.ts —— SSR + NG-ZORRO
export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideRouter(routes),
    provideNzI18n(zh_CN),
  ],
};

// 浏览器端 only 组件保护
export class FloatingPanelComponent {
  platformId = inject(PLATFORM_ID);
  modalSvc = inject(NzModalService);
  openModal() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.modalSvc.create({ nzTitle: '标题', nzContent: '内容' });
  }
}
```

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NG-ZORRO 与 Angular SSR（@angular/ssr）兼容良好，但有几个注意点。

SSR 启用：
- ng add @angular/ssr 一键配置
- 自动加 server.ts / main.server.ts / express engine
- 服务端预渲染 HTML，提升首屏性能

NG-ZORRO SSR 兼容性：
- 静态组件（Button / Card / Form / Table）完全 SSR 友好
- 浮层组件（Modal / Drawer / Tooltip / Notification）仅浏览器端
- ng-zorro-antd v21 全面支持 SSR + Hydration

provideClientHydration：
- Angular v17+ 支持客户端水合
- 服务端渲染的 DOM 直接复用，不重建
- withEventReplay() 在水合期间回放事件

注意事项：

1. PLATFORM_ID 检查：
- 浮层组件相关代码用 isPlatformBrowser(PLATFORM_ID) 守护
- 防止服务端调用 dialog / drawer 报错

2. 国际化注入：
- 服务端读取 Accept-Language header
- 选对应 locale 预注入
- 避免服务端 / 客户端 locale 不一致引起的水合错误

3. 时间相关：
- 服务端用 UTC 时区渲染
- 客户端切换为用户本地时区
- 用 dayjs.utc / dayjs.tz 处理

4. 浏览器 API：
- window / document / localStorage 都不可直接访问
- 用 DOCUMENT injection token / isPlatformBrowser 守护

实战经验：
- 中后台项目通常不需要 SSR（登录后页面）
- 营销页 / 文档站 / SEO 重要的页面才上 SSR
- SSR + NG-ZORRO 组合用 Card / Form / Layout 等静态组件
- 浮层只在浏览器端用，配合事件触发

性能：
- 首屏：SSR HTML 直出
- 水合：增量水合（v17+），按需激活
- 互动：水合完成后用户操作正常
- 缓存：Express / Nginx 可缓存预渲染 HTML

对比 Next.js / Nuxt：
- @angular/ssr 起步较晚但成熟
- 与 Angular Universal（老）完全替代
- ng add 一键启用，无需手动配置
-->

---
transition: fade-out
---

# Standalone Components 默认

v17+ Standalone-first，告别 NgModule

<v-click>

```ts
// 现代 Angular + NG-ZORRO 风格（v17+，无 NgModule）
import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-login',
  // standalone: true 在 v17+ 是默认值，可省略
  imports: [NzButtonModule, NzFormModule, NzInputModule, ReactiveFormsModule],
  template: `
    <form nz-form [formGroup]="form">
      <nz-form-item>
        <input nz-input formControlName="username" />
      </nz-form-item>
      <button nz-button nzType="primary">登录</button>
    </form>
  `,
})
export class LoginComponent {
  form = inject(FormBuilder).group({ username: [''] });
}
```

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NG-ZORRO 全面支持 Standalone Components，并且推荐这种现代风格。

Standalone Components 演进：
- Angular v14：引入 Standalone（实验性）
- Angular v15：Standalone 稳定
- Angular v17：Standalone 默认（standalone: true 可省）
- Angular v19+：NgModule 进入维护模式

NG-ZORRO 支持：
- v15：开始支持 Standalone
- v17：Standalone-first，Module 与 Standalone 双轨
- v21：所有组件 Module + Standalone 都可用

两种风格对比：

老 NgModule 风格（不推荐）：
- @NgModule({ declarations / imports / exports })
- 整个 module 一起编译
- 树摇能力一般

新 Standalone 风格（推荐）：
- @Component({ imports: [...] })
- 组件级依赖管理
- Tree-shaking 友好
- 编译速度快
- 测试更简单（不需要 TestBed Module 配置）

为什么 Standalone 是未来？
- 更接近 Vue / React 心智（组件即模块）
- 更好的代码内聚
- 更快的编译速度
- 更优的 Tree-shaking
- 路由懒加载更直接（loadComponent）

迁移路径：
- ng generate @angular/core:standalone 自动 codemod
- 增量迁移：先 Standalone 化叶子组件，再迁移容器
- 老 NgModule 与新 Standalone 可共存

NG-ZORRO Module vs Standalone：
- NzButtonModule / NzFormModule 等仍可在 Standalone 组件的 imports 中用
- 没有提供「单组件 NzButton」类（与 antd 不同）
- 这是为了兼容老项目 NgModule 引入方式

functional providers（v17+）：
- provideNzI18n / provideNzIcons / provideNzConfig
- 替代老的 NzZorroAntdModule.forRoot(config)
- 与 provideRouter / provideHttpClient 风格一致

实战经验：
- 新项目：全 Standalone
- 老项目：逐步迁移 Standalone（叶子组件优先）
- NG-ZORRO 模块按需 imports（不要一次引入大模块）
- 路由用 loadComponent 懒加载
-->

---
transition: fade-out
---

# Zoneless 高性能模式

OnPush 默认 + Zoneless 兼容

<v-click>

```ts
// app.config.ts —— Zoneless（Angular v18+）
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideExperimentalZonelessChangeDetection(),
    provideAnimationsAsync()],
};

// 用 signal 替代传统响应式
@Component({
  imports: [NzTableModule],
  template: `<nz-table [nzData]="rows()" [nzLoading]="loading()" />`,
})
export class ZonelessDemo {
  rows = signal<any[]>([]);
  loading = signal(false);
  async load() {
    this.loading.set(true);
    this.rows.set(await fetch('/api').then(r => r.json()));
    this.loading.set(false);
  }
}
```

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NG-ZORRO 全面拥抱 Zoneless / OnPush 高性能模式，从 v18+ 开始实验性 Zoneless 兼容。

什么是 Zoneless？
- Angular 传统：用 Zone.js 拦截浏览器异步 API 触发 changeDetection
- Zoneless：不依赖 Zone.js，用 signal 驱动 changeDetection
- 性能更好（无 Zone 拦截开销）
- bundle 更小（无 Zone.js）
- 与现代 JS（Promise / fetch）更友好

OnPush 模式：
- changeDetection: ChangeDetectionStrategy.OnPush
- 只在 @Input() 引用变化 / 事件触发 / Observable emit / signal 变化时才检测
- 性能远好于默认的 Default 策略

NG-ZORRO 与 OnPush：
- 所有 NG-ZORRO 组件默认 OnPush（v15+）
- 与你的 OnPush 业务组件完美配合
- 没有「组件库强制 markForCheck」的反模式

NG-ZORRO 与 Zoneless：
- v18+ 实验性支持
- v21 持续完善
- 部分组件可能仍依赖 setTimeout / requestAnimationFrame（与 Zone 配合）
- 个别组件未完整测试 Zoneless 场景

启用 Zoneless（实验性）：
1. provideExperimentalZonelessChangeDetection() 替代 provideZoneChangeDetection()
2. main.ts 不引入 zone.js
3. polyfills.ts 删除 zone.js 引用
4. 必须用 signal / OnPush 驱动业务

注意事项：
- provideAnimationsAsync() 替代 provideAnimations()（动画异步加载）
- ng-zorro 动画依赖 Angular Animations，确保 async 模式
- 第三方库可能依赖 Zone.js，需要审核兼容性
- 业务代码需要适配 signal（不再依赖 Zone 自动检测）

signal API（v17+）：
- signal()：创建可读写信号
- computed()：派生信号
- effect()：副作用监听
- update() / set()：更新信号

迁移建议：
- 新项目：Zoneless + Signal 起步（最现代）
- 老项目：先迁移到 Signal-based Forms / Resource，再考虑 Zoneless
- 大项目：Zoneless 风险评估（部分老库可能不兼容）

性能数据：
- 启动速度提升 5-15%
- bundle 减小 50-80KB（去掉 zone.js）
- 长列表 changeDetection 时间减少 30-50%

未来：
- Angular v20 计划 Zoneless 稳定
- NG-ZORRO v22+ 可能 Zoneless 完整覆盖
- Signal-based Forms 进一步成熟
-->

---
transition: fade-out
---

# 常见踩坑

升级 + 类型 + 样式 + 性能实战问题

<v-click>

**踩坑 1：图标不显示** —— v17+ 必须显式注册，app.config.ts 加 `provideNzIcons([SearchOutline, ...])`。

</v-click>

<v-click>

**踩坑 2：Less 变量定制不生效** —— 需 `@angular-builders/custom-webpack` + less-loader `modifyVars` 配置。

</v-click>

<v-click>

**踩坑 3：升级后类型错误** —— v21 类型更严格，跑 `ng update ng-zorro-antd` 自动 migration + 手动修复 strict。

</v-click>

<v-click>

**踩坑 4：Zoneless 模式视图不更新** —— 业务用 `setTimeout` / `Promise` 不触发检测，改 signal / Observable / `cdr.markForCheck()`。

</v-click>

<v-click>

**踩坑 5：Table nzData 不更新** —— OnPush 模式需新数组引用，直接 push 无效，用 `[...arr, item]`。

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NG-ZORRO 常见踩坑集锦。

踩坑 1：图标不显示
- 现象：模板里 nz-icon nzType="user" 不显示，控制台 [NG-ZORRO] icon user not found
- 原因：v17+ 不再默认注册所有图标，必须显式注册

修复：
- app.config.ts 加 provideNzIcons([UserOutline, SearchOutline, ...])
- 或动态加载：angular.json 配置 assets + 浏览器按需 fetch
- Lazy module 用 provideNzIconsPatch 局部补充

[click] 踩坑 2：Less 变量定制不生效
- 现象：自定义 @primary-color 没有变化
- 原因 1：没装 @angular-builders/custom-webpack
- 原因 2：angular.json 没改 builder
- 原因 3：less-loader 没传 modifyVars

修复步骤：
1. npm i -D @angular-builders/custom-webpack
2. angular.json: "builder": "@angular-builders/custom-webpack:browser"
3. webpack.config.js 配置 less-loader modifyVars
4. javascriptEnabled: true（Less 必开）
5. 引入完整 ng-zorro-antd Less 入口（不能只 import CSS）

[click] 踩坑 3：升级后类型错误
- 现象：ng update 后大量 TS2554 / TS2322 错误
- 原因：v21 类型更严格，组件 Input / Output 类型收紧

修复：
- ng update ng-zorro-antd 跑完后看 migration 报告
- 手动修复 strict 类型（any 改具体类型）
- 看 NG-ZORRO CHANGELOG 的 Breaking Changes
- 跨多个大版本升级要分步（v18 → v19 → v20 → v21）

[click] 踩坑 4：Zoneless 模式不更新
- 现象：业务里 setTimeout / Promise 修改数据，视图不更新
- 原因：Zoneless 模式不依赖 Zone.js 触发检测

修复：
1. 改用 signal：state.set(newValue) 自动触发检测
2. 改用 Observable + AsyncPipe：模板里 {{ data$ | async }}
3. 实在不行：cdr.markForCheck() 手动触发

其他踩坑：

- Modal nzContent 传 Component：组件需 inject(NzModalRef) 才能关闭 + 返回值
- Table nzData 必须是新数组：直接 push 不触发 OnPush，要 [...arr, item]
- Form FormGroup 没传 disable 时禁用控件：用 formGroup.controls.x.disable()，不要直接传 [disabled]="true"
- Drawer 内打开 Modal：可能 z-index 错乱，调 nzZIndex
- 移动端 Tooltip 不显示：原生 hover 不触发，改 nzTrigger="click"
- Date Picker 时区不对：用 dayjs.tz / dayjs.utc 显式控制
- SSR 报 window is not defined：用 isPlatformBrowser(PLATFORM_ID) 守护
- 老 ViewEngine 模板编译失败：必须升 Angular Ivy（v9+）
-->

---
transition: fade-out
---

# 学习路径与资源

从入门到精通的官方资源

<v-click>

**官方资源**

- [NG-ZORRO 官方文档](https://ng.ant.design/) — 70+ 组件 + Guides
- [NG-ZORRO GitHub](https://github.com/NG-ZORRO/ng-zorro-antd) — 源码 + Issues
- [Ant Design 设计规范](https://ant.design/docs/spec/introduce-cn) — 设计语言原文
- [Angular CDK](https://material.angular.dev/cdk/categories) — 底层模块（NG-ZORRO 部分依赖）

</v-click>

<v-click>

**配套生态**

- [ng-alain](https://ng-alain.com/) — 阿里出品企业级中后台脚手架
- [@delon](https://ng-alain.com/docs/delon) — NG-ZORRO 增强库（abc / mock / auth / cache）
- [Iconfont](https://www.iconfont.cn/) — 自定义图标管理（NzIconService 集成）
- [Ant Design 设计稿](https://ant.design/docs/resources-cn) — Figma / Sketch / Axure

</v-click>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] NG-ZORRO 学习是 Angular 工程师在国内的必修课。

官方资源优先级：
1. ng.ant.design → 主入口，70+ 组件 + Guides
2. github.com/NG-ZORRO/ng-zorro-antd → 源码 / Issues / Discussions
3. ant.design/docs/spec → 设计语言原文（与 antd 同源）
4. material.angular.dev/cdk → @angular/cdk（NG-ZORRO 部分依赖）

文档结构：
- Components：70+ 组件，每个有 Examples / API / FAQ
- Docs：Getting Started / Customize Theme / i18n / Global Config / Change Log
- Resources：示例 / 模板 / 工具

学习节奏建议：
- 第 1 周：ng add + 5 个基础组件（Button / Input / Form / Table / Modal）
- 第 2 周：NzConfigService 全局配置 + i18n
- 第 3 周：NzTable 完整方案（分页 / 排序 / 过滤 / 服务端）
- 第 4 周：主题定制（Less 变量 / 4 套预设）
- 第 2 月：高级组件（Tree / Cascader / Transfer / DatePicker 范围）
- 第 3 月：SSR / Standalone / Zoneless 现代模式
- 第 4 月：自定义组件 + 主题扩展 + ng-alain 企业模板

[click] 配套生态：

ng-alain：
- 阿里出品的 NG-ZORRO 企业级中后台脚手架
- 类似 Ant Design Pro 之于 antd
- 集成认证 / 权限 / 路由 / 国际化 / 主题 / 布局
- 中后台首选起步项目

@delon 增强库：
- @delon/abc：扩展业务组件（搜索表单 / 工具栏 / 图表）
- @delon/mock：本地 Mock 数据
- @delon/auth：JWT 鉴权
- @delon/cache：缓存策略
- @delon/theme：主题系统增强

Iconfont 集成：
- iconfont.cn 创建项目
- 生成 JS 文件
- NzIconService.fetchFromIconfont('https://...') 加载
- 中国本土设计师友好

Ant Design 设计稿：
- Figma / Sketch / Axure 三套
- 与 NG-ZORRO 1:1 对齐
- 设计师与开发对齐神器

社区资源：
- Stack Overflow 标签 ng-zorro-antd
- 知乎专栏 / 掘金 NG-ZORRO 标签
- Angular 中文社区 微信群
- 阿里前端工程师博客（多人维护 NG-ZORRO）

招聘市场：
- Angular 岗位多在阿里 / 蚂蚁 / 字节（部分） / 中后台公司
- 简历亮点：NG-ZORRO 深度 + ng-alain + Less 主题定制 + Standalone / Zoneless 实战
- 配合 RxJS / NgRx / TypeScript 严格模式，构成完整 Angular 工程师能力栈
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看

NG-ZORRO — Ant Design for Angular

<div class="mt-8 text-lg">

**核心心智**

- 阿里出品官方组件库 — 70+ 组件 + Ant Design 设计语言
- 与 Angular 主版本同步 — v21 对应 Angular 21
- Standalone-first + Zoneless 友好 — 现代 Angular 风格
- Less 主题 + 4 套预设 — 400+ 变量 + CSS Variables 实验
- ng add 一键接入 + NzConfigService 全局配置

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://ng.ant.design/" target="_blank" class="slidev-icon-btn">
    NG-ZORRO 文档
  </a>
  <a href="https://github.com/NG-ZORRO/ng-zorro-antd" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
</div>

<style>
h1 {
  background-color: #1890ff;
  background-image: linear-gradient(45deg, #1890ff 10%, #f5222d 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：NG-ZORRO = 阿里出品官方 Angular UI 库 + Ant Design 设计语言 + Standalone / Zoneless 现代风格。

核心心智五条：
1. 阿里官方背书：NG-ZORRO 团队维护，70+ 组件，与 Ant Design 同源设计
2. 主版本号同步：v21 对应 Angular 21，简单直观
3. Standalone-first：v17+ 现代 Angular 风格，告别 NgModule.declarations
4. Zoneless 兼容：v18+ 实验性，所有组件 OnPush 默认，性能优秀
5. Less 主题系统：400+ 变量 + 4 套预设 + CSS Variables 实验

适合什么团队？
- Angular + 中国 B 端 / Ant Design 风格（首选）
- Angular + 中后台 / SaaS / ERP / CRM 项目
- 与 antd React 设计统一的跨技术栈项目
- 阿里系 / 蚂蚁系 / 中国互联网公司 Angular 项目

进阶建议：
- 第一步：ng add ng-zorro-antd + 写 5 个基础组件
- 第二步：NzConfigService 全局配置 + Form + Table 完整方案
- 第三步：Less 主题定制 + 4 套预设切换
- 第四步：i18n + SSR 现代场景
- 第五步：Standalone + Zoneless 现代风格
- 第六步：ng-alain + @delon 企业级扩展

阿里官方背书 + Ant Design 设计语言 + Standalone / Zoneless 现代风格 ——
NG-ZORRO 在 2026 年仍是 Angular + Ant Design 风格的事实标准选择。

感谢观看！🐜
-->
