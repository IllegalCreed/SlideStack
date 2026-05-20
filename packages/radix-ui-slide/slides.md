---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Radix UI
info: |
  Presentation Radix UI for React developers — Primitives + Themes + Colors.

  Learn more at [https://www.radix-ui.com/](https://www.radix-ui.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">⚛️</span>
</div>

<br/>

## Radix UI — Headless Primitives + Themes 设计系统

Compound Components / asChild / data-state / a11y —— shadcn/ui 的底层基石

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Radix UI —— React 生态最具影响力的「Headless UI 原语库」+「完整设计系统」双产品线，
2020 年 WorkOS 团队（Pedro Duarte / Jenna Smith / Colm Tuite 等）创立，
当前主线 Primitives 1.4+ 与 Themes 3.2+，是 React UI 领域的「基础设施级」存在。

两条产品线：
- **Radix Primitives**：30+ 无样式 + 无障碍原语，组件库的「基石」
  - shadcn/ui 的底层就是 Radix Primitives
  - Vercel / Linear / CodeSandbox / Supabase / Resend / Cal.com 等头部产品都在用
- **Radix Themes**：完整设计系统，开箱即用的样式 + 主题
  - 类似 Material UI / Mantine 的定位，但用 Primitives 作底层
  - 自带 Layout / Form / Color / Typography 体系

核心卖点：
- **30+ Primitives**：Dialog / DropdownMenu / Popover / Select / Toast / Accordion / Tabs / Slider / Tooltip 等
- **完美 a11y**：WAI-ARIA 全遵从，键盘导航 / 焦点管理 / 屏幕阅读器开箱即用
- **Compound Component**：Root + Trigger + Content + Portal 命名空间，结构即组件
- **asChild prop**：Slot 模式，把组件能力转嫁到任意子元素（v3 Chakra / shadcn 都借鉴这点）
- **Controlled / Uncontrolled**：默认非受控（state 自管理），需要时一键切换受控
- **data-state**：状态暴露为 DOM 属性，CSS 选择器直接写动画
- **Radix Colors**：30+ 色阶，每色 12 阶语义化，APCA 对比度通过
- GitHub Primitives 16K+ star，Themes 单独 6K+ star
- npm `radix-ui` 周下载 600 万+，加上单独包 1500 万+

本次内容聚焦：Primitives 1.4+（当前主线）+ Themes 3.2+ + Colors 3.0+。
-->

---
transition: fade-out
---

# 什么是 Radix UI？

React 生态最具影响力的「Headless 原语 + 设计系统」双产品线

<v-click>

- **Radix Primitives**：30+ 无样式 + 无障碍 React 原语，**shadcn/ui 的底层基石**
- **Radix Themes**：完整设计系统（Layout / Form / Typography / Color），开箱即用
- **Radix Colors**：30+ 色阶 × 每色 12 阶，APCA 对比度 + P3 广色域
- **Radix Icons**：极简单色图标集，与 Themes 协同设计
- **完美 a11y**：WAI-ARIA 模式 + 键盘导航 + 焦点管理 + 屏幕阅读器，全部内置
- **Compound Components**：Dialog.Root / Dialog.Trigger 命名空间，结构即组件
- **asChild Slot 模式**：把原语能力转嫁到子元素，灵活组合不限制 DOM
- **Controlled / Uncontrolled**：默认非受控状态自管理，需要时切受控
- **data-state DOM 属性**：状态映射 CSS 选择器，动画/样式直接写

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Radix UI Overview_](https://www.radix-ui.com/primitives/docs/overview/introduction)

</div>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Radix UI 的定位非常特别 —— 不是「又一个组件库」，而是「React 生态的基础设施」。

**Radix Primitives 是 shadcn/ui 的底层** —— 这是 2024+ React 生态最重要的事实。
shadcn 把 Radix Primitives + Tailwind 复制到本地，成为 React UI 新王。
Radix 团队把 a11y + 行为做到极致，shadcn 把样式做到极致 —— 两者天作之合。

**两条产品线分开理解**：

1. **Radix Primitives**：
   - 30+ headless 组件（Dialog / DropdownMenu / Popover / Select / Toast / Accordion / Tabs / Slider / Tooltip / Switch / Checkbox / RadioGroup / Toggle / ToggleGroup / Avatar / Aspect Ratio / Collapsible / Context Menu / Dialog / Hover Card / Label / Menubar / Navigation Menu / Progress / Scroll Area / Separator / Form 等）
   - 完全无样式，只提供「行为 + 无障碍」
   - 由你（或 shadcn / Themes）填充样式
   - 包名：`radix-ui`（树摇 monolith） 或 `@radix-ui/react-{name}`（单独包）

2. **Radix Themes**：
   - 完整设计系统，类似 Mantine / MUI 定位
   - 内置 Theme 配置（accentColor / grayColor / radius / scaling）
   - 包含 Layout（Container / Section / Flex / Grid / Box）+ Form（TextField / Select / Checkbox / Switch / Slider）+ Typography（Heading / Text / Code / Link / Em / Strong）
   - 底层用 Primitives，自带样式

3. **Radix Colors**：
   - 30+ 命名色阶（Red / Blue / Green / ... / Gray / Mauve / Slate / Sage / Olive / Sand 等）
   - 每色 12 阶（1=app bg, 2=subtle bg, 3-5=UI bg states, 6-8=borders, 9-10=solid bg, 11=low-contrast text, 12=high-contrast text）
   - 每阶都有 Alpha 变体（用于半透明叠加）
   - 支持 P3 广色域（更鲜艳）
   - APCA 对比度算法保证可访问性

4. **Radix Icons**：
   - 200+ 单色 SVG 图标
   - 与 Themes 协同设计（中性 + 几何感）

**核心心智**：
- **完美 a11y**：所有原语遵循 WAI-ARIA 模式
- **Compound Components**：`<Dialog.Root><Dialog.Trigger /><Dialog.Content /></Dialog.Root>` 命名空间结构
- **asChild prop**：Radix 首创的 Slot 模式，2024+ 几乎所有现代 React UI 库都借鉴
- **非受控默认**：state 默认自管理，需要时切受控（`open` + `onOpenChange`）
- **data-state**：组件状态暴露为 DOM 属性，CSS 直接选择 `[data-state="open"]`
- **CSS 变量**：`--radix-popover-content-transform-origin` 等，做 origin-aware 动画

下面按「定位 → 产品线 → shadcn/ui 关系 → 对比 → Primitives 分组 → 各 Primitive 用法 → 模式（Compound / Controlled / asChild / data-state）→ Themes 体系 → Colors 体系 → 集成（Tailwind / Next.js / shadcn）→ 踩坑 → 学习路径」讲透。
-->

---
transition: fade-out
---

# 两条产品线：Primitives vs Themes

Radix 的核心结构 —— 同一团队，两个产品

<v-click>

| 维度       | **Radix Primitives**         | **Radix Themes**            |
| ---------- | ---------------------------- | --------------------------- |
| 定位       | Headless 原语库              | 完整设计系统                |
| 样式       | **无样式**（你自由发挥）       | **内置样式**（开箱即用）      |
| 包名       | `radix-ui`                   | `@radix-ui/themes`          |
| 组件数     | 30+ 行为原语                 | 50+ 样式化组件              |
| 主要场景   | 自定义设计系统 / shadcn 底层 | 快速搭后台 / 通用 SaaS      |
| 心智       | 自己样式 + Primitives 行为   | accentColor + 组件 props    |
| 类似产品   | Headless UI / Ark UI         | Mantine / MUI / Chakra UI   |

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Radix 的「双产品线」常被混淆 —— 需要先讲清楚。

**Radix Primitives（核心招牌）**：
- 包名：`radix-ui`（一站式 monolith，tree-shakable）或单独包 `@radix-ui/react-dialog` 等
- 哲学：「无样式 + 完美 a11y」—— 提供「行为」，不提供「外观」
- 30+ 原语：Dialog / DropdownMenu / Popover / Select / Toast / Accordion / Tabs / Slider / Tooltip / ...
- 这是 Radix 的「灵魂」—— shadcn/ui 用它作底层

**Radix Themes（完整设计系统）**：
- 包名：`@radix-ui/themes`
- 哲学：「开箱即用 + 设计师友好」—— 提供「行为 + 外观 + 主题体系」
- 50+ 组件：含 Layout（Container / Section / Flex / Grid / Box）+ Form + Typography + Data Display
- 主题配置：accentColor / grayColor / radius / scaling 四个 props 就能换风格
- 类似 Mantine / MUI / Chakra UI 定位

**为什么是两条产品线？**

Radix 团队的理念是「分层解耦」：
- Primitives 解决「行为 + a11y」—— 这是工业难题，复用价值高
- Themes 解决「外观 + 设计语言」—— 这是品牌差异化，单独提供也合理

业务可以分场景选：
- **自有设计系统** → 只用 Primitives，样式自己写（或用 shadcn 模板）
- **快速搭原型 / 后台** → 直接用 Themes，accentColor 一改就换皮
- **设计感强 + 自由度高** → Primitives + Tailwind（即 shadcn 模式）
- **大企业 / 中后台** → Themes + 自定义品牌色

**两者关系**：
- Themes 底层用了 Primitives 一部分（如 Dialog / Popover / DropdownMenu）
- 但 Themes 不是 Primitives 的「样式皮肤」—— 它独立设计，部分组件没用 Primitives
- 安装/使用各自独立，不强求一起

**心智上的差别**：
- 用 Primitives：你需要「写 CSS / Tailwind / styled-components」
- 用 Themes：你只需「改 props」—— accentColor="violet" radius="full" 就行

新项目选择路径：
- 设计自由 + 学习 React UI 设计模式 → Primitives + Tailwind
- 后台 / 内部工具 / 快速验证 → Themes
- 用 shadcn 已经够 → 就是 Primitives + Tailwind 的封装，本质一样
-->

---
transition: fade-out
---

# 与 shadcn/ui 的关系

shadcn/ui 的「底层基石」就是 Radix Primitives

<v-click>

- **shadcn/ui** = Radix Primitives 行为 + Tailwind 样式 + 复制粘贴分发
- shadcn 把 Radix Dialog / Popover / Select 等用 Tailwind 「样式皮肤」化
- 通过 CLI 把组件代码**复制到你的 repo**，可以随便改
- 不是 npm 包 —— 是「distribution methodology」（代码分发方法论）

</v-click>

<v-click>

```bash
# shadcn 装 Dialog 实际做了什么
npx shadcn@latest add dialog

# 1. 安装 @radix-ui/react-dialog 到依赖
# 2. 把 components/ui/dialog.tsx 复制到你 repo（Radix + Tailwind 包装）
# 3. 你随时改样式 / 加 props / 删功能
```

</v-click>

<v-click>

> 💡 **理解**：shadcn 出名后，Radix Primitives 流量暴涨 —— 因为 shadcn 用户实际是 Radix 用户。Radix 团队同时受益。

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] shadcn/ui 是 2023+ React UI 圈最火的项目，但很多人没意识到 —— **shadcn 的底层就是 Radix**。

shadcn 的几个组件，本质是 Radix + Tailwind：

| shadcn 组件 | Radix 原语 |
| --- | --- |
| Dialog | @radix-ui/react-dialog |
| DropdownMenu | @radix-ui/react-dropdown-menu |
| Popover | @radix-ui/react-popover |
| Select | @radix-ui/react-select |
| Toast | @radix-ui/react-toast |
| Accordion | @radix-ui/react-accordion |
| Tabs | @radix-ui/react-tabs |
| Switch | @radix-ui/react-switch |
| Slider | @radix-ui/react-slider |
| Checkbox | @radix-ui/react-checkbox |
| ContextMenu | @radix-ui/react-context-menu |
| HoverCard | @radix-ui/react-hover-card |

[click] **shadcn 的安装哲学**：

```bash
npx shadcn@latest add dialog
```

这条命令做了三件事：
1. 检测 / 安装 `@radix-ui/react-dialog`（npm 依赖）
2. 把 `components/ui/dialog.tsx` 写到你的项目
3. 这个文件就是 Radix 的 Tailwind 样式包装

你打开 `components/ui/dialog.tsx` 会看到：
- import Radix Dialog
- 给每个 Radix 部件加 Tailwind className
- 导出 styled 后的 Dialog / DialogTrigger / DialogContent 等

所以「用 shadcn」=「用 Radix Primitives 行为 + Tailwind 样式 + 复制代码到本地」。

[click] **理解的关键**：

shadcn 不是「替代 Radix」—— 是「Radix 的 Tailwind 样式模板 + 分发工具」。

- 你完全可以不用 shadcn，直接用 Radix Primitives + 自己的 CSS
- shadcn 用户大量增长后，Radix Primitives 下载量也跟着爆
- Radix 团队同时受益 —— 没有 Radix 就没有 shadcn

但要注意：
- **shadcn 不是组件库**：没有 npm 包，组件代码在你 repo
- **shadcn 不是 Radix 的官方 wrapper**：是社区项目，但 Vercel 收购了 shadcn 作者
- **shadcn 不止 Radix**：少量组件用 cmdk / react-day-picker 等其他底层

理想选型：
- 喜欢 Tailwind + 想快上手 → shadcn/ui
- 想最大自由 → 直接用 Radix Primitives + 自己写样式
- 不想写样式 → Radix Themes
-->

---
transition: fade-out
---

# 与 Headless UI / Ark UI 对比

React 生态 Headless 三巨头横向比较

<v-click>

| 维度       | **Radix Primitives** | Headless UI         | Ark UI                |
| ---------- | -------------------- | ------------------- | --------------------- |
| 维护方     | WorkOS 团队          | Tailwind Labs       | Chakra UI 团队        |
| 组件数     | **30+**              | 10+                 | 40+                   |
| 跨框架     | React only           | React / Vue         | **React / Solid / Vue / Svelte** |
| a11y       | **业界标杆**         | 完善                | 完善                  |
| 模式       | Compound + asChild   | Compound + as       | Compound + asChild    |
| 受控/非受控 | 双模式               | 主受控              | 双模式                |
| 流行度     | **shadcn 加持最热**  | 与 Tailwind 绑定    | Chakra v3 底层        |

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] React 生态有三大 Headless UI 库，定位有差异：

**Radix Primitives**（WorkOS 团队）：
- 30+ 原语 —— 最完整
- React only —— 主打 React 生态
- a11y 业界标杆 —— 每个组件遵循 WAI-ARIA 模式
- Compound + asChild —— 这两个模式是 Radix 首创+发扬
- 因 shadcn 加持，2023+ 流量爆发
- GitHub 16K+ star

**Headless UI**（Tailwind Labs）：
- 10+ 组件（Menu / Listbox / Combobox / Dialog / Disclosure / Popover / RadioGroup / Switch / Tabs / Transition）
- React + Vue 双版本
- Tailwind Labs 出品，跟 Tailwind 紧密协同
- 用 `as` prop（不是 `asChild`），Polymorphic 模式
- 适合 Tailwind 项目 + 不需要超多组件
- GitHub 27K+ star（含 Vue 版）

**Ark UI**（Chakra UI 团队）：
- 40+ 组件 —— 数量最多
- **跨框架**：React / Solid / Vue / Svelte / Lit / Astro
- 用 XState 状态机驱动复杂交互（Combobox / Menu）
- 是 Chakra UI v3 的底层（类似 Radix 之于 shadcn）
- 也是 Park UI 设计系统的底层
- GitHub 5K+ star（增长快）

**选型建议**：

- **React + Tailwind + 流行** → Radix（默认）+ shadcn
- **React + 想要 Tailwind 生态** → Headless UI（Tailwind 官方加持）
- **多框架共享 + 状态机驱动** → Ark UI（独家跨框架）

**Radix 的护城河**：
- a11y 最完整 + Compound + asChild 模式被广泛模仿
- shadcn 加持 → 流量爆炸
- WorkOS 团队全职维护
- 是「事实标准」级的存在

**注意**：Headless UI v2 后基本对 React 维护放缓，Tailwind Labs 重心转向 Catalyst（付费组件库）。Radix 跟 Ark UI 现在是真正活跃的两个 Headless 选项。
-->

---
transition: fade-out
---

# 30+ Primitives 分组速览

按场景分组的完整原语清单

<v-click>

**Overlay**：Dialog / AlertDialog / Popover / HoverCard / Tooltip / ContextMenu / DropdownMenu / Menubar / NavigationMenu

</v-click>

<v-click>

**Form**：Form / TextField / Checkbox / RadioGroup / Switch / Slider / Toggle / ToggleGroup / Select / Label

</v-click>

<v-click>

**Layout**：AspectRatio / Avatar / ScrollArea / Separator

</v-click>

<v-click>

**Disclosure**：Accordion / Collapsible / Tabs

</v-click>

<v-click>

**Feedback**：Toast / Progress

</v-click>

<v-click>

**Utility**：Slot / Visually Hidden / Portal / Direction

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Overlay（覆盖层）—— Radix 最大的家族**：

- **Dialog**：模态对话框（焦点陷阱 + ESC 关闭 + 滚动锁定）
- **AlertDialog**：警告对话框（带 Action / Cancel 按钮，强意图）
- **Popover**：浮动面板（点击触发，可放任意内容）
- **HoverCard**：悬停卡片（hover 触发，介绍卡片场景）
- **Tooltip**：工具提示（hover/focus 触发，短文字）
- **ContextMenu**：右键菜单（右键触发）
- **DropdownMenu**：下拉菜单（点击触发，含 CheckboxItem / RadioItem）
- **Menubar**：菜单栏（横向多菜单，如桌面应用 File/Edit/View）
- **NavigationMenu**：导航菜单（顶部导航 + 大菜单 mega menu）

每个都有 Portal、focus management、ESC、collision detection。

[click] **Form（表单）—— 输入类原语**：

- **Form**：完整表单（含 Field / Label / Control / Message / Submit / ValidityState）
- **TextField**：文本输入（暂时不在 Primitives，在 Themes）
- **Checkbox**：复选框（含 indeterminate 三态）
- **RadioGroup**：单选组（roving tabindex）
- **Switch**：开关（checked/unchecked）
- **Slider**：滑块（multiple thumbs / vertical / step）
- **Toggle**：单按钮切换（pressed/unpressed）
- **ToggleGroup**：按钮组切换（single/multiple）
- **Select**：下拉选择（typeahead + virtual scroll）
- **Label**：表单标签（关联 Control）

[click] **Layout（布局原语）**：

- **AspectRatio**：固定宽高比（视频 / 图片容器）
- **Avatar**：头像（带 fallback / image-load 状态）
- **ScrollArea**：自定义滚动条（保留原生滚动行为）
- **Separator**：分割线（语义化 horizontal/vertical）

[click] **Disclosure（折叠/切换）**：

- **Accordion**：折叠面板（single/multiple/collapsible）
- **Collapsible**：可折叠区块（单个开关）
- **Tabs**：标签页（horizontal/vertical + automatic/manual）

[click] **Feedback（反馈）**：

- **Toast**：浮动通知（swipe / hotkey / duration）
- **Progress**：进度条（determinate/indeterminate）

[click] **Utility（工具组件）**：

- **Slot**：Slot 模式核心（实现 asChild）
- **VisuallyHidden**：视觉隐藏但屏幕阅读器可读
- **Portal**：把内容 portal 到 document.body
- **Direction**：LTR/RTL 方向 Provider

这 30+ 原语覆盖了一个完整的现代 React 应用的所有交互场景。
新项目可以「按需 pick」—— 不需要全 install。
-->

---
transition: fade-out
---

# 安装：一站式 vs 单独包

Radix Primitives 的两种安装策略

<v-click>

```bash
# 推荐：一站式 monolith（tree-shakable）
pnpm add radix-ui

# 或：单独包（如果只用一两个）
pnpm add @radix-ui/react-dialog @radix-ui/react-popover
```

</v-click>

<v-click>

```tsx
// 一站式：import 简洁
import { Dialog } from "radix-ui";

// 单独包：通配 import
import * as Dialog from "@radix-ui/react-dialog";

// 两者等价，命名空间结构相同
<Dialog.Root><Dialog.Trigger /><Dialog.Content /></Dialog.Root>
```

</v-click>

<v-click>

> 💡 **推荐**：新项目用 `radix-ui` 一站式 —— 树摇优秀，import 体验更好。

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Radix 提供两种安装方式：

**一站式（推荐）**：
```bash
pnpm add radix-ui
```
- 一个包含所有原语的 monolith 包
- 完美 tree-shakable —— 你只用 Dialog，只打包 Dialog 代码
- import 体验最好（`import { Dialog, Popover } from "radix-ui"`）
- 版本统一 —— 不会出现 dialog 1.0 + popover 1.1 不匹配
- 这是 2024 Radix 团队推荐路径

**单独包**：
```bash
pnpm add @radix-ui/react-dialog
pnpm add @radix-ui/react-popover
```
- 每个原语独立 npm 包（共 30+ 个包）
- 早期 Radix 唯一方式
- 适合「只用一两个组件 + 想精确控制版本」场景
- 但版本管理麻烦 —— 30 个包升级要逐个升

[click] **import 模式**：

```tsx
// 一站式：命名空间 import
import { Dialog } from "radix-ui";

<Dialog.Root>
  <Dialog.Trigger asChild>
    <button>打开</button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>标题</Dialog.Title>
      <Dialog.Description>描述</Dialog.Description>
      <Dialog.Close />
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

```tsx
// 单独包：通配 import
import * as Dialog from "@radix-ui/react-dialog";

// 用法完全一致：Dialog.Root / Dialog.Trigger / Dialog.Content
```

两种 import 后的命名空间结构完全相同 —— 这是 Compound Components 模式的优雅。

[click] **推荐**：
- 新项目优先 `radix-ui` 一站式
- 老项目用单独包可以慢慢迁
- shadcn 默认安装的是单独包 —— 不影响功能，但版本升级要注意
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# Dialog — 最常用的原语

模态对话框 / 焦点陷阱 / ESC 关闭 / 滚动锁定

::left::

<v-click>

**完整 Anatomy**

```tsx
import { Dialog } from "radix-ui";

<Dialog.Root>
  <Dialog.Trigger asChild><button>打开</button></Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="overlay" />
    <Dialog.Content className="content">
      <Dialog.Title>编辑资料</Dialog.Title>
      <Dialog.Description>修改你的个人信息</Dialog.Description>
      {/* 表单内容 */}
      <Dialog.Close asChild><button>关闭</button></Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

</v-click>

::right::

<v-click>

**8 个子组件**

- `Root` / `Trigger` / `Portal`
- `Overlay` / `Content`
- `Title` （a11y 必需）/ `Description`
- `Close`

**键盘交互**

- Space / Enter：触发开关
- Esc：关闭（自动回焦 Trigger）
- Tab：焦点圈在 Content 内

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Dialog 是 Radix 最常用的原语之一，结构清晰：

**8 个子组件**：
- **Root**：状态管理（open / onOpenChange / defaultOpen / modal）
- **Trigger**：触发开关，自动绑定 onClick → toggle open
- **Portal**：把 Overlay + Content portal 到 document.body（避免 z-index 问题）
- **Overlay**：半透明遮罩层，覆盖背景
- **Content**：弹窗主体，焦点陷阱 + ESC 监听 + 滚动锁定都在这层
- **Title**：标题，**a11y 必需**（屏幕阅读器宣读）
- **Description**：描述，可选但推荐（提供上下文）
- **Close**：关闭按钮，自动绑定 onClick → set open false

**自动做了什么**：
- focus trap：Tab 只在 Content 内循环
- 焦点恢复：关闭时焦点回到 Trigger
- ESC 关闭：监听 keydown
- 滚动锁定：modal=true 时背景不滚
- 点击 Overlay 关闭：默认行为
- WAI-ARIA：role="dialog" + aria-modal + aria-labelledby（Title）+ aria-describedby（Description）

[click] **键盘 + 鼠标**：

- Space / Enter（在 Trigger 上）：打开
- Esc：关闭 + 焦点回 Trigger
- Tab / Shift+Tab：在 Content 焦点循环
- 点击 Overlay：默认关闭（可拦截 onPointerDownOutside）
- 点击 Close：关闭

**modal=false 时**：
- 不锁定滚动
- 不限制焦点
- 适合「侧边面板」「非阻断流程」场景

**控制 vs 非控**：
```tsx
// 非受控（默认）—— state 自管理
<Dialog.Root defaultOpen={false}>

// 受控 —— 你管 state
const [open, setOpen] = useState(false);
<Dialog.Root open={open} onOpenChange={setOpen}>
```

非受控适合简单场景，受控适合「外部 trigger / 嵌套表单 / 复杂逻辑」。

**Trigger 的 asChild**：
- `<Dialog.Trigger asChild><button>打开</button></Dialog.Trigger>`
- Radix 不渲染默认 button，而是把 onClick / aria 等绑到你的 button 上
- 用任何元素都行（Link / Image / 自定义按钮）

**AlertDialog 是 Dialog 的兄弟**：
- 同样 8 个子组件，多了 `AlertDialog.Action` 和 `AlertDialog.Cancel`
- 用于「确认删除 / 危险操作」—— 强意图，不能点 Overlay 关闭
- Esc 默认也不关（必须明确点 Cancel / Action）
-->

---
transition: fade-out
---

# DropdownMenu — 复杂菜单原语

支持 Checkbox / Radio / Submenu / Typeahead

<v-click>

```tsx
import { DropdownMenu } from "radix-ui";

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild><button>Options</button></DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content side="bottom" align="end">
      <DropdownMenu.Item onSelect={() => save()}>保存</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.CheckboxItem checked={bold} onCheckedChange={setBold}>
        <DropdownMenu.ItemIndicator>✓</DropdownMenu.ItemIndicator>
        粗体
      </DropdownMenu.CheckboxItem>
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>更多 →</DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent>
          <DropdownMenu.Item>导出</DropdownMenu.Item>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] DropdownMenu 是 Radix 最复杂的菜单原语，功能丰富：

**子组件清单**：
- Root / Trigger / Portal / Content
- Item / CheckboxItem / RadioGroup + RadioItem / ItemIndicator
- Sub / SubTrigger / SubContent（子菜单嵌套）
- Separator / Label
- Group / Arrow

**键盘交互**（遵循 WAI-ARIA Menu Button 模式）：
- Space / Enter（在 Trigger 上）：打开 + 焦点首项
- ArrowDown / ArrowUp：菜单内导航（roving tabindex）
- ArrowRight：进入子菜单
- ArrowLeft：返回父菜单
- Esc：关闭
- Home / End：跳首尾
- Typeahead：直接键入字母快速跳转匹配项

**核心特性**：
- **Sub menu** 嵌套：理论无限层，每层 collision-aware
- **CheckboxItem**：自带 indicator 槽位，checked 状态走 `data-state`
- **RadioGroup + RadioItem**：单选语义，自动管 group state
- **onSelect 默认阻止默认行为**：点击 item 关菜单 + 触发回调
- **onSelect(e) e.preventDefault()**：保持菜单开着（如多选场景）

**Content 定位 props**：
- `side`：top / right / bottom / left（默认 bottom）
- `align`：start / center / end（默认 start）
- `sideOffset` / `alignOffset`：微调距离
- `avoidCollisions`：默认 true，撞墙自动翻转
- `collisionPadding`：避碰安全距离
- `sticky`：粘在边缘还是飞走

**CSS 变量**（动画用）：
- `--radix-dropdown-menu-trigger-width`：trigger 宽度（用于做同宽下拉）
- `--radix-dropdown-menu-content-transform-origin`：origin-aware 缩放
- `--radix-dropdown-menu-content-available-height`：可用高度

**vs Select 区别**：
- DropdownMenu = 命令菜单（动作触发）
- Select = 值选择（表单组件，绑定 value）
- 两者键盘 / DOM 结构 / 语义都不同 —— 不要互相替代
-->

---
transition: fade-out
---

# Popover — 浮动面板原语

可放任意内容的浮动卡片

<v-click>

```tsx
import { Popover } from "radix-ui";

<Popover.Root>
  <Popover.Trigger asChild><button>设置</button></Popover.Trigger>
  <Popover.Portal>
    <Popover.Content side="bottom" align="center" sideOffset={8}>
      <h3>主题设置</h3>
      <label><input type="radio" name="theme" /> 亮色</label>
      <label><input type="radio" name="theme" /> 暗色</label>
      <Popover.Close>×</Popover.Close>
      <Popover.Arrow />
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
```

</v-click>

<v-click>

> 💡 **vs Tooltip / HoverCard**：Popover 点击触发，**可放交互内容**（按钮/输入/表单）；Tooltip 是悬停 + 纯文字（不可交互）；HoverCard 是悬停 + 卡片（可视但不可交互）。

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Popover 是浮动面板的「通用原语」 —— 任何「点击 trigger 弹出可交互卡片」场景都用它。

**子组件清单**：
- Root / Trigger / Portal / Content / Close / Arrow
- Anchor（可选，把 Content 定位锚点指到非 Trigger 的元素）

**核心特性**：
- **点击触发**（不是悬停 —— 那是 Tooltip / HoverCard）
- **可放任何内容**：按钮 / 输入框 / 表单 / 列表
- **焦点管理**：打开时焦点进入 Content，关闭时回 Trigger
- **collision detection**：撞墙自动翻转 / 偏移
- **modal=false 默认**：不锁定背景滚动，外部仍可交互

**Content props**：
- `side` / `align` / `sideOffset` / `alignOffset` —— 同 DropdownMenu
- `avoidCollisions` —— 默认 true
- `collisionPadding` / `collisionBoundary` —— 自定义碰撞边界
- `onOpenAutoFocus` —— 打开时焦点行为（默认聚焦 Content）
- `onCloseAutoFocus` —— 关闭时焦点行为（默认回 Trigger）
- `onEscapeKeyDown` / `onPointerDownOutside` —— 阻止默认关闭

**CSS 变量**：
- `--radix-popover-content-transform-origin`：origin-aware 缩放动画
- `--radix-popover-content-available-height` / `--radix-popover-content-available-width`
- `--radix-popover-trigger-width`：用于做「Content 同 Trigger 宽度」效果

[click] **vs Tooltip / HoverCard / DropdownMenu**：

| 组件 | 触发 | 内容 | a11y role |
| --- | --- | --- | --- |
| Popover | 点击 | 任何（可交互） | dialog |
| Tooltip | 悬停 + 焦点 | 纯文字 | tooltip |
| HoverCard | 悬停 | 卡片（不可交互） | (无) |
| DropdownMenu | 点击 | 菜单项 | menu |

四者外观可以很像，但语义和交互不同 —— **选错了 a11y 就废了**。

记忆口诀：
- 点击 + 表单/按钮 → Popover
- 悬停 + 短文 → Tooltip
- 悬停 + 卡片预览 → HoverCard
- 点击 + 命令列表 → DropdownMenu
-->

---
transition: fade-out
---

# Select — 表单下拉选择

支持 typeahead / virtual scroll / 大列表

<v-click>

```tsx
import { Select } from "radix-ui";

<Select.Root value={value} onValueChange={setValue}>
  <Select.Trigger>
    <Select.Value placeholder="选择城市..." />
    <Select.Icon>▼</Select.Icon>
  </Select.Trigger>
  <Select.Portal>
    <Select.Content position="popper" sideOffset={4}>
      <Select.Viewport>
        <Select.Group>
          <Select.Label>国内</Select.Label>
          <Select.Item value="bj">
            <Select.ItemText>北京</Select.ItemText>
            <Select.ItemIndicator>✓</Select.ItemIndicator>
          </Select.Item>
        </Select.Group>
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Select 是表单下拉，跟 DropdownMenu 看起来像但语义完全不同：

**子组件清单**：
- Root / Trigger / Value / Icon
- Portal / Content / Viewport
- Item / ItemText / ItemIndicator
- Group / Label / Separator
- ScrollUpButton / ScrollDownButton

**核心特性**：
- **表单语义**：role="combobox"（不是 menu），有 value/name 提交表单
- **typeahead**：键入字母快速匹配 item
- **virtual scroll**：大列表（1000+ 项）性能优秀
- **automatic positioning**：默认 `position="item-aligned"`（item 对齐 trigger），可换 `"popper"`（普通弹层）
- **键盘导航**：Up/Down/Home/End + 字母搜索

**Trigger / Value 关系**：
- Trigger 是按钮（不是 input）
- Value 是 placeholder + 当前选中文本的占位
- Icon 是箭头

**Item / ItemText / ItemIndicator 关系**：
- Item 是行容器（绑 value）
- ItemText 是显示文本（关键 —— Select 会读 ItemText 显示在 Trigger Value 上）
- ItemIndicator 是选中状态的指示（自动只在选中 item 上渲染）

**position="popper" vs "item-aligned"**：
- `"popper"`：普通弹层，下拉到 Trigger 下方
- `"item-aligned"`（默认）：选中 item 对齐 Trigger 中心（macOS 原生风格）

**a11y**：
- role="combobox" + aria-haspopup="listbox"
- 内部 Listbox 模式
- 屏幕阅读器读 Group Label / ItemText
- Esc 关闭 + Tab 提交焦点离开

**vs DropdownMenu**：
- Select 是「输入控件」—— 提交表单 / 绑定值
- DropdownMenu 是「命令菜单」—— 触发动作 / 不绑值
- DOM 不同：Select 内部是 Listbox，DropdownMenu 是 Menu
- 选错会让屏幕阅读器宣读错语义

**虚拟滚动**：
- 内置 ScrollUpButton / ScrollDownButton（无限滚动支持）
- 但「真正大数据」（10K+ 项）还是需要 react-window / virtual 配合 Item

**与 Combobox 关系**：
- Radix Primitives **没有内置 Combobox**（带搜索框的 Select）
- 需要 Combobox → 用 cmdk 库（shadcn 推荐）
- 或用 Ark UI 的 Combobox
-->

---
transition: fade-out
---

# Toast — 浮动通知

Provider + Viewport + Root，支持 swipe / hotkey

<v-click>

```tsx
import { Toast } from "radix-ui";

// App 根部
<Toast.Provider duration={4000} swipeDirection="right">
  <App />
  <Toast.Viewport className="viewport" />
</Toast.Provider>

// 业务代码
<Toast.Root open={open} onOpenChange={setOpen}>
  <Toast.Title>保存成功</Toast.Title>
  <Toast.Description>5 分钟后自动同步</Toast.Description>
  <Toast.Action altText="撤销" asChild><button>撤销</button></Toast.Action>
  <Toast.Close />
</Toast.Root>
```

</v-click>

<v-click>

> 💡 **使用模式**：业务一般用 `react-hot-toast` / `sonner` 或 shadcn `useToast` 包装层。Radix Toast 原语适合自建通知体系。

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Toast 是 Radix 唯一的「全局通知」原语：

**子组件清单**：
- Provider（包整个 app）
- Viewport（通知容器，fixed 定位区域）
- Root（单条通知）
- Title / Description / Action / Close

**Provider 全局配置**：
- `duration`：默认显示时长（默认 5000ms）
- `swipeDirection`：滑动关闭方向（right / left / up / down）
- `swipeThreshold`：滑动距离阈值

**Viewport hotkey**：
- 默认 F8 让屏幕阅读器用户聚焦到通知区
- a11y 友好设计

**Root**：
- 单条 Toast
- `open` + `onOpenChange` 受控
- `duration` 单独覆盖 Provider
- 支持 swipe（移动端友好）

**Action vs Close**：
- Action：操作按钮（撤销 / 详情 / 重试）—— `altText` 必填（屏幕阅读器替代文本）
- Close：关闭按钮（×）

**a11y**：
- role="status" 或 "alertdialog"（取决于 type）
- aria-live="off" + announce on close
- 不抢焦点（不打断用户操作）

[click] **真实业务推荐**：

虽然 Radix 提供了 Toast 原语，但生产中通常**不直接用** —— 因为：
1. 全局调用不方便（要手动管 open state）
2. 多条 Toast 队列管理麻烦
3. 美观样式需要大量 CSS

业务推荐：
- **sonner**（Emil Kowalski 出品，shadcn 默认推荐）—— 基于 Radix Toast，封装 imperative API
- **react-hot-toast**：另一选择，轻量
- **shadcn Toast**：基于 Radix Toast 的样式封装

调用方式：
```tsx
import { toast } from "sonner";

toast.success("保存成功", { description: "5 分钟后同步" });
```

直接用 Radix Toast 适合：
- 自建设计系统 + 自定义通知体系
- 不想引第三方包
- 需要深度定制

业务首选 sonner，省心。
-->

---
transition: fade-out
---

# Accordion — 折叠面板

single / multiple + collapsible + CSS 变量动画

<v-click>

```tsx
import { Accordion } from "radix-ui";

<Accordion.Root type="single" defaultValue="item-1" collapsible>
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>是否包邮？</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content className="content">满 99 包邮</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

</v-click>

<v-click>

```css
/* 用 CSS 变量做平滑高度动画 */
.content[data-state="open"] { animation: slideDown 200ms ease; }
.content[data-state="closed"] { animation: slideUp 200ms ease; }
@keyframes slideDown {
  from { height: 0 }
  to { height: var(--radix-accordion-content-height) }
}
```

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Accordion 是折叠面板，三个关键 props：

**Root 配置**：
- `type="single"`：只能开一个（默认 disclosure 模式）
- `type="multiple"`：可同时开多个
- `collapsible`（仅 single 时）：允许全部关闭（默认 false 时必须留一个开）
- `defaultValue` / `value`：当前打开项（受控/非受控）

**Item / Header / Trigger / Content** 四层结构：
- Item 是一组（绑 value）
- Header 是标题区（`<h3>` 语义包装）
- Trigger 是可点按钮
- Content 是展开内容

**键盘**：
- Space / Enter：切换 Item
- ArrowDown / ArrowUp：在 Trigger 间导航（roving tabindex）
- Home / End：跳首尾

[click] **CSS 变量动画 —— Radix 最招牌的特性**：

Radix Accordion Content 提供 CSS 变量：
- `--radix-accordion-content-height`：内容实际高度（JS 测量后写入）
- `--radix-accordion-content-width`：横向 Accordion 用

为什么需要这个？
- CSS height 不能用 `auto` 做 transition
- 你需要知道「目标高度」才能 animate
- Radix 用 ResizeObserver 测量 + 写到 CSS 变量

经典动画 CSS：
```css
.content { overflow: hidden; }
.content[data-state="open"] {
  animation: slideDown 200ms ease;
}
.content[data-state="closed"] {
  animation: slideUp 200ms ease;
}
@keyframes slideDown {
  from { height: 0 }
  to { height: var(--radix-accordion-content-height) }
}
@keyframes slideUp {
  from { height: var(--radix-accordion-content-height) }
  to { height: 0 }
}
```

这种「data-state + CSS 变量」模式是 Radix 的招牌 ——
所有 Overlay / Disclosure 原语都用同一套范式。

学一次受用所有原语。
-->

---
transition: fade-out
---

# Tabs / Slider / Tooltip 三件套

中频原语速览

<v-click>

```tsx
// Tabs
<Tabs.Root defaultValue="profile" orientation="horizontal">
  <Tabs.List>
    <Tabs.Trigger value="profile">资料</Tabs.Trigger>
    <Tabs.Trigger value="settings">设置</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="profile">资料</Tabs.Content>
  <Tabs.Content value="settings">设置</Tabs.Content>
</Tabs.Root>
```

</v-click>

<v-click>

```tsx
// Slider（range，多 thumb）
<Slider.Root defaultValue={[25, 75]} min={0} max={100} step={1}>
  <Slider.Track><Slider.Range /></Slider.Track>
  <Slider.Thumb /><Slider.Thumb />
</Slider.Root>

// Tooltip（hover 触发）
<Tooltip.Provider delayDuration={300}><Tooltip.Root>
  <Tooltip.Trigger asChild><button>?</button></Tooltip.Trigger>
  <Tooltip.Portal><Tooltip.Content>帮助文字</Tooltip.Content></Tooltip.Portal>
</Tooltip.Root></Tooltip.Provider>
```

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Tabs**：

- Root：状态容器（value / defaultValue / onValueChange）
- List：trigger 容器（roving tabindex）
- Trigger：标签按钮（每个绑 value）
- Content：对应内容面板

**Props**：
- `orientation="horizontal" | "vertical"`：方向（决定 Arrow 键含义）
- `activationMode="automatic" | "manual"`：focus 即激活 / 必须 Enter 激活
- `defaultValue` / `value`：受控/非受控

**键盘**：
- Tab：进入 List → 进入当前 Content
- ArrowLeft/Right（horizontal）或 Up/Down（vertical）：切换 trigger
- Home / End：跳首尾

[click] **Slider**：

- Root：滑块容器（defaultValue / min / max / step / orientation / inverted / minStepsBetweenThumbs）
- Track：轨道（背景条）
- Range：选中区段（自动填色）
- Thumb：可拖拽圆点（多个 → range slider）

**多 thumb**：
- `defaultValue={[25, 75]}` + 两个 `<Thumb />` → range slider
- `minStepsBetweenThumbs={5}` 强制 thumb 间距

**键盘**：
- Arrow：步进
- Shift+Arrow：大步进（10×）
- Home / End：min / max

**touch + drag**：内置移动端友好

**Tooltip**：

- Provider：全局配置（delayDuration / skipDelayDuration）
  - `delayDuration`：hover 多久后显示（默认 700ms）
  - `skipDelayDuration`：连续 hover 时快显（默认 300ms）
- Root：单个 tooltip
- Trigger：触发元素（hover + focus 都触发）
- Portal + Content：内容

**a11y**：
- role="tooltip"
- 自动 aria-describedby 绑定
- 屏幕阅读器读 Content 文本
- **不要放可交互内容** —— 用 Popover

**为什么需要 Provider**：
- 多个 Tooltip 共享延迟设置
- 鼠标连续滑过多个 trigger 时跳过延迟（skipDelayDuration）

**键盘**：
- focus trigger 即显示
- Esc 关闭
-->

---
transition: fade-out
---

# Compound Component 模式

Radix 首创 / 现代 React UI 库的事实标准

<v-click>

**核心**：组件拆成命名空间下的多个子组件，结构即组件

```tsx
<Dialog.Root>            {/* 状态容器 */}
  <Dialog.Trigger />     {/* 触发 */}
  <Dialog.Portal>        {/* 渲染到 body */}
    <Dialog.Overlay />
    <Dialog.Content>     {/* 主体 */}
      <Dialog.Title />
      <Dialog.Close />
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

</v-click>

<v-click>

**好处**：一次 import 拿全 / 结构即组件 / 不要的部件不写 / 类型自动推导

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Compound Component（复合组件）** —— Radix 把这个模式发扬光大：

**对比传统平铺**：
```tsx
// 传统平铺（v2 Chakra / 老式 Modal）
<Modal>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>标题</ModalHeader>
    <ModalBody>内容</ModalBody>
    <ModalFooter>底部</ModalFooter>
    <ModalCloseButton />
  </ModalContent>
</Modal>

// 需要 import 6 个名字：
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from "...";
```

```tsx
// Compound（Radix / v3 Chakra / shadcn）
<Dialog.Root>
  <Dialog.Trigger />
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title />
      <Dialog.Description />
      <Dialog.Close />
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

// 只 import 一个：
import { Dialog } from "radix-ui";
```

[click] **Compound 的实现原理**：

Radix 在 Root 创建一个 React Context（包含 open / setOpen / contentId / titleId 等），
Trigger / Content / Title 等子组件用 `useContext` 拿到状态和 ID 联通。

伪代码：
```tsx
const DialogContext = createContext({});

function Root({ children, ...props }) {
  const [open, setOpen] = useState(false);
  const ids = useGeneratedIds();
  return (
    <DialogContext.Provider value={{ open, setOpen, ids }}>
      {children}
    </DialogContext.Provider>
  );
}

function Trigger({ asChild, children }) {
  const { setOpen, ids } = useContext(DialogContext);
  return (
    <button
      aria-controls={ids.contentId}
      onClick={() => setOpen(o => !o)}
    >
      {children}
    </button>
  );
}
```

**好处全面**：
1. **import 简洁**：一次拿全
2. **结构清晰**：JSX 嵌套即组件层次（Dialog.Portal 在 Dialog.Root 里）
3. **灵活**：不要某个部件就不写（不要 Description？不写 Dialog.Description 即可）
4. **类型完整**：`<Dialog.X />` 自动补全
5. **a11y 自动**：Root 生成 ID，Title/Description/Content 自动 aria-labelledby/describedby

**广泛影响**：
- shadcn/ui 完全继承（Dialog.Root → DialogRoot 命名而已）
- Chakra UI v3 全面切换（Modal → Dialog.Root）
- Ark UI 同范式
- Mantine 部分组件（Combobox / Modal / Drawer）
- React 生态 2024+ 几乎所有现代 UI 库都用

Compound + asChild 这两个模式 —— Radix 是开山祖师。
-->

---
transition: fade-out
---

# Controlled vs Uncontrolled

Radix 的默认非受控哲学

<v-click>

```tsx
// 非受控（默认）—— Radix 自己管 state
<Dialog.Root defaultOpen={false}>...</Dialog.Root>

// 受控 —— 你管 state，外部按钮也能触发
const [open, setOpen] = useState(false);
<Dialog.Root open={open} onOpenChange={setOpen}>...</Dialog.Root>
<button onClick={() => setOpen(true)}>外部打开</button>
```

</v-click>

<v-click>

| 场景               | 选择   |
| ------------------ | ------ |
| 简单弹窗           | 非受控 |
| 外部按钮触发 / 表单提交后关闭 / 持久化 / URL 同步 | **受控** |

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Uncontrolled（非受控）是 Radix 的默认哲学**：

```tsx
<Dialog.Root defaultOpen={false}>
  ...
</Dialog.Root>
```

- Radix 内部用 `useState` 管 open 状态
- `defaultOpen` 是初始值（不能后续覆盖）
- 你只管 JSX 结构，不管 state
- Trigger 点击 → Radix 自动 toggle open
- Esc / Close 按钮 → Radix 自动设 false

**为什么非受控是默认？**
- 简单弹窗 90% 场景不需要外部控制
- 减少业务样板代码
- 用户用 React Hook Form / Zustand 等已经很多 state 了

[click] **Controlled（受控）—— 需要外部干预时**：

```tsx
const [open, setOpen] = useState(false);

<Dialog.Root open={open} onOpenChange={setOpen}>
  ...
</Dialog.Root>

// 现在能：
<button onClick={() => setOpen(true)}>从外部打开</button>
{success && <Effect onEffect={() => setOpen(false)} />}
```

- `open` + `onOpenChange` 同时存在 → 切换受控
- 你完全管 state
- Radix 仍处理键盘 / 焦点 / a11y

`onOpenChange` 触发时机：
- Trigger 点击
- Esc 按下
- Close 按钮点击
- 点击 Overlay
- 编程 set state（你自己改）

[click] **典型受控场景**：

1. **外部按钮触发**：
```tsx
<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Content>...</Dialog.Content>
</Dialog.Root>
// 没有 Dialog.Trigger，全靠 setOpen 控制
```

2. **表单提交后关闭**：
```tsx
const handleSubmit = async () => {
  await save();
  setOpen(false);  // 完成后关
};
```

3. **持久化**：
```tsx
const [open, setOpen] = useLocalStorage("settings-open", false);
```

4. **URL 同步**：
```tsx
const [open, setOpen] = useQueryState("editing");
// 关闭弹窗也清 URL
```

5. **嵌套依赖**：
```tsx
<ParentDialog onOpenChange={(parentOpen) => {
  if (!parentOpen) setChildOpen(false);  // 父关时子也关
}}>
```

**所有 Radix 原语都支持两种模式** ——
Dialog / Popover / DropdownMenu / Accordion / Tabs / Switch / Checkbox / Toggle 等都一致。
-->

---
transition: fade-out
---

# asChild prop —— Slot 模式

Radix 最有影响力的设计 / 2024+ 几乎所有 UI 库都借鉴

<v-click>

```tsx
// 不用 asChild：Radix 渲染默认 button
<Dialog.Trigger>打开</Dialog.Trigger>
// → <button>打开</button>

// 用 asChild：Radix 把行为绑到子元素
<Dialog.Trigger asChild>
  <button className="my-button">打开</button>
</Dialog.Trigger>
// → <button class="my-button">打开</button>（你的 button + Radix 绑定的 onClick / aria-*）
```

</v-click>

<v-click>

```tsx
// 适用任何元素 —— Link / Image / 自定义组件
<Dialog.Trigger asChild>
  <NextLink href="/profile">查看资料</NextLink>
</Dialog.Trigger>

// 自定义组件需 forwardRef + spread props
const MyButton = React.forwardRef((props, ref) =>
  <button ref={ref} {...props} />);
```

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **asChild prop —— Radix 最伟大的设计之一**：

**问题**：传统组件库强制渲染特定 DOM 元素：
```tsx
<Dialog.Trigger>打开</Dialog.Trigger>
// → 必须渲染 <button>
```

但如果你想：
- 用 `<a>` 而不是 button
- 用 Next.js `<Link>`
- 用自定义 `<MyButton>`
- 不要任何包装元素（透传到 children）

[click] **asChild 解决方案**：

```tsx
<Dialog.Trigger asChild>
  <MyButton>打开</MyButton>
</Dialog.Trigger>
```

**Radix 做了什么**：
1. **不渲染自己的 button**
2. **克隆 children**（你的 MyButton）
3. **把行为 props 合并到 child**：
   - onClick: () => setOpen(o => !o)
   - aria-haspopup: "dialog"
   - aria-expanded: state.open
   - data-state: state.open ? "open" : "closed"
   - ref: trigger ref（用于焦点 + 测量）

最终渲染：
```html
<button class="my-button" aria-haspopup="dialog" aria-expanded="false">
  打开
</button>
```

**关键要求**：
1. **唯一子节点**：`<Dialog.Trigger asChild>` 内必须只有一个 child element
2. **child 接受 props**：自定义组件必须 spread props 到 DOM
3. **child 转发 ref**：用 React.forwardRef

[click] **典型用法**：

```tsx
// Next.js Link
<Dialog.Trigger asChild>
  <Link href="/profile">查看资料</Link>
</Dialog.Trigger>
// 既是导航 link，又能 toggle dialog

// 自定义按钮
const MyButton = React.forwardRef(({ children, ...props }, ref) => (
  <button ref={ref} {...props} className="my-styled-button">
    <Icon />
    {children}
  </button>
));

<Dialog.Trigger asChild>
  <MyButton>打开</MyButton>
</Dialog.Trigger>

// Tooltip + Dialog 嵌套 asChild
<Tooltip.Root>
  <Tooltip.Trigger asChild>
    <Dialog.Trigger asChild>
      <button>悬停看 tip / 点击打开</button>
    </Dialog.Trigger>
  </Tooltip.Trigger>
  <Tooltip.Portal>...</Tooltip.Portal>
</Tooltip.Root>
// 一个 button 同时是 Tooltip 触发 + Dialog 触发
```

**asChild 影响**：

Radix 首创后，2024 几乎所有现代 React UI 库都借鉴：
- Chakra UI v3：完全引入 asChild
- shadcn/ui：继承 Radix 的 asChild
- Ark UI：同名同款
- Mantine：用类似的 `component` prop（不完全一样，但思路相通）

Slot 模式底层用 `@radix-ui/react-slot` 的 Slot 组件实现。
你也可以单独用 Slot 做自己的 polymorphic 组件。
-->

---
transition: fade-out
---

# data-state DOM 属性

Radix 把组件状态映射到 DOM —— CSS 直接写动画

<v-click>

```tsx
// Dialog 打开时（关闭时是 data-state="closed"，用于退场动画）
<Dialog.Content data-state="open">...</Dialog.Content>

// Accordion Item 展开
<Accordion.Item data-state="open">

// Checkbox 选中 / Tabs Trigger 激活
<Checkbox.Root data-state="checked">
<Tabs.Trigger data-state="active">
```

</v-click>

<v-click>

```css
/* 直接 CSS 选择器响应状态 */
.content[data-state="open"] {
  animation: slideIn 200ms cubic-bezier(.16,1,.3,1);
}
.content[data-state="closed"] {
  animation: slideOut 200ms ease-in;
}

/* Tailwind v4 用 data-* 选择器 */
<div className="data-[state=open]:animate-in data-[state=closed]:animate-out" />
```

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **data-state DOM 属性 —— Radix 样式系统的核心**：

Radix 把组件状态以 `data-*` 属性方式暴露到 DOM 上，CSS / Tailwind 直接选择：

**常见 data 属性**：
- `data-state`：组件状态
  - Dialog / Popover / DropdownMenu / Tooltip / HoverCard：`"open" | "closed"`
  - Accordion / Collapsible：`"open" | "closed"`
  - Checkbox：`"checked" | "unchecked" | "indeterminate"`
  - Switch / Toggle：`"checked" | "unchecked"`
  - Tabs Trigger / Item：`"active" | "inactive"`
- `data-orientation`：方向（`"horizontal" | "vertical"`）—— Tabs / Slider / Toolbar 等
- `data-side`：定位方向 —— Popover / DropdownMenu / Tooltip Content 上
  - `"top" | "right" | "bottom" | "left"`（碰撞后会动态变化）
- `data-align`：对齐 —— `"start" | "center" | "end"`
- `data-disabled`：禁用态
- `data-highlighted`：菜单项当前 focus 项

[click] **为什么用 data-* 而不是 className？**

1. **CSS / Tailwind 都能选**：`[data-state="open"]` 跨方案兼容
2. **不污染 className**：你的 className 仍是你自己的
3. **JS DOM 也能读**：`element.dataset.state` 调试方便
4. **a11y 友好**：跟 aria-* 一类思路

**CSS 选择器写法**：
```css
.content[data-state="open"] { ... }
.content[data-state="closed"] { ... }
.content[data-side="top"] { transform-origin: bottom; }
.content[data-side="bottom"] { transform-origin: top; }
```

[click] **Tailwind v4 用 data-* 选择器**：

```tsx
<Dialog.Content
  className={`
    data-[state=open]:animate-in
    data-[state=open]:fade-in-0
    data-[state=closed]:animate-out
    data-[state=closed]:fade-out-0
    data-[side=top]:slide-in-from-bottom-2
  `}
/>
```

shadcn/ui 大量用这种语法 —— 你看 shadcn Dialog 源码全是 `data-[state=open]:...`。

**配合 tailwindcss-animate 插件**：
- `animate-in` / `animate-out`：进退场基础类
- `fade-in-0` / `fade-out-0`：透明度
- `zoom-in-95` / `zoom-out-95`：缩放
- `slide-in-from-top-2` / `slide-out-to-top-2`：滑入滑出

这些插件配合 Radix data-state 是 shadcn/ui 动画的全部秘密。

**手写 CSS 也优雅**：
```css
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
.content[data-state="open"] { animation: slideIn 200ms ease; }
```

Radix 的 unmount 时机：
- 退场动画结束后，Radix 才 unmount Content
- 由 `data-state="closed"` 触发 CSS 动画，结束后 DOM 移除
- 不需要你管 mount/unmount，CSS 决定时长
-->

---
transition: fade-out
---

# CSS 变量动画 —— Origin-Aware

Radix 提供 CSS 变量，做出「从触发点弹出」效果

<v-click>

```tsx
// Popover 提供这些 CSS 变量
--radix-popover-content-transform-origin
--radix-popover-content-available-width
--radix-popover-content-available-height
--radix-popover-trigger-width

// DropdownMenu / HoverCard / Tooltip / ContextMenu 同名
--radix-dropdown-menu-content-transform-origin
--radix-hover-card-content-transform-origin
```

</v-click>

<v-click>

```css
.PopoverContent {
  transform-origin: var(--radix-popover-content-transform-origin);
}
.PopoverContent[data-state="open"] {
  animation: scaleIn 150ms cubic-bezier(.16,1,.3,1);
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(.96); }
  to { opacity: 1; transform: scale(1); }
}
/* 现在 Popover 从「靠近 Trigger 的一角」缩放出现 —— 不是几何中心 */
```

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **CSS 变量 —— Radix 的另一个杀手特性**：

**问题**：Popover / DropdownMenu / Tooltip 默认缩放动画从几何中心展开 ——
但用户期望「从靠近触发点的一角弹出」（更符合直觉）。

**Radix 解决方案**：动态计算 `transform-origin` 并写到 CSS 变量。

Radix 测量碰撞后的 Content 位置，根据 `side` + `align` 计算合适的 origin：
- side="bottom" align="start" → transform-origin: top left
- side="bottom" align="end" → transform-origin: top right
- side="top" align="center" → transform-origin: bottom center
- ...

把结果写到：
```
--radix-popover-content-transform-origin: top left;
```

[click] **使用方式**：

```css
.PopoverContent {
  transform-origin: var(--radix-popover-content-transform-origin);
}
.PopoverContent[data-state="open"] {
  animation: scaleIn 150ms cubic-bezier(.16,1,.3,1);
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(.96); }
  to { opacity: 1; transform: scale(1); }
}
```

效果：
- side="bottom" → 从顶部弹出（origin 在顶部）
- side="top" → 从底部弹出
- 碰撞后翻转方向，origin 也自动跟着翻

**其他常用 CSS 变量**：

```css
/* 让 Content 和 Trigger 同宽 */
.DropdownMenuContent {
  width: var(--radix-dropdown-menu-trigger-width);
  max-height: var(--radix-dropdown-menu-content-available-height);
}
```

`--radix-*-content-available-height` 是「Content 距离屏幕边缘的可用高度」 ——
做长列表时用 max-height 防止超出视口。

**所有支持碰撞检测的原语都有这套变量**：
- Popover
- DropdownMenu
- ContextMenu
- HoverCard
- Tooltip
- Menubar
- NavigationMenu

变量名结构：`--radix-{primitive}-content-{property}`

**Tailwind 配合**：
shadcn 在 globals.css 直接用：
```css
@layer base {
  [data-radix-popper-content-wrapper] {
    --radix-popover-content-transform-origin: var(--radix-popper-transform-origin);
  }
}
```

这套 origin-aware 动画是 macOS Sonoma / iOS 弹层的「教科书级」复刻。
Radix 把它做成了 CSS 变量 —— 用户只用写 CSS，不用懂数学。
-->

---
transition: fade-out
---

# 键盘导航 —— WAI-ARIA 全遵从

Radix 最大的 a11y 招牌

<v-click>

| 原语                 | 键盘交互                                                       |
| -------------------- | -------------------------------------------------------------- |
| Dialog               | Esc 关闭 / Tab 焦点循环 / Space+Enter 触发                     |
| DropdownMenu / Select | Arrow 导航 / Enter 选择 / typeahead / Esc 关闭                |
| Tabs                 | ArrowLeft/Right 切换 / Home+End / 自动 vs 手动激活             |
| Accordion            | Space+Enter 切换 / ArrowDown/Up 在 Trigger 间走                |
| Slider               | Arrow 步进 / Shift+Arrow 大步进 / Home+End                     |
| RadioGroup / Checkbox | Arrow 切换 (roving tabindex) / Space 切换 + 三态              |

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **键盘导航 —— Radix 的灵魂**：

Radix 严格遵循 WAI-ARIA Authoring Practices Guide（APG）的所有 patterns：

**Dialog（dialog pattern）**：
- 焦点陷阱：Tab/Shift+Tab 只在 Content 内
- Esc 关闭
- Trigger Space/Enter 打开
- 关闭时焦点回 Trigger

**DropdownMenu（menu pattern with menubutton）**：
- Space/Enter（Trigger）：打开 + 焦点首项
- ArrowDown/Up：roving tabindex 导航
- ArrowRight：进子菜单
- ArrowLeft：返回父菜单
- typeahead：键入字母快速跳转匹配项
- Esc：关闭 + 焦点回 Trigger
- Home/End：跳首尾

**Select（combobox/listbox pattern）**：
- 不是 menu —— 是 combobox（表单语义）
- Space/Enter 打开
- Arrow 导航 + 选中（automatic）
- typeahead
- Esc 关闭 + 取消
- Tab 提交并关闭

**Tabs（tabs pattern with roving tabindex）**：
- ArrowLeft/Right（horizontal）或 Up/Down（vertical）：切换 Trigger
- activationMode="automatic"：focus 即激活（默认）
- activationMode="manual"：focus 后必须 Enter 激活
- Home/End：跳首尾

**Accordion（disclosure pattern）**：
- Space/Enter：切换
- ArrowDown/Up：在 Trigger 间走（不是激活，只是 focus）
- Home/End：首尾

**Slider（slider pattern）**：
- Arrow：步进（step）
- Shift+Arrow：大步进（10×step）
- Home/End：min/max
- PageUp/Down：跳大段

**RadioGroup（radio pattern with roving tabindex）**：
- Arrow：切换 + 激活
- Tab 进入 RadioGroup → 当前选中项
- 不需要 Tab 在多个 radio 间走（roving）

**Checkbox**：
- Space：toggle
- 三态支持（checked / unchecked / indeterminate）

**roving tabindex 是关键概念**：
- 一组项目只有一个 tabindex=0（可 Tab 到）
- 其他 tabindex=-1（只能 Arrow 到）
- 防止 Tab 在 20 个 menu item 间地狱循环
- DropdownMenu / Menubar / RadioGroup / Tabs / Toolbar 都用

Radix 把所有这些 a11y 模式实现到位 ——
你只用写 JSX 结构，键盘交互全部白送。

这就是「Radix Primitives 的核心价值」 ——
不是漂亮，是「a11y 做得完美 + 永远跟标准同步」。
-->

---
transition: fade-out
---

# Radix Themes 体系

完整设计系统 / Theme + Layout + Form + Typography

<v-click>

```tsx
import { Theme, Flex, Heading, Button, TextField } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

<Theme accentColor="violet" grayColor="slate" radius="medium" scaling="100%">
  <Flex direction="column" gap="4" p="6">
    <Heading size="6">登录</Heading>
    <TextField.Root placeholder="邮箱">
      <TextField.Slot>📧</TextField.Slot>
    </TextField.Root>
    <Button size="3" variant="solid">提交</Button>
  </Flex>
</Theme>
```

</v-click>

<v-click>

**4 个核心 Theme props**

- `accentColor`：主色（30 种：blue / violet / mint / crimson / ...）
- `grayColor`：灰阶（gray / mauve / slate / sage / olive / sand）
- `radius`：圆角（none / small / medium / large / full）
- `scaling`：整体缩放（90% / 95% / 100% / 105% / 110%）

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Radix Themes —— 开箱即用的设计系统**：

跟 Primitives 完全不同的产品 —— Themes 提供完整 UI 组件 + 内置样式。

**安装**：
```bash
pnpm add @radix-ui/themes
```

**3 步上手**：
1. import 样式：`import "@radix-ui/themes/styles.css"`
2. 包 `<Theme>`：根节点配置 4 个 props
3. 用组件：Flex / Button / Heading 等

**Theme 配置 4 个 props 改变一切**：
- accentColor：主色（覆盖所有 Button / Link / focus 等）
- grayColor：灰阶（背景 / 文字 / 边框基调）
- radius：圆角风格
- scaling：整体大小（90%-110%，类似 system zoom）

[click] **30 种 accentColor**：

亮色系：tomato / red / ruby / crimson / pink / plum / purple / violet / iris / indigo / blue / cyan / teal / jade / green / grass / brown / orange / amber / yellow / lime / mint / sky

灰色系（作 gray）：gray / mauve / slate / sage / olive / sand

每个色都有「亮色 + 暗色」+「P3 + sRGB」+「Alpha 变体」 ——
Radix Themes 自动按 `prefers-color-scheme` 切换。

**6 个 grayColor 风格**：
- gray：纯灰（最中性）
- mauve：偏紫灰（暖色调）
- slate：偏蓝灰（科技感）
- sage：偏绿灰（自然）
- olive：偏黄灰（复古）
- sand：偏橙灰（暖意）

设计师常用 mauve / slate / sage 作 grayColor —— 比纯 gray 有「温度」。

**5 档 radius**：
- none：方角（极简）
- small：4px（默认现代风）
- medium：8px（柔和）
- large：12px（圆润）
- full：胶囊（pill）

**5 档 scaling**：90% / 95% / 100% / 105% / 110%
- 整体放缩所有 padding / font-size / spacing
- 不影响绝对值，全是相对单位
- 适合「同样代码做手机 / iPad / 桌面三套」

**Theme 嵌套**：
```tsx
<Theme accentColor="violet">
  <App />
  <Theme accentColor="crimson" asChild>
    <ErrorPanel />
  </Theme>
</Theme>
// 局部覆盖 accentColor
```

跟其他 UI 库对比：
- 比 Mantine：accentColor / grayColor 一改全换皮，比 Mantine 的 theme override 简单
- 比 MUI：不需要 createTheme(),没有 PaletteOptions 的复杂度
- 比 Chakra v3：不需要 createSystem(),四个 props 搞定
- 适合「快速搭后台 / 不写 CSS / 默认风格够用」场景
-->

---
transition: fade-out
---

# Radix Themes Layout 五件套

Box / Flex / Grid / Container / Section 统一 props

<v-click>

```tsx
<Container size="3">         {/* 限制最大宽度 */}
  <Section size="2">         {/* 上下大间距 */}
    <Flex direction="column" gap="4" align="start" justify="between">
      <Box p="4" width="200px" style={{ background: 'var(--gray-2)' }}>
        Box 是通用容器
      </Box>
      <Grid columns="3" gap="3" width="auto">
        <Box>A</Box><Box>B</Box><Box>C</Box>
      </Grid>
    </Flex>
  </Section>
</Container>
```

</v-click>

<v-click>

**共享 props**：spacing（p/m/px/py/...）、sizing（width/height/min/max）、position、flexbox（flexBasis/flexGrow/...）、grid（gridColumn/...）

响应式语法：`gap={{ initial: "2", md: "4" }}`

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Layout Primitives —— Themes 的布局五件套**：

5 个核心 Layout 组件：
- **Box**：通用容器（div）—— 任何场景都能用
- **Flex**：flexbox 容器
- **Grid**：CSS Grid 容器
- **Container**：限制最大宽度（content max-width）
- **Section**：上下大间距（垂直节奏控制）

**共享 props（统一 API）**：
- 间距：p / px / py / pt / pr / pb / pl / m / mx / my / mt / mr / mb / ml
- 尺寸：width / height / minWidth / maxWidth / minHeight / maxHeight
- 定位：position / inset / top / right / bottom / left
- Flexbox：flexBasis / flexGrow / flexShrink / flexDirection / flexWrap
- Grid：gridColumn / gridRow / gridArea
- 边距 gap：gap / gapX / gapY

[click] **Flex 专有 props**：
- direction：row / column / row-reverse / column-reverse
- align：start / center / end / baseline / stretch
- justify：start / center / end / between
- gap：spacing scale 数字

**Grid 专有 props**：
- columns：列数（"3"）或模板（"1fr 2fr"）
- rows：行数
- flow：row / column / row-dense / column-dense

**Container 专有**：
- size="1" → max-width: 448px
- size="2" → max-width: 688px
- size="3" → max-width: 880px（默认）
- size="4" → max-width: 1136px

**Section 专有**：
- size="1" → 24px 上下 padding
- size="2" → 64px（默认）
- size="3" → 144px
- size="4" → 224px

**响应式语法**：
```tsx
<Flex gap={{ initial: "2", sm: "3", md: "4", lg: "6" }} />
```
- initial：默认（所有断点之前）
- xs / sm / md / lg / xl：5 个断点
- 自动生成 CSS media query

**Spacing Scale**（共享）：
- "1" = 4px, "2" = 8px, "3" = 12px, "4" = 16px, "5" = 24px, "6" = 32px
- "7" = 40px, "8" = 48px, "9" = 64px

**vs Tailwind / Chakra**：
- Chakra：m={4} 用绝对值
- Tailwind：p-4 用 spacing scale
- Themes：p="4" 同时是 scale 又是 prop，介于两者间

Layout primitives 是 Themes 的核心 ——
所有页面都是 Container > Section > Flex/Grid 堆叠出来。
-->

---
transition: fade-out
---

# Radix Themes Form 组件

TextField / Select / Checkbox / Switch / RadioGroup / Slider

<v-click>

```tsx
// TextField with icon
<TextField.Root placeholder="搜索...">
  <TextField.Slot side="left">🔍</TextField.Slot>
  <TextField.Slot side="right">
    <IconButton size="1" variant="ghost">×</IconButton>
  </TextField.Slot>
</TextField.Root>

// Checkbox / Switch / Slider 简洁绑值
<Checkbox checked={c} onCheckedChange={setC} />
<Switch checked={s} onCheckedChange={setS} />
<Slider defaultValue={[20, 80]} max={100} step={1} />
```

</v-click>

<v-click>

**共享 props**：size（1/2/3）/ variant（classic/surface/soft）/ color / radius —— 跟 Theme 联动

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Themes Form 组件 —— 完整表单体系**：

**TextField**（Root + Slot 模式）：
- TextField.Root 是 wrapper
- TextField.Slot 是图标 / 按钮槽位（左/右）
- props：placeholder / value / size / variant / color / radius
- 3 种 variant：
  - "surface"：默认，浅色背景 + 边框
  - "classic"：深色边框 + 阴影
  - "soft"：纯背景无边框
- 3 档 size：1（紧凑）/ 2（默认）/ 3（大）

**TextArea**：
- 同 TextField props
- size + variant + color 一致

**Select**（Themes 自封装，底层用 Radix Select Primitive）：
- Select.Root / Trigger / Content / Item / Group / Label
- 自带样式，不需要 Portal（Themes 默认 portal）
- placeholder + value + onValueChange

**Checkbox**（同 Primitive 风格）：
- `<Checkbox checked={c} onCheckedChange={setC} />`
- color 绑定 Theme.accentColor

**RadioGroup**：
- `<RadioGroup.Root value defaultValue onValueChange>`
- `<RadioGroup.Item value="a">`

**Switch**：
- `<Switch checked={c} onCheckedChange={setC} />`
- size / variant / color / radius

**Slider**：
- `<Slider defaultValue={[50]} max={100} step={1} />`
- 多 thumb：defaultValue=[20, 80]

[click] **共享 props 联动 Theme**：

所有 Form 组件都接受：
- `size`："1" | "2" | "3"
- `variant`：自身的 variant 体系
- `color`：覆盖 Theme.accentColor（按需）
- `radius`：覆盖 Theme.radius

Theme 全局设默认 → 单组件可覆盖。

**Form 完整示例**：
```tsx
<form onSubmit={handleSubmit}>
  <Flex direction="column" gap="3">
    <label>
      <Text size="2" weight="bold">邮箱</Text>
      <TextField.Root type="email" required />
    </label>
    <label>
      <Text size="2" weight="bold">密码</Text>
      <TextField.Root type="password" required />
    </label>
    <Flex gap="2" mt="2">
      <Button type="submit" variant="solid">登录</Button>
      <Button variant="soft">取消</Button>
    </Flex>
  </Flex>
</form>
```

**没有内置表单状态**：
- Themes 不包含表单状态管理
- 配合 React Hook Form / TanStack Form
- 或用 Radix Form Primitive（独立包 `@radix-ui/react-form`）做校验

**与 Primitives 关系**：
- Themes Form 组件部分基于 Primitives（Select / Checkbox / Switch / RadioGroup / Slider）
- 但 TextField / TextArea 是 Themes 独有（HTML input/textarea 包装）
- Themes 不引入新的 a11y 行为，只是样式 + props 简化
-->

---
transition: fade-out
---

# Radix Themes Typography

Heading / Text / Code / Em / Strong / Link / Quote / Blockquote

<v-click>

```tsx
<Heading size="9" weight="bold">巨型标题</Heading>
<Heading size="6">页面标题</Heading>

<Text size="3" color="gray">正文 size 3 是默认</Text>
<Code size="2" variant="soft" color="violet">npm install</Code>
<Link href="#" underline="hover">链接</Link>
<Em>斜体</Em> + <Strong>加粗</Strong> + <Blockquote>引用块</Blockquote>
```

</v-click>

<v-click>

**props**：size（1-9）/ weight / color / align / trim / wrap / truncate / `trim="both"` 修剪上下空白做精确对齐

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Themes Typography —— 排版组件**：

**Heading**：
- `<Heading as="h1">` 选择渲染元素
- size 1-9（9 是最大）
- weight：light / regular / medium / bold
- color：跟 Theme.accentColor 联动
- align：left / center / right
- trim：none / start / end / both（修剪首尾空白）

**Text**：
- `<Text as="p">` 或 `<Text as="span">` 等
- size 1-9（默认 size="3"）
- weight / color / align / trim / wrap / truncate

**Code**：
- 行内代码块（< code >）
- variant：classic / surface / soft / outline / ghost
- size / color / weight

**Em / Strong**：
- 语义化斜体 / 加粗
- 等同于 <em> / <strong>

**Link**：
- href / size / color / underline
- underline：auto / always / hover / none

**Blockquote**：
- 引用块（< blockquote >）
- size 1-9

**Kbd**：
- 键盘按键样式（`<Kbd>⌘K</Kbd>`）

[click] **特别 props**：

**trim**（核心独家）：
- "none"：不修剪（默认）
- "start"：修剪顶部空白
- "end"：修剪底部空白
- "both"：修剪上下

为什么需要？字体本身有 line-height 留白 —— 但精确设计稿要求「文字真实占位」对齐。
trim 用 CSS leading-trim 属性实现（现代浏览器支持）。

**truncate**：超长文本截断（... 省略号）
**wrap**：是否换行（nowrap / pretty / balance）

**color 选项（30+）**：
- 跟 Theme.accentColor 同源
- 单独组件可覆盖：`<Text color="crimson">`

**size 体系**：
- size="1" = 12px
- size="2" = 14px
- size="3" = 16px（默认）
- size="4" = 18px
- size="5" = 20px
- size="6" = 24px
- size="7" = 28px
- size="8" = 35px
- size="9" = 60px

跟 Tailwind / Chakra 对应：
- Tailwind text-xs/sm/base/lg/xl/2xl/3xl/4xl/5xl
- Chakra fontSize "xs"-"6xl"
- Themes size "1"-"9"

**响应式**：
```tsx
<Heading size={{ initial: "5", sm: "6", md: "7" }} />
```

**与 Tailwind 共存**：
Themes Typography 用 CSS 变量，你可以 Tailwind className 覆盖 ——
但建议「要么全 Themes 要么全 Tailwind」，混用容易乱。
-->

---
transition: fade-out
---

# Radix Colors —— 12 阶语义化色阶

每个色都精心定义 12 步用途，APCA 对比度通过

<v-click>

| 阶段     | 用途                                    |
| -------- | --------------------------------------- |
| **1-2**  | 背景层：App background / Subtle bg      |
| **3-5**  | UI 元素背景：default / hover / active   |
| **6-8**  | 边框层：subtle / UI / focus 环          |
| **9-10** | **Solid 背景**（饱和最高）：Primary 按钮 / hover |
| **11**   | Low-contrast 文字（APCA Lc 60）         |
| **12**   | High-contrast 文字（APCA Lc 90）        |

</v-click>

<v-click>

```css
.button-primary { background: var(--violet-9); }
.card { background: var(--gray-2); border: 1px solid var(--gray-6); color: var(--gray-12); }
```

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Radix Colors 12 阶 —— 设计系统色彩的金标准**：

每个色阶都有 12 步，每步对应**具体的 UI 用途** ——
设计师 / 工程师不再「选哪个颜色」，而是「这个 UI 元素该用第几阶」。

**1-2 阶 → 背景层**：
- 1：App 整体背景（如 #FCFCFD 浅 / #161618 深）
- 2：略深一点（卡片 / 段落区分）

**3-5 阶 → UI 元素背景层**：
- 3：默认元素（输入框背景 / 普通按钮 soft 变体）
- 4：hover 态
- 5：active / selected 态

**6-8 阶 → 边框层**：
- 6：subtle border（非交互元素 / 卡片边框）
- 7：UI border（输入框边框）
- 8：hover border / focus 环

**9-10 阶 → Solid 背景**（饱和最高）：
- 9：Primary 按钮 / 重要图标 / 主标题背景
  - **整个 12 阶中色彩最饱和** —— 也是「品牌色锚点」
- 10：9 阶的 hover 态（更深一点）

**11-12 阶 → 文字层**：
- 11：低对比度文字（次要 / 描述 / 辅助文字）—— 保证 APCA Lc 60
- 12：高对比度文字（主要 / 标题 / 重要内容）—— 保证 APCA Lc 90

**APCA 是什么？**
- Accessible Perceptual Contrast Algorithm
- WCAG 3.0 候选标准
- 比传统 4.5:1 算法更准确（考虑人眼非线性）
- Radix 保证 11/12 阶在 2 阶背景上的 Lc 值达标

**实际用法（CSS Variables）**：
```css
.button-primary {
  background: var(--violet-9);
  color: white;
}
.button-primary:hover {
  background: var(--violet-10);
}
.card {
  background: var(--gray-2);
  border: 1px solid var(--gray-6);
  color: var(--gray-12);
}
.card .description {
  color: var(--gray-11);
}
```

**Light / Dark 自动切换**：
- 引入 Light 和 Dark 两套 CSS（自动 :root / .dark-theme）
- 同一变量名 `--gray-9` 自动跟随 mode
- 不需要 JS 切换 —— CSS 自己搞

**30+ 色阶**：
- Gray 系 6 个：gray / mauve / slate / sage / olive / sand
- Color 系 24 个：tomato / red / ruby / crimson / pink / plum / purple / violet / iris / indigo / blue / cyan / teal / jade / green / grass / brown / orange / amber / yellow / lime / mint / sky / black / white

**Alpha 变体**：
- 每个色都有 alpha 版本（如 `--violet-a9`）
- 用于「在彩色背景上叠加」—— alpha 比纯色叠加更自然

**P3 广色域**：
- `display-p3` 色域支持
- 苹果设备 + 现代屏幕显示更鲜艳
- 自动检测 fallback 到 sRGB
-->

---
transition: fade-out
---

# Tailwind v4 集成

Radix + Tailwind = shadcn 模式的核心

<v-click>

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --animate-in: enter 200ms ease-out;
  --animate-out: exit 150ms ease-in;
}
@keyframes enter { from { opacity: 0; transform: scale(.95) } }
@keyframes exit { to { opacity: 0; transform: scale(.95) } }
```

</v-click>

<v-click>

```tsx
// JSX 用 data-[state=*] 选择器
<DropdownMenu.Content className="
  bg-white rounded-md shadow-lg p-1
  data-[state=open]:animate-in data-[state=open]:fade-in-0
  data-[state=closed]:animate-out
  data-[side=top]:slide-in-from-bottom-2
  data-[side=bottom]:slide-in-from-top-2
" />
```

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Tailwind v4 + Radix Primitives —— 当代 React UI 黄金搭档**：

Tailwind v4 在 2024+ 大改：
- 配置从 tailwind.config.js → CSS 内的 @theme
- 支持原生 CSS Layers + Cascade Layers
- 更快的 JIT
- 内置容器查询（@container）

**配合 Radix 的关键点**：

1. **data-* 选择器**：Tailwind v4 原生支持 `data-[state=open]:bg-violet-9`
2. **CSS 变量**：直接用 Radix Colors 变量 `bg-[--violet-9]`
3. **tailwindcss-animate 插件**：把 enter/exit 动画封装成 utility class

```bash
pnpm add -D tailwindcss-animate
```

[click] **典型 shadcn 模式 className**：

```tsx
<Dialog.Content
  className="
    fixed left-[50%] top-[50%] z-50
    grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%]
    gap-4 border bg-background p-6 shadow-lg
    duration-200
    data-[state=open]:animate-in
    data-[state=open]:fade-in-0
    data-[state=open]:zoom-in-95
    data-[state=open]:slide-in-from-left-1/2
    data-[state=open]:slide-in-from-top-[48%]
    data-[state=closed]:animate-out
    data-[state=closed]:fade-out-0
    data-[state=closed]:zoom-out-95
    rounded-lg
  "
>
```

这段 className 是 shadcn Dialog 的标准写法 ——
完整覆盖：位置 / 大小 / 边框 / 阴影 / 进退场动画 / 缩放 / 滑入 / 状态选择。

**`data-[*=*]:*` 语法解读**：
- `data-[state=open]`：只在 data-state="open" 时生效
- `data-[side=top]`：只在 data-side="top" 时生效
- 跟 hover / focus 一样的 Tailwind variant 机制

**tailwindcss-animate utilities**：
- animate-in / animate-out：基础进退场
- fade-in-0 / fade-out-0：opacity 0 起点
- zoom-in-95 / zoom-out-95：scale 0.95 起点
- slide-in-from-top-2 / slide-out-to-top-2：translate Y
- spin-in-180：rotate

**自定义动画时长**：
```tsx
<Dialog.Content className="duration-200" />  // 全局 200ms
```

**新项目搭建顺序**：
1. `pnpm add radix-ui @radix-ui/themes`（看用哪个）
2. `pnpm add -D tailwindcss tailwindcss-animate`
3. globals.css 引入 + @theme 配置
4. components/ui/ 放 wrapper
5. 业务代码直接用 wrapper

shadcn CLI 一键完成 1-4，但你也能手工搭。
-->

---
transition: fade-out
---

# Next.js App Router 集成

SSR / Server Components / 客户端水合

<v-click>

```tsx
// app/layout.tsx (Server Component)
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Theme accentColor="violet" grayColor="slate">{children}</Theme>
      </body>
    </html>
  );
}
```

</v-click>

<v-click>

```tsx
// 涉及 state 的组件加 "use client"
"use client";
import { Dialog } from "radix-ui";
export function MyDialog() {
  return <Dialog.Root><Dialog.Trigger>打开</Dialog.Trigger>...</Dialog.Root>;
}
```

</v-click>

<v-click>

> 💡 **suppressHydrationWarning**：next-themes 切主题时避免 hydration 警告。

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Next.js App Router 集成 —— Radix 与 RSC 配合**：

Next.js 15+ App Router 是 React 全栈的事实标准。Radix 完全兼容 RSC。

**配置 layout.tsx**（Server Component）：
```tsx
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Theme accentColor="violet">{children}</Theme>
      </body>
    </html>
  );
}
```

**关键点**：
- `<Theme>` 在 Server 端渲染（不带 state）—— OK
- `suppressHydrationWarning`：next-themes 切主题时 html 类名变化，避免 hydration mismatch 警告
- 全局 CSS 一定要在 layout 引入

[click] **客户端组件 ("use client")**：

涉及 state 的 Radix 组件（Dialog / Popover / Menu / Tabs 等）必须在 client component：

```tsx
"use client";
import { Dialog } from "radix-ui";

export function MyDialog({ children }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>打开</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content>{children}</Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

**最佳实践 —— 把 Radix 包成 client component**：
```tsx
// components/dialog-wrapper.tsx
"use client";
export { Dialog, DialogTrigger, DialogContent } from "./Dialog";

// 业务 page.tsx（Server）
import { Dialog } from "@/components/dialog-wrapper";
// 业务页可以是 Server，只在使用 Dialog 时 client boundary
```

[click] **next-themes 集成（dark mode）**：

```bash
pnpm add next-themes
```

```tsx
// app/providers.tsx
"use client";
import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Theme>{children}</Theme>
    </ThemeProvider>
  );
}
```

```tsx
// app/layout.tsx
import { Providers } from "./providers";

<html suppressHydrationWarning>
  <body>
    <Providers>{children}</Providers>
  </body>
</html>
```

**Radix Themes 自带 dark mode**：
- `.dark` 或 `[data-theme="dark"]` 切换
- 自动应用所有 Radix Colors 变量
- next-themes 配合 attribute="class"

**Server Actions + Dialog**：
```tsx
"use client";
const [open, setOpen] = useState(false);

async function deleteItem(id: string) {
  await fetch(`/api/items/${id}`, { method: "DELETE" });
  setOpen(false);
}

<AlertDialog.Root open={open} onOpenChange={setOpen}>
  ...
  <AlertDialog.Action onClick={() => deleteItem(id)}>删除</AlertDialog.Action>
</AlertDialog.Root>
```

或用 `<form action={serverAction}>` 配合 useTransition。
-->

---
transition: fade-out
---

# shadcn/ui 协作模式

「Radix + Tailwind + 复制粘贴」的工程实践

<v-click>

```bash
pnpm dlx shadcn@latest init                       # 配置
pnpm dlx shadcn@latest add dialog button input    # 添加（实际是 Radix 包装）
ls components/ui/   # button.tsx  dialog.tsx  input.tsx
```

</v-click>

<v-click>

```tsx
// components/ui/dialog.tsx —— shadcn 生成的 Radix wrapper
"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogContent = React.forwardRef((props, ref) => (
  <DialogPrimitive.Content ref={ref}
    className={cn("fixed ... data-[state=open]:animate-in ...", props.className)} />
));
export { Dialog, DialogTrigger, DialogContent };
```

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **shadcn/ui 是「Radix + Tailwind」的工程化封装**：

**安装流程**：
1. `pnpm dlx shadcn@latest init` —— 配置 tailwind / utils / 主题
2. `pnpm dlx shadcn@latest add dialog` —— 添加单个组件
3. 组件源码进入 `components/ui/`

**生成的文件结构**：
```
components/
  ui/
    button.tsx
    dialog.tsx
    input.tsx
    dropdown-menu.tsx
    ...
lib/
  utils.ts  ← 包含 cn() 函数（clsx + tailwind-merge）
```

[click] **shadcn 组件本质**：

每个 shadcn 组件文件就是 **Radix Primitive + Tailwind className 包装**：

```tsx
// components/ui/dialog.tsx
"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
      className
    )}
    {...props}
  />
));

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg",
        "translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg",
        "duration-200 rounded-lg",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "data-[state=closed]:zoom-out-95",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4">
        <X /><span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));

export { Dialog, DialogTrigger, DialogContent, DialogClose };
```

**业务用法**：
```tsx
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger>打开</DialogTrigger>
  <DialogContent>内容</DialogContent>
</Dialog>
```

**关键优势**：
- 组件代码在你 repo —— 可以改
- 不绑死 shadcn 版本
- Tailwind class 默认完整 / 现代
- a11y 已 Radix 保证
- TypeScript 完整

**vs 直接用 Radix**：
- shadcn 提供「现成可用的样式 + 标准 className 命名」
- 直接 Radix 你要自己写所有 className
- 新项目建议用 shadcn 起步，需要时改 `components/ui/*.tsx`

**shadcn 不止 Dialog**：
- 70+ 组件
- 大部分基于 Radix（90% 左右）
- 少部分用其他底层（Toast=sonner / Calendar=react-day-picker / Command=cmdk）

理解 Radix 之后用 shadcn 完全顺手 —— 因为本质就是 Radix。
-->

---
transition: fade-out
---

# 常见踩坑 #1

z-index / Portal / Focus / Hydration

<v-click>

**Portal z-index 难题**

```tsx
// Radix Portal 默认渲染到 body 末尾，需自己加 z-index
.dialog-content { z-index: 50; }
// 或 Radix Themes 指定 container
<Dialog.Content container={themeRoot}>
```

</v-click>

<v-click>

**asChild 双 children 报错**

```tsx
// ❌ 错误：Trigger asChild 必须只有一个 child
<Dialog.Trigger asChild>
  <Icon /><span>打开</span>
</Dialog.Trigger>

// ✅ 用元素包裹
<Dialog.Trigger asChild>
  <button><Icon /><span>打开</span></button>
</Dialog.Trigger>
```

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **踩坑 #1 — Portal z-index 难题**：

Radix 用 Portal 把 Dialog / Popover / DropdownMenu 等 Content 渲染到 `document.body` 最后 ——
脱离 React 父组件的 DOM 树 + CSS 层叠上下文。

**问题**：
- 你的 sticky header z-index: 100
- 你的 Dialog z-index 没设 → 默认 auto → 渲染在 header 下面

**解决**：
1. 给 Content 显式 z-index：
   ```css
   .DialogContent, .PopoverContent, .DropdownMenuContent {
     z-index: 50;
   }
   ```

2. 或用 Radix Themes 的 `container` prop：
   ```tsx
   <Dialog.Content container={document.getElementById("theme-root")}>
   ```
   让 Portal 渲染到指定容器内（仍受其 CSS 层叠影响）

3. shadcn 默认 `z-50` —— 一般够用

**Radix Themes z-index**：
- Theme 创建自己的 stacking context（`isolation: isolate`）
- 防止外部 z-index 干扰
- 但要小心 next.js portal default container

[click] **踩坑 #2 — asChild 双 children**：

`asChild` 要求**唯一子节点**：

```tsx
// ❌ 报错
<Dialog.Trigger asChild>
  <svg>...</svg>
  <span>打开</span>
</Dialog.Trigger>
// "asChild only works with a single child"
```

```tsx
// ✅ 包一层 button
<Dialog.Trigger asChild>
  <button>
    <svg>...</svg>
    <span>打开</span>
  </button>
</Dialog.Trigger>
```

**asChild 内的组件必须**：
1. 接受所有 props（spread 到 DOM）
2. forwardRef（Radix 需要 ref）

```tsx
// ❌ 不能 forwardRef
const MyButton = ({ children }) => <button>{children}</button>;

// ✅ forwardRef + spread
const MyButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <button ref={ref} {...props}>{children}</button>
  )
);
```

**踩坑 #3 — Focus 自动管理冲突**：

Dialog 关闭时焦点回 Trigger —— 但有时你想去别处：
```tsx
<Dialog.Content
  onCloseAutoFocus={(e) => {
    e.preventDefault();
    document.getElementById("after-dialog")?.focus();
  }}
>
```

**踩坑 #4 — 嵌套 Dialog**：

两个 Dialog 嵌套时，第一个的 Close / Esc 会先关闭最后打开的：
- 默认行为：Esc 先关最近的（栈式）
- 通常符合用户预期

但偶尔需要 outer 关闭时强制关 inner —— 用受控模式手动管理。

**踩坑 #5 — Server Component 内不能用 Dialog**：

Radix 任何带 state 的组件（基本 90%）必须在 client component：
- `"use client"` 标记
- 或包成 client wrapper（推荐）

报错：`createContext is not a function` —— 就是这个问题。
-->

---
transition: fade-out
---

# 常见踩坑 #2

Scroll Lock / Outside Click / Animation 性能

<v-click>

**scroll lock 副作用**：modal=true 默认锁滚动 + 加 `padding-right: 17px`（防滚动条抖动）—— 但 fixed 元素和 sticky 库会跟着抖

```tsx
// 解决：modal=false（适合非阻断流程）
<Dialog.Root modal={false}>
```

</v-click>

<v-click>

**点击外部关闭被嵌套层吞掉**：Popover 内的 Select Item 点击可能误判为 outside

```tsx
<Popover.Content
  onPointerDownOutside={(e) => {
    if (e.target.closest("[data-radix-popper-content-wrapper]"))
      e.preventDefault();
  }} />
```

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **踩坑 #6 — Scroll Lock 副作用**：

Dialog `modal=true`（默认）会：
1. 锁定 body scroll（防止背景滚）
2. 给 body 加 `padding-right: 17px`（滚动条宽度，防止内容横移抖动）

**副作用**：
- `position: fixed` 元素（如 floating action button）会跟着抖
- 第三方 sticky lib（如 Headroom）可能错位
- iOS Safari 上 padding 计算可能有问题

**解决**：

A. **modal=false**（非阻断场景）：
```tsx
<Dialog.Root modal={false}>
  {/* 仍可点 Trigger 外部，不锁滚动 */}
</Dialog.Root>
```

B. **手动控制 padding**：
禁用 Radix 默认行为，自己加 className 处理。但 Radix 没暴露 prop —— 需 hack。

C. **CSS 兜底**：
```css
body[data-scroll-locked] {
  /* 自己处理 fixed 元素 */
}
.fab {
  right: calc(20px + var(--removed-body-scroll-bar-size, 0px));
}
```

Radix 在 body 上加 `data-scroll-locked` 和 CSS 变量 `--removed-body-scroll-bar-size`。

[click] **踩坑 #7 — 嵌套层 outside click 误判**：

```tsx
<Popover.Root>
  <Popover.Content>
    <Select.Root>
      <Select.Trigger />
      <Select.Content>  {/* 这是另一个 Portal */}
        <Select.Item />
      </Select.Content>
    </Select.Root>
  </Popover.Content>
</Popover.Root>
```

问题：
- Select.Content portal 到 body
- 点击 Select.Item 触发 Popover 的 outside click 检测
- Popover 关掉了 → Select 也跟着消失

**解决**：
- Radix 已尝试自动处理 layered overlays —— 通常无需操心
- 偶尔异常时用 `onPointerDownOutside` preventDefault 内部点击

```tsx
<Popover.Content
  onPointerDownOutside={(e) => {
    if (e.target.closest("[data-radix-select-content]")) {
      e.preventDefault();
    }
  }}
/>
```

[click] **踩坑 #8 — Animation 性能 / Will-change**：

Radix data-state 动画很流畅，但大量 Tooltip / Popover 时可能闪烁：

```css
/* 性能优化 */
.PopoverContent {
  will-change: transform, opacity;
  transform: translateZ(0);  /* GPU 合成 */
}
```

但小心：
- `will-change: transform` 占内存，多了卡
- 滥用反而更慢

**最佳实践**：
- 只对「频繁动画」元素加 will-change
- 动画结束后 JS 移除 will-change
- 默认 Radix 已优化，多数场景不用动

[click] **踩坑 #9 — 第三方组件用 asChild 失败**：

```tsx
// ❌ 第三方组件不 forwardRef
<Dialog.Trigger asChild>
  <ThirdPartyButton>打开</ThirdPartyButton>
</Dialog.Trigger>
// console: "Function components cannot be given refs"
```

**解决**：
- 包一层自己的 forwardRef wrapper
- 或不用 asChild，直接 Trigger（不灵活但 work）

[click] **踩坑 #10 — Form Primitive 与 RHF 冲突**：

Radix Form Primitive 有自己的 validation 体系（ValidityState）：
- 跟 React Hook Form 用法不同
- 同时用容易乱

**建议**：
- 用 Themes / shadcn 做样式 + RHF 做状态 + Zod 做校验 —— 不用 Radix Form Primitive
- 单独 Radix Form Primitive 适合「轻量 form + 不引入 RHF」场景
-->

---
transition: fade-out
---

# 下一步学习路径

从入门到精通的路线图

<v-click>

**入门（1-2 周）**：Next.js + Radix Themes 搭基础后台 / 理解 Compound + asChild + data-state 三件套 / Dialog + Popover + DropdownMenu 三原语吃透

</v-click>

<v-click>

**进阶（1 月）**：转 shadcn 模式（Radix + Tailwind + 复制粘贴）/ Radix Colors 12 阶套 CSS 变量自定义品牌 / 30+ Primitives 全跑 demo

</v-click>

<v-click>

**精通（持续）**：读 `@radix-ui/react-*` 源码（Compound + Slot 实现）/ 跟进 WAI-ARIA APG 学 a11y 模式 / 自建设计系统（Primitives 行为 + Tailwind 样式 + 业务 wrapper）

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **入门 1-2 周**：

目标 —— 用 Radix 搭一个能跑的项目。

推荐路径：
1. **Next.js + Radix Themes 起步**：
   ```bash
   pnpm create next-app@latest my-app
   pnpm add @radix-ui/themes
   ```
   - 改 layout.tsx 包 `<Theme>`
   - 体验 accentColor / grayColor / radius / scaling 切换
   - 用 Layout primitives 搭页面骨架

2. **理解三件套**：
   - **Compound Component**：每个 Dialog/Popover/Menu 都是 `.Root .Trigger .Content` 结构
   - **asChild**：把组件能力转嫁子元素
   - **data-state**：CSS 用 `[data-state=open]` 写动画

3. **吃透 3 个核心原语**：
   - Dialog（最常用）
   - Popover（次常用）
   - DropdownMenu（菜单标杆）

学会这 3 个 → 其他 Overlay 类原语秒懂。

[click] **进阶 1 月**：

目标 —— 走 shadcn 模式 + 自定义品牌。

推荐路径：
1. **转 shadcn**：
   ```bash
   pnpm dlx shadcn@latest init
   pnpm dlx shadcn@latest add dialog button input dropdown-menu ...
   ```
   - 看 `components/ui/dialog.tsx` 源码 → 理解 Radix + Tailwind 包装
   - 改 className / 加 variant / 删功能 —— 自己掌控

2. **自定义品牌色**：
   - 引入 Radix Colors：`pnpm add @radix-ui/colors`
   - 创建自己的 CSS 变量层：
     ```css
     :root {
       --brand-1: var(--violet-1);
       --brand-9: var(--violet-9);
       --brand-11: var(--violet-11);
     }
     ```
   - Tailwind v4 用 brand-* utilities

3. **跑遍 30+ Primitives**：
   - 每个原语写一个 demo 页（Storybook 也行）
   - 体会键盘交互 / a11y / Compound 模式

[click] **精通（持续）**：

目标 —— 能自建设计系统 / 贡献 Radix。

推荐路径：
1. **读源码**：
   - `@radix-ui/react-dialog` 看 Compound + Context 实现
   - `@radix-ui/react-slot` 看 Slot 模式精髓（很短，几十行）
   - `@radix-ui/react-popper` 看 collision detection 用 @floating-ui

2. **WAI-ARIA APG 学习**：
   - https://www.w3.org/WAI/ARIA/apg/
   - 30+ patterns（Dialog / Menu / Listbox / Combobox / Slider / Tabs / Disclosure 等）
   - Radix 每个原语都对应一个 pattern —— 一边读 Radix 源码一边读 APG

3. **自建设计系统**：
   - Primitives 提供行为
   - Tailwind / CSS Vars 提供样式
   - 业务 wrapper（components/ui/）包装
   - 跟设计师定 Token + Variants
   - 文档化（Storybook / mdx）

**Radix 团队推荐项目**：
- Vercel：Next.js 官方文档 + Vercel 后台
- Linear：项目管理
- Cal.com：日程
- Resend：邮件 API
- Supabase：数据库 PaaS
- Stripe：支付（部分用）
- Notion：笔记（部分用）

这些产品的 UI 一致性 + 流畅性 = Radix 的实力证明。
-->

---
transition: fade-out
---

# 资源与生态

官方文档 / GitHub / 社区 / 配套工具

<v-click>

**官方资源**

- 文档：[radix-ui.com](https://www.radix-ui.com/) / [Primitives](https://www.radix-ui.com/primitives) / [Themes](https://www.radix-ui.com/themes) / [Colors](https://www.radix-ui.com/colors)
- GitHub：radix-ui/primitives（16K+ star）/ radix-ui/themes（6K+ star）

</v-click>

<v-click>

**生态产品**

- **shadcn/ui**：Radix + Tailwind 复制粘贴模板（70+ 组件）
- **Ariakit**：另一个 Headless 库（同类竞品）
- **cmdk** / **sonner** / **vaul**：shadcn 默认推荐的 Command / Toast / Drawer
- **next-themes**：Dark mode（Themes / shadcn 都用）

</v-click>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **官方资源**：

**radix-ui.com 主站**：
- 三大产品线统一入口
- Primitives / Themes / Colors / Icons 分别独立文档
- 文档质量「业界第一档」—— 每组件 API + Examples + Accessibility + Keyboard

**Primitives 文档**：
- 30+ 原语，每个独立页
- Anatomy（结构）+ API Reference + Accessibility + Keyboard + Examples
- 大量动态 demo（在文档内可交互）

**Themes 文档**：
- 50+ 组件 + Layout + Form + Typography
- 主题配置 playground（实时调 accentColor / grayColor 等）

**Colors 文档**：
- 30+ 色阶可视化
- 每色 12 阶展开（亮 + 暗 + alpha + P3）
- APCA contrast checker

**GitHub**：
- radix-ui/primitives：16K+ star, 月活 issue 100+
- radix-ui/themes：6K+ star
- Discord 社区活跃

[click] **生态产品**：

**shadcn/ui** —— Radix 最大的生态：
- 70+ 组件（90% 基于 Radix）
- 复制粘贴分发模式
- Tailwind 样式
- Vercel 收购作者，全力支持

**Ariakit** —— 同类竞品：
- 更多组件（60+）
- 同样 unstyled + a11y
- 跟 Radix 互斥（同一项目通常只选一个）

**cmdk** —— Command Palette：
- shadcn Command 组件底层
- ⌘K 搜索体验
- Radix 团队推荐

**sonner** —— Toast：
- Emil Kowalski（Vercel 设计师）出品
- 比 Radix Toast 易用
- shadcn 推荐替代 Radix Toast

**next-themes** —— Dark mode：
- Theo Browne 出品
- SSR-safe + system mode + class/attribute 双模式
- Radix Themes / shadcn 默认搭配

**vaul** —— Drawer：
- Emil Kowalski 另一作品
- 手机端 Drawer / Sheet（iOS 风格）
- Radix-style API
- shadcn Drawer 底层

**framer-motion**：
- 复杂动画（Radix 默认 CSS 动画不够时）
- 跟 Radix 配合极好

**@floating-ui/react**：
- Radix Popper（Popover / Tooltip / Dropdown 等定位）底层
- 同团队，无缝衔接

**配套技术栈**：
- 表单：react-hook-form + zod
- 数据：tanstack-query
- 状态：zustand
- 路由：next-js / tanstack-router
- 校验：zod

「Next.js + Radix Primitives + Tailwind + RHF + Zod + TanStack Query」是 2025 React 全栈黄金组合。
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 ⚛️

Radix UI — Headless Primitives + Themes 设计系统，shadcn/ui 的底层基石

<div class="mt-8 text-lg">

**核心心智**

- 双产品线：Primitives（headless 原语）+ Themes（完整设计系统）
- shadcn/ui 底层 = Radix Primitives + Tailwind + 复制粘贴分发
- Compound Component + asChild Slot：2024+ React UI 库事实标准
- data-state DOM 属性：CSS / Tailwind v4 `data-[state=open]:` 完美适配
- 完美 a11y：WAI-ARIA 全遵从 + 键盘 / 焦点 / 屏幕阅读器
- Radix Colors 12 阶：APCA 对比度 + P3 广色域 + Light/Dark 自动

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://www.radix-ui.com/" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/radix-ui/primitives" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://ui.shadcn.com/" target="_blank" class="slidev-icon-btn">
    <carbon:layers /> shadcn/ui
  </a>
</div>

<style>
h1 {
  background-color: #3E63DD;
  background-image: linear-gradient(45deg, #3E63DD 10%, #8B5CF6 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：Radix UI = React 生态「Headless 原语 + 完整设计系统」双产品线，是 shadcn/ui 的基石。

核心心智九条：

1. **双产品线**：Primitives（无样式行为） + Themes（开箱即用） + Colors（12 阶色阶） + Icons
2. **shadcn 底层就是 Radix**：90% shadcn 组件基于 Radix Primitives + Tailwind
3. **30+ Primitives**：Overlay / Form / Layout / Disclosure / Feedback / Utility 全覆盖
4. **Compound Component**：Root + Trigger + Content + Portal 命名空间
5. **asChild Slot 模式**：把组件能力转嫁子元素，Radix 首创现已成事实标准
6. **data-state DOM 属性**：组件状态 → DOM 属性 → CSS 选择器，Tailwind v4 data-[] 语法完美
7. **Controlled / Uncontrolled**：默认非受控自管理 state，需要外部干预切受控
8. **完美 a11y**：每原语遵循 WAI-ARIA APG pattern，键盘 + 焦点 + 屏幕阅读器全包
9. **Radix Colors 12 阶**：每阶定义用途（背景/边框/solid/文字），APCA 对比度通过 + P3 广色域

下一步建议：

入门：
- pnpm create next-app + Radix Themes，搭一个基础后台
- 理解 Compound / asChild / data-state 三件套
- 跑通 Dialog / Popover / DropdownMenu 三大原语

进阶：
- 转 shadcn 模式（Radix Primitives + Tailwind + 复制粘贴）
- 自定义品牌色（Radix Colors CSS 变量）
- 把 30+ Primitives 全部体验一遍

精通：
- 读 @radix-ui/react-* 源码（Compound + Slot 实现）
- 学 WAI-ARIA APG（30+ patterns）
- 自建设计系统（Primitives + Tailwind + 业务 wrapper）

延伸学习：
- shadcn/ui 70+ 组件库
- Ariakit / Ark UI 同类对比
- cmdk / sonner / vaul / next-themes 配套生态
- Vercel / Linear / Cal.com 等 Radix 产品案例
- WAI-ARIA Authoring Practices Guide

Radix UI 是 React 2024+ UI 生态的「基础设施」 ——
不直接用 Radix，你也大概率间接用（shadcn / Mantine / Chakra v3 / Ark UI 都受其启发）。

感谢观看！
-->
