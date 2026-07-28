---
theme: seriph
background: https://cover.sli.dev
title: Ollama 本地 LLM 运行时
info: |
  Ollama 完全指南：本地运行 · Modelfile · GGUF 量化 · OpenAI 兼容 API · 工具调用

  Learn more at [https://ollama.com](https://ollama.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Ollama

本地 LLM 运行时 · Modelfile · GGUF · OpenAI 兼容 API

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Ollama 让本地跑大模型像运行 Docker 一样简单。
-->

---
transition: fade-out
---

# Ollama 是什么

2023 年开源的**本地 LLM 运行时**——「让跑大模型像运行 Docker 一样简单」

- **单一二进制 + 子命令**：`ollama run llama3.2` 一行下载/量化/起服务
- **Modelfile 声明式**：FROM / SYSTEM / PARAMETER / TEMPLATE，像 Dockerfile
- **GGUF 量化**：Q4_K_M / Q5_K_M / Q8_0，8B 模型 8GB 内存可跑
- **跨硬件通吃**：NVIDIA / AMD / Apple Silicon / Intel / 纯 CPU
- **OpenAI 兼容 API**：默认 `:11434`，改 `base_url` 即接入生态

> 底层 = llama.cpp + GGUF + Docker 式 CLI + OpenAI API

<!--
Ollama 把推理复杂度藏进一个二进制，本地/边缘首选。
-->

---
layout: two-cols
---

# 安装与第一个模型

```bash
# Linux 一键脚本（注册 systemd 服务）
curl -fsSL https://ollama.com/install.sh | sh

# Docker
docker run -d -v ollama:/root/.ollama \
  -p 11434:11434 ollama/ollama

# 跑模型（首次自动下载 + 量化）
ollama run llama3.2
>>> 你好
>>> /bye
```

::right::

# 常用 CLI 命令

| 命令 | 用途 |
|---|---|
| `ollama run` | 拉取并进对话 |
| `ollama pull` / `rm` | 下载 / 删除 |
| `ollama create` | 从 Modelfile 构建 |
| `ollama list` / `ps` | 列已装 / 运行中 |
| `ollama show` | 显示模型详情 |

> `ollama run` = pull + 启动交互 REPL

<!--
run/pull/list/create 是日常四件套。
-->

---

# Modelfile —— 自定义模型

像 Dockerfile 一样声明式定义、复刻、分发模型

```dockerfile
# Modelfile
FROM llama3.2

SYSTEM """你是一个友善的中文助手，回答简洁。"""

PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_ctx 4096

# few-shot 对话示例
MESSAGE user "翻译：今天天气不错"
MESSAGE assistant "Nice weather today."
```

```bash
ollama create mybot -f ./Modelfile
ollama run mybot
```

> FROM 必需；其余可选。FROM 也支持本地 GGUF 路径。

<!--
Modelfile 是 Ollama 的灵魂，工作流与 Docker 高度一致。
-->

---

# Modelfile 指令一览

| 指令 | 必需 | 用途 |
|---|---|---|
| `FROM` | 是 | 基础模型（registry tag 或 `./model.gguf`）|
| `TEMPLATE` / `SYSTEM` | 否 | chat template / 默认 system |
| `PARAMETER` | 否 | 采样/推理参数 |
| `ADAPTER` / `MESSAGE` | 否 | LoRA adapter / few-shot 示例 |
| `LICENSE` | 否 | 模型许可证 |

**常用 PARAMETER**：`temperature` / `top_p` / `top_k` / `num_ctx` / `num_predict` / `stop` / `seed` / `repeat_penalty`

> TEMPLATE 用 Go template 语法，错误信息不友好，需按模型族写对 special token。

<!--
FROM 是唯一必需指令，其余按需。
-->

---
layout: two-cols
---

# GGUF 量化级别

同一模型多档量化，权衡体积/速度/精度：

| 量化 | 7B 体积 | 精度 | 适用 |
|---|---|---|---|
| Q8_0 | ~7GB | 无损 | 要精度 |
| Q5_K_M | ~4.8GB | 很小 | 推荐 |
| **Q4_K_M** | ~4.1GB | 小 | **默认** |
| Q3_K_M / Q2_K | ~3.3GB / 2.7GB | 明显 / 较大 | 内存紧 / 极限压缩 |

::right::

# 自定义量化

从 HF safetensors 转 GGUF：

```bash
# 1. 转 FP16 GGUF
python convert_hf_to_gguf.py \
  ./hf_model --outtype f16

# 2. 量化
./llama-quantize \
  model-f16.gguf model-q4.gguf q4_K_M

# 3. Modelfile 引用
FROM ./model-q4.gguf
```

> 默认 tag 通常是 Q4_K_M，体积/速度/精度最佳平衡点。

<!--
Q4_K_M 是大多数场景的甜点。
-->

---

# OpenAI 兼容 API

默认监听 `http://localhost:11434`，改 `base_url` 即接入生态

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",   # 任意字符串，不校验
)

resp = client.chat.completions.create(
    model="llama3.2",
    messages=[{"role": "user", "content": "你好"}],
)
print(resp.choices[0].message.content)
```

**端点**：`/v1/chat/completions` · `/v1/completions` · `/v1/embeddings` · `/v1/models`

> 全功能（keep_alive / options / raw）用原生 `/api/chat` `/api/generate`。

<!--
OpenAI 兼容让 LangChain/Dify/Open WebUI 改 base_url 即用。
-->

---
layout: two-cols
---

# 工具调用

OpenAI 风格 tools，Llama 3.1+ / Qwen2.5 原生支持：

```python
resp = client.chat.completions.create(
    model="llama3.1",
    messages=[{"role":"user","content":"北京天气？"}],
    tools=[{
        "type": "function",
        "function": {
            "name": "get_weather",
            "parameters": {
                "type": "object",
                "properties": {"city": {"type":"string"}}
            }
        }
    }],
)
```

::right::

# 结构化输出（JSON）

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [{"role":"user",
    "content":"列出3种水果JSON"}],
  "format": {
    "type": "object",
    "properties": {"fruits": {"type":"array"}},
    "required": ["fruits"]
  },
  "stream": false
}'
```

> `format` 接 JSON 字符串或 JSON Schema（GBNF 约束）。

<!--
tools + format=json 覆盖 Agent 与抽取两大场景。
-->

---

# 性能调优

**上下文长度 num_ctx**：直接决定 KV Cache 内存

- KV Cache ≈ 2 × layers × dim × num_ctx × bytes
- Llama3 8B、num_ctx=8192 时 KV Cache 约 4GB，盲目调大易 OOM

**并发 OLLAMA_NUM_PARALLEL**：默认串行，设 4 可并发 4 请求（共享权重，各占 KV Cache）

**keep_alive**：模型加载后默认驻留 5 分钟，空闲设 0 立即卸载省显存

**GPU 选层**：`num_gpu` 控制多少层放 GPU，显存不够自动 CPU offload

> 生产高并发请用 vLLM（PagedAttention / Continuous Batching）。

<!--
num_ctx 与并发是显存主要变量。
-->

---

# 部署运维

**systemd 服务**（Linux 自动注册）：`systemctl status ollama` · `journalctl -u ollama -f`

**远程访问 + CORS**：默认只监听 127.0.0.1

```bash
sudo systemctl edit ollama
[Service]
Environment="OLLAMA_HOST=0.0.0.0"
Environment="OLLAMA_ORIGINS=*"
```

**模型存储**：默认 `~/.ollama/models`，改用 `OLLAMA_MODELS=/data/ollama/models`

**Docker 持久化 + GPU**：

```bash
docker run -d -v /data/ollama:/root/.ollama \
  -p 11434:11434 --gpus all ollama/ollama
```

> `OLLAMA_ORIGINS` 控制 CORS，前端跨域调用必设。

<!--
远程访问与 CORS 是部署常踩点。
-->

---
layout: quote
---

# Ollama 选型经验

「消费级 / 本地 / 开发调试 → Ollama；生产高并发 → vLLM。两者并不冲突，开发用 Ollama，上线切 vLLM。」

---

# Ollama vs vLLM vs LM Studio

| 维度 | Ollama | vLLM | LM Studio |
|---|---|---|---|
| **定位** | 本地/边缘运行 | 数据中心高吞吐 | 本地 GUI |
| **硬件** | 全平台通吃 | NVIDIA/AMD GPU | 全平台（GUI）|
| **模型格式** | GGUF | safetensors | GGUF |
| **易用性** | CLI 一行起 | 需配置 | 最易（GUI）|
| **高并发 / Modelfile** | 弱 / **有** | **强** / 无 | 弱 / 无 |

> 高并发 API 网关请用 vLLM；多卡 TP 也用 vLLM。

<!--
定位互补：Ollama 覆盖广，vLLM 吞吐高。
-->

---
layout: center
class: text-center
---

# 小结

Ollama = GGUF + llama.cpp + Docker 式 CLI + OpenAI API

**一行起模型 · Modelfile 定制 · 跨硬件通吃 · 本地首选**

[Ollama 文档](https://ollama.com) · [教程](https://ollama.readthedocs.io) · [GitHub](https://github.com/ollama/ollama)

<!--
本地/边缘跑大模型，Ollama 是事实标准。
-->
