---
theme: seriph
background: https://cover.sli.dev
title: OpenRouter 一站接入 400+ 大模型
info: |
  Presentation OpenRouter for LLM developers.

  Learn more at [https://openrouter.ai](https://openrouter.ai)
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="flex justify-center items-center gap-4">
  <carbon:network-3 class="text-7xl" />
</div>

<br/>

## OpenRouter：统一聚合 400+ 大模型

一个 OpenAI 兼容接口 + 一张 API key，访问 Claude / GPT / Gemini / Llama / DeepSeek 全市场

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
今天聊 OpenRouter。

2023 年诞生的 LLM API 聚合层，把 400+ 模型藏在一个 OpenAI 兼容接口背后。
对中国大陆开发者尤其友好——一张 key 走天下，免去为每家厂商单独注册。
-->

---
transition: fade-out
---

# 什么是 OpenRouter？

LLM API 聚合中间层，**用 OpenAI SDK 调用所有模型**

<v-click>

- **统一 schema**：底层是 OpenAI Chat Completions API，改 `base_url` 即用
- **400+ 模型**：Claude / GPT / Gemini / Llama / DeepSeek / Qwen / GLM / Grok / Mistral 一站接入
- **价格透明**：每个模型每个 provider 实时显示 input / output 单价
- **智能路由**：`provider.sort` 自动选最快 / 最便宜 / 最高吞吐
- **Fallback**：主 provider 故障自动切其它，提升 SLA
- **大陆友好**：信用卡 + 加密货币 + Cloudflare Worker 代理友好
- **免费 tier**：注册即送少量 credit + `:free` 后缀模型零成本试

</v-click>

<br>

<div v-click text-xs>

_Read more about_ [_OpenRouter_](https://openrouter.ai)

</div>

<style>
h1 {
  background-color: #6E56CF;
  background-image: linear-gradient(45deg, #6E56CF 10%, #2D1B69 90%);
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

# 为什么需要聚合层？

直连各家 API 的痛点

<v-clicks>

- **多家 SDK**：Anthropic / OpenAI / Google / xAI 各一套，切模型重写代码
- **多账号管理**：每家单独注册、单独充值、单独维护 key 轮换
- **大陆访问**：Anthropic / OpenAI 直连困难，每家自建反代成本高
- **支付门槛**：国内信用卡基本不能直接给境外 LLM 厂商充值
- **故障切换**：某家挂掉手动换 provider，没有兜底机制
- **选型对比**：想横向对比 GPT-5 vs Claude vs Gemini，要切三套代码

</v-clicks>

<v-click>

**OpenRouter 一层解决**：一份代码、一张卡、一张 key、自动路由。

</v-click>

---
transition: slide-up
---

# 评价

**优点**

<v-clicks>

- **统一 API**：OpenAI 兼容 schema，最低改造成本
- **400+ 模型**：所有主流闭源 + 开源模型一站接入
- **智能路由 + Fallback**：throughput / latency / price 三种排序 + 多 provider 兜底
- **大陆友好**：crypto 充值 + 反代友好 + `:free` 后缀零成本评估

</v-clicks>

**缺点**

<v-clicks>

- **加价 10-30%**：相比官方直连 API
- **独有特性受限**：Claude MCP / Anthropic Files / Gemini Live / GPT Realtime 不转发
- **延迟略高**：多一跳路由（+50-200ms），UI 慎用 Claude
- **企业合规弱**：需 SOC2 / HIPAA / 私有部署的用 Bedrock / Vertex / Azure

</v-clicks>

---
transition: slide-up
---

# 注册 + API Key

```
1. 访问 openrouter.ai → Sign Up
2. 通过 Google / GitHub / 邮箱注册（送少量 free credit）
3. Settings → Keys → Create Key
4. 命名（如 prod / dev）→ 复制保存（仅一次显示）
```

```bash
export OPENROUTER_API_KEY=sk-or-v1-xxxxx
```

<v-click>

**最佳实践**：

- 不同项目 / 环境创建不同 key（泄露后单独撤销）
- Settings → Privacy 关闭 logging（商业项目）
- 充值 $10+ 后 `:free` 模型 RPD 从 200 上调到 1000

</v-click>

---
transition: slide-up
---

# 第一次调用：OpenAI SDK 兼容

```python
from openai import OpenAI
import os

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

response = client.chat.completions.create(
    model="anthropic/claude-sonnet-4.6",   # OpenRouter 模型 ID 格式
    messages=[{"role": "user", "content": "用 Python 写个 quicksort"}],
)
```

<v-click>

**改造旧项目的代价**：只需 2 行——`base_url` 和 `api_key`。其余 `messages` / `tools` / `stream` / `response_format` 全套与 OpenAI 完全一致。

</v-click>

---
transition: slide-up
---

# Node.js / TypeScript 调用

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",     // 注意 baseURL 大小写
  apiKey: process.env.OPENROUTER_API_KEY,
});

const response = await client.chat.completions.create({
  model: "google/gemini-2.5-flash",
  messages: [{ role: "user", content: "你好" }],
});
```

<v-click>

**关键点**：

- TypeScript 用 `baseURL`，Python 用 `base_url`（命名差异）
- 同一个 client 可调用任意厂家模型——切模型只改 `model` 字符串
- 流式响应（`stream: true`）行为与 OpenAI 完全一致

</v-click>

---
transition: slide-up
---

# 模型 ID 命名规则

```
<vendor>/<model-name>[:variant]
```

| OpenRouter ID | 对应模型 |
| --- | --- |
| `anthropic/claude-opus-4.7` | Claude Opus 4.7 |
| `anthropic/claude-sonnet-4.6` | Claude Sonnet 4.6 |
| `anthropic/claude-haiku-4.5` | Claude Haiku 4.5 |
| `openai/gpt-5` | GPT-5 |
| `openai/gpt-5-mini` | GPT-5-mini |
| `openai/o3` | o3 推理模型 |
| `google/gemini-2.5-pro` | Gemini 2.5 Pro |
| `google/gemini-2.5-flash` | Gemini 2.5 Flash |
| `deepseek/deepseek-r1` | DeepSeek R1 |
| `qwen/qwen-2.5-72b-instruct` | Qwen 2.5 72B |
| `xai/grok-4` | xAI Grok 4 |
| `meta-llama/llama-3.3-70b-instruct` | Llama 3.3 70B |

---
transition: slide-up
---

# `:variant` 后缀 + Auto Routing

| 后缀 | 含义 |
| --- | --- |
| `:free` | 免费 tier（rate limit 严格 + 允许训练） |
| `:1m` | 1M 上下文版本（Claude Opus / GPT-5 等） |
| `:nitro` | 极速 provider 优先 |
| `:online` | 自动接 web search |

```python
# 让 OR 自动选最优模型
model="openrouter/auto"

# 免费 Llama
model="meta-llama/llama-3.3-70b-instruct:free"

# 1M context Claude
model="anthropic/claude-opus-4.7:1m"
```

<v-click>

> 💡 **找模型 ID**
>
>
> [openrouter.ai/models](https://openrouter.ai/models) 搜模型 → 点详情页有调用示例 + ID 复制按钮。

</v-click>

---
transition: slide-up
---

# `:free` 后缀：零成本试模型

```python
response = client.chat.completions.create(
    model="meta-llama/llama-3.1-8b-instruct:free",
    messages=[...],
)
```

<v-clicks>

**`:free` 模型规则**：

- 完全免费，但有严格 rate limit（默认 20 RPM / 200 RPD）
- **数据用于训练**（不可关）——商业敏感数据慎用
- 充值 $10+ 后 RPD 上调到 1000
- 适用：原型验证 / 学习 / 个人项目 / 非敏感场景

**典型免费模型**：

- `meta-llama/llama-3.3-70b-instruct:free`
- `deepseek/deepseek-r1:free`
- `qwen/qwen-2.5-7b-instruct:free`

</v-clicks>

---
transition: slide-up
---

# Provider 路由：order + allow_fallbacks

同一模型常有多个 provider（OpenAI 直连 + Azure + 转售）：

```python
response = client.chat.completions.create(
    model="openai/gpt-5",
    messages=[...],
    extra_body={
        "provider": {
            "order": ["openai", "azure"],   # 优先 openai，失败 fallback azure
            "allow_fallbacks": True,         # False = 严格仅用 order 列表
        },
    },
)
```

<v-click>

**机制**：

- 不写 `provider` 字段：OR 内置 load balancer 自动选——大多场景已够用
- `allow_fallbacks: False`：严格指定 provider 时用，失败直接 502 / 503

</v-click>

---
transition: slide-up
---

# Provider 路由：sort 优化目标

```python
extra_body={"provider": {"sort": "throughput"}}   # 选吞吐最高
extra_body={"provider": {"sort": "latency"}}      # 选延迟最低
extra_body={"provider": {"sort": "price"}}        # 选最便宜
```

<v-click>

| sort 值 | 适用场景 |
| --- | --- |
| `throughput` | 批量处理 / 离线任务 / 不卡 UI |
| `latency` | Chat UI / 实时交互 / 用户等待中 |
| `price` | 成本敏感 / 大规模并发 |

</v-click>

---
transition: slide-up
---

# Provider 路由：require_parameters

```python
extra_body={
    "provider": {
        "require_parameters": True,    # 仅选支持本次所有参数的 provider
    }
}
```

<v-clicks>

**用途**：

- 调用时带 `response_format: json_schema` / `tools` 等参数
- 部分 provider 不支持这些参数——开了之后 OR 自动过滤
- 避免「fallback 到不支持参数的 provider 然后报错」

**反例**：

- 不需要严格参数支持时关掉，让 OR 选最便宜 provider

</v-clicks>

---
transition: slide-up
---

# Headers：HTTP-Referer + X-Title

```python
response = client.chat.completions.create(
    model="openai/gpt-5",
    messages=[...],
    extra_headers={
        "HTTP-Referer": "https://my-app.com",   # 出现在 Activity 面板
        "X-Title": "My AI App",                  # 应用名
    },
)
```

<v-clicks>

**用途**：

- Activity 面板按 app 分类显示 token / cost
- 团队场景：多人共用 key 时分清谁用了多少
- 公开 app：让 OpenRouter 知道你的存在 → 更高 rate limit + 排名靠前

</v-clicks>

<v-click>

> 💡 **非必填**
>
>
> 不填这两个 header 完全能用——只是失去 attribution + 更高 rate limit 优势。

</v-click>

---
transition: slide-up
---

# Caching：三家差异

```python
# Claude 风格：显式 cache_control
messages = [
    {
        "role": "system",
        "content": [
            {
                "type": "text",
                "text": LONG_CONTEXT,
                "cache_control": {"type": "ephemeral"},
            },
        ],
    },
    {"role": "user", "content": "..."},
]

# GPT 风格：自动 cache（无需配置，第二次相同前缀自动命中）
# Gemini 风格：implicit cache（无需配置，重复前缀自动 cache）
```

<v-click>

| 模型 | 节省比例 | 说明 |
| --- | --- | --- |
| Claude on OR | ~85% | 显式 `cache_control: ephemeral` |
| GPT on OR | ~45% | 自动 cache |
| Gemini on OR | ~65% | implicit cache |

</v-click>

---
transition: slide-up
---

# Function Calling 转换

```python
tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "查询天气",
        "parameters": {
            "type": "object",
            "properties": {"city": {"type": "string"}},
            "required": ["city"],
        },
    },
}]

response = client.chat.completions.create(
    model="anthropic/claude-sonnet-4.6",   # 实际是 Claude，但用 OpenAI tool 格式
    messages=[...],
    tools=tools,
    tool_choice="auto",
)
```

<v-click>

**OpenRouter 自动转换**：OpenAI tool schema → Anthropic / Google tool schema。前端代码无需改动。

</v-click>

---
transition: slide-up
---

# Function Calling 陷阱

<v-clicks>

- **strict mode**：OpenAI 的 `strict: true` 部分模型不支持 → 报错
- **复杂 schema**：嵌套深 / `oneOf` / `allOf` 表现差异大
- **Tool 结果格式**：部分模型返回 escaped JSON 字符串，需 `json.loads`
- **并行 tool call**：Claude / GPT 支持，部分开源模型只能一次返一个
- **`tool_choice: "required"`**：部分模型支持差，需用 `auto`

</v-clicks>

<v-click>

**最佳实践**：

```python
extra_body={
    "provider": {"require_parameters": True}  # 过滤不支持 tools 的 provider
}
```

测试时多家对比 + 兜底 try/except。

</v-click>

---
transition: slide-up
---

# 多模态：图 + PDF

```python
# 图（OpenAI 兼容格式）
content = [
    {"type": "text", "text": "看图"},
    {"type": "image_url", "image_url": {"url": "data:image/png;base64,..."}},
]

# PDF（type: file）
content = [
    {"type": "text", "text": "总结"},
    {"type": "file", "file": {
        "file_data": "data:application/pdf;base64,...",
        "filename": "doc.pdf",
    }},
]
```

<v-click>

| 模型 | 图 | PDF |
| --- | --- | --- |
| GPT-4o / GPT-5 系 | ✓ | ✗（需先 vision 抽页） |
| Claude 3+ 系 | ✓ | ✓（OR 转 document block） |
| Gemini 2+ 系 | ✓ | ✓（原生） |

OR 自动把 OpenAI 风格 `image_url` 转成 Claude `image` / Gemini `inlineData`。

</v-click>

---
transition: slide-up
---

# 大陆访问：直连 + 反代

**方案 1：直连**（部分时间可达）

```python
client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key="sk-or-v1-xxx")
```

<v-clicks>

电信 / 联通 / 教育网大多时段可达；移动偶尔被墙；高峰期丢包率上升。

**方案 2：Cloudflare Worker 代理**

```javascript
// worker.js
export default {
  async fetch(req) {
    const url = new URL(req.url);
    url.host = "openrouter.ai";
    return fetch(url, req);
  },
};
```

部署到 Cloudflare → 得到 `https://your-worker.workers.dev` → 当 base_url 用。

**优点**：完全免费 + 大陆访问稳定 + 流量绕开 GFW。

</v-clicks>

---
transition: slide-up
---

# 大陆访问：HTTP 反代

```nginx
# /etc/nginx/sites-enabled/openrouter-proxy
server {
    listen 443 ssl;
    server_name openrouter.your-domain.com;

    location / {
        proxy_pass https://openrouter.ai;
        proxy_set_header Host openrouter.ai;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_ssl_server_name on;
    }
}
```

<v-click>

**适合**：

- 已有境外 VPS + 自定义域名
- 团队共用 + 想加额外鉴权 / 日志
- 不想依赖 Cloudflare

**注意**：境外节点要够稳，直接转发到 openrouter.ai 即可。

</v-click>

---
transition: slide-up
---

# 大陆支付：信用卡 + Crypto

OpenRouter 支持：

<v-clicks>

- **Stripe**：Visa / Mastercard / Discover / AmEx
- **Crypto**：BTC / ETH / USDC / USDT

**国内卡问题**：

- 大部分国内双币卡 → 失败（境外商户拒）
- 部分招行 / 中信全币卡 → 可成功
- 微信 / 支付宝绑国际卡 → 不支持

</v-clicks>

<v-click>

> 💡 **推荐方案**
>
>
> - **虚拟卡**：WildCard / Nobepay / U Card 等服务，开张虚拟 Visa
> - **Crypto**：买 USDC（火币 / OKX）→ 转入 OpenRouter 钱包
>
> 虚拟卡门槛低，crypto 长期成本更低。

</v-click>

---
transition: slide-up
---

# 与 Claude Code 集成

```bash
export ANTHROPIC_BASE_URL=https://openrouter.ai/api/v1
export ANTHROPIC_API_KEY=sk-or-v1-xxxxx
claude
```

或写入 `~/.claude/settings.json`：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://openrouter.ai/api/v1",
    "ANTHROPIC_API_KEY": "sk-or-v1-xxxxx"
  }
}
```

<v-click>

> ⚠️ **通过 OR 用 Claude Code 限制**
>
>
> - Claude 独有特性（MCP / Files API / Extended Thinking 细节）可能不全
> - Tool Use 边界 case 偶有问题
> - **建议**：仅大陆访问 + 模型测试，生产仍直连 Anthropic / Bedrock

</v-click>

---
transition: slide-up
---

# 与 Cursor / Aider 集成

**Cursor → Settings → Models → Custom OpenAI**：

```
Base URL: https://openrouter.ai/api/v1
API Key: sk-or-v1-xxxxx
Model: anthropic/claude-sonnet-4.6
```

**Aider**：

```bash
aider \
  --openai-api-base https://openrouter.ai/api/v1 \
  --openai-api-key sk-or-v1-xxxxx \
  --model openrouter/anthropic/claude-sonnet-4.6
```

<v-click>

**Aider 命名约定**：model 字符串前需带 `openrouter/` 前缀（aider 用此判断路由）。

</v-click>

---
transition: slide-up
---

# 与 Continue / LiteLLM 集成

```json
// ~/.continue/config.json
{
  "models": [
    {
      "title": "Claude 4.6 via OR",
      "provider": "openai",
      "model": "anthropic/claude-sonnet-4.6",
      "apiBase": "https://openrouter.ai/api/v1",
      "apiKey": "sk-or-v1-xxxxx"
    }
  ]
}
```

```yaml
# LiteLLM Proxy: config.yaml
model_list:
  - model_name: claude-router
    litellm_params:
      model: openrouter/anthropic/claude-sonnet-4.6
      api_key: sk-or-v1-xxxxx
```

<v-click>

**LiteLLM 多一层抽象**：自家服务后端可统一用 LiteLLM，背后再让 LiteLLM 通过 OR 转发。适合需要多团队配额管理的场景。

</v-click>

---
transition: slide-up
---

# Activity 监控

[openrouter.ai/activity](https://openrouter.ai/activity)：每次请求都记录

<v-clicks>

记录字段：**timestamp / model / provider / tokens / cost / latency / HTTP-Referer / X-Title**

</v-clicks>

<v-click>

**用途**：

- 监控成本（按 model / app 维度看 daily / weekly cost）
- 调试延迟（哪家 provider 慢）
- 模型选型（用真实数据对比 cost / quality）
- 导出 CSV / JSON 进 Grafana 做看板

</v-click>

---
transition: slide-up
---

# Models endpoint：动态发现

```python
import httpx
response = httpx.get("https://openrouter.ai/api/v1/models")
models = response.json()["data"]
```

返回字段：

```json
{
  "id": "anthropic/claude-sonnet-4.6",
  "context_length": 200000,
  "architecture": {"modality": "text+image->text", "tokenizer": "Claude"},
  "pricing": {"prompt": "0.0000033", "completion": "0.0000165"},
  "top_provider": {"context_length": 200000, "max_completion_tokens": 8192}
}
```

<v-click>

```python
# 找所有 200k+ context 且 input < $1/M 的模型
candidates = [m for m in models
    if m["context_length"] >= 200000
    and float(m["pricing"]["prompt"]) * 1_000_000 < 1.0]
```

</v-click>

---
transition: slide-up
---

# 性能调优：延迟 + 成本

```python
# 延迟优化（UI 场景）
extra_body={"provider": {"sort": "latency", "order": ["openai", "anthropic"]}}
```

<v-click>

| 模型 | OR 上首字延迟 |
| --- | --- |
| GPT-5-mini | ~600ms（最快） |
| Gemini 2.5 Flash | ~700ms |
| Claude Sonnet 4.6 | ~1.2s（UI 慎用） |
| Claude Opus 4.7 | ~2s |

</v-click>

<v-click>

**成本优化三件套**：

1. Caching：Claude `cache_control` 省 85% / GPT 自动 cache 省 45%
2. 模型梯度 fallback：`nano → mini → standard → opus`
3. `require_parameters: False`：让 OR 选最便宜 provider

</v-click>

---
transition: slide-up
---

# 价格中间费：与官方对比

OpenRouter 加 **10-30%** 中间费：

| Model | 官方价 | OpenRouter | 加价 |
| --- | --- | --- | --- |
| Claude Sonnet 4.6 输入 | $3/M | $3.30/M | +10% |
| Claude Opus 4.7 输入 | $15/M | $16.50/M | +10% |
| GPT-5 输入 | $5/M | $5.50/M | +10% |
| GPT-5-mini 输入 | $0.50/M | $0.55/M | +10% |
| Gemini 2.5 Flash 输入 | $0.30/M | $0.36/M | +20% |
| DeepSeek R1 输入 | $0.27/M | $0.30/M | +11% |

<v-click>

- 大厂模型（Claude / GPT）：加价稳定 10-15%
- 小厂 / 开源模型：加价波动 11-30%
- 实时价格：[openrouter.ai/models](https://openrouter.ai/models) 每模型详情页

</v-click>

---
transition: slide-up
---

# Response Headers：成本 + 实际用的模型

```python
response = client.chat.completions.with_raw_response.create(
    model="openai/gpt-5",
    messages=[...],
)
print(response.http_response.headers.get("OpenRouter-Provider"))
print(response.http_response.headers.get("OpenRouter-Cost"))
```

<v-click>

| Header | 用途 |
| --- | --- |
| `OpenRouter-Provider` | 实际用的 provider |
| `OpenRouter-Model` | 实际用的 model（auto routing 时） |
| `OpenRouter-Cost` | 本次费用（USD，已含中间费） |
| `OpenRouter-Provider-Cost` | provider 原始费用 |
| `X-OpenRouter-Latency-Ms` | 实际延迟 |

</v-click>

---
transition: slide-up
---

# 数据隐私设置

[Settings > Privacy](https://openrouter.ai/settings/privacy)：

| 选项 | 默认 | 建议 |
| --- | --- | --- |
| Allow logging | ✓ 开 | 商业项目关 |
| Allow training | ✗ 关 | 保持关 |
| Allow free model usage | ✓ 开 | 商业敏感数据关 |

```python
# 单次请求覆盖
extra_body={"provider": {"data_collection": "deny"}}
```

<v-click>

**OR 默认行为**：

- OR 自家：data 在服务器停留 < 24 小时（关 logging 后 0 保留）
- 上游 provider：通过 OR 设置统一管理
- `:free` 模型通常允许训练（不可关）

</v-click>

---
transition: slide-up
---

# 错误码

| HTTP | 类型 | 含义 |
| --- | --- | --- |
| 400 | bad_request | 参数错 |
| 401 | unauthorized | API key 错 |
| 402 | payment_required | credit 不足 |
| 403 | forbidden | model 无权限 |
| 404 | not_found | model ID 不存在 |
| 408 | timeout | provider 超时 |
| 429 | rate_limit | 超 RPM / RPD |
| 500 | internal_error | OR 内部错 |
| 502 | bad_gateway | provider 返错 |
| 503 | service_unavailable | 所有 provider 不可用 |

---
transition: slide-up
---

# 错误处理 + 模型级 Fallback

```python
def chat_with_fallback(messages, models=None):
    models = models or [
        "anthropic/claude-sonnet-4.6",
        "openai/gpt-5",
        "google/gemini-2.5-pro",
    ]
    for model in models:
        try:
            return client.chat.completions.create(
                model=model,
                messages=messages,
                timeout=30,
            )
        except RateLimitError:
            time.sleep(5)
        except APIError as e:
            if e.status_code == 402:
                raise NeedRechargeError()
            print(f"{model} failed: {e}")
    raise Exception("All models failed")
```

<v-click>

OR 内置 provider 级 retry，但**模型级 fallback** 仍需 app 层自己处理。

</v-click>

---
transition: slide-up
---

# 故障排查清单

| 问题 | 排查 |
| --- | --- |
| Claude MCP 不工作 | OR 不转发 MCP，直连 Anthropic |
| Gemini Files API 不工作 | OR 不支持，用 Vertex 直连 |
| GPT Realtime 不工作 | OR 不支持 WebSocket，直连 OpenAI |
| Tool 调用结果格式错 | 测每家实际输出，需 normalize |
| `response_format: json_schema` 失败 | 设 `require_parameters: True` 过滤 |
| 模型 ID 不存在 | 查 `/api/v1/models` 看是否 retire |
| Stream 一直不返回 | 网络问题（境内境外抖动） |
| credit 用完 | Settings → Add Credit / 自动 top-up |

---
transition: slide-up
---

# 安全考量

<v-clicks>

- **API key 分用途**：多个 key 区分项目（泄露后单独撤销）
- **关 logging**：商业项目关 Settings → Privacy → Allow logging
- **`:free` 谨慎**：通常允许训练数据，敏感场景禁用
- **IP 白名单**：Pro 功能，限制 key 只能从特定 IP 用
- **`data_collection: deny`**：单次请求强制覆盖账号设置
- **不要在前端裸调**：永远走自家后端转发，避免 key 暴露浏览器

</v-clicks>

---
transition: slide-up
---

# `extra_body` 完整选项

```python
extra_body={
    "provider": {
        "order": ["openai", "anthropic", "azure"],
        "allow_fallbacks": True,
        "sort": "throughput",       # throughput / latency / price
        "require_parameters": True,
        "data_collection": "deny",  # allow / deny
        "ignore": ["xai"],           # 排除某些 provider
    },
    "transforms": ["middle-out"],    # 上下文压缩
    "models": [                       # 多 model fallback（OR 自动选）
        "openai/gpt-5",
        "anthropic/claude-sonnet-4.6",
    ],
    "route": "fallback",
}
```

<v-click>

**`transforms: middle-out`**：上下文超 context_length 时，OR 自动从中间裁切（保留头尾）。

</v-click>

---
transition: slide-up
---

# Rate Limits + 充值

| 模型类型 | 默认 RPM | 默认 RPD |
| --- | --- | --- |
| `:free` 模型 | 20 | 200（充值 $10+ → 1000） |
| 付费模型 | 由 provider 决定 | - |

<v-clicks>

**充值方式**：

- Stripe 一次性 / 自动 top-up（余额低于阈值自动扣信用卡）
- Crypto：BTC / ETH / USDC（链上确认后入账）

**触发 429 后**：

- OR 自动 fallback 到其它 provider（allow_fallbacks=True 时）
- 仍触发说明所有 provider 都满 → sleep 等待
- 加 `X-Title` + `HTTP-Referer` 可申请提高 rate limit

</v-clicks>

---
transition: slide-up
---

# 流式响应

```python
stream = client.chat.completions.create(
    model="anthropic/claude-sonnet-4.6",
    messages=[...],
    stream=True,
)

for chunk in stream:
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="", flush=True)
    if reached_my_limit():
        stream.close()   # 提前终止，节省 token
        break
```

<v-click>

**关键特性**：

- OR 把各家流式格式归一到 OpenAI 兼容 SSE
- Anthropic SSE 事件、Google chunk 都自动转换
- 已用 OpenAI SDK 流式代码可直接用，零改动

</v-click>

---
transition: slide-up
---

# 与官方直连的取舍

| 维度 | OpenRouter | 官方直连 |
| --- | --- | --- |
| 接入成本 | 改 base_url 即用 | 多 SDK / 多账号 |
| 价格 | +10-30% 中间费 | 原价 |
| 大陆访问 | Worker / 直连 / 反代 | 普遍困难 |
| 独有特性 | 部分不支持 | 全支持 |
| 多模型对比 | 一份代码切 | 重写代码 |
| Fallback / 高可用 | 内置 | 自建 |
| 合规 / SLA | 中等 | 企业级 |
| 监控 | Activity 面板 | 各家面板 |
| 支付 | 信用卡 / Crypto | 国内卡难 |

---
transition: slide-up
---

# 综合最佳实践

<v-clicks>

1. **始终带 Headers**：`HTTP-Referer` + `X-Title` 便于 Activity 追踪
2. **加 `require_parameters: True`**：避免 fallback 到不支持参数的 provider
3. **价格梯度 fallback**：mini → standard → opus 三层兜底
4. **启用 caching**：Claude `cache_control` / GPT 自动 / Gemini implicit
5. **生产 + 测试用不同 key**：泄露后单独撤销
6. **关 logging + `data_collection: deny`**：商业项目数据隐私
7. **定期 export activity**：进 Grafana 做成本看板
8. **大陆部署用 Worker**：稳定 + 免费 + 简单

</v-clicks>

---
layout: center
class: text-center
---

# 总结

适合：大陆访问 / 多模型对比 / 个人项目 / fallback 需求

不适用：企业 SLA / 厂商独有特性 / 极致价格敏感

<div class="mt-8 text-2xl">
  <carbon:document /> <a href="https://openrouter.ai/docs" target="_blank">openrouter.ai/docs</a>
</div>

<div class="mt-4">
  <carbon:network-3 /> <a href="https://openrouter.ai/models" target="_blank">openrouter.ai/models</a>
</div>

<div class="mt-4">
  <carbon:dashboard /> <a href="https://openrouter.ai/activity" target="_blank">openrouter.ai/activity</a>
</div>
