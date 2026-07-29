---
theme: seriph
background: https://cover.sli.dev
title: GitHub 完全指南
info: |
  GitHub 完全指南：仓库托管 · Pull Request · Actions · Packages · Pages · Copilot

  Learn more at [https://docs.github.com](https://docs.github.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## GitHub

开源生态霸主 · PR · Actions · Copilot

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
GitHub 把 Git 仓库社交化、云端化、生态化。
-->

---
transition: fade-out
---

# GitHub 是什么

把 Git 仓库社交化、云端化的协作平台

- **开源生态霸主**：全球最大开源项目聚集地
- **公开仓库永久免费**：私有库也已无限免费
- **Pull Request**：业界事实标准代码评审流
- **Actions**：yaml 声明式 CI/CD + 托管 Runner
- **Copilot**：IDE 内 AI 编程领先（用量计费）

> 核心流：Fork → 分支 → PR → Review → Merge

<!--
一个 GitHub 账号是程序员的数字身份证。
-->

---

# 平台对比

| 维度 | GitHub | GitLab | Gitee |
|------|------|------|------|
| 定位 | 开源霸主 | 一体化 DevOps | 国内托管 |
| CI/CD | Actions（生态强） | built-in（集成） | Go（轻量） |
| 国内访问 | 慢 | 中 | 快 |

> 参与开源选 GitHub，要 DevOps 选 GitLab。

<!--
三者常互补：GitHub 主仓 → Gitee 镜像加速。
-->

---

# 账号与仓库

- **个人账号**：Free / Pro（$4/mo）
- **Organization**：团队托管标准形态
  - 成员分组、Team 管理、统一计费
  - org 级 Actions/Secrets
- **仓库类型**：公开 / 私有
- **建仓**：`+` → New repository → 勾 README + License

> 开源项目务必加 License（MIT/Apache-2.0）。

<!--
组织是团队托管的标准形态。
-->

---

# Pull Request 流

社交化协作是 GitHub 最大的产品创新

```
Fork → 开分支 → commit → push
       → 开 PR → CI 跑绿 → Review → Merge
```

- 开分支 `git checkout -b feature/x`
- 网页点 **Compare & pull request**
- 关联 Issue：`Closes #123`（merge 自动关）
- Merge 方式：Squash / Rebase / Merge commit

> `Closes/Fixes/Resolves #123` 自动关闭 Issue。

<!--
PR 把代码评审做成「社交事件」。
-->

---

# GitHub Actions —— CI/CD

声明式 yaml，放 `.github/workflows/ci.yml`

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps: [{ uses: actions/checkout@v4 }]
```

- `workflow` / `job` / `step` / `runner` / `action`
- `secrets` 加密变量、`matrix` 多版本并行

> 公开库 Actions 无限免费；私有库 2000 分钟/月。

<!--
Actions 是 GitHub 的 CI/CD 核心。
-->

---
layout: two-cols
---

# Actions 进阶

```yaml
strategy:
  matrix:
    os: [ubuntu, macos]
    node: [18, 20]
  fail-fast: false
```

- `needs`: job 依赖串行
- `if: github.ref == 'refs/heads/main'`
- `actions/cache@v4` 缓存依赖
- reusable workflow 多仓共享

::right::

# Secrets 与 Runner

- `secrets.TOKEN` 加密、`vars.NAME` 明文
- `GITHUB_TOKEN` 自动注入（无需手配）
- self-hosted Runner 私有库免费
- 公开库 PR 勿用自建（安全风险）

> 自建 Runner 跑公开 PR 有命令注入风险。

<!--
公开库用托管 Runner，自建仅用于可信私有库。
-->

---

# GitHub Copilot —— AI 编程

IDE 内 AI 结对（2026-06-01 转用量计费）

- **代码补全**：灰字 ghost text，Tab 接受
- **Copilot Chat**：对话问代码、改写、写测试
- **Agent 模式**：自主完成多文件任务
- **Copilot Review**：PR 自动代码审查

| 计划 | 月费 | AI Credits |
|------|------|------|
| Pro | $10 | $10 |
| Business | $19/user | $19 |

> 补全不消耗 Credits；Chat/Agent 消耗。

<!--
用量计费后重度用户账单可能暴涨，需设上限。
-->

---

# Packages · Pages · 安全

- **Packages**：npm/Docker/Maven 同源管理
- **Pages**：仓库即静态站，自带 HTTPS
  - 地址 `<user>.github.io/<repo>`
- **Dependabot**：依赖漏洞 + 自动开 PR
- **Secret Scanning**：扫到泄露 token 告警
- **CodeQL**：语义化代码安全分析
- **Branch protection**：强制 review/CI 才能 merge

> Pages 配 VitePress/Docusaurus 一键部署。

<!--
GitHub 围绕代码构建了完整生态闭环。
-->

---

# 治理与协同

- **Organization**：Team 分组、SSO、org 级 secrets
- **Enterprise**：多 org、合规审计、IP 允许列表
- **CODEOWNERS**：按路径指定负责人

```text
/src/frontend/   @org/frontend-team
/src/backend/    @org/backend-team @alice
```

- **镜像 GitLab/Gitee**：主仓推镜像做备份或加速
- **CI 双跑**：Actions 跑国际 CI，GitLab 跑国内

> CODEOWNERS 让 PR 自动加 reviewer。

<!--
GitHub 与 GitLab/Gitee 常协同而非互斥。
-->

---
layout: quote
---

# GitHub 的精髓

「Fork → 分支 → PR → Review → Merge，把代码评审做成社交事件，加上 Actions、Packages、Pages、Copilot，构成当代程序员的数字工作台。」

---
layout: center
class: text-center
---

# 小结

GitHub = 仓库 + PR + Actions + Copilot

**开源生态 · 社交化协作 · 一体化工具链**

[GitHub 文档](https://docs.github.com) · [Actions](https://docs.github.com/actions) · [Copilot](https://docs.github.com/copilot)

<!--
GitHub 是开源界事实标准的「操作系统」。
-->
