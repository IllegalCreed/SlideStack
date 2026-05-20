---
theme: seriph
background: https://cover.sli.dev
title: Welcome to shadcn/ui
info: |
  Presentation shadcn/ui for React developers — The Foundation for your Design System.

  Learn more at [https://ui.shadcn.com/](https://ui.shadcn.com/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">🎨</span>
</div>

<br/>

## shadcn/ui — The Foundation for your Design System

Open Code / Composition / Distribution —— 不是组件库，是你构建组件库的方式

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 shadcn/ui —— React 生态 2023+ 现象级爆款，
作者 shadcn（@shadcn）2023 年初创立，2024 年被 Vercel 收购后全职维护，
当前 CLI 4.7+，组件 70+，GitHub 115K+ star，npm `shadcn` 周下载 200 万+。

核心标签：
- **不是 npm 库**：不能 `import { Button } from "shadcn-ui"`，组件源码 copy 到你 repo
- **不是 wrapper**：是 Radix UI 行为 + Tailwind 样式 + lucide-react 图标 + cva 变体的工程化封装
- **不是组件库**：是「构建组件库的方式」—— shadcn 自己强调「The Foundation for your Design System」

关键事实：
- OpenAI / Sonos / Adobe / Vercel 都在用
- 70+ 组件 + Blocks（dashboard/login）+ Themes（色板）+ Charts（Recharts 封装）
- CLI 4.7：`init` / `add` / `build` / `apply` / `view` / `mcp` / `registry:build` / `preset` / `search`
- MCP Server（2025-08）—— Claude Code / Cursor / VS Code 自然语言装组件
- Universal Registry（2025-07）—— 任何 JSON URL 都能当组件源
- Tailwind v4（2025-02）+ OKLCH + @theme inline
- 2025-06 起底层从 `@radix-ui/react-*` 单包迁移到 `radix-ui` 一站式

本次内容覆盖：定位 → copy-paste 哲学 → 底层关系 → 技术栈 → CLI → 配置 → 关键组件 → 主题 → Dark Mode → MCP → Registry → Monorepo → 踩坑 → 学习路径。
-->

---
transition: fade-out
---

# 什么是 shadcn/ui？

React 生态 2023+ 现象级爆款，「构建组件库的方式」

<v-click>

- **115K+ GitHub Star**：React UI 类目长期 Top 1，OpenAI / Sonos / Adobe / Vercel 在用
- **不是 npm 组件库**：没有 `npm install shadcn-ui`，CLI 把源码复制到你 repo
- **70+ 组件**：Button / Dialog / Form / Sidebar / Data Table / Calendar / Chart …
- **Blocks 模板**：Dashboard / Login / Signup / Sidebar 等开箱整页方案
- **Themes 色板**：26 色 × 11 阶，OKLCH 色彩空间，一键 copy CSS Vars
- **CLI 4.7+**：init / add / build / apply / view / mcp / registry:build / preset
- **MCP Server**：Claude Code / Cursor / VS Code 自然语言装组件
- **Universal Registry**：任何 JSON URL 都能当组件源，私有分发开箱即用
- **作者 shadcn**：2024 年被 Vercel 收购，全职维护

</v-click>

<br>

<div v-click text-xs>

_Read more at_ [_ui.shadcn.com_](https://ui.shadcn.com/)

</div>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] shadcn/ui 的「定位」是它最特别也最容易被误解的点。

很多人第一次接触会问：「为啥不能 npm install？」—— 答案是 shadcn 故意的。

**shadcn 不是组件库，是「构建组件库的方式」**：
- 传统组件库（MUI / Ant Design / Mantine / Chakra）：你 `npm install` → `import { Button }` → 用别人的样式
- shadcn 模式：CLI 把 `button.tsx` 源码复制到你 `components/ui/`，你拥有这份代码

**为什么这样设计？**
1. **自由度最大化**：组件代码在你 repo，想改 className、加 variant、删功能都行
2. **不锁定版本**：不会因为升级 `shadcn` 大版本影响业务 —— 你的代码归你
3. **AI 友好**：源码可读 + Claude/Cursor 能直接改
4. **学习友好**：每个组件就是一个 cva + Radix 的小示例，看源码就懂

**核心数据**：
- GitHub 115K+ star（v2 期间从 5K → 115K，火箭式增长）
- 周下载（npm `shadcn` CLI）200 万+
- 70+ 组件覆盖 Form / Overlay / Data / Layout / Feedback 全场景
- OpenAI 官方产品、Sonos 控制台、Adobe Express、Vercel 全线后台

**两条产品线**：
- **CLI**（npm `shadcn`，~4.7.x）：init / add / build / mcp / preset 等
- **Registry**（ui.shadcn.com）：组件源码 JSON 仓库，CLI 拉取

**生态**：
- Blocks：整页模板（dashboard-01 / login-03 等），复制即装
- Charts：基于 Recharts 的图表组件
- Themes：26 色板，一键 copy CSS Vars 替换
- MCP Server：AI 助手原生集成

下面按「定位 → copy-paste 哲学 → 底层 → 技术栈 → CLI → 实战」展开。
-->

---
transition: fade-out
---

# Copy-Paste 哲学

shadcn 最颠覆传统组件库的核心理念

<v-click>

| 维度       | **传统组件库（MUI/Ant/Mantine）** | **shadcn/ui**                       |
| ---------- | ---------------------------------- | ----------------------------------- |
| 分发       | npm install                        | CLI 拷源码                          |
| 代码位置   | node_modules（只读）               | components/ui/（你的 repo）         |
| 改样式     | theme override / 覆盖 className    | 直接改源码                          |
| 锁版本     | 升级影响业务                       | 你的代码不变                        |
| 类型       | 黑盒 API                           | 透明源码                            |
| 体积       | 全包装载                           | 只装用到的                          |
| AI 协作    | 改 wrapper                         | 直接 edit `button.tsx`              |

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这张对比表是理解 shadcn 的关键。

**传统组件库模式**：
```bash
npm install @mui/material
```
- Button 源码在 `node_modules/@mui/material/Button.js`
- 你只能通过 theme.palette / sx prop / styled() 覆盖
- 改不了底层（如想加 loading 状态、删 ripple、换字体）
- 升级 MUI 大版本可能 break 你的覆盖代码

**shadcn 模式**：
```bash
pnpm dlx shadcn@latest add button
```
- 检测/安装依赖（radix-ui / class-variance-authority / lucide-react）
- 把 `components/ui/button.tsx` 写到你 repo
- 你拥有这份源码 —— 想加 loading 就加 useState
- 想删 ghost 变体就删 cva 配置项
- 想换 lucide 为其他图标库就改 import

**核心理念三句话**：

1. **"You own the code"**：组件代码是你的资产，不是依赖
2. **"Start here, then make it your own"**：shadcn 给你起点，剩下你自己
3. **"Not a component library. It is how you build your component library"**：shadcn 是「方法论」

**为什么 AI 时代特别合适？**

Claude / Cursor / Copilot 在你 repo 内能直接读改组件源码：
- 「把 button 加个 loading prop」→ AI 直接 edit `button.tsx`
- 「换个 ghost variant 配色」→ AI 直接改 cva
- 不需要查 MUI 文档 / 理解 theme override 抽象层

shadcn 自己强调「AI-Ready」是五大支柱之一 —— 不是 marketing，是设计原则。

**学习曲线**：
- 第一个组件可能愣 5 分钟：「咦怎么没 npm 包」
- 5 分钟后：「这不就是普通 React 组件吗，我看得懂」
- 30 分钟后：「卧槽我可以自己加 variant」
- 一天后：「我再也回不去传统组件库了」

**反对声音**：
- 「源码进 repo 不好维护」→ 但你也不会维护 MUI 源码，只是看不见
- 「升级 shadcn 怎么办」→ 重跑 add 命令会 diff 提示
- 「项目几百个组件不臃肿吗」→ 只 add 用到的，按需

**shadcn 不是银弹**：
- 内部工具 / 大量自定义 → shadcn 完美
- 严格设计规范 / 完全标准化 → 传统库可能更合适
- 但 2024+ React 项目，shadcn 是默认选择级别的存在
-->

---
transition: fade-out
---

# 与 Radix UI / Headless UI 的关系

shadcn/ui 的底层 = Radix Primitives 行为 + Tailwind 样式

<v-click>

- **shadcn = Radix 行为 + Tailwind 样式 + cva 变体 + lucide-react 图标 + CLI 分发**
- 90% shadcn 组件基于 Radix Primitives（Dialog / Popover / Select / Menu / Toast …）
- 少数组件用其他底层：Toast = sonner / Calendar = react-day-picker / Command = cmdk / Drawer = vaul
- Radix 提供「行为 + a11y」，shadcn 提供「样式 + 分发」—— 完美互补
- 2025-06 起官方推荐 `radix-ui` 一站式 monolith 替代 `@radix-ui/react-*` 单包

</v-click>

<v-click>

```tsx
// components/ui/dialog.tsx —— shadcn 生成的源码骨架
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
// Tailwind className 包装 Radix Content + data-state 动画
const DialogContent = (...) => <DialogPrimitive.Content className={cn("...")} />;
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] shadcn 的底层 = Radix Primitives —— 这是理解 shadcn 工程实现的关键。

**90% shadcn 组件本质就是「Radix Primitive + Tailwind className 包装」**：

| shadcn 组件 | 底层 |
| --- | --- |
| Button | @radix-ui/react-slot（asChild） |
| Dialog / AlertDialog | @radix-ui/react-dialog / alert-dialog |
| DropdownMenu | @radix-ui/react-dropdown-menu |
| Popover / HoverCard | @radix-ui/react-popover / hover-card |
| Select | @radix-ui/react-select |
| Tabs | @radix-ui/react-tabs |
| Accordion | @radix-ui/react-accordion |
| Checkbox / Switch / Radio | @radix-ui/react-* |
| Slider / Toggle / Toggle Group | @radix-ui/react-* |
| ContextMenu / Menubar | @radix-ui/react-* |
| Navigation Menu | @radix-ui/react-navigation-menu |
| Avatar / Aspect Ratio / Scroll Area | @radix-ui/react-* |
| Progress / Separator / Tooltip | @radix-ui/react-* |

**少数非 Radix 底层**：
- Toast → sonner（Emil Kowalski，Vercel 设计师）—— 2024 起替代 Radix Toast
- Calendar → react-day-picker
- Command → cmdk（Paco Coursey，Vercel）—— ⌘K 命令面板
- Drawer → vaul（Emil Kowalski）—— iOS 风格底部抽屉
- Chart → recharts
- Data Table → @tanstack/react-table
- Form → react-hook-form + zod

**Radix 与 shadcn 互利共生**：
- Radix 提供工业级 a11y + 行为（焦点陷阱、键盘导航、Portal、collision detection）
- shadcn 提供工业级 Tailwind 样式 + cva 变体 + 复制粘贴体验
- 没 Radix → shadcn 要重新发明 a11y 行为
- 没 shadcn → Radix 一直是「行家才用」的 headless 库

**2025-06 重要事件 —— Radix 一站式迁移**：
- 之前：每个 Primitive 一个 npm 包（`@radix-ui/react-dialog` 等 30+ 个）
- 现在：官方推荐 `radix-ui` 一站式 monolith（tree-shakable）
- shadcn CLI 4 起：新 add 默认用 `radix-ui`，老项目 `shadcn migrate radix` 一键迁

[click] **Dialog 源码骨架**：
```tsx
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
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
```

每个 shadcn 组件文件都是这种结构 —— forwardRef + cn() 合并 className + data-state 动画 + 透传 props。

**vs Headless UI（Tailwind Labs）**：
- Headless UI 也是 Tailwind 团队 + headless 组件
- 但只有 10+ 组件，Radix 30+
- 2024+ Tailwind Labs 重心转 Catalyst（付费），Headless UI 维护放缓
- shadcn 选 Radix 不选 Headless UI 是正确的 —— Radix 组件更完整

**vs Mantine / MUI / Ant Design**：
- 这三个是「全栈组件库」—— 自己实现行为 + 样式 + 主题
- shadcn 是「分发工具」—— 不实现，是组合 Radix + Tailwind + cva
- 下一页详细对比
-->

---
transition: fade-out
---

# 与 Mantine / MUI / Ant Design 思路差异

「全栈组件库」vs「组合 + 分发」两种哲学

<v-click>

| 维度       | **Mantine / MUI / Ant Design** | **shadcn/ui**            |
| ---------- | ------------------------------ | ------------------------ |
| 实现       | 自有完整实现                   | 组合 Radix + Tailwind    |
| 分发       | npm 包                         | CLI copy 源码            |
| 主题       | ThemeProvider + 配置对象       | CSS Vars + Tailwind      |
| 自由度     | 受 API 约束                    | 改源码自由               |
| AI 协作    | 改 wrapper                     | 直接 edit source         |
| 适合场景   | 严格设计规范                   | 自定义品牌 + SaaS        |

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **传统全栈组件库**（Mantine / MUI / Ant Design / Chakra v2 / NextUI 等）：
- 自有完整实现（行为 + 样式 + 主题）
- 一套 API，学一次用一辈子
- ThemeProvider 集中配置
- npm 包升级 → 全量影响

**shadcn/ui 模式**：
- 不重新实现，组合 Radix + Tailwind + cva + lucide
- 源码进你 repo，CLI 只负责分发
- CSS Variables 主题 + Tailwind utility class
- 升级是「重跑 add」生成新源码，你 diff 决定

**哲学差异本质**：
- 传统库说「我们设计好了，你来用」—— Designed for you
- shadcn 说「我给你起点，你自己改」—— Designed by you

**各派代表**：

**Mantine v7+**：
- 自有 100+ 组件 + 全自主样式 + CSS Modules
- ThemeProvider + Mantine Hooks + Notifications + Dates
- 适合「设计系统强 + 想直接拿来用」
- 跟 shadcn 哲学完全相反 —— Mantine 是「成品」

**MUI v6+**：
- Material Design 实现 + styled() / sx prop
- 大公司 / 严格规范项目首选
- 性能开销最大（Emotion 运行时）
- 设计语言固定（Material You）

**Ant Design v5+**：
- 中后台标杆 + 表格/表单完整
- ConfigProvider + theme tokens
- 中文社区最强
- 设计偏「企业风」

**Chakra UI v3+**：
- v3 重写后接近 shadcn 思路（Ark UI 底层 + snippet CLI）
- 仍是 npm 包，但 snippet 支持复制
- style props 是它的招牌

**NextUI / HeroUI**：
- HeroUI 是 NextUI 改名（2024 末）
- Tailwind v4 + 自有变体系统
- 介于 Mantine 和 shadcn 之间

**Park UI（基于 Ark UI）**：
- 跟 shadcn 哲学最像 —— snippet CLI + Panda CSS
- 但跨框架（React / Solid / Vue / Svelte）
- 不是 React 专属

**适合场景**：

| 项目类型 | 推荐 |
| --- | --- |
| 内部后台 + 自定义品牌 | shadcn/ui |
| 企业中后台 + 中文用户 | Ant Design |
| 设计感强 + 想要现成 | Mantine |
| 严格 Material 设计 | MUI |
| 多框架共享 | Park UI |
| Web3 / 现代 SaaS | shadcn / HeroUI |

**shadcn 不是银弹**：
- 极度强调「自定义」的项目 → shadcn 完美
- 极度强调「统一规范」的大企业 → Ant Design / MUI 更稳
- 但 2024+ 新项目，shadcn 是默认级别推荐

**为什么 shadcn 这两年这么火**？
1. Tailwind v3/v4 真正普及（utility-first 成主流）
2. Vercel 收购 + 流量加持
3. AI 时代「源码可读」=「AI 友好」
4. React 19 + Server Components → 减少运行时（shadcn 几乎全是 client，但 0 自有运行时）
5. cva 模式被广泛接受
6. Radix Primitives 工程质量逐步证明
-->

---
transition: fade-out
---

# 五大设计原则

shadcn 官方强调的核心支柱

<v-click>

- **Open Code**：源码全部可见 + 可改 + 进你 repo —— 不是黑盒
- **Composition**：所有组件 API 统一可预测（forwardRef + className 透传 + asChild）
- **Distribution**：flat-file schema + CLI 工具 —— Registry 描述 + 安装
- **Beautiful Defaults**：开箱即用样式 + OKLCH 色板 + 现代设计感
- **AI-Ready**：源码 LLM 友好 + MCP Server + 自然语言装组件

</v-click>

<v-click>

> 💡 **核心**：Open Code 是基石 —— 其他四条都是它的延伸（可读才能 AI-Ready / 一致才能 Composition / 文件即源才能 Distribution / 默认好看是 shadcn 自己审美）。

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **shadcn 自己强调的「五大支柱」**：

**1. Open Code（开放源码）**：
- 不是开源协议 → 是「代码在你 repo」
- 你能读每一行 className / cva / forwardRef 实现
- AI 助手能 grep / edit
- 没有「黑盒」依赖 API 文档去猜

vs MUI：你打开 button.tsx 看到的是 forwarded import，不是源码
vs shadcn：你打开 components/ui/button.tsx 看到的就是源码

**2. Composition（组合一致）**：
- 所有组件遵循同一 API 约定：
  - `React.forwardRef<HTMLXxxElement, XxxProps>`
  - `className` 透传 + `cn()` 合并
  - `asChild` 支持（用于多态渲染）
  - `data-state` / `data-side` 等 data-* 暴露状态
- 学一个组件 → 会用全部
- 跟 Radix Primitives 命名空间结构融合（`<Dialog.Root>...</Dialog.Root>`）

**3. Distribution（分发体系）**：
- Registry = JSON schema 描述的组件源
- 一个 `registry-item.json` 包含：源码 / 依赖 / Tailwind 配置 / CSS Vars
- CLI 4.7：`shadcn add button` 拉取 + 写文件 + 装依赖
- Universal Registry（2025-07）：任何公网 JSON URL 都能当源
- 私有 Registry：auth headers / env vars，企业内部共享

**4. Beautiful Defaults（开箱即用美感）**：
- shadcn 自己的审美：圆角恰好（0.5rem）+ OKLCH 色彩 + 留白克制
- 26 色板 × Light/Dark 双套
- 不需要请设计师就能跑出现代 SaaS 感
- vs Tailwind 默认（蓝色 buttons 像 90s 配色）

**5. AI-Ready（AI 友好）**：
- 源码可读 → Claude/Cursor 能改
- MCP Server（2025-08）：自然语言 add 组件
- 组件名 + 文档结构 LLM 友好
- 复制粘贴模式跟 LLM 生成代码契合

[click] **Open Code 是基石**：
- 因为 Open → 才能 AI-Ready（黑盒包 LLM 看不见）
- 因为 Open → 才能 Composition（不一致马上被发现）
- 因为 Open → 才能 Distribution（源码就是分发对象）
- 默认好看是 shadcn 团队的「审美贡献」 —— Open 让你能在此基础上改

**shadcn 的成功不只是技术** —— 是哲学。
组件库 20 年来一直是「黑盒分发」，shadcn 第一个真正做「白盒分发」。

GitHub 115K star 的本质是社区认同这个理念：「我想拥有代码，不是依赖」。
-->

---
transition: fade-out
---

# 技术栈全景

shadcn/ui 依赖的关键 npm 包

<v-click>

```text
shadcn (CLI)              组件生成 / Registry 拉取 / MCP
  ├─ radix-ui             一站式 Headless Primitives
  ├─ tailwindcss v4       原子样式 + @theme inline
  ├─ class-variance-authority (cva)  变体声明 + props 推导
  ├─ tailwind-merge       class 合并去重
  ├─ clsx                 条件 class
  ├─ lucide-react         图标（默认）/ react-icons 可选
  ├─ next-themes          Dark Mode 切换
  ├─ sonner               Toast（替代 Radix Toast）
  ├─ cmdk                 Command Palette
  ├─ vaul                 Drawer（iOS 风）
  ├─ react-day-picker     Calendar
  ├─ react-hook-form      Form 状态
  ├─ zod                  Form 校验
  ├─ @tanstack/react-table Data Table
  └─ recharts             Charts
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **shadcn 不是组件库，是「集大成者」**：

它没有自己的运行时代码，全靠组合现成包。

**核心层（必装）**：
- **radix-ui**（一站式，~1MB tree-shakable）—— 90% 组件的行为底座
- **tailwindcss v4** —— 样式
- **class-variance-authority (cva)** —— 变体声明
- **tailwind-merge** —— 合并 className 去重（解决 `bg-red-500` + `bg-blue-500` 后者覆盖）
- **clsx** —— 条件 className（`clsx({ "active": isActive })`）

cva + tailwind-merge + clsx → 合并成 `cn()` 工具函数，写在 `lib/utils.ts`。

**图标层**：
- **lucide-react**（默认）—— 1000+ 简洁线性图标
- 可选 **react-icons** / **@radix-ui/react-icons** / **tabler-icons** 等
- CLI 4.7：components.json 中 `iconLibrary` 字段可切换
- migrate icon-library 命令一键替换全部 import

**主题层**：
- **next-themes**（Pacheco 出品）—— Dark/Light 切换 + system 模式 + SSR-safe
- 自动给 `<html>` 加 `class="dark"`

**专项组件**（按需）：
- **sonner**（Emil Kowalski）—— Toast 标准方案，替代 Radix Toast
- **cmdk**（Paco Coursey）—— ⌘K 命令面板
- **vaul**（Emil Kowalski）—— iOS 风 Drawer
- **react-day-picker** —— Calendar 实现
- **react-hook-form** —— Form 状态管理
- **zod** —— Form 校验 schema
- **@tanstack/react-table** —— 表格 headless
- **recharts** —— Chart 图表

**作者关联**：
- Emil Kowalski（Vercel 设计师）：sonner + vaul
- Paco Coursey（Vercel）：cmdk
- Pacheco（Vercel）：next-themes
- shadcn（Vercel）：shadcn/ui

可以看出 —— Vercel 是 shadcn 生态的「设计师 + 工程师工厂」。

**包大小估算**（完整跑 dashboard）：
- radix-ui：~150KB gzipped（只装用到的）
- tailwind v4：~10KB runtime（utility-first）
- cva / clsx / tailwind-merge：~3KB
- lucide-react：~5KB（按需 import）
- next-themes：~2KB
- sonner / cmdk / vaul：~10KB
- recharts：~80KB（如果用 Chart）
- @tanstack/react-table：~25KB（如果用 Data Table）

总计：纯 UI 200-300KB gzipped —— 比 MUI / Ant Design 小很多。

**vs MUI bundle**：
- MUI core + icons：~600KB+ gzipped
- 含 Emotion 运行时 + 大量 baseline

shadcn 没有自有运行时 → 体积压力全在子依赖。
-->

---
transition: fade-out
---

# CLI 工作流（shadcn 4.7+）

完整命令清单 —— 从 init 到 registry build

<v-click>

```bash
# 初始化 / 添加组件
pnpm dlx shadcn@latest init               # 现有项目
pnpm dlx shadcn@latest init -t next       # 创建 Next.js
pnpm dlx shadcn@latest init --monorepo    # monorepo
pnpm dlx shadcn@latest add button         # 单组件
pnpm dlx shadcn@latest add dashboard-01   # 整页 Block

# 浏览 / 搜索 / 构建 Registry
pnpm dlx shadcn@latest view button        # 预览源码
pnpm dlx shadcn@latest search "form"      # 搜索 Registry
pnpm dlx shadcn@latest build              # 构建私有 Registry

# AI / 迁移
pnpm dlx shadcn@latest mcp init           # 配置 MCP Server
pnpm dlx shadcn@latest migrate radix      # 迁移到 radix-ui 一站式
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **shadcn CLI 4.7+ 完整命令清单**：

**init —— 初始化**：
- `shadcn init` 现有项目（写 components.json + globals.css + lib/utils.ts）
- `shadcn init -t next` 全新 Next.js 项目
- `-t vite | react-router | astro | tanstack-start | laravel`
- `--monorepo` Turborepo 监管的多包结构
- `--preset <CODE>` 用 shadcn/create 网页配置预设
- `--yes` 跳过所有提示
- `--silent` 静默

**add —— 添加组件**：
- `shadcn add button` 单个
- `shadcn add button dialog form` 批量
- `shadcn add dashboard-01` Block 模板（整页）
- `--overwrite` 覆盖已有
- `--dry-run` 预览不写
- `--all` 全部组件（不建议）
- `--cwd <path>` 指定项目目录

**view —— 预览源码（不安装）**：
- `shadcn view button` 看 button.tsx 源码
- `shadcn view dialog --raw` 输出原始 JSON
- 适合「先看再决定」

**search —— 搜索 Registry**：
- `shadcn search "form"` 按关键词
- 跨 Registry 搜索（默认 shadcn + 你配置的）

**build —— 构建私有 Registry**：
- `shadcn build` 把你的 `registry.json` 编译成发布的 JSON 文件
- 输出到 `public/r/` 默认目录
- 供其他项目 `shadcn add https://your-registry.com/r/button.json` 安装

**registry:build —— 别名**：
- 同 `build`，更明确的命名

**mcp —— MCP Server 集成**：
- `shadcn mcp init --client claude` 配置 Claude Code MCP
- `--client cursor / vscode`
- 写 `.mcp.json` 或 `.cursor/mcp.json` 或 `.vscode/mcp.json`

**preset —— shadcn/create 预设**：
- `shadcn preset decode <CODE>` 解码预设
- `shadcn preset url <CODE>` 生成 URL
- `shadcn preset open <CODE>` 浏览器打开
- 你在网页选好色板 / 字体 / 组件 → 拿到 CODE → 用预设初始化

**apply —— 应用预设到现有项目**：
- `shadcn apply <CODE>` 把预设的主题应用到当前项目
- `--theme-only` 只换色板
- `--font-only` 只换字体

**migrate —— 迁移命令**：
- `migrate radix`：把 `@radix-ui/react-*` 单包 imports 合并为 `radix-ui` 一站式
- `migrate icon-library`：批量替换 lucide → react-icons 之类
- `migrate rtl`：加 RTL 支持

**info —— 项目信息**：
- `shadcn info` 输出当前 components.json + 已装组件 + 版本
- `--json` JSON 格式

**docs —— 文档**：
- `shadcn docs button` 输出组件文档
- 跟 MCP 配合，AI 能查文档

**diff —— 差异（旧版还在）**：
- `shadcn diff button` 看本地组件 vs Registry 最新版差异
- 用于「升级提示」

**list / registries**：
- `shadcn list` 列出已装组件
- 显示 Registry 来源

**典型新项目流程**：
```bash
# 1. 创建 + 初始化
pnpm dlx shadcn@latest init -t next

# 2. 装核心组件
pnpm dlx shadcn@latest add button dialog form input

# 3. 装一个 Block
pnpm dlx shadcn@latest add dashboard-01

# 4. 集成 MCP（让 Claude 帮忙）
pnpm dlx shadcn@latest mcp init --client claude

# 5. 开发
pnpm dev
```
-->

---
transition: fade-out
---

# components.json 配置

shadcn 项目的「核心配置文件」

<v-click>

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks",
    "utils": "@/lib/utils"
  },
  "iconLibrary": "lucide"
}
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **components.json 字段详解**：

**$schema**：
- `https://ui.shadcn.com/schema.json`
- 让 IDE 提供自动补全 + 校验

**style**：
- `"new-york"` —— 当前默认，干净紧凑现代 SaaS 风
- `"default"` —— 已弃用（仍可用，新项目不建议）
- `"luma"` —— 2026-03 新增，更柔和的「氛围感」风
- `"sera"` —— 2026-04 新增，更克制的「克莱因蓝」风
- 决定组件默认 className 风格（padding / 圆角 / 阴影）

**rsc**：
- `true`（Next.js App Router）→ 生成的组件带 `"use client"` 顶部声明
- `false`（Vite / CRA）→ 不带

**tsx**：
- `true` → 生成 `.tsx`
- `false` → 生成 `.jsx`（纯 JS 项目）

**tailwind.config**：
- Tailwind v3：`"tailwind.config.ts"` 路径
- **Tailwind v4：留空 `""`**（v4 用 CSS @theme，不再有 config 文件）

**tailwind.css**：
- 你的全局 CSS 文件路径
- Next.js：`app/globals.css`
- Vite：`src/index.css`
- CLI 会往里写 `@theme inline` 和 CSS Vars

**tailwind.baseColor**：
- 默认色系，影响生成的 CSS Vars
- 选项：`neutral` / `stone` / `zinc` / `mauve` / `olive` / `mist` / `taupe`
- 决定 `--background` / `--foreground` / `--muted` 等灰阶颜色
- 新项目建议 `neutral` 或 `zinc`（最中性）

**tailwind.cssVariables**：
- `true`（推荐）→ 用 `bg-background text-foreground` 语义化 class
- `false` → 直接用 `bg-white dark:bg-zinc-900` 等具体色 class

**tailwind.prefix**：
- 给 utility 加前缀避免冲突（`"tw-"` → `tw-bg-red`）
- 默认 `""`，新项目几乎不用

**aliases**：
- TypeScript path aliases，需 tsconfig.json 同步
- `components`：组件总目录（如 `@/components`）
- `ui`：UI 组件子目录（如 `@/components/ui`）
- `lib`：工具库（如 `@/lib`）
- `hooks`：自定义 hooks
- `utils`：cn() 等 utility 函数（如 `@/lib/utils`）

**iconLibrary**：
- `"lucide"`（默认）—— lucide-react
- `"radix"` —— @radix-ui/react-icons
- `"tabler"` —— @tabler/icons-react
- 影响 CLI add 时生成的图标 import

**registries**（高级）：
- 多 Registry 配置
- 私有 Registry 加 auth headers
- 见后面「Registry 私有分发」章节

**完整 monorepo 版**（apps/web/components.json 简化版）：
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "../../packages/ui/src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@workspace/ui/components",
    "ui": "@workspace/ui/components",
    "lib": "@workspace/ui/lib",
    "hooks": "@workspace/ui/hooks",
    "utils": "@workspace/ui/lib/utils"
  }
}
```

→ 跨包共享 UI 组件（packages/ui 是源，apps/* 引用）。

**变更后**：
- 改 components.json 不会自动重生成已装组件
- 你新 add 的组件会用新配置
- 想全量重生成 → `shadcn add --all --overwrite`
-->

---
transition: fade-out
---

# init 实战 —— Next.js + Tailwind v4

从 0 到可运行只要 3 条命令

<v-click>

```bash
# 1. 创建 Next.js 项目（含 Tailwind v4 + TS + App Router）
pnpm create next-app@latest my-app

# 2. 进入 + 初始化 shadcn
cd my-app
pnpm dlx shadcn@latest init
# 选 style: new-york / baseColor: neutral / cssVariables: yes
# CLI 自动写：components.json + lib/utils.ts + app/globals.css

# 3. 添加第一批组件
pnpm dlx shadcn@latest add button card input dialog

# 启动
pnpm dev
```

</v-click>

<v-click>

```tsx
// app/page.tsx —— 立即可用
import { Button } from "@/components/ui/button";

export default function Home() {
  return <Button>Hello shadcn</Button>;
}
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **3 分钟搭好 shadcn 项目**：

**Step 1 —— create-next-app**：
```bash
pnpm create next-app@latest my-app
# 提示：
# Would you like to use TypeScript? Yes
# Would you like to use ESLint? Yes
# Would you like to use Tailwind CSS? Yes  ← 关键
# Would you like to use src/ directory? 看习惯
# Would you like to use App Router? Yes
# Would you like to use Turbopack? Yes
# Would you like to customize default import alias (@/*)? No
```

**Next.js 15+ 默认带 Tailwind v4** —— `app/globals.css` 已有 `@import "tailwindcss"`。

**Step 2 —— shadcn init**：
```bash
cd my-app
pnpm dlx shadcn@latest init
```

CLI 交互提示：
```
Which style would you like to use? › New York
Which color would you like to use as the base color? › Neutral
Would you like to use CSS variables for theming? › yes
```

CLI 自动做的事：
1. 写 `components.json`
2. 创建 `lib/utils.ts`：
   ```ts
   import { clsx, type ClassValue } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```
3. 改 `app/globals.css`：
   ```css
   @import "tailwindcss";
   @import "tw-animate-css";

   @custom-variant dark (&:is(.dark *));

   :root {
     --background: oklch(1 0 0);
     --foreground: oklch(0.141 0.005 285.823);
     /* ... 全套语义 token */
   }
   .dark {
     --background: oklch(0.141 0.005 285.823);
     --foreground: oklch(0.985 0 0);
     /* ... */
   }
   @theme inline {
     --color-background: var(--background);
     --color-foreground: var(--foreground);
     /* ... 把 CSS Var 映射成 Tailwind 类 */
   }
   ```
4. 安装依赖：`class-variance-authority` / `clsx` / `tailwind-merge` / `lucide-react` / `tw-animate-css`

**Step 3 —— add 组件**：
```bash
pnpm dlx shadcn@latest add button card input dialog
```

CLI 做的事：
1. 检测每个组件的依赖（如 `radix-ui` for dialog）
2. 装 npm 依赖
3. 写源码到 `components/ui/button.tsx` 等
4. 自动 import 已有的 `cn` from `@/lib/utils`

完成 —— 立即可用。

[click] **使用示例**：

```tsx
// app/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Click me</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </CardContent>
      </Card>
    </main>
  );
}
```

完整运行 + 已有 light/dark CSS Vars + 现代默认外观。

**对比其他库**：
- MUI：装 + ThemeProvider + 配 Roboto 字体 + 跑通 ~15 分钟
- Ant Design：装 + ConfigProvider + 跑通 ~10 分钟
- shadcn：3 条命令 ~3 分钟，且默认配色已现代

**常见问题**：
- 提示「需要 @tailwindcss/postcss」→ Tailwind v4 PostCSS plugin，CLI 会装
- 「找不到 @/lib/utils」→ tsconfig.json 缺 path alias `"paths": { "@/*": ["./*"] }`
- 「lucide-react module not found」→ 第一次 add 时如果跳 npm install 失败，手动 `pnpm install`
-->

---
transition: fade-out
---

# 第一个组件 —— Button

完整源码解剖

<v-click>

```tsx
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-accent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: { default: "h-9 px-4", sm: "h-8 px-3", lg: "h-10 px-8", icon: "size-9" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Button 源码 = shadcn 标准模板**：

打开 `components/ui/button.tsx`，你会看到这个结构。
理解它 → 理解所有 shadcn 组件。

**Import 三件套**：
- `Slot` from `@radix-ui/react-slot` —— 实现 asChild
- `cva` from `class-variance-authority` —— 变体声明
- `cn` from `@/lib/utils` —— className 合并

[click] **cva (Class Variance Authority)** —— shadcn 的核心利器：

```tsx
const buttonVariants = cva(
  "base classes",  // 始终应用
  {
    variants: {
      variant: { default: "...", outline: "...", ghost: "..." },
      size:    { default: "...", sm: "...", lg: "..." },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);
```

- `cva("base", { variants })` 返回一个函数
- `buttonVariants({ variant: "outline", size: "sm" })` 返回拼好的 className
- TypeScript 自动推导 props 类型（`VariantProps<typeof buttonVariants>`）

[click] **variant 配置**：

shadcn Button 默认 6 个 variant：
- `default`：主按钮（filled primary）
- `destructive`：危险（红色，删除场景）
- `outline`：描边
- `secondary`：次按钮（灰色 filled）
- `ghost`：透明，hover 出背景
- `link`：链接样式（无背景 + 下划线）

每个 variant 用 Tailwind class + 语义 token：
- `bg-primary` → 用 CSS Var `--primary`
- `text-primary-foreground` → 对应文字色
- `hover:bg-primary/90` → hover 时 90% 透明度（Tailwind v4 / arbitrary 语法）

[click] **size 配置**：

- `default`：标准（h-9 px-4 py-2，约 36px 高）
- `sm`：小（h-8 px-3 text-xs）
- `lg`：大（h-10 px-8）
- `icon`：方形（size-9，纯图标按钮）

**defaultVariants** —— 不传 variant/size 时用什么。

**Tailwind v4 新语法**：
- `size-9` —— 同时 `w-9 h-9`（v4 新增）
- `bg-primary/90` —— 90% 透明度（v4 全局支持 `/` slash 语法）
- `disabled:opacity-50` —— `&:disabled` 选择器
- `focus-visible:ring-2` —— 现代 focus 风格（仅键盘聚焦）

下一页讲 Button 的 component 函数 + asChild。
-->

---
transition: fade-out
---

# Button 续 —— forwardRef + asChild

shadcn 的「Composition 一致」核心模式

<v-click>

```tsx {all|1-6|8-23}
type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className, variant, size, asChild = false, ...props
}: ButtonProps) {
  // 关键：asChild=true 时渲染 Slot，把 className/props 转嫁给子元素
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

</v-click>

<v-click>

> 💡 **三大武器**：`cva` 管变体 / `Slot` 管 asChild / `cn()` 合并 className —— 所有 shadcn 组件同样套路。

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Props 类型推导**：

```tsx
type ButtonProps = React.ComponentProps<"button"> &  // 继承 <button> 所有原生 props
  VariantProps<typeof buttonVariants> &              // cva 推出来的 variant/size 联合类型
  { asChild?: boolean };                             // 自有 prop
```

`VariantProps<typeof buttonVariants>` 自动得到：
```ts
{ variant?: "default" | "destructive" | "outline" | ...; size?: "default" | "sm" | "lg" | "icon" }
```

不需要手动声明 union 类型 —— TS 全自动。

[click] **组件函数体**：

```tsx
function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

**关键技巧**：

**1. asChild + Slot**：
- 默认 `asChild=false` → 渲染 `<button>`
- `asChild=true` → 渲染 `<Slot>` → 把 className / onClick / ref 转嫁到子元素
- 实现「我有 Button 的能力，但 DOM 是别的元素」

```tsx
// asChild 用法
<Button asChild>
  <Link href="/dashboard">Dashboard</Link>
</Button>
// 渲染：<a href="/dashboard" class="...button-classes...">Dashboard</a>
// 不是 button 嵌套 a（语义错），是 a 拿到 button 样式
```

**2. cn() 合并 className**：
- `buttonVariants({ variant, size, className })` —— cva 把 base + variant + user className 合并
- 内层 `cn()` 进一步用 tailwind-merge 去重
- 例如用户传 `className="bg-blue-500"`，覆盖默认 `bg-primary`

**3. data-slot="button" 属性**：
- shadcn 4.x 新增的标准
- 让外层 CSS 能选择 `[data-slot="button"]`
- 方便主题级覆盖样式

**4. {...props} 透传**：
- onClick / disabled / type 等原生 button props
- 完整 React 体验，跟原生 `<button>` 无差别

[click] **三大武器**：

| 武器 | 作用 |
| --- | --- |
| **cva** | 声明 variant/size 联合，TS 类型自动推 |
| **Slot** | 实现 asChild，组件能力转嫁子元素 |
| **cn()** | clsx + tailwind-merge，安全合并 className |

**shadcn 70+ 组件 全部遵循这个模式** —— 学一个会全部。

**使用示例汇总**：

```tsx
// 普通用法
<Button>Default</Button>
<Button variant="outline" size="lg">Outline Large</Button>

// asChild —— 跟 next/link 配合
<Button asChild>
  <Link href="/about">About</Link>
</Button>

// 加图标
<Button>
  <Mail className="size-4" />
  Login with Email
</Button>

// 加 loading
<Button disabled>
  <Loader2 className="size-4 animate-spin" />
  Loading...
</Button>

// 覆盖样式
<Button className="bg-purple-600 hover:bg-purple-700">Custom</Button>
```

**为什么是「事实标准」**？
- React 19 + Tailwind v4 + cva + Slot —— 当代 React UI 最佳实践
- shadcn 是把这套组合发扬光大的人
- 其他组件库（Chakra v3、HeroUI、Park UI）现在都在抄这个模式
-->

---
transition: fade-out
---

# cn() 工具函数

clsx + tailwind-merge 合二为一

<v-click>

```tsx
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

</v-click>

<v-click>

```tsx
// 1) clsx —— 条件 class
clsx("base", { "active": isActive, "disabled": isDisabled }, ["extra"]);

// 2) twMerge —— 去重 Tailwind 冲突 class
twMerge("p-4 p-8");           // → "p-8"（后者赢）
twMerge("bg-red-500 bg-blue-500"); // → "bg-blue-500"

// 3) 合二为一
cn("base px-4", isActive && "px-8", className);
// 用户传 className="px-8 bg-blue" → 自动覆盖默认 px-4
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **cn() 是 shadcn 灵魂函数之一**：

实现极简（3 行），但解决两个核心痛点：
1. 条件 class（clsx）
2. Tailwind class 冲突去重（tailwind-merge）

[click] **clsx 用法**：

```tsx
clsx("base");                              // → "base"
clsx("base", "extra");                     // → "base extra"
clsx({ "active": true, "disabled": false }); // → "active"
clsx("base", { "active": isActive });      // → "base active"（如 isActive）
clsx("base", isActive && "active");        // → "base active"
clsx("base", null, undefined, false);      // → "base"（filtered）
clsx(["a", "b"], "c");                     // → "a b c"
```

clsx 替代 classnames（更轻量，~200 字节）。

**twMerge 用法**：

```tsx
twMerge("p-4 p-8");              // → "p-8"
twMerge("bg-red-500 bg-blue-500"); // → "bg-blue-500"
twMerge("text-sm md:text-lg text-base"); // → "md:text-lg text-base"
twMerge("px-4 py-2 p-8");        // → "p-8"（p-8 覆盖 px-4 py-2）
```

**为什么需要 twMerge**？

不用：
```tsx
<Button className="bg-purple-600" /> 
// 拼后：className="bg-primary hover:bg-primary/90 bg-purple-600"
// 浏览器看到两个 bg-* 谁赢？取决于 CSS 加载顺序，不稳定
```

用 twMerge：
```tsx
twMerge("bg-primary hover:bg-primary/90 bg-purple-600");
// → "hover:bg-primary/90 bg-purple-600"（自动去重，后者赢）
```

twMerge 知道：
- `bg-*` 是同组，后者覆盖前者
- `px-*` 跟 `p-*` 互相覆盖
- `text-{size}` 跟 `text-{color}` 是不同组（不冲突）
- 响应式前缀如 `md:` 独立计算

**完整冲突表**：tailwind-merge 维护了 Tailwind 的「class 组」mapping。

[click] **合二为一的 cn**：

```tsx
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

工作流：
1. clsx 先处理条件 / 数组 / falsy
2. twMerge 再处理冲突去重
3. 返回最终 string

**用法举例**：

```tsx
// 在 Button 内部
className={cn(
  buttonVariants({ variant, size }),  // cva 输出
  className                            // 用户传入
)}
// 用户 className 永远能覆盖默认（因为后写）
```

```tsx
// 在业务代码
<div className={cn(
  "p-4 rounded-md",
  isOpen && "bg-blue-50",
  isError ? "border-red-500" : "border-gray-300",
  className,  // props 透传
)}>
```

**Tailwind v4 兼容**：
- tailwind-merge v3+ 支持 v4 新语法（如 `size-*` / `gap-x-*` 改组）
- 升级 Tailwind → 升 tailwind-merge

**性能**：
- twMerge 缓存结果（LRU）
- 千次调用 ~1ms 量级
- 不影响渲染性能

**vs 其他方案**：
- styled-components / Emotion：运行时生成 CSS，体积大
- CSS Modules：没有 className 冲突问题（local scope），但失去 Tailwind 优势
- shadcn 选 cn() —— 零运行时 + utility-first + 优雅冲突解决

**cn 适用范围**：
- 不止 shadcn 组件，业务代码也用
- 任何「Tailwind class 拼接」场景
- 替代 `className={\`base \${isActive ? 'active' : ''}\`}` 这种模板字符串
-->

---
transition: fade-out
---

# class-variance-authority (cva)

变体声明的事实标准

<v-click>

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4",  // base
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

type AlertProps = React.ComponentProps<"div"> & VariantProps<typeof alertVariants>;

function Alert({ className, variant, ...props }: AlertProps) {
  return <div className={cn(alertVariants({ variant }), className)} {...props} />;
}
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **cva (Class Variance Authority)** —— Joe Bell 出品，~2KB gzipped。

**为什么需要 cva？**

写 React 组件 variant 的传统痛点：
```tsx
// 痛苦版
function Button({ variant = "default", className }) {
  const variantClass = {
    default: "bg-blue-500 text-white",
    outline: "border border-blue-500 text-blue-500",
    ghost: "text-blue-500",
  }[variant];

  return <button className={`px-4 py-2 ${variantClass} ${className}`} />;
}
```

问题：
- 没类型约束（`variant="xxx"` 不报错）
- 没自动 defaultVariants
- 多个 variant 组合（variant × size × disabled）爆炸
- className 合并困难

**cva 解决**：

```tsx
const buttonVariants = cva("base", {
  variants: {
    variant: { default: "...", outline: "...", ghost: "..." },
    size: { sm: "h-8", md: "h-9", lg: "h-10" },
    disabled: { true: "opacity-50 cursor-not-allowed" },
  },
  compoundVariants: [
    // 组合变体（variant + size 同时满足时额外加 class）
    { variant: "outline", size: "lg", class: "border-2" },
  ],
  defaultVariants: { variant: "default", size: "md" },
});

// 调用
buttonVariants({ variant: "outline", size: "sm" });
// → "base classes... outline-classes... sm-classes..."

buttonVariants({ variant: "outline", size: "lg" });
// → 包含 compoundVariants 里的 border-2
```

**类型自动推**：

```tsx
type ButtonProps = VariantProps<typeof buttonVariants>;
// 等同于：{ variant?: "default" | "outline" | "ghost"; size?: "sm" | "md" | "lg"; disabled?: boolean }
```

`VariantProps` 是 cva 导出的工具类型 —— 自动推导出 props。

**API 完整清单**：

```tsx
cva(
  base,           // string 或 string[]
  {
    variants,             // 变体定义
    compoundVariants,     // 组合变体（多 variant 同时满足时附加）
    defaultVariants,      // 默认值
  }
);
```

**compoundVariants 实战**：

```tsx
const cardVariants = cva("border rounded", {
  variants: {
    intent: { primary: "border-blue-500", danger: "border-red-500" },
    size: { sm: "p-2", lg: "p-6" },
  },
  compoundVariants: [
    {
      intent: "primary",
      size: "lg",
      class: "shadow-xl",  // 只有 primary + lg 同时满足才加
    },
    {
      intent: "danger",
      size: ["sm", "lg"],  // 数组支持「任一匹配」
      class: "ring-2 ring-red-300",
    },
  ],
});
```

**Tailwind IntelliSense 协作**：

VSCode + Tailwind 插件 + cva：
- cva 字符串里的 Tailwind class 自动补全
- 需要在 settings.json 加：
  ```json
  {
    "tailwindCSS.experimental.classRegex": [
      ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
    ]
  }
  ```

**cva 2.x 新特性**：
- TS 5+ 完整支持
- `className` 字符串数组：`["a", "b"]` 等同 `"a b"`
- 性能优化（避免不必要的 split）

**vs 其他变体方案**：
- **stitches** —— 自有运行时，体积大
- **styled-components variants** —— 运行时 CSS-in-JS
- **Vanilla Extract recipes** —— 类似 cva 但跟 vanilla-extract 绑定
- **cva** —— 纯静态 class 拼接，零运行时，组件库首选

**Tailwind v4 + cva 是 2024+ 黄金搭档**：
- Tailwind 提供原子样式
- cva 提供变体组合
- TypeScript 提供类型
- 三位一体 —— 零运行时 + 类型完整 + 工程化
-->

---
transition: fade-out
---

# asChild + Slot 模式

把组件能力转嫁到任意子元素

<v-click>

```tsx
// shadcn Button 内部
import { Slot } from "@radix-ui/react-slot";

function Button({ asChild, ...props }) {
  const Comp = asChild ? Slot : "button";
  return <Comp {...props} />;
}
```

</v-click>

<v-click>

```tsx
// 用法 1：默认 —— 渲染 button
<Button>Click</Button>
// → <button class="...">Click</button>

// 用法 2：asChild + Link —— 渲染 a 标签
<Button asChild>
  <Link href="/about">About</Link>
</Button>
// → <a href="/about" class="...">About</a>（拿到 button 样式）

// 用法 3：asChild + 自定义组件（需要 forwardRef）
<DialogTrigger asChild>
  <MyButton>Open</MyButton>
</DialogTrigger>
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **asChild Slot 模式 —— Radix 首创的 polymorphism 解决方案**：

**问题**：
- 你想要一个「Button 样式 + Link 行为」的组件
- 传统方案：嵌套 `<Link><Button>...</Button></Link>` → DOM 是 `<a><button>...</button></a>`，HTML 不合规（button 不能嵌套交互元素）
- 另一传统：复制 Button 样式到 Link 上 → 样式同步噩梦

**asChild 方案**：
```tsx
<Button asChild>
  <Link href="/about">About</Link>
</Button>
```
- 不渲染 button DOM
- 把 className / onClick / aria-* 都传给 Link
- 最终 DOM：`<a href="/about" class="button-styles">About</a>`
- 语义正确 + 样式继承

[click] **Slot 实现**：

```tsx
// @radix-ui/react-slot 简化版
import * as React from "react";

const Slot = React.forwardRef((props, ref) => {
  const { children, ...slotProps } = props;
  
  if (!React.isValidElement(children)) {
    return null;
  }

  // 合并 slot 的 props 到 children 上
  return React.cloneElement(children, {
    ...slotProps,
    ref: composeRefs(ref, children.ref),
    className: cn(slotProps.className, children.props.className),
  });
});
```

核心：
- `cloneElement` 把 props clone 到子元素
- composeRefs 合并 ref（Slot 自己 + 子元素自己的 ref）
- className 合并（防止覆盖）

**asChild 用法变体**：

```tsx
// 1. Button + Link（路由）
<Button asChild>
  <Link href="/dashboard">Dashboard</Link>
</Button>

// 2. DialogTrigger + 自定义按钮
<Dialog.Trigger asChild>
  <CustomIconButton><Settings /></CustomIconButton>
</Dialog.Trigger>

// 3. Tabs.Trigger + a 锚点
<Tabs.Trigger value="t1" asChild>
  <a href="#tab1">Tab 1</a>
</Tabs.Trigger>

// 4. 嵌套使用（少见但 OK）
<Button asChild>
  <Tooltip.Trigger asChild>
    <Link href="/">Home</Link>
  </Tooltip.Trigger>
</Button>
```

**asChild 限制**：

1. **必须唯一子节点**：
```tsx
// ❌ 报错
<Button asChild>
  <Icon />
  <span>Text</span>
</Button>
// "asChild only works with a single child"

// ✅ 包一层
<Button asChild>
  <Link href="/">
    <Icon />
    <span>Text</span>
  </Link>
</Button>
```

2. **子元素需要 forwardRef**：
```tsx
// ❌ 不接受 ref
const MyButton = ({ children }) => <button>{children}</button>;

// ✅ forwardRef
const MyButton = React.forwardRef<HTMLButtonElement>(
  ({ children, ...props }, ref) => (
    <button ref={ref} {...props}>{children}</button>
  )
);
```

3. **子元素必须 spread props**：
```tsx
// ❌ 不接受 onClick 透传
const MyLink = ({ href, children }) => <a href={href}>{children}</a>;

// ✅ 透传 props
const MyLink = ({ children, ...props }) => <a {...props}>{children}</a>;
```

**第三方组件踩坑**：
```tsx
// next/link、react-router Link 都已支持 forwardRef + spread
<Button asChild>
  <Link href="/">Click</Link>  // ✅ Next.js / React Router 都 OK
</Button>

// 老库或自有简单组件需检查
```

**vs Polymorphic as prop（旧方案）**：
```tsx
// 旧 Polymorphic as
<Button as={Link} href="/">Click</Button>

// asChild
<Button asChild><Link href="/">Click</Link></Button>
```

**asChild 优势**：
- 子组件结构清晰可见
- TS 类型简单（不需要 PolymorphicComponentProps）
- 子元素的 props 直接写（如 Link 的 href）—— 不需要混在 Button props 里

**shadcn 大量用 asChild**：
- Button / Badge / Card 等容器型组件
- 所有 Radix Trigger（Dialog / Popover / DropdownMenu / Tabs 等）
- 业务里也建议自己组件加 asChild 支持

**asChild 是 2024+ React UI 库的事实标准**：
- shadcn / Radix / Ark / Chakra v3 / Headless UI / HeroUI 都用
- 跟 forwardRef + className 透传 形成「组合三件套」
-->

---
transition: fade-out
---

# 50+ 组件全景

按场景分组的完整清单

<v-click>

**Form**：Form / Input / Textarea / Label / Select / Checkbox / Radio Group / Switch / Slider / Toggle / Toggle Group / Input OTP / Date Picker

</v-click>

<v-click>

**Overlay**：Dialog / Alert Dialog / Drawer / Sheet / Popover / Hover Card / Tooltip / Context Menu / Dropdown Menu / Menubar / Command

</v-click>

<v-click>

**Navigation**：Tabs / Navigation Menu / Breadcrumb / Pagination / Sidebar

</v-click>

<v-click>

**Data**：Table / Data Table / Calendar / Chart / Carousel / Accordion / Collapsible / Resizable

</v-click>

<v-click>

**Feedback**：Toast (Sonner) / Alert / Progress / Skeleton / Spinner / Badge / Avatar

</v-click>

<v-click>

**Layout / Misc**：Card / Aspect Ratio / Scroll Area / Separator / Button / Toggle / Typography / Form blocks

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Form 类（最常用）**：

- **Form**：react-hook-form + zod 包装，FormField / FormItem / FormControl / FormMessage
- **Input**：基础文本输入，size / variant 由 Button 衍生
- **Textarea**：多行输入
- **Label**：与 Input 关联，aria-labelledby 自动绑
- **Select**：基于 Radix Select，typeahead + virtual scroll
- **Checkbox**：基于 Radix Checkbox，含 indeterminate 三态
- **Radio Group**：roving tabindex，方向键导航
- **Switch**：开关，主题色填充
- **Slider**：单/多 thumb，方向键调整
- **Toggle / Toggle Group**：按钮组切换
- **Input OTP**：一次性验证码输入（input-otp 库底层）
- **Date Picker**：Calendar + Popover 组合

[click] **Overlay 类**：

- **Dialog**：模态对话框，焦点陷阱 + ESC 关
- **Alert Dialog**：警告对话框，强意图（删除确认）
- **Drawer**：底部抽屉（vaul 底层，iOS 风手势）
- **Sheet**：侧边抽屉（top/right/bottom/left 四向）
- **Popover**：通用浮动面板
- **Hover Card**：悬停卡片（鼠标停留触发）
- **Tooltip**：工具提示（短文字）
- **Context Menu**：右键菜单
- **Dropdown Menu**：下拉菜单（带 Checkbox / Radio / Submenu）
- **Menubar**：菜单栏（桌面应用 File/Edit/View）
- **Command**：⌘K 命令面板（cmdk 底层，typeahead 搜索）

[click] **Navigation 类**：

- **Tabs**：标签页（水平/垂直 + automatic/manual）
- **Navigation Menu**：顶部大菜单（mega menu 风）
- **Breadcrumb**：面包屑
- **Pagination**：分页（数字 + 上下页）
- **Sidebar**：完整侧边栏方案（含折叠、子菜单、cookies 状态）

[click] **Data 类**：

- **Table**：纯 HTML table 样式包装
- **Data Table**：基于 @tanstack/react-table，含排序/筛选/分页/选择
- **Calendar**：react-day-picker 底层，单/多日期选择
- **Chart**：recharts 包装，含 ChartContainer / Tooltip / Legend
- **Carousel**：embla-carousel 底层
- **Accordion**：折叠面板（single/multiple）
- **Collapsible**：单个开关折叠
- **Resizable**：可调整大小面板（react-resizable-panels 底层）

[click] **Feedback 类**：

- **Toast**：基于 sonner（替代 Radix Toast）
- **Alert**：内联提示（信息/警告/错误）
- **Progress**：进度条
- **Skeleton**：骨架屏
- **Spinner**：加载旋转
- **Badge**：徽章（小标签）
- **Avatar**：头像 + fallback

[click] **Layout & Misc**：

- **Card**：通用卡片容器
- **Aspect Ratio**：固定宽高比
- **Scroll Area**：自定义滚动条
- **Separator**：分割线
- **Button**：按钮（讲过）
- **Typography**：标题/段落/列表样式

**安装清单建议**：

**最小集（新项目）**：
```bash
shadcn add button card input label form dialog dropdown-menu sonner
```

**完整后台（管理系统）**：
```bash
shadcn add button card form input label select checkbox switch radio-group \
  dialog alert-dialog sheet popover tooltip dropdown-menu menubar \
  tabs sidebar table data-table pagination breadcrumb \
  badge avatar separator skeleton progress alert sonner
```

**总数 50+ 全装**（不推荐）：
```bash
shadcn add --all
```

**Block 整页快装**：
```bash
shadcn add dashboard-01  # 整套 dashboard（含 sidebar / chart / table 等）
shadcn add login-03      # 登录页带配图
shadcn add sidebar-07    # 仅 sidebar
```

按需 add 是最佳实践 —— bundle 只装用到的。
-->

---
transition: fade-out
layout: two-cols-header
layoutClass: gap-x-4
---

# Form 方案 —— react-hook-form + zod

shadcn Form 把这两个库整合得极优雅

::left::

<v-click>

```tsx
const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
});

const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: { username: "", email: "" },
});

const onSubmit = (values) => console.log(values);
```

</v-click>

::right::

<v-click>

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl><Input {...field} /></FormControl>
          <FormDescription>公开显示名</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **shadcn Form 是把 react-hook-form + zod 整合成 Composition API**：

**第一步 —— 定义 schema（zod）**：
```tsx
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(2, "至少 2 字").max(50, "最多 50 字"),
  email: z.string().email("请输入有效邮箱"),
  age: z.coerce.number().int().min(18, "需要 18 岁以上"),
  agree: z.literal(true, "必须同意条款"),
});
```

zod 优势：
- 类型推导（`z.infer<typeof formSchema>` → TypeScript 类型）
- 链式校验（`.min().max().refine()`）
- 错误信息（每个 rule 可附消息）

**第二步 —— useForm + zodResolver**：
```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { username: "", email: "", age: 0, agree: false },
});
```

react-hook-form 优势：
- 非受控（性能好，大表单不卡）
- handleSubmit 自动 prevent default + 校验
- 错误状态 / 触摸状态 / 提交状态全管理

[click] **第三步 —— Form Composition Components**：

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input placeholder="shadcn" {...field} />
          </FormControl>
          <FormDescription>这是你的公开显示名</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

**5 个核心子组件**：

- **Form**：context 顶层，把 react-hook-form 实例传下去
- **FormField**：基于 `<Controller>` 封装，render props 拿到 field 对象
- **FormItem**：每个字段的 wrapper，提供 id / aria 关联 context
- **FormLabel**：标签，自动绑定 htmlFor
- **FormControl**：输入控件 wrapper（Input / Textarea / Select 等放里面）
- **FormDescription**：描述文字，自动 aria-describedby
- **FormMessage**：错误消息，自动渲染 form.formState.errors

**a11y 自动化**：
- Label htmlFor 自动绑定 Control id
- Description / Message 自动 aria-describedby
- 错误时自动 aria-invalid

**复杂场景**：

```tsx
// 1. 多字段 + 校验
<FormField name="password" render={({ field }) => (
  <FormItem>
    <FormLabel>Password</FormLabel>
    <FormControl>
      <Input type="password" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)} />

// 2. Select 字段
<FormField name="country" render={({ field }) => (
  <FormItem>
    <FormLabel>Country</FormLabel>
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <FormControl>
        <SelectTrigger><SelectValue /></SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectItem value="us">USA</SelectItem>
      </SelectContent>
    </Select>
    <FormMessage />
  </FormItem>
)} />

// 3. Checkbox 字段
<FormField name="agree" render={({ field }) => (
  <FormItem className="flex items-center gap-2">
    <FormControl>
      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
    </FormControl>
    <FormLabel>同意条款</FormLabel>
    <FormMessage />
  </FormItem>
)} />
```

**异步校验**：
```tsx
const formSchema = z.object({
  email: z.string().email().refine(
    async (val) => {
      const res = await fetch(`/api/check-email?email=${val}`);
      return res.ok;
    },
    "邮箱已被注册"
  ),
});
```

**手动错误**：
```tsx
async function onSubmit(values) {
  const res = await login(values);
  if (!res.ok) {
    form.setError("password", { message: "密码错误" });
    return;
  }
  router.push("/dashboard");
}
```

**TanStack Form 替代方案**：
- shadcn 也支持 TanStack Form（更新方案，类型更强）
- `shadcn add form` 时可选 RHF 或 TanStack
- 大型项目可考虑 TanStack（细粒度 reactive）
-->

---
transition: fade-out
---

# Data Table —— @tanstack/react-table

shadcn Data Table = TanStack Table headless + shadcn 组件

<v-click>

```tsx
// columns.tsx —— 列定义
export const columns: ColumnDef<Payment>[] = [
  { accessorKey: "status", header: "Status" },
  { accessorKey: "amount", header: "Amount" },
  {
    id: "actions",
    cell: ({ row }) => <DropdownMenu>...</DropdownMenu>,
  },
];

// data-table.tsx —— useReactTable 串起 columns + data
const table = useReactTable({
  data, columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **shadcn Data Table 不是「组件」，是「方案」**：

跟 Form 类似 —— shadcn 文档教你如何用 @tanstack/react-table 搭表格，不直接给你一个 `<DataTable>` 组件。

**为什么？**
- 表格需求差异巨大（不同列定义、不同分页、不同筛选）
- TanStack Table 是 headless —— 给你状态管理，UI 你写
- shadcn 提供「Table / DropdownMenu / Pagination」原子组件
- 你组合两者搭自己的 DataTable

**三个文件结构**：

```
app/payments/
  ├─ columns.tsx       ← ColumnDef 数组（每列怎么渲染）
  ├─ data-table.tsx    ← <DataTable /> 通用组件（useReactTable + Table 渲染）
  └─ page.tsx          ← fetch data + 把 columns + data 传入
```

[click] **columns.tsx —— 列定义**：

```tsx
import { ColumnDef } from "@tanstack/react-table";

export type Payment = { id: string; amount: number; status: string; email: string };

export const columns: ColumnDef<Payment>[] = [
  // 1. 选择列（checkbox）
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
      />
    ),
  },
  // 2. 普通列
  { accessorKey: "status", header: "Status" },
  // 3. 可排序的列
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Amount <ArrowUpDown className="size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD",
      }).format(amount);
      return <div className="text-right">{formatted}</div>;
    },
  },
  // 4. 操作列
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;  // 拿到当前行数据
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
```

[click] **data-table.tsx —— 主体**：

```tsx
"use client";
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getPaginationRowModel, getFilteredRowModel,
  flexRender, ColumnDef, SortingState, ColumnFiltersState,
} from "@tanstack/react-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data, columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, rowSelection },
  });

  return (
    <>
      <Input
        placeholder="Filter emails..."
        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
        onChange={(e) => table.getColumn("email")?.setFilterValue(e.target.value)}
      />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((h) => (
                <TableHead key={h.id}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end gap-2">
        <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </>
  );
}
```

**TanStack Table 提供**：
- 状态：sorting / filtering / pagination / rowSelection / columnVisibility
- Row models：core / sorted / filtered / paginated / grouped
- 完整 TypeScript 类型

**shadcn 提供**：
- Table / TableRow / TableCell（HTML table 样式）
- DropdownMenu 配合操作列
- Pagination / Button 配合分页
- Checkbox 配合选择

**典型 dashboard 一张表格 50-100 行代码**。
-->

---
transition: fade-out
---

# Sidebar —— 完整方案而非单组件

shadcn 最具野心的「整套解决方案」

<v-click>

```tsx
<SidebarProvider>
  <Sidebar collapsible="icon" variant="sidebar">
    <SidebarHeader>Logo</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard"><LayoutDashboard /> Dashboard</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
  <SidebarInset><SidebarTrigger /><main>{children}</main></SidebarInset>
</SidebarProvider>
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Sidebar 是 shadcn 2024-12 的明星更新** —— 一组协作的子组件，不是单个 `<Sidebar />`。

**11 个子组件**：

- **SidebarProvider**：context 顶层，管理 open / mobile 状态
- **Sidebar**：主面板（collapsible="offcanvas" / "icon" / "none" 三模式）
- **SidebarHeader / SidebarFooter**：sticky 顶/底部
- **SidebarContent**：滚动主区
- **SidebarGroup / SidebarGroupLabel / SidebarGroupContent / SidebarGroupAction**：分组
- **SidebarMenu / SidebarMenuItem / SidebarMenuButton**：菜单项
- **SidebarMenuSub / SidebarMenuSubItem / SidebarMenuSubButton**：子菜单
- **SidebarMenuAction**：菜单项的右侧按钮
- **SidebarMenuBadge**：徽章数字
- **SidebarTrigger**：toggle 按钮（默认快捷键 ⌘B / Ctrl+B）
- **SidebarRail**：可拖拽边缘调宽
- **SidebarInset**：主内容区 wrapper（用 inset variant 时）

**variant props**：
- `"sidebar"`（默认）：标准固定栏
- `"floating"`：浮在主内容上（圆角阴影）
- `"inset"`：嵌入式（主内容凹陷感）

**collapsible props**：
- `"offcanvas"`：完全滑出隐藏
- `"icon"`：折叠成仅图标（默认）
- `"none"`：不可折叠

**响应式**：
- 桌面 → 固定边栏（可折叠 icon）
- 移动 → Sheet drawer（点 Trigger 滑入）
- 自动判断（`isMobile` from `useSidebar`）

**状态持久化 —— cookies**：
- 默认通过 cookies 保存 open/collapsed 状态
- SSR 时读取，避免 hydration 闪烁
- `<SidebarProvider defaultOpen={readCookie("sidebar:state")}>`

**键盘快捷键**：
- ⌘B (Mac) / Ctrl+B (Win)：toggle
- 跟 VSCode / Linear 一致

**useSidebar hook**：
```tsx
const { state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar } = useSidebar();
```
- `state`：`"expanded" | "collapsed"`
- `isMobile`：响应式判断
- 可在任何组件读 / 改

**SidebarMenuButton 用法（最常用）**：
```tsx
<SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
  <Link href="/dashboard">
    <LayoutDashboard />
    <span>Dashboard</span>
  </Link>
</SidebarMenuButton>
```
- `asChild` 转嫁给 Link（Next.js / React Router）
- `isActive` prop 控制选中态
- 自动响应 collapsible="icon"（折叠时仅显示图标）

**子菜单（嵌套）**：
```tsx
<Collapsible defaultOpen>
  <SidebarMenuItem>
    <CollapsibleTrigger asChild>
      <SidebarMenuButton>
        <Settings /> <span>Settings</span>
        <ChevronRight className="ml-auto data-[state=open]:rotate-90 transition-transform" />
      </SidebarMenuButton>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <SidebarMenuSub>
        <SidebarMenuSubItem>
          <SidebarMenuSubButton asChild>
            <Link href="/settings/general">General</Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      </SidebarMenuSub>
    </CollapsibleContent>
  </SidebarMenuItem>
</Collapsible>
```

**CSS 变量定制**：
```css
:root {
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.141 0.005 285.823);
  --sidebar-primary: oklch(0.21 0.006 285.885);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.967 0.001 286.375);
  --sidebar-accent-foreground: oklch(0.21 0.006 285.885);
  --sidebar-border: oklch(0.92 0.004 286.32);
  --sidebar-ring: oklch(0.871 0.006 286.286);
}
```

**实际使用：装个 Block 直接用**：
```bash
shadcn add sidebar-07  # 一个完整 sidebar 示例
shadcn add dashboard-01  # 整套 dashboard 含 sidebar
```

会装 11 个 sidebar.tsx 内的子组件 + 一个示例 `<AppSidebar />` 业务组件。

**RTL 支持**：
- 2026-01 加入
- `<SidebarProvider dir="rtl">` 自动镜像

**为什么 Sidebar 这么复杂**？
- 桌面 + 移动 + 折叠 + 子菜单 + 状态保持 —— 实际后台需求
- 之前每个项目自己造，差异巨大
- shadcn 提供「企业级模板」减少重复

Sidebar 是 shadcn 「Open Code」哲学的最佳例子 —— 复杂方案给你源码，你自己改。
-->

---
transition: fade-out
---

# Sonner Toast —— 替代 Radix Toast

shadcn 2024 起默认 Toast 方案

<v-click>

```tsx
// app/layout.tsx —— Toaster 放根 layout
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
  return <html><body>{children}<Toaster /></body></html>;
}
```

</v-click>

<v-click>

```tsx
// 任意业务组件
import { toast } from "sonner";

toast("Event has been created.");
toast.success("已保存");
toast.error("操作失败");
toast.promise(saveData(), { loading: "保存中", success: "成功", error: "失败" });
toast("自定义", { description: "描述", action: { label: "撤销", onClick: undo } });
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **sonner —— 取代 Radix Toast 的新标准**：

**作者**：Emil Kowalski（Vercel 设计师，也写 vaul Drawer）

**为什么 shadcn 切换**？
- Radix Toast API 复杂（多组件 + Provider + viewport）
- sonner 极简（一个 Toaster + 一个 toast() 函数）
- sonner 默认动画更精致（Linear 风）
- 自带 promise toast / action / undo 体验

**安装**：
```bash
shadcn add sonner
```

会做：
- npm 安装 `sonner` + `next-themes`
- 创建 `components/ui/sonner.tsx`（含 useTheme 适配 dark mode）

**生成的 sonner.tsx**：
```tsx
"use client";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }: React.ComponentProps<typeof Sonner>) => {
  const { theme = "system" } = useTheme();
  return (
    <Sonner
      theme={theme as "light" | "dark" | "system"}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background ...",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary",
          cancelButton: "group-[.toast]:bg-muted",
        },
      }}
      {...props}
    />
  );
};
export { Toaster };
```

自动跟 next-themes 联动 dark mode。

[click] **toast() API 完整**：

```tsx
import { toast } from "sonner";

// 基础
toast("Hello");

// 类型
toast.success("Saved");
toast.error("Failed");
toast.warning("Be careful");
toast.info("FYI");
toast.message("Default style");

// 描述
toast("Event created", {
  description: "Sunday, December 03, 2023 at 9:00 AM",
});

// 操作按钮
toast("Event created", {
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
});

// 取消按钮
toast("Event created", {
  cancel: { label: "Cancel", onClick: () => {} },
});

// Promise（自动 loading → success/error）
toast.promise(saveData(), {
  loading: "Saving...",
  success: (data) => `${data.name} saved!`,
  error: "Failed",
});

// 持久（不自动消失）
toast("Important", { duration: Infinity });

// 自定义 JSX
toast(<div>Custom <Button>Action</Button></div>);

// 关闭特定 toast
const id = toast("Loading");
toast.dismiss(id);

// 关闭所有
toast.dismiss();

// rich colors（更亮的语义色）
<Toaster richColors />
```

**Toaster 配置**：
```tsx
<Toaster
  position="top-right"        // top-left / top-center / top-right / bottom-*
  expand                       // 鼠标 hover 时全部展开
  richColors                   // 鲜艳语义色
  closeButton                  // 显示关闭按钮
  visibleToasts={5}            // 最多显示数
  toastOptions={{
    duration: 4000,
    style: { background: "red" },
  }}
/>
```

**vs Radix Toast**：
- Radix 多组件结构：Toast.Provider / Root / Title / Description / Viewport
- Sonner 一个 Toaster + 命令式 toast() 调用
- 体验明显更现代

**vs react-hot-toast**：
- 老牌 toast 库，简单场景 OK
- sonner 更精致 + 跟 shadcn 默认主题集成更好
- shadcn 选 sonner 是 2024+ 的事实标准
-->

---
transition: fade-out
---

# Chart —— Recharts 现代封装

shadcn Charts 2024 新增，最美的图表 wrapper

<v-click>

```tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile:  { label: "Mobile",  color: "var(--chart-2)" },
} satisfies ChartConfig;

const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
];

<ChartContainer config={chartConfig}>
  <BarChart data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile"  fill="var(--color-mobile)"  radius={4} />
  </BarChart>
</ChartContainer>
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **shadcn Chart 架构 —— 「不封装、只增强」**：

跟 DataTable 类似哲学：
- 不重新发明 Recharts
- 提供 ChartContainer / ChartTooltip / ChartLegend 等增强组件
- 你直接用 Recharts 的 `<BarChart><Bar />` 等原生组件

**安装**：
```bash
shadcn add chart
```

装 recharts + 创建 `components/ui/chart.tsx`。

**chartConfig 解耦**：

```tsx
const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)", icon: Monitor },
  mobile:  { label: "Mobile",  color: "var(--chart-2)", icon: Phone },
  tablet:  { label: "Tablet",  color: "var(--chart-3)" },
} satisfies ChartConfig;
```

- key 跟 data 的 key 对应（desktop / mobile）
- ChartContainer 自动生成 `var(--color-desktop)` 等 CSS Var
- 多个 Chart 可共享 config

**5 个 CSS Variables**：

```css
:root {
  --chart-1: oklch(0.646 0.222 41.116);   /* 暖橙 */
  --chart-2: oklch(0.6 0.118 184.704);    /* 蓝绿 */
  --chart-3: oklch(0.398 0.07 227.392);   /* 深蓝 */
  --chart-4: oklch(0.828 0.189 84.429);   /* 黄绿 */
  --chart-5: oklch(0.769 0.188 70.08);    /* 暖黄 */
}
.dark {
  --chart-1: oklch(0.488 0.243 264.376);  /* 紫 */
  --chart-2: oklch(0.696 0.17 162.48);    /* 青 */
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
}
```

**支持的图表类型**（Recharts 全套）：

- **Bar Chart**：柱状图（含多组 / 堆叠 / 横向）
- **Line Chart**：折线图（含曲线 / 阶梯）
- **Area Chart**：面积图（含堆叠）
- **Pie Chart**：饼图
- **Donut Chart**：环图
- **Radar Chart**：雷达图
- **Radial Chart**：径向条
- **Tooltip**：自定义提示
- **Legend**：图例
- **Brush**：缩放刷选
- **Reference Line / Reference Area**：参考线

**完整例子（Line Chart）**：

```tsx
<ChartContainer config={chartConfig} className="h-[300px]">
  <LineChart data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <YAxis tickLine={false} axisLine={false} />
    <ChartTooltip
      cursor={false}
      content={<ChartTooltipContent indicator="line" />}
    />
    <ChartLegend content={<ChartLegendContent />} />
    <Line
      dataKey="desktop"
      type="monotone"
      stroke="var(--color-desktop)"
      strokeWidth={2}
      dot={false}
    />
  </LineChart>
</ChartContainer>
```

**关键 props**：

ChartContainer：
- `config`：chartConfig 对象
- `className`：CSS（设高度）

ChartTooltipContent：
- `indicator`：`"line" | "dot" | "dashed"`
- `hideLabel` / `hideIndicator`
- `labelFormatter` / `formatter`：自定义格式
- `nameKey` / `labelKey`：覆盖 config 取值

ChartLegendContent：
- `nameKey`：显示哪个字段

**accessibilityLayer**：
```tsx
<BarChart accessibilityLayer data={chartData}>
```
- 添加键盘 / 屏幕阅读器支持
- Recharts 3.0+ 特性
- shadcn 推荐启用

**Block 整套**：
```bash
shadcn add chart-bar-multiple
shadcn add chart-line-interactive
shadcn add chart-area-stacked
```
shadcn 提供 30+ Chart Block，每个一个完整可运行示例。

**实际使用 —— Dashboard 监控**：
- Bar：收入对比
- Line：用户增长
- Area：累计数据
- Pie：占比
- Radar：能力多维度

**vs 其他图表库**：
- **Recharts**：shadcn 默认，React-first
- **Chart.js**：传统强，Vanilla JS
- **Apache ECharts**：功能最全，体积大
- **Visx**：低层（D3 包装），自由度高
- **Tremor**：另一个 React 图表库，跟 shadcn 风格类似

shadcn 选 Recharts 是均衡选择（React-first + 文档好 + 功能够）。
-->

---
transition: fade-out
---

# Blocks —— 整页模板复制

「装一个就有完整 dashboard / login 页」

<v-click>

```bash
# Dashboard 类
shadcn add dashboard-01    # Sidebar + Chart + Table + 数据卡片
shadcn add dashboard-02    # 不同布局变体

# Sidebar 类（独立的）
shadcn add sidebar-01      # 基础侧边栏
shadcn add sidebar-07      # 多分组带子菜单
shadcn add sidebar-12      # iOS 风浮动

# Login / Signup
shadcn add login-01        # 纯表单
shadcn add login-03        # 半屏图片 + 表单
shadcn add login-04        # 全屏视觉
shadcn add signup-01

# Calendar
shadcn add calendar-21     # 完整日历视图
```

</v-click>

<v-click>

> 💡 **Block ≠ Component**：Block 是「整页/区域」，装完会有多个文件（page.tsx + 多个业务组件 + 数据 mock）。

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Blocks —— shadcn 2024 起新增的「整页方案」**：

跟单 Component 区别：
- Component：单个文件，如 `button.tsx`
- Block：多文件整页方案，如 dashboard-01 包含
  - `app/dashboard/page.tsx`
  - `components/app-sidebar.tsx`
  - `components/nav-main.tsx`
  - `components/nav-projects.tsx`
  - `components/nav-user.tsx`
  - `components/team-switcher.tsx`
  - 等 10+ 业务组件

**Block 分类**（截至 2026-05）：

**Dashboard**：
- `dashboard-01`：经典侧边栏 + Chart + Table
- `dashboard-02`：替代布局
- `dashboard-03`、`dashboard-04` 等持续新增

**Sidebar**（独立）：
- `sidebar-01` 到 `sidebar-15+`，各种风格变体

**Login / Authentication**：
- `login-01`：纯表单
- `login-02`：表单 + 社交登录按钮
- `login-03`：左半屏图片，右半屏表单
- `login-04`：全屏背景视觉
- `signup-01`：注册页

**Calendar**：
- `calendar-21` 到 `calendar-29+`：不同日历视图

**Pricing**：
- `pricing-01`：标准三档价格表

**Charts**：
- `chart-bar-multiple`、`chart-line-interactive`、`chart-area-stacked` 等 30+ Chart Block

**安装命令**：

```bash
shadcn add dashboard-01
```

CLI 会：
1. 装所需组件依赖（sidebar / button / card / chart / table 等单组件）
2. 写 `app/dashboard/page.tsx`
3. 写多个业务组件到 `components/` 下
4. 写 mock 数据

**之后随便改** —— 完全是你的代码。

**为什么 Block 是核心生产力工具**？

传统流程：
1. 设计师出 dashboard 稿
2. 工程师拆解
3. 选组件 + 写布局
4. 调样式 + 状态
5. 接 mock → 真实数据
6. 总时间 1-3 天

shadcn Block 流程：
1. `shadcn add dashboard-01` ← 30 秒
2. 改 mock 数据为真实 API ← 30 分钟
3. 调业务细节 ← 几小时
4. 总时间 半天

**Block 不是「黑盒模板」** —— 装完源码是你的。
- 改色板 → 调 CSS Vars
- 改菜单 → edit `app-sidebar.tsx`
- 加业务页 → 用同样组件添加新 page

**预览方式**：
- ui.shadcn.com/blocks 在线预览
- 每个 Block 有完整 demo + 描述

**Block 命名规则**：
- 类别 + 编号：`dashboard-01` / `sidebar-07` / `login-03`
- 数字越大通常越新 / 更复杂

**新增频率**：
- shadcn 团队每月新增 5-10 个 Block
- 社区也能贡献（通过 PR）
- Vercel 的设计师参与较多

**Block 跟 Theme 配合**：
- Block 用 CSS Vars
- 你换 baseColor 整个 Block 颜色变
- 真正的「换皮」体验

**适合用 Block 的场景**：
- 新项目快速搭原型
- 后台管理「快速达到 80% 完成度」
- 学习 shadcn 最佳实践（看源码）

**不适合的场景**：
- 完全自定义设计（直接装单组件更灵活）
- 设计规范严格（需要从头）
-->

---
transition: fade-out
---

# Themes & Colors 色板

26 色板 × Light/Dark 双套，一键 copy CSS Vars

<v-click>

| 类别        | 选项                                       |
| ----------- | ------------------------------------------ |
| base color  | neutral / stone / zinc / mauve / olive 等 7 |
| theme color | red / orange / blue / violet / rose 等 17  |
| radius      | 0 / 0.25 / 0.5（默认）/ 0.75 / 1.0 rem     |

</v-click>

<v-click>

```css
/* themes 页 Click Copy 出的 CSS */
:root {
  --background: oklch(1 0 0);
  --primary: oklch(0.6 0.18 145);
  --primary-foreground: oklch(0.985 0 0);
}
.dark {
  --background: oklch(0.141 0.005 285.823);
  --primary: oklch(0.8 0.18 145);
}
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Themes 体系**：

shadcn 提供两层色彩：
- **base color**（7 选 1）：决定灰阶基础（背景/卡片/边框等中性色）
- **theme color**（17 选 1）：决定主色（primary 按钮 / 强调）

**base color 7 选项**：
- `neutral`（推荐，纯灰）
- `stone`（暖灰）
- `zinc`（标准灰，最常见）
- `mauve`、`olive`、`mist`、`taupe`（2026 新增的 Radix Colors 启发系列）

**theme color 17 选项**（完整 Tailwind / Radix 色名）：
- 红：`red`, `rose`
- 橙：`orange`, `amber`
- 黄：`yellow`, `lime`
- 绿：`green`, `emerald`, `teal`
- 青：`cyan`, `sky`
- 蓝：`blue`, `indigo`
- 紫：`violet`, `purple`, `fuchsia`
- 粉：`pink`

**ui.shadcn.com/themes 页**：
- 实时切换 base/theme/radius
- 看 dashboard 实时预览
- 点 Copy → 复制 CSS Vars 到剪贴板
- 粘贴到 `app/globals.css` 替换

**典型工作流**：
1. 浏览 themes 页选最喜欢的组合
2. Copy CSS
3. 粘贴覆盖 globals.css 的 `:root` 和 `.dark` 块
4. 整个 app 换皮完成

[click] **OKLCH 色彩空间**：

shadcn 2024-12 起从 HSL 迁移到 OKLCH：
- **L**：亮度（0-1）
- **C**：色度（饱和度，0-0.4）
- **H**：色相（0-360）

```css
--primary: oklch(0.6 0.18 145);
```

OKLCH 优势：
- **感知均匀**：L=0.5 在不同色相下亮度一致（HSL 不是）
- **更准确的对比度计算**
- **现代浏览器原生支持**（Safari 15.4+ / Chrome 111+）
- **vs HSL**：HSL 黄色和蓝色在 L=50% 时人眼感知亮度差很大

**Theme 切换实现** —— ShadcnUI 的 New York style 默认结构：

```css
/* app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.141 0.005 285.823);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --accent: oklch(0.967 0.001 286.375);
  --accent-foreground: oklch(0.21 0.006 285.885);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.92 0.004 286.32);
  --input: oklch(0.92 0.004 286.32);
  --ring: oklch(0.871 0.006 286.286);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.141 0.005 285.823);
  /* ... */
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  /* ...同名 token，dark 取值 */
}
```

**完整 token 列表（New York style）** —— 共 ~30 个：
- background / foreground
- card / card-foreground
- popover / popover-foreground
- primary / primary-foreground
- secondary / secondary-foreground
- muted / muted-foreground
- accent / accent-foreground
- destructive / destructive-foreground
- border / input / ring
- chart-1 ~ chart-5
- sidebar / sidebar-foreground / sidebar-primary / sidebar-primary-foreground / sidebar-accent / sidebar-accent-foreground / sidebar-border / sidebar-ring
- radius / radius-sm / radius-md / radius-lg / radius-xl 等

**radius 派生**：
```css
--radius-sm: calc(var(--radius) - 4px);
--radius-md: calc(var(--radius) - 2px);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) + 4px);
```
一个 base `--radius` 派生整套，改一个值整体响应。

**自定义品牌色**：
```css
:root {
  --primary: oklch(0.55 0.22 280);  /* 自定义紫色 */
  --primary-foreground: oklch(0.98 0 0);
}
```
直接改 `--primary` 即可，所有用 `bg-primary` 的组件跟着变。
-->

---
transition: fade-out
---

# Tailwind v4 + @theme inline

shadcn 配 Tailwind v4 的标准做法

<v-click>

```css
/* app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));

:root { --background: oklch(1 0 0); --primary: oklch(0.21 0 0); }
.dark { /* ... 同名 token dark 取值 */ }

@theme inline {
  --color-background: var(--background);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
}
```

</v-click>

<v-click>

```tsx
// 然后在 JSX 用 utility
<div className="bg-background text-foreground">
  <Button className="bg-primary text-primary-foreground">Click</Button>
</div>
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Tailwind v4 全套配置 —— shadcn 标准**：

Tailwind v4 关键变化：
- 没有 `tailwind.config.js` —— 配置进 CSS 文件
- `@theme` 块定义 utility class
- `@theme inline` —— 把 CSS Var 直接做成 utility（shadcn 用法）
- `@custom-variant` —— 自定义 variant（dark mode）

**@import 顺序**：
```css
@import "tailwindcss";        /* v4 主入口 */
@import "tw-animate-css";     /* shadcn 安装时装的动画 utilities */
```

`tw-animate-css` —— Bram Vermolen 出品，v4 替代 tailwindcss-animate（v3 时代）。
提供 `animate-in / animate-out / fade-in-0 / zoom-in-95` 等 Radix data-state 动画用 utility。

**@custom-variant dark**：

```css
@custom-variant dark (&:is(.dark *));
```

- 定义 `dark:` 前缀的行为
- `(&:is(.dark *))` 意思是：当祖先有 `.dark` 类时生效
- 配合 next-themes 默认 `attribute="class"` 用

**CSS Vars 定义**（前面讲过）：
- `:root` —— light 默认
- `.dark` —— dark 覆盖

**@theme inline —— 关键魔法**：

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... */
}
```

`@theme inline` 把 CSS Var 注册为 Tailwind 主题 token：
- `--color-background` → 生成 `bg-background` / `text-background` / `border-background` utility
- 自动 inline 引用 var（避免循环引用）

**为什么 inline**？

```css
/* 不用 inline */
@theme {
  --color-primary: oklch(0.21 0 0);  /* 写死值 */
}
```
→ dark mode 切换时 utility 不会变

```css
/* 用 inline */
@theme inline {
  --color-primary: var(--primary);   /* 引用变量 */
}
```
→ Tailwind 编译时 inline 这个值，dark mode 切换 `--primary` 改时 utility 跟着变

**Tailwind v4 vs v3 写法对比**：

```js
// v3 —— tailwind.config.ts
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
    },
  },
};
```

```css
/* v4 —— globals.css */
@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
}
```

v4 更简洁 + content 自动发现 + 编译更快。

[click] **使用 utility**：

```tsx
<div className="bg-background text-foreground">
  <Card className="bg-card text-card-foreground border-border">
    <Button className="bg-primary text-primary-foreground">Click</Button>
  </Card>
</div>
```

任何 `--color-*` token 都自动有：
- `bg-*` / `text-*` / `border-*` / `ring-*`
- `hover:bg-*` / `dark:bg-*` 等所有 variant

**radius 同理**：

```css
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}
```

→ `rounded-sm` / `rounded-md` / `rounded-lg` / `rounded-xl` utility 自动生成。

**Tailwind v3 升 v4 流程**：

```bash
# 1. 升 Tailwind
pnpm add tailwindcss@latest @tailwindcss/postcss

# 2. shadcn 提供迁移工具
pnpm dlx shadcn@latest migrate tailwind-v4

# 3. 删 tailwind.config.ts
# 4. globals.css 改成 v4 格式
# 5. 验证：pnpm dev
```

shadcn migrate 会：
- 把 `tailwind.config.ts` 内容转到 `@theme` 块
- 把 `hsl(var(--xxx))` 换成 `var(--xxx)`（CSS Var 直接放 utility）
- 把 dark mode 配置改成 `@custom-variant`
- 提示需要手动确认的部分

**v4 + OKLCH + CSS Var 三件套是 shadcn 现代化标志**。
-->

---
transition: fade-out
---

# Dark Mode —— next-themes 集成

shadcn 标准 Dark Mode 方案

<v-click>

```tsx
// providers.tsx —— pnpm add next-themes
"use client";
import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
```

</v-click>

<v-click>

```tsx
// app/layout.tsx —— suppressHydrationWarning 避免 mismatch
<html lang="en" suppressHydrationWarning>
  <body><Providers>{children}</Providers></body>
</html>

// ModeToggle 按钮
const { theme, setTheme } = useTheme();
<Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} />
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **next-themes —— shadcn 默认 dark mode 方案**：

**作者**：Pacheco（Vercel），同 Vercel 生态。

**为什么用 next-themes**？
- SSR-safe（避免 hydration mismatch）
- system 模式（跟随操作系统）
- 持久化（localStorage）
- 跨 tab 同步
- 零闪烁（initialization 在 head 内联 script）

**安装**：
```bash
pnpm add next-themes
```

shadcn 安装 sonner / 某些组件时会自动装。

**Providers 设置**：

```tsx
// app/providers.tsx
"use client";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"        // 给 html 加 class（如 class="dark"）
      defaultTheme="system"    // 默认跟随系统
      enableSystem             // 启用 system 模式
      disableTransitionOnChange // 切换时关 transition（防闪烁）
    >
      {children}
    </ThemeProvider>
  );
}
```

**attribute props**：
- `"class"` —— 加 `class="dark"` 或 `class="light"`
- `"data-theme"` —— 加 `data-theme="dark"`
- shadcn 推荐 `class` —— 配 Tailwind v4 的 `@custom-variant dark (&:is(.dark *))`

**defaultTheme props**：
- `"system"` —— 跟系统
- `"light"` / `"dark"` —— 强制
- `"system"` 是最佳实践

**enableSystem props**：
- `true` —— 允许 system 模式（用 `prefers-color-scheme` media query）
- `false` —— 只允许 light/dark 切换

**disableTransitionOnChange**：
- 切主题时所有 transition 暂时关闭
- 防止「色彩跳变」闪烁
- 强烈推荐 `true`

[click] **app/layout.tsx 配置**：

```tsx
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
```

**suppressHydrationWarning** 关键：
- next-themes 在 client init 时改 html className
- 第一次 SSR HTML 没有 `class="dark"`，client 加上时 React 会警告 hydration mismatch
- 这个 prop 告诉 React「html 这层 mismatch 是预期的」

**ModeToggle 组件**：

```tsx
"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

**useTheme hook**：

```tsx
const { theme, setTheme, themes, resolvedTheme, systemTheme } = useTheme();

// theme：用户选的（light / dark / system）
// resolvedTheme：实际生效的（system 解析为 light 或 dark）
// systemTheme：当前系统模式
// themes：支持的列表
```

**注意点**：

1. **避免 SSR 读 theme**：
```tsx
// ❌ 错误：SSR 时 theme 是 undefined
{theme === "dark" ? <DarkLogo /> : <LightLogo />}

// ✅ 用 useEffect + state 等 mount 后
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;
```

2. **跨多框架**：
- Next.js：完美支持（next-themes 同名出品）
- Vite / Remix / Astro：也能用，参考 shadcn 各框架 dark mode 文档

3. **跟 sonner Toast 联动**：
- sonner.tsx 内部已经 useTheme，自动跟 dark mode
- 不需要额外配

4. **第一次切换闪烁**：
- 多数因为 transition 没禁
- 加 `disableTransitionOnChange` 解决

**最终效果**：
- 用户点 ModeToggle → setTheme("dark")
- next-themes 给 `<html>` 加 `class="dark"`
- CSS `.dark { --background: ... }` 生效
- Tailwind `dark:` variant 触发
- 整 app 立即换皮
- 状态写入 localStorage 持久
- 刷新页面 / 跨 tab 同步
-->

---
transition: fade-out
---

# MCP Server —— AI 原生集成

Claude Code / Cursor / VS Code 自然语言装组件

<v-click>

```bash
# 一键配置 MCP（claude / cursor / vscode）
pnpm dlx shadcn@latest mcp init --client claude

# 生成 .mcp.json（手动等价）
{
  "mcpServers": {
    "shadcn": { "command": "npx", "args": ["shadcn@latest", "mcp"] }
  }
}
```

</v-click>

<v-click>

**AI 助手可以做**

- 「显示 shadcn 注册表中的所有组件」→ MCP list
- 「添加 Button、Dialog、Form 到我的项目」→ MCP add
- 「用 shadcn 组件做个联系表单」→ MCP add + 生成代码
- 跨多 Registry 搜索 / 私有 Registry 也通

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **MCP Server（Model Context Protocol）—— shadcn 2025-08 新增**：

**MCP 是什么**？
- Anthropic 提的开放协议
- 让 AI 助手（Claude / Cursor / VS Code Copilot Chat）原生「连接外部服务」
- 不是 RAG，是 tool calling

**shadcn MCP Server 暴露的 tools**：
- `list_registries`：列出已配置的 registries
- `list_components`：列出组件
- `view_component`：查看源码
- `add_component`：安装组件
- `search`：跨 Registry 搜索
- `get_block`：拿 Block 模板
- `get_docs`：查文档

**配置 Claude Code**：

```bash
pnpm dlx shadcn@latest mcp init --client claude
```

CLI 自动写 `.mcp.json`：
```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

重启 Claude Code → 看到 shadcn server 已连接。

**配置 Cursor**：
```bash
pnpm dlx shadcn@latest mcp init --client cursor
```
写 `.cursor/mcp.json`，然后 Cursor 设置里启用。

**配置 VS Code**：
```bash
pnpm dlx shadcn@latest mcp init --client vscode
```
写 `.vscode/mcp.json`，打开文件点 Start。

[click] **AI 助手实际能做的事**：

**1. 自然语言查组件**：
```
> 显示 shadcn 注册表中所有跟 form 相关的组件
```
AI 调用 `search` → 列出 Form / Input / Select / Checkbox 等。

**2. 自然语言装组件**：
```
> 添加 Button、Dialog 和 Form 组件到我的项目
```
AI 调用 `add_component` × 3 → 完成安装。

**3. 自然语言搭页面**：
```
> 用 shadcn 组件创建一个联系我们的表单（姓名 + 邮箱 + 消息）
```
AI 一步流程：
- search 找到 form / input / textarea / button
- add 安装
- 写 `app/contact/page.tsx`
- 用 zod schema + RHF + Form 组合

**4. Block 安装**：
```
> 给我一个完整的 dashboard 页面
```
AI 调用 `add_component dashboard-01` → 整套装好。

**5. 私有 Registry**：
- 你公司有 `@acme/...` 私有 Registry
- 配置到 components.json 的 `registries` 字段
- MCP 自动可访问
- 「装公司的 acme-button」AI 也能搞

**MCP 价值**：
- 减少「查文档」步骤 —— AI 直接知道有哪些组件
- 减少「写命令」步骤 —— 自然语言代替 CLI
- 减少「拼接代码」步骤 —— AI 生成完整文件

**vs 单独 LLM**：
- 单 LLM 只能基于训练数据
- MCP + 当前 Registry → 实时最新数据

**vs Codex / Copilot**：
- Codex / Copilot 在 IDE 内补全代码
- MCP 让 AI 助手「操作」组件库（不仅是写代码，还能装）

**实际工作流（2026 推荐）**：
1. 初始化项目：`shadcn init`
2. 配 MCP：`shadcn mcp init --client claude`
3. 用 Claude 自然语言开发：「帮我搭 dashboard」
4. AI 装组件 + 写业务代码 + 解释设计

**MCP 是 shadcn 「AI-Ready」哲学的具体体现**。

**安全注意**：
- MCP 本地运行（你的机器）
- 不传源码到外部
- 私有 Registry 的 auth header 在你 `.mcp.json` 里
- 生产环境不暴露 MCP 端口
-->

---
transition: fade-out
---

# Registry —— 私有分发体系

任何 JSON URL 都能当组件源

<v-click>

```json
// registry.json —— 你的组件源描述
{
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [{
    "name": "acme-button",
    "type": "registry:component",
    "files": [{ "path": "components/ui/acme-button.tsx", "type": "registry:component" }],
    "registryDependencies": ["button"],
    "dependencies": ["class-variance-authority"],
    "cssVars": { "light": { "--acme": "#FF6B35" } }
  }]
}
```

</v-click>

<v-click>

```bash
# 构建 + 安装
shadcn build                                # 编译成 public/r/*.json
shadcn add https://acme.com/r/acme-button.json  # 客户端安装
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Registry —— shadcn 2024+ 最重要的扩展能力**：

**Registry 是什么**？
- 一组组件源码 + 元数据的 JSON schema
- 一个 URL → 一组组件
- shadcn CLI 拉取 + 装

**官方 Registry**：
- `https://ui.shadcn.com/r/`
- 提供 70+ 内置组件
- shadcn add button 默认从这拉

**Universal Registry**（2025-07 起）：
- 任何公网 / 私网 JSON URL 都能当 Registry
- `shadcn add https://my-registry.com/r/my-component.json`
- 不需要发布 npm 包

**Registry 结构**：

```
my-registry/
├─ registry.json                    ← 源描述（构建前）
├─ registry/                        ← 组件源码
│   ├─ acme-button.tsx
│   └─ acme-card.tsx
└─ public/r/                        ← 构建产物（CLI add 时拉取的）
    ├─ acme-button.json
    └─ acme-card.json
```

[click] **registry.json 字段**：

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [
    {
      "name": "acme-button",
      "type": "registry:component",      // 类型
      "title": "Acme Button",
      "description": "...",
      "files": [
        {
          "path": "components/ui/acme-button.tsx",
          "type": "registry:component"
        }
      ],
      "registryDependencies": ["button"],  // 依赖其他 shadcn 组件
      "dependencies": ["lucide-react"],    // 依赖 npm 包
      "devDependencies": [],
      "cssVars": {
        "light": { "--acme": "#FF6B35" },
        "dark":  { "--acme": "#FF8C5A" }
      },
      "tailwind": {
        "config": { /* 老版 v3 */ }
      },
      "categories": ["form"]
    }
  ]
}
```

**type 枚举**：
- `registry:component` —— 单组件
- `registry:block` —— 整页 Block
- `registry:hook` —— 自定义 hook
- `registry:lib` —— utility 库
- `registry:page` —— 完整页面
- `registry:file` —— 任意文件（rules / config）
- `registry:style` —— 主题 CSS
- `registry:theme` —— 整套主题

**registryDependencies**：
- 列出依赖的其他组件（自动一起装）
- 可以是组件名（`["button", "card"]`）
- 也可以是 URL（`["https://other-registry.com/r/foo.json"]`）

**dependencies**：
- npm 包列表
- CLI add 时自动 npm install

**cssVars**：
- 装这个组件时自动注入到 globals.css 的 :root / .dark

**构建 Registry**：

```bash
shadcn build
# 输入：registry.json
# 输出：public/r/acme-button.json
```

每个 item 编译成单独 JSON 文件，包含组件源码内联（base64 或纯文本）。

**部署**：
- 把 `public/r/` 部署到任意 CDN / 静态托管
- Vercel / Netlify / Cloudflare Pages 都行
- 公开 URL → 客户端 add

[click] **安装他人 Registry**：

```bash
shadcn add https://acme.com/r/acme-button.json
```

CLI：
1. 拉 JSON
2. 解析 dependencies → npm install
3. 解析 registryDependencies → 递归拉
4. 解析 cssVars → 注入 globals.css
5. 写 files 到本地

**私有 Registry（auth）**：

components.json 里配置：
```json
{
  "registries": {
    "acme": {
      "url": "https://internal.acme.com/r/{name}.json",
      "headers": {
        "Authorization": "Bearer ${ACME_TOKEN}"
      }
    }
  }
}
```

环境变量 `${ACME_TOKEN}` 从 `.env.local` 或系统读。

**Namespace**：
- 可以给 Registry 起 namespace：`@acme/...`
- `shadcn add @acme/button` → 用 namespace 配置的 URL 拉

**Registry 价值**：

1. **企业内部分发**：
- 设计系统 component 共享
- 不发 npm（依赖管理麻烦）
- shadcn add 像装公开组件一样

2. **多人协作**：
- 团队自定义组件统一来源
- 一处修改，其他项目 `shadcn add` 更新

3. **第三方生态**：
- magicui.design / aceternity.com / kibo-ui.com / tweakcn 等 shadcn 社区 registry
- 直接 `shadcn add <URL>` 即可

**生态例子**：
- **Magic UI**：动效组件库（基于 shadcn 风格）
- **Aceternity UI**：高级动效组件
- **Kibo UI**：扩展组件集
- **TweakCN**：主题预设 Registry
- **Origin UI**：扩展组件

「Registry as Distribution」是 shadcn 「Distribution」哲学的核心实现。
-->

---
transition: fade-out
---

# Monorepo 集成

apps/web + packages/ui 拆分，Turborepo 加持

<v-click>

```bash
# 一键创建 monorepo（含 Turborepo + pnpm workspace）
pnpm dlx shadcn@latest init --monorepo
```

</v-click>

<v-click>

```text
my-monorepo/
├─ apps/
│   └─ web/
│       ├─ app/
│       └─ components.json         ← aliases 指向 @workspace/ui
├─ packages/
│   └─ ui/
│       ├─ src/
│       │   ├─ components/ui/      ← shadcn 组件源
│       │   ├─ lib/utils.ts
│       │   └─ styles/globals.css
│       └─ components.json         ← aliases 指向自己 (src/)
├─ turbo.json
└─ pnpm-workspace.yaml
```

</v-click>

<v-click>

```tsx
// apps/web/app/page.tsx
import { Button } from "@workspace/ui/components/button";
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **shadcn Monorepo 集成（2024-12 起官方支持）**：

**一键创建**：
```bash
pnpm dlx shadcn@latest init --monorepo
```

CLI 生成：
- Turborepo 监管（turbo.json）
- pnpm workspace（pnpm-workspace.yaml）
- apps/web（Next.js / Vite / Astro / 你选）
- packages/ui（共享 UI 包）
- 两个 components.json（apps/web 和 packages/ui 各自一份）

[click] **目录结构**：

```text
my-monorepo/
├─ apps/
│   ├─ web/                  ← 你的应用
│   │   ├─ app/
│   │   │   ├─ layout.tsx
│   │   │   └─ page.tsx
│   │   ├─ components.json
│   │   ├─ next.config.js
│   │   └─ package.json
│   └─ docs/                 ← 可选第二个 app
├─ packages/
│   └─ ui/                   ← 共享组件包
│       ├─ src/
│       │   ├─ components/
│       │   │   └─ ui/       ← shadcn 装的组件在这
│       │   │       ├─ button.tsx
│       │   │       └─ ...
│       │   ├─ lib/
│       │   │   └─ utils.ts  ← cn() 函数
│       │   ├─ hooks/
│       │   └─ styles/
│       │       └─ globals.css ← Tailwind v4 + CSS Vars
│       ├─ components.json
│       └─ package.json      ← name: "@workspace/ui"
├─ turbo.json
└─ pnpm-workspace.yaml
```

**apps/web/components.json**：
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "../../packages/ui/src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@workspace/ui/components",
    "ui": "@workspace/ui/components",
    "lib": "@workspace/ui/lib",
    "hooks": "@workspace/ui/hooks",
    "utils": "@workspace/ui/lib/utils"
  }
}
```

关键：
- `tailwind.css` 指向共享包的 globals.css
- aliases 都指向 `@workspace/ui/...`（workspace 协议）

**packages/ui/components.json**：
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks",
    "utils": "@/lib/utils"
  }
}
```

关键：
- `tailwind.css` 指向自己的 globals.css
- aliases 用 `@/` 本地 prefix（src/ 内）

**两个 components.json 必须一致**：
- `style`
- `iconLibrary`
- `baseColor`
- `cssVariables`

**packages/ui/package.json**：
```json
{
  "name": "@workspace/ui",
  "type": "module",
  "exports": {
    "./components/*": "./src/components/*.tsx",
    "./lib/*": "./src/lib/*.ts",
    "./hooks/*": "./src/hooks/*.ts",
    "./styles/*": "./src/styles/*.css"
  },
  "imports": {
    "#components/*": "./src/components/*.tsx"
  }
}
```

[click] **添加组件 —— CLI 智能路由**：

```bash
# 在 apps/web 目录跑
cd apps/web
pnpm dlx shadcn@latest add button
```

CLI 自动判断：
- `button` 是 Registry 组件 → 写入 `packages/ui/src/components/ui/button.tsx`
- 而不是 `apps/web/components/`

如果装 Block（如 dashboard-01）：
- Block 是页面级 → 写入 `apps/web/app/dashboard/page.tsx`
- 组件依赖（button / sidebar 等）→ 写入 `packages/ui/`

**Turborepo 集成**：

turbo.json：
```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": { "dependsOn": ["^lint"] }
  }
}
```

**pnpm-workspace.yaml**：
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**dependencies 管理**：

apps/web/package.json：
```json
{
  "dependencies": {
    "@workspace/ui": "workspace:*",
    "next": "...",
    "react": "..."
  }
}
```

packages/ui/package.json：
```json
{
  "dependencies": {
    "radix-ui": "...",
    "class-variance-authority": "...",
    "lucide-react": "..."
  },
  "peerDependencies": {
    "react": "^19",
    "react-dom": "^19"
  }
}
```

**Tailwind v4 配置**：
- packages/ui 的 globals.css 是「真理之源」
- apps/web 的 layout.tsx import 它：
  ```tsx
  import "@workspace/ui/styles/globals.css";
  ```

**好处**：

1. **一处定义 多处使用**：UI 包改一处，所有 apps 跟着变
2. **设计系统统一**：CSS Vars / 组件源代码 / theme 一致
3. **构建优化**：Turborepo 缓存共享
4. **多产品线**：同一公司多 SaaS 共享 UI

**业界标准 monorepo 工具组合**：
- **pnpm**：包管理 + workspace
- **Turborepo**：build pipeline + 缓存
- **TypeScript Project References**：类型跨包
- **shadcn 4.x monorepo**：UI 共享

Vercel / Linear / Resend / Cal.com 等头部产品都用类似结构。
-->

---
transition: fade-out
---

# Next.js App Router 集成

RSC / Server Actions / "use client" 边界

<v-click>

```tsx
// app/layout.tsx (Server Component)
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><Providers>{children}<Toaster /></Providers></body>
    </html>
  );
}
```

</v-click>

<v-click>

```tsx
// components/ui/dialog.tsx —— shadcn 自动加 "use client"
"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";

// app/page.tsx (Server) → import client component 是 OK 的
export default async function Page() {
  const data = await fetchData();
  return <Dialog>...</Dialog>;
}
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **Next.js App Router + shadcn 关键点**：

**1. RSC 模式（默认）**：
- `components.json` 设 `"rsc": true`
- shadcn add 生成的组件文件顶部自动加 `"use client"`
- 因为 90% 组件有 useState / useContext / event handler，必须 client

**2. layout.tsx 是 Server Component**：
- 不能写 useState / useEffect
- 但可以 import client component（自动 client boundary）
- import "./globals.css" 加载 Tailwind + CSS Vars
- `<Toaster />` 是 client（sonner.tsx 内有 "use client"）

**3. Server Component 内可以用 shadcn**：
```tsx
// app/page.tsx —— Server Component
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function Page() {
  const data = await db.query.users.findMany();  // Server 端 query
  return (
    <Card>
      <h1>{data.length} users</h1>
      <Button>Click</Button>  {/* Button 是 client，但被 Server 引用没问题 */}
    </Card>
  );
}
```

Server Component import client component 是合法的（React 19 + Next.js 15）。

[click] **"use client" boundary 规则**：

- 顶层 `app/page.tsx` 默认 Server
- import 一个有 `"use client"` 的组件 → 该组件以下都是 client
- shadcn 组件全部 `"use client"`（因为有 Radix state）
- 客户端组件不能 import Server Component（反向）

**例外**：纯展示组件可以无 `"use client"`：
- Card / Badge / Avatar / Separator（如果不用 state）
- shadcn 还是给加了，统一
- 不影响功能，bundle 略大

**4. Server Actions + shadcn Form**：

```tsx
// app/users/page.tsx —— Server Component
import { CreateUserForm } from "./create-form";
export default function Page() {
  return <CreateUserForm />;
}

// app/users/create-form.tsx —— Client
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUser } from "./actions";  // ← Server Action

const schema = z.object({ name: z.string().min(2) });

export function CreateUserForm() {
  const form = useForm({ resolver: zodResolver(schema) });
  
  async function onSubmit(values) {
    const res = await createUser(values);  // ← Server 端执行
    if (res.error) form.setError("name", { message: res.error });
    else router.push("/users");
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* ... */}
      </form>
    </Form>
  );
}

// app/users/actions.ts —— Server
"use server";
export async function createUser(values: { name: string }) {
  // 数据库操作
  return { success: true };
}
```

**5. 字体集成**：

```tsx
// app/layout.tsx
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

<html className={geist.variable}>
```

```css
/* globals.css */
@theme inline {
  --font-sans: var(--font-sans);
}
```

→ Tailwind `font-sans` utility 用上 Geist 字体。

**6. Image 优化**：
- shadcn Avatar 内部用 `<img>`，不是 next/image
- 如果要 next/image，自己 fork 改

**7. Metadata API**：
- 跟 shadcn 无关，标准 Next.js
- 在 layout.tsx 或 page.tsx export `metadata` 对象

**8. 性能注意**：
- shadcn 组件全 client → 整 app client-heavy 是常态
- 用 Next.js 14+ 的 React Server Components 跑 Server-only fetch
- shadcn 仍能在 Server Component 内被引用（client boundary 隔离）
- 不需要也不应该把所有组件改 Server

**Vercel 推荐架构**：
- Page = Server（fetch / metadata）
- 业务区块 = Server（组合多个 client UI）
- 交互组件 = Client（shadcn 全套）
- API 路由 / Server Actions = Server only
-->

---
transition: fade-out
---

# 踩坑 #1 —— Hydration / RSC / asChild

shadcn + Next.js 最常见的 5 个错

<v-click>

**Hydration mismatch（dark mode）**：next-themes 改 html className 触发警告。

```tsx
// ✅ html 加 suppressHydrationWarning
<html lang="en" suppressHydrationWarning>
```

</v-click>

<v-click>

**"createContext is not a function"**：Server Component 直接用 shadcn 组件。

```tsx
// ❌ Server Component 内用 useState 组件
import { Dialog } from "@/components/ui/dialog";  // 没 "use client" 包裹

// ✅ 在 client wrapper 或 page.tsx 中用（shadcn 组件已带 "use client"）
```

</v-click>

<v-click>

**asChild 双 children**：

```tsx
// ❌ asChild 必须唯一子节点
<Button asChild><Icon /><span>Text</span></Button>

// ✅ 包一层
<Button asChild><a href="/"><Icon /><span>Text</span></a></Button>
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **踩坑 #1 — Hydration mismatch（next-themes 引起）**：

**现象**：
```
Warning: Extra attributes from the server: class
```

**原因**：
- SSR 时 html className 为空
- client init 时 next-themes 加 `class="dark"`
- React 检测到 mismatch 报错

**解决**：
```tsx
<html lang="en" suppressHydrationWarning>
```

`suppressHydrationWarning` 告诉 React 这一层 mismatch 是预期的 —— 只对 `<html>` 元素一层有效，不影响子组件检测。

[click] **踩坑 #2 — "createContext is not a function"**：

**现象**：
```
TypeError: (0 , react__WEBPACK_IMPORTED_MODULE_0__.createContext) is not a function
```

**原因**：
- React Server Component 不支持 createContext / useState 等
- shadcn 组件内部用 Radix（含 createContext）
- 在 Server 端跑 → 炸

**解决**：
- shadcn add 默认会加 `"use client"` 到组件文件顶部
- 检查 `components/ui/*.tsx` 第一行是否有 `"use client"`
- 没有 → 加上

**预防**：
- components.json 设 `"rsc": true`
- shadcn add 时会自动加 `"use client"`

**自己写的 wrapper**：
```tsx
// components/my-modal.tsx
"use client";  // ← 自己写的 wrapper 也要加
import { Dialog } from "@/components/ui/dialog";

export function MyModal({ open, ... }) {
  // useState 等也在这层
}
```

[click] **踩坑 #3 — asChild 双 children**：

```tsx
// ❌ 报错：asChild must have a single child
<Button asChild>
  <Icon />
  <span>Text</span>
</Button>
```

**解决**：
```tsx
// 包一层（用 a / Link / button 等）
<Button asChild>
  <Link href="/">
    <Icon />
    <span>Text</span>
  </Link>
</Button>
```

**其他场景**：
- DialogTrigger / PopoverTrigger / DropdownMenuTrigger / TooltipTrigger 等都同样规则
- Tabs.Trigger / Toggle.Group.Item 等也是

**踩坑 #4 — 第三方组件用 asChild 失败**：

```tsx
// ❌ 第三方组件不 forwardRef
<DialogTrigger asChild>
  <SomeThirdPartyButton>Open</SomeThirdPartyButton>
</DialogTrigger>
// "Function components cannot be given refs"
```

**解决**：
- 第三方组件需要 forwardRef + props 透传
- Next/Link、React Router Link、自有 forwardRef 组件都 OK
- 不行的话用 div + onClick：
  ```tsx
  <DialogTrigger asChild>
    <div role="button" tabIndex={0}><SomeButton /></div>
  </DialogTrigger>
  ```

**踩坑 #5 — RSC 内用 onClick**：

```tsx
// ❌ Server Component 不能传 event handler
export default function Page() {  // Server
  return <Button onClick={() => alert("hi")}>Click</Button>;
}
// "Event handlers cannot be passed to Client Component props"
```

**解决**：
```tsx
// ✅ 把交互区抽成 client 组件
// click-button.tsx
"use client";
import { Button } from "@/components/ui/button";
export function ClickButton() {
  return <Button onClick={() => alert("hi")}>Click</Button>;
}

// page.tsx (Server)
import { ClickButton } from "./click-button";
export default function Page() {
  return <ClickButton />;
}
```

或用 Server Actions（form action）：
```tsx
async function doThing() {
  "use server";
  // server logic
}

<form action={doThing}>
  <Button type="submit">Submit</Button>
</form>
```

Server Actions 可以传给 client `<form action>`，shadcn Button 配合 `<form>` 自然支持。
-->

---
transition: fade-out
---

# 踩坑 #2 —— Tailwind / className 冲突

样式层面的常见坑

<v-click>

**Tailwind class 不生效**：v4 content 自动发现，但 monorepo 跨包要确保引到。

```css
/* packages/ui/src/styles/globals.css */
@import "tailwindcss";
@source "../../apps/web";        /* v4 显式 source 关键 */
@source "../../packages/ui/src";
```

</v-click>

<v-click>

**className 覆盖失败**：忘了用 cn() + tailwind-merge。

```tsx
// ❌ 字符串拼接，后面 className 不能覆盖前面
<div className={`bg-red-500 ${props.className}`}>

// ✅ 用 cn() 自动 tailwind-merge 去重
<div className={cn("bg-red-500", props.className)}>
```

</v-click>

<v-click>

**Tailwind v3 → v4 升级炸**：`hsl(var(--xxx))` 写法 v4 不再需要。

```bash
pnpm dlx shadcn@latest migrate tailwind-v4
```

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **踩坑 #6 — Tailwind class 不生效（monorepo 跨包扫描）**：

**现象**：apps/web 里写的 className 没样式，但同样 class 在 packages/ui 内可以。

**原因**：
- Tailwind v4 默认自动 content 发现
- 但 monorepo 跨包时只扫描自己 package 内的文件
- packages/ui 的 globals.css 是真理之源 → 它只扫 packages/ui 自己

**解决**：
```css
/* packages/ui/src/styles/globals.css */
@import "tailwindcss";
@source "../../../apps/web";       /* 显式指向 apps/web */
@source "../../../apps/docs";      /* 再加 apps/docs */
```

`@source` 是 Tailwind v4 新指令，告诉编译器额外扫描哪些目录。

**或者 apps/web 独立有自己的 globals.css**（不共享）—— 但失去主题统一。

[click] **踩坑 #7 — className 覆盖失败**：

```tsx
// 你想覆盖 shadcn Button 默认的 bg-primary
<Button className="bg-purple-500">Custom</Button>
```

**现象**：bg-purple 不生效，还是 primary 颜色。

**原因**：
- shadcn Button 内部已经 `cn()` 合并
- cn() = clsx + tailwind-merge
- tailwind-merge 知道 `bg-primary` 跟 `bg-purple-500` 同组 → 后者赢

实际应该生效。如果不生效，常见原因：
- 你自己写的 wrapper 没用 cn()：
  ```tsx
  // ❌ 字符串拼接，CSS 加载顺序决定，不稳定
  function MyDiv({ className }) {
    return <div className={`bg-red-500 ${className}`} />;
  }
  
  // ✅ cn() 保证覆盖
  function MyDiv({ className }) {
    return <div className={cn("bg-red-500", className)} />;
  }
  ```

**tailwind-merge 版本**：
- tailwind-merge v3+ 支持 Tailwind v4
- 旧 v2 跟 v4 的新 utility 可能识别不对
- 升级：`pnpm update tailwind-merge`

[click] **踩坑 #8 — Tailwind v3 → v4 升级**：

**现象**：升 Tailwind v4 后，整 app 颜色全没了。

**原因**：
- v3 写法 `--primary: 222.2 84% 4.9%` + `bg-primary { background: hsl(var(--primary)) }`
- v4 写法 `--primary: oklch(0.21 0 0)` + `@theme inline { --color-primary: var(--primary) }`
- v3 配置文件没了，但 CSS 仍是 v3 格式 → 不识别

**解决**：
```bash
# shadcn 自带 migrate
pnpm dlx shadcn@latest migrate tailwind-v4
```

migrate 做的事：
1. 删除 tailwind.config.ts
2. 把 globals.css 改成 v4 格式
3. 把 `hsl(var(--xxx))` 改成 `var(--xxx)`
4. 用 `@theme inline` 注册 token
5. 用 `@custom-variant dark` 替代 `darkMode: ["class"]`
6. 升级所有 shadcn 组件文件（如 className 内 `bg-[hsl(var(--primary))]` 改 `bg-primary`）

**踩坑 #9 — Portal z-index**：

```tsx
// Dialog 出现在某些元素下方
<header className="sticky top-0 z-50">...</header>  
<Dialog>...</Dialog>  {/* Portal 到 body 末尾，z-index 没设 */}
```

**解决**：shadcn Dialog 默认有 `z-50`，但你 sticky header 也用 `z-50` 时可能冲突。

- 调 header `z-40`
- 或调 Dialog 高一档（改 `components/ui/dialog.tsx` 源码）

**踩坑 #10 — 动画失效（缺 tw-animate-css）**：

```
data-[state=open]:animate-in data-[state=open]:fade-in-0
```

不生效 → 没装 `tw-animate-css`。

**解决**：
```bash
pnpm add tw-animate-css
```

`app/globals.css`：
```css
@import "tailwindcss";
@import "tw-animate-css";  /* ← 加这行 */
```

shadcn init 默认装 + import，但手动配置项目可能漏。

**踩坑 #11 — 字体没 import**：

```css
@theme inline {
  --font-sans: var(--font-geist-sans);
}
```

但 layout.tsx 没 import 字体 → 用回浏览器默认。

**解决**：
```tsx
import { Geist } from "next/font/google";
const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
<html className={geist.variable}>
```

**踩坑 #12 — 升级 shadcn 后组件不一致**：

新加的组件用 New York 4.x，老组件还是 3.x 写法。

**解决**：
```bash
shadcn add --all --overwrite
```
全量重生成（覆盖你的修改 —— 先 git diff 备份）。

或者 cherry-pick：
```bash
shadcn diff button  # 看本地 vs 最新
shadcn add button --overwrite  # 单组件升
```

**踩坑 #13 — Dialog 内表单 onSubmit 不触发**：

Dialog Portal 渲染到 body 外，form 失去 context。

**解决**：表单写在 Dialog.Content 内 + onSubmit 在 form 上（不在 Dialog 上）：
```tsx
<Dialog>
  <DialogContent>
    <form onSubmit={handleSubmit}>
      <input />
      <Button type="submit">Save</Button>
    </form>
  </DialogContent>
</Dialog>
```

**踩坑 #14 — Sidebar SSR 闪烁**：

刷新页面时 sidebar 状态先展开再折叠（或反之）。

**解决**：用 cookies 持久化 + SSR 读：
```tsx
import { cookies } from "next/headers";

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>...</SidebarProvider>
  );
}
```
shadcn Block dashboard-01 已经做了 —— 装完直接有这个逻辑。
-->

---
transition: fade-out
---

# 下一步学习路径

入门 / 进阶 / 精通三阶段

<v-click>

**入门（1-2 周）**：Next.js + shadcn init / 跑通 Button / Dialog / Form / 理解 cva + cn + asChild 三件套 / 装 Block dashboard-01 + 改 mock 数据

</v-click>

<v-click>

**进阶（1 月）**：吃透 Form (RHF+zod) / DataTable (TanStack Table) / Sidebar 完整方案 / 自定义品牌色（Themes 页 copy CSS Vars）/ 接 next-themes Dark Mode / 配 MCP Server 让 AI 协作

</v-click>

<v-click>

**精通（持续）**：自建 Registry（公司私有组件分发）/ 设计系统抽象（业务 wrapper 在 components/ 而非 ui/）/ 跟进 Radix 源码（理解 Slot / Compound 实现）/ monorepo 多 apps 共享 UI 包

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **入门 1-2 周**：

目标 —— 跑通一个 shadcn 项目，写出现代 SaaS 后台。

推荐路径：

1. **Next.js + shadcn init**：
   ```bash
   pnpm create next-app@latest my-app
   cd my-app
   pnpm dlx shadcn@latest init
   ```
   - 跟着 CLI 提示走（选 new-york / neutral / cssVariables yes）
   - 看 globals.css 生成的 CSS Vars 结构
   - 看 lib/utils.ts 的 cn() 实现

2. **装基础组件 + 用**：
   ```bash
   shadcn add button card input dialog form sonner
   ```
   - 在 page.tsx 用 Button / Card 搭基础布局
   - 用 Form 做一个登录表单（RHF + zod）
   - 用 Dialog 做一个新建条目
   - 用 sonner toast 提示

3. **理解三件套**：
   - **cva**：看 button.tsx 内 `cva("base", { variants })` 怎么写
   - **cn()**：理解 clsx + tailwind-merge 解决的问题
   - **asChild + Slot**：试 `<Button asChild><Link>` 用法

4. **装个 Block 跑起来**：
   ```bash
   shadcn add dashboard-01
   ```
   - 看 app/dashboard/page.tsx 完整结构
   - 改 mock 数据为 fetch 真实 API
   - 看 components/app-sidebar.tsx 怎么组合 Sidebar

5. **配 Dark Mode**：
   ```bash
   pnpm add next-themes
   ```
   - 写 ThemeProvider
   - 加 ModeToggle 按钮
   - 验证刷新不闪

[click] **进阶 1 月**：

目标 —— 吃透核心生产力组件 + 自定义品牌。

推荐路径：

1. **Form 深入（RHF + zod）**：
   - 复杂校验（refine / superRefine / async）
   - 多字段联动
   - 异步提交 + 错误处理
   - Server Actions 整合
   - File upload 字段
   - 阅读 `components/ui/form.tsx` 源码理解 FormField Composition

2. **DataTable 深入（TanStack Table）**：
   - 自定义排序 / 筛选
   - 列可见性切换（DataTableViewOptions）
   - 列宽调整
   - Server-side pagination（不在客户端分页）
   - 行选择 → 批量操作（Bulk Delete 等）
   - 阅读 dashboard-01 内 Data Table 实现

3. **Sidebar 完整方案**：
   - 多分组导航
   - 子菜单 + Collapsible
   - User profile section
   - mobile responsive
   - cookies 状态保持

4. **自定义品牌色（Themes）**：
   - 去 ui.shadcn.com/themes 玩色板
   - copy CSS 到自己 globals.css
   - 或手动定义品牌色：
     ```css
     :root {
       --primary: oklch(0.55 0.22 280);  /* 自定义紫 */
     }
     ```
   - 验证 light/dark 都好看

5. **MCP Server 集成**：
   ```bash
   shadcn mcp init --client claude
   ```
   - 重启 Claude Code
   - 试自然语言：「装个登录表单」「展示所有 form 组件」「给我个 dashboard」
   - 体验 AI + shadcn 协作工作流

6. **Chart 实战**：
   - 装 `shadcn add chart-bar-multiple` / `chart-line-interactive`
   - 改 chartConfig 跟真实数据对齐
   - 用 ChartTooltipContent 自定义 tooltip

[click] **精通（持续）**：

目标 —— 自建设计系统 + 私有 Registry 分发。

推荐路径：

1. **自建 Registry**：
   - 公司内部多项目共享 UI
   - 写 registry.json 描述组件
   - `shadcn build` 生成 JSON
   - 部署到 internal CDN
   - 其他项目 `shadcn add https://internal.acme.com/r/acme-button.json`

2. **业务 wrapper 层**：
   - shadcn 组件在 `components/ui/`（不要改）
   - 业务封装在 `components/`（如 `ConfirmDialog` 包装 AlertDialog）
   - 设计系统 token 在 `lib/design-tokens.ts`

3. **monorepo + Turborepo**：
   ```bash
   shadcn init --monorepo
   ```
   - apps/web + apps/admin + packages/ui
   - Turbo build 缓存
   - Workspace dependencies

4. **读 Radix 源码**：
   - @radix-ui/react-slot 理解 asChild 实现（短，~100 行）
   - @radix-ui/react-dialog 理解 Compound 模式
   - @radix-ui/react-popper 理解 collision detection（@floating-ui 底层）

5. **跟进 WAI-ARIA APG**：
   - https://www.w3.org/WAI/ARIA/apg/
   - 30+ patterns（Dialog / Menu / Listbox / Slider 等）
   - Radix 每原语对应一个 pattern

6. **贡献 / 自有 Registry 生态**：
   - 写自己的组件 Registry 公开
   - 像 magicui.design、aceternity.com 一样发布
   - shadcn 社区欢迎贡献

**实际案例（Vercel 系）**：
- Vercel 仪表板 / Linear / Resend / Cal.com / Supabase Studio / v0 / 都用 shadcn
- 看他们的产品 → 学最佳实践
- 反编译看 `class` 结构 → 学 Tailwind 用法

**长期方向**：
- shadcn 是基础设施级存在 —— 学一次受益十年
- React 19 + Server Components → shadcn 已适配
- Tailwind v4 + OKLCH → shadcn 已适配
- 未来：更多 AI 集成 / MCP 工具扩展 / 跨框架（Solid / Svelte 版本社区已有）
-->

---
transition: fade-out
---

# 资源与生态

官方文档 / GitHub / 社区 Registry / 配套工具

<v-click>

| 类别       | 链接                                                                                  |
| ---------- | ------------------------------------------------------------------------------------- |
| 官方       | [ui.shadcn.com](https://ui.shadcn.com/) · [shadcn-ui/ui](https://github.com/shadcn-ui/ui) (115K+) |
| 社区 Registry | Magic UI · Aceternity · Kibo · Origin · TweakCN                                  |
| Dark Mode  | next-themes (Pacheco)                                                                 |
| Vercel 系  | sonner · vaul · cmdk · next-themes · Geist                                            |
| 数据 / 表单 | recharts · @tanstack/react-table · react-hook-form + zod                             |

</v-click>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] **官方资源**：

**ui.shadcn.com 主站**：
- Docs / Components / Blocks / Charts / Themes / Colors 六大区
- 每组件独立页 + 在线 demo + Copy 按钮
- 文档质量「业界第一档」—— 跟 Radix / Tailwind 同级
- New York 4.x 是当前默认 style

**GitHub `shadcn-ui/ui`**：
- 115K+ star（2026-05）
- 月活 issue / PR 数百
- Vercel 全力支持
- 作者 shadcn 仍亲自处理 PR

**Twitter / X @shadcn**：
- 重要更新第一手发布
- 设计 / 工程 / AI 协同 thread

**Discord 频道**：
- 社区互助
- shadcn 团队偶尔答疑
- shadcn-ui-icebreakers 频道有大量项目案例

[click] **社区 Registry**（shadcn 生态的扩展）：

**Magic UI**（magicui.design）：
- 动效组件库（meteors / animated-grid-pattern / orbiting-circles 等）
- 跟 shadcn 完全兼容
- 用 framer-motion 实现
- 适合 Hero section / marketing 页

**Aceternity UI**（aceternity.com）：
- 高级动效（3D / parallax / glow effect）
- 部分付费高级组件
- 视觉冲击力最强

**Kibo UI**（kibo-ui.com）：
- 扩展常用组件（spinner / file-tree / mockup 等）
- 填补 shadcn 没覆盖的场景

**Origin UI**（originui.com）：
- 设计师视角的组件集
- 文字 / 表单 / 卡片细节多

**TweakCN**（tweakcn.com）：
- 主题预设 Registry
- 直接 add 整套配色到项目

**21st.dev**：
- 组件灵感库（看别人怎么用 shadcn）
- 直接搜场景找参考

**shadcn 官方 awesome-list**（GitHub）：
- 大量社区项目链接

[click] **配套生态全图**：

**主题 / Dark Mode**：
- **next-themes**（Pacheco）—— SSR-safe 主题切换

**Overlay / Interaction**：
- **sonner**（Emil Kowalski）—— Toast 标准
- **vaul**（Emil Kowalski）—— iOS 风 Drawer
- **cmdk**（Paco Coursey）—— ⌘K 命令面板

**Forms**：
- **react-hook-form** —— 非受控表单状态
- **zod** —— Schema 校验
- **@hookform/resolvers** —— RHF + zod 桥
- **TanStack Form** —— shadcn 新选项

**Data**：
- **@tanstack/react-table** —— 表格 headless
- **recharts** —— React 图表
- **react-day-picker** —— Calendar 底层
- **embla-carousel-react** —— Carousel 底层
- **input-otp** —— OTP 输入

**Animation**：
- **tw-animate-css** —— Tailwind v4 animation utilities
- **framer-motion** —— 高级动画
- **@radix-ui** built-in CSS Vars for origin-aware

**Headless 底层**：
- **radix-ui** 一站式 —— 30+ Primitives
- **@floating-ui/react** —— Popper / Tooltip 定位

**字体**：
- **Geist** / **Geist Mono**（Vercel 自家字体）
- next/font/google 集成

**Icons**：
- **lucide-react**（默认）—— 1000+ 线性图标
- **@radix-ui/react-icons** —— 简洁单色
- **@tabler/icons-react** —— 全面图标

**Build / Tooling**：
- **Turborepo** —— monorepo build
- **pnpm** —— 包管理 + workspace
- **Vite** / **Next.js** / **Astro** / **Remix** —— 框架

**部署**：
- **Vercel**（首推）—— 跟 shadcn 同公司
- **Cloudflare Pages** / **Netlify** —— 备选

**AI 工具**：
- **Claude Code** + shadcn MCP
- **Cursor** + shadcn MCP
- **v0.dev**（Vercel）—— 自然语言生成 shadcn UI

**学习资源**：
- shadcn 官方 YouTube（Vercel 频道）
- Theo Browne YouTube（讲 shadcn / Next.js）
- Vercel Ship 大会 演讲

**适用项目**：
- Vercel Dashboard
- Linear（部分）
- Resend / Cal.com / Supabase Studio
- v0.dev
- Notion 部分实验
- 大量 YC / 早期创业项目
- 中国厂：抖音 / 米哈游 / 字节部分国际化产品也在用

**2026 趋势**：
- AI + shadcn 协作（MCP / v0 / Claude Code）成主流
- Tailwind v4 普及
- 越来越多企业内部 Registry
- shadcn 哲学被 Chakra v3 / Park UI / HeroUI 模仿
- 「Registry as Distribution」成为新组件库标准
-->

---
layout: center
class: text-center
transition: fade
---

# 谢谢观看 🎨

shadcn/ui —— The Foundation for your Design System

<div class="mt-8 text-lg">

**核心心智**

- 不是 npm 库，是「构建组件库的方式」—— 源码 copy 进 repo
- 底层 = Radix Primitives 行为 + Tailwind 样式 + cva 变体 + lucide 图标
- 三大武器：cva 管变体 + Slot 管 asChild + cn() 合并 className
- Tailwind v4 + OKLCH + @theme inline + CSS Vars 主题
- MCP Server —— Claude / Cursor / VS Code 自然语言装组件
- Registry 私有分发 —— 任何 JSON URL 都能当组件源

</div>

<div class="mt-12 flex justify-center gap-6">
  <a href="https://ui.shadcn.com/" target="_blank" class="slidev-icon-btn">
    <carbon:document /> 官方文档
  </a>
  <a href="https://github.com/shadcn-ui/ui" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github /> GitHub
  </a>
  <a href="https://ui.shadcn.com/themes" target="_blank" class="slidev-icon-btn">
    <carbon:color-palette /> Themes
  </a>
</div>

<style>
h1 {
  background-color: #18181B;
  background-image: linear-gradient(45deg, #18181B 10%, #71717A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
总结一句话：shadcn/ui = React 生态「Open Code 哲学」的代表，源码 copy 进 repo，你拥有代码。

核心心智七条：

1. **不是组件库，是构建组件库的方式**：The Foundation for your Design System
2. **Open Code / Composition / Distribution / Beautiful Defaults / AI-Ready** 五大支柱
3. **底层 = Radix Primitives + Tailwind v4 + cva + lucide-react**
4. **三大武器**：cva 变体 + Slot asChild + cn() className 合并
5. **Tailwind v4 + OKLCH + @theme inline** 现代主题方案
6. **next-themes + sonner + vaul + cmdk** Vercel 系生态
7. **MCP Server + Registry**：AI 时代分发标准

下一步建议：

入门：
- pnpm create next-app + shadcn init
- 跑通 Button / Dialog / Form / Card 四大基础
- 装一个 Block（dashboard-01）跑通完整后台

进阶：
- Form（RHF+zod）/ DataTable（TanStack）/ Sidebar 完整方案吃透
- 自定义品牌色 + Dark Mode 集成
- 配 MCP Server 让 AI 协作开发

精通：
- 自建私有 Registry 分发公司组件
- monorepo 多 apps 共享 UI 包
- 读 Radix 源码理解 Slot / Compound 实现
- 跟进 WAI-ARIA APG 自建设计系统

延伸学习：
- shadcn 70+ 组件全部跑遍
- 社区 Registry：Magic UI / Aceternity / Kibo / Origin / TweakCN
- Vercel 系生态：sonner / vaul / cmdk / next-themes / v0.dev
- Radix Primitives / @floating-ui / @tanstack/* 底层库

shadcn 是 2024+ React UI 生态的「事实基础设施」 ——
理解它 = 理解当代 React UI 工程实践（Radix + Tailwind + cva + 复制粘贴 + AI 协作）。

感谢观看！
-->
