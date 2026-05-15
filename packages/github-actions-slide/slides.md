---
theme: seriph
background: https://cover.sli.dev
title: Welcome to GitHub Actions
info: |
  Presentation GitHub Actions for developers.

  Learn more at [https://docs.github.com/actions](https://docs.github.com/actions)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:github-actions class="text-7xl" />
</div>

<br/>

## GitHub Actions：仓库一体的 CI/CD

`.github/workflows/*.yml` + Marketplace Action，零运维起步

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 GitHub Actions —— GitHub 自家 CI/CD。

最大卖点：Marketplace + GitHub 仓库事件深度集成。
-->

---
transition: fade-out
---

# 什么是 GitHub Actions？

GitHub 自家 CI/CD 系统，2019 GA，与仓库 / Issue / PR / Pages 深度一体

<v-click>

- **零运维起步**：开源仓永久免费、私有库 2000 分钟/月免费
- **Marketplace 15000+ Actions**：云厂商 / Docker / SAST / 部署工具基本都有
- **OIDC 联邦认证**：替代长期密钥，AWS / Azure / GCP / Vault 全支持
- **触发器丰富**：push / PR / schedule / workflow_dispatch / repository_dispatch / workflow_call ...
- **跟 GitHub 一切联动**：PR check / Code Scanning / Pages / Releases / Codespaces
- **复用机制双轨**：Composite Action（step 级）+ Reusable Workflow（workflow 级）

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_GitHub Actions_](https://docs.github.com/actions)

</div>

<style>
h1 {
  background-color: #2088FF;
  background-image: linear-gradient(45deg, #2088FF 10%, #6F42C1 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---
transition: slide-up
---

# Workflow / Job / Step 三层

```
Workflow (.yml 文件)
└── Job (jobs.<id>)            ← 一个 job 一台 Runner
    └── Step (steps[])         ← 顺序执行
        ├── uses: 调用 Action
        └── run: 跑 shell
```

<v-clicks>

- **Workflow**：一个 yml = 一条工作流；一个仓库可以有多个
- **Job**：在独立 Runner 上跑；**默认全部并行**（不像 GitLab 默认串行）
- **Step**：job 内顺序执行；要么 `uses:` 复用，要么 `run:` 跑 shell（互斥）
- 写 `needs:` 才让 jobs 之间串行

</v-clicks>

---
transition: slide-up
---

# 第一份 workflow

```yaml {all|1|3-7|9-12|14-22}
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
```

---
transition: slide-up
---

# 触发器（on）：最常用四种

```yaml
on:
  # 1. push / PR：CI 主入口
  push:
    branches: [main, 'release/*']
    paths: ['apps/web/**']         # monorepo 必备过滤
    tags: ['v*']
  pull_request:
    types: [opened, synchronize, reopened]

  # 2. 定时（UTC！）
  schedule:
    - cron: '0 4 * * 1-5'

  # 3. 手动 + 参数
  workflow_dispatch:
    inputs:
      env:
        type: choice
        options: [staging, production]

  # 4. 被其它 workflow 调
  workflow_call:
```

---
transition: slide-up
---

# uses vs run：step 必择其一

```yaml
# ✅ uses：复用 Marketplace Action
- uses: actions/checkout@v4

# ✅ uses + with：传参
- uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'pnpm'

# ✅ run：跑 shell（多行用 |）
- run: |
    pnpm install
    pnpm test
  shell: bash
  working-directory: ./apps/web

# ❌ 同一 step 不能同时 uses + run
```

<v-click>

90% 的 step 应该是 `uses:`——别人写好的轮子。

</v-click>

---
transition: slide-up
---

# Marketplace 常用 Action

| Action                          | 用途                                  |
| ------------------------------- | ------------------------------------- |
| `actions/checkout@v4`           | 拉代码（每个 workflow 第一步）        |
| `actions/setup-node@v4`         | 装 Node + 内置 cache                  |
| `actions/cache@v4`              | 自定义 cache                          |
| `actions/upload-artifact@v4`    | 上传 / 下载产物                       |
| `docker/build-push-action@v6`   | 构建 + push 镜像（含 BuildKit）       |
| `aws-actions/configure-aws-credentials@v6` | AWS OIDC                   |

<v-click>

**安全**：生产锁 commit SHA 而非 `@v4` 浮动 tag，配 Dependabot 自动升级。

</v-click>

---
transition: slide-up
---

# cache：lockfile-based key

setup-X Action 自带 cache，最省事：

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'pnpm'                       # 自动按 pnpm-lock.yaml hash 缓存
```

自定义场景用 actions/cache：

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.local/share/pnpm/store
    key: ${{ runner.os }}-pnpm-${{ hashFiles('pnpm-lock.yaml') }}
    restore-keys: ${{ runner.os }}-pnpm-     # 精确 hash 没命中时按前缀回退
```

<v-click>

**反模式**：`key: ${{ github.sha }}` 每次 commit 都换 key，等于禁用 cache。

</v-click>

---
transition: slide-up
---

# artifacts：跨 job 传文件

```yaml
# 上游：上传
- uses: actions/upload-artifact@v4
  with:
    name: build-output            # ❗ v4 起同名会冲突
    path: dist/
    retention-days: 7             # 默认 90，调短省空间

# 下游：下载
- uses: actions/download-artifact@v4
  with:
    name: build-output
    path: ./artifacts
```

<v-click>

**vs cache**：artifacts 是跨 job 的"产物"（可下载、可显示在 UI）；cache 是为加速重复 install 的"中间体"。

</v-click>

---
transition: slide-up
---

# matrix：多维度并行

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest]
        node: ['18', '20', '22']
        include:
          - os: ubuntu-latest
            experimental: true     # 给特定组合加额外变量
        exclude:
          - os: macos-latest
            node: '18'
      fail-fast: false             # 一败不俱败
      max-parallel: 4              # 限并发省 minutes
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with: { node-version: '${{ matrix.node }}' }
```

---
transition: slide-up
---

# needs + outputs：跨 job 传值

```yaml
jobs:
  build:
    outputs:                              # 1. job 级输出
      version: ${{ steps.meta.outputs.version }}
    runs-on: ubuntu-latest
    steps:
      - id: meta                          # 2. step 必须有 id
        run: echo "version=1.2.3" >> $GITHUB_OUTPUT

  deploy:
    needs: build                          # 3. 声明依赖
    runs-on: ubuntu-latest
    steps:
      - run: |
          # 4. needs.<job>.outputs.<name>
          echo "Deploying ${{ needs.build.outputs.version }}"
```

<v-click>

`echo "key=value" >> $GITHUB_OUTPUT` 是新写法；旧的 `::set-output::` 已弃用。

</v-click>

---
transition: slide-up
---

# 表达式与 contexts

```yaml
# 条件
if: github.ref == 'refs/heads/main'
if: success() && contains(github.event.head_commit.message, 'deploy')

# 字符串拼接 / 取值
tags: ghcr.io/${{ github.repository }}:${{ github.sha }}

# 三元（用 && + ||）
env: ${{ github.event_name == 'pull_request' && 'staging' || 'production' }}

# JSON / hash
matrix: ${{ fromJSON(needs.gen.outputs.matrix) }}
key: pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
```

<v-click>

Context：`github / env / vars / secrets / inputs / needs / steps / job / runner / strategy / matrix`。

</v-click>

---
transition: slide-up
---

# if + 内置函数

```yaml
steps:
  - run: pnpm test
    # success() 是默认，可省略

  - run: ./cleanup.sh
    if: always()                          # 不论上面成败都跑

  - run: ./alert.sh
    if: failure() && github.ref == 'refs/heads/main'

  - run: pnpm test:e2e
    if: matrix.os == 'ubuntu-latest'

  - run: ./run-on-mac.sh
    if: runner.os == 'macOS'
```

<v-click>

四个状态函数：`success()`（默认）/ `failure()` / `always()` / `cancelled()`。

</v-click>

---
transition: slide-up
---

# environment：审批 + env-scoped secrets

```yaml
jobs:
  deploy_prod:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://app.example.com        # 显示在 deployments 页 + commit 状态
    steps:
      - run: ./deploy.sh
```

<v-clicks>

- **审批门控**：仓库 Settings → Environments 配 required reviewers
- **Env-scoped secrets**：在 environment 维度配 secrets，仅该 env 的 job 可读
- **部署历史**：Deployments 页可见 + 一键回滚
- **Wait timer / Branch protection**：等几分钟才跑 / 限分支

</v-clicks>

---
transition: slide-up
---

# permissions：GITHUB_TOKEN 默认 read-only

2023+ 新仓库默认最小权限，写操作需显式声明：

```yaml
permissions:                              # workflow 级
  contents: read                          # 读代码
  packages: write                         # push 到 GHCR
  id-token: write                         # OIDC 必备
  pull-requests: write                    # 评论 PR / 加 label

jobs:
  deploy:
    permissions:                          # job 级覆盖（可缩小不可扩大）
      contents: read
      id-token: write
```

<v-click>

简写：`permissions: read-all` / `write-all`（不建议）/ `{}`（全部 none）。

</v-click>

---
transition: slide-up
---

# concurrency：自动排队 / 取消

```yaml
# 1. PR 频繁 push：取消旧的，省 minutes
concurrency:
  group: ${{ github.workflow }}-${{ github.head_ref || github.ref }}
  cancel-in-progress: true

# 2. 部署队列：排队等，永不取消
concurrency:
  group: deploy-prod
  cancel-in-progress: false
```

<v-click>

部署 workflow 一定要 `cancel-in-progress: false`——半路取消会留下烂状态。

</v-click>

---
transition: slide-up
---

# Composite Action vs Reusable Workflow

|             | Composite Action          | Reusable Workflow             |
| ----------- | ------------------------- | ----------------------------- |
| 粒度        | step 级（多 step 包成 1）   | 整个 workflow（多 job）        |
| 调用位置    | `uses:` 在 steps 里         | `uses:` 在 jobs 里             |
| 触发器      | -                          | `on: workflow_call`            |
| 嵌套深度    | 高                         | 9 层                           |

```yaml
- uses: ./.github/actions/setup-pnpm     # Composite（step 级）
  with: { node-version: '22' }

deploy:                                   # Reusable Workflow（job 级）
  uses: ./.github/workflows/deploy.yml
  secrets: inherit
```

---
transition: slide-up
---

# OIDC：替代长期密钥

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write                     # 必备
      contents: read
    steps:
      - uses: aws-actions/configure-aws-credentials@v6
        with:
          role-to-assume: arn:aws:iam::123:role/github-actions-prod
          aws-region: ap-southeast-1
          # 不需要 access key / secret access key！
      - run: aws s3 sync dist/ s3://my-bucket/
```

<v-click>

AWS IAM Trust Policy 的 `sub` 字段可限制：repo / branch / environment / event_name。短期 token（1 小时）+ 精细授权，远比长期密钥安全。

</v-click>

---
transition: slide-up
---

# vs GitLab CI/CD / Jenkins

| 维度        | GitHub Actions             | GitLab CI/CD              | Jenkins             |
| ----------- | -------------------------- | ------------------------- | ------------------- |
| 默认 job    | **全并行**                  | stages 串行                | stages 串行         |
| 复用        | Composite + Reusable WF    | extends + include         | Shared Library      |
| 触发        | `on:` 极丰富                | `rules:` + workflow       | webhook + 插件      |
| Marketplace | **15000+ Actions**          | Components（新）          | 1800+ 插件          |
| OIDC        | 一类公民                   | 支持                       | 第三方              |
| 学习曲线    | 低                         | 中                         | 高                  |

<v-click>

**简单原则**：代码在哪选谁。GitHub 仓 → GHA；自家 GitLab → GitLab CI/CD；有强 Jenkins 投入 → 沿用。

</v-click>

---
layout: center
class: text-center
---

# 总结

适合：GitHub 仓 / 个人项目 / 中小团队 / 不想运维 CI server

不需要：代码不在 GitHub / 已有成熟 Jenkins / 强自托管诉求

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://docs.github.com/actions" target="_blank">docs.github.com/actions</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/marketplace?type=actions" target="_blank">github.com/marketplace</a>
</div>
