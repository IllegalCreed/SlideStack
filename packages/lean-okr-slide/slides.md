---
theme: seriph
background: https://cover.sli.dev
title: 精益开发与目标管理
info: |
  精益开发与目标管理：Lean 7 原则 · 7 浪费 · OKR · Objective + Key Results

  Learn more at [https://www.whatmatters.com](https://www.whatmatters.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 精益开发与目标管理

Lean 7 原则 · 7 浪费 · OKR

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
本叶含两条主线：Lean 工程哲学 + OKR 目标机制。
-->

---
transition: fade-out
---

# 两条主线

同源于「全局优化、以价值为导向」

- **精益开发（Lean）**：源自丰田 TPS，2003 年 Poppendieck 移植到软件
- **核心**：7 原则——消除浪费、尽快交付、全局优化
- **OKR**：Objectives & Key Results，协同式目标设定
- **Objective**：定性、鼓舞人心、行动导向的目标
- **Key Results**：3-5 条/目标，可量化、可验证、衡量结果

> Lean 让「怎么干」高效，OKR 让「干什么」聚焦。

<!--
Lean 给工程哲学，OKR 给目标机制，二者互补。
-->

---

# Lean 7 原则速览

| # | 原则 | 一句话 |
|------|------|------|
| 1·2 | 消除浪费 / 放大学习 | 移除不增值项 / 短反馈环 |
| 3·4 | 尽晚决定 / 尽快交付 | 基于事实 / JIT + 短迭代 |
| 5·6 | 团队授权 / 内建完整性 | 决策下放 / 质量内建 |
| 7 | 全局优化 | 优化整体价值流 |

> 7 原则是哲学非流程，缺乏 Scrum 那样的具体骨架。

<!--
Lean 不规定流程，提供思考方式。
-->

---

# 7 浪费（muda）的软件映射

| 制造浪费 | 软件对应 |
|------|------|
| 库存 | 部分完成的工作（未合并代码） |
| 生产过剩 / 额外加工 | 额外功能（YAGNI）/ 冗余流程 |
| 运输 / 等待 | 任务切换 / 等审批等依赖 |
| 动作 / 缺陷 | 交接丢知识 / bug 返工 |

**识别方法**：价值流映射——画每步时间与等待，找不增值环节。

<!--
用价值流视角识别并移除浪费。
-->

---

# 尽晚决定 与 尽快交付

**尽晚决定**：关键决策延迟到基于事实而非假设

```text
Set-based 开发：同时保留多种方案，随信息明朗淘汰
可逆决策 vs 不可逆：可逆早做无妨，不可逆尽量晚做
```

注意：「尽晚」不是「拖延」——需保留可选性的工程能力。

**尽快交付**：让反馈环最短、纠偏成本最低

- 手段：JIT 拉动（Kanban）、小批量、短迭代、自动化部署
- 关键洞察：快与质量不矛盾——慢源于大批量、长等待、返工

<!--
尽晚决定需工程支撑，尽快交付靠 JIT + 小批量。
-->

---

# OKR 是什么

Andy Grove（Intel，iMBO）→ John Doerr → 1999 年带入 Google

- **Objective（O）**：定性、鼓舞人心、行动导向，简短易记
- **Key Results（KR）**：3-5 条/目标，可量化、可验证、有时限
- **KR 必须是 outcome（结果）**：非 output（产出/任务）
- **数量**：每季度 3-5 个 O，每 O 配 3-5 个 KR
- **评分**：0.0-1.0，**0.7 视为成功**

> 力量来自「少即是多」；总是 1.0 说明目标不够有挑战。

<!--
OKR 的 O 定性鼓舞，KR 可量化衡量结果。
-->

---

# OKR 写法对照

```text
差的 O：提升产品（模糊）
好的 O：成为中小企业首选的项目管理工具

差的 KR：优化登录页（任务 output）
好的 KR：季度末新用户注册转化率从 3% 提升到 6%（outcome）
```

**OKR vs KPI**：

| 维度 | OKR | KPI |
|------|------|------|
| 性质 | 目标设定框架 | 健康度指标 |
| 目的 | 驱动改变 | 衡量现状 |
| 周期 | 季度 | 持续监控 |

> KR 衡量结果而非任务——这是 OKR 写作的核心纪律。

<!--
好的 OKR：O 鼓舞、KR 可量化 outcome。
-->

---
layout: two-cols
---

# OKR 不挂钩绩效

whatmatters 明确「divorced from compensation」

| 后果 | 表现 |
|------|------|
| 保守设定 | 怕影响收入，目标定低 |
| 隐藏困难 | 不愿暴露风险 |
| 博弈指标 | 为数字做短视行为 |
| 雄心丧失 | 拉伸目标机制被摧毁 |

::right::

# OKR 周期与对齐

```text
季度初：设定（自下而上提案 + 对齐）
季度中：周/双周 Check-in
季度末：评分 + 复盘
```

**对齐**：公司→团队→个人，自上而下传递 + 自下而上提案。

> 对齐是双向的，非单纯上级下达。

<!--
挂钩奖金摧毁 OKR 雄心；对齐是双向的。
-->

---
layout: quote
---

# Lean 与 OKR 的共识

「全局优化、以价值为导向——Lean 消除浪费让流动高效，OKR 聚焦让方向清晰。」

---

# 反模式清单

| Lean 反模式 | OKR 反模式 |
|------|------|
| 把原则当口号不落地 | KR 写成任务清单 |
| 局部优化忽视全局 | 季度末赶分平时不跟踪 |
| 尽晚决定变拖延 | 与绩效/奖金挂钩 |
| 无工程支撑的快交付 | 目标过多稀释聚焦 |

> 成熟组织常并用 Lean 与 OKR：怎么干高效 + 干什么聚焦。

<!--
二者反模式都源于偏离「全局价值导向」。
-->

---
layout: center
class: text-center
---

# 小结

Lean = 7 原则（消除浪费、全局优化） · OKR = O + 可量化 KR

**尽晚决定 · 尽快交付 · 0.7 即成功 · 不挂钩绩效**

[Lean SD](https://en.wikipedia.org/wiki/Lean_software_development) · [OKR 定义](https://www.whatmatters.com/faqs/okr-meaning-definition-example) · [SlideStack](https://github.com/IllegalCreed/SlideStack)

<!--
Lean 给工程哲学，OKR 给目标机制，二者互补。
-->
