---
theme: seriph
background: https://cover.sli.dev
title: LLM 可观测与评测
info: |
  LLM 可观测与评测：Tracing · Evaluation · Prompt 管理 · Cost 监控 · Langfuse / LangSmith / Phoenix / Helicone

  Learn more at [langfuse.com/docs](https://langfuse.com/docs)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## LLM 可观测与评测

Tracing · Evaluation · Prompt 管理 · Cost 监控

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
LLM 应用生产化：从黑盒到白盒，靠 Tracing + Evaluation。
-->

---
transition: fade-out
---

# 为什么传统 APM 不够

传统 APM 盯延迟 / 错误率 / 吞吐，LLM 应用多了三个新维度

- **质量**：答案对不对（RAG 召回是否支持答案）
- **成本**：token 花了多少（一次对话几分还是几毛）
- **安全**：有没有越界 / 泄密（injection / PII）

LLMOps 可观测工具专门补这块。

> 核心目标：让 LLM 应用「**可追踪、可评测、可对比**」。

<!--
质量 + 成本 + 安全是 LLM 应用的新三维度。
-->

---

# 核心数据模型

以 Langfuse 为例（Phoenix / LangSmith 概念相似）

```
Session（会话，可选聚合）
  └─ Trace（一次请求 / 一次链路）
       ├─ Generation（LLM 调用：prompt + token + cost）
       ├─ Span（逻辑步骤：如 RAG 检索阶段）
       └─ Event（瞬时事件：如日志）
            ↑ 每个 Observation 可嵌套
```

- **Trace**：一次请求的逻辑分组，共享 `trace_id`
- **Observation**：链路里的单步（Generation / Span / Event）
- **Score**：对 trace 或 observation 的评分（人工 / LLM / 用户）

> Langfuse 用扁平存储冗余 trace 属性，免 JOIN 查询快。

<!--
Trace → Observation → Score 是可观测的三层数据模型。
-->

---

# 四大核心能力

- **Tracing**：追踪每次 LLM 调用的完整链路
- **Evaluation**：评测答案质量（人工 / LLM-as-judge / 规则）
- **Prompt Management**：版本化提示词，回滚 / A/B / 环境隔离
- **Cost / Latency 监控**：token / 模型 / 用户维度拆账

> 没评分的 trace 只是日志——**关键是有 Score**。

<!--
四大能力：Tracing + Evaluation + Prompt 管理 + Cost 监控。
-->

---
layout: two-cols
---

# 工具选型对比

| 工具 | 开源 | 自托管 |
|------|------|------|
| **Langfuse** | MIT | ✓ |
| **LangSmith** | 闭源 | ✗ |
| **Phoenix** | Apache | ✓ |
| **Helicone** | Apache | ✓ |

::right::

# 各自强项

- **Langfuse**：通用 / OTel / 自托管
- **LangSmith**：深度绑 LangChain
- **Phoenix**：评测强 / Notebook 友好
- **Helicone**：代理层零侵入 + 缓存省钱

> 选型：自托管首选 Langfuse，LangChain 栈选 LangSmith。

<!--
四工具定位互补，OTel 兼容者可换后端。
-->

---
layout: two-cols
---

# Langfuse：30 秒接入

```python
from langfuse import Langfuse
from openai import OpenAI
lf, client = Langfuse(), OpenAI()  # 读环境变量
@lf.observe()  # 装饰器自动追踪
def chat(user_msg):
    r = client.chat.completions.create(model="gpt-4o-mini",
        messages=[{"role": "user", "content": user_msg}])
    return r.choices[0].message.content
```

::right::

# Helicone：零代码侵入

```python
from openai import OpenAI
client = OpenAI(
    base_url="https://api.helicone.ai/openai/v1",
    api_key=os.environ["OPENAI_API_KEY"],
    default_headers={"Helicone-Auth":
        f"Bearer {os.environ['HELICONE_API_KEY']}"},
)
# 代理层转发：自动记录 + 计费 + 缓存
```

> SDK 灵活但要改代码；代理层一行接入零侵入。

<!--
Langfuse 用装饰器追踪，Helicone 换 base_url 即可。
-->

---

# 评分（Score）三种来源

光有 trace 不够，还要给 trace 打分

- **用户反馈**：点赞 / 踩（`langfuse.score(value=1)`）
- **代码规则**：包含关键词 / 格式校验
- **LLM-as-a-judge**：用强模型（GPT-4o / Claude）评弱模型

> LLM-as-judge 也烧 token——生产只抽 5-10% trace 评。

<!--
三种评分来源：用户反馈 + 代码规则 + LLM-as-judge。
-->

---
layout: two-cols
---

# LLM-as-a-judge 设计

用强模型自动评弱模型答案

| 维度 | 评什么 |
|------|------|
| 相关性 | 是否切题 |
| 忠实度 | 是否基于上下文 |
| 正确性 | 事实对错 |
| 毒性 | 有害内容 |

::right::

# 防 bias / 噪声

- **位置 bias**：对比时倾向选第一个 → 随机打乱顺序
- **冗长 bias**：偏好长答案 → 加长度约束
- **自夸 bias**：GPT 评 GPT 偏高 → 换家族模型评
- **一致性**：同答案多次评分，方差大说明 prompt 不明确

> 抽样 5-10% 即可，关键 metric 全量评。

<!--
LLM-as-judge 要防位置 / 冗长 / 自夸三类 bias。
-->

---

# Prompt 管理

把提示词当代码：版本化、回滚、环境隔离

```python
# Langfuse 取 prompt（按 label）
prompt = langfuse.get_prompt(
    "rag-system-prompt", label="production")

# 编译成最终字符串
compiled = prompt.compile(user_question="RAG 是什么？")
```

**工作流**：开发打 `staging` → 测试环境评测 → 通过改 `production` → 出问题回滚 label

> 代码不重新部署即可切 prompt——这是 prompt 管理的核心价值。

<!--
Prompt 管理核心：版本化 + 回滚 + 环境隔离。
-->

---

# A/B 测试

同 prompt / 模型两版本分流对比

- **分流键稳定**：同一 user 始终落同一组（防体验跳）
- **跑够样本**：日均 1k 请求跑 3-7 天才有统计意义
- **看多指标**：质量涨但 cost 也涨，未必划算
- **冷启动**：新版本先放 5% 灰度，确认无大问题再放量

> A/B 一天不够——至少跑 3-7 天看趋势，单日波动大。

<!--
A/B 测试要稳定分流 + 足够样本 + 多指标。
-->

---

# 监控看什么

打开 dashboard 重点盯

| 指标 | 异常信号 |
|------|------|
| **p99 延迟** | 突增 = 模型 / 网络问题 |
| **每请求 cost** | 突增 = 上下文爆炸 |
| **质量分布** | 低分占比上升 = 提示词漂移 |
| **每用户 cost** | top 用户 = 异常滥用 |

> 每天 / 每周 / 每月三层节奏盯成本与质量趋势。

<!--
监控盯延迟 + cost + 质量 + 错误率四类核心指标。
-->

---
layout: quote
---

# 选型决策树

「已有 LangChain → LangSmith；想自托管 → Langfuse / Phoenix；纯省钱不改代码 → Helicone；评测实验 → Phoenix Notebook。」

---

# 常见误区

| 误区 | 真相 |
|------|------|
| 接了监控就万事大吉 | 没评分的 trace 只是日志，关键是有 Score |
| LLM-as-judge 一定准 | 有 bias / 噪声，需防位置 + 自夸 bias |
| Prompt 管理只是存字符串 | 真正在版本化 + 回滚 + 环境隔离 |
| Phoenix 和 Langfuse 二选一 | 可都用——OTel 标准，trace 通用 |

> 自托管首选 Langfuse（MIT），评测强选 Phoenix（Apache）。

<!--
避免五大误区：有 Score、防 bias、版本化、跑够天数、可混用。
-->

---
layout: center
class: text-center
---

# 小结

LLM 可观测 = Tracing + Evaluation + Score

**质量 · 成本 · 安全 · OTel 标准**

[Langfuse](https://langfuse.com/docs) · [Phoenix](https://arize.com/docs) · [Helicone](https://www.helicone.ai/docs) · [LangSmith](https://docs.langchain.com/langsmith)

<!--
LLM 可观测四件：Trace + Evaluation + Prompt 管理 + Cost。
-->
