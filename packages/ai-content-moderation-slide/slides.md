---
theme: seriph
background: https://cover.sli.dev
title: AI 内容审核指南
info: |
  AI 内容审核指南：OpenAI Moderation · Perspective · Azure Content Safety · AWS Comprehend

  Learn more at [Azure Content Safety](https://learn.microsoft.com/azure/ai-services/content-safety)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## AI 内容审核

用 AI 自动识别有害内容 · 文本 / 图像 / 多模态

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
把「是否违规」从人工抽审升级为 API 实时判定。
-->

---
transition: fade-out
---

# 内容审核是什么

用 AI 模型自动识别文本 / 图像 / 多模态中的有害内容

- **实时 API**：毫秒级响应，比人工审核快几个数量级
- **多维度分类**：hate / violence / sexual / self-harm，比关键词准
- **可解释**：每类返回 0-1 分数 + flagged 布尔，可设阈值
- **多模态**：新一代模型支持图像 / 图文混合审核
- **合规底线**：UGC 平台、生成式 AI 上线前的必备能力

> 满足《生成式 AI 服务管理办法》《GDPR》《平台信任与安全》

<!--
审核 API 是 UGC 与生成式 AI 应用的合规底线。
-->

---

# 四类主流方案

- **厂商托管 API**：OpenAI Moderation / Google Perspective / Azure / AWS
- **多模态审核**：OpenAI omni-moderation-latest（文本+图像）
- **自定义分类器**：Azure Custom Categories / 自训练（业务规则）
- **Prompt Shields**：Azure 检测 LLM 越狱攻击

| 方案 | 代表 |
|------|------|
| 托管 API | OpenAI / Perspective / Azure / AWS |
| 多模态 | OpenAI omni / Azure preview |
| 自定义 | Azure Custom Categories |
| 越狱检测 | Azure Prompt Shields |

> Azure 走严格版本生命周期——**新 GA 后旧 GA 90 天 deprecated**

<!--
四类方案互补，生产系统常组合使用。
-->

---
layout: two-cols
---

# OpenAI Moderation

```python
from openai import OpenAI
client = OpenAI()

response = client.moderations.create(
    model="omni-moderation-latest",
    input="要审核的文本",
)

print(response.results[0].flagged)
print(response.results[0].category_scores)
```

`omni-moderation-latest`：**13 文本类 + 6 图像类**，免费调用

::right::

# 多模态：文本 + 图像

```python
response = client.moderations.create(
    model="omni-moderation-latest",
    input=[
        {"type": "text", "text": "看这张图"},
        {"type": "image_url",
         "image_url": {"url": "https://..."}},
    ],
)
```

主要类别：

- harassment / hate
- violence / sexual
- self-harm
- illicit（新增）

> omni 替代旧的 text-moderation（仅 11 类）

<!--
OpenAI Moderation 免费且多模态，是入门首选。
-->

---

# Google Perspective API

Jigsaw 出品，评论 / 论坛毒性治理首选，返回 0-1 毒性分数

```bash
curl -X POST \
  'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "comment": {"text": "你是个愚蠢的人"},
    "requestedAttributes": {"TOXICITY": {}, "INSULT": {}},
    "languages": ["zh", "en"]
  }'
```

主要属性：`TOXICITY`（总体毒性）/ `SEVERE_TOXICITY` / `IDENTITY_ATTACK` / `INSULT` / `PROFANITY` / `THREAT` / `SPAM`

> 免费配额默认 1000 QPS，超量需邮件申请提额

<!--
Perspective 专攻评论毒性，属性粒度细。
-->

---

# Azure Content Safety

4 大类 × 4 严重度（0/2/4/6），比 0-1 分数更易决策

```python
from azure.ai.contentsafety import ContentSafetyClient
from azure.identity import DefaultAzureCredential

client = ContentSafetyClient(endpoint,
    credential=DefaultAzureCredential())
result = client.analyze_text({"text": "待审核文本"})

for item in result.categories_analysis:
    print(item.category, item.severity)
    # Hate/Sexual/Violence/SelfHarm + 0/2/4/6
```

**决策规则**：severity ≥4 直接屏蔽，=2 需复核

> 生产代码必须 pin 版本号（`api_version="2024-09-01"`）

<!--
Azure 用严重度档位，决策比连续分数更直接。
-->

---

# Azure 4 类 × 严重度

| Category | sev 2 | sev 4 | sev 6 |
|------|------|------|------|
| **Hate** | 轻微偏见 | 明显仇恨 | 煽动 |
| **Sexual** | 暗示 | 明显性内容 | 露骨 |
| **Violence** | 描述 | 描绘 | 血腥/鼓励 |
| **SelfHarm** | 提及 | 描述行为 | 教唆 |

Azure 独有能力：

- **Prompt Shields**：检测 LLM 越狱攻击（user prompt + 文档注入）
- **Groundedness**：检测回答是否基于源材料（幻觉检测）
- **Protected Material**：检测版权内容（歌词 / 文章 / 代码）

> Azure 是 LLM 应用防御最全的方案

<!--
Azure 不止审核，还有越狱/幻觉/版权检测。
-->

---
layout: two-cols
---

# AWS Comprehend

```python
import boto3
comprehend = boto3.client('comprehend')

result = comprehend.detect_toxic_content(
    TextSegments=[{"Text": "评论内容"}],
    LanguageCode='en')
for label in result['ResultList'][0]['ToxicityLabels']:
    print(label['Name'], label['Score'])
```

7 个标签：PROFANITY / HATE_SPEECH / INSULT / GRAPHIC / ...

::right::

# PII 检测

```python
result = comprehend.detect_pii_entities(
    Text="我的邮箱是 abc@x.com",
    LanguageCode='en'
)
# 返回 EMAIL / PHONE / SSN
# / CREDIT_DEBIT_NUMBER + 范围
```

适合 AWS 生态 + PII 场景

中文质量较弱

> 自定义分类需训练数据（异步 ARN 任务）

<!--
AWS 强在 PII 检测与生态集成。
-->

---

# 选型对比

| 维度 | OpenAI | Perspective | Azure | AWS |
|------|------|------|------|------|
| **多模态** | ✅ omni | ❌ | ✅ | ❌ |
| **中文质量** | 中 | 中 | 中 | 较弱 |
| **越狱检测** | 部分 | ❌ | ✅ | ❌ |
| **自定义分类** | ❌ | ❌ | ✅ | ✅ |
| **价格** | 免费 | 免费 | F0 免费 | 按调用 |

> 高隐私 / 离线场景考虑开源 **Llama Guard** 自部署

<!--
按多模态、中文、越狱检测、自定义需求选型。
-->

---

# 阈值与多层防御

| 场景 | 推荐阈值 |
|------|------|
| 严格（儿童平台） | flagged 即屏蔽；>0.3 转人工 |
| 中性（一般 UGC） | >0.7 屏蔽；0.5-0.7 复核 |
| 宽松 / LLM 输入 | 仅 severe_*>0.5 屏蔽；hate/threatening>0.5 拒绝 |

**多层防御**（生产标配）：

1. 关键词黑名单（毫秒级，正则 + 字典）
2. OpenAI Moderation（通用有害）
3. 业务自定义分类器（兜底业务规则）

> 三层叠加，召回率与准确率都更高

<!--
单一 API 不够，多层防御是生产标配。
-->

---

# 常见陷阱

| 陷阱 | 解决 |
|------|------|
| Azure API 突然 410 Gone | 旧版本已 deprecated，迁新 GA |
| 中文辱骂漏判 | 加 Moderation + 自定义分类器 |
| 反讽 / 艺术误杀 | 设双阈值（高屏蔽，中人审） |
| 用户绕过（拆字、emoji） | 预处理 normalize |
| 成本爆炸 | 加缓存 + 仅高风险调付费 API |

**性能优化**：Redis 缓存（key = 内容 hash）+ 批量（OpenAI 单次 32 条）+ 异步并发

> 各 API 有 rate limit（OpenAI RPM，Azure S0 是 RP10S）

<!--
缓存 + 批量 + 异步是审核 API 的性能三板斧。
-->

---
layout: quote
---

# 多层防御

「关键词黑名单（快）+ Moderation（准）+ 业务自定义分类器（兜底）——三层叠加，召回与准确率都更高。」

---
layout: center
class: text-center
---

# 小结

AI 内容审核 = 实时判定 + 多维度分类 + 多层防御

**OpenAI · Perspective · Azure · AWS · 自定义**

[Azure Content Safety](https://learn.microsoft.com/azure/ai-services/content-safety) · [OpenAI Moderation](https://platform.openai.com/docs/guides/moderation)

<!--
审核 API 是合规底线，多层防御是生产标配。
-->
