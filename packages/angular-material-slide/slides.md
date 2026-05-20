---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Angular Material
info: |
  Presentation Angular Material for Angular developers.

  Learn more at [https://material.angular.dev/](https://material.angular.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-9xl">🅰️</span>
</div>

<br/>

## Angular Material — Material Design for Angular

Angular 官方 Material UI 组件库（v20+），Material 3 + design tokens + 60+ 组件 + @angular/cdk

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Angular Material —— Google 自家的 Angular 官方 Material Design 组件库，2016 年随 Angular 2 同期发布，至今十年迭代。

当前主线 v20+，是分水岭：Material 3 设计语言全面落地，新版 mat.theme() API + design tokens 体系（--mat-sys-*）。

核心卖点：60+ 组件 + @angular/cdk 底座 + A11y 业界最强 + Material 3 + Standalone-first + SSR 友好 + Component Harness 测试。
-->

---
transition: fade-out
---

# 什么是 Angular Material？

Angular 官方推荐的 Material Design 组件库，由 Google Angular Components 团队维护

<v-click>

- **官方背书**：Angular 官方组件库，与 Angular 主版本同步发布
- **60+ 组件**：Form / Navigation / Layout / Buttons / Popups / Data Table
- **@angular/cdk 底座**：Overlay / Portal / A11y / Layout / Drag-Drop / Scrolling
- **Material 3 设计**：v17 GA，v20 完善 design tokens 体系
- **mat.theme() API**：v19+ 单函数生成主题
- **Standalone-first**：v17+ 按需导入
- **A11y 与 SSR 内置**：无障碍 + 服务端渲染开箱即用
- **GitHub 24K+ star**：Angular UI 库事实标准

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Angular Material 的核心定位是「Angular 官方 Material Design 组件库」——
不是社区第三方库，而是 Google Angular 团队亲自维护的官方产品。

特色一：官方背书 —— Google Angular Components 团队（约 10 人）专职维护，与 Angular 主版本号绑定。
特色二：60+ 组件 —— Form Field / Input / Select / Datepicker / Button / Card / Dialog / Snackbar / Table 完整覆盖。
特色三：@angular/cdk 双包结构 —— Overlay / Portal / A11y / Layout / Drag-Drop / Scrolling 六大模块，被 PrimeNG / NG-ZORRO 大量使用。
特色四：Material 3 + mat.theme() —— v17 GA M3，v19+ 单函数主题，v20+ 完整 --mat-sys-* token 体系。
-->

---
transition: fade-out
---

# 定位与生态对比

为什么 Angular 项目首选 Angular Material？

<v-click>

| 维度       | Angular Material   | NG-ZORRO         | PrimeNG          |
| ---------- | ------------------ | ---------------- | ---------------- |
| 设计语言   | **Material 3**     | Ant Design       | 多套主题         |
| 主导团队   | **Google 官方**    | 阿里 NG 团队     | PrimeFaces       |
| 组件数量   | 60+                | 70+              | 90+              |
| 主题方案   | **design tokens**  | algorithm        | CSS vars         |
| A11y       | **业界最强**       | 较强             | 较强             |
| CDK 底座   | **@angular/cdk**   | 部分自研         | 部分自研         |

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Angular 生态主流 UI 库横向对比。

Angular Material 的护城河：
- 官方背书：Google 团队，与 Angular 同步演进
- 设计语言：Material 3 国际化通用
- A11y 业界最强：Google A11y 团队亲自把关
- CDK 底座：行为层独立可单独使用

选型逻辑：
- Angular + 全球项目 / C 端 / 移动端 → Angular Material（默认）
- Angular + 中国 B 端 / Ant Design 风格 → NG-ZORRO
- Angular + 富组件需求（DataTable / Chart） → PrimeNG
-->

---
transition: fade-out
---

# 演进史

从 Material 1.0 到 Material 3 + design tokens 时代

<v-click>

| 版本      | 时间    | 关键事件                                  |
| --------- | ------- | ----------------------------------------- |
| 1.x       | 2016    | 随 Angular 2 同期首发                     |
| 7.x       | 2018    | @angular/cdk 独立                         |
| 15.x      | 2022    | **MDC 集成完成**，API 大幅变动            |
| 17.x      | 2023    | **Material 3 GA**，Standalone 默认        |
| 18.x      | 2024    | 视觉默认切换到 M3                         |
| 19.x      | 2024    | **mat.theme() 新 API**                    |
| **20.x**  | 2025    | **完整 design tokens（--mat-sys-*）**     |

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Angular Material 十年演进，重大变化集中在 v15 / v17 / v19 / v20。

2016 元年：随 Angular 2 同期首发。
2018 v7：@angular/cdk 独立成包，CDK 模块可单独装。
2022 v15：MDC Web 集成完成，破坏性升级（DOM + CSS 类大变）。
2023 v17：Material 3 设计语言 GA + Standalone Components 默认。
2024 v18：视觉默认切换 M3，老的 M2 主题进入兼容模式。
2024 v19：mat.theme() 新 API，单函数取代 mat.core() + mat.all-component-themes() 拼装。
2025 v20：完整 design tokens 体系，--mat-sys-* CSS 变量体系完整化。
-->

---
transition: fade-out
---

# Material 2 vs Material 3

新设计语言带来的核心变化

<v-click>

| 维度          | Material 2 (v15-v16)       | Material 3 (v17+)              |
| ------------- | --------------------------- | ------------------------------ |
| 设计来源      | 2014 年 Material Design     | **2021 年 Material You**       |
| 颜色系统      | 单 palette                 | **双 palette + tonal**         |
| 排版          | Roboto fixed                | **Roboto Flex** 可变字体       |
| 形状          | 圆角 4px                    | **可调（4/12/16/28）**         |
| 主题 API      | mat.core() + mat.all-...   | **mat.theme() 单函数**         |
| 主题变量      | Sass 变量                   | **CSS 变量（--mat-sys-*）**    |

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Material 2 与 Material 3 的本质差异：设计哲学 + 实现机制。

设计哲学：
- M2（2014）= 印刷品 + 阴影 + 卡片隐喻
- M3（2021）= Material You，个性化 + 动态色 + 多设备适配

颜色系统：M3 双 palette + tonal，每个 palette 完整 0-100 tone。
排版：M3 推荐 Roboto Flex 可变字体，连续字重 100-1000。
形状：M3 引入 corner radius scale（none / extra-small / small / medium / large / extra-large）。
主题 API：M3 mat.theme() 单函数，告别 mat.core() + mat.all-component-themes() 拼装。
变量：M3 生成 CSS 变量（运行时可改），M2 是 Sass 变量（编译时确定）。
-->

---
transition: fade-out
layoutClass: gap-x-8
layout: two-cols-header
---

# 安装与初始化

ng add 一行装齐，自动配置主题 + 字体 + 动画

::left::

<v-click>

**安装**

```bash
ng add @angular/material
```

询问：
1. 预设主题（Azure / Magenta / Cyan / Custom）
2. 是否启用 typography
3. 是否包含 animations

**手动安装**

```bash
npm i @angular/material @angular/cdk
```

</v-click>

::right::

<v-click>

**自动配置**

- styles.scss 注入 mat.theme()
- angular.json 引入字体
- app.config.ts 注入 provideAnimationsAsync()
- index.html 加 mat-typography class

**自定义主题**

```scss
@use '@angular/material' as mat;

html {
  @include mat.theme((
    color: mat.$violet-palette,
    typography: Roboto,
    density: 0,
  ));
}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Angular Material 推荐用 ng add 命令安装 —— schematics 自动完成所有配置。

ng add 步骤：
1. 自动装 @angular/material + @angular/cdk + @angular/animations
2. 让你选预设主题
3. 问是否启用 typography styles
4. 问是否启用 animations

[click] 自定义主题（mat.theme() v19+ 新 API）：
- color：预设 palette（azure / red / violet / cyan 等）或自定义
- typography：字体名（Roboto / Roboto Flex / 自定义）
- density：密度（0 ~ -5，越负越紧凑）

版本要求：Angular Material 20 需要 Angular 20+ + TypeScript 5.5+ + Node.js 20+。
-->

---
transition: fade-out
---

# 第一个 MatButton

最常用的按钮组件，5 种变体

<v-click>

```ts
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button mat-button>普通按钮</button>
    <button mat-raised-button color="primary">主按钮</button>
    <button mat-stroked-button>描边按钮</button>
    <button mat-flat-button color="accent">填充按钮</button>
    <button mat-icon-button>
      <mat-icon>menu</mat-icon>
    </button>
  `,
})
export class MyButtonComponent {}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Angular Material 的 Button 是最常用的组件，通过「指令属性」激活不同变体。

5 种 Button 变体：
- mat-button：默认文字按钮
- mat-raised-button：凸起阴影
- mat-stroked-button：描边
- mat-flat-button：扁平填充
- mat-icon-button：纯图标
- mat-fab / mat-mini-fab：浮动操作按钮

M3 命名调整：v17+ 用 mat-elevated-button / mat-outlined-button / mat-filled-button。
color：primary / accent / warn / 不设默认。
无障碍：所有 Button 默认有 ripple，键盘 Enter/Space 触发，ARIA 自动正确。

实战经验：主操作用 mat-raised-button，次操作用 mat-stroked-button，弱操作用 mat-button，风险用 color="warn"。
-->

---
transition: fade-out
---

# MatFormField + MatInput

表单输入的核心组合，appearance 控制视觉风格

<v-click>

```ts
@Component({
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule],
  template: `
    <mat-form-field appearance="fill">
      <mat-label>邮箱地址</mat-label>
      <input matInput type="email" />
      <mat-icon matPrefix>email</mat-icon>
      <mat-hint>用于接收验证邮件</mat-hint>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>密码</mat-label>
      <input matInput type="password" required minlength="8" />
      <mat-icon matSuffix>visibility</mat-icon>
      <mat-error>密码不能为空且至少 8 位</mat-error>
    </mat-form-field>
  `,
})
export class MyFormComponent {}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MatFormField 是 Angular Material 表单输入的「容器组件」——
包裹 input 控件，提供 label / hint / error / prefix / suffix 统一外观。

appearance 三种风格：
- fill：填充式（默认 v15+），背景色 + 底边
- outline：描边式（M3 推荐），完整边框
- legacy / standard：已废弃

子元素角色：
- mat-label：浮动标签
- mat-hint：提示文字
- mat-error：错误信息
- matPrefix / matSuffix：前缀 / 后缀
- input matInput：实际输入框

input 支持：type text / email / number / password 等，完整 HTML5 验证，与 Reactive/Template Forms 完美集成。

无障碍：mat-label 自动 aria-labelledby，mat-hint 自动 aria-describedby，mat-error 验证失败 aria-invalid="true"。

实战经验：M3 推荐用 outline，表单一律写 mat-label，配合 Reactive Forms + mat-error 显示错误。
-->

---
transition: fade-out
---

# 60+ 组件分类速览

按功能分组的完整组件矩阵

<v-click>

| 分组       | 组件                                                              |
| ---------- | ----------------------------------------------------------------- |
| **Form**   | Form Field / Input / Select / Autocomplete / Datepicker / Slider  |
| **Form**   | Slide Toggle / Checkbox / Radio / Chips / Button Toggle           |
| **Nav**    | Toolbar / Sidenav / Menu / Tabs / Stepper / Breadcrumb            |
| **Layout** | Card / Expansion / Grid List / Divider / List                     |
| **Popup**  | Dialog / Bottom Sheet / Snackbar / Tooltip / Menu                 |
| **Data**   | Table / Sort / Paginator / Tree                                   |
| **Feedback** | Progress Spinner / Progress Bar / Badge / Ripple                |

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Angular Material 组件按功能分八大组，覆盖企业应用所有常见场景。

Form 表单类：Form Field / Input / Select / Autocomplete / Datepicker / Slider / Slide Toggle / Checkbox / Radio / Chips / Button Toggle。

Navigation 导航类：Toolbar / Sidenav / Menu / Tabs / Stepper / Breadcrumb。

Layout 布局类：Card / Expansion Panel / Grid List / Divider / List。

Popup 弹层类：Dialog / Bottom Sheet / Snackbar / Tooltip / Menu。

Data 数据展示类：Table / Sort / Paginator / Tree。

Feedback 反馈类：Progress Spinner / Progress Bar / Badge / Ripple。

总计 60+ 组件，覆盖企业级应用 90% 场景。剩下 10% 通过 @angular/cdk 自己组装或集成第三方库。
-->

---
transition: fade-out
---

# MatSelect

下拉选择，集成 Reactive Forms

<v-click>

```ts
@Component({
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>选择国家</mat-label>
      <mat-select [formControl]="country" multiple>
        @for (c of countries; track c) {
          <mat-option [value]="c">{{ c }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
})
export class SelectDemo {
  country = new FormControl<string[]>([]);
  countries = ['China', 'USA', 'Japan', 'UK'];
}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MatSelect 与 Reactive Forms 完美集成。

基础用法：mat-form-field 包裹 + mat-select 主体 + mat-option 选项。

数据绑定：[formControl] / [(ngModel)] / (selectionChange)。

多选模式：multiple 属性，value 变数组，自动 checkbox。

@for / @if 控制流（v17+）：替代 *ngFor / *ngIf，track 必填，性能更好。

option 高级特性：[disabled] / mat-optgroup 分组 / 自定义模板 / cdk-virtual-scroll 实现虚拟滚动。

无障碍：完整 ARIA combobox 模式，键盘上下键，Type-ahead 搜索，多选 Space 切换。
-->

---
transition: fade-out
---

# MatDatepicker

日期选择器，多个 DateAdapter 适配

<v-click>

```ts
@Component({
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>选择日期</mat-label>
      <input matInput [matDatepicker]="picker" />
      <mat-datepicker-toggle matIconSuffix [for]="picker" />
      <mat-datepicker #picker />
    </mat-form-field>

    <mat-date-range-input [rangePicker]="range">
      <input matStartDate /> <input matEndDate />
    </mat-date-range-input>
    <mat-date-range-picker #range />
  `,
})
export class DatepickerDemo {}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MatDatepicker 通过「DateAdapter」抽象层适配多种日期库。

DateAdapter 实现：
- NativeDateAdapter：浏览器原生 Date（默认，无依赖）
- MomentDateAdapter：Moment.js
- LuxonDateAdapter：Luxon
- DateFnsAdapter：date-fns

基础日期 + 日期范围（v10+）都支持。

高级特性：[min] / [max] / [matDatepickerFilter] / startView / 三级钻取。

国际化：MAT_DATE_LOCALE InjectionToken 设置 locale，头部 / 星期 / 月份自动本地化。

无障碍：完整键盘导航（方向键 / Page Up/Down / Home / End），日历单元格 ARIA 标签，焦点管理。
-->

---
transition: fade-out
---

# MatTable + Sort + Paginator

DataSource 三件套

<v-click>

```ts
@Component({
  imports: [MatTableModule, MatSortModule, MatPaginatorModule],
  template: `
    <table mat-table [dataSource]="ds" matSort>
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>姓名</th>
        <td mat-cell *matCellDef="let row">{{ row.name }}</td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="cols" />
      <tr mat-row *matRowDef="let row; columns: cols" />
    </table>
    <mat-paginator [pageSizeOptions]="[5, 10]" />`,
})
export class Demo {
  cols = ['name', 'age'];
  ds = new MatTableDataSource(USERS);
}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MatTable 基于 @angular/cdk/table 的「列定义 + 行模板」架构。

核心结构：
- table mat-table [dataSource]
- ng-container matColumnDef：每列定义
- th mat-header-cell *matHeaderCellDef：列头
- td mat-cell *matCellDef：数据
- tr mat-header-row / mat-row：行模板

DataSource：数组 / MatTableDataSource（内置 filter+sort+paginator）/ 自定义 DataSource。

MatTableDataSource 内置：filter 字符串过滤 / sort 与 MatSort 联动 / paginator 与 MatPaginator 联动 / sortingDataAccessor / filterPredicate。

高级特性：多级排序 / 行选择 / 行展开 / 粘性列 / 粘性行 / 虚拟滚动。

性能：trackBy / OnPush / Server-side pagination。
-->

---
transition: fade-out
---

# MatDialog

模态对话框，inject() + 注入数据 + 返回结果

<v-click>

```ts
// 调用方
export class Caller {
  dialog = inject(MatDialog);
  open() {
    const ref = this.dialog.open(ConfirmDialog, {
      data: { title: '确认删除', message: '不可撤销' },
    });
    ref.afterClosed().subscribe(r => console.log(r));
  }
}
// 对话框组件
@Component({
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>取消</button>
      <button mat-flat-button [mat-dialog-close]="true">确认</button>
    </mat-dialog-actions>`,
})
export class Confirm { data = inject(MAT_DIALOG_DATA); }
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MatDialog 基于 @angular/cdk/overlay 实现的模态对话框，通过编程方式打开任意 Angular 组件。

调用流程：
1. inject(MatDialog) 获取服务
2. dialog.open(Component, config)
3. afterClosed() 监听关闭

语义化指令：
- h2 mat-dialog-title：标题区
- mat-dialog-content：内容区
- mat-dialog-actions：底部按钮区
- mat-dialog-close：关闭
- [mat-dialog-close]="value"：关闭并返回值

数据传递：data 属性 + inject(MAT_DIALOG_DATA)。

配置：width / height / disableClose / autoFocus / restoreFocus / panelClass / position。

无障碍：自动 ARIA modal，focus trap，ESC 关闭，关闭后焦点返回。
-->

---
transition: fade-out
---

# MatBottomSheet + MatSnackBar

底部弹层 + 短消息提示

<v-click>

```ts
// Bottom Sheet：移动端常用
export class Demo1 {
  bs = inject(MatBottomSheet);
  share() {
    const ref = this.bs.open(ShareSheet);
    ref.afterDismissed().subscribe(t => console.log(t));
  }
}

// Snack Bar：底部短消息
export class Demo2 {
  sb = inject(MatSnackBar);
  save() {
    this.sb.open('保存成功', '撤销', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    }).onAction().subscribe(() => this.undo());
  }
  undo() {}
}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Bottom Sheet 与 Snack Bar 是两个常用的反馈组件。

MatBottomSheet 底部抽屉：
- 移动端 UX 首选，从底部弹出
- 适合分享 / 操作菜单 / 选项列表
- inject(MatBottomSheet) + open() / dismiss(value)
- vs Dialog：位置在底部、下滑关闭、移动友好

MatSnackBar 短消息：
- Material Design 规范的底部短消息
- 单行文字 + 最多一个操作按钮 + 自动消失
- 适合操作反馈（保存成功 / 撤销 / 错误）
- 配置：duration / horizontalPosition / verticalPosition / panelClass

实战封装：包装成 NotificationService，统一 success / error / warning / info 四类方法。
-->

---
transition: fade-out
---

# @angular/cdk 六大模块

UI 行为层底座，提供工具不渲染 UI

<v-click>

| 模块          | 作用                          |
| ------------- | ----------------------------- |
| **Overlay**   | 浮层定位（Menu / Dialog 底层）|
| **Portal**    | 跨 DOM 树渲染组件             |
| **A11y**      | FocusTrap / LiveAnnouncer     |
| **Layout**    | BreakpointObserver 响应式     |
| **Drag-Drop** | 拖拽（媲美 dnd-kit）          |
| **Scrolling** | 虚拟滚动 + 滚动观察           |

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @angular/cdk 是 Angular Material 的「行为层底座」——
六大模块各自独立，可单独使用，不依赖 @angular/material UI 渲染。

CDK 设计哲学：
- 提供「行为 + 工具」，不渲染任何 UI
- UI 渲染由调用方负责
- 解决「常见 UX 难题」的可靠方案

模块独立性：单独装 @angular/cdk 即可，每个模块独立 NgModule，树摇友好。

被广泛使用：Angular Material 本身 / NG-ZORRO 部分组件 / PrimeNG 部分组件 / 大量自研 UI 库。

六大模块：
1. Overlay：浮层定位（基于元素 / 视口）
2. Portal：跨 DOM 渲染（ComponentPortal / TemplatePortal / DomPortal）
3. A11y：FocusTrap / FocusMonitor / LiveAnnouncer
4. Layout：BreakpointObserver 响应式断点
5. Drag-Drop：cdkDrag / cdkDropList 完整拖拽
6. Scrolling：cdk-virtual-scroll-viewport 虚拟滚动
-->

---
transition: fade-out
---

# CDK Overlay + Portal

浮层 + 跨 DOM 渲染，组件库底层基础

<v-click>

```ts
export class MenuDemo {
  overlay = inject(Overlay);
  vcr = inject(ViewContainerRef);
  trigger = viewChild<ElementRef>('trigger');
  menuTpl = viewChild<TemplateRef<unknown>>('menuTpl');
  ref?: OverlayRef;

  open() {
    const pos = this.overlay.position()
      .flexibleConnectedTo(this.trigger()!)
      .withPositions([{
        originX: 'start', originY: 'bottom',
        overlayX: 'start', overlayY: 'top', offsetY: 8,
      }]);
    this.ref = this.overlay.create({
      positionStrategy: pos,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
    });
    this.ref.attach(new TemplatePortal(this.menuTpl()!, this.vcr));
  }
}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Overlay + Portal 是 CDK 最核心、最强大的两个模块，所有 Material 的浮层组件底层都基于它。

Overlay 是什么？
- 在「页面最顶层」（document.body 末尾）渲染浮层
- 自动管理 z-index 不冲突
- 自动定位（基于触发元素 + 自适应视口）
- 自动滚动策略

核心 API：
- inject(Overlay) 获取服务
- overlay.create(config) 创建 OverlayRef
- overlayRef.attach(portal) 挂载
- overlayRef.detach() 卸载

PositionStrategy：flexibleConnectedTo（菜单 / Tooltip）/ global（Dialog）/ relativeTo。

ScrollStrategy：noop / close / block / reposition（最常用，滚动跟随）。

Portal 三种：ComponentPortal / TemplatePortal / DomPortal。

实战：一般不直接用，用 MatDialog / MatMenu 等上层 API。自研组件库时才用底层 Overlay / Portal。
-->

---
transition: fade-out
---

# CDK A11y

无障碍工具，业界最完整方案

<v-click>

```ts
@Component({
  standalone: true,
  imports: [A11yModule],
  template: `
    <div cdkTrapFocus [cdkTrapFocusAutoCapture]="true">
      <h2>对话框</h2>
      <input matInput placeholder="输入" />
      <button (click)="announce()">朗读消息</button>
    </div>
  `,
})
export class A11yDemo {
  private liveAnnouncer = inject(LiveAnnouncer);

  announce() {
    this.liveAnnouncer.announce('数据已加载', 'polite');
  }
}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @angular/cdk/a11y 是业界最完整的无障碍工具集。

cdkTrapFocus：焦点陷阱
- 用于 Dialog / Drawer 等模态界面
- 焦点不会通过 Tab 键离开容器
- 配合 cdkTrapFocusAutoCapture 自动聚焦

FocusMonitor：焦点监听
- 监听焦点来源：mouse / keyboard / touch / program
- 用于差异化样式（键盘 focus 显示焦点环，鼠标 focus 不显示）

LiveAnnouncer：屏幕阅读器朗读
- announce(message, priority)
- polite（等待）/ assertive（立即）
- 用于异步操作反馈

FocusKeyManager：键盘导航 + Type-ahead 搜索。

InteractivityChecker：isFocusable / isTabbable / isDisabled / isHidden。

实战要点：
- Dialog / Drawer 用 cdkTrapFocus（焦点不逃逸）
- 异步操作完成后 announce（'加载完成' / '保存成功'）
- 自定义键盘导航用 FocusKeyManager
- 按钮 :focus-visible 用 FocusMonitor

vs 第三方：比 react-aria 更完整，比 react-focus-lock 更轻量。
-->

---
transition: fade-out
layoutClass: gap-x-8
layout: two-cols-header
---

# CDK Layout / Drag-Drop / Scrolling

响应式 + 拖拽 + 虚拟滚动三件套

::left::

<v-click>

**Layout — 响应式**

```ts
isMobile = toSignal(
  inject(BreakpointObserver)
    .observe(Breakpoints.XSmall)
    .pipe(map(r => r.matches)),
  { initialValue: false }
);
```

**Scrolling — 虚拟滚动**

```html
<cdk-virtual-scroll-viewport
  itemSize="50"
  style="height: 400px;"
>
  @for (item of items; track item.id) {
    <div>{{ item.name }}</div>
  }
</cdk-virtual-scroll-viewport>
```

</v-click>

::right::

<v-click>

**Drag-Drop — 拖拽**

```ts
@Component({
  standalone: true,
  imports: [DragDropModule],
  template: `
    <div cdkDropList (cdkDropListDropped)="drop($event)">
      @for (item of items; track item) {
        <div cdkDrag>{{ item }}</div>
      }
    </div>
  `,
})
export class DragDemo {
  items = ['A', 'B', 'C', 'D'];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }
}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] CDK 三个高频实战模块：响应式 / 拖拽 / 虚拟滚动。

Layout 模块：
- BreakpointObserver：监听媒体查询变化
- Breakpoints 预设：XSmall / Small / Medium / Large / XLarge
- 与 toSignal() 配合，模板直接用 isMobile() 取值

Scrolling 模块：
- cdk-virtual-scroll-viewport：虚拟滚动容器
- itemSize：固定项高度（性能最好）
- 只渲染可见区域 + 缓冲，万条数据流畅

Drag-Drop 模块：
- cdkDrag：可拖拽元素
- cdkDropList：放置区
- cdkDropListGroup：跨列表拖拽组
- moveItemInArray / transferArrayItem 工具函数

高级特性：拖拽手柄 / 拖拽预览 / 拖拽占位符 / 拖拽约束 / 拖拽自动滚动 / 触摸支持。

适用场景：看板（Trello）/ 列表排序 / 仪表盘 / 表单设计器。

实战经验：Trello 克隆只需 100 行代码，性能比 react-beautiful-dnd 好，移动端触摸完美支持。
-->

---
transition: fade-out
---

# mat.theme() 新 API

v19+ 单一函数生成主题，告别 mat.core() 拼装

<v-click>

```scss
@use '@angular/material' as mat;

html {
  color-scheme: light dark;

  /* mat.theme() v19+：一个函数搞定所有 */
  @include mat.theme((
    color: (
      primary: mat.$violet-palette,
      tertiary: mat.$orange-palette,
      theme-type: light,
    ),
    typography: Roboto,
    density: 0,
  ));
}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] mat.theme() 是 Angular Material v19 推出的核心 API 改进 ——
单一函数生成完整主题，告别老的 mat.core() + mat.all-component-themes() 拼装。

老 API 痛点（v15-v18）：
- 需要先 @include mat.core()
- 然后 mat.define-light-theme(...) 定义主题对象
- 然后 @include mat.all-component-themes($theme) 应用
- 三步走，啰嗦容易出错

新 API 优势（v19+）：
- 一行搞定，不需要 mat.core()
- 参数对象式 API（IDE 提示友好）

参数详解：
- color：主色 palette + tertiary + theme-type
- typography：字体名
- density：密度（0 ~ -5）

预设 palette（11 种）：azure / blue / cyan / green / magenta / orange / red / rose / spring-green / violet / yellow。

theme-type：light / dark / color-scheme（跟随系统）。

迁移：新项目直接用 mat.theme()，老项目渐进迁移（与老 API 共存）。
-->

---
transition: fade-out
---

# Material 3 design tokens

--mat-sys-* CSS 变量体系

<v-click>

```scss
/* Angular Material v20 生成的 CSS 变量（自动） */
:root {
  /* 系统颜色 tokens */
  --mat-sys-primary: rgb(103, 80, 164);
  --mat-sys-on-primary: rgb(255, 255, 255);
  --mat-sys-primary-container: rgb(234, 221, 255);

  --mat-sys-surface: rgb(254, 247, 255);
  --mat-sys-on-surface: rgb(28, 27, 31);
  --mat-sys-surface-container: rgb(243, 237, 247);

  /* 排版 tokens */
  --mat-sys-headline-large: 400 32px / 40px Roboto;
  --mat-sys-body-medium: 400 14px / 20px Roboto;
}

/* 自定义组件使用系统 tokens */
.my-card {
  background: var(--mat-sys-surface-container);
  color: var(--mat-sys-on-surface);
  border-radius: 12px;
}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Material 3 引入完整 design tokens 体系，所有颜色 / 排版 / 形状 / 高度都用 --mat-sys-* CSS 变量表达。

为什么 design tokens？
- 主题运行时切换：直接改 CSS 变量
- 命名一致 + 跨平台
- 工具友好（Figma / Material Theme Builder 输出）

颜色 tokens 体系：
- 主色三组：primary / secondary / tertiary
- 每组四阶：xxx / on-xxx / xxx-container / on-xxx-container
- 表面色：surface / surface-container / surface-dim / surface-bright

排版 tokens：display / headline / title / body / label 五级，每级 large/medium/small。

形状 tokens：corner-none / extra-small(4) / small(8) / medium(12) / large(16) / extra-large(28)。

高度 tokens（elevation）：--mat-sys-level0 ~ level5。

组件 tokens（component level）：--mat-button-* / --mat-card-* / --mat-form-field-*。

自定义组件用 tokens 不写硬编码颜色，自动适配 light / dark 主题。
-->

---
transition: fade-out
---

# 双 palette / Density / Typography

Material 3 主题三大维度

<v-click>

```scss
@use '@angular/material' as mat;

html {
  @include mat.theme((
    color: (
      primary: mat.$violet-palette,
      tertiary: mat.$orange-palette,
      theme-type: color-scheme,
    ),
    typography: (
      plain-family: 'Inter',
      brand-family: 'Roboto Flex',
      bold-weight: 700,
    ),
    density: -1,
  ));
}

/* 局部覆盖密度 */
.compact-table {
  @include mat.theme((density: -3));
}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Material 3 主题三大维度：color / typography / density。

Color 颜色：
- primary：主色（CTA / 主要操作）
- secondary：次色（次要操作）
- tertiary：第三色（装饰 / 对比，M3 引入）
- theme-type：light / dark / color-scheme

双 palette 创新：M2 只有 primary + accent + warn，M3 引入 primary + secondary + tertiary，每个有完整 tonal palette（0-100 阶）。

Typography 排版：
- plain-family：正文字体
- brand-family：品牌字体（标题用）
- 字重：bold/medium/regular-weight

实战字体：Roboto（默认）/ Roboto Flex（可变字体）/ Inter / 系统字体（最佳性能）。

Density 密度：
- 0：默认（48px 按钮）
- -1：紧凑（40px）
- -2 ~ -5：极紧凑（数据密集）

局部覆盖：.compact-table 容器内重新 @include mat.theme()。

dark mode 实现：theme-type: color-scheme 浏览器自动 / .dark-mode class 手动切换 / [data-theme="dark"] 属性切换。
-->

---
transition: fade-out
---

# Component Harness 测试

黑盒测试方案，跨测试环境复用

<v-click>

```ts
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';

describe('LoginForm', () => {
  let loader: HarnessLoader;

  beforeEach(() => {
    const fix = TestBed.createComponent(LoginForm);
    loader = TestbedHarnessEnvironment.loader(fix);
  });

  it('表单有效时按钮可点', async () => {
    const email = await loader.getHarness(MatInputHarness);
    const btn = await loader.getHarness(
      MatButtonHarness.with({ text: '登录' }),
    );
    expect(await btn.isDisabled()).toBe(true);
    await email.setValue('test@example.com');
  });
});
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Component Harness 是 Angular Material 推出的测试方案 ——
通过「Harness 类」抽象组件行为，测试代码与组件实现解耦。

为什么需要 Harness？
- 传统测试与 CSS / DOM 结构强耦合
- 组件升级时（M2 → M3）DOM 变化，大量测试要重写
- Harness 是抽象层，组件升级后内部适配，测试代码不变

Harness 对应：MatButtonHarness / MatInputHarness / MatSelectHarness / MatDialogHarness 等 60+。

跨测试环境复用：
- TestbedHarnessEnvironment：Karma / Jest 单元测试
- WebDriverHarnessEnvironment：Selenium WebDriver
- 同一份 Harness 可在单元 / 集成 / E2E 中复用

API 模式：
- HarnessLoader 入口：getHarness / getAllHarnesses
- HarnessPredicate：with({ text / selector / ancestor / name }) 过滤
- 异步 API：所有 Harness 返回 Promise

vs Testing Library：Harness 更精确（按组件类型），Testing Library 更接近用户视角，实践中混用。

无障碍测试：getAriaLabel / getId + aria-labelledby 验证。
-->

---
transition: fade-out
---

# SSR 与 Standalone API

服务端渲染 + 现代化注册方式

<v-click>

```ts
// app.config.ts (Standalone)
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideClientHydration(withEventReplay()),
  ],
};

// 组件直接 Standalone 引入
@Component({
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule],
})
export class MyComponent {}
```

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Angular Material 全面拥抱 Standalone Components + SSR。

Standalone Components（v17+）：
- 不再需要 NgModule.declarations
- 组件直接 imports: [...] 引入依赖
- 兼容老 NgModule（共存过渡）

MatXxxModule 仍可用：老的 MatButtonModule 仍有效，在 Standalone 组件的 imports 中引入即可。

按需引入优势：tree-shaking 友好 / 编译速度提升 / 代码更内聚。

provideAnimationsAsync：M3 推荐异步加载动画引擎，减小首屏 bundle。

SSR 配合：
- @angular/ssr 包提供 SSR 引擎
- ng add @angular/ssr 一键启用
- provideClientHydration() 启用客户端水合
- withEventReplay()：水合期间事件回放

Material SSR 兼容性：大部分组件直接 SSR 友好，Overlay 类组件 SSR 时不渲染（仅客户端显示）。

升级路径：ng generate @angular/core:standalone（自动 codemod），逐组件迁移。
-->

---
transition: fade-out
---

# 常见踩坑

升级 + 样式 + SSR + Forms 实战问题

<v-click>

**踩坑 1：升级到 v15+ 后样式全乱**

原因：v15 MDC 集成完成，DOM 结构 + CSS 类大变。
修复：`ng update @angular/material` 自动 codemod。

</v-click>

<v-click>

**踩坑 2：mat-typography 样式没生效**

原因：必须在祖先元素加 class。
修复：`<html class="mat-typography">` 或 `<body class="mat-typography">`。

</v-click>

<v-click>

**踩坑 3：MatDialog SSR 报错**

原因：SSR 时浮层不可用。
修复：检查 `isPlatformBrowser(PLATFORM_ID)` 后再调用。

</v-click>

<v-click>

**踩坑 4：OnPush + MatFormField 不更新**

原因：FormControl statusChanges 是异步流。
修复：用 AsyncPipe 或 `cdr.markForCheck()`。

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Angular Material 常见踩坑集锦。

踩坑 1：v15+ MDC 升级
- v15 是分水岭，所有组件改用 MDC Web 实现
- DOM 结构变化（原来的 div / span 嵌套被重构）
- CSS 类名变化（mat-button → mdc-button + 多层包装）
- 自定义样式如果直接选了内部类，全部失效

修复：必跑 ng update @angular/material@15，自动 codemod 会标记需要手动检查的样式。检查所有 ::ng-deep 自定义，优先用 :host 主题 token 覆盖。

[click] 踩坑 2：mat-typography class 没加
- Material 排版样式只在 .mat-typography 容器内生效
- 默认 ng add 会自动加，手动安装时容易遗漏

修复：index.html 添加 <html class="mat-typography"> 或 <body class="mat-typography">。

[click] 踩坑 3：SSR + Dialog hydration 错误
- Dialog 是浮层组件，仅在浏览器端有意义
- SSR 时调用 dialog.open() 会报错

修复：用 isPlatformBrowser(PLATFORM_ID) 检查，或用 afterNextRender() 钩子（v17+，仅浏览器端执行）。

[click] 踩坑 4：OnPush 变更检测
- OnPush 只响应 @Input 引用变化和事件
- FormControl 的 valueChanges / statusChanges 是异步流

修复方案：
1. AsyncPipe：模板自动 markForCheck
2. cdr.markForCheck()：订阅后手动触发
3. Signal-based Forms（v18+）：valueChangesSignal 自动 markForCheck

额外踩坑：
- Datepicker locale 默认英文，需配置 MAT_DATE_LOCALE
- Overlay 浮层被 overflow:hidden 裁剪 → 用 CDK Overlay
- mat-table column 错位 → displayedColumns 与 matColumnDef key 一一对应
- 动画与 Zoneless 冲突 → 用 provideAnimationsAsync()
-->

---
transition: fade-out
---

# 学习路径与资源

从入门到精通的官方资源

<v-click>

**官方资源**

- [Angular Material 文档](https://material.angular.dev/) — 60+ 组件 + Guides
- [Material 3 设计规范](https://m3.material.io/) — 视觉设计原文
- [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/) — 主题色生成
- [@angular/cdk 文档](https://material.angular.dev/cdk/categories) — CDK 底层模块

</v-click>

<v-click>

**配套生态**

- [Material Icons](https://fonts.google.com/icons) — Material Symbols 完整目录
- [Material 3 Figma Kit](https://www.figma.com/community/file/1035203688168086460) — 设计稿
- [Material Color Utilities](https://github.com/material-foundation/material-color-utilities) — 动态色算法

</v-click>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Angular Material 学习是 Angular 工程师的必修课。

官方资源优先级：
1. material.angular.dev → 主入口，所有组件 + Guide
2. m3.material.io → Material 3 设计规范原文（必读）
3. Material Theme Builder → 主题色生成工具
4. CDK 文档 → 底层模块完整

文档结构（v18+ 改版）：
- Components：60+ 组件，每个有 Overview / API / Examples
- Guides：主题 / 排版 / 密度 / SSR / 测试 / 升级
- CDK：六大模块独立章节

学习节奏建议：
- 第 1 周：ng add + 5 个基础组件
- 第 2 周：mat.theme() + design tokens
- 第 3 周：MatTable + DataSource 完整方案
- 第 4 周：CDK 模块（Overlay / A11y 优先）
- 第 2 月：Component Harness 测试 + SSR
- 第 3 月：自定义组件 + token 深度定制

[click] 配套生态：

Material Icons / Symbols：
- 2000+ Symbols（M3 推荐，可变字重 / 填充）
- <mat-icon>favorite</mat-icon>

Figma Kit：官方设计稿，与 Angular Material 1:1 对应。

Material Color Utilities：动态色算法（Material You 核心），HCT 色彩空间，从一个种子色生成完整 palette。

社区资源：
- Angular Components Discord 官方频道
- Stack Overflow 标签 angular-material
- Angular Connect / ng-conf 年度大会
- DecodedFrontend / Joshua Morony / Akveo YouTube 频道

招聘市场：Angular 中高级岗位 Material 是标配，大厂明确要求「精通 Angular Material」，简历加分项：主题定制 + CDK 深度 + Harness 测试。
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看

Angular Material — Material Design for Angular

<div class="mt-8 text-lg">

**核心心智**

- Angular 官方组件库 — 60+ 组件 + @angular/cdk 底座
- Material 3 设计语言 — 双 palette + tonal + design tokens
- mat.theme() 新 API — v19+ 单函数生成主题
- design tokens 体系 — --mat-sys-* CSS 变量，运行时切换
- Standalone-first — v17+ 按需引入 + SSR 完美兼容

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://material.angular.dev/" target="_blank" class="slidev-icon-btn">
    Angular Material 文档
  </a>
  <a href="https://github.com/angular/components" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
</div>

<style>
h1 {
  background-color: #DD0031;
  background-image: linear-gradient(45deg, #DD0031 10%, #C3002F 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：Angular Material = Google 官方 Angular UI 库 + Material 3 设计语言 + @angular/cdk 底座。

核心心智五条：
1. 官方背书：Google Angular Components 团队维护，60+ 组件，与 Angular 同步发布
2. Material 3 设计：v17 GA，双 palette + tonal + design tokens
3. mat.theme() 新 API：v19+ 单函数搞定主题
4. design tokens 体系：--mat-sys-* CSS 变量，运行时主题切换成为可能
5. Standalone-first：v17+ 按需引入，配 SSR + Zoneless + 现代 Angular 写法

适合什么团队？
- Angular 项目通用首选（最优选）
- C 端 / 移动端 / 全球化项目
- 需要 A11y 合规

进阶建议：
- 第一步：ng add + 写 5 个基础组件
- 第二步：mat.theme() + design tokens 自定义主题
- 第三步：MatTable + DataSource + Sort + Paginator
- 第四步：CDK 六大模块
- 第五步：Component Harness 测试 + SSR
- 第六步：自研 design system 扩展 token 体系

Google 官方背书 + Material 3 设计语言 + @angular/cdk 底座 —— Angular Material 在 2026 年依然是 Angular UI 库事实标准的原因。

感谢观看！🅰️
-->
