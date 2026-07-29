---
theme: seriph
background: https://cover.sli.dev
title: Dify 完全指南
info: |
  开源 AI 应用编排 / LLMOps 平台 · Workflow / Chatflow / Agent / RAG · v1.16.0

  Learn more at [https://docs.dify.ai](https://docs.dify.ai)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Dify 完全指南

开源 AI 应用编排 / LLMOps 平台 · Workflow · Chatflow · Agent · RAG · v1.16.0

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Dify 由 Langgenius 团队维护，Apache 2.0 开源，2026-07-17 发布当前稳定版 v1.16.0。
-->

---
transition: fade-out
---

# 什么是 Dify

开源的 **AI 应用编排 / LLMOps 平台**

- **应用编排器**：Workflow / Chatflow / Agent 可视化节点编排
- **LLMOps 平台**：模型管理、知识库、监控、版本控制、密钥管理
- **多 Provider 中立**：OpenAI / Anthropic / Google / 通义 / DeepSeek / Ollama 统一抽象
- **多形态输出**：Web App / REST API / MCP Server / Marketplace / difyctl CLI
- **DSL 迁移**：所有应用导出 YAML，跨实例迁移 / 版本控制
- **自托管 / 云 / 企业版**：社区版 Docker Compose、Cloud SaaS、Enterprise

> Dify ≠ 底层 LLM。它编排模型 / RAG / Agent / 工具，本身不训练模型。

<!--
强调 Dify 是「编排 + 运营」而非「模型本身」。
-->

---

# 四种应用类型

| 类型 | 触发 | 结束 | Memory |
|------|------|------|------|
| **Workflow** | 一次性 / Trigger | Output | 无 |
| **Chatflow** | 每轮对话 | Answer（必需） | 节点级 |
| **Agent（Beta v1.16.0）** | Workflow / 独立 chat | text/files/json | 无 |
| **Chatbot（legacy）** | chat 模式 | — | 有 |
| **Text Generator（legacy）** | completion 模式 | — | 无 |

**选型第一问**：是否多轮？

- 多轮对话 → **Chatflow**
- 批处理 / 定时 / Webhook → **Workflow**
- 工具编排 / 复杂研究 → **Agent**

<!--
Chatflow 无 Answer 报错；Workflow 选错就无 Trigger；Agent 不留记忆。
-->

---

# Start 节点两种模式

| 模式 | 用途 | 可发布形态 |
|------|------|------|
| **User Input** | 用户主动发起 | webapp / MCP server / backend API / Tool |
| **Trigger** | 自动触发 | Schedule / Webhook / Integration |

**只有 User Input** 才能发布为 webapp / MCP / API / Tool

**Trigger 三类**：

- **Schedule Trigger**：定时跑数据清洗
- **Webhook Trigger**：接 GitHub PR、外部系统事件
- **Integration Trigger**：接 Zapier / n8n 等

> 选错模式 → Workflow 无法被定时触发。

<!--
User Input vs Trigger 是 Dify 工作流的两个根本入口。
-->

---

# 节点全景

| 类别 | 节点 |
|------|------|
| **入口 / 出口** | Start / Answer / Output |
| **模型** | LLM / Agent |
| **RAG** | Knowledge Retrieval / Doc Extractor |
| **逻辑** | IF/ELSE / Iteration / Loop |
| **数据处理** | Code / Template(Jinja2) / Parameter Extractor / Question Classifier |
| **变量** | Variable Aggregator / Variable Assigner / List Operator |
| **外部** | HTTP Request / Tool |
| **HITL** | Human Input(v1.13.0+) / Trigger |

**Iteration 并行模式**：最大并行度 **10**，加速批处理

<!--
节点类型按职责划分，记住「入口 / 模型 / RAG / 逻辑 / 数据 / 变量 / 外部 / HITL」八类。
-->

---

# RAG 三件套

**生产可用标配**：High Quality 索引 + Hybrid Search + Rerank

| 维度 | 取值 |
|------|------|
| **索引** | High Quality（向量化） vs Economical（倒排） |
| **分段** | General / Parent-child |
| **检索** | Vector / Full-Text / Hybrid / Inverted |
| **Top K** | 默认 **3** |
| **Score Threshold** | 默认 **0.5**（仅 Rerank 阶段生效） |

> High Quality ↔ Economical **创建后不可互换**；Economical 只有关键词匹配。

<!--
Economical 选错就只能重建，这是社区公认的头号反模式。
-->

---
layout: two-cols
---

# Hybrid Search 权重

**Weight Settings vs Rerank Model**：文档明确 **二选一**

- 同时配置 = 冲突，不是增强
- **Semantic = 1** → 退化为纯向量
- **Keyword = 1** → 退化为纯关键词
- 自定义权重 → 两路召回平衡

> 别把 Semantic=1 当成「同时启用两路」。

::right::

# LLM 节点要点

- **Temperature** 0-1（0 最确定）
- **Prompt**：`{{var}}` + Jinja2
- **Context** 关联 Knowledge Retrieval → RAG
- **Structured Output**：JSON Schema
- **VISION**：High / Low detail
- **Memory**：仅 Chatflow，节点级
- **reasoning tag**：`<think>` 分离

> Structured Output 优先 JSON Schema，下游才能稳定解析。

<!--
Hybrid 权重与 LLM 配置是生产环境最常踩的坑。
-->

---

# Agent 两种策略

| 策略 | 原理 | 适用模型 |
|------|------|------|
| **Function Calling** | 模型原生 FC API | GPT-4 / Claude / 部分 Google |
| **ReAct** | Thought→Action→Observation 提示工程 | 任意模型（含开源） |

**Agent 节点输出字段**：

- **Final Answer** / **Tool Outputs**
- **Reasoning Trace** / **Iteration Count**
- **Success Status** / **Agent Logs**

> FC 策略配在不支持原生 FC 的模型上 → 调用失败；必须切 ReAct。

<!--
Agent 选型先看模型是否原生支持 FC。
-->

---
layout: two-cols
---

# 变量系统 4 种

| 类型 | DSL 解耦 | 用途 |
|------|------|------|
| **Inputs** | 否 | 用户输入 |
| **Outputs** | 否 | 节点间传递 |
| **Environment Variables** | **是** | 密钥 / API Key |
| **Conversation Variables** | 否 | Chatflow 跨轮持久化 |

> 密钥写进 Prompt 会随 DSL 泄露，**必须**放 Environment Variables。

::right::

# 系统变量

**Workflow 通用**：

- `sys.user_id`
- `sys.app_id`
- `sys.workflow_id`
- `sys.workflow_run_id`
- `sys.timestamp`

**Chatflow 额外**：

- `sys.conversation_id`
- `sys.dialogue_count`

<!--
Environment Variables 与 DSL 解耦是 Dify 安全设计的核心。
-->

---

# DSL 与迁移

**所有应用可导出为 YAML（Domain-Specific Language）**

- 跨实例迁移 / 版本控制 / 团队分享
- 自托管可纳入 Git
- Environment Variables 与 DSL 解耦，密钥不随导出泄露

**REST API 端点速查**：

```text
POST /workflows/run        # Workflow 执行
POST /chat-messages        # Chatflow 对话
POST /agents/chat          # Agent 对话（Beta）
POST /completion-messages  # Text Generator
GET  /info                 # 应用元信息
GET  /workflow-runs        # 执行历史
```

> App Key 单应用范围；**Knowledge Base Key 全知识库范围**，泄露后果严重。

<!--
用 user 字段标识终端用户，不为每用户发 Key。
-->

---
layout: two-cols
---

# 模型管理

**5 类模型**：

- System Reasoning（LLM）
- Embedding（向量化）
- Rerank（重排序）
- Speech-to-Text
- Text-to-Speech

**接入方式**：

- Integrations > Model Provider
- Marketplace
- AI Credits + 自带 Key 双轨
- Professional/Team：多 Key 负载均衡

::right::

# 部署与发布

**Docker Compose 部署**：

- ≥ 2 核 CPU
- ≥ 4 GiB 内存
- Docker Compose ≥ 2.24.0
- 7 核心 + 7 依赖服务

**发布渠道**：

- Web App
- REST API
- MCP Server（v1.16.0 升级 2025-06-18）
- Marketplace
- difyctl CLI（v1.15.0）

> GPT-5.6 兼容需切 Responses API。

<!--
社区版沙箱非硬化，高合规选 Cloud/Enterprise。
-->

---

# 版本演进里程碑

| 版本 | 发布 | 关键特性 |
|------|------|------|
| **v1.13.0** | — | Human Input 节点（HITL） |
| **v1.14.x** | 2026-05 | 安全加固（租户隔离 / SECRET_KEY） |
| **v1.15.0** | 2026-06-25 | difyctl CLI / Chain-of-Thought 可视化 |
| **v1.16.0** | 2026-07-17 | Dify Agent Beta / MCP 2025-06-18 |

**v1.16.0 新版 Agent**：

- Linux 沙箱执行（当前单沙箱，未来完全隔离）
- **Capability / Task 分离**
- 可独立 chat 或作 Workflow Agent 节点
- Chatflow 中**不保留对话记忆**

<!--
v1.16.0 是 Agent 升级的关键里程碑。
-->

---
layout: two-cols
---

# Docker Compose 速跑

```bash
# 克隆仓库
git clone https://github.com/langgenius/dify.git
cd dify/docker

# 复制环境变量
cp .env.example .env

# 启动全家桶
docker compose up -d
```

**最低配置**：

- ≥ 2 核 / ≥ 4 GiB
- Docker Compose ≥ 2.24.0
- 7 核心 + 7 依赖服务

::right::

# REST API 速跑

```bash
# Workflow 执行
curl -X POST 'https://api.dify.ai/v1/workflows/run' \
  -H 'Authorization: Bearer {api_key}' \
  -H 'Content-Type: application/json' \
  -d '{"inputs": {"q": "Dify 是什么"},
     "response_mode": "streaming",
     "user": "user-123"}'
```

**关键约定**：

- Base URL：云端 `https://api.dify.ai/v1`
- `user` 标识终端用户
- App Key 单应用；KB Key 全库
- Key 仅后端，不嵌前端

<!--
最低 2 核 4G，Compose 2.24.0+；user 字段是 Dify API 的核心约定。
-->

---
layout: quote
---

# 选错索引不可逆

「Economical 一旦上线，语义召回差就只能重建——High Quality 与 Economical 创建后**不可互换**。」

---

layout: center
class: text-center

---

# 反模式与陷阱

**最易踩的坑**

- Economical 索引上线后想要语义检索精度（不可互换）
- Hybrid Search 同时配 Weight Settings 与 Rerank（二选一）
- 把 Hybrid 的 Semantic=1 当「同时启用两路」（退化为单路）
- 盲目缩小 chunk 求基准高分（生产上下文拼不上）
- Chatflow 中期待新版 Agent 自动保留记忆（每条消息从零）
- Function Calling 配在不支持原生 FC 的模型上
- Agent 不设 Maximum Iterations（死循环）
- API Key 嵌入前端（Knowledge Base Key 泄露后果严重）
- 自托管升级直接覆盖 .env（必须对比 .env.example）

<!--
跑生产前先把这些反模式逐条核查。
-->

---
layout: center
class: text-center
---

# 小结

Dify = AI 应用编排 / LLMOps 平台

Workflow · Chatflow · Agent · RAG · v1.16.0

**High Quality + Hybrid + Rerank · Environment Variables 存密钥 · Agent 必设 Iterations**

[文档](https://docs.dify.ai) · [GitHub](https://github.com/langgenius/dify) · [Releases](https://github.com/langgenius/dify/releases)

<!--
掌握应用类型选型 + RAG 三件套 + Agent 策略匹配，就能把 Dify 用到生产水准。
-->
