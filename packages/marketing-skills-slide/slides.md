---
theme: seriph
background: https://cover.sli.dev
title: Marketing Skills
info: |
  Corey Haines 个人出品的社区项目（MIT，非官方）——
  面向 technical marketers 的 47 个营销 agent skills。
  coreyhaines31/marketingskills，社区事实标准。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Marketing Skills

**Corey Haines 个人社区项目**——营销 agent 技能集（47 skill）

<div class="pt-6 opacity-80">
coreyhaines31/marketingskills · CRO · 文案 · SEO · AI-SEO · ads · email · 留存 · growth · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/coreyhaines31/marketingskills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #e11d48 10%, #f97316 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Marketing Skills 是 Corey Haines 个人出品的社区项目，MIT 开源，非官方。47 个 skill 覆盖营销全栈，是社区最流行的事实标准。面向会用 agent 的 technical marketers 和 founders。
-->

---
transition: fade-out
---

# 定位：是谁、什么、多少

<v-clicks>

- **谁出品**：Corey Haines 个人（[Conversion Factory](https://conversionfactory.co) 创始人）+ 社区贡献——**非官方、无公司背书**
- **给谁用**：technical marketers 和 founders——会用 Claude Code / Codex / Cursor / Windsurf 的营销人
- **多少**：**47 个 skill**，每个一份 `SKILL.md`，遵循 [agentskills.io](https://agentskills.io)
- **地位**：社区最流行、**事实标准**（marketing-skills.com）
- **许可**：MIT，自由用

</v-clicks>

<div v-click class="mt-4 text-center text-sm opacity-80">

装：`npx skills add coreyhaines31/marketingskills`

</div>

<style>
h1 { background: linear-gradient(45deg, #e11d48 10%, #f97316 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
如实说明：这是个人社区项目，不是 Anthropic / OpenAI / Google 官方。但因覆盖广、维护勤、社区采用度高，是营销 agent skills 的事实标准。MIT 许可任意使用。
-->

---
transition: fade-out
---

# product-marketing 是地基

每个 skill 启动前先读它

```text
                ┌──────────────────────────┐
                │    product-marketing      │
                │  （所有 skill 启动前先读） │
                └────────────┬─────────────┘
        ┌──────────┬─────────┼─────────┬──────────┬──────────┐
        ▼          ▼         ▼         ▼          ▼          ▼
     SEO&内容    CRO     文案&邮件  付费&衡量   留存&增长   销售&战略
```

<v-clicks>

- 上下文文件：`.agents/product-marketing.md`（兼容 `.claude/` 与旧名）
- 没建 → 每个 skill 都重新问你产品 / 受众 / 定位
- 第一件事：`Create my product marketing context`

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #e11d48 10%, #f97316 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Marketing Skills 47 个 skill 不是平铺——product-marketing 是地基，记录产品/受众/定位/voice，其他 skill 启动前都先读它。第一件事是建这个上下文文件。
-->

---
transition: fade-out
---

# 47 skill · 按领域分类

<div class="grid grid-cols-2 gap-4 mt-2 text-xs leading-tight">
<div>

**CRO 转化**
- cro · signup · onboarding
- popups · paywalls

**Content & Copy**
- copywriting · copy-editing
- cold-email · emails · social
- image · video · sms

**SEO & 发现**
- seo-audit · ai-seo
- programmatic-seo · site-arch
- competitors · schema · aso

</div>
<div>

**Paid & 测量**
- ads · ad-creative
- analytics · ab-testing

**留存 & 增长**
- churn-prevention · community
- co-marketing · free-tools
- referrals · lead-magnets
- marketing-loops

**战略 & 销售**
- marketing-ideas / -psychology
- launch · pricing · offers
- revops · sales-enablement
- prospecting · pr · council

</div>
</div>

<div v-click class="mt-2 text-center text-xs opacity-80">

skill 互相交叉引用——`copywriting ↔ cro ↔ ab-testing`，`seo-audit ↔ schema ↔ ai-seo`

</div>

<style>
h1 { background: linear-gradient(45deg, #e11d48 10%, #f97316 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
47 skill 按营销领域分类：CRO、文案、SEO、付费、测量、留存、增长、战略、销售。skill 之间互相交叉引用，不是孤岛。
-->

---
transition: fade-out
---

# CRO：按影响顺序优化

`cro` skill 的分析顺序

| # | 维度 | 重点 |
| --- | --- | --- |
| 1 | 价值主张清晰度 | 5 秒能看懂这是什么 / 为何要在乎 |
| 2 | 标题有效性 | 传核心价值、具体、匹配流量源 messaging |
| 3 | CTA 位置/文案/层级 | 单一主 CTA、首屏可见、按钮传价值 |
| 4 | 视觉层级 | 引导眼动到主 CTA |
| 5 | 信任 / 信用 | logo 墙、证言、数据 |
| 6 | 摩擦 | 表单字段、步骤、认知负荷 |

<div v-click class="mt-3 text-center text-sm opacity-80">

强标题：`Get [outcome] without [pain]` · `Join 10,000+ teams who…` · 带数字 / 时间窗

</div>

<style>
h1 { background: linear-gradient(45deg, #e11d48 10%, #f97316 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
CRO 按影响从高到低排：价值主张清晰度、标题、CTA、视觉层级、信任、摩擦。最高影响是价值主张——5 秒说不清就重写。
-->

---
transition: fade-out
---

# SEO 三路 + AI-SEO 新认知

<div class="grid grid-cols-2 gap-4">
<div>

**三路 SEO**

- `seo-audit` 技术 / 页面
- `ai-seo` 被 AI 引用
- `programmatic-seo` 批量页
- + `site-architecture` / `schema`
- + `competitors` 对比页

</div>
<div>

**AI-SEO 关键**

- 传统 SEO 排名，AI-SEO **被引用**——两件事
- **引用 ≠ 推荐**
- Google：核心 Search 系统，无需特殊文件
- ChatGPT/Claude/Perplexity：奖励结构化 + `llms.txt` + `/pricing.md`

</div>
</div>

<v-clicks>

**Princeton GEO 研究（KDD 2024）**：引用源 +40% · 加统计 +37% · 加引语 +30% · 权威语气 +25% · **关键词堆砌 -10%（主动伤害）**

**第三方露出比自有站重要**：Wikipedia 占 ChatGPT 引用 7.8% · Reddit 1.8% · 评测站（G2/Capterra）

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #e11d48 10%, #f97316 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
SEO 分三路。AI-SEO 最重要认知：传统 SEO 让你排名，AI-SEO 让你被引用，引用不等于推荐。Google 用核心 Search 系统，其他 AI 引擎奖励结构化内容和机器可读文件。第三方露出比自有站更重要。
-->

---
transition: fade-out
---

# ads · 2026 Meta Andromeda 新打法

旧 interest-stacking 已弱化

<v-clicks>

- **创意就是定向**：广撒（只选国家）+ 让创意做定向，不再堆兴趣
- **静态图 > 精修视频**：Andromeda 需要量大；静态便宜 10 倍、2026 实测常胜
- **identity-trigger 关键词**：标题嵌入 `dental` / `lawyer`——身份触发 + 算法定向
- **AI 变体农场**：「100 人看不出换作者」prompt 改写最佳广告
- **僵尸广告**：CBO 死稿挑高信念款，独立 ad set 复活 ~20%
- **广告不像广告**：装广告拦截器的人多，精修美学杀效果

</v-clicks>

<div v-click class="mt-3 text-center text-sm opacity-80">

扩量：每次 +20% 预算（绝不要一次 +30% 重置学习期）· headline 胜出逐字搬到落地页 H1 → +15-20% 转化

</div>

<style>
h1 { background: linear-gradient(45deg, #e11d48 10%, #f97316 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
ads skill 最值得看的是 Meta Andromeda 算法（2025+）新打法：创意就是定向、静态胜视频、identity-trigger 关键词、AI 变体农场、僵尸广告复活。旧 interest stacking 已弱化。
-->

---
transition: fade-out
---

# email · cold-email · churn 三件套

<div class="grid grid-cols-3 gap-3 text-sm">
<div>

**emails**
生命周期流

- welcome 序列
- nurture drip
- 行为触发
- win-back

</div>
<div>

**cold-email**
B2B 冷外呼

- observation→problem
  →proof→ask
- 2-4 词小写标题
  像 `reply rates`
- 别 just checking in
- breakup 收尾

</div>
<div>

**churn-prevention**
留存

- 自愿 50-70%：
  cancel flow + save offer
- 非自愿 30-50%：
  dunning 重试 + 卡更新
- exit survey 找原因

</div>
</div>

<v-click class="mt-4 text-center">

**反模式**：`I hope this email finds you well` / HTML 图多链 / 假 `Re:` `Fwd:` / 不区分 churn 类型

</v-click>

<style>
h1 { background: linear-gradient(45deg, #e11d48 10%, #f97316 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
三个营销 skill 分工：emails 是生命周期自动化流，cold-email 是 B2B 冷外呼，churn-prevention 分自愿与非自愿 churn。cold-email 短、像同事、低摩擦 CTA；churn-prevention 区分两种 churn。
-->

---
transition: fade-out
---

# growth · 可循环的营销工作流

agent 时代的新打法

<v-clicks>

- **`marketing-loops`**：可让 agent 定期循环跑的自动化营销工作流（设定循环，AI 周期执行）
- **`marketing-council`**：模拟多专家顾问团，给同一问题多视角
- **`free-tools`**：免费工具 / 计算器换 lead + SEO
- **`referrals`**：推荐 / 联盟 / 口碑
- **`co-marketing`**：找联合营销伙伴
- **`lead-magnets`**：lead magnet 设计与优化

</v-clicks>

<div v-click class="mt-4 text-center text-sm opacity-80">

典型漏斗：customer-research → product-marketing → SEO/ads → cro/copywriting → onboarding/emails → churn-prevention → analytics/ab-testing → referrals/free-tools

</div>

<style>
h1 { background: linear-gradient(45deg, #e11d48 10%, #f97316 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
growth engineering 是 agent 时代的新打法：marketing-loops 让 agent 周期跑营销工作流，marketing-council 模拟多专家顾问团。配套 free-tools、referrals、co-marketing、lead-magnets。
-->

---
transition: fade-out
---

# 反模式速查

<v-clicks>

- **文案**：用行业 jargon 而不是客户原话；落地页多主 CTA 互抢
- **ads**：用 hyper-precise targeting 弥补平庸创意；一次 +30% 预算重置学习期；只看 ROAS 百分比不看净现金流
- **AI-SEO**：为 AI 单独写一份内容（违反 scaled content abuse）；封 `GPTBot`/`ClaudeBot` 又想被引用；关键词堆砌（**-10%**）；定价藏 JS 渲染页或「联系销售」墙后
- **cold-email**：HTML / 图 / 多链 / 假 `Re:`；首封就要 30 分钟会议；follow-up 写「just checking in」
- **churn**：不区分自愿 / 非自愿；cancel flow 没设 save offer；忽视 dunning

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #e11d48 10%, #f97316 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
反模式速查：文案用 jargon、ads 用定向弥补创意、AI-SEO 封 AI bot 又想被引用、cold-email 用 HTML 与假 Re:、churn 不分类型。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Corey Haines 个人社区项目（MIT，非官方）—— 47 个营销 agent skills 的事实标准：product-marketing 是地基，CRO/文案/SEO（含 AI-SEO）/ads（2026 Andromeda）/email/churn/growth 全栈，给 technical marketers 用 Claude Code 等做营销自动化。**

<div class="mt-8 opacity-80">

社区事实标准 · product-marketing 地基 · AI-SEO 引用≠推荐 · Andromeda 创意即定向 · marketing-loops 可循环

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/coreyhaines31/marketingskills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://marketingskills.com" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #e11d48 10%, #f97316 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。Corey Haines 个人社区项目，MIT，非官方，但最流行的事实标准。47 个营销 agent skills，product-marketing 是地基。面向会用 agent 的 technical marketers。如实标注个人社区项目属性。
-->
