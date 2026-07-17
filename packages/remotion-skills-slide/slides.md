---
theme: seriph
background: https://cover.sli.dev
title: Remotion Skills
info: |
  Remotion 官方 agent 技能集：用 React 组件 + 帧驱动动画编程式生成视频。
  remotion-dev/skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Remotion Skills

<div class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-2xl font-bold mt-2">
用 React 写视频 · 帧驱动 · 官方技能集
</div>

<div class="pt-6 opacity-80">
remotion-dev/skills · @remotion/skills · 教 agent 正确写 Remotion
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/remotion-dev/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Remotion Skills 是 Remotion 官方的 agent 技能集，把「用 React 组件 + 帧驱动动画生成视频」的正确姿势教给编码 agent。
-->

---
transition: fade-out
---

# 它是什么

<div class="grid grid-cols-2 gap-8 mt-6">
<div v-click>

**Remotion**

用 React 组件 + 帧驱动动画，**编程式生成视频**（MP4 / WebM / GIF / 静帧）

- 没有真实时间轴，逐帧离线渲染
- 第 30 帧就是第 30 帧

</div>
<div v-click>

**Remotion Skills**

`remotion-dev/skills` 官方技能集

- 装进 Claude Code / Cursor / Codex
- 教 agent 避开最常见错误
- 总入口路由 → 子技能按需加载

</div>
</div>

<div v-click class="mt-8 text-center text-xl">
核心铁律：<span class="text-blue-400 font-bold">动画 = useCurrentFrame() + interpolate()</span>
</div>

---

# 安装与总入口

```bash
# 装进你的 agent（Claude Code / Cursor / Codex 等）
npx skills add remotion-dev/skills
```

<div v-click>

总入口 `remotion-best-practices` 是一张**路由表**，按任务分发：

| 任务 | 子技能 |
| --- | --- |
| 新建项目 | `remotion-create` |
| 写 React Markup | `remotion-markup` |
| Studio 可视化编辑 | `remotion-interactivity` |
| 渲染 / 字幕 | `remotion-render` / `remotion-captions` |
| SaaS / 查文档 / 多媒体 | `remotion-saas` / `remotion-docs` / `mediabunny` |

</div>

---
layout: two-cols
layoutClass: gap-8
---

# 建项目到预览

`remotion-create`

```bash
# 1. 脚手架（空白、无 Tailwind）
npx create-video@latest \
  --yes --blank --no-tailwind my-video
cd my-video && npm i

# 2. 启动 Studio 预览（长驻）
npx remotion studio --no-open
```

::right::

<div class="mt-16">

**流程**

1. 脚手架建项目
2. 往里加 React Markup
3. Studio 里边写边看
4. `remotion render` 出片

<div v-click class="mt-4 text-sm opacity-80">
已有项目就跳过脚手架，直接加 Markup。
</div>

</div>

---

# 帧驱动：为什么不能用 CSS 动画

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**常规前端**

- CSS `transition` / `animation`
- `setTimeout` 控制节奏
- 依赖浏览器真实时间

</div>
<div v-click>

**Remotion（逐帧渲染）**

- 没有真实时间轴
- 用「当前帧 → 属性值」表达
- `useCurrentFrame()` + `interpolate()`

</div>
</div>

<div v-click class="mt-6 p-3 bg-red-500 bg-opacity-15 rounded text-center">
❌ CSS transition/animation、Tailwind 动画类 <b>被明令禁止</b>——逐帧渲染下根本不生效
</div>

---

# Markup 铁律

```tsx
import { useCurrentFrame, Easing, interpolate, Interactive } from "remotion";

export const FadeIn = () => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Title"                          // Studio 可编辑
      style={{
        opacity: interpolate(frame, [0, 60], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      Hello World!
    </Interactive.Div>
  );
};
```

<div v-click class="text-sm opacity-80 mt-1">
优先 <code>interpolate()</code> 而非 <code>spring()</code>；<code>interpolate()</code> 内联在 style。
</div>

---

# 单属性变换 vs transform 字符串

<div class="grid grid-cols-2 gap-4 mt-2">
<div>

👍 **可编辑的关键帧**

```tsx
style={{
  scale: interpolate(
    frame, [0, 100], [0, 1]),
  translate: interpolate(
    frame, [0, 100],
    ["0px 0px", "100px 100px"]),
  rotate: interpolate(
    frame, [0, 100],
    ["20deg", "90deg"]),
}}
```

</div>
<div>

👎 **隐藏值 + 字符串**

```tsx
const scale = interpolate(
  frame, [0, 100], [0, 1]);

style={{
  transform: `scale(${scale})`,
}}
// Studio 里更难编辑
```

</div>
</div>

<div v-click class="mt-4 text-center">
优先 <code>scale</code> / <code>translate</code> / <code>rotate</code> 单属性 · 资源放 <code>public/</code> 用 <code>staticFile()</code>
</div>

---

# 可交互：写回代码的 Studio

<div class="mt-4">

把 Markup 结构组织好，用户能在 Remotion Studio 的 **Visual Mode** 里改动，并**写回代码**。

</div>

- 该交互的元素用 `Interactive`：`<div>` → `<Interactive.Div>`
- 给 `Interactive` / `Solid` / `Sequence` 设描述性 `name`（如 `name="Hero title"`）
- 主要由视频/音频片段构成的组件 → 按「视频编辑」规范组织，片段在时间轴可交互

<div v-click class="mt-6 p-3 bg-blue-500 bg-opacity-15 rounded">
可交互不是额外功能，而是<b>组织 Markup 的方式</b>——结构好，才能可视化编辑。
</div>

---

# 渲染与字幕

<div class="grid grid-cols-2 gap-6">
<div>

**渲染** `remotion-render`

```bash
# 渲染视频
npx remotion render
# 渲染单帧静图
npx remotion still
```

透明视频另有专门说明。

</div>
<div>

**字幕** `remotion-captions`

```ts
import type { Caption }
  from "@remotion/captions";
// text / startMs / endMs
// timestampMs / confidence
```

JSON 处理：转写 / 显示 / 导入 SRT。

</div>
</div>

---
layout: two-cols
layoutClass: gap-8
---

# SaaS 与多媒体

`remotion-saas`

- **`<Player>`**：网页内嵌播放
- 云端渲染：Lambda / Vercel / Cloudflare / Express
- 客户端渲染
- SaaS 起步模板

::right::

<div class="mt-14">

`mediabunny`（浏览器多媒体）

- 取音频/视频时长
- 取视频尺寸
- 裁剪、裁边、读元数据

<div class="mt-3 text-sm opacity-80">
能力总览：mediabunny.dev/llms.txt
</div>

</div>

---

# 反模式清单

| 反模式 | 后果 | 正解 |
| --- | --- | --- |
| CSS `transition`/`animation` | 渲染不出来 | `useCurrentFrame()`+`interpolate()` |
| Tailwind 动画类 `animate-*` | 渲染不出来 | 帧驱动动画 |
| `setTimeout` 控节奏 | 无真实时间 | 用帧号定位 |
| 提取 `interpolate` 拼 `transform` | Studio 难编辑 | 内联 + 单属性 |
| 资源写死路径 | 找不到 | `public/` + `staticFile()` |

---
layout: center
class: text-center
---

# 小结

<div class="text-xl mt-4 leading-relaxed">

**Remotion Skills** = 教 agent 正确写 Remotion 视频

</div>

<div class="grid grid-cols-3 gap-4 mt-8 text-left max-w-3xl mx-auto">
<div class="p-3 bg-blue-500 bg-opacity-15 rounded">
<b>一条铁律</b><br/>
动画=帧+interpolate
</div>
<div class="p-3 bg-cyan-500 bg-opacity-15 rounded">
<b>一个路由</b><br/>
best-practices 分发
</div>
<div class="p-3 bg-teal-500 bg-opacity-15 rounded">
<b>全链路</b><br/>
建→写→渲→字幕→SaaS
</div>
</div>

<div class="mt-10 opacity-80">
npx skills add remotion-dev/skills
</div>

<div class="abs-br m-6 text-sm opacity-60">
remotion-dev/skills · remotion.dev
</div>
