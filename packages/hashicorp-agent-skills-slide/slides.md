---
theme: seriph
background: https://cover.sli.dev
title: HashiCorp Agent Skills
info: |
  HashiCorp 官方 agent 技能集与 Claude Code 插件：Terraform + Packer。
  hashicorp/agent-skills，MPL-2.0。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# HashiCorp Agent Skills

HashiCorp 官方技能集——给 LLM 灌 **Terraform / Packer 官方约束**

<div class="pt-6 opacity-80">
hashicorp/agent-skills · Terraform + Packer · 6 插件 · MPL-2.0
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/hashicorp/agent-skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #7B42BC 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
HashiCorp Agent Skills 是 HashiCorp（现属 IBM）官方的 agent 技能集与 Claude Code 插件，覆盖 Terraform 和 Packer，核心价值是给 LLM 灌官方约束，治幻觉写 IaC。
-->

---
transition: fade-out
---

# 定位：官方，只做 Terraform + Packer

一句话——为 HashiCorp 产品提供的 Agent skills 与 Claude Code 插件

| 产品 | 用途 |
| --- | --- |
| **Terraform** | 写 HCL、建模块、开发 provider、跑测试、写策略 |
| **Packer** | 在 AWS / Azure / Windows 建镜像、集成 HCP Packer |

<div v-click class="mt-6 text-center">

规则来自 HashiCorp **官方**沉淀（Style Guide、AVM、Test / Stacks 文档）——
让 agent 生成的 IaC **先天遵规范**，而非凭模型模糊记忆。Vault / Consul 等为未来产品。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #7B42BC 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
定位：HashiCorp 官方，当前只覆盖 Terraform 和 Packer。Terraform 侧写码/模块/provider/测试/策略，Packer 侧建镜像。规则是官方沉淀，目的是让生成的代码先天遵规范。
-->

---
transition: fade-out
---

# 安装：两条路

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**跨 agent（skills CLI）**

装进 Claude Code / Copilot / Cursor / opencode

```bash
# 列全部
npx skills add hashicorp/agent-skills

# 装单个
npx skills add hashicorp/agent-skills/\
terraform/code-generation/skills/\
terraform-style-guide
```

</div>
<div v-click>

**Claude Code 插件（marketplace）**

先加市场，再按需装插件

```bash
claude plugin marketplace add \
  hashicorp/agent-skills

claude plugin install \
  terraform-code-generation@hashicorp
# 或交互式：/plugin
```

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #7B42BC 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
两条安装路径：跨 agent 用 npx skills add 装进各种 agent；Claude Code 用 marketplace 加市场后按需装 6 个插件之一，也可用 /plugin 交互界面。
-->

---
transition: fade-out
---

# 6 个插件，约 17 个技能

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**Terraform（4 插件）**

- `terraform-code-generation` 写码 / 测试 / AVM / 纳管
- `terraform-module-generation` 重构 / Stacks
- `terraform-provider-development` 自建 provider
- `terraform-policy-code` 策略即代码

</div>
<div v-click>

**Packer（2 插件）**

- `packer-builders` AWS / Azure / Windows 建镜像
- `packer-hcp` 推元数据到 HCP Packer

</div>
</div>

<div v-click class="mt-4 text-center text-sm opacity-80">

结构：product → plugin（`plugin.json`）→ skill（每个一个 `SKILL.md`），遵 agentskills.io 格式。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #7B42BC 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
6 个插件：Terraform 4 个（代码生成、模块生成、provider 开发、策略），Packer 2 个（builders、hcp）。三层结构 product/plugin/skill，遵开放格式。
-->

---
transition: fade-out
---

# terraform-style-guide：灌官方风格

治「LLM 幻觉写 Terraform」最直接的一把

<div class="grid grid-cols-2 gap-4 mt-2">
<div v-click>

- **文件组织**：`terraform.tf` / `variables.tf`（字母序）/ `outputs.tf`
- **格式**：两空格、对齐等号、meta-arg 置顶
- **命名**：小写下划线、描述性名词
- **动态**：多实例 `for_each`，条件 `count`

</div>
<div v-click>

```hcl
terraform {
  required_version = ">= 1.14"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}
```

</div>
</div>

<div v-click class="mt-2 text-center text-sm opacity-80">

变量必带 `type` + `description`，输出必带 `description`，敏感值 `sensitive = true`；门禁 `fmt` + `validate`。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #7B42BC 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
style-guide 把官方 Style Guide 灌给 agent：文件组织、两空格缩进、命名、版本 pin、for_each 优先。变量必带 type/description，提交前 fmt + validate。
-->

---
transition: fade-out
---

# terraform-test：内置测试框架

在临时资源上验证，不碰生产状态

```hcl
run "test_default_configuration" {
  command = plan   # plan 只验逻辑 / apply 建真实资源

  assert {
    condition     = aws_instance.example.instance_type == "t2.micro"
    error_message = "Instance type should be t2.micro by default"
  }
}
```

<div v-click class="mt-3 text-sm">

`*_unit_test.tftest.hcl` 走 plan（快、不建资源）· `*_integration_test` 走 apply ·
`expect_failures` 验 `validation` · mock provider（1.7+）· 清理按 run 块**逆序**销毁。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #7B42BC 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
terraform-test 用 .tftest.hcl 在临时资源上验证。run 块一个场景、assert 断言、plan 或 apply 模式。单测走 plan、集成测走 apply，expect_failures 验校验规则，mock provider 免凭据。
-->

---
transition: fade-out
---

# AVM：Azure 模块认证 37 条

给需要 Azure Verified Modules 认证的模块

<v-clicks>

- **Provider**：只用 `azurerm`（4.x）/ `azapi`（2.x），`~>` 约束
- **命名**：locals / vars / outputs / 资源符号名全 `lower_snake_case`
- **变量**：必带精确 `type`、禁 `enabled` 整模块开关、集合 `nullable = false`、敏感输入不设默认
- **输出**：防腐层——输出离散计算属性，敏感必 `sensitive = true`
- **交叉引用**：只用 registry + pin 版本，禁 git、禁引非 AVM 模块

</v-clicks>

<div v-click class="mt-3 text-center text-sm opacity-80">

按 MUST / SHOULD / MAY 分级，共 3 功能 + 34 非功能 = 37 条要求。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #7B42BC 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
azure-verified-modules 是 AVM 认证的 37 条要求：provider 限 azurerm 4.x / azapi 2.x，全 snake_case，变量精确 type、禁整模块开关，输出用防腐层，交叉引用只用 registry pin 版本。
-->

---
transition: fade-out
---

# search-import：纳管存量资源

把手工建的云资源导入 Terraform（需 TF ≥ 1.14）

<div class="grid grid-cols-2 gap-4 mt-2">
<div v-click>

```hcl
# discovery.tfquery.hcl
list "aws_instance" "prod" {
  provider = aws
  config {
    filter {
      name   = "tag:Environment"
      values = ["production"]
    }
  }
}
```

</div>
<div v-click>

**流程**

1. 写 `.tfquery.hcl` 的 `list` 块
2. `terraform query` 发现
3. `-generate-config-out` 生成配置 + `import` 块
4. 清理 → `plan` / `apply`

</div>
</div>

<div v-click class="mt-2 text-center text-sm opacity-80">

生成的 `import` 用基于 identity 的导入（1.12+）；动手前跑 `list_resources.sh` 确认资源受支持。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #7B42BC 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
search-import 纳管存量资源：写 tfquery 的 list 块查询、terraform query 发现、generate-config-out 生成配置和 import 块、清理后 apply。用基于 identity 的导入，需 TF 1.14+ 和 provider list 支持。
-->

---
transition: fade-out
---

# refactor-module：单体配置重构成模块

系统化拆分 + 无损状态迁移

<div class="grid grid-cols-2 gap-4 mt-2">
<div v-click>

**该进模块**：紧耦合资源、共享生命周期、边界清晰

**该留外面**：横切关注点（监控 / 打标）、不同生命周期、provider 配置

</div>
<div v-click>

```hcl
# moved 块迁移状态（1.1+）
moved {
  from = aws_subnet.public_1
  to   = module.vpc.aws_subnet\
           .public["us-east-1a"]
}
```

</div>
</div>

<div v-click class="mt-2 text-sm">

坑：**过度抽象**（`map(map(any))` → 用具体 `object`）· **紧耦合**（经根模块传依赖）· 迁移后 `plan` 须 **0 变更**再 apply。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #7B42BC 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
refactor-module 把单体配置拆成模块：紧耦合资源进模块、横切关注点留外面。状态迁移优先用 moved 块无损迁移。坑是过度抽象和紧耦合，迁移后 plan 必须 0 变更。
-->

---
transition: fade-out
---

# terraform-stacks：规模化编排

模块之上的编排层，独立 Stack 语言（CLI 1.13+）

<div class="grid grid-cols-2 gap-4 mt-2">
<div v-click>

**两类文件 / 三个概念**

- `.tfcomponent.hcl` 组件配置
- `.tfdeploy.hcl` 部署配置
- **Component** 对模块的抽象
- **Deployment** 组件实例（每 Stack 1–20）

</div>
<div v-click>

```hcl
component "vpc" {
  source  = "app.terraform.io/\
             my-org/vpc/aws"
  version = "2.1.0"
  inputs  = { cidr_block = var.cidr }
  providers = { aws = provider.aws.this }
}
```

</div>
</div>

<div v-click class="mt-2 text-sm">

依赖自动推断 · provider 支持 `for_each` · 认证首选 OIDC（凭据 `ephemeral = true`）· CLI **无 plan/apply**，`configuration upload` 触发部署。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #7B42BC 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
terraform-stacks 是模块之上的编排层，用独立 Stack 语言：tfcomponent 和 tfdeploy 两类文件，Component 和 Deployment 两个核心概念。依赖自动推断，认证用 OIDC，CLI 没有 plan/apply，upload 配置触发部署。
-->

---
transition: fade-out
---

# provider 开发 & 策略即代码

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**terraform-provider-development**（6 skill）

- `new-terraform-provider` Plugin Framework 脚手架
- `provider-resources` CRUD 资源 / 数据源
- `provider-actions` 生命周期动作
- `provider-docs` / `run-acceptance-tests` / `provider-test-patterns`

</div>
<div v-click>

**terraform-policy-code**

- 从自然语言 / Sentinel 写 `.policy.hcl`
- 写 `.policytest.hcl` 测试 + 资源 mock
- 转 Sentinel 策略到 Terraform Policy

面向 HCP Terraform 原生策略引擎

</div>
</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #7B42BC 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
provider-development 有 6 个技能：脚手架、资源、动作、文档、验收测试、测试范式，用 Go 和 Plugin Framework。policy-code 为 HCP Terraform 原生策略引擎写 policy.hcl 和测试，还能转 Sentinel。
-->

---
transition: fade-out
---

# Packer builders：AWS / Azure / Windows

跨云建机器镜像

| builder | 引擎 | 要点 |
| --- | --- | --- |
| `aws-ami-builder` | `amazon-ebs` | source_ami_filter、`ami_regions` 多区复制 |
| `azure-image-builder` | `azure-arm` | 托管镜像 / Compute Gallery、需 4 项凭据 |
| `windows-builder` | 跨平台 | WinRM 通信 + PowerShell provisioner |

<div v-click class="mt-4 text-center text-sm opacity-80">

命令 `packer init` / `validate` / `build`。有真实云成本与耗时——
AMI 约 10–30 min、Azure 15–45 min、Windows 45–120 min。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #7B42BC 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Packer builders 三个：aws-ami-builder 用 amazon-ebs、azure-image-builder 用 azure-arm、windows-builder 跨平台用 WinRM 加 PowerShell。命令 init/validate/build，注意真实云成本和耗时。
-->

---
transition: fade-out
---

# push-to-registry：推元数据到 HCP Packer

在 `build` 里加 `hcp_packer_registry` 块

```hcl
hcp_packer_registry {
  bucket_name = var.image_name        # 必填，跨构建须一致
  description = "Ubuntu 22.04 base image"
  bucket_labels = { os = "ubuntu", team = "platform" }  # 桶级，可更新
  build_labels  = { build-time = local.timestamp }      # 迭代级，不可变
}
```

<div v-click class="mt-3 text-sm">

认证用 HCP 服务主体（`HCP_CLIENT_ID` / `SECRET` / `ORG_ID` / `PROJECT_ID`）· 推的是**元数据非镜像** ·
Terraform 里用 `data.hcp_packer_artifact` 按 channel 查最新镜像。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #7B42BC 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
push-to-registry 在 build 块加 hcp_packer_registry：bucket_name 必填且跨构建一致，bucket_labels 可更新、build_labels 不可变。认证用 HCP 服务主体，推的是元数据不是镜像，Terraform 里用 data 源按 channel 查最新镜像。
-->

---
transition: fade-out
---

# 反模式：为什么 LLM 裸写 Terraform 危险

这套技能存在的理由

<v-clicks>

- **编造属性 / 过时语法**：LLM 凭记忆写常幻觉不存在的参数 → `style-guide` / AVM 从源头约束
- **坏配置上生产**：→ `terraform-test` 在临时资源 / mock 上验证，plan 阶段暴露
- **不合规、难编译**：→ 始终 `fmt` + `validate`（+ `tflint` / `checkov`）门禁
- **删了重建误伤**：→ 存量用 `search-import` 导入、重构用 `moved` 迁移

</v-clicks>

<div v-click class="mt-3 text-center">

**技能给的是官方约束 + 验证闭环**——从「凭感觉写」到「按规范写、用测试证」。

</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #7B42BC 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
反模式是这套技能的价值所在：LLM 裸写 Terraform 会编造属性、用过时语法、坏配置上生产、删了重建。技能对症下药：style-guide 约束生成、test 兜底验证、fmt/validate 门禁、search-import 和 moved 避免误伤。
-->

---
layout: center
class: text-center
---

# 一句话记住

**HashiCorp 官方技能集：Terraform（style-guide / test / AVM / search-import / refactor / stacks / provider / policy）+ Packer（AWS / Azure / Windows builder + HCP 推送），给 LLM 灌官方约束治幻觉写 IaC。**

<div class="mt-8 opacity-80">

官方权威 · Terraform + Packer · 6 插件 · 约束 + 验证闭环 · MPL-2.0

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/hashicorp/agent-skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://developer.hashicorp.com/terraform" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #000000 10%, #7B42BC 90%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。HashiCorp 官方技能集覆盖 Terraform 全生命周期和 Packer 建镜像，6 个插件，核心价值是给 LLM 灌官方约束加验证闭环，治幻觉写 IaC，MPL-2.0 开源。
-->
