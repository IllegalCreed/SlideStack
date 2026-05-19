---
theme: seriph
background: https://cover.sli.dev
title: Superpowers
info: |
  Presentation Superpowers for Claude Code skills framework.

  Learn more at [github.com/obra/superpowers](https://github.com/obra/superpowers)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <carbon:flash class="text-7xl" />
</div>

<br/>

## Superpowers：把工程方法论塞进 AI 协作

可组合 skill 框架，自动触发 brainstorming / TDD / 调试 / 验证全流程

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/obra/superpowers" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Superpowers。

由 Jesse Vincent（Prime Radiant）维护的 Claude Code skills 框架。把软件工程最佳实践沉淀成自动触发的 skill。
-->

---
transition: fade-out
---

# 什么是 Superpowers？

面向编码 Agent（Claude Code / Codex / Gemini / Cursor）的**可组合 skills 框架**

<v-click>

- **15-25 个 skill 一键装**：`/plugin install superpowers@claude-plugins-official`
- **自动触发**：Agent 看到任务匹配 skill 触发场景时**强制**先加载指令
- **覆盖全流程**：brainstorming → 计划 → TDD → 实施 → 调试 → 验证 → 审查
- **跨平台一致**：同一份 skill 在不同 Agent 下行为相同
- **Mandatory Workflow**：把最佳实践标记成「强制」流程而非建议
- **可组合**：skill 互相引用（`executing-plans` 内部调 `subagent-driven-development`）
- **可覆盖**：用户级 skill 优先于 plugin 级，按需禁用

</v-click>

<br>

<div v-click text-xs>

_作者_ [_Jesse Vincent (Prime Radiant)_](https://primeradiant.com/superpowers/)

</div>

<style>
h1 {
  background-color: #7C3AED;
  background-image: linear-gradient(45deg, #7C3AED 10%, #EC4899 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---
transition: slide-up
---

# 评价

<div grid="~ cols-2 gap-8">

<div>

**优点**

<v-clicks>

- 治「跳测试、不验证就完工」毛病
- 方法论实战打磨：TDD / 根因 / 计划
- skill 之间可组合 / 链式调用
- 跨 Agent 平台一致
- 一键安装，社区持续迭代
- meta skill 强制 skill-first 流程

</v-clicks>

</div>

<div>

**缺点**

<v-clicks>

- 简单任务也走全流程，过度拘束
- 部分 skill 假定特定工作流
- 大量 skill 注入占 system prompt
- 中文资源少，文档全英文
- 「mandatory」立场与「灵活判断」张力
- 每次会话首 prompt 多 3-5KB tokens

</v-clicks>

</div>

</div>

---
transition: slide-up
---

# 整体哲学：Mandatory Workflows

把软件工程最佳实践抽象成**强制流程**

| 痛点 | 对应 skill | 强度 |
| --- | --- | --- |
| 凭直觉直接动手 | `brainstorming` | mandatory |
| 写代码前不思考测试 | `test-driven-development` | mandatory |
| 调试瞎猜 | `systematic-debugging` | mandatory |
| 「应该没问题」就 PR | `verification-before-completion` | mandatory |
| 大任务挤主线程 | `subagent-driven-development` | recommended |

<v-click>

`mandatory` 必走（跳过需显式同意），`recommended` 优先用，`optional` 仅手动调。

</v-click>

---
transition: slide-up
---

# 安装

Claude Code 官方 marketplace 一行装：

```bash
# 在 Claude Code 里执行 slash 命令
/plugin install superpowers@claude-plugins-official
```

或手动 clone（适合修改 skill 后本地使用）：

```bash
git clone https://github.com/obra/superpowers.git \
  ~/.claude/plugins/superpowers
# Claude Code 自动扫描 ~/.claude/plugins/
```

<v-click>

验证：

```
> /plugin list
superpowers@claude-plugins-official    installed

> /skills
superpowers:using-superpowers
superpowers:brainstorming
...（共 15-25 个）
```

</v-click>

---
transition: slide-up
---

# 跨平台安装

```
| 平台          | 安装命令                                  |
| ------------- | ----------------------------------------- |
| Claude Code   | /plugin install superpowers@...           |
| Codex CLI     | codex plugin install superpowers          |
| Gemini CLI    | gemini ext install superpowers            |
| Cursor        | Cursor MCP 插件 + 链 superpowers 目录     |
| Copilot CLI   | copilot ext install superpowers           |
| Factory Droid | UI 操作                                   |
```

<v-click>

**跨平台一致**——同一份 skill 在不同 Agent 下行为相同。平台适配差异藏在仓库 `references/<platform>-tools.md`：

- Claude Code 用 `Skill` 工具加载
- Codex 用 `skill` 工具
- Gemini 用 `activate_skill`
- Cursor 走 UI 触发

</v-click>

---
transition: slide-up
---

# using-superpowers：入口 meta skill

总开关——对话开始时自动加载，作用是「**教 Agent 如何发现并用 skills**」

<v-click>

它要求 Agent：

1. 任何回答前（包括澄清问题）**必须**先用 `Skill` 工具加载相关 skill
2. 不允许凭直觉直接答题
3. skill 优先级 > 默认行为

</v-click>

<v-click>

```
[system-reminder]
Below is the full content of your 'superpowers:using-superpowers'
skill - your introduction to using skills...
```

**为什么装了 superpowers 后 Claude 风格突变**——之前可能直接动手写代码，现在会先停下来问需求 / 写计划 / 走 TDD。

</v-click>

---
transition: slide-up
---

# 核心 skill 速览

按使用频次排序

```
| Skill                            | 何时自动触发              | 干什么                  |
| -------------------------------- | ------------------------- | ----------------------- |
| using-superpowers                | 每次对话开始              | 加载 skill 系统         |
| brainstorming                    | 加新功能 / 设计 X 类      | 苏格拉底式反问需求      |
| writing-plans                    | 多步任务                  | 先写计划文档            |
| executing-plans                  | 计划批准后                | 逐步执行 + 人工 check   |
| test-driven-development          | 写代码前                  | RED-GREEN-REFACTOR      |
| systematic-debugging             | 调试场景                  | 4 阶段根因分析          |
| verification-before-completion   | 声称完工前                | 跑命令拿证据            |
| subagent-driven-development      | 大型任务                  | 派子代理 + 两段式审查   |
| dispatching-parallel-agents      | 多个无依赖任务            | 并行下发                |
| using-git-worktrees              | 风险大的改动              | 隔离工作区              |
```

---
transition: slide-up
---

# brainstorming：苏格拉底式反问

**触发**：任何「加新功能 / 设计 X / 选型」类需求

<v-clicks>

**做的事**：

- 问需求范围（要覆盖哪些场景）
- 问约束（必须支持 IE11？必须本地不依赖网络？）
- 问优先级（先快出原型还是直接做对）
- 问验收标准（怎么算完成）

</v-clicks>

<v-click>

```
你：帮我加导出 CSV

brainstorming：
  1. 哪些字段？所有列还是部分？
  2. 编码 UTF-8 还是 GBK（Excel 国内常需 GBK）？
  3. 大数据量时是否要流式（避免内存爆）？
  4. 触发方式：用户点按钮还是定时任务？
  5. 权限：所有用户可导出还是仅管理员？
```

显式说「**这次跳过 brainstorming，需求已经清楚**」可跳过。

</v-click>

---
transition: slide-up
---

# writing-plans：先写计划文档

多步任务先输出**实施计划**——存在 `docs/plans/<date>-<title>.md`

```md
# 计划：导出答题历史 CSV

## 目标
让用户在「我的答题历史」页面点按钮导出 CSV。

## 设计
- API: GET /api/answers/export?from=...&to=...
- Service: AnswerService.exportToCsv(userId, range): Buffer
- 字段：日期 / 题目 / 选项 / 是否正确

## 实施步骤
1. [ ] AnswerService 加 exportToCsv 方法 + 单测
2. [ ] AnswerController 加 GET /export 端点 + e2e
3. [ ] App 端 history 页加按钮 + 触发下载
4. [ ] CHANGELOG 记录

## 验证
- 单测覆盖 exportToCsv（含空数据 / 大数据量）
- e2e: 触发 export，下载文件，断言字段
```

---
transition: slide-up
---

# executing-plans：按计划逐步执行

**触发**：计划文档已写好并批准

<v-clicks>

**核心规则**：

- 按计划步骤顺序执行
- 每步完成后 **wait for human checkpoint**——用户 approve 才进下一步
- 单步失败先停下、报告、不擅自改计划
- 偏离计划要明确告知并请示

**例外**：

- 短任务（一两步） skill 会跳过 plan 直接做
- 探索性原型（先试再决定方向）

</v-clicks>

---
transition: slide-up
---

# test-driven-development：RED-GREEN-REFACTOR

<v-clicks>

1. **RED**：先写测试，运行 → 失败（预期）
2. **GREEN**：写最小实现让测试过
3. **REFACTOR**：清理代码 / 抽函数 / 改名，测试持续过

</v-clicks>

<v-click>

```
你：写一个 calculatePrice 函数支持折扣

TDD skill：
  1. RED：先写 4 个测试（无折扣 / 满减 / 折扣码 / 组合）
  2. 用 Bash 跑测试 → 4 个都失败
  3. GREEN：实现 calculatePrice 让测试过
  4. 跑测试 → 4 个都过
  5. REFACTOR：抽出 applyDiscountStrategy 辅助函数
  6. 跑测试 → 仍 4 个过
```

</v-click>

---
transition: slide-up
---

# TDD 反模式与例外

skill 内列举的常见错误

<v-clicks>

**反模式**：

- 「先实现再写测试」→ 退化为 regression test，测的是已写代码而非需求
- 「测试和实现一起写」→ 边界模糊，常忘掉边界条件
- 「mock 所有依赖」→ 测试过但 prod 集成失败
- 「测覆盖率」当目标 → 写无意义断言冲数字

**例外**（可以跳过 TDD）：

- 探索性原型：先写实现摸索方案
- 紧急 hotfix：先复现 + 修，再补测试
- UI 调样式：很难写有意义的测试

</v-clicks>

---
transition: slide-up
---

# systematic-debugging：4 阶段根因分析

不要瞎猜，按部就班

<v-clicks>

1. **复现**：稳定复现 bug（确认不是 flaky test）
2. **缩小范围**：bisect git history / 注释代码段，找最小复现
3. **形成假设**：「我认为 X 导致 Y，因为 Z」
4. **验证**：跑命令 / 加日志 / 看堆栈，证明假设对/错

</v-clicks>

<v-click>

**反模式**：

- 「随便改改试试」→ 修了某段但不知道为啥
- 「重启就好了」→ 没找根因，会复现
- 「这条 log 提到 X，那一定是 X」→ 没验证就下结论

**调试 vs 重构**：调 bug 时不要顺便重构——修复 vs 重构混 PR，回归测试难定位。

</v-click>

---
transition: slide-up
---

# verification-before-completion

**核心规则**：声称「完成」「通过」「应该可以了」之前，**必须跑命令拿证据**

```
（Agent 写完代码后）

  "Done! The function should work now."
   ↑ 不行——没证据

   Bash: pnpm test:unit src/services/calculator.spec.ts
   4 tests passed

   Done. All tests pass.
   ↑ 这才行
```

<v-click>

检查清单：

- 改 API → 启动 dev server + curl 验证
- 改 UI → 截图（chrome-devtools-mcp）+ 视觉确认
- 改类型 → 跑 `tsc --noEmit`
- 改测试 → 跑测试套件
- 改 build 配置 → 跑 `pnpm build`

</v-click>

---
transition: slide-up
---

# subagent-driven-development

**触发**：单个任务复杂到「**塞主上下文不划算**」

<v-clicks>

**做法**：

1. 主 Agent 把子任务派给 subagent
2. subagent 用独立上下文跑（不污染主上下文）
3. subagent 返回总结
4. 主 Agent 拿结果决策

**两段式审查**：

1. subagent 先 propose（不动手）
2. 主 Agent / 人 review 后 approve
3. subagent 再 execute

避免「subagent 直接干完一个不可逆操作」。

</v-clicks>

---
transition: slide-up
---

# dispatching-parallel-agents

**触发**：2+ 独立子任务，串行无收益

<v-click>

```
> 同时做三件事：
>  1. Explore 找所有未用的 dep
>  2. code-reviewer 评审 PR #123
>  3. Explore 总结测试覆盖率
```

（主 Agent 一次性 spawn 3 个 subagent → 3 个并行 → 最快返回）

</v-click>

<v-click>

**何时不并行**：

- 任务有依赖（A 的结果决定 B 怎么做）→ 串行
- subagent 都写同一文件 → race condition
- 任务量小到串行只需 1 分钟（spawn overhead 反而吃亏）

</v-click>

---
transition: slide-up
---

# using-git-worktrees：隔离工作区

**触发**：风险大的改动（重构 / 升级依赖 / 试验性方案）

```bash
# 主仓库不动
git worktree add ../my-app-experiment exp-branch
cd ../my-app-experiment

# 在这做改动 / 跑测试 / 装新版依赖
pnpm install && pnpm dev && pnpm test

# 满意后 cherry-pick 回主仓库
cd -
git cherry-pick exp-branch
```

<v-click>

**适合**：

- 试新版本依赖（不想污染主项目锁文件）
- 大型重构（边重构边能切回主分支修线上 bug）
- 验证概念性方案（不确定靠谱时）

</v-click>

---
transition: slide-up
---

# requesting-code-review

**触发**：完成一段大改动后

<v-clicks>

**做法**：

1. 写 PR 描述（What / Why / 测试覆盖 / 风险）
2. 自检 checklist（lint / test / 类型 / 文档）
3. 提交 review 时附上**具体担心的点**

</v-clicks>

<v-click>

```
## 这个 PR 做了什么
重构 calculatePrice 支持组合折扣

## 我特别担心的
- 并发场景：两个用户同时下单同一商品库存的减扣
- 边界：折扣总和 > 100% 时应该截到 0 还是报错？
- 性能：折扣表 10k 条时全扫一遍可能慢
```

附上**具体担心的点**引导 reviewer 关注。

</v-click>

---
transition: slide-up
---

# receiving-code-review

**触发**：收到 review 评论后

<v-click>

**核心理念**：**技术审慎**——不要默认「reviewer 一定对」也不要「我一定对」

</v-click>

<v-clicks>

每条意见分类处理：

- **明显对的** → 立即改
- **合理但有 trade-off** → 解释你的取舍，问 reviewer 是否仍坚持
- **不对** → 礼貌反驳并给证据（链接文档 / 测试结果）
- **风格偏好** → 通常顺从 reviewer（团队风格大于个人偏好）

</v-clicks>

<v-click>

**反模式**：「reviewer 说啥都改」→ 失去技术判断力；「reviewer 提的我都觉得不对」→ 过度自信。

</v-click>

---
transition: slide-up
---

# 自定义 skill：SKILL.md

`writing-skills` skill 教你怎么写新 skill

```md
---
name: my-custom-skill
description: |
  Use when [明确的触发场景]
  Example: 用户问 X 类问题 / 需要做 Y 操作前
strength: mandatory | recommended | optional
applies-to:
  - claude-code
  - codex
  - gemini-cli
  - cursor
related-skills:
  - test-driven-development
  - verification-before-completion
references:
  - title: 参考文档
    url: https://...
---

# Skill 主体（步骤 / 反模式 / 例外）
```

---
transition: slide-up
---

# frontmatter 字段

| 字段 | 必需 | 说明 |
| --- | --- | --- |
| `name` | 是 | skill 名（也是 `/<name>` 命令） |
| `description` | 是 | 何时触发——Agent 据此自动调用 |
| `strength` | 否 | mandatory / recommended / optional |
| `applies-to` | 否 | 适用平台（无字段 = 全适用） |
| `related-skills` | 否 | 关联 skill（供 Agent 链式调用） |
| `references` | 否 | 外部参考链接 |

<v-click>

**strength 三档**：`mandatory` 强制走 / `recommended` 优先用 / `optional` 仅手动。

</v-click>

---
transition: slide-up
---

# 好 skill 的特征

<v-clicks>

- description 写**明确触发场景**——Agent 据此自动调用
- 步骤**具体可执行**（不只是「考虑性能」这种空话）
- 列**反模式 + 例外**，避免机械执行
- 长度 **< 500 行**——太长 token 浪费
- 给**具体例子**——光讲规则 Agent 容易跑偏
- 命名空间清晰——用户级无前缀，plugin 用 `<plugin>:<skill>`

</v-clicks>

<v-click>

**反模式 skill**：

- description 太宽：「用于编码」→ 没法精准触发
- 描述 100 行：Agent 读不完
- 步骤含「考虑性能」空话 → 不可执行
- 中文 skill 配中文 Agent → 跨平台时英文 Agent 看不懂

</v-click>

---
transition: slide-up
---

# 命名空间约定

| 来源 | 命名规则 | 例子 |
| --- | --- | --- |
| 用户自写（`~/.claude/skills/`） | 无前缀 | `my-team-style` |
| 项目自写（`<proj>/.claude/skills/`） | 无前缀 | `cypress-skill` |
| Plugin 安装 | `<plugin>:<skill>` | `superpowers:brainstorming` |
| Anthropic 内置 | `claude-code:<skill>` | （罕见） |

<v-click>

冲突优先级：项目 > 用户 > plugin > 内置（**具体 > 通用**）

```
~/.claude/skills/brainstorming/SKILL.md           ← 用户级
<project>/.claude/skills/brainstorming/SKILL.md   ← 项目级（更优先）

# 想覆盖 superpowers 的 brainstorming？
# 写同名 skill 放用户级 / 项目级即可
```

</v-click>

---
transition: slide-up
---

# 启用 / 禁用 skill

```json
// ~/.claude/settings.json
{
  "plugins": {
    "superpowers": {
      "enabled": true,
      "disabledSkills": ["brainstorming"],
      "disabledMandatorySkills": []
    }
  }
}
```

<v-click>

**项目级覆盖**：

```json
// <project>/.claude/settings.json
{
  "plugins": {
    "superpowers": {
      "disabledSkills": ["using-git-worktrees"]
    }
  }
}
```

合并规则：用户级 + 项目级 `disabledSkills` **取并集**——项目内禁用更严格。

</v-click>

---
transition: slide-up
---

# Skill vs Hooks 配合

Skills 是「**Agent 看到的指令**」，Hooks 是「**Agent 跑工具时触发的 shell**」

| 场景 | 选 |
| --- | --- |
| 强制走 TDD 流程 | Skill（`test-driven-development`） |
| 每次 Edit 自动 prettier | Hook（pre/post Edit） |
| 重要 commit 提醒 | Skill |
| 阻止 git push --force | Hook（pre Bash） |
| 完工前跑 lint | Skill（`verification-before-completion`） |

<v-click>

**Skill** 影响 Agent **思考方式**（灵活看场景），**Hook** 影响 Agent **工具调用**（强不可绕过）。

</v-click>

---
transition: slide-up
---

# 性能与成本

Superpowers 装 15-25 个 skill，每个 SKILL.md 1-2KB

<v-clicks>

**影响**：

- 启动开销：每次会话首 prompt 多 3-5KB tokens
- 按 Sonnet 输入 $3/M ≈ 每次会话多花 $0.015
- 行为变慢：simple 任务走完整流程，多几轮对话
- 上下文占用：~3-5% of 200K 窗口

**适合**：

- 重度 Claude Code 用户（每天 2h+），团队规范化 AI 协作
- 培养良好工程习惯

**不适合**：

- 单纯问答 / 简单脚本（用纯对话更快）
- 上下文紧张（已经 1M 还嫌不够）

</v-clicks>

---
transition: slide-up
---

# vs Easy Claude Code (ECC) 对比

| 维度 | Superpowers | ECC |
| --- | --- | --- |
| 范围 | 软件开发全流程 | Claude Code 使用辅助 |
| 哲学 | Mandatory workflow，skill-first | 降低使用门槛，简化命令 |
| 触发 | 自动 + 强制 | 手动 + 引导 |
| 目标用户 | 工程团队 / 重度用户 | 新手 / 偶尔用户 |

<v-click>

**选谁**：工程习惯培养 / 团队规范化 → Superpowers；降门槛 / 个人轻度 → ECC。

</v-click>

---
transition: slide-up
---

# 故障排查 + 反模式

| 现象 | 排查 |
| --- | --- |
| skill 不自动触发 | description 写得不够明确 |
| 简单任务也走 brainstorming | 显式说「跳过 brainstorming」/ 临时禁用 |
| `/plugin install` 失败 | 网络问题（marketplace 在境外） |
| skill 列表里没 superpowers:* | 装完没重启 / `/skills` 刷新 |
| 自定义 skill 不被调用 | description 太宽泛 |

<v-click>

**编写反模式**：写 100 行 description / description 太宽 / 步骤含空话 / mandatory skill 太多 / skill 长 > 500 行。

</v-click>

---
layout: center
class: text-center
---

# 总结

适合：重度 Claude Code 用户 / 团队规范化 AI 协作流程

不需要：单纯问答 / 简单脚本 / 上下文紧张时

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://github.com/obra/superpowers" target="_blank">obra/superpowers</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://primeradiant.com/superpowers/" target="_blank">primeradiant.com/superpowers</a>
</div>
