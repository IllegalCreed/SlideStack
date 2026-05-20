---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Headless UI
info: |
  Presentation Headless UI for React (v2) and Vue (v1) — Tailwind Labs Unstyled Components.

  Learn more at [https://headlessui.com/](https://headlessui.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎧</span>
</div>

<br/>

## Headless UI — Tailwind Labs 出品的无样式组件

完美 a11y / Anchor Positioning / transition prop / 与 Tailwind CSS 无缝集成

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Headless UI —— Tailwind Labs 团队（Adam Wathan / Robin Malfait 等）出品的「无样式 + 完美 a11y」组件库，
是 Tailwind CSS 官方生态的核心组成。

定位：
- 与 Tailwind CSS 无缝集成的「Headless 行为层」
- 不提供任何样式 —— 全部由 Tailwind 类名填充
- 完美 WAI-ARIA + 键盘 + 焦点 + 屏幕阅读器
- 适配 Tailwind UI / Catalyst（付费组件库）—— Tailwind Labs 自家产品都用 Headless UI 作底层

当前版本：
- **React v2.x**（主线）：2024 年初发布的大重写
  - 全面拥抱 Anchor Positioning（CSS 锚点定位 polyfill）
  - 内置 transition prop + data-* 属性（替代 Transition 组件）
  - 新增 Checkbox / Field / Fieldset / Input / Select / Textarea / Label / Description / Combobox 虚拟滚动
  - 总计 16 个组件
- **Vue v1.x**：维护模式，落后 React v2 约一年
  - 仍是经典 Transition 组件 + render scoped slots 模式
  - 10 个组件（Menu / Listbox / Combobox / Dialog / Disclosure / Popover / Switch / Tabs / RadioGroup / Transition）

核心特性：
- **完全无样式**：所有组件零 CSS，你用 Tailwind / 任意 CSS 方案填充
- **render props（React）/ scoped slots（Vue）**：暴露 open / active / checked / disabled 等状态
- **data-* 双模式（v2 新增）**：data-open / data-active / data-focus / data-checked，CSS 选择器直接写
- **Headless 行为**：键盘导航 / 焦点陷阱 / 滚动锁定 / ESC 关闭 / Portal 渲染全部内置
- **WAI-ARIA 模式**：每个组件遵循 WAI-ARIA Authoring Practices Guide
- GitHub 27K+ star（React + Vue 合计）
- 与 Tailwind UI / Catalyst 紧密协同 —— 付费组件库的底层

本次内容聚焦：
- Headless UI React v2（当前主线）
- Vue v1（参考对照）
- v2 杀手锏：Anchor Positioning / transition prop / Combobox 虚拟滚动 / Field 表单 ARIA
- 与 Radix UI / Ark UI / shadcn 的横向对比

注意：内容以 React v2 为主，Vue v1 在跨框架对比章节补充差异。
-->

---
transition: fade-out
---

# 什么是 Headless UI？

Tailwind Labs 出品的「无样式 + 完美 a11y」React/Vue 组件库

<v-click>

- **零样式**：所有组件 zero CSS，全部由 Tailwind / 你的 CSS 方案填充
- **完美 a11y**：每组件遵循 WAI-ARIA APG，键盘 / 焦点 / 屏幕阅读器全包
- **React v2 主线**：Anchor Positioning + transition prop + Combobox 虚拟滚动 + Field 表单 ARIA
- **Vue v1**：维护模式，仍是 scoped slots + Transition 组件经典模式
- **与 Tailwind CSS 无缝**：data-\* 属性 + Tailwind v4 `data-[open]:` 语法完美适配
- **render props / scoped slots**：暴露 open / active / checked / disabled 等状态
- **Tailwind UI / Catalyst 底层**：Tailwind Labs 付费组件库都基于它
- **Portal + 焦点陷阱**：Dialog 自动 portal + scroll lock + ESC 关闭
- **MIT 协议**：完全开源免费

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Headless UI v2_](https://headlessui.com/)

</div>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Headless UI 的定位非常特别 —— 不是「又一个 Headless 库」，而是「Tailwind 官方钦定的 Headless 行为层」。

**Tailwind Labs 出品**：
- 同一个团队同时维护 Tailwind CSS / Headless UI / Heroicons / Tailwind UI / Catalyst
- 设计哲学一致：行为与样式分离，把样式权完全交给你
- Adam Wathan / Robin Malfait / Reinier de Lange 等核心成员

**为什么需要 Headless UI**：
- Tailwind CSS 是「样式工具」—— 但 Dropdown / Modal / Listbox 等交互组件不只是 CSS
- 需要焦点管理 / ARIA 属性 / 键盘导航 / Portal 等「行为」
- Tailwind Labs 自己的付费产品（Tailwind UI / Catalyst）也需要底层
- 于是他们做了 Headless UI —— 把行为做到极致，把样式留给 Tailwind

**核心特性深度展开**：

1. **零样式**：
   - 所有组件无任何内置 CSS
   - 你用 className 完全自由填充
   - 默认 DOM 元素（如 Menu.Button 是 button，Listbox.Options 是 ul）

2. **完美 a11y**：
   - WAI-ARIA Menu Button / Listbox / Combobox / Dialog / Tabs / Disclosure 模式
   - 键盘：Tab / Arrow / Home / End / Enter / Esc / Space / 字母 typeahead
   - 焦点陷阱（Dialog / Popover）
   - 焦点恢复（关闭后回到 Trigger）

3. **React v2 杀手锏**：
   - Anchor Positioning（floating-ui 内置）
   - transition prop 替代 Transition 组件
   - data-open / data-active 属性
   - Field 自动注入 aria-labelledby / aria-describedby
   - Combobox 虚拟滚动（TanStack Virtual 内置）

4. **Vue v1（落后版本）**：
   - 仍是 Transition 组件包装
   - 仍是 scoped slots 暴露状态
   - 10 个组件 vs React 的 16 个
   - 主要差异：无 Anchor Positioning / 无 transition prop / 无 Field / 无虚拟滚动

5. **生态地位**：
   - GitHub 27K+ star（React 仓 + Vue 仓合计）
   - Tailwind UI（80+ 组件）底层
   - Catalyst（Tailwind Labs 高端 React 组件）底层
   - Tailwind 用户的「默认 Headless 选择」

下面按「Tailwind Labs 出品 → 与 Catalyst / Tailwind UI 关系 → React v2 vs Vue v1 不对称 → 16 个组件分组 → v2 杀手锏 → 各组件 → 集成 → 对比 → 踩坑 → 学习路径」讲透。
-->

---
transition: fade-out
---

# Tailwind Labs 全家桶定位

同一团队，多产品协同

<v-click>

| 产品              | 性质         | 定位                              |
| ----------------- | ------------ | --------------------------------- |
| **Tailwind CSS**  | 开源 utility | 样式工具，atomic CSS 框架         |
| **Headless UI**   | 开源 lib     | 无样式行为层（React / Vue）       |
| **Heroicons**     | 开源 SVG     | 单色图标集（24x24 / 20x20 / 16x16）|
| **Tailwind UI**   | **付费**     | 500+ 静态组件（HTML / React / Vue）|
| **Catalyst**      | **付费**     | 30+ 完整 React 应用 UI Kit        |
| **Tailwind Plus** | **订阅**     | Tailwind UI + Catalyst 合并产品   |

</v-click>

<v-click>

> 提示：Headless UI 是「免费基石」—— Tailwind UI / Catalyst 这两个付费产品都把它作底层。

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Tailwind Labs 的产品矩阵 —— 这是理解 Headless UI 定位的关键。

**Tailwind Labs 是商业公司，多产品养活团队**：
- 主创 Adam Wathan 早期靠 Tailwind UI 付费才让 Tailwind CSS 持续开发
- 现在是「免费开源 + 付费组件」双线
- 开源工具吸引用户 → 付费组件变现 → 资金反哺开源

**产品矩阵详解**：

1. **Tailwind CSS**（开源）：
   - atomic CSS 框架
   - 最新 v4（Lightning CSS 引擎）
   - 周下载 1000 万+
   - 是整个生态的「主产品」

2. **Headless UI**（开源）：
   - React v2 + Vue v1
   - 无样式行为层
   - 与 Tailwind CSS 配套
   - 本次主角

3. **Heroicons**（开源）：
   - SVG 图标集（200+ 图标）
   - 3 个变体：24x24 outline / 24x24 solid / 20x20 mini / 16x16 micro
   - React / Vue 包装
   - 周下载 200 万+

4. **Tailwind UI**（付费 ~$299）：
   - 500+ 静态组件（marketing / application UI / ecommerce）
   - HTML / React / Vue 三个版本
   - 用 Headless UI 实现交互组件
   - 复制粘贴模式（不是 npm 包）

5. **Catalyst**（付费 ~$299）：
   - 30+ 完整 React 组件（Application UI 重点）
   - 整套 UI Kit + 主题
   - 包含 Dialog / Combobox / Sidebar / Auth Pages 等
   - 用 Headless UI 作底层

6. **Tailwind Plus**（订阅 ~$299/年）：
   - 2024 年 Tailwind Labs 把 Tailwind UI + Catalyst 合并为 Tailwind Plus
   - 一次订阅获得所有付费组件
   - 终身永久也有选项

[click] **关键定位**：

- **Headless UI 是免费基石** —— 把它做强，付费产品才能立
- **Tailwind UI 是样式参考** —— 你买它能看到 Tailwind 类怎么用 Headless UI 包
- **Catalyst 是高端样板** —— 更现代的 React 设计 + 完整 UI Kit

业务建议：
- 个人项目 / 学习 → Headless UI + 自己写 Tailwind 样式
- 中小公司 → Headless UI + 抄 Tailwind UI 例子
- 大公司 / 严肃产品 → 买 Catalyst + 在 Headless UI 上自定义

Tailwind 生态对 a11y 的态度 —— 全部内置，因为他们自己卖 Tailwind UI 要保证质量。
-->

---
transition: fade-out
---

# React v2 vs Vue v1 不对称

Headless UI 最让人困惑的事实

<v-click>

| 维度                      | **React v2.x**       | Vue v1.x         |
| ------------------------- | -------------------- | ---------------- |
| 当前版本 / 组件数         | **2.2+ / 16 个**     | 1.7+ / 10 个     |
| Anchor / transition prop  | **内置 floating-ui** | 无 / 老 Transition |
| Field / Checkbox / Input  | **v2 新增**          | 无               |
| Combobox 虚拟滚动         | TanStack Virtual     | 无               |
| 维护节奏                  | 主线活跃             | 落后约 1 年      |

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **React 和 Vue 版本不对称** —— 这是 Headless UI 用户最容易踩坑的事实。

**React v2.x 是 2024 年初的大重写**：

新增组件（v1 没有的）：
- Checkbox
- Input / Textarea
- Select（原生 select 包装）
- Field / Fieldset / Label / Description
- Button（带 hover/active/focus data-*）

杀手级特性：
- **Anchor Positioning**：内置 floating-ui，所有 Popover / Menu / Listbox / Combobox / Dialog 等浮层定位组件用 `anchor` prop 一键启用
- **transition prop + data-*：取代 Transition 组件，CSS transition + data-closed/data-open 直接写 Tailwind
- **Combobox 虚拟滚动**：内置 TanStack Virtual，10K+ 项性能完美
- **Field 自动注入 ARIA**：Field 包 Label + Input + Description + ErrorMessage，自动 aria-labelledby / aria-describedby / aria-invalid

**Vue v1.x 维护模式**：

10 个组件：
- Menu / Listbox / Combobox / Dialog / Disclosure / Popover / Switch / Tabs / RadioGroup / Transition

但落后：
- 无 Anchor Positioning（自己写 floating-ui 集成）
- 无 transition prop（仍用 `<TransitionRoot>` 组件）
- 无 Field / Fieldset / Label
- 无 Checkbox / Input / Select / Textarea
- 无虚拟滚动
- 无新 data-* 属性

**为什么不对称？**

Tailwind Labs 团队历史上以 React 为主：
- Adam Wathan / Robin Malfait 都是 React 开发者
- Tailwind UI 早期只有 HTML + React
- 后来加 Vue 但靠社区贡献维护
- v2 大重写时 Vue 没跟上

**Vue 用户的选择**：

1. 用 Vue v1 凑合（功能少但够基础）
2. 等 v2 Vue 版本（Tailwind Labs 没有明确计划）
3. 转 Radix Vue（社区移植 Radix 到 Vue）
4. 用 Ark UI（XState 驱动跨框架）

Radix Vue 是当前 Vue 用户的「Headless UI 替代品」选择，包含 30+ 组件，远超 Vue 版 Headless UI。

下面内容以 React v2 为主，必要时标注 Vue v1 差异。
-->

---
transition: fade-out
---

# 16 个组件分组速览

按场景分组的完整组件清单（React v2）

<v-click>

**菜单 / 选择**：Menu / Listbox / Combobox / Select

</v-click>

<v-click>

**浮层 / 对话框**：Dialog / Popover / Disclosure

</v-click>

<v-click>

**表单输入**：Checkbox / Input / Textarea / RadioGroup / Switch

</v-click>

<v-click>

**表单结构**：Field / Fieldset / Label / Description

</v-click>

<v-click>

**布局 / 容器**：Tabs / Button

</v-click>

<v-click>

> 提示：v1 React / v1 Vue 只有 10 个组件 —— Checkbox / Input / Textarea / Select / Field / Fieldset / Label / Description / Button 都是 v2 新增。

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **菜单 / 选择类**：

- **Menu**：命令菜单（DropdownMenu），点击 Button 弹出 Items
  - 类似 Radix DropdownMenu
  - 键盘 typeahead / Arrow 导航 / Esc 关闭
  - 一般用于「操作菜单」（保存/导出/删除）

- **Listbox**：单选 / 多选下拉
  - 类似 Radix Select 但更灵活
  - 自定义 trigger / option 显示
  - 支持 multiple prop
  - 表单语义（role="listbox"）

- **Combobox**：带搜索框的下拉
  - 这是 Radix Primitives 缺失的（要用 cmdk 替代）
  - Headless UI 自带，且支持虚拟滚动（v2）
  - 业务最强的 Combobox 实现

- **Select**（v2 新增）：原生 select 包装
  - 实际是 styled `<select>` 元素
  - 不是自定义下拉（用 Listbox / Combobox）
  - 适合简单单选

[click] **浮层 / 对话框**：

- **Dialog**：模态对话框
  - 焦点陷阱 + ESC + 滚动锁定 + Portal
  - DialogPanel / DialogTitle / DialogDescription / CloseButton

- **Popover**：浮动面板
  - 点击触发 + Anchor Positioning（v2）
  - 可放任何内容（表单 / 按钮 / 列表）

- **Disclosure**：可折叠区块
  - 单个 Toggle + Panel
  - 类似 Radix Collapsible
  - 默认 button 触发，可包成 Accordion

[click] **表单输入（v2 新增 4 个）**：

- **Checkbox**：复选框（支持 indeterminate）
- **Input**：文本输入框
- **Textarea**：多行文本
- **RadioGroup**：单选组（roving tabindex）
- **Switch**：开关

[click] **表单结构（v2 新增）**：

- **Field**：表单字段容器（自动连接 Label / Input / Description / ErrorMessage 的 ARIA）
- **Fieldset**：字段组（disabled / 多字段共享状态）
- **Label**：标签
- **Description**：描述
- **ErrorMessage**：错误提示（v2.2+）

[click] **布局 / 容器**：

- **Tabs**：标签页（TabGroup / TabList / Tab / TabPanels / TabPanel）
- **Button**：基础按钮（带 data-hover / data-active / data-focus / data-disabled）

[click] **v2 新增的 9 个组件**让 Headless UI 终于成为「完整表单库」 —— v1 时代要 Checkbox / Input 等只能用原生 + 自己写 ARIA。

Vue v1 仍是「7 个交互组件 + 3 个工具组件」的旧时代清单。
-->

---
transition: fade-out
---

# v2 杀手锏速览

让 Headless UI 重新成为 React UI 一线选择的四大改进

<v-click>

```tsx
// 1. Anchor Positioning + 2. transition prop + data-closed
<PopoverPanel anchor="bottom end" transition
  className="transition data-[closed]:opacity-0 data-[closed]:translate-y-1">
  ...
</PopoverPanel>
```

</v-click>

<v-click>

```tsx
// 3. Combobox 虚拟滚动（virtual prop）
<Combobox value={value} onChange={setValue} virtual={{ options: filtered }}>
  <ComboboxOptions>
    {({ option }) => <ComboboxOption value={option}>{option.name}</ComboboxOption>}
  </ComboboxOptions>
</Combobox>

// 4. Field 自动注入 ARIA
<Field><Label>邮箱</Label><Input name="email" /><Description>必填</Description></Field>
```

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **杀手锏 1 - Anchor Positioning（v2.0）**：

之前用 Headless UI Popover / Menu，浮层定位要自己写：
- 自己拉 floating-ui
- 自己监听 scroll / resize
- 自己处理 collision detection

v2 直接内置：
```tsx
<PopoverPanel anchor="bottom end">
```

`anchor` 接受：
- 字符串：`"bottom start"` / `"top end"` / `"right"` / `"left start"` 等
- 对象：`{ to: "bottom start", gap: 8, padding: 16 }`

底层是 floating-ui（同 Radix 用的），但 Headless UI 把 API 收敛到一个 prop。

支持的组件：
- Popover.Panel
- Menu.Items
- Listbox.Options
- Combobox.Options
- Dialog（部分）

没有 anchor prop 时 Panel 是 absolute 定位你自己写 CSS。

[click] **杀手锏 2 - transition prop + data-***：

v1 时代用 Transition 组件：
```tsx
<Transition show={isOpen} enter="..." enterFrom="..." enterTo="..." leave="...">
  <DialogPanel>...</DialogPanel>
</Transition>
```

v2 简化为 transition prop：
```tsx
<DialogPanel transition className="transition data-[closed]:opacity-0">
  ...
</DialogPanel>
```

工作原理：
- 组件渲染时 data-closed / data-open 属性
- CSS transition 监听 data 变化
- 移除 Transition 组件，DOM 树更扁
- Tailwind v4 `data-[closed]:opacity-0` 完美适配

支持组件：
- DialogPanel
- DialogBackdrop
- MenuItems
- ListboxOptions
- ComboboxOptions
- PopoverPanel
- DisclosurePanel
- TabPanel

老 Transition 组件依然可用（兼容 v1 代码）。

[click] **杀手锏 3 - Combobox 虚拟滚动**：

这是 v2 重磅特性 —— 解决「Combobox 1000+ 项卡」的工业难题。

```tsx
<Combobox
  value={value}
  onChange={setValue}
  virtual={{ options: filteredOptions }}
>
  <ComboboxInput />
  <ComboboxOptions>
    {({ option }) => (
      <ComboboxOption value={option}>
        {option.name}
      </ComboboxOption>
    )}
  </ComboboxOptions>
</Combobox>
```

- 底层是 TanStack Virtual
- 只渲染可视区项（10-20 个）
- 支持 10000+ 项不卡
- 键盘 / 选中 / typeahead 全 OK

竞品对比：
- Radix Select 内置 scroll 但不是真虚拟（DOM 还在）
- cmdk 默认不虚拟（要自己 hack）
- Combobox 虚拟是 Headless UI 独家亮点

[click] **杀手锏 4 - Field 表单 ARIA 自动**：

v2 新增 Field 容器，自动处理 ARIA：

```tsx
<Field>
  <Label>邮箱</Label>
  <Input name="email" />
  <Description>必填，工作邮箱</Description>
</Field>
```

自动做：
- Label 的 htmlFor 关联 Input 的 id
- Input 的 aria-labelledby 指向 Label
- Input 的 aria-describedby 指向 Description
- 自动生成 ID（不冲突）

ErrorMessage（v2.2+）：
```tsx
<Field>
  <Label>邮箱</Label>
  <Input name="email" invalid={!!error} />
  <ErrorMessage>{error}</ErrorMessage>
</Field>
```

- `invalid` 自动设 aria-invalid
- ErrorMessage 自动 aria-describedby 关联

Fieldset / Legend：
```tsx
<Fieldset>
  <Legend>偏好设置</Legend>
  <Field>...</Field>
  <Field>...</Field>
</Fieldset>
```

- Fieldset disabled 时所有 Field 自动 disabled
- Legend 自动 ARIA 关联

这是「表单 ARIA 痛点」的官方解药 —— 业务里 70% ARIA bug 都是 label/description 没连对。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# Menu — 命令菜单

DropdownMenu 等价物，键盘 + typeahead + a11y 全包

::left::

<v-click>

```tsx
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

<Menu>
  <MenuButton>Options</MenuButton>
  <MenuItems anchor="bottom end" className="bg-white shadow">
    <MenuItem>
      <a className="data-[focus]:bg-sky-100" href="/edit">编辑</a>
    </MenuItem>
    <MenuItem>
      <a className="data-[focus]:bg-sky-100" href="/dup">复制</a>
    </MenuItem>
  </MenuItems>
</Menu>;
```

</v-click>

::right::

<v-click>

**核心点**

- 子件 5 个：Menu / MenuButton / MenuItems / MenuItem / MenuSeparator
- `anchor` 一键定位
- `data-[focus]` 高亮项

**键盘**：ArrowUp/Down + Enter/Space + Esc + typeahead

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Menu 是 Headless UI 最常用的命令菜单组件 —— 等价 Radix DropdownMenu。

**子组件清单**：
- Menu（Root）
- MenuButton（触发按钮）
- MenuItems（菜单容器）
- MenuItem（单项）
- MenuSection / MenuHeading（v2 新增分组）
- MenuSeparator（分隔线）

**MenuItem 灵活性**：
- 默认渲染 div（不渲染 button）
- 内容自由放 a / button / 自定义元素
- 通过 `data-focus` 知道是否当前高亮
- 通过 `data-disabled` 知道是否禁用
- 渲染函数模式：`<MenuItem>{({ focus }) => ...}</MenuItem>`

**键盘交互**（WAI-ARIA Menu Button 模式）：
- Space/Enter on Button：打开 + 焦点首项
- ArrowDown：下一项
- ArrowUp：上一项
- Home：首项
- End：末项
- Esc：关闭 + 焦点回 Button
- Typeahead：连续键入字母，跳到首字母匹配项
- Tab：关闭并移焦点

**anchor prop**：
- 字符串：`"bottom start"` / `"bottom end"` / `"top end"` 等
- 对象：`{ to: "bottom start", gap: 8, padding: 16, offset: 4 }`
- 自动 collision detection

**data-* 属性（v2）**：
- data-open / data-closed 在 MenuItems 上
- data-focus / data-disabled 在 MenuItem 上
- data-hover / data-active 在 MenuButton 上

Tailwind 类直接写：
```tsx
<MenuItem className="data-[focus]:bg-sky-100 data-[disabled]:opacity-50">
```

[click] **重点**：
- 用 Menu 做「操作菜单」（保存/导出/删除/分享）
- 用 Listbox 做「单选/多选下拉」（form value）
- 用 Combobox 做「带搜索框的下拉」
- 用 Select 做「原生 select 包装」（v2 新增，最简单）

混淆是新手最常踩坑 —— role 不同（menu vs listbox），屏幕阅读器读不同。
-->

---
transition: fade-out
---

# Listbox — 自定义下拉选择

支持单选 / 多选 / 自定义 trigger + option

<v-click>

```tsx
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";

const cities = [{ id: 1, name: "北京" }, { id: 2, name: "上海" }, { id: 3, name: "广州" }];
const [selected, setSelected] = useState(cities[0]);

<Listbox value={selected} onChange={setSelected}>
  <ListboxButton className="border px-3 py-2">{selected.name}</ListboxButton>
  <ListboxOptions anchor="bottom" className="w-(--button-width) bg-white">
    {cities.map((city) => (
      <ListboxOption key={city.id} value={city}
        className="data-[focus]:bg-sky-100 data-[selected]:font-bold">
        {city.name}
      </ListboxOption>
    ))}
  </ListboxOptions>
</Listbox>
```

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Listbox 是「值选择」下拉 —— 跟 Menu 区别清晰：

| 维度 | Menu | Listbox |
| --- | --- | --- |
| 用途 | 命令菜单 | 表单选择 |
| role | menu | listbox |
| value | 不绑值 | value/onChange 绑值 |
| 多选 | 不支持 | 支持（multiple prop）|
| Item | MenuItem | ListboxOption |

**子组件**：
- Listbox（Root）
- ListboxButton（触发按钮）
- ListboxSelectedOption（v2 新增 / 单独显示选中项）
- ListboxOptions（容器）
- ListboxOption（选项）

**Props**：
- `value` / `onChange`：受控
- `defaultValue`：非受控
- `multiple`：多选模式（value 是数组）
- `disabled`：禁用整个 Listbox
- `name` / `form`：表单提交支持
- `by`：对象比较函数（默认引用相等）

**by prop 对象比较**：
```tsx
<Listbox value={selected} onChange={setSelected} by="id">
  {/* selected = { id: 1, name: "北京" } 也能正确匹配 options 中的对象 */}
</Listbox>
```

**多选**：
```tsx
const [selected, setSelected] = useState<City[]>([]);

<Listbox value={selected} onChange={setSelected} multiple>
  {/* value 是数组 */}
</Listbox>
```

**w-(--button-width)**：
- Tailwind v4 任意值语法
- Headless UI 自动暴露 `--button-width` CSS 变量
- 让 ListboxOptions 与 ListboxButton 同宽

**data-* 状态**：
- ListboxButton：data-open / data-active / data-hover / data-focus
- ListboxOption：data-focus / data-selected / data-disabled / data-active

**ListboxSelectedOption（v2 新增）**：
```tsx
<ListboxButton>
  <ListboxSelectedOption options={cities} />
</ListboxButton>
```
- 在 Button 内显示选中项（带渲染函数）
- 解决「Button 需要显示当前选中」的样板问题

[click] **vs Select（v2 新增）**：

```tsx
<Select name="city">
  <option value="bj">北京</option>
  <option value="sh">上海</option>
</Select>
```

- Select 实际是 `<select>` 元素包装
- 不能自定义 option 显示
- 不能 anchor 定位（浏览器原生下拉）
- 优点：极简、移动端原生体验、表单 SSR 友好

业务选择：
- 完全自定义 + 桌面优先 → Listbox
- 简单单选 + 移动友好 → Select
- 带搜索 → Combobox
-->

---
transition: fade-out
---

# Combobox — 带搜索框的下拉

业界最强的 Combobox 实现（含虚拟滚动）

<v-click>

```tsx
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/react";

const [query, setQuery] = useState("");
const filtered =
  query === ""
    ? people
    : people.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

<Combobox value={selected} onChange={setSelected} onClose={() => setQuery("")}>
  <ComboboxInput
    onChange={(e) => setQuery(e.target.value)}
    displayValue={(p: Person) => p?.name}
    className="border px-3 py-2"
  />
  <ComboboxOptions anchor="bottom" className="bg-white">
    {filtered.map((p) => (
      <ComboboxOption key={p.id} value={p} className="data-[focus]:bg-sky-100">
        {p.name}
      </ComboboxOption>
    ))}
  </ComboboxOptions>
</Combobox>
```

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Combobox 是 Headless UI 最复杂也是最强的组件 —— React UI 生态里业界标杆。

**子组件**：
- Combobox（Root）
- ComboboxInput（搜索输入框）
- ComboboxButton（可选，触发下拉按钮）
- ComboboxOptions（选项容器）
- ComboboxOption（单选项）
- ComboboxLabel（可选）

**Props**：
- `value` / `onChange`：受控
- `multiple`：多选
- `nullable`（v1） / `null` 默认（v2）：允许清空
- `by`：对象比较
- `immediate`：聚焦即打开（无需点击）
- `virtual={{ options }}`：虚拟滚动
- `onClose`：关闭时回调（常用于清 query）

**ComboboxInput props**：
- `onChange`：搜索回调
- `displayValue`：选中项在 Input 显示的文本（默认 String(value)）
- 接受所有原生 input props

**filter 在 React 层**：
- Headless UI 不内置 filter 逻辑
- 你用 query 自己 filter
- 给完全自由（fuzzy / partial / 远程）

**fuzzy search 推荐**：
- `fuse.js`：业界主流模糊搜索
- `match-sorter`：Kent C. Dodds 出品，TanStack 推荐
- 自己 `.filter` + `.includes`：简单场景

**虚拟滚动（v2 杀手锏）**：
```tsx
<Combobox value={value} onChange={setValue} virtual={{ options: filtered }}>
  <ComboboxOptions>
    {({ option }) => (
      <ComboboxOption value={option}>{option.name}</ComboboxOption>
    )}
  </ComboboxOptions>
</Combobox>
```

- 必须用 render function 而非 .map
- Headless UI 内部用 TanStack Virtual
- 10000+ 项完美流畅
- 键盘 / typeahead / 选中状态全保留

**vs Radix Select / cmdk**：

| 维度 | Headless UI Combobox | cmdk | Radix Select |
| --- | --- | --- | --- |
| 搜索 | ✅ 内置 | ✅ 内置 | ❌ 仅 typeahead |
| 虚拟滚动 | ✅ v2 内置 | ❌ 手动 | ❌ |
| Anchor | ✅ v2 内置 | ❌ 手动 | ❌ |
| 体积 | 中（多 floating-ui）| 小 | 小 |
| a11y | combobox role | combobox role | listbox role |

**Combobox 是 Headless UI 的「头牌组件」** —— shadcn / Catalyst 都用它作 SearchSelect 底层。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# Dialog — 模态对话框

焦点陷阱 + Portal + 滚动锁定 + transition prop

::left::

<v-click>

```tsx
<Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
  <DialogBackdrop transition
    className="fixed inset-0 bg-black/30 data-[closed]:opacity-0" />
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <DialogPanel transition
      className="max-w-lg bg-white p-6 data-[closed]:scale-95">
      <DialogTitle className="font-bold">确认删除</DialogTitle>
      <p>此操作不可撤销</p>
    </DialogPanel>
  </div>
</Dialog>;
```

</v-click>

::right::

<v-click>

**子组件**：Dialog / DialogBackdrop / DialogPanel / DialogTitle / Description / CloseButton

**Dialog 自动做**

- focus trap + 焦点恢复
- Esc 关闭 + 滚动锁定
- Portal 到 body
- ARIA role=dialog + aria-modal

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Dialog 是 Headless UI 最复杂的组件之一，自动处理大量 a11y 细节。

**子组件清单**：
- Dialog（Root）
- DialogBackdrop（遮罩层）
- DialogPanel（弹窗主体，焦点陷阱在这层）
- DialogTitle（标题，a11y 必需）
- Description（描述，建议但非必需）
- CloseButton（v2 新增，便利关闭按钮）

**Props**：
- `open` / `onClose`：受控（Headless UI 没有 defaultOpen，全受控）
- `static`：保留 DOM，自己控制显示
- `unmount`：默认 true，关闭后卸载 Panel

**Dialog 自动行为**：

1. **Focus trap**：
   - Tab / Shift+Tab 在 Panel 内循环
   - 自动焦点 Panel 内第一个可聚焦元素

2. **Focus restoration**：
   - 关闭后焦点回到打开前的元素
   - 即使 trigger 已卸载也安全

3. **Esc 关闭**：
   - 监听全局 keydown
   - 调用 onClose(false)

4. **Scroll lock**：
   - body 加 overflow:hidden
   - 防止背景滚动
   - 处理 iOS Safari 滚动穿透

5. **Click outside**：
   - 点击 DialogBackdrop 默认关闭
   - 或在 Panel 外的容器 div 点击

6. **Portal**：
   - 默认 portal 到 document.body
   - 避免 z-index 嵌套问题

7. **ARIA**：
   - role="dialog"
   - aria-modal="true"
   - aria-labelledby（自动连 DialogTitle）
   - aria-describedby（自动连 Description）

**transition prop（v2 杀手锏）**：
```tsx
<DialogBackdrop transition className="data-[closed]:opacity-0 transition" />
<DialogPanel transition className="data-[closed]:scale-95 data-[closed]:opacity-0 transition" />
```

- v1 时代用 `<Transition>` 包裹
- v2 直接 transition prop + data-closed
- Tailwind v4 + data-[] 选择器完美

**vs Popover**：
- Dialog：模态、焦点陷阱、滚动锁定
- Popover：非模态、可外部交互、不锁定滚动

**vs AlertDialog**：
- Headless UI 没有专门的 AlertDialog（用 Dialog + 自己写按钮即可）
- Radix 有专门的 AlertDialog（Action / Cancel 强意图）

业务建议：
- 严肃确认（删除/支付）→ Dialog + 自定义按钮 + Esc 默认不关
- 表单提交 → Dialog 默认
- 临时设置 → Popover
-->

---
transition: fade-out
---

# Disclosure / Popover

折叠区块 + 浮动面板（点击触发）

<v-click>

```tsx
// Disclosure（折叠区块，单个开关）
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";

<Disclosure>
  <DisclosureButton className="w-full text-left">是否包邮？</DisclosureButton>
  <DisclosurePanel transition className="data-[closed]:opacity-0">
    满 99 包邮
  </DisclosurePanel>
</Disclosure>;
```

</v-click>

<v-click>

```tsx
// Popover（浮动面板，点击触发，非模态）
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

<Popover>
  <PopoverButton>主题设置</PopoverButton>
  <PopoverPanel anchor="bottom" transition
    className="bg-white p-4 shadow data-[closed]:opacity-0 transition">
    <label><input type="radio" name="theme" /> 亮色</label>
    <label><input type="radio" name="theme" /> 暗色</label>
  </PopoverPanel>
</Popover>;
```

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Disclosure**：

- 单个 Toggle + Panel
- 不绑 value，纯切换
- 类似 Radix Collapsible
- 用法：FAQ / 折叠区块

子组件：
- Disclosure（Root，自带 open 状态）
- DisclosureButton（触发器）
- DisclosurePanel（可折叠面板）

Props：
- `defaultOpen`：默认展开
- 不支持完全受控（Headless UI 设计选择）

render function 模式：
```tsx
<Disclosure>
  {({ open }) => (
    <>
      <DisclosureButton>...</DisclosureButton>
      {open && <div>外部依赖 open</div>}
      <DisclosurePanel>...</DisclosurePanel>
    </>
  )}
</Disclosure>
```

**不是 Accordion**：
- Disclosure 是单个折叠
- 多个 Disclosure 串成「类 Accordion」效果（但不互斥）
- 想要 single 模式（只开一个）—— 用 Tab 或自己写 state

**关键差异 vs Radix Accordion**：
- Radix Accordion：内置 single/multiple/collapsible
- Headless UI Disclosure：不绑 value，简单折叠
- 完整 Accordion 需要自己组合 state

[click] **Popover**：

- 点击触发的浮动面板
- **非模态** —— 不锁定滚动，外部仍可交互
- 可放任何内容（表单 / 按钮 / 列表）

子组件：
- Popover（Root）
- PopoverButton（触发）
- PopoverPanel（面板）
- PopoverGroup（v2，统一管多个 Popover）
- PopoverBackdrop（可选半透明遮罩）

Anchor Positioning（v2）：
- `anchor="bottom"` / `"top end"` / `"right"` 等
- 对象形式：`anchor={{ to: "bottom", gap: 8 }}`
- 自动 collision detection

PopoverGroup 用法：
```tsx
<PopoverGroup>
  <Popover>
    <PopoverButton>A</PopoverButton>
    <PopoverPanel>...</PopoverPanel>
  </Popover>
  <Popover>
    <PopoverButton>B</PopoverButton>
    <PopoverPanel>...</PopoverPanel>
  </Popover>
</PopoverGroup>
```

- 同 Group 内 Popover 切换时无需关闭再打开
- 适合「Mega Menu」/「Top Nav」场景

**vs Dialog**：
- Popover 非模态 / 可外部交互 / 无焦点陷阱
- Dialog 模态 / 锁定滚动 / 焦点陷阱

**vs Tooltip**：
- Headless UI 没有 Tooltip 组件
- Tooltip 用 hover 触发 + 纯文字，要用 Radix Tooltip / Tippy.js / Floating UI 直接拉
- 这是 Headless UI 的明显缺口

**vs HoverCard**：
- Headless UI 也没有 HoverCard
- 同样要外部库

业务推荐：
- 点击 + 表单内容 → Popover
- 悬停 + 短文字 → Floating UI 自己组装
- 折叠区块 → Disclosure
- 严肃模态 → Dialog
-->

---
transient: fade-out
---

# Switch / RadioGroup / Checkbox

最常用的三个表单输入

<v-click>

```tsx
// Switch（开关）
<Switch checked={enabled} onChange={setEnabled}
  className="h-6 w-11 rounded-full bg-gray-200 data-[checked]:bg-sky-600">
  <span className="h-5 w-5 rounded-full bg-white data-[checked]:translate-x-5" />
</Switch>;
```

</v-click>

<v-click>

```tsx
// RadioGroup（卡片式单选）
<RadioGroup value={plan} onChange={setPlan}>
  {plans.map((p) => (
    <Radio key={p.id} value={p}
      className="border-2 p-4 data-[checked]:border-sky-600">{p.name}</Radio>
  ))}
</RadioGroup>;

// Checkbox（v2 新增，支持 indeterminate）
<Checkbox checked={agreed} onChange={setAgreed}
  className="size-4 border data-[checked]:bg-sky-600">
  <CheckIcon className="data-[checked]:block hidden" />
</Checkbox>;
```

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Switch**：

- 开关组件
- 等价 Radix Switch / native checkbox role=switch
- 一个 button + 内部 span（thumb）

Props：
- `checked` / `onChange`：受控
- `defaultChecked`：非受控
- `disabled`：禁用
- `name` / `form`：表单提交
- `value`：表单值（默认 "on"）

data-* 状态：
- `data-checked` / `data-unchecked`
- `data-disabled`
- `data-hover` / `data-focus` / `data-active`

a11y：
- role="switch"
- aria-checked="true/false"
- 键盘：Space 切换 / Tab 移焦

Switch 内部不渲染 input，提交表单时自动注入 hidden input。

**Switch.Group**（v1 兼容）/ Field 包装（v2 推荐）：
```tsx
<Field>
  <Switch checked={...} onChange={...}>...</Switch>
  <Label>启用通知</Label>
</Field>
```

[click] **RadioGroup**：

- 单选组（exclusive choice）
- 等价 Radix RadioGroup
- Card-style 单选最常用

子组件：
- RadioGroup（Root）
- Radio（单个选项）
- 配 Field + Label + Description 表单 ARIA

Props（RadioGroup）：
- `value` / `onChange` / `defaultValue`
- `name`：表单提交
- `disabled`：禁用整个 group
- `by`：对象比较

Props（Radio）：
- `value`：值
- `disabled`：单项禁用

data-* 状态：
- Radio：`data-checked` / `data-disabled` / `data-focus`

键盘：
- Arrow：在 Radio 间导航（roving tabindex）
- Tab：进入 group / 离开 group
- Space：选中当前

**vs 原生 input radio**：
- HUI RadioGroup 不渲染原生 input
- 你的 Radio 可以是 div / button / 自定义容器
- 表单提交时自动注入 hidden input
- 更灵活样式（卡片式单选）

[click] **Checkbox（v2 新增）**：

- v1 没有！要用原生 input + 自己 ARIA
- v2 终于有了

Props：
- `checked` / `onChange` / `defaultChecked`
- `indeterminate`：三态
- `disabled`
- `name` / `value` / `form`
- `invalid`：错误态（aria-invalid）

data-* 状态：
- `data-checked` / `data-unchecked` / `data-indeterminate`
- `data-disabled` / `data-hover` / `data-focus`

**indeterminate 三态**：
```tsx
<Checkbox
  checked={checked}
  indeterminate={!checked && partialChecked}
  onChange={setChecked}
>
```

主复选框场景常用（半选父 / 全选父 / 不选父）。

a11y：
- role="checkbox"
- aria-checked="true/false/mixed"
- 键盘 Space 切换

**配 Field**：
```tsx
<Field>
  <Checkbox checked={...} onChange={...}>...</Checkbox>
  <Label>同意条款</Label>
  <Description>阅读完整服务条款</Description>
</Field>
```
- 自动 aria-labelledby / aria-describedby

业务建议：
- Tailwind UI / Catalyst 的 Checkbox 都用 Headless UI v2 实现
- 自定义形状（圆形 / 方形 / 卡片）任意发挥
- 不要用 indeterminate 误导用户（要明确「mixed 状态」UX 含义）
-->

---
transition: fade-out
---

# Tabs — 标签页

TabGroup / TabList / Tab / TabPanels / TabPanel

<v-click>

```tsx
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";

<TabGroup>
  <TabList className="flex border-b">
    <Tab className="px-4 py-2 data-[selected]:border-b-2 data-[selected]:border-sky-600">
      资料
    </Tab>
    <Tab className="px-4 py-2 data-[selected]:border-b-2 data-[selected]:border-sky-600">
      设置
    </Tab>
    <Tab className="px-4 py-2 data-[selected]:border-b-2 data-[selected]:border-sky-600">
      账单
    </Tab>
  </TabList>
  <TabPanels>
    <TabPanel>资料内容</TabPanel>
    <TabPanel>设置内容</TabPanel>
    <TabPanel>账单内容</TabPanel>
  </TabPanels>
</TabGroup>;
```

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Tabs 是 Headless UI 经典组件 —— 比 Radix Tabs API 略不同：

**子组件清单**：
- TabGroup（Root，状态容器）
- TabList（标签按钮容器，含 roving tabindex）
- Tab（单个标签按钮）
- TabPanels（内容容器）
- TabPanel（单个内容面板）

**TabGroup props**：
- `defaultIndex`：默认显示第几个 tab（0-indexed）
- `selectedIndex`：受控
- `onChange(index)`：切换回调
- `vertical`：垂直方向
- `manual`：手动激活（focus 后必须 Enter）vs 默认 automatic（focus 即激活）

**索引 vs Value**：
- HUI Tabs 用 **index**（0/1/2/3）
- Radix Tabs 用 **value**（字符串）
- HUI 更简单但缺乏「持久化」（URL 同步要自己映射）

**键盘**（WAI-ARIA Tab 模式）：
- Tab 进入 List → 进入 Panel
- ArrowLeft/Right（horizontal）/ ArrowUp/Down（vertical）：切换 Tab
- Home / End：跳首尾
- Enter / Space（manual 模式）：激活

**data-* 状态**：
- Tab：`data-selected` / `data-hover` / `data-focus` / `data-disabled`
- TabPanel：自动 display:none 非激活 panel

**Tab disabled**：
```tsx
<Tab disabled className="data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed">
  待开放
</Tab>
```
- 自动跳过 disabled tab

**render function**：
```tsx
<Tab>
  {({ selected }) => (
    <span className={selected ? "font-bold" : ""}>资料</span>
  )}
</Tab>
```

**业务集成**：
- URL 同步：用 useSearchParams + onChange 映射 index ↔ slug
- Lazy mount：默认所有 Panel 渲染，要 lazy 自己加 `{selected && ...}`
- 嵌套 Tabs：完全可以，多 TabGroup 独立 state

**vs Radix Tabs**：
- HUI 用 index（更简单）
- Radix 用 value（更灵活，便于 URL 同步）
- HUI 默认 lazy 渲染时所有 Panel 都挂载（display 控制）
- Radix 默认 unmount 非激活 Panel（要 forceMount 保留）

业务体验：
- 简单切换 → HUI Tabs
- URL 同步 / 复杂受控 → Radix Tabs
-->

---
transition: fade-out
---

# Field / Fieldset — 表单 ARIA 革命

v2 杀手锏，告别手动 aria-labelledby

<v-click>

```tsx
import { Field, Label, Description, Input, ErrorMessage } from "@headlessui/react"

<Field>
  <Label>邮箱地址</Label>
  <Input name="email" type="email" invalid={!!error} />
  <Description>我们不会泄露你的邮箱</Description>
  {error && <ErrorMessage>{error}</ErrorMessage>}
</Field>
```

</v-click>

<v-click>

```tsx
// Fieldset disabled 自动级联所有 Field
<Fieldset disabled={isSubmitting}>
  <Legend>个人信息</Legend>
  <Field><Label>姓名</Label><Input name="name" /></Field>
  <Field><Label>邮箱</Label><Input name="email" /></Field>
</Fieldset>
```

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Field 是 v2 最重要的新增 —— 把表单 ARIA 痛点一次性解决。

Field 自动做的事：
1. ID 自动生成（Field 内部 useId 生成唯一 id，Label/Input/Description/ErrorMessage 共享 id 前缀）
2. Label 自动 htmlFor（指向 Input id）
3. Input aria-labelledby（自动指向 Label id）
4. Input aria-describedby（指向 Description；invalid 时含 ErrorMessage）
5. invalid prop 自动设 aria-invalid

生成的 DOM 完美 a11y，零手动 ID。

Fieldset 的作用：包多个 Field；disabled 级联（Fieldset disabled 时所有内部 Input/Select/Checkbox 等自动 disabled）；适合提交中禁用整个表单；视觉上常配 Legend。

实际业务示例：用 react-hook-form 的 register + Fieldset 包 Field 列表，每个 Field 含 Label + Input + ErrorMessage，最后 submit Button。

v1 / Vue v1 没有 Field —— 必须手动写 id 和 htmlFor / 手动 aria-describedby；容易漏写或写错。

v2 后的最佳实践：所有表单字段用 Field 包；错误用 ErrorMessage；Fieldset 控制 submit 状态；配 react-hook-form / zod 不变。

Tailwind UI / Catalyst 全部用 Field 模式，这是 Tailwind Labs 的官方推荐表单写法。

业务收益：表单 ARIA bug 减少 70%；代码可读性提升；设计 review 时三层结构清晰。
-->

---
transition: fade-out
---

# Anchor Positioning（v2 杀手锏 1）

内置 floating-ui，浮层定位一键启用

<v-click>

```tsx
// 字符串模式 + 对象模式
<PopoverPanel anchor="bottom end">面板</PopoverPanel>
<PopoverPanel anchor={{ to: "bottom start", gap: 8, padding: 16, offset: 4 }}>面板</PopoverPanel>
```

</v-click>

<v-click>

**anchor.to 取值**：`top` / `bottom` / `left` / `right` + 可选 `start` / `center` / `end`

**支持组件**：PopoverPanel / MenuItems / ListboxOptions / ComboboxOptions

</v-click>

<v-click>

```tsx
// Anchor 自动暴露 CSS 变量（--button-width）给 Panel 实现同宽下拉
<ListboxOptions anchor="bottom" className="w-[var(--button-width)]">...</ListboxOptions>
```

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Anchor Positioning 是 v2 最重磅特性**：

v1 时代浮层定位是 Headless UI 最大的痛点：
- HUI 不提供任何定位
- 你要自己拉 `@floating-ui/react`
- 写一堆 useFloating / useInteractions / FloatingPortal
- 写 200 行才搞定一个浮层

v2 直接内置 floating-ui：
```tsx
<PopoverPanel anchor="bottom end">
```

一个 prop 搞定。

**字符串 anchor**：
- `"top"` / `"bottom"` / `"left"` / `"right"`：四方向（中心对齐）
- `"top start"` / `"top end"`：从主轴起点 / 终点出发
- `"bottom start"`：bottom + 左对齐
- `"top end"`：top + 右对齐
- `"left start"` / `"right end"`：侧边变体

**对象 anchor**：
```tsx
anchor={{
  to: "bottom start",       // 方向
  gap: 8,                   // 主轴距离（panel ↔ button）
  padding: 16,              // 离视口边缘最小距离
  offset: 4,                // 副轴偏移
}}
```

**默认行为**：
- 自动 collision detection（撞墙翻转）
- 自动 fit container（不超视口）
- 自动 follow（trigger 移动 / 滚动时跟随）

[click] **anchor.to 9 个值**：

完整对应 `<placement> <alignment>` 模式：
- bottom / top / left / right
- + start / center / end（或省略 = center）

[click] **支持组件**：

启用 anchor 的组件：
- PopoverPanel
- MenuItems
- ListboxOptions
- ComboboxOptions
- DialogPanel（部分）

Tooltip / HoverCard / ContextMenu —— Headless UI 没有这些组件，要用第三方。

[click] **CSS 变量暴露**：

启用 anchor 后，Panel 自动有 CSS 变量：
- `--button-width`：trigger 宽度
- `--button-height`
- `--input-width`（Combobox 用）

Tailwind 任意值：
```tsx
<ListboxOptions
  anchor="bottom"
  className="w-(--button-width)"
>
```

或老语法：
```tsx
className="w-[var(--button-width)]"
```

这是「Listbox/Combobox 下拉与 Button 同宽」的标准做法。

**vs Radix Popper**：
- Radix 用 `side` / `align` / `sideOffset` / `alignOffset` 四个 props
- HUI v2 用一个 `anchor` 字符串/对象
- HUI 更紧凑，Radix 更细粒度

**vs floating-ui 直接拉**：
- HUI v2 接管 useFloating
- 你不需要再写 `useFloating()` / `useInteractions()`
- 但仍可以用 `useFloating` 自己定位 trigger（如 Tooltip）

**自定义 floating-ui 行为**：
- v2 没暴露底层 middleware 配置
- 想用 `flip` / `shift` / `arrow` middleware 还得直接拉 floating-ui
- 大多数业务场景不需要

业务收益：
- 浮层组件代码减少 80%
- 不再纠结 absolute / fixed / z-index
- 不需要懂 floating-ui 内部
-->

---
transition: fade-out
---

# transition prop + data-closed（v2 杀手锏 2）

替代 Transition 组件，data-\* CSS 动画

<v-click>

```tsx
// v1 时代（仍兼容）：Transition 组件 —— 多包一层 DOM，6 个 props
<Transition show={isOpen}
  enter="transition duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100"
  leave="transition duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
  <DialogPanel>...</DialogPanel>
</Transition>;
```

</v-click>

<v-click>

```tsx
// v2 推荐：transition prop + data-closed —— DOM 扁平 + CSS 动画
<DialogPanel transition
  className="transition duration-200 data-[closed]:opacity-0 data-[closed]:scale-95">...</DialogPanel>;

// Tailwind v4 简写
<DialogPanel transition className="transition data-closed:opacity-0">...</DialogPanel>;
```

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **transition prop + data-* 是 v2 的「DOM 扁平化」革命**：

**v1 Transition 组件痛点**：
- 包裹一层额外 DOM
- enter / enterFrom / enterTo / leave / leaveFrom / leaveTo 六个 props
- afterEnter / beforeLeave 等回调
- show prop 控制显隐
- 嵌套 Transition.Child 复杂

**v2 transition prop 解法**：
- 组件本身有 transition prop
- 渲染时切换 `data-closed` / `data-open` / `data-enter` / `data-leave` 属性
- CSS 监听 data 变化做 transition
- DOM 树不增层

[click] **支持 transition prop 的组件**：
- DialogPanel / DialogBackdrop
- MenuItems
- ListboxOptions
- ComboboxOptions
- PopoverPanel
- DisclosurePanel
- TabPanel

**data-* 状态属性**：
- `data-open`：组件展开状态
- `data-closed`：组件关闭状态（动画起点 / 终点）
- `data-enter`：正在 enter 动画
- `data-leave`：正在 leave 动画

**Tailwind v4 完美适配**：
```tsx
<DialogPanel
  transition
  className="
    transition duration-200 ease-out
    data-[closed]:opacity-0 data-[closed]:scale-95
    data-[enter]:duration-300
    data-[leave]:duration-150
  "
>
```

Tailwind v4 简写：
```tsx
className="transition data-closed:opacity-0"
```

**transition prop 完整 API**：
```tsx
<DialogPanel
  transition
  enter="duration-200 ease-out"
  enterFrom="opacity-0 scale-95"
  enterTo="opacity-100 scale-100"
  leave="duration-150 ease-in"
  leaveFrom="opacity-100"
  leaveTo="opacity-0"
>
```
- 仍支持老 prop 模式
- 但推荐用 data-* CSS

**与 framer-motion 配合**：
- Headless UI transition 是 CSS 动画
- 想要 spring / 复杂关键帧 → framer-motion
- 配合方式：`as={motion.div}` 把 Panel 替换为 motion 元素

**enterFrom/leaveTo 何时不需要写**：
- 默认行为：data-closed 时 opacity-0 + 当前 transform 不变
- 你只需要写差异 className
- Headless UI 处理 enter/leave 的 timing

**SSR 注意**：
- 服务端渲染时初始是 data-closed
- 客户端 hydrate 时不闪烁（data 属性 SSR 同步）

业务收益：
- DOM 减少一层 Transition
- CSS 动画与 Tailwind 一致写法
- enter / leave 共享 transition class
- 不需要回调（用 CSS transitionend）
-->

---
transition: fade-out
---

# Combobox 虚拟滚动（v2 杀手锏 3）

内置 TanStack Virtual，10K+ 项性能完美

<v-click>

```tsx
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/react";

const filtered = query === ""
  ? allPeople
  : allPeople.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

// 关键：virtual prop + render function（不是 .map）
<Combobox value={selected} onChange={setSelected} virtual={{ options: filtered }}>
  <ComboboxInput onChange={(e) => setQuery(e.target.value)} />
  <ComboboxOptions anchor="bottom" className="w-(--input-width) max-h-60 bg-white">
    {({ option }: { option: Person }) => (
      <ComboboxOption value={option} className="data-[focus]:bg-sky-100">
        {option.name}
      </ComboboxOption>
    )}
  </ComboboxOptions>
</Combobox>;
```

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **虚拟滚动是 Combobox 的「工业级解决方案」**：

**问题**：
- Combobox 1000+ 项时 DOM 卡顿
- 10000+ 项几乎不能用
- 初始渲染慢、滚动卡、内存占用大

**传统解法**：
- `react-window` / `react-virtual` 手动集成
- 但 ComboboxOption 是 HUI 内部组件，难以包裹
- 键盘导航 / typeahead / 选中状态都要重写

**Headless UI v2 内置**：

```tsx
<Combobox virtual={{ options: filtered }}>
  <ComboboxOptions>
    {({ option }) => <ComboboxOption value={option}>{option.name}</ComboboxOption>}
  </ComboboxOptions>
</Combobox>
```

启用条件：
- `virtual` prop 传入 `{ options: 数组 }`
- ComboboxOptions children 必须是 render function（不能 .map）
- HUI 内部用 TanStack Virtual 渲染

**性能对比**：
- 1000 项普通模式：~300ms 渲染
- 1000 项 virtual：~50ms 渲染
- 10000 项普通：~3s + 滚动卡顿
- 10000 项 virtual：~80ms + 60fps 滚动

**virtual prop 完整 API**：
```tsx
virtual={{
  options: filteredList,
  disabled: (item) => item.isDisabled,  // 单项禁用
}}
```

**键盘 / typeahead 自动适配**：
- HUI 内部计算可视范围
- 键盘 ArrowDown 到不可见项时自动 scroll
- typeahead 字母搜索到不可见项时自动 scroll

**与 Radix Select 对比**：
- Radix Select：ScrollUpButton / ScrollDownButton，但 DOM 全渲染
- HUI Combobox virtual：真正虚拟（只渲染可视）
- HUI 性能显著优势

**与 cmdk 对比**：
- cmdk 默认不虚拟
- 需要自己 hack `useCommandLoop` + react-virtual
- HUI 一行代码搞定

**业务实例**：
- 选用户（公司 5000+ 员工）→ HUI virtual Combobox
- 选商品（10000+ SKU）→ HUI virtual Combobox
- 选地址（中国 600+ 城市）→ HUI 普通 Combobox 即可

**注意事项**：
- ComboboxOptions 必须 render function（不能 .map）
- options 数组每次 filter 后传新引用（HUI 内部 React.memo）
- 大数据时 filter 用 useMemo

**Vue v1 没有虚拟滚动** —— 这是 Vue 用户的明显短板。
-->

---
transition: fade-out
---

# Field 表单 ARIA 自动（v2 杀手锏 4）

告别手动 aria-labelledby / aria-describedby

<v-click>

```tsx
// v1 / Vue v1 手动：5 个 ARIA 属性都得自己管，容易写错
<label htmlFor="email">邮箱</label>
<input id="email" aria-labelledby="email-label" aria-describedby="email-desc" aria-invalid />

// v2 Field：自动注入所有 ARIA
<Field><Label>邮箱</Label><Input invalid={!!error} /><Description>必填</Description></Field>
```

</v-click>

<v-click>

| ARIA 属性                              | v1 手写 | **v2 Field** |
| -------------------------------------- | ------- | ------------ |
| `id` / `htmlFor` / `aria-labelledby`   | 手写    | 自动         |
| `aria-describedby` / ErrorMessage 关联 | 手写    | 自动         |
| `aria-invalid`                         | 手写    | invalid prop |

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Field 是「表单 ARIA 标准化」的最重要进步**：

**v1 / Vue v1 手写 ARIA 痛点**：

1. **ID 不唯一**：
   - 同一页面多个表单时 id="email" 重复
   - 要写 `id="form1-email"` 模式
   - 手动管 id 容易冲突

2. **aria-labelledby 漏写**：
   - label htmlFor 写了 input id 没写
   - 屏幕阅读器读不到 label

3. **aria-describedby 漏写**：
   - description / help text 没关联
   - 屏幕阅读器不读说明

4. **aria-invalid 不更新**：
   - 校验失败时忘记设
   - 屏幕阅读器不读错误

5. **ErrorMessage 关联**：
   - aria-errormessage vs aria-describedby？规范乱
   - 实际两个都要兼容

[click] **Field 自动解决**：

```tsx
<Field>
  <Label>邮箱</Label>
  <Input name="email" invalid={!!error} />
  <Description>必填</Description>
  {error && <ErrorMessage>{error}</ErrorMessage>}
</Field>
```

实际 DOM：
```html
<div>
  <label id="hl-label-:r0:" for="hl-input-:r1:">邮箱</label>
  <input
    id="hl-input-:r1:"
    aria-labelledby="hl-label-:r0:"
    aria-describedby="hl-description-:r2: hl-error-:r3:"
    aria-invalid="true"
  />
  <p id="hl-description-:r2:">必填</p>
  <p id="hl-error-:r3:">邮箱格式错误</p>
</div>
```

完美无瑕。

[click] **5 项自动**：

1. id 自动（useId 生成）
2. label htmlFor 自动
3. input aria-labelledby 自动
4. input aria-describedby 自动（Description + ErrorMessage 合并）
5. invalid prop → aria-invalid 自动

**Field 还做的其他事**：
- 接管所有 HUI 输入子组件（Input / Textarea / Select / Combobox / Listbox / Switch / Checkbox / RadioGroup）
- 也支持原生 input（要手动给 className）
- 提供 useFieldContext hook 让自定义组件接入

**业务体验**：
- 团队 a11y 培训成本降低
- code review 不用纠结 ARIA 细节
- 错误率显著下降
- Lighthouse a11y 满分变常态

**Vue v1 / 其他库参考**：
- Vue v1 仍要手写所有 ARIA
- Radix UI 没有 Field（要手动 + 用 Label 组件）
- shadcn 用 react-hook-form FormField + Radix Label，比 HUI Field 啰嗦

Headless UI v2 的 Field 是「表单 ARIA」的当前最佳实践。
-->

---
transition: fade-out
---

# render props vs data-\* 双模式

v2 同时支持两种状态访问方式

<v-click>

```tsx
// 模式 1：render props（函数子节点，访问状态）
<MenuItem>
  {({ focus, disabled }) => (
    <a className={`px-4 py-2 ${focus ? "bg-sky-100" : ""} ${disabled ? "opacity-50" : ""}`}>编辑</a>
  )}
</MenuItem>
```

</v-click>

<v-click>

```tsx
// 模式 2：data-* 属性（Tailwind 直接选择）
<MenuItem>
  <a className="px-4 py-2 data-[focus]:bg-sky-100 data-[disabled]:opacity-50">编辑</a>
</MenuItem>
```

</v-click>

<v-click>

> v2 推荐 **data-\* 模式** —— DOM 更扁、Tailwind 写法一致、不需要 render function 嵌套。

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **两种状态访问方式 —— v2 同时支持，但推荐 data-* 模式**：

**render props 模式（v1 经典）**：

```tsx
<MenuItem>
  {({ focus, disabled, close }) => (
    <a className={focus ? "active" : ""}>
      {focus && <Icon />}
      编辑
    </a>
  )}
</MenuItem>
```

优势：
- 可以在 JSX 里条件渲染（`{focus && <Icon />}`）
- 可以传递 close 等控制 API（在 Menu 内部关闭菜单）
- 跨样式方案通用（CSS-in-JS / styled-components / module 都能用）

劣势：
- 多一层 function 嵌套
- TypeScript 类型推导稍麻烦
- 不容易快速扫
- Tailwind 类要拼接（className={\`base ${focus ? "active" : ""}\`}）

[click] **data-\* 模式（v2 主推）**：

```tsx
<MenuItem>
  <a className="data-[focus]:bg-sky-100 data-[disabled]:opacity-50">
    编辑
  </a>
</MenuItem>
```

优势：
- DOM 树更扁（无 function 包装）
- Tailwind 类直接写 `data-[focus]:` 选择器
- CSS 模块化（不需要在 JS 里拼字符串）
- Tailwind v4 简化语法 `data-focus:`
- TypeScript 类型零摩擦

劣势：
- 不能在 JSX 里条件渲染
- 不能拿到 close 等控制 API
- CSS 选择器写法（习惯 prop-styled 的人需要适应）

[click] **何时用哪种**：

| 场景                   | 推荐                       |
| ---------------------- | -------------------------- |
| 纯样式切换             | **data-\***（v2 推荐）     |
| Tailwind 工作流        | **data-\***                |
| 条件渲染图标 / 文本    | render props               |
| 需要 close / open 控制 | render props               |
| 团队对 CSS 熟悉        | **data-\***                |
| 团队对 JS 熟悉         | render props 也 OK         |

**data-* 完整列表**：

通用：
- `data-open` / `data-closed`
- `data-focus` / `data-hover` / `data-active`
- `data-disabled`

特定组件：
- MenuItem / ComboboxOption / ListboxOption：`data-focus` / `data-selected` / `data-disabled`
- Tab：`data-selected`
- Switch / Checkbox：`data-checked` / `data-unchecked` / `data-indeterminate`
- Radio：`data-checked`
- DialogPanel / 浮层 Panel：`data-open` / `data-closed` / `data-enter` / `data-leave`

**Tailwind v4 简写**：
- `data-focus:bg-sky-100`（v4）
- `data-[focus]:bg-sky-100`（v3）

业务建议：
- 新项目用 data-* 模式
- 老项目（v1 升 v2）保留 render props 也 OK，慢慢迁
- 文档示例 90% 用 data-* —— 这是 Tailwind Labs 的官方推荐
-->

---
transition: fade-out
---

# as prop / Polymorphic 模式

把组件能力转嫁到任意元素

<v-click>

```tsx
// 默认 Tab 渲染 button
<Tab>资料</Tab>                                  // → <button>资料</button>

// 用 as 改为 a 标签
<Tab as="a" href="/profile">资料</Tab>           // → <a href="/profile">资料</a>

// 用 as Fragment 不渲染包装（等价 Radix asChild）
<Tab as={Fragment}>
  <a href="/profile" className="custom">资料</a> // → 直接渲染你的 <a>
</Tab>
```

</v-click>

<v-click>

```tsx
// 用自定义组件 + 与 Next Link 配合
<MenuButton as={CustomButton} variant="primary">Options</MenuButton>

<MenuItem>
  <Link href="/settings" className="data-[focus]:bg-sky-100">设置</Link>
</MenuItem>;
```

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **as prop 是 Headless UI 的 Polymorphic 模式 —— 等价 Radix asChild**：

**默认行为**：
每个 HUI 组件有默认渲染元素：
- MenuButton → button
- MenuItem → div（不是 button！）
- ListboxButton → button
- ComboboxInput → input
- DialogPanel → div
- Tab → button

[click] **as 改默认元素**：

```tsx
// 改 HTML 标签
<MenuButton as="div">不是 button 了</MenuButton>
<Tab as="a" href="/page">Tab as anchor</Tab>

// 用自定义组件
<MenuButton as={MyCustomButton}>...</MenuButton>

// 用 Fragment（不渲染额外元素，把 props 转嫁到子元素）
<MenuButton as={Fragment}>
  <button className="custom-class">直接传给我</button>
</MenuButton>
```

**as={Fragment} 等价 Radix asChild**：
- Headless UI 不渲染默认 button
- 把所有 props (onClick / aria-* / ref) 转嫁到 children
- children 必须是单个 React element
- 适合「我已经有自己的 Button 组件，想要 HUI 行为」

**vs Radix asChild**：

```tsx
// Radix
<Dialog.Trigger asChild>
  <MyButton>打开</MyButton>
</Dialog.Trigger>

// Headless UI
<MenuButton as={Fragment}>
  <MyButton>打开</MyButton>
</MenuButton>
```

语义相同，写法不同。

[click] **with Next.js Link**：

```tsx
import Link from "next/link";

<MenuItem>
  <Link href="/settings" className="block data-[focus]:bg-sky-100">
    设置
  </Link>
</MenuItem>
```

注意：
- MenuItem 默认渲染 div，里面放 Link 即可
- 不用 as={Link}（Link 不传 ref 给 a 标签，HUI 焦点管理会失败）
- 直接子元素 Link 是最佳做法

**v2.2+ 更智能**：
- HUI 自动检测 children 是否是单个 React element
- 自动把 ref + ARIA props 转嫁到子元素
- 减少 as={Fragment} 的需要

[click] **TypeScript 类型**：

```tsx
type AsProp<C extends React.ElementType> = { as?: C };

<Tab<typeof Link> as={Link} href="/page">  // 类型完整
```

HUI 用 Polymorphic 类型让 TS 推导出 as 元素的 props。

**业务示例**：

```tsx
// 在 Listbox 里用 Next Link 作为选项
<ListboxOption value={item}>
  <Link href={item.url} className="block data-[focus]:bg-sky-100">
    {item.name}
  </Link>
</ListboxOption>
```

```tsx
// 用 MUI Button 作为 MenuButton
<MenuButton as={Button} variant="contained">
  Options
</MenuButton>
```

```tsx
// 用 Form Submit Button 作为 MenuItem（不推荐 a11y 上不规范）
<MenuItem>
  {({ close }) => (
    <button onClick={() => { save(); close(); }} className="...">
      保存并关闭
    </button>
  )}
</MenuItem>
```

业务建议：
- 大多数场景不需要 as prop —— HUI 默认元素够用
- 需要 Link / 自定义组件时用 as={Fragment} 或直接子元素
- 不要用 as 改变语义元素（Tab 改成 div 会破坏 a11y）
-->

---
transition: fade-out
---

# SSR / Next.js / Vite 集成

服务端渲染零配置

<v-click>

```bash
# Next.js / Vite / Remix 通用
pnpm add @headlessui/react
```

</v-click>

<v-click>

```tsx
// Next.js App Router 必须加 "use client"（HUI 用了 useState/useId）
"use client";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

// Vite + React 零配置
import { Listbox } from "@headlessui/react";
```

</v-click>

<v-click>

```vue
<!-- Vue（v1，组合式 API） -->
<script setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
</script>
```

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **安装**：

```bash
# React
pnpm add @headlessui/react

# Vue
pnpm add @headlessui/vue

# Heroicons 配套
pnpm add @heroicons/react
```

包体积（React v2）：
- @headlessui/react：核心 ~30KB minzipped
- 含 floating-ui 部分 ~15KB
- tree-shakable，按需引入

[click] **Next.js 集成**：

App Router：
```tsx
// app/page.tsx
"use client";
import { Menu } from "@headlessui/react";
```

- HUI 用了 useState / useId / useRef 等 client hooks
- 必须加 `"use client"`
- 也可以放进 client component 子树

Pages Router：
- 直接 import，无需 "use client"
- 默认 client + SSR 同时支持

SSR 注意：
- HUI 初始渲染时 menu/listbox/combobox 默认 closed
- 不会有「服务端渲染显示 menu，客户端隐藏」的闪烁
- Dialog 默认 unmount Panel，SSR 时不渲染 Panel

**Hydration**：
- HUI v2 用 useId（React 18+）
- 服务端 / 客户端 id 一致
- 不会有 hydration mismatch

[click] **Vite 集成**：

```tsx
// Vite + React 项目
import { Menu } from "@headlessui/react";

// vite.config.ts 不需要特殊配置
```

零配置，开箱即用。

**Tailwind CSS v4 配合**：

```css
/* app.css */
@import "tailwindcss";

/* Headless UI data-* 选择器 v4 默认支持 */
```

```tsx
<MenuItem>
  <a className="data-focus:bg-sky-100">编辑</a>  {/* v4 简写 */}
</MenuItem>
```

Tailwind v4 支持 `data-焦点:` 简写（不用 `data-[focus]:`）。

[click] **Vue 集成（v1）**：

```vue
<script setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
import { ref } from "vue";

const selected = ref(null);
const options = [...];
</script>

<template>
  <Listbox v-model="selected">
    <ListboxButton>...</ListboxButton>
    <ListboxOptions>
      <ListboxOption v-for="opt in options" :key="opt.id" :value="opt" v-slot="{ active, selected }">
        <div :class="active ? 'bg-sky-100' : ''">{{ opt.name }}</div>
      </ListboxOption>
    </ListboxOptions>
  </Listbox>
</template>
```

Vue API 差异：
- v-model 而非 value/onChange
- v-slot="{ active, selected }"（不是 render function）
- 无 data-* 属性（v1 没引入）
- 无 anchor prop（v1 没引入）

**Nuxt 集成**：
- @headlessui/vue 包通用
- 默认 SSR 安全
- Nuxt 3 / 4 都支持

**SvelteKit / Solid**：
- 官方无 Svelte / Solid 版本
- 社区有非官方移植（`@rgossiaux/svelte-headlessui` 等）
- 完整度不及官方

**与 Astro 配合**：
- Astro Islands 模式下当 React/Vue 组件用
- `client:load` / `client:visible` 指令包装
- SSR 静态片段不会出问题（HUI 默认 closed 状态 SSR 安全）

业务推荐：
- React 主线 → @headlessui/react v2
- Vue 主线 → @headlessui/vue v1 或 Radix Vue
- 其他框架 → 用 Ark UI（跨框架）
-->

---
transition: fade-out
---

# v1 → v2 迁移

主要 API 变化与升级路径（React）

<v-click>

| 变化              | v1                       | **v2**                       |
| ----------------- | ------------------------ | ---------------------------- |
| 命名空间 / 焦点项 | `Menu.Button` / `active` | `MenuButton` / `focus`       |
| 状态访问          | render props 主导        | data-\* 主导                 |
| Transition        | `<Transition>` 组件      | transition prop              |
| 浮层定位          | 自己拉 floating-ui       | 内置 anchor prop             |
| 新组件            | -                        | Checkbox / Input / Field 等  |

</v-click>

<v-click>

```tsx
// v1：render props + active                  // v2：data-* 属性 + focus
<Menu.Button>{({ open }) => <span>{open ? "▲" : "▼"}</span>}</Menu.Button>
<MenuButton><span className="data-[open]:rotate-180">▼</span></MenuButton>
```

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **v1 → v2 主要 Breaking Changes（React）**：

**1. 命名空间打平**：
- v1：`Menu.Button` / `Menu.Items` / `Menu.Item`
- v2：`MenuButton` / `MenuItems` / `MenuItem`（独立 import）

```tsx
// v1
import { Menu } from "@headlessui/react";
<Menu>
  <Menu.Button>...</Menu.Button>
  <Menu.Items>
    <Menu.Item>...</Menu.Item>
  </Menu.Items>
</Menu>;

// v2
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
<Menu>
  <MenuButton>...</MenuButton>
  <MenuItems>
    <MenuItem>...</MenuItem>
  </MenuItems>
</Menu>;
```

兼容：v2 仍然 export `Menu.Button` 等（命名空间式）—— 但 tree-shake 不友好，官方文档全用打平形式。

**2. focus 替代 active**：
- v1 menu item 状态用 `active`（鼠标 / 键盘焦点）
- v2 改为 `focus`（语义更清晰，与 data-focus 对应）

```tsx
// v1
<Menu.Item>
  {({ active }) => <a className={active ? "..." : ""}>...</a>}
</Menu.Item>

// v2
<MenuItem>
  {({ focus }) => <a className={focus ? "..." : ""}>...</a>}
</MenuItem>
// 或 data-*
<MenuItem>
  <a className="data-[focus]:bg-sky-100">...</a>
</MenuItem>
```

**3. Transition 模式**：
- v1：必须用 `<Transition>` 包裹
- v2：transition prop 在组件本身

```tsx
// v1
<Transition show={isOpen} enter="..." enterFrom="..." enterTo="...">
  <Dialog.Panel>...</Dialog.Panel>
</Transition>

// v2
<DialogPanel transition className="data-[closed]:opacity-0 transition">
  ...
</DialogPanel>
```

老 Transition 组件仍支持（迁移期可用），但推荐 v2 新模式。

**4. Anchor Positioning**：
- v1：自己拉 floating-ui
- v2：anchor prop 一键启用

```tsx
// v1 + 自己写 floating-ui
const { refs, floatingStyles } = useFloating({ placement: "bottom" });
<Menu.Button ref={refs.setReference}>...</Menu.Button>
<Menu.Items ref={refs.setFloating} style={floatingStyles}>...</Menu.Items>

// v2
<MenuButton>...</MenuButton>
<MenuItems anchor="bottom">...</MenuItems>
```

**5. nullable 默认**：
- v1：Listbox / Combobox 需要 `nullable` 才能 value=null
- v2：默认支持 null

```tsx
// v1
<Combobox value={value} onChange={setValue} nullable>...</Combobox>

// v2
<Combobox value={value} onChange={setValue}>...</Combobox>
// value 可以是 null
```

**6. 新组件全部 v2**：
- Checkbox / Input / Textarea / Select / Field / Fieldset / Label / Description / ErrorMessage
- v1 没有这些 —— 升级才能用

[click] **迁移路径**：

1. **升包**：`pnpm add @headlessui/react@latest`
2. **批量改 import**：`Menu.Button` → `MenuButton`（IDE 全文替换）
3. **改 active → focus**：`{({ active })}` → `{({ focus })}`
4. **逐步改 Transition**：保留 Transition 也行，新组件用 transition prop
5. **接入 Field**：表单逐步用 Field 包
6. **测试 a11y**：用 Lighthouse / Axe 验证

**自动化迁移**：
- 官方没有 codemod
- 可以用 jscodeshift 自己写
- 或手动逐文件改（一个项目 30-60 分钟够）

**Vue v1 → 未来 v2**：
- Tailwind Labs 没明确路线图
- Vue 用户可以先用 Radix Vue 过渡
-->

---
transition: fade-out
---

# 与 Radix UI / Ark UI / shadcn 对比

四大 Headless UI 选择对比

<v-click>

| 维度         | **Headless UI v2**     | Radix UI         | Ark UI                | shadcn/ui          |
| ------------ | ---------------------- | ---------------- | --------------------- | ------------------ |
| 维护方       | Tailwind Labs          | WorkOS           | Chakra 团队           | Vercel             |
| 组件数       | 16 个                  | **30+**          | **40+**               | 70+                |
| 跨框架       | React + Vue            | React            | **多框架**            | React              |
| 虚拟滚动     | **Combobox 独家**      | 无               | 无                    | 无                 |
| 表单 ARIA    | **Field 自动**         | 手动             | 手动                  | react-hook-form    |
| 与 Tailwind  | **官方搭档**           | 通过 shadcn      | 通过 Park UI          | 默认 Tailwind      |

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **React Headless 四大选择对比**：

**Headless UI v2（Tailwind Labs）**：
- 16 个组件（v2 重写后丰富）
- React + Vue 双版本（Vue 落后）
- 杀手锏：Anchor / transition / Combobox 虚拟滚动 / Field
- 与 Tailwind CSS 官方搭档
- Tailwind UI / Catalyst 底层

**Radix UI Primitives（WorkOS）**：
- 30+ 原语 —— 数量更多
- React only
- a11y 业界标杆（每组件完整 WAI-ARIA）
- Compound Component + asChild Slot 模式
- shadcn/ui 的底层基石
- 没有 Combobox 原语（要用 cmdk）

**Ark UI（Chakra UI 团队）**：
- 40+ 组件 —— 最多
- 跨框架：React / Vue / Solid / Svelte / Lit / Astro
- XState 状态机驱动（行为复用跨框架）
- Chakra v3 + Park UI 底层
- Vue 用户的首选

**shadcn/ui（Vercel）**：
- 70+ 完整组件（90% 基于 Radix）
- React + Next.js 主导
- 复制粘贴分发模式（不是 npm 包）
- Tailwind 样式 + 业务通用模板

**选型矩阵**：

| 场景                        | 推荐                       |
| --------------------------- | -------------------------- |
| React + Tailwind + 简单     | **Headless UI v2**         |
| React + Tailwind + 全功能   | shadcn/ui（底层 Radix）    |
| React + 自由设计 + 全功能   | Radix Primitives 直接用    |
| Vue 主线                    | Ark UI 或 Radix Vue        |
| Vue + 凑合用                | Headless UI Vue v1         |
| Solid / Svelte 跨框架       | Ark UI                     |
| 大数据 Combobox             | **Headless UI v2** 独家虚拟滚动 |
| 表单 ARIA 痛                | **Headless UI v2 Field**   |
| 30+ 原语全场景              | Radix UI                   |
| 抄完整模板就走              | shadcn/ui                  |

[click] **每个的「人格」**：

- **Headless UI**：「Tailwind 御用，组件少而精，v2 杀手锏多」
- **Radix UI**：「原语之王，shadcn 之父，30+ 全场景覆盖」
- **Ark UI**：「跨框架冠军，XState 派，Chakra 嫡系」
- **shadcn/ui**：「抄就完了，Vercel 加持，事实标准 React UI」

**互补还是替代？**

- HUI 和 Radix 大量场景可替代（Menu / Listbox / Combobox / Dialog 等）
- HUI 强在 Combobox 虚拟滚动 / Field 表单
- Radix 强在原语数量 / a11y 严格度 / shadcn 生态
- Ark UI 强在跨框架 / XState 行为复用
- shadcn 强在抄走能跑 / Tailwind 样式精美

**实际混用**：
- 项目用 shadcn（Radix 底）+ 单独引 HUI Combobox（虚拟滚动）—— 完全可以
- HUI Field + Radix Dialog —— 也可以
- 没有强排他性

**Tailwind 生态优先选项**：
- 全 Tailwind 项目 → HUI v2 首选（官方搭档 + data-* 完美适配）
- shadcn 用户 → 已经选了 Radix，必要时补 HUI Combobox
- Catalyst 用户 → 直接 HUI v2（Catalyst 就是基于 HUI）
-->

---
transition: fade-out
---

# 常见踩坑

新手最容易遇到的 6 个坑

<v-click>

**1. Next.js App Router 忘加 "use client"**

```tsx
"use client";  // 必须，HUI 用了 useState/useId
import { Menu } from "@headlessui/react";
```

</v-click>

<v-click>

**2. Combobox virtual + .map 写法（错：不渲染）**

```tsx
// 错：virtual 模式 ComboboxOptions 子节点不能用 .map
// 对：必须 render function
<ComboboxOptions>
  {({ option }) => <ComboboxOption value={option}>{option.name}</ComboboxOption>}
</ComboboxOptions>
```

</v-click>

<v-click>

**3. Listbox / Combobox 对象 value 不匹配（用 by 修复）**

```tsx
// 错：默认 === 比较，新对象引用 → 选中状态丢失
// 对：用 by 指定字段
<Listbox value={selectedCity} onChange={setSelectedCity} by="id">
```

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **坑 1：Next.js App Router 忘加 "use client"**

App Router 默认 server component，HUI 用了 useState / useId / useRef 等 client hook。

**症状**：
- 编译报错 `useState is not a function`
- 或运行时 hydration mismatch

**修复**：
- 在 import HUI 的文件顶部加 `"use client"`
- 或把 HUI 组件包到 client component 子树

**Pages Router 没这个问题**（默认全是 client）。

[click] **坑 2：Combobox virtual 模式必须用 render function**

```tsx
// 错
<Combobox virtual={{ options: filtered }}>
  <ComboboxInput />
  <ComboboxOptions>
    {filtered.map((p) => (
      <ComboboxOption key={p.id} value={p}>{p.name}</ComboboxOption>
    ))}
  </ComboboxOptions>
</Combobox>
```

**症状**：
- 不报错
- 但 ComboboxOptions 空白
- options 数据正常但不渲染

**原因**：
- virtual 模式 HUI 内部用 TanStack Virtual 控制渲染
- 直接 .map 渲染所有 ComboboxOption → HUI 不识别
- 必须 children 是 function，HUI 调用 function(option) 拿到 JSX

**修复**：
```tsx
<ComboboxOptions>
  {({ option }: { option: Person }) => (
    <ComboboxOption key={option.id} value={option}>
      {option.name}
    </ComboboxOption>
  )}
</ComboboxOptions>
```

**TypeScript 注意**：
- render function 参数类型要手动标注
- `{ option: Person }`（不是直接 `option: Person`）

[click] **坑 3：Listbox / Combobox by 没传，对象比较失败**

业务场景：表单加载默认值时，value 是从 API 拿的对象，但 options 也是从 API 拿的对象，两者引用不同。

```tsx
const [selectedCity, setSelectedCity] = useState({ id: 1, name: "北京" });
const cities = [{ id: 1, name: "北京" }, ...];

<Listbox value={selectedCity} onChange={setSelectedCity}>
  {cities.map((c) => (
    <ListboxOption value={c}>{c.name}</ListboxOption>
  ))}
</Listbox>
```

**症状**：
- selectedCity 看起来是 { id: 1, name: "北京" }
- cities[0] 也是 { id: 1, name: "北京" }
- 但 data-selected 没在第一项 → 显示不是选中

**原因**：
- HUI 默认用 `===` 比较 value
- 两个对象虽然内容一样，但引用不同 → 不等

**修复**：

```tsx
// 方案 1：用 by 指定字段
<Listbox value={selectedCity} onChange={setSelectedCity} by="id">

// 方案 2：用 by 函数
<Listbox value={selectedCity} onChange={setSelectedCity} by={(a, b) => a?.id === b?.id}>

// 方案 3：value 用 id 而非对象（推荐）
<Listbox value={selectedCity?.id} onChange={(id) => setSelectedCity(cities.find(c => c.id === id))}>
```

**推荐方案 3**：state 存 id，渲染时 lookup。React state 应该用 primitive。
-->

---
transition: fade-out
---

# 更多踩坑

继续 3 个进阶坑

<v-click>

**4. Dialog 嵌套 Combobox/Listbox 弹层飞出**：DialogPanel 的 transform 影响子元素定位 → 用 `portal` prop 让 ComboboxOptions 跳出

```tsx
<ComboboxOptions anchor="bottom" portal>...</ComboboxOptions>
```

</v-click>

<v-click>

**5. 没用 Field，错误信息屏幕阅读器读不到**：aria-invalid 只标错，不读 error；要 aria-describedby 关联 → 用 Field + ErrorMessage 自动

```tsx
<Field><Label>邮箱</Label><Input invalid={!!err} /><ErrorMessage>{err}</ErrorMessage></Field>
```

</v-click>

<v-click>

**6. SSR 闪烁**：v2 不闪（data-closed 起点 CSS），v1 Transition 组件 SSR 可能 flash → 推荐 v2 transition prop 模式

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **坑 4：Dialog 嵌套 Combobox / Listbox 弹层飞出**

业务场景：一个表单 Dialog，里面有 Combobox / Listbox 选项。

**症状**：
- ComboboxOptions / ListboxOptions 在 Dialog 内显示
- 但 anchor 计算错位（Panel 显示在 Dialog 外面）
- 或者 z-index 被 Dialog 遮挡

**原因**：
- DialogPanel 默认有 transform / containment（影响 floating-ui 定位）
- Combobox Panel 默认不 portal —— 在 DialogPanel 内
- DialogPanel 的 transform 影响子元素 absolute 定位

**修复方案 1：portal Combobox Panel**：

```tsx
<ComboboxOptions anchor="bottom" portal>
  {/* portal 到 body，跳出 DialogPanel 的影响 */}
</ComboboxOptions>
```

注意：portal 出去后 z-index 要够大（覆盖 DialogPanel）。

**修复方案 2：让 DialogPanel 不要 transform**：

避免在 DialogPanel 上写 `translate-x` / `scale` 等 —— transform 影响 contained 元素定位。

**推荐方案 1**：portal 解决得最干净。

**Headless UI v2 默认行为**：
- v2 Dialog 内的 Combobox / Listbox / Menu / Popover 默认不 portal
- 你需要 portal prop 启用
- v2.2+ 改善了 Dialog 内 anchor 计算 —— 大多数场景不需要 portal

[click] **坑 5：没用 Field，错误信息屏幕阅读器读不到**

业务场景：自己写表单 + 自己写 error 提示。

```tsx
const [error, setError] = useState("");

<div>
  <label htmlFor="email">邮箱</label>
  <input
    id="email"
    type="email"
    aria-invalid={!!error}
    onChange={(e) => validate(e.target.value)}
  />
  {error && <p className="text-red-500">{error}</p>}
</div>
```

**症状**：
- 视觉上 error 显示
- aria-invalid 设了
- 但屏幕阅读器没读出 error 文本

**原因**：
- aria-invalid 只标识「字段有错」
- 不会读出具体错误
- 需要 aria-describedby 指向 error 元素

**修复手动**：
```tsx
<input
  id="email"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && <p id="email-error" className="text-red-500">{error}</p>}
```

**修复推荐：用 Field**：
```tsx
<Field>
  <Label>邮箱</Label>
  <Input type="email" invalid={!!error} />
  <ErrorMessage>{error}</ErrorMessage>
</Field>
```

HUI 自动：
- 生成 id 关联
- aria-invalid 设
- aria-describedby 包含 ErrorMessage id
- 屏幕阅读器完整宣读「邮箱，必填，邮箱格式错误」

这是 Field 的杀手价值 —— 减少 a11y bug。

[click] **坑 6：SSR 闪烁**

业务场景：Next.js SSR 时 Dialog / Popover 等浮层组件。

**v1 时代问题**：
- Transition show={isOpen} 初始 isOpen=false → SSR 不渲染 Panel
- 但 Transition 组件 hydrate 时初次 enter 动画从 enterFrom 开始
- 导致闪一下从 opacity-0 到 opacity-100

**v2 改进**：
- transition prop + data-closed 起点 = data-closed CSS
- SSR 直出 data-closed
- hydrate 时不触发 enter（因为 isOpen=false → 不渲染 Panel）
- 用户点击打开时才走 enter 动画

**完整 v2 模式**：
```tsx
<DialogPanel transition className="transition data-[closed]:opacity-0 data-[closed]:scale-95">
```

- 初始 data-closed
- 点击打开 → 移除 data-closed → CSS transition 触发
- 关闭 → 加 data-closed → 反向 transition

**Vue v1 闪烁问题**：
- 仍是 Transition 组件
- SSR 时可能闪
- 解决：v-if 控制 mount + onMounted 后才允许 transition

**业务建议**：
- 用 v2 transition prop 模式
- 不用 v1 Transition 组件
- SSR 项目（Next.js / Remix / Nuxt）务必测试 hydration
-->

---
transition: fade-out
---

# Vue v1 vs React v2 速查

API 差异对照表

<v-click>

| 概念             | **React v2**                  | **Vue v1**         |
| ---------------- | ----------------------------- | ------------------ |
| 状态绑定 / 访问  | `value` + render props / data-\*  | `v-model` + scoped slots |
| Transition       | transition prop + data-closed | `<TransitionRoot>` |
| 浮层定位         | `anchor="bottom"`             | 手动 floating-ui   |
| 表单 ARIA / 虚拟 | Field / `virtual` prop        | 无                 |
| Checkbox / Input | 内置                          | 用原生             |
| 焦点项           | `focus`                       | `active`           |

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Vue v1 vs React v2 全方位对照 —— 跨框架团队必看。

状态绑定差异：React 显式 value 和 onChange；Vue 用 v-model 双向绑定 (template 内用 Listbox v-model=value)。

状态访问：React v2 推荐 data-focus / data-disabled 等属性，Tailwind 直接 data-[focus]:bg-sky-100 选择器；Vue v1 仍用 v-slot 拿 active / disabled 等 scoped slots。注意 Vue v1 用 active 不是 focus。Vue v1 没 data-* 属性，必须 v-slot 拿状态。

Transition：React v2 用 transition prop + data-closed 写 CSS transition；Vue v1 仍是 TransitionRoot 组件包裹 + enter/leave class props。Vue 仍是 v1 时代 Transition 模式。

浮层定位：React v2 用 PopoverPanel anchor=bottom 一键定位；Vue v1 没 anchor，自己拉 floating-ui useFloating。Vue v1 缺 anchor 是最大短板。

表单：React v2 有 Field 容器，自动 aria-labelledby / aria-describedby / aria-invalid；Vue v1 没 Field，手写 label for / input id / aria-invalid / aria-describedby。Vue v1 没有 Field / Fieldset / Label / Description。

Combobox 虚拟滚动：React v2 内置 virtual prop（TanStack Virtual）；Vue v1 无，自己集成 vueuse useVirtualList 或 vue-virtual-scroller。Vue v1 没有内置虚拟滚动。

Checkbox / Input / Select：React v2 有内置组件；Vue v1 无，用原生 input checkbox / input text / select。Vue v1 没有 v2 新增的 4 个表单组件。

Vue 用户的选择：
1. 凑合用 Headless UI Vue v1（简单场景，主要用 Listbox / Combobox / Menu / Dialog，接受手写 ARIA）
2. 转 Radix Vue（社区移植，30+ 组件，全功能，Vue 主流选择）
3. 用 Ark UI（跨框架含 Vue，XState 驱动，Chakra v3 / Park UI 底层，40+ 组件）

业务推荐 Vue 用户：简单项目用 Headless UI Vue v1；中大型用 Radix Vue 或 Ark UI；等 Tailwind Labs 发 Vue v2（无明确时间线）。
-->

---
transition: fade-out
---

# 下一步学习路径

从入门到精通的 Headless UI 路线图

<v-click>

**入门（1 周）**：装 React v2 + Tailwind v4，跑通 Menu / Listbox / Dialog 三大组件；理解 data-\* + Tailwind `data-[focus]:`；用 Field 写完整登录表单

</v-click>

<v-click>

**进阶（2-4 周）**：Combobox + virtual 做大数据搜索；transition prop + data-closed 实现复杂动画；anchor + PopoverGroup 做 Mega Menu；读 Tailwind UI 源码

</v-click>

<v-click>

**精通（持续）**：读 @headlessui/react 源码（Compound + useId + floating-ui 集成）；学 WAI-ARIA APG（Menu Button / Listbox / Combobox / Dialog 模式）；自建设计系统 + 关注 v2 后续更新（Vue v2 / 新组件）

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **入门阶段（1 周）**：

第 1-2 天：
- 安装 React 项目 + Tailwind CSS v4 + Headless UI v2
- 跑通 Menu 示例（操作菜单）
- 跑通 Listbox 示例（单选下拉）
- 跑通 Dialog 示例（模态对话框）

第 3-4 天：
- 理解 data-* 状态属性（data-focus / data-selected / data-open 等）
- 理解 Tailwind `data-[focus]:bg-sky-100` 选择器写法
- 把 v1 风格 render props 改写为 data-* CSS

第 5-7 天：
- 用 Field / Fieldset / Label / Description / ErrorMessage 写完整登录表单
- 集成 react-hook-form + zod 校验
- 用 Lighthouse 验证 a11y 满分

[click] **进阶阶段（2-4 周）**：

第 1 周：
- Combobox 深入
  - 简单搜索：filter + .map
  - 大数据：virtual={{ options }} + render function
  - 自定义 displayValue（选中项在 Input 显示）
  - 多选模式（multiple prop）

第 2 周：
- transition prop 高级用法
  - DialogPanel + DialogBackdrop 联动动画
  - data-enter / data-leave 控制方向
  - 配合 Tailwind v4 简化语法

第 3 周：
- Anchor Positioning 进阶
  - PopoverGroup 做 Mega Menu（顶部导航）
  - anchor 对象配置（gap / padding / offset）
  - CSS 变量 --button-width 实现同宽下拉

第 4 周：
- 读 Tailwind UI 源码
  - 80+ 静态组件，全部基于 HUI
  - 学样式 + 学交互模式
  - 复制到项目用（购买 Tailwind UI）

或读 Catalyst：
- 30+ 现代 React 组件
- 基于 HUI v2 + Tailwind v4
- 完整 UI Kit

[click] **精通阶段（持续）**：

**源码层**：
- @headlessui/react 仓库结构
  - components/ 各组件实现
  - utils/ 通用工具（id / focus / floating）
  - tests/ a11y 测试套件
- 关键源文件：
  - Combobox.tsx（虚拟滚动实现）
  - Dialog.tsx（focus trap 实现）
  - Floating.tsx（anchor 集成 floating-ui）
  - Field.tsx（ARIA 自动注入）

**WAI-ARIA Authoring Practices Guide**：
- 30+ 经典 pattern
- HUI 每个组件对应一个 pattern
- 自己实现 pattern 是「Headless UI 工程师」的硬技能

**自建设计系统**：
- 基础：HUI 行为层
- 样式：Tailwind CSS v4
- 主题：CSS 变量 + dark mode
- 业务包装：DesignSystem.Dialog / DesignSystem.SearchSelect
- 测试：Playwright + Axe

**关注 v2 后续**：
- Vue v2 何时发布（无明确时间）
- 新组件（DatePicker / Drawer / Tooltip 缺）
- TanStack Virtual 进阶
- 与 Tailwind v5（未来）配合

**社区资源**：
- Discord：Tailwind 官方 server
- GitHub：headlessui/headlessui issues
- Tailwind 官方教程：Refactoring UI（设计 + 实现）
- Adam Wathan / Robin Malfait 推特

业务级深度：
- 大型设计系统团队 → 直接基于 HUI v2 + Field 体系自建
- 中型团队 → 用 Catalyst + 业务包装
- 小型团队 → 直接用 Tailwind UI 复制粘贴
-->

---
transition: fade-out
---

# 官方资源与生态

最重要的链接清单

<v-click>

**官方资源**：[headlessui.com](https://headlessui.com/) / [GitHub](https://github.com/tailwindlabs/headlessui)（27K+ star）/ [Heroicons](https://heroicons.com/)

</v-click>

<v-click>

**付费组件**

- [Tailwind UI](https://tailwindui.com/)：500+ 静态组件（HTML / React / Vue）
- [Catalyst](https://catalyst.tailwindui.com/)：30+ 完整 React UI Kit
- [Tailwind Plus](https://tailwindcss.com/plus)：订阅版（UI + Catalyst）

</v-click>

<v-click>

**生态产品**

- [Tailwind CSS v4](https://tailwindcss.com/)：官方搭档 atomic CSS
- [Radix UI](https://www.radix-ui.com/) / [Ark UI](https://ark-ui.com/) / [shadcn/ui](https://ui.shadcn.com/)：竞品与互补

</v-click>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **官方资源**：

**headlessui.com**：
- 主站，React v2 + Vue v1 文档分开
- 每组件页：Examples / Anatomy / API / Accessibility / Keyboard
- 大量动态 demo（可交互）
- v2 改动 changelog 在 GitHub Release

**GitHub**：
- tailwindlabs/headlessui（monorepo，含 React + Vue）
- 27K+ star
- Issue / Discussion 活跃
- Tailwind Labs 团队官方维护

**Heroicons**：
- 200+ 单色 SVG 图标
- 三个变体：24x24 outline / 24x24 solid / 20x20 mini / 16x16 micro
- React / Vue 包装
- 与 HUI 协同设计（中性几何感）

[click] **付费组件**：

**Tailwind UI（$299 一次性）**：
- 500+ 静态组件
- 三大类：Marketing / Application UI / Ecommerce
- HTML / React / Vue 三个版本
- React 版用 HUI v2 实现交互
- 复制粘贴模式
- Tailwind Labs 主要收入来源

**Catalyst（$299 一次性）**：
- 30+ 完整 React 组件
- 现代设计（深色优先）
- 完整 UI Kit（不只是组件）
- 包含 Auth Pages / Dashboard 布局
- 基于 HUI v2 + Tailwind v4
- Application UI 业务首选

**Tailwind Plus（$299/年 订阅）**：
- 2024 年新模式
- 包含 Tailwind UI + Catalyst
- 每年新组件 + 更新
- 中长期项目推荐

[click] **生态产品**：

**Tailwind CSS v4**：
- HUI 官方搭档
- Lightning CSS 引擎
- data-* 简写 `data-focus:bg-sky-100`
- variant() / utility() API

**Radix UI**：
- 直接竞品 + 部分互补
- 30+ 原语 vs HUI 16
- a11y 业界标杆
- shadcn 底层

**Ark UI**：
- 跨框架替代（React / Vue / Solid / Svelte）
- XState 驱动
- Vue 用户首选

**shadcn/ui**：
- Radix + Tailwind 模板
- 70+ 组件
- 复制粘贴
- React 主流

**互补使用场景**：

- HUI Combobox（虚拟）+ shadcn Dialog → 完全可以
- HUI Field（表单）+ Radix Tooltip（HUI 缺）→ 推荐
- Tailwind UI 模板 + HUI v2 修改 → Tailwind Labs 用户工作流

**其他配套**：

- [Refactoring UI](https://www.refactoringui.com/)（Adam Wathan / Steve Schoger 著）：设计书
- [Tailwind UI Refresh](https://www.youtube.com/c/TailwindLabs)：YouTube 教程
- [Robin Malfait 推特](https://twitter.com/malfaitrobin)：v2 设计动机解读
- [Tailwind Discord](https://discord.com/invite/7NF8GNe)：社区讨论

业务推荐栈：
- Next.js + Tailwind v4 + HUI v2 + Catalyst + react-hook-form + zod + TanStack Query → 现代 React 全栈
- Vite + Tailwind v4 + HUI v2 + 自定义包装 → SPA / 后台
- Astro + Tailwind v4 + HUI v2（client islands） → 内容站
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 🎧

Headless UI — Tailwind Labs 出品 / React v2 杀手锏 / 表单 ARIA 革命

<div class="mt-8 text-lg">

**核心心智**

- Tailwind Labs 出品，与 Tailwind CSS / Heroicons / Catalyst 协同设计
- React v2 + Vue v1 不对称：v2 16 组件 / v1 10 组件，差距 1 年
- 四大杀手锏：Anchor / transition prop / Combobox 虚拟滚动 / Field 自动 ARIA
- data-\* 双模式：render props（兼容）+ data-\*（v2 推荐）+ Tailwind v4 完美适配
- 完美 a11y：每组件遵循 WAI-ARIA APG，键盘 / 焦点 / 屏幕阅读器全包
- 业务收益：浮层代码减 80%，表单 ARIA bug 减 70%，Combobox 性能十倍

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://headlessui.com/" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/tailwindlabs/headlessui" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://catalyst.tailwindui.com/" target="_blank" class="slidev-icon-btn">
    <carbon:layers /> Catalyst
  </a>
</div>

<style>
h1 {
  background-color: #06B6D4;
  background-image: linear-gradient(45deg, #06B6D4 10%, #0EA5E9 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：Headless UI = Tailwind Labs 出品的 React v2 + Vue v1 无样式行为层，v2 杀手锏让它成为 React UI 一线选择。

**核心心智六条**：

1. **Tailwind Labs 出品**：与 Tailwind CSS / Heroicons / Catalyst 协同设计，是付费组件库的底层
2. **React v2 vs Vue v1 不对称**：v2 16 组件 / v1 10 组件，差距 1 年；Vue 用户考虑 Radix Vue / Ark UI
3. **四大杀手锏**：
   - Anchor Positioning（内置 floating-ui，一键浮层定位）
   - transition prop + data-closed（替代 Transition 组件，DOM 扁平化）
   - Combobox 虚拟滚动（TanStack Virtual 内置，10K+ 项流畅）
   - Field 自动 ARIA（id/labelledby/describedby/invalid 全自动）
4. **data-\* 双模式**：render props 兼容（v1 风格）+ data-\* 推荐（v2 风格） + Tailwind v4 `data-[focus]:` 完美适配
5. **完美 a11y**：每组件遵循 WAI-ARIA APG，键盘 / 焦点 / 屏幕阅读器 / 滚动锁定 / Portal 全包
6. **业务收益**：浮层代码减 80%（不用手拉 floating-ui），表单 ARIA bug 减 70%（Field 自动），Combobox 性能十倍（virtual）

**下一步建议**：

入门：
- 装 React v2 + Tailwind v4，跑通 Menu / Listbox / Dialog
- 用 Field 写一个登录表单
- 理解 data-* 状态属性 + Tailwind v4 简写

进阶：
- Combobox + virtual 做大数据搜索
- transition prop + data-closed 实现复杂动画
- Anchor Positioning + PopoverGroup 做 Mega Menu
- 集成 react-hook-form + zod

精通：
- 读 @headlessui/react 源码
- 学 WAI-ARIA APG 30+ patterns
- 自建设计系统：HUI 行为 + Tailwind 样式 + 业务 wrapper
- 关注 v2 后续更新

**延伸学习**：

- Tailwind UI / Catalyst（付费组件）
- Tailwind CSS v4（atomic CSS）
- Radix UI / Ark UI / shadcn（同类竞品）
- WAI-ARIA Authoring Practices Guide
- floating-ui（HUI v2 底层）
- TanStack Virtual（Combobox 虚拟滚动底层）

Headless UI v2 是 React 2024+ UI 生态的「Tailwind 御用 Headless 选择」 ——
v2 杀手锏（Anchor / transition / Combobox virtual / Field）让它从 Radix 的阴影下重新成为一线选择。

感谢观看！
-->
