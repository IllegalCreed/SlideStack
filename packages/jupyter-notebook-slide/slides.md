---
theme: seriph
background: https://cover.sli.dev
title: Jupyter Notebook 完全指南
info: |
  Jupyter Notebook 完全指南：Cell · Kernel · Magics · JupyterLab · nbconvert · 生态

  Learn more at [https://jupyter.org](https://jupyter.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Jupyter Notebook

计算型笔记本 · Cell 执行 · Kernel · 7.x / JupyterLab 4

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Jupyter 把代码 / 输出 / 文档压进 .ipynb，是数据科学事实标准。
-->

---
transition: fade-out
---

# Jupyter 是什么

Project Jupyter 出品的「计算型笔记本」Web 应用

- **代码 + 输出 + 文档三位一体**：`.ipynb`（JSON）按 cell 顺序执行
- **名字 = Julia + Python + R**：现支持 40+ 内核语言
- **Cell 单元格**：Code / Markdown / Raw 三种类型
- **Kernel 内核**：独立进程跑代码，前端通过 WebSocket 通信
- **生态三件套**：JupyterLab（IDE）/ JupyterHub（多用户）/ Voilà（web 应用）

> Notebook 7 已重写为 JupyterLab 组件前端，Classic Notebook（6.x）已 EOL

<!--
Notebook 7 + JupyterLab 4 共用前端组件，后端都是 jupyter_server。
-->

---
layout: two-cols
---

# 安装与启动

```bash
# A：Jupyter Notebook 7（极简）
pip install notebook && jupyter notebook
# B：JupyterLab（推荐，含 IDE 体验）
pip install jupyterlab && jupyter lab
```

默认开 `http://localhost:8888`；**Docker 隔离环境最稳**：`docker run -p 8888:8888 -v "$PWD":/home/jovyan/work jupyter/scipy-notebook:latest`

::right::

# Cell 类型与执行

| cell_type | 用途 |
|---|---|
| `code` | 跑代码，多 MIME 输出 |
| `markdown` | 富文本 + KaTeX 公式 |
| `raw` | nbconvert 模板原文 |

**执行快捷键**

- `Shift+Enter` 运行并跳下一个
- `Ctrl+Enter` 运行停原位
- `Alt+Enter` 运行并插新 cell
- `Esc`+`A`/`B` 上/下插 cell
- `Esc`+`M`/`Y` 切 Markdown/Code

> 两种模式：编辑（绿框）/ 命令（蓝框）

<!--
新项目优先 JupyterLab，多标签 / 终端 / 调试器开箱即用。
-->

---

# 内核（Kernel）深入

独立进程接收代码字符串、执行、回传输出

```
浏览器 ⇄ jupyter_server(HTTP/WS) ⇄ Kernel(IPykernel) → Python 进程
```

**关键认知**

- **内核 ≠ 文件**：关浏览器内核仍在后台运行
- **Restart 清空变量**：所有 import / 变量丢失
- **`In [n]` 是执行序**：跳着跑会状态混乱

> 复现测试用「Restart & Run All」——线性执行才可信

<!--
状态混乱是 notebook 经典坑，Restart & Run All 鼓励线性执行。
-->

---
layout: two-cols
---

# 多语言内核

| 语言 | 内核 |
|---|---|
| Python（默认） | `ipykernel` |
| R / Julia | `IRkernel` / `IJulia` |
| C++ / Rust | `xeus-cling` / `evcxr_jupyter` |

**注册虚拟环境为内核**

```bash
pip install ipykernel
python -m ipykernel install --user --name=myenv --display-name="Python (myenv)"
```

::right::

# 魔法命令（Magics）

IPython 内核独有扩展，三类前缀：

| 前缀 | 名称 | 作用域 |
|---|---|---|
| `%x` | line magic | 单行 |
| `%%x` | cell magic | 整个 cell |
| `!x` | shell escape | 调系统 shell |

```python
%matplotlib inline        # 内嵌图
%timeit sum(range(1000))  # 计时
%%time                    # 计时整个 cell
%%writefile utils.py      # 写文件
```

> **`%pip` 优于 `!pip`**：保证装到当前内核

<!--
magics 大幅提效，%pip 保证装到当前内核 Python。
-->

---

# 富显示与 nbconvert

最后一个表达式的输出由 IPython display 机制渲染

```python
import pandas as pd
pd.DataFrame({'a':[1,2]})        # 自动渲染 HTML 表

from IPython.display import display, HTML, Image, Markdown
display(HTML('<b style="color:blue">富文本</b>'))
display(Markdown('# 内嵌标题'))

import ipywidgets as widgets     # 交互式 widget
widgets.IntSlider(description='x:')
```

**nbconvert 导出多种格式**

```bash
jupyter nbconvert --to=html my.ipynb       # HTML
jupyter nbconvert --to=pdf my.ipynb        # PDF（需 LaTeX）
jupyter nbconvert --to=script my.ipynb     # 纯 .py
jupyter nbconvert --to=html --execute my.ipynb  # 执行后导出
```

<!--
对象通过 _repr_html_ 等魔术方法声明渲染方式。
-->

---
layout: two-cols
---

# JupyterLab 完整 IDE

下一代 Web IDE：notebook + 文件 + 终端 + 调试 + Git

- **命令面板** `Ctrl+Shift+C` 搜一切操作
- **多 Tab 拖放**：notebook / 文件 / 终端 并排
- **Web 终端**：File → New → Terminal（WebSocket）
- **目录自动生成**：左侧 TOC 按 Markdown 标题
- **调试器**：需 `xeus-python` 内核（ipykernel 不支持断点）

**扩展系统（federated）**

```bash
pip install jupyterlab-git    # Git 集成
pip install jupyterlab-lsp    # LSP 补全/跳转
```

::right::

# 实时协作与生态

**RTC 多人同改一个 notebook**

```bash
pip install jupyter-collaboration
jupyter lab --collaborative
```

基于 Yjs CRDT，光标实时同步。

**核心工具链**

- **Voilà** · notebook 转 web 应用
- **papermill** · 参数化批量执行
- **jupytext** · `.ipynb` ⇄ `.py:percent` 同步
- **nbstripout** · git commit 前清输出
- **nbdev** · notebook 出包+文档
- **ipywidgets** · 交互式 UI

> RTC 内核只有一个——多人共享同一份运行时状态

<!--
Voilà / papermill / jupytext / nbstripout / nbdev 形成完整工具链。
-->

---

# 与 Git 配合：nbstripout

`.ipynb` 含输出 + metadata 会污染 git 历史

```bash
pip install nbstripout

# 全局装 git filter（commit 前自动清输出）
nbstripout --install
nbstripout --install --attributes .gitattributes

# 保留某文件输出
nbstripout --install --keep-output 'reports/*.ipynb'
```

之后 `git diff` / `git commit` 自动剥离输出，merge 冲突大幅减少。

**jupytext 双向同步**（解决 diff 难）

```bash
jupytext --set-formats ipynb,py:percent my.ipynb
jupytext --sync my.ipynb
```

`.py:percent` 被 VS Code / PyCharm 当 notebook 直接打开。

<!--
nbstripout + jupytext 是 notebook 与 git 协作的标准组合。
-->

---

# Notebook 7 vs JupyterLab 4 vs Classic

| 维度 | Notebook 7 | JupyterLab 4 | Classic（6.x EOL） |
|------|------|------|------|
| **定位** | 经典 UI 现代化 | 完整 IDE | 老版单文档 |
| **前端栈** | JupyterLab 组件子集 | 完整 JupyterLab | Backbone + jQuery |
| **终端** | ✗（需 JupyterLab） | ✅ 内置 | ✗ |
| **实时协作** | ✅（扩展） | ✅（扩展） | ✗ |
| **后端** | `jupyter_server` | `jupyter_server` | 老 `notebook` 服务器 |

> Notebook 7 = 自动享受 JupyterLab 4 渲染，新项目优先 JupyterLab

<!--
两者共用前端组件，差别只在 UI 摆放；Classic 已停止维护。
-->

---
layout: quote
---

# Jupyter 核心理念

「Cell 是执行单元 · Kernel 是独立进程 · Magics 是提效利器——三位一体把代码、输出、文档压进一个可复现的 `.ipynb` 文件。」

---
layout: center
class: text-center
---

# 小结

Jupyter = Cell + Kernel + Magics

**Notebook 7 · JupyterLab · 多语言内核 · 完整生态工具链**

[Jupyter 文档](https://jupyter-notebook.readthedocs.io/) · [JupyterLab](https://jupyterlab.readthedocs.io/) · [GitHub](https://github.com/jupyter/notebook)

<!--
Cell + Kernel + Magics 是 Jupyter 三件套，生态工具链让它工程化。
-->
