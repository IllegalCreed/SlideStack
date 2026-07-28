---
theme: seriph
background: https://cover.sli.dev
title: AI 网关完全指南
info: |
  AI 网关完全指南：统一接入 · 路由策略 · fallback/retry · 缓存 · 成本控制 · 可观测

  Learn more at [docs.litellm.ai](https://docs.litellm.ai/docs/proxy/quick_start)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## AI 网关

统一管理多模型 API · 路由 · fallback · 缓存 · 可观测

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
AI 网关把多模型接入、路由、治理等横切关注点集中到一层。
-->

---
transition: fade-out
---

# AI 网关是什么

应用与多家 LLM 厂商之间的统一代理层

- **统一接入**：一个 SDK 接 100+ 模型，换模型只改配置不改代码
- **高可用**：fallback + retry 让单家故障不影响业务
- **负载均衡**：多 deployment / 多 key 轮询，突破单 key 限速
- **成本可控**：统一记账、按 team/project 分摊、预算告警
- **可观测**：每次调用的 token / 延迟 / 成本 / 错误全记录
- **缓存省钱**：相同请求命中缓存，长 prompt 场景节省显著

> 三类选手：开源自建（LiteLLM）/ 商业网关（Portkey）/ 可观测为主（Helicone）。

<!--
网关解决的是「多模型时代的横切关注点」。
-->

---

# 没有网关的痛点

应用直连各家 API 时：

- 每家 SDK 不同，切换模型要改业务代码
- 单家故障（限速/宕机）直接拖垮业务
- 成本散落各家账单，无法按团队分摊
- 没有统一日志，调试困难
- 多 key 无法轮询，单 key 速率限制成瓶颈

**网关把这些横切关注点集中到一层。**

> 应用只对接网关一个 endpoint，不再为每家厂商单独写适配代码。

<!--
网关的本质：把分散的治理逻辑收敛到一层。
-->

---
layout: two-cols
---

# LiteLLM：最流行开源网关

**两种用法**

**1. Python SDK（嵌入式）**

```python
import litellm
response = litellm.completion(
    model="anthropic/claude-sonnet-4.6",
    messages=[{"role": "user",
               "content": "你好"}],
    api_key="sk-ant-xxx",
)
```

适合：单应用、不想部署额外服务。

::right::

**2. Proxy Server（独立部署）**

```bash
pip install 'litellm[proxy]'
litellm --config config.yaml --port 4000
```

应用把 OpenAI SDK 的 base_url 指向网关，model 用配置里的别名：

```python
from openai import OpenAI
client = OpenAI(
    base_url="http://localhost:4000",
    api_key="sk-xxx")
resp = client.chat.completions.create(
    model="claude", messages=[...])
```

适合：多应用共享、统一治理。

> Proxy 模式让已有 OpenAI 代码**零改动**，只改 base_url。

<!--
LiteLLM 两种用法：SDK 嵌入 vs Proxy 独立部署。
-->

---

# 6 种路由策略

同一逻辑模型名对应多个 deployment 时，Router 决定走哪个。

| 策略 | 原理 | 适合 |
|------|------|------|
| **simple-shuffle** | 随机打乱（默认） | 均匀分流，最常用 |
| **least-busy** | 选活跃请求最少的 | 避免单点过载 |
| **latency-based** | 选历史延迟最低的 | 延迟敏感 |
| **cost-based** | 选最便宜的 | 成本敏感 |
| **usage-based-v2** | 按 TPM/RPM 用量分配 | 突破单 key 限速 |

```yaml
router_settings:
  routing_strategy: latency-based-routing
  num_retries: 3
```

> 官方推荐 `simple-shuffle` 作默认，延迟/成本优化再切专门策略。

<!--
simple-shuffle 是默认，延迟敏感切 latency-based。
-->

---
layout: two-cols
---

# fallback 与 retry

**fallback**：主模型失败按链顺序切备模型。

```yaml
router_settings:
  fallbacks:
    - model: claude-sonnet
      fallback_model: gpt-5
    - model: gpt-5
      fallback_model: llama-70b
```

触发条件：429 / 5xx / 超时。

::right::

# retry 策略

```yaml
litellm_settings:
  num_retries: 3
  retry_after: 5         # 尊重 Retry-After
  backoff_factor: 2      # 1s→2s→4s
```

| 错误 | 重试 |
|------|------|
| 429 / 5xx / 408 | ✓ |
| 400 / 401 / 403 | ✗ |

::: tip fallback ≠ retry

- **retry**：同模型重试（瞬时恢复）
- **fallback**：换模型（彻底降级）

叠加：先 retry 几次，还失败再 fallback。

:::

> 别重试 400/401——参数错或鉴权错，重试也是错。

<!--
retry 是同模型重试，fallback 是换模型降级，两者叠加用。
-->

---

# 多 key 负载均衡

同一模型挂多个 key，轮询突破单 key 限速

```yaml
model_list:
  - model_name: claude        # 对外统一名
    litellm_params:
      model: anthropic/claude-sonnet-4.6
      api_key: sk-ant-key1    # 同名 = 同一逻辑模型
  - model_name: claude        # 加更多 key 突破单 key 限速
    litellm_params: { model: anthropic/claude-sonnet-4.6, api_key: sk-ant-key2 }
```

配合 `usage-based-routing-v2`，请求自动往还有 TPM 余量的 key 送。

**cooldown**：连续失败 N 次的 deployment 暂时摘除（如 60 秒），避免持续打挂的节点。

> 多 key + usage-based-routing 是突破单 key 限速的核心组合。

<!--
多 key 轮询 + cooldown 摘除，是大规模生产必备。
-->

---
layout: two-cols
---

# 缓存策略

**精确缓存（exact）**：相同输入 hash 命中。

```yaml
litellm_cache:
  type: redis
  ttl: 3600   # 1 小时
```

适合：FAQ 类、重复查询多的场景。

::right::

# 语义缓存（semantic）

用 embedding 算输入相似度，相似请求复用历史结果。

```text
查询1：「如何重置密码」→ 结果 A，缓存
查询2：「密码忘了怎么改」→ 相似 → 命中 A
```

::: warning 语义缓存风险

**时间敏感查询**（「今天天气」「最新新闻」）会返回过期结果。配置时排除这类，或设很短 TTL。

:::

> 缓存省钱但要警惕时间敏感数据——宁可不用也别返回错的。

<!--
精确缓存安全，语义缓存要排除时间敏感查询。
-->

---

# Portkey vs Helicone

| 维度 | Portkey | Helicone |
|------|------|------|
| 定位 | 企业级 AI 控制面 | 可观测为主 |
| 能力 | gateway+guardrails | 日志+成本+延迟 |
| 部署 | SaaS + 自托管 | OSS + SaaS |

```python
# Helicone 插桩（零代码改动，只改 base_url）
client = OpenAI(base_url="https://api.helicone.ai/openai/v1",
    api_key="sk-xxx",
    default_headers={"Helicone-Auth": "Bearer hc_xxx"})
```

> 只要可观测不想换路由 → Helicone 插桩最轻；要治理用 Portkey。

<!--
Portkey 偏治理，Helicone 偏观测，按需选。
-->

---

# 网关 vs OpenRouter

| 维度 | AI 网关 | OpenRouter |
|------|------|------|
| 模型供应 | **自带各家 key**，只路由 | 托管聚合，OR 出模型 |
| 计费 | 各家原价，不加价 | 加 10-30% 中间费 |
| 部署 | 自建为主 | 纯 SaaS |
| 可控性 | 高（数据在自己手） | 低（数据经 OR） |
| 适合 | 企业/合规/大规模 | 个人/中小/快速验证 |

**选哪类**：自建网关（已有 key + 合规 + 大规模）/ OpenRouter（不想注册多家 + 接受加价）/ Helicone（只要可观测）。

> 网关用你自己的 key 不赚差价；OpenRouter 是托管聚合加价转售。

<!--
网关 vs OpenRouter 是「自建可控」vs「托管省心」的取舍。
-->

---

# 高可用与陷阱

**高可用部署**：多实例 + LB（nginx / k8s）/ 共享状态（redis 存路由统计、缓存）/ 健康检查 + 自动重启

::: warning 网关宕机 = 全站挂

自建网关是「单点风险转移」——从「单家厂商挂」变成「你的网关挂」。务必高可用部署。

:::

**常见陷阱**

| 陷阱 | 解决 |
|------|------|
| 网关成新单点 | 多实例 + LB |
| 缓存返回过期数据 | 排除时间敏感查询 |
| retry 风暴 / 厂商特性丢失 | 只重试瞬时错 / 关键特性直连 |

> 自建网关务必高可用——它一旦成了新单点，全站都依赖它。

<!--
网关是单点风险转移，必须高可用部署。
-->

---
layout: quote
---

# AI 网关的工程精髓

「统一接入解耦厂商，路由策略优化体验，fallback+retry 保障可用，缓存与可观测控成本——网关是多模型时代的治理中枢。」

---
layout: center
class: text-center
---

# 小结

AI 网关 = 统一接入 + 路由治理 + 高可用

**LiteLLM 路由 · fallback/retry · 缓存省钱 · 可观测三件套**

[LiteLLM 文档](https://docs.litellm.ai/docs/proxy/quick_start) · [Portkey](https://docs.portkey.ai)

<!--
网关四件套：接入/路由/可用/成本——多模型时代必备。
-->
