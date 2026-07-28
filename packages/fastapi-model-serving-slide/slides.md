---
theme: seriph
background: https://cover.sli.dev
title: FastAPI 模型服务化
info: |
  FastAPI 模型服务化完全指南：lifespan 加载 · async 陷阱 · SSE 流式 · 批量推理 · 多 worker 部署

  Learn more at [https://fastapi.tiangolo.com](https://fastapi.tiangolo.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## FastAPI 模型服务化

lifespan · async 陷阱 · SSE 流式 · 批量推理 · 多 worker

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
把模型从 notebook 推到生产 API 的关键一公里。
-->

---
transition: fade-out
---

# 模型服务化的核心问题

把模型推到生产 API，要解决 4 个工程问题

| 问题 | 通用 web | 模型服务化 |
|---|---|---|
| **资源初始化** | 无/连接池 | 模型加载到显存（耗时 + 占资源）|
| **单请求耗时** | ms 级（I/O 为主）| 百 ms 到秒级（CPU/GPU 计算）|
| **并发模型** | async I/O 多路复用 | CPU/GPU 密集，GIL 与显存约束 |
| **响应形式** | 一次性 JSON | 可能要流式（LLM token 流）|

> FastAPI 因 async + 类型安全 + 自动文档，成 Python ML 服务化首选。

<!--
与通用 web 的根本区别：模型加载耗时、计算密集、可能流式。
-->

---

# lifespan 加载模型（核心模式）

模型必须在启动时加载一次，常驻供所有请求复用

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    import torch
    ml_models["resnet"] = torch.jit.load("resnet.pt").to("cuda").eval()
    yield                      # ← 应用运行期间
    ml_models.clear()          # ← 关闭：释放资源

app = FastAPI(lifespan=lifespan)
```

- `yield` 之前 = 启动逻辑；之后 = 关闭逻辑
- 一个 app 只能有一个 lifespan（旧 `@app.on_event` 已废弃）

> 每请求 load 要几十秒，无法接受——加载只发生在启动一次。

<!--
lifespan 是模型服务化的根基：启动加载、关闭释放。
-->

---
layout: two-cols
---

# async 陷阱（最常踩坑）

**核心：CPU/GPU 密集推理绝不能用 `async def`**

```python
# ✅ 正确：普通 def
# FastAPI 自动丢外部 threadpool
@app.post("/predict")
def predict(inp: Input):
    result = model(inp.features)  # CPU 密集
    return Output(label=result.label)

# ❌ 错误：阻塞事件循环，全服务卡死
@app.post("/predict")
async def predict(inp: Input):
    result = model(inp.features)
    return result
```

::right::

# 混合场景用 threadpool

端点既有 async I/O 又有 CPU 推理：

```python
from fastapi.concurrency \
    import run_in_threadpool

@app.post("/predict")
async def predict(inp: Input):
    # async I/O 部分
    user = await fetch_user(inp.uid)
    # CPU 部分：显式丢线程池
    result = await run_in_threadpool(
        model, inp.features)
    return result
```

> 一句话：有 await → async def；纯计算 → def。

<!--
新手最常犯：async def 里直接推理，事件循环被占死。
-->

---

# SSE 流式输出（LLM token 流）

`StreamingResponse` + async generator 实现 token 流

```python
from fastapi.responses import StreamingResponse
import anyio

async def token_stream(prompt: str):
    async for token in my_llm.stream(prompt):
        yield f"data: {token}\n\n"      # SSE 标准格式
        await anyio.sleep(0)            # 让事件循环处理取消
    yield "data: [DONE]\n\n"

@app.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    return StreamingResponse(
        token_stream(req.prompt),
        media_type="text/event-stream",
    )
```

- `media_type="text/event-stream"` 让浏览器识别为 SSE
- `await anyio.sleep(0)` 不可省——客户端断开后才能取消生成器

> SSE 格式与 OpenAI/vLLM/Ollama 同款。

<!--
LLM 服务流式输出的事实标准。
-->

---

# 批量推理端点

单样本 forward 有固定开销，合成 batch 摊薄，吞吐提升数倍

```python
from pydantic import BaseModel
import numpy as np

class Item(BaseModel):
    id: str
    features: list[float]

@app.post("/predict/batch", response_model=list[Result])
def predict_batch(items: list[Item]):
    batch = np.stack([np.array(i.features) for i in items])
    outputs = model(batch)       # 一次 forward 处理整批
    return [Result(id=i.id, label=o.label)
            for i, o in zip(items, outputs)]
```

- 限制 `len(items) <= 64`，防单请求 OOM
- 这是「客户端攒批」，非服务端 dynamic batching（后者用 Triton/vLLM）

> 服务端攒批需自写调度器或用 Triton/BentoML。

<!--
批量端点是提升吞吐最直接的手段。
-->

---

# 与推理库配合

| 后端 | 加载方式 | 端点特征 |
|---|---|---|
| **PyTorch JIT** | `torch.jit.load().to("cuda").eval()` | def，释放 GIL |
| **ONNX Runtime** | `ort.InferenceSession(providers=["CUDA"])` | def，释放 GIL |
| **HuggingFace** | `AutoModel.from_pretrained` | def，释放 GIL |
| **scikit-learn** | `joblib.load()` | def，受 GIL 靠多 worker |
| **vLLM** | `from vllm import LLM` | 自带 batching，FastAPI 反代 |

> 释放 GIL 的库（onnxruntime/torch C++ 后端）单 worker 多线程可并发。

<!--
能用释放 GIL 的库就用，多 worker 才榨干 CPU 多核。
-->

---

# 部署：gunicorn + uvicorn workers

生产用 gunicorn 管理 uvicorn worker 进程

```bash
pip install gunicorn "uvicorn[standard]"

gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app \
  --bind 0.0.0.0:8000 --timeout 120
```

**worker 数怎么定**

- **CPU 模型**：worker 数 ≈ CPU 核数（每 worker 独占核）
- **GPU 模型**：每 worker 一份显存，4 worker 跑 7B 要 4×14GB；通常 worker 数 ≤ GPU 数

> GPU 大模型慎用多 worker——显存翻倍易 OOM，建议 worker 数 = GPU 数。

<!--
CPU 模型 worker=核数；GPU 模型 worker 受显存约束。
-->

---
layout: two-cols
---

# 健康检查

区分 liveness 与 readiness：

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    app.state.ready = True
    yield
    app.state.ready = False

@app.get("/health")
async def health():        # 进程活着就 200
    return {"status": "alive"}

@app.get("/ready")
async def ready_check():   # 模型加载完才 200
    if not app.state.ready:
        raise HTTPException(503, "not loaded")
    return {"status": "ready"}
```

::right::

# 性能调优

**推理侧**

- 半精度 `.half()`（FP16）显存减半
- torch.compile 减 Python 开销
- batch > 1 摊薄固定开销

**服务侧**

- `--loop uvloop`（比默认快 2-4x）
- `--http httptools`
- `ORJSONResponse` 序列化快 2-5x
- 连接池复用 DB/Redis

> K8s：liveness → /health，readiness → /ready。

<!--
readiness gate 让滚动更新时新 pod 加载完才接流量。
-->

---
layout: quote
---

# 模型服务化经验法则

「启动加载一次（lifespan）、CPU 密集用 def（不阻塞事件循环）、流式用 SSE、多 worker 榨干多核——这四条是 FastAPI 模型服务的全部精髓。」

---

# 与其他推理服务方案对比

| 方案 | 定位 | 适合 |
|---|---|---|
| **FastAPI 自写** | 业务层 + 简单推理 | 中小规模、深度业务定制 |
| **vLLM serve** | 高吞吐 LLM 推理 | 纯 LLM，数据中心 |
| **Triton** | 通用 ML serving | 多框架、dynamic batching |
| **BentoML** | Python ML 服务化框架 | ML 原生，自带 batching |
| **Ray Serve** | 分布式 ML serving | 多副本、自动扩缩 |

> 纯 LLM → vLLM；多框架 → Triton；大规模 → Ray Serve/KServe。

<!--
FastAPI 适合中小规模，生产可作业务前置反代 vLLM/Triton。
-->

---
layout: center
class: text-center
---

# 小结

FastAPI 模型服务化 = lifespan + async 守则 + SSE + 批量 + 多 worker

**启动加载 · 不阻塞事件循环 · 流式输出 · 榨干多核**

[FastAPI 文档](https://fastapi.tiangolo.com) · [教程](https://fastapi.tiangolo.com/tutorial) · [GitHub](https://github.com/fastapi/fastapi)

<!--
模型从 notebook 推到生产 API 的关键一公里。
-->
