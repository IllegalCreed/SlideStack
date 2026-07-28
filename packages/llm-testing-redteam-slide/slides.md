---
theme: seriph
background: https://cover.sli.dev
title: LLM 测试与红队
info: |
  LLM 测试与红队：Promptfoo · DeepEval · Garak · 断言与 metric · 红队攻击 · CI/CD 门禁

  Learn more at [promptfoo.dev/docs](https://www.promptfoo.dev/docs/intro/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## LLM 测试与红队

Promptfoo · DeepEval · Garak · CI/CD 门禁

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
把提示词工程从手艺变成工程：写测试 + 跑红队。
-->

---
transition: fade-out
---

# 为什么需要 LLM 测试框架

传统单元测试验证「函数行为」，LLM 应用不一样

- 输出**非确定**（同 prompt 跑两次结果可能不同）
- 行为空间**巨大**（不可能穷举）
- 「对错」**模糊**（需 LLM-as-judge 或业务规则）

> 改一版 prompt 后能自动验证答案没变差，上线前能自动扫越狱 / 注入 / 泄密。

<!--
LLM 应用需要专属测试框架：处理非确定性 + 对抗性。
-->

---

# 三大主流工具

分工互补，常组合使用

| 工具 | 风格 | 强项 |
|------|------|------|
| **Promptfoo** | CLI / 配置驱动 | 红队一站式 + CI 集成 |
| **DeepEval** | pytest 风格 | 50+ 即插即用 metric |
| **Garak** | 漏洞扫描器 | NVIDIA 出品，扫幻觉 / 注入 |

- Promptfoo：44 确定性断言 + 15 模型评分断言
- DeepEval：覆盖 RAG / Agent / 对话评测
- Garak：被誉为「Nessus for LLMs」

<!--
三工具互补：Promptfoo 红队 / DeepEval 评测 / Garak 扫描。
-->

---
layout: two-cols
---

# Promptfoo：第一个测试

```yaml
# promptfooconfig.yaml
prompts: ["请用一句话总结：{{input}}"]
providers: [openai:gpt-4o-mini]
tests:
  - vars: {input: "RAG 是检索增强..."}
    assert:
      - {type: contains, value: "检索"}
      - {type: llm-rubric, value: "总结准确且简洁"}
```

::right::

# 跑评测与看结果

```bash
promptfoo init      # 生成 promptfooconfig.yaml
promptfoo eval      # 输出通过/失败表格
promptfoo view      # 打开 localhost:15500 浏览
```

> 配置驱动：prompt + provider + tests + assert。

<!--
Promptfoo 核心循环：init → eval → view。
-->

---

# Promptfoo 断言类型

两大类，每类可加 `not-` 前缀取反

**确定性断言（节选）**

- `equals` / `contains` / `icontains`：精确 / 包含
- `regex` / `starts-with`：正则 / 前缀
- `is-json` / `is-sql` / `is-html`：格式校验
- `is-refusal`：是模型拒绝
- `javascript` / `python`：自定义代码
- `rouge-n` / `bleu`：文本重叠指标
- `latency` / `cost`：性能 / 成本

> 能用 `contains` / `is-json` 就别用 `llm-rubric`（后者更噪）。

<!--
确定性断言优先，模型评分断言按需用。
-->

---

# 红队（Red Teaming）

自动生成攻击 prompt，扫漏洞

```yaml
redteam:
  plugins: [prompt-injection, jailbreak, pii, excessive-agency]
  strategies: [basic, encoding]   # base64 / rot13 绕过
  purpose: "客服助手，回答订单与退货问题"
```

> 输出漏洞报告：哪个攻击成功、风险等级、修复建议，可对齐 NIST AI RMF。

<!--
红队 = 自动生成攻击 + 自动判定成功。
-->

---
layout: two-cols
---

# DeepEval：pytest 风格

```python
# test_rag.py
from deepeval import assert_test, LLMTestCase
from deepeval.metrics import AnswerRelevancyMetric, FaithfulnessMetric

def test_rag_answer():
    case = LLMTestCase(input="RAG 是什么？",
        actual_output="RAG 是检索增强...", retrieval_context=["..."])
    assert_test(case, [AnswerRelevancyMetric(0.7), FaithfulnessMetric(0.7)])
```

::right::

# Garak：漏洞扫描

```bash
pip install garak
# 全套 probes 扫模型
garak --model_type openai --model_name gpt-4o-mini
# 指定 probe 类别
garak --model_type openai --model_name gpt-4o-mini \
      --probes promptinject,jailbreak,leakage
```

> DeepEval 融 pytest，Garak 扫模型层漏洞。

<!--
DeepEval 写 metric，Garak 跑 probes 扫漏洞。
-->

---

# 测试用例设计三原则

| 原则 | 含义 | 例子 |
|------|------|------|
| **代表性** | 覆盖典型输入 | 客服：退货 / 物流 / 退款 |
| **边界** | 极端 / 罕见输入 | 超长 / 空输入 / 多语言混 |
| **对抗性** | 恶意 / 越权 | 越狱 / 注入 / PII 套取 |

**用例来源**：线上 trace 抽样（最重要）/ 人工脑暴 / 红队自动生成 / 失败案例库

> 起步 30-50 个核心用例足够，质量 >> 数量。

<!--
代表性 + 边界 + 对抗性，线上 trace 抽样是金矿。
-->

---

# 处理「非确定性」

LLM 输出有随机性，单次测试不可靠

- **多次跑取平均**：每个 case 跑 3-5 次，看通过率而非单次
- **设阈值**：通过率 ≥ 0.8 算过，而非 100%
- **温度控制**：测试时 `temperature=0` 减少波动（但不消除）
- **deterministic 优先**：能用规则断言就别用模型评分

> LLM 非确定——80%+ 通过率已优秀，不必苛求 100%。

<!--
非确定性靠多次跑 + 阈值 + 低温度 + 规则断言。
-->

---
layout: two-cols
---

# CI/CD 门禁

```yaml
# .github/workflows/llm-tests.yml
on: [pull_request]
jobs: {test: {runs-on: ubuntu-latest, steps: [
  {uses: actions/checkout@v4},
  {run: "npm install -g promptfoo"},
  {run: "promptfoo eval --no-cache"},
  {run: "promptfoo redteam run || exit 1"}  # 阻断合并
]}}
```

::right::

# 门禁阈值

| 阈值 | 例子 |
|------|------|
| 通过率下限 | 整体 ≥ 85% |
| 单 metric 下限 | faithfulness ≥ 0.8 |
| 红队高危数 | = 0（阻断） |
| 延迟涨幅 | p99 < 10% |

> 阈值别太严，否则团队不敢改 prompt。

<!--
CI 门禁让 prompt 改动有「门禁」回归可拦截。
-->

---

# 与可观测工具联动

测试（pre-prod）+ 可观测（prod）形成闭环

```
线下测试（Promptfoo/DeepEval）   线上监控（Langfuse/Phoenix）
        ↑ bad case                       ↓ trace 抽样
        └──────────────────────────────┘
              沉淀为回归用例
```

- 线上发现 bad case → 加进测试集 → 防回归
- 线下测试结果上报 Langfuse → 长期趋势可视化
- 红队发现的漏洞 → 在线监控同类 pattern

> 测试写门禁，可观测盯生产，两者闭环。

<!--
测试 + 可观测闭环：bad case 沉淀为回归用例。
-->

---

# 选型决策

```
[纯模型安全扫描？] 是 → Garak
   └─ 否 → [Python + 已用 pytest？] 是 → DeepEval
            └─ 否 → [要做红队 + CI 门禁？]
                     ├─ 是 → Promptfoo
                     └─ 否 → 三者可组合用
```

> 生产常组合：Promptfoo 红队 + DeepEval 评测 + Garak 审计。

<!--
选型：Garak 扫模型 / DeepEval 融 pytest / Promptfoo 红队。
-->

---
layout: center
class: text-center
---

# 小结

LLM 测试 = 断言 + 红队 + CI 门禁

**代表性 · 对抗性 · 非确定 · 闭环**

[Promptfoo](https://www.promptfoo.dev/docs/intro/) · [DeepEval](https://deepeval.com/docs) · [Garak](https://garak.ai/)

<!--
三工具互补：写测试 + 跑红队 + 上 CI 门禁。
-->
