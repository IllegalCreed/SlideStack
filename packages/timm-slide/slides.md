---
theme: seriph
background: https://cover.sli.dev
title: timm 完全指南
info: |
  timm 完全指南：create_model · 预训练权重 · 特征提取 · 训练栈 · pretrained_cfg

  Learn more at [https://huggingface.co/docs/timm](https://huggingface.co/docs/timm)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## timm

PyTorch Image Models · 700+ 预训练权重 · 特征提取 · 1.0.28

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
timm 是 SOTA 图像模型的一站式集合。
-->

---
transition: fade-out
---

# timm 是什么

Ross Wightman 发起、HuggingFace 托管的 PyTorch 视觉模型库

- **700+ 预训练权重**：覆盖几乎所有主流图像分类架构
- **统一入口**：`timm.create_model(name, pretrained=True)`
- **跟进论文最快**：业界第一时间收录 SOTA 架构
- **特征提取一等公民**：检测/分割社区重度依赖
- **非 PyTorch 官方**：与 torchvision.models 并行存在

> 当前稳定版 **1.0.28**，只专注「分类与特征提取」这一件事

<!--
timm 模型数量比 torchvision 多一个数量级。
-->

---

# 覆盖的模型族

| 架构族 | 代表模型 |
|------|------|
| 卷积经典 | ResNet、ResNeXt、Wide-ResNet |
| 高效卷积 | EfficientNet/V2、MobileNetV3、RegNet |
| Transformer | ViT、DeiT、Swin、XCiT、MaxViT |
| 现代 CNN | ConvNeXt、CSPNet、Inception |

共 **700+ 预训练权重**，几乎覆盖所有公开 SOTA 图像分类架构与变体。

> 命名无强规范，用 `list_models('*pattern*')` 模糊查找

<!--
五大模型族覆盖主流视觉架构。
-->

---

# 核心入口：create_model

```python
import timm
model = timm.create_model(
    'mobilenetv3_large_100', pretrained=True,  # 下载 ImageNet 权重
    num_classes=10).eval()                      # 微调 + 推理前 .eval()

# 列模型
timm.list_models(pretrained=True)   # 仅预训练
timm.list_models('*resne*t*')        # 通配符过滤
```

- `num_classes=N`：自动替换最后线性层
- `num_classes=0`：去掉分类头只留特征
- 推理前必须 `.eval()`（默认是 train 模式）

> 一行加载任意架构与权重，跨架构参数统一

<!--
create_model 是 timm 的万能入口。
-->

---

# 推理最小例子

```python
import timm, torch
from PIL import Image
model = timm.create_model('mobilenetv3_large_100', pretrained=True).eval()
# 从 pretrained_cfg 解析专属 transforms（别套通用归一化）
cfg = timm.data.resolve_data_config(model.pretrained_cfg)
transform = timm.data.create_transform(**cfg)
x = transform(Image.open('cat.jpg')).unsqueeze(0)
probs = torch.softmax(model(x)[0], dim=0)   # 推理
```

> 铁律：每个模型 input_size/mean/std 不同，必须用 resolve_data_config

<!--
pretrained_cfg 自动匹配每个模型的预处理参数。
-->

---

# pretrained_cfg：模型元数据

```python
model = timm.create_model('mobilenetv3_large_100', pretrained=True)
model.pretrained_cfg
# {'input_size': (3,224,224), 'crop_pct': 0.875,
#  'interpolation': 'bicubic',
#  'mean': (0.485,0.456,0.406), 'std': (0.229,0.224,0.225),
#  'num_classes': 1000, 'first_conv': 'conv_stem',
#  'classifier': 'classifier'}
```

- 记录推理所需的全部预处理参数
- 自定义：`pretrained_cfg_overlay=dict(url=..., mean=...)`
- 外部权重：`checkpoint_path='my_weights.pth'`

> 用它生成 transforms 是最稳妥的做法

<!--
pretrained_cfg 避免用错归一化或裁剪比例。
-->

---
layout: two-cols
---

# 特征提取：forward_features

取倒数第二层（未过分类头）

```python
model = timm.create_model(
    'xception41', pretrained=True).eval()
x = torch.randn(2, 3, 299, 299)
features = model.forward_features(x)
# [2, 2048, 10, 10] 跳过分类头与池化
logits = model.forward_head(features)
# 也可再喂回分类头 [2, 1000]
```

- 池化特征：`num_classes=0` 输出 `[N, C]` 向量
- 用于检索 / 度量学习

::right::

# features_only：多尺度金字塔

把分类网络改造成检测/分割主干

```python
model = timm.create_model(
    'resnest26d', pretrained=True,
    features_only=True).eval()
outputs = model(torch.randn(2,3,224,224))   # 5 尺度: stride 2/4/8/16/32
print(model.feature_info.channels())        # [64,256,512,1024,2048]
print(model.feature_info.reduction())       # [2,4,8,16,32]
```

> `out_indices` 选层，`output_stride` 控下采样

<!--
三种特征提取方式覆盖检测/分割/检索需求。
-->

---

# forward_intermediates 与 create_model 全参数

```python
model = timm.create_model(
    'resnet50', pretrained=True,
    num_classes=100,            # 替换分类头（0=去头）
    features_only=False,        # True 返回多尺度特征器
    output_stride=32,           # 控最大下采样（部分支持）
    global_pool='avg',          # avg/max/''（空=不池化）
    checkpoint_path='',         # 加载外部权重
)
```

**ViT 中间层**：`model.forward_intermediates(x)` 取每个 block 输出；配 `prune_intermediate_layers(indices=(-2,))` 裁尾部省显存。

> `features_only=True` 与 `num_classes` 互斥；output_stride 非全模型支持

<!--
forward_intermediates 取任意 block，create_model 参数跨架构统一。
-->

---

# 训练栈：不只是模型库

自带完整图像分类训练栈，复现论文 SOTA 一键起步

```python
from timm.loss import SoftTargetCrossEntropy
from timm.optim import create_optimizer_v2, Lookahead

loss_fn = SoftTargetCrossEntropy()           # 配合 Mixup
optimizer = create_optimizer_v2(             # Lion/Lamb/AdamW
    model, opt='adamw', lr=1e-3, weight_decay=0.05)
optimizer = Lookahead(optimizer)             # 提升泛化
```

- 损失：`LabelSmoothingCrossEntropy` / `JsdCrossEntropy`（蒸馏）
- 数据增强：RandAugment / Mixup / CutMix
- 仓库 `train.py` 是完整训练入口

```bash
python train.py /data --model resnet50 --pretrained \
    -b 256 --amp --aug-rand-m9 --mixup 0.2 --epochs 30
```

> 内置 LabelSmoothing/Mixup/CutMix/SAM/Lamb 训练技巧

<!--
timm 训练栈让复现论文 SOTA 一键起步。
-->

---

# 注册自定义模型

把自研架构注册进 timm，即可被 create_model 发现

```python
from timm.models import register_model
import torch.nn as nn

@register_model
def my_cnn(pretrained=False, **kwargs):
    nc = kwargs.get('num_classes', 1000)
    return nn.Sequential(nn.Conv2d(3,64,3), nn.AdaptiveAvgPool2d(1), nn.Linear(64, nc))
m = timm.create_model('my_cnn')   # 可用
```

> `@register_model` 装饰后即纳入 timm 模型发现机制

<!--
@register_model 让自定义架构融入 timm 生态。
-->

---

# timm vs torchvision.models

| 维度 | timm | torchvision.models |
|------|------|------|
| 模型数量 | 700+ 预训练权重 | 约 50 个 |
| 论文跟进 | 业界最快 | 滞后数月到一年 |
| 特征提取 | features_only 完善 | 需手动改 forward |
| 训练技巧 | LabelSmoothing/Mixup/SAM | 无 |

两者并行存在：简单推理 torchvision 够用，严肃训练或最新架构选 timm。

<!--
timm 模型多、跟进快、训练栈全。
-->

---
layout: center
class: text-center
---

# 小结

timm = create_model + 700+ 权重 + 特征提取 + 训练栈

**一站式模型库 · 特征一等公民 · 自动预处理 · 复现 SOTA**

[timm 文档](https://huggingface.co/docs/timm) · [GitHub](https://github.com/huggingface/pytorch-image-models)

<!--
timm 是图像分类与特征提取的瑞士军刀。
-->
