---
theme: seriph
background: https://cover.sli.dev
title: Kiro — AWS 的 spec-driven IDE
info: |
  Presentation Kiro — AWS 出品的规格驱动 agentic IDE，把工程严谨性带入 AI 编码。

  Learn more at [https://kiro.dev](https://kiro.dev)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <span class="text-8xl">📐</span>
</div>

<br/>

## Kiro — AWS 的 spec-driven IDE

AWS 出品的规格驱动 agentic IDE，把工程严谨性带入 AI 编码；IDE / CLI / Web 三形态

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://kiro.dev/docs" target="_blank" class="slidev-icon-btn">
    <carbon:document />
  </a>
</div>

<!--
今天聊 Kiro：AWS 出品的 spec-driven，规格驱动的 agentic IDE。

它解决的痛点很明确：vibe coding 能跑但进不了生产。Kiro 的理念是 vibe coding 的流畅加上 specs 的清晰，把工程严谨性带进 AI 编码。

主线：定位 → Vibe 与 Spec → Specs 三文档 → EARS → 工作流选择 → waves → Hooks → Steering → MCP 与模型 → 对比 Cursor → 总结。
-->

---
layout: image-right
image: https://cover.sli.dev
---

# 它是什么

<v-clicks>

- ✅ AWS 的 **spec-driven** agentic IDE，IDE/CLI/Web 三形态
- ✅ 三大支柱：**Specs / Hooks / Steering**
- ✅ 弥合「vibe coding → production」

</v-clicks>

<div v-click class="mt-6">

边界：

- ❌ 流程偏重，不如 chat-driven 轻快
- ❌ 基于 Code OSS，扩展走 Open VSX；偏 AWS 生态

</div>

<!--
Kiro 的定位：AWS 出品的规格驱动 agentic IDE，有 IDE、CLI、Web 三种形态。三大支柱是 Specs、Hooks、Steering。它的使命是弥合 vibe coding 到 production 的鸿沟，补足那些没文档化的假设、需求符合性、系统设计可见性。

边界两条：流程偏重，规格驱动有学习成本，不如纯对话式轻快;它基于 Code OSS，扩展走 Open VSX 不是微软市场，而且偏 AWS 生态。
-->

---

# Vibe 与 Spec 两种方式

| 方式 | 适用 |
| --- | --- |
| **Vibe** | 对话式：问代码库、要解释、直接改，适合探索 |
| **Spec** | 绑定结构化需求/设计/任务，适合进生产 |

<div v-click class="mt-4">

Kiro 智能识别意图：疑问句→解释；"Create/Fix"→改动，无需手动切

</div>

<!--
Kiro 有两种工作方式。Vibe 是探索式、对话式的，问代码库、要解释、直接改代码，适合探索和快速试验。Spec 是规格驱动，把交互绑定到结构化的需求、设计、任务，适合要进生产、需要可维护性的特性。

好的是它会智能识别你的意图，你问问题它就给解释，你说 Create 或 Fix 它就提出或实施改动，不用手动切模式。
-->

---

# Specs：规格驱动核心

从需求生成三份**可版本化**文档，存 `.kiro/specs/<feature>/`：

| 文件 | 内容 |
| --- | --- |
| `requirements.md` | 需求（EARS 记法） |
| `design.md` | 架构/数据流/接口/schema |
| `tasks.md` | 可勾选任务清单 |

三阶段 **Requirements → Design → Tasks**，阶段间有审批关卡

<!--
Specs 是 Kiro 的核心。它从需求出发，生成三份可版本化的 Markdown 文档，存在 .kiro/specs 下的特性目录里。

requirements.md 是需求，用 EARS 记法写;design.md 是技术设计，架构、数据流、接口、数据库 schema;tasks.md 是可勾选的任务清单。

流程是三阶段：Requirements 到 Design 到 Tasks，每个阶段之间默认有人工审批关卡，你确认了才进下一步。这就是把 AI 编码升级成有需求、设计、任务留痕的工程流程。
-->

---

# EARS 记法

EARS = **Easy Approach to Requirements Syntax**，把需求写成可测试句式：

```text
WHEN  用户提交空表单
THEN  系统 SHALL 显示校验错误
      系统 SHALL CONTINUE TO 保留已填字段
```

<div v-click class="mt-3">

关键词：`WHEN` 触发 · `THEN` 响应 · `SHALL` 强制 · `SHALL CONTINUE TO` 防回归

</div>

<!--
EARS 是 requirements.md 用的记法，全称 Easy Approach to Requirements Syntax，把需求写成可测试的结构化句式。

四个关键词：WHEN 是触发条件，THEN 是系统响应，SHALL 是强制要求，还有 SHALL CONTINUE TO，表示必须保留的既有行为，专门防回归，bugfix 的时候特别有用。这种写法让需求清晰、可验证，AI 据此实现也不容易跑偏。
-->

---

# 工作流选择与 waves

<v-clicks>

- **Requirements-First**：已知行为、架构可灵活设计
- **Design-First**：已有设计或有严格非功能约束
- 二选一，**创建后不可改**
- **Quick Plan**：一次生成三产物，**跳过审批关卡**
- **waves**：独立任务编波次，**波次串行、波内并发**

</v-clicks>

<!--
创建 spec 时要二选一选工作流：Requirements-First 适合你已知系统行为、架构可以灵活设计;Design-First 适合你已有技术设计，或者有严格的非功能约束比如延迟、吞吐、合规。注意一旦创建就不能中途改。

还有个 Quick Plan 快速路径，一次性生成三份产物，跳过阶段间的人工审批，适合你信任的、理解透彻的特性或者快速原型。

任务执行用 waves 波次模型：把独立任务编成波次，波次之间串行执行，同一波次内的任务并发执行，这样既保证依赖顺序又提升并行度。
-->

---

# Agent Hooks

事件触发的 agent，自动执行 prompt 或 shell 命令：

<v-clicks>

- 文件**保存 / 创建 / 删除**
- prompt 提交后、agent turn 完成后
- 工具调用前/后、spec 任务前/后、手动

</v-clicks>

<div v-click class="mt-3">

典型：保存时自动生成测试 / 更新文档 / 安全扫描

</div>

<!--
Agent Hooks 是事件触发的 agent，当 IDE 里发生特定事件时，自动执行一个预定义的 agent prompt 或 shell 命令。

触发事件很丰富：文件保存、创建、删除;prompt 提交后、agent 一轮完成后;工具调用前后、spec 任务执行前后;还能手动触发。别以为只有 on-save 一种。

典型用途：保存文件时自动生成或更新测试、自动更新文档、做安全漏洞扫描，帮你catch 那些容易漏的东西，保持代码质量和团队规范一致。
-->

---

# Steering：引导 agent

`.kiro/steering/` 下的 markdown 给 Kiro 持久知识，三个基础文件 `product.md` / `tech.md` / `structure.md`

四种 inclusion mode：

| mode | 行为 |
| --- | --- |
| `always`（默认） | 每次都加载 |
| `fileMatch` | 匹配文件时激活 |
| `manual` | `#name` 手动引入 |
| `auto` | 按相关性自动 |

<div v-click class="mt-2 text-rose-400">

⚠️ AGENTS.md 支持但不支持 inclusion mode、永远全量

</div>

<!--
Steering 是用 markdown 给 Kiro 持久的 workspace 知识，让它一贯遵循你的模式和规范，不用每次重复解释。三个基础文件：product.md 讲产品、tech.md 讲技术栈、structure.md 讲文件组织。

它们通过 front-matter 的 inclusion 控制注入时机，四种模式：always 默认每次加载、fileMatch 匹配文件时激活、manual 用井号名手动引入、auto 按相关性自动判断。

一个易错点：Kiro 也支持 AGENTS.md，但 AGENTS.md 不支持 inclusion mode，永远全量包含，和 steering 文件的可控注入不一样。
-->

---

# MCP 与模型

**MCP**：`.kiro/settings/mcp.json`，顶层键 `mcpServers`，`autoApprove` 可免确认

<v-clicks>

- 本地用 `command`，远程用 `url`
- 模型：付费档 Auto（混用多模型）/ Claude 系 / 开放权重（Qwen·DeepSeek）
- 自主度：**Autopilot**（自主改）/ **Supervised**（逐项批准）

</v-clicks>

<!--
MCP 配置在 .kiro/settings 下的 mcp.json，顶层键 mcpServers，autoApprove 字段可以把信任的工具加白名单免确认。本地服务器用 command，远程用 url。

模型方面，付费档有 Auto 模式混用多个前沿模型平衡质量和成本，还有 Claude 系和开放权重模型如 Qwen、DeepSeek。

自主度两种：Autopilot 是 Kiro 自主应用文件改动;Supervised 是逐项审阅批准。按你对它的信任选。
-->

---

# vs Cursor

| 维度 | Kiro | Cursor |
| --- | --- | --- |
| 范式 | **spec-driven** | **chat-driven** |
| 产物 | 可版本化的需求/设计/任务 | 主要是代码改动 |
| 自动化 | Agent Hooks 事件触发 | 规则 + agent |
| 约束 | Steering（4 inclusion mode） | .cursorrules |

<!--
和 Cursor 怎么比？最根本的差异是范式：Kiro 是 spec-driven 规格驱动，Cursor 是 chat-driven 对话驱动。

产物上，Kiro 把意图固化成 .kiro/specs 下可版本化的需求、设计、任务三份文档，Cursor 主要产出代码改动，规格不落盘。自动化上，Kiro 有 Agent Hooks 按事件触发，Cursor 是规则加 agent。行为约束上，Kiro 用 Steering 加四种 inclusion mode，Cursor 用 cursorrules。

一句话：Kiro 是 spec-first 把 AI 编码升级成有留痕的工程流程，Cursor 是 chat-first 对话即编辑。
-->

---
layout: center
class: text-center
---

# 总结

Kiro = AWS 的 spec-driven agentic IDE

Specs(三文档+EARS) · Agent Hooks · Steering · waves · vibe→production

<div class="mt-8 flex justify-center gap-6 text-xl">
  <a href="https://kiro.dev/docs" target="_blank">📖 官方文档</a>
  <a href="https://kiro.dev" target="_blank">⬇️ 下载</a>
</div>

<!--
总结：Kiro 是 AWS 的 spec-driven agentic IDE。

抓手记牢：Specs 三文档加 EARS 记法、Agent Hooks 事件触发、Steering 引导加四种 inclusion mode、waves 波次并发。它的核心价值是把 vibe coding 升级到 production，用规格驱动给 AI 编码加上工程严谨性。谢谢。
-->
