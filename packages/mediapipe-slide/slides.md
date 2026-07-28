---
theme: seriph
background: https://cover.sli.dev
title: MediaPipe 完全指南
info: |
  MediaPipe 完全指南：Tasks API · 关键点检测 · 运行模式 · 多后端加速 · Legacy 迁移

  Learn more at [https://developers.google.com/edge/mediapipe](https://developers.google.com/edge/mediapipe)
drawings:
  persist: false
transition: slide-left
mdc: true
---

## MediaPipe

Google 端侧跨平台 ML 框架 · Tasks API · 0.10.35

<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10">
  Press Space for next page <carbon:arrow-right />
</div>

<div class="abs-br m-6 text-xl">
  <a href="https://github.com/IllegalCreed/SlideStack" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

<!--
MediaPipe 是 Google 端侧感知类模型的事实框架。
-->

---
transition: fade-out
---

# MediaPipe 是什么

Google Research 开发的端侧（on-device）跨平台 ML 框架

- **端侧低延迟**：手机上 30+ FPS，无需云端往返
- **Tasks API**：开箱即用的预训练 Solution
- **跨平台一致**：Android/iOS/Web/Python/C++ 五端
- **多后端加速**：GPU/NNAPI/Core ML/Delegate
- **隐私友好**：推理在本地，图像不离开设备

> 最新版 **0.10.35**（2026-04），google-ai-edge 维护

<!--
MediaPipe = 端侧 + Tasks API + 跨平台一致。
-->

---

# Tasks API 三步范式

所有 Vision Task 都遵循同一套范式

```python
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# 1. BaseOptions（模型路径 + 设备）
base = python.BaseOptions(model_asset_path='hand_landmarker.task')

# 2. Task 专属 Options
options = vision.HandLandmarkerOptions(
    base_options=base,
    running_mode=vision.RunningMode.IMAGE, num_hands=2)

# 3. create_from_options（推荐 with 管理资源）
with vision.HandLandmarker.create_from_options(options) as lm:
    result = lm.detect(mp.Image.create_from_file('hand.jpg'))
    print(result.hand_landmarks)   # 每手 21 个关键点
```

> 模型用 `.task` 格式（含模型 + 元数据 + 标签）。

<!--
BaseOptions → Options → create_from_options 是万能模板。
-->

---
layout: two-cols
---

# 三种运行模式

| 模式 | 输入 | 方法 | 阻塞 |
|------|------|------|------|
| IMAGE | 单图 | detect | 是 |
| VIDEO | 视频帧 | detect_for_video | 是 |
| LIVE_STREAM | 实时流 | detect_async | 否 |

> 模式必须与 detect 方法匹配。

::right::

# LIVE_STREAM 回调

```python
def cb(result, output_image, ts):
    print(ts, result.hand_landmarks)

options = vision.HandLandmarkerOptions(
    base_options=base,
    running_mode=vision.RunningMode.LIVE_STREAM,
    result_callback=cb,
)
with vision.HandLandmarker.create_from_options(
        options) as lm:
    # 配 OpenCV 读摄像头流
    lm.detect_async(mp_img, ts_ms)
```

> 流式需提供 timestamp_ms。

<!--
IMAGE/VIDEO/STREAM 三模式覆盖静态到实时全场景。
-->

---
layout: two-cols
---

# mp.Image 与 numpy

```python
import cv2, mediapipe as mp

img = cv2.imread('a.jpg')                  # BGR
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # 必须转 RGB！
mp_image = mp.Image(
    image_format=mp.ImageFormat.SRGB,
    data=img_rgb)

# mp.Image → numpy（共享内存）
ndarray = mp_image.numpy_view()            # HWC RGB
```

::right::

# 关键点 Tasks

| Task | 关键点 |
|------|--------|
| FaceLandmarker | 478（含瞳孔） |
| HandLandmarker | 每手 21 |
| PoseLandmarker | 全身 33 |
| Holistic | Face+Pose+Hands |

> Holistic 单次推理输出三者。

<!--
RGB/BGR 转换是 MediaPipe + OpenCV 的最大坑。
-->

---

# 关键点检测

```python
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

base = python.BaseOptions(model_asset_path='pose_landmarker.task')
opts = vision.PoseLandmarkerOptions(
    base_options=base, num_poses=1,
    output_segmentation_masks=True,
)
with vision.PoseLandmarker.create_from_options(opts) as lm:
    res = lm.detect(mp_image)
    # res.pose_landmarks: 每人 33 个点（归一化 0-1）
    # res.pose_world_landmarks: 真实 3D 坐标（米）
    # res.segmentation_masks: 前景掩码
```

**应用**：健身计数、动作矫正、AR 试妆、虚拟主播、手语翻译。

> FaceLandmarker 还可输出 52 个 blendshapes（表情系数）。

<!--
关键点检测是 MediaPipe 最强项，移动端实时。
-->

---

# 检测/分类/分割/手势

```python
# 目标检测
opts = vision.ObjectDetectorOptions(base_options=base,
    max_results=5, score_threshold=0.5,
    category_allowlist=['person', 'car'])
res = det.detect(mp_image)   # res.detections[].bounding_box

# 图像分类
res = clf.classify(mp_image) # res.classifications[].categories

# 图像分割
opts = vision.ImageSegmenterOptions(base_options=base,
    output_category_mask=True, output_confidence_masks=True)
res = seg.segment(mp_image)  # res.category_mask

# 手势识别（内置 Thumb_Up/Victory 等）
res = rec.recognize(mp_image) # res.gestures
```

> ObjectDetector 支持 EfficientDet-Lite / SSD-MobileNet。

<!--
检测/分类/分割/手势共用同一三步范式。
-->

---

# GPU 加速

通过 BaseOptions 的 delegate 切换 CPU/GPU

```python
from mediapipe.tasks import python

# CPU（桌面 Python 默认，多数场景已够实时）
base = python.BaseOptions(model_asset_path='m.task')

# GPU（移动端常用，桌面需 OpenGL 支持）
base = python.BaseOptions(
    model_asset_path='m.task',
    delegate=python.BaseOptions.Delegate.GPU,
)
```

**多后端**

- Android：NNAPI / GPU(OpenGL ES)
- iOS：Core ML / Metal
- 桌面 Python：通常 CPU（GPU 支持有限）

> 移动端 Android/iOS 默认走 GPU/NNAPI/Core ML。

<!--
delegate 机制让同一份代码跨后端加速。
-->

---
layout: quote
---

# 端侧感知的统一范式

「BaseOptions + Options + create_from_options，一份模型 + 一套 Tasks API + 五端一致，这就是 MediaPipe 把端侧感知门槛打到最低的全部秘诀。」

---

# MediaPipe vs OpenCV vs YOLO

| 维度 | MediaPipe | OpenCV | YOLO |
|------|-----------|--------|------|
| **定位** | 端侧感知 Solution | CV 算法库 | 检测/分割框架 |
| **模型** | 预训练开箱即用 | DNN 仅推理 | 需训练/导出 |
| **关键点** | 最强（Face/Hand/Pose） | 弱 | 姿态可选 |
| **部署** | 移动端/Web 强 | 全平台 | 端到云 |
| **自定义** | 门槛高（Model Maker） | 灵活 | 极灵活 |

> MediaPipe 强在开箱即用的端侧感知，弱在自定义训练。

<!--
三者互补：MediaPipe 端侧感知，OpenCV 算法底座，YOLO 训练自由。
-->

---
layout: center
class: text-center
---

# 小结

MediaPipe = 端侧 + Tasks API + 跨平台

**三步范式 · 关键点检测 · 三种模式 · Legacy 已退役**

[MediaPipe 文档](https://developers.google.com/edge/mediapipe) · [Legacy 迁移](https://developers.google.com/edge/mediapipe/migration/legacy_solutions) · [GitHub](https://github.com/google-ai-edge/mediapipe)

<!--
端侧感知开箱即用，注意 mp.solutions.* 已退役。
-->
