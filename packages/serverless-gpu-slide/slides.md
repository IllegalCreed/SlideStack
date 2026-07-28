---
theme: seriph
background: https://cover.sli.dev
title: Serverless GPU 平台完全指南
info: |
  Serverless GPU 平台完全指南：Modal 函数式 · Replicate cog · 按秒计费 · 自动扩缩容 · 冷启动优化

  Learn more at [https://modal.com/docs](https://modal.com/docs) · [https://replicate.com/docs](https://replicate.com/docs)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Serverless GPU

按调用计费 · 自动扩缩容 · Modal · Replicate

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
按调用计费的托管式 GPU 推理平台，代表是 Modal 与 Replicate。
-->

---
transition: fade-out
---

# Serverless GPU 是什么

按调用计费、自动扩缩容的**托管式 GPU 推理平台**

- **按秒计费**：只在推理时付费，闲时零成本
- **零运维**：不碰 Docker / K8s / 负载均衡，平台全包
- **冷启动优化**：Memory Snapshot + 容器复用实现亚秒级
- **GPU 档位齐全**：T4 到 H100/B300 全覆盖，按需调度
- **开发体验流畅**：本地调试与云端一致，一键上线

> 两大代表：**Modal**（函数式 Python）与 **Replicate**（cog 模型托管 API）

<!--
核心：按调用计费 + 自动扩缩容 + 零运维。
-->

---
layout: two-cols
---

# Modal：函数式 Python

`@app.function` 把 Python 函数变云端执行单元

```python
# app.py
import modal

app = modal.App("hello-gpu")

image = modal.Image.debian_slim().pip_install(
    "torch", "transformers")

@app.function(image=image, gpu="T4")
def answer(question: str) -> str:
    from transformers import pipeline
    pipe = pipeline("text-generation", model="gpt2")
    return pipe(question, max_new_tokens=20)[0]["generated_text"]

@app.local_entrypoint()
def main(q: str = "What is serverless GPU?"):
    print(answer.remote(q))
```

::right::

# 运行与部署

```bash
pip install modal
modal setup      # 配置 token

modal run app.py     # 一次性运行
modal serve app.py   # 持续运行 + 热重载
modal deploy app.py  # 持久化部署
```

**核心概念**

- `modal.App("name")`：应用容器
- `modal.Image`：基础设施即代码
- `gpu="T4"` 字符串选型
- `.remote()` 远程调用

> `modal serve` 实时热重载，开发体验极佳

<!--
Modal 用装饰器把 Python 函数变云端 GPU 单元。
-->

---

# Modal GPU 选型

字符串指定 GPU 型号，按秒计费

| 字符串 | GPU | $/小时 | 适合 |
|------|------|------|------|
| `"T4"` | T4 16GB | 0.59 | 推理入门 |
| `"L40S"` | L40S 48GB | 1.95 | 大模型推理 |
| `"A100"` | A100 40/80GB | 2.10/2.50 | 通用大模型 |
| `"H100"` | H100 80GB | 3.95 | 旗舰训练推理 |

**灵活指定**

```python
@app.function(gpu="A100-80GB")   # 指定显存
@app.function(gpu=2)             # 2 块默认 GPU
@app.function(gpu="H100:2")      # 2 块 H100
```

> 闲时零成本，低 QPS 场景比包月 GPU 便宜一个数量级

<!--
T4 入门到 H100 旗舰，按秒计费按需选型。
-->

---
layout: two-cols
---

# 暴露 HTTP endpoint

```python
import modal
from pydantic import BaseModel

app = modal.App("api")
image = modal.Image.debian_slim().pip_install("transformers", "torch")

class Q(BaseModel):
    text: str

@app.function(image=image, gpu="A100")
@modal.fastapi_endpoint(method="POST")
def classify(req: Q) -> dict:
    from transformers import pipeline
    pipe = pipeline("text-classification")
    return pipe(req.text)[0]
```

::right::

# 部署与调用

```bash
modal deploy app.py
modal app url     # 拿持久化 URL

curl -X POST <url>/classify \
  -H "Content-Type: application/json" \
  -d '{"text": "I love Modal!"}'
```

**端点类型**

- `@modal.fastapi_endpoint()`：单函数 HTTP
- `@modal.asgi_app()`：完整 ASGI 应用
- `@modal.wsgi_app()`：WSGI（Flask 等）

> 部署后 `.web_url` 拿到 https URL

<!--
fastapi_endpoint 一行把函数变 HTTP API。
-->

---
layout: two-cols
---

# Replicate：cog 模型托管

`cog.yaml` + `predict.py` 打包标准生产容器

```yaml
# cog.yaml
build:
  gpu: true
  python_version: "3.11"
  python_packages:
    - "torch==2.2.0"
    - "transformers==4.40.0"
predict: "predict.py:Predictor"
```

::right::

# predict.py（BaseRunner）

```python
from cog import BaseRunner, Input

class Runner(BaseRunner):
    def setup(self) -> None:
        """一次性加载权重"""
        from transformers import pipeline
        self.pipe = pipeline(
            "text-classification")

    def run(self, text: str = Input(
            description="待分类文本")) -> dict:
        r = self.pipe(text)[0]
        return {"label": r["label"],
                "score": float(r["score"])}
```

> 旧 `BasePredictor` 已弃用，新代码用 `BaseRunner` + `run()`

<!--
cog 把模型打包成标准容器，setup 加载 run 推理。
-->

---

# Replicate 部署与调用

```bash
# 本地调试
cog predict -i text="Modal is great"

# 推送到 Replicate
cog login
cog push r8.im/<user>/<model>
# 返回版本 ID，如 r8.im/xxx/model:abc123

# 调用 Prediction API（异步）
curl -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Token $REPLICATE_API_TOKEN" \
  -d '{"version":"abc123","input":{"text":"Hello"}}'
```

**Python SDK**

```python
import replicate
output = replicate.run("user/model:abc123", input={"text": "Hello"})
```

> Prediction API 异步：提交后轮询直到 `succeeded`，或配 webhook 回调

<!--
cog push 部署，Prediction API 异步调用。
-->

---

# Modal 自动扩缩容

四个参数控制成本与体验的平衡

```python
@app.function(
    gpu="A100",
    min_containers=2,             # 保活，避免冷启动
    max_containers=20,            # 上限，防失控成本
    scaledown_window=300,         # 空闲 5 分钟回收
    target_concurrency_input=8,   # 每容器并发 8 即扩容
)
def infer(...): ...
```

**调参经验**

- `min_containers`：设 1-2 抵消冷启动；设 0 最省
- `scaledown_window` 短省钱但易冷启动，长体验好；`target_concurrency_input` 高吞吐高、低扩容快

> 流量回落 → 容器空闲 `scaledown_window` 后回收

<!--
四参数平衡成本与冷启动体验。
-->

---

# 冷启动优化

Memory Snapshot 捕获进程状态，亚秒级恢复

```python
import modal

volume = modal.Volume.from_name("model-cache", create_if_missing=True)
image = modal.Image.debian_slim().pip_install(
    "torch", "transformers").env({"HF_HOME": "/data/hf"})

@app.function(
    gpu="A100-80GB", image=image,
    volumes={"/data": volume},          # 持久化权重
    min_containers=1,                   # 保活
    enable_memory_snapshot=True,        # 内存快照
)
def generate(prompt: str) -> str:
    ...
```

**优化三板斧**

- Memory Snapshot：跳过模型加载（最耗时）
- `min_containers > 0`：保活容器零冷启动
- `modal.Volume`：缓存权重，避免重复下载

> 首次加载 70B LLM 仍需数秒，不适合硬实时场景

<!--
Memory Snapshot + 保活 + Volume 缓存 = 亚秒冷启动。
-->

---
layout: two-cols
---

# vs 传统 GPU 租赁

| 维度 | Serverless | 包月租赁 |
|------|------|------|
| 计费 | 按秒 | 开机即付费 |
| 闲时 | 零 | 高 |
| 高 QPS | 累加可能更高 | 固定划算 |
| 运维 | 零 | 高 |
| 冷启动 | 亚秒-数秒 | 无 |

::right::

# 选型经验

**选 Serverless**

- QPS < 10 或流量波动大
- MVP / 周末 hack
- 偶发批量推理
- 大模型快速验证

**选自建/SageMaker**

- 稳态 QPS > 100
- 数据敏感不能出域
- 需极致 CUDA 优化

> 法则：**QPS 低或波动大 → Serverless；高且稳 → 自建**

<!--
低 QPS 选 Serverless，高稳态选自建。
-->

---

# 典型场景选型

| 场景 | 推荐 |
|------|------|
| 周末 hack 上线 LLM 推理 | Modal（开发体验 + 按秒） |
| 开源模型做成 API 产品 | Replicate（cog + Prediction API） |
| 数据敏感（医疗/金融） | 自建 Triton / SageMaker VPC |
| 稳态 QPS 1000+ 极致优化 | 自建 GPU + Triton + TensorRT |
| 偶发批量（夜间跑批） | Modal（零闲时成本） |

> 供应商锁定：Modal `@app.function` / Replicate cog 迁移需重写

<!--
按场景选型，注意供应商锁定风险。
-->

---
layout: quote
---

# Serverless GPU 核心权衡

「按秒计费 + 自动扩缩容换来零运维与亚秒冷启动，代价是稳态高 QPS 成本更高与数据出域——选型本质是流量曲线与合规的博弈。」

---
layout: center
class: text-center
---

# 小结

Serverless GPU = 按秒计费 + 自动扩缩容

**Modal 函数式 · Replicate cog · 冷启动优化 · 场景化选型**

[Modal 文档](https://modal.com/docs) · [Replicate 文档](https://replicate.com/docs) · [cog GitHub](https://github.com/replicate/cog)

<!--
按秒计费 + 自动扩缩容，低 QPS 与突发流量的最优解。
-->
