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
