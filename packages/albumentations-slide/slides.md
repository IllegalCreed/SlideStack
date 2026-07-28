---
theme: seriph
background: https://cover.sli.dev
title: Albumentations 完全指南
info: |
  Albumentations 完全指南：Compose · OneOf · 多目标同步 · BboxParams · KeypointParams · 自定义变换

  Learn more at [https://albumentations.ai](https://albumentations.ai)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Albumentations

快速数据增强库 · 多目标同步 · 50+ 变换 · OpenCV 底层

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Albumentations 主打快速、广覆盖、多目标同步增强。
-->

---
transition: fade-out
---

# Albumentations 是什么

Albumentations-Team 维护的开源 CV 数据增强库

- **多目标同步增强**：一条管线同时处理 image/mask/bboxes/keypoints
- **50+ 种变换**：翻转/旋转/颜色/模糊/形变/裁剪/丢弃
- **性能优于 torchvision.transforms**：OpenCV + NumPy 底层
- **当前主线包**：`albumentationsx`（原 `albumentations` 归档）
- **几何变换自动同步**：翻转图像时掩码/框/点同步翻转

> `pip install albumentationsx`，import 名仍为 `albumentations`

<!--
多目标同步是 Albumentations 的杀手锏。
-->

---

# 核心三件套

Transform（单个变换）/ Compose（串接）/ OneOf（随机选一种）

```python
import albumentations as A
import cv2
image = cv2.cvtColor(cv2.imread('cat.jpg'), cv2.COLOR_BGR2RGB)
transform = A.Compose([
    A.HorizontalFlip(p=0.5),           # 50% 概率水平翻转
    A.RandomBrightnessContrast(p=0.2), A.Rotate(limit=30, p=0.5),
])
augmented = transform(image=image)['image']  # 返回字典，不是数组
```

- 每个变换带 `p`（0–1）控制触发概率
- `OneOf([...])` 从组内随机选一种执行
- `SomeOf(n, [...])` 随机选 n 种

> 铁律：transform() 返回**字典**，必须取 `['image']`

<!--
Compose 串接，p 控概率，返回字典是新手第一坑。
-->

---

# Compose / OneOf / SomeOf

```python
transform = A.Compose([
    A.HorizontalFlip(p=0.5),
    A.OneOf([                          # 随机选一种
        A.MotionBlur(p=1), A.MedianBlur(p=1),
        A.GaussianBlur(p=1)], p=0.3),  # OneOf 整体 30%
    A.RandomBrightnessContrast(p=0.3),
    A.Normalize(mean=(0.485,0.456,0.406), std=(0.229,0.224,0.225)),
])
```

- `Compose`：按声明顺序串接，前者输出是后者输入
- `OneOf`：组内选**一种**（适合同类增强择一）
- `SomeOf(n, [...])`：组内选 **n 种**
- 容器都可设 `p` 控制整体触发

> `OneOrOther(A, B, p)` 二选一带条件

<!--
三种容器表达复杂增强策略。
-->

---

# 多目标同步：图像 + 掩码

分割任务：几何变换在图像与掩码上完全同步

```python
image = cv2.imread('img.png')
mask = cv2.imread('mask.png', cv2.IMREAD_GRAYSCALE)
transform = A.Compose([
    A.RandomCrop(256, 256), A.HorizontalFlip(p=0.5),
    A.Rotate(limit=45, p=0.7),
])
result = transform(image=image, mask=mask)
aug_mask = result['mask']     # 翻转/裁剪与图像同步
```

> 不必手写坐标同步逻辑，Compose 自动保持一致

<!--
图像与掩码同步变换是分割任务的刚需。
-->

---

# 多目标同步：图像 + 边界框

检测任务：声明 BboxParams 指定坐标格式

```python
bboxes = [[10, 20, 100, 150], [200, 50, 280, 200]]
labels = ['cat', 'dog']
transform = A.Compose([
    A.HorizontalFlip(p=0.5), A.RandomBrightnessContrast(p=0.2),
], bbox_params=A.BboxParams(
    format='pascal_voc', label_fields=['labels']))  # [x_min,y_min,x_max,y_max]
result = transform(image=image, bboxes=bboxes, labels=labels)
aug_bboxes = result['bboxes']     # 框坐标已同步更新
```

> format 必须与数据实际格式一致，否则框错位

<!--
BboxParams 声明格式，框坐标随几何变换自动更新。
-->

---

# bbox 与 keypoint 格式

**bbox**：`pascal_voc`(绝对 xmin/ymin/xmax/ymax) / `coco`(绝对 xmin/ymin/w/h) / `yolo`(归一化 xc/yc/w/h) / `albumentations`(归一化 xmin/ymin/xmax/ymax)

**keypoint**：`xy`([x,y]) / `xya`([x,y,angle]) / `xys`([x,y,scale]) / `xyas`(全)

```python
A.Compose([transform],
  bbox_params=A.BboxParams(format='coco', label_fields=['labels']),
  keypoint_params=A.KeypointParams(format='xya'))
```

> 四种 bbox + 五种 keypoint 格式覆盖主流标注约定。
-->

---

# BboxParams 进阶：过滤

```python
transform = A.Compose([
    A.RandomCrop(256, 256), A.HorizontalFlip(p=0.5),
], bbox_params=A.BboxParams(
    format='coco', label_fields=['class_labels'],
    min_area=100,            # 丢弃面积 < 100 像素的框
    min_visibility=0.3))     # 丢弃可见比 < 30% 的框
```

- `min_area`：变换后面积过小的框直接丢弃
- `min_visibility`：裁剪后只剩一部分的框，剩余比 < 阈值则丢
- 避免无效小残框污染训练

> KeypointParams 的 `remove_invisible=True` 丢弃越界点

<!--
min_area/min_visibility 过滤变换后的无效小框。
-->

---

# 常用变换分类

| 类别 | 变换 |
|------|------|
| 几何 | HorizontalFlip, Rotate, ShiftScaleRotate, RandomResizedCrop |
| 颜色 | RandomBrightnessContrast, HueSaturationValue, ColorJitter |
| 模糊/形变 | GaussianBlur, MotionBlur, ElasticTransform |
| 丢弃/数值 | CoarseDropout, Cutout, Normalize, ToTensor |

共 **50+ 种**变换，覆盖空间几何/像素颜色/模糊/形变/裁剪/丢弃。

> ElasticTransform 需 scipy，部分变换需 scikit-image

<!--
六大类变换覆盖几乎全部常用增强需求。
-->

---

# 自定义变换

继承 ImageOnlyTransform（仅图像）或 DualTransform（多目标）

```python
import numpy as np

class RandomAdd(A.ImageOnlyTransform):
    def __init__(self, value=10, p=0.5):
        super().__init__(p=p); self.value = value
    def apply(self, img, **params):
        return np.clip(img.astype(np.int32) + self.value, 0, 255).astype(np.uint8)
```

- `ImageOnlyTransform`：只实现 `apply`
- `DualTransform`：分别实现 `apply_to_image/mask/bbox/keypoint`

> DualTransform 保证几何变换在所有目标上一致

<!--
两种基类分别对应仅图像与多目标场景。
-->

---

# 性能调优

OpenCV + NumPy 底层，以下手段进一步提升速度

```python
# ① Compose 启用多线程（部分变换受益）
transform = A.Compose([...], num_threads=4)
# ② 关闭 OpenCV 全局线程（避免与 DataLoader 冲突）
cv2.setNumThreads(0); cv2.ocl.setUseOpenCL(False)
# ③ DataLoader 用 num_workers > 0 让增强并行
loader = DataLoader(dataset, batch_size=32, num_workers=8, shuffle=True)
```

- 高分辨率图先 Resize 再做重变换（如 ElasticTransform）
- `ToFloat(max_value=255)` 提前转 float32 可让部分变换更快

> 未关 cv2 线程：多 worker 下线程竞争会拖慢

<!--
num_threads + 关 cv2 线程 + num_workers 是性能三板斧。
-->

---

# Albumentations vs torchvision

| 维度 | Albumentations | torchvision.transforms |
|------|------|------|
| 多目标同步 | image+mask+bbox+keypoint | 主要面向 image |
| 变换种类 | 50+，含 Dropout/形变 | 数十个，偏基础 |
| API 风格 | Compose 返回 dict | callable 流式 |
| 维护 | 活跃（AlbumentationsX） | PyTorch 官方 |

> imgaug 维护停滞，Albumentations 是现代替代首选

<!--
Albumentations 多目标同步 + 变换全 + 性能优。
-->

---
layout: center
class: text-center
---

# 小结

Albumentations = Compose + 多目标同步 + 50+ 变换

**几何同步 · 概率控制 · 格式声明 · OpenCV 加速**

[文档](https://albumentations.ai/docs/) · [GitHub](https://github.com/albumentations-team/albumentations)

<!--
多目标同步是 Albumentations 的核心价值。
-->
