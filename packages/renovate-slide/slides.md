---
theme: seriph
background: https://cover.sli.dev
title: Renovate
info: |
  高度可配的依赖更新机器人：多生态、多平台，自动提 PR 升级依赖并刷新 lock。

  基于 Renovate · 核于 2026-07
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Renovate

**高度可配的依赖更新机器人：多生态、多平台、自动提 PR**

扫描清单文件 → 发现过期依赖 → 按策略提 PR 升级并刷新 lock，Mend 托管 App 或自托管皆可

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/renovatebot/renovate" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Renovate：一个由 Mend 维护的开源依赖更新机器人。

一句话定位：它扫描仓库里的各类清单文件，发现过期依赖后自动提 PR 升级版本并刷新 lock 文件。

两大招牌特征——高度可配，从一行 extends 到上百条精细规则皆可；多生态多平台，90 多个包管理器乘以 9 个 Git 平台。既能用 Mend 托管的 App 一键接入，也能自托管进任意 CI。
-->

---
transition: fade-out
---

# 什么是 Renovate

Mend 维护的开源、跨生态、跨平台依赖更新机器人

<v-clicks>

- **两大特征**：高度可配（`renovate.json` + `extends` 预设 + `packageRules` 分层）× 多生态多平台（**90+** 包管理器 × **9** 个 Git 平台）
- 扫描各类清单文件：`package.json`、`Dockerfile`、`*.tf`、`go.mod`、`.github/workflows/*.yml` 等
- 发现过期依赖 → 自动提 PR / MR 升级版本并刷新 lock 文件
- 只改**依赖版本号与 lock**，不动业务代码，安全、可回滚
- 两种形态：Mend 托管 **App**（零运维）/ **自托管**（进任意 CI）

</v-clicks>

<!--
Renovate 是什么？一个以跨生态、跨平台为卖点的依赖更新机器人，由 Mend（原 WhiteSource）维护，TypeScript 编写、AGPL-3.0 开源。

它的两大特征值得记住：一是高度可配，靠 renovate.json 加 extends 预设加 packageRules 分层规则；二是覆盖面极广，90 多个包管理器乘 9 个平台。

工作对象是仓库里的清单文件——package.json、Dockerfile、Terraform 的 tf、go.mod、GitHub Actions 工作流等。

它只改依赖版本号和 lock 文件，不碰业务代码，所以安全、可回滚。

运行形态两种：Mend 托管的 App 零运维，或者自托管进你自己的 CI。
-->

---
transition: fade-out
---

# 工作循环

定时扫描 → 提 PR → 测试通过可自动合并

<v-clicks>

- **① 扫描**：按文件名匹配识别清单，每种生态对应一个 **manager**（提取器）
- **② 查版本**：通过 **datasource**（npm / Docker registry、GitHub tags）查可用新版本
- **③ 生成分支 / PR**：按分组、排期、限流、`rangeStrategy` 建分支提 PR，正文附 changelog 与兼容性徽章
- **④ 收尾**：CI 通过后符合条件的 PR 可自动合并，整体状态汇总在 **Dependency Dashboard**

</v-clicks>

<div v-click class="mt-4">

底层 **manager**（提取器）+ **datasource**（版本源）+ **versioning**（版本方案）三层解耦，因此能覆盖极广生态

</div>

<!--
它的工作循环分四步。

第一步扫描：按文件名匹配识别仓库里的清单文件，每种生态对应一个 manager，也就是提取器。

第二步查版本：通过对应的 datasource，比如 npm registry、Docker registry、GitHub tags，查每个依赖的可用新版本。

第三步生成分支和 PR：根据你在 renovate.json 里配的分组、排期、限流、rangeStrategy 等规则，建更新分支提 PR，正文里附上 changelog、release notes 和兼容性徽章。

第四步收尾：CI 测试通过后，符合条件的 PR 可以被自动合并，整体状态汇总在 Dependency Dashboard 这个 issue 里。

底层是 manager、datasource、versioning 三层解耦，这就是它能支持极广生态的原因。
-->

---
transition: fade-out
---

# 两种接入方式

先想清楚用 App 还是自托管

| 维度 | Mend 托管 App | 自托管（Self-hosted） |
| --- | --- | --- |
| 谁来跑 | Mend 的基础设施 | 你的 CI / 服务器 |
| 凭据 | 授权 App 即可 | 机器人账号 + PAT（`RENOVATE_TOKEN`） |
| 排期 | Mend 按 cron 触发 | 你自己配 cron（建议每小时） |
| 升级 bot | Mend 自动 | 你自己升级 Renovate |
| 适合 | 多数团队、想零运维 | 私有网络、合规、需完全掌控 |

<div v-click class="mt-4">

先用 **App** 最省事；只有私有部署、接私有制品库、或合规隔离要求时，才值得自托管。

</div>

<!--
接入前先做个二选一：用 Mend 托管的 App，还是自托管。

看这张表。谁来跑：App 是 Mend 的基础设施，自托管是你自己的 CI 或服务器。凭据：App 授权一下就行，自托管要建专用机器人账号加 PAT，也就是 RENOVATE_TOKEN。排期：App 由 Mend 按 cron 触发，自托管要你自己配 cron，官方建议每小时跑一轮。升级 bot：App 自动升级，自托管得你自己升。

选型建议：个人和团队仓库直接装 App 最省事；只有私有部署、要接私有制品库、或有合规网络隔离要求时，才值得自托管。
-->

---
transition: fade-out
---

# renovate.json 配置文件

按顺序查找、找到第一个即用；一行即可起步

<v-clicks>

- **查找顺序**：`renovate.json` → `.json5` → `.github/renovate.json` → `.renovaterc.json` →（`package.json` 字段**已废弃**）
- 用 `renovate.json5` 可写注释 / 尾逗号；改完用 `renovate-config-validator` 本地校验

</v-clicks>

<div v-click>

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"]
}
```

</div>

<div v-click class="text-sm text-gray">

最小可用配置——只继承官方推荐预设；加 `$schema` 换来编辑器字段补全与校验

</div>

<!--
配置文件叫 renovate.json。Renovate 会按一个固定顺序查找，找到第一个就用：renovate.json、json5、.github 下的、.renovaterc 系列，最后是 package.json 里的 renovate 字段，但这个字段已经废弃了，新项目别用。

如果规则变多，用 renovate.json5，可以写注释和尾逗号。改完配置别等它跑一轮才发现写错，用官方的 renovate-config-validator 本地校验。

最小可用配置就这么点：加一个 extends config:recommended 继承官方推荐预设。顶部的 $schema 强烈建议加上，能让 VS Code 对这个文件做字段补全和校验。
-->

---
transition: fade-out
---

# extends 预设体系

打包好的一组配置，复用「合理默认」；数组内**后者覆盖前者**

| 预设 | 作用 |
| --- | --- |
| `config:recommended` | 官方推荐基线（**旧名 `config:base`**，v36 改名） |
| `config:best-practices` | recommended + pin digest + 稳定期 + 配置迁移 |
| `config:js-app` | recommended + 锁死应用全部依赖 |
| `config:js-lib` | recommended + 只锁 devDependencies |

<v-clicks>

- `config:recommended` 已含：Dependency Dashboard、语义化提交、`group:monorepos`、Merge Confidence 徽章
- 预设族：`config:*` / `group:*` / `schedule:*` / `docker:*` / `helpers:*` / `security:*`，及 `:` 开头内置预设

</v-clicks>

<!--
extends 是一个预设数组。预设就是打包好的一组配置，用来复用合理默认、避免重复。记住一条：数组里后面的预设覆盖前面的，last wins。

看这几个最常用的。config:recommended 是官方推荐基线，绝大多数项目从它起步；注意它有个旧名叫 config:base，v36 起改名了，校验器会提示你迁移。config:best-practices 在 recommended 之上叠加更严的实践，pin digest、稳定期、配置迁移 PR。config:js-app 给应用锁死全部版本，config:js-lib 给库只锁 devDependencies。

config:recommended 已经打包了 Dependency Dashboard、语义化提交前缀、group:monorepos 分组、Merge Confidence 徽章等一堆好默认。

预设分很多族：config、group、schedule、docker、helpers、security，还有冒号开头的内置默认预设。
-->

---
transition: fade-out
---

# packageRules：匹配 + 策略

一条规则里的所有 `match*` 条件是 **AND**，全部命中才应用其余配置

```json
{
  "packageRules": [
    { "matchPackageNames": ["react", "react-dom"] },
    { "matchPackageNames": ["@types/**"] },
    { "matchPackageNames": ["/^@aws-sdk//"] },
    { "matchPackageNames": ["*", "!renovate"] }
  ]
}
```

<v-clicks>

- 四种写法：**精确** `react` / **glob** `@types/**` / **正则** `/^.../`（一对斜杠，默认区分大小写）/ **取反** `!renovate`
- 匹配器还有 `matchDepTypes`、`matchManagers`、`matchDatasources`、`matchUpdateTypes`、`matchFileNames`
- **v38 起**废弃 `matchPackagePatterns` / `matchPackagePrefixes`，统一并入 `matchPackageNames`

</v-clicks>

<!--
packageRules 是 Renovate 的核心，一个规则对象数组。关键逻辑：一条规则里的所有 match 条件都命中，也就是 AND，这条规则的其余配置才应用到那个依赖；多条规则按顺序叠加，后面覆盖前面。

看 matchPackageNames 的四种写法。精确：直接写完整包名 react。glob：@types/ 双星号，按 minimatch 匹配所有 @types 包。正则：用一对斜杠包起来，re2 引擎，默认区分大小写。取反：叹号前缀表示排除，跟其它模式组合。

匹配器还有很多：按依赖类型、按 manager、按 datasource、按更新类型、按文件路径。

一个重要变更：v38 起把 matchPackagePatterns、matchPackagePrefixes 全部废弃，统一并进 matchPackageNames，因为它自己现在就支持这四种语义了。校验器会自动迁移旧写法。
-->

---
transition: fade-out
---

# 分组（grouping）

给 `packageRules` 加 `groupName`，把多个依赖并成一个 PR——最有效的降噪手段

```json
{
  "packageRules": [
    { "matchPackageNames": ["@types/**"], "groupName": "type definitions" },
    { "matchUpdateTypes": ["minor", "patch"], "groupName": "non-major" }
  ]
}
```

<v-clicks>

- 相同 `groupName` 即同组，可**跨规则聚合**；`groupSlug` 自定义分支名里的短标识
- 官方分组预设：`group:monorepos`（recommended 已含）、`group:allNonMajor`、`group:definitelyTyped`

</v-clicks>

<!--
默认 Renovate 是一个依赖一个 PR，量大时会淹没你。降噪最有效的手段是分组：给 packageRules 加一个 groupName，就能把多个依赖并成一个 PR。

例子里，第一条把所有 @types 包并成一个叫 type definitions 的 PR；第二条把所有非大版本的 minor 和 patch 并成一个叫 non-major 的 PR。

两个细节：不同规则里写相同的 groupName 会被合进同一个组，可以跨规则聚合；groupSlug 用来自定义分支名里的短标识。

也可以直接用官方分组预设：group:monorepos 把关联 monorepo 包一起升，recommended 已经含了；group:allNonMajor 把所有非大版本合一个；group:definitelyTyped 归组 @types。
-->

---
transition: fade-out
---

# 排期（schedule）

限制**创建**分支 / PR 的时间窗口——不限制合并

```json
{
  "schedule": ["* 0-4 * * *"],
  "timezone": "Asia/Shanghai"
}
```

<v-clicks>

- 推荐 **cron 语法**：5 段，**分钟位必须是 `*`**，最小粒度 1 小时
- `timezone` 默认 **UTC**，跨时区团队务必显式设 IANA 名，否则「凌晨」窗口错位
- 窗口外**已存在的 PR 仍会被更新**（rebase）；预设：`schedule:weekly` / `schedule:nonOfficeHours`

</v-clicks>

<!--
schedule 用来限制 Renovate 创建新分支和 PR 的时间窗口，默认是 at any time 无限制。

推荐用 cron 语法：5 段，注意分钟位必须是星号，最小粒度是 1 小时。例子里这条是每天凌晨 0 到 4 点，配合 timezone 设成上海时区。

两个坑要记住。第一，timezone 不设就是 UTC，跨时区团队一定要显式设 IANA 名，否则你以为的凌晨窗口会错位。第二，schedule 只限制创建，不限制合并——窗口外已经存在的 PR 仍然会被 rebase、被更新。

不想手写 cron，也有预设：schedule:weekly、schedule:nonOfficeHours 非工作时间加周末等等。
-->

---
transition: fade-out
---

# rangeStrategy：版本范围怎么改

决定如何改清单里的版本范围（默认 `auto`）——「应用 vs 库」的核心开关

| 策略 | `^1.0.0` 遇 1.1.0 | 遇 2.0.0 | 适用 |
| --- | --- | --- | --- |
| `pin` | → `1.1.0` | → `2.0.0` | 应用 |
| `bump` | `^1.0.0`→`^1.1.0` | →`^2.0.0` | 清单永远追最新 |
| `replace` | 只更新 lock | → `^2.0.0` | 库 / 保守 |
| `widen` | 保持 | → `^1.0.0 \|\| ^2.0.0` | peerDependencies |

<v-clicks>

- **应用**用 `pin`：坏版本会以「失败的 PR」暴露，而非静默升级；另有 `update-lockfile` 只动 lock
- **库**保留范围（`replace` / `widen`），避免下游 `node_modules` 出现重复副本

</v-clicks>

<!--
rangeStrategy 决定 Renovate 如何修改清单文件里的版本范围，比如 caret 1.0.0，默认是 auto。这是应用还是库这个策略的核心开关。

以现有范围 caret 1.0.0 为例。pin 锁成精确版本，1.1.0 就写死 1.1.0，2.0.0 就写死 2.0.0，适合应用。bump 抬高范围下界保留符号，范围内也提 PR，适合想让清单永远追最新。replace 只在超范围时才改清单，范围内只更新 lock，适合库和保守场景。widen 扩宽范围以包含新版本，常用于 peerDependencies。

选型经验：应用用 pin，好处是坏版本会变成一个失败的升级 PR 暴露出来，而不是静默升级；只想动 lock 不想改清单，可以用 update-lockfile。库要保留范围，用 replace 或 widen，避免下游 node_modules 里出现重复副本。
-->

---
transition: fade-out
---

# 依赖面板与限流

Dependency Dashboard 总览 + 三个 limit 收敛「PR 洪水」

<div class="grid grid-cols-2 gap-6">

<div>

**Dependency Dashboard**

一个 issue 总览：待处理 / 限流中 / 已开 PR / 出错 / 被忽略的更新；勾选复选框可触发操作。

`config:recommended` 默认已开；设 `dependencyDashboardApproval: true` 后 PR 需先在面板勾选批准。

</div>

<div>

**限流（含默认值）**

| 选项 | 默认 |
| --- | --- |
| `prConcurrentLimit` | `10` |
| `prHourlyLimit` | `2` |
| `branchConcurrentLimit` | `null` |

多数仓库把并发调到 `3`~`5` 更顺，形成稳定节奏。

</div>

</div>

<!--
这一页讲两个降噪工具：依赖面板和限流。

Dependency Dashboard 是 Renovate 在仓库里开的一个 issue，总览所有依赖更新状态：待处理的、因排期或限流而等待的、已开的 PR、出错项、被忽略或废弃有替代建议的包。你可以勾选面板里的复选框来触发操作，比如强制现在就建某个被限流的 PR。config:recommended 默认已经开了它。还可以设 dependencyDashboardApproval，让 Renovate 不主动提 PR，你在面板上勾哪个才提哪个。

限流三个选项：prConcurrentLimit 同时开着的 PR 上限，默认 10；prHourlyLimit 每小时新建上限，默认 2；branchConcurrentLimit 默认 null 继承前者。官方经验是把并发调到 3 到 5 往往比默认 10 更好推进，形成稳定节奏。
-->

---
transition: fade-out
---

# 自动合并（automerge）

「凡是你本来也会直接 merge 的更新，就开自动合并」

```json
{
  "packageRules": [
    { "matchDepTypes": ["devDependencies"], "matchUpdateTypes": ["minor", "patch"], "automerge": true },
    { "matchManagers": ["github-actions"], "automerge": true },
    { "matchUpdateTypes": ["lockFileMaintenance"], "automerge": true }
  ]
}
```

<v-clicks>

- 只有**测试通过 + 分支与基线同步**才合，通常需约 **2 小时**窗口；`platformAutomerge`（默认开）用平台原生更快
- 阻塞项：缺状态检查、分支保护要评审、CODEOWNERS；务必先有靠谱 CI，并排除 `<1.0.0` 的包

</v-clicks>

<!--
自动合并让那些你本来也会点 merge 的更新无需人工介入。官方的原则一句话：凡是你本来也会直接 merge 的，就开自动合并；想读 changelog 的就别开。

看这个低风险子集：devDependencies 的 minor 和 patch、github-actions、以及 lockFileMaintenance，这三类通常可以放心自动合。建议只在 packageRules 里对特定范围开，别全局开。

两个要点。第一，只有所有必需状态检查通过、且分支与基线同步时才会合，通常需要约两小时窗口，每轮每个基线只合一个分支；platformAutomerge 默认开，用平台原生自动合并更快。第二，会阻塞自动合并的情况：没有通过的状态检查、分支保护要求评审、CODEOWNERS。所以开之前务必先有覆盖到位的 CI，并把 SemVer 小于 1.0.0 的包排除，因为 0.x 的破坏性变更常混在 minor、patch 里。
-->

---
transition: fade-out
---

# 稳定期与 lock 文件维护

让新版本先「冷静」，并定期重建整个 lock

<div class="grid grid-cols-2 gap-6">

<div>

**minimumReleaseAge 稳定期**

```json
{
  "minimumReleaseAge": "3 days",
  "internalChecksFilter": "strict"
}
```

`strict`（默认）稳定期未过**不建 PR**；`none` 则先建 PR 挂 pending。替代旧的 `stabilityDays`。

</div>

<div>

**lockFileMaintenance**

```json
{
  "lockFileMaintenance": {
    "enabled": true,
    "schedule": ["before 5am on monday"]
  }
}
```

定期从头重建 lock，把**间接依赖**也拉到最新。只动 lock、配自动合并很安全。

</div>

</div>

<!--
两个进阶降噪与稳健化手段。

左边 minimumReleaseAge 稳定期：让新版本先冷静几天再升，躲开刚发布几小时就被撤回或打补丁的坏版本。配 internalChecksFilter，默认就是 strict，稳定期没过根本不建 PR；如果设成 none，就会先建 PR 但挂一个 pending 状态检查，等够天数再转通过。它替代了旧选项 stabilityDays。

右边 lockFileMaintenance：普通更新只动被升级的那个依赖，而它会定期从头重建整个 lock 文件，把所有间接依赖也拉到各自范围内的最新，解决直接依赖没变但间接依赖早就过时的问题。因为只动 lock 不动清单，配自动合并很安全。config:best-practices 里的 maintainLockFilesWeekly 就是把它设成每周一次。
-->

---
transition: fade-out
---

# 自定义 manager 与共享预设

内置覆盖不到就用正则提取；组织级配置一处改、全组织生效

<div class="grid grid-cols-2 gap-6">

<div>

**customManagers（regex）**

在文件里写 renovate 注释 + 命名捕获组抓版本：

```bash
# renovate: datasource=github-releases depName=helm/helm
HELM_VERSION="3.16.2"
```

`managerFilePatterns`（旧名 `fileMatch`）指定扫描文件；`customType` 取 `regex` / `jsonata`。

</div>

<div>

**组织共享预设**

配置抽到中心仓库，各项目一行继承：

```json
{ "extends": ["github>org/renovate-config"] }
```

语法 `github>` / `gitlab>` / `local>`；支持子路径 / 分支 `repo:path#branch`。

</div>

</div>

<!--
两个进阶能力。

左边 customManagers：内置 manager 覆盖不到的文件，比如 Shell 脚本里的版本号、CI 变量、自研格式，用自定义 manager 靠正则或 JSONata 提取。最常见的模式是在文件里写一行 renovate 注释，标注 datasource 和 depName，再用正则的命名捕获组抓版本。看例子这个 bash：注释声明了数据源是 github-releases、依赖是 helm/helm，下面的 HELM_VERSION 就是被抓的版本。字段里 managerFilePatterns 指定扫哪些文件，它是旧名 fileMatch 的新名；customType 取 regex 或 jsonata。

右边组织共享预设：多仓库场景，把配置抽到一个中心仓库，各业务仓库只写一行 extends 继承，改一处全组织生效。引用语法按平台：github 尖括号、gitlab 尖括号、local 尖括号自托管常用；还支持指定子路径和分支。
-->

---
transition: fade-out
---

# 安全 / 漏洞更新

漏洞修复 PR「插队」，不被降噪规则拖住

<v-clicks>

- 安全 / 漏洞 PR **绕过 `schedule`、限流、Dashboard 审批**，尽快创建
- **GitHub 平台**用 GitHub Security Advisories（GHSA），`:enableVulnerabilityAlerts` 预设开启
- `osvVulnerabilityAlerts: true` 接入 Google **OSV** 数据库，含**恶意包检测**
- `vulnerabilityAlerts` 定制安全 PR：标签、`vulnerabilityFixStrategy`（最低修复 / 升到最新）

</v-clicks>

<div v-click class="mt-3">

安全补丁既紧急又多为补丁级，很多团队单独对它开自动合并——但仍要 CI 兜底。

</div>

<!--
Renovate 除了跟进新版本，也能专门修漏洞。它从漏洞数据库比对当前依赖，为受影响的包优先提修复 PR。

最关键的行为：安全和漏洞修复 PR 会插队——绕过 schedule 排期、绕过限流、绕过 Dependency Dashboard 审批，尽快创建，确保安全问题不被你设的降噪规则拖住。

数据源上，GitHub 平台用 GitHub Security Advisories，也就是 GHSA，用 enableVulnerabilityAlerts 预设开启。另外 osvVulnerabilityAlerts 设成 true 可以接入 Google 的 OSV 数据库，跨平台可用，还包含恶意包检测。

vulnerabilityAlerts 是个配置对象，专门定制安全 PR：打标签、指定 vulnerabilityFixStrategy 是最低修复还是直接升到最新。

安全补丁既紧急又通常是补丁级，很多团队会单独对它开自动合并，但仍要有 CI 兜底，因为安全补丁偶尔也会带破坏性变更。
-->

---
transition: fade-out
---

# 与 Dependabot 对比

可配 vs 省心——同一生态二选一，别同时开

| 维度 | Renovate | Dependabot |
| --- | --- | --- |
| 平台 | **9 个**（含 GitLab / Bitbucket） | 主要 GitHub、Azure DevOps |
| 内置性 | 装 App / 自托管 | **GitHub 原生内置**，零安装 |
| 配置 | `renovate.json`（预设 + 分层） | `dependabot.yml`（简单直接） |
| 分组 | **极强**：任意条件 + monorepo | 较粗，不合并常见 monorepo 包 |
| 依赖面板 | **Dependency Dashboard** | 无 |

<v-clicks>

- 只在 GitHub、想零配置 → **Dependabot**；要分组 / 精细排期 / monorepo / 冷门生态 → **Renovate**
- **别对同一生态同时开两者**，否则重复 PR、版本互相打架；二选一

</v-clicks>

<!--
最后横向对比 Renovate 和 Dependabot。两者都是自动提 PR 升级依赖的机器人，定位重叠但取舍不同。

看表。平台：Renovate 支持 9 个，含 GitLab、Bitbucket 等，Dependabot 主要是 GitHub 加 Azure DevOps。内置性：Renovate 要装 App 或自托管，Dependabot 是 GitHub 原生内置、零安装、公私仓免费。配置：Renovate 用 renovate.json，有预设和分层，Dependabot 用 dependabot.yml，简单直接。分组：Renovate 极强，任意条件加 monorepo 预设，Dependabot 较粗，还不合并常见 monorepo 包。依赖面板：Renovate 有 Dependency Dashboard，Dependabot 没有。

选型直觉：只在 GitHub、想零配置，选 Dependabot；要分组、精细排期、monorepo、或覆盖 Bazel、Helm、Terraform 这类冷门生态，选 Renovate。

最重要一条：别对同一生态同时开两个机器人，否则各提各的 PR，重复、版本互相打架、审阅噪音翻倍。同一仓库同一生态只保留一个。
-->

---
layout: center
---

# 小结

Renovate = **高度可配 + 多生态多平台**的依赖更新机器人

<v-clicks>

- 一行起步 `extends: ["config:recommended"]`；更严用 `config:best-practices`
- 核心是 `packageRules`：`match*` 组合 + 分组 / 排期 / `rangeStrategy` / 自动合并
- 降噪四件套：**分组** + **schedule** + **限流** + **Dependency Dashboard**
- 进阶：`minimumReleaseAge` 稳定期、`lockFileMaintenance`、`customManagers`、组织共享预设
- 安全 PR 插队；与 Dependabot **同生态二选一**——省心选 Dependabot，可配选 Renovate

</v-clicks>

<div class="abs-br m-6 text-xl">
  <a href="https://docs.renovatebot.com/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
  <a href="https://github.com/renovatebot/renovate" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
小结一下。

Renovate 是一个高度可配加多生态多平台的依赖更新机器人。

上手：一行 extends config:recommended 起步，想更严用 config:best-practices。

核心是 packageRules：用 match 系列条件组合，配上分组、排期、rangeStrategy、自动合并等策略。

降噪记住四件套：分组、schedule 排期、限流、Dependency Dashboard。

进阶能力：minimumReleaseAge 稳定期、lockFileMaintenance 重建 lock、customManagers 自定义提取、组织共享预设。

安全 PR 会插队；跟 Dependabot 是同生态二选一——想省心选 Dependabot，要可配选 Renovate。谢谢大家。
-->

---
layout: end
---
