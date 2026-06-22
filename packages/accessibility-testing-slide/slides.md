---
theme: seriph
background: https://cover.sli.dev
title: 可访问性测试
info: |
  前端可访问性测试全指南：axe-core 4.12 + WCAG 2.2

  Learn more at [https://www.w3.org/TR/WCAG22/](https://www.w3.org/TR/WCAG22/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:accessibility class="text-8xl" />
</div>

<br/>

## 可访问性测试

让所有人都能用 · axe-core 4.12 + WCAG 2.2

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
可访问性（Accessibility，缩写 a11y）测试，验证应用对残障用户、键盘用户、屏幕阅读器用户是否可用。
今天讲面向 Vue 3 + Vite 项目的 a11y 测试全链路：从标准 WCAG 2.2、引擎 axe-core 4.12，到单元 / 组件 / E2E / CI 各层落地。
-->

---
transition: fade-out
---

# a11y 测试是什么 · 为何重要

让残障用户也能平等使用 Web

<v-click>

- **a11y = Accessibility**（首尾字母 a…y 中间 11 个字符）：验证视障 / 听障 / 肢体障碍 / 认知障碍 / 键盘 / 屏幕阅读器用户能否使用
- **不是锦上添花**：欧盟 EN 301 549、美国 Section 508 / ADA 都把 **WCAG AA** 作为法律合规线
- **测试金字塔的横切关注点**：单元 / 组件 / 集成 / E2E 各层都能跑 axe，向上延伸到人工 + AT 审计

</v-click>

<v-click>

> 核心心态：**自动化是「地板」不是「天花板」**——它减少人工成本，但永远无法替代人工

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] a11y 这个缩写来自 Accessibility——首字母 a、尾字母 y，中间省略 11 个字母。它覆盖的用户群体远不止盲人：色盲、聋人、运动障碍、键盘 only、读屏软件用户都算。

法律层面：EN 301 549（欧盟）、Section 508 与 ADA（美国）都把 WCAG AA 级作为强制合规目标，不达标可能被起诉。

a11y 是横切关注点：金字塔每一层都能注入 axe 检查，再往上是人工和辅助技术（AT）审计。

[click] 记住这句话——自动化是地板不是天花板。后面我们会反复强调这一点。
-->

---
transition: fade-out
---

# 自动化能覆盖多少？双口径

约一半甚至更多必须靠人工

<v-click>

| 口径 | 数据 | 来源 / 方法 |
| --- | --- | --- |
| **问题实例** | **~57%** | Deque：2000+ 审计 / 13000+ 页 / ~30 万问题，axe 自动命中 57.38% |
| **单工具 / 准则** | **~30-40%** | GOV.UK / GDS：143 个已知障碍，最佳单工具 37%(Tenon)/41%(Asqatasun) |

</v-click>

<v-click>

- 口径不同 → 数字不同：Deque 按**问题实例数**，GDS 按**单工具命中的准则**
- GDS 还发现 **29% 的障碍所有工具都漏检**
- **安全表述**：无论哪种口径，**约一半甚至更多仍需人工补足**

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是最容易被误传的数据，必须分别署名、不能合并成一个数字。

Deque（axe-core 的母公司）的研究：跨 2000 多次审计、1.3 万多个页面、约 30 万个问题，axe 自动命中了 57.38% 的问题实例——注意口径是「问题实例数」。

英国政府数字服务（GDS）做了另一个实验：构造一个有 143 个已知障碍的「全世界最不可访问网页」，用 10 个工具去扫，最好的单工具 Tenon 命中 37%、Asqatasun 命中 41%——口径是「单工具命中的准则比例」。

[click] 所以你会看到 30-40% 和 57% 两个数字，它们不矛盾，只是口径不同。GDS 还发现 29% 的障碍连所有工具一起上都漏检。

最稳的说法：无论哪种口径，约一半甚至更多的问题仍然需要人工。
-->

---
transition: fade-out
---

# 标准基线：WCAG 2.2 + POUR

法律与实践通行目标是 AA 级

<v-click>

- **WCAG 2.2**：W3C Recommendation，**2023-10-05 初次定稿**；当前对标仍是 2.2（3.0 还是 Working Draft）
- **POUR 四原则**：Perceivable 可感知 / Operable 可操作 / Understandable 可理解 / Robust 健壮
- **三级 A / AA / AAA**：**AA 是法律与实践通行目标**，AAA 不要求全站达标

</v-click>

<v-click>

> **总 86 条**成功准则：2.2 较 2.1 新增 9 条、移除 1 条（4.1.1 Parsing 已标记 obsolete）
> 慎用「87」——那是漏减了 4.1.1

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] WCAG = Web Content Accessibility Guidelines。当前权威版本是 2.2，2023 年 10 月 5 日成为正式 Recommendation。WCAG 3.0 还在 Working Draft 阶段，所以工程上对标的仍然是 2.2。

POUR 是四大原则的首字母：可感知、可操作、可理解、健壮。每条成功准则都归到这四个原则之下。

合规级别有 A、AA、AAA 三档。实践中 AA 是通行目标——前面提到的所有法规都引用 AA。AAA 太严格，不要求全站达标。

[click] 一个容易出错的数字：WCAG 2.2 总共 86 条成功准则。它在 2.1 基础上新增 9 条、移除 1 条（4.1.1 Parsing 被标记为废弃）。9 减 1，所以是净增 8、总 86。如果你看到 87，那是有人忘了减掉 4.1.1。
-->

---
transition: fade-out
---

# WCAG 2.2 新增准则速览

多与键盘 / 焦点 / 触控目标相关

<v-click>

| 准则 | 级别 | 含义 |
| --- | --- | --- |
| 2.4.11 Focus Not Obscured | AA | 聚焦元素不被遮挡 |
| 2.5.7 Dragging Movements | AA | 拖拽操作要有单指替代 |
| 2.5.8 Target Size (Min) | AA | 触控目标 **≥ 24×24 CSS px** |
| 3.3.7 Redundant Entry | A | 不重复要求已填信息 |
| 3.3.8 Accessible Authentication | AA | 认证不靠记忆 / 转录 |

</v-click>

<v-click>

> 注意：**2.4.11、2.4.3 焦点顺序、2.4.7 可见焦点几乎只能人工测**——工具量不出「焦点是否被遮挡 / 顺序是否合理」

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] WCAG 2.2 新增的 9 条里，挑 5 条最常考的。可以看到它们大量集中在键盘、焦点、触控目标这几个主题。

2.4.11 Focus Not Obscured：聚焦的元素不能被固定头部 / 浮层完全遮住。
2.5.7 Dragging：拖拽排序之类的操作要提供单指点击替代。
2.5.8 Target Size：可点击目标至少 24×24 CSS 像素——这一条 axe 有规则能查尺寸。
3.3.7 Redundant Entry：多步表单不要让用户重复填同样的信息。
3.3.8 Accessible Authentication：登录验证不能强迫用户靠记忆或手动转录。

[click] 关键提醒：焦点相关的几条——2.4.11 是否被遮挡、2.4.3 焦点顺序、2.4.7 焦点是否可见——基本只能人工测。自动化工具量不出「顺序是否合理」这种语义判断。
-->

---
transition: fade-out
---

# WAI-ARIA：补语义的最后手段

第一法则：能用原生 HTML 就别用 ARIA

<v-click>

- **WAI-ARIA 1.2**（Recommendation, 2023-06-06）是当前版本，1.3 仍是草案
- 三类构件：**roles** 角色 `role="dialog"` / **states** 状态（运行时高频变，如 `aria-expanded`）/ **properties** 属性（较静态，如 `aria-label`）

</v-click>

<v-click>

```html
<!-- ❌ 重造按钮：丢了键盘、焦点、语义 -->
<div role="button" tabindex="0">提交</div>

<!-- ✅ ARIA 第一法则：原生优先 -->
<button>提交</button>
```

> ARIA 最直接服务 **WCAG 4.1.2 Name / Role / Value**；但**语法对 ≠ 语义对**，错用比不用更糟

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] WAI-ARIA 是给富交互组件补充语义的规范。当前版本是 1.2，2023 年 6 月成为 Recommendation，1.3 还在草案。

它提供三类构件：roles 是角色，比如 role="dialog"；states 是状态，运行时高频变化，比如 aria-expanded、aria-checked；properties 是属性，相对静态，比如 aria-label、aria-labelledby。states 和 properties 都用 aria- 前缀，区别在于变不变。

[click] ARIA 第一法则：能用原生 HTML 语义就别用 ARIA。左边用 div + role="button" 重造按钮，你得自己补 tabindex、补键盘事件、补焦点样式，漏一个就是 bug；右边一个原生 button 全都自带。

ARIA 最直接对应 WCAG 4.1.2 Name/Role/Value。但要记住——语法对不等于语义对，错误的 ARIA 会误导屏幕阅读器，比不写还糟。
-->

---
transition: fade-out
---

# axe-core 引擎原理

对「渲染后的 DOM」跑规则

<v-click>

- **axe-core 4.12.1**（2026-06-10，独立库最新）：客户端 JS 引擎，**对实时渲染后的 DOM 运行**（不是源码）
- 每条 rule 用 CSS selector 选元素，跑三组 checks：**any**(≥1 过) / **all**(全过) / **none**(全失败)
- **只评估渲染内容**（含视觉隐藏），**跳过 `display:none` 与失活区**以减少误报
- 遍历嵌套 **iframe** + 开放 **shadow DOM**

</v-click>

<v-click>

> 因为跑在真实 DOM 上，所以**对比度等渲染相关规则**只在浏览器层可靠，jsdom 不行（后面详述）

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] axe-core 是这套链路的引擎，所有工具都是它的封装。独立库最新版是 4.12.1，2026 年 6 月发布。

它是一个客户端 JavaScript 引擎，关键点：对实时渲染后的 DOM 运行，而不是分析源码。所以它能看到运行时动态加进来的内容。

每条规则用 CSS 选择器选出目标元素，然后跑三组检查：any 表示至少一个检查通过即可、all 表示所有检查都要通过、none 表示这些检查必须全部失败（即不能命中违规模式）。

它只评估会被渲染的内容（包括视觉上隐藏但仍占位的），主动跳过 display:none 和被禁用的区域，这样能大幅减少误报。它还会遍历嵌套的 iframe 和开放的 shadow DOM。

[click] 正因为它跑在真实 DOM 上，依赖布局和样式的规则（典型就是颜色对比度）只有在真正的浏览器里才可靠，jsdom 这种没有布局引擎的环境算不准——这是后面的重点坑。
-->

---
transition: fade-out
---

# axe.run() 的返回结构

四个数组，最易混的是后两个

<v-click>

```js
const results = await axe.run(document)
// { url, timestamp, testEngine, testEnvironment,
//   violations, passes, incomplete, inapplicable }
```

</v-click>

<v-click>

| 字段 | 含义 |
| --- | --- |
| `violations` | 确定失败的规则 |
| `passes` | 通过的规则 |
| `incomplete` | **有匹配元素但无法判定**，需人工复核 |
| `inapplicable` | **页面无匹配元素**，规则根本没运行 |

</v-click>

<v-click>

> ⚠️ 最易混：**incomplete（有元素、不确定） ≠ inapplicable（无元素） ≠ 通过**

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] axe.run() 返回一个 Promise，resolve 出一个结果对象。除了元数据（url、时间戳、引擎、环境），核心是四个数组。

[click] violations 是确定失败的规则，这是你要断言为空的。passes 是通过的。

重点在后两个。incomplete，文档里也叫 "needs review"：页面上有匹配该规则的元素，但 axe 因为技术限制或 JS 报错没法下定论，需要人工复核。inapplicable：页面上压根没有匹配该规则的元素，所以规则没运行。

[click] 这是 axe 最容易混淆的点：incomplete 是「有元素但不确定」，inapplicable 是「没有元素」，两者都不等于「通过」。把 incomplete 当通过会放过潜在问题，把 inapplicable 当通过则毫无意义——它只是说这条规则今天用不上。
-->

---
transition: fade-out
---

# violation 节点形状 + impact 四级

impact = 失败检查中的最高级

<v-click>

```js
// violations[i] 节点
{ id, impact, tags, description, help, helpUrl,
  nodes: [{ html, target, failureSummary, any, all, none }] }
// target 嵌套数组 = iframe / shadow DOM 层级
```

</v-click>

<v-click>

| impact（低 → 高） | 例 |
| --- | --- |
| `minor` | empty-heading |
| `moderate` | region / heading-order |
| `serious` | aria-hidden-focus |
| `critical` | button-name / aria-required-attr |

</v-click>

<v-click>

> 规则上报的 impact = 其失败检查中**最高的那一级**；通过结果的 impact 为 `null`

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 每个 violation 节点的形状：id 是规则 ID，impact 是影响级别，tags 是标签数组，description/help/helpUrl 是人类可读的说明和文档链接。nodes 是命中的具体 DOM 节点列表，每个节点有 html 源码、target 选择器、failureSummary 失败摘要，以及 any/all/none 三组检查的详情。

注意 target 是嵌套数组时，表示元素位于 iframe 或 shadow DOM 的层级路径。

[click] impact 有四级，从低到高背下来：minor 小于 moderate 小于 serious 小于 critical。举例：空标题是 minor、缺地标 / 标题乱序是 moderate、aria-hidden 元素可聚焦是 serious、按钮没名字 / 缺必需属性是 critical。

[click] 一条规则上报的 impact，取它所有失败检查里最高的那一级。通过的结果 impact 是 null。后面做门禁时，我们就靠这个 impact 分级决定 fail 还是 warn。
-->

---
transition: fade-out
---

# tags 过滤 + 默认含 best-practice

标签是 OR（并集）过滤

<v-click>

- 每条规则恰有**一个版本+级别标签** *或* `best-practice`，外加 SC 号、`cat.*` 分类
- 常见标签：`wcag2a` `wcag2aa` `wcag21aa` `wcag22aa` `best-practice` `section508` `experimental`(默认禁用)

</v-click>

<v-click>

```js
// A 和 AA 都要 → 必须都列出（OR 并集）
const r = await axe.run(document, {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
})
```

</v-click>

<v-click>

> ⚠️ **纠偏**：axe-core **库本身默认会跑 best-practice**；默认排除的是 `experimental` + 9 条显式 `enabled:false`（AAA 对比度增强等）。「默认不含 best-practice」只对**包装工具**和老 2.x/3.x 成立

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 每条规则有一组 tags。每条规则恰好带一个「版本+级别」标签（比如 wcag2aa）或者带 best-practice，再加上对应的成功准则号和 cat.* 分类标签（cat.aria、cat.color、cat.forms 等）。

常见标签：wcag2a、wcag2aa 是 2.0 的 A 和 AA，wcag21aa 是 2.1 AA，wcag22aa 是 2.2 AA，best-practice 是非 WCAG 的最佳实践，section508、experimental（默认禁用）。

[click] 关键：标签是 OR、也就是并集过滤。如果你想同时查 A 级和 AA 级，必须把 wcag2a 和 wcag2aa 都列进 values 数组——只写一个 wcag2aa 是查不到 A 级问题的。这是高频坑。

[click] 重要纠偏：很多人以为 axe 默认不跑 best-practice，这对 axe-core 库本身是错的。库默认会跑 best-practice 规则。它默认排除的只有 experimental 标签，以及 9 条被显式设成 enabled:false 的规则（AAA 的对比度增强、已弃用的几条等）。「默认不含 best-practice」只对某些包装 CLI 预设和老旧的 axe 2.x/3.x 成立。
-->

---
transition: fade-out
---

# 单元 / 组件层（一）：jest-axe

自定义 matcher 必须先 expect.extend

<v-click>

- **jest-axe 10.0.0**（2025-03）→ 依赖**精确锁 axe-core 4.10.2**（非 `^`，重装不升）

```js
const { axe, toHaveNoViolations } = require('jest-axe')
expect.extend(toHaveNoViolations)        // 不加 → matcher 不存在
expect(await axe(container)).toHaveNoViolations()
```

</v-click>

<v-click>

- README 明确：**Color contrast 在 JSDOM 下不工作，已在 jest-axe 中关闭**
- Vitest 里可跑（expect 兼容），但**官方未声明、未测**

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 进入落地层。单元 / 组件测试最经典的是 jest-axe，当前 10.0.0。注意它把 axe-core 锁死在 4.10.2——是精确版本号不是 caret，所以你重装依赖也不会升级，规则永远停在 4.10.2，比独立的 4.12.1 滞后。

用法两步：第一步 expect.extend(toHaveNoViolations) 注册自定义 matcher，第二步 expect(await axe(container)).toHaveNoViolations()。漏掉 expect.extend，matcher 就不存在、直接报错。（也可以 require 'jest-axe/extend-expect' 一步搞定。）

[click] README 白纸黑字写了：颜色对比度在 JSDOM 下不工作，jest-axe 已经主动关闭这条规则——印证了前面 axe 依赖真实布局的原理。

jest-axe 在 Vitest 里也能跑（expect API 兼容），但官方没声明支持、也没测试，算是「能用但不保证」。
-->

---
transition: fade-out
---

# 单元 / 组件层（二）：Vitest 选型

Vitest 推荐直接用 axe-core

<v-click>

| 方案 | 版本 / 状态 | 建议 |
| --- | --- | --- |
| `vitest-axe` | **卡在 0.1.0**(2022)，1.0.0-pre 从未正式发 | 半停滞，是 jest-axe 的 fork |
| **直接 `axe-core`** | 吃**最新 4.12.1** | ⭐ Vitest 用户最稳 |

</v-click>

<v-click>

```ts
import axe from 'axe-core'
// 自行断言，规则永远最新
expect((await axe.run(container)).violations).toEqual([])
```

</v-click>

<v-click>

> jsdom 噪声（如对比度）可临时关：`axe.run(c, { rules: { 'color-contrast': { enabled: false } } })`

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] Vitest 用户常想找一个 jest-axe 的对应物，那就是 vitest-axe——它本身就是 jest-axe 的 fork。但它半停滞了：稳定版还卡在 0.1.0、2022 年发布、依赖 axe-core ^4.4.2；1.0.0-pre.5 虽然 2025 年初出过、依赖更新到 ^4.10.2，但从未正式 release，npm i vitest-axe 默认装的还是 0.1.0。

所以 Vitest 最稳的方案其实是直接用 axe-core，它能吃到最新的 4.12.1 规则集，你自己写断言。

[click] 一行断言：expect((await axe.run(container)).violations).toEqual([])。好处是规则永远跟着 axe-core 走，不被包装库拖后腿。

[click] jsdom 环境下对比度这类规则会产生噪声，临时关掉的写法是在 run 的第二参数里把对应规则 enabled 设 false。但更好的做法是把对比度检查挪到 Playwright 浏览器层——下一页讲。
-->

---
transition: fade-out
---

# jsdom 的对比度坑

布局相关规则只信浏览器层

<v-click>

- jsdom **没有布局引擎**，算不出元素的实际渲染颜色 / 尺寸
- 所以 **color-contrast** 等规则在 jsdom 下**不可靠**（axe issue #595，jest-axe 干脆关闭）

</v-click>

<v-click>

**分工原则**

| 层 | 环境 | 适合查 | 不适合 |
| --- | --- | --- | --- |
| 组件 | jsdom | 结构 / ARIA / 名称 / 角色 | 对比度 / 尺寸 |
| E2E | 真实浏览器 | **对比度 / 尺寸 / 焦点** | （慢，跑关键页） |

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 单独拎一页强调这个坑，因为它太常见了。jsdom 是 Node 里模拟 DOM 的库，但它没有布局引擎——它不会真的计算元素的位置、尺寸、最终渲染颜色。

因此依赖这些信息的规则，最典型的就是 color-contrast 颜色对比度，在 jsdom 下结果不可靠。这在 axe 的 issue #595 里有记录，jest-axe 索性默认关闭这条规则。

[click] 正确的分工：组件层用 jsdom，专心查结构、ARIA、可访问名、角色这些不依赖布局的东西；对比度、触控目标尺寸、焦点可见性这些依赖真实渲染的，放到 E2E 的真实浏览器层去查。E2E 慢，所以只在关键页面跑。这条分层原则贯穿整个 a11y 测试策略。
-->

---
transition: fade-out
---

# E2E 层（一）：@axe-core/playwright

AxeBuilder 链式 API

<v-click>

- **@axe-core/playwright 4.11.3**（2026-04-30，bundle axe-core ~4.11.4，故略滞后独立 4.12.1）

```ts
import AxeBuilder from '@axe-core/playwright'   // 默认导出
const r = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa'])              // 按标签过滤「哪些规则跑」
  .analyze()                                     // 返回完整 axe.Results
expect(r.violations).toEqual([])
```

</v-click>

<v-click>

- `.include()/.exclude()` 限范围 · `.withRules(ids)` 仅跑某些 · `.disableRules(ids)` 压制已知违规
- ⚠️ Deque README 把 `.withTags()` 误写「按 rule ID」——**以 Playwright 官方为准：按标签**

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] E2E 层第一个工具：@axe-core/playwright，当前 4.11.3。它 bundle 了 axe-core ~4.11.4，按所 bundle 的版本命名，所以比独立的 4.12.1 略滞后。

用法：默认导入 AxeBuilder，构造时传 { page }，链式调用。withTags 按标签过滤要跑哪些规则——同样记得 A 和 AA 都要列。analyze() 返回完整的 axe.Results 对象，并自动注入所有 iframe。所以断言时取 r.violations。

[click] 其他常用方法：include / exclude 用 CSS 选择器限定范围、可链式累加；withRules 只跑指定的规则 ID；disableRules 跳过指定规则，常用来临时压制已知违规。

一个坑：Deque 的 README 把 withTags 误写成「按 rule ID 过滤」，这是复制粘贴 bug。以 Playwright 官方文档为准——withTags 是按标签，要按 rule ID 请用 withRules / disableRules。
-->

---
transition: fade-out
---

# E2E 层（二）：cypress-axe

injectAxe → checkA11y，顺序关键

<v-click>

- **cypress-axe 1.7.0**（2025-08）→ axe-core 是 **peer**（`^3 || ^4`，需自装）

```js
beforeEach(() => {
  cy.visit('/')
  cy.injectAxe()          // 必须 visit 之后、checkA11y 之前
})
it('a11y', () => {
  cy.checkA11y('#main', null)   // 有违规即断言失败
})
```

</v-click>

<v-click>

`checkA11y(context, options, violationCallback, skipFailures)` 四参顺序：
范围 → axe 选项 → 违规回调（副作用） → **skipFailures（默认 false；true = 关断言只 console 记录，用于渐进整改）**

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] E2E 第二个工具：cypress-axe，当前 1.7.0。注意它把 axe-core 列为 peer 依赖（^3 || ^4），本身零运行时依赖，所以你得自己装 axe-core——这点和 @axe-core/playwright 自带 bundle 不同。

用法：在 beforeEach 里先 cy.visit() 打开页面，再 cy.injectAxe() 把 axe 运行时注入页面。顺序关键——injectAxe 必须在 visit 之后、任何 checkA11y 之前，否则注入失败。然后在测试里 cy.checkA11y() 触发检查，有违规就断言失败。

[click] checkA11y 有四个参数，顺序要记牢：第一个 context 是检查范围、第二个 options 是 axe 选项（还扩展了 includedImpacts、retries 等）、第三个 violationCallback 是违规回调用来做副作用比如打印、第四个 skipFailures 默认 false。把 skipFailures 设成 true 会关掉断言、只在 console 记录违规——这是渐进整改老项目时的临时手段，让 CI 先不红，但违规仍可见。
-->

---
transition: fade-out
---

# CI 层（一）：pa11y

默认引擎是 htmlcs，不是 axe

<v-click>

- **pa11y 9.1.1**（Node 20+，Puppeteer ^24）/ **pa11y-ci 4.1.1**：扫 URL / HTML
- **两引擎**：`htmlcs`(HTML_CodeSniffer) + `axe`，**默认 runner = htmlcs**、默认标准 **WCAG2AA**

</v-click>

<v-click>

```bash
pa11y https://example.com --runner axe   # 切到 axe 引擎
pa11y https://example.com --reporter json --threshold 9
```

</v-click>

<v-click>

- **pa11y-ci** 扫多 URL / sitemap，配置 `.pa11yci`（JSON：`defaults` + `urls[]`）
- `--threshold`（默认 0，超出退出码 2）、`--sitemap` 自动抓站点地图

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] CI / 批量扫描层第一个工具：pa11y，当前 9.1.1，要求 Node 20+、底层用 Puppeteer ^24 驱动 headless Chromium。配套的 pa11y-ci 4.1.1 专门跑批量。

关键知识点：pa11y 支持两个引擎，htmlcs（HTML_CodeSniffer）和 axe。它默认用的是 htmlcs，不是 axe！默认标准是 WCAG2AA。这是高频考点——别想当然以为 pa11y 默认跑 axe。

[click] 想用 axe 引擎得显式加 --runner axe。常用还有 --reporter json 出机器可读报告、--threshold 设允许的违规数。

[click] pa11y-ci 用来扫多个 URL 或整个 sitemap，配置写在 .pa11yci 文件里，是 JSON 格式，有 defaults 公共配置和 urls 列表。--threshold 默认 0，违规数超过就以退出码 2 失败、阻断 CI；--sitemap 能自动抓取站点地图里的所有页面。
-->

---
transition: fade-out
---

# CI 层（二）：Lighthouse + LHCI

a11y 类别底层就是 axe-core

<v-click>

- **Lighthouse 13.4.0** 的 a11y 类别**底层依赖 `axe-core ^4.12.0`**（package.json 是最硬证据）
- 约 73 条计分审计（axe 子集）+ 独立手动审计区；**评分 = pass/fail 二元、无部分分，权重取自 axe impact**

</v-click>

<v-click>

```js
// lighthouserc.js — LHCI 门禁
module.exports = {
  ci: { assert: { assertions: {
    'categories:accessibility': ['error', { minScore: 0.9 }]
  } } }
}
```

</v-click>

<v-click>

> ⚠️ **@lhci/cli 0.15.1 内含 Lighthouse 12.6.1**，≠ 独立的 13.4.0；断言级别 `off | warn | error`

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] CI 层第二个：Lighthouse，当前 13.4.0。它的 a11y 类别底层就是 axe-core——最硬的证据是它 package.json 依赖 axe-core ^4.12.0。它跑大约 73 条计分审计（是 axe 规则的一个子集），外加一块独立的手动审计提示区。

评分机制要记住：每条审计是 pass 或 fail 的二元结果，没有部分分；总分是所有审计按权重的加权平均，权重取自 axe 的 impact 影响等级。所以高 impact 的审计失败扣分更多。

[click] LHCI（Lighthouse CI）做门禁的写法：在 lighthouserc.js 里对 categories:accessibility 设断言，['error', { minScore: 0.9 }] 表示分数低于 0.9 就以 error 失败、阻断合并。断言级别有 off、warn、error 三档。

[click] 一个版本坑：@lhci/cli 0.15.1 内部打包的是 Lighthouse 12.6.1，不等于你单独 npm 装的 lighthouse 13.4.0。CI 里和本地手跑可能版本不一致，结果也可能有出入。
-->

---
transition: fade-out
---

# Vue 实战：坏例 → 修复

div 假按钮的三宗罪

<v-click>

```vue
<!-- ❌ BAD：不可聚焦 / 无 role / 无键盘 / 图标按钮无名 -->
<div class="icon-btn" @click="$emit('remove')">
  <i class="i-carbon-trash-can" />
</div>
```

lint 报 `click-events-have-key-events` + `no-static-element-interactions`

</v-click>

<v-click>

```vue
<!-- ✅ GOOD：原生 button + aria-label，图标隐藏 -->
<button type="button" aria-label="删除该项" @click="$emit('remove')">
  <i class="i-carbon-trash-can" aria-hidden="true" />
</button>
```

</v-click>

<v-click>

> 改真实 `<button>` 由 axe **button-name** 保证可达；图标按钮无名会触发 **aria-command-name**；`<img>` 无 alt 触发 **image-alt**

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 落到 Vue 实战。最经典的坏例：用 div 加 @click 做的「假按钮」。它有三宗罪：不可聚焦（没 tabindex）、没有 role 语义、没有键盘支持（回车 / 空格触发不了），而且这个图标按钮没有可访问名。静态分析阶段 eslint 就会报 click-events-have-key-events 和 no-static-element-interactions 两条。

[click] 修复就是换回原生 button：button 自带可聚焦、自带 button role、自带键盘激活。因为里面只有图标没有文字，得用 aria-label 给它一个可访问名「删除该项」，同时把装饰性的图标 aria-hidden="true" 藏掉、避免读屏重复念。

[click] 串一下规则：换成真实 button 后，axe 的 button-name 规则保证它有可访问名；如果图标按钮还是没名字，会触发 aria-command-name；类似地，img 没有 alt 属性会触发 image-alt（装饰图用 alt="" 空字符串）。lint 在编辑器里左移拦一道，axe 在运行时再兜一道。
-->

---
transition: fade-out
---

# 左移：eslint-plugin-vuejs-accessibility

静态分析 template，不需要浏览器

<v-click>

- **eslint-plugin-vuejs-accessibility 2.5.0**（约 22-23 条规则，源自 axe-core + WCAG 2.1 + ARIA）
- **lint 静态分析 `<template>`**（无渲染），与 runtime axe **互补**——一个查源码、一个查 DOM

</v-click>

<v-click>

```js
// eslint.config.js (flat)
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility'
export default [
  ...pluginVueA11y.configs['flat/recommended'],
]
```

</v-click>

<v-click>

> 代表规则：`alt-text` / `form-control-has-label` / `click-events-have-key-events` / `no-autofocus` / `aria-role` / `tabindex-no-positive`

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 把检查再往左移到编辑器和 pre-commit，靠 eslint-plugin-vuejs-accessibility，当前 2.5.0，大约 22-23 条规则，规则来源是 axe-core + WCAG 2.1 + ARIA。

它是纯静态分析 Vue 的 template，不启动浏览器、不渲染。所以它和 runtime 的 axe 是互补关系：lint 查源码里的明显问题（写代码时就报红），axe 查渲染后 DOM 的实际违规（包括动态生成的）。两者都要有。

[click] flat config 接入很简单，导入插件后展开 configs['flat/recommended']。

[click] 代表规则：alt-text 查图片替代文本、form-control-has-label 查表单控件有无标签、click-events-have-key-events 就是前面那个假按钮的规则、no-autofocus 禁自动聚焦、aria-role 查 role 合法性、tabindex-no-positive 禁止正值 tabindex（会打乱焦点顺序）。
-->

---
transition: fade-out
---

# Testing Library：查询即 a11y 检查

按 role / label 查询，天然促进可访问

<v-click>

- **@testing-library/vue 8.1.0** 比 `@vue/test-utils` 更 a11y 友好
- `getByRole('button', { name })` / `getByLabelText()` **仅在标记可访问时才匹配**

</v-click>

<v-click>

```ts
import { render } from '@testing-library/vue'
import axe from 'axe-core'
const { container } = render(MyComponent, { props: { label: 'Save' } })
// div@click 用 getByRole('button') 找不到 → 查询本身就是 a11y 检查
expect((await axe.run(container)).violations).toEqual([])
```

</v-click>

<v-click>

> jest-dom（`toHaveAccessibleName` / `toBeVisible`）查「单元素」，axe 查「整体违规」——互补

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 组件测试选 Testing Library（@testing-library/vue 8.1.0）而非 @vue/test-utils，因为它的查询 API 天然促进可访问性。

getByRole('button', { name }) 和 getByLabelText() 这类查询，只有当元素真的可访问时才能匹配到。换句话说，你想测一个按钮、就得用 getByRole('button')，如果它是 div 假按钮就根本查不到——查询本身就变成了一道 a11y 检查。这逼着你写出可访问的标记。

[click] 配合 axe 用：render 拿到 container，喂给 axe.run 限定检查范围，断言 violations 为空。

[click] 再补一句分工：jest-dom 的 matcher 比如 toHaveAccessibleName、toBeVisible 是查「某个具体元素」有没有可访问名、可不可见；axe 是查「整体页面 / 组件」有没有违反 WCAG。粒度不同，互补使用。
-->

---
transition: fade-out
---

# 分层门禁 + 违规分级

把不同检查放对层、按 impact 分轻重

<v-click>

| 层 | 工具 | 关注 |
| --- | --- | --- |
| 编辑器 / pre-commit | eslint-plugin-vuejs-accessibility | 静态左移 |
| 单测 | axe.run（跳对比度） | 结构 / ARIA |
| CI | @axe-core/playwright · cypress-axe · pa11y-ci · LHCI | 关键页回归 + 对比度 |

</v-click>

<v-click>

**违规分级处置**

- `critical` / `serious` → **硬门禁**（CI fail）
- `moderate` / `minor` → 先 warn / 排期
- `incomplete` → **单独输出供人工复核**，不当通过；渐进整改用 `skipFailures` / `disableRules` 但留 backlog

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 把前面所有工具串成一套分层门禁。编辑器和 pre-commit 跑 eslint 插件做静态左移、最便宜；单元 / 组件测试跑 axe.run、但跳过对比度（jsdom 不准）、专注结构和 ARIA；CI 里跑浏览器层工具——@axe-core/playwright、cypress-axe、pa11y-ci、LHCI——对关键页做回归，对比度只在这一层信。

[click] 违规不要一刀切，按 impact 分级处置：critical 和 serious 设硬门禁、直接让 CI 失败；moderate 和 minor 先 warn 或排进 backlog、不阻断；incomplete 单独输出一份清单交给人工复核，绝不当成通过。

接手老项目做渐进整改时，可以用 skipFailures 或 disableRules 临时缩小范围、让 CI 先绿，但一定要把这些临时豁免记进 backlog、有计划地清掉，别让它变成永久的地毯。
-->

---
transition: fade-out
---

# 零违规 ≠ 完全可访问

自动化是地板，人工是天花板

<v-click>

**axe 跑过、零违规，但下面这些它根本测不了 ——**

| 只能人工 / AT 测 | 为什么 |
| --- | --- |
| 键盘可达 / 无陷阱 (2.1.1/2.1.2) | 需真实 Tab 操作 |
| 焦点顺序 / 可见焦点 (2.4.3/2.4.7) | 语义判断 |
| 屏幕阅读器实际体验 | NVDA / JAWS / VoiceOver |
| alt 是否「有意义」 | 工具只查存在与否 |
| ARIA 语义是否正确 | 语法对 ≠ 语义对 |
| **颜色是否唯一信息载体** (1.4.1) | 工具只查对比度**数值** |

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是整套幻灯片最重要的一页：零违规不等于完全可访问。axe 报告全绿，下面这些它压根测不了——

键盘可达和无陷阱（2.1.1 / 2.1.2）：得有人真的用 Tab 走一遍。
焦点顺序和可见焦点（2.4.3 / 2.4.7）：顺序合不合理是语义判断，工具量不出。
屏幕阅读器的实际体验：必须用 NVDA、JAWS、VoiceOver 真听一遍。
alt 文本是否「有意义」：工具只能查 alt 属性存不存在，查不出「图片.jpg」这种废话 alt。
ARIA 语义是否正确：语法合法不代表语义对，错误的 role 工具不一定报。
还有特别容易误解的一条——颜色是否是唯一的信息载体（1.4.1）。注意：对比度数值是可以自动测的，但「是不是只用颜色区分状态、没有文字 / 图标辅助」这种判断，工具做不了。

所以再说一遍：自动化是地板，人工和 AT 审计是天花板。
-->

---
transition: fade-out
---

# 反模式清单

踩过的坑，逐条避开

<v-click>

- ① 在 **jsdom 里信 color-contrast**（布局不准，jest-axe 已关）
- ② 把 **inapplicable 当通过** / 把 **incomplete 当通过**（都不是通过）
- ③ 用 **jest-axe(锁 4.10.2) / vitest-axe(0.1.0)** 却不知规则滞后
- ④ **withTags 只列一个标签**就以为覆盖 A+AA（OR 需都列）

</v-click>

<v-click>

- ⑤ **injectAxe 漏在 visit 之后**（注入失败）
- ⑥ 以为 **axe 默认不含 best-practice**（库本身含）
- ⑦ 把 **@lhci/cli(含 LH 12.6.1) 当独立 lighthouse 13.x**
- ⑧ **div@click 假按钮** / 图标按钮无 aria-label / tabindex 用正值乱序

</v-click>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 八条反模式一次过。

① 在 jsdom 里相信颜色对比度的结果——布局不准，jest-axe 干脆关了它。
② 把 inapplicable 当通过、或把 incomplete 当通过——前者是没元素、后者是不确定，都不是通过。
③ 用 jest-axe（锁 4.10.2）或 vitest-axe（卡 0.1.0）却没意识到它们的规则集比独立 axe 滞后。
④ withTags 只写一个标签就以为覆盖了 A 和 AA——标签是 OR，必须都列。

[click] ⑤ injectAxe 没放在 visit 之后，导致注入失败、checkA11y 报错。
⑥ 以为 axe 默认不跑 best-practice——库本身是跑的，只有包装工具和老版本不跑。
⑦ 把 @lhci/cli 内含的 Lighthouse 12.6.1 当成独立的 13.x，版本对不上、结果有差异。
⑧ 各种坏标记：div@click 假按钮、图标按钮不给 aria-label、tabindex 用正值打乱焦点顺序。
-->

---
layout: intro
transition: fade-out
---

# 总结

一个引擎 · 分层落地 · 自动化是地板

- **引擎**：axe-core **4.12.1**，对渲染后 DOM 跑规则；所有工具都是它的封装
- **返回四数组**：violations / passes / **incomplete(有元素不确定)** / **inapplicable(无元素)**
- **覆盖边界**：~30-40%(GDS) / ~57%(Deque)，**约一半仍需人工**；标准对标 **WCAG 2.2 / AA**
- **单测**：Vitest 直接用 axe-core 吃最新；jest-axe 锁 4.10.2、对比度在 jsdom 不可靠
- **E2E / CI**：@axe-core/playwright `withTags` + cypress-axe `injectAxe`；pa11y 默认 htmlcs；Lighthouse 底层 axe-core
- **门禁**：lint 左移 + impact 分级（critical/serious 硬挡）；**零违规 ≠ 完全可访问**

<div class="abs-br m-6 text-xl">
  <a href="https://www.w3.org/TR/WCAG22/" target="_blank" class="slidev-icon-btn">
    <carbon:accessibility />
  </a>
  <a href="https://github.com/dequelabs/axe-core" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 {
  background-color: #0E7490;
  background-image: linear-gradient(45deg, #0E7490 10%, #22D3EE 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
七条核心记忆点：
1. axe-core 4.12.1 是引擎，对渲染后 DOM 跑规则，所有工具都是它的封装
2. run() 返回四数组，incomplete（有元素不确定）和 inapplicable（无元素）都不是通过
3. 覆盖边界双口径 30-40% / 57%，约一半仍需人工；标准对标 WCAG 2.2 AA
4. Vitest 直接用 axe-core 吃最新规则；jest-axe 锁 4.10.2，对比度在 jsdom 不可靠、放浏览器层
5. E2E 看 @axe-core/playwright 的 withTags 和 cypress-axe 的 injectAxe 顺序
6. CI 里 pa11y 默认 htmlcs 而非 axe，Lighthouse a11y 底层就是 axe-core
7. 分层门禁 + impact 分级，但永远记住零违规不等于完全可访问
-->

---
layout: end
---
