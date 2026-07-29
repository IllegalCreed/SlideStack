---
theme: seriph
background: https://cover.sli.dev
title: LangChain 完全指南
info: |
  LangChain 完全指南：LLM 应用编排 · LCEL · create_agent · LangGraph · LangSmith · 1.0 LTS

  Learn more at [https://docs.langchain.com](https://docs.langchain.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## LangChain 完全指南

LLM 应用编排框架 · 生态四件套 · LangChain 1.0 LTS

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
LangChain 1.0 + LangGraph 1.0 于 2025-10 正式发布 LTS 稳定版。
-->

---
transition: fade-out
---

# 什么是 LangChain

面向**大语言模型应用**的编排框架

- **抽象层**：统一 Runnable 接口，`invoke` / `batch` / `stream`
- **集成层**：跨模型提供商（OpenAI / Anthropic / Gemini / Ollama）
- **组合语法 LCEL**：`prompt | model | parser` 用管道符串联
- **编排运行时 LangGraph**：状态图，支持循环 / 分支 / HITL
- **观测层 LangSmith**：设环境变量即自动追踪
- **1.0 LTS**：2025-10 发布，支持到 2026-12

> LangChain ≠ LangGraph：前者是 agent 抽象 + 集成层，后者是底层状态图运行时。

<!--
强调两者的边界：LangGraph 可独立于 LangChain 使用。
-->

---

# 生态四件套

| 包 | 角色 | 何时用 |
|------|------|------|
| **langchain** | agent 抽象 + 集成层 | 需要 Model / Tool / RAG 组件 |
| **langchain-core** | Runnable 接口 / Prompt / Parser | 定义自己的 Runnable |
| **langgraph** | StateGraph 编排运行时 | 循环 / 分支 / HITL / 持久化 |
| **langsmith** | 观测 / 评估 / Experiments | 任何时候（设环境变量） |

**版本状态**

- LangChain 1.0 + LangGraph 1.0：2025-10 LTS
- 2.0 发布前无破坏性变更
- 安装：`pip install -U langchain langchain-core langgraph`

<!--
LCEL 跨 langchain + langchain-core；LangSmith 横跨两者。
-->

---

# LCEL Runnable 接口

所有组件实现统一接口，管道符 `|` 串联

- 同步：`invoke(x)` / `batch([...])` / `stream(x)`
- 异步：`ainvoke` / `abatch` / `astream` / `stream_events`
- 增强：`with_retry()` / `with_fallbacks([...])`

**四基础 Runnable**

| 组件 | 作用 |
|------|------|
| `RunnablePassthrough` | 透传输入 |
| `RunnableParallel` | 并行字典 |
| `RunnableLambda` | 包普通函数 |
| `RunnableAssign` | 写入字典键 |

> 串联后自动获得 batch / async / streaming / 重试 / fallbacks。

<!--
重点：声明式串联，组件级能力免费送。
-->

---
layout: two-cols
---

# LCEL 最小例子

跨提供商 + 管道符串联

```text
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

model = init_chat_model(
    model="gpt-4o-mini",
    model_provider="openai",
)

prompt = ChatPromptTemplate.from_template(
    "用一句话解释 {topic}"
)
chain = prompt | model | StrOutputParser()

print(chain.invoke({"topic": "LangGraph"}))
```

::right::

# 结构化输出

**首选** `with_structured_output`

```text
from pydantic import BaseModel, Field

class City(BaseModel):
    name: str = Field(description="城市名")
    population: int

structured = model.with_structured_output(City)
city = structured.invoke("北京")
print(city.name, city.population)
```

走 tool/function calling，准确率远高于 prompt 引导 + 字符串解析。

<!--
with_structured_output 是 1.0 推荐写法。
-->

---

# @tool 装饰器

用 docstring + 类型注解自动生成 schema

```text
from langchain_core.tools import tool

@tool
def search_weather(city: str) -> str:
    """查询指定城市的实时天气。

    Args:
        city: 城市名（中文或英文）
    """
    return f"{city} 今天晴，25°C"
```

**关键约束**

- 必须有**完整类型注解**（缺失则 args_schema 失败）
- docstring 是**给模型看的 description**
- 复杂参数用 `args_schema=PydanticModel`
- 访问 state / store 用 `ToolRuntime`（对模型隐藏）

<!--
模型是否正确调用工具，几乎完全取决于 description 质量。
-->

---

# create_agent：1.0 标准

取代旧 `AgentExecutor`，底层基于 LangGraph

```text
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver

agent = create_agent(
    model,
    tools=[add, search],
    system_prompt="你是计算助手。",
    middleware=[SummarizationMiddleware(...)],
    checkpointer=InMemorySaver(),
)

config = {"configurable": {"thread_id": "user-001"}}
agent.invoke({"messages": [{"role": "user", "content": "3+5"}]}, config)
```

> 不要再用 `AgentExecutor` / `create_openai_tools_agent`——已弃用。

<!--
create_agent 原生支持 durable execution / streaming / HITL。
-->

---

# Middleware：扩展主范式

`create_agent` 用钩子扩展行为

| 钩子 | 触发时机 | 典型用途 |
|------|------|------|
| `@before_model` | 调模型前 | 敏感词过滤 / token 预算 |
| `@after_model` | 调模型后 | 校验 / 改写回复 |
| `@dynamic_prompt` | 每轮动态组装 | 个性化提示 |
| `wrap_model_call` | 包裹 model call | 重试 / 缓存 |
| `wrap_tool_call` | 包裹工具调用 | 权限 / 限流 |

**内置 SummarizationMiddleware**：长对话超阈值自动压缩

```text
SummarizationMiddleware(
    model=model,
    trigger=('tokens', 4000),
    keep=('messages', 10),
)
```

<!--
Middleware 是 1.0 自定义 agent 行为的核心扩展点。
-->

---

# LangGraph 三要素

State（共享数据）/ Node（干活）/ Edge（决定下一步）

```text
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END, add_messages

class State(TypedDict):
    messages: Annotated[list, add_messages]  # 累积合并
    count: int                               # 默认覆盖

graph = StateGraph(State)
graph.add_node("search", search_node)
graph.add_edge(START, "search")
graph.add_conditional_edges("search", route, {...})
graph = graph.compile(checkpointer=InMemorySaver())
```

**Reducer**：默认覆盖；`add_messages` 按 id 合并；`operator.add` 列表拼接。

<!--
节点函数应幂等——重跑时不重复副作用。
-->

---
layout: two-cols
---

# Command / Send

把「状态更新 + 路由」合一

```text
from langgraph.types import Command, Send

def node_a(state):
    return Command(
        update={"messages": [...]},
        goto="node_b",
    )

# map-reduce 动态 fan-out
def fan_out(state):
    return [
        Send("worker", {"task": t})
        for t in state["tasks"]
    ]
```

::right::

# interrupt：HITL

暂停等人工输入后用 `Command(resume=...)` 恢复

```text
from langgraph.types import interrupt

def ask_human(state):
    user_input = interrupt({
        "question": "确认扣款？"
    })
    return {"messages": [
        {"role": "user", "content": user_input}
    ]}

# 外部恢复：
# graph.invoke(
#     Command(resume="同意"),
#     config,
# )
```

> interrupt 恢复时受影响节点会从头重跑——副作用要做幂等。

<!--
Command / Send / interrupt 是 LangGraph 编排的核心三件套。
-->

---

# 持久化：Checkpointer

按 `thread_id` 隔离状态，支持多轮 / 断点续跑 / HITL

| Checkpointer | 适用 | 持久介质 |
|------|------|------|
| `InMemorySaver` | 开发 / 测试 | 进程内存（重启丢） |
| `SqliteSaver` | 单机生产 | SQLite 文件 |
| `PostgresSaver` | 生产 | PostgreSQL |

**短期记忆 = state.messages + Checkpointer(thread_id)**

- `ConversationBufferMemory` / `ChatMessageHistory`：**已弃用**
- 长对话压缩用 `SummarizationMiddleware`

> 默认 `recursion_limit=1000` super-steps。

<!--
旧 Memory 类自 v0.3 弃用、v1.0 警告，必须迁移到 state + Checkpointer。
-->

---

# RAG 经典链

Loaders → Splitters → Embeddings → VectorStore → Retriever

```text
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma

splits = RecursiveCharacterTextSplitter(
    chunk_size=1000, chunk_overlap=200,
).split_documents(docs)

vectorstore = Chroma.from_documents(splits, OpenAIEmbeddings())
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

# LCEL 组装
chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt | model | StrOutputParser()
)
```

> 简单线性用 LCEL；需要查询改写 / 多轮追问 / 工具决策就上 LangGraph。

<!--
LangGraph 适合需要状态机的 RAG，比如多轮检索 + 反思。
-->

---

# LangSmith 观测

设环境变量即自动追踪，**无需改代码**

```bash
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY=lsv2_sk_...
```

**UI 能看到**

- 每次 model call 的 prompt / response / token / 耗时
- 工具调用的 args / 返回 / 失败重试
- 整条 chain / agent 的执行拓扑

**评估三件套**：Datasets / Evaluators / Experiments

> LangSmith Engine 监控 trace 自动诊断并提修复建议。

<!--
LangSmith 横跨 LangChain 与 LangGraph，是事实上的「观测标配」。
-->

---
layout: two-cols
---

# 弃用迁移

| 旧（弃用） | 新（1.0） |
|------|------|
| `AgentExecutor` | `create_agent` |
| `LLMChain` | LCEL / `create_agent` |
| `ConversationBufferMemory` | state + Checkpointer |
| `ChatMessageHistory` | Checkpointer |
| `InjectedState` / `InjectedToolArg` | `ToolRuntime` |
| `PydanticOutputParser` | `with_structured_output` |
| `LangServe` / `RemoteRunnable` | LangGraph Platform |

::right::

# 部署与过渡

**新项目必须用 LangGraph Platform**

- LangServe 自 2024-11-18 弃用
- 仅维护、不再加新功能
- 面向 LCEL chain，不支持 agent 循环 / HITL

**迁移工具**

```bash
# 临时保留旧抽象，降低升级成本
pip install langchain-classic
```

> 网上 v0.x 教程代码多数已弃用，按迁移指南重写。

<!--
不要照搬 Memory / AgentExecutor / LLMChain 老代码。
-->

---
layout: center
class: text-center
---

# 反模式与陷阱

- 用 LangServe / RemoteRunnable 部署新项目（已弃用）
- 用 `AgentExecutor` / `create_xxx_agent`（已弃用）
- 用 `ConversationBufferMemory`（已弃用，改 state + Checkpointer）
- 用 LCEL 拼复杂状态机（丧失 LangGraph 持久化 / HITL）
- LangGraph 节点写非幂等副作用不做去重（重跑重复扣款）
- `with_structured_output` 不传 Pydantic schema（准确率掉回字符串解析）
- 私有数据进 state 不收紧 output_keys（流式可能泄露）
- 照搬 v0.x 教程代码（多数已弃用）

---
layout: center
class: text-center
---

# 小结

LangChain = LLM 应用的可组合编排框架

生态四件套 · LCEL 管道符 · create_agent · LangGraph · LangSmith · 1.0 LTS

**简单线性用 LCEL · 复杂流程上 LangGraph · 旧抽象必迁移**

[文档](https://docs.langchain.com/oss/python/langchain/overview) · [GitHub](https://github.com/langchain-ai/langchain) · [LangSmith](https://smith.langchain.com)

<!--
掌握分层选型 + 弃用边界，就能把 LangChain 用到生产水准。
-->
