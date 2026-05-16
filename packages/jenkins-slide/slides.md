---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Jenkins
info: |
  Presentation Jenkins for developers and platform engineers.

  Learn more at [https://www.jenkins.io/doc/](https://www.jenkins.io/doc/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <logos:jenkins class="text-7xl" />
</div>

<br/>

## Jenkins：CI/CD 元老级开源服务器

Jenkinsfile + Master-Agent，把"构建 / 测试 / 部署"写成代码

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Jenkins —— CI/CD 元老级开源服务器。

它不像 GitHub Actions 那样开箱即用，但插件深、能自托管，老牌企业里几乎家家都有。
-->

---
transition: fade-out
---

# 什么是 Jenkins？

把 CI/CD 流程"写成 Jenkinsfile"再放进版本控制的开源服务器

<v-click>

- **元老开源**：2011 年从 Hudson 分叉，至今 LTS 持续更新
- **1800+ 插件**：K8s / Docker / Slack / Sonar / 任意私有协议都能接
- **自托管彻底**：内网离线也能跑，凭据 / 产物 / 日志全在自己机器
- **Master-Agent**：controller 调度，agent 跑构建，按 label 调度
- **Pipeline as Code**：Jenkinsfile 随仓库版本管理，PR 评审到 CI 行为
- **Multibranch**：每个分支自己的 Jenkinsfile，PR / Tag 自动发现

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_Jenkins_](https://www.jenkins.io/doc/)

</div>

<style>
h1 {
  background-color: #335061;
  background-image: linear-gradient(45deg, #335061 10%, #D33833 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---
transition: slide-up
level: 2
---

# 两种 Pipeline 范式

声明式是 2.5+ 主推，新项目默认选它

<v-clicks>

**声明式（Declarative）—— 推荐**
```groovy
pipeline {
  agent any
  stages {
    stage('Build') { steps { sh 'pnpm build' } }
  }
}
```
结构化、可读、易工具化校验

**脚本式（Scripted）—— Groovy 原生**
```groovy
node {
  stage('Build') { sh 'pnpm build' }
}
```
更灵活，但易写出难维护代码，官方逐步以声明式替代

</v-clicks>

<v-click>

声明式里需要复杂逻辑可临时 `script { ... }` 嵌入脚本式。

</v-click>

---
transition: slide-up
---

# Jenkinsfile 最小骨架

```groovy {all|1|2|3-9|11-13}
pipeline {
  agent any
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Install')  { steps { sh 'pnpm install' } }
    stage('Test')     { steps { sh 'pnpm test' } }
    stage('Build')    { steps { sh 'pnpm build' } }
  }

  post {
    success { echo '✅' }
    failure { echo '❌' }
  }
}
```

<v-click>

`pipeline / agent / stages / steps` 四件必备；`post` 选填但几乎总要。

</v-click>

---
transition: slide-up
---

# agent：在哪里执行

```groovy
agent any                          // 任意空闲节点
agent none                         // 不分配，让每个 stage 自己声明
agent { label 'linux-build' }      // 按标签匹配（生产推荐）

agent {                            // Docker 容器
  docker { image 'node:22-alpine' }
}

agent {                            // Kubernetes Pod
  kubernetes {
    yaml '''
      kind: Pod
      spec:
        containers:
          - { name: jnlp, image: node:22 }
    '''
  }
}
```

<v-click>

`agent none` + 每 stage 单独 agent 适合"不同阶段不同环境"，省 master 资源。

</v-click>

---
transition: slide-up
---

# parallel + when：并发与条件

```groovy
stage('Quality') {
  failFast true                                  // 任一失败立刻终止其它
  parallel {
    stage('Lint')  { steps { sh 'pnpm lint' } }
    stage('Type')  { steps { sh 'pnpm type-check' } }
    stage('Test')  { steps { sh 'pnpm test' } }
  }
}

stage('Deploy Prod') {
  when {
    allOf {
      branch 'main'
      not { changeRequest() }
    }
    beforeAgent true                             // 不满足时不分配 agent
  }
  steps { sh './deploy.sh prod' }
}
```

---
transition: slide-up
---

# environment + credentials

```groovy
pipeline {
  agent any

  environment {
    NPM_TOKEN = credentials('npm-publish-token')   // Secret Text
    DB        = credentials('mysql-prod')          // Username+Password
    // → 自动生成 DB_USR / DB_PSW
  }

  stages {
    stage('Publish') {
      steps {
        sh 'npm publish --token $NPM_TOKEN'
        sh 'mysql -u$DB_USR -p$DB_PSW < migrate.sql'
      }
    }
  }
}
```

<v-click>

凭据 ID 在 **Manage Jenkins → Credentials** 加，Jenkinsfile 只引用 ID，密文从不进仓库。

</v-click>

---
transition: slide-up
---

# withCredentials：临时凭据块

```groovy
stage('Deploy K8s') {
  steps {
    withCredentials([
      file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG'),
      sshUserPrivateKey(
        credentialsId: 'deploy-ssh',
        keyFileVariable: 'SSH_KEY',
        usernameVariable: 'SSH_USER',
      ),
    ]) {
      sh '''
        kubectl --kubeconfig=$KUBECONFIG apply -f k8s/
        ssh -i $SSH_KEY $SSH_USER@host './reload.sh'
      '''
    }
  }
}
```

<v-click>

退出块后变量立刻失效，比 environment 注入更安全（不污染整个 pipeline）。

</v-click>

---
transition: slide-up
---

# post：按状态收尾

```groovy
post {
  always       { junit 'reports/*.xml' }                    // 不论结果
  success      { slackSend message: "✅ #${BUILD_NUMBER}" }
  failure      { slackSend message: "❌ #${BUILD_NUMBER}" }
  unstable     { mail to: 'qa@team', subject: '测试不稳定' }
  changed      { echo '状态较上次发生变化' }
  fixed        { echo '上次失败本次恢复' }
  regression   { echo '上次成功本次失败' }
  cleanup      { deleteDir() }                              // 最后执行
}
```

<v-click>

`always` / `success` / `failure` / `cleanup` 是最常用四件套；`changed` / `fixed` / `regression` 跨次构建对比，配合 Slack/邮件最实用。

</v-click>

---
transition: slide-up
---

# Multibranch Pipeline：现代首选

每个分支自己的 Jenkinsfile，PR / Tag 自动发现并跑

<v-clicks>

**配置一次**：在 Jenkins 新建 Multibranch Pipeline → 指向 GitHub/GitLab 仓库

**Jenkins 自动**：
- 扫描所有分支，发现 `Jenkinsfile` 的就建 Job
- 监听 webhook，分支推送 / PR / Tag 立即触发
- 暴露环境变量 `BRANCH_NAME`、`CHANGE_ID`（PR 号）

**Pipeline 里按分支差异化**：
```groovy
when {
  anyOf {
    branch 'main'
    changeRequest target: 'main'
  }
}
```

</v-clicks>

---
transition: slide-up
---

# 共享库 Shared Library

把多项目重复的 Pipeline 抽出，独立 Git 仓库

```
my-shared-lib/
├── vars/                    # 全局函数（文件名=变量名）
│   └── deploy.groovy        # def call(String env) { ... }
├── src/                     # Groovy 类（包结构）
└── resources/               # 文本模板
```

```groovy
@Library('my-shared-lib@v1.0') _    // 一行导入（_ 必填）

pipeline {
  agent any
  stages {
    stage('Deploy') {
      steps { deploy 'staging' }     // 调用 vars/deploy.groovy
    }
  }
}
```

<v-click>

生产环境固定 tag（`@v1.0`），别用 `@main`——动态加载会让正在跑的构建拿到新代码。

</v-click>

---
transition: slide-up
---

# Master-Agent 架构

```
┌─────────────┐   调度   ┌─────────────────────────────┐
│ Controller  │ ───────▶ │  Agents（按 label 调度）    │
│  (master)   │          │    - linux-build  (exec: 4)│
│  UI / 调度  │          │    - macos-arm    (exec: 2)│
│  凭据 / 配置│          │    - windows      (exec: 2)│
└─────────────┘          │    - k8s-dynamic  (动态)   │
                         └─────────────────────────────┘
```

<v-clicks>

- **Controller**：Jenkins 主进程，**不该跑构建**（built-in node executor 设 0）
- **Agent**：Java 进程，SSH / JNLP 连 controller
- **Executor**：agent 上的并发槽位
- **Label**：调度的核心，Pipeline `agent { label 'linux' }` 匹配

</v-clicks>

---
transition: slide-up
---

# vs GitHub Actions

| 维度       | Jenkins                       | GitHub Actions               |
| ---------- | ----------------------------- | ---------------------------- |
| 部署       | 自托管为主                    | SaaS 为主（也可自托管 Runner）|
| 配置       | Jenkinsfile / Groovy DSL      | YAML                         |
| 触发集成   | 需配 webhook + Branch Source  | 原生与仓库事件耦合           |
| 节点       | 显式 Master-Agent             | Runner（SaaS 或自部署）      |
| 复用       | Shared Library（Groovy）      | Composite / Reusable（YAML）|
| 生态       | **1800+ 插件**，深            | Marketplace 1.5w+，广        |
| 学习曲线   | 高（Groovy + 运维）           | 低（YAML）                   |

<v-click>

**怎么选**：自托管 / 复杂插件 / 老项目 → Jenkins；GitHub 仓 + 中小团队 → Actions。

</v-click>

---
transition: slide-up
---

# 常见陷阱

<v-clicks>

- `agent any` **跑到 master**：built-in node 也匹配 `any`，构建脚本能读 controller 数据。**始终把 built-in executor 设 0**
- `echo $TOKEN` **漏密**：环境注入凭据有自动屏蔽，但拼接 / base64 后绕过；脚本里永远别 echo 敏感字段
- `pollSCM('* * * * *')` **拖垮**：同分钟所有 Job 一起拉 SCM；用 `H` 让 Jenkins 自动 hash 时间到分散点
- 共享库改 `vars/` **立刻生效**：动态加载导致跑中的构建拿新代码；生产必须固定 `@v1.0` tag
- `when { branch 'main' }` **单分支 Pipeline 无效**：没有 BRANCH_NAME 变量；只在 Multibranch 下才有意义
- 声明式块里**写命令式语句**报错难看：必须包 `script { }` 块

</v-clicks>

---
transition: slide-up
---

# Pipeline options 全栈

```groovy
pipeline {
  agent any
  options {
    buildDiscarder(logRotator(numToKeepStr: '20', daysToKeepStr: '30'))
    disableConcurrentBuilds()           // 同一 Job 同分支不并发
    timeout(time: 30, unit: 'MINUTES')  // 整 Pipeline 超时
    timestamps()                        // 日志加时间戳
    ansiColor('xterm')                  // 终端色彩输出
    retry(2)                            // 失败自动重试
    skipDefaultCheckout()               // 不自动 git checkout
    parallelsAlwaysFailFast()           // parallel 任一失败立停
  }
  stages { /* ... */ }
}
```

<v-click>

每条 option 都对应「**否则会踩的坑**」——`disableConcurrentBuilds` 防同分支并发抢资源；`timeout` 防 hang 死耗尽 executor；`buildDiscarder` 防磁盘爆满。

</v-click>

---
transition: slide-up
---

# parameters：人/脚本/cron 触发输入

```groovy
pipeline {
  parameters {
    string(name: 'VERSION', defaultValue: 'latest', description: '版本号')
    booleanParam(name: 'SKIP_TESTS', defaultValue: false)
    choice(name: 'ENV', choices: ['dev', 'staging', 'prod'])
    password(name: 'API_KEY', description: 'API 密钥')
    text(name: 'NOTE', defaultValue: '', description: '多行说明')
  }
  stages {
    stage('Deploy') {
      when { expression { params.ENV == 'prod' } }
      steps { sh "deploy.sh ${params.VERSION}" }
    }
  }
}
```

<v-click>

参数在 UI / API 触发时填写。**`number` 不是内置类型**——需用 `string` + 自校验，或装 Extended Choice plugin。

</v-click>

---
transition: slide-up
---

# when：条件执行

```groovy
stage('Deploy Prod') {
  when {
    beforeAgent true              // 不分配 agent 直接判定（省资源）
    allOf {
      branch 'main'
      not { changeRequest() }      // 不是 PR
      environment name: 'DEPLOY', value: 'true'
      anyOf {
        triggeredBy 'UserIdCause'
        triggeredBy cause: 'TimerTrigger'
      }
    }
  }
  steps { sh './deploy.sh' }
}
```

<v-clicks>

- `beforeAgent true`：判 false 时不抢 agent
- `branch / tag / changeset` 等内置条件
- `expression { ... }` 任意 Groovy 表达式
- `not / allOf / anyOf` 组合逻辑

</v-clicks>

---
transition: slide-up
---

# parallel + matrix

```groovy
stage('Tests') {
  parallel {
    stage('Unit') { steps { sh 'pnpm test:unit' } }
    stage('E2E') {
      agent { label 'gpu' }
      steps { sh 'pnpm test:e2e' }
    }
  }
}

stage('Cross-OS Build') {
  matrix {
    axes {
      axis { name 'OS'; values 'ubuntu', 'windows', 'macos' }
      axis { name 'NODE'; values '18', '20', '22' }
    }
    excludes {
      exclude { axis { name 'OS'; values 'macos' }; axis { name 'NODE'; values '18' } }
    }
    stages {
      stage('Build') { agent { label "${OS}" }; steps { sh "pnpm build" } }
    }
  }
}
```

---
transition: slide-up
---

# Multibranch Pipeline

```
仓库提交 push / PR → Jenkins 扫描
  ↓
为每个分支自动建 Job（含 Jenkinsfile）
  ↓
按 Jenkinsfile 跑 Pipeline
```

<v-click>

**核心变量**：

| 变量 | 含义 |
| --- | --- |
| `BRANCH_NAME` | 分支名 |
| `CHANGE_ID` | PR 号（非 PR 时空） |
| `CHANGE_TARGET` | PR 目标分支（PR 时） |
| `CHANGE_BRANCH` | PR 源分支 |
| `CHANGE_AUTHOR` | PR 作者 |
| `CHANGE_URL` | PR URL |

</v-click>

<v-click>

**Trust 设置**：fork PR 默认 `Nobody` 信任——`Jenkinsfile` 不会跑，防恶意 PR 注入。设 `From users with Approve permission` 可让协作者 PR 跑。

</v-click>

---
transition: slide-up
---

# Shared Library 结构

```
shared-lib/
├── vars/                          # 全局 step（DSL 风格）
│   ├── notifySlack.groovy         # 调用：notifySlack(channel: '#ci')
│   └── deployApp.groovy
├── src/                           # 类库（OOP 风格）
│   └── com/acme/
│       └── Deployer.groovy
├── resources/                     # 静态资源
│   └── templates/
│       └── manifest.yaml
└── README.md
```

```groovy
// Jenkinsfile：加载共享库
@Library('my-shared@v1.2.0') _   // 注意末尾 _ 占位

pipeline {
  stages {
    stage('Deploy') {
      steps {
        notifySlack channel: '#ci', msg: '开始部署'  // vars/ 中定义
      }
    }
  }
}
```

---
transition: slide-up
---

# Master-Agent 架构

```
┌──────────────────┐         ┌──────────┐
│    Controller    │─SSH────▶│ Agent #1 │ Linux build
│  (Master Node)   │─SSH────▶│ Agent #2 │ macOS test
│ - Web UI         │─JNLP───▶│ Agent #3 │ Windows
│ - 调度 + 元数据  │─K8s────▶│ Pod Agent│ 动态 GPU
└──────────────────┘         └──────────┘
       ↑
       │ persistent volume
       ▼
  jobs/ secrets/ config.xml
```

<v-clicks>

- **Controller**：只管调度、UI、元数据。**不跑 build**（built-in executor 设 0）
- **Agent 连接方式**：SSH（controller 主动）/ JNLP（agent 主动，防火墙后用）/ Kubernetes（动态 Pod）
- **Pod template**：K8s executor 启动一次性 Pod，build 完销毁

</v-clicks>

---
transition: slide-up
---

# Credentials 类型

| 类型 | 用途 | 注入方式 |
| --- | --- | --- |
| Username/Password | API token | `withCredentials([usernamePassword(...)])` |
| Secret Text | 单字符串 token | `credentials('id')` 注入 env |
| Secret File | 整文件 | env 拿到的是临时文件路径 |
| SSH Key | git / 服务器登录 | `sshagent(['id'])` |
| Certificate | mTLS 证书 | -          |
| Docker registry | image push | `withDockerRegistry` |

```groovy
environment {
  DB_PASSWORD = credentials('db-prod') // env 注入 + log mask
  KUBECONFIG = credentials('kube-config') // Secret File：env = 临时路径
}

stage('Deploy') {
  steps {
    withCredentials([sshUserPrivateKey(credentialsId: 'prod-key', keyFileVariable: 'KEY')]) {
      sh "ssh -i $KEY user@prod 'deploy.sh'"
    }
  }
}
```

---
transition: slide-up
---

# JCasC：Configuration as Code

```yaml
# casc.yaml
jenkins:
  systemMessage: "Jenkins managed by JCasC"
  numExecutors: 0      # built-in 不跑 build
  authorizationStrategy:
    roleBased:
      roles:
        global:
          - name: "admin"
            permissions: ["Overall/Administer"]
  clouds:
    - kubernetes:
        name: "k8s"
        templates:
          - name: "default"
            containers:
              - name: "jnlp"
                image: "jenkins/inbound-agent:latest"
credentials:
  system:
    domainCredentials:
      - credentials:
          - usernamePassword:
              id: "github"
              username: "ci"
              password: "${GITHUB_TOKEN}"
```

```bash
CASC_JENKINS_CONFIG=/var/jenkins_home/casc.yaml
# 启动时自动加载 → 整个 Jenkins 配置代码化
```

---
transition: slide-up
---

# 备份与恢复

`JENKINS_HOME` 关键目录：

| 路径 | 内容 |
| --- | --- |
| `jobs/` | Job 配置 + 构建历史 |
| `secrets/` | master.key + credentials |
| `config.xml` | 全局配置 |
| `users/` | 用户配置 |
| `plugins/` | 插件（可重装）|

```bash
# 全量备份
tar czf jenkins-backup-$(date +%Y%m%d).tar.gz \
  -C /var/jenkins_home \
  jobs secrets config.xml users

# 增量（仅配置变化）
rsync -av --delete /var/jenkins_home/jobs/ backup-host:/backups/jobs/
```

<v-click>

**陷阱**：漏 `secrets/` 时 restore 后所有凭据无法解密（master.key 不在 = 密钥本丢失）。

</v-click>

---
transition: slide-up
---

# CI/CD 模式：Kubernetes 部署

```groovy
pipeline {
  agent { kubernetes { yaml /* pod spec */ } }
  stages {
    stage('Build') {
      steps {
        container('kaniko') {
          sh '/kaniko/executor --destination=registry/app:${BUILD_NUMBER}'
        }
      }
    }
    stage('Deploy') {
      steps {
        container('helm') {
          withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
            sh """
              helm upgrade --install app charts/app/ \\
                --set image.tag=${BUILD_NUMBER} \\
                --namespace=prod \\
                --kubeconfig=$KUBECONFIG
            """
          }
        }
      }
    }
  }
}
```

---
transition: slide-up
---

# 蓝绿 / 金丝雀

```groovy
stage('Deploy Blue') { steps { sh 'helm install app-blue charts/app/' } }

stage('Smoke Test') {
  steps {
    sh 'curl -f http://blue.app.internal/health'
    timeout(5) {
      input message: '蓝环境通过？切流量到蓝吗？', ok: '切'
    }
  }
}

stage('Switch Traffic') {
  steps {
    sh 'kubectl patch svc app -p \'{"spec":{"selector":{"version":"blue"}}}\''
  }
}

stage('Cleanup Green') {
  when { expression { currentBuild.result == 'SUCCESS' } }
  steps { sh 'helm uninstall app-green' }
}
```

---
transition: slide-up
---

# stash / unstash：跨 stage 文件传递

```groovy
stage('Build') {
  steps {
    sh 'pnpm build'
    stash name: 'dist', includes: 'dist/**'
    stash name: 'reports', includes: 'coverage/**, test-results/**'
  }
}

stage('Deploy') {
  agent { label 'deployer' }  // 切到另一 agent
  steps {
    unstash 'dist'
    sh 'rsync -av dist/ deploy@server:/var/www/'
  }
}

stage('Publish Reports') {
  steps {
    unstash 'reports'
    junit 'test-results/**/*.xml'
    publishHTML([reportDir: 'coverage', reportFiles: 'index.html'])
  }
}
```

<v-click>

`stash` 适合小文件跨 stage / agent（< 50MB）；大文件用 artifacts 或共享存储。

</v-click>

---
transition: slide-up
---

# post：构建后处理

```groovy
pipeline {
  stages { /* ... */ }
  post {
    always {
      junit allowEmptyResults: true, testResults: '**/test-results/*.xml'
      archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
      cleanWs()
    }
    success {
      slackSend channel: '#ci', message: "✅ ${env.JOB_NAME} #${env.BUILD_NUMBER}"
    }
    failure {
      slackSend channel: '#ci-alerts', message: "❌ Build failed: ${env.BUILD_URL}", color: 'danger'
      emailext to: 'team@example.com', subject: 'Build Failed', body: '...'
    }
    unstable { /* test 失败但 build 成功 */ }
    aborted { /* 手动 / 超时取消 */ }
    changed { /* 状态从 success 变 failure，或反过来 */ }
    fixed { /* 上次失败这次成功 */ }
    regression { /* 上次成功这次失败 */ }
  }
}
```

---
transition: slide-up
---

# 性能调优

<v-clicks>

- **Controller 不跑 build**：`numExecutors: 0` 让 controller 只调度
- **Agent 分类**：Linux build / macOS test / GPU / 大内存——`label` 精准调度
- **Pod template 复用**：K8s executor 同 spec 的 build 复用同 Pod（idle 后销毁）
- **Workspace 清理**：build 完 `cleanWs()`，否则磁盘渐满
- **Build Discarder**：保留近 N 次构建，旧的自动清
- **Pipeline durability**：`durability hint = PERFORMANCE_OPTIMIZED` 减少磁盘写入
- **Plugin 精简**：装 100+ plugin 启动慢；不用的卸载
- **JVM heap**：`-Xmx4g` 起步，监控 GC

</v-clicks>

---
transition: slide-up
---

# 监控

```groovy
// Prometheus exporter（装 Prometheus Metrics plugin）
// → http://jenkins/prometheus/ 暴露 metrics

// 关键指标
default_jenkins_builds_duration_milliseconds_summary  // Job 时长
jenkins_executor_count_value                          // 总 executor
jenkins_executor_in_use_value                          // 使用中 executor
jenkins_node_offline_value                             // 离线节点
jenkins_queue_size_value                                // 队列长度
```

<v-click>

Grafana dashboard ID `9964`（Jenkins Performance and Health Overview）开箱即用。配警报：

- queue size > 10 持续 5min → executor 不够
- executor 使用率 > 90% → 扩容
- 节点离线 > 0 → 调查

</v-click>

---
layout: center
class: text-center
---

# 总结

适合：自托管 / 内网部署 / 复杂插件 / 老项目维护

少做：开源仓 / 小团队 / GitHub-only 项目 → 优先 GitHub Actions

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://www.jenkins.io/doc/" target="_blank">jenkins.io/doc</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/jenkinsci/jenkins" target="_blank">jenkinsci/jenkins</a>
</div>
