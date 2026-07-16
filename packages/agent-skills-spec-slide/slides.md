---
theme: seriph
background: https://cover.sli.dev
title: Agent Skills 规范与生态
info: |
  Agent Skills：一个文件夹 + 一个 SKILL.md 的开放能力标准。
  基于 agentskills.io 开放规范。
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Agent Skills

一个文件夹 + 一个 `SKILL.md`，就是 AI Agent 的开放能力标准

<div class="pt-6 opacity-80">
由 Anthropic 发起并开源 · 基于 agentskills.io 规范
</div>

<div @click="$slidev.nav.next" class="mt-10 py-1 opacity-70" hover:bg="white op-10">
  按空格开始 <carbon:arrow-right class="inline"/>
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/agentskills/agentskills" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天讲 Agent Skills —— 不是某个具体工具，而是 Superpowers、gstack、find-skills 这些一切技能生态所依据的「共同格式」。它极简到一个文件夹加一个 Markdown 文件就成。
-->

---
transition: fade-out
---

# 什么是 Agent Skills？

一种给 AI agent 加能力的**轻量开放格式**——不是 SDK，不是插件系统

<v-clicks>

- **一个技能 = 一个目录 + 一个 `SKILL.md`**：YAML frontmatter 声明「是什么、何时用」，正文写指令
- **可附带资源**：`scripts/` 可执行代码、`references/` 参考文档、`assets/` 模板
- **渐进披露**：需要时才把完整指令读进上下文，几十个技能常驻也几乎不占窗口
- **跨产品可移植**：同一份 `SKILL.md` 在 Claude Code / Codex / Gemini CLI / Cursor 通用

</v-clicks>

<div v-click class="mt-4">

```
pdf-processing/
├── SKILL.md      # 必填：元数据 + 指令
├── scripts/      # 可选：可执行代码
└── references/   # 可选：按需加载的参考
```

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
核心一句话：技能就是一个带 SKILL.md 的文件夹。没有 SDK、没有注册中心、没有构建步骤。它喂给 agent 的是「指令 + 参考文件」，不是运行时。
-->

---
transition: fade-out
---

# 渐进披露：为什么不撑爆上下文

整套标准的核心设计——agent 分三步「按需取用」，不一次读进所有技能

<div class="mt-4">

| 阶段 | 加载什么 | 体量 | 触发时机 |
| --- | --- | --- | --- |
| **Discovery** | 每个技能的 `name` + `description` | ~100 token/个 | 启动时，全部技能 |
| **Activation** | 该技能完整 `SKILL.md` 正文 | 建议 < 5000 token | 任务匹配 description |
| **Execution** | `scripts/` · `references/` · `assets/` | 按需 | 指令明确要读时 |

</div>

<v-click>

> 好比一本组织良好的手册：先看**目录**（元数据）→ 翻到**章节**（正文）→ 查**附录**（资源）。平时只花「目录」的钱。

</v-click>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
这张是全场最重要的心智模型。正因为渐进披露，你可以挂上百个技能，启动只加载每个约 100 token 的名字和描述；只有任务匹配时才读完整正文；只有正文明确要读时才加载脚本和参考。这决定了后面「怎么写技能」的一切。
-->

---
transition: fade-out
---

# 最小 `SKILL.md`：agent 看到什么

同一个文件，agent 在两个阶段看到的不一样

````md magic-move
```yaml
# 🔍 Discovery 阶段 —— 启动时，agent 只看到这两行
name: pdf-processing
description: 提取 PDF 文本与表格、填表单、合并文件。处理 PDF 时使用。
```

```markdown
# ⚡ Activation 阶段 —— 任务匹配后，读进完整正文
---
name: pdf-processing
description: 提取 PDF 文本与表格、填表单、合并文件。处理 PDF 时使用。
---

用 pdfplumber 提取文本；扫描件退回 pdf2image + pytesseract。
```
````

<v-click>

**必填只有两个字段**：`name`（1–64 字符、小写、与父目录同名）+ `description`（≤1024 字符，说清「做什么 + 何时用」）。

</v-click>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
用 magic-move 演示同一个文件在两个阶段的差异：Discovery 只暴露 name 和 description，Activation 才读完整正文。最小合法体只需两个字段。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# frontmatter：两类字段

写「处处运行」的技能只用左边；需要 Claude Code 专有能力才用右边

::left::

<div v-click>

**可移植字段**（跨 agent 通用）

- `name` · `description` —— 必填
- `license` —— 许可
- `compatibility` —— 环境要求
- `metadata` —— 任意键值
- `allowed-tools` —— 预批准工具（实验）

</div>

::right::

<div v-click>

**Claude Code 扩展**（不跨平台）

- `disable-model-invocation` —— 仅手动触发
- `user-invocable` —— 从 `/` 菜单隐藏
- `context: fork` · `agent` —— 子代理里跑
- `model` · `effort` —— 切模型/努力档
- `paths` · `hooks` · `shell`

</div>

::bottom::

<div v-click class="text-sm opacity-75 mt-2">

⚠️ 扩展字段写进 `SKILL.md` 后，拿到别的 agent 可能被直接忽略。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
一个高频误区：把 Claude Code 的扩展字段当成规范的一部分。左边六个才是跨 agent 可移植的；右边是 Claude Code 在标准之上的加料，只在 Claude Code 生效。想「一次编写处处运行」，只用左边。
-->

---
transition: fade-out
---

# 技能存哪里，谁能用

在 Claude Code 里，**存放位置**决定作用域与优先级

<div class="mt-3">

| 位置 | 路径 | 作用域 |
| --- | --- | --- |
| 企业级 | 受管设置目录 | 全组织 |
| 个人 | `~/.claude/skills/<name>/` | 你的所有项目 |
| 项目 | `.claude/skills/<name>/` | 仅本项目 |
| 插件 | `<plugin>/skills/<name>/` | 启用插件处 |

</div>

<v-clicks>

- **同名优先级**：企业 > 个人 > 项目，任一层都可覆盖内置技能
- **插件技能**用 `plugin-name:skill-name` 命名空间，不与其它层冲突
- **命令名取自目录名**：`.claude/skills/deploy/` → `/deploy`（不是 frontmatter `name`）

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
位置即作用域：个人技能跨项目，项目技能只在本仓库。同名冲突时企业压个人压项目。一个容易踩的点：你输入的命令名来自目录名，不是 frontmatter 的 name 字段。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 触发：自动 vs 手动

同一个技能，两条路进入上下文

::left::

<div v-click>

**自动**（模型触发）

任务匹配 `description` 时，Claude 自己加载。

```text
> 我改了什么？
（匹配 summarize-changes
  的 description → 自动加载）
```

</div>

::right::

<div v-click>

**手动**（用户触发）

直接输入命令名，不依赖匹配。

```text
> /summarize-changes
```

想禁掉自动触发：frontmatter 加
`disable-model-invocation: true`

</div>

::bottom::

<div v-click class="mt-3">

**动态上下文注入**：正文里 `` !`git diff HEAD` `` 会先跑命令、把输出替换进内容——技能扎根真实状态，而非猜测。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
触发有两条路：description 匹配任务时自动加载，或用户手动打斜杠命令。想要一个只在你明确调用时才跑的部署技能，就设 disable-model-invocation。动态注入是个好用的能力：技能被读之前先跑命令灌入真实数据。
-->

---
transition: fade-out
---

# `description` 是触发的全部依据

规范只保证格式合法，触发准不准全看这一句话怎么写

````md magic-move
```yaml
# ❌ 差：agent 无从判断何时该激活
description: 帮忙处理 PDF。
```

```yaml
# ✅ 好：说清「做什么 + 何时用 + 关键词」
description: 从 PDF 提取文本与表格、填表单、合并多个 PDF。
  处理 PDF 文档、或用户提到 PDF/表单/文档提取时使用。
```
````

<v-clicks>

- 一句话干两件事：**陈述能力** + **列出该触发的分支**
- 同义改写不算新分支——「用 TDD 构建 / 要测试先行」是一个分支写了两遍，折叠掉
- 写不好的后果：**不触发**（description 太窄/太泛）或**误触发**（关键词撞车）

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
description 是最该打磨的一句话。它既说技能是什么，又列出该触发它的分支。别用同义词把一个分支写两遍。写太泛会乱触发，写太窄会不触发——需要反复评测调优。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 花上下文：加缺的，删会的

技能一激活，正文就与对话历史争夺 agent 的注意力

::left::

<div v-click>

❌ **啰嗦**——解释 agent 早就懂的

```markdown
## 提取 PDF 文本
PDF 是一种常见文件格式，包含
文本、图片等内容。要提取文本，
你需要一个库。推荐 pdfplumber，
因为它处理大多数情况都不错。
```

</div>

::right::

<div v-click>

✅ **紧凑**——直奔 agent 不知道的

```markdown
## 提取 PDF 文本
用 pdfplumber；扫描件退回
pdf2image + pytesseract。

import pdfplumber
pdf.pages[0].extract_text()
```

</div>

::bottom::

<div v-click class="mt-3 text-center">

对每段自问：**「没有这条，agent 会做错吗？」** 不会 → 删。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
好技能的第一原则：加 agent 缺的，删 agent 会的。不用解释 PDF 是什么、HTTP 怎么工作。直接跳到项目专有约定、非显然边界、该用哪个具体工具。判据就是那句自问。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 按脆弱度校准控制

把指令的具体程度，匹配任务的脆弱度

::left::

<div v-click>

**多解且容错 → 给自由**

讲「为什么」比死命令更有效

```markdown
## 代码评审
- 数据库查询防注入（参数化）
- 每个端点核实鉴权
- 排查并发路径竞态
```

</div>

::right::

<div v-click>

**脆弱/须固定顺序 → 强指令**

```markdown
## 数据库迁移
严格执行，别改命令别加 flag：

python scripts/migrate.py \
  --verify --backup
```

</div>

::bottom::

<div v-click class="mt-3">

**给默认，不给菜单**：选一个默认工具 + 一句逃生出口，别把 4 个等价选项摆出来。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
不是每部分都要同等规定性。多解容错的任务给自由，解释目的让 agent 自行判断；脆弱的固定顺序操作给精确命令。还有一条：给默认不给菜单，别把等价选项都摆出来让 agent 纠结。
-->

---
transition: fade-out
---

# Gotchas：技能里最值钱的内容

违反合理假设的**环境事实**——不是空话，是具体纠正

<div v-click>

```markdown
## Gotchas
- users 表用软删除。查询必须带 WHERE deleted_at IS NULL，
  否则结果含已停用账号。
- 用户 ID 在数据库叫 user_id，鉴权服务叫 uid，
  账单 API 叫 accountId——三者是同一个值。
- /health 只要 web server 活着就返 200，哪怕数据库断了。
  查完整健康用 /ready。
```

</div>

<v-clicks>

- 这些是 agent **没被告知就一定会踩**的坑，而非「妥善处理错误」这类通用建议
- **迭代技能最直接的方式**：每当你不得不纠正 agent 的一个错误，就把纠正加进 gotchas

</v-clicks>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Gotchas 段往往是一个技能里最值钱的部分：那些违反合理假设、agent 不被告知就会踩的环境事实。软删除、字段异名、假健康检查。迭代技巧：每次纠正 agent 的错误，就沉淀进 gotchas。
-->

---
transition: fade-out
---

# plan-validate-execute

批量/破坏性操作：先出计划 → 对照真相源校验 → 再执行

<div v-click>

```markdown
1. 提取表单字段: analyze_form.py input.pdf → form_fields.json
2. 建 field_values.json，映射每个字段名到目标值
3. 校验: validate_fields.py form_fields.json field_values.json
4. 校验失败 → 改 field_values.json 重来
5. 填表: fill_form.py input.pdf field_values.json output.pdf
```

</div>

<v-click>

> 关键在**第 3 步**：校验脚本把计划对照真相源。报错像「字段 signature_date 不存在，可用字段：customer_name, order_total…」——给 agent 足够信息**自我纠正**。

</v-click>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
对付批量和破坏性操作的黄金模式：不要一步到位，而是先产出结构化中间计划，对照真相源校验，再执行。价值全在校验那一步——好的报错让 agent 能自己修，而不是盲改。
-->

---
transition: fade-out
---

# 六个失败模式

好技能靠工艺不靠 schema——用这些诊断技能出的问题

| 失败模式 | 症状 | 解法 |
| --- | --- | --- |
| **premature completion** | 没真做完就收工 | 锐化完成判据；仍抢跑则藏起后续步骤 |
| **duplication** | 同一含义出现多处 | 折叠成单一真相源 |
| **sediment** | 陈旧内容层层堆积 | 逐句 no-op 测试，整句删 |
| **sprawl** | 技能单纯太长 | 参考下沉指针后，按分支拆分 |
| **no-op** | 一行模型默认就会照做 | 换更强的 leading word |
| **negation** | 用禁令引导反而适得其反 | 改用正向陈述目标行为 |

<div v-click class="mt-3 text-sm opacity-80">

**leading word**：用模型预训练里已有的紧凑概念（_tight_、_red_、_relentless_）锚定一整片行为——省 token 又更准。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
这六个失败模式来自 mattpocock 的 writing-great-skills，是诊断技能问题的清单。特别提 negation：用禁令引导会适得其反，「别想大象」反而召唤大象——改用正向陈述。leading word 是省 token 的利器。
-->

---
layout: two-cols-header
transition: fade-out
layoutClass: gap-x-8
---

# 生态：建立在规范之上

标准由 Anthropic 开源，一层生态长在它上面

::left::

<div v-click>

**谁支持这个格式**

- Claude Code · Codex CLI
- Gemini CLI · GitHub Copilot
- Cursor · OpenCode
- Factory / Slate / Kiro / Hermes …

</div>

::right::

<div v-click>

**谁建立在它之上**

- Superpowers —— 工程方法框架
- gstack —— 虚拟工程团队
- mattpocock/skills —— Grill 系列
- find-skills —— 发现/安装 CLI

</div>

::bottom::

<div v-click class="mt-3">

**规范只管格式，不保证质量**——一个合法 `SKILL.md` 可能是废话。好技能靠上面讲的工艺。

</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
Agent Skills 是地基。左边是支持这个格式的 agent，右边是建立在它之上的技能产品——Superpowers、gstack、Grill、find-skills，都是这个批次的其它叶子。记住最后这句：规范只保证格式合法，质量全靠工艺。
-->

---
layout: center
class: text-center
---

# 一句话记住

**技能 = 一个目录 + 一个 `SKILL.md`；渐进披露按需加载；加 agent 缺的，删 agent 会的。**

<div class="mt-8 opacity-80">

规范 · 渐进披露 · 可移植字段 · 创作工艺 · 生态

</div>

<div class="abs-br m-6 text-xl flex gap-3">
  <a href="https://agentskills.io" target="_blank" class="slidev-icon-btn"><carbon:document /></a>
  <a href="https://github.com/agentskills/agentskills" target="_blank" class="slidev-icon-btn"><carbon:logo-github /></a>
  <a href="https://code.claude.com/docs/en/skills" target="_blank" class="slidev-icon-btn"><carbon:code /></a>
</div>

<style>
h1 { background: linear-gradient(45deg, #7c3aed 10%, #2563eb 60%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<!--
收尾。整套标准记住这一句：一个目录加一个 SKILL.md，渐进披露按需加载，加 agent 缺的删 agent 会的。资源链接在右下角：规范文档、GitHub、Claude Code 文档。
-->
