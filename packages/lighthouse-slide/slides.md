---
theme: seriph
background: https://cover.sli.dev
title: Lighthouse 完全指南
info: |
  Google Lighthouse 完全指南：网页质量审计 · 四类审计 · 六指标 · CLI/CI/PSI

  Learn more at [https://developer.chrome.com/docs/lighthouse](https://developer.chrome.com/docs/lighthouse)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Lighthouse 完全指南

Google 网页质量审计 · 四类审计 · 六指标 · Lighthouse 13

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Lighthouse 是 Chrome 团队维护的开源网页质量审计工具，2025 年 10 月发布当前稳定大版本 Lighthouse 13。
-->

---
transition: fade-out
---

# 什么是 Lighthouse

Google 开源的**网页质量审计工具**

- **官方基准**：Chrome 团队维护，DevTools 内置、PageSpeed Insights 底层引擎
- **四类一锅端**：Performance / Accessibility / Best Practices / SEO 一次审完
- **0–100 评分**：绿 90+ / 橙 50–89 / 红 0–49
- **可操作清单**：每条 audit 给「问题 + 建议 + 节省时间估算」
- **多形态运行**：DevTools / CLI / Node Module / PSI / CI / 扩展
- **lab 工具**：单次模拟，与 CrUX 真实用户 field 数据互补

> Lighthouse ≠ Core Web Vitals 真实用户体验。

<!--
强调 lab vs field 的本质区别：Lighthouse 是模拟器，CrUX 才是真实用户分布。
-->

---

# 四类审计

| 类别 | 关注 | 典型 audit |
|------|------|------|
| **Performance** | 加载与交互性能 | LCP / TBT / CLS / FCP / INP |
| **Accessibility** | 残障用户可用性 | 对比度 / alt / label / ARIA |
| **Best Practices** | 工程规范 | HTTPS / 控制台错误 / 缓存 |
| **SEO** | 搜索抓取 | title / meta / robots / hreflang |

每类都是 0–100 分，颜色编码统一：

- 绿 90+ = Good
- 橙 50–89 = Needs Improvement
- 红 0–49 = Poor

<!--
Performance 最常盯，但 Accessibility / SEO 同样计入分数不可忽视。
-->

---

# 六大指标阈值

| 指标 | Good | Needs Improvement | Poor |
|------|------|------|------|
| **LCP** | ≤ 2.5s | 2.5–4s | > 4s |
| **INP** | ≤ 200ms | 200–500ms | > 500ms |
| **CLS** | ≤ 0.1 | 0.1–0.25 | > 0.25 |
| **FCP** | ≤ 1.8s | 1.8–3s | > 3s |
| **TBT** | ≤ 200ms | 200–600ms | > 600ms |
| **TTFB** | < 800ms | 800–1800ms | > 1800ms |

> 阈值是单指标的 Good/NI/Poor，≠ Performance 评分（0–100）。

<!--
指标阈值与 Lighthouse 评分容易混淆，重点强调 LCP=2.5s 对应约 90 分而非 100。
-->

---

# LCP：最大内容绘制

页面最大「内容块」完成绘制的时刻

- 测量对象：**最大图像 / 文本块 / video 首帧 poster**
- Good ≤ **2.5s**，Poor > 4s

**优化方向**

- 降低 TTFB（CDN / SSR / 边缘渲染）
- `<link rel="preload">` 关键资源
- 避免渲染阻塞（压缩关键 CSS 内联）
- 图像优化：明确尺寸 + `srcset` + WebP / AVIF
- hero 图**不要懒加载**

> Lighthouse 13 的 `lcp-phases-insight` 拆成 TTFB / 资源 / 阻塞 / 绘制 四阶段。

<!--
LCP 优化的核心是「让 hero 元素尽快出现」。
-->

---

# INP：交互到下次绘制

用户交互到浏览器**下次绘制**的端到端时间

- 测量：input delay + processing + presentation delay
- 取整个生命周期**所有交互的高百分位**（不是平均）
- Good ≤ **200ms**

**INP vs FID（重要区别）**

| 维度 | FID（已废弃） | INP |
|------|------|------|
| 对象 | 仅首次输入 | 所有交互 |
| 阶段 | input delay 一段 | 端到端 |
| 取值 | 单次 | 高百分位 |

> 2024-03-12 INP 正式取代 FID 成 Core Web Vital。

<!--
强调 INP 是端到端、覆盖所有交互，比 FID 严格得多。
-->

---

# CLS：累计布局偏移

页面生命周期内**布局偏移分数的累计**（非时间）

- Good ≤ **0.1**，Poor > 0.25
- 分数 = 影响比例 × 距离比例

**常见成因**

- 图片 / iframe / 广告位**无 width/height**
- **字体加载**导致文本位移
- **动态注入**内容把已有元素推开（含 SSR hydration）

**优化方向**

- 所有视觉元素都给尺寸（`aspect-ratio`）
- 字体 `font-display: optional` 或 `preload`
- 动态内容用 `min-height` 占位
- 避免在已有内容上方插入

<!--
Lighthouse 13 的 cls-culprits-insight 直接列出每个偏移的贡献元素。
-->

---
layout: two-cols
---

# FCP / TBT

**FCP（首次内容绘制）**

- 浏览器首次绘制**任意**内容
- Good ≤ 1.8s
- 与 LCP 区别：FCP 任意内容 vs LCP 最大块

**TBT（总阻塞时间）**

- 主线程 **> 50ms 任务**的超时部分累加
- Good ≤ 200ms；**仅 lab**
- 是 INP 的代理指标
- 拆长任务、`scheduler.yield()`

::right::

# TTFB

**TTFB（首字节时间）**

- 请求发起到首字节到达
- 阈值 < 800ms
- **不计入评分**
- 通过 FCP / LCP 间接影响分数

**优化方向**

- CDN / 边缘节点
- SSR / 静态化
- HTTP/2、缓存

<!--
TBT 是 Lighthouse 权重最高的指标（30%），降 TBT 是最高性价比优化。
-->

---

# 评分权重与曲线（v12+）

| 指标 | 权重 |
|------|------|
| **TBT** | **30%** |
| **LCP** | **25%** |
| CLS | 15% |
| FCP / Speed Index / INP | 各 10%（INP v12+） |

**评分曲线**：log-normal，源自 HTTP Archive 真实数据

- 25th 百分位 → **50 分**（median），8th 百分位 → **90 分**（green）
- 0.96 分附近 = 边际收益递减拐点

> TBT + LCP 合计 55%，是性价比最高的两个抓手。

<!--
按权重定优化优先级，别盲目刷 100 分。
-->

---

# 四种运行方式

| 方式 | 入口 | 适用 |
|------|------|------|
| **DevTools** | 面板栏 → Lighthouse | 本地调试 |
| **CLI** | `npx lighthouse <url>` | 脚本化、批量 |
| **Node Module** | `import lighthouse` | 集成自有工具 |
| **PSI** | pagespeed.web.dev | 公网监测 |
| **LHCI** | `lhci collect/assert` | CI 防回归 |
| **扩展** | Chrome Web Store | 不开 DevTools |

> PageSpeed Insights 同时给 lab（Lighthouse）+ field（CrUX）数据。

<!--
Lighthouse 不是单点工具，而是覆盖本地 → CI → 公网的全链路。
-->

---

# CLI 速跑

```bash
# 最常用：跑 Performance，开浏览器
npx lighthouse https://example.com \
  --only-categories=performance --view

# 桌面模式（默认移动）
npx lighthouse https://example.com --preset=desktop

# 同时输出 json + html
npx lighthouse https://example.com \
  --output=json --output=html --output-path=./report

# 关闭节流（仅诊断用，别和默认 simulate 比）
npx lighthouse https://example.com --throttling-method=provided
```

> Lighthouse 13 需 Node 22.19+，低版本启动失败。

<!--
节流方式直接改变指标值，跨运行对比必须固定 throttling-method。
-->

---

# Lighthouse CI（LHCI）

CI 防回归的官方方案，命令链：healthcheck → collect → assert → upload

`.lighthouserc.json` 最小配置：

```json
{
  "ci": {
    "collect": { "url": ["https://example.com"], "numberOfRuns": 5 },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }]
      }
    }
  }
}
```

**三级 level**：`off` / `warn`（exit 0）/ `error`（exit 非零，CI 失败）

> `aggregationMethod` 默认 `optimistic`（最易过），CI 防回归应改 `median-run`。

<!--
LHCI assertion 默认 optimistic 是大坑，必须显式指定 median 或 median-run。
-->

---

# PageSpeed Insights

[pagespeed.web.dev](https://pagespeed.web.dev) 同时给两种数据

- **Lab（Lighthouse）**：Performance / Accessibility / Best Practices / SEO 评分
- **Field（CrUX）**：真实用户 LCP / INP / CLS / FCP 的 **p75 分位数**

**两边都达标才算真正稳**

- Lab 高 Field 低 → 真实分布比模拟差
- Lab 低 Field 高 → 测试环境偏慢或样本不典型

> CrUX 报 p75（75th percentile），不是平均。

<!--
PSI 是把 lab 与 field 拼到一处的最易用入口。
-->

---
layout: quote
---

# 跑分波动 ≠ 代码回归

「先排除 A/B 测试、广告、网络路由、扩展、杀软、设备差异等环境因素，再下回归结论。」

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 把 lab 分当真实用户体验（CrUX 才是 field p75）
- 关节流刷高分再和默认 simulate 比
- 把 100 当目标（99→100 ≈ 90→94 改进量）
- 用 Lighthouse 测 INP（lab 通常无交互，需 `onINP` 在 field 测）
- 混淆 FID 与 INP（FID 2024-03-12 已下线）
- 混淆指标阈值与 Lighthouse 评分
- 以为 TTFB 直接计入评分（实际只是 audit）
- 忽视 Node 版本（Lighthouse 13 需 22.19+）
- LHCI 断言引用 v13 已删除的 audit ID（`first-meaningful-paint` 等）

<!--
跑分波动先排查环境因素，再下回归结论。
-->

---
layout: center
class: text-center
---

# 小结

Lighthouse = 模拟环境的网页质量标尺

四类审计 · 六大指标 · CLI/CI/PSI · Lighthouse 13

**TBT + LCP 优先 · lab/field 互补 · LHCI 用 median-run**

[文档](https://developer.chrome.com/docs/lighthouse/overview) · [Scoring Calculator](https://googlechrome.github.io/lighthouse/scorecalc) · [GitHub](https://github.com/GoogleChrome/lighthouse)

<!--
掌握按权重定优先级 + lab/field 互补，就能把 Lighthouse 用到生产水准。
-->
