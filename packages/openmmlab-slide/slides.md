---
theme: seriph
background: https://cover.sli.dev
title: OpenMMLab 完全指南
info: |
  OpenMMLab 完全指南：MMEngine · Registry · Config · Runner · 算法库 · 训练流程

  Learn more at [https://openmmlab.com](https://openmmlab.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## OpenMMLab

计算机视觉算法体系 · MMEngine · Registry · 30+ 算法库

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
OpenMMLab 2.0 以 MMEngine 为底座，构建 30+ 任务算法库。
-->

---
transition: fade-out
---

# OpenMMLab 是什么

商汤发起、社区维护的**计算机视觉算法体系**

- **OpenMMLab 2.0**（2022）：MMEngine 底座 + 30+ 任务算法库
- **任务全覆盖**：检测 / 分割 / 姿态 / 分类 / OCR / 3D / 跟踪
- **三大核心机制**：Registry（注册器）、Config（配置）、Runner（编排）
- **配置即架构**：纯 Python config，`type='XXX'` 驱动实例化
- **跨库复用**：backbone / dataset 在算法库间无缝组合

> 强在多任务广度与可组合性，与 Ultralytics「单库聚焦」互补

<!--
OpenMMLab 2.0 = MMEngine + MMCV + 30+ 算法库。
-->

---

# 三层架构与算法库

| 层级 | 代表 | 职责 |
|------|------|------|
| 训练引擎底座 | **MMEngine** | Runner / Registry / Config / Hook |
| CV 基础算子 | **MMCV** | 图像 IO / transforms / CUDA 算子 |
| 任务算法库 | MMDetection 等 | model / dataset / metric / loss |

**主力算法库**：MMDetection（检测/RTMDet）、MMPose（姿态）、MMSegmentation（分割）、MMPreTrain（分类/MAE/LLaVA）、MMOCR、MMRotate、MMDetection3D。

**关键设计**：算法库只写任务逻辑，训练流程由 Runner 统一编排——`tools/train.py config.py` 跨库通用。

> **MMPreTrain** = 旧 MMClassification + MMSelfSup 合并产物

<!--
三层架构：MMEngine 底座 + MMCV 算子 + 9 个主力算法库。
-->

---

# Registry：OpenMMLab 的灵魂

用字符串名字驱动类的实例化——配置即架构

```python
from mmengine import Registry
MODELS = Registry('model', scope='myproj')
@MODELS.register_module()            # 注册类
class ResNet: ...
@MODELS.register_module(force=True)  # 覆盖同名
class ResNet: ...
model = MODELS.build(dict(type='ResNet', depth=101))  # 实例化
```

**scope 层级跨库查找**：`type='mmengine.ResNet'` 显式从父库查；`type='mmpretrain.ViT'` 从兄弟库查；本节点找不到自动上溯父节点。

> Registry 按需加载——推理/训练第一步 `register_all_modules()`

<!--
Registry 用 type 字符串驱动实例化，scope 实现跨库复用。
-->

---

# Config：纯 Python 配置系统

config 是 `.py` 文件，顶层是变量赋值（非 YAML）

```python
model = dict(
    type='FasterRCNN',
    backbone=dict(type='ResNet', depth=50),
    neck=dict(type='FPN', out_channels=256),
)
optim_wrapper = dict(type='OptimWrapper',
    optimizer=dict(type='SGD', lr=0.02))
train_cfg = dict(type='EpochBasedTrainLoop', max_epochs=12)
```

- 表达力强：能用 Python 条件/循环/嵌套 dict
- lazy import：只 import config 引用的库

> 比 YAML 更适合复杂模型组装

<!--
Config 纯 Python 语法，type 驱动 Registry 实例化。
-->

---

# Config 继承与覆盖

复杂模型不重复写，靠 `_base_` 继承

```python
# 子 config 覆盖父字段（dict 递归合并）
_base_ = './faster-rcnn_r50_fpn_1x_coco.py'
model = dict(backbone=dict(depth=101))   # 只改 depth

# 整体替换而非合并：加 _delete_=True
model = dict(backbone=dict(
    _delete_=True, type='MobileNetV3'))
```

**运行时修改**（命令行走同一套机制）：

```python
from mmengine.config import Config
cfg = Config.fromfile('config.py')
cfg.model.backbone.depth = 101          # 点号取值
```

`python tools/train.py config.py --cfg-options model.backbone.depth=101`

> 列表字段（如 param_scheduler）是整体替换不是合并

<!--
_base_ 继承 + _delete_ 替换 + --cfg-options 运行时改。
-->

---

# Runner：训练生命周期编排

把模型/数据/优化器/Hook/可视化/分布式全部编排

```
Runner.train()
└── for epoch in range(max_epochs):
      ├── hook.before_train_epoch()
      └── for data_batch in dataloader:
            ├── hook.before_train_iter()
            ├── model.train_step() → optim_wrapper.update_params()
            └── hook.after_train_iter()   # 记录/调参/存 ckpt
```

- 两种循环：`EpochBasedTrainLoop`（默认）/ `IterBasedTrainLoop`
- Hook 体系覆盖训练全生命周期，可插入自定义逻辑
- 分布式开箱即用：内部封装 DDP

> 学会一个库的训练，迁移到其他库命令几乎一致

<!--
Runner 是训练流程中枢，Hook 覆盖全生命周期。
-->

---

# OptimWrapper 与 ParamScheduler

```python
optim_wrapper = dict(
    type='OptimWrapper',
    optimizer=dict(type='SGD', lr=0.02, momentum=0.9),
    accumulative_counts=2,   # 梯度累积，原生支持 AMP
)
param_scheduler = [
    dict(type='LinearLR', start_factor=0.001, end=500),   # warmup
    dict(type='MultiStepLR', milestones=[8, 11], gamma=0.1)]
```

- `accumulative_counts`：小显存跑大 batch
- ParamScheduler 替代旧 step LR，可多段组合
- 支持 CosineAnnealing / Linear / Step / CosineRestarts

> 训练 loss 不降先查 LR：by_epoch 与 by_iter 别混用

<!--
OptimWrapper 封装优化器，原生支持 AMP 与梯度累积。
-->

---

# Visualizer：多后端可视化

画图与落盘解耦，一条命令同时写本地/TB/WandB

```python
from mmengine.visualization import Visualizer
visualizer = Visualizer(
    vis_backends=[dict(type='LocalVisBackend'),
                  dict(type='TensorboardVisBackend'),
                  dict(type='WandbVisBackend')],
    save_dir='vis_results',
)
visualizer.add_scalar('loss', loss_value, step=iter)
```

- 画图 API：`draw_bboxes` / `draw_masks` / `draw_keypoints`
- 各任务库继承实现专用绘图（如 `DetLocalVisualizer`）
- 检测框/分割掩码/关键点都有现成绘图 API

<!--
Visualizer 画图与落盘解耦，多后端同时上报。
-->

---

# 推理最小例子

加载 config + checkpoint → 推理单张图

```python
from mmdet.apis import init_detector, inference_detector
from mmdet.utils import register_all_modules
register_all_modules()           # ① 注册全部模块（不可省）
model = init_detector(
    'configs/faster-rcnn_r50_fpn_1x_coco.py',
    'checkpoints/faster_rcnn_r50_fpn_1x_coco.pth', device='cuda:0')
result = inference_detector(model, 'demo.jpg')   # ② 推理
```

> 不调 `register_all_modules()`，config 里的 type 找不到类

<!--
register_all_modules 是按需加载的补偿步骤。
-->

---

# 安装与训练启动

**版本对齐是第一要务**：CUDA/Torch/MMCV/MMEngine/算法库须一致

```bash
pip install -U openmim          # mim 自动选对 MMCV 预编译 wheel
mim install mmengine
mim install "mmcv>=2.0.0"
mim install "mmdet>=3.0.0"      # 按需装任务算法库

python tools/train.py configs/xxx.py                      # 单卡
./tools/dist_train.sh configs/xxx.py 8                    # 多卡 DDP
python tools/train.py config.py --cfg-options optimizer.lr=0.01
```

- 输出落在 `work_dirs/{config_name}/`
- 装错 MMCV 版本是新手第一坑——查兼容矩阵

> 铁律：先确认 torch+cuda，再 mim install

<!--
mim 自动解析版本矩阵，避免手动拼 -f URL。
-->

---

# OpenMMLab vs Ultralytics

| 维度 | OpenMMLab | Ultralytics |
|------|------|------|
| 任务广度 | 检测/分割/姿态/OCR 全覆盖 | 聚焦 YOLO |
| 上手曲线 | 陡（懂 Registry/Config） | 平（一行 train） |
| 可组合性 | 强（跨库复用） | 弱（单库封闭） |
| 适用场景 | 研究/复现/多任务 | 工程/快速 PoC |

两者并非二选一：研究用 OpenMMLab 复现对比，工程落地 YOLO 够用则 Ultralytics 更省事。

<!--
研究选 OpenMMLab，工程选 Ultralytics，定位互补。
-->

---
layout: center
class: text-center
---

# 小结

OpenMMLab 2.0 = MMEngine + Registry + Config + Runner

**多任务广度 · 配置即架构 · 跨库复用 · 工业级训练**

[OpenMMLab 官网](https://openmmlab.com) · [MMEngine 文档](https://mmengine.readthedocs.io)

<!--
Registry + Config + Runner 是 OpenMMLab 三大核心机制。
-->
