---
theme: seriph
background: https://cover.sli.dev
title: Terraform 深入浅出
info: |
  声明式的基础设施即代码（IaC）。

  基于 Terraform（1.x）· 核于 2026-07
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Terraform

**声明式**的基础设施即代码：描述期望状态，由它收敛

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<!--
Terraform 用 HCL 描述期望的基础设施，跨多云可复现、可预览地供给。
-->

---
transition: fade-out
---

# 什么是 IaC / 声明式

描述「要什么」，而非「怎么一步步做」

<v-clicks>

- **IaC**：用代码描述并管理基础设施（云资源/DNS/K8s…）
- **声明式**：你写**期望状态**，Terraform 算出并执行达成它的增删改
- 对比命令式脚本：可复现、幂等、可预览、可版本控制
- 语言是 **HCL**（HashiCorp Configuration Language），写 `.tf` 文件
- HashiCorp 出品，云时代 IaC 事实标准之一

</v-clicks>

<!--
声明式 + state 是 Terraform 相对手写脚本的根本进步。
-->

---
transition: fade-out
---

# 核心工作流

init → plan → apply（→ destroy）

<v-clicks>

- **init**：下载 provider、初始化 backend、装模块
- **plan**：计算并**预览**要做的增/改/删，**不执行**
- **apply**：执行变更，把基础设施收敛到期望状态
- **destroy**：销毁该配置管理的资源
- **provider**：与具体平台交互的插件（aws/google/kubernetes…）

</v-clicks>

<div v-click class="mt-3 text-sm">

生产变更**先看 plan** 再 apply，尤其关注 destroy/replace

</div>

<!--
plan→apply 的先预览后执行，是安全操作的关键。
-->

---
transition: fade-out
---

# HCL 语言要点

resource / data / 变量 / 循环

<div grid="~ cols-2 gap-4">

<div>

- **resource**：TF 创建/管理的资源
- **data**：只读查询已存在信息
- **variable/output/locals**：入参/出参/局部

</div>

<div>

- **count**：按数字索引（删中间项致重排）
- **for_each**：按稳定键（增删不误伤）→ 优先
- **依赖**：靠**引用**自动推断，少写 depends_on

</div>

</div>

<div v-click class="mt-2 text-sm">

`lifecycle`：prevent_destroy / create_before_destroy / ignore_changes

</div>

<!--
可增删的集合优先 for_each，避免 count 的索引位移重建。
-->

---
transition: fade-out
---

# state：Terraform 的真相来源

记录「管理的资源 ↔ 真实基础设施」映射

<v-clicks>

- plan 靠对比 **state / 现状** 与**期望**算差异
- 团队协作：用**远程 backend**（S3/GCS/Azure/HCP）共享 state
- **state locking**：防并发 apply 同时改 state 损坏
- **drift**：真实资源在 TF 之外被改 → plan 可检测
- ⚠️ **敏感值会明文进 state** → state 须加密 + 严格访问控制

</v-clicks>

<!--
本地 state 无法安全共享/并发，团队必用远程 backend + 锁。
-->

---
transition: fade-out
---

# 模块 module

可复用的基础设施封装

<v-clicks>

- 一组 `.tf` 的可复用封装，用**输入变量**参数化、**输出**暴露结果
- 把常用模式（如「带子网的 VPC」）封装成组件，多环境复用
- root module 调用 child module（本地或 Registry）
- Registry 提供社区/私有模块，可版本约束
- **组合优于继承**，用模块拆分复杂基础设施

</v-clicks>

<!--
模块让基础设施代码 DRY、可测试、可共享。
-->

---
transition: fade-out
---

# 幂等 / 可复现 / 构建一次

声明式带来的可信保障

<v-clicks>

- **幂等**：已处于期望状态则再 apply 无变更（plan 显示无变化）
- **可复现**：锁 provider（`.terraform.lock.hcl`）+ 固定输入 → 相同产出
- **import**：把已存在的资源纳入 state 管理，无需销毁重建
- **provisioner**（local/remote-exec）破坏声明式，**最后手段**
- 环境差异用变量/tfvars 注入，同一配置多环境复用

</v-clicks>

<!--
.terraform.lock.hcl 锁 provider 版本+校验和，保证可复现防篡改。
-->

---
transition: fade-out
---

# 许可变更与 OpenTofu

2026 讨论 Terraform 绕不开的背景

<v-clicks>

- **2023-08**：Terraform 许可从开源 **MPL 2.0** 改为 **BUSL**（商源）
- 社区反弹 → 催生开源分叉 **OpenTofu**（Linux 基金会 / MPL 2.0）
- OpenTofu CLI 为 `tofu`，分叉初期与 TF **drop-in 兼容**
- 2025 IBM 完成收购 HashiCorp；Terraform Cloud 更名 **HCP Terraform**
- 选型：重开源/治理 → OpenTofu；重官方支持/HCP → Terraform

</v-clicks>

<!--
许可证变更是 Terraform 生态近年最大的事件。
-->

---
transition: fade-out
---

# 在 CI/CD 中安全地用

把 IaC 变更纳入可评审、可审计流程

<v-clicks>

- PR：跑 `fmt` + `validate` + `plan`，把 plan 贴 PR 供评审
- 合并后：在**可信流水线**受控 `apply`
- 远程 state + 锁；凭据用 **OIDC 短时令牌**（不存长期密钥）
- **workspace**：同配置多份 state（同结构少差异环境）
- 与 **Ansible 互补**：TF 供给资源，Ansible 配置软件

</v-clicks>

<!--
生产切勿本地随意 apply；先评审 plan、可信流水线执行。
-->

---
layout: center
class: text-center
---

# 小结

**声明式 IaC**：描述期望状态，init/plan/apply 收敛

语言 → **HCL：resource/data · variable/output · count vs for_each · lifecycle**
核心 → **state（远程 backend + 锁）· drift · import · 模块复用**
可信 → **幂等 · 可复现（lock）· 构建一次多环境**
生态 → **BUSL → OpenTofu 分叉 · HCP · OIDC · 与 Ansible 互补**

<div class="mt-6 text-sm opacity-70">
plan 先预览、state 是真相、敏感值会进 state —— 三大要点
</div>

<!--
Terraform 供给基础设施，与 Ansible 的配置管理互补。
-->
