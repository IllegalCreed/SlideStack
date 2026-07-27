---
theme: seriph
background: https://cover.sli.dev
title: 卷积神经网络（CNN）完全指南
info: |
  卷积神经网络（CNN）完全指南：卷积与池化 · 感受野 · 经典架构演化 · ResNet 残差 · 迁移学习

  Learn more at https://cs231n.github.io/convolutional-networks/
drawings:
  persist: false
transition: slide-left
mdc: true
---

## 卷积神经网络（CNN）

专为空间网格数据设计的神经网络 · 局部连接 + 参数共享

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
CNN 用卷积层替代全连接，靠局部连接、参数共享、平移不变性三大设计，在图像等空间网格数据上成为事实标准。即便 Vision Transformer 兴起，CNN 的归纳偏置在小样本和移动端仍不可替代。
-->

---
transition: fade-out
---

# CNN 是什么

用**卷积运算**替代全连接的神经网络，专为图像等空间网格数据设计。

```text
输入图 [H, W, C_in]
   ↓ 卷积核 [F, F, C_in, C_out] 滑动
特征图 [H', W', C_out]      ← 学到边缘/纹理等局部特征
   ↓ 池化（2×2 stride 2）
特征图 [H'/2, W'/2, C_out]  ← 降分辨率，扩感受野
   ↓ 重复若干 Conv+Pool → 全局平均池化 + 全连接 → logits
```

> 224×224 RGB 图用 MLP 第一层需 1.5 亿参数，卷积同样 1000 个 3×3 核只要 2.7 万——少 5000 倍。

<!--
一张 224 乘 224 RGB 图有 15 万个输入，若第一层 MLP 有 1000 个神经元仅这一层就要 1.5 亿参数，既过拟合又算不动。卷积用局部连接加参数共享，同样 1000 个 3 乘 3 核只要 2 万 7 千参数，少了 5000 倍，这就是 CNN 能在 ImageNet 上跑通的工程根基。
-->

---
transition: fade-out
---

# 三大设计支柱

| 设计 | 含义 | 作用 |
| --- | --- | --- |
| **局部连接** | 神经元只看感受野内一块，非全部像素 | 参数随核大小而非输入大小增长 |
| **参数共享** | 同一核在整张图滑动复用同一组权重 | 假设特征平移不变，大幅减参 |
| **多通道堆叠** | 一层用多个核学不同特征，深度方向堆叠 | 同时捕捉边缘、颜色、纹理 |

> AlexNet 第一层若用全连接需 1.05 亿参数，用卷积只有约 3.5 万——这就是 CNN 的工程根基。

<!--
局部连接指每个神经元只连接输入的一个小区域即感受野而非全部像素，参数量随核大小而非输入大小增长。参数共享指同一卷积核在整张特征图上滑动复用同一组权重，假设特征具有平移不变性从而大幅减参。多通道堆叠指一层用多个核学不同特征，输出在深度方向堆叠成特征图，同时捕捉边缘颜色纹理等多种模式。cs231n 实例：AlexNet 第一层若用全连接需 1.05 亿参数，用卷积只有约 3.5 万参数。
-->

---
transition: fade-out
---

# 卷积四超参与输出尺寸

```text
输出尺寸 = (输入 W - 核 F + 2*填充 P) / 步长 S + 1
```

| 配置 | F, S, P | 效果 |
| --- | --- | --- |
| **同型卷积** | 3, 1, 1 | 输出尺寸=输入尺寸，最常用 |
| **步长下采样** | 3, 2, 1 | 输出减半，替代池化 |
| **1×1 卷积** | 1, 1, 0 | 空间不变，做通道变换/降维 |

> 公式结果必须为整数，否则配置非法。`W=32, F=5, S=2, P=1` 得 15.5，PyTorch 会报错。

<!--
卷积层输出空间尺寸由四个超参决定：核大小 F、步长 S、零填充 P、空洞率 dilation，公式是输入减核加两倍填充除以步长加一。小核 3 乘 3 和 1 乘 1 是现代主流，大核只在网络入口偶尔用。步长 S 等于 1 最常见，S 等于 2 用于下采样替代池化。配 P 等于核减 1 除 2 可让输出尺寸等于输入尺寸即同型卷积，保持特征图对齐。公式结果必须是整数否则配置非法，PyTorch 会报错。空洞率大于 1 可在不增加参数前提下扩大感受野，常用于语义分割。
-->

---
layout: two-cols
---

# PyTorch 卷积层

```python
conv = nn.Conv2d(
    in_channels=3,        # RGB=3
    out_channels=64,      # 核个数
    kernel_size=3, stride=1, padding=1,
    dilation=1, bias=True,
)
maxpool = nn.MaxPool2d(2, 2)      # 尺寸减半
avgpool = nn.AdaptiveAvgPool2d((1, 1))  # 全局池化
```

::right::

<div class="pl-4">

## 维度约定

图像张量恒为 `[B, C, H, W]`（NCHW）

```python
x = torch.randn(1, 3, 224, 224)
y = conv(x)       # [1, 64, 224, 224]
y = maxpool(y)    # [1, 64, 112, 112]
```

> 常见错误：漏 batch 维或把 H/W 放在 Channel 前。

</div>

<!--
PyTorch 卷积层 nn.Conv2d 四超参加通道数：in_channels 是输入通道如 RGB 等于 3，out_channels 是卷积核个数即学多少种特征，kernel_size 常用 3 或 1，stride 和 padding 控制输出尺寸，dilation 默认 1 大于 1 扩大感受野。池化层 nn.MaxPool2d 2 乘 2 步长 2 最常用尺寸减半，nn.AdaptiveAvgPool2d 全局平均池化输出 1 乘 1。维度约定：PyTorch 图像张量永远是 Batch Channel Height Width 即 NCHW，常见错误是漏掉 batch 维或把 H W 放在 Channel 前。
-->

---
transition: fade-out
---

# 感受野与堆叠小核

**感受野**：一个神经元在原始输入上「看到」的区域大小。cs231n 强调堆叠小核优于大核。

```text
1 个 7×7 卷积：感受野 7×7，参数 49·C_in·C_out
3 个 3×3 卷积：感受野 7×7，参数 27·C_in·C_out  ← 参数少近一半，多了 3 次非线性
```

<v-clicks>

- **参数更少**：3 个 3×3（27 参数）比 1 个 7×7（49 参数）少
- **非线性更多**：每层后接 ReLU，3 个 3×3 有 3 次非线性，表达力更强
- **可堆叠扩感受野**：每加一层 3×3，感受野扩大 2

</v-clicks>

> 这是 VGG 的核心洞察：全用 3×3 堆叠到 16-19 层，用更少参数获更大感受野和更强表达力。

<!--
感受野指一个神经元在原始输入上看到的区域大小。cs231n 强调堆叠小卷积核比直接用大核更优。三个好处：参数更少，3 个 3 乘 3 共 27 个参数比 1 个 7 乘 7 的 49 个少；非线性更多，每层卷积后接 ReLU 三个 3 乘 3 有 3 次非线性表达力更强；可堆叠扩感受野，每加一层 3 乘 3 卷积感受野扩大 2。这是 VGG 网络的核心洞察：全部用 3 乘 3 卷积堆叠到 16 到 19 层，用更少参数获得更大感受野和更强表达力。
-->

---
transition: fade-out
---

# 经典架构演化

| 架构 | 年份 | 关键创新 | 参数 |
| --- | --- | --- | --- |
| **LeNet** | 1998 | 卷积+池化+全连接雏形 | 60K |
| **AlexNet** | 2012 | ReLU + Dropout + GPU | 60M |
| **VGG** | 2014 | 全 3×3 堆叠到 16-19 层 | 138M |
| **GoogLeNet** | 2014 | Inception 多尺度 + 1×1 降维 + GAP | 4M |
| **ResNet** | 2015 | 残差连接，152 层可训 | 60M |
| **EfficientNet** | 2019 | 复合缩放 + NAS | 5M~66M |

> AlexNet 三大贡献：ReLU 替代 Sigmoid、Dropout 正则化、GPU 训练——开启深度学习时代。

<!--
cs231n 用 case study 串联了 CNN 架构的演化脉络。LeNet 1998 年开创确立了卷积池化全连接的经典骨架。AlexNet 2012 年 ImageNet 大赛夺冠引爆深度学习，三大贡献是 ReLU 替代 Sigmoid 解决梯度饱和、Dropout 正则化抑制过拟合、双 GPU 训练证明大数据大模型大算力可行。VGG 2014 年证明全部用 3 乘 3 卷积堆叠到 16 到 19 层参数更少非线性更多。GoogLeNet 同年提出 Inception 多尺度并行加 1 乘 1 降维，仅 4M 参数达 SOTA，率先用全局平均池化替代末端全连接。ResNet 2015 年用残差连接突破上百层。EfficientNet 2019 年复合缩放加 NAS。
-->

---
transition: fade-out
---

# ResNet：残差连接

网络加深反而训不动（退化问题，非过拟合）。解法是**残差连接**：

```python
class ResidualBlock(nn.Module):
    def __init__(self, c):
        super().__init__()
        self.conv1 = nn.Conv2d(c, c, 3, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(c)
        self.conv2 = nn.Conv2d(c, c, 3, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(c)
    def forward(self, x):
        out = torch.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        return torch.relu(out + x)   # 关键：加上输入 x
```

> 梯度可通过 `+x` 捷径直通浅层，缓解梯度消失；网络只学「增量」`F(x)=y-x`，可训到 152 层，工业默认主干。

<!--
ResNet 2015 年的核心发现：网络加深反而训不动，这是退化问题不是过拟合。解法是残差连接即 skip connection，关键在于 y 等于 F x 加 x。梯度可通过加 x 这条捷径直通到浅层，缓解深层梯度消失。网络只需学增量 F x 等于 y 减 x，比直接学 y 更容易。ResNet 可训到 152 层，是工业界默认主干，torchvision.models 一行加载预训练权重。
-->

---
transition: fade-out
---

# 1×1 卷积与迁移学习

**1×1 卷积**不改变空间尺寸（每个像素独立），只在通道维做线性组合：

<v-clicks>

- **通道降维**：512→64，参数与计算量降 8 倍（Inception 瓶颈层）
- **通道升维**：低成本增加非线性表达（ResNet 瓶颈块）
- **跨通道融合**：等效逐像素全连接

</v-clicks>

```python
# 迁移学习：ImageNet 预训练主干 + 自定义分类头
model = torchvision.models.resnet18(weights="IMAGENET1K_V1")
for p in model.parameters(): p.requires_grad = False   # 冻结主干
model.fc = nn.Linear(model.fc.in_features, num_classes) # 替换分类头
```

> 数据少冻结主干只训头；数据中解冻最后几块；数据多全网络微调——CV 工程标准操作。

<!--
1 乘 1 卷积不改变空间尺寸每个像素独立，只在通道维做线性组合，三个核心用途：通道降维把 512 通道降到 64 参数与计算量降 8 倍，是 Inception 瓶颈层核心；通道升维低成本增加非线性表达是 ResNet 瓶颈块设计；跨通道信息融合等效逐像素全连接。迁移学习是 CV 工业实践标准：几乎不从头训 CNN，用 ImageNet 预训练主干加自定义分类头微调。数据少每类小于 100 张冻结主干只训头；数据中每类约 1000 解冻最后几块；数据多全网络微调。
-->

---
transition: fade-out
---

# 检测、分割与反模式

**语义分割**用编码器-解码器结构（U-Net/DeepLab）做像素级分类；**FPN** 自顶向下融合多尺度特征，目标检测标配。

<v-clicks>

- **反模式①**：第一层大步长大核 → 信息丢失，浅层学不到好特征
- **反模式②**：末端大全连接层 → 参数爆炸易过拟合，改用 GAP
- **反模式③**：不用 BatchNorm → 深层训练不稳定，每个 Conv 后加 BN 再 ReLU
- **反模式④**：从头训 ImageNet 级任务 → 算力浪费难收敛，用预训练迁移学习
- **反模式⑤**：忽略感受野计算 → 检测小物体漏检，堆叠深度或空洞卷积扩感受野

</v-clicks>

> 语义分割关键：空洞卷积扩大感受野 + 跳跃连接恢复边界精度（U-Net 灵魂）。

<!--
语义分割要求像素级分类，用编码器解码器结构，代表网络 U-Net 用对称编解码加 skip connection 拼接是医学影像标杆，DeepLab 用空洞卷积扩大感受野加 ASPP 多尺度是自然图像主流。FPN 特征金字塔通过自顶向下加横向连接融合多尺度特征，每个金字塔层都用同样强的语义特征做检测，小物体在大特征图检测大物体在小特征图检测，是 RetinaNet Mask R-CNN YOLOv3 等检测器的主干组件。反模式：第一层大步长大核信息丢失；末端大全连接参数爆炸改用 GAP；不用 BN 深层不稳；从头训 ImageNet 浪费算力；忽略感受野计算检测小物体漏检。
-->

---
layout: center
class: text-center
---

# 小结

CNN 靠局部连接、参数共享、平移不变性在图像上成为事实标准，归纳偏置让它数据效率优于 ViT。

**卷积池化 · 感受野 · ResNet 残差 · 1×1 降维 · 迁移学习**

[cs231n 卷积网络章节](https://cs231n.github.io/convolutional-networks/) · [torchvision 预训练模型](https://docs.pytorch.org/vision/stable/models.html)

<!--
总结：CNN 靠局部连接参数共享平移不变性三大设计在图像等空间网格数据上成为事实标准。即便 Vision Transformer 兴起，CNN 的归纳偏置即局部性加平移不变性在数据效率、小样本、移动端部署上仍不可替代。新项目默认用 ResNet50 或 EfficientNet-B0 作为基线主干，torchvision 一行加载预训练权重迁移学习即可。掌握卷积池化、感受野堆叠、ResNet 残差、1 乘 1 降维、迁移学习这五件套，就掌握了 CNN 工程实践的核心。谢谢大家。
-->
