---
theme: seriph
background: https://cover.sli.dev
title: semantic-release
info: |
  从 Conventional Commits 自动推断版本号的全自动发布工具：无人工定版本、无人工点发布、只在 CI 里跑。

  基于 semantic-release · 核于 2026-07
drawings:
  persist: false
transition: slide-left
mdc: true
---

# semantic-release

**全自动语义化发布：把「下一个版本号该是多少」从人的主观判断，变成对 Git 提交历史的确定性计算**

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  按空格翻页 <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
semantic-release 是一套「全自动」的版本发布工具：只要团队按 Conventional Commits 规范写提交，它就能在 CI 里自动完成整条发布链路——分析提交、推断版本号、生成说明与 CHANGELOG、打 tag、发 npm、建 Release，全程无人工敲定版本号、无人工点发布按钮。它刻意「切断人的情绪与版本号之间的连接」。
-->

---
transition: fade-out
---

# 什么是 semantic-release

全自动语义化发布：开发者只管写规范提交，发布这件事完全交给 CI

<v-clicks>

- **零人工定版本**：版本号不是人「定」的，是从提交历史「算」出来的
- **输入是 Conventional Commits**：`fix:`→patch、`feat:`→minor、`BREAKING CHANGE`→major
- **只在 CI 跑**：本地默认 dry-run（只演练），发布只在测试全过、目标分支上进行
- **一条自动链路**：分析提交 → 定版本 → 生成说明 / CHANGELOG → 打 tag → 发 npm → 建 Release
- **幂等可重跑**：靠 Git tag 记录「已发到哪」，无新提交就跳过，绝不重复发版

</v-clicks>

<!--
传统手工发布有四个顽疾：版本号靠主观拍板、步骤多易漏、不可复现、发布是「大事」导致攒一大批才发。semantic-release 的答案是把版本决策客观化、把发布流程自动化，人只需做一件事——把提交写规范。
-->

---
transition: fade-out
---

# 核心心智：版本号是提交历史的「函数」

没有隐藏状态、没有人工输入——同样的提交历史永远算出同样的版本号

<v-click>

```text
下一个版本号 = f(上次发布的 tag, 自那以来的所有提交)
```

</v-click>

<v-clicks>

- 先从 Git tag 找到「上次发布到哪个版本」
- 取自那个 tag 以来的全部提交，逐条按 Conventional Commits 解析 `type`
- 取其中**最高等级**的跳变作为本次发布类型（有一条 `feat` 就至少 minor）
- 若这些提交**没有任何一条**触发发布，则本次「不发布」（no release）

</v-clicks>

<!--
这就是「全自动」的本质：没有隐藏状态、没有人工输入。也正因如此，提交信息成了唯一的「输入」——它的质量直接决定发布的正确性。
-->

---
transition: fade-out
---

# 版本推断：Conventional Commits → SemVer

默认 angular 预设的映射规则（可通过 `preset` / `releaseRules` 定制）

<v-click>

| 提交类型 | 示例 | 版本跳变 |
| --- | --- | --- |
| `fix:` / `perf:` | `fix: 修复登录空指针` | **patch** `1.2.3 → 1.2.4` |
| `feat:` | `feat: 新增导出 CSV` | **minor** `1.2.3 → 1.3.0` |
| `feat!:` / 脚注 `BREAKING CHANGE:` | 破坏性变更 | **major** `1.2.3 → 2.0.0` |
| `docs` / `chore` / `refactor` / `test`… | `chore: 升级依赖` | **不发布** |

</v-click>

<v-clicks>

- **取最高等级**：一批提交同时有 `fix` 和 `feat` → minor；有一条破坏性变更就是 major
- **无相关提交 = 不发布**：打印 `no relevant changes` 正常退出（退出码 0），不是错误

</v-clicks>

<!--
破坏性变更两种写法：类型后加 ! 或正文脚注写 BREAKING CHANGE。无相关提交则不发布是设计而非错误——避免发出「只改了注释」的空版本。
-->

---
transition: fade-out
---

# 为什么必须在 CI 里跑

「只在 CI 跑」不是限制，而是保证发布确定性的前提

<v-clicks>

- **环境干净、可复现**：CI 是全新检出的工作区，不带本地脏文件 / 未提交改动 / 错的账号
- **正确的时机与分支**：发布只应发生在**测试全过之后**、且在配置的发布分支上
- **凭据集中管理**：`NPM_TOKEN` / `GITHUB_TOKEN` 作为 CI Secret 注入，不散落在个人电脑
- **可审计**：每次发布都对应一条 CI 记录（谁触发、基于哪个 commit、日志如何）
- **防误发**：用 env-ci 检测环境，非 CI 默认 `dryRun`，避免本地手滑真发一个版本

</v-clicks>

<!--
CI 天然是「测试全过才继续」的门控。可用 --no-ci 强制绕过，但不推荐用于真实发布。一句话：只在 CI 跑，是保证发布确定性的前提。
-->

---
transition: fade-out
---

# 最小上手三步

CI 里跑 + 一份配置 + 注入凭据，即可全自动发布

<v-click>

**①** 在 CI 里运行（推荐锁主版本、当发布期依赖）：`npx semantic-release@25`

</v-click>

<v-click>

**②** 仓库根放 `.releaserc.json`（用默认也能跑）：

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/github"
  ]
}
```

</v-click>

<v-click>

**③** CI 注入 `GITHUB_TOKEN` / `NPM_TOKEN`，`checkout` 设 `fetch-depth: 0` 拉全量历史与 tag

</v-click>

<!--
官方现在推荐把它当「发布期依赖」，用 npx 运行并锁主版本，而非日常 devDependency。配置文件也可用 .js/.cjs/.mjs 或 package.json 的 release 键。
-->

---
transition: fade-out
---

# 插件化生命周期：内核编排、插件干活

一次发布 = 九个有序 step；内核只做编排，具体每步由**插件**实现

<v-click>

```text
verifyConditions → analyzeCommits → verifyRelease → generateNotes
→ prepare → publish → addChannel → success → fail
```

</v-click>

<v-clicks>

- **只有 `analyzeCommits` 是必需的**（算版本的核心）；其余 step 装了对应插件才发生
- 多插件同 step：`analyzeCommits` 取**最高**、`generateNotes` **拼接**、其余按声明顺序**依次**执行
- 没插件实现某 step 就跳过；无相关提交则走到 `analyzeCommits` 就停，不进入后续 step

</v-clicks>

<!--
配置 semantic-release 的本质，就是「在合适的 step 上编排合适的插件」。想加一种发布目标就加实现 publish 的插件，想发布前跑脚本就用 @semantic-release/exec 挂到相应 step。
-->

---
transition: fade-out
---

# 默认四件套与「覆盖非追加」坑

不配 `plugins` 时的四个默认插件（按顺序执行）

<v-click>

| 插件 | 实现的 step | 干什么 |
| --- | --- | --- |
| `commit-analyzer` | analyzeCommits | 解析提交、判定发布类型 |
| `release-notes-generator` | generateNotes | 把提交汇成发布说明 |
| `npm` | verify / prepare / publish | 改 `package.json` 版本 + `npm publish` |
| `github` | verify / publish / success / fail | 建 Release + 通知 |

</v-click>

<v-click>

> **坑**：`plugins` 是**覆盖**不是追加——一旦自定义就要把插件**列全**；漏了 `commit-analyzer` 会**永远算不出版本**。

</v-click>

<!--
常按需增补的插件：@semantic-release/changelog 写 CHANGELOG、@semantic-release/git 回提交、@semantic-release/gitlab 建 GitLab Release、@semantic-release/exec 万金油。plugins 数组顺序在 prepare 阶段尤其重要。
-->

---
transition: fade-out
---

# 配置文件与八个全局选项

多格式配置任选其一放仓库根；全局选项只有八个

<v-clicks>

- **配置文件**：`.releaserc`（YAML/JSON）· `.releaserc.{json,js,cjs,mjs}` · `release.config.js` · `package.json` 的 `"release"` 键
- **八个全局选项**：`extends` / `branches` / `repositoryUrl` / `tagFormat` / `plugins` / `dryRun` / `ci` / `debug`；其余细节都在各插件选项里
- **优先级**：CLI 参数 > 本地配置文件 > `extends` 继承的 shareable config（就近覆盖）
- **注意**：插件选项**不能**用 CLI 传，只能写配置文件；`tagFormat` 默认 `v${version}`，中途改会匹配不到旧 tag

</v-clicks>

<v-click>

> 本地改配置想验证「会发什么版本」？用 `npx semantic-release --dry-run` 只算不发。

</v-click>

<!--
extends 把插件/分支/规则打包成 npm 包复用，本地配置就近覆盖。dry-run 会执行到 analyzeCommits + generateNotes，打印将要发布的版本号和说明，但跳过 prepare/publish 等有副作用的步骤。
-->

---
transition: fade-out
---

# branches：一份配置管多条发布线

三类分支各司其职，`channel` 直接对应 npm 的 dist-tag

<v-click>

| 分支类型 | 例子 | 作用 | dist-tag |
| --- | --- | --- | --- |
| 正式 | `main` | 发正式版（1~3 个，靠后版本须更高） | `latest` |
| 维护 | `1.x` / `1.2.x` | 老版本线继续发补丁 | 按 range |
| 预发布 | `beta` / `next` | 发 `2.0.0-beta.1` 预览版 | `beta` / `next` |

</v-click>

<v-clicks>

- 预发布 / 维护版发到**独立 dist-tag**，用户 `npm i pkg@beta` 才装到，**不污染 `latest`**
- 分支合并回正式线时，用 `addChannel` 把版本「提级」到 `latest`，无需重新构建

</v-clicks>

<!--
分支对象四属性：name（必填）、channel（渠道/dist-tag）、range（维护分支专用）、prerelease（预发布标识）。维护分支命名 N.x/N.N.x 时 range 可省。这样预览版和正式版井水不犯河水。
-->

---
transition: fade-out
---

# @semantic-release/git 回提交与 [skip ci] 死循环

默认发布**不回提交**——Git tag 才是真相来源，版本号只活在发布那一刻的工作区

<v-click>

想把 `CHANGELOG.md` / `package.json` 回提交到仓库，才用 `@semantic-release/git`：

```json
["@semantic-release/git", {
  "message": "chore(release): ${nextRelease.version} [skip ci]"
}]
```

</v-click>

<v-clicks>

- **死循环坑**：回提交若**没带 `[skip ci]`**，会再次触发 CI → 再跑 semantic-release，配置不当甚至无限发版
- 默认提交信息里的 `[skip ci]` 正是为切断这个环——自定义 `message` 时**务必保留**
- 官方明确：**「你多半不需要这个插件」**——它增加复杂度且是死循环根源

</v-clicks>

<!--
默认 assets 是 CHANGELOG.md、package.json 等。CHANGELOG 也可以从 GitHub Release 自动生成获取，不一定要落到仓库文件。除非有强需求，否则别装它，让发布保持无副作用、无死循环风险。
-->

---
transition: fade-out
---

# CI 集成：三个绕不开的前提

任何 CI 平台都一样——少一个就发布失败或版本错乱

<v-click>

```yaml
permissions:
  contents: write            # ② 写权限：打 tag / 建 Release
steps:
  - uses: actions/checkout@v4
    with: { fetch-depth: 0 } # ① 拉全量历史与 tag
  - run: npx semantic-release@25
    env:                     # ③ 注入凭据
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

</v-click>

<v-clicks>

- **最高频坑**：忘配 `fetch-depth: 0` → 浅克隆算不出历史 tag，每次都发成 `1.0.0`
- **权限 403**：未设 `permissions: contents: write`，打 tag / 建 Release 被拒
- **别在矩阵里跑多份**：只在**测试全过后**的单个发布 Job 里跑一次

</v-clicks>

<!--
GitLab 对应 GIT_DEPTH: 0。分支保护若要求 PR 合并，直接 push tag/commit 会被拒，需允许发布身份绕过。GITHUB_TOKEN 一份兼两用：Git 推送认证 + 平台 API。
-->

---
transition: fade-out
---

# 选型：monorepo 局限与三方对比

三者都能自动化发布，但**发布哲学**根本不同

<v-click>

| 维度 | semantic-release | Changesets | release-please |
| --- | --- | --- | --- |
| 版本来源 | Conventional Commits | 手写 changeset（声明意图） | Conventional Commits |
| 触发发布 | push 即发（全自动） | 合 Version PR 后发 | 合 Release PR 后发 |
| 人工闸门 | **无** | 有 | 有 |
| monorepo | 弱，需扩展 | **强**，多包最成熟 | 支持（manifest） |
| 语言 | 偏 JS/npm | 偏 JS/npm | **语言无关** |

</v-click>

<v-clicks>

- **monorepo 是短板**：开箱只面向单包，多包需 `semantic-release-monorepo` 等扩展
- **一句话选型**：无人值守 → semantic-release；monorepo + 人工把关 → Changesets；保留「点一下才发」→ release-please

</v-clicks>

<!--
semantic-release 的定位：全自动、单包、commit 驱动，push 即发布。典型场景：内部工具库、独立 SDK、后端服务镜像。多包独立版本、要人工控制每次发什么选 Changesets。
-->

---
transition: fade-out
---

# 提交规范是命根子：commitlint + Husky

semantic-release **只消费**提交、**不校验**提交——规范必须在源头强制

<v-click>

```bash
npm i -D @commitlint/{cli,config-conventional} husky
npx husky init
echo 'npx --no-install commitlint --edit "$1"' > .husky/commit-msg
```

</v-click>

<v-clicks>

- 不规范提交（如 `更新代码`）会被当「不触发发布的类型」忽略 → **该发的没发**；滥用 `feat` → 版本乱跳
- **Husky** 挂 `commit-msg` 钩子，每次提交调 **commitlint**，不合规就**拒绝提交**
- 完整链路：**commitizen 引导写 → commitlint + Husky 拦不合规 → CI 测试 → semantic-release 发布**

</v-clicks>

<!--
commitlint.config.js 采用 @commitlint/config-conventional 官方规则集。进一步可用 commitizen/cz-git 提供交互式提交引导，从「被动拦截」升级为「主动引导」。前三环保证输入质量，最后一环才敢全自动。
-->

---
layout: center
class: text-center
transition: fade-out
---

# 小结

semantic-release 把发布窄化成一件事：**从提交历史确定性地算出版本并自动发布**

<v-clicks>

- **心智模型**：`下一版本 = f(上次 tag, 之后的提交)`；全自动、只在 CI 跑、无相关提交则不发
- **版本映射**：`fix`/`perf`→patch、`feat`→minor、`BREAKING CHANGE`→major、其余不发
- **生命周期**：九步 · 内核编排插件干活 · `plugins` 覆盖非追加 · 默认四件套
- **branches**：正式 / 维护 / 预发布三类，`channel` = dist-tag；`git` 回提交记得 `[skip ci]`
- **命根子**：commitlint + Husky 守住提交规范，semantic-release 自己不校验

</v-clicks>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
  <a href="https://illegalscreed.cn/zh/engineering/release/semantic-release/" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
六点收束：心智模型、版本映射、插件化生命周期、branches 多轨发布、以及提交规范这个命根子。全自动的前提是提交质量，commitlint + Husky 守住输入，semantic-release 才敢在 CI 里无人值守地发布。感谢观看。
-->
