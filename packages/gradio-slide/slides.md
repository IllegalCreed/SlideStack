---
theme: seriph
background: https://cover.sli.dev
title: Gradio 快速 ML Demo UI
info: |
  Gradio 完全指南：Interface · Blocks 布局 · 事件系统 · 流式输出 · ChatInterface · HF Spaces 部署

  Learn more at [https://www.gradio.app](https://www.gradio.app)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Gradio

ML Demo UI 框架 · Interface · Blocks · ChatInterface · HF Spaces

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Gradio 把 Python 函数秒变 Web UI，ML demo 首选。
-->

---
transition: fade-out
---

# Gradio 是什么

Hugging Face 维护的**快速 ML Demo UI 框架**——几行代码为模型搭可交互 Web 界面

- **三行起界面**：`gr.Interface(fn, inputs, outputs).launch()`，无需前端知识
- **30+ 内置组件**：Textbox / Image / Audio / Video / Chatbot / DataFrame
- **gr.Blocks 灵活布局**：Row / Column / Tab / Accordion 自由组合
- **事件系统 + 流式**：`.click()` / `.then()` 链式联动；generator 逐 yield 推送 LLM token
- **HF Spaces 免费部署**：git push 即上线，全球 ML demo 聚集地

> 核心抽象：「Python 函数 → Web 组件 → 事件绑定」

<!--
ML 工程师最低成本的「让模型被人用上」方式。
-->

---
layout: two-cols
---

# gr.Interface —— 三行起界面

```python
import gradio as gr

def greet(name):
    return "Hello " + name + "!"

demo = gr.Interface(fn=greet, inputs="text", outputs="text")
demo.launch()   # http://localhost:7860
```

**多输入多输出**：inputs/outputs 用 list

```python
gr.Interface(
    fn=process,
    inputs=[gr.Textbox(label="姓名"), gr.Slider(0, 120, label="年龄")],
    outputs=[gr.Textbox(label="简介"), gr.Number(label="出生天数")],
)
```

::right::

# 与同类对比

| 维度 | Gradio | Streamlit | Dash |
|---|---|---|---|
| **目标** | ML demo | 数据应用 | 仪表板 |
| **起界面** | **三行** | 十几行 | 几十行 |
| **ML 组件 / 流式** | **内置 / 原生** | 弱 / 较弱 | 需自写 |
| **部署** | **HF Spaces** | Cloud | Enterprise |
| **对话 UI** | **ChatInterface** | 手写 | 手写 |

> 数据仪表板用 Streamlit；ML demo 用 Gradio。

<!--
Interface 最快；Blocks 最灵活；ChatInterface 对话专用。
-->

---

# gr.Blocks —— 灵活布局

上下文管理器组合组件与事件，比 Interface 灵活十倍

```python
import gradio as gr

with gr.Blocks() as demo:
    gr.Markdown("# 图像分类器")
    with gr.Row():                       # 横排
        with gr.Column():                # 竖排
            inp = gr.Image(label="图片")
            btn = gr.Button("预测")
        with gr.Column():
            out = gr.Label(label="结果")
    btn.click(fn=predict, inputs=inp, outputs=out)
demo.launch()
```

| 组件 | 用途 | 组件 | 用途 |
|---|---|---|---|
| `gr.Row` | 横排 | `gr.Tab` | 标签页 |
| `gr.Column` | 竖排（scale）| `gr.Accordion` | 折叠面板 |
| `gr.Group` / `gr.Box` | 紧凑 / 带边框分组 | — | — |

> `scale` 类似 flex-grow，控制同行/同列占比。

<!--
Blocks 是复杂界面的基础，配合 Row/Column/Tabs 排版。
-->

---

# 事件系统

事件监听器把组件变化绑定到函数

```python
with gr.Blocks() as demo:
    name = gr.Textbox(label="名字")
    out = gr.Textbox(label="输出")
    btn = gr.Button("打招呼")

    # 装饰器写法：自动绑定
    @btn.click(inputs=name, outputs=out)
    def greet(name):
        return "Hi " + name
```

**主要事件**：`.click()` / `.submit()` / `.change()` / `.input()` / `.select()` / `.upload()` / `.then()`

**关键模式**

- **dict 输出**：`return {food: v-1, status: "饱"}` 只更新列出的组件
- **`.then()` 链式**：前者完成自动触发后者，如 `submit(fn1).then(fn2)`
- **`gr.on` 多触发器**：`@gr.on(triggers=[name.submit, btn.click])` 一函数绑多事件

> trigger_mode：once（默认）/ multiple / always_last（对话常用）。

<!--
事件系统是 Blocks 联动的核心。
-->

---

# 流式输出（generator）

函数写成 generator，逐 `yield` 推送增量到前端

```python
import gradio as gr
import time

def stream_greet(name):
    full = f"你好，{name}！欢迎来到 Gradio。"
    result = ""
    for char in full:
        result += char
        time.sleep(0.05)
        yield result          # 累积式：每次返回完整结果

gr.Interface(fn=stream_greet, inputs="text", outputs="text").launch()
```

**两种模式**

- **累积式**（LLM token 流）：每次 yield 完整累积结果，前端自动 diff
- **增量式**（图像逐帧）：每次 yield 下一帧

**流式 + 取消**：`event = submit.click(...)` 后 `stop.click(cancels=[event])` 中止生成

> Chatbot 流式每次 yield 整个更新后的 history，Gradio 自动 diff 推送。

<!--
generator 是 Gradio 流式的全部秘密。
-->

---

# gr.ChatInterface —— 对话专用

一键生成 ChatGPT 式 UI（消息历史、流式、重试、清空）

```python
import gradio as gr

def chat(message, history):
    # message 当前输入，history 对话历史
    return my_model.generate(message, history)

gr.ChatInterface(fn=chat).launch()
```

**进阶**：支持流式（fn 写 generator）、system message、多模态上传

```python
gr.ChatInterface(
    fn=vision_chat, multimodal=True,    # 允许上传图片
    additional_inputs=[gr.Textbox("你是助手", label="system")],
)
```

> 对话型应用首选——几行实现完整对话 UI。

<!--
ChatInterface 把对话 UI 的样板代码全藏起来了。
-->

---
layout: two-cols
---

# 启动与分享

```python
demo.launch()                          # 本地 127.0.0.1:7860
demo.launch(server_name="0.0.0.0")     # 监听所有网卡
demo.launch(server_port=8080)          # 改端口
demo.launch(share=True)                # *.gradio.live 临时公网
demo.launch(auth=("user","pass"))      # 加登录
demo.queue().launch()                  # 启用队列（长耗时必加）
```

::right::

# 性能与队列

长耗时推理必须启用队列，否则超时/堆积：

```python
demo.queue(
    max_size=100,             # 队列最大长度
    default_concurrency_limit=4,
).launch()

# 事件级并发控制
btn.click(fn=gpu_infer,
          concurrency_limit=1,
          concurrency_id="gpu")
```

`concurrency_id` 让多事件共享并发池（如都受 GPU 约束）

> queue 模式下流式输出能在队列中实时推送。

<!--
长耗时推理必加 queue，concurrency_limit 做限流。
-->

---

# 部署到 Hugging Face Spaces

Gradio 的天然归宿——git push 即上线

```bash
# 1. huggingface.co/new-space 创建 Space，选 Gradio SDK
# 2. 仓库结构：
#    app.py            ← Gradio 代码
#    requirements.txt  ← 依赖
#    README.md         ← 含 YAML front matter
# 3. git push 即上线
```

**README.md front matter**（用 `---` 包裹的 YAML）

```yaml
title: My Image Classifier
emoji: 🖼️
sdk: gradio
sdk_version: "5.0"
app_file: app.py
pinned: false
```

> YAML 头用三个连字符 `---` 开头与结尾，标识 Space 元信息。

> HF Spaces 自带社区与分享生态，全球 ML demo 聚集地。

<!--
HF Spaces 是 Gradio demo 的最佳归宿，零成本上线。
-->

---
layout: quote
---

# Gradio 适用边界

「Gradio 适合内部 demo、黑客松、教学、模型验收、HF Spaces 分享——面向公众、高并发、需前后端分离时，迁 Streamlit 或 Next.js + FastAPI。」

---

# Gradio vs Streamlit vs Dash

| 维度 | Gradio | Streamlit | Dash |
|---|---|---|---|
| **目标** | ML demo（最快）| 数据应用 | 仪表板 |
| **起界面** | **三行** | 十几行 | 几十行 |
| **ML 组件 / 流式** | **内置 / 原生** | 弱 / 较弱 | 需自写 / 一般 |
| **部署生态** | **HF Spaces** | Streamlit Cloud | Enterprise |
| **灵活布局** | gr.Blocks | 中 | 强（React）|

> ML demo 选 Gradio；数据仪表板选 Streamlit；深度定制选 Dash。

<!--
定位互补，按场景选工具。
-->

---
layout: center
class: text-center
---

# 小结

Gradio = Interface + Blocks + 事件系统 + 流式 + HF Spaces

**三行起界面 · 组件全 · 流式原生 · 一键分享**

[Gradio 文档](https://www.gradio.app) · [教程](https://www.gradio.app/guides) · [GitHub](https://github.com/gradio-app/gradio)

<!--
ML demo 的首选工具，让模型快速被人用上。
-->
