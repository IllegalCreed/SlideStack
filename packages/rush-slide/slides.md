---
theme: seriph
background: https://cover.sli.dev
title: Rush
info: |
  Rush：微软出品的企业级大 monorepo 管理器。

  基于 Rush（@microsoft/rush 5.x）· 核于 2026-07
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Rush

**微软出品的企业级大 monorepo 管理器**

治理 + 增量构建 + 受控发布，一层编排统管几百个包（基于 5.x）

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
大家好，今天聊 Rush——微软 Rush Stack 出品的企业级大 monorepo 管理器。

它跟 Turborepo、Nx 不太一样：卖点不是"构建快"，而是"几百人协作下依赖不乱、发布可控"。
-->

---
transition: fade-out
---

# 什么是 Rush？

面向大规模企业级 JS/TS 大仓的编排层，不是构建工具

<v-clicks>

- 微软 **Rush Stack** 出品，Azure SDK / OneDrive / SharePoint 等大仓验证
- 本质是**编排层**：统一做跨项目的安装、互链、并行构建、发布、部署、治理
- **不替代构建工具**：单项目内部用什么构建（Heft / tsc / Webpack）由你定
- 定位「**one Git repo per team**」——一个团队 / 产品线一个大仓
- 卖点是**正确性 · 治理 · 受控发布 · 确定性**，而非构建速度

</v-clicks>

<!--
第一个要扭正的认知：Rush 不编译任何代码，它编排你已有的构建。

跨项目的"装依赖、并行 build、发包、打部署包"归 Rush；单项目内部的 tsc/webpack/jest 归你自己的构建工具。
-->

---
transition: fade-out
---

# Rush 解决什么问题？

把多仓协作的四大痛点，作为设计出发点

<v-click>

| 多仓痛点 | Rush 的回答 |
| --- | --- |
| **隧道视野** | 一个大仓装下互相依赖的包，改动即刻可见 |
| **级联发布** | 中心化安装 + 本地互链，改一处全仓即用 |
| **下游受害者** | 改动时**一起跑全部单测**，回归当场暴露 |
| **link 地狱** | Rush 统一管理 symlink，禁用手动 `npm link` |

</v-click>

<!--
选 Rush 的信号很清晰：你的瓶颈是"几百人协作下的依赖混乱与发布失控"，而不是"CI 构建慢"。

后者是 Turborepo 的主场，前者才是 Rush 的主场。
-->

---
transition: fade-out
---

# rush.json：唯一必需的主配置

仓根一个 JSONC，最小配置只需三样：引擎 + 包管理器 + 项目清单

<v-click>

```json
{
  "rushVersion": "5.177.1",           // 版本选择器锁定的引擎
  "pnpmVersion": "8.15.0",            // 包管理器三选一（推荐 pnpm）
  "ensureConsistentVersions": true,   // 全仓依赖版本强制一致
  "projects": [
    { "packageName": "@scope/app", "projectFolder": "apps/app" }
  ]
}
```

</v-click>

<v-click>

**全局装的 `rush` 只是薄壳**——它读 `rushVersion` 自动下载并调用锁定的引擎版本，全团队 + CI 行为一致、bug 可复现。

</v-click>

<!--
版本选择器是 Rush 的关键设计：升级 Rush 只改 rush.json 一行，全团队下次运行自动切换，杜绝"在我机器上能跑"。

其余配置都放在 common/config/rush/ 目录。
-->

---
transition: fade-out
---

# 选包管理器：官方推荐 pnpm

三选一，Rush 给出明确倾向

<v-click>

| 包管理器 | Rush 视角 |
| --- | --- |
| **pnpm（推荐）** | 严格 symlink 模拟真实依赖图，根治幻影 / 重影；唯一支持 `--strict-peer-dependencies` |
| npm | 兼容最好、最宽容；但无法根治 hoisting 的幻影 / 重影 |
| yarn | 介于两者之间；Rush 支持较新、验证不足；不启用 workspaces |

</v-click>

<!--
推荐 pnpm 的核心理由是依赖治理——它从根上消除幻影依赖与重影这两类"扁平化的病"。

这是 Rush 的招牌深度考点，下一页展开。
-->

---
transition: fade-out
---

# 依赖治理：两大病与 pnpm 解药

大仓里最隐蔽的两类腐化，都是 npm/yarn 扁平化的产物

<div grid="~ cols-2 gap-4">
<div>

**phantom（幻影依赖）**

- 用了**没声明**的包
- 靠 hoisting 借到父级 `node_modules`
- → 版本失配、发布事故

</div>
<div>

**doppelganger（同版本重影）**

- **同一版本被复制多份**
- 树形解析的固有怪癖
- → 单例破裂、TS 类型冲突、体积翻倍

</div>
</div>

<v-click>

**pnpm 是解药**：每个包只见自己声明的依赖（幻影无从发生）+ 精确模拟真实 DAG（重影消失）。

</v-click>

<!--
一句话记忆：phantom = 用了没声明的（hoisting 借来的）；doppelganger = 同一版本被复制成多份。

这正是 Rush 推荐 pnpm 的根本原因。
-->

---
transition: fade-out
---

# rush install vs rush update

装依赖两种姿势，区分它们是最高频考点

<v-click>

| 命令 | 用途 | 会改文件吗 |
| --- | --- | --- |
| **`rush update`** | 开发者日常（改了 `package.json`） | **会**：按需更新 shrinkwrap |
| **`rush install`** | CI 专用（干净仓库装依赖） | **不会**：锁文件过期即构建失败 |

</v-click>

<v-click>

**禁令**：仓内绝不直接跑 `npm/pnpm/yarn install`、`npm link`；shrinkwrap 放 `common/config/rush/` 必须提交；清理用 `rush purge`。

</v-click>

<!--
Rush 是中心化安装：所有依赖装进 common/temp/node_modules，再为每个项目 symlink 出 node_modules，全仓只装一次。

install 只读的设计保证 CI 用的是已提交的确定依赖，不会偷偷改锁文件。
-->

---
transition: fade-out
---

# 增量构建：靠内容哈希，不靠时间戳

`rush build` 增量 vs `rush rebuild` 全量

<v-clicks>

- **`rush build`**：只建**变化**的项目；**`rush rebuild`**：忽略增量、干净重建所有
- 「已最新」三条件：① 本地建过 ② 输入文件与 npm 依赖未变 ③ 依赖的 Rush 项目也最新
- 增量靠 **`@rushstack/package-deps-hash`** 对**文件内容**哈希（遵守 `.gitignore`）
- 切分支时间戳全变、内容没变 → 增量**不误判**，比看 mtime 可靠
- 并行 `-p max`（= CPU 核数）；`-v` 详细日志、`--timeline` 时序图

</v-clicks>

<!--
mtime 在 monorepo 里极不可靠：git checkout 会重写一堆文件时间戳，内容却一个字没改。

Rush 用内容哈希解决它——这是增量比"看时间戳"类工具更可靠的关键。增量状态存在 .rush/temp/，不提交。
-->

---
transition: fade-out
---

# 项目子集选择器

大仓里只建「我改的那块 + 相关的」

<v-click>

| 参数 | 含义 | 安全性 |
| --- | --- | --- |
| `--to X` | X + 其所有**上游依赖** | 安全（最常用） |
| `--from X` | X + 所有**下游依赖者** | 安全 |
| `--impacted-by X` | X + 下游，**忽略上游** | **unsafe** |
| `--only X` | 仅 X，忽略依赖 | **unsafe** |

</v-click>

<v-click>

取值不止包名：`.`（当前项目）、`git:<branch>`（自某提交起改动，CI 只建变更）、`tag:<name>`。

</v-click>

<!--
unsafe 的含义：--only / --impacted-by 略过上游依赖，假定它们已就绪；若上游其实变了，你会基于过时的上游构建。

日常求稳用 --to / --from；--impacted-by 只在确信上游没动时用。
-->

---
transition: fade-out
---

# build cache：本地 + 云

比「输出保留」更进一步——把产物打成 tar 归档

<v-clicks>

- **输出保留**（无缓存）：输入未变则保留本地产物、跳过执行——产物没了就失效
- **缓存恢复**（启用缓存）：命中即从 tar 解压——切分支 / 新克隆 / 换机器都能恢复
- **缓存键四要素**：项目源哈希 + 依赖项目源哈希 + 所有 npm 依赖版本 + 命令行参数
- **`cacheProvider`**：`local-only` / `azure-blob-storage` / `amazon-s3`
- 官方举例：一次 30 分钟的构建 → 命中缓存 **30 秒**

</v-clicks>

<!--
典型云端配置：CI 系统写缓存，个体开发者只读——于是开发者拉下代码首次构建就能命中 CI 早已建好的缓存，"全新克隆也秒级构建"。

每个项目在 config/rush-project.json 声明要缓存哪些产物目录（operationSettings）。
-->

---
transition: fade-out
---

# 缓存写权限控制

读放开，写收紧到可信 CI——本页最易错

<v-clicks>

- **`rush build`**：既**读**又**写**缓存
- **`rush rebuild`**：默认**不写**（语义是「不信任缓存、干净重建」）
- **`RUSH_BUILD_CACHE_WRITE_ALLOWED`**（`0` / `1`）：覆盖当前操作能否写缓存
- CI 常置 `1`：用干净 rebuild 产物去**填充**云缓存，供后续命中
- 用意：写权限交给可信 CI，不放开给随手 rebuild 的开发者

</v-clicks>

<!--
默认策略下 rebuild 不写缓存，避免"一次可疑的重建污染缓存"；但受控的 CI 环境里，你恰恰希望用干净产物去填充云缓存——这时显式开这个开关。
-->

---
transition: fade-out
---

# change file 驱动的受控发布

改公共包必须写一条 change file，CI 强制门禁

<v-clicks>

- `rush change`：交互式为改动的公共包生成 change file，存 `common/changes/`
- 记录的是「**需要哪种递增 + 说明**」，版本号计算推迟到发布时统一做
- 五种 type：`major` / `minor` / `patch` / `none`（不发布**也要写**）/ `hotfix`（实验）
- **`rush change --verify`**（CI 门禁）：改了公共包却没写 → **直接失败**
- 变更检测靠 `git diff` 对比目标分支（默认 `main`）

</v-clicks>

<!--
最高频的坑：none 也要写。即使改动不该触发发布（只改 CI 配置），只要动了公共包目录，--verify 仍要求有一条 change file。

"没写 change file"和"写了 type: none"是两回事，前者会被 CI 拦下。
-->

---
transition: fade-out
---

# 发布两步走：version → publish

先算版本，再发包，中间可插一轮测试

**第 1 步 `rush version --bump`**：消费 change files、按策略递增版本 + 追加 CHANGELOG

<v-click>

| `rush publish` 调用 | 行为 |
| --- | --- |
| 裸跑 | **dry run**：只读检查，不落盘、不发 |
| `--apply` | 更新本地 `package.json` + changelog |
| `--publish` | 完整执行：真发 registry |

</v-click>

<!--
裸跑 rush publish 是 dry run，这一点务必记牢——它是安全默认值，让你先看清"将要发什么"再加 --publish 真发。

用 --pack --include-all 可产出 .tgz 包而非直发 registry。
-->

---
transition: fade-out
---

# 版本策略：lockstep vs individual

一起发选锁步，各发各的选独立

<div grid="~ cols-2 gap-4">
<div>

**lockStepVersion（锁步）**

- 一组包**共享版本、一起升**
- 字段 `version` / `nextBump` / `mainProject`
- 适合同产品的一组组件

</div>
<div>

**individualVersion（独立）**

- 各包按自己 change file **独立递增**
- 字段 `lockedMajor`（锁主版本）
- 适合独立演进的库

</div>
</div>

<v-click>

绑定：`rush.json` 用 `versionPolicyName` + `shouldPublish: true`。**`deploy` ≠ `publish`**——deploy 交付可运行 App，publish 发 npm 包。

</v-click>

<!--
一句话选型：一起发、版本要齐用 lockstep；各发各的、独立演进用 individual。

别把 deploy 和 publish 搞混：大仓里 App 用 deploy、库用 publish，同仓常并存。
-->

---
transition: fade-out
---

# 生态：三包分工 + Heft

写脚本用 rush-sdk，构建交给 Heft

<div grid="~ cols-2 gap-4">
<div>

**三包分工**

- **`@microsoft/rush`**：CLI 壳（`rush`/`rushx`）
- **`rush-lib`**：核心引擎
- **`rush-sdk`**：轻量代理，**写脚本首选**（自动对齐引擎版本）

</div>
<div>

**Rush 编排、Heft 构建**

- Rush 跨项目编排（安装/并行/发布）
- Heft 单项目内部构建（config-driven）
- Heft 经 scripts 调用；Rush **不绑定**它

</div>
</div>

<!--
写自定义脚本应依赖 rush-sdk 而非直接 rush-lib——前者自动对齐 rush.json 里锁定的引擎版本，脚本永远用与当前分支兼容的那个引擎。

Heft 是官方推荐搭配，但不强制，换任意构建工具都行。
-->

---
transition: fade-out
---

# 选型：Rush vs 同类

瓶颈决定选择

<v-click>

| 工具 | 本质定位 | 选它的信号 |
| --- | --- | --- |
| **Rush** | 大仓管理器 | 正确性 / 治理 / 受控发布 |
| **Nx** | monorepo 平台 | 平台能力 + 代码生成 |
| **Turborepo** | 任务编排 + 缓存 | 纯构建 / CI 速度 |
| **Lerna** | 老牌发版工具 | 只需协调多包发布 |

</v-click>

<v-click>

Rush 的差异化 = **依赖治理 + change file 受控发布 + 企业策略**，而非纯加速。

</v-click>

<!--
Nx/Turborepo 的核心叙事是"让重复的任务不再重复"；Rush 的核心叙事是"让几百人协作下的依赖与发布不出错、可追溯、可复现"。

补充：Lerna 2022 起由 Nx 团队接管，Turborepo 2021 被 Vercel 收购。
-->

---
layout: center
class: text-center
---

# 小结

**Rush = 企业级大 monorepo 的编排层，不是构建工具**

治理优先 · 推荐 pnpm 根治 phantom / doppelganger

`update` 改锁 / `install` 只读 · 内容哈希增量 + 并行 + build cache

change file → `--verify` → `version --bump` → `publish`

正确性选 Rush，速度选 Turborepo，平台选 Nx

<div class="abs-br m-6 text-xl">
  <a href="https://rushjs.io/" target="_blank" class="slidev-icon-btn">
    <carbon:link />
  </a>
  <a href="https://github.com/microsoft/rushstack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
一句话收束：Rush 面向"一个团队一个大仓、几百人协作"，用依赖治理、增量并行构建、change file 受控发布，把大仓的正确性和可控性做扎实。

它也用 build cache 加速，但加速从来不是它唯一的卖点。谢谢大家。
-->
