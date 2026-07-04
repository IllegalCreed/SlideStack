---
theme: seriph
background: https://cover.sli.dev
title: Dependabot
info: |
  Dependabot：GitHub 原生的依赖更新与安全修复机器人，一份 yml 开箱即用。

  基于 Dependabot（GitHub 原生）· 核于 2026-07
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Dependabot

**GitHub 原生的依赖维护机器人 · 升级 PR ＋ 漏洞修复，开箱即用**

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好！今天聊 Dependabot —— GitHub 内置的依赖维护机器人。
一份配置文件进仓库，它就替你定期开升级 PR，还盯着已知漏洞自动开修复 PR。开箱即用，我们开始吧！
-->

---
transition: fade-out
---

# Dependabot 是什么

不是你 npm install 进项目的库，而是 GitHub 平台内置的托管服务

<v-clicks>

- **GitHub 原生**：配置进仓库即生效，无需注册第三方 App、无需自建服务器
- **两件事**：定期开依赖**升级 PR**，并盯着已知漏洞开**修复 PR**
- **与平台一体**：告警进 Security 面板，PR 走标准 review / CI / 合并流程
- **引擎开源**：更新引擎 `github/dependabot-core`，托管运行环境是 GitHub 闭源服务
- **只服务 GitHub**：跨平台（GitLab / Bitbucket）是 Renovate 的地盘

</v-clicks>

<!--
Dependabot 不是一个你装进项目的库，而是跑在 GitHub 侧的托管服务。
它读你仓库的依赖清单和锁文件，判断有没有更新或漏洞，替你开 PR。
原生意味着零接入成本、与 Security 面板和 Actions 天然一体，代价是只认 GitHub。
-->

---
transition: fade-out
---

# 三块能力，两条主线

别把「告警 / 安全更新 / 版本更新」搅在一起

| 能力 | 干什么 | 改代码 | 需要 yml |
| --- | --- | --- | --- |
| **alerts** 告警 | 发现引入漏洞的依赖并报警 | 否（只读） | 否 |
| **security updates** 安全更新 | 针对告警开 PR、最小必要升级 | 是 | 否 |
| **version updates** 版本更新 | 与漏洞无关，把依赖升到新版 | 是 | **是** |

<div v-click>

- **安全线** ＝ alerts → security updates，由 **GHSA** 漏洞公告驱动，近零配置
- **更新线** ＝ version updates，由你配的 `schedule` 节奏驱动，**必须写 yml**

</div>

<!--
三块能力：alerts 只发现问题、不改代码；security updates 针对告警开修复 PR；version updates 跟漏洞无关，按节奏常规升级。
归成两条线：安全线由 GHSA 驱动、几乎零配置；更新线由你配的节奏驱动、必须写 dependabot.yml。
-->

---
transition: fade-out
---

# 安全线：近零配置

alerts + security updates 不用写 yml，仓库设置里开三个开关

<v-clicks>

- 进仓库 **Settings → 安全（Code security）**，自上而下打开：
- **① Dependency graph（依赖图）** —— 一切的基础
- **② Dependabot alerts** —— 开始基于 GHSA 报漏洞
- **③ Dependabot security updates** —— 针对告警自动开修复 PR
- 前提：漏洞依赖出现在 manifest / 锁文件；`alerts` 只报警，**要单独开 security updates 才会修**

</v-clicks>

<!--
安全线完全不碰配置文件。仓库 Settings 里从上到下开三个开关：先依赖图，再 alerts，最后 security updates。
一个高频误区：开了 alerts 不等于会自动修，必须再开 security updates 才会开修复 PR。
-->

---
transition: fade-out
---

# 更新线：一份最小 dependabot.yml

想要 version updates，就得写 `.github/dependabot.yml`

```yaml
# .github/dependabot.yml
version: 2 # 必填，语法版本恒为 2
updates:
  - package-ecosystem: "npm" # 维护 npm / yarn / pnpm 依赖
    directory: "/" # 清单在仓库根目录
    schedule:
      interval: "weekly" # 每周查一次
  - package-ecosystem: "github-actions" # 顺手升 workflow 的 uses:
    directory: "/"
    schedule:
      interval: "weekly"
```

<div v-click>

提交到默认分支立即跑一次，之后按 `schedule` 定期跑；第二条**强烈建议开**。

</div>

<!--
version updates 必须写配置。最小骨架：version 恒为 2，updates 数组里每条对应一个生态。
这里配了 npm 和 github-actions 两条。github-actions 那条尤其推荐，能自动升级 workflow 里 uses 引用的 Action 版本。
-->

---
transition: fade-out
---

# package-ecosystem：管哪种依赖

必填，声明这条配置维护哪种包管理器（20+ 种，持续扩充）

| 取值 | 对应 | 取值 | 对应 |
| --- | --- | --- | --- |
| `npm` | npm / yarn / pnpm | `docker` | Docker 镜像 |
| `pip` / `uv` | Python | `github-actions` | workflow `uses:` |
| `gomod` | Go Modules | `terraform` | Terraform |
| `maven` / `gradle` | Java | `cargo` | Rust |
| `bundler` | Ruby | `nuget` | .NET |

<div v-click>

**`github-actions` 强烈建议开**：配合「用 commit SHA 锁定 Action」的实践，Dependabot 会把 SHA 抬到新版并标注对应 tag。

</div>

<!--
package-ecosystem 是每条配置的必填项，声明管哪种包管理器，支持二十多种，从 npm、pip 到 docker、terraform。
再次强调 github-actions：它能维护 workflow 里的 Action 版本，配合锁 SHA 的安全实践效果最好。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-16
---

# directory 与 schedule

清单在哪、多久查一次

::left::

<div v-click>

**directory / directories**

- `directory`：单路径，**不支持通配**
- `directories`：路径列表，**支持 glob**

```yaml
- package-ecosystem: "npm"
  directories: ["/apps/*", "/packages/*"]
  schedule:
    interval: "weekly"
```

</div>

::right::

<div v-click>

**schedule.interval**（必填）

| interval | 含义 |
| --- | --- |
| `daily` | 工作日每天 |
| `weekly` | 每周（默认周一） |
| `monthly` | 每月 1 号 |

配套：`day` / `time`（默认 05:00）/ `timezone`（默认 UTC）

</div>

<!--
目录二选一：directory 是单路径不支持通配；monorepo 用 directories，支持 glob，一条覆盖多包。
schedule.interval 必填，控制 version updates 的检查频率，daily / weekly / monthly 等，还能配 day、time、timezone。
-->

---
transition: fade-out
---

# 只更哪些、跳过哪些、开几个

用 `allow` / `ignore` 圈范围，`open-pull-requests-limit` 控数量

```yaml
- package-ecosystem: "npm"
  directory: "/"
  schedule: { interval: "weekly" }
  open-pull-requests-limit: 10 # 并发 PR 上限，默认 5；设 0 关掉 version updates
  allow:
    - dependency-type: "production" # 只更生产直接依赖
  ignore:
    - dependency-name: "react"
      update-types: ["version-update:semver-major"] # 跳过 react 大版本
```

<v-clicks>

- **顺序**：先 `allow` 圈定、再 `ignore` 剔除；同时命中则**以 ignore 为准**
- `open-pull-requests-limit` 只管 version updates；security updates 另有内部上限 **10**

</v-clicks>

<!--
这页三件事：open-pull-requests-limit 控制同时挂着的 PR 数，默认 5，设 0 能关掉常规更新只留安全更新。
allow 是白名单、ignore 是黑名单，处理顺序先 allow 后 ignore，冲突以 ignore 为准。
注意 ignore 的 update-types 要带 version-update:semver- 前缀。
-->

---
transition: fade-out
---

# versioning-strategy：怎么改版本约束

控制 Dependabot 如何修改 manifest 里的版本约束

| 取值 | 行为 |
| --- | --- |
| `auto`（默认） | 应用抬高最低版本；库放宽区间容纳新旧版 |
| `increase` | 一律把最低版本约束抬到新版 |
| `increase-if-necessary` | 仅当现约束装不下新版时才抬 |
| `lockfile-only` | 只更锁文件、不动 manifest（npm / bundler 等） |
| `widen` | 放宽区间同时包含新旧版（npm / composer 等） |

<div v-click>

`lockfile-only` 适合「跟进锁文件、不动约束」；`widen` 适合发库时保持宽松兼容区间。

</div>

<!--
versioning-strategy 决定它怎么改版本约束。默认 auto 会区分应用和库：应用抬最低版本，库放宽区间。
increase 一律抬高；increase-if-necessary 只在必要时抬；lockfile-only 只动锁文件；widen 放宽区间。发库常用 widen 或 lockfile-only。
-->

---
transition: fade-out
---

# groups：把一堆升级合成一个 PR

依赖一多，一个包一个 PR 会淹没你——`groups` 合并同 review

```yaml
groups:
  minor-and-patch: # 所有非破坏性升级合成一个 PR
    patterns: ["*"]
    update-types: ["minor", "patch"] # 裸写，不带前缀
  eslint: # ESLint 全家桶单独一组
    patterns: ["eslint", "@eslint/*", "eslint-*"]
  security: # 给安全更新也分组
    applies-to: "security-updates"
    patterns: ["*"]
```

<div v-click>

条件：`patterns` / `exclude-patterns` / `dependency-type` / `update-types` / `applies-to`（`version-updates` 缺省 / `security-updates`）。

</div>

<!--
groups 把符合条件的更新合并进一个 PR，让你集中 review。
按 patterns 匹配包名、dependency-type、update-types 分组，applies-to 决定作用于哪条线。
关键坑：groups.update-types 用裸的 minor / patch，跟 ignore 那个带 version-update:semver 前缀的写法不一样，写混不报错但不生效。
-->

---
transition: fade-out
---

# alerts：基于 GHSA 的漏洞检测

职责是**发现**——拿依赖图比对 GitHub Advisory Database

<v-clicks>

- **数据源**：只有**经 GitHub 审核**的 GHSA 公告会触发；靠依赖图扫默认分支
- **两种触发**：GHSA 新增公告（你没动代码），或依赖图变化（新增 / 升级依赖）
- **告警内容**：受影响文件链接、严重级、（若有）修复版本
- **局限**：新公告有滞后、归档仓库不扫、Actions 只认 semver tag 不认锁定 SHA
- **auto-triage**：可自动关闭低风险告警，缓解告警疲劳

</v-clicks>

<!--
alerts 负责发现：用仓库的依赖图去比对 GitHub Advisory Database，命中已知漏洞就在 Security 面板报警。
两种触发：世界变了（新公告）或你的依赖变了。
要知道它的局限：只认 GitHub 审核过的公告、有滞后、归档仓库不扫、Actions 只对 tag 报不对锁定 SHA 报。
-->

---
transition: fade-out
---

# security updates：最小必要升级

职责是**修复**——把漏洞依赖抬到「含补丁的最低版本」

<v-clicks>

- **最小必要**：只升到含补丁的最低版本，不顺手升最新，尽量少破坏；合并后 alert 自动关
- **前提**：依赖图 + alerts 都开，且依赖出现在 manifest / 锁文件
- **间接依赖**：npm 能改父依赖甚至移除子依赖来修；多数生态若须改父依赖则修不了
- **不混组**：security 与 version updates 不进同一 PR；不同生态的安全更新也彼此不分组
- **不需要 yml**：开关即可；也可用 yml 加 `labels` / `groups`（`applies-to: security-updates`）微调

</v-clicks>

<!--
security updates 负责修复：只做最小必要升级——升到含补丁的最低版本，不激进升级，合并后对应告警自动关。
前提是依赖图和 alerts 都开。间接依赖只有 npm 等少数生态能修。安全更新不需要写 yml，但可以用 yml 微调它。
-->

---
transition: fade-out
---

# @dependabot 评论命令

在 Dependabot 开的 PR 下评论即可操作，机器人以 👍 确认

| 命令 | 作用 |
| --- | --- |
| `@dependabot merge` / `squash and merge` | CI 通过后（squash）合并 |
| `@dependabot rebase` / `recreate` | rebase / 重建（recreate 覆盖你的改动） |
| `@dependabot cancel merge` / `reopen` / `close` | 取消合并 / 重开 / 关闭并阻止重建 |
| `@dependabot ignore this dependency` | 不再为该依赖开任何 PR（持久化） |
| `@dependabot ignore this major version` | 忽略此大版本 |

<div v-click>

默认自动 rebase 解冲突，PR 超 **30 天**没合停止 rebase；提交带 `[dependabot skip]` 可追加提交不被覆盖。

</div>

<!--
在 PR 下评论就能指挥它：merge、squash and merge、rebase、recreate、close、ignore 等，机器人用点赞确认。
recreate 会覆盖你的改动要小心。ignore 是持久化的、等价于写进配置。默认自动 rebase，但 PR 超过 30 天不合就停。
-->

---
transition: fade-out
---

# automerge：要额外搭两件套

Dependabot **只开 PR、不自动合并**——自动合并得自己搭

<v-clicks>

- **① 打开** GitHub 自动合并 + 分支保护 / 必需检查（合并前置条件）
- **② 写 workflow**：`dependabot/fetch-metadata` 读元数据，判断后 `gh pr merge --auto`

</v-clicks>

<div v-click>

```yaml
if: ${{ github.actor == 'dependabot[bot]' }}
steps:
  - uses: dependabot/fetch-metadata@v2
    id: meta
  - if: ${{ steps.meta.outputs.update-type == 'version-update:semver-patch' }}
    run: gh pr merge --auto --squash "$PR_URL" # 仅 patch 自动合
```

</div>

<div v-click class="text-sm text-gray">

坑：Dependabot 触发的 workflow `GITHUB_TOKEN` 权限受限，须显式声明 `permissions`；对比 Renovate 只需一行 `automerge: true`。

</div>

<!--
Dependabot 自己不合并 PR。要自动合并得两件套：先打开 GitHub 自动合并和分支保护，再写一个 workflow。
workflow 用 fetch-metadata 读出更新类型，比如只对 patch 调 gh pr merge --auto。
注意 Dependabot 触发的 workflow token 权限被收紧，要显式声明 permissions。对比之下 Renovate 只要一行 automerge: true。
-->

---
transition: fade-out
---

# 与 Renovate 取舍：二选一

Dependabot ＝ 省心；Renovate ＝ 可配。别在同一仓库同时开

| 维度 | Dependabot | Renovate |
| --- | --- | --- |
| 平台 | 仅 GitHub | GitHub / GitLab / Bitbucket 等 |
| 接入 | 平台内置，开箱即用 | Mend 托管 App 或自托管 |
| 可复用配置 | 无（复制粘贴） | **presets**（类 `extends`） |
| 自动合并 | **需额外配** 开关 + workflow | **内置** `automerge` |
| 仪表盘 | 无 | Dependency Dashboard |

<div v-click>

**别同时开**：两者一起跑会对同一依赖开重复 PR；迁移先关 Dependabot 的 version updates，**alerts 是平台能力可保留**。

</div>

<!--
Dependabot 哲学是克制、开箱、和 GitHub 一体；Renovate 是万能、跨平台、超能配、内置 automerge 和仪表盘。
项目在 GitHub、想零运维、主打安全告警与修复就选 Dependabot；要多平台、精细规则、开箱 automerge 就选 Renovate。
关键：别同时开，会重复开 PR。迁移先关 version updates，但 alerts 可以留着继续报警。
-->

---
layout: center
transition: fade-out
---

# 小结

<div class="text-left max-w-2xl mx-auto">

- **两条线**：安全线（alerts → security updates，GHSA 驱动，近零配置）＋ 更新线（version updates，写 yml）
- **一份配置**：`.github/dependabot.yml` —— `package-ecosystem` + `directory` + `schedule.interval` 起步
- **降噪三件套**：`open-pull-requests-limit` 限量、`allow` / `ignore` 圈范围、`groups` 合并 PR
- **省心之选**：GitHub 原生、开箱即用；要跨平台 / 开箱 automerge 才转 Renovate，**别同时开**

</div>

<div class="abs-br m-6 text-xl">
  <a href="https://docs.github.com/en/code-security/dependabot" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
  <a href="https://github.com/dependabot/dependabot-core" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
小结一下：记住两条线——安全线由 GHSA 驱动、几乎零配置，更新线要写 yml。
一份 dependabot.yml 从三要素起步；降噪靠 limit、allow / ignore、groups 三件套。
Dependabot 是 GitHub 项目的省心之选，需要跨平台或开箱 automerge 再考虑 Renovate，但记住别同时开。
-->
