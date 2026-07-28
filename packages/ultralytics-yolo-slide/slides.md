---
theme: seriph
background: https://cover.sli.dev
title: Ultralytics YOLO 完全指南
info: |
  Ultralytics YOLO 完全指南：YOLO API · 检测/分割/姿态 · 训练 · 推理 · 导出部署 · YOLO26

  Learn more at [https://docs.ultralytics.com](https://docs.ultralytics.com)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## Ultralytics YOLO

实时视觉模型家族 · 检测/分割/姿态/分类 · YOLO26

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
Ultralytics YOLO 是多任务统一的实时视觉框架，迭代最快。
-->

---
transition: fade-out
---

# YOLO 是什么

Ultralytics 维护的实时视觉模型家族与统一训练推理框架

- **多任务统一**：检测/分割/姿态/分类/OBB/深度
- **极简 API**：`YOLO("xxx.pt")` 一行加载
- **五大模式**：train / predict / val / export / track
- **anchor-free**：v8 起摆脱锚框先验
- **导出最全**：ONNX/TensorRT/CoreML 等 15+ 格式

> 最新代 **YOLO26**（2025-09），原生端到端 NMS-free

<!--
YOLO = 多任务统一 + 极简 API + 最全部署。
-->

---
layout: two-cols
---

# 三行推理

```python
from ultralytics import YOLO

# 1. 加载模型（首次自动下载）
model = YOLO("yolo11n.pt")

# 2. 推理（路径/ndarray/URL/视频）
results = model("bus.jpg")

# 3. 查看结果
for r in results:
    print(r.boxes.xyxy)    # [x1,y1,x2,y2]
    print(r.boxes.conf)    # 置信度
    print(r.boxes.cls)     # 类别 id
    r.save("out.jpg")      # 保存带标注图
```

::right::

# 任务后缀

| 任务 | 权重 | 字段 |
|------|------|------|
| 检测 | `yolo11n.pt` | boxes |
| 分割 | `-seg.pt` | masks |
| 姿态 | `-pose.pt` | keypoints |
| 分类 | `-cls.pt` | probs |
| OBB | `-obb.pt` | obb |

> 档位：n / s / m / l / x，精度算力递增。

<!--
三行推理 + 换权重后缀即可切换任务。
-->

---
layout: two-cols
---

# 模型档位（YOLO11）

| 模型 | mAP | 参数 | 速度 |
|------|-----|------|------|
| 11n | 39.5 | 2.6M | 1.5ms |
| 11s | 47.0 | 9.4M | 2.5ms |
| 11m | 51.5 | 20.1M | 4.7ms |
| 11l | 53.4 | 25.3M | 6.2ms |
| 11x | 54.7 | 56.9M | 11.3ms |

> imgsz=640，T4 TensorRT10。

::right::

# 第一个训练

```python
from ultralytics import YOLO

model = YOLO("yolo11n.pt")          # 迁移学习
model.train(
    data="coco8.yaml",              # 内置小数据集
    epochs=100, imgsz=640,
    batch=16, device=0,             # CPU 用 "cpu"
)
# 产物：runs/train/exp/weights/best.pt
```

> CLI：`yolo train model=yolo11n.pt data=coco8.yaml`

<!--
档位选 n/s 练手，生产用 m/l；coco8 跑通流程。
-->

---

# 数据集格式

每图一个 `.txt`，每行归一化坐标

```
# class x_center y_center width height（0-1）
0 0.512 0.430 0.235 0.476
2 0.318 0.618 0.108 0.244
```

```yaml
# mydata.yaml
path: /datasets/mydata
train: images/train
val: images/val
names:
  0: person
  1: bicycle
  2: car
```

> 分割标注每行多边形点；姿态标注额外含关键点。

<!--
COCO 格式 txt + yaml 配置是 YOLO 数据标准。
-->

---

# 训练参数与增强

```python
model.train(
    data="coco.yaml", epochs=300, imgsz=640, batch=16,
    optimizer="auto",            # auto/SGD/AdamW
    lr0=0.01, lrf=0.01,          # 余弦退火
    momentum=0.937, weight_decay=0.0005,
    mosaic=1.0,                  # 4 图拼接（标志增强）
    hsv_h=0.015, hsv_s=0.7, hsv_v=0.4,
    scale=0.5, translate=0.1, fliplr=0.5,
    box=7.5, cls=0.5, dfl=1.5,   # 损失权重
    patience=100,                # 早停
)
```

**经验法则**

- 小数据集（&lt;1k）优先迁移学习 + 强增强
- 显存不足：降 batch / imgsz，开 `half=True`
- CNN 上 SGD+momentum 常更稳

<!--
mosaic + hsv 是 YOLO 标志性增强；patience 早停防过拟合。
-->

---
layout: two-cols
---

# 推理与流处理

```python
results = model("img.jpg")       # 单图
results = model(["a.jpg","b.jpg"])  # 批量

# 视频/流（stream=True 逐帧，省内存）
for r in model.predict(source="video.mp4",
                      stream=True, save=True):
    boxes = r.boxes

# 摄像头
model(0, show=True)
```

**推理参数**

- `conf=0.25` 置信度阈值
- `iou=0.7` NMS IoU 阈值
- `half=True` FP16（GPU）
- `classes=[0,2]` 只留 person/car

::right::

# 目标跟踪

```python
# BoT-SORT（默认，精度高）
model.track(source="v.mp4",
           tracker="botsort.yaml")

# ByteTrack（更快）
model.track(source="v.mp4",
           tracker="bytetrack.yaml")

# 每帧含 track id
for r in model.track(source="v.mp4",
                    stream=True):
    if r.boxes.id is not None:
        print(r.boxes.id.int())
```

> 跟踪 = 检测 + 跨帧关联。

<!--
stream=True 处理长视频；track 加 ID 做计数。
-->

---

# 导出与部署

```python
# ONNX（通用，CPU/GPU 都行）
model.export(format="onnx", imgsz=640,
            dynamic=True, simplify=True)

# TensorRT（NVIDIA 最快，5x 提速）
model.export(format="engine", device=0, half=True)

# 其他
model.export(format="coreml")     # Apple
model.export(format="openvino")   # Intel CPU 3x
model.export(format="tflite")     # 移动端/Edge TPU
model.export(format="ncnn")       # 移动端 Vulkan
```

**加载导出模型**：直接 `YOLO("best.onnx")`，API 与 `.pt` 一致。

> TensorRT 编译机与目标机架构需匹配。

<!--
导出格式最全是 Ultralytics 的核心优势。
-->

---
layout: quote
---

# 三行 API 的力量

「YOLO(weights) → train/predict/export，一行加载、三件套覆盖 90% 工作流，这就是 Ultralytics 把目标检测门槛打到地板的全部秘诀。」

---

# 架构演进

| 版本 | 年份 | 关键革新 |
|------|------|------|
| YOLOv8 | 2023 | anchor-free + 解耦头 |
| YOLO11 | 2024 | 参数减 22% 精度更高 |
| YOLO12 | 2025 | 区域注意力（A2） |
| YOLO26 | 2025-09 | 原生 NMS-free 端到端 |

**YOLO26 三大革新**

- **原生 NMS-free**：one-to-one 头，推理无后处理
- **双头训练**：one-to-one 推理 + one-to-many 辅助
- **去除 DFL**：简化 box 回归

> CPU ONNX 较 YOLO11n 提速最高 **43%**。

<!--
YOLO26 端到端是部署侧的重大进步，NMS 不再需要。
-->

---
layout: center
class: text-center
---

# 小结

Ultralytics YOLO = 多任务统一 + 极简 API

**anchor-free · train/predict/export · 15+ 导出格式 · YOLO26**

[Ultralytics 文档](https://docs.ultralytics.com) · [YOLO26 模型页](https://docs.ultralytics.com/models/yolo26/) · [GitHub](https://github.com/ultralytics/ultralytics)

<!--
极简 API + 多任务 + 最全部署 = YOLO 统治实时视觉。
-->
