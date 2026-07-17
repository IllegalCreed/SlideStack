---
theme: seriph
background: https://cover.sli.dev
title: HyperFrames
info: |
  HeyGen 官方 agent 技能集：写 HTML，渲染成视频，为 agent 而生。
  heygen-com/hyperframes。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# HyperFrames

<div class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 text-2xl font-bold mt-2">
Write HTML · Render video · Built for agents
</div>

<div class="pt-6 opacity-80">
heygen-com/hyperframes · HeyGen 官方 · 19 skill 按需加载 · Apache-2.0
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/heygen-com/hyperframes" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
HyperFrames 是 HeyGen 官方的 agent 技能集，把「写 HTML 渲染视频」的整套生产规范打包成 19 个按需加载的 skill。
-->

---
transition: fade-out
---

# 它是什么

<div class="grid grid-cols-2 gap-8 mt-6">
<div v-click>

**一句话**

写标准 HTML + `data-*` 时间属性 → 渲染成视频

- 前端技能直接迁移，无需专有 DSL
- 视频 = 确定性、可 seek 的合成
- 不是一堆各自为政的动画切片

</div>
<div v-click>

**技能集**

`heygen-com/hyperframes`，HeyGen 官方

- 19 skill 按需加载
- 先读路由 `/hyperframes`
- 装进 Claude Code / Cursor / Codex

</div>
</div>

<div v-click class="mt-8 text-center text-xl">
第一原则：<span class="text-fuchsia-400 font-bold">seek-safe + 确定性</span>——任意帧都能重建
</div>

---

# 安装

```bash
# agent / 非交互（推荐）：正好装 core set
npx hyperframes skills update

# 交互 picker（Core Skills 组，默认不预选）
npx skills add heygen-com/hyperframes --full-depth

# 全装 19 / 单装一个
npx skills add heygen-com/hyperframes --all --full-depth
npx skills add heygen-com/hyperframes --skill motion-graphics --full-depth
```

<div v-click class="mt-4 p-3 bg-amber-500 bg-opacity-15 rounded">
⚠️ <b>--full-depth 必带</b>：装当前 main；不带走 skills.sh blob 滞后数小时。非交互无 --skill 会装全 19。
</div>

---

# 19 skill 架构

<div class="grid grid-cols-3 gap-4 mt-6">
<div v-click class="p-4 bg-violet-500 bg-opacity-15 rounded">

**1 路由**

`/hyperframes`

先读 · brief 确认 · 分发

</div>
<div v-click class="p-4 bg-fuchsia-500 bg-opacity-15 rounded">

**10 创作工作流**

产品发布 / 无脸讲解 / PR 视频 / 字幕 / 幻灯 / motion graphic …

</div>
<div v-click class="p-4 bg-purple-500 bg-opacity-15 rounded">

**8 域 skill**

core / animation / keyframes / creative / media-use / cli / registry / figma

</div>
</div>

<div v-click class="mt-8 text-center opacity-80">
创作工作流针对域 skill 组合，需要哪层拉哪层
</div>

---

# 路由：/hyperframes 先读

<div class="mt-4">

任何「make / create / edit / animate / render 视频」请求，先读 `/hyperframes`。

</div>

- **capability map**：域 skill 的能力地图
- **意图确认层**：把创作 brief 先跟你确认清楚
- **意图路由**：分发到具体创作工作流，按需装该工作流

<div v-click class="mt-6 p-3 bg-violet-500 bg-opacity-15 rounded">
「先确认再动手」——避免 agent 拿模糊需求乱做、事后返工。
</div>

---
layout: two-cols
layoutClass: gap-6
---

# 创作工作流（10）

- `product-launch-video` 网站营销/导览
- `faceless-explainer` 文本讲解
- `pr-to-video` GitHub PR → 视频
- `embedded-captions` 加字幕
- `talking-head-recut` 口播 + 叠层

::right::

<div class="mt-14">

- `motion-graphics` <10s 设计动图
- `music-to-video` beat 同步
- `slideshow` 可导航 deck
- `general-video` 兜底 + 陪伴
- `remotion-to-hyperframes` **Remotion 迁移**

<div v-click class="mt-4 text-sm opacity-80">
最后一个是与 Remotion 叶的桥：React 组件 → HTML 单向迁移。
</div>

</div>

---

# 合成契约与动画适配器

<div class="grid grid-cols-2 gap-6 mt-2">
<div>

**hyperframes-core** 合成契约

```html
<div class="clip" data-start="0"
     data-dur="30">
  <!-- tracks / 子合成 / 变量 -->
</div>
```

`data-*` 时间属性 · `class="clip"` · tracks · **确定性规则**

</div>
<div>

**hyperframes-animation** 适配器

- GSAP / Lottie / Three.js
- Anime.js / CSS / WAAPI
- TypeGPU

<div class="mt-2 text-sm opacity-80">
按需接不同引擎，框架统一时间轴。
</div>

</div>
</div>

---

# seek-safe：可拖动进度不跳变

<div class="mt-4">

`hyperframes-keyframes`：跨运行时的**可 seek** 关键帧创作。

</div>

<div class="grid grid-cols-2 gap-6 mt-2">
<div v-click>

**覆盖**

GSAP timeline · CSS keyframes · Anime.js · WAAPI · FLIP · paths · masks · SVG morph/draw · 3D depth

</div>
<div v-click>

**为什么重要**

拖到任意帧，都能**确定性重建**那一帧——逐帧渲染正确的根基。配 `hyperframes keyframes` 诊断。

</div>
</div>

<div v-click class="mt-6 text-center p-2 bg-red-500 bg-opacity-15 rounded">
❌ 依赖真实时间/随机的动画 → 拖进度跳变、渲染不一致
</div>

---

# CLI 与云渲染

`hyperframes-cli` 开发循环

```bash
npx hyperframes init      # 初始化 / 保持 core set
npx hyperframes lint      # 校验合成
npx hyperframes preview   # 预览
npx hyperframes render    # 本地渲染

# 云端
npx hyperframes cloud render          # HeyGen 托管
npx hyperframes lambda deploy/render  # AWS Lambda
```

---

# 生产循环

<div class="mt-6 text-lg leading-relaxed">

```text
plan（/hyperframes 确认 brief）
  → 写合法 HTML（data-* + class="clip" + tracks）
  → 接 seek-safe 动画（GSAP / 适配器）
  → 加 media（media-use 落地 + ledger）
  → lint → preview → render（本地 / 云 / Lambda）
```

</div>

<div v-click class="mt-6 text-center opacity-80">
motion doctrine：多场景像「一镜到底」，不是一叠各自动画的幻灯
</div>

---
layout: center
class: text-center
---

# 小结

<div class="text-xl mt-4 leading-relaxed">

**HyperFrames** = 写 HTML 渲染视频，为 agent 而生

</div>

<div class="grid grid-cols-3 gap-4 mt-8 text-left max-w-3xl mx-auto">
<div class="p-3 bg-violet-500 bg-opacity-15 rounded">
<b>先读路由</b><br/>
/hyperframes 确认 brief
</div>
<div class="p-3 bg-fuchsia-500 bg-opacity-15 rounded">
<b>seek-safe</b><br/>
任意帧确定性重建
</div>
<div class="p-3 bg-purple-500 bg-opacity-15 rounded">
<b>全链路</b><br/>
HTML→动画→render→云
</div>
</div>

<div class="mt-10 opacity-80">
npx hyperframes skills update · Apache-2.0 · Node ≥22
</div>

<div class="abs-br m-6 text-sm opacity-60">
heygen-com/hyperframes · hyperframes.heygen.com
</div>
