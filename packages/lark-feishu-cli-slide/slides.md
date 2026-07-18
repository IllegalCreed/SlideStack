---
theme: seriph
background: https://cover.sli.dev
title: Lark / 飞书 CLI Skills
info: |
  飞书官方 larksuite/cli CLI + 27 个 AI Agent Skills。
  给 Agent 操作飞书的双手。MIT。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Lark / 飞书 CLI Skills

飞书官方——给 **Agent** 操作飞书的双手

<div class="pt-6 opacity-80">
larksuite/cli · 27 skills · 18 业务域 · 200+ 命令 · MIT
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/larksuite/cli" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
larksuite/cli 是飞书官方出品的 CLI，配套 27 个 AI Agent Skills。装上后 Agent 就能直接操作飞书：读消息、查日历、写文档、建表格、发邮件。
-->

---
transition: fade-out
---

# 是什么？给 Agent 操作飞书的双手

飞书官方 `larksuite/cli`（npm `@larksuite/cli`），MIT

<v-clicks>

- **官方沉淀**：飞书官方维护、与 OpenAPI 同源、覆盖 2500+ 接口
- **Agent 原生**：每个命令真实 Agent 测过，参数简洁、智能默认、结构化输出
- **27 个 Skills**：按业务域划分，触发条件明确
- **三层命令**：Shortcuts（`+`）→ API 命令 → Raw API
- **多 agent 兼容**：Claude Code / TRAE / Cursor / Codex
- **国际版 + 国内版**：Lark 与飞书均支持；OpenClaw 飞书插件底层基于它

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #3370FF 10%, #1456F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
官方出品、MIT、Agent 原生设计。覆盖 2500+ 接口、27 个 skill，主流 agent 工具都兼容。
-->

---
transition: fade-out
---

# 安装与首次配置

3 步从零到第一个 API 调用

```bash
# 1. 安装（npm，推荐）
npx @larksuite/cli@latest install

# 2. 配置应用凭据（一次性）
lark-cli config init

# 3. 登录 + 验证
lark-cli auth login --recommend
lark-cli auth status
```

<v-click>

<div class="mt-4">

**Agent 模式**：`config init` / `auth login` 都会输出授权 URL，agent 抽取后转给用户在浏览器完成，命令自动退出。

</div>

</v-click>

<style>
h1 { background: linear-gradient(45deg, #3370FF 10%, #1456F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
三步：装、配置、登录。Agent 模式下授权 URL 由 agent 转给用户。
-->

---
transition: fade-out
---

# 两种身份：user vs bot

`--as` 一键切换

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**user 用户身份**

- `--as user`
- `lark-cli auth login` 授权
- 访问**个人**资源
- 日历 / 邮箱 / 云盘 / 消息
- 以**你**的名义操作

</div>
<div v-click>

**bot 应用身份**

- `--as bot`
- 自动（appId + appSecret）
- **应用级**操作
- 看不到用户个人资源
- 后台开通 scope 即可

</div>
</div>

<v-click>

<div class="mt-4 text-center text-sm opacity-80">

user 身份需「后台 scope + 用户授权」**两层**；bot 缺 scope **不要**跑 `auth login`，去 `console_url` 开权限。

</div>

</v-click>

<style>
h1 { background: linear-gradient(45deg, #3370FF 10%, #1456F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
两种身份：user 访问个人资源，bot 应用级。bot 看不到用户日历邮箱；缺 scope 引导去后台开。
-->

---
transition: fade-out
---

# 18 业务域，27 Skills

<div class="grid grid-cols-3 gap-2 mt-5 text-xs leading-tight">

- 📅 日历
- 💬 消息群组
- 📄 云文档
- 📁 云空间
- 📊 多维表格
- 📈 电子表格
- 🖼️ 幻灯片
- ✅ 任务
- 📚 知识库
- 👤 通讯录
- 📧 邮箱
- 🎥 视频会议
- 🕐 考勤
- ✍️ 审批
- 🎯 OKR
- 🎨 画板
- 📝 妙记
- 🔗 应用

</div>

<div class="mt-3 text-center text-xs opacity-80">

加工作流 skill：`workflow-meeting-summary`（会后纪要）、`workflow-standup-report`（站会）

</div>

<style>
h1 { background: linear-gradient(45deg, #3370FF 10%, #1456F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
18 业务域 27 skill：消息/文档/表格/日历/会议/邮箱/任务/审批/OKR……基本飞书能干的都能让 agent 干。
-->

---
transition: fade-out
---

# 三层命令架构

按粒度选

<div class="grid grid-cols-3 gap-4 mt-4">
<div v-click>

**Shortcuts（`+`）**

人/Agent 友好

```bash
lark-cli calendar +agenda
lark-cli im +messages-send \
  --chat-id "oc_x" \
  --text "Hi"
```

智能默认 + 表格输出 + dry-run

</div>
<div v-click>

**API 命令**

100+，平台同步

```bash
lark-cli calendar \
  calendars list
lark-cli calendar events \
  instance_view \
  --params '{...}'
```

1:1 映射平台端点

</div>
<div v-click>

**Raw API**

2500+ 接口

```bash
lark-cli api GET \
  /open-apis/calendar/v4/calendars
lark-cli api POST \
  /open-apis/im/v1/messages \
  --params '{...}'
```

全覆盖兜底

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #3370FF 10%, #1456F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
三层：Shortcuts 最常用，API 命令对应平台端点，Raw API 兜底 2500+ 接口。
-->

---
transition: fade-out
---

# 云文档 + 多维表格

Agent 写文档/落数据的利器

<v-clicks>

- **读文档**：`lark-cli docs +fetch --doc "URL或token"`
- **创建**：`lark-cli docs +create --content '<title>...</title>'`
- **精修**：`lark-cli docs +update --command str_replace`（XML 优先于 Markdown）
- **Markdown**：用户提供 `.md` 文件直接导入；Drive 原生 `.md` CRUD
- **多维表格**：`base +records-list / +record-create / +record-update`，覆盖表/字段/视图/仪表盘/工作流/权限

</v-clicks>

<v-click>

<div class="mt-4 text-center text-sm opacity-80">

复制文档别用 fetch+create 重建——切到 `lark-cli drive files copy`。

</div>

</v-click>

<style>
h1 { background: linear-gradient(45deg, #3370FF 10%, #1456F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
docs fetch/create/update；精修优先 XML；多维表格全套。复制走 drive files copy。
-->

---
transition: fade-out
---

# 日历约会 + 邮箱 + 妙记

跨域串工作流

<div class="grid grid-cols-2 gap-6 mt-3">
<div v-click>

**日历**

```bash
lark-cli calendar +agenda
lark-cli calendar +events-create \
  --summary "周会" \
  --start-time "..." --end-time "..."
```

忙闲、时间建议、找会议室、RSVP

</div>
<div v-click>

**邮箱**

- 浏览/搜索/读
- 发/回复/转发/草稿
- watch 新邮件触发 agent

</div>
</div>

<v-click>

<div class="mt-4">

**会议纪要闭环**：`vc` 查纪要 → `minutes` 抽待办 → `workflow-meeting-summary` 聚合 → `task` 派任务 → `im` 群通知

</div>

</v-click>

<style>
h1 { background: linear-gradient(45deg, #3370FF 10%, #1456F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
日历看日程约会议，邮箱可触发 agent 处理。会议纪要可串多个 skill 形成闭环。
-->

---
transition: fade-out
---

# 多 Profile 并发

一台机器挂多套应用凭据

```bash
lark-cli profile add              # 新建（交互式）
lark-cli profile list             # 列出全部
lark-cli profile use prod         # 切默认
lark-cli profile remove dev       # 删除
lark-cli profile rename old new   # 改名

# 命令级临时指定
lark-cli --profile prod calendar +agenda
```

<v-click>

<div class="mt-4 text-center text-sm opacity-80">

适合多租户/多环境（开发/生产/不同应用）——凭据互不干扰，`--profile` 并发安全。

</div>

</v-click>

<style>
h1 { background: linear-gradient(45deg, #3370FF 10%, #1456F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
profile 管理多套凭据，--profile 并发安全，适合多租户/多环境。
-->

---
transition: fade-out
---

# 工作流场景示例

跨 skill 串起来

| 场景 | 串联 |
| --- | --- |
| **会后待办闭环** | vc → minutes → task → im |
| **人机共创文档** | docs +create → 用户改 → docs +update str_replace → drive 分享 |
| **跨时区约会** | calendar 查忙闲 → contact 找人 → events-create 自动选时间 |
| **会议分析** | workflow-meeting-summary → base 落表 → sheets 导出 |
| **邮件分类** | mail watch → agent 分类 → 归档/打标 → 重要邮件回复 |
| **站会报告** | workflow-standup-report → 日程+待办聚合 → im 发群 |

<style>
h1 { background: linear-gradient(45deg, #3370FF 10%, #1456F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
几个典型工作流：会议纪要、文档共创、跨时区约会、会议分析、邮件分类、站会。
-->

---
transition: fade-out
---

# 反模式与边界

避坑清单

<v-clicks>

- ❌ **bot 缺 scope 跑 `auth login`** → 去后台 `console_url` 开权限
- ❌ **未读 SKILL.md 就操作** → 每个 skill 的 `references/` 是必读
- ❌ **fetch+create 重建文档做复制** → 用 `drive files copy`
- ❌ **判断成功看 `code == 0`** → CLI 成功响应无 `code`，看 `ok == true`
- ❌ **放宽默认安全设置** → 注入/输出保护放开风险显著放大
- ❌ **把机器人拉群当公共助手** → 官方建议当**私人助手**用

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #3370FF 10%, #1456F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
六条反模式：bot 不要 auth login、要读 SKILL.md、复制用 drive、看 ok 字段、别放开安全、别拉群。
-->

---
layout: center
class: text-center
---

# 一句话记住

**飞书官方 `larksuite/cli`：27 skill 覆盖 18 业务域，给 Agent 操作飞书的双手；user/bot 双身份、三层命令、多 Profile 并发、MIT 开源。**

<div class="mt-8 opacity-80">

官方沉淀 · Agent 原生 · 三层命令 · 双身份 · 多 Profile · 安全可控

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/larksuite/cli" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://www.npmjs.com/package/@larksuite/cli" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #3370FF 10%, #1456F0 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。飞书官方 larksuite/cli，27 skill 覆盖 18 业务域，给 Agent 操作飞书的双手。
-->
