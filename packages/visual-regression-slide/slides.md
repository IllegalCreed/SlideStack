---
theme: seriph
background: https://cover.sli.dev
title: 视觉回归测试
info: |
  视觉回归测试全指南：Chromatic 17.5 + Playwright 1.61

  Learn more at [https://playwright.dev/docs/test-snapshots](https://playwright.dev/docs/test-snapshots)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:compare class="text-8xl" />
</div>

<br/>

## 视觉回归测试

像素级 diff 守住 UI 外观 · Chromatic + Playwright

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
视觉回归测试（Visual Regression Testing）= 把 UI 渲染成真实像素图，做像素级 diff，抓肉眼可见的外观变化。
两条主线：Chromatic 云端（Storybook 团队出品）+ Playwright 本地免费。版本以 2026-06 为准。
-->

---
transition: fade-out
---

# 视觉回归 vs 快照测试

<span class="text-sm op-70">像素图 vs 序列化文本，不是同义词</span>

<v-click>

| 维度 | 快照测试 Snapshot | 视觉回归 Visual |
| --- | --- | --- |
| 比的是 | **序列化文本**（DOM/渲染树） | **渲染像素图**（PNG） |
| 落盘 | `.snap`，逐字符比 | `.png` 基线，像素 diff |
| 抓得到 | 结构/文本变化 | 颜色/字体/间距/布局漂移 |
| API | `toMatchSnapshot()` | `toHaveScreenshot()` |

</v-click>

<v-click>

> **关键纠偏**：DOM 没变但 CSS 变了，**只有视觉回归能抓到**——这正是 DOM 快照的盲区。"快照测试"默认指文本快照，二者不可混用。

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 快照测试比的是序列化后的文本，Jest/Vitest 的 toMatchSnapshot、Playwright 的 toMatchSnapshot 都属此类，不渲染像素。
视觉回归比的是真实渲染出来的像素图。

[click] 最容易错的点：改了个颜色、改了行高，DOM 结构没变，文本快照全绿，但用户肉眼能看出来——这种只有视觉回归抓得到。
-->

---
transition: fade-out
---

# 像素 diff 原理：pixelmatch

<span class="text-sm op-70">YIQ 感知色差 + 自动忽略抗锯齿（pixelmatch 7.2.0）</span>

<v-click>

- **YIQ 色彩空间**：基于 Kotsarenko & Ramos 2010 论文的**感知色差**，贴近人眼判断，**而非 RGB 欧氏距离**
- **`threshold`**（0~1，**pixelmatch 默认 0.1**）：单像素被判"不同"的色差阈值，越小越敏感

</v-click>

<v-click>

- **`includeAA` 默认 `false`** → **自动检测并忽略抗锯齿边缘像素**（"少误报"的关键机制）；设 `true` 才把抗锯齿算进 diff

</v-click>

<v-click>

| diff 着色项 | 默认值 | 含义 |
| --- | --- | --- |
| `diffColor` | `[255,0,0]` 红 | 不同像素 |
| `aaColor` | `[255,255,0]` 黄 | 抗锯齿像素 |
| `alpha` | `0.1` | 未变像素底图淡化 |

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] pixelmatch 是 Playwright 的底层 diff 引擎。色差用 YIQ 感知度量，不是简单 RGB 相减——更接近"人眼看得出的差异"。

[click] includeAA 默认 false 这个点极易错：它表示"默认忽略抗锯齿像素"（自动检测后跳过），不是"默认包含"。这是减少误报的核心。

[click] diff 图里红色是真不同、黄色是抗锯齿、底图淡化，方便人审。
-->

---
transition: fade-out
---

# baseline / golden 基线工作流

五步循环，首跑无基线必"失败"

<v-click>

```text
capture  →  compare  →  review  →  approve  →  update
首跑生成    与基线diff   人看diff图  确认是预期    更新基线为新图
```

</v-click>

<v-click>

- **capture**：首次运行生成基线图（baseline / golden）
- **compare**：后续每跑一次，与基线做像素 diff
- **review**：人工查看 diff 图，判断是回归还是改进
- **approve / accept**：确认是预期变更则签核
- **update**：把基线更新为新图，提交

</v-click>

<v-click>

> **首次运行没有基线 = 必然"失败"并生成基线**——这是设计而非 bug。须提交基线后再跑才能通过。

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 基线工作流五步是所有视觉回归工具的共同骨架，无论 Chromatic 还是 Playwright。

[click] 关键是 review 和 approve 这两步——视觉 diff 必须有人看图判断"这是有意改进还是意外回归"，工具不能替你决定。

[click] 新手最常困惑：第一次跑为什么失败？因为没有基线可比，工具先生成基线并标记失败，这是预期行为。
-->

---
transition: fade-out
---

# 两条主线总览

云端托管 vs 本地免费

<v-click>

| 维度 | Chromatic（云端） | Playwright（本地） |
| --- | --- | --- |
| 出品方 | Storybook 团队 | Microsoft |
| 测试单元 | 每个 story | `toHaveScreenshot()` |
| 基线 | 托管云端，不入库 | PNG 入库随 PR review |
| 评审 | 逐快照 Accept/Deny UI | 看 Git 里 PNG diff |
| 跨端 | modes 多视口/主题 | 按浏览器+平台分文件 |
| 计费 | 按快照量（TurboSnap 省） | 免费 |

</v-click>

<v-click>

> 选型：要**云端跨端矩阵 + 团队签核 UI** → Chromatic；要**零成本、纳入现有 E2E** → Playwright。本项目 `packages/ui` 方向是 Chromatic（addon 已装）。

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 两条主线的核心差异：Chromatic 把基线和评审都搬到云端、按快照计费，适合设计系统团队；Playwright 本地跑、基线入库、完全免费，适合并入已有 E2E。

[click] 本项目的 packages/ui 已经装了 @chromatic-com/storybook addon，方向是 Chromatic，只差 token 和 CI——后面会讲。
-->

---
transition: fade-out
---

# Chromatic：一次跑出三类测试

<span class="text-sm op-70">story = 测试用例 · chromatic CLI 17.5.0 / addon 5.2.1</span>

<v-click>

**story 即测试**：Storybook 的 story 捕获组件状态，Chromatic **自动把每个 story 转成测试用例**。

</v-click>

<v-click>

**单次运行同时产出三类**

| 测试类型 | 怎么做 |
| --- | --- |
| 视觉测试 | 截图比对外观变化 |
| 交互测试 | 跑 story 的 `play` 函数 |
| 可访问性测试 | 跑 **axe** 引擎 |

</v-click>

<v-click>

> `@chromatic-com/storybook` addon 在 Storybook 内加 **Visual Tests 面板**：点 ▶️ 送云端拍照、面板看 diff、直接 Accept 更新基线。**拍照/比对/基线托管都在 Chromatic 云端**，addon 只是入口。

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Chromatic 最大卖点：你写 story 本来就是为了开发组件，Chromatic 白嫖这些 story 当测试用例，零额外成本。

[click] 一次运行三类测试是高频考点——不是只做视觉，还顺带跑 play 函数做交互测试、跑 axe 做 a11y。

[click] 关系纠偏：addon 装在 Storybook 里只是面板入口，真正拍照、比对、托管基线都在 Chromatic 云端，需要 project token 才能跑。
-->

---
transition: fade-out
---

# Chromatic：评审 + TurboSnap

baseline 签核与 Git 感知增量

<v-click>

**评审**：基线托管云端，评审界面**逐快照 Accept / Deny**，区分"改进"与"回归"，支持 UI Review 团队签核。

</v-click>

<v-click>

**TurboSnap**（Git 感知增量快照）

```text
启用：--only-changed  /  onlyChanged: true
四步：定位祖先构建 → 比对 Git 变更 →
      查 Webpack/Vite 依赖图找受影响 story →
      只拍这些 story，未变的从基线复制
```

</v-click>

<v-click>

- 靠**依赖图 + Git diff** 判定受影响 story，**不是看文件名变没变**
- 触发全量：version 改且无 lockfile / Storybook 配置改 / `--force-rebuild`
- 跳过的快照按常规 **1/5 计费**；merge/rebase 提交保守多拍

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 评审是逐快照 Accept/Deny，Chromatic 会帮你区分这次变化是改进还是回归，团队可以讨论签核。

[click] TurboSnap 是省钱核心：通过 Git 历史 + 构建依赖图，只对真正受改动影响的 story 拍快照，其余从上次基线复制。

[click] 易错点：TurboSnap 不是看"哪个文件名变了"，而是查 Webpack/Vite 依赖图判定"哪些 story 受影响"。跳过的快照只算 1/5 计费，merge/rebase 会保守多拍。
-->

---
transition: fade-out
---

# Chromatic：CI 集成

GitHub Actions + project token

<v-click>

```yaml
# .github/workflows/chromatic.yml
name: "Chromatic"
on: push
jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with: { fetch-depth: 0 }   # TurboSnap 需完整 Git 历史
      - uses: actions/setup-node@v6
      - run: npm ci
      - uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          onlyChanged: true        # 开 TurboSnap
```

</v-click>

<v-click>

- 用 `chromaui/action`，token 走 **`CHROMATIC_PROJECT_TOKEN`** secret
- `checkout` 必须 **`fetch-depth: 0`**，否则 TurboSnap 拿不到完整历史

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] CI 集成就这么一个 workflow：checkout（深拉历史）→ 装依赖 → chromaui/action 跑。

[click] 两个必记的点：token 走 CHROMATIC_PROJECT_TOKEN secret；checkout 必须 fetch-depth: 0，因为 TurboSnap 要回溯 Git 历史定位祖先构建，浅克隆会失败。
-->

---
transition: fade-out
---

# Chromatic：modes 多端基线

多视口 / 主题，每个 mode 独立基线

<v-click>

```ts
// .storybook/modes.ts
export const allModes = {
  mobile: { viewport: 'small' },
  'dark desktop': { theme: 'dark', viewport: 'large' },
}
```

```ts
// 某 story 里引用
parameters: { chromatic: { modes: { mobile: allModes.mobile } } }
```

</v-click>

<v-click>

- **每个 mode 有独立基线与独立签核**（按 **mode 名**而非底层值区分）
- 可在 project / component / story 层叠加，用 `disable: true` 关上层 mode

</v-click>

<v-click>

> **易错**：改 mode 名 = 新基线（旧基线作废）。一个组件配 3 个 mode = 3 条独立基线、3 次签核。

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] modes 是 Chromatic 做多视口、多主题覆盖的机制：在 modes.ts 定义 allModes，story 里引用。

[click] 关键：每个 mode 名对应一条独立基线和独立签核，按名字而非底层 viewport/theme 值区分；可以分层叠加。

[click] 易错点：改 mode 名等于建新基线、旧的作废。配几个 mode 就有几条基线、几次签核要审。
-->

---
transition: fade-out
---

# Playwright：两个 API 别混

<span class="text-sm op-70">toHaveScreenshot vs toMatchSnapshot（playwright 1.61.0）</span>

<v-click>

| API | 比什么 | 稳定化重试 |
| --- | --- | --- |
| `expect(page).toHaveScreenshot()` | **截图**视觉比对 | ✅ 自带连拍 |
| `expect(value).toMatchSnapshot()` | **文本/任意二进制** | ❌ 无 |

</v-click>

<v-click>

```ts
await expect(page).toHaveScreenshot('home.png')        // 截图，自带稳定化
expect(await page.title()).toMatchSnapshot('title.txt') // 文本，无稳定化
```

</v-click>

<v-click>

> **纠偏**：二者**不同名同义**。视觉回归只用 `toHaveScreenshot`；`toMatchSnapshot` 是文本/数据快照，没有连拍稳定化。diff 引擎是 **pixelmatch**。

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Playwright 里这两个 API 极易混：toHaveScreenshot 是截图视觉比对、自带稳定化重试；toMatchSnapshot 比的是文本或二进制数据、没有稳定化。

[click] 视觉回归一律用 toHaveScreenshot。toMatchSnapshot 留给文本快照场景（比如比 JSON、HTML 字符串）。底层 diff 用的是 pixelmatch。
-->

---
transition: fade-out
---

# Playwright：toHaveScreenshot 选项

<span class="text-sm op-70">PageAssertions 官方默认值（高频考点）</span>

<v-click>

| 选项 | 默认 | 作用 |
| --- | --- | --- |
| `threshold` | **`0.2`** | 单像素 YIQ 色差阈值（0严~1松） |
| `maxDiffPixels` / `...Ratio` | 未设 | 允许的不同像素 数 / 比例 |
| `mask` / `maskColor` | `#FF00FF` | 遮动态区 Locator[] / 遮盖色 |
| `animations` | **`"disabled"`** | 冻结 CSS 动画 |
| `caret` | **`"hide"`** | 隐藏光标 |

</v-click>

<v-click>

> **⚠️ 高频易错**：Playwright `threshold` 默认 **0.2**，底层 **pixelmatch 默认 0.1**——Playwright 覆盖了它。二者都用 YIQ，但默认数值不同。

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这张表是 Playwright 视觉回归的核心配置。注意 animations 默认 disabled、caret 默认 hide、maskColor 默认品红——这些是内建的稳定化默认值。

[click] 最高频的考点：threshold 默认 0.2。很多人记成 0.1，那是底层 pixelmatch 库自己的默认；Playwright 在上层覆盖成了 0.2。问"Playwright 视觉对比默认 threshold"答 0.2。
-->

---
transition: fade-out
---

# Playwright：threshold vs maxDiffPixels

两类参数语义完全不同

<v-click>

```ts
// playwright.config.ts
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      threshold: 0.2,            // 单像素色差容忍（默认）
      maxDiffPixelRatio: 0.01,   // 全图最多 1% 像素不同
      animations: 'disabled',    // 冻结动画（默认）
    },
  },
})
```

</v-click>

<v-click>

- **`threshold`**：**单个像素**判定"不同"的 YIQ 色差容忍（0~1）
- **`maxDiffPixels` / `maxDiffPixelRatio`**：**全图**允许的差异像素**数 / 比例**——兜底闸门

</v-click>

<v-click>

> 两者配合：`threshold` 控单像素灵敏度，`maxDiffPixelRatio` 限全图差异总量。常被当成一回事，其实**一个管单点、一个管总量**。

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 配置一般写在 playwright.config.ts 的 expect.toHaveScreenshot 里，全局生效。

[click] threshold 管的是"单个像素差多少算不同"，maxDiffPixels/Ratio 管的是"整张图最多容忍多少个/多大比例的不同像素"。

[click] 这俩常被混为一谈，记住：一个管单像素灵敏度，一个管全图差异总量，配合用——threshold 设默认 0.2，再用 maxDiffPixelRatio 兜个底。
-->

---
transition: fade-out
---

# Playwright：稳定化 + golden 命名

连拍到两帧一致，基线按 OS 分文件

<v-click>

**连拍自动稳定化**：took a bunch of screenshots until **two consecutive screenshots matched**，再落盘——**连续拍直到两帧一致**才比对，抹掉渲染时序抖动。

</v-click>

<v-click>

**golden 基线命名**

```text
{testName}-{browserName}-{platform}.png
例：example-test-1-chromium-darwin.png
```

- **按浏览器 + 平台分文件**，因渲染/字体跨平台不同
- 更新基线：`npx playwright test --update-snapshots`

</v-click>

<v-click>

> **易错**：macOS 生成 `*-chromium-darwin.png`，Linux CI 找的是 `*-chromium-linux.png`——后缀不同 → 找不到 / 渲染不一致。这是本地视觉测试最大的坑。

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Playwright 的稳定化机制：截图时连续拍多张，直到相邻两张完全一致才认为页面稳定下来，把最后一张落盘。这能抹掉 requestAnimationFrame、字体加载等时序抖动。

[click] 基线文件名带浏览器和平台后缀，因为字体、抗锯齿跨平台渲染不同。更新基线用 --update-snapshots。

[click] 最大的坑：开发机是 darwin 后缀，CI 是 linux 后缀，文件名对不上。后面"最佳实践"会讲用 Docker 统一环境解决。
-->

---
transition: fade-out
---

# 其它工具定位（讲清边界）

各家的位置与坑

<v-click>

| 工具 | 版本 | 定位 / 注意 |
| --- | --- | --- |
| **BackstopJS** | 6.3.25 / **2024-09** | 经典 OSS 像素 diff，**停滞 ~21 月**（反例） |
| **Percy** | `@percy/cli` 1.32.2 | BrowserStack 云，DOM 快照云渲染⚠️ |
| **Applitools** | eyes-playwright 1.47.9 | Visual AI，模拟人眼报"有意义差异" |
| **cypress** | `@simonsmith/...` v10 | 用维护版 fork，原版 jaredpalmer 已弃 |

</v-click>

<v-click>

- **Cypress 无原生视觉回归**：`cy.screenshot()` 只截图不比对，diff 靠第三方插件
- `@simonsmith/cypress-image-snapshot` 提供 `cy.matchImageSnapshot()`，基于 jest-image-snapshot（内部 pixelmatch）
- **Storybook 自身不做像素 diff**，官方视觉方案 = Chromatic

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] BackstopJS 曾是经典 OSS 像素 diff 工具，但最后一版停在 2024-09，已停滞约 21 个月，新项目别当首选。Percy、Applitools 是企业向云方案。cypress 要认准 @simonsmith 维护版 v10，原版 jaredpalmer 4.0.1 停在 2021 已弃。

[click] 边界纠偏：Cypress 自己没有原生视觉回归，cy.screenshot 只截图、不比对，要装第三方插件。Storybook 自身也不做像素 diff，官方视觉测试方案就是 Chromatic。
-->

---
transition: fade-out
---

# Applitools Match Level

Visual AI 的比对档位（默认 Strict）

<v-click>

| Match Level | 行为 |
| --- | --- |
| **Strict**（默认） | 人眼级，检测文本/字体/颜色/图形/位置 |
| **Layout** | 只验相对布局，忽略内容/颜色（动态内容） |
| **Content** | 类 Strict 但忽略颜色 |
| **Ignore Colors** | 忽略颜色，仍检测内容与布局（换肤） |
| **Exact** | 逐像素硬比，**不推荐常规用** |
| **Dynamic** | 自动抑制动态数据（邮箱/日期/卡号） |

</v-click>

<v-click>

> **对比**：默认 **Strict**（人眼级）而非 `Exact`（逐像素）；`Exact` 对人眼不可见的渲染差异也敏感，常规反而别用。这正是 Visual AI 区别于纯像素 diff 的地方。

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Applitools 的 Visual AI 提供多个 Match Level 档位：Strict 是默认、人眼级；Layout 只看布局忽略内容颜色，适合动态内容；Ignore Colors 适合换肤；Dynamic 自动识别动态数据。

[click] 高频对比考点：默认是 Strict 不是 Exact。Exact 是逐像素硬比，连人眼看不出的渲染差异都报，反而不推荐常规用——这恰恰说明 Visual AI 的卖点是"只报人会注意到的差异"。
-->

---
transition: fade-out
---

# Vue / Storybook 实战两条路

<span class="text-sm op-70">Vue 3 + Vite + Storybook 10.3.6</span>

<v-click>

**路线 A — Playwright 截组件页（本地免费）**

```ts
// 把 Vue 组件挂到独立页 / 截 Storybook iframe
await expect(page).toHaveScreenshot('button.png')
```
基线随仓库走（`*-chromium-darwin.png`），并入现有 E2E。

</v-click>

<v-click>

**路线 B — Storybook + Chromatic（云端，项目方向）**

```ts
// Button.stories.ts —— 每个 story 就是测试用例
export const Primary = { args: { variant: 'primary' } }
```
addon 在 Storybook 内看 diff，CI 用 `chromaui/action` 全量跑。

</v-click>

<v-click>

> **本项目接 Chromatic 只差两步**：配 `CHROMATIC_PROJECT_TOKEN` + 加 `chromaui/action` workflow（`@chromatic-com/storybook` addon 已装）。

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 路线 A：用 Playwright 把 Vue 组件挂到独立页面或直接截 Storybook 的 iframe，toHaveScreenshot 比对，基线入库。适合不想接云、想并入现有 E2E。

[click] 路线 B：每个 stories.ts 就是测试用例，addon 在 Storybook 内跑看 diff，CI 全量跑。基线托管云端、团队签核。

[click] 本项目现状：packages/ui 已经装了 addon，接 Chromatic 只差配 token + 加 workflow 两步。
-->

---
transition: fade-out
---

# flaky 来源 + Docker 固定环境

<v-click>

**flaky 主因**：跨 OS 字体渲染、动画未冻结、动态内容（时间/随机数）、光标闪烁、`requestAnimationFrame` 时序、子像素抗锯齿、GPU/无头差异。

**稳定化手段**：冻结动画 `animations:'disabled'`、隐藏光标 `caret:'hide'`、`mask` 遮动态区、连拍到两帧一致、按 OS 分存基线。

</v-click>

<v-click>

> **核心对策**：基线**用与 CI 一致的 Docker 镜像生成**（或只在 CI 容器内生成/更新）——消除 macOS 与 Linux 字体/抗锯齿分歧。

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 视觉回归易 flaky 的根源很多：跨 OS 字体、未冻结的动画、动态内容、光标闪烁、rAF 时序、子像素抗锯齿、GPU/无头差异。

[click] 对应手段：Playwright 默认就冻结动画、隐藏光标；再加 mask 遮动态区、连拍稳定化、按 OS 分基线。

[click] 最根本的对策是固定渲染环境：本地用与 CI 一致的 Docker 镜像生成基线，或只在 CI 容器里生成更新基线，从源头消除 darwin/linux 字体抗锯齿分歧。
-->

---
transition: fade-out
---

# 最佳实践

基线托管 vs 入库 · threshold 松紧 · mask

<v-click>

**基线该不该入库**

| 工具类型 | 基线策略 |
| --- | --- |
| 本地像素（Playwright/BackstopJS） | **入库**随 PR review，但须固定渲染环境 |
| 云端（Chromatic/Percy） | **托管云端不入库**，避免大二进制污染仓库 |

</v-click>

<v-click>

- **threshold 松紧**：太紧（→0）= 抗锯齿/亚像素噪声触发海量误报、flaky；太松（→1）= 漏真实回归。按项目调，配 `maxDiffPixelRatio` 兜底
- **动态内容用 mask**：时间戳/随机头像/广告/轮播 → 局部 `mask`，**而非放松全局 threshold**（后者会同时放过真实回归）

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 基线入库策略看工具类型：本地像素工具的基线 PNG 入库、随 PR 一起 review，但必须固定渲染环境；云端工具的基线托管在云端、不入库，避免大二进制污染仓库 + 跨机渲染分歧。

[click] threshold 要调到不松不紧：太紧抗锯齿噪声就误报、太松漏真回归，配 maxDiffPixelRatio 兜底。动态内容要用 mask 精准遮局部，绝不能靠放松全局 threshold——那样会连真实回归一起放过。
-->

---
transition: fade-out
---

# 反模式

<span class="text-sm op-70">别这么用</span>

<v-click>

**❌ 全站/整页截图做视觉回归** — `toHaveScreenshot({ fullPage: true })` 任意小改动触发整图 diff：噪声爆炸、定位难、审图累。**应按组件/区块粒度截小图**（Storybook story 级正好），稳定可定位。

</v-click>

<v-click>

**❌ 把视觉回归当万能、替代单元/快照**

| 测试 | 职责 | 特点 |
| --- | --- | --- |
| 单元 | 逻辑/纯函数/状态 | 快、定位准 |
| 快照（DOM） | 输出结构没乱 | 比文本、无像素噪声 |
| 视觉回归 | 外观/样式没坏 | 慢、易 flaky、定位粗 |

</v-click>

<v-click>

> 三者**互补**：视觉回归只负责"外观没坏"，**不能替代**单元/快照。

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 高频反模式：对整页 fullPage 大图做视觉回归。任意小改动都触发整图 diff，噪声爆炸、难定位、审图累。应按组件/区块粒度截小图，Storybook story 级别正好。

[click] 另一个反模式：把视觉回归当万能、想替代单元和快照测试。

[click] 三者是互补关系：单元测逻辑、快照测结构、视觉回归测外观。视觉回归慢、易 flaky、定位粗，只负责"外观没坏"，替代不了另外两个。
-->

---
layout: intro
transition: fade-out
---

# 总结速查

像素 diff · 两条主线 · 互补不替代

- **概念**：视觉回归 = 渲染像素图做 pixelmatch（YIQ + 自动忽略抗锯齿）diff，区别于 DOM 文本快照；流程 capture→compare→review→approve→update
- **Chromatic 17.5**：story 即测试，一跑出视觉+交互+a11y；`chromaui/action` + `CHROMATIC_PROJECT_TOKEN` + `fetch-depth:0`，TurboSnap 靠依赖图增量，modes 多端独立基线
- **Playwright 1.61**：`toHaveScreenshot`（threshold 默认 **0.2**、animations disabled、连拍稳定化、基线 `*-chromium-darwin.png`）vs `toMatchSnapshot`（文本）
- **其它**：BackstopJS 已停滞（反例）；Applitools 默认 **Strict**；cypress 用 `@simonsmith` v10，Cypress 无原生视觉
- **最佳实践**：Docker 固定渲染环境、动态内容用 mask、禁全站截图、视觉≠单元/快照

<div class="abs-br m-6 text-xl">
  <a href="https://playwright.dev/docs/test-snapshots" target="_blank" class="slidev-icon-btn">
    <carbon:image-search />
  </a>
  <a href="https://www.chromatic.com/docs/" target="_blank" class="slidev-icon-btn">
    <carbon:compare />
  </a>
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #60A5FA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
五条核心记忆点：
1. 视觉回归比像素图（YIQ + 忽略抗锯齿），区别于 DOM 文本快照，基线五步流程
2. Chromatic：story 即测试、一跑三类、TurboSnap 依赖图增量、token + fetch-depth:0
3. Playwright：toHaveScreenshot 默认 threshold 0.2、连拍稳定化、基线按 OS 分文件
4. 其它工具边界：BackstopJS 停滞、Applitools 默认 Strict、cypress 认准 @simonsmith v10
5. 最佳实践：Docker 固定环境、mask 动态内容、禁全站截图、视觉测试互补不替代
-->

---
layout: end
---
