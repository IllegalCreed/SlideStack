---
theme: seriph
background: https://cover.sli.dev
title: Welcome to GitLab CI/CD
info: |
  Presentation GitLab CI/CD for developers and platform engineers.

  Learn more at [https://docs.gitlab.com/ci/](https://docs.gitlab.com/ci/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:gitlab class="text-7xl" />
</div>

<br/>

## GitLab CI/CD：与仓库共生的流水线

`.gitlab-ci.yml` + Runner，配置即代码、自托管即可用

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 GitLab CI/CD。

跟 Jenkins 比少了独立 server 的运维；跟 GitHub Actions 比胜在私有部署 + 内网。
-->

---
transition: fade-out
---

# 什么是 GitLab CI/CD？

GitLab 自带的流水线系统，与仓库 / Issue / Registry 一体化

<v-click>

- **配置即代码**：`.gitlab-ci.yml` 进仓库根目录，与代码共版本控制
- **Runner 灵活**：shell / docker / kubernetes 等 executor 任选，私有 / 内网 / 离线都能跑
- **MR 流程闭环**：MR 触发 pipeline → 自动测试 → 部署预览 → 合并前必过
- **Auto DevOps**：检测项目类型自动生成构建 / 测试 / 部署模板
- **Container Registry 内置**：`$CI_REGISTRY_*` 零配置 push 镜像
- **Environments**：声明部署目标，跟踪历史，一键回滚

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_GitLab CI/CD_](https://docs.gitlab.com/ci/)

</div>

<style>
h1 {
  background-color: #FC6D26;
  background-image: linear-gradient(45deg, #FC6D26 10%, #E24329 90%);
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

# .gitlab-ci.yml 最小骨架

```yaml {all|1-4|6-8|10-12|14-16}
stages:
  - install
  - test
  - build

variables:
  NODE_VERSION: "22"

default:
  image: node:22-alpine
  cache:
    paths: [node_modules/]

install:
  stage: install
  script: pnpm install --frozen-lockfile
```

<v-click>

push 即触发——`stages` 决定阶段顺序，`default` 是 pipeline 级默认。

</v-click>

---
transition: slide-up
---

# Pipeline / Stage / Job 三层

```
Pipeline ──┬── Stage: install ── Job: install
           ├── Stage: test    ──┬── Job: lint        ┐
           │                    ├── Job: type-check  ├─ 并行
           │                    └── Job: test:unit   ┘
           └── Stage: build   ── Job: build
```

<v-clicks>

- **Pipeline**：一次完整运行
- **Stage**：阶段；同 stage 内 jobs 并行，下一 stage 等本 stage 全过
- **Job**：实际跑命令的单元，每个 job 独立 Runner / Executor
- 不写 `stages` 默认 `[build, test, deploy]`；job 不写 `stage` 默认落 `test`

</v-clicks>

---
transition: slide-up
---

# script / before_script / after_script

```yaml
test:
  before_script:               # 1. 先跑（默认共 shell，可被 job 覆盖）
    - pnpm install
  script:                      # 2. 主体；**失败导致 job 失败**
    - pnpm test:unit
  after_script:                # 3. 后跑；**独立 shell，独立 5min timeout**
    - echo "Job ${CI_JOB_STATUS}"
    - rm -rf /tmp/cache        # 不影响 job 状态
```

<v-click>

`script` 是唯一必填字段，省略会报"jobs:xxx config should contain at least one script step"。

</v-click>

---
transition: slide-up
---

# artifacts vs cache

|             | **artifacts**             | **cache**                  |
| ----------- | ------------------------- | -------------------------- |
| 目的        | 跨 job / 下载的成品       | 加速重复构建的中间体       |
| 存储        | GitLab 服务端             | Runner 本地 / 对象存储     |
| 跨 pipeline | ❌                        | ✅（按 key 复用）          |
| 失败时上传  | ✅ `when: always`         | ❌                         |
| 适合        | dist / coverage / xml     | node_modules / .pnpm-store |

```yaml
build:
  artifacts:
    paths: [dist/]
    expire_in: 1 week
  cache:
    key: { files: [pnpm-lock.yaml] }
    paths: [.pnpm-store/]
```

---
transition: slide-up
---

# variables：四种属性

<v-clicks>

**普通**：UI 配 / yml 写，job 里 `$VAR` 拿到

**Protected**：只在 protected branch / tag 跑的 pipeline 可见，部署密钥首选

**Masked**：日志里显示 `[MASKED]`，但 base64 / 截取后**还是会泄露**

**File 类型**：值变成临时文件路径，给 `kubectl --kubeconfig=$KUBECONFIG_FILE` 这类工具用

</v-clicks>

<v-click>

```yaml
deploy:
  before_script:
    - export KUBECONFIG=$KUBECONFIG_FILE  # File 类型变量
  script:
    - kubectl set image deployment/x x=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

</v-click>

---
transition: slide-up
---

# rules：替代 only / except

```yaml
deploy:
  rules:
    - if: $CI_COMMIT_TAG                              # 1. tag 推送：跑
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH     # 2. 主干推送：跑
    - if: $CI_PIPELINE_SOURCE == "merge_request_event" # 3. MR：手动
      when: manual
      allow_failure: true
    - when: never                                      # 4. 兜底：不跑
  script: ./deploy.sh
```

<v-click>

**规则顺序匹配**：第一个命中的决定 job 是否创建及其属性。GitLab 13.5+ 官方推荐 `rules`，新项目别再用 `only/except`。

</v-click>

---
transition: slide-up
---

# when / allow_failure / retry

```yaml
deploy_prod:
  when: manual                       # 手动触发
  allow_failure: false               # manual 默认 true，这里强制阻塞

flaky_e2e:
  script: pnpm test:e2e
  allow_failure: true                # 失败标黄但不挂 pipeline

flaky_test:
  retry:
    max: 2                           # 最多重试 2 次
    when:
      - runner_system_failure        # Runner 自己挂
      - stuck_or_timeout_failure     # 卡住超时
      - api_failure                  # GitLab API 故障
```

<v-click>

`when` 五种：`on_success`（默认）/ `on_failure` / `always` / `manual` / `delayed`（配 `start_in:`）。

</v-click>

---
transition: slide-up
---

# needs：打破 stage 串行的 DAG

```yaml
stages: [install, test, build]

install: { script: pnpm install }
lint:    { needs: [install], script: pnpm lint }
type:    { needs: [install], script: pnpm type-check }
unit:    { needs: [install], script: pnpm test:unit }
build:
  needs:
    - install
    - job: unit
      artifacts: true                       # 默认 true，写出来显式
  script: pnpm build
```

<v-click>

**收益**：直接砍掉 30~60% pipeline 时长。lint / type / unit 一旦 install 完就并行开跑；build 只等 unit 不等 lint。

</v-click>

---
transition: slide-up
---

# extends + include：配置复用

```yaml
# 模板（. 开头 = 不跑，仅供继承）
.node-base:
  image: node:22-alpine
  before_script:
    - corepack enable
    - pnpm install --frozen-lockfile
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths: [node_modules/]

# 引用模板
test:
  extends: .node-base
  script: pnpm test

# 跨项目 / 拆 yml
include:
  - local: '.gitlab/ci/frontend.yml'
  - project: 'platform/ci-templates'
    file: '/templates/node.yml'
    ref: 'main'
```

---
transition: slide-up
---

# environment：让 GitLab 看见部署

```yaml
deploy_staging:
  script: ./deploy.sh staging
  environment:
    name: staging
    url: https://staging.example.com
    deployment_tier: staging

# Review App：每个 MR 一份独立环境
review:
  script: ./deploy-review.sh
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    url: https://$CI_COMMIT_REF_SLUG.review.example.com
    on_stop: stop_review
    auto_stop_in: 1 week
```

<v-click>

UI → Operate → Environments 看部署历史 + 一键回滚；MR 上直接显示预览 URL。

</v-click>

---
transition: slide-up
---

# Runner 三种范围

| 类型     | 范围                    | 谁能用                  | 适合                     |
| -------- | ----------------------- | ----------------------- | ------------------------ |
| Instance | 整个 GitLab 实例所有项目 | 所有项目（管理员配置）   | 共享构建池               |
| Group    | 某 Group 下所有项目     | Group 内项目自动可见     | 团队 / 部门级专属        |
| Project  | 单个项目                | 仅当前项目              | 专用机器 / 特殊硬件需求  |

<v-click>

GitLab.com 提供 instance shared runner（免费 400 分钟/月）；自建实例需要自己装。

</v-click>

---
transition: slide-up
---

# Runner Executor 选型

| Executor       | 优点                        | 缺点                       | 适合                       |
| -------------- | --------------------------- | -------------------------- | -------------------------- |
| shell          | 最简单，本机直接跑          | 各 job 不隔离，依赖污染严重 | 试用 / 单项目独占机器       |
| **docker**     | 每 job 独立容器             | 需要 Docker daemon         | **生产首选**                |
| docker-machine | 自动云端扩缩容              | 配置复杂，2025 起淡出      | 旧自动扩容方案             |
| **kubernetes** | 弹性 + 多租户隔离           | 需会 K8s + 启动稍慢        | **大规模生产首选**          |
| ssh            | 临时连远端跑命令            | 共享主机，隔离差           | 部署 job 临时跨机           |

---
transition: slide-up
---

# 安装 Runner + register

```bash
# 1. Docker 起 Runner 容器
docker run -d --name gitlab-runner --restart always \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  gitlab/gitlab-runner:v17.5.0

# 2. GitLab UI → Settings → CI/CD → Runners → New runner 拿 token (glrt-)

# 3. 注册（auth token 模式，GitLab 17+ 标准）
docker exec -it gitlab-runner gitlab-runner register \
  --non-interactive \
  --url "https://gitlab.com/" \
  --token "glrt-xxxxxxxxxxxxxxxx" \
  --executor "docker" \
  --docker-image "alpine:latest" \
  --description "company-docker-runner"
```

<v-click>

`--registration-token`（旧）已弃用，新装一律 `--token glrt-...`。GitLab 20.0 会移除旧方式。

</v-click>

---
transition: slide-up
---

# Docker 构建：四种姿势

| 方式            | 安全 | 速度 | 备注                              |
| --------------- | ---- | ---- | --------------------------------- |
| **DinD**        | ⚠️    | 快   | 需 privileged，常见但有安全风险   |
| **kaniko**      | ✅   | 中   | **生产推荐**，无 daemon / 无 privileged |
| buildah         | ✅   | 中   | Red Hat 生态                      |
| socket binding  | ❌   | 最快 | 共享 host docker.sock，最不安全   |

```yaml
build_image:
  image:
    name: gcr.io/kaniko-project/executor:debug
    entrypoint: [""]
  script:
    - /kaniko/executor
        --context "$CI_PROJECT_DIR"
        --destination "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
        --cache=true
```

---
transition: slide-up
---

# 部署到 Kubernetes

```yaml
deploy_k8s:
  image: bitnami/kubectl:1.30
  before_script:
    - export KUBECONFIG=$KUBECONFIG_FILE       # File 类型变量
  script:
    - kubectl set image deployment/my-app
        my-app="$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
        -n production
    - kubectl rollout status deployment/my-app -n production --timeout=5m
  environment:
    name: production
    url: https://app.example.com
```

<v-click>

`KUBECONFIG_FILE` 是 **File 类型变量**：UI 上填整个 kubeconfig YAML，job 里 `$KUBECONFIG_FILE` 展开为临时文件路径。

</v-click>

---
transition: slide-up
---

# vs Jenkins / GitHub Actions

| 维度    | GitLab CI/CD          | Jenkins             | GitHub Actions     |
| ------- | --------------------- | ------------------- | ------------------ |
| 部署    | 与 GitLab 共生        | 独立服务器          | SaaS 为主          |
| 配置    | YAML                  | Jenkinsfile/Groovy  | YAML               |
| 触发    | 与仓库原生融合        | 需配 webhook + 插件 | 与 GitHub 原生融合 |
| 复用    | extends + include     | Shared Library      | Composite/Reusable |
| 学习曲线 | 中                    | 高                  | 低                 |
| 何时选  | 自家 GitLab / 私有部署 | 老项目 / 强插件     | GitHub 仓 / 中小项目 |

<v-click>

**简单原则**：代码在哪个平台就用谁的 CI；只有自托管诉求时才特意挑 GitLab/Jenkins。

</v-click>

---
transition: slide-up
---

# 常见陷阱

<v-clicks>

- **双流水线**：push + MR 同时触发跑两份；用 `workflow.rules` 去重
- **tag pipeline 没跑**：`if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH` 在 tag 时不命中；要显式加 `if: $CI_COMMIT_TAG`
- **before_script 被覆盖**：job 写了自己的 `before_script` 完全替换 default
- **cache key 选错**：用 `${CI_PIPELINE_ID}` 等于禁用缓存；正解用 `files: [pnpm-lock.yaml]`
- **Runner 磁盘爆**：docker executor 镜像 / volume 不清理；cron 跑 `docker system prune -af`
- **tags 没匹配**：job 一直 pending，UI 没明显报错
- **DinD privileged 暴露 host**：fork PR 攻击面，生产优先 kaniko

</v-clicks>

---
layout: center
class: text-center
---

# 总结

适合：自托管 GitLab / 代码在自家 GitLab / 需要 CI + Registry + Issue 全栈一体

不需要：代码在 GitHub → 优先 Actions；老 Jenkins 不重写 → 沿用 Jenkins

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://docs.gitlab.com/ci/" target="_blank">docs.gitlab.com/ci</a>
</div>

<div class="mt-4">
  <carbon:logo-gitlab /> <a href="https://gitlab.com/gitlab-org/gitlab-runner" target="_blank">gitlab-org/gitlab-runner</a>
</div>
