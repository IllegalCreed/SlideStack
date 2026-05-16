---
theme: seriph
background: https://cover.sli.dev
title: Welcome to Pi
info: |
  Presentation of Pi - the minimal coding agent harness by Mario Zechner.

  Learn more at [https://pi.dev/](https://pi.dev/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <carbon:cube class="text-7xl" />
</div>

<br/>

## Pi：极简 Coding Agent Harness

4 个工具 + 不到 1000 token 系统提示，反对臃肿 Agent 的开源答卷

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 Pi —— 由 Mario Zechner（libGDX 框架创建者）做的极简 AI 编码 Agent。

只有 4 个核心工具（read / write / edit / bash），系统提示词不到 1000 token，但能跑通 80% 的真实编码任务。和 Claude Code 那种 10K+ token 系统提示的「臃肿派」完全相反方向。
-->

---
transition: fade-out
---

# 命名歧义先讲清

「Pi」名字泛滥，本场只讲一个

<v-clicks>

- **Mario Zechner 的 Pi（本场主题）**：开源 coding agent harness，仓库 `earendil-works/pi`
- **Inflection AI 的 Pi（pi.ai）**：聊天助手，2023 年 Mustafa Suleyman 创立，与本场无关
- **Raspberry Pi**：硬件单板电脑，与本场无关
- **Pi Network**：移动端加密货币 App，与本场无关
- **Anthropic harness engineering**：Anthropic 内部 session / harness / sandbox 三层架构，叫 Managed Agents 不叫 Pi

</v-clicks>

<br>

<v-click>

> 💡 **「Anthropic 的 Pi」是误传**
>
> Anthropic 没有叫 Pi 的产品。Anthropic 自家 agent 基础设施叫「Claude Managed Agents」（platform.claude.com/docs/managed-agents）。Pi 仅把 Anthropic 模型作为多个 provider 之一。

</v-click>

<style>
h1 {
  background-color: #2563EB;
  background-image: linear-gradient(45deg, #2563EB 10%, #1E3A8A 90%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---
transition: slide-up
level: 2
---

# 谁做的 Pi

Mario Zechner —— libGDX 创建者，反臃肿哲学的实践者

<v-clicks>

- **GitHub 昵称**：badlogic（奥地利游戏开发者）
- **代表作 1**：[libGDX](https://libgdx.com/) 跨平台 Java 游戏框架（24K+ stars，2011 年 Android 上最流行）
- **代表作 2**：RoboVM（iOS Java），被 Xamarin 收购后被微软关掉
- **2025 下半年**：因「Claude Code 越来越胀」自写 Pi
- **2026 年 4 月**：Pi 被 Earendil 公司收编，但 MIT 核心永远不变，Mario 保留技术决策权

</v-clicks>

<br>

<v-click>

> 💡 **作者原话**
>
> "Claude Code has turned into a spaceship with 80% of functionality I have no use for. If I don't need it, it won't be built."

</v-click>

---
transition: slide-up
---

# 定位：Minimal Agent Harness

不是 framework，不是 IDE 插件——是终端里跑的极简 coding agent

<v-clicks>

- **Harness ≠ Framework**：harness 是「**完整能跑**」的 CLI 工具；framework 是「**让你构建 agent**」的库（LangChain / CrewAI 这种）
- **4 个工具决定一切**：read / write / edit / bash —— 不再多
- **不到 1000 token 系统提示**：信任 frontier 模型「已经懂编码 agent」
- **25+ LLM provider**：Anthropic / OpenAI / Google / DeepSeek / Ollama 等
- **MIT 开源 + 永远不变**：核心永远免费可商用

</v-clicks>

<v-click>

定位关键词：**极简**（< 1K token） + **多 provider**（25+） + **完全开源**（MIT） + **可扩展**（TS Extension）。

</v-click>

---
transition: slide-up
---

# 优劣速读

<v-clicks>

**优点**

- 极简哲学：4 工具 + < 1K token 系统提示，给模型留出更多上下文
- 全透明：所有 tool call / 注入都可见，无「黑盒中的黑盒」
- 25+ provider：mid-session 切模型保留上下文，DeepSeek / Ollama 大陆友好
- MIT 开源：可自托管 / 内嵌 / 商用
- Tree-structured Sessions：JSONL 树形会话，任意节点分叉重试
- TS Extensions：完整自定义工具 + Hooks，hot reload

**缺点**

- 资料相对少（vs Claude Code 文档铺天盖地）
- 学习曲线陡：极简意味着「自己写扩展」
- 无 MCP（作者主张 CLI + README 替代）
- 无 Plan Mode / Subagents / 内置 TODO（用文件 + bash spawn 解决）
- YOLO 默认：无权限询问对新手不友好
- 0.x 版本，仍可能 breaking change

</v-clicks>

---
transition: slide-up
---

# 极简哲学：Pi Way

「If I don't need it, it won't be built」一句话总结

<v-clicks>

| 别家做 | Pi 选择 | 理由 |
| --- | --- | --- |
| 20+ 内置工具 | 4 个（read / write / edit / bash） | 「bash is all you need」 |
| 10K+ token 系统提示 | < 1000 token | 给模型留上下文 |
| 内置 Plan Mode | 用 PLAN.md 文件 | 持久化 + 可观察 |
| 内置 TODO 工具 | 用 TODO.md 文件 | 简单可见 |
| Sub-agents 内置 | bash spawn pi 自己 | 透明 + 不增复杂度 |
| MCP server | CLI + README | 上下文开销小 7-9% |
| 权限询问 | YOLO + 限工具集 | 信任用户 |
| 后台 bash | tmux | 可观察 |

</v-clicks>

<v-click>

> 💡 **不是反对功能，是反对「内置」**
>
> Pi 不阻止你用 Plan / TODO / Sub-agents——只是不**内置**。需要时用文件 / bash / 扩展实现，主框架保持精简。

</v-click>

---
transition: slide-up
---

# 安装

```bash
# 官方 shell 脚本（推荐）
curl -fsSL https://pi.dev/install.sh | sh

# 或 npm（新 scope，2026 年 4 月迁移）
npm install -g @earendil-works/pi-coding-agent

# 旧 scope 仍可用（部分文档还在用）
npm install -g @mariozechner/pi-coding-agent

# 验证
pi --version    # 0.74.x
pi -h           # 列子命令
```

<v-click>

**Node 版本**：Node 20+（Bun / Deno 也支持）。

</v-click>

<v-click>

> 💡 **从 badlogic/pi-mono 迁到 earendil-works/pi**
>
> 2026 年 4 月 Mario 加入 Earendil 后，仓库地址 / npm scope 改了，**协议 / 代码 / 治理不变**。旧引用会跳到新地址。

</v-click>

---
transition: slide-up
---

# 认证：自配 Provider

Pi 不绑定任何家厂商，必须自带凭据

<v-clicks>

**1. 环境变量（最直接）**

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-...
export DEEPSEEK_API_KEY=sk-...
```

**2. `auth.json`（交互式配置）**

```bash
pi auth login   # 选 provider + 粘 key
# 存到 ~/.config/pi/auth.json
```

**3. OAuth（Claude Pro / Max / ChatGPT Plus）**

```bash
pi auth login --provider claude-pro
```

</v-clicks>

<v-click>

> ⚠️ **第三方 harness 计费**
>
> 用 Claude Pro / Max 订阅在 Pi 里跑，走「额外用量」按 token 单独计费。只有 Claude Code 自家 harness 才在订阅额度内。所有非自家 harness 都同此约束。

</v-click>

---
transition: slide-up
---

# 第一次对话

```bash
cd ~/projects/my-app
pi
```

```
╭─────────────────────────────────────╮
│  pi  v0.74.x                        │
│  cwd: ~/projects/my-app             │
│  model: claude-sonnet-4-6           │
│  provider: anthropic                │
╰─────────────────────────────────────╯

> 帮我看看 src/index.ts 文件里的 main 函数
```

<v-click>

Pi 流程：

1. 调 `read` 读 `src/index.ts`
2. 分析后回复
3. **所有 tool call 完整可见**——参数、返回、耗时都打在屏幕

</v-click>

---
transition: slide-up
---

# 四个核心工具

| 工具 | 用途 | 关键参数 |
| --- | --- | --- |
| `read` | 读文件 / 图片 | `path` + `offset?` + `limit?` |
| `write` | 写整个文件（覆盖） | `path` + `content` |
| `edit` | 精确 string replace | `path` + `old_string` + `new_string` |
| `bash` | 执行 shell 命令 | `command` + `timeout?` |

<v-click>

**Edit vs Write 选择**：

- 改局部 → `edit`：只传 old / new，token 省
- 建新文件 / 整文件重写 → `write`：传完整内容

</v-click>

<v-click>

**Bash 替代很多专门工具**：

- `grep`：`bash "rg <pattern>"` 或 `bash "grep -r"`
- `find`：`bash "find . -name"`
- `ls`：`bash "ls -la"`
- 不需要单独 grep / find / ls tool

</v-click>

---
transition: slide-up
---

# 系统提示词（约 800 token）

```
You are pi, a minimal coding agent.

Tools:
- read: Read files. Args: path, offset?, limit?
- write: Write entire file. Args: path, content
- edit: Replace string in file. Args: path, old_string, new_string
- bash: Run shell command. Args: command, timeout?

Guidelines:
- Use bash for grep, find, ls (not separate tools)
- Prefer edit over write for partial changes
- Read AGENTS.md if present
- Be concise. Skip unnecessary explanations.
```

<v-click>

对比 Claude Code 的 **10K+ token** 系统提示（含示例 / 流程 / 边界）——Pi 信任模型已经懂，**不再耳提面命**。

</v-click>

<v-click>

> 💡 **为什么这能 work**
>
> 现代 frontier 模型（Claude / GPT-5 / Gemini 2.5）经过大量 RL 训练，**已经懂 coding agent 是什么**——给它 4 个工具就能完成 80% 任务。

</v-click>

---
transition: slide-up
---

# 项目说明书：AGENTS.md

Pi 启动时自动读项目根的 `AGENTS.md`（与 OpenCode / Codex CLI 同名约定）

```md
# 项目说明

## 技术栈
本仓库是 Vue 3 + Vite + TS 的电商前台...

## 代码规范
- 注释用中文
- 组件 PascalCase
- 函数 JSDoc

## 常用命令
- `pnpm dev`：启动 dev server
- `pnpm test`：单元测试
```

<v-click>

**三层 AGENTS.md**：

- `~/.config/pi/AGENTS.md`（用户全局）
- `<project>/AGENTS.md`（项目级，commit）
- `<project>/.pi/AGENTS.md`（项目本地，不 commit）

冲突时**项目级 > 用户级**。

</v-click>

<v-click>

> 💡 **兼容 CLAUDE.md**
>
> Pi 也会读项目里的 `CLAUDE.md`（Claude Code 习惯），但优先 `AGENTS.md`。新项目建议用 AGENTS.md（跨工具通用）。

</v-click>

---
transition: slide-up
---

# 多 Provider：25+ 选择

| Provider | 模型示例 | 适合 |
| --- | --- | --- |
| `anthropic` | Opus 4.7 / Sonnet 4.6 / Haiku 4.5 | 编码（最强） |
| `openai` | GPT-5 / o-series | 推理 / 数学 |
| `google` | Gemini 2.5 Pro | 长上下文（1M） |
| `deepseek` | V3 / Coder | 大陆友好 + 便宜 |
| `groq` | Llama 70B 极快 | 流式响应快 |
| `cerebras` | Llama 70B | 最快推理 |
| `ollama` | 本地任何开源模型 | 完全本地 |
| `claude-pro` | OAuth Pro/Max | 走订阅 |

<v-click>

完整支持 25+ provider，含 xAI / OpenRouter / Cloudflare / Hugging Face / 通义 / Kimi / MiniMax / Mistral / Together / Fireworks 等。

</v-click>

---
transition: slide-up
---

# 跨 Provider 切换：保留上下文

```
> 这段代码请用 Opus 重新审视
（pi 提示模型即将切换；上下文保留）

/provider anthropic
/model claude-opus-4-7

> 现在再试着用 Gemini 看看
/provider google
/model gemini-2.5-pro
```

<v-click>

**切换原理**：把对话历史按新模型格式重新打包后继续聊。Anthropic / OpenAI / Google 的消息格式差异 pi-ai 库帮你抹平。

</v-click>

<v-click>

> 💡 **跨 provider 套路**
>
> - **规划用 Opus** → **实施切 Sonnet**（便宜快）
> - **代码生成用 GPT-5** → **审查切 Claude**（互相挑刺）
> - **隐私敏感切 Ollama 本地** → **公开任务回云**
> - **大上下文用 Gemini 2.5 Pro**（1M） → **细节 Anthropic/OpenAI**

</v-click>

---
transition: slide-up
---

# 五种交互模式

| 模式 | 命令 | 适用 |
| --- | --- | --- |
| TUI（默认） | `pi` | 日常交互 |
| Print | `pi -p "..."` | 单次执行 / 脚本 |
| JSON | `pi --json -p "..."` | 结构化输出 / CI |
| RPC | `pi rpc --port 9090` | 嵌入 Web 服务 |
| SDK | `import { Agent }` | 嵌入自家应用 |

<v-click>

```ts
// SDK 模式
import { Agent } from "@earendil-works/pi-agent-core";

const agent = new Agent({
  model: "claude-sonnet-4-6",
  provider: "anthropic",
});

const result = await agent.run("帮我...");
```

</v-click>

<v-click>

适合「**把 pi 当 framework 嵌入自家应用**」（Slack bot / Discord bot / 内部工具）。

</v-click>

---
transition: slide-up
---

# Skills：可复用 Markdown 包

Pi 兼容 [agentskills.io](https://agentskills.io/) 标准

```
~/.config/pi/skills/cypress-skill/
├── SKILL.md              # 主指令
├── examples/
│   ├── good-test.cy.ts
│   └── bad-test.cy.ts
└── snippets/
    └── beforeEach.ts
```

```md
---
name: cypress-skill
description: Use when writing Cypress E2E tests for this project
---

# Cypress 测试规范

E2E 测试必须：
1. 用 test 服务器（端口 10060）
2. ...
```

<v-click>

> 💡 **Claude Code Skills 也能用**
>
> 格式几乎一致——Claude Code 写的 skill 直接放 `~/.config/pi/skills/` 就能用。

</v-click>

---
transition: slide-up
---

# TypeScript Extensions：自定义工具

新工具 + Hooks 用 TS 写

```ts
import type { Extension, ToolContext } from "@earendil-works/pi-agent-core";

export default {
  name: "db-query",
  tools: {
    queryDB: {
      description: "查询应用 PostgreSQL DB",
      schema: { sql: { type: "string" } },
      async execute({ sql }, ctx: ToolContext) {
        const result = await pgClient.query(sql);
        return JSON.stringify(result.rows);
      },
    },
  },
  hooks: {
    onToolCall(name, input, ctx) {
      // 审计：bash 含 "rm -rf /" 时拦截
      if (name === "bash" && input.command.includes("rm -rf /")) {
        throw new Error("Blocked!");
      }
    },
  },
} satisfies Extension;
```

<v-click>

特性：**hot reload**（保存 `.ts` 自动重载）+ 完整 API 访问 + TypeScript 全类型。

</v-click>

---
transition: slide-up
---

# Pi Packages：第三层扩展

打包多个 extensions + skills + prompts + themes 为一个 npm 包

```
my-team-pi/
├── package.json
├── extensions/
│   ├── db-tools/
│   └── slack-bot/
├── skills/
│   ├── code-review/
│   └── tdd/
├── prompts/
│   └── system-prefix.md
└── themes/
    └── ocean.json
```

<v-click>

```bash
pi install @your-org/team-pi
```

整套配置一键装齐——**适合团队 / 企业统一所有人 Pi 环境**。

</v-click>

---
transition: slide-up
---

# Hook 触发顺序

```
session start
  → onSessionStart
  ↓
user message
  → onMessage
  ↓
LLM response with tool calls
  → for each tool call:
      → onToolCall(name, input)
      → execute tool
      → onToolResult(name, output)
  ↓
session end
  → onSessionEnd
```

<v-click>

**典型 Hook 场景**：

- **审计**：所有 bash / edit 记日志
- **限制**：拦截高危命令
- **修补**：edit 后自动 prettier 格式化
- **集成**：onSessionEnd 把 summary 发 Slack

</v-click>

---
transition: slide-up
---

# 会话格式：Tree-structured JSONL

```
~/.config/pi/sessions/<session-id>.jsonl
```

每行一个事件，含 `parent` 字段：

```json
{"type": "message", "role": "user", "content": "...", "id": "msg-1"}
{"type": "message", "role": "assistant", "content": "...", "id": "msg-2", "parent": "msg-1"}
{"type": "tool_call", "name": "read", "id": "tc-1", "parent": "msg-2"}
{"type": "tool_result", "output": "...", "id": "tr-1", "parent": "tc-1"}
{"type": "message", "role": "assistant", "content": "...", "id": "msg-3", "parent": "tr-1"}
```

<v-click>

**parent 字段让会话变成树**：

```bash
# 从特定节点分叉
pi --resume <session-id> --from msg-2

# 同一起点试不同提示，原分支保留
```

</v-click>

---
transition: slide-up
---

# Context Compaction

会话长了自动总结老消息

```
[turn 1-30]   ─── 完整保留 ───
[turn 31-50]  ─── 完整保留 ───
[turn 51-100] → 压缩「在 src/ 扫了 50 文件...」
[turn 101+]   ─── 完整保留 ───
```

<v-click>

触发条件：

- 接近模型 context 上限（80% 阈值）
- 手动 `/compact`

</v-click>

<v-click>

> ⚠️ **Compaction 会丢细节**
>
> 把 50 步操作浓缩成几行总结。长任务做完后**立即让 pi 写 summary.md**，不要全依赖 compaction。

</v-click>

---
transition: slide-up
---

# Pi vs Claude Code

| 维度 | Pi | Claude Code |
| --- | --- | --- |
| 模型 | 25+ provider | 仅 Anthropic |
| 工具数 | 4 个 | 20+ |
| 系统提示 | < 1000 token | 10K+ token |
| MCP | ✗（CLI+README 替代） | ✓ 一类支持 |
| 权限询问 | YOLO 默认 | 四档 |
| 子代理 | bash spawn pi 自己 | Agent 工具内置 |
| Memory | 自管文件 | 自动 Memory 系统 |
| 开源 | MIT | 闭源 |
| 私有部署 | 任意 | Bedrock / Vertex |
| 大陆访问 | 用 DeepSeek / Ollama | 需自备网络 |

<v-click>

**怎么选**：

- **Anthropic 重度 + 想稳定开箱即用** → Claude Code
- **想跨多 provider + 自定义 + 完全开源** → Pi
- **大陆开发者** → Pi（接 DeepSeek / Ollama / 通义）

</v-click>

---
transition: slide-up
---

# Pi vs OpenCode

OpenCode 与 Pi 是同时代的「**多 provider 开源 harness**」竞争者

| 维度 | Pi | OpenCode |
| --- | --- | --- |
| 作者 | Mario Zechner（libGDX） | sst 团队（SST framework） |
| 模型支持 | 25+ provider | 75+（Models.dev 注册表） |
| 工具数 | 4 个（极简） | 完整工具集 |
| MCP | ✗ | ✓ 一类支持 |
| 哲学 | 「If I don't need it, I won't build it」 | 「The open source coding agent」 |
| 子代理 | bash spawn 自己 | 内置 Plan/Build/general/explore/scout |
| 主要语言 | TypeScript | TypeScript + Go |

<v-click>

**怎么选**：

- **想要极简 + 控制力** → Pi
- **想要功能更全 + 开箱即用** → OpenCode

</v-click>

---
transition: slide-up
---

# Pi vs Agent Framework

> ⚠️ **Pi 是 harness 不是 framework**
>
> 「Agent harness」（Pi / Claude Code / OpenCode / Codex / Aider）= 完整端到端 CLI 工具
>
> 「Agent framework」（LangChain / LangGraph / AutoGen / CrewAI）= 库，给你**写自己的 agent 应用**
>
> 两类不直接竞争。但 Pi 的 SDK 模式可当 framework 用。

<v-clicks>

| Framework | 定位 | vs Pi |
| --- | --- | --- |
| LangChain / LangGraph | Python/JS agent 应用框架 | LangChain 是「让你构建」；Pi 是「能直接跑」 |
| AutoGen（微软） | 多 agent 协作框架 | AutoGen 重「多 agent 编排」；Pi 主张「一个 agent + 文件 + bash 就够」 |
| CrewAI | 基于 LangChain 的多 agent 团队框架 | CrewAI 适合「模拟一个公司」；Pi 适合「就是个程序员」 |
| Aider | 开源终端编码 agent（早期） | Aider 是 Pi 精神前辈；Pi 在扩展机制 / 多 provider 更完整 |

</v-clicks>

---
transition: slide-up
---

# 与 Anthropic Managed Agents 关系

> ⚠️ **完全不同的东西**
>
> Anthropic 自家有「Managed Agents」服务——提供 session / harness / sandbox 三层托管基础设施。这是**Anthropic 自家产品**。
>
> Pi 是**第三方开源 harness**，仅把 Anthropic 模型作为多个 provider 之一接入。Pi 不依赖 Managed Agents API。

<v-click>

| 维度 | Pi | Anthropic Managed Agents |
| --- | --- | --- |
| 谁做的 | Mario Zechner / Earendil | Anthropic 官方 |
| 部署 | 本地 / 自托管 | Anthropic 云托管 |
| 模型 | 25+ provider | 仅 Anthropic |
| 协议 | TypeScript SDK | Messages API + beta header |
| 计费 | provider key 直付 | 走 Anthropic 账单 |
| 开源 | MIT | 闭源服务 |

</v-click>

<v-click>

**「Anthropic 的 Pi」是错的**——Anthropic 没有叫 Pi 的产品。

</v-click>

---
transition: slide-up
---

# Anthropic 自家 Harness 架构

Anthropic 2026 年发表的 [Managed Agents 架构](https://anthropic.com/engineering/managed-agents) 文章核心

<v-clicks>

- **三层解耦**：session / harness / sandbox 各自独立
  - **Session**：append-only event log，是真正的「**source of truth**」
  - **Harness**：调 Claude + 路由 tool call 的循环（**stateless**）
  - **Sandbox**：跑 Claude 生成代码的隔离环境
- **failover 友好**：harness 挂了重启 `wake(sessionId)` 从 session 恢复
- **凭据隔离**：sandbox 永远拿不到 token（避免 LLM 生成的恶意代码偷凭据）
- **多 brain 跑同会话**：不同实例的 harness 可同时处理同一 session
- **性能优化**：time-to-first-token 降 60%（p50） / >90%（p95）

</v-clicks>

<v-click>

> 💡 **Pi 与这个不同**
>
> Pi 是「**单进程 harness**」——session 文件 + harness 循环都在你机器上，sandbox 就是你的 bash。Anthropic Managed Agents 是「**云托管解耦版**」。

</v-click>

---
transition: slide-up
---

# OpenClaw：Pi 在通讯场景的产品形态

OpenClaw 是 Mario 后来基于 Pi 做的「**Personal Assistant**」

```
WhatsApp ─┐
Slack    ─┼─→ OpenClaw → pi-agent-core → 各种 LLM
Discord  ─┘                    ↓
                            shared memory + sessions
```

<v-clicks>

- 接进 WhatsApp / Telegram / Discord / Slack / Signal / iMessage / Google Chat / Microsoft Teams
- 共享 memory + 持久化 sessions
- GitHub 上 145K+ stars
- **Pi 是终端工具，OpenClaw 是通讯场景应用**——技术栈完全共用

</v-clicks>

<v-click>

> 💡 **Pi 的 SDK 模式让 OpenClaw 这种产品可行**
>
> 没有 SDK 模式（仅 CLI）就嵌不进 IM 平台。Pi 把 agent runtime 解耦到 `pi-agent-core`，CLI / RPC / SDK 都用同一内核。

</v-click>

---
transition: slide-up
---

# 商业化路线（2026.5）

作者博客 2026-04-08「I've sold out」公开

<v-clicks>

- **公司归属**：Pi 被 Earendil 公司收编，Mario 保留技术决策权
- **核心许可**：MIT 永远不变，**不可协商**
- **三层商业模式**：
  1. **MIT 核心**：永远开源免费（read / write / edit / bash + 核心 SDK）
  2. **Fair Source 增值**：付费但可读源码，2-3 年后转 MIT（暂未推出）
  3. **企业私有特性**：闭源 SaaS（团队管理 / 审计 / 合规）
- **治理**：保持现有开源贡献流程，无 CLA / DCO

</v-clicks>

<v-click>

> 💡 **为什么 Mario 放心「卖身」**
>
> 文章说他**信任 Armin（Earendil 联合创始人）个人**，且**保留产品技术方向决定权**。RoboVM 被 Xamarin 收购最终被微软关掉的经历，让他对收购条款极挑剔。

</v-click>

<v-click>

> ⚠️ **商业承诺有变数**
>
> 即使公司方向变，**MIT 核心是最重要的兜底**——社区可 fork。这是 Mario 反复强调的底线。

</v-click>

---
transition: slide-up
---

# 实战 1：接手陌生项目

```
> 这是个新仓库我刚 clone。先帮我快速理解：
>   1. 项目用什么技术栈？
>   2. 主要功能有哪些？
>   3. 怎么本地起？
```

<v-click>

Pi 流程：

- **bash** `cat package.json` 看依赖
- **read** `README.md`
- **bash** `find . -name "*.tsx" | head -20` 看主要文件
- **bash** `grep -r "app.get\|router.get"` 找路由
- 总结回，**建议写 AGENTS.md** 草稿

</v-click>

<v-click>

注意：Pi 用 bash 解决很多别家用专门 tool 解决的事——**4 个工具的设计哲学体现在每一次使用**。

</v-click>

---
transition: slide-up
---

# 实战 2：紧急 hotfix

```
> 线上报错 "Cannot read property 'name' of undefined"
> 在 /api/users/[id] 路由。
> 帮我查根因 + 修复 + 加测试
```

<v-click>

Pi 流程：

1. **bash** `grep -rn "users/\[id\]"` 找路由
2. **read** 路由文件
3. **edit** 加空值判断
4. **bash** `ls __tests__/` 看测试结构
5. **write** 加测试
6. **bash** `pnpm test` 跑测试

</v-click>

<v-click>

整流程透明可见，**所有 bash 输出原样打印**。比 Claude Code 那种「Claude 内部静默执行」更可观察。

</v-click>

---
transition: slide-up
---

# 实战 3：多文件协同改动

```
> 把整个 quiz-admin 项目里的 console.log 换成自家 logger
```

<v-click>

Pi 流程：

1. **bash** `grep -rn "console\.log" --include="*.ts"` 找所有调用
2. **bash** `wc -l` 看文件数（50+ 文件）
3. **write** `PLAN.md`：列出文件清单 + 替换规则
4. 用户审 PLAN.md
5. 逐文件 **edit** 替换

</v-click>

<v-click>

> 💡 **为什么用 PLAN.md 而不是内置 TodoWrite**
>
> - 持久化 + 可观察 + Git 可追溯
> - 用户可手动改顺序 / 跳过文件
> - 跨会话保留（重启 pi 继续）

</v-click>

---
transition: slide-up
---

# 实战 4：跨 Provider 工作流

```
（DeepSeek 便宜，让它先看大方向）

/provider deepseek
/model deepseek-coder

> 帮我分析 src/components 目录的代码风格，找出
  3 个可改善的设计点

（产出方案后，切 Claude Opus 实施）

/provider anthropic
/model claude-opus-4-7

> 按上面方案改，先改 BaseDialog 组件
```

<v-click>

省钱套路：**便宜模型做规划 / 探索 / 总结，贵模型做精细实施**。Pi 让这变得简单——一份会话穿插不同 model。

</v-click>

<v-click>

每个月省下大量 token 费用，**尤其大陆开发者用 DeepSeek + 偶尔切 Claude 的混合策略**。

</v-click>

---
transition: slide-up
---

# 实战 5：本地 Ollama 隐私场景

```
/provider ollama
/model qwen2.5-coder:32b

> 帮我重构 src/secrets.ts 模块，加密逻辑
  不能离开本地（含真实 key）
```

<v-click>

**完全本地运行**：

- 代码 / 凭据不出本机
- 没有云 API 调用
- 等推理速度

</v-click>

<v-click>

适合**金融 / 政企 / 涉密项目**——Claude Code 做不到（必须发 Anthropic 服务）。

</v-click>

<v-click>

> 💡 **Pi 的全开放设计让本地大模型成为一等公民**
>
> 不像有些工具仅「云优先」，Pi 把 Ollama 视作 25+ provider 之一，**API 与 Anthropic 完全一致**。切换零成本。

</v-click>

---
transition: slide-up
---

# 实战 6：JSON Mode 集成 CI

```bash
# 在 GitHub Actions 里跑 pi 做 code review
pi --json -p "review changes in this PR" > review.json

# 解析输出
cat review.json | jq '.messages[-1].content'
```

<v-click>

JSON 输出结构：

```json
{
  "messages": [...],
  "toolCalls": [...],
  "usage": { "inputTokens": 1234, "outputTokens": 567 }
}
```

</v-click>

<v-click>

适合：

- CI 里自动 review / lint 检查
- 测试 fixture 生成
- 自动文档撰写
- 内部工具的 LLM 调用层

</v-click>

---
transition: slide-up
---

# Slash 命令完整列表

| 命令 | 作用 |
| --- | --- |
| `/help` | 显示所有 slash 命令 |
| `/model <id>` | 切换模型 |
| `/provider <name>` | 切换 provider |
| `/clear` | 清空会话 |
| `/compact` | 手动压缩历史 |
| `/usage` | 看 token 用量 |
| `/sessions` | 看会话列表 |
| `/resume <id>` | 恢复会话 |
| `/skills` | 列已加载 skills |
| `/extensions` | 列已加载 extensions |
| `/<custom>` | 用户/扩展自定义命令 |
| `/quit` | 退出 |

---
transition: slide-up
---

# CLI Flag 全集

```bash
pi [prompt] [flags]
```

| Flag | 说明 |
| --- | --- |
| `-h, --help` | 帮助 |
| `-v, --version` | 版本 |
| `-p, --print <prompt>` | Print 模式 |
| `--json` | JSON 输出 |
| `--model <id>` | 指定模型 |
| `--provider <name>` | 指定 provider |
| `--tools <list>` | 限工具集（`read,bash`） |
| `--session <path>` | 加载会话文件 |
| `--resume <session-id>` | 恢复会话 |
| `--from <message-id>` | 从节点分叉 |
| `--dry-run` | 不调 LLM |
| `--debug` | 详细日志 |
| `--no-extensions` | 跳过扩展 |
| `--no-skills` | 跳过 skills |

---
transition: slide-up
---

# 环境变量

| 变量 | 作用 |
| --- | --- |
| `ANTHROPIC_API_KEY` | Anthropic key |
| `OPENAI_API_KEY` | OpenAI key |
| `GEMINI_API_KEY` | Google key |
| `DEEPSEEK_API_KEY` | DeepSeek key |
| `GROQ_API_KEY` | Groq key |
| `OLLAMA_BASE_URL` | Ollama 地址 |
| `PI_CONFIG_DIR` | 配置目录覆盖 |
| `PI_LOG_LEVEL` | debug / info / warn / error |
| `PI_NO_TELEMETRY` | 1 禁用遥测 |
| `HTTPS_PROXY` / `HTTP_PROXY` | 代理 |

---
transition: slide-up
---

# 性能优化

<v-clicks>

- **大仓库**：用 Gemini 2.5 Pro（1M 上下文）规划，切 Sonnet 实施
- **多文件读取慢**：让 pi 一次发多个 read（一个 turn 多 tool call）
- **Bash 慢**：长跑命令必须 tmux 后台（同步 bash 会卡住 turn）
- **Compaction 频繁**：及时 `/clear` 或主动写 summary.md
- **多 provider 启动慢**：`auth.json` 不要塞过多家
- **本地 Ollama 慢**：小模型（qwen 7B）做简单任务，复杂切云

</v-clicks>

---
transition: slide-up
---

# 故障排查

| 现象 | 排查 |
| --- | --- |
| `Authentication failed` | `pi auth login` 重做 / 检查 env var |
| 模型响应被截断 | 接近 context 上限 → `/compact` |
| Extension 不加载 | 路径对吗 + 看 `pi --debug` 日志 |
| Skill 不被识别 | SKILL.md frontmatter 对吗 |
| Bash 卡死 | 长任务必须 tmux 后台 |
| `provider not found` | `auth.json` 没配那个 provider 凭据 |
| Hot reload 失效 | 改 package.json 需重启 pi |

---
transition: slide-up
---

# 安全考量

<v-clicks>

- **YOLO 默认要自警**：陌生仓库先看 `AGENTS.md` 内容 / `pi --tools read,bash` 限工具
- **AGENTS.md 是 prompt injection 面**：克隆陌生仓库时先看一眼
- **Extension 是代码执行点**：装 npm extension 前看源码
- **多 provider key 集中**：`auth.json` 默认 chmod 600，别 commit
- **会话 JSONL 可能含敏感数据**：分享前过滤

</v-clicks>

---
transition: slide-up
---

# 版本里程碑

| 版本 | 时间 | 主要变化 |
| --- | --- | --- |
| 0.1 | 2025-09 | 内部使用版 |
| 0.20 | 2025-11 | 作者发设计博客 |
| 0.40 | 2025-12 | 扩展系统稳定 |
| 0.50 | 2026-01 | OpenClaw 上线 |
| 0.60 | 2026-02 | RPC / SDK / JSON mode 完善 |
| 0.70 | 2026-04 | 加入 Earendil 公司 |
| 0.74 | 2026-05 | 当前版本 |

<v-click>

> ⚠️ **仍是 0.x**
>
> Pi 仍是 0.x 版本——API 可能 breaking change。生产用务必 pin 版本。

</v-click>

---
transition: slide-up
---

# 学习路径

<v-clicks>

**Week 1 — 上手**

- 装 + 配一个 provider（推荐 DeepSeek 大陆友好）
- 第一次对话，体会 4 工具透明性
- 写 `AGENTS.md`，看模型如何遵守规范

**Week 2 — 多 Provider**

- 配 2-3 个 provider，体会 mid-session 切换
- 跨 provider 工作流（DeepSeek 规划 + Claude 实施）
- 试 Ollama 本地模型

**Week 3 — 扩展**

- 装一个 community Skill（如 superpowers）
- 自己写第一个 TypeScript Extension（新 tool）
- 配 `auth.json` + 全部 provider

**Week 4 — 嵌入**

- JSON mode 接 CI
- RPC mode 起 server
- SDK 嵌入自家应用

</v-clicks>

---
transition: slide-up
---

# 资源链接

| 资源 | 链接 |
| --- | --- |
| 官网 | [pi.dev](https://pi.dev/) |
| GitHub | [earendil-works/pi](https://github.com/earendil-works/pi) |
| npm 包 | [@earendil-works/pi-coding-agent](https://www.npmjs.com/package/@earendil-works/pi-coding-agent) |
| 设计博客 | [mariozechner.at/posts/2025-11-30-pi-coding-agent](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/) |
| 商业化公告 | [mariozechner.at/posts/2026-04-08-ive-sold-out](https://mariozechner.at/posts/2026-04-08-ive-sold-out/) |
| Skills 标准 | [agentskills.io](https://agentskills.io/) |
| 对比阅读 | [Anthropic Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview) |
| libGDX | [libgdx.com](https://libgdx.com/)（作者另一项目） |

---
layout: center
class: text-center
---

# 总结

把 Pi 当 **极简、透明、可控** 的 agent harness 用

<div class="mt-6 text-left max-w-2xl mx-auto text-base op-90">

- **极简**：4 工具 + < 1K token 系统提示 = 给模型留更多上下文
- **多 Provider**：25+ provider，mid-session 切模型保留上下文
- **可扩展**：Skills（Markdown） + Extensions（TS） + Pi Packages（npm）
- **多模式**：TUI / Print / JSON / RPC / SDK 五种交互
- **完全开源**：MIT 永远不变，可自托管 / 内嵌 / 商用

</div>

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://pi.dev/" target="_blank">pi.dev</a>
</div>

<div class="mt-4">
  <carbon:logo-github /> <a href="https://github.com/earendil-works/pi" target="_blank">earendil-works/pi</a>
</div>
