---
theme: seriph
background: https://cover.sli.dev
title: Skills CLI 与 find-skills
info: |
  找到、装上、校验技能的命令行工具生态，以 find-skills 为发现旗舰。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Skills CLI 与 find-skills

找到、装上、校验技能的命令行——一处搜遍 14 个源、4835 个技能

<div class="pt-6 opacity-80">
fockus/claude-skill-find-skill · 多 agent 技能发现与安装
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/fockus/claude-skill-find-skill" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Agent Skills 标准之上长出了一套 CLI 工具生态。今天主讲发现旗舰 find-skills：一个命令搜遍 14 个源、4835 个技能，在 4 个 agent 里通用。
-->

---
transition: fade-out
---

# 痛点：技能散落十几个源

想给项目找个 Docker 技能？得手翻十几个 awesome-list

<v-clicks>

- 技能分散在 Anthropic 官方、skills.sh、各社区 list、市场……**14 个源**
- 同名技能一堆，哪个可信、哪个适合你的 agent？无从比较
- 找到了还要手动 clone、还要按你的 agent 改 frontmatter 格式

</v-clicks>

<div v-click class="mt-6 text-center text-xl">

**find-skill** 把这些汇进**一份本地目录**，一个命令搞定搜 + 装 + 转格式。

</div>

<style>
h1 { background: linear-gradient(45deg, #0891b2 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
问题很实在：技能散在十几个源，同名一堆无从比较，找到还要手动 clone 和改格式。find-skill 的价值就是把发现、甄别、安装、格式转换这一整条链收进一个命令。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 两条命令，四个 agent

装一次，`/find-skill` 和 `/install-skill` 在每个 agent 里都可用

::left::

<div v-click>

**`/find-skill`** —— 搜

```bash
/find-skill docker
/find-skill react --agent cursor
/find-skill deploy --all
```

</div>

::right::

<div v-click>

**`/install-skill`** —— 装

```bash
/install-skill owner/repo
/install-skill owner/repo --target all
/install-skill mono --name sub-skill
```

</div>

::bottom::

<div v-click class="mt-4">

四个 agent（Claude Code / Codex / OpenCode / Cursor）读**同一份**目录缓存——更新一次，全部受益。

</div>

<style>
h1 { background: linear-gradient(45deg, #0891b2 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
只有两条命令：find-skill 搜、install-skill 装。装一次后在四个 agent 里都能用，且共享同一份本地目录缓存。
-->

---
transition: fade-out
---

# 装 find-skill：三选一

任选一种，都以「两条命令在你的 agent 里可用」收尾

```bash
# Homebrew
brew tap fockus/tap && brew install find-skill && find-skill

# 或 pipx
pipx install find-skill && find-skill

# 或 curl 一行
curl -sSL .../quick-install.sh | bash
```

<v-click>

安装器自动探测你装了哪些 agent，落到各自原生位置：

| Agent | 路径 |
| --- | --- |
| Claude Code / Codex | `~/.claude/skills/` · `~/.codex/skills/` |
| OpenCode / Cursor | `~/.config/opencode/command/` · `~/.cursor/commands/` |

</v-click>

<style>
h1 { background: linear-gradient(45deg, #0891b2 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
三种安装方式：brew、pipx、curl 一行。安装器自动探测已装的 agent，把技能落到各自的原生目录。
-->

---
transition: fade-out
---

# find-skill 本身就是一个技能

它的 `SKILL.md` 把「怎么找技能」写成 6 步交给 agent 执行

<div class="text-sm mt-2">

| 阶段 | 做什么 |
| --- | --- |
| **0 新鲜度** | 目录 >30 天则提示更新 |
| **1 理解查询** | 含糊时问 1-2 个澄清问题 |
| **2 本地搜索** | 对 `catalogue.json` 打分排序，**离线出结果** |
| **3 实时兜底** | 本地 <2 结果才调 SkillsMP API（需 key） |
| **4 展示** | ≤5 卡片 / 6+ 表格，标源 + 信任级，**问 Install?** |
| **5 安装** | 用户确认后 `git clone` 并验证 |
| **6 解释** | 说明装在哪、怎么激活、给用法示例 |

</div>

<div v-click class="mt-2 text-center">

它本身就是「用户触发 + 强制确认」的技能范例。

</div>

<style>
h1 { background: linear-gradient(45deg, #0891b2 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
有意思的是：find-skill 自己就是一个技能，它的 SKILL.md 把找技能的流程写成 6 步。注意第 4、5 步——展示后必须问 Install、用户确认才装。这本身就是「未确认不安装」的技能设计范例。
-->

---
transition: fade-out
---

# 排序：相关度 × 信任 × 星数

Stage 2 的打分（写死在 SKILL.md 里）决定结果次序

```python
# 1) 查询相关度
if query == name:   score = 100   # 精确匹配技能名
elif query in name: score = 50    # 名字含查询
elif query in desc: score = 20    # 描述含查询

# 2) 源信任加成（Anthropic 60 → skills.sh 30 → … → SkillsMP 3）
score += SOURCE_PRIORITY[source]

# 3) 星数加成（最多 +20）
score += min(stars / 1000, 20)
```

<div v-click class="mt-3">

> **精确名字命中压倒一切**，官方与高信任源天然靠前，热门再加成——搜 `docker` 时官方技能排在社区同名之前。

</div>

<style>
h1 { background: linear-gradient(45deg, #0891b2 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
排序算法很透明：查询相关度打底，源信任加成，星数再加成。设计意图是让官方和高信任源靠前，但精确名字命中压倒一切，避免热门社区技能淹没官方。
-->

---
transition: fade-out
---

# 信任分级：装之前先掂量来源

装技能 = 执行别人写的指令，来源可信度一眼可辨

| 档位 | 代表源 | 语义 |
| --- | --- | --- |
| 🟢 Official | Anthropic、skills.sh | 官方/权威 |
| 🟢 Top list | hesreallyhim、ComposioHQ | 头部精选清单 |
| 🟡 Curated | vercel-labs、VoltAgent、travisvn | 社区精选 |
| 🟠 Community | alirezarezvani、daymade、mxyhi | 社区收录 |
| ⚪ Marketplace | SkillsMP | 市场源，**须人工核验仓库** |

<div v-click class="mt-3 text-center">

来源越靠下，越要读 `SKILL.md` 确认它到底让 agent 做什么。

</div>

<style>
h1 { background: linear-gradient(45deg, #0891b2 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
find-skill 把 14 个源分档标色。核心提醒：装技能等于执行别人的指令，绿色官方源可以放心些，灰色市场源必须自己读 SKILL.md 核验。
-->

---
transition: fade-out
---

# 装即格式转换：跨 agent 最后一公里

同一个 Claude 风格 `SKILL.md` 装到不同 agent，自动改写 frontmatter

<div v-click>

| 目标 | frontmatter 转换 |
| --- | --- |
| → Codex | `name` + `description` 原样 1:1 拷贝 |
| → OpenCode | 加 `tools: {read, write, bash, edit}` |
| → Cursor | 加 `allowed-tools: [Bash, Read, Write, Edit]` |

</div>

<v-clicks>

- **正文一字不动**——只改 frontmatter 头
- 开放规范保证正文通用，find-skill 补上各家 frontmatter 差异

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #0891b2 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
跨 agent 可移植的最后一公里：正文本来就通用，但各家 frontmatter 有差异。find-skill 安装时自动改写 frontmatter 头，正文逐字保留，补上这个差异。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 本地优先：省 API、可离线、护隐私

先搜本地缓存，结果不足才联网

::left::

<div v-click>

**本地目录**（默认）

- `catalogue.json`：4835 条、2.5MB
- 离线可搜、不出本机
- 省 SkillsMP 每日配额

</div>

::right::

<div v-click>

**实时兜底**（可选）

- 本地 <2 结果才调 SkillsMP
- 需 `SKILLSMP_API_KEY`
- 缺 key 只提示一次、回落本地

</div>

::bottom::

<div v-click class="mt-4">

⚠️ 目录**不自动更新**——手动跑 `update-skills-catalogue.sh` 或挂 cron，否则搜到的是过期快照。

</div>

<style>
h1 { background: linear-gradient(45deg, #0891b2 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
搜索永远本地优先：4835 条离线目录先搜，只有结果少于 2 条才联网 SkillsMP。好处是省配额、护隐私、可离线。唯一要记的运维点：目录不自动更新，久了要手动刷新。
-->

---
transition: fade-out
---

# 更广的技能 CLI 生态

发现只是一环——技能全生命周期有四类 CLI

| 工具 | 职责 | 命令 |
| --- | --- | --- |
| **find-skill** | 发现 + 安装（多 agent、clone 到本地） | `/find-skill` `/install-skill` |
| **skills.sh** | 分发（拷进项目、可编辑） | `npx skills add owner/repo` |
| **claude plugin** | 托管插件包（只读、自更新） | `claude plugin marketplace add` |
| **skills-ref** | 校验（frontmatter + 命名，离线） | `skills-ref validate ./skill` |

<div v-click class="mt-3 text-center">

写完自己的技能，用 `skills-ref validate` 把关，再选一条路分发。

</div>

<style>
h1 { background: linear-gradient(45deg, #0891b2 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
把视野放大：find-skill 管发现和安装，但技能全生命周期还有分发（skills.sh）、托管插件（claude plugin）、校验（skills-ref）。写完技能先 validate 把关，再选分发方式。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# find-skill vs `claude plugin`

技能进项目有两条路，别混淆

::left::

<div v-click>

**find-skill / `npx skills`**

- 装**单个**技能文件夹
- clone/拷到本地，**可编辑**
- 想 hack、想跨 agent 用
- 更新靠手动重装

</div>

::right::

<div v-click>

**`claude plugin`**

- 装**整套**托管插件包
- 只读、订阅式、**自更新**
- 可含技能 + hooks + MCP
- 适合 Superpowers/gstack 这类集合

</div>

::bottom::

<div v-click class="mt-4 text-center">

找「一个」技能用 find-skill；订阅「一整套」受维护技能用插件市场。

</div>

<style>
h1 { background: linear-gradient(45deg, #0891b2 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
一个常见混淆：find-skill 和 claude plugin 都能让技能进项目，但一个装单技能可编辑、一个装整套托管包只读自更新。找单个用 find-skill，订阅整套集合用插件市场。
-->

---
transition: fade-out
---

# 反模式与局限

| 反模式 / 局限 | 说明 |
| --- | --- |
| 装完不读 `SKILL.md` | 等于盲执行别人的指令；市场源尤其要读 |
| 只看星数挑 | 星数只占排序一档，热门≠适合你 |
| 忘了更目录 | 不自动更新，久了是过期快照 |
| 当成版本管理器 | 无语义化版本/依赖解析，就是搜+clone+转格式 |
| 期望它保证质量 | 它保证「找得到」，不保证「找得对」 |

<style>
h1 { background: linear-gradient(45deg, #0891b2 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
五个要避开的坑。最重要的两条：装完一定读 SKILL.md 确认它会让 agent 做什么；别只看星数，它保证找得到不保证找得对。
-->

---
layout: center
class: text-center
---

# 一句话记住

**find-skill 一处搜遍 14 源、按信任排序、装即转格式、未确认不装；校验用 `skills-ref validate`。**

<div class="mt-8 opacity-80">

发现 · 信任排序 · 格式转换 · 本地优先 · 校验/分发/插件

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/fockus/claude-skill-find-skill" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://skillsmp.com" target="_blank" class="slidev-icon-btn"><carbon:search /></a>
  <a href="https://skills.sh" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #0891b2 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾一句话：find-skill 一处搜遍、按信任排序、装即转格式、未确认不装；写自己的技能记得用 skills-ref validate 校验。
-->
