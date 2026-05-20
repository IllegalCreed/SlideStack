---
theme: seriph
background: https://cover.sli.dev
title: Welcome to MUI
info: |
  Presentation MUI Material UI for React developers.

  Learn more at [https://mui.com/](https://mui.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎨</span>
</div>

<br/>

## MUI — Material Design for React

Material UI v9 + MUI X v9 —— React 生态老牌 Material Design 主流，sx prop / styled / Design Tokens

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 MUI —— React 生态老牌 Material Design 组件库，前身 Material-UI（2014 年首发），
2021 年改名 MUI，至今十年迭代。

当前主线 Material UI v9.0+（@mui/material）+ MUI X v9.2+（Data Grid / Date Pickers / Charts / Tree View），
是 React 生态最成熟、企业落地最多的 UI 库之一。

核心卖点：
- Google Material Design 官方风格 React 实现，60+ 组件
- sx prop / styled() / createTheme + colorSchemes 多层定制
- @mui/x 高级组件（Data Grid 媲美 AG Grid / Date Pickers 业界标杆 / Charts 高质量）
- Emotion 默认 CSS-in-JS，Pigment CSS 零运行时实验中
- Grid v2（v7 起替换 GridLegacy）/ Stack / Box / Container 现代布局
- Next.js App Router 官方集成 @mui/material-nextjs / InitColorSchemeScript
- 原生 TypeScript + Module Augmentation 主题扩展
- 全球生态最深（GitHub 95K+ star，下载量 React UI 库 Top 1）

本次内容聚焦 v9 + v7 起的新 API（cssVariables / colorSchemes / Grid v2 / 新版主题）。
-->

---
transition: fade-out
---

# 什么是 MUI？

React 生态老牌 Material Design 组件库，60+ 组件 + Design Tokens

<v-click>

- **60+ 组件**：Inputs / Data Display / Feedback / Surfaces / Navigation / Layout / Utils 七大分组
- **Material Design**：Google 官方设计语言 React 实现，v3 风格更新中
- **sx prop**：行内样式 + 主题感知 + 响应式断点，写一行解决 80% 场景
- **styled() / createTheme**：完整主题定制，colorSchemes 多模式
- **MUI X**：Data Grid / Date Pickers / Charts / Tree View / Scheduler 五大高级组件
- **Emotion 默认**：CSS-in-JS 运行时，Pigment CSS 零运行时实验
- **TypeScript 原生**：所有 props 完整类型 + Module Augmentation 扩展主题
- **生态最深**：GitHub 95K+ star / npm 周下载 600 万 / React UI Top 1

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_MUI Overview_](https://mui.com/material-ui/getting-started/)

</div>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MUI 的核心定位：「React 生态老牌 Material Design 主流」——

不只是「Material 风格组件库」，而是 React 生态最早一批、迭代最久的企业级 UI 体系：
- 设计语言：Google Material Design 官方 React 实现（v2 / v3 持续跟进）
- 组件实现：60+ 高质量 React 组件，覆盖企业 / C 端 / 移动端全场景
- 高级套件：@mui/x（Data Grid / Date Pickers / Charts / Tree View / Scheduler），媲美 AG Grid 等专业库
- 主题系统：sx prop 行内、styled() 复用、createTheme 全局，三层渐进定制

v9（2025）三大重点：
- CSS Variables 默认推荐：cssVariables: true + colorSchemes（light/dark）
- Pigment CSS 零运行时 CSS-in-JS：构建期生成 CSS，性能极致
- Grid v2 替换 GridLegacy：从 v7 起 Grid 即 Grid v2，老 Grid 改名 GridLegacy

下面按「定位 → 演进 → 安装 → ThemeProvider → sx → styled → 组件分类 → Form → Data Grid → Date Picker → Charts → 主题 + colorSchemes → CSS Layers → 布局组件 → React Hook Form → Next.js SSR → Pigment CSS → Base/Joy 状态 → TS 模块增强 → 生态对比 → 踩坑 → 学习路径」顺序讲透。
-->

---
transition: fade-out
---

# 定位与生态对比

为什么 React 项目还在选 MUI？

<v-click>

| 维度       | MUI              | Ant Design      | Mantine      | Chakra UI |
| ---------- | ---------------- | --------------- | ------------ | --------- |
| 设计语言   | **Material**     | 企业中后台      | 现代实用     | 友好简洁  |
| 组件数量   | 60+              | **70+**         | 100+         | 50+       |
| 主题方案   | sx + Theme       | Token + algo    | CSS vars     | Theme 对象 |
| 样式底层   | Emotion / Pigment | CSS-in-JS       | CSS vars     | Emotion   |
| 高级组件   | **@mui/x 套件**  | pro-components  | 内置丰富     | 一般      |
| 主导团队   | **MUI 公司**     | 蚂蚁集团        | 社区         | Adobe     |
| 全球生态   | **最深**         | 强（中国）      | 中           | 中        |

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比 React 生态四大主流 UI 库，MUI 的护城河是「Material Design + 全球最深生态」：

设计语言：
- MUI 走 Google Material 路线 —— 颜色饱和、动效张扬，C 端 / 移动端友好
- Ant Design 偏企业中后台通用，B 端审美
- Mantine 现代实用风格，类似 shadcn 但更完整
- Chakra UI 友好简洁，Adobe 主导后偏向无障碍

组件数量：
- MUI 60+（核心）+ @mui/x 高级套件 = 实际能用 80+
- Ant Design 70+ 全部在主包
- Mantine 100+ 数量最多

主题方案：
- MUI 是 sx + Theme 对象，sx prop 极度便利但运行时开销
- Ant Design Token + algorithm，函数式优雅
- Mantine 用 CSS vars，性能好但定制层级浅
- Chakra UI 是 Theme 对象，体验介于两者之间

高级组件：
- MUI 的 @mui/x（Data Grid / Date Pickers / Charts）是「商业产品级」，Pro/Premium 收费
- Ant Design pro-components 是上层封装，免费
- Mantine 内置组件已经很丰富

全球生态：
- MUI 公司专职运营（200+ 全职员工），是 React UI 库唯一商业公司化运营
- GitHub 95K star，npm 周下载 600 万，React UI Top 1
- 海外团队默认选 MUI（如同中国默认选 Ant Design）

选型逻辑：
- React + 全球项目 / C 端 / 移动端 → MUI（默认选项）
- React + 中国 B 端 → Ant Design（中文资料多）
- React + 设计感强 / 自定义多 → Mantine
- React + 极致性能 / 小体积 → 自己用 Tailwind + Radix
-->

---
transition: fade-out
---

# 演进史

从 Material-UI 1.0 到 MUI v9 的十年

<v-click>

| 版本      | 时间    | 关键事件                                            |
| --------- | ------- | --------------------------------------------------- |
| 1.x       | 2018.9  | Material-UI 首个稳定版，JSS 主题系统                |
| 4.x       | 2019.9  | Hooks 重写，makeStyles 时代                         |
| 5.x       | 2021.9  | **改名 MUI**，Emotion 替换 JSS，sx prop 诞生        |
| 6.x       | 2024.9  | CSS Variables + colorSchemes 标准化                 |
| **7.x**   | 2025.3  | **Grid v2 替换 GridLegacy / CSS Layers / ESM**      |
| **9.x**   | 2025+   | **MUI X v9 同步，Scheduler 预览，cssVariables 推荐** |

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MUI 的演进有几个里程碑值得记住：

1.x（2018）：Material-UI 首个稳定版，主题系统用 JSS（JavaScript Style Sheets），
当时是 React 生态最早的 Material Design 实现。

4.x（2019）：Hooks 重写，引入 makeStyles / withStyles 等 hook 写法，
是「Hook 时代过渡」的关键版本，至今仍有大量项目在用。

5.x（2021）：最大的一次架构革新 ——
- 改名 MUI（不再叫 Material-UI），暗示「不止 Material」
- Emotion 替换 JSS：性能更好、SSR 更友好、TypeScript 体验更好
- sx prop 诞生：行内样式 + 主题感知 + 响应式断点，三合一
- @mui/x 独立产品线：Data Grid / Date Pickers / Tree View 商业化

6.x（2024）：CSS Variables 标准化 ——
- cssVariables: true 选项启用 CSS 变量
- colorSchemes 配置多模式（light / dark）
- 性能与可定制性大幅改善

7.x（2025.3）：
- Grid v2 正式替换 Grid（v2 之前叫 Grid2，老 Grid 改名 GridLegacy）
- CSS Layers 内置支持，与 Tailwind 等共存无冲突
- ESM 标准化，bundler 兼容性改善
- 移除 deprecated APIs（createMuiTheme / Hidden / experimentalStyled）
- Lab 组件转正（Alert / Autocomplete 等回归 @mui/material）

9.x（2025）：MUI Core 跳号到 v9 与 MUI X 同步 ——
- MUI X v9.2 同步发布，Scheduler 组件预览
- cssVariables 正式成为推荐方案
- Joy UI 项目暂停开发（聚焦 Material UI + Pigment CSS）
- Base UI 迁出独立项目（base-ui.com）

本次内容聚焦 v9 + v7 起的新 API（cssVariables / colorSchemes / Grid v2）。
-->

---
transition: fade-out
---

# 设计语言：Material Design

Google 出品的设计体系，MUI 是 React 官方风实现

<v-click>

**Material（材料）** —— 模拟物理材质（Z 轴层叠 / 阴影 / 涟漪 / 弹性动画）

</v-click>

<v-click>

**Bold / Graphic / Intentional** —— 大胆配色、清晰版式、强烈层级（v3 简化为 Expressive）

</v-click>

<v-click>

**Motion provides meaning** —— 动效不是装饰，是状态变化的视觉反馈

</v-click>

<v-click>

**Adaptive Design** —— 同一组件在桌面 / 平板 / 手机自动适配（响应式断点 + Touch 优化）

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Material（材料）—— Material Design 的核心隐喻 ——
所有元素都被视为物理世界的「材料卡片」：
- Z 轴（elevation）：每个组件有不同的「高度」，对应不同的阴影
- 阴影（shadow）：自动根据 elevation 派生，无需手动写 box-shadow
- 涟漪（ripple）：点击产生扩散动画，模拟物理触感
- 弹性动画（spring）：开 / 关 / 切换都有自然加减速

MUI 把这套规则全部封装到组件层 ——
比如 Paper / Card 组件都有 elevation prop（0-24），自动派生阴影。
Button / IconButton 点击有 ripple 动画（可关闭 disableRipple）。

[click] Bold / Graphic / Intentional —— Material 1/2 时代三大设计原则 ——
- Bold：用色大胆，主色饱和度高
- Graphic：版式清晰，留白充足
- Intentional：每个层级 / 间距 / 字号都有含义

v3（2021）后 Google 把这套原则简化为「Expressive」——
更允许品牌个性、更动态、更有「人情味」。
MUI v6+ 在跟进 v3 设计 token（如 Color Roles / Tonal Palette）。

[click] Motion provides meaning —— 动效是 Material 的灵魂 ——
- 列表项展开：高度过渡 + 内容淡入
- 切换标签：内容滑动 + 旧内容淡出
- 加载状态：CircularProgress（圆环）/ LinearProgress（线性）

跟 Ant Design 等「克制动效」的库不同，MUI 默认动效丰富 ——
对 C 端 / 营销页 / 用户操作可视化非常友好，
但对企业 B 端可能「太活泼」（可通过 theme.transitions 调整或关闭）。

[click] Adaptive Design —— Material 原则之一 ——
- 同一组件在桌面 / 平板 / 手机自动适配
- 响应式断点（xs / sm / md / lg / xl）默认 5 档
- 触屏 / 鼠标交互区分（Touch 设备 Hover 状态自动禁用）

MUI 的所有组件都内置响应式支持 ——
sx prop 接受对象式断点：`sx={{ p: { xs: 1, md: 4 } }}`
这是 MUI 在「移动端友好」上的天然优势。
-->

---
transition: fade-out
---

# 核心理念：v9 三大重点

cssVariables / colorSchemes / Pigment CSS（实验）

<v-click>

**1. cssVariables: true 推荐**

createTheme 启用 CSS Variables，生成 --mui-palette-* 变量，运行时切换主题无重渲染

</v-click>

<v-click>

**2. colorSchemes（light / dark）**

一个主题对象配置多模式，自动响应 prefers-color-scheme，applyStyles 替代 mode 判断

</v-click>

<v-click>

**3. Pigment CSS（实验，零运行时）**

构建期生成 CSS 文件，无运行时开销，首屏性能极致 —— 适合 SSR / 静态站

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] cssVariables: true 是 v6+ 推出、v9 正式推荐的方案 ——

旧方案（v5 及之前）：
- createTheme 返回一个 JS 对象，theme.palette.primary.main = '#1976d2'
- 切换主题 = 替换 theme 对象 → ThemeProvider 重新渲染整棵子树
- 性能开销大，特别是切换 light/dark 时全站重绘

新方案（cssVariables: true）：
- 生成 --mui-palette-primary-main: #1976d2 等 CSS 变量
- 组件使用 var(--mui-palette-primary-main) 而非 theme.palette.primary.main
- 切换主题 = 改 :root 的 CSS 变量值 → 浏览器原生重绘，0 重渲染
- 同时支持 light/dark 两套变量，prefers-color-scheme 自动切换

[click] colorSchemes —— v6+ 推出的多模式配置 ——
```tsx
createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    light: { palette: { primary: { main: '#1976d2' } } },
    dark:  { palette: { primary: { main: '#90caf9' } } },
  },
});
```

切换暗色 = 给 <html> 加 data-mui-color-scheme="dark"，浏览器原生切换。
配合 useColorScheme() Hook 实现「手动切换 + 自动跟随系统」。

styled / sx 中用 theme.applyStyles('dark', { ... }) 而非 if (mode === 'dark')，
applyStyles 会生成两套 CSS 选择器，无 React 重渲染。

[click] Pigment CSS —— 零运行时 CSS-in-JS ——

工作原理：
- 构建期（webpack / vite 插件）扫描 styled / sx 调用
- 静态分析提取所有可能的 CSS 变体
- 生成普通 CSS 文件 + 类名映射
- 运行时只有「类名拼接」，无 CSS 字符串生成

优势：
- 首屏性能：CSS 文件 link 加载 + 缓存
- 无 hydration 闪烁：服务端 HTML 已带样式
- bundle 小：去掉 Emotion runtime（~10KB）

劣势：
- 仍处 alpha，部分动态样式不支持
- 需要 webpack / vite 插件配置
- 不能用「依赖 React state 的动态主题」

v9 把 Pigment CSS 作为「未来方向」，但默认仍是 Emotion ——
新项目可选择尝试，老项目稳定用 Emotion。
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
pnpm add @mui/material @emotion/react @emotion/styled
# 字体（推荐）
pnpm add @fontsource/roboto
```

| 版本 | React 兼容    | 状态           |
| ---- | ------------- | -------------- |
| v9.x | React 18 / 19 | **当前主线**   |
| v7.x | React 18 / 19 | 稳定           |
| v5.x | React 17+     | LTS 维护       |

</v-click>

::right::

<v-click>

**导入 + 使用**

```tsx
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function App() {
  return (
    <>
      <Button variant="contained" color="primary">
        提交
      </Button>
      <TextField label="姓名" />
    </>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MUI 安装需要三个包：
- @mui/material：组件库本体
- @emotion/react + @emotion/styled：底层 CSS-in-JS 引擎（默认）

为什么需要 emotion？
MUI v5+ 用 Emotion 作为 CSS-in-JS 底层 —— 它是 peer dependency，必须显式安装。
（v9+ 可选 Pigment CSS 零运行时方案替代，但 Emotion 仍是默认）

字体推荐用 @fontsource/roboto（Google Material Design 官方字体），
也可以从 fonts.google.com 引入。Material UI 默认使用 Roboto。

版本说明：
- v9.x：当前主线，2025 年发布，对应 MUI X v9
- v7.x：Grid v2 + CSS Layers + ESM 重构，稳定
- v6.x：CSS Variables + colorSchemes 引入
- v5.x：LTS 维护，仍是大量项目主流
- v4.x：已 EOL，不推荐新项目

新项目推荐 v9（最新特性 + MUI X v9 联动）。

[click] 第一个组件极简 —— import + 直接用 ——

跟 Ant Design 一样，MUI 是「按需 import」—— 不需要 app.use 全局注册。
直接 `import Button from '@mui/material/Button'` 即可，bundler 自动 tree-shake。

也可以用解构 import：
```tsx
import { Button, TextField } from "@mui/material";
```
两种写法都对，但「单独路径 import」对 bundler 更友好（v5 时代必要，v7+ 已不需要）。

variant 是 MUI 组件最常见的 prop：
- contained：实心按钮（强调）
- outlined：边框按钮（次要）
- text：文字按钮（不强调）

color 选项：primary / secondary / error / warning / info / success（由 theme 定义）。

第一个组件不需要 ThemeProvider（用默认主题），但生产项目几乎都要 ThemeProvider + createTheme。
-->

---
transition: fade-out
---

# ThemeProvider 包根

应用根部包裹一层，所有组件继承主题

<v-click>

```tsx
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <YourApp />
    </ThemeProvider>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] ThemeProvider 是 MUI 的「全局配置中心」，几乎所有项目都必须包根 ——

三大职责：
1. **主题对象注入**：createTheme 返回的 theme 通过 context 传给所有子组件
2. **CSS Variables 注入**：cssVariables: true 会生成 :root 的 --mui-* 变量
3. **CSS reset**：配合 CssBaseline 做样式重置

CssBaseline：
- MUI 的「现代 CSS reset」，类似 normalize.css 但更激进
- 默认应用 body 字体、背景色、margin: 0
- 推荐放在 ThemeProvider 内、业务组件外，整个 App 受益

createTheme 选项概览：
- **palette**：色板（primary / secondary / error / warning / info / success）
- **typography**：字体（fontFamily / fontSize / fontWeightLight 等）
- **spacing**：间距单位（默认 8px，sx={{ p: 2 }} = 16px）
- **breakpoints**：响应式断点（xs / sm / md / lg / xl）
- **components**：组件级 override（默认 props / styleOverrides / variants）
- **cssVariables**：启用 CSS Variables（v6+ 推荐）
- **colorSchemes**：多模式配置（light / dark）

调用方式：
- createTheme()：默认主题
- createTheme({ palette: {...} })：覆盖部分配置
- createTheme(baseTheme, overrides)：在另一个主题基础上扩展

注意：
- ThemeProvider 可嵌套 —— 内层覆盖外层（局部主题场景）
- CssBaseline 也可只局部应用 —— 通常一次即可
- 业务必须用 sx={{ bgcolor: 'primary.main' }} 而非 sx={{ bgcolor: '#1976d2' }} —— 才能响应主题切换
-->

---
transition: fade-out
---

# sx prop：行内样式 + 主题感知

MUI 最常用的样式 API，写一行解决 80% 场景

<v-click>

```tsx
import Box from "@mui/material/Box";

<Box
  sx={{
    p: 2,                              // padding: theme.spacing(2) = 16px
    m: { xs: 1, md: 3 },               // 响应式：xs 8px / md 24px
    bgcolor: "primary.main",           // 主题色
    color: "primary.contrastText",     // 主题对比色
    borderRadius: 1,                   // theme.shape.borderRadius
    "&:hover": { bgcolor: "primary.dark" },
    display: "flex",
    gap: 2,
  }}
>
  <Button>提交</Button>
</Box>
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] sx prop 是 MUI 5+ 的「明星 API」，几乎重新定义了 React UI 样式写法 ——

核心特性：

1. **简写**：p / m / px / py / mx / my / pt / pb / pl / pr 等空间属性简写
   - p: 2 = padding: theme.spacing(2) = 16px（默认 8px 基准 × 2）
   - bgcolor / color：背景色 / 字色

2. **主题感知**：所有「主题相关值」自动从 theme 取
   - bgcolor: 'primary.main' 自动取 theme.palette.primary.main
   - color: 'text.secondary' 自动取 theme.palette.text.secondary
   - 不用 'theme.palette.primary.main'，直接字符串路径

3. **响应式断点**：对象式断点配置
   - sx={{ p: { xs: 1, md: 3 } }} —— xs 屏幕 8px，md 屏幕 24px
   - 不用写 @media (min-width: 900px)，框架自动处理

4. **伪类 / 子选择器**：
   - '&:hover'：hover 状态
   - '& .child'：嵌套选择器
   - 跟 Emotion 同源语法

5. **类型完整**：
   - sx 是 SxProps<Theme> 类型
   - VSCode 自动补全所有主题 key
   - 拼错 'primery.main' 会报错

sx 的限制：
- 每次渲染重新计算样式（运行时开销）
- 对性能敏感场景（高频 rerender 列表），建议用 styled 替代
- 复杂样式难复用（每个组件单独写）

实战建议：
- 简单 / 一次性样式 → sx
- 复用样式 / 命名组件 → styled
- 全局主题 → createTheme

sx 是 MUI 学习曲线最大的「上手点」—— 一旦熟练，开发效率比 Tailwind 还高（带类型）。
-->

---
transition: fade-out
---

# styled()：可复用样式组件

把样式封装成命名组件，性能更好可复用

<v-click>

```tsx
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const FancyButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
  padding: theme.spacing(1, 3),
  borderRadius: theme.shape.borderRadius * 2,
  "&:hover": { opacity: 0.9 },
  // v6+ 推荐用 applyStyles 处理暗色
  ...theme.applyStyles("dark", { color: theme.palette.grey[300] }),
}));

// 使用：和普通组件一样
<FancyButton>炫酷按钮</FancyButton>;
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] styled() 是「可复用样式组件」方案，类似 styled-components 但深度集成 MUI 主题 ——

工作原理：
- 接受一个组件（或 HTML tag）+ 样式函数
- 返回一个新组件，自动注入样式
- 样式函数接收 ({ theme, ...props }) 参数

跟 sx prop 的对比：

| 维度       | sx prop                | styled()              |
| ---------- | ---------------------- | --------------------- |
| **写法**   | 行内对象               | 命名组件              |
| **复用**   | 拷贝粘贴               | 直接调用              |
| **性能**   | 每次渲染计算           | 编译期生成 className  |
| **类型**   | SxProps<Theme>         | 自动推导 + props      |
| **适用**   | 一次性样式             | 复用样式 / 设计系统   |

styled() 的强大之处：

1. **基于其他组件**：styled(Button)、styled(MyComponent)、styled('div')
2. **接收 props**：可根据 props 改样式
   ```tsx
   const Box = styled('div')<{ active: boolean }>(({ active }) => ({
     opacity: active ? 1 : 0.5,
   }));
   ```
3. **完整主题访问**：theme.palette / typography / spacing / shape / transitions
4. **嵌套选择器 + 伪类**：跟 Emotion 同源

v6+ 暗色模式最佳实践：

```tsx
// ❌ 旧写法（依赖 mode 判断，会闪烁）
const Wrap = styled('div')(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
}));

// ✅ 新写法（applyStyles + colorSchemes，无闪烁）
const Wrap = styled('div')(({ theme }) => ({
  color: '#000',
  ...theme.applyStyles('dark', { color: '#fff' }),
}));
```

applyStyles 会生成两套 CSS 选择器（[data-mui-color-scheme="dark"] & { color: #fff }），
切换暗色时浏览器原生重绘，无 React 重渲染。

实战策略：
- 设计系统基础组件 → styled
- 业务一次性样式 → sx
- 全局规则 → createTheme.components
-->

---
transition: fade-out
---

# 60+ 组件分组速览

按 Material Design 场景组织

<v-click>

| 分组             | 代表组件                                                |
| ---------------- | ------------------------------------------------------- |
| **Inputs**       | Button / TextField / Checkbox / Radio / Slider / Switch |
| **Data Display** | Avatar / Badge / Chip / List / Table / Tooltip          |
| **Feedback**     | Alert / Backdrop / Dialog / Progress / Skeleton / Snackbar |
| **Surfaces**     | AppBar / Card / Paper / Accordion                       |
| **Navigation**   | BottomNav / Breadcrumbs / Drawer / Menu / Pagination / Tabs |
| **Layout**       | Box / Container / Grid / Stack / ImageList              |
| **Utils**        | Modal / Popover / Popper / Portal / TextareaAutosize    |

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MUI 60+ 组件按 Material Design 场景分组 ——

**Inputs（输入，~12 个）**：表单交互的核心
- Button / IconButton / ButtonGroup / FloatingActionButton
- TextField（最常用，集成 Input + Label + HelperText）
- Checkbox / Radio / Switch / Slider
- Autocomplete（强大的多选下拉 + 远程搜索）
- Select / NativeSelect
- Rating（评分组件，Material Design 特有）

**Data Display（展示，~10 个）**：数据呈现
- Avatar（头像，支持图片 / 文字 / icon）
- Badge（角标，配 Avatar / IconButton 用）
- Chip（标签，可关闭 / 可点击）
- List（列表，ListItem / ListItemText / ListItemIcon 组合）
- Table（基础表格，重型用 @mui/x DataGrid）
- Tooltip（hover 提示）
- Typography（标题 / 段落 / caption）

**Feedback（反馈，~8 个）**：状态通知
- Alert（页面级提示，4 种 severity）
- Dialog（弹窗，类似 Modal 但 Material 风格）
- Snackbar（底部消息条，Material 特色）
- CircularProgress / LinearProgress（加载动画）
- Skeleton（骨架屏）
- Backdrop（蒙层）

**Surfaces（容器，~4 个）**：
- AppBar（应用顶栏，类似 Navbar）
- Card（卡片，CardHeader / CardContent / CardActions）
- Paper（白色 / 暗色卡片背景容器）
- Accordion（折叠面板）

**Navigation（导航，~8 个）**：
- AppBar + Drawer：经典左侧抽屉布局
- Tabs：标签页
- BottomNavigation：底部导航（移动端）
- Breadcrumbs / Pagination / Menu

**Layout（布局，~6 个）**：
- Box：万能容器，sx 友好
- Container：内容居中 + 最大宽度
- Grid（v2，v7 起 Grid 即 Grid v2）：12 栅格
- Stack：行 / 列布局，可设 spacing
- ImageList：图片网格
- Hidden（v7 已移除，用 sx 响应式替代）

**Utils（工具，~5 个）**：
- Modal：底层弹层组件
- Popover / Popper：浮层定位
- Portal：渲染到任意 DOM 节点
- ClickAwayListener：点击外部关闭

MUI 60+ 听起来比 Ant Design 少 10 个，但 @mui/x 套件（Data Grid / Date Pickers / Charts / Tree View / Scheduler）补齐了「企业高级组件」缺口，实际能用 80+。
-->

---
transition: fade-out
---

# Form 表单（一）：TextField 基础

集成 Input + Label + HelperText 三件套

<v-click>

```tsx
import { TextField, Button, Box } from "@mui/material";
import { useState } from "react";

export default function Demo() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}>
      <TextField label="姓名" value={name} fullWidth variant="outlined"
        onChange={(e) => setName(e.target.value)}
        error={!!error} helperText={error || "请填写真实姓名"} />
      <Button variant="contained"
        onClick={() => setError(name ? "" : "请输入姓名")}>提交</Button>
    </Box>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] TextField 是 MUI 最强的「表单原子」组件 ——

跟 Ant Design 的 Form.Item + Input 分离不同，MUI 的 TextField 是「all-in-one」：
- label：上方 / 左侧标签（variant 决定）
- value / onChange：受控值
- error：错误状态（边框变红）
- helperText：底部提示文字（错误时显示错误信息）
- placeholder：输入占位符
- type：text / password / email / number / date / time

三种 variant：
- outlined（默认）：边框框，Material 3 风格
- filled：实心底色，Material 1/2 经典
- standard：仅下划线，简洁

注意 MUI 表单跟 Ant Design Form 的根本区别：

**MUI 是「完全受控」**：
- 每个 TextField 都需要 useState 管理 value
- 父组件聚合所有字段状态
- 没有「Form 实例」概念

**Ant Design Form 是「集中管理」**：
- Form.useForm() 拿一个 form 实例
- Form.Item 通过 cloneElement 注入 value/onChange
- 表单状态由 form 集中维护

哪种更好？看团队 ——
- MUI 写法显式（更 React 心智），但样板代码多
- Ant Design 写法集中（更框架心智），但调试时分散

MUI 实际项目里通常配 React Hook Form（受控但用 Hook 集中管理），
我们后面会单独讲。

[click] error + helperText 联动：
- error: true 时边框变红
- helperText 同时显示错误信息
- 这是 Material Design 的标准错误模式

fullWidth：占满父容器宽度，常用于 Box flex column 内。
-->

---
transition: fade-out
---

# Form 表单（二）：Autocomplete 远程搜索

MUI 最强的多选下拉，类似 Ant Select 但更灵活

<v-click>

```tsx
import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";

interface User { id: number; name: string }

export default function UserSelect() {
  const [options, setOptions] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  useEffect(() => {
    if (!keyword) return;
    setLoading(true);
    api.searchUsers(keyword).then(setOptions).finally(() => setLoading(false));
  }, [keyword]);
  return (
    <Autocomplete options={options} loading={loading}
      getOptionLabel={(u) => u.name}
      onInputChange={(_, v) => setKeyword(v)}
      renderInput={(p) => <TextField {...p} label="搜索用户" />} />
  );
}
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Autocomplete 是 MUI 的「明星组件」之一 ——

它解决了「下拉 + 多选 + 远程搜索 + 标签」一套问题，
功能上覆盖 Ant Design 的 Select / TreeSelect / Cascader / Mentions 大部分场景。

核心 props：

- **options**：选项数据数组（任意类型）
- **getOptionLabel**：从对象提取显示文字（默认是 String(option)）
- **isOptionEqualToValue**：判断选项相等（对象数据必须，避免 React key 警告）
- **loading**：显示加载状态
- **onInputChange**：搜索框文字变化（用于远程搜索）
- **onChange**：选中值变化
- **renderInput**：自定义输入框（通常 TextField）
- **multiple**：多选模式（值变成数组）
- **freeSolo**：允许输入非选项中的值（Tag 风格）

远程搜索模式（最常见）：

1. options 是「当前搜索结果」（不是全集）
2. onInputChange 触发 API 请求 → 更新 options
3. loading 控制 spinner 显示
4. 推荐配合 useDebounce / lodash.debounce 防抖

多选模式（multiple）：
- value 变成数组
- 选中项渲染成 Chip
- 可删除（Chip 自带 onDelete）
- limitTags={3} 限制可见数量

freeSolo（标签输入）：
- 允许输入非选项中的值（Tag 风格）
- 适合「邮箱列表」「关键词输入」场景

Autocomplete 跟原生 Select 的关系：
- 单选 + 不可搜索 → 用 Select 更轻量
- 单选 + 搜索 / 多选 / 远程 → 用 Autocomplete

注意：Autocomplete 的 onChange 第一个参数是 event（要 _ 忽略），第二个才是选中值。
-->

---
transition: fade-out
---

# Data Grid（一）：基础列与行

@mui/x 商业级数据表格，媲美 AG Grid

<v-click>

```tsx
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface User { id: number; name: string; age: number }

const columns: GridColDef<User>[] = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "name", headerName: "姓名", flex: 1, editable: true },
  { field: "age", headerName: "年龄", type: "number", width: 100 },
];
const rows: User[] = [{ id: 1, name: "Alice", age: 28 }];

export default function Demo() {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} pageSizeOptions={[10, 20, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />
    </div>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @mui/x DataGrid 是 MUI 体系最强的「数据表格」——

跟 Material UI 自带的 Table 区别：
- Table：低级组件，类似 HTML <table>，需要手写列 + 分页 + 排序
- DataGrid：高级组件，开箱即用 100+ 特性（虚拟滚动 / 排序 / 筛选 / 分组 / 编辑等）

DataGrid 三个版本：
- **Community（免费 MIT）**：基础功能（@mui/x-data-grid）
- **Pro（付费）**：列固定 / 树形数据 / 多列排序（@mui/x-data-grid-pro）
- **Premium（付费）**：行分组 / 透视表 / Excel 导出（@mui/x-data-grid-premium）

核心 API：
- **rows**：数据数组，必须有 id 字段（或通过 getRowId 指定）
- **columns**：列定义数组
- **paginationModel**：分页模型（page / pageSize）
- **sortModel**：排序模型（field / sort: 'asc'/'desc'）
- **filterModel**：筛选模型（items 数组）

GridColDef 关键属性：
- field：对应 row 字段名（必填）
- headerName：列头文字
- width / flex / minWidth：宽度配置
- type：'string' / 'number' / 'date' / 'dateTime' / 'boolean' / 'singleSelect'
- editable：可编辑（开启行内编辑）
- valueGetter / valueFormatter：自定义值提取 / 格式化
- renderCell：完全自定义渲染（返回 ReactNode）

服务端分页 / 排序 / 筛选 ——
设置 paginationMode="server" + onPaginationModelChange，
DataGrid 通过受控状态把用户操作通过回调传出。

跟 Ant Design Table 的区别：
- DataGrid 支持「列拖拽 / 列隐藏 / 列宽调整」开箱（用户可定制）
- 虚拟滚动默认启用（10000 行依然丝滑）
- 商业版有「Excel 导出 / 透视表」等企业需求

DataGrid 高度必须显式 —— 写在 div 外层 height: 400px，否则报错。
autoHeight 模式 = 自适应高度（无虚拟滚动，适合小数据集）。
-->

---
transition: fade-out
---

# Data Grid（二）：服务端分页 + 编辑

paginationMode="server" + processRowUpdate

<v-click>

```tsx
const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
const [sortModel, setSortModel] = useState<GridSortModel>([]);
const { data, loading } = useUsers({ paginationModel, sortModel });

const processRowUpdate = async (newRow: User, oldRow: User) => {
  await api.updateUser(newRow);
  return newRow;  // 必须 return，DataGrid 用它更新内部状态
};

<DataGrid
  rows={data?.list ?? []}
  columns={columns}
  loading={loading}
  rowCount={data?.total ?? 0}
  paginationMode="server"
  sortingMode="server"
  paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  sortModel={sortModel}
  onSortModelChange={setSortModel}
  processRowUpdate={processRowUpdate}
/>
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 服务端分页是企业后台标配 —— DataGrid 设计得相当优雅 ——

核心要点：

1. **paginationMode="server"**：告诉 DataGrid 「数据是服务端处理过的」
   - 不再自动客户端切片
   - rows 只放当前页数据
   - rowCount 单独传总数

2. **sortingMode="server"** + **filterMode="server"**：同理
   - DataGrid 不在客户端排序 / 筛选
   - 由 onSortModelChange / onFilterModelChange 回调通知服务端

3. **paginationModel / sortModel / filterModel 受控**：
   - 用 useState 维护
   - 通过 onXxxChange 更新
   - 把它们作为 useQuery 的参数 → 服务端获取

跟 Ant Design Table 对比：
- AntD 把所有状态变化合并到一个 onChange(pagination, filters, sorter)
- DataGrid 拆分为 onPaginationModelChange / onSortModelChange / onFilterModelChange
- 各有优劣 —— DataGrid 类型更精细，AntD 更紧凑

[click] processRowUpdate —— 行内编辑的核心 API ——

工作流：
1. 用户双击单元格进入编辑模式
2. 用户改完按 Enter / 失焦
3. processRowUpdate(newRow, oldRow) 被调用
4. 在里面调 API 保存
5. 必须 return 新行（DataGrid 用 return 值更新内部状态）

错误处理：
```tsx
const processRowUpdate = async (newRow, oldRow) => {
  try {
    await api.updateUser(newRow);
    return newRow;
  } catch (e) {
    throw new Error("保存失败");  // 抛错会回滚到 oldRow
  }
};

const onProcessRowUpdateError = (err) => {
  message.error(err.message);  // 用 Snackbar 提示
};

<DataGrid processRowUpdate={...} onProcessRowUpdateError={onProcessRowUpdateError} />
```

行内编辑是 DataGrid 的「杀手锏」—— Excel 体验 + 数据库存储，
特别适合「财务对账 / 库存管理」等需要密集编辑的后台。

注意：编辑模式可控（columns 的 editable: true）+ rowMode（cell 单格 / row 整行）。
-->

---
transition: fade-out
---

# Date Pickers + Charts

@mui/x 另外两大支柱

<v-click>

**Date Picker（@mui/x-date-pickers）**

```tsx
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/zh-cn";

<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
  <DatePicker label="出生日期" value={value} onChange={setValue} />
</LocalizationProvider>;
```

</v-click>

<v-click>

**Charts（@mui/x-charts，免费 MIT）**

```tsx
import { LineChart } from "@mui/x-charts";

<LineChart
  xAxis={[{ data: [1, 2, 3, 4, 5] }]}
  series={[{ data: [2, 5.5, 2, 8.5, 1.5] }]}
  height={300}
/>;
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Date Pickers 是 @mui/x 的「业界标杆」组件 ——

特性：
- **日期 / 时间 / 日期时间 / 范围选择器**：DatePicker / TimePicker / DateTimePicker / DateRangePicker
- **多个日期库适配器**：dayjs / date-fns / luxon / moment
- **国际化**：100+ 语言 locale
- **键盘导航**：完整的 a11y 支持
- **季节 / 年份选择**：DesktopDatePicker / MobileDatePicker 不同形态

关键 API：

**LocalizationProvider（必须包根）**：
- dateAdapter：日期库适配器（推荐 AdapterDayjs）
- adapterLocale：locale 标识（'zh-cn' / 'en' / 'ja' 等）

为什么需要 LocalizationProvider？
- 不同日期库（dayjs / date-fns / luxon）API 不同
- LocalizationProvider 通过 adapter 统一抽象
- 业务代码不直接依赖具体日期库

适配器选型：
- AdapterDayjs（推荐）：dayjs，~2KB，最轻量
- AdapterDateFns：date-fns，函数式 + 不可变
- AdapterLuxon：luxon，时区处理强
- AdapterMoment：moment，旧项目兼容

跟 Ant Design DatePicker 的对比：
- AntD 内置 dayjs，不需要适配器
- @mui/x 需要 LocalizationProvider + adapter，更灵活但配置多一步

[click] Charts 是 @mui/x 的「新成员」（v6.18+，2024 完全免费 MIT）——

核心图表：
- LineChart / BarChart / PieChart / ScatterChart
- AreaChart / Sparkline
- Gauge（仪表盘）
- Heatmap（热力图，预览）

为什么用 @mui/x-charts 而非 ECharts / Recharts？
- ✅ MUI 主题自动跟随（dark mode / colorSchemes 无缝）
- ✅ TypeScript 类型完整
- ✅ Material Design 默认样式
- ✅ 跟 DataGrid / Date Pickers 一套 API 心智

但极度复杂图表（大屏 / 3D / 网络图）还是用 ECharts / antv 更强 ——
@mui/x-charts 适合「企业仪表盘 + 通用统计」场景。

注意：@mui/x-charts 是 MIT 许可（免费），跟 DataGrid Pro/Premium 不同 ——
所有图表组件全部免费可商用。
-->

---
transition: fade-out
---

# createTheme + colorSchemes（一）

多模式主题配置，light / dark 一个对象

<v-click>

```tsx
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "data" },  // [data-mui-color-scheme="dark"]
  colorSchemes: {
    light: { palette: { primary: { main: "#1976d2" },
      background: { default: "#fafafa", paper: "#fff" } } },
    dark:  { palette: { primary: { main: "#90caf9" },
      background: { default: "#121212", paper: "#1e1e1e" } } },
  },
});

<ThemeProvider theme={theme} defaultMode="system">
  <CssBaseline />
  <App />
</ThemeProvider>;
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] colorSchemes 是 v6+ 推出、v9 正式推荐的「现代主题系统」——

旧方案（v5 及之前）：
- createTheme({ palette: { mode: 'dark', primary: ... } })
- 切换模式 = 重新调 createTheme + 替换 ThemeProvider 的 theme
- 整树重渲染，性能差，闪烁

新方案（colorSchemes）：
- 一个 theme 对象配置两套模式（light / dark）
- cssVariables: true 生成两套 CSS 变量
- 切换 = 改 <html> 上的 data-mui-color-scheme 属性
- 浏览器原生重绘，0 React 重渲染

核心配置：

**cssVariables.colorSchemeSelector**：
- 'data'（推荐）：[data-mui-color-scheme="dark"]
- 'class'：.dark CSS 类
- 'media'：@media (prefers-color-scheme: dark)

'data' / 'class' 支持手动切换，'media' 仅跟随系统。

**colorSchemes.light / dark**：
- 每个模式独立配置 palette / shadows
- typography / spacing / breakpoints 不属于 colorScheme（跨模式相同）
- shape / transitions 同理

**defaultMode**：
- 'light' / 'dark' / 'system'
- 'system' 自动跟随用户系统偏好
- 配合 useColorScheme() 实现「自动 + 手动」切换

实战注意：

1. 颜色不要硬编码 —— 用主题 token：`bgcolor: 'primary.main'` 而非 `bgcolor: '#1976d2'`
2. 暗色样式用 applyStyles：
   ```tsx
   sx={{ color: 'text.primary', ...theme.applyStyles('dark', { borderColor: 'grey.700' }) }}
   ```
3. 自定义组件用 useColorScheme()：
   ```tsx
   const { mode, setMode } = useColorScheme();
   ```
4. SSR 防闪烁需要 InitColorSchemeScript（下页讲）
-->

---
transition: fade-out
---

# colorSchemes（二）：手动切换

useColorScheme Hook + 切换按钮

<v-click>

```tsx
import { useColorScheme } from "@mui/material/styles";
import { IconButton, Box } from "@mui/material";

function ThemeToggle() {
  const { mode, setMode } = useColorScheme();
  // SSR 期间 mode 是 undefined，避免水合不匹配
  if (!mode) return null;
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <IconButton onClick={() => setMode("light")} color={mode === "light" ? "primary" : "default"}>
        ☀️
      </IconButton>
      <IconButton onClick={() => setMode("dark")} color={mode === "dark" ? "primary" : "default"}>
        🌙
      </IconButton>
      <IconButton onClick={() => setMode("system")} color={mode === "system" ? "primary" : "default"}>
        💻
      </IconButton>
    </Box>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] useColorScheme 是「主题切换」的官方 Hook ——

返回值：
- **mode**：当前用户选择（'light' / 'dark' / 'system' / undefined）
- **systemMode**：当前系统偏好（'light' / 'dark'）
- **setMode**：切换模式

为什么 mode 可能是 undefined？

SSR 期间服务端不知道用户偏好（localStorage / cookie 在浏览器里），
- 服务端：mode 是默认值（defaultMode 设置的）
- 客户端 hydration 前：mode 是 undefined
- 客户端 hydration 后：mode 从 localStorage 读取

如果直接渲染 mode === 'dark'，会发生水合不匹配（hydration mismatch）警告。

**最佳实践**：在 ThemeToggle 等组件里加 `if (!mode) return null` 跳过 SSR 渲染。

完整三态切换：
- light：手动选择亮色
- dark：手动选择暗色
- system：跟随系统（auto）

切换持久化 —— MUI 自动写入 localStorage（key='mui-mode'），刷新页面保持。

跟 Tailwind dark mode 对比：
- Tailwind：用 `dark:` 前缀 + class
- MUI：用 applyStyles + colorScheme 属性 / class
- 两者可共存（cssVariables.colorSchemeSelector='class' + Tailwind 同 class）

跟 Ant Design algorithm 对比：
- AntD：theme.algorithm = darkAlgorithm，切换重新 createTheme
- MUI：colorSchemes 内置两套，切换只改 <html> 属性
- MUI 性能更好（0 重渲染），AntD 更灵活（algorithm 可自定义）

注意：useColorScheme 必须在 ThemeProvider 内部调用 —— 否则 mode 永远 undefined。
-->

---
transition: fade-out
---

# CSS Layers + Tailwind 共存

v7 起内置 CSS Layers，与 Tailwind 完美共存

<v-click>

```tsx
import { ThemeProvider, createTheme } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";

const theme = createTheme({
  cssVariables: true,
  // 关键：启用 CSS Layers
});

// 入口
<ThemeProvider theme={theme} disableTransitionOnChange>
  <GlobalStyles styles={{ "@layer mui": { /* mui 优先级 */ } }} />
  <App />
</ThemeProvider>;
```

```css
/* index.css —— 配合 Tailwind */
@layer mui, mui-app, tailwind, app;
@import "tailwindcss";
```

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

</v-click>

<!--
[click] CSS Layers 是 CSS 标准（@layer），v7 起 MUI 内置使用 ——

为什么需要 CSS Layers？

老问题（v6 及之前）：
- MUI 样式 + Tailwind 样式同时存在
- 两者 specificity（CSS 优先级）一样
- 最后加载的覆盖前面的（CSS source order 决定）
- 结果：MUI 在 index.tsx 顶部 import → Tailwind 覆盖 MUI；或反过来 → MUI 覆盖 Tailwind
- 工程师不得不写 !important 或拼 selector 提优先级

新方案（CSS Layers）：

```css
@layer mui, tailwind, app;
```

- 这一行声明 layer 顺序：mui < tailwind < app
- 后面的 layer 覆盖前面的
- 不管 import 顺序，layer 顺序决定 specificity

实战配置：

1. **CSS 文件顶部声明 layer 顺序**：
   ```css
   @layer mui, mui-app, tailwind, app;
   ```

2. **MUI 样式自动注入到 @layer mui**（v7+ 默认）

3. **Tailwind 4 默认在 @layer tailwind**

4. **业务自定义样式写在 @layer app**：
   ```css
   @layer app {
     .my-button { background: red; }
   }
   ```

5. **layer 顺序决定优先级** —— 不需要 !important

v7 起 MUI 的 CSS Layers 是「opt-in」（需要显式启用），具体配置参考官方迁移指南。
默认仍是无 layer 模式（兼容 v6 项目）。

为什么 v7 才推？
- CSS Layers 浏览器支持要求：Chrome 99+ / Firefox 97+ / Safari 15.4+
- 2025 年覆盖率已经 95%+，主流可用

实战配置：
- 新项目（Vite + Tailwind 4 + MUI）：开 layers，干净分离
- 老项目（webpack + Tailwind 3）：暂时不开，保留旧覆盖逻辑
-->

---
transition: fade-out
---

# Layout：Box / Stack / Grid v2

布局组件四大金刚

<v-click>

```tsx
import { Box, Stack, Grid, Container } from "@mui/material";

<Container maxWidth="lg">                  {/* 居中 + 最大宽度 */}
  <Stack direction="row" spacing={2} alignItems="center">
    <Box sx={{ flex: 1 }}>左侧</Box>
    <Box sx={{ flex: 1 }}>右侧</Box>
  </Stack>

  <Grid container spacing={2}>             {/* Grid v2 */}
    <Grid size={{ xs: 12, md: 6 }}>左侧</Grid>
    <Grid size={{ xs: 12, md: 6 }}>右侧</Grid>
    <Grid size={{ xs: 12, md: 4 }}>1/3</Grid>
    <Grid size={{ xs: 12, md: 8 }}>2/3</Grid>
  </Grid>
</Container>;
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MUI 的布局体系按「简单 → 复杂」排列：

**Box —— 万能容器**：
- 等价于 <div>，但接收 sx prop（主题感知）
- 90% 场景的「容器」首选
- sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} 直接搞定 Flex

**Stack —— Flex 简写**：
- direction='row' / 'column' 决定方向
- spacing 间距（不用 gap，自动转换）
- divider 添加分隔线（特别方便）
- 比 Box + sx 更声明式

**Grid v2 —— 12 栅格**：
- v7 起 Grid 即 Grid v2（之前叫 Grid2）
- 老 Grid 改名 GridLegacy（兼容老项目）
- 关键 prop 变化：`<Grid item xs={6} md={4}>` → `<Grid size={{ xs: 6, md: 4 }}>`
- container 不变，去掉 item prop

**Container —— 内容居中**：
- maxWidth: xs / sm / md / lg / xl / false
- 自动 margin: auto 居中
- 适合页面级「内容宽度限制」

Grid v2 vs GridLegacy 主要区别：

| 维度        | GridLegacy            | Grid v2 (Grid)         |
| ----------- | --------------------- | ---------------------- |
| **导入**    | `import Grid from '@mui/material/Grid'`（v6） | 同（v7+） |
| **语法**    | `<Grid item xs={6}>`  | `<Grid size={6}>`      |
| **响应式**  | `<Grid xs={6} md={4}>` | `<Grid size={{ xs: 6, md: 4 }}>` |
| **API**     | 多年迭代有遗留        | 干净统一               |
| **底层**    | CSS Grid + Flexbox   | CSS Grid（更现代）     |

v7 codemod 工具自动迁移：
```bash
npx @mui/codemod@latest v7.0.0/grid-props src/
```

老项目 v6 → v7 迁移 Grid 是「最常见的破坏性变化」，必做 codemod。

实战策略：
- 简单 Flex 布局 → Stack
- 复杂网格布局 → Grid v2
- 单纯容器 → Box
- 页面框架 → Container

注意：Stack 是 Flex，Grid 是 CSS Grid —— 不要混用，按需选择。
-->

---
transition: fade-out
---

# React Hook Form 集成

MUI 表单的事实标准 form library

<v-click>

```tsx
import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";

interface Values { name: string; email: string }

export default function Demo() {
  const { control, handleSubmit, formState: { errors } } = useForm<Values>({
    defaultValues: { name: "", email: "" },
  });
  const onSubmit = (data: Values) => console.log("submit:", data);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller name="name" control={control} rules={{ required: "请输入姓名" }}
        render={({ field }) => (
          <TextField {...field} label="姓名" error={!!errors.name} helperText={errors.name?.message} />
        )}
      />
      <Button type="submit" variant="contained">提交</Button>
    </form>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] React Hook Form（RHF）是 React 生态最流行的表单库 ——

为什么 MUI 项目几乎都搭配 RHF？

MUI 本身没有 Form 组件（不像 Ant Design Form），TextField 是「完全受控」组件。
直接用每个字段都要 useState，10 个字段写 10 行状态 —— 极度啰嗦。

RHF 解决方案：
- useForm() 集中管理所有字段状态
- 用 Controller 包装 MUI 组件（受控适配）
- 校验、提交、错误展示一站式

核心 API：

**useForm**：返回 form 实例
- control：传给 Controller，注入字段状态
- handleSubmit(onValid, onInvalid)：包装提交事件
- formState：errors / isDirty / isSubmitting 等状态
- watch / setValue / reset / trigger 等方法

**Controller**：受控组件适配器
- name：字段名（必须）
- control：useForm 返回的 control
- rules：校验规则（required / pattern / validate 等）
- render：渲染函数，参数 { field, fieldState }

render 参数：
- field：{ value, onChange, onBlur, name, ref }
- 直接 spread 到 MUI 组件：<TextField {...field} />

跟其他方案对比：

| 方案             | 心智                  | 适合场景              |
| ---------------- | --------------------- | --------------------- |
| **每字段 useState** | React 原生            | 1-2 字段简单表单      |
| **RHF + MUI**    | 集中管理              | **复杂表单（首选）**  |
| **Formik**       | 老牌但渲染性能差       | 维护老项目            |
| **MUI 自带 Form** | 不存在                | -                     |

RHF 性能优势：
- 「非受控」底层（用 ref），只在 watch / submit 时读取
- 字段独立 rerender（不会因为一个字段变化而全表单 rerender）

进阶用法：
- defaultValues：初始值
- mode='onChange'：实时校验
- resolver：集成 Zod / Yup 校验库（推荐 zodResolver）
- useFieldArray：动态字段数组（订单项 / 子表单）

zod 集成示例：
```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({ name: z.string().min(1, "请输入姓名"), email: z.string().email() });

useForm({ resolver: zodResolver(schema) });
```

类型自动推导，校验逻辑跟接口类型同源 —— 这是 RHF + zod 的核心优势。
-->

---
transition: fade-out
---

# Next.js App Router + SSR

@mui/material-nextjs + InitColorSchemeScript

<v-click>

```tsx
// app/layout.tsx
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { InitColorSchemeScript } from "@mui/material/InitColorSchemeScript";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        {/* 防止 dark 闪烁，必须 body 第一个 */}
        <InitColorSchemeScript attribute="data" />
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Next.js App Router + MUI 是「现代 React 全栈」的标配 ——

为什么需要 AppRouterCacheProvider？

MUI 用 Emotion CSS-in-JS，运行时生成样式 ——
跟 Ant Design v5 一样，传统 SSR 下首屏闪烁（FOUC）。

@mui/material-nextjs 解决方案：
- 服务端：AppRouterCacheProvider 收集 Emotion CSS 字符串
- 通过 useServerInsertedHTML 注入到 HTML <head>
- 客户端 hydration：复用样式，无闪烁

为什么需要 InitColorSchemeScript？

colorSchemes 模式下，客户端 JS 加载前 <html> 没有 data-mui-color-scheme 属性 ——
服务端 HTML 是默认 mode 渲染，客户端 hydration 后才切换 ——
用户会看到「亮色 → 暗色」的闪烁。

InitColorSchemeScript 解决方案：
- 在 <body> 第一行插入一段 inline script
- 同步读取 localStorage（key='mui-mode'）
- 立即设置 <html> 上的 data-mui-color-scheme 属性
- CSS 渲染前属性已经设好，无闪烁

必须放在 body 第一个！如果放在 children 之后，依然有闪烁。

attribute prop：
- 'data'（推荐）：data-mui-color-scheme="dark"
- 'class'：<html class="dark">

要跟 createTheme 的 cssVariables.colorSchemeSelector 保持一致。

suppressHydrationWarning：
- 因为 InitColorSchemeScript 会在客户端立即改 <html> 属性
- 服务端渲染时属性是空的
- React 检测到不一致会报警告
- suppressHydrationWarning 抑制这个警告（仅 <html> 层）

Next.js App Router 其他注意：

1. **业务组件用 'use client'**：MUI 组件都用 React hooks，必须客户端
2. **theme 文件用 'use client'**：createTheme 调用在客户端
3. **'use client' 不影响 SSR**：依然在服务端渲染，只是不 RSC 流式
4. **Pages Router 不同**：用 createCache + getInitialProps，参考官方旧文档

最终目录结构：
```
app/
  layout.tsx       # ThemeProvider + AppRouterCacheProvider
  theme.ts         # 'use client' + createTheme
  page.tsx         # 业务（自动 'use client' 包裹）
```
-->

---
transition: fade-out
---

# Pigment CSS（零运行时实验）

构建期生成 CSS，性能极致

<v-click>

```bash
pnpm add @pigment-css/react @pigment-css/vite-plugin
```

```ts
// vite.config.ts
import { pigment, extendTheme } from "@pigment-css/vite-plugin";

export default {
  plugins: [
    pigment({
      theme: extendTheme({
        colorSchemes: {
          light: { palette: { primary: { main: "#1976d2" } } },
          dark:  { palette: { primary: { main: "#90caf9" } } },
        },
      }),
    }),
    react(),
  ],
};
```

</v-click>

<v-click>

> 仍处 alpha：动态样式 / runtime 主题切换有限制；新项目可试，生产用稳取 Emotion。

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Pigment CSS 是 MUI 公司 2024 推出、2025 持续迭代的「零运行时 CSS-in-JS」 ——

灵感来源：
- Linaria（开源零运行时 CSS-in-JS）
- vanilla-extract（TypeScript-first 静态 CSS）
- Stitches（已停更）

工作原理：
- 构建期（Vite / webpack 插件）扫描代码
- 静态分析 styled / sx / css 调用
- 提取所有可能的 CSS 变体（包括响应式 / 主题）
- 生成普通 CSS 文件 + 类名映射
- 运行时只有「类名拼接」，无 CSS 字符串生成

性能优势：

| 维度          | Emotion (runtime)  | Pigment CSS (build) |
| ------------- | ------------------ | ------------------- |
| **bundle**    | +runtime ~10KB     | +0 KB               |
| **首屏 FCP**  | 较慢（动态生成）   | **快（CSS link）**  |
| **SSR**       | 复杂（registry）   | **简单（静态文件）** |
| **运行时主题**| 支持               | **有限**            |

API 跟 Emotion 高度兼容：
- styled('div')(...) 写法相同
- sx prop 支持
- theme 概念相同
- 但 dynamic 样式有限制（动态值需要 CSS Variables）

适用场景：
- ✅ 静态网站 / 营销页 / 文档站
- ✅ 性能极致要求
- ✅ Next.js 静态导出
- ⚠️ 需要运行时主题切换 → 配合 CSS Variables 可行
- ❌ 完全动态样式（依赖运行时状态）→ 不适用

[click] 现状：Pigment CSS 仍处 alpha ——

- 文档：mui.com/material-ui/integrations/pigment-css（404，因实验状态文档不稳定）
- npm：@pigment-css/react / @pigment-css/vite-plugin / @pigment-css/nextjs-plugin
- 兼容性：基础组件已支持，复杂用例需要解决方案

新项目策略：
- 稳定生产：默认 Emotion
- 性能敏感 + 愿意试新 → 试 Pigment CSS
- 关注 mui.com/blog 追踪正式版进度
-->

---
transition: fade-out
---

# Base UI / Joy UI 现状

迁移、暂停 —— MUI 战略调整

<v-click>

| 子项目            | 当前状态                   | 推荐做法                   |
| ----------------- | -------------------------- | -------------------------- |
| **Material UI**   | 主力（v9+）                | **默认选这个**             |
| **MUI X**         | 主力（v9.2+）              | Data Grid / Pickers / Charts |
| **Base UI**       | **已迁出独立**（base-ui.com）| 无样式想自定义选这个       |
| **Joy UI**        | **暂停开发**（v5 已发布）   | 不推荐新项目用             |
| **Pigment CSS**   | 实验中                     | 性能极致场景试用           |

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MUI 公司近年战略调整，几个项目状态变化：

**Material UI（@mui/material）—— 主力，默认选这个**：
- v9.0+ 持续迭代
- 60+ 组件，Material Design 风格
- 95% MUI 用户在用

**MUI X（@mui/x-data-grid / x-date-pickers / x-charts / x-tree-view / x-scheduler）—— 商业产品线**：
- v9.2+ 持续迭代
- 高级组件，部分 Pro/Premium 收费
- 是 MUI 公司的核心营收来源

**Base UI（@mui/base → 独立项目 base-ui.com）—— 已迁出**：
- 原本是 MUI 的「无样式底层组件」
- 2024 年迁出 MUI，独立成 base-ui.com
- 团队继承自 MUI Base + Radix 思路
- 类似 Radix UI / Headless UI 风格
- 适合「想用 hooks 而非组件」「想完全自己写样式」的项目
- 与 Material UI 不同 —— Base UI 不带任何样式

**Joy UI（@mui/joy）—— 暂停开发**：
- 2022 年推出，「不那么 Material 的 MUI」
- 目标：探索 MUI 公司「Material 之外」的设计语言
- 2024 年底 MUI 公司宣布「暂停 Joy UI 开发」
- v5 已发布且功能稳定，但不会有新特性
- 不推荐新项目使用 Joy UI（无未来）

**Pigment CSS（@pigment-css/*）—— 实验中**：
- 零运行时 CSS-in-JS
- 持续迭代，alpha 阶段
- 未来可能整合到 Material UI 默认引擎

战略解读：
- MUI 聚焦「Material UI + MUI X + Pigment CSS」三大产品线
- Base UI 拆出独立运营，与 Material UI 同源但目标不同
- Joy UI 战略上不再投入（人力倾斜到 Material UI + Pigment CSS）

选型建议：
- **新项目 + 通用场景**：Material UI
- **新项目 + 极致定制**：Base UI（无样式 hooks）
- **企业后台 + 高级表格**：Material UI + @mui/x DataGrid
- **慎选 Joy UI**：可用但无未来
-->

---
transition: fade-out
---

# TypeScript Module Augmentation

扩展主题类型，自定义 palette / variant

<v-click>

```ts
// theme.ts
import "@mui/material/styles";
import "@mui/material/Button";

declare module "@mui/material/styles" {
  interface Palette { brand: Palette["primary"] }            // theme.palette.brand
  interface PaletteOptions { brand?: PaletteOptions["primary"] }
}
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides { brand: true }         // color="brand"
}

// 使用：色板 + 类型完整
const theme = createTheme({
  palette: { brand: { main: "#722ed1", contrastText: "#fff" } },
});
<Button color="brand">品牌按钮</Button>;
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Module Augmentation 是 MUI TypeScript 体验的「皇冠特性」——

业务场景：
- 默认色板只有 primary / secondary / error / warning / info / success
- 项目品牌色 brand / accent / highlight 等需要新增
- 直接 createTheme({ palette: { brand: ... } }) 会 TS 报错（不在类型里）

Module Augmentation 解决方案：
- 用 `declare module '@mui/material/styles'` 扩展 Palette / PaletteOptions
- 用 `declare module '@mui/material/Button'` 扩展 ButtonPropsColorOverrides
- 类型完整，业务代码用 brand 不会 TS 报错

扩展点（部分清单）：

**主题层**：
- Palette / PaletteOptions（新增 color group）
- TypographyVariants / TypographyVariantsOptions（新增字体变体）
- BreakpointOverrides（新增 / 修改断点名）
- Theme / ThemeOptions（新增任意自定义字段）

**组件层**：
- ButtonPropsColorOverrides / ButtonPropsVariantOverrides / ButtonPropsSizeOverrides
- ChipPropsColorOverrides / ChipPropsVariantOverrides
- TypographyPropsVariantOverrides（用新字体变体）
- 几乎每个组件都有对应的 Overrides 接口

进阶：自定义 Button variant
```ts
declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    dashed: true;  // <Button variant="dashed">
  }
}

const theme = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "dashed" },
          style: { border: "2px dashed", borderRadius: 8 },
        },
      ],
    },
  },
});
```

实战建议：
1. 项目根目录建 `src/types/mui.d.ts` 集中存放
2. 每次新增 palette / variant 同步更新 .d.ts
3. tsconfig.json 的 include 包含 .d.ts

这种「扩展底层类型」的做法是 TypeScript 模块增强的经典案例 —— 也是 MUI 类型系统的强项。
对比 Ant Design：AntD 也支持但没有 MUI 这么深 —— theme.token 可扩展，但 color/variant 限制多。
-->

---
transition: fade-out
---

# v6 → v7 迁移要点

Grid v2 / CSS Layers / ESM / Lab 转正

<v-click>

| 变更             | v6                          | v7                       |
| ---------------- | --------------------------- | ------------------------ |
| **Grid**         | `<Grid item xs={6}>`        | `<Grid size={6}>`        |
| **GridLegacy**   | -                           | 老 Grid 改名（兼容）     |
| **deep import**  | `@mui/material/styles/createTheme` | `@mui/material/styles` |
| **Lab 组件**     | `@mui/lab` 下               | `@mui/material` 主包     |
| **createMuiTheme / Hidden** | deprecated（v5）  | **移除**（Hidden 用 sx） |
| **InputLabel**   | `size="normal"`             | `size="medium"`          |

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v6 → v7 是「中等规模」迁移，不像 v4 → v5 那么剧烈，但有几个必知点：

**1. Grid 重大变化**：
- v7 起 `<Grid>` 即 Grid v2（原 Grid2）
- 老 Grid 改名 `<GridLegacy>`（向后兼容）
- 语法：`<Grid item xs={6}>` → `<Grid size={6}>` / `<Grid size={{ xs: 6, md: 4 }}>`
- 没有 item prop 了，所有 Grid 都默认 item
- container 不变

迁移方案：
- 推荐：用 codemod 自动迁移到 Grid v2
- 保守：暂时 import GridLegacy 保留旧代码，逐步迁移

**2. Deep import 移除**：
```tsx
// ❌ v6 老写法
import createTheme from '@mui/material/styles/createTheme';

// ✅ v7 新写法
import { createTheme } from '@mui/material/styles';
```

原因：v7 重构 ESM 导出，深层路径不再保证存在。
影响范围：tree-shaking 工具 / 自动 import 工具配置需要更新。

**3. Lab 组件转正**：
- v6：`import Alert from '@mui/lab/Alert'`
- v7：`import Alert from '@mui/material/Alert'`
- Alert / Autocomplete / Rating / Skeleton / Pagination / Tabs / Toggle 等
- @mui/lab 包仍存在，但里面只剩「真正实验中」的组件（如 Masonry / TreeView）

**4. 已移除的 API**：
- createMuiTheme → createTheme（v5 已 deprecated）
- Hidden 组件 → 用 sx={{ display: { xs: 'none', md: 'block' } }}
- experimentalStyled → styled
- onBackdropClick prop → onClose(event, reason) 判断 reason === 'backdropClick'

**5. modern bundle 移除**：
- 老 webpack/Vite config 中可能有 `@mui/material/modern/...` 别名
- v7 删除，需要清理 alias 配置

**6. TypeScript 要求**：
- 最低要求从 v4.7 升到 v4.9
- 新项目通常 v5+，不会触发

**7. InputLabel size**：
- `size="normal"` → `size="medium"`
- 一行 sed 解决

**迁移工具**：
```bash
npx @mui/codemod@latest v7.0.0/preset-safe src/
```
自动迁移大部分破坏性变化，包括 Grid。

时间预估：中型项目（5 万行）大约 3-5 天 + 完整回归测试。
-->

---
transition: fade-out
---

# MUI 生态全景

Core / X / Toolpad / Templates

<v-click>

| 子项目             | 用途                                    | 状态                  |
| ------------------ | --------------------------------------- | --------------------- |
| **@mui/material**  | 桌面 React UI 库（核心）                | **v9 主力**           |
| **@mui/x-data-grid** | 高级表格（Community/Pro/Premium）      | **v9.2 主力**         |
| **@mui/x-date-pickers** | 日期时间选择器                      | v9.2 主力             |
| **@mui/x-charts**  | 数据可视化（MIT 免费）                  | v9.2 主力             |
| **@mui/x-tree-view / scheduler** | 树形 / 日程表（预览）     | v9.2                  |
| **Toolpad / Templates** | 低代码工具 / 200+ 模板             | 独立产品              |

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MUI 已经从「单一 UI 库」演变成「全栈 React 解决方案」——

**核心 UI**：
- @mui/material：桌面 React UI，60+ 组件
- @mui/system：底层样式工具（styled / sx）—— 通常作为依赖自动安装
- @mui/icons-material：1500+ Material Design 图标

**MUI X（商业产品线）**：
- @mui/x-data-grid：高级表格
  - Community（MIT）：基础功能
  - Pro（付费）：列固定 / 树形 / 多列排序
  - Premium（付费）：行分组 / 透视表 / Excel 导出
- @mui/x-date-pickers：日期 / 时间 / 范围
  - Community（MIT）：单选 + 多选
  - Pro（付费）：范围选择 + 单元格高级
- @mui/x-charts：图表（**全免费 MIT**）
  - LineChart / BarChart / PieChart / ScatterChart / Sparkline 等
- @mui/x-tree-view：树形展示
  - Community / Pro
- @mui/x-scheduler：日程表（预览阶段）

**Toolpad**：
- MUI 出品的「低代码内部工具构建器」
- 类似 Retool / Appsmith，针对 MUI 用户
- 已 GA，独立产品线

**MUI Templates**：
- 官方维护的模板库
- 200+ 模板涵盖营销页 / 后台 / Dashboard / SaaS
- 部分免费 / 部分付费（设计资源 + 完整 Next.js / Vite 项目）
- store.mui.com 浏览

**MUI Design Kits**：
- Figma / Sketch / Adobe XD 设计资源
- 跟代码 1:1 对应，设计师可直接 hand-off
- 付费方案

**社区生态**：
- mui-treasury：第三方扩展组件库
- react-admin：基于 MUI 的 admin 框架
- Refine：另一个 admin 框架，可选 MUI
- Material Dashboard / Argon Dashboard 等数十个免费 / 付费模板

这一套体系让 MUI 不只是「组件库」，而是「React 全栈解决方案」 ——
设计资源 + UI 组件 + 高级套件 + 内部工具构建器 + 模板 全部覆盖。
-->

---
transition: fade-out
---

# 生态对比 / 选型矩阵

什么场景选 MUI？什么场景不选？

<v-click>

| 场景                       | 推荐                  | 原因                          |
| -------------------------- | --------------------- | ----------------------------- |
| React 全球 / C 端          | **MUI**               | Material 设计 + 全球生态最深  |
| React 中国 B 端            | **Ant Design**        | 中文资料丰富 + B 端审美       |
| React 中后台 + 高级表格    | **MUI + DataGrid**    | DataGrid Pro 媲美 AG Grid    |
| React 设计感强 / 自定义    | **Base UI / Radix**   | 无样式 hooks 可深定制         |
| React 极致性能 / 静态站    | **MUI + Pigment**     | 零运行时 CSS                  |
| React Native               | **NativeBase / Tamagui** | MUI 不支持 RN              |
| 移动 H5                    | **MUI（自适应）/ Vant** | MUI 响应式 / Vant 移动专精    |

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 选型不是「哪个最好」，而是「哪个适合你的场景」——

**MUI 的核心优势场景**：

- **全球项目 / C 端产品**：Material Design 是全球用户最熟悉的设计语言
  - YouTube / Gmail / Google 系产品都用 Material
  - 海外用户对 MUI 视觉「天然亲切」

- **企业后台 + 高级表格 / 日期 / 图表**：
  - @mui/x DataGrid Community 已经媲美 90% 国内表格库
  - DataGrid Pro 提供「列固定 / 树形 / 多列排序」企业级特性
  - Date Pickers 业界标杆
  - Charts 免费 + MUI 主题集成

- **设计资源完整**：
  - Figma 设计稿 + 代码 1:1 对应
  - 200+ 模板可二开
  - 设计师 hand-off 极顺

- **React 团队主力**：
  - GitHub 95K star，海外几乎默认选 MUI
  - 招聘市场 React + MUI 候选人最多

**MUI 不太适合的场景**：

- **中国 B 端后台**：颜值偏 C 端，中文资料不如 Ant Design
  → 推荐 Ant Design

- **极致设计定制**：MUI 主题系统强但仍有「框架痕迹」
  → 推荐 Base UI（无样式） + 自己写 Tailwind / CSS

- **极致性能 / 静态站**：MUI + Emotion 运行时开销
  → 推荐 MUI + Pigment CSS（实验）或 Mantine + CSS vars

- **React Native**：MUI 不支持 RN
  → 推荐 NativeBase / Tamagui / Gluestack UI

- **移动 H5 专门项目**：MUI 响应式好但仍偏桌面
  → 推荐 Vant UI（移动专精）或 MUI + 移动模板

选型小结：
- 不知道选什么 + 全球 / C 端 → MUI
- 不知道选什么 + 中国 / B 端 → Ant Design
- 重度自定义 → Base UI / Radix + Tailwind
- 移动 H5 → Vant / 自己写
- 团队曾用过 Material → MUI（无缝）

中国团队 + MUI vs Ant Design 是「文化差异」选择：
- 倾向 Google Material / Gmail / YouTube 风格 → MUI
- 倾向阿里 / 蚂蚁后台风格 → Ant Design
- 两者都是「事实标准」，选哪个都不错
-->

---
transition: fade-out
---

# 常见踩坑（一）：colorScheme 闪烁

SSR 暗色模式首屏「亮 → 暗」闪烁

<v-click>

**症状**：Next.js App Router + colorSchemes，首屏先亮一下才变暗（FOUC）

</v-click>

<v-click>

**原因**：服务端不知道用户选择，HTML 渲染时是默认 mode（light）

</v-click>

<v-click>

**解法**：用 InitColorSchemeScript（v6.5+ 内置）

```tsx
// app/layout.tsx
import { InitColorSchemeScript } from "@mui/material/InitColorSchemeScript";

<html suppressHydrationWarning>
  <body>
    <InitColorSchemeScript attribute="data" />   {/* 必须 body 第一个 */}
    <AppRouterCacheProvider>...</AppRouterCacheProvider>
  </body>
</html>;
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 colorSchemes 用户最常遇到的「奇怪问题」——

页面看起来正常，但每次刷新瞬间能看到「亮色 → 暗色」的闪烁。
用户体验极差，特别是真正喜欢暗色的用户。

[click] 闪烁原因：

服务端渲染流程：
1. 服务端 Next.js 拿到请求，开始渲染 HTML
2. 但服务端不知道用户选择什么 mode（localStorage 在浏览器里）
3. ThemeProvider 用 defaultMode（'light' 或 'system'）渲染
4. HTML 发到客户端：CSS 是 light mode
5. 浏览器开始解析 HTML + CSS → 渲染亮色页面
6. JS 加载 + hydration 完成
7. 客户端读 localStorage 发现是 dark → 切换 data 属性
8. CSS 重新计算 → 渲染暗色页面

第 5 步到第 8 步之间用户看到「亮色 → 暗色」的瞬间闪烁。

[click] InitColorSchemeScript 解决方案：

工作原理：
- 渲染一段 inline script 到 HTML body 第一行
- 这段 script 是「同步执行」的（在 React 加载前）
- script 读 localStorage，立即设 data-mui-color-scheme
- 浏览器解析 CSS 时 data 属性已经设好 → 直接渲染正确 mode

关键点：

1. **必须放在 body 第一个**：如果晚于 children，依然有闪烁
2. **必须 suppressHydrationWarning**：因为 script 改 DOM 属性后跟 SSR 不一致
3. **attribute 跟 createTheme 一致**：'data' / 'class'

跟其他方案对比：

| 方案                  | 防闪烁 | 易用度 |
| --------------------- | ------ | ------ |
| **InitColorSchemeScript** | ✅ | **★★★★★** |
| 自己写 inline script  | ✅      | ★★★    |
| 默认 dark mode        | ⚠️      | ★★★★★（但永远 dark） |
| useEffect 切换        | ❌      | ★★（依然闪烁） |

注意：useEffect 在 hydration 后才执行 —— 用 useEffect 切换 mode 没用，必须 inline script。

cookie 方案（高级）：
- 把 mode 存在 cookie 而非 localStorage
- 服务端读 cookie → 渲染正确 mode
- 完全无闪烁（无 inline script）
- 复杂度高，仅极致性能要求时考虑
-->

---
transition: fade-out
---

# 常见踩坑（二）：sx 性能陷阱

高频 rerender 场景下 sx 重复计算

<v-click>

**症状**：列表 1000+ 项，每个 item 用 sx prop，滚动卡顿

</v-click>

<v-click>

**原因**：sx 每次渲染都重新计算 className + 注入 CSS

</v-click>

<v-click>

**解法**：高频组件用 styled() 替代 sx

```tsx
// ❌ 慢（每个 ListItem 都重新计算 sx）
{items.map((item) => (
  <Box sx={{ p: 2, "&:hover": { bgcolor: "primary.50" } }}>{item.name}</Box>
))}

// ✅ 快（编译期生成 className）
const Item = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  "&:hover": { backgroundColor: theme.palette.primary[50] },
}));
{items.map((item) => <Item key={item.id}>{item.name}</Item>)}
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] sx 是 MUI 5+ 的「明星 API」但有性能陷阱 ——

业务场景：
- 长列表（1000+ 项）
- 每个 item 用 sx={{ p: 2, ... }}
- 用户滚动时新 item 进入 viewport 触发渲染
- 卡顿，FPS 掉到 30 以下

[click] 性能问题原理：

sx prop 工作方式：
1. 每次组件渲染，sx 对象重新创建
2. MUI 解析 sx 对象，转换成 CSS 字符串
3. 生成 className（唯一 hash）
4. 注入 CSS 到 <head>（或 cache 中复用）
5. 应用 className 到组件

热点：
- 步骤 1-3 每次渲染都执行
- 即使 sx 内容相同，对象引用变化
- MUI 内部有 cache 优化（同样 sx 对象不重复注入 CSS），但解析依然每次执行

[click] styled() 解决方案：

styled 工作方式：
1. 模块加载时，styled 一次性生成 className
2. 注入 CSS 到 <head>
3. 后续渲染只 spread className 到组件

差异：
- styled：每次渲染只是 className 传递 → 极快
- sx：每次渲染都需要解析 + 生成 className → 慢

性能差异约 5-10 倍 —— 在 1000 项列表上明显。

实战策略：

1. **高频 rerender 组件用 styled**：
   - 列表项 / Table row / Tree node 等

2. **一次性 / 低频组件用 sx**：
   - 页面布局 / 弹窗 / 表单 等

3. **样式靠 props 动态**：
   - styled 接收 props 参数：`styled('div')<{ active: boolean }>(({ active }) => ({ opacity: active ? 1 : 0.5 }))`
   - 比 sx 动态对象快

4. **CSS Variables 配合**：
   - styled 使用 CSS 变量 → 动态值切换不需要重新生成 className
   - 极致性能场景的标准做法

5. **Pigment CSS（实验）**：
   - 零运行时方案
   - sx 也能编译期生成 className
   - 未来正式版可彻底解决

简单判断：
- 单个组件 / 单次渲染：sx
- 列表项 / 重复使用：styled
- 完全静态 + 性能极致：Pigment CSS
-->

---
transition: fade-out
---

# 常见踩坑（三）：mode 判断闪烁

theme.palette.mode 在 colorSchemes 下不变

<v-click>

**症状**：v6+ 启用 colorSchemes，代码里 `theme.palette.mode === 'dark'` 永远是 'light'

</v-click>

<v-click>

**原因**：colorSchemes 模式下 theme 对象不再随模式变化，CSS 变量切换不触发 React 重渲染

</v-click>

<v-click>

**解法**：用 theme.applyStyles 替代 mode 判断

```tsx
// ❌ 错（mode 永远 'light'）
const Card = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
}));

// ✅ 对（生成两套 CSS 选择器）
const Card = styled(Box)(({ theme }) => ({
  background: "#fff",
  ...theme.applyStyles("dark", { background: "#1e1e1e" }),
}));
```

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 v5 → v6+ 迁移时最常见的「奇怪问题」——

旧代码（v5 时代）能用，v6+ 启用 colorSchemes 后失效。

[click] 根本原因：

v5 时代主题系统：
- createTheme({ palette: { mode: 'dark', ... } })
- 切换暗色 = 替换 theme 对象 + ThemeProvider 重新渲染
- theme.palette.mode 反映当前 mode
- styled / sx 里 `theme.palette.mode === 'dark'` 判断正确

v6+ colorSchemes 系统：
- createTheme({ colorSchemes: { light: ..., dark: ... } })
- 切换暗色 = 改 <html> 上的 data-mui-color-scheme 属性
- theme 对象不变，React 不重渲染
- 但 CSS 变量已经切换（浏览器原生）
- styled / sx 里 `theme.palette.mode` 永远是「初始化时的 mode」（通常是 'light'）

这是 colorSchemes 的「性能优势」也是「迁移陷阱」——
React 不重渲染（高性能），但代码里的 mode 判断也不会重新执行。

[click] applyStyles 解决方案：

工作原理：
```tsx
theme.applyStyles('dark', { background: '#1e1e1e' })
// 等价于：
// {
//   '[data-mui-color-scheme="dark"] &': { background: '#1e1e1e' }
// }
```

生成的 CSS：
```css
.MyComponent { background: #fff; }
[data-mui-color-scheme="dark"] .MyComponent { background: #1e1e1e; }
```

浏览器根据 <html> 上的 data 属性决定哪条规则生效 —— 0 React 重渲染。

正确写法：
```tsx
const Card = styled(Box)(({ theme }) => ({
  background: '#fff',
  color: '#000',
  ...theme.applyStyles('dark', {
    background: '#1e1e1e',
    color: '#fff',
  }),
}));
```

或者直接用主题 token（最优雅）：
```tsx
const Card = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,  // 自动跟随 colorScheme
  color: theme.palette.text.primary,
}));
```

如果一定要在 JS 里读 mode：用 useColorScheme() Hook
```tsx
const { mode } = useColorScheme();
if (mode === 'dark') { /* 业务逻辑 */ }
```

但 useColorScheme() 是 React state，触发 rerender —— 仅用于「业务逻辑」，不用于「样式判断」。
样式判断永远用 applyStyles。
-->

---
transition: fade-out
---

# 常见踩坑（四）：Grid v2 迁移

`<Grid item>` 报错 / size prop 替换

<v-click>

**症状**：v7 升级后 Grid 大量 TypeScript 报错 / 视觉错乱

</v-click>

<v-click>

**原因**：v7 起 `<Grid>` 即 Grid v2，老 `<Grid item xs={6}>` 语法已废弃

</v-click>

<v-click>

**两种解法**

```tsx
// 方案 1：迁移到 Grid v2（推荐）
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 6 }}>左</Grid>
  <Grid size={{ xs: 12, md: 6 }}>右</Grid>
</Grid>

// 方案 2：保留老代码用 GridLegacy
import GridLegacy from "@mui/material/GridLegacy";
<GridLegacy container spacing={2}>
  <GridLegacy item xs={12} md={6}>左</GridLegacy>
</GridLegacy>;
```

</v-click>

<v-click>

> 用 codemod 自动迁移：`npx @mui/codemod@latest v7.0.0/grid-props src/`

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Grid 重命名是 v6 → v7 最大的破坏性变化 ——

v6 时代 Grid 状态：
- 老 Grid：`<Grid item xs={6}>` 写法（多年迭代有遗留）
- 新 Grid2：`<Grid2 xs={6}>` 写法（v5.12+ 引入）
- 两者共存，新项目推荐 Grid2

v7 决定「正式化」：
- 老 Grid 改名 → `<GridLegacy>`
- 新 Grid2 改名 → `<Grid>`（占据原名字）
- 项目 import Grid 自动用新版

[click] 视觉错乱原因：

老代码 `<Grid xs={6}>` 在 v7：
- v6：会渲染（Grid 旧版 + xs 直接生效）
- v7：xs 不是 Grid v2 的 prop，被忽略
- 结果：所有 Grid 都满宽，布局错乱

或者 TS 报错：
- v6：xs 是 Grid 老 prop，类型存在
- v7：Grid 即 Grid v2，xs 不再是 prop
- 编辑器红线一片

[click] 迁移方案：

**方案 1：迁移到 Grid v2（推荐）**
- 用 codemod 工具自动迁移
- 代码量少（< 100 处 Grid）可手动改
- 长期维护，享受 v7 优化

**方案 2：保留 GridLegacy（临时）**
- 把所有 `import Grid from '@mui/material/Grid'`
- 改成 `import GridLegacy from '@mui/material/GridLegacy'`
- 业务代码用 `<GridLegacy>`
- 长期看是债务，但短期内救急可用

Grid v2 语法变化：

| v6 GridLegacy                     | v7 Grid v2                          |
| --------------------------------- | ----------------------------------- |
| `<Grid container>`                | 不变                                |
| `<Grid item xs={6}>`              | `<Grid size={6}>`                   |
| `<Grid item xs={12} md={6}>`      | `<Grid size={{ xs: 12, md: 6 }}>`   |
| `<Grid item xs={12} md={6} lg={4}>` | `<Grid size={{ xs: 12, md: 6, lg: 4 }}>` |
| 自动间隔 `spacing={2}`            | 不变                                |
| `direction="column"`              | 不变                                |
| `<Grid offset={2}>`               | `<Grid offset={2}>` 或 `offset={{ md: 2 }}` |

codemod 命令：
```bash
# 一键迁移整个 src/ 目录
npx @mui/codemod@latest v7.0.0/grid-props src/

# 干跑模式（不实际修改）
npx @mui/codemod@latest v7.0.0/grid-props src/ --dry
```

codemod 处理：
- ✅ `<Grid item xs={...}>` → `<Grid size={...}>`
- ✅ 移除 `item` prop
- ✅ 响应式断点合并
- ⚠️ 不处理嵌套 Grid（需要人工 check）
- ⚠️ 不处理动态 `<Grid item {...props}>`（需要人工 check）

实战建议：
- 中型项目（< 100 处 Grid）：codemod + 人工 review
- 大型项目（500+ 处 Grid）：分模块迁移，GridLegacy 暂时保留
- 新项目：直接 Grid v2，无需考虑 Legacy
-->

---
transition: fade-out
---

# 评价

成熟稳定 / Material 主流 / 全球生态，但 bundle 偏大

<v-clicks>

**优点**

- 60+ 组件 + @mui/x 高级套件 = 实际能用 80+ 覆盖几乎所有场景
- sx prop + styled + createTheme 三层主题系统体验业界标杆
- TypeScript 原生 + Module Augmentation，类型扩展极强
- 全球生态最深，GitHub 95K star，海外团队默认选 MUI
- Next.js App Router 官方集成（AppRouterCacheProvider + InitColorSchemeScript）

**缺点**

- bundle 偏大（gzipped ~250-400KB），重度移动端不友好
- v6 → v7 Grid 迁移有破坏性变化（必做 codemod）
- @mui/x DataGrid Pro/Premium 收费 / 中文资料不如 Ant Design
- Joy UI 暂停发展信号不太友好

</v-clicks>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MUI 的优点集中在「全球生态 + 设计体系」——

60+ 组件 + @mui/x 套件几乎覆盖所有企业场景：
- 通用 UI：Material UI 60+
- 高级表格：DataGrid（媲美 AG Grid）
- 日期选择：Date Pickers（业界标杆）
- 图表：x-charts（免费 + 主题集成）
- 树形：x-tree-view
- 日程：x-scheduler（预览）

sx prop + styled + createTheme 三层主题系统：
- sx：行内样式 + 主题感知 + 响应式
- styled：可复用样式组件 + 类型推导
- createTheme：全局配置 + colorSchemes 多模式
- 三层渐进，按需选择

TypeScript 体验业界标杆：
- 所有 props 完整类型
- Module Augmentation 扩展主题（Palette / TypographyVariants 等）
- 组件级 Overrides（ButtonPropsColorOverrides 等）
- 拼错 'primary' → 'primery' 立刻报错

全球生态：
- GitHub 95K star（React UI Top 1）
- npm 周下载 600 万
- 200+ 全职员工的 MUI 公司商业化运营
- 海外项目几乎默认选 MUI

Next.js 集成最完善：
- @mui/material-nextjs 官方包
- AppRouterCacheProvider 防 CSS-in-JS 闪烁
- InitColorSchemeScript 防暗色闪烁
- v15 App Router 完整支持

[click] 缺点也很明确：

**bundle 偏大** ——
- @mui/material gzipped ~150KB
- 加 @emotion 运行时 + @mui/x 大约 ~250-400KB
- 重度移动端 / 性能极致场景需要 Pigment CSS（实验）替代

**v6 → v7 Grid 迁移成本** ——
- Grid 重命名（老 Grid → GridLegacy，Grid2 → Grid）
- size prop 替换 item + xs/md
- 中型项目（5 万行）大约 3-5 天 + 完整回归测试
- 但有 codemod 工具，比 v4 → v5 简单

**@mui/x 商业化** ——
- DataGrid Pro $180/dev/year
- DataGrid Premium $480/dev/year
- 部分中小企业敏感
- Community 版功能仍然丰富，免费够用 60% 场景

**中文资料** ——
- 不如 Ant Design 丰富（数量 5-10 倍差距）
- 中国大厂主要用 Ant Design，MUI 多见外企 / 出海团队
- 但 MUI 官方文档英文质量极高 + 翻译完整

**Joy UI 暂停** ——
- 2022 推出，2024 底暂停
- 给市场不友好信号 「MUI 产品线收缩」
- 实际上 MUI 公司在聚焦 Material UI + Pigment CSS

选型逻辑：
- 全球 / 海外 / C 端 / Material 风格 → MUI（默认）
- 中国 B 端 / Ant 风格 / 中文资料多 → Ant Design
- 性能极致 / 静态站 → MUI + Pigment CSS（试）或 Mantine
- 设计自定义重 → Base UI / Radix
-->

---
transition: fade-out
---

# 学习路径

从入门到企业级实战的 4 个阶段

<v-click>

**第 1 周：核心组件熟练**

- 通读官方文档 Inputs + Data Display + Feedback 三大分组
- 写一个 CRUD 页面（Table + Form + Dialog 三件套）

</v-click>

<v-click>

**第 2 周：主题 + sx + styled 精进**

- 跑通 createTheme + cssVariables + colorSchemes 切换暗色
- sx 与 styled 混合使用，封装设计系统基础组件

</v-click>

<v-click>

**第 3-4 周：企业级整合**

- 引入 @mui/x DataGrid / Date Pickers / Charts
- 接入 Next.js App Router + React Hook Form + zod

</v-click>

<v-click>

**长期：Module Augmentation + Pigment CSS** —— 扩展主题类型，关注 Pigment CSS 正式版进度。

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 第一周打基础 ——

官方文档结构清晰，按「Inputs → Data Display → Feedback」顺序读最高效：
- Inputs：Button / TextField / Checkbox / Radio / Select 等输入组件
- Data Display：Avatar / Chip / List / Typography / Tooltip 等展示组件
- Feedback：Alert / Dialog / Snackbar / Progress / Skeleton 等反馈组件

每个组件页面都有 CodeSandbox playground + 完整 props 表。
完成一个 CRUD 页面就算入门：Table 展示 / 表单 Dialog 编辑 / Snackbar 反馈。

[click] 第二周进阶 ——

主题系统是 MUI 的「软实力」分水岭：
- createTheme + cssVariables + colorSchemes 是 v9 推荐
- applyStyles 替代 mode 判断（避免闪烁）
- sx 与 styled 配合使用（一次性用 sx，复用用 styled）

封装基础组件：
- 在 design system 文件夹下封装 PrimaryButton / SectionTitle / Card 等
- 用 styled() 派生自 MUI 基础组件
- 项目全局复用

[click] 第三到四周企业级整合 ——

单独的 @mui/material 只是「组件库」，企业项目需要：

- 路由：React Router / TanStack Router / Next.js App Router
- 状态：Zustand / Jotai / Redux Toolkit / TanStack Query
- 表单：React Hook Form + zod
- 高级组件：@mui/x DataGrid（表格）+ Date Pickers + Charts
- 构建：Vite / Rsbuild / Next.js

「MUI + RHF + zod + DataGrid + Next.js」是 2025 年 React 企业项目主流组合。

接入 Next.js App Router：
- @mui/material-nextjs 官方包
- AppRouterCacheProvider 防 SSR 闪烁
- InitColorSchemeScript 防暗色闪烁

[click] 长期投入推荐 ——

**Module Augmentation 进阶**：
- 扩展 Palette / TypographyVariants / BreakpointOverrides
- 扩展 Button / Chip variant
- 建立完整设计系统的 TypeScript 基础

**Pigment CSS 关注**：
- 关注 mui.com/blog 追踪正式版进度
- 新项目可试用（性能极致需求）
- 老项目 alpha 阶段不建议迁移

**MUI X Pro/Premium**：
- 免费版（Community）够用 60% 场景
- 列固定 / 多列排序 → 考虑 DataGrid Pro
- 行分组 / Excel 导出 → 考虑 DataGrid Premium

**源码学习**：
- mui-material/src/Button/Button.tsx —— 学习「forwardRef + classes 系统」
- mui-system/src/createStyled —— 学习「styled 实现原理」
- mui-x-data-grid —— 学习「虚拟滚动 + 大列表性能」
-->

---
transition: fade-out
---

# 延伸学习资源

官方 + 社区精选

<v-click>

**官方资源**

- 📖 [官方文档](https://mui.com/) —— 英文质量第一档，中文翻译完整
- 💻 [GitHub](https://github.com/mui/material-ui) —— 95K+ star
- 🛍️ [MUI Store](https://mui.com/store/) —— 200+ 模板（设计 + 代码）
- 🎨 [Templates](https://mui.com/material-ui/getting-started/templates/) —— 官方免费模板

</v-click>

<v-click>

**企业后台模板** —— [react-admin](https://marmelab.com/react-admin/)（数据驱动 admin）/ [Refine](https://refine.dev/)（headless framework）

</v-click>

<v-click>

**配套技术栈**

- Next.js App Router + React Hook Form + zod = 现代全栈
- TanStack Query + dayjs + @mui/x = 实用三件套

</v-click>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 官方资源是第一手信息 ——

**官方文档**（mui.com）：
- 英文质量第一档：每个组件完整 API + CodeSandbox + 多版本示例
- 中文翻译完整：mui.com/zh/ 同步更新
- 文档结构清晰：Getting Started / Components / Customization / Migration

**GitHub**：
- 95K+ star（React UI Top 1）
- issue 区活跃，问题回复快
- 源码可读性高 —— Material UI 的 Button / TextField 是「React 组件库设计教科书」

**MUI Store**：
- store.mui.com
- 200+ 模板 + 设计资源
- 部分免费 / 部分付费（19-99 美元）
- 适合「快速搭建网站」

**官方免费模板**：
- mui.com/material-ui/getting-started/templates/
- Dashboard / Sign-in / Pricing / Blog / Album 等 20+ 模板
- 直接 copy-paste 到项目使用

[click] 企业后台模板：

**react-admin**：
- 数据驱动 admin 框架
- 基于 MUI（v4/v5），ra-data-* 数据源适配器丰富
- CRUD 极快，适合数据密集后台

**Refine**：
- Headless admin framework
- 默认配 MUI，也可选 Ant Design / Mantine / Chakra
- 灵活度比 react-admin 高，但学习曲线陡

新项目推荐：
- 标准后台 → react-admin
- 灵活定制 → Refine
- 完全自己搭 → MUI 官方 Dashboard 模板起步

[click] 配套技术栈：

**「Next.js App Router + RHF + zod」是 2025 年 React 全栈主流**：
- Next.js App Router：现代全栈框架，SSR + RSC
- React Hook Form：React 生态最流行的表单库
- zod：TypeScript-first 校验库
- 三者配合：类型完整 + SSR + 性能极致

**TanStack Query（react-query）**：
- 服务端状态管理事实标准
- 配合 MUI DataGrid 极佳（缓存 + 后台同步 + 错误重试）

**dayjs**：
- 日期处理事实标准
- @mui/x Date Pickers 默认推荐
- 7KB gzipped 极轻量

**@mui/x**：
- DataGrid + Date Pickers + Charts + Tree View + Scheduler
- 企业项目必备

**其他常用搭配**：
- Vite（构建）：比 webpack 快 10 倍
- Zustand / Jotai（客户端状态）：比 Redux 轻
- Framer Motion（动画）：MUI 默认动画外更复杂的动画
- React Router 6（如果不用 Next.js）

延伸阅读：
- [Awesome MUI](https://github.com/Sherlock-Holo/awesome-mui)：精选资源列表
- [MUI Treasury](https://mui-treasury.com/)：社区扩展组件库
- [MUI Blog](https://mui.com/blog/)：官方动态 + 案例研究
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 🎨

MUI — React 全球生态最深的 Material Design UI 库

<div class="mt-8 text-lg">

**核心心智**

- ThemeProvider 是全局配置中心，theme / cssVariables / colorSchemes 统一管
- sx prop 行内 / styled 复用 / createTheme 全局，三层渐进定制
- colorSchemes 多模式 + applyStyles 替代 mode 判断（v6+ 推荐）
- @mui/x 是高级组件套件（DataGrid / Pickers / Charts / Tree / Scheduler）
- Next.js App Router 配 AppRouterCacheProvider + InitColorSchemeScript 防闪烁

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://mui.com/" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/mui/material-ui" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://mui.com/store/" target="_blank" class="slidev-icon-btn">
    <carbon:play /> Templates
  </a>
</div>

<style>
h1 {
  background-color: #007fff;
  background-image: linear-gradient(45deg, #007fff 10%, #5e35b1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：MUI = React 全球生态最深、Material Design 主流的 UI 组件库 ——
60+ 组件 + @mui/x 高级套件 + 原生 TS + 强大主题系统。

核心心智五条：
1. ThemeProvider 是全局配置中心 —— theme / cssVariables / colorSchemes 统一在此设置
2. sx prop 行内 / styled 复用 / createTheme 全局 —— 三层主题渐进定制
3. colorSchemes 多模式配置 + applyStyles 替代 mode 判断 —— v6+ 推荐写法
4. @mui/x 是高级组件套件 —— DataGrid（Pro/Premium 收费）/ Date Pickers / Charts（免费）/ Tree View / Scheduler
5. Next.js App Router 集成 —— AppRouterCacheProvider 防 SSR 闪烁 + InitColorSchemeScript 防暗色闪烁

下一步建议：
- 跟着官方文档 Inputs + Feedback 两大分组实战一个 CRUD 页面
- 把 RHF + zod + TextField + Dialog + Snackbar 全套打通
- 然后接入 @mui/x DataGrid 重构表格，体验「企业级数据展示」
- 最后用 Next.js App Router 搭一个完整全栈应用，对标官方 Dashboard 模板

延伸学习：
- createTheme + colorSchemes + Module Augmentation 是「企业级 MUI 用户」必练
- @mui/x DataGrid Pro 是「重度后台」必要付费
- Pigment CSS 关注 alpha 进展，未来可能替代 Emotion 成为默认
- Base UI（独立项目）适合「想用 hooks 而非组件」场景

感谢观看！
-->
