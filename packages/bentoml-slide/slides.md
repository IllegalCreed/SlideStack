---
theme: seriph
background: https://cover.sli.dev
title: BentoML 模型服务化完全指南
info: |
  BentoML 模型服务化完全指南：Service 装饰器 · Runner · Dynamic Batching · Bento 打包 · 容器化部署

  Learn more at [https://docs.bentoml.com/en/latest/](https://docs.bentoml.com/en/latest/)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## BentoML

统一模型服务化框架 · Service · Runner · 1.4.x

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
BentoML 把模型推理脚本几行代码变成生产级服务。
-->

---
transition: fade-out
---

# BentoML 是什么

面向 ML 工程师的**统一模型服务化框架**

- **ML 专用 serving 抽象**：`@bentoml.service` + `@bentoml.api`，方法即 API
- **Bento 标准化打包**：代码 + 模型 + 依赖 + Docker 一次声明，可复现
- **打包即容器化**：`bentoml containerize` 直接出 OCI 镜像，免手写 Dockerfile
- **多框架 + 动态批处理**：PyTorch / ONNX / HF 一致 API；`batchable=True` 自动聚合微批

> 当前稳定版 **1.4.x**（PyPI），默认端口 3000，自带 Swagger UI

<!--
核心理念：模型推理脚本几行代码变生产服务。
-->

---

# 最简 Service

`@bentoml.service` 装饰类，`@bentoml.api` 装饰方法即 API

```python
# service.py
import bentoml

@bentoml.service
class Summarize:
    def __init__(self) -> None:
        from transformers import pipeline
        self.pipe = pipeline(
            "summarization",
            model="sshleifer/distilbart-cnn-12-6")

    @bentoml.api
    def summarize(self, text: str) -> str:
        return self.pipe(text)[0]["summary_text"]
```

```bash
bentoml serve service:Summarize
# 浏览器打开 http://localhost:3000 即 Swagger UI
```

> 模型在 `__init__` 加载，每个 worker 实例化一次

<!--
Service 类 + @api 方法 = 生产 API，自带 Swagger。
-->

---
layout: two-cols
---

# Runner：模型执行单元

把模型包成独立进程，绕开 GIL

```python
import bentoml

@bentoml.service
class Classifier:
    _runner = bentoml.pytorch.get("resnet50:latest").to_runner()

    @bentoml.api
    def classify(self, image: "PIL.Image.Image") -> str:
        return postprocess(self._runner.run(preprocess(image)))
```

::right::

# 为什么用 Runner

| 维度 | 直接加载 | Runner |
|------|------|------|
| GIL | 单 worker 串行 | 真正并行 |
| 批处理 | 手写 | 自动聚合 |
| 多 worker | 不支持 | `nworkers=N` |
| GPU 共享 | 不支持 | 多 Runner 共享 |

> `to_runner()` 是多 worker 并行的关键

<!--
Runner = 独立进程，绕开 GIL，支持多 worker。
-->

---

# 模型保存与加载

BentoML 模型仓库 + tag，跨环境一致

```python
import bentoml
from transformers import pipeline

# 保存（带 tag）
pipe = pipeline("summarization",
                model="sshleifer/distilbart-cnn-12-6")
saved = bentoml.transformers.save_model(
    "distilbart_summarize", pipe)
print(saved.tag)  # distilbart_summarize:xxxxxx

# 在 Service 中加载
runner = bentoml.transformers.get(
    "distilbart_summarize:latest").to_runner()
```

**框架适配器统一 API**

- `bentoml.pytorch.get(tag).to_runner()`
- `bentoml.onnx.get(tag)` / `bentoml.transformers.get(tag)`
- `bentoml.diffusers.get(tag)` / `bentoml.sklearn.get(tag)`

> 模型管理：`bentoml models list / pull / push`

<!--
Bento 模型仓库 + tag，框架适配器一致 API。
-->

---

# Dynamic Batching（微批）

`batchable=True` 把并发请求自动聚合为 batch

```python
@bentoml.api(batchable=True, batch_dim=0)
def classify(self, images: list["PIL.Image.Image"]) -> list[str]:
    tensors = [preprocess(im) for im in images]   # 自动聚合的 batch
    logits = self._runner.run(torch.stack(tensors))
    return [postprocess(l) for l in logits]
```

**调度器行为**

- 默认 `max_latency_ms=10000`（可调）
- 窗口内凑到 `max_batch_size` 或超时即执行；GPU 模型开（吞吐敏感），CPU 一般不开

> Runner 自动根据框架 GIL 行为选择 worker 数

<!--
batchable=True 让 API 自动聚合并发为 batch。
-->

---
layout: two-cols
---

# bentofile.yaml 打包

```yaml
service: "service:Summarize"
labels:
  owner: ml-team
  stage: prod
include:
  - "*.py"
python:
  packages:
    - torch
    - transformers
docker:
  base_image: nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu22.04
  system_packages: [ffmpeg]
  cuda_version: "12.1"
models:
  - "distilbart_summarize:latest"
```

::right::

# 构建与容器化

```bash
# 打包成 Bento（本地仓库）
bentoml build
# → ~/.bentoml/bentos/summarize-service:xxxxx

# 容器化（出 OCI 镜像）
bentoml containerize summarize-service:latest

# 运行
docker run --rm -p 3000:3000 \
  summarize-service:latest

# 部署到 BentoCloud
bentoml deploy summarize-service:latest \
  -n summarize-prod
```

> BuildKit 加速，缓存友好，免手写 Dockerfile

<!--
bentofile.yaml 一次声明，build/containerize/deploy 全链路。
-->

---

# IO 类型与 Pydantic

原生 Python 类型自动转 schema，复杂场景用 Pydantic

```python
from pydantic import BaseModel

class TextInput(BaseModel):
    text: str
    max_length: int = 128
    temperature: float = 0.7

class Result(BaseModel):
    summary: str
    tokens: int

@bentoml.api
def summarize(self, req: TextInput) -> Result:
    ...
```

**支持的 IO**

- 原生：`str` / `int` / `dict` / `list` 自动转 Pydantic
- 数值：`numpy.ndarray` / `pandas.DataFrame`
- 多模态：`PIL.Image.Image` / `bentoml.io.File` / `Multipart`

> Pydantic schema 自动生成 OpenAPI，Swagger 直接填表测试

<!--
原生类型即 schema，Pydantic 兜底复杂输入。
-->

---

# 异步与流式

LLM token 流式输出的标准写法

```python
@bentoml.api
async def stream(self, prompt: str):
    async for token in self._runner.async_stream(prompt):
        yield token    # SSE / chunked 自动启用
```

**资源声明（BentoCloud 调度）**

```python
@bentoml.service(resources={"gpu": 1, "memory": "4Gi"})
class Txt2Img:
    def __init__(self):
        self._runner = bentoml.diffusers.get("sd_v15:latest").to_runner()
```

> `resources={"gpu": 1}` 让平台调度到带 GPU 的节点

<!--
异步 + 流式是 LLM 服务的标配。
-->

---

# 部署形态对比

| 形态 | 适用 | 说明 |
|------|------|------|
| **本地 `bentoml serve`** | 开发 | 单进程调试 |
| **`--production`** | 单机生产 | 多 worker + Uvicorn |
| **Docker 容器** | 任意 K8s | containerize → registry → deploy |
| **Yatai（社区）** | 自建 K8s | 部署/监控/模型仓库 |
| **BentoCloud（商业）** | 托管生产 | Canary/CI/CD/扩缩容一站式 |

**自带端点**

- `GET /` Swagger UI · `GET /docs.json` OpenAPI
- `GET /metrics` Prometheus · `GET /healthz` Liveness

> 商业版 BentoCloud 文档维护力度优于社区版 Yatai

<!--
本地开发 → 容器 → BentoCloud，路径清晰。
-->

---
layout: two-cols
---

# vs FastAPI

| 维度 | BentoML | FastAPI |
|------|------|------|
| 定位 | ML 推理专用 | 通用 Web API |
| 微批 | 自动 | 手写调度 |
| 模型管理 | 内置仓库 | 无 |
| 框架适配 | 一致 API | 无 |
| 部署 | build/deploy | 仅 uvicorn |

::right::

# 选型经验

**选 BentoML**

- 纯模型推理 / 多模型组合
- 需要 Bento 化标准交付、可复现部署

**选 FastAPI**

- CRUD / 业务 API
- IO-bound 混合负载、学习成本敏感

> 混合用：FastAPI 把 BentoML Service 当下游调用

<!--
纯推理选 BentoML，业务多选 FastAPI。
-->

---
layout: quote
---

# BentoML 核心心智

「Service = API 边界，Runner = 模型执行单元，Bento = 标准交付物——三层抽象把模型脚本变成可复现的生产服务。」

---
layout: center
class: text-center
---

# 小结

BentoML = Service + Runner + Bento

**`@bentoml.service` · 微批聚合 · 容器化 · BentoCloud 部署**

[BentoML 文档](https://docs.bentoml.com/en/latest/) · [GitHub](https://github.com/bentoml/BentoML) · [BentoCloud](https://www.bentocloud.com/)

<!--
三层抽象把模型脚本变成可复现生产服务。
-->
