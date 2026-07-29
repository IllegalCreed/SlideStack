---
theme: seriph
background: https://cover.sli.dev
title: ComfyUI 完全指南
info: |
  ComfyUI 完全指南：节点式 AI 生成工作流 · KSampler · API 集成 · Manager / Registry

  Learn more at [https://docs.comfy.org](https://docs.comfy.org)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## ComfyUI 完全指南

节点式 AI 生成工作流 · KSampler · API 集成 · Manager / Registry

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/comfyanonymous/ComfyUI" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
ComfyUI 是 comfyanonymous 维护的节点式 AI 生成工作流编排工具，GPL-3.0 开源，122k+ stars。
-->

---
transition: fade-out
---

# 什么是 ComfyUI

开源（GPL-3.0）的**节点式 AI 生成工作流编排工具**

- **可视化节点图**：用节点 + 连线拼 DAG，连线类型强约束
- **异步队列**：只重算变化节点上游的子图，缓存复用
- **智能显存管理**：最低 **1GB VRAM** 也能跑 SDXL / Flux
- **多模态**：图像 / 视频 / 音频 / 3D 全覆盖
- **可复现**：JSON 存档 + PNG/WebP/FLAC 元数据嵌入
- **生态完善**：Manager + Registry 提供版本治理

> ComfyUI ≠ AUTOMATIC1111 表单 UI，也 ≠ Diffusers Python 库。

<!--
核心三件：节点图 + 异步队列 + 智能内存。
-->

---

# 核心张量类型

ComfyUI 用**强类型连线**约束节点数据流

| 类型 | 来源节点 | 含义 |
|------|------|------|
| **MODEL** | CheckpointLoader | 扩散模型本体（UNet / DiT） |
| **CLIP** | CheckpointLoader | 文本编码器权重 |
| **VAE** | CheckpointLoader | 潜变量 ↔ 像素解码器 |
| **CONDITIONING** | CLIPTextEncode | 正/负条件向量 |
| **LATENT** | EmptyLatent / KSampler | 潜变量张量 |
| **IMAGE** | VAEDecode / LoadImage | 像素图像 |

> 类型不匹配会被画布拒绝——这是 ComfyUI 防错的核心机制。

<!--
连线类型不可错接，是节点图的本质约束。
-->

---

# 最小 txt2img 工作流

入门第一步，6 个节点连起来即可出图

```text
CheckpointLoaderSimple
   ├─ MODEL  ───────────┐
   ├─ CLIP ─┬─ CLIPTextEncode (+) ──┐
   │        └─ CLIPTextEncode (-) ──┤
   └─ VAE ──────────────────────────┤
                                    ↓
EmptyLatentImage ─────────→ KSampler → VAEDecode → SaveImage
```

- **正/负 prompt 各一个 CLIPTextEncode**
- EmptyLatentImage 是 txt2img 起点
- KSampler 的 denoise **必须为 1.0**

> img2img 把 EmptyLatentImage 换成 LoadImage → VAEEncode，denoise 降到 0.3-0.7。

<!--
这个最小工作流是所有 ComfyUI 入门的 ABC。
-->

---

# 内置节点全图鉴

| 节点 | 作用 |
|------|------|
| **CheckpointLoaderSimple** | 加载权重，输出 MODEL / CLIP / VAE |
| **CLIPTextEncode** | 文本 → CONDITIONING（正/负各一） |
| **EmptyLatentImage** | 空白潜变量（txt2img 起点） |
| **KSampler** | 核心去噪采样 |
| **VAEDecode** | LATENT → IMAGE |
| **VAEEncode** | IMAGE → LATENT（img2img 起点） |
| **SaveImage** | 落盘 + PNG 元数据嵌入 |
| **PreviewImage** | 临时预览不落盘 |

> 高级用法可拆成 UNETLoader + CLIPLoader + VAELoader 三件套。

<!--
8 个核心节点覆盖了 80% 的入门场景。
-->

---

# KSampler 关键参数

| 参数 | 典型值 | 说明 |
|------|------|------|
| `seed` | 0–2^64-1 | 噪声起点 |
| `control_after_generate` | fixed / random | 跑完怎么改 seed |
| `steps` | 15-30 | 去噪步数 |
| `cfg` | **6-8** | Classifier-Free Guidance |
| `sampler_name` | dpmpp_2m | 采样器 |
| `scheduler` | karras | 步长调度 |
| `denoise` | 1.0 / 0.X | txt2img / img2img |

> cfg > 15 是反模式（色彩失真、伪影、过饱和）。

<!--
社区默认组合：dpmpp_2m + karras + steps=20-30 + cfg=6-8。
-->

---
layout: two-cols
---

# 采样器选型

- **euler**：快、稳、收敛
- **euler_ancestral**：富变化、艺术性
- **dpmpp_2m**：**社区默认**
  - 高质量、高效率
- **dpmpp_sde**：细节丰富但慢
- **ddim**：老牌稳定、可复现

> 生产首选 dpmpp_2m，最终出图可用 dpmpp_sde。

::right::

# 调度器选型

- **normal**：默认线性
- **karras**：**社区推荐**
  - 普遍更锐利
- **exponential**：少步数友好
- **simple**：极简稳定
- **sgm_uniform**：SD3 / Flux 等
  - SGM 模型专用

> 经典组合：`dpmpp_2m` + `karras` 是 SDXL 时代默认。

<!--
采样器和调度器是 ComfyUI 控图的核心旋钮。
-->

---

# denoise：txt2img vs img2img

`denoise` 决定保留多少原图信息

| 取值 | 用途 |
|------|------|
| **1.0** | txt2img，完全重画 |
| 0.5-0.7 | 经典 img2img，保留结构改风格 |
| 0.3-0.5 | 轻修图、refine |
| < 0.3 | 极轻微调整 |

> img2img 用 denoise=1.0 = 完全抛弃原图重画，**反模式**。

<!--
denoise 是 txt2img / img2img 的本质分水岭。
-->

---

# img2img 工作流

输入图像编码进潜空间，降低 denoise

```text
LoadImage → VAEEncode → LATENT
                              ↓
            KSampler (denoise=0.5)
                              ↓
                       VAEDecode → SaveImage
```

**典型 denoise 区间**：

- 0.7-0.9：风格强烈转换（保留构图，换画法）
- 0.4-0.7：经典 img2img（保留结构 + 改细节）
- 0.1-0.4：细节修复 / refine

> img2img 也要写好正/负 prompt，否则 KSampler 不知道往哪个方向改。

<!--
img2img 是 ComfyUI 的另一大入门场景。
-->

---
layout: two-cols
---

# API 三件套

程序化集成 ComfyUI 的核心模式

- **POST /prompt** — 提交工作流入队
- **GET /ws** — WebSocket 实时进度
  - 必须绑 `client_id`
- **GET /history/{prompt_id}** — 取最终产物

辅助端点：

- `/object_info` — 节点定义
- `/queue` / `/interrupt` — 队列管理
- `/free` — 释放显存

::right::

# /prompt 示例

```bash
curl -X POST http://localhost:8188/prompt \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "abc-123",
    "prompt": { "节点图 JSON" }
  }'
```

成功响应：

```json
{
  "prompt_id": "xxx",
  "number": 1
}
```

> client_id 必须与 /ws 一致，否则收不到进度。

<!--
client_id 是 /prompt 与 /ws 之间的会话绑定键。
-->

---

# WebSocket 事件

绑定 `client_id` 实时收事件

| 事件 | 含义 |
|------|------|
| `status` | 队列状态变化 |
| `execution_start` | 整个 prompt 开始 |
| `execution_cached` | 节点命中缓存跳过 |
| `executing` | 节点执行中 |
| `progress` | 单节点内进度（value / max） |
| `executed` | 节点完成 + 输出 |
| `execution_error` | 执行异常 |

> 不传 / 乱传 client_id → 收不到本客户端进度，甚至收到别人事件。

<!--
WebSocket 是 ComfyUI 实时集成的唯一通道，REST 不能拉进度。
-->

---
layout: two-cols
---

# ComfyUI-Manager

custom_nodes 全生命周期治理

- **节点**：装 / 更新 / 禁用 / 删
- **模型下载**：直连 HF / Civitai
- **Snapshot**：版本组合整体回滚
- **缺失节点自动检测安装**

CLI 标志：

- `--enable-manager`（默认开）
- `--disable-manager-ui`
- `--enable-counselor-ui`

::right::

# ComfyUI Registry

[registry.comfy.org](https://registry.comfy.org/) 是 Manager 的数据源

- **publisher**：开发者身份（必填）
- **pyproject.toml**：写 publisher 标识
- **SemVer**：语义化版本
- **版本不可变**：必须发新版才能改
- **可 deprecate**
- **自动安全扫描**：检测恶意调用

> 发布节点走 Registry = 全局唯一名 + 版本治理 + 安全扫描。

<!--
Manager 是消费端 UI，Registry 是后端基础设施。
-->

---
layout: quote
---

# 改上游参数 = 全图重算

「把要扫的参数放最末端（如 KSampler 之后再分叉），才能复用前面的缓存。」

<!--
异步队列只重算变化节点上游的子图，这是缓存复用的核心。
-->

---
layout: center
class: text-center
---

# 反模式与陷阱

**最易踩的坑**

- 改上游参数让全图重算（应放最末端分叉）
- API 不传 client_id（/ws 收不到进度）
- 直接 git clone 节点不走 Manager（缺版本治理）
- cfg > 15 想「更贴 prompt」（应改写 prompt 或加 LoRA）
- img2img 用 denoise=1.0（等于抛弃原图重画）
- 发布节点不写 publisher（冲突 + 无版本锁）
- `--disable-api-nodes` 后又抱怨没外部模型
- 工作流只存 PNG 不存 JSON（元数据易丢）

<!--
8 条反模式覆盖了 ComfyUI 生产集成的主要陷阱。
-->

---
layout: center
class: text-center
---

# 小结

ComfyUI = 节点式 AI 生成工作流编排

可视化节点图 · 异步队列 · 智能显存 · API 集成 · Manager / Registry

**KSampler 甜点：dpmpp_2m + karras + cfg=6-8 + denoise 看场景**

[文档](https://docs.comfy.org) · [GitHub](https://github.com/comfyanonymous/ComfyUI) · [Registry](https://registry.comfy.org)

<!--
掌握节点图思维 + API 集成三件套 + Manager/Registry 治理，就能把 ComfyUI 用到生产水准。
-->
