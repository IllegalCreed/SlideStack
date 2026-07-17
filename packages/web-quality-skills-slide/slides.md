---
theme: seriph
background: https://cover.sli.dev
title: Web Quality Skills
info: |
  Addy Osmani（Google Chrome / Web 性能权威）个人 agent 技能集：
  基于 Lighthouse + Core Web Vitals 优化 web 质量。addyosmani/web-quality-skills。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Web Quality Skills

Addy Osmani 的 agent 技能集——**基于 Lighthouse + Core Web Vitals 优化 web 质量**

<div class="pt-6 opacity-80">
addyosmani/web-quality-skills · performance / a11y / SEO / CWV · MIT · 框架无关
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/addyosmani/web-quality-skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #4f46e5 10%, #06b6d4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Web Quality Skills 是 Addy Osmani 个人维护的 agent 技能集。Addy 是 Google Chrome 团队工程负责人、Web 性能权威。这套技能基于 Lighthouse 和 Core Web Vitals，框架无关。
-->

---
transition: fade-out
---

# 定位：谁做的，别跟另一叶混

<div class="grid grid-cols-2 gap-6 mt-6">
<div v-click>

**本叶：Web Quality Skills**

- 仓库 `addyosmani/web-quality-skills`
- **专注 web quality**：性能 / a11y / SEO
- 基于 Lighthouse + Core Web Vitals
- Addy Osmani（Google Chrome）

</div>
<div v-click>

**另一叶：Addy Osmani Agent Skills**

- 仓库 `addyosmani/agent-skills`
- **宽泛的通用工程技能集**
- 同为 Addy 出品，不同仓
- 别把两者混为一谈

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">

README 标注 <strong>unofficial</strong>——个人集合，非 Google 官方产品，但含 Chrome DevTools 团队洞见。

</div>

<style>
h1 { background: linear-gradient(45deg, #4f46e5 10%, #06b6d4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
本叶专注 web quality。注意与另一叶 Addy Osmani Agent Skills 区分：那是宽泛通用集，本叶只聚焦性能、无障碍、SEO。都是 Addy 出品但不同仓。README 标 unofficial。
-->

---
transition: fade-out
---

# 6 个技能

一句话触发，任务匹配自动激活

| 技能 | 触发词 | 覆盖 |
| --- | --- | --- |
| `web-quality-audit` | audit my site | 编排全部，150+ 检查，分级 |
| `performance` | speed up / fix slow | 加载 + 运行时性能 |
| `core-web-vitals` | fix LCP / reduce CLS | LCP / INP / CLS 三大指标 |
| `accessibility` | a11y / WCAG | WCAG 2.2 无障碍 |
| `seo` | optimize SEO | 技术 / 页面 SEO、结构化数据 |
| `best-practices` | security audit | 安全、现代 API、代码质量 |

<style>
h1 { background: linear-gradient(45deg, #4f46e5 10%, #06b6d4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
6 个技能各有触发词。web-quality-audit 是总入口编排其它 5 个；performance、core-web-vitals 管速度；accessibility 管无障碍；seo 管搜索；best-practices 管安全与代码质量。
-->

---
transition: fade-out
---

# 安装：一条命令

<div v-click>

```bash
# 主推：skills CLI 装进 Claude Code / Cursor / Codex
npx skills add addyosmani/web-quality-skills

# 手动复制到用户级技能目录
cp -r skills/* ~/.claude/skills/
```

</div>

<div v-click class="mt-4">

装后自然语言即可触发：

```text
Audit this page for web quality issues
Optimize performance and fix Core Web Vitals
Review accessibility and suggest improvements
```

</div>

<style>
h1 { background: linear-gradient(45deg, #4f46e5 10%, #06b6d4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
安装一条命令。装后技能自动可用，用自然语言描述任务就能触发对应技能，比如审计、优化性能、审查无障碍。
-->

---
transition: fade-out
---

# web-quality-audit：编排全站审计

不确定查哪块？用它一把梭，按严重度分级

| 类别 | 典型占比 | 覆盖 |
| --- | --- | --- |
| Performance | ~40% | CWV + 50+ 性能模式 |
| Accessibility | ~30% | 40+ WCAG 规则 |
| SEO | ~15% | 30+ 搜索要求 |
| Best Practices | ~15% | 20+ 安全 / 质量 |

<div v-click class="mt-4 text-center text-sm opacity-80">

输出分级：**Critical**（安全/失败）→ **High**（CWV/a11y）→ **Medium** → **Low**，每条给影响 + 修复。

</div>

<style>
h1 { background: linear-gradient(45deg, #4f46e5 10%, #06b6d4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
web-quality-audit 编排全部技能做综合审计，覆盖 150+ 检查。性能占问题的大头 40%，其次无障碍 30%。输出按 Critical High Medium Low 分级，每条给影响和修复。
-->

---
transition: fade-out
---

# Core Web Vitals：三大指标

影响 Google 搜索排名，取 75 分位

| 指标 | 衡量 | Good | 差 |
| --- | --- | --- | --- |
| **LCP** | 加载 | ≤ 2.5s | > 4.0s |
| **INP** | 交互响应 | ≤ 200ms | > 500ms |
| **CLS** | 视觉稳定 | ≤ 0.1 | > 0.25 |

<div v-click class="mt-4 text-center">

Lighthouse 目标分：Performance ≥ 90 · **Accessibility 100** · Best Practices ≥ 95 · SEO ≥ 95

</div>

<style>
h1 { background: linear-gradient(45deg, #4f46e5 10%, #06b6d4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Core Web Vitals 三大指标：LCP 加载要 2.5 秒内，INP 交互 200 毫秒内，CLS 布局偏移 0.1 内。Google 在 75 分位衡量。Lighthouse 四类目标分，无障碍要满分 100。
-->

---
transition: fade-out
---

# LCP：让最大内容快速渲染

Preload + 高优先级 + 放进初始 HTML

```html
<!-- 预加载 LCP 图，高优先级 -->
<link rel="preload" href="/hero.webp" as="image" fetchpriority="high">
<img src="/hero.webp" alt="Hero" fetchpriority="high">

<!-- 关键 CSS 内联，其余延迟 -->
<style>/* 首屏样式 */</style>
<link rel="preload" href="/styles.css" as="style"
      onload="this.onload=null;this.rel='stylesheet'">
```

<div v-click class="mt-3 text-sm opacity-80">

要点：TTFB < 800ms、LCP 图别等 JS 渲染、字体 `font-display: swap` 不挡文本。

</div>

<style>
h1 { background: linear-gradient(45deg, #4f46e5 10%, #06b6d4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
LCP 优化：预加载 hero 图并设高优先级，关键 CSS 内联其余延迟，LCP 内容放进初始 HTML 别等 JS。TTFB 控制在 800 毫秒内。
-->

---
transition: fade-out
---

# INP：别让长任务阻塞主线程

分片 + `scheduler.yield()` 让出调度器

```js
async function processLargeArray(items) {
  const CHUNK = 100;
  for (let i = 0; i < items.length; i += CHUNK) {
    items.slice(i, i + CHUNK).forEach(expensiveOperation);
    if ('scheduler' in window && 'yield' in scheduler)
      await scheduler.yield();      // 推荐：续跑优先级高
    else
      await new Promise(r => setTimeout(r, 0)); // 回退
  }
}
```

<div v-click class="mt-2 text-sm opacity-80">

INP = 输入延迟 + 处理时间 + 呈现延迟；先给即时视觉反馈，再让出后做重活。

</div>

<style>
h1 { background: linear-gradient(45deg, #4f46e5 10%, #06b6d4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
INP 优化核心是别让长任务阻塞主线程。把大循环分片，用 scheduler.yield 让出调度器。INP 由输入延迟、处理时间、呈现延迟三段组成，先给视觉反馈再做重活。
-->

---
transition: fade-out
---

# CLS：别让内容跳来跳去

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**成因**

- 图片 / 视频没尺寸
- 广告 / iframe 未预留空间
- 动态内容插在视口上方
- Web 字体 FOUT 换行
- 动画动 `height` / `width`

</div>
<div v-click>

**修复**

- 加 `width`/`height` 或 `aspect-ratio`
- `min-height` 容器占位
- 插在视口下方或 `transform` 进入
- `font-display: optional` / 匹配度量
- 只动 `transform` / `opacity`

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #4f46e5 10%, #06b6d4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
CLS 是布局偏移。成因包括图片没尺寸、iframe 没占位、内容插在上方、字体换行、动画改布局属性。修复对应：定尺寸、占位容器、插下方、优化字体、只用 transform 和 opacity 动画。
-->

---
transition: fade-out
---

# performance：加载与运行时

先立性能预算，超了就是问题

<v-clicks>

- **关键渲染路径**：TTFB < 800ms、Brotli 压缩、HTTP/2/3、Early Hints
- **资源加载**：`preconnect` 第三方、`preload` LCP 图/字体、Speculation Rules 预渲染
- **图片**：AVIF > WebP > PNG/SVG，`<picture>` + `srcset` 响应式
- **JS**：`defer` / 代码分割 `lazy(() => import())` / tree shaking
- **运行时**：避免布局抖动、防抖、`content-visibility` 虚拟化、View Transitions

</v-clicks>

<div v-click class="mt-3 text-center text-sm opacity-80">

预算：总页重 < 1.5MB · JS < 300KB · CSS < 100KB · 字体 < 100KB（压缩后）

</div>

<style>
h1 { background: linear-gradient(45deg, #4f46e5 10%, #06b6d4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
performance 技能覆盖加载和运行时。关键渲染路径、资源加载 preconnect preload、图片用现代格式、JS 延迟和分割、运行时避免抖动和虚拟化。先立性能预算，超了就要优化。
-->

---
transition: fade-out
---

# accessibility：WCAG 2.2 无障碍

四原则 POUR，AA 是多数地区法律要求

| 原则 | 要点 |
| --- | --- |
| **P** 可感知 | `alt` 文本、对比度 ≥ 4.5:1、别只靠颜色 |
| **O** 可操作 | 全键盘可达、`:focus-visible`、skip link |
| **U** 可理解 | `lang` 声明、`<label>`、错误 `role="alert"` |
| **R** 健壮 | **优先原生元素**、`aria-live` 播报 |

<div v-click class="mt-3 text-center text-sm opacity-80">

反模式：`<div onclick>` 当按钮 → 键盘不可达。优先用原生 `<button>`。

</div>

<style>
h1 { background: linear-gradient(45deg, #4f46e5 10%, #06b6d4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
accessibility 基于 WCAG 2.2，四原则 POUR：可感知、可操作、可理解、健壮。AA 级是很多地区的法律要求。核心反模式是用 div 当按钮，应该优先用原生 button。
-->

---
transition: fade-out
---

# WCAG 2.2 新增准则

这套技能特别覆盖的 2.2 新准则

| 准则 | 要点 |
| --- | --- |
| 焦点不被遮挡 (2.4.11) | 聚焦元素不被 sticky 头/尾挡住 |
| 目标尺寸 (2.5.8) | 交互目标 ≥ 24×24 CSS 像素 |
| 拖拽动作 (2.5.7) | 拖拽须有单指针替代 |
| 一致的帮助 (3.2.6) | 帮助入口保持相同相对顺序 |
| 可访问认证 (3.3.8) | 别只靠记忆/解谜，给 passkey/粘贴 |

<style>
h1 { background: linear-gradient(45deg, #4f46e5 10%, #06b6d4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
WCAG 2.2 相比 2.1 新增了几条准则，这套技能都覆盖：焦点不被遮挡、目标尺寸至少 24 像素、拖拽要有替代、帮助入口一致、认证要可访问不能只靠记忆。
-->

---
transition: fade-out
---

# seo & best-practices

搜索可见性 + 安全与代码质量

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**seo**

- `robots.txt` / `canonical` / sitemap
- `<title>` 50-60 字符、单 `<h1>`
- JSON-LD 结构化数据
- 移动友好、点击目标 ≥ 48px
- AI 爬虫别一刀切封

</div>
<div v-click>

**best-practices**

- HTTPS / HSTS / CSP / **Trusted Types**
- 第三方脚本用 **SRI** 钉哈希
- 别用 `document.write` / 同步 XHR
- 无 console 报错、语义化 HTML
- 生产隐藏 source map

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #4f46e5 10%, #06b6d4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
seo 管技术和页面 SEO、结构化数据、移动友好，AI 爬虫别一刀切封。best-practices 管安全，HTTPS、CSP、Trusted Types 防 DOM-XSS、SRI 钉第三方脚本哈希，避免废弃 API，生产隐藏 source map。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Addy Osmani 的 6 技能：`web-quality-audit` 编排全站审计，performance/core-web-vitals 攻 LCP·INP·CLS，accessibility 守 WCAG 2.2，seo + best-practices 补搜索与安全——全基于 Lighthouse，框架无关。**

<div class="mt-8 opacity-80">

Chrome 权威沉淀 · Lighthouse + CWV · 触发词自动激活 · 按影响力分级

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/addyosmani/web-quality-skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://developer.chrome.com/docs/lighthouse/" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #4f46e5 10%, #06b6d4 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Addy Osmani 的 6 个技能：audit 编排、performance 和 core-web-vitals 攻三大指标、accessibility 守 WCAG 2.2、seo 和 best-practices 补搜索和安全。全基于 Lighthouse，框架无关。
-->
