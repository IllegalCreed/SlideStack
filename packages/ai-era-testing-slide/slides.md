---
theme: seriph
background: https://cover.sli.dev
title: AI 时代如何测试
info: |
  AI 时代如何测试：手工 / MCP 跑 e2e / AI 写用例，三件工具按场景配对

  取材《通用测试规范》+《通用测试规范-提示词集》
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center">
  <carbon:machine-learning-model class="text-8xl" />
</div>

<br/>

## AI 时代如何测试

三件趁手的工具 · 按场景配对，而非按自动化程度排序

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
这套幻灯片讲的是：AI 时代，我手上有三件趁手的测试工具——手工、让 AI 跑 e2e、让 AI 写框架用例。

核心主张只有一句：本事在于按「场景 + 阶段」把它们配对，而不是默认上最自动化的那个。三者平权，谁也不压谁。
-->

---
transition: fade-out
---

# 我的核心主张

AI 没取消测试纪律，只是让纪律更便宜

<v-click>

**三件工具，各擅其场，谁也不压谁**

- **手工测试** —— 判断力、主观体验、一次性走查，AI 替代不了的「人」的部分
- **MCP 让 AI 跑 e2e** —— 快速探索、即时验证的最优解
- **传统框架 + AI 写用例** —— 系统性回归、CI 门禁的归宿

</v-click>

<v-click>

> **我反对的**：把「AI 写用例」摆成质量底座/终点，做「手工 < MCP < AI 写用例」的高下阶梯。
> 决策是**按场景选**，不是**按自动化程度排序**。

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 先把立场摆明：三件工具平权，各有「就该用它」的场景。手工和 MCP 跟 AI 写用例一样有分量。

[click] 我明确反对把 AI 写用例当成终点、当成比手工和 MCP「更高级」。这套幻灯片后面给的是决策表，不是排行榜。一句话总纲：AI 让该有的纪律——分层、精确到 case、反向验证、回归网——以更低成本落地，并新增了「让 AI 直接驱动浏览器探索」这件以前做不到的事。
-->

---
transition: fade-out
---

# 传统流程：QA 当低级 bug 清道夫

AI 之前，测试链路的真实样子

<v-click>

```
研发写完功能
   │  自己点几下「能跑就行」
   ▼
甩给 QA ──▶ QA 先发现一堆「输入空值就崩」的低级 bug
   │                       └─▶ 退回研发 ──▶ 再甩 ──▶ 再退…（来回拉锯）
   ▼
漏覆盖的分支没人测、回归全靠人肉重点一遍
```

</v-click>

<v-click>

- **研发自测形同虚设**：写框架用例「太贵没人写」，提测即甩锅
- **QA 精力被低级 bug 吃掉**：本该做深度验证，却在当清道夫
- **回归是人肉**：每次发版手工重点一遍，覆盖凭记忆，漏的就漏了

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 AI 之前我见过的真实链路：研发点几下觉得「能跑」就甩给 QA，QA 第一波就发现一堆输入空值就崩的低级 bug，退回、再甩、再退，来回拉锯。

[click] 三个病根：研发自测形同虚设（系统性用例太贵没人写）、QA 被低级 bug 吃掉精力当清道夫、回归全靠人肉凭记忆。这不是态度问题，是「系统性测试太贵」这个经济账算不过来。
-->

---
transition: fade-out
---

# AI 时代：三种方式各被增强

不是「AI 接管用例」单主线

<v-click>

| 方式 | AI 之前 | AI 之后被增强成 |
| --- | --- | --- |
| **手工** | 凭经验点，覆盖看记忆 | 仍是判断力主场，AI 副手帮整理走查清单 |
| **MCP 跑 e2e** | 不存在这件事 | **新增**：AI 用自然语言直驱真实浏览器探索 |
| **AI 写用例** | 系统性用例太贵没人写 | 从「太贵」变「可落地」，回归网铺得起 |

</v-click>

<v-click>

> 关键变化：**自测 → 报告 → 准入**制度因为有了 AI 副手而**真能落地**，
> QA 终于被释放到深度验证。三种方式一起变好，不是谁取代谁。

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] AI 时代不是「AI 把用例都写了」这条单主线，而是三种方式各自被增强：手工仍是判断力主场，但 AI 能帮你整理走查清单；MCP 跑 e2e 是全新的、以前做不到的能力；AI 写用例让系统性测试从「太贵没人写」变成「写得起」。

[click] 最大的制度红利：自测→报告→准入这套流程以前因为「研发没空写系统用例」推不动，现在有 AI 副手，研发自测兜得住底线，QA 终于能去做深度验证而不是当清道夫。
-->

---
layout: section
transition: slide-up
---

# 三件工具登场

手工 · MCP 跑 e2e · AI 写框架用例

<!--
接下来分别介绍三件工具是什么。记住：它们是并列的三件，不是三个台阶。
-->

---
transition: fade-out
---

# 三件工具：是什么

并列三件，不是三个台阶

<v-click>

**① 手工测试** <carbon:user class="inline"/>
人去点、去看、去判断。探索性、主观体验、需求走查、准入抽查——靠的是「人」的判断力。

</v-click>

<v-click>

**② MCP 让 AI 跑 e2e** <carbon:bot class="inline"/>
Playwright MCP / Chrome DevTools MCP 让 AI 用**自然语言**驱动真实浏览器：导航、点击、填表、断言、截图、读 console、看网络。skills 把常用流程封装起来。

</v-click>

<v-click>

**③ 传统框架 + AI 写用例** <carbon:code class="inline"/>
AI 在懂需求/功能/白盒代码的前提下，按五层 + 提示词流程写**系统化框架用例**（Vitest / Playwright spec），进 CI 当门禁。

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 手工：就是人去点去看去判断，没有代码产物，靠人的判断力。

[click] MCP 跑 e2e：这是 AI 时代的新物种。Playwright MCP、Chrome DevTools MCP 让 AI 用自然语言直接开真浏览器操作，能导航点击填表、能断言截图、能读 console 和网络请求。skills 把常用流程沉淀成可复用的封装。

[click] AI 写框架用例：AI 在真正懂需求、懂功能、能读白盒代码的前提下，产出系统化的 Vitest/Playwright spec，这些 spec 进 CI 当长期门禁。三件并列，下面逐一展开它们各自最划算的场景。
-->

---
transition: fade-out
---

# 三方式中立对比：维度横扫

每种都有「自己真正赢」的列

<v-click>

| 维度 | 手工 | MCP 跑 e2e | AI 写框架用例 |
| --- | --- | --- | --- |
| 是否写代码 | 否 | 否（自然语言） | 是（spec 文件） |
| 可重复回归 | 弱 | 中（不稳） | **强** |
| 上手 / 出结果速度 | 中 | **最快** | 慢（要评审+实现） |
| 系统性 / 覆盖完整 | 弱 | 中 | **强** |
| 主观体验 / 判断力 | **强** | 弱 | 无 |
| 产物 | 结论 / bug 单 | 探索记录 / 截图 | CI 门禁 spec |

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这张表刻意保持中立：每一种方式都有一列是它真正赢的（加粗）。手工赢在主观体验和判断力，MCP 赢在速度，AI 写用例赢在可重复回归和系统性。没有哪一列是某种方式全包的。看到「弱」别急着判死刑——下一页讲它们各自什么时候最划算。
-->

---
transition: fade-out
---

# 三方式中立对比：什么时候最划算

这是决策的真正依据

<v-click>

| 方式 | 适合阶段 | 谁来做 | **它什么时候最划算** |
| --- | --- | --- | --- |
| **手工** | 需求早期 · 准入 · 发布冒烟 | 研发 / QA | 一次性走查、靠人判断的体验类、难自动化的真机/视觉 |
| **MCP 跑 e2e** | 开发中 · 自测冒烟 · bug 复现 | 研发 / AI | 还没写框架 e2e 时即时验证、让 AI 自己点点看哪坏 |
| **AI 写框架用例** | 开发全程 | 研发 / AI | 要长期守住的回归、核心/安全类、CI 门禁 |

</v-click>

<v-click>

> 一句话：**用 MCP 发现问题，用框架 spec 守住问题，用手工判断「值不值得」**。

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 「什么时候最划算」这一列才是决策依据。手工最划算在一次性走查和靠人判断的场景；MCP 最划算在还没写框架 e2e 时的即时验证、和让 AI 探索式点击；AI 写用例最划算在要长期守住的回归和 CI 门禁。

[click] 三者配合的口诀：MCP 发现问题、框架 spec 守住问题、手工判断这事值不值得做自动化。这就是配对，不是排序。
-->

---
layout: section
transition: slide-up
---

# 通用纪律

三方式都得守的原则与方法

<!--
在分别讲三件工具的场景前，先讲一遍三方式通用的纪律。这部分不偏向任何一种——无论你用手工、MCP 还是 AI 写用例，这些原则和方法都成立。
-->

---
transition: fade-out
---

# 通用原则：AI 没让它们过时，只是更便宜

不偏向任何一种方式

<v-click>

- **一致性**：确定可复现、环境隔离、不依赖自增 ID / 当前时间
- **独立性**：用例之间不互相依赖，各自精准清理，禁 truncate 全表
- **反向验证**：故意打 bug → 确认用例真会 fail，证明不是「假绿」
- **分级覆盖**：安全类 100% / 业务核心高 / 一般中，不追全局 100%

</v-click>

<v-click>

- **回归网**：每个修过的 bug 都沉淀成永久用例，同类问题不复发
- **bug-fail-first**：先写复现该 bug 的 fail 用例，再修，禁裸修复
- **精确到 case**：计划展开到 happy / 边界 / 异常 + 每个副作用分支

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这些原则在 AI 之前就是对的，AI 只是让它们更便宜地落地。一致性——同样输入同样结果，环境隔离，别依赖自增 ID 和系统时间。独立性——用例互不依赖、各扫门前雪、禁 truncate 全表。反向验证是关键防线：故意打个 bug 确认用例真会 fail。分级覆盖——安全类必须 100%，不盲目追全局 100%。

[click] 回归网——每个修过的 bug 永久留一个复现用例。bug-fail-first——先写能复现的 fail 用例、跑红、再修、再跑绿，禁止没有复现用例的裸修复。精确到 case——计划要展开到 happy/边界/异常，每个副作用分支都得有 case。
-->

---
transition: fade-out
---

# 通用方法：TDD / BDD

红绿重构 + Given-When-Then

<v-click>

**TDD —— 先红后绿再重构**

```
① 写 fail 用例 → 跑，确认它真的红（证明用例在守护）
② 写最小实现  → 跑，确认变绿
③ 重构        → 跑，保持绿（行为不变）
```

</v-click>

<v-click>

**BDD —— 用业务语言描述行为**

```
Given 已登录且购物车有 2 件商品
When  点击「提交订单」
Then  生成订单、状态=待支付、购物车被清空
```

</v-click>

<v-click>

> 这两套方法**三种方式都能用**：手工按 Given-When-Then 走查，
> MCP 让 AI 按场景驱动浏览器，框架 spec 把它落成可回归的代码。

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] TDD 红绿重构：先写一个会失败的用例、跑确认它真红（这一步证明用例确实在守护逻辑），再写最小实现让它变绿，最后重构保持绿。提示词集里的提示词 2 就是显式要求「先 fail 再实现，禁止先写实现再补测试」。

[click] BDD 用 Given-When-Then 把行为讲成业务语言，可读、可对需求。

[click] 重点：这两套方法不是框架用例专属。手工可以按 Given-When-Then 一步步走查，MCP 可以让 AI 按这个场景去驱动浏览器，框架 spec 则把它固化成能回归的代码。同一套思路，三种落地。
-->

---
transition: fade-out
---

# 通用方法：五层模型 + 准入制度

测什么放哪层 · 怎么交付

<v-click>

| 层 | 测什么 | 启动应用/DB |
| --- | --- | --- |
| L1 后端单元 | 纯逻辑，依赖全 mock | 否 |
| L2 后端集成 | 接口→service→DB 完整链路、鉴权 | 是 |
| L3 前端单元 | 纯函数 / composable / store | 否 |
| L4 前端组件 | mount 组件，渲染 + 交互状态机 | 否 |
| L5 端到端 | 真浏览器 + 真后端 | 是 |

</v-click>

<v-click>

> **自测 → 报告 → 准入**：研发跑完应跑层 + 覆盖率达标 + 反向验证 → 出报告 →
> QA 完整性核对 + 抽查复现，不达标**直接退回**，不当低级 bug 清道夫。

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 五层模型决定「测什么放哪层」：后端两层（单元 L1、集成 L2）、前端三层（单元 L3、组件 L4、端到端 L5）。底层多而快、顶层少而慢。L5 用例膨胀往往是本该下沉到低层的逻辑堆到了 e2e。

[click] 准入制度是交付纪律：研发跑完所有应跑层、覆盖率达标、做过反向验证，产出自测报告；QA 收到后先做完整性核对加抽查复现，任何一项不达标直接退回、不进排期。这就是把 QA 从清道夫释放出来的制度保障——AI 副手让研发这一侧真的做得到。
-->

---
layout: section
transition: slide-up
---

# 方式一：手工

把判断力用在刀刃上

<!--
现在分别讲三件工具各自最闪光的场景。先讲手工——它一点不低级，是 AI 替代不了的部分。
-->

---
transition: fade-out
---

# 手工：场景与阶段

这些场景就该手工，别上框架、别让 AI 跑

<v-click>

**最闪光的场景**

- **探索性测试**：没有脚本，凭直觉乱点，找「没人想到」的路径
- **UX 主观判断**：动效顺不顺、文案合不合适、手感对不对——只有人能判
- **需求验收走查**：对着需求一条条过，确认「做的是对的东西」
- **准入抽查复现**：QA 抽几个关键用例手工复现，确认报告属实
- **难自动化**：真机手势、视觉像素、摄像头/蓝牙等硬件交互

</v-click>

<v-click>

> **阶段**：需求早期 · 准入 · 深度验证 · 发布冒烟。
> 但——**能稳定复现的回归别一直手工**，沉淀成自动化，把人解放出来。

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 手工最闪光的五类场景：探索性测试（没脚本、凭直觉乱点，找没人预想的路径）；UX 主观判断（动效、文案、手感，机器判不了）；需求验收走查（确认做的是对的东西，而不只是代码没报错）；准入抽查复现（QA 手工跑几个关键用例确认报告属实）；难自动化的真机手势、视觉像素、硬件交互。这些场景上框架或让 AI 跑都是错配。

[click] 阶段集中在需求早期、准入、深度验证、发布冒烟。唯一的纪律提醒：能稳定复现的回归别一直靠手工重复，该沉淀成自动化——手工的价值在判断，不在当复读机。
-->

---
layout: section
transition: slide-up
---

# 方式二：MCP 让 AI 跑 e2e

以前做不到的事

<!--
第二件工具，也是 AI 时代的新物种：用 MCP 让 AI 直接驱动真实浏览器。
-->

---
transition: fade-out
---

# MCP 跑 e2e：场景与阶段

很多场景写框架 e2e 是杀鸡用牛刀

<v-click>

**最对的场景**（本仓已接 Playwright MCP / Chrome DevTools MCP）

- **快速冒烟**：改完一个页面，让 AI 跑一遍主流程看通不通
- **临时验证**：还没写框架 e2e，先用 MCP 即时验一把
- **探索性**：让 AI 自己点点看，哪里崩了它截图给你
- **bug 复现**：把复现步骤喂给 AI，它驱动浏览器重现
- **a11y / 网络快查**：读 console、看请求、跑 lighthouse

</v-click>

<v-click>

> **阶段**：开发中即时 · 自测冒烟 · bug 复现 · 验收 demo。
> 边界：可重复性/严格断言不如框架，**不是 CI 回归门禁的替代**。

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] MCP 最对的场景：快速冒烟（改完页面让 AI 跑一遍主流程）、临时验证（框架 e2e 还没写，先即时验一把）、探索性（让 AI 自己点、哪坏了截图给你）、bug 复现（喂步骤、AI 驱动浏览器重现）、a11y 和网络快查（读 console、看网络请求、跑 lighthouse）。这些场景写一个完整框架 spec 是杀鸡用牛刀，MCP 几句话就办了。本仓库已经接了 Playwright MCP 和 Chrome DevTools MCP，这是现实底座。

[click] 阶段在开发中即时、自测冒烟、bug 复现、验收 demo。但要清醒它的边界：可重复性和严格断言不如框架，它不是 CI 回归门禁的替代品。用它发现问题，别指望它长期守门。
-->

---
layout: section
transition: slide-up
---

# 方式三：AI 写框架用例

让系统性测试变得写得起

<!--
第三件工具：AI 在懂代码的前提下写系统化框架用例。它让系统性测试从「太贵没人写」变可落地——但同样有它的边界。
-->

---
transition: fade-out
---

# AI 写用例：场景与阶段

不是所有东西都值得为它买单

<v-click>

**最对的场景**

- **系统性覆盖**：核心 / 安全类逻辑，要的就是覆盖完整
- **回归网**：每个修过的 bug 配 fail 用例，永久留下
- **TDD 新功能**：先红后绿，AI 按计划逐 case 实现
- **重构保行为**：复用既有用例，证明行为不变
- **CI 长期门禁**：进流水线，每次提交都自动守

</v-click>

<v-click>

> **阶段**：开发全程。
> 价值：系统性测试从「太贵没人写」变可落地——但**别什么都为它买单**。

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] AI 写框架用例最对的场景：系统性覆盖核心和安全类逻辑、铺回归网（每个修过的 bug 配永久 fail 用例）、TDD 新功能（先红后绿、AI 按计划逐 case 实现）、重构保行为（复用既有用例证明行为不变）、CI 长期门禁。这些是它真正的主场。

[click] 阶段贯穿开发全程。它的价值是把系统性测试从「太贵没人写」变成「写得起」。但一定要记住：不是所有东西都值得为它买单——给一次性的小页面写一套完整 e2e spec，维护成本可能超过它的价值。下一页讲它最大的陷阱。
-->

---
transition: fade-out
---

# AI 写用例的陷阱：假绿用例

看着覆盖，实则不验证

<v-click>

```ts
it("提交订单", () => {
  submitOrder({ items: 2 })
  // 没有任何 expect！覆盖率 100%，却什么都没验
})
```

</v-click>

<v-click>

- 函数被调用 → 行 / 语句 / 函数覆盖**全绿**
- 返回值、副作用、状态变化**完全没断言**
- AI 很擅长写出这种「**让数字好看但不抓 bug**」的用例

</v-click>

<v-click>

> **两道防线**：① **反向验证**——故意打 bug，假绿用例不会 fail，当场暴露；
> ② **人评审粒度**——盯断言是否到位，而非只看覆盖率数字。

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这是 AI 写用例最大的坑：假绿用例。调用了函数但一个 expect 都没有。

[click] 这种用例让行、语句、函数覆盖全绿，但返回值和副作用一个都没断言。AI 在压力下特别擅长写这种「让覆盖率数字好看但抓不到 bug」的用例——因为它优化的是「测试通过」这个目标。

[click] 两道防线必须配上：第一是反向验证，故意往逻辑里打个 bug，真用例会 fail、假绿用例纹丝不动，当场就暴露；第二是人去评审断言粒度，看的是「断言够不够」而不是「覆盖率够不够」。这就是为什么前面说 AI 写用例不能当无人值守的底座。
-->

---
transition: fade-out
---

# 提示词集：把 AI 写用例工程化

不是「帮我写测试」一句话甩过去

<v-click>

```
plan → 评审 → TDD 实现 → 自测报告 → 准入 → PR review
 ①      ⑥        ②          ③        ④       ⑦
```

</v-click>

<v-click>

- **提示词 1**：写计划，逼 AI 展开到 case 级（禁「模块名粒度」）
- **提示词 2**：TDD 实现，显式「先写 fail 用例、跑红、再实现」
- **提示词 6**：计划评审，粒度不够当场退回
- **提示词 8**：覆盖率审计 + 反向验证，证明数字真实

</v-click>

<v-click>

> 把流程拆成可复制的提示词，AI 才不会一上来就写假绿用例。
> **工程化的不是 AI，是你用 AI 的方式**。

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 让 AI 写出好用例的关键，是把工作流拆成阶段：写计划→评审→TDD 实现→自测报告→准入→PR review，每个阶段对应一段可复制的提示词。

[click] 几段关键提示词：提示词 1 逼 AI 把计划展开到 case 级，禁止停在「新建 xxx 模块的 e2e」这种模块名粒度；提示词 2 显式要求 TDD「先写 fail 用例、跑确认红、再实现」；提示词 6 是计划评审，粒度不够当场退回；提示词 8 是覆盖率审计加反向验证，证明数字是真的。

[click] 一句话甩「帮我写测试」必然得到假绿用例。把流程工程化，AI 才靠谱。工程化的不是 AI 本身，是你驾驭 AI 的方式。
-->

---
layout: section
transition: slide-up
---

# 按场景决策

不按自动化程度，按场景配对

<!--
最后回到核心：怎么选。给一张按场景的决策表——注意它是「按场景选」，不是「按自动化程度排序」。
-->

---
transition: fade-out
---

# 决策表：场景 → 选哪种

横轴是场景，不是「谁更高级」

<v-click>

| 场景 | 首选 | 为什么 |
| --- | --- | --- |
| 动效 / 文案 / 手感是否舒服 | **手工** | 主观体验只有人能判 |
| 改完页面想立刻看通不通 | **MCP** | 几句话即时验，最快 |
| 让 AI 自己探索哪里会崩 | **MCP** | 探索性 + 自动截图 |
| 难复现的 bug 想重现 | **MCP** | 喂步骤驱动浏览器 |
| 核心 / 安全类要覆盖完整 | **AI 写用例** | 系统性 + 可回归 |
| 进 CI 长期守住的回归 | **AI 写用例** | 门禁 spec 不漂移 |
| 一次性走查 / 需求验收 | **手工** | 不值得自动化 |

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 这张决策表横轴是场景，不是「谁更高级」。主观体验类（动效文案手感）选手工；即时验证、探索式找崩、难复现 bug 重现都选 MCP；核心安全类的完整覆盖、进 CI 长期守的回归选 AI 写用例；一次性走查和需求验收回到手工。

注意三种方式在表里都各占两三行——它们是平权的，没有哪一种是「兜底默认」或「最终归宿」。选哪个看的是这一行的场景特征，不是这一行的自动化程度。
-->

---
transition: fade-out
---

# 一个功能，三件工具同时在场

它们是配合，不是竞争

<v-click>

**以「订单提交」功能为例**

1. **AI 写用例**：L1 校验逻辑 + L2 扣库存链路 + L5 下单 e2e，进 CI 守回归
2. **MCP 跑 e2e**：开发中改一处，让 AI 跑一遍主流程快速冒烟
3. **手工**：上线前走查——下单成功的动效、提示文案、慢网络下的手感

</v-click>

<v-click>

- 出了 bug？**MCP 先复现** → **AI 补 fail 用例进回归网** → 修复
- 三件工具在**同一个功能的不同时刻**各司其职，没有谁取代谁

</v-click>

<v-click>

> 这才是 AI 时代测试的常态：**不是三选一，是三个一起上，各管一段**。

</v-click>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
[click] 用一个订单提交功能把三件工具串起来：AI 写用例负责 L1 校验、L2 扣库存链路、L5 下单 e2e 进 CI 守回归；开发过程中改一处就用 MCP 让 AI 跑一遍主流程快速冒烟；上线前用手工走查动效、文案、慢网络下的手感。

[click] 出了 bug 的闭环：MCP 先复现，AI 补一个 fail 用例进回归网，再修复。三件工具在同一个功能的不同时刻各司其职。

[click] 这就是 AI 时代测试的常态——不是三选一，是三个一起上、各管一段。
-->

---
layout: intro
transition: fade-out
---

# 总结

三件工具 · 按场景配对 · 不排高下

- **三者平权**：手工 / MCP 跑 e2e / AI 写用例，各有「就该用它」的场景
- **手工**：判断力、主观体验、一次性走查——AI 替代不了的「人」
- **MCP**：快速探索、即时验证、bug 复现——以前做不到的新能力
- **AI 写用例**：系统性回归、CI 门禁——但警惕假绿，靠反向验证 + 人评审
- **决策按场景**：MCP 发现问题，框架 spec 守住问题，手工判断值不值
- **纪律没过时**：分层 / 精确到 case / 反向验证 / 回归网，AI 让它们更便宜

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #A78BFA 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
六条核心记忆点：
1. 三件工具平权，各有就该用它的场景，不排高下
2. 手工管判断力和主观体验，AI 替代不了
3. MCP 跑 e2e 是 AI 时代的新能力，管快速探索和即时验证
4. AI 写用例管系统性回归和 CI 门禁，但要警惕假绿用例
5. 决策按场景配对：MCP 发现、框架 spec 守住、手工判断值不值
6. 测试纪律没被取消，AI 只是让分层、精确到 case、反向验证、回归网更便宜地落地
-->

---
layout: end
---
