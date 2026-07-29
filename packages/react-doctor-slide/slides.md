---
theme: seriph
background: https://cover.sli.dev
title: react-doctor 完全指南
info: |
  react-doctor 完全指南：React 代码体检 · 0-100 健康分 · 60+ 规则 · AI 辅助修复

  Learn more at https://www.react.doctor/
drawings:
  persist: false
transition: slide-left
mdc: true
---

# react-doctor 完全指南

Million.js 团队出品 · React 代码体检 · 0–100 健康分 · 0.9.2

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
react-doctor 是 Million.js 团队 2026 年推出的 React 代码体检 CLI，tagline「Your agent writes bad React. This catches it.」。
-->

---
transition: fade-out
---

# 什么是 react-doctor

Million.js 团队出品的 **React 代码体检 CLI**

- **AI 时代定位**：tagline「Your agent writes bad React. This catches it.」
- **0–100 健康分**：75+ Great / 50–74 Needs work / <50 Critical
- **60+ 规则**：覆盖 React 特定反模式
- **双趟分析**：Lint Analysis + Dead Code Detection
- **框架自动探测**：Next.js / Vite / Remix / RN 自动开关规则集
- **AI agent 集成**：给 Claude Code / Cursor / Codex 装 skill

> react-doctor ≠ ESLint 替代品。**互补共存**才是正确姿势。

<!--
强调它专治 AI agent 写出的坏 React，不是通用 linter。
-->

---

# 健康分机制

**0–100 健康分**由双趟分析汇总得出

| 分数区间 | 等级 | 含义 |
|------|------|------|
| **75–100** | Great | 健康，可继续迭代 |
| **50–74** | Needs work | 有问题，应排期整改 |
| **0–49** | Critical | 严重，应优先处理 |

**评分流程**：双趟分析 → 配置过滤 → severity 加权 → 0–100 数字分

> 评分本就偏严——tldraw / excalidraw 这类高质量项目也只 84 分，**84+ 已属优秀**。

<!--
别把 100 当 KPI，强行追求满分会逼出奇怪的 suppression。
-->

---
layout: two-cols
---

# 双趟分析

**第一趟 · Lint Analysis**

- 跑 60+ 条 React 专属规则
- 五大主类 + 框架特定
- 抓反模式（key / danger / 依赖漏项）

**第二趟 · Dead Code Detection**

- unused files（未引用文件）
- unused exports（未使用导出）
- unused types（未使用类型）
- duplicates（重复代码）

::right::

# 关键限制

**partial / staged 跳过 dead code**

- `--diff main` 属 partial
- `--scope changed` 属 partial
- `--staged` 属 partial

**重度死代码治理仍以 Knip 为准**

> react-doctor 的 deadCode 定位是**体检辅能力**，不是专精工具。

<!--
记住：CI 里用 --diff 时 dead code 趟会跳过，别指望它做完整死代码治理。
-->

---

# 五大规则主类

| 类别 | 关注 | 典型规则 |
|------|------|------|
| **State & Effects** | hooks / 依赖数组 / effect | useEffect 依赖漏项 |
| **Performance** | 重渲染 / memo 缺失 | 子组件无 memo |
| **Architecture** | 组件边界 / 状态层级 | `no-derived-state` |
| **Security** | React 特定安全 | `no-danger` |
| **Accessibility** | jsx-a11y 系列 | `jsx-a11y/no-autofocus` |

附加类：**Bundle Size** / **Correctness**（`no-array-index-as-key`）/ 框架特定（Next.js / RN 自动开关）

> 框架特定规则**自动探测**，无需手动配插件。

<!--
jsx-a11y 与 eslint-plugin-jsx-a11y 同源，规则名共享 jsx-a11y/ 前缀。
-->

---
layout: two-cols
---

# 典型规则反模式

**Correctness**

- 数组下标当 key
  → `no-array-index-as-key`

**Security**

- 滥用 `dangerouslySetInnerHTML`
  → `no-danger`

**State & Effects**

- useEffect 依赖数组漏项
- 缺少 cleanup

::right::

# Architecture & A11y

**Architecture**

- 派生 state
  → `no-derived-state`

**Accessibility**

- autofocus
  → `jsx-a11y/no-autofocus`

> 这些都是 AI agent **反复生成**的同类错误——react-doctor 专门捕获它们。

<!--
react-doctor 的规则设计直击 AI agent 的反模式盲区。
-->

---

# CLI 速跑

```bash
# 零配置扫当前目录（自动探测框架）
npx react-doctor@latest
npx -y react-doctor@latest .

# 仅输出数字健康分（接 dashboard）
npx react-doctor@latest --score

# 输出文件名 + 行号（默认汇总不含位置）
npx react-doctor@latest --verbose

# CI 只扫变更（避免被历史债淹没）
npx react-doctor@latest --diff main
npx react-doctor@latest --scope changed

# 结构化输出
npx react-doctor@latest --json > report.json
```

> 本地定位修问题**必须加 `--verbose`**——默认汇总不含位置。

<!--
--diff 是 CI 防回归的核心 flag，只对新增问题负责。
-->

---

# CLI flag 全清单

| flag | 作用 |
|------|------|
| `--verbose` | 输出文件名 + 行号 |
| `--diff <branch>` | 与分支对比，只扫变更 |
| `--scope changed` | 只扫改动文件 |
| `--staged` | 只扫 `git add` 过的（pre-commit） |
| `--score` | 仅输出数字健康分 |
| `--json` | 结构化 JSON 输出 |
| `--category <cat>` | 仅跑指定分类（可重复） |
| `--blocking <error\|warning\|none>` | 退出码门禁级别 |
| `-y` | CI 非交互 |
| `--no-telemetry` | 关闭 Sentry 遥测 |

> Telemetry 默认上报 Sentry（**不含源码与具体发现**），可关闭。

<!--
--blocking error 会让 CI 失败，PR 接入应从 advisory 起步。
-->

---

# 子命令一览

| 子命令 | 作用 |
|------|------|
| `install` | 给 AI agent 装 skill（47+ 规则预防） |
| `ci install` | 一键装 GitHub Action |
| `ci config` | 调整 gate / scope / 评论 |
| `ci upgrade` | 升级 action 版本 |
| `rules disable <rule>` | 关闭规则（写回配置） |
| `rules set <rule> warn\|error\|off` | 调 severity |
| `rules category <Cat> <sev>` | 整类调 severity |
| `rules ignore-tag <tag>` | 按 tag 关（lint 前禁用） |
| `why <file:line>` | 调试 suppression 是否生效 |

> GitLab CI 仅 gate-only scaffold；**GitHub Actions 是唯一一等公民**。

<!--
why 是调试 inline disable 没生效的关键工具。
-->

---

# 配置文件

`doctor.config.ts` 用 `defineConfig` 定义：

```text
// doctor.config.ts
import { defineConfig } from "react-doctor";

export default defineConfig({
  ignore: { rules: [], files: [], tags: [], overrides: [] },
  rules: { "react-doctor/no-danger": "error" },
  categories: { accessibility: "error" },
  deadCode: { enabled: true },
  adoptExistingLintConfig: true,   // 默认 true
  projects: ["packages/*"],        // monorepo 分包打分
  surfaces: [],
});
```

**优先级**：CLI flag > 本地配置 > 祖先配置；per-rule > categories

<!--
adoptExistingLintConfig 默认 true 会自动继承你的 ESLint/oxlint 配置，避免重复。
-->

---

# GitHub Action 集成

`.github/workflows/react-doctor.yml`：

```text
name: react-doctor
on: [pull_request]
jobs:
  react-doctor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: millionco/react-doctor@main
        with:
          diff: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

**PR 行为**：自动评论健康分 + 新增诊断；`score` 可作门禁

<!--
fetch-depth: 0 是 diff 模式必需的，否则没有完整历史。
-->

---

# AI agent skill 闭环

`install` 子命令为各 AI agent 装上 47+ React 最佳实践

**支持的 agent**：Claude Code / Cursor / Codex / Windsurf / Copilot / Zed / Cline / Goose

**标准闭环工作流**：

1. 扫描 → `--verbose` 拿诊断
2. 优先修 error → 按 severity 排序
3. 复扫验证提分 → `--score` 确认

> 治本之道是**教 agent 学会预防**，而非反复生成同类错误。

<!--
Ami agent + --fix 是实验性自动修复代理，按诊断逐条修并提分。
-->

---
layout: quote
---

# 别当 ESLint 替代品

「react-doctor 是 ESLint 的**补充**——通用 JS / TS lint 仍归 ESLint，react-doctor 补的是 React 特定反模式 + 0–100 评分 + 死代码 + 供应链 + AI agent 集成。」

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 当 ESLint 替代品（应互补共存）
- 全局 `ignore.rules` 关规则（仍跑、浪费 CPU）
- 把 100 当 KPI（连顶级项目也只 80+）
- PR 直接开 `--blocking error` 全量门禁
- 用 `deadCode` 完全替代 Knip
- 忽视 License（Modified MIT，AI 训练需书面许可）

<!--
PR 接入应从 advisory 起步，团队熟悉后再收紧门禁。
-->

---
layout: center
class: text-center
---

# 小结

react-doctor = AI 时代的 React 代码体检尺

60+ 规则 · 0–100 健康分 · 双趟分析 · AI agent skill

**`--verbose` 定位 · `--diff main` 防 PR 回归 · skill 教 agent 预防**

[官网](https://www.react.doctor/) · [文档](https://millionco-react-doctor-36.mintlify.app/introduction) · [GitHub](https://github.com/millionco/react-doctor)

<!--
掌握按 severity 定优先级 + AI agent skill 闭环，就能把 react-doctor 用到生产水准。
-->
