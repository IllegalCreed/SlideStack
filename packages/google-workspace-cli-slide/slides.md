---
theme: seriph
background: https://cover.sli.dev
title: Google Workspace CLI Skills
info: |
  方法论/社区生态叶：agent 操作 Google Workspace。
  无 Google 官方仓，以 gogcli 等 CLI + Workspace API 为代表。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Google Workspace CLI Skills

**方法论/社区生态叶**——agent 操作 Google Workspace 全家桶

<div class="pt-6 opacity-80">
Gmail · Calendar · Drive · Docs · Sheets · Chat · 无 Google 官方仓
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://developers.google.com/workspace/docs" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
本叶是方法论/社区生态叶，描述如何用 agent 操作 Google Workspace。无 Google 官方 SKILL.md 仓，社区以 gogcli 等 CLI 的 skill 封装为代表。
-->

---
transition: fade-out
---

# 定位：方法论/社区生态叶

不是 Google 官方技能集

<v-clicks>

- **无 Google 官方 SKILL.md 仓**——`gh search` 未发现 google 官方出品
- **社区代表**：基于 `gogcli` 的 skill 封装、`google-workspace-cli-skill` 等小仓
- **底层统一**：都依赖 Google Workspace REST API（10+ 服务）
- **差异在认证 + 封装 + 触发方式**，不在 API 本身

</v-clicks>

<div v-click class="mt-4 text-center text-sm opacity-80">

方法论叶：教你怎么选 API、怎么选认证、怎么安全地把 Workspace 交给 agent。

</div>

<style>
h1 { background: linear-gradient(45deg, #4285F4, #EA4335 60%, #FBBC05); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
定位说明：方法论/社区生态叶，无 Google 官方仓。社区以 gogcli 等小仓为代表，底层统一依赖 Workspace REST API。
-->

---
transition: fade-out
---

# Workspace API 覆盖

10+ REST API

<div class="grid grid-cols-2 gap-4 mt-4">
<div>

**个人协作**

- Gmail —— 邮件搜/读/起草/发
- Calendar —— 日程/忙闲/约会议
- Drive —— 文件管理/权限
- Tasks —— 建任务/勾完成

</div>
<div>

**文档协作**

- Docs —— 写段/批量替换
- Sheets —— 读写行/公式
- Slides —— 模板生成

**通讯与教育**

- Chat —— 空间消息/Webhook
- People —— 联系人
- Classroom —— 课程/作业

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #4285F4, #EA4335 60%, #FBBC05); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Workspace 暴露 10+ REST API：Gmail、Calendar、Drive、Docs、Sheets、Slides、Chat、Tasks、People、Classroom。覆盖个人协作、文档协作、通讯与教育三大场景。
-->

---
transition: fade-out
---

# 认证：OAuth 2.0 vs 服务账号

两条路

| 维度 | OAuth 2.0 | 服务账号 |
| --- | --- | --- |
| 适用 | 代表**单用户** | **域级自动化** |
| 凭据 | Client ID + refresh_token | 邮箱 + JSON 私钥 |
| 授权 | 用户 consent | 域管理员 Domain-wide Delegation |
| Gmail | 主流 | 受限，合规域内 |

<div v-click class="mt-4 text-center">

**经验法则**：碰个人数据（Gmail/Calendar）优先 OAuth 2.0；碰组织公共数据（共享 Drive / 域文档）用服务账号。

</div>

<style>
h1 { background: linear-gradient(45deg, #4285F4, #EA4335 60%, #FBBC05); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
两条认证路径：OAuth 2.0 代表单用户，服务账号做域级自动化。Gmail 用服务账号受限严格，通常优先 OAuth。
-->

---
transition: fade-out
---

# 五分类选型

设计前先回答五个问题

<v-clicks>

- **Surface**：在哪用？（Claude Code / Cursor / 服务器）
- **Operation**：读还是写？（写必须确认）
- **Actor**：代表本人还是组织？（决定 OAuth vs 服务账号）
- **Execution home**：本机还是云？（凭据存储与网络）
- **Trigger**：人触发 / Webhook / 定时？（auth 续期与并发）

</v-clicks>

<div v-click class="mt-4 text-center text-sm opacity-80">

例：本机 + 写 + 代表本人 + 手动 → OAuth 2.0 + 发送前确认<br>
例：云端 + 读 + 代表组织 + 定时 → 服务账号 + 委托

</div>

<style>
h1 { background: linear-gradient(45deg, #4285F4, #EA4335 60%, #FBBC05); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
五分类选型：surface、operation、actor、execution home、trigger。回答完五个问题，auth 模型自然浮出。
-->

---
transition: fade-out
---

# 邮件工作流：止于草稿

Gmail API

```text
搜未读 → 按主题聚类 → 起草回复 → 打标签/归档
            ↑
       止于草稿，不发送
```

<v-clicks>

- 搜索：`users.messages.list(q="is:unread after:2026/07/01")`
- 起草：`users.drafts.create`（停在草稿）
- 发送：`users.messages.send`（**人显式确认才调**）
- scope 三档：`readonly` / `modify`（无 send）/ `send`——能不申请 `send` 就不申请

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #4285F4, #EA4335 60%, #FBBC05); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
邮件工作流核心：止于草稿。agent 负责搜索、聚类、起草，发送权在人手里。scope 三档，最小化申请。
-->

---
transition: fade-out
---

# 日程与文档

Calendar · Docs · Sheets · Drive

<div class="grid grid-cols-2 gap-4">
<div v-click>

**Calendar**

- `freeBusy.query` 查忙闲
- `events.insert` 约会议
- 跨时区必传 `timeZone`
- attendee 多时 `sendUpdates: "all"`

</div>
<div v-click>

**Docs / Sheets**

- Docs `batchUpdate` 插入/替换
- Sheets `values.get/update`
- 注意 A1 notation
- 大段写先攒 `requests`

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

Drive 搜索：`files.list(q="fullText contains '合同'")`；权限改动是高危，必须 dry-run。

</div>

<style>
h1 { background: linear-gradient(45deg, #4285F4, #EA4335 60%, #FBBC05); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
日程、文档、Drive 操作要点：Calendar 跨时区必传 timeZone；Docs/Sheets 用 batchUpdate 批量；Drive 权限改动是高危，必须 dry-run。
-->

---
transition: fade-out
---

# 安全：写必确认 + 最小 scope

把 Workspace 交给 agent 的红线

<v-clicks>

- ✅ **写操作必须确认**——`send` / `delete` / `permissions.create` 前 agent 暂停
- ✅ **scope 最小化**——能 `readonly` 别 `modify`；能 `drive.file` 别 `drive`
- ✅ **批量 dry-run**——批量改名/归档/发信先小样本
- ✅ **凭据托管**——refresh_token / 私钥进 Secret Manager，**不进 git**
- ✅ **配额预算**——Gmail 日发信上限、Drive QPS，分段限速
- ❌ agent 自动发邮件 / 私钥进 git / 不试跑就批量删

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #4285F4, #EA4335 60%, #FBBC05); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
安全红线：写操作必须确认、scope 最小化、批量 dry-run、凭据托管、配额预算。反模式：agent 自动发邮件、私钥进 git、不试跑就批量删。
-->

---
transition: fade-out
---

# 边界与反模式

别踩的坑

<div class="grid grid-cols-2 gap-4">
<div v-click>

**边界**

- 非 Google 官方技能集
- 服务账号 ≠ 万能
- 配额敏感
- 数据隐私（邮件/文档）

</div>
<div v-click>

**反模式**

- agent 自动 send 邮件
- 申请最大 scope「以防万一」
- 服务账号私钥进 git
- 批量 delete 不 dry-run
- 跨时区不传 timeZone

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #4285F4, #EA4335 60%, #FBBC05); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
边界与反模式：非官方、服务账号受限、配额敏感；反模式包括 agent 自动 send、scope 过大、私钥进 git、批量 delete 不试跑、跨时区不传 timeZone。
-->

---
layout: center
class: text-center
---

# 一句话记住

**方法论/社区生态叶：无 Google 官方仓，以 gogcli 等 CLI + Workspace API 为代表；OAuth 2.0 vs 服务账号双认证，写必确认、scope 最小、dry-run 当家。**

<div class="mt-8 opacity-80">

10+ API · 双认证 · 五分类选型 · 写必确认 · 最小 scope

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://developers.google.com/workspace/docs" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #4285F4, #EA4335 60%, #FBBC05); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。一句话记住：方法论/社区生态叶，无 Google 官方仓；OAuth 2.0 vs 服务账号双认证；写必确认、scope 最小、dry-run 当家。
-->
