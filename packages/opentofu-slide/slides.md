---
theme: seriph
background: https://cover.sli.dev
title: OpenTofu
info: |
  Terraform 的开源分叉：同源，只换了许可与掌舵人。

  基于 OpenTofu 1.12 · 核于 2026-07
drawings:
  persist: false
transition: slide-left
mdc: true
---

# OpenTofu

**Terraform 的开源分叉**：同 HCL / state / 命令 / provider，命令名改叫 `tofu`

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<!--
OpenTofu 是 Terraform 因许可变更催生的开源分叉，本套聚焦分叉/治理/兼容/差异。
-->

---
transition: fade-out
---

# OpenTofu 是什么

不是新工具，是 Terraform 的一条开源分支

<v-clicks>

- **本质**：Terraform 的**开源分叉（fork）**，技术同源，分歧只在**许可与治理**
- 同一套**声明式**心智：写期望状态，`plan` 算差异、`apply` 收敛、幂等
- 同一门 **HCL**：`resource` / `data` / `variable` / `module` / `output` 一模一样
- 同一种 **state** 格式、同一批 **provider**、同一套 **Registry** 协议
- 唯一显眼的改动：命令行从 `terraform` 改名 **`tofu`**

</v-clicks>

<!--
理解 OpenTofu 只需记住：它就是 Terraform，换了许可、换了掌舵人、换了命令名。
-->

---
transition: fade-out
---

# 因何而生：BUSL 许可地震

一场许可变更，催生一次社区分叉

<v-clicks>

- **2023-08-10**：Terraform 许可 **MPL 2.0 → BUSL 1.1**（开源转非开源）
- 痛点：BUSL 禁「竞品用途」，**边界含糊**，逼每个用户自我审查
- **2023-08-25**：社区（Gruntwork / Spacelift / Env0…）发起分叉，初名 **OpenTF**
- **2023-09-20**：**Linux 基金会**接纳，因商标更名 **OpenTofu**
- **2024-01-10**：**`tofu` 1.6.0** 首个稳定版，宣布可用于生产

</v-clicks>

<div v-click class="mt-2 text-sm">

Terraform **1.5.x 是最后的 MPL 版**，OpenTofu 从此接棒。

</div>

<!--
Terraform 1.5.x 是最后一个开源版本，OpenTofu 沿用 MPL 2.0 继续走。
-->

---
transition: fade-out
---

# 许可：MPL 2.0 vs BUSL 1.1

OpenTofu 存在的**全部理由**都落在「许可」二字

<div class="text-sm">

| 维度 | OpenTofu | Terraform（1.6+） |
| --- | --- | --- |
| 许可 | **MPL 2.0**（OSI 开源） | **BUSL 1.1**（源码可见，非开源） |
| copyleft | 文件级，可与专有代码共存 | —— |
| 竞品限制 | 无 | **禁止竞品用途** |
| 转换 | 恒为开源 | 承诺 4 年后转回 MPL |
| 掌舵 | Linux 基金会 + TSC | HashiCorp（IBM） |

</div>

<div v-click class="mt-3 text-sm">

⚠️ **source-available ≠ 开源**：能看源码，但 BUSL 限制使用领域，不符合 OSI 开源定义。

</div>

<!--
BUSL 的「禁止竞品用途」违反 OSI「不得限制使用领域」，故是源码可见而非开源。
-->

---
transition: fade-out
---

# Linux 基金会开放治理

许可定「用什么规则」，治理定「谁来定规则」

<v-clicks>

- **中立托管**：LF Projects 旗下，与 Linux / K8s 同类，**不归任一公司**
- **TSC（技术指导委员会）**：多组织成员对重大变更决策，非「一家拍板」
- **公开 RFC**：大特性先写文档、社区评审、共识后才落地
- **merit 决定特性**：按技术价值与社区需求取舍，而非商业路线
- **五原则**：许可不突变 / 社区治理 / 厂商中立 / 模块化 / 向后兼容

</v-clicks>

<!--
由多方发起、基金会托管，从根本上区别于「HashiCorp 一家说了算」。
-->

---
transition: fade-out
---

# `tofu` CLI 与安装

命令名改了，工作流原样保留

<div grid="~ cols-2 gap-4">

<div>

安装（任选其一）：

```bash
# Homebrew
brew install opentofu

# 官方脚本 / 多版本管理
curl -fsSL get.opentofu.org/install.sh | sh
tenv tofu install 1.12.2
```

</div>

<div>

工作流与 Terraform 逐字对应：

```bash
tofu init      # 装 provider/backend
tofu plan      # 先看要发生什么
tofu apply     # 确认并执行
tofu destroy   # 销毁
```

`init/plan/apply/destroy/fmt/validate/state/import` 同名同义。

</div>

</div>

<!--
plan 先预览后执行、state 是真相之源、幂等收敛，与 Terraform 心智完全一致。
-->

---
transition: fade-out
---

# drop-in 兼容：保留 vs 改名

把 `terraform` 换成 `tofu`，配置 / state / provider 原样跑

<div class="text-sm">

| 项 | 处理 |
| --- | --- |
| HCL / state / 命令 / provider / backend | **完全一致**（state 兼容至 TF 1.5.x） |
| `terraform {}` 块名、`TF_*` 环境变量 | **保留**（块名不改成 `tofu`） |
| `.terraform.lock.hcl` / `.terraform/` | **保留** |
| `.terraformrc` | 改名 **`.tofurc`**（格式一致） |
| `.tf` | 可选 **`.tofu`**，同名覆盖 `.tf` |
| Registry 端点 | → **registry.opentofu.org** |

</div>

<div v-click class="mt-2 text-sm">

⚠️ drop-in 有**时间前提**：用了某边独有特性后就不再能无缝互跑。

</div>

<!--
四大件（语言/state/命令/provider）一致，分歧集中在 CLI 周边命名与独有特性。
-->

---
transition: fade-out
---

# 招牌特性：state / plan 加密

OpenTofu 最硬的差异，Terraform 开源版至今没有

<div grid="~ cols-2 gap-4">

<div>

- state 里常**明文存敏感值**（密码/私钥/token）
- OpenTofu 把加密提前到**客户端**：**写盘前就加密**
- 三段式：**key provider → method → state/plan**
- key provider：`pbkdf2` / `aws_kms` / `gcp_kms` / `openbao`
- `fallback` 支持平滑**轮换** key

</div>

<div>

```hcl
terraform {
  encryption {
    key_provider "pbkdf2" "p" {
      passphrase = var.pass
    }
    method "aes_gcm" "m" {
      keys = key_provider.pbkdf2.p
    }
    state { method = method.aes_gcm.m }
  }
}
```

</div>

</div>

<!--
加密保护静态数据，但不与 Terraform 互通——开了加密的 state，Terraform 读不了。
-->

---
transition: fade-out
---

# 其他 OpenTofu-only 特性

按版本梳理独有 / 明显先行的能力

<v-clicks>

- **1.7**：state/plan 加密、provider-defined functions、`removed` 块
- **1.8**：early variable evaluation（backend/source 可用变量）、`.tofu` 文件
- **1.9**：**provider `for_each`**（多区域/多账号）、**`-exclude`**（`-target` 反选）
- **1.10**：**OCI registry** 分发 provider/module
- **1.11**：ephemeral、**`enabled` 元参数**（告别 `count = x ? 1 : 0`）

</v-clicks>

<div v-click class="mt-2 text-sm">

硬差异：**加密 · `-exclude` · provider `for_each` · `enabled` · `.tofu` · OCI**；部分特性两边并行，以官方 What's new 为准。

</div>

<!--
别把「OpenTofu 有」等同「Terraform 一定没有」——两边都在迭代，下笔前核对 What's new。
-->

---
transition: fade-out
---

# 从 Terraform 迁移：四步

官方迁移指南的最小路径

<div grid="~ cols-2 gap-4">

<div>

<v-clicks>

1. **备份** state 与全部代码
2. **装 `tofu`**（`brew install opentofu`）
3. **`tofu init`** 接管现有目录
4. `tofu plan` 应为 **`No changes`**
5. 用**小改动**跑通 `plan → apply` 再全切

</v-clicks>

</div>

<div>

```bash
cp terraform.tfstate \
   terraform.tfstate.bak
brew install opentofu
tofu init
tofu plan   # 期望 No changes
```

</div>

</div>

<div v-click class="mt-2 text-sm">

额外当心：`terraform_remote_state` 跨配置成对迁移；CI 换命令名；`.terraformrc` → `.tofurc`。

</div>

<!--
tofu plan 若显示大量变更，多半版本/provider 不对齐，别急着 apply。
-->

---
transition: fade-out
---

# 各自演进：特性会越差越远

选型时最易忽略、却最要紧的一点

<v-clicks>

- 分叉那天 OpenTofu ≈ Terraform 1.6，此后**各走各路**
- OpenTofu 由社区/基金会按 RFC 推进（加密、`-exclude`、`enabled`…）
- Terraform 由 HashiCorp（**2025-02 IBM 约 64 亿美元收购**）按商业路线走
- 结果：**特性集持续分叉**，用了某边独有特性就不能无缝互跑
- **越往后越难回头**：加密后的 state，Terraform 根本读不了

</v-clicks>

<div v-click class="mt-2 text-sm">

把选型当**长期承诺**，而非可随时反悔的开关。

</div>

<!--
没用独有特性时来回迁移基本无痛；用了（尤其加密）回退代价陡增。
-->

---
transition: fade-out
---

# 选型：OpenTofu vs Terraform

没有普适答案，对号入座

<div class="text-sm">

| 你的处境 | 倾向 |
| --- | --- |
| 在意**许可确定性 / 纯开源 / 厂商中立** | **OpenTofu** |
| 公司**做与 HashiCorp 竞争的产品** | **OpenTofu**（BUSL 有合规风险） |
| 想用**加密 / `-exclude` / provider `for_each` / `enabled`** | **OpenTofu** |
| 用 **Spacelift / Scalr / env0** 等平台 | 多**默认 OpenTofu** |
| 深绑 **HCP Terraform / TFE** 商业能力 | **Terraform** |
| 只本地小团队自用、无特殊需求 | **两者皆可** |

</div>

<div v-click class="mt-2 text-sm">

一句话：**要活很多年、开源可控、可能嵌进自家产品 → OpenTofu；已吃 HashiCorp 商业全家桶且不做竞品 → Terraform。**

</div>

<!--
中间地带看你最想要哪几个独有特性、以及团队与生态现状。
-->

---
layout: center
class: text-center
---

# 小结

**Terraform 的开源分叉**：同 HCL / state / 命令 / provider，命令名 `tofu`

分叉 → **2023-08 BUSL 许可变更 → 社区分叉 → Linux 基金会 + MPL 2.0**
治理 → **厂商中立 · TSC · 公开 RFC · 不自造 provider（复用现有）**
兼容 → **drop-in：四大件一致 · 保留 `terraform {}` / `TF_` · `.tofurc` / `.tofu`**
差异 → **state 加密 · `-exclude` · provider `for_each` · `enabled` · OCI**
选型 → **开源/中立/独有特性 → OpenTofu；深绑 HCP → Terraform**

<div class="mt-6 text-sm opacity-70">
用了独有特性（尤其加密）后回退代价高 —— 选型是长期承诺
</div>

<!--
OpenTofu 与 Terraform 同源，分歧在许可/治理与各自演进的独有特性。
-->
