---
theme: seriph
background: https://cover.sli.dev
title: Trail of Bits Skills
info: |
  Trail of Bits 官方 Claude Code plugin marketplace。
  40 plugin / 75 skill · 智能合约 / 模糊测试 / 密码学 / 代码审计 · CC-BY-SA-4.0。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Trail of Bits Skills

Trail of Bits 官方安全审计 agent skill 集——**40 plugin / 75 skill**

<div class="pt-6 opacity-80">
智能合约 · 模糊测试 · 密码学 · 代码审计 · CC-BY-SA-4.0 · Codex 兼容
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/trailofbits/skills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Trail of Bits 是 2002 年成立的安全公司，专精密码学/区块链/代码审计。这个仓库是它官方的 Claude Code plugin marketplace，把审计方法论、Testing Handbook 封装成 skill。
-->

---
transition: fade-out
---

# 是什么 · 多少 · 什么许可

<v-clicks>

- **出品**：Trail of Bits（美国安全公司，2002 至今）
- **形态**：Claude Code plugin marketplace（**Codex 原生兼容**）
- **规模**：**40 plugin / 75 skill**（网搜常低估为 35+，实际 75）
- **许可**：**CC-BY-SA-4.0**（copyleft——署名 + 同样许可）
- **定位**：业界称其为安全 agent skill 的「**gold standard**」

</v-clicks>

<div v-click class="mt-6 text-center text-sm opacity-80">

装：`/plugin marketplace add trailofbits/skills` → `/plugin menu`

</div>

<style>
h1 { background: linear-gradient(45deg, #8B0000 10%, #2C2C2C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
40 plugin 75 skill，CC-BY-SA-4.0 copyleft，Codex 原生兼容。网搜常低估数量。
-->

---
transition: fade-out
---

# 75 skill · 8 大类

<div class="grid grid-cols-2 gap-4 mt-2 text-sm">

<div>

**安全审计核心**

- 智能合约（13）
- 模糊测试（15）
- 密码学 / 代码图（13）
- 代码审计（11）

</div>
<div>

**配套与工程**

- 规则与模式（4）
- 安全扫描（2）
- agent / 供应链（4）
- 工程 / 团队 / 工具（11）

</div>
</div>

<div v-click class="mt-4 text-center">

代表 plugin：**building-secure-contracts**（11 skill · 6 链）· **testing-handbook-skills**（15 skill）· **trailmark**（10 skill）· **c-review** · **rust-review**

</div>

<style>
h1 { background: linear-gradient(45deg, #8B0000 10%, #2C2C2C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
8 大类。前三类（智能合约、模糊测试、密码学/代码图、代码审计）是审计核心，覆盖 52 skill。
-->

---
transition: fade-out
---

# 智能合约：6 链漏洞扫描

building-secure-contracts（11 skill）

<div class="grid grid-cols-3 gap-3 mt-3 text-sm">

<div>

**Vulnerability Scanner**

- Algorand
- Cairo（Starknet）
- Cosmos

</div>
<div>

- Solana（Anchor）
- Substrate（Polkadot）
- TON（FunC/Tact）

</div>
<div>

**辅助**

- audit-prep-assistant
- code-maturity-assessor
- guidelines-advisor
- secure-workflow-guide
- token-integration-analyzer

</div>
</div>

<div v-click class="mt-3 text-center text-sm opacity-80">

`audit-prep-assistant` 按 Trail of Bits 检查表准备审计——**审计前 1-2 周**用。

</div>

<style>
h1 { background: linear-gradient(45deg, #8B0000 10%, #2C2C2C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
6 链各一个 vulnerability-scanner：Algorand/Cairo/Cosmos/Solana/Substrate/TON。
-->

---
transition: fade-out
---

# 模糊测试：15 skill 全栈

testing-handbook-skills · 来自 [Testing Handbook](https://appsec.guide)

| 类型 | skill |
| --- | --- |
| 覆盖引导 | libfuzzer · aflpp · libafl · ruzzy · atheris · cargo-fuzz |
| 平台 | ossfuzz |
| 密码学 | wycheproof · constant-time-testing |
| 配套 | harness-writing · fuzzing-dictionary · fuzzing-obstacles · coverage-analysis · address-sanitizer |
| 生成器 | testing-handbook-generator |

<div v-click class="mt-3 text-center text-sm">

libFuzzer 2022 底进维护模式，但仍是 C/C++ 起步首选；harness 与 AFL++ 兼容可迁移。

</div>

<style>
h1 { background: linear-gradient(45deg, #8B0000 10%, #2C2C2C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
15 skill 覆盖主流模糊器与配套。libFuzzer 维护模式但仍是首选。
-->

---
transition: fade-out
---

# 密码学 / 代码图：trailmark + 三件套

10 skill 把源码解析为多语言代码图

<v-clicks>

- `trailmark`——主 skill，代码图 + 爆炸半径 / 污点 / 权限边界 / 入口点
- `crypto-protocol-diagram` · `mermaid-to-proverif`（Mermaid → ProVerif 协议验证）
- `audit-augmentation`（LLM 推断注释）· `genotoxic`（突变测试 triage）

</v-clicks>

<div v-click class="mt-4 text-center">

配套：**constant-time-analysis** 已发现 RustCrypto ML-DSA 时序侧信道真实 bug · **zeroize-audit** 检查密钥零化

</div>

<style>
h1 { background: linear-gradient(45deg, #8B0000 10%, #2C2C2C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
trailmark 10 skill + constant-time-analysis + zeroize-audit。constant-time-analysis 已发现真实 bug：RustCrypto ML-DSA 签名 PR #1144。
-->

---
transition: fade-out
---

# 代码审计：c-review 多 agent 编排

C/C++ 安全审计 · 三段流水线

| 子 agent | 职责 |
| --- | --- |
| `c-review-worker` | 跑分配代码簇、产 finding |
| `c-review-dedup-judge` | 合并重复（最先跑） |
| `c-review-fp-judge` | 误报核查 + 严重度 + 最终报告 |

<div v-click class="mt-3 text-sm">

覆盖：内存安全 · 整数溢出 · 竞态 · 类型混淆 · 守护进程 · Windows 用户态服务。**不**适用：内核驱动、Java/Go/Python/Rust（用 rust-review）。

</div>

<div v-click class="mt-3 text-center">

配套：`rust-review` · `fp-check` · `sharp-edges` · `insecure-defaults` · `differential-review`

</div>

<style>
h1 { background: linear-gradient(45deg, #8B0000 10%, #2C2C2C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
c-review 三段编排：worker 跑簇、dedup-judge 合并、fp-judge 核查。fp-check 强制误报核查是必经门。
-->

---
transition: fade-out
---

# 规则 / 扫描 / agent · 供应链

<v-clicks>

- **Semgrep 规则**：`semgrep-rule-creator` + `semgrep-rule-variant-creator`（跨语言移植）+ `variant-analysis`（找同类漏洞）
- **YARA**：`yara-authoring`（检测规则 + lint + atom 分析）
- **扫描**：`burpsuite-project-parser`（Burp Suite）· `firebase-apk-scanner`（Android APK）
- **agent**：`agentic-actions-auditor`（GitHub Actions AI agent 漏洞）
- **供应链**：`supply-chain-risk-auditor`（依赖威胁）
- **交叉评审**：`second-opinion`（调 Codex / Gemini CLI）

</v-clicks>

<div v-click class="mt-3 text-center text-sm opacity-80">

Semgrep 规则的反模式：「pattern 看着对」→ 必须 `semgrep --test` 验证。

</div>

<style>
h1 { background: linear-gradient(45deg, #8B0000 10%, #2C2C2C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
规则与扫描这一组——semgrep 三件套 + YARA + Burp/Firebase + agent/供应链审计。
-->

---
transition: fade-out
---

# 安全审计工作流（推荐顺序）

```text
1. audit-prep-assistant    # 准备：目标 / 静态分析 / 覆盖率 / 死代码 / 文档
2. trailmark               # 代码图：爆炸半径 / 入口点 / 攻击面
3. static-analysis         # CodeQL / Semgrep / SARIF 第一遍
4. c-review / rust-review  # 多 worker 并行深度审计
5. fp-check                # 强制误报核查 + gate review
6. variant-analysis        # 用已确认漏洞找同类
7. mutation-testing        # 验证测试质量
8. 报告
```

<div v-click class="mt-3 text-center text-sm">

反模式：跳过 fp-check · 智能合约扫描不带业务上下文 · 把 CC-BY-SA-4.0 当 MIT 用

</div>

<style>
h1 { background: linear-gradient(45deg, #8B0000 10%, #2C2C2C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
推荐工作流：准备 → 代码图 → 静态分析 → 深度审计 → 误报核查 → 变体分析 → 突变测试 → 报告。
-->

---
transition: fade-out
---

# 边界与许可

<v-clicks>

- **CC-BY-SA-4.0 是 copyleft**：署名 + 同样许可；商业闭源分发需法务评估；**非 MIT/Apache**
- **Codex 兼容**：`codex plugin marketplace add trailofbits/skills`
- **不替代人工审计**：skill 是审计师助手；finding 须经 fp-check 把关
- **外部工具链依赖**：libFuzzer / AFL++ / Semgrep / CodeQL / ProVerif / YARA 需本机装好
- **c-review / rust-review 多 agent 编排**：调用成本较高
- **Trophy Case 公开**：RustCrypto ML-DSA 时序侧信道（PR #1144）等

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #8B0000 10%, #2C2C2C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
关键边界：CC-BY-SA-4.0 copyleft（非 MIT）、Codex 兼容、不替代人工、外部工具链依赖。
-->

---
layout: center
class: text-center
---

# 一句话记住

**Trail of Bits 官方安全 agent skill 集——40 plugin / 75 skill，覆盖智能合约 6 链 + 模糊测试全栈 + 密码学/代码图 + 多 agent C/Rust 审计；CC-BY-SA-4.0 copyleft，Codex 兼容。**

<div class="mt-8 opacity-80">

官方沉淀 · 多链扫描 · 多 agent 编排 · fp-check 把关 · Codex 兼容

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://github.com/trailofbits/skills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://appsec.guide" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #8B0000 10%, #2C2C2C 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。一句话：官方安全 agent skill 集，40 plugin / 75 skill，覆盖智能合约、模糊测试、密码学、代码审计；CC-BY-SA-4.0 copyleft，Codex 兼容。
-->
