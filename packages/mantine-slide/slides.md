---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Mantine
info: |
  Presentation Mantine v9 for React developers.

  Learn more at [https://mantine.dev/](https://mantine.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🪐</span>
</div>

<br/>

## Mantine — React Components Library

130+ 组件 / 70+ Hooks / 纯 CSS —— React 生态现代主流，性能与定制兼得

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Mantine —— React 生态最现代化的全功能 UI 组件库，2020 年立项，至今五年迭代，
当前主线 v9.2+，已经从 "新生代 React UI" 成长为社区主流方案之一。

核心卖点：
- 130+ 组件 + 70+ Hooks 的双轨制（React 生态最完整的 Hooks 库）
- 原生 CSS + PostCSS，无运行时 CSS-in-JS 开销
- Styles API 三件套（classNames / styles / vars）支持深度定制
- @mantine/core / hooks / form / dates / notifications / modals / spotlight / charts / tiptap 模块化生态
- CSS Variables + light-dark() 主题方案，ColorSchemeScript 防 SSR 闪烁
- Polymorphic 多态组件 + 原生 TypeScript
- Next.js / Vite / React Router / Gatsby 全适配
- GitHub 30K+ star，npm 周下载 500 万+

本次内容聚焦 v9（2025 年发布）+ v8 起的现代 API（Styles API / PostCSS / light-dark()）。
-->

---
transition: fade-out
---

# 什么是 Mantine？

React 生态现代化全功能 UI 组件库，120+ 组件 + 70+ Hooks 双轨制

<v-click>

- **120+ 组件**：Inputs / Combobox / Buttons / Navigation / Feedback / Overlays / Data display / Typography / Layout 十大分组
- **70+ Hooks**：state / DOM / utility / animation / network / clipboard 全场景覆盖（独家卖点）
- **原生 CSS**：基于 PostCSS，无运行时 CSS-in-JS 开销
- **Styles API**：classNames / styles / vars 三件套深度定制任意元素
- **light-dark()**：CSS 原生函数实现暗色模式，ColorSchemeScript 防 SSR 闪烁
- **Polymorphic**：component / renderRoot 多态组件，类型完整
- **模块化生态**：core / hooks / form / dates / notifications / modals / spotlight / charts / tiptap 等
- **TypeScript 原生**：120+ 组件 + Hooks 全量类型，泛型推导完整

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Mantine Overview_](https://mantine.dev/getting-started/)

</div>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Mantine 的核心定位非常清晰：「React 生态现代化全功能 UI 组件库」——

它不是单纯的组件库，而是「组件 + Hooks + 生态」三位一体：
- 组件：120+ 高质量 React 组件，覆盖企业 + C 端 + 营销页全场景
- Hooks：70+ 实用 Hooks，是 React 生态最完整的 Hooks 库（独家卖点）
- 生态：core / hooks / form / dates / notifications / modals / spotlight / charts / tiptap 等模块化包

最大的差异化：

1. **Hooks 库** —— MUI / Ant Design 都没有这么完整的 Hooks 体系
   - useClipboard / useDisclosure / useDebouncedValue / useLocalStorage 等
   - 这些 Hooks 即使不用 Mantine 组件库也能单独使用，是「轻量化项目」的福音

2. **原生 CSS** —— 不像 Ant Design (CSS-in-JS) / MUI (Emotion)，Mantine 用纯 CSS + PostCSS
   - 性能更好（无运行时开销）
   - SSR 更简单（CSS 是静态资源）
   - bundle 更小（不带 CSS-in-JS 运行时）

3. **Styles API** —— classNames / styles / vars 三层渐进式定制
   - 比 MUI sx 更可控（指定具体 selector key）
   - 比 Ant Design 主题 token 更灵活（任意元素可改）

下面会按「定位 → 演进 → 与 MUI/Ant 对比 → 安装 → Provider → 组件分组 → Styles API → 主题 → Form → Notifications → Modals → Spotlight → Combobox → DataTable → Dates → Charts → Tiptap → Hooks → Next.js → 多态 → 踩坑 → 学习路径」顺序讲透。
-->

---
transition: fade-out
---

# 与 MUI / Ant Design / Chakra 对比

为什么有人专程切换到 Mantine？

<v-click>

| 维度       | Mantine       | MUI              | Ant Design      | Chakra UI |
| ---------- | ------------- | ---------------- | --------------- | --------- |
| 设计语言   | 现代实用      | Material         | 企业中后台      | 友好简洁  |
| 组件数量   | **120+**      | 60+              | 70+             | 50+       |
| Hooks 库   | **70+ 独家**  | -                | -               | -         |
| 样式底层   | **纯 CSS**    | Emotion          | CSS-in-JS       | Emotion   |
| 主题方案   | CSS Vars      | sx + Theme       | Token + algo    | Theme 对象 |
| Bundle     | **~250KB**    | ~400KB           | ~400KB          | ~300KB    |
| 主导团队   | 社区          | MUI 公司         | 蚂蚁集团        | Adobe     |

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 横向对比 React 生态四大主流 UI 库，Mantine 的护城河是「组件最全 + Hooks 独家 + 纯 CSS 性能」：

**组件数量**：
- Mantine 120+ 最多 —— 几乎覆盖 React 生态所有 UI 需求
- Ant Design 70+ 第二
- MUI 60+ + @mui/x 高级套件补齐
- Chakra UI 50+ 最少

**Hooks 库（Mantine 独家）**：
- @mantine/hooks 提供 70+ Hooks，是 React 生态最完整的 Hooks 库
- 即使不用 Mantine UI 也能单独安装 @mantine/hooks 使用
- MUI / Ant Design 都没有等价的 Hooks 库
- 类似 react-use 但与 Mantine 设计语言一致，质量更稳

**样式底层（性能差异显著）**：
- **Mantine 纯 CSS + PostCSS** —— 无运行时开销，SSR 友好
- MUI Emotion —— CSS-in-JS 运行时，SSR 需配置
- Ant Design CSS-in-JS —— 类似 Emotion，运行时开销
- Chakra Emotion —— 同 MUI

**主题方案**：
- Mantine CSS Variables —— 浏览器原生切换，性能最好
- MUI sx + Theme —— 灵活但 JS 层处理
- Ant Design Token + algorithm —— 函数式优雅
- Chakra Theme 对象 —— 中庸

**Bundle 大小**：
- Mantine ~250KB（纯 CSS 不算开销）
- Ant Design / MUI ~400KB（含 CSS-in-JS 运行时）
- Chakra ~300KB

**主导团队**：
- Mantine 社区主导（Vitaly Rtishchev 个人创办，逐步社区化）
- MUI / Ant Design / Chakra 公司主导
- 社区主导优势：迭代快、自由度高；劣势：商业支持稍弱

选型逻辑：
- React + 设计感强 / 现代风 → Mantine（默认）
- React + Material 风 + 全球 → MUI
- React + 中国 B 端 → Ant Design
- React + 友好简洁 + 无障碍 → Chakra
-->

---
transition: fade-out
---

# 演进史

从 v1 到 v9 的五年快速迭代

<v-click>

| 版本      | 时间    | 关键事件                                                    |
| --------- | ------- | ----------------------------------------------------------- |
| 1.x       | 2020.7  | Vitaly Rtishchev 首次发布，React Hooks + Emotion            |
| 4.x       | 2022.2  | 100+ 组件，TypeScript 全量重写                              |
| 6.x       | 2023.4  | useForm + Notifications + Modals 生态成熟                   |
| **7.x**   | 2023.9  | **重大重构：抛弃 Emotion，转纯 CSS + PostCSS**              |
| **8.x**   | 2025.1  | Combobox 体系成熟 / Styles API 完善 / DatesProvider 重构     |
| **9.x**   | 2025+   | **@mantine/schedule 新增 / Async validation / 默认圆角 md** |

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Mantine 的演进有几个里程碑值得记住：

**1.x（2020.7）**：Vitaly Rtishchev 个人发起的开源项目
- React Hooks 风格组件库
- Emotion 作为样式底层（当时 React UI 主流方案）
- 首发即包含 50+ 组件，受到社区关注

**4.x（2022.2）**：组件数量突破 100+
- TypeScript 全量重写
- @mantine/form / hooks / notifications / modals 等模块化拆分
- GitHub star 突破 10K

**6.x（2023.4）**：生态成熟
- useForm 成为 RHF 之外的主流选择
- Notifications / Modals manager 模式成熟
- 文档质量提升到「业界第一档」

**7.x（2023.9）—— 最大的一次重构**：
- 抛弃 Emotion，转向纯 CSS + PostCSS
- 所有组件改为 CSS Modules 风格
- 性能大幅提升（无运行时开销）
- SSR 简化（CSS 是静态资源）
- 代价：v6 → v7 迁移工作量大，所有自定义样式都要改

**8.x（2025.1）**：
- Combobox 体系成熟（Autocomplete / Select / MultiSelect / TagsInput 一套底层）
- Styles API 完善（classNames / styles / vars 三件套）
- DatesProvider 重构（dayjs 集成更深）

**9.x（2025）—— 当前主线**：
- 新增 @mantine/schedule（日程表组件，对标 MUI X Scheduler）
- 表单异步校验支持 AbortSignal
- Standard Schema 校验集成（Zod / Valibot / ArkType 通用）
- 默认 border radius 从 sm → md（视觉更现代）
- Slider / RangeSlider 垂直方向支持
- Card 横向布局
- React 19.2+ / Tiptap 3+ / Recharts 3+ 依赖升级

本次内容聚焦 v9 + v8 起的现代 API（Styles API / PostCSS / light-dark() / Polymorphic）。
-->

---
transition: fade-out
---

# 设计哲学

实用优先 / 完整生态 / 性能至上 —— Mantine 的三大原则

<v-click>

**实用优先（Pragmatic）** —— 不追求设计语言，追求「能用 / 好用」

</v-click>

<v-click>

**完整生态（Batteries Included）** —— 130+ 组件 + 70+ Hooks，单一依赖覆盖 95% 场景

</v-click>

<v-click>

**性能至上（Native CSS）** —— 纯 CSS + PostCSS，无运行时开销，SSR 友好

</v-click>

<v-click>

**开发者友好（DX First）** —— TypeScript 原生 / 文档第一档 / 50+ Combobox 示例

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **实用优先** —— Mantine 跟 Material Design / Ant Design 最大的区别 ——

它没有「设计语言」这个概念，没有 Material 那样的「Z 轴 / 涟漪 / 弹性动画」哲学，
也没有 Ant Design 那样的「自然 / 确定性 / 意义感 / 生长性」价值观。

Mantine 的设计哲学就是「实用」：
- 颜色用 open-color（社区颜色标准，10 shade 数组）
- 间距 / 圆角 / 字号都是「常识值」（4/8/12/16/24）
- 动效克制，重要交互有 transition，不滥用
- 视觉风格「现代但不张扬」，B 端 / C 端都能用

这种「无设计语言」反而是优势 —— 工程师不用学习设计哲学，看文档直接上手。

[click] **完整生态** —— 「Batteries Included」是 Python 那边的术语 ——

意思是「电池都带好了，开箱即用」。Mantine 的做法：
- 组件：120+ 覆盖 UI 全场景
- Hooks：70+ 覆盖逻辑全场景
- 表单：@mantine/form（独立库，可单用）
- 日期：@mantine/dates（基于 dayjs）
- 图表：@mantine/charts（基于 recharts）
- 富文本：@mantine/tiptap
- 通知：@mantine/notifications
- 弹窗管理：@mantine/modals
- 命令面板：@mantine/spotlight
- 文件拖拽：@mantine/dropzone
- 轮播：@mantine/carousel
- 进度条：@mantine/nprogress
- 代码高亮：@mantine/code-highlight

加起来 13+ 官方包，几乎覆盖所有「企业项目要装的第三方库」。

[click] **性能至上** —— 这是 v7 大重构的核心动机 ——

v6 之前用 Emotion CSS-in-JS：
- 优点：动态主题简单，主题切换一行代码
- 缺点：运行时开销大，SSR 复杂，bundle 多 10-20KB

v7 切到纯 CSS：
- 所有样式静态 PostCSS 编译
- bundle 中只有 CSS 文件 + 组件 JS
- SSR 直接 link CSS，无 hydration 闪烁
- 性能比 v6 提升约 30%（首屏 FCP）

代价是「迁移成本」—— v6 → v7 所有自定义样式都要改写法。

[click] **开发者友好** —— DX 是 Mantine 最强调的卖点之一 ——

- TypeScript 原生：所有 props / hooks 完整类型
- 文档「业界第一档」：每个组件 5+ 个示例 + API 表 + Storybook 嵌入
- Combobox 文档独家：50+ 示例覆盖各种场景（单选 / 多选 / 远程 / 异步 / 标签）
- AI Friendly：mantine.dev 提供 LLM 文档 + Claude Skill + MCP 服务器

后两条对「LLM 辅助编码」非常关键 —— Cursor / Claude Code 用 Mantine 时上下文准确性最高。
-->

---
transition: fade-out
---

# 核心理念：v9 三大重点

@mantine/schedule / Async validation / Standard Schema

<v-click>

**1. @mantine/schedule（新增包）**

完整日程表组件，Day / Week / Month / Year 视图 + 拖拽 + 移动端优化

</v-click>

<v-click>

**2. 异步表单校验（AbortSignal）**

useForm 支持 async validate + AbortSignal 取消请求，竞态条件无忧

</v-click>

<v-click>

**3. Standard Schema 集成**

useForm 原生支持 Zod / Valibot / ArkType，统一校验心智

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **@mantine/schedule** 是 v9 最大的新增包 ——

定位：对标 MUI X Scheduler 的「日程表 / 日历调度」组件。

特性：
- 多视图：Day / Week / Month / Year 四种视图，一键切换
- 拖拽：事件可拖拽改时间 + 拖拽改时长
- 移动端：响应式优化，触屏交互友好
- 多事件类型：单次 / 重复 / 全天事件
- 时区：完整时区支持

为什么 Mantine 要做这个？
- 企业后台「日程 / 排班 / 会议室预订」场景常见
- 之前要么用 FullCalendar（学习曲线陡）
- 要么用 MUI X Scheduler（付费 + 商业版）
- @mantine/schedule 免费 + MIT，填补这个空白

[click] **异步校验 + AbortSignal** 是表单库的重要进化 ——

业务场景：
- 用户名唯一性校验（每次输入都调 API 查重）
- 用户输入「abc」→ 发请求 1
- 用户接着输入「abcd」→ 发请求 2
- 请求 1 响应慢，比请求 2 晚回来
- 结果：UI 显示「abc」可用，但用户已经在输 abcd —— 错误的反馈

v9 解决方案：
```ts
const form = useForm({
  validate: {
    username: async (value, _values, _path, options) => {
      const res = await fetch(`/api/check/${value}`, {
        signal: options.signal,  // AbortSignal 自动取消旧请求
      });
      const data = await res.json();
      return data.taken ? '用户名已被占用' : null;
    },
  },
});
```

每次新校验触发时，旧的 fetch 请求会被 abort，UI 只显示最新结果。
这是表单库的「现代化标配」，但 React Hook Form 等都还要手动实现。

[click] **Standard Schema** 是 2024 推出的「校验库统一标准」——

之前 RHF 需要 zodResolver / valibotResolver / yupResolver 分别适配。
Standard Schema 是 Zod / Valibot / ArkType / Effect Schema 等的「共同接口」 ——
useForm 一个 API 适配所有校验库：

```ts
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, '请输入姓名'),
  email: z.string().email('邮箱格式错误'),
});

const form = useForm({
  initialValues: { name: '', email: '' },
  validate: schema,  // 直接传 schema，无需 resolver
});
```

类似 RHF + zodResolver，但 Mantine 内置支持，无需额外包。

迁移：v8 用户的 zodResolver 仍可用，但官方推荐直接传 schema。
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
pnpm add @mantine/core @mantine/hooks
pnpm add -D postcss postcss-preset-mantine postcss-simple-vars
```

| 版本 | React 兼容 | 状态           |
| ---- | ---------- | -------------- |
| v9.x | React 19.2+ | **当前主线**   |
| v8.x | React 18+  | 稳定           |
| v7.x | React 18+  | LTS 维护       |

</v-click>

::right::

<v-click>

**导入 + 使用**

```tsx
import { MantineProvider, Button } from "@mantine/core";
import "@mantine/core/styles.css";

export default function App() {
  return (
    <MantineProvider>
      <Button variant="filled">提交</Button>
    </MantineProvider>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Mantine 安装比 MUI / Ant Design 多一步 PostCSS 配置 ——

核心包：
- @mantine/core：组件库本体
- @mantine/hooks：Hooks 库（推荐一起装，强相关）

devDeps：
- postcss：CSS 预处理引擎
- postcss-preset-mantine：Mantine 官方 PostCSS 预设（提供 light-dark / rem / mixin 等）
- postcss-simple-vars：CSS 变量预处理（响应式断点用）

为什么需要 PostCSS？
- Mantine 内部用 PostCSS 编译 CSS（v7+ 抛弃 Emotion 后的方案）
- 业务自定义样式也推荐用 PostCSS（共享 light-dark / breakpoint 等便利）
- Next.js / Vite 已经内置 PostCSS，只需 postcss.config.cjs 即可

版本说明：
- v9.x：当前主线，2025 年发布，要求 React 19.2+
- v8.x：稳定版本，React 18+，仍在大量项目使用
- v7.x：LTS 维护，纯 CSS 重构的第一个版本
- v6.x：已 EOL（Emotion 时代），不推荐新项目

新项目推荐 v9（最新特性 + 标准 Schema 集成）。

[click] 第一个组件极简 ——

跟 Ant Design / MUI 一样，Mantine 也是「按需 import」—— 不需要全局注册。
直接 `import { Button } from '@mantine/core'` 即可。

但有几个差异：

1. **必须 import CSS** —— v7+ 用静态 CSS，所以要 `import '@mantine/core/styles.css'`
   - 不像 Ant Design v5（CSS-in-JS 自动注入）
   - 不像 MUI（Emotion 自动注入）
   - 但好处是 SSR 简单 + 性能好

2. **必须包 MantineProvider** —— 跟 ConfigProvider / ThemeProvider 同理
   - 提供 theme / colorScheme / CSS Variables 等
   - 即使不自定义主题，也要包一层（提供默认 theme）

3. **variant 是常见 prop**：
   - filled（实心，默认）/ outline（边框）/ subtle（弱化）/ light（浅色）
   - default（默认）/ transparent（透明）/ white（白底）/ gradient（渐变）

第一个组件不需要任何额外配置就能跑起来。
-->

---
transition: fade-out
---

# MantineProvider + ColorSchemeScript

应用根部双包裹，SSR 防闪烁标配

<v-click>

```tsx
import { MantineProvider, ColorSchemeScript, createTheme, mantineHtmlProps } from "@mantine/core";
import "@mantine/core/styles.css";

const theme = createTheme({
  primaryColor: "violet",
  defaultRadius: "md",
  fontFamily: "Inter, sans-serif",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" {...mantineHtmlProps}>
      <head><ColorSchemeScript defaultColorScheme="auto" /></head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MantineProvider + ColorSchemeScript 是 Mantine 项目的「标准入口模板」——

**MantineProvider 职责**：
1. 提供 theme 对象给所有子组件
2. 注入 CSS Variables 到 :root
3. 管理 colorScheme（light / dark / auto）
4. 集成各种 manager（Modals / Notifications 等）

**ColorSchemeScript 职责**（专门防暗色 SSR 闪烁）：
- 在 HTML 渲染时同步执行的 inline script
- 读取 localStorage 的 colorScheme 值
- 设置 <html> 的 data-mantine-color-scheme 属性
- CSS 渲染时已经有正确的 scheme，无闪烁

**mantineHtmlProps**：
- 给 <html> 加上 Mantine 需要的 props
- 主要是 suppressHydrationWarning（避免 ColorSchemeScript 改 DOM 后的水合警告）

**createTheme 关键 options**：

```ts
createTheme({
  // 主题色（必须是 theme.colors 的 key，不是 CSS 颜色值）
  primaryColor: 'violet',

  // 默认圆角（v9 默认 md，v8 之前默认 sm）
  defaultRadius: 'md',

  // 字体
  fontFamily: 'Inter, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, monospace',

  // 自定义颜色（必须 10 shade 数组，否则 TS 报错）
  colors: {
    brand: ['#f0f9ff', '#e0f2fe', ..., '#0c4a6e'],
  },

  // 间距 / 圆角 / 阴影 等可全局覆盖
  spacing: { xs: '0.5rem', sm: '0.75rem', md: '1rem', lg: '1.5rem', xl: '2rem' },

  // 组件级默认 props / styles
  components: {
    Button: Button.extend({ defaultProps: { variant: 'filled' } }),
  },
});
```

**defaultColorScheme 三种值**：
- 'light' / 'dark'：固定 mode
- 'auto'（推荐）：跟随系统 prefers-color-scheme

**为什么 MantineProvider 和 ColorSchemeScript 都要设 defaultColorScheme？**
- ColorSchemeScript：SSR 期间用（无 React state，inline script 读这个值）
- MantineProvider：客户端 React state 用
- 两者要一致，否则有 hydration 不匹配

实战：
- 80% 项目直接抄这段模板（改 primaryColor 就够了）
- 复杂主题在 createTheme 里逐项扩展
- ColorSchemeScript 永远要放 head（< 1KB 开销，但防闪烁价值极大）
-->

---
transition: fade-out
---

# Style Props 行内样式

m / p / bg / c / w / h 简写，主题感知 + 响应式

<v-click>

```tsx
import { Box, Button } from "@mantine/core";

<Box
  p="md"                                // padding: theme.spacing.md
  m={{ base: "xs", md: "lg" }}          // 响应式：base xs / md 起 lg
  bg="violet.6"                         // 主题色 violet.6
  c="white"                             // 文字色 white
  w={{ base: "100%", md: 600 }}         // 响应式宽度
  miw={200}                             // min-width
  display="flex"
  style={{ borderRadius: 8, gap: 16 }}  // style 兜底，避免 className 冲突
>
  <Button>提交</Button>
</Box>
```

</v-click>

<v-click>

> Style Props 仅对根元素生效，嵌套元素需用 Styles API（classNames / styles）

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Style Props 是 Mantine 的「轻量样式 API」—— 类似 MUI sx，但只覆盖常用属性 ——

支持的简写（精简版）：

- **间距**：m / mt / mb / ml / mr / mx / my / p / pt / pb / pl / pr / px / py
- **尺寸**：w / h / miw / maw / mih / mah
- **颜色**：bg（背景）/ c（文字）
- **字体**：fz（font-size）/ ff（font-family）/ fw（font-weight）/ lts（letter-spacing）/ ta（text-align）/ tt（text-transform）/ td（text-decoration）
- **布局**：display / flex / pos（position）/ top / left / right / bottom / inset

主题感知：
- `bg="violet.6"` → background: var(--mantine-color-violet-6)
- `p="md"` → padding: var(--mantine-spacing-md)
- `c="dimmed"` → color: var(--mantine-color-dimmed)

响应式断点（对象语法）：
- `w={{ base: 200, sm: 400, lg: 500 }}`
- base 是默认值
- sm / md / lg / xl 自动用对应 @media 断点
- 比 sx prop 更紧凑

负值：
- `mt="-md"` → 负 margin
- 适合「拉回」场景

**跟 MUI sx 的区别**：

| 维度       | Mantine Style Props        | MUI sx                  |
| ---------- | -------------------------- | ----------------------- |
| **范围**   | 根元素                     | 任意元素                |
| **嵌套**   | 不支持伪类 / 子选择器      | **支持**                |
| **类型**   | 受限简写                   | 完整 CSS 对象           |
| **性能**   | 静态 prop 直接转 className | 运行时计算              |

Mantine 设计哲学：Style Props 只用于「快速调整布局」，
嵌套样式 / 伪类 / 复杂选择器 → 用 Styles API（下页讲）。

[click] **注意 Style Props 不能改子元素**：

```tsx
// ❌ 不能改 Button 内部 label 的颜色
<Button c="red">提交</Button>  // c 只改根元素，label 元素不变

// ✅ 用 Styles API
<Button styles={{ label: { color: 'red' } }}>提交</Button>
```

这是新人最容易踩的坑 —— 以为 c="red" 能改文字颜色，实际只改根元素 color。
对 Button / TextInput 等复合组件，必须用 Styles API。
-->

---
transition: fade-out
---

# Styles API（一）：classNames + styles

向组件内部任意元素注入样式

<v-click>

```tsx
import { Button } from "@mantine/core";
import classes from "./Demo.module.css";

// 方式一：classNames（推荐 —— 性能好 / 支持伪类）
<Button
  classNames={{ root: classes.root, label: classes.label, section: classes.section }}
>
  提交
</Button>;

// 方式二：styles（不推荐 —— 内联样式优先级高，难覆盖）
<Button
  styles={{
    root: { background: "linear-gradient(45deg, #f06, #4a0)" },
    label: { fontWeight: 700 },
  }}
>
  渐变按钮
</Button>;
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Styles API 是 Mantine 的核心定制能力 —— 「向组件内部任意元素注入样式」 ——

每个 Mantine 组件都暴露一套「selector keys」（内部元素名）：

**Button 的 selector keys**：
- root：根元素（<button>）
- inner：内部容器
- label：按钮文字
- section：左右图标容器
- loader：加载动画

**TextInput 的 selector keys**：
- root / wrapper / input / label / description / error / required / section

**Modal 的 selector keys**：
- root / inner / overlay / content / header / title / close / body

工程师不需要查 selector keys —— TypeScript 会自动推导 + IDE 补全。

[click] **两种方式 classNames / styles**：

**classNames（推荐）**：
- 接受 className 字符串
- 通常配合 CSS Module 使用
- 支持伪类 / 子选择器 / 媒体查询
- 性能好（静态 CSS）
- 优先级正常（可被覆盖）

```tsx
// Demo.module.css
.root { padding: 16px; }
.root:hover { background: var(--mantine-color-violet-7); }
.label { font-weight: 600; }

// 使用
import classes from './Demo.module.css';
<Button classNames={{ root: classes.root, label: classes.label }} />
```

**styles（不推荐高频场景）**：
- 接受 CSSProperties 对象
- 内联样式（style 属性）
- 不支持伪类 / 媒体查询（要写额外逻辑）
- 优先级最高（难被外部覆盖）
- 适合「动态值」（依赖运行时 state）

```tsx
<Button styles={{ root: { background: dynamic ? 'red' : 'blue' } }} />
```

**条件样式（基于 props）**：

```tsx
classNames: (theme, props) => ({
  label: cx({ [classes.bold]: props.size === 'lg' }),
})
```

这种「函数式 classNames」让样式跟组件 state 联动。

实战策略：
- 90% 场景用 classNames + CSS Module
- 极少数动态场景用 styles
- 永远避免 className="my-class"（指根元素，覆盖 root 默认样式不完整）
-->

---
transition: fade-out
---

# Styles API（二）：vars + 全局 extend

CSS Variables 覆盖 + theme.components 集中管理

<v-click>

```tsx
import { createTheme, Button, MantineProvider } from "@mantine/core";

const theme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: { variant: "filled" },
      vars: (theme, props) => {
        if (props.size === "xxl")
          return { root: { "--button-height": "60px", "--button-fz": "24px" } };
        return { root: {} };
      },
    }),
  },
});

<MantineProvider theme={theme}>...</MantineProvider>;
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] vars 是 Styles API 第三件套 —— 「向组件注入 CSS Variables」 ——

工作原理：
- 每个 Mantine 组件内部用 CSS Variables 控制尺寸 / 颜色 / 间距
- vars prop 让外部覆盖这些变量
- 比改样式更精准（不破坏组件结构，只改值）

**Button 内部 CSS Variables 示例**：
```css
.root {
  height: var(--button-height, 36px);
  padding: 0 var(--button-padding-x, 16px);
  font-size: var(--button-fz, 14px);
  background: var(--button-bg);
  color: var(--button-color);
}
```

业务场景：
- 添加自定义尺寸（如 xxl）
- 改主色调相关变量
- 不想完全重写组件样式，只调几个关键值

**vars 函数签名**：
```ts
vars: (theme, props) => ({
  root: {
    '--button-height': '60px',
    '--button-bg': theme.colors.violet[6],
  },
})
```
- theme：当前主题对象
- props：当前组件 props
- 返回值：{ selectorKey: { cssVar: value } }

[click] **Component.extend 集中管理**：

```tsx
const theme = createTheme({
  components: {
    Button: Button.extend({
      // 1. 默认 props（所有 Button 默认 variant="filled"）
      defaultProps: { variant: 'filled', radius: 'md' },

      // 2. classNames 全局应用
      classNames: { root: 'my-global-button' },

      // 3. styles 全局应用
      styles: { label: { letterSpacing: '0.05em' } },

      // 4. vars 动态生成
      vars: (theme, props) => { ... },
    }),
  },
});
```

效果：所有 `<Button>` 自动应用 extend 的配置，无需每次单独写。

跟 Ant Design 主题的对比：
- AntD `theme.components.Button.colorPrimary` 改 token
- Mantine `Button.extend({ vars / defaultProps / classNames })` 更灵活

跟 MUI 主题对比：
- MUI `theme.components.MuiButton.styleOverrides` 写 CSS 对象
- Mantine 的写法更接近 React 组件 API，心智更轻

实战：
- 单次定制 → classNames + 组件级 vars
- 全局定制 → Component.extend
- 默认值 → defaultProps（避免每个使用点重复传）
-->

---
transition: fade-out
---

# 130+ 组件分组速览（一）

Inputs / Combobox / Buttons / Navigation / Feedback

<v-click>

| 分组               | 代表组件                                                          |
| ------------------ | ----------------------------------------------------------------- |
| **Inputs**         | TextInput / Textarea / Checkbox / Radio / Switch / Slider / Rating / NumberInput / PasswordInput / PinInput / ColorInput / FileInput |
| **Combobox**       | Autocomplete / Select / MultiSelect / TagsInput / TreeSelect / Combobox / PillsInput / Pill |
| **Buttons**        | Button / ActionIcon / CloseButton / CopyButton / FileButton / UnstyledButton |
| **Navigation**     | Anchor / Breadcrumbs / Burger / NavLink / Pagination / Stepper / Tabs / Tree / TableOfContents |
| **Feedback**       | Alert / Loader / Notification / Progress / RingProgress / Skeleton |

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Mantine 120+ 组件分组速览（第一批）——

**Inputs（输入，24 个）—— React 生态最完整**：
- 文字输入：TextInput / Textarea / PasswordInput
- 数字输入：NumberInput / PinInput
- 选择：Checkbox / Radio / Chip / Switch
- 滑块：Slider / RangeSlider / Rating
- 特殊：ColorInput / ColorPicker / FileInput / SegmentedControl
- 高级：JsonInput / MaskInput

特色组件（其他 UI 库少见）：
- **PinInput**：4-6 位数字验证码输入（自动跳格）
- **ColorPicker**：完整色彩选择器（HSL / RGBA / HEX）
- **JsonInput**：JSON 格式校验 + 高亮
- **MaskInput**：电话 / 信用卡 / 日期格式遮罩输入
- **AlphaSlider / HueSlider**：颜色调整滑块（颜色选择器的子组件，但可单用）
- **AngleSlider**：角度调整（0-360°）

**Combobox（组合框，8 个）—— 独家 Combobox 底层**：
- 高层封装：Autocomplete / Select / MultiSelect / TagsInput / TreeSelect
- 底层 Primitive：Combobox（useCombobox hook + 子组件）
- 视觉容器：Pill / PillsInput

Combobox 体系是 v7+ 的重大革新 ——
所有「下拉 + 搜索」组件共享 Combobox 底层，
50+ 示例（虚拟列表 / 远程搜索 / 树形 / 异步加载）让定制极致灵活。

**Buttons（按钮，6 个）**：
- Button：标准按钮，6 种 variant
- ActionIcon：图标按钮（无文字）
- CloseButton：关闭按钮（×）
- CopyButton：「复制到剪贴板」按钮（带反馈动画）
- FileButton：文件选择触发器
- UnstyledButton：无样式按钮（保留 a11y + ref）

**Navigation（导航，9 个）**：
- Anchor：带样式的 <a>
- Breadcrumbs / Pagination / Stepper：标准
- Burger：汉堡菜单图标（带动画）
- NavLink：导航菜单项（带 active 状态）
- Tabs / Tree：标签页 / 树形
- TableOfContents：目录导航（自动跟踪 scroll position）

**Feedback（反馈，7 个）**：
- Alert：页面级提示
- Loader / Skeleton：加载状态
- Notification：通知卡片（@mantine/notifications 用）
- Progress / RingProgress / SemiCircleProgress：进度展示
-->

---
transition: fade-out
---

# 130+ 组件分组速览（二）

Overlays / Data display / Typography / Layout / Misc

<v-click>

| 分组               | 代表组件                                                          |
| ------------------ | ----------------------------------------------------------------- |
| **Overlays**       | Modal / Drawer / Popover / Tooltip / HoverCard / Menu / Dialog / Affix / LoadingOverlay / Overlay |
| **Data display**   | Accordion / Avatar / Badge / Card / Image / Indicator / Kbd / Timeline / NumberFormatter / Spoiler |
| **Typography**     | Text / Title / Code / Highlight / Blockquote / List / Mark / Table / Typography |
| **Layout**         | AppShell / Container / Grid / SimpleGrid / Group / Stack / Flex / Center / AspectRatio / Space |
| **Miscellaneous**  | Box / Collapse / Divider / FocusTrap / Paper / Portal / ScrollArea / Transition / VisuallyHidden |

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Mantine 120+ 组件分组速览（第二批）——

**Overlays（浮层，10+ 个）—— 最丰富的浮层体系**：
- 弹层：Modal（中央）/ Drawer（侧边）/ Dialog（mini Modal）
- 浮窗：Popover / Tooltip / HoverCard / Menu
- 全屏：LoadingOverlay / Overlay（半透明蒙层）
- 定位：Affix（吸附浮层）/ FloatingIndicator / FloatingWindow（v9 新增可拖拽窗口）

特色：
- **Tooltip 嵌套**：HoverCard 是「悬浮卡片」（比 Tooltip 大、可放复杂内容）
- **Dialog**：迷你 Modal（无遮罩、不阻塞），适合「右下角浮窗」
- **FloatingWindow（v9）**：可拖拽 / 调整大小的浮动窗口

**Data display（数据展示，10+ 个）**：
- 容器：Card / Paper / Accordion
- 用户：Avatar / Badge / Indicator
- 媒体：Image / BackgroundImage
- 数字：NumberFormatter / RollingNumber
- 文本：Spoiler（折叠展开）/ Kbd（键盘按键样式）
- 时间：Timeline（垂直时间线）
- 工具：ColorSwatch（颜色样本）/ ThemeIcon（图标主题色）/ OverflowList（v9 溢出折叠）

**Typography（排版，9 个）**：
- 文字：Text（多行截断 + 渐变）/ Title（h1-h6）
- 代码：Code（行内 / 块级）
- 高亮：Highlight（关键词高亮）/ Mark（黄色背景）
- 引用：Blockquote / List
- 表格：Table（基础）
- 容器：Typography（限定子元素的字体样式）

**Layout（布局，10 个）—— 现代化布局体系**：
- 应用框架：**AppShell**（含 Header / Sidebar / Footer / Navbar 一体化）
- 容器：Container（居中 + max-width）
- 网格：Grid（12 栅格）/ SimpleGrid（简单网格）
- Flex：Group（横向）/ Stack（纵向）/ Flex（通用）/ Center
- 工具：AspectRatio / Space

特色：
- **AppShell** 是 Mantine 的「杀手锏」—— 一行代码搭建完整后台框架
  - 自动处理 header / sidebar / footer 的固定定位、阴影、响应式收起
  - 内置侧边栏折叠动画
  - 对标 Ant Design ProLayout 但更轻量

**Miscellaneous（杂项，9 个）**：
- 容器：Box（万能容器）/ Paper（卡片）
- 工具：Collapse（展开折叠）/ Divider / Portal / ScrollArea（自定义滚动条）
- A11y：FocusTrap / VisuallyHidden
- 动画：Transition / Marquee（v9 滚动跑马灯）

跟 Ant Design 70+ / MUI 60+ 比，Mantine 120+ 真的「无需找第三方组件」。
-->

---
transition: fade-out
---

# @mantine/form：useForm Hook

零依赖表单库，Controlled / Uncontrolled 双模式

<v-click>

```tsx
import { useForm } from "@mantine/form";
import { TextInput, PasswordInput, Button } from "@mantine/core";

interface Values { email: string; password: string }

export default function Demo() {
  const form = useForm<Values>({
    mode: "uncontrolled",            // 性能模式（默认推荐）
    initialValues: { email: "", password: "" },
    validate: {
      email: (v) => /^\S+@\S+$/.test(v) ? null : "邮箱格式不正确",
      password: (v) => v.length >= 6 ? null : "密码至少 6 位",
    },
  });
  return (
    <form onSubmit={form.onSubmit((v) => console.log(v))}>
      <TextInput label="邮箱" {...form.getInputProps("email")} />
      <PasswordInput label="密码" {...form.getInputProps("password")} />
      <Button type="submit">登录</Button>
    </form>
  );
}
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @mantine/form 是 Mantine 官方的表单库 —— 6.3KB 零依赖 ——

定位：跟 React Hook Form / Formik 同级，是 React 生态第三大表单方案。

核心 API：

**useForm 配置**：
- mode：'uncontrolled'（推荐，性能好）/ 'controlled'（响应式 watch 强）
- initialValues：初始值（类型推导从此处）
- validate：校验规则对象 或 Standard Schema（Zod / Valibot）
- validateInputOnChange：实时校验（默认 onBlur）
- enhanceGetInputProps：自定义 getInputProps 输出

**form 实例方法**：
- form.getInputProps(path)：返回 { value, onChange, error, onBlur, onFocus }
- form.onSubmit(onValid, onInvalid)：包装 form 的 onSubmit 事件
- form.values / form.errors / form.isDirty() / form.isTouched()
- form.setFieldValue / setFieldError / clearErrors / reset
- form.validate() / validateField()
- form.insertListItem / removeListItem / reorderListItem（动态列表）

**校验返回值**：
- string：错误信息
- null：通过
- Promise<string | null>：异步校验（v9 支持 AbortSignal）

**Uncontrolled vs Controlled**：

| 模式           | 写法                  | 性能 | 适用                  |
| -------------- | --------------------- | ---- | --------------------- |
| uncontrolled   | getInputProps         | **快** | 大多数场景（推荐）    |
| controlled     | getInputProps + watch | 慢   | 需要实时响应字段变化  |

uncontrolled 模式工作原理：
- 字段值存在 form 内部 ref 里（不触发 rerender）
- 只有 submit / validate / setFieldValue 时才读取
- 性能与 React Hook Form 接近（远优于 Formik）

跟其他方案对比：

| 方案             | bundle  | 性能 | API                  | 适合              |
| ---------------- | ------- | ---- | -------------------- | ----------------- |
| **@mantine/form** | 6.3KB | 快   | useForm + getInputProps | **Mantine 项目** |
| React Hook Form  | 9KB     | 快   | useForm + Controller | 任何 React 项目   |
| Formik           | 15KB    | 慢   | useFormik + Field    | 老项目维护        |

@mantine/form 优势：
- 跟 Mantine 组件无缝配合（getInputProps 直接 spread）
- 不需要 Controller 包装（不像 RHF + MUI）
- bundle 最小

@mantine/form 劣势：
- 仅适配 Mantine（其他组件库需手动适配）
- 生态不如 RHF（少 zodResolver / 第三方 hook 等）

实战：
- Mantine 全栈项目 → @mantine/form（首选）
- 多 UI 库混用 → RHF（更通用）
-->

---
transition: fade-out
---

# @mantine/form：Standard Schema 集成

Zod / Valibot / ArkType 通用校验（v9 新特性）

<v-click>

```tsx
import { useForm } from "@mantine/form";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(3, "至少 3 个字符"),
  email: z.string().email("邮箱格式不正确"),
  age: z.number().min(18, "年龄至少 18 岁"),
});

type Values = z.infer<typeof schema>;

const form = useForm<Values>({
  mode: "uncontrolled",
  initialValues: { username: "", email: "", age: 0 },
  validate: schema,             // 直接传 Schema，无需 resolver
});

<form onSubmit={form.onSubmit((v) => console.log(v))}>
  <TextInput {...form.getInputProps("username")} label="用户名" />
  <Button type="submit">提交</Button>
</form>;
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Standard Schema 是 2024 推出的「校验库统一标准」——

参与的校验库：
- Zod：TypeScript-first，最流行
- Valibot：轻量替代，bundle 小
- ArkType：基于 TS 语法的强类型
- Effect Schema：函数式 + 副作用处理

之前 RHF 需要 resolver 适配：
```tsx
// React Hook Form 写法
import { zodResolver } from '@hookform/resolvers/zod';
useForm({ resolver: zodResolver(schema) });
```

@mantine/form v9 直接传 schema：
```tsx
useForm({ validate: schema });  // 自动识别 Zod / Valibot / ArkType
```

工作原理：
- Mantine 检测 schema 是否实现 Standard Schema 接口
- 是 → 用 schema.~standard.validate() 校验
- 否 → 用旧的 validate 对象方式

类型推导：
- `z.infer<typeof schema>` 自动从 schema 推 Values 类型
- form.values / form.errors 类型完整
- form.getInputProps('username') TypeScript 知道是 string

异步 schema（Zod 4 + 异步 refine）：
```tsx
const schema = z.object({
  username: z.string().refine(async (v) => {
    const taken = await api.checkUsername(v);
    return !taken;
  }, '用户名已被占用'),
});
```

配合 v9 的 AbortSignal 支持：
```tsx
const form = useForm({
  validate: schema,
  validateInputOnChange: true,
});
// 每次 onChange 校验会自动 abort 上一次未完成的 async refine
```

实战策略：
- 新项目 → Zod 4 + Standard Schema（直接 validate: schema）
- 性能极致 → Valibot（bundle 比 Zod 小 80%）
- 强类型推导 → ArkType（TS-first 设计）
- 老项目 → 保留 validate 对象写法（仍兼容）

业务建议：
- API 边界统一用 Zod（前后端 schema 共享）
- 表单校验 schema 跟 API schema 同源
- 错误信息支持 i18n（schema 配合 t() 函数）

迁移 RHF + zodResolver → Mantine + Standard Schema：
- 几乎零成本（schema 共用）
- API 表面缩小（去掉 resolver）
- bundle 减少（不需要 @hookform/resolvers）
-->

---
transition: fade-out
---

# @mantine/notifications

集中式通知系统，6 个位置 + Queue 管理

<v-click>

```tsx
import { Notifications, notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

// 1. 应用入口
<MantineProvider>
  <Notifications position="top-right" limit={5} autoClose={4000} />
  <App />
</MantineProvider>;

// 2. 任意位置调用（不必在 React 组件内）
notifications.show({
  title: "保存成功",
  message: "数据已写入数据库",
  color: "green",
  autoClose: 3000,
});

// 3. 更新 / 隐藏 / 清空
const id = notifications.show({ message: "Loading...", loading: true, autoClose: false });
notifications.update({ id, message: "Done", loading: false, autoClose: 2000 });
notifications.hide(id);
notifications.clean();
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @mantine/notifications 是 Mantine 的通知系统 ——

跟 Ant Design notification / MUI Snackbar 同级，但 API 更现代化。

核心架构：

**Notifications 组件**：
- 放在 MantineProvider 内
- 提供「通知容器」（DOM portal 容器）
- 接受全局配置（position / limit / autoClose 等）

**notifications 对象**：
- 全局命令式 API
- show / update / hide / clean / cleanQueue 五个方法
- 可在任意位置调用（不必 React 组件内）—— 在 fetch 拦截器、Zustand action 里都能用

**6 个位置**：
- top-left / top-center / top-right
- bottom-left / bottom-center / bottom-right

**Queue 管理（限流）**：
- limit prop 控制同时显示数量（如 5）
- 超出的进队列等待
- 关闭一个 → 队列下一个自动显示
- 避免「100 个通知挤满屏幕」

**notifications.show 关键 props**：
- title：标题（粗体）
- message：内容（必填）
- color：'red' / 'green' / 'blue' 等（影响左边色条）
- icon：图标（ReactNode）
- loading：true 时显示 Loader（替代 icon）
- autoClose：毫秒数 或 false（不自动关闭）
- withCloseButton：false 隐藏关闭按钮
- onClose / onOpen：事件回调
- id：自定义 id（用于后续 update / hide）

**update 用法（异步操作反馈）**：
```tsx
const id = notifications.show({
  loading: true, title: '上传中', message: '请稍候',
  autoClose: false, withCloseButton: false,
});
await upload();
notifications.update({
  id, loading: false, title: '上传完成', message: '已保存',
  color: 'green', autoClose: 2000,
  icon: <CheckIcon />,
});
```

这是「异步任务反馈」的标准模式 ——
通知从「Loading」自动变成「Success / Error」，UX 流畅。

跟 Ant Design notification 对比：
- AntD：notification.open() / success() / error() / warning() / info() 多个方法
- Mantine：统一 notifications.show()，用 color 区分语义

跟 react-hot-toast 对比：
- Mantine：自带 Queue + Position 配置，更企业
- react-hot-toast：极简 API，更适合 C 端

实战：
- 操作反馈（成功 / 失败）：autoClose: 3000
- 异步任务：loading 状态 + update
- 重要错误：autoClose: false（用户必须手动关）
- 持久化提示：用 Alert 而非 notifications
-->

---
transition: fade-out
---

# @mantine/modals：弹窗管理器

命令式 API，避免手动管理 open 状态

<v-click>

```tsx
import { ModalsProvider, modals } from "@mantine/modals";

// 1. 入口
<MantineProvider>
  <ModalsProvider><App /></ModalsProvider>
</MantineProvider>;

// 2. 业务任意位置
const handleDelete = () =>
  modals.openConfirmModal({
    title: "确认删除？",
    children: <Text>此操作不可撤销，确认删除？</Text>,
    labels: { confirm: "删除", cancel: "取消" },
    confirmProps: { color: "red" },
    onConfirm: async () => {
      await api.deleteUser(id);
      notifications.show({ message: "已删除", color: "green" });
    },
  });
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @mantine/modals 是 Mantine 的「弹窗管理器」—— 命令式 API ——

定位：替代「手动管理 open / setOpen + JSX 弹窗」的模式。

核心架构：

**ModalsProvider 组件**：
- 放在 MantineProvider 内
- 提供「弹窗根容器」
- 接受默认 props / labels

**modals 对象**：
- 全局命令式 API
- 三种用法：
  - openConfirmModal：确认弹窗（标题 + 内容 + 确认 / 取消按钮）
  - open：自定义内容弹窗
  - openContextModal：预注册的「类型化」弹窗（推荐）

**openConfirmModal（最常用）**：
- title：标题
- children：内容（ReactNode）
- labels：{ confirm, cancel } 按钮文字
- confirmProps / cancelProps：按钮 props（如 color: 'red'）
- onConfirm / onCancel：回调
- closeOnConfirm：true 默认（点确认自动关）

**open（自定义内容）**：
```tsx
const id = modals.open({
  title: '编辑用户',
  children: <UserForm onClose={() => modals.close(id)} />,
  size: 'lg',
});
```
- 返回 id，可后续 modals.close(id)
- size：xs / sm / md / lg / xl / 自定义像素
- children：完整自定义内容

**openContextModal（类型化）**：

预先在 ModalsProvider 注册：
```tsx
const modals = {
  edit: EditUserModal,
  preview: PreviewModal,
};
<ModalsProvider modals={modals}>...</ModalsProvider>

// 业务调用
modals.openContextModal({
  modal: 'edit',
  title: '编辑用户',
  innerProps: { userId: 123 },  // 类型推导
});
```

TypeScript 优势：
- 通过 Module Augmentation 把 modals 注册类型化
- modal 字段是 keyof modals
- innerProps 自动推导对应弹窗的 props 类型

多层弹窗：
- 在一个弹窗内 modals.open() 打开另一个
- 自动 stack 层叠
- closeAll() 一键关闭所有

跟其他方案对比：

| 方案                     | 写法                       | 状态管理      | 类型 |
| ------------------------ | -------------------------- | ------------- | ---- |
| **@mantine/modals**      | 命令式                     | 库内部管理    | ★★★★ |
| 手动 useState + <Modal>  | 声明式                     | 业务管理      | ★★   |
| Ant Design Modal.confirm | 命令式（仅 confirm 模式）  | 库内部        | ★★   |

Mantine 优势：
- 不仅 confirm，complex modal 也能命令式调用
- 不需要在父组件维护 open state
- 业务逻辑（如 fetch error 后弹错误）写起来极简

实战：
- 简单确认 → openConfirmModal
- 表单 / 详情 → openContextModal（类型化）
- 一次性 / 复杂逻辑 → open
-->

---
transition: fade-out
---

# @mantine/spotlight：命令面板

Ctrl + K 全局搜索，Linear / GitHub 同款

<v-click>

```tsx
import { Spotlight, spotlight } from "@mantine/spotlight";
import "@mantine/spotlight/styles.css";

const actions = [
  { id: "home", label: "首页", description: "跳转到首页",
    onClick: () => navigate("/"), leftSection: <IconHome /> },
  { id: "settings", label: "设置", description: "应用偏好设置",
    onClick: () => navigate("/settings"), leftSection: <IconSettings /> },
  { id: "search-users", label: "搜索用户", description: "在用户列表中查找",
    onClick: () => navigate("/users"), keywords: ["user", "people", "成员"] },
];

<Spotlight
  actions={actions}
  shortcut={["mod + K", "mod + P"]}       // Ctrl/Cmd + K 或 P
  limit={7}
  searchProps={{ placeholder: "搜索..." }}
/>;

// 任意位置触发
<Button onClick={() => spotlight.open()}>打开命令面板</Button>;
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @mantine/spotlight 是 Mantine 的「命令面板」组件 ——

灵感来源：
- macOS Spotlight（Cmd + Space 搜索）
- Linear 命令面板（Ctrl + K 操作中心）
- VS Code Command Palette（Ctrl + Shift + P）
- GitHub 全局搜索（mod + K）

定位：现代 SaaS 产品的「键盘优先操作中心」。

核心 API：

**Spotlight 组件**：
- actions：操作列表
- shortcut：键盘快捷键（默认 'mod + K'）
- limit：显示数量（默认 7）
- searchProps：搜索框 props
- maxHeight：列表最大高度
- closeOnActionTrigger：点击 action 后自动关闭（默认 true）

**SpotlightActionData**：
- id：唯一 id
- label：显示文字
- description：描述（小字）
- onClick：点击回调
- leftSection / rightSection：左右图标 / 标签
- keywords：搜索关键词数组（不显示但参与匹配）

**shortcut 配置**：
- 'mod + K'：Cmd + K（Mac）或 Ctrl + K（Win/Linux）
- 'shift + alt + K'：组合修饰键
- 数组：多个快捷键（任一触发）
- null：禁用键盘触发

**spotlight 对象**：
- spotlight.open() / close() / toggle()
- 任意位置可调（包括非 React 组件）

**性能优化**：
- limit 限制渲染数量
- 即使 actions 是 10000 条，只渲染 7 个
- 搜索时自动过滤 + 排序

**fuzzy search（模糊搜索）**：
- 默认按 label 字符串匹配
- 配合 fuse.js 可实现「打错字仍能搜到」
- filter prop 可完全自定义匹配逻辑

**Action 分组**：
```tsx
const actions = [
  { group: '导航', actions: [...] },
  { group: '操作', actions: [...] },
];
```
分组后 Spotlight 自动加分组标题。

业务场景：
- 全局搜索（页面 / 用户 / 文档）
- 快速操作（创建任务 / 打开设置）
- 键盘高效用户必备（特别是 dev tools 类产品）

跟其他方案对比：
- cmdk（shadcn 系）：底层 Primitive，需自己样式
- kbar：定制度极高但 API 复杂
- @mantine/spotlight：开箱即用，跟 Mantine 视觉一致

实战：
- 中后台必备（特别是数据多的系统）
- 配合路由（actions 动态生成）
- 配合搜索 API（async search）
- 移动端可隐藏（mobile breakpoint）
-->

---
transition: fade-out
---

# Combobox 体系：useCombobox

下拉 / 搜索 / 多选 / 树形 统一底层 + 50+ 示例

<v-click>

```tsx
import { Combobox, useCombobox, TextInput } from "@mantine/core";

const options = ["Apple", "Banana", "Cherry", "Date"];
const [search, setSearch] = useState("");
const combobox = useCombobox({ onDropdownClose: () => combobox.resetSelectedOption() });
const filtered = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()));

<Combobox store={combobox} onOptionSubmit={(v) => { setSearch(v); combobox.closeDropdown(); }}>
  <Combobox.Target>
    <TextInput value={search}
      onChange={(e) => { setSearch(e.target.value); combobox.openDropdown(); }} />
  </Combobox.Target>
  <Combobox.Dropdown>
    <Combobox.Options>
      {filtered.map((o) => <Combobox.Option value={o} key={o}>{o}</Combobox.Option>)}
    </Combobox.Options>
  </Combobox.Dropdown>
</Combobox>;
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Combobox 是 v7+ 推出的「下拉组件底层」—— Mantine 的明星功能 ——

设计动机：
- v6 之前：Select / MultiSelect / Autocomplete 各自实现，代码重复 + 定制困难
- v7+：抽出 Combobox + useCombobox 作为统一底层，所有 Select 类组件基于此

架构层级：

```
useCombobox()                        // 底层 hook（状态管理）
    ↓
<Combobox>                           // 容器组件（不带样式）
  <Combobox.Target>                  // 触发器（用户的 input / button）
  <Combobox.Dropdown>                // 下拉容器
    <Combobox.Search>                // 搜索框（可选）
    <Combobox.Options>               // 选项列表
      <Combobox.Option>              // 单个选项
      <Combobox.Group>               // 分组标题
      <Combobox.Empty>               // 空状态
```

**useCombobox 返回 store**：
- store.openDropdown() / closeDropdown() / toggleDropdown()
- store.selectFirstOption() / selectNextOption() / selectActiveOption()
- store.resetSelectedOption() / focusTarget() / focusSearchInput()
- store.dropdownOpened：当前状态

**事件回调**：
- onDropdownOpen / onDropdownClose
- onOptionSubmit（用户选中）

**50+ 示例覆盖场景**：
- 基础：单选 / 多选 / 搜索
- 高级：远程搜索 / 树形 / 标签输入 / 异步加载
- 性能：虚拟列表（10000+ 选项）
- 自定义：选项渲染 / 分组 / 颜色 / 图标
- 集成：useForm / @hookform 集成

**何时直接用 Combobox（而非高层封装）**：

| 场景                       | 推荐                  |
| -------------------------- | --------------------- |
| 简单单选                   | Select                |
| 简单多选                   | MultiSelect           |
| 简单自动补全               | Autocomplete          |
| 标签输入                   | TagsInput             |
| 树形选择                   | TreeSelect            |
| **以上都不够灵活**         | **Combobox（底层）**  |

业务场景示例：
- 「用户搜索 + 实时显示用户卡片（头像 + 姓名 + 角色）」
- Select 不够灵活（option 是字符串）→ Combobox + 自定义 Option 渲染

跟其他方案对比：
- @mantine/core Combobox：状态 + 子组件，需自己组装样式
- shadcn/ui Combobox：基于 cmdk + Radix，类似思路
- React Select：受控 + 完整封装，灵活度低

实战：
- 90% 场景用 Select / MultiSelect 等高层
- 10% 极致定制场景下沉到 Combobox
- 跟 useForm 配合：getInputProps 适配
-->

---
transition: fade-out
---

# DataTable / Table 方案

Mantine 不内置高级表格，社区方案完善

<v-click>

```bash
pnpm add mantine-datatable
```

```tsx
import { DataTable } from "mantine-datatable";

interface User { id: number; name: string; age: number; status: "on" | "off" }

const records: User[] = [{ id: 1, name: "Alice", age: 28, status: "on" }];

<DataTable<User>
  records={records}
  columns={[
    { accessor: "id", title: "ID", width: 80 },
    { accessor: "name", sortable: true },
    { accessor: "age", sortable: true, textAlign: "right" },
    { accessor: "status",
      render: (r) => <Badge color={r.status === "on" ? "green" : "gray"}>{r.status}</Badge> },
  ]}
  withTableBorder highlightOnHover
  totalRecords={100} recordsPerPage={20}
  page={page} onPageChange={setPage}
/>;
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Mantine 没有「内置高级表格」组件 —— 这是 Mantine vs MUI 的最大短板 ——

@mantine/core 只有 Table 组件（基础 <table> 封装），相当于 HTML table：
- 支持斑马纹 / hover 高亮 / 边框
- 不支持排序 / 筛选 / 分页 / 虚拟滚动 / 编辑

企业级表格需求需要第三方方案：

**mantine-datatable（社区主流，最推荐）**：
- 完全为 Mantine 设计，视觉一致
- 支持：排序 / 筛选 / 分页 / 行选择 / 展开行 / 拖拽行 / 服务端分页
- API 直觉，TypeScript 友好
- bundle ~50KB
- 维护活跃（GitHub 1K+ star）

**TanStack Table（React Table v8）**：
- Headless 表格（仅逻辑，无样式）
- 跟 Mantine 配合：用 Mantine Table 渲染 TanStack 提供的列 / 行
- 极致灵活（虚拟滚动 / 列分组 / 透视等）
- 学习曲线陡

**AG Grid（商业）**：
- 企业级表格事实标准
- 跟 Mantine 视觉不一致（需要自己样式覆盖）
- 大数据 / 复杂业务（10 万+ 行）必选

**mantine-datatable 核心 API**：

**columns 配置**：
- accessor：字段名（支持嵌套 'user.name'）
- title：列头
- sortable：可排序
- render：自定义渲染
- width / textAlign / hidden / draggable

**分页**：
- totalRecords / recordsPerPage / page / onPageChange
- 服务端：自己改 page 时重新 fetch

**排序**：
- sortStatus / onSortStatusChange
- 服务端：sortStatus.columnAccessor + direction 传给 API

**行选择**：
- selectedRecords / onSelectedRecordsChange
- 类似 Ant Design rowSelection 但 API 更简洁

**展开行**：
- rowExpansion={{ content: (record) => <Detail data={record} /> }}

**虚拟滚动（v6+）**：
- `withRowBorders` + 大数据 → 自动启用

跟 Ant Design Table 对比：
- AntD Table：内置 @ ant-design 包内，70+ props
- mantine-datatable：第三方包，类似功能但 prop 命名更直觉
- 性能相当，视觉风格不同

实战：
- 简单表格（< 1000 行）→ mantine-datatable
- 复杂场景 + 跟其他 UI 库混用 → TanStack Table + Mantine 渲染
- 超大数据 / 商业需求 → AG Grid（但视觉一致性差）

提醒：选 mantine-datatable 前确认 GitHub 仍活跃 + 版本兼容当前 Mantine 主版本。
-->

---
transition: fade-out
---

# @mantine/dates：日期组件

DatePickerInput / DateTimePicker / Calendar，dayjs 集成

<v-click>

```tsx
import { DatePickerInput, DatesProvider } from "@mantine/dates";
import "@mantine/dates/styles.css";
import "dayjs/locale/zh-cn";

<DatesProvider settings={{ locale: "zh-cn", firstDayOfWeek: 1 }}>
  <DatePickerInput value={date} onChange={setDate} valueFormat="YYYY-MM-DD" />
</DatesProvider>;
```

| 组件             | 用途                     |
| ---------------- | ------------------------ |
| DatePickerInput  | 日期输入（按钮触发面板） |
| DateInput        | 直接键盘输入             |
| DateTimePicker   | 日期 + 时间              |
| Calendar         | 完整日历（受控展示）     |

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @mantine/dates 是 Mantine 的日期组件包 —— 基于 dayjs ——

跟 Ant Design DatePicker / MUI Date Pickers 同级，特点：

**dayjs 绑定**：
- 跟 Ant Design v5 一样默认 dayjs
- 但与 @mui/x-date-pickers 不同 —— Mantine **不支持切换** date library
- 文档原文：「dayjs is a required dependency – you cannot change it to another date library」
- 优势：API 简单，无需配 adapter
- 劣势：项目用 date-fns / luxon 的需要额外处理

**DatesProvider 全局配置**：
- locale：语言（必须配合 import 'dayjs/locale/xxx'）
- firstDayOfWeek：周开始日（0-6，1 = 周一）
- weekendDays：周末日（[0, 6] = 周六周日）
- consistentWeeks：每月都显示 6 周（高度一致）

**v9 的 string 格式（破坏性变化）**：
- v8 之前：value 是 Date 对象
- v9：value 是 'YYYY-MM-DD' 字符串
- 原因：避免时区混乱，统一序列化
- 迁移：所有 value / onChange 都要适配字符串

```tsx
// v8 写法（已废弃）
const [date, setDate] = useState<Date | null>(null);
<DatePickerInput value={date} onChange={setDate} />

// v9 写法
const [date, setDate] = useState<string | null>(null);
<DatePickerInput value={date} onChange={setDate} />
```

**完整组件清单**：

| 组件名               | 形态                       | 适用场景               |
| -------------------- | -------------------------- | ---------------------- |
| **DatePickerInput**  | input + 弹出面板           | 通用（最常用）         |
| **DateInput**        | input 直接键盘输入         | 高效场景（无面板触发） |
| **DateTimePicker**   | 日期 + 时间                | 预约 / 时间戳          |
| **MonthPickerInput** | 月份选择                   | 财务报表月份选择       |
| **YearPickerInput**  | 年份选择                   | 年度数据筛选           |
| **TimeInput**        | 时间输入                   | HH:mm 格式             |
| **Calendar**         | 完整日历（受控）           | 嵌入式日历             |
| **DatePicker**       | 嵌入日历（小写组件）       | 自定义触发器场景       |

**Range 选择**：
- type="range"
- value 变成 [start, end] 元组
- 适合「预订日期」「报表区间」

**i18n 同步**：
```tsx
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
<DatesProvider settings={{ locale: 'zh-cn' }}>
```

跟 Ant Design 类似 —— 必须 dayjs.locale + DatesProvider locale 都设，否则月份名仍是英文。

**Next.js App Router 注意**：
- DatesProvider 要在 'use client' 组件内
- locale import 也要 use client

跟 @mui/x-date-pickers 对比：
- @mantine/dates：dayjs 绑定，API 简单
- @mui/x-date-pickers：多 adapter（dayjs / date-fns / luxon），更灵活
- 选 Mantine 的代价：date library 锁定 dayjs

实战：
- 业务系统 → DatePickerInput（最通用）
- 高频录入 → DateInput（键盘快）
- 时间戳 → DateTimePicker
- 财务月份 → MonthPickerInput
-->

---
transition: fade-out
---

# @mantine/charts：图表组件

基于 Recharts 3，LineChart / BarChart / DonutChart 等

<v-click>

```bash
pnpm add @mantine/charts recharts
```

```tsx
import { LineChart, DonutChart } from "@mantine/charts";
import "@mantine/charts/styles.css";

const data = [
  { date: "Mar 22", Apples: 2890, Oranges: 2338 },
  { date: "Mar 23", Apples: 2756, Oranges: 2103 },
];

<LineChart h={300} data={data} dataKey="date"
  series={[
    { name: "Apples", color: "indigo.6" },
    { name: "Oranges", color: "violet.6" },
  ]}
  curveType="natural" withDots={false} />;

<DonutChart data={[
  { name: "USA", value: 400, color: "indigo.6" },
  { name: "Brazil", value: 300, color: "yellow.6" },
]} />;
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @mantine/charts 是 Mantine 的图表组件包 —— 基于 Recharts 3 ——

设计：
- 不是从零造轮子，而是 Recharts 封装层
- Recharts 是 React 生态最流行的图表库（基于 D3）
- Mantine 封装：主题色集成 + 暗色适配 + Mantine 视觉风格

**组件清单**：

| 组件               | 用途              |
| ------------------ | ----------------- |
| **LineChart**      | 折线图            |
| **BarChart**       | 柱状图            |
| **AreaChart**      | 面积图            |
| **PieChart**       | 饼图              |
| **DonutChart**     | 环形图（中空饼图）|
| **RadarChart**     | 雷达图            |
| **Sparkline**      | 迷你折线（无坐标轴）|
| **Heatmap**        | 热力图            |
| **Treemap**        | 矩形树图          |
| **CompositeChart** | 组合图（柱 + 线） |
| **FunnelChart**    | 漏斗图            |
| **SankeyChart**    | 桑基图            |
| **BubbleChart**    | 气泡图            |
| **ScatterChart**   | 散点图            |

**核心 props（通用）**：
- h：高度（必填，单位 px）
- data：数据数组
- dataKey：x 轴字段名
- series：序列配置（每个 = 一条线 / 一组柱）
- withTooltip / withLegend / withGridLines

**Mantine 主题色集成**：
- color: "indigo.6" → var(--mantine-color-indigo-6)
- 自动跟随 colorScheme 切换暗色
- 不需要手动写 fill / stroke

**跟 @mui/x-charts 对比**：

| 维度       | @mantine/charts        | @mui/x-charts        |
| ---------- | ---------------------- | -------------------- |
| **底层**   | Recharts               | 自研 + d3            |
| **图表数** | 14 类                  | 8 类                 |
| **主题**   | Mantine 自动            | MUI 自动             |
| **学习**   | 浅（Recharts 文档）    | 深（独立 API）       |
| **兼容**   | 跟 Recharts 生态共享    | MUI 专属             |

**Recharts vs ECharts**：
- Recharts：React-friendly，组件化 API，适合常规需求
- ECharts：功能更强（大屏 / 网络图 / 3D），但 React 集成需 wrapper
- @mantine/charts 适合「常规企业数据展示」，大屏 / 复杂图 → ECharts

业务场景：
- Dashboard 数据展示：LineChart / BarChart / DonutChart
- 财务报表：CompositeChart（柱 + 线）
- 业务漏斗：FunnelChart
- 用户分布：Heatmap / Treemap

实战：
- 简单 → 直接用 @mantine/charts
- 复杂自定义 → 直接用 Recharts（Mantine 视觉手动覆盖）
- 极致复杂（大屏 / 3D） → ECharts
-->

---
transition: fade-out
---

# @mantine/tiptap：富文本编辑器

基于 Tiptap 3（ProseMirror），完整 RTE 方案

<v-click>

```bash
pnpm add @mantine/tiptap @tiptap/react @tiptap/starter-kit
```

```tsx
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "@mantine/tiptap/styles.css";

const editor = useEditor({ extensions: [StarterKit, Link], content: "<p>Hello!</p>" });

<RichTextEditor editor={editor}>
  <RichTextEditor.Toolbar sticky>
    <RichTextEditor.ControlsGroup>
      <RichTextEditor.Bold />
      <RichTextEditor.Italic />
      <RichTextEditor.H1 />
      <RichTextEditor.H2 />
      <RichTextEditor.Link />
    </RichTextEditor.ControlsGroup>
  </RichTextEditor.Toolbar>
  <RichTextEditor.Content />
</RichTextEditor>;
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @mantine/tiptap 是 Mantine 的富文本编辑器封装 —— 基于 Tiptap 3 ——

定位：跟 quill / draft.js / slate.js 同级，但更现代。

为什么选 Tiptap？

Tiptap 是 ProseMirror 的「React 友好层」：
- ProseMirror：底层富文本引擎（Notion / Slack / Linear 都在用）
- Tiptap：React API + 扩展生态
- 跟 Quill / Draft.js 比：更稳定、更强大、更现代

@mantine/tiptap 提供：
- Toolbar 组件（带 Mantine 视觉风格）
- 50+ 工具栏按钮（Bold / Italic / H1-H6 / Link / Image / Table 等）
- 跟 Mantine 主题 / 暗色无缝集成

**架构层级**：

```
@tiptap/react             // Tiptap 本体 + React API
    ↓
@tiptap/starter-kit       // 标准扩展集（Bold / Italic / List 等）
    ↓
@tiptap/extension-link    // 单独扩展（链接 / 图片 / 表格等）
    ↓
@mantine/tiptap           // Mantine 视觉封装层
```

**RichTextEditor 子组件**：

工具栏控件（部分）：
- 文本格式：Bold / Italic / Underline / Strikethrough / Code
- 标题：H1 / H2 / H3 / H4 / H5 / H6
- 列表：BulletList / OrderedList / TaskList
- 块级：Blockquote / CodeBlock / HorizontalRule
- 链接：Link / Unlink
- 媒体：Image（需 @tiptap/extension-image）
- 表格：Table（需 @tiptap/extension-table）
- 对齐：AlignLeft / AlignCenter / AlignRight / AlignJustify
- 其他：Subscript / Superscript / Highlight / Color

**完整工具栏写法**：

```tsx
<RichTextEditor.Toolbar sticky stickyOffset={60}>
  <RichTextEditor.ControlsGroup>
    <RichTextEditor.Bold /><RichTextEditor.Italic />
  </RichTextEditor.ControlsGroup>
  <RichTextEditor.ControlsGroup>
    <RichTextEditor.H1 /><RichTextEditor.H2 />
  </RichTextEditor.ControlsGroup>
  <RichTextEditor.ControlsGroup>
    <RichTextEditor.BulletList /><RichTextEditor.OrderedList />
  </RichTextEditor.ControlsGroup>
  <RichTextEditor.ControlsGroup>
    <RichTextEditor.Link /><RichTextEditor.Unlink />
  </RichTextEditor.ControlsGroup>
</RichTextEditor.Toolbar>
```

**获取内容**：

```tsx
const html = editor?.getHTML();        // HTML 字符串
const json = editor?.getJSON();        // JSON 结构
const text = editor?.getText();        // 纯文本
```

**设置内容**：

```tsx
editor?.commands.setContent('<p>新内容</p>');
editor?.commands.focus();
```

**协同编辑**：
- Tiptap 提供 @tiptap/extension-collaboration
- 配合 Y.js + WebSocket 实现 Google Docs 级实时协作

**v9 要求 Tiptap 3+**：
- v8 用 Tiptap 2，v9 升 Tiptap 3
- 迁移：扩展包名变化（@tiptap/extension-* 部分重命名）

跟 Quill / Draft 对比：
- Quill：老牌但维护停滞，API 不灵活
- Draft.js：Facebook 出品但 2022 停更
- Tiptap：现代主流，活跃维护

实战：
- 评论 / 简单编辑 → 直接 @mantine/tiptap + StarterKit
- 完整富文本（图片 / 表格） → 加 @tiptap/extension-image / table
- 协同编辑 → 引入 Y.js + Collaboration extension
- 复杂场景（如代码块语法高亮）→ @tiptap/extension-code-block-lowlight
-->

---
transition: fade-out
---

# 70+ Hooks 速览（一）

state / utility / clipboard / storage

<v-click>

| Hook                | 用途                            |
| ------------------- | ------------------------------- |
| `useDisclosure`     | 切换布尔状态（Modal 标配）      |
| `useToggle`         | 多值循环切换                    |
| `useDebouncedValue` | 防抖值（搜索标配）              |
| `useLocalStorage`   | 同步 localStorage（自动 JSON）  |
| `useClipboard`      | 剪贴板（copied 状态反馈）       |
| `useHotkeys`        | 全局快捷键                      |
| `useIdle`           | 用户空闲检测                    |

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @mantine/hooks 是 Mantine 的独家王牌 —— 70+ 实用 Hooks ——

定位：React 生态最完整的 Hooks 库，类似 react-use 但质量更高、维护更稳。

**重点 Hooks（最常用，第一批）**：

**useDisclosure** —— 控制 Modal / Drawer / Popover 标配：
```tsx
const [opened, { open, close, toggle }] = useDisclosure(false);
<Button onClick={open}>打开</Button>
<Modal opened={opened} onClose={close} />
```
返回布尔 + 三个 setter，比 useState + 手写 toggle 简洁。

**useToggle** —— 多值循环切换：
```tsx
const [scheme, toggle] = useToggle(['light', 'dark', 'auto'] as const);
<Button onClick={() => toggle()}>切换：{scheme}</Button>
```

**useCounter** —— 计数器（带 min/max 约束）：
```tsx
const [count, handlers] = useCounter(0, { min: 0, max: 10 });
handlers.increment(); handlers.decrement(); handlers.reset();
```

**useDebouncedValue** —— 防抖（搜索框标配）：
```tsx
const [query, setQuery] = useState('');
const [debounced] = useDebouncedValue(query, 500);
useEffect(() => { api.search(debounced); }, [debounced]);
```
比 lodash.debounce 集成更顺，自动清理。

**useThrottledValue** —— 节流（高频事件）：
```tsx
const [scrollY, setScrollY] = useState(0);
const [throttled] = useThrottledValue(scrollY, 100);
```

**useLocalStorage** —— localStorage 同步 + JSON 序列化：
```tsx
const [theme, setTheme] = useLocalStorage({ key: 'theme', defaultValue: 'light' });
```
SSR 友好（服务端用 defaultValue），自动 JSON.stringify/parse。

**useClipboard** —— 剪贴板（copied 状态反馈）：
```tsx
const clipboard = useClipboard({ timeout: 2000 });
<Button onClick={() => clipboard.copy('hello')}>
  {clipboard.copied ? '已复制' : '复制'}
</Button>
```
内置 2 秒自动恢复 `copied: false`，UX 流畅。

**useHotkeys** —— 全局快捷键：
```tsx
useHotkeys([
  ['mod+K', () => spotlight.open()],
  ['mod+S', (e) => { e.preventDefault(); save(); }],
  ['mod+shift+D', () => toggleDarkMode()],
]);
```
mod = Cmd（Mac）/ Ctrl（Win）自动适配。

**useIdle** —— 用户空闲检测：
```tsx
const idle = useIdle(5 * 60 * 1000);  // 5 分钟无操作
useEffect(() => { if (idle) { logout(); } }, [idle]);
```
适合「自动登出 / 暂停视频」场景。

**useNetwork** —— 网络状态：
```tsx
const { online, downlink, effectiveType } = useNetwork();
{!online && <Banner>网络已断开</Banner>}
```
PWA / 离线优化必备。
-->

---
transition: fade-out
---

# 70+ Hooks 速览（二）

DOM / animation / list / responsive

<v-click>

| Hook                | 用途                              |
| ------------------- | --------------------------------- |
| `useClickOutside`   | 点击外部触发（Popover 标配）      |
| `useHover`          | 鼠标悬停状态                      |
| `useElementSize`    | 元素尺寸跟踪（ResizeObserver）    |
| `useIntersection`   | 进入视口（懒加载 / 无限滚动）     |
| `useMediaQuery`     | 媒体查询（响应式逻辑）            |
| `useListState`      | 列表 CRUD（add/remove/reorder）   |
| `useFullscreen`     | 全屏切换                          |

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] @mantine/hooks 第二批 —— DOM / 列表 / 响应式 ——

**useClickOutside** —— 点击外部触发：
```tsx
const ref = useClickOutside(() => close());
<div ref={ref}>...</div>
```
Popover / Dropdown / Tooltip 等浮层标配，避免每次手动写 mousedown 监听。

**useHover** —— 鼠标悬停：
```tsx
const { hovered, ref } = useHover();
<Card ref={ref}>{hovered && <PreviewModal />}</Card>
```

**useElementSize** —— 元素尺寸（ResizeObserver）：
```tsx
const { ref, width, height } = useElementSize();
<div ref={ref}>{width}x{height}</div>
```
比 useRef + getBoundingClientRect 更现代，自动跟踪 resize。

**useIntersection** —— 进入视口：
```tsx
const { ref, entry } = useIntersection({ rootMargin: '0px', threshold: 0.5 });
{entry?.isIntersecting && <LazyImage src={img} />}
```
懒加载图片 / 无限滚动 / 动画触发标配。

**useMediaQuery** —— 媒体查询：
```tsx
const isMobile = useMediaQuery('(max-width: 768px)');
return isMobile ? <MobileView /> : <DesktopView />;
```

**useViewportSize** —— 窗口尺寸：
```tsx
const { width, height } = useViewportSize();
```

**useScrollIntoView** —— 滚动到元素：
```tsx
const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>();
<Button onClick={() => scrollIntoView({ alignment: 'center' })}>滚到此处</Button>
<div ref={targetRef}>目标</div>
```

**useListState** —— 列表 CRUD（业务热门）：
```tsx
const [list, handlers] = useListState<Todo>([]);
handlers.append({ id: 1, text: 'Todo 1' });
handlers.remove(0);
handlers.reorder({ from: 0, to: 2 });
handlers.setItem(0, { id: 1, text: 'Updated' });
handlers.filter((t) => t.done);
```
避免每个列表项都写 `setList((prev) => prev.filter(...))`。

**useSetState** —— 对象状态合并：
```tsx
const [state, setState] = useSetState({ name: '', age: 0 });
setState({ name: 'Alice' });   // 仅合并 name，age 保留
```
等价于 `setState((prev) => ({ ...prev, name: 'Alice' }))` 但更紧凑。

**useFullscreen** —— 全屏：
```tsx
const { ref, toggle, fullscreen } = useFullscreen();
<video ref={ref} />
<Button onClick={toggle}>{fullscreen ? '退出全屏' : '全屏'}</Button>
```

**完整 Hooks 列表（重点提示）**：

UI/DOM（20+）：useClickOutside / useCollapse / useDrag / useElementSize / useEventListener / useFileDialog / useFloatingWindow / useFocusReturn / useFocusTrap / useFocusWithin / useFullscreen / useHotkeys / useHover / useInViewport / useIntersection / useLongPress / useMask / useMediaQuery / useMouse / useMove / useMutationObserver / useOrientation / useRadialMove / useReducedMotion / useResizeObserver / useRovingIndex / useScrollIntoView / useScrollSpy / useScroller / useViewportSize / useWindowEvent / useWindowScroll

状态管理（20+）：useCounter / useDebouncedCallback / useDebouncedState / useDebouncedValue / useDisclosure / useId / useInputState / useListState / useLocalStorage / useMap / usePagination / usePrevious / useQueue / useSelection / useSet / useSetState / useStateHistory / useThrottledCallback / useThrottledState / useThrottledValue / useToggle / useUncontrolled / useValidatedState

工具类（17）：useClipboard / useDocumentTitle / useDocumentVisibility / useEyeDropper / useFavicon / useFetch / useHash / useHeadroom / useIdle / useInterval / useMergedRef / useNetwork / useOs / usePageLeave / useScrollDirection / useTextSelection / useTimeout

生命周期（7）：useDidUpdate / useForceUpdate / useIsFirstRender / useIsomorphicEffect / useLogger / useMounted / useShallowEffect

每个 Hook 文档独立页 + Storybook 示例，是 React 学习「自定义 hook」的最好教材。
-->

---
transition: fade-out
---

# Next.js App Router 集成

mantineHtmlProps + ColorSchemeScript + 'use client'

<v-click>

```tsx
// app/layout.tsx（无需 'use client'）
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" {...mantineHtmlProps}>
      <head><ColorSchemeScript defaultColorScheme="auto" /></head>
      <body>
        <MantineProvider defaultColorScheme="auto">{children}</MantineProvider>
      </body>
    </html>
  );
}

// next.config.ts —— 按需导入优化
export default {
  experimental: { optimizePackageImports: ["@mantine/core", "@mantine/hooks"] },
};
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Next.js App Router + Mantine 是「现代 React 全栈」的常见组合 ——

为什么 Mantine + Next.js 比 Ant Design / MUI 更顺？

**核心优势**：
- 纯 CSS：SSR 直接 link CSS 文件，无 hydration 闪烁
- 不需要 AntdRegistry / AppRouterCacheProvider 等额外包
- `MantineProvider` 本身已经 `'use client'` 自动包装

**setup 步骤**：

1. **layout.tsx**（RSC 兼容）：
   - `<html {...mantineHtmlProps}>` 加 suppressHydrationWarning
   - `<head>` 内插 `<ColorSchemeScript defaultColorScheme="auto" />`
   - `<MantineProvider>` 包 body
   - 无需 'use client'（MantineProvider 内部已经 use client）

2. **PostCSS 配置**：
   - 项目根 postcss.config.cjs
   - postcss-preset-mantine + postcss-simple-vars

3. **样式 import**：
   - @mantine/core/styles.css 必须 import
   - 按需加 @mantine/dates/styles.css 等

**复合组件的 'use client' 限制**：

```tsx
// ❌ RSC 不识别 Popover.Target
<Popover>
  <Popover.Target>...</Popover.Target>
  <Popover.Dropdown>...</Popover.Dropdown>
</Popover>

// ✅ 用平级组件
import { PopoverTarget, PopoverDropdown } from '@mantine/core';
<Popover>
  <PopoverTarget>...</PopoverTarget>
  <PopoverDropdown>...</PopoverDropdown>
</Popover>

// 或者标记 'use client'
'use client';
<Popover>
  <Popover.Target>...</Popover.Target>
</Popover>
```

[click] **optimizePackageImports 优化（关键）**：

Next.js 15+ 内置的「按需导入」优化：
- 自动转换 `import { Button } from '@mantine/core'` 为深路径
- 减少 bundle 大小约 30-50%
- 加速 dev server 启动

```ts
// next.config.ts
export default {
  experimental: {
    optimizePackageImports: [
      '@mantine/core',
      '@mantine/hooks',
      '@mantine/dates',
      '@mantine/notifications',
      '@mantine/charts',
    ],
  },
};
```

不开这个 → @mantine/core 整包打入 bundle（300+KB gzipped）
开了 → 仅打入用到的组件（通常 80-150KB）

**vs Ant Design / MUI**：
- AntD：需要 @ant-design/nextjs-registry
- MUI：需要 @mui/material-nextjs/v15-appRouter + AppRouterCacheProvider
- Mantine：原生 CSS，无 SSR 闪烁，无需 registry

**dynamic import 处理（避开 'use client'）**：

```tsx
// 服务端组件中无法直接渲染 Mantine 组件，用 dynamic import
import dynamic from 'next/dynamic';
const Modal = dynamic(() => import('./MyModal'), { ssr: false });
```

但实际项目通常整个 page 标 'use client'，简单粗暴。

**配置 turbopack（v15+）**：
- Next.js 15 turbopack 完全支持 Mantine
- 不需要额外配置
-->

---
transition: fade-out
---

# light-dark() + CSS Variables

CSS 原生暗色模式，无 React 重渲染

<v-click>

```css
/* business.module.css */
.card {
  /* light-dark() —— PostCSS 编译期生成 light/dark 两套 */
  background: light-dark(var(--mantine-color-white), var(--mantine-color-dark-7));
  color: light-dark(var(--mantine-color-black), var(--mantine-color-white));
  border: 1px solid light-dark(#e0e0e0, #424242);
  padding: var(--mantine-spacing-md);
  border-radius: var(--mantine-radius-md);
  font-size: var(--mantine-font-size-sm);
}

.card:hover {
  background: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6));
}
```

</v-click>

<v-click>

```tsx
import { useMantineColorScheme, Switch } from "@mantine/core";

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return <Switch checked={colorScheme === "dark"} onChange={() => toggleColorScheme()} />;
}
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] light-dark() 是 CSS 原生函数（CSS Color Module 5），Mantine 通过 PostCSS 预设支持 ——

工作原理：

PostCSS 编译期把：
```css
.card { background: light-dark(white, black); }
```

转换为：
```css
.card { background: white; }
[data-mantine-color-scheme="dark"] .card { background: black; }
```

切换 colorScheme = 改 <html> 的 data-mantine-color-scheme 属性 → 浏览器原生重绘，0 React 重渲染。

**对比 MUI applyStyles**：
- MUI：JS 层调用 theme.applyStyles('dark', { ... })
- Mantine：CSS 层用 light-dark() 函数
- 两者底层都是「生成两套选择器」，但 Mantine 更接近 CSS 原生

**配合 Mantine CSS Variables**：

完整变量列表（部分）：
- 颜色：--mantine-color-{name}-{0-9} / --mantine-color-text / --mantine-color-body
- 字体：--mantine-font-family / --mantine-font-size-{xs-xl}
- 间距：--mantine-spacing-{xs-xl}
- 圆角：--mantine-radius-{xs-xl}
- 阴影：--mantine-shadow-{xs-xl}
- 标题：--mantine-h1-font-size / --mantine-h1-line-height
- z-index：--mantine-z-index-app / -modal / -popover

业务自定义样式直接消费这些变量，免去手动跟随主题逻辑。

[click] **useMantineColorScheme Hook**：

```tsx
const { 
  colorScheme,        // 'light' / 'dark' / 'auto'
  setColorScheme,     // 设置 mode
  toggleColorScheme,  // light <-> dark 切换
  clearColorScheme,   // 重置为 defaultColorScheme
} = useMantineColorScheme();
```

切换持久化：
- Mantine 自动写入 localStorage（key: 'mantine-color-scheme'）
- 刷新页面保持
- 配合 ColorSchemeScript 防 SSR 闪烁

**虚拟颜色 virtualColor()（v8+）**：

```tsx
const theme = createTheme({
  colors: {
    primary: virtualColor({
      name: 'primary',
      dark: 'pink',       // 暗色模式用 pink
      light: 'indigo',    // 亮色模式用 indigo
    }),
  },
  primaryColor: 'primary',
});
```

效果：primary 在 light 下是 indigo，dark 下是 pink，自动切换。

适合「品牌色在两种模式下不同」场景（如纸白 light + 翡翠绿 dark）。

跟 Ant Design / MUI 的对比：
- AntD：theme.algorithm = darkAlgorithm，切换重建 theme
- MUI：colorSchemes + applyStyles，性能好
- Mantine：light-dark() CSS 原生，性能最好

实战：
- 业务样式 → 直接用 light-dark() + CSS Variables
- 组件级覆盖 → Component.extend + classNames + light-dark()
- 业务逻辑判断 mode → useMantineColorScheme().colorScheme
- 切换 mode → 全局 toggleColorScheme（持久化 + 防闪烁）
-->

---
transition: fade-out
---

# Polymorphic：多态组件

component prop + renderRoot，一组件多形态

<v-click>

```tsx
import { Button } from "@mantine/core";
import Link from "next/link";
import { NavLink as RouterNavLink } from "react-router-dom";

// 1. component prop —— 改根元素为 <a>
<Button component="a" href="https://mantine.dev/" target="_blank">访问 Mantine</Button>;

// 2. component prop —— 改为 Next.js Link
<Button component={Link} href="/dashboard">前往后台</Button>;

// 3. renderRoot —— 自定义渲染（适合泛型 / className 函数）
<Button renderRoot={(props) => (
  <RouterNavLink to="/users"
    className={({ isActive }) => `${props.className} ${isActive ? "active" : ""}`}
    {...props} />
)}>
  用户列表
</Button>;
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Polymorphic（多态）是「一组件渲染为不同元素」的能力 ——

跟 Ant Design / MUI 的对比：
- AntD：Button 内嵌 Link（`<Link to="/x"><Button /></Link>`）
- MUI：Button component prop（跟 Mantine 一致）
- Mantine：component prop + renderRoot 两种

**为什么需要多态？**

业务场景：
- Button 视觉但语义是「链接」（<a> + href）
- Card 视觉但要点击全卡片跳转
- ActionIcon 视觉但要扔到 form 表单（type="submit"）

如果不多态：
- 在 Button 外面包 <a> → 嵌套结构混乱，a11y 错误
- 改用 <a> 但失去 Mantine 样式 → 还要手动加 className

多态解决：
- `<Button component="a" href="..." />` → 渲染 <a> 但保留 Button 样式

**两种 API**：

**1. component prop（简单场景）**：

```tsx
// 渲染为 a 标签
<Button component="a" href="/">链接按钮</Button>

// 渲染为自定义组件
<Button component={Link} href="/" prefetch>Next.js Link</Button>

// component prop 自动透传所有 React 节点上下文
```

类型推导：
- TS 知道 component="a" 时 props 是 AnchorHTMLAttributes
- href / target / rel 等自动可用
- 拼错 `hreff` 会报错

**2. renderRoot prop（高级场景）**：

```tsx
<Button
  renderRoot={(props) => <CustomComponent {...props} />}
>
  Custom
</Button>
```

什么时候用 renderRoot？

场景 A：泛型组件（如 React Router NavLink）
```tsx
// NavLink className 是函数：(props) => string
<NavLink className={({ isActive }) => isActive ? 'active' : ''} />

// component={NavLink} 无法传 className 函数（类型冲突）
// renderRoot 解决
<Button renderRoot={(props) => (
  <NavLink to="/x" className={({ isActive }) => `${props.className} ${isActive ? 'active' : ''}`} {...props} />
)} />
```

场景 B：完全自定义渲染逻辑
```tsx
<Button renderRoot={(props) => {
  return <CustomLink {...props} extraProp="value" />;
}} />
```

**Mantine 自创的 polymorphic 工具**：

```tsx
import { polymorphicFactory } from '@mantine/core';

interface MyComponentProps { color?: string; }

const MyComponent = polymorphicFactory<MyComponentProps>(({ color, ...props }, ref) => (
  <Box {...props} ref={ref} c={color} />
));

// 使用
<MyComponent component="a" href="/">链接</MyComponent>
<MyComponent component={Link} to="/">Router Link</MyComponent>
```

这让业务也能定义「多态组件」。

实战策略：
- 99% 场景：component prop（最简单）
- React Router NavLink 类型冲突：renderRoot
- 自定义 polymorphic 组件：polymorphicFactory

**a11y 注意**：
- component="a" 自动添加 role 等 ARIA 属性
- 跟 type="submit" 的 button 区分（不能 component="a" 同时 type="submit"）
-->

---
transition: fade-out
---

# 常见踩坑（一）：CSS 顺序

@mantine/core 必须最先 import

<v-click>

**症状**：业务自定义 className 在生产环境不生效，但开发环境正常

</v-click>

<v-click>

**原因**：`@mantine/core/styles.css` 被业务 CSS 之后导入 → 覆盖业务样式

</v-click>

<v-click>

**解法**：严格控制 CSS 导入顺序（先核心 → 再扩展 → 最后业务）

```tsx
// ✅ 正确顺序
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/tiptap/styles.css";
import "./global.css";        // 业务全局样式最后
```

</v-click>

<v-click>

> 💡 **提示**：Next.js App Router 在 layout.tsx 顶部统一 import，
> Vite 在 main.tsx 顶部 import，避免散落到组件级 import。

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Mantine v7+ 用户的「头号坑」—— CSS 顺序错误 ——

业务现象：
- 开发环境：自定义 className 生效（背景红色）
- 生产构建：自定义 className 失效（被 Mantine 默认样式覆盖）
- 同样代码、同样配置 → 「神秘 bug」

[click] **根本原因**：

Mantine v7+ 是「纯 CSS + PostCSS」方案：
- @mantine/core/styles.css 是普通 CSS 文件
- 业务自定义样式也是 CSS 文件
- 浏览器 CSS 优先级规则：**后加载的覆盖先加载的**（相同 specificity 时）

如果业务 CSS 在 @mantine/core 之前 import：
- 开发环境：Vite/Webpack 模块 graph 中顺序通常正确
- 生产构建：bundler 把所有 CSS 合并，顺序可能错乱
- 结果：Mantine 默认样式覆盖业务样式

[click] **解法：严格控制 CSS 导入顺序**

正确顺序（自顶向下）：
1. @mantine/core/styles.css（必须最先）
2. @mantine/dates / notifications / charts / tiptap 等扩展包样式
3. 业务全局样式（global.css）
4. 业务组件级样式（CSS Modules，自动 scoped 无顺序问题）

**Next.js App Router 推荐**：
```tsx
// app/layout.tsx 顶部
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
// ... 其他扩展
import './globals.css';
```

**Vite 推荐**：
```tsx
// main.tsx 顶部
import '@mantine/core/styles.css';
import './index.css';

ReactDOM.createRoot(...).render(...);
```

**避免散落 import**：
- ❌ 在某个组件文件里 `import '@mantine/charts/styles.css'`
- ✅ 在入口文件统一 import

为什么？组件级 import 在 production 时被 bundler 提到顶部，但跟其他 CSS 的相对顺序不可控。

[click] **进阶：CSS Layers**（v8+ 推荐）

Mantine v8+ 把样式放在 `@layer mantine`，业务样式放在更高 layer 自动覆盖：

```css
/* global.css */
@layer mantine, components, app;

@layer components {
  .my-button { background: red; }
}

@layer app {
  /* 最高优先级 */
}
```

效果：layer 顺序决定优先级，无需关心 import 顺序。

但需要 Mantine v8+ + 业务全栈用 @layer 才能完整工作。

**生产环境调试**：
- 打开 DevTools → 看实际生效的 CSS 规则
- 如果 Mantine 规则在业务之后 → 导入顺序错
- 如果 specificity 不够 → 用更精确的 selector 或 CSS Layer
-->

---
transition: fade-out
---

# 常见踩坑（二）：PostCSS 必须配

没配 PostCSS 主题 CSS 变量不生成

<v-click>

**症状**：Mantine 组件视觉错乱 / 暗色模式不切换 / `light-dark()` 函数报错

</v-click>

<v-click>

**原因**：PostCSS 没装 `postcss-preset-mantine`，CSS 没经过 Mantine 编译

</v-click>

<v-click>

**解法**：项目根目录创建 `postcss.config.cjs`

```js
module.exports = {
  plugins: {
    "postcss-preset-mantine": {},
    "postcss-simple-vars": {
      variables: {
        "mantine-breakpoint-xs": "36em",
        "mantine-breakpoint-sm": "48em",
        "mantine-breakpoint-md": "62em",
        "mantine-breakpoint-lg": "75em",
        "mantine-breakpoint-xl": "88em",
      },
    },
  },
};
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] PostCSS 配置缺失是新人最常见的环境问题 ——

业务现象（多种）：
- Mantine 组件视觉错乱（圆角 / 颜色 / 阴影都不对）
- 暗色模式切换无效（data-mantine-color-scheme 改了但样式不变）
- 自定义 CSS 用 `light-dark()` 函数报错（unknown function）
- 响应式 `@media (max-width: $mantine-breakpoint-md)` 不识别变量

[click] **根本原因**：

Mantine v7+ 的 CSS 用了几个非标准特性，需要 PostCSS 预处理：

1. **light-dark() 函数**（CSS Color Module 5，浏览器原生支持但需要预处理生成兼容版本）
2. **CSS rem 函数**（Mantine 内部用 rem(16) 写法，等价于 `1rem`，但需要预处理）
3. **postcss-simple-vars 变量**（响应式断点 `$mantine-breakpoint-md`）
4. **嵌套选择器**（CSS Nesting 标准化前，需要 PostCSS）
5. **Mixins**（@mixin light / @mixin dark 等）

没有 PostCSS 预设 = 这些特性不工作 = 样式失效。

[click] **完整 setup**：

**1. 安装依赖**：
```bash
pnpm add -D postcss postcss-preset-mantine postcss-simple-vars
```

**2. 项目根创建 postcss.config.cjs**（注意 .cjs 后缀，不是 .js）：
```js
module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
};
```

**3. 为什么 .cjs？**
- 项目可能是 ESM（package.json type: "module"）
- postcss-preset-mantine 是 CommonJS
- 用 .cjs 保证可加载（不被 ESM 解析）

**为什么需要 simple-vars 配断点？**
- Mantine 内部用 `$mantine-breakpoint-md` 语法
- 业务 CSS 也可以用：`@media (max-width: $mantine-breakpoint-md) { ... }`
- 改这些值 = 改全站响应式断点

**Next.js 项目**：
- Next.js 内置 PostCSS，自动识别 postcss.config.cjs
- 不需要额外 Next.js 配置

**Vite 项目**：
- Vite 内置 PostCSS，自动识别 postcss.config.cjs
- 不需要 vite.config.ts 改动

**Webpack 项目**：
- 需要 postcss-loader：
```js
{ test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] }
```

**验证 PostCSS 工作**：
- 浏览器 DevTools 看 :root 的 CSS Variables 是否生成
- 看 .card { background: light-dark(...) } 是否被替换为两套规则
- 没工作 = PostCSS 没生效，检查 .cjs 文件位置 + 依赖安装

**Migration from Mantine v6（Emotion）**：
- v6 不需要 PostCSS
- v6 → v7 必加 PostCSS 配置
- 这是 v7 重构的「成本」
-->

---
transition: fade-out
---

# 常见踩坑（三）：复合组件 + RSC

Popover.Target 在 Next.js App Router 不工作

<v-click>

**症状**：Next.js App Router server component 中 `<Popover.Target>` 报错 / 渲染异常

</v-click>

<v-click>

**原因**：复合组件（点语法）在 React Server Components 序列化不识别

</v-click>

<v-click>

**两种解法**

```tsx
// 方案 1：用平级组件（推荐）
import { Popover, PopoverTarget, PopoverDropdown } from "@mantine/core";

<Popover>
  <PopoverTarget><Button>触发</Button></PopoverTarget>
  <PopoverDropdown>内容</PopoverDropdown>
</Popover>;

// 方案 2：标记 'use client'
"use client";
import { Popover } from "@mantine/core";

<Popover>
  <Popover.Target>...</Popover.Target>
</Popover>;
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 Next.js App Router 用户的常见坑 —— 跟 Ant Design 的 Select.Option 同类问题 ——

业务现象：
- Next.js App Router 项目，default 是 server component
- 写 `<Popover><Popover.Target>...</Popover.Target></Popover>`
- 编译报错 或 运行时报错（"Cannot read properties of undefined"）

[click] **根本原因**：

React Server Components（RSC）的序列化限制：
- RSC 把组件树序列化为 JSON 发到客户端
- 序列化能识别：基本类型 / React 元素 / 客户端组件
- 序列化不能识别：函数 / 类实例 / 点语法子组件

`Popover.Target` 这种写法本质：
```js
const Popover = forwardRef(...)
Popover.Target = forwardRef(...)  // 静态属性
```

在 RSC 序列化时，「Popover.Target」无法转换为客户端可识别的引用。

[click] **解法 1：用平级组件（推荐）**

Mantine v8+ 把所有点语法组件同时导出为平级：
- `Popover.Target` ↔ `PopoverTarget`
- `Popover.Dropdown` ↔ `PopoverDropdown`
- `Combobox.Target` ↔ `ComboboxTarget`
- `Combobox.Dropdown` ↔ `ComboboxDropdown`
- `Combobox.Option` ↔ `ComboboxOption`
- `Modal.Header` ↔ `ModalHeader`
- 等等

写法：
```tsx
// ❌ 点语法（RSC 序列化失败）
<Popover>
  <Popover.Target>...</Popover.Target>
  <Popover.Dropdown>...</Popover.Dropdown>
</Popover>

// ✅ 平级（RSC 兼容）
<Popover>
  <PopoverTarget>...</PopoverTarget>
  <PopoverDropdown>...</PopoverDropdown>
</Popover>
```

**解法 2：标记 'use client'**

```tsx
'use client';
// 整个文件成为客户端组件
// 点语法可以正常工作

<Popover>
  <Popover.Target>...</Popover.Target>
</Popover>
```

代价：
- 整个文件转为客户端组件
- 失去 RSC 的 zero-bundle 优势
- 但 90% 业务 page 都是客户端组件，所以代价小

**实战策略**：

| 场景                          | 推荐                     |
| ----------------------------- | ------------------------ |
| 业务 page（常规）             | 'use client'             |
| 共享组件 / 列表项             | 平级组件（保持 RSC 兼容）|
| 营销页 / SEO 强需求           | 平级组件 + 服务端渲染    |
| Layout / 头部 / 侧边栏        | 'use client'             |

跟 Ant Design 的对比：
- AntD `<Select.Option>` → 用 `options` prop（完全不用点语法）
- Mantine 提供平级组件作为替代，更友好

**v8+ 平级组件列表**（部分）：
- AccordionControl / AccordionItem / AccordionPanel
- CardSection
- ComboboxTarget / ComboboxDropdown / ComboboxOption / ComboboxGroup
- DialogBody
- DrawerHeader / DrawerBody / DrawerContent
- MenuItem / MenuLabel / MenuDivider / MenuTarget / MenuDropdown
- ModalContent / ModalHeader / ModalBody / ModalTitle / ModalCloseButton
- PopoverTarget / PopoverDropdown
- StepperStep / StepperCompleted
- TabsList / TabsTab / TabsPanel
- TimelineItem

新项目建议：直接用平级组件，未来 RSC 普及后无需迁移。
-->

---
transition: fade-out
---

# 常见踩坑（四）：v8 → v9 dates 字符串

DatePickerInput value 从 Date 改为 string

<v-click>

**症状**：v9 升级后 DatePickerInput / Calendar 等报 TS 错误：`Type 'Date' is not assignable to type 'string'`

</v-click>

<v-click>

**原因**：v9 把所有日期组件的 value / onChange 从 Date 对象改为 `YYYY-MM-DD` 字符串

</v-click>

<v-click>

**迁移**

```tsx
// ❌ v8 写法
const [date, setDate] = useState<Date | null>(null);
<DatePickerInput value={date} onChange={setDate} />;

// ✅ v9 写法
const [date, setDate] = useState<string | null>(null);
<DatePickerInput value={date} onChange={setDate} valueFormat="YYYY-MM-DD" />;

// Date 对象转字符串
import dayjs from "dayjs";
const dateStr = dayjs(myDate).format("YYYY-MM-DD");

// 字符串转 Date
const dateObj = dayjs(dateStr).toDate();
```

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] v8 → v9 最显眼的 break change —— dates 系列改用字符串 ——

业务现象：
- 升级 @mantine/dates 到 v9
- 全项目 DatePicker 相关代码报 TS 错误
- 「Type 'Date' is not assignable to type 'string'」 to「Type 'string' is not assignable to type 'Date'」

[click] **变更原因**：

v8 之前 value 是 Date 对象，问题：
- **时区混乱**：Date 对象在不同时区显示不同（同一时刻北京 / 纽约不同）
- **序列化复杂**：Date 转 JSON 是 ISO 字符串，反序列化丢失类型
- **数据库类型不匹配**：后端通常存 string（YYYY-MM-DD），前后端转换繁琐

v9 改为字符串：
- **时区无关**：'2026-05-20' 就是「这一天」，跨时区一致
- **序列化简单**：JSON.stringify 直接得字符串
- **前后端一致**：数据库 / API / 前端 state 都用同一字符串

**format 约定**：
- 日期：`'YYYY-MM-DD'`（如 '2026-05-20'）
- 日期时间：`'YYYY-MM-DD HH:mm:ss'`（如 '2026-05-20 14:30:00'）
- 时间：`'HH:mm:ss'`

[click] **迁移步骤**：

**1. State 类型改字符串**：
```tsx
// ❌ v8
const [date, setDate] = useState<Date | null>(null);

// ✅ v9
const [date, setDate] = useState<string | null>(null);
```

**2. valueFormat 显式指定**（避免 default 变化引起的格式不同）：
```tsx
<DatePickerInput value={date} onChange={setDate} valueFormat="YYYY-MM-DD" />
```

**3. Date ↔ string 互转**（业务边界）：

业务里仍有 Date 对象的场景：
```tsx
import dayjs from 'dayjs';

// Date → string（写入 Mantine）
const dateStr = dayjs(jsDate).format('YYYY-MM-DD');

// string → Date（读取 Mantine 用于 JS 计算）
const jsDate = dayjs(dateStr).toDate();

// string → 显示格式
const display = dayjs(dateStr).format('YYYY年MM月DD日');
```

**4. Range 选择**：
```tsx
// v8: [Date | null, Date | null]
// v9: [string | null, string | null]
const [range, setRange] = useState<[string | null, string | null]>([null, null]);
<DatePickerInput type="range" value={range} onChange={setRange} />
```

**5. useForm 集成**：
```tsx
const form = useForm({
  initialValues: {
    date: null as string | null,
    range: [null, null] as [string | null, string | null],
  },
});
<DatePickerInput {...form.getInputProps('date')} />
```

**与后端 API 集成**：

API 通常返回字符串日期：
- 后端 → 前端：直接用，无需 new Date()
- 前端 → 后端：直接传，无需 .toISOString()

**好处**：API 类型简化 + 减少时区 bug。

**v9 兼容工具**：

如果业务要保留 Date 对象（已有大量代码用 Date）：
```tsx
// 包装 hook
function useStringDate(initial?: Date | null) {
  const [date, setDate] = useState<string | null>(
    initial ? dayjs(initial).format('YYYY-MM-DD') : null
  );
  return [date, setDate] as const;
}
```

迁移工作量：
- 中型项目（30+ 日期组件）：1-2 天
- 大型项目（100+）：1 周（含完整测试回归）

**没有 codemod 工具**：Mantine 官方暂未提供自动迁移，但 TS 错误会精确指出每个位置。
-->

---
transition: fade-out
---

# 评价

完整生态 / 性能优秀 / 现代化，但中文资料弱

<v-clicks>

**优点**

- 120+ 组件 + 70+ Hooks 双轨制，React 生态最完整
- 纯 CSS + PostCSS 无运行时开销，bundle 比 MUI/AntD 小 30%
- Styles API 三件套（classNames/styles/vars）深度定制
- Next.js App Router 原生友好（无需 registry）
- light-dark() 主题切换 0 重渲染，文档「业界第一档」

**缺点**

- 没有内置高级表格（需要 mantine-datatable 第三方）
- v6→v7 / v8→v9 都有 break change，迁移成本高
- 中文资料少（不及 Ant Design 1/10）
- dates 库锁定 dayjs，社区主导（企业商业支持弱）

</v-clicks>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Mantine 的优点集中在「现代化 + 完整生态」——

**130+ 组件 + 70+ Hooks 双轨制**：
- 组件覆盖率 React 生态最高
- Hooks 库是独家卖点（MUI / AntD 都没有等价物）
- 单一依赖搞定 95% 场景

**性能优秀**：
- 纯 CSS + PostCSS：无 CSS-in-JS 运行时
- bundle 比 MUI（~400KB）/ AntD（~400KB）小 30%
- SSR 友好：CSS 是静态资源，无 hydration 复杂度
- light-dark() 切换 0 React 重渲染

**Styles API 三件套**：
- classNames：性能好 + 支持伪类（推荐）
- styles：内联动态值
- vars：CSS Variables 覆盖
- 比 MUI sx 更可控（精确到 selector key）
- 比 AntD token 更灵活（任意元素可改）

**@mantine/form + Standard Schema**：
- 内置表单库，与 Mantine 组件无缝
- v9 直接传 Zod schema 校验
- AbortSignal 处理异步竞态

**Next.js App Router 原生友好**：
- 纯 CSS 无 SSR 闪烁
- 不需要 Registry 包（vs MUI AppRouterCacheProvider / AntdRegistry）
- optimizePackageImports 优化按需导入

**主题切换 0 重渲染**：
- light-dark() CSS 函数
- 浏览器原生切换，性能最好
- 比 MUI applyStyles / AntD algorithm 更接近 CSS 原生

**文档第一档 + AI 友好**：
- 每个组件 5+ 示例 + Storybook 嵌入
- Combobox 50+ 示例
- LLM 文档（mantine.dev/llms.txt）
- Claude Code Skill / MCP 服务器（Cursor 上下文准确）

[click] **缺点也很明确**：

**没有内置高级表格** —— Mantine 的最大短板：
- @mantine/core 只有基础 Table（HTML table 封装）
- 排序 / 筛选 / 虚拟滚动 → 用 mantine-datatable（社区第三方）
- 复杂场景 → TanStack Table + Mantine 自己渲染
- 商业级 → AG Grid（视觉一致性差）

**break change 多** —— 迁移成本：
- v6 → v7：抛弃 Emotion，所有自定义样式重写
- v7 → v8：Combobox 体系重构
- v8 → v9：dates 字符串化 + React 19.2 要求

每次主版本都需要 1-2 周迁移工作（中型项目）。

**中文资料少** —— 不到 Ant Design 1/10：
- 中文教程稀少
- StackOverflow 中文问题少
- 国内大厂没人用（外企 / 出海团队居多）
- 解决方案：依赖官方英文文档（质量极高）+ AI 辅助

**dayjs 锁定**：
- @mantine/dates 强制 dayjs，不支持 date-fns / luxon
- 项目已用其他库需要双引入
- 跟 @mui/x-date-pickers（adapter 切换）相比少灵活性

**社区主导**：
- 主创 Vitaly Rtishchev 个人项目（早期）
- 现在有团队但仍非公司化
- 比 MUI 公司 / 蚂蚁集团商业支持弱
- 优势：社区驱动迭代快，无商业绑架
- 劣势：企业采购 / SLA / 商业支持有限

选型逻辑：
- 全栈现代化 + 性能敏感 → Mantine（默认）
- 中国 B 端 + 中文资料多 → Ant Design
- 全球 + Material 风 → MUI
- 重度定制 → Mantine + Tailwind 或 Radix UI
-->

---
transition: fade-out
---

# 学习路径

从入门到企业级实战的 4 个阶段

<v-click>

**第 1 周：核心组件熟练**

- 通读官方文档 Inputs + Combobox + Feedback 三大分组
- 写一个 CRUD 页面（mantine-datatable + Modal + Form 三件套）

</v-click>

<v-click>

**第 2 周：主题 + Styles API 精进**

- 跑通 createTheme + Component.extend + light-dark() 切换
- 封装 5+ 业务组件（基于 Box / Group / Stack 拼装）

</v-click>

<v-click>

**第 3-4 周：企业级整合**

- 引入 @mantine/form + Zod + Standard Schema
- 接入 Next.js App Router + @mantine/notifications/modals/spotlight

</v-click>

<v-click>

**长期：Hooks + 多态组件** —— 70+ Hooks 学透成为「React 高级开发」，多态组件设计自定义系统

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 第一周打基础 ——

官方文档按「Inputs → Combobox → Feedback」顺序读最高效：
- Inputs：TextInput / Checkbox / Switch / Slider 等基础输入
- Combobox：Select / MultiSelect / Autocomplete / TagsInput 50+ 场景
- Feedback：Alert / Loader / Skeleton / Notification

每个组件页面都有 5+ 示例 + Storybook 嵌入，改例子比看文档快。

完成一个 CRUD 页面就算入门：
- mantine-datatable 表格 + 服务端分页
- Modal 编辑表单
- @mantine/form 校验
- @mantine/notifications 反馈

[click] 第二周进阶 ——

Mantine 主题系统是「软实力」分水岭：
- createTheme：primaryColor / colors / spacing / radius 等
- Component.extend：defaultProps / classNames / styles / vars
- light-dark() + CSS Variables：原生切换
- virtualColor：双模式不同色

封装基础组件：
- 在 design-system 文件夹下封装 PrimaryButton / SectionTitle / Card
- 用 Box / Group / Stack 作底层
- 用 Styles API + CSS Module 定制
- 配合 Mantine props（component / variant 等）

[click] 第三到四周企业级整合 ——

单独的 @mantine/core 只是「组件库」，企业项目需要：

- 路由：React Router 7 / Next.js App Router / TanStack Router
- 状态：Zustand / Jotai / Redux Toolkit / TanStack Query
- 表单：@mantine/form + Standard Schema（Zod 4）
- 表格：mantine-datatable 或 TanStack Table
- 反馈：@mantine/notifications / modals
- 命令面板：@mantine/spotlight（中后台强需求）
- 日期：@mantine/dates + dayjs
- 图表：@mantine/charts 或 ECharts
- 富文本：@mantine/tiptap

「Mantine + Next.js App Router + Zod + Zustand + TanStack Query」是 2025 年 React 现代化全栈主流组合。

[click] 长期投入 ——

**70+ Hooks 学透**：
- 不只是用，要看源码学「自定义 Hook 设计」
- useDisclosure / useListState / useLocalStorage 是教科书级别的 Hook 设计
- 学会后能自己设计业务 Hook（比如 useUserPermission / useTableState）

**多态组件设计**：
- polymorphicFactory 工具
- TypeScript 泛型 + ref 转发
- 设计「视觉一致 + 语义不同」的组件系统

**源码学习**：
- @mantine/core/Combobox：状态机设计典范
- @mantine/core/Modal：a11y + Portal + FocusTrap 综合
- @mantine/hooks：每个 Hook 都是「React 设计模式」教材

**生态扩展**：
- mantine-datatable / mantine-contextmenu / mantine-list 等社区扩展
- @mantine/colors-generator：从单色生成 10 shade
- 关注 GitHub discussions（新特性 / 投票）
-->

---
transition: fade-out
---

# 延伸学习资源

官方 + 社区精选

<v-click>

**官方资源**

- 📖 [官方文档](https://mantine.dev/) —— 英文质量第一档（每组件 5+ 示例）
- 💻 [GitHub](https://github.com/mantinedev/mantine) —— 30K+ star
- 🎨 [Templates](https://mantine.dev/getting-started/) —— Next.js / Vite 官方模板
- 🤖 [LLM 文档](https://mantine.dev/llms.txt) —— Cursor / Claude AI 友好

</v-click>

<v-click>

**社区扩展** —— [mantine-datatable](https://icflorescu.github.io/mantine-datatable/)（表格）/ [mantine-contextmenu](https://icflorescu.github.io/mantine-contextmenu/)（右键菜单）

</v-click>

<v-click>

**配套技术栈**

- Next.js App Router + Zustand + Vite + Zod = 现代全栈
- TanStack Query + dayjs + mantine-datatable = 实用三件套

</v-click>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 官方资源是第一手信息 ——

**官方文档（mantine.dev）**：
- 英文质量「业界第一档」：每组件 5+ 示例 + API 表 + props 类型
- Combobox 文档独家：50+ 示例覆盖所有场景
- 每个 Hook 单独页 + Storybook 嵌入
- Migration Guide 详细（v6→v7 / v7→v8 / v8→v9 都有专门指南）

**GitHub**：
- 30K+ star
- issue 区活跃
- discussions 有产品路线图投票
- 源码可读性极高（TypeScript + 注释 + 清晰目录结构）

**官方模板**：
- Next.js 模板（包含 Jest / Storybook / ESLint 预配置）
- Vite 模板（开箱即用）
- 适合「快速起步新项目」

**LLM 友好**：
- mantine.dev/llms.txt：精简版文档（适合 LLM 上下文）
- Cursor / Claude Code 用 Mantine 时上下文准确性最高
- 官方提供 MCP 服务器（Claude Code 集成）
- AI Agent Skills 集成

[click] **社区扩展**：

**mantine-datatable**：
- 最重要的社区扩展（弥补 Mantine 无内置表格的短板）
- 跟 Mantine 视觉 100% 一致
- 维护活跃（GitHub 1K+ star）

**mantine-contextmenu**：
- 右键菜单（@mantine/core 没有）
- 适合「文件管理 / 表格行右键操作」场景

**其他社区扩展**：
- @mantine/admin：admin 框架（社区）
- mantine-react-table：基于 TanStack Table 的 Mantine 封装
- mantine-rich-text-editor：高级富文本

[click] **配套技术栈**：

**「Next.js App Router + Zustand + Vite + Zod」是 2025 年 React 全栈主流**：
- Next.js App Router：现代全栈框架
- Zustand：轻量状态管理（适合 Mantine 心智 —— 现代实用）
- Vite：构建工具
- Zod：TypeScript-first 校验（Standard Schema 默认）

**TanStack Query**：
- 服务端状态管理事实标准
- 配合 mantine-datatable 极佳

**dayjs**：
- @mantine/dates 强制依赖
- 跟 Ant Design v5 共用心智

**mantine-datatable**：
- 表格事实标准
- mantine-datatable + TanStack Query + @mantine/notifications = CRUD 黄金组合

**其他推荐**：
- @tanstack/react-router：现代路由（如不用 Next.js）
- jotai：原子化状态（喜欢 atomic 心智的）
- ECharts / Recharts：高级图表
- @tiptap/extension-*：富文本扩展

延伸阅读：
- [Mantine Discord](https://discord.gg/wbH82zuWMN)：10K+ 成员，技术讨论活跃
- [Mantine Changelog](https://mantine.dev/changelog/)：版本更新历史
- [Mantine X Templates](https://mantine.dev/getting-started/)：官方 Dashboard 模板
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 🪐

Mantine — React 生态最现代化的全功能 UI 组件库

<div class="mt-8 text-lg">

**核心心智**

- MantineProvider + ColorSchemeScript 是全局配置中心，主题 / 色模 / CSS Vars 统一管
- Styles API 三件套（classNames / styles / vars）深度定制任意元素
- light-dark() + CSS Variables 主题切换 0 React 重渲染
- @mantine/form + Standard Schema 一行接 Zod，AbortSignal 处理异步竞态
- 70+ Hooks 独家王牌，是 React 生态学习「自定义 Hook 设计」的最好教材

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://mantine.dev/" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/mantinedev/mantine" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://mantine.dev/getting-started/" target="_blank" class="slidev-icon-btn">
    <carbon:play /> Templates
  </a>
</div>

<style>
h1 {
  background-color: #339af0;
  background-image: linear-gradient(45deg, #339af0 10%, #845ef7 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：Mantine = React 生态最现代化、最完整、最高性能的全功能 UI 组件库 ——
130+ 组件 + 70+ Hooks + 纯 CSS + Styles API 三件套。

核心心智五条：
1. MantineProvider + ColorSchemeScript 是全局配置中心 —— 主题 / 色模 / CSS Vars 统一管
2. Styles API 三件套 —— classNames（推荐）/ styles（内联）/ vars（CSS 变量）深度定制
3. light-dark() + CSS Variables —— 主题切换 0 React 重渲染，浏览器原生切换
4. @mantine/form + Standard Schema —— useForm 直接传 Zod schema + AbortSignal 异步校验
5. 70+ Hooks 独家王牌 —— 是 React 学习「自定义 Hook 设计」的最好教材

下一步建议：
- 跟着官方文档 Inputs + Combobox + Form 三大主题实战一个 CRUD 页面
- 把 @mantine/form + Zod + mantine-datatable + @mantine/notifications 全套打通
- 然后接入 @mantine/dates / charts / tiptap / spotlight 重构页面，体验生态完整性
- 最后用 Next.js App Router 搭一个完整全栈应用，对标官方 Dashboard 模板

延伸学习：
- Styles API + Component.extend 是「企业级 Mantine 用户」必练
- 70+ Hooks 学透成为「React 高级开发」分水岭
- Combobox 体系深入是「下拉组件定制」的极致灵活
- Polymorphic 多态组件设计是「设计系统」必备工具

感谢观看！
-->
