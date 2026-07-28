---
theme: seriph
background: https://cover.sli.dev
title: DVC 完全指南
info: |
  DVC 完全指南：数据版本控制 · dvc.yaml 流水线 · dvc.repro 增量复现 · dvc exp 实验

  Learn more at [https://dvc.org/doc](https://dvc.org/doc)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## DVC

Git for data · 数据/模型版本控制与可复现流水线 · 3.67.1

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
DVC 是构建在 Git 之上的数据/模型版本控制工具。
-->

---
transition: fade-out
---

# DVC 是什么

开源（Apache 2.0）的「Git for data」——Git 的扩展

- **Git 原生**：命令与 Git 同构（init/add/push/pull/checkout/diff）
- **数据与代码版本统一**：Git 跟踪 `.dvc` 元数据，大文件进缓存
- **远程存储解耦**：S3/GCS/Azure/SSH/HDFS/本地/HTTP，不锁厂商
- **流水线可复现且增量**：`dvc.yaml` + `dvc.repro` 依赖驱动，类似 Makefile
- **指标/参数/图表一等公民**：`dvc metrics/params/plots` 内建实验对比

> 稳定版 **3.67.1**（2026-03-31）

<!--
DVC 本身不是版本控制系统，而是 Git 的扩展。
-->

---

# 核心机制：Git + 缓存

代码进 Git，大文件进 DVC 缓存，二者通过元数据绑定

- **`.dvc` 文件**：占位元数据（含 md5 + 路径），进 Git 跟踪
- **`dvc.lock`**：流水线锁文件（每 stage 的 deps/outs 哈希），进 Git
- **`dvc.yaml`**：流水线定义，进 Git
- **`.dvc/cache`**：内容寻址缓存（按 MD5 哈希），大文件实际存储
- **工作区链接**：reflink / hardlink / symlink / copy（按系统支持回退）

> 原始大文件被自动加入 `.gitignore`，团队 `git clone` + `dvc pull` 还原

<!--
Git 管元数据，DVC 管大文件，通过哈希绑定。
-->

---
layout: two-cols
---

# 数据版本：add / push / pull

```bash
git init                       # ① 必须先有 Git
dvc init                       # ② 初始化 DVC
git commit -m "init dvc"

dvc add data/raw.csv           # 数据移入缓存
git add data/raw.csv.dvc .gitignore
git commit -m "track raw"

# 配远程并上传
dvc remote add -d myremote \
  s3://my-bucket/dvc-store
dvc push

# 团队还原
git clone <repo> && dvc pull
```

::right::

# 切换版本

```bash
# 先切 Git（.dvc 文件版本）
git checkout HEAD~1 \
  -- data/raw.csv.dvc
# 再同步数据到工作区
dvc checkout
```

**顺序铁律**：先 `git checkout` 切 `.dvc`，再 `dvc checkout` 同步数据——反了会基于错误的 `.dvc` 同步。

> `dvc pull` = `dvc fetch` + `dvc checkout`

<!--
顺序错乱是最常见的坑。
-->

---

# 远程存储后端

配置存在 `.dvc/config`，进 Git（凭证用环境变量单独管理）

```bash
dvc remote add -d storage s3://my-bucket/dvc
dvc remote modify storage endpointurl https://s3.example.com
# 凭证用环境变量，别写进 config
```

**后端前缀**：S3 `s3://` · GCS `gcs://` · Azure `azure://` · SSH `ssh://` · HDFS `hdfs://` · 本地 `/local/path`

> 不锁厂商，自托管成本低

<!--
远程存储后端多样，解耦云厂商。
-->

---

# 流水线：dvc.yaml

声明数据如何被加工成模型

```yaml
stages:
  prepare:
    cmd: python src/prepare.py data/raw.csv data/prepared
    deps: [src/prepare.py, data/raw.csv]
    outs: [data/prepared]
  train:
    cmd: python src/train.py data/prepared model.pkl
    deps: [src/train.py, data/prepared]
    outs: [model.pkl]
    metrics:
      - metrics.json: {cache: false}
    params:
      - train.epochs
      - train.lr
```

> `stages` 含 `deps`（依赖）/ `outs`（产物）/ `cmd`（命令）/ `params` / `metrics`

<!--
dvc.yaml 是声明式流水线定义。
-->

---
layout: two-cols
---

# dvc.repro：增量复现

```bash
dvc repro            # 只重跑 deps 变了的 stage
dvc repro train      # 只跑到 train
dvc dag              # 可视化依赖图
dvc status           # 看哪些需重跑
```

**判定逻辑**：比对当前 deps 实际哈希与 `dvc.lock` 记录——一致则复用缓存 outs，不一致才重跑该 stage 及下游。

::right::

# stage 字段速查

| 字段 | 作用 | 进缓存 |
|------|------|------|
| `deps` | 依赖 | 被跟踪 |
| `outs` | 产物 | ✅ |
| `cmd` | 命令 | — |
| `params` / `metrics` | 参数 / 指标 | Git / 默认否 |
| `frozen` | 跳过此 stage | — |

> 对稳定的耗时 stage 设 `frozen: true`，省算力

<!--
repro 是依赖驱动的增量复现，类似 Makefile。
-->

---

# 参数、指标与图表

`metrics`/`params`/`plots` 是流水线的一等公民

```bash
dvc params show          # 列出所有参数
dvc params diff          # 对比参数变化

dvc metrics show         # 显示指标当前值
dvc metrics diff         # 对比指标变化

dvc plots show           # 生成图表（默认 HTML）
dvc plots diff           # 对比多实验图表
```

- **params**：`params.yaml`（被 dvc.yaml 引用）
- **metrics**：JSON/YAML/CSV/TSV
- **plots**：CSV/JSON/YAML/图像

> `show`/`diff` 直接对比，无需额外平台

<!--
指标/参数/图表内建到 Git 工作流。
-->

---

# 实验：dvc exp

把实验管理内建到 Git——临时栈，不污染主分支

```bash
dvc exp run -S train.lr=0.01      # 改参数跑实验
dvc exp show                      # 列出实验及指标
dvc exp diff exp-abc exp-def      # 对比实验
dvc exp apply exp-abc             # 应用到工作区
dvc exp branch exp-abc exp-lr001  # 固化为 Git 分支
dvc exp push origin exp-abc       # 推送共享
```

实验栈存储在 `.dvc/exps/`（Git ref `refs/exps/`），可对比、可 apply、可固化为分支、可 push/pull 共享。

> 适合超参搜索 / 多种子实验，不进主分支但可追溯

<!--
dvc exp 是 Git 原生的实验管理。
-->

---

# 缓存维护与数据共享

```bash
dvc gc -w                         # 清理未被工作区引用的缓存
dvc gc --all-branches --all-tags  # 保留所有分支/tag 用到的
dvc push / dvc fetch              # 上传 / 仅下载不 checkout
```

**跨仓库数据依赖**：

```bash
dvc import https://github.com/org/repo data/external  # 保持依赖
dvc import-url s3://my-bucket/data.csv data/imported.csv  # 一次性拉取
```

`import` 建立跨仓库依赖，`dvc update` 可拉上游变化；`import-url` 适合一次性外部数据。

> 长期项目定期 `dvc gc` 释放孤立缓存空间

<!--
缓存维护 + 数据导入是进阶能力。
-->

---

# 陷阱与最佳实践

- **顺序错乱**：必须 `git pull` 先（拉 `.dvc` 版本）→ 再 `dvc pull`（同步数据）
- **忘 commit `.dvc`/`dvc.lock`**：队友找不到正确版本；改完即 `git add *.dvc dvc.lock`
- **大文件直接进 Git**：`.gitignore` 没配好导致仓库膨胀；`dvc add` 会自动加
- **repro 跑全量**：忘了 `frozen: true` 冻结耗时 stage，每次 repro 都重跑
- **缓存冲突**：`.dvc` 冲突需手动解决后 `dvc checkout`；多人改同数据用分支隔离
- **远程凭证泄露**：`.dvc/config` 别直接提交 access key，用环境变量或 Vault

<!--
关键是 Git/DVC 操作顺序 + commit 纪律。
-->

---
layout: quote
---

# DVC 精髓

「代码进 Git，大文件进缓存，`dvc.repro` 增量复现——Git 原生的工作流，数据团队无需学新东西。」

---

# DVC vs MLflow：互补

| 维度 | DVC | MLflow |
|------|------|------|
| **数据/模型版本** | ✅ 内容寻址缓存 | 部分（artifact） |
| **流水线复现** | ✅ dvc.yaml/repro | 弱（Projects 摇摆） |
| **实验运行追踪** | 弱（dvc exp） | ✅ Tracking/autolog |
| **模型注册/审批** | ✗ | ✅ Model Registry |
| **部署** | ✗ | ✅ flavor/Deployments |

> 典型组合：DVC 管数据/流水线版本，MLflow 管运行追踪与模型注册

<!--
DVC 与 MLflow 互补，常组合使用。
-->

---
layout: center
class: text-center
---

# 小结

DVC = Git 扩展 + 缓存 + 流水线

**数据版本 · dvc.repro · 增量复现 · Git 原生**

[DVC 文档](https://dvc.org/doc) · [GitHub](https://github.com/iterative/dvc) · [Get Started](https://doc.dvc.org/start)

<!--
DVC 是数据团队的 Git。
-->
