---
theme: seriph
background: https://cover.sli.dev
title: 即时通讯与协作工具
info: |
  即时通讯与协作工具：Slack · Discord · 飞书 Lark · 钉钉 DingTalk

  频道治理 · 通知治理 · 机器人自动化 · 异步协作礼仪

  Learn more at [https://slack.com/help](https://slack.com/help)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 即时通讯与协作工具

频道 · 线程 · 机器人 · 四大平台选型

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
IM 把分散沟通收敛到「频道 + 线程 + 机器人」统一工作台。
-->

---
transition: fade-out
---

# 即时通讯是什么

团队协作的**信息中枢**，把邮件/会议/工单收敛到统一工作台

- **Slack**：企业 IM 事实标准，英文世界主流
- **Discord**：社区导向，语音体验一流
- **飞书 Lark**：中文协作文档一体化全家桶
- **钉钉 DingTalk**：国内强管控 + AI 转型

> 核心问题：信息流向谁、如何检索、能否自动化

<!--
没有最好的工具，只有最匹配场景的。
-->

---

# 四大平台定位

| 平台 | 定位 | 核心单元 |
|---|---|---|
| Slack | 企业异步协作 | Channel + Thread |
| Discord | 社区/实时语音 | Server + 语音频道 |
| 飞书 | 中文协同一体 | 消息 + 文档/表格 |
| 钉钉 | 国内强管控 | 组织 + 应用 |

> 选型：国际→Slack；社区→Discord；中文文档→飞书；合规→钉钉

<!--
四大平台各有定位，按场景选型。
-->

---

# Slack 核心抽象

```
Workspace（工作区）
├── Channel（频道：公开/私有）
│   └── Thread（线程，子讨论）
├── Direct Message（DM 私信）
└── Slack Connect（跨组织共享频道）
```

**三大扩展点**

- App Directory（2600+ 应用集成）
- Slack Connect（B2B 跨组织协作）
- Huddles（一键轻量语音）

> Channel 按项目/团队/主题建，信息天然分流

<!--
Slack 三件套：Channel + Connect + Huddles。
-->

---

# 频道命名规范

约定前缀让频道可按主题筛选，新人易找

| 前缀 | 含义 | 示例 |
|---|---|---|
| `#proj-` | 项目频道 | `#proj-payment-v2` |
| `#team-` | 团队频道 | `#team-backend` |
| `#help-` | 求助 | `#help-devops` |
| `#ann-` | 公告 | `#ann-releases` |

> 项目频道用完归档，定期审计无消息频道

<!--
命名规范是频道治理的基础。
-->

---

# Discord 核心抽象

```
Server（服务器，一个社区）
├── Category（分类）
│   ├── Text / Voice / Stage 频道
│   └── Forum（论坛帖子式）
├── Role（角色，权限+颜色）
└── Bot（机器人自动化）
```

**与 Slack 关键差异**

- 语音频道**永远在线**，随时进
- **细粒度角色权限**，按频道覆盖
- 免费版**无限历史**

> 权限按角色叠加，频道级可覆盖——管理大社区核心

<!--
Discord 权限系统是其管理大型社区的关键。
-->

---

# 飞书一体化 + larksuite/cli

飞书是「消息 + 文档 + 表格 + 日历」全家桶

- **Docs**：实时协作文档，消息里直接渲染
- **Bitable**：多维表格，数据库式
- **Wiki**：知识库结构化沉淀

**larksuite/cli（2026-03 开源，Go）**

```bash
lark messenger send --chat_id xxx --text "构建完成"
lark base record create --fields '{"status":"done"}'
```

> 18 业务域、200+ 命令、26 个 AI Agent Skills

<!--
飞书 CLI 让办公套件变成可被 Agent 驱动的平台。
-->

---

# 钉钉强管控 + AI 转型

以**组织管理**为核心起家

- 组织架构同步、考勤打卡、审批流
- DING 消息已读追踪，紧急强提醒

**AI 转型（2024-2026）**

| 产品 | 能力 |
|---|---|
| AI 听记 | 会议转文字 + 纪要 |
| AI 表格 | 自然语言操作 |
| AI 搜问 | 跨应用知识检索 |

> 2 亿月活 + 通义千问，IM 变成 Agent 入口

<!--
钉钉把 IM 作为 AI Agent 的落地场景。
-->

---

# 通知治理三招

IM 默认配置会**摧毁注意力**（打断后恢复专注需 23 分钟）

1. **分级通知**：默认仅 `@我` + `@here`
2. **勿扰时段**：22:00-08:00 不接收推送
3. **频道分级**：即时响应 / 每日扫 / 仅存档

| 级别 | 策略 | 响应 |
|---|---|---|
| P0 紧急 | 全部推送 | 5 分钟内 |
| P2 常规 | 仅 @我 | 当天 |

> `@channel` 极少用，几乎总是过度打扰

<!--
默认静音、主动检索比实时刷消息高效。
-->

---

# 机器人自动化

**Slack Incoming Webhook（最轻量）**

```bash
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"部署完成 v1.2.3"}' \
  https://hooks.slack.com/services/Txxx/Bxxx
```

**自动化三件套**

- Workflow Builder（无代码拖拽）
- Incoming Webhook（CI/告警推送）
- Bolt 框架（JS/Python 编程式 Bot）

> 把日报、告警、审批等机械流程自动化

<!--
Webhook + Bot + Workflow 是 IM 自动化三板斧。
-->

---

# 选型决策矩阵

| 场景 | 推荐 | 理由 |
|---|---|---|
| 跨国英文团队 | Slack | 事实标准，生态最全 |
| 开源社区/Web3 | Discord | 语音强，免费无限历史 |
| 中文文档协作 | 飞书 | Docs/Bitable 一体 |
| 国内合规政企 | 钉钉 | 强管控 + AI 实用 |

> 混合使用常见：明确每个工具的边界，避免重复

<!--
没有最好只有最匹配，混合使用是现实。
-->

---
layout: quote
---

# 异步协作礼仪

「能写清的不开会，能开会的不打电话。消息要让对方**一条看完就能回**——背景、问题、你的尝试、期望。」

---
layout: center
class: text-center
---

# 小结

即时通讯 = 频道治理 + 通知治理 + 自动化

**异步优先 · 频道分流 · 机器人减负 · 决策沉淀文档**

[Slack 文档](https://slack.com/help) · [Discord](https://discord.com/safety) · [飞书开放平台](https://open.feishu.cn/) · [钉钉](https://open.dingtalk.com/)

<!--
IM 用好的关键：通知治理 + 频道治理 + 机器人自动化。
-->
