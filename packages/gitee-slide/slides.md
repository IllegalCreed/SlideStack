---
theme: seriph
background: https://cover.sli.dev
title: Gitee 完全指南
info: |
  Gitee 完全指南：国内代码托管 · GitHub 镜像 · Gitee Go · 企业版 · 私有化

  Learn more at [https://help.gitee.com](https://help.gitee.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Gitee

国内最大代码托管 · GitHub 镜像 · 企业研发

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Gitee 是开源中国旗下的「中国版 GitHub」。
-->

---
transition: fade-out
---

# Gitee 是什么

国内最大的代码托管与协作平台

- **核心差异化**：服务器在国内，访问快
- **GitHub 镜像**：一键导入/同步做加速
- **企业版 + 私有化**：满足数据本地化与合规
- **国产化适配**：信创、政企、金融友好
- **本地化体验**：全中文、国内客服、微信通知

> 上线于 2013 年，开源中国（OSCHINA）旗下。

<!--
Gitee 主打国内访问速度快这一核心差异化。
-->

---

# 平台对比

| 维度 | Gitee | GitHub | GitLab |
|------|------|------|------|
| 国内访问 | 快 | 慢 | 中 |
| CI/CD | Go（轻量） | Actions（强） | 内置（强） |
| 公开库审核 | 需人工审核 | 无 | 无 |

> 国内速度 + 合规 + 镜像用 Gitee。

<!--
三者常互补：GitHub 主仓 → Gitee 镜像加速。
-->

---
layout: two-cols
---

# 账号与仓库

- 个人版：免费（5 人团队）
- 企业版 SaaS：按人按月/年
- 专业版私有化：商业授权
- 建仓：`+` → 新建仓库
  → 勾 README + License

**PR 流（与 GitHub 一致）**

::right::

```
Fork → 开分支 → commit → push
       → PR → Review → Merge
```

- 关联 Issue：`Closes #123`
- CI 跑 Gitee Go

> Gitee 的 PR 流程与 GitHub 基本一致。

<!--
Gitee 产品形态对标 GitHub。
-->

---

# 镜像 GitHub（核心用途）

最常见的用法：给 GitHub 仓库做国内加速

**方式一：一键导入**

- `+` → 从 GitHub/GitLab 导入
- OAuth 授权 → 自动导入

**方式二：手动镜像**

```bash
git remote add gitee https://gitee.com/user/repo.git
git push gitee --all
git push gitee --tags
```

**方式三**：仓库设置「强制同步」（Gitee 定期拉 GitHub）

> 大仓库把 GitHub 地址换 Gitee 镜像，KB/s→MB/s。

<!--
镜像 GitHub 是 Gitee 最常见的用法。
-->

---

# Gitee Go —— CI/CD

声明式流水线，放 `.workflow/*.yml`

```yaml
name: 构建测试
on: [push]
jobs:
  build:
    runs-on: ubuntu
    steps: [{ run: npm ci && npm test }]
```

- 触发器：push / pull_request / schedule / manual
- SaaS Runner + 企业版自建 Runner
- 模板库 < GitHub Marketplace

> Gitee Go 不如 Actions/GitLab CI 生态丰富。

<!--
Gitee Go 覆盖国内常见构建场景。
-->

---

# Pages · Packages · AI

- **Gitee Pages**：仓库即静态站
  - 地址 `<user>.gitee.io/<repo>`
  - Pro 支持自定义域名 + HTTPS（付费）
- **Gitee Packages**：npm/Maven/Docker 制品库
- **AI 队友**：IDE 补全（体验不及 Copilot）
- **模力方舟**：开源模型/数据集/应用市场

> Gitee Pages 对部署内容同样有合规要求。

<!--
Gitee AI 对接国产开源模型生态。
-->

---
layout: two-cols
---

# 企业版与私有化

- **企业版 SaaS**：需求/任务/缺陷、看板、迭代
- **代码评审**：PR、Code Owner
- **测试管理**：用例、执行
- **专业版私有化**：内网部署
  - 满足等保/信创
  - 政企/金融/军工首选

::right::

# CopyCat 代码查重

Gitee 企业版特色能力：

- **跨仓库查重**：内部仓库代码克隆
- **开源比对**：识别未声明引用
- **入职审计**：新员工带入代码
- 输出重复率 + 相似片段

> 对代码资产合规与知识产权很有价值。

<!--
企业版打通代码托管与项目管理。
-->

---

# 公开库审核（重要边界）

因国内内容合规，Gitee 公开仓库需人工审核

- **2022 年 5 月**：执行「开源仓库审核后上线」
- 新公开库需人工审核，通过方可公开访问
- 官方表态「迫于无奈」，主因合规与版权
- 与开源自由开放精神冲突，引发争议

> GitHub/GitLab 公开库无需审核，Gitee 需审核。

<!--
这是 Gitee 与 GitHub/GitLab 最大的治理差异。
-->

---

# 多平台协同与选型

国内团队常见的「三仓协同」拓扑

```
GitHub（主仓 + 开源 + Copilot）
   ↓ 镜像
Gitee（国内加速）  GitLab（CI + 安全）
```

| 场景 | 推荐 |
|------|------|
| 国内速度 + 合规 | Gitee |
| 国际开源 + Copilot | GitHub |
| 一体化 DevOps | GitLab |

> 明确「以哪个为源」，避免双向冲突。

<!--
三仓协同是国内团队常见拓扑。
-->

---
layout: quote
---

# Gitee 的精髓

「服务器在国内、访问快、能镜像 GitHub、能私有化部署——Gitee 是 GitHub 在国内不稳定时的主流替代，但公开库审核是与开源精神的最大张力。」

---
layout: center
class: text-center
---

# 小结

Gitee = 国内托管 + GitHub 镜像 + 合规

**国内速度 · 一键镜像 · 企业私有化 · 信创**

[Gitee 帮助中心](https://help.gitee.com) · [企业版](https://gitee.com/enterprises) · [Gitee AI](https://ai.gitee.com)

<!--
Gitee 是国内最大的代码托管平台。
-->
