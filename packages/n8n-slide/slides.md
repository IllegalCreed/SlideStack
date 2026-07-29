---
theme: seriph
background: https://cover.sli.dev
title: n8n 完全指南
info: |
  n8n 完全指南：开源工作流自动化 · 70+ AI 节点 · AI Agent / Chain / Memory / Tools / RAG · Cloud / Self-hosted

  Learn more at [https://docs.n8n.io](https://docs.n8n.io)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## n8n 完全指南

开源工作流自动化 · 70+ AI 节点 · AI Agent / Chain · Cloud / Self-hosted

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
n8n 是 fair-code 的工作流自动化平台，2024-2026 持续加 AI 节点，已成 LLM 嵌入业务流程自动化的主流方案。
-->

---
transition: fade-out
---

# 什么是 n8n

开源的**工作流自动化平台**

- **fair-code 许可**：Sustainable Use License，自托管可自由内部使用
- **节点式编排**：1000+ 内置集成覆盖 SaaS / DB / IM / 文件 / HTTP 兜底
- **AI 嵌入式**：70+ LangChain.js AI 节点（Agent / Chain / Memory / Tools / Vector Store）
- **Code 节点兜底**：JS / Python 自定义代码，从无代码到低代码平滑过渡
- **部署灵活**：Cloud 托管 vs Self-hosted（Docker / Compose / npm / K8s）
- **MCP 集成**：MCP Client / Trigger 接入 Model Context Protocol 生态

> n8n ≠ LLM 应用构建器（Dify / Flowise）≠ AI Agent SDK（LangChain）。

<!--
n8n 核心定位是「把 AI 嵌进既有业务流程自动化」，不是纯 AI 应用工具。
-->

---

# 核心抽象

| 抽象 | 含义 |
|------|------|
| **Node** | 工作流执行单元；Trigger（触发）+ Regular（动作） |
| **Trigger** | 入口：Manual / Webhook / Schedule / Chat / Polling / MCP |
| **Connection** | 节点间数据流；扇出 / 循环 / 错误分支 |
| **Item** | 数据单元，含 `json`（结构化）+ `binary`（文件 / 媒体） |
| **Execution** | 一次完整运行；manual（调试）vs production（Trigger 触发） |
| **Credential** | 外部服务认证，AES-256 加密（密钥 = `N8N_ENCRYPTION_KEY`） |

> Item 是 n8n 数据流的原子单位，节点按 Item 数组迭代执行。

<!--
理解 Item 与 Execution 才能解释为何一节点可输出多条结果。
-->

---

# 节点全景

| 类别 | 代表节点 |
|------|------|
| **Trigger** | Manual / Webhook / Schedule / **Chat Trigger** / Polling / MCP / Evaluation |
| **HTTP / 网络** | HTTP Request（万能兜底） |
| **数据库** | Postgres / MySQL / MongoDB / Redis / Snowflake / MS SQL |
| **SaaS 集成** | Slack / Gmail / Notion / GitHub / Google Sheets 等 1000+ |
| **数据变换** | Set / Code（JS+Python）/ Filter / Item Lists / Merge / Split In Batches |
| **流程控制** | IF / Switch / Loop / Sub-workflow / Error Trigger |
| **AI 节点族** | AI Agent / LLM Chain / Chat Model / Memory / Tools / Vector Store |

> 没有内置集成时优先 HTTP Request，复杂逻辑用 Code 节点。

<!--
Code 节点 + HTTP Request 是「兜底双保险」，让 n8n 几乎能做任何事。
-->

---
layout: two-cols
---

# AI 节点族（Root）

**AI Agent（决策型）**

- 用 LLM 决定调用哪个工具 + 参数
- **必接 Chat Model**
- 可选 Memory / Tools（多个）/ Vector Store
- 支持 Tools / Conversational / ReAct 等多类型
- 循环执行（输入 → 选工具 → 执行 → 评估 → 回复）

**Basic LLM Chain（预定义）**

- 固定 LLM 调用顺序，单次执行
- **不支持 Memory、不支持 Tools**
- 每次请求独立
- 通过 System Message 配置提示词
- 快、省

::right::

# AI 节点族（Sub-node）

**Chat Model**

- OpenAI / Anthropic / Gemini
- Mistral / Alibaba Qwen / MiniMax

**Memory（仅 Agent）**

- Window Buffer（开发）
- Postgres / Redis（生产）
- Zep / Motorhead / Xata

**Tools**

- Wikipedia / SerpAPI / Calculator
- HTTP Request Tool / Custom Code Tool
- **Call n8n Workflow Tool**（最大复用）

**Vector Store**

- Pinecone / Qdrant / Milvus
- pgvector / Supabase / In-Memory

<!--
Agent vs Chain 的本质差异：决策能力 + Memory/Tools 支持。
-->

---

# Agent vs Chain 选型

| 维度 | AI Agent | Basic LLM Chain |
|------|------|------|
| **执行** | 决策型、循环 | 预定义序列、单次 |
| **必接** | Chat Model | Chat Model |
| **Memory** | ✓ | **✗（架构限制）** |
| **Tools** | ✓ | **✗** |
| **成本** | 慢、贵 | 快、省 |
| **场景** | 多轮对话 / 多工具 / 决策 | 提示词 → 响应固定流程 |

**选型口诀**

- 动态决策 / 多工具 / 多轮对话 → **Agent**
- 提示词 → 响应固定流程 → **Chain**

> 把 Agent 当 Chain 用（单轮无工具）是常见反模式——浪费循环成本。

<!--
Chain 接 Memory / Tools 不生效，这是架构性限制而非配置问题。
-->

---
layout: two-cols
---

# Memory 子节点

仅 Agent 节点能用，Chain 接了不生效

| Memory | 适用 |
|------|------|
| **Window Buffer** | 开发 / 原型 |
| **Postgres Chat Memory** | 生产、跨会话 |
| **Redis Chat Memory** | 高吞吐 |
| **Zep** | 长期记忆 / 画像 |
| **Motorhead (Metal)** | Metal 用户 |
| **Xata** | 跨会话 + 向量化 |
| **Chat Memory Manager** | 检查 / 裁剪 / 注入伪消息 |

::right::

# 反模式

- 对话型 Agent **不接 Memory**
  - 每次请求独立，无法回忆上文
- 生产用 **Window Buffer**
  - 跨实例丢数据，应换 Postgres / Redis
- Memory 接到 Chain
  - 接了不生效，需要切到 Agent

> 生产推荐：**Postgres Chat Memory**（与元数据库复用同一 Postgres）。

<!--
Memory 选型的核心是「会话级 vs 跨会话持久化」。
-->

---

# Tools 子节点 + Tool Calling

**内置 Tools**

| Tool | 用途 |
|------|------|
| **Wikipedia** | 查维基百科 |
| **SerpAPI** | 搜索引擎结果 |
| **Calculator** | 数学计算（避免 LLM 算错） |
| **HTTP Request Tool** | 调任意 API / 抓网页 |
| **Custom Code Tool** | JS / Python 自定义代码 |
| **Call n8n Workflow Tool** | **把任意工作流当工具暴露**（最大复用） |

**Tool Calling 关键**：`$fromAI(description, type)` 让 Agent 运行时根据用户输入**动态填参数**

> 静态参数无法处理多变的自然语言输入；`$fromAI` 是 Tool Calling 的关键模式。

<!--
Call n8n Workflow Tool 是核心复用模式：把稳定子流程封装为 Workflow，再暴露给 Agent 调用。
-->

---

# Vector Store + RAG 五步

```text
[Document Loaders]   ← 拉数据：PDF / Web / Text / Notion
        ↓
[Text Splitters]     ← 分块：Token / Character / Recursive / Markdown
        ↓
[Embeddings]         ← 向量化（仅文本，不支持图像 / 音频）
        ↓
[Vector Store]       ← Pinecone / Qdrant / Supabase / Milvus / pgvector / In-Memory
        ↓
[Retriever]          ← 检索相似上下文喂回 Agent / Chain
```

> **反模式**：把全部私有数据塞 prompt 上下文——窗口有限、token 爆炸、注意力衰减。

<!--
RAG 是把 LLM 锚定到私有数据的标准模式，比塞 prompt 既准又省。
-->

---

# Chat Trigger / MCP / Guardrails

**Chat Trigger**

- 面向 AI 的对话入口（接收用户消息触发）
- 配合 ChatHub / AI Assistant 使用

**MCP Client / Trigger**

- 对接 Model Context Protocol 服务器
- 把外部 MCP 工具 / 资源接入工作流
- n8n 也可作为 MCP 服务器被外部调用

**Guardrails**

- 为 AI 输入 / 输出加结构化校验
- **防 prompt 注入**（用户输入恶意指令）
- 限定工具入参范围（如 HTTP Request Tool 禁内网 IP）

> Tool 不加 Guardrails 直接暴露是常见安全漏洞。

<!--
MCP 是 2024-2025 关键集成趋势，让 n8n 与外部 Agent / IDE 共享工具与资源。
-->

---

# Evaluation 与 AI 测试体系

AI 输出随机，凭肉眼调 prompt 容易回归。官方建议四步：

1. **Why test**：理解为什么必须测
2. **Run quick evaluations**：用 Evaluation 节点 + Trigger 跑测试集
3. **Use metrics**：accuracy / latency / token cost / faithfulness 量化
4. **Fix common issues**：基于评估修常见问题

| 节点 | 用途 |
|------|------|
| **Evaluation Trigger** | 触发测试集执行 |
| **Evaluation** | 跑评估、对比预期 vs 实际输出 |
| **AI Transform** | 用 LLM 做批量数据变换 |

> 改 prompt 必须跑 Evaluation——这是 AI 工程化的标配。

<!--
没 Evaluation 流程的 AI 工作流，等于「凭感觉上线」。
-->

---
layout: two-cols
---

# 部署：Cloud

**n8n Cloud**

- 托管、自动升级、零运维
- 起步 €20/月（Starter）
- 内置监控、托管数据库
- 全部 AI 节点可用
- **限制**：环境变量有限
  - 数据库结构、自定义安全、scaling 受限
  - 深度定制必须切 Self-hosted

**适用**

- 不想运维 / 团队上手
- 小规模、低合规需求

::right::

# 部署：Self-hosted

**Docker / Compose / K8s / npm**

- 完全控制版本 / 升级 / 备份 / 监控
- 完全控制环境变量 / 安全 / 扩缩容
- 完全控制数据库结构 / 自定义 SECRET
- **官方推 Docker 优先**
  - 社区讨论 sunset npm-native
  - 生产请用 **Docker + 独立 Postgres**

**适用**

- 生产 / 大规模
- 高合规 / 内网部署

> 选型：不想运维 → Cloud；要控制 → Self-hosted。

<!--
npm 仅用于原型；生产 Docker + Postgres 是社区共识。
-->

---

# Docker 速跑

```bash
# 轻量版（仅原型，SQLite + 单容器）
docker run -it --rm \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n

# 访问 http://localhost:5678 完成初始化
```

**生产关键环境变量**

- `N8N_ENCRYPTION_KEY`：凭据 AES-256 加密密钥（**生产必自定**）
- `DB_TYPE=postgresdb` + `DB_POSTGRESDB_*`：切到 Postgres
- `WEBHOOK_URL` / `N8N_HOST` / `N8N_PROTOCOL`：Webhook / OAuth 回调
- `EXECUTIONS_DATA_PRUNE` + `EXECUTIONS_DATA_MAX_AGE`：清理历史执行

> npm 启动仅用于原型：`npx n8n`。社区在推 Docker 优先。

<!--
N8N_ENCRYPTION_KEY 不自定会导致凭据密钥可被破解。
-->

---

# 与同类工具的边界

| 工具 | 与 n8n 边界 |
|------|------|
| **Dify** | Dify 强在 LLM 应用 / RAG 快速搭；n8n 强在深度自动化 + 1000+ 非 AI 集成。**LLM 嵌业务流程用 n8n**，**纯 AI 问答用 Dify** |
| **Zapier** | 闭源 SaaS、集成最多、最易上手、规模化最贵；n8n 开源可自托管、便宜、灵活 |
| **Make** | 视觉逻辑强、价格中档；n8n 自托管 + 代码节点对开发者更友好 |
| **LangChain** | LangChain 是代码 SDK；n8n AI 节点族底层就是 LangChain.js |
| **Flowise** | LangChain 的可视化壳；n8n 是自动化平台 + LangChain 节点族 |

> 纯 AI 应用 → Dify / Flowise；纯代码 Agent → LangChain；**LLM + 业务流程自动化 → n8n**。

<!--
选型第一步是定位：你要的是「LLM 应用」还是「业务流程自动化 + LLM」。
-->

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 给 Chain 节点接 Memory / Tools（架构性不生效）
- 把全部私有数据塞 prompt 上下文（应走 RAG）
- 用 npm 长期支撑生产自托管（请用 Docker + Postgres）
- 改 prompt 不跑 Evaluation（凭肉眼会掩盖回归）
- 把 Agent 当 Chain 用（单轮无工具，浪费循环成本）
- Tool 不加 Guardrails 直接暴露（SSRF / prompt 注入）
- 在 Cloud 上做深度定制（应切 Self-hosted）
- 对话型 Agent 不接 Memory（生产换 Postgres / Redis / Zep）
- License 边界忽视（fair-code 与 n8n 竞争的商业产品 / 托管有限制）

<!--
License 边界是 fair-code 的关键：内部使用自由，竞品托管有限制。
-->

---
layout: center
class: text-center
---

# 小结

n8n = LLM + 业务流程自动化引擎

可视化节点 · 70+ AI 节点 · AI Agent / Chain / Memory / Tools / RAG · Cloud / Self-hosted

**Agent vs Chain 选型 · Memory 仅 Agent · $fromAI 动态参数 · Evaluation 必跑**

[文档](https://docs.n8n.io) · [GitHub](https://github.com/n8n-io/n8n) · [Cloud](https://n8n.io/cloud/)

<!--
掌握 Agent vs Chain、Memory 仅 Agent、$fromAI、RAG 五步 + Evaluation 流程，就能把 n8n 用到生产水准。
-->
