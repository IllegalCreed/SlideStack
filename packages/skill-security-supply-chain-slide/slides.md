---
theme: seriph
background: https://cover.sli.dev
title: Skill 安全与供应链治理
info: |
  方法论/主题叶——SKILL.md 作为攻击面的安全治理。
  以 Trail of Bits 安全研究 + trailofbits/skills 为代表锚定，生态另有 agent-skillguard 等。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Skill 安全与供应链治理

把 SKILL.md 当作**攻击面**——纵深防御、不止扫描

<div class="pt-6 opacity-80">
方法论叶 · 以 Trail of Bits 研究为代表锚定 · CC-BY-SA-4.0 · 含 agent-skillguard 等生态
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/trailofbits/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<style>
h1 { background: linear-gradient(45deg, #b91c1c 10%, #7f1d1d 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
这是方法论叶——把 agent skill / SKILL.md 作为攻击面来讲安全治理。以 Trail of Bits 安全研究为核心一手，以其 trailofbits/skills 内相关 skill 为代表锚定，生态另有 agent-skillguard 等第三方工具。
-->

---
transition: fade-out
---

# 这是方法论叶，不是某个仓

<v-clicks>

- **定位**：SKILL.md / agent skill 作为**攻击面**的安全治理
- **代表锚定**：Trail of Bits 安全研究 + `trailofbits/skills`（CC-BY-SA-4.0）
- **生态工具**：`agent-skillguard`、Repello 审计方法论等
- **核心素材**：Trail of Bits「The Sorry State of Skill Distribution」(2026-06-03)

</v-clicks>

<div v-click class="mt-6 p-4 border border-red-200 rounded opacity-90">

**不要把它当作某个单一官方 skill 框架**——是一组研究、准则、工具、方法论围绕「skill 安全」聚合而成。

</div>

<style>
h1 { background: linear-gradient(45deg, #b91c1c 10%, #7f1d1d 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
先澄清定位。这不是某个仓的速查页，是方法论叶。以 Trail of Bits 安全研究为核心一手，以 trailofbits/skills 内相关 skill 为代表锚定，生态另有 agent-skillguard 等第三方。
-->

---
transition: fade-out
---

# 两大攻击面

SKILL.md 是会被 agent **加载并执行**的内容

<div class="grid grid-cols-2 gap-6 mt-4">
<div v-click>

**Prompt injection**

- skill 正文 / references / scripts 藏恶意指令
- 被调用时获得 agent 权限
- 读代码、写文件、调网络

</div>
<div v-click>

**声明 vs 行为漂移**

- SKILL.md 声明 A，实际做 B
- 声明「格式化」实际外发 `.env`
- 声明「lint」实际改 `authorized_keys`

</div>
</div>

<div v-click class="mt-6 text-center text-sm opacity-80">

与 npm/PyPI 供应链同构——但**自然语言指令更难被静态扫描器识别**。

</div>

<style>
h1 { background: linear-gradient(45deg, #b91c1c 10%, #7f1d1d 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
两大攻击面：prompt injection 和声明/行为漂移。前者藏在 skill 里被调用时获得 agent 权限；后者声明一套实际做另一套。比 npm 供应链更隐蔽，因为自然语言指令不容易被静态扫描器判定为恶意。
-->

---
transition: fade-out
---

# Trail of Bits：4 恶意 skill 绕过所有扫描器

「The Sorry State of Skill Distribution」(2026-06-03)

<div v-click>

```text
研究者造了 4 个明恶意 agent skill
   ↓
绕过所有测试的 skill 扫描器
   ├── ClawHub 恶意 skill 检测器
   ├── Cisco agent skill 扫描器
   └── 其他公共扫描器
   ↓
结论：自动扫描 ≠ 安全
```

</div>

<div v-click class="mt-6 p-4 border border-red-200 rounded">

**核心教训**：需 **sandboxing + 运行时行为监控 + 人工审查** 的纵深组合，不能只靠自动化扫描器。

</div>

<style>
h1 { background: linear-gradient(45deg, #b91c1c 10%, #7f1d1d 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Trail of Bits 2026 年 6 月的研究：造了 4 个明恶意 skill，全部绕过测试的扫描器，包括 ClawHub 和 Cisco 的。结论是自动扫描不够，需要沙箱、行为监控、人工审查的纵深组合。
-->

---
transition: fade-out
---

# 防御纵深四层

不止一层——从安装前到运行时

| 层 | 干什么 | 工具 |
| --- | --- | --- |
| **① 安装前** | 读 SKILL.md + 列文件 + 查脚本 | Repello 方法论（人工） |
| **② 行为对比** | 跑起来对比声明 vs 观测 | `agent-skillguard` |
| **③ 运行时沙箱** | 最小权限 allowlist | `seatbelt-sandboxer`（macOS） |
| **④ CI/CD + 依赖** | 审 AI action、评依赖风险 | `agentic-actions-auditor` / `supply-chain-risk-auditor` |

<div v-click class="mt-4 text-center text-sm opacity-80">

每层都不可省——任一单点都被研究证可绕过。

</div>

<style>
h1 { background: linear-gradient(45deg, #b91c1c 10%, #7f1d1d 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
防御分四层：安装前人工审计、行为对比、运行时沙箱、CI/CD 与依赖审计。每层都有专门工具，纵深而非单点。
-->

---
transition: fade-out
---

# CI/CD prompt injection：9 类向量

`agentic-actions-auditor` 重点查

<div class="grid grid-cols-2 gap-4 mt-2 text-sm">
<div>

- **A** Env Var Intermediary
- **B** Direct Expression Injection
- **C** CLI Data Fetch（`gh pr view`）
- **D** PR Target + Checkout
- **E** Error Log Injection

</div>
<div>

- **F** Subshell Expansion（`$()`）
- **G** Eval of AI Output
- **H** Dangerous Sandbox Configs
- **I** Wildcard Allowlists

</div>
</div>

<div v-click class="mt-4 p-3 border border-amber-200 rounded text-sm">

**四种「自我安慰」要拒绝**：① 只跑维护者 PR ② allowed_tools 限了就安全 ③ prompt 没 `${{ }}` 就安全 ④ 沙箱防得住——**全部错**。

</div>

<style>
h1 { background: linear-gradient(45deg, #b91c1c 10%, #7f1d1d 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
agentic-actions-auditor 查 9 类攻击向量：env 中介、直插、CLI fetch、PR target、日志注入、subshell、eval、危险沙箱、通配 allowlist。最后两类是放大器，与前面叠加放大严重度。四种自我安慰都要拒绝。
-->

---
transition: fade-out
---

# 依赖风险准则

`supply-chain-risk-auditor` 按这些标红

<v-clicks>

- **Single maintainer / 个人**——非组织维护（参考 **left-pad**）
- **匿名维护者**——GitHub 身份无法对应真实人，风险显著更大
- **Unmaintained**——长期不更新、已 archive、声明 inactive
- **Low popularity**——Star / 下载显著低于同类
- **High-risk features**——FFI / 反序列化 / 三方代码执行
- **Past CVEs**——高/危 CVE 多（相对流行度）
- **缺 security contact**——`.github/SECURITY.md` 等均无联系方式

</v-clicks>

<div v-click class="mt-4 text-center text-sm opacity-80">

只记**有风险因子**的依赖；feature request 类 issue **不算**未响应。

</div>

<style>
h1 { background: linear-gradient(45deg, #b91c1c 10%, #7f1d1d 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
supply-chain-risk-auditor 按这 7 条准则给依赖标红：single maintainer、匿名、unmaintained、low popularity、高危特性、past CVE、缺 security contact。只记有风险的；不在报告里就是低风险。
-->

---
transition: fade-out
---

# 运行时沙箱：allowlist 而非 denylist

`seatbelt-sandboxer`（macOS）

<div v-click>

```text
(version 1)
(deny default)
;; 从拒绝一切开始，按需 allow
(allow process-fork)
(allow file-read-data
   (subpath "/Users/me/project"))
;; (allow network-outbound ...)  按需开
```

</div>

<div v-click class="mt-4 text-sm">

- **从 deny default 开始**，按需 allow
- **资源分类**：File Read/Write、Network、Process、Mach IPC、IOKit……
- **多子命令**（如 build / serve）分别建 profile，helper 路由

</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

`danger-full-access` / `Bash(*)` / `--yolo` 等于没沙箱。Linux 用 seccomp / AppArmor。

</div>

<style>
h1 { background: linear-gradient(45deg, #b91c1c 10%, #7f1d1d 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
seatbelt-sandboxer 生成最小权限 allowlist 沙箱：从 deny default 开始按需 allow。多子命令的 app 分别建 profile。danger-full-access 这种通配放行等于没沙箱。Linux 上用 seccomp-bpf、AppArmor、namespaces。
-->

---
transition: fade-out
---

# 反模式：不要这么做

<v-clicks>

- **只信自动扫描器**——4 恶意 skill 已证可被绕过
- **只读 SKILL.md 不跑行为对比**——漂移读不出来
- **sandbox 配 `danger-full-access` / `Bash(*)`**——等于没沙箱
- **`allowed_tools` 限制即心安**——`echo $(env)` 即可外泄
- **「prompt 没 `${{ }}` 就安全」**——env 中介骗肉眼
- **「只在维护者 PR 上跑」**——`pull_request_target` 任意外部 PR 可触发
- **`pull_request_target` + checkout PR head**——经典 RCE 路径

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #b91c1c 10%, #7f1d1d 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
反模式汇总：只信扫描器、不跑行为对比、通配放行沙箱、allowed_tools 心安、prompt 没 mustache 就安全、只跑维护者 PR、PR target + checkout PR head——全部错。
-->

---
transition: fade-out
---

# 边界与替代

<v-clicks>

- **macOS 限定**：`seatbelt-sandboxer` 仅 macOS；Linux 用 seccomp-bpf / AppArmor / namespaces
- **CI/CD 限定**：`agentic-actions-auditor` 只覆盖 GitHub Actions；Jenkins / GitLab CI / CircleCI 不管
- **静态非动态**：相关 skill 是静态审计指导，**不做** runtime prompt injection 渗透
- **依赖审计非漏洞扫描**：评「被接管/利用的风险」，不是 `npm audit` 的已知 CVE 列表
- **方法论叶**：以 Trail of Bits 研究为代表锚定，生态另有 `agent-skillguard` 等——**不是某个单一官方仓**

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #b91c1c 10%, #7f1d1d 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
边界：seatbelt 仅 macOS；agentic-actions-auditor 仅 GitHub Actions；静态分析非动态利用；依赖风险非 CVE 扫描；整体是方法论叶，以 Trail of Bits 研究为代表锚定。
-->

---
layout: center
class: text-center
---

# 一句话记住

**SKILL.md 是攻击面——Trail of Bits 4 恶意 skill 绕过所有扫描器证明「自动扫描不够」。需四层纵深：安装前人工审计 → 行为对比（agent-skillguard）→ 运行时沙箱（seatbelt）→ CI/CD + 依赖审计。**

<div class="mt-8 opacity-80">

方法论叶 · 以 Trail of Bits 研究为代表锚定 · 不能只靠自动化扫描器

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/trailofbits/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #b91c1c 10%, #7f1d1d 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。SKILL.md 是攻击面；Trail of Bits 4 恶意 skill 绕过所有扫描器证明自动扫描不够；需四层纵深——安装前人工审计、行为对比、运行时沙箱、CI/CD 与依赖审计。
-->
