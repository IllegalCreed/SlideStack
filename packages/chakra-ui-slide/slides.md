---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Chakra UI
info: |
  Presentation Chakra UI v3 for React developers.

  Learn more at [https://chakra-ui.com/](https://chakra-ui.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">⚡️</span>
</div>

<br/>

## Chakra UI — Modular React Component System

Style Props / Recipes / Compound Components —— Ark UI + Panda CSS 重写后的现代风格 React UI

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Chakra UI —— React 生态「现代风格 UI 体系」代表，2019 年 Segun Adebayo 创办，
2024 年底发布 v3 大重写，是「style props + 组合优先 + 无障碍」哲学的开山之作。

当前主线 v3.35+，定位完全变了：
- v2：自有 props + Emotion 运行时 + Theme 对象，50+ 组件
- v3：Ark UI 作 headless 底层 + Panda CSS 启发的 createSystem + snippet CLI + Compound 组件
- 全面拥抱 Recipes / Slot Recipes / Conditional Style Props 体系
- 130+ 组件，分类清晰（Layout / Forms / Overlays / Disclosure 等 11 大组）

核心卖点：
- 200+ Style Props（最完整的 props 化样式 API）
- 30+ Conditional Style Props（_hover / _dark / _disabled 等）
- Compound Components 命名空间（Dialog.Root / Dialog.Trigger 等）
- asChild prop（Radix 风格的 Slot 模式）
- snippet CLI（类似 shadcn —— 复制代码到本地，可改）
- next-themes 集成色模式（无自有 ColorModeProvider）
- ChakraProvider + createSystem + defineConfig 配置体系
- GitHub 40K+ star，npm 周下载 300 万

本次内容聚焦 v3 + 重写后的现代 API（createSystem / Recipes / Compound Components / Ark UI）。
-->

---
transition: fade-out
---

# 什么是 Chakra UI？

React 生态「现代风格 UI 体系」，style props + 组合优先 + 无障碍

<v-click>

- **130+ 组件**：Layout / Typography / Forms / Overlays / Disclosure / Feedback / Data Display 等 11 大组
- **200+ Style Props**：所有 CSS 属性 props 化，主题感知 + 响应式 + 类型完整
- **30+ Conditional Props**：\_hover / \_focus / \_dark / \_disabled / \_groupHover 等伪类 + 状态
- **Compound Components**：Dialog.Root / Dialog.Trigger 命名空间，强结构表达
- **asChild prop**：Radix 风格 Slot 模式，把组件能力转嫁到子元素
- **Recipes / Slot Recipes**：cva / sva 风格的样式变体声明
- **Ark UI 底层**：无样式 + 无障碍原语，跨框架共享行为
- **snippet CLI**：类似 shadcn，关键组件复制到项目本地可改

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Chakra UI Overview_](https://chakra-ui.com/docs/get-started/installation)

</div>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Chakra UI v3 的定位跟 v2 完全不一样 ——

v2 的 Chakra 卖点是「style props + Emotion + 友好简洁」，定位「Tailwind props 化 + React 组件」。
v3 大重写后，定位升级为「现代风格 UI 体系」：
- 组件：130+（v2 是 50+，翻了 2.5 倍）
- 底层：Ark UI 无样式原语 + Panda CSS 启发的 createSystem
- 样式：Style Props + Recipes + Slot Recipes 三层完整
- 哲学：Compound + asChild + snippet 三件套

200+ Style Props 是 Chakra 的「招牌」：
- 任何 CSS 属性都有对应 prop（margin → m / mt / mb / mx / my）
- 主题感知（c="red.500" 走 theme.colors）
- 响应式（数组语法或对象语法）
- 类型完整（TypeScript autocomplete）

30+ Conditional Props 是另一招牌：
- 伪类：_hover / _focus / _focusVisible / _active / _disabled
- 数据状态：_open / _closed / _checked / _selected / _expanded
- 媒体查询：_dark / _light / _osDark / _print / _portrait
- 群组：_groupHover / _peerFocus（Tailwind group/peer 风格）
- 表单：_invalid / _valid / _placeholder / _required / _readOnly

Compound Components 是 v3 的最大变化：
- v2：<Modal><ModalContent><ModalHeader />...</ModalContent></Modal>
- v3：<Dialog.Root><Dialog.Content><Dialog.Header />...</Dialog.Content></Dialog.Root>
- 结构更清晰，import 更简洁（只 import 一个 Dialog）
- 配合 asChild → 任意子元素扮演 Trigger / CloseTrigger

snippet CLI 是 shadcn 哲学的延伸：
- 关键 wrapper（Provider / Toaster / ColorMode 等）通过 CLI 复制到本地
- 用户可以改，不绑死 npm 包版本
- 配合 Compound Components → 用户在本地完成 closed composition

下面会按「定位 → 对比 → v2→v3 重写 → 演进 → 安装 → ChakraProvider → Button + Field → Style Props 完整 → Conditional Style Props → createSystem + defineConfig → Recipes / Slot Recipes → Token 体系 → 130+ 组件 → Compound + asChild → Form + RHF + Zod → Toast + Menu → Color Mode → Ark UI 底层 → Next.js 集成 → snippet CLI → TypeScript → 踩坑 → 学习路径」顺序讲透。
-->

---
transition: fade-out
---

# 与 MUI / Mantine / Ant Design 对比

为什么 React 项目还在选 Chakra UI？

<v-click>

| 维度       | Chakra UI       | MUI             | Mantine         | Ant Design  |
| ---------- | --------------- | --------------- | --------------- | ----------- |
| 设计语言   | 现代实用 / 中性 | Material        | 现代实用        | 企业中后台  |
| 组件数量   | **130+**        | 60+             | 120+            | 70+         |
| Style 模型 | **Props 化最强** | sx + Theme      | classNames+styles | Token+algo |
| 底层       | **Ark UI 原语** | Emotion/Pigment | 纯 CSS          | CSS-in-JS   |
| Headless   | **Ark UI 共享** | -               | -               | -           |
| 心智       | 组合 + asChild  | Theme 对象     | Styles API      | Token       |

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比 React 生态四大主流 UI 库，Chakra UI 的护城河是「Props 化样式最强 + Ark UI Headless 底层」：

**组件数量**：
- Chakra UI v3：130+，分类最细（11 大组），有日期 / 树 / Combobox 等高级组件
- Mantine 120+ 全部内置
- Ant Design 70+
- MUI 60+（核心）+ @mui/x 高级套件

**Style 模型**：
- **Chakra UI**：200+ Style Props + 30+ Conditional Props，覆盖所有 CSS 属性
  - 例：`<Box mt="4" p={[2, 4, 6]} _hover={{ bg: 'blue.500' }} bg="gray.50" />`
- MUI：sx prop 覆盖任意元素 + Theme 对象
- Mantine：Style Props（受限简写） + classNames/styles/vars
- Ant Design：Token + algorithm（不暴露 Style Props）

**底层**：
- **Chakra UI v3 = Ark UI + Emotion + Panda CSS 启发**
  - Ark UI：无样式 + 无障碍原语（跨 React / Solid / Vue / Svelte 共享行为）
  - Emotion：当前的运行时 CSS-in-JS（未来计划迁移到 Panda 零运行时）
- MUI：Emotion 运行时（Pigment CSS 零运行时实验中）
- Mantine：纯 CSS + PostCSS（v7 起）
- Ant Design：CSS-in-JS 自有方案

**Headless 共享**：
- Chakra UI 底层是 Ark UI —— 这是 Chakra 团队同时维护的 Headless 库
- React / Solid / Vue / Svelte / Lit 都能用同一套行为原语
- 这是其他 UI 库都没有的「跨框架共享」能力
- 适合「品牌一致 + 多框架」场景

**心智**：
- Chakra UI：组合（Compound Components）+ asChild + Style Props，三件套
- MUI：sx prop + Theme 对象 + styled()
- Mantine：Styles API（classNames / styles / vars）+ component prop
- Ant Design：Token + algorithm + theme

选型逻辑：
- React + props 化样式 + 无障碍 → Chakra UI（默认）
- React + Material 风 / 全球 → MUI
- React + 自定义多 / 设计感强 → Mantine
- React + 中国 B 端 → Ant Design
-->

---
transition: fade-out
---

# v2 → v3 重大重写

为什么 2024 年底要做一次彻底重写？

<v-click>

| 维度        | v2                            | **v3**                                  |
| ----------- | ----------------------------- | --------------------------------------- |
| 组件 API    | 平铺（Modal / ModalContent）  | **Compound（Dialog.Root / .Content）**   |
| 底层        | 自有                          | **Ark UI（无样式原语）**                 |
| 主题入口    | extendTheme()                 | **createSystem() + defineConfig()**     |
| 样式声明    | Theme 对象 + styled           | **Recipes / Slot Recipes（cva/sva）**    |
| 色模式      | 自有                          | **next-themes 集成**                    |
| 安装        | npm install                   | **snippet CLI（shadcn 风格）**           |
| 性能        | -                             | **4x reconciliation / 1.6x re-render**   |

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v3 是 Chakra UI 历史上最彻底的一次重写，2024 年底发布，技术栈几乎全换。

**为什么要重写？**

v2 的几个核心痛点：
- 平铺命名导致 import 膨胀：Modal / ModalContent / ModalHeader / ModalBody / ModalFooter / ModalCloseButton 一次要 6 行 import
- 无障碍要从头实现：focus trap / Escape 退出 / 滚动锁定 / aria 等都是 v2 自己写的，跨框架不能共享
- Theme 对象嵌套深：嵌套 5-6 层的 colors / fontSizes / radii 不好类型推导
- ColorMode 自有体系：维护一套 localStorage + Provider，跟 next-themes 重复
- 性能：runtime CSS-in-JS 在大型应用上有压力

**v3 解决方案**：

1. **Compound Components**：
   - `<Modal><ModalContent /></Modal>` → `<Dialog.Root><Dialog.Content /></Dialog.Root>`
   - 一次 `import { Dialog }` 拿到所有部件
   - 结构清晰、嵌套关系即组件关系

2. **Ark UI 作底层**：
   - 无样式 + 无障碍原语库，Chakra 团队同时维护
   - React / Solid / Vue / Svelte / Lit 共享同一套行为
   - 无障碍交给 Ark，Chakra 只负责样式

3. **createSystem + defineConfig**：
   - Panda CSS 启发的 token + recipe 系统
   - 所有 token 用 `{ value: "..." }` 包裹，类型推导更准
   - 函数式管线：defineConfig → createSystem → ChakraProvider value={system}

4. **Recipes / Slot Recipes**：
   - cva（class-variance-authority）风格的样式变体声明
   - Recipe = 单元素变体（Button 的 size / variant）
   - Slot Recipe = 多元素变体（Card 的 root / header / body）

5. **next-themes 集成**：
   - 抛弃自有 ColorModeProvider
   - 用 next-themes 这个事实标准（Mantine / shadcn 同款）
   - 防 SSR 闪烁 + 系统色模式联动

6. **Token 写法**：
   - `{ heading: "Inter" }` → `{ heading: { value: "Inter" } }`
   - 多写一层 value，但允许未来扩展（如 description / category）
   - 类型推导更稳

7. **snippet CLI**：
   - `npx @chakra-ui/cli snippet add` 复制 Provider / Toaster / ColorMode 等 wrapper 到本地
   - 类似 shadcn 哲学：组件代码在你的 repo 里，可改
   - 不绑死版本 + 易于扩展

8. **性能**：
   - 4x reconciliation 速度提升
   - 1.6x re-render 性能提升
   - 数据来源：Chakra 官方迁移指南

**v2 → v3 迁移成本**：
- 所有 Modal / Drawer / Menu 等组件 import 全改
- isOpen → open / isDisabled → disabled / colorScheme → colorPalette / spacing → gap / noOfLines → lineClamp
- extendTheme() → createSystem() + defineConfig()
- Token 全部包 value: ...
- 工程量大，但全是机械替换（部分能 codemod）

迁移建议：新项目直接 v3；老项目稳定运行 → v2 暂留，需要新特性时再迁。
-->

---
transition: fade-out
---

# 演进史

从 v0 到 v3 的六年五次大版本

<v-click>

| 版本    | 时间    | 关键事件                                                  |
| ------- | ------- | --------------------------------------------------------- |
| 0.x     | 2019.6  | Segun Adebayo 首次发布，Emotion + Style Props 雏形       |
| 1.x     | 2020.10 | 50+ 组件，无障碍优先理念确立                              |
| 2.x     | 2022.4  | TypeScript 重写 + ColorMode 完善 + Hooks 库扩展           |
| 2.8     | 2023.10 | 性能优化最后一轮，CSS 选择器优化 / 减少嵌套 div            |
| **3.0** | 2024.12 | **大重写：Ark UI + Panda 启发 + Compound + snippet CLI**  |
| **3.x** | 2025+   | **快速迭代：组件数量翻 2.5 倍 + Tree / Tour / Pin Input** |

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Chakra UI 的演进里程碑：

**0.x（2019.6）**：Segun Adebayo 个人项目
- 灵感来自 Tailwind props 化
- Emotion 作样式底层（React UI 主流方案）
- Style Props 雏形：`<Box mt={4} p={2} bg="gray.100" />`
- 首批 30 个组件

**1.x（2020.10）**：组件库正式化
- 50+ 组件，覆盖 UI 主要场景
- 无障碍优先（a11y first）成为 Chakra 招牌
- @chakra-ui/icons 独立包

**2.x（2022.4）**：TypeScript 全量重写
- 所有组件 props 完整类型
- ColorMode 体系完善（useColorMode / useColorModeValue / ColorModeProvider）
- Hooks 库扩展（useDisclosure / useBreakpointValue 等）
- 月下载量突破 100 万

**2.8（2023.10）**：v2 最后一轮迭代
- 性能优化：减少嵌套 div / 优化 CSS 选择器
- 组件 props 稳定化（为 v3 做准备）
- 维持 GitHub 40K star

**3.0（2024.12）—— 大重写**：
- 完全推翻 v2 架构
- Ark UI 作 headless 底层
- Panda CSS 启发的 createSystem + recipes
- Compound Components 命名空间
- snippet CLI 类似 shadcn
- next-themes 替换自有 ColorMode

**3.x（2025）—— 快速迭代**：
- 组件数量从 50+ 涨到 130+
- 新增：Tree View / Tour / Pin Input / Number Input / File Upload / Combobox / Listbox / Calendar / Date Picker / Carousel / Steps / Timeline
- TypeScript 类型推导持续优化
- 持续吸收 Ark UI 升级

**当前主线 v3.35+**：
- 持续小步迭代
- 关注 changelog 不滞后

新项目直接 v3，老项目按业务节奏迁。
-->

---
transition: fade-out
---

# 设计哲学

组合优先 / 无障碍优先 / 主题灵活 —— Chakra 的三大原则

<v-click>

**组合优先（Composition First）** —— Compound Components + asChild，结构即组件

</v-click>

<v-click>

**无障碍优先（Accessibility First）** —— Ark UI 原语 + WAI-ARIA 遵从，键盘 / 屏幕阅读器 / 焦点管理开箱即用

</v-click>

<v-click>

**主题灵活（Themable）** —— createSystem + defineConfig + Recipes，从 token 到组件变体全程可改

</v-click>

<v-click>

**开发者友好（DX）** —— Style Props 200+ / Conditional 30+ / TypeScript 完整 / snippet CLI 可改

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **组合优先** —— v3 的核心心智 ——

Chakra v3 抛弃了 v2 的「平铺组件」(Modal / ModalContent / ModalHeader)，全面拥抱 Compound：
- `<Dialog.Root><Dialog.Content><Dialog.Header>...</Dialog.Header></Dialog.Content></Dialog.Root>`
- 结构即组件 —— 嵌套关系一目了然
- import 简化 —— 一次 `import { Dialog }` 拿全部
- asChild prop —— 把组件能力转嫁到子元素，灵活组合

这种模式跟 Radix UI / Ark UI / shadcn 风格一致 —— 是 2024+ React UI 库主流方向。

[click] **无障碍优先** —— Chakra 从 0.x 就有这个 DNA ——

v3 把无障碍下沉到 Ark UI：
- focus trap（弹窗内焦点圈定）
- ESC 退出 / Backdrop 点击关闭
- 滚动锁定（弹窗打开时背景不滚）
- WAI-ARIA 角色 + label + describe
- 键盘导航（Tab / Arrow / Home / End）
- 屏幕阅读器友好

这些都由 Ark UI 提供原语，Chakra 只负责样式。
跨框架（React / Solid / Vue / Svelte）共享同一套行为，是「跨框架设计系统」的基础。

vs MUI：MUI 也支持 a11y，但更多靠组件级实现。
vs Ant Design：a11y 完整度一般，企业 B 端需求。
Chakra UI a11y 是「全球项目首选」的原因之一。

[click] **主题灵活** —— createSystem + defineConfig + Recipes ——

v3 主题三层：
- **Token**：原子值（colors / fonts / spacing / radii 等）
- **Semantic Token**：语义值（danger / success / muted 等，引用 token）
- **Recipe**：组件变体（Button 的 size / variant / colorPalette 组合）

每层都能定制：
- 全局换品牌色：覆盖 colors.brand
- 自定义语义：semanticTokens.colors.primary = "{colors.violet.500}"
- 自定义 Button 变体：recipes.button.variants.solid.bg = "brand.500"

跟 Mantine / MUI 对比：
- Chakra：Recipe = cva/sva 风格，函数式优雅
- Mantine：Component.extend + Styles API
- MUI：components.MuiButton.styleOverrides

[click] **开发者友好** ——

Chakra 是 DX 最好的 React UI 之一：
- Style Props 200+：所有 CSS 属性 props 化，autocomplete 完整
- Conditional Props 30+：`_hover` / `_dark` / `_groupHover` 等覆盖所有伪类
- TypeScript：所有 props / theme / recipes 完整类型
- snippet CLI：关键 wrapper 复制到本地可改（shadcn 哲学）
- 文档质量：每组件 API + Examples + a11y notes + Migration
- LLM 友好：mcp.chakra-ui.com 提供 MCP 服务器
-->

---
transition: fade-out
---

# v3 三大核心理念

Compound Components / Style Props / Ark UI 底层

<v-click>

**1. Compound Components**

`<Dialog.Root />` / `<Dialog.Trigger />` 命名空间，结构即组件 + import 简化

</v-click>

<v-click>

**2. Style Props 200+ + Conditional 30+**

所有 CSS 属性 props 化，伪类 / 状态 / 媒体查询全覆盖

</v-click>

<v-click>

**3. Ark UI Headless 底层**

无样式 + 无障碍原语，React / Solid / Vue / Svelte 跨框架共享行为

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Compound Components** —— v3 命名空间的精髓 ——

例：Dialog 完整结构
```tsx
<Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
  <Dialog.Trigger asChild><Button>打开</Button></Dialog.Trigger>
  <Dialog.Backdrop />
  <Dialog.Positioner>
    <Dialog.Content>
      <Dialog.CloseTrigger />
      <Dialog.Header>
        <Dialog.Title>标题</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>内容</Dialog.Body>
      <Dialog.Footer>底部</Dialog.Footer>
    </Dialog.Content>
  </Dialog.Positioner>
</Dialog.Root>
```

优势：
- 一次 import：`import { Dialog }` 拿到所有部件
- 结构清晰：嵌套关系即组件层次
- 类型推导：Dialog.* 子组件 props 限定
- 命名一致：所有组件统一遵循 .Root .Trigger .Content .Header .Body .Footer 等惯例

[click] **Style Props + Conditional Props** —— Chakra 的招牌 ——

**Style Props 200+** 覆盖所有 CSS 属性：
- 间距：m / mt / mb / ml / mr / mx / my / p / pt / pb / pl / pr / px / py / gap / rowGap / columnGap
- 尺寸：w / h / minW / maxW / minH / maxH / boxSize
- 颜色：bg / color / borderColor / outlineColor
- 字体：fontSize / fontWeight / fontFamily / lineHeight / letterSpacing
- 边框：border / borderTop / borderRadius / borderRadiusTop 等 30+
- 布局：display / flex / grid / position / inset / float / zIndex / overflow
- 动画：transition / transitionDuration / animation
- SVG：fill / stroke / strokeWidth
- Tables：borderCollapse / tableLayout
- Filters：filter / backdropFilter / blur
- Transforms：transform / scale / rotate / translateX / translateY

**Conditional Props 30+** 覆盖所有伪类 / 状态 / 媒体查询：
- 伪类：_hover / _focus / _focusVisible / _focusWithin / _active / _disabled
- 元素：_first / _last / _odd / _even / _empty
- 表单：_checked / _selected / _invalid / _valid / _required / _readOnly / _placeholder
- 伪元素：_before / _after / _firstLetter / _selection / _file
- 数据：_open / _closed / _expanded / _loading / _horizontal / _vertical
- 媒体：_dark / _light / _osDark / _osLight / _print / _portrait / _landscape / _motionSafe / _motionReduce / _ltr / _rtl / _highContrast
- 群组：_groupHover / _groupFocus / _groupActive / _groupDisabled / _peerHover / _peerFocus

[click] **Ark UI Headless** —— v3 真正的底层 ——

Ark UI 是 Chakra 团队同时维护的 headless 原语库：
- 跨框架：React / Solid / Vue / Svelte / Lit 都能用
- 无样式：只提供「行为 + 无障碍」原语
- 状态机：基于 XState 实现复杂交互（Combobox / Dialog / Menu 等）
- 完整 a11y：WAI-ARIA / 键盘导航 / 焦点管理 / 屏幕阅读器

Chakra v3 = Ark UI 行为 + 自家 Style Props + 自家 Recipes。

这给了 Chakra「跨框架设计系统」的能力：
- 公司有 React 主站 + Solid 工具 → 行为可共享
- 设计师对 a11y 信任不变（同套 Ark UI 跑各框架）
- 升级 Ark → 所有框架 UI 库同步受益
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
pnpm add @chakra-ui/react @emotion/react
npx @chakra-ui/cli snippet add
```

| 版本   | React 兼容 | 状态        |
| ------ | ---------- | ----------- |
| v3.x   | React 18+  | **当前主线** |
| v2.10  | React 18   | 长期维护    |
| v1.x   | React 16+  | EOL         |

</v-click>

::right::

<v-click>

**导入 + 使用**

```tsx
import { Provider } from "@/components/ui/provider";
import { Button, HStack } from "@chakra-ui/react";

export default function App() {
  return (
    <Provider>
      <HStack>
        <Button>提交</Button>
      </HStack>
    </Provider>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Chakra UI v3 安装比 v2 复杂一点，多了 snippet CLI 步骤。

**核心包**：
- @chakra-ui/react：组件库本体 + createSystem + Recipes API
- @emotion/react：当前的运行时 CSS-in-JS（未来计划迁移到 Panda 零运行时）

**为什么需要 Emotion？**
- v3 当前实现仍基于 Emotion 运行时
- 但 API 层完全抽象掉，业务代码不直接接触 Emotion
- 未来如果迁移到 Panda CSS，业务代码无需改动

**snippet CLI 是什么？**
- `npx @chakra-ui/cli snippet add` 在本地生成 wrapper 组件
- 默认生成到 `src/components/ui/`：
  - provider.tsx（ChakraProvider + next-themes）
  - color-mode.tsx（ColorModeButton / useColorMode）
  - toaster.tsx（Toast 容器）
  - dialog.tsx / drawer.tsx 等关键组件 wrapper

snippet CLI 的哲学（类似 shadcn）：
- 组件代码在你的 repo 里，不在 node_modules
- 可以改样式 / API / 添加 props
- 不绑死版本，无升级风险
- 但要承担一定的维护成本

**版本说明**：
- v3.x：当前主线（2024.12 大重写），React 18+
- v2.10：长期维护版本，React 18，老项目稳定运行
- v1.x：EOL，不推荐新项目

**新项目直接 v3** —— v3 改动太大，不要在新项目用 v2。

[click] **第一个组件**：

跟其他 UI 库一样，按需 import + Provider 包裹。

Provider 是从 snippet 复制到本地的 wrapper：
- 内部组合了 ChakraProvider + next-themes 的 ThemeProvider
- 提供 system（默认 + 自定义合并）
- 提供 colorMode（light / dark / system）

直接使用 ChakraProvider 也可以：
```tsx
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

<ChakraProvider value={defaultSystem}>
  <App />
</ChakraProvider>
```

但推荐用 snippet 的 Provider —— 已经包了 next-themes。

**HStack** 是 Chakra 的水平堆叠组件：
- HStack：水平 + gap
- VStack：垂直 + gap
- Stack：方向可选
- 内部用 Flex 实现，但更语义化

**Button** 默认 variant：
- solid（默认）/ outline / ghost / link / subtle / surface / plain
- size：xs / sm / md（默认） / lg / xl / 2xl
- colorPalette：blue / green / red / gray / 任意自定义

第一个组件不需要任何额外配置就能跑。
-->

---
transition: fade-out
---

# Provider Snippet 完整模板

snippet add 生成的 Provider —— ChakraProvider + next-themes

<v-click>

```tsx
// src/components/ui/provider.tsx —— snippet CLI 生成，可改
"use client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";

export function Provider(props) {
  return (
    <ChakraProvider value={defaultSystem}><ColorModeProvider {...props} /></ChakraProvider>
  );
}
```

</v-click>

<v-click>

```tsx
// src/components/ui/color-mode.tsx —— next-themes 集成
"use client";
import { ThemeProvider, useTheme } from "next-themes";
export function ColorModeProvider(props) {
  return <ThemeProvider attribute="class" disableTransitionOnChange {...props} />;
}
export const useColorMode = () => {
  const { resolvedTheme, setTheme } = useTheme();
  return { colorMode: resolvedTheme, toggleColorMode: () => setTheme(resolvedTheme === "dark" ? "light" : "dark") };
};
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] snippet 生成的 Provider 是 Chakra UI v3 的「标准入口模板」 ——

**Provider 职责**：
1. 包装 ChakraProvider（value 接收 system 对象）
2. 包装 ColorModeProvider（next-themes 集成）
3. 暴露统一 API 给业务

**为什么用 snippet 而不是直接用 ChakraProvider？**

如果直接：
```tsx
<ChakraProvider value={defaultSystem}>
  <App />
</ChakraProvider>
```

少了 next-themes 集成 —— 暗色模式没法切换。

加上 next-themes：
```tsx
<ThemeProvider attribute="class" disableTransitionOnChange>
  <ChakraProvider value={defaultSystem}>
    <App />
  </ChakraProvider>
</ThemeProvider>
```

但每个项目都要写这段 —— 不如 snippet 一次生成。

**defaultSystem**：
- Chakra 提供的默认 system
- 包含所有内置 tokens / recipes / global CSS
- 可以传入业务自定义 system（下一页讲）

**value 是什么？**
- v3 的关键设计：system 通过 ChakraProvider value 注入
- system = createSystem(defaultConfig, businessConfig)
- 这样组件能拿到 token / recipe / className

[click] **color-mode.tsx** —— next-themes 集成 ——

**为什么用 next-themes？**
- 防 SSR 闪烁（同步读 localStorage + 设 html class）
- 跨框架成熟（Next.js / Remix / Vite / Astro 都用过）
- 跟 Mantine / shadcn 同款
- Chakra 不重复造轮子

**关键 props**：
- `attribute="class"`：设 html 的 class（class="dark"），CSS 选择器 .dark { } 工作
- `disableTransitionOnChange`：切换时禁用 transition，避免「色彩过渡动画」体验
- `defaultTheme`："light" / "dark" / "system"（默认 system）
- `enableSystem`：监听 prefers-color-scheme（默认 true）
- `storageKey`：localStorage 的 key（默认 "theme"）

**useColorMode 是 wrapper**：
- 在 next-themes 的 useTheme 上加一层
- 返回 `{ colorMode, toggleColorMode }`，跟 v2 API 一致（方便迁移）
- 业务代码不直接接触 next-themes

snippet 哲学的好处：
- 这两个文件在你的项目里，可以改（比如加自定义 mode）
- 不绑死 v3 API（如果未来 next-themes 换了，只需改一个文件）
- 类似 shadcn —— 关键 wrapper 自由可改
-->

---
transition: fade-out
---

# Style Props（一）：间距 / 尺寸 / 颜色

200+ Style Props，所有 CSS 属性 props 化

<v-click>

```tsx
import { Box, Button } from "@chakra-ui/react";

<Box
  p="4"                       // padding: token spacing.4
  m={{ base: "2", md: "6" }}  // 响应式 margin
  px="6"                      // padding-x
  bg="teal.500"               // 主题色 teal.500
  color="white"               // 文字色
  w={{ base: "100%", md: "600px" }}  // 响应式宽度
  minW="200px"                // min-width
  borderRadius="md"           // 圆角
  boxShadow="lg"              // 阴影
  display="flex"
  gap="4"
>
  <Button>提交</Button>
</Box>
```

</v-click>

<v-click>

> 提示：颜色支持 `<palette>.<shade>` 语法（teal.500 / red.300），自动走 theme.colors。

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Style Props 是 Chakra UI 的招牌特性 ——

**间距类**（基于 theme.spacing）：
- m / mt / mb / ml / mr：margin 系列
- mx / my：margin x / y 轴
- p / pt / pb / pl / pr / px / py：padding 系列
- gap / rowGap / columnGap：flex/grid gap

值的写法：
- token key：p="4" → padding: var(--chakra-spacing-4) = 1rem
- 任意值：p="20px" / p="2rem" / p="1em"
- 负值：mt="-4" → margin-top: -1rem
- 响应式：p={{ base: "2", md: "4", lg: "6" }}

**尺寸类**：
- w / h / minW / maxW / minH / maxH：width / height 系列
- boxSize：w + h 同时设
- 值：尺寸 token / 百分比 / 任意 CSS 值

例：
- w="full" → width: 100%
- w="dvh" → width: 100dvh
- w={{ base: "100%", md: "lg" }} → 响应式

**颜色类**：
- bg / background：背景色
- color：文字色
- borderColor / outlineColor：边框 / 轮廓
- accentColor：表单原生控件强调色

颜色值的写法：
- 主题色：bg="teal.500" → var(--chakra-colors-teal-500)
- 任意值：bg="#319795" / bg="red"
- alpha：bg="teal.500/30" → 透明度 30%
- Conditional：bg={{ base: "white", _dark: "gray.800" }}

**圆角 / 阴影**：
- borderRadius / rounded（别名）：md / lg / full / 任意值
- boxShadow / shadow（别名）：sm / md / lg / xl / 2xl

**响应式**：
- 对象语法：{ base: ..., sm: ..., md: ..., lg: ..., xl: ... }
- 数组语法（旧）：[base, sm, md, lg, xl]（v3 仍支持但推荐对象）

**跟 MUI sx 的区别**：

| 维度       | Chakra Style Props        | MUI sx                  |
| ---------- | ------------------------- | ----------------------- |
| 数量       | 200+ 完整 CSS 覆盖        | 任意 CSS 对象            |
| 嵌套       | _hover / _focus 等       | 完整 CSS 选择器          |
| 性能       | 静态 prop 转 className   | 运行时计算              |
| 类型       | 完整 props 自动补全       | sx 对象动态             |

Chakra Style Props 比 MUI sx 更「props 化」，类型推导更友好。
-->

---
transition: fade-out
---

# Style Props（二）：字体 / 布局 / 动画

字体 / 布局 / 边框 / 动画 / SVG / Transform 全套

<v-click>

```tsx
<Box
  fontSize={{ base: "sm", md: "md" }}  // 主题字号
  fontWeight="semibold"                 // 字重 token
  fontFamily="heading"                  // 主题字体族
  lineHeight="tall"                     // 行高 token
  letterSpacing="wide"                  // 字间距
  textAlign="center"                    // 文字对齐
  textDecoration="underline"            // 下划线
  transform="rotate(45deg) scale(1.1)"  // CSS Transform
  transition="all 0.3s ease"            // 过渡动画
  filter="blur(2px)"                    // 滤镜
  backdropFilter="blur(8px)"            // 毛玻璃
  zIndex="modal"                        // 主题 z-index
  position="absolute"
  top="4"
  left="50%"
/>
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Style Props 第二批：字体 / 布局 / 动画 / 高级特性 ——

**字体类**（基于 theme.fontSizes / fontWeights / lineHeights）：
- fontSize / fontWeight / fontFamily / lineHeight / letterSpacing
- textAlign / textTransform / textDecoration / fontStyle
- textOverflow / textShadow / wordBreak / whiteSpace
- 别名：fz / fw / ff / lh / ls / ta / tt / td

token 值：
- fontSize：xs / sm / md / lg / xl / 2xl / 3xl / 4xl / 5xl / 6xl
- fontWeight：thin / light / normal / medium / semibold / bold / extrabold
- lineHeight：none / shorter / short / normal / tall / taller
- letterSpacing：tighter / tight / normal / wide / wider / widest

**布局类**：
- display：block / inline / flex / grid / inline-block / inline-flex / none
- position：relative / absolute / fixed / sticky
- top / left / right / bottom / inset
- float / clear
- overflow / overflowX / overflowY：visible / hidden / scroll / auto
- visibility：visible / hidden / collapse

**Flex 布局**：
- flex（shorthand）/ flexDirection / flexWrap / flexBasis / flexGrow / flexShrink
- alignItems / alignContent / alignSelf
- justifyContent / justifyItems / justifySelf
- gap / rowGap / columnGap

**Grid 布局**：
- gridTemplateColumns / gridTemplateRows / gridTemplateAreas
- gridColumn / gridRow / gridArea
- gridAutoColumns / gridAutoRows / gridAutoFlow
- placeItems / placeContent / placeSelf

**边框**（基于 theme.borders / radii）：
- border / borderTop / borderRight / borderBottom / borderLeft
- borderColor / borderStyle / borderWidth
- borderRadius / rounded（别名）：sm / md / lg / xl / full
- outline / outlineColor / outlineOffset

**动画 / Transform**：
- transition / transitionProperty / transitionDuration / transitionTimingFunction / transitionDelay
- transform / transformOrigin / transformStyle
- scale / scaleX / scaleY / rotate / translateX / translateY / skewX / skewY
- animation / animationName / animationDuration

**滤镜 / 效果**：
- filter / backdropFilter / blur / brightness / contrast / grayscale / saturate
- mixBlendMode / backgroundBlendMode
- opacity

**z-index**（基于 theme.zIndices）：
- zIndex 主题值：hide / auto / base / docked / dropdown / sticky / banner / overlay / modal / popover / skipLink / toast / tooltip

**SVG**：
- fill / stroke / strokeWidth / strokeLinecap / strokeLinejoin

200+ Style Props 是 Chakra 的「最大卖点」—— 几乎不需要写 CSS 文件，所有样式都通过 props 表达。
-->

---
transition: fade-out
---

# Conditional Style Props（一）：伪类

30+ 伪类 props，所有 CSS pseudo-class 全覆盖

<v-click>

```tsx
<Button
  bg="teal.500"
  color="white"
  _hover={{ bg: "teal.600", transform: "translateY(-2px)" }}
  _active={{ bg: "teal.700" }}
  _focus={{ boxShadow: "outline" }}
  _focusVisible={{ boxShadow: "outline", outline: "2px solid" }}
  _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
>
  提交
</Button>

<Input
  _placeholder={{ color: "gray.400" }}
  _invalid={{ borderColor: "red.500" }}
  _readOnly={{ bg: "gray.100" }}
  _autofill={{ bg: "yellow.100" }}
/>
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Conditional Style Props 是 Chakra 的「第二招牌」——

**交互状态**（基于 :pseudo-class）：
- `_hover`：鼠标悬浮
- `_active`：按下状态
- `_focus`：聚焦（含鼠标点击）
- `_focusVisible`：键盘聚焦（仅键盘 Tab）—— 推荐用于 outline
- `_focusWithin`：子元素聚焦时父元素响应
- `_disabled`：禁用状态

**实战例子**：

```tsx
<Button
  _hover={{ bg: "teal.600", transform: "scale(1.02)" }}
  _active={{ transform: "scale(0.98)" }}
  _focusVisible={{ outline: "2px solid", outlineColor: "teal.500" }}
  _disabled={{ opacity: 0.5, pointerEvents: "none" }}
>
  按钮
</Button>
```

**列表 / 选择**：
- `_first`：第一个子元素
- `_last`：最后一个
- `_odd`：奇数项（nth-child(odd)）
- `_even`：偶数项
- `_empty`：空内容
- `_checked`：复选框 / 单选框选中
- `_selected`：选项选中（Combobox / Tabs 等）

**表单 specific**：
- `_invalid`：校验失败
- `_valid`：校验通过
- `_required`：必填
- `_readOnly`：只读
- `_placeholder`：占位符样式
- `_placeholderShown`：占位符显示中
- `_autofill`：浏览器自动填充

**伪元素**（基于 ::pseudo-element）：
- `_before`：::before
- `_after`：::after
- `_firstLetter`：::first-letter
- `_firstLine`：::first-line
- `_selection`：::selection
- `_file`：::file-selector-button

**实战 _before**：

```tsx
<Box
  _before={{
    content: '"✨"',
    position: 'absolute',
    top: 0,
    left: 0,
  }}
>
  内容
</Box>
```

**嵌套支持**：

```tsx
<Button
  _hover={{
    bg: "teal.600",
    _disabled: { bg: "gray.500" },  // 嵌套：hover + disabled
    _dark: { bg: "teal.400" },      // 嵌套：hover + dark mode
  }}
>
  按钮
</Button>
```

Conditional Style Props 的设计哲学：把所有 CSS 选择器场景 props 化，不用写 selector 字符串。
-->

---
transition: fade-out
---

# Conditional Style Props（二）：色模式 / 媒体 / 群组

\_dark / \_light / \_groupHover / \_peerFocus / \_motionSafe 等

<v-click>

```tsx
// 色模式 props
<Box
  bg={{ base: "white", _dark: "gray.800" }}
  color={{ base: "gray.900", _dark: "gray.100" }}
  _osDark={{ borderColor: "gray.700" }}
>
  自动随色模式切换
</Box>

// 群组 props（类似 Tailwind group/peer）
<Box className="group">
  <Heading>父元素</Heading>
  <Text _groupHover={{ color: "teal.500" }}>父悬浮时子变色</Text>
</Box>

// 媒体查询 props
<Box
  _motionReduce={{ transition: "none" }}
  _print={{ display: "none" }}
  _portrait={{ flexDirection: "column" }}
/>
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Conditional Style Props 第二批：色模式 / 媒体 / 群组 / 数据 ——

**色模式**：
- `_dark`：暗色模式生效
- `_light`：亮色模式生效（少用，默认即 light）
- `_osDark`：操作系统偏好暗色（不论用户切换）
- `_osLight`：操作系统偏好亮色

**实战**：
```tsx
<Box bg={{ base: "white", _dark: "gray.800" }} />
```
即：light 是 white，dark 是 gray.800。Chakra 自动注入选择器：
- `.chakra-instance .css-xxx { background: white }`
- `.dark .chakra-instance .css-xxx { background: var(--chakra-colors-gray-800) }`

或者用 `_dark` 单独写：
```tsx
<Box bg="white" _dark={{ bg: "gray.800" }} />
```

两种写法等价，对象语法更紧凑。

**用户偏好（媒体查询）**：
- `_motionSafe`：用户不要求减少动画
- `_motionReduce`：用户偏好减少动画（无障碍）
- `_highContrast`：高对比度偏好
- `_lessContrast`：低对比度偏好

**实战 motion-reduce**：
```tsx
<Box
  transition="all 0.3s"
  _motionReduce={{ transition: "none" }}  // 用户禁用动画时无 transition
/>
```

这是「无障碍优秀实践」—— 尊重用户的 prefers-reduced-motion 设置。

**设备 / 媒体**：
- `_print`：打印样式
- `_portrait`：竖屏（移动端）
- `_landscape`：横屏

**实战 print**：
```tsx
<Button _print={{ display: "none" }}>下载按钮</Button>
```

打印时不显示按钮。

**方向**：
- `_ltr`：从左到右文本
- `_rtl`：从右到左文本（阿拉伯语 / 希伯来语）

**群组 props**（Tailwind group/peer 灵感）：
- `_groupHover`：父元素 `.group` hover 时子元素响应
- `_groupFocus`：父聚焦
- `_groupActive`：父激活
- `_groupDisabled`：父禁用
- `_peerHover`：兄弟元素 `.peer` hover 时响应（相邻兄弟选择器）
- `_peerFocus`：兄弟聚焦
- `_peerChecked`：兄弟 checked（input + label 模式）

**实战 group**：
```tsx
<Box className="group" _hover={{ borderColor: "teal.500" }}>
  <Heading>卡片标题</Heading>
  <Text _groupHover={{ color: "teal.500" }}>父悬浮时变色</Text>
  <Icon _groupHover={{ transform: "translateX(4px)" }} />
</Box>
```

**数据属性**：
- `_open`：data-state="open"
- `_closed`：data-state="closed"
- `_expanded`：aria-expanded="true"
- `_loading`：data-loading
- `_horizontal` / `_vertical`：data-orientation

Ark UI 组件大量使用 data-state / aria-* 属性，配合 _open / _closed / _expanded 可以精确控制状态样式。
-->

---
transition: fade-out
---

# createSystem + defineConfig

v3 主题入口，Panda CSS 启发的函数式管线

<v-click>

```tsx
// src/theme/system.ts
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: { 50: { value: "#e6fffa" }, 500: { value: "#319795" }, 900: { value: "#1d4044" } },
      },
      fonts: {
        heading: { value: '"Inter", sans-serif' },
        body: { value: '"Inter", sans-serif' },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] createSystem + defineConfig 是 v3 主题入口 ——

**v2 的 extendTheme 心智**：
```ts
import { extendTheme } from '@chakra-ui/react';
const theme = extendTheme({
  colors: { brand: { 500: '#319795' } },
  fonts: { heading: 'Inter' },
});
<ChakraProvider theme={theme}>...</ChakraProvider>
```

**v3 的 createSystem 心智**：
```ts
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
const config = defineConfig({
  theme: {
    tokens: {
      colors: { brand: { 500: { value: '#319795' } } },
      fonts: { heading: { value: 'Inter' } },
    },
  },
});
const system = createSystem(defaultConfig, config);
<ChakraProvider value={system}>...</ChakraProvider>
```

**三个变化**：

1. **token 值要 { value: ... }**：
   - v2：`{ 500: '#319795' }`
   - v3：`{ 500: { value: '#319795' } }`
   - 多写一层 value，但允许未来扩展（description / category 等元数据）
   - 类型推导更准

2. **createSystem 合并管线**：
   - createSystem(defaultConfig, businessConfig)
   - defaultConfig 是 Chakra 默认（colors / fonts / spacing 等内置）
   - businessConfig 是业务覆盖
   - 函数式合并，结果是 system 对象

3. **ChakraProvider value=system**：
   - 不再传 theme={theme}
   - 改传 value={system}
   - system 包含 token / recipe / className 等所有信息

**为什么这么改？**

Panda CSS 哲学：
- token 元数据化（不只是值，还有描述 / 类别）
- 函数式管线（defineConfig → createSystem → 注入）
- 类型推导优先（所有 token 自动生成类型，autocomplete 完整）

代价：
- 写法变啰嗦（多 value 层）
- 迁移工作量大

收益：
- 长期可扩展（未来加 token 元数据无需大改）
- 类型推导稳（autocomplete 准确率高）
- 跟 Panda / Tailwind 心智一致

**全局 CSS**：

```ts
const config = defineConfig({
  globalCss: {
    'body': {
      bg: 'bg',  // semantic token
      color: 'fg',
    },
  },
});
```

**条件**（暗色模式选择器）：

```ts
const config = defineConfig({
  conditions: {
    dark: '.dark &',  // 暗色模式选择器
  },
});
```

实战中，business config 主要改 tokens.colors（品牌色）+ recipes.button（变体）。其他大多用默认。
-->

---
transition: fade-out
---

# Recipes：组件变体

defineRecipe 声明 Button 这种单元素组件的 size / variant

<v-click>

```ts
import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  base: { display: "inline-flex", alignItems: "center", fontWeight: "semibold", borderRadius: "md" },
  variants: {
    variant: {
      solid: { bg: "brand.500", color: "white", _hover: { bg: "brand.600" } },
      outline: { borderWidth: "1px", borderColor: "brand.500", color: "brand.500" },
      ghost: { _hover: { bg: "brand.50" } },
    },
    size: {
      sm: { px: "3", py: "1", fontSize: "sm" },
      md: { px: "4", py: "2", fontSize: "md" },
      lg: { px: "6", py: "3", fontSize: "lg" },
    },
  },
  defaultVariants: { variant: "solid", size: "md" },
});
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Recipes 是 v3 的样式变体系统 ——

**核心心智**：
- Recipe = 一个组件的所有样式变体声明
- 单元素：defineRecipe（如 Button）
- 多元素：defineSlotRecipe（如 Card 有 root / header / body / footer）

**Recipe 5 个核心字段**：

1. **className**：组件 CSS 类名（默认 chakra-{component}）
2. **base**：基础样式（所有变体共有）
3. **variants**：变体集合（每个 key 是变体维度）
4. **compoundVariants**：组合变体（特定组合的额外样式）
5. **defaultVariants**：默认变体值

**变体的概念**：

```ts
variants: {
  variant: {            // 维度 1：variant
    solid: { ... },
    outline: { ... },
  },
  size: {               // 维度 2：size
    sm: { ... },
    md: { ... },
    lg: { ... },
  },
  colorPalette: {       // 维度 3：colorPalette（Chakra 内置）
    teal: { ... },
    blue: { ... },
  },
}
```

使用时组合：
```tsx
<Button variant="outline" size="lg" colorPalette="teal">提交</Button>
```

→ base 样式 + variant.outline + size.lg + colorPalette.teal 合并

**compoundVariants**（组合变体）：

```ts
compoundVariants: [
  {
    variant: 'outline',
    size: 'lg',
    css: { borderWidth: '2px' },  // 仅在 variant=outline AND size=lg 时生效
  },
]
```

**defaultVariants**（默认）：

```ts
defaultVariants: {
  variant: 'solid',
  size: 'md',
}
```

不传 prop 时用这个值。

**集成到 system**：

```ts
const config = defineConfig({
  theme: {
    recipes: {
      button: buttonRecipe,
    },
  },
});
```

**使用 useRecipe Hook**：

```tsx
import { useRecipe } from '@chakra-ui/react';
const recipe = useRecipe({ recipe: buttonRecipe });
const styles = recipe({ variant: 'solid', size: 'md' });
// styles 是 className + restProps
```

**对比 cva**（class-variance-authority）：

Chakra Recipe 是 cva 风格的实现：
- variants：维度
- defaultVariants：默认
- compoundVariants：组合

但有差异：
- cva 返回 className 字符串
- Chakra Recipe 集成 token / responsive / conditional props
- 更紧密集成 Chakra 系统

实战中：
- 业务用 Chakra 内置 Button → 通过 chakra Button 的 variant / size 即可
- 业务定制 Button 变体 → 在 config.theme.recipes.button 覆盖
- 业务全新组件 → defineRecipe + useRecipe / chakra factory 创建
-->

---
transient: fade-out
transition: fade-out
---

# Slot Recipes：多元素组件变体

defineSlotRecipe 声明 Card 这种多 slot 组件的变体

<v-click>

```ts
import { defineSlotRecipe } from "@chakra-ui/react";

export const cardRecipe = defineSlotRecipe({
  slots: ["root", "header", "body", "footer"],
  base: {
    root: { borderRadius: "md", overflow: "hidden", bg: "bg.subtle" },
    header: { p: "4", borderBottomWidth: "1px" },
    body: { p: "4" },
    footer: { p: "4", borderTopWidth: "1px" },
  },
  variants: {
    variant: {
      elevated: { root: { boxShadow: "md" } },
      outline: { root: { borderWidth: "1px" } },
    },
    size: {
      sm: { root: { fontSize: "sm" }, header: { p: "3" }, body: { p: "3" } },
      md: { root: { fontSize: "md" } },
    },
  },
  defaultVariants: { variant: "elevated", size: "md" },
});
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Slot Recipes 是 Recipes 的升级版 ——

**为什么需要 Slot Recipe？**

Button 是单元素，所有样式集中在一个 DOM 节点。
但 Card 有多个 slot：root（容器）/ header（头部）/ body（内容）/ footer（底部）。
变体可能对不同 slot 应用不同样式（如 size=sm 影响 header padding）。

defineSlotRecipe 解决这个问题：

```ts
defineSlotRecipe({
  slots: ['root', 'header', 'body', 'footer'],
  base: {
    root: { ... },
    header: { ... },
    body: { ... },
    footer: { ... },
  },
  variants: {
    variant: {
      elevated: {
        root: { boxShadow: 'md' },
        header: { borderBottom: '1px solid' },  // 也可以同时改 header
      },
    },
  },
})
```

每个变体值是 `{ slotName: { style } }` 对象，可以覆盖多个 slot。

**对应 sva**（slot-variance-authority）：
- Slot Recipe 是 cva 的多 slot 版本
- sva 是社区 cva 同作者推出的多 slot 工具
- Chakra Slot Recipe 跟 sva 心智一致

**集成到 system**：

```ts
const config = defineConfig({
  theme: {
    slotRecipes: {
      card: cardRecipe,
    },
  },
});
```

**使用 useSlotRecipe**：

```tsx
import { useSlotRecipe } from '@chakra-ui/react';
const slotRecipe = useSlotRecipe({ recipe: 'card' });
const styles = slotRecipe({ variant: 'elevated', size: 'md' });

// styles 是 { root: {...}, header: {...}, body: {...}, footer: {...} }
return (
  <chakra.div {...styles.root}>
    <chakra.div {...styles.header}>头</chakra.div>
    <chakra.div {...styles.body}>体</chakra.div>
    <chakra.div {...styles.footer}>尾</chakra.div>
  </chakra.div>
);
```

**实战场景**：

适合所有「多结构」组件：
- Card（root / header / body / footer）
- Alert（root / icon / title / description）
- Tabs（root / list / trigger / content / indicator）
- Combobox（root / trigger / content / item / label）
- Toast（root / title / description / closeTrigger）

Chakra 内置组件大多用 Slot Recipe 实现 —— 看源码就是大批 defineSlotRecipe。

业务定制场景：
- 项目所有 Card 都有自定义 border-radius / shadow → 覆盖 cardRecipe.base.root
- 新增 variant：variant="featured"（特殊标题 + 渐变背景）→ 加到 cardRecipe.variants

实战中：
- 80% 项目用 Chakra 默认 Slot Recipe（变体改一改）
- 20% 项目自定义全新 Slot Recipe（设计系统大改）
-->

---
transition: fade-out
---

# Token 体系：spacing / sizes / colors

createSystem 内置的核心 token —— colors / spacing / fonts / radii / shadows

<v-click>

```ts
const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e6fffa" }, 500: { value: "#319795" }, 900: { value: "#1d4044" },
        },
      },
      spacing: {
        xs: { value: "0.25rem" }, sm: { value: "0.5rem" }, md: { value: "1rem" },
      },
      fontSizes: {
        xs: { value: "0.75rem" }, sm: { value: "0.875rem" }, md: { value: "1rem" },
      },
      radii: { sm: { value: "0.125rem" }, md: { value: "0.375rem" }, lg: { value: "0.5rem" } },
      shadows: { sm: { value: "0 1px 2px rgb(0 0 0 / 0.05)" } },
      sizes: { container: { sm: { value: "640px" }, md: { value: "768px" } } },
    },
  },
});
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Token 是 Chakra UI 主题的「原子值」 ——

**核心 token 类别**：

1. **colors**：颜色
   - Chakra 默认提供 10 shade：50 / 100 / 200 / 300 / 400 / 500 / 600 / 700 / 800 / 900 / 950
   - 内置色板：gray / red / orange / yellow / green / teal / blue / cyan / purple / pink
   - 自定义：通过 tokens.colors.brand 添加

2. **spacing**：间距
   - 默认基于 4px 倍数：0 / 1 / 2 / 3 / 4 / 5 / 6 / 8 / 10 / 12 / 16 / 20 / 24 / 32
   - 1 = 0.25rem = 4px
   - 16 = 4rem = 64px

3. **fontSizes**：字号
   - xs / sm / md / lg / xl / 2xl / 3xl / 4xl / 5xl / 6xl / 7xl / 8xl / 9xl
   - xs = 0.75rem / md = 1rem / 6xl = 3.75rem

4. **fontWeights**：字重
   - hairline=100 / thin=200 / light=300 / normal=400 / medium=500 / semibold=600 / bold=700 / extrabold=800 / black=900

5. **lineHeights**：行高
   - none=1 / shorter=1.25 / short=1.375 / normal=1.5 / tall=1.625 / taller=2

6. **letterSpacings**：字间距
   - tighter / tight / normal / wide / wider / widest

7. **radii**：圆角
   - none=0 / sm / md / lg / xl / 2xl / 3xl / full=9999px

8. **shadows**：阴影
   - xs / sm / md / lg / xl / 2xl / outline / inner / none

9. **sizes**：尺寸
   - 0 / px / 0.5 / 1 / 1.5 / ... / 96 / max / min / full / vw / vh
   - container：sm=640px / md=768px / lg=1024px / xl=1280px

10. **breakpoints**：断点
    - sm=640px / md=768px / lg=1024px / xl=1280px / 2xl=1536px

11. **zIndices**：z-index
    - hide=-1 / base=0 / docked=10 / dropdown=1000 / sticky=1100 / banner=1200 / overlay=1300 / modal=1400 / popover=1500 / skipLink=1600 / toast=1700 / tooltip=1800

12. **borders**：边框 shorthand
    - none / sm=1px solid / md / lg

13. **borderWidths**：边框宽度
    - 0 / 1 / 2 / 4 / 8

14. **borderStyles**：边框样式
    - solid / dashed / dotted

15. **transitions**：过渡 shorthand
    - duration: fastest=50ms / faster=100ms / fast=150ms / normal=200ms / slow=300ms / slower=400ms / slowest=500ms
    - timing function: ease-in / ease-out / ease-in-out

**使用 token**：

业务直接用 token key：
```tsx
<Box p="md" bg="brand.500" borderRadius="lg" boxShadow="md" />
```

底层会编译为：
```css
.css-xxx {
  padding: var(--chakra-spacing-md);
  background: var(--chakra-colors-brand-500);
  border-radius: var(--chakra-radii-lg);
  box-shadow: var(--chakra-shadows-md);
}
```

**通过 system.token() 访问**：

```ts
const value = system.token('colors.brand.500');  // "#319795"
const varName = system.token.var('colors.brand.500');  // "var(--chakra-colors-brand-500)"
```

实战中，token 是「主题切换」的基础 —— 改一个 token 全局生效。
-->

---
transition: fade-out
---

# Semantic Tokens：语义化 token

引用其他 token，按色模式 / 状态自动切换

<v-click>

```ts
const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        // 简单引用
        primary: { value: "{colors.brand.500}" },
        // 条件引用：按色模式自动切换
        bg: { value: { base: "{colors.white}", _dark: "{colors.gray.900}" } },
        fg: { value: { base: "{colors.gray.900}", _dark: "{colors.gray.50}" } },
        muted: { value: { base: "{colors.gray.500}", _dark: "{colors.gray.400}" } },
      },
    },
  },
});

// 使用：bg / fg / muted 自动按 color mode 切换
<Box bg="bg" color="fg" borderColor="muted" />
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Semantic Tokens 是 token 之上的「语义层」 ——

**为什么需要 semantic tokens？**

Token 是「原子值」（colors.gray.500 = #6b7280），没有业务含义。
Semantic Token 是「语义值」（muted = colors.gray.500 in light / colors.gray.400 in dark），有业务含义。

业务代码用语义 token：
```tsx
<Box bg="bg" color="fg" borderColor="muted" />
```

切换色模式时，semantic token 自动切换底层值：
- light：bg = white / fg = gray.900 / muted = gray.500
- dark：bg = gray.900 / fg = gray.50 / muted = gray.400

业务代码完全无感，但视觉自动跟随。

**Semantic Token 语法**：

简单引用：
```ts
primary: { value: '{colors.brand.500}' }  // 引用 colors.brand.500
```

条件引用（按色模式）：
```ts
bg: {
  DEFAULT: { value: '{colors.white}' },        // 默认 light
  _dark: { value: '{colors.gray.900}' },       // 暗色模式
}
```

更复杂条件（按状态）：
```ts
text: {
  DEFAULT: { value: '{colors.gray.900}' },
  _hover: { value: '{colors.gray.700}' },      // hover 状态
  _disabled: { value: '{colors.gray.400}' },   // 禁用状态
}
```

**Chakra 内置 semantic tokens**：

v3 默认提供一批 semantic tokens：
- bg / bg.subtle / bg.muted / bg.emphasized
- fg / fg.muted / fg.subtle / fg.inverted
- border / border.subtle / border.muted
- accent / accent.subtle
- danger / warning / success / info（各 4 个）

业务直接用：
```tsx
<Card bg="bg.subtle" borderColor="border.subtle">
  <Text color="fg">主要文字</Text>
  <Text color="fg.muted">次要文字</Text>
</Card>
```

无需写 _dark prop，色模式自动切换。

**colorPalette 虚拟 token**：

Chakra 还有「colorPalette」机制：
```tsx
<Button colorPalette="teal" variant="solid">按钮</Button>
```

`colorPalette="teal"` 等于「这个组件用 teal 系列」：
- variant.solid 内部用 `bg: 'colorPalette.500'` → 渲染时变成 `bg: 'teal.500'`
- 切换 colorPalette → 整个组件配色变

业务实战：
- 危险按钮：colorPalette="red"
- 成功提示：colorPalette="green"
- 强调链接：colorPalette="blue"

这套机制让「换色」极其便利 —— 不需要重写所有 _hover / _focus 等。

**最佳实践**：

- 业务样式 → 用 semantic tokens（bg / fg / muted / accent）
- 强调 / 危险 / 成功等场景 → 用 colorPalette
- 自定义品牌色 → 加到 tokens.colors.brand
- 自定义语义 → 加到 semanticTokens.colors.xxx

这样色模式 / 品牌色 / 状态切换都通过 token 完成，业务代码不依赖具体颜色值。
-->

---
transition: fade-out
---

# 130+ 组件分类速览（一）

Layout / Typography / Buttons / Forms / Collections / Date

<v-click>

| 分类       | 数量 | 代表组件                                          |
| ---------- | ---- | ------------------------------------------------- |
| Layout     | 16   | Box / Flex / Grid / Stack / HStack / VStack       |
| Typography | 14   | Heading / Text / Link / Code / Highlight / Prose  |
| Buttons    | 4    | Button / IconButton / CloseButton / DownloadTrigger |
| Forms      | 20   | Input / Field / Checkbox / Radio / Switch / Slider |
| Collections | 4    | Combobox / Listbox / Select / Tree View          |
| Date       | 2    | Calendar / DatePicker                             |

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Chakra UI v3 组件分类速览（上半 6 类）：

**Layout（16 个）—— 布局基础**：
- Box：通用容器，所有 Style Props 全集
- Flex：display=flex 简写
- Grid：display=grid 简写
- Stack：垂直/水平堆叠
- HStack / VStack：水平/垂直堆叠
- Container：响应式容器（最大宽度限制）
- Center：水平+垂直居中
- SimpleGrid：等分网格（columns / minChildWidth）
- AbsoluteCenter：绝对居中
- Float：定位浮动元素
- AspectRatio：纵横比容器（视频 / 图片）
- Bleed：超出容器边缘
- Spacer：弹性间距（Flex / Stack 内用）
- Group：组合相邻控件
- Divider：分隔符
- Stat（v3 移到 Data Display 但布局相关）

**Typography（14 个）—— 文本**：
- Heading：h1-h6
- Text：通用文本（p / span / div 等）
- Link：a 标签 + 主题色
- Code：行内代码
- Code Block：代码块（多行）
- Kbd：键盘按键
- Highlight：高亮文本片段
- Prose：长文章排版（Tailwind Typography 风）
- Mark：::mark 高亮
- Em / Strong / Small / Sub / Sup：HTML 语义标签
- Rich Text Editor：富文本编辑器（基于 Tiptap）

**Buttons（4 个）—— 按钮**：
- Button：通用按钮（variant / size / colorPalette）
- IconButton：图标按钮
- CloseButton：关闭按钮（弹窗内常用）
- DownloadTrigger：下载触发器（处理 href + filename）

**Forms（20 个）—— 表单**：
- Input：基础输入框
- Textarea：多行输入
- Field：表单字段容器（Label / HelperText / ErrorText）
- Fieldset：表单字段组
- Checkbox / CheckboxCard / CheckboxGroup：复选框
- Radio / RadioCard / RadioGroup：单选
- Switch：开关
- Slider / RangeSlider：滑块
- NumberInput：数字输入
- PinInput：PIN 码输入
- Select / NativeSelect：下拉选择
- FileUpload：文件上传
- ColorPicker：颜色选择器
- Rating：评分
- Editable：内联可编辑文本

**Collections（4 个）—— 集合 / 选择**：
- Combobox：自动补全（Autocomplete）
- Listbox：列表选择
- Select：现代 Select（替代 NativeSelect）
- Tree View：树形结构

**Date（2 个）—— 日期**：
- Calendar：日历
- DatePicker：日期选择器（Calendar + Input）
-->

---
transition: fade-out
---

# 130+ 组件分类速览（二）

Overlays / Disclosure / Feedback / Data Display / Utilities

<v-click>

| 分类         | 数量 | 代表组件                                          |
| ------------ | ---- | ------------------------------------------------- |
| Overlays     | 9    | Dialog / Drawer / Popover / Menu / Tooltip / Toast |
| Disclosure   | 6    | Accordion / Tabs / Steps / Pagination / Carousel  |
| Feedback     | 8    | Alert / Progress / Spinner / Skeleton / Empty State |
| Data Display | 14   | Table / Card / Avatar / Badge / Stat / Timeline   |
| Media        | -    | Image / Video / QrCode / Icon                     |
| Utilities    | 8+   | Portal / Show / ClientOnly / VisuallyHidden       |

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Chakra UI v3 组件分类速览（下半 5 类）：

**Overlays（9 个）—— 浮层**：
- Dialog：模态弹窗（替代 v2 Modal）
- Drawer：抽屉
- Popover：弹出气泡
- Menu：菜单
- Tooltip：提示
- Toast / Toaster：消息通知
- HoverCard：悬浮卡片
- ContextMenu：右键菜单
- ScrollArea：自定义滚动条

**Disclosure（6 个）—— 展开/折叠**：
- Accordion：手风琴
- Tabs：选项卡
- Pagination：分页
- Steps：步骤条
- Breadcrumb：面包屑
- Carousel：轮播
- Tour：引导教程

**Feedback（8 个）—— 反馈**：
- Alert：警告 / 提示
- Progress / ProgressCircle：进度条 / 环形进度
- Spinner：加载动画
- Skeleton：骨架屏
- Toast：消息通知（也归 Overlays）
- Empty State：空状态
- Status：状态点（圆点 + 颜色）

**Data Display（14 个）—— 数据展示**：
- Table：表格
- Card：卡片
- Avatar / AvatarGroup：头像
- Badge：徽章
- Stat：统计数字（label + value + indicator）
- Timeline：时间线
- Tag：标签
- Icon：图标包装器
- Bullet List：项目符号列表
- List：通用列表
- Description List：描述列表
- Data List：数据列表
- Definitionn List：定义列表
- Indicator：指示器

**Media（4 个）—— 媒体**：
- Image：图片（带 fallback / lazy）
- Video：视频
- QrCode：二维码
- Icon / Iconify：图标

**Utilities（8+）—— 工具**：
- Portal：传送门（渲染到 document.body）
- Show：条件渲染（when prop）
- ClientOnly：仅客户端渲染
- VisuallyHidden：视觉隐藏但屏幕阅读器可见
- For：循环渲染（each prop）
- Presence：动画 presence（mount/unmount）
- Format / FormatByte / FormatNumber：格式化文本
- Environment：env detection
- LocaleProvider：i18n

**总计 ~130+ 组件**，覆盖所有 UI 场景。

跟 Mantine 120+ / MUI 60+ / Ant Design 70+ 对比：
- Chakra 数量最多
- 分类最细（11 大组）
- 高级组件齐全（Tree View / Carousel / Tour / Steps）
- Headless 内核（Ark UI）保证质量

业务实战中，常用 30-50 个组件，其他按需引入。
-->

---
transition: fade-out
---

# Compound Components 完整示例

Dialog 命名空间 —— Root / Trigger / Backdrop / Content

<v-click>

```tsx
import { Dialog, Button, Portal } from "@chakra-ui/react";
import { useState } from "react";

function DemoDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild><Button>打开弹窗</Button></Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger />
            <Dialog.Header><Dialog.Title>标题</Dialog.Title></Dialog.Header>
            <Dialog.Body>内容</Dialog.Body>
            <Dialog.Footer><Button onClick={() => setOpen(false)}>关闭</Button></Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Compound Components 是 v3 的「核心模式」 ——

**Dialog 完整结构**（v3 新 API）：

- `Dialog.Root`：根组件，管理 open 状态
- `Dialog.Trigger`：触发器（按钮 / 链接），点击打开弹窗
- `Dialog.Backdrop`：遮罩层
- `Dialog.Positioner`：定位容器（用于 Portal）
- `Dialog.Content`：内容容器
- `Dialog.CloseTrigger`：关闭按钮（一般是右上角 X）
- `Dialog.Header` / `Dialog.Title` / `Dialog.Description`：头部
- `Dialog.Body`：主体
- `Dialog.Footer`：底部

**vs v2 平铺 API**：

```tsx
// v2（已废弃）
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>标题</ModalHeader>
    <ModalCloseButton />
    <ModalBody>内容</ModalBody>
    <ModalFooter>
      <Button onClick={onClose}>关闭</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

差异：
- v2：6 个独立组件 import
- v3：1 个 Dialog import + 命名空间访问

**onOpenChange 是 Ark UI 标准 callback**：

Ark UI 的所有状态变化都通过 onXxxChange 上报：
- `open: boolean` + `onOpenChange: (details: { open: boolean }) => void`
- `value: string` + `onValueChange: (details: { value: string }) => void`
- `checked: boolean` + `onCheckedChange: (details: { checked: boolean }) => void`

注意是「details 对象」而不是直接传 boolean —— 给未来扩展元数据空间。

**Portal 包裹**：

Dialog / Drawer / Menu 等浮层组件都建议放 Portal 内：
- 避免被父元素 overflow / z-index 限制
- 渲染到 document.body 下
- v3 跟 v2 一样支持 Portal

但有 snippet 简化的 wrapper（Dialog 等组件 snippet 默认带 Portal）。

**asChild 与 Trigger**：

`Dialog.Trigger asChild` 把 Trigger 的事件 / 状态转嫁到子元素：
```tsx
<Dialog.Trigger asChild>
  <Button>打开</Button>
</Dialog.Trigger>
```

→ Button 自带 onClick / aria-expanded 等 Trigger 行为，但渲染的是 Button 自己的样式 / 结构。

不用 asChild 时，Dialog.Trigger 默认渲染 button 元素：
```tsx
<Dialog.Trigger>打开</Dialog.Trigger>
// 渲染：<button aria-haspopup="dialog" aria-expanded="false">打开</button>
```

但若想用 Chakra Button 的样式，就 `asChild` 包 Button。

**snippet 简化**：

实战中 snippet CLI 复制 `dialog.tsx` wrapper：
```tsx
<DialogRoot>
  <DialogTrigger asChild><Button>打开</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>标题</DialogTitle></DialogHeader>
    <DialogBody>内容</DialogBody>
    <DialogFooter>底部</DialogFooter>
  </DialogContent>
</DialogRoot>
```

snippet wrapper 内部已经包了 Portal / Backdrop / Positioner / CloseTrigger，写起来更顺手。
-->

---
transition: fade-out
---

# asChild Prop：Slot 模式

把组件功能转嫁到子元素，灵活组合

<v-click>

```tsx
// 不用 asChild：渲染 Chakra 默认元素（button）
<Dialog.Trigger>打开</Dialog.Trigger>
// → <button aria-haspopup="dialog">打开</button>

// 用 asChild：渲染子元素，但子元素带上 Trigger 行为
<Dialog.Trigger asChild>
  <Button colorPalette="teal" size="lg">打开</Button>
</Dialog.Trigger>
// → <button class="chakra-button" aria-haspopup="dialog">打开</button>

// asChild + 自定义组件（Next.js Link）
<Tabs.Trigger value="profile" asChild>
  <Link href="/profile">个人资料</Link>
</Tabs.Trigger>

// asChild + Tooltip（任意元素包 Tooltip）
<Tooltip.Trigger asChild>
  <IconButton aria-label="搜索"><LuSearch /></IconButton>
</Tooltip.Trigger>
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] asChild 是 v3 从 Radix UI 借来的「Slot 模式」 ——

**asChild 解决的问题**：

不用 asChild：
```tsx
<Dialog.Trigger>打开</Dialog.Trigger>
```

Chakra 渲染默认元素（button）。但如果想用：
- Chakra Button 的样式 / 变体
- Next.js Link 的路由能力
- 自定义组件

直接放进去会 wrap 多层 DOM，影响样式 / a11y。

用 asChild：
```tsx
<Dialog.Trigger asChild>
  <Button>打开</Button>
</Dialog.Trigger>
```

Chakra 把 Trigger 的「事件 + props」转嫁到子元素 Button 上，渲染的还是 Button 自己。
最终 DOM：`<button class="chakra-button" aria-haspopup="dialog">打开</button>`

**asChild 工作原理**：

1. 父组件不渲染自己的 DOM 元素
2. 父组件把 props（onClick / aria-* / data-* / ref 等）传给子元素
3. 子元素负责渲染最终 DOM
4. 子元素必须是「单一元素」且能接收 props

**子元素必须 forwardRef**：

```tsx
// 自定义组件作子元素时必须 forwardRef
const MyButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <button ref={ref} {...props} />;
});

// 然后才能：
<Dialog.Trigger asChild>
  <MyButton>打开</MyButton>
</Dialog.Trigger>
```

如果不 forwardRef，asChild 会 warning（无法转嫁 ref）。

**常见场景**：

1. **包装 Chakra Button**：
```tsx
<Dialog.Trigger asChild>
  <Button variant="solid" colorPalette="teal">打开</Button>
</Dialog.Trigger>
```

2. **包装 Next.js Link**（路由）：
```tsx
<Link href="/profile" passHref legacyBehavior>
  <Tabs.Trigger value="profile" asChild>
    <a>个人资料</a>
  </Tabs.Trigger>
</Link>
// 或者更直接（Next.js 13+）：
<Tabs.Trigger value="profile" asChild>
  <Link href="/profile">个人资料</Link>
</Tabs.Trigger>
```

3. **包装 Icon Only Button**：
```tsx
<Tooltip.Trigger asChild>
  <IconButton aria-label="搜索"><LuSearch /></IconButton>
</Tooltip.Trigger>
<Tooltip.Content>搜索数据</Tooltip.Content>
```

4. **包装自定义组件**：
```tsx
<Popover.Trigger asChild>
  <CustomCard {...props} />
</Popover.Trigger>
```

**与 as prop 的区别**：

v2 时代用 `as` prop 改变渲染的 HTML 元素：
```tsx
<Button as="a" href="/link">链接按钮</Button>
```

v3 仍支持 `as`，但更推荐 `asChild`：
- `as` 改变渲染元素，但需要传所有 props 到新元素
- `asChild` 完全把控制权交给子元素，更灵活
- Radix / Ark UI 主推 `asChild` 模式

**注意事项**：

- 子元素必须是「能接收 props 的组件」（forwardRef）
- 子元素必须是「单一元素」（不能是 Fragment 包多个）
- 父组件的 className / style 会跟子元素的合并（className 拼接，style 合并）

实战中，asChild 是「组合组件」必备 —— Trigger / Anchor / Item 等大量场景都用它。
-->

---
transition: fade-out
---

# Form + React Hook Form + Zod

Field 组件 + RHF + Zod schema —— 业界主流方案

<v-click>

```tsx
import { Field, Input, Button, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({ name: z.string().min(1, "请输入姓名"), email: z.email() });

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  return (
    <form onSubmit={handleSubmit((d) => console.log(d))}>
      <Stack gap="4">
        <Field.Root invalid={!!errors.name}>
          <Field.Label>姓名</Field.Label>
          <Input {...register("name")} />
          <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
        </Field.Root>
        <Button type="submit">提交</Button>
      </Stack>
    </form>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Chakra v3 + React Hook Form + Zod 是 React 表单的「现代标配」 ——

**为什么 Chakra 没有自己的 form 库？**

跟 Mantine 不一样，Chakra 团队不维护 form 库。
理由：
- React Hook Form 已经是事实标准（25K+ star，下载量 React form 库 Top 1）
- 不重复造轮子
- 用 Field 组件 + RHF + Zod 已经足够覆盖业务

**Field 组件结构**：

```tsx
<Field.Root invalid={hasError} required>
  <Field.Label>
    姓名
    <Field.RequiredIndicator />
  </Field.Label>
  <Input {...register('name')} />
  <Field.HelperText>请输入您的真实姓名</Field.HelperText>
  <Field.ErrorText>姓名为必填项</Field.ErrorText>
</Field.Root>
```

子组件：
- `Field.Root`：容器，接收 invalid / required / disabled / orientation
- `Field.Label`：标签
- `Field.RequiredIndicator`：必填标记（默认 *）
- `Field.HelperText`：辅助文本（描述 / 提示）
- `Field.ErrorText`：错误信息（invalid=true 时显示）
- `Field.ErrorIcon`：错误图标

a11y 自动注入：
- Label 自动 for=input.id
- Input 自动 aria-invalid / aria-describedby
- HelperText / ErrorText 自动 id 关联

**集成 RHF**：

```tsx
const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
  resolver: zodResolver(schema),
});

<Field.Root invalid={!!errors.name}>
  <Field.Label>姓名</Field.Label>
  <Input {...register('name')} />
  <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
</Field.Root>
```

- `register("name")` 返回 `{ onChange, onBlur, name, ref }` → spread 到 Input
- `errors.name?.message` 是 Zod 校验信息

**集成 Zod**：

```tsx
const schema = z.object({
  name: z.string().min(1, '请输入姓名'),
  email: z.email('邮箱格式错误'),
  age: z.number().min(18, '需满 18 岁'),
  agreement: z.literal(true, { message: '请勾选同意协议' }),
});

type FormValues = z.infer<typeof schema>;  // 类型自动推导
```

**Controlled 组件场景**：

像 Select / Combobox / DatePicker 这种不能直接 register 的组件，用 Controller：
```tsx
import { Controller } from 'react-hook-form';

<Controller
  name="country"
  control={control}
  render={({ field }) => (
    <Select.Root
      value={field.value ? [field.value] : []}
      onValueChange={(e) => field.onChange(e.value[0])}
      items={countries}
    >
      <Select.Trigger>...</Select.Trigger>
    </Select.Root>
  )}
/>
```

**与 Standard Schema**：

Zod v4 已经实现 Standard Schema。如果 RHF 支持 Standard Schema（v8+），可以省 zodResolver：
```tsx
const { register } = useForm({ resolver: schema });  // 未来：直接传 schema
```

但当前（2025.5）RHF 还是 resolver 模式，需要 @hookform/resolvers/zod。

**为什么 Chakra v3 + RHF + Zod 是组合的？**

- Chakra Field：负责样式 + a11y
- RHF：负责状态管理 + 性能优化（uncontrolled inputs，re-render 极少）
- Zod：负责 schema 校验 + 类型推导

三者职责清晰，无重叠。这是 React 表单的 2025 主流组合。
-->

---
transition: fade-out
---

# Toast + Menu + Tabs

业务高频组件 —— Toast 全局通知 / Menu 菜单 / Tabs 选项卡

<v-click>

```tsx
// Toast —— 全局通知（snippet 生成 toaster 实例）
import { toaster } from "@/components/ui/toaster";
toaster.create({ title: "保存成功", type: "success" });

// Menu —— 下拉菜单
<Menu.Root>
  <Menu.Trigger asChild><Button>操作</Button></Menu.Trigger>
  <Menu.Positioner>
    <Menu.Content>
      <Menu.Item value="edit">编辑</Menu.Item>
      <Menu.Item value="delete" color="red.500">删除</Menu.Item>
    </Menu.Content>
  </Menu.Positioner>
</Menu.Root>

// Tabs —— 选项卡
<Tabs.Root defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">概览</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="overview">概览内容</Tabs.Content>
</Tabs.Root>
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 三大业务高频组件的 v3 用法 ——

**Toast（v3 大改）**：

v2 用 useToast hook：
```tsx
const toast = useToast();
toast({ title: '成功', status: 'success' });
```

v3 用 toaster object（snippet 生成）：
```tsx
// src/components/ui/toaster.tsx 由 snippet 生成
export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
});

// 业务代码
import { toaster } from '@/components/ui/toaster';
toaster.create({ title: '保存成功', type: 'success' });
toaster.create({ title: '错误', description: '网络异常', type: 'error', duration: 5000 });
toaster.promise(saveAsync, {
  loading: { title: '保存中...' },
  success: { title: '保存成功' },
  error: { title: '保存失败' },
});
```

**Toast 类型**：
- type: 'info' / 'success' / 'warning' / 'error' / 'loading'
- duration：自动消失时间（ms），null = 不消失
- placement：top / top-start / top-end / bottom / bottom-start / bottom-end / center

**Toast.promise**：
- 异步操作的 Toast 转换
- loading → success / error 自动切换
- 类似 react-hot-toast 的 promise API

**Menu（v3 命名空间）**：

```tsx
<Menu.Root>
  <Menu.Trigger asChild><Button>操作</Button></Menu.Trigger>
  <Menu.Positioner>
    <Menu.Content>
      <Menu.Item value="edit">编辑</Menu.Item>
      <Menu.Item value="duplicate">复制</Menu.Item>
      <Menu.Separator />
      <Menu.Item value="delete" color="red.500">删除</Menu.Item>
    </Menu.Content>
  </Menu.Positioner>
</Menu.Root>
```

进阶：
- `Menu.ItemGroup` + `Menu.ItemGroupLabel`：分组
- `Menu.CheckboxItem` / `Menu.RadioItemGroup`：选择型 item
- `Menu.SubmenuRoot` + `Menu.SubmenuTrigger`：嵌套菜单
- `Menu.Item disabled`：禁用项

事件处理：
```tsx
<Menu.Item value="delete" onSelect={() => handleDelete()}>删除</Menu.Item>
// 或者用 onValueChange
<Menu.Root onValueChange={(e) => handleAction(e.value)}>...
```

**Tabs（v3 命名空间）**：

```tsx
<Tabs.Root defaultValue="overview" variant="line">
  <Tabs.List>
    <Tabs.Trigger value="overview">概览</Tabs.Trigger>
    <Tabs.Trigger value="details">详情</Tabs.Trigger>
    <Tabs.Trigger value="history">历史</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="overview">概览内容</Tabs.Content>
  <Tabs.Content value="details">详情内容</Tabs.Content>
  <Tabs.Content value="history">历史内容</Tabs.Content>
</Tabs.Root>
```

变体：
- variant: line（默认下划线）/ enclosed / outline / subtle / plain
- size: sm / md / lg
- orientation: horizontal / vertical
- fitted：撑满
- defaultValue / value（受控）

**Tabs.Indicator** 是 v3 新特性 —— 活动 tab 的指示器（动画跟随）。

这三个组件覆盖业务 80% 的「弹层 + 菜单 + 选项卡」场景，是中后台首选组件。
-->

---
transition: fade-out
---

# Color Mode：next-themes 集成

useColorMode / ColorModeButton / \_dark prop 三大用法

<v-click>

```tsx
// 1. 用 useColorMode（snippet 提供）
import { useColorMode } from "@/components/ui/color-mode";
function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  return <Button onClick={toggleColorMode}>切到 {colorMode === "dark" ? "亮" : "暗"}色</Button>;
}

// 2. 用 ColorModeButton（snippet 提供的 IconButton）
import { ColorModeButton } from "@/components/ui/color-mode";
<ColorModeButton />

// 3. 用 _dark Style Prop（无需 hook）
<Box
  bg={{ base: "white", _dark: "gray.900" }}
  color={{ base: "gray.900", _dark: "gray.50" }}
  borderColor={{ base: "gray.200", _dark: "gray.700" }}
>
  自动随色模式切换
</Box>
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v3 的色模式跟 v2 完全不同 —— 改用 next-themes ——

**v2 自有 ColorMode**：
- `<ColorModeProvider>` 自有 Provider
- `useColorModeValue('light', 'dark')` 返回值
- `useColorMode` hook 切换
- 内置 storage / SSR 处理

**v3 用 next-themes**：
- ThemeProvider 来自 next-themes
- useColorMode 是 wrapper（snippet 生成）
- 业务代码用法基本一致

**为什么改？**

- next-themes 已经是 React 生态标准（Mantine / shadcn 同款）
- 防 SSR 闪烁 / localStorage 持久化 / 系统色模式联动都成熟
- Chakra 不重复造轮子
- 跨框架（Next.js / Remix / Vite / Astro）适配

**三大用法**：

**1. useColorMode hook**：
```tsx
const { colorMode, setColorMode, toggleColorMode } = useColorMode();
// colorMode: 'light' | 'dark'
// setColorMode('light' | 'dark' | 'system')
// toggleColorMode(): light <-> dark
```

适合：业务逻辑判断当前 mode + 切换控制。

**2. ColorModeButton 组件**（snippet 生成）：
```tsx
<ColorModeButton />
// 渲染：图标按钮，点击切换
```

适合：导航栏 / 设置面板的「主题切换」入口，开箱即用。

**3. _dark Style Prop**：
```tsx
<Box bg="white" _dark={{ bg: "gray.900" }}>
  内容
</Box>
```

或对象语法：
```tsx
<Box bg={{ base: "white", _dark: "gray.900" }}>
  内容
</Box>
```

适合：所有视觉样式，无需 hook。

**底层机制**：

next-themes 给 html 加 class：
- 亮色：`<html class="light">`
- 暗色：`<html class="dark">`

Chakra 在生成 CSS 时注入暗色选择器：
```css
.css-xxx { background: white; }
.dark .css-xxx { background: var(--chakra-colors-gray-900); }
```

切换 mode = 改 html.class → 浏览器原生重绘 → 0 React 重渲染。

**useColorModeValue hook**（v2 兼容）：

```tsx
const bg = useColorModeValue('white', 'gray.900');
<Box bg={bg} />
```

snippet 也会生成这个 hook 作 wrapper。但推荐用 `_dark` Style Prop —— 性能更好。

**SSR 防闪烁**：

next-themes 内置 inline script：
- 在 HTML head 同步执行
- 读 localStorage 的 mode
- 设 html.class
- React hydration 之前完成
- 无闪烁

**LightMode / DarkMode 强制组件**：

```tsx
import { LightMode, DarkMode } from "@/components/ui/color-mode";

<DarkMode>
  <Card>不管全局 mode，此处永远暗色</Card>
</DarkMode>
```

适合「特殊区域不跟全局色模式」场景（如夜间模式的 Hero 区永远暗）。

**配合 LocalStorageKey**：
- 默认 storageKey="theme"
- 可以改：next-themes 的 storageKey prop
- 多个应用共享色模式 → 用同一 key

实战中：业务样式用 `_dark` Style Prop（性能好），交互控件用 ColorModeButton（开箱即用），自定义切换逻辑用 useColorMode hook。
-->

---
transition: fade-out
---

# Ark UI Headless 底层

跨框架（React / Solid / Vue / Svelte）共享行为原语

<v-click>

```tsx
// Chakra UI 组件 = Ark UI 行为 + Chakra 样式
import { Combobox } from "@chakra-ui/react";
// 底层：import { combobox } from '@ark-ui/react';

// 直接用 Ark UI（无样式）：
import { Combobox as ArkCombobox } from "@ark-ui/react";
<ArkCombobox.Root items={items} onValueChange={(e) => handle(e.value)}>
  <ArkCombobox.Input />
  <ArkCombobox.Trigger>▼</ArkCombobox.Trigger>
  <ArkCombobox.Content>
    {items.map((item) => (
      <ArkCombobox.Item item={item} key={item.value}>
        <ArkCombobox.ItemText>{item.label}</ArkCombobox.ItemText>
      </ArkCombobox.Item>
    ))}
  </ArkCombobox.Content>
</ArkCombobox.Root>
// → 完全无样式，但 a11y / 状态机 / 键盘完整
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Ark UI 是 Chakra v3 真正的底层 ——

**什么是 Ark UI？**

Ark UI 是 Chakra 团队同时维护的「无样式 + 无障碍」组件库：
- 提供组件「行为」（状态机 / 键盘 / a11y）
- 不提供样式（无 CSS）
- 跨框架：React / Solid / Vue / Svelte / Lit
- 同一套 API 心智，多框架实现

官网：https://ark-ui.com

**为什么 Chakra v3 用 Ark UI？**

v2 之前 Chakra 行为是自己实现的，多框架不能共享。
v3 把行为下沉到 Ark UI：
- 跨框架共享（React / Solid / Vue / Svelte / Lit）
- a11y 由 Ark 维护，质量更稳
- Chakra 只需要专注 Style Props + Recipes 上层

类似关系：
- Radix UI Primitives → shadcn UI（React 专属）
- Ark UI → Chakra UI（跨框架）

**Ark UI 跟 Radix 的差异**：

| 维度       | Radix UI Primitives    | Ark UI               |
| ---------- | ---------------------- | -------------------- |
| 框架支持   | React only             | **React/Solid/Vue/Svelte/Lit** |
| 状态机     | 内部实现               | **XState 公开状态机**         |
| 命名风格   | `*Root` / `*Trigger`   | 同 Radix              |
| 主要 wrapper | shadcn UI            | **Chakra UI / Park UI**       |

**用 Ark UI 直接做 UI**（不依赖 Chakra）：

```tsx
import { Combobox } from '@ark-ui/react';
// 完全无样式，自己写 CSS / Tailwind / Panda CSS
```

适合：
- 设计系统团队（要从零定制）
- 不喜欢 Chakra Style Props 心智
- 跨框架团队（同事用 React + Vue）

**Park UI**（Ark UI 上的另一个项目）：

- Park UI 是 Ark UI + Panda CSS 的官方设计系统
- 提供 Token + Recipes + 视觉风格（可改）
- 不像 Chakra 那样有 Style Props
- 适合「设计师 + 工程师」共建设计系统

**Chakra UI vs Park UI**：

- Chakra：上层 Style Props + Recipes，业务上手快
- Park UI：底层 Tokens + Recipes（无 Style Props），定制空间大

两者都是 Ark UI 之上的实现，业务可根据团队偏好选择。

**Chakra 的双层使用**：

虽然 Chakra 用 Ark UI 作底层，但业务层暴露：
- `import { Combobox } from '@chakra-ui/react'` —— 默认带样式
- `import { Combobox } from '@ark-ui/react'` —— 完全无样式

业务可以混用：基础组件用 Chakra，特殊定制 fallback 到 Ark UI。

**Ark UI 的状态机**：

复杂组件（Combobox / Menu / Slider 等）基于 XState 状态机：
- 状态明确：idle / focus / select / typeahead 等
- 转换显式：每个事件触发什么转换可追踪
- a11y 完整：键盘 / 屏幕阅读器规范遵从

业务无需关心状态机内部，只用 Ark / Chakra 暴露的 prop 即可。但调试时可以看 data-state 等属性了解当前状态。

总结：Ark UI = Chakra v3 的「灵魂」，是「跨框架设计系统」基础。
-->

---
transition: fade-out
---

# Next.js App Router 集成

snippet provider + suppressHydrationWarning + RSC

<v-click>

```tsx
// app/layout.tsx —— RSC 兼容
import { Provider } from "@/components/ui/provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
```

</v-click>

<v-click>

```tsx
// next.config.ts —— 按需导入优化（v15+）
export default {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
};
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Chakra UI v3 + Next.js App Router 集成步骤 ——

**1. layout.tsx**：

```tsx
import { Provider } from '@/components/ui/provider';

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
```

要点：
- `suppressHydrationWarning`：next-themes 会改 html.class，没这个会有 hydration warning
- `Provider` 是 snippet 生成的 wrapper（ChakraProvider + ThemeProvider）
- 无需手动 'use client'：snippet 内部已经标记

**2. snippet 添加**：

```bash
npx @chakra-ui/cli snippet add
```

默认生成：
- `src/components/ui/provider.tsx`：Provider wrapper
- `src/components/ui/color-mode.tsx`：useColorMode / ColorModeButton
- `src/components/ui/toaster.tsx`：Toast 容器
- 关键组件 wrapper（dialog / drawer / popover 等）

**3. RSC（React Server Components）兼容**：

Chakra v3 组件大多需要 'use client'（因为状态 / hook）。
但 Provider 内部已经标 'use client'，业务层不需要重复。

server component 中可用：
- 静态 Box / Flex / Stack 等 Layout 组件
- Text / Heading / Link 等 Typography 组件
- 不带交互的纯展示组件

不能用：
- 任何带 hook / state 的组件（Dialog / Menu / Tabs / Combobox 等）
- 这些组件需要在 'use client' 文件里用

实战中，大部分页面整体标 'use client'，简单粗暴。

**4. next.config.ts 按需导入优化**：

```ts
export default {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
};
```

效果：
- Next.js 自动转换 `import { Button } from '@chakra-ui/react'` 为深路径
- 减少 bundle ~30-50%
- 加速 dev server 启动

不开 → @chakra-ui/react 整包打入 bundle（~300KB gzipped）
开了 → 仅打入用到的组件（~80-150KB）

**5. 字体集成（Next.js 字体优化）**：

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';
import { ChakraProvider, createSystem, defineConfig, defaultConfig } from '@chakra-ui/react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: 'var(--font-inter), sans-serif' },
        body: { value: 'var(--font-inter), sans-serif' },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

<html className={inter.variable}>
  <body>
    <ChakraProvider value={system}>{children}</ChakraProvider>
  </body>
</html>
```

**6. 对比其他 UI 库的 Next.js 集成**：

- AntD：需要 @ant-design/nextjs-registry
- MUI：需要 @mui/material-nextjs/v15-appRouter + AppRouterCacheProvider
- Mantine：无需额外 registry（纯 CSS）
- Chakra v3：用 snippet Provider 即可，无需 registry

整体来说 Chakra v3 + Next.js 集成相对简洁，但需要 snippet CLI 一次性生成 wrapper。
-->

---
transition: fade-out
---

# Snippet CLI：shadcn 风格的代码生成

`npx @chakra-ui/cli snippet add` —— 关键组件复制到本地可改

<v-click>

```bash
# 添加所有默认 snippet
npx @chakra-ui/cli snippet add

# 添加特定 snippet
npx @chakra-ui/cli snippet add dialog
npx @chakra-ui/cli snippet add color-mode
npx @chakra-ui/cli snippet add toaster

# 列出所有可用 snippet
npx @chakra-ui/cli snippet list

# 强制覆盖已有文件
npx @chakra-ui/cli snippet add --force
```

</v-click>

<v-click>

```
src/components/ui/
├── provider.tsx        // ChakraProvider + next-themes
├── color-mode.tsx      // useColorMode / ColorModeButton
├── toaster.tsx         // Toast 容器（createToaster）
├── dialog.tsx          // Dialog wrapper（带 Portal / CloseTrigger）
└── ... 20+ 组件 wrapper（drawer / popover / tooltip 等）
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Snippet CLI 是 Chakra v3 的「shadcn 哲学延伸」 ——

**snippet 是什么？**

- 关键 wrapper 组件的「源代码」，通过 CLI 复制到项目本地
- 不是 npm 包，是直接拷贝的代码文件
- 你的项目里可以改这些文件

**对比 npm 包 + snippet**：

| 维度       | npm 包                  | snippet                |
| ---------- | ----------------------- | ---------------------- |
| 升级       | npm update              | 手动重新 add           |
| 修改       | fork / 包装一层         | **直接改文件**          |
| 版本控制   | package.json            | **代码在 repo 内**      |
| 一致性     | 100% 跟着 npm 包变      | **稳定，自主控制**      |
| 学习成本   | 不需要看源码            | **能看到完整实现**      |

**snippet 与 shadcn**：

shadcn UI 是这个哲学的代表 —— 所有组件都是「复制到本地」而不是 npm 包。
Chakra v3 部分采用：
- 基础组件（Button / Input / Box）走 npm 包（不需要本地化）
- wrapper / 工具组件（Provider / Toaster / Dialog wrapper）走 snippet

**默认 snippet 列表**：

- `provider`：ChakraProvider + ColorModeProvider 组合
- `color-mode`：useColorMode hook + ColorModeButton 组件 + LightMode / DarkMode 包装器
- `toaster`：createToaster 实例 + Toaster 容器组件
- `dialog`：Dialog 简化 wrapper（带 Portal / Backdrop / CloseTrigger）
- `drawer`：Drawer wrapper
- `popover`：Popover wrapper
- `tooltip`：Tooltip wrapper
- `field`：Field 简化 wrapper（label + helperText + errorText 一体）
- `accordion`：Accordion wrapper
- `menu`：Menu wrapper
- 等等（共 20+）

**典型 snippet 内容**（dialog 为例）：

```tsx
// src/components/ui/dialog.tsx
import { Dialog as ChakraDialog, Portal } from '@chakra-ui/react';
import { CloseButton } from './close-button';

export const DialogContent = React.forwardRef<HTMLDivElement, ContentProps>(
  function DialogContent(props, ref) {
    const { children, portalled = true, backdrop = true, ...rest } = props;
    return (
      <Portal disabled={!portalled}>
        {backdrop && <ChakraDialog.Backdrop />}
        <ChakraDialog.Positioner>
          <ChakraDialog.Content ref={ref} {...rest}>
            {children}
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    );
  }
);

export const DialogCloseTrigger = ...
export const DialogRoot = ChakraDialog.Root;
export const DialogTrigger = ChakraDialog.Trigger;
// ...
```

**好处**：
- 业务代码用 DialogContent，不用每次写 Portal + Backdrop + Positioner
- 想改默认行为（如永远 disable backdrop click）→ 改 dialog.tsx
- 升级 Chakra → 不需要改 snippet 文件（除非 Dialog API 大改）

**取舍**：

snippet 的代价：
- 项目初始化多一步
- 升级时要看 snippet 是否要重新 add
- 增加项目代码量

snippet 的收益：
- 自主可改
- 不绑死 npm 包
- 学习时能看到内部实现

实战中：
- 推荐 add 所有默认 snippet
- 改动小的 wrapper 不需要管
- 改动大的（如 Dialog 永远 disable backdrop click）按需改

**Snippet 与 Skill / MCP**：

Chakra 团队还提供：
- Chakra UI MCP Server：mcp.chakra-ui.com，让 Claude / Cursor 直接知道 Chakra 用法
- Claude Skill：让 LLM 写 Chakra 代码更准确

加上 snippet CLI 三件套，这是「AI 友好」的设计 ——
LLM 看到本地 snippet 代码即知道项目的 wrapper 习惯，生成代码风格一致。
-->

---
transition: fade-out
---

# TypeScript 完整集成

200+ Style Props 自动补全 + Token 类型推导 + Recipe 类型

<v-click>

```tsx
import { Box, type BoxProps, type RecipeVariantProps } from "@chakra-ui/react";

// 1. Style Props 类型完整 —— bg / p / _hover 自动补全
<Box bg="teal.500" p="4" _hover={{ bg: "teal.600" }} />;

// 2. 自定义组件继承 BoxProps
interface CardProps extends BoxProps { title: string }
const Card: React.FC<CardProps> = ({ title, ...rest }) => (
  <Box p="4" borderRadius="md" {...rest}>{title}</Box>
);

// 3. Recipe Variant 类型 —— 自动从 recipe 推导
type ButtonVariants = RecipeVariantProps<typeof buttonRecipe>;
// → { variant?: 'solid' | 'outline' | 'ghost'; size?: 'sm' | 'md' | 'lg' }
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Chakra UI v3 TypeScript 集成是「业界最完整之一」 ——

**Style Props 类型推导**：

200+ Style Props 全部类型化：
- 间距：p / m 等接受 spacing token key 或任意 CSS 值
- 颜色：bg / color 等接受 color token key（teal.500）或 CSS 颜色
- 字号：fontSize 接受 size token key（sm / md / lg）或任意值
- 等等

IDE autocomplete：
```tsx
<Box bg="" />  // 输入 "" 后 autocomplete 提示所有 colors token
```

**Token 类型生成**：

业务自定义 token 后，需要 typegen：
```bash
npx @chakra-ui/cli typegen ./src/theme/system.ts
```

会生成类型文件：
- `colors.brand.500` 进入 colors 联合类型
- `spacing.xs` 进入 spacing 联合类型
- 等等

之后在业务代码：
```tsx
<Box bg="brand.500" />  // 自动补全 + 类型检查
<Box bg="invalid" />    // ❌ TS 报错
```

**BoxProps 继承**：

```tsx
import { type BoxProps } from '@chakra-ui/react';

interface CardProps extends BoxProps {
  title: string;
  variant?: 'elevated' | 'outline';
}
```

继承 BoxProps 后，CardProps 自动包含 200+ Style Props，类型完整。

**Recipe 类型**：

```tsx
import { defineRecipe, type RecipeVariantProps } from '@chakra-ui/react';

const buttonRecipe = defineRecipe({
  base: { ... },
  variants: {
    variant: { solid: { ... }, outline: { ... }, ghost: { ... } },
    size: { sm: { ... }, md: { ... }, lg: { ... } },
  },
});

type ButtonVariants = RecipeVariantProps<typeof buttonRecipe>;
// → { variant?: 'solid' | 'outline' | 'ghost'; size?: 'sm' | 'md' | 'lg' }

// 业务定义自定义 Button
interface MyButtonProps extends BoxProps, ButtonVariants {
  children: React.ReactNode;
}
```

**splitVariantProps**：

```tsx
import { useRecipe, splitCssProps } from '@chakra-ui/react';

function MyButton(props: MyButtonProps) {
  const recipe = useRecipe({ recipe: buttonRecipe });
  const [variantProps, restProps] = recipe.splitVariantProps(props);
  const styles = recipe(variantProps);
  return <Box {...styles} {...restProps} />;
}
```

splitVariantProps 自动从 props 拆出 variant / size 等 recipe 维度，剩下的 spread 到 DOM。

**asChild + 类型**：

```tsx
import { type ButtonProps } from '@chakra-ui/react';

// asChild 时父组件类型不丢失
<Tooltip.Trigger asChild>
  <Button {...someProps} />  // Button 自己的 props
</Tooltip.Trigger>
```

**System Token Helper**：

```tsx
import { useToken } from '@chakra-ui/react';

const [brand, gray] = useToken('colors', ['brand.500', 'gray.500']);
// brand = "#319795" / gray = "#6b7280"
```

适合在「外部库需要颜色值」场景（如 Chart.js 配置色）。

**TypeScript 严格模式**：

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "skipLibCheck": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

注意 Chakra v3 要求 `module: ESNext` + `moduleResolution: Bundler` —— 否则部分类型可能丢失。

整体 TypeScript 体验跟 Mantine 一档，比 v2 大幅提升。
-->

---
transition: fade-out
---

# 常见踩坑（一）：v2 → v3 API 改名

API 大量改名，迁移时 codemod 帮不上忙的部分

<v-click>

| v2                          | v3                                 |
| --------------------------- | ---------------------------------- |
| `colorScheme="teal"`        | **`colorPalette="teal"`**           |
| `isOpen / onClose`          | **`open / onOpenChange`**           |
| `isDisabled / isInvalid`    | **`disabled / invalid`**            |
| `spacing="4" / noOfLines=2` | **`gap="4" / lineClamp=2`**         |
| `<Modal>` 平铺 / `useToast` | **`<Dialog.*>` / `toaster.create`** |
| `extendTheme() + theme=`    | **`createSystem() + value=`**       |

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v2 → v3 API 改名是迁移最大的工作量 ——

**核心 prop 改名**：

1. `colorScheme` → `colorPalette`
   - v2：`<Button colorScheme="teal">`
   - v3：`<Button colorPalette="teal">`
   - 原因：colorScheme 跟 light/dark 的「color scheme」冲突，改名避歧义

2. `isOpen` → `open` / `onClose` → `onOpenChange`
   - v2：`<Modal isOpen={isOpen} onClose={onClose}>`
   - v3：`<Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>`
   - 注意 onOpenChange 接收 `{ open: boolean }` 对象（Ark UI 风格）

3. `isDisabled` → `disabled` / `isInvalid` → `invalid` 等
   - 去掉 is 前缀，跟 HTML attribute 一致
   - 影响 Button / Input / Field / Checkbox 等大量组件

4. `spacing` → `gap`
   - v2：`<Stack spacing="4">`
   - v3：`<Stack gap="4">`
   - 跟 CSS gap 属性命名一致

5. `noOfLines` → `lineClamp`
   - v2：`<Text noOfLines={2}>`
   - v3：`<Text lineClamp={2}>`
   - 跟 CSS line-clamp 一致

**组件 API 大改**：

6. Modal / Drawer / Menu → Dialog / Drawer / Menu 命名空间
   - v2：`<Modal><ModalContent><ModalHeader />...</ModalContent></Modal>`
   - v3：`<Dialog.Root><Dialog.Content><Dialog.Header />...</Dialog.Content></Dialog.Root>`

7. useToast → toaster
   - v2：`const toast = useToast(); toast({...})`
   - v3：`import { toaster } from '@/components/ui/toaster'; toaster.create({...})`
   - toaster 是 snippet 生成的 object，不是 hook

8. extendTheme → createSystem
   - v2：`const theme = extendTheme({...}); <ChakraProvider theme={theme}>`
   - v3：`const config = defineConfig({...}); const system = createSystem(defaultConfig, config); <ChakraProvider value={system}>`

9. Token 写法
   - v2：`fonts: { heading: 'Inter' }`
   - v3：`fonts: { heading: { value: 'Inter' } }`
   - 所有 token value 都要包 `{ value: ... }`

**迁移工具**：

Chakra 官方提供 codemod：
```bash
npx @chakra-ui/cli@latest migrate
```

可以处理：
- prop 改名（colorScheme / isOpen / spacing 等机械替换）
- Modal / Drawer 等组件迁移

不能处理：
- 自定义 theme（手动改写 extendTheme → createSystem）
- 业务定制的复合组件（需要 review）
- snippet 引入（手动 add）

**迁移建议**：

- 老项目稳定运行 → v2 维护，不必迁
- 新功能多 → 评估 v3 收益（130+ 组件 vs 50+，性能 4x，DX 大幅提升）
- 决定迁移 → 一次性切换分支，跑 codemod，手动改 theme，全量回归测试
- 工程量预估：中等项目（50-100 个组件用法）约 1-2 周

记住：v3 改名虽多，但都是「机械替换」，IDE 全局查找替换大部分能处理。
-->

---
transition: fade-out
---

# 常见踩坑（二）：Token 必须 value 包裹

defineConfig 内 token 写法跟 v2 完全不同

<v-click>

```ts
// v2 写法（v3 报 TS 错）
extendTheme({ colors: { brand: { 500: "#319795" } } });  // 直接字符串

// v3 写法（必须包 value）
defineConfig({
  theme: {
    tokens: {
      colors: { brand: { 500: { value: "#319795" } } },  // { value: ... }
    },
    semanticTokens: {
      colors: {
        primary: { value: "{colors.brand.500}" },  // {token.path} 引用
      },
    },
  },
});
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Token 必须 value 包裹是 v3 最容易踩的坑之一 ——

**为什么这么改？**

v2 token 是「单值」：
```ts
{ heading: 'Inter' }
```

v3 token 是「元数据对象」：
```ts
{ heading: { value: 'Inter', description: '标题字体' } }
```

虽然描述 / 类别等元数据现在还没用到，但 API 已经预留位置。

**完整 token 结构**：

```ts
defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e6fffa' },
          100: { value: '#b2f5ea' },
          // ...
          900: { value: '#1d4044' },
        },
      },
      spacing: {
        xs: { value: '0.25rem' },
        sm: { value: '0.5rem' },
        md: { value: '1rem' },
      },
      fonts: {
        heading: { value: '"Inter", sans-serif' },
        body: { value: '"Inter", sans-serif' },
      },
      // ...
    },
    semanticTokens: {
      colors: {
        // 简单引用
        primary: { value: '{colors.brand.500}' },

        // 条件引用
        bg: {
          value: { base: '{colors.white}', _dark: '{colors.gray.900}' },
        },
      },
    },
  },
});
```

**token 引用语法**：

字符串内用 `{token.path}` 引用：
```ts
{ value: '{colors.brand.500}' }  // 引用 tokens.colors.brand.500
```

复杂引用：
```ts
{ value: '0 1px 2px {colors.gray.500/50}' }  // 阴影 + 50% 透明
```

**条件 token**：

按色模式：
```ts
bg: {
  value: { base: '{colors.white}', _dark: '{colors.gray.900}' },
}
```

按状态（少见）：
```ts
text: {
  value: {
    base: '{colors.gray.900}',
    _hover: '{colors.gray.700}',
  },
}
```

**常见错误**：

错误 1：忘记 value
```ts
// ❌ 直接字符串
tokens: { colors: { brand: { 500: '#319795' } } }
```
TypeScript 报错：tokens.colors.brand.500 期望 `{ value: string }`，得到 `string`。

错误 2：忘记字符串引号
```ts
// ❌ 直接 token path
{ value: colors.brand.500 }
```
TypeScript 报错：colors 不是变量。应该字符串：`{ value: '{colors.brand.500}' }`

错误 3：semantic 套娃
```ts
// ❌ semantic 内不应该再嵌套对象
semanticTokens: {
  colors: {
    primary: {
      base: { value: '{colors.brand.500}' },  // 错
      _dark: { value: '{colors.brand.400}' }, // 错
    },
  },
}

// ✅ 正确
semanticTokens: {
  colors: {
    primary: {
      value: { base: '{colors.brand.500}', _dark: '{colors.brand.400}' },
    },
  },
}
```

**typegen 后类型推导**：

```bash
npx @chakra-ui/cli typegen ./src/theme/system.ts
```

生成后业务代码：
```tsx
<Box bg="brand.500" />  // ✅ 自动补全 + 类型检查
<Box bg="invalid" />     // ❌ TS 报错
```

**实战提示**：

- 项目初始化时把 typegen 加进 package.json scripts
- prebuild 阶段跑 typegen
- 配合 IDE autocomplete，开发顺手
- token 写法虽啰嗦，但一次配置长期受益
-->

---
transition: fade-out
---

# 常见踩坑（三）：snippet 没装齐

Provider 报错 / Toast 没反应 / ColorMode 切不了

<v-click>

```bash
# ❌ 只装 npm 包，没跑 snippet add
pnpm add @chakra-ui/react @emotion/react
# 然后 import { Provider } from '@/components/ui/provider'
# → Cannot find module
```

</v-click>

<v-click>

```bash
# ✅ 必须跑 snippet add
npx @chakra-ui/cli snippet add

# 或者只装特定 snippet
npx @chakra-ui/cli snippet add provider color-mode toaster

# 验证 snippet 完整性
ls src/components/ui/
# 应有：provider.tsx / color-mode.tsx / toaster.tsx 等
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] snippet 没装齐是 v3 新手最常见的「莫名其妙」错误 ——

**典型症状**：

1. `import { Provider } from '@/components/ui/provider'` 报 Cannot find module
2. `import { toaster } from '@/components/ui/toaster'` 报 toaster is not exported
3. `<ColorModeButton />` 报错
4. `useColorMode()` 报 hook 在 Provider 外面调用

**原因**：

Chakra v3 哲学：
- npm 包提供「核心组件 + Style Props + Recipes」
- snippet 提供「Provider 集成 / Toaster 实例 / ColorMode wrapper」

如果只装 npm 包不装 snippet，那些「wrapper」就缺失。
业务代码里的 `@/components/ui/*` 导入路径就找不到文件。

**解决方法**：

```bash
# 一次性装所有默认 snippet
npx @chakra-ui/cli snippet add

# 或者只装核心 3 个
npx @chakra-ui/cli snippet add provider color-mode toaster

# 验证
ls src/components/ui/
```

**snippet 输出目录**：

默认输出到 `src/components/ui/`：
- `provider.tsx`
- `color-mode.tsx`
- `toaster.tsx`
- 等

如果项目用其他目录结构（如 src/lib/ui/），需要在 chakra.config.ts 配置：
```ts
// chakra.config.ts（项目根）
export default {
  snippets: {
    output: './src/lib/ui',
  },
};
```

**path alias 配置**：

snippet 默认引用 `@/components/ui/xxx`，需要 tsconfig.json：
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

不配 alias → 业务代码导入 `@/components/ui/provider` 报错。

**升级时的 snippet 处理**：

Chakra 升级时（v3.x → v3.y），如果 snippet 模板有更新：
- 看 CHANGELOG 是否提到 snippet 改动
- 改动小的（如内部实现优化）→ 不需要重新 add
- 改动大的（如 API 变化）→ `npx @chakra-ui/cli snippet add --force` 强制覆盖

强制覆盖会丢失你的本地修改 —— 提前 commit 一下，方便 diff 对比。

**实战建议**：

- 项目初始化即跑 snippet add，把 src/components/ui/ 提交到 git
- 团队成员 clone 即看到 wrapper
- Snippet 修改少：默认实现已经覆盖 90% 场景
- 万一需要改：直接编辑文件，注意 review

**对比 shadcn UI**：

shadcn 哲学全员 snippet，所有组件复制到本地。
Chakra v3 半 snippet：基础组件走 npm，wrapper 走 snippet。

各有取舍：
- shadcn：极致自由，但代码量大
- Chakra v3：基础组件高效，wrapper 灵活
-->

---
transition: fade-out
---

# 常见踩坑（四）：Compound 组件 + RSC

Next.js App Router 默认 RSC，但 Dialog / Menu / Tabs 内部含 hook

<v-click>

```tsx
// ❌ 直接在 RSC 用 Dialog.Root（hook 错误）
export default function Page() {  // RSC
  return <Dialog.Root>...</Dialog.Root>;
}
// → Error: Hooks can only be called inside Client Component
```

</v-click>

<v-click>

```tsx
// ✅ 抽出 'use client' 子组件
export default function Page() {  // RSC
  return <DialogClient />;
}

// app/dialog-client.tsx
"use client";
export function DialogClient() {
  return <Dialog.Root>...</Dialog.Root>;
}
```

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Compound Components + Next.js RSC 是 v3 常见问题 ——

**问题描述**：

Next.js App Router 默认所有组件都是 RSC（React Server Component）。
但 Chakra v3 的 Dialog / Menu / Tabs 等 Compound 组件需要客户端 state（useDisclosure 等内部 hook）。
直接在 RSC 中渲染 Dialog.Root 会报：
```
Error: Hooks can only be called inside the body of a function component.
```

**为什么 v3 Compound 一定要 client**？

- Compound 组件内部用 useReducer / useState / useContext 等 hook
- RSC 不允许 hook
- Ark UI 的状态机也需要 client runtime

**解决方法**：

**方法 1：'use client' 整个页面**（最简单）

```tsx
'use client';
// app/page.tsx
export default function Page() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>...</Dialog.Trigger>
    </Dialog.Root>
  );
}
```

代价：失去 RSC 优势（数据获取 / 包大小优化）。

**方法 2：抽出客户端子组件**（推荐）

```tsx
// app/page.tsx（RSC）
import { DialogClient } from './dialog-client';

export default function Page() {
  const data = await fetchData();  // RSC 数据获取
  return (
    <main>
      <h1>{data.title}</h1>
      <DialogClient items={data.items} />  // 客户端子组件
    </main>
  );
}

// app/dialog-client.tsx
'use client';
export function DialogClient({ items }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>打开</Dialog.Trigger>
      <Dialog.Content>
        {items.map(item => <p key={item.id}>{item.label}</p>)}
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

服务端只渲染 RSC + 抽出客户端组件，保留 RSC 优势。

**方法 3：dynamic import（少用）**

```tsx
import dynamic from 'next/dynamic';
const DialogClient = dynamic(() => import('./dialog-client'), { ssr: false });
```

跳过 SSR，纯客户端渲染。
代价：首屏没有内容，影响 SEO + LCP。

**何时各自适用**：

- 整页交互（dashboard / form）→ 整页 'use client'
- 主体内容静态 + 局部交互（如详情页 + 一个 dialog）→ 抽客户端子组件
- 完全跳过 SSR（如纯前端组件）→ dynamic import

**Provider 的 'use client'**：

snippet 生成的 Provider 已经标 'use client'：
```tsx
// src/components/ui/provider.tsx
'use client';
export function Provider({ children }) { ... }
```

所以 layout.tsx 不需要 'use client'：
```tsx
// app/layout.tsx（RSC）
import { Provider } from '@/components/ui/provider';
export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body><Provider>{children}</Provider></body>
    </html>
  );
}
```

**纯展示组件可在 RSC**：

```tsx
// app/page.tsx（RSC）
import { Box, Text, Heading } from '@chakra-ui/react';
export default function Page() {
  return (
    <Box p="8">
      <Heading>标题</Heading>
      <Text>静态文本</Text>
    </Box>
  );
}
```

Box / Text / Heading 等 Layout / Typography 组件没有状态，可以直接在 RSC 用。

只有：
- Dialog / Drawer / Menu / Tabs / Combobox 等交互组件
- 使用 useColorMode / useRecipe 等 hook 的组件
- toaster.create() 等客户端 API

→ 这些需要在 'use client' 文件里用。

实战中：业务组件大多需要交互 → 顶部加 'use client' 即可，不要纠结 RSC。
-->

---
transition: fade-out
---

# 评价

何时选 Chakra UI v3 / 何时选其他

<v-click>

**选 Chakra UI v3 的场景**

- React 项目 + 现代风格设计 + Props 化样式偏好
- 重视无障碍（a11y first，Ark UI 共建）
- 跨框架团队（React + Solid / Vue / Svelte 共享 Ark UI 行为）
- 中后台 / 仪表盘 / SaaS 产品

</v-click>

<v-click>

**不选的场景**

- 需要 Material Design 风格（选 MUI）
- 中国企业 B 端中后台（选 Ant Design，中文资料多）
- 想要内置 form / dates / charts 子库（选 Mantine）
- 追求极致小 bundle（选 Tailwind + Radix）

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Chakra UI v3 的「适配场景」 ——

**为什么选 Chakra UI v3**：

1. **现代风格 + 实用主义**
   - 不像 MUI 那样有强 Material 烙印
   - 不像 Ant Design 那样有中国 B 端风格
   - 中性 / 现代 / 可塑造，适合多种产品形态

2. **Props 化样式天花板**
   - 200+ Style Props 覆盖所有 CSS
   - 30+ Conditional Props 覆盖所有伪类 / 状态
   - 写代码即写样式，几乎不写 CSS 文件
   - 对前端工程师而言「学习曲线最缓」

3. **a11y 全员第一档**
   - Ark UI 作底层保证 WAI-ARIA
   - Chakra 团队从 0.x 就 accessibility first
   - 全球项目无障碍合规要求 → Chakra 默认满足

4. **Compound + asChild 现代心智**
   - 跟 Radix UI / shadcn 心智一致
   - 2024+ React UI 库主流方向
   - 业务代码可读性极高

5. **Ark UI 跨框架**
   - 公司有 React 主站 + Solid 工具 + Vue 控制台 → 行为可共享
   - 设计师对 a11y 信任不变（同套 Ark UI 跑各框架）

6. **大量 LLM 友好建设**
   - mcp.chakra-ui.com MCP 服务器
   - Claude Skill 集成
   - snippet CLI 让 LLM 看到本地代码
   - Cursor / Claude Code 写 Chakra 准确率高

[click] **不选 Chakra UI v3 的场景**：

1. **Material Design 项目**
   - 选 MUI（Material 官方实现，60+ 组件 + @mui/x 高级套件）
   - Chakra 风格中性，做 Material 不如 MUI 原汁原味

2. **中国企业 B 端**
   - 选 Ant Design（中国市场事实标准，中文资料 + 社区最深）
   - Chakra 英文文档为主，国内材料少

3. **需要内置 form / dates / charts / tiptap 等子库**
   - 选 Mantine（@mantine/form / dates / charts / tiptap / notifications 全套官方）
   - Chakra 只有 react-hook-form + Zod 自己组合（更灵活，但要拼）

4. **极致小 bundle**
   - 选 Tailwind + Radix Primitives（手动 + headless，bundle 最小）
   - Chakra ~80-150KB（按需导入后），不算大但也不小

5. **极致性能（SSR / hydration）**
   - 选 Mantine（纯 CSS，无 CSS-in-JS 运行时）
   - Chakra v3 仍基于 Emotion，性能 vs Mantine 略逊一筹（但 v3 已显著优化）
   - 未来 Chakra 可能迁 Panda CSS 零运行时

**选型决策树**：

```
你的设计语言？
├── Material → MUI
├── 中国 B 端 → Ant Design
├── 现代实用 + 完整生态 → Mantine
├── 现代实用 + Props 化样式 + a11y first → Chakra UI v3
└── 完全自定义 → Tailwind + Radix
```

**Chakra UI v3 的核心定位**：

「现代风格 React UI 体系，Props 化样式 + a11y first + 跨框架共享行为」

适合「全球项目 + 中后台 + SaaS + 设计中性」场景，是 React UI 库的 2024+ 现代化代表。
-->

---
transition: fade-out
---

# 学习路径

从入门到精通的四阶段路线

<v-click>

**第一阶段（1-3 天）：上手**

snippet add → ChakraProvider → Box / Stack / Button / Input → Style Props 入门

</v-click>

<v-click>

**第二阶段（1 周）：核心**

Conditional Props（\_hover / \_dark 等）→ Field + RHF + Zod → Dialog / Menu / Tabs Compound

</v-click>

<v-click>

**第三阶段（2-4 周）：进阶**

createSystem + defineConfig → Recipes / Slot Recipes → asChild 模式 → 自定义组件

</v-click>

<v-click>

**第四阶段（长期）：精通**

Ark UI 底层 → 跨框架设计系统 → Panda CSS（未来迁移）→ MCP / Skill 集成

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 学习路径分四阶段 ——

**第一阶段（1-3 天）：上手**

目标：跑通 Hello World 项目 + 用基础组件。

- 安装：`pnpm add @chakra-ui/react @emotion/react`
- snippet：`npx @chakra-ui/cli snippet add`
- Provider：包裹 App
- 基础组件：
  - Box（通用容器）/ Flex（display=flex）/ Stack（堆叠）
  - HStack / VStack
  - Button / IconButton
  - Input / Textarea
  - Text / Heading
- Style Props 入门：m / p / bg / color / fontSize / borderRadius

练习：写一个登录表单（Box + Stack + Input + Button），熟悉 Style Props。

[click] **第二阶段（1 周）：核心**

目标：能写完整的中后台页面。

- Conditional Props：
  - `_hover` / `_focus` / `_active` / `_disabled`
  - `_dark` / `_light`（色模式）
  - `_groupHover` / `_peerFocus`
- 表单：
  - Field 组件结构（Root / Label / HelperText / ErrorText）
  - React Hook Form 集成
  - Zod schema 校验
- Compound Components：
  - Dialog / Drawer / Popover / Tooltip
  - Menu / ContextMenu
  - Tabs / Accordion / Steps
- Toast：snippet 生成的 toaster.create / toaster.promise

练习：搭一个 admin 后台（列表 + 表单 + 详情 + 弹窗 + Toast），熟悉所有常用组件。

[click] **第三阶段（2-4 周）：进阶**

目标：建立项目级设计系统。

- 主题：
  - createSystem + defineConfig
  - Token 体系（colors / spacing / fonts / radii 等）
  - Semantic Tokens（bg / fg / muted / accent）
  - colorPalette（teal / blue / red）
  - 自定义 globalCss
- Recipes：
  - defineRecipe（单元素变体）
  - defineSlotRecipe（多元素变体）
  - useRecipe / useSlotRecipe hook
  - splitVariantProps
  - 集成到 system.recipes
- 组合模式：
  - asChild prop（任意元素扮演 Trigger）
  - chakra factory（创建定制组件）
  - 包装 Next.js Link / 自定义组件
- 自定义组件：
  - 从 Ark UI 原语 + Chakra 样式 → 自建组件
  - 用 RecipeVariantProps 推导类型
  - forwardRef + asChild 兼容

练习：建立公司设计系统（自定义 token + 自定义 Button / Card / Modal 变体），其他业务团队复用。

[click] **第四阶段（长期）：精通**

目标：深入底层 + 跨框架 + 未来准备。

- Ark UI 底层：
  - 看 @ark-ui/react 源码（特别是 Combobox / Menu）
  - 理解 XState 状态机
  - 用 Ark UI 直接做高度定制组件（不依赖 Chakra）
- 跨框架设计系统：
  - 公司有多框架 → Ark UI 行为复用
  - 设计 token 跨框架共享（同一 Panda CSS config）
  - 多 UI 库统一（React Chakra + Vue Ark + Solid Park）
- Panda CSS（未来）：
  - 关注 Chakra 团队迁移 Panda CSS 进展
  - 零运行时性能提升
  - 学 Panda CLI / config / patterns
- LLM 友好建设：
  - mcp.chakra-ui.com 接入 Claude / Cursor
  - 写 Chakra UI Skill（公司内部规范）
  - LLM 辅助生成业务组件库

**配套技术栈**（2025 React 现代化全栈）：

- 路由：React Router 7 / Next.js App Router / TanStack Router
- 状态：Zustand / Jotai / Redux Toolkit
- 表单：React Hook Form + Zod
- 数据：TanStack Query
- 服务端：Next.js / Remix / Hono / tRPC
- 测试：Vitest + React Testing Library + Playwright
- 构建：Vite / Turbopack

「Chakra UI v3 + Next.js App Router + React Hook Form + Zod + TanStack Query + Zustand」是 2025 年 React 全栈主流。
-->

---
transition: fade-out
---

# 延伸学习资源

官方 + 社区精选

<v-click>

**官方资源**

- 官方文档 [chakra-ui.com](https://chakra-ui.com/) —— 每组件 API + Examples + a11y
- GitHub [chakra-ui/chakra-ui](https://github.com/chakra-ui/chakra-ui) —— 40K+ star
- MCP 服务器 [mcp.chakra-ui.com](https://mcp.chakra-ui.com/) + Migration Guide

</v-click>

<v-click>

**生态延伸**

- Ark UI [ark-ui.com](https://ark-ui.com/) —— Chakra 团队 Headless 底层
- Park UI [park-ui.com](https://park-ui.com/) —— Ark UI + Panda CSS 替代设计系统
- Panda CSS [panda-css.com](https://panda-css.com/) —— Token + Recipe 设计的灵感源

</v-click>

<v-click>

**配套技术栈**

- Next.js App Router + React Hook Form + Zod + TanStack Query = 现代 React 全栈
- Zustand + TanStack Query + lucide-react = 实用三件套

</v-click>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 官方资源是第一手信息 ——

**官方文档（chakra-ui.com）**：
- 每组件 API + Examples + Accessibility notes + Migration
- 130+ 组件全部独立页
- Style Props / Conditional Props 完整列表
- TypeScript 类型 + Recipe / SlotRecipe 完整文档
- 质量「业界第一档」

**GitHub**：
- 40K+ star
- 月活跃 issue 50+
- Discussions 有路线图投票
- Discord 社区 20K+ 成员

**MCP 服务器**：
- mcp.chakra-ui.com 提供 MCP Server
- Cursor / Claude Code 集成后，写 Chakra 代码上下文准确性最高
- 自动推荐 v3 API（避免老 v2 心智干扰）

**Migration Guide**：
- v2 → v3 迁移详细指南
- 包含 prop 对照表 / codemod 工具 / 手动改造步骤
- 工程量预估 + 优先级建议

[click] **生态延伸**：

**Ark UI**：
- Chakra 团队同时维护的 Headless 库
- React / Solid / Vue / Svelte / Lit 跨框架
- 适合「想要 Chakra 行为，但自定义样式」场景

**Park UI**：
- Ark UI + Panda CSS 的官方设计系统
- 不像 Chakra 有 Style Props
- 设计师 + 工程师共建设计系统更友好

**Panda CSS**：
- 零运行时 CSS-in-JS 引擎
- Token + Recipe 设计灵感源（Chakra v3 大量借鉴）
- 未来 Chakra 可能迁过去
- 现在可单独用做项目（不依赖 Chakra）

**对比心智**：

- Chakra UI v3：上层 Style Props + 完整组件库
- Ark UI：中层 Headless 行为原语
- Park UI / Panda CSS：底层 Token + Recipe + 设计系统

业务可根据需求选层级：
- 业务上手快 → Chakra UI v3
- 设计系统定制 → Park UI / Panda CSS
- 跨框架行为复用 → Ark UI

[click] **配套技术栈**：

**「Next.js App Router + React Hook Form + Zod + TanStack Query + Zustand」是 2025 年 React 全栈主流**：

- Next.js App Router：现代全栈框架（RSC / Server Actions）
- React Hook Form：表单状态管理（Chakra Field 完美适配）
- Zod：schema 校验（TypeScript-first）
- TanStack Query：服务端状态（数据获取 + 缓存 + 失效）
- Zustand：客户端状态（轻量 / 简单 / 函数式）

**Lucide React**：
- 图标库（Tabler Icons / Heroicons 之外的另一选择）
- 800+ 图标 / TypeScript / tree-shakable
- 配合 Chakra Icon 组件包装

**Framer Motion**：
- 复杂动画（Chakra 默认 transition 不够时）
- 跟 Chakra 配合极好（Box / Stack 都能 motion.div 化）

**MDX**：
- 内容驱动产品（博客 / 文档 / 营销页）
- Chakra Prose 组件适配 MDX 排版

**其他推荐**：
- shadcn-ui：心智一致的另一选项（基于 Radix + Tailwind）
- TanStack Table：表格事实标准（Chakra Table 之上）
- Tiptap：富文本编辑器（Chakra Rich Text Editor 底层）
- date-fns / dayjs：日期处理（DatePicker 配套）
- Recharts / Visx：图表库

延伸阅读：
- Chakra Discord：20K+ 成员，技术讨论活跃
- Chakra Changelog：版本更新历史
- Awesome Chakra UI：社区资源合集
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 ⚡️

Chakra UI v3 — React 生态现代风格 UI 体系，Ark UI + Style Props + Compound

<div class="mt-8 text-lg">

**核心心智**

- Provider 入口：ChakraProvider value=system + ColorModeProvider（next-themes）
- Style Props 200+ / Conditional 30+：所有 CSS 属性 props 化，主题感知 + 响应式 + a11y
- createSystem + defineConfig：Panda CSS 启发的 token + recipe 函数式管线
- Compound Components + asChild：结构即组件 + 灵活组合，Radix 风格 Slot
- Ark UI Headless 底层：跨框架共享行为，a11y 由原语保证
- snippet CLI 哲学：关键 wrapper 复制到本地可改，shadcn 风格

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://chakra-ui.com/" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/chakra-ui/chakra-ui" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://ark-ui.com/" target="_blank" class="slidev-icon-btn">
    <carbon:tree-view /> Ark UI
  </a>
</div>

<style>
h1 {
  background-color: #319795;
  background-image: linear-gradient(45deg, #319795 10%, #805ad5 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：Chakra UI v3 = React 生态现代化 UI 体系，「Ark UI 行为 + Style Props 样式 + Compound 结构」三件套。

核心心智六条：

1. **Provider 入口**：ChakraProvider value={system} + 内嵌 next-themes ColorModeProvider，snippet 一键生成
2. **Style Props 200+ / Conditional 30+**：所有 CSS 属性 props 化（bg / p / _hover / _dark / _groupHover）
3. **createSystem + defineConfig**：Panda CSS 启发的函数式管线，token 元数据化 + recipes 集成
4. **Compound Components + asChild**：Dialog.Root / Dialog.Trigger 命名空间 + 子元素扮演 Trigger
5. **Ark UI Headless 底层**：React / Solid / Vue / Svelte / Lit 跨框架共享行为，a11y 由原语保证
6. **snippet CLI 哲学**：Provider / Toaster / ColorMode 等 wrapper 复制到本地可改，shadcn 风格

下一步建议：
- 跟着官方文档把 Layout / Forms / Overlays 三大组组件全部跑一遍
- 用 Field + RHF + Zod 搭一个完整表单
- 用 createSystem + defineConfig 自定义品牌色 + 字体
- 用 defineRecipe 自定义 Button / Card 变体
- 接入 Next.js App Router 全栈应用

延伸学习：
- Ark UI 源码阅读（特别是 Combobox / Menu 状态机）
- 跨框架设计系统（React + Solid + Vue 共享 Ark UI）
- Panda CSS（关注 Chakra 未来迁移）
- MCP 服务器集成（mcp.chakra-ui.com 让 LLM 写 Chakra 更准）

Chakra UI v3 是 React UI 库 2024+ 现代化的代表 ——
Props 化样式 + 无障碍 + 跨框架 + Compound + snippet 五大方向都做到行业第一档。

感谢观看！
-->
