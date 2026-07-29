---
theme: seriph
background: https://cover.sli.dev
title: GitLab 完全指南
info: |
  GitLab 完全指南：一体化 DevSecOps · 内置 CI/CD · 自托管 · Merge Request · Duo

  Learn more at [https://docs.gitlab.com](https://docs.gitlab.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## GitLab

单应用一体化 DevSecOps · 内置 CI · MR · Duo

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
GitLab 把整套 DevOps 收敛进一个应用。
-->

---
transition: fade-out
---

# GitLab 是什么

单应用一体化 DevSecOps 平台

- **CI/CD 内置（built-in）**：声明即用，无需拼装
- **单应用 DevOps**：plan→deploy→monitor 全贯通
- **DevSecOps 一等公民**：SAST/DAST/扫描全内建
- **自托管优先**：CE 开源免费 / EE 企业版
- **GitLab Duo**：覆盖全生命周期的 AI

> 一句话：`.gitlab-ci.yml` 一行，pipeline 就跑起来。

<!--
GitLab 最鲜明的差异是 CI/CD 是内置的。
-->

---

# 平台对比

| 维度 | GitLab | GitHub | Gitee |
|------|------|------|------|
| CI/CD | 内置（深度集成） | Actions（拼装） | Go（轻量） |
| 安全 | DevSecOps 内建 | 需外接工具 | 弱 |
| 自托管 | CE 免费 / EE | Enterprise 付费 | 私有化 |

> 要一体化 DevOps + 自建选 GitLab。

<!--
两者常互补：GitHub 主仓，GitLab 跑 CI。
-->

---
layout: two-cols
---

# SaaS vs 自托管

| 形态 | 适用 |
|------|------|
| SaaS | 中小团队 |
| CE 自建 | 内网/成本敏感 |
| EE 自建 | 企业强合规 |

- Dedicated：隔离免运维
- Omnibus 包一键安装，CE 至少 4 核 8GB

::right::

# Group / Project 层级

```
顶级 Group（公司）
├── Subgroup（事业部）
│   └── Project（仓库）
└── Subgroup
    └── Project
```

- 组级变量/权限自动继承
- 角色：Owner / Maintainer
  / Developer / Reporter

> 组级配置子项目自动继承。

<!--
GitLab 用「组」组织项目与权限。
-->

---

# Merge Request（MR）

GitLab 的代码评审单元，对应 GitHub PR

1. 开分支、commit、push
2. 网页点 **New merge request**
3. 填标题/描述，关联 Issue（`Closes #42`）
4. pipeline 自动跑、Reviewer 评审
5. Merge（可选 Squash / Cherry-pick）

**MR 比 PR 多的原生特性**

- 可指定 approver 规则
- Draft MR（WIP 标记）
- Review 模式逐行批注

> MR 关联多个 issue、评审规则更细。

<!--
MR 是 GitLab 的协作核心。
-->

---

# 内置 CI/CD（built-in）

仓库根目录放 `.gitlab-ci.yml` 即用

```yaml
stages: [test, deploy]
test:
  stage: test
  script: [npm ci, npm test]
deploy:
  stage: deploy
```

- **深度集成**：MR 页直接显示 pipeline 状态
- **Runner 可自建**：GitLab Runner（Go 写）
- executor：docker（推荐）/ shell / k8s

> docker executor 隔离干净，生产首选。

<!--
GitLab CI 是平台原生的，深度集成 MR。
-->

---

# DevSecOps 内建

安全扫描开箱即用，`include` 模板即跑

```yaml
include:
  - template: Security/SAST.gitlab-ci.yml
  - template: Security/Dependency-Scanning.gitlab-ci.yml
  - template: Security/Container-Scanning.gitlab-ci.yml
```

- 扫描结果**聚合到 MR**（显示新增漏洞）
- 项目级 + 组级**安全仪表盘**
- 漏洞可忽略、建 issue、跟踪修复
- License 合规可拒高风险许可证

> Auto DevOps 下默认开启全套扫描。

<!--
GitLab 把安全做成 DevSecOps 一等公民。
-->

---

# Registry · Pages · Runner

- **Container Registry**：`registry.gitlab.com/<group>/<project>`
- **Package Registry**：npm/Maven/PyPI 等
- **GitLab Pages**：`.gitlab-ci.yml` 构建产物传 `public`
- **`$CI_JOB_TOKEN`**：pipeline 自动注入，免配推镜像

| Runner | 说明 |
|------|------|
| Shared | 实例级共享 |
| Group | 组级共享 |
| Specific | 锁单项目 |

> `$CI_JOB_TOKEN` 免额外配置即可推 Registry。

<!--
Registry 与 Pages 都内置，CI token 自动注入。
-->

---

# GitLab Duo · 协同

- **Code Suggestions**：IDE 补全生成
- **Duo Chat**：对话问代码、写测试
- **Code Review**：MR AI 评审
- **Root Cause Analysis**：失败 job AI 找根因
- Ultimate 可接**自托管模型**（数据不出企业）

**镜像 GitHub（CI 协同）**

- Pull mirroring：GitLab 拉 GitHub
- CI for external repos：对 GitHub 仓库跑 GitLab CI

> GitHub 主仓 + Copilot，GitLab 跑 CI 与安全扫描。

<!--
Duo 是全生命周期的 Agentic AI。
-->

---

# 治理 · 迁移

- **组级继承**：CI 变量、Secrets、权限、Approval 下推
- **权限角色**：Owner / Maintainer / Developer / Reporter / Guest
- **Compliance framework**：标记 GDPR/PCI 项目
- **迁移**：GitHub → GitLab 用导入工具

| 方向 | 方式 |
|------|------|
| GitHub→GitLab | 导入工具 + token |
| GitLab→GitHub | git push / 第三方 |

> 企业治理：权限矩阵 + 审计日志 + 合规框架。

<!--
平台定位与治理是 GitLab 的强项。
-->

---
layout: quote
---

# GitLab 的精髓

「`.gitlab-ci.yml` 一行声明，pipeline 就跑在自家 Runner 上；DevSecOps 内建，安全扫描开箱即用——一体化即 GitLab 的灵魂。」

---
layout: center
class: text-center
---

# 小结

GitLab = 一体化 + 内置 CI + DevSecOps

**单应用 · 自托管 · 安全左移 · Duo AI**

[GitLab 文档](https://docs.gitlab.com) · [CI/CD](https://docs.gitlab.com/ee/ci/) · [Duo](https://docs.gitlab.com/ee/user/ai_assistant.html)

<!--
GitLab 是 GitHub 之外最主流的托管平台。
-->
